/* HYPER-PHYSICS · sims/nuclear-condensed.js — simulations for nuclear and particle
 * physics and for condensed matter. Every id starts with nc-. The file is wrapped in a
 * function so its helpers stay private. */
(function () {
  'use strict';
  const FONT = () => getComputedStyle(document.body).fontFamily;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmt = (v, s) => Hyper.util.fmt(v, s || 3);

  /* A framed graph area: grid, ticks and axis labels. r = {l, t, w, h};
     sx, sy = {min, max, log?, label?, fmt?}. Returns the mapping {X, Y}. */
  function frame(c, C, r, sx, sy) {
    const X = sx.log ? v => r.l + Math.log(v / sx.min) / Math.log(sx.max / sx.min) * r.w
                     : v => r.l + (v - sx.min) / (sx.max - sx.min) * r.w;
    const Y = sy.log ? v => r.t + r.h - Math.log(v / sy.min) / Math.log(sy.max / sy.min) * r.h
                     : v => r.t + r.h - (v - sy.min) / (sy.max - sy.min) * r.h;
    const ticks = (s, n) => {
      const out = [];
      if (s.log) {
        for (let e = Math.ceil(Math.log10(s.min) - 1e-9); e <= Math.floor(Math.log10(s.max) + 1e-9); e++) out.push(Math.pow(10, e));
        return out;
      }
      const step = Hyper.niceStep(s.max - s.min, n);
      for (let v = Math.ceil(s.min / step - 1e-9) * step; v <= s.max + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
      return out;
    };
    c.save();
    c.font = '11px ' + FONT();
    c.lineWidth = 1;
    for (const v of ticks(sx, Math.max(3, Math.floor(r.w / 70)))) {
      const x = Math.round(X(v)) + 0.5;
      c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, r.t); c.lineTo(x, r.t + r.h); c.stroke();
      c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
      c.fillText(sx.fmt ? sx.fmt(v) : fmt(v, 3), x, r.t + r.h + 4);
    }
    for (const v of ticks(sy, Math.max(3, Math.floor(r.h / 40)))) {
      const y = Math.round(Y(v)) + 0.5;
      c.strokeStyle = C.grid; c.beginPath(); c.moveTo(r.l, y); c.lineTo(r.l + r.w, y); c.stroke();
      c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle';
      c.fillText(sy.fmt ? sy.fmt(v) : fmt(v, 3), r.l - 5, y);
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.3;
    c.beginPath(); c.moveTo(r.l, r.t); c.lineTo(r.l, r.t + r.h); c.lineTo(r.l + r.w, r.t + r.h); c.stroke();
    c.fillStyle = C.text2; c.font = '600 11.5px ' + FONT();
    if (sx.label) { c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(sx.label, r.l + r.w, r.t + r.h + 30); }
    if (sy.label) { c.save(); c.translate(r.l - 38, r.t); c.rotate(-Math.PI / 2); c.textAlign = 'right'; c.textBaseline = 'top'; c.fillText(sy.label, 0, 0); c.restore(); }
    c.restore();
    return { X, Y };
  }

  /* ================================================================ binding energy curve */
  Hyper.sim('nc-binding-curve', {
    title: 'The binding-energy curve',
    blurb: `Each dot is a nucleus: its height is the **binding energy per nucleon**, how tightly each of its protons and neutrons is held. Point at a dot (or use the slider) to read it off; open dots are radioactive fragments.

- Pick **Fission of uranium-235**: both fragments sit higher on the curve than uranium, so energy comes out.
- Pick **Fusion of deuterium and tritium**: a big climb on the steep left side — far more energy per nucleon than fission.
- Pick **Breaking up iron**: going downhill from the peak costs energy; that is what collapses the core of a massive star.
- Tick **Liquid-drop model** to see how well the semi-empirical formula follows the measured values.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6 });
      // name, Z, A, binding energy per nucleon (MeV), radioactive fragment?
      const NUC = [
        ['n, H-1', 0, 1, 0], ['H-2', 1, 2, 1.112], ['H-3', 1, 3, 2.827, true], ['He-3', 2, 3, 2.573], ['He-4', 2, 4, 7.074],
        ['Li-6', 3, 6, 5.332], ['Li-7', 3, 7, 5.606], ['Be-9', 4, 9, 6.463], ['B-10', 5, 10, 6.475], ['B-11', 5, 11, 6.928],
        ['C-12', 6, 12, 7.680], ['C-13', 6, 13, 7.470], ['N-14', 7, 14, 7.476], ['O-16', 8, 16, 7.976], ['F-19', 9, 19, 7.779],
        ['Ne-20', 10, 20, 8.032], ['Na-23', 11, 23, 8.112], ['Mg-24', 12, 24, 8.261], ['Al-27', 13, 27, 8.332], ['Si-28', 14, 28, 8.448],
        ['P-31', 15, 31, 8.481], ['S-32', 16, 32, 8.493], ['Cl-35', 17, 35, 8.520], ['Ca-40', 20, 40, 8.551], ['Ti-48', 22, 48, 8.723],
        ['Cr-52', 24, 52, 8.776], ['Fe-56', 26, 56, 8.790], ['Ni-62', 28, 62, 8.795], ['Cu-63', 29, 63, 8.752], ['Zn-64', 30, 64, 8.736],
        ['Kr-84', 36, 84, 8.717], ['Sr-88', 38, 88, 8.733], ['Zr-90', 40, 90, 8.710], ['Kr-92', 36, 92, 8.513, true], ['Mo-98', 42, 98, 8.635],
        ['Ag-107', 47, 107, 8.554], ['Sn-120', 50, 120, 8.505], ['Xe-132', 54, 132, 8.428], ['Ba-138', 56, 138, 8.393], ['Ba-141', 56, 141, 8.326, true],
        ['Nd-142', 60, 142, 8.346], ['Er-166', 68, 166, 8.142], ['W-184', 74, 184, 8.005], ['Au-197', 79, 197, 7.916], ['Pb-208', 82, 208, 7.868],
        ['Bi-209', 83, 209, 7.848], ['Th-232', 90, 232, 7.615], ['Th-234', 90, 234, 7.597, true], ['U-235', 92, 235, 7.591], ['U-238', 92, 238, 7.570],
        ['Pu-239', 94, 239, 7.560]
      ];
      const byName = n => NUC.findIndex(x => x[0] === n || x[0].split(', ').includes(n));
      const B = i => NUC[i][2] * NUC[i][3];
      // reactions: reactants and products (names, with counts), Q from atomic masses
      const RX = {
        none: null,
        fis: { eq: 'U-235 + n → Ba-141 + Kr-92 + 3 n', before: [['U-235', 1], ['n', 1]], after: [['Ba-141', 1], ['Kr-92', 1], ['n', 3]], log: false,
               note: 'Later decays of the fragments add about 25 MeV more.' },
        dt: { eq: 'H-2 + H-3 → He-4 + n', before: [['H-2', 1], ['H-3', 1]], after: [['He-4', 1], ['n', 1]], log: true, note: 'The reaction planned for fusion power plants.' },
        dd: { eq: 'H-2 + H-2 → He-3 + n', before: [['H-2', 2]], after: [['He-3', 1], ['n', 1]], log: true, note: 'Harder to ignite than D–T, and less energetic.' },
        sun: { eq: '4 H-1 → He-4 + 2 e⁺ + 2 ν', before: [['H-1', 4]], after: [['He-4', 1]], log: true, Q: 26.73,
               note: '1.6 MeV of the binding goes into turning 2 protons into neutrons.' },
        he: { eq: '3 He-4 → C-12', before: [['He-4', 3]], after: [['C-12', 1]], log: true, note: 'Helium burning in red giants (the triple-alpha process).' },
        alpha: { eq: 'U-238 → Th-234 + He-4', before: [['U-238', 1]], after: [['Th-234', 1], ['He-4', 1]], log: true, note: 'The energy leaves as kinetic energy of the alpha particle.' },
        fe: { eq: 'Fe-56 → 13 He-4 + 4 n', before: [['Fe-56', 1]], after: [['He-4', 13], ['n', 4]], log: true,
              note: 'In a collapsing star core this drains energy and speeds the collapse.' }
      };
      const iFe = byName('Fe-56');
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Show a reaction', value: RX[params.rx] ? params.rx : 'none', options: [['None — explore the curve', 'none'], ['Fission of uranium-235', 'fis'],
          ['Fusion of deuterium and tritium', 'dt'], ['Fusion of two deuterons', 'dd'], ['Hydrogen to helium in the Sun', 'sun'],
          ['Helium burning to carbon', 'he'], ['Alpha decay of uranium-238', 'alpha'], ['Breaking up iron', 'fe']] },
        { id: 'pick', label: 'Nucleus', min: 0, max: NUC.length - 1, step: 1, value: iFe, fmt: v => NUC[clamp(Math.round(v), 0, NUC.length - 1)][0] },
        { id: 'log', type: 'check', label: 'Stretch the light nuclei (log scale)', value: !!(RX[params.rx] && RX[params.rx].log) },
        { id: 'ld', type: 'check', label: 'Liquid-drop model', value: false }
      ], (id, v) => {
        if (id === 'rx' && RX[v]) ctl.set('log', RX[v].log);
        loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Nucleus'], ['ba', 'B per nucleon'], ['b', 'Total binding energy'], ['q', 'Energy released']]);
      const V = ctl.values;

      // liquid-drop curve along the valley of stability (no pairing)
      const semf = A => {
        const aV = 15.8, aS = 18.3, aC = 0.714, aA = 23.2;
        const Z = A / (2 + aC / (2 * aA) * Math.pow(A, 2 / 3));
        return (aV * A - aS * Math.pow(A, 2 / 3) - aC * Z * (Z - 1) / Math.pow(A, 1 / 3) - aA * (A - 2 * Z) * (A - 2 * Z) / A) / A;
      };
      let map = null, rect = null;
      const nearest = p => {
        if (!map) return -1;
        let best = -1, bd = 1e9;
        NUC.forEach((u, i) => { const d = Math.hypot(map.X(u[2]) - p.x, map.Y(u[3]) - p.y); if (d < bd) { bd = d; best = i; } });
        return bd < 40 ? best : -1;
      };
      kit.drag(st, {
        hit: p => (nearest(p) >= 0 ? 'pick' : null),
        move: (k, p) => { const i = nearest(p); if (i >= 0) { ctl.set('pick', i); loop.once(); } },
        hover: true
      });
      st.canvas.addEventListener('pointermove', e => { const i = nearest(st.pos(e)); if (i >= 0 && i !== Math.round(V.pick)) { ctl.set('pick', i); loop.once(); } });

      function draw(t) {
        const C = kit.colors();
        const c = st.begin();
        rect = { l: 58, t: 16, w: st.W - 76, h: st.H - 56 };
        map = frame(c, C, rect, { min: V.log ? 1 : 0, max: 260, log: V.log, label: 'mass number A' }, { min: 0, max: 9.5, label: 'B/A (MeV)' });
        const { X, Y } = map;
        // the peak
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint;
        c.beginPath(); c.moveTo(X(60), rect.t); c.lineTo(X(60), rect.t + rect.h); c.stroke(); c.restore();
        kit.label(c, 'iron peak', X(60) + 5, Y(9.3), { size: 11, color: C.muted });
        kit.label(c, 'fusion releases energy ←', X(V.log ? 20 : 30), Y(0.45), { size: 11, color: C.series[2], align: 'center' });
        kit.label(c, '→ fission releases energy', X(V.log ? 160 : 170), Y(0.45), { size: 11, color: C.series[1], align: 'center' });
        // measured curve through the stable nuclei
        c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.55; c.lineWidth = 1.6; c.beginPath();
        let first = true;
        for (const u of NUC) { if (u[4] || (V.log ? false : u[2] < 1)) continue; const x = X(u[2]), y = Y(u[3]); if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y); }
        c.stroke(); c.restore();
        if (V.ld) {
          c.save(); c.strokeStyle = C.series[3]; c.setLineDash([6, 4]); c.lineWidth = 1.8; c.beginPath();
          for (let A = 12; A <= 260; A += 2) { const y = Y(semf(A)); A === 12 ? c.moveTo(X(A), y) : c.lineTo(X(A), y); }
          c.stroke(); c.restore();
          kit.label(c, 'liquid-drop model', X(200), Y(semf(200)) + 16, { size: 11, color: C.series[3], align: 'center' });
        }
        // the reaction
        const rx = RX[V.rx];
        const involved = new Set();
        if (rx) {
          const bi = rx.before.map(([n, k]) => [byName(n), k]), ai = rx.after.map(([n, k]) => [byName(n), k]);
          // free nucleons sit at zero binding: draw arrows to or from them only when nothing else is there
          const arr = l => (l.length > 1 ? l.filter(([i]) => i !== 0) : l);
          bi.forEach(([i]) => involved.add(i)); ai.forEach(([i]) => involved.add(i));
          const ph = (t * 0.6) % 1;
          for (const [i] of arr(bi)) for (const [j] of arr(ai)) {
            if (i === j || i < 0 || j < 0) continue;
            const x1 = X(NUC[i][2]), y1 = Y(NUC[i][3]), x2 = X(NUC[j][2]), y2 = Y(NUC[j][3]);
            const col = NUC[j][3] >= NUC[i][3] ? C.ok : C.bad;
            kit.arrow(c, x1, y1, x2 + (x1 - x2) * 0.04, y2 + (y1 - y2) * 0.04, col, 2);
            kit.dot(c, x1 + (x2 - x1) * ph, y1 + (y2 - y1) * ph, 3, col);
          }
          const sb = bi.reduce((s, [i, k]) => s + k * B(i), 0), sa = ai.reduce((s, [i, k]) => s + k * B(i), 0);
          const Q = rx.Q != null ? rx.Q : sa - sb;
          const A0 = bi.reduce((s, [i, k]) => s + k * NUC[i][2], 0);
          const bx = rect.l + rect.w - 8, lines = [rx.eq, 'binding before: ' + sb.toFixed(1) + ' MeV', 'binding after: ' + sa.toFixed(1) + ' MeV',
            (Q >= 0 ? 'released: ' : 'absorbed: ') + Math.abs(Q).toFixed(1) + ' MeV (' + Math.abs(Q / A0).toFixed(2) + ' MeV per nucleon)', rx.note];
          lines.forEach((s, k) => kit.label(c, s, bx, rect.t + rect.h - 150 + k * 17, { size: k === 4 ? 10.5 : k ? 11.5 : 12.5, weight: k ? 500 : 700, align: 'right', color: k === 3 ? (Q >= 0 ? C.ok : C.bad) : k === 4 ? C.muted : C.text }));
          ro.set('q', (Q >= 0 ? '' : '−') + Math.abs(Q).toFixed(1) + ' MeV');
        } else ro.set('q', '—');
        // nuclei
        const pick = clamp(Math.round(V.pick), 0, NUC.length - 1);
        NUC.forEach((u, i) => {
          if (!V.log && u[2] < 1) return;
          const x = X(u[2]), y = Y(u[3]);
          const on = i === pick || involved.has(i);
          if (u[4]) { c.beginPath(); c.arc(x, y, on ? 5 : 3.5, 0, Math.PI * 2); c.strokeStyle = on ? C.text : C.muted; c.lineWidth = 1.4; c.stroke(); }
          else kit.dot(c, x, y, on ? 5 : 3.2, on ? C.text : C.accent);
          if (on || /^(He-4|C-12|O-16|Fe-56|U-238|H-2)$/.test(u[0])) kit.label(c, u[0], x + 6, y - 9, { size: 11, color: on ? C.text : C.muted, weight: on ? 700 : 500 });
        });
        const u = NUC[pick];
        ro.set('n', u[0] + (u[2] > 1 ? ' (Z = ' + u[1] + ', N = ' + (u[2] - u[1]) + ')' : ''));
        ro.set('ba', u[3].toFixed(3) + ' MeV');
        ro.set('b', (u[2] * u[3]).toFixed(1) + ' MeV');
      }
      const loop = kit.loop((dt, t) => draw(t), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ random decay of many nuclei */
  Hyper.sim('nc-decay', {
    title: 'Decay, one nucleus at a time',
    blurb: `Every square is a nucleus. Each second, each one decays with the same small probability — nobody decides which. The graph compares the count with the exponential law $N = N_0 (1/2)^{t/T_{1/2}}$.

- Start with **2500** nuclei: the count follows the curve closely, halving every half-life.
- Now try **16**: the count jumps about, and after one half-life you rarely have exactly 8.
- Run it several times: the same law, different details each time — that is what "random" means.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 190, maxH: 340 });
      const gbox = document.createElement('div');
      gbox.style.padding = '6px 10px 10px';
      box.stage.appendChild(gbox);
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'Number of nuclei', options: [['16', 16], ['100', 100], ['400', 400], ['2500', 2500]], value: 400 },
        { id: 'T', label: 'Half-life', min: 1, max: 10, step: 0.5, value: 3, unit: 's' },
        { id: 'law', type: 'check', label: 'Show the exponential law', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Start', primary: true }, { id: 'pause', label: 'Pause' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'go') { if (done()) reset(); running = true; }
        else if (id === 'pause') running = false;
        else if (id === 'reset' || id === 'n' || id === 'T') { reset(); }
        updatePlot(true);
        loop.once();
      });
      const ro = kit.readout(box.side, [['t', 'Time'], ['N', 'Undecayed'], ['E', 'Exponential law'], ['h', 'Half-lives elapsed']]);
      const plot = kit.plot(gbox, { x: { label: 'time (s)', min: 0 }, y: { label: 'undecayed nuclei', min: 0 }, legend: true }, 200);
      const V = ctl.values;
      let N0 = 0, alive = null, when = null, N = 0, t = 0, hist = [], running = false, lastPlot = -1;
      const done = () => N === 0 || t > 8 * V.T;
      function reset() {
        N0 = V.n; alive = new Uint8Array(N0).fill(1); when = new Float64Array(N0).fill(-1);
        N = N0; t = 0; hist = [[0, N0]]; running = false; lastPlot = -1;
      }
      function updatePlot(force) {
        if (!force && t - lastPlot < 0.1) return;
        lastPlot = t;
        const T = V.T, tmax = Math.max(4 * T, t * 1.05);
        const series = [{ pts: hist.slice(), label: 'simulated count', width: 2 }];
        if (V.law) {
          const law = [];
          for (let k = 0; k <= 120; k++) { const x = tmax * k / 120; law.push([x, N0 * Math.pow(0.5, x / T)]); }
          series.push({ pts: law, label: 'N₀ (1/2)^(t/T½)', dash: [6, 4] });
        }
        const vlines = [], hlines = [];
        for (let k = 1; k * T <= tmax; k++) vlines.push({ x: k * T });
        if (V.law) for (let k = 1; k <= 3; k++) hlines.push({ y: N0 / Math.pow(2, k) });
        plot.set({ series, vlines, hlines, x: { label: 'time (s) — dashed lines every half-life', min: 0, max: tmax }, y: { label: 'undecayed nuclei', min: 0, max: N0 * 1.05 } });
      }
      reset();
      updatePlot(true);
      function step(dt) {
        if (!running) return;
        const sub = Math.max(1, Math.ceil(dt / 0.02));
        const h = dt / sub, p = 1 - Math.exp(-Math.LN2 / V.T * h);
        for (let s = 0; s < sub; s++) {
          t += h;
          for (let i = 0; i < N0; i++) if (alive[i] && Math.random() < p) { alive[i] = 0; when[i] = t; N--; }
          hist.push([t, N]);
        }
        if (hist.length > 4000) hist = hist.filter((q, i) => i % 2 === 0 || i === hist.length - 1);
        if (done()) running = false;
        updatePlot(!running);
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        // lay the nuclei out in a grid that fits the stage
        const W = st.W - 20, H = st.H - 20;
        const cols = Math.max(1, Math.ceil(Math.sqrt(N0 * W / H))), rows = Math.ceil(N0 / cols);
        const cell = Math.max(2, Math.min(W / cols, H / rows));
        const x0 = (st.W - cols * cell) / 2, y0 = (st.H - rows * cell) / 2;
        const g = cell > 5 ? Math.max(1, cell * 0.12) : 0.5;
        for (let i = 0; i < N0; i++) {
          const x = x0 + (i % cols) * cell, y = y0 + Math.floor(i / cols) * cell;
          if (alive[i]) c.fillStyle = C.accent;
          else {
            const age = t - when[i];
            c.fillStyle = age < 0.25 && running ? C.warn : (C.dark ? 'rgba(160,170,200,.18)' : 'rgba(80,90,120,.16)');
          }
          c.fillRect(x + g / 2, y + g / 2, cell - g, cell - g);
        }
        if (!running && t === 0) kit.label(c, 'press Start', st.W / 2, st.H / 2, { align: 'center', size: 15, weight: 700, color: C.text, bg: C.bg2 });
        const law = N0 * Math.pow(0.5, t / V.T);
        ro.set('t', t.toFixed(1) + ' s');
        ro.set('N', N + ' of ' + N0);
        ro.set('E', law.toFixed(law < 10 ? 1 : 0));
        ro.set('h', (t / V.T).toFixed(2));
      }
      const loop = kit.loop(dt => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ radiocarbon dating by counting */
  Hyper.sim('nc-carbon-dating', {
    title: 'Dating a sample by counting decays',
    blurb: `A sample of old carbon sits in a low-background counter. Press **Count** and decays (plus a little background) pile up; the measured activity per gram, with its statistical uncertainty, is read off the decay curve as an age.

- Date the tomb wood, then the mammoth bone with the same counting time: the error bar grows enormously.
- Count four times as long: the uncertainty halves, as $1/\\sqrt N$ predicts.
- Try the 60 000-year-old sample: its signal drowns in the background, and all you can say is "older than…".`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      const A0 = 0.23, TH = 5730, TAU = TH / Math.LN2, EFF = 0.8, BG = 0.01;   // Bq/g, years, counter efficiency, background (counts/s)
      const ctl = kit.controls(box.side, [
        { id: 'age', type: 'select', label: 'Sample', value: 17000, options: [['Wood from an Egyptian tomb', 4600], ['Charcoal from a cave hearth', 17000],
          ['Mammoth bone', 38000], ['Very old charcoal', 60000], ['Fresh wood (for comparison)', 0]] },
        { id: 'm', label: 'Carbon in the counter', min: 1, max: 20, step: 1, value: 5, unit: 'g' },
        { id: 'T', label: 'Counting time', min: 1, max: 100, step: 1, value: 10, unit: 'h' },
        { id: 'show', type: 'check', label: 'Reveal the true age', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Count', primary: true }, { id: 'reset', label: 'Clear' }] }
      ], (id) => {
        if (id === 'go') start();
        else if (id !== 'show') clear();
        loop.once();
      });
      const ro = kit.readout(box.side, [['c', 'Counts (incl. background)'], ['tc', 'Counted for'], ['a', 'Activity per gram'], ['age', 'Radiocarbon age']]);
      const V = ctl.values;
      let counts = 0, tc = 0, counting = false, clicks = [];
      function clear() { counts = 0; tc = 0; counting = false; clicks = []; }
      function start() { clear(); counting = true; }
      const rate = () => A0 * Math.pow(0.5, V.age / TH) * V.m * EFF + BG;   // counts per second
      function poisson(mu) {
        if (mu > 30) return Math.max(0, Math.round(mu + Math.sqrt(mu) * gauss()));
        const L = Math.exp(-mu); let k = 0, p = 1;
        do { k++; p *= Math.random(); } while (p > L);
        return k - 1;
      }
      function gauss() { let u = 0, v = 0; while (u === 0) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
      // result of the measurement so far
      function result() {
        if (tc <= 0) return null;
        const secs = tc * 3600;
        const net = counts / secs - BG, sig = Math.sqrt(Math.max(counts, 1)) / secs;
        const a = net / (EFF * V.m), sa = sig / (EFF * V.m);
        if (net > 2 * sig) {
          const age = TAU * Math.log(A0 / a);
          return { a, sa, age, lo: TAU * Math.log(A0 / (a + sa)), hi: a - sa > 0 ? TAU * Math.log(A0 / (a - sa)) : Infinity };
        }
        const up = Math.max(net, 0) / (EFF * V.m) + 2 * sa;
        return { a, sa, limit: TAU * Math.log(A0 / up) };
      }
      function step(dt) {
        if (!counting) return;
        const hours = dt * 2 * Math.max(1, V.T / 10);      // the whole count takes about 5 s of real time
        const h = Math.min(hours, V.T - tc);
        const n = poisson(rate() * h * 3600);
        counts += n; tc += h;
        for (let k = 0; k < Math.min(n, 6); k++) clicks.push({ x: Math.random(), y: Math.random(), life: 0.35 });
        if (tc >= V.T - 1e-9) counting = false;
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const split = Math.min(170, st.W * 0.26);
        // the counter
        const cx = 14, cy = 24, cw = split - 28, chh = st.H - 70;
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect ? c.roundRect(cx, cy, cw, chh, 10) : c.rect(cx, cy, cw, chh); c.fill(); c.stroke();
        kit.label(c, 'counter', cx + cw / 2, cy - 11, { align: 'center', size: 11.5, color: C.muted });
        c.fillStyle = C.dark ? 'rgba(90,90,90,.55)' : 'rgba(60,60,60,.35)';
        c.fillRect(cx + cw * 0.2, cy + chh * 0.62, cw * 0.6, chh * 0.2);
        kit.label(c, V.m + ' g of carbon', cx + cw / 2, cy + chh * 0.72, { align: 'center', size: 11, color: C.dark ? '#ddd' : '#fff' });
        clicks = clicks.filter(k => (k.life -= dt) > 0);
        for (const k of clicks) kit.dot(c, cx + 10 + k.x * (cw - 20), cy + 10 + k.y * chh * 0.5, 3 + 6 * k.life, C.warn);
        kit.label(c, String(counts), cx + cw / 2, cy + chh * 0.3, { align: 'center', size: 22, weight: 700, color: C.text });
        kit.label(c, tc.toFixed(1) + ' h of ' + V.T + ' h', cx + cw / 2, cy + chh + 16, { align: 'center', size: 11, color: C.muted });
        // the decay curve
        const r = { l: split + 48, t: 18, w: st.W - split - 64, h: st.H - 58 };
        const { X, Y } = frame(c, C, r, { min: 0, max: 60000, label: 'age (years)', fmt: v => (v / 1000) + (v ? 'k' : '') }, { min: 0, max: 0.25, label: 'activity (Bq per g of carbon)' });
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let k = 0; k <= 200; k++) { const age = 60000 * k / 200, y = Y(A0 * Math.pow(0.5, age / TH)); k ? c.lineTo(X(age), y) : c.moveTo(X(age), y); }
        c.stroke(); c.restore();
        for (let k = 1; k * TH <= 60000; k++) kit.dot(c, X(k * TH), Y(A0 / Math.pow(2, k)), 2.5, C.faint);
        kit.label(c, 'one half-life, 5730 years, per step', X(22000), Y(0.2), { size: 11, color: C.muted });
        const R = result();
        if (V.show) {
          c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.ok; c.beginPath(); c.moveTo(X(V.age), r.t); c.lineTo(X(V.age), r.t + r.h); c.stroke(); c.restore();
          kit.label(c, 'true age', X(V.age) + 4, r.t + 10, { size: 11, color: C.ok });
        }
        ro.set('c', String(counts));
        ro.set('tc', tc.toFixed(1) + ' h');
        if (!R) { ro.set('a', '—'); ro.set('age', '—'); return; }
        // measured activity band, mapped to an age band
        const ya = Y(clamp(R.a, 0, 0.25)), y1 = Y(clamp(R.a + R.sa, 0, 0.25)), y2 = Y(clamp(R.a - R.sa, 0, 0.25));
        c.fillStyle = C.hue(28, 0.18); c.fillRect(r.l, y1, r.w, y2 - y1);
        c.strokeStyle = C.series[1]; c.lineWidth = 1.5; c.beginPath(); c.moveTo(r.l, ya); c.lineTo(r.l + r.w, ya); c.stroke();
        ro.set('a', R.a.toFixed(4) + ' ± ' + R.sa.toFixed(4) + ' Bq/g');
        if (R.age != null) {
          const xa = X(clamp(R.age, 0, 60000)), xlo = X(clamp(R.lo, 0, 60000)), xhi = X(clamp(R.hi, 0, 60000));
          c.fillStyle = C.hue(28, 0.28); c.fillRect(xlo, r.t, xhi - xlo, r.h);
          kit.dot(c, xa, ya, 5, C.series[1], C.bg2);
          const err = Number.isFinite(R.hi) ? Math.max(R.age - R.lo, R.hi - R.age) : Infinity;
          ro.set('age', Math.round(R.age / 10) * 10 + (Number.isFinite(err) ? ' ± ' + Math.round(err / 10) * 10 : ' (upper side open)') + ' years');
        } else {
          ro.set('age', Number.isFinite(R.limit) && R.limit > 0 ? 'older than ' + Math.round(R.limit / 100) * 100 + ' years' : 'no signal above background');
        }
      }
      const loop = kit.loop(dt => { step(dt); draw(dt); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ fission chain reaction */
  Hyper.sim('nc-chain-reaction', {
    title: 'Fission chain reaction',
    blurb: `A lump of fissile fuel (yellow nuclei), slowed down enormously. Fire a neutron in: when it strikes a nucleus it may split it, releasing 2 or 3 new neutrons — or it may be absorbed without fission, or escape through the surface. **k** is the average number of new neutrons each neutron goes on to make.

- With the defaults the lump is close to **critical**: fire 20 neutrons and watch the chain limp along.
- Raise the neutrons per fission, or cut the absorption (pull out the control rods): the population explodes — **supercritical**.
- Shrink the lump: more neutrons leak out of the surface and the chain dies — the idea behind the **critical mass**.
- The graph is logarithmic, so steady growth or decay shows as a straight line; burnt-up fuel eventually stops every chain.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 240 });
      const gbox = document.createElement('div');
      gbox.style.padding = '6px 10px 10px';
      box.stage.appendChild(gbox);
      const LAM = 2.0, SPEED = 9, RMAX = 12, SPACING = 0.62, CELL = 1.25, MAXN = 1500;   // cm, cm/s (slowed), neutron cap
      const ctl = kit.controls(box.side, [
        { id: 'nu', label: 'Neutrons per fission (average)', min: 1, max: 3, step: 0.1, value: 2.4 },
        { id: 'abs', label: 'Absorbed without fission', min: 0, max: 80, step: 1, value: 53, unit: '%' },
        { id: 'R', label: 'Radius of the fuel lump', min: 2, max: RMAX, step: 0.5, value: 8, unit: 'cm' },
        { type: 'buttons', items: [{ id: 'one', label: 'Fire a neutron', primary: true }, { id: 'burst', label: 'Fire 20' }, { id: 'fresh', label: 'Fresh fuel' }] }
      ], (id) => {
        if (id === 'one') fire(1);
        else if (id === 'burst') fire(20);
        else if (id === 'fresh' || id === 'R') { build(); estimate(); }
        else estimate();
        loop.once();
      });
      const ro = kit.readout(box.side, [['kinf', 'k if nothing leaked'], ['keff', 'k for this lump (fresh)'], ['kmeas', 'k measured'], ['n', 'Neutrons in flight'], ['f', 'Fissions'], ['fuel', 'Fuel used']]);
      const plot = kit.plot(gbox, { x: { label: 'time (s)', min: 0 }, y: { label: 'neutrons in flight', log: true, min: 0.8 } }, 170);
      const V = ctl.values;
      let nuc = [], grid = new Map(), neu = [], flashes = [], fissions = 0, t = 0, hist = [], born = [], alive = [], keff = 1, lastPt = -1;
      const key = (i, j) => i * 1000 + j;
      function build() {
        nuc = []; grid = new Map(); neu = []; flashes = []; fissions = 0; t = 0; hist = []; born = []; alive = []; lastPt = -1;
        const R = V.R, n = Math.ceil(R / SPACING) + 1;
        let seed = 12345;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
          const x = (i + (j & 1) * 0.5) * SPACING + (rnd() - 0.5) * 0.25, y = j * SPACING * 0.866 + (rnd() - 0.5) * 0.25;
          if (x * x + y * y > R * R) continue;
          const u = { x, y, on: true };
          nuc.push(u);
          const k = key(Math.floor(x / CELL) + 500, Math.floor(y / CELL) + 500);
          if (!grid.has(k)) grid.set(k, []);
          grid.get(k).push(u);
        }
        updatePlot();
      }
      // k of the fresh lump: nu (1 - a) times the chance a neutron interacts before leaking,
      // with the fission source iterated a few times so it settles into its natural shape
      function estimate() {
        const R = V.R;
        let src = [];
        let seed = 777;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        for (let k = 0; k < 1500; k++) { const r = R * Math.sqrt(rnd()), a = 2 * Math.PI * rnd(); src.push([r * Math.cos(a), r * Math.sin(a)]); }
        let pnl = 1;
        for (let it = 0; it < 6; it++) {
          const next = [];
          for (const [x, y] of src) {
            const s = -LAM * Math.log(1 - rnd() * 0.999999), a = 2 * Math.PI * rnd();
            const nx = x + s * Math.cos(a), ny = y + s * Math.sin(a);
            if (nx * nx + ny * ny <= R * R) next.push([nx, ny]);
          }
          pnl = next.length / src.length;
          if (!next.length) break;
          src = [];
          for (let k = 0; k < 1500; k++) src.push(next[Math.floor(rnd() * next.length)]);
        }
        keff = V.nu * (1 - V.abs / 100) * pnl;
      }
      function fire(n) {
        for (let k = 0; k < n; k++) spawn((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, 0);
      }
      function spawn(x, y, g) {
        born[g] = (born[g] || 0) + 1;
        if (neu.length >= MAXN) return;           // beyond the cap they are counted but not drawn
        const a = 2 * Math.PI * Math.random();
        alive[g] = (alive[g] || 0) + 1;
        neu.push({ x, y, vx: SPEED * Math.cos(a), vy: SPEED * Math.sin(a), g, tail: [] });
      }
      function nearestNucleus(x, y) {
        const ci = Math.floor(x / CELL) + 500, cj = Math.floor(y / CELL) + 500;
        let best = null, bd = CELL * CELL;
        for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) {
          const l = grid.get(key(i, j));
          if (!l) continue;
          for (const u of l) if (u.on) { const d = (u.x - x) * (u.x - x) + (u.y - y) * (u.y - y); if (d < bd) { bd = d; best = u; } }
        }
        return best;
      }
      function kMeasured() {
        let a = 0, b = 0, used = 0;
        for (let g = born.length - 2; g >= 0 && used < 4; g--) {
          if (!born[g] || (alive[g] || 0) > 0) continue;
          a += born[g + 1] || 0; b += born[g]; used++;
        }
        return b >= 8 ? a / b : null;
      }
      function step(dt) {
        if (!dt) return;
        t += dt;
        const R2 = V.R * V.R, p = 1 - Math.exp(-SPEED * dt / LAM), absorb = V.abs / 100;
        const out = [];
        for (const n of neu) {
          n.x += n.vx * dt; n.y += n.vy * dt;
          n.tail.push([n.x, n.y]); if (n.tail.length > 6) n.tail.shift();
          let gone = false;
          if (n.x * n.x + n.y * n.y > R2) { gone = true; flashes.push({ x: n.x, y: n.y, life: 0.3, kind: 'leak' }); }
          else if (Math.random() < p) {
            if (Math.random() < absorb) { gone = true; flashes.push({ x: n.x, y: n.y, life: 0.4, kind: 'abs' }); }
            else {
              const u = nearestNucleus(n.x, n.y);
              if (u) {
                u.on = false; gone = true; fissions++;
                flashes.push({ x: u.x, y: u.y, life: 0.5, kind: 'fis' });
                const m = Math.floor(V.nu) + (Math.random() < V.nu - Math.floor(V.nu) ? 1 : 0);
                for (let k = 0; k < m; k++) spawn(u.x, u.y, n.g + 1);
              }
            }
          }
          if (gone) alive[n.g]--; else out.push(n);
        }
        neu = out;
        flashes = flashes.filter(f => (f.life -= dt) > 0);
        if (t - lastPt >= 0.1) { lastPt = t; hist.push([t, neu.length]); if (hist.length > 1500) hist.shift(); updatePlot(); }
      }
      function updatePlot() {
        const pts = hist.map(([x, y]) => [x, Math.max(y, 0)]);
        const t0 = pts.length ? pts[0][0] : 0;
        plot.set({ series: [{ pts, label: 'neutrons in flight', fill: false }], x: { label: 'time (s)', min: t0, max: Math.max(t0 + 10, t) }, y: { label: 'neutrons in flight (log scale)', log: true, min: 0.8, max: Math.max(10, ...pts.map(q => q[1])) * 1.5 } });
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const sc = (Math.min(st.W, st.H) / 2 - 14) / RMAX, cx = st.W / 2, cy = st.H / 2;
        const X = x => cx + x * sc, Y = y => cy - y * sc;
        c.fillStyle = C.hue(48, 0.08); c.strokeStyle = C.hue(48, 0.55); c.lineWidth = 1.5;
        c.beginPath(); c.arc(cx, cy, V.R * sc, 0, Math.PI * 2); c.fill(); c.stroke();
        const r = Math.max(1.2, Math.min(3, SPACING * sc * 0.3));
        for (const u of nuc) kit.dot(c, X(u.x), Y(u.y), u.on ? r : r * 0.6, u.on ? C.hue(48, 0.95) : (C.dark ? 'rgba(150,150,160,.35)' : 'rgba(90,90,100,.3)'));
        for (const f of flashes) {
          if (f.kind === 'fis') { c.beginPath(); c.arc(X(f.x), Y(f.y), (0.6 - f.life) * 30 + 2, 0, Math.PI * 2); c.strokeStyle = C.warn; c.lineWidth = 2; c.globalAlpha = Math.min(1, f.life * 2); c.stroke(); c.globalAlpha = 1; }
          else if (f.kind === 'abs') { const x = X(f.x), y = Y(f.y); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 4, y - 4); c.lineTo(x + 4, y + 4); c.moveTo(x + 4, y - 4); c.lineTo(x - 4, y + 4); c.stroke(); }
          else kit.dot(c, X(f.x), Y(f.y), 3, C.muted);
        }
        c.strokeStyle = C.accent; c.lineWidth = 1.2;
        for (const n of neu) {
          if (n.tail.length > 1) { c.beginPath(); n.tail.forEach((q, i) => i ? c.lineTo(X(q[0]), Y(q[1])) : c.moveTo(X(q[0]), Y(q[1]))); c.stroke(); }
          kit.dot(c, X(n.x), Y(n.y), 2.6, C.text);
        }
        kit.label(c, 'fission', 12, 16, { size: 11, color: C.warn });
        kit.label(c, 'absorbed', 12, 32, { size: 11, color: C.bad });
        kit.label(c, 'leaked', 12, 48, { size: 11, color: C.muted });
        const state = keff < 0.97 ? 'subcritical' : keff > 1.03 ? 'supercritical' : 'about critical';
        kit.label(c, state, st.W - 12, 16, { size: 13, weight: 700, align: 'right', color: keff < 0.97 ? C.ok : keff > 1.03 ? C.bad : C.warn });
        const km = kMeasured();
        ro.set('kinf', (V.nu * (1 - V.abs / 100)).toFixed(2));
        ro.set('keff', keff.toFixed(2) + ' (' + state + ')');
        ro.set('kmeas', km == null ? '—' : km.toFixed(2));
        ro.set('n', String(neu.length));
        ro.set('f', String(fissions));
        ro.set('fuel', nuc.length ? (100 * fissions / nuc.length).toFixed(1) + ' %' : '—');
      }
      build(); estimate();
      const loop = kit.loop(dt => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ energy bands and the Fermi level */
  Hyper.sim('nc-bands', {
    title: 'Bands, gaps and the Fermi level',
    blurb: `Left: the allowed energy bands of a solid, shaded where states are occupied, with the Fermi level dashed. Right: the Fermi–Dirac occupation $f(E)$ at the chosen temperature. Dots are conduction electrons, rings are holes (their number grows with the *logarithm* of the carrier density).

- **Metal**: the band is only partly full, so electrons at the Fermi level always have empty states just above them.
- **Pure silicon**: warm it from 300 K to 600 K and watch the carrier density rise about a hundred-thousand-fold. Tick **logarithmic f(E)** to see the tiny tail of $f$ that reaches the conduction band.
- **n-type** and **p-type**: the Fermi level moves towards the band that supplies the carriers. Cool to 50 K and the donors or acceptors "freeze out"; heat to 1000 K and the material turns intrinsic again.
- **Insulator**: even at 1200 K almost nothing crosses a 5.5 eV gap.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const kB = 8.617333e-5;   // eV/K
      const MATS = {
        metal: { label: 'Metal (sodium)' },
        ins: { label: 'Insulator (diamond)', Eg0: 5.47, a: 0, b: 1, Nc: 1e19, Nv: 1e19, mun: 0.2, mup: 0.16 },
        si: { label: 'Pure silicon', Eg0: 1.17, a: 4.73e-4, b: 636, Nc: 2.8e19, Nv: 2.65e19, mun: 0.14, mup: 0.045 },
        n: { label: 'n-type silicon (phosphorus)', Eg0: 1.17, a: 4.73e-4, b: 636, Nc: 2.8e19, Nv: 2.65e19, mun: 0.14, mup: 0.045, dop: 'n' },
        p: { label: 'p-type silicon (boron)', Eg0: 1.17, a: 4.73e-4, b: 636, Nc: 2.8e19, Nv: 2.65e19, mun: 0.14, mup: 0.045, dop: 'p' }
      };
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material', value: MATS[params.mat] ? params.mat : 'si', options: Object.keys(MATS).map(k => [MATS[k].label, k]) },
        { id: 'T', label: 'Temperature', min: 10, max: 1200, step: 10, value: 300, unit: 'K' },
        { id: 'dop', label: 'Doping (n- and p-type)', min: 1e13, max: 1e19, value: 1e16, log: true, sig: 2, unit: 'cm⁻³' },
        { id: 'logf', type: 'check', label: 'Logarithmic f(E)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['gap', 'Band gap'], ['ef', 'Fermi level'], ['n', 'Conduction electrons'], ['p', 'Holes'], ['s', 'Conductivity']]);
      const V = ctl.values;
      const ex = x => Math.exp(clamp(x, -600, 600));
      const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
      const sci = v => {
        if (!(v > 0)) return '0';
        let e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e);
        if (m >= 9.995) { m /= 10; e++; }
        return (e >= -2 && e <= 3) ? String(Number(v.toPrecision(3))) : m.toFixed(2) + ' × 10' + String(e).split('').map(ch => SUP[ch]).join('');
      };
      // equilibrium of a semiconductor: find E_F (from the valence band edge) by charge neutrality
      function state() {
        const m = MATS[V.mat], T = Math.max(V.T, 1), kT = kB * T;
        if (V.mat === 'metal') {
          const EF = 3.24;
          return { metal: true, kT, EF, lo: -0.8, hi: 6.2, bands: [[0, 5.2]], n: 2.65e22, p: 0, sigma: 2.1e7 * 300 / Math.max(T, 20) };
        }
        const Eg = m.Eg0 - m.a * T * T / (T + m.b);
        const s = Math.pow(T / 300, 1.5), Nc = m.Nc * s, Nv = m.Nv * s;
        const ND = m.dop === 'n' ? V.dop : 0, NA = m.dop === 'p' ? V.dop : 0, ED = Eg - 0.045, EA = 0.045;
        const parts = EF => {
          const n = Nc * ex(-(Eg - EF) / kT), p = Nv * ex(-EF / kT);
          const Dp = ND / (1 + 2 * ex((EF - ED) / kT)), Am = NA / (1 + 4 * ex((EA - EF) / kT));
          return { n, p, Dp, Am, q: p + Dp - n - Am };
        };
        let EF, r;
        if (!ND && !NA) {
          // intrinsic: exact, and safe even when the carrier densities underflow
          EF = Eg / 2 + kT / 2 * Math.log(Nv / Nc);
          const ni = Math.sqrt(Nc * Nv) * Math.exp(-Eg / (2 * kT));
          r = { n: ni, p: ni, Dp: 0, Am: 0 };
        } else {
          let lo = -1, hi = Eg + 1;
          for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (parts(mid).q > 0) lo = mid; else hi = mid; }
          EF = (lo + hi) / 2; r = parts(EF);
        }
        const mob = Math.pow(T / 300, -1.5);
        const sigma = 1.602176634e-19 * 1e6 * (r.n * m.mun + r.p * m.mup) * mob;
        const pad = m.Eg0 > 3 ? 1.6 : 0.8;
        return { kT, Eg, EF, ED, EA, ND, NA, n: r.n, p: r.p, Dp: r.Dp, Am: r.Am, sigma, lo: -pad - 0.35, hi: Eg + pad + 0.35, bands: [[-pad - 2, 0], [Eg, Eg + pad + 2]] };
      }
      // carrier dots, kept between frames so they can wander
      const dotsE = [], dotsH = [];
      const count = n => (n > 1e7 ? Math.min(46, Math.round(4 * (Math.log10(n) - 7))) : 0);
      const sync = (arr, k) => { while (arr.length < k) arr.push({ u: Math.random(), v: Math.random() }); arr.length = k; };
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const S = state();
        const top = 16, bot = st.H - 28, wd = st.W * 0.58, x0 = 54, x1 = x0 + wd - 95, fx0 = x0 + wd - 15, fx1 = st.W - 18;
        const Y = E => bot - (E - S.lo) / (S.hi - S.lo) * (bot - top);
        const f = E => 1 / (ex((E - S.EF) / S.kT) + 1);
        // energy axis
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0 - 8, top); c.lineTo(x0 - 8, bot); c.stroke();
        kit.label(c, 'energy', x0 - 12, top + 4, { size: 11, color: C.muted, align: 'right' });
        kit.arrow(c, x0 - 8, top + 30, x0 - 8, top, C.axis, 1.2);
        // bands, shaded by occupation
        for (const [a, b] of S.bands) {
          const ya = Y(Math.max(a, S.lo)), yb = Y(Math.min(b, S.hi));
          c.fillStyle = C.hue(210, 0.1); c.fillRect(x0, yb, x1 - x0, ya - yb);
          const steps = Math.max(8, Math.round((ya - yb) / 2));
          for (let k = 0; k < steps; k++) {
            const E = Math.max(a, S.lo) + (Math.min(b, S.hi) - Math.max(a, S.lo)) * (k + 0.5) / steps, occ = f(E);
            if (occ < 0.004) continue;
            c.fillStyle = C.hue(210, 0.55 * occ);
            const y = Y(E);
            c.fillRect(x0, y - (ya - yb) / steps / 2 - 0.5, x1 - x0, (ya - yb) / steps + 1);
          }
          c.strokeStyle = C.hue(210, 0.8); c.lineWidth = 1.2; c.strokeRect(x0, yb, x1 - x0, ya - yb);
        }
        if (S.metal) {
          kit.label(c, 'partly filled band', (x0 + x1) / 2, Y(4.7), { align: 'center', size: 11.5, color: C.text2 });
          kit.label(c, 'bottom of band', x1 + 4, Y(0), { size: 10.5, color: C.muted });
        } else {
          kit.label(c, 'conduction band', (x0 + x1) / 2, Y(Math.min(S.Eg + 0.3, S.hi - 0.08)), { align: 'center', size: 11.5, color: C.text2, bg: C.bg2 });
          kit.label(c, 'valence band (full)', (x0 + x1) / 2, Y(-0.35), { align: 'center', size: 11.5, color: C.text2, bg: C.bg2 });
          kit.label(c, 'gap ' + S.Eg.toFixed(2) + ' eV', x1 + 4, Y(S.Eg / 2) + 10, { size: 10.5, color: C.muted });
          // dopant levels
          if (S.ND || S.NA) {
            const isN = !!S.ND, E0 = isN ? S.ED : S.EA, y = Y(E0), frac = isN ? S.Dp / S.ND : S.Am / S.NA, nI = 12;
            for (let k = 0; k < nI; k++) {
              const x = x0 + (x1 - x0) * (k + 0.5) / nI, ion = k < Math.round(frac * nI);
              c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x + 6, y); c.stroke();
              if (ion) kit.label(c, isN ? '+' : '−', x, y + (isN ? 8 : -8), { align: 'center', size: 12, weight: 700, color: isN ? C.bad : C.accent });
              else if (isN) kit.dot(c, x, y - 4, 2.8, C.text);
              else { c.beginPath(); c.arc(x, y + 4, 2.8, 0, Math.PI * 2); c.strokeStyle = C.text; c.lineWidth = 1.3; c.stroke(); }
            }
            kit.label(c, isN ? 'donors' : 'acceptors', x1 + 4, y, { size: 10.5, color: C.muted });
          }
          // carriers
          sync(dotsE, count(S.n)); sync(dotsH, count(S.p));
          const jig = a => { for (const d of a) { d.u = (d.u + (Math.random() - 0.5) * 0.02 + 1) % 1; d.v = clamp(d.v + (Math.random() - 0.5) * 0.04, 0, 1); } };
          if (dt) { jig(dotsE); jig(dotsH); }
          const spread = Math.min(0.45, 3 * S.kT);
          for (const d of dotsE) kit.dot(c, x0 + 6 + d.u * (x1 - x0 - 12), Y(S.Eg + 0.02 + d.v * spread), 2.8, C.text);
          for (const d of dotsH) { c.beginPath(); c.arc(x0 + 6 + d.u * (x1 - x0 - 12), Y(-0.02 - d.v * spread), 3, 0, Math.PI * 2); c.strokeStyle = C.series[1]; c.lineWidth = 1.5; c.stroke(); }
        }
        // f(E) panel
        c.strokeStyle = C.axis; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(fx0, top); c.lineTo(fx0, bot); c.lineTo(fx1, bot); c.stroke();
        const fX = V.logf ? v => fx0 + (Math.log10(Math.max(v, 1e-12)) + 12) / 12 * (fx1 - fx0) : v => fx0 + v * (fx1 - fx0);
        for (const [a, b] of S.bands) { const ya = Y(Math.max(a, S.lo)), yb = Y(Math.min(b, S.hi)); c.fillStyle = C.hue(210, 0.07); c.fillRect(fx0, yb, fx1 - fx0, ya - yb); }
        c.fillStyle = C.muted; c.font = '11px ' + FONT(); c.textAlign = 'center'; c.textBaseline = 'top';
        const ticks = V.logf ? [[1e-12, '10⁻¹²'], [1e-6, '10⁻⁶'], [1, '1']] : [[0, '0'], [0.5, '½'], [1, '1']];
        for (const [v, s] of ticks) { c.fillText(s, fX(v), bot + 4); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(fX(v), top); c.lineTo(fX(v), bot); c.stroke(); }
        kit.label(c, 'f(E), occupation', fx1, top + 2, { align: 'right', size: 11, color: C.muted });
        c.save(); c.strokeStyle = C.series[2]; c.lineWidth = 2.2; c.beginPath();
        for (let k = 0; k <= 240; k++) { const E = S.lo + (S.hi - S.lo) * k / 240, x = fX(f(E)); k ? c.lineTo(x, Y(E)) : c.moveTo(x, Y(E)); }
        c.stroke(); c.restore();
        // the Fermi level across both panels
        const yF = Y(S.EF);
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x0, yF); c.lineTo(fx1, yF); c.stroke(); c.restore();
        kit.label(c, 'Fermi level', fx0 - 4, yF - 9, { align: 'right', size: 11.5, weight: 700, color: C.warn, bg: C.bg2 });
        // readouts
        if (S.metal) {
          ro.set('gap', 'none — the band is partly filled');
          ro.set('ef', '3.24 eV above the band bottom');
          ro.set('n', sci(S.n) + ' cm⁻³ (all free)');
          ro.set('p', '—');
        } else {
          ro.set('gap', S.Eg.toFixed(3) + ' eV');
          ro.set('ef', (S.EF).toFixed(3) + ' eV above the valence band');
          ro.set('n', S.n < 1 ? 'practically none' : sci(S.n) + ' cm⁻³');
          ro.set('p', S.p < 1 ? 'practically none' : sci(S.p) + ' cm⁻³');
        }
        ro.set('s', S.sigma < 1e-12 ? 'practically zero' : sci(S.sigma) + ' S/m');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ p-n junction diode */
  Hyper.sim('nc-pn-junction', {
    title: 'The p–n junction diode',
    blurb: `A diode in series with a 100 Ω resistor and an adjustable supply. Top: the junction, with holes (rings) on the p side, electrons (dots) on the n side and the carrier-free **depletion region** of fixed ions between them. Bottom: the diode's current–voltage curve, with the operating point.

- Sweep the supply from −5 V to +5 V: almost nothing flows in reverse; forward, the current takes off near 0.6 V for silicon.
- Watch the depletion region: reverse bias widens it, forward bias thins it.
- Tick **logarithmic current**: the forward curve becomes a straight line, a factor of ten per 60 mV.
- Warm the diode: at the same current its voltage drops by about 2 mV per kelvin. Try germanium and the red LED.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 190, maxH: 300 });
      const gbox = document.createElement('div');
      gbox.style.padding = '6px 10px 10px';
      box.stage.appendChild(gbox);
      const R = 100, kB = 1.380649e-23, qe = 1.602176634e-19;
      const TYPES = {
        si: { label: 'Silicon diode', Is: 1e-12, n: 1, Eg: 1.12, Vbi: 0.71, W0: 0.43, vmax: 1.0 },
        ge: { label: 'Germanium diode', Is: 1e-6, n: 1, Eg: 0.66, Vbi: 0.32, W0: 0.55, vmax: 0.6 },
        led: { label: 'Red LED', Is: 1e-17, n: 2, Eg: 1.9, Vbi: 1.9, W0: 0.15, vmax: 2.3 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'd', type: 'select', label: 'Diode', value: 'si', options: Object.keys(TYPES).map(k => [TYPES[k].label, k]) },
        { id: 'Vs', label: 'Supply voltage', min: -5, max: 5, step: 0.05, value: 1.5, unit: 'V' },
        { id: 'T', label: 'Temperature', min: 250, max: 400, step: 1, value: 300, unit: 'K' },
        { id: 'log', type: 'check', label: 'Logarithmic current axis', value: false }
      ], () => { updatePlot(); loop.once(); });
      const ro = kit.readout(box.side, [['vd', 'Diode voltage'], ['i', 'Current'], ['bar', 'Barrier height'], ['w', 'Depletion width']]);
      const plot = kit.plot(gbox, { x: { label: 'diode voltage (V)' }, y: { label: 'current (mA)' } }, 210);
      const V = ctl.values;
      const dev = () => TYPES[V.d];
      const Is = () => { const d = dev(), T = V.T; return d.Is * Math.pow(T / 300, 3) * Math.exp(-(d.Eg * qe / (d.n * kB)) * (1 / T - 1 / 300)); };
      const cur = v => { const d = dev(); return Is() * (Math.exp(Math.min(v * qe / (d.n * kB * V.T), 700)) - 1); };
      function operating() {
        let lo = -Math.abs(V.Vs) - 1, hi = Math.abs(V.Vs) + 1;
        for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (m + R * cur(m) - V.Vs > 0) hi = m; else lo = m; }
        const vd = (lo + hi) / 2;
        return { vd, i: (V.Vs - vd) / R };
      }
      function updatePlot() {
        const d = dev(), op = operating(), pts = [], vmin = -2;
        for (let k = 0; k <= 300; k++) {
          const v = vmin + (d.vmax - vmin) * k / 300, i = cur(v);
          pts.push([v, V.log ? clamp(Math.abs(i), 1e-18, 10) : clamp(i * 1000, -100, 200)]);
        }
        const series = [{ pts, label: 'diode', width: 2.4 }];
        if (!V.log) series.push({ pts: [[vmin, (V.Vs - vmin) / R * 1000], [d.vmax, (V.Vs - d.vmax) / R * 1000]], label: 'resistor load line', dash: [6, 4], width: 1.4 });
        const mark = { x: op.vd, y: V.log ? clamp(Math.abs(op.i), 1e-16, 10) : op.i * 1000, label: 'operating point' };
        plot.set({ series, marks: [mark], vlines: [{ x: 0 }],
          x: { label: 'diode voltage (V)', min: vmin, max: d.vmax },
          y: V.log ? { label: '|current| (A), log scale', log: true, min: 1e-16, max: 1 } : { label: 'current (mA)', min: -5, max: 60 } });
      }
      const holes = [], elec = [];
      for (let k = 0; k < 44; k++) { holes.push({ x: Math.random(), y: Math.random() }); elec.push({ x: Math.random(), y: Math.random() }); }
      let cross = [], acc = 0;
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const d = dev(), op = operating();
        const barrier = d.Vbi - op.vd, w = d.W0 * Math.sqrt(Math.max(barrier, 0.02) / d.Vbi);
        const bx0 = 40, bx1 = st.W - 40, by0 = 26, by1 = st.H - 58, mid = (bx0 + bx1) / 2;
        const scale = (bx1 - bx0) / 2 / 1.6;           // pixels per micrometre of depletion width
        const half = Math.min((bx1 - bx0) * 0.45, w * scale / 2);
        // p and n regions
        c.fillStyle = C.hue(28, 0.12); c.fillRect(bx0, by0, mid - bx0, by1 - by0);
        c.fillStyle = C.hue(210, 0.12); c.fillRect(mid, by0, bx1 - mid, by1 - by0);
        c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'; c.fillRect(mid - half, by0, 2 * half, by1 - by0);
        c.strokeStyle = C.border2; c.lineWidth = 1.2; c.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint;
        c.beginPath(); c.moveTo(mid - half, by0); c.lineTo(mid - half, by1); c.moveTo(mid + half, by0); c.lineTo(mid + half, by1); c.stroke(); c.restore();
        kit.label(c, 'p-type', bx0 + 8, by0 - 12, { size: 12, weight: 700, color: C.series[1] });
        kit.label(c, 'n-type', bx1 - 8, by0 - 12, { size: 12, weight: 700, color: C.accent, align: 'right' });
        kit.label(c, 'depletion region ' + w.toFixed(2) + ' µm', mid, by1 + 12, { size: 11, color: C.muted, align: 'center' });
        // fixed ions in the depletion region
        const rows = 4, cols = Math.max(1, Math.floor(half / 11));
        for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
          const y = by0 + (r + 0.5) * (by1 - by0) / rows;
          kit.label(c, '−', mid - half + (k + 0.5) * half / cols, y, { align: 'center', size: 13, weight: 700, color: C.series[1] });
          kit.label(c, '+', mid + half - (k + 0.5) * half / cols, y, { align: 'center', size: 13, weight: 700, color: C.accent });
        }
        // mobile carriers outside the depletion region
        const jig = a => { if (dt) for (const q of a) { q.x = clamp(q.x + (Math.random() - 0.5) * 0.03, 0, 1); q.y = clamp(q.y + (Math.random() - 0.5) * 0.05, 0, 1); } };
        jig(holes); jig(elec);
        const pw = mid - half - bx0 - 12, nw = bx1 - (mid + half) - 12;
        for (const q of holes) { c.beginPath(); c.arc(bx0 + 6 + q.x * pw, by0 + 6 + q.y * (by1 - by0 - 12), 3.2, 0, Math.PI * 2); c.strokeStyle = C.series[1]; c.lineWidth = 1.5; c.stroke(); }
        for (const q of elec) kit.dot(c, mid + half + 6 + q.x * nw, by0 + 6 + q.y * (by1 - by0 - 12), 3, C.accent);
        // carriers crossing the junction: a rate that grows with the logarithm of the current
        const rate = op.i > 1e-9 ? 2 * Math.log10(op.i / 1e-9) : 0;
        acc += rate * (dt || 0);
        while (acc > 1 && cross.length < 60) { acc -= 1; const e = Math.random() < 0.5; cross.push({ e, t: 0, y: by0 + 8 + Math.random() * (by1 - by0 - 16) }); }
        if (acc > 1) acc = 0;
        for (const q of cross) q.t += (dt || 0) / 0.9;
        cross = cross.filter(q => q.t < 1);
        for (const q of cross) {
          const span = half + 40, x = q.e ? mid + half + 10 - q.t * span * 2 : mid - half - 10 + q.t * span * 2;
          if (q.e) kit.dot(c, x, q.y, 3, C.accent); else { c.beginPath(); c.arc(x, q.y, 3.2, 0, Math.PI * 2); c.strokeStyle = C.series[1]; c.lineWidth = 1.5; c.stroke(); }
          if (V.d === 'led' && q.t > 0.6) kit.dot(c, x, q.y, 6 * (1 - q.t) + 2, 'rgba(255,60,40,' + (1 - q.t).toFixed(2) + ')');
        }
        // the circuit
        const cy = st.H - 22;
        c.strokeStyle = C.text2; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(bx0, (by0 + by1) / 2); c.lineTo(bx0 - 22, (by0 + by1) / 2); c.lineTo(bx0 - 22, cy); c.lineTo(mid - 60, cy); c.moveTo(mid + 60, cy); c.lineTo(bx1 + 22, cy); c.lineTo(bx1 + 22, (by0 + by1) / 2); c.lineTo(bx1, (by0 + by1) / 2); c.stroke();
        // battery: long plate is +
        const plus = V.Vs >= 0;
        const pl = plus ? mid - 60 : mid - 52, ps = plus ? mid - 52 : mid - 60;     // long (+) and short (−) plates
        c.lineWidth = 2.5; c.beginPath(); c.moveTo(pl, cy - 11); c.lineTo(pl, cy + 11); c.stroke();
        c.lineWidth = 4; c.beginPath(); c.moveTo(ps, cy - 5); c.lineTo(ps, cy + 5); c.stroke();
        kit.label(c, '+', pl + (plus ? -8 : 8), cy + 12, { align: 'center', size: 12, weight: 700, color: C.text2 });
        c.lineWidth = 1.5; c.beginPath(); c.moveTo(mid - 52, cy); c.lineTo(mid - 20, cy); c.stroke();
        c.strokeRect(mid - 20, cy - 6, 40, 12);
        c.beginPath(); c.moveTo(mid + 20, cy); c.lineTo(mid + 60, cy); c.stroke();
        kit.label(c, Math.abs(V.Vs).toFixed(2) + ' V', mid - 56, cy - 19, { align: 'center', size: 11, color: C.text2 });
        kit.label(c, '100 Ω', mid, cy - 16, { align: 'center', size: 11, color: C.muted });
        kit.label(c, plus ? 'forward bias' : 'reverse bias', bx1 + 22, cy - 12, { align: 'right', size: 11.5, weight: 700, color: plus ? C.ok : C.warn });
        // readouts
        const I = op.i, aI = Math.abs(I);
        ro.set('vd', op.vd.toFixed(3) + ' V');
        ro.set('i', aI >= 1e-3 ? (I * 1000).toFixed(2) + ' mA' : aI >= 1e-6 ? (I * 1e6).toFixed(2) + ' µA' : aI >= 1e-9 ? (I * 1e9).toFixed(2) + ' nA' : (I * 1e12).toFixed(3) + ' pA');
        ro.set('bar', Math.max(barrier, 0).toFixed(2) + ' V');
        ro.set('w', w.toFixed(2) + ' µm');
      }
      updatePlot();
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ drift of free electrons */
  Hyper.sim('nc-drift', {
    title: 'Electrons drifting in a wire',
    blurb: `Conduction electrons (dots) race about at the Fermi speed, bouncing off the vibrating ions (grey). The applied field (arrow) gives them a slow net drift against it — hugely exaggerated here: in real copper the drift is billions of times slower than the random motion (see the readout).

- Switch the field off: the electrons still move fast, but the average velocity (the long arrow) falls to zero.
- Tick **Follow one electron**: its path is a random walk with a slight lean.
- Heat the wire: the ions shake harder, collisions come more often, the drift slows and the resistivity rises. The random speed does not change.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5 });
      const n = 8.49e28, qe = 1.602176634e-19, me = 9.1093837e-31, vF = 1.57e6;
      // resistivity of copper (µΩ·cm) against temperature, measured values
      const RHO = [[150, 0.70], [200, 1.05], [250, 1.37], [300, 1.68], [400, 2.30], [500, 2.94], [600, 3.60]];
      const rhoAt = T => { for (let k = 1; k < RHO.length; k++) if (T <= RHO[k][0]) { const [a, ra] = RHO[k - 1], [b, rb] = RHO[k]; return ra + (rb - ra) * (T - a) / (b - a); } return RHO[RHO.length - 1][1]; };
      const ctl = kit.controls(box.side, [
        { id: 'E', label: 'Electric field in the wire', min: 0, max: 0.2, step: 0.005, value: 0.1, unit: 'V/m' },
        { id: 'T', label: 'Temperature', min: 150, max: 600, step: 10, value: 300, unit: 'K' },
        { id: 'trail', type: 'check', label: 'Follow one electron', value: true },
        { id: 'avg', type: 'check', label: 'Show the average velocity', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['rho', 'Resistivity (copper)'], ['tau', 'Time between collisions'], ['J', 'Current density'], ['vd', 'Drift velocity'], ['vf', 'Random (Fermi) speed']]);
      const V = ctl.values;
      const V0 = 150, TAU0 = 0.35, DRIFT0 = 32;      // screen: random speed px/s, collision time at 300 K (s), drift at 0.2 V/m and 300 K (px/s)
      const N = 70;
      let W = st.W, H = st.H;
      const el = [];
      for (let k = 0; k < N; k++) { const a = Math.random() * 2 * Math.PI; el.push({ x: Math.random(), y: Math.random(), vx: V0 * Math.cos(a), vy: V0 * Math.sin(a), next: -TAU0 * Math.log(1 - Math.random() * 0.999) }); }
      let trail = [], vavg = 0, t = 0;
      const tauRatio = () => 1.68 / rhoAt(V.T);        // collision time relative to 300 K
      function step(dt) {
        if (!dt) return;
        t += dt;
        W = st.W; H = st.H;
        const wx0 = 20, wx1 = W - 20, wy0 = 40, wy1 = H - 40, ww = wx1 - wx0, wh = wy1 - wy0;
        const ts = TAU0 * tauRatio(), a = DRIFT0 * (V.E / 0.2) * tauRatio() / ts;   // drift = a ts
        let sum = 0;
        const sub = 2, h = dt / sub;
        for (let s = 0; s < sub; s++) for (const e of el) {
          e.vx -= a * h;                       // electrons are pushed against the field
          let px = wx0 + e.x * ww + e.vx * h, py = wy0 + e.y * wh + e.vy * h;
          if (py < wy0) { py = 2 * wy0 - py; e.vy = Math.abs(e.vy); }
          if (py > wy1) { py = 2 * wy1 - py; e.vy = -Math.abs(e.vy); }
          e.x = ((px - wx0) / ww % 1 + 1) % 1; e.y = clamp((py - wy0) / wh, 0, 1);
          e.next -= h;
          if (e.next <= 0) {                    // a collision: new random direction at the Fermi speed
            const ang = Math.random() * 2 * Math.PI;
            e.vx = V0 * Math.cos(ang); e.vy = V0 * Math.sin(ang);
            e.next = -ts * Math.log(1 - Math.random() * 0.999);
          }
        }
        for (const e of el) sum += e.vx;
        const k = Math.min(1, dt / 1.5);
        vavg += (sum / N - vavg) * k;
        const e0 = el[0];
        const p = [wx0 + e0.x * ww, wy0 + e0.y * wh];
        if (trail.length && Math.abs(p[0] - trail[trail.length - 1][0]) > ww / 2) trail.push(null);   // wrapped around
        trail.push(p);
        if (trail.length > 900) trail.shift();
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const wx0 = 20, wx1 = st.W - 20, wy0 = 40, wy1 = st.H - 40, ww = wx1 - wx0, wh = wy1 - wy0;
        c.fillStyle = C.hue(28, 0.07); c.fillRect(wx0, wy0, ww, wh);
        c.strokeStyle = C.hue(28, 0.5); c.lineWidth = 1.5; c.strokeRect(wx0, wy0, ww, wh);
        // ions, vibrating more when hot
        const amp = 1.4 * Math.sqrt(V.T / 300), gap = 34;
        for (let x = wx0 + gap / 2; x < wx1; x += gap) for (let y = wy0 + gap / 2; y < wy1; y += gap) {
          kit.dot(c, x + amp * Math.sin(t * 37 + x * 0.7 + y), y + amp * Math.cos(t * 41 + y * 0.9 + x), 5, C.dark ? 'rgba(170,175,190,.35)' : 'rgba(110,115,130,.3)');
        }
        if (V.trail && trail.length > 1) {
          c.save(); c.strokeStyle = C.warn; c.globalAlpha = 0.75; c.lineWidth = 1.3; c.beginPath();
          let pen = false;
          for (const q of trail) { if (!q) { pen = false; continue; } if (pen) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); pen = true; }
          c.stroke(); c.restore();
        }
        el.forEach((e, i) => kit.dot(c, wx0 + e.x * ww, wy0 + e.y * wh, i === 0 && V.trail ? 4.5 : 3, i === 0 && V.trail ? C.warn : C.accent));
        // field arrow and average velocity
        kit.label(c, 'E', wx0 + 8, 18, { size: 13, weight: 700, color: C.bad });
        if (V.E > 0) kit.arrow(c, wx0 + 26, 18, wx0 + 26 + 60 + 400 * V.E, 18, C.bad, 2.4);
        else kit.label(c, 'no field', wx0 + 26, 18, { size: 11.5, color: C.muted });
        if (V.avg) {
          const mx = st.W / 2, my = st.H - 18, L = clamp(vavg * 2.5, -st.W / 2 + 30, st.W / 2 - 30);
          if (Math.abs(L) > 1) kit.arrow(c, mx, my, mx + L, my, C.ok, 3);
          kit.label(c, 'average electron velocity', mx, my - 12, { align: 'center', size: 11, color: C.ok });
        }
        const rho = rhoAt(V.T) * 1e-8, tau = me / (n * qe * qe * rho), J = V.E / rho, vd = J / (n * qe);
        ro.set('rho', (rho * 1e8).toFixed(2) + ' × 10⁻⁸ Ω·m');
        ro.set('tau', (tau * 1e15).toFixed(0) + ' fs');
        ro.set('J', (J / 1e6).toFixed(2) + ' A/mm²');
        ro.set('vd', (vd * 1000).toFixed(3) + ' mm/s');
        const r = vF / vd, e = Math.floor(Math.log10(r));
        ro.set('vf', '1.57 × 10⁶ m/s' + (vd > 0 ? ', ' + (r / Math.pow(10, e)).toFixed(1) + ' × 10' + String(e).split('').map(ch => '⁰¹²³⁴⁵⁶⁷⁸⁹'[ch]).join('') + ' times the drift' : ''));
      }
      const loop = kit.loop(dt => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ magnetic domains (Ising model) */
  Hyper.sim('nc-domains', {
    title: 'Magnetic domains and hysteresis',
    blurb: `A grid of atomic magnets (spins) that point up (blue) or down (orange). Each prefers to agree with its neighbours — the exchange interaction — while heat flips them at random and the applied field favours one direction. The graph traces magnetization against field.

- At 0.6 of the Curie temperature, press **Demagnetize**: domains form and slowly coarsen; the net magnetization is near zero.
- Tick **Sweep the field** to trace a **hysteresis loop**: the magnetization lags behind the field, and a reverse field is needed to flip it back.
- Raise the temperature: the loop narrows, and above the Curie temperature ($T/T_C > 1$) the order and the loop vanish — a paramagnet.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5 });
      const gbox = document.createElement('div');
      gbox.style.padding = '6px 10px 10px';
      box.stage.appendChild(gbox);
      const NX = 80, NY = 44, TC = 2 / Math.log(1 + Math.SQRT2);    // exact Curie temperature of the square-lattice model, in units of J/k
      const s = new Int8Array(NX * NY);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature, as a fraction of the Curie temperature', min: 0.3, max: 1.6, step: 0.02, value: 0.6 },
        { id: 'H', label: 'Applied field', min: -1, max: 1, step: 0.02, value: 0 },
        { id: 'sweep', type: 'check', label: 'Sweep the field back and forth', value: false },
        { id: 'speed', label: 'Speed', min: 1, max: 6, step: 1, value: 3 },
        { type: 'buttons', items: [{ id: 'demag', label: 'Demagnetize', primary: true }, { id: 'up', label: 'Magnetize up' }, { id: 'clear', label: 'Clear loop' }] }
      ], (id) => {
        if (id === 'demag') for (let k = 0; k < s.length; k++) s[k] = Math.random() < 0.5 ? 1 : -1;
        else if (id === 'up') s.fill(1);
        if (id === 'demag' || id === 'up' || id === 'clear') loopPts = [];
        if (id === 'sweep' && V.sweep) phase = Math.asin(clamp(V.H, -1, 1));
        loop.once();
      });
      const ro = kit.readout(box.side, [['m', 'Magnetization'], ['h', 'Applied field'], ['t', 'Temperature'], ['st', 'State']]);
      const plot = kit.plot(gbox, { x: { label: 'applied field', min: -1, max: 1 }, y: { label: 'magnetization', min: -1.05, max: 1.05 } }, 190);
      const V = ctl.values;
      for (let k = 0; k < s.length; k++) s[k] = Math.random() < 0.5 ? 1 : -1;
      let loopPts = [], phase = 0, M = 0, lastPlot = 0, clock = 0;
      function sweep(n) {
        const T = V.T * TC, H = V.H, N = NX * NY;
        for (let k = 0; k < n * N; k++) {
          const i = (Math.random() * N) | 0, x = i % NX, y = (i / NX) | 0;
          const nb = s[y * NX + (x + 1) % NX] + s[y * NX + (x + NX - 1) % NX] + s[((y + 1) % NY) * NX + x] + s[((y + NY - 1) % NY) * NX + x];
          const dE = 2 * s[i] * (nb + H);
          if (dE <= 0 || Math.random() < Math.exp(-dE / T)) s[i] = -s[i];
        }
        let sum = 0;
        for (let k = 0; k < N; k++) sum += s[k];
        M = sum / N;
      }
      function step(dt) {
        if (!dt) return;
        clock += dt;
        if (V.sweep) { phase += dt * 2 * Math.PI / 16; const h = Math.round(Math.sin(phase) * 100) / 100; ctl.set('H', h); V.H = h; }
        sweep(V.speed / 3);
        loopPts.push([V.H, M]);
        if (loopPts.length > 2500) loopPts.shift();
        if (clock - lastPlot > 0.15) { lastPlot = clock; plot.set({ series: [{ pts: loopPts.slice(), label: 'M against H', width: 1.6 }], marks: [{ x: V.H, y: M }] }); }
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const cell = Math.min((st.W - 20) / NX, (st.H - 20) / NY), x0 = (st.W - cell * NX) / 2, y0 = (st.H - cell * NY) / 2;
        c.fillStyle = C.hue(28, 0.75); c.fillRect(x0, y0, cell * NX, cell * NY);
        c.fillStyle = C.hue(215, 0.85);
        for (let y = 0; y < NY; y++) {
          let run = -1;
          for (let x = 0; x <= NX; x++) {
            const up = x < NX && s[y * NX + x] > 0;
            if (up && run < 0) run = x;
            if (!up && run >= 0) { c.fillRect(x0 + run * cell, y0 + y * cell, (x - run) * cell + 0.4, cell + 0.4); run = -1; }
          }
        }
        const hx = st.W - 30, hy = st.H / 2, L = 60 * V.H;
        if (Math.abs(L) > 2) kit.arrow(c, hx, hy + L / 2, hx, hy - L / 2, C.text, 3);
        kit.label(c, 'H', hx + 9, hy, { size: 12, weight: 700, color: C.text });
        ro.set('m', (100 * M).toFixed(0) + ' % of saturation');
        ro.set('h', V.H.toFixed(2) + ' (in units of the exchange energy)');
        ro.set('t', V.T.toFixed(2) + ' × the Curie temperature');
        ro.set('st', V.T < 1 ? 'ferromagnetic: domains' : 'paramagnetic: no lasting order');
      }
      const loop = kit.loop(dt => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

})();
