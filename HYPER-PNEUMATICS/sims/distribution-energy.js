/* HYPER-PNEUMATICS · sims/distribution-energy.js — distributing compressed air, and what it costs.
 *   dist-ring-main        a ring main against a dead-end line: the pressure at every drop (isothermal Darcy–Weisbach,
 *                         density at line pressure, Colebrook friction) and the flow split round the ring
 *   dist-pipe-sizing      a pipe-sizing tool: flow, length and bore -> velocity, drop and the energy cost of the drop
 *   dist-fittings-chain   a tool on a hose: service unit, quick couplings, hose and fittings in series (ISO 6358 + Darcy)
 *   dist-leak-audit       a leak audit game: listen, detect, tag and repair; leak flow and cost falling
 *   dist-pressure-savings the energy saved by lowering the system pressure, compression and unregulated demand
 *   dist-air-saving       a cylinder with a lower return-stroke pressure (kit.fluid.pneuCylinder), air per cycle measured
 *   dist-audit-log        a week of logged flow and compressor power: the baseline, part load, shutting off at weekends
 *   dist-pneu-vs-electric a cylinder against an electric axis: energy per cycle and lifetime cost
 */
(function () {
  'use strict';
  const PA = 1.013e5, PN = 1e5, RHO_N = 1.185, RAIR = 287.058, TK = 293.15, MU = 1.81e-5;
  const BORES = [[16, 6], [20, 8], [25, 10], [32, 12], [40, 16], [50, 20], [63, 20], [80, 25], [100, 25], [125, 32], [160, 40]];
  // choked leak through a sharp hole: free air, m³/s ANR
  const leakFlow = (dmm, pg, Cd) => (Cd || 0.65) * Math.PI * Math.pow(dmm / 1000, 2) / 4 * (pg * 1e5 + PA) * Math.sqrt(1.4 / (RAIR * TK)) * Math.pow(2 / 2.4, 3) / RHO_N;
  // polytropic compression work per unit of free air, relative (n = 1: isothermal)
  const wComp = (pg, n) => { const r = Math.max(1.0001, (pg * 1e5 + PA) / PA); return (!n || n <= 1.0001) ? Math.log(r) : n / (n - 1) * (Math.pow(r, (n - 1) / n) - 1); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fx = (v, d) => (Number.isFinite(v) ? v : 0).toFixed(d == null ? 2 : d);
  const grp = v => String(Math.round(Number.isFinite(v) ? v : 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');   // 157202 -> "157 202"
  // a row of plots under the stage
  function plotRow(box, n) {
    const g = document.createElement('div');
    g.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:' + (n > 1 ? '1fr 1fr' : '1fr') + ';gap:8px';
    box.stage.appendChild(g);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); g.appendChild(d); out.push(d); }
    return out;
  }
  // draw on a W × H design grid scaled into the stage; returns the mapping for pointer events
  function design(st, c, W, H) {
    const k = Math.min(st.W / W, st.H / H), ox = (st.W - W * k) / 2, oy = (st.H - H * k) / 2;
    c.save(); c.translate(ox, oy); c.scale(k, k);
    return { k, ox, oy, inv: p => ({ x: (p.x - ox) / k, y: (p.y - oy) / k }) };
  }
  // a small seeded random generator
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // isothermal pipe friction: p2² = p1² − K (flow forward); K for a mass flow m through L of bore D
  function pipeK(F, m, L, D, eps) {
    if (!(Math.abs(m) > 1e-12) || !(L > 0)) return 0;
    const A = Math.PI * D * D / 4, Re = 4 * Math.abs(m) / (Math.PI * D * MU), f = F.friction(Re, eps / D);
    return f * L * m * m * RAIR * TK / (D * A * A);
  }

  /* ================================================================ ring main or dead-end line */
  const RING = [[170, 205], [170, 70], [700, 70], [700, 340], [170, 340], [170, 205]];
  const RLEN = (() => { const a = [0]; for (let i = 1; i < RING.length; i++) a.push(a[i - 1] + Math.hypot(RING[i][0] - RING[i - 1][0], RING[i][1] - RING[i - 1][1])); return a; })();
  const RTOT = RLEN[RLEN.length - 1];
  const SD = [0.15, 0.31, 0.5, 0.66, 0.8, 0.89], SVALVE = 0.955;
  function ringAt(s) {
    const d = clamp(s, 0, 1) * RTOT;
    let i = 1; while (i < RLEN.length - 1 && d > RLEN[i]) i++;
    const a = RING[i - 1], b = RING[i], t = (d - RLEN[i - 1]) / (RLEN[i] - RLEN[i - 1] || 1);
    const dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]);
    // the loop runs clockwise on screen: the inside lies to the right of the direction of travel
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, nx: -dy, ny: dx };
  }
  function ringPts(s1, s2) {
    const a = ringAt(s1), pts = [[a.x, a.y]];
    for (let i = 1; i < RLEN.length - 1; i++) { const sc = RLEN[i] / RTOT; if (sc > s1 && sc < s2) pts.push(RING[i].slice()); }
    const e = ringAt(s2); pts.push([e.x, e.y]);
    return pts;
  }
  // the network: node 0 is the inlet, nodes 1–6 the drops; segment k joins node k to node k+1 (segment 6 closes the ring)
  function solveRing(F, V, ring, scale) {
    const D = V.bore / 1000, A = Math.PI * D * D / 4, eps = V.eps / 1000, p0 = V.ps * 1e5 + PA, PMIN = 1.08e5;
    const dem = SD.map((s, i) => (V.q + (i === 2 ? V.big : 0)) * scale);             // m³/min ANR
    const md = dem.map(q => RHO_N * q / 60), mt = md.reduce((a, b) => a + b, 0);
    const ns = [0].concat(SD, [1]), Lk = k => (ns[k + 1] - ns[k]) * V.L;
    function march(m0, nseg) {
      const p = [p0], m = [], K = [];
      let q = m0, starved = false;
      for (let k = 0; k < nseg; k++) {
        const kk = pipeK(F, q, Lk(k), D, eps);
        let p2 = q >= 0 ? p[k] * p[k] - kk : p[k] * p[k] + kk;
        if (!(p2 > PMIN * PMIN)) { p2 = PMIN * PMIN; starved = true; }
        m.push(q); K.push(kk); p.push(Math.sqrt(p2));
        if (k < 6) q -= md[k];
      }
      return { p, m, K, starved };
    }
    let r;
    if (ring) {
      let lo = 0, hi = mt;
      for (let it = 0; it < 50; it++) { const mid = (lo + hi) / 2; if (march(mid, 7).p[7] > p0) lo = mid; else hi = mid; }
      r = march((lo + hi) / 2, 7);
    } else r = march(mt, 6);
    r.p0 = p0; r.dem = dem; r.mt = mt; r.A = A; r.ns = ns; r.ring = ring;
    r.drops = r.p.slice(1, 7);
    r.pAt = (k, t) => { const q = r.m[k] || 0, kk = (r.K[k] || 0) * t, pk = r.p[k]; return Math.sqrt(Math.max(PMIN * PMIN, q >= 0 ? pk * pk - kk : pk * pk + kk)); };
    r.vel = r.m.map((q, k) => Math.abs(q) * RAIR * TK / (Math.max(r.p[k], r.p[k + 1]) * A));
    return r;
  }

  Hyper.sim('dist-ring-main', {
    title: 'Ring main or dead-end line',
    blurb: `A factory hall with six drops on its main. Choose a **ring** (fed from both sides) or close the isolation valve to make it a **dead-end line** fed one way. The pressure along the main is found with the Darcy–Weisbach law for air at line pressure (isothermal, $p_1^2 - p_2^2 = f L \\dot m^2 R T/(D A^2)$, Colebrook friction), and in a ring the flow split that makes both ways round lose the same pressure. The main is coloured blue where it has lost less than 0.1 bar, amber up to 0.3 bar and red beyond; the dots move at the air's real speed, scaled. The length is the equivalent length of the ring, fittings included.

**Try this**
- Compare ring and dead-end with the same pipe: the lowest drop pressure, and the curves in the lower graphs. For the far drop the ring loses about a quarter as much.
- Put a big user at drop 3 and watch the split: more air takes the shorter side, but both sides carry some.
- Go one bore size down: the drop multiplies by about three. One size up: it nearly vanishes.
- Raise the supply pressure: the same free air is denser and slower, and the drop shrinks.
- Choose old galvanised pipe: roughness adds 20–30 % to the losses.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const [g1, g2] = plotRow(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'layout', type: 'select', label: 'Layout', options: [['Ring main', 'ring'], ['Dead-end line (valve closed)', 'dead']], value: 'ring' },
        { id: 'bore', type: 'select', label: 'Main inner diameter', options: [['25 mm', 25], ['32 mm', 32], ['40 mm', 40], ['50 mm', 50], ['65 mm', 65], ['80 mm', 80], ['100 mm', 100]], value: 40 },
        { id: 'L', label: 'Length of the ring (equivalent)', min: 100, max: 800, step: 10, value: 300, unit: 'm' },
        { id: 'ps', label: 'Pressure at the inlet (gauge)', min: 5, max: 9, step: 0.1, value: 7, unit: 'bar' },
        { id: 'q', label: 'Demand at each drop', min: 0.1, max: 4, step: 0.1, value: 1.2, unit: 'm³/min' },
        { id: 'big', label: 'Extra demand at drop 3 (big user)', min: 0, max: 10, step: 0.1, value: 3, unit: 'm³/min' },
        { id: 'eps', type: 'select', label: 'Pipe', options: [['Aluminium or plastic (smooth)', 0.0015], ['Steel, new', 0.05], ['Galvanised steel, old', 0.15]], value: 0.05 }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['dem', 'Total demand'], ['split', 'Flow leaving the inlet each way'], ['low', 'Lowest drop pressure'], ['drop', 'Drop to that point'], ['other', 'The other layout would give'], ['v', 'Highest velocity in the main'], ['cost', 'Energy to make up the drop']]);
      const pl1 = kit.plot(g1, { x: { label: 'distance round the main (m)', min: 0 }, y: { label: 'pressure (bar gauge)' }, legend: true }, 150);
      const pl2 = kit.plot(g2, { x: { label: 'total demand (m³/min)', min: 0 }, y: { label: 'lowest drop pressure (bar gauge)' }, legend: true }, 150);
      const V = ctl.values;
      let dirty = true, sol = null, other = null, ph = [0, 0, 0, 0, 0, 0, 0];
      function compute() {
        dirty = false;
        const ring = V.layout === 'ring';
        sol = solveRing(F, V, ring, 1); other = solveRing(F, V, !ring, 1);
        const R = ring ? sol : other, Dd = ring ? other : sol;
        const low = r => Math.min.apply(null, r.drops), lowAt = r => r.drops.indexOf(low(r)) + 1;
        const tot = sol.dem.reduce((a, b) => a + b, 0);
        ro.set('dem', fx(tot, 1) + ' m³/min of free air');
        if (ring) {
          const cw = sol.m[0], ccw = -sol.m[6], sum = Math.max(1e-9, cw + ccw);
          ro.set('split', fx(100 * cw / sum, 0) + ' % clockwise, ' + fx(100 * ccw / sum, 0) + ' % the other way');
        } else ro.set('split', 'all of it one way (valve closed)');
        const lp = low(sol);
        ro.set('low', (sol.starved ? 'starved: ' : '') + fx((lp - PA) / 1e5) + ' bar at drop ' + lowAt(sol));
        const dropBar = (sol.p0 - lp) / 1e5;
        ro.set('drop', fx(dropBar, 3) + ' bar');
        ro.set('other', (ring ? 'dead-end: ' : 'ring: ') + fx((sol.p0 - low(other)) / 1e5, 3) + ' bar drop');
        ro.set('v', fx(Math.max.apply(null, sol.vel), 1) + ' m/s');
        const Pc = 6.5 * tot, extra = 0.07 * dropBar * Pc;
        ro.set('cost', fx(extra, 2) + ' kW ≈ ' + kit.money(extra * 6000 * 0.15, 0) + ' a year (6000 h, ¤0.15/kWh)');
        // pressure along the main, both layouts
        const curve = r => {
          const pts = [], nseg = r.ring ? 7 : 6;
          for (let k = 0; k < nseg; k++) for (let j = 0; j <= 8; j++) { const t = j / 8; pts.push([(r.ns[k] + (r.ns[k + 1] - r.ns[k]) * t) * V.L, (r.pAt(k, t) - PA) / 1e5]); }
          if (!r.ring) pts.push([SVALVE * V.L, (r.p[6] - PA) / 1e5]);
          return pts;
        };
        const dmarks = SD.map((s, i) => ({ x: s * V.L, y: (sol.drops[i] - PA) / 1e5, label: 'D' + (i + 1) }));
        pl1.set({ series: [{ pts: curve(R), label: 'ring' }, { pts: curve(Dd), label: 'dead-end', dash: [6, 4] }], marks: dmarks,
          x: { label: 'distance round the main (m)', min: 0, max: V.L }, y: { label: 'pressure (bar gauge)', max: V.ps + 0.05 } });
        // lowest drop pressure against total demand
        const sr = [], sdd = [];
        for (let i = 1; i <= 16; i++) {
          const sc = i / 8, a = solveRing(F, V, true, sc), b = solveRing(F, V, false, sc), q = tot * sc;
          sr.push([q, (Math.min.apply(null, a.drops) - PA) / 1e5]); sdd.push([q, (Math.min.apply(null, b.drops) - PA) / 1e5]);
        }
        pl2.set({ series: [{ pts: sr, label: 'ring' }, { pts: sdd, label: 'dead-end', dash: [6, 4] }], marks: [{ x: tot, y: (lp - PA) / 1e5, label: 'now' }],
          x: { label: 'total demand (m³/min)', min: 0, max: tot * 2 }, y: { label: 'lowest drop pressure (bar gauge)', max: V.ps + 0.05 } });
      }
      const loop = kit.loop((dt) => {
        if (dirty) compute();
        const c = st.begin(), C = kit.colors(), g = design(st, c, 760, 400);
        const ring = V.layout === 'ring', r = sol;
        const colFor = p => { const d = (r.p0 - p) / 1e5; return d < 0.1 ? S.col('air') : d < 0.3 ? C.warn : C.bad; };
        // hall and compressor room
        c.strokeStyle = C.faint || C.muted; c.lineWidth = 1; c.setLineDash([5, 5]); c.strokeRect(150, 48, 575, 312); c.setLineDash([]);
        kit.label(c, 'factory hall', 720, 38, { color: C.muted, size: 11, align: 'right' });
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.strokeRect(14, 140, 124, 130);
        kit.label(c, 'compressor room', 76, 130, { color: C.muted, size: 11, align: 'center' });
        const cp = S.compressor(c, 48, 240, {});
        S.line(c, [cp.out, [48, 196], [86, 196]], { state: 'air' });
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath();
        if (c.roundRect) c.roundRect(86, 168, 26, 64, 13); else c.rect(86, 168, 26, 64);
        c.stroke();
        kit.label(c, 'receiver', 99, 246, { color: C.muted, size: 10, align: 'center' });
        S.line(c, [[112, 205], [170, 205]], { state: 'air', width: 4 });
        S.gauge(c, 134, 180, { frac: V.ps / 12, value: '' }); S.junction(c, 134, 205);
        kit.label(c, fx(V.ps, 1) + ' bar', 126, 156, { color: C.text, size: 11, weight: 700, align: 'center' });
        // the main, coloured by how much pressure it has lost, with flow dots at the real (scaled) speed
        const nseg = 7, pxPerM = RTOT / Math.max(1, V.L);
        for (let k = 0; k < nseg; k++) {
          const s1 = r.ns[k], s2 = r.ns[k + 1];
          const closedPart = !ring && k === 6;
          for (let j = 0; j < 8; j++) {
            const a = s1 + (s2 - s1) * j / 8, b = s1 + (s2 - s1) * (j + 1) / 8;
            let col;
            if (closedPart) col = b <= SVALVE ? colFor(r.p[6]) : S.col('air');
            else col = colFor(r.pAt(k, (j + 0.5) / 8));
            S.line(c, ringPts(a, b), { color: col, width: 4 });
          }
          if (!closedPart && Math.abs(r.m[k]) > 1e-6) {
            ph[k] += dt * Math.min(140, r.vel[k] * pxPerM * 2.5) * Math.sign(r.m[k]);
            const pts = ringPts(s1, s2);
            S.flow(c, pts, ph[k], { color: C.text, r: 1.8, gap: 16 });
          }
        }
        // the isolation valve that turns the ring into a dead-end line
        const vp = ringAt(SVALVE);
        c.fillStyle = ring ? C.bg2 || C.surface : C.text; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(vp.x - 8, vp.y - 10); c.lineTo(vp.x + 8, vp.y - 10); c.lineTo(vp.x, vp.y); c.closePath(); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(vp.x - 8, vp.y + 10); c.lineTo(vp.x + 8, vp.y + 10); c.lineTo(vp.x, vp.y); c.closePath(); c.fill(); c.stroke();
        kit.label(c, ring ? 'valve open' : 'valve closed', vp.x + 12, vp.y, { color: ring ? C.muted : C.bad, size: 11, weight: 600 });
        // drops and machines
        SD.forEach((s, i) => {
          const q = ringAt(s), bx = q.x + q.nx * 44, by = q.y + q.ny * 44, p = r.drops[i];
          S.junction(c, q.x, q.y);
          S.line(c, [[q.x, q.y], [q.x + q.nx * 32, q.y + q.ny * 32]], { color: colFor(p) });
          const w = i === 2 && V.big > 0 ? 44 : 32, h = i === 2 && V.big > 0 ? 30 : 22;
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.4; c.fillRect(bx - w / 2, by - h / 2, w, h); c.strokeRect(bx - w / 2, by - h / 2, w, h);
          kit.label(c, 'D' + (i + 1), bx, by, { color: C.text, size: 11, weight: 700, align: 'center' });
          const tx = bx + q.nx * (h / 2 + 12 + (q.nx ? 22 : 0)), ty = by + q.ny * (h / 2 + 12);
          kit.label(c, fx((p - PA) / 1e5) + ' bar', tx, ty, { color: colFor(p), size: 12, weight: 700, align: 'center' });
          kit.label(c, fx(r.dem[i], 1) + ' m³/min', tx, ty + (q.ny < 0 ? -14 : 14), { color: C.muted, size: 10, align: 'center' });
        });
        kit.label(c, ring ? 'ring main: every drop fed from two sides' : 'dead-end line: one path to every drop', 437, 205, { color: C.muted, size: 12, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pipe sizing */
  const STD_BORES = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150];
  Hyper.sim('dist-pipe-sizing', {
    title: 'Sizing an air pipe',
    blurb: `Enter the free-air flow, the equivalent length and the line pressure; the tool works out, for every standard bore, the velocity, the pressure drop by the Darcy–Weisbach law for air at line pressure (isothermal, Colebrook friction) and by the empirical formula $\\Delta p = 1.6\\times10^3\\,Q^{1.85}L/(d^5 p)$, and what the drop costs: the compressors must run that much higher, at the energy of polytropic compression ($n$ = 1.2, about 7 % per bar). The pipe drawn above is the bore you choose; the bars below compare all the bores with your allowed drop.

**Try this**
- Find the smallest bore that meets 0.1 bar, then look at its velocity: is it within 6–10 m/s?
- Double the flow: the drop grows almost fourfold; the bore needed grows only by about a third.
- Compare the yearly cost of the drop for two neighbouring bores with what a size up would cost to buy.
- Raise the pressure from 6 to 10 bar at the same free-air flow: denser air, slower, smaller drop.
- Set the length to 1000 m: long lines need a size or two more than the rule-of-thumb tables suggest.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Free-air flow', min: 0.5, max: 60, value: 10, unit: 'm³/min', log: true, sig: 3 },
        { id: 'L', label: 'Equivalent length (pipe + fittings)', min: 10, max: 1000, value: 200, unit: 'm', log: true, sig: 3 },
        { id: 'p', label: 'Line pressure at the inlet (gauge)', min: 4, max: 12, step: 0.1, value: 7, unit: 'bar' },
        { id: 'D', type: 'select', label: 'Inner diameter', options: STD_BORES.map(b => [b + ' mm', b]), value: 65 },
        { id: 'eps', type: 'select', label: 'Pipe', options: [['Aluminium or plastic (smooth)', 0.0015], ['Steel, new', 0.05], ['Galvanised steel, old', 0.15]], value: 0.05 },
        { id: 'dpa', label: 'Allowed drop', min: 0.02, max: 0.5, step: 0.01, value: 0.1, unit: 'bar' },
        { id: 'h', label: 'Running hours a year', min: 1000, max: 8760, step: 10, value: 6000, unit: 'h' },
        { id: 'sp', label: 'Compressor specific power', min: 5, max: 10, step: 0.1, value: 6.5, unit: 'kW per m³/min' },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['v', 'Velocity at the inlet'], ['re', 'Reynolds number, friction factor'], ['dp', 'Pressure drop (Darcy–Weisbach)'], ['emp', 'Empirical formula gives'], ['cost', 'Cost of the drop'], ['rec', 'Smallest bore within the limits']]);
      const tab = kit.table(box.side, [{ label: 'Bore', key: 'b', align: 'left' }, { label: 'm/s', key: 'v', fmt: v => fx(v, 1) }, { label: 'Δp bar', key: 'dp', fmt: v => v > 9 ? 'too small' : fx(v, 3) }, { label: 'per year', key: 'cost', fmt: v => v > 1e8 ? '—' : kit.money(v, 0) }], { maxHeight: 260 });
      const V = ctl.values;
      let dirty = true, rows = [], cur = null, phase = 0;
      function calc(Dmm) {
        const D = Dmm / 1000, A = Math.PI * D * D / 4, m = RHO_N * V.Q / 60, p1 = V.p * 1e5 + PA;
        const Re = 4 * m / (Math.PI * D * MU), f = F.friction(Re, V.eps / 1000 / D);
        const K = pipeK(F, m, V.L, D, V.eps / 1000), q2 = p1 * p1 - K;
        const ok = q2 > (1.5e5) * (1.5e5);
        const p2 = ok ? Math.sqrt(q2) : 1.5e5, dp = ok ? (p1 - p2) / 1e5 : 99;
        const v = m * RAIR * TK / (p1 * A);
        const emp = 1600 * Math.pow(V.Q / 60, 1.85) * V.L / (Math.pow(D, 5) * p1) / 1e5;
        const P = V.sp * V.Q, pNeed = Math.max(0.5, V.p - Math.min(dp, V.p - 0.5));
        const extra = ok ? P * (1 - wComp(pNeed, 1.2) / wComp(V.p, 1.2)) : Infinity;
        return { b: Dmm + ' mm', D: Dmm, v, Re, f, dp, emp, ok, p2, extra, cost: ok ? extra * V.h * V.price : 1e9 };
      }
      function compute() {
        dirty = false;
        rows = STD_BORES.map(calc);
        cur = rows.find(r => r.D === V.D) || rows[6];
        const rec = rows.find(r => r.ok && r.dp <= V.dpa && r.v <= 10);
        rows.forEach(r => { r._cls = r === cur ? 'hl' : ''; });
        tab.set(rows);
        ro.set('v', fx(cur.v, 1) + ' m/s' + (cur.v > 10 ? ' — too fast for a main' : cur.v < 6 ? ' — slow and quiet' : ''));
        ro.set('re', fx(cur.Re / 1000, 0) + ' 000, f = ' + fx(cur.f, 4));
        ro.set('dp', cur.ok ? fx(cur.dp, 3) + ' bar' + (cur.dp > V.dpa ? ' — over the limit' : ' — within the limit') : 'the pipe cannot carry this flow');
        ro.set('emp', cur.emp > 9 ? 'far too much' : fx(cur.emp, 3) + ' bar');
        ro.set('cost', cur.ok ? fx(cur.extra, 2) + ' kW, ' + kit.money(cur.cost, 0) + ' a year' : '—');
        ro.set('rec', rec ? rec.b + ' (' + fx(rec.dp, 3) + ' bar, ' + fx(rec.v, 1) + ' m/s)' : 'none up to 150 mm — a larger main or parallel lines');
      }
      const loop = kit.loop((dt) => {
        if (dirty) compute();
        const c = st.begin(), C = kit.colors(), g = design(st, c, 760, 470);
        // the chosen pipe, its gauges and the air moving through it
        const th = clamp(cur.D * 0.42, 6, 64), y0 = 110, xa = 110, xb = 650;
        c.fillStyle = C.dark ? 'rgba(79,141,255,.22)' : 'rgba(29,78,216,.14)'; c.fillRect(xa, y0 - th / 2, xb - xa, th);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(xa, y0 - th / 2); c.lineTo(xb, y0 - th / 2); c.moveTo(xa, y0 + th / 2); c.lineTo(xb, y0 + th / 2); c.stroke();
        phase += dt * Math.min(160, cur.v * 9);
        for (const yy of [-0.25, 0, 0.25]) S.flow(c, [[xa + 4, y0 + yy * th], [xb - 4, y0 + yy * th]], phase + yy * 30, { color: S.col('air'), r: 2.2, gap: 22 });
        S.line(c, [[xa, y0 - th / 2], [xa, 52]], { state: 'air' }); S.line(c, [[xb, y0 - th / 2], [xb, 52]], { state: cur.ok && cur.dp < V.dpa ? 'air' : 'exhaust' });
        S.gauge(c, xa, 31, { frac: V.p / 14 }); S.gauge(c, xb, 31, { frac: (cur.ok ? (cur.p2 - PA) / 1e5 : 0) / 14 });
        kit.label(c, fx(V.p, 2) + ' bar', xa + 18, 31, { color: C.text, size: 12, weight: 700 });
        kit.label(c, cur.ok ? fx((cur.p2 - PA) / 1e5, 2) + ' bar' : 'starved', xb + 18, 31, { color: cur.ok && cur.dp <= V.dpa ? C.text : C.bad, size: 12, weight: 700 });
        kit.label(c, 'bore ' + cur.D + ' mm · ' + fx(V.L, 0) + ' m · ' + fx(V.Q, 1) + ' m³/min · ' + fx(cur.v, 1) + ' m/s', (xa + xb) / 2, y0 + th / 2 + 18, { color: C.muted, size: 12, align: 'center' });
        // every standard bore: the drop on a logarithmic scale against the allowed drop
        const bx0 = 70, bx1 = 730, base = 430, top = 200, lo = Math.log10(0.001), hi = Math.log10(10);
        const yOf = v => base - (clamp(Math.log10(Math.max(v, 1e-3)), lo, hi) - lo) / (hi - lo) * (base - top);
        c.strokeStyle = C.grid || C.faint; c.lineWidth = 1;
        for (const t of [0.001, 0.01, 0.1, 1, 10]) { const yy = yOf(t); c.beginPath(); c.moveTo(bx0, yy); c.lineTo(bx1, yy); c.stroke(); kit.label(c, t + ' bar', bx0 - 6, yy, { color: C.muted, size: 10, align: 'right' }); }
        const bw = (bx1 - bx0) / rows.length;
        rows.forEach((r, i) => {
          const x = bx0 + i * bw + bw * 0.18, w = bw * 0.64, yy = yOf(r.ok ? r.dp : 10);
          c.fillStyle = !r.ok || r.dp > V.dpa ? C.bad : r.v > 10 ? C.warn : C.ok;
          c.globalAlpha = r === cur ? 1 : 0.55; c.fillRect(x, yy, w, base - yy); c.globalAlpha = 1;
          if (r === cur) { c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x - 2, yy - 2, w + 4, base - yy + 2); }
          kit.label(c, String(r.D), x + w / 2, base + 12, { color: r === cur ? C.text : C.muted, size: 11, weight: r === cur ? 700 : 500, align: 'center' });
          if (r.ok && r.dp < 9) kit.label(c, r.dp < 0.01 ? r.dp.toExponential(0) : fx(r.dp, r.dp < 0.1 ? 3 : 2), x + w / 2, yy - 9, { color: C.muted, size: 9.5, align: 'center' });
        });
        const ya = yOf(V.dpa);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(bx0, ya); c.lineTo(bx1, ya); c.stroke(); c.setLineDash([]);
        kit.label(c, 'allowed ' + fx(V.dpa, 2) + ' bar', bx1, ya - 10, { color: C.accent, size: 11, weight: 700, align: 'right' });
        kit.label(c, 'pressure drop for each bore (mm) — green: within the limit, amber: faster than 10 m/s, red: too much drop', (bx0 + bx1) / 2, 180, { color: C.muted, size: 11, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a tool at the end of a hose */
  const COUPLINGS = [['Standard coupling (C = 3.5)', 3.5], ['High-flow coupling (C = 6)', 6], ['Small 5 mm coupling (C = 1.4)', 1.4], ['None (connected directly)', 0]];
  // ISO 1219-style quick coupling, connected, with its two non-return valves held open
  function coupling(c, x, y, color) {
    c.strokeStyle = color; c.lineWidth = 1.6; c.setLineDash([]);
    c.beginPath(); c.moveTo(x, y - 11); c.lineTo(x, y + 11); c.stroke();
    for (const d of [-1, 1]) {
      c.beginPath(); c.moveTo(x + d * 18, y - 7); c.lineTo(x + d * 10, y); c.lineTo(x + d * 18, y + 7); c.stroke();
      c.beginPath(); c.arc(x + d * 5.5, y, 3.4, 0, Math.PI * 2); c.stroke();
    }
    return { a: [x - 20, y], b: [x + 20, y] };
  }
  Hyper.sim('dist-fittings-chain', {
    title: 'A tool at the end of a hose',
    blurb: `An air tool fed from a drop through a service unit, a quick coupling, a hose, a second coupling and a few swivel fittings. Each component is a restriction with a sonic conductance $C$ and a critical pressure ratio $b$ (ISO 6358); the hose follows the Darcy–Weisbach law for air (isothermal, smooth bore, choking when the air reaches the isothermal sonic speed). The tool itself behaves as a nozzle, so the lower the pressure it receives, the less air it passes and the less power it gives. The model finds the one flow at which all the pressure drops add up.

**Try this**
- With the defaults, over a bar is lost before the tool: see in the graph how it splits — the two couplings together lose as much as ten metres of 8 mm hose, the small service unit another quarter of a bar.
- Swap both couplings for high-flow ones, then instead raise the drop pressure by 0.5 bar. Which helps the tool more — and which costs energy all year?
- Lengthen a 6 mm hose to 20 m, then choose a 10 mm hose.
- Fit the small 5 mm couplings: the tool starves even with a short hose.
- Compare the tool's air power with what it would give connected straight to the drop.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 230 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'ps', label: 'Pressure at the drop (gauge)', min: 4, max: 8, step: 0.1, value: 6.3, unit: 'bar' },
        { id: 'tool', type: 'select', label: 'Tool', options: [['Die grinder (≈ 500 L/min at 6.3 bar)', 1.14], ['½″ impact wrench (≈ 650 L/min)', 1.48], ['Orbital sander (≈ 350 L/min)', 0.8], ['Blow gun (≈ 250 L/min)', 0.57]], value: 1.14 },
        { id: 'frl', type: 'select', label: 'Service unit', options: [['Small (C = 3)', 3], ['Large (C = 8)', 8], ['None', 0]], value: 3 },
        { id: 'c1', type: 'select', label: 'Coupling at the drop', options: COUPLINGS, value: 3.5 },
        { id: 'hd', type: 'select', label: 'Hose bore', options: [['6 mm', 6], ['8 mm', 8], ['10 mm', 10], ['13 mm', 13]], value: 8 },
        { id: 'hl', label: 'Hose length', min: 0.5, max: 30, step: 0.5, value: 10, unit: 'm' },
        { id: 'c2', type: 'select', label: 'Coupling at the tool', options: COUPLINGS, value: 3.5 },
        { id: 'nf', label: 'Swivels and elbow fittings', min: 0, max: 4, step: 1, value: 1 }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['q', 'Air to the tool'], ['pt', 'Pressure at the tool'], ['drop', 'Lost between drop and tool'], ['worst', 'Largest single loss'], ['pow', 'Tool\'s air power vs straight at the drop']]);
      const pl = kit.plot(g1, { x: { label: 'along the chain', min: 0 }, y: { label: 'pressure (bar gauge)' } }, 150);
      const V = ctl.values;
      let dirty = true, res = null, ph = 0, ang = 0;
      function elements() {
        const els = [];
        if (V.frl > 0) els.push({ name: 'service unit', C: V.frl * 1e-8, b: 0.35 });
        if (V.c1 > 0) els.push({ name: 'coupling 1', C: V.c1 * 1e-8, b: 0.3 });
        els.push({ name: 'hose', pipe: true, L: V.hl, D: V.hd / 1000 });
        if (V.c2 > 0) els.push({ name: 'coupling 2', C: V.c2 * 1e-8, b: 0.3 });
        const Cf = 0.12 * Math.PI * V.hd * V.hd / 4 * 1e-8;
        for (let i = 0; i < V.nf; i++) els.push({ name: 'fitting ' + (i + 1), C: Cf, b: 0.3 });
        return els;
      }
      function march(els, Q, p1) {
        const m = RHO_N * Q, out = [];
        let p = p1;
        for (const e of els) {
          if (e.pipe) {
            const q2 = p * p - pipeK(F, m, e.L, e.D, 1.5e-6);
            if (!(q2 > PA * PA)) return null;
            const p2 = Math.sqrt(q2), A = Math.PI * e.D * e.D / 4;
            if (m * RAIR * TK / (p2 * A) > Math.sqrt(RAIR * TK)) return null;       // isothermal choking at the hose end
            p = p2;
          } else {
            const x = Q / (e.C * p);
            if (!(x < 1)) return null;
            p = p * (e.b + (1 - e.b) * Math.sqrt(1 - x * x));
          }
          out.push(p);
        }
        return out;
      }
      function compute() {
        dirty = false;
        const els = elements(), ps = V.ps * 1e5 + PA, Ct = V.tool * 1e-8;
        const qTool = p => F.iso6358({ C: Ct, b: 0.3, p1: p, p2: PA }).qANR;
        let lo = 0, hi = qTool(ps);
        for (let it = 0; it < 60; it++) {
          const mid = (lo + hi) / 2, r = march(els, mid, ps);
          if (!r || mid > qTool(r[r.length - 1])) hi = mid; else lo = mid;
        }
        const Q = lo, pr = march(els, Q, ps) || els.map(() => PA), pt = pr[pr.length - 1];
        const q0 = qTool(ps), P0 = PN * q0 * Math.log(ps / PA), P1 = PN * Q * Math.log(Math.max(pt, PA) / PA);
        let worst = 0, wi = 0, prev = ps;
        pr.forEach((p, i) => { if (prev - p > worst) { worst = prev - p; wi = i; } prev = p; });
        res = { els, pr, Q, pt, ps, q0 };
        ro.set('q', fx(Q * 60000, 0) + ' L/min (' + fx(q0 * 60000, 0) + ' straight at the drop)');
        ro.set('pt', fx((pt - PA) / 1e5) + ' bar');
        ro.set('drop', fx((ps - pt) / 1e5) + ' bar');
        ro.set('worst', els[wi].name + ': ' + fx(worst / 1e5) + ' bar');
        ro.set('pow', fx(P1 / 1000, 2) + ' kW, ' + fx(100 * P1 / Math.max(1e-9, P0), 0) + ' % of ' + fx(P0 / 1000, 2) + ' kW');
        const pts = [[0, V.ps]], marks = [{ x: 0, y: V.ps, label: 'drop' }];
        pr.forEach((p, i) => { pts.push([i + 1, (p - PA) / 1e5]); marks.push({ x: i + 1, y: (p - PA) / 1e5, label: els[i].name }); });
        pl.set({ series: [{ pts, label: 'pressure after each part', dots: true }], marks, x: { label: 'along the chain', min: 0, max: pr.length + 0.3 }, y: { label: 'pressure (bar gauge)', min: Math.max(0, Math.floor((pt - PA) / 1e5) - 0.5), max: V.ps + 0.2 } });
      }
      const loop = kit.loop((dt) => {
        if (dirty) compute();
        const c = st.begin(), C = kit.colors(), g = design(st, c, 760, 300), y = 150;
        const idx = name => res.els.findIndex(e => e.name === name);
        const pAfter = name => { const i = idx(name); return i < 0 ? null : res.pr[i]; };
        const tag = (x, name, p) => { if (p != null) kit.label(c, fx((p - PA) / 1e5) + ' bar', x, y + 38, { color: C.text, size: 11, weight: 700, align: 'center' }); kit.label(c, name, x, y + 53, { color: C.muted, size: 10.5, align: 'center' }); };
        const src = S.source(c, 36, 220, { pneumatic: true });
        const path = [src.P, [36, y], [96, y]];
        S.line(c, path, { state: 'air' });
        const gg = S.gauge(c, 70, 110, { frac: V.ps / 10 }); S.line(c, [gg.P, [70, y]], { state: 'air' }); S.junction(c, 70, y);
        kit.label(c, fx(V.ps, 1) + ' bar', 84, 94, { color: C.text, size: 11, weight: 700 });
        kit.label(c, 'drop', 36, 244, { color: C.muted, size: 10.5, align: 'center' });
        let x = 96;
        if (V.frl > 0) { const f = S.frl(c, 144, y); S.line(c, [[x, y], f.in], { state: 'air' }); x = f.out[0]; tag(144, 'service unit', pAfter('service unit')); }
        else { S.line(c, [[x, y], [192, y]], { state: 'air' }); x = 192; }
        S.line(c, [[x, y], [212, y]], { state: 'air' });
        if (V.c1 > 0) { coupling(c, 232, y, C.text); tag(232, 'coupling', pAfter('coupling 1')); } else S.line(c, [[212, y], [252, y]], { state: 'air' });
        // the hose, drawn as a flexible line sagging between its couplings
        const hose = [];
        for (let i = 0; i <= 20; i++) { const t = i / 20; hose.push([252 + (430 - 252) * t, y + 4 * t * (1 - t) * clamp(10 + V.hl * 2, 12, 60)]); }
        S.line(c, hose, { state: 'air', width: clamp(V.hd * 0.35, 1.8, 5) });
        tag(341, 'hose ' + V.hd + ' mm × ' + fx(V.hl, 1) + ' m', pAfter('hose'));
        if (V.c2 > 0) { coupling(c, 450, y, C.text); tag(450, 'coupling', pAfter('coupling 2')); } else S.line(c, [[430, y], [470, y]], { state: 'air' });
        S.line(c, [[470, y], [600, y]], { state: 'air' });
        for (let i = 0; i < V.nf; i++) { const fx0 = 490 + i * 24; c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(fx0 - 6, y - 6, 12, 12); }
        if (V.nf > 0) tag(490 + (V.nf - 1) * 12, V.nf + (V.nf > 1 ? ' fittings' : ' fitting'), res.pr[res.pr.length - 1]);
        const gt = S.gauge(c, 590, 110, { frac: (res.pt - PA) / 1e5 / 10 }); S.line(c, [gt.P, [590, y]], { state: 'air' }); S.junction(c, 590, y);
        kit.label(c, fx((res.pt - PA) / 1e5, 1) + ' bar', 604, 94, { color: res.pt < res.ps - 0.8e5 ? C.bad : C.text, size: 11, weight: 700 });
        ang += dt * 14 * res.Q / Math.max(1e-9, res.q0);
        const mo = S.motor(c, 660, y, { pneumatic: true, rot: -90, angle: ang });
        S.line(c, [[600, y], mo.a], { state: 'air' });
        S.line(c, [mo.b, [698, y]], { state: 'exhaust' }); S.exhaust(c, 698, y, { rot: -90, silencer: true });
        kit.label(c, 'tool', 660, y + 44, { color: C.muted, size: 10.5, align: 'center' });
        ph += dt * 90 * res.Q / Math.max(1e-9, res.q0);
        S.flow(c, [src.P, [36, y], [212, y]], ph, { color: S.col('air') });
        S.flow(c, hose, ph, { color: S.col('air') });
        S.flow(c, [[470, y], mo.a], ph, { color: S.col('air') });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ leak audit */
  const MACHINES = [[140, 140, 'press'], [290, 140, 'packer'], [440, 140, 'robot cell'], [590, 140, 'assembly'], [140, 290, 'lathe'], [290, 290, 'paint booth'], [440, 290, 'test rig'], [590, 290, 'palletiser']];
  const MKINDS = ['push-in fitting', 'quick coupling', 'hose', 'service-unit drain', 'cylinder rod seal', 'valve exhaust', 'regulator', 'tube end'];
  const PKINDS = ['thread', 'flange', 'drain valve', 'ball valve'];
  const DSIZES = [0.5, 0.7, 1, 1.5, 2, 3, 4], DWEIGHTS = [4, 4, 4, 3, 3, 2, 1];
  Hyper.sim('dist-leak-audit', {
    title: 'A leak audit',
    blurb: `A factory floor with its ring main and eight machines — and leaks you cannot see. Choose how to look for them: **by ear** while production runs (only the big ones are audible), by ear with the **plant stopped**, or with an **ultrasonic detector**, which hears every jet. **Click a leak to tag it**, then repair the tagged leaks and see the total leak flow and its yearly cost fall. Each leak is a sharp hole with choked flow, $\\dot m \\approx 0.0404\\,C_d A p_0/\\sqrt{T_0}$, so its flow follows its area and the absolute line pressure.

**Try this**
- Listen by ear during production and tag what you hear, repair, then switch to the ultrasonic detector: most of the leaks were never audible.
- Tag and repair the largest leaks first and watch how fast the cost falls; then chase the small ones.
- Lower the line pressure by a bar: every leak, found or not, shrinks by about an eighth.
- Press "Six months later" a few times without repairing: new leaks appear — this is why leak management is a habit, not a project.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'repair', label: 'Repair tagged leaks', primary: true }, { id: 'later', label: 'Six months later' }, { id: 'reset', label: 'New plant' }] },
        { id: 'mode', type: 'select', label: 'Looking for leaks', options: [['By ear, production running', 'prod'], ['By ear, plant stopped', 'quiet'], ['Ultrasonic detector', 'ultra']], value: 'prod' },
        { id: 'p', label: 'Line pressure (gauge)', min: 4, max: 8, step: 0.1, value: 7, unit: 'bar' },
        { id: 'dem', label: 'Production demand', min: 4, max: 40, step: 0.5, value: 12, unit: 'm³/min' },
        { id: 'h', label: 'Hours pressurised a year', min: 2000, max: 8760, step: 10, value: 8760, unit: 'h' },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' }
      ], (id) => {
        if (id === 'repair') { let n = 0; for (const L of leaks) if (L.tagged && !L.fixed) { L.fixed = true; L.tagged = false; n++; } if (n) record('repair'); }
        if (id === 'later') { addLeaks(4 + Math.floor(rand() * 4)); round++; record('6 months'); }
        if (id === 'reset') { seed++; newPlant(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['q', 'Leaking now'], ['share', 'Share of the air made'], ['cost', 'Energy and cost a year'], ['tag', 'Tagged, waiting for repair'], ['hid', 'Untagged, still leaking'], ['saved', 'Saved a year by repairs']]);
      const pl = kit.plot(g1, { x: { label: 'audit step', min: 0 }, y: { label: 'leak flow (m³/min)', min: 0 } }, 140);
      const V = ctl.values;
      let seed = 7, rand, leaks, round, hist, t = 0, map = null, nextId;
      const audible = L => V.mode === 'ultra' || L.d >= (V.mode === 'quiet' ? 1.5 : 3);
      const flowOf = L => leakFlow(L.d, V.p);
      function pick() { const tot = DWEIGHTS.reduce((a, b) => a + b, 0); let r = rand() * tot; for (let i = 0; i < DSIZES.length; i++) { r -= DWEIGHTS[i]; if (r < 0) return DSIZES[i]; } return 1; }
      function addLeaks(n) {
        for (let k = 0; k < n; k++) {
          let L = null;
          for (let tries = 0; tries < 20; tries++) {
            let x, y, kind, where;
            if (rand() < 0.75) { const M = MACHINES[Math.floor(rand() * MACHINES.length)]; x = M[0] + (rand() - 0.5) * 104; y = M[1] + (rand() - 0.5) * 70; kind = MKINDS[Math.floor(rand() * MKINDS.length)]; where = M[2]; }
            else { const s = rand(); const per = 2 * (680 + 330), d = s * per; if (d < 680) { x = 40 + d; y = 50; } else if (d < 1010) { x = 720; y = 50 + d - 680; } else if (d < 1690) { x = 720 - (d - 1010); y = 380; } else { x = 40; y = 380 - (d - 1690); } kind = PKINDS[Math.floor(rand() * PKINDS.length)]; where = 'main'; }
            if (leaks.every(o => Math.hypot(o.x - x, o.y - y) > 18)) { L = { id: nextId++, x, y, d: pick(), kind, where, tagged: false, fixed: false, ph: rand() * 30 }; break; }
          }
          if (L) leaks.push(L);
        }
      }
      function totals() {
        let all = 0, tagged = 0, hidden = 0, nt = 0, nh = 0;
        for (const L of leaks) { if (L.fixed) continue; const q = flowOf(L); all += q; if (L.tagged) { tagged += q; nt++; } else { hidden += q; nh++; } }
        return { all, tagged, hidden, nt, nh };
      }
      function record(what) { hist.push([hist.length, totals().all * 60, what]); }
      function newPlant() { rand = rng(seed * 7919); leaks = []; nextId = 1; round = 0; hist = []; addLeaks(24); record('start'); }
      newPlant();
      kit.click(st, p => {
        if (!map) return;
        const q = map.inv(p);
        let best = null, bd = 16;
        for (const L of leaks) if (!L.fixed && audible(L)) { const d = Math.hypot(L.x - q.x, L.y - q.y); if (d < bd) { bd = d; best = L; } }
        if (best) { best.tagged = !best.tagged; loop.once(); }
      }, p => {
        if (!map) return false;
        const q = map.inv(p);
        return leaks.some(L => !L.fixed && audible(L) && Math.hypot(L.x - q.x, L.y - q.y) < 16);
      });
      const loop = kit.loop((dt) => {
        t += dt;
        const c = st.begin(), C = kit.colors(), g = design(st, c, 760, 420);
        map = g;
        const S = kit.fsym;
        // floor plan: ring main, drops, machines, compressor room
        c.strokeStyle = C.faint || C.muted; c.lineWidth = 1; c.setLineDash([5, 5]); c.strokeRect(14, 20, 732, 390); c.setLineDash([]);
        S.line(c, [[40, 50], [720, 50], [720, 380], [40, 380], [40, 50]], { state: 'air', width: 3.5 });
        S.line(c, [[746, 215], [720, 215]], { state: 'air', width: 3.5 });
        kit.label(c, 'from the compressors', 742, 232, { color: C.muted, size: 10, align: 'right' });
        for (const M of MACHINES) {
          const up = M[1] < 215, yd = up ? 50 : 380, ye = up ? M[1] - 28 : M[1] + 28;
          S.line(c, [[M[0] - 30, yd], [M[0] - 30, ye]], { state: 'air' }); S.junction(c, M[0] - 30, yd);
          c.fillStyle = C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.4; c.fillRect(M[0] - 50, M[1] - 28, 100, 56); c.strokeRect(M[0] - 50, M[1] - 28, 100, 56);
          kit.label(c, M[2], M[0], M[1], { color: C.muted, size: 11, align: 'center' });
        }
        // leaks: hissing rings for those that can be heard, tags, repaired marks
        for (const L of leaks) {
          if (L.fixed) { c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(L.x - 4, L.y); c.lineTo(L.x - 1, L.y + 3); c.lineTo(L.x + 5, L.y - 4); c.stroke(); continue; }
          const q = flowOf(L) * 60000, loud = clamp(Math.log10(Math.max(q, 1)) / 2.9, 0.25, 1);
          if (audible(L)) {
            const R = 8 + 18 * loud;
            for (let j = 0; j < 3; j++) {
              const rr = ((t * 26 + L.ph + j * R / 3) % R);
              c.globalAlpha = (1 - rr / R) * (V.mode === 'ultra' ? 0.5 + 0.5 * loud : loud) * 0.9;
              c.strokeStyle = L.tagged ? C.warn : C.bad; c.lineWidth = 1.5;
              c.beginPath(); c.arc(L.x, L.y, 3 + rr, 0, Math.PI * 2); c.stroke();
            }
            c.globalAlpha = 1;
            c.fillStyle = L.tagged ? C.warn : C.bad; c.beginPath(); c.arc(L.x, L.y, 2.6, 0, Math.PI * 2); c.fill();
          }
          if (L.tagged) {
            c.fillStyle = C.warn; c.fillRect(L.x + 6, L.y - 20, 22, 14);
            kit.label(c, String(L.id), L.x + 17, L.y - 13, { color: '#1a1300', size: 10, weight: 700, align: 'center' });
            kit.label(c, L.kind + ', ' + L.d + ' mm: ' + fx(q, 0) + ' L/min', L.x + 31, L.y - 13, { color: C.text, size: 10, bg: C.surface });
          }
        }
        kit.label(c, V.mode === 'ultra' ? 'ultrasonic detector: every jet is heard' : V.mode === 'quiet' ? 'plant stopped: leaks from about 1.5 mm are audible' : 'production running: only the largest leaks are audible', 380, 215, { color: C.muted, size: 12, align: 'center' });
        c.restore();
        const T = totals(), yearly = q => q * 60 * 6.5 * V.h * V.price;
        ro.set('q', fx(T.all * 60000, 0) + ' L/min (' + fx(T.all * 60, 2) + ' m³/min), ' + (T.nt + T.nh) + ' leaks');
        ro.set('share', fx(100 * T.all * 60 / (V.dem + T.all * 60), 1) + ' %');
        ro.set('cost', grp(T.all * 60 * 6.5 * V.h) + ' kWh, ' + kit.money(yearly(T.all), 0));
        ro.set('tag', T.nt + ' leaks, ' + fx(T.tagged * 60000, 0) + ' L/min, ' + kit.money(yearly(T.tagged), 0) + ' a year');
        ro.set('hid', T.nh + ' leaks, ' + fx(T.hidden * 60000, 0) + ' L/min');
        ro.set('saved', kit.money(yearly(leaks.filter(L => L.fixed).reduce((a, L) => a + flowOf(L), 0)), 0) + ' (at today\'s pressure)');
        if (!pl._n || pl._n !== hist.length + '|' + V.p) {
          pl._n = hist.length + '|' + V.p;
          pl.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'leak flow after each step', dots: true }], marks: hist.map(h => ({ x: h[0], y: h[1], label: h[2] })), x: { label: 'audit step', min: 0, max: Math.max(4, hist.length) } });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ what a bar is worth */
  Hyper.sim('dist-pressure-savings', {
    title: 'What a bar is worth',
    blurb: `Lower the compressor pressure and see both savings. **Compression**: the work per cubic metre of free air follows the polytropic law $\\frac{n}{n-1}\\left(r^{(n-1)/n} - 1\\right)$ of the pressure ratio $r$. **Unregulated demand**: leaks, open blow-offs and tools without regulators pass free air in proportion to the absolute pressure, so they shrink too; regulated machines keep their flow. On the right, the pressure staircase: what the most demanding machine needs plus the drops on the way sets the lowest workable setting.

**Try this**
- Read the saving per bar near 7 bar (about 7 %), then compare it at 5 bar: each bar is worth more at lower pressure.
- Raise the unregulated share from 10 % to 50 %: the unregulated saving grows until it rivals the compression saving.
- Push the new pressure below the red line: the machines would starve. Then shrink the drops (clean filters, better couplings) and go lower.
- Switch between isothermal, n = 1.2 and adiabatic compression: the real answer for your compressor lies in that range.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'P0', label: 'Compressor power now', min: 10, max: 500, value: 90, unit: 'kW', log: true, sig: 3 },
        { id: 'p1', label: 'Present pressure (gauge)', min: 5, max: 10, step: 0.1, value: 7.5, unit: 'bar' },
        { id: 'p2', label: 'New pressure (gauge)', min: 3, max: 10, step: 0.1, value: 6.5, unit: 'bar' },
        { id: 'u', label: 'Unregulated share of the air (leaks, blowing)', min: 0, max: 60, step: 1, value: 30, unit: '%' },
        { id: 'n', type: 'select', label: 'Compression', options: [['Isothermal limit (n = 1)', 1], ['Typical, n = 1.2 (≈ 7 % per bar)', 1.2], ['Adiabatic, one stage (n = 1.4)', 1.4]], value: 1.2 },
        { id: 'need', label: 'Most demanding machine needs (gauge)', min: 3, max: 8, step: 0.1, value: 5, unit: 'bar' },
        { id: 'drops', label: 'Drops from compressor to that machine', min: 0.2, max: 2, step: 0.05, value: 0.9, unit: 'bar' },
        { id: 'h', label: 'Running hours a year', min: 1000, max: 8760, step: 10, value: 6000, unit: 'h' },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' }
      ], () => { dirty = true; loop.once(); });
      const ro = kit.readout(box.side, [['bar', 'Compression energy per bar here'], ['comp', 'Saved on compression'], ['unreg', 'Saved on unregulated air'], ['tot', 'Total saving'], ['year', 'A year'], ['min', 'Lowest workable setting']]);
      const pl = kit.plot(g1, { x: { label: 'compressor pressure (bar gauge)', min: 3, max: 10 }, y: { label: 'compressor power (kW)', min: 0 }, legend: true }, 150);
      const V = ctl.values, pab = PA / 1e5;
      let dirty = true, R = null;
      const power = p => { const u = V.u / 100; return V.P0 * ((1 - u) + u * (p + pab) / (V.p1 + pab)) * wComp(p, V.n) / wComp(V.p1, V.n); };
      function compute() {
        dirty = false;
        const u = V.u / 100, w1 = wComp(V.p1, V.n), w2 = wComp(V.p2, V.n);
        const Pc = V.P0 * w2 / w1, P2 = power(V.p2), pmin = V.need + V.drops;
        R = { u, w1, w2, Pc, P2, pmin, reg0: V.P0 * (1 - u), un0: V.P0 * u, reg2: V.P0 * (1 - u) * w2 / w1, un2: V.P0 * u * (V.p2 + pab) / (V.p1 + pab) * w2 / w1 };
        ro.set('bar', fx(100 * (1 - wComp(V.p1 - 1, V.n) / w1), 1) + ' % (from ' + fx(V.p1, 1) + ' to ' + fx(V.p1 - 1, 1) + ' bar)');
        ro.set('comp', fx(V.P0 - Pc, 1) + ' kW');
        ro.set('unreg', fx(Pc - P2, 1) + ' kW');
        ro.set('tot', fx(V.P0 - P2, 1) + ' kW, ' + fx(100 * (V.P0 - P2) / V.P0, 1) + ' %');
        ro.set('year', grp((V.P0 - P2) * V.h) + ' kWh, ' + kit.money((V.P0 - P2) * V.h * V.price, 0));
        ro.set('min', fx(pmin, 2) + ' bar' + (V.p2 < pmin ? ' — the new setting would starve the machines' : ''));
        const pts = []; for (let p = 3; p <= 10.001; p += 0.1) pts.push([p, power(p)]);
        const ptsC = []; for (let p = 3; p <= 10.001; p += 0.1) ptsC.push([p, V.P0 * wComp(p, V.n) / w1]);
        pl.set({ series: [{ pts, label: 'with unregulated air following the pressure' }, { pts: ptsC, label: 'compression alone', dash: [5, 4] }],
          marks: [{ x: V.p1, y: V.P0, label: 'now' }, { x: V.p2, y: P2, label: 'new' }], vlines: [{ x: pmin, label: 'lowest workable' }] });
      }
      const loop = kit.loop(() => {
        if (dirty) compute();
        const c = st.begin(), C = kit.colors(), g = design(st, c, 760, 380);
        // stacked bars: power before and after, split into regulated and unregulated uses
        const base = 330, top = 50, sc = (base - top) / Math.max(1, V.P0 * 1.05);
        const bar = (x, reg, un, title) => {
          const h1 = reg * sc, h2 = un * sc;
          c.fillStyle = C.accent; c.fillRect(x, base - h1, 90, h1);
          c.fillStyle = C.warn; c.fillRect(x, base - h1 - h2, 90, h2);
          kit.label(c, fx(reg + un, 1) + ' kW', x + 45, base - h1 - h2 - 12, { color: C.text, size: 13, weight: 700, align: 'center' });
          if (h1 > 16) kit.label(c, fx(reg, 1), x + 45, base - h1 / 2, { color: '#fff', size: 11, align: 'center' });
          if (h2 > 16) kit.label(c, fx(un, 1), x + 45, base - h1 - h2 / 2, { color: '#1a1300', size: 11, align: 'center' });
          kit.label(c, title, x + 45, base + 16, { color: C.text, size: 12, weight: 600, align: 'center' });
        };
        bar(60, R.reg0, R.un0, 'at ' + fx(V.p1, 1) + ' bar');
        bar(200, R.reg2, R.un2, 'at ' + fx(V.p2, 1) + ' bar');
        c.fillStyle = C.accent; c.fillRect(60, 356, 12, 12); kit.label(c, 'regulated machines', 78, 362, { color: C.muted, size: 11 });
        c.fillStyle = C.warn; c.fillRect(210, 356, 12, 12); kit.label(c, 'leaks and unregulated uses', 228, 362, { color: C.muted, size: 11 });
        kit.label(c, 'saved ' + fx(V.P0 - R.P2, 1) + ' kW', 185, 26, { color: C.ok, size: 14, weight: 700, align: 'center' });
        // the pressure staircase
        const x0 = 470, x1 = 720, py = p => base - p / 10 * (base - top);
        c.strokeStyle = C.grid || C.faint; c.lineWidth = 1;
        for (let p = 0; p <= 10; p += 2) { c.beginPath(); c.moveTo(x0, py(p)); c.lineTo(x1, py(p)); c.stroke(); kit.label(c, p + ' bar', x0 - 6, py(p), { color: C.muted, size: 10, align: 'right' }); }
        c.fillStyle = C.ok; c.fillRect(x0 + 20, py(V.need), 60, py(0) - py(V.need));
        c.fillStyle = C.warn; c.fillRect(x0 + 20, py(V.need + V.drops), 60, py(V.need) - py(V.need + V.drops));
        kit.label(c, 'machine needs', x0 + 50, py(V.need / 2), { color: '#fff', size: 11, align: 'center' });
        kit.label(c, 'drops', x0 + 88, py(V.need + V.drops / 2), { color: C.muted, size: 11 });
        const line = (p, col, text) => { c.strokeStyle = col; c.lineWidth = 2.4; c.beginPath(); c.moveTo(x0 + 10, py(p)); c.lineTo(x1, py(p)); c.stroke(); kit.label(c, text, x1, py(p) - 10, { color: col, size: 11, weight: 700, align: 'right' }); };
        line(R.pmin, C.bad, 'lowest workable ' + fx(R.pmin, 2));
        line(V.p1, C.muted, 'now ' + fx(V.p1, 1));
        line(V.p2, V.p2 < R.pmin ? C.bad : C.accent, 'new ' + fx(V.p2, 1));
        kit.label(c, 'pressure staircase', (x0 + x1) / 2, 26, { color: C.muted, size: 12, align: 'center' });
        c.restore();
      }, box.stage);
      loop.once();
      if (st.onResize) st.onResize(() => loop.once());
    }
  });

  /* ================================================================ a lower pressure for the return stroke */
  Hyper.sim('dist-air-saving', {
    title: 'A lower pressure for the return stroke',
    blurb: `A double-acting cylinder driven by a 5/2 solenoid valve with meter-out flow controls. In the line to the rod end sits a pressure regulator, bypassed by a non-return valve for the exhausting air: the working (extending) stroke gets full pressure, the unloaded return stroke only what it needs. Two identical cylinders are simulated side by side with \`kit.fluid.pneuCylinder\` — chamber pressures by the adiabatic energy balance, valve flow by ISO 6358 — one with the regulator, one without, and the free air each takes per cycle is **measured**, tubes and dead volumes included. The drawing shows the one with the regulator.

**Try this**
- Compare the measured air per cycle with and without the regulator; then set the return pressure to 1.5 bar and to 4 bar.
- Watch the rod-end pressure in the graph: it now stops at the regulator's setting instead of the supply pressure.
- Lengthen the tubes to 5 m, then shorten them to 0.2 m: on small bores the tubes are a large share of the air.
- Note the return stroke time: a little slower at low pressure — usually of no consequence, and softer on the end cushion.
- The yearly figures assume the cycle rate set below, 4000 h a year, 6.5 kW per m³/min and ¤0.15 per kWh.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 280 });
      const [g1, g2] = plotRow(box, 2);
      const RODS = { 32: 12, 40: 16, 50: 20, 63: 20, 80: 25 };
      const ctl = kit.controls(box.side, [
        { id: 'dual', type: 'check', label: 'Regulator in the return line', value: true },
        { id: 'pret', label: 'Return-stroke pressure (gauge)', min: 1, max: 6, step: 0.1, value: 2, unit: 'bar' },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 4, max: 8, step: 0.1, value: 6, unit: 'bar' },
        { id: 'bore', type: 'select', label: 'Cylinder', options: Object.keys(RODS).map(b => [b + ' mm bore, ' + RODS[b] + ' mm rod', +b]), value: 50 },
        { id: 'stroke', label: 'Stroke', min: 50, max: 500, step: 10, value: 200, unit: 'mm' },
        { id: 'mass', label: 'Moving mass', min: 0.5, max: 30, value: 3, unit: 'kg', log: true, sig: 2 },
        { id: 'tl', label: 'Tube length, valve to cylinder (each)', min: 0.1, max: 5, step: 0.1, value: 1.5, unit: 'm' },
        { id: 'td', type: 'select', label: 'Tube', options: [['6 mm (4 mm bore)', 4], ['8 mm (5.5 mm bore)', 5.5], ['10 mm (7 mm bore)', 7], ['12 mm (8 mm bore)', 8]], value: 5.5 },
        { id: 'n', label: 'Cycles per minute (for the yearly figures)', min: 1, max: 60, step: 1, value: 20 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id) => { if (['bore', 'stroke', 'tl', 'td', 'mass'].includes(id)) build(); });
      const ro = kit.readout(box.side, [['air', 'Free air per cycle, measured'], ['save', 'Saved per cycle'], ['est', 'Estimate A₂·s·(p₁ − p₂)/pₙ + tube'], ['tret', 'Return stroke time'], ['year', 'A year']]);
      const pPos = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0 } }, 130);
      const pPr = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 130);
      const V = ctl.values;
      let eco, std, hist = [], tPlot = 0, ph = {};
      function model() {
        const D = V.bore / 1000, d = RODS[V.bore] / 1000, A1 = Math.PI * D * D / 4;
        const Cv = 0.0006 * V.bore * V.bore * 1e-8, tube = Math.PI * Math.pow(V.td / 1000, 2) / 4 * V.tl;
        const cy = F.pneuCylinder({ bore: D, rod: d, stroke: V.stroke / 1000, mass: V.mass, psupply: V.ps * 1e5 + PA, patm: PA, Cvalve: Cv, bvalve: 0.3,
          CthrottleA: 1.5 * Cv, CthrottleB: 1.5 * Cv, dead: 5e-6 + tube, fc: 8 + 0.03 * V.ps * 1e5 * A1, fv: 60 });
        return { cy, cmd: 1, wait: 0, t0: 0, air0: 0, cycleAir: 0, tRet: 0, arrived: false, tube };
      }
      function build() { eco = model(); std = model(); hist = []; }
      build();
      function run(M, useReg, sdt) {
        const P = M.cy.params, s = M.cy.state;
        P.psupply = (useReg && M.cmd === 0 ? Math.min(V.pret, V.ps) : V.ps) * 1e5 + PA;
        P.fc = 8 + 0.03 * V.ps * 1e5 * M.cy.AA;
        const atEnd = M.cmd === 1 ? s.x >= P.stroke - 1e-6 : s.x <= 1e-6;
        if (atEnd || s.t - M.t0 > 20) {
          if (!M.arrived) { M.arrived = true; if (M.cmd === 0) M.tRet = s.t - M.t0; }
          M.wait += sdt;
          if (M.wait > 0.3) {
            M.cmd = 1 - M.cmd; M.wait = 0; M.arrived = false; M.t0 = s.t;
            if (M.cmd === 1) { const a = M.cy.airNl(); if (M.air0 > 0) M.cycleAir = a - M.air0; M.air0 = a; }
          }
        }
        M.cy.step(sdt, M.cmd);
      }
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow;
        run(eco, V.dual, sdt); run(std, false, sdt);
        const s = eco.cy.state, P = eco.cy.params, A2 = eco.cy.AB;
        const pA = s.pA - PA, pB = s.pB - PA;
        // read-outs
        const pr = V.dual ? Math.min(V.pret, V.ps) : V.ps;
        const est = (A2 * P.stroke + eco.tube) * (V.ps - pr) * 1e5 / PN * 1000;
        if (eco.cycleAir > 0 && std.cycleAir > 0) {
          const sv = std.cycleAir - eco.cycleAir, yr = sv / 1000 * V.n * 60 * 4000;
          ro.set('air', fx(eco.cycleAir, 3) + ' L ' + (V.dual ? 'with' : 'without') + ' the regulator, ' + fx(std.cycleAir, 3) + ' L without');
          ro.set('save', fx(sv, 3) + ' L, ' + fx(100 * sv / std.cycleAir, 1) + ' %');
          ro.set('year', grp(yr) + ' m³, ' + grp(yr * 6.5 / 60) + ' kWh, ' + kit.money(yr * 6.5 / 60 * 0.15, 0));
        } else { ro.set('air', 'measuring (after the first full cycle)'); ro.set('save', '—'); ro.set('year', '—'); }
        ro.set('est', fx(est, 3) + ' L');
        ro.set('tret', eco.tRet > 0 && std.tRet > 0 ? fx(eco.tRet, 2) + ' s (' + fx(std.tRet, 2) + ' s at full pressure)' : '—');
        tPlot += dt;
        hist.push([s.t, s.x * 1000, pA / 1e5, pB / 1e5]);
        while (hist.length && hist[0][0] < s.t - 3) hist.shift();
        if (tPlot > 0.08) {
          tPlot = 0;
          const h = hist.filter((q, i) => i % 3 === 0);
          pPos.set({ series: [{ pts: h.map(q => [q[0], q[1]]), label: 'position' }], y: { label: 'position (mm)', min: 0, max: V.stroke } });
          pPr.set({ series: [{ pts: h.map(q => [q[0], q[2]]), label: 'cap end' }, { pts: h.map(q => [q[0], q[3]]), label: 'rod end', dash: [5, 4] }], y: { label: 'gauge pressure (bar)', min: 0, max: V.ps + 0.5 } });
        }
        // ---- the circuit on a 760 × 450 design grid
        const c = st.begin(), C = kit.colors(), g = design(st, c, 760, 450);
        const cmd = eco.cmd, exA = cmd !== 1, exB = cmd === 1;
        const stA = exA ? (pA > 0.2e5 ? 'exhaust' : 'idle') : 'air', stB = exB ? (pB > 0.2e5 ? 'exhaust' : 'idle') : 'air';
        const L = { sup: [[170, 412], [170, 405], [212, 405]], main: [[308, 405], [390, 405], [390, 367]], gauge: [[330, 399], [330, 405]],
          A: [[238, 101], [238, 122]], A2: [[238, 178], [238, 300], [381.5, 300], [381.5, 313]], B: [[522, 101], [522, 122]] };
        S.line(c, L.sup, { state: 'air' }); S.line(c, L.main, { state: 'air' }); S.line(c, L.gauge, { state: 'air' }); S.junction(c, 330, 405);
        S.line(c, L.A, { state: stA }); S.line(c, L.A2, { state: stA }); S.line(c, L.B, { state: stB });
        let pathB;
        if (V.dual) {
          S.line(c, [[522, 178], [522, 211]], { state: stB });
          S.line(c, [[522, 269], [522, 300], [398.5, 300], [398.5, 313]], { state: stB });
          S.line(c, [[522, 195], [572, 195], [572, 222]], { state: stB }); S.line(c, [[572, 258], [572, 285], [522, 285]], { state: stB });
          S.junction(c, 522, 195); S.junction(c, 522, 285);
          S.pressureValve(c, 522, 240, { kind: 'regulator', open: 1 });
          S.check(c, 572, 240, { rot: 180, open: exB });
          kit.label(c, 'set ' + fx(pr, 1) + ' bar', 470, 240, { color: C.text, size: 11, weight: 700, align: 'right' });
          pathB = exB ? [[398.5, 313], [398.5, 300], [522, 300], [522, 285], [572, 285], [572, 195], [522, 195], [522, 122]] : [[398.5, 313], [398.5, 300], [522, 300], [522, 122]];
        } else {
          S.line(c, [[522, 178], [522, 300], [398.5, 300], [398.5, 313]], { state: stB });
          pathB = [[398.5, 313], [398.5, 300], [522, 300], [522, 122]];
        }
        const pathA = [[381.5, 313], [381.5, 300], [238, 300], [238, 122]];
        const flowA = exA ? pA > 0.05e5 : pA < V.ps * 1e5 - 0.05e5, flowB = exB ? pB > 0.05e5 : pB < pr * 1e5 - 0.05e5;
        const adv = (k, on) => { ph[k] = (ph[k] || 0) + (on ? dt * 40 : 0); return ph[k]; };
        if (flowA) S.flow(c, exA ? pathA.slice().reverse() : pathA, adv('a', true), { color: S.col(exA ? 'exhaust' : 'air') });
        if (flowB) S.flow(c, exB ? pathB.slice().reverse() : pathB, adv('b', true), { color: S.col(exB ? 'exhaust' : 'air') });
        S.source(c, 170, 432, { pneumatic: true });
        S.frl(c, 260, 405);
        S.gauge(c, 330, 378, { frac: V.ps / 12, value: fx(V.ps, 1) + ' bar' });
        const vs = eco.vs = (eco.vs == null ? 1 : eco.vs) + clamp((cmd === 1 ? 0 : 1) - (eco.vs == null ? 1 : eco.vs), -dt / 0.03, dt / 0.03);
        const v52 = S.valve(c, 390, 340, { spec: '5/2', state: vs, left: 'solenoid', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, '14', v52.xl - 8, 340, { color: cmd === 1 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        S.flowControl(c, 238, 150, { free: 'up' }); S.flowControl(c, 522, 150, { free: 'up' });
        const fill = p => p > 0.2e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.08 + 0.42 * p / (V.ps * 1e5)) + ')' : null;
        const cy = S.cylinder(c, 230, 70, { len: 300, h: 42, rodLen: 150, pos: s.x / P.stroke, fillA: fill(pA), fillB: fill(pB), cushion: true });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        const mw = 24 + 5 * Math.log2(1 + V.mass);
        c.fillRect(cy.tip[0], 70 - mw / 2, mw, mw); c.strokeRect(cy.tip[0], 70 - mw / 2, mw, mw);
        kit.label(c, fx(V.mass, 1) + ' kg', cy.tip[0] + mw / 2, 70 + mw / 2 + 12, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, fx(pA / 1e5, 1) + ' bar', 280, 36, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, fx(pB / 1e5, 1) + ' bar', 480, 36, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, 't = ' + fx(s.t, 2) + ' s', 740, 440, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a week of logged data */
  Hyper.sim('dist-audit-log', {
    title: 'A week on the data logger',
    blurb: `What an audit's flow meter and power logger record over one week, minute by minute: production shifts with their breaks, and the flow that never stops — leaks. The compressor is either a **load/unload** machine (loaded at full power, unloaded at 30 % of it, with a delivery of about 1.3 times the production peak) or a **variable-speed** one whose power follows the flow. The bar above splits the week's energy into productive air, leaks during production, leaks and idle running outside production, and unloaded running. (The demand pattern is synthetic, with seeded random variation.)

**Try this**
- Read the weekend baseline in the flow graph: it is the leakage, running 168 hours a week.
- Tick "shut the air off outside production" and read the saving; then set three shifts — less idle time, less to save.
- Switch to a variable-speed compressor: the grey "unloaded" slice vanishes and the specific energy falls.
- Raise the leakage to 50 %: the specific energy looks fine, yet a third of the bill buys nothing.
- Lower the pressure by a bar: the leaks shrink with the absolute pressure.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.22, minH: 120 });
      const [g1, g2] = plotRow(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'shifts', type: 'select', label: 'Production', options: [['One shift, 06–14, Mon–Fri', 1], ['Two shifts, 06–22, Mon–Fri', 2], ['Three shifts, Mon 06 – Sat 06', 3]], value: 2 },
        { id: 'qp', label: 'Production demand (average)', min: 2, max: 30, step: 0.5, value: 9, unit: 'm³/min' },
        { id: 'leak', label: 'Leakage (share of production demand)', min: 0, max: 60, step: 1, value: 28, unit: '%' },
        { id: 'p', label: 'Line pressure (gauge)', min: 5, max: 9, step: 0.1, value: 7, unit: 'bar' },
        { id: 'ctrl', type: 'select', label: 'Compressor', options: [['Load/unload', 'lu'], ['Variable speed', 'vsd']], value: 'lu' },
        { id: 'off', type: 'check', label: 'Shut the air off outside production', value: false },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' }
      ], () => { dirty = true; loop.once(); });
      const ro = kit.readout(box.side, [['avg', 'Flow in production / at idle'], ['leak', 'Leaks: share of the air made'], ['se', 'Specific energy'], ['year', 'A year (52 weeks)'], ['lc', 'What the leaks cost a year'], ['unl', 'Unloaded running a year'], ['off', 'Shutting off outside production']]);
      const pF = kit.plot(g1, { x: { label: 'hours from Monday 00:00', min: 0, max: 168 }, y: { label: 'free-air flow (m³/min)', min: 0 } }, 150);
      const pP = kit.plot(g2, { x: { label: 'hours from Monday 00:00', min: 0, max: 168 }, y: { label: 'compressor power (kW)', min: 0 } }, 150);
      const V = ctl.values;
      let dirty = true, W = null;
      const inProd = (hr, shifts) => {
        const day = Math.floor(hr / 24), hd = hr - day * 24;
        if (shifts === 3) return hr >= 6 && hr < 5 * 24 + 6;
        if (day > 4) return false;
        return hd >= 6 && hd < (shifts === 2 ? 22 : 14);
      };
      function week(off) {
        const rand = rng(11), N = 168 * 60, pscale = (V.p + PA / 1e5) / 8.013, w = wComp(V.p, 1.2) / wComp(7, 1.2);
        const qL0 = V.leak / 100 * V.qp * pscale, fad = Math.ceil(V.qp * 1.3 + qL0), Pf = 6.3 * fad * w, u = 0.3;
        let n = 0;
        const out = { t: [], q: [], P: [], e: { prod: 0, leakP: 0, leakI: 0, unl: 0 }, air: 0, leakAir: 0, E: 0, qProdSum: 0, prodMin: 0, qIdleSum: 0, idleMin: 0, fad, Pf };
        for (let k = 0; k < N; k++) {
          const hr = k / 60, prod = inProd(hr, V.shifts);
          n = 0.95 * n + 0.3 * (rand() - 0.5);
          const hd = hr % 24, brk = prod && (Math.abs(hd - 10) < 0.25 || Math.abs(hd - 18) < 0.25 || Math.abs(hd - 2) < 0.25);
          const qp = prod ? V.qp * clamp(1 + n, 0.4, 1.6) * (brk ? 0.3 : 1) : 0;
          const running = prod || !off, qL = running ? qL0 : 0, Q = Math.min(fad, qp + qL);
          let P = 0, loadedP = 0, unl = 0;
          if (running) {
            if (V.ctrl === 'vsd') { loadedP = 6.6 * w * Q; P = loadedP + 0.4; unl = 0.4; }
            else { const x = Q / fad; loadedP = Pf * x; unl = Pf * u * (1 - x); P = loadedP + unl; }
          }
          const sh = Q > 0 ? qp / Q : 0;
          out.e.prod += loadedP * sh / 60;
          if (prod) out.e.leakP += loadedP * (1 - sh) / 60; else out.e.leakI += loadedP * (1 - sh) / 60;
          out.e.unl += unl / 60;
          out.air += Q; out.leakAir += qL; out.E += P / 60;
          if (prod) { out.qProdSum += Q; out.prodMin++; } else { out.qIdleSum += Q; out.idleMin++; }
          if (k % 10 === 0) { out.t.push(hr); out.q.push(Q); out.P.push(P); }
        }
        return out;
      }
      function compute() {
        dirty = false;
        W = week(V.off);
        const alt = week(!V.off), on = V.off ? alt : W, offW = V.off ? W : alt;
        const qProd = W.qProdSum / Math.max(1, W.prodMin), qIdle = W.qIdleSum / Math.max(1, W.idleMin);
        ro.set('avg', fx(qProd, 1) + ' / ' + fx(qIdle, 2) + ' m³/min');
        ro.set('leak', fx(100 * W.leakAir / Math.max(1e-9, W.air), 0) + ' % of ' + grp(W.air) + ' m³ this week');
        ro.set('se', fx(W.E / Math.max(1e-9, W.air), 3) + ' kWh/m³ (' + fx(60 * W.E / Math.max(1e-9, W.air), 2) + ' kW per m³/min)');
        ro.set('year', grp(W.E * 52) + ' kWh, ' + kit.money(W.E * 52 * V.price, 0));
        ro.set('lc', kit.money((W.e.leakP + W.e.leakI) * 52 * V.price, 0) + ' (' + grp((W.e.leakP + W.e.leakI) * 52) + ' kWh)');
        ro.set('unl', grp(W.e.unl * 52) + ' kWh, ' + kit.money(W.e.unl * 52 * V.price, 0));
        const sv = (on.E - offW.E) * 52;
        ro.set('off', (V.off ? 'saves ' : 'would save ') + grp(sv) + ' kWh, ' + kit.money(sv * V.price, 0) + ' a year');
        const pts = (arr) => W.t.map((t, i) => [t, arr[i]]);
        const vl = [24, 48, 72, 96, 120, 144].map((x, i) => ({ x, label: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] }));
        pF.set({ series: [{ pts: pts(W.q), label: 'flow', fill: true }], hlines: [{ y: qIdle, label: 'baseline ' + fx(qIdle, 2) }], vlines: vl, y: { label: 'free-air flow (m³/min)', min: 0, max: W.fad * 1.05 } });
        pP.set({ series: [{ pts: pts(W.P), label: 'power', fill: true }], vlines: vl, y: { label: 'compressor power (kW)', min: 0, max: W.Pf * 1.1 } });
      }
      const loop = kit.loop(() => {
        if (dirty) compute();
        const c = st.begin(), C = kit.colors(), g = design(st, c, 760, 150);
        const parts = [['productive air', W.e.prod, C.accent], ['leaks in production', W.e.leakP, C.warn], ['leaks outside production', W.e.leakI, C.bad], ['unloaded running', W.e.unl, C.muted]];
        const tot = Math.max(1e-9, parts.reduce((a, p) => a + p[1], 0));
        let x = 20;
        kit.label(c, 'the week\'s compressor energy: ' + grp(tot) + ' kWh', 20, 20, { color: C.text, size: 13, weight: 700 });
        parts.forEach((p, i) => {
          const w = 720 * p[1] / tot;
          c.fillStyle = p[2]; c.fillRect(x, 40, Math.max(0, w), 40);
          if (w > 70) kit.label(c, fx(100 * p[1] / tot, 0) + ' %', x + w / 2, 60, { color: '#fff', size: 12, weight: 700, align: 'center' });
          c.fillRect(20 + i * 185, 100, 12, 12);
          kit.label(c, p[0] + ': ' + grp(p[1]) + ' kWh', 38 + i * 185, 106, { color: C.muted, size: 11 });
          x += w;
        });
        c.restore();
      }, box.stage);
      loop.once();
      if (st.onResize) st.onResize(() => loop.once());
    }
  });

  /* ================================================================ pneumatic or electric */
  Hyper.sim('dist-pneu-vs-electric', {
    title: 'Pneumatic or electric: the lifetime bill',
    blurb: `The same job done two ways: move a load over a stroke, push with a force at the end, come back — by a pneumatic cylinder at 6 bar, sized for a load ratio of 70 %, or by an electric axis (ball screw, motor and drive). The cylinder's energy is its free air per cycle — both chambers and 1.5 m of tube to each port — at 390 kJ per m³ (6.5 kW per m³/min), plus an allowance for leaks and drops. The axis's energy is its friction work and kinetic energy there and back at 70 % efficiency, plus the drive's standby power all the time. Holding a force at the end costs the axis current, which is not counted here; the cylinder holds it for nothing.

**Try this**
- With the defaults, read the energy per cycle of each and the break-even time.
- Raise the cycle rate to 60 per minute and the hours to 8000: electric pays back in a year or two.
- Drop to 2 cycles a minute: the axis's standby power dominates and the cylinder's lower price wins for ever.
- Set the leak allowance to 50 %, typical of a poorly kept plant: the break-even moves much closer.
- Increase the force: the cylinder grows a size (more air), while the axis's energy barely changes.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 220 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'F', label: 'Force needed at the end', min: 50, max: 3000, value: 300, unit: 'N', log: true, sig: 3 },
        { id: 'm', label: 'Moving mass', min: 0.5, max: 50, value: 5, unit: 'kg', log: true, sig: 2 },
        { id: 's', label: 'Stroke', min: 25, max: 500, step: 5, value: 200, unit: 'mm' },
        { id: 'n', label: 'Cycles per minute', min: 1, max: 60, step: 1, value: 20 },
        { id: 'h', label: 'Hours a year', min: 1000, max: 8760, step: 10, value: 4000, unit: 'h' },
        { id: 'yrs', label: 'Years of service', min: 1, max: 15, step: 1, value: 10 },
        { id: 'loss', label: 'Pneumatic: allowance for leaks and drops', min: 0, max: 60, step: 1, value: 25, unit: '%' },
        { id: 'cp', label: 'Pneumatic solution price', min: 100, max: 2000, step: 10, value: 350, unit: '¤' },
        { id: 'ce', label: 'Electric axis price', min: 500, max: 6000, step: 50, value: 2000, unit: '¤' },
        { id: 'ps', label: 'Electric drive standby power', min: 2, max: 40, step: 1, value: 12, unit: 'W' },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['bore', 'Cylinder chosen'], ['ep', 'Pneumatic energy'], ['ee', 'Electric energy'], ['ratio', 'Energy ratio'], ['be', 'Electric pays back after'], ['life', 'Cost over the service life']]);
      const pl = kit.plot(g1, { x: { label: 'years', min: 0 }, y: { label: 'cumulative cost', min: 0, fmt: v => kit.money(v, 0, true) }, fmtY: v => kit.money(v, 0), legend: true }, 150);
      const V = ctl.values;
      let dirty = true, R = null, phase = 0;
      function compute() {
        dirty = false;
        const p = 6e5, pick = BORES.find(b => 0.7 * p * Math.PI * Math.pow(b[0] / 1000, 2) / 4 >= V.F) || BORES[BORES.length - 1];
        const D = pick[0] / 1000, d = pick[1] / 1000, A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4, s = V.s / 1000;
        const tb = pick[0] <= 32 ? 4 : pick[0] <= 63 ? 5.5 : pick[0] <= 100 ? 7 : 9, Vt = Math.PI * Math.pow(tb / 1000, 2) / 4 * 1.5;
        const Vf = ((A1 + A2) * s * (p + PA) + 2 * Vt * p) / PN, Ep = Vf * (1 + V.loss / 100) * 390e3;
        const T = 60 / V.n, v = 1.5 * s / (0.25 * T), Ff = 10 + 0.1 * V.m * 9.81;
        const Ee = 2 * (Ff * s + 0.5 * V.m * v * v) / 0.7 + V.ps * T;
        const N = V.n * 60 * V.h, costP = Ep * N / 3.6e6 * V.price, costE = Ee * N / 3.6e6 * V.price;
        const be = costP > costE ? (V.ce - V.cp) / (costP - costE) : Infinity;
        R = { pick, Vf, Ep, Ee, N, costP, costE, be, T, short: pick[0] === BORES[BORES.length - 1][0] && 0.7 * p * A1 < V.F };
        ro.set('bore', pick[0] + ' mm bore, ' + pick[1] + ' mm rod' + (R.short ? ' (too small even so)' : '') + ': ' + fx(Vf * 1000, 2) + ' L of free air a cycle');
        ro.set('ep', fx(Ep, 0) + ' J a cycle, ' + grp(Ep * N / 3.6e6) + ' kWh, ' + kit.money(costP, 0) + ' a year');
        ro.set('ee', fx(Ee, 1) + ' J a cycle, ' + grp(Ee * N / 3.6e6) + ' kWh, ' + kit.money(costE, 0) + ' a year');
        ro.set('ratio', 'the cylinder uses ' + fx(Ep / Math.max(1e-9, Ee), 1) + ' times as much');
        ro.set('be', V.ce <= V.cp ? 'at once (it is not dearer)' : Number.isFinite(be) ? fx(be, 1) + ' years' + (be > V.yrs ? ' — beyond the service life' : '') : 'never');
        ro.set('life', 'pneumatic ' + kit.money(V.cp + V.yrs * costP, 0) + ', electric ' + kit.money(V.ce + V.yrs * costE, 0));
        const yp = [], ye = [];
        for (let y = 0; y <= V.yrs; y += 0.25) { yp.push([y, V.cp + y * costP]); ye.push([y, V.ce + y * costE]); }
        pl.set({ series: [{ pts: yp, label: 'pneumatic' }, { pts: ye, label: 'electric', dash: [6, 4] }], vlines: Number.isFinite(be) && be > 0 && be <= V.yrs ? [{ x: be, label: 'break-even' }] : [],
          x: { label: 'years', min: 0, max: V.yrs } });
      }
      const loop = kit.loop((dt) => {
        if (dirty) compute();
        const c = st.begin(), C = kit.colors(), g = design(st, c, 760, 330);
        phase = (phase + dt / Math.max(R.T, 1.6)) % 1;
        const sm = t => (1 - Math.cos(Math.PI * clamp(t, 0, 1))) / 2;
        const pos = phase < 0.25 ? sm(phase / 0.25) : phase < 0.5 ? 1 : phase < 0.75 ? 1 - sm((phase - 0.5) / 0.25) : 0;
        // lane 1: the cylinder
        kit.label(c, 'pneumatic cylinder Ø' + R.pick[0] + ' mm at 6 bar', 20, 26, { color: C.text, size: 12, weight: 700 });
        const cy = S.cylinder(c, 40, 80, { len: 200, h: 34, rodLen: 110, pos, fillA: pos > 0.02 && phase < 0.5 ? (C.dark ? 'rgba(79,141,255,.4)' : 'rgba(29,78,216,.3)') : null, fillB: phase >= 0.5 && pos < 0.98 ? (C.dark ? 'rgba(79,141,255,.4)' : 'rgba(29,78,216,.3)') : null });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.4; c.fillRect(cy.tip[0], 66, 28, 28); c.strokeRect(cy.tip[0], 66, 28, 28);
        kit.label(c, fx(R.Ep, 0) + ' J per cycle', 20, 132, { color: C.warn, size: 12, weight: 700 });
        // lane 2: the electric axis
        kit.label(c, 'electric axis (screw, motor, drive)', 20, 176, { color: C.text, size: 12, weight: 700 });
        S.emotor(c, 56, 236, {});
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(80, 230, 260, 12);
        for (let x = 84; x < 338; x += 8) { c.beginPath(); c.moveTo(x, 242); c.lineTo(x + 6, 230); c.stroke(); }
        const cx = 90 + pos * 200;
        c.fillStyle = C.surface; c.fillRect(cx, 218, 44, 36); c.strokeRect(cx, 218, 44, 36);
        kit.label(c, fx(R.Ee, 1) + ' J per cycle', 20, 284, { color: C.accent, size: 12, weight: 700 });
        // lifetime cost bars: purchase and energy
        const tp = V.cp + V.yrs * R.costP, te = V.ce + V.yrs * R.costE, mx = Math.max(tp, te, 1), x0 = 420, wmax = 300;
        const bar = (y, buy, en, col) => {
          c.fillStyle = C.muted; c.fillRect(x0, y, wmax * buy / mx, 26);
          c.fillStyle = col; c.fillRect(x0 + wmax * buy / mx, y, wmax * en / mx, 26);
          kit.label(c, kit.money(buy + en, 0), x0 + wmax * (buy + en) / mx + 6, y + 13, { color: C.text, size: 12, weight: 700 });
          kit.label(c, 'price ' + kit.money(buy, 0) + ' + energy ' + kit.money(en, 0), x0, y + 40, { color: C.muted, size: 10.5 });
        };
        kit.label(c, 'cost over ' + V.yrs + ' years', x0, 26, { color: C.muted, size: 12 });
        bar(66, V.cp, V.yrs * R.costP, C.warn);
        bar(222, V.ce, V.yrs * R.costE, C.accent);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
