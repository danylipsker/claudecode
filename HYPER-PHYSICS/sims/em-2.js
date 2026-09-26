/* HYPER-PHYSICS · sims/em-2.js — simulations for Electricity & Magnetism II:
 * magnetism, electromagnetic induction and alternating current.
 * Everything sits inside one function so its helpers stay private to this file. */
(function () {
  'use strict';

  const MU0 = 1.25663706212e-6, QE = 1.602176634e-19, ME = 9.1093837015e-31, MP = 1.67262192369e-27;
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const sgn = x => x < 0 ? -1 : 1;
  const font = () => { try { return getComputedStyle(document.body).fontFamily || 'sans-serif'; } catch (e) { return 'sans-serif'; } };

  /* a value with an SI prefix: si(0.0021, 'T') -> "2.1 mT" */
  function si(v, unit, sig) {
    if (v == null || !Number.isFinite(v)) return '—';
    const a = Math.abs(v);
    if (a < 1e-15) return '0 ' + unit;
    const P = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
    for (const [f, p] of P) if (a >= f * 0.99995) return Hyper.util.fmt(v / f, sig || 3) + ' ' + p + unit;
    return Hyper.util.fmt(v / 1e-12, sig || 3) + ' p' + unit;
  }

  const speed = v => v >= 1000 ? Hyper.util.fmt(v / 1000, 3) + ' km/s' : Hyper.util.fmt(v, 3) + ' m/s';

  /* complete elliptic integrals K(m), E(m) with m = k², by the arithmetic–geometric mean */
  function ellipKE(m) {
    let a = 1, b = Math.sqrt(1 - m), c, sum = 0.5 * m, pw = 0.5;
    for (let i = 0; i < 20; i++) {
      c = (a - b) / 2;
      const an = (a + b) / 2, bn = Math.sqrt(a * b);
      a = an; b = bn; pw *= 2; sum += pw * c * c;
      if (Math.abs(c) < 1e-15) break;
    }
    const K = Math.PI / (2 * a);
    return [K, K * (1 - sum)];
  }
  /* Exact field of a circular loop (radius R, current I) at axial offset z and distance rho
     from its axis: [Bz, Brho, psi], where psi = rho·A_phi is the Stokes stream function
     (the flux through a coaxial circle of radius rho is 2π·psi; field lines are its level sets). */
  function loopField(R, I, z, rho) {
    const q = (R + rho) * (R + rho) + z * z;
    let m = 4 * R * rho / q;
    if (m > 1 - 1e-12) m = 1 - 1e-12;
    const KE = ellipKE(m), K = KE[0], E = KE[1];
    const d = Math.max((R - rho) * (R - rho) + z * z, 1e-10);
    const f = MU0 * I / (TAU * Math.sqrt(q));
    const Bz = f * (K + (R * R - rho * rho - z * z) / d * E);
    const Br = rho > 1e-9 ? f * z / rho * (-K + (R * R + rho * rho + z * z) / d * E) : 0;
    const k = Math.sqrt(m);
    const g = m < 1e-4 ? Math.PI * m * m / 32 * (1 + 0.75 * m) : ((1 - m / 2) * K - E);
    const psi = k > 0 ? MU0 * I / (Math.PI * k) * Math.sqrt(R * rho) * g : 0;
    return [Bz, Br, psi];
  }

  /* a wire seen end-on: ⊙ current towards the viewer, ⊗ away */
  function currentMark(c, x, y, r, out, C) {
    c.save();
    c.lineWidth = 1.6; c.strokeStyle = C.text; c.fillStyle = C.surface;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
    if (out) { c.fillStyle = C.text; c.beginPath(); c.arc(x, y, Math.max(1.5, r * 0.28), 0, TAU); c.fill(); }
    else { const d = r * 0.5; c.beginPath(); c.moveTo(x - d, y - d); c.lineTo(x + d, y + d); c.moveTo(x + d, y - d); c.lineTo(x - d, y + d); c.stroke(); }
    c.restore();
  }
  /* a compass needle centred on (x, y), north end towards screen angle a */
  function needle(c, x, y, a, len, C, alpha) {
    const ux = Math.cos(a), uy = Math.sin(a), w = len * 0.2;
    c.save(); c.globalAlpha = alpha == null ? 1 : alpha;
    c.fillStyle = C.bad;
    c.beginPath(); c.moveTo(x + ux * len / 2, y + uy * len / 2); c.lineTo(x - uy * w, y + ux * w); c.lineTo(x + uy * w, y - ux * w); c.closePath(); c.fill();
    c.fillStyle = C.muted;
    c.beginPath(); c.moveTo(x - ux * len / 2, y - uy * len / 2); c.lineTo(x - uy * w, y + ux * w); c.lineTo(x + uy * w, y - ux * w); c.closePath(); c.fill();
    c.restore();
  }
  function scaleBar(c, x, y, pxPerM, C, maxPx) {
    const span = Hyper.niceStep((maxPx || 120) / pxPerM, 1);
    const w = span * pxPerM;
    c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y - 4); c.stroke(); c.restore();
    const lab = span >= 1 ? Hyper.util.fmt(span, 3) + ' m' : span >= 0.01 ? Hyper.util.fmt(span * 100, 3) + ' cm' : span >= 1e-3 ? Hyper.util.fmt(span * 1000, 3) + ' mm' : si(span, 'm');
    return { w, lab };
  }

  /* ==================================================================== field mapper */
  Hyper.sim('em2-field-map', {
    title: 'Magnetic field mapper',
    blurb: `Pick a source and drag the big compass around. The small needles show the field's direction everywhere (red end = north); the lines are field lines, closer together where the field is stronger. The readout checks the computed field against the formula for that source.

- **Straight wire:** the lines are circles. Move the compass twice as far out and the field halves.
- **Two wires:** make the currents flow the same way, then opposite ways. Watch the field between the wires and the force arrows.
- **Loop and solenoid:** the picture is a slice through the coil's axis; ⊙ is current coming towards you, ⊗ going away. Inside a solenoid the field is nearly uniform.
- **Bar magnet:** compare it with the solenoid. The magnet is computed as an equivalent solenoid, and the two fields have the same shape.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const SOURCES = [['Bar magnet', 'magnet'], ['Long straight wire', 'wire'], ['Two parallel wires', 'pair'], ['Current loop (slice through its axis)', 'loop'], ['Solenoid (slice through its axis)', 'solenoid']];
      const first = params && SOURCES.some(s => s[1] === params.source) ? params.source : 'magnet';
      let pol = 1, dirty = true, need = true, frame = 0;
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'Source', options: SOURCES, value: first },
        { id: 'I', label: 'Current', min: -20, max: 20, step: 0.5, value: 10, unit: 'A' },
        { id: 'I2', label: 'Current in wire 2', min: -20, max: 20, step: 0.5, value: 10, unit: 'A' },
        { id: 'd', label: 'Separation', min: 2, max: 20, step: 0.5, value: 8, unit: 'cm' },
        { id: 'lines', type: 'check', label: 'Field lines', value: true },
        { id: 'needles', type: 'check', label: 'Compass grid', value: true },
        { type: 'buttons', items: [{ id: 'flip', label: 'Reverse' }, { id: 'centre', label: 'Compass to centre' }] }
      ], (id) => {
        if (id === 'flip') { if (V.src === 'magnet') pol = -pol; else ctl.set('I', -V.I); }
        if (id === 'src' || id === 'centre') resetProbe(id === 'centre');
        if (id === 'src') showRows();
        dirty = true; need = true;
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['B', '|B| at the compass'], ['dir', 'Direction'], ['earth', 'Compared with Earth (50 µT)'], ['chk', 'Formula']]);
      const V = ctl.values;
      function showRows() {
        const vis = { I: V.src !== 'magnet', I2: V.src === 'pair', d: V.src === 'pair' };
        for (const k in vis) if (ctl.rows[k] && ctl.rows[k].row) ctl.rows[k].row.style.display = vis[k] ? '' : 'none';
      }
      showRows();

      /* geometry, in metres; the view is 40 cm wide and centred on the source */
      const VIEW = 0.40, SOL = { L: 0.20, R: 0.04, N: 20 }, LOOPR = 0.06, MAG = { L: 0.08, R: 0.018, n: 16, Br: 1.2 };
      const s = () => st.W / VIEW;
      const X = x => st.W / 2 + x * s(), Y = y => st.H / 2 - y * s();
      const wx = px => (px - st.W / 2) / s(), wy = py => (st.H / 2 - py) / s();
      const axi = () => V.src === 'loop' || V.src === 'solenoid' || V.src === 'magnet';
      function loops(unit) {
        const out = [];
        if (V.src === 'loop') out.push({ x: 0, R: LOOPR, I: unit ? 1 : V.I });
        else if (V.src === 'solenoid') for (let k = 0; k < SOL.N; k++) out.push({ x: -SOL.L / 2 + (k + 0.5) * SOL.L / SOL.N, R: SOL.R, I: unit ? 1 : V.I });
        else if (V.src === 'magnet') {
          const Ieq = unit ? 1 : pol * MAG.Br / MU0 * MAG.L / MAG.n;     // surface current of the magnetisation
          for (let k = 0; k < MAG.n; k++) out.push({ x: -MAG.L / 2 + (k + 0.5) * MAG.L / MAG.n, R: MAG.R, I: Ieq });
        }
        return out;
      }
      function wires() {
        if (V.src === 'wire') return [{ x: 0, y: 0, I: V.I }];
        if (V.src === 'pair') { const d = V.d / 100; return [{ x: -d / 2, y: 0, I: V.I }, { x: d / 2, y: 0, I: V.I2 }]; }
        return [];
      }
      function field(x, y, L, W) {
        let bx = 0, by = 0;
        if (L.length) {
          const rho = Math.abs(y), sy = y < 0 ? -1 : 1;
          for (const o of L) { const f = loopField(o.R, o.I, x - o.x, rho); bx += f[0]; by += f[1] * sy; }
        }
        for (const w of W) {
          const dx = x - w.x, dy = y - w.y, r2 = Math.max(dx * dx + dy * dy, 1e-6), k = MU0 * w.I / (TAU * r2);
          bx -= k * dy; by += k * dx;
        }
        return [bx, by];
      }
      function psi(x, y, L, W) {
        let p = 0;
        if (L.length) { const rho = Math.abs(y); for (const o of L) p += loopField(o.R, o.I, x - o.x, rho)[2]; }
        for (const w of W) p -= MU0 * w.I / TAU * Math.log(Math.max(Math.hypot(x - w.x, y - w.y), 0.012));
        return Number.isFinite(p) ? p : 0;
      }
      /* field lines: contours of psi by marching squares, in canvas pixels */
      function contour(fn, levels) {
        const cell = 6, nx = Math.ceil(st.W / cell) + 1, ny = Math.ceil(st.H / cell) + 1;
        const P = new Float64Array(nx * ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) P[j * nx + i] = fn(wx(i * cell), wy(j * cell));
        const segs = [];
        for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
          const a = P[j * nx + i], b = P[j * nx + i + 1], c = P[(j + 1) * nx + i + 1], d = P[(j + 1) * nx + i];
          const lo = Math.min(a, b, c, d), hi = Math.max(a, b, c, d);
          if (!(hi > lo)) continue;
          const x0 = i * cell, y0 = j * cell;
          for (const L of levels) {
            if (L <= lo || L >= hi) continue;
            const pts = [];
            const edge = (va, vb, xa, ya, xb, yb) => { if ((va - L) * (vb - L) < 0) { const t = (L - va) / (vb - va); pts.push(xa + (xb - xa) * t, ya + (yb - ya) * t); } };
            edge(a, b, x0, y0, x0 + cell, y0);
            edge(b, c, x0 + cell, y0, x0 + cell, y0 + cell);
            edge(c, d, x0 + cell, y0 + cell, x0, y0 + cell);
            edge(d, a, x0, y0 + cell, x0, y0);
            if (pts.length >= 4) segs.push(pts[0], pts[1], pts[2], pts[3]);
            if (pts.length === 8) segs.push(pts[4], pts[5], pts[6], pts[7]);
          }
        }
        return segs;
      }

      let segs = [], axiKey = '', axiSegs = [], chev = [], ndl = [], active = false;
      function rebuild() {
        const L = loops(false), W = wires();
        active = axi() ? L.length && L[0].I !== 0 : W.some(w => w.I !== 0);
        // field lines
        if (axi()) {
          const key = V.src + '|' + st.W + '|' + st.H;
          if (key !== axiKey) {
            const U = loops(true), Rref = V.src === 'loop' ? LOOPR : V.src === 'solenoid' ? SOL.R : MAG.R;
            const levels = [];
            for (let k = 1; k <= 6; k++) levels.push(psi(0, (k - 0.5) / 6 * 0.95 * Rref, U, []));
            axiSegs = contour((x, y) => psi(x, y, U, []), levels);
            axiKey = key;
          }
          segs = axiSegs;
        } else if (active) {
          let dpsi = MU0 / TAU * 10 * Math.log(1.3);
          let lo = Infinity, hi = -Infinity;
          const probe = (x, y) => { const p = psi(x, y, [], W); lo = Math.min(lo, p); hi = Math.max(hi, p); return p; };
          for (let i = 0; i <= 40; i++) for (let j = 0; j <= 24; j++) probe(wx(i / 40 * st.W), wy(j / 24 * st.H));
          for (const w of W) { probe(w.x + 0.013, w.y); probe(w.x - 0.013, w.y); }
          while ((hi - lo) / dpsi > 70) dpsi *= 1.5;
          const levels = [];
          for (let k = Math.ceil(lo / dpsi); k * dpsi < hi; k++) levels.push(k * dpsi);
          segs = contour((x, y) => psi(x, y, [], W), levels);
        } else segs = [];
        // arrowheads along the lines
        chev = [];
        if (active) for (let k = 0; k < segs.length; k += 4 * 37) {
          const mx = (segs[k] + segs[k + 2]) / 2, my = (segs[k + 1] + segs[k + 3]) / 2;
          const b = field(wx(mx), wy(my), L, W);
          if (Math.hypot(b[0], b[1]) > 0) chev.push([mx, my, Math.atan2(-b[1], b[0])]);
        }
        // compass grid
        ndl = [];
        const sp = 34, marks = sourcePoints();
        for (let py = sp / 2; py < st.H; py += sp) for (let px = sp / 2; px < st.W; px += sp) {
          const x = wx(px), y = wy(py);
          if (marks.some(m => Math.hypot(m[0] - px, m[1] - py) < 13)) continue;
          if (V.src === 'magnet' && Math.abs(x) < MAG.L / 2 + 0.004 && Math.abs(y) < MAG.R + 0.004) continue;
          const b = field(x, y, L, W), mag = Math.hypot(b[0], b[1]);
          if (mag > 0 && Number.isFinite(mag)) ndl.push([px, py, Math.atan2(-b[1], b[0]), mag]);
        }
        const mags = ndl.map(n => n[3]).sort((a, b) => a - b);
        const med = mags.length ? mags[mags.length >> 1] : 1;
        for (const n of ndl) n[4] = clamp(0.45 + 0.28 * Math.log10(n[3] / med), 0.12, 1);
        dirty = false;
      }
      function sourcePoints() {
        const pts = [];
        if (V.src === 'wire' || V.src === 'pair') for (const w of wires()) pts.push([X(w.x), Y(w.y)]);
        if (V.src === 'loop' || V.src === 'solenoid') for (const o of loops(true)) { pts.push([X(o.x), Y(o.R)]); pts.push([X(o.x), Y(-o.R)]); }
        return pts;
      }

      /* the big compass */
      const probe = { x: 0, y: 0 };
      function resetProbe(centre) {
        const P = { magnet: [0.1, 0.03], wire: [0.06, 0], pair: [0, 0.05], loop: [0, 0], solenoid: [0, 0] }[V.src] || [0, 0];
        probe.x = centre ? 0 : P[0]; probe.y = centre ? 0 : P[1];
      }
      resetProbe();
      kit.drag(st, {
        hit: () => 'probe',
        move: (t, p) => { probe.x = clamp(wx(p.x), -VIEW / 2, VIEW / 2); probe.y = clamp(wy(p.y), -st.H / s() / 2, st.H / s() / 2); need = true; if (!loop.running) loop.once(); },
        hover: true
      });

      function draw() {
        if (dirty) rebuild();
        const C = kit.colors(), c = st.begin(), f = font();
        const L = loops(false), W = wires();
        // the magnet's body goes under the field lines, so the lines can be seen through it
        if (V.src === 'magnet') {
          const x0 = X(-MAG.L / 2), x1 = X(MAG.L / 2), xm = X(0), y0 = Y(MAG.R), y1 = Y(-MAG.R);
          c.save(); c.globalAlpha = 0.8;
          c.fillStyle = pol > 0 ? C.accent : C.bad; c.fillRect(x0, y0, xm - x0, y1 - y0);
          c.fillStyle = pol > 0 ? C.bad : C.accent; c.fillRect(xm, y0, x1 - xm, y1 - y0);
          c.restore();
          kit.label(c, pol > 0 ? 'S' : 'N', (x0 + xm) / 2, (y0 + y1) / 2, { size: 15, weight: 700, color: '#fff', align: 'center' });
          kit.label(c, pol > 0 ? 'N' : 'S', (xm + x1) / 2, (y0 + y1) / 2, { size: 15, weight: 700, color: '#fff', align: 'center' });
        }
        if (V.src === 'solenoid') {
          c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.lineWidth = 1;
          c.strokeRect(X(-SOL.L / 2) - 6, Y(SOL.R) - 6, SOL.L * s() + 12, 2 * SOL.R * s() + 12); c.restore();
        }
        if (V.src === 'loop') {
          c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.ellipse(X(0), Y(0), 10, LOOPR * s(), 0, 0, TAU); c.stroke(); c.restore();
        }
        // field lines
        if (V.lines && active) {
          c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.6; c.lineWidth = 1.3; c.beginPath();
          for (let k = 0; k < segs.length; k += 4) { c.moveTo(segs[k], segs[k + 1]); c.lineTo(segs[k + 2], segs[k + 3]); }
          c.stroke();
          c.fillStyle = C.accent; c.globalAlpha = 0.85;
          for (const [x, y, a] of chev) {
            c.beginPath(); c.moveTo(x + 6 * Math.cos(a), y + 6 * Math.sin(a));
            c.lineTo(x + 4 * Math.cos(a + 2.5), y + 4 * Math.sin(a + 2.5)); c.lineTo(x + 4 * Math.cos(a - 2.5), y + 4 * Math.sin(a - 2.5)); c.closePath(); c.fill();
          }
          c.restore();
        }
        if (V.needles && active) for (const n of ndl) needle(c, n[0], n[1], n[2], 14, C, n[4]);
        // the sources
        if (V.src === 'wire' || V.src === 'pair') {
          W.forEach((w, i) => {
            currentMark(c, X(w.x), Y(w.y), 9, w.I >= 0, C);
            kit.label(c, (V.src === 'pair' ? (i ? 'I₂ ' : 'I₁ ') : 'I ') + Hyper.util.fmt(Math.abs(w.I), 3) + ' A', X(w.x), Y(w.y) + 22, { size: 11.5, align: 'center', color: C.text2, bg: C.surface });
          });
          if (V.src === 'pair' && V.I !== 0 && V.I2 !== 0) {
            const FL = MU0 * V.I * V.I2 / (TAU * V.d / 100);       // > 0: attraction
            const len = clamp(70 * Math.sqrt(Math.abs(FL) / 4e-3), 10, 70), dirn = FL > 0 ? 1 : -1;
            kit.arrow(c, X(W[0].x), Y(0) - 26, X(W[0].x) + dirn * len, Y(0) - 26, C.warn, 2.4);
            kit.arrow(c, X(W[1].x), Y(0) - 26, X(W[1].x) - dirn * len, Y(0) - 26, C.warn, 2.4);
            kit.label(c, FL > 0 ? 'attract' : 'repel', X(0), Y(0) - 44, { size: 11.5, align: 'center', color: C.warn });
          }
        } else if (V.src === 'loop' || V.src === 'solenoid') {
          const r = V.src === 'loop' ? 9 : 5.5;
          for (const o of L) { currentMark(c, X(o.x), Y(o.R), r, o.I >= 0, C); currentMark(c, X(o.x), Y(-o.R), r, o.I < 0, C); }
        }
        // the compass the reader drags
        const B = field(probe.x, probe.y, L, W), Bm = Math.hypot(B[0], B[1]);
        const px = X(probe.x), py = Y(probe.y);
        c.save(); c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath(); c.arc(px, py, 18, 0, TAU); c.fill(); c.stroke(); c.restore();
        if (Bm > 0 && Number.isFinite(Bm)) needle(c, px, py, Math.atan2(-B[1], B[0]), 30, C, 1);
        kit.dot(c, px, py, 2.5, C.text);
        kit.label(c, si(Bm, 'T'), px + 24, py - 16, { size: 12, color: C.text, bg: C.surface });
        // scale bar
        const sb = scaleBar(c, 14, st.H - 12, s(), C, 110);
        kit.label(c, sb.lab, 14 + sb.w / 2, st.H - 22, { size: 11, align: 'center', color: C.muted });
        // readout
        ro.set('B', si(Bm, 'T'));
        const deg = Math.atan2(B[1], B[0]) * 180 / Math.PI;
        ro.set('dir', Bm > 0 ? Math.round(deg) + '° from →' : '—');
        ro.set('earth', Bm > 0 ? Hyper.util.fmt(Bm / 5e-5, 3) + ' ×' : '0');
        let chk = '';
        if (V.src === 'wire') { const r = Math.max(Math.hypot(probe.x, probe.y), 1e-3); chk = 'r = ' + Hyper.util.fmt(r * 100, 3) + ' cm: μ₀I/2πr = ' + si(MU0 * Math.abs(V.I) / (TAU * r), 'T'); }
        else if (V.src === 'pair') { const FL = MU0 * V.I * V.I2 / (TAU * V.d / 100); chk = 'F/L = μ₀I₁I₂/2πd = ' + si(Math.abs(FL), 'N/m') + (FL > 0 ? ', attractive' : FL < 0 ? ', repulsive' : ''); }
        else if (V.src === 'loop') chk = 'centre: μ₀I/2R = ' + si(MU0 * Math.abs(V.I) / (2 * LOOPR), 'T');
        else if (V.src === 'solenoid') chk = 'long-solenoid μ₀nI = ' + si(MU0 * SOL.N / SOL.L * Math.abs(V.I), 'T') + ' (n = ' + SOL.N / SOL.L + '/m)';
        else chk = 'NdFeB, remanence ' + MAG.Br + ' T; ' + (pol > 0 ? 'N pole on the right' : 'N pole on the left');
        ro.set('chk', chk);
      }
      const loop = kit.loop((dt) => {
        frame++;
        if (need || dirty || dt === 0 || frame % 30 === 0) { need = false; draw(); }
      }, box.stage).start();
      st.onResize(() => { dirty = true; axiKey = ''; loop.once(); });
    }
  });

  /* ==================================================================== charged particle */
  Hyper.sim('em2-charged-particle', {
    title: 'Charged particle in a magnetic field',
    blurb: `A particle is fired into a uniform magnetic field and its path is worked out step by step from $\\vec F = q(\\vec E + \\vec v\\times\\vec B)$. The readout gives the formula values; time runs in slow motion.

- Change the **speed**: the circle grows, but the time per turn does not change.
- Switch between **proton** and **electron**: opposite senses of rotation, and very different sizes and periods.
- Lower **Angle to B** and choose the **side view**: the circle becomes a helix.
- Add an **electric field**. At the value in the readout the particle flies straight — a velocity selector. Other values make it drift sideways in loops, whatever its charge.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58 });
      const PARTS = {
        p: { name: 'proton', q: QE, m: MP, v: 200, B: 20 },
        e: { name: 'electron', q: -QE, m: ME, v: 2000, B: 0.1 },
        pos: { name: 'positron', q: QE, m: ME, v: 2000, B: 0.1 },
        a: { name: 'alpha particle', q: 2 * QE, m: 6.644657e-27, v: 200, B: 20 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'Particle', options: [['Proton', 'p'], ['Electron', 'e'], ['Positron', 'pos'], ['Alpha particle', 'a']], value: 'p' },
        { id: 'v', label: 'Speed', min: 10, max: 10000, value: 200, unit: 'km/s', log: true, sig: 3 },
        { id: 'B', label: 'Magnetic field', min: 0.01, max: 100, value: 20, unit: 'mT', log: true, sig: 3 },
        { id: 'Bdir', type: 'select', label: 'Field direction', options: [['Into the screen ⊗', -1], ['Out of the screen ⊙', 1]], value: -1 },
        { id: 'al', label: 'Angle between v and B', min: 0, max: 90, step: 1, value: 90, unit: '°' },
        { id: 'E', label: 'Electric field (up the screen)', min: -5000, max: 5000, step: 10, value: 0, unit: 'V/m' },
        { id: 'view', type: 'select', label: 'View', options: [['Looking along B', 'top'], ['Side view (B across the screen)', 'side']], value: 'top' },
        { type: 'buttons', items: [{ id: 'go', label: 'Launch', primary: true }] }
      ], (id) => {
        if (id === 'part') { const P = PARTS[V.part]; ctl.set('v', P.v); ctl.set('B', P.B); ctl.set('E', 0); fit(true); }
        if (id === 'go' || id === 'part' || id === 'al' || id === 'view') launch();
        else if (id === 'v' || id === 'B' || id === 'Bdir' || id === 'E') { fit(false); if (id !== 'E') launch(); }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['r', 'Radius mv⊥/|q|B'], ['T', 'Period 2πm/|q|B'], ['p', 'Pitch v∥T'], ['sel', 'E for a straight path'], ['ts', 'Slow motion']]);
      const V = ctl.values;
      const P = () => PARTS[V.part] || PARTS.p;
      const Bz = () => V.Bdir * V.B * 1e-3;
      const period = () => TAU * P().m / (Math.abs(P().q) * V.B * 1e-3);
      const rFull = () => P().m * V.v * 1e3 / (Math.abs(P().q) * V.B * 1e-3);

      let pxm = 1, ts = 1;             // pixels per metre; simulated seconds per real second
      function fit(force) {
        const r = rFull(), T = period();
        const rp = r * pxm;
        if (force || !(rp > 0.08 * st.H && rp < 0.48 * st.H)) pxm = 0.45 * st.H / (2 * Math.max(r, 1e-12));
        const turn = T / ts;             // real seconds per turn
        if (force || !(turn > 0.4 && turn < 12)) ts = T / 3;
      }
      let pos = [0, 0, 0], vel = [0, 0, 0], trail = [], out = 0;
      function launch() {
        const Pp = P(), al = V.al * Math.PI / 180, v = V.v * 1e3;
        const vp = v * Math.sin(al), vz = v * Math.cos(al) * V.Bdir;     // the part along B
        const rot = sgn(-Pp.q * Bz());                  // +1: anticlockwise seen from the viewer
        const r = Pp.m * vp / (Math.abs(Pp.q) * V.B * 1e-3);
        const z0 = V.view === 'side' ? -(st.W / 2 - 40) / pxm * V.Bdir : 0;
        pos = [0, -rot * r, z0]; vel = [vp, 0, vz]; trail = []; out = 0;
      }
      fit(true); launch();

      /* Boris push: exact rotation in B, half kicks from E */
      function push(dt) {
        const Pp = P(), qm = Pp.q / Pp.m, b = Bz(), E = V.E;
        const h = qm * dt / 2;
        const vx = vel[0], vy = vel[1] + h * E, vz = vel[2];
        const t = h * b, s2 = 2 * t / (1 + t * t);
        const px = vx + vy * t, py = vy - vx * t;           // v' = v⁻ + v⁻ × (0,0,t)
        const nx = vx + py * s2, ny = vy - px * s2;         // v⁺ = v⁻ + v' × (0,0,s)
        vel = [nx, ny + h * E, vz];
        pos = [pos[0] + vel[0] * dt, pos[1] + vel[1] * dt, pos[2] + vel[2] * dt];
      }
      const scr = p => V.view === 'side' ? [st.W / 2 + p[2] * V.Bdir * pxm, st.H / 2 - p[1] * pxm] : [st.W / 2 + p[0] * pxm, st.H / 2 - p[1] * pxm];

      function step(dt) {
        const T = period();
        const simDt = Math.min(dt, 0.05) * ts;
        const n = Math.min(4000, Math.ceil(simDt / (T / 120)));
        const h = simDt / Math.max(n, 1);
        for (let i = 0; i < n; i++) push(h);
        if (n) { trail.push(pos.slice()); if (trail.length > 1600) trail.shift(); }
        const [sx, sy] = scr(pos);
        if (sx < -60 || sx > st.W + 60 || sy < -60 || sy > st.H + 60 || !Number.isFinite(sx + sy)) { out += dt; if (out > 0.6) launch(); }
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), f = font();
        // the field
        c.save(); c.globalAlpha = 0.45;
        if (V.view === 'top') {
          for (let y = 25; y < st.H; y += 50) for (let x = 25; x < st.W; x += 50) {
            c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, 5, 0, TAU); c.stroke();
            if (V.Bdir > 0) { c.fillStyle = C.faint; c.beginPath(); c.arc(x, y, 1.6, 0, TAU); c.fill(); }
            else { c.beginPath(); c.moveTo(x - 3, y - 3); c.lineTo(x + 3, y + 3); c.moveTo(x + 3, y - 3); c.lineTo(x - 3, y + 3); c.stroke(); }
          }
        } else {
          for (let y = 30; y < st.H; y += 60) for (let x = 40; x < st.W; x += 110) kit.arrow(c, x - 18, y, x + 18, y, C.faint, 1.2);
        }
        c.restore();
        kit.label(c, 'B ' + (V.view === 'top' ? (V.Bdir > 0 ? 'out of the screen' : 'into the screen') : '→') + ' ' + Hyper.util.fmt(V.B, 3) + ' mT', 10, 14, { size: 11.5, color: C.muted, bg: C.bg2 });
        if (V.E !== 0) {
          const d = V.E > 0 ? -1 : 1;
          for (let y = 60; y < st.H - 30; y += 90) kit.arrow(c, st.W - 22, y - 16 * d, st.W - 22, y + 16 * d, C.warn, 1.6);
          kit.label(c, 'E ' + Hyper.util.fmt(Math.abs(V.E), 3) + ' V/m', st.W - 34, 14, { size: 11.5, color: C.warn, align: 'right', bg: C.bg2 });
        }
        // trail
        const col = P().q > 0 ? C.bad : C.accent;
        if (trail.length > 1) {
          c.save(); c.strokeStyle = col; c.lineWidth = 1.8; c.globalAlpha = 0.75; c.beginPath();
          trail.forEach((p, i) => { const q = scr(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); });
          c.stroke(); c.restore();
        }
        // particle with velocity and force arrows (in the plane of the view)
        const [x, y] = scr(pos);
        if (Number.isFinite(x + y)) {
          const Pp = P(), b = Bz();
          const vv = V.view === 'top' ? [vel[0], vel[1]] : [vel[2] * V.Bdir, vel[1]];
          const vm = Math.hypot(vv[0], vv[1]);
          if (vm > 0) kit.arrow(c, x, y, x + 34 * vv[0] / vm, y - 34 * vv[1] / vm, C.ok, 2);
          // magnetic force q v × B, with B along z
          const fx = Pp.q * vel[1] * b, fy = -Pp.q * vel[0] * b;
          const fm = Math.hypot(fx, fy), fe = Math.abs(Pp.q * V.E), fr = Math.max(fm, fe);
          if (V.view === 'top' && fm > 0) kit.arrow(c, x, y, x + 34 * fx / fr, y - 34 * fy / fr, C.warn, 2);
          if (V.view === 'top' && fe > 0) kit.arrow(c, x, y, x, y - 34 * Pp.q * V.E / fr, C.series[3], 2);
          kit.dot(c, x, y, 6, col, C.bg2);
          kit.label(c, (Pp.q > 0 ? '+' : '−'), x, y - 13, { size: 12, weight: 700, align: 'center', color: col });
        }
        // scale bar and key
        const sb = scaleBar(c, 14, st.H - 12, pxm, C, 110);
        kit.label(c, sb.lab, 14 + sb.w / 2, st.H - 22, { size: 11, align: 'center', color: C.muted });
        if (V.view === 'top') kit.label(c, 'green: velocity   orange: magnetic force' + (V.E ? '   pink: electric force' : ''), st.W - 10, st.H - 12, { size: 11, align: 'right', color: C.muted });
        // readout
        const Pp = P(), al = V.al * Math.PI / 180, T = period(), v = V.v * 1e3;
        ro.set('r', si(Pp.m * v * Math.sin(al) / (Math.abs(Pp.q) * V.B * 1e-3), 'm'));
        ro.set('T', si(T, 's') + '  (f = ' + si(1 / T, 'Hz') + ')');
        ro.set('p', si(v * Math.cos(al) * T, 'm'));
        ro.set('sel', Hyper.util.fmt(Bz() * v * Math.sin(al), 3) + ' V/m' + (V.E !== 0 ? ';  drift E/B = ' + speed(Math.abs(V.E) / (V.B * 1e-3)) : ''));
        ro.set('ts', '1 s on screen = ' + si(ts, 's'));
      }
      const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => { fit(true); launch(); loop.once(); });
    }
  });

  /* ==================================================================== DC motor */
  Hyper.sim('em2-dc-motor', {
    title: 'DC motor',
    blurb: `A coil of 100 turns (6 cm × 10 cm) turns between the poles of a magnet, seen end-on. The orange arrows are the forces on the two sides of the coil; μ is its magnetic moment. The graph shows the torque at each angle — at start-up (dashed) and at the present speed.

- Untick **Commutator**: the torque reverses every half turn and the coil just rocks to a stop with μ along B.
- With the commutator, the torque never reverses, but it drops to zero twice a turn: the dead spots. Stop the motor at a dead spot (voltage to zero), then turn the voltage back up.
- Watch the current as the motor speeds up: the back EMF eats into the supply voltage. Add load and the motor slows until its torque matches.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 220, maxH: 380 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '6px 10px 10px';
      box.stage.appendChild(graphBox);
      const N = 100, A = 0.06 * 0.10, SIDE = 0.10, R = 3, J = 0.01, FRIC = 0.002;
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Supply voltage', min: 0, max: 12, step: 0.5, value: 6, unit: 'V' },
        { id: 'B', label: 'Magnetic field', min: 0.1, max: 1, step: 0.05, value: 0.5, unit: 'T' },
        { id: 'load', label: 'Load torque', min: 0, max: 0.5, step: 0.01, value: 0.05, unit: 'N·m' },
        { id: 'comm', type: 'check', label: 'Commutator (split ring)', value: true },
        { id: 'slow', type: 'check', label: 'Slow motion (×1/5)', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Stop and reset' }] }
      ], (id) => {
        if (id === 'reset') { phi = 70 * Math.PI / 180; om = 0; avg.I = avg.tau = avg.P = avg.Pin = 0; }
        setCurves();
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Speed'], ['I', 'Current (average size)'], ['emf', 'Back EMF (average)'], ['tau', 'Motor torque (average)'], ['P', 'Power in → out']]);
      const V = ctl.values;
      const plot = kit.plot(graphBox, { x: { label: 'coil angle: its normal from B (°)', min: 0, max: 360 }, y: { label: 'torque (N·m)' }, legend: true }, 170);

      let phi = 70 * Math.PI / 180, om = 0, I = 0, tauM = 0;
      const avg = { I: 0, tau: 0, P: 0, Pin: 0, emf: 0 };
      const NBA = () => N * V.B * A;
      /* current and motor torque at angle p and speed w */
      function electrics(p, w) {
        const s = Math.sin(p);
        const Vapp = V.comm ? -V.V * (s >= 0 ? 1 : -1) : -V.V;
        const i = (Vapp + NBA() * w * s) / R;
        return [i, -NBA() * i * s];
      }
      function setCurves() {
        const a = [], b = [];
        for (let k = 0; k <= 180; k++) {
          const p = k * TAU / 180;
          a.push([k * 2, electrics(p, 0)[1]]);
          b.push([k * 2, electrics(p, om)[1]]);
        }
        const peak = Math.max(NBA() * Math.max(V.V, 0.5) / R, V.load) * 1.15;
        plot.set({ series: [{ pts: a, label: 'at start-up', dash: [6, 4], width: 1.6 }, { pts: b, label: 'at the present speed' }],
                   y: { label: 'torque (N·m)', min: V.comm ? -0.15 * peak : -peak, max: peak }, hlines: [{ y: V.load, label: 'load' }] });
      }
      setCurves();
      function step(dt) {
        const T = Math.min(dt, 0.05) * (V.slow ? 0.2 : 1);
        const n = Math.max(1, Math.ceil(T / 2e-4)), h = T / n;
        for (let k = 0; k < n; k++) {
          const e = electrics(phi, om);
          I = e[0]; tauM = e[1];
          let net;
          if (Math.abs(om) < 1e-3 && Math.abs(tauM) <= V.load) { om = 0; net = 0; }
          else net = tauM - V.load * (Math.abs(om) > 1e-3 ? sgn(om) : sgn(tauM)) - FRIC * om;
          om += net / J * h;
          phi = (phi + om * h) % TAU; if (phi < 0) phi += TAU;
          const a = Math.min(1, h / 0.3);
          avg.I += (Math.abs(I) - avg.I) * a; avg.tau += (tauM - avg.tau) * a;
          avg.emf += (NBA() * Math.abs(om * Math.sin(phi)) - avg.emf) * a;
          avg.P += (V.load * Math.abs(om) - avg.P) * a; avg.Pin += (V.V * Math.abs(I) - avg.Pin) * a;
        }
      }
      let curveClock = 0;
      function draw(dt) {
        const C = kit.colors(), c = st.begin(), f = font();
        const cx = st.W * 0.5, cy = st.H * 0.52, Rc = Math.min(st.H * 0.32, st.W * 0.2);
        poles(c, kit, C, cx, cy, Rc, V.B);
        // commutator (or slip ring) and brushes at the centre
        const rr = 13;
        c.save(); c.lineWidth = 5; c.lineCap = 'butt';
        if (V.comm) {
          const g = 0.35;
          c.strokeStyle = C.warn; c.beginPath(); c.arc(cx, cy, rr, -phi + g, -phi + Math.PI - g); c.stroke();
          c.strokeStyle = C.series[4] || C.warn; c.beginPath(); c.arc(cx, cy, rr, -phi + Math.PI + g, -phi + TAU - g); c.stroke();
        } else { c.strokeStyle = C.warn; c.beginPath(); c.arc(cx, cy, rr, 0, TAU); c.stroke(); }
        c.restore();
        c.fillStyle = C.text2; c.fillRect(cx - rr - 12, cy - 4, 9, 8); c.fillRect(cx + rr + 3, cy - 4, 9, 8);
        // the coil, edge-on: t = direction along the coil in the view, n = its normal
        const tx = -Math.sin(phi), ty = Math.cos(phi), nx = Math.cos(phi), ny = Math.sin(phi);
        const ax = cx + tx * Rc, ay = cy - ty * Rc, bx = cx - tx * Rc, by = cy + ty * Rc;
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 4; c.globalAlpha = 0.7; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); c.restore();
        currentMark(c, ax, ay, 10, I >= 0, C);
        currentMark(c, bx, by, 10, I < 0, C);
        // forces on the two long sides: F = N I L B, up on the side where the current comes out
        const F = N * I * SIDE * V.B, Fref = N * Math.max(V.V, 1) / R * SIDE * V.B;
        const len = clamp(60 * F / Fref, -80, 80);
        if (Math.abs(len) > 1) { kit.arrow(c, ax, ay, ax, ay - len, C.warn, 2.6); kit.arrow(c, bx, by, bx, by + len, C.warn, 2.6); }
        // magnetic moment
        const mlen = Math.abs(I) > 1e-6 ? 38 * sgn(I) : 0;
        if (mlen) { kit.arrow(c, cx, cy, cx + nx * mlen, cy - ny * mlen, C.ok, 2.2); kit.label(c, 'μ', cx + nx * mlen * 1.25, cy - ny * mlen * 1.25, { size: 13, weight: 700, color: C.ok, align: 'center' }); }
        kit.label(c, V.comm ? 'split-ring commutator' : 'fixed connection (no commutator)', 10, st.H - 12, { size: 11, color: C.muted });
        // readouts, and the running-torque curve a few times a second
        const rpm = om * 60 / TAU;
        ro.set('n', Hyper.util.fmt(Math.abs(rpm), 3) + ' rpm');
        ro.set('I', Hyper.util.fmt(avg.I, 3) + ' A  (at rest: ' + Hyper.util.fmt(V.V / R, 3) + ' A)');
        ro.set('emf', Hyper.util.fmt(avg.emf, 3) + ' V');
        ro.set('tau', Hyper.util.fmt(avg.tau, 3) + ' N·m');
        ro.set('P', Hyper.util.fmt(avg.Pin, 3) + ' W → ' + Hyper.util.fmt(avg.P, 3) + ' W');
        curveClock += dt;
        if (curveClock > 0.25 || dt === 0) { curveClock = 0; setCurves(); }
        plot.set({ marks: [{ x: phi * 180 / Math.PI, y: tauM, label: 'now' }] });
      }
      const loop = kit.loop((dt) => { step(dt); draw(dt); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* pole pieces of a two-pole magnet, N on the left, with the field between them */
  function poles(c, kit, C, cx, cy, Rc, B) {
    const gap = Rc * 1.35, pw = Math.min(70, cx * 0.24), ph = Rc * 2.3;
    c.save(); c.globalAlpha = 0.85;
    c.fillStyle = C.bad; c.fillRect(cx - gap - pw, cy - ph / 2, pw, ph);
    c.fillStyle = C.accent; c.fillRect(cx + gap, cy - ph / 2, pw, ph);
    c.restore();
    kit.label(c, 'N', cx - gap - pw / 2, cy, { size: 18, weight: 700, color: '#fff', align: 'center' });
    kit.label(c, 'S', cx + gap + pw / 2, cy, { size: 18, weight: 700, color: '#fff', align: 'center' });
    c.save(); c.globalAlpha = 0.5;
    for (let k = -2; k <= 2; k++) kit.arrow(c, cx - gap + 4, cy + k * ph / 5.5, cx + gap - 4, cy + k * ph / 5.5, C.faint, 1);
    c.restore();
    kit.label(c, 'B = ' + Hyper.util.fmt(B, 3) + ' T', cx, cy - ph / 2 - 10, { size: 11.5, color: C.muted, align: 'center' });
  }
  /* a graph box under the stage */
  function graphBox(box) {
    const g = document.createElement('div');
    g.style.padding = '4px 10px 8px';
    box.stage.appendChild(g);
    return g;
  }
  /* a rolling time series */
  function history(maxAge) {
    const h = { pts: [], add(t, v) { h.pts.push([t, v]); while (h.pts.length > 2 && h.pts[0][0] < t - maxAge) h.pts.shift(); }, clear() { h.pts = []; } };
    return h;
  }

  /* ==================================================================== magnet and coil */
  Hyper.sim('em2-magnet-coil', {
    title: 'Magnet and coil: Faraday and Lenz',
    blurb: `A bar magnet (a neodymium magnet 8 cm long) moves along the axis of a coil wired to a centre-zero meter; the circuit has a resistance of 20 Ω. The graphs show the flux linkage NΦ through the coil and the induced EMF. Drag the magnet yourself, or let it move.

- The EMF is the **slope** of the flux graph (with a minus sign). A magnet at rest gives nothing, however close it is.
- Move faster: taller EMF peaks, but narrower — the area under each peak (the flux change) stays the same.
- Watch the coil's induced poles and the orange force on the magnet: pushing in, the coil repels it; pulling out, it attracts it. Either way it **opposes the motion** (Lenz's law).
- More turns: more EMF, and more drag.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 230, maxH: 320 });
      const gb = graphBox(box);
      const MODES = [['Drag the magnet', 'drag'], ['Push in and pull out', 'inout'], ['Pass straight through', 'through']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Motion', options: MODES, value: params && MODES.some(m => m[1] === params.mode) ? params.mode : 'inout' },
        { id: 'v', label: 'Speed', min: 0.05, max: 1, step: 0.01, value: 0.3, unit: 'm/s' },
        { id: 'N', label: 'Turns on the coil', min: 50, max: 1000, step: 50, value: 200 },
        { type: 'buttons', items: [{ id: 'flip', label: 'Flip the magnet' }, { id: 'clear', label: 'Clear graphs' }] }
      ], (id) => {
        if (id === 'flip') pol = -pol;
        if (id === 'clear') { hL.clear(); hE.clear(); }
        if (id === 'mode') { phase = 0; tt = 0; }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['L', 'Flux linkage NΦ'], ['emf', 'EMF'], ['I', 'Current'], ['F', 'Force on the magnet'], ['v', 'Magnet speed']]);
      const V = ctl.values;
      const pL = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'NΦ (mWb)' } }, 120);
      const pE = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'EMF (V)' } }, 120);

      /* geometry (metres): magnet 8 cm × Ø2.4 cm, coil Ø5 cm × 6 cm centred at x = 8 cm */
      const MAG = { L: 0.08, R: 0.012, n: 12, Br: 1.2 }, COIL = { x: 0.08, a: 0.025, L: 0.06, n: 12 }, RES = 20, VIEW = 0.5;
      const Ieq = MAG.Br / MU0 * MAG.L / MAG.n;
      /* flux linkage per turn (averaged over the coil) against magnet position, tabulated once */
      const X0 = -0.3, DX = 0.00125, NT = 481, tab = new Float64Array(NT), dtab = new Float64Array(NT);
      for (let k = 0; k < NT; k++) {
        const xm = X0 + k * DX; let sum = 0;
        for (let i = 0; i < COIL.n; i++) {
          const xt = COIL.x - COIL.L / 2 + (i + 0.5) * COIL.L / COIL.n;
          for (let j = 0; j < MAG.n; j++) sum += TAU * loopField(MAG.R, Ieq, xt - (xm - MAG.L / 2 + (j + 0.5) * MAG.L / MAG.n), COIL.a)[2];
        }
        tab[k] = sum / COIL.n;
      }
      for (let k = 0; k < NT; k++) dtab[k] = (tab[Math.min(NT - 1, k + 1)] - tab[Math.max(0, k - 1)]) / ((Math.min(NT - 1, k + 1) - Math.max(0, k - 1)) * DX);
      const look = (arr, x) => { const u = clamp((x - X0) / DX, 0, NT - 1.000001), k = Math.floor(u), f = u - k; return arr[k] * (1 - f) + arr[k + 1] * f; };

      let pol = 1, xm = -0.12, vm = 0, target = null, phase = 0, tt = 0, time = 0, pause = 0, emf = 0, I = 0, F = 0;
      const hL = history(6), hE = history(6);
      const s = () => st.W / VIEW, X = x => st.W * 0.42 + x * s(), cy = () => st.H * 0.55;
      kit.drag(st, {
        hit: p => Math.abs(p.x - X(xm)) < MAG.L / 2 * s() + 12 && Math.abs(p.y - cy()) < MAG.R * s() + 24 ? 'mag' : null,
        start: () => { if (V.mode !== 'drag') ctl.set('mode', 'drag'); },
        move: (t, p) => { target = clamp((p.x - st.W * 0.42) / s(), -0.24, 0.26); },
        end: () => { target = null; },
        hover: true
      });
      function step(dt) {
        const h = Math.min(dt, 0.05);
        const old = xm;
        if (V.mode === 'drag') { if (target != null) xm = target; }
        else if (V.mode === 'inout') {
          const A = 0.065, x0 = COIL.x - 0.095;
          phase += h * V.v / A;
          xm = x0 - A * Math.cos(phase);
        } else {
          if (pause > 0) { pause -= h; }
          else { xm += V.v * h; if (xm > 0.26) { xm = -0.24; pause = 0.4; } }
        }
        const vel = h > 0 ? (xm - old) / h : 0;
        vm += (Math.abs(xm - old) > 0.1 ? 0 : vel - vm) * Math.min(1, h / 0.04);
        if (V.mode !== 'drag') vm = Math.abs(xm - old) > 0.1 ? 0 : vel;
        const dL = V.N * pol * look(dtab, xm);                 // d(NΦ)/dx
        emf = -dL * vm; I = emf / RES; F = I * dL;             // F opposes the motion
        time += h;
        if (h > 0) { hL.add(time, V.N * pol * look(tab, xm) * 1e3); hE.add(time, emf); }
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), f = font(), y0 = cy(), sc = s();
        // axis
        c.save(); c.strokeStyle = C.grid; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(0, y0); c.lineTo(st.W, y0); c.stroke(); c.restore();
        // coil: back halves of the turns, the magnet, then the front halves
        const nT = 14, x0 = X(COIL.x - COIL.L / 2), x1 = X(COIL.x + COIL.L / 2), ry = COIL.a * sc, rx = Math.max(4, ry * 0.22);
        const turnX = k => x0 + (k + 0.5) * (x1 - x0) / nT;
        c.save(); c.strokeStyle = C.warn; c.globalAlpha = 0.35; c.lineWidth = 2;
        for (let k = 0; k < nT; k++) { c.beginPath(); c.ellipse(turnX(k), y0, rx, ry, 0, -Math.PI / 2, Math.PI / 2); c.stroke(); }
        c.restore();
        const mx0 = X(xm - MAG.L / 2), mx1 = X(xm + MAG.L / 2), mh = MAG.R * sc;
        c.save(); c.globalAlpha = 0.9;
        c.fillStyle = pol > 0 ? C.accent : C.bad; c.fillRect(mx0, y0 - mh, (mx1 - mx0) / 2, 2 * mh);
        c.fillStyle = pol > 0 ? C.bad : C.accent; c.fillRect((mx0 + mx1) / 2, y0 - mh, (mx1 - mx0) / 2, 2 * mh);
        c.restore();
        kit.label(c, pol > 0 ? 'S' : 'N', (3 * mx0 + mx1) / 4, y0, { size: 13, weight: 700, color: '#fff', align: 'center' });
        kit.label(c, pol > 0 ? 'N' : 'S', (mx0 + 3 * mx1) / 4, y0, { size: 13, weight: 700, color: '#fff', align: 'center' });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 2.4;
        for (let k = 0; k < nT; k++) { c.beginPath(); c.ellipse(turnX(k), y0, rx, ry, 0, Math.PI / 2, Math.PI * 1.5); c.stroke(); }
        c.restore();
        // induced current on the front of the turns (down the front for a current that makes B along +x) and induced poles
        const FS = 0.05, frac = clamp(Math.abs(I) / FS, 0, 1);
        if (frac > 0.02) {
          const d = I > 0 ? 1 : -1;
          for (let k = 1; k < nT; k += 3) kit.arrow(c, turnX(k) - rx, y0 - 10 * d, turnX(k) - rx, y0 + 10 * d, C.ok, 1.2 + 1.6 * frac);
          c.save(); c.globalAlpha = 0.35 + 0.65 * frac;
          kit.label(c, I > 0 ? 'S' : 'N', x0 - 14, y0 - ry - 12, { size: 13, weight: 700, color: C.ok, align: 'center' });
          kit.label(c, I > 0 ? 'N' : 'S', x1 + 14, y0 - ry - 12, { size: 13, weight: 700, color: C.ok, align: 'center' });
          c.restore();
        }
        // force on the magnet
        const Fr = V.N * V.N * 0.0067 * 0.0067 * 0.3 / RES;
        if (Math.abs(F) > 1e-6) kit.arrow(c, (mx0 + mx1) / 2, y0 - mh - 12, (mx0 + mx1) / 2 + clamp(50 * F / Fr, -90, 90), y0 - mh - 12, C.warn, 2.4);
        // leads and the centre-zero meter
        const gx = st.W - 78, gy = 70, gr = 46;
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(x0, y0 + ry); c.lineTo(x0, st.H - 14); c.lineTo(gx - 20, st.H - 14); c.lineTo(gx - 20, gy + 8); c.stroke();
        c.beginPath(); c.moveTo(x1, y0 + ry); c.lineTo(x1, st.H - 24); c.lineTo(gx + 20, st.H - 24); c.lineTo(gx + 20, gy + 8); c.stroke();
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 1.5;
        c.beginPath(); c.arc(gx, gy, gr, Math.PI, 0); c.lineTo(gx + gr, gy + 10); c.lineTo(gx - gr, gy + 10); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let k = -4; k <= 4; k++) { const a = -Math.PI / 2 + k * Math.PI / 12; c.beginPath(); c.moveTo(gx + Math.cos(a) * gr * 0.78, gy + Math.sin(a) * gr * 0.78); c.lineTo(gx + Math.cos(a) * gr * (k ? 0.88 : 0.94), gy + Math.sin(a) * gr * (k ? 0.88 : 0.94)); c.stroke(); }
        const na = -Math.PI / 2 + clamp(I / FS, -1.1, 1.1) * Math.PI / 3;
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(gx, gy + 4); c.lineTo(gx + Math.cos(na) * gr * 0.86, gy + Math.sin(na) * gr * 0.86); c.stroke();
        c.restore();
        kit.dot(c, gx, gy + 4, 3, C.text2);
        kit.label(c, '±50 mA', gx, gy + 22, { size: 10.5, color: C.muted, align: 'center' });
        const sb = scaleBar(c, 14, st.H - 40, sc, C, 90);
        kit.label(c, sb.lab, 14 + sb.w / 2, st.H - 50, { size: 11, align: 'center', color: C.muted });
        // readouts and graphs
        ro.set('L', si(V.N * pol * look(tab, xm), 'Wb'));
        ro.set('emf', si(emf, 'V'));
        ro.set('I', si(I, 'A') + (Math.abs(I) > FS ? ' (off scale)' : ''));
        ro.set('F', si(Math.abs(F), 'N') + (Math.abs(F) > 1e-7 ? (F * vm < 0 ? ', against the motion' : '') : ''));
        ro.set('v', Hyper.util.fmt(Math.abs(vm), 3) + ' m/s');
        const tx = { label: 'time (s)', min: Math.max(0, time - 6), max: Math.max(6, time) };
        const top = Math.max(0.5, V.N * 0.45e-3 * 1e3 * 1.05);
        pL.set({ series: [{ pts: hL.pts, color: C.accent }], x: tx, y: { label: 'NΦ (mWb)', min: -top, max: top } });
        pE.set({ series: [{ pts: hE.pts, color: C.warn }], x: tx, y: { label: 'EMF (V)' } });
      }
      const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ==================================================================== sliding rod */
  Hyper.sim('em2-sliding-rod', {
    title: 'Sliding rod on rails',
    blurb: `A copper rod (50 g) slides along two rails joined by a resistor, in a uniform field pointing into the screen. The shaded area is the circuit: as it grows, so does the flux through it. The dots show the induced current.

- **Push at a steady speed:** compare the power you supply, $Fv$, with the heat in the resistor, $I^2R$.
- **Kick it:** the rod coasts to a stop as the magnetic drag, $B^2L^2v/R$, brakes it. The time constant is $mR/B^2L^2$.
- **Pull with a steady force:** it speeds up until the drag equals the pull — a terminal speed, like a skydiver's.
- Double $B$: the EMF doubles, but the drag quadruples.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240, maxH: 340 });
      const gb = graphBox(box);
      const M = 0.05, XMAX = 3.9, XSTART = 0.5;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What you do', options: [['Push at a steady speed', 'push'], ['Kick it, then let go', 'kick'], ['Pull with a steady force', 'pull']], value: 'push' },
        { id: 'v', label: 'Speed (push) or kick speed', min: 0.2, max: 5, step: 0.1, value: 2, unit: 'm/s' },
        { id: 'F', label: 'Pulling force', min: 0.01, max: 0.5, step: 0.01, value: 0.1, unit: 'N' },
        { id: 'B', label: 'Magnetic field', min: 0.1, max: 1, step: 0.05, value: 0.5, unit: 'T' },
        { id: 'L', label: 'Rod length (rail spacing)', min: 0.1, max: 1, step: 0.05, value: 0.4, unit: 'm' },
        { id: 'R', label: 'Resistance', min: 0.5, max: 10, step: 0.5, value: 2, unit: 'Ω' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start again', primary: true }] }
      ], (id) => {
        if (id === 'mode' || id === 'go') restart();
        if (id === 'mode') showRows();
        if (id === 'v' && V.mode === 'push') v = V.v;
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['emf', 'EMF = BLv'], ['I', 'Current'], ['Fm', 'Magnetic drag BIL'], ['P', 'Power: pushing → heating'], ['tau', 'Time constant mR/B²L²']]);
      const V = ctl.values;
      function showRows() {
        if (ctl.rows.v && ctl.rows.v.row) ctl.rows.v.row.style.display = V.mode === 'pull' ? 'none' : '';
        if (ctl.rows.F && ctl.rows.F.row) ctl.rows.F.row.style.display = V.mode === 'pull' ? '' : 'none';
      }
      showRows();
      const pv = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'speed (m/s)' } }, 150);
      const hv = history(12);
      let x = XSTART, v = V.v, time = 0, dots = 0;
      function restart() { x = XSTART; v = V.mode === 'pull' ? 0 : V.v; time = 0; hv.clear(); }
      const tauOf = () => M * V.R / (V.B * V.B * V.L * V.L);
      function step(dt) {
        const h = Math.min(dt, 0.05);
        if (V.mode === 'push') { v = V.v; x += v * h; }
        else {
          const tau = tauOf(), vt = V.mode === 'pull' ? V.F * V.R / (V.B * V.B * V.L * V.L) : 0;
          const e = Math.exp(-h / tau);
          x += vt * h + (v - vt) * tau * (1 - e);
          v = vt + (v - vt) * e;
        }
        if (x > XMAX) x = XSTART + ((x - XSTART) % (XMAX - XSTART));
        time += h;
        dots += V.B * V.L * v / V.R * h * 3;
        if (h > 0) hv.add(time, v);
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), f = font();
        const pxm = (st.W - 50) / 4.1, ox = 30, cy = st.H * 0.48;
        const X = xx => ox + xx * pxm, Y = yy => cy - yy * pxm;
        const half = V.L / 2;
        // field
        c.save(); c.globalAlpha = 0.4; c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let yy = 18; yy < st.H; yy += 36) for (let xx = 18; xx < st.W; xx += 36) { c.beginPath(); c.arc(xx, yy, 4, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(xx - 2.5, yy - 2.5); c.lineTo(xx + 2.5, yy + 2.5); c.moveTo(xx + 2.5, yy - 2.5); c.lineTo(xx - 2.5, yy + 2.5); c.stroke(); }
        c.restore();
        kit.label(c, 'B = ' + Hyper.util.fmt(V.B, 3) + ' T into the screen', 10, 12, { size: 11.5, color: C.muted, bg: C.bg2 });
        // the circuit area
        c.save(); c.globalAlpha = 0.14; c.fillStyle = C.accent; c.fillRect(X(0), Y(half), X(x) - X(0), Y(-half) - Y(half)); c.restore();
        // rails and resistor
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 4;
        c.beginPath(); c.moveTo(X(0), Y(half)); c.lineTo(X(4.0), Y(half)); c.moveTo(X(0), Y(-half)); c.lineTo(X(4.0), Y(-half)); c.stroke();
        c.lineWidth = 2; c.beginPath(); c.moveTo(X(0), Y(half));
        const zz = 8, top = Y(half), bot = Y(-half), seg = (bot - top) / zz;
        for (let k = 1; k < zz; k++) c.lineTo(X(0) + (k % 2 ? 7 : -7), top + k * seg);
        c.lineTo(X(0), bot); c.stroke(); c.restore();
        kit.label(c, Hyper.util.fmt(V.R, 3) + ' Ω', X(0) + 12, cy, { size: 11.5, color: C.text2 });
        // the rod
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 7; c.lineCap = 'round';
        c.beginPath(); c.moveTo(X(x), Y(half) - 10); c.lineTo(X(x), Y(-half) + 10); c.stroke(); c.restore();
        // current dots, anticlockwise: along the bottom rail, up the rod, back along the top, down the resistor
        const I = V.B * V.L * v / V.R;
        if (I > 1e-4) {
          const w = X(x) - X(0), hgt = bot - top, per = 2 * w + 2 * hgt, gap = 26;
          c.fillStyle = C.ok;
          for (let d = ((dots * 60) % gap + gap) % gap; d < per; d += gap) {
            let px, py;
            if (d < w) { px = X(0) + d; py = bot; }
            else if (d < w + hgt) { px = X(x); py = bot - (d - w); }
            else if (d < 2 * w + hgt) { px = X(x) - (d - w - hgt); py = top; }
            else { px = X(0); py = top + (d - 2 * w - hgt); }
            c.beginPath(); c.arc(px, py, 2.6, 0, TAU); c.fill();
          }
        }
        // forces and velocity on the rod
        const Fm = I * V.L * V.B, Fref = 0.05;
        kit.arrow(c, X(x), cy, X(x) + clamp(20 * v, 0, 90), cy, C.ok, 2.2);
        if (Fm > 1e-5) kit.arrow(c, X(x), cy + 16, X(x) - clamp(60 * Fm / Fref, 4, 110), cy + 16, C.warn, 2.4);
        const Fapp = V.mode === 'push' ? Fm : V.mode === 'pull' ? V.F : 0;
        if (Fapp > 1e-5) kit.arrow(c, X(x), cy - 16, X(x) + clamp(60 * Fapp / Fref, 4, 110), cy - 16, C.series[3], 2.4);
        kit.label(c, 'green: velocity   orange: magnetic drag   pink: your force', st.W - 10, st.H - 10, { size: 11, align: 'right', color: C.muted });
        // readouts
        const emf = V.B * V.L * v, tau = tauOf();
        ro.set('emf', si(emf, 'V'));
        ro.set('I', si(I, 'A') + ', anticlockwise');
        ro.set('Fm', si(Fm, 'N'));
        ro.set('P', V.mode === 'kick' ? '0 → ' + si(I * I * V.R, 'W') + ' (from the rod\'s KE)' : si(Fapp * v, 'W') + ' → ' + si(I * I * V.R, 'W'));
        ro.set('tau', Hyper.util.fmt(tau, 3) + ' s' + (V.mode === 'pull' ? ';  terminal speed ' + Hyper.util.fmt(V.F * V.R / (V.B * V.B * V.L * V.L), 3) + ' m/s' : ''));
        const tmax = Math.max(12, time);
        pv.set({ series: [{ pts: hv.pts, color: C.ok }], x: { label: 'time (s)', min: tmax - 12, max: tmax },
                 hlines: V.mode === 'pull' ? [{ y: V.F * V.R / (V.B * V.B * V.L * V.L) }] : [] });
      }
      const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ==================================================================== AC generator */
  Hyper.sim('em2-generator', {
    title: 'AC generator',
    blurb: `A coil of 10 cm × 10 cm turns between the poles of a magnet, seen end-on. **n** is the normal to the coil; the flux through it is $NBA\\cos\\theta$. The graphs show the flux linkage and the EMF — shown slowed down: real generators turn at 50 or 60 revolutions a second.

- Compare the two graphs: the EMF is largest when the flux passes through **zero**, and zero when the flux is largest.
- Double the rotation rate: the EMF peaks double *and* come twice as often.
- Switch to the **commutator**: the output no longer reverses — pulsating DC, as from a dynamo.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 230, maxH: 340 });
      const gb = graphBox(box);
      const A = 0.01;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Rotation rate', min: 0.1, max: 3, step: 0.05, value: 0.5, unit: 'rev/s' },
        { id: 'N', label: 'Turns', min: 10, max: 500, step: 10, value: 100 },
        { id: 'B', label: 'Magnetic field', min: 0.05, max: 1, step: 0.05, value: 0.2, unit: 'T' },
        { id: 'out', type: 'select', label: 'Connection', options: [['Slip rings (AC)', 'ac'], ['Split-ring commutator (DC)', 'dc']], value: 'ac' },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear graphs' }] }
      ], (id) => { if (id === 'clear') { hE.clear(); hF.clear(); } if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['th', 'Angle θ of n from B'], ['phi', 'Flux linkage NBA cos θ'], ['emf', 'EMF now'], ['E0', 'Peak NBAω'], ['rms', 'RMS (sine)']]);
      const V = ctl.values;
      const pF = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'NΦ (mWb)' } }, 115);
      const pE = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'EMF (V)' } }, 115);
      let th = 0, time = 0;
      const hE = history(20), hF = history(20);
      const out = t => { const e = V.N * V.B * A * TAU * V.f * Math.sin(t); return V.out === 'dc' ? Math.abs(e) : e; };
      function step(dt) {
        const h = Math.min(dt, 0.05);
        th = (th + TAU * V.f * h) % TAU; time += h;
        if (h > 0) { hE.add(time, out(th)); hF.add(time, V.N * V.B * A * Math.cos(th) * 1e3); }
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), f = font();
        const cx = st.W * 0.42, cy = st.H * 0.52, Rc = Math.min(st.H * 0.32, st.W * 0.18);
        poles(c, kit, C, cx, cy, Rc, V.B);
        // coil edge-on; its normal n at angle th from B (to the right), turning anticlockwise
        const tx = -Math.sin(th), ty = Math.cos(th), nx = Math.cos(th), ny = Math.sin(th);
        const ax = cx + tx * Rc, ay = cy - ty * Rc, bx = cx - tx * Rc, by = cy + ty * Rc;
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 4; c.globalAlpha = 0.7; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); c.restore();
        const e = V.N * V.B * A * TAU * V.f * Math.sin(th), e0 = V.N * V.B * A * TAU * V.f;
        if (Math.abs(e) > 0.03 * e0) { currentMark(c, ax, ay, 10, e > 0, C); currentMark(c, bx, by, 10, e < 0, C); }
        else { kit.dot(c, ax, ay, 9, C.surface, C.text); kit.dot(c, bx, by, 9, C.surface, C.text); }
        kit.arrow(c, cx, cy, cx + nx * 44, cy - ny * 44, C.ok, 2.2);
        kit.label(c, 'n', cx + nx * 56, cy - ny * 56, { size: 13, weight: 700, color: C.ok, align: 'center' });
        // rotation arrow
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, Rc + 14, -2.2, -1.2); c.stroke(); c.restore();
        kit.arrow(c, cx + (Rc + 14) * Math.cos(-2.0), cy + (Rc + 14) * Math.sin(-2.0), cx + (Rc + 14) * Math.cos(-2.3), cy + (Rc + 14) * Math.sin(-2.3), C.muted, 1.5);
        // the lamp
        const lx = st.W - 60, ly = cy, bright = e0 > 0 ? Math.min(1, Math.abs(out(th)) / e0) : 0;
        c.save(); c.globalAlpha = 0.15 + 0.85 * bright * bright; c.fillStyle = C.series[4] || C.warn;
        c.beginPath(); c.arc(lx, ly, 18 + 10 * bright, 0, TAU); c.fill(); c.restore();
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 1.5; c.beginPath(); c.arc(lx, ly, 16, 0, TAU); c.stroke();
        c.beginPath(); c.moveTo(lx - 6, ly + 16); c.lineTo(lx - 6, st.H - 16); c.lineTo(cx - 8, st.H - 16); c.lineTo(cx - 8, cy + 14);
        c.moveTo(lx + 6, ly + 16); c.lineTo(lx + 6, st.H - 8); c.lineTo(cx + 8, st.H - 8); c.lineTo(cx + 8, cy + 14); c.stroke(); c.restore();
        // slip rings or commutator at the centre
        c.save(); c.lineWidth = 5;
        if (V.out === 'dc') {
          c.strokeStyle = C.warn; c.beginPath(); c.arc(cx, cy, 12, -th + 0.35, -th + Math.PI - 0.35); c.stroke();
          c.strokeStyle = C.series[4] || C.warn; c.beginPath(); c.arc(cx, cy, 12, -th + Math.PI + 0.35, -th + TAU - 0.35); c.stroke();
        } else { c.strokeStyle = C.warn; c.beginPath(); c.arc(cx, cy, 12, 0, TAU); c.stroke(); c.strokeStyle = C.series[4] || C.warn; c.beginPath(); c.arc(cx, cy, 6, 0, TAU); c.stroke(); }
        c.restore();
        kit.label(c, V.out === 'dc' ? 'commutator: output never reverses' : 'slip rings: output alternates', 10, st.H - 12, { size: 11, color: C.muted });
        // readouts and graphs
        ro.set('th', Math.round(th * 180 / Math.PI) + '°');
        ro.set('phi', si(V.N * V.B * A * Math.cos(th), 'Wb'));
        ro.set('emf', si(out(th), 'V'));
        ro.set('E0', si(e0, 'V') + ' at ' + Hyper.util.fmt(V.f * 60, 3) + ' rpm');
        ro.set('rms', si(e0 / Math.SQRT2, 'V') + (V.out === 'dc' ? ' (same heating)' : ''));
        const win = clamp(3 / V.f, 2, 20), xax = { label: 'time (s)', min: Math.max(0, time - win), max: Math.max(win, time) };
        const topE = Math.max(e0, 1e-6) * 1.15, topF = V.N * V.B * A * 1e3 * 1.15;
        pF.set({ series: [{ pts: hF.pts, color: C.accent }], x: xax, y: { label: 'NΦ (mWb)', min: -topF, max: topF } });
        pE.set({ series: [{ pts: hE.pts, color: C.warn }], x: xax, y: { label: 'EMF (V)', min: V.out === 'dc' ? -0.1 * topE : -topE, max: topE } });
      }
      const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ==================================================================== RL circuit */
  Hyper.sim('em2-rl-circuit', {
    title: 'RL circuit',
    blurb: `A battery, a switch, a resistor $R$ and a coil $L$ in series, with a diode across $R$ and $L$. Connect the battery and watch the current climb; disconnect it and watch the coil keep the current going. Time is rescaled so that each run lasts a few seconds; the graphs use real time.

- The current reaches 63% of $V/R$ after one time constant $\\tau = L/R$ (dashed line). Change $L$ and $R$ and predict the new $\\tau$.
- At the instant of connection all the battery voltage is across the coil; at the end, none of it.
- Untick the **diode** and disconnect: with nowhere to go, the current is forced across the opening switch and the coil's voltage leaps to hundreds of volts — a spark.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 300 });
      const gb = graphBox(box);
      const RGAP = 1000;
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Battery', min: 1, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'R', label: 'Resistance R', min: 1, max: 100, value: 10, unit: 'Ω', log: true, sig: 2 },
        { id: 'L', label: 'Inductance L', min: 0.001, max: 10, value: 0.5, unit: 'H', log: true, sig: 2 },
        { id: 'diode', type: 'check', label: 'Flyback diode', value: true },
        { type: 'buttons', items: [{ id: 'on', label: 'Connect battery', primary: true }, { id: 'off', label: 'Disconnect' }] }
      ], (id) => {
        if (id === 'on') { on = true; t = 0; tEv = 0; tOff = null; hI.clear(); hV.clear(); spike = 0; rescale(); }
        else if (id === 'off') { if (on) { on = false; tOff = t; tEv = t; vPeak = -I * (V.R + (V.diode ? 0 : RGAP)); hI.add(t, I); hV.add(t, vPeak); spark = V.diode ? 0 : 0.6; } }
        else if (id === 'R' || id === 'L' || id === 'V' || id === 'diode') { rescale(); tEv = t; }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['tau', 'Time constant L/R'], ['If', 'Final current V/R'], ['I', 'Current now'], ['VL', 'Voltage across the coil'], ['U', 'Energy stored ½LI²']]);
      const V = ctl.values;
      const pI = kit.plot(gb, { x: { label: 'time' }, y: { label: 'current (A)' } }, 125);
      const pV = kit.plot(gb, { x: { label: 'time' }, y: { label: 'voltage (V)' } }, 125);
      let on = true, I = 0, t = 0, tEv = 0, tOff = null, ts = 1, spike = 0, dots = 0, vPeak = 0, spark = 0;
      const hI = history(1e9), hV = history(1e9);
      const tau = () => V.L / V.R;
      function rescale() { ts = 6 * tau() / 5; }          // six time constants in about five seconds
      rescale();
      function step(dt) {
        spark = Math.max(0, spark - dt);
        const h = Math.min(dt, 0.05) * ts;
        if (h <= 0 || t > tEv + 10 * tau()) { spike = 0; return; }     // settled: nothing changes
        const n = 20, hh = h / n;
        for (let k = 0; k < n; k++) {
          const Rloop = on ? V.R : V.R + (V.diode ? 0 : RGAP);
          const tc = V.L / Rloop, If = on ? V.V / V.R : 0;
          I = If + (I - If) * Math.exp(-hh / tc);
          t += hh;
        }
        const VL = on ? V.V - I * V.R : -I * (V.R + (V.diode ? 0 : RGAP));
        spike = !on && !V.diode ? Math.abs(VL) : 0;
        dots += I * h / ts * 4;
        hI.add(t, I); hV.add(t, VL);
      }
      const unit = () => tau() < 0.2 ? ['ms', 1e3] : ['s', 1];
      function draw() {
        const C = kit.colors(), c = st.begin(), f = font();
        // circuit: battery on the left, switch at the top left, R along the top, L down the right, diode in the middle
        const L0 = Math.max(44, st.W * 0.09), R0 = st.W * 0.62, T0 = 40, B0 = st.H - 34, span = R0 - L0;
        const xs = L0 + 0.2 * span, sw = Math.min(20, 0.06 * span), xd = L0 + 0.34 * span, rA = L0 + 0.45 * span, rB = L0 + 0.82 * span;
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 2;
        c.beginPath();
        c.moveTo(L0, (T0 + B0) / 2 - 12); c.lineTo(L0, T0); c.lineTo(xs - sw, T0);                // battery + to switch
        c.moveTo(xs + sw, T0); c.lineTo(rA, T0);                                           // switch to R
        c.moveTo(rB, T0); c.lineTo(R0, T0); c.lineTo(R0, T0 + 20);                         // R to coil
        c.moveTo(R0, B0 - 20); c.lineTo(R0, B0); c.lineTo(L0, B0); c.lineTo(L0, (T0 + B0) / 2 + 12);  // coil back to battery
        c.stroke();
        // resistor zigzag
        c.beginPath(); c.moveTo(rA, T0);
        for (let k = 1; k < 10; k++) c.lineTo(rA + k * (rB - rA) / 10, T0 + (k % 2 ? -7 : 7));
        c.lineTo(rB, T0); c.stroke();
        // coil
        const nL = 6, lh = (B0 - T0 - 40) / nL;
        c.beginPath(); c.moveTo(R0, T0 + 20);
        for (let k = 0; k < nL; k++) c.arc(R0, T0 + 20 + lh * (k + 0.5), lh / 2, -Math.PI / 2, Math.PI / 2);
        c.stroke();
        // battery
        c.lineWidth = 3; c.beginPath(); c.moveTo(L0 - 16, (T0 + B0) / 2 - 12); c.lineTo(L0 + 16, (T0 + B0) / 2 - 12); c.stroke();
        c.lineWidth = 5; c.beginPath(); c.moveTo(L0 - 8, (T0 + B0) / 2 + 12); c.lineTo(L0 + 8, (T0 + B0) / 2 + 12); c.stroke();
        // switch
        c.lineWidth = 2.5; c.beginPath(); c.moveTo(xs - sw, T0);
        if (on) c.lineTo(xs + sw, T0); else c.lineTo(xs + sw * 0.7, T0 - 22);
        c.stroke();
        // diode branch from the bottom wire up to the node after the switch (cathode at the top: blocks while connected)
        if (V.diode) {
          c.lineWidth = 2; c.beginPath(); c.moveTo(xd, T0); c.lineTo(xd, (T0 + B0) / 2 - 10);
          c.moveTo(xd, (T0 + B0) / 2 + 10); c.lineTo(xd, B0); c.stroke();
          c.fillStyle = C.text2; c.beginPath(); c.moveTo(xd - 10, (T0 + B0) / 2 + 10); c.lineTo(xd + 10, (T0 + B0) / 2 + 10); c.lineTo(xd, (T0 + B0) / 2 - 8); c.closePath(); c.fill();
          c.beginPath(); c.moveTo(xd - 10, (T0 + B0) / 2 - 10); c.lineTo(xd + 10, (T0 + B0) / 2 - 10); c.stroke();
        }
        c.restore();
        kit.label(c, Hyper.util.fmt(V.V, 3) + ' V', L0 - 22, (T0 + B0) / 2, { size: 12, color: C.text2, align: 'right' });
        kit.label(c, 'R = ' + Hyper.util.fmt(V.R, 3) + ' Ω', (rA + rB) / 2, T0 - 18, { size: 12, color: C.text2, align: 'center' });
        kit.label(c, 'L = ' + si(V.L, 'H'), R0 + 22, (T0 + B0) / 2, { size: 12, color: C.text2 });
        kit.dot(c, xs - sw, T0, 3.2, C.bg2, C.text2); kit.dot(c, xs + sw, T0, 3.2, C.bg2, C.text2);
        kit.label(c, on ? 'switch closed' : 'switch open', xs, T0 + 20, { size: 11, color: C.muted, align: 'center' });
        // the spark
        if (spark > 0 && Math.abs(vPeak) > 50) {
          c.save(); c.strokeStyle = C.series[4] || C.warn; c.lineWidth = 2; c.globalAlpha = Math.min(1, spark / 0.3);
          c.beginPath(); c.moveTo(xs - sw, T0 - 2); c.lineTo(xs - sw * 0.3, T0 - 10); c.lineTo(xs + sw * 0.1, T0 + 2); c.lineTo(xs + sw * 0.7, T0 - 18); c.stroke(); c.restore();
          kit.label(c, 'spark!', xs, T0 - 30, { size: 12, weight: 700, color: C.warn, align: 'center' });
        }
        // moving current dots along the path the current is taking
        const If = V.V / V.R;
        if (I > 0.002 * If) {
          const path = on ? [[L0, (T0 + B0) / 2 - 12], [L0, T0], [R0, T0], [R0, B0], [L0, B0], [L0, (T0 + B0) / 2 + 12]]
                          : (V.diode ? [[xd, T0], [R0, T0], [R0, B0], [xd, B0], [xd, T0]] : [[xs, T0], [R0, T0], [R0, B0], [L0, B0], [L0, T0], [xs, T0]]);
          const lens = []; let tot = 0;
          for (let k = 1; k < path.length; k++) { const l = Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]); lens.push(l); tot += l; }
          c.fillStyle = C.ok; c.save(); c.globalAlpha = Math.min(1, 0.3 + I / If);
          const gap = 24;
          for (let d = ((dots * 40) % gap + gap) % gap; d < tot; d += gap) {
            let r = d, k = 0; while (k < lens.length - 1 && r > lens[k]) { r -= lens[k]; k++; }
            const fr = lens[k] > 0 ? r / lens[k] : 0;
            c.beginPath(); c.arc(path[k][0] + (path[k + 1][0] - path[k][0]) * fr, path[k][1] + (path[k + 1][1] - path[k][1]) * fr, 2.6, 0, TAU); c.fill();
          }
          c.restore();
        }
        // a bar showing how the battery voltage is shared
        const VL = on ? V.V - I * V.R : -I * (V.R + (V.diode ? 0 : RGAP));
        const bx = st.W * 0.74, bw = st.W * 0.22, by = T0 + 20;
        kit.label(c, 'voltage across R and L', bx, by - 12, { size: 11, color: C.muted });
        const fr = V.V > 0 ? clamp(I * V.R / V.V, 0, 1) : 0;
        c.fillStyle = C.accent; c.fillRect(bx, by, bw * fr, 14);
        c.fillStyle = C.warn; c.fillRect(bx + bw * fr, by, on ? bw * (1 - fr) : 0, 14);
        kit.label(c, 'V_R ' + Hyper.util.fmt(I * V.R, 3) + ' V', bx, by + 28, { size: 11.5, color: C.accent });
        kit.label(c, 'V_L ' + Hyper.util.fmt(VL, 3) + ' V', bx, by + 46, { size: 11.5, color: C.warn });
        // readouts
        const [u, k] = unit();
        ro.set('tau', Hyper.util.fmt(tau() * k, 3) + ' ' + u);
        ro.set('If', si(If, 'A'));
        ro.set('I', si(I, 'A') + (on ? ' (' + Math.round(100 * I / If) + '% of V/R)' : ''));
        ro.set('VL', si(VL, 'V') + (tOff != null && !on && Math.abs(vPeak) > 0 ? '  (at switch-off: ' + si(vPeak, 'V') + ')' : ''));
        ro.set('U', si(0.5 * V.L * I * I, 'J'));
        const tmax = Math.max(6 * tau(), tEv + 6 * tau(), t) * k;
        const toX = pts => pts.map(p => [p[0] * k, p[1]]);
        pI.set({ series: [{ pts: toX(hI.pts), color: C.ok }], x: { label: 'time (' + u + ')', min: 0, max: tmax }, y: { label: 'current (A)', min: 0, max: If * 1.12 },
                 hlines: [{ y: If }, { y: If * (1 - Math.exp(-1)) }], vlines: [{ x: tau() * k }] });
        pV.set({ series: [{ pts: toX(hV.pts), color: C.warn, label: 'across L' }], x: { label: 'time (' + u + ')', min: 0, max: tmax }, y: { label: 'voltage (V)' } });
      }
      const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ==================================================================== driven RLC circuit */
  Hyper.sim('em2-rlc', {
    title: 'AC circuit: phasors and resonance',
    blurb: `A 10 V (RMS) source of adjustable frequency drives a resistor, an inductor, a capacitor, or all three in series. Left: the **phasors** — rotating arrows whose heights give the instantaneous values (shown slowed down). Right: source voltage and current over two cycles. Below: the current at every frequency, with a dot at the present one.

- **Capacitor only:** the current leads the voltage by 90° and grows with frequency. **Inductor only:** it lags by 90° and falls with frequency.
- **Series RLC:** the voltage phasors add tip to tail. Find the frequency where $V_L$ and $V_C$ cancel — the resonance peak, where the current is in step with the voltage.
- Lower $R$ at resonance: the peak grows taller and sharper (higher Q), and $V_L$ and $V_C$ become many times the supply voltage.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 380 });
      const gb = graphBox(box);
      const CIRC = [['Series R, L and C', 'rlc'], ['Resistor only', 'R'], ['Inductor only', 'L'], ['Capacitor only', 'C']];
      const VS = 10;
      const ctl = kit.controls(box.side, [
        { id: 'circ', type: 'select', label: 'Circuit', options: CIRC, value: params && CIRC.some(o => o[1] === params.circuit) ? params.circuit : 'rlc' },
        { id: 'f', label: 'Frequency', min: 10, max: 100000, value: 1000, unit: 'Hz', log: true, sig: 3 },
        { id: 'R', label: 'Resistance R', min: 1, max: 1000, value: 20, unit: 'Ω', log: true, sig: 2 },
        { id: 'L', label: 'Inductance L', min: 0.1, max: 1000, value: 10, unit: 'mH', log: true, sig: 2 },
        { id: 'C', label: 'Capacitance C', min: 0.01, max: 100, value: 1, unit: 'µF', log: true, sig: 2 },
        { id: 'rot', type: 'check', label: 'Rotate the phasors', value: true },
        { type: 'buttons', items: [{ id: 'res', label: 'Go to resonance' }] }
      ], (id) => {
        if (id === 'res' && V.circ === 'rlc') ctl.set('f', clamp(f0(), 10, 100000));
        if (id === 'circ') showRows();
        setCurve();
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['X', 'Reactances X_L, X_C'], ['Z', 'Impedance Z'], ['I', 'Current (RMS)'], ['phi', 'Voltage leads current by'], ['P', 'Power, power factor'], ['f0', 'Resonance f₀, quality Q']]);
      const V = ctl.values;
      function showRows() {
        const use = { R: V.circ === 'rlc' || V.circ === 'R', L: V.circ === 'rlc' || V.circ === 'L', C: V.circ === 'rlc' || V.circ === 'C' };
        for (const k in use) if (ctl.rows[k] && ctl.rows[k].row) ctl.rows[k].row.style.display = use[k] ? '' : 'none';
      }
      showRows();
      const plot = kit.plot(gb, { x: { label: 'frequency (Hz)', log: true, min: 10, max: 100000 }, y: { label: 'current (mA)' } }, 190);
      const f0 = () => 1 / (TAU * Math.sqrt(V.L * 1e-3 * V.C * 1e-6));
      /* everything about the circuit at frequency f */
      function solve(f) {
        const w = TAU * f, XL = w * V.L * 1e-3, XC = 1 / (w * V.C * 1e-6);
        let R = 0, xl = 0, xc = 0;
        if (V.circ === 'rlc') { R = V.R; xl = XL; xc = XC; }
        else if (V.circ === 'R') R = V.R;
        else if (V.circ === 'L') xl = XL;
        else xc = XC;
        const Z = Math.max(Math.hypot(R, xl - xc), 1e-9), I = VS / Z;
        return { XL, XC, R, xl, xc, Z, I, phi: Math.atan2(xl - xc, R), VR: I * R, VL: I * xl, VC: I * xc };
      }
      function setCurve() {
        const pts = [];
        for (let k = 0; k <= 240; k++) { const f = 10 * Math.pow(1e4, k / 240); pts.push([f, solve(f).I * 1e3]); }
        const s = solve(V.f), C = kit.colors();
        plot.set({ series: [{ pts, color: C.accent }], marks: [{ x: V.f, y: s.I * 1e3, label: Hyper.util.fmt(s.I * 1e3, 3) + ' mA' }],
                   vlines: V.circ === 'rlc' ? [{ x: f0() }] : [], y: { label: 'current (mA)', log: V.circ === 'L' || V.circ === 'C' } });
      }
      setCurve();
      let th = 0;
      function draw(dt) {
        if (V.rot) th = (th + TAU * 0.25 * Math.min(dt, 0.05)) % (2 * TAU);
        const C = kit.colors(), c = st.begin(), fnt = font(), s = solve(V.f);
        // phasor panel
        const pw = Math.min(st.W * 0.42, st.H), cx = pw / 2 + 8, cy = st.H / 2, R0 = pw * 0.4;
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); c.arc(cx, cy, R0, 0, TAU); c.moveTo(cx - R0 - 6, cy); c.lineTo(cx + R0 + 6, cy); c.moveTo(cx, cy - R0 - 6); c.lineTo(cx, cy + R0 + 6); c.stroke(); c.restore();
        const Vpk = Math.SQRT2 * VS, vmax = Math.max(Vpk, Math.SQRT2 * s.VL, Math.SQRT2 * s.VC, Math.SQRT2 * s.VR, 1e-9), k = R0 / vmax;
        const at = (len, ang) => [len * Math.cos(ang), -len * Math.sin(ang)];
        let x = cx, y = cy;
        const tipToTail = [[s.VR, th, C.accent, 'V_R'], [s.VL, th + Math.PI / 2, C.warn, 'V_L'], [s.VC, th - Math.PI / 2, C.series[2], 'V_C']];
        for (const [v, ang, col, name] of tipToTail) {
          if (v * Math.SQRT2 * k < 1) continue;
          const d = at(v * Math.SQRT2 * k, ang);
          kit.arrow(c, x, y, x + d[0], y + d[1], col, 2.4);
          kit.label(c, name, x + d[0] * 0.5 + 8, y + d[1] * 0.5 - 8, { size: 12, weight: 600, color: col });
          x += d[0]; y += d[1];
        }
        const dv = at(Vpk * k, th + s.phi);
        kit.arrow(c, cx, cy, cx + dv[0], cy + dv[1], C.text, 2.8);
        kit.label(c, 'V', cx + dv[0] * 1.08, cy + dv[1] * 1.08, { size: 13, weight: 700, color: C.text, align: 'center' });
        const di = at(R0 * 0.45, th);
        c.save(); c.globalAlpha = 0.9; kit.arrow(c, cx, cy, cx + di[0], cy + di[1], C.bad, 2); c.restore();
        kit.label(c, 'I', cx + di[0] * 1.2, cy + di[1] * 1.2, { size: 13, weight: 700, color: C.bad, align: 'center' });
        // waveform panel: two cycles, with the present moment marked
        const wx0 = pw + 30, wx1 = st.W - 12, wy = cy, amp = st.H * 0.36;
        c.save(); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(wx0, wy); c.lineTo(wx1, wy); c.moveTo(wx0, wy - amp - 6); c.lineTo(wx0, wy + amp + 6); c.stroke(); c.restore();
        const curve = (fn, col, w) => { c.save(); c.strokeStyle = col; c.lineWidth = w; c.beginPath(); for (let j = 0; j <= 200; j++) { const a = j / 200 * 2 * TAU, X = wx0 + (wx1 - wx0) * j / 200, Y = wy - amp * fn(a); j ? c.lineTo(X, Y) : c.moveTo(X, Y); } c.stroke(); c.restore(); };
        curve(a => Math.sin(a + s.phi), C.text, 2.2);
        curve(a => 0.7 * Math.sin(a), C.bad, 1.8);
        const mx = wx0 + (wx1 - wx0) * (th / (2 * TAU));
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(mx, wy - amp - 6); c.lineTo(mx, wy + amp + 6); c.stroke(); c.restore();
        kit.dot(c, mx, wy - amp * Math.sin(th + s.phi), 4, C.text);
        kit.dot(c, mx, wy - amp * 0.7 * Math.sin(th), 4, C.bad);
        kit.label(c, 'v (source)', wx1, 14, { size: 11.5, color: C.text, align: 'right' });
        kit.label(c, 'i (scaled)', wx1, 30, { size: 11.5, color: C.bad, align: 'right' });
        kit.label(c, 'two cycles →', wx0 + 4, st.H - 10, { size: 11, color: C.muted });
        // readouts
        const deg = s.phi * 180 / Math.PI;
        ro.set('X', (V.circ === 'rlc' || V.circ === 'L' ? si(s.XL, 'Ω') : '—') + ',  ' + (V.circ === 'rlc' || V.circ === 'C' ? si(s.XC, 'Ω') : '—'));
        ro.set('Z', si(s.Z, 'Ω'));
        ro.set('I', si(s.I, 'A') + '  (V = ' + VS + ' V)');
        ro.set('phi', Hyper.util.fmt(deg, 3) + '°' + (deg > 0.5 ? ' (current lags)' : deg < -0.5 ? ' (current leads)' : ' (in step)'));
        ro.set('P', si(s.I * s.I * s.R, 'W') + ',  cos φ = ' + Hyper.util.fmt(Math.round(Math.cos(s.phi) * 1000) / 1000, 3));
        ro.set('f0', V.circ === 'rlc' ? si(f0(), 'Hz') + ',  Q = ' + Hyper.util.fmt(Math.sqrt(V.L * 1e-3 / (V.C * 1e-6)) / V.R, 3) : '—');
      }
      const loop = kit.loop((dt) => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

})();
