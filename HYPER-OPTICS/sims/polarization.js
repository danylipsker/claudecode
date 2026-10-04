/* HYPER-OPTICS · sims/polarization.js — simulations of the topic "Polarization".
 *   po-field-vector     the electric field of a wave in space and head-on: linear, circular, elliptical, unpolarized
 *   po-malus            polarizers in a row: Malus's law, the quality of a polarizer, the third polarizer between crossed ones
 *   po-reflection       reflection at a surface: s and p reflectances, Brewster's angle, the glare filter
 *   po-sky              the polarization pattern of the clear sky and what a polarizing filter does to it
 *   po-birefringence    a calcite or quartz plate: ordinary and extraordinary ray, walk-off, the double image
 *   po-waveplate        a retarder: thickness, wavelength and axis against the polarization that comes out
 *   po-bench            a Jones-calculus bench: up to three elements in a row, the state after each
 *   po-poincare         the Poincaré sphere: Stokes vectors, Mueller matrices, partial polarization
 *   po-rotation         sugar solution, quartz and a Faraday rotator: turning the plane of polarization
 *   po-twisted-nematic  a twisted-nematic liquid-crystal cell between polarizers, with a voltage
 *   po-practice         glare and sunglasses, a phone screen through a polarizer, linear and circular 3-D glasses
 *   po-photoelastic     stressed plastic and glass between polarizers: isochromatic and isoclinic fringes
 * Every number comes from kit.optics (the Jones, Stokes and Mueller engine, Fresnel's equations, the glass table);
 * the drawing comes from kit.osym. Geometry the engine does not cover (the walk-off direction in a crystal, the
 * stress of a loaded disc) is computed here.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const mod = (x, m) => ((x % m) + m) % m;
  const pct = x => (100 * x).toFixed(x < 0.1 ? 2 : 1) + ' %';

  // A Jones vector from an amplitude angle a (Ex = cos a, Ey = sin a) and a phase lag d of y behind x:
  // Ey = sin a · e^(−i d). With the wave Re[E e^(i(kz − ωt))], d = +90° at a = 45° is right-circular light.
  const jones = (a, d) => [[Math.cos(a), 0], [Math.sin(a) * Math.cos(d), -Math.sin(a) * Math.sin(d)]];
  // the real field [Ex, Ey] of a Jones vector at the wave phase ph = kz − ωt
  const field = (J, ph) => [J[0][0] * Math.cos(ph) - J[0][1] * Math.sin(ph), J[1][0] * Math.cos(ph) - J[1][1] * Math.sin(ph)];
  // a partial polarizer: transmission axis at ang, amplitude leak 1/√er in the crossed direction (real Jones matrix)
  const pp = (ang, er) => {
    const c = Math.cos(ang), s = Math.sin(ang), e = 1 / Math.sqrt(er || 1e12);
    const m = c * c + e * s * s, n = c * s * (1 - e), q = s * s + e * c * c;
    return [[[m, 0], [n, 0]], [[n, 0], [q, 0]]];
  };
  const cstr = (z, d) => {
    d = d == null ? 2 : d;
    const re = Math.abs(z[0]) < 5e-4 ? 0 : z[0], im = Math.abs(z[1]) < 5e-4 ? 0 : z[1];
    if (im === 0) return re.toFixed(d).replace(/^-0\.0+$/, '0.00');
    if (re === 0) return im.toFixed(d) + 'i';
    return re.toFixed(d) + (im < 0 ? ' − ' : ' + ') + Math.abs(im).toFixed(d) + 'i';
  };
  // a double-headed arrow: the direction of a linear vibration, at ang from the x axis (counter-clockwise)
  function dbl(c, kit, x, y, ang, len, color, w) {
    const dx = Math.cos(ang) * len, dy = -Math.sin(ang) * len;
    kit.arrow(c, x, y, x + dx, y + dy, color, w || 2.2, 7);
    kit.arrow(c, x, y, x - dx, y - dy, color, w || 2.2, 7);
  }
  // the polarization ellipse of a Jones vector, seen head-on (looking towards the source): x to the right, y up
  function dial(c, kit, C, cx, cy, R, J, o) {
    o = o || {};
    c.save();
    c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
    c.setLineDash([3, 4]); c.beginPath(); c.moveTo(cx - R, cy); c.lineTo(cx + R, cy); c.moveTo(cx, cy - R); c.lineTo(cx, cy + R); c.stroke(); c.setLineDash([]);
    if (J) {
      const q = R * 0.9, pts = [];
      for (let i = 0; i <= 72; i++) { const e = field(J, -TAU * i / 72); pts.push([cx + q * e[0], cy - q * e[1]]); }
      c.strokeStyle = o.color || C.accent; c.lineWidth = o.width || 2.2; c.beginPath();
      pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
      if (o.t != null) {
        const a = field(J, -o.t), b = field(J, -o.t - 0.12);
        kit.arrow(c, cx + q * b[0], cy - q * b[1], cx + q * a[0], cy - q * a[1], o.tip || C.warn, 2.4, 8);
        kit.dot(c, cx + q * a[0], cy - q * a[1], 3.6, o.tip || C.warn);
      }
    }
    c.restore();
    if (o.label) kit.label(c, o.label, cx, cy + R + 13, { align: 'center', color: C.muted, size: 11.5 });
  }
  // a glyph for the polarization state of one ray: s as a circle with a dot (out of the page), p as a double arrow in the plane
  // (dirx, diry: the ray's direction on the canvas). Is and Ip are the intensities of the two components; the glyph shows their ratio.
  function glyph(c, kit, C, x, y, dirx, diry, Is, Ip) {
    const top = Math.max(Is, Ip, 1e-12), rs = 12 * Math.sqrt(Is / top), rp = 20 * Math.sqrt(Ip / top);
    c.save();
    if (Is > 1e-5) { c.strokeStyle = C.accent; c.fillStyle = C.accent; c.lineWidth = 1.8; c.beginPath(); c.arc(x, y, Math.max(1.5, rs), 0, TAU); c.stroke(); c.beginPath(); c.arc(x, y, Math.max(1.4, Math.min(2.6, rs * 0.25)), 0, TAU); c.fill(); }
    if (Ip > 1e-5 && rp > 1) { const px = -diry, py = dirx; kit.arrow(c, x, y, x + px * rp, y + py * rp, C.warn, 2, 7); kit.arrow(c, x, y, x - px * rp, y - py * rp, C.warn, 2, 7); }
    c.restore();
  }
  // the three-dimensional picture of a wave: z to the right, y up, x into the page (a right-handed set)
  const proj3 = (x0, yc, k, z, ex, ey) => [x0 + z + ex * k * 0.5, yc - ey * k - ex * k * 0.34];

  /* ================================================================ the electric field of light */
  Hyper.sim('po-field-vector', {
    title: 'The electric field of light: linear, circular, elliptical, unpolarized',
    blurb: `A light wave travelling to the right. The electric field at each point along the beam is a little arrow; the line joining the tips is the shape of the wave in space. On the right the same wave is seen **head-on**, as if you looked back towards the source: the amber dot is the tip of the field at one place, and it traces the *polarization ellipse*.

**Try this**
- Press **Linear**: the tip moves back and forth on a straight line. The wave in space is a plane sine wave, vibrating in one plane. Change α and the plane tilts.
- Press **Right circular**: the tip goes round a circle *clockwise as seen head-on*, and in space the tips form a right-handed corkscrew. **Left circular** reverses both.
- Start from circular and shrink the phase lag δ from 90° towards 0°: the circle squashes into an ellipse and then into a line at 0°. Elliptical light is the general case.
- Press **Unpolarized** or pull the *degree of polarization* below 1: the field direction wanders from one cycle to the next, and no ellipse stays put. Sunlight and lamplight are like this.

Convention: the wave is $\\mathrm{Re}[\\mathbf{E}\\,e^{i(kz-\\omega t)}]$ and the phase lag δ is that of y behind x. The picture is schematic: a real wavelength is about 1 000 000 times smaller than the one drawn, and the "wandering" of partially polarized light is slowed by far more than that.`,
    mount(box, kit, params) {
      const O = kit.optics, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 330 });
      const PRE = { H: [0, 0, 1], V: [90, 0, 1], D: [45, 0, 1], R: [45, 90, 1], L: [45, -90, 1], E: [30, 60, 1], U: [45, 0, 0] };
      const init = PRE[params.state] || PRE.D;
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Balance of x and y (α: 0° all x, 90° all y)', min: 0, max: 90, step: 1, value: params.a != null ? params.a : init[0], unit: '°' },
        { id: 'd', label: 'Phase lag of y behind x (δ)', min: -180, max: 180, step: 5, value: params.d != null ? params.d : init[1], unit: '°' },
        { id: 'p', label: 'Degree of polarization', min: 0, max: 1, step: 0.05, value: params.p != null ? params.p : init[2] },
        { id: 'speed', label: 'Speed', min: 0, max: 3, step: 0.1, value: 1 },
        { type: 'buttons', items: [{ id: 'H', label: 'Horizontal' }, { id: 'V', label: 'Vertical' }, { id: 'D', label: 'Linear 45°' }, { id: 'R', label: 'Right circular', primary: true }, { id: 'L', label: 'Left circular' }, { id: 'E', label: 'Elliptical' }, { id: 'U', label: 'Unpolarized' }] }
      ], id => { const q = PRE[id]; if (q) { ctl.set('a', q[0]); ctl.set('d', q[1]); ctl.set('p', q[2]); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kind', 'The light is'], ['hand', 'Handedness'], ['az', 'Long axis of the ellipse'], ['ratio', 'Axis ratio (short ÷ long)'], ['S', 'Stokes vector (S₀ S₁ S₂ S₃)'], ['dop', 'Degree of polarization']]);
      // slowly varying random envelopes for partially polarized light: four real components, each a sum of slow cosines
      const FQ = [0.071, 0.113, 0.167, 0.241], PHS = [[0.3, 2.1, 4.4, 5.7], [1.7, 3.6, 0.9, 2.6], [5.1, 0.4, 3.1, 1.2], [2.8, 4.9, 1.5, 3.9]];
      const nz = (u, ch) => { let s = 0; for (let k = 0; k < 4; k++) s += 0.354 * Math.cos(FQ[k] * u + PHS[ch][k]); return s; };
      let ph = 0;
      const loop = kit.loop(dt => {
        ph += dt * 3 * V.speed;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const J0 = jones(V.a * D2R, V.d * D2R), sp = Math.sqrt(V.p), sn = Math.sqrt(1 - V.p);
        const Jat = u => [[sp * J0[0][0] + sn * nz(u, 0), sp * J0[0][1] + sn * nz(u, 1)], [sp * J0[1][0] + sn * nz(u, 2), sp * J0[1][1] + sn * nz(u, 3)]];
        // ----- the wave in space
        const x0 = 28, x1 = W * 0.57, yc = Hh * 0.52, kE = Math.min(Hh * 0.27, 92), lamPx = 88, kw = TAU / lamPx, n = 130;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.setLineDash([10, 3, 2, 3]); c.beginPath(); c.moveTo(x0, yc); c.lineTo(x1, yc); c.stroke(); c.setLineDash([]);
        const tips = [];
        for (let i = 0; i <= n; i++) {
          const z = (x1 - x0) * i / n, u = ph - kw * z, e = field(Jat(u), -u);
          const pt = proj3(x0, yc, kE, z, e[0], e[1]);
          tips.push(pt);
          if (i % 5 === 2) { c.strokeStyle = C.faint; c.lineWidth = 1.1; c.beginPath(); c.moveTo(x0 + z, yc); c.lineTo(pt[0], pt[1]); c.stroke(); }
        }
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.lineJoin = 'round'; c.beginPath(); tips.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
        kit.dot(c, tips[0][0], tips[0][1], 4, C.warn);
        // the axes
        const ax = 40, ay = Hh - 34;
        kit.arrow(c, ax, ay, ax + 46, ay, C.muted, 1.4, 7); kit.arrow(c, ax, ay, ax, ay - 40, C.muted, 1.4, 7); kit.arrow(c, ax, ay, ax + 20, ay - 14, C.muted, 1.4, 7);
        kit.label(c, 'z  (travel)', ax + 50, ay, { color: C.muted, size: 11 }); kit.label(c, 'y', ax - 3, ay - 48, { color: C.muted, size: 11, align: 'center' }); kit.label(c, 'x  (into the page)', ax + 24, ay - 20, { color: C.muted, size: 11 });
        kit.label(c, 'the wave in space, now', x0, 16, { color: C.muted, size: 11.5 });
        // ----- head-on
        const cx2 = W * 0.795, cy2 = Hh * 0.47, R2 = Math.min(W * 0.17, Hh * 0.33);
        dial(c, kit, C, cx2, cy2, R2, V.p > 0.02 ? [[J0[0][0] * sp, J0[0][1] * sp], [J0[1][0] * sp, J0[1][1] * sp]] : null, { color: C.accent, width: 1.2, label: 'looking back towards the source' });
        // the trail of the tip: the last two cycles
        const q = R2 * 0.9, steps = 60;
        let last = null;
        for (let i = 0; i <= steps; i++) {
          const u = ph - TAU * 2.1 * (1 - i / steps), e = field(Jat(u), -u), pt = [cx2 + q * e[0], cy2 - q * e[1]];
          if (last) { c.strokeStyle = C.warn; c.globalAlpha = Math.pow(i / steps, 1.6) * 0.95; c.lineWidth = 2; c.beginPath(); c.moveTo(last[0], last[1]); c.lineTo(pt[0], pt[1]); c.stroke(); }
          last = pt;
        }
        c.globalAlpha = 1;
        kit.dot(c, last[0], last[1], 5, C.warn, C.text);
        kit.label(c, 'x', cx2 + R2 + 8, cy2, { color: C.faint, size: 11 }); kit.label(c, 'y', cx2, cy2 - R2 - 9, { color: C.faint, size: 11, align: 'center' });
        // ----- the numbers
        const el = P.ellipse(J0), S = P.stokes(J0);
        const S1 = S[1] * V.p, S2 = S[2] * V.p, S3 = S[3] * V.p;
        const tchi = Math.abs(Math.tan(el.ellipticity)), azDeg = mod(el.azimuth * R2D + 90, 180) - 90;
        const base = tchi < 0.01 ? 'linearly' : tchi > 0.99 ? 'circularly' : 'elliptically';
        const kind = V.p < 0.02 ? 'unpolarized' : V.p < 0.98 ? 'partially ' + base + ' polarized (' + Math.round(V.p * 100) + ' %)' : base + ' polarized';
        ro.set('kind', kind);
        ro.set('hand', V.p < 0.02 ? 'none' : tchi < 0.01 ? 'none (a straight line)' : el.handed === 'right' ? 'right (clockwise, head-on)' : 'left (counter-clockwise, head-on)');
        ro.set('az', V.p < 0.02 ? '—' : tchi > 0.99 ? 'any (a circle)' : azDeg.toFixed(0) + '° from x');
        ro.set('ratio', V.p < 0.02 ? '—' : tchi.toFixed(2));
        ro.set('S', '1   ' + S1.toFixed(2) + '   ' + S2.toFixed(2) + '   ' + S3.toFixed(2));
        ro.set('dop', V.p.toFixed(2));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ polarizers in a row */
  Hyper.sim('po-malus', {
    title: 'Polarizers in a row: Malus\'s law and the third polarizer',
    blurb: `Light from the left meets up to three polarizers in a row. The beam is drawn as bright as it really is; the dials underneath show the direction of the electric field after each element (a double arrow; its length is the amplitude). Drag a polarizer to turn it, or use the sliders. The graph gives the light that reaches the screen as the *last* polarizer (or the middle one) is turned through 180°.

**Try this**
- Unpolarized source, polarizer 1 at 0°, analyzer at 0°: half the light gets through (the first polarizer takes half) and turning the analyzer gives the $\\cos^2\\theta$ curve of **Malus's law**, from 0.5 down to zero at 90°.
- Press **Crossed**: no light. Now tick *Insert a middle polarizer* and set it to 45°: a quarter of the polarized light (one eighth of the source) comes back. Slide the middle polarizer from 0° to 90° and the graph shows the best angle.
- Change the quality to *Cheap film, 20 : 1* with the polarizers crossed: a little light leaks, 1/20 of the ideal. A polarizer's **extinction ratio** says how dark "crossed" really is.
- Use a *linearly polarized* source (a laser, an LCD screen) and turn polarizer 1 to the source's angle: nothing is lost in it.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250, maxH: 330 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'angle of the turned polarizer (degrees)', min: 0, max: 180 }, y: { label: 'light on the screen (I / I₀)', min: 0, max: 1 }, legend: true, series: [] }, 220);
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'The source', options: [['Unpolarized (the Sun, a lamp)', 'u'], ['Linearly polarized (a laser, a screen)', 'l']], value: params.src || 'u' },
        { id: 'a0', label: 'Direction of the source\'s polarization', min: 0, max: 180, step: 1, value: params.a0 != null ? params.a0 : 0, unit: '°' },
        { id: 'a1', label: 'Polarizer 1', min: 0, max: 180, step: 1, value: params.a1 != null ? params.a1 : 0, unit: '°' },
        { id: 'use2', type: 'check', label: 'Insert a middle polarizer (2)', value: !!params.use2 },
        { id: 'a2', label: 'Polarizer 2 (middle)', min: 0, max: 180, step: 1, value: params.a2 != null ? params.a2 : 45, unit: '°' },
        { id: 'a3', label: 'Analyzer (last)', min: 0, max: 180, step: 1, value: params.a3 != null ? params.a3 : 90, unit: '°' },
        { id: 'er', type: 'select', label: 'Quality of the polarizers', options: [['Ideal', 1e12], ['Good sheet, 1000 : 1', 1000], ['Cheap film, 20 : 1', 20]], value: params.er || 1e12 },
        { id: 'xv', type: 'select', label: 'Graph against', options: [['the analyzer angle', 'a3'], ['the middle polarizer angle', 'a2']], value: params.xv || 'a3' },
        { type: 'buttons', items: [{ id: 'crossed', label: 'Crossed' }, { id: 'three', label: 'Crossed, with a 45° one between', primary: true }, { id: 'parallel', label: 'Parallel' }] }
      ], id => {
        if (id === 'crossed') { ctl.set('a1', 0); ctl.set('a3', 90); ctl.set('use2', false); }
        if (id === 'three') { ctl.set('a1', 0); ctl.set('a2', 45); ctl.set('a3', 90); ctl.set('use2', true); }
        if (id === 'parallel') { ctl.set('a1', 0); ctl.set('a3', 0); ctl.set('use2', false); }
        sync(); loop.once();
      });
      const V = ctl.values;
      const sync = () => { ctl.show('a0', V.src === 'l'); ctl.show('a2', V.use2); };
      const ro = kit.readout(box.side, [['i1', 'After polarizer 1'], ['i2', 'After polarizer 2'], ['out', 'Reaching the screen'], ['law', 'Malus: cos² of the last angle']]);
      // light after each element, as a fraction of the source's intensity
      const stages = (mats) => {
        if (V.src === 'u') { const h = trace(P.vec('H'), mats), v = trace(P.vec('V'), mats); return h.map((x, i) => (x + v[i]) / 2); }
        return trace(P.vec(V.a0 * D2R), mats);
      };
      const trace = (v, mats) => { const out = [P.intensity(v)]; let x = v; for (const m of mats) { x = P.apply(m, x); out.push(P.intensity(x)); } return out; };
      const mats = (o) => { const L = [pp(o.a1 * D2R, V.er)]; if (V.use2) L.push(pp(o.a2 * D2R, V.er)); L.push(pp(o.a3 * D2R, V.er)); return L; };
      const xs = [0.1, 0.3, 0.5, 0.7, 0.9];
      let hit = null;
      kit.drag(st, {
        hover: true,
        hit: p => {
          const W = st.W, by = st.H * 0.3;
          const cand = [['a1', xs[1] * W], ['a2', xs[2] * W], ['a3', xs[3] * W]];
          for (const [id, x] of cand) { if (id === 'a2' && !V.use2) continue; if (Math.abs(p.x - x) < 24 && Math.abs(p.y - by) < 44) return id; }
          return null;
        },
        move: (id, p) => {
          const x = id === 'a1' ? xs[1] * st.W : id === 'a2' ? xs[2] * st.W : xs[3] * st.W, by = st.H * 0.3;
          const a = mod(Math.atan2(-(p.y - by), p.x - x) * R2D, 180);
          ctl.set(id, Math.round(a)); loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, by = Hh * 0.3;
        const m = mats(V), I = stages(m);
        // the beam, element by element
        const px = xs.map(f => f * W);
        const seg = (xa, xb, Iv) => { c.fillStyle = S.nm(585, 0.1 + 0.9 * clamp(Iv, 0, 1)); c.fillRect(xa, by - 7, xb - xa, 14); };
        const stop = [px[1], V.use2 ? px[2] : null, px[3]].filter(x => x != null);
        let xa = px[0] + 14;
        stop.forEach((x, i) => { seg(xa, x, I[i]); xa = x; });
        seg(xa, px[4], I[I.length - 1]);
        S.source(c, px[0], by, { kind: V.src === 'u' ? 'sun' : 'laser', size: 13, color: C.warn });
        c.fillStyle = '#05060d'; c.fillRect(px[4], by - 36, 8, 72);
        kit.label(c, 'screen', px[4] + 4, by - 44, { align: 'center', color: C.muted, size: 11.5 });
        const els = [['Polarizer 1', V.a1, px[1], 0], V.use2 ? ['Polarizer 2', V.a2, px[2], 0] : null, ['Analyzer', V.a3, px[3], 0]].filter(Boolean);
        els.forEach(e => S.polarizer(c, e[2], by, 32, Math.PI / 2 - e[1] * D2R, { label: e[0] + '  ' + e[1] + '°' }));
        // the dials: the field before the first polarizer, and after each element
        const dy = Hh * 0.76, R = Math.min(30, W * 0.045);
        const dx = [(px[0] + px[1]) / 2].concat(els.map((e, i) => (e[2] + (i + 1 < els.length ? els[i + 1][2] : px[4])) / 2));
        dx.forEach((x, i) => {
          dial(c, kit, C, x, dy, R, null, { label: i === 0 ? 'the source' : 'after ' + els[i - 1][0].toLowerCase() });
          if (i === 0 && V.src === 'u') { for (let k = 0; k < 9; k++) dbl(c, kit, x, dy, k * Math.PI / 9, R * 0.8, C.faint, 1.2); }
          else {
            const ang = i === 0 ? V.a0 * D2R : els[i - 1][1] * D2R, amp = Math.sqrt(clamp(I[i], 0, 1));
            if (amp > 0.01) dbl(c, kit, x, dy, ang, R * 0.9 * amp, C.accent, 2.4);
          }
          kit.label(c, 'I = ' + I[i].toFixed(3), x, dy + R + 29, { align: 'center', color: C.text, size: 11.5, weight: 650 });
        });
        // the graph: the light reaching the screen against the angle of the polarizer being turned
        const key = [V.src, V.a0, V.a1, V.use2, V.a2, V.a3, V.er, V.xv].join('|');
        if (key !== loop.key) {
          loop.key = key;
          const pts = [], ideal = [];
          for (let a = 0; a <= 180; a += 2) { const o = { a1: V.a1, a2: V.a2, a3: V.a3 }; o[V.xv] = a; const s = stages(mats(o)); pts.push([a, s[s.length - 1]]); }
          if (V.xv === 'a3' && !V.use2) {
            const first = stages(mats({ a1: V.a1, a2: V.a2, a3: V.a1 }));
            const top = first[first.length - 1];
            for (let a = 0; a <= 180; a += 2) ideal.push([a, top * Math.pow(Math.cos((a - V.a1) * D2R), 2)]);
          }
          const series = [{ pts, label: 'light reaching the screen', color: C.series[0], width: 2.6 }];
          if (ideal.length) series.push({ pts: ideal, label: 'ideal Malus curve, I₁ cos²θ', color: C.muted, dash: [5, 4], width: 1.4 });
          plot.set({ series, vlines: [{ x: V[V.xv], label: V[V.xv] + '°' }] });
        }
        const last = els[els.length - 1], prev = els.length > 1 ? els[els.length - 2][1] : (V.src === 'l' ? V.a0 : null);
        ro.set('i1', I[1].toFixed(4));
        ro.set('i2', V.use2 ? I[2].toFixed(4) : '(not in the beam)');
        ro.set('out', I[I.length - 1].toFixed(4) + '   (' + pct(I[I.length - 1]) + ')');
        ro.set('law', prev == null ? 'the first polarizer sees unpolarized light: ½' : Math.pow(Math.cos((last[1] - prev) * D2R), 2).toFixed(4) + '   (θ = ' + Math.abs(mod(last[1] - prev + 90, 180) - 90).toFixed(0) + '°)');
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });

  /* ================================================================ reflection and the glare filter */
  Hyper.sim('po-reflection', {
    title: 'Reflection polarizes: s and p, Brewster\'s angle and the glare filter',
    blurb: `Unpolarized light falls on a transparent surface. Its field is split into **s** (across the plane of the drawing, shown as a circle with a dot: pointing out of the page) and **p** (in the plane of the drawing, a double arrow). Each ray carries a small glyph that shows its own polarization — how much s, how much p — while the brightness of the ray shows how much light it carries. The graph gives the reflectances against the angle of incidence.

**Try this**
- Start at 0°: both components reflect equally (4 % for glass) and the reflected light is unpolarized. Open the angle: the p arrow on the reflected ray shrinks while s grows.
- At **Brewster's angle** the p arrow vanishes from the reflected ray, the reflected and refracted rays stand exactly at 90° (the mark appears) and the reflected light is purely s-polarized.
- Tick *Polarizing filter in the reflected beam* and turn its axis from 0° (along the surface: passes s) to 90° (in the plane of incidence: passes p). At Brewster's angle with the axis at 90° the glare is gone — the principle of polarized sunglasses and the photographer's filter.
- Choose *Diamond*: Brewster's angle is 67.5°; for water it is 53.1°.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300, maxH: 400 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'angle of incidence (degrees)', min: 0, max: 90 }, y: { label: 'reflected light (%)', min: 0, max: 100 }, legend: true, series: [] }, 220);
      const MEDIA = [['Water', 'water'], ['Acrylic (PMMA)', 'PMMA'], ['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Diamond', 'diamond']];
      const nameOf = id => MEDIA.find(m => m[1] === id)[0];
      const ctl = kit.controls(box.side, [
        { id: 'angle', label: 'Angle of incidence θ₁', min: 0, max: 89, step: 0.5, value: params.angle != null ? params.angle : 40, unit: '°' },
        { id: 'mat', type: 'select', label: 'The surface is', options: MEDIA, value: params.mat || 'N-BK7' },
        { id: 'filt', type: 'check', label: 'Polarizing filter in the reflected beam', value: !!params.filt },
        { id: 'beta', label: 'Filter axis: 0° along the surface, 90° in the plane of incidence', min: 0, max: 90, step: 1, value: params.beta != null ? params.beta : 90, unit: '°' },
        { type: 'buttons', items: [{ id: 'brew', label: 'Go to Brewster\'s angle', primary: true }] }
      ], id => { if (id === 'brew') ctl.set('angle', Math.round(O.deg(O.brewster(1, O.index(V.mat, 550))) * 2) / 2); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Refractive index'], ['brew', 'Brewster\'s angle'], ['rs', 'Reflected: s component'], ['rp', 'Reflected: p component'], ['dop', 'Reflected light is polarized to'], ['flt', 'Glare passing the filter']]);
      kit.drag(st, { hover: true, hit: p => p.y < st.H / 2 - 6 ? 'ray' : null, move: (w, p) => { ctl.set('angle', clamp(Math.round(Math.atan2(st.W * 0.4 - p.x, st.H / 2 - p.y) * R2D * 2) / 2, 0, 89)); loop.once(); } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cx = W * 0.4, cy = Hh * 0.5, L = Math.min(W * 0.36, Hh * 0.46);
        const n2 = O.index(V.mat, 550), t1 = V.angle * D2R, f = O.fresnel(1, n2, t1), tb = O.brewster(1, n2);
        c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n2 - 1))); c.fillRect(0, cy, W, Hh - cy);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke();
        S.normal(c, cx, cy, Math.PI / 2, L * 0.96);
        kit.label(c, 'air  n = 1', 12, 18, { color: C.muted }); kit.label(c, nameOf(V.mat) + '  n = ' + n2.toFixed(3), 12, Hh - 16, { color: C.muted });
        const sx = Math.sin(t1), cs = Math.cos(t1), sr = Math.sin(f.t2), cr = Math.cos(f.t2);
        const Rt = 0.5 * (f.Rs + f.Rp), Tt = 1 - Rt;
        const beta = V.beta * D2R, passF = f.Rs + f.Rp > 1e-12 ? (f.Rs * Math.pow(Math.cos(beta), 2) + f.Rp * Math.pow(Math.sin(beta), 2)) / (f.Rs + f.Rp) : 1;
        const fac = V.filt ? passF : 1;
        // incident, reflected, refracted
        S.ray(c, [[cx - L * sx, cy - L * cs], [cx, cy]], { nm: 580, width: 2.6 });
        if (!f.tir) S.ray(c, [[cx, cy], [cx + L * sr, cy + L * cr]], { nm: 580, width: 0.8 + 2 * Tt, alpha: 0.25 + 0.75 * Tt });
        if (V.filt) {
          const fxp = cx + L * 0.78 * sx, fyp = cy - L * 0.78 * cs;
          S.ray(c, [[cx, cy], [fxp, fyp]], { nm: 580, width: 0.8 + 2 * Rt, alpha: 0.2 + 0.8 * Rt, minArrow: 30 });
          S.ray(c, [[fxp, fyp], [cx + L * sx, cy - L * cs]], { nm: 580, width: 0.8 + 2 * Rt * fac, alpha: 0.12 + 0.88 * Rt * fac, arrows: false });
          S.plate(c, fxp, fyp, 40, t1 - Math.PI / 2, { t: 6 });
          glyph(c, kit, C, fxp + 30, fyp - 16, sx, -cs, Math.pow(Math.cos(beta), 2) + 1e-9, Math.pow(Math.sin(beta), 2) + 1e-9);
          kit.label(c, 'filter axis', fxp + 30, fyp - 38, { align: 'center', color: C.muted, size: 11 });
        } else S.ray(c, [[cx, cy], [cx + L * sx, cy - L * cs]], { nm: 580, width: 0.8 + 2 * Rt, alpha: 0.2 + 0.8 * Rt, minArrow: 30 });
        // field glyphs at 55 % of each ray
        glyph(c, kit, C, cx - 0.55 * L * sx, cy - 0.55 * L * cs, sx, cs, 0.5, 0.5);
        glyph(c, kit, C, cx + 0.55 * L * sx, cy - 0.55 * L * cs, sx, -cs, 0.5 * f.Rs, 0.5 * f.Rp);
        if (!f.tir) glyph(c, kit, C, cx + 0.55 * L * sr, cy + 0.55 * L * cr, sr, cr, 0.5 * f.Ts, 0.5 * f.Tp);
        // angles, and the right angle at Brewster's angle
        if (V.angle > 2) { S.angle(c, cx, cy, 40, -Math.PI / 2, -Math.PI / 2 - t1, 'θ₁'); if (!f.tir) S.angle(c, cx, cy, 40, Math.PI / 2, Math.PI / 2 - f.t2, 'θ₂'); }
        if (Math.abs(V.angle - tb * R2D) < 0.8) {
          const a1 = -Math.PI / 2 + t1, a2 = Math.PI / 2 - f.t2, q = 16;
          c.strokeStyle = C.ok; c.lineWidth = 1.6; c.beginPath(); c.moveTo(cx + q * Math.cos(a1), cy + q * Math.sin(a1)); c.lineTo(cx + q * (Math.cos(a1) + Math.cos(a2)), cy + q * (Math.sin(a1) + Math.sin(a2))); c.lineTo(cx + q * Math.cos(a2), cy + q * Math.sin(a2)); c.stroke();
          kit.label(c, 'Brewster: reflected ⟂ refracted', cx + 26, cy + 4, { color: C.ok, weight: 650, size: 12 });
        }
        // the key to the glyphs
        const kx = W - 150, ky = 24;
        c.fillStyle = C.surface; c.fillRect(kx - 12, ky - 14, 150, 62); c.strokeStyle = C.border; c.strokeRect(kx - 12, ky - 14, 150, 62);
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath(); c.arc(kx + 4, ky + 2, 7, 0, TAU); c.stroke(); kit.dot(c, kx + 4, ky + 2, 1.8, C.accent);
        kit.label(c, 's: out of the page', kx + 20, ky + 2, { size: 11, color: C.text });
        kit.arrow(c, kx + 4, ky + 20, kx + 4, ky + 38, C.warn, 2, 6); kit.arrow(c, kx + 4, ky + 38, kx + 4, ky + 20, C.warn, 2, 6);
        kit.label(c, 'p: in the plane', kx + 20, ky + 30, { size: 11, color: C.text });
        // the graph, rebuilt when the surface changes
        if (V.mat !== loop.mat) {
          loop.mat = V.mat;
          const rs = [], rp = [], dp = [];
          for (let a = 0; a <= 90; a += 1) { const ff = O.fresnel(1, n2, Math.min(a, 89.9) * D2R); rs.push([a, 100 * ff.Rs]); rp.push([a, 100 * ff.Rp]); dp.push([a, 100 * Math.abs(P.byReflection(1, n2, Math.min(a, 89.9) * D2R))]); }
          loop.curves = [{ pts: rs, label: 'Rs (s component)', color: C.series[0], width: 2.4 }, { pts: rp, label: 'Rp (p component)', color: C.series[1], width: 2.4 }, { pts: dp, label: 'polarization of the reflection', color: C.muted, dash: [5, 4], width: 1.4 }];
        }
        plot.set({ series: loop.curves, vlines: [{ x: V.angle, label: V.angle + '°' }, { x: +(tb * R2D).toFixed(1), label: 'Brewster' }] });
        ro.set('n', n2.toFixed(3) + '  (550 nm)');
        ro.set('brew', (tb * R2D).toFixed(2) + '°   = arctan n');
        ro.set('rs', pct(f.Rs)); ro.set('rp', pct(f.Rp));
        ro.set('dop', pct(Math.abs(P.byReflection(1, n2, t1))));
        ro.set('flt', V.filt ? pct(passF) + ' of the reflected light' : '(no filter)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ the polarization of the sky */
  Hyper.sim('po-sky', {
    title: 'The polarization of the clear sky',
    blurb: `The whole sky as you would see it lying on your back (north at the top, east on the left), with the Sun in the south. Left: the colour is the **degree of polarization** and each short bar is the direction in which the electric field vibrates. Right: the geometry of one scattering — sunlight hits an air molecule and is scattered towards you through the angle Θ. Drag the ring on the sky to choose where you look.

**Try this**
- Drag the ring to the dashed circle, 90° from the Sun: the polarization is highest there, and the bars run *around* the Sun, like the lines of a target.
- Look straight at the Sun's direction (Θ = 0°) or away from it (180°): the light is unpolarized there. The small diagram shows why: the "in-plane" arrow shrinks as cos Θ and vanishes at 90°, leaving only the out-of-plane component.
- Raise the *depolarization* (haze, light bouncing off the ground and between molecules): the clear-sky maximum of 70 – 80 % falls and the pattern fades.
- Choose *The sky through a polarizing filter* and turn the filter axis: a dark band sweeps across the sky, always at 90° from the Sun. That is how a polarizing filter darkens a blue sky in a photograph.

The pattern is the single-scattering (Rayleigh) result, degree of polarization = (1 − cos²Θ) / (1 + cos²Θ), reduced by the depolarization you set. The real sky also has neutral points (near the Sun and opposite it) that this picture does not show.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'el', label: 'Sun elevation', min: 0, max: 89, step: 1, value: params.el != null ? params.el : 40, unit: '°' },
        { id: 'haze', label: 'Depolarization (haze, ground reflection)', min: 0, max: 0.7, step: 0.05, value: params.haze != null ? params.haze : 0.25 },
        { id: 'mode', type: 'select', label: 'The picture shows', options: [['Degree and direction of polarization', 'dop'], ['The sky through a polarizing filter', 'filter']], value: params.mode || 'dop' },
        { id: 'alpha', label: 'Filter axis (angle on the picture)', min: 0, max: 180, step: 1, value: params.alpha != null ? params.alpha : 90, unit: '°' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => ctl.show('alpha', V.mode === 'filter');
      const ro = kit.readout(box.side, [['th', 'Angle from the Sun, Θ'], ['d0', 'Single-scattering polarization'], ['d', 'With the depolarization'], ['dir', 'Field vibrates'], ['fl', 'Light through the filter at the ring']]);
      const probe = { az: 0, el: 50 * D2R };
      const geo = {};
      const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      const heat = t => t < 0.5 ? mixc([14, 22, 70], [44, 120, 205], t / 0.5) : mixc([44, 120, 205], [255, 226, 120], (t - 0.5) / 0.5);
      // sky properties in the direction (az, el): the angle from the Sun, the polarization, the direction of the field on the picture
      const skyAt = (az, el, s) => {
        const ce = Math.cos(el), se = Math.sin(el), sa = Math.sin(az), ca = Math.cos(az);
        const v = [ce * sa, ce * ca, se], cosT = clamp(v[0] * s[0] + v[1] * s[1] + v[2] * s[2], -1, 1), c2 = cosT * cosT;
        const E = [v[1] * s[2] - v[2] * s[1], v[2] * s[0] - v[0] * s[2], v[0] * s[1] - v[1] * s[0]], m = Math.hypot(E[0], E[1], E[2]);
        let eps = 0;
        if (m > 1e-9) {
          const e = [E[0] / m, E[1] / m, E[2] / m], eEl = [-se * sa, -se * ca, ce], eAz = [ca, -sa, 0];
          const a = e[0] * eEl[0] + e[1] * eEl[1] + e[2] * eEl[2], b = e[0] * eAz[0] + e[1] * eAz[1] + e[2] * eAz[2];
          eps = Math.atan2(-(a * ca + b * sa), a * sa - b * ca);
        }
        return { theta: Math.acos(cosT), dop0: (1 - c2) / (1 + c2), eps };
      };
      kit.drag(st, {
        hover: true,
        hit: p => Math.hypot(p.x - geo.cx, p.y - geo.cy) <= geo.R + 6 ? 'probe' : null,
        move: (w, p) => {
          const dx = p.x - geo.cx, dy = p.y - geo.cy, r = Math.min(geo.R, Math.hypot(dx, dy));
          probe.az = Math.atan2(-dx, -dy); probe.el = (Math.PI / 2) * (1 - r / geo.R) * 0.999 + 0.001; loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const R = Math.min(Hh * 0.44, W * 0.27), cx = W * 0.3, cy = Hh * 0.5;
        geo.cx = cx; geo.cy = cy; geo.R = R;
        const es = V.el * D2R, s = [0, -Math.cos(es), Math.sin(es)], filt = V.mode === 'filter', al = V.alpha * D2R, keep = 1 - V.haze;
        // the dome
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
        S.cells(c, cx - R, cy - R, 2 * R, 2 * R, 64, 64, (u, v) => {
          const dx = (u - 0.5) * 2 * R, dy = (v - 0.5) * 2 * R, r = Math.hypot(dx, dy);
          const q = skyAt(Math.atan2(-dx, -dy), (Math.PI / 2) * (1 - Math.min(1, r / R)), s), d = q.dop0 * keep;
          if (!filt) return heat(clamp(d / 0.95, 0, 1));
          const T = 0.5 * (1 + d * Math.cos(2 * (q.eps - al))), b = 0.1 + 0.9 * T;
          return [60 * b + 8, 130 * b + 10, 235 * b + 10];
        });
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,0.22)'; c.lineWidth = 1;
        for (const f of [1 / 3, 2 / 3]) { c.beginPath(); c.arc(cx, cy, R * f, 0, TAU); c.stroke(); }
        // the bars: where the field vibrates, with the length the degree of polarization
        if (!filt) {
          for (const [e0, nAz] of [[15, 30], [35, 24], [55, 16], [75, 8]]) {
            for (let k = 0; k < nAz; k++) {
              const az = TAU * (k + 0.5 * (e0 === 35 || e0 === 75 ? 1 : 0)) / nAz, r = R * (1 - e0 / 90), q = skyAt(az, e0 * D2R, s), px = cx - r * Math.sin(az), py = cy - r * Math.cos(az), h = (3 + 11 * q.dop0 * keep), ex = Math.cos(q.eps) * h, ey = -Math.sin(q.eps) * h;
              c.lineCap = 'round'; c.strokeStyle = 'rgba(0,0,0,0.55)'; c.lineWidth = 3.4; c.beginPath(); c.moveTo(px - ex, py - ey); c.lineTo(px + ex, py + ey); c.stroke();
              c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 1.7; c.beginPath(); c.moveTo(px - ex, py - ey); c.lineTo(px + ex, py + ey); c.stroke();
            }
          }
        }
        // the circle 90° from the Sun
        { let b1 = Math.abs(s[2]) > 0.999 ? [1, 0, 0] : (() => { const m = Math.hypot(s[1], s[0]); return [-s[1] / m, s[0] / m, 0]; })();
          const b2 = [s[1] * b1[2] - s[2] * b1[1], s[2] * b1[0] - s[0] * b1[2], s[0] * b1[1] - s[1] * b1[0]];
          c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.3; c.setLineDash([5, 4]); c.beginPath(); let on = false;
          for (let i = 0; i <= 120; i++) {
            const a = TAU * i / 120, v = [Math.cos(a) * b1[0] + Math.sin(a) * b2[0], Math.cos(a) * b1[1] + Math.sin(a) * b2[1], Math.cos(a) * b1[2] + Math.sin(a) * b2[2]];
            if (v[2] < 0) { on = false; continue; }
            const el = Math.asin(clamp(v[2], -1, 1)), az = Math.atan2(v[0], v[1]), r = R * (1 - el / (Math.PI / 2)), px = cx - r * Math.sin(az), py = cy - r * Math.cos(az);
            if (on) c.lineTo(px, py); else c.moveTo(px, py); on = true;
          }
          c.stroke(); c.setLineDash([]); }
        // the Sun, the compass, the ring
        { const r = R * (1 - es / (Math.PI / 2)); kit.dot(c, cx, cy + r, 8, '#ffd23c', '#7a5b00'); kit.label(c, 'Sun', cx + 12, cy + r, { color: C.text, size: 11.5 }); }
        kit.label(c, 'N', cx, cy - R - 10, { align: 'center', color: C.muted, size: 11.5 }); kit.label(c, 'S', cx, cy + R + 11, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'E', cx - R - 11, cy, { align: 'center', color: C.muted, size: 11.5 }); kit.label(c, 'W', cx + R + 11, cy, { align: 'center', color: C.muted, size: 11.5 });
        const pr = R * (1 - probe.el / (Math.PI / 2)), ppx = cx - pr * Math.sin(probe.az), ppy = cy - pr * Math.cos(probe.az);
        c.strokeStyle = '#fff'; c.lineWidth = 2.2; c.beginPath(); c.arc(ppx, ppy, 8, 0, TAU); c.stroke(); c.strokeStyle = '#000'; c.lineWidth = 1; c.beginPath(); c.arc(ppx, ppy, 10, 0, TAU); c.stroke();
        const q = skyAt(probe.az, probe.el, s), d = q.dop0 * keep, T = 0.5 * (1 + d * Math.cos(2 * (q.eps - al)));
        // the scattering geometry on the right
        const xr = cx + R + 56, yr = Hh * 0.6, xs = xr + 150, th = q.theta, ct = Math.cos(th), stt = Math.sin(th), Lr = 118;
        kit.label(c, 'one scattering, seen from the side', xr, 16, { color: C.muted, size: 11.5 });
        S.source(c, xr + 6, yr, { kind: 'sun', size: 11, color: '#ffd23c' });
        S.ray(c, [[xr + 22, yr], [xs, yr]], { color: '#ffd23c', width: 2.2, minArrow: 60 });
        glyph(c, kit, C, xr + 70, yr, 1, 0, 1, 1);
        kit.label(c, 'sunlight: unpolarized', xr + 70, yr + 30, { align: 'center', color: C.muted, size: 11 });
        kit.dot(c, xs, yr, 5, C.text);
        kit.label(c, 'air molecule', xs, yr + 17, { align: 'center', color: C.muted, size: 11 });
        S.ray(c, [[xs, yr], [xs + Lr * ct, yr - Lr * stt]], { nm: 470, width: 2.2, minArrow: 60 });
        glyph(c, kit, C, xs + 0.62 * Lr * ct, yr - 0.62 * Lr * stt, ct, -stt, 1, ct * ct);
        S.angle(c, xs, yr, 34, 0, -th, 'Θ', { gap: 12 });
        kit.label(c, 'to you', xs + Lr * ct, yr - Lr * stt - 9, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, Math.abs(ct) < 0.06 ? 'in-plane part vanishes: fully polarized' : 'in-plane part: cos²Θ = ' + (ct * ct).toFixed(2), xr + 120, Hh - 14, { align: 'center', color: Math.abs(ct) < 0.06 ? C.ok : C.muted, size: 11.5, weight: Math.abs(ct) < 0.06 ? 650 : 500 });
        if (filt) { dial(c, kit, C, W - 44, 46, 26, null, { label: 'filter' }); dbl(c, kit, W - 44, 46, al, 22, C.accent, 2.6); }
        ro.set('th', (th * R2D).toFixed(1) + '°');
        ro.set('d0', pct(q.dop0));
        ro.set('d', pct(d));
        ro.set('dir', th < 0.03 || th > Math.PI - 0.03 ? 'no preferred direction' : 'across the plane Sun – you – scattering point');
        ro.set('fl', filt ? pct(T) + ' of the light (½ if unpolarized)' : '(filter off)');
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });
  /* ================================================================ a birefringent crystal */
  Hyper.sim('po-birefringence', {
    title: 'Birefringence: two rays and two images',
    blurb: `A beam enters a crystal plate straight on. Inside, it splits into the **ordinary ray** (polarized across the plane of the drawing, shown by the dot; it goes straight on) and the **extraordinary ray** (polarized in the plane, shown by the arrow; it walks sideways). Both leave parallel, a little apart. On the right, a word printed on paper is seen through the crystal: two images.

**Try this**
- Start with *calcite*, 15 mm thick, axis tilted 45°: the e-ray walks off by about 6° (1.6 mm at the exit) and the word appears twice. Make the crystal thicker: the images move apart in proportion.
- Turn the crystal about the beam (the slider): the e-image circles round the o-image, which does not move.
- Tilt the optic axis to 0° (along the beam) or 90° (across it): the images merge. Along the axis the crystal behaves like glass; across it the two rays still differ in speed but do not separate — that is a **wave plate**.
- Tick *Look through an analyzer* and turn it: one image fades while the other brightens, and at the right angle only one remains. The two images are polarized at right angles.
- Switch to *quartz*: the birefringence is 19 times smaller and the separation is a fraction of a millimetre — you will not see two images, but the retardance is still hundreds of wavelengths.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const MATS = [['Calcite (nₒ 1.658, nₑ 1.486)', 'calcite'], ['Crystal quartz (nₒ 1.544, nₑ 1.553)', 'quartz']];
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Crystal', options: MATS, value: params.mat || 'calcite' },
        { id: 't', label: 'Thickness', min: 1, max: 40, step: 1, value: params.t || 15, unit: 'mm' },
        { id: 'tilt', label: 'Optic axis tilted from the beam by', min: 0, max: 90, step: 1, value: params.tilt != null ? params.tilt : 45, unit: '°' },
        { id: 'phi', label: 'Turn the crystal about the beam', min: 0, max: 360, step: 5, value: params.phi || 0, unit: '°' },
        { id: 'inp', type: 'select', label: 'Light entering', options: [['Unpolarized', 'u'], ['Linearly polarized', 'l']], value: params.inp || 'u' },
        { id: 'psi', label: 'Direction of its polarization', min: 0, max: 180, step: 5, value: params.psi != null ? params.psi : 45, unit: '°' },
        { id: 'an', type: 'check', label: 'Look through an analyzer', value: !!params.an },
        { id: 'alpha', label: 'Analyzer axis', min: 0, max: 180, step: 5, value: params.alpha != null ? params.alpha : 0, unit: '°' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { ctl.show('psi', V.inp === 'l'); ctl.show('alpha', V.an); };
      const ro = kit.readout(box.side, [['no', 'Ordinary index nₒ'], ['ne', 'Extraordinary index at this tilt'], ['rho', 'Walk-off angle of the e-ray'], ['sep', 'Separation of the two images'], ['br', 'Brightness: o-image · e-image'], ['ret', 'Delay of one ray behind the other']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const no = O.index(V.mat + '-o', 589.3), ne = O.index(V.mat + '-e', 589.3), th = V.tilt * D2R;
        const nth = no * ne / Math.sqrt(ne * ne * Math.pow(Math.cos(th), 2) + no * no * Math.pow(Math.sin(th), 2));
        const thr = th > Math.PI / 2 - 1e-6 ? Math.PI / 2 : Math.atan((no * no) / (ne * ne) * Math.tan(th));
        const rho = thr - th, shift = V.t * Math.tan(rho);          // mm, positive: away from the axis (calcite)
        const phi = V.phi * D2R, psi = V.psi * D2R, al = V.alpha * D2R;
        let Ie = 0.5, Io = 0.5;
        if (V.inp === 'l') { Ie = Math.pow(Math.cos(psi - phi), 2); Io = Math.pow(Math.sin(psi - phi), 2); }
        if (V.an) { Ie *= Math.pow(Math.cos(al - phi), 2); Io *= Math.pow(Math.sin(al - phi), 2); }
        // ----- the principal section, from the side
        const s = Math.min(8, W * 0.27 / V.t), xf = W * 0.14, xb = xf + V.t * s, y0 = Hh * 0.4, xe = xb + 60;
        const bright = I => 0.25 + 0.75 * Math.min(1, 2 * I);
        c.fillStyle = S.glass(0.3); c.fillRect(xf, y0 - 52, xb - xf, 104); c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.strokeRect(xf, y0 - 52, xb - xf, 104);
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([6, 4]); const mx = (xf + xb) / 2; c.beginPath(); c.moveTo(mx - 30 * Math.cos(th), y0 + 30 * Math.sin(th)); c.lineTo(mx + 30 * Math.cos(th), y0 - 30 * Math.sin(th)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'optic axis', mx + 32 * Math.cos(th) + 4, y0 - 32 * Math.sin(th) - 5, { color: C.faint, size: 11 });
        S.ray(c, [[14, y0], [xf, y0]], { nm: 580, width: 2.6 });
        const ye = y0 + shift * s;
        S.ray(c, [[xf, y0], [xb, y0], [xe, y0]], { color: C.accent, width: 2.6, alpha: bright(Io), arrows: false });
        S.ray(c, [[xf, y0], [xb, ye], [xe, ye]], { color: C.warn, width: 2.6, alpha: bright(Ie), arrows: false });
        glyph(c, kit, C, mx, y0 - 22, 1, 0, 1, 1e-9); glyph(c, kit, C, mx, y0 + 28 + Math.max(0, shift * s) / 2, 1, 0, 1e-9, 1);
        kit.label(c, 'o  (⟂ plane)', xe - 2, y0 - 9, { align: 'right', color: C.accent, size: 11.5, weight: 650 });
        kit.label(c, 'e  (in plane)', xe - 2, ye + (Math.abs(ye - y0) < 14 ? 15 : 0) + (ye >= y0 ? 11 : -11), { align: 'right', color: C.warn, size: 11.5, weight: 650 });
        if (Math.abs(shift * s) > 3) S.dim(c, xe + 8, y0, xe + 8, ye, Math.abs(shift).toFixed(2) + ' mm', { off: -8 });
        S.dim(c, xf, y0 + 66, xb, y0 + 66, V.t + ' mm', { off: 12 });
        kit.label(c, 'the plane of the optic axis and the beam, from the side', 14, 16, { color: C.muted, size: 11.5 });
        // ----- a word seen through the crystal
        const bw = W * 0.36, bh = Hh * 0.46, bx = W * 0.62, by = Hh * 0.08;
        c.fillStyle = '#05060d'; c.fillRect(bx, by, bw, bh); c.strokeStyle = C.border; c.strokeRect(bx, by, bw, bh);
        const ccx = bx + bw / 2, ccy = by + bh / 2, s2 = Math.min(5, bw / 40), dx = -shift * Math.cos(phi) * s2, dy = shift * Math.sin(phi) * s2;
        const sz = Math.max(16, Math.min(30, bw / 6));
        kit.label(c, 'POLAR', ccx, ccy, { align: 'center', size: sz, weight: 800, color: 'rgba(255,255,255,' + (0.1 + 0.9 * Math.min(1, 2 * Io)).toFixed(3) + ')' });
        kit.label(c, 'POLAR', ccx + dx, ccy + dy, { align: 'center', size: sz, weight: 800, color: 'rgba(255,200,120,' + (0.1 + 0.9 * Math.min(1, 2 * Ie)).toFixed(3) + ')' });
        kit.label(c, 'a word seen through the crystal', bx, by + bh + 14, { color: C.muted, size: 11.5 });
        kit.label(c, 'white: o-image · amber: e-image', bx, by + bh + 30, { color: C.faint, size: 11 });
        if (V.an) { const dcx = bx + bw - 30, dcy = by + bh + 58; dial(c, kit, C, dcx, dcy, 22, null, {}); dbl(c, kit, dcx, dcy, al, 19, C.accent, 2.4); kit.label(c, 'analyzer', dcx - 36, dcy, { align: 'right', color: C.muted, size: 11 }); }
        ro.set('no', no.toFixed(4));
        ro.set('ne', nth.toFixed(4) + '   (nₑ = ' + ne.toFixed(4) + ' when across the axis)');
        ro.set('rho', (rho * R2D).toFixed(2) + '°' + (Math.abs(rho) < 1e-4 ? '  (none: along or across the axis)' : rho > 0 ? '  (away from the axis)' : '  (towards the axis)'));
        ro.set('sep', Math.abs(shift).toFixed(3) + ' mm');
        ro.set('br', pct(Io) + ' · ' + pct(Ie));
        ro.set('ret', Math.round(Math.abs(nth - no) * V.t * 1e6 / 589.3) + ' wavelengths  (' + (Math.abs(nth - no)).toFixed(4) + ' × ' + V.t + ' mm)');
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });

  /* ================================================================ a wave plate */
  // white-light colours of a retarder between crossed polarizers, plate at 45°: retardation 0…2000 nm in steps of 5 nm
  let IC = null;
  function icolours(O) {
    if (IC) return IC;
    const lam = []; for (let l = 400; l <= 700; l += 15) lam.push(l);
    const cm = lam.map(l => O.colour.cmf(l)), white = [0, 0, 0];
    cm.forEach(m => { white[0] += m[0]; white[1] += m[1]; white[2] += m[2]; });
    const wl = O.colour.toRgb(white);
    IC = [];
    for (let g = 0; g <= 2000; g += 5) {
      let X = 0, Y = 0, Z = 0;
      lam.forEach((l, i) => { const T = Math.pow(Math.sin(Math.PI * g / l), 2); X += T * cm[i][0]; Y += T * cm[i][1]; Z += T * cm[i][2]; });
      IC.push(O.colour.css(O.colour.toRgb([X, Y, Z]).map((v, k) => v / wl[k])));
    }
    return IC;
  }

  Hyper.sim('po-waveplate', {
    title: 'A wave plate: thickness, wavelength and what comes out',
    blurb: `Linearly polarized light (left) crosses a thin plate of birefringent crystal and comes out (right) with a different polarization ellipse. The plate delays the light polarized along its **slow** axis behind the light polarized along its **fast** axis by the **retardance** Γ = 2π Δn d / λ. The colour bar at the bottom shows what the same plate looks like between *crossed* polarizers in white light: the colour depends only on the retardation Δn·d in nanometres.

**Try this**
- Press **Quarter-wave** (zero order): the plate is 15 µm of quartz. With the fast axis at 0° and the input at 45° the output is *circular*; at any other input angle it is elliptical.
- Press **Half-wave**: the output is linear again, turned to the other side of the fast axis — the input at 20° leaves at −20°. Turn the fast axis and the output turns twice as fast.
- Press **Quarter-wave, 20th order** (a plate 21 times thicker) and then change the wavelength by 10 nm: the ellipse loses its roundness. A multi-order plate is exact only at one wavelength; a zero-order plate tolerates far more.
- Move the thickness slider and watch the marker run along the colour bar: the sequence of interference colours is the one you see in stressed plastic and in minerals under a polarizing microscope.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 350 });
      const MATS = [['Crystal quartz (Δn = 0.0091)', 'quartz'], ['Calcite (Δn = 0.172)', 'calcite']];
      const dnOf = id => Math.abs(O.index(id + '-e', 589.3) - O.index(id + '-o', 589.3));
      const mat0 = params.mat || 'quartz', wl0 = params.wl || 550;
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Plate material', options: MATS, value: mat0 },
        { id: 'd', label: 'Thickness', min: 0.3, max: 3000, value: params.d || P.waveplateThickness(0.25, dnOf(mat0), wl0) * 1e6, log: true, sig: 3, unit: 'µm' },
        { id: 'wl', label: 'Wavelength', min: 400, max: 700, step: 5, value: wl0, unit: 'nm' },
        { id: 'fast', label: 'Fast axis', min: 0, max: 180, step: 1, value: params.fast != null ? params.fast : 0, unit: '°' },
        { id: 'psi', label: 'Input polarization direction', min: 0, max: 180, step: 1, value: params.psi != null ? params.psi : 45, unit: '°' },
        { id: 'an', type: 'check', label: 'Analyzer after the plate', value: !!params.an },
        { id: 'alpha', label: 'Analyzer axis', min: 0, max: 180, step: 1, value: params.alpha != null ? params.alpha : 135, unit: '°' },
        { type: 'buttons', items: [{ id: 'qw', label: 'Quarter-wave', primary: true }, { id: 'hw', label: 'Half-wave' }, { id: 'qwm', label: 'Quarter-wave, 20th order' }] }
      ], id => {
        const setWaves = w => ctl.set('d', clamp(P.waveplateThickness(w, dnOf(V.mat), V.wl) * 1e6, 0.3, 3000));
        if (id === 'mat' || id === 'qw') { setWaves(0.25); if (id === 'qw') { ctl.set('fast', 0); ctl.set('psi', 45); } }
        if (id === 'hw') { setWaves(0.5); ctl.set('fast', 0); ctl.set('psi', 20); }
        if (id === 'qwm') { setWaves(20.25); ctl.set('fast', 0); ctl.set('psi', 45); }
        sync(); loop.once();
      });
      const V = ctl.values;
      const sync = () => ctl.show('alpha', V.an);
      const ro = kit.readout(box.side, [['ret', 'Retardation Δn·d'], ['waves', 'Retardance Γ / 2π'], ['kind', 'The plate acts as'], ['out', 'The light that comes out'], ['jones', 'Jones vector out'], ['an', 'Through the analyzer']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const dn = dnOf(V.mat), gam = P.retardance(V.d * 1e-6, dn, V.wl), waves = gam / TAU, fast = V.fast * D2R;
        const Jin = P.vec(V.psi * D2R), Jout = P.apply(P.retarder(gam, fast), Jin), Jan = P.apply(P.polarizer(V.alpha * D2R), Jout);
        const R = Math.min(62, W * 0.1), y1 = Hh * 0.3, xs = [W * 0.14, W * 0.37, W * 0.6, W * 0.84];
        S.ray(c, [[xs[0] + R, y1], [xs[1] - 20, y1]], { nm: V.wl, width: 2, arrows: false }); S.ray(c, [[xs[1] + 20, y1], [xs[2] - R, y1]], { nm: V.wl, width: 2, arrows: false });
        dial(c, kit, C, xs[0], y1, R, Jin, { t: loop.t * 3, label: 'light in: linear ' + V.psi + '°' });
        S.polarizer(c, xs[1], y1, 34, Math.PI / 2 - fast, { axis: C.warn, label: 'plate: fast axis ' + V.fast + '°' });
        dial(c, kit, C, xs[2], y1, R, Jout, { t: loop.t * 3, label: 'light out' });
        if (V.an) {
          S.ray(c, [[xs[2] + R, y1], [xs[3] - 20, y1]], { nm: V.wl, width: 2, arrows: false });
          S.polarizer(c, xs[3], y1, 34, Math.PI / 2 - V.alpha * D2R, { label: 'analyzer ' + V.alpha + '°' });
        }
        // the interference colours of this retardation, between crossed polarizers
        const cols = icolours(O), bx = 30, bw = W - 60, byy = Hh * 0.74, bh = 28;
        for (let i = 0; i < cols.length; i++) { c.fillStyle = cols[i]; c.fillRect(bx + bw * i / cols.length, byy, bw / cols.length + 1, bh); }
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(bx + 0.5, byy + 0.5, bw, bh);
        for (let g = 0; g <= 2000; g += 250) { const x = bx + bw * g / 2000; c.beginPath(); c.moveTo(x, byy + bh); c.lineTo(x, byy + bh + 5); c.stroke(); kit.label(c, String(g), x, byy + bh + 15, { align: 'center', size: 10.5, color: C.faint }); }
        kit.label(c, 'colour of the plate between crossed polarizers, plate axis at 45°, white light — retardation Δn·d in nm', bx, byy - 14, { color: C.muted, size: 11.5 });
        const gnm = dn * V.d * 1000, mx = bx + bw * Math.min(1, gnm / 2000);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(mx, byy - 1); c.lineTo(mx - 6, byy - 11); c.lineTo(mx + 6, byy - 11); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(mx, byy); c.lineTo(mx, byy + bh); c.stroke();
        if (gnm > 2000) kit.label(c, 'this plate: ' + Math.round(gnm).toLocaleString('en-US') + ' nm →', bx + bw, byy + bh + 30, { align: 'right', color: C.warn, size: 11.5 });
        // the numbers
        const el = P.ellipse(Jout), tchi = Math.abs(Math.tan(el.ellipticity)), frac = waves - Math.floor(waves + 1e-9);
        const near = (a, b) => Math.abs(a - b) < 0.012 || Math.abs(a - b - 1) < 0.012 || Math.abs(a - b + 1) < 0.012;
        const kindText = near(frac, 0.25) ? 'a quarter-wave plate' + (waves > 0.3 ? ' (order ' + Math.floor(waves) + ')' : ' (zero order)') : near(frac, 0.5) ? 'a half-wave plate' + (waves > 0.6 ? ' (order ' + Math.floor(waves) + ')' : ' (zero order)') : near(frac, 0) ? 'a full-wave (or no) plate: no change' : 'a general retarder';
        const az = mod(el.azimuth * R2D + 90, 180) - 90;
        ro.set('ret', (dn * V.d * 1000).toFixed(1) + ' nm   (d = ' + kit.fmt(V.d, 3) + ' µm)');
        ro.set('waves', waves.toFixed(3) + ' waves   (' + (gam * R2D).toFixed(0) + '°)');
        ro.set('kind', kindText);
        ro.set('out', tchi < 0.01 ? 'linear, ' + az.toFixed(0) + '° from x' : tchi > 0.99 ? (el.handed === 'right' ? 'circular, right-handed' : 'circular, left-handed') : 'elliptical, ' + (el.handed === 'right' ? 'right' : 'left') + '-handed, axis ratio ' + tchi.toFixed(2) + ', long axis ' + az.toFixed(0) + '°');
        ro.set('jones', '(' + cstr(Jout[0]) + ',  ' + cstr(Jout[1]) + ')');
        ro.set('an', V.an ? P.intensity(Jan).toFixed(3) + ' of the light' : '(no analyzer)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
      sync();
    }
  });
  /* ================================================================ a Jones-calculus bench */
  const ELEMENTS = [['(nothing)', 'none'], ['Linear polarizer', 'pol'], ['Quarter-wave plate', 'qwp'], ['Half-wave plate', 'hwp'], ['Rotator (turns the plane)', 'rot']];
  const elementMatrix = (P, type, t) => type === 'pol' ? P.polarizer(t) : type === 'qwp' ? P.qwp(t) : type === 'hwp' ? P.hwp(t) : type === 'rot' ? P.rotator(t) : null;
  const describe = (P, J) => {
    if (P.intensity(J) < 1e-6) return 'dark: no light';
    const el = P.ellipse(J), tchi = Math.abs(Math.tan(el.ellipticity)), az = mod(el.azimuth * R2D + 90, 180) - 90;
    if (tchi < 0.01) return 'linear, ' + az.toFixed(0) + '°';
    if (tchi > 0.99) return el.handed === 'right' ? 'right circular' : 'left circular';
    return 'elliptical, ' + el.handed;
  };
  Hyper.sim('po-bench', {
    title: 'A Jones-calculus bench: three elements, one state',
    blurb: `Fully polarized light is described by two complex numbers, its **Jones vector**; each element is a 2 × 2 matrix; the light after the element is the matrix times the vector. Choose an input state and up to three elements. The four dials are the polarization ellipse of the light at the source and after each element, drawn head-on with its intensity (the size of the ellipse is the amplitude), and the numbers beneath are the Jones vectors.

**Try this**
- Input *Horizontal*, element 1 a **quarter-wave plate** at 45°: the output is circular — the dial is a circle and the two Jones components have equal size, a quarter of a turn apart.
- Make element 1 a quarter-wave plate at 0° and element 2 a **polarizer** at 45° with *Right circular* light in: all of it passes. Change the input to *Left circular*: none passes. That pair is a circular-polarization analyzer.
- Input *Horizontal*, element 1 a **half-wave plate** at 22.5°: the output is linear at 45°. The plate turned the plane by twice its angle.
- Two quarter-wave plates in a row at the same angle behave as one half-wave plate: try it, and read the total matrix.

Angles are measured from the horizontal axis, counter-clockwise as seen looking back towards the source. Light is assumed perfectly polarized: unpolarized light needs the Stokes–Mueller description (next page).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol, cx = O.cx;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const INS = [['Horizontal (H)', 'H'], ['Vertical (V)', 'V'], ['Linear +45° (D)', 'D'], ['Linear −45° (A)', 'A'], ['Right circular (R)', 'R'], ['Left circular (L)', 'L'], ['Linear at an angle…', 'ang']];
      const defs = [{ id: 'in', type: 'select', label: 'Input light', options: INS, value: params.in || 'H' }, { id: 'a0', label: 'Input angle', min: 0, max: 180, step: 1, value: params.a0 != null ? params.a0 : 30, unit: '°' }];
      const init = params.els || [['qwp', 45], ['none', 0], ['none', 0]];
      for (let k = 0; k < 3; k++) {
        defs.push({ id: 'e' + k, type: 'select', label: 'Element ' + (k + 1), options: ELEMENTS, value: init[k][0] });
        defs.push({ id: 't' + k, label: 'Element ' + (k + 1) + ' angle', min: 0, max: 180, step: 1, value: init[k][1], unit: '°' });
      }
      defs.push({ type: 'buttons', items: [{ id: 'circ', label: 'Circular analyzer', primary: true }, { id: 'hwp', label: 'Half-wave turns the plane' }, { id: 'qq', label: 'Two quarter-waves' }] });
      const ctl = kit.controls(box.side, defs, id => {
        const setE = (k, ty, t) => { ctl.set('e' + k, ty); ctl.set('t' + k, t); };
        if (id === 'circ') { ctl.set('in', 'R'); setE(0, 'qwp', 0); setE(1, 'pol', 45); setE(2, 'none', 0); }
        if (id === 'hwp') { ctl.set('in', 'H'); setE(0, 'hwp', 22.5); setE(1, 'none', 0); setE(2, 'none', 0); }
        if (id === 'qq') { ctl.set('in', 'H'); setE(0, 'qwp', 30); setE(1, 'qwp', 30); setE(2, 'none', 0); }
        sync(); loop.once();
      });
      const V = ctl.values;
      const sync = () => { ctl.show('a0', V.in === 'ang'); for (let k = 0; k < 3; k++) ctl.show('t' + k, V['e' + k] !== 'none'); };
      const ro = kit.readout(box.side, [['M1', 'Total matrix, row 1'], ['M2', 'Total matrix, row 2'], ['I', 'Intensity out ÷ in'], ['S', 'Stokes out (S₁ S₂ S₃ ÷ S₀)']]);
      const mm = (X, Y) => [[cx.add(cx.mul(X[0][0], Y[0][0]), cx.mul(X[0][1], Y[1][0])), cx.add(cx.mul(X[0][0], Y[0][1]), cx.mul(X[0][1], Y[1][1]))],
                            [cx.add(cx.mul(X[1][0], Y[0][0]), cx.mul(X[1][1], Y[1][0])), cx.add(cx.mul(X[1][0], Y[0][1]), cx.mul(X[1][1], Y[1][1]))]];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const Jin = V.in === 'ang' ? P.vec(V.a0 * D2R) : P.vec(V.in);
        const active = [0, 1, 2].filter(k => V['e' + k] !== 'none'), states = [Jin];
        let M = [[[1, 0], [0, 0]], [[0, 0], [1, 0]]];
        for (const k of active) { const m = elementMatrix(P, V['e' + k], V['t' + k] * D2R); states.push(P.apply(m, states[states.length - 1])); M = mm(m, M); }
        const xs = states.map((s, i) => W * (0.14 + 0.72 * (states.length > 1 ? i / (states.length - 1) : 0.5))), y1 = Hh * 0.34, R = Math.min(56, W * 0.085);
        states.forEach((J, i) => {
          if (i > 0) {
            const k = active[i - 1], xm = (xs[i - 1] + xs[i]) / 2, ty = V['e' + k];
            S.ray(c, [[xs[i - 1] + R + 4, y1], [xs[i] - R - 4, y1]], { nm: 580, width: 2, arrows: false });
            const nm = ELEMENTS.find(e => e[1] === ty)[0];
            S.polarizer(c, xm, y1, 30, Math.PI / 2 - V['t' + k] * D2R, { axis: ty === 'pol' ? C.accent : C.warn, label: (ty === 'pol' ? 'polarizer' : ty === 'qwp' ? 'λ/4 plate' : ty === 'hwp' ? 'λ/2 plate' : 'rotator') + ' ' + V['t' + k] + '°' });
          }
          dial(c, kit, C, xs[i], y1, R, J, { t: loop.t * 3, label: i === 0 ? 'input' : 'after element ' + (active[i - 1] + 1) });
          const I = P.intensity(J);
          kit.label(c, 'I = ' + I.toFixed(3), xs[i], y1 + R + 30, { align: 'center', color: C.text, size: 12, weight: 650 });
          kit.label(c, describe(P, J), xs[i], y1 + R + 46, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'Ex = ' + cstr(J[0]), xs[i], y1 + R + 66, { align: 'center', color: C.faint, size: 11 });
          kit.label(c, 'Ey = ' + cstr(J[1]), xs[i], y1 + R + 80, { align: 'center', color: C.faint, size: 11 });
        });
        if (!active.length) kit.label(c, 'No element chosen: the light passes unchanged. Pick an element on the right.', W / 2, Hh - 22, { align: 'center', color: C.muted, size: 12 });
        const out = states[states.length - 1], Sk = P.stokes(out), I0 = Sk[0] || 1;
        ro.set('M1', '[ ' + cstr(M[0][0]) + ',  ' + cstr(M[0][1]) + ' ]');
        ro.set('M2', '[ ' + cstr(M[1][0]) + ',  ' + cstr(M[1][1]) + ' ]');
        ro.set('I', P.intensity(out).toFixed(4) + '   (' + pct(P.intensity(out)) + ')');
        ro.set('S', Sk[0] < 1e-9 ? '—' : (Sk[1] / I0).toFixed(2) + '   ' + (Sk[2] / I0).toFixed(2) + '   ' + (Sk[3] / I0).toFixed(2));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
      sync();
    }
  });

  /* ================================================================ the Poincaré sphere */
  Hyper.sim('po-poincare', {
    title: 'The Poincaré sphere: Stokes vectors and Mueller matrices',
    blurb: `Every polarization state is a point on, or inside, a sphere whose coordinates are the Stokes parameters S₁, S₂, S₃ (divided by the intensity S₀). **Linear states lie on the equator** (H and V at the ends of the S₁ axis, +45° and −45° on S₂), **circular states are the poles** (R above, L below), everything between is elliptical, and a point *inside* the sphere is partially polarized — the radius is the degree of polarization. Drag the sphere to turn it.

**Try this**
- Input *Horizontal*, element a **quarter-wave plate** at 45°: the point travels a quarter of a circle from the equator to the pole R: linear light has become circular. The curve drawn is the path as the plate grows thicker.
- Replace it with a **half-wave plate** at 22.5°: the point goes half-way round a circle about the axis of the plate and lands on the +45° point. Every retarder is a rotation of the sphere about an axis on the equator.
- Pick a **polarizer**: every state is projected onto one point of the equator, and the intensity falls to the matching share.
- Lower the degree of polarization in the input (the point moves inside), or use the **depolarizer**: the point sinks towards the centre, unpolarized light. No retarder can do that: retarders keep the point on the same sphere.`,
    mount(box, kit, params) {
      const O = kit.optics, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const PRE = { H: [0, 0], V: [90, 0], D: [45, 0], A: [-45, 0], R: [0, 45], L: [0, -45] };
      const ctl = kit.controls(box.side, [
        { id: 'psi', label: 'Input: azimuth of the long axis', min: -90, max: 90, step: 1, value: params.psi != null ? params.psi : 0, unit: '°' },
        { id: 'chi', label: 'Input: ellipticity (±45° circular)', min: -45, max: 45, step: 1, value: params.chi != null ? params.chi : 0, unit: '°' },
        { id: 'p', label: 'Input: degree of polarization', min: 0, max: 1, step: 0.05, value: params.p != null ? params.p : 1 },
        { id: 'el', type: 'select', label: 'Element', options: [['(nothing)', 'none'], ['Linear polarizer', 'pol'], ['Quarter-wave plate', 'qwp'], ['Half-wave plate', 'hwp'], ['Retarder of any retardance', 'ret'], ['Depolarizer', 'dep']], value: params.el || 'qwp' },
        { id: 't', label: 'Element axis', min: 0, max: 180, step: 1, value: params.t != null ? params.t : 45, unit: '°' },
        { id: 'dl', label: 'Retardance δ', min: 0, max: 360, step: 5, value: params.dl != null ? params.dl : 90, unit: '°' },
        { id: 'f', label: 'Polarization kept by the depolarizer', min: 0, max: 1, step: 0.05, value: params.f != null ? params.f : 0.5 },
        { type: 'buttons', items: [{ id: 'H', label: 'H' }, { id: 'V', label: 'V' }, { id: 'D', label: '+45°' }, { id: 'A', label: '−45°' }, { id: 'R', label: 'R', primary: true }, { id: 'L', label: 'L' }] }
      ], id => { const q = PRE[id]; if (q) { ctl.set('psi', q[0]); ctl.set('chi', q[1]); ctl.set('p', 1); } sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { ctl.show('t', V.el !== 'none' && V.el !== 'dep'); ctl.show('dl', V.el === 'ret'); ctl.show('f', V.el === 'dep'); };
      const ro = kit.readout(box.side, [['in', 'Stokes in (S₀ S₁ S₂ S₃)'], ['out', 'Stokes out'], ['dop', 'Degree of polarization out'], ['M1', 'Mueller matrix'], ['M2', ''], ['M3', ''], ['M4', '']]);
      const view = { yaw: 28 * D2R, pitch: 22 * D2R };
      const geo = { cx: 0, cy: 0, R: 1 };
      let last = null;
      kit.drag(st, {
        hover: true,
        hit: p => Math.hypot(p.x - geo.cx, p.y - geo.cy) < geo.R * 1.25 ? 'sphere' : null,
        start: (w, p) => { last = p; },
        move: (w, p) => { if (last) { view.yaw += (p.x - last.x) * 0.012; view.pitch = clamp(view.pitch + (p.y - last.y) * 0.012, -1.45, 1.45); last = p; loop.once(); } }
      });
      const sph = (q) => {        // Stokes (S1, S2, S3) to the screen: [X (px), Y (px, down), nearness]
        const cy = Math.cos(view.yaw), sy = Math.sin(view.yaw), cp = Math.cos(view.pitch), sp = Math.sin(view.pitch);
        const xp = q[0] * cy - q[1] * sy, yp = q[0] * sy + q[1] * cy, zp = q[2];
        return [geo.cx + geo.R * xp, geo.cy - geo.R * (zp * cp + yp * sp), -yp * cp + zp * sp];
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        geo.R = Math.min(W * 0.3, Hh * 0.38); geo.cx = W * 0.4; geo.cy = Hh * 0.5;
        const chi = V.chi * D2R, psi = V.psi * D2R;
        const Sin = [1, V.p * Math.cos(2 * chi) * Math.cos(2 * psi), V.p * Math.cos(2 * chi) * Math.sin(2 * psi), V.p * Math.sin(2 * chi)];
        const t = V.t * D2R, make = d => V.el === 'pol' ? P.mueller.polarizer(t) : V.el === 'qwp' ? P.mueller.retarder(d == null ? Math.PI / 2 : d * Math.PI / 2, t) : V.el === 'hwp' ? P.mueller.retarder(d == null ? Math.PI : d * Math.PI, t) : V.el === 'ret' ? P.mueller.retarder(d == null ? V.dl * D2R : d * V.dl * D2R, t) : V.el === 'dep' ? P.mueller.depolarizer(V.f) : [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        const M = make(), Sout = P.mueller.apply(M, Sin);
        // the sphere: three great circles, front solid and back faint
        const circle = (f, col, w) => {
          let prev = null;
          for (let i = 0; i <= 96; i++) {
            const a = TAU * i / 96, pt = sph(f(Math.cos(a), Math.sin(a)));
            if (prev) { c.strokeStyle = col; c.globalAlpha = (pt[2] + prev[2]) / 2 > 0 ? 0.9 : 0.25; c.lineWidth = w; c.beginPath(); c.moveTo(prev[0], prev[1]); c.lineTo(pt[0], pt[1]); c.stroke(); }
            prev = pt;
          }
          c.globalAlpha = 1;
        };
        c.strokeStyle = C.faint; c.lineWidth = 1.3; c.beginPath(); c.arc(geo.cx, geo.cy, geo.R, 0, TAU); c.stroke();
        circle((a, b) => [a, b, 0], C.accent, 1.6);      // linear states
        circle((a, b) => [a, 0, b], C.faint, 1);
        circle((a, b) => [0, a, b], C.faint, 1);
        // the axes and the named states
        for (const [q, lab] of [[[1, 0, 0], 'H'], [[-1, 0, 0], 'V'], [[0, 1, 0], '+45°'], [[0, -1, 0], '−45°'], [[0, 0, 1], 'R'], [[0, 0, -1], 'L']]) {
          const a = sph(q), b = sph([q[0] * 1.14, q[1] * 1.14, q[2] * 1.14]);
          kit.dot(c, a[0], a[1], 3, a[2] > 0 ? C.text : C.faint);
          kit.label(c, lab, b[0], b[1], { align: 'center', size: 12, weight: 650, color: a[2] > 0 ? C.text : C.faint });
        }
        const o = sph([0, 0, 0]);
        for (const q of [[1.0, 0, 0], [0, 1.0, 0], [0, 0, 1.0]]) { const a = sph(q), b = sph([-q[0], -q[1], -q[2]]); c.strokeStyle = C.faint; c.lineWidth = 0.8; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(a[0], a[1]); c.stroke(); c.setLineDash([]); }
        kit.label(c, 'S₁', sph([1.25, 0, 0])[0], sph([1.25, 0, 0])[1] + 12, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'S₂', sph([0, 1.25, 0])[0], sph([0, 1.25, 0])[1] + 12, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'S₃', sph([0, 0, 1.25])[0] + 14, sph([0, 0, 1.25])[1], { align: 'center', size: 10.5, color: C.faint });
        // the path of the point as the element grows, then the two states
        if (V.el === 'qwp' || V.el === 'hwp' || V.el === 'ret') {
          const pts = []; for (let i = 0; i <= 40; i++) { const Sk = P.mueller.apply(make(i / 40), Sin); pts.push(sph([Sk[1], Sk[2], Sk[3]])); }
          c.strokeStyle = C.warn; c.lineWidth = 2.2; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
        } else if (V.el !== 'none') {
          const a = sph([Sin[1], Sin[2], Sin[3]]), b = sph([Sout[1] / (Sout[0] || 1), Sout[2] / (Sout[0] || 1), Sout[3] / (Sout[0] || 1)]);
          c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.setLineDash([]);
        }
        const pin = sph([Sin[1], Sin[2], Sin[3]]), s0 = Sout[0] || 1e-12, pout = sph([Sout[1] / s0, Sout[2] / s0, Sout[3] / s0]);
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.fillStyle = C.bg2; c.beginPath(); c.arc(pin[0], pin[1], 7, 0, TAU); c.fill(); c.stroke();
        if (Sout[0] > 1e-6) { kit.dot(c, pout[0], pout[1], 6, C.warn, C.text); }
        kit.label(c, 'ring: input · dot: output', geo.cx, Hh - 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'drag to turn the sphere', geo.cx, 16, { align: 'center', color: C.faint, size: 11 });
        const f2 = a => a.map(x => (Math.abs(x) < 5e-3 ? 0 : x).toFixed(2)).join('  ');
        ro.set('in', f2(Sin));
        ro.set('out', f2(Sout));
        ro.set('dop', Sout[0] < 1e-9 ? '—' : P.dop(Sout).toFixed(3));
        ['M1', 'M2', 'M3', 'M4'].forEach((k, i) => ro.set(k, '[ ' + f2(M[i]) + ' ]'));
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });
  /* ================================================================ optical activity and the Faraday effect */
  Hyper.sim('po-rotation', {
    title: 'Turning the plane of polarization: sugar, quartz and a magnet',
    blurb: `Linearly polarized light crosses a medium that turns its plane of vibration, and then an analyzer. Three media: a **sugar solution** and **quartz**, which turn the plane because their molecules or crystals are *handed*, and a **Faraday rotator**, which turns it because of a magnetic field along the beam. The dials show the plane (head-on, looking back towards the source) before the medium, after it, and after the analyzer.

**Try this**
- Sucrose, 26 g in 100 mL in a 2 dm tube: the plane turns by about 34.6° to the right (dextrorotatory). Turn the analyzer to 90° + 34.6° and the field goes dark again — that is how a **polarimeter** measures sugar.
- Choose fructose: the rotation is to the *left* and larger. Invert sugar (glucose and fructose together) turns slightly left: the sign flips on inversion, which is where the name comes from.
- Slide the wavelength from 700 to 450 nm: the rotation grows rapidly towards blue (roughly as 1/λ²), the same for quartz: 21.7° per mm at 589 nm, 41.5° at 436 nm.
- Switch to the Faraday rotator and tick *Mirror*: the light goes through twice. For sugar and quartz the second pass undoes the first (net 0°). For the magnet the second pass adds: net 2β. That non-reciprocity is what an optical isolator uses.

Rotation values for the sugars use the specific rotation at 589 nm with one common dispersion curve for all three: good to a few per cent. Absorption is ignored.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 300, maxH: 380 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 400, max: 700 }, y: { label: 'rotation (degrees, clockwise +)' }, legend: false, series: [] }, 190);
      const SUGARS = [['Sucrose (table sugar), [α] = +66.5', 66.5], ['Glucose (dextrose), +52.7', 52.7], ['Fructose (levulose), −92.4', -92.4], ['Invert sugar (glucose + fructose 1:1), about −20', (52.7 - 92.4) / 2]];
      const FAR = [['TGG crystal at 1064 nm, V ≈ 40 rad/(T·m)', 40], ['Water at 589 nm, V ≈ 3.8 rad/(T·m)', 3.8]];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The medium', options: [['Sugar solution (optical activity)', 'sugar'], ['Crystal quartz plate (optical activity)', 'quartz'], ['Faraday rotator (magnetic field)', 'far']], value: params.mode || 'sugar' },
        { id: 'sug', type: 'select', label: 'Sugar', options: SUGARS, value: params.sug != null ? params.sug : 66.5 },
        { id: 'conc', label: 'Concentration', min: 0, max: 60, step: 1, value: params.conc != null ? params.conc : 26, unit: 'g/100 mL' },
        { id: 'len', label: 'Tube length', min: 0.5, max: 4, step: 0.5, value: params.len || 2, unit: 'dm' },
        { id: 'qd', label: 'Quartz thickness', min: 0, max: 10, step: 0.1, value: params.qd != null ? params.qd : 1, unit: 'mm' },
        { id: 'wl', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.wl || 589, unit: 'nm' },
        { id: 'fm', type: 'select', label: 'Faraday medium', options: FAR, value: params.fm || 40 },
        { id: 'B', label: 'Magnetic field along the beam', min: 0, max: 2, step: 0.05, value: params.B != null ? params.B : 1, unit: 'T' },
        { id: 'L', label: 'Length in the field', min: 0, max: 100, step: 0.5, value: params.L != null ? params.L : 2, unit: 'cm' },
        { id: 'mir', type: 'check', label: 'Mirror at the end: send the light back', value: !!params.mir },
        { id: 'an', label: 'Analyzer, measured from the first polarizer', min: 0, max: 180, step: 1, value: params.an != null ? params.an : 90, unit: '°' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { const m = V.mode; ctl.show('sug', m === 'sugar'); ctl.show('conc', m === 'sugar'); ctl.show('len', m === 'sugar'); ctl.show('qd', m === 'quartz'); ctl.show('wl', m !== 'far'); ctl.show('fm', m === 'far'); ctl.show('B', m === 'far'); ctl.show('L', m === 'far'); ctl.show('an', !V.mir); };
      const ro = kit.readout(box.side, [['rot', 'The plane is turned by'], ['hand', 'Sense'], ['null', 'Analyzer dark at'], ['light', 'Light through the analyzer'], ['back', 'After the round trip']]);
      // Drude-type dispersion: quartz fitted to 21.7, 25.5, 41.5 and 48.9 °/mm at 589, 546, 436 and 405 nm; sugars share one curve through 589
      const quartz = nm => 7.157e6 / (nm * nm - 17473);
      const sugarK = nm => (589.3 * 589.3 - 146 * 146) / (nm * nm - 146 * 146);
      // rotation in degrees, clockwise looking back towards the source (dextro: +), for the current settings at wavelength nm
      const rotation = (nm, B) => V.mode === 'sugar' ? V.sug * V.len * (V.conc / 100) * sugarK(nm) : V.mode === 'quartz' ? quartz(nm) * V.qd : -V.fm * (B == null ? V.B : B) * (V.L / 100) * R2D;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const far = V.mode === 'far', nm = far ? (V.fm === 40 ? 1064 : 589) : V.wl, rot = rotation(nm);   // far: counter-clockwise by β is −β clockwise
        const y1 = Hh * 0.3, xs = [0.07, 0.19, 0.29, 0.61, 0.74, 0.9].map(f => f * W), R = Math.min(48, W * 0.07);
        const beam = (xa, xb, y) => { S.ray(c, [[xa, y], [xb, y]], { nm, width: 2.2, arrows: false }); };
        S.source(c, xs[0], y1, { kind: 'bulb', size: 12 });
        beam(xs[0] + 14, xs[2] - 4, y1);
        S.polarizer(c, xs[1], y1, 30, 0, { label: 'polarizer' });
        // the medium
        const m0 = xs[2], m1 = xs[3];
        if (V.mode === 'sugar') { c.fillStyle = 'rgba(255,190,70,' + (0.12 + 0.5 * V.conc / 60).toFixed(3) + ')'; c.fillRect(m0, y1 - 22, m1 - m0, 44); c.strokeStyle = S.edge(); c.lineWidth = 1.4; c.strokeRect(m0, y1 - 22, m1 - m0, 44); kit.label(c, 'sugar solution, ' + V.len + ' dm', (m0 + m1) / 2, y1 + 38, { align: 'center', color: C.muted, size: 11.5 }); }
        else if (V.mode === 'quartz') { S.block(c, m0 + 40, y1 - 26, Math.max(6, 8 + V.qd * 6), 52); kit.label(c, 'quartz, ' + V.qd.toFixed(1) + ' mm', (m0 + m1) / 2, y1 + 40, { align: 'center', color: C.muted, size: 11.5 }); }
        else {
          c.fillStyle = S.glass(0.35); c.fillRect(m0, y1 - 12, m1 - m0, 24); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.strokeRect(m0, y1 - 12, m1 - m0, 24);
          c.strokeStyle = C.warn; c.lineWidth = 2; for (let i = 0; i < 9; i++) { const x = m0 + 8 + (m1 - m0 - 16) * i / 8; c.beginPath(); c.ellipse(x, y1, 6, 24, 0, 0, TAU); c.stroke(); }
          kit.arrow(c, m0 + 12, y1 + 40, m1 - 12, y1 + 40, C.warn, 2, 8); kit.label(c, 'B = ' + V.B.toFixed(2) + ' T along the beam', (m0 + m1) / 2, y1 + 54, { align: 'center', color: C.warn, size: 11.5 });
        }
        beam(m1 + 2, V.mir ? xs[4] : xs[4] - 22, y1);
        const rotCCW = -rot, netBack = far ? 2 * rotCCW : 0;       // in the lab, seen head-on: optical activity is undone on the way back, a Faraday rotation adds
        if (V.mir) {
          c.fillStyle = S.metal(); c.fillRect(xs[4], y1 - 30, 5, 60); kit.label(c, 'mirror', xs[4] + 2, y1 - 40, { align: 'center', color: C.muted, size: 11.5 });
          const yb = y1 + 62; S.ray(c, [[xs[4], yb - 32], [xs[2], yb - 32]], { nm, width: 1.5, alpha: 0.7, arrows: true, minArrow: 40 });
        } else {
          S.polarizer(c, xs[4], y1, 30, Math.PI / 2 - V.an * D2R, { label: 'analyzer ' + V.an + '°' });
          const T = Math.pow(Math.cos((V.an - rotCCW) * D2R), 2);
          c.fillStyle = '#05060d'; c.fillRect(xs[5], y1 - 26, 10, 52); c.fillStyle = S.nm(nm, 0.06 + 0.94 * T); c.fillRect(xs[5], y1 - 26, 10, 52);
          kit.label(c, 'screen', xs[5] + 5, y1 - 36, { align: 'center', color: C.muted, size: 11.5 });
        }
        // dials: the plane before, after, and at the end
        const yd = Hh * 0.78, dx = [xs[1], (m0 + m1) / 2 + 20, V.mir ? xs[1] : xs[4]];
        dial(c, kit, C, dx[0], yd, R, null, { label: 'after the polarizer' }); dbl(c, kit, dx[0], yd, 0, R * 0.9, C.accent, 2.4);
        dial(c, kit, C, dx[1], yd, R, null, { label: 'after the medium' }); dbl(c, kit, dx[1], yd, rotCCW * D2R, R * 0.9, C.accent, 2.4);
        c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(dx[1], yd); c.lineTo(dx[1] + R, yd); c.stroke(); c.setLineDash([]);
        if (V.mir) { dial(c, kit, C, dx[2] + 2 * (dx[1] - dx[0]) + 10, yd, R, null, { label: 'back at the polarizer' }); dbl(c, kit, dx[2] + 2 * (dx[1] - dx[0]) + 10, yd, netBack * D2R, R * 0.9, C.accent, 2.4); }
        else { const amp = Math.abs(Math.cos((V.an - rotCCW) * D2R)); dial(c, kit, C, dx[2], yd, R, null, { label: 'after the analyzer' }); if (amp > 0.01) dbl(c, kit, dx[2], yd, V.an * D2R, R * 0.9 * amp, C.accent, 2.4); }
        // the curve
        const key = [V.mode, V.sug, V.conc, V.len, V.qd, V.wl, V.fm, V.B, V.L].join('|');
        if (key !== loop.key) {
          loop.key = key;
          const pts = [];
          if (far) { for (let b = 0; b <= 2.001; b += 0.05) pts.push([b, rotation(nm, b)]); plot.set({ x: { label: 'magnetic field (T)', min: 0, max: 2 }, y: { label: 'rotation (degrees; this sketch: counter-clockwise = negative)' }, series: [{ pts, label: 'rotation', color: C.series[1], width: 2.6 }], vlines: [{ x: V.B, label: V.B + ' T' }], marks: [{ x: V.B, y: rot, label: rot.toFixed(1) + '°' }] }); }
          else { for (let w = 400; w <= 700; w += 10) pts.push([w, rotation(w)]); plot.set({ x: { label: 'wavelength (nm)', min: 400, max: 700 }, y: { label: 'rotation (degrees, clockwise +)' }, series: [{ pts, label: 'rotation', color: C.series[0], width: 2.6 }], vlines: [{ x: V.wl, label: V.wl + ' nm' }], marks: [{ x: V.wl, y: rot, label: rot.toFixed(1) + '°' }] }); }
        }
        ro.set('rot', (rot >= 0 ? '+' : '−') + Math.abs(rot).toFixed(1) + '°');
        ro.set('hand', Math.abs(rot) < 0.05 ? 'none' : far ? (rot < 0 ? 'counter-clockwise (head-on) for this field direction' : 'clockwise') : rot > 0 ? 'to the right: dextrorotatory (clockwise, looking at the source)' : 'to the left: laevorotatory');
        ro.set('null', V.mir ? '(mirror in place)' : mod(90 + rotCCW, 180).toFixed(1) + '°   (90° plus the rotation)');
        ro.set('light', V.mir ? '(mirror in place)' : pct(Math.pow(Math.cos((V.an - rotCCW) * D2R), 2)));
        ro.set('back', V.mir ? (far ? 'turned by 2β = ' + (-2 * rot).toFixed(1) + '°  (non-reciprocal: it adds)' : 'turned by 0°  (reciprocal: it cancels)') : '(no mirror)');
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });
  /* ================================================================ white-light colours of a transmission spectrum */
  let LAMC = null;
  function spectralColour(O, Tfn) {
    if (!LAMC) {
      const lam = []; for (let l = 400; l <= 700; l += 15) lam.push(l);
      const cm = lam.map(l => O.colour.cmf(l)), white = [0, 0, 0];
      cm.forEach(m => { white[0] += m[0]; white[1] += m[1]; white[2] += m[2]; });
      LAMC = { lam, cm, wl: O.colour.toRgb(white) };
    }
    let X = 0, Y = 0, Z = 0;
    LAMC.lam.forEach((l, i) => { const T = Tfn(l); X += T * LAMC.cm[i][0]; Y += T * LAMC.cm[i][1]; Z += T * LAMC.cm[i][2]; });
    return O.colour.toRgb([X, Y, Z]).map((v, k) => v / LAMC.wl[k]);        // linear rgb, 1 = white
  }
  // a thin sheet drawn obliquely: x to the right, y into the page (up and to the right on the canvas)
  const OBL = [0.5, 0.35];
  function sheet(c, x, y, w, d, fill, stroke) {
    c.save(); c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w + d * OBL[0], y - d * OBL[1]); c.lineTo(x + d * OBL[0], y - d * OBL[1]); c.closePath();
    c.fillStyle = fill; c.fill(); c.strokeStyle = stroke; c.lineWidth = 1.2; c.stroke(); c.restore();
  }

  /* ================================================================ the twisted-nematic cell */
  Hyper.sim('po-twisted-nematic', {
    title: 'A twisted-nematic liquid-crystal cell between polarizers',
    blurb: `A layer of liquid crystal a few micrometres thick lies between two glass plates whose surfaces were rubbed in directions at 90° to each other, so the rod-like molecules lie along the rubbing at each plate and **twist** by a quarter turn between them. Light polarized along the first rubbing direction is *guided* round the twist and arrives turned by 90°: crossed polarizers let it through (a bright pixel). A voltage tilts the molecules upright, the twist and the birefringence disappear, the polarization is no longer turned, and the second polarizer blocks it (a dark pixel).

**Try this**
- At 0 V the cell is bright. Raise the voltage: nothing happens until a **threshold** of about 1.3 V, then the middle layers stand up and the picture darkens, reaching black near 4 – 5 V. The graph shows the whole curve.
- Change the cell gap. At 0 V the transmission peaks when Δn·d = 0.87 λ (4.8 µm for Δn = 0.10 at 550 nm), the **first Gooch–Tarry minimum**. A cell that is too thin or too thick is dimmer and coloured.
- Switch the analyzer to *Parallel*: now the pixel is dark with no voltage and bright with it (a "normally black" display).
- In white light the dark state is not perfectly black: the guiding is not exact at every wavelength, so some colour leaks.

The model slices the cell into 24 thin birefringent layers, each a rotated wave plate, and multiplies their Jones matrices; the tilt profile is a simple approximation with the surface layers held by the plates, so the voltages are typical rather than exact. The molecules at the two plates stay tied to them, which is why even the dark state leaks a little (about 1 %).`,
    mount(box, kit, params) {
      const O = kit.optics, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 340 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'voltage across the cell (V)', min: 0, max: 6 }, y: { label: 'light transmitted at 550 nm (fraction)', min: 0, max: 1 }, legend: false, series: [] }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Voltage', min: 0, max: 6, step: 0.05, value: params.v != null ? params.v : 0, unit: 'V' },
        { id: 'd', label: 'Cell gap d', min: 2, max: 10, step: 0.1, value: params.d || 4.8, unit: 'µm' },
        { id: 'dn', label: 'Birefringence Δn of the liquid crystal', min: 0.05, max: 0.2, step: 0.005, value: params.dn || 0.1 },
        { id: 'an', type: 'select', label: 'Second polarizer', options: [['Crossed (normally white)', 90], ['Parallel (normally black)', 0]], value: params.an != null ? params.an : 90 },
        { type: 'buttons', items: [{ id: 'off', label: 'Off (0 V)' }, { id: 'on', label: 'On (5 V)', primary: true }] }
      ], id => { if (id === 'off') ctl.set('v', 0); if (id === 'on') ctl.set('v', 5); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['u', 'Δn·d ÷ λ at 550 nm'], ['gt', 'Gooch–Tarry optimum d'], ['tilt', 'Tilt of the middle layer'], ['T', 'Transmission at 550 nm'], ['look', 'In white light']]);
      const NO = 1.5, VTH = 1.3, V0 = 0.8, N = 24;
      // the light leaving the cell (Jones vector) for voltage v, gap d (µm), birefringence dn, wavelength nm; the polarizer before it is at 0°
      const tiltOf = v => v <= VTH ? 0 : Math.PI / 2 - 2 * Math.atan(Math.exp(-(v - VTH) / V0));
      const through = (v, d, dn, nm) => {
        const ne = NO + dn, thm = tiltOf(v), dz = d * 1e-6 / N;
        let J = P.vec(0);
        for (let k = 0; k < N; k++) {
          const z = (k + 0.5) / N, th = thm * Math.pow(Math.sin(Math.PI * z), 0.35), phi = (Math.PI / 2) * z;
          const neff = NO * ne / Math.sqrt(ne * ne * Math.pow(Math.sin(th), 2) + NO * NO * Math.pow(Math.cos(th), 2));
          J = P.apply(P.retarder(2 * Math.PI * (neff - NO) * dz / (nm * 1e-9), phi + Math.PI / 2), J);   // slow axis along the molecules, so the fast axis is 90° from them
        }
        return J;
      };
      const trans = (v, d, dn, nm, an) => P.intensity(P.apply(P.polarizer(an * D2R), through(v, d, dn, nm)));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the light leaving the cell, its transmission, the colour of the pixel and the curve: recomputed only when a setting changes
        const key = [V.v, V.d, V.dn, V.an].join('|');
        if (key !== loop.key) {
          loop.key = key;
          loop.J = through(V.v, V.d, V.dn, 550); loop.T = P.intensity(P.apply(P.polarizer(V.an * D2R), loop.J));
          loop.rgb = O.colour.srgb(spectralColour(O, nm => trans(V.v, V.d, V.dn, nm, V.an)));
          const ck = [V.d, V.dn, V.an].join('|');
          if (ck !== loop.ck) { loop.ck = ck; const pts = []; for (let v = 0; v <= 6.001; v += 0.1) pts.push([v, trans(v, V.d, V.dn, 550, V.an)]); loop.pts = pts; }
          loop.plotDue = true;
        }
        const thm = tiltOf(V.v), J = loop.J, T = loop.T;
        // ----- the stack, bottom (backlight) to top (the viewer), drawn obliquely
        const x0 = W * 0.08, sw = W * 0.4, sd = 60, ys = { bl: Hh * 0.93, p1: Hh * 0.84, g1: Hh * 0.75, lc: Hh * 0.45, g2: Hh * 0.32, p2: Hh * 0.2 };
        c.fillStyle = S_(C).glow; c.fillRect(x0 - 6, ys.bl, sw + sd * OBL[0] + 12, 8);
        kit.label(c, 'backlight', x0 + sw + sd * OBL[0] + 14, ys.bl + 4, { color: C.muted, size: 11.5 });
        const axisArrow = (y, ang, label, col) => {
          const cxs = x0 + sw / 2 + sd * OBL[0] / 2, cys = y - sd * OBL[1] / 2, L = sw * 0.3, vx = (Math.cos(ang) + OBL[0] * Math.sin(ang)) * L, vy = -(OBL[1] * Math.sin(ang)) * L;
          kit.arrow(c, cxs - vx, cys - vy, cxs + vx, cys + vy, col || C.warn, 2, 8);
          if (label) kit.label(c, label, x0 + sw + sd * OBL[0] + 14, y - 8, { color: col || C.warn, size: 11.5 });
        };
        sheet(c, x0, ys.p1, sw, sd, S_(C).pol, C.faint); axisArrow(ys.p1, 0, 'polarizer 1: axis 0°', C.text);
        sheet(c, x0, ys.g1, sw, sd, S_(C).glass, C.faint); axisArrow(ys.g1, 0, 'glass, rubbed at 0°', C.warn);
        sheet(c, x0, ys.g2, sw, sd, S_(C).glass, C.faint); axisArrow(ys.g2, Math.PI / 2, 'glass, rubbed at 90°', C.warn);
        sheet(c, x0, ys.p2, sw, sd, S_(C).pol, C.faint); axisArrow(ys.p2, V.an * D2R, 'polarizer 2: axis ' + V.an + '°', C.text);
        // the molecules, layer by layer
        const nl = 7, cxm = x0 + sw / 2 + sd * OBL[0] / 2;
        c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(x0, ys.g1 - 4); c.lineTo(x0, ys.g2 + 4); c.moveTo(x0 + sw, ys.g1 - 4); c.lineTo(x0 + sw, ys.g2 + 4); c.stroke(); c.setLineDash([]);
        for (let k = 0; k < nl; k++) {
          const z = (k + 0.5) / nl, th = thm * Math.pow(Math.sin(Math.PI * z), 0.35), phi = (Math.PI / 2) * z, y = ys.g1 - 14 - (ys.g1 - ys.g2 - 28) * z;
          const nx = Math.cos(th) * Math.cos(phi), ny = Math.cos(th) * Math.sin(phi), nz = Math.sin(th), L = 34;
          const sx = (nx + OBL[0] * ny) * L, sy = -(OBL[1] * ny + nz) * L;
          c.strokeStyle = C.accent; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(cxm - sx, y - sy); c.lineTo(cxm + sx, y + sy); c.stroke();
          c.strokeStyle = C.bg2; c.lineWidth = 2; c.beginPath(); c.moveTo(cxm - sx * 0.8, y - sy * 0.8); c.lineTo(cxm + sx * 0.8, y + sy * 0.8); c.stroke();
        }
        c.lineCap = 'butt';
        kit.label(c, 'liquid crystal: molecules twist 90° between the plates', x0 + sw + sd * OBL[0] + 14, (ys.g1 + ys.g2) / 2, { color: C.muted, size: 11.5 });
        // ----- the pixel and the light leaving the cell
        const px = W * 0.7, py = Hh * 0.08, ps = Math.min(W * 0.2, Hh * 0.3);
        c.fillStyle = '#05060d'; c.fillRect(px - 6, py - 6, ps + 12, ps + 12); c.fillStyle = 'rgb(' + loop.rgb.join(',') + ')'; c.fillRect(px, py, ps, ps);
        kit.label(c, 'the pixel, in white light', px + ps / 2, py + ps + 18, { align: 'center', color: C.muted, size: 11.5 });
        dial(c, kit, C, px + ps / 2, Hh * 0.7, Math.min(54, W * 0.08), J, { t: loop.t * 3, label: 'light leaving the cell' });
        c.save(); c.strokeStyle = C.text; c.setLineDash([4, 3]); c.lineWidth = 1.4; const dr = Math.min(54, W * 0.08), ax = Math.cos(V.an * D2R), ay = Math.sin(V.an * D2R);
        c.beginPath(); c.moveTo(px + ps / 2 - ax * dr, Hh * 0.7 + ay * dr); c.lineTo(px + ps / 2 + ax * dr, Hh * 0.7 - ay * dr); c.stroke(); c.restore();
        kit.label(c, 'dashed: axis of polarizer 2', px + ps / 2, Hh * 0.7 + dr + 30, { align: 'center', color: C.faint, size: 11 });
        // ----- the curve
        if (loop.plotDue) { loop.plotDue = false; plot.set({ series: [{ pts: loop.pts, label: 'transmission', color: C.series[0], width: 2.6 }], vlines: [{ x: V.v, label: V.v.toFixed(1) + ' V' }], marks: [{ x: V.v, y: T, label: (100 * T).toFixed(1) + ' %' }] }); }
        ro.set('u', (V.dn * V.d / 0.55).toFixed(2) + '   (first optimum 0.87)');
        ro.set('gt', (0.866 * 0.55 / V.dn).toFixed(2) + ' µm  for this Δn');
        ro.set('tilt', (thm * R2D).toFixed(0) + '° from the plates' + (V.v <= VTH ? '  (below threshold)' : ''));
        ro.set('T', pct(T));
        ro.set('look', T > 0.5 ? 'bright' : T > 0.05 ? 'grey' : 'dark');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
  // theme tints for the sheets
  const S_ = C => C.dark ? { glow: '#e9d98a', pol: 'rgba(160,170,200,0.22)', glass: 'rgba(130,190,255,0.14)' } : { glow: '#f2c94c', pol: 'rgba(90,100,130,0.18)', glass: 'rgba(60,130,220,0.12)' };

  /* ================================================================ polarization at work */
  Hyper.sim('po-practice', {
    title: 'Polarization at work: glare, screens and 3-D glasses',
    blurb: `Three everyday uses of polarizers. Choose one with *The scene*.

**Glare off water.** Sunlight reflects from a lake; the picture is split: the left half is what the eye sees, the right half what it sees through a polarizing filter. Glare veils the lake bed to the extent shown in the read-out. Turn the filter between 0° (axis horizontal, passes the glare) and 90° (axis vertical, the sunglasses setting), and go to Brewster's angle.

**A screen through sunglasses.** A liquid-crystal screen gives out linearly polarized light. Tilt your head and the screen brightens and darkens as $\\cos^2$ of the angle between its axis and that of the lenses; it goes black when they are crossed. The direction of the screen's polarization differs from model to model.

**3-D cinema.** The two eyes' pictures are given opposite polarizations: at 45° and 135° (linear), or right and left circular. The glasses pass one and block the other. Tilt your head: with linear glasses the wrong picture leaks in as $\\sin^2$ of the tilt; with circular glasses it never does.

**Try this**
- Glare at 53°, filter at 90°: the veil nearly vanishes. Filter at 0°: the veil is as strong as without a filter. At 10° from the surface (θ = 80°) the glare is too strong for any filter to clear.
- Screen, vertical axis: head upright, bright; tilt 90°, black. Put the screen at 45° and the result is mid-way upright, and bright or dark when the head tilts ±45°.
- 3-D, linear: tilt your head 20° and read the ghost; switch to circular and tilt again.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The scene', options: [['Glare off water, and a polarizing filter', 'glare'], ['A liquid-crystal screen through sunglasses', 'screen'], ['3-D cinema glasses', '3d']], value: params.mode || 'glare' },
        { id: 'theta', label: 'Angle of incidence of the glare', min: 20, max: 85, step: 1, value: params.theta != null ? params.theta : 53, unit: '°' },
        { id: 'surf', type: 'select', label: 'The surface', options: [['Water', 'water'], ['Glass (a shop window)', 'N-BK7']], value: params.surf || 'water' },
        { id: 'beta', label: 'Filter axis: 0° horizontal, 90° vertical', min: 0, max: 90, step: 1, value: params.beta != null ? params.beta : 90, unit: '°' },
        { id: 'scr', type: 'select', label: 'The screen\'s polarization axis', options: [['Vertical', 90], ['Horizontal', 0], ['Diagonal, 45°', 45]], value: params.scr != null ? params.scr : 90 },
        { id: 'head', label: 'Tilt of your head', min: 0, max: 90, step: 1, value: params.head != null ? params.head : 0, unit: '°' },
        { id: 'sys', type: 'select', label: 'The 3-D system', options: [['Linear polarization (45° and 135°)', 'lin'], ['Circular polarization (right and left)', 'circ']], value: params.sys || 'lin' },
        { id: 'tilt', label: 'Tilt of your head', min: -45, max: 45, step: 1, value: params.tilt != null ? params.tilt : 0, unit: '°' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { const m = V.mode; ctl.show('theta', m === 'glare'); ctl.show('surf', m === 'glare'); ctl.show('beta', m === 'glare'); ctl.show('scr', m === 'screen'); ctl.show('head', m === 'screen'); ctl.show('sys', m === '3d'); ctl.show('tilt', m === '3d'); };
      const ro = kit.readout(box.side, [['a', 'What reaches the eye'], ['b', 'Compared with no filter'], ['c', 'Note']]);
      const mixc = (a, b, t) => 'rgb(' + [0, 1, 2].map(i => Math.round(a[i] + (b[i] - a[i]) * t)).join(',') + ')';
      const SKY = [205, 222, 255];
      // a lake bed seen through the surface: pebbles and a fish, veiled by a fraction f of sky
      const lake = (c, C, x, y, w, h, f, dim) => {
        c.fillStyle = mixc([34, 82, 92], SKY, f); c.fillRect(x, y, w, h);
        const seeds = [[0.12, 0.2, 0.07], [0.3, 0.7, 0.09], [0.52, 0.3, 0.06], [0.7, 0.75, 0.08], [0.85, 0.25, 0.07], [0.45, 0.55, 0.05], [0.2, 0.5, 0.05], [0.9, 0.6, 0.06]];
        seeds.forEach((s, i) => { c.fillStyle = mixc(i % 2 ? [92, 112, 96] : [120, 104, 80], SKY, f); c.beginPath(); c.ellipse(x + s[0] * w, y + s[1] * h, s[2] * w, s[2] * w * 0.6, 0.3 * i, 0, TAU); c.fill(); });
        c.fillStyle = mixc([210, 120, 50], SKY, f); c.beginPath(); c.ellipse(x + 0.6 * w, y + 0.45 * h, 0.09 * w, 0.045 * w, -0.2, 0, TAU); c.fill(); c.beginPath(); c.moveTo(x + 0.69 * w, y + 0.45 * h - 6); c.lineTo(x + 0.75 * w, y + 0.45 * h - 10); c.lineTo(x + 0.75 * w, y + 0.45 * h + 2); c.fill();
        c.strokeStyle = C.faint; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        if (dim) { c.fillStyle = 'rgba(0,0,0,' + dim + ')'; c.fillRect(x, y, w, h); }
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'glare') {
          const n = O.index(V.surf, 550), f = O.fresnel(1, n, V.theta * D2R), g = V.beta * D2R;
          const Lb = 0.05, Ls = 1, T = 1 - 0.5 * (f.Rs + f.Rp);
          const scene0 = Lb * T, glare0 = 0.5 * Ls * (f.Rs + f.Rp), scene1 = 0.5 * Lb * T, glare1 = 0.5 * Ls * (f.Rs * Math.pow(Math.cos(g), 2) + f.Rp * Math.pow(Math.sin(g), 2));
          const veil0 = glare0 / (glare0 + scene0), veil1 = glare1 / (glare1 + scene1), w = W * 0.4, h = Hh * 0.62, y = Hh * 0.2;
          lake(c, C, W * 0.06, y, w, h, veil0, 0); lake(c, C, W * 0.54, y, w, h, veil1, 0);
          kit.label(c, 'no filter', W * 0.06 + w / 2, y - 12, { align: 'center', color: C.muted, size: 12.5, weight: 650 });
          kit.label(c, 'with the filter', W * 0.54 + w / 2, y - 12, { align: 'center', color: C.muted, size: 12.5, weight: 650 });
          S.polarizer(c, W * 0.54 + w - 24, y + 30, 22, Math.PI / 2 - g, { squash: 0.3 });
          kit.label(c, 'veil ' + Math.round(100 * veil0) + ' %', W * 0.06 + w / 2, y + h + 18, { align: 'center', color: C.text, size: 12 });
          kit.label(c, 'veil ' + Math.round(100 * veil1) + ' %   ·   scene light halved', W * 0.54 + w / 2, y + h + 18, { align: 'center', color: C.text, size: 12 });
          ro.set('a', 'veil of reflected sky: ' + Math.round(100 * veil1) + ' % of what you see');
          ro.set('b', 'glare cut to ' + (glare0 > 0 ? Math.round(100 * glare1 / glare0) : 0) + ' % (the scene to 50 %)');
          ro.set('c', 'Rs = ' + pct(f.Rs) + ', Rp = ' + pct(f.Rp) + ' at ' + V.theta + '°; Brewster ' + (O.brewster(1, n) * R2D).toFixed(1) + '°');
        } else if (V.mode === 'screen') {
          const lens = 90 - V.head, T = P.malus((lens - V.scr) * D2R), dd = Math.abs(mod(lens - V.scr + 90, 180) - 90);
          const sx = W * 0.3, sy = Hh * 0.12, sw = W * 0.42, sh = Hh * 0.62, k = 0.04 + 0.96 * T;
          c.fillStyle = '#090b16'; c.fillRect(sx - 8, sy - 8, sw + 16, sh + 16);
          const blocks = [[0.05, 0.08, 0.9, 0.12, [60, 120, 230]], [0.05, 0.28, 0.42, 0.55, [240, 240, 245]], [0.53, 0.28, 0.42, 0.25, [235, 170, 60]], [0.53, 0.6, 0.42, 0.23, [70, 190, 130]]];
          blocks.forEach(b => { c.fillStyle = 'rgb(' + b[4].map(v => Math.round(v * k)).join(',') + ')'; c.fillRect(sx + b[0] * sw, sy + b[1] * sh, b[2] * sw, b[3] * sh); });
          dial(c, kit, C, sx - 70, Hh * 0.3, 36, null, { label: 'the screen\'s axis' }); dbl(c, kit, sx - 70, Hh * 0.3, V.scr * D2R, 32, C.warn, 2.6);
          dial(c, kit, C, sx - 70, Hh * 0.68, 36, null, { label: 'the glasses\' axis' }); dbl(c, kit, sx - 70, Hh * 0.68, lens * D2R, 32, C.accent, 2.6);
          kit.label(c, 'brightness ' + Math.round(100 * T) + ' % of the most the lenses allow', sx + sw / 2, sy + sh + 28, { align: 'center', color: C.text, size: 12.5 });
          ro.set('a', Math.round(100 * T) + ' % of the screen\'s light');
          ro.set('b', 'cos²(' + dd.toFixed(0) + '°) = ' + T.toFixed(3));
          ro.set('c', T < 0.02 ? 'dark: the glasses are crossed to the screen' : 'Sunglasses have a vertical axis when you stand upright');
        } else {
          const tau = V.tilt * D2R, lin = V.sys === 'lin';
          // the pictures as polarized states, and the lenses as chains of elements
          const L = lin ? P.vec(135 * D2R) : P.vec('L'), R = lin ? P.vec(45 * D2R) : P.vec('R');
          const rightLens = lin ? [P.polarizer(45 * D2R + tau)] : [P.qwp(tau), P.polarizer(Math.PI / 4 + tau)], leftLens = lin ? [P.polarizer(135 * D2R + tau)] : [P.qwp(tau), P.polarizer(-Math.PI / 4 + tau)];
          const through = (v, ch) => P.intensity(P.chain(v, ch));
          const rr = through(R, rightLens), rl = through(L, rightLens), lr = through(R, leftLens), ll = through(L, leftLens);
          const ghostR = rl / (rr + rl || 1), ghostL = lr / (ll + lr || 1);
          const pw = W * 0.4, ph = Hh * 0.46, py = Hh * 0.22;
          [[W * 0.06, 'right eye', rr, rl, C.accent, C.warn], [W * 0.54, 'left eye', ll, lr, C.warn, C.accent]].forEach(p => {
            c.fillStyle = '#090b16'; c.fillRect(p[0], py, pw, ph);
            c.globalAlpha = clamp(0.1 + 0.9 * p[2], 0, 1); kit.dot(c, p[0] + pw * 0.42, py + ph / 2, 30, p[4]); c.globalAlpha = 1;
            c.globalAlpha = clamp(p[3] * 6, 0, 1) * 0.9; c.strokeStyle = p[5]; c.lineWidth = 4; c.beginPath(); c.arc(p[0] + pw * 0.58, py + ph / 2, 30, 0, TAU); c.stroke(); c.globalAlpha = 1;
            kit.label(c, p[1] + ': its picture (disc), a ghost of the other (ring)', p[0], py - 12, { color: C.muted, size: 11.5 });
          });
          S.polarizer(c, W * 0.28, Hh * 0.88, 24, Math.PI / 2 - (lin ? 45 * D2R + tau : 0), { label: lin ? 'right lens' : 'right lens: λ/4 + polarizer' });
          S.polarizer(c, W * 0.7, Hh * 0.88, 24, Math.PI / 2 - (lin ? 135 * D2R + tau : 0), { label: lin ? 'left lens' : 'left lens: λ/4 + polarizer' });
          ro.set('a', 'right eye: ' + Math.round(100 * rr) + ' % of its picture, ghost ' + (100 * ghostR).toFixed(1) + ' %');
          ro.set('b', 'left eye: ' + Math.round(100 * ll) + ' % of its picture, ghost ' + (100 * ghostL).toFixed(1) + ' %');
          ro.set('c', lin ? 'ghost = sin²(tilt) = ' + Math.pow(Math.sin(tau), 2).toFixed(3) : 'circular: independent of tilt');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });

  /* ================================================================ photoelasticity */
  let FTAB = null;
  // linear white-balanced rgb of white light through retardation N·550 nm between crossed polarizers, N from 0 to 15 in steps of 0.01
  function fringeTable(O) {
    if (FTAB) return FTAB;
    FTAB = [];
    for (let i = 0; i <= 1500; i++) { const N = i * 0.01; FTAB.push(spectralColour(O, nm => Math.pow(Math.sin(Math.PI * N * 550 / nm), 2))); }
    return FTAB;
  }
  Hyper.sim('po-photoelastic', {
    title: 'Photoelasticity: seeing stress between polarizers',
    blurb: `A transparent part between two polarizers, lit from behind. Stress makes the material birefringent; the part delays one polarization behind the other by $N$ wavelengths, with $N = C\\,t\\,(\\sigma_1 - \\sigma_2)/\\lambda$, where $C$ is the stress-optic coefficient, $t$ the thickness, and $\\sigma_1 - \\sigma_2$ the difference of the two principal stresses. Where $N$ is a whole number the light between crossed polarizers vanishes (white light: the colour drops out and a coloured band appears): these are the **isochromatic fringes**. The black bands that cross them and move when the polarizers turn are the **isoclinics**, where the principal stress directions match the polarizers' axes.

**Try this**
- *Disc squeezed between two jaws* in polycarbonate: a ring of coloured fringes round each jaw, and a black cross in the plane polariscope. Raise the force: new fringes are born at the jaws and move inwards. Count them to the centre: $N = 8CF/(\\pi D\\lambda)$.
- Switch to *Circular* (quarter-wave plates added): the black isoclinic cross disappears and only the fringes remain.
- *Bar in bending*: straight fringes parallel to the neutral axis, equally spaced, because the stress rises linearly from the middle. Turn the polarizer to 0° and the whole bar goes black: the bar's stress axes are then along the polarizer.
- Choose *Window glass*: it takes a hundred times more stress to make the same fringes, because $C$ is a hundred times smaller.
- *Edge of tempered glass*: looking along the plate you see bands where the compression at the surface gives way to tension in the core, black at the two neutral planes.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'position along the dashed line (mm)' }, y: { label: 'fringe order N (at 550 nm)', min: 0 }, legend: false, series: [] }, 170);
      const MATS = [['Polycarbonate (C ≈ 75 TPa⁻¹)', 75], ['Photoelastic epoxy (C ≈ 55 TPa⁻¹)', 55], ['Acrylic, PMMA (|C| ≈ 4.5 TPa⁻¹)', 4.5], ['Window glass (C ≈ 2.7 TPa⁻¹)', 2.7]];
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'The part', options: [['Disc squeezed between two jaws', 'disc'], ['Bar in bending', 'beam'], ['Edge of tempered glass', 'temper']], value: params.model || 'disc' },
        { id: 'C', type: 'select', label: 'Material', options: MATS, value: params.C || 75 },
        { id: 'F', label: 'Force on the disc', min: 10, max: 1000, step: 10, value: params.F || 300, unit: 'N' },
        { id: 'M', label: 'Bending moment on the bar', min: 0, max: 6, step: 0.1, value: params.M != null ? params.M : 3, unit: 'N·m' },
        { id: 'sig', label: 'Surface compression of the glass', min: 0, max: 150, step: 5, value: params.sig != null ? params.sig : 100, unit: 'MPa' },
        { id: 'Lp', label: 'Light path along the plate', min: 2, max: 30, step: 1, value: params.Lp || 12, unit: 'mm' },
        { id: 't', label: 'Thickness of the part', min: 2, max: 12, step: 0.5, value: params.t || 6, unit: 'mm' },
        { id: 'pol', type: 'select', label: 'Polariscope', options: [['Plane: crossed polarizers', 'plane'], ['Circular: with quarter-wave plates', 'circ']], value: params.pol || 'plane' },
        { id: 'alpha', label: 'Polarizer angle (plane polariscope)', min: 0, max: 90, step: 1, value: params.alpha != null ? params.alpha : 45, unit: '°' },
        { id: 'light', type: 'select', label: 'Light', options: [['White', 'white'], ['Green, 550 nm', 'mono']], value: params.light || 'white' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { const m = V.model; ctl.show('C', m !== 'temper'); ctl.show('F', m === 'disc'); ctl.show('M', m === 'beam'); ctl.show('sig', m === 'temper'); ctl.show('Lp', m === 'temper'); ctl.show('t', m !== 'temper'); ctl.show('alpha', V.pol === 'plane'); };
      const ro = kit.readout(box.side, [['N', 'Fringe order, the largest shown'], ['per', 'Stress per fringe, λ/(C t)'], ['what', 'What the fringes tell']]);
      const lam = 550e-9, D = 0.03, R = D / 2, HB = 0.02;
      // principal stress difference (Pa) and principal direction (rad) at a point
      const discAt = (x, y, F, t) => {                                   // x, y in metres from the centre; jaws at (0, ±R), force F along y
        const r1 = x * x + (R - y) * (R - y), r2 = x * x + (R + y) * (R + y), k = 2 * F / (Math.PI * t);
        if (r1 < 1e-8 || r2 < 1e-8) return { ds: 0, th: 0 };
        const sx = -k * ((R - y) * x * x / (r1 * r1) + (R + y) * x * x / (r2 * r2) - 1 / D), sy = -k * (Math.pow(R - y, 3) / (r1 * r1) + Math.pow(R + y, 3) / (r2 * r2) - 1 / D), tau = k * ((R - y) * (R - y) * x / (r1 * r1) - (R + y) * (R + y) * x / (r2 * r2));
        return { ds: Math.sqrt((sx - sy) * (sx - sy) + 4 * tau * tau), th: 0.5 * Math.atan2(2 * tau, sx - sy) };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, tab = fringeTable(O);
        const Cc = (V.model === 'temper' ? 2.7 : V.C) * 1e-12, t = V.t * 1e-3, al = V.alpha * D2R;
        // fringe order at 550 nm and principal angle at a point of the part, in the picture's own units
        let field, dashed;
        if (V.model === 'disc') field = (u, v) => { const d = discAt(u * R, v * R, V.F, t), N = Cc * t * d.ds / lam; return { N, th: d.th }; };
        else if (V.model === 'beam') field = (u, v) => { const sg = 6 * V.M * v / (t * HB * HB), N = Cc * t * Math.abs(sg) / lam; return { N, th: 0 }; };
        else field = (u, v) => { const z = v, sg = (V.sig * 1e6 / 2) * (1 - 3 * z * z), N = Cc * V.Lp * 1e-3 * Math.abs(sg) / lam; return { N, th: 0 }; };
        // (u, v) run from −1 to 1 over the part
        let x, y, w, h;
        if (V.model === 'disc') { h = Math.min(Hh * 0.9, W * 0.5); w = h; x = W * 0.06; y = (Hh - h) / 2; }
        else if (V.model === 'beam') { w = W * 0.62; h = w / 4; x = W * 0.05; y = (Hh - h) / 2; }
        else { w = W * 0.62; h = w / 3; x = W * 0.05; y = (Hh - h) / 2; }
        const nx = V.model === 'disc' ? 96 : 120, ny = V.model === 'disc' ? 96 : 40;
        const colourOf = (N, th) => {
          const iso = V.pol === 'plane' ? Math.pow(Math.sin(2 * (th - al)), 2) : 1;
          if (V.light === 'mono') { const I = iso * Math.pow(Math.sin(Math.PI * N), 2), g = O.colour.wavelength(550), q = Math.pow(I, 0.45); return [g[0] * q, g[1] * q, g[2] * q]; }
          const lin = tab[Math.min(1500, Math.round(N * 100))];
          return O.colour.srgb([lin[0] * iso, lin[1] * iso, lin[2] * iso]);
        };
        c.save();
        if (V.model === 'disc') { c.beginPath(); c.arc(x + w / 2, y + h / 2, w / 2, 0, TAU); c.clip(); }
        S.cells(c, x, y, w, h, nx, ny, (u, v) => { const q = field(2 * u - 1, 1 - 2 * v); return colourOf(q.N, q.th); });
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.3;
        if (V.model === 'disc') {
          c.beginPath(); c.arc(x + w / 2, y + h / 2, w / 2, 0, TAU); c.stroke();
          c.fillStyle = C.muted; c.fillRect(x + w / 2 - 22, y - 8, 44, 8); c.fillRect(x + w / 2 - 22, y + h, 44, 8);
          kit.arrow(c, x + w / 2 + 40, y - 24, x + w / 2 + 40, y - 2, C.warn, 2.4, 8); kit.arrow(c, x + w / 2 + 40, y + h + 24, x + w / 2 + 40, y + h + 2, C.warn, 2.4, 8);
          kit.label(c, 'F', x + w / 2 + 50, y - 16, { color: C.warn, weight: 650 }); kit.label(c, 'F', x + w / 2 + 50, y + h + 16, { color: C.warn, weight: 650 });
          dashed = [[x, y + h / 2], [x + w, y + h / 2]];
        } else if (V.model === 'beam') {
          c.strokeRect(x, y, w, h);
          kit.label(c, 'M', x - 12, y + h / 2, { color: C.warn, weight: 650, align: 'center' }); kit.label(c, 'M', x + w + 12, y + h / 2, { color: C.warn, weight: 650, align: 'center' });
          c.strokeStyle = C.warn; c.lineWidth = 2.2; c.beginPath(); c.arc(x - 6, y + h / 2, h * 0.35, -1.0, 1.0); c.stroke(); c.beginPath(); c.arc(x + w + 6, y + h / 2, h * 0.35, Math.PI - 1.0, Math.PI + 1.0); c.stroke();
          dashed = [[x + w / 2, y], [x + w / 2, y + h]];
        } else {
          c.strokeRect(x, y, w, h);
          kit.label(c, 'surface: compression', x + w / 2, y - 10, { align: 'center', color: C.muted, size: 11.5 }); kit.label(c, 'core: tension, half as strong', x + w / 2, y + h / 2 - 1, { align: 'center', color: C.bg2, size: 11, weight: 650 });
          kit.label(c, 'surface: compression', x + w / 2, y + h + 12, { align: 'center', color: C.muted, size: 11.5 });
          dashed = [[x + w / 2, y], [x + w / 2, y + h]];
        }
        c.save(); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(dashed[0][0], dashed[0][1]); c.lineTo(dashed[1][0], dashed[1][1]); c.stroke(); c.restore();
        // the graph along the dashed line, and the numbers
        const pts = [];
        for (let i = 0; i <= 60; i++) {
          const s = -1 + 2 * i / 60;
          if (V.model === 'disc') pts.push([s * R * 1e3, field(s, 0).N]);
          else if (V.model === 'beam') pts.push([s * HB * 500, field(0, s).N]);
          else pts.push([s * 3, field(0, s).N]);
        }
        const xl = V.model === 'disc' ? 'position along the horizontal diameter (mm)' : V.model === 'beam' ? 'height above the neutral axis (mm)' : 'depth through the plate, half-thickness = 3 mm (schematic)';
        plot.set({ x: { label: xl }, series: [{ pts, label: 'fringe order', color: C.series[1], width: 2.4 }] });
        const Nc = V.model === 'disc' ? field(0, 0).N : field(0, 1).N;
        ro.set('N', V.model === 'disc' ? field(0, 0).N.toFixed(1) + ' at the centre (rising towards the jaws)' : Nc.toFixed(1) + (V.model === 'beam' ? ' at the edges of the bar' : ' at the surface'));
        const per = V.model === 'temper' ? lam / (Cc * V.Lp * 1e-3) : lam / (Cc * t);
        ro.set('per', (per / 1e6).toFixed(per < 1e5 ? 2 : 1) + ' MPa per fringe' + (V.model === 'temper' ? ' (for this path)' : ''));
        ro.set('what', V.model === 'disc' ? 'N at the centre = 8CF/(πDλ), whatever the thickness' : V.model === 'beam' ? 'N rises linearly from the neutral axis; thickness cancels' : 'N follows the parabolic stress, zero at ±0.58 of the half-thickness');
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });
})();
