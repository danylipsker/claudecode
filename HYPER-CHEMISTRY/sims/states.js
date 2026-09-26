/* HYPER-CHEMISTRY · sims/states.js — states of matter and solutions: a gas in a cylinder,
 * molecular speeds and effusion, real gases, vapour pressure, phase diagrams, unit cells,
 * Raoult's law and distillation, and osmosis. Every id starts with "state-". */
(function () {
  'use strict';

  /* ================================================================ shared helpers */
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const pretty = f => f.replace(/\d/g, d => SUB[d]);
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const RJ = 8.314462618;            // J/(mol·K)
  const RL = 0.0820574;              // L·atm/(mol·K)
  const RB = 0.0831446;              // L·bar/(mol·K)
  const ATM = 101325;                // Pa
  // a #rrggbb colour made darker (k < 1) for the shaded edge of an atom
  const darker = (hex, k) => {
    const n = parseInt(hex.slice(1), 16);
    return 'rgb(' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * (k || 0.7))).join(',') + ')';
  };
  // a standard normal random number (Box–Muller)
  const gauss = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };

  // flat drawings of small molecules, atom positions in ångström
  const SHAPES = {
    He: [['He', 0, 0]], Ne: [['Ne', 0, 0]], Ar: [['Ar', 0, 0]], Kr: [['Kr', 0, 0]], Xe: [['Xe', 0, 0]],
    H2: [['H', -0.37, 0], ['H', 0.37, 0]],
    N2: [['N', -0.55, 0], ['N', 0.55, 0]],
    O2: [['O', -0.6, 0], ['O', 0.6, 0]],
    Cl2: [['Cl', -1.0, 0], ['Cl', 1.0, 0]],
    H2O: [['H', -0.76, -0.5], ['H', 0.76, -0.5], ['O', 0, 0.1]],
    CO2: [['O', -1.16, 0], ['O', 1.16, 0], ['C', 0, 0]],
    CH4: [['H', 1.09, 0], ['H', -1.09, 0], ['H', 0, 1.09], ['H', 0, -1.09], ['C', 0, 0]],
    UF6: [['F', 2.0, 0], ['F', -2.0, 0], ['F', 1.0, 1.73], ['F', -1.0, 1.73], ['F', 1.0, -1.73], ['F', -1.0, -1.73], ['U', 0, 0]]
  };
  // one molecule, shaded in the CPK colours of its atoms; s = pixels per ångström
  function drawMol(kit, c, sp, x, y, th, s, alpha) {
    const shape = SHAPES[sp] || [[sp, 0, 0]];
    const cs = Math.cos(th), sn = Math.sin(th);
    c.globalAlpha = alpha == null ? 1 : alpha;
    for (const [el, ax, ay] of shape) {
      const e = kit.chem.el(el) || { color: '#cccccc', r: 70 };
      const px = x + (ax * cs - ay * sn) * s, py = y - (ax * sn + ay * cs) * s;
      const r = (0.25 + (e.r || 70) / 100 * 0.6) * s;
      const g = c.createRadialGradient(px - r * 0.35, py - r * 0.35, r * 0.1, px, py, r);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.4, e.color); g.addColorStop(1, darker(e.color));
      c.beginPath(); c.arc(px, py, r, 0, Math.PI * 2); c.fillStyle = g; c.fill();
      c.lineWidth = 1; c.strokeStyle = 'rgba(0,0,0,.5)'; c.stroke();
    }
    c.globalAlpha = 1;
  }
  // a small ball in an element's colour (for crowded pictures)
  function ball(kit, c, sym, x, y, r, alpha) {
    const e = kit.chem.el(sym) || { color: '#cccccc' };
    c.globalAlpha = alpha == null ? 1 : alpha;
    const g = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.45, e.color); g.addColorStop(1, darker(e.color));
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = g; c.fill();
    c.lineWidth = 1; c.strokeStyle = 'rgba(0,0,0,.45)'; c.stroke();
    c.globalAlpha = 1;
  }

  /* A graph frame drawn on the stage. box = {x, y, w, h}; xr, yr = [min, max];
     o = {xlabel, ylabel, xlog, ylog, xfmt, yfmt, nx, ny}. Returns {X, Y, invX, invY, box}. */
  function graph(kit, c, box, xr, yr, o) {
    o = o || {};
    const C = kit.colors();
    const tx = v => o.xlog ? Math.log10(v) : v, ty = v => o.ylog ? Math.log10(v) : v;
    const x0 = tx(xr[0]), x1 = tx(xr[1]), y0 = ty(yr[0]), y1 = ty(yr[1]);
    const X = v => box.x + (tx(v) - x0) / (x1 - x0) * box.w;
    const Y = v => box.y + box.h - (ty(v) - y0) / (y1 - y0) * box.h;
    const g = {
      X, Y, box,
      invX: px => { const t = x0 + (px - box.x) / box.w * (x1 - x0); return o.xlog ? Math.pow(10, t) : t; },
      invY: py => { const t = y0 + (box.y + box.h - py) / box.h * (y1 - y0); return o.ylog ? Math.pow(10, t) : t; }
    };
    const ticks = (a, b, log, n) => {
      const out = [];
      if (log) { for (let e = Math.ceil(a - 1e-9); e <= b + 1e-9; e++) out.push(Math.pow(10, e)); return out; }
      const s = Hyper.niceStep(b - a, n || 6);
      for (let v = Math.ceil(a / s - 1e-9) * s; v <= b + s * 1e-6; v += s) out.push(Math.abs(v) < s * 1e-9 ? 0 : v);
      return out;
    };
    const fx = o.xfmt || (v => kit.fmt(v, 3)), fy = o.yfmt || (v => kit.fmt(v, 3));
    c.save();
    c.fillStyle = C.surface; c.fillRect(box.x, box.y, box.w, box.h);
    c.lineWidth = 1;
    for (const v of ticks(x0, x1, o.xlog, o.nx)) {
      const px = X(v);
      c.strokeStyle = C.grid; c.beginPath(); c.moveTo(Math.round(px) + 0.5, box.y); c.lineTo(Math.round(px) + 0.5, box.y + box.h); c.stroke();
      kit.label(c, fx(v), px, box.y + box.h + 11, { size: 10.5, color: C.muted, align: 'center' });
    }
    for (const v of ticks(y0, y1, o.ylog, o.ny)) {
      const py = Y(v);
      c.strokeStyle = C.grid; c.beginPath(); c.moveTo(box.x, Math.round(py) + 0.5); c.lineTo(box.x + box.w, Math.round(py) + 0.5); c.stroke();
      kit.label(c, fy(v), box.x - 5, py, { size: 10.5, color: C.muted, align: 'right' });
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(box.x, box.y, box.w, box.h);
    if (o.xlabel) kit.label(c, o.xlabel, box.x + box.w / 2, box.y + box.h + 27, { size: 11.5, color: C.text2 || C.text, align: 'center' });
    if (o.ylabel) {
      c.save(); c.translate(box.x - (o.ylabelGap || 44), box.y + box.h / 2); c.rotate(-Math.PI / 2);
      kit.label(c, o.ylabel, 0, 0, { size: 11.5, color: C.text2 || C.text, align: 'center' });
      c.restore();
    }
    c.restore();
    return g;
  }
  // a polyline in data coordinates, clipped to the graph; a null point breaks the line
  function curve(c, g, pts, color, width, dash) {
    c.save();
    c.beginPath(); c.rect(g.box.x, g.box.y, g.box.w, g.box.h); c.clip();
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []);
    c.beginPath();
    let pen = false;
    for (const p of pts) {
      if (!p) { pen = false; continue; }
      const px = g.X(p[0]), py = g.Y(p[1]);
      if (!Number.isFinite(px) || !Number.isFinite(py)) { pen = false; continue; }
      const qy = clamp(py, g.box.y - 4000, g.box.y + g.box.h + 4000);
      if (pen) c.lineTo(px, qy); else { c.moveTo(px, qy); pen = true; }
    }
    c.stroke(); c.setLineDash([]);
    c.restore();
  }
  // a filled region between a list of data points (closed polygon), clipped to the graph
  function region(c, g, pts, fill) {
    const ok = pts.filter(p => p && Number.isFinite(g.X(p[0])) && Number.isFinite(g.Y(p[1])));
    if (ok.length < 3) return;
    c.save();
    c.beginPath(); c.rect(g.box.x, g.box.y, g.box.w, g.box.h); c.clip();
    c.beginPath();
    ok.forEach((p, i) => { const px = g.X(p[0]), py = clamp(g.Y(p[1]), g.box.y - 4000, g.box.y + g.box.h + 4000); if (i) c.lineTo(px, py); else c.moveTo(px, py); });
    c.closePath(); c.fillStyle = fill; c.fill();
    c.restore();
  }
  // the real roots of x³ + a2·x² + a1·x + a0 = 0, in increasing order
  function cubicRoots(a2, a1, a0) {
    const Q = (a2 * a2 - 3 * a1) / 9, R = (2 * a2 * a2 * a2 - 9 * a2 * a1 + 27 * a0) / 54;
    if (R * R < Q * Q * Q) {
      const th = Math.acos(clamp(R / Math.sqrt(Q * Q * Q), -1, 1)), s = -2 * Math.sqrt(Q);
      return [s * Math.cos(th / 3) - a2 / 3, s * Math.cos((th + 2 * Math.PI) / 3) - a2 / 3, s * Math.cos((th - 2 * Math.PI) / 3) - a2 / 3].sort((x, y) => x - y);
    }
    const A = -Math.sign(R) * Math.cbrt(Math.abs(R) + Math.sqrt(R * R - Q * Q * Q)), B = A ? Q / A : 0;
    return [A + B - a2 / 3];
  }
  // bisection for f(x) = 0 on [lo, hi] (f changes sign)
  function bisect(f, lo, hi, n) {
    let flo = f(lo);
    for (let i = 0; i < (n || 60); i++) {
      const m = (lo + hi) / 2, fm = f(m);
      if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m;
    }
    return (lo + hi) / 2;
  }

  /* ================================================================ a gas in a cylinder */
  const GAS_LIST = [['He', 'He'], ['Ne', 'Ne'], ['N₂', 'N2'], ['O₂', 'O2'], ['Ar', 'Ar'], ['CO₂', 'CO2'], ['Xe', 'Xe']];

  Hyper.sim('state-piston', {
    title: 'Gas in a cylinder: pressure from collisions',
    blurb: `The molecules bounce off the walls and the piston, and every bounce is a small push. The **measured** pressure is those pushes added up over the last two seconds; the **ideal** pressure is $P = nRT/V$. Each drawn molecule stands for 2 mmol of gas, and the molecules never collide with one another — an ideal gas.

- **Boyle:** keep the temperature, drag the volume from 5 L down to 1 L and press **Record point** on the way. The points follow the hyperbola $PV$ = constant.
- **Charles:** hold the *pressure* (a free piston under weights) and raise the temperature: the piston rises in proportion to $T$ in kelvin. The dashed line runs back to 0 K.
- **Dalton:** add molecules of gas B. Each gas contributes in proportion to its number of molecules — a heavy, slow $\\ce{CO2}$ molecule pushes on the walls as hard, on average, as a light, fast helium atom.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const mix0 = params && +params.mix ? 1 : 0;
      const ctl = kit.controls(box.side, [
        { id: 'hold', type: 'select', label: 'Held constant', options: [['Volume: you set the piston', 'V'], ['Pressure: a free piston under weights', 'P']], value: 'V' },
        { id: 'T', label: 'Temperature', min: 100, max: 1000, step: 5, value: 300, unit: 'K' },
        { id: 'V', label: 'Volume', min: 0.5, max: 5, step: 0.05, value: 2.5, unit: 'L' },
        { id: 'Pext', label: 'Pressure of the weights', min: 0.2, max: 10, value: 1, unit: 'atm', log: true, sig: 2 },
        { id: 'nA', label: 'Molecules of gas A (2 mmol each)', min: 5, max: 150, step: 1, value: mix0 ? 60 : 80 },
        { id: 'gA', type: 'select', label: 'Gas A', options: GAS_LIST, value: mix0 ? 'He' : 'N2' },
        { id: 'nB', label: 'Molecules of gas B', min: 0, max: 120, step: 1, value: mix0 ? 40 : 0 },
        { id: 'gB', type: 'select', label: 'Gas B', options: GAS_LIST, value: 'CO2' },
        { id: 'graph', type: 'select', label: 'Graph', options: [['P against V (Boyle)', 'PV'], ['V against T (Charles)', 'VT'], ['P against T (pressure law)', 'PT']], value: 'PV' },
        { type: 'buttons', items: [{ id: 'rec', label: 'Record point', primary: true }, { id: 'clear', label: 'Clear graph' }] }
      ], (id, v) => {
        if (id === 'hold') {
          if (v === 'P') ctl.set('Pext', clamp(idealP(), 0.2, 10)); else ctl.set('V', clamp(Math.round(Vnow / 0.05) * 0.05, 0.5, 5));
          modeShow();
        } else if (id === 'T') {
          Tnow = V.T;
          thermalise();
        } else if (id === 'V') { if (V.hold === 'V') Vnow = V.V; }
        else if (id === 'nA' || id === 'nB') populate();
        else if (id === 'gA' || id === 'gB') retype();
        else if (id === 'rec') points.push({ V: Vnow, T: Tnow, P: meas.total, mode: V.hold });
        else if (id === 'clear') points = [];
        updatePlot(true);
        loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Amount of gas'], ['Pm', 'Pressure measured (wall hits)'], ['Pi', 'Pressure from PV = nRT'],
        ['PA', 'Partial pressure of A (measured)'], ['PB', 'Partial pressure of B (measured)'], ['Vr', 'Volume'], ['vr', 'Root-mean-square speeds']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'V (L)' }, y: { label: 'P (atm)', min: 0 } }, 190);
      const V = ctl.values;
      const NPER = 0.002;                               // mol per drawn molecule
      const S0 = 120 / Math.sqrt(300 / 28.014);         // px/s per √(K·mol/g): N₂ at 300 K has σ = 120 px/s
      let parts = [], points = [], Tnow = V.T, Vnow = V.V, Wb = 240, pxPerL = 50, plotClock = 0;
      const bins = [];                                  // recent wall impulses: {dt, a, b}
      const meas = { A: 0, B: 0, total: 0 };
      const M = sp => kit.chem.molarMass(sp) || 28;
      const sigma = sp => S0 * Math.sqrt(Math.max(1, Tnow) / M(sp));
      const nTot = () => (Math.round(V.nA) + Math.round(V.nB)) * NPER;
      const idealP = () => nTot() * RL * Tnow / Math.max(0.05, Vnow);
      const hNow = () => Vnow * pxPerL;

      function modeShow() { ctl.show('V', V.hold === 'V'); ctl.show('Pext', V.hold === 'P'); }
      function spawn(k) {
        const sp = k ? V.gB : V.gA, s = sigma(sp);
        parts.push({ k, sp, x: Math.random() * Wb, y: Math.random() * hNow(), vx: gauss() * s, vy: gauss() * s, th: Math.random() * 6.3, w: (Math.random() - 0.5) * 3 });
      }
      // give each gas exactly the kinetic temperature T (a small sample would otherwise be a few per cent off)
      function thermalise() {
        for (const k of [0, 1]) {
          const ps = parts.filter(p => p.k === k);
          if (!ps.length) continue;
          let s2 = 0;
          for (const p of ps) s2 += (p.vx * p.vx + p.vy * p.vy) / 2;
          s2 /= ps.length;
          const want = sigma(ps[0].sp), f = s2 > 0 ? want / Math.sqrt(s2) : 1;
          for (const p of ps) { p.vx *= f; p.vy *= f; }
        }
      }
      function populate() {
        for (const k of [0, 1]) {
          const want = Math.round(k ? V.nB : V.nA);
          let have = parts.filter(p => p.k === k).length;
          while (have < want) { spawn(k); have++; }
          while (have > want) { const i = parts.findIndex(p => p.k === k); parts.splice(i, 1); have--; }
        }
        thermalise();
      }
      function retype() {
        for (const p of parts) {
          const sp = p.k ? V.gB : V.gA;
          if (p.sp !== sp) { const f = Math.sqrt(M(p.sp) / M(sp)); p.vx *= f; p.vy *= f; p.sp = sp; }
        }
        thermalise();
      }
      function updatePlot(force) {
        const n = nTot();
        const mk = (x, y) => [x, y];
        const rec = points.map(q => V.graph === 'PV' ? mk(q.V, q.P) : V.graph === 'VT' ? mk(q.T, q.V) : mk(q.T, q.P));
        const series = [], marks = [];
        if (V.graph === 'PV') {
          const pts = [];
          for (let v = 0.5; v <= 5.001; v += 0.05) pts.push([v, n * RL * Tnow / v]);
          series.push({ pts, label: 'PV = nRT at ' + Math.round(Tnow) + ' K' });
          marks.push({ x: Vnow, y: meas.total, label: 'now' });
          plot.set({ x: { label: 'volume V (L)', min: 0, max: 5.2 }, y: { label: 'pressure P (atm)', min: 0 }, series: series.concat(rec.length ? [{ pts: rec, line: false, dots: true, label: 'recorded' }] : []), marks, vlines: [], hlines: [] });
        } else if (V.graph === 'VT') {
          const P = V.hold === 'P' ? V.Pext : Math.max(0.01, idealP());
          const f = T => n * RL * T / P;
          series.push({ pts: [[0, 0], [100, f(100)]], dash: [5, 4], label: 'extrapolated to 0 K' });
          series.push({ pts: [[100, f(100)], [1000, f(1000)]], label: 'V = nRT/P at ' + kit.fmt(P, 3) + ' atm' });
          marks.push({ x: Tnow, y: Vnow, label: 'now' });
          plot.set({ x: { label: 'temperature T (K)', min: 0, max: 1050 }, y: { label: 'volume V (L)', min: 0 }, series: series.concat(rec.length ? [{ pts: rec, line: false, dots: true, label: 'recorded' }] : []), marks, vlines: [], hlines: [] });
        } else {
          const f = T => n * RL * T / Math.max(0.05, Vnow);
          series.push({ pts: [[0, 0], [100, f(100)]], dash: [5, 4], label: 'extrapolated to 0 K' });
          series.push({ pts: [[100, f(100)], [1000, f(1000)]], label: 'P = nRT/V at ' + kit.fmt(Vnow, 3) + ' L' });
          marks.push({ x: Tnow, y: meas.total, label: 'now' });
          plot.set({ x: { label: 'temperature T (K)', min: 0, max: 1050 }, y: { label: 'pressure P (atm)', min: 0 }, series: series.concat(rec.length ? [{ pts: rec, line: false, dots: true, label: 'recorded' }] : []), marks, vlines: [], hlines: [] });
        }
      }

      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        // layout: the cylinder on the left, bars on the right
        const cx0 = 26, yF = H - 26;
        const newWb = clamp(W * 0.42, 150, 300);
        if (Math.abs(newWb - Wb) > 0.5) { for (const p of parts) p.x *= newWb / Wb; Wb = newWb; }
        const newPx = Math.max(10, (yF - 70) / 5);
        if (Math.abs(newPx - pxPerL) > 0.01) { for (const p of parts) p.y *= newPx / pxPerL; pxPerL = newPx; }
        // the piston: set by the slider, or moving towards the balance of pressures
        if (V.hold === 'P' && dt) {
          const target = clamp(nTot() * RL * Tnow / Math.max(0.05, V.Pext), 0.5, 5);
          Vnow += (target - Vnow) * Math.min(1, dt / 0.6);
        }
        const h = hNow();
        // motion with elastic walls; every bounce adds its momentum change to the tally
        let impA = 0, impB = 0;
        if (dt) {
          let vmax = 1;
          for (const p of parts) vmax = Math.max(vmax, Math.abs(p.vx), Math.abs(p.vy));
          const nsub = clamp(Math.ceil(vmax * dt / 3), 1, 24), ds = dt / nsub;
          for (let s = 0; s < nsub; s++) {
            for (const p of parts) {
              p.x += p.vx * ds; p.y += p.vy * ds;
              const m = M(p.sp);
              let imp = 0;
              if (p.x < 0) { p.x = -p.x; imp += 2 * m * Math.abs(p.vx); p.vx = Math.abs(p.vx); }
              if (p.x > Wb) { p.x = 2 * Wb - p.x; imp += 2 * m * Math.abs(p.vx); p.vx = -Math.abs(p.vx); }
              if (p.y < 0) { p.y = -p.y; imp += 2 * m * Math.abs(p.vy); p.vy = Math.abs(p.vy); }
              if (p.y > h) { p.y = Math.max(0, 2 * h - p.y); imp += 2 * m * Math.abs(p.vy); p.vy = -Math.abs(p.vy); }
              if (p.k) impB += imp; else impA += imp;
            }
          }
          for (const p of parts) p.th += p.w * dt;
          bins.push({ dt, a: impA, b: impB });
          let span = 0;
          for (const b of bins) span += b.dt;
          while (bins.length > 1 && span - bins[0].dt > 2) { span -= bins[0].dt; bins.shift(); }
          // 2-D pressure (impulse per time per wall length) → atm: a fixed calibration, since
          // for this ideal gas <m v²> ∝ T for every species and the box area ∝ V
          const per = 2 * (Wb + h);
          const K = NPER * RL * pxPerL * Wb / (S0 * S0);
          let sa = 0, sb = 0;
          for (const b of bins) { sa += b.a; sb += b.b; }
          meas.A = span > 0 ? sa / span / per * K : 0;
          meas.B = span > 0 ? sb / span / per * K : 0;
          meas.total = meas.A + meas.B;
        }
        // the cylinder
        const top = yF - h;
        c.fillStyle = C.surface; c.fillRect(cx0, top, Wb, h);
        const s = 4.2;
        for (const p of parts) drawMol(kit, c, p.sp, cx0 + p.x, yF - p.y, p.th, s);
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(cx0 - 2, yF - 5 * pxPerL - 16); c.lineTo(cx0 - 2, yF + 2); c.lineTo(cx0 + Wb + 2, yF + 2); c.lineTo(cx0 + Wb + 2, yF - 5 * pxPerL - 16); c.stroke();
        // piston and rod
        c.fillStyle = C.muted; c.fillRect(cx0, top - 10, Wb, 10);
        c.fillRect(cx0 + Wb / 2 - 4, Math.max(4, top - 40), 8, Math.max(0, top - 10 - Math.max(4, top - 40)));
        if (V.hold === 'P') {
          const nb = clamp(Math.round(Math.log(V.Pext / 0.2) / Math.log(10 / 0.2) * 4) + 1, 1, 5);
          for (let i = 0; i < nb; i++) {
            const bw = Wb * (0.5 - i * 0.05), by = top - 10 - (i + 1) * 9;
            if (by < 2) break;
            c.fillStyle = C.series[1]; c.fillRect(cx0 + (Wb - bw) / 2, by, bw, 8);
          }
          kit.label(c, 'weights: ' + kit.fmt(V.Pext, 2) + ' atm', cx0 + Wb / 2, Math.max(10, top - 10 - nb * 9 - 10), { size: 11.5, align: 'center', color: C.text });
        }
        // volume scale
        for (let L = 0; L <= 5; L++) {
          const y = yF - L * pxPerL;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(cx0 + Wb + 3, y); c.lineTo(cx0 + Wb + 9, y); c.stroke();
          kit.label(c, L + ' L', cx0 + Wb + 12, y, { size: 10, color: C.muted });
        }
        kit.label(c, 'T = ' + Math.round(Tnow) + ' K', cx0 + 4, yF + 14, { size: 11.5, color: C.muted });
        // bars: measured (filled) against PV = nRT (dashed outline)
        const nA = Math.round(V.nA), nB = Math.round(V.nB);
        const ideal = [nA, nB].map(k => k * NPER * RL * Tnow / Math.max(0.05, Vnow));
        const items = [[pretty(V.gA), meas.A, ideal[0], C.series[0]], [pretty(V.gB), meas.B, ideal[1], C.series[1]], ['total', meas.total, ideal[0] + ideal[1], C.ok]];
        const bx0 = cx0 + Wb + 48, bw = W - bx0 - 12;
        if (bw > 60) {
          const top2 = Math.max(...items.map(q => Math.max(q[1], q[2])), 0.01) * 1.15;
          const bh = yF - 60, col = Math.min(70, bw / 3);
          kit.label(c, 'pressure (atm)', bx0, 18, { size: 12, weight: 600 });
          kit.label(c, 'filled: measured · dashed: nRT/V', bx0, 34, { size: 10.5, color: C.muted });
          items.forEach(([name, m, id, color], i) => {
            const x = bx0 + i * col + col * 0.15, w = col * 0.7, yb = yF;
            c.fillStyle = color; c.globalAlpha = 0.85;
            c.fillRect(x, yb - bh * m / top2, w, bh * m / top2); c.globalAlpha = 1;
            c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([4, 3]);
            c.strokeRect(x, yb - bh * id / top2, w, bh * id / top2); c.setLineDash([]);
            kit.label(c, kit.fmt(m, 3), x + w / 2, yb - bh * Math.max(m, id) / top2 - 9, { size: 11, align: 'center' });
            kit.label(c, name, x + w / 2, yb + 12, { size: 11.5, align: 'center', weight: 600 });
          });
        }
        // read-outs
        ro.set('n', kit.fmt(nTot(), 3) + ' mol (' + (nA + nB) + ' molecules)');
        ro.set('Pm', kit.fmt(meas.total, 3) + ' atm');
        ro.set('Pi', kit.fmt(idealP(), 3) + ' atm');
        ro.set('PA', kit.fmt(meas.A, 3) + ' atm (' + pretty(V.gA) + ', x = ' + kit.fmt(nA / Math.max(1, nA + nB), 2) + ')');
        ro.set('PB', nB ? kit.fmt(meas.B, 3) + ' atm (' + pretty(V.gB) + ', x = ' + kit.fmt(nB / Math.max(1, nA + nB), 2) + ')' : '—');
        ro.set('Vr', kit.fmt(Vnow, 3) + ' L' + (V.hold === 'P' && (Vnow <= 0.5001 || Vnow >= 4.999) ? ' (piston at its stop)' : ''));
        const vr = sp => Math.round(Math.sqrt(3 * RJ * Tnow / (M(sp) / 1000)));
        ro.set('vr', pretty(V.gA) + ' ' + vr(V.gA) + ' m/s' + (nB ? ', ' + pretty(V.gB) + ' ' + vr(V.gB) + ' m/s' : ''));
        plotClock += dt || 0;
        if (plotClock > 0.3) { plotClock = 0; updatePlot(); }
      }
      populate();
      modeShow();
      const loop = kit.loop(dt => frame(dt), box.stage);
      updatePlot(true);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ speeds and effusion */
  const EFF_LIST = [['H₂', 'H2'], ['He', 'He'], ['Ne', 'Ne'], ['N₂', 'N2'], ['O₂', 'O2'], ['Ar', 'Ar'], ['CO₂', 'CO2'], ['Xe', 'Xe'], ['UF₆', 'UF6']];

  Hyper.sim('state-effusion', {
    title: 'Molecular speeds and effusion through a pinhole',
    blurb: `Two gases share the left chamber in equal numbers. Molecules that happen to reach the pinhole escape into the empty chamber on the right and are pumped away; the left chamber is topped up so its make-up never changes. The counters compare how many of each have escaped with Graham's law, $r_1/r_2 = \\sqrt{M_2/M_1}$. The graph shows the Maxwell–Boltzmann speed distributions, with dots for the molecules in the box right now.

- Helium against argon: helium escapes about 3.2 times as often. Tick **Fast forward** for better statistics.
- Raise the temperature: both distributions flatten and move to higher speeds, but the ratio of escape rates stays the same.
- Try $\\ce{UF6}$ against $\\ce{Xe}$: heavy molecules still separate, slowly. Then imagine $\\ce{^{235}UF6}$ against $\\ce{^{238}UF6}$, 349 against 352 g/mol — a ratio of only 1.0043.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'g1', type: 'select', label: 'Gas 1', options: EFF_LIST, value: (params && params.g1) || 'He' },
        { id: 'g2', type: 'select', label: 'Gas 2', options: EFF_LIST, value: (params && params.g2) || 'Ar' },
        { id: 'T', label: 'Temperature', min: 100, max: 1000, step: 5, value: 300, unit: 'K' },
        { id: 'hole', label: 'Pinhole width', min: 4, max: 30, step: 1, value: 16 },
        { id: 'fast', type: 'check', label: 'Fast forward (×4)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset counts', primary: true }] }
      ], (id, v) => {
        if (id === 'T') { const f = Math.sqrt(Math.max(1, v) / Math.max(1, Tnow)); for (const p of parts) { p.vx *= f; p.vy *= f; p.vz *= f; } Tnow = v; }
        if (id === 'g1' || id === 'g2') { for (const p of parts) { const sp = p.k ? V.g2 : V.g1; if (p.sp !== sp) { const f = Math.sqrt(M(p.sp) / M(sp)); p.vx *= f; p.vy *= f; p.vz *= f; p.sp = sp; } } }
        if (id !== 'fast' && id !== 'hole') { count = [0, 0]; clock = 0; ghosts = []; }
        replot();
        loop.once();
      });
      const ro = kit.readout(box.side, [['v1', 'v_rms, gas 1'], ['v2', 'v_rms, gas 2'], ['c', 'Escaped: gas 1 / gas 2'], ['meas', 'Measured ratio of rates'], ['gr', 'Graham: √(M₂/M₁)'], ['t', 'Time running']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'speed (m/s)', min: 0 }, y: { label: 'share per 100 m/s (%)', min: 0 } }, 180);
      const V = ctl.values;
      const N = 110;                                    // molecules of each gas in the left chamber
      const S0 = 70 / Math.sqrt(300 / 28.014);          // σ in px/s for N₂ at 300 K is 70
      const M = sp => kit.chem.molarMass(sp) || 28;
      let parts = [], ghosts = [], count = [0, 0], clock = 0, Tnow = V.T, plotClock = 0;
      let L = { w: 300, h: 200, wall: 8 };
      const sig = sp => S0 * Math.sqrt(Math.max(1, Tnow) / M(sp));
      const toReal = () => Math.sqrt(1000 * RJ) / S0;   // px/s → m/s
      function fresh(k, anywhere) {
        const sp = k ? V.g2 : V.g1, s = sig(sp);
        return { k, sp, x: anywhere ? Math.random() * L.w : Math.random() * L.w * 0.3, y: Math.random() * L.h, vx: gauss() * s, vy: gauss() * s, vz: gauss() * s, th: Math.random() * 6.3, w: (Math.random() - 0.5) * 3 };
      }
      function start() { parts = []; for (const k of [0, 1]) for (let i = 0; i < N; i++) parts.push(fresh(k, true)); }
      // Maxwell–Boltzmann speed distribution, in % per 100 m/s
      const mb = (v, Mg, T) => { const m = Mg / 1000, a = m / (2 * RJ * T); return 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v) * 100 * 100; };
      function replot() {
        const T = Math.max(1, Tnow), M1 = M(V.g1), M2 = M(V.g2);
        const vmp = Math.sqrt(2 * RJ * T / (Math.min(M1, M2) / 1000));
        const vmax = Math.min(8000, Math.max(600, Math.ceil(vmp * 3.2 / 100) * 100));
        const curveOf = Mg => { const pts = []; for (let i = 0; i <= 160; i++) { const v = vmax * i / 160; pts.push([v, mb(v, Mg, T)]); } return pts; };
        // histogram of the molecules in the box (3-D speeds)
        const nb = 24, bw = vmax / nb, f = toReal();
        const hist = [new Array(nb).fill(0), new Array(nb).fill(0)];
        for (const p of parts) { const v = Math.hypot(p.vx, p.vy, p.vz) * f, i = Math.floor(v / bw); if (i >= 0 && i < nb) hist[p.k][i]++; }
        const hp = k => hist[k].map((n, i) => [(i + 0.5) * bw, n / N / bw * 100 * 100]);
        const vr = Mg => Math.sqrt(3 * RJ * T / (Mg / 1000));
        plot.set({
          x: { label: 'speed (m/s)', min: 0, max: vmax }, y: { label: 'share per 100 m/s (%)', min: 0 },
          series: [{ pts: curveOf(M1), label: pretty(V.g1) }, { pts: curveOf(M2), label: pretty(V.g2) },
                   { pts: hp(0), line: false, dots: true, label: pretty(V.g1) + ' in the box' }, { pts: hp(1), line: false, dots: true, label: pretty(V.g2) + ' in the box' }],
          vlines: [{ x: vr(M1), label: 'v_rms ' + pretty(V.g1) }, { x: vr(M2), label: 'v_rms ' + pretty(V.g2) }], marks: [], hlines: []
        });
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const x0 = 14, y0 = 30, hh = H - y0 - 16, lw = (W - 28) * 0.5, wall = 8, rw = W - 28 - lw - wall;
        if (Math.abs(lw - L.w) > 0.5 || Math.abs(hh - L.h) > 0.5) {
          for (const p of parts) { p.x *= lw / L.w; p.y *= hh / L.h; }
          ghosts = [];
          L = { w: lw, h: hh, wall };
        }
        const hole = V.hole * Math.max(0.6, hh / 200), yc = hh / 2;
        const rate = V.fast ? 4 : 1;
        if (dt) {
          const T = dt * rate;
          clock += T;
          let vmax = 1;
          for (const p of parts) vmax = Math.max(vmax, Math.abs(p.vx), Math.abs(p.vy));
          const nsub = clamp(Math.ceil(vmax * T / 3), 1, 40), ds = T / nsub;
          for (let s = 0; s < nsub; s++) {
            for (let i = 0; i < parts.length; i++) {
              const p = parts[i];
              p.x += p.vx * ds; p.y += p.vy * ds;
              // now and then a molecule is knocked into a new, random velocity: collisions keep the gas at T
              if (Math.random() < 0.25 * ds) { const q = sig(p.sp); p.vx = gauss() * q; p.vy = gauss() * q; p.vz = gauss() * q; }
              if (p.y < 0) { p.y = -p.y; p.vy = Math.abs(p.vy); }
              if (p.y > hh) { p.y = 2 * hh - p.y; p.vy = -Math.abs(p.vy); }
              if (p.x < 0) { p.x = -p.x; p.vx = Math.abs(p.vx); }
              if (p.x > lw) {
                if (Math.abs(p.y - yc) < hole / 2) {
                  count[p.k]++;
                  if (ghosts.length < 200) ghosts.push({ sp: p.sp, x: lw + wall, y: p.y, vx: p.vx, vy: p.vy, th: p.th, w: p.w });
                  parts[i] = fresh(p.k, true);
                } else { p.x = 2 * lw - p.x; p.vx = -Math.abs(p.vx); }
              }
            }
          }
          for (const p of parts) p.th += p.w * dt;
          for (const g of ghosts) { g.x += g.vx * T; g.y += g.vy * T; g.th += g.w * dt; }
          ghosts = ghosts.filter(g => g.x < lw + wall + rw && g.y > 0 && g.y < hh);
        }
        // chambers
        c.fillStyle = C.surface; c.fillRect(x0, y0, lw, hh);
        c.fillStyle = C.bg2; c.fillRect(x0 + lw + wall, y0, rw, hh);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(x0, y0, lw + wall + rw, hh);
        c.fillStyle = C.muted;
        c.fillRect(x0 + lw, y0, wall, yc - hole / 2);
        c.fillRect(x0 + lw, y0 + yc + hole / 2, wall, hh - yc - hole / 2);
        const s = 3.2;
        for (const p of parts) drawMol(kit, c, p.sp, x0 + p.x, y0 + p.y, p.th, s);
        for (const g of ghosts) drawMol(kit, c, g.sp, x0 + g.x, y0 + g.y, g.th, s, 0.9);
        kit.label(c, 'gas at ' + Math.round(Tnow) + ' K', x0 + 4, 14, { size: 12, color: C.muted });
        kit.label(c, 'vacuum: escaped molecules are pumped away', x0 + lw + wall + rw, 14, { size: 12, color: C.muted, align: 'right' });
        kit.label(c, pretty(V.g1) + ': ' + count[0] + '   ' + pretty(V.g2) + ': ' + count[1], x0 + lw + wall + rw / 2, y0 + hh - 14, { size: 13, weight: 600, align: 'center', bg: C.bg2 });
        // read-outs
        const T = Math.max(1, Tnow), M1 = M(V.g1), M2 = M(V.g2);
        ro.set('v1', Math.round(Math.sqrt(3 * RJ * T / (M1 / 1000))) + ' m/s (' + pretty(V.g1) + ', ' + kit.fmt(M1, 4) + ' g/mol)');
        ro.set('v2', Math.round(Math.sqrt(3 * RJ * T / (M2 / 1000))) + ' m/s (' + pretty(V.g2) + ', ' + kit.fmt(M2, 4) + ' g/mol)');
        ro.set('c', count[0] + ' / ' + count[1]);
        ro.set('meas', count[1] > 0 ? kit.fmt(count[0] / count[1], 3) + ' ± ' + kit.fmt(count[0] / count[1] * Math.sqrt(1 / Math.max(1, count[0]) + 1 / count[1]), 1) : '—');
        ro.set('gr', kit.fmt(Math.sqrt(M2 / M1), 3));
        ro.set('t', kit.fmt(clock, 3) + ' s');
        plotClock += dt || 0;
        if (plotClock > 0.5) { plotClock = 0; replot(); }
      }
      start();
      const loop = kit.loop(dt => frame(dt), box.stage);
      replot();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ real gases */
  // critical constants (K, bar) — the van der Waals a and b are fitted to them
  const CRIT = {
    He: [5.195, 2.275], H2: [33.145, 12.964], N2: [126.19, 33.958], O2: [154.58, 50.43], Ar: [150.69, 48.63],
    CH4: [190.56, 45.99], CO2: [304.13, 73.77], NH3: [405.4, 113.33], H2O: [647.1, 220.64], Xe: [289.73, 58.42]
  };
  const vdwAB = g => { const [Tc, Pc] = CRIT[g]; return { a: 27 * RB * RB * Tc * Tc / (64 * Pc), b: RB * Tc / (8 * Pc), Tc, Pc }; };
  // the stable molar volume (L/mol) at P (bar) and T (K): the root of the cubic with the lowest Gibbs energy
  function vdwV(g, P, T) {
    const { a, b } = vdwAB(g);
    const rs = cubicRoots(-(P * b + RB * T) / P, a / P, -a * b / P).filter(v => v > b * 1.0000001);
    if (!rs.length) return NaN;
    let best = rs[0], bg = Infinity;
    for (const v of rs) { const G = -RB * T * Math.log(v - b) - a / v + P * v; if (G < bg) { bg = G; best = v; } }
    return best;
  }
  // the equal-area (Maxwell) construction in reduced units: P_r = 8T_r/(3V_r − 1) − 3/V_r²
  const Pr = (T, v) => 8 * T / (3 * v - 1) - 3 / (v * v);
  const maxwellCache = new Map();
  function maxwell(T) {
    if (!(T < 0.999) || T < 0.3) return null;
    const key = Math.round(T * 2000);
    if (maxwellCache.has(key)) return maxwellCache.get(key);
    const gsp = v => 4 * T * v * v * v - (3 * v - 1) * (3 * v - 1);
    const v1 = bisect(gsp, 1 / 3 + 1e-9, 1), v2 = bisect(gsp, 1, 1e4);
    const pmin = Pr(T, v1), pmax = Pr(T, v2);
    const roots = P => { const r = cubicRoots(-(P + 8 * T) / (3 * P), 3 / P, -1 / P).filter(v => v > 1 / 3); return [r[0], r[r.length - 1]]; };
    const area = P => { const [vl, vg] = roots(P); return 8 * T / 3 * Math.log((3 * vg - 1) / (3 * vl - 1)) + 3 * (1 / vg - 1 / vl) - P * (vg - vl); };
    const P = bisect(area, Math.max(pmin, 1e-12), pmax, 70);
    const [vl, vg] = roots(P);
    const out = { P, vl, vg };
    if (maxwellCache.size > 4000) maxwellCache.clear();
    maxwellCache.set(key, out);
    return out;
  }
  const RG_LIST = [['He', 'He'], ['H₂', 'H2'], ['N₂', 'N2'], ['O₂', 'O2'], ['Ar', 'Ar'], ['CH₄', 'CH4'], ['CO₂', 'CO2'], ['NH₃', 'NH3'], ['H₂O', 'H2O'], ['Xe', 'Xe']];
  const ZGASES = ['H2', 'He', 'N2', 'CH4', 'CO2'];

  Hyper.sim('state-real-gas', {
    title: 'Real gases: the compressibility factor and van der Waals isotherms',
    blurb: `Everything here comes from the van der Waals equation with $a$ and $b$ fitted to each gas's critical point.

- **Z against pressure:** at 273 K, methane and carbon dioxide dip below $Z = 1$ (attraction wins) before every gas climbs above it at high pressure (size wins). Carbon dioxide's curve breaks where the model condenses it to a liquid. Raise the temperature and the dips flatten out.
- **Isotherms:** below the critical temperature the curve develops a wiggle. The flat equal-area line is where liquid and vapour coexist, and the shaded dome is the two-phase region. Above $T_c$ no pressure makes a liquid.
- Compare the ideal isotherm (dashed) with the real one at small volumes, where the molecules' own size takes over.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Z against pressure (five gases)', 'Z'], ['Isotherms of one gas', 'iso']], value: (params && params.mode) || 'Z' },
        { id: 'T', label: 'Temperature', min: 150, max: 1000, step: 1, value: 273, unit: 'K' },
        { id: 'P', label: 'Pressure to read Z at', min: 1, max: 1000, value: 100, unit: 'bar', log: true, sig: 3 },
        { id: 'gas', type: 'select', label: 'Gas', options: RG_LIST, value: 'CO2' },
        { id: 'tr', label: 'Temperature ÷ critical temperature', min: 0.7, max: 1.5, step: 0.01, value: 0.9 },
        { id: 'eq', type: 'check', label: 'Show the equal-area line', value: true }
      ], () => { showMode(); loop.once(); });
      const ro = kit.readout(box.side, [['r1', '—'], ['r2', '—'], ['r3', '—'], ['r4', '—'], ['r5', '—'], ['r6', '—']]);
      const V = ctl.values;
      const setRow = (k, label, value) => {
        const el = ro.el && ro.el.children;
        if (el && el.length) { const i = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].indexOf(k); if (el[2 * i]) el[2 * i].textContent = label; }
        ro.set(k, value);
      };
      function showMode() {
        const z = V.mode === 'Z';
        ctl.show('T', z); ctl.show('P', z); ctl.show('gas', !z); ctl.show('tr', !z); ctl.show('eq', !z);
      }
      function drawZ(c, C) {
        const W = st.W, H = st.H;
        const g = graph(kit, c, { x: 60, y: 16, w: W - 80, h: H - 66 }, [0, 1000], [0, 2.2], { xlabel: 'pressure (bar)', ylabel: 'Z = PV/(nRT)', nx: 10, ny: 11 });
        curve(c, g, [[0, 1], [1000, 1]], C.muted, 1.5, [6, 4]);
        kit.label(c, 'ideal gas', g.X(990), g.Y(1) - 9, { size: 11, color: C.muted, align: 'right' });
        const T = Math.max(1, V.T);
        ZGASES.forEach((gs, k) => {
          const pts = [];
          let last = null;
          for (let i = 0; i <= 250; i++) {
            const P = 0.5 + i * 4;
            const v = vdwV(gs, P, T);
            if (!Number.isFinite(v)) { pts.push(null); continue; }
            const Z = P * v / (RB * T);
            if (last != null && Math.abs(Z - last) > 0.12) {
              pts.push(null);
              curve(c, g, [[P, last], [P, Z]], C.series[k], 1.2, [2, 3]);
            }
            pts.push([P, Z]); last = Z;
          }
          curve(c, g, pts, C.series[k], 2.2);
          const vend = vdwV(gs, 1000, T), zend = 1000 * vend / (RB * T);
          if (Number.isFinite(zend) && zend < 2.2) kit.label(c, pretty(gs), g.X(1000) + 3, g.Y(zend), { size: 11, color: C.series[k], weight: 600 });
        });
        // the reading line
        const Pq = V.P;
        c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(g.X(Pq), g.box.y); c.lineTo(g.X(Pq), g.box.y + g.box.h); c.stroke(); c.setLineDash([]);
        ZGASES.forEach((gs, k) => {
          const v = vdwV(gs, Pq, T), Z = Pq * v / (RB * T);
          if (Number.isFinite(Z)) kit.dot(c, g.X(Pq), g.Y(clamp(Z, 0, 2.2)), 4, C.series[k], C.bg2);
          setRow('r' + (k + 1), 'Z of ' + pretty(gs) + ' at ' + kit.fmt(Pq, 3) + ' bar', Number.isFinite(Z) ? kit.fmt(Z, 3) + (Z < 0.35 ? ' (liquid)' : '') : '—');
        });
        setRow('r6', 'Temperature', Math.round(T) + ' K (' + Math.round(T - 273.15) + ' °C)');
        kit.label(c, 'van der Waals model at ' + Math.round(T) + ' K', g.box.x + 8, g.box.y + 12, { size: 12, weight: 600 });
      }
      function drawIso(c, C) {
        const W = st.W, H = st.H;
        const { a, b, Tc, Pc } = vdwAB(V.gas);
        const vmin = b * 1.02, vmax = b * 16;
        const g = graph(kit, c, { x: 60, y: 16, w: W - 80, h: H - 66 }, [0, vmax], [-0.4 * Pc, 2 * Pc], { xlabel: 'molar volume V_m (L/mol)', ylabel: 'pressure (bar)', nx: 8, ny: 8 });
        curve(c, g, [[0, 0], [vmax, 0]], C.faint, 1);
        const iso = T => { const pts = []; for (let i = 0; i <= 300; i++) { const v = vmin * Math.pow(vmax / vmin, i / 300); pts.push([v, RB * T / (v - b) - a / (v * v)]); } return pts; };
        // the two-phase dome, from equal areas in reduced units
        const left = [], right = [];
        for (let t = 0.55; t < 0.999; t += 0.0075) { const m = maxwell(t); if (m) { left.push([m.vl * 3 * b, m.P * Pc]); right.push([m.vg * 3 * b, m.P * Pc]); } }
        left.push([3 * b, Pc]);
        const dome = left.concat(right.reverse());
        region(c, g, dome.concat([[dome[dome.length - 1][0], 0], [dome[0][0], 0]]), 'rgba(120,140,255,0.12)');
        curve(c, g, dome, C.muted, 1.2, [4, 3]);
        kit.label(c, 'liquid + vapour', g.X(3 * b), g.Y(0.25 * Pc), { size: 11, color: C.muted, align: 'center' });
        for (const tr of [0.8, 0.9, 1.0, 1.2, 1.5]) curve(c, g, iso(tr * Tc), tr === 1 ? C.warn : C.faint, tr === 1 ? 1.6 : 1.1);
        const T = V.tr * Tc;
        curve(c, g, iso(T).map(p => [p[0], RB * T / p[0]]), C.muted, 1.5, [6, 4]);
        curve(c, g, iso(T), C.accent, 2.6);
        const m = maxwell(V.tr);
        if (m && V.eq) {
          const vl = m.vl * 3 * b, vg = m.vg * 3 * b, Ps = m.P * Pc;
          // the two equal areas between the loop and the line
          const lobe = [];
          for (let i = 0; i <= 120; i++) { const v = vl + (vg - vl) * i / 120; lobe.push([v, RB * T / (v - b) - a / (v * v)]); }
          region(c, g, lobe.concat([[vg, Ps], [vl, Ps]]), 'rgba(224,160,48,0.28)');
          curve(c, g, [[vl, Ps], [vg, Ps]], C.warn, 2.4);
          kit.dot(c, g.X(vl), g.Y(Ps), 4, C.warn); kit.dot(c, g.X(vg), g.Y(Ps), 4, C.warn);
          setRow('r4', 'Vapour pressure (equal areas)', kit.fmt(Ps, 3) + ' bar');
          setRow('r5', 'Liquid / vapour molar volume', kit.fmt(vl, 3) + ' / ' + kit.fmt(vg, 3) + ' L/mol');
        } else {
          setRow('r4', 'Vapour pressure (equal areas)', V.tr >= 1 ? 'none: above T_c' : '(line hidden)');
          setRow('r5', 'Liquid / vapour molar volume', V.tr >= 1 ? 'one fluid phase' : '—');
        }
        kit.dot(c, g.X(3 * b), g.Y(Pc), 5, C.bad);
        kit.label(c, 'critical point', g.X(3 * b) + 8, g.Y(Pc) - 10, { size: 11, color: C.bad });
        kit.label(c, pretty(V.gas) + ' at ' + Math.round(T) + ' K (T/T_c = ' + V.tr.toFixed(2) + ')', g.box.x + 8, g.box.y + 12, { size: 12, weight: 600 });
        kit.label(c, 'bold: van der Waals · dashed: ideal gas', g.box.x + 8, g.box.y + 30, { size: 11, color: C.muted });
        setRow('r1', 'Temperature', Math.round(T) + ' K (' + Math.round(T - 273.15) + ' °C)');
        setRow('r2', 'Critical point (model)', kit.fmt(Tc, 4) + ' K, ' + kit.fmt(Pc, 3) + ' bar');
        setRow('r3', 'a, b', kit.fmt(a, 3) + ' L²·bar/mol², ' + kit.fmt(b, 3) + ' L/mol');
        setRow('r6', 'Ideal gas at the same V and T', 'dashed curve');
      }
      function frame() {
        const C = kit.colors();
        const c = st.begin();
        if (V.mode === 'Z') drawZ(c, C); else drawIso(c, C);
      }
      showMode();
      const loop = kit.loop(() => frame(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ vapour pressure */
  // vapour pressure in kPa at t °C: water from the Wagner–Pruss equation, the others from Antoine fits (mmHg, °C)
  const TcW = 647.096, PcW = 22.064e6, TtW = 273.16, PtW = 611.657;
  function pWater(T) {        // Pa, T in K (liquid–vapour line; extrapolates smoothly a little below 0 °C)
    const t = 1 - T / TcW;
    return PcW * Math.exp(TcW / T * (-7.85951783 * t + 1.84408259 * Math.pow(t, 1.5) - 11.7866497 * t * t * t + 22.6807411 * Math.pow(t, 3.5) - 15.9618719 * t * t * t * t + 1.80122502 * Math.pow(t, 7.5)));
  }
  const LIQUIDS = [
    { name: 'Water', f: 'H2O', shape: 'H2O', p: t => pWater(t + 273.15) / 1000 },
    { name: 'Ethanol', f: 'C2H6O', shape: 'EtOH', ant: [8.20417, 1642.89, 230.300] },
    { name: 'Acetone', f: 'C3H6O', shape: 'Me2CO', ant: [7.02447, 1161.0, 224.0] },
    { name: 'Diethyl ether', f: 'C4H10O', shape: 'Et2O', ant: [6.92032, 1064.07, 228.8] },
    { name: 'Benzene', f: 'C6H6', shape: 'C6H6', ant: [6.90565, 1211.033, 220.790] }
  ];
  SHAPES.EtOH = [['C', -1.25, -0.35], ['C', 0, 0.4], ['O', 1.2, -0.3]];
  SHAPES.Me2CO = [['C', -1.3, -0.5], ['C', 1.3, -0.5], ['O', 0, 1.35], ['C', 0, 0.15]];
  SHAPES.Et2O = [['C', -2.4, -0.3], ['C', -1.2, 0.4], ['O', 0, -0.3], ['C', 1.2, 0.4], ['C', 2.4, -0.3]];
  SHAPES.C6H6 = [0, 1, 2, 3, 4, 5].map(i => ['C', 1.4 * Math.cos(i * Math.PI / 3), 1.4 * Math.sin(i * Math.PI / 3)]);
  const pLiq = (L, t) => L.p ? L.p(t) : Math.pow(10, L.ant[0] - L.ant[1] / (L.ant[2] + t)) * 101.325 / 760;
  // the temperature (°C) at which the vapour pressure reaches P (kPa)
  const boilAt = (L, P) => bisect(t => pLiq(L, t) - P, -60, 250, 60);
  const OUTSIDE = [['Sea level: 1 atm', 101.325], ['Denver, 1600 m: 0.83 atm', 83.7], ['Mont Blanc, 4800 m: 0.55 atm', 55.7], ['Everest summit: 0.33 atm', 33.7], ['Pressure cooker: 2 atm', 202.65]];

  Hyper.sim('state-vapour', {
    title: 'Vapour pressure in a closed flask',
    blurb: `Molecules leave the liquid at a steady rate set by the temperature; vapour molecules that hit the surface are captured. The vapour builds up until as many return as leave — a dynamic equilibrium — and the pressure it then exerts is the vapour pressure. Each drawn molecule stands for a fixed share of the pressure (chosen per liquid so the flask never overflows).

- Press **Empty the vapour** and watch the count climb back to the same level: the balance does not depend on where you start.
- Warm the flask: evaporation speeds up, and the balance settles at a higher pressure — exponentially higher.
- Pick an outside pressure: an open pan boils where the curve meets that line. Try Everest and the pressure cooker.
- Switch the graph to **ln P against 1/T**: the curves become nearly straight, with slope −ΔH_vap/R (Clausius–Clapeyron).`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'liq', type: 'select', label: 'Liquid', options: LIQUIDS.map((L, i) => [L.name, i]), value: 0 },
        { id: 't', label: 'Temperature', min: 0, max: 100, step: 1, value: 60, unit: '°C' },
        { id: 'out', type: 'select', label: 'Outside pressure (for boiling)', options: OUTSIDE, value: 101.325 },
        { id: 'graph', type: 'select', label: 'Graph', options: [['P against T', 'pt'], ['ln P against 1/T (Clausius–Clapeyron)', 'lnp']], value: (params && params.graph) || 'pt' },
        { type: 'buttons', items: [{ id: 'empty', label: 'Empty the vapour', primary: true }] }
      ], (id, v) => {
        if (id === 'liq') { vap = []; rates = []; }
        if (id === 'empty') { vap = []; rates = []; }
        if (id === 't') { const f = Math.sqrt((v + 273.15) / (tNow + 273.15)); for (const m of vap) { m.vx *= f; m.vy *= f; } tNow = v; }
        replot();
        loop.once();
      });
      const ro = kit.readout(box.side, [['pm', 'Vapour pressure (molecules counted)'], ['pd', 'Vapour pressure (measured data)'], ['ev', 'Leaving the liquid per second'], ['co', 'Captured by the liquid per second'], ['bp', 'Boiling point at the outside pressure'], ['dh', 'ΔH_vap from the slope of ln P']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'temperature (°C)' }, y: { label: 'vapour pressure (kPa)', min: 0 } }, 190);
      const V = ctl.values;
      let vap = [], rates = [], tNow = V.t, emitAcc = 0, lastBox = null, plotClock = 0;
      const L = () => LIQUIDS[V.liq] || LIQUIDS[0];
      const M = () => kit.chem.molarMass(L().f) || 18;
      const S0 = 240 / Math.sqrt(300 / 18.015);                 // σ = 240 px/s for water at 300 K, so the flask fills in seconds
      const sig = () => S0 * Math.sqrt((tNow + 273.15) / M());
      const perKPa = () => 200 / pLiq(L(), 100);                // drawn molecules per kPa
      const slopeDH = t => { const h = 0.5, a = pLiq(L(), t - h), b = pLiq(L(), t + h); return -RJ * (Math.log(b) - Math.log(a)) / (1 / (t + h + 273.15) - 1 / (t - h + 273.15)); };
      function replot() {
        const Lq = L(), Pout = V.out;
        const series = [], vlines = [], hlines = [], marks = [];
        const tb = boilAt(Lq, Pout);
        if (V.graph === 'lnp') {
          LIQUIDS.forEach((Q, i) => {
            const pts = [];
            for (let t = 0; t <= 100.01; t += 2) pts.push([1000 / (t + 273.15), Math.log(pLiq(Q, t))]);
            series.push({ pts, label: Q.name, width: Q === Lq ? 3 : 1.2, dash: Q === Lq ? null : [4, 3] });
          });
          hlines.push({ y: Math.log(Pout), label: 'ln(outside pressure)' });
          marks.push({ x: 1000 / (tNow + 273.15), y: Math.log(pLiq(Lq, tNow)), label: Lq.name + ' now' });
          plot.set({ x: { label: '1000 / T  (1/K, from 100 °C on the left to 0 °C on the right)', min: 2.6, max: 3.7 }, y: { label: 'ln (P / kPa)' }, series, vlines, hlines, marks });
        } else {
          LIQUIDS.forEach(Q => {
            const pts = [];
            for (let t = 0; t <= 100.01; t += 1) pts.push([t, pLiq(Q, t)]);
            series.push({ pts, label: Q.name, width: Q === Lq ? 3 : 1.2, dash: Q === Lq ? null : [4, 3] });
          });
          hlines.push({ y: Pout, label: 'outside pressure' });
          if (tb > 0 && tb < 100) vlines.push({ x: tb, label: 'boils at ' + tb.toFixed(1) + ' °C' });
          marks.push({ x: tNow, y: pLiq(Lq, tNow), label: Lq.name + ' now' });
          plot.set({ x: { label: 'temperature (°C)', min: 0, max: 100 }, y: { label: 'vapour pressure (kPa)', min: 0, max: Math.max(1.15 * Pout, 1.1 * pLiq(Lq, 100)) }, series, vlines, hlines, marks });
        }
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const fx = 30, fy = 34, fw = Math.min(W * 0.55, 420), fh = H - fy - 18;
        const liqH = fh * 0.28, ys = fh - liqH;                  // liquid surface, measured from the top of the flask
        if (lastBox && (lastBox.fw !== fw || lastBox.ys !== ys)) for (const m of vap) { m.x *= fw / lastBox.fw; m.y *= ys / lastBox.ys; }
        lastBox = { fw, ys };
        const Lq = L(), s = sig();
        const Peq = pLiq(Lq, tNow), Neq = Math.min(360, Peq * perKPa());
        let nEv = 0, nCo = 0;
        if (dt) {
          // evaporation: a steady rate that would keep Neq molecules in the space (each hits the surface at <|v_y|>/2h per second)
          const rate = Neq * s * Math.sqrt(2 / Math.PI) / (2 * Math.max(10, ys));
          emitAcc += rate * dt;
          while (emitAcc >= 1) {
            emitAcc -= 1; nEv++;
            vap.push({ x: Math.random() * fw, y: ys - 1, vx: gauss() * s, vy: -s * Math.sqrt(-2 * Math.log(1 - Math.random() * 0.999999)), th: Math.random() * 6.3, w: (Math.random() - 0.5) * 3 });
          }
          const nsub = clamp(Math.ceil(4 * s * dt / 4), 1, 20), ds = dt / nsub;
          for (let k = 0; k < nsub; k++) for (const m of vap) {
            m.x += m.vx * ds; m.y += m.vy * ds;
            if (m.x < 0) { m.x = -m.x; m.vx = Math.abs(m.vx); }
            if (m.x > fw) { m.x = 2 * fw - m.x; m.vx = -Math.abs(m.vx); }
            if (m.y < 0) { m.y = -m.y; m.vy = Math.abs(m.vy); }
            if (m.y >= ys) m.dead = true;
          }
          for (const m of vap) m.th += m.w * dt;
          nCo = vap.filter(m => m.dead).length;
          vap = vap.filter(m => !m.dead);
          rates.push({ dt, e: nEv, c: nCo });
          let span = 0;
          for (const r of rates) span += r.dt;
          while (rates.length > 1 && span - rates[0].dt > 3) { span -= rates[0].dt; rates.shift(); }
        }
        // the flask
        c.fillStyle = C.surface; c.fillRect(fx, fy, fw, ys);
        const hue = { H2O: 'rgba(80,150,255,0.35)', C2H6O: 'rgba(120,200,160,0.35)', C3H6O: 'rgba(230,180,90,0.35)', C4H10O: 'rgba(200,140,230,0.35)', C6H6: 'rgba(240,120,120,0.30)' }[Lq.f] || 'rgba(100,150,255,0.3)';
        c.fillStyle = hue; c.fillRect(fx, fy + ys, fw, liqH);
        // molecules packed in the liquid, jiggling
        const sc = 3.4, gap = Lq.shape === 'Et2O' ? 22 : 16;
        const tt = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
        for (let yy = fy + ys + 9, row = 0; yy < fy + fh - 6; yy += gap * 0.8, row++) {
          for (let xx = fx + 10 + (row % 2) * gap / 2; xx < fx + fw - 8; xx += gap) {
            const j = 1.2 + (tNow / 100) * 1.5;
            drawMol(kit, c, Lq.shape, xx + Math.sin(tt * 7 + xx * 0.7 + yy) * j, yy + Math.cos(tt * 6 + xx + yy * 0.3) * j, xx * 0.1 + yy + tt * 0.6, sc, 0.55);
          }
        }
        for (const m of vap) drawMol(kit, c, Lq.shape, fx + m.x, fy + m.y, m.th, sc);
        const boiling = Peq >= V.out;
        if (boiling) {
          for (let i = 0; i < 7; i++) {
            const bx = fx + fw * ((i * 0.137 + 0.07) % 1), by = fy + fh - ((tt * 40 + i * 23) % liqH);
            c.beginPath(); c.arc(bx, by, 3 + (i % 3), 0, Math.PI * 2); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
          }
        }
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.strokeRect(fx, fy, fw, fh);
        kit.label(c, Lq.name + ' at ' + Math.round(tNow) + ' °C, sealed flask', fx, 16, { size: 13, weight: 600 });
        // the gauge: counted molecules against the balance value
        const gx = fx + fw + 36, gw = Math.max(40, Math.min(90, W - gx - 30));
        if (W - gx > 70) {
          const Pm = vap.length / perKPa(), top = Math.max(Peq, V.out, Pm, 0.01) * 1.2;
          const gh = fh - 30, g0 = fy + fh;
          c.fillStyle = C.series[0]; c.fillRect(gx, g0 - gh * Pm / top, gw * 0.45, gh * Pm / top);
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([4, 3]);
          c.strokeRect(gx, g0 - gh * Peq / top, gw * 0.45, gh * Peq / top); c.setLineDash([]);
          c.strokeStyle = C.warn; c.lineWidth = 2;
          c.beginPath(); c.moveTo(gx - 6, g0 - gh * V.out / top); c.lineTo(gx + gw * 0.45 + 6, g0 - gh * V.out / top); c.stroke();
          kit.label(c, 'outside', gx + gw * 0.45 + 9, g0 - gh * V.out / top, { size: 10.5, color: C.warn });
          kit.label(c, kit.fmt(Pm, 3) + ' kPa', gx + gw * 0.22, g0 - gh * Pm / top - 10, { size: 11, align: 'center' });
          kit.label(c, 'vapour', gx + gw * 0.22, g0 + 11, { size: 11, align: 'center', color: C.muted });
          kit.label(c, 'dashed: balance', gx - 4, fy - 12, { size: 10.5, color: C.muted });
        }
        kit.label(c, boiling ? 'an open pan at this outside pressure would boil' : 'each molecule drawn ≈ ' + kit.fmt(1 / perKPa(), 2) + ' kPa', fx + fw / 2, fy + fh + 11, { size: 11, align: 'center', color: boiling ? C.warn : C.muted });
        // read-outs
        let span = 0, se = 0, sco = 0;
        for (const r of rates) { span += r.dt; se += r.e; sco += r.c; }
        ro.set('pm', kit.fmt(vap.length / perKPa(), 3) + ' kPa (' + vap.length + ' molecules)');
        ro.set('pd', kit.fmt(Peq, 4) + ' kPa = ' + kit.fmt(Peq / 101.325, 3) + ' atm');
        ro.set('ev', span > 0.5 ? kit.fmt(se / span, 3) + ' drawn molecules/s' : '—');
        ro.set('co', span > 0.5 ? kit.fmt(sco / span, 3) + ' drawn molecules/s' : '—');
        const tb = boilAt(Lq, V.out);
        ro.set('bp', kit.fmt(tb, 4) + ' °C at ' + kit.fmt(V.out / 101.325, 2) + ' atm');
        ro.set('dh', kit.fmt(slopeDH(tNow) / 1000, 3) + ' kJ/mol at ' + Math.round(tNow) + ' °C');
        plotClock += dt || 0;
        if (plotClock > 1) { plotClock = 0; replot(); }
      }
      const loop = kit.loop(dt => frame(dt), box.stage);
      replot();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ phase diagrams */
  // water: Wagner–Pruss (liquid–vapour), IAPWS sublimation and ice Ih melting fits; CO₂: Span–Wagner fits
  function pSubWater(T) { const th = T / TtW; return PtW * Math.exp((-21.2144006 * Math.pow(th, 0.00333333333) + 27.3203819 * Math.pow(th, 1.20666667) - 6.10598130 * Math.pow(th, 1.70333333)) / th); }
  function pMeltWater(T) { const th = T / TtW; return PtW * (1 + 1.19539337e6 * (1 - Math.pow(th, 3)) + 8.08183159e4 * (1 - Math.pow(th, 25.75)) + 3.33826860e3 * (1 - Math.pow(th, 103.75))); }
  const TcC = 304.1282, PcC = 7.3773e6, TtC = 216.592, PtC = 0.51795e6;
  function pCO2(T) { const t = 1 - T / TcC; return PcC * Math.exp(TcC / T * (-7.0602087 * t + 1.9391218 * Math.pow(t, 1.5) - 1.6463597 * t * t - 3.2995634 * t * t * t * t)); }
  function pSubCO2(T) { const u = Math.max(0, 1 - T / TtC); return PtC * Math.exp(TtC / T * (-14.740846 * u + 2.4327015 * Math.pow(u, 1.9) - 5.3061778 * Math.pow(u, 2.9))); }
  function pMeltCO2(T) { const u = T / TtC - 1; return PtC * (1 + 1955.5390 * u + 2055.4593 * u * u); }
  const SUBST = {
    H2O: { name: 'Water', Tt: TtW, Pt: PtW, Tc: TcW, Pc: PcW, vap: pWater, sub: pSubWater, full: { T: [200, 700], P: [1, 1e8] }, zoom: { T: [243.15, 403.15], P: [30, 1e6] } },
    CO2: { name: 'Carbon dioxide', Tt: TtC, Pt: PtC, Tc: TcC, Pc: PcC, vap: pCO2, sub: pSubCO2, full: { T: [150, 350], P: [1e3, 1e8] } }
  };

  Hyper.sim('state-phase', {
    title: 'Phase diagram explorer',
    blurb: `Drag the point (or click anywhere) to choose a temperature and pressure; the read-out names the stable phase and the panel shows how the molecules are arranged. The curves are drawn to scale from accurate fits to measured data, with a logarithmic pressure axis.

- Water: follow the dashed 1 atm line to find the normal melting and boiling points. Drop below the triple point (611 Pa) and ice turns straight into vapour — freeze-drying.
- Carbon dioxide: the triple point is above 1 atm, so at 1 atm the solid sublimes at −78.5 °C. Go above 31 °C and 73 atm to reach the supercritical fluid.
- Water, zoomed in: dissolve a solute. The liquid's vapour-pressure curve drops, so it meets the ice curve at a lower temperature and the 1 atm line at a higher one: freezing-point depression and boiling-point elevation.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const zoom0 = !!(params && +params.zoom), sol0 = params && params.solute != null ? +params.solute : 0;
      const ctl = kit.controls(box.side, [
        { id: 'sub', type: 'select', label: 'Substance', options: [['Water', 'H2O'], ['Carbon dioxide', 'CO2']], value: (params && params.sub) || 'H2O' },
        { id: 'zoom', type: 'check', label: 'Zoom in: −30 °C to 130 °C (water)', value: zoom0 },
        { id: 'b', label: 'Dissolved particles, i·b (water)', min: 0, max: 6, step: 0.1, value: sol0, unit: 'mol/kg' },
        { id: 'go', type: 'select', label: 'Go to', options: [['(drag the point)', ''], ['20 °C and 1 atm', 'room'], ['the triple point', 'tp'], ['the critical point', 'cp'], ['melting (or subliming) at 1 atm', 'mp'], ['boiling at 1 atm', 'bp'], ['a freeze-dryer: −20 °C, 50 Pa', 'fd']], value: '' }
      ], (id, v) => {
        if (id === 'sub') { if (V.sub === 'CO2') { ctl.set('zoom', false); ctl.set('b', 0); } showCtl(); goTo('room'); }
        if (id === 'zoom' && V.sub === 'CO2') ctl.set('zoom', false);
        if (id === 'b') { if (V.sub !== 'H2O') ctl.set('b', 0); }
        if (id === 'go' && v) goTo(v);
        loop.once();
      });
      const ro = kit.readout(box.side, [['phase', 'Phase'], ['T', 'Temperature'], ['P', 'Pressure'], ['m', 'At this pressure it melts at'], ['bo', 'At this pressure it boils at'], ['col', 'Solution: freezing / boiling at 1 atm']]);
      const V = ctl.values;
      const state = { T: 293.15, P: ATM };
      let G = null;
      const S = () => SUBST[V.sub] || SUBST.H2O;
      const xw = () => V.sub === 'H2O' ? 55.508 / (55.508 + Math.max(0, V.b)) : 1;
      function showCtl() { const w = V.sub === 'H2O'; ctl.show('zoom', w); ctl.show('b', w); ro.show('col', w); }
      // the solution's triple point: where x·p_liquid(T) meets the ice curve
      function triple() {
        const s = S(), x = xw();
        if (x >= 0.99999) return { T: s.Tt, P: s.Pt, shift: 0 };
        const T = bisect(T => x * s.vap(T) - s.sub(T), 200, s.Tt, 60);
        return { T, P: s.sub(T), shift: s.Tt - T };
      }
      function liqVap(T) { return xw() * S().vap(T); }
      function meltP(T, tr) {          // melting pressure at T, shifted by the solute
        if (V.sub === 'CO2') return pMeltCO2(T);
        const Te = T + tr.shift;
        return Te >= TtW ? NaN : Te < 251.165 ? Infinity : pMeltWater(Te);
      }
      function phaseAt(T, P, trc) {
        const s = S(), tr = trc || triple();
        if (T >= s.Tc && P >= s.Pc) return 'supercritical fluid';
        if (P >= tr.P) {
          const solid = V.sub === 'CO2' ? P > pMeltCO2(T) : (T + tr.shift < TtW && (T + tr.shift < 251.165 || P < pMeltWater(T + tr.shift)));
          if (solid) return 'solid';
          if (T < s.Tc && P >= liqVap(T)) return 'liquid';
          return 'gas';
        }
        return (T < tr.T && P >= s.sub(T)) ? 'solid' : 'gas';
      }
      // where the horizontal line at pressure P crosses the melting and boiling curves
      function crossings(P) {
        const s = S(), tr = triple();
        let melt = null, boil = null, subl = null;
        if (P < tr.P) subl = bisect(T => s.sub(T) - P, 100, tr.T, 60);
        else {
          if (V.sub === 'CO2') melt = bisect(T => pMeltCO2(T) - P, TtC, 400, 60);
          else if (P < pMeltWater(251.2)) melt = bisect(T => pMeltWater(T + tr.shift) - P, 251.2 - tr.shift, TtW - tr.shift + 0.01, 60);
          if (P < s.Pc) boil = bisect(T => liqVap(T) - P, tr.T - 1, s.Tc, 60);
        }
        return { melt, boil, subl };
      }
      function goTo(k) {
        const s = S(), tr = triple();
        if (k === 'room') { state.T = 293.15; state.P = ATM; }
        if (k === 'tp') { state.T = tr.T; state.P = tr.P; }
        if (k === 'cp') { state.T = s.Tc; state.P = s.Pc; }
        if (k === 'mp') { const cr = crossings(ATM); state.T = cr.melt || cr.subl || state.T; state.P = ATM; }
        if (k === 'bp') { const cr = crossings(ATM); state.T = cr.boil || cr.subl || state.T; state.P = ATM; }
        if (k === 'fd') { state.T = 253.15; state.P = 50; }
        const r = range();
        state.T = clamp(state.T, r.T[0], r.T[1]); state.P = clamp(state.P, r.P[0], r.P[1]);
      }
      const range = () => (V.sub === 'H2O' && V.zoom) ? S().zoom : S().full;
      const fmtP = P => P >= 1e6 ? kit.fmt(P / 1e6, 3) + ' MPa' : P >= 1e3 ? kit.fmt(P / 1e3, 3) + ' kPa' : kit.fmt(P, 3) + ' Pa';
      const fmtC = t => (Math.round(t * 100) / 100).toFixed(2).replace('-', '−') + ' °C';
      const fmtT = T => fmtC(T - 273.15) + ' (' + (T).toFixed(2) + ' K)';
      // the phase, or the phases that coexist when the point sits on a boundary
      function phaseName(T, P, tr) {
        const s = S();
        if (Math.abs(T - s.Tc) < 0.3 && Math.abs(P / s.Pc - 1) < 0.01) return 'the critical point';
        const set = [];
        for (const [dT, f] of [[0, 1], [0.06, 1], [-0.06, 1], [0, 1.004], [0, 0.996], [0.06, 1.01], [-0.06, 0.99]]) { const ph = phaseAt(T + dT, P * f, tr); if (!set.includes(ph)) set.push(ph); }
        const order = ['solid', 'liquid', 'gas', 'supercritical fluid'];
        set.sort((a, b) => order.indexOf(a) - order.indexOf(b));
        return set.length === 1 ? set[0] : set.length === 3 ? 'triple point: solid, liquid and gas together' : set.join(' and ') + ' in equilibrium';
      }
      const pLabel = v => v >= 1e6 ? kit.fmt(v / 1e6, 2) + ' M' : v >= 1e3 ? kit.fmt(v / 1e3, 2) + ' k' : kit.fmt(v, 2);
      kit.drag(st, {
        hit: p => G && p.x >= G.box.x && p.x <= G.box.x + G.box.w && p.y >= G.box.y && p.y <= G.box.y + G.box.h ? 'pt' : null,
        move: (_, p) => {
          if (!G) return;
          const r = range();
          state.T = clamp(G.invX(clamp(p.x, G.box.x, G.box.x + G.box.w)) + 273.15, r.T[0], r.T[1]);
          state.P = clamp(G.invY(clamp(p.y, G.box.y, G.box.y + G.box.h)), r.P[0], r.P[1]);
          ctl.set('go', '');
          loop.once();
        },
        hover: true
      });
      // a little window onto the molecules
      const dots = [];
      for (let i = 0; i < 25; i++) dots.push({ x: Math.random(), y: Math.random(), vx: Math.random() - 0.5, vy: Math.random() - 0.5 });
      function drawWindow(c, C, x0, y0, w, ph, dt) {
        c.fillStyle = C.bg2; c.fillRect(x0, y0, w, w);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x0, y0, w, w);
        const n = ph === 'gas' ? 6 : ph === 'supercritical fluid' ? 14 : 25;
        const speed = ph === 'solid' ? 0 : ph === 'liquid' ? 0.12 : ph === 'gas' ? 0.9 : 0.6;
        const sp = V.sub === 'CO2' ? 'CO2' : 'H2O', sc = w / 55;
        const tt = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
        for (let i = 0; i < n; i++) {
          const d = dots[i];
          let px, py;
          if (ph === 'solid') {
            const a = 0.012 + 0.02 * clamp(state.T / 300, 0, 1.5);
            px = 0.1 + (i % 5) * 0.2 + Math.sin(tt * 9 + i * 1.7) * a; py = 0.1 + Math.floor(i / 5) * 0.2 + Math.cos(tt * 8 + i * 2.3) * a;
          } else {
            if (dt) { d.x += d.vx * speed * dt; d.y += d.vy * speed * dt; if (ph === 'liquid') { d.vx += (Math.random() - 0.5) * 0.6 * dt * 10; d.vy += (Math.random() - 0.5) * 0.6 * dt * 10; const m = Math.hypot(d.vx, d.vy) || 1; d.vx /= m; d.vy /= m; } }
            if (d.x < 0.06) { d.x = 0.06; d.vx = Math.abs(d.vx); } if (d.x > 0.94) { d.x = 0.94; d.vx = -Math.abs(d.vx); }
            if (d.y < 0.06) { d.y = 0.06; d.vy = Math.abs(d.vy); } if (d.y > 0.94) { d.y = 0.94; d.vy = -Math.abs(d.vy); }
            px = d.x; py = d.y;
          }
          drawMol(kit, c, sp, x0 + px * w, y0 + py * w, i * 0.8 + (ph === 'solid' ? 0 : tt * (0.5 + (i % 3))), sc);
        }
        kit.label(c, ph, x0 + w / 2, y0 + w + 11, { size: 11, align: 'center', color: C.text });
      }
      const PH_COL = { solid: 'rgba(150,170,200,0.30)', liquid: 'rgba(60,140,255,0.26)', gas: 'rgba(255,190,90,0.20)', 'supercritical fluid': 'rgba(190,110,255,0.22)' };
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const s = S(), r = range(), tr = triple();
        const win = Math.min(110, W * 0.18);
        const gb = { x: 64, y: 14, w: W - 64 - win - 34, h: H - 58 };
        G = graph(kit, c, gb, [r.T[0] - 273.15, r.T[1] - 273.15], r.P, { ylog: true, xlabel: 'temperature (°C)', ylabel: 'pressure (Pa)', yfmt: pLabel, nx: 8, ylabelGap: 50 });
        // shade the phases on a coarse grid
        const cell = 6;
        c.save();
        for (let px = gb.x; px < gb.x + gb.w; px += cell) {
          const T = G.invX(px + cell / 2) + 273.15;
          for (let py = gb.y; py < gb.y + gb.h; py += cell) {
            const ph = phaseAt(T, G.invY(py + cell / 2), tr);
            c.fillStyle = PH_COL[ph]; c.fillRect(px, py, Math.min(cell, gb.x + gb.w - px), Math.min(cell, gb.y + gb.h - py));
          }
        }
        c.restore();
        // the boundaries
        const line = (f, a, b, color, width, dash) => { const pts = []; for (let i = 0; i <= 200; i++) { const T = a + (b - a) * i / 200; const P = f(T); pts.push(Number.isFinite(P) && P > 0 ? [T - 273.15, P] : null); } curve(c, G, pts, color, width, dash); };
        if (V.sub === 'H2O' && V.b > 0) {
          // the pure water lines, for comparison
          line(pWater, TtW, TcW, C.muted, 1.2, [5, 4]);
          line(T => pMeltWater(T), 251.2, TtW, C.muted, 1.2, [5, 4]);
        }
        line(s.sub, r.T[0], tr.T, C.text, 2);
        line(liqVap, tr.T, s.Tc, C.text, 2);
        if (V.sub === 'CO2') line(pMeltCO2, TtC, r.T[1], C.text, 2);
        else line(T => meltP(T, tr), Math.max(r.T[0], 251.2 - tr.shift), tr.T - 1e-9, C.text, 2);
        // 1 atm
        curve(c, G, [[r.T[0] - 273.15, ATM], [r.T[1] - 273.15, ATM]], C.accent, 1.2, [6, 4]);
        kit.label(c, '1 atm', gb.x + 6, G.Y(ATM) - 9, { size: 11, color: C.accent });
        // special points
        const inView = (T, P) => T >= r.T[0] && T <= r.T[1] && P >= r.P[0] && P <= r.P[1];
        if (inView(tr.T, tr.P)) { kit.dot(c, G.X(tr.T - 273.15), G.Y(tr.P), 5, C.bad, C.bg2); kit.label(c, 'triple point', G.X(tr.T - 273.15) + 8, G.Y(tr.P) + 12, { size: 11, color: C.bad }); }
        if (inView(s.Tc, s.Pc)) { kit.dot(c, G.X(s.Tc - 273.15), G.Y(s.Pc), 5, C.bad, C.bg2); kit.label(c, 'critical point', G.X(s.Tc - 273.15) - 8, G.Y(s.Pc) - 12, { size: 11, color: C.bad, align: 'right' }); }
        const cr1 = crossings(ATM);
        for (const T of [cr1.melt, cr1.boil, cr1.subl]) if (T && inView(T, ATM)) kit.dot(c, G.X(T - 273.15), G.Y(ATM), 3.5, C.accent);
        // region names
        const nameAt = (txt, T, P) => { if (inView(T, P)) kit.label(c, txt, G.X(T - 273.15), G.Y(P), { size: 12.5, weight: 600, color: C.text, align: 'center' }); };
        if (V.sub === 'CO2') { nameAt('SOLID', 190, 3e6); nameAt('LIQUID', 270, 2e7); nameAt('GAS', 280, 1e4); nameAt('SUPERCRITICAL', 330, 3e7); }
        else if (V.zoom) { nameAt('ICE', 255, 5e4); nameAt('LIQUID', 320, 3e5); nameAt('VAPOUR', 345, 300); }
        // (water's supercritical corner is too small for its name beside the critical-point label: the shading and the read-out name it)
        else { nameAt('ICE', 225, 1e5); nameAt('LIQUID', 450, 1e7); nameAt('VAPOUR', 500, 100); }
        // the state point
        const ph = phaseAt(state.T, state.P, tr);
        const sx = G.X(state.T - 273.15), sy = G.Y(state.P);
        c.strokeStyle = C.accent; c.lineWidth = 1; c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(gb.x, sy); c.lineTo(sx, sy); c.moveTo(sx, gb.y + gb.h); c.lineTo(sx, sy); c.stroke(); c.setLineDash([]);
        kit.dot(c, sx, sy, 7, C.accent, C.text);
        drawWindow(c, C, W - win - 12, 20, win, ph, dt);
        kit.label(c, s.name + (V.sub === 'H2O' && V.b > 0 ? ' with a solute (dashed: pure water)' : ''), gb.x + 8, gb.y + 12, { size: 12, weight: 600, bg: C.bg2 });
        // read-outs
        ro.set('phase', phaseName(state.T, state.P, tr));
        ro.set('T', fmtT(state.T));
        ro.set('P', fmtP(state.P) + ' = ' + kit.fmt(state.P / ATM, 3) + ' atm');
        const cr = crossings(state.P);
        ro.set('m', cr.subl ? 'sublimes at ' + fmtC(cr.subl - 273.15) : cr.melt ? fmtC(cr.melt - 273.15) : '—');
        ro.set('bo', cr.boil ? fmtC(cr.boil - 273.15) : cr.subl ? 'no liquid below the triple point' : 'no boiling above the critical pressure');
        if (V.sub === 'H2O') {
          const b = Math.max(0, V.b);
          ro.set('col', b > 0 && cr1.melt && cr1.boil ? fmtC(cr1.melt - 273.15) + ' / ' + fmtC(cr1.boil - 273.15) + ' (Kf·b: −' + kit.fmt(1.86 * b, 3) + ' K, Kb·b: +' + kit.fmt(0.512 * b, 3) + ' K)' : 'pure water: 0.00 °C / 99.97 °C');
        }
      }
      showCtl();
      goTo(V.sub === 'H2O' && V.zoom ? 'room' : 'room');
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ unit cells */
  const CELLS = [
    { name: 'Polonium: simple cubic', type: 'sc', el: ['Po'], a: 335.9, rho: 9.20 },
    { name: 'Iron: body-centred cubic', type: 'bcc', el: ['Fe'], a: 286.65, rho: 7.87 },
    { name: 'Sodium: body-centred cubic', type: 'bcc', el: ['Na'], a: 429.06, rho: 0.968 },
    { name: 'Tungsten: body-centred cubic', type: 'bcc', el: ['W'], a: 316.52, rho: 19.25 },
    { name: 'Copper: face-centred cubic', type: 'fcc', el: ['Cu'], a: 361.49, rho: 8.96 },
    { name: 'Aluminium: face-centred cubic', type: 'fcc', el: ['Al'], a: 404.95, rho: 2.70 },
    { name: 'Gold: face-centred cubic', type: 'fcc', el: ['Au'], a: 407.82, rho: 19.30 },
    { name: 'Sodium chloride: rock salt', type: 'nacl', el: ['Cl', 'Na'], a: 564.0, rho: 2.165, r: [181, 102], f: 'NaCl' },
    { name: 'Caesium chloride', type: 'cscl', el: ['Cl', 'Cs'], a: 412.3, rho: 3.99, r: [181, 174], f: 'CsCl' }
  ];
  // sites in fractional coordinates [x, y, z, kind]; kind 0 = first element, 1 = second
  function sites(type, n) {
    const out = [], seen = new Set();
    const add = (x, y, z, k) => { const key = [x, y, z].map(v => Math.round(v * 1000)).join(','); if (!seen.has(key)) { seen.add(key); out.push([x, y, z, k]); } };
    const basis = {
      sc: [[0, 0, 0, 0]], bcc: [[0, 0, 0, 0], [0.5, 0.5, 0.5, 0]], fcc: [[0, 0, 0, 0], [0.5, 0.5, 0, 0], [0.5, 0, 0.5, 0], [0, 0.5, 0.5, 0]],
      nacl: [[0, 0, 0, 0], [0.5, 0.5, 0, 0], [0.5, 0, 0.5, 0], [0, 0.5, 0.5, 0], [0.5, 0, 0, 1], [0, 0.5, 0, 1], [0, 0, 0.5, 1], [0.5, 0.5, 0.5, 1]],
      cscl: [[0, 0, 0, 0], [0.5, 0.5, 0.5, 1]]
    }[type];
    // every image of the basis that falls inside the block [0, n]³
    for (let i = -1; i <= n; i++) for (let j = -1; j <= n; j++) for (let k = -1; k <= n; k++) for (const [x, y, z, kd] of basis) {
      const X = i + x, Y = j + y, Z = k + z;
      if (X >= -1e-9 && X <= n + 1e-9 && Y >= -1e-9 && Y <= n + 1e-9 && Z >= -1e-9 && Z <= n + 1e-9) add(X, Y, Z, kd);
    }
    return out;
  }
  const SHARE = p => { const onB = v => Math.abs(v) < 1e-9 || Math.abs(v - 1) < 1e-9; const n = [p[0], p[1], p[2]].filter(onB).length; return [1, 0.5, 0.25, 0.125][n]; };

  Hyper.sim('state-unitcell', {
    title: 'Unit cells in 3-D',
    blurb: `Drag to turn the crystal. The coloured rings show how much of each atom belongs to this cell: a corner atom is shared by 8 cells, a face atom by 2, an edge atom by 4; an atom in the body belongs wholly to it.

- Count copper: 8 corners × ⅛ + 6 faces × ½ = 4 atoms per cell. The read-out turns that, the cell edge and the molar mass into a density, and compares it with the measured one.
- Switch to **touching spheres** to see how much space each packing fills: 52 %, 68 % or 74 %.
- **Neighbours** shows eight cells around one atom and joins it to its nearest neighbours: 6, 8 or 12 — and 6 of the other ion in rock salt, 8 in caesium chloride.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 320 });
      const c0 = params && params.cell != null ? +params.cell : 4;
      const ctl = kit.controls(box.side, [
        { id: 'cell', type: 'select', label: 'Crystal', options: CELLS.map((q, i) => [q.name, i]), value: c0 },
        { id: 'view', type: 'select', label: 'Show', options: [['Lattice points (small balls)', 'pts'], ['Touching spheres (true size)', 'fill'], ['Neighbours of one atom (8 cells)', 'nb']], value: 'pts' },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: true }
      ], () => { build(); loop.once(); });
      const ro = kit.readout(box.side, [['type', 'Structure'], ['z', 'Atoms per cell'], ['cn', 'Nearest neighbours'], ['a', 'Cell edge a'], ['r', 'Radius'], ['pf', 'Space filled'], ['rho', 'Density from the cell'], ['meas', 'Measured density']]);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.42, rotY: 0.62 });
      kit.mol.rotator(st, view, () => loop.once());
      let atoms = [], edges = [], centre = [0, 0, 0], block = 1;
      const Q = () => CELLS[V.cell] || CELLS[4];
      function radii(q) {
        if (q.r) return q.r.map(r => r / q.a);
        return [{ sc: 0.5, bcc: Math.sqrt(3) / 4, fcc: Math.SQRT2 / 4 }[q.type]];
      }
      function build() {
        const q = Q();
        block = V.view === 'nb' ? 2 : 1;
        const list = sites(q.type, block);
        centre = [block / 2, block / 2, block / 2];
        atoms = list.map(p => ({ p: [p[0], p[1], p[2]], k: p[3], share: block === 1 ? SHARE(p) : 1 }));
        // nearest neighbours of the atom at the centre of the block
        if (block === 2) {
          const c = atoms.find(a => a.p.every(v => Math.abs(v - 1) < 1e-9));
          let dmin = Infinity;
          for (const a of atoms) if (a !== c && a.k !== (q.type === 'nacl' || q.type === 'cscl' ? c.k : -1)) { const d = Math.hypot(a.p[0] - 1, a.p[1] - 1, a.p[2] - 1); if (d > 1e-6) dmin = Math.min(dmin, d); }
          for (const a of atoms) { a.centre = a === c; const d = Math.hypot(a.p[0] - 1, a.p[1] - 1, a.p[2] - 1); a.nb = !a.centre && Math.abs(d - dmin) < 1e-6 && (q.type === 'nacl' || q.type === 'cscl' ? a.k !== c.k : true); }
        }
        edges = [];
        for (let i = 0; i <= block; i++) for (let j = 0; j <= block; j++) {
          edges.push([[0, i, j], [block, i, j]]); edges.push([[i, 0, j], [i, block, j]]); edges.push([[i, j, 0], [i, j, block]]);
        }
        describe();
      }
      function describe() {
        const q = Q();
        const Mf = q.f ? kit.chem.molarMass(q.f) : kit.chem.el(q.el[0]).mass;
        const Z = { sc: 1, bcc: 2, fcc: 4, nacl: 4, cscl: 1 }[q.type];
        const cn = { sc: '6', bcc: '8', fcc: '12', nacl: '6 of the other ion (6 : 6)', cscl: '8 of the other ion (8 : 8)' }[q.type];
        const zt = { sc: '8 × ⅛ = 1', bcc: '8 × ⅛ + 1 = 2', fcc: '8 × ⅛ + 6 × ½ = 4', nacl: 'Cl⁻: 8 × ⅛ + 6 × ½ = 4; Na⁺: 12 × ¼ + 1 = 4', cscl: 'Cl⁻: 8 × ⅛ = 1; Cs⁺: 1' }[q.type];
        const aCm = q.a * 1e-10;
        const rho = Z * Mf / (6.02214076e23 * aCm * aCm * aCm);
        const rr = radii(q).map(x => x * q.a);
        let pf;
        if (q.r) pf = Z * 4 / 3 * Math.PI * (Math.pow(q.r[0], 3) + Math.pow(q.r[1], 3)) / Math.pow(q.a, 3);
        else pf = Z * 4 / 3 * Math.PI * Math.pow(rr[0], 3) / Math.pow(q.a, 3);
        ro.set('type', { sc: 'simple cubic', bcc: 'body-centred cubic', fcc: 'face-centred cubic', nacl: 'rock salt (fcc Cl⁻, Na⁺ in the gaps)', cscl: 'simple cubic, two-ion basis' }[q.type]);
        ro.set('z', zt + (q.f ? ' formula units' : ' atoms'));
        ro.set('cn', cn);
        ro.set('a', kit.fmt(q.a, 4) + ' pm');
        ro.set('r', q.r ? pretty(q.el[1]) + '⁺ ' + q.r[1] + ' pm, Cl⁻ ' + q.r[0] + ' pm (ionic)' : kit.fmt(rr[0], 4) + ' pm (from a)');
        ro.set('pf', kit.fmt(pf * 100, 3) + ' %');
        ro.set('rho', kit.fmt(rho, 4) + ' g/cm³  (Z·M/(N_A·a³), M = ' + kit.fmt(Mf, 5) + ' g/mol)');
        ro.set('meas', q.rho + ' g/cm³');
      }
      const project = (p, W, H, sc) => {
        const x = p[0] - centre[0], y = p[1] - centre[1], z = p[2] - centre[2];
        const cy = Math.cos(view.rotY), sy = Math.sin(view.rotY), cx = Math.cos(view.rotX), sx = Math.sin(view.rotX);
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
        const d = 5 * block, f = d / (d - z2);
        return { x: W / 2 + x1 * sc * f, y: H / 2 + 6 - y2 * sc * f, z: z2, f };
      };
      function frame(dt) {
        if (V.spin && !view.dragging) view.rotY += 0.3 * (dt || 0);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, q = Q();
        const sc = Math.min(W, H) * (block === 1 ? 0.42 : 0.26);
        const rr = radii(q);
        const items = [];
        for (const e of edges) {
          const A = project(e[0], W, H, sc), B = project(e[1], W, H, sc);
          items.push({ z: (A.z + B.z) / 2 - 0.01, draw: () => { c.strokeStyle = C.muted; c.globalAlpha = 0.8; c.lineWidth = 1.3; c.beginPath(); c.moveTo(A.x, A.y); c.lineTo(B.x, B.y); c.stroke(); c.globalAlpha = 1; } });
        }
        const shareCol = s => s === 1 ? C.series[3] : s === 0.5 ? C.series[1] : s === 0.25 ? C.series[2] : C.series[0];
        const cAt = atoms.find(a => a.centre);
        for (const a of atoms) {
          const P = project(a.p, W, H, sc);
          const sym = q.el[a.k] || q.el[0];
          const rad = V.view === 'fill' ? (rr[a.k] || rr[0]) * sc * P.f : (q.r ? (a.k ? 0.09 : 0.13) : 0.11) * sc * P.f * (block === 2 ? 1.2 : 1);
          const faded = block === 2 && !a.centre && !a.nb;
          items.push({ z: P.z, draw: () => {
            ball(kit, c, sym, P.x, P.y, Math.max(2, rad), faded ? 0.25 : 1);
            if (block === 1 && V.view === 'pts') { c.strokeStyle = shareCol(a.share); c.lineWidth = 2.5; c.beginPath(); c.arc(P.x, P.y, Math.max(2, rad) + 3, 0, Math.PI * 2); c.stroke(); }
            if (a.centre) { c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.arc(P.x, P.y, Math.max(2, rad) + 3, 0, Math.PI * 2); c.stroke(); }
          } });
          if (a.nb && cAt) {
            const P0 = project(cAt.p, W, H, sc);
            items.push({ z: (P.z + P0.z) / 2, draw: () => { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(P0.x, P0.y); c.lineTo(P.x, P.y); c.stroke(); } });
          }
        }
        items.sort((u, v) => u.z - v.z);
        for (const it of items) it.draw();
        kit.label(c, q.name, 14, 18, { size: 15, weight: 650 });
        if (block === 1 && V.view === 'pts') {
          const leg = [['corner: ⅛', C.series[0]], ['edge: ¼', C.series[2]], ['face: ½', C.series[1]], ['body: 1', C.series[3]]];
          leg.forEach(([t, col], i) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.arc(20, 44 + i * 18, 5, 0, Math.PI * 2); c.stroke(); kit.label(c, t, 32, 44 + i * 18, { size: 11.5, color: C.muted }); });
        }
        if (q.r) kit.label(c, pretty(q.el[1]) + '⁺ and Cl⁻ (green)', 14, H - 16, { size: 11.5, color: C.muted });
        kit.label(c, 'drag to turn', W - 14, H - 14, { size: 11, color: C.faint, align: 'right' });
      }
      build();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Raoult's law and distillation */
  const PAIRS = [
    { name: 'Benzene + toluene', A: { name: 'benzene', ant: [6.90565, 1211.033, 220.790] }, B: { name: 'toluene', ant: [6.95464, 1344.8, 219.482] } },
    { name: 'Hexane + heptane', A: { name: 'hexane', ant: [6.87601, 1171.17, 224.41] }, B: { name: 'heptane', ant: [6.89385, 1264.37, 216.636] } }
  ];
  const pAnt = (ant, t) => Math.pow(10, ant[0] - ant[1] / (ant[2] + t)) * 101.325 / 760;   // kPa at t °C

  Hyper.sim('state-raoult', {
    title: 'Raoult\'s law and distillation',
    blurb: `An ideal mixture of two liquids: each contributes its mole fraction times its own vapour pressure, so the vapour is always richer in the more volatile one (blue). The diagram shows where the liquid starts to boil (lower curve) and the composition of the first vapour (upper curve); the horizontal tie line joins them.

- Press **Distil one step**: the vapour is condensed and becomes the new liquid. The staircase climbs towards pure benzene — each step is one theoretical plate of a fractionating column.
- Switch to **vapour pressure at fixed T**: the total pressure is a straight line between the two pure liquids (Raoult), while the vapour curve bows below it.
- Compare hexane + heptane, whose boiling points are 30 K apart: how many steps to reach 95 %?`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'Mixture', options: PAIRS.map((p, i) => [p.name, i]), value: 0 },
        { id: 'x', label: 'Mole fraction of the more volatile liquid', min: 0, max: 1, step: 0.01, value: params && params.x != null ? +params.x : 0.3 },
        { id: 'mode', type: 'select', label: 'Diagram', options: [['Boiling diagram at 1 atm (T against x)', 'Tx'], ['Vapour pressure at a fixed temperature (P against x)', 'Px']], value: 'Tx' },
        { id: 't', label: 'Temperature (for the P diagram)', min: 20, max: 100, step: 1, value: 25, unit: '°C' },
        { type: 'buttons', items: [{ id: 'step', label: 'Distil one step', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], (id) => {
        if (id === 'step') {
          const y = vapourY();
          stairs.push({ x: V.x, y, T: V.mode === 'Tx' ? bubbleT(V.x) : null, P: V.mode === 'Px' ? totalP(V.x) : null, mode: V.mode });
          ctl.set('x', Math.min(1, Math.round(y * 1000) / 1000));
        } else if (id === 'reset' || id === 'pair' || id === 'mode') stairs = [];
        ctl.show('t', V.mode === 'Px');
        for (const m of liq) m.k = null;
        loop.once();
      });
      const ro = kit.readout(box.side, [['x', 'Liquid: more volatile component'], ['y', 'Vapour: more volatile component'], ['T', 'Boiling point of the liquid (1 atm)'], ['P', 'Vapour pressures at the chosen T'], ['n', 'Distillation steps so far']]);
      const V = ctl.values;
      let stairs = [];
      const Pr_ = () => PAIRS[V.pair] || PAIRS[0];
      const PA = t => pAnt(Pr_().A.ant, t), PB = t => pAnt(Pr_().B.ant, t);
      const bubbleT = x => bisect(t => x * PA(t) + (1 - x) * PB(t) - 101.325, -20, 200, 50);
      const totalP = x => x * PA(V.t) + (1 - x) * PB(V.t);
      const vapourY = () => {
        if (V.mode === 'Tx') { const t = bubbleT(V.x); return V.x * PA(t) / 101.325; }
        return V.x * PA(V.t) / Math.max(1e-9, totalP(V.x));
      };
      // molecules in the flask: species chosen to match x in the liquid and y in the vapour
      const liq = [], vap = [];
      for (let i = 0; i < 60; i++) liq.push({ u: Math.random(), v: Math.random(), ph: Math.random() * 6.3, k: null });
      for (let i = 0; i < 22; i++) vap.push({ u: Math.random(), v: Math.random(), vx: Math.random() - 0.5, vy: Math.random() - 0.5, k: Math.random() < 0.5 ? 1 : 0 });
      let swapClock = 0;
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, P = Pr_();
        const y = clamp(vapourY(), 0, 1);
        // liquid species: exactly round(60x) of A
        const nA = Math.round(60 * V.x);
        if (liq.some(m => m.k == null) || liq.filter(m => m.k === 1).length !== nA) {
          const idx = liq.map((m, i) => i).sort(() => Math.random() - 0.5);
          idx.forEach((i, j) => { liq[i].k = j < nA ? 1 : 0; });
        }
        // vapour: now and then one molecule condenses and another evaporates, chosen by y
        swapClock += dt || 0;
        while (swapClock > 0.08) { swapClock -= 0.08; const m = vap[Math.floor(Math.random() * vap.length)]; m.k = Math.random() < y ? 1 : 0; m.flash = 0.4; }
        const fx = 20, fw = Math.min(W * 0.34, 260), fy = 40, fh = H - 70, ls = fy + fh * 0.55;
        c.fillStyle = C.surface; c.fillRect(fx, fy, fw, fh);
        c.fillStyle = 'rgba(120,160,255,0.16)'; c.fillRect(fx, ls, fw, fy + fh - ls);
        const colA = C.series[0], colB = C.series[1];
        const tt = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
        for (const m of liq) {
          const px = fx + 8 + m.u * (fw - 16) + Math.sin(tt * 3 + m.ph) * 2, py = ls + 8 + m.v * (fy + fh - ls - 16) + Math.cos(tt * 2.6 + m.ph) * 2;
          kit.dot(c, px, py, 5, m.k ? colA : colB, 'rgba(0,0,0,.35)');
        }
        for (const m of vap) {
          if (dt) { m.u += m.vx * 0.5 * dt; m.v += m.vy * 0.5 * dt; if (m.u < 0 || m.u > 1) { m.vx = -m.vx; m.u = clamp(m.u, 0, 1); } if (m.v < 0 || m.v > 1) { m.vy = -m.vy; m.v = clamp(m.v, 0, 1); } if (m.flash) m.flash = Math.max(0, m.flash - dt); }
          kit.dot(c, fx + 8 + m.u * (fw - 16), fy + 8 + m.v * (ls - fy - 16), 5, m.k ? colA : colB, m.flash ? C.warn : 'rgba(0,0,0,.35)');
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(fx, fy, fw, fh);
        kit.label(c, 'vapour: ' + Math.round(y * 100) + ' % ' + P.A.name, fx + fw / 2, fy - 12, { size: 12, align: 'center', weight: 600 });
        kit.label(c, 'liquid: ' + Math.round(V.x * 100) + ' % ' + P.A.name, fx + fw / 2, fy + fh + 12, { size: 12, align: 'center', weight: 600 });
        kit.dot(c, fx + 6, 14, 5, colA); kit.label(c, P.A.name, fx + 15, 14, { size: 11.5 });
        kit.dot(c, fx + 90, 14, 5, colB); kit.label(c, P.B.name, fx + 99, 14, { size: 11.5 });
        // the diagram
        const gb = { x: fx + fw + 70, y: 16, w: W - (fx + fw + 70) - 16, h: H - 60 };
        if (gb.w < 80) return;
        if (V.mode === 'Tx') {
          const tA = bubbleT(1), tB = bubbleT(0);
          const lo = Math.floor(tA / 5) * 5 - 5, hi = Math.ceil(tB / 5) * 5 + 5;
          const g = graph(kit, c, gb, [0, 1], [lo, hi], { xlabel: 'mole fraction of ' + P.A.name, ylabel: 'temperature (°C)', nx: 5, ny: 6 });
          const bub = [], dew = [];
          for (let i = 0; i <= 60; i++) { const x = i / 60; bub.push([x, bubbleT(x)]); }
          for (let i = 0; i <= 60; i++) { const t = tA + (tB - tA) * i / 60, a = PA(t), b = PB(t); const x = (101.325 - b) / (a - b); dew.push([clamp(x * a / 101.325, 0, 1), t]); }
          region(c, g, bub.concat(dew.slice().reverse()), 'rgba(120,140,255,0.12)');
          curve(c, g, bub, C.series[2], 2.4); curve(c, g, dew, C.series[4], 2.4);
          kit.label(c, 'boiling starts (liquid)', g.X(0.62), g.Y(bubbleT(0.62)) + 14, { size: 11, color: C.series[2] });
          kit.label(c, 'first vapour', g.X(0.36), g.Y(bubbleT(0.2)) - 8, { size: 11, color: C.series[4] });
          kit.label(c, 'vapour', g.X(0.8), g.Y(hi - 3), { size: 12, weight: 600, align: 'center', color: C.muted });
          kit.label(c, 'liquid', g.X(0.2), g.Y(lo + 3), { size: 12, weight: 600, align: 'center', color: C.muted });
          for (const s of stairs.filter(q => q.mode === 'Tx')) {
            curve(c, g, [[s.x, s.T], [s.y, s.T], [s.y, bubbleT(s.y)]], C.warn, 1.6);
          }
          const t = bubbleT(V.x);
          curve(c, g, [[V.x, lo], [V.x, t]], C.accent, 1.2, [3, 3]);
          curve(c, g, [[V.x, t], [y, t]], C.accent, 2.2);
          kit.dot(c, g.X(V.x), g.Y(t), 5, C.series[2], C.text); kit.dot(c, g.X(y), g.Y(t), 5, C.series[4], C.text);
          ro.set('T', kit.fmt(t, 4) + ' °C');
          ro.set('P', '(boiling diagram: 1 atm)');
        } else {
          const a = PA(V.t), b = PB(V.t);
          const g = graph(kit, c, gb, [0, 1], [0, a * 1.1], { xlabel: 'mole fraction of ' + P.A.name + ' (liquid x, vapour y)', ylabel: 'pressure (kPa)', nx: 5, ny: 6 });
          const bub = [[0, b], [1, a]], dew = [];
          for (let i = 0; i <= 60; i++) { const yy = i / 60; dew.push([yy, 1 / (yy / a + (1 - yy) / b)]); }
          region(c, g, bub.concat(dew.slice().reverse()), 'rgba(120,140,255,0.12)');
          curve(c, g, [[0, 0], [1, a]], colA, 1.2, [5, 4]); curve(c, g, [[0, b], [1, 0]], colB, 1.2, [5, 4]);
          curve(c, g, bub, C.series[2], 2.4); curve(c, g, dew, C.series[4], 2.4);
          kit.label(c, 'total (Raoult: a straight line)', g.X(0.5), g.Y((a + b) / 2) - 14, { size: 11, color: C.series[2], align: 'center' });
          kit.label(c, 'partial pressures (dashed)', g.X(0.03), g.Y(a * 1.03), { size: 11, color: C.muted });
          for (const s of stairs.filter(q => q.mode === 'Px')) curve(c, g, [[s.x, s.P], [s.y, s.P], [s.y, totalP(s.y)]], C.warn, 1.6);
          const Pt = totalP(V.x);
          curve(c, g, [[V.x, Pt], [y, Pt]], C.accent, 2.2);
          kit.dot(c, g.X(V.x), g.Y(Pt), 5, C.series[2], C.text); kit.dot(c, g.X(y), g.Y(Pt), 5, C.series[4], C.text);
          ro.set('T', kit.fmt(bubbleT(V.x), 4) + ' °C');
          ro.set('P', P.A.name + ' ' + kit.fmt(V.x * a, 3) + ' + ' + P.B.name + ' ' + kit.fmt((1 - V.x) * b, 3) + ' = ' + kit.fmt(Pt, 3) + ' kPa at ' + Math.round(V.t) + ' °C');
        }
        ro.set('x', kit.fmt(V.x, 3));
        ro.set('y', kit.fmt(y, 3));
        ro.set('n', String(stairs.length));
      }
      ctl.show('t', V.mode === 'Px');
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ osmosis */
  const SOLUTES = [
    { id: 'glc', name: 'Glucose', i: 1, atoms: ['C'] },
    { id: 'nacl', name: 'Sodium chloride', i: 1.9, atoms: ['Na', 'Cl'] },
    { id: 'cacl2', name: 'Calcium chloride', i: 2.7, atoms: ['Ca', 'Cl', 'Cl'] }
  ];

  Hyper.sim('state-osmosis', {
    title: 'Osmosis in a U-tube',
    blurb: `A membrane at the bottom lets water through but not the dissolved particles. Water crosses faster into the solution than back, so the solution side rises until the extra weight of its column, $\\rho g\\,\\Delta h$, balances the osmotic pressure $\\Pi = icRT$.

- Real osmotic pressures are big: even 5 mM of glucose holds up more than a metre of water (watch the scale). 0.1 M sugar would hold up 25 m.
- Switch to sodium chloride at the same concentration: about twice the particles, about twice the height.
- Press on the solution side with more than $\\Pi$ and the flow reverses — reverse osmosis, the way seawater is made drinkable.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sol', type: 'select', label: 'Solute', options: SOLUTES.map(s => [s.name + ' (i ≈ ' + s.i + ')', s.id]), value: 'glc' },
        { id: 'c', label: 'Concentration', min: 0.5, max: 20, value: params && params.c ? +params.c : 5, unit: 'mM', log: true, sig: 2 },
        { id: 't', label: 'Temperature', min: 0, max: 60, step: 1, value: 25, unit: '°C' },
        { id: 'pa', label: 'Extra pressure on the solution side', min: 0, max: 150, step: 1, value: 0, unit: 'kPa' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again (levels equal)', primary: true }] }
      ], id => { if (id === 'reset') dh = 0; if (id === 'sol') seed(); loop.once(); });
      const ro = kit.readout(box.side, [['pi', 'Osmotic pressure Π = icRT'], ['h', 'Height difference now'], ['heq', 'Height at balance, (Π − P_extra)/ρg'], ['flow', 'Net flow of water'], ['col', 'Same solution: ΔT_f, ΔT_b']]);
      const V = ctl.values;
      const RHO = 1000, G = 9.80665;
      let dh = 0, scale = 1, flowPhase = 0;               // dh: solution level minus water level (m); scale: metres per pixel
      const S = () => SOLUTES.find(s => s.id === V.sol) || SOLUTES[0];
      const Pi = () => S().i * V.c * RJ * (V.t + 273.15);   // Pa (c in mM = mol/m³)
      const heq = () => (Pi() - V.pa * 1000) / (RHO * G);
      const water = [], solute = [];
      for (let i = 0; i < 70; i++) water.push({ side: i % 2, u: Math.random(), v: Math.random(), ph: Math.random() * 6.3 });
      function seed() { solute.length = 0; for (let i = 0; i < 14; i++) solute.push({ u: Math.random(), v: Math.random(), ph: Math.random() * 6.3 }); }
      seed();
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        // level dynamics: the flow is proportional to the pressure imbalance (time constant 4 s)
        const target = heq();
        if (dt) dh += (target - dh) * Math.min(1, dt / 4);
        const drive = (Pi() - V.pa * 1000 - RHO * G * dh);     // Pa; positive: water flows into the solution
        // geometry
        const aw = Math.min(90, W * 0.12), gap = Math.min(170, W * 0.22), x0 = 60, xl = x0, xr = x0 + aw + gap;
        const yb = H - 40, th = 34, armTop = 26, mid = armTop + (yb - th - armTop) * 0.55;
        const room = (yb - th - armTop) * 0.4;
        const want = Math.max(Math.abs(target), Math.abs(dh), 1e-4) / (2 * room * 0.85);
        scale += (want - scale) * (dt ? Math.min(1, dt * 1.5) : 1);
        const half = dh / 2 / scale;
        const yL = mid + half, yR = mid - half;
        // liquid
        c.fillStyle = 'rgba(80,150,255,0.22)';
        c.fillRect(xl, yL, aw, yb - yL); c.fillRect(xr, yR, aw, yb - yR);
        c.fillRect(xl, yb - th, xr + aw - xl, th);
        c.fillStyle = 'rgba(255,190,90,0.14)'; c.fillRect(xr, yR, aw, yb - yR); c.fillRect(x0 + aw + gap / 2, yb - th, gap / 2, th);
        // walls
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath();
        c.moveTo(xl, armTop); c.lineTo(xl, yb); c.lineTo(xr + aw, yb); c.lineTo(xr + aw, armTop);
        c.moveTo(xl + aw, armTop); c.lineTo(xl + aw, yb - th); c.lineTo(xr, yb - th); c.lineTo(xr, armTop);
        c.stroke();
        // membrane
        const mx = x0 + aw + gap / 2;
        c.strokeStyle = C.warn; c.lineWidth = 3; c.setLineDash([4, 3]);
        c.beginPath(); c.moveTo(mx, yb - th); c.lineTo(mx, yb); c.stroke(); c.setLineDash([]);
        kit.label(c, 'membrane', mx, yb + 12, { size: 11, color: C.warn, align: 'center' });
        // molecules: water everywhere, solute only on the right of the membrane
        const tt = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
        for (const m of water) {
          const left = m.side === 0;
          const x = left ? xl + 5 + m.u * (aw - 10) : xr + 5 + m.u * (aw - 10);
          const top = left ? yL : yR, y = top + 6 + m.v * Math.max(4, yb - th - top - 6);
          drawMol(kit, c, 'H2O', x + Math.sin(tt * 4 + m.ph) * 2, y + Math.cos(tt * 3.5 + m.ph) * 2, m.ph + tt, 3);
        }
        const sol = S();
        for (const m of solute) {
          const x = xr + 8 + m.u * (aw - 16), y = yR + 8 + m.v * Math.max(4, yb - 8 - yR - 8);
          sol.atoms.forEach((a, k) => ball(kit, c, a, x + k * 7 - (sol.atoms.length - 1) * 3.5 + Math.sin(tt * 2 + m.ph) * 2, y + Math.cos(tt * 2.2 + m.ph + k) * 2, a === 'C' ? 6 : 4.5));
        }
        // water crossing the membrane in the direction of the net flow
        flowPhase += (dt || 0) * clamp(drive / 2000, -3, 3);
        const nF = clamp(Math.round(Math.abs(drive) / 1500), 0, 5);
        for (let k = 0; k < nF; k++) {
          const f = ((flowPhase * (drive >= 0 ? 1 : -1) + k / Math.max(1, nF)) % 1 + 1) % 1;
          const px = mx - 18 + 36 * (drive >= 0 ? f : 1 - f);
          drawMol(kit, c, 'H2O', px, yb - th / 2 + (k % 2 ? 6 : -6), tt * 3 + k, 3);
        }
        if (Math.abs(drive) > 50) kit.arrow(c, mx - 22 * Math.sign(drive), yb - th - 14, mx + 22 * Math.sign(drive), yb - th - 14, C.accent, 3);
        // the ruler: height difference
        const rx = xr + aw + 26;
        c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(rx, yL); c.lineTo(rx, yR); c.stroke();
        c.beginPath(); c.moveTo(xl + aw + 2, yL); c.lineTo(rx + 4, yL); c.moveTo(xr + aw + 2, yR); c.lineTo(rx + 4, yR); c.setLineDash([3, 3]); c.stroke(); c.setLineDash([]);
        const fmtH = h => Math.abs(h) >= 1 ? kit.fmt(h, 3) + ' m' : kit.fmt(h * 100, 3) + ' cm';
        kit.label(c, 'Δh = ' + fmtH(dh), rx + 8, (yL + yR) / 2, { size: 12.5, weight: 600 });
        kit.label(c, 'pure water', xl + aw / 2, armTop - 12, { size: 11.5, align: 'center', color: C.muted });
        kit.label(c, 'solution', xr + aw / 2, armTop - 12, { size: 11.5, align: 'center', color: C.muted });
        if (V.pa > 0) { kit.arrow(c, xr + aw / 2, Math.max(armTop, yR - 34), xr + aw / 2, yR - 4, C.bad, 3); kit.label(c, 'pushed with ' + Math.round(V.pa) + ' kPa', xr + aw / 2, Math.max(armTop, yR - 34) - 8, { size: 11, color: C.bad, align: 'center' }); }
        // scale bar
        const bar = Hyper.niceStep(room * scale, 2), bpx = bar / scale;
        const bx = W - 24;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, yb - th); c.lineTo(bx, yb - th - bpx); c.stroke();
        kit.label(c, fmtH(bar), bx - 6, yb - th - bpx / 2, { size: 11, align: 'right' });
        kit.label(c, 'scale', bx - 6, yb - th - bpx - 10, { size: 10.5, align: 'right', color: C.muted });
        // read-outs
        const p = Pi();
        ro.set('pi', kit.fmt(p / 1000, 3) + ' kPa = ' + kit.fmt(p / ATM, 3) + ' atm (i·c = ' + kit.fmt(sol.i * V.c, 3) + ' mM)');
        ro.set('h', fmtH(dh) + ' (ρgΔh = ' + kit.fmt(RHO * G * dh / 1000, 3) + ' kPa)');
        ro.set('heq', fmtH(target));
        ro.set('flow', Math.abs(drive) < 50 ? 'balanced' : drive > 0 ? 'into the solution (osmosis)' : 'out of the solution (reverse osmosis)');
        const b = sol.i * V.c / 1000;                         // particle molality ≈ molarity for dilute water
        ro.set('col', '−' + kit.fmt(1.86 * b * 1000, 3) + ' mK, +' + kit.fmt(0.512 * b * 1000, 3) + ' mK (hard to measure)');
      }
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

})();
