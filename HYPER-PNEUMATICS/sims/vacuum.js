/* HYPER-PNEUMATICS · sims/vacuum.js — simulations for the Vacuum Technology branch (prefix vac-).
 *   vac-scales          one vacuum in every scale, the ranges from rough to ultra-high vacuum, molecules, altitude
 *   vac-cup-force       cups, vacuum and load cases: the force, the safety factor and the heaviest part
 *   vac-ejector-curves  an ejector at work: suction flow against vacuum (single and multi-stage), and the optimum supply pressure
 *   vac-ejector-leak    a porous or holed part on an ejector: the operating vacuum where the two curves cross
 *   vac-evacuation      evacuating cups and hoses with an ejector or a pump: vacuum against time, and the rough estimate
 *   vac-air-saving      an air-saving ejector holding a part, beside one that runs through the whole hold
 *   vac-pick-place      a vacuum gripper on a gantry: grip, move, release with blow-off; slipping and loss of vacuum
 *
 * The ejector here is a typical, illustrative one — not any maker's data: the nozzle's air follows ISO 6358
 * choked flow (kit.fluid.iso6358), the vacuum it can reach peaks at a supply of about 4.8 bar, and its suction
 * flow falls with vacuum (a straight line for one stage; extra stages add flow at low vacuum until their flaps close).
 * Leaks through holes and gaps use ISO 6358 as well (b = 0.5); porous material leaks in laminar flow (∝ p_atm² − p²).
 */
(function () {
  'use strict';
  const PATM = 101325, PN = 1e5, G0 = 9.80665, KB = 1.380649e-23, TAIR = 293.15;
  const NOZZLES = [0.5, 0.7, 1.0, 1.5, 2.0];
  const CUPS = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 125, 150];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // sonic conductance (m³/(s·Pa)) of a nozzle or hole of diameter dmm (mm): the choked mass flux of air,
  // 0.0404·p/√T per unit area, turned into free air (ISO 8778: 1.185 kg/m³ at 293.15 K)
  const condOf = (dmm, Cd) => 0.0404 * Cd * Math.PI * Math.pow(dmm / 1000, 2) / 4 / (1.185 * Math.sqrt(TAIR));

  // a typical ejector: d nozzle (mm), pg supply (bar gauge), multi-stage or not; flows in m³/s of free air,
  // vacuum v as a fraction of the atmosphere
  function ejectorModel(F, d, pg, multi) {
    pg = Math.max(0, pg);
    const air = F.iso6358({ C: condOf(d, 0.9), b: 0.5, p1: pg * 1e5 + PATM, p2: PATM }).qANR;
    const popt = 4.8, x = pg / popt;
    const vmax = pg <= 0 ? 0 : pg < popt ? 0.88 * Math.max(0, 1 - 0.9 * (1 - x) * (1 - x)) : 0.88 * Math.max(0.5, 1 - 0.035 * (pg - popt));
    const q0 = 0.45 * air * (pg <= popt ? 1 : (popt + 1.013) / (pg + 1.013));
    const suction = v => {
      if (!(vmax > 0) || v >= vmax) return 0;
      let q = q0 * (1 - v / vmax);
      if (multi) q += 0.9 * q0 * Math.pow(Math.max(0, 1 - v / (0.5 * vmax)), 1.5) + 1.1 * q0 * Math.pow(Math.max(0, 1 - v / (0.25 * vmax)), 1.5);
      return q;
    };
    return { air, vmax, q0, suction, multi: !!multi, open: suction(0) };
  }
  // leaks, in free air (m³/s), at a vacuum v (fraction of the atmosphere)
  const holeLeak = (F, v, C) => C > 0 ? F.iso6358({ C, b: 0.5, p1: PATM, p2: PATM * (1 - clamp(v, 0, 1)) }).qANR : 0;
  const porousLeak = (v, k50) => k50 * (1 - (1 - v) * (1 - v)) / 0.75;          // k50: its leak at 50 % vacuum
  // where the suction curve meets the leak curve (bisection on the vacuum)
  function operating(ej, leak) {
    if (!(ej.vmax > 0)) return 0;
    let lo = 0, hi = ej.vmax;
    for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (ej.suction(m) > leak(m)) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  const lpm = q => q * 60000;                                                     // m³/s -> L/min
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function sci(v, sig) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 0.01 && a < 1e5) return String(+v.toPrecision(sig || 3));
    let e = Math.floor(Math.log10(a)), m = +(v / Math.pow(10, e)).toPrecision(sig || 3);
    if (Math.abs(m) >= 10) { m /= 10; e += 1; }
    return m + '×10' + String(e).split('').map(ch => SUP[ch]).join('');
  }
  function lenFmt(m) {
    if (!Number.isFinite(m)) return '—';
    if (m < 1e-6) return (m * 1e9).toPrecision(3) + ' nm';
    if (m < 1e-3) return (m * 1e6).toPrecision(3) + ' µm';
    if (m < 1) return (m * 1e3).toPrecision(3) + ' mm';
    if (m < 1000) return m.toPrecision(3) + ' m';
    return (m / 1000).toPrecision(3) + ' km';
  }
  // a design grid of W × H drawn centred and scaled on the stage
  function grid(st, c, W, H) {
    const k = Math.min(st.W / W, st.H / H);
    c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k);
    return k;
  }
  // a pressure switch in the manner of ISO 1219: a square with an electrical contact
  function vacSwitch(c, S, C, x, y, on) {
    c.strokeStyle = C.text; c.lineWidth = 1.6; c.setLineDash([]);
    c.strokeRect(x - 12, y - 12, 24, 24);
    c.beginPath(); c.moveTo(x - 6, y + 6); c.lineTo(x - 6, y - 2); c.stroke();
    c.beginPath(); c.moveTo(x - 6, y - 2); c.lineTo(on ? x + 6 : x + 5, on ? y - 2 : y - 8); c.stroke();
    c.beginPath(); c.moveTo(x + 6, y - 2); c.lineTo(x + 6, y + 6); c.stroke();
    c.beginPath(); c.moveTo(x, y + 12); c.lineTo(x, y + 22); c.stroke();
    return { P: [x, y + 22] };
  }
  // a cup drawn to scale: lip width w, pointing down (dir 1) or right (dir 2)
  function cupShape(c, x, y, w, h, color, dir) {
    c.strokeStyle = color; c.lineWidth = 1.8; c.setLineDash([]);
    c.beginPath();
    if (dir === 2) { c.moveTo(x, y - w * 0.18); c.lineTo(x + h, y - w / 2); c.lineTo(x + h, y + w / 2); c.lineTo(x, y + w * 0.18); }
    else { c.moveTo(x - w * 0.18, y); c.lineTo(x - w / 2, y + h); c.lineTo(x + w / 2, y + h); c.lineTo(x + w * 0.18, y); }
    c.closePath(); c.stroke();
  }

  /* ================================================================ vac-scales */
  Hyper.sim('vac-scales', {
    title: 'One vacuum, every scale',
    blurb: `The same state of the air read on every scale in use: absolute (mbar, kPa, Torr), gauge (−kPa, −bar), per cent vacuum and inches of mercury of vacuum. On the left the whole range of vacuum on a logarithmic scale, from the atmosphere down to ultra-high vacuum; in the middle a handling vacuum gauge; on the right the molecules inside against the atmosphere outside, and how far a molecule flies between collisions.

**Try this**
- Press **−60 kPa**: that is about 400 mbar absolute, 60 % vacuum and 18 inHg — the everyday vacuum of a gripper.
- Slide the absolute pressure down through the decades: the handling gauge is at its end stop long before the interesting physics starts. Everything below about 1 mbar is invisible to it.
- Watch the mean free path: tens of nanometres at the atmosphere, millimetres around 0.1 mbar, kilometres in ultra-high vacuum — which is why deep-vacuum pumps work so differently.
- Raise the site to 2000 m with the pressure at 400 mbar abs: the gauge reading and the per cent vacuum fall, and so does the net push on every square centimetre.
- Press **85 %** at sea level and at 3000 m: an ejector's typical maximum is a share of the local atmosphere.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Absolute pressure', min: 1e-9, max: 1013, value: 400, unit: 'mbar', log: true, sig: 3 },
        { type: 'buttons', items: [{ id: 'b60', label: '−60 kPa' }, { id: 'b85', label: '85 %' }, { id: 'b1', label: '1 mbar' }, { id: 'b6', label: '10⁻⁶ mbar' }] },
        { id: 'alt', label: 'Altitude of the site', min: 0, max: 5000, step: 50, value: 0, unit: 'm' },
        { id: 'wx', label: 'Weather: sea-level pressure', min: 960, max: 1050, step: 1, value: 1013, unit: 'mbar' }
      ], (id) => {
        const pa = atm();
        if (id === 'b60') ctl.set('p', Math.max(1e-9, (pa - 60000) / 100));
        if (id === 'b85') ctl.set('p', 0.15 * pa / 100);
        if (id === 'b1') ctl.set('p', 1);
        if (id === 'b6') ctl.set('p', 1e-6);
      });
      const ro = kit.readout(box.side, [['atm', 'Local atmosphere'], ['abs', 'Absolute'], ['g', 'Gauge'], ['pc', 'Per cent vacuum'], ['inhg', 'Inches of mercury of vacuum'], ['rng', 'Range'], ['n', 'Molecules per cm³'], ['mfp', 'Mean free path'], ['push', 'Net push of the atmosphere']]);
      const V = ctl.values;
      const atm = () => V.wx * 100 * F.isa(V.alt).p / 101325;
      // molecules in two boxes: outside (the atmosphere) and inside (the vessel)
      const NMAX = 240, out = [], ins = [];
      for (let i = 0; i < NMAX; i++) { out.push([Math.random(), Math.random()]); ins.push([Math.random(), Math.random()]); }
      const jig = (arr, n, s) => { for (let i = 0; i < n; i++) { const q = arr[i]; q[0] = (q[0] + (Math.random() - 0.5) * s + 1) % 1; q[1] = (q[1] + (Math.random() - 0.5) * s + 1) % 1; } };
      const loop = kit.loop((dt) => {
        const C = kit.colors(), S = kit.fsym;
        const pa = atm(), p = Math.min(V.p * 100, pa);                   // Pa
        const dp = pa - p, v = dp / pa;
        const lam = KB * TAIR / (Math.SQRT2 * Math.PI * 3.7e-10 * 3.7e-10 * Math.max(p, 1e-12));
        const rng = p >= 100 ? 'rough (low) vacuum' : p >= 0.1 ? 'medium (fine) vacuum' : p >= 1e-5 ? 'high vacuum' : 'ultra-high vacuum';
        const kn = lam / 0.01, regime = kn < 0.01 ? 'flows as a gas' : kn < 0.5 ? 'in transition' : 'molecules fly wall to wall';
        ro.set('atm', (pa / 100).toFixed(0) + ' mbar abs');
        ro.set('abs', sci(p / 100) + ' mbar = ' + sci(p / 1000) + ' kPa = ' + sci(p / 133.322) + ' Torr');
        ro.set('g', (dp > 0 ? '−' : '') + (dp / 1000).toFixed(1) + ' kPa = ' + (dp > 0 ? '−' : '') + (dp / 1e5).toFixed(3) + ' bar');
        ro.set('pc', (v * 100).toFixed(v > 0.999 ? 4 : 1) + ' %');
        ro.set('inhg', (dp / 3386.389).toFixed(2) + ' inHg');
        ro.set('rng', rng);
        ro.set('n', sci(p / (KB * TAIR) / 1e6));
        ro.set('mfp', lenFmt(lam) + ' (' + regime + ' in a 10 mm tube)');
        ro.set('push', (dp / 1e4).toFixed(2) + ' N/cm²');
        const c = st.begin();
        grid(st, c, 760, 380);
        // ---- the logarithmic range bar
        const top = 46, bot = 330, L0 = Math.log10(1013), L1 = -9;
        const yOf = pm => top + (L0 - Math.log10(Math.max(pm, 1e-9))) / (L0 - L1) * (bot - top);
        const bands = [[1013, 1, kit.hue(200, 0.35), 'rough'], [1, 1e-3, kit.hue(160, 0.3), 'medium'], [1e-3, 1e-7, kit.hue(280, 0.3), 'high'], [1e-7, 1e-9, kit.hue(330, 0.3), 'ultra-high']];
        for (const b of bands) {
          c.fillStyle = b[2]; c.fillRect(70, yOf(b[0]), 30, yOf(b[1]) - yOf(b[0]));
          kit.label(c, b[3], 108, (yOf(b[0]) + yOf(b[1])) / 2, { size: 11.5, color: C.text, weight: 600 });
        }
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(70, top, 30, bot - top);
        for (let e = 3; e >= -9; e -= 3) {
          const y = yOf(Math.pow(10, e));
          c.beginPath(); c.moveTo(64, y); c.lineTo(70, y); c.stroke();
          kit.label(c, e === 0 ? '1' : '10' + String(e).split('').map(ch => SUP[ch]).join(''), 60, y, { size: 11, color: C.muted, align: 'right' });
        }
        kit.label(c, 'mbar abs', 60, top - 16, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'atmosphere', 108, top - 14, { size: 11, color: C.muted });
        const yp = yOf(p / 100);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(104, yp); c.lineTo(116, yp - 6); c.lineTo(116, yp + 6); c.closePath(); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); c.moveTo(66, yp); c.lineTo(104, yp); c.stroke();
        kit.label(c, sci(p / 100) + ' mbar', 120, yp - 14, { size: 12, color: C.accent, weight: 700 });
        // ---- the handling gauge: 0 to −100 kPa over 270°
        const gx = 330, gy = 175, R = 88, a0 = 0.75 * Math.PI, sweep = 1.5 * Math.PI;
        c.fillStyle = C.surface; c.beginPath(); c.arc(gx, gy, R + 10, 0, Math.PI * 2); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(gx, gy, R + 10, 0, Math.PI * 2); c.stroke();
        const ang = f => a0 + sweep * f;
        c.lineWidth = 10; c.strokeStyle = kit.hue(140, 0.45); c.beginPath(); c.arc(gx, gy, R - 6, ang(0.6), ang(0.8)); c.stroke();
        c.strokeStyle = kit.hue(30, 0.45); c.beginPath(); c.arc(gx, gy, R - 6, ang(0.85), ang(0.9)); c.stroke();
        c.lineWidth = 1.5; c.strokeStyle = C.text;
        for (let k = 0; k <= 10; k++) {
          const t = ang(k / 10), r1 = R - (k % 2 ? 6 : 12);
          c.beginPath(); c.moveTo(gx + R * Math.cos(t), gy + R * Math.sin(t)); c.lineTo(gx + r1 * Math.cos(t), gy + r1 * Math.sin(t)); c.stroke();
          if (!(k % 2)) kit.label(c, k ? '−' + k * 10 : '0', gx + (R - 26) * Math.cos(t), gy + (R - 26) * Math.sin(t), { size: 11, color: C.muted, align: 'center' });
        }
        const fn = clamp(dp / 1e5, 0, 1), tn = ang(fn);
        c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + (R - 14) * Math.cos(tn), gy + (R - 14) * Math.sin(tn)); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.arc(gx, gy, 5, 0, Math.PI * 2); c.fill();
        kit.label(c, 'kPa (gauge)', gx, gy + 30, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, (dp > 0 ? '−' : '') + (dp / 1000).toFixed(1) + ' kPa', gx, gy + 52, { size: 15, color: C.text, weight: 700, align: 'center' });
        kit.label(c, 'green: typical handling · orange: an ejector\'s limit', gx, gy + R + 26, { size: 10.5, color: C.muted, align: 'center' });
        // per cent vacuum bar
        c.fillStyle = C.surface; c.fillRect(240, 330, 180, 12);
        c.fillStyle = C.accent; c.fillRect(240, 330, 180 * clamp(v, 0, 1), 12);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(240, 330, 180, 12);
        kit.label(c, (v * 100).toFixed(1) + ' % vacuum', 330, 356, { size: 12, color: C.text, align: 'center', weight: 600 });
        // ---- molecules: outside and inside
        const bw = 118, by = 60, bx1 = 478, bx2 = 622;
        const nOut = NMAX, nIn = Math.round(NMAX * p / pa), frac = p / pa;
        jig(out, nOut, 0.03); jig(ins, Math.max(1, nIn), 0.03 + 0.2 * (1 - frac));
        const drawBox = (bx, arr, n, title, sub) => {
          c.fillStyle = C.surface; c.fillRect(bx, by, bw, bw);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(bx, by, bw, bw);
          c.fillStyle = C.series[0];
          for (let i = 0; i < n; i++) { c.beginPath(); c.arc(bx + 3 + arr[i][0] * (bw - 6), by + 3 + arr[i][1] * (bw - 6), 2, 0, Math.PI * 2); c.fill(); }
          kit.label(c, title, bx + bw / 2, by - 14, { size: 12, color: C.text, weight: 700, align: 'center' });
          kit.label(c, sub, bx + bw / 2, by + bw + 14, { size: 11, color: C.muted, align: 'center' });
        };
        drawBox(bx1, out, nOut, 'atmosphere', (pa / 100).toFixed(0) + ' mbar');
        drawBox(bx2, ins, nIn, 'in the vessel', nIn ? nIn + ' of ' + NMAX + ' dots' : 'none left in view');
        // the net push on the wall between them
        const push = dp / 1e4;
        if (push > 0.05) kit.arrow(c, bx1 + bw + 2, by + bw / 2, bx1 + bw + 2 + Math.min(24, 3 + 2.2 * push), by + bw / 2, C.bad, 3);
        kit.label(c, 'net push ' + push.toFixed(2) + ' N/cm²', (bx1 + bx2 + bw) / 2, by + bw + 40, { size: 12, color: C.text, align: 'center', weight: 600 });
        kit.label(c, 'mean free path ' + lenFmt(lam), (bx1 + bx2 + bw) / 2, by + bw + 62, { size: 12, color: C.text, align: 'center' });
        kit.label(c, sci(p / (KB * TAIR) / 1e6) + ' molecules per cm³', (bx1 + bx2 + bw) / 2, by + bw + 84, { size: 12, color: C.muted, align: 'center' });
        kit.label(c, 'the atmosphere is the ceiling: at most ' + (pa / 1e4).toFixed(1) + ' N/cm² here', (bx1 + bx2 + bw) / 2, by + bw + 110, { size: 11, color: C.muted, align: 'center' });
        c.restore();
        void S; void dt;
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ vac-cup-force */
  Hyper.sim('vac-cup-force', {
    title: 'Cups, vacuum and the heaviest part',
    blurb: `Choose the cups, the vacuum and how the part is carried, and compare the force the cups give — $n\\,\\Delta p\\,A$ — with the force the load case needs: case I lifts a horizontal part straight up, case II moves it sideways (friction carries the inertia force), case III holds a part by a vertical face (friction carries everything). The safety factor is the ratio of the two.

**Try this**
- Start with case I: four 40 mm cups at −60 kPa hold a 5 kg sheet with a safety factor of about 4. Switch to case III: the same cups now manage barely 2 — friction carries the weight.
- Raise the vacuum from −60 to −90 kPa: the force grows by half. Now look at the ceiling bar — no vacuum can beat it. Bigger cups beat it easily.
- In case II, lower μ to 0.15 (oily sheet): the sideways acceleration suddenly dominates.
- Find the heaviest part the gripper may carry at the recommended safety factor (2 for case I, 4 where friction carries the load), then add acceleration: every m/s² costs about a tenth of it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'dp', label: 'Vacuum (below atmosphere)', min: 10, max: 90, step: 1, value: 60, unit: 'kPa' },
        { id: 'd', type: 'select', label: 'Cup diameter (effective)', options: CUPS.map(d => [d + ' mm', d]), value: 40 },
        { id: 'n', label: 'Number of cups', min: 1, max: 12, step: 1, value: 4 },
        { id: 'lc', type: 'select', label: 'Load case', options: [['I — horizontal part, lifted vertically', 1], ['II — horizontal part, moved sideways', 2], ['III — vertical face, held by friction', 3]], value: 1 },
        { id: 'm', label: 'Mass of the part', min: 0.1, max: 200, value: 5, unit: 'kg', log: true, sig: 3 },
        { id: 'a', label: 'Largest acceleration', min: 0, max: 30, step: 0.5, value: 5, unit: 'm/s²' },
        { id: 'mu', label: 'Friction coefficient μ', min: 0.1, max: 0.8, step: 0.05, value: 0.5 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['cup', 'Force per cup (theoretical)'], ['all', 'All cups'], ['need', 'Needed just to hold (S = 1)'], ['S', 'Safety factor you have'], ['rec', 'Recommended at least'], ['mmax', 'Heaviest part at that safety factor'], ['ceil', 'Ceiling at a perfect vacuum']]);
      const V = ctl.values;
      const loop = kit.loop(() => {
        const C = kit.colors();
        const A = Math.PI * Math.pow(V.d / 1000, 2) / 4, Fc = V.dp * 1000 * A, Ft = V.n * Fc, ceil = V.n * PATM * A;
        const mu = Math.max(0.05, V.mu), g = G0;
        const k = V.lc === 1 ? g + V.a : V.lc === 2 ? g + V.a / mu : (g + V.a) / mu;       // force per kg needed
        const need = V.m * k, Srec = V.lc === 1 ? 2 : 4, Sact = need > 0 ? Ft / need : Infinity, mmax = Ft / (Srec * k);
        const status = Sact < 1 ? 'bad' : Sact < Srec ? 'warn' : 'ok';
        ro.set('cup', Fc.toFixed(1) + ' N');
        ro.set('all', Ft.toFixed(0) + ' N');
        ro.set('need', need.toFixed(0) + ' N');
        ro.set('S', Number.isFinite(Sact) ? Sact.toFixed(2) + (status === 'bad' ? ' — it would slip or drop' : status === 'warn' ? ' — too small' : ' — fine') : '—');
        ro.set('rec', Srec + (V.lc === 1 ? ' (horizontal lift)' : ' (friction carries the load)'));
        ro.set('mmax', mmax.toFixed(mmax < 10 ? 2 : 1) + ' kg');
        ro.set('ceil', ceil.toFixed(0) + ' N (' + (ceil / Ft).toFixed(2) + ' × what you have)');
        const c = st.begin();
        grid(st, c, 760, 380);
        const col = status === 'ok' ? C.ok : status === 'warn' ? C.warn : C.bad;
        // ---- the scene
        const n = V.n, wc = clamp(8 + V.d * 0.28, 10, 46), span = 300, sp = Math.min(wc + 8, span / n);
        const fmax = Math.max(Ft, need * Srec, 1), arrowL = f => 18 + 90 * f / fmax;
        if (V.lc !== 3) {
          const px0 = 60, px1 = 380, plateY = 96, cupY = 108, partY = cupY + 14;
          c.fillStyle = C.surface; c.fillRect(px0 + 30, plateY - 10, px1 - px0 - 60, 12);
          c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(px0 + 30, plateY - 10, px1 - px0 - 60, 12);
          c.beginPath(); c.moveTo(220, plateY - 10); c.lineTo(220, 40); c.stroke();
          const xm = 220 - sp * (n - 1) / 2;
          for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(xm + i * sp, plateY + 2); c.lineTo(xm + i * sp, cupY); c.stroke(); cupShape(c, xm + i * sp, cupY, wc, 14, C.text, 1); }
          c.fillStyle = C.dark ? 'rgba(160,170,200,.35)' : 'rgba(90,100,130,.3)'; c.fillRect(px0, partY, px1 - px0, 18);
          c.strokeStyle = C.text; c.strokeRect(px0, partY, px1 - px0, 18);
          kit.label(c, V.m.toPrecision(3) + ' kg', px1 - 6, partY + 30, { size: 12, color: C.muted, align: 'right' });
          // the atmosphere pushes the part up into the cups
          for (let i = 0; i < n; i++) kit.arrow(c, xm + i * sp, partY + 58, xm + i * sp, partY + 22, C.accent, 2);
          kit.label(c, 'the atmosphere pushes: ' + Ft.toFixed(0) + ' N', 220, partY + 72, { size: 12, color: C.accent, align: 'center', weight: 600 });
          // weight and inertia
          kit.arrow(c, 90, partY + 9, 90, partY + 9 + arrowL(V.m * g), C.text, 2.5);
          kit.label(c, 'mg ' + (V.m * g).toFixed(0) + ' N', 98, partY + 9 + arrowL(V.m * g) - 6, { size: 11.5, color: C.text });
          if (V.lc === 1 && V.a > 0) {
            kit.arrow(c, 400, 200, 400, 150, C.warn, 2.5); kit.label(c, 'a = ' + V.a + ' m/s²', 408, 172, { size: 11.5, color: C.warn });
            kit.arrow(c, 150, partY + 9, 150, partY + 9 + arrowL(V.m * V.a), C.warn, 2.5); kit.label(c, 'ma', 158, partY + 9 + arrowL(V.m * V.a) - 6, { size: 11.5, color: C.warn });
          }
          if (V.lc === 2) {
            kit.arrow(c, 250, 42, 330, 42, C.warn, 2.5); kit.label(c, 'a = ' + V.a + ' m/s² sideways', 336, 42, { size: 11.5, color: C.warn });
            kit.arrow(c, px1 - 20, partY + 9, px1 - 20 - Math.min(160, arrowL(V.m * V.a)), partY + 9, C.warn, 2.5);
            kit.label(c, 'ma ' + (V.m * V.a).toFixed(0) + ' N — friction must hold it', px1 - 20, partY - 8, { size: 11.5, color: C.warn, align: 'right' });
          }
        } else {
          const plateX = 120, cupX = 132, faceX = cupX + 14, top = 60, bot = 330;
          c.fillStyle = C.surface; c.fillRect(plateX - 12, top + 30, 12, bot - top - 60);
          c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(plateX - 12, top + 30, 12, bot - top - 60);
          c.beginPath(); c.moveTo(plateX - 12, 195); c.lineTo(40, 195); c.stroke();
          const sv = Math.min(wc + 8, 220 / n), ym = 195 - sv * (n - 1) / 2;
          for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(plateX, ym + i * sv); c.lineTo(cupX, ym + i * sv); c.stroke(); cupShape(c, cupX, ym + i * sv, wc, 14, C.text, 2); }
          c.fillStyle = C.dark ? 'rgba(160,170,200,.35)' : 'rgba(90,100,130,.3)'; c.fillRect(faceX, top, 18, bot - top);
          c.strokeStyle = C.text; c.strokeRect(faceX, top, 18, bot - top);
          for (let i = 0; i < n; i++) kit.arrow(c, faceX + 58, ym + i * sv, faceX + 22, ym + i * sv, C.accent, 2);
          kit.label(c, 'the atmosphere presses the face on: ' + Ft.toFixed(0) + ' N', faceX + 64, 44, { size: 12, color: C.accent, weight: 600 });
          kit.arrow(c, faceX + 9, 260, faceX + 9, 260 + Math.min(70, arrowL(V.m * (g + V.a)) * 0.6), C.text, 2.5);
          kit.label(c, 'm(g + a) ' + (V.m * (g + V.a)).toFixed(0) + ' N', faceX + 26, 300, { size: 11.5, color: C.text });
          kit.arrow(c, faceX + 9, 250, faceX + 9, 250 - Math.min(90, arrowL(mu * Ft) * 0.6), col, 2.5);
          kit.label(c, 'friction up to μF = ' + (mu * Ft).toFixed(0) + ' N', faceX + 26, 224, { size: 11.5, color: col });
        }
        // ---- the bars
        const bx = 470, base = 330, h = 250, bw = 52, fm = Math.max(ceil, need * Srec, Ft) * 1.05;
        const bar = (i, f, color, name, sub) => {
          const hh = h * f / fm, x = bx + i * (bw + 22);
          c.fillStyle = color; c.fillRect(x, base - hh, bw, hh);
          kit.label(c, f.toFixed(0) + ' N', x + bw / 2, base - hh - 10, { size: 11.5, color: C.text, align: 'center', weight: 600 });
          kit.label(c, name, x + bw / 2, base + 14, { size: 11, color: C.text, align: 'center' });
          kit.label(c, sub, x + bw / 2, base + 28, { size: 10.5, color: C.muted, align: 'center' });
        };
        bar(0, Ft, C.accent, 'the cups', 'n·Δp·A');
        bar(1, need, C.warn, 'to hold', 'S = 1');
        bar(2, need * Srec, C.muted, 'required', 'S = ' + Srec);
        const yc = base - h * ceil / fm;
        c.strokeStyle = C.bad; c.setLineDash([6, 4]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx - 6, yc); c.lineTo(bx + 3 * (bw + 22) - 16, yc); c.stroke(); c.setLineDash([]);
        kit.label(c, 'ceiling: perfect vacuum ' + ceil.toFixed(0) + ' N', bx - 6, yc - 10, { size: 11, color: C.bad });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 10, base); c.lineTo(bx + 3 * (bw + 22), base); c.stroke();
        kit.label(c, Number.isFinite(Sact) ? 'safety factor ' + Sact.toFixed(2) + (status === 'bad' ? ': it would slip' : status === 'warn' ? ': below ' + Srec : ': fine') : '', 740, 22, { size: 14, color: col, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.once();
    }
  });

  /* ================================================================ vac-ejector-curves */
  Hyper.sim('vac-ejector-curves', {
    title: 'Inside an ejector',
    blurb: `A cut through a vacuum ejector: compressed air (blue) leaves the nozzle as a supersonic jet and drags the air of the suction chamber (green) with it into the mixing tube and the diffuser, which brings the mixture back to atmospheric pressure at the silencer. The suction port is open to the atmosphere through a hole whose size you choose — a large hole is an open port, no hole a sealed cup. The graphs show the ejector's two characteristics: suction flow against vacuum, and the vacuum it can reach against the supply pressure. All flows are free air (L/min ANR); the ejector is a typical one, not any maker's.

**Try this**
- Close the hole to 0: the flow stops and the vacuum climbs to the ejector's maximum, about 88 %. Open it wide: lots of flow, hardly any vacuum. The operating point slides along the suction curve.
- Raise the supply pressure from 3 to 8 bar with the port closed: the vacuum rises to a peak near 4.8 bar and then falls, while the air consumption keeps climbing in proportion to the absolute pressure.
- Switch to multi-stage with a large hole: the extra stages double or triple the flow at low vacuum. Close the hole and watch their flaps shut one by one — the maximum vacuum stays the same.
- Compare the suction flow with the air consumption: even with the port wide open the ejector sucks only about half the air it burns.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const gb = document.createElement('div');
      gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'd', type: 'select', label: 'Nozzle diameter', options: NOZZLES.map(d => [d.toFixed(1) + ' mm', d]), value: 1 },
        { id: 'pg', label: 'Supply pressure (gauge)', min: 1, max: 8, step: 0.1, value: 5, unit: 'bar' },
        { id: 'multi', type: 'select', label: 'Design', options: [['Single stage', 0], ['Multi-stage (three stages)', 1]], value: 0 },
        { id: 'hole', label: 'Suction port open to the air through a hole of', min: 0, max: 8, step: 0.05, value: 1.2, unit: 'mm' }
      ], () => refresh());
      const ro = kit.readout(box.side, [['air', 'Air consumption'], ['vac', 'Vacuum at the port'], ['qs', 'Suction flow'], ['ratio', 'Suction ÷ air consumption'], ['vmax', 'Maximum vacuum (port sealed)'], ['opt', 'Best supply pressure']]);
      const p1 = kit.plot(g1, { x: { label: 'vacuum (% below atmosphere)', min: 0, max: 100 }, y: { label: 'free air (L/min)', min: 0 } }, 170);
      const p2 = kit.plot(g2, { x: { label: 'supply pressure (bar, gauge)', min: 1, max: 8 }, y: { label: 'maximum vacuum (%)', min: 0, max: 100 } }, 170);
      const V = ctl.values;
      let ej, v = 0, qs = 0, Chole = 0;
      function refresh() {
        ej = ejectorModel(F, V.d, V.pg, V.multi === 1);
        const other = ejectorModel(F, V.d, V.pg, V.multi !== 1);
        Chole = condOf(V.hole, 0.65);
        const leak = x => holeLeak(F, x, Chole);
        v = V.hole > 0 ? operating(ej, leak) : ej.vmax;
        qs = ej.suction(v);
        const pts = (fn, top) => { const a = []; for (let i = 0; i <= 120; i++) { const x = top * i / 120; a.push([x * 100, lpm(fn(x))]); } return a; };
        const ser = [
          { pts: pts(ej.suction, 1), label: ej.multi ? 'multi-stage' : 'single stage', color: kit.colors().ok, width: 2.5 },
          { pts: pts(other.suction, 1), label: other.multi ? 'multi-stage' : 'single stage', dash: [5, 4], color: kit.colors().muted }
        ];
        if (V.hole > 0) ser.push({ pts: pts(leak, 0.99), label: 'the hole lets in', dash: [2, 3], color: kit.colors().warn });
        const top = Math.max(lpm(ej.suction(0)), lpm(other.suction(0)), 1) * 1.1;
        p1.set({ series: ser, y: { label: 'free air (L/min)', min: 0, max: top }, marks: [{ x: v * 100, y: lpm(qs), label: (v * 100).toFixed(0) + ' %, ' + lpm(qs).toFixed(1) + ' L/min' }] });
        const curve = [];
        for (let i = 0; i <= 70; i++) { const p = 1 + 7 * i / 70; curve.push([p, ejectorModel(F, V.d, p, false).vmax * 100]); }
        p2.set({ series: [{ pts: curve, label: 'maximum vacuum', color: kit.colors().ok, width: 2.5 }], marks: [{ x: V.pg, y: ej.vmax * 100, label: (ej.vmax * 100).toFixed(0) + ' %, ' + lpm(ej.air).toFixed(0) + ' L/min of air' }], vlines: [{ x: 4.8, label: 'optimum' }] });
        ro.set('air', lpm(ej.air).toFixed(1) + ' L/min ANR');
        ro.set('vac', (v * 100).toFixed(1) + ' % = −' + (v * PATM / 1000).toFixed(1) + ' kPa');
        ro.set('qs', lpm(qs).toFixed(1) + ' L/min ANR');
        ro.set('ratio', ej.air > 0 ? (qs / ej.air).toFixed(2) + ' (open port: ' + (ej.open / ej.air).toFixed(2) + ')' : '—');
        ro.set('vmax', (ej.vmax * 100).toFixed(1) + ' %');
        ro.set('opt', 'about 4.8 bar: above it, more air and no more vacuum');
      }
      refresh();
      // particles: jet (compressed air) and entrained (sucked) air
      const parts = [];
      let acc = { jet: 0, suck: 0, s2: 0, s3: 0 };
      const CY = 130;
      const wallTop = x => x < 140 ? null : x < 250 ? 96 : x < 275 ? lerp(96, 121, (x - 250) / 25) : x < 340 ? 121 : x < 530 ? lerp(121, 104, (x - 340) / 190) : 104;
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        const h = Math.min(dt, 0.05);
        const airL = lpm(ej.air), sL = lpm(qs);
        const vm = ej.vmax || 1;
        const st2 = ej.multi && v < 0.5 * vm, st3 = ej.multi && v < 0.25 * vm;
        const q2 = ej.multi ? 0.9 * ej.q0 * Math.pow(Math.max(0, 1 - v / (0.5 * vm)), 1.5) : 0;
        const q3 = ej.multi ? 1.1 * ej.q0 * Math.pow(Math.max(0, 1 - v / (0.25 * vm)), 1.5) : 0;
        const q1 = Math.max(0, qs - q2 - q3);
        // spawn: a dot stands for a fixed amount of free air, with a cap on the rate
        const per = Math.max(0.5, (airL + sL) / 90);
        acc.jet += h * airL / per * 1.2; acc.suck += h * lpm(q1) / per * 1.2; acc.s2 += h * lpm(q2) / per * 1.2; acc.s3 += h * lpm(q3) / per * 1.2;
        while (acc.jet >= 1 && parts.length < 600) { acc.jet -= 1; parts.push({ x: 180, y: CY + (Math.random() - 0.5) * 4, vx: 420 + 80 * Math.random(), vy: (Math.random() - 0.5) * 40, k: 0 }); }
        while (acc.suck >= 1 && parts.length < 600) { acc.suck -= 1; parts.push({ x: 200 + 30 * Math.random(), y: 246, vx: 0, vy: -90 - 40 * Math.random(), k: 1 }); }
        while (acc.s2 >= 1 && parts.length < 600) { acc.s2 -= 1; parts.push({ x: 372 + 8 * Math.random(), y: 190, vx: 0, vy: -80, k: 1 }); }
        while (acc.s3 >= 1 && parts.length < 600) { acc.s3 -= 1; parts.push({ x: 452 + 8 * Math.random(), y: 190, vx: 0, vy: -80, k: 1 }); }
        acc.jet = Math.min(acc.jet, 3); acc.suck = Math.min(acc.suck, 3); acc.s2 = Math.min(acc.s2, 3); acc.s3 = Math.min(acc.s3, 3);
        for (let i = parts.length - 1; i >= 0; i--) {
          const q = parts[i];
          const wt = wallTop(q.x), half = wt == null ? 14 : CY - wt;
          if (q.k === 1 && q.y < CY + half + 2) { q.vx += (380 - q.vx) * Math.min(1, 3 * h); q.vy += ((CY - q.y) * 3 - q.vy) * Math.min(1, 4 * h); }
          if (q.k === 0) { q.vx *= (1 - 0.6 * h); q.vx = Math.max(q.vx, 160); q.vy += (Math.random() - 0.5) * 300 * h; }
          q.x += q.vx * h; q.y += q.vy * h;
          if (q.x > 540 || q.y < 60) { parts.splice(i, 1); continue; }
          if (q.k === 0 || q.y < CY + half) { const lim = Math.max(2, half - 3); q.y = clamp(q.y, CY - lim, CY + lim); }
        }
        const c = st.begin();
        grid(st, c, 760, 300);
        // chamber shading: the deeper the vacuum, the paler
        c.fillStyle = C.dark ? 'rgba(61,214,140,' + (0.05 + 0.3 * v) + ')' : 'rgba(18,146,90,' + (0.04 + 0.25 * v) + ')';
        c.fillRect(141, 97, 109, 66); c.fillRect(196, 163, 38, 86);
        // walls
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.lineJoin = 'round';
        const poly = pts => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); };
        poly([[30, 114], [130, 114], [180, 127]]); poly([[30, 146], [130, 146], [180, 133]]);
        poly([[140, 116.6], [140, 96], [250, 96], [275, 121], [340, 121], [530, 104]]);
        poly([[140, 143.4], [140, 164], [195, 164], [195, 250]]);
        poly(ej.multi ? [[235, 250], [235, 206]] : [[235, 250], [235, 164], [250, 164], [275, 139], [340, 139], [530, 156]]);
        if (ej.multi) {
          const yb = x => lerp(139, 156, (x - 340) / 190);
          poly([[235, 190], [235, 164], [250, 164], [275, 139], [340, 139], [368, yb(368)]]);
          poly([[384, yb(384)], [448, yb(448)]]); poly([[464, yb(464)], [530, 156]]);
          poly([[235, 206], [490, 206], [490, 190]]); poly([[235, 190], [368, 190], [368, yb(368)]]); poly([[384, yb(384)], [384, 190], [448, 190], [448, yb(448)]]); poly([[464, yb(464)], [464, 190], [490, 190]]);
          // flaps: hinged at the left edge of each opening, open while the stage still draws
          const flap = (x0, open, y) => { c.strokeStyle = open ? C.ok : C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + 16 * Math.cos(open ? -0.9 : 0), y + 16 * Math.sin(open ? -0.9 : 0)); c.stroke(); };
          flap(368, st2, yb(368) + 1); flap(448, st3, yb(448) + 1);
          kit.label(c, 'stage 2 ' + (st2 ? 'open' : 'shut'), 376, 222, { size: 10.5, color: st2 ? C.ok : C.muted, align: 'center' });
          kit.label(c, 'stage 3 ' + (st3 ? 'open' : 'shut'), 456, 222, { size: 10.5, color: st3 ? C.ok : C.muted, align: 'center' });
        }
        // silencer and exhaust
        c.fillStyle = C.surface; c.fillRect(530, 100, 34, 60); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(530, 100, 34, 60);
        for (let yy = 106; yy < 160; yy += 8) { c.beginPath(); c.moveTo(532, yy); c.lineTo(562, yy + 5); c.stroke(); }
        if (airL > 0.5) for (let k = 0; k < 3; k++) kit.arrow(c, 570, 112 + 18 * k, 592, 112 + 18 * k, S.col('exhaust'), 2);
        // the hole at the suction port
        c.fillStyle = C.text; c.fillRect(190, 250, 50, 5);
        const hw = clamp(V.hole * 4, 0, 40);
        if (hw > 0) { c.fillStyle = C.bg2; c.fillRect(215 - hw / 2, 249, hw, 7); if (qs > 0) kit.arrow(c, 215, 282, 215, 258, C.ok, 2); }
        kit.label(c, V.hole > 0 ? 'hole ' + V.hole.toFixed(2) + ' mm' : 'port sealed (a tight cup)', 215, 270, { size: 11, color: C.muted, align: 'center' });
        // dots
        for (const q of parts) { c.fillStyle = q.k ? C.ok : S.col('air'); c.beginPath(); c.arc(q.x, q.y, 2.2, 0, Math.PI * 2); c.fill(); }
        // labels
        kit.label(c, 'compressed air ' + V.pg.toFixed(1) + ' bar', 32, 100, { size: 11.5, color: S.col('air'), weight: 600 });
        kit.label(c, 'nozzle ' + V.d.toFixed(1) + ' mm', 150, 84, { size: 11, color: C.muted });
        kit.label(c, 'mixing tube', 307, 110, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'diffuser', 440, 100, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'silencer', 547, 172, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, '−' + (v * PATM / 1000).toFixed(0) + ' kPa', 150, 200, { size: 14, color: C.text, weight: 700 });
        kit.label(c, 'vacuum', 150, 218, { size: 11, color: C.muted });
        // the same device in ISO 1219 symbols
        const sp = S.source(c, 620, 92, { pneumatic: true });
        const e = S.ejector(c, 690, 52, {});
        S.line(c, [sp.P, [620, 52], e.P], { state: 'air' });
        S.line(c, [e.V, [690, 100]], { state: qs > 0 ? 'suction' : 'idle' });
        kit.label(c, '−' + (v * PATM / 1000).toFixed(0) + ' kPa', 698, 104, { size: 11, color: C.text });
        kit.label(c, 'ISO 1219 symbol', 676, 128, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, lpm(ej.air).toFixed(0) + ' L/min of air in → ' + sL.toFixed(1) + ' L/min sucked', 380, 280, { size: 12, color: C.text, align: 'center', weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ vac-ejector-leak */
  const MATS = [['Steel sheet or glass (tight)', 0], ['Folding boxboard', 0.6], ['Chipboard or MDF', 2], ['Corrugated cardboard', 6], ['Foam or textile', 25]];
  Hyper.sim('vac-ejector-leak', {
    title: 'A leaky part on an ejector',
    blurb: `An ejector holds a part with a row of cups. Air leaks in through the part — through its pores (porous materials) and through any hole or gap under a cup — and the vacuum settles where the ejector's suction curve meets the leak curve. The graph shows both in free air against the vacuum; the circuit shows the same state in ISO 1219 symbols: supply and valve (blue), the ejector with its silencer, and the vacuum line (green) with a gauge. The leakiness of each material is a typical, illustrative figure — always test real parts.

**Try this**
- Start on steel: the vacuum climbs to the ejector's maximum. Choose corrugated cardboard: the curves now cross far lower, and so does the holding force.
- On cardboard, compare a bigger nozzle and a multi-stage ejector with a higher supply pressure: flow raises the vacuum, pressure hardly does.
- Put a 1 mm hole under a cup on steel: the leak curve rises and then goes flat above about 50 % vacuum — the hole is choked. A 2–3 mm hole defeats a small ejector completely.
- More cups on a porous part means more area letting air in: the vacuum falls, yet the total force can still rise. Find the best number.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const gd = document.createElement('div'); gd.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gd);
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Part', options: MATS, value: 6 },
        { id: 'hole', label: 'Hole or gap under one cup (equivalent diameter)', min: 0, max: 4, step: 0.05, value: 0, unit: 'mm' },
        { id: 'n', label: 'Number of cups', min: 1, max: 8, step: 1, value: 4 },
        { id: 'dc', type: 'select', label: 'Cup diameter', options: [20, 30, 40, 50, 60, 80, 100].map(d => [d + ' mm', d]), value: 40 },
        { id: 'd', type: 'select', label: 'Ejector nozzle', options: NOZZLES.map(d => [d.toFixed(1) + ' mm', d]), value: 1 },
        { id: 'multi', type: 'select', label: 'Design', options: [['Single stage', 0], ['Multi-stage', 1]], value: 0 },
        { id: 'pg', label: 'Supply pressure (gauge)', min: 3, max: 7, step: 0.1, value: 5, unit: 'bar' }
      ], () => refresh());
      const ro = kit.readout(box.side, [['vac', 'Operating vacuum'], ['q', 'Flow where the curves cross'], ['split', 'Leak: through the part / the hole'], ['F', 'Force of all cups: now / sealed'], ['air', 'Air consumption'], ['hint', 'What sets it']]);
      const plot = kit.plot(gd, { x: { label: 'vacuum (% below atmosphere)', min: 0, max: 100 }, y: { label: 'free air (L/min)', min: 0 } }, 180);
      const V = ctl.values;
      let ej, v = 0, lp = 0, lh = 0, ph = { s: 0, v: 0, x: 0 };
      function refresh() {
        const C = kit.colors();
        ej = ejectorModel(F, V.d, V.pg, V.multi === 1);
        const other = ejectorModel(F, V.d, V.pg, V.multi !== 1);
        const Acup = Math.PI * Math.pow(V.dc / 1000, 2) / 4;
        const k50 = V.mat / 60000 * (V.n * Acup / 1e-3);    // L/min per 10 cm² of cup area, at 50 % vacuum
        const Ch = condOf(V.hole, 0.65);
        const leakP = x => porousLeak(x, k50), leakH = x => holeLeak(F, x, Ch), leak = x => leakP(x) + leakH(x);
        v = operating(ej, leak); lp = leakP(v); lh = leakH(v);
        const pts = (fn, top) => { const a = []; for (let i = 0; i <= 120; i++) { const x = top * i / 120; a.push([x * 100, lpm(fn(x))]); } return a; };
        const ser = [
          { pts: pts(ej.suction, 1), label: 'ejector sucks', color: C.ok, width: 2.5 },
          { pts: pts(other.suction, 1), label: other.multi ? '(multi-stage)' : '(single stage)', dash: [5, 4], color: C.muted },
          { pts: pts(leak, 0.99), label: 'part leaks', color: C.bad, width: 2.5 }
        ];
        if (V.hole > 0 && k50 > 0) ser.push({ pts: pts(leakH, 0.99), label: 'of which the hole', dash: [2, 3], color: C.warn });
        const top = Math.max(lpm(ej.suction(0)), 1) * 1.15;
        plot.set({ series: ser, y: { label: 'free air (L/min)', min: 0, max: top }, marks: [{ x: v * 100, y: lpm(ej.suction(v)), label: (v * 100).toFixed(0) + ' % vacuum' }], vlines: [{ x: ej.vmax * 100, label: 'sealed maximum' }] });
        const Fnow = V.n * v * PATM * Acup, Fmax = V.n * ej.vmax * PATM * Acup;
        ro.set('vac', (v * 100).toFixed(1) + ' % = −' + (v * PATM / 1000).toFixed(1) + ' kPa');
        ro.set('q', lpm(ej.suction(v)).toFixed(1) + ' L/min ANR');
        ro.set('split', lpm(lp).toFixed(1) + ' / ' + lpm(lh).toFixed(1) + ' L/min');
        ro.set('F', Fnow.toFixed(0) + ' N / ' + Fmax.toFixed(0) + ' N');
        ro.set('air', lpm(ej.air).toFixed(0) + ' L/min ANR, all the time');
        ro.set('hint', v > 0.95 * ej.vmax ? 'the ejector\'s maximum: the part is tight' : lh > lp ? 'the hole — choked, so its leak no longer grows' : 'the porous part — more flow would help');
      }
      refresh();
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        const h = Math.min(dt, 0.05), q = lpm(ej.suction(v)), air = lpm(ej.air);
        ph.s += h * 30 * clamp(air / 50, 0.3, 3); ph.v += h * 30 * clamp(q / 20, 0, 3); ph.x += h;
        const c = st.begin();
        grid(st, c, 760, 330);
        const n = V.n, x0 = 360, x1 = 720, sp = (x1 - x0) / n, cx = i => x0 + sp * (i + 0.5);
        const vst = q > 0.05 ? 'suction' : 'idle';
        // supply: source, 2/2 solenoid valve (switched on), ejector
        const src = S.source(c, 60, 300, { pneumatic: true });
        const val = S.valve(c, 60, 210, { spec: '2/2 NC', state: 0, left: 'solenoid', right: 'spring', s: 30, pneumatic: true, labels: true });
        kit.label(c, 'vacuum on', val.xr + 6, 210, { size: 11, color: C.muted });
        const ej0 = S.ejector(c, 200, 110, {});
        S.line(c, [src.P, val.P], { state: 'air' });
        S.line(c, [val.A, [60, 110], ej0.P], { state: 'air' });
        S.flow(c, [src.P, val.P, val.A, [60, 110], ej0.P], ph.s, { color: S.col('air') });
        kit.label(c, V.pg.toFixed(1) + ' bar', 70, 280, { size: 11, color: C.muted });
        // exhaust dots out of the silencer
        S.flow(c, [[240, 110], [300, 110]], ph.s * 1.5, { color: S.col('exhaust') });
        kit.label(c, 'exhaust ' + air.toFixed(0) + ' L/min', 262, 90, { size: 11, color: C.muted, align: 'center' });
        // vacuum line to the cups
        const man = 180;
        S.line(c, [ej0.V, [200, man], [cx(n - 1), man]], { state: vst });
        for (let i = 0; i < n; i++) { S.line(c, [[cx(i), man], [cx(i), 230]], { state: vst }); if (i < n - 1) S.junction(c, cx(i), man); S.cup(c, cx(i), 240, {}); }
        if (q > 0.05) S.flow(c, [[cx(0), 230], [cx(0), man], [200, man], ej0.V], ph.v, { color: S.col('suction') });
        const gg = S.gauge(c, 280, 146, { frac: v, value: '−' + (v * PATM / 1000).toFixed(0) + ' kPa', needle: C.ok });
        S.line(c, [gg.P, [280, man]], { state: vst }); S.junction(c, 280, man);
        // the part, with its material
        const py = 251, ph2 = 20;
        const mcol = V.mat === 0 ? (C.dark ? 'rgba(170,180,210,.45)' : 'rgba(110,120,150,.35)') : V.mat < 1 ? (C.dark ? 'rgba(210,190,150,.4)' : 'rgba(170,140,90,.35)') : V.mat < 5 ? (C.dark ? 'rgba(190,150,100,.45)' : 'rgba(150,110,60,.35)') : V.mat < 10 ? (C.dark ? 'rgba(200,160,100,.4)' : 'rgba(170,120,60,.3)') : (C.dark ? 'rgba(230,200,120,.35)' : 'rgba(200,170,80,.3)');
        c.fillStyle = mcol; c.fillRect(x0 - 10, py, x1 - x0 + 20, ph2);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x0 - 10, py, x1 - x0 + 20, ph2);
        if (V.mat >= 5 && V.mat < 10) { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); for (let x = x0 - 10; x <= x1 + 10; x += 2) { const y = py + ph2 / 2 + 6 * Math.sin((x - x0) / 6); x === x0 - 10 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
        if (V.mat >= 10) { c.fillStyle = C.muted; for (let x = x0 - 6; x < x1 + 8; x += 7) for (let y = py + 4; y < py + ph2; y += 6) { c.beginPath(); c.arc(x + ((y / 6) % 2) * 3, y, 1.1, 0, Math.PI * 2); c.fill(); } }
        kit.label(c, MATS.find(m => m[1] === V.mat)[0], x1 + 10, py + ph2 + 14, { size: 11, color: C.muted, align: 'right' });
        // leaks: arrows through the part under the cups, and the hole
        const perCup = lpm(lp) / n;
        const nArr = perCup > 0.05 ? clamp(Math.round(1 + perCup / 2), 1, 4) : 0;
        for (let i = 0; i < n; i++) for (let k = 0; k < nArr; k++) {
          const xx = cx(i) + (k - (nArr - 1) / 2) * 7, off = ((ph.x * 30 + k * 5) % 14);
          kit.arrow(c, xx, py + ph2 + 22 - off, xx, py + ph2 + 8 - off, C.bad, 1.5);
        }
        if (V.hole > 0) {
          const hw = clamp(V.hole * 3, 2, 12);
          c.fillStyle = C.bg2; c.fillRect(cx(0) - hw / 2, py - 1, hw, ph2 + 2);
          kit.arrow(c, cx(0), py + ph2 + 26, cx(0), py + 4, C.warn, 2.5);
          kit.label(c, 'hole ' + V.hole.toFixed(2) + ' mm: ' + lpm(lh).toFixed(1) + ' L/min', cx(0) - 12, py + ph2 + 36, { size: 11, color: C.warn });
        }
        kit.label(c, 'vacuum ' + (v * 100).toFixed(0) + ' % · holding force ' + (V.n * v * PATM * Math.PI * Math.pow(V.dc / 1000, 2) / 4).toFixed(0) + ' N', 540, 146, { size: 13, color: C.text, weight: 700, align: 'center' });
        kit.label(c, 'leak in ' + lpm(lp + lh).toFixed(1) + ' L/min = sucked out ' + q.toFixed(1) + ' L/min', 540, 166, { size: 11.5, color: C.muted, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ vac-evacuation */
  const GENS = [
    { name: 'Ejector 0.5 mm, single stage', kind: 'e', d: 0.5 },
    { name: 'Ejector 1.0 mm, single stage', kind: 'e', d: 1.0 },
    { name: 'Ejector 1.5 mm, single stage', kind: 'e', d: 1.5 },
    { name: 'Ejector 1.0 mm, multi-stage', kind: 'e', d: 1.0, multi: true },
    { name: 'Dry vane pump, 4 m³/h', kind: 'p', S: 4 / 3600, pult: 12000 },
    { name: 'Dry vane pump, 16 m³/h', kind: 'p', S: 16 / 3600, pult: 12000 }
  ];
  // a hose drawn as a serpentine of a given length (px) starting at (x, y), rows of width w, spaced dy
  function serpentine(x, y, w, dy, len) {
    const pts = [[x, y]];
    let left = len, dir = 1, cx = x, cy = y;
    while (left > 0) {
      const run = Math.min(left, w);
      cx += dir * run; left -= run; pts.push([cx, cy]);
      if (left <= 0) break;
      const down = Math.min(left, dy); cy += down; left -= down; pts.push([cx, cy]);
      dir = -dir;
    }
    return pts;
  }
  Hyper.sim('vac-evacuation', {
    title: 'How fast does the gripper grip?',
    blurb: `A generator evacuates a set of cups and the hose between them, starting from atmospheric pressure. The solid curve integrates the real balance — the generator's suction flow at each vacuum, minus any leak — for the volume $V$ of cups and hose; the dashed curve is the rough estimate $t = (V/S)\\ln(p_0/p)$ with $S$ the suction at the start. The drawing shows the hose to length and bore, filling with vacuum as time goes on (slowed down).

**Try this**
- Read the time to 60 % with the 1.0 mm ejector, then lengthen the hose from 2 m to 8 m: the time grows almost in proportion to the volume. A short hose, or the ejector at the cups, is the cheapest speed-up there is.
- Raise the target to 80 %: the ejector's curve bends away from the estimate as its suction falls towards its maximum vacuum.
- Choose bellows cups: three times the volume per cup.
- Compare the multi-stage ejector (fast at low vacuum) and the vane pumps (steady suction, a deeper limit).
- Add a worn lip or a porous part: the time stretches, and with a small generator the target may never be reached.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gd = document.createElement('div'); gd.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gd);
      const ctl = kit.controls(box.side, [
        { id: 'gen', type: 'select', label: 'Vacuum generator', options: GENS.map((g, i) => [g.name, i]), value: 1 },
        { id: 'pg', label: 'Ejector supply pressure (gauge)', min: 3, max: 7, step: 0.1, value: 5, unit: 'bar' },
        { id: 'n', label: 'Number of cups', min: 1, max: 8, step: 1, value: 4 },
        { id: 'dc', type: 'select', label: 'Cup diameter', options: [20, 30, 40, 50, 60, 80, 100].map(d => [d + ' mm', d]), value: 40 },
        { id: 'ct', type: 'select', label: 'Cup type', options: [['Flat', 1], ['Bellows (1½ folds)', 3]], value: 1 },
        { id: 'hb', type: 'select', label: 'Hose bore', options: [['2.5 mm (4 mm tube)', 2.5], ['4 mm (6 mm tube)', 4], ['6 mm (8 mm tube)', 6], ['8 mm (10 mm tube)', 8]], value: 4 },
        { id: 'hl', label: 'Hose length', min: 0, max: 10, step: 0.1, value: 2, unit: 'm' },
        { id: 'tv', label: 'Target vacuum', min: 20, max: 85, step: 1, value: 60, unit: '%' },
        { id: 'leak', type: 'select', label: 'Part', options: [['Sealed', 0], ['Worn lip: a 0.5 mm² gap', 1], ['Porous (cardboard)', 2]], value: 0 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 },
        { type: 'buttons', items: [{ id: 'go', label: 'Grip again', primary: true }] }
      ], (id) => { if (id === 'go') anim = 0; else refresh(); });
      const ro = kit.readout(box.side, [['V', 'Volume of cups and hose'], ['S0', 'Suction at the start'], ['tsim', 'Time to the target (simulated)'], ['test', 'Rough estimate (V/S) ln(p₀/p)'], ['vend', 'Vacuum it settles at'], ['air', 'Compressed air per grip']]);
      const plot = kit.plot(gd, { x: { label: 'time (s)', min: 0 }, y: { label: 'vacuum (%)', min: 0, max: 100 } }, 170);
      const V = ctl.values;
      let res = null, anim = 0, lastPlot = 0;
      function refresh() {
        const g = GENS[V.gen] || GENS[1];
        ctl.show('pg', g.kind === 'e');
        const ej = g.kind === 'e' ? ejectorModel(F, g.d, V.pg, !!g.multi) : null;
        const Vc = (V.ct === 3 ? 0.15 : 0.05) * Math.pow(V.dc / 10, 3);                 // cm³ per cup
        const Vh = Math.PI * Math.pow(V.hb / 2, 2) * V.hl * 1000 / 1000;                  // cm³
        const Vtot = (V.n * Vc + Vh + 2) * 1e-6;                                          // m³, with 2 cm³ of fittings
        const Aall = V.n * Math.PI * Math.pow(V.dc / 1000, 2) / 4;
        const leak = x => V.leak === 1 ? holeLeak(F, x, condOf(Math.sqrt(4 * 0.5 / Math.PI), 0.65)) : V.leak === 2 ? porousLeak(x, 6 / 60000 * Aall / 1e-3) : 0;
        const suck = p => g.kind === 'e' ? ej.suction(1 - p / PATM) : g.S * Math.max(0, p - g.pult) / PN;   // free air, m³/s
        const S0 = g.kind === 'e' ? ej.suction(0) * PN / PATM : g.S;                       // volume flow at the cup at the start
        const tau = Vtot / Math.max(S0, 1e-9), tv = V.tv / 100;
        const tEst = tau * Math.log(1 / (1 - tv));
        let tEnd = Math.max(4 * tEst, 6 * tau, 0.05);
        const h = Math.min(tau / 20, tEnd / 3000);
        const pts = [], est = [];
        // the vacuum where suction and leak balance: can the target be reached at all?
        let lo = 0, hi = 0.9999;
        for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (suck(PATM * (1 - m)) - leak(m) > 0) lo = m; else hi = m; }
        const vss = lo, reachable = vss > tv + 1e-4;
        let p = PATM, t = 0, tHit = null, k = 0, every = Math.max(1, Math.round(tEnd / h / 300));
        while ((t < tEnd || (tHit == null && reachable && t < 60)) && k < 200000) {
          const x = 1 - p / PATM;
          if (tHit == null && x >= tv) { tHit = t; if (tHit > 0.7 * tEnd) { tEnd = Math.min(60, 1.4 * tHit); every = Math.max(1, Math.round(tEnd / h / 300)); } }
          if (tHit == null && t > tEnd && k % every === 0 && pts.length > 600) { const thin = pts.filter((q, i) => i % 2 === 0); pts.length = 0; pts.push(...thin); every *= 2; }
          if (k % every === 0) pts.push([t, x * 100]);
          // isothermal: V dp/dt = −p_ANR (suction − leak), both as free air
          const f = pp => -PN * (suck(pp) - leak(1 - pp / PATM)) / Vtot;
          const k1 = f(p), k2 = f(p + 0.5 * h * k1);
          p = clamp(p + h * k2, 1, PATM); t += h; k++;
        }
        pts.push([t, (1 - p / PATM) * 100]);
        for (let i = 0; i <= 100; i++) { const tt = t * i / 100; est.push([tt, 100 * (1 - Math.exp(-tt / tau))]); }
        const vEnd = 1 - p / PATM;
        res = { pts, est, tEnd: t, tHit, tEst, Vtot, Vc, Vh, S0, vEnd, g, ej, air: ej ? ej.air : 0 };
        ro.set('V', (Vtot * 1e6).toFixed(1) + ' cm³ (cups ' + (V.n * Vc).toFixed(1) + ', hose ' + Vh.toFixed(1) + ')');
        ro.set('S0', (S0 * 60000).toFixed(1) + ' L/min');
        ro.set('tsim', tHit != null ? (tHit * 1000).toFixed(0) + ' ms' : 'never: it settles at ' + (vss * 100).toFixed(1) + ' %');
        ro.set('test', (tEst * 1000).toFixed(0) + ' ms' + (tHit != null ? ' (' + (tEst / tHit * 100).toFixed(0) + ' % of the real time)' : ''));
        ro.set('vend', (vEnd * 100).toFixed(1) + ' % after ' + t.toFixed(t < 1 ? 3 : 1) + ' s');
        ro.set('air', ej ? (tHit != null ? (ej.air * tHit * 1000).toFixed(3) + ' L of free air to reach the target' : (lpm(ej.air)).toFixed(0) + ' L/min, running on') : 'none: the pump runs on electricity');
        anim = 0;
        drawPlot();
      }
      function drawPlot() {
        if (!res) return;
        const C = kit.colors();
        const at = Math.min(anim, res.tEnd);
        const cur = res.pts.reduce((b, q) => q[0] <= at ? q : b, res.pts[0]);
        plot.set({ series: [{ pts: res.pts, label: 'simulated', color: C.ok, width: 2.5 }, { pts: res.est, label: 'rough estimate', dash: [5, 4], color: C.muted }],
          x: { label: 'time (s)', min: 0, max: res.tEnd }, hlines: [{ y: V.tv, label: 'target ' + V.tv + ' %' }],
          vlines: res.tHit != null ? [{ x: res.tHit, label: (res.tHit * 1000).toFixed(0) + ' ms' }] : [], marks: [{ x: cur[0], y: cur[1] }] });
      }
      refresh();
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        if (!res) return;
        anim += Math.min(dt, 0.05) * V.slow;
        if (anim > res.tEnd + 1.2 * V.slow + 0.3 * res.tEnd) anim = 0;
        lastPlot += dt; if (lastPlot > 0.08) { lastPlot = 0; drawPlot(); }
        const at = Math.min(anim, res.tEnd);
        let vi = 0;
        for (let i = 1; i < res.pts.length; i++) if (res.pts[i][0] >= at) { const a = res.pts[i - 1], b = res.pts[i], f = b[0] > a[0] ? (at - a[0]) / (b[0] - a[0]) : 1; vi = lerp(a[1], b[1], f) / 100; break; }
        if (at >= res.tEnd) vi = res.vEnd;
        const c = st.begin();
        grid(st, c, 760, 320);
        const g = res.g, gx = 120, gy = 80;
        let vport;
        if (g.kind === 'e') {
          const src = S.source(c, 40, 170, { pneumatic: true });
          const e = S.ejector(c, gx, gy, {});
          S.line(c, [src.P, [40, gy], e.P], { state: 'air' });
          kit.label(c, V.pg.toFixed(1) + ' bar', 48, 118, { size: 11, color: C.muted });
          vport = e.V;
        } else {
          const pmp = S.compressor(c, gx, gy + 6, { motor: true });
          S.exhaust(c, pmp.out[0], pmp.out[1], { rot: 180 });
          vport = pmp.in;
        }
        kit.label(c, g.name, gx, 18, { size: 12, color: C.text, weight: 700, align: 'center' });
        // the hose, drawn to length, its bore as the line width
        const len = 20 + 52 * V.hl, hosePts = [vport, [vport[0], 150]].concat(serpentine(vport[0], 150, 380, 22, len).slice(1));
        const end = hosePts[hosePts.length - 1];
        const shade = C.dark ? 'rgba(61,214,140,' + (0.15 + 0.8 * vi) + ')' : 'rgba(18,146,90,' + (0.15 + 0.8 * vi) + ')';
        c.strokeStyle = C.muted; c.lineWidth = 2 + V.hb * 1.1 + 2; c.lineJoin = 'round'; c.beginPath(); hosePts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
        c.strokeStyle = shade; c.lineWidth = 2 + V.hb * 1.1; c.stroke();
        kit.label(c, V.hl.toFixed(1) + ' m of ' + V.hb + ' mm bore: ' + res.Vh.toFixed(1) + ' cm³', 330, 132, { size: 11.5, color: C.muted, align: 'center' });
        // the cups on a manifold and the part
        const n = V.n, mx0 = 560, mx1 = 730, spc = (mx1 - mx0) / n, man = 240;
        S.line(c, [end, [end[0], Math.max(end[1], man - 20)], [mx0 - 10, Math.max(end[1], man - 20)], [mx0 - 10, man], [mx0 + spc * (n - 0.5), man]], { state: vi > 0.02 ? 'suction' : 'idle' });
        for (let i = 0; i < n; i++) {
          const x = mx0 + spc * (i + 0.5), w = clamp(8 + V.dc * 0.22, 10, spc - 2);
          S.line(c, [[x, man], [x, 262]], { state: vi > 0.02 ? 'suction' : 'idle' });
          c.fillStyle = shade; c.beginPath(); c.moveTo(x - w * 0.18, 262); c.lineTo(x - w / 2, 262 + 8 + (V.ct === 3 ? 8 : 0)); c.lineTo(x + w / 2, 262 + 8 + (V.ct === 3 ? 8 : 0)); c.lineTo(x + w * 0.18, 262); c.closePath(); c.fill();
          if (V.ct === 3) { c.strokeStyle = C.text; c.lineWidth = 1.2; for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(x - w * 0.3, 266 + 4 * k); c.lineTo(x + w * 0.3, 266 + 4 * k); c.stroke(); } }
          cupShape(c, x, 262, w, 8 + (V.ct === 3 ? 8 : 0), C.text, 1);
        }
        const partY = 270 + (V.ct === 3 ? 8 : 0);
        c.fillStyle = V.leak === 2 ? (C.dark ? 'rgba(200,160,100,.4)' : 'rgba(170,120,60,.3)') : (C.dark ? 'rgba(170,180,210,.45)' : 'rgba(110,120,150,.35)');
        c.fillRect(mx0 - 12, partY, mx1 - mx0 + 24, 14); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(mx0 - 12, partY, mx1 - mx0 + 24, 14);
        if (V.leak && vi > 0.05) for (let i = 0; i < n; i++) kit.arrow(c, mx0 + spc * (i + 0.5) + 6, partY + 30, mx0 + spc * (i + 0.5) + 6, partY + 16, C.bad, 1.5);
        const gg = S.gauge(c, mx0 - 50, man - 50, { frac: vi, value: '−' + (vi * PATM / 1000).toFixed(0) + ' kPa', needle: C.ok });
        S.line(c, [gg.P, [mx0 - 50, man - 20]], { state: vi > 0.02 ? 'suction' : 'idle' }); S.junction(c, mx0 - 50, man - 20);
        kit.label(c, 't = ' + (at * 1000).toFixed(0) + ' ms', 740, 22, { size: 13, color: C.text, weight: 700, align: 'right' });
        kit.label(c, (vi * 100).toFixed(1) + ' % vacuum', 740, 42, { size: 12, color: C.ok, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ vac-air-saving */
  Hyper.sim('vac-air-saving', {
    title: 'An air-saving ejector at work',
    blurb: `A gripper holds a part for a few seconds, releases it with a blow-off pulse and picks the next. Two identical ejectors are simulated side by side: the **air-saving** one (drawn) has a non-return valve and a vacuum switch — it switches its supply off at the upper set point and back on when leakage brings the vacuum down to the lower set point; the **ordinary** one runs through the whole hold. The graphs show the vacuum of both (solid: air-saving) and the free air each has used. Supply 5 bar; compressed air at 0.11 kWh per m³ and ¤0.15 per kWh for the yearly figures, 4000 hours a year.

**Try this**
- With a tight part (leak 0.2 L/min) the ejector runs for about two tenths of a second in a 3 s hold: the saving is over 90 %. Lengthen the hold to 10 s: the saving rises further.
- Raise the leak to 2 L/min: the ejector restarts every couple of tenths of a second and the saving drops to about half. Above about 4.5 L/min this 1 mm ejector cannot reach the upper set point any more — it runs all the time and saves nothing, just as on cardboard.
- Narrow the hysteresis: more frequent restarts for the same average vacuum. Widen it: fewer restarts, but a deeper sag between them — keep the lower set point above what the holding force needs.
- Add volume (longer hoses): the restarts come less often, but each evacuation takes longer.
- Set the upper set point above 88 %: this ejector never reaches it, and the "air-saving" ejector never switches off.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = document.createElement('div');
      gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'd', type: 'select', label: 'Ejector nozzle', options: NOZZLES.map(d => [d.toFixed(1) + ' mm', d]), value: 1 },
        { id: 'up', label: 'Upper set point: switch off at', min: 40, max: 90, step: 1, value: 70, unit: '%' },
        { id: 'hy', label: 'Hysteresis: switch on again after a fall of', min: 3, max: 30, step: 1, value: 10, unit: '%' },
        { id: 'leak', label: 'Leak with the part held (at 70 % vacuum)', min: 0.02, max: 20, value: 0.2, unit: 'L/min', log: true, sig: 2 },
        { id: 'vol', label: 'Volume of cups and hoses', min: 10, max: 500, value: 40, unit: 'cm³', log: true, sig: 2 },
        { id: 'hold', label: 'Time the part is held', min: 1, max: 15, step: 0.5, value: 3, unit: 's' },
        { id: 'spd', type: 'select', label: 'Time', options: [['Real time', 1], ['Twice as fast', 2], ['Slow motion ¼', 0.25]], value: 1 }
      ], () => { ej = ejectorModel(F, V.d, 5, false); });
      const ro = kit.readout(box.side, [['air', 'Free air per cycle: air-saving / ordinary'], ['save', 'Air saved'], ['on', 'Air-saving ejector running'], ['rs', 'Restarts per hold'], ['cost', 'Cost per year: air-saving / ordinary']]);
      const pv = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'vacuum (%)', min: 0, max: 100 } }, 160);
      const pa = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'free air used (L)', min: 0 }, legend: true }, 160);
      const V = ctl.values;
      let ej = ejectorModel(F, V.d, 5, false);
      const sA = { p: PATM, run: false, air: 0 }, sB = { p: PATM, run: false, air: 0 };
      let t = 0, tc = 0, restarts = 0, lastRestarts = null, cycA = 0, cycB = 0, lastA = null, lastB = null, runT = 0, lastRun = null, hist = [], tPlot = 0;
      const ph = { s: 0, v: 0, b: 0 };
      const leakC = () => V.leak / 60000 / PATM;                     // choked at 70 %: q = C·p_atm
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        const sdt = Math.min(dt, 0.05) * V.spd, sub = Math.max(1, Math.ceil(sdt / 2e-4)), h = sdt / sub;
        const hold = V.hold, blow = 0.1, cyc = hold + blow + 0.9, up = V.up / 100, lo = Math.max(0.01, (V.up - V.hy) / 100);
        const Vt = V.vol * 1e-6, Cl = leakC();
        let phase = 'hold';
        for (let k = 0; k < sub; k++) {
          phase = tc < hold ? 'hold' : tc < hold + blow ? 'blow' : 'pause';
          for (const [s, saving] of [[sA, true], [sB, false]]) {
            const v = 1 - s.p / PATM;
            let wasRun = s.run;
            if (phase === 'hold') {
              if (!saving) s.run = true;
              else if (tc < h * 1.5) s.run = true;
              else if (s.run && v >= up) s.run = false;
              else if (!s.run && v <= lo) s.run = true;
            } else s.run = false;
            if (saving && s.run && !wasRun && phase === 'hold' && tc > h * 1.5) restarts++;
            if (phase === 'blow') s.p += (PATM - s.p) * Math.min(1, h / 0.015);
            else if (phase === 'hold') {
              const qs = s.run ? ej.suction(v) : 0, ql = holeLeak(F, v, Cl);
              s.p = clamp(s.p - h * PN * (qs - ql) / Vt, 1, PATM);
            } else s.p += (PATM - s.p) * Math.min(1, h / 0.05);
            if (s.run) s.air += ej.air * h;
            if (saving && s.run) runT += h;
          }
          t += h; tc += h;
          if (tc >= cyc) {
            tc -= cyc;
            lastA = sA.air - cycA; lastB = sB.air - cycB; cycA = sA.air; cycB = sB.air;
            lastRestarts = restarts; restarts = 0; lastRun = runT; runT = 0;
          }
        }
        const vA = 1 - sA.p / PATM, vB = 1 - sB.p / PATM;
        hist.push([t, vA * 100, vB * 100, sA.air * 1000, sB.air * 1000]);
        const win = 2 * cyc + 0.5;
        while (hist.length && hist[0][0] < t - win) hist.shift();
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0;
          const hh = hist.filter((q, i) => i % 2 === 0);
          pv.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'air-saving', color: C.ok, width: 2.2 }, { pts: hh.map(q => [q[0], q[2]]), label: 'ordinary', dash: [5, 4], color: C.muted }],
            hlines: [{ y: V.up, label: 'off' }, { y: V.up - V.hy, label: 'on' }], x: { label: 'time (s)', min: Math.max(0, t - win), max: Math.max(t, win) } });
          pa.set({ series: [{ pts: hh.map(q => [q[0], q[3]]), label: 'air-saving', color: C.ok, width: 2.2 }, { pts: hh.map(q => [q[0], q[4]]), label: 'ordinary', dash: [5, 4], color: C.muted }],
            x: { label: 'time (s)', min: Math.max(0, t - win), max: Math.max(t, win) } });
        }
        if (lastA != null) {
          const perYear = x => x / cyc * 4000 * 3600 * 0.11 * 0.15;
          ro.set('air', (lastA * 1000).toFixed(2) + ' L / ' + (lastB * 1000).toFixed(2) + ' L');
          ro.set('save', lastB > 0 ? ((1 - lastA / lastB) * 100).toFixed(0) + ' %' : '—');
          ro.set('on', lastRun.toFixed(2) + ' s of a ' + hold.toFixed(1) + ' s hold');
          ro.set('rs', String(lastRestarts));
          ro.set('cost', kit.money(perYear(lastA), 0) + ' / ' + kit.money(perYear(lastB), 0));
        } else { ro.set('air', 'after the first cycle'); ro.set('save', '—'); ro.set('on', '—'); ro.set('rs', '—'); ro.set('cost', '—'); }
        // ---- the circuit
        const c = st.begin();
        grid(st, c, 760, 330);
        const run = sA.run, blowing = phase === 'blow';
        ph.s += dt * 50 * (run ? 1 : 0); ph.v += dt * 35 * (run ? clamp(lpm(ej.suction(vA)) / 15, 0.1, 2) : 0); ph.b += dt * 60 * (blowing ? 1 : 0);
        const src = S.source(c, 50, 305, { pneumatic: true });
        const vOn = S.valve(c, 150, 230, { spec: '2/2 NC', state: run ? 0 : 1, left: 'solenoid', right: 'spring', s: 28, pneumatic: true, labels: true });
        const vBl = S.valve(c, 380, 230, { spec: '2/2 NC', state: blowing ? 0 : 1, left: 'solenoid', right: 'spring', s: 28, pneumatic: true, labels: true });
        kit.label(c, 'vacuum on', vOn.xr + 4, 230, { size: 11, color: run ? C.text : C.muted });
        kit.label(c, 'blow-off', vBl.xr + 4, 230, { size: 11, color: blowing ? C.text : C.muted });
        S.line(c, [src.P, [50, 280], [380, 280], vBl.P], { state: 'air' }); S.line(c, [[150, 280], vOn.P], { state: 'air' }); S.junction(c, 150, 280);
        const e = S.ejector(c, 260, 70, {});
        S.line(c, [vOn.A, [150, 70], e.P], { state: run ? 'air' : 'idle' });
        if (run) { S.flow(c, [src.P, [50, 280], [150, 280], vOn.P, vOn.A, [150, 70], e.P], ph.s, { color: S.col('air') }); S.flow(c, [[300, 70], [350, 70]], ph.s * 1.4, { color: S.col('exhaust') }); }
        const chk = S.check(c, 260, 130, { open: run && vA < V.up / 100 + 0.02 });
        const vst = vA > 0.02 ? 'suction' : 'idle';
        S.line(c, [e.V, chk.out], { state: run ? vst : 'idle' });
        S.line(c, [chk.in, [260, 170], [560, 170], [560, 238]], { state: vst });
        if (run && vA > 0.005) S.flow(c, [[560, 238], [560, 170], [260, 170], chk.in, chk.out, e.V], ph.v, { color: S.col('suction') });
        const th = S.throttle(c, 380, 188, {});
        S.line(c, [vBl.A, th.a], { state: blowing ? 'air' : 'idle' }); S.line(c, [th.b, [380, 170]], { state: blowing ? 'air' : vst }); S.junction(c, 380, 170);
        if (blowing) S.flow(c, [[380, 280], vBl.P, vBl.A, th.a, th.b, [380, 170], [560, 170], [560, 238]], ph.b, { color: S.col('air') });
        const sw = vacSwitch(c, S, C, 470, 118, vA >= lo);
        S.line(c, [sw.P, [470, 170]], { state: vst }); S.junction(c, 470, 170);
        kit.label(c, 'vacuum switch', 470, 94, { size: 11, color: C.muted, align: 'center' });
        S.cup(c, 560, 248, {});
        const partOn = phase === 'hold';
        c.fillStyle = C.dark ? 'rgba(170,180,210,.45)' : 'rgba(110,120,150,.35)';
        const py = partOn ? 259 : 259 + Math.min(20, (tc - hold) * 200);
        c.fillRect(505, py, 110, 14); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(505, py, 110, 14);
        kit.label(c, 'non-return valve', 272, 130, { size: 11, color: C.muted });
        // the vacuum bar with the two set points
        const bx = 680, by0 = 60, by1 = 280, yv = f => by1 - (by1 - by0) * f;
        c.fillStyle = C.surface; c.fillRect(bx, by0, 26, by1 - by0);
        c.fillStyle = C.ok; c.fillRect(bx, yv(vA), 26, by1 - yv(vA));
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(bx, by0, 26, by1 - by0);
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 8, yv(up)); c.lineTo(bx + 34, yv(up)); c.stroke();
        c.strokeStyle = C.warn; c.beginPath(); c.moveTo(bx - 8, yv(lo)); c.lineTo(bx + 34, yv(lo)); c.stroke();
        kit.label(c, 'off ' + V.up + ' %', bx - 10, yv(up), { size: 10.5, color: C.bad, align: 'right' });
        kit.label(c, 'on ' + (V.up - V.hy) + ' %', bx - 10, yv(lo), { size: 10.5, color: C.warn, align: 'right' });
        kit.label(c, (vA * 100).toFixed(0) + ' %', bx + 13, by1 + 14, { size: 12, color: C.text, weight: 700, align: 'center' });
        const status = phase === 'blow' ? 'blow-off: releasing the part' : phase === 'pause' ? 'pause: the next part' : run ? 'ejector ON — evacuating' : 'ejector OFF — the non-return valve holds the vacuum';
        kit.label(c, status, 20, 22, { size: 13, color: run ? C.accent : C.text, weight: 700 });
        kit.label(c, 'air used: ' + (sA.air * 1000).toFixed(1) + ' L (air-saving) · ' + (sB.air * 1000).toFixed(1) + ' L (ordinary)', 20, 42, { size: 11.5, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ vac-pick-place */
  // a 1-D move of length D with acceleration a and top speed vmax: trapezoidal, or triangular if short
  function moveProfile(D, a, vmax) {
    a = Math.max(a, 0.05); D = Math.max(D, 0);
    let ta = vmax / a, tc = (D - vmax * ta) / vmax, vp = vmax;
    if (tc < 0) { ta = Math.sqrt(D / a); tc = 0; vp = a * ta; }
    return { D, a, ta, tc, vp, T: 2 * ta + tc };
  }
  // [distance, speed, acceleration] at time t along a profile
  function moveAt(p, t) {
    if (t < p.ta) return [0.5 * p.a * t * t, p.a * t, p.a];
    if (t < p.ta + p.tc) return [0.5 * p.a * p.ta * p.ta + p.vp * (t - p.ta), p.vp, 0];
    if (t < p.T) { const r = p.T - t; return [p.D - 0.5 * p.a * r * r, p.a * r, -p.a]; }
    return [p.D, 0, 0];
  }
  Hyper.sim('vac-pick-place', {
    title: 'A vacuum gripper picks and places',
    blurb: `A gantry takes a vacuum gripper through a whole cycle: down to the part, vacuum on (a compact ejector with a non-return valve at each cup), lift once the vacuum switch confirms the grip, move sideways, lower, release with a short blow-off pulse, and back for the next part. At every instant the cups' force $n\\,\\Delta p\\,A$ is compared with what the part needs: its weight plus its inertia, $m\\,(g + a)$ straight up, and whatever lies along the cup faces must be carried by friction — $\\mu$ times the force that presses the part on. The ratio is the safety factor. Below 1 the part slides on the cups; if they are pulled off, or slide over the edge, the vacuum collapses and the part falls. The circuit on the right shows the same state in ISO 1219 symbols; the graphs follow the forces and the safety factor through the cycle.

**Try this**
- Start as it is — a 5 kg sheet, four 40 mm cups at −60 kPa, 5 m/s². The lift runs at a safety factor of 4.1, but the sideways move drops it to 3.05: friction now carries the inertia, and 4 is recommended. Choose 50 mm cups and read it again.
- Turn the sheet to a vertical face: friction now carries the weight all the time, and the lowest safety factor falls to 2.0. Make the surface **wet**: 1.2. Make it **oily**: the cups slide up the panel and leave it standing on the table.
- Back to horizontal, raise the acceleration to 10 m/s² and choose the **emergency stop**: braking at 30 m/s² needs more than the cups can give (S = 0.86), and the sheet slides about 18 mm forward on them — it is placed out of position.
- Choose **air fails** with the non-return valve: the vacuum now only leaks away through the lips, the sheet just survives the braking at the end of the move and falls during the lowering. Without the non-return valve the vacuum collapses within milliseconds and the sheet is thrown off at full speed.
- Switch the blow-off pulse off: the cups stay at vacuum after the valve closes, and the sheet is carried back up until the leak lets it go.
- Raise the mass: at 20 kg the sheet is still lifted but slides off during the move; above about 20.4 kg it is not lifted at all. The read-out allows 3.8 kg at the recommended safety factors.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.43, minH: 240 });
      const gb = document.createElement('div');
      gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Mass of the part', min: 0.2, max: 60, value: 5, unit: 'kg', log: true, sig: 3 },
        { id: 'd', type: 'select', label: 'Cup diameter (effective)', options: CUPS.map(d => [d + ' mm', d]), value: 40 },
        { id: 'n', label: 'Number of cups', min: 1, max: 8, step: 1, value: 4 },
        { id: 'dp', label: 'Vacuum held with this part (below atmosphere)', min: 20, max: 85, step: 1, value: 60, unit: 'kPa' },
        { id: 'a', label: 'Acceleration of the axes', min: 0.5, max: 30, step: 0.5, value: 5, unit: 'm/s²' },
        { id: 'ori', type: 'select', label: 'Orientation', options: [['Horizontal part, cups on top', 1], ['Vertical face, cups on the side', 2]], value: 1 },
        { id: 'mu', type: 'select', label: 'Surface (friction coefficient μ)', options: [['Dry and smooth — μ = 0.5', 0.5], ['Rough: wood, stone — μ = 0.6', 0.6], ['Wet — μ = 0.3', 0.3], ['Oily sheet — μ = 0.15', 0.15]], value: 0.5 },
        { id: 'fault', type: 'select', label: 'Halfway through the move', options: [['Nothing goes wrong', 0], ['Emergency stop: braking at 3 × a', 1], ['Air fails (non-return valve holds)', 2], ['Air fails, no non-return valve', 3]], value: 0 },
        { id: 'blow', type: 'check', label: 'Blow-off pulse at release', value: true },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ½', 0.5], ['Slow motion ¼', 0.25]], value: 0.5 },
        { type: 'buttons', items: [{ id: 'go', label: 'Start the cycle again', primary: true }] }
      ], (id) => { if (id === 'go' || id === 'ori') { lastRes = ''; lastT = 0; restart(); } });
      const ro = kit.readout(box.side, [['ph', 'Step'], ['vac', 'Vacuum in the cups'], ['sw', 'Vacuum switch'], ['F', 'Holding force n·Δp·A'], ['need', 'Needed to hold now (S = 1)'], ['S', 'Safety factor now'], ['min', 'Lowest safety factor this cycle'], ['mmax', 'Heaviest part at the recommended S'], ['res', 'Last cycle']]);
      const pF = kit.plot(g1, { x: { label: 'time in the cycle (s)', min: 0, max: 4 }, y: { label: 'force (N)', min: 0 }, legend: true }, 150);
      const pS = kit.plot(g2, { x: { label: 'time in the cycle (s)', min: 0, max: 4 }, y: { label: 'safety factor', min: 0, max: 8 } }, 150);
      const V = ctl.values;
      // travel (m), top speeds (m/s), table half-width, table-to-floor drop, how far a part may slide before the cups reach its edge
      const LX = 0.8, HZ = 0.15, VXM = 1.5, VZM = 0.5, TABLE = 0.17, FLOOR = 0.15, SLIP = 0.04;
      // each cup's ejector sucks 23 L/min with its port open (a 1 mm nozzle at 5 bar); the lips leak 0.5 L/min (choked);
      // a stopped ejector without a non-return valve lets the air back like a 1.5 mm hole
      const Q0 = 23 / 60000, CL = 0.5 / 60000 / PATM, CB = condOf(1.5, 0.65);
      const NAME = { down: 'approach', grip: 'grip', lift: 'lift', move: 'move', brake: 'emergency stop', hold: 'standstill', move2: 'move', lower: 'lowering', release: 'release', up: 'rise after the release', back: 'return', pause: 'pause' };
      const NEXT = { down: 'grip', lift: 'move', move: 'lower', move2: 'lower', brake: 'hold', lower: 'release', up: 'back', back: 'pause' };
      const CARRY = { lift: 1, move: 1, brake: 1, hold: 1, move2: 1, lower: 1 };          // the steps in which the part is meant to be held
      const onTable = x => Math.abs(x) <= TABLE || Math.abs(x - LX) <= TABLE;
      const vSet = () => V.dp * 1000 / PATM;
      const Acup = () => Math.PI * Math.pow(V.d / 1000, 2) / 4;
      const Vcup = () => (0.05 * Math.pow(V.d / 10, 3) + 3.77 + 1) * 1e-6;     // m³ per cup: the cup, 0.3 m of 4 mm hose, fittings
      const accel = () => Math.max(0.5, V.a);
      const segAt = (g, t) => {
        if (g.brake) {
          const tt = Math.min(t, g.brake.v0 / g.brake.ab);
          return [g.x0 + g.dir * (g.brake.v0 * tt - 0.5 * g.brake.ab * tt * tt), g.dir * (g.brake.v0 - g.brake.ab * tt), t < g.brake.v0 / g.brake.ab ? -g.dir * g.brake.ab : 0];
        }
        const r = moveAt(g.p, t);
        return [g.x0 + g.dir * r[0], g.dir * r[1], g.dir * r[2]];
      };
      const segT = g => g.brake ? g.brake.v0 / g.brake.ab : g.p.T;
      let s = null, lastRes = '', lastT = 0;
      const ph = { s: 0, v: 0, b: 0 };
      function restart() {
        s = { ph: '', tp: 0, seg: null, gx: 0, gz: HZ, vx: 0, vz: 0, ax: 0, az: 0, v: 0, on: false, blow: 0, air: true, fault: false, sw: false, tGrip: null,
          part: { st: 'rest', x: 0, z: 0, vx: 0, vz: 0, sl: 0, vsl: 0, slip: false, ang: 0 },
          tc: 0, hist: [], marks: [], Smin: Infinity, SminAt: '', slipMax: 0, flags: {}, Fc: 0, need: null, S: null, Srec: 2, tPlot: 1 };
        enter('down');
      }
      function enter(p) {
        const a = accel();
        s.ph = p; s.tp = 0; s.seg = null;
        if (p === 'lift' || p === 'move' || p === 'lower' || p === 'release') s.marks.push({ x: s.tc, label: NAME[p] });
        if (p === 'down' || p === 'lower') s.seg = { x0: s.gz, dir: -1, z: true, p: moveProfile(s.gz, a, VZM) };
        else if (p === 'lift' || p === 'up') {
          const q = s.part;
          if (p === 'lift' && q.st === 'rest' && Math.abs(q.x - s.gx) < 0.01 && q.z < 0.002) { q.st = 'held'; q.sl = 0; q.vsl = 0; q.slip = false; }
          s.seg = { x0: s.gz, dir: 1, z: true, p: moveProfile(HZ - s.gz, a, VZM) };
        }
        else if (p === 'grip') s.on = true;
        else if (p === 'move' || p === 'move2') s.seg = { x0: s.gx, dir: 1, p: moveProfile(LX - s.gx, a, VXM) };
        else if (p === 'brake') s.seg = { x0: s.gx, dir: 1, brake: { v0: Math.max(0, s.vx), ab: 3 * a } };
        else if (p === 'release') { s.on = false; s.blow = V.blow && s.air ? 0.1 : 0; }
        else if (p === 'back') s.seg = { x0: s.gx, dir: -1, p: moveProfile(s.gx, a, VXM) };
        if (s.seg) s.seg.t = 0;
      }
      // the cups let go: the part stays where it is if it still sits on a table, otherwise it falls
      function letGo(why) {
        const q = s.part, hor = V.ori === 1;
        const x = s.gx + (hor ? q.sl : 0), z = s.gz + (hor ? 0 : q.sl);
        const vx = s.vx + (hor ? q.vsl : 0), vz = s.vz + (hor ? 0 : q.vsl);
        q.slip = false; q.vsl = 0; q.ang = 0;
        if (z < 0.003 && onTable(x)) {
          q.st = 'rest'; q.x = x; q.z = 0;
          if (s.ph === 'lift') s.flags.notLifted = why;
          return;
        }
        q.st = 'fall'; q.x = x; q.z = z; q.vx = vx; q.vz = vz;
        if (!s.flags.drop) s.flags.drop = NAME[s.ph] + ': ' + why;
      }
      function finish() {
        const f = s.flags, q = s.part, hor = V.ori === 1;
        let r;
        if (f.drop) r = 'dropped during the ' + f.drop;
        else if (f.notLifted) r = 'not lifted — ' + f.notLifted;
        else if (q.st === 'rest' && Math.abs(q.x - LX) < TABLE) {
          const off = hor ? Math.abs(q.x - LX) : s.slipMax;
          r = off > 0.0005 ? 'placed, but it slipped ' + (off * 1000).toFixed(0) + ' mm' + (hor ? ' out of position' : ' down the cups') : 'placed';
        } else r = 'not placed';
        if (Number.isFinite(s.Smin)) r += '; lowest S ' + s.Smin.toFixed(2);
        if (f.estop) r += '; emergency stop';
        if (f.air) r += '; the air failed';
        if (f.stuck) r += '; it stuck to the cups (no blow-off)';
        lastRes = r; lastT = s.tc;
        restart();
      }
      function step(h) {
        const hor = V.ori === 1, q = s.part, mu = V.mu;
        s.tp += h; s.tc += h;
        // the axes follow their profiles
        if (s.seg) {
          s.seg.t += h;
          const r = segAt(s.seg, s.seg.t);
          if (s.seg.z) { s.gz = r[0]; s.vz = r[1]; s.az = r[2]; s.vx = 0; s.ax = 0; }
          else { s.gx = r[0]; s.vx = r[1]; s.ax = r[2]; s.vz = 0; s.az = 0; }
        } else { s.vx = s.vz = s.ax = s.az = 0; }
        // the fault, halfway through the move
        if (s.ph === 'move' && V.fault && !s.fault && s.seg.t >= s.seg.p.T / 2) {
          s.fault = true;
          if (V.fault === 1) { s.flags.estop = true; enter('brake'); }
          else { s.air = false; s.flags.air = true; }
        }
        // the vacuum in each cup (isothermal: V dp/dt = p_ANR × net free-air flow)
        const vset = vSet(), Vt = Vcup(), run = s.on && s.air;
        const contact = q.st === 'held' || (q.st === 'rest' && Math.abs(q.x - s.gx) < 0.01 && s.gz < 0.002);
        if (s.blow > 0) s.blow -= h;
        if (!contact) s.v *= Math.exp(-h / 0.005);                                          // cups open to the air
        else if (s.blow > 0) s.v += (-0.1 - s.v) * (1 - Math.exp(-h / 0.006));              // blow-off: a little overpressure
        else if (run) { const tau = Math.max(1e-4, PATM * Vt * vset / (PN * Q0)); s.v = vset + (s.v - vset) * Math.exp(-h / tau); }
        else if (s.v < 0) s.v *= Math.exp(-h / 0.025);
        else {
          let qin = holeLeak(F, s.v, CL);
          if (!s.air && V.fault === 3) qin += holeLeak(F, s.v, CB);                        // no non-return valve: back through the ejector
          s.v = Math.max(0, s.v - h * PN * qin / (PATM * Vt));
        }
        const vsw = 0.75 * vset;
        if (!s.sw && s.v >= vsw) s.sw = true; else if (s.sw && s.v < vsw - 0.02) s.sw = false;
        // the grip: cups press the part on with Fc; what acts along the faces needs friction
        const Fc = V.n * s.v * PATM * Acup();
        s.Fc = Fc; s.need = null; s.S = null;
        if (q.st === 'held') {
          if (!hor && onTable(s.gx) && s.gz + q.sl < 0) { q.sl = -s.gz; if (s.vz + q.vsl < 0) q.vsl = -s.vz; }   // a panel that slid stands on the table
          if (!(s.gz < 1e-6 && onTable(s.gx))) {
            const Fx = V.m * s.ax, Fz = V.m * (s.az + G0);                                   // force the gripper must give the part
            const Fn = hor ? Fz : -Fx, Ft = hor ? Fx : Fz, Nf = Fc - Fn;                     // off the cups / along their faces
            const need = Fn + Math.abs(Ft) / mu;
            s.need = Math.max(0, need); s.S = need > 1e-6 ? clamp(Fc / need, 0, 99) : 99;
            s.Srec = !hor || Math.abs(s.ax) > 1e-9 ? 4 : 2;
            if (CARRY[s.ph] && s.S < s.Smin) { s.Smin = s.S; s.SminAt = NAME[s.ph]; }
            if (Nf <= 0) letGo('the cups were pulled off');
            else if (q.slip || Math.abs(Ft) > mu * Nf) {
              if (q.vsl === 0 && Math.abs(Ft) <= mu * Nf) q.slip = false;
              else {
                q.slip = true;
                const dir = q.vsl !== 0 ? Math.sign(q.vsl) : -Math.sign(Ft);
                const vn = q.vsl + h * (-0.8 * mu * Nf * dir - Ft) / V.m;                   // sliding friction 0.8 μN
                if (q.vsl !== 0 && vn * q.vsl <= 0) { q.vsl = 0; q.slip = Math.abs(Ft) > mu * Nf; }
                else q.vsl = vn;
                q.sl += q.vsl * h;
                s.slipMax = Math.max(s.slipMax, Math.abs(q.sl));
                if (Math.abs(q.sl) > SLIP) letGo('it slid off the cups');
              }
            }
          } else { q.vsl = 0; q.slip = false; }
        }
        if (q.st === 'fall') {
          const x0 = q.x, z0 = q.z;
          q.vz -= G0 * h; q.x += q.vx * h; q.z += q.vz * h;
          if (!onTable(x0) && onTable(q.x) && q.z < 0) { q.x = x0; q.vx = 0; }                // it hits the side of a table
          if (hor) q.ang = clamp(q.ang + (q.vx >= 0 ? 1 : -1) * 2 * h, -0.6, 0.6);
          const floor = onTable(q.x) && z0 >= 0 ? 0 : -FLOOR;
          if (q.z <= floor) { q.z = floor; q.vx = q.vz = 0; q.st = floor === 0 ? 'rest' : 'floor'; q.ang = hor && floor < 0 ? 0.05 : 0; }
        } else if (q.st === 'floor' && !hor && q.ang < 1.5) q.ang = Math.min(1.5, q.ang + (0.3 + 3 * q.ang) * h);   // the panel topples
        if (s.ph === 'up' && q.st === 'held' && s.gz > 0.01) s.flags.stuck = true;
        // the sequence
        if (s.seg && s.seg.t >= segT(s.seg)) enter(NEXT[s.ph]);
        else if (s.ph === 'grip') {
          if (s.sw && s.tGrip == null) s.tGrip = s.tp;
          if ((s.tGrip != null && s.tp >= s.tGrip + 0.05) || s.tp > 4) enter('lift');
        }
        else if (s.ph === 'hold') { if (s.tp >= 0.5) enter('move2'); }
        else if (s.ph === 'release') { if (s.tp >= 0.2) enter('up'); }
        else if (s.ph === 'pause') {
          if (q.st === 'held' && s.tp > 4) letGo('the vacuum leaked away');
          if ((q.st !== 'held' && q.st !== 'fall' && s.tp >= 0.4) || s.tp > 6) finish();
        }
      }
      // the heaviest part at the recommended safety factor, for the worst moment of this motion
      function kWorst() {
        const a = accel(), ax = V.fault === 1 ? 3 * a : a, mu = V.mu;
        return V.ori === 1 ? Math.max(2 * (G0 + a), 4 * (G0 + ax / mu)) : 4 * Math.max((G0 + a) / mu, ax + G0 / mu);
      }
      function phaseText() {
        const up = s.az > 1e-9, dn = s.az < -1e-9;
        let t;
        switch (s.ph) {
          case 'down': t = 'down to the part'; break;
          case 'grip': t = s.sw ? 'switch on: part gripped' : 'vacuum on: evacuating the cups'; break;
          case 'lift': t = up ? 'lifting, accelerating upwards' : dn ? 'lifting, braking' : 'lifting'; break;
          case 'move': case 'move2': t = s.ax > 1e-9 ? 'moving, accelerating' : s.ax < -1e-9 ? 'moving, braking' : 'moving at full speed'; break;
          case 'brake': t = 'EMERGENCY STOP: braking at ' + (3 * accel()).toFixed(1) + ' m/s²'; break;
          case 'hold': t = 'standstill after the emergency stop'; break;
          case 'lower': t = dn ? 'lowering, accelerating downwards' : up ? 'lowering, braking' : 'lowering'; break;
          case 'release': t = s.blow > 0 ? 'vacuum off, blow-off pulse' : V.blow && s.air ? 'vacuum off, part released' : 'vacuum off, no blow-off'; break;
          case 'up': t = 'gripper up'; break;
          case 'back': t = 'back to the pick station'; break;
          default: t = 'the next part';
        }
        return t + (s.air ? '' : ' · compressed air failed');
      }
      function plots(C) {
        const hs = s.hist, xm = Math.max(lastT, s.tc, 1);
        const vl = s.marks.map(m => ({ x: m.x, label: m.label }));
        pF.set({ series: [
          { pts: hs.map(r => [r[0], r[1]]), label: 'cups: n·Δp·A', color: C.accent, width: 2.2 },
          { pts: hs.map(r => [r[0], r[2]]), label: 'needed (S = 1)', color: C.bad, width: 2.2 },
          { pts: hs.map(r => [r[0], r[3]]), label: 'needed × recommended S', color: C.muted, dash: [5, 4] }
        ], x: { label: 'time in the cycle (s)', min: 0, max: xm }, vlines: vl });
        pS.set({ series: [{ pts: hs.map(r => [r[0], r[4]]), label: 'safety factor', color: C.ok, width: 2.4 }],
          x: { label: 'time in the cycle (s)', min: 0, max: xm }, vlines: vl,
          hlines: [{ y: 1, label: 'slips below 1', color: C.bad }, { y: 4, label: '4: friction carries the load' }].concat(V.ori === 1 ? [{ y: 2, label: '2: straight lift' }] : []) });
      }
      restart();
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        const sdt = Math.min(dt, 0.05) * V.slow;
        if (sdt > 0) {
          const nsub = Math.max(1, Math.ceil(sdt / 0.001)), h = sdt / nsub;
          for (let k = 0; k < nsub; k++) step(h);
          const lifted0 = s.part.st === 'held' && s.need != null;
          s.hist.push([s.tc, s.Fc, lifted0 ? s.need : null, lifted0 ? s.need * s.Srec : null, lifted0 ? Math.min(s.S, 10) : null]);
          if (s.hist.length > 3000) s.hist = s.hist.filter((r, i) => i % 2 === 0);
        }
        s.tPlot += dt;
        if (s.tPlot > 0.1) { s.tPlot = 0; plots(C); }
        const q = s.part, hor = V.ori === 1, vset = vSet();
        const FcSet = V.n * V.dp * 1000 * Acup();
        const held = q.st === 'held', lifted = held && s.need != null;
        const sCol = q.st === 'fall' || q.st === 'floor' || (lifted && s.S < 1) ? C.bad : lifted && s.S < s.Srec ? C.warn : C.ok;
        const mm = FcSet / kWorst();
        ro.set('ph', phaseText());
        ro.set('vac', s.v >= 0 ? '−' + (s.v * PATM / 1000).toFixed(1) + ' kPa (' + (s.v * 100).toFixed(0) + ' % vacuum)' : '+' + (-s.v * PATM / 1000).toFixed(1) + ' kPa: blow-off');
        ro.set('sw', (s.sw ? 'on: part gripped' : 'off') + ' (set at −' + (0.75 * V.dp).toFixed(0) + ' kPa)' + (s.tGrip != null ? ', ' + (s.tGrip * 1000).toFixed(0) + ' ms to grip' : '') + (!s.sw && lifted ? ' — stop the move!' : ''));
        ro.set('F', s.Fc.toFixed(0) + ' N now; ' + FcSet.toFixed(0) + ' N at −' + V.dp + ' kPa');
        ro.set('need', lifted ? s.need.toFixed(0) + ' N' : held || q.st === 'rest' ? '— (the part is on a table)' : '— (no part held)');
        ro.set('S', lifted ? (s.S >= 99 ? 'over 99' : s.S.toFixed(2)) + (s.S < 1 ? ' — slipping!' : s.S < s.Srec ? ' — below ' + s.Srec : ' — fine') : '—');
        ro.set('min', Number.isFinite(s.Smin) ? s.Smin.toFixed(2) + ' (' + s.SminAt + ')' : '—');
        ro.set('mmax', mm.toFixed(mm < 10 ? 2 : 1) + ' kg' + (V.fault === 1 ? ', with the emergency stop' : ''));
        ro.set('res', lastRes || 'after the first cycle');
        // ---- the scene: gantry, tables, gripper and part (1 m = 380 px across, 400 px up)
        const c = st.begin();
        grid(st, c, 800, 340);
        const X0 = 80, KX = 380, KZ = 400, TOP = 262, FLY = 322;
        const ZY0 = TOP - (hor ? 0.025 : 0.12) * KZ;
        const sx = x => X0 + KX * x, sy = z => ZY0 - KZ * z;
        c.setLineDash([]);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(4, FLY); c.lineTo(484, FLY); c.stroke();
        c.lineWidth = 1; c.beginPath(); for (let x = 12; x < 484; x += 12) { c.moveTo(x, FLY); c.lineTo(x - 6, FLY + 6); } c.stroke();
        for (const [tx, nm] of [[0, 'pick'], [LX, 'place']]) {
          const x0 = sx(tx - TABLE), x1 = sx(tx + TABLE);
          c.fillStyle = C.surface; c.fillRect(x0, TOP, x1 - x0, 7);
          c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(x0, TOP, x1 - x0, 7);
          c.beginPath(); c.moveTo(x0 + 8, TOP + 7); c.lineTo(x0 + 8, FLY); c.moveTo(x1 - 8, TOP + 7); c.lineTo(x1 - 8, FLY); c.stroke();
          kit.label(c, nm, (x0 + x1) / 2, FLY + 11, { size: 11, color: C.muted, align: 'center' });
        }
        c.fillStyle = C.surface; c.fillRect(4, 34, 480, 9);
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(4, 34, 480, 9); c.strokeRect(4, 43, 8, FLY - 43); c.strokeRect(476, 43, 8, FLY - 43);
        // the gripper: cups shaded by their vacuum (light blue while blowing off)
        const gxp = sx(s.gx), gzp = sy(s.gz), n = V.n, cupH = 10;
        const shade = s.v >= 0 ? (C.dark ? 'rgba(61,214,140,' + (0.08 + 0.75 * s.v) + ')' : 'rgba(18,146,90,' + (0.08 + 0.6 * s.v) + ')') : (C.dark ? 'rgba(156,195,255,.55)' : 'rgba(107,156,224,.5)');
        const cups = [];
        let cx, vlx, vly;
        if (hor) {
          const PW = 96, plateY = gzp - cupH - 8, wcp = clamp(6 + V.d * 0.2, 8, PW / n - 2);
          cx = gxp;
          c.fillStyle = C.surface; c.fillRect(cx - 6, 48, 12, plateY - 48); c.fillRect(cx - 56, plateY, 112, 8);
          c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(cx - 6, 48, 12, plateY - 48); c.strokeRect(cx - 56, plateY, 112, 8);
          for (let i = 0; i < n; i++) {
            const x = cx - PW / 2 + PW * (i + 0.5) / n, y = gzp - cupH;
            c.fillStyle = shade; c.beginPath(); c.moveTo(x - wcp * 0.18, y); c.lineTo(x - wcp / 2, y + cupH); c.lineTo(x + wcp / 2, y + cupH); c.lineTo(x + wcp * 0.18, y); c.closePath(); c.fill();
            cupShape(c, x, y, wcp, cupH, C.text, 1);
            cups.push([x, gzp]);
          }
          vlx = cx + 62; vly = plateY + 4;
        } else {
          const PWv = 84, plateX = gxp - cupH - 8, wcp = clamp(6 + V.d * 0.2, 8, PWv / n - 2);
          cx = plateX + 4;
          c.fillStyle = C.surface; c.fillRect(cx - 6, 48, 12, gzp - 50 - 48); c.fillRect(plateX, gzp - 50, 8, 100);
          c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(cx - 6, 48, 12, gzp - 50 - 48); c.strokeRect(plateX, gzp - 50, 8, 100);
          for (let i = 0; i < n; i++) {
            const y = gzp - PWv / 2 + PWv * (i + 0.5) / n, x = gxp - cupH;
            c.fillStyle = shade; c.beginPath(); c.moveTo(x, y - wcp * 0.18); c.lineTo(x + cupH, y - wcp / 2); c.lineTo(x + cupH, y + wcp / 2); c.lineTo(x, y + wcp * 0.18); c.closePath(); c.fill();
            cupShape(c, x, y, wcp, cupH, C.text, 2);
            cups.push([gxp, y]);
          }
          vlx = cx - 10; vly = gzp - 60;
        }
        c.fillStyle = C.surface; c.fillRect(cx - 22, 28, 44, 20); c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(cx - 22, 28, 44, 20);
        kit.label(c, s.v >= 0 ? '−' + (s.v * PATM / 1000).toFixed(0) + ' kPa' : 'blow-off', vlx, vly, { size: 11.5, color: s.v >= 0 ? S.col('suction') : S.col('exhaust'), weight: 700, align: hor ? 'left' : 'right' });
        if (s.blow > 0) for (const p of cups) {
          if (hor) { kit.arrow(c, p[0] - 3, p[1] + 2, p[0] - 9, p[1] + 10, S.col('exhaust'), 1.5); kit.arrow(c, p[0] + 3, p[1] + 2, p[0] + 9, p[1] + 10, S.col('exhaust'), 1.5); }
          else { kit.arrow(c, p[0] + 2, p[1] - 3, p[0] + 10, p[1] - 9, S.col('exhaust'), 1.5); kit.arrow(c, p[0] + 2, p[1] + 3, p[0] + 10, p[1] + 9, S.col('exhaust'), 1.5); }
        }
        // the acceleration of the gripper
        const am = Math.hypot(s.ax, s.az);
        if (am > 1e-6) {
          const L = Math.min(60, 10 + 2.2 * am), ex = cx + 30 + L * s.ax / am, ey = 64 - L * s.az / am;
          kit.arrow(c, cx + 30, 64, ex, ey, C.warn, 2.2);
          kit.label(c, 'a = ' + am.toFixed(1) + ' m/s²', ex + (s.ax < 0 ? -6 : 6), ey + (s.az > 0 ? -8 : 8), { size: 11, color: C.warn, align: s.ax < 0 ? 'right' : 'left' });
        }
        // the part
        const px = held ? s.gx + (hor ? q.sl : 0) : q.x, pz = held ? s.gz + (hor ? 0 : q.sl) : q.z;
        const rx = sx(px), rz = sy(pz);
        const pfill = C.dark ? 'rgba(160,170,200,.35)' : 'rgba(90,100,130,.3)';
        const pline = q.st === 'fall' || q.st === 'floor' || s.flags.drop ? C.bad : q.slip ? C.warn : C.text;
        c.save(); c.fillStyle = pfill; c.strokeStyle = pline; c.lineWidth = q.st === 'floor' || q.slip ? 2.4 : 1.4;
        if (hor) { c.translate(rx, rz + 5); c.rotate(q.ang); c.fillRect(-57, -5, 114, 10); c.strokeRect(-57, -5, 114, 10); }
        else if (q.st === 'floor') { c.translate(rx + 12, rz + 48); c.rotate(q.ang); c.fillRect(-12, -96, 12, 96); c.strokeRect(-12, -96, 12, 96); }
        else { c.translate(rx, rz); c.fillRect(0, -48, 12, 96); c.strokeRect(0, -48, 12, 96); }
        c.restore();
        kit.label(c, V.m.toPrecision(3) + ' kg', hor ? rx + 62 : rx + 16, hor ? rz + 5 : rz - 54, { size: 11, color: C.muted });
        // forces on the lifted part: the atmosphere pushes it on at each cup; the load is its weight plus its inertia
        if (lifted && s.gz > 0.06) {
          const room = hor ? KZ * s.gz - 16 : 70, Fref = Math.max(FcSet, 1);
          const la = Math.min(room, 8 + 26 * clamp(s.Fc / Fref, 0, 1.2));
          if (s.Fc > 0) for (const p of cups) {
            if (hor) { const xa = Math.abs(p[0] - rx) < 8 ? p[0] + 9 : p[0]; kit.arrow(c, xa, rz + 12 + la, xa, rz + 12, C.accent, 1.8); }
            else kit.arrow(c, rx + 14 + la, p[1], rx + 14, p[1], C.accent, 1.8);
          }
          const lx = -s.ax, lz = s.az + G0, lm = Math.hypot(lx, lz), Fl = V.m * lm;
          if (lm > 1e-6) {
            const L = Math.min(hor ? room : 80, 14 + 50 * clamp(Fl / Fref, 0, 1.4)), x0 = hor ? rx : rx + 6, y0 = hor ? rz + 10 : rz;
            const ex = x0 + L * lx / lm, ey = y0 + L * lz / lm;
            kit.arrow(c, x0, y0, ex, ey, sCol, 2.6);
            kit.label(c, 'load ' + Fl.toFixed(0) + ' N', ex + (lx >= 0 ? 6 : -6), ey + 4, { size: 11, color: sCol, align: lx >= 0 ? 'left' : 'right', weight: 600 });
          }
        }
        // the message of the moment
        let msg, mcol;
        if (q.st === 'fall') { msg = 'THE PART IS FALLING'; mcol = C.bad; }
        else if (s.flags.drop) { msg = 'PART DROPPED — ' + s.flags.drop; mcol = C.bad; }
        else if (lifted && s.S < 1) { msg = 'SLIPPING: safety factor ' + s.S.toFixed(2) + ' — below 1'; mcol = C.bad; }
        else if (lifted && s.S < s.Srec) { msg = 'safety factor ' + s.S.toFixed(2) + ' — below the recommended ' + s.Srec; mcol = C.warn; }
        else if (s.flags.notLifted && q.st === 'rest' && Math.abs(q.x) < TABLE) { msg = 'NOT LIFTED: the cups cannot hold it'; mcol = C.bad; }
        else { msg = phaseText(); mcol = s.air ? C.text : C.bad; }
        kit.label(c, msg, 8, 15, { size: 13, color: mcol, weight: 700 });
        // ---- the force bars
        const base = 290, hmax = 200, fm = Math.max(FcSet, V.m * kWorst(), 1) * 1.08;
        const bar = (x, f, col, name, sub) => {
          const hh = clamp(hmax * f / fm, 0, hmax + 8);
          c.fillStyle = col; c.fillRect(x, base - hh, 36, hh);
          kit.label(c, f.toFixed(0) + ' N', x + 18, base - hh - 9, { size: 11, color: C.text, align: 'center', weight: 600 });
          kit.label(c, name, x + 18, base + 12, { size: 11, color: C.text, align: 'center' });
          kit.label(c, sub, x + 18, base + 25, { size: 10.5, color: C.muted, align: 'center' });
        };
        bar(496, Math.max(0, s.Fc), C.accent, 'cups', 'n·Δp·A');
        bar(542, lifted ? s.need : 0, lifted ? sCol : C.muted, 'needed', 'S = 1');
        if (lifted) {
          const yr = base - clamp(hmax * s.need * s.Srec / fm, 0, hmax + 8);
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(538, yr); c.lineTo(582, yr); c.stroke(); c.setLineDash([]);
          kit.label(c, '× ' + s.Srec, 584, yr, { size: 10.5, color: C.muted });
        }
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(490, base); c.lineTo(584, base); c.stroke();
        kit.label(c, 'S = ' + (lifted ? (s.S >= 99 ? 'over 99' : s.S.toFixed(2)) : '—'), 540, 20, { size: 17, color: lifted ? sCol : C.muted, weight: 700, align: 'center' });
        kit.label(c, lifted ? 'recommended ' + s.Srec + ' or more' : q.st === 'fall' ? 'falling' : q.st === 'floor' ? 'dropped' : held || q.st === 'rest' ? 'part on a table' : '', 540, 40, { size: 11, color: C.muted, align: 'center' });
        // ---- the circuit, ISO 1219
        const run = s.on && s.air, nrv = V.fault !== 3, blowing = s.blow > 0 && s.air;
        const vline = s.v > 0.02 ? 'suction' : blowing ? 'air' : 'idle';
        const evac = run && s.v < 0.97 * vset && (held || s.ph === 'grip');
        const back = !s.air && !nrv && s.v > 0.02;
        ph.s += dt * 45 * (run ? 1 : 0); ph.v += dt * 40 * (evac || back ? 1 : 0); ph.b += dt * 60 * (blowing ? 1 : 0);
        kit.label(c, 'circuit (ISO 1219), one cup shown', 705, 15, { size: 11, color: C.muted, align: 'center' });
        const src = S.source(c, 660, 322, { pneumatic: true });
        const vOn = S.valve(c, 660, 200, { spec: '2/2 NC', state: run ? 0 : 1, left: 'solenoid', right: 'spring', s: 24, pneumatic: true, labels: true });
        const vBl = S.valve(c, 755, 250, { spec: '2/2 NC', state: blowing ? 0 : 1, left: 'solenoid', right: 'spring', s: 22, pneumatic: true, labels: true });
        kit.label(c, 'vacuum on', vOn.xr + 4, 200, { size: 10.5, color: run ? C.text : C.muted });
        kit.label(c, 'blow-off', 748, 281, { size: 10.5, color: blowing ? C.text : C.muted, align: 'right' });
        S.line(c, [src.P, [660, 290], vOn.P], { state: s.air ? 'air' : 'idle' });
        S.line(c, [[660, 290], [755, 290], vBl.P], { state: s.air ? 'air' : 'idle' }); S.junction(c, 660, 290);
        kit.label(c, s.air ? '5 bar' : 'no air!', 674, 322, { size: 10.5, color: s.air ? C.muted : C.bad, weight: s.air ? 600 : 700 });
        const e = S.ejector(c, 715, 64, {});
        S.line(c, [vOn.A, [660, 64], e.P], { state: run ? 'air' : 'idle' });
        if (run) { S.flow(c, [src.P, [660, 290], vOn.P, vOn.A, [660, 64], e.P], ph.s, { color: S.col('air') }); S.flow(c, [[763, 64], [798, 64]], ph.s * 1.4, { color: S.col('exhaust') }); }
        if (nrv) { const chk = S.check(c, 715, 118, { open: evac }); S.line(c, [e.V, chk.out], { state: run ? vline : 'idle' }); S.line(c, [chk.in, [715, 160]], { state: vline }); }
        else S.line(c, [e.V, [715, 160]], { state: vline });
        S.line(c, [[715, 160], [785, 160], [785, 195]], { state: vline });
        const cp = S.cup(c, 785, 205, {});
        kit.label(c, 'cup', 785, cp.face + 11, { size: 10.5, color: C.muted, align: 'center' });
        const th = S.throttle(c, 755, 196, {});
        S.line(c, [vBl.A, th.a], { state: blowing ? 'air' : 'idle' }); S.line(c, [th.b, [755, 160]], { state: blowing ? 'air' : vline }); S.junction(c, 755, 160);
        const sw = vacSwitch(c, S, C, 740, 118, s.sw);
        S.line(c, [sw.P, [740, 160]], { state: vline }); S.junction(c, 740, 160);
        kit.label(c, 'vacuum switch', 724, 92, { size: 10.5, color: s.sw ? C.ok : C.muted });
        if (evac) S.flow(c, [[785, 195], [785, 160], [715, 160], [715, 87]], ph.v, { color: S.col('suction') });
        if (back) S.flow(c, [[715, 87], [715, 160], [785, 160], [785, 195]], ph.v, { color: S.col('exhaust') });
        if (blowing) S.flow(c, [[660, 290], [755, 290], vBl.P, vBl.A, th.a, th.b, [755, 160], [785, 160], [785, 195]], ph.b, { color: S.col('air') });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
