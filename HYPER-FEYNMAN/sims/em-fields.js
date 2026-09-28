/* HYPER-FEYNMAN · sims/em-fields.js — simulations for Electromagnetism: fields (content/em-fields.js).
 *   emf-charges     place charges: field arrows, field lines and equipotentials, with a probe
 *   emf-vector-lab  divergence and curl: a tiny box's net outflow and a tiny paddle wheel moved round fields you choose
 *   emf-gauss       Gauss's law: a closed surface you stretch round line charges; the flux changes only when a charge crosses it
 *   emf-capacitor   the energy stored in the field of a capacitor, pulled apart at fixed charge or fixed voltage
 *   emf-atmosphere  the global circuit: the fair-weather field, leakage through the air, and thunderstorms recharging the Earth
 *   emf-dielectric  a dielectric slab whose molecules polarize and weaken the field in a capacitor
 *   emf-analogs     one equation, four stories: electrostatics, heat flow, a stretched membrane and diffusion on the same grid
 *   emf-wires       magnetic fields of wires, a solenoid and a coaxial cable, with an Ampère loop
 *   emf-vecpot      the vector potential round a long solenoid, and the Aharonov–Bohm shift of electron fringes where B = 0
 *   emf-flux-rule   a loop moving through a field, a changing field, and the Faraday disc — an exception to the flux rule
 */
(function () {
  'use strict';

  const KE = 8.9875517923e9, EPS0 = 8.8541878128e-12, MU0 = 1.25663706212e-6, TAU = 2 * Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fontOf = () => { try { return getComputedStyle(document.body).fontFamily || 'sans-serif'; } catch (e) { return 'sans-serif'; } };
  // a design drawing W0 × H0 fitted into the stage, centred; to(p) turns a pointer position into design units
  function fit(st, W0, H0) {
    const s = Math.max(1e-6, Math.min(st.W / W0, st.H / H0)), ox = (st.W - W0 * s) / 2, oy = (st.H - H0 * s) / 2;
    return { s, ox, oy, to: p => ({ x: (p.x - ox) / s, y: (p.y - oy) / s }) };
  }
  // engineering notation: 0.000123 V -> '123 µV'
  function eng(v, unit, sig) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0 ' + unit;
    const P = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p'], [1e-15, 'f']];
    const a = Math.abs(v);
    for (const [f, p] of P) if (a >= f * 0.9995 || f === 1e-15) return String(Number((v / f).toPrecision(sig || 3))) + ' ' + p + unit;
    return v.toExponential(2) + ' ' + unit;
  }
  const num = (v, sig) => Number.isFinite(v) ? String(Number(v.toPrecision(sig || 3))) : '—';
  // contour segments of a grid of values (marching squares); vals[j*nx+i] at (x0 + i*cell, y0 + j*cell)
  function contour(vals, nx, ny, cell, L, out, x0, y0) {
    x0 = x0 || 0; y0 = y0 || 0;
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = vals[j * nx + i], b = vals[j * nx + i + 1], c = vals[(j + 1) * nx + i + 1], d = vals[(j + 1) * nx + i];
      const A = a > L, B = b > L, Cc = c > L, D = d > L;
      if (A === B && B === Cc && Cc === D) continue;
      const X = x0 + i * cell, Y = y0 + j * cell, p = [];
      if (A !== B) p.push([X + cell * (L - a) / (b - a), Y]);
      if (B !== Cc) p.push([X + cell, Y + cell * (L - b) / (c - b)]);
      if (Cc !== D) p.push([X + cell * (L - d) / (c - d), Y + cell]);
      if (D !== A) p.push([X, Y + cell * (L - a) / (d - a)]);
      if (p.length === 2) out.push(p[0], p[1]);
      else if (p.length === 4) {
        if (((a + b + c + d) / 4 > L) === A) out.push(p[0], p[1], p[2], p[3]); else out.push(p[0], p[3], p[1], p[2]);
      }
    }
  }
  function strokeSegs(c, segs) { c.beginPath(); for (let i = 0; i + 1 < segs.length; i += 2) { c.moveTo(segs[i][0], segs[i][1]); c.lineTo(segs[i + 1][0], segs[i + 1][1]); } c.stroke(); }
  function polyline(c, pts) { if (pts.length < 2) return; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); }
  // a small arrowhead on a polyline, at the fraction f of its points, pointing along it (or back along it)
  function headOn(c, pts, f, back, size, col) {
    if (pts.length < 4) return;
    const i = clamp(Math.floor(pts.length * f), 1, pts.length - 2), p = pts[i], q = pts[i + 1];
    let a = Math.atan2(q[1] - p[1], q[0] - p[0]); if (back) a += Math.PI;
    const s = size || 6;
    c.fillStyle = col; c.beginPath(); c.moveTo(p[0] + s * Math.cos(a), p[1] + s * Math.sin(a));
    c.lineTo(p[0] + s * Math.cos(a + 2.5), p[1] + s * Math.sin(a + 2.5)); c.lineTo(p[0] + s * Math.cos(a - 2.5), p[1] + s * Math.sin(a - 2.5)); c.closePath(); c.fill();
  }
  function chargeDot(c, x, y, q, C, r) {
    const pos = q >= 0, col = pos ? C.hue(2) : C.hue(215);
    c.beginPath(); c.arc(x, y, Math.max(1, r), 0, TAU); c.fillStyle = col; c.fill();
    c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
    c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); const h = Math.max(2, r * 0.5);
    c.moveTo(x - h, y); c.lineTo(x + h, y); if (pos) { c.moveTo(x, y - h); c.lineTo(x, y + h); } c.stroke();
  }

  /* ================================================================ emf-charges */
  Hyper.sim('emf-charges', {
    title: 'Charges, field lines and equipotentials',
    blurb: `Each charge makes a field that falls off as $1/r^2$, and the fields of all the charges add as arrows. Three pictures of one field are drawn: **arrows** on a grid (their length on a logarithmic scale), **field lines** that leave positive charges and end on negative ones, and dashed **equipotentials** — the contours of the potential, red above zero and blue below. The drawing is 64 cm wide; charges are in nanocoulombs.

**Try this**
- Drag the charges and the probe P. The readout gives the field and the potential at P and the force on a small +1 nC test charge placed there.
- Two equal charges: between them there is a point where the field vanishes. Find it with the probe.
- Check that field lines cross the equipotentials at right angles everywhere: $\\vec E$ is minus the [[?gradient]] of the potential.
- Choose +6 nC and −2 nC: only a third of the lines from the big charge end on the small one; the rest go off to infinity, and far away the pair looks like a single +4 nC charge.
- Click an empty spot to add a charge of the size set by the slider. *Flip all signs* reverses every arrow but leaves the pattern unchanged.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 400, CELL = 8, NX = W0 / CELL + 1, NY = H0 / CELL + 1;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const presets = {
        dipole: [[240, 200, 4], [400, 200, -4]], pair: [[240, 200, 4], [400, 200, 4]], one: [[320, 200, 5]],
        unequal: [[260, 200, 6], [400, 200, -2]], quad: [[250, 130, 4], [390, 130, -4], [390, 270, 4], [250, 270, -4]], empty: []
      };
      let charges = [], probe = { x: 330, y: 110 }, dirty = true, lines = [], isoP = [], isoN = [], shade = [];
      const load = name => { charges = (presets[name] || []).map(([x, y, q]) => ({ x, y, q })); dirty = true; };
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Arrangement', options: [['Two opposite charges (dipole)', 'dipole'], ['Two equal charges', 'pair'], ['One charge', 'one'], ['+6 nC and −2 nC', 'unequal'], ['Four charges (quadrupole)', 'quad'], ['Empty: click to add', 'empty']], value: 'dipole' },
        { id: 'q', label: 'Charge added by a click', min: -10, max: 10, step: 1, value: 4, unit: 'nC' },
        { id: 'arrows', type: 'check', label: 'Field arrows', value: true },
        { id: 'lines', type: 'check', label: 'Field lines', value: true },
        { id: 'equi', type: 'check', label: 'Equipotentials', value: true },
        { id: 'shade', type: 'check', label: 'Shade the potential', value: false },
        { type: 'buttons', items: [{ id: 'flip', label: 'Flip all signs' }, { id: 'clear', label: 'Remove all' }] }
      ], (id, v) => {
        if (id === 'preset') load(v);
        else if (id === 'clear') { charges = []; dirty = true; }
        else if (id === 'flip') { charges.forEach(c => { c.q = -c.q; }); dirty = true; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Field at P'], ['dir', 'Direction at P'], ['phi', 'Potential at P'], ['F', 'Force on +1 nC at P'], ['tot', 'Total charge']]);
      load('dipole');
      const qs = () => charges.map(c => ({ x: c.x, y: c.y, q: c.q }));
      // real units: 1 design px = 1 mm, charges in nC
      const Ereal = (x, y) => { const e = Q.efield(qs(), x, y); return { x: e.x * KE * 1e-3, y: e.y * KE * 1e-3 }; };
      const phiReal = (x, y) => { let v = 0; for (const c of charges) v += c.q / Math.max(2, Math.hypot(x - c.x, y - c.y)); return v * KE * 1e-6; };
      function recompute() {
        dirty = false;
        const list = qs(), f = (x, y) => Q.efield(list, x, y);
        const out = (x, y) => x < -30 || x > W0 + 30 || y < -30 || y > H0 + 30;
        const near = (x, y, s) => charges.some(c => Math.sign(c.q) === s && Math.hypot(x - c.x, y - c.y) < 7);
        lines = [];
        const totalLines = charges.reduce((s, c) => s + Math.abs(c.q), 0), per = totalLines > 40 ? 120 / totalLines : 3;
        for (const c of charges) {
          if (c.q === 0) continue;
          const fwd = c.q > 0, n = Math.max(4, Math.round(Math.abs(c.q) * per));
          for (let k = 0; k < n; k++) {
            const a = TAU * (k + 0.5) / n;
            const pts = Q.traceField(f, c.x + 9 * Math.cos(a), c.y + 9 * Math.sin(a), { step: 4, max: 650, backward: !fwd, stop: (x, y) => out(x, y) || near(x, y, fwd ? -1 : 1) });
            if (!fwd) { const e = pts[pts.length - 1]; if (near(e[0], e[1], 1)) continue; }
            pts.unshift([c.x, c.y]);
            lines.push({ pts, fwd });
          }
        }
        // the potential on a grid, its contours and its shading
        const vals = new Float64Array(NX * NY);
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) vals[j * NX + i] = clamp(phiReal(i * CELL, j * CELL), -1e5, 1e5);
        isoP = []; isoN = [];
        for (const L of [10, 20, 50, 100, 200, 500, 1000, 2000, 5000]) { contour(vals, NX, NY, CELL, L, isoP); contour(vals, NX, NY, CELL, -L, isoN); }
        shade = [];
        const C = kit.colors();
        for (let j = 0; j < NY - 1; j++) for (let i = 0; i < NX - 1; i++) {
          const v = (vals[j * NX + i] + vals[j * NX + i + 1] + vals[(j + 1) * NX + i] + vals[(j + 1) * NX + i + 1]) / 4, m = Math.abs(v);
          if (m < 5) continue;
          const a = clamp(Math.log10(m / 5) / 3.2, 0, 1) * 0.55;
          shade.push([i * CELL, j * CELL, v > 0 ? C.hue(2, a.toFixed(3)) : C.hue(215, a.toFixed(3))]);
        }
      }
      const hitCharge = p => { let best = null, bd = 16; for (const c of charges) { const d = Math.hypot(p.x - c.x, p.y - c.y); if (d < bd) { bd = d; best = c; } } return best; };
      kit.drag(st, {
        hit: p => { const d = fit(st, W0, H0).to(p); if (Math.hypot(d.x - probe.x, d.y - probe.y) < 14) return probe; return hitCharge(d); },
        move: (o, p) => { const d = fit(st, W0, H0).to(p); o.x = clamp(d.x, 6, W0 - 6); o.y = clamp(d.y, 6, H0 - 6); if (o !== probe) dirty = true; },
        hover: true
      });
      kit.click(st, p => {
        const d = fit(st, W0, H0).to(p);
        if (d.x < 0 || d.x > W0 || d.y < 0 || d.y > H0 || V.q === 0 || charges.length >= 8) return;
        if (hitCharge(d) || Math.hypot(d.x - probe.x, d.y - probe.y) < 16) return;
        charges.push({ x: d.x, y: d.y, q: V.q }); dirty = true;
      });
      const loop = kit.loop(() => {
        if (dirty) recompute();
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.font = '12px ' + fontOf();
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(0, 0, W0, H0);
        if (V.shade) for (const s of shade) { c.fillStyle = s[2]; c.fillRect(s[0], s[1], CELL + 0.5, CELL + 0.5); }
        if (V.equi) {
          c.lineWidth = 1.1; c.setLineDash([4, 3]);
          c.strokeStyle = C.hue(2, 0.75); strokeSegs(c, isoP);
          c.strokeStyle = C.hue(215, 0.75); strokeSegs(c, isoN);
          c.setLineDash([]);
        }
        if (V.lines) {
          c.lineWidth = 1.3; c.strokeStyle = C.text;
          for (const L of lines) { c.globalAlpha = 0.75; polyline(c, L.pts); c.globalAlpha = 1; headOn(c, L.pts, 0.35, !L.fwd, 5, C.text); }
        }
        if (V.arrows) {
          for (let y = 20; y < H0; y += 40) for (let x = 20; x < W0; x += 40) {
            const e = Ereal(x, y), m = Math.hypot(e.x, e.y);
            if (!(m > 0) || charges.some(q => Math.hypot(q.x - x, q.y - y) < 14)) continue;
            const len = 6 + 12 * clamp(Math.log10(m / 30) / 3, 0, 1);
            kit.arrow(c, x - e.x / m * len / 2, y - e.y / m * len / 2, x + e.x / m * len / 2, y + e.y / m * len / 2, C.accent, 1.6, 5);
          }
        }
        for (const q of charges) chargeDot(c, q.x, q.y, q.q, C, 8 + Math.min(6, Math.abs(q.q) * 0.5));
        // the probe and its field arrow
        const e = Ereal(probe.x, probe.y), m = Math.hypot(e.x, e.y);
        if (m > 0) { const len = 14 + 40 * clamp(Math.log10(m / 30) / 3, 0, 1); kit.arrow(c, probe.x, probe.y, probe.x + e.x / m * len, probe.y + e.y / m * len, C.warn, 2.6); }
        c.beginPath(); c.arc(probe.x, probe.y, 7, 0, TAU); c.fillStyle = C.surface || '#fff'; c.fill(); c.strokeStyle = C.warn; c.lineWidth = 2; c.stroke();
        kit.label(c, 'P', probe.x - 12, probe.y - 12, { color: C.warn, weight: 700, align: 'center' });
        // scale bar
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(20, H0 - 16); c.lineTo(120, H0 - 16); c.stroke();
        kit.label(c, '10 cm', 70, H0 - 28, { color: C.muted, align: 'center', size: 11 });
        c.restore();
        const phi = phiReal(probe.x, probe.y);
        ro.set('E', eng(m, 'V/m'));
        ro.set('dir', m > 0 ? num((Math.atan2(-e.y, e.x) * 180 / Math.PI + 360) % 360, 3) + '° from the +x axis' : '—');
        ro.set('phi', eng(phi, 'V'));
        ro.set('F', eng(m * 1e-9, 'N'));
        ro.set('tot', num(charges.reduce((s, q) => s + q.q, 0), 3) + ' nC in ' + charges.length + ' charge' + (charges.length === 1 ? '' : 's'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-vector-lab */
  // fields in dimensionless units on x ∈ [−1, 1], y ∈ [−0.625, 0.625] (y up)
  const hillT = (x, y) => Math.exp(-((x - 0.15) * (x - 0.15) + (y + 0.05) * (y + 0.05)) / 0.18);
  const VFIELDS = {
    source: { label: 'Source: v = (x, y)', f: (x, y) => [x, y] },
    sink: { label: 'Sink: v = (−x, −y)', f: (x, y) => [-x, -y] },
    rotation: { label: 'Rigid rotation: v = (−y, x)', f: (x, y) => [-y, x] },
    vortex: { label: 'Whirlpool: v = (−y, x)/r²', f: (x, y) => { const r2 = x * x + y * y + 0.0025; return [-0.12 * y / r2, 0.12 * x / r2]; } },
    shear: { label: 'Shear: v = (y, 0)', f: (x, y) => [y, 0] },
    saddle: { label: 'Saddle: v = (x, −y)', f: (x, y) => [x, -y] },
    line: { label: 'Line charge (2-D): v = (x, y)/r²', f: (x, y) => { const r2 = x * x + y * y + 0.0025; return [0.12 * x / r2, 0.12 * y / r2]; } },
    hill: { label: 'Heat flow from a hot spot: v = −∇T', f: (x, y) => { const T = hillT(x, y); return [T * 2 * (x - 0.15) / 0.18, T * 2 * (y + 0.05) / 0.18]; } },
    mixed: { label: 'Spiral: v = (x − y, x + y)', f: (x, y) => [x - y, x + y] }
  };

  Hyper.sim('emf-vector-lab', {
    title: 'Divergence and curl: a tiny box and a paddle wheel',
    blurb: `A vector field drawn as arrows, with tracer particles carried along as if it were the velocity of a liquid. The square is a tiny box you can drag anywhere. Arrows on its sides show the flow across each side — green out, red in — and the readout adds them up: the net outflow divided by the area is the [[?divergence]]. The paddle wheel in the box turns at half the [[?curl]], which is the circulation round the box divided by its area.

**Try this**
- *Source*: every box has the same net outflow (divergence 2), wherever you put it — not only at the centre. The wheel never turns.
- *Rigid rotation*: no outflow anywhere, and the wheel turns at the same rate everywhere, even far from the centre.
- *Whirlpool*: the lines circle, yet away from the centre the wheel stays still — the faster inner side and the longer outer side of the box balance. Put the box over the centre and it turns.
- *Shear*: straight lines, yet the wheel turns.
- *Line charge*: zero outflow from every box that does not contain the charge — [[?gauss-theorem|Gauss's theorem]] in miniature. *Heat flow from a hot spot* has no curl anywhere, because it is a [[?gradient]].
- Shrink the box: the outflow and the circulation per unit area settle on the divergence and curl computed from the derivatives.`,
    mount(box, kit) {
      const W0 = 640, H0 = 400, S = 320, CX = 320, CY = 200;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'field', type: 'select', label: 'Field', options: Object.keys(VFIELDS).map(k => [VFIELDS[k].label, k]), value: 'source' },
        { id: 'b', label: 'Half-width of the box', min: 0.02, max: 0.3, step: 0.01, value: 0.12 },
        { id: 'arrows', type: 'check', label: 'Field arrows', value: true },
        { id: 'tracers', type: 'check', label: 'Tracer particles', value: true },
        { type: 'buttons', items: [{ id: 'centre', label: 'Box to the centre' }, { id: 'off', label: 'Box off-centre' }] }
      ], id => {
        if (id === 'centre') { probe.x = 0; probe.y = 0; }
        if (id === 'off') { probe.x = -0.55; probe.y = 0.3; }
        if (id === 'field') seed();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['div', 'Divergence ∂vₓ/∂x + ∂v_y/∂y'], ['flux', 'Net outflow ÷ box area'], ['curl', 'Curl ∂v_y/∂x − ∂vₓ/∂y'], ['circ', 'Circulation ÷ box area'], ['wheel', 'Paddle wheel']]);
      const probe = { x: -0.55, y: 0.3 };
      let wheel = 0, parts = [];
      const R = kit.qm.rng(7);
      const F = () => VFIELDS[V.field].f;
      const toS = (x, y) => [CX + S * x, CY - S * y];
      function seed() { parts = []; for (let i = 0; i < 260; i++) parts.push({ x: -1 + 2 * R(), y: -0.625 + 1.25 * R(), life: 1 + 4 * R() }); }
      seed();
      function derivs(x, y) {
        const f = F(), h = 1e-4, a = f(x + h, y), b = f(x - h, y), c = f(x, y + h), d = f(x, y - h);
        return { div: (a[0] - b[0]) / (2 * h) + (c[1] - d[1]) / (2 * h), curl: (a[1] - b[1]) / (2 * h) - (c[0] - d[0]) / (2 * h) };
      }
      function boxIntegrals(x, y, b) {
        const f = F(), n = 40, ds = 2 * b / n;
        let flux = 0, circ = 0;
        for (let k = 0; k < n; k++) {
          const t = -b + (k + 0.5) * ds;
          const r = f(x + b, y + t), l = f(x - b, y + t), tp = f(x + t, y + b), bt = f(x + t, y - b);
          flux += (r[0] - l[0] + tp[1] - bt[1]) * ds;
          circ += (bt[0] + r[1] - tp[0] - l[1]) * ds;
        }
        const A = 4 * b * b;
        return { flux: flux / A, circ: circ / A };
      }
      kit.drag(st, {
        hit: p => { const d = fit(st, W0, H0).to(p), s = toS(probe.x, probe.y), half = Math.max(14, S * V.b); return Math.abs(d.x - s[0]) < half && Math.abs(d.y - s[1]) < half ? probe : null; },
        move: (o, p) => { const d = fit(st, W0, H0).to(p); o.x = clamp((d.x - CX) / S, -0.95, 0.95); o.y = clamp((CY - d.y) / S, -0.6, 0.6); },
        hover: true
      });
      const loop = kit.loop(dt => {
        const f = F(), C = kit.colors();
        // tracers: carried by the field, speed capped, reborn when they leave or grow old
        if (V.tracers) for (const p of parts) {
          for (let k = 0; k < 2; k++) {
            const v = f(p.x, p.y), sp = Math.hypot(v[0], v[1]), cap = sp > 1.2 ? 1.2 / sp : 1;
            p.x += 0.35 * v[0] * cap * dt / 2; p.y += 0.35 * v[1] * cap * dt / 2;
          }
          p.life -= dt;
          if (p.life < 0 || Math.abs(p.x) > 1.02 || Math.abs(p.y) > 0.65 || (V.field === 'sink' && Math.hypot(p.x, p.y) < 0.02)) { p.x = -1 + 2 * R(); p.y = -0.625 + 1.25 * R(); p.life = 1 + 4 * R(); }
        }
        const D = derivs(probe.x, probe.y), B = boxIntegrals(probe.x, probe.y, V.b);
        wheel += 0.5 * B.circ * 0.35 * dt;
        const c = st.begin(), Fi = fit(st, W0, H0);
        c.save(); c.translate(Fi.ox, Fi.oy); c.scale(Fi.s, Fi.s);
        c.font = '12px ' + fontOf();
        if (V.field === 'hill') for (let y = 0; y < H0; y += 10) for (let x = 0; x < W0; x += 10) {
          const T = hillT((x + 5 - CX) / S, (CY - y - 5) / S); c.fillStyle = C.hue(18, (0.5 * T).toFixed(3)); c.fillRect(x, y, 10.5, 10.5);
        }
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(0, CY); c.lineTo(W0, CY); c.moveTo(CX, 0); c.lineTo(CX, H0); c.stroke();
        if (V.arrows) {
          let top = 1e-9; const pts = [];
          for (let y = 20; y < H0; y += 32) for (let x = 20; x < W0; x += 32) { const v = f((x - CX) / S, (CY - y) / S), m = Math.hypot(v[0], v[1]); pts.push([x, y, v, m]); top = Math.max(top, Math.min(m, 3)); }
          for (const [x, y, v, m] of pts) {
            if (!(m > 1e-9)) continue;
            const len = 24 * Math.min(1, Math.sqrt(Math.min(m, 3) / top)), ux = v[0] / m, uy = -v[1] / m;
            kit.arrow(c, x - ux * len / 2, y - uy * len / 2, x + ux * len / 2, y + uy * len / 2, C.accent, 1.4, 5);
          }
        }
        if (V.tracers) { c.fillStyle = C.text; c.globalAlpha = 0.7; for (const p of parts) { const s = toS(p.x, p.y); c.fillRect(s[0] - 1.2, s[1] - 1.2, 2.4, 2.4); } c.globalAlpha = 1; }
        if (V.field === 'line' || V.field === 'vortex') { const s = toS(0, 0); c.beginPath(); c.arc(s[0], s[1], 5, 0, TAU); c.fillStyle = V.field === 'line' ? C.hue(2) : C.warn; c.fill(); }
        // the box with the flow across each side
        const s = toS(probe.x, probe.y), h = S * V.b;
        c.fillStyle = C.surface || '#fff'; c.globalAlpha = 0.55; c.fillRect(s[0] - h, s[1] - h, 2 * h, 2 * h); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(s[0] - h, s[1] - h, 2 * h, 2 * h);
        let vmax = 1e-9; const sides = [];
        for (let k = 0; k < 3; k++) {
          const t = -V.b + V.b * (k + 0.5) * 2 / 3;
          sides.push([probe.x + V.b, probe.y + t, 1, 0], [probe.x - V.b, probe.y + t, -1, 0], [probe.x + t, probe.y + V.b, 0, 1], [probe.x + t, probe.y - V.b, 0, -1]);
        }
        const vals = sides.map(([x, y, nx, ny]) => { const v = f(x, y), vn = v[0] * nx + v[1] * ny; vmax = Math.max(vmax, Math.abs(vn)); return vn; });
        sides.forEach(([x, y, nx, ny], i) => {
          const vn = vals[i], p = toS(x, y), L = 22 * Math.abs(vn) / vmax;
          if (L < 1) return;
          const col = vn > 0 ? C.ok : C.bad, dx = nx * L * Math.sign(vn), dy = -ny * L * Math.sign(vn);
          const x0 = vn > 0 ? p[0] : p[0] - dx, y0 = vn > 0 ? p[1] : p[1] - dy;
          kit.arrow(c, x0, y0, x0 + dx, y0 + dy, col, 2, 6);
        });
        // the paddle wheel
        const rw = Math.max(6, h * 0.7);
        c.strokeStyle = C.warn; c.lineWidth = 2.2;
        for (let k = 0; k < 4; k++) { const a = wheel + k * Math.PI / 2; c.beginPath(); c.moveTo(s[0], s[1]); c.lineTo(s[0] + rw * Math.cos(a), s[1] - rw * Math.sin(a)); c.stroke(); c.beginPath(); c.arc(s[0] + rw * Math.cos(a), s[1] - rw * Math.sin(a), 2.5, 0, TAU); c.fillStyle = C.warn; c.fill(); }
        c.beginPath(); c.arc(s[0], s[1], 3, 0, TAU); c.fillStyle = C.text; c.fill();
        kit.label(c, VFIELDS[V.field].label, 12, 16, { color: C.muted, size: 12 });
        c.restore();
        ro.set('div', num(D.div, 3));
        ro.set('flux', num(B.flux, 3));
        ro.set('curl', num(D.curl, 3));
        ro.set('circ', num(B.circ, 3));
        const w = 0.5 * B.circ;
        ro.set('wheel', Math.abs(w) < 0.005 ? 'still' : (w > 0 ? 'anticlockwise' : 'clockwise') + ', ω = ½ curl = ' + num(Math.abs(w), 2));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-gauss */
  // a closed curve through movable handles (Catmull–Rom), sampled as a polygon
  function closedSpline(hs, per) {
    const n = hs.length, pts = [];
    for (let i = 0; i < n; i++) {
      const p0 = hs[(i - 1 + n) % n], p1 = hs[i], p2 = hs[(i + 1) % n], p3 = hs[(i + 2) % n];
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        const b0 = -0.5 * t3 + t2 - 0.5 * t, b1 = 1.5 * t3 - 2.5 * t2 + 1, b2 = -1.5 * t3 + 2 * t2 + 0.5 * t, b3 = 0.5 * t3 - 0.5 * t2;
        pts.push([b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x, b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y]);
      }
    }
    return pts;
  }
  const signedArea = pts => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
  // the angle a closed polygon sweeps round the point (x, y), in turns
  function turns(pts, x, y) {
    let s = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      let d = Math.atan2(q[1] - y, q[0] - x) - Math.atan2(p[1] - y, p[0] - x);
      if (d > Math.PI) d -= TAU; else if (d < -Math.PI) d += TAU;
      s += d;
    }
    return s / TAU;
  }

  Hyper.sim('emf-gauss', {
    title: 'Gauss\'s law: stretch a closed surface',
    blurb: `The dots are long charged rods seen end-on (charge per metre λ, in nC/m), so the picture is exactly two-dimensional: each rod's field falls as $1/r$, and the closed curve is a cylinder-like surface seen end-on. The readout adds up $\\vec E\\cdot\\hat n$ all along the curve — the [[?flux]] out of the surface, per metre of rod — and compares it with the charge inside divided by $\\varepsilon_0$. The small arrows on the curve show the flux through each piece: green outward, red inward.

**Try this**
- Drag the handles to stretch and dent the surface, as wildly as you like. As long as no rod crosses it, the flux does not change.
- Drag the surface's edge across a rod: the flux jumps by λ/ε₀ (10 nC/m gives 1129 V·m per metre).
- Put a rod just outside: the arrows near it are strong, but the red ones exactly cancel the green ones.
- *Rods +10 and −10*: enclose both — zero flux, although the field on the surface is far from zero.
- Push a handle through the curve so it crosses itself: rods inside the twisted loop count twice, or with the opposite sign.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 400;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const presets = { one: [[300, 200, 10]], pair: [[250, 200, 10], [430, 200, -10]], three: [[260, 170, 10], [340, 250, 5], [480, 140, -10]] };
      let rods = [], hs = [], curve = [], lines = [], dirty = true;
      const circle = () => { hs = []; for (let i = 0; i < 10; i++) { const a = TAU * i / 10; hs.push({ x: 300 + 120 * Math.cos(a), y: 200 + 110 * Math.sin(a) }); } dirty = true; };
      const bean = () => { hs = []; for (let i = 0; i < 10; i++) { const a = TAU * i / 10, r = 1 + 0.35 * Math.cos(2 * a) - 0.25 * Math.sin(3 * a); hs.push({ x: 320 + 170 * r * Math.cos(a), y: 200 + 95 * r * Math.sin(a) }); } dirty = true; };
      const load = k => { rods = (presets[k] || presets.one).map(([x, y, lam]) => ({ x, y, lam })); dirty = true; };
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Charged rods', options: [['One rod, +10 nC/m', 'one'], ['Rods +10 and −10 nC/m', 'pair'], ['Three rods: +10, +5, −10 nC/m', 'three']], value: 'one' },
        { id: 'lines', type: 'check', label: 'Field lines', value: true },
        { id: 'arrows', type: 'check', label: 'Flux arrows on the surface', value: true },
        { type: 'buttons', items: [{ id: 'circle', label: 'Round surface', primary: true }, { id: 'bean', label: 'Bent surface' }] }
      ], (id, v) => { if (id === 'preset') load(v); if (id === 'circle') circle(); if (id === 'bean') bean(); dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['flux', 'Flux out (adding E·n along the curve)'], ['gauss', 'Charge inside ÷ ε₀'], ['inside', 'Charge inside'], ['rods', 'Rods inside']]);
      load('one'); circle();
      // field of the rods in real units (1 px = 1 mm): E = λ/(2πε₀r), λ in nC/m
      const E2 = (x, y) => { let ex = 0, ey = 0; for (const r of rods) { const dx = x - r.x, dy = y - r.y, d2 = dx * dx + dy * dy; if (d2 < 1e-6) continue; const k = r.lam * 1e-9 / (TAU * EPS0) / (d2 * 1e-3); ex += k * dx; ey += k * dy; } return { x: ex, y: ey }; };
      let res = { flux: 0, qin: 0, inside: [], sgn: 1, marks: [] };
      function recompute() {
        dirty = false;
        curve = closedSpline(hs, 24);
        const sgn = signedArea(curve) >= 0 ? 1 : -1;
        let flux = 0; const marks = [];
        for (let i = 0; i < curve.length; i++) {
          const p = curve[i], q = curve[(i + 1) % curve.length], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
          if (L < 1e-9) continue;
          const nx = sgn * dy / L, ny = -sgn * dx / L, e = E2(mx, my), en = e.x * nx + e.y * ny;
          flux += en * L * 1e-3;
          if (i % 8 === 0) marks.push([mx, my, nx, ny, en]);
        }
        let qin = 0; const inside = [];
        for (const r of rods) { const w = sgn * turns(curve, r.x, r.y); inside.push(w); qin += r.lam * w; }
        res = { flux, qin, inside, marks };
        // field lines: from each positive rod forwards, from negative rods backwards (unless they end on a positive rod)
        lines = [];
        const list = rods.map(r => ({ x: r.x, y: r.y, q: r.lam }));
        const f = (x, y) => { let ex = 0, ey = 0; for (const r of list) { const dx = x - r.x, dy = y - r.y, d2 = dx * dx + dy * dy; if (d2 < 1e-9) continue; ex += r.q * dx / d2; ey += r.q * dy / d2; } return { x: ex, y: ey }; };
        const near = (x, y, s) => rods.some(r => Math.sign(r.lam) === s && Math.hypot(x - r.x, y - r.y) < 7);
        const out = (x, y) => x < -20 || x > W0 + 20 || y < -20 || y > H0 + 20;
        for (const r of rods) {
          const fwd = r.lam > 0, n = Math.max(4, Math.round(Math.abs(r.lam) * 1.2));
          for (let k = 0; k < n; k++) {
            const a = TAU * (k + 0.5) / n;
            const pts = Q.traceField(f, r.x + 8 * Math.cos(a), r.y + 8 * Math.sin(a), { step: 4, max: 500, backward: !fwd, stop: (x, y) => out(x, y) || near(x, y, fwd ? -1 : 1) });
            if (!fwd) { const e = pts[pts.length - 1]; if (near(e[0], e[1], 1)) continue; }
            pts.unshift([r.x, r.y]);
            lines.push({ pts, fwd });
          }
        }
      }
      kit.drag(st, {
        hit: p => {
          const d = fit(st, W0, H0).to(p);
          for (const h of hs) if (Math.hypot(d.x - h.x, d.y - h.y) < 11) return h;
          for (const r of rods) if (Math.hypot(d.x - r.x, d.y - r.y) < 13) return r;
          return null;
        },
        move: (o, p) => { const d = fit(st, W0, H0).to(p); o.x = clamp(d.x, 8, W0 - 8); o.y = clamp(d.y, 8, H0 - 8); dirty = true; },
        hover: true
      });
      const loop = kit.loop(() => {
        if (dirty) recompute();
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.font = '12px ' + fontOf();
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(0, 0, W0, H0);
        if (V.lines) { c.strokeStyle = C.muted; c.lineWidth = 1.1; for (const L of lines) { polyline(c, L.pts); headOn(c, L.pts, 0.3, !L.fwd, 4.5, C.muted); } }
        // the surface
        c.fillStyle = C.accent; c.globalAlpha = 0.08; c.beginPath(); curve.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.globalAlpha = 1;
        c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); curve.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke();
        if (V.arrows) for (const [x, y, nx, ny, en] of res.marks) {
          const m = Math.abs(en); if (!(m > 1)) continue;
          const len = 5 + 20 * clamp(Math.log10(m / 300) / 2, 0, 1), s = Math.sign(en);
          const x0 = s > 0 ? x : x + nx * len, y0 = s > 0 ? y : y + ny * len;
          kit.arrow(c, x0, y0, x0 + s * nx * len, y0 + s * ny * len, s > 0 ? C.ok : C.bad, 2, 5);
        }
        for (const h of hs) { c.beginPath(); c.arc(h.x, h.y, 5, 0, TAU); c.fillStyle = C.surface || '#fff'; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke(); }
        rods.forEach((r, i) => {
          chargeDot(c, r.x, r.y, r.lam, C, 9 + Math.abs(r.lam) * 0.25);
          kit.label(c, (r.lam > 0 ? '+' : '−') + Math.abs(r.lam) + ' nC/m', r.x, r.y + 22, { align: 'center', size: 11, color: C.muted });
          const w = res.inside[i] || 0;
          if (Math.abs(w - Math.round(w)) > 0.02) kit.label(c, 'on the surface', r.x, r.y - 22, { align: 'center', size: 11, color: C.warn });
        });
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(20, H0 - 16); c.lineTo(120, H0 - 16); c.stroke();
        kit.label(c, '10 cm', 70, H0 - 28, { color: C.muted, align: 'center', size: 11 });
        c.restore();
        const qR = Math.round(res.qin * 100) / 100;
        ro.set('flux', num(res.flux, 4) + ' V·m per metre');
        ro.set('gauss', num(res.qin * 1e-9 / EPS0, 4) + ' V·m per metre');
        ro.set('inside', num(qR, 3) + ' nC per metre');
        ro.set('rods', res.inside.filter(w => Math.abs(w) > 0.5).length + ' of ' + rods.length);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-capacitor */
  Hyper.sim('emf-capacitor', {
    title: 'The energy in a capacitor\'s field',
    blurb: `A parallel-plate capacitor (the gap is drawn enlarged). The shading between the plates shows the energy density $\\frac12\\varepsilon_0E^2$; the stored energy is that density times the volume of the field. Drag the top plate, or press *Pull*, to change the gap. The bars keep the books: the energy in the field, the work done by your hand, and the energy that went into the battery.

**Try this**
- *Isolated* (charge fixed): pull the plates apart. The field between them stays the same, the volume of field grows, and the stored energy grows by exactly the work of your hand. The force does not change with the gap.
- *Connected to the battery* (voltage fixed): pull again. The field weakens, the stored energy *falls*, charge flows back into the battery — and the battery gains twice what your hand gave.
- Push the plates together in each mode and watch the signs reverse.
- Compare the graph of $U$ against the gap: a straight line at fixed charge ($U = Q^2d/2\\varepsilon_0A$), a hyperbola at fixed voltage ($U = \\varepsilon_0AV^2/2d$). The force is minus the slope at fixed charge.`,
    mount(box, kit) {
      const W0 = 640, H0 = 380, BASE = 320, PX = 40, CXP = 215;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Circuit', options: [['Isolated: charge fixed', 'Q'], ['Connected to a battery: voltage fixed', 'V']], value: 'Q' },
        { id: 'd', label: 'Gap', min: 0.5, max: 5, step: 0.05, value: 1, unit: 'mm' },
        { id: 'A', label: 'Plate area', min: 25, max: 400, step: 5, value: 100, unit: 'cm²' },
        { id: 'V', label: 'Battery voltage', min: 100, max: 2000, step: 10, value: 1000, unit: 'V' },
        { type: 'buttons', items: [{ id: 'pull', label: 'Pull to twice the gap', primary: true }, { id: 'push', label: 'Push to half' }, { id: 'reset', label: 'Start again' }] }
      ], (id, v) => {
        if (id === 'd') setGap(v / 1000, true);
        else if (id === 'A') setArea(v / 1e4);
        else if (id === 'mode' || id === 'V' || id === 'reset') restart();
        else if (id === 'pull') target = Math.min(0.005, 2 * d);
        else if (id === 'push') target = Math.max(0.0005, d / 2);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['C', 'Capacitance C = ε₀A/d'], ['Q', 'Charge Q'], ['V', 'Voltage V'], ['E', 'Field E = V/d'], ['u', 'Energy density ½ε₀E²'], ['U', 'Stored energy U'], ['F', 'Force between the plates'], ['hand', 'Work done by your hand'], ['bat', 'Energy into the battery']]);
      const plot = kit.plot(gb, { x: { label: 'gap (mm)', min: 0.5, max: 5 }, y: { label: 'stored energy (µJ)', min: 0 } }, 150);
      let d = 0.001, A = 0.01, Q = 0, Wh = 0, Wb = 0, U0 = 0, target = null, plotDirty = true;
      const Cap = (dd, AA) => EPS0 * AA / dd;
      const U = () => Q * Q / (2 * Cap(d, A));
      function restart() { d = V.d / 1000; A = V.A / 1e4; Q = Cap(d, A) * V.V; Wh = 0; Wb = 0; U0 = U(); target = null; plotDirty = true; }
      // a slow (quasi-static) change: the hand supplies whatever energy the field and battery do not
      function change(dNew, ANew) {
        const C1 = Cap(d, A), C2 = Cap(dNew, ANew), U1 = Q * Q / (2 * C1);
        if (V.mode === 'V') { const Q2 = C2 * V.V, bat = -V.V * (Q2 - Q); Q = Q2; Wb += bat; Wh += Q2 * Q2 / (2 * C2) - U1 + bat; }
        else Wh += Q * Q / (2 * C2) - U1;
        d = dNew; A = ANew; plotDirty = true;
      }
      function setGap(dNew, fromSlider) { change(clamp(dNew, 0.0005, 0.005), A); if (!fromSlider) ctl.set('d', Math.round(d * 1e5) / 100); }
      function setArea(ANew) { change(d, ANew); }
      restart();
      const plateY = () => BASE - PX * d * 1000;
      kit.drag(st, {
        hit: p => { const q = fit(st, W0, H0).to(p), w = 20 * Math.sqrt(A * 1e4); return Math.abs(q.y - plateY()) < 14 && Math.abs(q.x - CXP) < w / 2 + 10 ? 'plate' : null; },
        move: (o, p) => { const q = fit(st, W0, H0).to(p); target = null; setGap((BASE - q.y) / PX / 1000, false); },
        hover: true
      });
      const loop = kit.loop(dt => {
        if (target != null) {
          const step = 0.0006 * dt, nd = Math.abs(target - d) <= step ? target : d + Math.sign(target - d) * step;
          setGap(nd, false); if (nd === target) target = null;
        }
        const C0 = Cap(d, A), Vc = Q / C0, E = Vc / d, u = 0.5 * EPS0 * E * E, Ue = U(), F = Q * Q / (2 * EPS0 * A);
        if (plotDirty) {
          plotDirty = false;
          const pts = [];
          for (let k = 0; k <= 60; k++) { const dd = (0.5 + 4.5 * k / 60) / 1000; pts.push([dd * 1000, (V.mode === 'V' ? 0.5 * Cap(dd, A) * V.V * V.V : Q * Q / (2 * Cap(dd, A))) * 1e6]); }
          plot.set({ series: [{ pts, label: V.mode === 'V' ? 'U at fixed voltage' : 'U at fixed charge' }], marks: [{ x: d * 1000, y: Ue * 1e6, label: 'now' }] });
        }
        const c = st.begin(), C = kit.colors(), Fi = fit(st, W0, H0);
        c.save(); c.translate(Fi.ox, Fi.oy); c.scale(Fi.s, Fi.s);
        c.font = '12px ' + fontOf();
        const w = 20 * Math.sqrt(A * 1e4), x0 = CXP - w / 2, yt = plateY();
        // the field: shading by energy density, lines by field strength
        const a = clamp(0.08 + 0.18 * Math.log10(1 + u), 0.08, 0.7);
        c.fillStyle = C.accent; c.globalAlpha = a; c.fillRect(x0, yt + 6, w, BASE - yt - 6); c.globalAlpha = 1;
        const n = clamp(Math.round(E / 1e6 * w / 22), 1, 60);
        for (let k = 0; k < n; k++) { const x = x0 + w * (k + 0.5) / n; kit.arrow(c, x, yt + 8, x, BASE - 2, C.text, 1.1, 5); }
        // plates with their charges
        c.fillStyle = C.hue(2); c.fillRect(x0, yt - 2, w, 8); c.fillStyle = C.hue(215); c.fillRect(x0, BASE, w, 8);
        const nq = clamp(Math.round(n), 1, 40);
        for (let k = 0; k < nq; k++) { const x = x0 + w * (k + 0.5) / nq; kit.label(c, '+', x, yt - 10, { align: 'center', color: C.hue(2), weight: 700, size: 12 }); kit.label(c, '−', x, BASE + 18, { align: 'center', color: C.hue(215), weight: 700, size: 12 }); }
        kit.label(c, '⇕ drag the plate', CXP + w / 2 + 12, yt, { size: 11, color: C.muted });
        kit.label(c, 'gap ' + num(d * 1000, 3) + ' mm (drawn ×40)', CXP, BASE + 40, { align: 'center', size: 11, color: C.muted });
        if (V.mode === 'V') {
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, yt + 2); c.lineTo(20, yt + 2); c.lineTo(20, 205); c.moveTo(20, 235); c.lineTo(20, BASE + 4); c.lineTo(x0, BASE + 4); c.stroke();
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(8, 205); c.lineTo(32, 205); c.stroke(); c.lineWidth = 1.5; c.beginPath(); c.moveTo(13, 235); c.lineTo(27, 235); c.stroke();
          kit.label(c, V.V + ' V', 36, 220, { size: 11, color: C.muted });
        }
        // the energy books
        const bars = [['field ΔU', Ue - U0, C.accent], ['your hand', Wh, C.warn], ['battery', Wb, C.ok]];
        const top = Math.max(1e-7, U0, ...bars.map(b => Math.abs(b[1]))), bx = 450, by = 200, bh = 120;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 8, by); c.lineTo(bx + 180, by); c.stroke();
        bars.forEach(([name, v, col], i) => {
          const x = bx + i * 62, h = bh * v / top;
          c.fillStyle = col; c.fillRect(x, h >= 0 ? by - h : by, 40, Math.abs(h));
          kit.label(c, name, x + 20, by + (h >= 0 ? 14 : -h + 14), { align: 'center', size: 11, color: C.muted });
          kit.label(c, eng(v, 'J'), x + 20, h >= 0 ? by - h - 10 : by - 10, { align: 'center', size: 11 });
        });
        kit.label(c, 'energy books since the start:', bx + 85, 40, { align: 'center', size: 12, color: C.muted });
        kit.label(c, 'field ΔU = your hand − battery', bx + 85, 58, { align: 'center', size: 12, color: C.muted });
        c.restore();
        ro.set('C', eng(C0, 'F')); ro.set('Q', eng(Q, 'C')); ro.set('V', eng(Vc, 'V')); ro.set('E', eng(E, 'V/m'));
        ro.set('u', eng(u, 'J/m³')); ro.set('U', eng(Ue, 'J')); ro.set('F', eng(F, 'N'));
        ro.set('hand', eng(Wh, 'J')); ro.set('bat', eng(Wb, 'J'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-atmosphere */
  Hyper.sim('emf-atmosphere', {
    title: 'The global circuit: fair weather and thunderstorms',
    blurb: `The Earth and the conducting upper atmosphere are the two plates of a huge leaky capacitor. On the left is fair weather: the field points down, positive ions drift down and negative ions up, and this current slowly discharges the Earth. On the right, a thunderstorm stands for all the storms on Earth: they drive current up into the conducting sky and bring negative charge down with lightning. The model is the circuit itself: $C \\approx 1.5$ F, $R \\approx 250$ Ω, about 0.6 A per storm. The inset shows what the field does near a person: the equipotentials, 100 V/m apart far away, bend over their head.

**Try this**
- Watch the numbers settle where the storms' current equals the leak: about 2000 storms hold the upper air near 300 kV and the ground field near 100 V/m.
- Press *Stop all storms* and slow the clock to a few minutes per second: the Earth discharges [[?exponential|exponentially]], with the time constant RC of about 6 minutes.
- Tick *Follow the day*: the number of storms rises and falls with universal time, peaking at 19:00 UTC, and the field follows — the daily curve measured on the *Carnegie*.
- Lower the air's conductivity (as smoke and dust do): the same storms now hold the Earth at a higher voltage and a stronger field.`,
    mount(box, kit) {
      const W0 = 640, H0 = 380, GROUND = 330, TOP = 34, CAP = 1.505, R0 = 250, IS = 0.6, AREA = 4 * Math.PI * 6.371e6 * 6.371e6;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'storms', label: 'Thunderstorms active', min: 0, max: 4000, step: 50, value: 2000 },
        { id: 'daily', type: 'check', label: 'Follow the day (more storms in the continents\' afternoon)', value: false },
        { id: 'cond', label: 'Conductivity of the air (× normal)', min: 0.3, max: 3, step: 0.05, value: 1 },
        { id: 'speed', label: 'Clock speed', min: 1, max: 120, step: 1, value: 20, unit: 'min/s' },
        { type: 'buttons', items: [{ id: 'stop', label: 'Stop all storms' }, { id: 'reset', label: 'Restart', primary: true }] }
      ], id => { if (id === 'stop') { ctl.set('storms', 0); ctl.set('daily', false); } if (id === 'reset') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ut', 'Universal time'], ['n', 'Thunderstorms active'], ['Iup', 'Current up from the storms'], ['Ileak', 'Leak through fair-weather air'], ['V', 'Upper air, relative to the ground'], ['Q', 'Charge on the Earth'], ['E', 'Fair-weather field at the ground'], ['tau', 'Time constant RC']]);
      const plot = kit.plot(gb, { x: { label: 'time (hours, UTC)' }, y: { label: 'V/m', min: 0 }, legend: true }, 150);
      const R = kit.qm.rng(1752);
      let t = 0, Vup = 3e5, hist = [], nextSample = 0, flash = null, flashClock = 0, ions = [], dots = 0;
      const storms = () => V.daily ? V.storms * (1 + 0.2 * Math.cos(TAU * ((t / 3600) % 24 - 19) / 24)) : V.storms;
      const Ratm = () => R0 / V.cond;
      function restart() {
        t = 0; hist = []; nextSample = 0; Vup = clamp(storms() * IS * Ratm(), 0, 2e6);
        ions = []; for (let i = 0; i < 90; i++) ions.push({ x: 20 + 340 * R(), z: 15 * R(), s: i % 2 ? 1 : -1 });
      }
      restart();
      // altitude (km) to the drawing: the lowest 15 km stretched, the rest compressed
      const yOf = z => z <= 15 ? GROUND - z * 12 : GROUND - 180 - (z - 15) * (GROUND - 180 - TOP - 12) / 45;
      const INSET = { x: 214, y: 50, w: 176, h: 118 };
      const inInset = (x, y) => x > INSET.x - 8 && x < INSET.x + INSET.w + 8 && y > INSET.y - 8 && y < INSET.y + INSET.h + 8;
      const loop = kit.loop(dt => {
        const simDt = V.speed * 60 * dt, n = Math.max(1, Math.ceil(simDt / 20)), h = simDt / n;
        for (let k = 0; k < n; k++) { const I = storms() * IS - Vup / Ratm(); Vup = Math.max(0, Vup + I * h / CAP); t += h; }
        const N = storms(), Iup = N * IS, Il = Vup / Ratm(), Q = CAP * Vup, E = Q / (AREA * EPS0);
        if (t >= nextSample) { hist.push([t / 3600, E, N / 20]); nextSample = t + 300; while (hist.length && hist[0][0] < t / 3600 - 24) hist.shift(); }
        // lightning, drawn at a visible rate that grows with the number of storms
        flashClock -= dt;
        if (flashClock <= 0 && N > 0) {
          flashClock = 0.3 + 2.5 * R() * 2000 / Math.max(200, N);
          const pts = [[515, yOf(2)]]; let x = 515, y = yOf(2);
          while (y < GROUND) { y = Math.min(GROUND, y + 8 + 10 * R()); x += (R() - 0.5) * 18; pts.push([x, y]); }
          flash = { pts, age: 0 };
        }
        if (flash) { flash.age += dt; if (flash.age > 0.35) flash = null; }
        const vIon = 28 * clamp(Il / 1200, 0, 3);
        for (const io of ions) { io.z -= io.s * vIon * dt / 12; if (io.z < 0 || io.z > 15) { io.z = io.s > 0 ? 15 * R() + 0.5 : 14.5 * R(); io.x = 20 + 340 * R(); io.z = clamp(io.z, 0.1, 14.9); } }
        dots = (dots + dt * 40 * clamp(Iup / 1200, 0, 3)) % 16;
        if (Math.floor(t / 600) !== Math.floor((t - simDt) / 600) || hist.length < 3) {
          const t1 = t / 3600;
          plot.set({ x: { label: 'time (hours; the clock starts at 00:00 UTC)', min: Math.max(0, t1 - 24), max: Math.max(24, t1) }, series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'field at the ground (V/m)' }, { pts: hist.map(p => [p[0], p[2]]), label: 'thunderstorms ÷ 20', dash: [5, 4] }] });
        }
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.font = '12px ' + fontOf();
        c.fillStyle = C.hue(210, 0.07); c.fillRect(0, TOP, W0, GROUND - TOP);
        c.fillStyle = C.hue(2, 0.2); c.fillRect(0, TOP - 14, W0, 16);
        kit.label(c, 'upper atmosphere, ≈ 50 km up: the air conducts well — ' + eng(Vup, 'V'), 320, TOP - 6, { align: 'center', size: 11, color: C.text });
        c.fillStyle = C.hue(30, 0.35); c.fillRect(0, GROUND, W0, H0 - GROUND);
        const nm = clamp(Math.round(24 * Q / 4.5e5), 0, 60);
        for (let k = 0; k < nm; k++) kit.label(c, '−', 10 + (W0 - 20) * (k + 0.5) / nm, GROUND + 12, { align: 'center', color: C.hue(215), weight: 700, size: 13 });
        kit.label(c, 'ground: ' + eng(-Q, 'C') + ' in all', 330, H0 - 12, { align: 'center', size: 11, color: C.text });
        // altitude scale
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(6, GROUND); c.lineTo(6, TOP + 2); c.stroke();
        for (const z of [5, 10, 15, 30, 45]) { const y = yOf(z); c.beginPath(); c.moveTo(3, y); c.lineTo(10, y); c.stroke(); kit.label(c, z + ' km', 13, y, { size: 10, color: C.muted }); }
        // fair-weather field and drifting ions
        for (const x of [60, 120, 180, 240, 300, 360]) for (const z of [0.8, 3, 6, 9.5, 13.5]) {
          const y = yOf(z); if (inInset(x, y)) continue;
          const Ez = E * Math.exp(-z / 4.5), L = clamp(26 * Ez / 100, 0, 34);
          if (L > 2) kit.arrow(c, x, y - L / 2, x, y + L / 2, C.accent, 1.6, 5);
        }
        for (const io of ions) { const y = yOf(io.z); if (inInset(io.x, y)) continue; c.fillStyle = io.s > 0 ? C.hue(2) : C.hue(215); c.fillRect(io.x - 1.5, y - 1.5, 3, 3); }
        // the storm
        const cy0 = yOf(2), cy1 = yOf(12), cx = 515;
        c.fillStyle = C.dark ? 'rgba(170,180,195,0.35)' : 'rgba(90,100,115,0.35)';
        c.beginPath(); c.ellipse(cx, (cy0 + cy1) / 2 + 10, 70, (cy0 - cy1) / 2, 0, 0, TAU); c.fill();
        c.beginPath(); c.ellipse(cx, cy1 + 6, 105, 16, 0, 0, TAU); c.fill();
        const ns = clamp(Math.round(3 + 6 * N / 2000), 0, 14);
        if (N > 0) for (let k = 0; k < ns; k++) {
          kit.label(c, '+', cx - 60 + 120 * (k + 0.5) / ns, yOf(10.5), { align: 'center', color: C.hue(2), weight: 700, size: 14 });
          kit.label(c, '−', cx - 50 + 100 * (k + 0.5) / ns, yOf(5.5), { align: 'center', color: C.hue(215), weight: 700, size: 15 });
        }
        if (N > 0) {
          c.strokeStyle = C.hue(2, 0.8); c.lineWidth = 2; c.setLineDash([4, 12]); c.lineDashOffset = -dots; c.beginPath(); c.moveTo(cx, cy1 - 10); c.lineTo(cx, TOP + 2); c.stroke(); c.setLineDash([]); c.lineDashOffset = 0;
          kit.label(c, '↑ ' + eng(Iup, 'A') + ' from ' + Math.round(N) + ' storms', cx + 8, yOf(30), { size: 11, color: C.text });
        } else kit.label(c, 'no storms', cx, (cy0 + cy1) / 2, { align: 'center', size: 12, color: C.muted });
        if (flash) { c.strokeStyle = 'hsl(52 100% ' + (C.dark ? 75 : 45) + '% / ' + (1 - flash.age / 0.35).toFixed(3) + ')'; c.lineWidth = 3; polyline(c, flash.pts); }
        kit.label(c, 'fair weather: ' + num(E, 3) + ' V/m', 150, GROUND - 10, { align: 'center', size: 11, color: C.text });
        // the inset: a person standing in the fair-weather field
        const I = INSET, px = I.x + I.w / 2, mPer = I.h / 3.3, gy = I.y + I.h - 8;
        c.fillStyle = C.surface || '#fff'; c.fillRect(I.x, I.y, I.w, I.h); c.strokeStyle = C.border || C.muted; c.lineWidth = 1; c.strokeRect(I.x, I.y, I.w, I.h);
        c.fillStyle = C.hue(30, 0.35); c.fillRect(I.x, gy, I.w, I.y + I.h - gy);
        c.strokeStyle = C.accent; c.lineWidth = 1.2;
        for (let k = 1; k <= 5; k++) {
          const hgt = 0.5 * k; c.beginPath();
          for (let x = I.x; x <= I.x + I.w; x += 3) { const bump = 1.8 * Math.exp(-Math.pow((x - px) / (0.33 * mPer), 2)), y = gy - (hgt + bump * Math.exp(-hgt / 2.5)) * mPer; if (x === I.x) c.moveTo(x, y); else c.lineTo(x, y); }
          c.stroke();
          kit.label(c, num(E * hgt, 3) + ' V', I.x + 4, gy - hgt * mPer - 6, { size: 9, color: C.muted });
        }
        c.fillStyle = C.text; const hp = 1.8 * mPer;
        c.beginPath(); c.arc(px, gy - hp + 5, 5, 0, TAU); c.fill(); c.fillRect(px - 3, gy - hp + 10, 6, hp - 30); c.fillRect(px - 4, gy - 20, 3, 20); c.fillRect(px + 1, gy - 20, 3, 20);
        kit.label(c, 'near the ground (3 m high)', I.x + I.w / 2, I.y + 9, { align: 'center', size: 10, color: C.muted });
        c.restore();
        const ut = (t / 3600) % 24, hh = Math.floor(ut), mm = Math.floor((ut - hh) * 60);
        ro.set('ut', (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm + ' (day ' + (1 + Math.floor(t / 86400)) + ')');
        ro.set('n', String(Math.round(N))); ro.set('Iup', eng(Iup, 'A')); ro.set('Ileak', eng(Il, 'A'));
        ro.set('V', eng(Vup, 'V')); ro.set('Q', eng(-Q, 'C')); ro.set('E', num(E, 3) + ' V/m, downward');
        ro.set('tau', num(Ratm() * CAP / 60, 3) + ' min');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-dielectric */
  Hyper.sim('emf-dielectric', {
    title: 'A dielectric slab in a capacitor',
    blurb: `A capacitor with plates 10 cm square and 2 mm apart (drawn much enlarged), charged to 1000 V. Slide a slab of insulator in. In the slab the field turns or stretches every molecule into a small dipole (drawn hugely exaggerated). Inside, the + end of one molecule sits next to the − end of the next; on the slab's faces they are left uncancelled — the **bound charges**. Of the field lines that leave the top plate above the slab, some end on the bound charges and only 1 in κ continue through: the field inside is weaker by κ. The graph shows the potential across the gap, beside and inside the slab.

**Try this**
- Push the slab in with the capacitor isolated: the voltage falls and the readout shows the slab being pulled in.
- Switch to *Connected to the battery*: now the voltage stays at 1000 V and extra free charge crowds onto the plates over the slab.
- Choose water (κ = 80): almost every field line from the plate ends on the bound charge, and the field in the slab nearly vanishes.
- Make the slab thinner than the gap: the air gap above it carries a strong field, the slab a weak one. Look at the kinks of the potential in the graph — its slope is the field.
- Polar molecules: without a field (outside the plates) they point every way; between the plates they lean along the field, fighting the thermal jostling.`,
    mount(box, kit) {
      const W0 = 640, H0 = 360, YT = 80, YB = 280, X0 = 60, X1 = 460, D = 0.002, AREA = 0.01, WID = 0.1, V0 = 1000;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'kappa', type: 'select', label: 'Material of the slab', options: [['Polyethylene (κ = 2.3)', 2.3], ['Paper (κ ≈ 3.5)', 3.5], ['Glass (κ ≈ 6)', 6], ['Water (κ ≈ 80)', 80], ['Nothing (κ = 1)', 1]], value: 6 },
        { id: 'mol', type: 'select', label: 'Molecules', options: [['Non-polar: the field stretches them', 'induced'], ['Polar: the field turns them', 'polar']], value: 'induced' },
        { id: 'f', label: 'How far the slab is in', min: 0, max: 1, step: 0.01, value: 0.6 },
        { id: 'tf', label: 'Slab thickness (share of the gap)', min: 0.2, max: 1, step: 0.05, value: 0.6 },
        { id: 'mode', type: 'select', label: 'Circuit', options: [['Isolated after charging to 1000 V', 'Q'], ['Connected to the 1000 V battery', 'V']], value: 'Q' }
      ]);
      const Vv = ctl.values;
      const ro = kit.readout(box.side, [['C', 'Capacitance'], ['Q', 'Charge on the plates'], ['V', 'Voltage'], ['Eg', 'Field: gap beside the slab'], ['Ea', 'Field: air above the slab'], ['Es', 'Field: in the slab'], ['sb', 'Bound charge / free charge'], ['U', 'Stored energy'], ['F', 'Pull on the slab']]);
      const plot = kit.plot(gb, { x: { label: 'height above the lower plate (mm)', min: 0, max: 2 }, y: { label: 'potential (V)', min: 0 }, legend: true }, 150);
      const R = kit.qm.rng(11);
      const mols = [];
      for (let y = YB - 12; y > YB - 200; y -= 22) for (let x = 12; x < 400; x += 26) mols.push({ dx: x, y, th: TAU * R(), w: 0 });
      function state() {
        const k = +Vv.kappa, f = Vv.f, tf = Vv.tf;
        const deff = D * (1 - tf) + D * tf / k, C1 = EPS0 * AREA * f / deff, C2 = EPS0 * AREA * (1 - f) / D, Ct = C1 + C2;
        const Q = Vv.mode === 'V' ? Ct * V0 : EPS0 * AREA / D * V0, V = Q / Ct;
        const s1 = EPS0 * V / deff, s2 = EPS0 * V / D;
        return { k, f, tf, deff, Ct, Q, V, s1, s2, Eg: V / D, Ea: V / deff, Es: V / (k * deff), sb: s1 * (1 - 1 / k), U: 0.5 * Ct * V * V, F: 0.5 * V * V * EPS0 * WID * (1 / deff - 1 / D) };
      }
      kit.drag(st, {
        hit: p => { const q = fit(st, W0, H0).to(p), xl = X1 - Vv.f * (X1 - X0); return q.x > xl - 6 && q.y > YB - Vv.tf * (YB - YT) - 6 && q.y < YB + 4 ? { off: q.x - xl } : null; },
        move: (o, p) => { const q = fit(st, W0, H0).to(p); ctl.set('f', clamp(Math.round(100 * (X1 - (q.x - o.off)) / (X1 - X0)) / 100, 0, 1)); },
        hover: true
      });
      let last = '';
      const loop = kit.loop(dt => {
        const S = state(), C = kit.colors();
        const key = [S.k, S.f, S.tf, Vv.mode].join();
        if (key !== last) {
          last = key;
          const t = S.tf * 2, Vs = S.Es * S.tf * D;
          plot.set({ series: [
            { pts: [[0, 0], [2, S.V]], label: 'beside the slab', dash: [5, 4] },
            { pts: [[0, 0], [t, Vs], [2, S.V]], label: 'through the slab' }
          ], vlines: [{ x: t, label: 'top of the slab' }] });
        }
        const c = st.begin(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.font = '12px ' + fontOf();
        const xl = X1 - S.f * (X1 - X0), ys = YB - S.tf * (YB - YT), SL = 6e-6 * 26 / 1.33;
        // the slab (it is 400 px long and slides in from the right)
        c.fillStyle = C.hue(190, 0.16); c.fillRect(xl, ys, 400, YB - ys); c.strokeStyle = C.hue(190, 0.8); c.lineWidth = 1.5; c.strokeRect(xl, ys, 400, YB - ys);
        // molecules
        for (const m of mols) {
          const x = xl + m.dx, inside = x < X1 && x > X0;
          if (m.y < ys + 8 || x > W0 + 10) continue;
          // the drawn alignment follows the polarization P = σ_bound (hugely exaggerated)
          const align = inside ? clamp(S.sb / 8e-6, 0, 0.95) : 0;
          let ang, len;
          if (Vv.mol === 'polar') { m.th += (R() - 0.5) * 6 * dt; ang = Math.PI / 2 + (1 - align) * (((m.th % TAU) + TAU) % TAU - Math.PI); len = 9; }
          else { ang = Math.PI / 2; len = 2 + 12 * align; }
          const ex = Math.cos(ang) * len / 2, ey = Math.sin(ang) * len / 2;
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x - ex, m.y - ey); c.lineTo(x + ex, m.y + ey); c.stroke();
          c.fillStyle = C.hue(215); c.beginPath(); c.arc(x - ex, m.y - ey, 2.6, 0, TAU); c.fill();
          c.fillStyle = C.hue(2); c.beginPath(); c.arc(x + ex, m.y + ey, 2.6, 0, TAU); c.fill();
        }
        // field lines: beside the slab, and above/through it
        const drawLines = (x0, x1, sig, withSlab) => {
          const n = Math.max(0, Math.round(sig * (x1 - x0) / SL));
          for (let k = 0; k < n; k++) {
            const x = x0 + (x1 - x0) * (k + 0.5) / n;
            if (!withSlab) { kit.arrow(c, x, YT + 6, x, YB - 2, C.text, 1.1, 5); continue; }
            const through = Math.floor((k + 1) / S.k) > Math.floor(k / S.k);
            if (through) kit.arrow(c, x, YT + 6, x, YB - 2, C.text, 1.1, 5);
            else { c.strokeStyle = C.text; c.lineWidth = 1.1; c.beginPath(); c.moveTo(x, YT + 6); c.lineTo(x, ys - 3); c.stroke(); c.fillStyle = C.hue(215); c.beginPath(); c.arc(x, ys, 2.5, 0, TAU); c.fill(); }
          }
          return n;
        };
        drawLines(X0, Math.max(X0, xl), S.s2, false);
        const n1 = xl < X1 ? drawLines(Math.max(X0, xl), X1, S.s1, true) : 0;
        // bound charges on the slab's faces, inside the plates
        if (xl < X1 && S.k > 1) {
          const nb = Math.max(0, Math.round(n1 * (1 - 1 / S.k))), x0 = Math.max(X0, xl);
          for (let k = 0; k < nb; k++) { const x = x0 + (X1 - x0) * (k + 0.5) / Math.max(1, nb); kit.label(c, '−', x, ys + 7, { align: 'center', color: C.hue(215), weight: 700, size: 12 }); kit.label(c, '+', x, YB - 7, { align: 'center', color: C.hue(2), weight: 700, size: 12 }); }
        }
        // plates and free charges
        c.fillStyle = C.hue(2); c.fillRect(X0, YT - 6, X1 - X0, 6); c.fillStyle = C.hue(215); c.fillRect(X0, YB, X1 - X0, 6);
        const plus = (x0, x1, sig) => { const n = Math.max(0, Math.round(sig * (x1 - x0) / SL)); for (let k = 0; k < n; k++) { const x = x0 + (x1 - x0) * (k + 0.5) / n; kit.label(c, '+', x, YT - 14, { align: 'center', color: C.hue(2), weight: 700, size: 12 }); kit.label(c, '−', x, YB + 16, { align: 'center', color: C.hue(215), weight: 700, size: 12 }); } };
        plus(X0, Math.max(X0, xl), S.s2); if (xl < X1) plus(Math.max(X0, xl), X1, S.s1);
        if (Vv.mode === 'V') { c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X0, YT - 3); c.lineTo(24, YT - 3); c.lineTo(24, 165); c.moveTo(24, 195); c.lineTo(24, YB + 3); c.lineTo(X0, YB + 3); c.stroke(); c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(12, 165); c.lineTo(36, 165); c.stroke(); c.lineWidth = 1.5; c.beginPath(); c.moveTo(17, 195); c.lineTo(31, 195); c.stroke(); }
        kit.label(c, '⇆ drag the slab', Math.min(W0 - 60, xl + 200), YB + 34, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'κ = ' + S.k + '   V = ' + num(S.V, 3) + ' V', X0, 22, { size: 12, color: C.text });
        c.restore();
        ro.set('C', eng(S.Ct, 'F')); ro.set('Q', eng(S.Q, 'C')); ro.set('V', eng(S.V, 'V'));
        ro.set('Eg', eng(S.Eg, 'V/m')); ro.set('Ea', S.tf < 1 ? eng(S.Ea, 'V/m') : '— (no air gap)'); ro.set('Es', eng(S.Es, 'V/m'));
        ro.set('sb', num(1 - 1 / S.k, 3) + ' (1 − 1/κ)'); ro.set('U', eng(S.U, 'J'));
        ro.set('F', S.f > 0 && S.f < 1 ? eng(S.F, 'N') + ', inward' : S.f >= 1 ? 'none: fully in' : eng(S.F, 'N') + ' at the edge');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-analogs */
  const STORIES = {
    electro: { name: 'Electrostatics', src: 'a charge', sink: 'a negative charge', body: 'a conductor held at a fixed potential', walls: 'a grounded box (0 V)',
      val: u => eng(10 * u, 'V'), flow: g => eng(1000 * g, 'V/m') + ' (field E)' },
    heat: { name: 'Steady heat flow', src: 'a heater', sink: 'a cooler', body: 'a block held at a fixed temperature', walls: 'walls kept at 20 °C',
      val: u => num(20 + 2 * u, 3) + ' °C', flow: g => eng(200 * g, 'W/m²') + ' (heat flux, K = 1 W/(m·K))' },
    membrane: { name: 'Stretched membrane', src: 'a post pushing up', sink: 'a post pulling down', body: 'a flat plate held at a fixed height', walls: 'a clamped frame (height 0)',
      val: u => num(0.5 * u, 3) + ' mm', flow: g => num(0.05 * g, 3) + ' (slope)' },
    diffusion: { name: 'Diffusion', src: 'a source of particles', sink: 'an absorber', body: 'a region held at a fixed concentration', walls: 'walls at the background concentration',
      val: u => num(1 + u / 13, 3) + ' × background', flow: g => num(g / 13, 3) + ' × background × D per cm (particle flow)' }
  };

  Hyper.sim('emf-analogs', {
    title: 'One equation, four stories',
    blurb: `The grid solves one equation, $\\nabla^2u = -s$ ([[?laplacian]]), with sources $s$ you can drag, a round body held at a fixed value, and walls held at zero. Then it tells the solution as four different stories:

| Story | $u$ is | the arrows are | a source is | the body is |
|---|---|---|---|---|
| electrostatics | potential | the field $\\vec E = -\\nabla\\phi$ | a charge | a conductor |
| heat flow | temperature | the heat flux $-K\\nabla T$ | a heater | a block at fixed temperature |
| membrane | height | downhill slope | a post | a flat plate |
| diffusion | concentration | the particle flow $-D\\nabla n$ | a particle source | a fixed concentration |

**Try this**
- Switch between the stories without touching anything: the numbers at the probe are the same solution in different units.
- Move a source close to the body: in electrostatics, the field lines bend to meet the conductor at right angles; in heat flow, heat pours into the block held cool — the same picture.
- In the membrane story, a source is a post pushing up a rubber sheet; the sheet's slope is the field.
- Set the body's value above zero: a charged conductor, a hot block, a raised plate or a region fed with particles.`,
    mount(box, kit) {
      const W0 = 640, H0 = 400, CELL = 10, NX = 64, NY = 40;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'story', type: 'select', label: 'Story', options: [['Electrostatics: potential and field', 'electro'], ['Heat flow: temperature and heat flux', 'heat'], ['Stretched membrane: height and slope', 'membrane'], ['Diffusion: concentration and flow', 'diffusion']], value: 'electro' },
        { id: 'preset', type: 'select', label: 'Sources', options: [['One source beside the body', 'one'], ['A source and a sink', 'pair'], ['Two sources', 'two']], value: 'one' },
        { id: 'body', type: 'check', label: 'The round body', value: true },
        { id: 'bv', label: 'Value held on the body', min: -6, max: 6, step: 0.5, value: 0 },
        { id: 'arrows', type: 'check', label: 'Flow arrows', value: true },
        { id: 'contours', type: 'check', label: 'Contours', value: true }
      ], id => { if (id === 'preset') load(); dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['val', 'Value at P'], ['flow', 'Flow at P'], ['src', 'A source is'], ['bod', 'The body is'], ['wall', 'The walls are']]);
      let srcs = [], body = { x: 400, y: 200 }, probe = { x: 300, y: 120 }, dirty = true, iso = [];
      const u = new Float64Array(NX * NY), fixed = new Uint8Array(NX * NY), b = new Float64Array(NX * NY);
      const load = () => {
        const p = V.preset;
        srcs = p === 'pair' ? [{ x: 200, y: 200, s: 30 }, { x: 440, y: 200, s: -30 }] : p === 'two' ? [{ x: 220, y: 150, s: 30 }, { x: 230, y: 270, s: 30 }] : [{ x: 220, y: 200, s: 30 }];
        body = p === 'pair' ? { x: 320, y: 310 } : { x: 420, y: 200 };
        dirty = true;
      };
      load();
      const idx = (i, j) => j * NX + i;
      function setup() {
        fixed.fill(0); b.fill(0);
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const k = idx(i, j);
          if (i === 0 || j === 0 || i === NX - 1 || j === NY - 1) { fixed[k] = 1; u[k] = 0; continue; }
          if (V.body && Math.hypot((i + 0.5) * CELL - body.x, (j + 0.5) * CELL - body.y) < 42) { fixed[k] = 1; u[k] = V.bv; }
        }
        for (const s of srcs) { const i = clamp(Math.floor(s.x / CELL), 1, NX - 2), j = clamp(Math.floor(s.y / CELL), 1, NY - 2); b[idx(i, j)] += s.s; }
      }
      function relax(sweeps) {
        let res = 0;
        for (let n = 0; n < sweeps; n++) {
          res = 0;
          for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) {
            const k = j * NX + i; if (fixed[k]) continue;
            const nu = (u[k - 1] + u[k + 1] + u[k - NX] + u[k + NX] + b[k]) / 4, d = nu - u[k];
            u[k] += 1.85 * d; res = Math.max(res, Math.abs(d));
          }
        }
        return res;
      }
      const at = (x, y) => { const fx = clamp(x / CELL - 0.5, 0, NX - 1.001), fy = clamp(y / CELL - 0.5, 0, NY - 1.001), i = Math.floor(fx), j = Math.floor(fy), tx = fx - i, ty = fy - j; return (u[idx(i, j)] * (1 - tx) + u[idx(i + 1, j)] * tx) * (1 - ty) + (u[idx(i, j + 1)] * (1 - tx) + u[idx(i + 1, j + 1)] * tx) * ty; };
      const grad = (x, y) => [(at(x + CELL, y) - at(x - CELL, y)) / 2, (at(x, y + CELL) - at(x, y - CELL)) / 2];
      kit.drag(st, {
        hit: p => { const d = fit(st, W0, H0).to(p); if (Math.hypot(d.x - probe.x, d.y - probe.y) < 12) return probe; for (const s of srcs) if (Math.hypot(d.x - s.x, d.y - s.y) < 14) return s; if (V.body && Math.hypot(d.x - body.x, d.y - body.y) < 42) return body; return null; },
        move: (o, p) => { const d = fit(st, W0, H0).to(p); o.x = clamp(d.x, 20, W0 - 20); o.y = clamp(d.y, 20, H0 - 20); if (o !== probe) dirty = true; },
        hover: true
      });
      const R = kit.qm.rng(3);
      const stipple = []; for (let k = 0; k < 2600; k++) stipple.push([10 + (W0 - 20) * R(), 10 + (H0 - 20) * R(), R()]);
      let res = 1, isoKey = '';
      const loop = kit.loop(() => {
        if (dirty) { setup(); dirty = false; isoKey = ''; }
        res = relax(res > 1e-4 ? 30 : 4);
        const key = V.story + (res < 2e-3 ? 'c' : Math.random());
        if (V.contours && key !== isoKey) { isoKey = key; iso = []; for (let L = -12; L <= 12; L += 1) if (L !== 0) contour(u, NX, NY, CELL, L, iso, CELL / 2, CELL / 2); }
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0), S = STORIES[V.story];
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.font = '12px ' + fontOf();
        if (V.story === 'membrane') {
          // the same numbers as a rubber sheet seen from the side
          const P3 = (x, y, h) => [60 + x * 0.8 + (H0 - y) * 0.25, 60 + y * 0.62 - h * 7];
          c.strokeStyle = C.accent; c.lineWidth = 0.8;
          for (let j = 0; j < NY; j += 2) { c.beginPath(); for (let i = 0; i < NX; i++) { const q = P3((i + 0.5) * CELL, (j + 0.5) * CELL, u[idx(i, j)]); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); } c.stroke(); }
          for (let i = 0; i < NX; i += 2) { c.beginPath(); for (let j = 0; j < NY; j++) { const q = P3((i + 0.5) * CELL, (j + 0.5) * CELL, u[idx(i, j)]); if (j) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); } c.stroke(); }
          for (const s of srcs) { const top = P3(s.x, s.y, at(s.x, s.y)), bot = P3(s.x, s.y, s.s > 0 ? -4 : 8); c.strokeStyle = s.s > 0 ? C.hue(2) : C.hue(215); c.lineWidth = 3; c.beginPath(); c.moveTo(bot[0], bot[1]); c.lineTo(top[0], top[1]); c.stroke(); }
          if (V.body) { const q = P3(body.x, body.y, V.bv); c.fillStyle = C.muted; c.globalAlpha = 0.6; c.beginPath(); c.ellipse(q[0], q[1], 34, 26 * 0.62, 0, 0, TAU); c.fill(); c.globalAlpha = 1; }
          const q = P3(probe.x, probe.y, at(probe.x, probe.y)); c.beginPath(); c.arc(q[0], q[1], 6, 0, TAU); c.fillStyle = C.warn; c.fill();
          kit.label(c, 'P', q[0] + 9, q[1] - 9, { color: C.warn, weight: 700 });
          kit.label(c, 'drag in the flat view: switch the story to move things', W0 / 2, H0 - 10, { align: 'center', size: 11, color: C.muted });
        } else {
          // shading
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
            const v = u[idx(i, j)], a = clamp(Math.abs(v) / 12, 0, 1);
            if (V.story === 'heat') c.fillStyle = 'hsl(' + Math.round(clamp(220 - 110 * (v / 12 + 1), 0, 240)) + ' 75% ' + (C.dark ? 45 : 60) + '% / 0.55)';
            else if (V.story === 'diffusion') continue;
            else c.fillStyle = v >= 0 ? C.hue(2, (0.5 * a).toFixed(3)) : C.hue(215, (0.5 * a).toFixed(3));
            c.fillRect(i * CELL, j * CELL, CELL + 0.5, CELL + 0.5);
          }
          if (V.story === 'diffusion') { c.fillStyle = C.text; for (const [x, y, r] of stipple) { const n = 1 + at(x, y) / 13; if (r < n * 0.45) c.fillRect(x - 1, y - 1, 2, 2); } }
          if (V.contours) { c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash(V.story === 'electro' ? [4, 3] : []); strokeSegs(c, iso); c.setLineDash([]); }
          if (V.arrows) for (let j = 2; j < NY - 1; j += 3) for (let i = 2; i < NX - 1; i += 3) {
            const x = (i + 0.5) * CELL, y = (j + 0.5) * CELL, g = grad(x, y), m = Math.hypot(g[0], g[1]);
            if (m < 1e-3 || fixed[idx(i, j)]) continue;
            const L = 6 + 14 * clamp(Math.log10(m / 0.01) / 2.5, 0, 1);
            kit.arrow(c, x + g[0] / m * L / 2, y + g[1] / m * L / 2, x - g[0] / m * L / 2, y - g[1] / m * L / 2, C.text, 1.2, 4.5);
          }
          if (V.body) { c.fillStyle = C.muted; c.globalAlpha = 0.75; c.beginPath(); c.arc(body.x, body.y, 40, 0, TAU); c.fill(); c.globalAlpha = 1; kit.label(c, 'held at ' + S.val(V.bv), body.x, body.y, { align: 'center', size: 11, color: C.bg || '#fff', weight: 700 }); }
          for (const s of srcs) {
            if (V.story === 'electro') chargeDot(c, s.x, s.y, s.s, C, 9);
            else { c.beginPath(); c.arc(s.x, s.y, 9, 0, TAU); c.fillStyle = V.story === 'heat' ? (s.s > 0 ? 'hsl(22 95% 55%)' : 'hsl(200 90% 55%)') : (s.s > 0 ? C.ok : C.bad); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke(); }
          }
          c.beginPath(); c.arc(probe.x, probe.y, 7, 0, TAU); c.fillStyle = C.surface || '#fff'; c.fill(); c.strokeStyle = C.warn; c.lineWidth = 2; c.stroke();
          kit.label(c, 'P', probe.x + 10, probe.y - 10, { color: C.warn, weight: 700 });
          c.strokeStyle = C.text; c.lineWidth = 3; c.strokeRect(CELL / 2, CELL / 2, W0 - CELL, H0 - CELL);
        }
        kit.label(c, S.name, 14, 18, { size: 13, weight: 700, color: C.text });
        c.restore();
        const g = grad(probe.x, probe.y);
        ro.set('val', S.val(at(probe.x, probe.y))); ro.set('flow', S.flow(Math.hypot(g[0], g[1])));
        ro.set('src', S.src + ' (a sink: ' + S.sink + ')'); ro.set('bod', V.body ? S.body : '—'); ro.set('wall', S.walls);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-wires */
  Hyper.sim('emf-wires', {
    title: 'Magnetic fields of wires and a solenoid',
    blurb: `Long straight wires seen end-on: a dot means current towards you, a cross current away from you. Short strokes show the direction of $\\vec B$ everywhere, like iron filings; the lines follow it round. The circle is an **Ampère loop**: the readout adds up $\\vec B\\cdot d\\vec s$ all the way round it — a [[?line-integral]] round a closed path — and divides by $\\mu_0$. The drawing is 32 cm wide.

**Try this**
- One wire: move the loop anywhere round the wire and change its size — the sum is always the current. Move it off the wire: zero, although the field on the loop is not.
- Two wires with opposite currents (a cable's two conductors): a loop round both encloses no net current, and far away their fields cancel.
- *Solenoid*: a slice through the middle of a long coil. Inside, the field is uniform and equal to $\\mu_0 nI$; outside it is nearly zero. Put the loop so it straddles the upper row of wires and count the currents it encloses.
- *Coaxial cable*: a central wire and a return sheath. Outside the sheath the field vanishes — which is why coax does not radiate or pick up.
- Drag the wires (in the first three settings) and the probe P; the readout gives the field at P in microtesla.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 400, MPP = 5e-4;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Wires', options: [['One wire', 'one'], ['Two wires, same direction', 'two'], ['Two wires, opposite directions', 'anti'], ['Solenoid (a slice through the middle)', 'sol'], ['Coaxial cable', 'coax']], value: 'one' },
        { id: 'I', label: 'Current in each wire', min: 1, max: 50, step: 1, value: 10, unit: 'A' },
        { id: 'R', label: 'Radius of the Ampère loop', min: 1, max: 9, step: 0.1, value: 3, unit: 'cm' },
        { id: 'filings', type: 'check', label: 'Filings', value: true },
        { id: 'lines', type: 'check', label: 'Field lines', value: true },
        { id: 'loop', type: 'check', label: 'Ampère loop', value: true }
      ], id => { if (id === 'mode') load(); dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['B', 'Field at P'], ['circ', '∮B·ds ÷ μ₀ round the loop'], ['enc', 'Current through the loop'], ['ref', 'For comparison'], ['F', 'Force per metre between wires']]);
      let wires = [], loopC = { x: 320, y: 200 }, probe = { x: 420, y: 130 }, dirty = true, lines = [], filings = [];
      function load() {
        const m = V.mode;
        if (m === 'one') wires = [{ x: 320, y: 200, s: 1 }];
        else if (m === 'two') wires = [{ x: 260, y: 200, s: 1 }, { x: 380, y: 200, s: 1 }];
        else if (m === 'anti') wires = [{ x: 280, y: 200, s: 1 }, { x: 360, y: 200, s: -1 }];
        else if (m === 'sol') { wires = []; for (let k = 0; k < 15; k++) { const x = 180 + 20 * k; wires.push({ x, y: 150, s: 1 }, { x, y: 250, s: -1 }); } }
        else { wires = [{ x: 320, y: 200, s: 1 }]; for (let k = 0; k < 16; k++) { const a = TAU * k / 16; wires.push({ x: 320 + 70 * Math.cos(a), y: 200 + 70 * Math.sin(a), s: -1 / 16 }); } }
        loopC = { x: 320, y: 200 }; dirty = true;
      }
      load();
      // B in tesla at a design point (y down; a positive current comes out of the page)
      const Bat = (x, y) => { const b = Q.wireB(wires.map(w => ({ x: w.x, y: w.y, I: -w.s * V.I })), x, y), k = 2e-7 / MPP; return { x: b.x * k, y: b.y * k }; };
      function recompute() {
        dirty = false;
        filings = [];
        const R = Q.rng(5);
        for (let y = 6; y < H0; y += 11) for (let x = 6; x < W0; x += 11) {
          const px = x + 5 * (R() - 0.5), py = y + 5 * (R() - 0.5), B = Bat(px, py), m = Math.hypot(B.x, B.y);
          if (!(m > 0) || wires.some(w => Math.hypot(w.x - px, w.y - py) < 9)) continue;
          filings.push([px, py, B.x / m, B.y / m, clamp(Math.log10(m / 2e-6) / 2.5, 0.12, 1)]);
        }
        // field lines seeded along a line across the pattern, spaced by the flux crossing it
        lines = [];
        const sol = V.mode === 'sol', f = (x, y) => Bat(x, y), N = 26;
        let total = 0; const acc = [];
        for (let s = 4; s < (sol ? H0 : W0) - 4; s += 1) { const B = sol ? f(320, s) : f(s, 200.5), m = Math.abs(sol ? B.x : B.y); total += m; acc.push([s, total]); }
        if (total > 0) {
          let next = total / N / 2;
          for (const [s, a] of acc) if (a >= next) {
            next += total / N;
            const x0 = sol ? 320 : s, y0 = sol ? s : 200.5;
            if (wires.some(w => Math.hypot(w.x - x0, w.y - y0) < 6)) continue;
            let n = 0;
            const pts = Q.traceField(f, x0, y0, { step: 3, max: 1400, stop: (x, y) => { n++; return x < -10 || x > W0 + 10 || y < -10 || y > H0 + 10 || (n > 30 && Math.hypot(x - x0, y - y0) < 4); } });
            lines.push(pts);
          }
        }
      }
      function loopIntegral() {
        const r = V.R / (MPP * 100), n = 720; let s = 0;
        for (let k = 0; k < n; k++) {
          const a = TAU * (k + 0.5) / n, x = loopC.x + r * Math.cos(a), y = loopC.y + r * Math.sin(a), B = Bat(x, y);
          // anticlockwise as seen on the screen (y down): the tangent is (sin a, −cos a)
          s += (B.x * Math.sin(a) - B.y * Math.cos(a)) * r * MPP * TAU / n;
        }
        let enc = 0; for (const w of wires) if (Math.hypot(w.x - loopC.x, w.y - loopC.y) < r) enc += w.s * V.I;
        return { circ: s / MU0, enc, r };
      }
      kit.drag(st, {
        hit: p => {
          const d = fit(st, W0, H0).to(p);
          if (Math.hypot(d.x - probe.x, d.y - probe.y) < 12) return probe;
          if (V.mode === 'one' || V.mode === 'two' || V.mode === 'anti') for (const w of wires) if (Math.hypot(d.x - w.x, d.y - w.y) < 12) return w;
          const r = V.R / (MPP * 100);
          if (V.loop && Math.abs(Math.hypot(d.x - loopC.x, d.y - loopC.y) - r) < 10) return loopC;
          if (V.loop && Math.hypot(d.x - loopC.x, d.y - loopC.y) < 10) return loopC;
          return null;
        },
        start: (o, p) => { const d = fit(st, W0, H0).to(p); o._dx = o.x - d.x; o._dy = o.y - d.y; },
        move: (o, p) => { const d = fit(st, W0, H0).to(p); o.x = clamp(d.x + (o._dx || 0), 5, W0 - 5); o.y = clamp(d.y + (o._dy || 0), 5, H0 - 5); if (o !== probe && o !== loopC) dirty = true; },
        hover: true
      });
      const loop = kit.loop(() => {
        if (dirty) recompute();
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.font = '12px ' + fontOf();
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(0, 0, W0, H0);
        if (V.filings) { c.strokeStyle = C.text; c.lineWidth = 1.2; for (const [x, y, ux, uy, a] of filings) { c.globalAlpha = a * 0.8; c.beginPath(); c.moveTo(x - ux * 3.5, y - uy * 3.5); c.lineTo(x + ux * 3.5, y + uy * 3.5); c.stroke(); } c.globalAlpha = 1; }
        if (V.lines) { c.strokeStyle = C.accent; c.lineWidth = 1.4; for (const L of lines) { polyline(c, L); headOn(c, L, 0.25, false, 5, C.accent); headOn(c, L, 0.75, false, 5, C.accent); } }
        const LI = loopIntegral();
        if (V.loop) {
          c.strokeStyle = C.warn; c.lineWidth = 2.2; c.setLineDash([6, 4]); c.beginPath(); c.arc(loopC.x, loopC.y, LI.r, 0, TAU); c.stroke(); c.setLineDash([]);
          for (let k = 0; k < 24; k++) {
            const a = TAU * (k + 0.5) / 24, x = loopC.x + LI.r * Math.cos(a), y = loopC.y + LI.r * Math.sin(a), B = Bat(x, y), bt = B.x * Math.sin(a) - B.y * Math.cos(a);
            const L = clamp(Math.abs(bt) / 2e-5, 0, 1) * 16 * Math.sign(bt);
            if (Math.abs(L) > 0.8) kit.arrow(c, x, y, x + L * Math.sin(a), y - L * Math.cos(a), bt > 0 ? C.ok : C.bad, 1.8, 5);
          }
          c.beginPath(); c.arc(loopC.x, loopC.y, 3, 0, TAU); c.fillStyle = C.warn; c.fill();
        }
        for (const w of wires) {
          const r = Math.abs(w.s) < 0.5 ? 5 : 9;
          c.beginPath(); c.arc(w.x, w.y, r, 0, TAU); c.fillStyle = C.surface || '#fff'; c.fill(); c.strokeStyle = w.s > 0 ? C.hue(2) : C.hue(215); c.lineWidth = 2; c.stroke();
          if (w.s > 0) { c.beginPath(); c.arc(w.x, w.y, r * 0.3, 0, TAU); c.fillStyle = C.hue(2); c.fill(); }
          else { c.beginPath(); c.moveTo(w.x - r * 0.55, w.y - r * 0.55); c.lineTo(w.x + r * 0.55, w.y + r * 0.55); c.moveTo(w.x + r * 0.55, w.y - r * 0.55); c.lineTo(w.x - r * 0.55, w.y + r * 0.55); c.stroke(); }
        }
        let Fpm = null;
        if (wires.length === 2) {
          const [a, b] = wires, d = Math.hypot(b.x - a.x, b.y - a.y) * MPP, f = 2e-7 * V.I * V.I / Math.max(d, 1e-4), s = a.s * b.s > 0 ? 1 : -1;
          Fpm = f * s;
          const ux = (b.x - a.x) / Math.max(1e-6, Math.hypot(b.x - a.x, b.y - a.y)), uy = (b.y - a.y) / Math.max(1e-6, Math.hypot(b.x - a.x, b.y - a.y)), L = 10 + 16 * clamp(f / 2e-3, 0, 1);
          kit.arrow(c, a.x + ux * 12 * s, a.y + uy * 12 * s, a.x + ux * (12 + L) * s, a.y + uy * (12 + L) * s, C.bad, 2.4, 6);
          kit.arrow(c, b.x - ux * 12 * s, b.y - uy * 12 * s, b.x - ux * (12 + L) * s, b.y - uy * (12 + L) * s, C.bad, 2.4, 6);
        }
        const B = Bat(probe.x, probe.y), m = Math.hypot(B.x, B.y);
        if (m > 0) { const L = 14 + 30 * clamp(Math.log10(m / 2e-6) / 2.5, 0, 1); kit.arrow(c, probe.x - B.x / m * L / 2, probe.y - B.y / m * L / 2, probe.x + B.x / m * L / 2, probe.y + B.y / m * L / 2, C.warn, 2.6); }
        c.beginPath(); c.arc(probe.x, probe.y, 5, 0, TAU); c.fillStyle = C.warn; c.fill();
        kit.label(c, 'P', probe.x + 9, probe.y - 11, { color: C.warn, weight: 700 });
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(20, H0 - 16); c.lineTo(120, H0 - 16); c.stroke();
        kit.label(c, '5 cm', 70, H0 - 28, { color: C.muted, align: 'center', size: 11 });
        c.restore();
        ro.set('B', eng(m, 'T'));
        ro.set('circ', V.loop ? num(LI.circ, 3) + ' A' : '—');
        ro.set('enc', V.loop ? num(LI.enc, 3) + ' A' : '—');
        const dP = Math.hypot(probe.x - wires[0].x, probe.y - wires[0].y) * MPP;
        ro.set('ref', V.mode === 'sol' ? 'μ₀nI = ' + eng(MU0 * 100 * V.I, 'T') + ' (n = 100 turns/m)' : V.mode === 'one' ? 'μ₀I/2πr at P = ' + eng(2e-7 * V.I / Math.max(dP, 1e-4), 'T') : 'Earth\'s field ≈ 50 µT');
        ro.set('F', Fpm == null ? '—' : eng(Math.abs(Fpm), 'N/m') + (Fpm > 0 ? ', attracting' : ', repelling'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-vecpot */
  Hyper.sim('emf-vecpot', {
    title: 'The vector potential and the Aharonov–Bohm shift',
    blurb: `An electron two-slit experiment seen from above, with a long, thin, shielded solenoid standing just behind the wall between the two paths. Inside the solenoid there is a magnetic field (the dots); outside, $\\vec B$ is exactly zero — but the vector potential $\\vec A$ (the arrows) circles it, falling as $1/r$. Each electron's amplitude for a path gains a [[?phase]] from $\\int\\vec A\\cdot d\\vec s$ along it. The two paths to any point of the screen enclose the solenoid, so their phases differ by $2\\pi\\,\\Phi/(h/e)$, and the whole fringe pattern slides — although no electron ever passes through a magnetic field.

**Try this**
- Turn up the flux: the dots build a pattern shifted from the dashed one (no flux). At $\\Phi = h/2e$ bright and dark have swapped; at $\\Phi = h/e$ the pattern looks untouched again.
- Drag the point P along the screen. The readout gives $\\int\\vec A\\cdot d\\vec s$ along each path: their difference is always $\\Phi$ in size, wherever P is — Stokes' theorem.
- Notice that the fringe *envelope* does not move: only the stripes inside it slide. A magnetic force would deflect the whole beam.`,
    mount(box, kit) {
      const W0 = 640, H0 = 400, SRC = [40, 200], WALL = 190, SL = [[190, 150], [190, 250]], SOL = [240, 200], RS = 12, SCR = 580, LAM = 15.4, PHI0 = 4.135667696e-15;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Flux in the solenoid (units of h/e)', min: -2, max: 2, step: 0.05, value: 0.25 },
        { id: 'rate', label: 'Electrons per second', min: 1, max: 300, step: 1, value: 90 },
        { id: 'showA', type: 'check', label: 'Arrows of A', value: true },
        { id: 'paths', type: 'check', label: 'The two paths to P', value: true },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the screen', primary: true }] }
      ], id => { if (id === 'f' || id === 'clear') { hits = []; bins.fill(0); n = 0; curveDirty = true; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['phi', 'Flux Φ inside the solenoid'], ['shift', 'Fringe shift'], ['Au', '∫A·ds, upper path to P'], ['Al', '∫A·ds, lower path to P'], ['diff', 'Upper − lower'], ['B', 'B where the electrons go'], ['n', 'Electrons arrived']]);
      const plot = kit.plot(gb, { x: { label: 'position on the screen (px from the centre)', min: -180, max: 180 }, y: { label: 'intensity (relative)', min: 0 }, legend: true }, 150);
      const R = kit.qm.rng(1959);
      let P = { y: 200 }, hits = [], bins = new Float64Array(72), n = 0, acc = 0, curveDirty = true;
      const Phi = () => V.f * PHI0;
      // A in Wb/m per unit of drawing length (the line integral does not depend on the scale); anticlockwise on the screen
      const Aat = (x, y) => { const dx = x - SOL[0], dy = y - SOL[1], r2 = dx * dx + dy * dy, k = Phi() / TAU / Math.max(r2, RS * RS); return [k * dy, -k * dx]; };
      const lineA = (a, b) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(2, Math.ceil(L / 2)); let s = 0; for (let i = 0; i < m; i++) { const t = (i + 0.5) / m, A = Aat(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t); s += (A[0] * (b[0] - a[0]) + A[1] * (b[1] - a[1])) / m; } return s; };
      const pathLen = (s, y) => Math.hypot(s[0] - SRC[0], s[1] - SRC[1]) + Math.hypot(SCR - s[0], y - s[1]);
      // intensity at a screen height: geometric phase plus the Aharonov–Bohm phase 2πΦ/Φ₀, under a single-slit envelope
      const inten = (y, f) => { const d = TAU * (pathLen(SL[0], y) - pathLen(SL[1], y)) / LAM + TAU * f; return Math.exp(-Math.pow((y - 200) / 150, 2)) * Math.pow(Math.cos(d / 2), 2); };
      kit.drag(st, { hit: p => { const d = fit(st, W0, H0).to(p); return Math.abs(d.x - SCR) < 16 && Math.abs(d.y - P.y) < 16 ? P : null; }, move: (o, p) => { o.y = clamp(fit(st, W0, H0).to(p).y, 20, 380); }, hover: true });
      const loop = kit.loop(dt => {
        acc += dt * V.rate;
        let k = 0;
        while (acc >= 1 && k < 100) {
          acc -= 1; k++;
          for (let tries = 0; tries < 200; tries++) { const y = 20 + 360 * R(); if (R() < inten(y, V.f)) { hits.push(y); if (hits.length > 3000) hits.shift(); bins[clamp(Math.floor((y - 20) / 5), 0, 71)]++; n++; break; } }
        }
        if (acc > 5) acc = 0;
        if (curveDirty || Math.floor(loop.t * 3) !== Math.floor((loop.t - dt) * 3)) {
          curveDirty = false;
          const now = [], zero = [], cnt = [];
          for (let y = 20; y <= 380; y += 2) { now.push([y - 200, inten(y, V.f)]); zero.push([y - 200, inten(y, 0)]); }
          const series = [{ pts: zero, label: 'no flux', dash: [5, 4] }, { pts: now, label: 'with the flux' }];
          if (n > 30) { const tot = bins.reduce((s, b) => s + b, 0), area = now.reduce((s, p) => s + p[1], 0) * 2; for (let i = 0; i < 72; i++) cnt.push([22.5 + 5 * i - 200, bins[i] / tot * area / 5]); series.push({ pts: cnt, label: 'counted', line: false, dots: 2.4 }); }
          plot.set({ series, marks: [{ x: P.y - 200, y: inten(P.y, V.f), label: 'P' }] });
        }
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.font = '12px ' + fontOf();
        // arrows of A
        if (V.showA && Math.abs(V.f) > 1e-6) {
          const Aref = Math.abs(Phi()) / TAU / 40;
          for (let y = 24; y < H0; y += 30) for (let x = 64; x < SCR; x += 30) {
            const A = Aat(x, y), m = Math.hypot(A[0], A[1]); if (!(m > 0)) continue;
            const L = clamp(12 * m / Aref, 3, 22);
            kit.arrow(c, x - A[0] / m * L / 2, y - A[1] / m * L / 2, x + A[0] / m * L / 2, y + A[1] / m * L / 2, C.hue(280, 0.7), 1.3, 4.5);
          }
        }
        // source, wall, slits, screen
        c.fillStyle = C.muted; c.fillRect(SRC[0] - 22, SRC[1] - 9, 24, 18);
        kit.label(c, 'electron gun', SRC[0] - 10, SRC[1] + 24, { align: 'center', size: 11, color: C.muted });
        c.fillStyle = C.text; c.fillRect(WALL - 3, 0, 6, 145); c.fillRect(WALL - 3, 155, 6, 90); c.fillRect(WALL - 3, 255, 6, H0 - 255);
        c.fillStyle = C.surface2 || C.faint; c.fillRect(SCR, 0, 10, H0);
        c.fillStyle = C.text; for (let i = 0; i < hits.length; i++) c.fillRect(SCR + 1 + ((i * 7919) % 8), hits[i] - 0.6, 1.4, 1.4);
        const mx = Math.max(1, ...bins); c.fillStyle = C.hue(22, 0.8); for (let i = 0; i < 72; i++) c.fillRect(SCR + 14, 20 + 5 * i, 40 * bins[i] / mx, 4.5);
        // the paths to P
        if (V.paths) {
          c.lineWidth = 1.6; c.setLineDash([5, 4]);
          [[SL[0], C.hue(210)], [SL[1], C.hue(28)]].forEach(([s, col]) => { c.strokeStyle = col; c.beginPath(); c.moveTo(SRC[0], SRC[1]); c.lineTo(s[0], s[1]); c.lineTo(SCR, P.y); c.stroke(); });
          c.setLineDash([]);
        }
        // the solenoid: B inside, shielded
        c.beginPath(); c.arc(SOL[0], SOL[1], RS, 0, TAU); c.fillStyle = C.hue(280, 0.18); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2.5; c.stroke();
        if (Math.abs(V.f) > 1e-6) { c.fillStyle = C.text; for (const [dx, dy] of [[0, 0], [-5, -5], [5, -5], [-5, 5], [5, 5]]) { c.beginPath(); c.arc(SOL[0] + dx, SOL[1] + dy, V.f > 0 ? 1.4 : 1, 0, TAU); c.fill(); } }
        kit.label(c, 'solenoid: B inside, B = 0 outside', SOL[0] + 18, SOL[1] + 30, { size: 11, color: C.muted });
        c.beginPath(); c.arc(SCR, P.y, 6, 0, TAU); c.fillStyle = C.warn; c.fill();
        kit.label(c, 'P', SCR - 12, P.y - 10, { color: C.warn, weight: 700 });
        c.restore();
        const au = lineA(SRC, SL[0]) + lineA(SL[0], [SCR, P.y]), al = lineA(SRC, SL[1]) + lineA(SL[1], [SCR, P.y]);
        ro.set('phi', eng(Phi(), 'Wb') + ' = ' + num(V.f, 3) + ' h/e');
        ro.set('shift', num(V.f, 3) + ' fringe spacings (phase ' + num(TAU * V.f, 3) + ' rad)');
        ro.set('Au', eng(au, 'Wb')); ro.set('Al', eng(al, 'Wb'));
        ro.set('diff', eng(au - al, 'Wb') + (Math.abs(V.f) > 1e-6 ? ' = −Φ (the loop runs clockwise)' : ''));
        ro.set('B', '0 exactly'); ro.set('n', String(n));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ emf-flux-rule */
  Hyper.sim('emf-flux-rule', {
    title: 'The flux rule and its exception',
    blurb: `Three ways to get an emf. **A loop moving through a magnet's field** (crosses: $\\vec B$ into the page): the charges in the wire move with it and feel $q\\vec v\\times\\vec B$ (arrows on the sides inside the field). **A loop at rest in a changing field**: now there is no $\\vec v\\times\\vec B$, but the changing field makes an electric field that circles round it (arrows), wire or no wire. **The Faraday disc**: a copper disc spinning in a steady field, with sliding contacts at its axle and rim — the exception. The graph shows the flux through the circuit and the emf together.

**Try this**
- Moving loop: the emf appears only while the flux is changing — entering or leaving the field. When the loop is wholly inside, the pushes on its two sides cancel. Check that the emf is minus the slope of the flux, and that the induced current (moving dots) always opposes the change ([[?flux]] rule and Lenz).
- Changing field: the loop never moves, yet the emf is the same rule, $-d\\Phi/dt$, supplied by the circulating $\\vec E$ — the [[?curl]] of $\\vec E$ is $-\\partial\\vec B/\\partial t$.
- Faraday disc: the flux through the circuit (the wires and the radius from axle to brush) never changes — the readout of $-d\\Phi/dt$ stays zero — yet the meter shows ½BωR², about 1.6 V at 3000 rpm in 1 T. The flux rule fails; $\\vec F = q\\vec v\\times\\vec B$ does not.`,
    mount(box, kit) {
      const W0 = 640, H0 = 360, FX0 = 230, FX1 = 430, FY0 = 60, FY1 = 300, LW = 120, LH = 100, LY = 130, RLOOP = 0.01;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Situation', options: [['A loop moving through a magnet\'s field', 'move'], ['A loop at rest in a changing field', 'change'], ['The Faraday disc: an exception', 'disc']], value: 'move' },
        { id: 'B', label: 'Magnetic field (peak)', min: 0.1, max: 1, step: 0.05, value: 0.5, unit: 'T' },
        { id: 'v', label: 'Speed of the loop', min: 0.05, max: 0.5, step: 0.01, value: 0.2, unit: 'm/s' },
        { id: 'rpm', label: 'Disc speed', min: 0, max: 3000, step: 50, value: 3000, unit: 'rpm' }
      ], id => { if (id === 'mode') { show(); hist = []; t = 0; prevPhi = null; } });
      const V = ctl.values;
      const show = () => { ctl.show('v', V.mode === 'move'); ctl.show('rpm', V.mode === 'disc'); };
      show();
      const ro = kit.readout(box.side, [['phi', 'Flux through the circuit'], ['dphi', 'Flux rule: −dΦ/dt'], ['emf', 'emf from the forces on the charges'], ['I', 'Current (circuit resistance 0.01 Ω)'], ['note', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'flux (mWb) and emf (mV)' }, legend: true }, 150);
      let t = 0, xL = 60, dir = 1, hist = [], prevPhi = null, phase = 0, disc = 0, dragging = false;
      const R = kit.qm.rng(1831), charges = []; for (let i = 0; i < 70; i++) charges.push([Math.sqrt(R()) * 0.95, TAU * R()]);
      const overlap = x => Math.max(0, Math.min(x + LW, FX1) - Math.max(x, FX0));
      kit.drag(st, {
        hit: p => { if (V.mode !== 'move') return null; const d = fit(st, W0, H0).to(p); return d.x > xL - 6 && d.x < xL + LW + 6 && d.y > LY - 6 && d.y < LY + LH + 6 ? { off: d.x - xL } : null; },
        start: () => { dragging = true; }, move: (o, p) => { xL = clamp(fit(st, W0, H0).to(p).x - o.off, 20, W0 - LW - 20); }, end: () => { dragging = false; },
        hover: true
      });
      const loop = kit.loop(dt => {
        if (!(dt > 0)) dt = 1 / 60;
        t += dt;
        const mode = V.mode;
        let phi = 0, emfForce = 0, vx = 0, Bnow = V.B, dBdt = 0;
        if (mode === 'move') {
          const x0 = xL;
          if (!dragging) { xL += dir * V.v * 1000 * dt; if (xL > W0 - LW - 20) { xL = W0 - LW - 20; dir = -1; } if (xL < 20) { xL = 20; dir = 1; } }
          vx = (xL - x0) / dt / 1000;
          phi = V.B * overlap(xL) * LH * 1e-6;
          // v × B on the two vertical sides: B into the page, v along x pushes charges along y
          const inL = xL > FX0 && xL < FX1, inR = xL + LW > FX0 && xL + LW < FX1;
          emfForce = V.B * LH * 1e-3 * vx * ((inL ? 1 : 0) - (inR ? 1 : 0));
        } else if (mode === 'change') {
          Bnow = V.B * Math.sin(TAU * t / 4); dBdt = V.B * TAU / 4 * Math.cos(TAU * t / 4);
          phi = Bnow * Math.PI * 0.07 * 0.07;
          emfForce = -dBdt * Math.PI * 0.07 * 0.07;
        } else {
          const w = V.rpm * TAU / 60; disc += w * dt;
          phi = V.B * 0.012;
          emfForce = 0.5 * V.B * w * 0.01;
        }
        const dphi = prevPhi == null ? 0 : -(phi - prevPhi) / dt;
        prevPhi = phi;
        const emfRule = mode === 'change' ? -dBdt * Math.PI * 0.0049 : dphi;
        hist.push([t, phi * 1e3, emfForce * 1e3]); while (hist.length && hist[0][0] < t - 8) hist.shift();
        if (Math.floor(t * 8) !== Math.floor((t - dt) * 8)) plot.set({ x: { label: 'time (s)', min: Math.max(0, t - 8), max: Math.max(8, t) }, series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'flux Φ (mWb)' }, { pts: hist.map(h => [h[0], h[2]]), label: 'emf (mV)' }] });
        phase += dt * 60 * clamp(emfForce / 0.02, -3, 3);
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.font = '12px ' + fontOf();
        const cross = (x, y, s, col) => { c.strokeStyle = col; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x - s, y - s); c.lineTo(x + s, y + s); c.moveTo(x + s, y - s); c.lineTo(x - s, y + s); c.stroke(); };
        const flowDots = (pts, col) => { c.strokeStyle = col; c.lineWidth = 3; c.setLineDash([2, 10]); c.lineDashOffset = -phase; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke(); c.setLineDash([]); c.lineDashOffset = 0; };
        if (mode === 'move') {
          c.fillStyle = C.hue(215, 0.12); c.fillRect(FX0, FY0, FX1 - FX0, FY1 - FY0);
          for (let y = FY0 + 15; y < FY1; y += 30) for (let x = FX0 + 15; x < FX1; x += 30) cross(x, y, 4, C.hue(215, 0.7));
          kit.label(c, 'B = ' + V.B + ' T into the page', (FX0 + FX1) / 2, FY0 - 12, { align: 'center', size: 11, color: C.muted });
          const pts = [[xL, LY], [xL + LW, LY], [xL + LW, LY + LH], [xL, LY + LH]];
          c.strokeStyle = C.text; c.lineWidth = 3; c.strokeRect(xL, LY, LW, LH);
          if (Math.abs(emfForce) > 1e-6) flowDots(pts, C.warn);
          // shade the flux-carrying part of the loop
          const o0 = Math.max(xL, FX0), o1 = Math.min(xL + LW, FX1);
          if (o1 > o0) { c.fillStyle = C.accent; c.globalAlpha = 0.18; c.fillRect(o0, LY, o1 - o0, LH); c.globalAlpha = 1; }
          for (const [x, inside] of [[xL, xL > FX0 && xL < FX1], [xL + LW, xL + LW > FX0 && xL + LW < FX1]]) if (inside && Math.abs(vx) > 1e-4) {
            const s = vx > 0 ? -1 : 1;
            for (const y of [LY + 25, LY + 50, LY + 75]) kit.arrow(c, x + 8, y - s * 8, x + 8, y + s * 8, C.bad, 1.8, 5);
            kit.label(c, 'qv×B', x + 14, LY + LH + 14, { size: 10, color: C.bad });
          }
          kit.arrow(c, xL + LW / 2 - 20, LY + LH + 30, xL + LW / 2 + 20 * Math.sign(vx || dir), LY + LH + 30, C.muted, 2, 6);
          kit.label(c, 'v = ' + num(Math.abs(vx), 2) + ' m/s', xL + LW / 2, LY + LH + 46, { align: 'center', size: 11, color: C.muted });
          kit.label(c, '⇆ drag the loop', xL + LW / 2, LY - 12, { align: 'center', size: 11, color: C.muted });
        } else if (mode === 'change') {
          const cx = 320, cy = 180, Rf = 110, rl = 70;
          c.fillStyle = C.hue(215, 0.06 + 0.2 * Math.abs(Bnow) / Math.max(V.B, 1e-6)); c.beginPath(); c.arc(cx, cy, Rf, 0, TAU); c.fill();
          for (let y = cy - Rf + 15; y < cy + Rf; y += 28) for (let x = cx - Rf + 15; x < cx + Rf; x += 28) if (Math.hypot(x - cx, y - cy) < Rf - 8) {
            if (Bnow >= 0) cross(x, y, 4 * Math.abs(Bnow) / Math.max(V.B, 1e-6) + 0.5, C.hue(215, 0.7)); else { c.beginPath(); c.arc(x, y, 1 + 2.5 * Math.abs(Bnow) / V.B, 0, TAU); c.fillStyle = C.hue(215, 0.7); c.fill(); }
          }
          // the circulating E: anticlockwise on the screen while B into the page grows
          for (const r of [40, 90, 140, 185]) for (let k = 0; k < 12; k++) {
            const a = TAU * (k + 0.5) / 12, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a), Em = (r < Rf ? r / 2 : Rf * Rf / (2 * r)) * dBdt, L = clamp(Math.abs(Em) / 30, 0, 1) * 18 * Math.sign(Em);
            if (Math.abs(L) > 1) kit.arrow(c, x, y, x + L * Math.sin(a), y - L * Math.cos(a), C.ok, 1.8, 5);
          }
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, rl, 0, TAU); c.stroke();
          const pts = []; for (let k = 0; k < 40; k++) pts.push([cx + rl * Math.cos(TAU * k / 40), cy - rl * Math.sin(TAU * k / 40)]);
          if (Math.abs(emfForce) > 1e-6) flowDots(pts, C.warn);
          kit.label(c, 'B = ' + num(Bnow, 2) + ' T (into the page when positive)', cx, 18, { align: 'center', size: 11, color: C.muted });
          kit.label(c, 'green arrows: the induced E', cx, H0 - 12, { align: 'center', size: 11, color: C.ok });
        } else {
          const cx = 250, cy = 180, Rd = 120, mx = 520;
          c.fillStyle = C.hue(28, 0.25); c.beginPath(); c.arc(cx, cy, Rd, 0, TAU); c.fill(); c.strokeStyle = C.hue(28, 0.9); c.lineWidth = 2; c.stroke();
          for (let y = cy - Rd + 10; y < cy + Rd; y += 26) for (let x = cx - Rd + 10; x < cx + Rd; x += 26) if (Math.hypot(x - cx, y - cy) < Rd - 6) cross(x, y, 3, C.hue(215, 0.45));
          // marks painted on the disc, turning with it (anticlockwise on the screen)
          c.strokeStyle = C.hue(28, 0.9); c.lineWidth = 1.5; for (let k = 0; k < 6; k++) { const a = disc + k * TAU / 6; c.beginPath(); c.moveTo(cx + 20 * Math.cos(a), cy - 20 * Math.sin(a)); c.lineTo(cx + (Rd - 8) * Math.cos(a), cy - (Rd - 8) * Math.sin(a)); c.stroke(); }
          for (const [r, a0] of charges) { const a = a0 + disc; c.fillStyle = C.text; c.fillRect(cx + r * Rd * Math.cos(a) - 1, cy - r * Rd * Math.sin(a) - 1, 2, 2); }
          // the fixed path of the circuit through the disc, and the v × B push along it (inward for this sense of rotation)
          c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Rd, cy); c.stroke();
          if (V.rpm > 0) for (const f of [0.35, 0.6, 0.85]) { const x = cx + f * Rd; kit.arrow(c, x + 10, cy - 12, x - 10, cy - 12, C.bad, 1.8, 5); }
          if (V.rpm > 0) kit.label(c, 'qv×B', cx + 0.6 * Rd, cy - 26, { align: 'center', size: 10, color: C.bad });
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx + Rd, cy); c.lineTo(mx, cy); c.lineTo(mx, cy + 150); c.lineTo(cx, cy + 150); c.lineTo(cx, cy); c.stroke();
          c.beginPath(); c.arc(cx, cy, 5, 0, TAU); c.fillStyle = C.text; c.fill(); c.fillRect(cx + Rd - 3, cy - 6, 8, 12);
          c.beginPath(); c.arc(mx, cy + 75, 26, 0, TAU); c.fillStyle = C.surface || '#fff'; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
          const needle = clamp(emfForce / 2, 0, 1) * 1.8 - 0.9;
          c.strokeStyle = C.bad; c.beginPath(); c.moveTo(mx, cy + 90); c.lineTo(mx + 22 * Math.sin(needle), cy + 90 - 22 * Math.cos(needle)); c.stroke();
          kit.label(c, num(emfForce, 3) + ' V', mx, cy + 118, { align: 'center', size: 12, weight: 700 });
          kit.label(c, 'brushes at the axle and the rim; B = ' + V.B + ' T into the page', 320, 20, { align: 'center', size: 11, color: C.muted });
        }
        c.restore();
        ro.set('phi', eng(phi, 'Wb') + (mode === 'disc' ? ' (constant)' : ''));
        ro.set('dphi', eng(emfRule, 'V'));
        ro.set('emf', eng(emfForce, 'V') + (mode === 'change' ? ' (∮E·ds)' : mode === 'move' ? ' (∮(v×B)·ds)' : ' (½BωR², R = 10 cm)'));
        ro.set('I', eng(Math.abs(emfForce) / RLOOP, 'A'));
        ro.set('note', mode === 'disc' ? (V.rpm > 0 ? 'The flux rule says 0; the meter disagrees.' : 'Disc at rest: no emf.') : mode === 'move' ? (overlap(xL) > 0 && overlap(xL) < LW ? 'Flux changing: emf.' : overlap(xL) >= LW ? 'Wholly inside: the pushes on the two sides cancel.' : 'Outside the field: no emf.') : 'No motion: the emf comes from the circulating E.');
      }, box.stage);
      loop.start();
    }
  });
})();
