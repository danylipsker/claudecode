/* HYPER-PHYSICS · sims/em-1.js — Electricity & Magnetism I: charges and fields,
 * capacitors, DC circuits and electromagnetic waves. Everything is wrapped in one
 * function so the helpers below do not leak into the page. */
(function () {
  'use strict';

  const K = 8.9875517923e9, EPS0 = 8.8541878128e-12, CL = 299792458, QE = 1.602176634e-19, HP = 6.62607015e-34;
  const PRE = [[1e12, 'T'], [1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p'], [1e-15, 'f']];
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const fam = () => getComputedStyle(document.body).fontFamily;

  /* a value with an SI prefix: eng(0.0042, 'A') -> "4.2 mA" */
  function eng(v, unit, sig) {
    if (v == null || !Number.isFinite(v)) return '—';
    if (v === 0) return '0 ' + unit;
    const a = Math.abs(v);
    let p = PRE[PRE.length - 1];
    for (const q of PRE) if (a >= q[0] * 0.99995) { p = q; break; }
    return Hyper.util.fmt(v / p[0], sig || 3) + ' ' + p[1] + unit;
  }

  /* ---------------------------------------------------------------- circuit drawing */
  function polyline(c, pts, color, w) {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = color; c.lineWidth = w || 2; c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.stroke(); c.restore();
  }
  /* a zigzag resistor centred at (x, y), along the wire it sits on */
  function resistor(c, x, y, vertical, C, color, len) {
    const L = len || 54, n = 6, amp = 7;
    c.save();
    c.fillStyle = C.bg2;
    if (vertical) c.fillRect(x - 10, y - L / 2 - 1, 20, L + 2); else c.fillRect(x - L / 2 - 1, y - 10, L + 2, 20);
    c.strokeStyle = color || C.text; c.lineWidth = 2; c.lineJoin = 'round';
    c.beginPath();
    for (let i = 0; i <= n + 1; i++) {
      const s = i === 0 ? 0 : i === n + 1 ? 1 : (i - 0.5) / n;
      const o = i === 0 || i === n + 1 ? 0 : (i % 2 ? amp : -amp);
      const px = vertical ? x + o : x - L / 2 + s * L, py = vertical ? y - L / 2 + s * L : y + o;
      i ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.stroke(); c.restore();
  }
  /* a cell: long plate (+) and short plate (−); `up` puts + towards smaller y (or smaller x) */
  function cell(c, x, y, vertical, C) {
    c.save();
    c.fillStyle = C.bg2;
    if (vertical) c.fillRect(x - 18, y - 6, 36, 12); else c.fillRect(x - 6, y - 18, 12, 36);
    c.strokeStyle = C.text; c.lineCap = 'butt';
    c.lineWidth = 2;
    c.beginPath();
    if (vertical) { c.moveTo(x - 16, y - 5); c.lineTo(x + 16, y - 5); } else { c.moveTo(x - 5, y - 16); c.lineTo(x - 5, y + 16); }
    c.stroke();
    c.lineWidth = 4.5;
    c.beginPath();
    if (vertical) { c.moveTo(x - 8, y + 5); c.lineTo(x + 8, y + 5); } else { c.moveTo(x + 5, y - 8); c.lineTo(x + 5, y + 8); }
    c.stroke();
    c.restore();
  }
  /* dots flowing along a polyline: `phase` in px, grows with time */
  function flow(c, pts, phase, color, spacing) {
    const sp = spacing || 18;
    let total = 0;
    const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); total += l; }
    if (!(total > 0) || !Number.isFinite(phase)) return;
    c.fillStyle = color;
    let s = ((phase % sp) + sp) % sp, i = 0, acc = 0;
    while (s < total && i < seg.length) {
      while (i < seg.length && s > acc + seg[i]) { acc += seg[i]; i++; }
      if (i >= seg.length) break;
      const f = seg[i] > 0 ? (s - acc) / seg[i] : 0;
      const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill();
      s += sp;
    }
  }
  /* a small meter face: a rounded box with a letter and a reading */
  function meter(c, x, y, letter, text, C, color) {
    c.save();
    c.font = '600 11.5px ' + fam();
    const w = Math.max(64, c.measureText(text).width + 30), h = 22;
    c.fillStyle = C.surface; c.strokeStyle = color || C.border2; c.lineWidth = 1.2;
    c.beginPath(); c.roundRect ? c.roundRect(x - w / 2, y - h / 2, w, h, 6) : c.rect(x - w / 2, y - h / 2, w, h); c.fill(); c.stroke();
    c.fillStyle = color || C.accent; c.textAlign = 'left'; c.textBaseline = 'middle';
    c.fillText(letter, x - w / 2 + 7, y + 0.5);
    c.fillStyle = C.text; c.textAlign = 'right';
    c.fillText(text, x + w / 2 - 7, y + 0.5);
    c.restore();
  }

  /* ================================================================ Coulomb's law */
  Hyper.sim('em1-coulomb', {
    title: 'Coulomb\'s law: two charges',
    blurb: `Two small charged spheres on a line. Set the charges and the separation, or drag the right-hand sphere. The arrows show the force on each sphere (their length is on a logarithmic scale); the graph shows how the force falls with distance.

- Halve the separation: the force becomes **four** times larger. The marks at 2r and 3r show a quarter and a ninth.
- Make one charge much bigger than the other: the two arrows stay exactly equal and opposite.
- Tick **Log–log graph**: an inverse-square law becomes a straight line falling two decades for every decade of distance.
- Flip the sign of one charge and watch the potential energy change sign.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190, maxH: 290 });
      const gb = document.createElement('div');
      gb.style.padding = '6px 10px 10px';
      box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'q1', label: 'Charge q₁', min: -10, max: 10, step: 0.5, value: 4, unit: 'µC' },
        { id: 'q2', label: 'Charge q₂', min: -10, max: 10, step: 0.5, value: -2, unit: 'µC' },
        { id: 'r', label: 'Separation r', min: 0.05, max: 1, step: 0.01, value: 0.4, unit: 'm' },
        { id: 'log', type: 'check', label: 'Log–log graph', value: false }
      ], () => refresh());
      const ro = kit.readout(box.side, [['F', 'Force on each'], ['kind', 'The force is'], ['U', 'Potential energy'], ['F2', 'Force at 2r'], ['E', 'Field of q₁ at q₂']]);
      const V = ctl.values;
      const plot = kit.plot(gb, { x: { label: 'separation r (m)' }, y: { label: '|F| (N)' } }, 180);
      const force = r => K * V.q1 * 1e-6 * V.q2 * 1e-6 / (r * r);
      const x0 = () => st.W * 0.2, sc = () => st.W * 0.6;   // 1 m spans the middle 60 % of the stage
      const yb = () => st.H * 0.5;

      function refresh() {
        const C = kit.colors();
        const F = force(V.r), a = Math.abs(F);
        ro.set('F', eng(a, 'N'));
        ro.set('kind', F > 0 ? 'repulsive' : F < 0 ? 'attractive' : 'zero (a charge is zero)');
        ro.set('U', eng(K * V.q1 * 1e-6 * V.q2 * 1e-6 / V.r, 'J'));
        ro.set('F2', eng(a / 4, 'N') + '  (÷ 4)');
        ro.set('E', eng(Math.abs(K * V.q1 * 1e-6 / (V.r * V.r)), 'N/C'));
        const log = V.log && a > 0;
        const pts = [];
        for (let i = 0; i <= 240; i++) {
          const r = log ? 0.05 * Math.pow(20, i / 240) : 0.05 + 0.95 * i / 240;
          pts.push([r, Math.abs(force(r))]);
        }
        const marks = [{ x: V.r, y: a, label: 'r', color: C.accent }];
        if (2 * V.r <= 1) marks.push({ x: 2 * V.r, y: a / 4, label: '2r: F/4', color: C.series[1] });
        if (3 * V.r <= 1) marks.push({ x: 3 * V.r, y: a / 9, label: '3r: F/9', color: C.series[2] });
        plot.set({
          series: [{ pts, label: '|F|' }], marks,
          x: { label: 'separation r (m)', min: 0.05, max: 1, log },
          y: log ? { label: '|F| (N)', log: true } : { label: '|F| (N)', min: 0, max: a > 0 ? 4.5 * a : 1 }
        });
        loop.once();
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const X = x => x0() + x * sc(), y = yb();
        // metre rule
        c.font = '11px ' + fam();
        c.strokeStyle = C.grid; c.fillStyle = C.faint; c.textAlign = 'center'; c.lineWidth = 1;
        for (let m = 0; m <= 1.0001; m += 0.1) {
          c.beginPath(); c.moveTo(X(m) + 0.5, y + 62); c.lineTo(X(m) + 0.5, y + 68); c.stroke();
          c.fillText(m.toFixed(1) + (m === 0 ? ' m' : ''), X(m), y + 80);
        }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(X(0), y + 62.5); c.lineTo(X(1), y + 62.5); c.stroke();
        // separation bracket
        c.strokeStyle = C.faint; c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(X(0), y); c.lineTo(X(V.r), y); c.stroke(); c.setLineDash([]);
        kit.label(c, 'r = ' + V.r.toFixed(2) + ' m', (X(0) + X(V.r)) / 2, y + 46, { align: 'center', size: 11.5, color: C.muted });
        // forces: equal and opposite, drawn with the same logarithmic length on two rows
        const F = force(V.r), a = Math.abs(F);
        if (a > 0) {
          const s = F > 0 ? 1 : -1;          // +1: pushed apart
          const room = s > 0 ? Math.min(X(0), st.W - X(V.r)) - 10 : st.W * 0.3;
          const len = clamp(22 + 26 * (Math.log10(a) + 2.8), 12, Math.max(12, Math.min(st.W * 0.3, room)));
          kit.arrow(c, X(0), y - 30, X(0) - s * len, y - 30, C.warn, 3);
          kit.arrow(c, X(V.r), y - 52, X(V.r) + s * len, y - 52, C.warn, 3);
          kit.label(c, 'on q₁: ' + eng(a, 'N'), X(0) - s * len / 2, y - 41, { align: 'center', size: 11, color: C.warn });
          kit.label(c, 'on q₂: ' + eng(a, 'N'), X(V.r) + s * len / 2, y - 63, { align: 'center', size: 11, color: C.warn });
        }
        // the spheres
        const ball = (x, q, name) => {
          const r = 9 + 1.5 * Math.sqrt(Math.abs(q)) * 3;
          kit.dot(c, x, y, r, q > 0 ? kit.hue(355) : q < 0 ? kit.hue(215) : C.faint, C.bg2);
          kit.label(c, q > 0 ? '+' : q < 0 ? '−' : '0', x, y + 1, { align: 'center', size: 15, weight: 700, color: C.bg2 });
          kit.label(c, name + ' = ' + (q > 0 ? '+' : '') + Hyper.util.fmt(q, 3) + ' µC', x, y + 30, { align: 'center', size: 11.5, color: C.text2 });
        };
        ball(X(0), V.q1, 'q₁');
        ball(X(V.r), V.q2, 'q₂');
      }
      const loop = kit.loop(draw, box.stage).start();
      kit.drag(st, {
        hit: p => Math.hypot(p.x - (x0() + V.r * sc()), p.y - yb()) < 26 ? 'q2' : null,
        move: (t, p) => { const r = Math.round(clamp((p.x - x0()) / sc(), 0.05, 1) * 100) / 100; ctl.set('r', r); refresh(); },
        hover: true
      });
      st.onResize(() => loop.once());
      refresh();
    }
  });

  /* ================================================================ field of point charges */
  Hyper.sim('em1-field', {
    title: 'Electric field of point charges',
    blurb: `Drag the charges; click one to select it and change its size with the slider. The canvas is 1 m across, the charges are in nanocoulombs. Drag the small ring (the probe) to read the field and potential at any point.

- **Dipole**: lines leave the + charge and end on the − charge. Find where the field is strongest.
- **Two like charges**: find the point between them where the field vanishes.
- Turn on **Equipotentials** (drawn every 30 V): they cross the field lines at right angles and crowd together where the field is strong.
- **Two charged plates**: between the rows the field is nearly uniform — a capacitor.
- **Gaussian sphere**: drag it (or its rim handle). The flux through it equals the charge inside divided by ε₀, wherever the charges outside are.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 280, maxH: 520 });
      const PRESETS = {
        single: [[0.5, 0.5, 2]],
        dipole: [[0.36, 0.5, 2], [0.64, 0.5, -2]],
        like: [[0.36, 0.5, 2], [0.64, 0.5, 2]],
        unequal: [[0.38, 0.5, 3], [0.64, 0.5, -1]],
        quad: [[0.4, 0.33, 2], [0.6, 0.33, -2], [0.4, 0.67, -2], [0.6, 0.67, 2]],
        plates: (() => { const a = []; for (let i = 0; i < 9; i++) { a.push([0.22 + 0.07 * i, 0.3, 1]); a.push([0.22 + 0.07 * i, 0.7, -1]); } return a; })(),
        gauss: [[0.4, 0.5, 2], [0.68, 0.5, -1]]
      };
      const LPN = 6;                          // field lines per nanocoulomb
      let charges = [], sel = 0, dirty = true;
      const probe = { fx: 0.82, fy: 0.24 };
      const gs = { fx: 0.4, fy: 0.5, R: 0.12 };  // Gaussian sphere (R in metres)
      const S = () => st.W / 1.0;             // pixels per metre
      function load(name) { charges = (PRESETS[name] || PRESETS.single).map(a => ({ fx: a[0], fy: a[1], q: a[2] })); sel = 0; dirty = true; }
      const first = PRESETS[params.preset] ? params.preset : 'dipole';
      load(first);
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Arrangement', options: [['One charge', 'single'], ['Dipole (+ and −)', 'dipole'], ['Two like charges', 'like'], ['Unequal pair (+3, −1)', 'unequal'], ['Quadrupole', 'quad'], ['Two charged plates', 'plates'], ['Gauss\'s law test', 'gauss']], value: first },
        { id: 'q', label: 'Selected charge', min: -5, max: 5, step: 0.5, value: charges[0].q, unit: 'nC' },
        { id: 'lines', type: 'check', label: 'Field lines', value: true },
        { id: 'vec', type: 'check', label: 'Field vectors', value: !!params.vectors },
        { id: 'equi', type: 'check', label: 'Equipotentials', value: !!params.equi },
        { id: 'gauss', type: 'check', label: 'Gaussian sphere', value: first === 'gauss' },
        { type: 'buttons', items: [{ id: 'addp', label: '+ charge' }, { id: 'addn', label: '− charge' }, { id: 'del', label: 'Remove' }] }
      ], (id, v) => {
        if (id === 'preset') {
          load(v); ctl.set('q', charges[0].q);
          if (v === 'gauss') { ctl.set('gauss', true); gs.fx = 0.4; gs.fy = 0.5; gs.R = 0.12; }
        } else if (id === 'q') { if (charges[sel]) charges[sel].q = v; }
        else if (id === 'addp' || id === 'addn') {
          if (charges.length < 12) {
            const n = charges.length;
            charges.push({ fx: clamp(0.5 + 0.2 * Math.cos(n * 2.4), 0.05, 0.95), fy: clamp(0.5 + 0.3 * Math.sin(n * 2.4), 0.06, 0.94), q: id === 'addp' ? 1 : -1 });
            sel = charges.length - 1; ctl.set('q', charges[sel].q);
          }
        } else if (id === 'del') { if (charges.length > 1) { charges.splice(sel, 1); sel = 0; ctl.set('q', charges[0].q); } }
        dirty = true;
      });
      const ro = kit.readout(box.side, [['E', 'Field at probe'], ['dir', 'Direction'], ['V', 'Potential at probe'], ['phi', 'Flux through sphere'], ['qin', 'Q inside ÷ ε₀']]);
      const V = ctl.values;

      /* physics, in canvas pixels; field in N/C with screen axes (y down) */
      let P = [];
      const cache = () => { P = charges.filter(c => c.q).map(c => ({ x: c.fx * st.W, y: c.fy * st.H, q: c.q * 1e-9 })); };
      function E(x, y) {
        let ex = 0, ey = 0;
        const s = S();
        for (const c of P) {
          const dx = (x - c.x) / s, dy = (y - c.y) / s, r2 = dx * dx + dy * dy + 1e-10, r = Math.sqrt(r2);
          const f = K * c.q / (r2 * r);
          ex += f * dx; ey += f * dy;
        }
        return [ex, ey];
      }
      function pot(x, y) {
        let v = 0;
        const s = S();
        for (const c of P) v += K * c.q / Math.max(Math.hypot(x - c.x, y - c.y) / s, 1e-4);
        return v;
      }

      /* field lines, from the + charges (or from the − charges if they dominate) */
      let lines = [];
      function trace() {
        lines = [];
        const pos = P.filter(c => c.q > 0), neg = P.filter(c => c.q < 0);
        const qp = pos.reduce((a, c) => a + c.q, 0), qn = -neg.reduce((a, c) => a + c.q, 0);
        const fromPos = qp >= qn;
        const src = fromPos ? pos : neg, dir = fromPos ? 1 : -1, h = 2.5;
        for (const c of src) {
          const n = Math.round(LPN * Math.abs(c.q) * 1e9);
          for (let i = 0; i < n; i++) {
            const a = 2 * Math.PI * (i + 0.5) / n;
            let x = c.x + 7 * Math.cos(a), y = c.y + 7 * Math.sin(a);
            const pts = [x, y];
            for (let k = 0; k < 1400; k++) {
              let e = E(x, y), m = Math.hypot(e[0], e[1]);
              if (!(m > 0)) break;
              const mx = x + dir * 0.5 * h * e[0] / m, my = y + dir * 0.5 * h * e[1] / m;
              e = E(mx, my); m = Math.hypot(e[0], e[1]);
              if (!(m > 0)) break;
              x += dir * h * e[0] / m; y += dir * h * e[1] / m;
              if (k % 2) pts.push(x, y);
              let end = null;
              for (const d of P) if (d.q * c.q < 0 && Math.abs(x - d.x) < 6 && Math.abs(y - d.y) < 6) { end = d; break; }
              if (end) { pts.push(end.x, end.y); break; }
              if (x < -40 || x > st.W + 40 || y < -40 || y > st.H + 40) break;
            }
            lines.push({ pts, dir });
          }
        }
      }

      /* equipotentials by marching squares, every 30 V up to ±300 V */
      let iso = { p: [], n: [], z: [] };
      function contour() {
        const g = 6, nx = Math.ceil(st.W / g) + 1, ny = Math.ceil(st.H / g) + 1;
        const G = new Float64Array(nx * ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) G[j * nx + i] = pot(i * g, j * g);
        iso = { p: [], n: [], z: [] };
        const step = 30, top = 300, pts = [];
        let L = 0;
        const edge = (va, vb, xa, ya, xb, yb) => { if ((va - L) * (vb - L) < 0) { const t = (L - va) / (vb - va); pts.push(xa + t * (xb - xa), ya + t * (yb - ya)); } };
        for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
          const a = G[j * nx + i], b = G[j * nx + i + 1], cc = G[(j + 1) * nx + i + 1], d = G[(j + 1) * nx + i];
          const lo = Math.max(Math.min(a, b, cc, d), -top - 1), hi = Math.min(Math.max(a, b, cc, d), top + 1);
          if (hi < lo) continue;
          for (L = Math.ceil(lo / step) * step; L <= hi; L += step) {
            pts.length = 0;
            const x0 = i * g, y0 = j * g;
            edge(a, b, x0, y0, x0 + g, y0); edge(b, cc, x0 + g, y0, x0 + g, y0 + g);
            edge(cc, d, x0 + g, y0 + g, x0, y0 + g); edge(d, a, x0, y0 + g, x0, y0);
            const arr = L > 0 ? iso.p : L < 0 ? iso.n : iso.z;
            if (pts.length >= 4) arr.push(pts[0], pts[1], pts[2], pts[3]);
            if (pts.length >= 8) arr.push(pts[4], pts[5], pts[6], pts[7]);
          }
        }
      }

      /* flux of E through the (3-D) sphere, by summing E·n over its surface */
      let flux = 0, qin = 0;
      function gauss() {
        const s = S(), cx = gs.fx * st.W, cy = gs.fy * st.H, R = gs.R, NU = 48, NP = 96;
        let F = 0;
        for (let a = 0; a < NU; a++) {
          const u = -1 + (a + 0.5) * 2 / NU, w = Math.sqrt(1 - u * u);
          for (let b = 0; b < NP; b++) {
            const ph = (b + 0.5) * 2 * Math.PI / NP, nx = w * Math.cos(ph), ny = w * Math.sin(ph);
            for (const c of P) {
              const dx = (cx - c.x) / s + R * nx, dy = (cy - c.y) / s + R * ny, dz = R * u;
              const r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2);
              if (r > 1e-9) F += K * c.q * (dx * nx + dy * ny + dz * u) / (r2 * r);
            }
          }
        }
        flux = F * R * R * (2 / NU) * (2 * Math.PI / NP);
        if (Math.abs(flux) < 0.05) flux = 0;     // numerical noise (below 0.5 pC's worth)
        qin = 0;
        for (const c of P) if (Math.hypot(c.x - cx, c.y - cy) / s < R) qin += c.q;
      }

      function recompute() {
        cache();
        if (V.lines) trace(); else lines = [];
        if (V.equi) contour(); else iso = { p: [], n: [], z: [] };
        if (V.gauss) gauss();
        dirty = false;
      }

      function segs(c, arr, color, dash) {
        if (!arr.length) return;
        c.save(); c.strokeStyle = color; c.lineWidth = 1.3; c.setLineDash(dash || []);
        c.beginPath();
        for (let i = 0; i + 3 < arr.length; i += 4) { c.moveTo(arr[i], arr[i + 1]); c.lineTo(arr[i + 2], arr[i + 3]); }
        c.stroke(); c.restore();
      }

      function draw() {
        if (dirty) recompute();
        const C = kit.colors();
        const c = st.begin();
        // equipotentials
        segs(c, iso.p, kit.hue(355, 0.55));
        segs(c, iso.n, kit.hue(215, 0.6));
        segs(c, iso.z, C.faint, [4, 4]);
        // field lines with a mid-way arrowhead
        c.save(); c.strokeStyle = C.text2; c.globalAlpha = 0.7; c.lineWidth = 1.2;
        for (const L of lines) {
          const p = L.pts;
          if (p.length < 4) continue;
          c.beginPath(); c.moveTo(p[0], p[1]);
          for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
          c.stroke();
        }
        c.restore();
        for (const L of lines) {
          const p = L.pts, n = p.length / 2;
          if (n < 12) continue;
          const i = 2 * Math.floor(n * 0.45), j = i + 4;
          if (j + 1 >= p.length) continue;
          const x = p[i + 2], y = p[i + 3];
          let dx = (p[j] - p[i]) * L.dir, dy = (p[j + 1] - p[i + 1]) * L.dir;
          const m = Math.hypot(dx, dy);
          if (!(m > 0)) continue;
          dx /= m; dy /= m;
          if (x < 0 || x > st.W || y < 0 || y > st.H) continue;
          c.fillStyle = C.text2;
          c.beginPath(); c.moveTo(x + 5 * dx, y + 5 * dy); c.lineTo(x - 4 * dx - 3.5 * dy, y - 4 * dy + 3.5 * dx); c.lineTo(x - 4 * dx + 3.5 * dy, y - 4 * dy - 3.5 * dx); c.closePath(); c.fill();
        }
        // vector grid
        if (V.vec) {
          const sp = 38;
          for (let y = sp / 2; y < st.H; y += sp) for (let x = sp / 2; x < st.W; x += sp) {
            if (P.some(q => Math.hypot(q.x - x, q.y - y) < 16)) continue;
            const e = E(x, y), m = Math.hypot(e[0], e[1]);
            if (!(m > 0)) continue;
            c.globalAlpha = clamp((Math.log10(m) - 1) / 3, 0.12, 1);
            kit.arrow(c, x - 7 * e[0] / m, y - 7 * e[1] / m, x + 8 * e[0] / m, y + 8 * e[1] / m, C.accent, 1.6, 6);
            c.globalAlpha = 1;
          }
        }
        // Gaussian sphere
        if (V.gauss) {
          const cx = gs.fx * st.W, cy = gs.fy * st.H, R = gs.R * S();
          c.save(); c.fillStyle = C.dark ? 'rgba(120,200,160,.08)' : 'rgba(40,150,100,.07)'; c.strokeStyle = C.ok; c.lineWidth = 1.8; c.setLineDash([6, 4]);
          c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill(); c.stroke(); c.restore();
          kit.dot(c, cx + R, cy, 5, C.ok, C.bg2);
          kit.label(c, 'Φ = ' + Hyper.util.fmt(flux, 3) + ' N·m²/C', cx, cy - R - 12, { align: 'center', size: 11.5, color: C.ok, bg: C.bg2 });
        }
        // charges
        charges.forEach((q, i) => {
          const x = q.fx * st.W, y = q.fy * st.H, r = 9 + 2.2 * Math.abs(q.q);
          if (i === sel) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r + 4, 0, 7); c.stroke(); c.restore(); }
          kit.dot(c, x, y, r, q.q > 0 ? kit.hue(355) : q.q < 0 ? kit.hue(215) : C.faint, C.bg2);
          kit.label(c, q.q > 0 ? '+' : q.q < 0 ? '−' : '0', x, y + 1, { align: 'center', size: 14, weight: 700, color: C.bg2 });
          kit.label(c, (q.q > 0 ? '+' : '') + Hyper.util.fmt(q.q, 2) + ' nC', x, y + r + 11, { align: 'center', size: 10.5, color: C.muted });
        });
        // probe
        const px = probe.fx * st.W, py = probe.fy * st.H, e = E(px, py), m = Math.hypot(e[0], e[1]);
        if (m > 0) {
          const len = clamp(14 * (Math.log10(m) - 0.3), 10, 80);
          kit.arrow(c, px, py, px + len * e[0] / m, py + len * e[1] / m, C.warn, 2.4);
        }
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.arc(px, py, 6, 0, 7); c.stroke(); c.restore();
        ro.set('E', eng(m, 'N/C'));
        ro.set('dir', m > 0 ? Math.round((Math.atan2(-e[1], e[0]) * 180 / Math.PI + 360) % 360) + '° (anticlockwise from →)' : '—');
        ro.set('V', eng(pot(px, py), 'V'));
        ro.set('phi', V.gauss ? Hyper.util.fmt(flux, 3) + ' N·m²/C' : '—');
        ro.set('qin', V.gauss ? Hyper.util.fmt(qin / EPS0, 3) + ' N·m²/C  (Q = ' + Hyper.util.fmt(qin * 1e9, 3) + ' nC)' : '—');
      }

      kit.drag(st, {
        hit(p) {
          for (let i = charges.length - 1; i >= 0; i--) {
            const q = charges[i];
            if (Math.hypot(p.x - q.fx * st.W, p.y - q.fy * st.H) < 12 + 2.2 * Math.abs(q.q)) return { kind: 'q', i };
          }
          if (Math.hypot(p.x - probe.fx * st.W, p.y - probe.fy * st.H) < 14) return { kind: 'probe' };
          if (V.gauss) {
            const cx = gs.fx * st.W, cy = gs.fy * st.H, R = gs.R * S();
            if (Math.hypot(p.x - cx - R, p.y - cy) < 12) return { kind: 'rim' };
            if (Math.hypot(p.x - cx, p.y - cy) < R) return { kind: 'sphere', ox: p.x - cx, oy: p.y - cy };
          }
          return null;
        },
        start(t) { if (t.kind === 'q' && charges[t.i]) { sel = t.i; ctl.set('q', charges[sel].q); } },
        move(t, p) {
          const fx = clamp(p.x / st.W, 0.02, 0.98), fy = clamp(p.y / st.H, 0.03, 0.97);
          if (t.kind === 'q') { if (charges[t.i]) { charges[t.i].fx = fx; charges[t.i].fy = fy; dirty = true; } }
          else if (t.kind === 'probe') { probe.fx = fx; probe.fy = fy; }
          else if (t.kind === 'rim') { gs.R = clamp(Math.hypot(p.x - gs.fx * st.W, p.y - gs.fy * st.H) / S(), 0.03, 0.45); dirty = true; }
          else { gs.fx = clamp((p.x - t.ox) / st.W, 0, 1); gs.fy = clamp((p.y - t.oy) / st.H, 0, 1); dirty = true; }
        },
        hover: true
      });
      st.onResize(() => { dirty = true; });
      kit.loop(draw, box.stage).start();
    }
  });

  /* ================================================================ parallel-plate capacitor */
  Hyper.sim('em1-capacitor', {
    title: 'Parallel-plate capacitor',
    blurb: `A side view of two square plates. The field lines between them are drawn closer together where the field is stronger, and the + and − signs are drawn closer together where the charge per area is larger.

- With the battery connected, halve the separation: $C$ and $Q$ double, $V$ stays put.
- Untick **Battery connected**, then pull the plates apart: now $Q$ is stuck, so $V$ rises — and so does the stored energy (you did work pulling the plates apart).
- Slide in a dielectric with and without the battery: watch the bound charges (small signs) appear on its faces and which quantities change.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 420 });
      const DI = [['Vacuum or air (κ = 1)', 1], ['PTFE (κ = 2.1)', 2.1], ['Paper (κ = 3.5)', 3.5], ['Glass (κ = 4.7)', 4.7], ['Mica (κ = 6)', 6], ['Pure water (κ = 80)', 80]];
      const k0 = DI.some(o => o[1] === params.kappa) ? params.kappa : 1;
      const ctl = kit.controls(box.side, [
        { id: 'A', label: 'Plate area', min: 20, max: 400, step: 5, value: 100, unit: 'cm²' },
        { id: 'd', label: 'Separation', min: 0.5, max: 10, step: 0.1, value: 2, unit: 'mm' },
        { id: 'k', type: 'select', label: 'Between the plates', options: DI, value: k0 },
        { id: 'Vb', label: 'Battery voltage', min: 0, max: 200, step: 5, value: 100, unit: 'V' },
        { id: 'bat', type: 'check', label: 'Battery connected', value: true }
      ], () => update());
      const ro = kit.readout(box.side, [['C', 'Capacitance C'], ['Q', 'Charge ±Q'], ['V', 'Voltage V'], ['E', 'Field E'], ['U', 'Energy ½QV'], ['u', 'Energy density']]);
      const V = ctl.values;
      let Q = 0;
      const cap = () => V.k * EPS0 * V.A * 1e-4 / (V.d * 1e-3);
      function update() {
        const C = cap();
        if (V.bat) Q = C * V.Vb;
        const U = Q / C, E = U / (V.d * 1e-3);
        ro.set('C', eng(C, 'F'));
        ro.set('Q', eng(Q, 'C'));
        ro.set('V', eng(U, 'V') + (V.bat ? '' : '  (isolated)'));
        ro.set('E', eng(E, 'V/m'));
        ro.set('U', eng(0.5 * Q * U, 'J'));
        ro.set('u', eng(0.5 * V.k * EPS0 * E * E, 'J/m³'));
        loop.once();
      }
      function draw() {
        const Cc = kit.colors();
        const c = st.begin();
        const C = cap(), U = Q / C, E = U / (V.d * 1e-3), sig = Q / (V.A * 1e-4);
        const cx = st.W * 0.6, my = st.H * 0.5;
        const hw = (Math.sqrt(V.A) / 20) * st.W * 0.27;
        const gap = 8 + (V.d / 10) * st.H * 0.5, th = 7;
        const yt = my - gap / 2, yb = my + gap / 2;   // inner faces of the plates
        // dielectric
        if (V.k > 1) {
          c.fillStyle = kit.hue(45, clamp(0.12 + 0.05 * Math.log(V.k), 0.12, 0.4));
          c.fillRect(cx - hw, yt, 2 * hw, gap);
        }
        // field lines, spaced inversely to E
        const Eref = 5e4;
        if (E > 0) {
          const sp = clamp(18 * Eref / E, 5, 400);
          c.save(); c.strokeStyle = Cc.accent; c.fillStyle = Cc.accent; c.globalAlpha = 0.75; c.lineWidth = 1.2;
          for (let x = cx - hw + (((2 * hw) % sp) / 2 || sp / 2); x < cx + hw; x += sp) {
            c.beginPath(); c.moveTo(x, yt + 1); c.lineTo(x, yb - 1); c.stroke();
            if (gap > 22) { c.beginPath(); c.moveTo(x, my + 4); c.lineTo(x - 3.5, my - 3); c.lineTo(x + 3.5, my - 3); c.closePath(); c.fill(); }
          }
          c.restore();
        }
        // plates
        c.fillStyle = Cc.text2;
        c.fillRect(cx - hw, yt - th, 2 * hw, th);
        c.fillRect(cx - hw, yb, 2 * hw, th);
        // free charges on the plates, bound charges on the dielectric faces
        const sref = EPS0 * Eref;
        const signs = (y, ch, col, spacing, size) => {
          if (!(spacing < 300)) return;
          for (let x = cx - hw + spacing / 2; x < cx + hw; x += spacing) kit.label(c, ch, x, y, { align: 'center', size, weight: 700, color: col });
        };
        if (sig > 0) {
          const sp = clamp(16 * sref / sig, 5, 400);
          signs(yt - th - 9, '+', kit.hue(355), sp, 13);
          signs(yb + th + 9, '−', kit.hue(215), sp, 13);
          if (V.k > 1 && gap > 16) {
            const sb = sig * (1 - 1 / V.k), spb = clamp(16 * sref / sb, 5, 400);
            signs(yt + 6, '−', kit.hue(215, 0.85), spb, 10);
            signs(yb - 6, '+', kit.hue(355, 0.85), spb, 10);
          }
        }
        // battery, switch and wires
        const bx = st.W * 0.14;
        const wt = yt - th / 2, wb = yb + th / 2;
        polyline(c, [[cx - hw, wt], [bx + 60, wt]], Cc.text2, 2);
        if (V.bat) polyline(c, [[bx + 60, wt], [bx, wt], [bx, my - 6]], Cc.text2, 2);
        else {
          polyline(c, [[bx + 22, wt], [bx, wt], [bx, my - 6]], Cc.text2, 2);
          polyline(c, [[bx + 22, wt], [bx + 56, wt - 16]], Cc.text2, 2);
          kit.dot(c, bx + 22, wt, 3, Cc.text2); kit.dot(c, bx + 60, wt, 3, Cc.text2);
        }
        polyline(c, [[bx, my + 6], [bx, wb], [cx - hw, wb]], Cc.text2, 2);
        cell(c, bx, my, true, Cc);
        kit.label(c, V.Vb + ' V', bx - 24, my, { align: 'right', size: 12, color: Cc.text2 });
        kit.label(c, V.bat ? 'connected' : 'disconnected', bx + 40, wt - 26, { align: 'center', size: 11, color: V.bat ? Cc.ok : Cc.warn });
        // labels on the right
        const rx = cx + hw + 16;
        c.strokeStyle = Cc.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(rx, yt); c.lineTo(rx + 6, yt); c.moveTo(rx + 3, yt); c.lineTo(rx + 3, yb); c.moveTo(rx, yb); c.lineTo(rx + 6, yb); c.stroke();
        kit.label(c, 'd = ' + V.d.toFixed(1) + ' mm', rx + 12, my - 9, { size: 11.5, color: Cc.muted });
        kit.label(c, 'V = ' + eng(U, 'V'), rx + 12, my + 9, { size: 11.5, color: Cc.text });
        kit.label(c, '+Q = ' + eng(Q, 'C'), cx, yt - th - 26, { align: 'center', size: 11.5, color: Cc.text2 });
        kit.label(c, 'E = ' + eng(E, 'V/m') + (V.k > 1 ? '   κ = ' + V.k : ''), cx, yb + th + 28, { align: 'center', size: 11.5, color: Cc.muted });
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ resistor networks */
  Hyper.sim('em1-circuits', {
    title: 'Resistors in series and parallel',
    blurb: `A battery drives current through three resistors. The meters beside each resistor show the voltage across it and the current through it; the moving dots show conventional current (their speed is proportional to the current in each wire).

- **Series**: the same current everywhere; the voltages add up to the battery's. The biggest resistor takes the biggest share.
- **Parallel**: every resistor has the full battery voltage; the currents add at the junctions. The smallest resistor carries the most current, and the total resistance is below the smallest.
- **Mixed**: check Kirchhoff's rules by hand — currents in = currents out at each junction, voltages round each loop add to zero.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 270, maxH: 430 });
      const TOPO = [['Series: R₁, R₂, R₃', 'series'], ['Parallel: R₁ ∥ R₂ ∥ R₃', 'parallel'], ['Mixed: R₁ then (R₂ ∥ R₃)', 'mixed']];
      const t0 = TOPO.some(o => o[1] === params.topo) ? params.topo : 'series';
      const ctl = kit.controls(box.side, [
        { id: 'topo', type: 'select', label: 'Circuit', options: TOPO, value: t0 },
        { id: 'E', label: 'Battery voltage', min: 1, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'R1', label: 'R₁', min: 1, max: 1000, value: 100, unit: 'Ω', log: true, sig: 2 },
        { id: 'R2', label: 'R₂', min: 1, max: 1000, value: 220, unit: 'Ω', log: true, sig: 2 },
        { id: 'R3', label: 'R₃', min: 1, max: 1000, value: 470, unit: 'Ω', log: true, sig: 2 },
        { id: 'dots', type: 'check', label: 'Show the current flowing', value: true }
      ], () => solve());
      const ro = kit.readout(box.side, [['Req', 'Equivalent resistance'], ['I', 'Battery current'], ['P', 'Power delivered'], ['r1', 'R₁'], ['r2', 'R₂'], ['r3', 'R₃']]);
      const V = ctl.values;
      let S = null;
      function solve() {
        const R = [V.R1, V.R2, V.R3];
        let Req, I, Ir, Vr;
        if (V.topo === 'series') {
          Req = R[0] + R[1] + R[2]; I = V.E / Req; Ir = [I, I, I]; Vr = R.map(r => I * r);
        } else if (V.topo === 'parallel') {
          Ir = R.map(r => V.E / r); I = Ir[0] + Ir[1] + Ir[2]; Req = V.E / I; Vr = [V.E, V.E, V.E];
        } else {
          const Rp = R[1] * R[2] / (R[1] + R[2]);
          Req = R[0] + Rp; I = V.E / Req;
          const Vp = I * Rp;
          Vr = [I * R[0], Vp, Vp]; Ir = [I, Vp / R[1], Vp / R[2]];
        }
        S = { R, Req, I, Ir, Vr };
        ro.set('Req', eng(Req, 'Ω'));
        ro.set('I', eng(I, 'A'));
        ro.set('P', eng(V.E * I, 'W'));
        for (let k = 0; k < 3; k++) ro.set('r' + (k + 1), eng(Vr[k], 'V') + ', ' + eng(Ir[k], 'A') + ', ' + eng(Vr[k] * Ir[k], 'W'));
      }
      solve();
      let phase = 0;
      function layout() {
        const W = st.W, Hh = st.H, L = W * 0.1, T = Hh * 0.2, B = Hh * 0.84, my = (T + B) / 2, bt = my - 12, bb = my + 12;
        const I = S.I, Ir = S.Ir;
        if (V.topo === 'series') {
          const Rr = W * 0.88;
          return {
            wires: [[[L, bt], [L, T], [Rr, T], [Rr, B], [L, B], [L, bb]]],
            res: [[W * 0.36, T, false], [Rr, my, true], [W * 0.56, B, false]],
            flows: [[[[L, bt], [L, T], [Rr, T], [Rr, B], [L, B], [L, bb]], I]],
            L, my
          };
        }
        if (V.topo === 'parallel') {
          const x1 = W * 0.42, x2 = W * 0.64, x3 = W * 0.86;
          return {
            wires: [[[L, bt], [L, T], [x3, T], [x3, B], [L, B], [L, bb]], [[x1, T], [x1, B]], [[x2, T], [x2, B]]],
            res: [[x1, my, true], [x2, my, true], [x3, my, true]],
            flows: [[[[L, bt], [L, T], [x1, T]], I], [[[x1, T], [x2, T]], Ir[1] + Ir[2]], [[[x2, T], [x3, T]], Ir[2]],
                    [[[x1, T], [x1, B]], Ir[0]], [[[x2, T], [x2, B]], Ir[1]], [[[x3, T], [x3, B]], Ir[2]],
                    [[[x3, B], [x2, B]], Ir[2]], [[[x2, B], [x1, B]], Ir[1] + Ir[2]], [[[x1, B], [L, B], [L, bb]], I]],
            L, my
          };
        }
        const x2 = W * 0.6, x3 = W * 0.86;
        return {
          wires: [[[L, bt], [L, T], [x3, T], [x3, B], [L, B], [L, bb]], [[x2, T], [x2, B]]],
          res: [[W * 0.33, T, false], [x2, my, true], [x3, my, true]],
          flows: [[[[L, bt], [L, T], [x2, T]], I], [[[x2, T], [x3, T]], Ir[2]], [[[x2, T], [x2, B]], Ir[1]], [[[x3, T], [x3, B]], Ir[2]],
                  [[[x3, B], [x2, B]], Ir[2]], [[[x2, B], [L, B], [L, bb]], I]],
          L, my
        };
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const g = layout();
        // overall speed grows slowly with the battery current; branch speeds are in exact proportion
        const base = 40 + 45 * Math.log10(1 + S.I / 1e-3);
        phase += dt * base / Math.max(S.I, 1e-12);
        for (const w of g.wires) polyline(c, w, C.text2, 2);
        if (V.dots) for (const f of g.flows) flow(c, f[0], phase * f[1], C.warn, 18);
        cell(c, g.L, g.my, true, C);
        kit.label(c, 'ℰ = ' + Hyper.util.fmt(V.E, 3) + ' V', g.L - 22, g.my, { align: 'right', size: 12, color: C.text });
        g.res.forEach((r, k) => {
          const [x, y, vert] = r;
          resistor(c, x, y, vert, C, C.text);
          const name = 'R' + '₁₂₃'[k] + ' = ' + eng(S.R[k], 'Ω', 2);
          if (vert) {
            kit.label(c, name, x + 14, y - 38, { size: 11.5, color: C.text2 });
            meter(c, x - 48, y - 13, 'V', eng(S.Vr[k], 'V'), C, C.series[1]);
            meter(c, x - 48, y + 13, 'A', eng(S.Ir[k], 'A'), C, C.series[2]);
          } else {
            kit.label(c, name, x, y - 20, { align: 'center', size: 11.5, color: C.text2 });
            meter(c, x - 40, y + (y > g.my ? -26 : 26), 'V', eng(S.Vr[k], 'V'), C, C.series[1]);
            meter(c, x + 40, y + (y > g.my ? -26 : 26), 'A', eng(S.Ir[k], 'A'), C, C.series[2]);
          }
        });
        kit.label(c, 'I = ' + eng(S.I, 'A') + '   R_eq = ' + eng(S.Req, 'Ω'), st.W * 0.5, st.H * 0.07, { align: 'center', size: 12.5, color: C.text });
      }
      kit.loop(draw, box.stage).start();
    }
  });

  /* ================================================================ EMF and internal resistance */
  Hyper.sim('em1-battery', {
    title: 'A battery with internal resistance',
    blurb: `A real battery is an ideal EMF ℰ in series with a small internal resistance $r$ (inside the dashed box). The voltmeter reads the terminal voltage $V = ℰ - Ir$; the graph shows the power delivered to the load for every load resistance.

- Make the load very large: almost no current, and the voltmeter reads the full EMF.
- Short the battery (tiny load): a huge current, the terminal voltage collapses and all the power is wasted inside the battery.
- Press **Set R = r**: the load power is the greatest possible, $ℰ^2/4r$, but the efficiency is only 50 %.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 340 });
      const gb = document.createElement('div');
      gb.style.padding = '6px 10px 10px';
      box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'E', label: 'EMF ℰ', min: 1, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'r', label: 'Internal resistance r', min: 0.01, max: 10, value: 0.5, unit: 'Ω', log: true, sig: 2 },
        { id: 'R', label: 'Load resistance R', min: 0.01, max: 100, value: 4, unit: 'Ω', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'match', label: 'Set R = r', primary: true }] }
      ], (id) => { if (id === 'match') ctl.set('R', V.r); refresh(); });
      const ro = kit.readout(box.side, [['I', 'Current I'], ['V', 'Terminal voltage'], ['PL', 'Power to load'], ['Pr', 'Power lost in r'], ['eta', 'Efficiency'], ['Pm', 'Most possible (R = r)']]);
      const V = ctl.values;
      const plot = kit.plot(gb, { x: { label: 'load resistance R (Ω)', log: true, min: 0.01, max: 100 }, y: { label: 'power (W)' }, legend: true }, 190);
      let phase = 0;
      const calc = () => {
        const I = V.E / (V.R + V.r);
        return { I, Vt: V.E - I * V.r, PL: I * I * V.R, Pr: I * I * V.r };
      };
      function refresh() {
        const s = calc(), Pm = V.E * V.E / (4 * V.r);
        ro.set('I', eng(s.I, 'A'));
        ro.set('V', eng(s.Vt, 'V'));
        ro.set('PL', eng(s.PL, 'W'));
        ro.set('Pr', eng(s.Pr, 'W'));
        ro.set('eta', (100 * V.R / (V.R + V.r)).toFixed(1) + ' %');
        ro.set('Pm', eng(Pm, 'W'));
        const pl = [], pr = [];
        for (let i = 0; i <= 200; i++) {
          const R = 0.01 * Math.pow(1e4, i / 200), I = V.E / (R + V.r);
          pl.push([R, I * I * R]); pr.push([R, I * I * V.r]);
        }
        const C = kit.colors();
        plot.set({
          series: [{ pts: pl, label: 'power to the load' }, { pts: pr, label: 'power wasted in r', dash: [6, 4] }],
          marks: [{ x: V.R, y: s.PL, label: eng(s.PL, 'W') }],
          vlines: [{ x: V.r, color: C.ok }],
          x: { label: 'load resistance R (Ω)   · dashed line: R = r', log: true, min: 0.01, max: 100 },
          y: { label: 'power (W)', min: 0, max: Pm * 1.3 }
        });
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const s = calc(), W = st.W, Hh = st.H;
        const T = Hh * 0.2, B = Hh * 0.84, my = (T + B) / 2;
        const xi = W * 0.17, xt = W * 0.3, xl = W * 0.82, xv = W * 0.42, xa = W * 0.62;
        // battery box
        c.save(); c.strokeStyle = C.faint; c.setLineDash([5, 4]); c.lineWidth = 1.3;
        c.beginPath(); c.roundRect ? c.roundRect(W * 0.07, T - 22, xt - W * 0.07, B - T + 44, 10) : c.rect(W * 0.07, T - 22, xt - W * 0.07, B - T + 44); c.stroke(); c.restore();
        kit.label(c, 'battery', W * 0.07 + 8, T - 12, { size: 11, color: C.muted });
        const loopPts = [[xi, T + (B - T) * 0.72 - 6], [xi, T], [xl, T], [xl, B], [xi, B], [xi, T + (B - T) * 0.72 + 6]];
        polyline(c, loopPts, C.text2, 2);
        // current dots: speed proportional to I, scaled to the short-circuit current
        const Imax = V.E / V.r;
        phase += dt * (15 + 190 * s.I / Imax);
        flow(c, loopPts, phase, C.warn, 18);
        resistor(c, xi, T + (B - T) * 0.3, true, C, C.bad, 44);
        cell(c, xi, T + (B - T) * 0.72, true, C);
        kit.label(c, 'r = ' + eng(V.r, 'Ω', 2), xi + 14, T + (B - T) * 0.3, { size: 11.5, color: C.bad });
        kit.label(c, 'ℰ = ' + Hyper.util.fmt(V.E, 3) + ' V', xi + 22, T + (B - T) * 0.72, { size: 11.5, color: C.text });
        kit.dot(c, xt, T, 4, C.text); kit.dot(c, xt, B, 4, C.text);
        // load, glowing with the power it takes
        const glow = clamp(s.PL / (V.E * V.E / (4 * V.r)), 0, 1);
        if (glow > 0.01) {
          const gr = c.createRadialGradient(xl, my, 4, xl, my, 60);
          gr.addColorStop(0, 'rgba(255,190,60,' + (0.55 * glow).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,190,60,0)');
          c.fillStyle = gr; c.fillRect(xl - 60, my - 60, 120, 120);
        }
        resistor(c, xl, my, true, C, C.text, 50);
        kit.label(c, 'R = ' + eng(V.R, 'Ω', 2), xl + 14, my - 34, { size: 11.5, color: C.text2 });
        // voltmeter across the terminals, ammeter in the line
        c.save(); c.strokeStyle = C.series[1]; c.setLineDash([3, 3]); c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(xv, T); c.lineTo(xv, my - 12); c.moveTo(xv, my + 12); c.lineTo(xv, B); c.stroke(); c.restore();
        meter(c, xv, my, 'V', eng(s.Vt, 'V'), C, C.series[1]);
        meter(c, xa, T, 'A', eng(s.I, 'A'), C, C.series[2]);
        kit.label(c, 'load gets ' + eng(s.PL, 'W') + ',  r wastes ' + eng(s.Pr, 'W'), W * 0.62, B + 16, { align: 'center', size: 11.5, color: C.muted });
      }
      kit.loop(draw, box.stage).start();
      refresh();
    }
  });

  /* ================================================================ RC charging and discharging */
  Hyper.sim('em1-rc', {
    title: 'Charging and discharging a capacitor',
    blurb: `Flip the switch to **Charge** or **Discharge**. The graph traces the capacitor voltage (solid) and the voltage across the resistor (dashed); the vertical lines mark whole time constants $\\tau = RC$. Long time constants are sped up and short ones slowed down so you can watch them.

- After one $\\tau$ the capacitor has 63 % of the battery voltage; after $5\\tau$ it is over 99 % charged.
- Double $R$ or $C$: the curve keeps its shape but stretches to twice the time.
- The resistor voltage (so the current) is largest at the instant the switch is thrown, and falls away exponentially.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200, maxH: 300 });
      const gb = document.createElement('div');
      gb.style.padding = '6px 10px 10px';
      box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'R', label: 'Resistance R', min: 1, max: 1000, value: 100, unit: 'kΩ', log: true, sig: 2 },
        { id: 'C', label: 'Capacitance C', min: 1, max: 1000, value: 10, unit: 'µF', log: true, sig: 2 },
        { id: 'E', label: 'Battery ℰ', min: 1, max: 12, step: 0.5, value: 9, unit: 'V' },
        { type: 'buttons', items: [{ id: 'charge', label: 'Charge', primary: true }, { id: 'discharge', label: 'Discharge' }] }
      ], (id) => {
        if (id === 'charge') start('charge');
        else if (id === 'discharge') start('discharge');
        else restart();
      });
      const ro = kit.readout(box.side, [['tau', 'Time constant τ = RC'], ['t', 'Time since switching'], ['Vc', 'Capacitor voltage'], ['I', 'Current'], ['Q', 'Charge'], ['U', 'Energy in C'], ['rate', 'Playback']]);
      const V = ctl.values;
      const plot = kit.plot(gb, { x: { label: 'time' }, y: { label: 'voltage (V)' }, legend: true }, 180);
      let mode = 'charge', t = 0, V0 = 0, trace = [], vc = 0;
      const tau = () => V.R * 1e3 * V.C * 1e-6;
      const rate = () => { const T = tau(); return T / clamp(T, 0.5, 3); };  // simulated seconds per real second
      const target = () => mode === 'charge' ? V.E : 0;
      function start(m) { mode = m; V0 = vc; t = 0; trace = []; }
      function restart() { V0 = vc; t = 0; trace = []; }
      const unit = () => tau() < 1 ? ['ms', 1e3] : ['s', 1];
      function step(dt) {
        const T = tau();
        if (t < 6 * T) t = Math.min(t + dt * rate(), 6 * T);
        vc = target() + (V0 - target()) * Math.exp(-t / T);
        const vr = Math.abs(target() - vc);
        const [un, f] = unit();
        if (!trace.length || t * f - trace[trace.length - 1][0] > 6 * T * f / 400) trace.push([t * f, vc, vr]);
        return vr;
      }
      function update(vr) {
        const T = tau(), [un, f] = unit(), C = kit.colors();
        const I = vr / (V.R * 1e3);
        ro.set('tau', eng(T, 's'));
        ro.set('t', eng(t, 's') + '  = ' + (t / T).toFixed(2) + ' τ');
        ro.set('Vc', eng(vc, 'V') + '  (' + (V.E > 0 ? (100 * vc / V.E).toFixed(0) : '0') + ' % of ℰ)');
        ro.set('I', eng(I, 'A'));
        ro.set('Q', eng(vc * V.C * 1e-6, 'C'));
        ro.set('U', eng(0.5 * V.C * 1e-6 * vc * vc, 'J'));
        const r = rate();
        ro.set('rate', Math.abs(r - 1) < 1e-9 ? 'real time' : r > 1 ? 'sped up ×' + Hyper.util.fmt(r, 3) : 'slowed down ×' + Hyper.util.fmt(1 / r, 3));
        const vl = [];
        for (let n = 1; n <= 5; n++) vl.push({ x: n * T * f, color: C.faint });
        const hl = mode === 'charge' ? [{ y: 0.632 * V.E, color: C.ok }] : [{ y: 0.368 * V0, color: C.ok }];
        plot.set({
          series: [{ pts: trace.map(p => [p[0], p[1]]), label: 'capacitor V_C' }, { pts: trace.map(p => [p[0], p[2]]), label: 'resistor V_R', dash: [6, 4] }],
          marks: [{ x: t * f, y: vc }], vlines: vl, hlines: hl,
          x: { label: 'time (' + un + ')   · lines at τ, 2τ … 5τ', min: 0, max: 6 * T * f }, y: { label: 'voltage (V)', min: 0, max: Math.max(V.E, V0, 1) * 1.08 }
        });
      }
      let phase = 0, frame = 0;
      function draw(dt) {
        const vr = step(dt);
        if (frame++ % 3 === 0 || dt === 0) update(vr);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H, L = W * 0.1, M = W * 0.3, P = M + 34, X = W * 0.8, T = Hh * 0.22, B = Hh * 0.85, my = (T + B) / 2;
        // wires
        polyline(c, [[L, my - 6], [L, T], [M, T]], C.text2, 2);
        polyline(c, [[L, my + 6], [L, B], [X, B], [X, my + 6]], C.text2, 2);
        polyline(c, [[P, T], [X, T], [X, my - 6]], C.text2, 2);
        polyline(c, [[M, T + 34], [M, B]], C.text2, 2);
        // switch: pivot at P, throws to the battery (M, T) or to the bypass (M, T + 34)
        kit.dot(c, M, T, 3.5, C.text2); kit.dot(c, M, T + 34, 3.5, C.text2); kit.dot(c, P, T, 3.5, C.text);
        polyline(c, mode === 'charge' ? [[P, T], [M + 3, T - 1]] : [[P, T], [M + 3, T + 32]], C.text, 2.5);
        kit.label(c, mode === 'charge' ? 'charging' : 'discharging', M + 17, T - 16, { align: 'center', size: 11, color: mode === 'charge' ? C.ok : C.warn });
        cell(c, L, my, true, C);
        kit.label(c, 'ℰ = ' + Hyper.util.fmt(V.E, 3) + ' V', L - 22, my, { align: 'right', size: 11.5, color: C.text });
        resistor(c, (P + X) / 2, T, false, C, C.text);
        kit.label(c, 'R = ' + eng(V.R * 1e3, 'Ω', 2), (P + X) / 2, T - 20, { align: 'center', size: 11.5, color: C.text2 });
        // capacitor with its charge
        c.fillStyle = C.bg2; c.fillRect(X - 20, my - 6, 40, 12);
        c.fillStyle = C.text; c.fillRect(X - 18, my - 7, 36, 3); c.fillRect(X - 18, my + 4, 36, 3);
        const n = V.E > 0 ? Math.round(8 * vc / Math.max(V.E, V0, 1e-9)) : 0;
        for (let k = 0; k < n; k++) {
          const x = X - 16 + 32 * (k + 0.5) / 8;
          kit.label(c, '+', x, my - 14, { align: 'center', size: 10, weight: 700, color: kit.hue(355) });
          kit.label(c, '−', x, my + 14, { align: 'center', size: 10, weight: 700, color: kit.hue(215) });
        }
        kit.label(c, 'C = ' + eng(V.C * 1e-6, 'F', 2), X + 26, my, { size: 11.5, color: C.text2 });
        kit.label(c, 'V_C = ' + eng(vc, 'V'), X + 26, my + 18, { size: 11.5, color: C.accent });
        // current: dots, fast when the current is large
        const I = vr / (V.R * 1e3), I0 = Math.max(V.E, V0, 1e-9) / (V.R * 1e3);
        phase += dt * 160 * I / I0;
        if (I / I0 > 0.004) {
          const path = mode === 'charge' ? [[L, my - 6], [L, T], [M, T], [P, T], [X, T], [X, my - 8]] : [[X, my - 8], [X, T], [P, T], [M, T + 34], [M, B], [X, B], [X, my + 8]];
          flow(c, path, phase, C.warn, 18);
          if (mode === 'charge') flow(c, [[X, my + 8], [X, B], [L, B], [L, my + 6]], phase, C.warn, 18);
        }
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ electromagnetic wave */
  Hyper.sim('em1-wave', {
    title: 'An electromagnetic wave',
    blurb: `A plane wave travelling to the right, drawn in perspective. The electric field (red) and the magnetic field (blue) are perpendicular to each other and to the direction of travel, and they rise and fall **together**, in phase. To be visible, $B$ is drawn $c$ times larger than it really is: in SI units $B = E/c$ is tiny.

- Pause the wave and check that $\\vec E \\times \\vec B$ points along the direction of travel everywhere.
- Choose **Circular** polarization: the field vectors now rotate, tracing a helix, but $E$ and $B$ stay perpendicular.
- Raise the amplitude tenfold: the intensity rises a hundredfold, because it goes as $E_0^2$.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'E0', label: 'Amplitude E₀', min: 1, max: 10000, value: 100, unit: 'V/m', log: true, sig: 2 },
        { id: 'nl', label: 'Wavelengths shown', min: 1, max: 4, step: 0.5, value: 2 },
        { id: 'pol', type: 'select', label: 'Polarization', options: [['Linear, vertical', 'v'], ['Linear, 45°', 'd'], ['Circular', 'c']], value: 'v' },
        { id: 'showE', type: 'check', label: 'Electric field', value: true },
        { id: 'showB', type: 'check', label: 'Magnetic field', value: true },
        { id: 'run', type: 'check', label: 'Animate', value: true }
      ], () => readouts());
      const ro = kit.readout(box.side, [['E0', 'E₀'], ['B0', 'B₀ = E₀/c'], ['I', 'Intensity ½cε₀E₀²'], ['u', 'Average energy density'], ['c', 'E/B']]);
      const V = ctl.values;
      let ph = 0;
      function readouts() {
        ro.set('E0', eng(V.E0, 'V/m'));
        ro.set('B0', eng(V.E0 / CL, 'T'));
        ro.set('I', eng(0.5 * CL * EPS0 * V.E0 * V.E0, 'W/m²'));
        ro.set('u', eng(0.5 * EPS0 * V.E0 * V.E0, 'J/m³'));
        ro.set('c', '2.998 × 10⁸ m/s = c');
      }
      readouts();
      function draw(dt) {
        if (V.run) ph += dt * 2 * Math.PI * 0.45;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const ox = W * 0.12, oy = Hh * 0.5, Lx = W * 0.8, A = Hh * 0.3;
        const zx = -0.55, zy = 0.32;          // the depth axis, drawn down and to the left
        const P = (x, y, z) => [ox + x + z * A * zx / 1, oy - y * A + z * A * zy];
        const kx = 2 * Math.PI * V.nl / Lx;
        const al = V.pol === 'd' ? Math.PI / 4 : 0;
        const fields = x => {
          const p = kx * x - ph;
          let ey, ez;
          if (V.pol === 'c') { ey = Math.cos(p); ez = Math.sin(p); } else { ey = Math.cos(p) * Math.cos(al); ez = Math.cos(p) * Math.sin(al); }
          return { ey, ez, by: -ez, bz: ey };    // B = x̂ × E / c, drawn c times larger
        };
        // axes
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.3;
        let a = P(0, 0, 0), b = P(Lx + 30, 0, 0);
        c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.faint;
        a = P(0, -1.15, 0); b = P(0, 1.15, 0); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        a = P(0, 0, -1.2); b = P(0, 0, 1.2); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        c.restore();
        b = P(Lx + 30, 0, 0);
        kit.arrow(c, b[0] - 40, b[1], b[0] + 6, b[1], C.text, 2);
        kit.label(c, 'direction of travel (speed c)', b[0] - 20, b[1] + 18, { align: 'right', size: 11.5, color: C.muted });
        a = P(0, 1.2, 0); kit.label(c, 'y', a[0] + 8, a[1], { size: 12, color: C.faint });
        a = P(0, 0, 1.25); kit.label(c, 'z', Math.max(a[0], 4) + 4, a[1] + 10, { size: 12, color: C.faint });
        const N = Math.round(16 * V.nl), Ecol = kit.hue(355), Bcol = kit.hue(215);
        const layer = (which, col) => {
          c.save(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 240; i++) {
            const x = Lx * i / 240, f = fields(x);
            const q = which === 'E' ? P(x, f.ey, f.ez) : P(x, f.by, f.bz);
            i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]);
          }
          c.stroke(); c.restore();
          for (let i = 0; i <= N; i++) {
            const x = Lx * i / N, f = fields(x);
            const o = P(x, 0, 0), q = which === 'E' ? P(x, f.ey, f.ez) : P(x, f.by, f.bz);
            if (Math.hypot(q[0] - o[0], q[1] - o[1]) > 3) kit.arrow(c, o[0], o[1], q[0], q[1], col, 1.4, 6);
          }
        };
        if (V.showB) layer('B', Bcol);
        if (V.showE) layer('E', Ecol);
        kit.label(c, 'E', 14, 18, { size: 14, weight: 700, color: Ecol });
        kit.label(c, 'electric field', 30, 18, { size: 11.5, color: C.muted });
        kit.label(c, 'B', 14, 38, { size: 14, weight: 700, color: Bcol });
        kit.label(c, 'magnetic field (drawn × c)', 30, 38, { size: 11.5, color: C.muted });
        // one wavelength marked along the axis
        const w0 = P(Lx - Lx / V.nl, 0, 0), w1 = P(Lx, 0, 0);
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(w0[0], oy + A * 1.25); c.lineTo(w1[0], oy + A * 1.25); c.moveTo(w0[0], oy + A * 1.25 - 5); c.lineTo(w0[0], oy + A * 1.25 + 5); c.moveTo(w1[0], oy + A * 1.25 - 5); c.lineTo(w1[0], oy + A * 1.25 + 5); c.stroke(); c.restore();
        kit.label(c, 'one wavelength λ', (w0[0] + w1[0]) / 2, oy + A * 1.25 + 14, { align: 'center', size: 11.5, color: C.muted });
      }
      kit.loop(draw, box.stage).start();
    }
  });

  /* ================================================================ electromagnetic spectrum */
  Hyper.sim('em1-spectrum', {
    title: 'The electromagnetic spectrum',
    blurb: `One ruler for all light, from gamma rays to long radio waves, on a logarithmic scale: each step is a factor of ten. Drag along the ruler, use the slider, or jump to an example. Wavelength, frequency and photon energy are tied together by $c = f\\lambda$ and $E = hf$.

- Visible light is a sliver: about 380–750 nm, less than a factor of two in wavelength.
- Photon energy rises as wavelength falls. Above roughly 10 eV (far ultraviolet) a single photon can ionize atoms — that is what makes X-rays and gamma rays dangerous.
- The boundaries between bands are conventions: X-rays and gamma rays overlap and are named by where they come from.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 420 });
      const LMIN = -14, LMAX = 4;   // log10 of wavelength in metres
      const EX = [['— jump to an example —', 0], ['AM radio, 1 MHz', 299.8], ['FM radio, 100 MHz', 2.998], ['Wi-Fi, 2.4 GHz', 0.1249], ['Microwave oven, 2.45 GHz', 0.1224],
        ['Car radar, 77 GHz', 3.89e-3], ['Cosmic microwave background (peak)', 1.063e-3], ['Your body\'s heat glow (peak)', 9.3e-6], ['TV remote, infrared LED', 9.4e-7],
        ['Red laser pointer', 6.5e-7], ['Sodium street lamp', 5.89e-7], ['Green laser pointer', 5.32e-7], ['Blu-ray laser', 4.05e-7], ['Germicidal UV lamp', 2.54e-7],
        ['Dental X-ray (60 keV)', 2.07e-11], ['Gamma ray from cobalt-60 (1.33 MeV)', 9.32e-13]];
      const ctl = kit.controls(box.side, [
        { id: 'lam', label: 'Wavelength', min: 1e-14, max: 1e4, value: 5.5e-7, log: true, fmt: v => eng(v, 'm') },
        { id: 'ex', type: 'select', label: 'Example', options: EX, value: 0 }
      ], (id, v) => { if (id === 'ex' && v > 0) ctl.set('lam', v); });
      const ro = kit.readout(box.side, [['band', 'Band'], ['lam', 'Wavelength λ'], ['f', 'Frequency f = c/λ'], ['eV', 'Photon energy'], ['J', 'Photon energy (J)'], ['size', 'About the size of']]);
      const V = ctl.values;
      const BANDS = [[-16, -11, 'gamma rays', 290], [-11, -8, 'X-rays', 250], [-8, Math.log10(380e-9), 'ultraviolet', 275], [Math.log10(380e-9), Math.log10(750e-9), 'visible', 0],
        [Math.log10(750e-9), -3, 'infrared', 10], [-3, 0, 'microwaves', 150], [0, 6, 'radio', 190]];
      const SIZES = [[1e-14, 'an atomic nucleus'], [1e-10, 'an atom'], [1e-9, 'a small molecule'], [1e-7, 'a virus'], [1e-6, 'a bacterium'], [1e-5, 'a red blood cell'],
        [1e-4, 'the width of a hair'], [1e-3, 'a grain of sand'], [1e-2, 'a fingernail'], [0.1, 'a hand'], [1, 'a person'], [10, 'a house'], [100, 'a football pitch'], [1000, 'a small town'], [1e4, 'a city']];
      const band = L => { for (const b of BANDS) if (L >= b[0] && L < b[1]) return b[2]; return L < -11 ? 'gamma rays' : 'radio'; };
      /* approximate colour of visible light */
      function rgb(nm) {
        let r = 0, g = 0, b = 0;
        if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
        else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
        const f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (750 - nm) / 50 : 1;
        const s = v => Math.round(255 * Math.pow(clamp(v * f, 0, 1), 0.8));
        return 'rgb(' + s(r) + ',' + s(g) + ',' + s(b) + ')';
      }
      let x0 = 30, x1 = 700;
      const X = L => x0 + (L - LMIN) / (LMAX - LMIN) * (x1 - x0);
      const Lof = x => LMIN + (x - x0) / (x1 - x0) * (LMAX - LMIN);
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        x0 = 30; x1 = W - 30;
        const lam = clamp(V.lam, 1e-14, 1e4), L = Math.log10(lam);
        const yb = Hh * 0.46, bh = 34;
        // bands
        for (const b of BANDS) {
          const a = X(Math.max(b[0], LMIN)), e = X(Math.min(b[1], LMAX));
          if (b[2] === 'visible') {
            const gr = c.createLinearGradient(a, 0, e, 0);
            for (let k = 0; k <= 8; k++) gr.addColorStop(k / 8, rgb(380 + 370 * k / 8));
            c.fillStyle = gr;
          } else c.fillStyle = kit.hue(b[3], 0.28);
          c.fillRect(a, yb, e - a, bh);
          const nm = b[2] === 'ultraviolet' && e - a < 80 ? 'UV' : b[2];
          if (b[2] !== 'visible') kit.label(c, nm, (a + e) / 2, yb + bh / 2, { align: 'center', size: 11.5, color: C.text });
        }
        kit.label(c, 'visible', X(Math.log10(560e-9)), yb - 9, { align: 'center', size: 11, color: C.muted });
        // wavelength ticks (above) and frequency ticks (below)
        c.font = '11px ' + fam(); c.textAlign = 'center'; c.fillStyle = C.faint; c.strokeStyle = C.grid; c.lineWidth = 1;
        const names = { '-12': '1 pm', '-9': '1 nm', '-6': '1 µm', '-3': '1 mm', '0': '1 m', '3': '1 km' };
        for (let e = LMIN; e <= LMAX; e++) {
          const x = X(e);
          c.beginPath(); c.moveTo(x + 0.5, yb - 4); c.lineTo(x + 0.5, yb + bh + 4); c.stroke();
          if (names[e]) c.fillText(names[e], x, yb - 24);
        }
        kit.label(c, 'wavelength', x0, yb - 40, { size: 11, color: C.muted });
        const fnames = { 3: '1 kHz', 6: '1 MHz', 9: '1 GHz', 12: '1 THz', 15: '1 PHz', 18: '10¹⁸ Hz', 21: '10²¹ Hz' };
        for (const k in fnames) {
          const Lf = Math.log10(CL) - Number(k);
          if (Lf < LMIN || Lf > LMAX) continue;
          const x = X(Lf);
          c.beginPath(); c.moveTo(x + 0.5, yb + bh); c.lineTo(x + 0.5, yb + bh + 8); c.stroke();
          c.fillText(fnames[k], x, yb + bh + 20);
        }
        kit.label(c, 'frequency', x0, yb + bh + 36, { size: 11, color: C.muted });
        // a sketch of the wave: shorter wavelength on the left
        const xc = X(L), per = 6 + 260 * (L - LMIN) / (LMAX - LMIN);
        const col = L > Math.log10(380e-9) && L < Math.log10(750e-9) ? rgb(lam * 1e9) : C.accent;
        c.save(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath();
        const wy = Hh * 0.16, amp = Hh * 0.07, span = Math.min(W * 0.42, 340);
        for (let i = 0; i <= 400; i++) {
          const x = xc - span / 2 + span * i / 400, y = wy + amp * Math.sin(2 * Math.PI * (x - xc) / per);
          i ? c.lineTo(clamp(x, 4, W - 4), y) : c.moveTo(clamp(x, 4, W - 4), y);
        }
        c.stroke(); c.restore();
        kit.label(c, 'sketch — not to scale', clamp(xc, 90, W - 90), wy - amp - 12, { align: 'center', size: 10.5, color: C.faint });
        // the cursor
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(xc, wy + amp + 6); c.lineTo(xc, yb + bh + 2); c.stroke(); c.restore();
        kit.dot(c, xc, yb + bh / 2, 6, C.text, C.bg2);
        // readouts
        const f = CL / lam, E = HP * f;
        ro.set('band', band(L));
        ro.set('lam', eng(lam, 'm'));
        ro.set('f', eng(f, 'Hz'));
        ro.set('eV', eng(E / QE, 'eV'));
        ro.set('J', Hyper.util.fmt(E, 3) + ' J');
        let best = SIZES[0];
        for (const s of SIZES) if (Math.abs(Math.log10(s[0]) - L) < Math.abs(Math.log10(best[0]) - L)) best = s;
        ro.set('size', best[1]);
        kit.label(c, eng(lam, 'm') + '  ·  ' + eng(f, 'Hz') + '  ·  ' + eng(E / QE, 'eV'), W / 2, Hh * 0.9, { align: 'center', size: 13, weight: 600, color: C.text });
      }
      kit.drag(st, {
        hit: p => (p.y > st.H * 0.3 && p.y < st.H * 0.8) ? 'ruler' : null,
        start: (t, p) => ctl.set('lam', Math.pow(10, clamp(Lof(p.x), LMIN, LMAX))),
        move: (t, p) => ctl.set('lam', Math.pow(10, clamp(Lof(p.x), LMIN, LMAX))),
        hover: true
      });
      kit.loop(draw, box.stage).start();
    }
  });
})();
