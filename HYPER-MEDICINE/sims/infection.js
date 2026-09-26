/* HYPER-MEDICINE · sims/infection.js — simulations for Infection and Infectious Disease:
 * bacteria growing in a flask, an antibiotic course with resistant mutants, an SIR epidemic
 * with distancing and vaccination (kit.med.sir), spread on a contact network with
 * superspreading, the viral replication cycle and where antivirals act, vaccine
 * effectiveness and the base-rate trap, HIV over twenty years with and without treatment,
 * and malaria passing between mosquitoes and people. All numbers are illustrative models,
 * not clinical predictions. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const sup = n => String(n).split('').map(ch => ch === '-' ? '⁻' : (SUPD[+ch] || ch)).join('');
  function sci(v, sig) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const s = sig || 2;
    let e = Math.floor(Math.log10(Math.abs(v)));
    let m = +(v / Math.pow(10, e)).toFixed(s - 1);
    if (Math.abs(m) >= 10) { m = +(m / 10).toFixed(s - 1); e += 1; }
    if (e === 0) return m.toFixed(s - 1);
    return m.toFixed(s - 1) + ' × 10' + sup(e);
  }
  // a count: 12,345 below a hundred thousand, 5.0 × 10⁹ above
  function big(v) {
    if (!Number.isFinite(v)) return '—';
    if (Math.abs(v) < 1e5) return Math.round(v).toLocaleString('en-US');
    return sci(v, 2);
  }
  const pc = (f, d) => Number.isFinite(f) ? (f * 100).toFixed(d == null ? 0 : d) + ' %' : '—';
  function shuffled(n, U) {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(U() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // a graph under the scene
  function graphBox(box) {
    const g = document.createElement('div');
    g.style.padding = '4px 10px 10px';
    box.stage.appendChild(g);
    return g;
  }
  // gamma and Poisson random numbers from seeded uniform and normal sources
  function gammaRand(k, theta, U, Nn) {
    if (k < 1) return gammaRand(k + 1, theta, U, Nn) * Math.pow(Math.max(1e-12, U()), 1 / k);
    const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
    for (let it = 0; it < 200; it++) {
      const x = Nn(), v0 = 1 + c * x;
      if (v0 <= 0) continue;
      const v = v0 * v0 * v0, u = Math.max(1e-300, U());
      if (u < 1 - 0.0331 * x * x * x * x || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * theta;
    }
    return k * theta;
  }
  function poissonRand(lam, U, Nn) {
    if (!(lam > 0)) return 0;
    if (lam > 30) return Math.max(0, Math.round(lam + Math.sqrt(lam) * Nn()));
    const L = Math.exp(-lam);
    let k = 0, p = 1;
    do { k++; p *= U(); } while (p > L && k < 400);
    return k - 1;
  }
  function topShare(arr) {
    const a = arr.slice().sort((x, y) => y - x), tot = a.reduce((s, v) => s + v, 0);
    if (!a.length || tot <= 0) return NaN;
    const m = Math.max(1, Math.ceil(a.length * 0.2));
    return a.slice(0, m).reduce((s, v) => s + v, 0) / tot;
  }

  /* ================================================================ 1 · bacterial growth */
  Hyper.sim('inf-growth', {
    title: 'Bacteria growing in a flask',
    blurb: `One kind of bacterium growing in a flask of warm broth. The graph is on a logarithmic scale, where steady doubling is a straight line; the microscope shows a field of about a ten-millionth of a millilitre.

- Watch the four phases: **lag** (the cells adapt), **exponential** growth, **stationary** (the food runs out) and **death**.
- The broth stays clear until roughly ten million bacteria per millilitre: almost all the visible change happens in the last few doublings.
- Halve the doubling time: the exponential part takes half as long, but the lag does not change.
- Untick the log scale to see why exponential growth seems to come from nowhere.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 210 });
      const plot = kit.plot(graphBox(box), { x: { label: 'time (hours)', min: 0 }, y: { label: 'bacteria per mL', log: true } }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'td', label: 'Doubling time', min: 10, max: 180, step: 1, value: 20, unit: 'min' },
        { id: 'lag', label: 'Lag phase', min: 0, max: 6, step: 0.1, value: 1.5, unit: 'h' },
        { id: 'n0', label: 'Bacteria at the start', min: 1, max: 1e6, value: 100, log: true, sig: 2, fmt: v => big(v) + ' per mL' },
        { id: 'K', label: 'Most the broth can feed', min: 1e7, max: 1e10, value: 2e9, log: true, sig: 2, fmt: v => sci(v) + ' per mL' },
        { id: 'log', type: 'check', label: 'Logarithmic scale', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Grow again', primary: true }] }
      ], id => { if (id === 'go') t = 0; build(); });
      const ro = kit.readout(box.side, [['t', 'Time'], ['n', 'Bacteria'], ['d', 'Doublings so far'], ['ph', 'Phase'], ['m', 'A million per mL after']]);
      const V = ctl.values;
      const rnd = kit.fin.uniforms(5);
      const rods = Array.from({ length: 240 }, () => ({ x: rnd(), y: rnd(), a: rnd() * Math.PI }));
      let t = 0, T = 24, pts = [], lag = 0, tEx = null, nMax = 1, tMil = null, N0 = 100;
      function build() {
        const mu = Math.LN2 / (V.td / 60), K = V.K;
        N0 = Math.min(V.n0, K / 10); lag = V.lag;
        const eml = Math.exp(mu * lag) - 1;
        const tExp = lag + Math.log2(K / N0) * V.td / 60;
        T = clamp(Math.ceil((tExp + 10) / 4) * 4, 12, 72);
        const n = 3000, dt = T / n;
        let N = N0, S = K - N0;
        tEx = null; tMil = null; nMax = N0; pts = [];
        for (let i = 0; i <= n; i++) {
          const tt = i * dt;
          if (i % 5 === 0) pts.push([tt, N]);
          if (tMil == null && N >= 1e6) tMil = tt;
          if (N > nMax) nMax = N;
          const alpha = 1 / (1 + eml * Math.exp(-mu * tt));          // Baranyi's lag: the cells adapt first
          const grow = mu * alpha * S / (S + 0.02 * K) * N;
          if (tEx == null && S < 0.01 * K) tEx = tt;
          const die = tEx == null ? 0 : 0.15 * Math.min(1, (tt - tEx) / 4) * N;
          N = Math.max(1, N + (grow - die) * dt);
          S = Math.max(0, S - grow * dt);
        }
        if (t > T) t = T;
        plot.set({
          x: { label: 'time (hours)', min: 0, max: T },
          y: V.log ? { label: 'bacteria per mL (log scale)', log: true, min: Math.max(0.5, N0 / 5), max: K * 4 } : { label: 'bacteria per mL', min: 0, max: nMax * 1.08, fmt: v => sci(v, 1) }
        });
      }
      function at(time) {
        if (!pts.length) return N0;
        const f = clamp(time / T, 0, 1) * (pts.length - 1), i = Math.floor(f), j = Math.min(pts.length - 1, i + 1), w = f - i;
        return Math.exp(Math.log(pts[i][1]) * (1 - w) + Math.log(pts[j][1]) * w);
      }
      function phase(time) {
        if (time < lag * 0.85) return ['lag', 'lag: the cells adapt and hardly divide'];
        if (tEx == null || time < tEx) return ['exp', 'exponential: doubling every ' + Math.round(V.td) + ' min'];
        if (time < tEx + 3) return ['stat', 'stationary: the food has run out'];
        return ['death', 'death: starving cells die'];
      }
      function draw(dt) {
        t = Math.min(T, t + (dt || 0) * T / 14);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const N = at(t), ph = phase(t);
        // the flask, cloudier as the bacteria multiply
        const bw = Math.min(130, W * 0.17), fx = 16 + bw / 2, fb = Hh - 16, fh = Math.min(Hh - 44, 170), nw = bw * 0.28;
        const top = fb - fh, shoulder = fb - fh * 0.55;
        const path = () => {
          c.beginPath(); c.moveTo(fx - nw / 2, top); c.lineTo(fx - nw / 2, shoulder); c.lineTo(fx - bw / 2, fb - 8);
          c.quadraticCurveTo(fx - bw / 2, fb, fx - bw / 2 + 8, fb); c.lineTo(fx + bw / 2 - 8, fb);
          c.quadraticCurveTo(fx + bw / 2, fb, fx + bw / 2, fb - 8); c.lineTo(fx + nw / 2, shoulder); c.lineTo(fx + nw / 2, top);
        };
        const cloud = clamp(Math.log10(N / 1e7) / 2, 0, 1);
        const ly = fb - fh * 0.42;
        c.save(); path(); c.clip();
        c.fillStyle = kit.hue(45, 0.18); c.fillRect(fx - bw, ly, bw * 2, fb - ly + 2);
        c.fillStyle = kit.hue(40, 0.85 * cloud); c.fillRect(fx - bw, ly, bw * 2, fb - ly + 2);
        c.restore();
        path(); c.strokeStyle = C.text2; c.lineWidth = 2; c.stroke();
        kit.label(c, cloud < 0.05 ? 'looks clear' : cloud < 0.6 ? 'turning cloudy' : 'cloudy', fx, top - 12, { size: 11.5, color: C.muted, align: 'center' });
        // the microscope field (left out on narrow screens)
        const mr = W < 600 ? 0 : Math.min(80, Hh * 0.33), mx = fx + bw / 2 + 22 + mr, my = Hh * 0.47;
        if (mr > 0) {
          c.save(); c.beginPath(); c.arc(mx, my, mr, 0, Math.PI * 2); c.fillStyle = C.surface; c.fill(); c.clip();
          const shown = Math.min(rods.length, Math.round(N * 1e-7));
          c.strokeStyle = kit.hue(275); c.lineWidth = 3.2; c.lineCap = 'round';
          for (let i = 0; i < shown; i++) {
            const r = rods[i], x = mx - mr + r.x * 2 * mr, y = my - mr + r.y * 2 * mr, ca = Math.cos(r.a) * 3.5, sa = Math.sin(r.a) * 3.5;
            c.beginPath(); c.moveTo(x - ca, y - sa); c.lineTo(x + ca, y + sa); c.stroke();
          }
          c.restore(); c.lineCap = 'butt';
          c.beginPath(); c.arc(mx, my, mr, 0, Math.PI * 2); c.strokeStyle = C.border2; c.lineWidth = 3; c.stroke();
          kit.label(c, 'under the microscope', mx, my + mr + 13, { size: 11, color: C.muted, align: 'center' });
        }
        // the phases and the count
        const px0 = mr > 0 ? mx + mr + 24 : fx + bw / 2 + 20, px1 = W - 12, pw = Math.max(40, (px1 - px0) / 4);
        [['lag', 'Lag'], ['exp', 'Exponential'], ['stat', 'Stationary'], ['death', 'Death']].forEach(([k, lab], i) => {
          const on = ph[0] === k, x = px0 + i * pw;
          c.fillStyle = on ? kit.hue(275, 0.22) : C.bg2; c.fillRect(x + 2, 16, pw - 4, 26);
          c.strokeStyle = on ? kit.hue(275) : C.border; c.lineWidth = on ? 2 : 1; c.strokeRect(x + 2, 16, pw - 4, 26);
          kit.label(c, lab, x + pw / 2, 29, { size: 11, align: 'center', baseline: 'middle', weight: on ? 650 : 400, color: on ? C.text : C.muted });
        });
        kit.label(c, big(N) + ' per mL', px0 + 2, 72, { size: 20, weight: 650 });
        kit.label(c, 'after ' + t.toFixed(1) + ' h · ' + Math.max(0, Math.log2(N / N0)).toFixed(1) + ' doublings', px0 + 2, 100, { size: 12.5, color: C.text2 });
        kit.label(c, ph[1], px0 + 2, 122, { size: 12, color: C.muted });
        // the graph
        const so = pts.filter(p => p[0] <= t);
        so.push([t, N]);
        plot.set({
          series: [{ pts, color: C.faint, dash: [4, 4], width: 1.4, label: 'the whole run' }, { pts: so, color: kit.hue(275), label: 'so far' }],
          marks: [{ x: t, y: N, color: kit.hue(275) }],
          vlines: tEx != null ? [{ x: tEx, label: 'food runs out' }] : [],
          hlines: V.log ? [{ y: 1e7, label: 'cloudiness starts to show' }] : []
        });
        ro.set('t', t.toFixed(1) + ' h of ' + T + ' h');
        ro.set('n', big(N) + ' per mL');
        ro.set('d', Math.max(0, Math.log2(N / N0)).toFixed(1));
        ro.set('ph', ph[1]);
        ro.set('m', tMil == null ? 'not reached in this run' : tMil.toFixed(1) + ' h');
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2 · an antibiotic course */
  // illustrative in-body numbers: growth and killing per hour, MICs in mg/L
  const ABX = { g: 0.15, gR: 0.13, K: 2e10, Nh: 1e6, iOk: 0.5, iWeak: 0.05, micS: 1, micR: 8, emax: 0.3, hill: 2.5, half: 2, tau: 8,
    N0: 5e9, fR: 1e-6, peakB: 8, micB: 1, days: 16, ill: 8.5 };
  function abxRun(o) {
    const A = ABX, dt = 0.02, kf = Math.LN2 / A.half, imm0 = o.immune === 'weak' ? A.iWeak : A.iOk;
    const kill = (c, mic) => { const x = Math.pow(Math.max(c, 0) / mic, A.hill); return A.emax * x / (1 + x); };
    let S = A.N0 * (1 - A.fR), R = A.N0 * A.fR, C = 0, CB = 0, sym = Math.log10(A.N0), better = null, last = -1, taken = 0, planned = 0;
    const out = [], every = Math.round(0.25 / dt), steps = Math.round(A.days * 24 / dt);
    for (let s = 0; s <= steps; s++) {
      const t = s * dt, k = Math.round(t / A.tau);
      if (k !== last && Math.abs(t - k * A.tau) < dt / 2) {
        last = k;
        if (t < o.days * 24 - 1e-6) {
          planned++;
          let give = true;
          if (o.adh === 'miss' && k % 4 === 3) give = false;
          if (o.adh === 'half' && k % 2 === 1) give = false;
          if (o.adh === 'stop' && better != null) give = false;
          if (give) { C += o.peak; if (o.combo) CB += A.peakB; taken++; }
        }
      }
      if (s % every === 0) out.push({ d: t / 24, S, R, C, CB, sym });
      const N = S + R, room = 1 - N / A.K, imm = imm0 / (1 + N / A.Nh), kB = o.combo ? kill(CB, A.micB) : 0;
      S += S * (A.g * room - kill(C, A.micS) - kB - imm) * dt;
      R += R * (A.gR * room - kill(C, A.micR) - kB - imm) * dt;
      if (S < 0.5) S = 0;
      if (R < 0.5) R = 0;
      C *= Math.exp(-kf * dt); CB *= Math.exp(-kf * dt);
      sym += (Math.log10(Math.max(S + R, 1)) - sym) * dt / 12;       // symptoms follow the bacteria with a delay
      if (better == null && sym < A.ill && t > 1) better = t;
    }
    const end = out[out.length - 1];
    const outcome = end.S + end.R < 1 ? 'cured' : end.R > end.S ? 'resistant' : 'relapse';
    return { out, taken, planned, outcome };
  }
  Hyper.sim('inf-antibiotic', {
    title: 'An antibiotic course and resistant mutants',
    blurb: `A model infection of about five billion bacteria, one in a million of which carries a mutation that makes it partly resistant (its MIC is 8 mg/L instead of 1). Blue dots are ordinary bacteria, red dots the mutants; the number of dots grows with the logarithm of the count. The drug and all the numbers are illustrative.

- Run the default course: the patient feels better within about a day, the bacteria are gone by day 3, and the immune system mops up the few mutants.
- Choose **Stops as soon as feeling better**: the bacteria have fallen, but not far enough, and the infection comes back.
- Lower the **dose** to about 6 mg/L: the level now sits in the *mutant selection window* between the two MICs — the ordinary bacteria die and the mutants take over.
- Choose **Misses every other dose**, or a **weakened** immune system: resistance again. Then tick **Add a second drug**: a bacterium would need two mutations at once, and the combination cures — the logic of treating tuberculosis and HIV.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const gb = graphBox(box);
      const pb = kit.plot(gb, { x: { label: 'day', min: 0, max: ABX.days }, y: { label: 'bacteria (log scale)', log: true, min: 1, max: 1e11 } }, 190);
      const pd = kit.plot(gb, { x: { label: 'day', min: 0, max: ABX.days }, y: { label: 'drug level (mg/L)', min: 0, max: 30 } }, 140);
      const ctl = kit.controls(box.side, [
        { id: 'peak', label: 'Dose (peak drug level)', min: 2, max: 64, value: clamp(+P.dose || 24, 2, 64), log: true, sig: 2, unit: 'mg/L' },
        { id: 'days', label: 'Course length', min: 1, max: 14, step: 1, value: 7, unit: 'days' },
        { id: 'adh', type: 'select', label: 'How it is taken', options: [['Every dose on time', 'all'], ['Misses one dose in four', 'miss'], ['Misses every other dose', 'half'], ['Stops as soon as feeling better', 'stop']], value: 'all' },
        { id: 'immune', type: 'select', label: 'Immune defences', options: [['Healthy', 'ok'], ['Weakened, or bacteria out of their reach', 'weak']], value: P.immune === 'weak' ? 'weak' : 'ok' },
        { id: 'combo', type: 'check', label: 'Add a second drug with a different target', value: !!P.combo },
        { type: 'buttons', items: [{ id: 'go', label: 'Start the course again', primary: true }] }
      ], id => { build(); if (id === 'go') t = 0; });
      const ro = kit.readout(box.side, [['day', 'Day'], ['n', 'Bacteria: ordinary / resistant'], ['share', 'Resistant share'], ['feel', 'The patient'], ['doses', 'Doses taken'], ['end', 'Outcome by day 16']]);
      const V = ctl.values;
      const rnd = kit.fin.uniforms(21);
      const spots = Array.from({ length: 240 }, () => [rnd(), rnd()]);
      const cells = Array.from({ length: 7 }, () => ({ x: rnd(), y: rnd(), p: rnd() * 6.28 }));
      let run = null, t = 0, clock = 0;
      function build() { run = abxRun({ peak: V.peak, days: V.days, adh: V.adh, immune: V.immune, combo: V.combo }); }
      function state(d) { const o = run.out; return o[Math.round(clamp(d / ABX.days, 0, 1) * (o.length - 1))]; }
      const OUT = { cured: 'cured: every bacterium is gone', relapse: 'relapse: the infection returns (still treatable)', resistant: 'resistant infection: this drug no longer works' };
      function draw(dt) {
        t = Math.min(ABX.days, t + (dt || 0) * 1.3);
        clock += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const s = state(t), N = s.S + s.R;
        // the infection site
        const x0 = 12, y0 = 24, x1 = Math.max(x0 + 120, W - 220), y1 = Hh - 12;
        c.fillStyle = C.dark ? 'rgba(255,120,120,0.06)' : 'rgba(220,80,80,0.06)'; c.fillRect(x0, y0, x1 - x0, y1 - y0);
        c.strokeStyle = C.border; c.lineWidth = 1; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
        const nCells = V.immune === 'weak' ? 2 : 7;
        for (let i = 0; i < nCells; i++) {
          const q = cells[i], px = x0 + 24 + q.x * (x1 - x0 - 48) + 14 * Math.sin(q.p + clock * 0.6), py = y0 + 20 + q.y * (y1 - y0 - 40) + 10 * Math.cos(q.p + clock * 0.5);
          c.beginPath(); c.arc(px, py, 13, 0, Math.PI * 2); c.fillStyle = kit.hue(150, 0.16); c.fill(); c.strokeStyle = kit.hue(150, 0.7); c.lineWidth = 1.5; c.stroke();
        }
        const n = N >= 1 ? Math.min(spots.length, Math.round(22 * Math.log10(N + 1))) : 0;
        const nr = s.R >= 1 ? Math.max(1, Math.round(n * s.R / N)) : 0;
        for (let i = 0; i < n; i++) { const p = spots[i]; kit.dot(c, x0 + 6 + p[0] * (x1 - x0 - 12), y0 + 6 + p[1] * (y1 - y0 - 12), 3, i >= n - nr ? C.bad : kit.hue(215)); }
        kit.label(c, 'infection site: dots grow with log₁₀ of the number · green circles: immune cells', x0, 11, { size: 11, color: C.muted });
        if (N < 1) kit.label(c, 'no bacteria left', (x0 + x1) / 2, (y0 + y1) / 2, { size: 16, weight: 650, color: C.ok, align: 'center', baseline: 'middle', bg: C.bg2 });
        // the drug gauge, log scale from 0.1 to 100 mg/L
        const gx = x1 + 118, gy0 = y0 + 4, gy1 = y1 - 4;
        const Y = v => gy1 - (clamp(Math.log10(Math.max(v, 0.1)), -1, 2) + 1) / 3 * (gy1 - gy0);
        c.fillStyle = kit.hue(275, 0.16); c.fillRect(gx - 14, Y(8), 28, Y(1) - Y(8));
        c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(gx - 14, gy0, 28, gy1 - gy0);
        const yc = Y(s.C);
        if (s.C > 0.1) { c.fillStyle = C.accent; c.fillRect(gx - 10, yc, 20, gy1 - yc); }
        if (V.combo && s.CB > 0.1) { const yb = Y(s.CB); c.fillStyle = C.ok; c.fillRect(gx + 18, yb, 7, gy1 - yb); }
        for (const [v, lab] of [[1, 'MIC, ordinary'], [8, 'MIC, mutants']]) {
          c.strokeStyle = C.text2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(gx - 18, Y(v)); c.lineTo(gx + 18, Y(v)); c.stroke(); c.setLineDash([]);
          kit.label(c, lab, gx - 22, Y(v), { size: 10.5, color: C.text2, align: 'right', baseline: 'middle' });
        }
        kit.label(c, 'mutant', gx + 30, (Y(1) + Y(8)) / 2 - 7, { size: 10, color: kit.hue(275), baseline: 'middle' });
        kit.label(c, 'window', gx + 30, (Y(1) + Y(8)) / 2 + 7, { size: 10, color: kit.hue(275), baseline: 'middle' });
        kit.label(c, 'drug level', gx, 11, { size: 11, color: C.muted, align: 'center' });
        // the graphs, drawn up to now
        const vis = run.out.filter(o => o.d <= t);
        const pos = v => v >= 1 ? v : NaN;
        pb.set({
          series: [{ pts: vis.map(o => [o.d, pos(o.S)]), color: kit.hue(215), label: 'ordinary bacteria' }, { pts: vis.map(o => [o.d, pos(o.R)]), color: C.bad, label: 'resistant mutants' }],
          hlines: [{ y: Math.pow(10, ABX.ill), label: 'symptoms above about here' }].concat(V.immune === 'ok' ? [{ y: 2.3e6, label: 'the immune system wins below about here' }] : []),
          vlines: [{ x: V.days, label: 'course ends' }]
        });
        pd.set({
          series: [{ pts: vis.map(o => [o.d, o.C]), color: C.accent, label: 'drug 1' }].concat(V.combo ? [{ pts: vis.map(o => [o.d, o.CB]), color: C.ok, label: 'drug 2' }] : []),
          y: { label: 'drug level (mg/L)', min: 0, max: Math.max(10, V.peak * 1.15) },
          hlines: [{ y: 1, label: 'MIC, ordinary' }, { y: 8, label: 'MIC, mutants' }]
        });
        const share = N >= 1 ? s.R / N : NaN;
        ro.set('day', t.toFixed(1));
        ro.set('n', big(s.S) + ' / ' + big(s.R));
        ro.set('share', !Number.isFinite(share) ? '—' : share < 0.001 ? (share * 1e6).toFixed(share < 1e-5 ? 1 : 0) + ' per million' : pc(share, 1));
        ro.set('feel', N < 1 ? 'well: the infection is gone' : s.sym > ABX.ill ? 'ill' : 'feeling better — but bacteria remain');
        ro.set('doses', run.taken + ' of ' + run.planned + ' planned');
        ro.set('end', OUT[run.outcome]);
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3 · an SIR epidemic */
  const SIR_PRESETS = { flu: [1.3, 4], covid: [2.8, 7], measles: [15, 8] };
  Hyper.sim('inf-sir', {
    title: 'An epidemic: R₀, distancing and vaccination',
    blurb: `The SIR model (from kit.med) for a town of a million people, started by 20 infectious people. Each square in the crowd stands for 2,500 people: grey susceptible, red infectious, blue recovered, green immune through vaccination. The dashed red curve is the same infection with no measures at all.

- Pick **Measles**: with R₀ = 15, even 90 % coverage with a 97 %-effective vaccine leaves R above 1. Find the coverage at which an outbreak cannot start.
- Pick **COVID-19** and add distancing: the peak is lower and later, and fewer people are infected in total — not just later.
- Infections peak exactly when the susceptible share crosses 1/R — the herd immunity threshold — yet they carry on afterwards: the overshoot.`,
    mount(box, kit, params) {
      const NP = 1e6;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const plot = kit.plot(graphBox(box), { x: { label: 'day', min: 0, max: 365 }, y: { label: '% of the population', min: 0, max: 100 } }, 210);
      const pre = params && SIR_PRESETS[params.preset] ? params.preset : 'covid';
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Infection', options: [['Seasonal influenza (R₀ ≈ 1.3)', 'flu'], ['COVID-19, 2020 strain (R₀ ≈ 2.8)', 'covid'], ['Measles (R₀ ≈ 15)', 'measles'], ['Your own numbers', 'custom']], value: pre },
        { id: 'R0', label: 'R₀ (no immunity, no measures)', min: 0.8, max: 18, step: 0.1, value: SIR_PRESETS[pre][0] },
        { id: 'D', label: 'Infectious period', min: 2, max: 14, step: 0.5, value: SIR_PRESETS[pre][1], unit: 'days' },
        { id: 'cut', label: 'Distancing, masks, ventilation: cut in transmission', min: 0, max: 80, step: 1, value: 0, unit: '%' },
        { id: 'cov', label: 'Vaccinated before it arrives', min: 0, max: 100, step: 1, value: pre === 'measles' ? 90 : 0, unit: '%' },
        { id: 've', label: 'Protection given by the vaccine', min: 0, max: 100, step: 1, value: pre === 'measles' ? 97 : 90, unit: '%' },
        { type: 'buttons', items: [{ id: 'go', label: 'Replay', primary: true }] }
      ], (id, v) => {
        if (id === 'preset' && SIR_PRESETS[v]) { ctl.set('R0', SIR_PRESETS[v][0]); ctl.set('D', SIR_PRESETS[v][1]); if (v === 'measles') ctl.set('ve', 97); }
        if (id === 'R0' || id === 'D') ctl.set('preset', 'custom');
        if (id === 'go') day = 0;
        build();
      });
      const ro = kit.readout(box.side, [['day', 'Day'], ['re', 'Effective R at the start'], ['herd', 'Herd immunity threshold'], ['peak', 'Peak'], ['tot', 'Infected in total']]);
      const V = ctl.values;
      const perm = shuffled(400, kit.fin.uniforms(8));
      let res = null, base = null, R0e = 1, vac = 0, day = 0;
      function build() {
        vac = clamp(V.cov / 100 * V.ve / 100, 0, 0.995);
        R0e = Math.max(0.05, V.R0 * (1 - V.cut / 100));
        res = kit.med.sir({ R0: R0e, infectious: V.D, N: NP, I0: 20, vaccinated: vac, days: 365 });
        base = kit.med.sir({ R0: Math.max(0.05, V.R0), infectious: V.D, N: NP, I0: 20, vaccinated: 0, days: 365 });
        const toP = f => f / NP * 100;
        const C = kit.colors();
        plot.set({
          series: [
            { pts: base.series.map(o => [o.day, toP(o.I)]), color: C.bad, dash: [5, 4], width: 1.4, label: 'infectious, no measures' },
            { pts: res.series.map(o => [o.day, toP(o.S)]), color: C.muted, label: 'susceptible' },
            { pts: res.series.map(o => [o.day, toP(o.I)]), color: C.bad, label: 'infectious' },
            { pts: res.series.map(o => [o.day, toP(Math.max(0, o.R - NP * vac))]), color: kit.hue(215), label: 'recovered' }
          ],
          hlines: R0e > 1 ? [{ y: 100 / R0e, label: 'susceptible = 1/R: infections peak here' }] : []
        });
      }
      function draw(dt) {
        day = Math.min(365, day + (dt || 0) * 30);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const k = Math.min(res.series.length - 1, Math.floor(day)), s = res.series[k];
        // the crowd: 400 squares, one per 2,500 people
        const cols = 25, rows = 16, gx0 = 10, gy0 = 24, chh = (Hh - 32) / rows, cw = Math.min(chh * 1.25, W * 0.58 / cols), gw = cw * cols;
        const r = Math.max(1.2, Math.min(cw, chh) * 0.36);
        const nV = Math.round(400 * vac), nRec = Math.round(400 * Math.max(0, s.R - NP * vac) / NP), nI = Math.round(400 * s.I / NP);
        for (let i = 0; i < 400; i++) {
          const j = perm[i], cx = gx0 + (j % cols + 0.5) * cw, cy = gy0 + (Math.floor(j / cols) + 0.5) * chh;
          c.fillStyle = i < nV ? kit.hue(150) : i < nV + nRec ? kit.hue(215) : i < nV + nRec + nI ? C.bad : C.faint;
          c.fillRect(cx - r, cy - r, 2 * r, 2 * r);
        }
        kit.label(c, 'day ' + Math.floor(day) + ' — each square is 2,500 people', gx0, 11, { size: 11, color: C.muted });
        // immunity against the threshold
        const bx = gx0 + gw + 26, bw = Math.max(60, W - bx - 16), by = 44, bh = 18;
        const immune = s.R / NP, H = R0e > 1 ? 1 - 1 / R0e : 0;
        kit.label(c, 'immune now (vaccinated or recovered)', bx, by - 12, { size: 11.5, color: C.text2 });
        c.fillStyle = C.bg2; c.fillRect(bx, by, bw, bh);
        c.fillStyle = kit.hue(150, 0.8); c.fillRect(bx, by, bw * clamp(immune, 0, 1), bh);
        c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        if (H > 0) {
          const hx = bx + bw * H;
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(hx, by - 4); c.lineTo(hx, by + bh + 4); c.stroke();
          kit.label(c, 'threshold ' + pc(H), clamp(hx, bx + 40, bx + bw - 40), by + bh + 14, { size: 11, align: 'center', color: C.text });
        }
        const reNow = R0e * s.S / NP;
        kit.label(c, 'effective R now: ' + reNow.toFixed(2), bx, by + bh + 42, { size: 15, weight: 650, color: reNow > 1 ? C.bad : C.ok });
        kit.label(c, reNow > 1 ? 'each case infects more than one other' : 'each case infects fewer than one other', bx, by + bh + 64, { size: 11.5, color: C.muted });
        const ly = by + bh + 94;
        [[C.faint, 'susceptible'], [C.bad, 'infectious'], [kit.hue(215), 'recovered'], [kit.hue(150), 'vaccinated and protected']].forEach(([col, lab], i) => {
          c.fillStyle = col; c.fillRect(bx, ly + i * 18 - 5, 10, 10);
          kit.label(c, lab, bx + 16, ly + i * 18, { size: 11.5, color: C.text2, baseline: 'middle' });
        });
        plot.set({ vlines: [{ x: Math.floor(day) }] });
        ro.set('day', String(Math.floor(day)));
        const r0 = R0e * (1 - vac);
        ro.set('re', r0.toFixed(2) + (r0 < 1 ? ' — cannot spread' : ' — can spread'));
        const Hn = 1 - 1 / V.R0, e = V.ve / 100;
        ro.set('herd', V.R0 <= 1 ? 'none needed (R₀ ≤ 1)' : pc(Hn) + ' immune' + (e <= 0 ? '' : Hn / e > 1 ? '; this vaccine alone cannot reach it' : ' → vaccinate ' + pc(Hn / e)));
        ro.set('peak', res.peak.I < 30 ? 'no outbreak' : 'day ' + res.peak.day + ', ' + pc(res.peak.I / NP, 1) + ' infectious at once');
        ro.set('tot', pc(res.infected, 1) + ' (no measures: ' + pc(base.infected, 0) + ')');
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4 · spread on a contact network */
  Hyper.sim('inf-network', {
    title: 'Spread on a contact network: superspreading',
    blurb: `Each dot is a person, joined to the people they meet regularly. Every infected person infects a random number of their contacts: on average R, but how that number is spread out is set by the dispersion k — with strong superspreading most cases infect nobody and a few infect many (ringed in orange). Immune people (green rings) block the chains that reach them.

- Press **New outbreak** several times with superspreading on: most outbreaks fizzle after a handful of cases, a few explode.
- Press **Run 200 outbreaks** for each setting of spreading at the same R: the average is identical, yet the chance of a large outbreak is very different.
- With superspreading, the top 20 % of cases cause most of the infections — which is why avoiding crowded indoor gatherings removes so much transmission.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'R', label: 'Average R (people infected per case)', min: 0.5, max: 4, step: 0.1, value: 2.2 },
        { id: 'k', type: 'select', label: 'How unevenly people spread it', options: [['Evenly: everyone infects about R others', 100], ['Unevenly (dispersion k = 0.5)', 0.5], ['Superspreading (k = 0.1, as estimated for SARS and COVID-19)', 0.1]], value: 0.1 },
        { id: 'imm', label: 'Already immune', min: 0, max: 80, step: 5, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New outbreak', primary: true }, { id: 'batch', label: 'Run 200 outbreaks' }] }
      ], id => {
        if (id === 'new') { seed++; reset(); }
        else if (id === 'batch') runBatch();
        else { batch = null; reset(); }
      });
      const ro = kit.readout(box.side, [['day', 'Day'], ['cases', 'Infected so far'], ['now', 'Infectious now'], ['top', 'The top 20 % of cases caused'], ['out', 'This outbreak'], ['batch', 'In 200 outbreaks']]);
      const V = ctl.values;
      // the network: people on a jittered grid, each joined to their 5 nearest neighbours, plus a few long-range links
      const COLS = 20, ROWS = 11, NN = COLS * ROWS;
      const rn = kit.fin.uniforms(3);
      const nodes = [];
      for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) nodes.push({ x: (q + 0.5 + (rn() - 0.5) * 0.7) / COLS, y: (r + 0.5 + (rn() - 0.5) * 0.7) / ROWS });
      const adj = nodes.map(() => new Set());
      nodes.forEach((a, i) => {
        const d = [];
        nodes.forEach((b, j) => { if (j !== i) { const dx = (a.x - b.x) * COLS, dy = (a.y - b.y) * ROWS; d.push([j, dx * dx + dy * dy]); } });
        d.sort((p, q) => p[1] - q[1]);
        for (let m = 0; m < 5; m++) { adj[i].add(d[m][0]); adj[d[m][0]].add(i); }
      });
      for (let i = 0; i < NN; i++) if (rn() < 0.1) { const j = Math.floor(rn() * NN); if (j !== i) { adj[i].add(j); adj[j].add(i); } }
      const nbr = adj.map(s => Array.from(s));
      const edges = [];
      nbr.forEach((l, i) => l.forEach(j => { if (j > i) edges.push([i, j]); }));
      const permI = shuffled(NN, kit.fin.uniforms(99));
      // seed 34 happens to start with an outbreak that takes off; the next few presses show fizzles
      let status = [], infDay = [], sched = [], kids = [], links = [], dayN = 0, seed = 34, U = null, Nn = null, acc = 0, done = false, batch = null, batches = 0;
      function infect(j, d, src) {
        status[j] = 1; infDay[j] = d;
        const kk = +V.k, nu = kk >= 50 ? V.R : gammaRand(kk, V.R / kk, U, Nn);
        const n = poissonRand(nu, U, Nn);
        sched[j] = [];
        for (let i = 0; i < n; i++) sched[j].push(2 + Math.floor(U() * 5));   // passed on 2–6 days after infection
        if (src >= 0) { kids[src]++; links.push([src, j, d]); }
      }
      function reset() {
        U = kit.fin.uniforms(1000 + seed); Nn = kit.fin.normals(2000 + seed);
        status = new Array(NN).fill(0); infDay = new Array(NN).fill(-1); sched = nodes.map(() => []); kids = new Array(NN).fill(0);
        links = []; dayN = 0; done = false; acc = 0;
        const nImm = Math.round(NN * V.imm / 100);
        for (let i = 0; i < nImm; i++) status[permI[i]] = 3;
        let best = -1, bd = 1e9;
        nodes.forEach((n, i) => { if (status[i] === 0) { const d = (n.x - 0.5) * (n.x - 0.5) + (n.y - 0.5) * (n.y - 0.5); if (d < bd) { bd = d; best = i; } } });
        if (best >= 0) infect(best, 0, -1); else done = true;
      }
      function contact(i) {
        const l = nbr[i], w = U();
        if (!l.length || w < 0.15) return Math.floor(U() * NN);   // a stranger: on a bus, at a concert
        const a = l[Math.floor(U() * l.length)];
        if (w < 0.6) return a;                                  // a regular contact
        const l2 = nbr[a];                                      // a friend of a friend: at a party, a meal, a crowded room
        return l2.length ? l2[Math.floor(U() * l2.length)] : a;
      }
      function stepDay() {
        dayN++;
        const active = [];
        for (let i = 0; i < NN; i++) if (status[i] === 1) active.push(i);
        for (const i of active) {
          const age = dayN - infDay[i];
          for (const sd of sched[i]) if (sd === age) { const cc = contact(i); if (cc !== i && status[cc] === 0) infect(cc, dayN, i); }
          if (age >= 7) status[i] = 2;
        }
        if (!status.some(s => s === 1)) done = true;
      }
      function runBatch() {
        const keep = seed;
        let took = 0;
        const all = [];
        batches++;
        for (let r = 0; r < 200; r++) {
          seed = 5000 + batches * 200 + r; reset();
          let g = 0;
          while (!done && g++ < 300) stepDay();
          let size = 0;
          for (let i = 0; i < NN; i++) if (status[i] === 1 || status[i] === 2) { size++; all.push(kids[i]); }
          if (size >= 25) took++;
        }
        batch = { took, top: topShare(all) };
        seed = keep; reset();
      }
      function draw(dt) {
        if (!done) { acc += (dt || 0) * 2.5; let g = 0; while (acc >= 1 && !done && g++ < 5) { acc -= 1; stepDay(); } }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const X = n => 14 + n.x * (W - 28), Y = n => 26 + n.y * (Hh - 36);
        c.strokeStyle = C.border; c.lineWidth = 1; c.beginPath();
        for (const [i, j] of edges) { c.moveTo(X(nodes[i]), Y(nodes[i])); c.lineTo(X(nodes[j]), Y(nodes[j])); }
        c.stroke();
        for (const [a, b, d] of links) if (dayN - d <= 2) kit.arrow(c, X(nodes[a]), Y(nodes[a]), X(nodes[b]), Y(nodes[b]), C.warn, 1.6, 6);
        nodes.forEach((n, i) => {
          const s = status[i], x = X(n), y = Y(n), sup6 = kids[i] >= 6;
          const col = s === 1 ? C.bad : s === 2 ? kit.hue(215) : s === 3 ? kit.hue(150) : C.faint;
          c.beginPath(); c.arc(x, y, sup6 ? 6.5 : 4.2, 0, Math.PI * 2);
          if (s === 3) { c.strokeStyle = col; c.lineWidth = 2; c.stroke(); } else { c.fillStyle = col; c.fill(); }
          if (sup6) { c.beginPath(); c.arc(x, y, 10, 0, Math.PI * 2); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.stroke(); }
        });
        kit.label(c, 'day ' + dayN + (done ? ' — outbreak over' : ''), 14, 11, { size: 11.5, color: C.muted });
        let lx = W - 14;
        [[kit.hue(150), '○ immune'], [C.warn, '◎ infected 6 or more'], [kit.hue(215), '● recovered'], [C.bad, '● infectious']].forEach(([col, lab]) => {
          kit.label(c, lab, lx, 11, { size: 11.5, color: col, align: 'right' });
          lx -= lab.length * 6.6 + 14;
        });
        let ever = 0, now = 0;
        const fin = [];
        for (let i = 0; i < NN; i++) { if (status[i] === 1 || status[i] === 2) ever++; if (status[i] === 1) now++; if (status[i] === 2) fin.push(kids[i]); }
        const ts = topShare(fin);
        ro.set('day', String(dayN));
        ro.set('cases', ever + ' of ' + NN + ' people');
        ro.set('now', String(now));
        ro.set('top', fin.length >= 5 && Number.isFinite(ts) ? pc(ts) + ' of the infections' : '—');
        ro.set('out', !done ? 'spreading…' : ever >= 25 ? 'a large outbreak' : 'fizzled out after ' + ever + (ever === 1 ? ' case' : ' cases'));
        ro.set('batch', batch ? pc(batch.took / 200) + ' took off (25+ cases); top 20 % of cases caused ' + pc(batch.top) : 'press "Run 200 outbreaks"');
      }
      reset();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5 · vaccine effectiveness and the base rate */
  Hyper.sim('inf-base-rate', {
    title: 'When most of the ill are vaccinated',
    blurb: `A town of 1,000 people during an outbreak. Coloured squares on the left are vaccinated people, grey ones unvaccinated; red squares fell ill (a green edge marks the vaccinated among them).

- With 90 % vaccinated and an 80 %-effective vaccine, most of the ill are vaccinated — yet each vaccinated person had a fifth of the risk.
- Push vaccination towards 100 %: the share of vaccinated among the ill rises towards 100 % too, however good the vaccine. The graph shows this for every level of coverage.
- The fair comparison is the **risk in each group**, not the head count; the effectiveness worked out from the risks is always the vaccine's true effectiveness.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const plot = kit.plot(graphBox(box), { x: { label: 'people vaccinated (%)', min: 0, max: 100 }, y: { label: 'ill people who were vaccinated (%)', min: 0, max: 100 } }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'cov', label: 'People vaccinated', min: 0, max: 100, step: 1, value: 90, unit: '%' },
        { id: 've', label: 'Vaccine effectiveness', min: 0, max: 99, step: 1, value: 80, unit: '%' },
        { id: 'ar', label: 'Risk of falling ill if unvaccinated', min: 1, max: 50, step: 1, value: 10, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['cv', 'Ill, vaccinated'], ['cu', 'Ill, unvaccinated'], ['share', 'Share of the ill who were vaccinated'], ['risk', 'Risk: vaccinated vs unvaccinated'], ['ve', 'Effectiveness worked out from the risks']]);
      const V = ctl.values, NP = 1000, ROWS = 20, COLS = NP / ROWS;
      const rank = new Array(NP);
      shuffled(NP, kit.fin.uniforms(17)).forEach((p, i) => { rank[p] = i; });
      let key = '', ill = new Set();
      function cases(nv, cv, cu) {
        const k = nv + ',' + cv + ',' + cu;
        if (k === key) return;
        key = k; ill = new Set();
        const vi = [], ui = [];
        for (let i = 0; i < NP; i++) (i < nv ? vi : ui).push(i);
        vi.sort((a, b) => rank[a] - rank[b]); ui.sort((a, b) => rank[a] - rank[b]);
        vi.slice(0, cv).forEach(i => ill.add(i)); ui.slice(0, cu).forEach(i => ill.add(i));
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const nv = Math.round(NP * V.cov / 100), nu = NP - nv, ar = V.ar / 100, ve = V.ve / 100;
        const cv = Math.round(nv * ar * (1 - ve)), cu = Math.round(nu * ar);
        cases(nv, cv, cu);
        // 1,000 people, column by column, vaccinated first
        const cell = Math.max(3, Math.min(W * 0.6 / COLS, (Hh - 36) / ROWS)), gx = 10, gy = 26, s = cell * 0.8;
        for (let i = 0; i < NP; i++) {
          const x = gx + Math.floor(i / ROWS) * cell, y = gy + (i % ROWS) * cell, vacc = i < nv;
          c.fillStyle = ill.has(i) ? C.bad : vacc ? kit.hue(160, 0.55) : C.faint;
          c.fillRect(x, y, s, s);
          if (ill.has(i) && vacc) { c.strokeStyle = kit.hue(160); c.lineWidth = 1.4; c.strokeRect(x - 0.5, y - 0.5, s + 1, s + 1); }
        }
        kit.label(c, '1,000 people: vaccinated ' + nv + ', unvaccinated ' + nu, gx, 12, { size: 11.5, color: C.muted });
        // who are the ill? and what was each person's risk?
        const bx = gx + COLS * cell + 22, bw = Math.max(80, W - bx - 16);
        const tot = cv + cu;
        kit.label(c, 'Among the ' + tot + ' ill people', bx, 38, { size: 12.5, weight: 600 });
        c.fillStyle = C.bg2; c.fillRect(bx, 48, bw, 20);
        if (tot > 0) {
          c.fillStyle = C.bad; c.fillRect(bx, 48, bw * cv / tot, 20);
          c.strokeStyle = kit.hue(160); c.lineWidth = 2; c.strokeRect(bx + 1, 49, Math.max(0, bw * cv / tot - 2), 18);
          c.fillStyle = C.dark ? 'rgba(229,72,77,0.45)' : 'rgba(229,72,77,0.4)'; c.fillRect(bx + bw * cv / tot, 48, bw * cu / tot, 20);
        }
        kit.label(c, 'vaccinated ' + (tot ? pc(cv / tot) : '—'), bx, 82, { size: 11.5, color: C.text2 });
        kit.label(c, 'unvaccinated ' + (tot ? pc(cu / tot) : '—'), bx + bw, 82, { size: 11.5, color: C.text2, align: 'right' });
        kit.label(c, 'Risk of falling ill, per person', bx, 118, { size: 12.5, weight: 600 });
        const rv = nv ? cv / nv : NaN, rux = nu ? cu / nu : NaN, rmax = Math.max(ar, 0.01);
        [[kit.hue(160), 'vaccinated', rv], [C.muted, 'unvaccinated', rux]].forEach(([col, lab, rr], i) => {
          const y = 132 + i * 34;
          c.fillStyle = C.bg2; c.fillRect(bx, y, bw, 16);
          if (Number.isFinite(rr)) { c.fillStyle = col; c.fillRect(bx, y, bw * clamp(rr / rmax, 0, 1), 16); }
          kit.label(c, lab + ': ' + (Number.isFinite(rr) ? pc(rr, 1) : '—'), bx, y + 26, { size: 11.5, color: C.text2 });
        });
        // the curve: share of the ill who were vaccinated, for every coverage
        const curve = [], naive = [];
        for (let p = 0; p <= 100; p += 1) {
          const f = p / 100, a = f * (1 - ve), b = 1 - f;
          curve.push([p, a + b > 0 ? 100 * a / (a + b) : NaN]);
          naive.push([p, p]);
        }
        const shareNow = tot > 0 ? cv / tot : NaN;
        plot.set({
          series: [{ pts: naive, color: C.faint, dash: [5, 4], width: 1.4, label: 'if the vaccine did nothing' }, { pts: curve, color: C.bad, label: 'with this vaccine' }],
          marks: Number.isFinite(shareNow) ? [{ x: V.cov, y: 100 * shareNow, color: C.bad, label: pc(shareNow) }] : []
        });
        ro.set('cv', cv + ' of ' + nv);
        ro.set('cu', cu + ' of ' + nu);
        ro.set('share', Number.isFinite(shareNow) ? pc(shareNow) : '—');
        ro.set('risk', (Number.isFinite(rv) ? pc(rv, 1) : '—') + ' vs ' + (Number.isFinite(rux) ? pc(rux, 1) : '—'));
        ro.set('ve', Number.isFinite(rv) && Number.isFinite(rux) && rux > 0 ? pc(1 - rv / rux) + ' (the vaccine\'s is ' + pc(ve) + ')' : '—');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6 · the viral replication cycle */
  // steps: [key, label, x, y] with x, y as fractions of the cell (x > 1 is outside it)
  const VIRUS = {
    flu: {
      name: 'influenza', hue: 330, days: 12, dt: 0.02, abs: false,
      model: { T0: 4e8, V0: 7.5e-2, beta: 2.7e-5, p: 1.2e-2, c: 3, delta: 4, lam: 0, dT: 0, fL: 0, dL: 1, pL: 0 },
      steps: [['attach', 'Attach', 0.02, 0.5], ['uncoat', 'Enter and uncoat', 0.19, 0.66], ['copy', 'Copy genes (nucleus)', 0.44, 0.36], ['protein', 'Make proteins', 0.62, 0.76], ['assemble', 'Assemble', 0.82, 0.6], ['release', 'Bud and cut free', 0.98, 0.42]],
      drugs: { attach: 'none approved (antibodies are being studied)', uncoat: 'amantadine and rimantadine — no longer advised: almost all strains resist them', copy: 'baloxavir (blocks the cap-snatching enzyme); favipiravir in some countries', protein: 'none approved', assemble: 'none approved', release: 'oseltamivir, zanamivir, peramivir (neuraminidase inhibitors)' },
      mode: { attach: 'infect', uncoat: 'infect', copy: 'produce', protein: 'produce', assemble: 'produce', release: 'produce' }
    },
    cov: {
      name: 'SARS-CoV-2', hue: 28, days: 16, dt: 0.02, abs: false,
      model: { T0: 1e7, V0: 1, beta: 3e-7, p: 60, c: 10, delta: 0.8, lam: 0, dT: 0, fL: 0, dL: 1, pL: 0 },
      steps: [['attach', 'Attach and fuse', 0.02, 0.5], ['uncoat', 'Release RNA', 0.17, 0.64], ['protein', 'Make polyproteins', 0.36, 0.78], ['cut', 'Protease cuts them', 0.56, 0.78], ['copy', 'Copy the RNA', 0.56, 0.3], ['assemble', 'Assemble', 0.8, 0.44], ['release', 'Leave the cell', 0.98, 0.6]],
      drugs: { attach: 'monoclonal antibodies — many lost their effect against newer variants', uncoat: 'none approved', protein: 'none approved', cut: 'nirmatrelvir (given with ritonavir); ensitrelvir in some countries', copy: 'remdesivir, molnupiravir (polymerase inhibitors)', assemble: 'none approved', release: 'none approved' },
      mode: { attach: 'infect', uncoat: 'infect', protein: 'produce', cut: 'produce', copy: 'produce', assemble: 'produce', release: 'produce' }
    },
    hiv: {
      name: 'HIV', hue: 0, days: 120, dt: 0.1, abs: true,
      model: { T0: 3e5, V0: 1e-9, beta: 1.15e-6, p: 200, c: 13, delta: 0.7, lam: 3000, dT: 0.01, fL: 0.03, dL: 0.05, pL: 40 },
      steps: [['attach', 'Attach to CD4 and fuse', 0.02, 0.5], ['uncoat', 'Capsid to the nucleus', 0.16, 0.7], ['copy', 'Reverse transcribe', 0.28, 0.34], ['integrate', 'Integrate into DNA', 0.46, 0.4], ['protein', 'Make RNA and proteins', 0.62, 0.78], ['assemble', 'Assemble and bud', 0.9, 0.6], ['cut', 'Mature (protease)', 1.12, 0.36]],
      drugs: { attach: 'maraviroc (blocks the CCR5 co-receptor), enfuvirtide (blocks fusion), ibalizumab', uncoat: 'lenacapavir (a capsid inhibitor that acts at several steps)', copy: 'tenofovir, lamivudine, emtricitabine; efavirenz, doravirine (reverse-transcriptase inhibitors)', integrate: 'dolutegravir, bictegravir, cabotegravir (integrase inhibitors)', protein: 'none approved', assemble: 'lenacapavir also disrupts assembly', cut: 'darunavir, atazanavir (protease inhibitors)' },
      mode: { attach: 'infect', uncoat: 'infect', copy: 'infect', integrate: 'infect', protein: 'produce', assemble: 'produce', cut: 'produce' }
    }
  };
  const FIRST_DRUG = { flu: 'release', cov: 'cut', hiv: 'integrate' };
  const STEP_NAMES = [['No medicine', 'none'], ['Attachment and entry', 'attach'], ['Uncoating', 'uncoat'], ['Copying the genes', 'copy'], ['Joining its DNA to the cell\'s (HIV)', 'integrate'], ['Making proteins', 'protein'], ['Cutting viral proteins (protease)', 'cut'], ['Assembly', 'assemble'], ['Leaving the cell', 'release']];
  // a target-cell model inside the body: target cells T, infected cells I (and long-lived L), virus V
  function tivRun(M, days, dt, start, eps, mode) {
    let T = M.T0, I = 0, L = 0, Vv = M.V0;
    const out = [], sub = 10, h = dt / sub;
    for (let s = 0, n = Math.round(days / dt); s <= n; s++) {
      const t = s * dt;
      out.push([t, Vv]);
      const on = t >= start ? eps : 0;
      const b = M.beta * (mode === 'infect' ? 1 - on : 1), pf = mode === 'produce' ? 1 - on : 1;
      for (let k = 0; k < sub; k++) {
        const F = b * T * Vv;
        const dT = M.lam - M.dT * T - F, dI = (1 - M.fL) * F - M.delta * I, dL = M.fL * F - M.dL * L, dV = pf * (M.p * I + M.pL * L) - M.c * Vv;
        T = Math.max(0, T + dT * h); I = Math.max(0, I + dI * h); L = Math.max(0, L + dL * h); Vv = Math.max(0, Vv + dV * h);
      }
    }
    return out;
  }
  Hyper.sim('inf-virus-cycle', {
    title: 'Inside an infected cell: where antivirals act',
    blurb: `A schematic cell infected by a virus, step by step, with the virus in the body graphed below from a simple model (target cells, infected cells, virus). Choose the step a medicine blocks: particles are stopped there, and the graph shows what that does to the infection.

- **Influenza**: block *leaving the cell* (neuraminidase inhibitors) from day 1, then from day 3: antivirals help most when started early, while the virus is still multiplying.
- **SARS-CoV-2**: the protease and the polymerase are the targets of today's tablets and infusions.
- **HIV**: the virus writes its genes into our DNA, and each class of antiretroviral blocks a different step — which is why combinations work. The graph shows copies per mL over 120 days.
- A step with no medicine is not a failure of science: a good target must exist in the virus and not in our own cells.`,
    mount(box, kit, params) {
      const v0 = params && VIRUS[params.virus] ? params.virus : 'flu';
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const plot = kit.plot(graphBox(box), { x: { label: 'days after infection', min: 0 }, y: { label: 'virus', log: true } }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'virus', type: 'select', label: 'Virus', options: [['Influenza', 'flu'], ['SARS-CoV-2 (COVID-19)', 'cov'], ['HIV', 'hiv']], value: v0 },
        { id: 'step', type: 'select', label: 'The medicine blocks', options: STEP_NAMES, value: FIRST_DRUG[v0] },
        { id: 'eff', label: 'How completely it blocks', min: 50, max: 99, step: 1, value: 95, unit: '%' },
        { id: 'start', label: 'Started on day', min: 0, max: 30, step: 0.5, value: v0 === 'hiv' ? 20 : 2 }
      ], (id, v) => {
        if (id === 'virus') { ctl.set('step', FIRST_DRUG[v] || 'none'); ctl.set('start', v === 'hiv' ? 20 : 2); tokens = []; made = 0; stopped = 0; }
        build();
      });
      const ro = kit.readout(box.side, [['step', 'Blocked step'], ['drugs', 'Medicines that act here'], ['parts', 'Particles: made it out / stopped'], ['peak', 'Peak virus (vs no medicine)'], ['area', 'All virus over the period (vs none)']]);
      const V = ctl.values;
      const rnd = kit.fin.uniforms(31);
      let tokens = [], kids = [], spawn = 0, made = 0, stopped = 0, clock = 0, base = [], treated = [], vir = VIRUS[v0], active = false;
      function build() {
        vir = VIRUS[V.virus] || VIRUS.flu;
        const mode = V.step !== 'none' ? vir.mode[V.step] : null;
        active = !!mode;
        base = tivRun(vir.model, vir.days, vir.dt, 1e9, 0, null);
        treated = active ? tivRun(vir.model, vir.days, vir.dt, V.start, V.eff / 100, mode) : base;
        const C = kit.colors();
        const peak = base.reduce((m, p) => Math.max(m, p[1]), 1e-30);
        const tr = p => vir.abs ? [p[0], p[1]] : [p[0], p[1] / peak];
        plot.set({
          x: { label: 'days after infection', min: 0, max: vir.days },
          y: vir.abs ? { label: 'HIV in the blood (copies/mL, log scale)', log: true, min: 1, max: 1e7 } : { label: 'virus in the airways (relative to the untreated peak)', log: true, min: 1e-5, max: 3 },
          series: [{ pts: base.map(tr), color: C.faint, dash: [5, 4], width: 1.5, label: 'no medicine' }].concat(active ? [{ pts: treated.map(tr), color: kit.hue(vir.hue), label: 'with the medicine' }] : []),
          vlines: active && V.start <= vir.days ? [{ x: V.start, label: 'medicine starts' }] : [],
          hlines: vir.abs ? [{ y: 50, label: 'limit of detection, 50 copies/mL' }] : []
        });
        const pk = a => a.reduce((m, p) => Math.max(m, p[1]), 0), ar = a => a.reduce((s, p) => s + p[1], 0);
        const has = vir.steps.some(s => s[0] === V.step);
        ro.set('step', V.step === 'none' ? 'none' : (STEP_NAMES.find(s => s[1] === V.step) || ['—'])[0] + (has ? '' : ' — ' + vir.name + ' has no such step'));
        ro.set('drugs', V.step === 'none' ? '—' : has ? vir.drugs[V.step] || 'none approved' : '—');
        ro.set('peak', active ? pc(pk(treated) / pk(base)) : '100 %');
        ro.set('area', active ? pc(ar(treated) / ar(base), 1) : '100 %');
      }
      function geo(W, Hh) {
        const x0 = W * 0.1, x1 = W * 0.8, y0 = 30, y1 = Hh - 22;
        const at = s => [x0 + s[2] * (x1 - x0), y0 + s[3] * (y1 - y0)];
        return { x0, x1, y0, y1, at };
      }
      function draw(dt) {
        const d = Math.min(dt || 0, 0.05);
        clock += d;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const G = geo(W, Hh), steps = vir.steps, col = kit.hue(vir.hue);
        const bi = steps.findIndex(s => s[0] === V.step);
        // the cell and its nucleus
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 3;
        c.beginPath(); if (c.roundRect) c.roundRect(G.x0, G.y0, G.x1 - G.x0, G.y1 - G.y0, 26); else c.rect(G.x0, G.y0, G.x1 - G.x0, G.y1 - G.y0); c.fill(); c.stroke();
        const nx = G.x0 + 0.45 * (G.x1 - G.x0), ny = G.y0 + 0.38 * (G.y1 - G.y0), nrx = 0.12 * (G.x1 - G.x0), nry = 0.22 * (G.y1 - G.y0);
        c.beginPath(); c.ellipse(nx, ny, nrx, nry, 0, 0, Math.PI * 2); c.fillStyle = C.bg2; c.fill(); c.setLineDash([5, 4]); c.strokeStyle = C.border2; c.lineWidth = 1.5; c.stroke(); c.setLineDash([]);
        kit.label(c, 'nucleus', nx, ny - nry + 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'a ' + (vir.name === 'HIV' ? 'CD4 T cell' : 'cell lining the airways') + ' (schematic)', G.x0 + 12, G.y0 - 12, { size: 11, color: C.muted });
        // the path through the steps
        c.strokeStyle = C.faint; c.setLineDash([3, 5]); c.lineWidth = 1.5; c.beginPath();
        steps.forEach((s, i) => { const p = G.at(s); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); });
        c.stroke(); c.setLineDash([]);
        steps.forEach((s, i) => {
          const p = G.at(s), blocked = i === bi;
          c.beginPath(); c.arc(p[0], p[1], 11, 0, Math.PI * 2); c.fillStyle = blocked ? C.bad : C.bg2; c.fill();
          c.strokeStyle = blocked ? C.bad : C.text2; c.lineWidth = 1.5; c.stroke();
          kit.label(c, String(i + 1), p[0], p[1] + 0.5, { size: 11, weight: 700, color: blocked ? '#fff' : C.text, align: 'center', baseline: 'middle' });
          const below = s[3] >= 0.5;
          kit.label(c, s[1], p[0], p[1] + (below ? 24 : -22), { size: 10.5, color: blocked ? C.bad : C.text2, align: 'center', weight: blocked ? 650 : 400 });
          if (blocked) {
            const px = p[0] + 16, py = p[1] - 16;
            c.fillStyle = C.bad; c.beginPath(); if (c.roundRect) c.roundRect(px - 9, py - 4, 18, 8, 4); else c.rect(px - 9, py - 4, 18, 8); c.fill();
          }
        });
        // virus particles travelling through the cycle
        spawn -= d;
        if (spawn <= 0 && tokens.length < 14) { spawn = 1.3; const p0 = G.at(steps[0]); tokens.push({ x: p0[0] - 70, y: p0[1], s: 0, wait: 0, dead: 0 }); }
        for (const k of tokens) {
          if (k.dead) { k.dead += d; continue; }
          if (k.wait > 0) { k.wait -= d; continue; }
          const tg = k.s < steps.length ? G.at(steps[k.s]) : [W + 30, k.y];
          const dx = tg[0] - k.x, dy = tg[1] - k.y, dist = Math.hypot(dx, dy), sp = 110 * d;
          if (dist <= sp) {
            k.x = tg[0]; k.y = tg[1];
            if (k.s >= steps.length) { k.gone = true; continue; }
            if (k.s === bi && active && rnd() < V.eff / 100) { k.dead = 0.001; stopped++; continue; }
            if (k.s === steps.length - 1) { made++; for (let j = 0; j < 3; j++) kids.push({ x: k.x, y: k.y, vx: 60 + 50 * rnd(), vy: (rnd() - 0.5) * 90, life: 1.6 }); }
            k.s++; k.wait = 0.3;
          } else { k.x += dx / dist * sp; k.y += dy / dist * sp; }
        }
        tokens = tokens.filter(k => !k.gone && k.dead < 1.2);
        kids.forEach(q => { q.x += q.vx * d; q.y += q.vy * d; q.life -= d; });
        kids = kids.filter(q => q.life > 0);
        const virion = (x, y, r, color, alpha) => {
          c.globalAlpha = alpha;
          c.strokeStyle = color; c.lineWidth = 1.5;
          for (let a = 0; a < 8; a++) { const an = a * Math.PI / 4 + clock; c.beginPath(); c.moveTo(x + Math.cos(an) * r, y + Math.sin(an) * r); c.lineTo(x + Math.cos(an) * (r + 3.5), y + Math.sin(an) * (r + 3.5)); c.stroke(); }
          c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill();
          c.globalAlpha = 1;
        };
        for (const k of tokens) {
          if (k.dead) {
            const a = clamp(1 - k.dead / 1.2, 0, 1);
            virion(k.x, k.y, 5.5, C.faint, a);
            c.globalAlpha = a; c.strokeStyle = C.bad; c.lineWidth = 2.2;
            c.beginPath(); c.moveTo(k.x - 7, k.y - 7); c.lineTo(k.x + 7, k.y + 7); c.moveTo(k.x + 7, k.y - 7); c.lineTo(k.x - 7, k.y + 7); c.stroke();
            c.globalAlpha = 1;
          } else virion(k.x, k.y, 5.5, col, 1);
        }
        for (const q of kids) virion(q.x, q.y, 3.5, col, clamp(q.life / 1.6, 0, 1));
        ro.set('parts', made + ' / ' + stopped);
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7 · HIV over twenty years */
  // an illustrative course: log10 viral load L (copies/mL) and CD4 count C (cells/µL), time in years
  function hivRun(o) {
    const dt = 0.005, Y = 20, out = [];
    const sp = o.sp, d0 = 25 + 30 * (sp - 3.5);
    const ts = o.never ? Infinity : o.ts, tstop = o.adh === 'stop' ? ts + 3 : Infinity;
    let C = 1000, L = 1.3, Lts = null, Cts = null, below = null;
    for (let s = 0, n = Math.round(Y / dt); s <= n; s++) {
      const t = s * dt;
      const acute = t < 0.06 ? 1.3 + 5.5 * t / 0.06 : sp + (6.8 - sp) * Math.exp(-(t - 0.06) / 0.07);
      const Lu = Math.min(6.9, acute + 0.04 * t + 0.006 * Math.max(0, 350 - C));
      let dC;
      if (t >= tstop) {
        L += (Lu - L) * (1 - Math.exp(-dt / 0.05));                  // the virus rebounds within weeks
        dC = -d0 * (t < tstop + 1 ? 2 : 1) * (1 + 0.4 * Math.max(0, L - sp));
      } else if (t < ts) {
        L = Lu;
        dC = t < 0.08 ? -450 / 0.08 : t < 0.5 ? (800 - C) / 0.12 : -d0 * (1 + 0.4 * Math.max(0, L - sp));
      } else {
        if (Lts == null) { Lts = L; Cts = C; }
        const u = t - ts;
        let Lt = Math.max(1.0, Lts - 2.0 * (1 - Math.exp(-u / 0.03)) - 1.4 * u / 0.25);
        if (o.adh === 'poor') Lt = Math.max(Lt, u > 1.5 ? Math.min(Lu, 3.3 + 0.6 * (u - 1.5)) : 3.3);
        L = Lt;
        dC = o.adh === 'poor' ? (L > 4 ? -d0 : -0.3 * d0) : (Math.min(1050, Cts + 500) - C) / 2.5;
      }
      C = clamp(C + dC * dt, 5, 1600);
      if (L < Math.log10(200)) { if (below == null) below = t; } else below = null;
      if (s % 4 === 0) out.push({ t, L, C, uu: below != null && t - below >= 0.5, on: t >= ts && t < tstop });
    }
    return out;
  }
  Hyper.sim('inf-hiv', {
    title: 'HIV over twenty years, with and without treatment',
    blurb: `An illustrative course of HIV infection: the viral load (copies of the virus per mL of blood) and the CD4 count (helper T cells per µL). The drop of blood is schematic: each circle is about 25 CD4 cells, and the red dots grow with the logarithm of the viral load.

- Tick **Never treated**: after the acute illness the CD4 count falls year by year, faster with a high set point, into the AIDS range below 200.
- Start treatment in year 1: the viral load falls below the limit of detection within months, the CD4 count recovers, and after six months below 200 copies/mL the virus is not passed on through sex — **U = U**.
- Start late (year 8): treatment still works, but the CD4 count recovers less.
- Choose **Misses many doses** or **Stops after 3 years**: the virus comes back, and with partial treatment resistance can develop.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 190 });
      const gb = graphBox(box);
      const pv = kit.plot(gb, { x: { label: 'years since infection', min: 0, max: 20 }, y: { label: 'viral load (copies/mL, log scale)', log: true, min: 10, max: 1e7 } }, 170);
      const pc4 = kit.plot(gb, { x: { label: 'years since infection', min: 0, max: 20 }, y: { label: 'CD4 count (cells/µL)', min: 0, max: 1200 } }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'sp', type: 'select', label: 'Set-point viral load, untreated', options: [['Low (about 3,000 copies/mL)', 3.5], ['Typical (about 30,000)', 4.5], ['High (about 300,000)', 5.5]], value: 4.5 },
        { id: 'never', type: 'check', label: 'Never treated', value: false },
        { id: 'ts', label: 'Treatment starts in year', min: 0.2, max: 15, step: 0.1, value: 1 },
        { id: 'adh', type: 'select', label: 'Treatment', options: [['Taken every day', 'good'], ['Misses many doses', 'poor'], ['Stops after 3 years', 'stop']], value: 'good' },
        { type: 'buttons', items: [{ id: 'go', label: 'Replay', primary: true }] }
      ], id => { if (id === 'go') t = 0; build(); });
      const ro = kit.readout(box.side, [['yr', 'Year'], ['vl', 'Viral load'], ['cd4', 'CD4 count'], ['stage', 'Stage'], ['tx', 'Passing HIV on through sex']]);
      const V = ctl.values;
      const rnd = kit.fin.uniforms(41);
      const inDisc = () => { let x, y; do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; } while (x * x + y * y > 0.86); return [x, y]; };
      const cellPos = Array.from({ length: 64 }, inDisc), virPos = Array.from({ length: 48 }, inDisc);
      let run = [], t = 0;
      function build() {
        run = hivRun({ sp: +V.sp, never: V.never, ts: V.ts, adh: V.adh });
        const C = kit.colors();
        const ts = V.never ? null : V.ts, tstop = !V.never && V.adh === 'stop' ? V.ts + 3 : null;
        const vl = [];
        if (ts != null && ts <= 20) vl.push({ x: ts, label: 'treatment starts' });
        if (tstop != null && tstop <= 20) vl.push({ x: tstop, label: 'stops' });
        pv.set({ hlines: [{ y: 200, label: 'U = U: below 200 copies/mL' }, { y: 50, label: 'limit of detection' }], vlines: vl });
        pc4.set({ hlines: [{ y: 200, label: 'AIDS range below 200' }, { y: 500, label: 'healthy range starts near 500 (labs vary)' }], vlines: vl, series: [{ pts: [], color: C.accent }] });
      }
      function at(time) { return run[Math.round(clamp(time / 20, 0, 1) * (run.length - 1))]; }
      const vlText = L => { const v = Math.pow(10, L); return v < 50 ? 'undetectable (below 50 copies/mL)' : big(Number(v.toPrecision(2))) + ' copies/mL'; };
      function stageText(s) {
        if (s.C < 200) return s.on ? 'on treatment, CD4 still in the AIDS range' : 'AIDS range: without treatment, life-threatening infections are likely';
        if (s.on) return s.L < Math.log10(50) ? 'on treatment, virus suppressed' : V.adh === 'poor' && s.t - V.ts > 0.5 ? 'on treatment, but the virus is not suppressed' : 'on treatment, virus falling';
        if (s.t < 0.25) return 'acute infection';
        return s.C >= 350 ? 'chronic infection, often without symptoms' : 'chronic infection, immune system weakening';
      }
      function draw(dt) {
        t = Math.min(20, t + (dt || 0) * 1.3);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const s = at(t);
        // a drop of blood (schematic)
        const R = Math.min(Hh * 0.4, 78), cx = 16 + R, cy = Hh * 0.5;
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fillStyle = C.dark ? 'rgba(229,72,77,0.12)' : 'rgba(229,72,77,0.08)'; c.fill(); c.strokeStyle = C.bad; c.lineWidth = 1.5; c.stroke();
        const nC = Math.min(cellPos.length, Math.round(s.C / 25)), nV = Math.min(virPos.length, Math.round(clamp(s.L - 1.3, 0, 6) * 7.5));
        for (let i = 0; i < nC; i++) { const p = cellPos[i]; c.beginPath(); c.arc(cx + p[0] * R, cy + p[1] * R, 4.5, 0, Math.PI * 2); c.fillStyle = kit.hue(215, 0.35); c.fill(); c.strokeStyle = kit.hue(215); c.lineWidth = 1.2; c.stroke(); }
        for (let i = 0; i < nV; i++) { const p = virPos[i]; kit.dot(c, cx + p[0] * R, cy + p[1] * R, 2.2, C.bad); }
        kit.label(c, '1 µL of blood (schematic)', cx, cy + R + 12, { size: 10.5, color: C.muted, align: 'center' });
        // the timeline
        const tx0 = cx + R + 30, tx1 = W - 16, ty = 34, X = yr => tx0 + yr / 20 * (tx1 - tx0);
        c.fillStyle = C.bg2; c.fillRect(tx0, ty, tx1 - tx0, 14);
        let a0 = null;
        const band = (p, q, col) => { c.fillStyle = col; c.fillRect(X(p), ty, Math.max(1, X(q) - X(p)), 14); };
        run.forEach((r, i) => {
          if (r.C < 200 && a0 == null) a0 = r.t;
          if ((r.C >= 200 || i === run.length - 1) && a0 != null) { band(a0, r.t, C.dark ? 'rgba(229,72,77,0.55)' : 'rgba(229,72,77,0.45)'); a0 = null; }
        });
        if (!V.never && V.ts < 20) band(V.ts, V.adh === 'stop' ? Math.min(20, V.ts + 3) : 20, kit.hue(150, 0.45));
        c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(tx0, ty, tx1 - tx0, 14);
        for (let yr = 0; yr <= 20; yr += 5) kit.label(c, String(yr), X(yr), ty + 26, { size: 10.5, color: C.muted, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(t), ty - 5); c.lineTo(X(t), ty + 19); c.stroke();
        kit.label(c, 'green: on treatment · red: CD4 below 200', tx0, ty - 12, { size: 11, color: C.muted });
        kit.label(c, 'Year ' + t.toFixed(1), tx0, ty + 56, { size: 18, weight: 650 });
        kit.label(c, 'CD4 ' + Math.round(s.C) + ' cells/µL · viral load ' + vlText(s.L), tx0, ty + 80, { size: 12.5, color: C.text2 });
        kit.label(c, stageText(s), tx0, ty + 102, { size: 12.5, color: s.C < 200 ? C.bad : C.muted });
        if (s.uu) kit.label(c, 'U = U', tx1 - 4, ty + 60, { size: 18, weight: 700, color: C.ok, align: 'right', bg: C.bg2 });
        // the graphs, drawn up to now
        const vis = run.filter(r => r.t <= t);
        pv.set({ series: [{ pts: vis.map(r => [r.t, Math.max(10, Math.pow(10, r.L))]), color: C.bad, label: 'viral load' }] });
        pc4.set({ series: [{ pts: vis.map(r => [r.t, r.C]), color: kit.hue(215), label: 'CD4 count' }] });
        ro.set('yr', t.toFixed(1));
        ro.set('vl', vlText(s.L));
        ro.set('cd4', Math.round(s.C) + ' cells/µL');
        ro.set('stage', stageText(s));
        ro.set('tx', s.uu ? 'no: undetectable = untransmittable' : s.L < Math.log10(200) ? 'below 200 copies/mL; U = U after 6 months there' : 'possible — condoms, or PrEP for partners, protect');
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8 · malaria between mosquitoes and people */
  // Ross–Macdonald with illustrative numbers: a bites per mosquito per day on people, b and c the chances of
  // infection per bite (mosquito → person, person → mosquito), g mosquito deaths per day, n days for the parasite in the mosquito
  const MAL = { a: 0.3, b: 0.5, c: 0.09, g: 0.1, n: 10, rBase: 1 / 150, years: 4 };
  const malBites = u => MAL.a * (1 - 0.72 * u);                 // nets stop most bites on the people under them
  const malDeath = u => MAL.g + MAL.a * u * 0.5;                // and the insecticide kills mosquitoes that try
  function malR(m, u, dur) { const a = malBites(u), g = malDeath(u); return m * a * a * MAL.b * MAL.c * Math.exp(-g * MAL.n) * dur / g; }
  function malRun(o) {
    const out = [], dt = 0.25;
    let x = 0.02, y = 0.02;
    for (let s = 0, N = Math.round(MAL.years * 365 / dt); s <= N; s++) {
      const t = s * dt, on = t >= 365;
      const u = on ? o.u : 0, r = on ? 1 / o.dur : MAL.rBase, a = malBites(u), g = malDeath(u);
      const z = y * Math.exp(-g * MAL.n);
      if (s % 8 === 0) out.push({ t: t / 365, x, z, eir: o.m * a * z * 365 });
      const dx = o.m * a * MAL.b * z * (1 - x) - r * x, dy = a * MAL.c * x * (1 - y) - g * y;
      x = clamp(x + dx * dt, 0, 1); y = clamp(y + dy * dt, 0, 1);
    }
    return out;
  }
  Hyper.sim('inf-malaria', {
    title: 'Malaria: mosquitoes, people and bed nets',
    blurb: `A village of 64 people in eight houses, and its mosquitoes. People infected with malaria parasites are red; infectious mosquitoes are red too. For the first year nothing is done; from year 1 the measures you choose begin. The model is the classic Ross–Macdonald one with round illustrative numbers.

- Give nets to 60 % of people: fewer bites, and the insecticide kills mosquitoes before the parasite inside them is ready — R falls from about 22 to about 1.5.
- Add **prompt testing and treatment**: people are infectious for weeks instead of months, and R drops below 1 — malaria fades away.
- Raise the mosquito numbers (a wet season, standing water): the same measures are no longer enough.
- Because a mosquito must survive about 10 days before its bite is infectious, anything that shortens mosquito lives has a large effect.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const plot = kit.plot(graphBox(box), { x: { label: 'years', min: 0, max: MAL.years }, y: { label: '%', min: 0, max: 100 } }, 180);
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Mosquitoes per person', min: 1, max: 40, step: 1, value: 10 },
        { id: 'u', label: 'People sleeping under treated nets (from year 1)', min: 0, max: 100, step: 5, value: 60, unit: '%' },
        { id: 'dur', type: 'select', label: 'Testing and treatment (from year 1)', options: [['Few fevers tested or treated (infection lasts months)', 150], ['Most fevers tested and treated within days', 20]], value: 150 },
        { type: 'buttons', items: [{ id: 'go', label: 'Run again', primary: true }] }
      ], id => { if (id === 'go') t = 0; build(); });
      const ro = kit.readout(box.side, [['yr', 'Year'], ['r0', 'R₀ before any measures'], ['r', 'R with these measures'], ['x', 'People infected'], ['eir', 'Infectious bites per person per year']]);
      const V = ctl.values;
      const rnd = kit.fin.uniforms(51);
      const personOrder = shuffled(64, kit.fin.uniforms(52));
      const bugs = Array.from({ length: 130 }, () => ({ x: rnd(), y: rnd(), vx: rnd() - 0.5, vy: rnd() - 0.5 }));
      let run = [], t = 0;
      function build() {
        run = malRun({ m: V.m, u: V.u / 100, dur: +V.dur });
        const C = kit.colors();
        plot.set({
          series: [{ pts: run.map(r => [r.t, 100 * r.x]), color: C.bad, label: 'people infected (%)' }, { pts: run.map(r => [r.t, Math.min(100, 1000 * r.z)]), color: C.warn, label: 'infectious mosquitoes (% × 10)' }],
          vlines: [{ x: 1, label: 'measures start' }]
        });
      }
      function at(time) { return run[Math.round(clamp(time / MAL.years, 0, 1) * (run.length - 1))]; }
      function draw(dt) {
        const d = Math.min(dt || 0, 0.05);
        t = Math.min(MAL.years, t + d * 0.28);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const s = at(t), on = t >= 1, u = on ? V.u / 100 : 0;
        // eight houses of eight people
        const vx0 = 12, vx1 = Math.max(vx0 + 200, W * 0.68), vy0 = 26, vy1 = Hh - 12;
        const hw = (vx1 - vx0) / 4, hh = (vy1 - vy0) / 2;
        const nNet = Math.round(64 * u), nInf = Math.round(64 * s.x);
        const infected = new Set(personOrder.slice(0, nInf));
        for (let h = 0; h < 8; h++) {
          const hx = vx0 + (h % 4) * hw + 8, hy = vy0 + Math.floor(h / 4) * hh + 18, w = hw - 16, ht = hh - 30;
          c.fillStyle = C.bg2; c.fillRect(hx, hy, w, ht);
          c.strokeStyle = C.border2; c.lineWidth = 1.2; c.strokeRect(hx, hy, w, ht);
          c.beginPath(); c.moveTo(hx - 5, hy); c.lineTo(hx + w / 2, hy - 14); c.lineTo(hx + w + 5, hy); c.closePath(); c.fillStyle = C.surface; c.fill(); c.stroke();
          for (let p = 0; p < 8; p++) {
            const i = h * 8 + p, px = hx + w * (0.14 + (p % 4) * 0.24), py = hy + ht * (0.32 + Math.floor(p / 4) * 0.42);
            kit.dot(c, px, py, 4.5, infected.has(i) ? C.bad : C.muted);
            if (i < nNet) { c.beginPath(); c.arc(px, py + 3, 9, Math.PI, 0); c.strokeStyle = kit.hue(200); c.setLineDash([2, 2]); c.lineWidth = 1.3; c.stroke(); c.setLineDash([]); }
          }
        }
        // mosquitoes
        const nm = Math.min(bugs.length, 3 * V.m + 6), ninf = Math.round(nm * clamp(s.z * 4, 0, 1));
        for (let i = 0; i < nm; i++) {
          const b = bugs[i];
          b.vx += (rnd() - 0.5) * 2 * d; b.vy += (rnd() - 0.5) * 2 * d;
          b.vx = clamp(b.vx, -0.6, 0.6); b.vy = clamp(b.vy, -0.6, 0.6);
          b.x += b.vx * d * 0.25; b.y += b.vy * d * 0.25;
          if (b.x < 0 || b.x > 1) { b.vx = -b.vx; b.x = clamp(b.x, 0, 1); }
          if (b.y < 0 || b.y > 1) { b.vy = -b.vy; b.y = clamp(b.y, 0, 1); }
          const x = vx0 + b.x * (vx1 - vx0), y = vy0 + b.y * (vy1 - vy0), col = i < ninf ? C.bad : C.text2;
          c.strokeStyle = col; c.lineWidth = 1;
          c.beginPath(); c.moveTo(x - 3, y - 2); c.lineTo(x, y); c.lineTo(x + 3, y - 2); c.stroke();
          kit.dot(c, x, y, 1.4, col);
        }
        kit.label(c, 'year ' + t.toFixed(1) + (on ? ' — nets and treatment as chosen' : ' — no measures yet'), vx0, 11, { size: 11.5, color: C.muted });
        // the numbers
        const bx = vx1 + 20;
        const r0 = malR(V.m, 0, 150), r = malR(V.m, V.u / 100, +V.dur);
        kit.label(c, 'R₀ before measures: ' + r0.toFixed(1), bx, 44, { size: 13, color: C.text2 });
        kit.label(c, 'R with measures: ' + r.toFixed(2), bx, 68, { size: 15, weight: 650, color: r < 1 ? C.ok : C.bad });
        kit.label(c, r < 1 ? 'malaria fades out' : 'malaria persists', bx, 90, { size: 11.5, color: C.muted });
        kit.label(c, 'people infected: ' + pc(s.x), bx, 122, { size: 13, color: C.bad });
        kit.label(c, 'infectious bites a year: ' + (s.eir < 10 ? s.eir.toFixed(1) : Math.round(s.eir)), bx, 144, { size: 12, color: C.text2 });
        kit.label(c, '◠ treated bed net', bx, 176, { size: 11.5, color: kit.hue(200) });
        plot.set({ marks: [{ x: s.t, y: 100 * s.x, color: C.bad }] });
        ro.set('yr', t.toFixed(1));
        ro.set('r0', r0.toFixed(1));
        ro.set('r', r.toFixed(2) + (r < 1 ? ' — below 1' : ''));
        ro.set('x', pc(s.x));
        ro.set('eir', s.eir < 10 ? s.eir.toFixed(1) : String(Math.round(s.eir)));
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
