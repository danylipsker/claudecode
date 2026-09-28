/* HYPER-MOTORS · sims/induction.js — three-phase induction motors (prefix im-).
 *   im-rotating-field      three stator phases making a turning field; poles, phase swap, a lost line
 *   im-cage                rotor bars in their slots: current crowding with rotor frequency (deep bar, double cage)
 *   im-slip                the field and the lagging rotor, the slip pattern of bar currents, the power flow
 *   im-torque-curve        torque–speed curves of NEMA designs A–D with the 7th-harmonic dip; run-up against a load
 *   im-equivalent-circuit  the per-phase circuit at any slip, with the no-load and locked-rotor tests
 *   im-wound-rotor         slip rings and a stepped rotor-resistance starter climbing from curve to curve
 *   im-terminal-box        the six-terminal box: star and delta links, winding voltages, wrong connections
 *   im-nine-lead           a NEMA 9-lead dual-voltage motor, wye or delta inside, series or parallel halves
 *   im-reversing           a reversing starter: power circuit, interlocked control ladder, plugging and rotor heat
 * Models written here (beyond kit.motor): a 1-D slot-diffusion model of rotor bars, a double-cage equivalent circuit
 * with the 7th space-harmonic torque, a simple saturation law for over-voltage.
 */
(function () {
  'use strict';
  const TAU = 2 * Math.PI, SQ3 = Math.sqrt(3), MU0 = 4e-7 * Math.PI;
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const PH = ['0 75% 55%', '42 92% 48%', '215 75% 57%'];                 // U red, V amber, W blue
  const phc = (k, a) => 'hsl(' + PH[k] + ' / ' + (a == null ? 1 : a).toFixed(2) + ')';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const rpmOf = w => w * 60 / TAU, radOf = n => n * TAU / 60;
  // a fixed design space W0 × H0 scaled into the stage; to(p) maps a pointer position into it
  function frame(st, W0, H0) {
    const sc = Math.min(st.W / W0, st.H / H0), ox = (st.W - W0 * sc) / 2, oy = (st.H - H0 * sc) / 2;
    return { sc, ox, oy, to: p => ({ x: (p.x - ox) / sc, y: (p.y - oy) / sc }) };
  }
  function begin(st, W0, H0) {
    const c = st.begin(), f = frame(st, W0, H0);
    c.save(); c.translate(f.ox, f.oy); c.scale(f.sc, f.sc);
    c.font = '12px ' + font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineCap = 'round'; c.lineJoin = 'round';
    return c;
  }
  function graphs(box, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  function text(c, s, x, y, o) {
    o = o || {};
    c.save(); c.font = (o.weight || 400) + ' ' + (o.size || 12) + 'px ' + font(); c.textAlign = o.align || 'center';
    c.fillStyle = o.color || kitColors().text; c.fillText(s, x, y); c.restore();
  }
  let kitColors = () => ({ text: '#ccc' });
  // complex numbers for the circuit models
  const Cx = (re, im) => ({ re, im: im || 0 });
  const cadd = (a, b) => Cx(a.re + b.re, a.im + b.im), cmul = (a, b) => Cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im || 1e-30; return Cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const cabs = a => Math.hypot(a.re, a.im), par = (a, b) => cdiv(cmul(a, b), cadd(a, b));
  // the 7.5 kW, 400 V, 50 Hz, 4-pole star motor of the pages (the reference set of kit.motor)
  const IM7 = { V_LL: 400, f: 50, poles: 4, R1: 0.7, X1: 1.1, R2: 0.55, X2: 1.6, Xm: 45, Pfw: 120, deepBar: 1 };
  // the stable operating slip for a shaft load torque TL (N·m) on the right of breakdown, or null if it stalls
  function steadySlip(im, TL) {
    const g = s => im.at(s).Tshaft - TL;
    let lo = 1e-5, hi = Math.max(2e-5, Math.min(1, im.sMax));
    if (g(hi) < 0) return null;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (g(m) < 0) lo = m; else hi = m; }
    return hi;
  }
  function ratedSlip(im, Pn) {
    let lo = 1e-5, hi = Math.min(1, im.sMax);
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (im.at(m).Pmech < Pn) lo = m; else hi = m; }
    return hi;
  }

  /* ================================================================== the rotating field */
  Hyper.sim('im-rotating-field', {
    title: 'Three phases make a rotating field',
    blurb: `A stator with three phase windings U (red), V (amber) and W (blue). Each slot group shows its current: ⊙ out of the page, ⊗ into it, brighter for more current. The coloured band round the air gap is the field (red: flux leaving the rotor, a north pole; blue: a south pole). On the right, each phase's field is an arrow along its own axis; their sum, the thick orange arrow, is the rotating field. The graph shows the three currents over two cycles and the strength of the sum.

**Try this**
- Watch the right-hand diagram: three arrows pulse and flip, yet the orange sum keeps its length — 1.5 times one phase's peak — and turns steadily.
- Choose 4 or 6 poles: the pattern repeats round the stator and turns only half or a third as fast (1500 or 1000 rpm at 50 Hz).
- Tick *Swap V and W*: the field turns the other way — that is how a motor is reversed.
- Tick *Line W open*: the current in U and V is one series current, and the sum only pulses back and forth along a fixed axis. A stopped motor on two lines has no starting torque.
- Pause and use *Step 1/12 cycle* to follow the currents 30° at a time.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const [g1] = graphs(box, 1);
      let th = 0, running = true, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'poles', type: 'select', label: 'Winding', options: [['2 poles', 2], ['4 poles', 4], ['6 poles', 6]], value: 2 },
        { id: 'f', type: 'select', label: 'Supply frequency', options: [['50 Hz', 50], ['60 Hz', 60]], value: 50 },
        { id: 'anim', label: 'Slow motion: supply cycles shown per second', min: 0.05, max: 1, step: 0.05, value: 0.25 },
        { id: 'swap', type: 'check', label: 'Swap V and W (reverse the phase sequence)', value: false },
        { id: 'open', type: 'check', label: 'Line W open (single phasing)', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Pause / run', primary: true }, { id: 'step', label: 'Step 1/12 cycle' }] }
      ], id => {
        if (id === 'run') running = !running;
        if (id === 'step') { running = false; th += TAU / 12; }
        lastPlot = -1; if (!running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ns', 'Synchronous speed'], ['B', 'Field strength (× one phase peak)'], ['dir', 'Field'], ['i', 'Currents iU · iV · iW (× peak)']]);
      const plot = kit.plot(g1, { x: { label: 'electrical angle ωt (°)', min: 0, max: 720 }, y: { label: 'current (× peak) and |B| (× B_m)', min: -1.6, max: 1.6 }, legend: true }, 190);
      const volt = (k, a) => Math.cos(a - (V.swap ? -1 : 1) * k * TAU / 3);            // phase voltage (and current) shape
      const cur = a => {
        if (!V.open) return [volt(0, a), volt(1, a), volt(2, a)];
        const iu = (volt(0, a) - volt(1, a)) / 2;                                        // U and V in series across L1–L2
        return [iu, -iu, 0];
      };
      const sumOf = i => { let x = 0, y = 0; for (let k = 0; k < 3; k++) { x += i[k] * Math.cos(k * TAU / 3); y += i[k] * Math.sin(k * TAU / 3); } return [x, y]; };
      const loop = kit.loop(dt => {
        t += dt; if (running) th += TAU * V.anim * dt;
        const C = kit.colors(), P = +V.poles, pp = P / 2, i = cur(th), S = sumOf(i), mag = Math.hypot(S[0], S[1]);
        ro.set('ns', (120 * V.f / P).toFixed(0) + ' rpm (' + P + ' poles at ' + V.f + ' Hz)');
        ro.set('B', mag.toFixed(2) + (V.open ? ' — pulsating' : ' — constant'));
        ro.set('dir', V.open ? 'pulses along a fixed axis: no rotation' : (V.swap ? 'turns clockwise (sequence U–W–V)' : 'turns anticlockwise (sequence U–V–W)'));
        ro.set('i', i.map(v => (v >= 0 ? '+' : '') + v.toFixed(2)).join(' · '));
        if (t - lastPlot > 0.12 || lastPlot < 0) {
          lastPlot = t;
          const s = [[], [], []], m = [];
          for (let k = 0; k <= 144; k++) { const a = k / 144 * 4 * Math.PI, ii = cur(a); for (let q = 0; q < 3; q++) s[q].push([k * 5, ii[q]]); const ss = sumOf(ii); m.push([k * 5, Math.hypot(ss[0], ss[1])]); }
          plot.set({ series: [{ pts: s[0], label: 'iU', color: phc(0) }, { pts: s[1], label: 'iV', color: phc(1) }, { pts: s[2], label: 'iW', color: phc(2) }, { pts: m, label: '|B| of the sum', color: 'hsl(24 90% 55%)', dash: [5, 3] }],
            vlines: [{ x: (th * 180 / Math.PI) % 720, label: 'now' }] });
        }
        const c = begin(st, 640, 320), cx = 165, cy = 160;
        // stator ring and bore
        c.fillStyle = C.surface2 || C.bg2; c.beginPath(); c.arc(cx, cy, 140, 0, TAU); c.arc(cx, cy, 100, 0, TAU, true); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, 140, 0, TAU); c.stroke();
        // the field band in the air gap: B_r(θm) = Σ i_k cos(pp·θm − α_k); screen angles run anticlockwise
        const seg = 96;
        for (let k = 0; k < seg; k++) {
          const a0 = k / seg * TAU, a1 = (k + 1) / seg * TAU, am = (a0 + a1) / 2;
          let b = 0; for (let q = 0; q < 3; q++) b += i[q] * Math.cos(pp * am - q * TAU / 3);
          const col = b >= 0 ? '0 80% 55%' : '215 80% 58%';
          c.fillStyle = 'hsl(' + col + ' / ' + clamp(Math.abs(b) / 1.5, 0, 1).toFixed(2) + ')';
          c.beginPath(); c.arc(cx, cy, 99, -a1, -a0); c.arc(cx, cy, 86, -a0, -a1, true); c.closePath(); c.fill();
        }
        // rotor
        c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.beginPath(); c.arc(cx, cy, 84, 0, TAU); c.fill(); c.stroke();
        text(c, 'rotor', cx, cy + 40, { color: C.faint, size: 11 });
        // slot groups: belts at electrical 30°, 90°, … 330°: V′, U, W′, V, U′, W
        const belts = [[1, -1], [0, 1], [2, -1], [1, 1], [0, -1], [2, 1]];
        for (let p = 0; p < pp; p++) for (let b = 0; b < 6; b++) {
          const e = (30 + 60 * b + 360 * p) * Math.PI / 180, am = e / pp, [q, sg] = belts[b], val = sg * i[q];
          const x = cx + 118 * Math.cos(am), y = cy - 118 * Math.sin(am), r = P === 6 ? 7 : 9;
          c.fillStyle = phc(q, 0.15 + 0.8 * Math.min(1, Math.abs(val))); c.strokeStyle = phc(q); c.lineWidth = 1.5;
          c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
          c.strokeStyle = C.text; c.fillStyle = C.text; c.lineWidth = 1.5;
          if (Math.abs(val) > 0.05) {
            if (val > 0) { c.beginPath(); c.arc(x, y, 2.2, 0, TAU); c.fill(); }
            else { const d = r * 0.5; c.beginPath(); c.moveTo(x - d, y - d); c.lineTo(x + d, y + d); c.moveTo(x + d, y - d); c.lineTo(x - d, y + d); c.stroke(); }
          }
          if (P === 2) text(c, ['U', 'V', 'W'][q] + (sg < 0 ? '′' : ''), cx + 152 * Math.cos(am), cy - 152 * Math.sin(am) + 4, { color: phc(q), weight: 600 });
        }
        // the field arrow(s): north poles where B_r peaks
        if (mag > 0.02) {
          const ang = Math.atan2(S[1], S[0]);                       // electrical angle of the resultant
          for (let p = 0; p < pp; p++) {
            const am = (ang + p * TAU) / pp, L = 70 * Math.min(1, mag / 1.5);
            if (P === 2) kit.arrow(c, cx - L * Math.cos(am), cy + L * Math.sin(am), cx + L * Math.cos(am), cy - L * Math.sin(am), 'hsl(24 92% 55%)', 5);
            else kit.arrow(c, cx + 30 * Math.cos(am), cy - 30 * Math.sin(am), cx + (30 + L * 0.7) * Math.cos(am), cy - (30 + L * 0.7) * Math.sin(am), 'hsl(24 92% 55%)', 4);
          }
        }
        text(c, P + ' poles: the pattern turns 1/' + pp + ' revolution per cycle', cx, 314, { color: C.muted, size: 11 });
        // the space-vector diagram (electrical angles)
        const vx = 470, vy = 140, U = 52;
        text(c, 'phase fields and their sum', vx, 26, { color: C.muted });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.arc(vx, vy, 1.5 * U, 0, TAU); c.stroke();
        for (let q = 0; q < 3; q++) { const a = q * TAU / 3; c.strokeStyle = phc(q, 0.5); c.beginPath(); c.moveTo(vx - 100 * Math.cos(a), vy + 100 * Math.sin(a)); c.lineTo(vx + 100 * Math.cos(a), vy - 100 * Math.sin(a)); c.stroke(); text(c, ['U', 'V', 'W'][q] + ' axis', vx + 112 * Math.cos(a), vy - 108 * Math.sin(a) + 4, { color: phc(q), size: 11 }); }
        c.setLineDash([]);
        for (let q = 0; q < 3; q++) { const a = q * TAU / 3, L = U * i[q]; if (Math.abs(L) > 1) kit.arrow(c, vx, vy, vx + L * Math.cos(a), vy - L * Math.sin(a), phc(q), 2.5); }
        if (mag > 0.02) kit.arrow(c, vx, vy, vx + U * S[0], vy - U * S[1], 'hsl(24 92% 55%)', 5);
        text(c, 'dashed circle: 1.5 × one phase\'s peak', vx, 262, { color: C.faint, size: 11 });
        text(c, V.open ? 'one line open: the sum only pulses' : 'sum = ' + mag.toFixed(2) + ' × B_m', vx, 282, { color: V.open ? C.bad : C.text, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== the cage and its bars */
  const SIG = { al: 1 / 3.4e-8, cu: 1 / 2.1e-8, brass: 1 / 7e-8 };
  // bar shapes as layers from the slot bottom up: [height mm, conductor width mm, slot width mm, material or null]
  function roundLayers(d, w, mat, n) { const out = []; for (let k = 0; k < n; k++) { const y = (k + 0.5) / n * 2 - 1; out.push([d / n, Math.max(0.8, w * Math.sqrt(1 - y * y)), Math.max(0.8, w * Math.sqrt(1 - y * y)), mat]); } return out; }
  const BARS = {
    A: { name: 'A — shallow oval bars, low resistance', build: m => roundLayers(11, 7, m, 22) },
    B: { name: 'B — deep bars', build: m => [[30, 4.5, 4.5, m]] },
    C: { name: 'C — double cage', build: m => [[13, 6, 6, m], [8, 0, 1.0, null]].concat(roundLayers(5, 5, m, 10)) },
    D: { name: 'D — small high-resistance (brass) bars', build: () => roundLayers(9, 5, 'brass', 18) }
  };
  // 1-D diffusion across the slot: dE/dy = jωμ0·F/w, dF/dy = σ·b·E (E: electric field along the bar, F: current below y)
  function barSolve(layers, f2) {
    const w = TAU * Math.max(1e-3, f2), N = 480, H = layers.reduce((a, l) => a + l[0], 0) * 1e-3, dy = H / N;
    const at = y => { let acc = 0; for (const l of layers) { acc += l[0] * 1e-3; if (y <= acc + 1e-12) return l; } return layers[layers.length - 1]; };
    const der = (y, s) => { const l = at(y), k = w * MU0 / (l[2] * 1e-3), g = l[3] ? SIG[l[3]] * l[1] * 1e-3 : 0; return [-k * s[3], k * s[2], g * s[0], g * s[1]]; };
    let s = [1, 0, 0, 0], y = 0;
    const prof = [[0, 1, at(dy / 2)[3] ? SIG[at(dy / 2)[3]] : 0]];
    let Finner = null, acc0 = layers[0][0] * 1e-3;
    for (let n = 0; n < N; n++) {
      const k1 = der(y + 1e-9, s), s2 = s.map((v, j) => v + dy / 2 * k1[j]), k2 = der(y + dy / 2, s2), s3 = s.map((v, j) => v + dy / 2 * k2[j]), k3 = der(y + dy / 2, s3), s4 = s.map((v, j) => v + dy * k3[j]), k4 = der(y + dy - 1e-9, s4);
      s = s.map((v, j) => v + dy / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
      y += dy;
      const l = at(y - dy / 2);
      prof.push([y, Math.hypot(s[0], s[1]), l[3] ? SIG[l[3]] : 0]);
      if (Finner == null && y >= acc0 - 1e-12) Finner = Cx(s[2], s[3]);
    }
    const I = Cx(s[2], s[3]), Z = cdiv(Cx(s[0], s[1]), I);
    let A = 0, G = 0; for (const l of layers) if (l[3]) { A += l[0] * l[1] * 1e-6; G += SIG[l[3]] * l[0] * l[1] * 1e-6; }
    const Jav = cabs(I) / A;
    return { R: Z.re, X: Z.im, L: Z.im / w, Rdc: 1 / G, H, Jav, prof: prof.map(p => [(H - p[0]) * 1000, p[2] ? p[2] * p[1] / Jav : null]), Finner, I };
  }

  Hyper.sim('im-cage', {
    title: 'Rotor bars: where the current flows',
    blurb: `A squirrel-cage rotor: on the left its laminations and bars, with the bar currents (red one way, blue the other) sweeping round at the slip frequency; in the middle the cage itself, bars and end rings without the iron; on the right one slot enlarged, coloured by the current density across its depth, computed from the diffusion of the rotor current into the bar. The graphs give the current density against depth, and the bar's effective resistance and leakage inductance against speed, as multiples of their DC values.

**Try this**
- With deep bars (B) at standstill the rotor current alternates at 50 Hz: it crowds into the top of the bar and the effective resistance is more than twice the DC value. Raise the speed to 1450 rpm: the rotor frequency falls to about 1.7 Hz and the current spreads evenly.
- Choose the double cage (C): at standstill most current flows in the small outer bar; near full speed the big inner bar takes over.
- Compare the shallow bars (A): little change with speed — a weak start, and a high inrush. The brass bars (D) have a high resistance at every speed: strong start, high slip.
- Switch aluminium to copper: a lower resistance, a shorter penetration depth, and a stronger deep-bar effect.
- Untick *Skewed bars* to see the straight cage; skew smooths the torque and cuts slot noise.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let rot = 0, slipPh = 0, cache = null, cacheKey = '', t = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'bar', type: 'select', label: 'Rotor bars', options: Object.entries(BARS).map(([k, b]) => [b.name, k]), value: 'B' },
        { id: 'mat', type: 'select', label: 'Cage metal (A–C)', options: [['Aluminium, die-cast (3.4 µΩ·cm warm)', 'al'], ['Copper (2.1 µΩ·cm warm)', 'cu']], value: 'al' },
        { id: 'n', label: 'Rotor speed (field at 1500 rpm, 50 Hz)', min: 0, max: 1495, step: 5, value: 0, unit: 'rpm' },
        { id: 'skew', type: 'check', label: 'Skewed bars', value: true }
      ], () => { lastPlot = -1; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f2', 'Rotor frequency s·f'], ['d', 'Penetration depth δ'], ['kr', 'Bar resistance ÷ DC'], ['kx', 'Slot leakage inductance ÷ DC'], ['sh', 'Share of current in the outer cage']]);
      const pJ = kit.plot(g1, { x: { label: 'depth below the air gap (mm)', min: 0 }, y: { label: 'current density ÷ average', min: 0 }, legend: true }, 180);
      const pR = kit.plot(g2, { x: { label: 'rotor speed (rpm)', min: 0, max: 1500 }, y: { label: '÷ DC value', min: 0 }, legend: true }, 180);
      const colJ = r => { const u = clamp(r / 3, 0, 1); return 'hsl(' + (220 - 220 * u).toFixed(0) + ' 85% ' + (40 + 18 * u).toFixed(0) + '%)'; };
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), mat = V.bar === 'D' ? 'brass' : V.mat, layers = BARS[V.bar].build(mat);
        const s = Math.max(1 / 300, 1 - V.n / 1500), f2 = 50 * s;
        const key = V.bar + mat;
        if (key !== cacheKey) {
          cacheKey = key; const dc = barSolve(layers, 0.001), pts = [], px = [];
          for (let k = 0; k <= 40; k++) { const n = 1495 * k / 40, r = barSolve(layers, 50 * (1 - n / 1500)); pts.push([n, r.R / dc.Rdc]); px.push([n, r.L / dc.L]); }
          cache = { dc, kr: pts, kx: px, start: barSolve(layers, 50) };
        }
        const r = barSolve(layers, f2), kr = r.R / cache.dc.Rdc, kx = r.L / cache.dc.L, delta = Math.sqrt(1 / (SIG[mat] * Math.PI * f2 * MU0));
        ro.set('f2', f2.toFixed(2) + ' Hz (slip ' + (100 * s).toFixed(1) + ' %)');
        ro.set('d', (delta * 1000).toFixed(1) + ' mm in ' + ({ al: 'aluminium', cu: 'copper', brass: 'brass' })[mat] + ' (bar ' + (r.H * 1000).toFixed(0) + ' mm deep)');
        ro.set('kr', kr.toFixed(2) + ' ×');
        ro.set('kx', kx.toFixed(2) + ' ×');
        if (V.bar === 'C' && r.Finner) {
          const io = cabs(cadd(r.I, Cx(-r.Finner.re, -r.Finner.im))), ii = cabs(r.Finner);
          ro.set('sh', (100 * io / Math.max(1e-12, io + ii)).toFixed(0) + ' % outer, ' + (100 * ii / Math.max(1e-12, io + ii)).toFixed(0) + ' % inner');
        } else ro.set('sh', '— (single cage)');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const cut = a => a.prof.filter(p => p[1] != null);
          pJ.set({ series: [{ pts: cut(r), label: 'at ' + V.n.toFixed(0) + ' rpm (' + f2.toFixed(1) + ' Hz)' }, { pts: cut(cache.start), label: 'at standstill (50 Hz)', dash: [5, 4], color: C.muted }] });
          pR.set({ series: [{ pts: cache.kr, label: 'resistance ÷ DC' }, { pts: cache.kx, label: 'slot leakage ÷ DC' }], marks: [{ x: V.n, y: kr }, { x: V.n, y: kx }] });
        }
        // drawing
        rot += (V.n / 1500) * dt * 1.2; slipPh += TAU * f2 * dt / 25;
        const c = begin(st, 720, 300);
        // left: lamination with 28 slots, bars coloured by instantaneous current (2 pole pairs)
        const cx = 120, cy = 150, R = 108, NB = 28;
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 16, 0, TAU); c.fill();
        const Hmm = layers.reduce((a, l) => a + l[0], 0), sc = 34 / Math.max(Hmm, 20);
        for (let k = 0; k < NB; k++) {
          const a = rot + k * TAU / NB, ib = Math.cos(2 * (k * TAU / NB) - slipPh);
          c.save(); c.translate(cx + (R - 3) * Math.cos(a), cy + (R - 3) * Math.sin(a)); c.rotate(a + Math.PI / 2);
          let yy = 0;
          for (let j = layers.length - 1; j >= 0; j--) { const l = layers[j], h = l[0] * sc; if (l[3]) { c.fillStyle = ib >= 0 ? 'hsl(0 75% 55% / ' + (0.3 + 0.6 * Math.abs(ib)).toFixed(2) + ')' : 'hsl(215 75% 58% / ' + (0.3 + 0.6 * Math.abs(ib)).toFixed(2) + ')'; c.fillRect(-l[1] * sc / 2, yy, l[1] * sc, h + 0.3); } else { c.fillStyle = C.bg2; c.fillRect(-l[2] * sc / 2, yy, l[2] * sc, h); } yy += h; }
          c.restore();
        }
        text(c, 'laminated core, ' + NB + ' bars', cx, 290, { color: C.muted, size: 11 });
        // middle: the cage in perspective
        const lx = 285, rx = 425, my = 150, ry = 95, rxE = 22, nb = 16, skew = V.skew ? TAU / nb : 0;
        c.lineWidth = 7; c.strokeStyle = C.faint; c.beginPath(); c.ellipse(rx, my, rxE, ry, 0, 0, TAU); c.stroke();
        for (let pass = 0; pass < 2; pass++) for (let k = 0; k < nb; k++) {
          const a = rot * 1.0 + k * TAU / nb, front = Math.cos(a) > 0;
          if ((pass === 0) === front) continue;
          const ib = Math.cos(2 * (k * TAU / nb) - slipPh);
          c.strokeStyle = ib >= 0 ? 'hsl(0 75% 55% / ' + (front ? 0.9 : 0.35) + ')' : 'hsl(215 75% 58% / ' + (front ? 0.9 : 0.35) + ')';
          c.lineWidth = front ? 5 : 3;
          c.beginPath(); c.moveTo(lx + rxE * Math.cos(a), my + ry * Math.sin(a)); c.lineTo(rx + rxE * Math.cos(a + skew), my + ry * Math.sin(a + skew)); c.stroke();
        }
        c.lineWidth = 7; c.strokeStyle = C.muted; c.beginPath(); c.ellipse(lx, my, rxE, ry, 0, 0, TAU); c.stroke();
        text(c, 'bars + end rings: the "squirrel cage"', (lx + rx) / 2, 272, { color: C.muted, size: 11 });
        text(c, 'bar currents turn at the slip frequency (slowed 25×)', (lx + rx) / 2, 288, { color: C.faint, size: 11 });
        // right: one slot enlarged, coloured by |J| / J_average
        const sx = 590, top = 40, bot = 250, scl = Math.min(6, (bot - top) / Hmm);
        c.fillStyle = C.surface2 || C.bg2; c.fillRect(sx - 60, top - 16, 120, (bot - top) + 30);
        text(c, 'air gap ↑', sx, top - 20, { color: C.muted, size: 11 });
        let ycur = top;
        const prof = r.prof;                                                   // [depth mm, J/Jav]
        for (let j = layers.length - 1; j >= 0; j--) {
          const l = layers[j], h = l[0] * scl;
          const n = Math.max(1, Math.round(h / 2));
          for (let q = 0; q < n; q++) {
            const d = (ycur - top + (q + 0.5) * h / n) / scl;                  // depth below the gap, mm
            let best = null, bd = 1e9; for (const p of prof) if (p[1] != null && Math.abs(p[0] - d) < bd) { bd = Math.abs(p[0] - d); best = p[1]; }
            if (l[3]) { c.fillStyle = colJ(best == null ? 0 : best); c.fillRect(sx - l[1] * scl / 2, ycur + q * h / n, l[1] * scl, h / n + 0.4); }
            else { c.fillStyle = C.bg; c.fillRect(sx - l[2] * scl / 2, ycur + q * h / n, l[2] * scl, h / n + 0.4); }
          }
          ycur += h;
        }
        if (delta * 1000 < Hmm) { const yd = top + delta * 1000 * scl; c.strokeStyle = C.text; c.setLineDash([4, 3]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(sx - 40, yd); c.lineTo(sx + 40, yd); c.stroke(); c.setLineDash([]); text(c, 'δ', sx + 48, yd + 4, { size: 12 }); }
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(sx - 52, top); c.lineTo(sx - 52, top + Hmm * scl); c.stroke();
        for (let d = 0; d <= Hmm + 0.01; d += 10) { const yy = top + d * scl; c.beginPath(); c.moveTo(sx - 56, yy); c.lineTo(sx - 52, yy); c.stroke(); text(c, d.toFixed(0), sx - 58, yy + 4, { align: 'right', color: C.muted, size: 10 }); }
        text(c, 'mm', sx - 58, top + Hmm * scl + 16, { align: 'right', color: C.muted, size: 10 });
        for (let q = 0; q < 5; q++) { c.fillStyle = colJ(q * 0.75); c.fillRect(sx + 44, top + 150 + q * 12, 12, 12); }
        text(c, 'J ÷ avg: 0 → 3+', sx + 50, top + 222, { color: C.muted, size: 10 });
        text(c, 'one slot, ' + (V.n === 0 ? 'standstill' : V.n.toFixed(0) + ' rpm'), sx, 292, { color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== slip and the power flow */
  const SIZES = {
    small: { name: '0.75 kW, 4 poles (frame 80)', Pn: 750, p: { V_LL: 400, f: 50, poles: 4, R1: 9.5, X1: 10, R2: 8, X2: 12, Xm: 200, Rc: 4200, Pfw: 12, deepBar: 1 } },
    mid: { name: '7.5 kW, 4 poles (frame 132M)', Pn: 7500, p: { V_LL: 400, f: 50, poles: 4, R1: 0.6, X1: 1.1, R2: 0.5, X2: 1.6, Xm: 45, Rc: 1000, Pfw: 60, deepBar: 1 } },
    big: { name: '75 kW, 4 poles (frame 280S)', Pn: 75000, p: { V_LL: 400, f: 50, poles: 4, R1: 0.024, X1: 0.12, R2: 0.02, X2: 0.18, Xm: 5.5, Rc: 156, Pfw: 500, deepBar: 5 } }
  };
  function sized(M, key, f, vpc) {
    const b = SIZES[key].p, k = f / 50;
    return M.induction(Object.assign({}, b, { f, V_LL: (f === 60 ? 460 : 400) * vpc, X1: b.X1 * k, X2: b.X2 * k, Xm: b.Xm * k }));
  }
  Hyper.sim('im-slip', {
    title: 'Slip: the rotor lags its field',
    blurb: `A 4-pole induction motor seen end-on: the orange arrows are the north poles of the rotating field, the rotor bars light up red or blue with the current induced in them. Below the motor the power flows from the terminals to the shaft, stage by stage; the graph shows how slip grows with load for three sizes of motor.

**Try this**
- Tick *Ride with the field*: now the field stands still and you see the rotor, in real time, slipping backwards at the slip speed; the pattern of bar currents stays fixed under the poles.
- Raise the load from 0 to 100 % and on to 130 %: the slip grows almost in proportion, the rotor frequency with it, and the orange rotor-loss slice of the power bar widens.
- Compare the 0.75 kW and 75 kW motors at full load: about 5 % slip against about 1 %, and very different efficiencies.
- Lower the voltage to 85 % at full load: the slip rises by roughly (1/0.85)² ≈ 1.4 times and the current rises too.
- Switch to 460 V 60 Hz: the field turns at 1800 rpm and the slip in rpm stays similar.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const [g1] = graphs(box, 1);
      let fieldA = 0, rotA = 0, t = 0, lastPlot = -1, info = null, infoKey = '';
      const ctl = kit.controls(box.side, [
        { id: 'size', type: 'select', label: 'Motor', options: Object.entries(SIZES).map(([k, s]) => [s.name, k]), value: 'mid' },
        { id: 'sup', type: 'select', label: 'Supply', options: [['400 V, 50 Hz', 50], ['460 V, 60 Hz', 60]], value: 50 },
        { id: 'load', label: 'Load, % of rated torque', min: 0, max: 130, step: 1, value: 100, unit: '%' },
        { id: 'vpc', label: 'Supply voltage, % of rated', min: 85, max: 110, step: 1, value: 100, unit: '%' },
        { id: 'ride', type: 'check', label: 'Ride with the field (real-time slip)', value: false }
      ], () => { lastPlot = -1; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ns', 'Field (synchronous) speed'], ['n', 'Rotor speed · slip'], ['f2', 'Rotor frequency s·f'], ['T', 'Torque'], ['I', 'Line current · cos φ'], ['eta', 'Efficiency']]);
      const plot = kit.plot(g1, { x: { label: 'load (% of rated torque)', min: 0, max: 130 }, y: { label: 'slip (%)', min: 0 }, legend: true }, 190);
      const rated = key => {                                         // rated torque at 400 V 50 Hz for a size
        const im = sized(M, key, 50, 1), s = ratedSlip(im, SIZES[key].Pn);
        return { Tn: SIZES[key].Pn / ((1 - s) * im.ws), sn: s };
      };
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), f = +V.sup, key = V.size;
        if (infoKey !== key) { infoKey = key; info = { small: rated('small'), mid: rated('mid'), big: rated('big') }; }
        const im = sized(M, key, f, V.vpc / 100), TL = V.load / 100 * info[key].Tn;
        const sSt = steadySlip(im, TL), stalled = sSt == null, s = stalled ? 1 : sSt, op = im.at(s);
        const P = SIZES[key].p, cu1 = 3 * op.I1 * op.I1 * P.R1, core = Math.max(0, op.Pin - op.Pag - cu1), cu2 = s * op.Pag, fw = stalled ? 0 : P.Pfw, out = Math.max(0, op.Pmech);
        ro.set('ns', im.ns.toFixed(0) + ' rpm = 120 × ' + f + ' / 4');
        ro.set('n', stalled ? 'stalled — load above breakdown torque' : op.n.toFixed(0) + ' rpm · ' + (100 * s).toFixed(2) + ' %');
        ro.set('f2', (s * f).toFixed(2) + ' Hz');
        ro.set('T', TL.toFixed(TL < 20 ? 2 : 0) + ' N·m (rated ' + info[key].Tn.toFixed(info[key].Tn < 20 ? 2 : 0) + ')');
        ro.set('I', op.I1.toFixed(op.I1 < 10 ? 2 : 1) + ' A · ' + op.pf.toFixed(2));
        ro.set('eta', stalled ? '—' : (100 * Math.max(0, op.eff)).toFixed(1) + ' %');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const ser = [];
          for (const k of ['small', 'mid', 'big']) {
            const m = sized(M, k, f, V.vpc / 100), pts = [];
            for (let q = 0; q <= 26; q++) { const L = q * 5, ss = steadySlip(m, L / 100 * info[k].Tn); if (ss == null) break; pts.push([L, 100 * ss]); }
            ser.push({ pts, label: SIZES[k].name.split(',')[0], dash: k === key ? null : [5, 4], width: k === key ? 3 : 1.5 });
          }
          plot.set({ series: ser, marks: stalled ? [] : [{ x: V.load, y: 100 * s, label: 'now' }] });
        }
        // animation: lab frame slowed 50×; in the field's frame the slip is shown in real time
        const wsR = TAU * f / 2 / TAU, wrR = wsR * (1 - s);           // rev/s
        if (V.ride) { rotA -= TAU * (wsR - wrR) * dt; }
        else { fieldA += TAU * wsR / 50 * dt; rotA += TAU * wrR / 50 * dt; }
        const c = begin(st, 640, 320), cx = 150, cy = 140;
        c.fillStyle = C.surface2 || C.bg2; c.beginPath(); c.arc(cx, cy, 122, 0, TAU); c.arc(cx, cy, 96, 0, TAU, true); c.fill();
        c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, 92, 0, TAU); c.fill(); c.stroke();
        const Irel = clamp(op.I1 / Math.max(1e-9, SIZES[key].Pn / (SQ3 * 400 * 0.85 * 0.85)), 0, 2.5);
        const lag = Math.atan2(s * P.X2 * f / 50, P.R2);              // rotor current lag behind its EMF
        for (let k = 0; k < 24; k++) {
          const a = rotA + k * TAU / 24, rel = 2 * (a - fieldA), ib = Math.cos(rel - lag) * Math.min(1, Irel);
          const x = cx + 80 * Math.cos(a), y = cy - 80 * Math.sin(a);
          c.fillStyle = ib >= 0 ? 'hsl(0 75% 55% / ' + (0.15 + 0.8 * Math.abs(ib)).toFixed(2) + ')' : 'hsl(215 75% 58% / ' + (0.15 + 0.8 * Math.abs(ib)).toFixed(2) + ')';
          c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill();
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 60 * Math.cos(rotA), cy - 60 * Math.sin(rotA)); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 9, 0, TAU); c.fill();
        for (let p = 0; p < 2; p++) { const a = fieldA + p * Math.PI; kit.arrow(c, cx + 96 * Math.cos(a), cy - 96 * Math.sin(a), cx + 120 * Math.cos(a), cy - 120 * Math.sin(a), 'hsl(24 92% 55%)', 5); text(c, 'N', cx + 134 * Math.cos(a), cy - 134 * Math.sin(a) + 4, { color: 'hsl(24 92% 55%)', weight: 700 }); text(c, 'S', cx + 134 * Math.cos(a + Math.PI / 2), cy - 134 * Math.sin(a + Math.PI / 2) + 4, { color: C.muted, weight: 700 }); }
        text(c, V.ride ? 'seen from the field: the rotor slips back at ' + (s * im.ns).toFixed(0) + ' rpm (real time)' : 'field and rotor slowed 50×', cx, 282, { color: C.muted, size: 11 });
        // power flow bar
        const x0 = 300, w0 = 320, yb = 150, Pin = Math.max(1e-6, op.Pin);
        const parts = [['output', out, 'hsl(150 55% 45%)'], ['friction & windage', fw, 'hsl(0 0% 60%)'], ['rotor copper s·P_ag', cu2, 'hsl(28 90% 55%)'], ['stator copper', cu1, 'hsl(0 70% 55%)'], ['iron (core)', core, 'hsl(275 50% 60%)']];
        const tot = parts.reduce((a, p) => a + p[1], 0) || 1;
        let xx = x0;
        text(c, 'where the input power goes', x0 + w0 / 2, 30, { color: C.muted });
        text(c, 'input ' + (Pin >= 1000 ? (Pin / 1000).toFixed(2) + ' kW' : Pin.toFixed(0) + ' W'), x0, 56, { align: 'left', weight: 600 });
        text(c, 'air gap ' + (op.Pag >= 1000 ? (op.Pag / 1000).toFixed(2) + ' kW' : op.Pag.toFixed(0) + ' W'), x0 + w0, 56, { align: 'right', color: C.muted });
        for (const p of parts) { const w = w0 * p[1] / tot; c.fillStyle = p[2]; c.fillRect(xx, 66, Math.max(0, w), 30); xx += w; }
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x0, 66, w0, 30);
        parts.forEach((p, i) => {
          const y = 118 + i * 22;
          c.fillStyle = p[2]; c.fillRect(x0, y - 10, 12, 12);
          text(c, p[0], x0 + 20, y, { align: 'left' });
          text(c, (p[1] >= 1000 ? (p[1] / 1000).toFixed(2) + ' kW' : p[1].toFixed(0) + ' W') + '  (' + (100 * p[1] / tot).toFixed(1) + ' %)', x0 + w0, y, { align: 'right', color: C.muted });
        });
        text(c, 'rotor copper loss = s × air-gap power = ' + (100 * s).toFixed(2) + ' % of ' + (op.Pag >= 1000 ? (op.Pag / 1000).toFixed(2) + ' kW' : op.Pag.toFixed(0) + ' W'), x0, yb + 130, { align: 'left', color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== the torque–speed curve and design letters */
  // a double-cage equivalent circuit (outer cage Ro, Xo; inner cage Ri, Xi; common Xe) on the 7.5 kW stator, and the
  // asynchronous torque of the 7th space harmonic (a small "motor" with a synchronous speed of n_s/7)
  const DESIGNS = {
    A: { name: 'NEMA A — low rotor resistance', Ro: 0.905, Xo: 1.752, Ri: 0.853, Xi: 1.145, Xe: 0.49 },
    B: { name: 'NEMA B / IEC N — deep bars', Ro: 4.963, Xo: 1.929, Ri: 0.575, Xi: 1.883, Xe: 0.147 },
    C: { name: 'NEMA C / IEC H — double cage', Ro: 2.678, Xo: 1.441, Ri: 0.802, Xi: 3.604, Xe: 0.157 },
    D: { name: 'NEMA D — high resistance', Ro: 4.988, Xo: 2.04, Ri: 2.32, Xi: 0.958, Xe: 0.478 }
  };
  function cageMotor(d, vfrac, h7) {
    const R1 = 0.7, X1 = 1.1, Xm = 45, Vph = 400 / SQ3 * vfrac, ws = TAU * 25, ns = 1500, Z1 = Cx(R1, X1);
    const at = s => {
      s = clamp(s, 1e-5, 2);
      const Zr = cadd(Cx(0, d.Xe), par(Cx(d.Ro / s, d.Xo), Cx(d.Ri / s, d.Xi)));
      const Z = cadd(Z1, par(Cx(0, Xm), Zr)), I1 = cdiv(Cx(Vph, 0), Z), E = cadd(Cx(Vph, 0), Cx(-cmul(I1, Z1).re, -cmul(I1, Z1).im)), I2 = cdiv(E, Zr);
      const Tf = 3 * cabs(I2) * cabs(I2) * Zr.re / ws, n = (1 - s) * ns, s7 = 1 - 7 * n / ns;
      const T7 = h7 && Math.abs(s7) > 1e-6 ? vfrac * vfrac * 7 * 2 / (s7 / 0.25 + 0.25 / s7) : 0;
      return { s, n, T: Tf + T7, Tf, I1: cabs(I1), pf: Math.cos(Math.atan2(Z.im, Z.re)), rotorLoss: s * Tf * ws };
    };
    return { at, ws, ns };
  }
  function curvePoints(m) {
    let Tpk = 0, sPk = 1;
    for (let i = 0; i <= 400; i++) { const s = 1 - i / 400 * 0.999; const T = m.at(s).T; if (T > Tpk) { Tpk = T; sPk = s; } }
    let Tmin = 1e9, sMin = 1;
    for (let i = 0; i <= 300; i++) { const s = 1 - i / 300 * (1 - sPk); const T = m.at(s).T; if (T < Tmin) { Tmin = T; sMin = s; } }
    return { LR: m.at(1), PU: { T: Tmin, n: (1 - sMin) * m.ns }, BD: { T: Tpk, n: (1 - sPk) * m.ns } };
  }
  Hyper.sim('im-torque-curve', {
    title: 'The torque–speed curve and the design letters',
    blurb: `A 7.5 kW, 400 V, 4-pole cage motor with four rotor designs. The graph shows the motor torque against speed with its landmarks — locked-rotor, pull-up, breakdown — the load's torque, and the operating point; the second graph the line current. Press *Start from rest* to accelerate the load direct on line: the gap between the curves is the accelerating torque, and the rotor collects the heat of the start.

**Try this**
- Compare designs A, B, C and D: starting torque against breakdown torque, starting current, and the slip at rated load.
- Lower the voltage to 85 %: every torque falls to 72 %. With design B and the conveyor at 110 %, breakaway needs 143 % but only about 133 % is left: the motor sits at locked-rotor current. Design C (about 164 %) starts it.
- Choose the crusher (breakaway twice the running torque) at 100 % load: only designs C and D break it away.
- Look for the dip just above a seventh of synchronous speed (about 215 rpm): the 7th space harmonic brakes there. In poor designs a heavy load can hang in it — crawling. Untick *7th harmonic* for the smooth textbook curve.
- Raise the inertia to 5 kg·m² (a big fan): the start takes seconds and leaves tens of kilojoules in the rotor.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      let w = 0, t = 0, tStart = 0, running = false, runUp = null, heat = 0, peakI = 0, lastPlot = -1, ang = 0;
      const ctl = kit.controls(box.side, [
        { id: 'des', type: 'select', label: 'Rotor design', options: Object.entries(DESIGNS).map(([k, d]) => [d.name, k]), value: 'B' },
        { id: 'vpc', label: 'Voltage at the terminals during the start', min: 60, max: 110, step: 1, value: 100, unit: '%' },
        { id: 'h7', type: 'check', label: '7th harmonic (the pull-up dip)', value: true },
        { id: 'lt', type: 'select', label: 'Load', options: [['Conveyor: constant torque, breakaway +30 %', 'conv'], ['Fan: torque ∝ speed²', 'fan'], ['Crusher: breakaway 2 × running', 'crush']], value: 'conv' },
        { id: 'load', label: 'Running load, % of rated torque', min: 0, max: 160, step: 1, value: 100, unit: '%' },
        { id: 'J', label: 'Total inertia at the motor shaft', min: 0.05, max: 5, value: 0.3, unit: 'kg·m²', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from rest', primary: true }] }
      ], id => {
        if (id === 'start') { w = 0; tStart = t; running = true; runUp = null; heat = 0; peakI = 0; }
        lastPlot = -1;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pts', 'Locked-rotor · pull-up · breakdown'], ['lrc', 'Locked-rotor current'], ['sn', 'Rated speed (at 100 % V)'], ['now', 'Speed · torque · current'], ['ru', 'Run-up time'], ['heat', 'Rotor heat of this start']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'torque (% of rated)', min: 0 }, legend: true }, 200);
      const pI = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'line current (× rated)', min: 0 }, legend: true }, 200);
      const ratedOf = d => { const m = cageMotor(d, 1, false); let lo = 1e-4, hi = 0.4; for (let i = 0; i < 50; i++) { const s = (lo + hi) / 2; const r = m.at(s); if (r.Tf * (1 - s) * m.ws - 120 < 7500) lo = s; else hi = s; } return { s: hi, Tn: 7500 / ((1 - hi) * m.ws), In: m.at(hi).I1 }; };
      const loadT = (n, Tn) => {
        const T0 = V.load / 100 * Tn, u = n / 1455;
        if (V.lt === 'fan') return T0 * u * u;
        if (V.lt === 'crush') return n < 40 ? 2 * T0 : T0;
        return n < 40 ? 1.3 * T0 : T0;
      };
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), d = DESIGNS[V.des], m = cageMotor(d, V.vpc / 100, V.h7), R = ratedOf(d), pts = curvePoints(m);
        // dynamics: J dω/dt = T_motor − T_load (the load cannot drive the shaft backwards; static friction holds it at rest)
        let op = m.at(Math.max(1e-5, 1 - w / radOf(1500)));
        if (running) {
          const sub = 40, h = dt / sub;
          for (let k = 0; k < sub; k++) {
            const s = Math.max(1e-5, 1 - w / radOf(1500)), r = m.at(s), TL = loadT(rpmOf(w), R.Tn);
            let acc = (r.T - TL) / V.J;
            if (w <= 0 && r.T <= TL) acc = 0;
            w = Math.max(0, w + h * acc);
            if (runUp == null) heat += r.rotorLoss * h;
            peakI = Math.max(peakI, r.I1);
          }
          op = m.at(Math.max(1e-5, 1 - w / radOf(1500)));
          const nNow = rpmOf(w), TL = loadT(nNow, R.Tn);
          if (runUp == null && Math.abs(op.T - TL) < 0.02 * R.Tn && nNow > pts.BD.n) runUp = t - tStart;
          if (t - tStart > 60 && runUp == null) running = false;
        }
        const n = rpmOf(w), pc = x => 100 * x / R.Tn;
        ro.set('pts', pc(pts.LR.T).toFixed(0) + ' % · ' + pc(pts.PU.T).toFixed(0) + ' % · ' + pc(pts.BD.T).toFixed(0) + ' % of rated');
        ro.set('lrc', pts.LR.I1.toFixed(0) + ' A = ' + (pts.LR.I1 / R.In).toFixed(1) + ' × rated (' + R.In.toFixed(1) + ' A)');
        ro.set('sn', ((1 - R.s) * 1500).toFixed(0) + ' rpm, slip ' + (100 * R.s).toFixed(1) + ' %, T_n = ' + R.Tn.toFixed(1) + ' N·m');
        ro.set('now', n.toFixed(0) + ' rpm · ' + pc(op.T).toFixed(0) + ' % · ' + (op.I1 / R.In).toFixed(1) + ' × I_n');
        const stuck = running && runUp == null && t - tStart > 3 && w < radOf(5);
        const crawl = running && runUp == null && t - tStart > 4 && n > 5 && n < pts.BD.n && Math.abs(op.T - loadT(n, R.Tn)) < 0.03 * R.Tn;
        ro.set('ru', runUp != null ? runUp.toFixed(2) + ' s' : running ? (stuck ? 'does not break away!' : crawl ? 'hangs at ' + n.toFixed(0) + ' rpm — crawling' : (t - tStart).toFixed(1) + ' s …') : 'press Start from rest');
        ro.set('heat', running || runUp != null ? (heat / 1000).toFixed(1) + ' kJ ≈ ' + (heat / 1800).toFixed(0) + ' K in a 2 kg cage' : '—');
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t;
          const mc = [], ld = [], cur = [], ref = [];
          const m100 = cageMotor(d, 1, V.h7);
          for (let i = 0; i <= 150; i++) { const s = 1 - i / 150 * 0.9995, r = m.at(s); mc.push([r.n, pc(r.T)]); cur.push([r.n, r.I1 / R.In]); if (V.vpc !== 100) ref.push([r.n, pc(m100.at(s).T)]); }
          for (let i = 0; i <= 60; i++) { const nn = 1500 * i / 60; ld.push([nn, pc(loadT(nn, R.Tn))]); }
          const ser = [{ pts: mc, label: 'motor at ' + V.vpc + ' % voltage' }, { pts: ld, label: 'load', color: kit.colors().muted, dash: [5, 4] }];
          if (ref.length) ser.push({ pts: ref, label: 'at 100 % voltage', dash: [2, 3], width: 1.2 });
          pT.set({ series: ser, marks: [{ x: 0, y: pc(pts.LR.T), label: 'locked rotor' }, { x: pts.PU.n, y: pc(pts.PU.T), label: 'pull-up' }, { x: pts.BD.n, y: pc(pts.BD.T), label: 'breakdown' }, { x: n, y: pc(op.T), label: 'now' }], hlines: [{ y: 100, label: 'rated' }] });
          pI.set({ series: [{ pts: cur, label: 'line current' }], marks: [{ x: n, y: op.I1 / R.In, label: 'now' }], hlines: [{ y: 1, label: 'rated' }] });
        }
        // drawing: a tachometer, current and rotor-heat bars, and the bar shape
        ang += w * dt / 30;
        const c = begin(st, 640, 230), tx = 110, ty = 120, TR = 80;
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.arc(tx, ty, TR, Math.PI * 0.8, Math.PI * 2.2); c.stroke();
        for (let k = 0; k <= 6; k++) { const a = Math.PI * 0.8 + k / 6 * Math.PI * 1.4; c.beginPath(); c.moveTo(tx + (TR - 8) * Math.cos(a), ty + (TR - 8) * Math.sin(a)); c.lineTo(tx + TR * Math.cos(a), ty + TR * Math.sin(a)); c.stroke(); text(c, String(k * 250), tx + (TR - 22) * Math.cos(a), ty + (TR - 22) * Math.sin(a) + 4, { size: 10, color: C.muted }); }
        const an = Math.PI * 0.8 + clamp(n / 1500, 0, 1) * Math.PI * 1.4;
        kit.arrow(c, tx, ty, tx + (TR - 14) * Math.cos(an), ty + (TR - 14) * Math.sin(an), C.accent, 3);
        text(c, n.toFixed(0) + ' rpm', tx, ty + 40, { weight: 600, size: 14 });
        const bx = 230, bw = 250;
        const fr = clamp(op.I1 / R.In / 8, 0, 1);
        text(c, 'line current (bar = 8 × rated)', bx, 40, { align: 'left', color: C.muted });
        c.fillStyle = C.faint; c.fillRect(bx, 48, bw, 14); c.fillStyle = op.I1 > 2 * R.In ? C.bad : C.accent; c.fillRect(bx, 48, bw * fr, 14);
        text(c, (op.I1 / R.In).toFixed(1) + ' × I_n', bx + bw + 8, 60, { align: 'left' });
        const TL = loadT(n, R.Tn), accT = op.T - TL;
        text(c, 'accelerating torque (motor − load)', bx, 92, { align: 'left', color: C.muted });
        c.fillStyle = C.faint; c.fillRect(bx, 100, bw, 14); c.fillStyle = accT >= 0 ? C.ok : C.bad; c.fillRect(bx + (accT >= 0 ? 0 : bw * clamp(1 + accT / (3 * R.Tn), 0, 1)), 100, bw * clamp(Math.abs(accT) / (3 * R.Tn), 0, 1), 14);
        text(c, (100 * accT / R.Tn).toFixed(0) + ' % of T_n', bx + bw + 8, 112, { align: 'left' });
        text(c, 'rotor heat of this start (bar = 60 kJ)', bx, 144, { align: 'left', color: C.muted });
        c.fillStyle = C.faint; c.fillRect(bx, 152, bw, 14); c.fillStyle = 'hsl(24 90% 55%)'; c.fillRect(bx, 152, bw * clamp(heat / 60000, 0, 1), 14);
        text(c, (heat / 1000).toFixed(1) + ' kJ', bx + bw + 8, 164, { align: 'left' });
        text(c, 'no-load start alone: ½Jω_s² = ' + (0.5 * V.J * Math.pow(radOf(1500), 2) / 1000).toFixed(1) + ' kJ', bx, 190, { align: 'left', color: C.faint, size: 11 });
        // the bar shape of the design
        const sx = 585, lay = BARS[V.des].build('al'), Hm = lay.reduce((a, l) => a + l[0], 0), sc = 150 / 30;
        text(c, 'rotor bar', sx, 30, { color: C.muted });
        let yy = 40; for (let j = lay.length - 1; j >= 0; j--) { const l = lay[j], h = l[0] * sc; c.fillStyle = l[3] ? (l[3] === 'brass' ? 'hsl(45 70% 50%)' : 'hsl(210 12% 62%)') : C.bg; c.fillRect(sx - (l[3] ? l[1] : l[2]) * sc / 2, yy, (l[3] ? l[1] : l[2]) * sc, h + 0.3); yy += h; }
        text(c, Hm.toFixed(0) + ' mm deep', sx, 40 + Hm * sc + 16, { color: C.faint, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== the equivalent circuit and its tests */
  // per phase of the 7.5 kW star motor, with the core-loss resistance; R2 rises with rotor frequency (deep bars)
  function circuit(o) {
    const Vph = o.V / SQ3, k = o.f / 50, Z1 = Cx(0.7, 1.1 * k), Zm = par(Cx(1000, 0), Cx(0, 45 * k)), s = clamp(o.s, 1e-5, 1);
    const R2 = 0.55 * (1 + (o.deep ? 1 : 0) * k * s), Z2 = Cx(R2 / s, 1.6 * k), Zp = par(Zm, Z2), Z = cadd(Z1, Zp);
    const I1 = cdiv(Cx(Vph, 0), Z), E = cmul(I1, Zp), I2 = cdiv(E, Z2), Im = cdiv(E, Cx(0, 45 * k)), Ic = cdiv(E, Cx(1000, 0));
    const ws = TAU * o.f / 2, Pag = 3 * cabs(I2) * cabs(I2) * R2 / s, T = Pag / ws, Pin = 3 * Vph * I1.re, fw = o.s < 0.999 ? 120 * (1 - s) : 0;
    const Pmech = (1 - s) * Pag - fw;
    return { Vph, I1, E, I2, Im, Ic, R2, T, Pag, Pin, Pmech, eff: Pin > 0 ? Pmech / Pin : 0, pf: I1.re / Math.max(1e-9, cabs(I1)), n: (1 - s) * 1500 * k, Rload: R2 * (1 - s) / s };
  }
  Hyper.sim('im-equivalent-circuit', {
    title: 'The equivalent circuit and the motor tests',
    blurb: `One phase of a 7.5 kW, 400 V star motor as a circuit: stator resistance and leakage reactance, the magnetising branch (X_m with the core-loss resistance R_c), and the rotor branch, whose resistance R₂′/s is drawn as the rotor's own R₂′ plus a "load" resistance R₂′(1 − s)/s that stands for the mechanical power. Moving dots show the currents; the phasor diagram on the right shows them against the voltage.

**Try this**
- *Running*: slide the slip from 0.1 % to 100 %. At small slip nearly all the current is magnetising and lags the voltage by almost 90° (poor power factor); at rated slip (≈ 3 %) the rotor branch carries most of it; at standstill the load resistance vanishes and the current is five times rated.
- *No-load test*: the rotor branch is nearly open. Read V, I and P, and see X₁ + X_m and the core-plus-friction loss worked out.
- *Locked-rotor test*: raise the voltage until about 13.5 A flows (about 19 % of 400 V at 50 Hz). The measured rotor resistance comes out about double the running value — the deep bars at 50 Hz. Switch the test to 12.5 Hz (about 9 % of 400 V is then enough) and it comes much closer to the running 0.55 Ω.
- Untick *Deep-bar rotor* to see the difference vanish.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let ph1 = 0, ph2 = 0, ph3 = 0, t = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mode', options: [['Running at a chosen slip', 'run'], ['No-load test (shaft uncoupled)', 'nl'], ['Locked-rotor test (reduced voltage)', 'lr']], value: 'run' },
        { id: 's', label: 'Slip', min: 0.1, max: 100, value: 3.2, unit: '%', log: true, sig: 2 },
        { id: 'vpc', label: 'Locked-rotor test voltage, % of 400 V', min: 5, max: 40, step: 0.5, value: 17.5, unit: '%' },
        { id: 'ftest', type: 'select', label: 'Locked-rotor test frequency', options: [['50 Hz (rated)', 50], ['12.5 Hz (a quarter of rated)', 12.5]], value: 50 },
        { id: 'deep', type: 'check', label: 'Deep-bar rotor', value: true }
      ], id => { if (id === 'mode') { ctl.show('s', V.mode === 'run'); ctl.show('vpc', V.mode === 'lr'); ctl.show('ftest', V.mode === 'lr'); } lastPlot = -1; });
      const V = ctl.values; ctl.show('vpc', false); ctl.show('ftest', false);
      const ro = kit.readout(box.side, [['a', 'Line current I₁'], ['b', 'Magnetising · rotor current'], ['c', 'Power factor · efficiency'], ['d', 'Torque · shaft power'], ['e', 'Measured (test)'], ['f', 'Worked out from the test']]);
      const pT = kit.plot(g1, { x: { label: 'slip (%)', min: 0.1, max: 100, log: true }, y: { label: 'torque (N·m) · current (A)', min: 0 }, legend: true }, 190);
      const pE = kit.plot(g2, { x: { label: 'slip (%)', min: 0.1, max: 100, log: true }, y: { label: '%', min: 0, max: 100 }, legend: true }, 190);
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors();
        let o;
        if (V.mode === 'nl') {                                                  // friction alone loads the shaft: find that slip
          let lo = 1e-6, hi = 0.05; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (circuit({ V: 400, f: 50, s: m, deep: V.deep }).Pmech < 0) lo = m; else hi = m; }
          o = { V: 400, f: 50, s: hi, deep: V.deep };
        } else if (V.mode === 'lr') o = { V: 400 * V.vpc / 100, f: +V.ftest, s: 1, deep: V.deep };
        else o = { V: 400, f: 50, s: V.s / 100, deep: V.deep };
        const r = circuit(o), I1 = cabs(r.I1), Im = cabs(r.Im), I2 = cabs(r.I2);
        ro.set('a', I1.toFixed(2) + ' A');
        ro.set('b', Im.toFixed(2) + ' A · ' + I2.toFixed(2) + ' A');
        ro.set('c', r.pf.toFixed(3) + ' · ' + (V.mode === 'run' ? (100 * Math.max(0, r.eff)).toFixed(1) + ' %' : '—'));
        ro.set('d', r.T.toFixed(1) + ' N·m · ' + (V.mode === 'run' ? (Math.max(0, r.Pmech) / 1000).toFixed(2) + ' kW' : '—'));
        if (V.mode === 'nl') {
          const cu1 = 3 * I1 * I1 * 0.7;
          ro.set('e', '400 V, ' + I1.toFixed(2) + ' A, ' + r.Pin.toFixed(0) + ' W');
          ro.set('f', 'X₁ + X_m = ' + (400 / (SQ3 * I1)).toFixed(1) + ' Ω; core + friction ≈ ' + (r.Pin - cu1).toFixed(0) + ' W');
        } else if (V.mode === 'lr') {
          const R = r.Pin / (3 * I1 * I1), Z = r.Vph / I1, X = Math.sqrt(Math.max(0, Z * Z - R * R)) * 50 / o.f;
          ro.set('e', o.V.toFixed(0) + ' V, ' + I1.toFixed(1) + ' A, ' + r.Pin.toFixed(0) + ' W at ' + o.f + ' Hz');
          ro.set('f', 'R₂′ = ' + (R - 0.7).toFixed(2) + ' Ω (running 0.55); X₁ + X₂′ = ' + X.toFixed(2) + ' Ω at 50 Hz (true 2.70)');
        } else { ro.set('e', '— (choose a test)'); ro.set('f', '—'); }
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const tq = [], cu = [], pf = [], ef = [];
          for (let i = 0; i <= 90; i++) { const s = Math.pow(10, -1 + 3 * i / 90), q = circuit({ V: 400, f: 50, s: s / 100, deep: V.deep }); tq.push([s, q.T]); cu.push([s, cabs(q.I1)]); pf.push([s, 100 * q.pf]); ef.push([s, 100 * Math.max(0, q.eff)]); }
          const sx = 100 * o.s;
          pT.set({ series: [{ pts: tq, label: 'torque (N·m)' }, { pts: cu, label: 'line current (A)' }], marks: [{ x: sx, y: r.T }, { x: sx, y: I1 }], vlines: [{ x: 3.2, label: 'rated' }] });
          pE.set({ series: [{ pts: pf, label: 'power factor (%)' }, { pts: ef, label: 'efficiency (%)' }], marks: V.mode === 'run' ? [{ x: sx, y: 100 * r.pf }, { x: sx, y: 100 * Math.max(0, r.eff) }] : [], vlines: [{ x: 3.2, label: 'rated' }] });
        }
        // the circuit
        const c = begin(st, 820, 300), top = 70, bot = 240, acc = C.accent;
        ph1 += dt * 12 * I1; ph2 += dt * 12 * Im; ph3 += dt * 12 * I2;
        S.vsource(c, 40, top, 40, bot, { ac: true, label: 'V_ph', value: r.Vph.toFixed(0) + ' V' });
        S.wire(c, [[40, top], [70, top]]);
        S.resistor(c, 70, top, 140, top, { label: 'R₁', value: '0.70 Ω' });
        S.inductor(c, 150, top, 230, top, { label: 'X₁', value: (1.1 * o.f / 50).toFixed(2) + ' Ω' });
        S.wire(c, [[140, top], [150, top]]); S.wire(c, [[230, top], [400, top]]);
        S.resistor(c, 280, top + 20, 280, bot - 20, { label: 'R_c', value: '1 kΩ' }); S.wire(c, [[280, top], [280, top + 20]]); S.wire(c, [[280, bot - 20], [280, bot]]);
        S.inductor(c, 350, top + 20, 350, bot - 20, { label: 'X_m', value: (45 * o.f / 50).toFixed(1) + ' Ω' }); S.wire(c, [[350, top], [350, top + 20]]); S.wire(c, [[350, bot - 20], [350, bot]]);
        S.node(c, 280, top); S.node(c, 350, top); S.node(c, 280, bot); S.node(c, 350, bot);
        S.inductor(c, 400, top, 480, top, { label: 'X₂′', value: (1.6 * o.f / 50).toFixed(2) + ' Ω' });
        S.resistor(c, 500, top, 570, top, { label: 'R₂′', value: r.R2.toFixed(2) + ' Ω' });
        S.wire(c, [[480, top], [500, top]]); S.wire(c, [[570, top], [620, top], [620, top + 25]]);
        const loadStr = o.s >= 0.999 ? '0 Ω (standstill)' : r.Rload > 999 ? (r.Rload / 1000).toFixed(1) + ' kΩ' : r.Rload.toFixed(1) + ' Ω';
        S.resistor(c, 620, top + 25, 620, bot - 25, { label: 'R₂′(1−s)/s', value: loadStr, color: 'hsl(150 55% 45%)' });
        S.wire(c, [[620, bot - 25], [620, bot], [40, bot]]);
        text(c, 'mechanical power', 690, bot - 70, { color: 'hsl(150 55% 45%)', size: 11 });
        text(c, 'stator', 150, 30, { color: C.muted }); text(c, 'magnetising branch', 315, 30, { color: C.muted }); text(c, 'rotor (referred)', 520, 30, { color: C.muted });
        S.flow(c, [[40, bot], [40, top], [280, top]], ph1, { color: acc });
        S.flow(c, [[350, top], [350, bot]], ph2, { color: C.warn });
        S.flow(c, [[350, top], [620, top], [620, bot], [350, bot]], ph3, { color: C.ok });
        text(c, 'I₁ ' + I1.toFixed(1) + ' A', 100, top + 34, { color: acc, weight: 600 });
        text(c, 'I_m ' + Im.toFixed(1) + ' A', 390, bot - 60, { color: C.warn, weight: 600, align: 'left' });
        text(c, 'I₂′ ' + I2.toFixed(1) + ' A', 520, top + 34, { color: C.ok, weight: 600 });
        text(c, V.mode === 'nl' ? 'no load: s ≈ ' + (100 * o.s).toFixed(2) + ' %, rotor branch nearly open' : V.mode === 'lr' ? 'rotor locked: s = 1, test at ' + o.f + ' Hz' : 'running at s = ' + V.s.toFixed(2) + ' %', 330, 286, { color: C.muted });
        // phasors: V along +x, currents scaled to the largest
        const px = 745, py = 150, sc = 60 / Math.max(1e-9, I1, Im, I2);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(px, py, 64, 0, TAU); c.stroke();
        kit.arrow(c, px, py, px + 66, py, C.text, 2); text(c, 'V', px + 72, py + 4, { align: 'left' });
        const ang = z => Math.atan2(z.im, z.re);
        const draw = (z, col, lab) => { const L = cabs(z) * sc, a = ang(z); if (L > 2) { kit.arrow(c, px, py, px + L * Math.cos(a), py - L * Math.sin(a), col, 2.5); text(c, lab, px + (L + 10) * Math.cos(a), py - (L + 10) * Math.sin(a) + 4, { color: col, size: 11 }); } };
        draw(r.I1, acc, 'I₁'); draw(r.Im, C.warn, 'I_m'); draw(r.I2, C.ok, 'I₂′');
        text(c, 'φ = ' + (Math.acos(clamp(r.pf, -1, 1)) * 180 / Math.PI).toFixed(0) + '°', px, py + 88, { color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== the wound-rotor motor and its starter */
  // the 7.5 kW stator with a wound rotor (R2′ = 0.45 Ω, no deep-bar effect); turns ratio 2, so the rotor-side values are
  // R = R′/4, I = 2 I′ and the standstill ring voltage 200 V. External resistance per phase, referred, for each step:
  const WR_TOT = [4.75, 2.45, 1.2, 0.5, 0];
  Hyper.sim('im-wound-rotor', {
    title: 'A slip-ring motor and its rotor starter',
    blurb: `A 7.5 kW, 400 V wound-rotor motor. The rotor winding comes out through three slip rings and brushes to a star-connected resistor bank; contactors K1 to K4 short it step by step, from the star point towards the rings. The graph shows the torque–speed curve for every step (the active one bold) with the load line; the second graph the stator current during the start.

**Try this**
- With *Automatic starter* ticked, press *Start from rest*: the motor starts on step 1 with about 2.5 times rated torque at about 2.7 times rated current. Each time the current falls to the switching level a contactor closes, the operating point jumps to the next curve, and the current rises again — never near the 5–6 × of a direct start.
- Untick the automatic starter and choose the steps by hand: with all resistance in, the maximum torque sits near standstill; with the rings shorted the curve is an ordinary cage motor's.
- Leave resistance in at full load: the motor runs slower, and the resistors burn the slip power (see the read-out).
- Watch the slip-ring voltage: 200 V at standstill, only a few volts when running.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      const base = Object.assign({}, IM7, { R2: 0.45, deepBar: 0 });
      const ims = WR_TOT.map(Rx => M.induction(Object.assign({}, base, { R2: 0.45 + Rx })));
      const Tn = 7500 / ((1 - ratedSlip(ims[4], 7500)) * ims[4].ws), In = ims[4].at(ratedSlip(ims[4], 7500)).I1, Tfw = 120 / ims[4].ws;
      const s0 = steadySlip(ims[4], Tn);
      let step = 4, w = (1 - (s0 == null ? 0.03 : s0)) * ims[4].ws, t = 0, tStart = -1, trace = [], lastPlot = -1, ang = 0, ph = 0;
      const ctl = kit.controls(box.side, [
        { id: 'auto', type: 'check', label: 'Automatic starter (steps on current)', value: true },
        { id: 'step', type: 'select', label: 'Resistance step (manual)', options: [['Step 1: all resistance in', 0], ['Step 2 (K1 closed)', 1], ['Step 3 (K1, K2)', 2], ['Step 4 (K1–K3)', 3], ['Rings shorted (K1–K4)', 4]], value: 4 },
        { id: 'sw', label: 'Automatic: next step when the current falls to', min: 1.1, max: 2.5, step: 0.05, value: 1.5, unit: '× rated' },
        { id: 'load', label: 'Load (constant torque), % of rated', min: 0, max: 150, step: 1, value: 100, unit: '%' },
        { id: 'J', label: 'Total inertia at the motor shaft', min: 0.1, max: 5, value: 1, unit: 'kg·m²', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from rest', primary: true }] }
      ], id => {
        if (id === 'start') { w = 0; step = V.auto ? 0 : +V.step; tStart = t; trace = []; }
        if (id === 'step' && !V.auto) step = +V.step;
        lastPlot = -1;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['st', 'Step · external R per phase'], ['n', 'Speed · slip'], ['I', 'Stator current'], ['I2', 'Rotor current'], ['E', 'Slip-ring voltage (open circuit)'], ['P', 'Power in the resistors']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'torque (% of rated)', min: 0 }, legend: false }, 200);
      const pI = kit.plot(g2, { x: { label: 'time since start (s)', min: 0 }, y: { label: 'stator current (× rated)', min: 0 }, legend: false }, 200);
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), TL = V.load / 100 * Tn;
        if (!V.auto) step = +V.step;
        const sub = 30, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const im = ims[step], s = Math.max(1e-5, 1 - w / im.ws), r = im.at(s);
          const acc = w <= 0 && r.T <= TL + Tfw ? 0 : (r.T - TL - Tfw) / V.J;
          w = Math.max(0, w + h * acc);
          if (V.auto && tStart >= 0 && step < 4 && w > 0.05 * im.ws && r.I1 < V.sw * In) step++;
        }
        const im = ims[step], s = Math.max(1e-5, 1 - w / im.ws), r = im.at(s), n = rpmOf(w);
        const RxRef = WR_TOT[step], I2rot = 2 * r.I2, Px = 3 * r.I2 * r.I2 * RxRef;
        if (tStart >= 0 && t - tStart < 30) trace.push([t - tStart, r.I1 / In]);
        ro.set('st', (step < 4 ? 'step ' + (step + 1) : 'rings shorted') + ' · ' + (RxRef / 4).toFixed(3) + ' Ω (rotor side)');
        ro.set('n', n.toFixed(0) + ' rpm · ' + (100 * s).toFixed(1) + ' %');
        ro.set('I', r.I1.toFixed(1) + ' A = ' + (r.I1 / In).toFixed(2) + ' × rated');
        ro.set('I2', I2rot.toFixed(1) + ' A in the rings');
        ro.set('E', (200 * s).toFixed(0) + ' V (200 V at standstill)');
        ro.set('P', (Px / 1000).toFixed(2) + ' kW' + (step < 4 && s < 0.9 ? ' — the slip power burnt' : ''));
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t;
          const ser = ims.map((m, k) => { const p = []; for (let i = 0; i <= 100; i++) { const q = m.at(Math.max(1e-4, 1 - i / 100)); p.push([q.n, 100 * q.T / Tn]); } return { pts: p, label: k < 4 ? 'step ' + (k + 1) : 'shorted', width: k === step ? 3.2 : 1.2, dash: k === step ? null : [4, 3] }; });
          ser.push({ pts: [[0, V.load], [1500, V.load]], label: 'load', color: C.muted, dash: [6, 4] });
          pT.set({ series: ser, marks: [{ x: n, y: 100 * r.T / Tn, label: 'now' }], hlines: [{ y: 100, label: 'rated' }] });
          pI.set({ series: [{ pts: trace.length ? trace.filter((p, i) => i % 3 === 0) : [[0, 0]], label: 'stator current' }], hlines: [{ y: V.sw, label: 'switching level' }] });
        }
        // drawing: rotor star, slip rings with brushes, resistor columns and shorting contactors
        ang += w * dt / 30; ph += dt * 6 * r.I2;
        const c = begin(st, 700, 290);
        const rx = 90, ry = 145;
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(rx, ry, 70, 0, TAU); c.fill(); c.stroke();
        for (let k = 0; k < 3; k++) {                                         // the rotor's three windings in star
          const a = ang + k * TAU / 3, x2 = rx + 52 * Math.cos(a), y2 = ry + 52 * Math.sin(a);
          c.strokeStyle = phc(k); c.lineWidth = 3; c.beginPath(); c.moveTo(rx, ry);
          for (let q = 1; q <= 6; q++) { const u = q / 6, off = (q % 2 ? 6 : -6); c.lineTo(rx + (x2 - rx) * u - off * Math.sin(a), ry + (y2 - ry) * u + off * Math.cos(a)); }
          c.stroke();
        }
        c.fillStyle = C.text; c.beginPath(); c.arc(rx, ry, 5, 0, TAU); c.fill();
        text(c, 'wound rotor (star)', rx, ry + 92, { color: C.muted, size: 11 });
        c.fillStyle = C.text; c.fillRect(160, ry - 5, 110, 10);                 // the shaft
        const rings = [190, 220, 250];
        rings.forEach((x, k) => {
          c.fillStyle = 'hsl(30 55% 55%)'; c.beginPath(); c.ellipse(x, ry, 8, 32, 0, 0, TAU); c.fill();
          c.fillStyle = C.muted; c.fillRect(x - 6, ry - 52, 12, 16);           // brush
          S_line(c, [[x, ry - 52], [x, 40 - k * 0], [330 + k * 110, 40], [330 + k * 110, 70]], phc(k), 2.5);
        });
        text(c, 'slip rings and brushes', 220, ry + 56, { color: C.muted, size: 11 });
        // resistor columns: segments from the brushes down to the star point; level L_k shorts below segment k
        const segs = [WR_TOT[3] - WR_TOT[4], WR_TOT[2] - WR_TOT[3], WR_TOT[1] - WR_TOT[2], WR_TOT[0] - WR_TOT[1]];   // r_a (top) … r_d (bottom)
        const y0 = 70, hs = 44;
        for (let k = 0; k < 3; k++) {
          const x = 330 + k * 110;
          for (let q = 0; q < 4; q++) {
            const yA = y0 + q * hs + 8, yB = yA + hs - 16, inCircuit = (4 - step) > q;   // segments below the closed level are bypassed
            c.strokeStyle = inCircuit ? 'hsl(15 85% ' + (45 + 20 * clamp(Px / 3000, 0, 1)).toFixed(0) + '%)' : C.faint; c.lineWidth = 2;
            c.beginPath(); c.moveTo(x, yA - 8); c.lineTo(x, yA);
            for (let z = 0; z < 6; z++) c.lineTo(x + (z % 2 ? -7 : 7), yA + (z + 0.5) * (yB - yA) / 6);
            c.lineTo(x, yB); c.lineTo(x, yB + 8); c.stroke();
            if (k === 0) text(c, (segs[q] / 4).toFixed(2) + ' Ω', x - 14, (yA + yB) / 2 + 4, { align: 'right', color: C.muted, size: 10 });
          }
        }
        for (let q = 0; q < 3; q++) {                                           // contactor levels: K3 … K1 between the segments
          const y = y0 + (q + 1) * hs, kNo = 3 - q, closed = step >= kNo;
          c.strokeStyle = closed ? C.ok : C.faint; c.lineWidth = closed ? 3 : 1.5; c.setLineDash(closed ? [] : [5, 4]);
          c.beginPath(); c.moveTo(330, y); c.lineTo(550, y); c.stroke(); c.setLineDash([]);
          text(c, 'K' + kNo, 570, y + 4, { align: 'left', color: closed ? C.ok : C.muted, size: 11 });
        }
        const yK4 = y0; c.strokeStyle = step >= 4 ? C.ok : C.faint; c.lineWidth = step >= 4 ? 3 : 1.5; c.setLineDash(step >= 4 ? [] : [5, 4]); c.beginPath(); c.moveTo(330, yK4); c.lineTo(550, yK4); c.stroke(); c.setLineDash([]);
        text(c, 'K4', 570, yK4 + 4, { align: 'left', color: step >= 4 ? C.ok : C.muted, size: 11 });
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(330, y0 + 4 * hs); c.lineTo(550, y0 + 4 * hs); c.stroke();
        text(c, 'star point', 570, y0 + 4 * hs + 4, { align: 'left', color: C.muted, size: 11 });
        text(c, 'resistor bank (one column per phase)', 440, 285, { color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================== the terminal box: star and delta */
  // a motor whose windings see k times their rated voltage: the 7.5 kW model at 400·k V (star equivalent), with the
  // magnetising reactance falling as the iron saturates above rated flux (a rough law: I_m grows ~ k(1 + 6(k − 1)²))
  function atVoltage(M, base, k) {
    const sat = 1 + 6 * Math.pow(Math.max(0, k - 1), 2);
    return M.induction(Object.assign({}, base, { V_LL: base.V_LL * k, Xm: base.Xm / sat }));
  }
  Hyper.sim('im-terminal-box', {
    title: 'The terminal box: star and delta',
    blurb: `The six studs of an IEC terminal box — W2 U2 V2 above U1 V1 W1 — with the supply lines on U1, V1, W1. Three links make star (along the top row) or delta (three upright links). Click the box, or use the menu, to change the links. The middle drawing shows the three windings as they are then connected, with the voltage across each and the current through it; the graphs show the torque the motor can give on that connection against the torque it would give correctly connected.

**Try this**
- A 230/400 V motor on the 400 V network: star is right (230 V per winding). Change to delta: each winding gets 400 V, 173 % of its rating — the magnetising current explodes and the motor would burn.
- A 400/690 V motor on the 400 V network: delta is right. In star each winding gets only 231 V: every torque falls to a third. The breakdown torque is now just under rated: at 80 % load the motor hangs on with a large slip and current; at 100 % it stalls.
- Tick *Swap L1 and L2*: the arrow on the shaft reverses.
- Compare the line currents of the 230/400 V motor in delta on 230 V and in star on 400 V: the windings carry the same current; the lines carry √3 times more on 230 V.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      const base = Object.assign({}, IM7), im0 = M.induction(base), sn = ratedSlip(im0, 7500), Tn = 7500 / ((1 - sn) * im0.ws), Iw0 = im0.at(sn).I1;
      let t = 0, lastPlot = -1, ph = 0, ang = 0, fr = null;
      const ctl = kit.controls(box.side, [
        { id: 'mot', type: 'select', label: 'Motor (7.5 kW)', options: [['230/400 V Δ/Y — windings rated 230 V', 230], ['400/690 V Δ/Y — windings rated 400 V', 400]], value: 230 },
        { id: 'net', type: 'select', label: 'Network (line-to-line)', options: [['230 V', 230], ['400 V', 400], ['690 V', 690]], value: 400 },
        { id: 'conn', type: 'select', label: 'Links', options: [['Star (Y)', 'Y'], ['Delta (Δ)', 'D']], value: 'Y' },
        { id: 'load', label: 'Load, % of rated torque', min: 0, max: 120, step: 1, value: 80, unit: '%' },
        { id: 'swap', type: 'check', label: 'Swap L1 and L2', value: false }
      ], () => { lastPlot = -1; });
      const V = ctl.values;
      kit.click(st, p => { if (!fr) return; const q = fr.to(p); if (q.x > 20 && q.x < 270 && q.y > 30 && q.y < 280) { ctl.set('conn', V.conn === 'Y' ? 'D' : 'Y'); lastPlot = -1; } }, p => { if (!fr) return false; const q = fr.to(p); return q.x > 20 && q.x < 270 && q.y > 30 && q.y < 280; });
      const ro = kit.readout(box.side, [['wv', 'Voltage on each winding'], ['wi', 'Current in each winding'], ['li', 'Line current'], ['tb', 'Breakdown torque available'], ['st', 'Verdict'], ['dir', 'Rotation (seen from the drive end)']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'torque (% of rated)', min: 0 }, legend: true }, 190);
      const pI = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'line current (A)', min: 0 }, legend: true }, 190);
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), Vw = +V.mot, VL = +V.net, Y = V.conn === 'Y';
        const vw = Y ? VL / SQ3 : VL, k = vw / (Vw === 230 ? 400 / SQ3 : 400), im = atVoltage(M, base, k), scale = (400 / SQ3) / (Vw === 230 ? 400 / SQ3 : 400);
        const TL = V.load / 100 * Tn, sS = steadySlip(im, TL), stalled = sS == null, s = stalled ? 1 : sS, op = im.at(s);
        const Iw = op.I1 * scale, IL = Y ? Iw : SQ3 * Iw, IwR = Iw0 * scale;
        const kOK = Math.abs(k - 1) < 0.06;
        ro.set('wv', vw.toFixed(0) + ' V (rated ' + (Vw === 230 ? 230 : 400) + ' V) = ' + (100 * k).toFixed(0) + ' %');
        ro.set('wi', Iw.toFixed(1) + ' A (rated ' + IwR.toFixed(1) + ' A)');
        ro.set('li', IL.toFixed(1) + ' A');
        ro.set('tb', (100 * im.Tmax / Tn).toFixed(0) + ' % of rated');
        const verdict = kOK ? (stalled ? 'right connection, but the load is above breakdown' : 'correct: each winding gets its rated voltage') : k < 1 ? (stalled ? 'too low: torque ÷ ' + (1 / (k * k)).toFixed(1) + ' — the motor stalls' : 'too low: torque ÷ ' + (1 / (k * k)).toFixed(1) + ', slip and current up') : 'too high: the iron saturates — it trips or burns';
        ro.set('st', verdict);
        const ccw = V.swap;
        ro.set('dir', ccw ? 'anticlockwise (phase sequence reversed)' : 'clockwise (L1–L2–L3 on U1–V1–W1)');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const imc = atVoltage(M, base, 1), a = [], b = [], ci = [];
          for (let i = 0; i <= 120; i++) { const ss = Math.max(1e-4, 1 - i / 120), q = im.at(ss), r = imc.at(ss); a.push([q.n, 100 * q.T / Tn]); b.push([r.n, 100 * r.T / Tn]); ci.push([q.n, (Y ? 1 : SQ3) * q.I1 * scale]); }
          pT.set({ series: [{ pts: a, label: 'this connection' }, { pts: b, label: 'correctly connected', dash: [5, 4] }, { pts: [[0, V.load], [1500, V.load]], label: 'load', color: C.muted, dash: [2, 4] }], marks: [{ x: op.n, y: 100 * op.T / Tn, label: stalled ? 'stalled' : 'runs' }] });
          pI.set({ series: [{ pts: ci, label: 'line current, this connection' }], marks: [{ x: op.n, y: IL, label: 'now' }] });
        }
        // drawing
        ph += dt * 3 * Iw; ang += (stalled ? 0 : 1) * (ccw ? -1 : 1) * dt * 2;
        const c = begin(st, 760, 300); fr = frame(st, 760, 300);
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.roundRect ? c.roundRect(25, 35, 240, 240, 10) : c.rect(25, 35, 240, 240); c.fill(); c.stroke();
        text(c, 'terminal box (click to change the links)', 145, 26, { color: C.muted, size: 11 });
        const cols = [70, 145, 220], yT = 100, yB = 190;
        const topLab = ['W2', 'U2', 'V2'], botLab = ['U1', 'V1', 'W1'], topPh = [2, 0, 1], botPh = [0, 1, 2];
        // links
        c.fillStyle = 'hsl(40 70% 50%)';
        if (Y) { c.fillRect(cols[0] - 4, yT - 7, cols[2] - cols[0] + 8, 14); }
        else for (let i = 0; i < 3; i++) c.fillRect(cols[i] - 7, yT - 4, 14, yB - yT + 8);
        for (let i = 0; i < 3; i++) {
          for (const [x, y, lab, pq] of [[cols[i], yT, topLab[i], topPh[i]], [cols[i], yB, botLab[i], botPh[i]]]) {
            c.fillStyle = C.bg2; c.strokeStyle = phc(pq); c.lineWidth = 3; c.beginPath(); c.arc(x, y, 14, 0, TAU); c.fill(); c.stroke();
            c.fillStyle = C.text; c.beginPath(); c.arc(x, y, 4, 0, TAU); c.fill();
            text(c, lab, x, y + (y === yT ? -22 : 32), { weight: 600, color: phc(pq) });
          }
        }
        // supply cables from below
        const lines = V.swap ? ['L2', 'L1', 'L3'] : ['L1', 'L2', 'L3'];
        for (let i = 0; i < 3; i++) { S_line(c, [[cols[i], yB + 14], [cols[i], 262]], C.text, 3); text(c, lines[i], cols[i] + 16, 258, { align: 'left', size: 11, color: C.muted }); }
        text(c, Y ? 'STAR: links W2–U2–V2' : 'DELTA: links U1–W2, V1–U2, W1–V2', 145, 150, { weight: 700, color: 'hsl(40 70% 45%)' });
        // the winding diagram
        const ox = 400, oy = 165, R = 78, hot = clamp(Iw / Math.max(1e-9, IwR), 0, 3), kc2 = kOK ? C.ok : C.bad;
        const corner = q => [ox + R * Math.cos(-Math.PI / 2 + q * TAU / 3), oy + R * Math.sin(-Math.PI / 2 + q * TAU / 3)];
        const coil = (a, b, pq) => {
          const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
          c.strokeStyle = phc(pq); c.lineWidth = 2.5; c.beginPath(); c.moveTo(a[0], a[1]);
          const n = 5; for (let z = 0; z <= n * 8; z++) { const u = 0.2 + 0.6 * z / (n * 8), bump = Math.abs(Math.sin(z / 8 * Math.PI)) * 8; c.lineTo(a[0] + dx * u + nx * bump, a[1] + dy * u + ny * bump); }
          c.lineTo(b[0], b[1]); c.stroke();
          text(c, vw.toFixed(0) + ' V', a[0] + dx * 0.5 - nx * 18, a[1] + dy * 0.5 - ny * 18 + 4, { size: 11, color: kc2, weight: 600 });
        };
        if (Y) {
          for (let q = 0; q < 3; q++) { const p = corner(q), end = [ox + (p[0] - ox) * 1.55, oy + (p[1] - oy) * 1.55]; coil([ox, oy], p, q); S_line(c, [p, end], C.text, 2); text(c, lines[q], end[0], end[1] + (q === 0 ? -6 : 16), { size: 11, color: C.muted }); S_line(c, [[ox, oy], [ox, oy]], C.text, 1); }
          c.fillStyle = C.text; c.beginPath(); c.arc(ox, oy, 4, 0, TAU); c.fill(); text(c, 'star point', ox + 30, oy + 4, { size: 10, color: C.faint, align: 'left' });
        } else {
          for (let q = 0; q < 3; q++) { const a = corner(q), b = corner((q + 1) % 3); coil(a, b, q); const end = [ox + (a[0] - ox) * 1.45, oy + (a[1] - oy) * 1.45]; S_line(c, [a, end], C.text, 2); text(c, lines[q], end[0], end[1] + (q === 0 ? -6 : 16), { size: 11, color: C.muted }); c.fillStyle = C.text; c.beginPath(); c.arc(a[0], a[1], 4, 0, TAU); c.fill(); }
        }
        text(c, (Y ? 'star' : 'delta') + ' on ' + VL + ' V: ' + vw.toFixed(0) + ' V per winding', ox, 290, { color: kc2, weight: 600 });
        // shaft end, rotation and a winding-current gauge
        const sx = 640, sy = 120;
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(sx, sy, 50, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.arc(sx, sy, 16, 0, TAU); c.fill();
        c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 14 * Math.cos(ang), sy + 14 * Math.sin(ang)); c.stroke();
        const a0 = ccw ? 2.6 : -2.2, a1 = ccw ? 0.4 : 0;                       // screen angles grow clockwise
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.arc(sx, sy, 62, Math.min(a0, a1), Math.max(a0, a1)); c.stroke();
        const tx1 = ccw ? Math.sin(a1) : -Math.sin(a1), ty1 = ccw ? -Math.cos(a1) : Math.cos(a1), hx = sx + 62 * Math.cos(a1), hy = sy + 62 * Math.sin(a1);
        kit.arrow(c, hx - 10 * tx1, hy - 10 * ty1, hx + 2 * tx1, hy + 2 * ty1, C.accent, 3);
        text(c, 'drive end', sx, sy + 78, { color: C.muted, size: 11 });
        text(c, 'winding current ' + hot.toFixed(1) + ' × rated', sx, 222, { color: hot > 1.1 ? C.bad : C.muted });
        c.fillStyle = C.faint; c.fillRect(sx - 60, 230, 120, 12); c.fillStyle = hot > 1.1 ? C.bad : C.ok; c.fillRect(sx - 60, 230, 120 * clamp(hot / 3, 0, 1), 12);
        text(c, stalled ? 'STALLED' : kOK ? 'OK' : k > 1 ? 'OVERVOLTAGE' : 'UNDERVOLTAGE', sx, 272, { weight: 700, size: 15, color: kOK && !stalled ? C.ok : C.bad });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== a NEMA 9-lead dual-voltage motor */
  // a 10 hp, 460 V, 60 Hz, 4-pole motor: the 7.5 kW per-unit values at 460 V
  const IM60 = { V_LL: 460, f: 60, poles: 4, R1: 0.93, X1: 1.46, R2: 0.73, X2: 2.13, Xm: 59.9, Pfw: 120, deepBar: 1 };
  Hyper.sim('im-nine-lead', {
    title: 'A nine-lead 230/460 V motor',
    blurb: `A 10 hp, 4-pole, 60 Hz motor whose three phases are each split into two halves, with nine leads T1–T9 brought out. Choose whether the halves are joined in a wye or a delta inside the motor, how you connect the leads (low voltage: halves in parallel; high voltage: halves in series), and the supply. Each half-coil shows its voltage and colour: green at its rating, red when wrong. The table shows the usual lead groups, with the chosen row lit.

**Try this**
- Wye motor, high-voltage connection on 460 V: each half-coil gets 133 V. Switch to the low-voltage connection on 230 V: still 133 V per half-coil, but twice the line current.
- Leave the low-voltage connection and choose 460 V: every coil gets double its voltage — saturation, a huge current, a burnt motor.
- Put the high-voltage connection on 230 V: a quarter of the torque — the motor stalls at full load.
- Try 208 V on the low-voltage connection: 10 % under voltage, about 18 % less torque, more slip and current.
- Switch to the delta motor: the high-voltage connection is the same; the low-voltage one is different.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const [g1] = graphs(box, 1);
      const im0 = M.induction(IM60), sn = ratedSlip(im0, 7457), Tn = 7457 / ((1 - sn) * im0.ws), In = im0.at(sn).I1;
      let t = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Inside the motor', options: [['9 leads, wye (internal star of the second halves)', 'wye'], ['9 leads, delta (internal delta)', 'delta']], value: 'wye' },
        { id: 'conn', type: 'select', label: 'Connection of the leads', options: [['Low voltage: halves in parallel', 'low'], ['High voltage: halves in series', 'high']], value: 'high' },
        { id: 'sup', type: 'select', label: 'Supply (line-to-line)', options: [['208 V', 208], ['230 V', 230], ['460 V', 460]], value: 460 },
        { id: 'load', label: 'Load, % of rated torque', min: 0, max: 120, step: 1, value: 100, unit: '%' }
      ], () => { lastPlot = -1; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cv', 'Voltage on each half-coil'], ['cc', 'Current in each half-coil'], ['lc', 'Line current'], ['tb', 'Breakdown torque available'], ['st', 'Verdict']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1800 }, y: { label: 'torque (% of rated)', min: 0 }, legend: true }, 190);
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), Vs = +V.sup, low = V.conn === 'low', wye = V.kind === 'wye';
        const k = Vs / (low ? 230 : 460), im = atVoltage(M, IM60, k);
        const TL = V.load / 100 * Tn, sS = steadySlip(im, TL), stalled = sS == null, op = im.at(stalled ? 1 : sS);
        const Imodel = op.I1, IL = (low ? 2 : 1) * Imodel, Icoil = wye ? Imodel : Imodel / SQ3;
        const vc = wye ? Vs / SQ3 / (low ? 1 : 2) : Vs / (low ? 1 : 2), vr = wye ? 460 / SQ3 / 2 : 230;
        const ok = Math.abs(k - 1) < 0.06;
        ro.set('cv', vc.toFixed(0) + ' V (rated ' + vr.toFixed(0) + ' V)');
        ro.set('cc', Icoil.toFixed(1) + ' A (rated ' + (wye ? In : In / SQ3).toFixed(1) + ' A)');
        ro.set('lc', IL.toFixed(1) + ' A (rated ' + ((low ? 2 : 1) * In).toFixed(1) + ' A at ' + (low ? 230 : 460) + ' V)');
        ro.set('tb', (100 * im.Tmax / Tn).toFixed(0) + ' % of rated');
        ro.set('st', k > 1.2 ? 'coils at ' + (100 * k).toFixed(0) + ' % voltage: saturation, trips or burns' : ok ? (stalled ? 'right connection; load above breakdown' : 'correct') : k < 1 ? (stalled ? 'coils at ' + (100 * k).toFixed(0) + ' %: torque ' + (100 * k * k).toFixed(0) + ' % — stalls' : 'coils at ' + (100 * k).toFixed(0) + ' %: torque ' + (100 * k * k).toFixed(0) + ' %, runs hot') : 'coils slightly over voltage');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const a = [], b = [];
          for (let i = 0; i <= 120; i++) { const ss = Math.max(1e-4, 1 - i / 120), q = im.at(ss), r = im0.at(ss); a.push([q.n, 100 * q.T / Tn]); b.push([r.n, 100 * r.T / Tn]); }
          pT.set({ series: [{ pts: a, label: 'this connection on ' + Vs + ' V' }, { pts: b, label: 'correctly connected', dash: [5, 4] }, { pts: [[0, V.load], [1800, V.load]], label: 'load', color: C.muted, dash: [2, 4] }], marks: [{ x: op.n, y: 100 * op.T / Tn, label: stalled ? 'stalled' : 'runs' }] });
        }
        // drawing
        const c = begin(st, 800, 330), col = ok ? C.ok : C.bad;
        const bus = [['L1', 90], ['L2', 170], ['L3', 250]], bx = 470;
        bus.forEach(([n, y], i) => { S_line(c, [[bx, y], [bx + 40, y]], phc(i), 4); text(c, n, bx + 54, y + 4, { weight: 700, color: phc(i), align: 'left' }); });
        const tag = (p, lab) => { c.fillStyle = C.bg2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(p[0], p[1], 10, 0, TAU); c.fill(); c.stroke(); text(c, lab, p[0], p[1] + 4, { size: 10, weight: 700 }); };
        const coil = (a, b, q) => {
          const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
          c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(a[0], a[1]);
          for (let z = 0; z <= 32; z++) { const u = z / 32, bump = Math.abs(Math.sin(z / 8 * Math.PI)) * 7; c.lineTo(a[0] + dx * u + nx * bump, a[1] + dy * u + ny * bump); }
          c.stroke();
          c.strokeStyle = phc(q, 0.6); c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
          text(c, vc.toFixed(0) + ' V', (a[0] + b[0]) / 2 - nx * 16, (a[1] + b[1]) / 2 - ny * 16 + 4, { size: 10, color: col, weight: 600 });
        };
        const P = {};                                                          // lead positions
        const toBus = (lead, li) => { const p = P[lead]; S_line(c, [p, [bx, bus[li][1]]], phc(li, 0.8), 2); };
        const join = (a, b) => { S_line(c, [P[a], P[b]], 'hsl(40 70% 50%)', 4); };
        if (wye) {
          const ox = 210, oy = 175, dirs = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6];
          for (let q = 0; q < 3; q++) {
            const d = dirs[q], at = r => [ox + r * Math.cos(d), oy + r * Math.sin(d)];
            coil(at(14), at(58), q); coil(at(92), at(136), q);
            P['T' + (7 + q)] = at(64); P['T' + (4 + q)] = at(86); P['T' + (1 + q)] = at(142);
            S_line(c, [[ox, oy], at(14)], col, 3);
          }
          c.fillStyle = C.text; c.beginPath(); c.arc(ox, oy, 4, 0, TAU); c.fill(); text(c, 'internal star (T10–T12)', ox, oy + 30, { size: 10, color: C.faint });
          if (low) { for (let q = 0; q < 3; q++) { toBus('T' + (1 + q), q); toBus('T' + (7 + q), q); } join('T4', 'T5'); join('T5', 'T6'); }
          else { for (let q = 0; q < 3; q++) { toBus('T' + (1 + q), q); join('T' + (4 + q), 'T' + (7 + q)); } }
        } else {
          const ox = 210, oy = 185, R = 125, cn = q => [ox + R * Math.cos(-Math.PI / 2 + q * TAU / 3), oy + R * Math.sin(-Math.PI / 2 + q * TAU / 3)];
          const lerp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
          for (let q = 0; q < 3; q++) {
            const a = cn(q), b = cn((q + 1) % 3);                                 // side q: first half from corner T(q+1) to T(q+4); second half from T(q+7) to the next corner
            coil(lerp(a, b, 0.06), lerp(a, b, 0.42), q); coil(lerp(a, b, 0.58), lerp(a, b, 0.94), q);
            P['T' + (1 + q)] = a; P['T' + (4 + q)] = lerp(a, b, 0.46); P['T' + (7 + q)] = lerp(a, b, 0.54);
            S_line(c, [lerp(a, b, 0.94), b], col, 3);                           // the second half is joined to the next corner inside
          }
          if (low) { const g = [['T1', 'T6', 'T7'], ['T2', 'T4', 'T8'], ['T3', 'T5', 'T9']]; g.forEach((grp, li) => grp.forEach(l => toBus(l, li))); }
          else { for (let q = 0; q < 3; q++) { toBus('T' + (1 + q), q); join('T' + (4 + q), 'T' + (7 + q)); } }
        }
        for (let n = 1; n <= 9; n++) tag(P['T' + n], 'T' + n);
        // the connection table
        const tx = 560, ty = 40, rows = wye ? [['low', 'T1,T7', 'T2,T8', 'T3,T9', 'T4–T5–T6'], ['high', 'T1', 'T2', 'T3', 'T4–T7 T5–T8 T6–T9']] : [['low', 'T1,T6,T7', 'T2,T4,T8', 'T3,T5,T9', '—'], ['high', 'T1', 'T2', 'T3', 'T4–T7 T5–T8 T6–T9']];
        text(c, (wye ? 'wye' : 'delta') + ' 9-lead: typical connections', tx + 110, ty, { color: C.muted, size: 11 });
        const hdr = ['', 'L1', 'L2', 'L3', 'join'], xs = [tx, tx + 38, tx + 88, tx + 138, tx + 186];
        hdr.forEach((h, i) => text(c, h, xs[i], ty + 22, { align: 'left', weight: 700, size: 11 }));
        rows.forEach((r, j) => {
          const y = ty + 44 + j * 22, act = r[0] === V.conn;
          if (act) { c.fillStyle = C.accent; c.globalAlpha = 0.18; c.fillRect(tx - 6, y - 14, 240, 20); c.globalAlpha = 1; }
          r.forEach((v, i) => text(c, v, xs[i], y, { align: 'left', size: i === 4 ? 9.5 : 11, color: act ? C.text : C.muted }));
        });
        text(c, 'the motor\'s own nameplate governs', tx + 110, ty + 100, { color: C.faint, size: 10 });
        text(c, (low ? 'parallel' : 'series') + ' halves on ' + Vs + ' V → ' + vc.toFixed(0) + ' V per half-coil', 560 + 110, 250, { color: col, weight: 700 });
        text(c, 'line current ' + IL.toFixed(1) + ' A', 560 + 110, 272, { color: C.muted });
        text(c, stalled ? 'STALLED' : ok ? 'OK' : k > 1 ? 'OVERVOLTAGE' : 'UNDERVOLTAGE', 560 + 110, 304, { weight: 700, size: 15, color: ok && !stalled ? C.ok : C.bad });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== the reversing starter */
  Hyper.sim('im-reversing', {
    title: 'A reversing starter: interlocks and plugging',
    blurb: `The power circuit (left) of a 7.5 kW motor with a motor-protective breaker Q1, a forward contactor K1, a reverse contactor K2 that exchanges L1 and L3, and an overload relay F2; and its control circuit (right), drawn as a ladder. **Click the pushbuttons on the ladder** (or use the buttons beside) — STOP, FWD, REV — and watch contacts close, coils energise, and the motor's speed and current in the graphs.

**Try this**
- *Stop before reversing*: start FWD, then press REV — nothing happens, because K1's normally-closed auxiliary contact blocks K2. Press STOP, then REV while the motor is still coasting: it plugs.
- *Direct reversal*: pressing REV while running forwards drops K1 and picks up K2 at once. The current jumps above the starting current and the rotor absorbs about four times the kinetic energy (see the read-out).
- *No interlocks*, mechanical interlock unticked: FWD then REV closes both contactors — a short circuit from L1 to L3, and Q1 trips. Press *Reset Q1*.
- With only the mechanical interlock: K2's coil is energised but cannot pull in — in a real AC coil that means a large current and a burnt coil.
- Raise the inertia: plugging takes longer and the rotor heat grows in proportion.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const M = kit.motor, im = M.induction(IM7), ws = im.ws, sn = ratedSlip(im, 7500), Tn = 7500 / ((1 - sn) * ws), In = im.at(sn).I1;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 260 });
      const [g1, g2] = graphs(box, 2);
      let w = 0, t = 0, K1 = false, K2 = false, Q1 = true, press = { S0: 0, S1: 0, S2: 0 }, heat = 0, lastD = 0, msg = 'press FWD or REV', blocked = false, hist = [], lastRec = -1, lastPlot = -1, ang = 0, coil1 = false, coil2 = false, peakI = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Control circuit', options: [['Stop before reversing (contactor interlocks)', 'stop'], ['Direct reversal (pushbutton + contactor interlocks)', 'direct'], ['No electrical interlocks (dangerous)', 'none']], value: 'stop' },
        { id: 'mech', type: 'check', label: 'Mechanical interlock between K1 and K2', value: true },
        { id: 'load', label: 'Conveyor load, % of rated torque', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'J', label: 'Total inertia at the motor shaft', min: 0.1, max: 3, value: 0.8, unit: 'kg·m²', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'S1', label: 'FWD', primary: true }, { id: 'S2', label: 'REV' }, { id: 'S0', label: 'STOP' }, { id: 'reset', label: 'Reset Q1' }] }
      ], id => {
        if (id === 'S0' || id === 'S1' || id === 'S2') press[id] = 0.35;
        if (id === 'reset') { Q1 = true; msg = 'Q1 reset'; }
      });
      const V = ctl.values;
      let fr = null;
      const BTN = { S0: [500, 62], S1: [580, 150], S2: [580, 240] };
      const hitBtn = p => { if (!fr) return null; const q = fr.to(p); for (const [k, b] of Object.entries(BTN)) if (Math.abs(q.x - b[0]) < 26 && Math.abs(q.y - b[1]) < 22) return k; return null; };
      kit.click(st, p => { const k = hitBtn(p); if (k) press[k] = 0.35; }, p => hitBtn(p) != null);
      const ro = kit.readout(box.side, [['k', 'Contactors'], ['n', 'Speed · slip'], ['I', 'Line current'], ['q', 'Rotor heat since the last change'], ['m', 'What happened']]);
      const pN = kit.plot(g1, { x: { label: 'time (s)', min: -12, max: 0 }, y: { label: 'speed (rpm)', min: -1600, max: 1600 } }, 180);
      const pC = kit.plot(g2, { x: { label: 'time (s)', min: -12, max: 0 }, y: { label: 'line current (A)', min: 0 } }, 180);
      const logic = () => {
        const pwr = Q1, S0 = press.S0 > 0, S1 = press.S1 > 0, S2 = press.S2 > 0, elec = V.mode !== 'none', pb = V.mode === 'direct';
        for (let pass = 0; pass < 3; pass++) {
          coil1 = pwr && !S0 && (S1 || K1) && (!pb || !S2) && (!elec || !K2);
          coil2 = pwr && !S0 && (S2 || K2) && (!pb || !S1) && (!elec || !K1);
          // contactors open first, then close (a closing one is held off by the mechanical interlock while the other is closed)
          if (!coil1) K1 = false; if (!coil2) K2 = false;
          blocked = false;
          if (coil1 && !K1) { if (V.mech && K2) blocked = true; else K1 = true; }
          if (coil2 && !K2) { if (V.mech && K1) blocked = true; else K2 = true; }
        }
        if (K1 && K2) { Q1 = false; K1 = K2 = false; coil1 = coil2 = false; msg = 'SHORT CIRCUIT L1–L3 through K1 and K2 — Q1 tripped'; }
      };
      const loop = kit.loop(dt => {
        t += dt;
        for (const k in press) press[k] = Math.max(0, press[k] - dt);
        logic();
        const C = kit.colors(), d = K1 ? 1 : K2 ? -1 : 0;
        if (d !== lastD) { if (d !== 0) { const plug = w * d < -0.2 * ws; msg = plug ? 'plugging: the field now turns against the rotor' : d > 0 ? 'running forward' : 'running in reverse'; } else if (Q1 && msg.indexOf('SHORT') < 0) msg = 'contactor open: the motor coasts'; heat = 0; peakI = 0; lastD = d; }
        if (blocked) msg = 'a coil is energised but held off by the mechanical interlock';
        const TLmag = V.load / 100 * Tn + 0.8;
        const sub = 40, h = dt / sub;
        let I = 0, s = 0;
        for (let k = 0; k < sub; k++) {
          let Tm = 0;
          if (d !== 0) { s = clamp(1 - w / (d * ws), 1e-5, 2); const r = im.at(s); Tm = d * r.T; I = r.I1; heat += s * r.T * ws * h; }
          else { I = 0; s = 0; }
          let net;
          if (Math.abs(w) < 0.5 && Math.abs(Tm) <= TLmag) { net = 0; w = 0; }
          else net = Tm - TLmag * Math.sign(w || Tm);
          w += h * net / V.J;
        }
        peakI = Math.max(peakI, I);
        const n = rpmOf(w), KE = 0.5 * V.J * ws * ws;
        ro.set('k', 'K1 ' + (K1 ? 'closed' : 'open') + ' · K2 ' + (K2 ? 'closed' : 'open') + ' · Q1 ' + (Q1 ? 'on' : 'TRIPPED'));
        ro.set('n', n.toFixed(0) + ' rpm' + (d ? ' · slip ' + (100 * s).toFixed(0) + ' %' : ''));
        ro.set('I', I.toFixed(1) + ' A (peak ' + peakI.toFixed(0) + ' A = ' + (peakI / In).toFixed(1) + ' × rated)');
        ro.set('q', (heat / 1000).toFixed(1) + ' kJ = ' + (heat / KE).toFixed(2) + ' × ½Jω_s²');
        ro.set('m', msg);
        if (t - lastRec > 0.05) { lastRec = t; hist.push([t, n, I]); while (hist.length && hist[0][0] < t - 12) hist.shift(); }
        if (t - lastPlot > 0.15 || lastPlot < 0) {
          lastPlot = t;
          pN.set({ series: [{ pts: hist.map(p => [p[0] - t, p[1]]), label: 'speed' }], hlines: [{ y: 0 }] });
          pC.set({ series: [{ pts: hist.map(p => [p[0] - t, p[2]]), label: 'current', color: C.warn }], hlines: [{ y: In, label: 'rated' }] });
        }
        // ---------------------------------------------------------------- drawing
        const c = begin(st, 820, 340); fr = frame(st, 820, 340);
        const live = (on, q) => on ? phc(q) : C.faint;
        const X = [60, 100, 140], XR = [200, 240, 280];
        text(c, 'power circuit', 170, 14, { color: C.muted, size: 11 });
        ['L1', 'L2', 'L3'].forEach((l, q) => { text(c, l, X[q], 30, { weight: 700, color: phc(q) }); });
        const contact = (x, y1, y2, closed, col) => { S_line(c, [[x, y1], [x, y1 + 6]], col, 2); S_line(c, [[x, y2 - 6], [x, y2]], col, 2); S_line(c, [[x, y2 - 6], closed ? [x, y1 + 6] : [x - 10, y1 + 8]], col, 2.5); };
        for (let q = 0; q < 3; q++) { S_line(c, [[X[q], 36], [X[q], 48]], phc(q), 2); contact(X[q], 48, 76, Q1, live(Q1, q)); }
        text(c, 'Q1', 20, 66, { align: 'left', weight: 700, color: Q1 ? C.text : C.bad });
        // K1 straight, K2 with L1 and L3 exchanged
        for (let q = 0; q < 3; q++) {
          S_line(c, [[X[q], 76], [X[q], 110]], live(Q1, q), 2); contact(X[q], 110, 140, K1, live(Q1 && K1, q));
          const src = 2 - q;                                                   // K2 input q is fed from line 2 − q
          S_line(c, [[X[src], 90 + q * 3], [XR[q], 90 + q * 3], [XR[q], 110]], live(Q1, src), 1.5); c.fillStyle = C.text; c.beginPath(); c.arc(X[src], 90 + q * 3, 2.5, 0, TAU); c.fill();
          contact(XR[q], 110, 140, K2, live(Q1 && K2, src));
          S_line(c, [[XR[q], 140], [XR[q], 158 + q * 4], [X[q], 158 + q * 4]], live(Q1 && K2, src), 1.5); c.fillStyle = C.text; c.beginPath(); c.arc(X[q], 158 + q * 4, 2.5, 0, TAU); c.fill();
          S_line(c, [[X[q], 140], [X[q], 190]], live(d !== 0, K2 ? src : q), 2);
          c.strokeStyle = live(d !== 0, K2 ? src : q); c.lineWidth = 1.5; c.strokeRect(X[q] - 6, 190, 12, 16); S_line(c, [[X[q], 206], [X[q], 232]], live(d !== 0, K2 ? src : q), 2);
        }
        text(c, 'K1 fwd', 20, 128, { align: 'left', weight: 700, color: K1 ? C.ok : C.muted }); text(c, 'K2 rev', 300, 128, { align: 'left', weight: 700, color: K2 ? C.ok : C.muted });
        text(c, 'F2', 20, 202, { align: 'left', weight: 700 });
        text(c, 'K2 swaps L1 and L3', 240, 175, { color: C.faint, size: 10 });
        // the motor
        ang += w * dt / 25;
        const mx = 100, my = 272;
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(mx, my, 38, 0, TAU); c.fill(); c.stroke();
        text(c, 'M', mx, my - 2, { weight: 700, size: 16 }); text(c, '3~', mx, my + 16, { size: 12 });
        for (let q = 0; q < 3; q++) S_line(c, [[X[q], 232], [mx + (q - 1) * 14, my - 36]], live(d !== 0, q), 1.5);
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(mx + 46 * Math.cos(ang), my + 46 * Math.sin(ang)); c.lineTo(mx + 56 * Math.cos(ang), my + 56 * Math.sin(ang)); c.stroke();
        text(c, Math.abs(n) < 5 ? 'standstill' : n > 0 ? 'forward' : 'reverse', mx + 90, my + 4, { align: 'left', color: C.muted });
        if (!Q1) text(c, 'Q1 TRIPPED', 200, 250, { weight: 700, color: C.bad, size: 14 });
        // the control ladder
        const Lx = 400, Rx = 790, y0 = 62, yF = 150, yR = 240, cp = Q1;
        const cc = on => on ? C.ok : C.faint;
        text(c, 'control circuit (fed after Q1)', 600, 14, { color: C.muted, size: 11 });
        S_line(c, [[Lx, 30], [Lx, 300]], cp ? C.text : C.faint, 2); S_line(c, [[Rx, 30], [Rx, 300]], cp ? C.text : C.faint, 2);
        const ncC = (x, y, closed, col, lab) => { S_line(c, [[x - 16, y], [x - 8, y]], col, 2); S_line(c, [[x + 8, y], [x + 16, y]], col, 2); S_line(c, [[x - 8, y], closed ? [x + 8, y] : [x + 6, y - 9]], col, 2.5); S_line(c, [[x + 8, y], [x + 8, y + 6]], col, 1.5); if (lab) text(c, lab, x, y + 22, { size: 10, color: C.muted }); };
        const noC = (x, y, closed, col, lab) => { S_line(c, [[x - 16, y], [x - 8, y]], col, 2); S_line(c, [[x + 8, y], [x + 16, y]], col, 2); S_line(c, [[x - 8, y], closed ? [x + 8, y] : [x + 6, y - 9]], col, 2.5); if (lab) text(c, lab, x, y + 22, { size: 10, color: C.muted }); };
        const pbtn = (k, x, y, isNO, lab) => { const on = press[k] > 0; c.fillStyle = on ? C.accent : C.surface2 || C.bg2; c.strokeStyle = k === 'S0' ? C.bad : C.accent; c.lineWidth = 2; c.beginPath(); c.arc(x, y - 22, 11, 0, TAU); c.fill(); c.stroke(); text(c, lab, x, y - 38, { size: 10, weight: 700, color: k === 'S0' ? C.bad : C.accent }); S_line(c, [[x, y - 11], [x, y - 5]], C.muted, 1.5); return isNO ? on : !on; };
        // top rung: F2 (NC) and STOP (NC)
        const stopClosed = pbtn('S0', 500, y0, false, 'STOP');
        S_line(c, [[Lx, y0], [424, y0]], cp ? C.ok : C.faint, 2); ncC(440, y0, true, cp ? C.ok : C.faint, 'F2'); S_line(c, [[456, y0], [484, y0]], cp ? C.ok : C.faint, 2);
        ncC(500, y0, stopClosed, cp ? C.ok : C.faint, 'S0'); const top = cp && stopClosed;
        S_line(c, [[516, y0], [540, y0], [540, yR]], cc(top), 2);
        const rung = (y, key, lab, selfK, otherK, otherBtn, coilOn, coilName, blockedHere) => {
          const bOn = pbtn(key, 580, y, true, lab);
          S_line(c, [[540, y], [564, y]], cc(top), 2); noC(580, y, bOn, cc(top), key);
          S_line(c, [[540, y], [540, y + 30], [564, y + 30]], cc(top), 1.5); noC(580, y + 30, selfK, cc(top && selfK), coilName + ' (seal-in)'); S_line(c, [[596, y + 30], [612, y + 30], [612, y]], cc(top && selfK), 1.5);
          let live2 = top && (bOn || selfK), x = 612;
          S_line(c, [[596, y], [612, y]], cc(top && bOn), 2);
          if (V.mode === 'direct') { const nc = !(press[otherBtn] > 0); S_line(c, [[x, y], [634, y]], cc(live2), 2); ncC(650, y, nc, cc(live2), otherBtn + ' (NC)'); live2 = live2 && nc; x = 666; }
          if (V.mode !== 'none') { const nc = !otherK; S_line(c, [[x, y], [694, y]], cc(live2), 2); ncC(710, y, nc, cc(live2), (coilName === 'K1' ? 'K2' : 'K1') + ' (NC)'); live2 = live2 && nc; x = 726; }
          S_line(c, [[x, y], [744, y]], cc(live2), 2);
          c.fillStyle = coilOn ? C.ok : C.surface2 || C.bg2; c.strokeStyle = blockedHere ? C.bad : C.text; c.lineWidth = 2; c.fillRect(744, y - 10, 26, 20); c.strokeRect(744, y - 10, 26, 20);
          text(c, coilName, 757, y + 4, { size: 10, weight: 700, color: coilOn ? C.bg : C.text });
          S_line(c, [[770, y], [Rx, y]], cc(coilOn), 2);
        };
        rung(yF, 'S1', 'FWD', K1, K2, 'S2', coil1, 'K1', blocked && coil1 && !K1);
        rung(yR, 'S2', 'REV', K2, K1, 'S1', coil2, 'K2', blocked && coil2 && !K2);
        if (V.mech) text(c, 'K1 ⟷ K2 mechanically interlocked', 600, 322, { size: 10, color: C.muted });
        text(c, V.mode === 'stop' ? 'stop before reversing' : V.mode === 'direct' ? 'direct reversal allowed' : 'no electrical interlocks', 600, 336, { size: 10, color: V.mode === 'none' ? C.bad : C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  function S_line(c, pts, col, wd) { c.strokeStyle = col; c.lineWidth = wd || 2; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }

})();
