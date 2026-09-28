/* HYPER-FEYNMAN · sims/motion-energy.js — simulations for Motion, Energy and Gravitation (prefix mot-).
 *   mot-energy-blocks  a weight bouncing on a spring, its energy drawn as blocks: some in sight, some hidden in a height,
 *                      a stretch or a warm damper and counted from gauges; the total never changes
 *   mot-scales         two logarithmic rulers, distance and time, joined by the speed of light, with nature's landmarks
 *   mot-zoom           speed at an instant: the slope Δx/Δt of a chord as Δt shrinks, with a magnifier on the curve
 *   mot-stepper        Newton's law solved step by step for a spring and for a planet, with the table of numbers
 *   mot-collide        carts colliding (elastic, sticky or between), seen from the ground and from a moving frame
 *   mot-rotated-axes   a thrown ball described in two sets of axes: components differ, F = ma holds in both
 *   mot-pseudo         a carriage that accelerates: a hanging bob and a box, from the ground and from inside
 *   mot-contour        work along two paths across a potential landscape; path independence, and a swirl that breaks it
 *   mot-cannon         Newton's cannon: fall and curvature, and the Moon falling 1/3600 as fast
 *   mot-kepler         an orbit that sweeps equal areas, Newton's kicks, and T² against a³
 *   mot-hodograph      Feynman's lost lecture: equal angles, equal kicks, the velocity circle, and the ellipse rebuilt
 *   mot-grav-elec      gravity against electricity for two particles and for two people
 */
(function () {
  'use strict';

  const FONT = () => (typeof getComputedStyle === 'function' && getComputedStyle(document.body).fontFamily) || 'sans-serif';
  const font = (c, px, w) => { c.font = (w || 500) + ' ' + px + 'px ' + FONT(); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = (v, d) => (Number.isFinite(v) ? v : (d || 0));

  /* ================================================================ energy blocks */
  Hyper.sim('mot-energy-blocks', {
    title: 'Counting energy blocks',
    blurb: `A weight hangs from a spring beside a damper. Released from where the spring is unstretched, it drops, bounces and slowly settles. Its energy is drawn as **blocks** — 60 of them at the start. The bins hold the energy of **motion** ½mv², of **height** mgh (measured from the floor), stored in the **spring** ½kx², and the **heat** made in the air and the damper. Blocks fly from bin to bin, but the [[?sum]] of the four is always the same.

**Try this**
- Watch one bounce: at the top everything is height; halfway down the blocks sit in motion; at the bottom the spring holds most of them.
- Tick *Hide the stored forms*: only the motion is in sight. The rest must be worked out from the gauges — the height on the ruler, the stretch of the spring, the thermometer on the damper — and they still add up to the same total.
- Untick *Count the heat* and turn the damper up: the total seems to leak away. Nothing is lost; you have stopped counting where it went.
- Press *Push down* while the weight moves down: your hand does work and new blocks arrive from outside. Push while it moves up and your hand takes some away.
- Set the damper to zero: without heat, motion, height and spring trade blocks for ever.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Mass of the weight', min: 0.2, max: 2, step: 0.05, value: 1, unit: 'kg' },
        { id: 'k', label: 'Spring stiffness', min: 10, max: 100, step: 1, value: 40, unit: 'N/m' },
        { id: 'c', label: 'Damper and air drag', min: 0, max: 1.5, step: 0.02, value: 0.25, unit: 'kg/s' },
        { id: 'hide', type: 'check', label: 'Hide the stored forms (count them from the gauges)', value: false },
        { id: 'heat', type: 'check', label: 'Count the heat', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Release', primary: true }, { id: 'push', label: 'Push down' }] }
      ], id => { if (id === 'go' || id === 'm' || id === 'k') reset(); if (id === 'push') push(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['K', 'Motion ½mv²'], ['U', 'Height mgh'], ['S', 'Spring ½kx²'], ['Q', 'Heat'], ['E', 'Total counted'], ['n', 'Blocks counted'], ['w', 'Added by your pushes']]);
      const N0 = 60, g = 9.81, CH = 1;             // CH: heat capacity of the damper oil and nearby air, J/K
      const forms = [
        { name: 'Motion', f: '½mv²', hue: 210 }, { name: 'Height', f: 'mgh', hue: 140 },
        { name: 'Spring', f: '½kx²', hue: 285 }, { name: 'Heat', f: 'C·ΔT', hue: 18 }
      ];
      let z = 0, v = 0, Q = 0, zf = 1, eb = 1, E0 = 1, counts = [0, N0, 0, 0], flyers = [], added = 0;
      function reset() {
        zf = 3 * V.m * g / V.k; z = 0; v = 0; Q = 0;
        E0 = V.m * g * zf; eb = E0 / N0; counts = [0, N0, 0, 0]; flyers = []; added = 0;
      }
      function energies() { return [0.5 * V.m * v * v, V.m * g * (zf - z), 0.5 * V.k * z * z, Q]; }
      function push() {
        const w = Math.sqrt(V.k / V.m), zeq = V.m * g / V.k, Amax = 0.96 * zf - zeq;
        const dz = z - zeq, room = Amax * Amax - dz * dz;
        if (room <= 0) return;
        const vmax = w * Math.sqrt(room), vNew = Math.min(v + 0.6 * g / w, vmax);
        if (vNew <= v && v >= 0) return;
        added += 0.5 * V.m * (vNew * vNew - v * v); v = vNew;
      }
      const f = (zz, vv) => [vv, g - (V.k * zz + V.c * vv) / V.m, V.c * vv * vv];
      function rk4(h) {
        const a = f(z, v), b = f(z + h / 2 * a[0], v + h / 2 * a[1]), c = f(z + h / 2 * b[0], v + h / 2 * b[1]), d = f(z + h * c[0], v + h * c[1]);
        z += h / 6 * (a[0] + 2 * b[0] + 2 * c[0] + d[0]); v += h / 6 * (a[1] + 2 * b[1] + 2 * c[1] + d[1]); Q += h / 6 * (a[2] + 2 * b[2] + 2 * c[2] + d[2]);
      }
      // whole blocks that add up to the rounded total (largest remainders)
      function toBlocks(E) {
        const raw = E.map(x => Math.max(0, x / eb)), tot = Math.round(raw.reduce((s, x) => s + x, 0));
        const fl = raw.map(Math.floor); let left = tot - fl.reduce((s, x) => s + x, 0);
        const order = raw.map((x, i) => [x - Math.floor(x), i]).sort((p, q) => q[0] - p[0]);
        for (let j = 0; j < order.length && left > 0; j++, left--) fl[order[j][1]]++;
        return fl;
      }
      reset();
      let lay = null;
      const loop = kit.loop(dt => {
        const n = 12, h = dt / n;
        for (let i = 0; i < n; i++) rk4(h);
        const E = energies(), nb = toBlocks(E);
        // blocks that changed bins fly across
        const give = [], take = [];
        nb.forEach((c, i) => { const d = c - counts[i]; for (let j = 0; j < Math.abs(d); j++) (d < 0 ? give : take).push(i); });
        while (give.length && take.length && flyers.length < 36) flyers.push({ a: give.shift(), b: take.shift(), t: 0 });
        counts = nb;
        for (const fl of flyers) fl.t += dt / 0.45;
        flyers = flyers.filter(fl => fl.t < 1);
        const counted = E[0] + E[1] + E[2] + (V.heat ? E[3] : 0);
        const nCounted = counts[0] + counts[1] + counts[2] + (V.heat ? counts[3] : 0);
        ro.set('K', E[0].toFixed(2) + ' J'); ro.set('U', E[1].toFixed(2) + ' J'); ro.set('S', E[2].toFixed(2) + ' J');
        ro.set('Q', E[3].toFixed(2) + ' J' + (V.heat ? '' : ' (not counted)')); ro.set('E', counted.toFixed(2) + ' J');
        ro.set('n', nCounted + ' (1 block = ' + eb.toFixed(3) + ' J)'); ro.set('w', (added >= 0 ? '+' : '−') + Math.abs(added / eb).toFixed(0) + ' blocks');
        // ------------------------------------------------ drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // the apparatus on the left
        const AW = Math.min(250, W * 0.34), top = 26, massH = 26, L0 = 0.45 * zf;
        const sc = (H - top - massH - 34) / (L0 + zf), xs = AW * 0.42, floorY = top + (L0 + zf) * sc + massH;
        c.fillStyle = C.faint; c.fillRect(8, top - 8, AW - 16, 8);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); for (let x = 12; x < AW - 8; x += 8) { c.moveTo(x, top - 8); c.lineTo(x - 6, top - 16); } c.stroke();
        const yb = top + (L0 + z) * sc;             // bottom of the spring = top of the weight
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.moveTo(xs, top); c.lineTo(xs, top + 6);
        const coils = 12, span = yb - top - 12;
        for (let i = 0; i <= coils; i++) c.lineTo(xs + (i % 2 ? 11 : -11) * (i === 0 || i === coils ? 0 : 1), top + 6 + span * i / coils);
        c.lineTo(xs, yb); c.stroke();
        // the damper: a cylinder hung from the ceiling, its rod fixed to the weight
        const xd = xs + 44, cylLen = Math.max(20, (L0 + 0.2 * zf) * sc);
        const heatFrac = clamp(Q / E0, 0, 1);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xd, top); c.lineTo(xd, top + 6); c.stroke();
        c.fillStyle = kit.hue(18, 0.12 + 0.5 * heatFrac); c.fillRect(xd - 8, top + 6, 16, cylLen); c.strokeRect(xd - 8, top + 6, 16, cylLen);
        const rodTop = clamp(yb - 0.35 * zf * sc, top + 10, top + 6 + cylLen - 3);
        c.fillStyle = C.muted; c.fillRect(xd - 6, rodTop - 2, 12, 3);
        c.beginPath(); c.moveTo(xd, rodTop); c.lineTo(xd, yb + massH / 2); c.lineTo(xs + 16, yb + massH / 2); c.stroke();
        kit.label(c, 'damper', xd + 12, top + 14, { size: 11, color: C.muted });
        // the weight
        c.fillStyle = kit.hue(210, 0.9); c.fillRect(xs - 16, yb, 32, massH); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(xs - 16, yb, 32, massH);
        kit.label(c, V.m.toFixed(2) + ' kg', xs, yb + massH / 2, { size: 10.5, align: 'center', color: '#fff', weight: 600 });
        if (Math.abs(v) > 0.02) kit.arrow(c, xs - 26, yb + massH / 2, xs - 26, yb + massH / 2 + clamp(v * sc * 0.25, -60, 60), kit.hue(210), 2);
        // floor, height gauge, stretch gauge
        c.fillStyle = C.faint; c.fillRect(8, floorY, AW - 16, 3);
        const hx = 22, hm = zf - z;
        c.strokeStyle = kit.hue(140); c.lineWidth = 1.5; c.beginPath(); c.moveTo(hx, floorY); c.lineTo(hx, yb + massH); c.stroke();
        for (let i = 0; i <= 10; i++) { const yy = floorY - i * zf * sc / 10 * 1.0; if (yy < top) break; c.beginPath(); c.moveTo(hx - 4, yy); c.lineTo(hx + 4, yy); c.stroke(); }
        c.beginPath(); c.moveTo(hx - 6, yb + massH); c.lineTo(xs - 16, yb + massH); c.setLineDash([3, 3]); c.stroke(); c.setLineDash([]);
        kit.label(c, 'h = ' + hm.toFixed(2) + ' m', hx + 4, (floorY + yb + massH) / 2, { size: 11, color: kit.hue(140), bg: C.bg2 });
        kit.label(c, 'x = ' + z.toFixed(2) + ' m', xs - 14, (top + yb) / 2, { size: 11, color: kit.hue(285), align: 'right', bg: C.bg2 });
        // thermometer
        const tx = AW - 22, ty0 = top + 10, ty1 = floorY - 18;
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.strokeRect(tx - 4, ty0, 8, ty1 - ty0);
        c.fillStyle = kit.hue(18); c.fillRect(tx - 3, ty1 - (ty1 - ty0) * heatFrac, 6, (ty1 - ty0) * heatFrac);
        kit.dot(c, tx, ty1 + 7, 7, kit.hue(18));
        kit.label(c, 'ΔT = ' + (Q / CH).toFixed(2) + ' K', tx, floorY + 14, { size: 10.5, align: 'right', color: kit.hue(18) });
        // the bins on the right
        const bx0 = AW + 12, bw = (W - bx0 - 10 - 3 * 10) / 4, cols = 6, cap = 96;
        const s = Math.max(3, Math.min((bw - 10) / cols, (H - 118) / (cap / cols))), binH = s * cap / cols + 6, by1 = H - 28, by0 = by1 - binH;
        lay = { bx0, bw, s, by1, cols };
        const topOf = i => { const n = counts[i], r = Math.floor(Math.max(0, n - 1) / cols), cI = Math.max(0, n - 1) % cols; return [bx0 + i * (bw + 10) + 5 + (cI + 0.5) * s + (bw - 10 - cols * s) / 2, by1 - 3 - (r + 0.5) * s]; };
        const tot = counts[0] + counts[1] + counts[2] + (V.heat ? counts[3] : 0);
        kit.label(c, 'Total counted: ' + tot + ' blocks', bx0, 16, { size: 14, weight: 700, color: tot === Math.round((E0 + added) / eb) ? C.text : C.bad });
        kit.label(c, 'at the start: ' + N0 + (Math.abs(added) > eb / 2 ? (added > 0 ? ' + ' : ' − ') + Math.abs(Math.round(added / eb)) + ' from your hand' : ''), bx0, 36, { size: 11.5, color: C.muted });
        forms.forEach((fm, i) => {
          const x = bx0 + i * (bw + 10), hidden = V.hide && i > 0, off = i === 3 && !V.heat;
          c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(x, by0, bw, binH);
          kit.label(c, fm.name + ' ' + fm.f, x + bw / 2, by0 - 26, { size: 12, align: 'center', weight: 600, color: kit.hue(fm.hue) });
          kit.label(c, counts[i] + (off ? ' (not counted)' : ''), x + bw / 2, by0 - 10, { size: 12, align: 'center', color: off ? C.muted : C.text });
          const pad = (bw - 10 - cols * s) / 2;
          for (let j = 0; j < counts[i]; j++) {
            const r = Math.floor(j / cols), cI = j % cols, yy = by1 - 3 - (r + 1) * s;
            if (yy < by0) break;
            c.fillStyle = kit.hue(fm.hue, off ? 0.25 : 0.9); c.fillRect(x + 5 + pad + cI * s + 0.5, yy + 0.5, s - 1, s - 1);
          }
          if (hidden) {
            c.fillStyle = C.surface || C.bg2; c.fillRect(x + 1, by0 + 1, bw - 2, binH - 2);
            c.strokeStyle = C.faint; c.beginPath(); for (let yy = by0 + 8; yy < by1; yy += 10) { c.moveTo(x + 2, yy); c.lineTo(x + bw - 2, yy); } c.stroke();
            const gauge = i === 1 ? ['ruler: h = ' + hm.toFixed(3) + ' m', 'mgh = ' + E[1].toFixed(2) + ' J'] : i === 2 ? ['stretch: x = ' + z.toFixed(3) + ' m', '½kx² = ' + E[2].toFixed(2) + ' J'] : ['thermometer: ΔT = ' + (Q / CH).toFixed(2) + ' K', 'C·ΔT = ' + E[3].toFixed(2) + ' J'];
            kit.label(c, 'hidden', x + bw / 2, by0 + binH * 0.3, { size: 12, align: 'center', color: C.muted, weight: 600 });
            kit.label(c, gauge[0], x + bw / 2, by0 + binH * 0.45, { size: 10, align: 'center', color: C.text });
            kit.label(c, gauge[1], x + bw / 2, by0 + binH * 0.55, { size: 10, align: 'center', color: C.text });
            kit.label(c, '→ ' + counts[i] + ' blocks', x + bw / 2, by0 + binH * 0.67, { size: 11.5, align: 'center', color: kit.hue(fm.hue), weight: 700 });
          }
        });
        // blocks on the move
        for (const fl of flyers) {
          const [x1, y1] = topOf(fl.a), [x2, y2] = topOf(fl.b), u = fl.t, x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u - 60 * Math.sin(Math.PI * u);
          c.fillStyle = kit.hue(forms[u < 0.5 ? fl.a : fl.b].hue, 0.95); c.fillRect(x - s / 2, y - s / 2, s - 1, s - 1);
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the scales of nature */
  const LOGC = Math.log10(299792458);
  const DIST = [
    ['Proton (radius)', 0.84e-15, 'scattering fast electrons off protons'],
    ['Uranium nucleus (radius)', 7.4e-15, 'scattering fast particles off nuclei'],
    ['Hydrogen atom (radius)', 5.29e-11, 'spectra, and the diffraction of X-rays and electrons'],
    ['Spacing of atoms in salt', 2.82e-10, 'X-ray diffraction'],
    ['Wavelength of green light', 5.5e-7, 'interference of light'],
    ['A bacterium', 2e-6, 'light microscope'],
    ['Thickness of a hair', 7e-5, 'microscope or micrometer'],
    ['A person', 1.7, 'tape measure'],
    ['Height of Everest', 8849, 'triangulation and satellite positioning'],
    ['Radius of the Earth', 6.371e6, 'triangulation, now satellites'],
    ['Earth to Moon', 3.844e8, 'laser echoes from reflectors on the Moon'],
    ['Earth to Sun (1 AU)', 1.496e11, 'radar echoes from the planets'],
    ['Sun to Neptune', 4.5e12, 'planetary orbits scaled by the AU'],
    ['Nearest star, Proxima Centauri', 4.02e16, 'parallax'],
    ['Across the Milky Way', 9.5e20, 'parallax and variable stars'],
    ['Andromeda galaxy', 2.4e22, 'standard candles (Cepheid variables)'],
    ['Edge of the observable universe', 4.4e26, 'redshifts and cosmology']
  ];
  const TIMES = [
    ['Lifetime of a Δ particle', 5.6e-24, 'inferred from the spread of its energy'],
    ['Shortest laser pulses', 5e-17, 'attosecond laser techniques'],
    ['One period of green light', 1.83e-15, 'calculated: wavelength ÷ speed of light'],
    ['One tick of a caesium clock', 1.088e-10, 'the transition that defines the second'],
    ['One cycle of a 3 GHz processor', 3.3e-10, 'electronics'],
    ['Lifetime of a muon', 2.2e-6, 'electronic timing of decays'],
    ['One vibration of the note A (440 Hz)', 2.27e-3, 'oscilloscope'],
    ['A heartbeat', 0.86, 'a clock'],
    ['A day', 86400, 'the turning Earth'],
    ['A year', 3.156e7, 'the Earth going round the Sun'],
    ['A human life', 2.5e9, 'calendars'],
    ['Since the Great Pyramid', 1.42e11, 'written history and carbon-14'],
    ['Half-life of carbon-14', 1.81e11, 'counting radioactive decays'],
    ['Modern humans', 9.5e12, 'radioactive dating'],
    ['Since the dinosaurs died out', 2.08e15, 'radioactive dating of rocks'],
    ['Age of the Earth', 1.43e17, 'radioactive dating of meteorites'],
    ['Age of the universe', 4.35e17, 'the expansion of the universe']
  ];
  const DBANDS = [[-16, -12.6, 'fast-particle scattering'], [-12.6, -8, 'X-ray and electron diffraction'], [-8, -3, 'microscopes'], [-3, 4, 'rulers'], [4, 13, 'triangulation, radar, laser echoes'], [13, 20.5, 'parallax'], [20.5, 27.3, 'standard candles, redshift']];
  const TBANDS = [[-24.5, -17.5, 'inferred from energy spreads'], [-17.5, -3, 'lasers and electronics'], [-3, 9.5, 'clocks: pendulum, quartz, caesium'], [9.5, 17.3, 'radioactive clocks'], [17.3, 18, 'cosmic expansion']];

  Hyper.sim('mot-scales', {
    title: 'The scales of nature',
    blurb: `Two [[?logarithm|logarithmic]] rulers: **distance** on top, **time** below. Each step of the ruler is a factor of ten — a [[?scientific-notation|power of ten]]. The rulers are joined by light: every time sits directly under the distance light travels in that time, so a year sits under a light-year and a nanosecond under 30 cm. The coloured bands say how each range is measured.

**Try this**
- Press *Tour* to fly from the proton to the edge of the observable universe, ten powers of ten at a time.
- Click a landmark (or pick one from the list) to read its value, how it is measured, and the light-equivalent on the other ruler.
- Compare the ends: the Δ particle and the proton line up — light crosses a proton in about the lifetime of a particle that decays through the strong force. At the other end, the age of the universe sits under the size of the observable universe.
- Drag the rulers sideways to pan; widen the view to see all 42 powers of ten at once.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const items = DIST.map(d => ({ kind: 'd', name: d[0], v: d[1], how: d[2], L: Math.log10(d[1]) }))
        .concat(TIMES.map(t => ({ kind: 't', name: t[0], v: t[1], how: t[2], L: Math.log10(t[1]) + LOGC })));
      const opts = [['— pick a landmark —', -1]].concat(items.map((it, i) => [(it.kind === 'd' ? 'Distance: ' : 'Time: ') + it.name, i]));
      const ctl = kit.controls(box.side, [
        { id: 'span', label: 'Powers of ten in view', min: 4, max: 44, step: 1, value: 44 },
        { id: 'centre', label: 'Centre of the view (power of ten, metres)', min: -15, max: 27, step: 0.1, value: 6 },
        { id: 'pick', type: 'select', label: 'Go to', options: opts, value: -1 },
        { type: 'buttons', items: [{ id: 'tour', label: 'Tour', primary: true }, { id: 'all', label: 'Show all' }] }
      ], (id, val) => {
        if (id === 'pick' && val >= 0) { sel = val; ctl.set('centre', clamp(items[val].L, -15, 27)); if (V.span > 14) ctl.set('span', 12); tour = null; }
        if (id === 'tour') { tour = -15; ctl.set('span', 10); }
        if (id === 'all') { tour = null; ctl.set('span', 44); ctl.set('centre', 6); }
        if (id === 'centre' || id === 'span') tour = null;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Landmark'], ['val', 'Value'], ['light', 'Light equivalent'], ['how', 'Measured by']]);
      let sel = 7, tour = null, dragX = null, moved = 0;
      const geom = () => { const x0 = 24, x1 = st.W - 24; return { x0, x1, lo: V.centre - V.span / 2, hi: V.centre + V.span / 2 }; };
      const X = (G, L) => G.x0 + (L - G.lo) / (G.hi - G.lo) * (G.x1 - G.x0);
      kit.drag(st, {
        hit: p => p,
        start: (t, p) => { dragX = p.x; moved = 0; },
        move: (t, p) => { const G = geom(), d = (p.x - dragX) / (G.x1 - G.x0) * V.span; moved += Math.abs(p.x - dragX); dragX = p.x; ctl.set('centre', clamp(V.centre - d, -15, 27)); tour = null; },
        end: t => {
          if (moved < 4 && dragX != null) {
            const G = geom(); let best = -1, bd = 14;
            items.forEach((it, i) => { const d = Math.abs(X(G, it.L) - t.x); if (d < bd) { bd = d; best = i; } });
            if (best >= 0) sel = best;
          }
          dragX = null;
        }
      });
      const loop = kit.loop(dt => {
        if (tour != null) { tour += dt * 2.2; ctl.set('centre', Math.min(27, tour)); if (tour >= 27) tour = null; }
        const c = st.begin(), C = kit.colors(), G = geom(), W = st.W, H = st.H;
        const yD = H * 0.36, yT = H * 0.66;
        const it = items[sel];
        ro.set('name', it.name);
        ro.set('val', kit.fmt(it.v, 3) + (it.kind === 'd' ? ' m' : ' s'));
        ro.set('light', it.kind === 'd' ? 'light crosses it in ' + kit.fmt(it.v / 299792458, 3) + ' s' : 'light travels ' + kit.fmt(it.v * 299792458, 3) + ' m in it');
        ro.set('how', it.how);
        // rulers
        const ruler = (y, lab) => { c.strokeStyle = C.axis || C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(G.x0, y); c.lineTo(G.x1, y); c.stroke(); kit.label(c, lab, G.x0, y + (y === yD ? -H * 0.27 : H * 0.28), { size: 12, weight: 700, color: C.muted }); };
        ruler(yD, 'DISTANCE (metres)'); ruler(yT, 'TIME (seconds) — under the distance light covers in it');
        const ppd = (G.x1 - G.x0) / V.span, every = Math.max(1, Math.ceil(46 / ppd));
        font(c, 10.5);
        for (let n = Math.ceil(G.lo); n <= Math.floor(G.hi); n++) {
          const x = X(G, n);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x, yD - 5); c.lineTo(x, yD + 5); c.stroke();
          if (n % every === 0) kit.label(c, '10' + supN(n) + ' m', x, yD + 14, { size: 10, align: 'center', color: C.muted });
          // the time ruler ticks sit at whole powers of ten of seconds
          const nt = n - Math.round(LOGC), xt = X(G, nt + LOGC);
          if (xt >= G.x0 && xt <= G.x1) { c.beginPath(); c.moveTo(xt, yT - 5); c.lineTo(xt, yT + 5); c.stroke(); if (nt % every === 0) kit.label(c, '10' + supN(nt) + ' s', xt, yT - 14, { size: 10, align: 'center', color: C.muted }); }
        }
        // measurement bands
        const band = (bands, y, hue0) => bands.forEach((b, i) => {
          const xa = Math.max(G.x0, X(G, b[0])), xb = Math.min(G.x1, X(G, b[1]));
          if (xb <= xa) return;
          c.fillStyle = kit.hue(hue0 + i * 47, 0.22); c.fillRect(xa, y, xb - xa, 16);
          if (xb - xa > b[2].length * 5.6) kit.label(c, b[2], (xa + xb) / 2, y + 8, { size: 10, align: 'center', color: C.text });
        });
        band(DBANDS, yD + 24, 200); band(TBANDS, yT - 40, 20);
        // landmarks: labels in three staggered rows, skipping ones that would overlap
        const rows = [[], [], []];
        const place = (x, w) => { for (let r = 0; r < 3; r++) if (!rows[r].some(([a, b]) => x - w / 2 < b + 4 && x + w / 2 > a - 4)) { rows[r].push([x - w / 2, x + w / 2]); return r; } return -1; };
        const order = items.map((q, i) => i).sort((a, b) => (a === sel ? -1 : b === sel ? 1 : 0));
        for (const i of order) {
          const q = items[i], x = X(G, q.L);
          if (x < G.x0 - 2 || x > G.x1 + 2) continue;
          const y = q.kind === 'd' ? yD : yT, up = q.kind === 'd' ? -1 : 1, hue = q.kind === 'd' ? 205 : 25, on = i === sel;
          c.strokeStyle = kit.hue(hue, on ? 1 : 0.8); c.lineWidth = on ? 2.5 : 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + up * 9); c.stroke();
          kit.dot(c, x, y, on ? 5 : 3.2, kit.hue(hue));
          font(c, 11); const w = c.measureText(q.name).width + 6, r = on ? 0 : place(x, w);
          if (on) rows[0].push([x - w / 2, x + w / 2]);
          if (r < 0) continue;
          const ly = y + up * (22 + 17 * r);
          c.strokeStyle = kit.hue(hue, 0.35); c.lineWidth = 1; c.beginPath(); c.moveTo(x, y + up * 9); c.lineTo(x, ly - up * 6); c.stroke();
          kit.label(c, q.name, clamp(x, G.x0 + w / 2, G.x1 - w / 2), ly, { size: 11, align: 'center', color: on ? C.text : kit.hue(hue), weight: on ? 700 : 500, bg: on ? kit.hue(hue, 0.25) : null });
        }
        // the light link for the selected landmark
        const xs = X(G, it.L);
        if (xs >= G.x0 && xs <= G.x1) {
          c.strokeStyle = kit.hue(50, 0.9); c.lineWidth = 1.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(xs, yD); c.lineTo(xs, yT); c.stroke(); c.setLineDash([]);
          const txt = it.kind === 'd' ? 'light crosses it in ' + kit.fmt(it.v / 299792458, 2) + ' s' : 'light goes ' + kit.fmt(it.v * 299792458, 2) + ' m';
          kit.label(c, txt, clamp(xs + 6, G.x0, G.x1 - 150), (yD + yT) / 2, { size: 11, color: kit.hue(50), bg: C.bg2 });
        }
        kit.label(c, 'view: 10' + supN(Math.round(G.lo)) + ' m to 10' + supN(Math.round(G.hi)) + ' m', W - 24, H - 12, { size: 10.5, align: 'right', color: C.muted });
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ speed at an instant */
  function carX(t) { if (t <= 0) return 0; if (t <= 8) return t * t; if (t <= 14) return 64 + 16 * (t - 8); if (t <= 18) { const u = t - 14; return 160 + 16 * u - 2 * u * u; } return 192; }
  function carV(t) { if (t <= 0) return 0; if (t <= 8) return 2 * t; if (t <= 14) return 16; if (t <= 18) return 16 - 4 * (t - 14); return 0; }
  const MOTIONS = {
    fall: { name: 'x = 4.9 t² (a falling ball)', T1: 3, x: t => 4.9 * t * t, v: t => 9.8 * t },
    car: { name: 'a car: speeds up, cruises, brakes', T1: 20, x: carX, v: carV },
    spring: { name: 'x = 0.2 cos(πt) (a mass on a spring)', T1: 4, x: t => 0.2 * Math.cos(Math.PI * t), v: t => -0.2 * Math.PI * Math.sin(Math.PI * t) }
  };

  Hyper.sim('mot-zoom', {
    title: 'Speed at an instant: zoom into the curve',
    blurb: `The graph shows position against time. Two points, a time Δt apart, fix a **chord** whose slope is Δx/Δt, the average speed over the interval. The dashed line is the **tangent**, whose slope is the speed at the instant — the [[?derivative]] dx/dt. The magnifier zooms in so that the interval always fills it; underneath, the speed–time graph with the **area** under it, which is the distance travelled — the [[?integral]].

**Try this**
- Press *Shrink Δt*: the chord swings round onto the tangent and Δx/Δt settles on a definite number — the [[?limit]]. The table lists the values for Δt = 1, 0.1, 0.01, 0.001 s.
- Watch the magnifier: as Δt shrinks, the curve inside looks straighter and straighter. Every smooth curve is straight when seen close enough.
- Drag the dot along the curve. Where the curve is steepest the speed is greatest; at the top of the spring's swing the tangent is flat: speed zero.
- Choose the car and put the instant in the braking phase: the chord from the past and the chord into the future disagree for large Δt, but both close in on the same speed.
- Compare the shaded area under the speed graph with the height of the position curve at the same instant: they match.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let V = { mode: 'fall', u: 1 / 3 };                   // until the controls exist (their formatters run while they are built)
      const M = () => MOTIONS[V.mode];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Motion', options: [['Falling ball', 'fall'], ['Car: speeds up, cruises, brakes', 'car'], ['Mass on a spring', 'spring']], value: 'fall' },
        { id: 'u', label: 'Instant t', min: 0, max: 1, step: 0.001, value: 1 / 3, fmt: u => (u * M().T1).toFixed(2) + ' s' },
        { id: 'dt', label: 'Interval Δt', min: 0.001, max: 3, value: 1, log: true, sig: 3, unit: 's' },
        { id: 'mag', type: 'check', label: 'Magnifier', value: true },
        { type: 'buttons', items: [{ id: 'shrink', label: 'Shrink Δt', primary: true }, { id: 'big', label: 'Δt = 1 s' }] }
      ], id => {
        if (id === 'mode') { ctl.set('u', V.u); curve(); }
        if (id === 'shrink') { shrinking = true; if (V.dt < 0.5) ctl.set('dt', 1); }
        if (id === 'big') { shrinking = false; ctl.set('dt', 1); }
        if (id === 'dt') shrinking = false;
        tableDirty = true;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Instant t'], ['D', 'Δt, Δx'], ['s', 'Chord slope Δx/Δt'], ['v', 'Speed dx/dt'], ['e', 'Chord − speed'], ['A', 'Area under v, 0 to t']]);
      const tab = kit.table(box.side, [{ label: 'Δt (s)', key: 'dt' }, { label: 'Δx/Δt', key: 's' }]);
      const plot = kit.plot(gb, { x: { label: 'time t (s)' }, y: { label: 'speed v' }, legend: true }, 150);
      let shrinking = false, tableDirty = true, vcurve = [];
      function curve() {
        const m = M(); vcurve = [];
        for (let i = 0; i <= 240; i++) { const t = m.T1 * i / 240; vcurve.push([t, m.v(t)]); }
      }
      curve();
      let G = null;
      kit.drag(st, {
        hit: p => (G && Math.hypot(p.x - G.px, p.y - G.py) < 18 ? 1 : null),
        move: (h, p) => { if (!G) return; ctl.set('u', clamp((p.x - G.gx0) / (G.gx1 - G.gx0), 0, 1)); tableDirty = true; },
        hover: true
      });
      const loop = kit.loop(dt => {
        const m = M(), T1 = m.T1, t0 = V.u * T1;
        if (shrinking) { const nd = V.dt * Math.exp(-1.1 * dt); if (nd <= 0.001) { shrinking = false; ctl.set('dt', 0.001); } else ctl.set('dt', nd); }
        // near the end of the run the chord looks back instead of forward
        const Dm = Math.min(V.dt, 0.5 * T1), D = t0 + Dm <= T1 + 1e-9 ? Dm : -Dm;
        const x0 = m.x(t0), x1 = m.x(t0 + D), dx = x1 - x0, slope = dx / D, vt = m.v(t0);
        ro.set('t', t0.toFixed(3) + ' s'); ro.set('D', kit.fmt(D, 3) + ' s, ' + kit.fmt(dx, 4) + ' m');
        ro.set('s', kit.fmt(slope, 5) + ' m/s'); ro.set('v', kit.fmt(vt, 5) + ' m/s'); ro.set('e', kit.fmt(slope - vt, 3) + ' m/s');
        ro.set('A', kit.fmt(x0 - m.x(0), 4) + ' m');
        if (tableDirty) {
          tableDirty = false;
          tab.set([1, 0.1, 0.01, 0.001].map(d => ({ dt: String(d), s: kit.fmt((m.x(t0 + d) - x0) / d, 6) })).concat([{ dt: '→ 0', s: kit.fmt(vt, 6), _cls: 'hl' }]));
          const area = vcurve.filter(p => p[0] <= t0 + 1e-9);
          plot.set({ series: [{ pts: vcurve, label: 'speed v(t)' }, { pts: area.length ? area : [[0, m.v(0)]], label: 'area = distance so far', fill: true, width: 0.5 }], marks: [{ x: t0, y: vt, label: 'v = ' + kit.fmt(vt, 3) + ' m/s' }], x: { label: 'time t (s)', min: 0, max: T1 }, y: { label: 'speed v (m/s)' } });
        }
        // ------------------------------------------------ the x–t graph
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const gx0 = 56, gx1 = W * 0.6, gy0 = 18, gy1 = H - 34;
        let xmin = Infinity, xmax = -Infinity;
        for (let i = 0; i <= 200; i++) { const x = m.x(T1 * i / 200); xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); }
        const pad = 0.06 * (xmax - xmin || 1); xmin -= pad; xmax += pad;
        const TX = t => gx0 + t / T1 * (gx1 - gx0), XY = x => gy1 - (x - xmin) / (xmax - xmin) * (gy1 - gy0);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        const tsN = Hyper.niceStep(T1, 5), xsN = Hyper.niceStep(xmax - xmin, 5);
        font(c, 10.5); c.fillStyle = C.muted; c.textAlign = 'center';
        for (let t = 0; t <= T1 + 1e-9; t += tsN) { c.beginPath(); c.moveTo(TX(t), gy0); c.lineTo(TX(t), gy1); c.stroke(); c.fillText(kit.fmt(t, 3), TX(t), gy1 + 13); }
        c.textAlign = 'right';
        for (let x = Math.ceil(xmin / xsN) * xsN; x <= xmax; x += xsN) { c.beginPath(); c.moveTo(gx0, XY(x)); c.lineTo(gx1, XY(x)); c.stroke(); c.fillText(kit.fmt(x, 3), gx0 - 5, XY(x) + 3); }
        c.strokeStyle = C.axis || C.muted; c.strokeRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
        kit.label(c, 'position x (m)', gx0 + 4, gy0 + 8, { size: 11, color: C.muted });
        kit.label(c, 'time t (s)', gx1, gy1 + 26, { size: 11, color: C.muted, align: 'right' });
        c.save(); c.beginPath(); c.rect(gx0, gy0, gx1 - gx0, gy1 - gy0); c.clip();
        c.strokeStyle = kit.hue(205); c.lineWidth = 2.2; c.beginPath();
        for (let i = 0; i <= 300; i++) { const t = T1 * i / 300, X = TX(t), Y = XY(m.x(t)); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }
        c.stroke();
        const line = (sl, col, dash, w) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash); c.beginPath(); c.moveTo(TX(t0 - T1), XY(x0 - sl * T1)); c.lineTo(TX(t0 + T1), XY(x0 + sl * T1)); c.stroke(); c.setLineDash([]); };
        line(vt, C.muted, [6, 4], 1.5); line(slope, kit.hue(25), [], 2);
        c.restore();
        const px = TX(t0), py = XY(x0), qx = TX(t0 + D), qy = XY(x1);
        c.strokeStyle = kit.hue(140); c.lineWidth = 1.5; c.beginPath(); c.moveTo(px, py); c.lineTo(qx, py); c.lineTo(qx, qy); c.stroke();
        if (Math.abs(qx - px) > 24) kit.label(c, 'Δt', (px + qx) / 2, py + (qy < py ? 10 : -10), { size: 11, align: 'center', color: kit.hue(140) });
        if (Math.abs(qy - py) > 16) kit.label(c, 'Δx', qx + 4, (py + qy) / 2, { size: 11, color: kit.hue(140) });
        kit.dot(c, qx, qy, 4, kit.hue(25)); kit.dot(c, px, py, 6, kit.hue(205), C.text);
        G = { px, py, gx0, gx1 };
        // ------------------------------------------------ the magnifier
        if (V.mag) {
          const R = Math.min((H - 40) * 0.46, (W - gx1 - 30) * 0.5), mx = gx1 + 16 + R + (W - gx1 - 32 - 2 * R) / 2, my = H * 0.48;
          const pxT = (gx1 - gx0) / T1, pxX = (gy1 - gy0) / (xmax - xmin), Z = 0.9 * R / (Dm * pxT);
          const tm = t0 + D / 2, xm = (x0 + x1) / 2, MX = t => mx + (t - tm) * pxT * Z, MY = x => my - (x - xm) * pxX * Z;
          const half = 1.2 * R / (pxT * Z);
          // the patch of the graph being magnified
          c.strokeStyle = C.faint; c.lineWidth = 1; const bw2 = half * pxT, bh2 = R / Z;
          if (bw2 > 3) c.strokeRect(TX(tm) - bw2, XY(xm) - bh2, 2 * bw2, 2 * bh2);
          c.fillStyle = C.surface || C.bg2; c.beginPath(); c.arc(mx, my, R, 0, 7); c.fill();
          c.save(); c.beginPath(); c.arc(mx, my, R, 0, 7); c.clip();
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let k = -4; k <= 4; k++) { c.beginPath(); c.moveTo(mx + k * R / 4, my - R); c.lineTo(mx + k * R / 4, my + R); c.moveTo(mx - R, my + k * R / 4); c.lineTo(mx + R, my + k * R / 4); c.stroke(); }
          c.strokeStyle = kit.hue(205); c.lineWidth = 3; c.beginPath();
          for (let i = 0; i <= 120; i++) { const t = tm - half + 2 * half * i / 120, X = MX(t), Y = clamp(MY(m.x(t)), my - 4 * R, my + 4 * R); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }
          c.stroke();
          const ml = (sl, col, dash, w) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash); c.beginPath(); c.moveTo(MX(t0 - 3 * half), MY(x0 - sl * 3 * half)); c.lineTo(MX(t0 + 3 * half), MY(x0 + sl * 3 * half)); c.stroke(); c.setLineDash([]); };
          ml(vt, C.muted, [6, 4], 1.5); ml(slope, kit.hue(25), [], 2);
          kit.dot(c, MX(t0), MY(x0), 6, kit.hue(205), C.text); kit.dot(c, MX(t0 + D), MY(x1), 5, kit.hue(25));
          c.restore();
          c.strokeStyle = C.border || C.faint; c.lineWidth = 2; c.beginPath(); c.arc(mx, my, R, 0, 7); c.stroke();
          kit.label(c, 'magnified ×' + kit.fmt(Z, 2), mx, my + R + 12, { size: 11, align: 'center', color: C.muted });
          kit.label(c, 'chord', mx - R * 0.7, my - R - 8, { size: 11, color: kit.hue(25) }); kit.label(c, 'tangent', mx + R * 0.2, my - R - 8, { size: 11, color: C.muted });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Newton's law, step by step */
  const GM4 = 4 * Math.PI * Math.PI;
  Hyper.sim('mot-stepper', {
    title: 'Newton\'s law, one step at a time',
    blurb: `Newton's law gives the acceleration from the position; the acceleration changes the velocity; the velocity changes the position. Repeat in small steps Δt and the arithmetic predicts the motion — a [[?differential-equation]] solved [[?step-by-step]]. Every row of the table is one step; the drawing shows the same numbers as dots, with the exact motion as a thin line.

**Try this**
- Press *Step* a few times with the spring and read the table: position, acceleration a = −(k/m)x, and the velocity at the next half-step. Compare x with the exact column.
- Switch to *Simple steps*: the dots spiral outwards — each swing is bigger than the last, energy appears from nowhere. Back to *half-steps* and the swing stays put.
- Choose the planet. With 20 steps per orbit the leapfrog orbit nearly closes; with 8 it wobbles; the simple method slowly spirals out.
- Launch the planet slower for an eccentric orbit: the steps crowd together far from the Sun and spread out near it, where the planet is fast — and that is where the error is made.
- Double the steps per period and watch the error read-out drop by about four with half-steps, only by about two with simple steps.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const tb = document.createElement('div'); tb.style.padding = '4px 10px 10px'; box.stage.appendChild(tb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'System', options: [['A mass on a spring (0.5 kg, 20 N/m)', 'spring'], ['A planet round the Sun (AU, years)', 'planet']], value: 'spring' },
        { id: 'meth', type: 'select', label: 'Method', options: [['Velocities at half-steps (leapfrog)', 'leap'], ['Simple steps (Euler)', 'euler']], value: 'leap' },
        { id: 'n', label: 'Steps per period', min: 6, max: 200, step: 1, value: 20 },
        { id: 'v0', label: 'Planet: launch speed at 1 AU', min: 2, max: 8, step: 0.1, value: 5, unit: 'AU/yr' },
        { id: 'rate', label: 'Steps per second when running', min: 1, max: 60, step: 1, value: 6 },
        { type: 'buttons', items: [{ id: 'run', label: 'Run / pause', primary: true }, { id: 'step', label: 'Step' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'run') { running = !running; return; }
        if (id === 'step') { running = false; step(); return; }
        reset();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dt', 'Time step Δt'], ['t', 'Time'], ['err', 'Distance from the exact motion'], ['E', 'Energy change since the start'], ['msg', '']]);
      const tS = kit.table(tb, [{ label: 'step', key: 'n' }, { label: 't (s)', key: 't', fmt: v => v.toFixed(3) }, { label: 'x (m)', key: 'x', fmt: v => v.toFixed(4) }, { label: 'a (m/s²)', key: 'a', fmt: v => v.toFixed(3) }, { label: 'v (m/s)*', key: 'v', fmt: v => v.toFixed(3) }, { label: 'exact x (m)', key: 'ex', fmt: v => v.toFixed(4) }], { maxHeight: 220 });
      const tP = kit.table(tb, [{ label: 'step', key: 'n' }, { label: 't (yr)', key: 't', fmt: v => v.toFixed(3) }, { label: 'x (AU)', key: 'x', fmt: v => v.toFixed(3) }, { label: 'y (AU)', key: 'y', fmt: v => v.toFixed(3) }, { label: 'vx*', key: 'vx', fmt: v => v.toFixed(2) }, { label: 'vy*', key: 'vy', fmt: v => v.toFixed(2) }, { label: 'r (AU)', key: 'r', fmt: v => v.toFixed(3) }], { maxHeight: 220 });
      const note = document.createElement('div'); note.style.cssText = 'font-size:12px;opacity:.75;padding:4px 2px'; tb.appendChild(note);
      const K = 20, Mm = 0.5, W0 = Math.sqrt(K / Mm), A0 = 0.1;
      let rows = [], P = null, running = false, acc = 0, dtS = 0.05, T = 1, ref = null, refPath = [], stopped = '';
      const accel = (x, y) => { if (V.mode === 'spring') return [-K / Mm * x, 0]; const r = Math.hypot(x, y), r3 = Math.max(1e-6, r * r * r); return [-GM4 * x / r3, -GM4 * y / r3]; };
      const energy = (x, y, vx, vy) => V.mode === 'spring' ? 0.5 * Mm * vx * vx + 0.5 * K * x * x : 0.5 * (vx * vx + vy * vy) - GM4 / Math.max(1e-6, Math.hypot(x, y));
      function refStep(h) {   // RK4 for the reference planet
        const f = s => { const a = accel(s[0], s[1]); return [s[2], s[3], a[0], a[1]]; };
        const s = ref, k1 = f(s), k2 = f(s.map((v, i) => v + h / 2 * k1[i])), k3 = f(s.map((v, i) => v + h / 2 * k2[i])), k4 = f(s.map((v, i) => v + h * k3[i]));
        ref = s.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
      }
      function reset() {
        running = false; acc = 0; stopped = ''; rows = [];
        ctl.show('v0', V.mode === 'planet');
        tS.el.style.display = V.mode === 'spring' ? '' : 'none'; tP.el.style.display = V.mode === 'planet' ? '' : 'none';
        let x, y, vx, vy;
        if (V.mode === 'spring') { T = 2 * Math.PI / W0; x = A0; y = 0; vx = 0; vy = 0; }
        else {
          x = 1; y = 0; vx = 0; vy = V.v0;
          const a = 1 / (2 - V.v0 * V.v0 / GM4); T = Math.pow(a, 1.5);
          ref = [x, y, vx, vy]; refPath = [];
          const nref = 1200, h = T / nref; for (let i = 0; i <= nref; i++) { refPath.push([ref[0], ref[1]]); refStep(h); }
          ref = [x, y, vx, vy];
        }
        dtS = V.mode === 'spring' ? 1 / V.n : T / V.n;     // the spring's period is 0.99 s: 20 steps are Δt = 0.05 s
        const a0 = accel(x, y);
        P = { x, y, vx, vy, E0: energy(x, y, vx, vy), t: 0 };
        if (V.meth === 'leap') { P.hx = vx + dtS / 2 * a0[0]; P.hy = vy + dtS / 2 * a0[1]; }
        record(a0);
        note.textContent = V.meth === 'leap' ? '* velocity at the next half-step, t + Δt/2 (leapfrog).' : '* velocity at the same instant t (simple method).';
      }
      function record(a) {
        const vx = V.meth === 'leap' ? P.hx : P.vx, vy = V.meth === 'leap' ? P.hy : P.vy;
        const row = { n: rows.length, t: P.t, x: P.x, y: P.y, a: a[0], v: vx, vx, vy, r: Math.hypot(P.x, P.y), ex: A0 * Math.cos(W0 * P.t) };
        rows.push(row);
      }
      function step() {
        if (stopped || !P) return;
        const h = dtS;
        if (V.meth === 'leap') {
          P.x += h * P.hx; P.y += h * P.hy; P.t += h;
          const a = accel(P.x, P.y); P.hx += h * a[0]; P.hy += h * a[1];
          P.vx = P.hx - h / 2 * a[0]; P.vy = P.hy - h / 2 * a[1];
          record(a);
        } else {
          const a = accel(P.x, P.y);
          P.x += h * P.vx; P.y += h * P.vy; P.vx += h * a[0]; P.vy += h * a[1]; P.t += h;
          record(accel(P.x, P.y));
        }
        if (V.mode === 'planet') { const sub = 40; for (let i = 0; i < sub; i++) refStep(h / sub); }
        const r = Math.hypot(P.x, P.y);
        if (V.mode === 'spring' && Math.abs(P.x) > 20 * A0) stopped = 'The swings have blown up: the simple method keeps adding energy.';
        if (V.mode === 'planet' && r < 0.03) stopped = 'The planet fell into the Sun: the steps are too coarse near the Sun.';
        if (V.mode === 'planet' && r > 30) stopped = 'The planet escaped: energy was created by the steps.';
        if (rows.length > 4000) stopped = 'Enough steps — press Reset.';
      }
      reset();
      let lastShown = -1;
      const loop = kit.loop(dt => {
        if (running && !stopped) { acc += dt * V.rate; let k = 0; while (acc >= 1 && k < 20) { step(); acc -= 1; k++; } }
        if (stopped) running = false;
        const cur = rows[rows.length - 1];
        const ex = V.mode === 'spring' ? A0 * Math.cos(W0 * P.t) : 0;
        const err = V.mode === 'spring' ? Math.abs(P.x - ex) : Math.hypot(P.x - ref[0], P.y - ref[1]);
        const E = energy(P.x, P.y, P.vx, P.vy), dE = (E - P.E0) / Math.abs(P.E0);
        ro.set('dt', V.mode === 'spring' ? (dtS * 1000).toFixed(1) + ' ms (' + (T / dtS).toFixed(1) + ' per period)' : dtS.toFixed(4) + ' yr (' + (dtS * 365.25).toFixed(1) + ' days)');
        ro.set('t', V.mode === 'spring' ? P.t.toFixed(3) + ' s = ' + (P.t / T).toFixed(2) + ' periods' : P.t.toFixed(3) + ' yr = ' + (P.t / T).toFixed(2) + ' orbits');
        ro.set('err', V.mode === 'spring' ? kit.fmt(err * 1000, 3) + ' mm' : kit.fmt(err, 3) + ' AU');
        ro.set('E', (dE >= 0 ? '+' : '−') + kit.fmt(Math.abs(dE) * 100, 3) + ' %');
        ro.set('msg', stopped || (running ? 'running…' : 'paused — press Step or Run'));
        if (rows.length !== lastShown) {
          lastShown = rows.length;
          const tail = rows.slice(-8);
          if (V.mode === 'spring') tS.set(tail); else tP.set(tail);
        }
        // ------------------------------------------------ drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (V.mode === 'spring') {
          // the mass on its spring, across the top
          const yM = 44, x0p = 30, eq = W * 0.3, sc = W * 0.18 / A0;
          const xp = clamp(eq + P.x * sc, x0p + 30, W - 40), xe = eq + ex * sc;
          c.fillStyle = C.faint; c.fillRect(x0p - 8, yM - 26, 8, 52);
          c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x0p, yM);
          const L = xp - 16 - x0p; for (let i = 1; i < 14; i++) c.lineTo(x0p + L * i / 14, yM + (i % 2 ? -9 : 9)); c.lineTo(xp - 16, yM); c.stroke();
          c.strokeStyle = C.muted; c.setLineDash([3, 3]); c.strokeRect(xe - 16, yM - 16, 32, 32); c.setLineDash([]);
          c.fillStyle = kit.hue(205, 0.9); c.fillRect(xp - 16, yM - 16, 32, 32);
          kit.label(c, 'exact', xe, yM + 26, { size: 10.5, align: 'center', color: C.muted });
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(eq, yM + 20); c.lineTo(eq, yM - 22); c.stroke();
          const a = accel(P.x, 0)[0]; kit.arrow(c, xp, yM - 22, xp + clamp(a * sc * 0.02, -80, 80), yM - 22, kit.hue(25), 2);
          // x against t
          const gx0 = 50, gx1 = W - 16, gy0 = 92, gy1 = H - 22, tMax = Math.max(2 * T, P.t + 0.25 * T), tMin = Math.max(0, tMax - 3 * T);
          const amp = Math.max(A0 * 1.15, ...rows.slice(-400).map(r => Math.abs(r.x) * 1.08));
          const TX = t => gx0 + (t - tMin) / (tMax - tMin) * (gx1 - gx0), XY = x => (gy0 + gy1) / 2 - x / amp * (gy1 - gy0) / 2;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, XY(0)); c.lineTo(gx1, XY(0)); c.stroke();
          c.strokeStyle = C.axis || C.muted; c.strokeRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
          kit.label(c, '+' + kit.fmt(amp, 2) + ' m', gx0 - 4, gy0 + 6, { size: 10, align: 'right', color: C.muted }); kit.label(c, '−' + kit.fmt(amp, 2) + ' m', gx0 - 4, gy1 - 6, { size: 10, align: 'right', color: C.muted });
          kit.label(c, 'x against t — line: exact, dots: the steps', gx0 + 6, gy0 + 10, { size: 11, color: C.muted });
          c.save(); c.beginPath(); c.rect(gx0, gy0, gx1 - gx0, gy1 - gy0); c.clip();
          c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath();
          for (let i = 0; i <= 300; i++) { const t = tMin + (tMax - tMin) * i / 300, X = TX(t), Y = XY(A0 * Math.cos(W0 * t)); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }
          c.stroke();
          c.strokeStyle = kit.hue(205, 0.6); c.lineWidth = 1.5; c.beginPath(); let pen = false;
          for (const r of rows) { if (r.t < tMin) continue; const X = TX(r.t), Y = XY(r.x); pen ? c.lineTo(X, Y) : c.moveTo(X, Y); pen = true; } c.stroke();
          for (const r of rows) if (r.t >= tMin) kit.dot(c, TX(r.t), XY(r.x), r === cur ? 5 : 3, r === cur ? kit.hue(25) : kit.hue(205));
          c.restore();
        } else {
          // the orbit
          let ext = 1; for (const p of refPath) ext = Math.max(ext, Math.abs(p[0]), Math.abs(p[1]));
          const cx = W / 2, cy = H / 2, sc = Math.min(W, H) * 0.44 / ext, X = x => cx + x * sc, Y = y => cy - y * sc;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(-ext), cy); c.lineTo(X(ext), cy); c.moveTo(cx, Y(-ext)); c.lineTo(cx, Y(ext)); c.stroke();
          c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); refPath.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
          kit.dot(c, cx, cy, 8, 'hsl(45 95% 55%)');
          kit.label(c, 'Sun', cx + 10, cy + 12, { size: 11, color: C.muted });
          c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip();
          c.strokeStyle = kit.hue(205, 0.6); c.lineWidth = 1.5; c.beginPath(); rows.forEach((r, i) => i ? c.lineTo(X(clamp(r.x, -40, 40)), Y(clamp(r.y, -40, 40))) : c.moveTo(X(r.x), Y(r.y))); c.stroke();
          for (const r of rows.slice(-300)) kit.dot(c, X(clamp(r.x, -40, 40)), Y(clamp(r.y, -40, 40)), 2.6, kit.hue(205));
          c.restore();
          const px = X(clamp(P.x, -40, 40)), py = Y(clamp(P.y, -40, 40)), a = accel(P.x, P.y);
          kit.arrow(c, px, py, px + clamp(P.vx * sc * 0.06, -90, 90), py - clamp(P.vy * sc * 0.06, -90, 90), kit.hue(140), 2);
          kit.arrow(c, px, py, px + clamp(a[0] * sc * 0.006, -90, 90), py - clamp(a[1] * sc * 0.006, -90, 90), kit.hue(25), 2);
          kit.dot(c, px, py, 5.5, kit.hue(205), C.text);
          kit.dot(c, X(ref[0]), Y(ref[1]), 4, 'transparent', C.muted);
          kit.label(c, 'velocity', 12, 16, { size: 11, color: kit.hue(140) }); kit.label(c, 'acceleration (towards the Sun)', 12, 32, { size: 11, color: kit.hue(25) });
          kit.label(c, 'grey line and ring: the exact orbit and where the planet should be', 12, H - 12, { size: 11, color: C.muted });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ collisions in two frames */
  Hyper.sim('mot-collide', {
    title: 'Collisions seen from the ground and from a moving platform',
    blurb: `Two carts on a straight track collide. The top strip shows it from the ground; the bottom strip from a platform gliding along the track at a speed you choose. Arrows are velocities; the bars on the right are the momenta (mv) of each cart and their total, and the kinetic energy. The small triangle marks the centre of mass.

**Try this**
- Equal masses, cart 2 at rest, bounciness 0 (sticky): they move off at half the speed. Now press *Ride with the centre of mass*: from the platform the carts come in with equal and opposite speeds and simply stop — Feynman's symmetry argument, in motion.
- Bounciness 1 (elastic), equal masses: cart 1 stops dead and cart 2 leaves at its speed. From the centre-of-mass platform, both bounce straight back.
- Make cart 1 heavy and cart 2 light: the total momentum bar never changes in either strip, whatever the bounciness.
- Compare the energy lost in the two strips: the kinetic energies differ from frame to frame, but the energy turned into heat is the same for every observer.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'm1', label: 'Mass of cart 1', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'kg' },
        { id: 'm2', label: 'Mass of cart 2', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'kg' },
        { id: 'v1', label: 'Velocity of cart 1', min: -3, max: 3, step: 0.1, value: 2, unit: 'm/s' },
        { id: 'v2', label: 'Velocity of cart 2', min: -3, max: 3, step: 0.1, value: 0, unit: 'm/s' },
        { id: 'e', label: 'Bounciness (1 elastic, 0 sticky)', min: 0, max: 1, step: 0.05, value: 0 },
        { id: 'u', label: 'Speed of the moving platform', min: -3, max: 3, step: 0.05, value: 1, unit: 'm/s' },
        { type: 'buttons', items: [{ id: 'go', label: 'Again', primary: true }, { id: 'cm', label: 'Ride with the centre of mass' }] }
      ], id => { if (id === 'cm') ctl.set('u', +vcm().toFixed(2)); if (id !== 'u') start(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vcm', 'Centre-of-mass velocity'], ['pg', 'Total momentum, ground: before → after'], ['kg', 'Kinetic energy, ground: before → after'], ['pp', 'Total momentum, platform'], ['kp', 'Kinetic energy, platform'], ['lost', 'Energy into heat (both frames)']]);
      const w = 0.4, L = 6, tc = 1.6;
      let s = null;
      const vcm = () => (V.m1 * V.v1 + V.m2 * V.v2) / (V.m1 + V.m2);
      function start() {
        const meet = V.v1 > V.v2;
        s = { t: 0, x1: meet ? 3 - w / 2 - V.v1 * tc : 2, x2: meet ? 3 + w / 2 - V.v2 * tc : 4, v1: V.v1, v2: V.v2, hit: false, meet, b: { v1: V.v1, v2: V.v2 } };
      }
      start();
      const loop = kit.loop(dt => {
        const n = 8, h = dt / n;
        for (let i = 0; i < n; i++) {
          s.x1 += s.v1 * h; s.x2 += s.v2 * h; s.t += h;
          if (!s.hit && s.x2 - s.x1 <= w && s.v1 > s.v2) {
            const M = V.m1 + V.m2, P = V.m1 * s.v1 + V.m2 * s.v2, e = V.e;
            const u1 = (P + V.m2 * e * (s.v2 - s.v1)) / M, u2 = (P + V.m1 * e * (s.v1 - s.v2)) / M;
            s.v1 = u1; s.v2 = u2; s.hit = true; s.x2 = s.x1 + w;
          }
        }
        if (s.t > tc + 2.6) start();
        const u = V.u, M = V.m1 + V.m2;
        const P = (a, b, f) => V.m1 * (a - f) + V.m2 * (b - f), KE = (a, b, f) => 0.5 * V.m1 * (a - f) ** 2 + 0.5 * V.m2 * (b - f) ** 2;
        const bef = s.b, lost = KE(bef.v1, bef.v2, 0) - KE(s.v1, s.v2, 0);
        ro.set('vcm', vcm().toFixed(2) + ' m/s');
        ro.set('pg', P(bef.v1, bef.v2, 0).toFixed(2) + ' → ' + P(s.v1, s.v2, 0).toFixed(2) + ' kg·m/s');
        ro.set('kg', KE(bef.v1, bef.v2, 0).toFixed(2) + ' → ' + KE(s.v1, s.v2, 0).toFixed(2) + ' J');
        ro.set('pp', P(bef.v1, bef.v2, u).toFixed(2) + ' → ' + P(s.v1, s.v2, u).toFixed(2) + ' kg·m/s');
        ro.set('kp', KE(bef.v1, bef.v2, u).toFixed(2) + ' → ' + KE(s.v1, s.v2, u).toFixed(2) + ' J');
        ro.set('lost', s.hit ? lost.toFixed(2) + ' J, the same seen from the platform' : (s.meet ? 'not yet' : 'they never meet'));
        const Kref = Math.max(0.05, KE(bef.v1, bef.v2, 0), KE(bef.v1, bef.v2, u));
        // ------------------------------------------------ drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const tw = W * 0.72, sc = tw / L, bx = tw + 20;
        const strip = (y0, h0, f, title, shift) => {
          // ground marks move backwards in a moving frame
          c.fillStyle = C.surface || C.bg2; c.fillRect(0, y0, tw, h0);
          const yT = y0 + h0 - 26;
          c.fillStyle = C.faint; c.fillRect(0, yT + 16, tw, 3);
          c.strokeStyle = C.faint; c.lineWidth = 1;
          const off = shift % 0.5;
          c.beginPath(); for (let x = -1; x <= L + 1; x += 0.5) { const X = (x - off) * sc; if (X < 0 || X > tw) continue; c.moveTo(X, yT + 19); c.lineTo(X, yT + 25); } c.stroke();
          kit.label(c, title, 8, y0 + 12, { size: 12, weight: 700, color: C.text });
          const X1 = (s.x1 - shift) * sc, X2 = (s.x2 - shift) * sc, hw = w * sc / 2;
          const cart = (X, m, col, lab) => { const hh = 14 + 8 * Math.sqrt(m); c.fillStyle = col; c.fillRect(X - hw, yT + 16 - hh, 2 * hw, hh); kit.dot(c, X - hw * 0.55, yT + 16, 4, C.muted); kit.dot(c, X + hw * 0.55, yT + 16, 4, C.muted); kit.label(c, lab, X, yT + 16 - hh / 2, { size: 11, align: 'center', color: '#fff', weight: 700 }); return yT + 16 - hh; };
          c.save(); c.beginPath(); c.rect(0, y0, tw, h0); c.clip();
          const t1 = cart(X1, V.m1, kit.hue(210, 0.9), '1'), t2 = cart(X2, V.m2, kit.hue(25, 0.9), '2');
          const va = s.v1 - f, vb = s.v2 - f, vs = sc * 0.35;
          if (Math.abs(va) > 0.01) kit.arrow(c, X1, t1 - 10, X1 + va * vs, t1 - 10, kit.hue(210), 2.5);
          if (Math.abs(vb) > 0.01) kit.arrow(c, X2, t2 - 10, X2 + vb * vs, t2 - 10, kit.hue(25), 2.5);
          kit.label(c, (va >= 0 ? '+' : '−') + Math.abs(va).toFixed(2), X1, t1 - 22, { size: 10.5, align: 'center', color: kit.hue(210) });
          kit.label(c, (vb >= 0 ? '+' : '−') + Math.abs(vb).toFixed(2), X2, t2 - 22, { size: 10.5, align: 'center', color: kit.hue(25) });
          const xc = (V.m1 * s.x1 + V.m2 * s.x2) / M, XC = (xc - shift) * sc;
          c.fillStyle = C.text; c.beginPath(); c.moveTo(XC, yT + 20); c.lineTo(XC - 6, yT + 30); c.lineTo(XC + 6, yT + 30); c.closePath(); c.fill();
          c.restore();
          // momentum and energy bars
          const p1 = V.m1 * (s.v1 - f), p2 = V.m2 * (s.v2 - f), pt = p1 + p2, K = KE(s.v1, s.v2, f);
          const cx0 = bx + (W - bx) * 0.5, pmax = 3 * 5 * 2, bs = (W - bx - 20) * 0.5 / (0.5 * pmax);
          const bar = (yy, val, col, lab) => { c.fillStyle = col; c.fillRect(val >= 0 ? cx0 : cx0 + val * bs, yy, Math.abs(val * bs), 10); kit.label(c, lab, bx, yy + 5, { size: 10, color: C.muted }); };
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(cx0, y0 + 20); c.lineTo(cx0, y0 + 80); c.stroke();
          kit.label(c, 'momentum', cx0, y0 + 14, { size: 10.5, align: 'center', color: C.muted });
          bar(y0 + 24, p1, kit.hue(210), 'p₁'); bar(y0 + 40, p2, kit.hue(25), 'p₂'); bar(y0 + 56, pt, C.text, 'total');
          kit.label(c, pt.toFixed(2) + ' kg·m/s', W - 8, y0 + 76, { size: 10.5, align: 'right', color: C.text });
          const kb = Math.min(W - bx - 30, K / Kref * (W - bx - 30) * 0.9);
          c.fillStyle = kit.hue(140, 0.8); c.fillRect(bx + 24, y0 + 90, Math.max(1, kb), 10);
          kit.label(c, 'K', bx, y0 + 95, { size: 10, color: C.muted }); kit.label(c, K.toFixed(2) + ' J', W - 8, y0 + 110, { size: 10.5, align: 'right', color: kit.hue(140) });
        };
        const hs = H / 2 - 4;
        strip(0, hs, 0, 'Seen from the ground', 0);
        strip(H / 2 + 4, hs, u, 'Seen from a platform moving at ' + (u >= 0 ? '+' : '−') + Math.abs(u).toFixed(2) + ' m/s', u * (s.t - tc));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the same law in turned axes */
  Hyper.sim('mot-rotated-axes', {
    title: 'One ball, two sets of axes',
    blurb: `A ball is thrown and falls under gravity. Two observers describe it: the first with axes x, y (grey, level), the second with axes x′, y′ (blue) that you can turn and move — drag the blue handle to turn them, the blue dot to move them. The table gives every [[?vector]] in [[?components]] for both. The numbers disagree; the law does not: in both columns the force divided by the mass equals the acceleration, and the [[?magnitude|lengths]] and the [[?dot-product]] F·v agree exactly.

**Try this**
- Turn the blue axes to 30°: gravity now has an x′ component, −g sin 30° = −4.9 m/s². The ball's acceleration has exactly the same x′ component, so Fₓ′ = m aₓ′ still holds.
- Move the blue origin: positions change, but velocities and accelerations do not — the law does not care where you stand.
- Tick *Use "a_y = −g" in the turned axes*: the dashed path is what the second observer predicts by copying the component law without turning it. It misses the ball. A law must be written as a vector, F = ma, to hold for every observer.
- Turn the axes to 90°: now "down" is −x′. Nothing in the physics has changed, only the labels.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const tb = document.createElement('div'); tb.style.padding = '4px 10px 10px'; box.stage.appendChild(tb);
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Turn of the second axes θ', min: -90, max: 90, step: 1, value: 30, unit: '°' },
        { id: 'v0', label: 'Throwing speed', min: 5, max: 20, step: 0.5, value: 14, unit: 'm/s' },
        { id: 'ph', label: 'Throwing angle', min: 10, max: 80, step: 1, value: 55, unit: '°' },
        { id: 'm', label: 'Mass of the ball', min: 0.1, max: 2, step: 0.05, value: 0.5, unit: 'kg' },
        { id: 'wrong', type: 'check', label: 'Use "a_y = −g" in the turned axes (a law written badly)', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Throw', primary: true }, { id: 'axes', label: 'Reset the axes' }] }
      ], id => { if (id === 'go' || id === 'v0' || id === 'ph') t = 0; if (id === 'axes') { ox = 6; oy = 2; ctl.set('th', 30); } });
      const V = ctl.values;
      const g = 9.81;
      const tab = kit.table(tb, [{ label: '', key: 'q', align: 'left' }, { label: 'x, y (level axes)', key: 'a' }, { label: "x′, y′ (turned axes)", key: 'b' }]);
      let t = 0, ox = 6, oy = 2, G = null, tick = 1;
      const turn = (vx, vy, th) => [vx * Math.cos(th) + vy * Math.sin(th), -vx * Math.sin(th) + vy * Math.cos(th)];
      const pr = (a, u) => '(' + a[0].toFixed(2) + ', ' + a[1].toFixed(2) + ')' + (u ? ' ' + u : '');
      kit.drag(st, {
        hit: p => { if (!G) return null; if (Math.hypot(p.x - G.hx, p.y - G.hy) < 14) return 'rot'; if (Math.hypot(p.x - G.ox, p.y - G.oy) < 14) return 'org'; return null; },
        move: (k, p) => {
          if (!G) return;
          if (k === 'rot') { const a = Math.atan2(-(p.y - G.oy), p.x - G.ox) * 180 / Math.PI; ctl.set('th', clamp(Math.round(a), -90, 90)); }
          else { ox = clamp((p.x - G.X0) / G.sc, -2, 30); oy = clamp((G.Y0 - p.y) / G.sc, -2, 20); }
        },
        hover: true
      });
      const loop = kit.loop(dt => {
        const th = V.th * Math.PI / 180, ph = V.ph * Math.PI / 180, v0x = V.v0 * Math.cos(ph), v0y = V.v0 * Math.sin(ph);
        const T = 2 * v0y / g;
        t += dt; if (t > T + 1.2) t = 0;
        const tt = Math.min(t, T), x = v0x * tt, y = v0y * tt - 0.5 * g * tt * tt, vx = v0x, vy = v0y - g * tt;
        // the same quantities in the turned, shifted axes
        const rB = turn(x - ox, y - oy, th), vB = turn(vx, vy, th), aB = turn(0, -g, th), FB = turn(0, -V.m * g, th);
        const vA = [vx, vy], aA = [0, -g], FA = [0, -V.m * g];
        tick += dt;
        if (tick >= 0.07 || dt === 0) tick = 0, tab.set([
          { q: 'position r (m)', a: pr([x, y]), b: pr(rB) },
          { q: 'velocity v (m/s)', a: pr(vA), b: pr(vB) },
          { q: 'acceleration a (m/s²)', a: pr(aA), b: pr(aB) },
          { q: 'force ÷ mass, F/m (m/s²)', a: pr([FA[0] / V.m, FA[1] / V.m]), b: pr([FB[0] / V.m, FB[1] / V.m]), _cls: 'hl' },
          { q: 'length of v (m/s)', a: Math.hypot(vA[0], vA[1]).toFixed(3), b: Math.hypot(vB[0], vB[1]).toFixed(3) },
          { q: 'power F·v (W)', a: (FA[0] * vA[0] + FA[1] * vA[1]).toFixed(3), b: (FB[0] * vB[0] + FB[1] * vB[1]).toFixed(3) }
        ]);
        // ------------------------------------------------ drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const R = V.v0 * V.v0 / g, sc = Math.min((W - 60) / Math.max(24, R + 4), (H - 50) / 14), X0 = 30, Y0 = H - 30;
        const P = (a, b) => [X0 + a * sc, Y0 - b * sc];
        c.fillStyle = C.faint; c.fillRect(0, Y0, W, 2);
        // level axes (grey) at the launch point
        c.strokeStyle = C.muted; c.lineWidth = 1.2; kit.arrow(c, X0, Y0, X0 + 5 * sc, Y0, C.muted, 1.4); kit.arrow(c, X0, Y0, X0, Y0 - 5 * sc, C.muted, 1.4);
        kit.label(c, 'x', X0 + 5 * sc + 6, Y0 - 8, { size: 12, color: C.muted }); kit.label(c, 'y', X0 + 6, Y0 - 5 * sc, { size: 12, color: C.muted });
        // the turned axes (blue)
        const [Ox, Oy] = P(ox, oy), L = 4.5 * sc, blue = kit.hue(215);
        const ex = [Math.cos(th), -Math.sin(th)], ey = [-Math.sin(th), -Math.cos(th)];
        c.strokeStyle = kit.hue(215, 0.18); c.lineWidth = 1;
        for (let k = -6; k <= 6; k++) { c.beginPath(); c.moveTo(Ox + ex[0] * k * sc * 2 - ey[0] * 14 * sc, Oy + ex[1] * k * sc * 2 - ey[1] * 14 * sc); c.lineTo(Ox + ex[0] * k * sc * 2 + ey[0] * 14 * sc, Oy + ex[1] * k * sc * 2 + ey[1] * 14 * sc); c.moveTo(Ox + ey[0] * k * sc * 2 - ex[0] * 14 * sc, Oy + ey[1] * k * sc * 2 - ex[1] * 14 * sc); c.lineTo(Ox + ey[0] * k * sc * 2 + ex[0] * 14 * sc, Oy + ey[1] * k * sc * 2 + ex[1] * 14 * sc); c.stroke(); }
        kit.arrow(c, Ox, Oy, Ox + ex[0] * L, Oy + ex[1] * L, blue, 2); kit.arrow(c, Ox, Oy, Ox + ey[0] * L, Oy + ey[1] * L, blue, 2);
        kit.label(c, 'x′', Ox + ex[0] * (L + 12), Oy + ex[1] * (L + 12), { size: 12, color: blue, weight: 700, align: 'center' });
        kit.label(c, 'y′', Ox + ey[0] * (L + 12), Oy + ey[1] * (L + 12), { size: 12, color: blue, weight: 700, align: 'center' });
        kit.dot(c, Ox, Oy, 6, blue, C.text); kit.dot(c, Ox + ex[0] * L * 0.8, Oy + ex[1] * L * 0.8, 7, kit.hue(215, 0.5), blue);
        G = { ox: Ox, oy: Oy, hx: Ox + ex[0] * L * 0.8, hy: Oy + ex[1] * L * 0.8, X0, Y0, sc };
        // the true path and the ball
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([2, 3]); c.beginPath();
        for (let i = 0; i <= 60; i++) { const s = T * i / 60, [a, b] = P(v0x * s, v0y * s - 0.5 * g * s * s); i ? c.lineTo(a, b) : c.moveTo(a, b); } c.stroke(); c.setLineDash([]);
        c.strokeStyle = kit.hue(205); c.lineWidth = 2.2; c.beginPath();
        for (let i = 0; i <= 60; i++) { const s = tt * i / 60, [a, b] = P(v0x * s, v0y * s - 0.5 * g * s * s); i ? c.lineTo(a, b) : c.moveTo(a, b); } c.stroke();
        if (V.wrong) {
          // the badly written law: a_y′ = −g, a_x′ = 0 in the turned axes, from the same start
          const r0 = turn(0 - ox, 0 - oy, th), u0 = turn(v0x, v0y, th);
          c.strokeStyle = C.bad; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath();
          for (let i = 0; i <= 60; i++) {
            const s = T * 1.3 * i / 60, xb = r0[0] + u0[0] * s, yb = r0[1] + u0[1] * s - 0.5 * g * s * s;
            const xa = ox + xb * Math.cos(th) - yb * Math.sin(th), ya = oy + xb * Math.sin(th) + yb * Math.cos(th), [a, b] = P(xa, ya);
            i ? c.lineTo(a, b) : c.moveTo(a, b);
          }
          c.stroke(); c.setLineDash([]);
          kit.label(c, 'prediction from "a_y′ = −g"', W - 10, 16, { size: 11.5, align: 'right', color: C.bad });
        }
        const [bx, by] = P(x, y), vsc = sc * 0.25, asc = sc * 0.18;
        kit.arrow(c, bx, by, bx + vx * vsc, by - vy * vsc, kit.hue(140), 2.4);
        kit.arrow(c, bx, by, bx, by + g * asc, kit.hue(25), 2.4);
        // the shadows of the velocity on the turned axes
        const vxp = vB[0] * vsc, vyp = vB[1] * vsc;
        c.strokeStyle = kit.hue(140, 0.7); c.lineWidth = 1.3; c.setLineDash([4, 3]); c.beginPath();
        c.moveTo(bx, by); c.lineTo(bx + ex[0] * vxp, by + ex[1] * vxp); c.lineTo(bx + ex[0] * vxp + ey[0] * vyp, by + ex[1] * vxp + ey[1] * vyp); c.stroke(); c.setLineDash([]);
        kit.dot(c, bx, by, 7, kit.hue(205), C.text);
        kit.label(c, 'v', bx + vx * vsc + 6, by - vy * vsc, { size: 12, color: kit.hue(140), weight: 700 });
        kit.label(c, 'a = F/m', bx + 6, by + g * asc + 4, { size: 11.5, color: kit.hue(25), weight: 700 });
        kit.label(c, 'θ = ' + V.th + '°', Ox + 10, Oy + 16, { size: 11.5, color: blue });
        kit.label(c, 'dashed green: v resolved along x′ and y′', 10, 16, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pseudo forces in an accelerating carriage */
  Hyper.sim('mot-pseudo', {
    title: 'Inside an accelerating carriage',
    blurb: `A railway carriage speeds up along a straight track. Inside, a 1 kg weight hangs from the ceiling and a 2 kg box stands on the floor. Choose who describes it. **From the ground** (a row of cameras fixed beside the track): only real forces act — weight, the pull of the string, the push and friction of the floor — and their sum is m**a**, which is exactly what makes the weight and the box speed up with the carriage. **From inside**: nothing is accelerating, so the real forces must be balanced by an extra *pseudo force* −m**a** (purple), acting on everything in proportion to its mass, with no body to exert it.

**Try this**
- Start with 3 m/s²: the weight swings back and settles at the angle where tan θ = a/g — about 17°. Read the angle and the prediction side by side.
- Switch views while it runs. Every measured angle and every position agrees; only the story told about the forces changes.
- Lower the friction under the box below a/g: the box slides back and hits the rear wall. From the ground, the box is not "thrown backwards" — it simply fails to keep up while the floor slides forwards under it.
- Set a negative acceleration (braking): everything leans and slides the other way.
- Notice that the purple arrow is twice as long on the 2 kg box as on the 1 kg weight: pseudo forces, like gravity, are proportional to mass.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Acceleration of the carriage', min: -4, max: 4, step: 0.1, value: 3, unit: 'm/s²' },
        { id: 'mu', label: 'Friction under the box μ (static; sliding 0.8 μ)', min: 0, max: 1, step: 0.01, value: 0.5 },
        { id: 'view', type: 'select', label: 'Describe it', options: [['From the ground', 'ground'], ['From inside the carriage', 'inside']], value: 'ground' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start again', primary: true }] }
      ], id => { if (id === 'go' || id === 'a') start(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'Speed of the carriage'], ['th', 'Tilt of the weight'], ['pr', 'tan θ = a/g predicts'], ['T', 'Pull of the string'], ['bx', 'Box'], ['f', 'Friction on the box']]);
      const g = 9.81, Lp = 1.5, mb = 1, mB = 2, CW = 8, CH = 3, WALL = 3.4, damp = 0.5;
      let s = null;
      function start() { s = { t: 0, X: 0, U: 0, ph: 0, w: 0, bs: 0.8, bv: 0, mode: 'stick', cam: V.a >= 0 ? -5 : -15, fr: 0, wallF: 0 }; }
      start();
      const loop = kit.loop(dt => {
        const a = V.a, n = 20, h = dt / n;
        for (let i = 0; i < n; i++) {
          s.t += h; s.U += a * h; s.X += s.U * h + 0.5 * a * h * h;
          // the pendulum, in the carriage frame: effective gravity (−a, −g)
          const al = (-a * Math.cos(s.ph) - g * Math.sin(s.ph)) / Lp - damp * s.w;
          s.w += al * h; s.ph += s.w * h;
          // the box (positions relative to the carriage): held by static friction up to μ m g,
          // otherwise sliding with 0.8 μ m g against its motion relative to the floor, or pressed on a wall
          s.wallF = 0;
          if (s.mode === 'stick') {
            if (Math.abs(a) > V.mu * g) s.mode = 'slide';
            else { s.fr = mB * a; s.bv = 0; }
          }
          if (s.mode === 'wall') {
            const side = Math.sign(s.bs);
            if (a === 0 || Math.sign(-a) !== side) s.mode = Math.abs(a) <= V.mu * g ? 'stick' : 'slide';
            else { s.fr = Math.sign(a) * Math.min(Math.abs(mB * a), V.mu * mB * g); s.wallF = mB * a - s.fr; s.bv = 0; }
          }
          if (s.mode === 'slide') {
            const dir = Math.abs(s.bv) > 1e-9 ? Math.sign(s.bv) : (Math.sign(-a) || 1);
            s.fr = -0.8 * V.mu * mB * g * dir;
            const nv = s.bv + (-a + s.fr / mB) * h;
            if (Math.abs(s.bv) > 1e-9 && Math.sign(nv) !== Math.sign(s.bv)) { s.bv = 0; if (Math.abs(a) <= V.mu * g) s.mode = 'stick'; }
            else s.bv = nv;
            s.bs += s.bv * h;
            if (s.bs <= -WALL + 0.4 && s.bv <= 0) { s.bs = -WALL + 0.4; s.bv = 0; s.mode = 'wall'; }
            if (s.bs >= WALL - 0.4 && s.bv >= 0) { s.bs = WALL - 0.4; s.bv = 0; s.mode = 'wall'; }
          }
        }
        if (s.t > 12 || Math.abs(s.U) > 30) start();
        const th = s.ph * 180 / Math.PI, T = mb * (g * Math.cos(s.ph) - a * Math.sin(s.ph)) + mb * Lp * s.w * s.w;
        ro.set('v', Math.abs(s.U).toFixed(1) + ' m/s (' + (Math.abs(s.U) * 3.6).toFixed(0) + ' km/h)');
        ro.set('th', Math.abs(th).toFixed(1) + '° ' + (th * a < 0 ? 'towards the back' : th === 0 ? '' : 'towards the front'));
        ro.set('pr', (Math.atan(Math.abs(a) / g) * 180 / Math.PI).toFixed(1) + '°');
        ro.set('T', T.toFixed(2) + ' N');
        ro.set('bx', s.mode === 'stick' ? 'held by friction' : s.mode === 'wall' ? 'pressed on the ' + ((s.bs < 0) === (s.U >= 0) ? 'rear' : 'front') + ' wall (' + Math.abs(s.wallF).toFixed(1) + ' N)' : 'sliding');
        ro.set('f', Math.abs(s.fr).toFixed(2) + ' N (up to ' + (V.mu * mB * g).toFixed(1) + ' N static)');
        // ------------------------------------------------ drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, inside = V.view === 'inside';
        const span = 20, sc = W / span, groundY = H - 40;
        // camera: fixed to the carriage (inside), or a fixed ground camera that jumps ahead when the carriage leaves it
        if (!inside) { if (s.X + CW / 2 > s.cam + span - 0.5) s.cam = s.X - CW / 2 - 1; if (s.X - CW / 2 < s.cam + 0.5) s.cam = s.X + CW / 2 + 1 - span; }
        const cam = inside ? s.X - span / 2 : s.cam;
        const PX = x => (x - cam) * sc, PY = y => groundY - y * sc;
        // ground and posts every 2 m
        c.fillStyle = C.faint; c.fillRect(0, groundY, W, 3);
        for (let x = Math.floor(cam / 2) * 2; x <= cam + span + 2; x += 2) {
          const X = PX(x); c.fillStyle = C.muted; c.fillRect(X - 1, groundY - 12, 2, 12);
          if (x % 10 === 0) kit.label(c, x + ' m', X, groundY + 14, { size: 10, align: 'center', color: C.muted });
        }
        kit.label(c, inside ? 'Camera riding in the carriage' : 'Camera fixed to the ground', 10, 14, { size: 12, weight: 700, color: C.text });
        // the carriage
        const cx0 = PX(s.X - CW / 2), cx1 = PX(s.X + CW / 2), cy0 = PY(CH + 0.5), cy1 = PY(0.5);
        c.fillStyle = kit.hue(205, 0.1); c.fillRect(cx0, cy0, cx1 - cx0, cy1 - cy0);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(cx0, cy0, cx1 - cx0, cy1 - cy0);
        kit.dot(c, PX(s.X - CW / 2 + 1.2), PY(0.25), 0.25 * sc, C.muted); kit.dot(c, PX(s.X + CW / 2 - 1.2), PY(0.25), 0.25 * sc, C.muted);
        if (!inside) kit.arrow(c, (cx0 + cx1) / 2, cy0 - 14, (cx0 + cx1) / 2 + clamp(a * 18, -80, 80), cy0 - 14, C.text, 2.5);
        if (!inside) kit.label(c, 'a = ' + a.toFixed(1) + ' m/s²', (cx0 + cx1) / 2, cy0 - 28, { size: 11.5, align: 'center', color: C.text });
        const fsc = 4.2, pseudoCol = kit.hue(285), realCol = kit.hue(205), netCol = C.text;
        // the pendulum
        const pvx = PX(s.X - 1.2), pvy = cy0, bxp = pvx + Lp * sc * Math.sin(s.ph), byp = pvy + Lp * sc * Math.cos(s.ph);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(pvx, pvy); c.lineTo(bxp, byp); c.stroke();
        c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(pvx, pvy); c.lineTo(pvx, pvy + Lp * sc * 1.1); c.stroke(); c.setLineDash([]);
        const Tx = -Math.sin(s.ph) * T, Ty = Math.cos(s.ph) * T;          // tension on the bob, pointing to the pivot (y up)
        kit.arrow(c, bxp, byp, bxp + Tx * fsc, byp - Ty * fsc, realCol, 2);
        kit.arrow(c, bxp, byp, bxp, byp + mb * g * fsc, realCol, 2);
        if (inside) kit.arrow(c, bxp, byp, bxp - mb * a * fsc, byp, pseudoCol, 2.5);
        else { const nx = Tx, ny = Ty - mb * g; if (Math.hypot(nx, ny) > 0.2) { c.setLineDash([5, 3]); kit.arrow(c, bxp, byp + 16, bxp + nx * fsc, byp + 16 - ny * fsc, netCol, 1.8); c.setLineDash([]); } }
        kit.dot(c, bxp, byp, 9, kit.hue(25), C.text);
        kit.label(c, '1 kg', bxp, byp, { size: 9, align: 'center', color: '#fff', weight: 700 });
        // the box
        const bw = 0.8, bh = 0.7, bxc = PX(s.X + s.bs), by1 = cy1, by0 = by1 - bh * sc;
        c.fillStyle = kit.hue(45, 0.85); c.fillRect(bxc - bw * sc / 2, by0, bw * sc, bh * sc); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(bxc - bw * sc / 2, by0, bw * sc, bh * sc);
        kit.label(c, '2 kg', bxc, (by0 + by1) / 2, { size: 10, align: 'center', color: '#222', weight: 700 });
        kit.arrow(c, bxc, (by0 + by1) / 2, bxc, (by0 + by1) / 2 + mB * g * fsc * 0.5, realCol, 2);
        kit.arrow(c, bxc, by0, bxc, by0 - mB * g * fsc * 0.5, realCol, 2);
        if (Math.abs(s.fr) > 0.05) kit.arrow(c, bxc, by1 - 3, bxc + s.fr * fsc, by1 - 3, kit.hue(140), 2.5);
        if (Math.abs(s.wallF) > 0.05) { const wx = bxc - Math.sign(s.wallF) * bw * sc / 2; kit.arrow(c, wx, (by0 + by1) / 2 + 6, wx + s.wallF * fsc, (by0 + by1) / 2 + 6, realCol, 2.5); }
        if (inside) kit.arrow(c, bxc, by0 + 6, bxc - mB * a * fsc, by0 + 6, pseudoCol, 2.5);
        // legend
        const lx = W - 12; let ly = 14;
        const leg = (txt, col) => { kit.label(c, txt, lx, ly, { size: 11, align: 'right', color: col }); ly += 15; };
        leg('real forces: weight, string, floor', realCol); leg('friction from the floor', kit.hue(140));
        if (inside) leg('pseudo force −m·a (no source)', pseudoCol); else leg('dashed: net force on the weight = m·a', netCol);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ work on a contour map */
  const hMap = (x, y) => 150 + 300 * Math.exp(-((x + 1.3) ** 2 + (y - 0.5) ** 2) / 0.8) - 220 * Math.exp(-((x - 1.2) ** 2 + (y + 0.6) ** 2) / 0.7) + 40 * y;
  const hGrad = (x, y) => {
    const e1 = 300 * Math.exp(-((x + 1.3) ** 2 + (y - 0.5) ** 2) / 0.8), e2 = -220 * Math.exp(-((x - 1.2) ** 2 + (y + 0.6) ** 2) / 0.7);
    return [e1 * (-2 * (x + 1.3) / 0.8) + e2 * (-2 * (x - 1.2) / 0.7), e1 * (-2 * (y - 0.5) / 0.8) + e2 * (-2 * (y + 0.6) / 0.7) + 40];
  };
  let MAPC = null;
  function contourMap() {
    if (MAPC) return MAPC;
    const nx = 72, ny = 48, cells = [], segs = [];
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const x = -3 + (i + 0.5) * 6 / nx, y = 2 - (j + 0.5) * 4 / ny;
      cells.push([x, y, clamp((hMap(x, y) + 100) / 600, 0, 1)]);
    }
    // marching squares, one level every 50 m
    const mx = 90, my = 60, dx = 6 / mx, dy = 4 / my;
    for (let lev = -100; lev <= 500; lev += 50) for (let i = 0; i < mx; i++) for (let j = 0; j < my; j++) {
      const x0 = -3 + i * dx, y0 = -2 + j * dy, co = [[x0, y0], [x0 + dx, y0], [x0 + dx, y0 + dy], [x0, y0 + dy]];
      const v = co.map(p => hMap(p[0], p[1]) - lev), cut = [];
      for (let e = 0; e < 4; e++) { const a = v[e], b = v[(e + 1) % 4]; if ((a < 0) !== (b < 0)) { const f = a / (a - b), p0 = co[e], p1 = co[(e + 1) % 4]; cut.push([p0[0] + f * (p1[0] - p0[0]), p0[1] + f * (p1[1] - p0[1])]); } }
      if (cut.length >= 2) segs.push([cut[0], cut[1]]);
      if (cut.length === 4) segs.push([cut[2], cut[3]]);
    }
    MAPC = { nx, ny, cells, segs };
    return MAPC;
  }
  Hyper.sim('mot-contour', {
    title: 'Work along two routes across the hills',
    blurb: `A contour map of a landscape (heights in metres, distances in km): the potential energy of a hiker is U = mgh, so the contour lines are lines of equal potential energy. The small arrows show gravity's pull along the ground, −mg × slope — the downhill direction, the [[?gradient]] with a minus sign. Two routes (blue and orange) join A to B; the hikers walk them together and the graph adds up the work gravity does on each, step by step — a [[?line-integral]].

**Try this**
- Drag the orange and blue handles to reshape the routes. However you wander, over the hill or through the valley, gravity's work from A to B comes out the same: −mg(h_B − h_A). That is what makes gravity *conservative*.
- Watch the curves in the graph: they go up and down differently along the way, but finish at the same value.
- Tick *Add a circling wind*: now there is also a force that swirls round a point. Its work does depend on the route — go round the loop A → B one way and back the other, and the wind has done net work. Such a force has a [[?curl]]; it cannot have a potential energy.
- Drag A or B onto the same contour line: the work of gravity along any route between them is zero.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Mass of the hiker', min: 40, max: 120, step: 1, value: 70, unit: 'kg' },
        { id: 'wind', type: 'check', label: 'Add a circling wind (a force with a curl)', value: false },
        { id: 'F0', label: 'Strength of the wind', min: 5, max: 80, step: 1, value: 40, unit: 'N' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the routes', primary: true }] }
      ], id => { if (id === 'reset') pts = init(); dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['hA', 'Heights of A and B'], ['dU', '−mg(h_B − h_A)'], ['g1', 'Gravity\'s work, blue route'], ['g2', 'Gravity\'s work, orange route'], ['w1', 'Wind\'s work, blue / orange'], ['loop', 'Round the loop (blue there, orange back)']]);
      const plot = kit.plot(gb, { x: { label: 'fraction of the route walked', min: 0, max: 1 }, y: { label: 'work done so far (kJ)' }, legend: true }, 150);
      const XR = [-3, 3], YR = [-2, 2], g = 9.81, WC = [0.3, 0.1], WR = 1.2;
      const init = () => ({ A: [-2.4, -1.3], B: [2.3, 1.2], P1: [-1.1, 1.6], P2: [1.3, -1.7] });
      let pts = init(), dirty = true, walk = 0, res = null, G = null;
      const wind = (x, y) => { const dx = x - WC[0], dy = y - WC[1], r = Math.hypot(dx, dy), f = V.F0 * (r / WR) * Math.exp(0.5 - r * r / (WR * WR)) * Math.SQRT2; return r < 1e-9 ? [0, 0] : [-dy / r * f, dx / r * f]; };
      const bez = (P, s) => [(1 - s) * (1 - s) * pts.A[0] + 2 * (1 - s) * s * P[0] + s * s * pts.B[0], (1 - s) * (1 - s) * pts.A[1] + 2 * (1 - s) * s * P[1] + s * s * pts.B[1]];
      function integrate(P) {
        const N = 300, out = []; let wg = 0, ww = 0, prev = bez(P, 0);
        out.push([0, 0, 0, prev]);
        for (let i = 1; i <= N; i++) {
          const q = bez(P, i / N), mx = (q[0] + prev[0]) / 2, my = (q[1] + prev[1]) / 2, gr = hGrad(mx, my);
          const dx = q[0] - prev[0], dy = q[1] - prev[1];
          wg += -V.m * g * (gr[0] * dx + gr[1] * dy);             // slope (m per km) × step (km) = height change (m)
          const wv = wind(mx, my); ww += (wv[0] * dx + wv[1] * dy) * 1000; // N × m
          out.push([i / N, wg, ww, q]); prev = q;
        }
        return out;
      }
      function compute() {
        const r1 = integrate(pts.P1), r2 = integrate(pts.P2);
        res = { r1, r2 };
        const k = V.wind ? 1 : 0, tot = (row) => (row[1] + k * row[2]) / 1000;
        plot.set({ series: [{ pts: r1.map(r => [r[0], tot(r)]), label: 'blue route', color: kit.hue(215) }, { pts: r2.map(r => [r[0], tot(r)]), label: 'orange route', color: kit.hue(25) }], hlines: [{ y: -V.m * g * (hMap(pts.B[0], pts.B[1]) - hMap(pts.A[0], pts.A[1])) / 1000, label: '−mgΔh' }], y: { label: V.wind ? 'work of gravity + wind so far (kJ)' : 'work of gravity so far (kJ)' } });
        const hA = hMap(pts.A[0], pts.A[1]), hB = hMap(pts.B[0], pts.B[1]), e1 = r1[r1.length - 1], e2 = r2[r2.length - 1];
        ro.set('hA', hA.toFixed(0) + ' m, ' + hB.toFixed(0) + ' m');
        ro.set('dU', (-V.m * g * (hB - hA) / 1000).toFixed(2) + ' kJ');
        ro.set('g1', (e1[1] / 1000).toFixed(2) + ' kJ'); ro.set('g2', (e2[1] / 1000).toFixed(2) + ' kJ');
        ro.set('w1', V.wind ? (e1[2] / 1000).toFixed(2) + ' / ' + (e2[2] / 1000).toFixed(2) + ' kJ' : 'no wind');
        ro.set('loop', ((e1[1] - e2[1] + (V.wind ? e1[2] - e2[2] : 0)) / 1000).toFixed(2) + ' kJ');
      }
      kit.drag(st, {
        hit: p => { if (!G) return null; for (const k of ['P1', 'P2', 'A', 'B']) { const q = G.P(pts[k]); if (Math.hypot(p.x - q[0], p.y - q[1]) < 14) return k; } return null; },
        move: (k, p) => { if (!G) return; pts[k] = [clamp(G.ix(p.x), XR[0] + 0.1, XR[1] - 0.1), clamp(G.iy(p.y), YR[0] + 0.1, YR[1] - 0.1)]; dirty = true; },
        hover: true
      });
      const loop = kit.loop(dt => {
        if (dirty) { dirty = false; compute(); }
        walk = (walk + dt / 7) % 1;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const sc = Math.min((W - 20) / 6, (H - 20) / 4), ox = W / 2, oy = H / 2;
        const P = q => [ox + q[0] * sc, oy - q[1] * sc]; G = { P, ix: x => (x - ox) / sc, iy: y => (oy - y) / sc };
        // coloured heights and contour lines every 50 m (both computed once, in map coordinates)
        const map = contourMap(), cw = 6 * sc / map.nx, chh = 4 * sc / map.ny;
        map.cells.forEach(([x, y, u]) => {
          c.fillStyle = 'hsl(' + (130 - 110 * u).toFixed(0) + ' 45% ' + (C.dark ? 22 + 22 * u : 78 - 20 * u).toFixed(0) + '%)';
          c.fillRect(ox + (x - 3 / map.nx) * sc, oy - (y + 2 / map.ny) * sc, cw + 0.6, chh + 0.6);
        });
        c.strokeStyle = C.dark ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)'; c.lineWidth = 1; c.beginPath();
        for (const sg of map.segs) { const a = P(sg[0]), b = P(sg[1]); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
        c.stroke();
        // gravity's pull along the ground (and the wind)
        for (let x = -2.75; x <= 2.8; x += 0.5) for (let y = -1.75; y <= 1.8; y += 0.5) {
          const gr = hGrad(x, y), [X, Y] = P([x, y]), fx = -gr[0], fy = -gr[1], len = Math.hypot(fx, fy);
          if (len > 1) { const k = Math.min(18, 3 + len * 0.04) / len; kit.arrow(c, X, Y, X + fx * k, Y - fy * k, C.dark ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.55)', 1.2, 5); }
          if (V.wind) { const wv = wind(x, y), wl = Math.hypot(wv[0], wv[1]); if (wl > 0.5) { const k = Math.min(20, 4 + wl * 0.3) / wl; kit.arrow(c, X + 3, Y + 3, X + 3 + wv[0] * k, Y + 3 - wv[1] * k, kit.hue(285), 1.4, 5); } }
        }
        // the routes and the walking hikers
        const route = (key, hue, r) => {
          c.strokeStyle = kit.hue(hue); c.lineWidth = 3; c.beginPath();
          for (let i = 0; i <= 60; i++) { const q = P(bez(pts[key], i / 60)); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } c.stroke();
          const hp = P(pts[key]); kit.dot(c, hp[0], hp[1], 7, kit.hue(hue, 0.5), kit.hue(hue));
          const k = Math.min(r.length - 1, Math.round(walk * (r.length - 1))), row = r[k], q = P(row[3]);
          kit.dot(c, q[0], q[1], 6, kit.hue(hue), C.text);
          const w = (row[1] + (V.wind ? row[2] : 0)) / 1000;
          kit.label(c, (w >= 0 ? '+' : '−') + Math.abs(w).toFixed(1) + ' kJ', q[0] + 9, q[1] - 10, { size: 11, color: C.text, bg: C.surface || C.bg2 });
        };
        if (res) { route('P1', 215, res.r1); route('P2', 25, res.r2); }
        const a = P(pts.A), b = P(pts.B);
        kit.dot(c, a[0], a[1], 8, C.text); kit.dot(c, b[0], b[1], 8, C.text);
        kit.label(c, 'A', a[0] - 16, a[1], { size: 13, weight: 700, color: C.text, bg: C.surface || C.bg2 }); kit.label(c, 'B', b[0] + 10, b[1], { size: 13, weight: 700, color: C.text, bg: C.surface || C.bg2 });
        kit.label(c, 'contours every 50 m', 8, H - 10, { size: 10.5, color: C.text, bg: C.surface || C.bg2 });
        if (V.wind) { const wc = P(WC); kit.label(c, '↺ wind', wc[0], wc[1], { size: 11, align: 'center', color: kit.hue(285), weight: 700 }); }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Newton's cannon and the falling Moon */
  const GME = 3.986004e14, RE = 6.371e6, RMOON = 3.844e8, TMOON = 27.32 * 86400;
  Hyper.sim('mot-cannon', {
    title: 'Newton\'s cannon and the falling Moon',
    blurb: `**Newton's cannon** stands on a mountain so high that there is no air, and fires horizontally. Each shot falls towards the Earth's centre — but the Earth is round, so the ground curves away beneath it. The inset shows the first second magnified (the vertical scale is stretched): the fall below a straight line, and the drop of the curved ground over the same distance. When the two match, the shot never lands. **The Moon** does the same thing 60 Earth radii away, falling 3600 times more gently.

**Try this**
- Fire at 5, 7 and 7.8 km/s: the shots land farther and farther round the Earth. Near the circular speed the fall and the curve in the inset coincide: an orbit.
- Fire faster than the circular speed: an ellipse, with the cannon at its lowest point. Above about 11 km/s the shot escapes for good (the escape speed is √2 times the circular speed).
- Raise the mountain: the circular speed drops, because gravity is weaker farther out — the [[?inverse]]-square law at work.
- Choose the Moon: the dashed line is where the Moon would go with no gravity; the gap is how far it has fallen. For short times the gap grows as ½at² with a = 2.72 mm/s², which is g/3600 — and 3600 is (60 Earth radii)².`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Newton\'s cannon', 'cannon'], ['The Moon falling', 'moon']], value: 'cannon' },
        { id: 'v', label: 'Firing speed', min: 1, max: 11.5, step: 0.05, value: 7.7, unit: 'km/s' },
        { id: 'h', label: 'Height of the mountain', min: 50, max: 2000, step: 10, value: 200, unit: 'km' },
        { id: 'win', label: 'Moon: compare over', min: 1, max: 96, step: 1, value: 48, unit: 'h' },
        { type: 'buttons', items: [{ id: 'fire', label: 'Fire', primary: true }, { id: 'clear', label: 'Clear the paths' }] }
      ], id => {
        if (id === 'mode') { ctl.show('v', V.mode === 'cannon'); ctl.show('h', V.mode === 'cannon'); ctl.show('win', V.mode === 'moon'); }
        if (id === 'clear') old = [];
        if (id === 'fire' || id === 'v' || id === 'h') fire();
      });
      const V = ctl.values;
      ctl.show('win', false);
      const ro = kit.readout(box.side, [['a', ''], ['b', ''], ['c', ''], ['d', '']]);
      let shot = null, old = [], moonAng = 0.4;
      const acc = (x, y) => { const r = Math.hypot(x, y), k = -GME / (r * r * r); return [k * x, k * y]; };
      function fire() {
        if (shot && shot.pts.length > 2) { old.push(shot); if (old.length > 5) old.shift(); }
        const r0 = RE + V.h * 1000, v = V.v * 1000, eps = v * v / 2 - GME / r0;
        shot = { x: 0, y: r0, vx: v, vy: 0, t: 0, pts: [[0, r0]], done: '', ang: 0, r0, a: eps < 0 ? -GME / (2 * eps) : Infinity };
      }
      fire();
      function stepShot(h) {
        const s = shot, a1 = acc(s.x, s.y);
        s.vx += a1[0] * h / 2; s.vy += a1[1] * h / 2; s.x += s.vx * h; s.y += s.vy * h;
        const a2 = acc(s.x, s.y); s.vx += a2[0] * h / 2; s.vy += a2[1] * h / 2; s.t += h;
        const r = Math.hypot(s.x, s.y), ang = Math.atan2(s.x, s.y); // angle travelled from the top, clockwise
        if (ang < s.last - Math.PI) s.turns = (s.turns || 0) + 1;
        s.last = ang; s.ang = ang + 2 * Math.PI * (s.turns || 0);
        if (r <= RE) { const k = RE / r; s.x *= k; s.y *= k; s.done = 'landed'; }
        else if (s.ang >= 2 * Math.PI) s.done = 'orbit';
        else if (r > 30 * RE) s.done = 'escaped';
      }
      shot.last = 0;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (V.mode === 'cannon') {
          // ------------------------------------------------ the cannon
          if (!shot.done) { const warp = 700, n = Math.max(1, Math.ceil(warp * dt / 4)), h = warp * dt / n; for (let i = 0; i < n && !shot.done; i++) { if (shot.last == null) shot.last = 0; stepShot(h); if (shot.pts.length < 6000) shot.pts.push([shot.x, shot.y]); } }
          const r0 = shot.r0, vc = Math.sqrt(GME / r0), g0 = GME / (r0 * r0), v = V.v * 1000, d1 = v * 1, fall = 0.5 * g0, curve = d1 * d1 / (2 * r0);
          ro.set('a', 'circular speed at this height: ' + (vc / 1000).toFixed(2) + ' km/s (escape: ' + (vc * Math.SQRT2 / 1000).toFixed(2) + ')');
          ro.set('b', 'in the first second: travels ' + (d1 / 1000).toFixed(2) + ' km, falls ' + fall.toFixed(2) + ' m');
          ro.set('c', 'over ' + (d1 / 1000).toFixed(2) + ' km the ground curves away ' + curve.toFixed(2) + ' m');
          const s = shot, T = Number.isFinite(s.a) ? 2 * Math.PI * Math.sqrt(s.a ** 3 / GME) : NaN;
          ro.set('d', s.done === 'landed' ? 'landed ' + Math.round(s.ang * RE / 1000) + ' km round the Earth after ' + (s.t / 60).toFixed(1) + ' min' : s.done === 'orbit' ? 'in orbit: once round every ' + (T / 60).toFixed(1) + ' min, farthest ' + Math.round((2 * s.a - r0 - RE) / 1000) + ' km up' : s.done === 'escaped' ? 'escaped — it never comes back' : 'flying… ' + (s.t / 60).toFixed(1) + ' min');
          // frame the whole orbit: from the mountain top down to the far point, and as wide as the ellipse
          const ecc = Math.abs(v * v / (vc * vc) - 1), bound = Number.isFinite(s.a) && s.a > 0;
          const bottom = bound ? clamp(2 * s.a - r0, 1.05 * RE, 8 * RE) : 8 * RE, top = r0 * 1.06;
          const half = bound ? clamp(s.a * Math.sqrt(Math.max(0, 1 - ecc * ecc)), 1.1 * RE, 8 * RE) : 8 * RE;
          const aw = W * 0.66, sc = Math.min(aw / (2.1 * half), (H - 16) / (top + bottom)), cx = aw / 2, cy = 8 + top * sc;
          const P = (x, y) => [cx + x * sc, cy - y * sc];
          // the Earth and the mountain
          c.fillStyle = kit.hue(200, 0.5); c.beginPath(); c.arc(cx, cy, RE * sc, 0, 7); c.fill();
          c.strokeStyle = kit.hue(140, 0.9); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, RE * sc, 0, 7); c.stroke();
          const mh = Math.max(6, (r0 - RE) * sc);
          c.fillStyle = C.muted; c.beginPath(); c.moveTo(cx - mh * 0.9, cy - RE * sc + 1); c.lineTo(cx, cy - RE * sc - mh); c.lineTo(cx + mh * 0.9, cy - RE * sc + 1); c.closePath(); c.fill();
          kit.label(c, 'Earth', cx, cy, { size: 12, align: 'center', color: C.text, weight: 600 });
          // paths
          const path = (pts, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach((p, i) => { const q = P(p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.stroke(); };
          old.forEach(o => path(o.pts, C.faint, 1.3));
          path(s.pts, kit.hue(25), 2.2);
          const b = P(s.x, s.y); kit.dot(c, b[0], b[1], 4.5, kit.hue(25), C.text);
          if (!s.done) { const sp = Math.hypot(s.vx, s.vy); kit.arrow(c, b[0], b[1], b[0] + s.vx / sp * 26, b[1] - s.vy / sp * 26, kit.hue(140), 2); }
          // the first second, magnified
          const ix = W * 0.7, iy = 20, iw = W * 0.28, ih = H * 0.42, hs = (iw - 20) / Math.max(d1, 1), vsc = (ih - 50) / Math.max(fall, curve, 5) * 0.9;
          c.fillStyle = C.surface || C.bg2; c.fillRect(ix, iy, iw, ih); c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(ix, iy, iw, ih);
          kit.label(c, 'the first second (height × ' + kit.fmt(vsc / hs, 2) + ')', ix + 6, iy + 10, { size: 10.5, color: C.muted });
          const X = x => ix + 10 + x * hs, Y = yy => iy + 28 + yy * vsc;
          c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(d1), Y(0)); c.stroke(); c.setLineDash([]);
          c.strokeStyle = kit.hue(140); c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 40; i++) { const x = d1 * i / 40; i ? c.lineTo(X(x), Y(x * x / (2 * r0))) : c.moveTo(X(x), Y(0)); } c.stroke();
          c.strokeStyle = kit.hue(25); c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 40; i++) { const tt = i / 40, x = v * tt; i ? c.lineTo(X(x), Y(0.5 * g0 * tt * tt)) : c.moveTo(X(0), Y(0)); } c.stroke();
          kit.dot(c, X(d1), Y(fall), 4, kit.hue(25));
          kit.label(c, 'shot: falls ' + fall.toFixed(1) + ' m', ix + 8, iy + ih - 24, { size: 10.5, color: kit.hue(25) });
          kit.label(c, 'level ground: drops ' + curve.toFixed(1) + ' m', ix + 8, iy + ih - 10, { size: 10.5, color: kit.hue(140) });
        } else {
          // ------------------------------------------------ the Moon
          const w = 2 * Math.PI / TMOON, vm = w * RMOON, am = w * w * RMOON, tw = V.win * 3600;
          moonAng += dt * w * 86400 * 0.6;
          const sc = Math.min(W, H) * 0.42 / RMOON, cx = W * 0.42, cy = H / 2, P = (x, y) => [cx + x * sc, cy - y * sc];
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, RMOON * sc, 0, 7); c.stroke();
          kit.dot(c, cx, cy, Math.max(2.5, RE * sc), kit.hue(200)); kit.label(c, 'Earth (to scale)', cx + 8, cy + 12, { size: 10.5, color: C.muted });
          const mx = RMOON * Math.cos(moonAng), my = RMOON * Math.sin(moonAng), tx = -Math.sin(moonAng), ty = Math.cos(moonAng);
          const straight = [mx + tx * vm * tw, my + ty * vm * tw], ang2 = moonAng + w * tw, real = [RMOON * Math.cos(ang2), RMOON * Math.sin(ang2)];
          const pm = P(mx, my), ps = P(straight[0], straight[1]), pr = P(real[0], real[1]);
          c.strokeStyle = C.muted; c.setLineDash([5, 4]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(pm[0], pm[1]); c.lineTo(ps[0], ps[1]); c.stroke(); c.setLineDash([]);
          c.strokeStyle = kit.hue(25); c.lineWidth = 2.5; c.beginPath(); c.arc(cx, cy, RMOON * sc, -ang2, -moonAng); c.stroke();
          c.strokeStyle = kit.hue(0, 0.9); c.lineWidth = 2; c.beginPath(); c.moveTo(ps[0], ps[1]); c.lineTo(cx + (ps[0] - cx) * RMOON / Math.hypot(straight[0], straight[1]), cy + (ps[1] - cy) * RMOON / Math.hypot(straight[0], straight[1])); c.stroke();
          kit.dot(c, pm[0], pm[1], 6, C.muted); kit.dot(c, pr[0], pr[1], 7, 'hsl(50 20% 80%)', C.text); kit.dot(c, ps[0], ps[1], 5, 'transparent', C.muted);
          kit.arrow(c, pr[0], pr[1], pr[0] + (cx - pr[0]) * 0.18, pr[1] + (cy - pr[1]) * 0.18, kit.hue(25), 2);
          kit.label(c, 'where it would be with no gravity', ps[0] + 8, ps[1], { size: 10.5, color: C.muted, bg: C.bg2 });
          kit.label(c, 'Moon, ' + V.win + ' h later', pr[0] + 10, pr[1] + 12, { size: 10.5, color: C.text, bg: C.bg2 });
          const gap = Math.hypot(straight[0], straight[1]) - RMOON;
          ro.set('a', 'Moon\'s acceleration: ' + (am * 1000).toFixed(3) + ' mm/s² = g/' + (9.81 / am).toFixed(0));
          ro.set('b', '(distance / Earth radius)² = ' + (RMOON / RE).toFixed(1) + '² = ' + ((RMOON / RE) ** 2).toFixed(0));
          ro.set('c', 'fall in 1 s: ' + (0.5 * am * 1000).toFixed(2) + ' mm (an apple: 4.9 m)');
          ro.set('d', 'fallen below the straight line in ' + V.win + ' h: ' + Math.round(gap / 1000).toLocaleString('en-GB') + ' km (½at²: ' + Math.round(0.5 * am * tw * tw / 1000).toLocaleString('en-GB') + ' km)');
          // the apple beside it, for comparison
          const ax = W * 0.86, ay0 = 40;
          kit.label(c, 'an apple in 1 s', ax, 18, { size: 11, align: 'center', color: C.muted });
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(ax, ay0); c.lineTo(ax, ay0 + 120); c.stroke();
          kit.dot(c, ax, ay0 + 120 * ((loop.t || 0) % 1.5 < 1 ? ((loop.t || 0) % 1.5) ** 2 : 1), 6, kit.hue(0));
          kit.label(c, '4.9 m', ax + 10, ay0 + 120, { size: 11, color: C.text });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Kepler's laws */
  const PLANETS = [['Mercury', 0.387, 0.241], ['Venus', 0.723, 0.615], ['Earth', 1, 1], ['Mars', 1.524, 1.881], ['Jupiter', 5.203, 11.86], ['Saturn', 9.537, 29.46]];
  Hyper.sim('mot-kepler', {
    title: 'Kepler\'s laws from an orbit',
    blurb: `A planet is launched sideways at a chosen distance from the Sun, and Newton's law moves it (in astronomical units and years). The orbit is divided into **equal times**: the coloured sectors are the areas swept in each, and their sizes are listed. Below, each orbit you launch adds a point to a [[?logarithm|log–log]] plot of period against semi-major axis, next to the real planets.

**Try this**
- Launch at 0.7 of the circular speed: a long ellipse. The sectors near the Sun are short and fat, those far away long and thin — and their areas are all equal. That is Kepler's second law.
- Tick *Newton's kicks*: the pull is replaced by a kick towards the Sun at the end of each interval, and the planet moves straight in between. The triangles swept (with the dashed "no-kick" triangle beside each) still have exactly equal areas: any force aimed at the Sun gives equal areas.
- Launch orbits at several distances and speeds. Every point lands on the line $T = a^{3/2}$, with Mercury, the Earth and Jupiter: the third law, from the [[?inverse]] square.
- Try 1.3 × circular speed: a comet-like orbit, slow and far for most of its period.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'r0', label: 'Launch distance from the Sun', min: 0.4, max: 3, step: 0.05, value: 1, unit: 'AU' },
        { id: 'k', label: 'Launch speed (× circular speed)', min: 0.55, max: 1.3, step: 0.01, value: 0.75 },
        { id: 'n', label: 'Equal time slices per orbit', min: 4, max: 24, step: 1, value: 12 },
        { id: 'kick', type: 'check', label: 'Newton\'s kicks (straight lines and kicks towards the Sun)', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Launch', primary: true }, { id: 'clear', label: 'Clear the plot' }] }
      ], id => { if (id === 'clear') { mine = []; plotIt(); } else reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ae', 'Semi-major axis, eccentricity'], ['T', 'Period: a^1.5 (Kepler) / measured'], ['A', 'Area of each slice'], ['v', 'Speed now'], ['h', 'r × v (twice the areal rate)']]);
      const plot = kit.plot(gb, { x: { label: 'semi-major axis a (AU)', log: true, min: 0.2, max: 40 }, y: { label: 'period T (years)', log: true, min: 0.05, max: 300 }, legend: true }, 170);
      let mine = [], S = null;
      function plotIt() {
        const line = []; for (let i = 0; i <= 40; i++) { const a = 0.2 * Math.pow(200, i / 40); line.push([a, Math.pow(a, 1.5)]); }
        plot.set({ series: [{ pts: line, label: 'T = a^1.5 (years, AU)', dash: [5, 4], width: 1.4 }, { pts: PLANETS.map(p => [p[1], p[2]]), label: 'the planets', line: false, dots: 4 }, { pts: mine.map(p => [p[0], p[1]]), label: 'your orbits', line: false, dots: 5.5 }], marks: PLANETS.filter((p, i) => i % 2 === 0 || i === 4).map(p => ({ x: p[1], y: p[2], label: p[0], r: 0.1 })) });
      }
      function reset() {
        const r0 = V.r0, vc = Math.sqrt(GM4 / r0), v = V.k * vc, eps = v * v / 2 - GM4 / r0, a = -GM4 / (2 * eps), T = Math.pow(a, 1.5);
        S = { x: r0, y: 0, vx: 0, vy: v, t: 0, a, e: Math.abs(V.k * V.k - 1), T, sl: [], cur: [[r0, 0]], area: 0, prevAng: 0, ang: 0, measured: null, kpts: [[r0, 0]], kv: [0, v], kT: 0, recorded: false };
        S.slice = T / V.n;
      }
      reset(); plotIt();
      const loop = kit.loop(dt => {
        const warp = S.T / 9;                       // one orbit in about nine seconds
        if (!V.kick) {
          const nsub = Math.max(1, Math.ceil(warp * dt / (S.T / 3000))), h = warp * dt / nsub;
          for (let i = 0; i < nsub; i++) {
            const r1 = Math.hypot(S.x, S.y), k1 = -GM4 / (r1 * r1 * r1);
            S.vx += k1 * S.x * h / 2; S.vy += k1 * S.y * h / 2;
            const ox = S.x, oy = S.y; S.x += S.vx * h; S.y += S.vy * h;
            const r2 = Math.hypot(S.x, S.y), k2 = -GM4 / (r2 * r2 * r2);
            S.vx += k2 * S.x * h / 2; S.vy += k2 * S.y * h / 2; S.t += h;
            S.area += 0.5 * Math.abs(ox * S.y - oy * S.x); S.cur.push([S.x, S.y]);
            const an = Math.atan2(S.y, S.x); let d = an - S.prevAng; if (d < -Math.PI) d += 2 * Math.PI; if (d > Math.PI) d -= 2 * Math.PI; S.ang += d; S.prevAng = an;
            if (S.measured == null && S.ang >= 2 * Math.PI) S.measured = S.t;
            if (S.t >= S.slice * (S.sl.length + 1) - 1e-12) { S.sl.push({ pts: S.cur, area: S.area }); if (S.sl.length > V.n) S.sl.shift(), S.sl.base = (S.sl.base || 0) + 1; S.cur = [[S.x, S.y]]; S.area = 0; }
          }
        } else {
          // Newton's kicks: straight for Δt, then a kick towards the Sun
          const Dt = S.T / V.n; S.kT += dt * warp / Dt * 0.8;
          while (S.kT >= 1) {
            S.kT -= 1; const p = S.kpts[S.kpts.length - 1], q = [p[0] + S.kv[0] * Dt, p[1] + S.kv[1] * Dt], r = Math.hypot(q[0], q[1]), k = -GM4 / (r * r * r);
            if (r < 0.02 || r > 200) { reset(); break; }
            S.kpts.push(q); S.kv = [S.kv[0] + k * q[0] * Dt, S.kv[1] + k * q[1] * Dt];
            if (S.kpts.length > 3 * V.n + 1) S.kpts.shift();
            S.t += Dt; if (S.measured == null && S.t >= S.T) S.measured = S.T;
          }
        }
        if (S.measured != null && !S.recorded && !V.kick) { S.recorded = true; mine.push([S.a, S.measured]); if (mine.length > 12) mine.shift(); plotIt(); }
        // read-outs
        const areas = S.sl.map(s => s.area), mean = areas.length ? areas.reduce((p, q) => p + q, 0) / areas.length : 0, spread = areas.length ? (Math.max(...areas) - Math.min(...areas)) / Math.max(1e-12, mean) : 0;
        ro.set('ae', S.a.toFixed(3) + ' AU, e = ' + S.e.toFixed(3));
        ro.set('T', S.T.toFixed(3) + ' yr / ' + (S.measured != null ? S.measured.toFixed(3) + ' yr' : 'first orbit running…'));
        const sp = V.kick ? Math.hypot(S.kv[0], S.kv[1]) : Math.hypot(S.vx, S.vy);
        ro.set('v', sp.toFixed(2) + ' AU/yr = ' + (sp * 4.7405).toFixed(1) + ' km/s');
        if (V.kick) {
          const tri = []; for (let i = 1; i < S.kpts.length; i++) { const p = S.kpts[i - 1], q = S.kpts[i]; tri.push(0.5 * Math.abs(p[0] * q[1] - p[1] * q[0])); }
          ro.set('A', tri.length ? 'each triangle ' + tri[tri.length - 1].toFixed(4) + ' AU²' + (tri.length > 1 ? ' (all equal, to ' + kit.fmt(Math.max(1e-14, (Math.max(...tri) - Math.min(...tri)) / tri[0] * 100), 1) + ' %)' : '') : '—');
          const p = S.kpts[S.kpts.length - 1]; ro.set('h', Math.abs(p[0] * S.kv[1] - p[1] * S.kv[0]).toFixed(4) + ' AU²/yr');
        } else {
          ro.set('A', areas.length ? mean.toFixed(4) + ' AU² (spread ' + (spread * 100).toFixed(2) + ' %)' : 'first slice running…');
          ro.set('h', Math.abs(S.x * S.vy - S.y * S.vx).toFixed(4) + ' AU²/yr');
        }
        // ------------------------------------------------ drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const rOther = 2 * S.a - V.r0, b = S.a * Math.sqrt(Math.max(0, 1 - S.e * S.e)), xmin = -rOther, xmax = V.r0;
        const sc = Math.min((W - 40) / (xmax - xmin), (H - 40) / (2 * b)), cx = W / 2 - (xmin + xmax) / 2 * sc, cy = H / 2;
        const P = (x, y) => [cx + x * sc, cy - y * sc];
        // the true ellipse, faint
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.ellipse(cx + (xmin + xmax) / 2 * sc, cy, S.a * sc, Math.max(0.5, b * sc), 0, 0, 7); c.stroke();
        const cols = [kit.hue(205, 0.35), kit.hue(40, 0.35)];
        if (!V.kick) {
          S.sl.forEach((s, i) => {
            c.fillStyle = cols[((S.sl.base || 0) + i) % 2]; c.beginPath(); c.moveTo(cx, cy); s.pts.forEach(p => { const q = P(p[0], p[1]); c.lineTo(q[0], q[1]); }); c.closePath(); c.fill();
            if (V.n <= 12) { const m = s.pts[Math.floor(s.pts.length / 2)], q = P(m[0] * 0.62, m[1] * 0.62); kit.label(c, s.area.toFixed(3), q[0], q[1], { size: 10, align: 'center', color: C.text }); }
          });
          c.fillStyle = cols[((S.sl.base || 0) + S.sl.length) % 2]; c.beginPath(); c.moveTo(cx, cy); S.cur.forEach(p => { const q = P(p[0], p[1]); c.lineTo(q[0], q[1]); }); c.closePath(); c.fill();
          const pp = P(S.x, S.y); kit.arrow(c, pp[0], pp[1], pp[0] + S.vx * sc * 0.08, pp[1] - S.vy * sc * 0.08, kit.hue(140), 2);
          kit.dot(c, pp[0], pp[1], 6, kit.hue(205), C.text);
        } else {
          const K = S.kpts, frac = S.kT;
          for (let i = 1; i < K.length; i++) {
            const p = P(K[i - 1][0], K[i - 1][1]), q = P(K[i][0], K[i][1]);
            c.fillStyle = cols[i % 2]; c.beginPath(); c.moveTo(cx, cy); c.lineTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.closePath(); c.fill();
            c.strokeStyle = kit.hue(205); c.lineWidth = 2; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke();
          }
          // the last point: the no-kick continuation and the kick
          const Dt = S.T / V.n, L = K[K.length - 1], Lp = K.length > 1 ? K[K.length - 2] : L, vin = [(L[0] - Lp[0]) / Dt, (L[1] - Lp[1]) / Dt];
          const ghost = [L[0] + vin[0] * Dt, L[1] + vin[1] * Dt], nxt = [L[0] + S.kv[0] * Dt, L[1] + S.kv[1] * Dt];
          const pl = P(L[0], L[1]), pg = P(ghost[0], ghost[1]), pn = P(nxt[0], nxt[1]);
          if (K.length > 1) {
            c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(pg[0], pg[1]); c.lineTo(pl[0], pl[1]); c.moveTo(pg[0], pg[1]); c.lineTo(pn[0], pn[1]); c.stroke(); c.setLineDash([]);
            kit.label(c, 'without the kick', pg[0] + 6, pg[1], { size: 10, color: C.muted });
            kit.arrow(c, pl[0], pl[1], pl[0] + (pn[0] - pg[0]), pl[1] + (pn[1] - pg[1]), kit.hue(25), 2);
          }
          const pm = [pl[0] + (pn[0] - pl[0]) * frac, pl[1] + (pn[1] - pl[1]) * frac];
          kit.dot(c, pm[0], pm[1], 6, kit.hue(205), C.text);
          kit.label(c, 'orange: the kick, parallel to the line to the Sun', 10, H - 12, { size: 10.5, color: kit.hue(25) });
        }
        kit.dot(c, cx, cy, 9, 'hsl(45 95% 55%)');
        kit.label(c, 'Sun (at a focus)', cx + 11, cy + 13, { size: 10.5, color: C.muted });
        kit.label(c, 'coloured sectors: equal times', 10, 14, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the lost lecture: the velocity circle */
  const STAGES = [
    'Step 1 — equal angles seen from the Sun. By equal areas, the time spent in each slice grows as r².',
    'Step 2 — pull ∝ 1/r², time ∝ r²: every slice gives the same change of velocity (orange), pointing at the Sun.',
    'Step 3 — drawn from one point O, the velocities end on a circle. Its centre C is off the origin by e × the radius.',
    'Step 4 — turn the velocity diagram by 90°: each radius CP now points the same way as the Sun–planet line of its slice.',
    'Step 5 — the perpendicular bisector of OP meets CP at Q, with CQ + QO = CP: Q traces an ellipse with foci C and O — the orbit\'s shape.'
  ];
  Hyper.sim('mot-hodograph', {
    title: 'Feynman\'s lost lecture: the velocity circle',
    blurb: `Feynman's geometric proof that an inverse-square force gives an ellipse, played step by step. **Left:** the orbit, cut into slices of equal angle as seen from the Sun. **Right:** the velocity diagram — every velocity [[?vector]] of the orbit drawn from one point O. Matching colours mark the same slice in both pictures.

**Try this**
- Press *Next step* and read the caption at each stage; or *Play the proof* to see all five.
- At step 2, compare the orange velocity changes: all the same length, although the slices near the Sun are passed quickly and the far ones slowly. This is where the inverse square is used.
- At step 3, raise the eccentricity: the circle stays a circle, but the origin O slides away from its centre C. At e = 0 they coincide — a circular orbit.
- At step 5, the traced ellipse (orange) has exactly the shape of the orbit on the left, turned the same way. Check the read-out: CQ + QO is the same for every point.
- Add more slices: the polygon of velocity tips closes in on the circle.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'e', label: 'Eccentricity of the orbit', min: 0, max: 0.8, step: 0.01, value: 0.5 },
        { id: 'n', label: 'Equal-angle slices', min: 6, max: 36, step: 1, value: 12 },
        { id: 'stage', type: 'select', label: 'Show', options: STAGES.map((s, i) => [s.split(' — ')[0] + ': ' + ['equal angles', 'equal velocity changes', 'the velocity circle', 'turn by 90°', 'rebuild the ellipse'][i], i + 1]), value: 1 },
        { type: 'buttons', items: [{ id: 'next', label: 'Next step', primary: true }, { id: 'play', label: 'Play the proof' }] }
      ], id => {
        if (id === 'next') { ctl.set('stage', V.stage >= 5 ? 1 : V.stage + 1); play = false; enter(); }
        if (id === 'play') { ctl.set('stage', 1); play = true; enter(); }
        if (id === 'stage') { play = false; enter(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['st', ''], ['u', 'Velocity circle'], ['tr', 'Longest slice time ÷ shortest'], ['chk', 'CQ + QO']]);
      let play = false, since = 0, th = 0.6;
      function enter() { since = 0; }
      const pos = (t, e) => { const r = 1 / (1 + e * Math.cos(t)); return [r * Math.cos(t), r * Math.sin(t)]; };
      const vel = (t, e) => [-Math.sin(t), e + Math.cos(t)];
      const hueK = (k, n) => (k * 360 / n + 200) % 360;
      const loop = kit.loop(dt => {
        const e = V.e, n = V.n, stg = V.stage;
        since += dt;
        if (play && since > (stg === 4 ? 4.5 : 3.8)) { if (stg < 5) { ctl.set('stage', stg + 1); since = 0; } else play = false; }
        // the planet: dθ/dt = L/r² = (1 + e cos θ)² in these units; one orbit (2π/(1 − e²)^1.5) in about nine seconds
        th += dt * Math.pow(1 + e * Math.cos(th), 2) * 2 * Math.PI / (9 * Math.pow(1 - e * e, 1.5));
        const rot = stg < 4 ? 0 : stg === 4 ? -Math.PI / 2 * clamp((since - 0.6) / 1.8, 0, 1) : -Math.PI / 2;
        ro.set('st', STAGES[stg - 1]);
        ro.set('u', 'radius 1 u, centre ' + e.toFixed(2) + ' u from the origin (e = ' + e.toFixed(2) + ')');
        ro.set('tr', (((1 + e) / (1 - e)) ** 2).toFixed(2) + ' = ((1 + e)/(1 − e))²');
        // ------------------------------------------------ the orbit (left)
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, half = W / 2;
        const xmin = -1 / (1 - e), xmax = 1 / (1 + e), bmin = 1 / Math.sqrt(1 - e * e);
        const so = Math.min((half - 30) / (xmax - xmin), (H - 50) / (2 * bmin)), ox = 15 + (half - 30) / 2 - (xmin + xmax) / 2 * so, oy = H / 2 + 8;
        const PO = q => [ox + q[0] * so, oy - q[1] * so];
        kit.label(c, 'the orbit', 12, 14, { size: 12, weight: 700, color: C.text });
        // equal-angle slices
        for (let k = 0; k < n; k++) {
          const t0 = 2 * Math.PI * k / n, t1 = 2 * Math.PI * (k + 1) / n;
          c.fillStyle = kit.hue(hueK(k, n), 0.16); c.beginPath(); c.moveTo(ox, oy);
          for (let j = 0; j <= 12; j++) { const q = PO(pos(t0 + (t1 - t0) * j / 12, e)); c.lineTo(q[0], q[1]); }
          c.closePath(); c.fill();
          const pk = PO(pos(t0, e)); c.strokeStyle = kit.hue(hueK(k, n), 0.6); c.lineWidth = 1; c.beginPath(); c.moveTo(ox, oy); c.lineTo(pk[0], pk[1]); c.stroke();
        }
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath();
        for (let j = 0; j <= 180; j++) { const q = PO(pos(2 * Math.PI * j / 180, e)); j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } c.stroke();
        if (stg === 1 && n <= 18) for (let k = 0; k < n; k++) { const tm = 2 * Math.PI * (k + 0.5) / n, r = 1 / (1 + e * Math.cos(tm)), q = PO([0.62 * r * Math.cos(tm), 0.62 * r * Math.sin(tm)]); kit.label(c, (r * r / Math.pow(1 / (1 + e), 2)).toFixed(1), q[0], q[1], { size: 9.5, align: 'center', color: C.text }); }
        if (stg >= 2) for (let k = 0; k < n; k++) {
          const t = 2 * Math.PI * k / n, p = pos(t, e), q = PO(p), r = Math.hypot(p[0], p[1]), vv = vel(t, e);
          kit.arrow(c, q[0], q[1], q[0] + vv[0] * so * 0.28, q[1] - vv[1] * so * 0.28, kit.hue(hueK(k, n), 0.9), 1.3, 6);
          if (stg === 2) kit.arrow(c, q[0], q[1], q[0] - p[0] / r * so * 0.18, q[1] + p[1] / r * so * 0.18, kit.hue(25), 2, 6);
        }
        kit.dot(c, ox, oy, 7, 'hsl(45 95% 55%)');
        const pp = PO(pos(th, e)); kit.dot(c, pp[0], pp[1], 5.5, kit.hue(205), C.text);
        if (stg === 1) kit.label(c, 'numbers: time in each slice (nearest = 1)', 12, H - 10, { size: 10.5, color: C.muted });
        // ------------------------------------------------ the velocity diagram (right)
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(half, 10); c.lineTo(half, H - 10); c.stroke();
        kit.label(c, 'the velocity diagram', half + 12, 14, { size: 12, weight: 700, color: C.text });
        // the circle's centre C stays in the middle of the panel while the diagram turns (a rigid turn changes nothing in the construction)
        const sv = Math.min((half - 50) / 2.2, (H - 70) / 2.2);
        const R = (q) => [q[0] * Math.cos(rot) - q[1] * Math.sin(rot), q[0] * Math.sin(rot) + q[1] * Math.cos(rot)];
        const Crot = R([0, e]), vx0 = half + half / 2 - Crot[0] * sv, vy0 = H / 2 + 10 + Crot[1] * sv;
        const PV = q => { const r = R(q); return [vx0 + r[0] * sv, vy0 - r[1] * sv]; };
        const Oc = PV([0, 0]), Cc = PV([0, e]);
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(Oc[0] - 8, Oc[1]); c.lineTo(Oc[0] + 8, Oc[1]); c.moveTo(Oc[0], Oc[1] - 8); c.lineTo(Oc[0], Oc[1] + 8); c.stroke();
        const tips = []; for (let k = 0; k < n; k++) tips.push(vel(2 * Math.PI * k / n, e));
        if (stg >= 3) { c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(Cc[0], Cc[1], sv, 0, 7); c.stroke(); kit.dot(c, Cc[0], Cc[1], 4, C.text); kit.label(c, 'C', Cc[0] + 7, Cc[1] - 8, { size: 12, weight: 700, color: C.text }); }
        tips.forEach((tp, k) => { const q = PV(tp); if (stg <= 4 || n <= 16) kit.arrow(c, Oc[0], Oc[1], q[0], q[1], kit.hue(hueK(k, n), stg >= 5 ? 0.35 : 0.85), 1.4, 6); });
        if (stg === 2) tips.forEach((tp, k) => { const a = PV(tp), b = PV(tips[(k + 1) % n]); kit.arrow(c, a[0], a[1], b[0], b[1], kit.hue(25), 2.4, 7); });
        if (stg >= 3) { c.strokeStyle = kit.hue(25, 0.6); c.lineWidth = 1.2; c.beginPath(); tips.forEach((tp, k) => { const q = PV(tp); k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.stroke(); }
        if (stg >= 4) tips.forEach((tp, k) => { const q = PV(tp); c.strokeStyle = kit.hue(hueK(k, n), 0.8); c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(Cc[0], Cc[1]); c.lineTo(q[0], q[1]); c.stroke(); c.setLineDash([]); });
        let chk = '';
        if (stg >= 5) {
          // Q on CP with QO = QP: CQ = (1 − e²)/(2(1 + e cos θ)) in units of the radius
          const Qof = t => { const s = (1 - e * e) / (2 * (1 + e * Math.cos(t))), d = R([-Math.sin(t), Math.cos(t)]), cc = R([0, e]); return [cc[0] + s * d[0], cc[1] + s * d[1]]; };
          c.strokeStyle = kit.hue(25); c.lineWidth = 2.4; c.beginPath();
          for (let j = 0; j <= 180; j++) { const q = Qof(2 * Math.PI * j / 180), P = [vx0 + q[0] * sv, vy0 - q[1] * sv]; j ? c.lineTo(P[0], P[1]) : c.moveTo(P[0], P[1]); } c.stroke();
          let worst = 0;
          tips.forEach((tp, k) => {
            const t = 2 * Math.PI * k / n, P = R(tp), q = Qof(t), mid = [P[0] / 2, P[1] / 2], nrm = [-P[1], P[0]], L = Math.hypot(nrm[0], nrm[1]) || 1;
            const a = [vx0 + (mid[0] - nrm[0] / L * 0.5) * sv, vy0 - (mid[1] - nrm[1] / L * 0.5) * sv], b = [vx0 + (mid[0] + nrm[0] / L * 0.5) * sv, vy0 - (mid[1] + nrm[1] / L * 0.5) * sv];
            if (n <= 16) { c.strokeStyle = kit.hue(hueK(k, n), 0.7); c.lineWidth = 1; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.setLineDash([]); }
            kit.dot(c, vx0 + q[0] * sv, vy0 - q[1] * sv, 3.5, kit.hue(hueK(k, n)), C.text);
            const cc = R([0, e]), sum = Math.hypot(q[0] - cc[0], q[1] - cc[1]) + Math.hypot(q[0], q[1]);
            worst = Math.max(worst, Math.abs(sum - 1));
          });
          chk = '1.000 × radius for every Q (largest deviation ' + kit.fmt(Math.max(worst, 1e-16), 1) + ')';
          kit.label(c, 'orange: the curve traced by Q — an ellipse with foci C and O', half + 12, H - 10, { size: 10.5, color: kit.hue(25) });
        }
        ro.set('chk', chk || 'see step 5');
        kit.dot(c, Oc[0], Oc[1], 4.5, C.text); kit.label(c, 'O', Oc[0] - 14, Oc[1] + 10, { size: 12, weight: 700, color: C.text });
        // the moving planet's velocity on the diagram
        const vp = PV(vel(th, e)); kit.arrow(c, Oc[0], Oc[1], vp[0], vp[1], kit.hue(205), 2.4); kit.dot(c, vp[0], vp[1], 5, kit.hue(205), C.text);
        if (stg === 4) kit.label(c, 'turning by ' + Math.round(-rot * 180 / Math.PI) + '°', half + 12, H - 10, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ gravity against electricity */
  const KE = 8.9875517923e9, GG = 6.6743e-11, QE = 1.602176634e-19, MP = 1.67262192e-27, MEL = 9.1093837e-31;
  const PAIRS = { pp: ['two protons', MP, MP, 1, '#e0604a', '#e0604a'], ee: ['two electrons', MEL, MEL, 1, '#4a8be0', '#4a8be0'], pe: ['a proton and an electron', MP, MEL, -1, '#e0604a', '#4a8be0'] };
  const MARKS = [['a bacterium\'s weight', 1e-14], ['your weight', 687], ['a car\'s weight', 1.5e4], ['a 10 000-tonne ship', 9.8e7], ['Earth pulling the Moon', 1.98e20], ['the weight of the Earth, M⊕g', 5.86e25]];
  Hyper.sim('mot-grav-elec', {
    title: 'Gravity against electricity',
    blurb: `Both forces fall as the inverse square of the distance, but their strengths are worlds apart. The scale on the right is [[?logarithm|logarithmic]]: each step up is ten times more force. **Particles:** the electric force and the gravitational force between two protons, two electrons, or a proton and an electron. **People:** two 70 kg people with a small excess of electrons, pushed apart electrically and pulled together by gravity.

**Try this**
- Slide the distance between the particles over fifteen powers of ten: both marks move together, and the gap between them never changes — 36 powers of ten for protons, 42 for electrons.
- Press *Magnify gravity ×10* and keep it going: the gravity arrow only becomes as long as the electric one after 36 (or 42) magnifications.
- Switch to the people. With 1 % extra electrons at half a metre, the repulsion reaches the weight of the whole Earth. Turn the excess down: at about one electron in 10¹⁸ the repulsion falls to the tiny pull of their gravity.
- Notice that everyday forces — your weight, a car's — sit in the middle of this enormous range.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Compare', options: [['Two particles', 'particles'], ['Two people', 'people']], value: 'particles' },
        { id: 'pair', type: 'select', label: 'Particles', options: [['Two protons', 'pp'], ['Two electrons', 'ee'], ['A proton and an electron', 'pe']], value: 'pp' },
        { id: 'r', label: 'Distance between the particles', min: 1e-15, max: 1, value: 1e-10, log: true, sig: 2, unit: 'm' },
        { id: 'f', label: 'Extra electrons (fraction of all)', min: 1e-20, max: 1e-2, value: 1e-2, log: true, sig: 2 },
        { id: 'd', label: 'Distance between the people', min: 0.3, max: 10, step: 0.05, value: 0.5, unit: 'm' },
        { type: 'buttons', items: [{ id: 'zoom', label: 'Magnify gravity ×10', primary: true }, { id: 'auto', label: 'Keep magnifying' }, { id: 'unzoom', label: 'Reset' }] }
      ], id => {
        if (id === 'zoom') zoom = Math.min(zoom + 1, 50);
        if (id === 'auto') auto = true;
        if (id === 'unzoom' || id === 'pair' || id === 'mode') { zoom = 0; auto = false; }
        if (id === 'mode') showCtl();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fe', 'Electric force'], ['fg', 'Gravitational force'], ['ratio', 'Electric ÷ gravity'], ['x', '']]);
      let zoom = 0, auto = false, tick = 0;
      function showCtl() { const p = V.mode === 'particles'; ctl.show('pair', p); ctl.show('r', p); ctl.show('zoom', p); ctl.show('auto', p); ctl.show('unzoom', p); ctl.show('f', !p); ctl.show('d', !p); }
      showCtl();
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        let Fe, Fg, lo, hi;
        const ax = W - 150, ay0 = 20, ay1 = H - 20;
        if (V.mode === 'particles') {
          const P = PAIRS[V.pair], r = V.r;
          Fe = KE * QE * QE / (r * r); Fg = GG * P[1] * P[2] / (r * r);
          const lr = Math.log10(Fe / Fg);
          if (auto) { tick += dt; if (tick > 0.12) { tick = 0; zoom++; if (zoom >= Math.ceil(lr)) auto = false; } }
          lo = -75; hi = 10;
          ro.set('fe', kit.fmt(Fe, 3) + ' N (' + (P[3] > 0 ? 'repulsion' : 'attraction') + ')'); ro.set('fg', kit.fmt(Fg, 3) + ' N (attraction)');
          ro.set('ratio', kit.fmt(Fe / Fg, 3) + ' — the same at every distance');
          ro.set('x', 'gravity arrow magnified ×10' + supN(zoom) + (zoom >= lr ? ': now it shows!' : ''));
          // the two particles and their arrows
          const cy = H * 0.45, x1 = (ax - 40) * 0.3, x2 = (ax - 40) * 0.7, rad = 16, L = Math.max(30, Math.min(110, x1 - 10));
          kit.label(c, P[0] + ', ' + kit.fmt(r, 2) + ' m apart (not to scale)', 16, 16, { size: 12, weight: 700, color: C.text });
          kit.dot(c, x1, cy, rad, P[4]); kit.dot(c, x2, cy, rad, P[5]);
          kit.label(c, P[4] === '#e0604a' ? 'p⁺' : 'e⁻', x1, cy, { size: 12, align: 'center', color: '#fff', weight: 700 }); kit.label(c, P[5] === '#e0604a' ? 'p⁺' : 'e⁻', x2, cy, { size: 12, align: 'center', color: '#fff', weight: 700 });
          const s = P[3] > 0 ? -1 : 1;                       // like charges: arrows point outwards; unlike: inwards
          kit.arrow(c, x1, cy - 34, x1 + s * L, cy - 34, kit.hue(285), 3);
          kit.arrow(c, x2, cy - 34, x2 - s * L, cy - 34, kit.hue(285), 3);
          kit.label(c, 'electric', (x1 + x2) / 2, cy - 52, { size: 11.5, align: 'center', color: kit.hue(285) });
          const gl = L * Math.pow(10, clamp(zoom - lr, -30, 1));
          if (gl > 0.6) { kit.arrow(c, x1, cy + 34, x1 + Math.min(gl, 300), cy + 34, kit.hue(140), 3); kit.arrow(c, x2, cy + 34, x2 - Math.min(gl, 300), cy + 34, kit.hue(140), 3); }
          else { kit.dot(c, x1, cy + 34, 1.5, kit.hue(140)); kit.dot(c, x2, cy + 34, 1.5, kit.hue(140)); }
          kit.label(c, 'gravity' + (zoom ? ' (magnified ×10' + supN(zoom) + ')' : '') + (gl <= 0.6 ? ': far too short to see' : ''), (x1 + x2) / 2, cy + 54, { size: 11.5, align: 'center', color: kit.hue(140) });
          // the zoom counter as a row of ticks
          const n = Math.ceil(lr);
          for (let i = 0; i < n; i++) { c.fillStyle = i < zoom ? kit.hue(140, 0.9) : C.faint; c.fillRect(16 + i * ((ax - 60) / n), H - 26, Math.max(2, (ax - 60) / n - 2), 8); }
          kit.label(c, n + ' magnifications of ×10 are needed', 16, H - 36, { size: 10.5, color: C.muted });
        } else {
          const m = 70, Np = 0.55 * m / MP, q = V.f * Np * QE, d = V.d;
          Fe = KE * q * q / (d * d); Fg = GG * m * m / (d * d);
          lo = -10; hi = 30;
          let near = MARKS[0]; for (const mk of MARKS) if (Math.abs(Math.log10(mk[1] / Fe)) < Math.abs(Math.log10(near[1] / Fe))) near = mk;
          ro.set('fe', kit.fmt(Fe, 3) + ' N (charge ' + kit.fmt(q, 2) + ' C each)'); ro.set('fg', kit.fmt(Fg, 3) + ' N');
          ro.set('ratio', kit.fmt(Fe / Fg, 3)); ro.set('x', 'closest landmark: ' + near[0] + ' (' + kit.fmt(near[1], 2) + ' N)');
          // two people, repelled and attracted
          const sc = Math.min((ax - 80) / (d + 1.4), (H - 80) / 2.2), gy = H - 40, cx = (ax - 20) / 2, xa = cx - d / 2 * sc, xb = cx + d / 2 * sc;
          c.fillStyle = C.faint; c.fillRect(10, gy, ax - 30, 2);
          const person = (x, col) => { const h = 1.7 * sc; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(x, gy); c.lineTo(x, gy - h * 0.5); c.moveTo(x - h * 0.12, gy); c.lineTo(x, gy - h * 0.5); c.lineTo(x + h * 0.12, gy); c.moveTo(x, gy - h * 0.5); c.lineTo(x, gy - h * 0.85); c.moveTo(x - h * 0.18, gy - h * 0.7); c.lineTo(x + h * 0.18, gy - h * 0.7); c.stroke(); kit.dot(c, x, gy - h * 0.93, h * 0.07, col); };
          person(xa, kit.hue(205)); person(xb, kit.hue(25));
          const len = F => clamp((Math.log10(F) + 10) * 3.6, 3, 150), ye = gy - 1.7 * sc * 0.6;
          kit.arrow(c, xa, ye, xa - len(Fe), ye, kit.hue(285), 3); kit.arrow(c, xb, ye, xb + len(Fe), ye, kit.hue(285), 3);
          kit.arrow(c, xa, ye + 18, xa + Math.min(len(Fg), (xb - xa) / 2 - 4), ye + 18, kit.hue(140), 3); kit.arrow(c, xb, ye + 18, xb - Math.min(len(Fg), (xb - xa) / 2 - 4), ye + 18, kit.hue(140), 3);
          kit.label(c, 'arrow lengths on a log scale', 16, 16, { size: 11, color: C.muted });
          kit.label(c, 'electric push: ' + kit.fmt(Fe, 2) + ' N', 16, 34, { size: 12, color: kit.hue(285), weight: 600 });
          kit.label(c, 'gravity: ' + kit.fmt(Fg, 2) + ' N', 16, 52, { size: 12, color: kit.hue(140), weight: 600 });
          kit.label(c, d.toFixed(2) + ' m', cx, gy + 14, { size: 11, align: 'center', color: C.muted });
        }
        // the logarithmic force scale
        const Y = L => ay1 - (L - lo) / (hi - lo) * (ay1 - ay0);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(ax, ay0); c.lineTo(ax, ay1); c.stroke();
        const stepD = V.mode === 'particles' ? 10 : 5;
        for (let L = lo; L <= hi; L += stepD) { const y = Y(L); c.beginPath(); c.moveTo(ax - 4, y); c.lineTo(ax + 4, y); c.stroke(); kit.label(c, '10' + supN(L) + ' N', ax - 8, y, { size: 10, align: 'right', color: C.muted }); }
        if (V.mode === 'people') for (const mk of MARKS) { const L = Math.log10(mk[1]); if (L < lo || L > hi) continue; const y = Y(L); kit.dot(c, ax, y, 3, C.muted); kit.label(c, mk[0], ax + 8, y, { size: 9.5, color: C.muted }); }
        const le = clamp(Math.log10(Fe), lo, hi), lg = clamp(Math.log10(Fg), lo, hi), ye2 = Y(le), yg = Y(lg);
        c.fillStyle = kit.hue(285, 0.25); c.fillRect(ax - 6, ye2, 12, yg - ye2);
        kit.dot(c, ax, ye2, 6, kit.hue(285), C.text); kit.dot(c, ax, yg, 6, kit.hue(140), C.text);
        kit.label(c, 'electric', ax + 10, ye2 - (V.mode === 'people' ? 10 : 0), { size: 11, color: kit.hue(285), weight: 700, bg: C.bg2 });
        kit.label(c, 'gravity', ax + 10, yg + (V.mode === 'people' ? 10 : 0), { size: 11, color: kit.hue(140), weight: 700, bg: C.bg2 });
        kit.label(c, Math.round(Math.log10(Fe / Fg)) + ' powers of ten', ax - 10, (ye2 + yg) / 2, { size: 11, align: 'right', color: C.text, bg: C.bg2 });
      }, box.stage);
      loop.start();
    }
  });

  const SUPD = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function supN(n) { return String(n).split('').map(ch => SUPD[ch] || ch).join(''); }

})();
