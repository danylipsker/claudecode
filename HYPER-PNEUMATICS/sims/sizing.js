/* HYPER-PNEUMATICS · sims/sizing.js — Sizing and Dynamics
 *   dyn-stroke-phases  one stroke of a cylinder, phase by phase (kit.fluid.pneuCylinder), with air cushioning
 *   dyn-fill-empty     filling and emptying a volume through a sonic conductance: isothermal, adiabatic and real
 *   dyn-air-spring     a cylinder stopped with both ports closed: the load bouncing on two springs of air
 *   dyn-chamber-temp   chamber temperatures through a working cycle, exhaust cold and the risk of ice
 *   dyn-tubing         the valve at the cylinder against the valve metres away: stroke times and air per cycle
 *   dyn-air-budget     a machine's air budget: average and peak demand, compressor and receiver
 *   dyn-stick-slip     slow motion, static and dynamic seal friction, and the hydro-pneumatic feed unit
 *   dyn-sizer          the sizing procedure worked through and checked by simulation
 * Everything flows by ISO 6358 (kit.fluid.iso6358). dyn-chamber-temp carries its own chamber model with
 * temperatures and wall heat transfer, because pneuCylinder tracks pressures only.
 */
(function () {
  'use strict';
  const PATM = 1.013e5, P0 = 1e5, RAIR = 287.058, GAM = 1.4, TW = 293.15, G0 = 9.80665;
  const BORES = { 16: 6, 20: 8, 25: 10, 32: 12, 40: 16, 50: 20, 63: 20, 80: 25, 100: 25 };
  const BORE_LIST = [16, 20, 25, 32, 40, 50, 63, 80, 100];
  const boreOptions = () => BORE_LIST.map(b => [b + ' mm bore, ' + BORES[b] + ' mm rod', b]);
  // typical allowable impact energies (J) — elastic bumpers, adjustable air cushioning; orders of magnitude only
  const EALLOW = { 16: [0.07, 0.15], 20: [0.1, 0.25], 25: [0.15, 0.4], 32: [0.3, 1.0], 40: [0.4, 1.8], 50: [0.6, 3.0], 63: [0.8, 5], 80: [1.2, 10], 100: [1.6, 16] };
  const TUBE_BORE = D => D <= 20 ? 2.5 : D <= 40 ? 4 : D <= 63 ? 5.5 : 7.5;     // usual tube bore (mm) for a cylinder bore (mm)
  const cushLen = D => Math.min(40, 0.35 * D + 6) / 1000;                     // cushioning length, m
  const pick = (params, id, v) => (params && params[id] != null ? params[id] : v);
  // sonic conductances in series: 1/C² = Σ 1/C² (a zero closes the path)
  function series() {
    let s = 0;
    for (let i = 0; i < arguments.length; i++) {
      const c = arguments[i];
      if (!(c > 0)) return 0;
      if (Number.isFinite(c)) s += 1 / (c * c);
    }
    return s > 0 ? 1 / Math.sqrt(s) : Infinity;
  }
  // the critical pressure ratio of a valve (b) in series with a tube (b ≈ 0), roughly interpolated
  const bSeries = (b, Cv, Ct) => Math.max(0.03, b / (1 + (Cv / Ct) * (Cv / Ct)));
  // a plastic tube as a flow element: an entry like a nozzle of the tube's bore in series with wall friction.
  // Isothermal friction flow follows the ISO 6358 ellipse with b = 0 exactly: C = A / (ρ0 √(R T f L/d)).
  function tubeC(F, d, L, mdot) {
    const A = Math.PI * d * d / 4;
    const Re = Math.max(200, 4 * Math.max(mdot, 1e-6) / (Math.PI * d * 1.81e-5));
    const f = F.friction(Re, 1.5e-6 / d);
    const Centry = 0.8 * A * 1.992e-3;                      // m³/(s·Pa): 0.2 dm³/(s·bar) per mm² of ideal nozzle, Cd 0.8
    const Cfric = L > 0 ? A / (F.RHO_ANR * Math.sqrt(RAIR * TW * f * L / d)) : Infinity;
    return { C: series(Centry, Cfric), f, Re, Centry, Cfric, V: A * L };
  }
  const cdm = C => C / 1e-8;                                 // m³/(s·Pa) → dm³/(s·bar)
  const fmtC = C => (C >= 1e5 ? '∞' : C >= 10 ? C.toFixed(0) : C >= 1 ? C.toFixed(2) : C >= 0.1 ? C.toFixed(3) : C.toPrecision(2));
  const ms = t => (t < 0.01 ? (t * 1000).toFixed(1) + ' ms' : t < 1 ? (t * 1000).toFixed(0) + ' ms' : t < 100 ? t.toFixed(2) + ' s' : t < 600 ? t.toFixed(0) + ' s' : (t / 60).toFixed(1) + ' min');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // chamber colour by temperature: blue when cold, red when hot
  function tempFill(kit, TC, alpha) {
    const d = TC - 20;
    if (Math.abs(d) < 2) return kit.hue(220, 0.08);
    return d < 0 ? kit.hue(205, clamp(0.12 + (-d) / 110, 0.12, 0.6) * (alpha || 1)) : kit.hue(8, clamp(0.12 + d / 120, 0.12, 0.6) * (alpha || 1));
  }
  // a chart panel drawn on the stage: grid, y ticks, title; returns the maps
  function panel(kit, c, x, y, w, h, xr, yr, title, xAxis) {
    const C = kit.colors();
    const X = v => x + (v - xr[0]) / ((xr[1] - xr[0]) || 1) * w;
    const Y = v => y + h - (v - yr[0]) / ((yr[1] - yr[0]) || 1) * h;
    c.lineWidth = 1; c.strokeStyle = C.grid;
    const ys = Hyper.niceStep(yr[1] - yr[0] || 1, Math.max(2, Math.floor(h / 26)));
    for (let v = Math.ceil(yr[0] / ys) * ys; v <= yr[1] + ys * 1e-6; v += ys) {
      const yy = Math.round(Y(v)) + 0.5;
      c.beginPath(); c.moveTo(x, yy); c.lineTo(x + w, yy); c.stroke();
      kit.label(c, Math.abs(v) < ys * 1e-6 ? '0' : +v.toPrecision(4) + '', x - 5, yy, { size: 10.5, color: C.muted, align: 'right' });
    }
    if (xAxis) {
      const xs = Hyper.niceStep(xr[1] - xr[0] || 1, Math.max(3, Math.floor(w / 80)));
      for (let v = Math.ceil(xr[0] / xs) * xs; v <= xr[1] + xs * 1e-6; v += xs) {
        const xx = Math.round(X(v)) + 0.5;
        c.beginPath(); c.moveTo(xx, y); c.lineTo(xx, y + h); c.stroke();
        kit.label(c, +v.toPrecision(4) + '', xx, y + h + 10, { size: 10.5, color: C.muted, align: 'center' });
      }
      kit.label(c, xAxis, x + w, y + h + 10, { size: 11, color: C.text2 || C.muted, align: 'right', weight: 600, bg: C.bg2 });
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(x + 0.5, y + 0.5, w, h);
    kit.label(c, title, x + 6, y + 9, { size: 11, color: C.text, weight: 600, bg: C.bg2 });
    return { X, Y };
  }
  function trace(c, pts, X, Y, color, width, dash) {
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath();
    let pen = false;
    for (const p of pts) { if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) { pen = false; continue; } const a = X(p[0]), b = Y(p[1]); if (pen) c.lineTo(a, b); else c.moveTo(a, b); pen = true; }
    c.stroke(); c.setLineDash([]);
  }
  const bsearch = (arr, t) => { let lo = 0, hi = arr.length - 1; if (hi < 0) return 0; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (arr[m] <= t) lo = m; else hi = m; } return lo; };
  function graphs(box, n) {
    const g = document.createElement('div');
    g.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:' + (n === 1 ? '1fr' : '1fr 1fr') + ';gap:8px';
    box.stage.appendChild(g);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); g.appendChild(d); out.push(d); }
    return out;
  }

  /* ================================================================ 1. the phases of a stroke */
  Hyper.sim('dyn-stroke-phases', {
    title: 'Anatomy of a stroke',
    blurb: `One stroke of a double-acting cylinder, computed by the engine's cylinder model (chamber pressures from the adiabatic energy balance, flow through the valve, the meter-out throttle and the cushion needle by ISO 6358) and replayed with its phases shaded: the valve shifting, the pressures building and falling while nothing moves, acceleration, running at the speed the exhaust allows, cushioning, and the pressure climbing to supply after the piston has stopped. Each side has 0.8 m of tube between valve and cylinder.

**Try this**
- Compare the steady speed with the prediction $v = C\\,p_0/A$ printed beside it. While the meter-out restriction is choked the speed depends on its conductance and the annulus area only — change the supply pressure and watch the speed hardly move.
- Set the load ratio to 0 and compare extending with retracting: the retract dead time is several times longer, because the full cap-end chamber must first blow down through the throttle before the smaller annulus can win.
- Raise the load ratio to 70–80 %: the dead time and the acceleration phase stretch out. At 90 % the cylinder crawls.
- Open the throttle fully (5) and switch the cushioning off: look at the impact energy against the typical allowances. Then put a 20 kg mass on it.
- Close the cushion needle too far: the piston stops short in its cushion and creeps the last millimetres — over-cushioning costs time.
- Note when the full force is available: a clamp is not clamping until the pressure has risen to supply.`,
    mount(box, kit, params) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 440, maxH: 660 });
      let dirty = true, since = 1, res = null, tAnim = 0, hold = 0;
      const ctl = kit.controls(box.side, [
        { id: 'dir', type: 'select', label: 'Stroke', options: [['Extend (outstroke)', 1], ['Retract (instroke)', 0]], value: pick(params, 'dir', 1) },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 2, max: 10, step: 0.5, value: pick(params, 'ps', 6), unit: 'bar' },
        { id: 'bore', type: 'select', label: 'Cylinder', options: boreOptions(), value: pick(params, 'bore', 32) },
        { id: 'stroke', label: 'Stroke', min: 25, max: 500, step: 5, value: pick(params, 'stroke', 200), unit: 'mm' },
        { id: 'mass', label: 'Moving mass', min: 0.2, max: 50, value: pick(params, 'mass', 2), unit: 'kg', log: true, sig: 2 },
        { id: 'lr', label: 'Load against extension (load ratio)', min: 0, max: 90, step: 1, value: pick(params, 'lr', 20), unit: '%' },
        { id: 'cv', label: 'Valve sonic conductance C', min: 0.2, max: 5, value: pick(params, 'cv', 1.2), unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'thr', label: 'Meter-out throttle C (5 = wide open)', min: 0.05, max: 5, value: pick(params, 'thr', 0.4), unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'tv', label: 'Valve response time', min: 0, max: 40, step: 1, value: 12, unit: 'ms' },
        { id: 'cush', type: 'check', label: 'Adjustable air cushioning', value: pick(params, 'cush', true) },
        { id: 'cn', label: 'Cushion needle opening', min: 2, max: 100, value: pick(params, 'cn', 50), unit: '%', log: true, sig: 2 },
        { id: 'slow', type: 'select', label: 'Replay', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], (id) => { if (id === 'replay') { tAnim = 0; hold = 0; } else if (id !== 'slow') { dirty = true; since = 0; } });
      const ro = kit.readout(box.side, [['tt', 'Stroke time (command to end stop)'], ['td', 'Dead time: valve + pressure build-up'], ['vs', 'Steady speed · C·p₀/A prediction'],
        ['vi', 'Top speed · speed at the end cap'], ['ek', 'Kinetic energy: cushion entry · impact'], ['lim', 'Typical allowable: elastic bumper · air cushion'],
        ['full', 'Full force available after'], ['air', 'Free air to fill the driving side']]);
      const V = ctl.values;

      function simulate() {
        const D = V.bore / 1000, d = BORES[V.bore] / 1000, L = V.stroke / 1000, pg = V.ps * 1e5, ps = pg + PATM;
        const AA0 = Math.PI * D * D / 4, tb = TUBE_BORE(V.bore) / 1000;
        const cyl = F.pneuCylinder({ bore: D, rod: d, stroke: L, mass: V.mass, psupply: ps, patm: PATM, Cvalve: V.cv * 1e-8, bvalve: 0.3,
          CthrottleA: V.thr * 1e-8, CthrottleB: V.thr * 1e-8, dead: 2e-6 + Math.PI * tb * tb / 4 * 0.8,
          load: V.lr / 100 * pg * AA0, fc: 8 + 0.03 * pg * AA0, fv: 60 });
        const P = cyl.params, s = cyl.state, ext = V.dir === 1, Lc = cushLen(V.bore);
        const Cn = V.cn / 100 * 0.25 * Math.pow(V.bore / 32, 2);        // needle conductance, dm³/(s·bar)
        s.x = ext ? 0 : L; s.v = 0; s.pA = ext ? PATM : ps; s.pB = ext ? ps : PATM;
        const Aexh = ext ? cyl.AB : cyl.AA, vss = series(V.cv, V.thr) * 1e-8 * P0 / Aexh;
        const tv = V.tv / 1000, h = 2.5e-4, x0 = s.x, xEnd = ext ? L : 0;
        const T = [], X = [], Vv = [], PA = [], PB = [];
        let t = 0, tMove = null, tAcc = null, tCush = null, tEnd = null, tFull = null, vMax = 0, vImp = 0, vCush = 0, lastV = 0;
        const air0 = cyl.airNl();
        T.push(0); X.push(s.x * 1000); Vv.push(0); PA.push((s.pA - PATM) / 1e5); PB.push((s.pB - PATM) / 1e5);
        while (t < 6) {
          const cmd = t < tv ? 1 - V.dir : V.dir;
          if (t >= tv) {
            const inC = V.cush && (ext ? s.x > L - Lc : s.x < Lc);
            const Cex = (inC ? series(V.thr, Cn) : V.thr) * 1e-8;
            if (ext) P.CthrottleB = Cex; else P.CthrottleA = Cex;
            if (inC && tCush == null && tMove != null) { tCush = t; vCush = Math.abs(s.v); }
          }
          const vPrev = Math.abs(s.v), xPrev = s.x;
          cyl.step(h, cmd); t += h;
          const av = Math.abs(s.v);
          if (tMove == null && Math.abs(s.x - x0) > 2e-4) tMove = t;
          if (tMove != null && tAcc == null && tEnd == null && (av >= 0.92 * vss || av < lastV - 1e-6)) tAcc = t;
          vMax = Math.max(vMax, av);
          // arrival: at the stop, or halted within a few millimetres of it (a stiff cushion)
          const near = Math.abs(s.x - xEnd) < 1e-7;
          if (tEnd == null && tMove != null && (near || (Math.abs(xPrev - xEnd) < 3e-4 && vPrev > 0.02 && av < 0.3 * vPrev))) { tEnd = t; vImp = near ? vPrev : 0; }
          lastV = av;
          T.push(t); X.push(s.x * 1000); Vv.push(av); PA.push((s.pA - PATM) / 1e5); PB.push((s.pB - PATM) / 1e5);
          if (tEnd != null && tFull == null) {
            const drive = ext ? s.pA : s.pB, other = ext ? s.pB : s.pA;
            if (drive - PATM >= 0.95 * pg && other - PATM <= 0.05 * pg && Math.abs(s.x - xEnd) < 1e-4) tFull = t;
          }
          if (tFull != null && t > tFull + 0.05) break;
          if (tEnd != null && t > tEnd + 2) break;
          if (tMove == null && t > 2) break;
        }
        // stopped short in the cushion: the arrival is when the piston finally reaches the stop
        if (tEnd != null && vImp === 0) { const k = X.findIndex((xx, i) => T[i] >= tEnd && Math.abs(xx / 1000 - xEnd) < 1e-6); if (k > 0) { tEnd = T[k]; vImp = Vv[k - 1]; } }
        const ph = [];
        const add = (name, a, b, hue) => { if (a != null && b != null && b > a + 1e-9) ph.push({ name, a, b, hue }); };
        const tE = tEnd != null ? tEnd : t;
        add('valve shifts', 0, Math.min(tv, t), null);
        add('pressure build-up', tv, tMove != null ? tMove : t, 35);
        if (tMove != null) {
          const accEnd = Math.min(tAcc != null ? tAcc : tE, tCush != null ? tCush : tE, tE);
          add('acceleration', tMove, accEnd, 140);
          add('steady speed', accEnd, tCush != null ? Math.min(tCush, tE) : tE, 215);
          if (tCush != null) add('cushioning', tCush, tE, 285);
          if (tEnd != null) add('pressure to supply', tEnd, tFull != null ? tFull : t, 330);
        }
        // steady speed actually reached: mean speed over the steady phase
        const sp = ph.find(q => q.name === 'steady speed');
        let vSteady = null;
        if (sp) { const i0 = bsearch(T, sp.a), i1 = bsearch(T, sp.b); if (i1 > i0 + 2 && T[i1] > T[i0]) vSteady = Math.abs(X[i1] - X[i0]) / 1000 / (T[i1] - T[i0]); }
        return { T, X, Vv, PA, PB, ph, tStop: t, tMove, tEnd, tFull, vss, vSteady, vMax, vImp, vCush, tCush, ext, L, pg, air: cyl.airNl() - air0, mass: V.mass, bore: V.bore, cush: V.cush, stroke: V.stroke, lr: V.lr };
      }

      function report(r) {
        if (r.tMove == null) {
          ro.set('tt', 'does not move'); ro.set('td', 'load + friction exceed the force'); ro.set('vs', '—'); ro.set('vi', '—'); ro.set('ek', '—');
        } else {
          ro.set('tt', r.tEnd != null ? ms(r.tEnd) : 'more than ' + ms(r.tStop));
          ro.set('td', ms(r.tMove));
          ro.set('vs', (r.vSteady != null ? r.vSteady.toFixed(2) : '—') + ' · ' + r.vss.toFixed(2) + ' m/s');
          ro.set('vi', r.vMax.toFixed(2) + ' · ' + r.vImp.toFixed(2) + ' m/s');
          const eC = r.tCush != null ? 0.5 * r.mass * r.vCush * r.vCush : null, eI = 0.5 * r.mass * r.vImp * r.vImp;
          ro.set('ek', (eC != null ? eC.toFixed(2) + ' J' : 'no cushion') + ' · ' + eI.toFixed(eI < 0.1 ? 3 : 2) + ' J');
        }
        const lim = EALLOW[r.bore];
        ro.set('lim', lim[0] + ' J · ' + lim[1] + ' J (maker\'s data rules)');
        ro.set('full', r.tFull != null ? ms(r.tFull) : r.tEnd != null ? 'not within 2 s of arriving' : '—');
        ro.set('air', r.air.toFixed(3) + ' L');
      }

      const loop = kit.loop((dt) => {
        since += dt;
        if (dirty && (since > 0.12 || !res)) { res = simulate(); dirty = false; tAnim = 0; hold = 0; report(res); }
        const r = res;
        // replay
        if (tAnim < r.tStop) tAnim = Math.min(r.tStop, tAnim + dt * V.slow);
        else { hold += dt; if (hold > 1.2) { tAnim = 0; hold = 0; } }
        const i = bsearch(r.T, tAnim);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // ---- the cylinder
        const topH = Math.min(128, H * 0.24), len = Math.min(W * 0.5, 400), cx0 = 20 + Math.max(0, (W - len - 190) / 2), cyY = topH * 0.46;
        const pa = r.PA[i], pb = r.PB[i], pos = r.X[i] / r.stroke;
        const fillP = p => p > 0.15 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.08 + 0.42 * p / Math.max(1, r.pg / 1e5)) + ')' : null;
        const cy = S.cylinder(c, cx0, cyY, { len, h: 40, rodLen: len * 0.55, pos: clamp(pos, 0, 1), fillA: fillP(pa), fillB: fillP(pb), cushion: r.cush });
        const mw = 22 + 6 * Math.log2(1 + r.mass);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0], cyY - mw / 2, mw, mw); c.strokeRect(cy.tip[0], cyY - mw / 2, mw, mw);
        kit.label(c, r.mass.toFixed(r.mass < 10 ? 1 : 0) + ' kg', cy.tip[0] + mw / 2, cyY + mw / 2 + 10, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, pa.toFixed(1) + ' bar', cx0 + 10, cyY - 30, { size: 12, weight: 700, color: C.text });
        kit.label(c, pb.toFixed(1) + ' bar', cx0 + len - 10, cyY - 30, { size: 12, weight: 700, color: C.text, align: 'right' });
        const cur = r.ph.find(q => tAnim >= q.a && tAnim < q.b) || (tAnim >= r.tStop - 1e-9 && r.ph.length ? r.ph[r.ph.length - 1] : null);
        kit.label(c, 't = ' + (tAnim * 1000).toFixed(0) + ' ms' + (cur ? '  ·  ' + cur.name : ''), W - 12, 14, { size: 12, weight: 700, align: 'right', color: C.text });
        kit.label(c, (r.Vv[i]).toFixed(2) + ' m/s', W - 12, 32, { size: 12, align: 'right', color: C.muted });
        // ---- legend of phases with their durations
        let lx = 54, ly = topH + 6;
        c.font = '11.5px sans-serif';
        for (const q of r.ph) {
          const txt = q.name + ' ' + ms(q.b - q.a), w = c.measureText(txt).width + 26;
          if (lx + w > W - 10) { lx = 54; ly += 17; }
          c.fillStyle = q.hue == null ? C.faint : kit.hue(q.hue, 0.45); c.fillRect(lx, ly - 5, 12, 10);
          kit.label(c, txt, lx + 16, ly, { size: 11.5, color: C.text });
          lx += w;
        }
        // ---- three panels over time
        const x0 = 54, x1 = W - 12, top = ly + 14, bottom = H - 24, gap = 10, ph3 = (bottom - top - 2 * gap) / 3;
        const tr = [0, Math.max(r.tStop, 1e-3)], step = Math.max(1, Math.floor(r.T.length / 700));
        const pick3 = arr => { const out = []; for (let k = 0; k < arr.length; k += step) out.push([r.T[k], arr[k]]); out.push([r.T[r.T.length - 1], arr[arr.length - 1]]); return out; };
        const vTop = Math.max(0.05, r.vMax * 1.1), pTop = Math.max(r.pg / 1e5 + 0.5, ...[Math.max.apply(null, r.PA), Math.max.apply(null, r.PB)].map(p => p * 1.05));
        const boxes = [
          { yr: [0, r.stroke], title: 'position (mm)', series: [[pick3(r.X), C.accent]] },
          { yr: [0, vTop], title: 'speed (m/s)', series: [[pick3(r.Vv), C.ok]] },
          { yr: [0, pTop], title: 'gauge pressure (bar): cap end — rod end - -', series: [[pick3(r.PA), kit.hue(28)], [pick3(r.PB), kit.hue(265), [5, 4]]] }
        ];
        boxes.forEach((b, k) => {
          const y = top + k * (ph3 + gap);
          // phase bands behind
          const Xm = v => x0 + (v - tr[0]) / (tr[1] - tr[0]) * (x1 - x0);
          for (const q of r.ph) { c.fillStyle = q.hue == null ? (C.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)') : kit.hue(q.hue, 0.13); c.fillRect(Xm(q.a), y, Math.max(1, Xm(q.b) - Xm(q.a)), ph3); }
          const m = panel(kit, c, x0, y, x1 - x0, ph3, tr, b.yr, b.title, k === 2 ? 'time (s)' : null);
          for (const sr of b.series) trace(c, sr[0], m.X, m.Y, sr[1], 2, sr[2]);
          if (k === 1 && r.tMove != null) { c.strokeStyle = C.muted; c.setLineDash([3, 4]); c.lineWidth = 1; c.beginPath(); c.moveTo(x0, m.Y(r.vss)); c.lineTo(x1, m.Y(r.vss)); c.stroke(); c.setLineDash([]); kit.label(c, 'C·p₀/A', x1 - 4, m.Y(r.vss) - 7, { size: 10.5, color: C.muted, align: 'right' }); }
          if (k === 2) { c.strokeStyle = C.muted; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(x0, m.Y(r.pg / 1e5)); c.lineTo(x1, m.Y(r.pg / 1e5)); c.stroke(); c.setLineDash([]); kit.label(c, 'supply', x1 - 4, m.Y(r.pg / 1e5) - 7, { size: 10.5, color: C.muted, align: 'right' }); }
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(m.X(tAnim), y); c.lineTo(m.X(tAnim), y + ph3); c.stroke();
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 2. filling and emptying a volume */
  Hyper.sim('dyn-fill-empty', {
    title: 'Filling and emptying a volume',
    blurb: `A closed volume filled from the supply (or emptied to the atmosphere) through a path of sonic conductance $C$ and critical pressure ratio $b$, flowing by ISO 6358. Three models run side by side: **isothermal** (the air stays at 20 °C — slow processes), **adiabatic** (no heat exchange — very fast ones) and **real**, with heat exchanged with the walls on the thermal time constant you choose. The dotted line is the choked-phase formula.

**Try this**
- Fill 1 L through C = 1: the pressure climbs in a straight line while the flow is choked (below $b\\,p_s$), then bends over. The time constant $V/(C p_0)$ is 1 s.
- Compare the adiabatic and isothermal curves: fast filling heats the air — well over 100 °C in the adiabatic limit — so the pressure rises 1.4 times faster.
- Keep "close the valve" ticked and watch the real curve after it closes: the air cools and the pressure sags, sometimes by a bar. A tank "full" at 6 bar reads less a minute later.
- Switch to emptying: the air expands and cools far below zero; after the valve closes, the pressure creeps back up as the air warms (Clément and Desormes measured γ this way in 1819).
- Make the thermal time constant short (0.2 s) and the process slow (a large volume, a small C): the real curve joins the isothermal one.`,
    mount(box, kit, params) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 300 });
      const [g1, g2] = graphs(box, 2);
      let dirty = true, since = 1, res = null, tA = 0, hold = 0, vs = 1;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Process', options: [['Fill from the supply', 'fill'], ['Empty to the atmosphere', 'empty']], value: pick(params, 'mode', 'fill') },
        { id: 'V', label: 'Volume', min: 0.05, max: 100, value: pick(params, 'V', 1), unit: 'L', log: true, sig: 2 },
        { id: 'C', label: 'Sonic conductance C of the path', min: 0.1, max: 20, value: pick(params, 'C', 1), unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'b', label: 'Critical pressure ratio b', min: 0.1, max: 0.6, step: 0.01, value: 0.3 },
        { id: 'ps', label: 'Supply / starting pressure (gauge)', min: 1, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'tau', label: 'Heat exchange: thermal time constant', min: 0.2, max: 60, value: pick(params, 'tau', 4), unit: 's', log: true, sig: 2 },
        { id: 'close', type: 'check', label: 'Close the valve when nearly done, then keep watching', value: true },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], (id) => { if (id === 'replay') { tA = 0; hold = 0; } else { dirty = true; since = 0; } });
      const ro = kit.readout(box.side, [['tau', 'Time constant V/(C·p₀)'], ['est', 'Choked-phase formula'], ['tf', 'Time to finish (98 % full or 2 % left): isothermal · adiabatic · real'],
        ['Tpk', 'Extreme temperature: adiabatic · real'], ['after', 'Real, after the valve closes'], ['air', 'Free air moved (real)']]);
      const pP = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)' }, legend: true }, 170);
      const pT = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'air temperature (°C)' }, legend: true }, 170);
      const V = ctl.values;

      function run(kind, tEndFixed) {
        const vol = V.V / 1000, C = V.C * 1e-8, ps = V.ps * 1e5 + PATM, fill = V.mode === 'fill';
        const cv = RAIR / (GAM - 1), cp = GAM * cv;
        const mFull = ps * vol / (RAIR * TW), hA = mFull * cv / V.tau;
        let p = fill ? PATM : ps, T = TW, m = p * vol / (RAIR * T), t = 0, open = true, tClose = null, tDone = null, Text = T, moved = 0;
        const tau = vol / (C * P0), hOpen = tau / 400, out = [[0, (p - PATM) / 1e5, T - 273.15]];
        const tLimit = tEndFixed || 1e9;
        let n = 0;
        while (n++ < 60000) {
          const h = open ? hOpen : Math.max(hOpen, V.tau / 150);
          let md = 0;
          if (open) md = fill ? F.iso6358({ C, b: V.b, p1: ps, p2: p, T1: TW }).mdot : -F.iso6358({ C, b: V.b, p1: p, p2: PATM, T1: T }).mdot;
          if (kind === 'iso') { m += md * h; p = m * RAIR * TW / vol; T = TW; }
          else {
            const U = p * vol / (GAM - 1) + (md > 0 ? md * cp * TW : md * cp * T) * h;
            m = Math.max(1e-12, m + md * h);
            p = Math.max(100, U * (GAM - 1) / vol); T = p * vol / (m * RAIR);
            if (kind === 'real') { const T2 = TW + (T - TW) * Math.exp(-hA * h / (m * cv)); p *= T2 / T; T = T2; }
          }
          moved += Math.abs(md) * h;
          t += h;
          Text = fill ? Math.max(Text, T) : Math.min(Text, T);
          if (open) {
            const done = fill ? (p - PATM) >= 0.98 * (ps - PATM) : (p - PATM) <= 0.02 * (ps - PATM);
            if (done && tDone == null) tDone = t;
            if (done && V.close) { open = false; tClose = t; }
          }
          if (n % 3 === 0 || !open) out.push([t, (p - PATM) / 1e5, T - 273.15]);
          if (t >= tLimit) break;
          if (!tEndFixed) {
            if (open && t > 40 * tau) break;
            if (!open && (kind !== 'real' || t > tClose + 3 * V.tau)) break;
            if (open && !V.close && tDone != null && (kind !== 'real' ? t > tDone * 1.3 : t > tDone + 3 * V.tau)) break;
          }
        }
        return { out, tDone, tClose, Text, p, T, m, moved, t };
      }

      function compute() {
        const real = run('real');
        const tEnd = Math.max(real.t, 1e-4);
        const iso = run('iso', tEnd), adi = run('adi', tEnd);
        const vol = V.V / 1000, C = V.C * 1e-8, ps = V.ps * 1e5 + PATM, fill = V.mode === 'fill', tau = vol / (C * P0);
        // the choked-phase formula
        const est = [];
        let tc = null;
        if (fill) {
          const pc = V.b * ps;
          if (pc > PATM) { tc = vol * (pc - PATM) / (C * ps * P0); est.push([0, 0], [tc, (pc - PATM) / 1e5]); }
        } else {
          const pc = PATM / V.b;
          if (ps > pc) { tc = tau * Math.log(ps / pc); for (let k = 0; k <= 30; k++) { const tt = tc * k / 30; est.push([tt, (ps * Math.exp(-tt / tau) - PATM) / 1e5]); } }
        }
        return { real, iso, adi, tEnd, est, tc, tau, fill, ps };
      }

      function report(r) {
        ro.set('tau', ms(r.tau));
        ro.set('est', r.tc != null ? (r.fill ? 'choked until b·p_s: ' : 'choked down to p_atm/b: ') + ms(r.tc) : 'never choked at these pressures');
        const f = x => x.tDone != null ? ms(x.tDone) : '—';
        ro.set('tf', f(r.iso) + ' · ' + f(r.adi) + ' · ' + f(r.real));
        ro.set('Tpk', (r.adi.Text - 273.15).toFixed(0) + ' · ' + (r.real.Text - 273.15).toFixed(0) + ' °C');
        ro.set('after', V.close && r.real.tClose != null ? 'settles at ' + ((r.real.p - PATM) / 1e5).toFixed(2) + ' bar' : 'valve left open');
        ro.set('air', (r.real.moved / F.RHO_ANR * 1000).toFixed(r.real.moved / F.RHO_ANR * 1000 < 10 ? 2 : 1) + ' L ANR');
        const pcl = r.fill ? V.b * r.ps - PATM : PATM / V.b - PATM;
        pP.set({
          series: [{ pts: r.iso.out, label: 'isothermal', dash: [6, 4] }, { pts: r.adi.out, label: 'adiabatic', dash: [2, 3] }, { pts: r.real.out, label: 'real' }, { pts: r.est, label: 'choked formula', dash: [1, 4], color: kit.colors().muted }],
          x: { label: 'time (s)', min: 0, max: r.tEnd }, y: { label: 'gauge pressure (bar)', min: 0, max: V.ps * 1.05 },
          hlines: pcl > 0 && pcl < V.ps ? [{ y: pcl / 1e5, label: r.fill ? 'choked below' : 'choked above' }] : []
        });
        pT.set({ series: [{ pts: r.iso.out.map(q => [q[0], q[2]]), label: 'isothermal', dash: [6, 4] }, { pts: r.adi.out.map(q => [q[0], q[2]]), label: 'adiabatic', dash: [2, 3] }, { pts: r.real.out.map(q => [q[0], q[2]]), label: 'real' }],
          x: { label: 'time (s)', min: 0, max: r.tEnd }, y: { label: 'air temperature (°C)' } });
      }

      const loop = kit.loop((dt) => {
        since += dt;
        if (dirty && (since > 0.12 || !res)) { res = compute(); dirty = false; tA = 0; hold = 0; vs = res.tEnd / 6; report(res); }
        const r = res;
        if (tA < r.tEnd) tA = Math.min(r.tEnd, tA + dt * vs); else { hold += dt; if (hold > 1.5) { tA = 0; hold = 0; } }
        const o = r.real.out, k = bsearch(o.map(q => q[0]), tA), q = o[Math.min(k, o.length - 1)];
        const pg = q[1], TC = q[2], open = r.real.tClose == null || tA < r.real.tClose;
        // ---- the circuit on a 760 × 260 design grid
        const c = st.begin(), C = kit.colors(), sc = Math.min(st.W / 760, st.H / 260);
        c.save(); c.translate((st.W - 760 * sc) / 2, (st.H - 260 * sc) / 2); c.scale(sc, sc);
        const fill = r.fill, vx = 250, vy = 150;
        const pr = clamp(pg / Math.max(0.1, V.ps), 0, 1);
        // vessel
        const bx = fill ? 400 : 60, bw = 260, by = 50, bh = 150;
        c.fillStyle = (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + (0.06 + 0.4 * pr) + ')';
        c.beginPath(); c.roundRect ? c.roundRect(bx, by, bw, bh, 40) : c.rect(bx, by, bw, bh); c.fill();
        c.fillStyle = tempFill(kit, TC); c.beginPath(); c.roundRect ? c.roundRect(bx, by, bw, bh, 40) : c.rect(bx, by, bw, bh); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.roundRect ? c.roundRect(bx, by, bw, bh, 40) : c.rect(bx, by, bw, bh); c.stroke();
        kit.label(c, V.V.toPrecision(2) + ' L', bx + bw / 2, by + 26, { size: 13, color: C.muted, align: 'center' });
        kit.label(c, pg.toFixed(2) + ' bar', bx + bw / 2, by + 62, { size: 20, weight: 700, color: C.text, align: 'center' });
        kit.label(c, TC.toFixed(0) + ' °C', bx + bw / 2, by + 96, { size: 18, weight: 700, color: TC > 25 ? C.bad : TC < 15 ? C.accent : C.text, align: 'center' });
        kit.label(c, 't = ' + ms(tA) + (open ? '' : ' · valve closed'), bx + bw / 2, by + 126, { size: 12, color: C.muted, align: 'center' });
        // the 2/2 valve, ports vertical
        const vst = open ? 0 : 1;
        const v22 = S.valve(c, vx, vy, { spec: '2/2 NC', state: vst, left: 'solenoid', right: 'spring', s: 34, pneumatic: true, labels: true });
        const vesselPort = fill ? [bx, by + bh / 2] : [bx + bw, by + bh / 2];
        const stIn = fill ? 'air' : (pg > 0.2 ? 'air' : 'idle');
        if (fill) {
          const src = S.source(c, vx, 236, { pneumatic: true });
          S.line(c, [src.P, v22.P], { state: 'air' });
          const lineV = [v22.A, [vx, 40], [370, 40], [370, by + bh / 2], vesselPort];
          S.line(c, lineV, { state: open ? 'air' : stIn });
          if (open) { const ph = tA * 90 / Math.max(vs, 1e-3) * 0.05; S.flow(c, [src.P, v22.P], ph, { color: S.col('air') }); S.flow(c, lineV, ph, { color: S.col('air') }); }
          kit.label(c, 'supply ' + V.ps.toFixed(1) + ' bar', vx + 16, 236, { size: 12, color: C.muted });
        } else {
          const lineV = [vesselPort, [370, by + bh / 2], [370, 236], [vx, 236], v22.P];
          S.line(c, lineV, { state: pg > 0.2 ? 'air' : 'idle' });
          S.line(c, [v22.A, [vx, 44]], { state: open ? 'exhaust' : 'idle' });
          S.exhaust(c, vx, 44, { silencer: true, rot: 180 });
          if (open && pg > 0.02) { const ph = tA * 90 / Math.max(vs, 1e-3) * 0.05; S.flow(c, lineV, ph, { color: S.col('exhaust') }); S.flow(c, [v22.A, [vx, 44]], ph, { color: S.col('exhaust') }); }
          kit.label(c, 'to atmosphere', vx + 16, 28, { size: 12, color: C.muted });
        }
        kit.label(c, 'C = ' + fmtC(V.C) + ' dm³/(s·bar), b = ' + V.b.toFixed(2), vx - 40, 100, { size: 11.5, color: C.muted, align: 'right' });
        c.restore();
        if (loop.tick === undefined) loop.tick = 0;
        loop.tick++;
        if (loop.tick % 4 === 0) { pP.set({ vlines: [{ x: tA }] }); pT.set({ vlines: [{ x: tA }] }); }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 3. air as a spring */
  Hyper.sim('dyn-air-spring', {
    title: 'A load bouncing on air',
    blurb: `A cylinder stopped in mid-stroke by a 5/3 closed-centre valve: both ports are blocked, so the air in each chamber is trapped, and the moving load sits on two springs of air in parallel, each of stiffness $k = n\\,p\\,A^2/V$. The engine's cylinder model is run with the valve closed (the air is compressed and expanded adiabatically, $n = 1.4$); seal friction slowly damps the motion.

**Try this**
- Press "Close both ports here": the chambers are both at supply pressure, but the piston area is larger than the annulus, so the load lurches and oscillates about a new balance a few millimetres further out.
- Compare the measured frequency with the formula. Move the stopping position towards either end: one chamber gets tiny and very stiff, so the frequency rises — the softest point is near mid-stroke.
- Raise the mass tenfold: the frequency falls by √10. A 20 kg load on a 32 mm cylinder bounces at a few hertz: that is why air cannot hold a position against a disturbance.
- Lower the pressure: the springs get softer in proportion to the absolute pressure.
- Knock the load and watch it ring; with standard seals friction stops it quickly, often a little away from where it started.`,
    mount(box, kit, params) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 320 });
      const [g1, g2] = graphs(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'bore', type: 'select', label: 'Cylinder', options: boreOptions(), value: pick(params, 'bore', 32) },
        { id: 'stroke', label: 'Stroke', min: 50, max: 500, step: 10, value: 200, unit: 'mm' },
        { id: 'pos', label: 'Stopping position', min: 5, max: 95, step: 1, value: pick(params, 'pos', 50), unit: '% of stroke' },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 1, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'mass', label: 'Moving mass', min: 0.2, max: 100, value: pick(params, 'mass', 2), unit: 'kg', log: true, sig: 2 },
        { id: 'seal', type: 'select', label: 'Seal friction', options: [['Very low (well lubricated)', 0], ['Low-friction seals', 1], ['Standard seals', 2]], value: 0 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Slow motion 1/10', 0.1], ['Slow motion ¼', 0.25], ['Real time', 1]], value: 0.1 },
        { type: 'buttons', items: [{ id: 'stop', label: 'Close both ports here', primary: true }, { id: 'kick', label: 'Knock the load (+0.2 m/s)' }] }
      ], (id) => { if (id === 'kick') { if (cyl) cyl.state.v += 0.2; } else if (id !== 'slow') reset(); });
      const ro = kit.readout(box.side, [['k', 'Stiffness at the balance: cap side + rod side'], ['kt', 'Total stiffness'], ['f', 'Natural frequency: formula · measured'], ['off', 'Shift to the balance (area difference)'], ['amp', 'Amplitude now']]);
      const pX = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)' } }, 160);
      const pF = kit.plot(g2, { x: { label: 'stopping position (% of stroke)', min: 0, max: 100 }, y: { label: 'natural frequency (Hz)', min: 0 }, legend: true }, 160);
      const V = ctl.values;
      let cyl = null, hist = [], zc = [], fMeas = null, tPlot = 0, prevV = 0, theo = null;
      // the balance after the ports close with both chambers at supply: the trapped air is squeezed adiabatically
      // until the forces balance; the springs are evaluated there (k = n p A²/V for each chamber)
      function balance(x0, ps, n, c0) {
        const VA0 = c0.dead + c0.AA * x0, VB0 = c0.dead + c0.AB * (c0.L - x0);
        const at = x => { const VA = c0.dead + c0.AA * x, VB = c0.dead + c0.AB * (c0.L - x), pA = ps * Math.pow(VA0 / VA, n), pB = ps * Math.pow(VB0 / VB, n);
          return { x, pA, pB, VA, VB, Fn: pA * c0.AA - pB * c0.AB - PATM * (c0.AA - c0.AB) }; };
        let lo = x0, hi = c0.L;
        if (at(hi).Fn > 0) return at(hi);
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (at(m).Fn > 0) lo = m; else hi = m; }
        const e = at((lo + hi) / 2);
        e.kA = n * e.pA * c0.AA * c0.AA / e.VA; e.kB = n * e.pB * c0.AB * c0.AB / e.VB;
        return e;
      }
      function reset() {
        const D = V.bore / 1000, d = BORES[V.bore] / 1000, L = V.stroke / 1000, ps = V.ps * 1e5 + PATM, AA = Math.PI * D * D / 4;
        const fr = [[1, 3], [3 + 0.01 * V.ps * 1e5 * AA, 15], [8 + 0.03 * V.ps * 1e5 * AA, 40]][V.seal];
        const dead = 2e-6 + Math.PI * Math.pow(TUBE_BORE(V.bore) / 1000, 2) / 4 * 0.3;
        cyl = F.pneuCylinder({ bore: D, rod: d, stroke: L, mass: V.mass, psupply: ps, patm: PATM, Cvalve: 0, CthrottleA: 1e-8, CthrottleB: 1e-8, dead, fc: fr[0], fv: fr[1] });
        const s = cyl.state; s.x = V.pos / 100 * L; s.v = 0; s.pA = ps; s.pB = ps;
        hist = []; zc = []; fMeas = null; prevV = 0;
        const c0 = { AA: cyl.AA, AB: cyl.AB, L, dead };
        const e = balance(s.x, ps, GAM, c0), kt = (e.kA || 0) + (e.kB || 0);
        theo = { kt, f: Math.sqrt(kt / V.mass) / (2 * Math.PI), off: e.x - s.x, c0, ps };
        ro.set('k', ((e.kA || 0) / 1000).toFixed(2) + ' + ' + ((e.kB || 0) / 1000).toFixed(2) + ' N/mm');
        ro.set('kt', (kt / 1000).toFixed(2) + ' N/mm');
        ro.set('off', (theo.off * 1000).toFixed(2) + ' mm (area force ' + ((ps - PATM) * (cyl.AA - cyl.AB)).toFixed(0) + ' N)');
        // frequency against stopping position, fast (n = 1.4) and slow (n = 1) disturbances
        const curve = n => { const out = []; for (let k = 2; k <= 98; k += 2) { const z = balance(k / 100 * L, ps, n, c0); if (z.kA) out.push([k, Math.sqrt((z.kA + z.kB) / V.mass) / (2 * Math.PI)]); } return out; };
        pF.set({ series: [{ pts: curve(GAM), label: 'fast (n = 1.4)' }, { pts: curve(1), label: 'slow (n = 1)', dash: [5, 4] }], marks: [{ x: V.pos, y: theo.f, label: theo.f.toFixed(1) + ' Hz' }] });
      }
      reset();
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow, s = cyl.state;
        const n = Math.max(1, Math.round(sdt / 2e-5));
        for (let k = 0; k < n; k++) {
          cyl.step(sdt / n, 1);
          // turning points (the speed changes sign) are half a period apart
          if (prevV * s.v < 0) { zc.push(s.t); if (zc.length > 7) zc.shift(); if (zc.length >= 2) fMeas = (zc.length - 1) / (2 * (zc[zc.length - 1] - zc[0])); }
          prevV = s.v;
        }
        hist.push([s.t, s.x * 1000]);
        while (hist.length && hist[0][0] < s.t - 1.0) hist.shift();
        let lo = Infinity, hi = -Infinity; for (const q of hist) { lo = Math.min(lo, q[1]); hi = Math.max(hi, q[1]); }
        ro.set('f', theo.f.toFixed(2) + ' · ' + (fMeas ? fMeas.toFixed(2) + ' Hz' : '—'));
        ro.set('amp', hist.length ? ((hi - lo) / 2).toFixed(2) + ' mm' : '—');
        tPlot += dt;
        if (tPlot > 0.05) { tPlot = 0; const mid = (hi + lo) / 2, span = Math.max(1, (hi - lo) * 0.7); pX.set({ series: [{ pts: hist.filter((q, i) => i % 2 === 0) }], x: { label: 'time (s)', min: Math.max(0, s.t - 1), max: Math.max(1, s.t) }, y: { label: 'position (mm)', min: mid - span, max: mid + span } }); }
        // ---- drawing on a 760 × 300 design grid
        const c = st.begin(), C = kit.colors(), sc = Math.min(st.W / 760, st.H / 300);
        c.save(); c.translate((st.W - 760 * sc) / 2, (st.H - 300 * sc) / 2); c.scale(sc, sc);
        const len = 360, x0 = 170, y0 = 80, hC = 60, pos = s.x / cyl.params.stroke;
        const fill = p => (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + clamp(0.1 + 0.35 * (p - PATM) / Math.max(1e5, V.ps * 1e5), 0.08, 0.6) + ')';
        const cy = S.cylinder(c, x0, y0, { len, h: hC, rodLen: 150, pos, fillA: fill(s.pA), fillB: fill(s.pB) });
        // the air drawn as two springs
        const px = x0 + 4 + clamp(pos, 0, 1) * (len - 8 - 7);
        const zig = (xa, xb, col) => {
          c.strokeStyle = col; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xa, y0);
          const nz = 9, L2 = xb - xa;
          for (let i = 1; i < nz * 2; i++) c.lineTo(xa + L2 * i / (nz * 2), y0 + (i % 2 ? -1 : 1) * hC * 0.28);
          c.lineTo(xb, y0); c.stroke();
        };
        zig(x0 + 4, px - 2, kit.hue(28)); zig(px + 9, x0 + len - 4, kit.hue(265));
        const mw = 30 + 6 * Math.log2(1 + V.mass);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0], y0 - mw / 2, mw, mw); c.strokeRect(cy.tip[0], y0 - mw / 2, mw, mw);
        kit.label(c, V.mass.toPrecision(2) + ' kg', cy.tip[0] + mw / 2, y0 + mw / 2 + 11, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, ((s.pA - PATM) / 1e5).toFixed(2) + ' bar', x0 + 8, y0 - hC / 2 - 12, { size: 12, weight: 700, color: C.text });
        kit.label(c, ((s.pB - PATM) / 1e5).toFixed(2) + ' bar', x0 + len - 8, y0 - hC / 2 - 12, { size: 12, weight: 700, color: C.text, align: 'right' });
        // 5/3 closed centre valve holding both ports
        const v = S.valve(c, 350, 235, { spec: '5/3 closed', state: 1, left: 'spring+solenoid', right: 'spring+solenoid', s: 32, pneumatic: true, labels: true, exhaust: 'silencer' });
        S.line(c, [cy.A, [cy.A[0], 170], [v.B[0], 170], v.B], { state: 'air' });
        S.line(c, [cy.B, [cy.B[0], 185], [v.A[0], 185], v.A], { state: 'air' });
        const src = S.source(c, 350, 290, { pneumatic: true });
        S.line(c, [src.P, v.P], { state: 'air' });
        kit.label(c, 'both ports blocked: the air is trapped', 470, 235, { size: 12, color: C.muted });
        kit.label(c, 'x = ' + (s.x * 1000).toFixed(1) + ' mm', 740, 20, { size: 12, color: C.text, align: 'right', weight: 700 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 4. temperatures in the chambers */
  // a double-acting cylinder with a 5/2 valve and meter-out throttles, like kit.fluid.pneuCylinder, but carrying
  // the mass and internal energy of each chamber, with enthalpy flows at the right temperatures and heat exchange with the walls
  function thermoCylinder(F, o) {
    const P = Object.assign({ bore: 0.032, rod: 0.012, stroke: 0.2, mass: 2, load: 0, psupply: 6e5 + PATM, patm: PATM, Cvalve: 1.2e-8, bvalve: 0.3,
      CthrottleA: 1e-8, CthrottleB: 1e-8, dead: 1e-5, tubeD: 0.004, tubeArea: 0.006, fc: 20, fv: 50, hc: 60, hScale: 1, Tw: TW, Ts: TW }, o || {});
    const AA = Math.PI * P.bore * P.bore / 4, AB = AA - Math.PI * P.rod * P.rod / 4, cv = RAIR / (GAM - 1), cp = GAM * cv;
    const s = { x: 0, v: 0, mA: 0, mB: 0, UA: 0, UB: 0, pA: 0, pB: 0, TA: TW, TB: TW, t: 0, air: 0, exhT: null };
    const vols = () => [P.dead + AA * s.x, P.dead + AB * (P.stroke - s.x)];
    function set(x, pA, pB, TA, TB) {
      s.x = x; s.v = 0;
      const [VA, VB] = vols();
      s.mA = pA * VA / (RAIR * TA); s.mB = pB * VB / (RAIR * TB); s.UA = pA * VA / (GAM - 1); s.UB = pB * VB / (GAM - 1);
      s.pA = pA; s.pB = pB; s.TA = TA; s.TB = TB;
    }
    function step(dt, cmd) {
      const n = Math.max(1, Math.ceil(dt / 1e-5)), h = dt / n;
      let exh = null;
      for (let k = 0; k < n; k++) {
        const [VA, VB] = vols();
        const pA = (GAM - 1) * s.UA / VA, pB = (GAM - 1) * s.UB / VB, TA = pA * VA / (s.mA * RAIR), TB = pB * VB / (s.mB * RAIR);
        let qA, qB;
        if (cmd) {
          qA = F.iso6358({ C: P.Cvalve, b: P.bvalve, p1: P.psupply, p2: pA, T1: P.Ts }).mdot;
          qB = -F.iso6358({ C: series(P.Cvalve, P.CthrottleB), b: P.bvalve, p1: pB, p2: P.patm, T1: TB }).mdot;
          if (qB < -1e-6) exh = TB;
        } else {
          qB = F.iso6358({ C: P.Cvalve, b: P.bvalve, p1: P.psupply, p2: pB, T1: P.Ts }).mdot;
          qA = -F.iso6358({ C: series(P.Cvalve, P.CthrottleA), b: P.bvalve, p1: pA, p2: P.patm, T1: TA }).mdot;
          if (qA < -1e-6) exh = TA;
        }
        // heat exchange: the barrel and piston faces at hc; the tube walls by turbulent forced convection (Dittus–Boelter)
        const hTube = q => { const Re = 4 * Math.abs(q) / (Math.PI * P.tubeD * 1.81e-5); return (Re > 3000 ? 0.0203 * Math.pow(Re, 0.8) : 3.66) * 0.026 / P.tubeD; };
        const hAA = P.hScale * (P.hc * (Math.PI * P.bore * s.x + 2 * AA) + hTube(qA) * P.tubeArea);
        const hAB = P.hScale * (P.hc * (Math.PI * P.bore * (P.stroke - s.x) + 2 * AB) + hTube(qB) * P.tubeArea);
        const eA = (qA > 0 ? qA * cp * P.Ts : qA * cp * TA) + hAA * (P.Tw - TA) - pA * AA * s.v;
        const eB = (qB > 0 ? qB * cp * P.Ts : qB * cp * TB) + hAB * (P.Tw - TB) + pB * AB * s.v;
        const Fp = pA * AA - pB * AB - P.patm * (AA - AB) - P.load;
        let a;
        if (Math.abs(s.v) < 1e-4 && Math.abs(Fp) <= P.fc) { a = 0; s.v = 0; } else a = (Fp - Math.sign(s.v || Fp) * P.fc - P.fv * s.v) / P.mass;
        s.v += a * h; s.x += s.v * h;
        if (s.x <= 0) { s.x = 0; if (s.v < 0) s.v = 0; }
        if (s.x >= P.stroke) { s.x = P.stroke; if (s.v > 0) s.v = 0; }
        s.UA = Math.max(1e-6, s.UA + eA * h); s.UB = Math.max(1e-6, s.UB + eB * h);
        s.mA = Math.max(1e-10, s.mA + qA * h); s.mB = Math.max(1e-10, s.mB + qB * h);
        if (qA > 0) s.air += qA * h; if (qB > 0) s.air += qB * h;
        s.t += h;
      }
      const [VA, VB] = vols();
      s.pA = (GAM - 1) * s.UA / VA; s.pB = (GAM - 1) * s.UB / VB; s.TA = s.pA * VA / (s.mA * RAIR); s.TB = s.pB * VB / (s.mB * RAIR);
      s.exhT = exh;
      return s;
    }
    return { state: s, step, set, AA, AB, params: P, airNl: () => s.air / F.RHO_ANR * 1000 };
  }

  Hyper.sim('dyn-chamber-temp', {
    title: 'Hot and cold chambers',
    blurb: `A cylinder cycling back and forth, with a model that follows the mass and energy of the air in each chamber: air arrives at 20 °C but is compressed further by the air behind it, air leaves carrying the chamber's own temperature, the moving piston does work on one side and receives it from the other, and the walls exchange heat. Chambers are drawn **red** when hot and **blue** when cold.

**Try this**
- Watch the exhausting chamber: as it blows down, the air left inside expands and cools, often by 30–60 K. The air rushing out through the silencer is that cold, and colder still in the jet.
- Set the heat exchange to zero (adiabatic): the exhaust temperature plunges towards the isentropic limit — about −105 °C from 7 bar absolute to 1.
- Choose undried air: its dew point after expansion is above the exhaust temperature, so water condenses and freezes in the silencer. With a desiccant dryer it cannot.
- Raise the cycle rate: the walls cannot keep up, and the temperature swings stay large.
- Look at the filling chamber: at the start of a stroke the small dead volume fills fastest and heats most.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250, maxH: 340 });
      const [g1, g2] = graphs(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'ps', label: 'Supply pressure (gauge)', min: 2, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'bore', type: 'select', label: 'Cylinder', options: boreOptions(), value: 32 },
        { id: 'stroke', label: 'Stroke', min: 25, max: 400, step: 5, value: 150, unit: 'mm' },
        { id: 'cv', label: 'Valve sonic conductance C', min: 0.2, max: 5, value: 1.2, unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'thr', label: 'Meter-out throttles C', min: 0.1, max: 5, value: 1.5, unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'hs', label: 'Heat exchange with barrel and tubes (typical = 100 %)', min: 0, max: 300, step: 5, value: 100, unit: '%' },
        { id: 'dwell', label: 'Pause at each end', min: 0.05, max: 3, value: 0.3, unit: 's', log: true, sig: 2 },
        { id: 'pdp', type: 'select', label: 'Supply air', options: [['Undried: pressure dew point +25 °C', 25], ['Refrigerated dryer: +3 °C', 3], ['Desiccant dryer: −40 °C', -40]], value: 3 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id) => { if (id === 'bore' || id === 'stroke') build(); });
      const ro = kit.readout(box.side, [['T', 'Now: cap end · rod end'], ['rng', 'Range, last cycles: cap · rod'], ['ex', 'Coldest exhaust air (last cycle)'], ['dp', 'Dew point of the exhaust air (at 1 atm)'], ['ice', 'Moisture'], ['air', 'Free air per cycle']]);
      const pT = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'chamber temperature (°C)' }, legend: true }, 160);
      const pP = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 160);
      const V = ctl.values;
      let cyl, s0;
      function build() {
        const D = V.bore / 1000, d = BORES[V.bore] / 1000, L = V.stroke / 1000, ps = V.ps * 1e5 + PATM;
        const tb = TUBE_BORE(V.bore) / 1000;
        // half a metre of tube each side: its volume is dead volume, and its large wall area exchanges heat
        cyl = thermoCylinder(F, { bore: D, rod: d, stroke: L, mass: 2, psupply: ps, dead: 2e-6 + Math.PI * tb * tb / 4 * 0.5, tubeD: tb, tubeArea: Math.PI * tb * 0.5 });
        cyl.set(0, PATM, ps, TW, TW);
        s0 = { cmd: 1, wait: 0, hist: [], tPlot: 0, exMin: TW, exMinLast: null, rngA: [TW, TW], rngB: [TW, TW], airAt: cyl.airNl(), cycleAir: null };
      }
      build();
      const loop = kit.loop((dt) => {
        const P = cyl.params, s = cyl.state;
        P.psupply = V.ps * 1e5 + PATM; P.Cvalve = V.cv * 1e-8; P.CthrottleA = P.CthrottleB = V.thr * 1e-8; P.hScale = V.hs / 100;
        P.fc = 8 + 0.03 * V.ps * 1e5 * cyl.AA;
        const sdt = Math.min(dt, 0.05) * V.slow;
        const atEnd = s0.cmd === 1 ? s.x >= P.stroke - 1e-6 : s.x <= 1e-6;
        const settled = atEnd && Math.abs((s0.cmd === 1 ? s.pA : s.pB) - P.psupply) < 0.1e5;
        if (settled) { s0.wait += sdt; if (s0.wait > V.dwell) { s0.cmd = 1 - s0.cmd; s0.wait = 0; if (s0.cmd === 1) { s0.cycleAir = cyl.airNl() - s0.airAt; s0.airAt = cyl.airNl(); s0.exMinLast = s0.exMin; s0.exMin = TW; } } }
        else s0.wait = 0;
        cyl.step(sdt, s0.cmd);
        if (s.exhT != null) s0.exMin = Math.min(s0.exMin, s.exhT);
        const TA = s.TA - 273.15, TB = s.TB - 273.15;
        s0.hist.push([s.t, TA, TB, (s.pA - PATM) / 1e5, (s.pB - PATM) / 1e5]);
        while (s0.hist.length && s0.hist[0][0] < s.t - 6) s0.hist.shift();
        let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
        for (const q of s0.hist) { a0 = Math.min(a0, q[1]); a1 = Math.max(a1, q[1]); b0 = Math.min(b0, q[2]); b1 = Math.max(b1, q[2]); }
        const exT = (s0.exMinLast != null ? Math.min(s0.exMinLast, s0.exMin) : s0.exMin) - 273.15;
        const dewAtm = F.dewPoint(V.pdp, PATM / P.psupply);
        ro.set('T', TA.toFixed(0) + ' · ' + TB.toFixed(0) + ' °C');
        ro.set('rng', a0.toFixed(0) + '…' + a1.toFixed(0) + ' · ' + b0.toFixed(0) + '…' + b1.toFixed(0) + ' °C');
        ro.set('ex', exT.toFixed(0) + ' °C (' + (0.833 * (exT + 273.15) - 273.15).toFixed(0) + ' °C in the sonic jet)');
        ro.set('dp', dewAtm.toFixed(0) + ' °C');
        const ice = exT < dewAtm;
        ro.set('ice', ice ? (exT < 0 ? 'ice forms in the exhaust and silencer' : 'water condenses in the exhaust') : 'stays dry');
        ro.set('air', s0.cycleAir != null ? s0.cycleAir.toFixed(3) + ' L' : 'after the first cycle');
        s0.tPlot += dt;
        if (s0.tPlot > 0.08) {
          s0.tPlot = 0;
          const hh = s0.hist.filter((q, i) => i % 2 === 0);
          pT.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'cap end', color: kit.hue(28) }, { pts: hh.map(q => [q[0], q[2]]), label: 'rod end', color: kit.hue(265), dash: [5, 4] }], hlines: [{ y: dewAtm, label: 'exhaust dew point' }] });
          pP.set({ series: [{ pts: hh.map(q => [q[0], q[3]]), label: 'cap end', color: kit.hue(28) }, { pts: hh.map(q => [q[0], q[4]]), label: 'rod end', color: kit.hue(265), dash: [5, 4] }], y: { label: 'gauge pressure (bar)', min: 0, max: V.ps + 1 } });
        }
        // ---- drawing on a 760 × 330 design grid
        const c = st.begin(), C = kit.colors(), sc = Math.min(st.W / 760, st.H / 330);
        c.save(); c.translate((st.W - 760 * sc) / 2, (st.H - 330 * sc) / 2); c.scale(sc, sc);
        const ext = s0.cmd === 1, exA = !ext, exB = ext;
        const cy = S.cylinder(c, 220, 80, { len: 320, h: 48, rodLen: 160, pos: s.x / P.stroke, fillA: tempFill(kit, TA), fillB: tempFill(kit, TB), cushion: true });
        kit.label(c, TA.toFixed(0) + ' °C', 232, 40, { size: 15, weight: 700, color: TA > 25 ? C.bad : TA < 15 ? C.accent : C.text });
        kit.label(c, TB.toFixed(0) + ' °C', 528, 40, { size: 15, weight: 700, color: TB > 25 ? C.bad : TB < 15 ? C.accent : C.text, align: 'right' });
        const stA = exA ? ((s.pA - PATM) > 0.2e5 ? 'exhaust' : 'idle') : 'air', stB = exB ? ((s.pB - PATM) > 0.2e5 ? 'exhaust' : 'idle') : 'air';
        const v = S.valve(c, 380, 248, { spec: '5/2', state: ext ? 0 : 1, left: 'solenoid', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        S.line(c, [cy.A, [cy.A[0], 112]], { state: stA }); S.flowControl(c, cy.A[0], 140, { free: 'up' });
        S.line(c, [[cy.A[0], 168], [cy.A[0], 196], [v.B[0], 196], v.B], { state: stA });
        S.line(c, [cy.B, [cy.B[0], 112]], { state: stB }); S.flowControl(c, cy.B[0], 140, { free: 'up' });
        S.line(c, [[cy.B[0], 168], [cy.B[0], 206], [v.A[0], 206], v.A], { state: stB });
        const src = S.source(c, 300, 318, { pneumatic: true });
        S.line(c, [src.P, [300, 298], [380, 298], v.P], { state: 'air' });
        kit.label(c, V.ps.toFixed(1) + ' bar', 316, 318, { size: 11, color: C.muted });
        // the exhausting silencer: cold air, ice when it is below the dew point
        const exPort = ext ? v.R : v.S;
        const exNow = s.exhT != null ? s.exhT - 273.15 : null;
        if (exNow != null) {
          kit.label(c, exNow.toFixed(0) + ' °C', exPort[0] + (ext ? 14 : -14), exPort[1] + 26, { size: 12, weight: 700, color: exNow < 0 ? C.accent : C.text, align: ext ? 'left' : 'right' });
          if (exNow < dewAtm && exNow < 0) {
            c.strokeStyle = C.accent; c.lineWidth = 1.3;
            for (let k = 0; k < 3; k++) { const fx = exPort[0] - 8 + k * 8, fy = exPort[1] + 24 + (k % 2) * 6; for (let a = 0; a < 3; a++) { const an = a * Math.PI / 3; c.beginPath(); c.moveTo(fx - 3.5 * Math.cos(an), fy - 3.5 * Math.sin(an)); c.lineTo(fx + 3.5 * Math.cos(an), fy + 3.5 * Math.sin(an)); c.stroke(); } }
          }
        }
        kit.label(c, 't = ' + s.t.toFixed(2) + ' s', 740, 318, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 5. tube length and dead volume */
  Hyper.sim('dyn-tubing', {
    title: 'The valve at the cylinder, or metres away',
    blurb: `Two identical cylinders, valves and loads. One valve sits on the cylinder (15 cm of tube); the other is further away. The tube adds two things: **volume** that must be filled and thrown away every stroke, and **resistance** in series with the valve ($1/C^2 = 1/C_\\text{valve}^2 + 1/C_\\text{tube}^2$). The tube's conductance comes from its friction factor (worked out by the engine from the Reynolds number) and its length; both drives are then run by the engine's cylinder model.

**Try this**
- Move the distant valve to 3 m on a 32 mm cylinder with 6 mm tube (4 mm bore): the strokes slow and the air per cycle grows.
- Shorten the stroke to 25 mm: now the tubes may use as much air as the cylinder itself.
- Change to 8 mm tube: the resistance falls a lot, but the dead volume nearly doubles.
- Put a small cylinder (16 mm) on 5 m of tube: its dead time — the wait for the pressure to change — dominates the stroke.
- Look at the tube's conductance: a few metres of thin tube can have less capacity than the valve feeding it.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 360 });
      const [g1] = graphs(box, 1);
      let dirty = true, since = 1, res = null, tA = 0, hold = 0;
      const ctl = kit.controls(box.side, [
        { id: 'bore', type: 'select', label: 'Cylinder', options: boreOptions(), value: 32 },
        { id: 'stroke', label: 'Stroke', min: 10, max: 300, step: 5, value: 50, unit: 'mm' },
        { id: 'L', label: 'Distance to the far valve (tube length, each side)', min: 0.2, max: 10, value: 3, unit: 'm', log: true, sig: 2 },
        { id: 'td', type: 'select', label: 'Tube', options: [['4 mm (2.5 mm bore)', 2.5], ['6 mm (4 mm bore)', 4], ['8 mm (5.5 mm bore)', 5.5], ['10 mm (7.5 mm bore)', 7.5], ['12 mm (9 mm bore)', 9]], value: 4 },
        { id: 'cv', label: 'Valve sonic conductance C', min: 0.2, max: 5, value: 1.0, unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'mass', label: 'Moving mass', min: 0.2, max: 20, value: 1, unit: 'kg', log: true, sig: 2 },
        { id: 'slow', type: 'select', label: 'Replay', options: [['Real time', 1], ['Slow motion ¼', 0.25]], value: 1 }
      ], (id) => { if (id !== 'slow') { dirty = true; since = 0; } });
      const ro = kit.readout(box.side, [['ct', 'Tube conductance (near · far)'], ['cp', 'Valve + tube in series (near · far)'], ['dv', 'Tube volume per side (near · far)'],
        ['te', 'Extend: dead time · stroke time (near · far)'], ['tr', 'Retract: stroke time (near · far)'], ['air', 'Free air per cycle (near · far)'], ['share', 'Extra air for the longer tubes']]);
      const pX = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0 }, legend: true }, 170);
      const V = ctl.values;
      function drive(Lt) {
        const D = V.bore / 1000, d = BORES[V.bore] / 1000, L = V.stroke / 1000, pg = V.ps * 1e5, ps = pg + PATM, AA = Math.PI * D * D / 4;
        const dt = V.td / 1000, Cv = V.cv * 1e-8;
        const tube = tubeC(F, dt, Lt, Cv * ps * F.RHO_ANR * 0.7);
        const Cp = series(Cv, tube.C), b = bSeries(0.3, Cv, tube.C);
        const cyl = F.pneuCylinder({ bore: D, rod: d, stroke: L, mass: V.mass, psupply: ps, patm: PATM, Cvalve: Cp, bvalve: b, CthrottleA: 1e-6, CthrottleB: 1e-6,
          dead: 2e-6 + tube.V, load: 0, fc: 8 + 0.03 * pg * AA, fv: 60 });
        const s = cyl.state; s.x = 0; s.pA = PATM; s.pB = ps;
        const T = [], X = [], h = 5e-4;
        let t = 0, cmd = 1, tMove = null, tExt = null, tRet = null, tSwitch = null, wait = 0;
        const a0 = cyl.airNl();
        while (t < 12) {
          cyl.step(h, cmd); t += h;
          T.push(t); X.push(s.x * 1000);
          if (cmd === 1) {
            if (tMove == null && s.x > 2e-4) tMove = t;
            if (tExt == null && s.x >= L - 1e-7) tExt = t;
            if (tExt != null && s.pA - PATM > 0.95 * pg) { wait += h; if (wait > 0.1) { cmd = 0; tSwitch = t; wait = 0; } }
          } else {
            if (tRet == null && s.x <= 1e-7) tRet = t - tSwitch;
            if (tRet != null && s.pB - PATM > 0.95 * pg) { wait += h; if (wait > 0.1) break; }
          }
        }
        return { T, X, tube, Cp, tMove, tExt, tRet, air: cyl.airNl() - a0, tEnd: t };
      }
      function compute() {
        const near = drive(0.15), far = drive(V.L);
        return { near, far, tEnd: Math.max(near.tEnd, far.tEnd) };
      }
      function report(r) {
        const n = r.near, f = r.far;
        ro.set('ct', fmtC(cdm(n.tube.C)) + ' · ' + fmtC(cdm(f.tube.C)) + ' dm³/(s·bar)');
        ro.set('cp', fmtC(cdm(n.Cp)) + ' · ' + fmtC(cdm(f.Cp)) + ' dm³/(s·bar)');
        ro.set('dv', (n.tube.V * 1e6).toFixed(1) + ' · ' + (f.tube.V * 1e6).toFixed(1) + ' cm³');
        const tt = x => x != null ? ms(x) : '—';
        ro.set('te', tt(n.tMove) + ' · ' + tt(n.tExt) + '   |   ' + tt(f.tMove) + ' · ' + tt(f.tExt));
        ro.set('tr', tt(n.tRet) + ' · ' + tt(f.tRet));
        ro.set('air', n.air.toFixed(3) + ' · ' + f.air.toFixed(3) + ' L');
        ro.set('share', n.air > 0 ? '+' + (100 * (f.air - n.air) / n.air).toFixed(0) + ' %' : '—');
        const dec = x => x.T.map((t, i) => [t, x.X[i]]).filter((q, i) => i % 6 === 0);
        pX.set({ series: [{ pts: dec(n), label: 'valve at the cylinder' }, { pts: dec(f), label: 'valve ' + V.L.toPrecision(2) + ' m away', dash: [6, 4] }], x: { label: 'time (s)', min: 0, max: r.tEnd }, y: { label: 'position (mm)', min: 0, max: V.stroke } });
      }
      const loop = kit.loop((dt) => {
        since += dt;
        if (dirty && (since > 0.12 || !res)) { res = compute(); dirty = false; tA = 0; hold = 0; report(res); }
        const r = res;
        if (tA < r.tEnd) tA = Math.min(r.tEnd, tA + dt * V.slow); else { hold += dt; if (hold > 1) { tA = 0; hold = 0; } }
        const c = st.begin(), C = kit.colors(), sc = Math.min(st.W / 760, st.H / 340);
        c.save(); c.translate((st.W - 760 * sc) / 2, (st.H - 340 * sc) / 2); c.scale(sc, sc);
        const row = (x, y, Lt, label) => {
          const k = bsearch(x.T, tA), pos = x.X[Math.min(k, x.X.length - 1)] / V.stroke;
          const cy = S.cylinder(c, 430, y, { len: 200, h: 36, rodLen: 110, pos: clamp(pos, 0, 1) });
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(cy.tip[0], y - 14, 28, 28); c.strokeRect(cy.tip[0], y - 14, 28, 28);
          const vx = Lt < 0.5 ? 400 : 110;
          const v = S.valve(c, vx, y + 90, { spec: '5/2', state: 0, left: 'solenoid', right: 'spring', s: 26, pneumatic: true, labels: false, exhaust: 'silencer' });
          // tubes: straight when short, coiled with length when long
          const tube = (from, to, yy, col) => {
            c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath(); c.moveTo(from[0], from[1]); c.lineTo(from[0], yy);
            const span = to[0] - from[0], coils = Lt < 0.5 ? 0 : Math.min(40, Math.round(Lt * 4));
            for (let i = 1; i <= 60; i++) { const f = i / 60; c.lineTo(from[0] + span * f, yy + (coils ? Math.sin(f * coils * Math.PI) * 5 : 0)); }
            c.lineTo(to[0], to[1]); c.stroke();
          };
          tube(v.B, cy.A, y + 44, S.col('air'));
          tube(v.A, cy.B, y + 56, S.col('exhaust'));
          kit.label(c, label, 20, y - 18, { size: 12.5, weight: 700, color: C.text });
          kit.label(c, 'tube ' + Lt.toPrecision(2) + ' m, C = ' + fmtC(cdm(x.Cp)) + ' with the valve', 20, y, { size: 11.5, color: C.muted });
        };
        row(r.near, 70, 0.15, 'Valve on the cylinder');
        row(r.far, 230, V.L, 'Valve ' + V.L.toPrecision(2) + ' m away');
        kit.label(c, 't = ' + tA.toFixed(2) + ' s', 740, 330, { size: 11, color: C.muted, align: 'right' });
        c.restore();
        if (!loop.k) loop.k = 0;
        if (++loop.k % 4 === 0) pX.set({ vlines: [{ x: tA }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 6. an air budget */
  Hyper.sim('dyn-air-budget', {
    title: 'A machine\'s air budget',
    blurb: `Add up what a machine takes: two groups of cylinders (every cylinder in a group moves together), blow-off nozzles, vacuum ejectors and the leaks. The bar splits the **average** demand, which sizes the compressor and the electricity bill; the graph shows the **instantaneous** demand over a few seconds, whose peaks size the valves, the supply line and the receiver that bridges them.

**Try this**
- Look at the share of the blow-off nozzles: a few open nozzles often outspend all the cylinders.
- Give the leaks their typical 25 %: every consumer then costs a third more than it seems.
- Compare peak and average: the peak can be several times higher. A receiver sized to cover the deficit keeps the pressure from dipping.
- Lower the pressure from 7 to 5 bar: cylinders and nozzles use about a quarter less.
- Raise the cycle rate of the big cylinders and see which number grows first.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200, maxH: 260 });
      const [g1] = graphs(box, 1);
      const ctl = kit.controls(box.side, [
        { type: 'html', html: '<b>Cylinder group 1</b>' },
        { id: 'b1', type: 'select', label: 'Bore', options: boreOptions(), value: 50 },
        { id: 's1', label: 'Stroke', min: 10, max: 500, step: 5, value: 150, unit: 'mm' },
        { id: 'n1', label: 'Cylinders in the group', min: 1, max: 20, step: 1, value: 4 },
        { id: 'c1', label: 'Cycles per minute', min: 1, max: 60, step: 1, value: 12 },
        { type: 'html', html: '<b>Cylinder group 2</b>' },
        { id: 'b2', type: 'select', label: 'Bore', options: boreOptions(), value: 20 },
        { id: 's2', label: 'Stroke', min: 10, max: 500, step: 5, value: 50, unit: 'mm' },
        { id: 'n2', label: 'Cylinders in the group', min: 0, max: 40, step: 1, value: 10 },
        { id: 'c2', label: 'Cycles per minute', min: 1, max: 120, step: 1, value: 30 },
        { type: 'html', html: '<b>Blow-off, vacuum, leaks</b>' },
        { id: 'dn', label: 'Blow-off nozzle bore', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'mm' },
        { id: 'nn', label: 'Nozzles', min: 0, max: 10, step: 1, value: 2 },
        { id: 'duty', label: 'Nozzles open (share of the time)', min: 0, max: 100, step: 1, value: 30, unit: '%' },
        { id: 'ne', label: 'Vacuum ejectors (60 L/min each while on)', min: 0, max: 20, step: 1, value: 4 },
        { id: 'de', label: 'Ejectors on (share of the time)', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'leak', label: 'Leaks (share of the total)', min: 0, max: 50, step: 1, value: 25, unit: '%' },
        { id: 'p', label: 'Working pressure (gauge)', min: 3, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'res', label: 'Compressor reserve', min: 0, max: 100, step: 5, value: 25, unit: '%' },
        { id: 'h', label: 'Hours a year', min: 500, max: 8760, step: 10, value: 4000 },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['g1', 'Cylinder group 1'], ['g2', 'Cylinder group 2'], ['bo', 'Blow-off nozzles'], ['ej', 'Vacuum ejectors'], ['lk', 'Leaks'],
        ['avg', 'Average demand'], ['pk', 'Peak demand (in the window)'], ['cmp', 'Compressor free air delivery'], ['rcv', 'Receiver to hold the peaks within 1 bar'], ['kw', 'Electrical power · energy cost a year']]);
      const pQ = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'free-air demand (L/min ANR)', min: 0 }, legend: true }, 180);
      const V = ctl.values;
      const loop = kit.loop(() => {
        const r = (V.p * 1e5 + PATM) / PATM;
        const grp = (bore, strokeMm, nCyl, cpm) => {
          const D = bore / 1000, d = BORES[bore] / 1000, A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4, sL = strokeMm / 1000;
          const vExt = A1 * sL * r, vRet = A2 * sL * r;                                     // m³ free air per stroke, one cylinder
          const avg = nCyl * (vExt + vRet) * cpm / 60;                                         // m³/s
          const period = 60 / cpm, ts = clamp(sL / 0.5 + 0.05, 0.04, period * 0.4);            // time over which a stroke draws its air
          return { avg, vExt, vRet, period, ts, n: nCyl };
        };
        const G1 = grp(V.b1, V.s1, V.n1, V.c1), G2 = grp(V.b2, V.s2, V.n2, V.c2);
        const Cn = 0.85 * Math.PI * Math.pow(V.dn / 1000, 2) / 4 * 1.992e-3;                  // a rounded nozzle, m³/(s·Pa)
        const qNozzle = Cn * (V.p * 1e5 + PATM);                                                 // choked: free air m³/s ANR
        const boOn = V.nn * qNozzle, boAvg = boOn * V.duty / 100;
        const ejOn = V.ne * 60 / 60000, ejAvg = ejOn * V.de / 100;
        const users = G1.avg + G2.avg + boAvg + ejAvg, lk = V.leak < 100 ? users * V.leak / (100 - V.leak) : 0;
        const avg = users + lk, comp = avg * (1 + V.res / 100);
        // the instantaneous demand over a 10 s window
        const pts = { g1: [], g2: [], bo: [], ej: [], tot: [] };
        let peak = 0, deficit = 0, worst = 0;
        const dtw = 0.005;
        for (let t = 0; t <= 10 + 1e-9; t += dtw) {
          const g = (G, off) => { if (!G.n) return 0; const ph = ((t + off) % G.period + G.period) % G.period; let q = 0; if (ph < G.ts) q += G.n * G.vExt / G.ts; const h2 = G.period / 2; if (ph >= h2 && ph < h2 + G.ts) q += G.n * G.vRet / G.ts; return q; };
          const q1 = g(G1, 0), q2 = g(G2, 0.37), qb = ((t % 2) < 2 * V.duty / 100) ? boOn : 0, qe = (((t + 0.8) % 4) < 4 * V.de / 100) ? ejOn : 0;
          const q = q1 + q2 + qb + qe + lk;
          peak = Math.max(peak, q);
          deficit = Math.max(0, deficit + (q - comp) * dtw); worst = Math.max(worst, deficit);
          if (Math.round(t / dtw) % 4 === 0) { const L = 60000; pts.g1.push([t, q1 * L]); pts.g2.push([t, q2 * L]); pts.bo.push([t, qb * L]); pts.ej.push([t, qe * L]); pts.tot.push([t, q * L]); }
        }
        const Lm = x => (x * 60000).toFixed(0) + ' L/min';
        const pctOf = x => avg > 0 ? ' (' + (100 * x / avg).toFixed(0) + ' %)' : '';
        ro.set('g1', Lm(G1.avg) + pctOf(G1.avg)); ro.set('g2', Lm(G2.avg) + pctOf(G2.avg)); ro.set('bo', Lm(boAvg) + pctOf(boAvg));
        ro.set('ej', Lm(ejAvg) + pctOf(ejAvg)); ro.set('lk', Lm(lk) + pctOf(lk));
        ro.set('avg', Lm(avg) + ' = ' + (avg * 60).toFixed(2) + ' m³/min = ' + (avg * 60 / 0.028316846592 / 1.0288).toFixed(0) + ' SCFM');
        ro.set('pk', Lm(peak) + ' (' + (avg > 0 ? (peak / avg).toFixed(1) : '—') + ' × average)');
        ro.set('cmp', (comp * 60).toFixed(2) + ' m³/min');
        const Vr = worst * PATM / 1e5;                                                            // m³ of receiver per bar of allowed drop
        ro.set('rcv', Vr > 0 ? (Vr * 1000).toFixed(0) + ' L' : 'none needed at this reserve');
        const kw = avg * 60 * 6.5;
        ro.set('kw', kw.toFixed(1) + ' kW · ' + kit.money(kw * V.h * V.price, 0));
        const Cc = kit.colors();
        pQ.set({ series: [{ pts: pts.tot, label: 'total', color: Cc.text, width: 1.6 }, { pts: pts.g1, label: 'group 1', color: Cc.series[0], width: 1.2 }, { pts: pts.g2, label: 'group 2', color: Cc.series[1], width: 1.2 },
          { pts: pts.bo, label: 'blow-off', color: Cc.series[3], width: 1.2 }, { pts: pts.ej, label: 'ejectors', color: Cc.series[2], width: 1.2 }],
          x: { label: 'time (s)', min: 0, max: 10 }, hlines: [{ y: avg * 60000, label: 'average' }, { y: comp * 60000, label: 'compressor', color: Cc.ok }] });
        // the average as a stacked bar
        const c = st.begin(), W = st.W, H = st.H;
        const parts = [['group 1', G1.avg, Cc.series[0]], ['group 2', G2.avg, Cc.series[1]], ['blow-off', boAvg, Cc.series[3]], ['ejectors', ejAvg, Cc.series[2]], ['leaks', lk, Cc.bad]];
        const x0 = 20, x1 = W - 20, y = H * 0.36, bh = Math.min(46, H * 0.24), tot = Math.max(comp, avg, 1e-9);
        kit.label(c, 'Average demand ' + Lm(avg) + ', compressor ' + (comp * 60).toFixed(2) + ' m³/min with ' + V.res + ' % reserve', x0, y - bh / 2 - 18, { size: 13, weight: 700, color: Cc.text });
        let x = x0;
        for (const [nm, q, col] of parts) {
          const w = (x1 - x0) * q / tot;
          if (w <= 0) continue;
          c.fillStyle = col; c.fillRect(x, y - bh / 2, w, bh);
          if (w > 60) { kit.label(c, nm, x + 6, y - 8, { size: 11.5, weight: 700, color: '#fff' }); kit.label(c, (q * 60000).toFixed(0), x + 6, y + 9, { size: 11, color: '#fff' }); }
          x += w;
        }
        c.strokeStyle = Cc.ok; c.lineWidth = 2; c.setLineDash([5, 4]); const xc = x0 + (x1 - x0) * comp / tot; c.beginPath(); c.moveTo(xc, y - bh / 2 - 6); c.lineTo(xc, y + bh / 2 + 6); c.stroke(); c.setLineDash([]);
        let lx = x0; const ly = y + bh / 2 + 22;
        for (const [nm, q, col] of parts) { c.fillStyle = col; c.fillRect(lx, ly - 5, 11, 10); const txt = nm + ' ' + (avg > 0 ? (100 * q / avg).toFixed(0) : 0) + ' %'; kit.label(c, txt, lx + 15, ly, { size: 11.5, color: Cc.text }); lx += 24 + txt.length * 6.3; }
        kit.label(c, 'peak ' + Lm(peak) + ' — the supply line, service unit and valves must pass it', x0, ly + 22, { size: 11.5, color: Cc.muted });
      }, box.stage);
      loop.once();
    }
  });

  /* ================================================================ 7. stick-slip */
  Hyper.sim('dyn-stick-slip', {
    title: 'Slow motion and stick-slip',
    blurb: `A 32 mm cylinder asked to move slowly. In air mode the meter-out throttle is set by the choked-flow rule $C = A\\,v/p_0$ for the speed you ask for. The seals hold with a breakaway (static) friction larger than the friction while sliding, and the sliding friction falls as the speed rises (a Stribeck curve). The engine's cylinder model is run with that friction; with a hydro-pneumatic feed unit an oil damper in parallel sets the speed instead.

**Try this**
- Ask for 50 mm/s, then 20, 10 and 5 mm/s with standard seals: somewhere below 15–20 mm/s the motion turns into jumps and stops — stick-slip.
- Switch to low-friction seals: the breakaway friction is barely above the sliding friction, and the motion stays smooth down to a few mm/s.
- Increase the mass: a heavier load on the same air spring jumps further and more slowly.
- Tick the hydro-pneumatic feed unit: the air pushes, the oil damper regulates, and 1 mm/s is smooth.
- Read the predicted jump length $2(F_s - F_k)/k$ and compare it with the steps in the graph.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180, maxH: 240 });
      const [g1, g2] = graphs(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Speed asked for', min: 0.5, max: 100, value: 10, unit: 'mm/s', log: true, sig: 2 },
        { id: 'seal', type: 'select', label: 'Seals', options: [['Standard seals', 0], ['Low-friction seals', 1]], value: 0 },
        { id: 'feed', type: 'check', label: 'Hydro-pneumatic feed unit (oil damper)', value: false },
        { id: 'mass', label: 'Moving mass', min: 0.5, max: 30, value: 2, unit: 'kg', log: true, sig: 2 },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' }
      ], () => build());
      const ro = kit.readout(box.side, [['set', 'Setting'], ['fr', 'Breakaway · sliding friction'], ['k', 'Air-spring stiffness (both chambers)'], ['jump', 'Predicted jump 2(Fs − Fk)/k'], ['vm', 'Mean speed · range (last 2 s)'], ['q', 'Motion']]);
      const pX = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)' } }, 150);
      const pV = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'speed (mm/s)', min: 0 } }, 150);
      const V = ctl.values, D = 0.032, d = 0.012, L = 0.4, H_ = 2e-5;
      let cyl, fr, hist, tPlot = 0, c0;
      function build() {
        const pg = V.ps * 1e5, ps = pg + PATM, AA = Math.PI * D * D / 4, AB = AA - Math.PI * d * d / 4, Fth = pg * AA;
        const f = V.seal === 0 ? { s: 0.10, c: 0.055, vs: 0.008, fv: 150 } : { s: 0.032, c: 0.029, vs: 0.002, fv: 80 };
        fr = { Fs: f.s * Fth, Fc: f.c * Fth, vs: f.vs, fv: f.fv };
        const v = V.v / 1000;
        const Cthr = V.feed ? 5e-8 : AB * v / P0;
        // an oil damper c in parallel; entered as mass + c·h so the explicit step damps implicitly (stable for any c)
        const c = V.feed ? Math.max(0, (pg * AA - fr.Fc) / v - fr.fv) : 0;
        cyl = F.pneuCylinder({ bore: D, rod: d, stroke: L, mass: V.mass + c * H_, load: 0, psupply: ps, patm: PATM, Cvalve: 0.8e-8, CthrottleA: 5e-8, CthrottleB: Cthr, dead: 1.2e-5, fc: fr.Fs, fv: fr.fv + c });
        const s = cyl.state; s.x = 0.02; s.v = 0; s.pA = ps; s.pB = ps;
        hist = [];
        c0 = { Cthr, c, AA, AB };
        ro.set('set', V.feed ? 'air throttle open; oil damper ' + (c / 1000).toFixed(0) + ' N·s/mm' : 'meter-out C = A·v/p₀ = ' + (Cthr / 1e-8).toPrecision(2) + ' dm³/(s·bar)');
        ro.set('fr', fr.Fs.toFixed(0) + ' · ' + fr.Fc.toFixed(0) + ' N');
      }
      build();
      const loop = kit.loop((dt) => {
        const s = cyl.state, P = cyl.params;
        const n = Math.round(Math.min(dt, 0.05) / H_);
        for (let k = 0; k < n; k++) {
          const av = Math.abs(s.v);
          P.fc = av < 1e-4 ? fr.Fs : fr.Fc + (fr.Fs - fr.Fc) * Math.exp(-((av / fr.vs) * (av / fr.vs)));
          cyl.step(H_, 1);
          if (s.x >= L - 0.02) { s.x = 0.02; for (const q of hist) q[1] -= (L - 0.04) * 1000; }
          if (k % 25 === 0) hist.push([s.t, s.x * 1000, s.v * 1000]);
        }
        while (hist.length && hist[0][0] < s.t - 4) hist.shift();
        // the stiffness of the air at this position and the jump it allows
        const VA = P.dead + c0.AA * s.x, VB = P.dead + c0.AB * (L - s.x);
        const k = GAM * (s.pA * c0.AA * c0.AA / VA + s.pB * c0.AB * c0.AB / VB);
        ro.set('k', (k / 1000).toFixed(1) + ' N/mm');
        ro.set('jump', V.feed ? 'held by the oil' : (2 * (fr.Fs - fr.Fc) / k * 1000).toFixed(2) + ' mm');
        const rec = hist.filter(q => q[0] > s.t - 2);
        if (rec.length > 5) {
          const vm = (rec[rec.length - 1][1] - rec[0][1]) / Math.max(1e-6, rec[rec.length - 1][0] - rec[0][0]);
          let lo = Infinity, hi = -Infinity; for (const q of rec) { lo = Math.min(lo, q[2]); hi = Math.max(hi, q[2]); }
          ro.set('vm', vm.toFixed(1) + ' mm/s · ' + Math.max(0, lo).toFixed(1) + '…' + hi.toFixed(1));
          ro.set('q', hi - lo > Math.max(1, 0.6 * Math.abs(vm)) ? 'jerky: stick-slip' : 'smooth');
        }
        tPlot += dt;
        if (tPlot > 0.06) {
          tPlot = 0;
          const t0 = Math.max(0, s.t - 4);
          pX.set({ series: [{ pts: hist.map(q => [q[0], q[1]]) }], x: { label: 'time (s)', min: t0, max: t0 + 4 } });
          pV.set({ series: [{ pts: hist.map(q => [q[0], q[2]]), color: kit.colors().ok }], x: { label: 'time (s)', min: t0, max: t0 + 4 }, y: { label: 'speed (mm/s)', min: 0 }, hlines: [{ y: V.v, label: 'asked for' }] });
        }
        // ---- the cylinder and a ruler
        const c = st.begin(), C = kit.colors(), sc = Math.min(st.W / 760, st.H / 200);
        c.save(); c.translate((st.W - 760 * sc) / 2, (st.H - 200 * sc) / 2); c.scale(sc, sc);
        const cy = S.cylinder(c, 60, 80, { len: 360, h: 46, rodLen: 230, pos: s.x / L });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(cy.tip[0], 58, 44, 44); c.strokeRect(cy.tip[0], 58, 44, 44);
        // ruler under the load: 1 mm ticks around it, so small steps show
        const xm = s.x * 1000, rx = cy.tip[0] + 22;
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let mm = Math.floor(xm - 15); mm <= xm + 15; mm++) { const X = rx + (mm - xm) * 8; if (X < 440 || X > 750) continue; c.beginPath(); c.moveTo(X, 130); c.lineTo(X, mm % 5 === 0 ? 118 : 124); c.stroke(); if (mm % 5 === 0) kit.label(c, mm + '', X, 142, { size: 10, color: C.muted, align: 'center' }); }
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(rx, 106); c.lineTo(rx, 132); c.stroke();
        kit.label(c, 'ruler magnified 8×, 1 mm ticks', 600, 160, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, (s.v * 1000).toFixed(1) + ' mm/s', 60, 150, { size: 16, weight: 700, color: C.text });
        kit.label(c, V.feed ? 'oil damper sets the speed' : 'meter-out throttle sets the speed', 60, 172, { size: 11.5, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 8. the sizing procedure */
  const VALVES = [0.2, 0.3, 0.5, 0.8, 1.2, 2, 3, 4.5, 6.5, 10];
  Hyper.sim('dyn-sizer', {
    title: 'Sizing a drive, step by step',
    blurb: `The sizing procedure worked through for a load you describe — force and bore, speed and conductance, tube and valve, throttle, energy and air — and then **checked by simulation** with the engine's cylinder model. Horizontal loads run on guides with a friction coefficient of 0.1; vertical loads are lifted.

**Try this**
- Start from the default and read down the worksheet: each line is one step of the procedure.
- Shorten the required time: the needed conductance rises, and at some point the tube, not the valve, limits the design.
- Make the tube long and thin: the procedure picks a bigger valve to compensate, until no valve can.
- Lift 40 kg vertically: the bore grows with the load ratio, and the energy check starts to fail — shock absorbers needed.
- Compare the simulated stroke time with the one asked for: the design factor of 1.4 on the mean speed covers the dead time and acceleration.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 460 });
      const [g1] = graphs(box, 1);
      let dirty = true, since = 1;
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Moving mass', min: 0.5, max: 100, value: 12, unit: 'kg', log: true, sig: 2 },
        { id: 'vert', type: 'select', label: 'Motion', options: [['Horizontal, on guides (µ = 0.1)', 0], ['Vertical, lifting', 1]], value: 0 },
        { id: 's', label: 'Stroke', min: 25, max: 800, step: 5, value: 300, unit: 'mm' },
        { id: 't', label: 'Required stroke time', min: 0.15, max: 5, value: 0.8, unit: 's', log: true, sig: 2 },
        { id: 'p', label: 'Supply pressure (gauge)', min: 3, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'lr', label: 'Load ratio to design for', min: 30, max: 85, step: 5, value: 50, unit: '%' },
        { id: 'tl', label: 'Tube length, valve to cylinder', min: 0.2, max: 10, value: 1.5, unit: 'm', log: true, sig: 2 }
      ], () => { dirty = true; since = 0; });
      const ro = kit.readout(box.side, [['D', 'Bore chosen'], ['C', 'Conductance needed · path'], ['valve', 'Valve · throttle setting'], ['sim', 'Simulated stroke time'], ['E', 'Energy at the end · typical cushion'], ['air', 'Free air per cycle']]);
      const pX = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0 }, legend: true }, 170);
      const V = ctl.values;
      let lines = [];
      function design() {
        const m = V.m, pg = V.p * 1e5, ps = pg + PATM, lam = V.lr / 100, sL = V.s / 1000;
        const Fl = V.vert ? m * G0 : 0.1 * m * G0;
        const vMean = sL / V.t, vDes = 1.4 * vMean, acc = 2 * vDes * vDes / sL;       // reach the design speed within a quarter of the stroke
        const Fd = Fl + m * acc;
        const Dmin = Math.sqrt(4 * Fd / (Math.PI * pg * lam)) * 1000;
        let bore = BORE_LIST.find(b => b >= Dmin);
        const tooBig = bore == null; if (tooBig) bore = 100;
        const D = bore / 1000, d = BORES[bore] / 1000, AA = Math.PI * D * D / 4, AB = AA - Math.PI * d * d / 4, Fth = pg * AA;
        const Creq = AB * vDes / P0;                                    // m³/(s·Pa): choked meter-out, v = C·p0/A
        const tb = TUBE_BORE(bore) / 1000;
        // one design with a given valve: the path, the throttle that trims it to Creq, and the simulated extension
        function trial(cv, tMax) {
          const tube = tubeC(F, tb, V.tl, cv * 1e-8 * ps * F.RHO_ANR * 0.7), path = series(cv * 1e-8, tube.C);
          const Cthr = path > Creq ? 1 / Math.sqrt(1 / (Creq * Creq) - 1 / (path * path)) : 1e-6;
          const cyl = F.pneuCylinder({ bore: D, rod: d, stroke: sL, mass: m, load: Fl, psupply: ps, patm: PATM, Cvalve: path, bvalve: bSeries(0.3, cv * 1e-8, tube.C),
            CthrottleA: Math.min(Cthr, 1e-6), CthrottleB: Math.min(Cthr, 1e-6), dead: 2e-6 + tube.V, fc: 8 + 0.03 * Fth, fv: 60 });
          const s = cyl.state; s.x = 0; s.pA = PATM; s.pB = ps;
          const pts = []; let t = 0, tEnd = null, vEnd = 0;
          while (t < tMax) {
            const vp = s.v; cyl.step(5e-4, 1); t += 5e-4;
            if (pts.length === 0 || t - pts[pts.length - 1][0] > 0.004) pts.push([t, s.x * 1000]);
            if (tEnd == null && s.x >= sL - 1e-7) { tEnd = t; vEnd = vp; }
            if (tEnd != null && t > tEnd + 0.15) break;
          }
          return { valve: cv, tube, path, Cthr, pts, tEnd, vEnd, x: s.x };
        }
        // the procedure's valve: the smallest whose path (valve + tube) gives 1.25 × the requirement
        let k0 = VALVES.findIndex(cv => series(cv * 1e-8, tubeC(F, tb, V.tl, cv * 1e-8 * ps * F.RHO_ANR * 0.7).C) >= 1.25 * Creq);
        const noValve = k0 < 0;
        if (noValve) k0 = VALVES.length - 1;
        // the check: simulate, and go up a valve size while the stroke is too slow (the supply side can limit too)
        // (each check runs to 1.5 × the time asked; at most four sizes up, so the page stays responsive)
        const tCheck = 1.5 * V.t + 0.2;
        let r = trial(VALVES[k0], tCheck);
        const first = r;
        const inTime = x => x.tEnd != null && x.tEnd <= V.t * 1.05;
        for (let k = k0 + 1; k < Math.min(VALVES.length, k0 + 5) && !inTime(r); k++) {
          const nx = trial(VALVES[k], tCheck);
          // stop when the next size gains less than 3 %: then force or tube, not the valve, is the limit
          const gain = nx.tEnd != null ? (r.tEnd == null || nx.tEnd < r.tEnd * 0.97) : (r.tEnd == null && nx.x > r.x * 1.03);
          if (!gain) break;
          r = nx;
        }
        const slowStill = !inTime(r);
        if (r.tEnd == null) r = trial(r.valve, Math.min(8, Math.max(3 * V.t, 2)));   // the whole stroke, for the graph
        const { valve, tube, path, Cthr, pts, tEnd, vEnd } = r;
        const upsized = valve !== first.valve;
        const E = 0.5 * m * vEnd * vEnd, Eal = EALLOW[bore], boreE = BORE_LIST.find(b => EALLOW[b][1] >= E);
        const airCycle = ((AA + AB) * sL + 2 * tube.V) * ps / PATM * 1000;
        return { Fl, Fd, acc, boreE, Dmin, bore, tooBig, Fth, vMean, vDes, Creq, valve, path, tube, Cthr, noValve, pts, tEnd, vEnd, E, Eal, airCycle, AB, lam: Fl / Fth, first, upsized, slowStill };
      }
      function update() {
        const r = design(), C = kit.colors();
        const ok = C.ok, bad = C.bad, warn = C.warn;
        lines = [
          ['1  Force', (V.vert ? 'lifting m·g' : 'guide friction µ·m·g') + ' = ' + r.Fl.toFixed(0) + ' N, + m·a = ' + (r.Fd - r.Fl).toFixed(0) + ' N to accelerate (a = ' + r.acc.toFixed(1) + ' m/s²) → ' + r.Fd.toFixed(0) + ' N', null],
          ['2  Bore', 'D ≥ √(4F/(π·p·λ)) = ' + r.Dmin.toFixed(1) + ' mm → ' + r.bore + ' mm (rod ' + BORES[r.bore] + '), ' + r.Fth.toFixed(0) + ' N, load ratio ' + (100 * r.lam).toFixed(0) + ' % (with acceleration ' + (100 * r.Fd / r.Fth).toFixed(0) + ' %)', r.tooBig ? bad : ok],
          ['3  Speed', 'mean s/t = ' + r.vMean.toFixed(2) + ' m/s; design 1.4 × mean = ' + r.vDes.toFixed(2) + ' m/s', null],
          ['4  Conductance', 'choked meter-out: C = A·v/p₀ = ' + (r.AB * 1e4).toFixed(2) + ' cm² × ' + r.vDes.toFixed(2) + ' m/s / 1 bar = ' + fmtC(cdm(r.Creq)) + ' dm³/(s·bar)', null],
          ['5  Tube', V.tl.toPrecision(2) + ' m of ' + TUBE_BORE(r.bore) + ' mm bore: C ≈ ' + fmtC(cdm(r.tube.C)) + ' dm³/(s·bar), ' + (r.tube.V * 1e6).toFixed(1) + ' cm³ each side', cdm(r.tube.C) < 1.25 * cdm(r.Creq) ? bad : null],
          ['6  Valve', 'smallest with valve + tube ≥ 1.25 × need: C = ' + r.first.valve + ' → path ' + fmtC(cdm(r.first.path)) + (r.noValve ? ' — no valve is enough: shorten or widen the tube' : ''), r.noValve ? bad : ok],
          ['7  Throttle', 'trim the meter-out throttle to C ≈ ' + (r.Cthr >= 1e-6 ? 'open' : fmtC(cdm(r.Cthr))) + ' so the path gives the ' + fmtC(cdm(r.Creq)) + ' needed', null],
          ['8  Check', (r.upsized ? 'with C = ' + r.first.valve + ' the stroke took ' + (r.first.tEnd != null ? r.first.tEnd.toFixed(2) + ' s' : 'too long') + ' (supply side too small); with C = ' + r.valve + ': ' : 'simulated stroke ') + (r.tEnd != null ? r.tEnd.toFixed(2) + ' s against ' + V.t.toFixed(2) + ' s asked' : 'does not reach the end') + (r.slowStill ? ' — larger valves stop helping: more force (a bigger bore), a wider or shorter tube, or more time' : ''), r.slowStill ? warn : ok],
          ['9  Energy', '½·m·v² = ½ × ' + V.m.toPrecision(2) + ' × ' + r.vEnd.toFixed(2) + '² = ' + r.E.toFixed(2) + ' J; typical air cushion ' + r.Eal[1] + ' J' + (r.E > r.Eal[1] ? ' → shock absorbers, a slower end speed' + (r.boreE && r.boreE > r.bore ? ', or a ' + r.boreE + ' mm bore for its cushions' : '') : ''), r.E > r.Eal[1] ? bad : r.E > 0.7 * r.Eal[1] ? warn : ok],
          ['10 Air', ((r.airCycle)).toFixed(2) + ' L of free air per cycle, including ' + (2 * r.tube.V * 1e6).toFixed(0) + ' cm³ of tubes', null]
        ];
        ro.set('D', r.bore + ' mm (needs ' + r.Dmin.toFixed(1) + ')');
        ro.set('C', fmtC(cdm(r.Creq)) + ' · ' + fmtC(cdm(r.path)) + ' dm³/(s·bar)');
        ro.set('valve', 'C = ' + r.valve + (r.upsized ? ' (after the check)' : '') + ' · throttle ' + (r.Cthr >= 1e-6 ? 'open' : fmtC(cdm(r.Cthr))));
        ro.set('sim', r.tEnd != null ? r.tEnd.toFixed(2) + ' s (asked ' + V.t.toFixed(2) + ' s)' : 'not reached');
        ro.set('E', r.E.toFixed(2) + ' J · ' + r.Eal[1] + ' J');
        ro.set('air', r.airCycle.toFixed(2) + ' L');
        const ideal = [[0, 0], [V.t, V.s]];
        pX.set({ series: [{ pts: r.pts, label: 'simulated' }, { pts: ideal, label: 'required average', dash: [5, 4] }], vlines: [{ x: V.t, label: 'required time' }], x: { label: 'time (s)', min: 0 }, y: { label: 'position (mm)', min: 0, max: V.s * 1.05 } });
      }
      const loop = kit.loop((dt) => {
        since += dt;
        if (dirty && since > 0.12) { update(); dirty = false; }
        const c = st.begin(), C = kit.colors(), W = st.W;
        const sz = W < 600 ? 11 : 12.5, lh = Math.max(24, Math.min(40, (st.H - 30) / lines.length));
        kit.label(c, 'Worksheet', 16, 16, { size: 13, weight: 700, color: C.text });
        lines.forEach((q, i) => {
          const y = 36 + i * lh;
          if (q[2]) kit.dot(c, 22, y, 5, q[2]);
          kit.label(c, q[0], 34, y, { size: sz, weight: 700, color: C.text });
          kit.label(c, q[1], 34 + (W < 600 ? 88 : 120), y, { size: sz, color: C.text });
        });
      }, box.stage);
      update(); dirty = false;
      loop.start();
    }
  });
})();
