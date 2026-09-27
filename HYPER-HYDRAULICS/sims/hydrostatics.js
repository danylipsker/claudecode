/* HYPER-HYDRAULICS · sims/hydrostatics.js — simulations for the Hydrostatics branch.
 *   hs-depth-pressure     vessels of different shapes, layers, a draggable probe; pressure against depth
 *   hs-hydraulic-jack     a jack in section (plunger, check valves, ram, release valve) beside its ISO 1219 circuit
 *   hs-manometer          U-tube, differential and inclined manometers; the column sloshes and settles
 *   hs-plane-gate         a gate in a tilted wall: pressure prism, resultant, centroid and centre of pressure
 *   hs-curved-gate        a radial (Tainter) gate: pressure normal to the arc, components, trunnion moment, hoist
 *   hs-buoyancy           a block on a spring balance lowered into a beaker on a scale
 *   hs-floating-stability a box barge heeling: G, B, M, GZ, the GZ curve, released to roll
 *   hs-dam                a gravity dam: thrust, weight, uplift, overturning, sliding, middle third
 * Hydrostatics needs no pipe-flow or pump models, so kit.fluid is not used here; the few helpers
 * (polygon clipping, centroids) live in this file. */
(function () {
  'use strict';
  const G0 = 9.80665;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const LIQ = {
    water: { name: 'fresh water', rho: 998, hue: 205 },
    sea: { name: 'sea water', rho: 1025, hue: 195 },
    oil: { name: 'hydraulic oil', rho: 870, hue: 40 },
    petrol: { name: 'petrol', rho: 740, hue: 55 },
    glycerine: { name: 'glycerine', rho: 1260, hue: 285 },
    mercury: { name: 'mercury', rho: 13546, grey: true },
    gaugeoil: { name: 'red gauge oil', rho: 830, hue: 355 },
    air: { name: 'air', rho: 1.2, hue: 200, air: true }
  };
  function liqCol(kit, key, a) {
    const L = LIQ[key] || LIQ.water, C = kit.colors();
    if (L.grey) return C.dark ? 'rgba(205,210,222,' + a + ')' : 'rgba(105,112,125,' + a + ')';
    if (L.air) return kit.hue(L.hue, a * 0.2);
    return kit.hue(L.hue, a);
  }
  /* draw on a fixed design grid scaled to the stage (as the reference circuit does) */
  function design(st, W, H) {
    const c = st.begin(), k = Math.min(st.W / W, st.H / H) || 1;
    const ox = (st.W - W * k) / 2, oy = (st.H - H * k) / 2;
    c.save(); c.translate(ox, oy); c.scale(k, k);
    return { c, k, ox, oy };
  }
  const toGrid = (p, m) => ({ x: (p.x - m.ox) / m.k, y: (p.y - m.oy) / m.k });
  function path(c, pts, close) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); }
  function line(c, pts, color, w, dash) { c.save(); c.strokeStyle = color; c.lineWidth = w || 1.5; c.setLineDash(dash || []); c.lineJoin = 'round'; c.lineCap = 'round'; path(c, pts); c.stroke(); c.restore(); }
  function fillPoly(c, pts, color) { c.fillStyle = color; path(c, pts, true); c.fill(); }
  /* polygons in world coordinates: keep the part with y ≤ yc (Sutherland–Hodgman) */
  function clipBelow(pts, yc) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const ina = a[1] <= yc, inb = b[1] <= yc;
      if (ina) out.push(a);
      if (ina !== inb) { const t = (yc - a[1]) / (b[1] - a[1]); out.push([a[0] + t * (b[0] - a[0]), yc]); }
    }
    return out;
  }
  function areaCentroid(pts) {
    let A = 0, cx = 0, cy = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length], cr = p[0] * q[1] - q[0] * p[1];
      A += cr; cx += (p[0] + q[0]) * cr; cy += (p[1] + q[1]) * cr;
    }
    if (Math.abs(A) < 1e-12) return { A: 0, x: 0, y: 0 };
    return { A: Math.abs(A / 2), x: cx / (3 * A), y: cy / (3 * A) };
  }
  function inPoly(x, y, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function distSeg(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    const t = L2 ? clamp(((px - ax) * dx + (py - ay) * dy) / L2, 0, 1) : 0;
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  }
  const force = N => { const a = Math.abs(N); return a >= 1e6 ? (N / 1e6).toFixed(2) + ' MN' : a >= 1e3 ? (N / 1e3).toFixed(a >= 1e5 ? 0 : 1) + ' kN' : N.toFixed(a >= 10 ? 0 : 1) + ' N'; };
  const kpa = Pa => (Pa / 1000).toFixed(Math.abs(Pa) >= 1e5 ? 0 : 1) + ' kPa';
  // a vertical dimension line with arrows at both ends and a label
  function dimV(kit, c, x, y1, y2, text, color, align) {
    if (Math.abs(y2 - y1) < 2) return;
    line(c, [[x, y1], [x, y2]], color, 1.2);
    const s = y2 > y1 ? 1 : -1;
    c.fillStyle = color;
    path(c, [[x, y1], [x - 3.5, y1 + 7 * s], [x + 3.5, y1 + 7 * s]], true); c.fill();
    path(c, [[x, y2], [x - 3.5, y2 - 7 * s], [x + 3.5, y2 - 7 * s]], true); c.fill();
    kit.label(c, text, x + (align === 'right' ? -6 : 6), (y1 + y2) / 2, { color, size: 11.5, weight: 600, align: align || 'left' });
  }

  /* ====================================================================== pressure and depth */
  function vesselShape(kind, Hc) {
    const t25 = Math.tan(25 * Math.PI / 180), k = 0.35;
    if (kind === 'flared') return { poly: [[-1, 0], [1, 0], [1 + Hc * t25, Hc], [-1 - Hc * t25, Hc]], width: y => 2 + 2 * y * t25, probeX: 0 };
    if (kind === 'narrow') return { poly: [[-2.5, 0], [2.5, 0], [0.35, 2], [0.35, Hc], [-0.35, Hc], [-0.35, 2]], width: y => y < 2 ? 5 - 4.3 * y / 2 : 0.7, probeX: 0 };
    if (kind === 'connected') return { poly: [[-4.5, Hc], [-4.5, 0], [3.5, 0], [3.5 + k * Hc, Hc], [2.5 + k * Hc, Hc], [2.5 + k * 0.4, 0.4], [0.75, 0.4], [0.75, Hc], [0.25, Hc], [0.25, 0.4], [-1.5, 0.4], [-1.5, Hc]], width: null, probeX: -3 };
    return { poly: [[-2.5, 0], [2.5, 0], [2.5, Hc], [-2.5, Hc]], width: () => 5, probeX: 0 };
  }

  Hyper.sim('hs-depth-pressure', {
    title: 'Pressure and depth',
    blurb: `A vessel of liquid with a pressure probe you can drag anywhere in it. Beside it, pressure against depth on the same vertical scale: the line is the **absolute** pressure, the shaded band the **gauge** pressure above the local atmosphere (dashed).

**Try this**
- Drag the probe sideways at one depth: the reading does not change. Only depth counts.
- Switch between the vessel shapes. The pressure on the bottom is the same in all of them; compare the force on the base with the weight of the liquid — the sloping walls take up the difference (the hydrostatic paradox).
- Choose the connected vessels: the liquid stands at one level in all three, and the probe reads the same at the same depth in each.
- Float a layer of oil or petrol on the water: the line bends at the interface, rising more slowly through the lighter layer.
- Pressurise the surface (a closed tank with gas above): the whole line shifts right by the same amount at every depth — Pascal's law.
- Move the site to 3000 m: the gauge readings stay the same, every absolute pressure drops by 31 kPa.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 290 });
      let probe = null, map = { k: 1, ox: 0, oy: 0 }, geo = null;
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Vessel', options: [['Wide tank', 'wide'], ['Flared: wider at the top', 'flared'], ['Narrowing: wider at the bottom', 'narrow'], ['Three connected vessels', 'connected']], value: (params && params.shape) || 'wide' },
        { id: 'liq', type: 'select', label: 'Liquid', options: [['Fresh water (998 kg/m³)', 'water'], ['Sea water (1025 kg/m³)', 'sea'], ['Hydraulic oil (870 kg/m³)', 'oil'], ['Mercury (13 546 kg/m³)', 'mercury']], value: 'water' },
        { id: 'H', label: 'Depth of the liquid', min: 0.5, max: 10, step: 0.1, value: 4, unit: 'm' },
        { id: 'top', type: 'select', label: 'Layer floating on top', options: [['None', 'none'], ['Oil (870 kg/m³)', 'oil'], ['Petrol (740 kg/m³)', 'petrol']], value: 'none' },
        { id: 't', label: 'Thickness of the top layer', min: 0.2, max: 4, step: 0.1, value: 1, unit: 'm' },
        { id: 'ps', label: 'Gas pressure on the surface (gauge)', min: 0, max: 200, step: 5, value: 0, unit: 'kPa' },
        { id: 'atm', type: 'select', label: 'Site (local atmosphere)', options: [['Sea level: 101.3 kPa', 101.325], ['1000 m: 89.9 kPa', 89.875], ['2000 m: 79.5 kPa', 79.495], ['3000 m: 70.1 kPa', 70.108]], value: 101.325 }
      ], () => { geo = null; });
      const ro = kit.readout(box.side, [['d', 'Probe depth below the surface'], ['pg', 'Gauge pressure'], ['pa', 'Absolute pressure'], ['hw', 'As a head of fresh water'], ['base', 'Force on the base / weight of liquid (per metre)']]);
      const V = ctl.values;
      function build() {
        const top = V.top !== 'none', t = top ? V.t : 0, Ht = V.H + t;
        const Hc = Math.max(3, Ht * 1.15 + 0.3);
        const sh = vesselShape(V.shape, Hc);
        let xmin = Infinity, xmax = -Infinity;
        for (const p of sh.poly) { xmin = Math.min(xmin, p[0]); xmax = Math.max(xmax, p[0]); }
        const s = Math.min(350 / Hc, 410 / (xmax - xmin));
        return { sh, Hc, Ht, t, top, s, cx: 235 - (xmin + xmax) / 2 * s };
      }
      const X = x => geo.cx + x * geo.s, Y = y => 400 - y * geo.s;
      const rhoL = () => LIQ[V.liq].rho, rhoT = () => geo.top ? LIQ[V.top].rho : 0;
      function pAt(y) {                                  // gauge pressure (Pa) at height y above the base
        const ps = V.ps * 1000;
        if (y >= geo.Ht) return ps;
        if (y >= V.H) return ps + rhoT() * G0 * (geo.Ht - y);
        return ps + rhoT() * G0 * geo.t + rhoL() * G0 * (V.H - y);
      }
      const inLiquid = (x, y) => y >= 0 && y <= geo.Ht && inPoly(x, y, geo.sh.poly);
      function placeProbe() {
        if (probe && inLiquid(probe.x, probe.y)) return;
        const x = geo.sh.probeX;
        let y = probe ? clamp(probe.y, 0.05, geo.Ht - 0.05) : geo.Ht * 0.35;
        if (!inLiquid(x, y)) y = Math.min(0.2, geo.Ht * 0.5);
        probe = { x, y };
      }
      const pick = p => { const q = toGrid(p, map); return { x: (q.x - geo.cx) / geo.s, y: (400 - q.y) / geo.s }; };
      kit.drag(st, {
        hit: p => { if (!geo) return null; const w = pick(p); return inLiquid(w.x, w.y) ? 'probe' : null; },
        move: (_, p) => { if (!geo) return; const w = pick(p); if (inLiquid(w.x, w.y)) probe = w; },
        hover: true
      });
      const loop = kit.loop(() => {
        if (!geo) geo = build();
        placeProbe();
        const m = design(st, 760, 430), c = m.c, C = kit.colors();
        map = m;
        const patm = V.atm * 1000, ps = V.ps * 1000, pBot = pAt(0);
        const scr = geo.sh.poly.map(p => [X(p[0]), Y(p[1])]);
        // liquid, clipped to the inside of the vessel
        c.save(); path(c, scr, true); c.clip();
        if (ps > 0) { c.fillStyle = C.dark ? 'rgba(224,160,48,0.12)' : 'rgba(224,160,48,0.14)'; c.fillRect(0, Y(geo.Hc), 760, Y(geo.Ht) - Y(geo.Hc)); }
        c.fillStyle = liqCol(kit, V.liq, 0.42); c.fillRect(0, Y(V.H), 760, Y(0) - Y(V.H) + 1);
        if (geo.top) { c.fillStyle = liqCol(kit, V.top, 0.45); c.fillRect(0, Y(geo.Ht), 760, Y(V.H) - Y(geo.Ht)); }
        c.restore();
        // walls (the open tops are not drawn, unless the tank is closed and pressurised)
        c.strokeStyle = C.text; c.lineWidth = 3; c.lineCap = 'round';
        for (let i = 0; i < scr.length; i++) {
          const a = geo.sh.poly[i], b = geo.sh.poly[(i + 1) % scr.length];
          if (a[1] >= geo.Hc - 1e-9 && b[1] >= geo.Hc - 1e-9 && ps <= 0) continue;
          c.beginPath(); c.moveTo(scr[i][0], scr[i][1]); c.lineTo(scr[(i + 1) % scr.length][0], scr[(i + 1) % scr.length][1]); c.stroke();
        }
        if (ps > 0) kit.label(c, 'closed: gas at +' + V.ps.toFixed(0) + ' kPa', X(geo.sh.probeX), Y(geo.Hc) - 12, { color: C.warn, size: 12, weight: 700, align: 'center' });
        // free surface marks and the interface
        kit.label(c, '▽', X(geo.sh.probeX) + 12, Y(geo.Ht) - 8, { color: C.accent, size: 13, align: 'center' });
        if (geo.top) kit.label(c, LIQ[V.top].name, 20, Y((V.H + geo.Ht) / 2), { color: C.muted, size: 11 });
        kit.label(c, LIQ[V.liq].name, 20, Y(V.H / 2), { color: C.muted, size: 11 });
        // the probe
        const px = X(probe.x), py = Y(probe.y), pg = pAt(probe.y);
        kit.dot(c, px, py, 6.5, C.bad, C.text);
        line(c, [[px - 10, py], [px + 10, py]], C.surface, 1.2); line(c, [[px, py - 10], [px, py + 10]], C.surface, 1.2);
        kit.label(c, (pg / 1000).toFixed(1) + ' kPa', px + 12, py - 14, { color: C.text, size: 12, weight: 700, bg: C.surface });
        // ---- pressure against depth, on the same vertical scale
        const x0 = 500, x1 = 745, pmax = Math.max(patm + pBot, 1) * 1.08, kx = (x1 - x0) / pmax;
        const PX = p => x0 + p * kx, yTop = Y(geo.Hc), yBot = Y(0);
        const prof = [[PX(patm + ps), yTop], [PX(patm + ps), Y(geo.Ht)]];
        if (geo.top) prof.push([PX(patm + pAt(V.H)), Y(V.H)]);
        prof.push([PX(patm + pBot), yBot]);
        c.fillStyle = kit.hue(215, 0.16); path(c, [[PX(patm), yTop]].concat(prof, [[PX(patm), yBot]]), true); c.fill();
        line(c, [[x0, yTop - 6], [x0, yBot], [x1, yBot]], C.axis, 1.2);
        const stepk = Hyper.niceStep(pmax / 1000, 4);
        for (let v = 0; v <= pmax / 1000 + 1e-9; v += stepk) {
          const xx = PX(v * 1000); line(c, [[xx, yBot], [xx, yBot + 4]], C.axis, 1);
          kit.label(c, String(+v.toFixed(3)), xx, yBot + 12, { color: C.muted, size: 10.5, align: 'center' });
        }
        kit.label(c, 'absolute pressure (kPa)', (x0 + x1) / 2, yBot + 25, { color: C.muted, size: 11, align: 'center' });
        const stepd = Hyper.niceStep(geo.Ht, 5);
        for (let d = 0; d <= geo.Ht + 1e-9; d += stepd) {
          const yy = Y(geo.Ht - d); line(c, [[x0 - 4, yy], [x0, yy]], C.axis, 1);
          kit.label(c, String(+d.toFixed(2)), x0 - 6, yy, { color: C.muted, size: 10.5, align: 'right' });
        }
        kit.label(c, 'depth (m)', x0 - 6, yTop - 12, { color: C.muted, size: 11, align: 'right' });
        line(c, [[PX(patm), yTop], [PX(patm), yBot]], C.muted, 1.2, [5, 4]);
        kit.label(c, 'atmosphere', PX(patm) + 4, yTop - 4, { color: C.muted, size: 10.5 });
        line(c, prof, C.accent, 2.5);
        const qx = PX(patm + pg);
        line(c, [[px + 8, py], [qx, py]], C.bad, 1, [3, 4]);
        kit.dot(c, qx, py, 4.5, C.bad);
        c.restore();
        // read-outs
        const depth = geo.Ht - probe.y;
        ro.set('d', depth.toFixed(2) + ' m' + (geo.top && probe.y > V.H ? ' (in the top layer)' : ''));
        ro.set('pg', (pg / 1000).toFixed(2) + ' kPa = ' + (pg / 1e5).toFixed(3) + ' bar');
        ro.set('pa', ((patm + pg) / 1000).toFixed(1) + ' kPa = ' + ((patm + pg) / 1e5).toFixed(3) + ' bar(a)');
        ro.set('hw', (pg / (998 * G0)).toFixed(2) + ' m');
        if (geo.sh.width) {
          let W = 0; const N = 200;
          for (let k = 0; k < N; k++) { const y = (k + 0.5) / N * geo.Ht; W += (y < V.H ? rhoL() : rhoT()) * G0 * geo.sh.width(y) * geo.Ht / N; }
          ro.set('base', force(pBot * geo.sh.width(0)) + ' / ' + force(W));
        } else ro.set('base', '— (three vessels)');
      }, box.stage);
      loop.start();
    }
  });

  /* ====================================================================== the hydraulic jack */
  Hyper.sim('hs-hydraulic-jack', {
    title: 'A hydraulic jack, stroke by stroke',
    blurb: `A jack in section (left) and the same machine as an ISO 1219 circuit (right). Each downstroke of the handle pushes the plunger's oil through the **outlet check valve** under the ram; each upstroke draws oil from the reservoir through the **inlet check valve** while the outlet check holds the load. The **release valve** lets the ram's oil back to the reservoir. Oil is coloured by what it is doing — **red** under pressure, **green** being drawn in, **blue** returning.

**Try this**
- Watch one stroke at a time (untick the handle, press *One stroke*): the ram rises by the plunger's volume divided by the ram's area.
- Compare the handle force with the load: the mechanical advantage is the lever ratio times (D/d)².
- Make the ram bigger: the pressure and the handle force fall, but each stroke lifts less — the work at the handle stays the work done on the load (divided by the efficiency).
- Load the jack beyond its rating (a small ram and 5 t): the overload valve opens at 700 bar and the ram will not rise.
- Open the release valve: the load comes down, faster the heavier it is — the flow through the valve grows with the square root of the pressure.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ETA = 0.9, P_OL = 700e5, XMAX = 0.15, CD = 0.62, AREL = 0.3e-6, RHO = 870, M_RAM = 5, F_SPRING = 250;
      const J = { phase: 0, x: 0, strokes: 0, Win: 0, Wout: 0, ph: {}, down: 0, suc: 0, rel: 0, pPump: 0, overload: false, full: false, sPos: 0 };
      let pending = 0;
      const ctl = kit.controls(box.side, [
        { id: 'pump', type: 'check', label: 'Work the handle (about a stroke a second)', value: true },
        { type: 'buttons', items: [{ id: 'one', label: 'One stroke', primary: true }] },
        { id: 'release', type: 'check', label: 'Release valve open', value: false },
        { id: 'm', label: 'Load on the ram', min: 0, max: 5, step: 0.1, value: 1.5, unit: 't' },
        { id: 'd', label: 'Plunger diameter d', min: 8, max: 20, step: 1, value: 14, unit: 'mm' },
        { id: 'D', label: 'Ram diameter D', min: 25, max: 80, step: 1, value: 35, unit: 'mm' },
        { id: 'i', label: 'Lever ratio of the handle', min: 5, max: 30, step: 1, value: 20 },
        { id: 's', label: 'Plunger stroke', min: 10, max: 40, step: 1, value: 25, unit: 'mm' }
      ], (id, v) => {
        if (id === 'one') { ctl.set('pump', false); pending = Math.floor(J.phase + 1e-9) + 1; }
        if (id === 'pump' && v) pending = 0;
      });
      const ro = kit.readout(box.side, [['p', 'Oil pressure under the ram'], ['ma', 'Mechanical advantage'], ['fh', 'Handle force on a downstroke (η = 90 %)'], ['lift', 'Lift per stroke'], ['x', 'Ram lift'], ['w', 'Work at the handle / work done lifting']]);
      const V = ctl.values;
      const geom = () => { const d = V.d / 1000, D = V.D / 1000; return { Ap: Math.PI * d * d / 4, Ar: Math.PI * D * D / 4 }; };
      const loadN = () => (V.m * 1000 + M_RAM) * G0 + F_SPRING;
      function step(dt) {
        const g = geom(), W = loadN(), pLoad = W / g.Ar, stroke = V.s / 1000;
        let dph = 0;
        if (V.pump) dph = dt * 0.9;
        else if (pending > J.phase) dph = Math.min(dt * 0.9, pending - J.phase);
        const sOld = stroke * (1 - Math.cos(2 * Math.PI * J.phase)) / 2;
        const before = Math.floor(J.phase + 1e-9);
        J.phase += dph;
        if (Math.floor(J.phase + 1e-9) > before) J.strokes++;
        const sNew = stroke * (1 - Math.cos(2 * Math.PI * J.phase)) / 2, ds = sNew - sOld;
        J.sPos = sNew;
        J.down = 0; J.suc = 0; J.overload = false; J.full = false;
        if (ds > 1e-12) {                                   // downstroke: oil pushed towards the ram
          const Vd = g.Ap * ds;
          if (pLoad > P_OL) { J.overload = true; J.pPump = P_OL; J.Win += P_OL * Vd / ETA; }
          else if (J.x >= XMAX - 1e-9) { J.full = true; J.pPump = pLoad; J.Win += pLoad * Vd / ETA; }
          else {
            const dx = Math.min(Vd / g.Ar, XMAX - J.x);
            J.x += dx; J.pPump = pLoad; J.Win += pLoad * Vd / ETA; J.Wout += W * dx; J.down = Vd / Math.max(dt, 1e-6);
          }
        } else if (ds < -1e-12) { J.pPump = -0.3e5; J.suc = -g.Ap * ds / Math.max(dt, 1e-6); }
        else J.pPump = 0;
        J.rel = 0;
        if (V.release && J.x > 0) {
          const q = CD * AREL * Math.sqrt(2 * pLoad / RHO), dx = Math.min(J.x, q * dt / g.Ar);
          J.x -= dx; J.rel = dx * g.Ar / Math.max(dt, 1e-6);
          if (J.x <= 1e-9) { J.x = 0; J.strokes = 0; J.Win = 0; J.Wout = 0; }
        }
      }
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 4; k++) step(dt / 4);
        const g = geom(), W = loadN(), pLoad = W / g.Ar, ramP = J.x > 1e-6 || J.down > 0 ? pLoad : 0;
        const area = g.Ar / g.Ap, ma = area * V.i, fh = Math.min(pLoad, P_OL) * g.Ap / (V.i * ETA);
        ro.set('p', (ramP / 1e5).toFixed(0) + ' bar' + (J.overload ? '  (overload valve open)' : ''));
        ro.set('ma', ma.toFixed(0) + '  (area ratio ' + area.toFixed(2) + ' × lever ' + V.i + ')');
        ro.set('fh', fh.toFixed(0) + ' N' + (fh > 400 ? '  — too heavy for one person' : ''));
        ro.set('lift', (V.s / area).toFixed(2) + ' mm');
        ro.set('x', (J.x * 1000).toFixed(1) + ' mm after ' + J.strokes + ' stroke' + (J.strokes === 1 ? '' : 's'));
        ro.set('w', J.Win.toFixed(0) + ' J / ' + J.Wout.toFixed(0) + ' J');
        // ------------------------------------------------ drawing on a 760 × 440 grid
        const m = design(st, 760, 440), c = m.c, C = kit.colors();
        const OIL = kit.hue(40, 0.6), OILF = kit.hue(40, 0.3);
        const col = st2 => st2 === 'idle' ? OIL : S.col(st2);
        const fillA = (st2, a) => { c.save(); c.globalAlpha = a; c.fillStyle = col(st2); return c; };
        const pumping = J.down > 0 || J.overload || J.full, sucking = J.suc > 0, releasing = J.rel > 0;
        const loaded = ramP > 1e5;
        const xp = 215, hwp = clamp(V.d * 0.9, 5, 16), xr = 355, hwr = clamp(V.D * 0.9, 16, 62);
        // body and reservoir
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        c.fillRect(40, 330, 410, 70); c.strokeRect(40, 330, 410, 70);
        const resLevel = 225 + 50 * (J.x * g.Ar) / (0.15 * Math.PI * 0.0016);
        fillA(sucking ? 'suction' : 'idle', 0.35).fillRect(52, resLevel, 81, 330 - resLevel); c.restore();
        line(c, [[50, 190], [50, 330]], C.text, 2.5); line(c, [[135, 190], [135, 330]], C.text, 2.5);
        kit.label(c, 'reservoir', 92, 180, { color: C.muted, size: 11, align: 'center' });
        // passages drilled in the body
        const inlet = [[120, 330], [120, 348], [xp, 348], [xp, 331]];
        const xo = xr - hwr * 0.5, xr2 = xr + hwr * 0.5;
        const outlet = [[xp, 348], [xo, 348], [xo, 331]];
        const relA = [[xr2, 331], [xr2, 385], [240, 385]], relB = [[240, 385], [75, 385], [75, 331]];
        line(c, inlet, col(sucking ? 'suction' : 'idle'), 7);
        line(c, outlet, col(pumping || loaded ? 'pressure' : 'idle'), 7);
        line(c, relA, col(releasing ? 'return' : loaded ? 'pressure' : 'idle'), 7);
        line(c, relB, col(releasing ? 'return' : 'idle'), 7);
        const adv = (key, v) => { J.ph[key] = (J.ph[key] || 0) + dt * v; return J.ph[key]; };
        if (sucking) S.flow(c, inlet, adv('in', 70), { color: C.surface, r: 1.8 });
        if (J.down > 0) S.flow(c, outlet, adv('out', 70), { color: C.surface, r: 1.8 });
        if (releasing) S.flow(c, relA.concat(relB.slice(1)), adv('rel', 40 + 30 * Math.min(1, J.rel / 1e-4)), { color: C.surface, r: 1.8 });
        // check valves: a ball on a seat, lifted by the flow
        const ball = (x, open) => {
          c.fillStyle = C.text; c.fillRect(x - 9, 342, 3, 3); c.fillRect(x - 9, 351, 3, 3);
          kit.dot(c, x + (open ? 5 : -1), 348, 4.5, C.text);
        };
        ball(160, sucking); ball(282, J.down > 0);
        kit.label(c, 'inlet check', 160, 364, { color: C.muted, size: 10, align: 'center' });
        kit.label(c, 'outlet check', 282, 364, { color: C.muted, size: 10, align: 'center' });
        // release valve: a needle from below
        c.fillStyle = C.text;
        if (!V.release) c.fillRect(237, 380, 6, 10); else c.fillRect(237, 391, 6, 6);
        line(c, [[240, 397], [240, 412]], C.text, 3);
        kit.dot(c, 240, 416, 6, V.release ? C.accent : C.muted, C.text);
        kit.label(c, 'release valve', 252, 416, { color: V.release ? C.accent : C.muted, size: 10.5 });
        // pump barrel, plunger and chamber
        const sPx = J.sPos * 1000 * 1.6, ypb = 250 + sPx;
        fillA(pumping ? 'pressure' : sucking ? 'suction' : 'idle', 0.4).fillRect(xp - hwp, ypb, 2 * hwp, 330 - ypb); c.restore();
        line(c, [[xp - hwp - 2, 205], [xp - hwp - 2, 330]], C.text, 3); line(c, [[xp + hwp + 2, 205], [xp + hwp + 2, 330]], C.text, 3);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(xp - hwp + 1, ypb - 110, 2 * hwp - 2, 110); c.strokeRect(xp - hwp + 1, ypb - 110, 2 * hwp - 2, 110);
        // handle: pivot on a post, through the plunger pin
        const piv = [xp + 45, 250 + V.s * 1.6 / 2 - 110], pin = [xp, ypb - 110];
        line(c, [[piv[0], 330], [piv[0], piv[1]]], C.text, 3);
        const ux = pin[0] - piv[0], uy = pin[1] - piv[1], ul = Math.hypot(ux, uy) || 1, Lh = 200;
        const hEnd = [piv[0] + Lh * ux / ul, piv[1] + Lh * uy / ul];
        line(c, [[piv[0] - 12 * ux / ul, piv[1] - 12 * uy / ul], hEnd], C.text, 5);
        kit.dot(c, piv[0], piv[1], 4, C.surface, C.text); kit.dot(c, pin[0], pin[1], 3, C.surface, C.text);
        kit.dot(c, hEnd[0], hEnd[1], 6, C.warn, C.text);
        if (pumping || sucking) kit.arrow(c, hEnd[0], hEnd[1] + (pumping ? -26 : 26), hEnd[0], hEnd[1] + (pumping ? -6 : 6), C.warn, 2.2);
        kit.label(c, 'handle', hEnd[0], hEnd[1] - 16, { color: C.muted, size: 10.5, align: 'center' });
        // ram cylinder, ram and load
        const yrb = 326 - J.x * 1000 * 0.6;
        fillA(loaded || pumping ? 'pressure' : 'idle', 0.35).fillRect(xr - hwr, yrb, 2 * hwr, 330 - yrb); c.restore();
        line(c, [[xr - hwr - 3, 150], [xr - hwr - 3, 330]], C.text, 3.5); line(c, [[xr + hwr + 3, 150], [xr + hwr + 3, 330]], C.text, 3.5);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(xr - hwr + 1, yrb - 185, 2 * hwr - 2, 185); c.strokeRect(xr - hwr + 1, yrb - 185, 2 * hwr - 2, 185);
        const ytop = yrb - 185;
        c.fillRect(xr - hwr - 8, ytop - 6, 2 * hwr + 16, 6); c.strokeRect(xr - hwr - 8, ytop - 6, 2 * hwr + 16, 6);
        if (V.m > 0) {
          const bh = 18 + 5 * V.m;
          c.fillStyle = kit.hue(215, 0.25); c.fillRect(xr - 60, ytop - 6 - bh, 120, bh); c.strokeRect(xr - 60, ytop - 6 - bh, 120, bh);
          kit.label(c, V.m.toFixed(1) + ' t', xr, ytop - 6 - bh / 2, { color: C.text, size: 12, weight: 700, align: 'center' });
          kit.arrow(c, xr + 75, ytop - 6 - bh - 4, xr + 75, ytop - 6 - bh + 26, C.warn, 2.5);
        }
        kit.label(c, 'ram', xr + hwr + 10, 250, { color: C.muted, size: 11 });
        kit.label(c, 'plunger', xp - hwp - 6, 290, { color: C.muted, size: 10.5, align: 'right' });
        // ------------------------------------------------ the same machine in ISO 1219 symbols
        kit.label(c, 'ISO 1219', 700, 30, { color: C.muted, size: 11, weight: 700, align: 'center' });
        const lsSuc = sucking ? 'suction' : 'idle', lsPump = pumping ? 'pressure' : 'idle';
        const lsP = loaded || pumping ? 'pressure' : 'idle', lsRel = releasing ? 'return' : lsP, lsT = releasing ? 'return' : 'idle';
        const pSuc = [[700, 398], [700, 382]], pSuc2 = [[700, 346], [700, 330]], pOut = [[700, 278], [700, 258]];
        const pLine = [[700, 222], [700, 195], [640, 195], [640, 337], [587, 337]];
        S.line(c, pSuc, { state: lsSuc }); S.line(c, pSuc2, { state: lsSuc }); S.line(c, pOut, { state: lsPump });
        S.line(c, pLine, { state: lsP });
        S.line(c, [[670, 181], [670, 195]], { state: lsP });
        S.line(c, [[640, 337], [640, 347]], { state: lsRel });
        S.line(c, [[640, 389], [640, 398]], { state: lsT });
        S.junction(c, 670, 195); S.junction(c, 640, 337);
        if (sucking) S.flow(c, [[700, 398], [700, 330]], adv('isuc', 60), { color: S.col('suction') });
        if (J.down > 0) S.flow(c, [[700, 278]].concat(pLine), adv('iout', 60), { color: S.col('pressure') });
        if (releasing) S.flow(c, [[640, 337], [640, 398]], adv('irel', 40), { color: S.col('return') });
        S.tank(c, 700, 408); S.tank(c, 640, 408);
        S.check(c, 700, 364, { open: sucking });
        S.pump(c, 700, 304, {});
        line(c, [[684, 304], [664, 304], [656, 293]], C.text, 1.8);
        kit.label(c, 'hand', 660, 318, { color: C.muted, size: 10, align: 'center' });
        S.check(c, 700, 240, { open: J.down > 0 });
        S.valve(c, 640, 368, { spec: '2/2 NC', state: V.release ? 0 : 1, left: 'manual', right: 'spring', s: 22 });
        S.gauge(c, 670, 160, { frac: ramP / 700e5, value: (ramP / 1e5).toFixed(0) + ' bar' });
        const cy = S.cylinder(c, 560, 345, { len: 150, h: 34, pos: J.x / XMAX, rot: -90, fillA: loaded ? (C.dark ? 'rgba(255,92,92,.3)' : 'rgba(214,40,40,.22)') : null });
        kit.label(c, 'vent', 596, 203, { color: C.muted, size: 10 });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0] - 20, cy.tip[1] - 20, 40, 20); c.strokeRect(cy.tip[0] - 20, cy.tip[1] - 20, 40, 20);
        kit.label(c, 'W', cy.tip[0], cy.tip[1] - 10, { color: C.text, size: 11, weight: 700, align: 'center' });
        const msg = J.overload ? 'overload valve open: the load needs more than 700 bar' : J.full ? 'ram at full lift: the oil bypasses to the reservoir' : '';
        if (msg) kit.label(c, msg, 20, 428, { color: C.bad, size: 12, weight: 700 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ====================================================================== manometers */
  Hyper.sim('hs-manometer', {
    title: 'Manometers',
    blurb: `Three ways of weighing a pressure against a column of liquid. Change the pressure and the liquid column swings and settles, like a real one — its natural period is shown.

**Try this**
- **U-tube**: raise the pipe pressure and read h. With mercury the column moves little; switch to water and it runs off the scale — which is why mercury was used for higher pressures. With water in the pipe, check $p_A = \\rho_m g h - \\rho g y$ against the slider.
- Put a vacuum in the pipe (negative gauge pressure): the column turns round.
- **Differential**: with water in the pipe and mercury below, 100 mm is about 12.3 kPa, not 13.3 — the water in the legs counts. Choose gauge oil as the manometer liquid under water: the U-tube turns upside down.
- **Inclined**: lay the tube down to 5–10° and watch a few pascals become a long, readable movement; stand it up at 90° and it is an ordinary vertical manometer.
- Read the scale while the column is still swinging: the pressure worked out from it is wrong until it settles.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Manometer', options: [['U-tube on a pipe', 'u'], ['Differential across an orifice plate', 'diff'], ['Inclined, for small draughts', 'incl']], value: 'u' },
        { id: 'pU', label: 'Pipe pressure p_A (gauge)', min: -10, max: 50, step: 0.5, value: 20, unit: 'kPa' },
        { id: 'dP', label: 'Pressure difference p₁ − p₂', min: 0, max: 60, step: 0.5, value: 12, unit: 'kPa' },
        { id: 'pI', label: 'Draught to measure', min: 0, max: 600, step: 5, value: 150, unit: 'Pa' },
        { id: 'mf', type: 'select', label: 'Manometer liquid', options: [['Mercury (13 546 kg/m³)', 'mercury'], ['Water (998 kg/m³)', 'water'], ['Red gauge oil (830 kg/m³)', 'gaugeoil']], value: 'mercury' },
        { id: 'pf', type: 'select', label: 'Fluid in the pipe', options: [['Water (998 kg/m³)', 'water'], ['Hydraulic oil (870 kg/m³)', 'oil'], ['Air', 'air']], value: 'water' },
        { id: 'th', label: 'Angle of the tube', min: 5, max: 90, step: 1, value: 15, unit: '°' }
      ], (id, v) => {
        if (id === 'mode') { showFor(v); if (v === 'incl') ctl.set('mf', 'gaugeoil'); if (v === 'diff' && V.pf === 'air') ctl.set('pf', 'water'); }
      });
      const ro = kit.readout(box.side, [['h', 'Reading'], ['sub', ''], ['p', 'Pressure from the reading'], ['eq', 'Equivalent'], ['T', 'Natural period of the column']]);
      const V = ctl.values;
      function showFor(mode) {
        ctl.show('pU', mode === 'u'); ctl.show('dP', mode === 'diff'); ctl.show('pI', mode === 'incl');
        ctl.show('pf', mode !== 'incl'); ctl.show('th', mode === 'incl');
      }
      showFor(V.mode);
      const Y0 = 0.25;                       // U-tube: pipe centre above the resting manometer level (m)
      let r = 0, v = 0, lastMode = V.mode;
      function target() {
        const rm = LIQ[V.mf].rho, rp = V.mode === 'incl' ? LIQ.air.rho : LIQ[V.pf].rho;
        if (V.mode === 'u') {
          const k = rm - rp / 2;
          return { req: (V.pU * 1000 + rp * G0 * Y0) / (G0 * k), lo: -0.5, hi: 0.7, w: Math.sqrt(2 * G0 * k / (rm * 0.9 + rp * 0.3)), rm, rp, ok: rm >= rp };
        }
        if (V.mode === 'diff') {
          const dr = Math.abs(rm - rp);
          if (dr < 30) return { req: 0, lo: 0, hi: 0.54, w: 3, rm, rp, ok: false, close: true };
          return { req: V.dP * 1000 / (dr * G0), lo: 0, hi: 0.54, w: Math.sqrt(2 * G0 * dr / (rm * 0.9 + rp * 0.6)), rm, rp, ok: true, inv: rm < rp };
        }
        const sn = Math.sin(V.th * Math.PI / 180) + 0.01;
        return { req: V.pI / (rm * G0 * sn), lo: 0, hi: 0.38, w: Math.sqrt(G0 * sn / (0.25 + Math.max(0, r))), rm, rp, ok: true, sn };
      }
      const loop = kit.loop((dt) => {
        if (V.mode !== lastMode) { r = 0; v = 0; lastMode = V.mode; }
        const T = target(), n = 20, h = dt / n, zeta = 0.12;
        const goal = clamp(T.req, T.lo, T.hi);
        for (let k = 0; k < n; k++) {
          const a = T.w * T.w * (goal - r) - 2 * zeta * T.w * v;
          v += a * h; r += v * h;
          if (r < T.lo) { r = T.lo; v = 0; } if (r > T.hi) { r = T.hi; v = 0; }
        }
        const over = T.req > T.hi + 1e-9 || T.req < T.lo - 1e-9;
        const settled = Math.abs(v) < 0.002 && Math.abs(goal - r) < 0.001;
        // read-outs
        let pr = 0;
        if (V.mode === 'u') {
          const y = Y0 + r / 2; pr = T.rm * G0 * r - T.rp * G0 * y;
          ro.set('h', 'h = ' + (r * 1000).toFixed(1) + ' mm'); ro.set('sub', 'y = ' + (y * 1000).toFixed(0) + ' mm below the pipe centre');
          ro.set('p', 'p_A = ρ_m·g·h − ρ·g·y = ' + (pr / 1000).toFixed(2) + ' kPa');
        } else if (V.mode === 'diff') {
          pr = T.close ? 0 : Math.abs(T.rm - T.rp) * G0 * r;
          ro.set('h', 'h = ' + (r * 1000).toFixed(1) + ' mm'); ro.set('sub', T.close ? 'densities too close to measure' : T.inv ? 'inverted U-tube: the manometer liquid is lighter' : 'manometer liquid below the pipe liquid');
          ro.set('p', 'p₁ − p₂ = (ρ_m − ρ)·g·h = ' + (pr / 1000).toFixed(2) + ' kPa');
        } else {
          pr = T.rm * G0 * r * T.sn;
          ro.set('h', 'L = ' + (r * 1000).toFixed(1) + ' mm along the tube'); ro.set('sub', 'vertical rise ' + (r * 1000 * Math.sin(V.th * Math.PI / 180)).toFixed(1) + ' mm; magnified ' + (1 / Math.sin(V.th * Math.PI / 180)).toFixed(1) + '×');
          ro.set('p', 'Δp = ' + pr.toFixed(0) + ' Pa');
        }
        ro.set('eq', (pr / (998 * G0) * 1000).toFixed(0) + ' mm of water = ' + (pr / 133.322).toFixed(1) + ' mmHg');
        ro.set('T', (2 * Math.PI / T.w).toFixed(2) + ' s' + (settled ? '' : '  (still moving)'));
        // ---- drawing on 760 × 430
        const m = design(st, 760, 430), c = m.c, C = kit.colors();
        const tube = (pts) => { line(c, pts, C.muted, 16); line(c, pts, C.bg2, 11); };
        const fluid = (pts, key, a) => line(c, pts, liqCol(kit, key, a), 11);
        const pipeFill = liqCol(kit, V.mode === 'incl' ? 'air' : V.pf, 0.45);
        if (V.mode === 'u') {
          const s = 400, xL = 150, xR = 330, yn = 90 + Y0 * s, yb = yn + 0.4 * s, ytop = yn - 0.35 * s;
          const yL = yn + r / 2 * s, yR = yn - r / 2 * s;
          c.fillStyle = pipeFill; c.fillRect(30, 70, 240, 40); c.strokeStyle = C.text; c.lineWidth = 2.5;
          line(c, [[30, 70], [270, 70]], C.text, 2.5); line(c, [[30, 110], [270, 110]], C.text, 2.5);
          kit.arrow(c, 50, 90, 110, 90, C.accent, 2);
          kit.label(c, LIQ[V.pf].name + ' in the pipe', 180, 58, { color: C.muted, size: 11, align: 'center' });
          tube([[xL, 108], [xL, yb], [xR, yb], [xR, ytop]]);
          fluid([[xL, 110], [xL, yL]], V.pf, V.pf === 'air' ? 0.5 : 0.75);
          fluid([[xL, yL], [xL, yb], [xR, yb], [xR, yR]], V.mf, 0.9);
          kit.dot(c, xL, 90, 4, C.bad); kit.label(c, 'A', xL - 10, 90, { color: C.bad, size: 12, weight: 700, align: 'right' });
          kit.label(c, 'open', xR, ytop - 12, { color: C.muted, size: 11, align: 'center' });
          for (let mm = -350; mm <= 350; mm += 10) {
            const yy = yn - mm / 1000 * s; if (yy < ytop || yy > yb - 10) continue;
            line(c, [[xR + 12, yy], [xR + (mm % 50 ? 17 : 22), yy]], C.muted, 1);
            if (mm % 100 === 0) kit.label(c, String(mm), xR + 25, yy, { color: C.muted, size: 9.5 });
          }
          line(c, [[xL + 8, yL], [440, yL]], C.muted, 1, [3, 3]); line(c, [[xR + 8, yR], [440, yR]], C.muted, 1, [3, 3]);
          dimV(kit, c, 430, yL, yR, 'h = ' + (r * 1000).toFixed(0) + ' mm', C.accent);
          line(c, [[xL - 8, 90], [95, 90]], C.muted, 1, [3, 3]); line(c, [[xL - 8, yL], [95, yL]], C.muted, 1, [3, 3]);
          dimV(kit, c, 100, 90, yL, 'y', C.warn, 'right');
          if (T.rm < T.rp) kit.label(c, 'unstable: the pipe liquid is heavier and would sink through the manometer liquid', 20, 420, { color: C.bad, size: 11.5, weight: 700 });
        } else if (V.mode === 'diff') {
          const s = 250, xL = 150, xR = 310, inv = T.inv;
          c.fillStyle = pipeFill; c.fillRect(30, 180, 400, 40);
          line(c, [[30, 180], [430, 180]], C.text, 2.5); line(c, [[30, 220], [430, 220]], C.text, 2.5);
          c.fillStyle = C.text; c.fillRect(227, 180, 6, 13); c.fillRect(227, 207, 6, 13);
          kit.arrow(c, 45, 200, 100, 200, C.accent, 2); kit.arrow(c, 350, 200, 405, 200, C.accent, 2);
          kit.label(c, 'orifice plate', 230, 170, { color: C.muted, size: 10.5, align: 'center' });
          kit.label(c, 'p₁', xL - 12, 200, { color: C.bad, size: 12, weight: 700, align: 'right' });
          kit.label(c, 'p₂', xR + 12, 200, { color: C.bad, size: 12, weight: 700 });
          if (!inv) {
            const yn = 200 + 0.35 * s, yb = yn + 0.35 * s, yL = yn + r / 2 * s, yR = yn - r / 2 * s;
            tube([[xL, 218], [xL, yb], [xR, yb], [xR, 218]]);
            fluid([[xL, 220], [xL, yL]], V.pf, 0.75); fluid([[xR, 220], [xR, yR]], V.pf, 0.75);
            fluid([[xL, yL], [xL, yb], [xR, yb], [xR, yR]], V.mf, 0.9);
            line(c, [[xL + 8, yL], [390, yL]], C.muted, 1, [3, 3]); line(c, [[xR + 8, yR], [390, yR]], C.muted, 1, [3, 3]);
            dimV(kit, c, 380, yL, yR, 'h = ' + (r * 1000).toFixed(0) + ' mm', C.accent);
          } else {
            const yn = 200 - 0.35 * s, yt = yn - 0.35 * s, yL = yn - r / 2 * s, yR = yn + r / 2 * s;
            tube([[xL, 182], [xL, yt], [xR, yt], [xR, 182]]);
            fluid([[xL, 180], [xL, yL]], V.pf, 0.75); fluid([[xR, 180], [xR, yR]], V.pf, 0.75);
            fluid([[xL, yL], [xL, yt], [xR, yt], [xR, yR]], V.mf, 0.9);
            line(c, [[xL + 8, yL], [390, yL]], C.muted, 1, [3, 3]); line(c, [[xR + 8, yR], [390, yR]], C.muted, 1, [3, 3]);
            dimV(kit, c, 380, yL, yR, 'h = ' + (r * 1000).toFixed(0) + ' mm', C.accent);
          }
          if (T.close) kit.label(c, 'the two densities are too close: choose a different manometer liquid', 20, 420, { color: C.bad, size: 11.5, weight: 700 });
        } else {
          const s = 900, th = V.th * Math.PI / 180, x0 = 140, yz = 385, drop = r * 0.01 * s;
          c.fillStyle = pipeFill; c.fillRect(30, 60, 220, 50);
          line(c, [[30, 60], [250, 60]], C.text, 2.5); line(c, [[30, 110], [250, 110]], C.text, 2.5);
          kit.arrow(c, 60, 85, 140, 85, C.accent, 2);
          kit.label(c, 'duct (air)', 140, 48, { color: C.muted, size: 11, align: 'center' });
          tube([[100, 108], [100, 352]]);
          c.fillStyle = C.bg2; c.fillRect(60, 350, 80, 60);
          c.fillStyle = liqCol(kit, V.mf, 0.85); c.fillRect(60, yz + drop, 80, 410 - yz - drop);
          line(c, [[60, 350], [60, 410], [140, 410], [140, 350]], C.text, 2.5); line(c, [[60, 350], [140, 350]], C.text, 2);
          const ux = Math.cos(th), uy = -Math.sin(th), Lt = 0.38 * s;
          const end = [x0 + ux * Lt, yz + uy * Lt];
          tube([[x0, yz], end]);
          fluid([[x0, yz + drop], [x0 + ux * r * s, yz + uy * r * s]], V.mf, 0.9);
          const nx = -uy, ny = ux;                        // the side of the tube for the scale
          for (let mm = 0; mm <= 380; mm += 10) {
            const px = x0 + ux * mm / 1000 * s, py = yz + uy * mm / 1000 * s, L = mm % 50 ? 5 : 10;
            line(c, [[px + nx * 9, py + ny * 9], [px + nx * (9 + L), py + ny * (9 + L)]], C.muted, 1);
            if (mm % 100 === 0) kit.label(c, String(mm), px + nx * 28, py + ny * 28, { color: C.muted, size: 9.5, align: 'center' });
          }
          kit.label(c, 'open', end[0] + ux * 14, end[1] + uy * 14, { color: C.muted, size: 11, align: 'center' });
          const tipx = x0 + ux * r * s, tipy = yz + uy * r * s;
          line(c, [[tipx, tipy], [tipx, yz]], C.warn, 1.2, [3, 3]); line(c, [[x0, yz], [tipx + 20, yz]], C.muted, 1, [3, 3]);
          kit.label(c, 'rise ' + (r * 1000 * Math.sin(th)).toFixed(1) + ' mm', tipx + 6, (tipy + yz) / 2, { color: C.warn, size: 11 });
          kit.label(c, 'L = ' + (r * 1000).toFixed(0) + ' mm', tipx - nx * 22, tipy - ny * 22 - 6, { color: C.accent, size: 12, weight: 700, align: 'center' });
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(x0, yz, 40, -th, 0); c.stroke();
          kit.label(c, 'θ = ' + V.th + '°', x0 + 46, yz - 10, { color: C.muted, size: 11 });
        }
        if (over) kit.label(c, 'off the scale: the column would be pushed out of the tube — choose a denser manometer liquid or a lower pressure', 20, 20, { color: C.bad, size: 11.5, weight: 700 });
        kit.label(c, LIQ[V.mf].name + ' (' + LIQ[V.mf].rho + ' kg/m³)', 740, 20 + (over ? 18 : 0), { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ====================================================================== a gate in a tilted wall */
  Hyper.sim('hs-plane-gate', {
    title: 'Force on a submerged gate',
    blurb: `A flat gate set in a wall that slopes at θ to the horizontal, with water on the left. The orange arrows are the pressure along the gate — the **pressure prism** — growing with depth; the red arrow is the resultant, acting at the **centre of pressure** (CP), below the centroid (C). The front view shows the gate square-on, shaded by pressure. Drag the gate along the wall, or drag the round handle at the foot of the wall to tilt it.

**Try this**
- Drag the gate deeper: the force grows in proportion to the centroid's depth, and the CP creeps up towards the centroid (the graph).
- Put the top edge at the surface: the CP is at two-thirds of the height, whatever the width.
- Tilt the wall with the centroid at a fixed distance along it: the force follows h_c = y_c·sin θ.
- Compare the circle with the rectangle: the offset of the CP is h²/(16 y_c) instead of h²/(12 y_c).
- With the hinge along the top edge, note how much the latch at the bottom must hold — more than half the force.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const graph = document.createElement('div');
      graph.style.padding = '4px 10px 10px';
      box.stage.appendChild(graph);
      let map = { k: 1, ox: 0, oy: 0 }, key = '', markKey = '';
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Gate shape', options: [['Rectangle', 'rect'], ['Circle', 'circle']], value: 'rect' },
        { id: 'rho', type: 'select', label: 'Liquid', options: [['Fresh water (1000 kg/m³)', 1000], ['Sea water (1025 kg/m³)', 1025], ['Oil (870 kg/m³)', 870]], value: 1000 },
        { id: 'y1', label: 'Top edge: distance along the wall from the surface', min: 0, max: 10, step: 0.1, value: 3, unit: 'm' },
        { id: 'h', label: 'Gate height along the wall (circle: diameter)', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'm' },
        { id: 'b', label: 'Gate width', min: 0.5, max: 5, step: 0.1, value: 1.5, unit: 'm' },
        { id: 'th', label: 'Angle of the wall to the horizontal', min: 10, max: 90, step: 1, value: 90, unit: '°' },
        { id: 'hinge', type: 'check', label: 'Hinged along its top edge', value: true }
      ], (id) => { if (id === 'shape') ctl.show('b', V.shape === 'rect'); });
      const ro = kit.readout(box.side, [['A', 'Area A'], ['hc', 'Depth of the centroid h_c'], ['F', 'Resultant F = ρg·h_c·A'], ['yp', 'y_c → y_p along the wall'], ['dp', 'Depth of the centre of pressure'], ['M', 'Moment about the top edge / latch force at the bottom']]);
      const plot = kit.plot(graph, { x: { label: 'top edge, distance along the wall (m)', min: 0, max: 10 }, y: { label: 'CP below the centroid (mm)', min: 0 } }, 150);
      const V = ctl.values;
      const Ox = 470, Oy = 50, SC = 24, SMAX = 15;
      const dir = () => { const t = V.th * Math.PI / 180; return { t, u: [-Math.cos(t), Math.sin(t)], n: [Math.sin(t), Math.cos(t)] }; };
      const P = (s, d) => [Ox + d.u[0] * s * SC, Oy + d.u[1] * s * SC];
      const along = (q, d) => ((q.x - Ox) * d.u[0] + (q.y - Oy) * d.u[1]) / SC;
      kit.drag(st, {
        hit: p => {
          const q = toGrid(p, map), d = dir(), e = P(SMAX, d), a = P(V.y1, d), b = P(V.y1 + V.h, d);
          if (Math.hypot(q.x - e[0], q.y - e[1]) < 16) return { k: 'angle' };
          if (distSeg(q.x, q.y, a[0], a[1], b[0], b[1]) < 16) return { k: 'gate', off: along(q, d) - V.y1 };
          return null;
        },
        move: (o, p) => {
          const q = toGrid(p, map);
          if (o.k === 'angle') ctl.set('th', clamp(Math.round(Math.atan2(q.y - Oy, Ox - q.x) * 180 / Math.PI), 10, 90));
          else ctl.set('y1', clamp(Math.round((along(q, dir()) - o.off) * 10) / 10, 0, 10));
        },
        hover: true
      });
      const loop = kit.loop(() => {
        const d = dir(), sn = Math.sin(d.t), rho = V.rho, h = V.h, y1 = V.y1, circle = V.shape === 'circle';
        const A = circle ? Math.PI * h * h / 4 : V.b * h, IcA = circle ? h * h / 16 : h * h / 12;
        const yc = y1 + h / 2, hc = yc * sn, F = rho * G0 * hc * A, yp = yc + IcA / yc;
        const M = F * (yp - y1), latch = M / h;
        ro.set('A', A.toFixed(2) + ' m²');
        ro.set('hc', hc.toFixed(2) + ' m  (y_c sin θ)');
        ro.set('F', force(F) + '  (' + (F / 9806.65).toFixed(1) + ' t)');
        ro.set('yp', yc.toFixed(2) + ' m → ' + yp.toFixed(3) + ' m  (' + ((yp - yc) * 1000).toFixed(0) + ' mm lower)');
        ro.set('dp', (yp * sn).toFixed(3) + ' m');
        ro.set('M', V.hinge ? force(M).replace('N', 'N·m') + ' / ' + force(latch) : '—');
        const k2 = [V.shape, h].join();
        if (k2 !== key) {
          key = k2; markKey = '';
          const pts = [];
          for (let t = 0; t <= 10.001; t += 0.1) pts.push([t, IcA / (t + h / 2) * 1000]);
          plot.set({ series: [{ pts, label: 'y_p − y_c' }] });
        }
        if (markKey !== k2 + ',' + y1) { markKey = k2 + ',' + y1; plot.set({ marks: [{ x: y1, y: (yp - yc) * 1000, label: '' }] }); }
        // ---- drawing
        const m = design(st, 760, 440), c = m.c, C = kit.colors();
        map = m;
        const E = P(SMAX, d);
        fillPoly(c, [[0, Oy], [Ox, Oy], E, [0, E[1]]], kit.hue(205, 0.2));
        line(c, [[0, Oy], [Ox, Oy]], kit.hue(205), 1.5);
        kit.label(c, '▽ free surface', 20, Oy - 12, { color: C.accent, size: 11 });
        line(c, [[0, E[1]], E], C.text, 2);
        fillPoly(c, [[Ox, Oy], E, [E[0] + d.n[0] * 14, E[1] + d.n[1] * 14], [Ox + d.n[0] * 14, Oy + d.n[1] * 14]], C.surface);
        line(c, [[Ox, Oy], E], C.text, 2);
        // pressure prism along the gate
        const kp = 22 / (1000 * G0), N = 12, tails = [];
        for (let i = 0; i <= N; i++) {
          const s = y1 + h * i / N, p = rho * G0 * s * sn, L = p * kp, q = P(s, d);
          tails.push([q[0] - d.n[0] * L, q[1] - d.n[1] * L]);
        }
        const g0 = P(y1, d), g1 = P(y1 + h, d);
        fillPoly(c, [g0].concat(tails, [g1]), kit.hue(30, 0.16));
        for (let i = 0; i <= N; i++) {
          const q = P(y1 + h * i / N, d), tl = tails[i];
          if (Math.hypot(q[0] - tl[0], q[1] - tl[1]) > 6) kit.arrow(c, tl[0], tl[1], q[0] - d.n[0] * 2, q[1] - d.n[1] * 2, C.warn, 1.4);
        }
        line(c, tails, C.warn, 1.2);
        // the gate
        line(c, [g0, g1], C.accent, 7);
        if (V.hinge) { kit.dot(c, g0[0], g0[1], 5, C.surface, C.text); kit.label(c, 'hinge', g0[0] + d.n[0] * 20 + 4, g0[1] + d.n[1] * 20, { color: C.muted, size: 10.5 }); }
        const qc = P(yc, d), qp = P(yp, d);
        const Lr = clamp(40 + 30 * Math.log10(1 + F / 1000), 40, 140);
        kit.arrow(c, qp[0] - d.n[0] * Lr, qp[1] - d.n[1] * Lr, qp[0], qp[1], C.bad, 3.5);
        kit.dot(c, qc[0], qc[1], 4, C.text); kit.dot(c, qp[0], qp[1], 4.5, C.bad);
        kit.label(c, 'C', qc[0] + d.n[0] * 16, qc[1] + d.n[1] * 16 - 6, { color: C.text, size: 11.5, weight: 700 });
        kit.label(c, 'CP', qp[0] + d.n[0] * 16, qp[1] + d.n[1] * 16 + 7, { color: C.bad, size: 11.5, weight: 700 });
        kit.label(c, force(F), qp[0] - d.n[0] * (Lr + 8), qp[1] - d.n[1] * (Lr + 8) - 10, { color: C.bad, size: 12, weight: 700, align: 'center', bg: C.surface });
        // depth of the CP
        line(c, [[qp[0], qp[1]], [Ox + 50, qp[1]]], C.muted, 1, [3, 3]);
        dimV(kit, c, Ox + 44, Oy, qp[1], (yp * sn).toFixed(2) + ' m', C.muted);
        // the angle and the handle
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(Ox, Oy, 34, Math.PI - d.t, Math.PI); c.stroke();
        kit.label(c, 'θ', Ox - 44 * Math.cos(d.t / 2), Oy + 44 * Math.sin(d.t / 2), { color: C.muted, size: 12, align: 'center' });
        kit.dot(c, E[0], E[1], 7, C.accent, C.text);
        kit.label(c, 'drag to tilt', E[0] + 12, E[1] + 4, { color: C.muted, size: 10.5 });
        // front view
        const fx = 668, fy = 150, fs = Math.min(135 / (circle ? h : Math.max(V.b, h)), 170 / h), wv = (circle ? h : V.b) * fs, hv = h * fs;
        kit.label(c, 'front view', fx, 28, { color: C.muted, size: 11, weight: 700, align: 'center' });
        const grad = c.createLinearGradient(0, fy - hv / 2, 0, fy + hv / 2);
        const aTop = 0.08 + 0.5 * y1 / (y1 + h);
        grad.addColorStop(0, kit.hue(30, aTop)); grad.addColorStop(1, kit.hue(30, 0.6));
        c.fillStyle = grad; c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath();
        if (circle) c.arc(fx, fy, hv / 2, 0, Math.PI * 2); else c.rect(fx - wv / 2, fy - hv / 2, wv, hv);
        c.fill(); c.stroke();
        line(c, [[fx - 7, fy], [fx + 7, fy]], C.text, 1.5); line(c, [[fx, fy - 7], [fx, fy + 7]], C.text, 1.5);
        const cpy = fy + (yp - yc) * fs;
        kit.dot(c, fx, cpy, 4.5, C.bad);
        kit.label(c, 'C', fx + 10, fy - 8, { color: C.text, size: 11 });
        kit.label(c, 'CP ' + ((yp - yc) * 1000).toFixed(0) + ' mm lower', fx + 10, cpy + 10, { color: C.bad, size: 11 });
        kit.label(c, 'darker = higher pressure', fx, fy + hv / 2 + 16, { color: C.muted, size: 10.5, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ====================================================================== a radial (Tainter) gate */
  Hyper.sim('hs-curved-gate', {
    title: 'A radial (Tainter) gate',
    blurb: `A radial gate seen from the side: its skin plate is an arc of a circle centred on the trunnion pin, carried by steel arms. The water pushes square-on to the plate at every point (orange arrows), so every push points at the trunnion — and so does their resultant (red). The force is worked out by adding up the pushes along the arc; the horizontal part is checked against the vertical projection, ½ρgbH².

**Try this**
- Read the moment of the water about the trunnion: zero, whatever the depth, radius or trunnion height.
- Compare the horizontal force with ½ρgbH² — the projection rule — and see that the arc's shape does not change it.
- Watch the vertical component: below the trunnion the water lies under the plate and pushes up; above it, it lies on top and pushes down. With the trunnion high, the net push is upward.
- Compare the hoist force with that of a flat lift gate of the same size dragged against its guides: the radial gate needs a fraction of it, because only the gate's weight and the trunnion friction resist.
- Raise the trunnion: the arms and the hoist see different lever arms, but the water moment stays zero.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Upstream water depth', min: 0.5, max: 10, step: 0.1, value: 7, unit: 'm' },
        { id: 'G', label: 'Gate height', min: 3, max: 10, step: 0.1, value: 8, unit: 'm' },
        { id: 'R', label: 'Radius of the skin plate', min: 5, max: 15, step: 0.1, value: 10, unit: 'm' },
        { id: 'yT', label: 'Trunnion height above the sill', min: 1, max: 9, step: 0.1, value: 5, unit: 'm' },
        { id: 'b', label: 'Gate width', min: 4, max: 20, step: 0.5, value: 12, unit: 'm' },
        { id: 'arrows', type: 'check', label: 'Show the pressure on the skin plate', value: true }
      ], () => {});
      const ro = kit.readout(box.side, [['FH', 'Horizontal F_H (projection ½ρgbH²)'], ['FV', 'Vertical F_V'], ['FR', 'Resultant and its direction'], ['M', 'Moment of the water about the trunnion'], ['hoist', 'Hoist force, radial gate (estimate)'], ['lift', 'Flat lift gate of the same size (μ = 0.3)']]);
      const V = ctl.values, RHO = 1000;
      const loop = kit.loop(() => {
        const R = V.R, yT = Math.min(V.yT, V.G, 0.95 * R), G = Math.min(V.G, yT + 0.95 * R), H = Math.min(V.H, G);
        const ab = Math.asin(-yT / R), at = Math.asin((G - yT) / R), aw = Math.asin((H - yT) / R);
        let FH = 0, FV = 0, Mt = 0;
        const N = 240, da = (aw - ab) / N;
        for (let k = 0; k < N; k++) {
          const a = ab + (k + 0.5) * da, y = yT + R * Math.sin(a), dF = RHO * G0 * Math.max(0, H - y) * R * da * V.b;
          const fx = dF * Math.cos(a), fy = -dF * Math.sin(a), rx = -R * Math.cos(a), ry = R * Math.sin(a);
          FH += fx; FV += fy; Mt += rx * fy - ry * fx;
        }
        const FR = Math.hypot(FH, FV), phi = Math.atan2(FV, FH) * 180 / Math.PI;
        const FHp = 0.5 * RHO * G0 * V.b * H * H;
        const W = 800 * G0 * R * (at - ab) * V.b, am = (ab + at) / 2;       // about 0.8 t of steel per m² of gate face
        const Mw = W * 0.75 * R * Math.cos(am), Mf = 0.3 * 0.035 * R * (FR + W);
        const hoist = (Mw + Mf) / (R * Math.cos(ab)), lift = W + 0.3 * FH;
        ro.set('FH', force(FH) + '  (' + force(FHp) + ')');
        ro.set('FV', force(Math.abs(FV)) + (FV >= 0 ? ' upward' : ' downward'));
        ro.set('FR', force(FR) + ' at ' + Math.abs(phi).toFixed(1) + '° ' + (phi >= 0 ? 'above' : 'below') + ' the horizontal');
        ro.set('M', (Math.abs(Mt) < 1e-6 * FR * R + 1 ? '0' : force(Mt).replace('N', 'N·m')) + '  — the resultant passes through the pin');
        ro.set('hoist', force(hoist) + '  (gate ' + (W / G0 / 1000).toFixed(0) + ' t)');
        ro.set('lift', force(lift));
        // ---- drawing
        const m = design(st, 760, 430), c = m.c, C = kit.colors();
        const s = Math.min(330 / (G + 1.6), 540 / (R + 3.5)), Tx = 40 + (R + 2.5) * s, base = 395;
        const SX = x => Tx + x * s, SY = y => base - y * s;
        const arcPt = a => [SX(-R * Math.cos(a)), SY(yT + R * Math.sin(a))];
        c.fillStyle = C.surface; c.fillRect(0, base, 760, 35); line(c, [[0, base], [760, base]], C.text, 2);
        const wpts = [[0, SY(H)]];
        for (let k = 0; k <= 48; k++) wpts.push(arcPt(aw - (aw - ab) * k / 48));
        wpts.push([0, base]);
        fillPoly(c, wpts, kit.hue(205, 0.24));
        line(c, [[0, SY(H)], arcPt(aw)], kit.hue(205), 1.5);
        kit.label(c, '▽', 24, SY(H) - 9, { color: C.accent, size: 13 });
        line(c, [[SX(-1.2), base], [SX(-1.2), SY(G + 0.6)], [SX(1.4), SY(G + 0.6)], [SX(1.4), base]], C.muted, 1, [5, 4]);
        kit.label(c, 'pier', SX(1.4) + 6, SY(G + 0.6) + 10, { color: C.muted, size: 10.5 });
        const T = [SX(0), SY(yT)];
        for (const a of [ab, am, at]) line(c, [T, arcPt(a)], C.muted, 3);
        const sp = [];
        for (let k = 0; k <= 60; k++) sp.push(arcPt(ab + (at - ab) * k / 60));
        line(c, sp, C.text, 5);
        if (V.arrows) {
          for (let k = 0; k < 15; k++) {
            const a = ab + (aw - ab) * (k + 0.5) / 15, dep = H - (yT + R * Math.sin(a)), L = dep * s * 0.5, p = arcPt(a);
            if (L > 5) kit.arrow(c, p[0] - Math.cos(a) * L, p[1] - Math.sin(a) * L, p[0] - Math.cos(a) * 3, p[1] - Math.sin(a) * 3, C.warn, 1.4);
          }
        }
        if (FR > 0) {
          const fx = FH / FR, fy = FV / FR, Ps = [SX(-R * fx), SY(yT - R * fy)], Lr = 70;
          kit.arrow(c, Ps[0] - fx * Lr, Ps[1] + fy * Lr, Ps[0], Ps[1], C.bad, 3.5);
          line(c, [Ps, T], C.bad, 1.3, [5, 4]);
          kit.label(c, force(FR), Ps[0] - fx * (Lr + 10), Ps[1] + fy * (Lr + 10) - 10, { color: C.bad, size: 12, weight: 700, align: 'center', bg: C.surface });
        }
        kit.dot(c, T[0], T[1], 7, C.surface, C.text);
        line(c, [[T[0] - 4, T[1]], [T[0] + 4, T[1]]], C.text, 1.2); line(c, [[T[0], T[1] - 4], [T[0], T[1] + 4]], C.text, 1.2);
        kit.label(c, 'trunnion: water moment 0', T[0] + 12, T[1] + 16, { color: C.text, size: 11, weight: 600 });
        const sill = arcPt(ab), top = SY(G + 1.3);
        line(c, [sill, [sill[0], top]], C.muted, 1.5, [2, 3]);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(sill[0] - 18, top - 16, 36, 16); c.strokeRect(sill[0] - 18, top - 16, 36, 16);
        kit.label(c, 'hoist ' + force(hoist), sill[0], top - 26, { color: C.text, size: 11, align: 'center' });
        // the components, as a force triangle
        const kf = 80 / Math.max(FH, Math.abs(FV), 1), ox = 40, oy = 70;
        c.fillStyle = C.surface; c.globalAlpha = 0.85; c.fillRect(ox - 12, oy - 55, 200, 110); c.globalAlpha = 1;
        kit.arrow(c, ox, oy, ox + FH * kf, oy, C.accent, 2.2);
        kit.arrow(c, ox + FH * kf, oy, ox + FH * kf, oy - FV * kf, C.ok, 2.2);
        kit.arrow(c, ox, oy, ox + FH * kf, oy - FV * kf, C.bad, 2.5);
        kit.label(c, 'F_H', ox + FH * kf / 2, oy + 12, { color: C.accent, size: 11, align: 'center' });
        kit.label(c, 'F_V', ox + FH * kf + 6, oy - FV * kf / 2, { color: C.ok, size: 11 });
        kit.label(c, 'F_R', ox + FH * kf / 2 - 12, oy - FV * kf / 2 - 8, { color: C.bad, size: 11, align: 'right' });
        if (V.H > G + 1e-9) kit.label(c, 'water level limited to the top of the gate', 740, 20, { color: C.warn, size: 11.5, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ====================================================================== Archimedes on a spring balance */
  Hyper.sim('hs-buoyancy', {
    title: 'Archimedes on a spring balance',
    blurb: `A one-litre block hangs from a spring balance above a beaker that stands on a scale. Lower the hook: as the block goes into the liquid, the balance reads less and the scale reads more — by exactly the buoyant force, the weight of the liquid pushed aside. The block really hangs on a spring and really floats, so it bobs as it settles.

**Try this**
- Lower an aluminium block step by step: the buoyant force grows with the immersed depth, then stays fixed once the block is under, however deep it goes.
- Watch the scale under the beaker: it gains what the balance loses — the block pushes down on the liquid as hard as the liquid pushes up on it.
- Try oak or ice: the block floats and the string goes slack; the floating block sinks until it displaces its own weight.
- Put the steel block into mercury: steel floats.
- Compare fresh water, sea water and oil for the same block: the denser the liquid, the larger the upthrust.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const A_BLK = 0.01, SIDE = 0.1, A_BK = 0.0256, L0 = 0.12, KSP = 5000, M_BEAKER = 0.35, rr = A_BLK / A_BK;
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Lower the hook', min: -60, max: 110, step: 1, value: -30, unit: 'mm' },
        { id: 'mat', type: 'select', label: 'Block (1 litre)', options: [['Aluminium, 2700 kg/m³', 2700], ['Steel, 7850 kg/m³', 7850], ['Brass, 8500 kg/m³', 8500], ['Concrete, 2400 kg/m³', 2400], ['Ice, 917 kg/m³', 917], ['Oak, 700 kg/m³', 700], ['Polystyrene foam, 30 kg/m³', 30]], value: 2700 },
        { id: 'liq', type: 'select', label: 'Liquid in the beaker', options: [['Fresh water, 998 kg/m³', 'water'], ['Sea water, 1025 kg/m³', 'sea'], ['Hydraulic oil, 870 kg/m³', 'oil'], ['Glycerine, 1260 kg/m³', 'glycerine'], ['Mercury, 13 546 kg/m³', 'mercury']], value: 'water' }
      ], () => {});
      const ro = kit.readout(box.side, [['W', 'Weight of the block in air'], ['B', 'Buoyant force ρ_f·g·V_sub'], ['T', 'Spring balance reads'], ['S', 'Scale under the beaker reads'], ['state', 'State']]);
      const V = ctl.values;
      const hookY = () => L0 - V.z / 1000 + SIDE;               // height of the block's top with the spring unstretched
      const subDepth = yb => clamp((L0 - yb) / (1 - rr), 0, SIDE);
      const mass = () => V.mat * SIDE * SIDE * SIDE;
      let yb = hookY() - SIDE - mass() * G0 / KSP, vb = 0;
      const HUE = { 2700: 215, 7850: 220, 8500: 45, 2400: 30, 917: 190, 700: 28, 30: 60 };
      const loop = kit.loop((dt) => {
        const mb = mass(), rf = LIQ[V.liq].rho, Yh = hookY();
        const keff = KSP + rf * G0 * A_BLK, cd = 2 * 0.3 * Math.sqrt(keff * mb), n = 60, h = dt / n;
        for (let k = 0; k < n; k++) {
          const Bf = rf * G0 * A_BLK * subDepth(yb), T = KSP * Math.max(0, Yh - (yb + SIDE));
          vb += (T + Bf - mb * G0 - cd * vb) / mb * h; yb += vb * h;
          if (yb < 0) { yb = 0; if (vb < 0) vb = 0; }
        }
        const zs = subDepth(yb), Bf = rf * G0 * A_BLK * zs, T = KSP * Math.max(0, Yh - (yb + SIDE));
        const Nf = yb <= 1e-6 ? Math.max(0, mb * G0 - T - Bf) : 0, Lq = L0 + rr * zs;
        const mLiq = rf * A_BK * L0, scaleN = (M_BEAKER + mLiq) * G0 + Bf + Nf;
        ro.set('W', (mb * G0).toFixed(2) + ' N');
        ro.set('B', Bf.toFixed(2) + ' N  (' + (A_BLK * zs * 1e6).toFixed(0) + ' mL displaced)');
        ro.set('T', T.toFixed(2) + ' N');
        ro.set('S', (scaleN / G0).toFixed(3) + ' kg  (+' + ((Bf + Nf) / G0 * 1000).toFixed(0) + ' g from the block)');
        ro.set('state', zs <= 1e-6 ? 'hanging in the air' : Nf > 1e-6 ? 'resting on the bottom' : T < 1e-3 * mb * G0 ? 'floating: the string is slack' : zs < SIDE - 1e-6 ? 'partly immersed' : 'fully immersed');
        // ---- drawing (1 mm = 1 px)
        const m = design(st, 760, 430), c = m.c, C = kit.colors(), FLOOR = 392, cx = 380;
        const Yp = y => FLOOR - y * 1000;
        // stand
        line(c, [[90, FLOOR + 33], [90, 12], [cx, 12]], C.muted, 5);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(50, FLOOR + 30, 90, 8); c.strokeRect(50, FLOOR + 30, 90, 8);
        // the scale under the beaker
        c.fillRect(cx - 120, FLOOR + 3, 240, 7); c.strokeRect(cx - 120, FLOOR + 3, 240, 7);
        c.fillRect(cx - 100, FLOOR + 10, 200, 24); c.strokeRect(cx - 100, FLOOR + 10, 200, 24);
        kit.label(c, (scaleN / G0).toFixed(3) + ' kg', cx, FLOOR + 22, { color: C.accent, size: 13, weight: 700, align: 'center' });
        // liquid and beaker
        c.fillStyle = liqCol(kit, V.liq, 0.42); c.fillRect(cx - 80, Yp(Lq), 160, Lq * 1000);
        line(c, [[cx - 83, Yp(0.2)], [cx - 83, FLOOR + 1], [cx + 83, FLOOR + 1], [cx + 83, Yp(0.2)]], C.text, 3);
        line(c, [[cx + 86, Yp(L0)], [cx + 140, Yp(L0)]], C.muted, 1, [3, 3]);
        kit.label(c, 'level without the block', cx + 144, Yp(L0), { color: C.muted, size: 10.5 });
        if (zs > 0) { line(c, [[cx + 86, Yp(Lq)], [cx + 140, Yp(Lq)]], kit.hue(205), 1.2); kit.label(c, 'rise ' + ((Lq - L0) * 1000).toFixed(1) + ' mm', cx + 144, Yp(Lq) - 12, { color: kit.hue(205), size: 10.5 }); }
        // the block
        const top = Yp(yb + SIDE);
        c.fillStyle = kit.hue(HUE[V.mat] || 215, 0.5); c.fillRect(cx - 50, top, 100, 100);
        if (zs > 0) { c.fillStyle = liqCol(kit, V.liq, 0.3); c.fillRect(cx - 50, Yp(yb + zs), 100, zs * 1000); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(cx - 50, top, 100, 100);
        // string and spring balance
        const taut = T > 1e-6, sb = taut ? yb + SIDE + 0.02 : Yh + 0.02;
        if (taut) line(c, [[cx, top], [cx, Yp(sb)]], C.text, 1.5);
        else { c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, top); c.quadraticCurveTo(cx + 16, (top + Yp(sb)) / 2, cx, Yp(sb)); c.stroke(); }
        const cTop = Yp(Yh + 0.1), cBot = Yp(Yh - 0.005);
        line(c, [[cx, 12], [cx, cTop]], C.muted, 3);
        c.fillStyle = C.surface; c.fillRect(cx - 16, cTop, 32, cBot - cTop); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(cx - 16, cTop, 32, cBot - cTop);
        const zz = [], yA = Yp(Yh + 0.092), yB = Yp(sb);
        for (let k = 0; k <= 12; k++) zz.push([cx + (k === 0 || k === 12 ? 0 : (k % 2 ? 6 : -6)), yA + (yB - yA) * k / 12]);
        line(c, zz, C.muted, 1.2);
        for (let f = 0; f <= 80; f += 20) { const yy = Yp(Yh + 0.02 - f / KSP); line(c, [[cx - 16, yy], [cx - 10, yy]], C.muted, 1); }
        line(c, [[cx - 8, Yp(sb)], [cx + 14, Yp(sb)]], C.bad, 2);
        kit.label(c, T.toFixed(1) + ' N', cx + 22, (cTop + cBot) / 2, { color: C.text, size: 12, weight: 700 });
        // forces on the block
        const len = F => clamp(F * 1.3, 0, 110);
        const midY = top + 50;
        kit.arrow(c, cx - 26, midY, cx - 26, midY + len(mb * G0), C.text, 2.5);
        kit.label(c, 'W', cx - 34, midY + len(mb * G0) - 6, { color: C.text, size: 11, weight: 700, align: 'right' });
        if (Bf > 0.01) { const by = Yp(yb + zs / 2); kit.arrow(c, cx + 26, by, cx + 26, by - len(Bf), C.accent, 2.5); kit.label(c, 'B', cx + 34, by - len(Bf) + 6, { color: C.accent, size: 11, weight: 700 }); }
        if (taut) { kit.arrow(c, cx + 8, top, cx + 8, top - len(T), C.warn, 2); kit.label(c, 'T', cx + 14, top - len(T) + 6, { color: C.warn, size: 11, weight: 700 }); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ====================================================================== a floating box heeling */
  Hyper.sim('hs-floating-stability', {
    title: 'Stability of a floating box',
    blurb: `A box-shaped barge in cross-section, 40 m long. Heel it with the slider: the underwater shape changes, the centre of buoyancy **B** moves towards the low side, and the weight at **G** and the buoyancy at **B** form a couple. The green lever **GZ** means the couple rights the hull; red means it rolls it further. The metacentre **M** is shown for small angles; the graph is the full GZ curve, worked out from the real underwater shape at every angle.

**Try this**
- Tick *Free to roll* and watch the roll: a large GM gives a quick, stiff roll, a small GM a slow, lazy one.
- Raise G (KG) until it passes M: the upright hull becomes unstable. Let it go — a wall-sided box does not capsize at once but lolls over to the **angle of loll**, where GZ is zero again.
- Make the barge wider: BM = b²/12d grows with the square of the breadth, and the hull becomes much stiffer.
- Load it deeper (more draught) with G fixed: KB rises but BM falls — see the table on the right.
- Find the deck-edge angle on the graph: beyond it GZ stops growing as fast, and eventually falls to zero.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 290 });
      const graph = document.createElement('div');
      graph.style.padding = '4px 10px 10px';
      box.stage.appendChild(graph);
      let phi = 10 * Math.PI / 180, om = 0, capsized = false, curveKey = '', markKey = '';
      const ctl = kit.controls(box.side, [
        { id: 'b', label: 'Breadth b', min: 4, max: 16, step: 0.1, value: 10, unit: 'm' },
        { id: 'D', label: 'Depth of the hull', min: 2, max: 10, step: 0.1, value: 5, unit: 'm' },
        { id: 'd', label: 'Draught d', min: 0.5, max: 8, step: 0.1, value: 2, unit: 'm' },
        { id: 'KG', label: 'Centre of gravity above the keel, KG', min: 0.5, max: 12, step: 0.1, value: 3, unit: 'm' },
        { id: 'phi', label: 'Heel angle', min: -80, max: 80, step: 1, value: 10, unit: '°' },
        { id: 'free', type: 'check', label: 'Free to roll (let go)', value: false },
        { type: 'buttons', items: [{ id: 'push', label: 'Give it a push' }] }
      ], (id, v) => {
        if (id === 'phi') { phi = v * Math.PI / 180; om = 0; capsized = false; }
        if (id === 'push') { ctl.set('free', true); capsized = false; om += 0.12; }
        if (id === 'free' && v) capsized = false;
      });
      const ro = kit.readout(box.side, [['kb', 'KB / BM / KM'], ['gm', 'GM'], ['gz', 'GZ at this heel'], ['rm', 'Righting moment (40 m hull, sea water)'], ['T', 'Natural roll period (k = 0.4 b)'], ['ang', 'Deck edge under / bilge out at']]);
      const plot = kit.plot(graph, { x: { label: 'heel angle (°)', min: 0, max: 80 }, y: { label: 'righting lever GZ (m)' }, legend: true }, 160);
      const V = ctl.values;
      const hull = () => ({ b: V.b, D: V.D, d: Math.min(V.d, V.D - 0.1) });
      const rot = (x, y, f) => [x * Math.cos(f) + y * Math.sin(f), -x * Math.sin(f) + y * Math.cos(f)];
      function state(f) {
        const { b, D, d } = hull();
        const pts = [[-b / 2, 0], [b / 2, 0], [b / 2, D], [-b / 2, D]].map(p => rot(p[0], p[1], f));
        let lo = Math.min(...pts.map(p => p[1])), hi = Math.max(...pts.map(p => p[1]));
        const A0 = b * d;
        for (let k = 0; k < 48; k++) { const mid = (lo + hi) / 2; if (areaCentroid(clipBelow(pts, mid)).A < A0) lo = mid; else hi = mid; }
        const wl = (lo + hi) / 2, sub = clipBelow(pts, wl), B = areaCentroid(sub), G = rot(0, V.KG, f);
        return { pts, wl, sub, B, G, gz: B.x - G[0] };
      }
      const loop = kit.loop((dt) => {
        const { b, D, d } = hull();
        const KB = d / 2, BM = b * b / (12 * d), KM = KB + BM, GM = KM - V.KG, kr = 0.4 * b;
        if (V.free && !capsized) {
          const wn = Math.sqrt(G0 * Math.max(0.05, Math.abs(GM))) / kr, n = 8, h = dt / n;
          for (let i = 0; i < n; i++) {
            om += (-G0 * state(phi).gz / (kr * kr) - 2 * 0.05 * wn * om) * h;
            phi += om * h;
            if (Math.abs(phi) >= Math.PI / 2) { phi = Math.sign(phi) * Math.PI / 2; om = 0; capsized = true; break; }
          }
          ctl.set('phi', Math.round(phi * 180 / Math.PI));
        } else if (!V.free) { phi = V.phi * Math.PI / 180; om = 0; }
        const S0 = state(phi), deg = phi * 180 / Math.PI;
        const deck = Math.atan(2 * (D - d) / b) * 180 / Math.PI, bilge = Math.atan(2 * d / b) * 180 / Math.PI;
        const loll = GM < 0 ? Math.atan(Math.sqrt(-2 * GM / BM)) * 180 / Math.PI : 0;
        // the GZ curve, recomputed when the hull changes
        const ck = [b, D, d, V.KG].join();
        if (ck !== curveKey) {
          curveKey = ck; markKey = '';
          const gzp = [], gmp = [];
          for (let a = 0; a <= 80; a += 1) { gzp.push([a, state(a * Math.PI / 180).gz]); gmp.push([a, GM * Math.sin(a * Math.PI / 180)]); }
          plot.set({ series: [{ pts: gzp, label: 'GZ' }, { pts: gmp, label: 'GM·sin φ (small angles)', dash: [5, 4] }], vlines: [{ x: deck, label: 'deck edge' }].concat(bilge < 80 ? [{ x: bilge, label: 'bilge' }] : []), hlines: [{ y: 0, label: '' }] });
        }
        const mk = Math.round(Math.abs(deg)) + ',' + ck;
        if (mk !== markKey) { markKey = mk; plot.set({ marks: [{ x: Math.min(80, Math.abs(deg)), y: S0.gz * Math.sign(phi || 1), label: '' }] }); }
        const W = 1025 * 40 * b * d * G0;
        ro.set('kb', KB.toFixed(2) + ' / ' + BM.toFixed(2) + ' / ' + KM.toFixed(2) + ' m');
        ro.set('gm', GM.toFixed(2) + ' m ' + (GM > 0 ? '(stable upright)' : '(unstable upright; loll ≈ ' + loll.toFixed(0) + '°)'));
        ro.set('gz', (S0.gz * Math.sign(phi || 1)).toFixed(3) + ' m ' + (Math.abs(deg) < 0.5 ? '' : S0.gz * phi > 0 ? '(righting)' : '(capsizing)'));
        ro.set('rm', (W * Math.abs(S0.gz) / 1e6).toFixed(2) + ' MN·m');
        ro.set('T', GM > 0 ? (2 * Math.PI * kr / Math.sqrt(G0 * GM)).toFixed(1) + ' s' : 'none: it will not oscillate about upright');
        ro.set('ang', deck.toFixed(0) + '° / ' + bilge.toFixed(0) + '°');
        // ---- drawing
        const m = design(st, 760, 420), c = m.c, C = kit.colors();
        const sc = 250 / Math.hypot(b, D), cx = 290, wy = 20 + (D - d) * sc + (380 - D * sc) / 2;
        const SX = x => cx + x * sc, SY = y => wy - (y - S0.wl) * sc, sp = p => [SX(p[0]), SY(p[1])];
        c.fillStyle = kit.hue(205, 0.2); c.fillRect(0, wy, 560, 420 - wy);
        line(c, [[0, wy], [560, wy]], kit.hue(205), 1.5);
        fillPoly(c, S0.pts.map(sp), C.surface);
        if (S0.sub.length > 2) fillPoly(c, S0.sub.map(sp), kit.hue(205, 0.28));
        c.strokeStyle = C.text; c.lineWidth = 2.2; path(c, S0.pts.map(sp), true); c.stroke();
        const k0 = rot(0, 0, phi), kTop = rot(0, Math.max(D, KM, V.KG) + 1, phi);
        line(c, [sp(k0), sp(kTop)], C.muted, 1, [6, 4]);
        const Gs = sp(S0.G), Bs = [SX(S0.B.x), SY(S0.B.y)], Ms = sp(rot(0, KM, phi));
        line(c, [Bs, [Bs[0], Math.min(Ms[1], Gs[1]) - 30]], C.accent, 1, [4, 3]);
        const good = S0.gz * phi >= 0;
        line(c, [Gs, [Bs[0], Gs[1]]], good ? C.ok : C.bad, 3.5);
        kit.arrow(c, Gs[0], Gs[1], Gs[0], Gs[1] + 60, C.bad, 2.5);
        kit.arrow(c, Bs[0], Bs[1], Bs[0], Bs[1] - 60, C.accent, 2.5);
        kit.dot(c, Gs[0], Gs[1], 5, C.bad, C.text); kit.dot(c, Bs[0], Bs[1], 5, C.accent, C.text);
        if (Ms[1] > -20) { kit.dot(c, Ms[0], Ms[1], 4.5, C.ok, C.text); kit.label(c, 'M', Ms[0] + 9, Ms[1] - 6, { color: C.ok, size: 12, weight: 700 }); }
        kit.label(c, 'G', Gs[0] - 9, Gs[1] - 8, { color: C.bad, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'B', Bs[0] + 9, Bs[1] + 10, { color: C.accent, size: 12, weight: 700 });
        kit.label(c, 'Z', Bs[0] + 7, Gs[1] - 9, { color: good ? C.ok : C.bad, size: 11, weight: 700 });
        kit.label(c, 'K', SX(k0[0]) + 6, SY(k0[1]) + 10, { color: C.muted, size: 11 });
        const status = capsized ? 'capsized: lying on its side' : GM > 0 ? 'stable upright: M is above G' : 'unstable upright: G is above M';
        kit.label(c, status, 16, 22, { color: capsized || GM <= 0 ? C.bad : C.ok, size: 13, weight: 700 });
        kit.label(c, 'heel ' + deg.toFixed(0) + '°', 16, 42, { color: C.text, size: 12 });
        // the heights above the keel, to scale
        const hx = 610, hy0 = 385, hmax = Math.max(KM, V.KG, D) * 1.05, hs = 330 / hmax;
        line(c, [[hx, hy0], [hx, hy0 - hmax * hs]], C.axis, 1.5);
        const tick = (y, lab, col2) => { const yy = hy0 - y * hs; line(c, [[hx - 6, yy], [hx + 6, yy]], col2, 2); kit.label(c, lab + ' ' + y.toFixed(2) + ' m', hx + 10, yy, { color: col2, size: 10.5 }); };
        tick(0, 'K', C.muted); tick(d, 'waterline', kit.hue(205)); tick(D, 'deck', C.muted);
        tick(KB, 'B', C.accent); tick(V.KG, 'G', C.bad); tick(KM, 'M', C.ok);
        dimV(kit, c, hx - 16, hy0 - V.KG * hs, hy0 - KM * hs, 'GM', GM > 0 ? C.ok : C.bad, 'right');
        kit.label(c, 'heights above the keel', hx, 22, { color: C.muted, size: 10.5, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ====================================================================== a gravity dam */
  Hyper.sim('hs-dam', {
    title: 'A gravity dam: will it stand?',
    blurb: `A concrete gravity dam in section, per metre of its length. Water presses on the upstream face with the triangular pressure diagram; water seeping under the base pushes up (uplift); the dam's weight holds it down. The checks are the ones a designer makes: **overturning** about the toe, **sliding** on the base, and whether the resultant crosses the base inside its **middle third** (green band), so that no tension opens at the heel.

**Try this**
- Fill the reservoir from empty and watch the factors of safety fall on the graph — the thrust grows with H², its moment with H³.
- Switch the uplift from *None* to *Full*: both factors drop sharply and the resultant moves towards the toe. With drains it is far better.
- Narrow the base (B/H = 0.6): the dam still stands without uplift but fails the middle third and the sliding check with it.
- Sliding on friction alone is the hardest check; real designs count the cohesion of the rock as well.
- Empty the reservoir: the resultant moves back towards the heel — a dam must also be safe when empty.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const graph = document.createElement('div');
      graph.style.padding = '4px 10px 10px';
      box.stage.appendChild(graph);
      let key = '', markKey = '';
      const ctl = kit.controls(box.side, [
        { id: 'Hw', label: 'Reservoir depth at the dam', min: 0, max: 100, step: 0.5, value: 48, unit: 'm' },
        { id: 'Hd', label: 'Dam height', min: 20, max: 100, step: 1, value: 50, unit: 'm' },
        { id: 'beta', label: 'Base width ÷ height', min: 0.4, max: 1.2, step: 0.01, value: 0.8 },
        { id: 'crest', label: 'Crest width', min: 0, max: 12, step: 0.5, value: 6, unit: 'm' },
        { id: 'up', type: 'select', label: 'Uplift under the base', options: [['None (an ideal, watertight foundation)', 'none'], ['Drained: a third of the head at the drain line', 'drain'], ['Full: reservoir head at the heel, no drains', 'full']], value: 'drain' },
        { id: 'mu', label: 'Friction coefficient μ, concrete on rock', min: 0.5, max: 0.9, step: 0.01, value: 0.7 },
        { id: 'rc', label: 'Concrete density', min: 2200, max: 2600, step: 10, value: 2400, unit: 'kg/m³' }
      ], () => {});
      const ro = kit.readout(box.side, [['P', 'Water thrust P'], ['W', 'Weight W'], ['U', 'Uplift U'], ['fo', 'Overturning: restoring ÷ overturning moment'], ['fs', 'Sliding: μ(W − U) ÷ P'], ['res', 'Resultant crosses the base'], ['sig', 'Base pressure at heel / toe']]);
      const plot = kit.plot(graph, { x: { label: 'reservoir depth (m)', min: 0, max: 50 }, y: { label: 'factor of safety', min: 0, max: 6 }, legend: true }, 150);
      const V = ctl.values, RHO = 1000;
      function analyse(Hw) {
        const Hd = V.Hd, B = V.beta * Hd, c0 = Math.min(V.crest, 0.5 * B);
        const sec = [[0, 0], [B, 0], [c0, Hd], [0, Hd]];
        const ac = areaCentroid(sec), W = V.rc * G0 * ac.A;
        const H = clamp(Hw, 0, Hd), P = 0.5 * RHO * G0 * H * H, u0 = RHO * G0 * H, xd = Math.max(0.08 * B, 2);
        const u = x => V.up === 'none' ? 0 : V.up === 'full' ? u0 * (1 - x / B) : x < xd ? u0 * (1 - (2 / 3) * x / xd) : (u0 / 3) * (B - x) / (B - xd);
        let U = 0, MU = 0;
        const N = 200;
        for (let k = 0; k < N; k++) { const x = (k + 0.5) / N * B, dU = u(x) * B / N; U += dU; MU += dU * (B - x); }
        const MR = W * (B - ac.x), MO = P * H / 3 + MU, Nv = Math.max(W - U, 1), xt = (MR - MO) / Nv, e = B / 2 - xt;
        return { B, c0, sec, ac, W, H, P, U, MU, MR, MO, Nv, xt, e, u, fo: MO > 0 ? MR / MO : Infinity, fs: P > 0 ? V.mu * Nv / P : Infinity };
      }
      const loop = kit.loop(() => {
        const A = analyse(V.Hw), Hd = V.Hd;
        const k2 = [Hd, V.beta, V.crest, V.up, V.mu, V.rc].join();
        if (k2 !== key) {
          key = k2; markKey = '';
          const fo = [], fsl = [];
          for (let i = 1; i <= 60; i++) { const Hh = Hd * i / 60, a = analyse(Hh); fo.push([Hh, Math.min(6, a.fo)]); fsl.push([Hh, Math.min(6, a.fs)]); }
          plot.set({ x: { label: 'reservoir depth (m)', min: 0, max: Hd }, series: [{ pts: fo, label: 'overturning' }, { pts: fsl, label: 'sliding (friction only)', dash: [5, 4] }], hlines: [{ y: 1.5, label: '1.5' }, { y: 1, label: '1' }] });
        }
        const mk = A.H + ',' + k2;
        if (mk !== markKey) { markKey = mk; plot.set({ vlines: [{ x: A.H, label: '' }] }); }
        const inside = Math.abs(A.e) <= A.B / 6 + 1e-9, sh = A.Nv / A.B * (1 - 6 * A.e / A.B), stoe = A.Nv / A.B * (1 + 6 * A.e / A.B);
        const fmtFS = f => Number.isFinite(f) ? f.toFixed(2) : '— (no water)';
        ro.set('P', force(A.P) + ' per metre, ' + (A.H / 3).toFixed(1) + ' m above the base');
        ro.set('W', force(A.W));
        ro.set('U', force(A.U) + (A.W > 0 ? '  (' + (A.U / A.W * 100).toFixed(0) + ' % of W)' : ''));
        ro.set('fo', fmtFS(A.fo) + (A.fo < 1.5 ? '  — too low' : ''));
        ro.set('fs', fmtFS(A.fs) + (A.fs < 1 ? '  — slides on friction alone' : A.fs < 1.5 ? '  — needs cohesion' : ''));
        ro.set('res', A.xt.toFixed(1) + ' m from the toe — ' + (A.xt < 0 ? 'beyond the toe: it overturns' : inside ? 'inside the middle third' : A.e > 0 ? 'outside the middle third: tension at the heel' : 'outside the middle third: tension at the toe'));
        ro.set('sig', (sh / 1000).toFixed(0) + ' kPa / ' + (stoe / 1000).toFixed(0) + ' kPa' + (sh < 0 ? '  (heel in tension)' : ''));
        // ---- drawing
        const m = design(st, 760, 430), c = m.c, C = kit.colors();
        const s = Math.min(265 / Hd, 390 / A.B), X0 = 330, base = 300, kp = 110 / Hd;
        const SX = x => X0 + x * s, SY = y => base - y * s;
        c.fillStyle = C.surface; c.fillRect(0, base, 760, 130);
        line(c, [[0, base], [760, base]], C.text, 2);
        if (A.H > 0) {
          fillPoly(c, [[20, SY(A.H)], [X0, SY(A.H)], [X0, base], [20, base]], kit.hue(205, 0.24));
          line(c, [[20, SY(A.H)], [X0, SY(A.H)]], kit.hue(205), 1.5);
          kit.label(c, '▽', 30, SY(A.H) - 9, { color: C.accent, size: 13 });
          fillPoly(c, [[X0, SY(A.H)], [X0 - A.H * kp, base], [X0, base]], kit.hue(30, 0.2));
          for (let i = 0; i < 8; i++) { const y = A.H * (i + 0.5) / 8, L = (A.H - y) * kp; if (L > 6) kit.arrow(c, X0 - L, SY(y), X0 - 2, SY(y), C.warn, 1.3); }
        }
        fillPoly(c, A.sec.map(p => [SX(p[0]), SY(p[1])]), kit.hue(30, 0.1));
        c.strokeStyle = C.text; c.lineWidth = 2; path(c, A.sec.map(p => [SX(p[0]), SY(p[1])]), true); c.stroke();
        // uplift under the base
        if (A.U > 0) {
          const up = [];
          for (let i = 0; i <= 40; i++) { const x = A.B * i / 40; up.push([SX(x), base + A.u(x) / (RHO * G0) * kp]); }
          fillPoly(c, [[SX(0), base]].concat(up, [[SX(A.B), base]]), kit.hue(205, 0.22));
          for (let i = 0; i < 10; i++) { const x = A.B * (i + 0.5) / 10, L = A.u(x) / (RHO * G0) * kp; if (L > 6) kit.arrow(c, SX(x), base + L, SX(x), base + 2, C.accent, 1.2); }
          const xU = A.B - A.MU / A.U;
          kit.arrow(c, SX(xU), base + 95, SX(xU), base + 4, C.accent, 3);
          kit.label(c, 'U', SX(xU) + 8, base + 88, { color: C.accent, size: 12, weight: 700 });
        }
        // middle third of the base
        c.fillStyle = C.ok; c.globalAlpha = 0.35; c.fillRect(SX(A.B / 3), base - 3, (A.B / 3) * s, 6); c.globalAlpha = 1;
        kit.label(c, 'heel', SX(0) - 4, base + 12, { color: C.muted, size: 10.5, align: 'right' });
        kit.label(c, 'toe', SX(A.B) + 4, base + 12, { color: C.muted, size: 10.5 });
        // forces
        const gx = SX(A.ac.x), gy = SY(A.ac.y);
        kit.arrow(c, gx, gy, gx, gy + 70, C.text, 3); kit.label(c, 'W', gx + 8, gy + 60, { color: C.text, size: 12, weight: 700 });
        kit.dot(c, gx, gy, 3.5, C.text);
        if (A.P > 0) { kit.arrow(c, X0 - 150, SY(A.H / 3), X0 - 2, SY(A.H / 3), C.bad, 3); kit.label(c, 'P', X0 - 150, SY(A.H / 3) - 12, { color: C.bad, size: 12, weight: 700 }); }
        const bx = SX(A.B - A.xt), dl = Math.hypot(A.P, A.Nv) || 1, rx = A.P / dl, ry = A.Nv / dl;
        const okc = inside && A.xt >= 0 ? C.ok : C.bad;
        if (bx > -50 && bx < 810) {
          kit.arrow(c, bx - rx * 110, base - ry * 110, bx, base, okc, 3.5);
          kit.label(c, 'R', bx - rx * 110 - 10, base - ry * 110, { color: okc, size: 12, weight: 700, align: 'right' });
        }
        kit.label(c, V.Hw > Hd ? 'the reservoir is limited to the crest (no overtopping modelled)' : '', 740, 20, { color: C.warn, size: 11.5, weight: 700, align: 'right' });
        kit.label(c, 'overturning ' + fmtFS(A.fo) + '   sliding ' + fmtFS(A.fs), 740, 40, { color: A.fo < 1.5 || A.fs < 1 ? C.bad : C.text, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
