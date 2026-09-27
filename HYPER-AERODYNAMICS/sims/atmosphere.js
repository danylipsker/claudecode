/* HYPER-AERODYNAMICS · sims/atmosphere.js — simulations for the Atmosphere branch.
 *   atm-isa-profile       temperature, pressure, density and speed of sound against height (kit.fluid.isa),
 *                         on a standard day and on a warmer or colder one; density altitude, true height
 *   atm-parcel            a parcel of air lifted through the environment: dry and moist adiabats, cloud base,
 *                         buoyancy, stability and the Brunt–Väisälä oscillation
 *   atm-altimeter         an aircraft holding an altimeter reading across changing pressure and temperature:
 *                         QNH, standard setting, "high to low", cold-temperature error, terrain clearance
 *   atm-density-altitude  a light aircraft's takeoff roll, integrated step by step, on a hot, high, humid day
 *   atm-wind-profile      the wind gradient (log law or power law) over different ground, and a wind turbine
 *   atm-gust              an aircraft flying through a "1 − cos" gust or continuous turbulence: load factor
 *   atm-microburst        an airliner on the approach through a microburst: F-factor, airspeed, escape manoeuvre
 *   atm-droplets          supercooled droplets around a cylinder: inertia, collection efficiency, where ice grows
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, KT = 1852 / 3600, FT = 0.3048, G0 = 9.80665;
  const T0 = 288.15, LR = 0.0065, RA = 287.058, RV = 461.5, P0 = 101325, NX = RA * LR / G0;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const grp = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace('-', '−');
  const sfix = (v, d) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d);
  const hpOf = p => T0 / LR * (1 - Math.pow(p / P0, NX));          // pressure altitude (m) of a pressure (Pa), ISA troposphere
  const graphBox = box => { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; };
  // a small seeded random-number source and normal deviates, so runs are repeatable
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const gauss = r => { let u = r(); if (u < 1e-12) u = 1e-12; return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  // a side-view aeroplane, nose to the right, about 2·s long, pitched nose-up by ang (radians)
  function plane(c, x, y, s, ang, fill, stroke) {
    c.save(); c.translate(x, y); c.rotate(-(ang || 0)); c.scale(s, s);
    c.fillStyle = fill; c.strokeStyle = stroke; c.lineWidth = 1.4 / s;
    c.beginPath(); c.moveTo(1, 0); c.bezierCurveTo(0.9, -0.15, 0.2, -0.16, -0.7, -0.08); c.lineTo(-1, -0.1); c.lineTo(-1, 0.04);
    c.bezierCurveTo(-0.5, 0.1, 0.6, 0.12, 1, 0); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-0.7, -0.07); c.lineTo(-0.95, -0.42); c.lineTo(-0.8, -0.42); c.lineTo(-0.52, -0.08); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(0.1, 0.02, 0.42, 0.05, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    c.restore();
  }

  /* ================================================================ the standard atmosphere, layer by layer */
  Hyper.sim('atm-isa-profile', {
    title: 'The standard atmosphere, layer by layer',
    blurb: `Temperature, pressure, density and the speed of sound in the International Standard Atmosphere (solid lines), and on a day warmer or colder than standard (dashed), against pressure altitude — the height an altimeter set to 1013.25 hPa shows. Drag on the chart, or use the slider, to pick a height; the values come from the same standard-atmosphere routine as the [atmosphere calculator](#/tools/flight/atmosphere).

**Try this**
- Climb from sea level to 11 km. The temperature falls in a straight line while pressure and density curve over. At what height have they halved?
- Show the whole stratosphere: above the tropopause the temperature stops falling, then rises again where ozone absorbs sunlight.
- Make it an ISA + 30 day. At each pressure altitude the pressure is unchanged — that is the definition — but the density is lower (read the density altitude) and the pressure level sits higher above the sea.
- The speed of sound follows the temperature alone: equal at 11 and 20 km.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Pressure altitude', min: 0, max: 47000, step: 100, value: P.h != null ? P.h : 3000, unit: 'm' },
        { id: 'dT', label: 'The day: ISA deviation', min: -30, max: 40, step: 1, value: P.dT != null ? P.dT : 0, unit: '°C' },
        { id: 'top', type: 'select', label: 'Show up to', options: [['11 km: the troposphere', 11000], ['20 km: into the stratosphere', 20000], ['47 km: the whole stratosphere', 47000]], value: P.view === 47 ? 47000 : P.view === 11 ? 11000 : 20000 }
      ], () => { calc(); loop.once(); });
      const ro = kit.readout(box.side, [['h', 'Pressure altitude'], ['layer', 'Layer'], ['T', 'Temperature'], ['p', 'Pressure'], ['rho', 'Density'], ['a', 'Speed of sound'], ['nu', 'Kinematic viscosity'], ['z', 'This pressure level lies above the sea at'], ['hd', 'Density altitude']]);
      const V = ctl.values;
      const panels = [
        { k: 'T', title: 'Temperature (°C)', min: -90, max: 60 },
        { k: 'p', title: 'Pressure (hPa)', min: 0, max: 1100 },
        { k: 'rho', title: 'Density (kg/m³)', min: 0, max: 1.5 },
        { k: 'a', title: 'Speed of sound (m/s)', min: 270, max: 370 }
      ];
      const val = (h, dT) => {
        const s = F.isa(h), T = s.T + dT, rho = s.p / (RA * T);
        return { T: T - 273.15, Tisa: s.T - 273.15, p: s.p / 100, rho, a: Math.sqrt(1.4 * RA * T), nu: F.sutherland(T) / rho };
      };
      // the height of a pressure level above the sea on a day ΔT off standard: ∫ T/T_ISA dh (Simpson)
      function trueHeight(h, dT) {
        if (h <= 0) return 0;
        const n = 200, dh = h / n; let s = 0;
        for (let i = 0; i <= n; i++) { const Ti = F.isa(i * dh).T, w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2; s += w * (Ti + dT) / Ti; }
        return s * dh / 3;
      }
      function densityAlt(rho) { let lo = -5000, hi = 47000; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (F.isa(m).rho > rho) lo = m; else hi = m; } return (lo + hi) / 2; }
      let curves = null, cur = null;
      function calc() {
        const top = +V.top, isa = {}, day = {};
        for (const pn of panels) { isa[pn.k] = []; day[pn.k] = []; }
        for (let i = 0; i <= 240; i++) {
          const h = top * i / 240, s = val(h, 0), d = val(h, V.dT);
          for (const pn of panels) { isa[pn.k].push([s[pn.k], h]); day[pn.k].push([d[pn.k], h]); }
        }
        curves = { isa, day };
        const h = V.h, c = val(h, V.dT), z = trueHeight(h, V.dT), hd = densityAlt(c.rho);
        cur = { h, c };
        ro.set('h', grp(h) + ' m = ' + grp(h / FT) + ' ft (FL ' + String(Math.round(h / FT / 100)).padStart(3, '0') + ')');
        ro.set('layer', h < 11000 ? 'troposphere: cooling 6.5 °C per km' : h < 20000 ? 'lower stratosphere: constant −56.5 °C in ISA' : h < 32000 ? 'stratosphere: warming 1 °C per km' : 'upper stratosphere: warming 2.8 °C per km');
        ro.set('T', V.dT ? sfix(c.Tisa, 1) + ' °C in ISA, ' + sfix(c.T, 1) + ' °C today' : sfix(c.T, 1) + ' °C (' + (c.T + 273.15).toFixed(2) + ' K)');
        ro.set('p', c.p.toFixed(c.p < 10 ? 2 : 1) + ' hPa (p/p₀ = ' + (c.p / 1013.25).toFixed(4) + ')');
        ro.set('rho', c.rho.toFixed(4) + ' kg/m³ (σ = ' + (c.rho / 1.225).toFixed(4) + ')');
        ro.set('a', c.a.toFixed(1) + ' m/s = ' + (c.a / KT).toFixed(0) + ' kt');
        ro.set('nu', (c.nu * 1e6).toFixed(c.nu < 1e-4 ? 1 : 0) + ' mm²/s');
        ro.set('z', grp(z) + ' m' + (V.dT ? ' (' + (z >= h ? '+' : '−') + grp(Math.abs(z - h)) + ' m against ISA)' : ' (standard day)'));
        ro.set('hd', grp(hd) + ' m = ' + grp(hd / FT) + ' ft');
      }
      const pad = { l: 56, r: 50, t: 34, b: 30 };
      const geom = () => { const n = panels.length, gap = 14; return { gap, pw: (st.W - pad.l - pad.r - gap * (n - 1)) / n, y0: pad.t, y1: st.H - pad.b }; };
      const Y = (h, g) => g.y1 - h / (+V.top) * (g.y1 - g.y0);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geom(), top = +V.top;
        if (!curves) return;
        const xL = pad.l, xR = st.W - pad.r, yTp = Y(Math.min(11000, top), g);
        c.fillStyle = kit.hue(200, C.dark ? 0.12 : 0.08); c.fillRect(xL, yTp, xR - xL, g.y1 - yTp);
        if (top > 11000) { c.fillStyle = kit.hue(280, C.dark ? 0.12 : 0.07); c.fillRect(xL, g.y0, xR - xL, yTp - g.y0); }
        c.lineWidth = 1;
        for (const [hb, lab] of [[11000, 'tropopause, 11 km'], [20000, '20 km'], [32000, '32 km']]) {
          if (hb >= top) continue;
          const y = Y(hb, g);
          c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(xL, y); c.lineTo(xR, y); c.stroke(); c.setLineDash([]);
          kit.label(c, lab, xR - 4, y - 7, { align: 'right', size: 11, color: C.muted });
        }
        const stepKm = Hyper.niceStep(top / 1000, 6);
        for (let k = 0; k <= top / 1000 + 1e-9; k += stepKm) kit.label(c, +k.toFixed(3) + ' km', xL - 6, Y(k * 1000, g), { align: 'right', size: 11, color: C.muted });
        const topFt = top / FT / 1000, stepFt = Hyper.niceStep(topFt, 6);
        for (let k = 0; k <= topFt + 1e-9; k += stepFt) kit.label(c, +k.toFixed(1) + 'k ft', xR + 6, Y(k * 1000 * FT, g), { align: 'left', size: 11, color: C.muted });
        panels.forEach((pn, i) => {
          const x0 = pad.l + i * (g.pw + g.gap), X = v => x0 + (v - pn.min) / (pn.max - pn.min) * g.pw;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x0 + 0.5, g.y0 + 0.5, g.pw, g.y1 - g.y0);
          const sx = Hyper.niceStep(pn.max - pn.min, 3);
          for (let v = Math.ceil(pn.min / sx) * sx; v <= pn.max + 1e-9; v += sx) {
            const x = X(v);
            c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke();
            kit.label(c, String(+v.toFixed(3)).replace('-', '−'), x, g.y1 + 12, { align: 'center', size: 10.5, color: C.muted });
          }
          kit.label(c, pn.title, x0 + g.pw / 2, g.y0 - 14, { align: 'center', size: 12, weight: 700, color: C.text });
          c.save(); c.beginPath(); c.rect(x0, g.y0, g.pw, g.y1 - g.y0); c.clip();
          const draw = (pts, col, dash, w) => {
            c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath();
            pts.forEach((q, j) => { const x = X(q[0]), y = Y(q[1], g); if (j) c.lineTo(x, y); else c.moveTo(x, y); });
            c.stroke(); c.setLineDash([]);
          };
          if (V.dT && pn.k !== 'p') draw(curves.day[pn.k], C.warn, [6, 4], 2);
          draw(curves.isa[pn.k], C.accent, null, 2.2);
          c.restore();
          if (cur) {
            const y = Y(Math.min(cur.h, top), g), v = cur.c[pn.k], xv = clamp(X(v), x0, x0 + g.pw);
            kit.dot(c, xv, y, 4.5, V.dT && pn.k !== 'p' ? C.warn : C.accent, C.surface);
            const txt = pn.k === 'T' ? sfix(v, 1) + ' °C' : pn.k === 'p' ? v.toFixed(v < 10 ? 2 : 0) + ' hPa' : pn.k === 'rho' ? v.toFixed(3) : v.toFixed(0) + ' m/s';
            const right = xv < x0 + g.pw * 0.55;
            kit.label(c, txt, xv + (right ? 8 : -8), y - 12, { align: right ? 'left' : 'right', size: 11.5, weight: 700, color: C.text, bg: C.surface });
          }
          if (i === 0) {
            kit.label(c, '— ISA', x0 + 6, g.y1 - 26, { size: 11, weight: 700, color: C.accent });
            if (V.dT) kit.label(c, '- - today: ISA ' + (V.dT > 0 ? '+' : '−') + Math.abs(V.dT), x0 + 6, g.y1 - 10, { size: 11, weight: 700, color: C.warn });
          }
        });
        if (cur) {
          const y = Y(Math.min(cur.h, top), g);
          c.strokeStyle = C.text; c.globalAlpha = 0.45; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(xL, y); c.lineTo(xR, y); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
          if (cur.h > top) kit.label(c, 'the chosen height is above the chart: show more of the atmosphere', xL + 8, g.y0 + 12, { size: 11, color: C.warn, weight: 700 });
        }
      }, box.stage);
      const setFromY = y => { const g = geom(); const h = clamp((g.y1 - y) / (g.y1 - g.y0) * (+V.top), 0, +V.top); ctl.set('h', Math.round(h / 50) * 50); calc(); loop.once(); };
      kit.drag(st, { hit: p => (p.x > pad.l && p.x < st.W - pad.r && p.y > pad.t - 8 && p.y < st.H - pad.b + 8 ? 1 : null), start: (k, p) => setFromY(p.y), move: (k, p) => setFromY(p.y), hover: true });
      calc();
      loop.start();
    }
  });

  /* ================================================================ a rising parcel of air */
  Hyper.sim('atm-parcel', {
    title: 'A rising parcel of air',
    blurb: `A temperature–height diagram. The thick line is the **environment** — the air around. A parcel lifted from the ground cools along the dry adiabat (9.8 °C per km) until it reaches its dew point, the **cloud base**, and then along the slower moist adiabat as its vapour condenses. Where the parcel is warmer than the environment (red) it is buoyant; where it is colder (blue) it sinks back. The parcel's motion is integrated with its buoyancy and a little drag, shown one minute per second.

**Try this**
- Release a thermal with a lapse rate of 8 K/km: it rises to the cloud base and a cumulus grows. Now set 5 K/km: the air is stable and the thermal stops a few hundred metres up.
- In stable air (lapse rate 3 K/km), lift a parcel of clear air 300 m above its own level (1000 m) and let go: it sinks back, overshoots and bobs up and down at the buoyancy frequency. Compare the period in the plot with the one read out. At 11 K/km it runs away instead.
- Put an inversion at 1000 m: thermals stop under it — the lid on a hazy summer day.
- Raise the dew-point spread: the cloud base rises by about 125 m for every degree.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320, maxH: 540 });
      const plot = kit.plot(graphBox(box), { x: { label: 'time (min)', min: 0 }, y: { label: 'parcel height (m)', min: 0 } }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'Ts', label: 'Surface temperature', min: -10, max: 40, step: 0.5, value: 25, unit: '°C' },
        { id: 'lapse', label: 'Environmental lapse rate', min: -2, max: 12, step: 0.1, value: P.lapse != null ? P.lapse : 8, unit: 'K/km' },
        { id: 'spread', label: 'Dew-point spread at the surface', min: 0, max: 25, step: 0.5, value: 12, unit: 'K' },
        { id: 'inv', type: 'select', label: 'Inversion (+4 K over 300 m)', options: [['none', 0], ['at 1000 m', 1000], ['at 2000 m', 2000], ['at 3000 m', 3000]], value: P.inv || 0 },
        { id: 'dTp', label: 'Thermal starts warmer by', min: 0, max: 4, step: 0.1, value: 1, unit: 'K' },
        { type: 'buttons', items: [{ id: 'go', label: 'Release a thermal', primary: true }, { id: 'lift', label: 'Lift air from 1000 m by 300 m' }] }
      ], id => { if (id === 'go') release(0, 'thermal'); else if (id === 'lift') release(ZR + 300, 'plain'); else build(); });
      const ro = kit.readout(box.side, [['stab', 'Lowest layer'], ['N', 'Buoyancy frequency'], ['lcl', 'Cloud base of the thermal'], ['top', 'Thermal buoyant up to'], ['fl', 'Freezing level'], ['now', 'Parcel now']]);
      const V = ctl.values, DZ = 10, ZTOP = 6000, NZ = ZTOP / DZ + 1, ZR = 1000;
      const LV = 2.501e6, CP = 1004.7, EPS = 0.622, KD = 0.0012;
      const pAt = z => 101325 * Math.pow(Math.max(0.05, 1 - 0.0065 * z / 288.15), 5.2559);
      const gammaM = (T, p) => { const es = F.magnus(T - 273.15), rs = EPS * es / Math.max(100, p - es); return G0 * (1 + LV * rs / (RA * T)) / (CP + LV * LV * rs * EPS / (RA * T * T)); };
      function Tenv(z) {
        const Ts = V.Ts + 273.15, G = V.lapse / 1000, zi = +V.inv;
        if (!zi || z < zi) return Ts - G * z;
        const Tb = Ts - G * zi;
        return z < zi + 300 ? Tb + 4 * (z - zi) / 300 : Tb + 4 - 0.0065 * (z - zi - 300);
      }
      function parcel(excess) {
        const T = new Float64Array(NZ), Td = new Float64Array(NZ);
        let t = V.Ts + 273.15 + excess, td = V.Ts + 273.15 - V.spread, lcl = null;
        for (let i = 0; i < NZ; i++) {
          if (lcl === null && t <= td + 1e-9) lcl = i * DZ;
          T[i] = t; Td[i] = lcl === null ? td : t;
          if (lcl === null) { t -= 0.0098 * DZ; td -= 0.0018 * DZ; } else t -= gammaM(t, pAt(i * DZ)) * DZ;
        }
        return { T, Td, lcl: lcl === null ? ZTOP : lcl };
      }
      let env = null, par = {}, kind = 'thermal', z = 0, w = 0, tMin = 0, trace = [], zmax = 0, frame = 0;
      const at = (arr, zz) => { const f = clamp(zz / DZ, 0, NZ - 1.001), i = Math.floor(f), u = f - i; return arr[i] * (1 - u) + arr[i + 1] * u; };
      const buoy = zz => { const Te = at(env, zz); return G0 * (at(par[kind].T, zz) - Te) / Te; };
      function build() {
        env = new Float64Array(NZ);
        for (let i = 0; i < NZ; i++) env[i] = Tenv(i * DZ);
        par.thermal = parcel(V.dTp);
        // a parcel of clear air that belongs at 1000 m: displaced up or down it follows the dry adiabat through that level
        const Tp = new Float64Array(NZ), Tr = Tenv(ZR);
        for (let i = 0; i < NZ; i++) Tp[i] = Tr - 0.0098 * (i * DZ - ZR);
        par.plain = { T: Tp, Td: null, lcl: ZTOP };
        const Ts = V.Ts + 273.15, gm0 = gammaM(Ts - 0.5 * V.spread, 101325) * 1000, L = V.lapse;
        ro.set('stab', (L > 9.8 ? 'absolutely unstable' : L > gm0 ? 'conditionally unstable' : L < 0 ? 'an inversion: very stable' : 'absolutely stable') + ' (saturated air here cools ' + gm0.toFixed(1) + ' K/km)');
        const N2 = G0 / Ts * (0.0098 - L / 1000);
        ro.set('N', Math.abs(N2) < 2e-7 ? 'about zero: neutral air' : N2 > 0 ? Math.sqrt(N2).toFixed(4) + ' s⁻¹, period ' + (2 * Math.PI / Math.sqrt(N2) / 60).toFixed(1) + ' min' : 'none — unstable: a displaced parcel runs away (e-folding ' + (1 / Math.sqrt(-N2)).toFixed(0) + ' s)');
        const lc = par.thermal.lcl;
        ro.set('lcl', lc >= ZTOP ? 'above 6 km' : grp(lc) + ' m (' + grp(lc / FT) + ' ft)');
        const b0 = G0 * (par.thermal.T[0] - env[0]) / env[0];
        let zt = null;
        if (b0 > 0) { zt = ZTOP; for (let i = 1; i < NZ; i++) if (par.thermal.T[i] <= env[i]) { zt = i * DZ; break; } }
        ro.set('top', zt === null ? 'not buoyant: no thermal' : zt >= ZTOP ? 'above 6 km: a towering cloud' : grp(zt) + ' m (' + grp(zt / FT) + ' ft)');
        let fl = null;
        for (let i = 0; i < NZ; i++) if (env[i] <= 273.15) { fl = i * DZ; break; }
        ro.set('fl', fl === null ? 'above 6 km' : fl === 0 ? 'at the surface' : grp(fl) + ' m (' + grp(fl / FT) + ' ft)');
      }
      function release(z0, k) { kind = k; z = z0; w = 0; tMin = 0; trace = [[0, z0]]; zmax = z0; }
      function step(dt) {
        w += (buoy(z) - KD * w * Math.abs(w)) * dt; z += w * dt;
        if (z < 0) { z = 0; if (w < 0) w = 0; }
        if (z > ZTOP - DZ) { z = ZTOP - DZ; if (w > 0) w = 0; }
        zmax = Math.max(zmax, z);
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = 58, xd = Math.round(W * 0.64), yb = H - 30, yt = 14;
        const Y = zz => yb - zz / ZTOP * (yb - yt);
        const Tmin = V.Ts - 48, Tmax = V.Ts + 8;
        const X = TK => x0 + (TK - 273.15 - Tmin) / (Tmax - Tmin) * (xd - x0);
        const p = par[kind];
        // grid, axes and dry adiabats (faint guides)
        c.lineWidth = 1; c.strokeStyle = C.grid;
        for (let zz = 0; zz <= ZTOP; zz += 1000) { c.beginPath(); c.moveTo(x0, Y(zz)); c.lineTo(xd, Y(zz)); c.stroke(); kit.label(c, zz / 1000 + ' km', x0 - 6, Y(zz), { align: 'right', size: 11, color: C.muted }); }
        for (let T = Math.ceil(Tmin / 10) * 10; T <= Tmax; T += 10) { const x = X(T + 273.15); c.beginPath(); c.moveTo(x, yt); c.lineTo(x, yb); c.stroke(); kit.label(c, sfix(T, 0) + ' °C', x, yb + 12, { align: 'center', size: 10.5, color: C.muted }); }
        c.save(); c.beginPath(); c.rect(x0, yt, xd - x0, yb - yt); c.clip();
        c.setLineDash([2, 5]); c.strokeStyle = C.faint;
        for (let T = Tmin; T <= Tmax + 60; T += 10) { c.beginPath(); c.moveTo(X(T + 273.15), Y(0)); c.lineTo(X(T + 273.15 - 9.8 * 6), Y(6000)); c.stroke(); }
        c.setLineDash([]);
        for (let i = 0; i < NZ - 1; i++) {
          const d = p.T[i] - env[i];
          if (Math.abs(d) < 0.02) continue;
          c.fillStyle = d > 0 ? kit.hue(8, 0.25) : kit.hue(215, 0.18);
          const xa = X(env[i]), xb = X(p.T[i]);
          c.fillRect(Math.min(xa, xb), Y((i + 1) * DZ), Math.abs(xb - xa), Y(i * DZ) - Y((i + 1) * DZ) + 0.6);
        }
        const line = (arr, col, wdt, dash, upto) => {
          c.strokeStyle = col; c.lineWidth = wdt; c.setLineDash(dash || []); c.beginPath();
          const n = upto != null ? Math.min(NZ, Math.round(upto / DZ) + 1) : NZ;
          for (let i = 0; i < n; i++) { const x = X(arr[i]), y = Y(i * DZ); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
          c.stroke(); c.setLineDash([]);
        };
        line(env, C.text, 2.6);
        if (p.Td) line(p.Td, C.series[2], 1.6, [5, 4], p.lcl);
        line(p.T, C.warn, 2.2);
        c.restore();
        if (p.lcl < ZTOP) {
          c.strokeStyle = C.muted; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(x0, Y(p.lcl)); c.lineTo(W - 10, Y(p.lcl)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'cloud base', x0 + 6, Y(p.lcl) - 9, { size: 11, color: C.muted, weight: 700 });
        }
        const Tp = at(p.T, z);
        kit.dot(c, X(Tp), Y(z), 6, C.warn, C.surface);
        kit.label(c, 'environment', clamp(X(env[Math.round(4200 / DZ)]) + 6, x0 + 4, xd - 84), Y(4200), { size: 11.5, weight: 700, color: C.text, bg: C.surface });
        const zl = kind === 'thermal' ? 3000 : ZR + 800;
        kit.label(c, kind === 'thermal' ? 'thermal' : 'air from 1000 m', clamp(X(p.T[Math.round(zl / DZ)]) - 6, x0 + 90, xd), Y(zl) - 12, { align: 'right', size: 11.5, weight: 700, color: C.warn });
        if (p.Td) kit.label(c, 'dew point', X(p.Td[0]) + 6, Y(0) - 12, { size: 11, color: C.series[2] });
        else { c.strokeStyle = C.warn; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x0, Y(ZR)); c.lineTo(xd, Y(ZR)); c.stroke(); c.setLineDash([]); kit.label(c, 'its own level', xd - 4, Y(ZR) + 10, { align: 'right', size: 10.5, color: C.warn }); }
        // the scene: a column of sky with the parcel and its cloud
        const xs = xd + 18, xe = W - 10, xm = (xs + xe) / 2;
        const g = c.createLinearGradient(0, yt, 0, yb);
        g.addColorStop(0, C.dark ? 'hsl(215 45% 14%)' : 'hsl(205 70% 84%)'); g.addColorStop(1, C.dark ? 'hsl(210 35% 22%)' : 'hsl(200 60% 95%)');
        c.fillStyle = g; c.fillRect(xs, yt, xe - xs, yb - yt);
        if (+V.inv) { c.fillStyle = kit.hue(35, 0.25); c.fillRect(xs, Y(+V.inv + 300), xe - xs, Y(+V.inv) - Y(+V.inv + 300)); kit.label(c, 'inversion', xe - 4, Y(+V.inv + 150), { align: 'right', size: 10.5, color: C.text }); }
        c.fillStyle = C.dark ? 'hsl(30 25% 26%)' : 'hsl(30 35% 62%)'; c.fillRect(xs, yb, xe - xs, H - yb);
        if (kind === 'thermal' && zmax > p.lcl + 20) {
          const topC = Math.min(zmax, ZTOP), n = Math.max(2, Math.round((topC - p.lcl) / 180));
          c.fillStyle = C.dark ? 'hsl(210 15% 82%)' : '#ffffff'; c.strokeStyle = C.faint; c.lineWidth = 1;
          for (let k = 0; k <= n; k++) {
            const zz = p.lcl + (topC - p.lcl) * k / n, r = Math.min(26, (xe - xs) * 0.22) * (1 - 0.25 * k / (n + 1));
            for (const dx of [-0.9, 0, 0.9]) { c.beginPath(); c.arc(xm + dx * r, Y(zz) - r * 0.3, r * (dx ? 0.8 : 1), 0, Math.PI * 2); c.fill(); }
          }
          c.fillRect(xm - Math.min(26, (xe - xs) * 0.22) * 1.3, Y(p.lcl) - 4, Math.min(26, (xe - xs) * 0.22) * 2.6, 4);
        }
        const b = buoy(z);
        kit.dot(c, xm, Y(z), 10, b > 0 ? kit.hue(8, 0.8) : kit.hue(215, 0.8), C.surface);
        if (Math.abs(w) > 0.05) kit.arrow(c, xm + 18, Y(z), xm + 18, Y(z) - clamp(w * 8, -40, 40), C.text, 1.6);
        kit.label(c, 'w = ' + sfix(w, 1) + ' m/s', xm, yb + 12, { align: 'center', size: 11, color: C.text, weight: 700 });
        ro.set('now', grp(z) + ' m, ' + sfix(w, 1) + ' m/s, ' + sfix(Tp - 273.15, 1) + ' °C (' + (b >= 0 ? '+' : '−') + Math.abs(at(p.T, z) - at(env, z)).toFixed(1) + ' K against the air around)');
      }
      const loop = kit.loop(dt => {
        let simT = dt * 60;
        while (simT > 1e-9) { const h = Math.min(0.5, simT); step(h); simT -= h; tMin += h / 60; }
        if (dt > 0) { trace.push([tMin, z]); while (trace.length > 2 && tMin - trace[0][0] > 40) trace.shift(); }
        if (frame++ % 4 === 0) plot.set({ series: [{ pts: trace, label: 'parcel' }], x: { label: 'time (min)', min: Math.max(0, tMin - 40), max: Math.max(10, tMin) }, hlines: kind === 'plain' ? [{ y: ZR, label: 'its own level' }] : par[kind] && par[kind].lcl < ZTOP ? [{ y: par[kind].lcl, label: 'cloud base' }] : [] });
        draw();
      }, box.stage);
      build();
      release(0, 'thermal');
      loop.start();
    }
  });

  /* ================================================================ the altimeter */
  Hyper.sim('atm-altimeter', {
    title: 'The altimeter: QNH, standard and the weather',
    blurb: `An aircraft flies 200 km holding a constant altimeter reading. The sea-level pressure (QNH) changes along the way from the departure value on the left to the destination value on the right, and the air may be warmer or colder than standard. The thin lines are the levels where the altimeter would read 1000, 2000 … 6000 ft; the aircraft follows its own, and the dashed line is where the pilot thinks it is.

**Try this**
- Leave the subscale on the departure QNH (1025) and fly towards the low (1001): the aircraft sinks while the altimeter reads 3000 ft — "high to low, look out below". Watch the clearance over the ridge.
- Tick "reset the subscale to the local QNH": now the aircraft holds its true altitude.
- Make the air 30 °C colder than standard: even with the correct QNH the aircraft is lower than indicated — "from hot to cold, look out below".
- Set 1013.25: the altimeter now shows the pressure altitude, and the aircraft flies a flight level.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'QA', label: 'QNH at departure (left)', min: 980, max: 1040, step: 1, value: 1025, unit: 'hPa' },
        { id: 'QB', label: 'QNH at destination (right)', min: 980, max: 1040, step: 1, value: 1001, unit: 'hPa' },
        { id: 'dT', label: 'Air temperature: ISA deviation', min: -40, max: 30, step: 1, value: 0, unit: '°C' },
        { id: 'Hi', label: 'Altitude flown (altimeter reading)', min: 1500, max: 6000, step: 100, value: 3000, unit: 'ft' },
        { id: 'S', label: 'Subscale set', min: 950, max: 1050, step: 1, value: 1025, unit: 'hPa' },
        { id: 'auto', type: 'check', label: 'Reset the subscale to the local QNH as you fly', value: false },
        { type: 'buttons', items: [{ id: 'setA', label: 'Departure QNH' }, { id: 'setL', label: 'Local QNH' }, { id: 'std', label: '1013.25' }] }
      ], id => {
        if (id === 'setA') ctl.set('S', V.QA);
        else if (id === 'setL') ctl.set('S', Math.round(qnh(xa) * 4) / 4);
        else if (id === 'std') ctl.set('S', 1013.25);
        if (id === 'setA' || id === 'setL' || id === 'std') ctl.set('auto', false);
      });
      const ro = kit.readout(box.side, [['q', 'Local QNH'], ['sub', 'Subscale'], ['ind', 'Altimeter reads'], ['hp', 'Pressure altitude'], ['zt', 'True altitude'], ['ter', 'Terrain below'], ['clr', 'Clearance']]);
      const V = ctl.values, XE = 200;
      const qnh = x => V.QA + (V.QB - V.QA) * clamp(x / XE, 0, 1);
      const sub = x => (V.auto ? qnh(x) : V.S);
      const terrain = x => {
        const base = 400 - 220 * x / XE;
        const hills = 220 * Math.pow(Math.sin(x / 6.5), 2) * clamp((x - 18) / 10, 0, 1) * clamp((105 - x) / 10, 0, 1);
        const ridge = 2000 * Math.exp(-Math.pow((x - 132) / 9, 2));
        return (base + hills + ridge) * FT;
      };
      // true height above the sea (m) of the level where an altimeter set to s hPa reads Hm metres,
      // with the air ΔT off standard at every level: ∫ (T_ISA + ΔT)/T_ISA dh_p from the sea-level pressure
      function zTrue(x, Hm, s) {
        const hp = Hm + hpOf(s * 100), h1 = hpOf(qnh(x) * 100);
        return hp - h1 + V.dT / LR * Math.log((T0 - LR * h1) / (T0 - LR * hp));
      }
      let xa = 0, hold = 0;
      function dial(c, C, cx, cy, R, ft, s) {
        c.beginPath(); c.arc(cx, cy, R + 4, 0, Math.PI * 2); c.fillStyle = C.text; c.fill();
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fillStyle = C.surface; c.fill();
        for (let k = 0; k < 50; k++) {
          const a = k / 50 * 2 * Math.PI - Math.PI / 2, r1 = k % 5 ? R * 0.88 : R * 0.8;
          c.strokeStyle = C.text; c.lineWidth = k % 5 ? 1 : 2;
          c.beginPath(); c.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); c.lineTo(cx + Math.cos(a) * R * 0.97, cy + Math.sin(a) * R * 0.97); c.stroke();
          if (k % 5 === 0) kit.label(c, String(k / 5), cx + Math.cos(a) * R * 0.64, cy + Math.sin(a) * R * 0.64, { align: 'center', size: Math.max(9, R * 0.17), weight: 700, color: C.text });
        }
        const bw = R * 0.62, bh = R * 0.24, bx = cx + R * 0.02, by = cy + R * 0.12;
        c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1; c.fillRect(bx, by, bw, bh); c.strokeRect(bx, by, bw, bh);
        kit.label(c, s.toFixed(s % 1 ? 2 : 0), bx + bw / 2, by + bh / 2 + 1, { align: 'center', size: Math.max(8.5, R * 0.15), weight: 700, color: C.text });
        kit.label(c, 'ALT ft', cx, cy - R * 0.3, { align: 'center', size: Math.max(8, R * 0.13), color: C.muted });
        const needle = (a, len, wdt, col) => { c.strokeStyle = col; c.lineWidth = wdt; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); c.stroke(); c.lineCap = 'butt'; };
        const f = Math.max(0, ft);
        needle((f % 10000) / 10000 * 2 * Math.PI - Math.PI / 2, R * 0.5, 5, C.text);
        needle((f % 1000) / 1000 * 2 * Math.PI - Math.PI / 2, R * 0.86, 2.2, C.accent);
        kit.dot(c, cx, cy, 3.5, C.text);
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const xl = 52, xr = W - 14, yb = H - 24, yt = 14, HT = 6500 * FT;
        const X = x => xl + x / XE * (xr - xl), Y = zz => yb - zz / HT * (yb - yt);
        const g = c.createLinearGradient(0, yt, 0, yb);
        g.addColorStop(0, C.dark ? 'hsl(215 45% 14%)' : 'hsl(205 70% 88%)'); g.addColorStop(1, C.dark ? 'hsl(212 35% 22%)' : 'hsl(200 60% 97%)');
        c.fillStyle = g; c.fillRect(xl, yt, xr - xl, yb - yt);
        c.lineWidth = 1;
        for (let f = 0; f <= 6000; f += 1000) { const y = Y(f * FT); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(xl, y); c.lineTo(xr, y); c.stroke(); kit.label(c, grp(f) + ' ft', xl - 5, y, { align: 'right', size: 10.5, color: C.muted }); }
        const reading = (ft, col, wdt, x1) => {
          c.strokeStyle = col; c.lineWidth = wdt; c.beginPath();
          for (let i = 0; i <= 100; i++) { const x = (x1 != null ? x1 : XE) * i / 100, y = Y(zTrue(x, ft * FT, sub(x))); if (i) c.lineTo(X(x), y); else c.moveTo(X(x), y); }
          c.stroke();
        };
        for (let f = 1000; f <= 6000; f += 1000) {
          reading(f, C.faint, 1);
          kit.label(c, 'reads ' + grp(f), xl + 4, Y(zTrue(0, f * FT, sub(0))) - 7, { size: 10, color: C.muted });
        }
        c.strokeStyle = C.muted; c.setLineDash([6, 5]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(xl, Y(V.Hi * FT)); c.lineTo(xr, Y(V.Hi * FT)); c.stroke(); c.setLineDash([]);
        const R = clamp(H * 0.15, 40, 70), dx = xr - R - 12, dy = yt + R + 30;
        reading(V.Hi, C.accent, 1.6);
        if (xa > 0) reading(V.Hi, C.accent, 3.4, xa);
        c.beginPath(); c.moveTo(xl, yb);
        for (let i = 0; i <= 200; i++) c.lineTo(X(i), Y(terrain(i)));
        c.lineTo(xr, yb); c.closePath(); c.fillStyle = C.dark ? 'hsl(100 18% 26%)' : 'hsl(100 25% 64%)'; c.fill();
        c.strokeStyle = C.dark ? 'hsl(100 20% 40%)' : 'hsl(100 25% 45%)'; c.stroke();
        for (const [xa0, xa1] of [[5, 13], [186, 195]]) { c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(X(xa0), Y(terrain((xa0 + xa1) / 2))); c.lineTo(X(xa1), Y(terrain((xa0 + xa1) / 2))); c.stroke(); }
        c.lineWidth = 1;
        const Hm = V.Hi * FT, s = sub(xa), zz = zTrue(xa, Hm, s), zg = terrain(xa), clr = zz - zg, hp = Hm + hpOf(s * 100);
        const bad = clr < 0, low = clr < 500 * FT;
        plane(c, X(xa), Y(zz), 13, 0, bad ? C.bad : C.surface, C.text);
        kit.label(c, 'where the pilot thinks the aircraft is', X(45), Y(V.Hi * FT) - 9, { size: 10.5, color: C.muted });
        const diff = (zz - Hm) / FT;
        kit.label(c, bad ? 'the flight path meets the terrain' : Math.abs(diff) < 20 ? 'true altitude ≈ altimeter reading' : 'true altitude ' + grp(Math.abs(diff)) + ' ft ' + (diff < 0 ? 'BELOW' : 'above') + ' the reading', (xl + dx - R) / 2 + 20, yt + 12, { align: 'center', size: 12.5, weight: 700, color: bad ? C.bad : diff < -150 ? C.warn : C.text, bg: C.surface });
        if (low && !bad) kit.label(c, 'terrain clearance ' + grp(clr / FT) + ' ft', X(xa), Y(zz) + 20, { align: 'center', size: 11.5, weight: 700, color: C.bad, bg: C.surface });
        kit.label(c, 'QNH ' + V.QA.toFixed(0), X(8), yb + 12, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'QNH ' + V.QB.toFixed(0), X(190), yb + 12, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, grp(xa) + ' km', X(xa), yb + 12, { align: 'center', size: 10.5, color: C.text, weight: 700 });
        dial(c, C, dx, dy, R, V.Hi, s);
        ro.set('q', qnh(xa).toFixed(1) + ' hPa');
        ro.set('sub', s.toFixed(2) + ' hPa = ' + (s * 100 / 3386.389).toFixed(2) + ' inHg' + (V.auto ? ' (kept at local QNH)' : ''));
        ro.set('ind', grp(V.Hi) + ' ft');
        ro.set('hp', grp(hp / FT) + ' ft (FL ' + String(Math.max(0, Math.round(hp / FT / 100))).padStart(3, '0') + ')');
        ro.set('zt', grp(zz / FT) + ' ft (' + (diff >= 0 ? '+' : '−') + grp(Math.abs(diff)) + ' ft)');
        ro.set('ter', grp(zg / FT) + ' ft');
        ro.set('clr', grp(clr / FT) + ' ft' + (bad ? ' — below the terrain!' : low ? ' — dangerously low' : ''));
      }
      const loop = kit.loop(dt => {
        if (hold > 0) { hold -= dt; if (hold <= 0) xa = 0; }
        else { xa += dt * 6.25; if (xa >= XE) { xa = XE; hold = 1.5; } }
        draw();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hot, high and humid: the takeoff roll */
  Hyper.sim('atm-density-altitude', {
    title: 'Hot, high and humid: the takeoff roll',
    blurb: `A four-seat light aircraft (16.2 m² of wing, a 120 kW normally aspirated engine and a 1.9 m propeller) takes off on the upper runway; the ghost on the lower runway does the same on a standard day at sea level. The roll is integrated step by step: propeller thrust from momentum theory, engine power falling with the density of the dry air (the Gagg–Ferrar rule), drag, rolling friction, and liftoff at 1.1 times the stall speed — a true airspeed that grows as the air thins. The plot shows the ground roll at this airfield against temperature.

**Try this**
- Start at sea level at 15 °C, then heat the day to 40 °C: the roll grows by almost 30 %.
- Move to 1650 m (a Denver-like field) at 33 °C: the roll more than doubles. At 2500 m and 35 °C, will 800 m of runway do?
- Add humidity: several per cent more roll, from lighter air and less oxygen for the engine.
- Take off at dawn (5 °C) instead of mid-afternoon, or lighter: which helps more?

These are illustrative numbers from a simple model. Real takeoff distances come only from the aircraft's approved flight manual.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240, maxH: 420 });
      const plot = kit.plot(graphBox(box), { x: { label: 'outside air temperature (°C)', min: -20, max: 50 }, y: { label: 'ground roll (m)', min: 0 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'elev', label: 'Airfield elevation', min: 0, max: 4000, step: 10, value: P.elev != null ? P.elev : 1650, unit: 'm' },
        { id: 'T', label: 'Outside air temperature', min: -20, max: 50, step: 0.5, value: P.T != null ? P.T : 33, unit: '°C' },
        { id: 'qnh', label: 'QNH', min: 960, max: 1050, step: 0.25, value: 1013.25, unit: 'hPa' },
        { id: 'rh', label: 'Relative humidity', min: 0, max: 100, step: 1, value: P.rh != null ? P.rh : 20, unit: '%' },
        { id: 'm', label: 'Takeoff mass', min: 800, max: 1150, step: 10, value: 1100, unit: 'kg' },
        { id: 'rw', label: 'Runway length', min: 300, max: 2500, step: 10, value: 800, unit: 'm' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start the takeoff', primary: true }] }
      ], id => { if (id !== 'go') solve(); restart(); });
      const ro = kit.readout(box.side, [['pa', 'Pressure altitude'], ['isa', 'ISA temperature there'], ['rho', 'Air density'], ['hd', 'Density altitude'], ['pw', 'Engine power available'], ['vl', 'Liftoff speed'], ['roll', 'Ground roll'], ['ref', 'Against ISA at sea level']]);
      const V = ctl.values;
      const S = 16.2, CLMAX = 1.75, CLR = 0.45, CDR = 0.065, MU = 0.03, PW0 = 120e3, AD = Math.PI * 0.95 * 0.95, KP = 0.55, DT = 0.05;
      // propeller as an actuator disc that turns a fraction KP of the shaft power into jet power:
      // KP·P = 2ρA(V + v)²v, solved for the induced speed v (Newton); thrust T = 2ρA(V + v)v
      function thrust(Pw, rho, Vv, vg) {
        const cc = KP * Pw / (2 * rho * AD);
        let v = vg > 0 ? vg : Math.cbrt(cc);
        for (let k = 0; k < 12; k++) { const f = (Vv + v) * (Vv + v) * v - cc, d = (Vv + v) * (Vv + 3 * v); v = Math.max(1e-6, v - f / d); }
        return { T: 2 * rho * AD * (Vv + v) * v, v };
      }
      function air(elev, Tc, q, rh) {
        const pa = elev + hpOf(q * 100), s = F.isa(pa), T = Tc + 273.15, e = rh / 100 * F.magnus(Tc);
        const rhoDry = (s.p - e) / (RA * T), rho = rhoDry + e / (RV * T);
        return { pa, p: s.p, Tisa: s.T - 273.15, rho, sig: rho / 1.225, sigDry: rhoDry / 1.225 };
      }
      function roll(rho, sigDry, m) {
        const Wt = m * G0, Pw = PW0 * Math.max(0.05, 1.132 * sigDry - 0.132), Vlof = 1.1 * Math.sqrt(2 * Wt / (rho * S * CLMAX));
        let Vv = 0, x = 0, t = 0, v = 0;
        const xs = [0];
        while (Vv < Vlof) {
          const th = thrust(Pw, rho, Vv, v); v = th.v;
          const q = 0.5 * rho * Vv * Vv, a = (th.T - q * S * CDR - MU * (Wt - q * S * CLR)) / m;
          if (a < 0.02 || t > 240) return { ok: false, Vlof, Pw, xs, t, s: x, Vend: Vv };
          Vv += a * DT; x += Vv * DT; t += DT; xs.push(x);
        }
        return { ok: true, s: x, t, Vlof, Pw, xs, gam: 0.1 * Math.pow(clamp(Pw / PW0, 0.2, 1), 2) };   // gam: only for drawing the climb-out
      }
      let today = null, rT = null, rR = null, tA = 0, hold = 0;
      function solve() {
        today = air(V.elev, V.T, V.qnh, V.rh);
        rT = roll(today.rho, today.sigDry, V.m);
        rR = roll(1.225, 1, V.m);
        const here = [], sea = [];
        for (let Tc = -20; Tc <= 50.01; Tc += 2.5) {
          const a = air(V.elev, Tc, V.qnh, V.rh), r = roll(a.rho, a.sigDry, V.m);
          if (r.ok) here.push([Tc, r.s]);
          const b = air(0, Tc, 1013.25, V.rh), rb = roll(b.rho, b.sigDry, V.m);
          if (rb.ok) sea.push([Tc, rb.s]);
        }
        plot.set({ series: [{ pts: here, label: 'this airfield' }, { pts: sea, label: 'sea level, 1013 hPa', dash: [5, 4] }],
          hlines: [{ y: V.rw, label: 'runway length' }], vlines: [{ x: today.Tisa, label: 'ISA here' }],
          marks: rT.ok ? [{ x: V.T, y: rT.s, label: 'today' }] : [] });
        const sig = today.sig, hd = T0 / LR * (1 - Math.pow(Math.max(0.3, sig), RA * LR / (G0 - RA * LR)));
        ro.set('pa', grp(today.pa) + ' m (' + grp(today.pa / FT) + ' ft)');
        const dev = V.T - today.Tisa;
        ro.set('isa', sfix(today.Tisa, 1) + ' °C — today is ISA ' + (dev >= 0 ? '+' : '−') + Math.abs(dev).toFixed(1));
        ro.set('rho', today.rho.toFixed(3) + ' kg/m³ (σ = ' + sig.toFixed(3) + ')');
        ro.set('hd', grp(hd) + ' m (' + grp(hd / FT) + ' ft)');
        ro.set('pw', (rT.Pw / 1000).toFixed(0) + ' kW (' + (rT.Pw / PW0 * 100).toFixed(0) + ' % of sea-level power)');
        ro.set('vl', (rT.Vlof / KT).toFixed(0) + ' kt true = ' + (rT.Vlof * Math.sqrt(sig) / KT).toFixed(0) + ' kt equivalent (' + (rR.Vlof / KT).toFixed(0) + ' kt at sea level)');
        ro.set('roll', rT.ok ? grp(rT.s) + ' m (' + grp(rT.s / FT) + ' ft) in ' + rT.t.toFixed(0) + ' s' + (rT.s > V.rw ? ' — longer than the runway!' : '') : 'the aircraft cannot reach liftoff speed');
        ro.set('ref', rR.ok && rT.ok ? '× ' + (rT.s / rR.s).toFixed(2) + ' (sea level, 15 °C: ' + grp(rR.s) + ' m)' : '—');
      }
      function restart() { tA = 0; hold = 0; }
      // position (m) and height (m) of an aircraft t seconds after brake release
      function pos(r, t) {
        const n = r.xs.length - 1, f = t / DT;
        if (f < n) { const i = Math.floor(f), u = f - i; return { x: r.xs[i] * (1 - u) + r.xs[i + 1] * u, h: 0, air: false }; }
        const dt = t - n * DT;
        if (!r.ok) return { x: r.xs[n] + r.Vend * dt, h: 0, air: false };
        return { x: r.s + r.Vlof * dt, h: Math.max(0, r.gam) * r.Vlof * dt, air: true };
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const hot = clamp((V.T - 15) / 30, 0, 1);
        const g = c.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, C.dark ? 'hsl(' + (215 - 180 * hot) + ' 40% 16%)' : 'hsl(' + (205 - 170 * hot) + ' ' + (60 + 20 * hot) + '% 86%)');
        g.addColorStop(1, C.dark ? 'hsl(215 30% 11%)' : 'hsl(40 40% 96%)');
        c.fillStyle = g; c.fillRect(0, 0, W, H);
        if (V.elev > 200) {
          const hm = clamp(V.elev / 4000, 0.05, 1) * H * 0.3;
          c.fillStyle = C.dark ? 'hsl(220 15% 24%)' : 'hsl(220 15% 78%)';
          c.beginPath(); c.moveTo(0, H * 0.46);
          for (let i = 0; i <= 12; i++) c.lineTo(W * i / 12, H * 0.46 - hm * (0.45 + 0.55 * Math.abs(Math.sin(i * 1.7 + 0.4))));
          c.lineTo(W, H * 0.46); c.closePath(); c.fill();
        }
        const ext = Math.max(V.rw, rT.ok ? rT.s : V.rw, rR.ok ? rR.s : 0) * 1.12 + 60;
        const x0 = 26, k = (W - x0 - 18) / ext;
        const lanes = [{ y: H * 0.5, r: rT, name: 'Today: ' + V.elev.toFixed(0) + ' m, ' + V.T.toFixed(1) + ' °C, ' + V.rh.toFixed(0) + ' % humidity', col: C.accent }, { y: H * 0.86, r: rR, name: 'ISA at sea level: 15 °C, 1013 hPa', col: C.muted }];
        for (const ln of lanes) {
          c.fillStyle = C.dark ? 'hsl(30 15% 30%)' : 'hsl(90 25% 70%)'; c.fillRect(0, ln.y + 6, W, 10);
          c.fillStyle = C.dark ? 'hsl(0 0% 30%)' : 'hsl(0 0% 42%)'; c.fillRect(x0, ln.y + 4, V.rw * k, 9);
          c.strokeStyle = '#fff'; c.lineWidth = 1.2; c.setLineDash([10, 10]); c.beginPath(); c.moveTo(x0 + 6, ln.y + 8.5); c.lineTo(x0 + V.rw * k - 6, ln.y + 8.5); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + V.rw * k, ln.y - 14); c.lineTo(x0 + V.rw * k, ln.y + 16); c.stroke();
          kit.label(c, ln.name, x0, ln.y - 36, { size: 11.5, weight: 700, color: ln.col });
          if (ln.r.ok) {
            const xs = x0 + ln.r.s * k, over = ln.r.s > V.rw;
            c.strokeStyle = over ? C.bad : C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(xs, ln.y - 6); c.lineTo(xs, ln.y + 18); c.stroke();
            kit.label(c, 'lifts off: ' + grp(ln.r.s) + ' m', xs, ln.y + 28, { align: 'center', size: 11, weight: 700, color: over ? C.bad : C.text });
          }
          const p = pos(ln.r, tA), px = x0 + p.x * k, py = ln.y - 4 - p.h * 3;
          if (px < W + 40) plane(c, px, py, 15, p.air ? Math.atan(Math.max(0, ln.r.gam) * 3) + 0.05 : 0, ln === lanes[0] ? C.surface : C.bg2, ln.col);
        }
        kit.label(c, 'end of runway (' + grp(V.rw) + ' m)', x0 + V.rw * k - 4, lanes[0].y - 20, { align: 'right', size: 10.5, color: C.bad });
        if (!rT.ok) kit.label(c, 'cannot reach liftoff speed', W / 2, lanes[0].y - 56, { align: 'center', size: 13, weight: 700, color: C.bad, bg: C.surface });
        else if (rT.s > V.rw) kit.label(c, 'needs ' + grp(rT.s) + ' m — more than the runway', W / 2, lanes[0].y - 56, { align: 'center', size: 13, weight: 700, color: C.bad, bg: C.surface });
        kit.label(c, 't = ' + tA.toFixed(1) + ' s', W - 10, 14, { align: 'right', size: 12, color: C.text, weight: 700 });
      }
      const loop = kit.loop(dt => {
        // the run ends when both aircraft have climbed away (or rolled off the picture), at most after 60 s
        const ext = Math.max(V.rw, rT.ok ? rT.s : V.rw, rR.ok ? rR.s : 0) * 1.12 + 60;
        const done = r => (r.ok ? tA > r.t + 5 : pos(r, tA).x > ext * 1.1);
        if (hold > 0) { hold -= dt; if (hold <= 0) tA = 0; }
        else { tA += dt * 1.5; if ((done(rT) && done(rR)) || tA > 60) hold = 2; }
        draw();
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ wind near the ground */
  Hyper.sim('atm-wind-profile', {
    title: 'Wind near the ground',
    blurb: `The wind grows with height above the ground. On the left, the profile from the log law $u = (u_*/\\kappa)\\ln(z/z_0)$ or the power law $u = u_{10}(z/10)^{\\alpha}$ (the other one dashed), scaled to the wind measured at 10 m; on the right, the same air flowing past a wind turbine, each streak moving at its own height's speed. The plot below shows the power carried by each square metre of wind, ½ρu³.

**Try this**
- Compare open sea with a city centre at the same 10 m wind: over rough ground the wind near the surface is held back, and the gradient is much steeper.
- Raise the hub from 60 to 140 m and watch the power per square metre at the hub. Why are modern towers so tall?
- With a 150 m rotor, compare the wind at the top and the bottom of the blade circle — every blade meets that difference once a turn.
- Switch between the log and the power laws: close near 10–100 m, apart far from the reference height.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300, maxH: 520 });
      const plot = kit.plot(graphBox(box), { x: { label: 'height (m)', min: 0 }, y: { label: 'power in the wind ½ρu³ (W/m²)', min: 0 }, legend: true }, 160);
      const TER = [{ z0: 0.0002, a: 0.10 }, { z0: 0.03, a: 0.14 }, { z0: 0.1, a: 0.18 }, { z0: 0.5, a: 0.25 }, { z0: 1.5, a: 0.35 }];
      const ctl = kit.controls(box.side, [
        { id: 'u10', label: 'Wind at 10 m', min: 1, max: 20, step: 0.5, value: 6, unit: 'm/s' },
        { id: 'ter', type: 'select', label: 'Ground', options: [['Open sea (z₀ = 0.2 mm, α = 0.10)', 0], ['Short grass, airfield (z₀ = 3 cm, α = 0.14)', 1], ['Farmland with hedges (z₀ = 10 cm, α = 0.18)', 2], ['Woods and suburbs (z₀ = 0.5 m, α = 0.25)', 3], ['City centre (z₀ = 1.5 m, α = 0.35)', 4]], value: 1 },
        { id: 'law', type: 'select', label: 'Profile', options: [['Logarithmic (log law)', 'log'], ['Power law', 'pow']], value: 'log' },
        { id: 'hub', label: 'Hub height', min: 20, max: 160, step: 1, value: 100, unit: 'm' },
        { id: 'D', label: 'Rotor diameter', min: 10, max: 160, step: 1, value: 120, unit: 'm' }
      ], () => solve());
      const ro = kit.readout(box.side, [['us', 'Friction velocity u*'], ['uh', 'Wind at hub height'], ['tb', 'Wind at the top / bottom of the rotor'], ['sh', 'Difference across the rotor'], ['pd', 'Power per m² at the hub'], ['ra', 'Compared with 10 m'], ['P', 'Wind power through the rotor']]);
      const V = ctl.values, RHO = 1.225;
      const uLog = z => { const t = TER[V.ter], us = 0.41 * V.u10 / Math.log(10 / t.z0); return z > t.z0 ? us / 0.41 * Math.log(z / t.z0) : 0; };
      const uPow = z => (z > 0 ? V.u10 * Math.pow(z / 10, TER[V.ter].a) : 0);
      const u = z => (V.law === 'log' ? uLog(z) : uPow(z));
      const uAlt = z => (V.law === 'log' ? uPow(z) : uLog(z));
      let zTop = 200, uMax = 10, Rr = 50, phi = 0;
      const parts = [];
      function solve() {
        Rr = Math.max(2, Math.min(V.D / 2, V.hub - 3));
        zTop = Math.ceil(Math.max(200, V.hub + Rr + 30) / 50) * 50;
        uMax = Math.max(5, Math.ceil(Math.max(u(zTop), uAlt(zTop)) * 1.15));
        const uh = u(V.hub), top = u(V.hub + Rr), bot = u(V.hub - Rr);
        let Pw = 0; const n = 200;
        for (let i = 0; i < n; i++) { const y = -Rr + (i + 0.5) * 2 * Rr / n, chord = 2 * Math.sqrt(Math.max(0, Rr * Rr - y * y)); Pw += 0.5 * RHO * Math.pow(u(V.hub + y), 3) * chord * 2 * Rr / n; }
        const t = TER[V.ter];
        ro.set('us', V.law === 'log' ? (0.41 * V.u10 / Math.log(10 / t.z0)).toFixed(3) + ' m/s (surface stress ' + (RHO * Math.pow(0.41 * V.u10 / Math.log(10 / t.z0), 2)).toFixed(2) + ' Pa)' : '— (power law)');
        ro.set('uh', uh.toFixed(2) + ' m/s (' + (uh / KT).toFixed(1) + ' kt)');
        ro.set('tb', top.toFixed(2) + ' / ' + bot.toFixed(2) + ' m/s' + (Rr < V.D / 2 ? ' (rotor clipped to clear the ground)' : ''));
        ro.set('sh', (top - bot).toFixed(2) + ' m/s = ' + ((top - bot) / Math.max(0.01, uh) * 100).toFixed(0) + ' % of the hub wind');
        ro.set('pd', (0.5 * RHO * uh * uh * uh).toFixed(0) + ' W/m²');
        ro.set('ra', '× ' + Math.pow(uh / V.u10, 3).toFixed(2) + ' the power per m² at 10 m');
        ro.set('P', (Pw / 1e6).toFixed(Pw < 1e6 ? 3 : 2) + ' MW; a turbine can take at most 16/27 of it, ' + (Pw * 16 / 27 / 1e6).toFixed(Pw < 1e6 ? 3 : 2) + ' MW');
        const a = [], b = [];
        for (let i = 1; i <= 120; i++) { const z = zTop * i / 120; a.push([z, 0.5 * RHO * Math.pow(u(z), 3)]); b.push([z, 0.5 * RHO * Math.pow(uAlt(z), 3)]); }
        plot.set({ series: [{ pts: a, label: V.law === 'log' ? 'log law' : 'power law' }, { pts: b, label: V.law === 'log' ? 'power law' : 'log law', dash: [5, 4] }], x: { label: 'height (m)', min: 0, max: zTop },
          vlines: [{ x: V.hub - Rr, label: 'rotor bottom' }, { x: V.hub + Rr, label: 'top' }], marks: [{ x: V.hub, y: 0.5 * RHO * uh * uh * uh, label: 'hub' }] });
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const yb = H - 26, yt = 14, Y = z => yb - z / zTop * (yb - yt);
        const x0 = 50, xp = Math.round(W * 0.38), Xu = v => x0 + v / uMax * (xp - x0);
        // the profile panel
        c.lineWidth = 1; c.strokeStyle = C.grid;
        const sz = Hyper.niceStep(zTop, 5);
        for (let z = 0; z <= zTop + 1e-9; z += sz) { c.beginPath(); c.moveTo(x0, Y(z)); c.lineTo(xp, Y(z)); c.stroke(); kit.label(c, z + ' m', x0 - 5, Y(z), { align: 'right', size: 10.5, color: C.muted }); }
        const su = Hyper.niceStep(uMax, 4);
        for (let v = 0; v <= uMax + 1e-9; v += su) { c.beginPath(); c.moveTo(Xu(v), yt); c.lineTo(Xu(v), yb); c.stroke(); kit.label(c, String(+v.toFixed(2)), Xu(v), yb + 12, { align: 'center', size: 10.5, color: C.muted }); }
        kit.label(c, 'wind (m/s)', xp, yb + 12, { align: 'right', size: 10.5, color: C.muted, weight: 700 });
        for (let i = 1; i <= 9; i++) { const z = zTop * i / 10; kit.arrow(c, x0, Y(z), Xu(u(z)), Y(z), kit.hue(205, 0.5), 1.4); }
        const curve = (f, col, dash, wdt) => { c.strokeStyle = col; c.lineWidth = wdt; c.setLineDash(dash || []); c.beginPath(); for (let i = 0; i <= 200; i++) { const z = Math.max(0.01, zTop * i / 200), x = Xu(Math.min(uMax * 1.05, f(z))); if (i) c.lineTo(x, Y(z)); else c.moveTo(x, Y(z)); } c.stroke(); c.setLineDash([]); };
        curve(uAlt, C.muted, [5, 4], 1.4);
        curve(u, C.accent, null, 2.4);
        kit.dot(c, Xu(u(10)), Y(10), 4, C.text);
        kit.label(c, '10 m: ' + V.u10.toFixed(1) + ' m/s', Xu(u(10)) + 7, Y(10) - 8, { size: 10.5, color: C.text });
        kit.dot(c, Xu(u(V.hub)), Y(V.hub), 5, C.warn, C.surface);
        // the scene
        const xs = xp + 22, xe = W - 10;
        const g = c.createLinearGradient(0, yt, 0, yb);
        g.addColorStop(0, C.dark ? 'hsl(215 45% 15%)' : 'hsl(205 70% 86%)'); g.addColorStop(1, C.dark ? 'hsl(210 35% 22%)' : 'hsl(200 60% 96%)');
        c.fillStyle = g; c.fillRect(xs, yt, xe - xs, yb - yt);
        const tt = +V.ter;
        c.fillStyle = tt === 0 ? kit.hue(205, 0.6) : C.dark ? 'hsl(100 20% 25%)' : 'hsl(100 28% 55%)';
        c.fillRect(xs, yb, xe - xs, H - yb);
        c.fillStyle = C.dark ? 'hsl(100 18% 30%)' : 'hsl(110 25% 42%)';
        if (tt === 2) for (let x = xs + 20; x < xe; x += 70) { c.beginPath(); c.ellipse(x, yb, 16, Math.max(2, 3 / zTop * (yb - yt)), 0, Math.PI, 0); c.fill(); }
        if (tt >= 3) {
          for (let x = xs + 6, i = 0; x < xe - 10; x += tt === 4 ? 24 : 30, i++) {
            const hgt = (tt === 4 ? 12 + 22 * Math.abs(Math.sin(i * 2.3)) : 6 + 5 * Math.abs(Math.sin(i * 1.7))) / zTop * (yb - yt);
            c.fillStyle = tt === 4 ? (C.dark ? 'hsl(220 10% 35%)' : 'hsl(220 10% 60%)') : (C.dark ? 'hsl(110 20% 28%)' : 'hsl(110 25% 38%)');
            c.fillRect(x, yb - hgt, tt === 4 ? 18 : 22, hgt);
          }
        }
        // streaks moving at the local wind speed
        while (parts.length < 110) parts.push({ x: xs + Math.random() * (xe - xs), z: Math.random() * zTop });
        c.strokeStyle = C.dark ? 'rgba(220,235,255,0.55)' : 'rgba(40,80,140,0.45)'; c.lineWidth = 1.3;
        for (const q of parts) {
          const sp = u(q.z) * 9;
          q.x += sp * dt;
          if (q.x > xe || q.z > zTop) { q.x = xs; q.z = Math.random() * zTop; }
          if (q.z < 0.5) continue;
          c.beginPath(); c.moveTo(q.x, Y(q.z)); c.lineTo(Math.max(xs, q.x - sp * 0.25 - 2), Y(q.z)); c.stroke();
        }
        // the turbine
        const xt = (xs + xe) / 2, yh = Y(V.hub), rpx = Rr / zTop * (yb - yt);
        c.strokeStyle = C.text; c.fillStyle = C.surface; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(xt - 4, yb); c.lineTo(xt - 2, yh); c.lineTo(xt + 2, yh); c.lineTo(xt + 4, yb); c.closePath(); c.fill(); c.stroke();
        c.beginPath(); c.arc(xt, yh, rpx, 0, Math.PI * 2); c.fillStyle = kit.hue(45, 0.08); c.fill(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.stroke(); c.setLineDash([]);
        phi += dt * 7 * u(V.hub) / Math.max(1, Rr);
        c.strokeStyle = C.text; c.lineWidth = 3; c.lineCap = 'round';
        for (let k = 0; k < 3; k++) { const a = phi + k * 2 * Math.PI / 3; c.beginPath(); c.moveTo(xt, yh); c.lineTo(xt + Math.cos(a) * rpx, yh + Math.sin(a) * rpx); c.stroke(); }
        c.lineCap = 'butt';
        kit.dot(c, xt, yh, 4, C.text);
        kit.label(c, u(V.hub + Rr).toFixed(1) + ' m/s', xt + rpx + 6, Y(V.hub + Rr), { size: 11, weight: 700, color: C.text, bg: C.surface });
        kit.label(c, u(Math.max(0.1, V.hub - Rr)).toFixed(1) + ' m/s', xt + rpx + 6, Y(V.hub - Rr), { size: 11, weight: 700, color: C.text, bg: C.surface });
        kit.label(c, 'hub ' + u(V.hub).toFixed(1) + ' m/s', xt - rpx - 6, yh, { align: 'right', size: 11, weight: 700, color: C.warn, bg: C.surface });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ flying through a gust */
  Hyper.sim('atm-gust', {
    title: 'Flying through a gust',
    blurb: `An aircraft flies through a vertical gust — a single "1 − cos" gust like those used for certification, or continuous random turbulence. The gust tilts the relative wind, the angle of attack and the lift jump, and the aircraft starts to rise with the gust, which softens the blow. The motion (plunge only, at constant pitch) is integrated in small steps and shown at quarter speed; the lift cannot exceed what the wing gives at $C_{L,\\max}$. The plot shows the load factor, with the sharp-edged and Pratt estimates for comparison.

**Try this**
- Send the same 7.6 m/s gust into the glider, the light aircraft and the airliner. Which is jolted hardest, and why?
- Slow the light aircraft from 140 to 80 kt: the jolt shrinks in proportion to the speed.
- Make the gust longer (larger gradient distance): the aircraft has time to rise with it and the peak falls below the sharp-edged value.
- Try a strong gust at low speed: the wing reaches $C_{L,\\max}$ and stalls momentarily instead of loading the structure — the idea behind the manoeuvring and turbulence speeds.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 380 });
      const plot = kit.plot(graphBox(box), { x: { label: 'time (s)' }, y: { label: 'load factor n' }, legend: true }, 170);
      const AC = [
        { name: 'glider', WS: 330, c: 0.9, a: 5.3, CLmax: 1.4, CLmin: -0.8, nmax: 5.3, nmin: -2.65, V: 58 },
        { name: 'light aircraft', WS: 670, c: 1.5, a: 4.8, CLmax: 1.5, CLmin: -0.9, nmax: 3.8, nmin: -1.52, V: 107 },
        { name: 'airliner', WS: 6000, c: 4.2, a: 5.0, CLmax: 1.4, CLmin: -0.9, nmax: 2.5, nmin: -1, V: 250 }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'ac', type: 'select', label: 'Aircraft', options: [['Glider (W/S 330 N/m²)', 0], ['Light aircraft (W/S 670 N/m²)', 1], ['Airliner at low level (W/S 6000 N/m²)', 2]], value: 1 },
        { id: 'V', label: 'Airspeed', min: 40, max: 320, step: 1, value: 107, unit: 'kt' },
        { id: 'U', label: 'Gust velocity', min: 0, max: 20, step: 0.1, value: 7.6, unit: 'm/s' },
        { id: 'H', label: 'Gust gradient distance', min: 5, max: 150, step: 1, value: 19, unit: 'm' },
        { id: 'mode', type: 'select', label: 'Air', options: [['A single "1 − cos" gust', 'one'], ['Continuous turbulence', 'cont']], value: 'one' },
        { type: 'buttons', items: [{ id: 'go', label: 'Send a gust', primary: true }] }
      ], (id, v) => {
        if (id === 'ac') { ctl.set('V', AC[v].V); ctl.set('H', Math.round(12.5 * AC[v].c)); }
        if (id === 'go') sendGust(); else if (id !== 'U' && id !== 'H') { resetRun(); }
        info();
      });
      const ro = kit.readout(box.side, [['ws', 'Trim lift coefficient'], ['mu', 'Mass ratio μ_g and Pratt factor K_g'], ['da', 'Gust angle Δα = atan(U/V)'], ['dn', 'Δn sharp-edged / Pratt'], ['pk', 'Peak load factor (last gust)'], ['stall', 'The wing stalls above'], ['note', '']]);
      const V = ctl.values, RHO = 1.225, LW = 150, SLOW = 0.25, DTS = 0.002;
      let s = 0, w = 0, zz = 0, t = 0, gusts = [], tr = [], nNow = 1, peak = 1, stalled = false, lastGust = -10, frame = 0;
      let rand = rng(7), turb = { k0: 0, arr: [0] };
      const ac = () => AC[+V.ac];
      const Veff = () => { const A = ac(), Vs = Math.sqrt(2 * A.WS / (RHO * A.CLmax)); return Math.max(V.V * KT, 1.05 * Vs); };
      function turbAt(x) {                       // continuous turbulence: an Ornstein–Uhlenbeck process in distance, 1 m steps
        const k = Math.floor(x);
        while (turb.k0 + turb.arr.length - 1 < k + 1) {
          const last = turb.arr[turb.arr.length - 1], a = Math.exp(-1 / LW);
          turb.arr.push(last * a + (V.U / 2) * Math.sqrt(1 - a * a) * gauss(rand));
          if (turb.arr.length > 4000) { turb.arr.splice(0, 1000); turb.k0 += 1000; }
        }
        const i = clamp(k - turb.k0, 0, turb.arr.length - 2), u = x - Math.floor(x);
        return turb.arr[i] * (1 - u) + turb.arr[i + 1] * u;
      }
      function gustAt(x) {
        let wg = 0;
        for (const g of gusts) { const d = x - g.s0; if (d > 0 && d < 2 * g.H) wg += g.U / 2 * (1 - Math.cos(Math.PI * d / g.H)); }
        if (V.mode === 'cont' && x > 0) wg += turbAt(x);
        return wg;
      }
      const viewW = () => clamp(Veff() * 2.2, 100, 420);
      function sendGust() { gusts.push({ s0: s + viewW() * 0.45, H: V.H, U: V.U }); lastGust = t; peak = 1; }
      function resetRun() { w = 0; zz = 0; gusts = []; tr = []; peak = 1; lastGust = t; rand = rng(7); turb = { k0: Math.floor(s), arr: [0] }; }
      function info() {
        const A = ac(), Vv = Veff(), CLt = 2 * A.WS / (RHO * Vv * Vv), mu = 2 * A.WS / (RHO * A.c * A.a * G0), Kg = 0.88 * mu / (5.3 + mu);
        const dns = RHO * Vv * A.a * V.U / (2 * A.WS);
        ro.set('ws', CLt.toFixed(3) + ' at ' + (Vv / KT).toFixed(0) + ' kt' + (Vv > V.V * KT + 0.01 ? ' (raised to 1.05 V_s: slower cannot fly level)' : ''));
        ro.set('mu', mu.toFixed(1) + ', K_g = ' + Kg.toFixed(2));
        ro.set('da', (Math.atan(V.U / Vv) / D2R).toFixed(1) + '°');
        ro.set('dn', dns.toFixed(2) + ' / ' + (Kg * dns).toFixed(2));
        ro.set('stall', 'n = ' + (A.CLmax / CLt).toFixed(2) + ' (limit load ' + A.nmax + ' g)');
        return { CLt, dns, Kg };
      }
      function step(dt) {
        const A = ac(), Vv = Veff(), CLt = 2 * A.WS / (RHO * Vv * Vv);
        const wg = gustAt(s);
        let CL = CLt + A.a * (wg - w) / Vv;
        stalled = CL > A.CLmax || CL < A.CLmin;
        CL = clamp(CL, A.CLmin, A.CLmax);
        nNow = CL / CLt;
        w += G0 * (nNow - 1) * dt; zz += w * dt; s += Vv * dt; t += dt;
        w *= 1 - 0.05 * dt; zz *= 1 - 0.3 * dt;          // the pilot gently returns to the flight path
        peak = Math.abs(nNow - 1) > Math.abs(peak - 1) ? nNow : peak;
        return wg;
      }
      const loop = kit.loop(dt => {
        let simT = dt * SLOW, wg = 0;
        while (simT > 1e-9) { const h = Math.min(DTS, simT); wg = step(h); simT -= h; }
        if (dt > 0) { tr.push([t, nNow, wg]); while (tr.length > 2 && t - tr[0][0] > 3) tr.shift(); }
        if (V.mode === 'one' && t - lastGust > 3.2 && !gusts.some(g => g.s0 + 2 * g.H > s - 5)) sendGust();
        gusts = gusts.filter(g => g.s0 + 2 * g.H > s - viewW());
        const inf = info();
        const A = ac();
        ro.set('pk', 'n = ' + peak.toFixed(2) + (peak > A.nmax || peak < A.nmin ? ' — beyond the limit load!' : ''));
        ro.set('note', stalled ? 'wing at its maximum lift: momentarily stalled' : '');
        if (frame++ % 3 === 0) plot.set({ series: [{ pts: tr.map(q => [q[0], q[1]]), label: 'load factor n' }, { pts: tr.map(q => [q[0], 1 + q[2] / Math.max(1, V.U) * inf.Kg * inf.dns]), label: 'gust shape (scaled)', dash: [4, 4] }],
          hlines: [{ y: 1 + inf.dns, label: 'sharp-edged 1 + Δn' }, { y: 1 + inf.Kg * inf.dns, label: 'Pratt' }, { y: A.nmax, label: 'limit load', color: C0().bad }], x: { label: 'time (s)', min: Math.max(0, t - 3), max: Math.max(3, t) } });
        draw();
      }, box.stage);
      const C0 = () => kit.colors();
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, vw = viewW(), k = W / vw, xa = W * 0.35, ym = H * 0.55;
        const g = c.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, C.dark ? 'hsl(215 45% 15%)' : 'hsl(205 70% 88%)'); g.addColorStop(1, C.dark ? 'hsl(210 35% 22%)' : 'hsl(200 60% 97%)');
        c.fillStyle = g; c.fillRect(0, 0, W, H);
        c.strokeStyle = C.faint; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(0, ym); c.lineTo(W, ym); c.stroke(); c.setLineDash([]);
        const x0 = s - xa / k;
        const sp = 14, off = ((x0 * k) % sp + sp) % sp;
        for (let px = -off; px < W; px += sp) {
          const wg = gustAt(x0 + px / k);
          if (Math.abs(wg) < 0.05) continue;
          const len = clamp(wg * 7, -H * 0.4, H * 0.4);
          kit.arrow(c, px, ym + 26 + len / 2, px, ym + 26 - len / 2, wg > 0 ? kit.hue(8, 0.55) : kit.hue(215, 0.55), 1.4);
        }
        const yA = ym - clamp(zz * 25, -H * 0.4, H * 0.4);
        plane(c, xa, yA, 24, 0, stalled ? C.warn : C.surface, C.text);
        kit.label(c, 'n = ' + nNow.toFixed(2), xa, yA - 26, { align: 'center', size: 13, weight: 700, color: nNow > ac().nmax ? C.bad : C.text, bg: C.surface });
        kit.label(c, (Veff() / KT).toFixed(0) + ' kt →', 10, 14, { size: 12, color: C.muted, weight: 700 });
        kit.label(c, 'vertical motion ×25, shown at quarter speed', W - 10, 14, { align: 'right', size: 11, color: C.muted });
        kit.label(c, grp(vw) + ' m of air in view', W - 10, H - 12, { align: 'right', size: 11, color: C.muted });
      }
      info();
      sendGust();
      loop.start();
    }
  });

  /* ================================================================ a microburst on the approach */
  Hyper.sim('atm-microburst', {
    title: 'A microburst on the approach',
    blurb: `A 60-tonne twin-jet flies a 3° approach at 140 kt towards the runway on the right, through a microburst: a downdraft that spreads out along the ground, giving first a headwind, then a downdraft, then a tailwind. The aircraft is a point mass with lift, drag and thrust (the engines take seconds to spool up), flown through the wind field by one of four pilots. The on-board warning computes the F-factor and alerts above 0.1. Heights are exaggerated about six times; the approach runs five times faster than real time.

**Try this**
- "No reaction": the aircraft is pushed below the glide path and meets the ground short of the runway. Look at the airspeed plot.
- "Hold airspeed by lowering the nose" — the instinctive reaction — is worse.
- "Fly the glide path" with the autothrottle gets through this burst — but see how far it sinks below the glide path and how low the airspeed gets. Make the burst stronger and move it to 2 km from the runway.
- "Escape": full thrust and 15° pitch after the alert. Try a longer crew reaction time.

This is a teaching model with round numbers, not an aircraft procedure.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 460 });
      const gb = graphBox(box);
      const plotV = kit.plot(gb, { x: { label: 'distance to the runway threshold (km)', min: -9.5, max: 1.5 }, y: { label: 'airspeed (kt)', min: 80, max: 170 }, legend: true }, 140);
      const plotF = kit.plot(gb, { x: { label: 'distance to the runway threshold (km)', min: -9.5, max: 1.5 }, y: { label: 'F-factor', min: -0.2, max: 0.4 } }, 120);
      const ctl = kit.controls(box.side, [
        { id: 'U', label: 'Outflow strength', min: 0, max: 25, step: 0.5, value: 14, unit: 'm/s' },
        { id: 'R', label: 'Radius of the strongest outflow', min: 500, max: 2000, step: 50, value: 1000, unit: 'm' },
        { id: 'xc', label: 'Burst centre before the runway', min: 1, max: 7, step: 0.1, value: 3, unit: 'km' },
        { id: 'mode', type: 'select', label: 'Pilot', options: [['No reaction: hold attitude and thrust', 'none'], ['Hold airspeed by lowering the nose', 'speed'], ['Fly the glide path, autothrottle on', 'path'], ['Escape: full thrust, pitch 15° after the alert', 'escape']], value: 'none' },
        { id: 'delay', label: 'Crew reaction time after the alert', min: 0, max: 10, step: 0.5, value: 3, unit: 's' },
        { type: 'buttons', items: [{ id: 'go', label: 'Fly the approach again', primary: true }] }
      ], () => start());
      const ro = kit.readout(box.side, [['V', 'Airspeed / ground speed'], ['h', 'Height'], ['wind', 'Wind'], ['F', 'F-factor'], ['thr', 'Thrust'], ['al', 'Angle of attack'], ['st', 'Status']]);
      const V = ctl.values;
      const M = 60000, S = 122.6, A = 5.0, A0 = -12 * D2R, ASS = 15 * D2R, AST = 17.8 * D2R, TMAX = 150000, RHO = 1.225;
      const GS = -3 * D2R, VREF = 140 * KT, XS = -9000, XAIM = 300, DT = 0.02, SPEED = 5;
      const CLf = al => (al <= AST ? A * (al - A0) : A * (AST - A0) * (1 - 0.3 * Math.min(1, (al - AST) / (5 * D2R))));
      const CDf = cl => 0.08 + 0.045 * cl * cl;
      const H1 = 30, H2 = 300;
      let GMAX = 0;
      for (let h = 0; h < 600; h += 0.5) GMAX = Math.max(GMAX, Math.exp(-h / H2) - Math.exp(-h / H1));
      // the outflow profile: zero at the ground, strongest near 75 m; G is its integral, which sets the downdraft (continuity)
      const gz = h => (Math.exp(-h / H2) - Math.exp(-h / H1)) / GMAX;
      const Gz = h => (H2 * (1 - Math.exp(-h / H2)) - H1 * (1 - Math.exp(-h / H1))) / GMAX;
      function wind(x, h) {
        h = Math.max(0, h);
        const r = (x + V.xc * 1000) / V.R, ex = Math.exp(0.5 * (1 - r * r));
        return { u: V.U * r * ex * gz(h), w: -V.U / V.R * ex * (2 - r * r) * Gz(h) };
      }
      let s0 = null, s = null, trail = [], vPts = [], gsPts = [], fPts = [], hold = 0, frame = 0;
      function trim() {
        let al = 0.1, T = 40000;
        for (let i = 0; i < 100; i++) {
          const q = 0.5 * RHO * VREF * VREF, D = q * S * CDf(CLf(al));
          T = (D + M * G0 * Math.sin(GS)) / Math.cos(al);
          al = (M * G0 * Math.cos(GS) - T * Math.sin(al)) / (q * S) / A + A0;
        }
        return { al, T };
      }
      function start() {
        if (!s0) s0 = trim();
        s = { x: XS, h: (XAIM - XS) * Math.tan(-GS), V: VREF, gam: GS, th: s0.al + GS, T: s0.T, t: 0, Ff: 0, alert: null, esc: false, end: null, minV: VREF, F: 0, alpha: s0.al, wu: 0, ww: 0, dev: 0 };
        trail = []; vPts = []; gsPts = []; fPts = []; hold = 0;
      }
      function step(dt) {
        if (s.end) return;
        const w = wind(s.x, s.h), d = 0.5;
        const ux = (wind(s.x + d, s.h).u - wind(s.x - d, s.h).u) / (2 * d), uh = (wind(s.x, s.h + d).u - wind(s.x, s.h - d).u) / (2 * d);
        const wx = (wind(s.x + d, s.h).w - wind(s.x - d, s.h).w) / (2 * d), wh = (wind(s.x, s.h + d).w - wind(s.x, s.h - d).w) / (2 * d);
        const xd = s.V * Math.cos(s.gam) + w.u, hd = s.V * Math.sin(s.gam) + w.w;
        const Wxd = ux * xd + uh * hd, Whd = wx * xd + wh * hd;
        s.F = Wxd / G0 - w.w / s.V; s.Ff += (s.F - s.Ff) * dt / 1.0;
        if (s.Ff > 0.1 && s.alert === null) s.alert = s.t;
        const thTrim = s0.al + GS, hgs = (XAIM - s.x) * Math.tan(-GS);
        let thc = thTrim, Tc = s0.T;
        const glide = () => { thc = thTrim + 0.002 * (hgs - s.h) + 0.01 * (VREF * Math.sin(GS) - hd); Tc = s0.T + M * 0.15 * (VREF - s.V); };
        if (!s.esc) s.dev = Math.max(s.dev, hgs - s.h);
        if (V.mode === 'speed') thc = thTrim + 0.8 * D2R * (s.V - VREF);
        else if (V.mode === 'path') glide();
        else if (V.mode === 'escape') {
          if (s.alert !== null && s.t - s.alert >= V.delay) s.esc = true;
          if (s.esc) { thc = 15 * D2R; Tc = TMAX; } else glide();
        }
        if (V.mode !== 'none') thc = Math.min(thc, s.gam + ASS);          // the stick shaker limit
        Tc = clamp(Tc, 0.05 * TMAX, TMAX);
        s.th += clamp(thc - s.th, -3 * D2R * dt, 3 * D2R * dt);
        const tau = Tc > s.T ? 1.2 + 4.0 * (1 - s.T / TMAX) : 1.0;       // engines spool up slowly from low thrust
        s.T += (Tc - s.T) * dt / tau;
        const al = s.th - s.gam, q = 0.5 * RHO * s.V * s.V, cl = CLf(al), L = q * S * cl, D = q * S * CDf(cl);
        const Vd = (s.T * Math.cos(al) - D) / M - G0 * Math.sin(s.gam) - (Wxd * Math.cos(s.gam) + Whd * Math.sin(s.gam));
        const gd = ((s.T * Math.sin(al) + L) / M - G0 * Math.cos(s.gam) + (Wxd * Math.sin(s.gam) - Whd * Math.cos(s.gam))) / s.V;
        s.V = Math.max(20, s.V + Vd * dt); s.gam += gd * dt; s.x += xd * dt; s.h += hd * dt; s.t += dt;
        s.alpha = al; s.wu = w.u; s.ww = w.w; s.minV = Math.min(s.minV, s.V);
        if (s.h <= 0) { s.h = 0; s.end = s.x < 0 ? 'short' : 'landed'; }
        else if (s.h > 620 || s.x > 1500) s.end = s.gam > 0 ? 'escaped' : 'past';
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const xl = 10, xr = W - 10, yb = H - 22, yt = 10, XMIN = -9500, XMAX = 1500, HMAX = 650;
        const X = x => xl + (x - XMIN) / (XMAX - XMIN) * (xr - xl), Y = h => yb - h / HMAX * (yb - yt);
        const g = c.createLinearGradient(0, yt, 0, yb);
        g.addColorStop(0, C.dark ? 'hsl(220 35% 14%)' : 'hsl(210 45% 80%)'); g.addColorStop(1, C.dark ? 'hsl(215 30% 20%)' : 'hsl(205 55% 94%)');
        c.fillStyle = g; c.fillRect(0, 0, W, yb);
        if (V.U > 0) {
          const xc = -V.xc * 1000, gw = c.createLinearGradient(X(xc - V.R), 0, X(xc + V.R), 0);
          const a = 0.05 + 0.2 * V.U / 25;
          gw.addColorStop(0, 'rgba(90,100,120,0)'); gw.addColorStop(0.5, 'rgba(90,100,120,' + a.toFixed(3) + ')'); gw.addColorStop(1, 'rgba(90,100,120,0)');
          c.fillStyle = gw; c.fillRect(X(xc - V.R), 0, X(xc + V.R) - X(xc - V.R), yb);
        }
        for (let i = 0; i <= 26; i++) for (let j = 1; j <= 6; j++) {
          const x = XMIN + (XMAX - XMIN) * (i + 0.5) / 27, h = HMAX * j / 7, w = wind(x, h);
          const sp = Math.hypot(w.u, w.w);
          if (sp < 0.4) continue;
          const px = X(x), py = Y(h), k = 1.6;
          kit.arrow(c, px - w.u * k / 2, py + w.w * k / 2, px + w.u * k / 2, py - w.w * k / 2, C.dark ? 'rgba(200,215,240,0.55)' : 'rgba(40,60,110,0.5)', 1.2, 5);
        }
        c.fillStyle = C.dark ? 'hsl(100 15% 22%)' : 'hsl(100 25% 58%)'; c.fillRect(0, yb, W, H - yb);
        c.fillStyle = C.dark ? 'hsl(0 0% 35%)' : 'hsl(0 0% 35%)'; c.fillRect(X(0), yb - 2, X(1500) - X(0), 5);
        c.strokeStyle = C.muted; c.setLineDash([6, 5]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(XMIN), Y((XAIM - XMIN) * Math.tan(-GS))); c.lineTo(X(XAIM), Y(0)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'glide path 3°', X(-8600), Y((XAIM + 8600) * Math.tan(-GS)) - 12, { size: 10.5, color: C.muted });
        kit.label(c, 'runway', X(750), yb + 11, { align: 'center', size: 10.5, color: C.text });
        if (trail.length > 1) {
          c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
          trail.forEach((p, i) => { if (i) c.lineTo(X(p[0]), Y(p[1])); else c.moveTo(X(p[0]), Y(p[1])); });
          c.stroke();
        }
        if (s) {
          plane(c, X(s.x), Y(s.h), 12, s.th, s.end === 'short' ? C.bad : C.surface, C.text);
          if (s.alert !== null && !s.end) kit.label(c, 'WINDSHEAR', X(s.x), Y(s.h) - 22, { align: 'center', size: 12, weight: 800, color: C.bad, bg: C.surface });
          if (s.esc && !s.end) kit.label(c, 'escape: full thrust', X(s.x), Y(s.h) + 22, { align: 'center', size: 11, weight: 700, color: C.warn, bg: C.surface });
          const msg = s.end === 'short' ? 'The flight path met the ground ' + grp(-s.x) + ' m short of the runway' : s.end === 'landed' ? 'Landed ' + grp(s.x) + ' m past the threshold — it sank ' + grp(s.dev) + ' m below the glide path; lowest airspeed ' + (s.minV / KT).toFixed(0) + ' kt' : s.end === 'escaped' ? 'Escaped: climbing away (lowest airspeed ' + (s.minV / KT).toFixed(0) + ' kt)' : s.end === 'past' ? 'Flew past the runway' : null;
          if (msg) kit.label(c, msg, W / 2, yt + 14, { align: 'center', size: 13.5, weight: 800, color: s.end === 'short' ? C.bad : C.ok, bg: C.surface });
        }
        kit.label(c, 'heights ×6', xr, yb - 10, { align: 'right', size: 10.5, color: C.muted });
      }
      const loop = kit.loop(dt => {
        if (!s) start();
        if (s.end) { hold += dt; if (hold > 3.5) start(); }
        else {
          let simT = dt * SPEED;
          while (simT > 1e-9 && !s.end) { const h = Math.min(DT, simT); step(h); simT -= h; }
          const last = trail[trail.length - 1];
          if (!last || Math.abs(s.x - last[0]) > 25) {
            trail.push([s.x, s.h]);
            const gsp = s.V * Math.cos(s.gam) + s.wu;
            vPts.push([s.x / 1000, s.V / KT]); gsPts.push([s.x / 1000, gsp / KT]); fPts.push([s.x / 1000, clamp(s.F, -0.2, 0.4)]);
          }
        }
        const C = kit.colors();
        if (frame++ % 4 === 0) {
          const vss = Math.sqrt(2 * M * G0 / (RHO * S * CLf(ASS))) / KT;
          plotV.set({ series: [{ pts: vPts, label: 'airspeed' }, { pts: gsPts, label: 'ground speed', dash: [5, 4] }], hlines: [{ y: 140, label: 'approach speed' }, { y: vss, label: 'stick shaker (1 g)', color: C.bad }] });
          plotF.set({ series: [{ pts: fPts, label: 'F-factor' }], hlines: [{ y: 0.1, label: 'alert 0.1', color: C.bad }, { y: 0 }] });
        }
        const head = -s.wu;
        ro.set('V', (s.V / KT).toFixed(0) + ' kt / ' + ((s.V * Math.cos(s.gam) + s.wu) / KT).toFixed(0) + ' kt');
        ro.set('h', grp(s.h / FT) + ' ft (' + grp(s.h) + ' m)');
        ro.set('wind', (head >= 0 ? 'headwind ' : 'tailwind ') + (Math.abs(head) / KT).toFixed(0) + ' kt, ' + (s.ww < 0 ? 'downdraft ' : 'updraft ') + grp(Math.abs(s.ww) / FT * 60) + ' ft/min');
        ro.set('F', sfix(s.F, 3) + (s.alert !== null ? '  — alert at ' + (s.x / 1000).toFixed(1) + ' km' : ''));
        ro.set('thr', (s.T / TMAX * 100).toFixed(0) + ' % of maximum');
        ro.set('al', (s.alpha / D2R).toFixed(1) + '° (stick shaker at 15°)');
        ro.set('st', s.end ? (s.end === 'short' ? 'short of the runway' : s.end) : s.esc ? 'escape manoeuvre' : s.alert !== null ? 'wind-shear alert' : 'on the approach');
        draw();
      }, box.stage);
      start();
      loop.start();
    }
  });

  /* ================================================================ droplets and ice */
  Hyper.sim('atm-droplets', {
    title: 'Supercooled droplets meet a leading edge',
    blurb: `Supercooled droplets carried by the air towards a cylinder — a probe, an antenna or, at larger sizes, the rounded nose of a wing. The air (faint streamlines, potential flow) bends round the body; each droplet feels the air's drag (Stokes's law with a Reynolds-number correction) and lags behind its turns according to its inertia, measured by the Stokes number $K$. Droplets that hit freeze where they strike, and the ice builds up on the surface (exaggerated). The plot shows the local collection efficiency β around the leading edge.

**Try this**
- Start with 20 µm droplets on a 10 cm cylinder at 70 m/s, then shrink the cylinder to 1 cm: far more of the droplets in its path hit it. Thin parts ice first.
- Make the droplets 200 µm (freezing drizzle): they hit almost everything in their path and strike far back round the sides — beyond where a wing's protection reaches.
- Slow down to 25 m/s with small droplets and a large body: most of them slip past.
- Clear the ice and watch where it grows fastest: at the stagnation line.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280, maxH: 480 });
      const plot = kit.plot(graphBox(box), { x: { label: 'angle round the surface from the stagnation line (°)', min: -90, max: 90 }, y: { label: 'local collection efficiency β', min: 0, max: 1 } }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Droplet diameter', min: 5, max: 500, value: 20, unit: 'µm', log: true, sig: 2 },
        { id: 'D', label: 'Body diameter', min: 0.5, max: 100, value: 10, unit: 'cm', log: true, sig: 2 },
        { id: 'V', label: 'Airspeed', min: 20, max: 200, step: 1, value: 70, unit: 'm/s' },
        { id: 'lwc', label: 'Liquid water content', min: 0.1, max: 2, step: 0.05, value: 0.5, unit: 'g/m³' },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the ice', primary: true }] }
      ], id => { if (id === 'clear') ice.fill(0); else solve(); });
      const ro = kit.readout(box.side, [['K', 'Stokes number K = ρ_w d²V/(18μR)'], ['tau', 'Droplet response time'], ['E', 'Collection efficiency E'], ['lim', 'Impingement limits'], ['b0', 'β at the stagnation line'], ['gr', 'Ice growth at the stagnation line'], ['m', 'Ice collected per metre of span']]);
      const V = ctl.values, MU = 1.72e-5, RHOA = 1.3, RHOW = 1000, RHOI = 900, XL = -12;
      let K = 1, reK = 1, yMax = 0, lines = [], ice = new Float64Array(91), parts = [];
      const air = (x, y) => { const r2 = x * x + y * y, r4 = r2 * r2; return [1 - (x * x - y * y) / r4, -2 * x * y / r4]; };
      // advance a droplet by dt (in units of R/V); the drag relaxes its velocity towards the air's over K/f(Re)
      function adv(p, dt) {
        const [ua, va] = air(p.x, p.y), du = p.u - ua, dv = p.v - va, re = reK * Math.hypot(du, dv);
        const f = 1 + 0.15 * Math.pow(re, 0.687), dec = Math.exp(-f * dt / K);
        p.u = ua + du * dec; p.v = va + dv * dec; p.x += p.u * dt; p.y += p.v * dt;
      }
      function shoot(y0, keep) {
        const p = { x: XL, y: y0, u: 1, v: 0 }, pts = keep ? [[XL, y0]] : null;
        for (let n = 0; n < 8000; n++) {
          adv(p, 0.004);
          if (keep && n % 6 === 0) pts.push([p.x, p.y]);
          if (p.x * p.x + p.y * p.y <= 1.0) { if (keep) pts.push([p.x, p.y]); return { hit: true, th: Math.atan2(p.y, -p.x), pts }; }
          if (p.x > 2.5) return { hit: false, pts };
        }
        return { hit: false, pts };
      }
      function solve() {
        const d = V.d * 1e-6, R = V.D / 200;
        K = RHOW * d * d * V.V / (18 * MU * R);
        reK = RHOA * V.V * d / MU;
        let lo = 0, hi = 1.05;
        if (!shoot(1e-4).hit) yMax = 0;
        else { for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (shoot(m).hit) lo = m; else hi = m; } yMax = lo; }
        const beta = [];
        if (yMax > 0) {
          const N = 24; let prev = { y: 0, th: 0 };
          for (let i = 1; i <= N; i++) {
            const y0 = yMax * i / N * 0.999, r = shoot(y0);
            if (!r.hit) break;
            const b = (y0 - prev.y) / Math.max(1e-6, r.th - prev.th), thm = (r.th + prev.th) / 2 / D2R;
            beta.push([thm, clamp(b, 0, 1)]); prev = { y: y0, th: r.th };
          }
        }
        const pts = beta.slice().reverse().map(q => [-q[0], q[1]]).concat(beta);
        lines = [];
        for (let i = -9; i <= 9; i++) { const r = shoot(i * 0.16 + 0.002, true); lines.push(r); }
        if (yMax > 0) { lines.push(Object.assign(shoot(yMax * 0.999, true), { lim: true })); lines.push(Object.assign(shoot(-yMax * 0.999, true), { lim: true })); }
        const thLim = yMax > 0 ? shoot(yMax * 0.999).th / D2R : 0;
        const b0 = beta.length ? beta[0][1] : 0;
        plot.set({ series: [{ pts, label: 'β' }], marks: [] });
        const tau = RHOW * d * d / (18 * MU);
        ro.set('K', K < 0.01 ? K.toExponential(2) : K.toFixed(K < 10 ? 3 : 0));
        ro.set('tau', tau < 1e-3 ? (tau * 1e6).toFixed(0) + ' µs' : (tau * 1e3).toFixed(tau < 0.01 ? 2 : 1) + ' ms');
        ro.set('E', (yMax * 100).toFixed(1) + ' % of the droplets in its path hit');
        ro.set('lim', yMax > 0 ? '±' + thLim.toFixed(0) + '° from the stagnation line' : 'none reach the surface');
        ro.set('b0', b0.toFixed(2));
        const grow = b0 * V.lwc * V.V / RHOI;                                   // mm/s
        ro.set('gr', (grow * 60).toFixed(2) + ' mm per minute');
        ro.set('m', (yMax * V.lwc * V.V * (V.D / 100) * 60).toFixed(0) + ' g per minute');
        parts = [];
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const Rp = clamp(Math.min(W, H) * 0.16, 30, 90), cx = W * 0.63, cy = H / 2;
        const PX = x => cx + x * Rp, PY = y => cy - y * Rp;
        const xl = (0 - cx) / Rp;
        // streamlines of the air: ψ = y(1 − 1/r²)
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const psi of [0.12, 0.35, 0.65, 1.0, 1.45, 2.0, 2.6]) for (const sg of [1, -1]) {
          c.beginPath();
          let first = true;
          for (let px = 0; px <= W; px += 6) {
            const x = (px - cx) / Rp, ymin = Math.abs(x) < 1 ? Math.sqrt(1 - x * x) + 1e-4 : 1e-4;
            let lo = ymin, hi = psi + 3;
            for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2, r2 = x * x + m * m; if (m * (1 - 1 / r2) < psi) lo = m; else hi = m; }
            const y = sg * lo;
            if (first) { c.moveTo(px, PY(y)); first = false; } else c.lineTo(px, PY(y));
          }
          c.stroke();
        }
        // computed droplet paths
        for (const L of lines) {
          if (!L.pts) continue;
          c.strokeStyle = L.lim ? C.warn : L.hit ? kit.hue(205, 0.7) : C.faint; c.lineWidth = L.lim ? 1.8 : 1.2;
          c.beginPath(); L.pts.forEach((p, i) => { const x = PX(p[0]), y = PY(p[1]); if (x < -5) return; if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.stroke();
        }
        // live droplets
        while (parts.length < 160) { const y = (Math.random() * 2 - 1) * 2.4; parts.push({ x: xl + Math.random() * 0.3, y, u: 1, v: 0 }); }
        let simT = Math.min(dt, 0.05) * 3;
        while (simT > 1e-9) {
          const h = Math.min(0.004, simT);
          for (const p of parts) {
            if (p.dead) continue;
            adv(p, h);
            if (p.x * p.x + p.y * p.y <= 1) { const th = Math.atan2(p.y, -p.x) / D2R; if (Math.abs(th) <= 90) ice[Math.round((th + 90) / 2)] += 1; p.dead = true; }
            else if (p.x > (W - cx) / Rp + 0.2) p.dead = true;
          }
          simT -= h;
        }
        parts = parts.filter(p => !p.dead);
        c.fillStyle = kit.hue(205, 0.85);
        for (const p of parts) c.fillRect(PX(p.x) - 1.3, PY(p.y) - 1.3, 2.6, 2.6);
        // the body and its ice
        c.beginPath(); c.arc(cx, cy, Rp, 0, Math.PI * 2); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        const imax = Math.max(1, ...ice);
        c.fillStyle = C.dark ? 'rgba(225,240,255,0.9)' : 'rgba(150,200,235,0.9)';
        c.beginPath();
        for (let i = 0; i <= 90; i++) { const th = (i * 2 - 90) * D2R, tk = 1 + 0.25 * ice[i] / imax * Math.min(1, imax / 40); c.lineTo(cx - Math.cos(th) * Rp * tk, cy - Math.sin(th) * Rp * tk); }
        for (let i = 90; i >= 0; i--) { const th = (i * 2 - 90) * D2R; c.lineTo(cx - Math.cos(th) * Rp, cy - Math.sin(th) * Rp); }
        c.closePath(); c.fill();
        kit.label(c, 'air and droplets →', 10, 14, { size: 12, color: C.muted, weight: 700 });
        kit.label(c, 'body ' + V.D.toFixed(V.D < 2 ? 1 : 0) + ' cm, droplets ' + V.d.toFixed(0) + ' µm, K = ' + (K < 0.01 ? K.toExponential(1) : K.toFixed(2)), 10, H - 12, { size: 11.5, color: C.text, weight: 700 });
      }, box.stage);
      solve();
      loop.start();
    }
  });
})();
