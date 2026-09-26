/* HYPER-PHYSICS · sims/heat.js — simulations for Heat & Thermodynamics.
 *
 *   heat-gas-box         molecules in a box with a piston; pressure measured from wall hits
 *   heat-maxwell         the Maxwell–Boltzmann speed distribution building up from collisions
 *   heat-pv-diagram      isothermal, adiabatic, isobaric and isochoric steps with W, Q and ΔU
 *   heat-engine-cycle    Carnot and Otto cycles, forwards (engine) or backwards (refrigerator)
 *   heat-conduction-bar  the temperature profile along a heated bar, material against material
 *   heat-heating-curve   ice to steam on a steady heater: the latent-heat plateaus
 *   heat-cooling         Newton's law of cooling with a cup of coffee, and the milk puzzle
 *   heat-radiation       Stefan–Boltzmann power, Wien's peak and the colour of a hot body
 *
 * Everything sits inside one function so no helper leaks into the global scope. */
(function () {
  'use strict';
  const KB = 1.380649e-23, AMU = 1.66053906660e-27, RG = 8.314462618, SIGMA = 5.670374419e-8;
  const HP = 6.62607015e-34, CL = 299792458, WIEN = 2.897771955e-3;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const gauss = () => { let u = 0; while (u === 0) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };
  const font = () => getComputedStyle(document.body).fontFamily;
  const fmt = (v, s) => Hyper.util.fmt(v, s || 3);
  /* a theme colour for a fraction 0 (cold, blue) … 1 (hot, red) */
  const hot = (kit, f, a) => kit.hue(240 * (1 - clamp(f, 0, 1)), a);
  /* 1234 J -> "1.23 kJ" */
  function fmtU(v, unit, sig) {
    if (!Number.isFinite(v)) return '—';
    const a = Math.abs(v);
    if (a === 0) return '0 ' + unit;
    for (const [f, p] of [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ']]) if (a >= f * 0.9995) return fmt(v / f, sig) + ' ' + p + unit;
    return fmt(v, sig) + ' ' + unit;
  }
  function fmtTime(s) {
    if (!Number.isFinite(s)) return '—';
    if (s < 120) return fmt(s, 3) + ' s';
    if (s < 7200) return fmt(s / 60, 3) + ' min';
    if (s < 172800) return fmt(s / 3600, 3) + ' h';
    return fmt(s / 86400, 3) + ' days';
  }
  /* Axes with a grid inside the rectangle o = {x0, y0, w, h, xmin, xmax, ymin, ymax, xlabel, ylabel, xlog, ylog};
     returns the maps X(value) and Y(value) to canvas pixels. */
  function axes(c, kit, o) {
    const C = kit.colors();
    const fx = v => (o.xlog ? Math.log10(v) : v), fy = v => (o.ylog ? Math.log10(v) : v);
    const X = v => o.x0 + (fx(v) - fx(o.xmin)) / (fx(o.xmax) - fx(o.xmin)) * o.w;
    const Y = v => o.y0 + o.h - (fy(v) - fy(o.ymin)) / (fy(o.ymax) - fy(o.ymin)) * o.h;
    const ticks = (lo, hi, log) => {
      const out = [];
      if (!(hi > lo)) return out;
      if (log) { for (let e = Math.ceil(Math.log10(lo) - 1e-9); e <= Math.floor(Math.log10(hi) + 1e-9); e++) out.push(Math.pow(10, e)); return out; }
      const s = Hyper.niceStep(hi - lo, 6);
      for (let v = Math.ceil(lo / s - 1e-9) * s; v <= hi + s * 1e-6; v += s) out.push(Math.abs(v) < s * 1e-9 ? 0 : v);
      return out;
    };
    c.save();
    c.font = '11px ' + font(); c.lineWidth = 1; c.strokeStyle = C.grid; c.fillStyle = C.muted;
    for (const v of ticks(o.xmin, o.xmax, o.xlog)) {
      const x = X(v);
      c.beginPath(); c.moveTo(Math.round(x) + 0.5, o.y0); c.lineTo(Math.round(x) + 0.5, o.y0 + o.h); c.stroke();
      c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText(fmt(v, 3), x, o.y0 + o.h + 4);
    }
    for (const v of ticks(o.ymin, o.ymax, o.ylog)) {
      const y = Y(v);
      c.beginPath(); c.moveTo(o.x0, Math.round(y) + 0.5); c.lineTo(o.x0 + o.w, Math.round(y) + 0.5); c.stroke();
      c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(fmt(v, 3), o.x0 - 5, y);
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.3;
    c.beginPath(); c.moveTo(o.x0, o.y0); c.lineTo(o.x0, o.y0 + o.h); c.lineTo(o.x0 + o.w, o.y0 + o.h); c.stroke();
    c.fillStyle = C.text2; c.font = '600 11.5px ' + font();
    c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(o.xlabel || '', o.x0 + o.w, o.y0 + o.h - 4);
    c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(o.ylabel || '', o.x0 + 6, o.y0 + 2);
    c.restore();
    return { X, Y };
  }

  /* ------------------------------------------------------------------ a hard-sphere gas
     Box [0,Lx]×[0,Ly]×[0,Lz]. Lengths in nm, times in ps, velocities in nm/ps (= km/s),
     masses in u. The wall at x = Lx is a piston moving at G.u. Wall impulses add up in G.imp. */
  function makeGas(cap) {
    const G = {
      N: 0, x: new Float64Array(cap), y: new Float64Array(cap), z: new Float64Array(cap),
      vx: new Float64Array(cap), vy: new Float64Array(cap), vz: new Float64Array(cap),
      m: new Float64Array(cap), sp: new Uint8Array(cap), ord: new Int32Array(cap),
      Lx: 100, Ly: 60, Lz: 60, d: 2.5, wr: 1.25, u: 0, imp: 0, coll: 0
    };
    // wr: how far from a wall a molecule's centre turns back (its radius, or 0 when the
    // box dimensions are meant as the room the centres have, as for an ideal gas)
    G.fill = function (N, mass, T, species) {
      G.N = N = Math.max(1, Math.min(N | 0, cap));
      const r = G.wr;
      for (let i = 0; i < N; i++) {
        G.m[i] = mass(i); G.sp[i] = species ? species(i) : 0;
        G.x[i] = r + Math.random() * (G.Lx - 2 * r);
        G.y[i] = r + Math.random() * (G.Ly - 2 * r);
        G.z[i] = r + Math.random() * (G.Lz - 2 * r);
        const s = Math.sqrt(KB * T / (G.m[i] * AMU)) / 1000;
        G.vx[i] = s * gauss(); G.vy[i] = s * gauss(); G.vz[i] = s * gauss();
        G.ord[i] = i;
      }
      G.coll = 0;
      G.setT(T);
    };
    /* mean kinetic energy per molecule in J (of one species, or of all) */
    G.ke = function (sp) {
      let s = 0, k = 0;
      for (let i = 0; i < G.N; i++) if (sp == null || G.sp[i] === sp) { s += G.m[i] * (G.vx[i] * G.vx[i] + G.vy[i] * G.vy[i] + G.vz[i] * G.vz[i]); k++; }
      return k ? 0.5 * s * AMU * 1e6 / k : 0;
    };
    G.temp = sp => G.ke(sp) / (1.5 * KB);
    G.scale = f => { for (let i = 0; i < G.N; i++) { G.vx[i] *= f; G.vy[i] *= f; G.vz[i] *= f; } };
    G.setT = T => { const t = G.temp(); if (t > 0 && T > 0) G.scale(Math.sqrt(T / t)); };
    G.vmax = () => { let v = 0; for (let i = 0; i < G.N; i++) v = Math.max(v, G.vx[i] * G.vx[i] + G.vy[i] * G.vy[i] + G.vz[i] * G.vz[i]); return Math.sqrt(v); };
    G.step = function (dt, collide) {
      const { x, y, z, vx, vy, vz, m, ord } = G, N = G.N, r = G.wr, Lx = G.Lx, Ly = G.Ly, Lz = G.Lz, u = G.u;
      let imp = 0;
      for (let i = 0; i < N; i++) {
        x[i] += vx[i] * dt; y[i] += vy[i] * dt; z[i] += vz[i] * dt;
        if (x[i] < r) { x[i] = r; if (vx[i] < 0) { imp -= 2 * m[i] * vx[i]; vx[i] = -vx[i]; } }
        else if (x[i] > Lx - r) { x[i] = Lx - r; if (vx[i] > u) { imp += 2 * m[i] * (vx[i] - u); vx[i] = 2 * u - vx[i]; } }
        if (y[i] < r) { y[i] = r; if (vy[i] < 0) { imp -= 2 * m[i] * vy[i]; vy[i] = -vy[i]; } }
        else if (y[i] > Ly - r) { y[i] = Ly - r; if (vy[i] > 0) { imp += 2 * m[i] * vy[i]; vy[i] = -vy[i]; } }
        if (z[i] < r) { z[i] = r; if (vz[i] < 0) { imp -= 2 * m[i] * vz[i]; vz[i] = -vz[i]; } }
        else if (z[i] > Lz - r) { z[i] = Lz - r; if (vz[i] > 0) { imp += 2 * m[i] * vz[i]; vz[i] = -vz[i]; } }
      }
      G.imp += imp;
      if (!collide) return;
      // sweep and prune along x: keep the index list sorted by x (insertion sort, nearly sorted already)
      for (let a = 1; a < N; a++) {
        const k = ord[a], xk = x[k];
        let b = a - 1;
        while (b >= 0 && x[ord[b]] > xk) { ord[b + 1] = ord[b]; b--; }
        ord[b + 1] = k;
      }
      const d = G.d, d2 = d * d;
      for (let a = 0; a < N; a++) {
        const i = ord[a];
        for (let b = a + 1; b < N; b++) {
          const j = ord[b];
          const dx = x[i] - x[j];
          if (dx <= -d) break;
          const dy = y[i] - y[j]; if (dy >= d || dy <= -d) continue;
          const dz = z[i] - z[j]; if (dz >= d || dz <= -d) continue;
          const s2 = dx * dx + dy * dy + dz * dz;
          if (s2 >= d2 || s2 === 0) continue;
          const dot = dx * (vx[i] - vx[j]) + dy * (vy[i] - vy[j]) + dz * (vz[i] - vz[j]);
          if (dot >= 0) continue;                       // already moving apart
          const f = 2 * dot / (s2 * (m[i] + m[j]));     // elastic collision along the line of centres
          vx[i] -= f * m[j] * dx; vy[i] -= f * m[j] * dy; vz[i] -= f * m[j] * dz;
          vx[j] += f * m[i] * dx; vy[j] += f * m[i] * dy; vz[j] += f * m[i] * dz;
          G.coll++;
        }
      }
    };
    return G;
  }

  /* ================================================================== gas in a box */
  Hyper.sim('heat-gas-box', {
    title: 'Gas in a box with a piston',
    blurb: `Molecules (drawn far larger than real ones) fly about a box 60 nm tall and 60 nm deep; their colour shows their speed. The pressure is **measured** by adding up the momentum the molecules hand to the walls, and compared with the ideal-gas law $p = NkT/V$.

- Push the piston in to halve the volume (drag it, or use the slider): the pressure doubles while the walls hold the temperature.
- Switch the walls to **insulated** and push the piston in: molecules bouncing off the advancing piston come back faster, so compression heats the gas. Pull it out and the gas cools.
- Change the gas at the same temperature: helium atoms move about 2.6 times faster than nitrogen molecules, yet the pressure is the same.
- Double the number of molecules: twice as many hits, twice the pressure.
- Press **Crowd into left half** and watch the gas spread out. It never gathers itself up again.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.58 });
      const G = makeGas(320);
      const LMIN = 30, LMAX = 150, RATE = 120;        // simulated picoseconds per real second
      const GASES = [['Nitrogen, N₂ (28 u)', 28.014], ['Helium, He (4 u)', 4.0026], ['Xenon, Xe (131 u)', 131.29]];
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Number of molecules', min: 20, max: 300, step: 10, value: 120 },
        { id: 'T', label: 'Temperature (set)', min: 50, max: 1000, step: 10, value: 300, unit: 'K' },
        { id: 'L', label: 'Piston position (box length)', min: LMIN, max: LMAX, step: 1, value: 100, unit: 'nm' },
        { id: 'walls', type: 'select', label: 'Walls', options: [['Held at the set temperature', 'iso'], ['Insulated: no heat in or out', 'adia']], value: 'iso' },
        { id: 'gas', type: 'select', label: 'Gas', options: GASES, value: 28.014 },
        { id: 'coll', type: 'check', label: 'Molecules collide with each other', value: true },
        { type: 'buttons', items: [{ id: 'gather', label: 'Crowd into left half' }, { id: 'zero', label: 'Restart the measurement' }] }
      ], onChange);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Temperature from ½mv²'], ['p', 'Pressure measured on the walls'], ['pi', 'Ideal-gas law NkT/V'], ['V', 'Volume'], ['v', 'rms speed'], ['left', 'Molecules in the left half']]);
      let pAvg = null, target = V.L;

      G.wr = 0;                                       // the stated box size is the room the centres have
      function refill(T) { G.fill(V.N, () => V.gas, T); pAvg = null; }
      function gather() { for (let i = 0; i < G.N; i++) G.x[i] = Math.random() * G.Lx / 2; pAvg = null; }
      function onChange(id) {
        if (id === 'T') G.setT(V.T);
        else if (id === 'N' || id === 'gas') refill(V.walls === 'iso' ? V.T : clamp(G.temp(), 20, 3000));
        else if (id === 'L') target = V.L;
        else if (id === 'gather') gather();
        else if (id === 'zero') pAvg = null;
        if (!loop.running) loop.once();
      }
      G.Lx = V.L;
      refill(V.T);
      if (params.gather) gather();

      const geo = () => {
        const s = Math.max(0.5, Math.min((st.W - 112) / LMAX, (st.H - 130) / G.Ly));
        return { s, x0: 22, y0: 34, hp: G.Ly * s };
      };
      kit.drag(st, {
        hit: p => { const g = geo(); const px = g.x0 + G.Lx * g.s; return (p.x > px - 14 && p.y > g.y0 - 10 && p.y < g.y0 + g.hp + 10) ? 'piston' : null; },
        move: (k, p) => { const g = geo(); const L = clamp(Math.round((p.x - g.x0) / g.s), LMIN, LMAX); target = L; ctl.set('L', L); if (!loop.running) loop.once(); },
        hover: true
      });

      const loop = kit.loop((dt) => {
        const tSim = dt * RATE;
        if (tSim > 0) {
          // the piston moves at a tenth of the rms speed at most: slow enough to be nearly reversible
          const umax = 0.1 * Math.sqrt(3 * KB * Math.max(G.temp(), 1) / (V.gas * AMU)) / 1000;
          const dL = clamp(target - G.Lx, -umax * tSim, umax * tSim);
          const nsub = clamp(Math.ceil(G.vmax() * tSim / (0.35 * G.d)), 1, 80);
          const h = tSim / nsub;
          G.u = dL / tSim;
          G.imp = 0;
          let areaTime = 0;
          for (let k = 0; k < nsub; k++) {
            G.Lx = clamp(G.Lx + G.u * h, LMIN, LMAX);
            G.step(h, V.coll);
            areaTime += 2 * (G.Ly * G.Lz + G.Lx * G.Lz + G.Lx * G.Ly) * h;
          }
          if (Math.abs(target - G.Lx) < 1e-6) G.Lx = target;
          G.u = 0;
          if (V.walls === 'iso') { const t = G.temp(); if (t > 0) G.scale(Math.sqrt(Math.max(0.05, 1 + (V.T / t - 1) * Math.min(1, tSim / 40)))); }
          const pInst = G.imp * AMU * 1e33 / areaTime;                    // u·nm/ps per nm²·ps -> Pa
          pAvg = pAvg == null ? pInst : pAvg + (pInst - pAvg) * (1 - Math.exp(-tSim / 200));
        }
        const T = G.temp();
        const vol = G.Lx * G.Ly * G.Lz * 1e-27;
        const pId = G.N * KB * T / vol;
        let left = 0;
        for (let i = 0; i < G.N; i++) if (G.x[i] < G.Lx / 2) left++;

        // ---- draw
        const C = kit.colors();
        const c = st.begin();
        const { s, x0, y0, hp } = geo();
        const R = G.d / 2 * s;                        // walls drawn one molecular radius outside the centres' room
        const xw = x0 + G.Lx * s + R;
        c.fillStyle = C.bg; c.fillRect(x0 - R, y0 - R, G.Lx * s + 2 * R, hp + 2 * R);
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(xw, y0 - R); c.lineTo(x0 + LMAX * s + 14, y0 - R); c.moveTo(xw, y0 + hp + R); c.lineTo(x0 + LMAX * s + 14, y0 + hp + R); c.stroke();
        c.restore();
        c.strokeStyle = V.walls === 'iso' ? C.warn : C.border2; c.lineWidth = 4;
        c.beginPath(); c.moveTo(xw, y0 - R - 2); c.lineTo(x0 - R - 2, y0 - R - 2); c.lineTo(x0 - R - 2, y0 + hp + R + 2); c.lineTo(xw, y0 + hp + R + 2); c.stroke();
        c.save(); c.setLineDash([2, 5]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x0 + G.Lx * s / 2, y0); c.lineTo(x0 + G.Lx * s / 2, y0 + hp); c.stroke(); c.restore();
        const vr = Math.sqrt(3 * KB * Math.max(T, 1) / (V.gas * AMU)) / 1000;
        for (let i = 0; i < G.N; i++) {
          const v = Math.sqrt(G.vx[i] * G.vx[i] + G.vy[i] * G.vy[i] + G.vz[i] * G.vz[i]);
          const depth = 0.7 + 0.5 * G.z[i] / G.Lz;
          kit.dot(c, x0 + G.x[i] * s, y0 + G.y[i] * s, Math.max(1.6, G.d / 2 * s * depth), hot(kit, v / (2 * vr)));
        }
        const px = xw, rodEnd = x0 + LMAX * s + 44;
        c.fillStyle = C.text2;
        c.fillRect(px, y0 - R - 4, 9, hp + 2 * R + 8);
        c.fillRect(px + 9, y0 + hp / 2 - 3, Math.max(0, rodEnd - px - 9), 6);
        c.fillRect(rodEnd, y0 + hp / 2 - 16, 8, 32);
        kit.label(c, G.N + ' molecules · box ' + fmt(G.Lx, 3) + ' nm × 60 nm × 60 nm · ' + (V.walls === 'iso' ? 'walls held at ' + V.T + ' K' : 'insulated walls'), x0, 16, { size: 12, color: C.muted });
        // pressure bars
        const by = y0 + hp + 34, bw = Math.max(40, st.W - x0 - 190);
        const top = Math.max(pAvg || 0, pId, 1) * 1.15;
        const bar = (lab, val, col, yy) => {
          c.fillStyle = C.surface; c.fillRect(x0, yy - 8, bw, 16);
          if (val != null && Number.isFinite(val)) { c.fillStyle = col; c.fillRect(x0, yy - 8, bw * clamp(val / top, 0, 1), 16); }
          kit.label(c, lab + ':  ' + (val == null ? '…' : fmtU(val, 'Pa')), x0 + bw + 10, yy, { size: 12, color: C.text2 });
        };
        bar('measured', pAvg, C.accent, by);
        bar('NkT/V', pId, C.series[1], by + 26);
        kit.label(c, 'slow', x0, by + 54, { size: 11, color: C.muted });
        for (let k = 0; k < 20; k++) { c.fillStyle = hot(kit, k / 19); c.fillRect(x0 + 32 + k * 6, by + 49, 6, 10); }
        kit.label(c, 'fast (colour = speed)', x0 + 32 + 20 * 6 + 6, by + 54, { size: 11, color: C.muted });

        ro.set('T', fmt(T, 3) + ' K');
        ro.set('p', pAvg == null ? '…' : fmtU(pAvg, 'Pa') + (pId > 0 ? '  (' + (pAvg / pId).toFixed(2) + ' × NkT/V)' : ''));
        ro.set('pi', fmtU(pId, 'Pa'));
        ro.set('V', fmt(G.Lx * G.Ly * G.Lz, 3) + ' nm³ = ' + fmt(vol, 3) + ' m³');
        ro.set('v', fmt(vr * 1000, 3) + ' m/s');
        ro.set('left', Math.round(100 * left / Math.max(G.N, 1)) + ' %');
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================== Maxwell–Boltzmann */
  Hyper.sim('heat-maxwell', {
    title: 'Molecular speeds: the Maxwell–Boltzmann distribution',
    blurb: `A few hundred molecules collide in a box 60 nm across. Below, a histogram collects their speeds over the last couple of seconds and is compared with Maxwell's curve for the same gas and temperature.

- Press **Give all one speed**: every molecule gets the same speed. Within a few collisions each, the spike spreads out into Maxwell's hump — and stays there.
- Raise the temperature: the hump moves right, grows wider and lower (its area is always 100 %).
- Switch to xenon, then helium, at the same temperature: heavy molecules are slow, light ones fast.
- Tick **Half helium, half argon**, then give all one speed. The argon atoms start with ten times the kinetic energy of the helium atoms; collisions share it out until both have the same average, $\\tfrac32 kT$ — equipartition.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230, maxH: 360 });
      const gb = document.createElement('div');
      gb.style.padding = '4px 10px 10px';
      box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'speed (m/s)', min: 0 }, y: { label: '% of molecules per 100 m/s', min: 0 }, legend: true }, 230);
      const GASES = [['Helium, He (4 u)', 4.0026], ['Neon, Ne (20 u)', 20.18], ['Nitrogen, N₂ (28 u)', 28.014], ['Argon, Ar (40 u)', 39.95], ['Xenon, Xe (131 u)', 131.29]];
      const MHE = 4.0026, MAR = 39.95;
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Molecules', min: 100, max: 400, step: 20, value: 260 },
        { id: 'T', label: 'Temperature', min: 50, max: 1500, step: 10, value: 300, unit: 'K' },
        { id: 'gas', type: 'select', label: 'Gas', options: GASES, value: 28.014 },
        { id: 'mix', type: 'check', label: 'Half helium, half argon', value: !!params.mix },
        { type: 'buttons', items: [{ id: 'same', label: 'Give all one speed', primary: true }, { id: 'clear', label: 'Clear the histogram' }] }
      ], onChange);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Temperature'], ['vp', 'Most probable speed'], ['vm', 'Mean speed: measured (theory)'], ['vr', 'rms speed: measured (theory)'], ['kA', 'Helium: ⅔⟨½mv²⟩/k'], ['kB', 'Argon: ⅔⟨½mv²⟩/k']]);
      const G = makeGas(420);
      G.Lx = G.Ly = G.Lz = 60;
      const RATE = 100, NB = 40;
      const hist = [new Float64Array(NB), new Float64Array(NB)], wsum = [0, 0];
      let vtop = 1000, since = 1;

      const massOf = () => (V.mix ? (i => (i % 2 ? MAR : MHE)) : (() => V.gas));
      const lightest = () => (V.mix ? MHE : V.gas);
      const vpOf = (mU, T) => Math.sqrt(2 * KB * T / (mU * AMU));
      function clearHist() { for (const h of hist) h.fill(0); wsum[0] = wsum[1] = 0; vtop = Math.max(200, 3.4 * vpOf(lightest(), V.T)); since = 1; }
      function refill() { G.fill(V.N, massOf(), V.T, i => (V.mix ? i % 2 : 0)); clearHist(); }
      function oneSpeed() {
        let M = 0;
        for (let i = 0; i < G.N; i++) M += G.m[i] * AMU;
        const v0 = Math.sqrt(3 * G.N * KB * V.T / M) / 1000;
        for (let i = 0; i < G.N; i++) {
          const zc = 2 * Math.random() - 1, ph = 2 * Math.PI * Math.random(), rr = Math.sqrt(1 - zc * zc);
          G.vx[i] = v0 * rr * Math.cos(ph); G.vy[i] = v0 * rr * Math.sin(ph); G.vz[i] = v0 * zc;
        }
        clearHist();
      }
      function onChange(id) {
        if (id === 'T') { G.setT(V.T); clearHist(); }
        else if (id === 'N' || id === 'gas' || id === 'mix') refill();
        else if (id === 'same') oneSpeed();
        else if (id === 'clear') clearHist();
        if (!loop.running) loop.once();
      }
      refill();

      const fMB = (v, mU, T) => { const a = mU * AMU / (2 * KB * T); return 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v); };
      function updatePlot() {
        const C = kit.colors();
        const T = Math.max(G.temp(), 1), bw = vtop / NB;
        const series = [], sp = V.mix ? [[MHE, 'helium', 0], [MAR, 'argon', 1]] : [[V.gas, '', 0]];
        sp.forEach(([mU, name, k], idx) => {
          const col = idx ? C.series[1] : C.accent;
          const pts = [];
          for (let b = 0; b < NB; b++) {
            const h = wsum[k] > 0 ? hist[k][b] / wsum[k] / bw * 1e4 : 0;
            pts.push([b * bw, h], [(b + 1) * bw, h]);
          }
          series.push({ pts, fill: true, color: col, width: 1.4, label: 'simulated' + (name ? ' ' + name : '') });
          const th = [];
          for (let i = 0; i <= 160; i++) { const v = vtop * i / 160; th.push([v, fMB(v, mU, T) * 1e4]); }
          series.push({ pts: th, color: col, dash: [6, 4], width: 2, label: 'Maxwell' + (name ? ', ' + name : '') });
        });
        const m0 = V.mix ? MHE : V.gas;
        const vp = vpOf(m0, T), vm = Math.sqrt(8 * KB * T / (Math.PI * m0 * AMU)), vr = Math.sqrt(3 * KB * T / (m0 * AMU));
        plot.set({ series, x: { label: 'speed (m/s)', min: 0, max: vtop }, y: { label: '% of molecules per 100 m/s', min: 0 },
          marks: [{ x: vp, y: fMB(vp, m0, T) * 1e4, label: 'most probable', color: V.mix ? C.accent : C.accent }],
          vlines: [{ x: vm, color: C.faint }, { x: vr, color: C.faint, dash: [2, 4] }] });
      }

      const loop = kit.loop((dt) => {
        const tSim = dt * RATE;
        if (tSim > 0) {
          const nsub = clamp(Math.ceil(G.vmax() * tSim / (0.35 * G.d)), 1, 60);
          for (let k = 0; k < nsub; k++) G.step(tSim / nsub, true);
          const q = Math.exp(-dt / 1.6), bw = vtop / NB;
          for (let k = 0; k < 2; k++) { for (let b = 0; b < NB; b++) hist[k][b] *= q; wsum[k] *= q; }
          for (let i = 0; i < G.N; i++) {
            const v = Math.sqrt(G.vx[i] * G.vx[i] + G.vy[i] * G.vy[i] + G.vz[i] * G.vz[i]) * 1000;
            const b = Math.floor(v / bw), k = G.sp[i];
            wsum[k] += 1;
            if (b >= 0 && b < NB) hist[k][b] += 1;
          }
          since += dt;
        }
        if (since > 0.12 || dt === 0) { updatePlot(); since = 0; }
        // ---- the box (seen from the front: depth shown by size)
        const C = kit.colors();
        const c = st.begin();
        const S = Math.max(40, Math.min(st.H - 24, st.W * 0.48)), x0 = 14, y0 = (st.H - S) / 2, sc = S / G.Lx;
        c.fillStyle = C.bg; c.fillRect(x0, y0, S, S);
        c.strokeStyle = C.border2; c.lineWidth = 2; c.strokeRect(x0, y0, S, S);
        const T = Math.max(G.temp(), 1);
        const vr0 = Math.sqrt(3 * KB * T / (lightest() * AMU)) / 1000;
        for (let i = 0; i < G.N; i++) {
          const depth = 0.6 + 0.6 * G.z[i] / G.Lz;
          let col;
          if (V.mix) col = G.sp[i] ? C.series[1] : C.accent;
          else col = hot(kit, Math.sqrt(G.vx[i] * G.vx[i] + G.vy[i] * G.vy[i] + G.vz[i] * G.vz[i]) / (2 * vr0));
          kit.dot(c, x0 + G.x[i] * sc, y0 + G.y[i] * sc, Math.max(1.4, G.d / 2 * sc * depth), col);
        }
        const tx = x0 + S + 22;
        const gasName = V.mix ? 'helium (blue) + argon (orange)' : GASES.find(g => g[1] === V.gas)[0];
        kit.label(c, G.N + ' molecules', tx, y0 + 12, { size: 13, weight: 600 });
        kit.label(c, gasName, tx, y0 + 34, { size: 12, color: C.muted });
        kit.label(c, 'T = ' + fmt(T, 3) + ' K', tx, y0 + 56, { size: 12, color: C.muted });
        kit.label(c, 'collisions so far: ' + G.coll.toLocaleString('en-GB'), tx, y0 + 78, { size: 12, color: C.muted });
        kit.label(c, 'dashed curves: theory; lines at the', tx, y0 + 108, { size: 11.5, color: C.faint });
        kit.label(c, 'mean speed and the rms speed', tx, y0 + 124, { size: 11.5, color: C.faint });
        if (!V.mix) {
          for (let k = 0; k < 20; k++) { c.fillStyle = hot(kit, k / 19); c.fillRect(tx + k * 6, y0 + 146, 6, 10); }
          kit.label(c, 'slow → fast', tx + 128, y0 + 151, { size: 11, color: C.muted });
        }
        // readouts
        const m0 = V.mix ? MHE : V.gas;
        let s1 = 0, s2 = 0, k0 = 0;
        for (let i = 0; i < G.N; i++) if (G.sp[i] === 0) { const v2 = (G.vx[i] * G.vx[i] + G.vy[i] * G.vy[i] + G.vz[i] * G.vz[i]) * 1e6; s1 += Math.sqrt(v2); s2 += v2; k0++; }
        k0 = Math.max(k0, 1);
        ro.set('T', fmt(T, 3) + ' K');
        ro.set('vp', fmt(vpOf(m0, T), 3) + ' m/s' + (V.mix ? ' (helium)' : ''));
        ro.set('vm', fmt(s1 / k0, 3) + ' (' + fmt(Math.sqrt(8 * KB * T / (Math.PI * m0 * AMU)), 3) + ') m/s');
        ro.set('vr', fmt(Math.sqrt(s2 / k0), 3) + ' (' + fmt(Math.sqrt(3 * KB * T / (m0 * AMU)), 3) + ') m/s');
        ro.set('kA', V.mix ? fmt(G.temp(0), 3) + ' K' : '—');
        ro.set('kB', V.mix ? fmt(G.temp(1), 3) + ' K' : '—');
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================== p–V processes */
  Hyper.sim('heat-pv-diagram', {
    title: 'p–V diagram: four ways to change a gas',
    blurb: `One mole of ideal gas starts at 300 K in 25 L. Choose a process, set where it should end, and press **Run step**. The shaded area under the path is the work done by the gas; the readout keeps the books: $\\Delta U = Q - W$ for every step.

- Isothermal expansion to 50 L: $\\Delta U = 0$, so every joule of work was paid for by heat flowing in.
- Now try an adiabatic expansion to the same volume: no heat, so the work comes out of the internal energy and the gas cools. Its curve is steeper than the isotherm (dashed guides).
- Build a closed cycle — for example isobaric expansion, isochoric cooling, isothermal compression — and return to the start: $\\Delta U$ adds up to zero and the enclosed area is the net work.
- Compare a monatomic and a diatomic gas: same heat, different temperature rise.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const n = 1;
      const START = { V: 0.025, T: 300 }; START.p = n * RG * START.T / START.V;
      const PROCS = [['Isothermal (constant T)', 'iso'], ['Adiabatic (no heat, Q = 0)', 'adi'], ['Isobaric (constant p)', 'bar'], ['Isochoric (constant V)', 'cho']];
      const NAMES = { iso: 'isothermal', adi: 'adiabatic', bar: 'isobaric', cho: 'isochoric' };
      const ctl = kit.controls(box.side, [
        { id: 'proc', type: 'select', label: 'Next step', options: PROCS, value: 'iso' },
        { id: 'V2', label: 'Final volume (isothermal, adiabatic, isobaric)', min: 5, max: 60, step: 0.5, value: 50, unit: 'L' },
        { id: 'T2', label: 'Final temperature (isochoric)', min: 100, max: 1200, step: 10, value: 600, unit: 'K' },
        { id: 'cv', type: 'select', label: 'Gas (1 mol)', options: [['Monatomic, γ = 5/3', 1.5], ['Diatomic, γ = 7/5', 2.5]], value: 1.5 },
        { id: 'guides', type: 'check', label: 'Show the isotherm and adiabat through the state', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Run step', primary: true }, { id: 'undo', label: 'Undo' }, { id: 'reset', label: 'Start again' }] }
      ], onChange);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'State now'], ['W', 'Last step: work by the gas W'], ['Q', 'Last step: heat in Q'], ['dU', 'Last step: ΔU = Q − W'], ['sum', 'All steps: W and Q']]);
      let cur = Object.assign({}, START), hist = [], anim = null, msg = '', msgT = 0;
      const gam = () => 1 + 1 / V.cv;

      function plan(proc, s) {
        const cv = V.cv * RG, cp = cv + RG, g = gam();
        const pts = [], K = 60;
        let to, W, Q;
        if (proc === 'cho') {
          const T2 = V.T2;
          to = { V: s.V, T: T2, p: n * RG * T2 / s.V };
          W = 0; Q = n * cv * (T2 - s.T);
          for (let k = 0; k <= K; k++) { const T = s.T + (T2 - s.T) * k / K; pts.push([s.V, n * RG * T / s.V]); }
        } else {
          const V2 = V.V2 / 1000;
          let T2;
          if (proc === 'iso') { T2 = s.T; W = n * RG * s.T * Math.log(V2 / s.V); Q = W; }
          else if (proc === 'adi') { T2 = s.T * Math.pow(s.V / V2, g - 1); W = n * cv * (s.T - T2); Q = 0; }
          else { T2 = s.T * V2 / s.V; W = s.p * (V2 - s.V); Q = n * cp * (T2 - s.T); }
          to = { V: V2, T: T2, p: n * RG * T2 / V2 };
          for (let k = 0; k <= K; k++) {
            const Vk = s.V + (V2 - s.V) * k / K;
            const p = proc === 'iso' ? n * RG * s.T / Vk : proc === 'adi' ? s.p * Math.pow(s.V / Vk, g) : s.p;
            pts.push([Vk, p]);
          }
        }
        return { proc, from: s, to, W, Q, dU: Q - W, pts };
      }
      function say(t) { msg = t; msgT = 3.5; }
      function onChange(id) {
        if (id === 'run') {
          if (anim) return;
          const p = plan(V.proc, cur);
          if (p.to.T > 5000 || p.to.T < 20) say('That step would take the gas to ' + fmt(p.to.T, 3) + ' K — try a smaller one.');
          else if (Math.abs(p.to.V - cur.V) < 1e-9 && Math.abs(p.to.T - cur.T) < 1e-9) say('That step would change nothing: pick a different end point.');
          else anim = { step: p, f: 0 };
        } else if (id === 'undo') {
          if (anim) anim = null;
          else if (hist.length) cur = Object.assign({}, hist.pop().from);
        } else if (id === 'reset' || id === 'cv') { hist = []; anim = null; cur = Object.assign({}, START); }
        if (!loop.running) loop.once();
      }
      const colOf = (C, proc) => ({ iso: C.series[0], adi: C.series[2], bar: C.series[1], cho: C.series[3] })[proc];

      const loop = kit.loop((dt) => {
        if (msgT > 0) msgT -= dt;
        let now = cur, part = null;
        if (anim) {
          anim.f = Math.min(1, anim.f + dt / 1.4);
          const P = anim.step.pts, idx = anim.f * (P.length - 1), i = Math.floor(idx), fr = idx - i;
          const a = P[i], b = P[Math.min(i + 1, P.length - 1)];
          const Vn = a[0] + (b[0] - a[0]) * fr, pn = a[1] + (b[1] - a[1]) * fr;
          now = { V: Vn, p: pn, T: pn * Vn / (n * RG) };
          part = P.slice(0, i + 1).concat([[Vn, pn]]);
          if (anim.f >= 1) { hist.push(anim.step); cur = Object.assign({}, anim.step.to); now = cur; anim = null; part = null; if (hist.length > 12) hist.shift(); }
        }
        const C = kit.colors();
        const c = st.begin();
        // scale
        let pm = Math.max(START.p, cur.p, now.p);
        for (const h of hist) for (const q of h.pts) pm = Math.max(pm, q[1]);
        if (anim) for (const q of anim.step.pts) pm = Math.max(pm, q[1]);
        pm = Math.max(150e3, pm * 1.12);
        const stp = Hyper.niceStep(pm / 1000, 5);
        const pTop = Math.ceil(pm / 1000 / stp) * stp;
        const pw = Math.max(120, st.W * 0.64 - 66), ph = Math.max(80, st.H - 58);
        const ax = axes(c, kit, { x0: 56, y0: 18, w: pw, h: ph, xmin: 0, xmax: 65, ymin: 0, ymax: pTop, xlabel: 'V (L)', ylabel: 'p (kPa)' });
        const X = v => ax.X(v * 1000), Y = p => ax.Y(p / 1000);
        c.save(); c.beginPath(); c.rect(56, 18, pw, ph); c.clip();
        // guides through the current state
        if (V.guides) {
          const g = gam();
          c.save(); c.lineWidth = 1.2; c.strokeStyle = C.faint;
          c.setLineDash([6, 5]); c.beginPath();
          for (let k = 0; k <= 120; k++) { const Vk = 0.003 + 0.062 * k / 120, p = n * RG * now.T / Vk; k ? c.lineTo(X(Vk), Y(p)) : c.moveTo(X(Vk), Y(p)); }
          c.stroke();
          c.setLineDash([2, 4]); c.beginPath();
          for (let k = 0; k <= 120; k++) { const Vk = 0.003 + 0.062 * k / 120, p = now.p * Math.pow(now.V / Vk, g); k ? c.lineTo(X(Vk), Y(p)) : c.moveTo(X(Vk), Y(p)); }
          c.stroke(); c.restore();
        }
        // a closed cycle: fill the enclosed area
        const closed = hist.length > 1 && !anim && Math.abs(cur.V - START.V) < 0.0005 && Math.abs(cur.T - START.T) < 2;
        let netW = 0, netQ = 0;
        for (const h of hist) { netW += h.W; netQ += h.Q; }
        if (closed) {
          c.fillStyle = netW >= 0 ? kit.hue(150, 0.22) : kit.hue(0, 0.22);
          c.beginPath(); let first = true;
          for (const h of hist) for (const q of h.pts) { if (first) { c.moveTo(X(q[0]), Y(q[1])); first = false; } else c.lineTo(X(q[0]), Y(q[1])); }
          c.closePath(); c.fill();
        }
        // work of the step in progress (or the last one): area under the path
        const shade = part ? { pts: part, W: anim.step.W } : (hist.length && !closed ? { pts: hist[hist.length - 1].pts, W: hist[hist.length - 1].W } : null);
        if (shade && shade.pts.length > 1 && Math.abs(shade.pts[shade.pts.length - 1][0] - shade.pts[0][0]) > 1e-9) {
          c.fillStyle = shade.W >= 0 ? kit.hue(150, part ? 0.3 : 0.16) : kit.hue(0, part ? 0.3 : 0.16);
          c.beginPath(); c.moveTo(X(shade.pts[0][0]), Y(0));
          for (const q of shade.pts) c.lineTo(X(q[0]), Y(q[1]));
          c.lineTo(X(shade.pts[shade.pts.length - 1][0]), Y(0)); c.closePath(); c.fill();
        }
        // the paths
        const drawPath = (pts, col, w) => {
          c.strokeStyle = col; c.lineWidth = w; c.beginPath();
          pts.forEach((q, k) => (k ? c.lineTo(X(q[0]), Y(q[1])) : c.moveTo(X(q[0]), Y(q[1]))));
          c.stroke();
          if (pts.length > 4) { const m = Math.floor(pts.length / 2); const a = pts[m - 2], b = pts[m + 2 < pts.length ? m + 2 : pts.length - 1]; kit.arrow(c, X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), col, 2, 9); }
        };
        hist.forEach(h => drawPath(h.pts, colOf(C, h.proc), 2.4));
        if (part) drawPath(part, colOf(C, anim.step.proc), 3);
        c.restore();
        kit.dot(c, X(START.V), Y(START.p), 4, C.faint);
        kit.dot(c, X(now.V), Y(now.p), 6.5, C.text, C.bg2);
        // key
        let ky = 28;
        for (const [lab, k] of PROCS) { c.fillStyle = colOf(C, k); c.fillRect(56 + pw - 118, ky - 2, 16, 4); kit.label(c, NAMES[k], 56 + pw - 96, ky, { size: 11, color: C.muted }); ky += 16; }
        if (closed) kit.label(c, 'Cycle closed: ΔU = 0, net W = net Q = ' + fmtU(netW, 'J'), 66, 30, { size: 12, weight: 600, color: C.ok, bg: C.surface });
        if (msgT > 0) kit.label(c, msg, 66, 30 + (closed ? 26 : 0), { size: 12, color: C.warn, bg: C.surface });

        // the cylinder
        const cx0 = 56 + pw + 40, cw = Math.max(50, Math.min(110, st.W - cx0 - 30)), ctop = 34, cbot = st.H - 70, chh = cbot - ctop;
        const pistonY = cbot - chh * clamp(now.V / 0.065, 0.02, 1);
        c.fillStyle = hot(kit, (now.T - 100) / 1100, 0.55);
        c.fillRect(cx0, pistonY, cw, cbot - pistonY);
        const step = anim ? anim.step : null;
        c.strokeStyle = step && step.proc === 'adi' ? C.muted : C.border2; c.lineWidth = step && step.proc === 'adi' ? 7 : 3;
        if (step && step.proc === 'adi') c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(cx0, ctop); c.lineTo(cx0, cbot); c.lineTo(cx0 + cw, cbot); c.lineTo(cx0 + cw, ctop); c.stroke();
        c.setLineDash([]);
        c.fillStyle = C.text2; c.fillRect(cx0 + 2, pistonY - 8, cw - 4, 8); c.fillRect(cx0 + cw / 2 - 3, ctop - 16, 6, pistonY - 8 - ctop + 16);
        if (step) {
          const dV = step.to.V - step.from.V;
          if (Math.abs(dV) > 1e-9) kit.arrow(c, cx0 + cw + 14, pistonY, cx0 + cw + 14, pistonY + (dV > 0 ? -34 : 34), dV > 0 ? C.ok : C.bad, 2.4);
          if (Math.abs(step.Q) > 1e-6) {
            const up = step.Q > 0;
            kit.arrow(c, cx0 + cw / 2, up ? cbot + 34 : cbot + 4, cx0 + cw / 2, up ? cbot + 4 : cbot + 34, up ? C.bad : C.series[0], 3);
            kit.label(c, up ? 'heat in' : 'heat out', cx0 + cw / 2 + 10, cbot + 22, { size: 11.5, color: C.muted });
          } else if (step.proc === 'adi') kit.label(c, 'insulated: Q = 0', cx0 - 4, cbot + 20, { size: 11.5, color: C.muted });
        }
        kit.label(c, fmt(now.p / 1000, 3) + ' kPa', cx0, cbot + 46, { size: 11.5, color: C.text2 });
        kit.label(c, fmt(now.V * 1000, 3) + ' L · ' + fmt(now.T, 3) + ' K', cx0, cbot + 62, { size: 11.5, color: C.text2 });

        ro.set('state', fmt(now.p / 1000, 3) + ' kPa · ' + fmt(now.V * 1000, 3) + ' L · ' + fmt(now.T, 3) + ' K');
        const last = anim ? anim.step : hist[hist.length - 1];
        ro.set('W', last ? fmtU(last.W, 'J') + ' (' + NAMES[last.proc] + ')' : '—');
        ro.set('Q', last ? fmtU(last.Q, 'J') : '—');
        ro.set('dU', last ? fmtU(last.dU, 'J') : '—');
        ro.set('sum', hist.length ? 'W = ' + fmtU(netW, 'J') + ', Q = ' + fmtU(netQ, 'J') : '—');
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================== engine cycles */
  Hyper.sim('heat-engine-cycle', {
    title: 'Heat-engine cycles: Carnot and Otto',
    blurb: `A gas is taken round a closed cycle. The area enclosed on the p–V diagram is the net work per cycle; the bars show where the energy goes.

- Carnot: raise $T_h$ or lower $T_c$ and watch the efficiency follow $1 - T_c/T_h$, whatever the gas or the expansion ratio.
- Switch on **logarithmic axes**: isotherms and adiabats become straight lines and the Carnot cycle a parallelogram.
- Otto: raise the compression ratio. The efficiency $1 - r^{1-\\gamma}$ rises, but always stays below the Carnot limit between the coldest and hottest points of the cycle.
- Tick **Run backwards**: the same Carnot cycle becomes a refrigerator. Work goes in, heat is pumped out of the cold side, and more heat comes out on the hot side.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'cyc', type: 'select', label: 'Cycle', options: [['Carnot: two isotherms, two adiabats', 'carnot'], ['Otto: the petrol-engine cycle', 'otto']], value: params.cycle === 'otto' ? 'otto' : 'carnot' },
        { id: 'Th', label: 'Hot temperature T_h (Otto: peak)', min: 350, max: 2500, step: 10, value: params.cycle === 'otto' ? 1800 : 600, unit: 'K' },
        { id: 'Tc', label: 'Cold temperature T_c (Otto: intake)', min: 200, max: 500, step: 5, value: 300, unit: 'K' },
        { id: 'ri', label: 'Carnot: isothermal expansion V₂/V₁', min: 1.2, max: 4, step: 0.1, value: 2 },
        { id: 'r', label: 'Otto: compression ratio', min: 2, max: 14, step: 0.5, value: 8 },
        { id: 'cv', type: 'select', label: 'Working gas', options: [['Air, diatomic (γ = 1.4)', 2.5], ['Monatomic (γ = 5/3)', 1.5]], value: 2.5 },
        { id: 'rev', type: 'check', label: 'Run backwards: refrigerator / heat pump', value: !!params.reverse },
        { id: 'log', type: 'check', label: 'Logarithmic axes', value: false },
        { type: 'buttons', items: [{ id: 'pause', label: 'Pause / run' }] }
      ], (id) => { if (id === 'pause') paused = !paused; cyc = build(); if (!loop.running) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Heat taken in, per cycle'], ['b', 'Work'], ['c', 'Heat given out'], ['eff', 'Performance'], ['lim', 'Ideal (Carnot) limit']]);
      let paused = false, phase = 0;

      function build() {
        const cv = V.cv * RG, g = 1 + RG / cv, ex = 1 / (g - 1);
        let Th = V.Th, Tc = V.Tc, note = '';
        const S = [], legs = [];
        let n;
        if (V.cyc === 'carnot') {
          if (Th < Tc + 20) { Th = Tc + 20; note = 'T_h must exceed T_c: using ' + Th + ' K'; }
          n = 0.1;
          const V1 = 1e-3, V2 = V1 * V.ri, k = Math.pow(Th / Tc, ex);
          S.push({ V: V1, T: Th }, { V: V2, T: Th }, { V: V2 * k, T: Tc }, { V: V1 * k, T: Tc });
          const qh = n * RG * Th * Math.log(V.ri), qc = n * RG * Tc * Math.log(V.ri);
          legs.push({ kind: 'iso', a: 0, b: 1, Q: qh, res: 'hot', name: 'isothermal expansion at T_h' },
                    { kind: 'adi', a: 1, b: 2, Q: 0, name: 'adiabatic expansion' },
                    { kind: 'iso', a: 2, b: 3, Q: -qc, res: 'cold', name: 'isothermal compression at T_c' },
                    { kind: 'adi', a: 3, b: 0, Q: 0, name: 'adiabatic compression' });
        } else {
          const r = V.r, V1 = 5e-4, V2 = V1 / r, T1 = Tc, T2 = T1 * Math.pow(r, g - 1);
          n = 1e5 * V1 / (RG * T1);
          let T3 = Th;
          if (T3 < T2 * 1.05) { T3 = T2 * 1.05; note = 'compression already heats the gas to ' + fmt(T2, 3) + ' K: peak raised to ' + fmt(T3, 3) + ' K'; }
          Th = T3;
          const T4 = T3 / Math.pow(r, g - 1);
          S.push({ V: V1, T: T1 }, { V: V2, T: T2 }, { V: V2, T: T3 }, { V: V1, T: T4 });
          legs.push({ kind: 'adi', a: 0, b: 1, Q: 0, name: 'compression stroke (adiabatic)' },
                    { kind: 'cho', a: 1, b: 2, Q: n * cv * (T3 - T2), res: 'hot', name: 'ignition: fuel burns at constant volume' },
                    { kind: 'adi', a: 2, b: 3, Q: 0, name: 'power stroke (adiabatic)' },
                    { kind: 'cho', a: 3, b: 0, Q: -n * cv * (T4 - T1), res: 'cold', name: 'exhaust: heat out at constant volume' });
        }
        S.forEach(s => { s.p = n * RG * s.T / s.V; });
        let L = legs;
        if (V.rev) L = legs.slice().reverse().map(l => Object.assign({}, l, { a: l.b, b: l.a, Q: -l.Q, name: l.name.replace('expansion', '#').replace('compression', 'expansion').replace('#', 'compression') }));
        let qin = 0, qout = 0;
        for (const l of L) { if (l.Q > 0) qin += l.Q; else qout -= l.Q; }
        // points of each leg
        const pt = (l, f) => {
          const A = S[l.a], B = S[l.b];
          let Vv, T;
          if (l.kind === 'cho') { Vv = A.V; T = A.T + (B.T - A.T) * f; }
          else { Vv = A.V * Math.pow(B.V / A.V, f); T = l.kind === 'iso' ? A.T : A.T * Math.pow(A.V / Vv, g - 1); }
          return { V: Vv, T, p: n * RG * T / Vv };
        };
        for (const l of L) { l.pts = []; for (let k = 0; k <= 50; k++) l.pts.push(pt(l, k / 50)); }
        return { S, L, pt, g, n, Th, Tc, qin, qout, W: qin - qout, note };
      }
      let cyc = build();

      const loop = kit.loop((dt) => {
        if (!paused) phase = (phase + dt / 2.2) % 4;
        const C = kit.colors();
        const c = st.begin();
        const leg = cyc.L[Math.min(3, Math.floor(phase))], now = cyc.pt(leg, phase - Math.floor(phase));
        let vmin = Infinity, vmax = 0, pmin = Infinity, pmax = 0;
        for (const s of cyc.S) { vmin = Math.min(vmin, s.V); vmax = Math.max(vmax, s.V); pmin = Math.min(pmin, s.p); pmax = Math.max(pmax, s.p); }
        const pw = Math.max(120, st.W * 0.56 - 66), ph = Math.max(80, st.H - 58);
        const box0 = V.log
          ? { xmin: vmin * 1000 / 1.5, xmax: vmax * 1000 * 1.5, ymin: pmin / 1000 / 1.5, ymax: pmax / 1000 * 1.5, xlog: true, ylog: true }
          : { xmin: 0, xmax: vmax * 1000 * 1.08, ymin: 0, ymax: pmax / 1000 * 1.1 };
        const ax = axes(c, kit, Object.assign({ x0: 60, y0: 18, w: pw, h: ph, xlabel: 'V (L)', ylabel: 'p (kPa)' }, box0));
        const X = v => ax.X(v * 1000), Y = p => ax.Y(p / 1000);
        // enclosed area = net work
        c.fillStyle = V.rev ? kit.hue(200, 0.18) : kit.hue(35, 0.2);
        c.beginPath(); let first = true;
        for (const l of cyc.L) for (const q of l.pts) { if (first) { c.moveTo(X(q.V), Y(q.p)); first = false; } else c.lineTo(X(q.V), Y(q.p)); }
        c.closePath(); c.fill();
        for (const l of cyc.L) {
          const col = l.res === 'hot' ? (l.Q > 0 ? C.bad : C.warn) : l.res === 'cold' ? C.series[6] : C.muted;
          c.strokeStyle = col; c.lineWidth = l === leg ? 3.4 : 2; c.beginPath();
          l.pts.forEach((q, k) => (k ? c.lineTo(X(q.V), Y(q.p)) : c.moveTo(X(q.V), Y(q.p))));
          c.stroke();
          const a = l.pts[23], b = l.pts[27];
          kit.arrow(c, X(a.V), Y(a.p), X(b.V), Y(b.p), col, 2, 9);
        }
        cyc.S.forEach((s, i) => kit.label(c, String(i + 1), X(s.V) + 6, Y(s.p) - 8, { size: 11, color: C.muted }));
        kit.dot(c, X(now.V), Y(now.p), 6.5, C.text, C.bg2);
        kit.label(c, leg.name, 70, 30, { size: 12, weight: 600, color: C.text2, bg: C.surface });
        if (cyc.note) kit.label(c, cyc.note, 70, 56, { size: 11.5, color: C.warn, bg: C.surface });

        // right panel: bars, reservoirs and the cylinder
        const rx = 60 + pw + 30, rw = Math.max(80, st.W - rx - 14);
        const big = Math.max(cyc.qin, cyc.qout, Math.abs(cyc.W), 1e-9);
        const bars = V.rev
          ? [['heat taken from cold, Q_c', cyc.qin, C.series[6]], ['work put in, |W|', -cyc.W, C.accent], ['heat given to hot, Q_h', cyc.qout, C.bad]]
          : [['heat from hot, Q_h', cyc.qin, C.bad], ['work out, W', cyc.W, C.accent], ['heat to cold, Q_c', cyc.qout, C.series[6]]];
        bars.forEach(([lab, val, col], i) => {
          const yy = 24 + i * 34;
          kit.label(c, lab + ': ' + fmtU(val, 'J'), rx, yy, { size: 11.5, color: C.text2 });
          c.fillStyle = col; c.fillRect(rx, yy + 8, rw * clamp(val / big, 0, 1), 8);
        });
        const cy0 = 24 + 3 * 34 + 12, cyb = st.H - 60, cw = Math.min(70, rw * 0.4), cx = rx + (rw - cw) / 2;
        const fr = clamp(Math.log(now.V / vmin) / Math.log(Math.max(vmax / vmin, 1.0001)), 0, 1);
        const top = cyb - (cyb - cy0) * (0.15 + 0.8 * fr);
        c.fillStyle = hot(kit, (now.T - cyc.Tc * 0.9) / (cyc.Th * 1.05 - cyc.Tc * 0.9), 0.55);
        c.fillRect(cx, top, cw, cyb - top);
        c.strokeStyle = C.border2; c.lineWidth = 3;
        c.beginPath(); c.moveTo(cx, cy0); c.lineTo(cx, cyb); c.lineTo(cx + cw, cyb); c.lineTo(cx + cw, cy0); c.stroke();
        c.fillStyle = C.text2; c.fillRect(cx + 2, top - 7, cw - 4, 7);
        // reservoirs
        const rh = 26, ry = st.H - rh - 8;
        const hotOn = leg.res === 'hot', coldOn = leg.res === 'cold';
        c.fillStyle = kit.hue(0, hotOn ? 0.55 : 0.2); c.fillRect(rx, ry, rw * 0.42, rh);
        c.fillStyle = kit.hue(200, coldOn ? 0.55 : 0.2); c.fillRect(rx + rw * 0.58, ry, rw * 0.42, rh);
        kit.label(c, V.cyc === 'otto' ? 'burning fuel' : 'hot ' + fmt(cyc.Th, 3) + ' K', rx + rw * 0.21, ry + rh / 2, { size: 11, align: 'center', color: C.text });
        kit.label(c, V.cyc === 'otto' ? 'exhaust' : 'cold ' + fmt(cyc.Tc, 3) + ' K', rx + rw * 0.79, ry + rh / 2, { size: 11, align: 'center', color: C.text });
        if (hotOn || coldOn) {
          const bx = hotOn ? rx + rw * 0.21 : rx + rw * 0.79, into = leg.Q > 0;
          kit.arrow(c, into ? bx : cx + cw / 2, into ? ry - 2 : cyb + 2, into ? cx + cw / 2 : bx, into ? cyb + 2 : ry - 2, hotOn ? C.bad : C.series[6], 3);
        }
        kit.label(c, fmt(now.T, 3) + ' K', cx + cw / 2, cy0 - 10, { size: 11.5, align: 'center', color: C.muted });

        // readouts
        const carnot = 1 - cyc.Tc / cyc.Th;
        if (!V.rev) {
          ro.set('a', 'Q_h = ' + fmtU(cyc.qin, 'J') + ' from the hot side');
          ro.set('b', 'W = ' + fmtU(cyc.W, 'J') + ' out');
          ro.set('c', 'Q_c = ' + fmtU(cyc.qout, 'J') + ' to the cold side');
          ro.set('eff', 'efficiency W/Q_h = ' + (100 * cyc.W / cyc.qin).toFixed(1) + ' %');
          ro.set('lim', '1 − T_c/T_h = ' + (100 * carnot).toFixed(1) + ' %');
        } else {
          ro.set('a', 'Q_c = ' + fmtU(cyc.qin, 'J') + ' from the cold side');
          ro.set('b', 'W = ' + fmtU(-cyc.W, 'J') + ' put in');
          ro.set('c', 'Q_h = ' + fmtU(cyc.qout, 'J') + ' to the hot side');
          ro.set('eff', 'COP: fridge ' + fmt(cyc.qin / -cyc.W, 3) + ', heat pump ' + fmt(cyc.qout / -cyc.W, 3));
          ro.set('lim', 'COPs ' + fmt(cyc.Tc / (cyc.Th - cyc.Tc), 3) + ' and ' + fmt(cyc.Th / (cyc.Th - cyc.Tc), 3));
        }
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================== conduction */
  const MATS = [
    { name: 'Copper', k: 401, rho: 8960, c: 385 },
    { name: 'Aluminium', k: 237, rho: 2700, c: 900 },
    { name: 'Carbon steel', k: 50, rho: 7850, c: 490 },
    { name: 'Stainless steel', k: 16, rho: 8000, c: 500 },
    { name: 'Glass', k: 1.0, rho: 2500, c: 840 },
    { name: 'Pine wood', k: 0.12, rho: 500, c: 1700 }
  ];
  Hyper.sim('heat-conduction-bar', {
    title: 'Conduction along a bar',
    blurb: `Two bars, 1 cm² in cross-section, start at the cold temperature. At time zero their left ends are put against a hot block. Colour shows temperature; the graph below shows the temperature along each bar, and the dashed line the final, steady profile.

- Compare copper and steel: the same final straight line, reached at very different speeds. The time scale is $L^2/\\alpha$, with $\\alpha = k/\\rho c$ the thermal diffusivity.
- Double the length: the steady heat flow halves, and the bar takes four times as long to get there.
- Try glass or wood and turn the speed-up right up: hours, even days, of real time.
- Insulate the cold end: heat has nowhere to go, and the whole bar creeps up to the hot temperature.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190, maxH: 290 });
      const gb = document.createElement('div');
      gb.style.padding = '4px 10px 10px';
      box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'position along the bar (cm)', min: 0 }, y: { label: 'temperature (°C)' }, legend: true }, 210);
      const opts = MATS.map((m, i) => [m.name + ' (k = ' + m.k + ' W/(m·K))', i]);
      const ctl = kit.controls(box.side, [
        { id: 'A', type: 'select', label: 'Bar A', options: opts, value: 0 },
        { id: 'B', type: 'select', label: 'Bar B', options: [['(no second bar)', -1]].concat(opts), value: 2 },
        { id: 'L', label: 'Length', min: 0.05, max: 1, step: 0.01, value: 0.3, unit: 'm' },
        { id: 'Th', label: 'Hot end', min: 0, max: 300, step: 5, value: 100, unit: '°C' },
        { id: 'Tc', label: 'Cold end (and start)', min: -20, max: 100, step: 5, value: 20, unit: '°C' },
        { id: 'sp', label: 'Speed-up', min: 1, max: 100000, value: 100, log: true, sig: 2, unit: '×' },
        { id: 'ins', type: 'check', label: 'Insulate the far end', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'pause') paused = !paused;
        else if (id !== 'sp') reset();
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time since contact'], ['inA', 'A: heat flow in / out'], ['ssA', 'A: steady flow kAΔT/L'], ['tauA', 'A: time scale L²/α'], ['inB', 'B: heat flow in / out'], ['tauB', 'B: time scale L²/α']]);
      const NX = 41, AREA = 1e-4;
      const TA = new Float64Array(NX), TB = new Float64Array(NX);
      const a = new Float64Array(NX), b = new Float64Array(NX), cc = new Float64Array(NX), d = new Float64Array(NX);
      let t = 0, paused = false, since = 1;
      function reset() {
        TA.fill(V.Tc); TB.fill(V.Tc); TA[0] = TB[0] = V.Th;
        t = 0; since = 1;
      }
      /* one backward-Euler step (stable for any dt) with the hot end fixed */
      function stepBar(T, mat, dtS) {
        const dx = V.L / (NX - 1), al = mat.k / (mat.rho * mat.c), r = al * dtS / (dx * dx);
        const last = V.ins ? NX - 1 : NX - 2, M = last;          // unknowns T[1..last]
        T[0] = V.Th; if (!V.ins) T[NX - 1] = V.Tc;
        for (let i = 1; i <= M; i++) {
          const j = i - 1;
          a[j] = -r; b[j] = 1 + 2 * r; cc[j] = -r; d[j] = T[i];
          if (i === 1) d[j] += r * T[0];
          if (i === M) { if (V.ins) { a[j] = -2 * r; cc[j] = 0; } else { d[j] += r * T[NX - 1]; cc[j] = 0; } }
        }
        // Thomas algorithm
        for (let j = 1; j < M; j++) { const w = a[j] / b[j - 1]; b[j] -= w * cc[j - 1]; d[j] -= w * d[j - 1]; }
        T[M] = d[M - 1] / b[M - 1];
        for (let j = M - 2; j >= 0; j--) T[j + 1] = (d[j] - cc[j] * T[j + 2]) / b[j];
      }
      const flows = (T, mat) => {
        const dx = V.L / (NX - 1), kA = mat.k * AREA;
        const tiny = v => (Math.abs(v) < 1e-9 * Math.max(1, kA * Math.abs(V.Th - V.Tc) / V.L) ? 0 : v);
        const pin = tiny(kA * (3 * T[0] - 4 * T[1] + T[2]) / (2 * dx));
        const pout = V.ins ? 0 : tiny(kA * (4 * T[NX - 2] - 3 * T[NX - 1] - T[NX - 3]) / (2 * dx));
        return { pin, pout, pss: V.ins ? 0 : kA * (V.Th - V.Tc) / V.L, tau: V.L * V.L * mat.rho * mat.c / mat.k };
      };
      reset();

      const loop = kit.loop((dt) => {
        const mA = MATS[V.A], mB = V.B >= 0 ? MATS[V.B] : null;
        if (!paused && dt > 0) {
          const dtS = dt * V.sp;
          const dx = V.L / (NX - 1);
          for (const [T, m] of [[TA, mA], [TB, mB]]) {
            if (!m) continue;
            const al = m.k / (m.rho * m.c);
            const ns = clamp(Math.ceil(dtS / (0.5 * dx * dx / al)), 1, 40);
            for (let k = 0; k < ns; k++) stepBar(T, m, dtS / ns);
          }
          t += dtS; since += dt;
        }
        const C = kit.colors();
        const c = st.begin();
        const lo = Math.min(V.Th, V.Tc), hi = Math.max(V.Th, V.Tc), span = Math.max(hi - lo, 1);
        const xL = 96, xR = st.W - 96, bh = 26;
        const rows = mB ? [[TA, mA, 'A', st.H * 0.36], [TB, mB, 'B', st.H * 0.74]] : [[TA, mA, 'A', st.H * 0.55]];
        c.fillStyle = kit.hue(0, 0.45); c.fillRect(xL - 64, 18, 60, st.H - 36);
        kit.label(c, 'hot', xL - 34, 32, { size: 11.5, align: 'center', color: C.text });
        kit.label(c, V.Th + ' °C', xL - 34, 48, { size: 11.5, align: 'center', color: C.text });
        if (V.ins) {
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1;
          for (let y = 18; y < st.H - 18; y += 8) { c.beginPath(); c.moveTo(xR + 4, y); c.lineTo(xR + 16, y + 8); c.stroke(); }
          c.restore();
          kit.label(c, 'insulated', xR + 20, st.H / 2, { size: 11.5, color: C.muted });
        } else {
          c.fillStyle = kit.hue(215, 0.45); c.fillRect(xR + 4, 18, 60, st.H - 36);
          kit.label(c, 'cold', xR + 34, 32, { size: 11.5, align: 'center', color: C.text });
          kit.label(c, V.Tc + ' °C', xR + 34, 48, { size: 11.5, align: 'center', color: C.text });
        }
        for (const [T, m, tag, yc] of rows) {
          const w = (xR - xL) / (NX - 1);
          for (let i = 0; i < NX - 1; i++) {
            c.fillStyle = hot(kit, ((T[i] + T[i + 1]) / 2 - lo) / span);
            c.fillRect(xL + i * w, yc - bh / 2, w + 0.6, bh);
          }
          c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(xL, yc - bh / 2, xR - xL, bh);
          kit.label(c, tag + ': ' + m.name, xL, yc - bh / 2 - 10, { size: 12, weight: 600, color: C.text2 });
        }
        kit.label(c, 't = ' + fmtTime(t), st.W / 2, 12, { size: 12, align: 'center', color: C.muted });

        if (since > 0.1 || dt === 0) {
          since = 0;
          const xs = i => 100 * V.L * i / (NX - 1);
          const series = [{ pts: Array.from(TA, (v, i) => [xs(i), v]), label: 'A: ' + mA.name, color: C.accent }];
          if (mB) series.push({ pts: Array.from(TB, (v, i) => [xs(i), v]), label: 'B: ' + mB.name, color: C.series[1] });
          series.push({ pts: V.ins ? [[0, V.Th], [100 * V.L, V.Th]] : [[0, V.Th], [100 * V.L, V.Tc]], label: 'steady state', color: C.faint, dash: [6, 4], width: 1.5 });
          plot.set({ series, x: { label: 'position along the bar (cm)', min: 0, max: 100 * V.L }, y: { label: 'temperature (°C)', min: lo - 0.05 * span, max: hi + 0.05 * span } });
        }
        const fA = flows(TA, mA);
        ro.set('t', fmtTime(t));
        ro.set('inA', fmtU(fA.pin, 'W') + ' / ' + fmtU(fA.pout, 'W'));
        ro.set('ssA', fmtU(fA.pss, 'W'));
        ro.set('tauA', fmtTime(fA.tau));
        if (mB) { const fB = flows(TB, mB); ro.set('inB', fmtU(fB.pin, 'W') + ' / ' + fmtU(fB.pout, 'W')); ro.set('tauB', fmtTime(fB.tau)); }
        else { ro.set('inB', '—'); ro.set('tauB', '—'); }
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================== heating curve */
  Hyper.sim('heat-heating-curve', {
    title: 'Heating curve: ice to steam',
    blurb: `A block of ice sits on a heater that delivers a steady power (no heat is lost, and the steam is kept at atmospheric pressure). The graph plots temperature against time; the bars show how the energy is shared between the five stages.

- Watch the two flat stretches: while ice melts and while water boils, energy pours in but the temperature does not move. That energy is the **latent heat**.
- Compare the lengths: boiling takes more than five times as long as heating the water from 0 °C to 100 °C.
- The sloping parts are steeper for ice and steam than for liquid water: their specific heat is about half as large.
- Double the mass or halve the power: the curve keeps its shape, and every stage takes twice as long.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 330 });
      const gb = document.createElement('div');
      gb.style.padding = '4px 10px 10px';
      box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (min)', min: 0 }, y: { label: 'temperature (°C)', min: -45, max: 140 } }, 220);
      const CI = 2100, LF = 334000, CW = 4186, LV = 2256000, CS = 2010, TEND = 130;
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Heater power', min: 100, max: 3000, step: 50, value: 1000, unit: 'W' },
        { id: 'm', label: 'Mass of ice', min: 0.1, max: 2, step: 0.05, value: 0.5, unit: 'kg' },
        { id: 'T0', label: 'Starting temperature', min: -40, max: -1, step: 1, value: -20, unit: '°C' },
        { id: 'sp', label: 'Speed-up', min: 10, max: 2000, value: 100, log: true, sig: 2, unit: '×' },
        { type: 'buttons', items: [{ id: 'go', label: 'Heat / pause', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], (id) => {
        if (id === 'go') running = !running;
        else if (id === 'reset' || id === 'm' || id === 'T0') { E = 0; running = true; }
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['E', 'Energy supplied'], ['T', 'Temperature'], ['now', 'Happening now']]);
      let E = 0, running = true, since = 1;
      const bubbles = [];
      const stages = () => {
        const m = V.m;
        return [['ice warms', m * CI * (0 - V.T0)], ['ice melts', m * LF], ['water warms', m * CW * 100], ['water boils', m * LV], ['steam warms', m * CS * (TEND - 100)]];
      };
      function stateAt(Ein) {
        const S = stages(), m = V.m;
        let e = Ein;
        if (e < S[0][1]) return { T: V.T0 + e / (m * CI), k: 0, ice: 1, liq: 0 };
        e -= S[0][1];
        if (e < S[1][1]) { const f = e / S[1][1]; return { T: 0, k: 1, ice: 1 - f, liq: f }; }
        e -= S[1][1];
        if (e < S[2][1]) return { T: e / (m * CW), k: 2, ice: 0, liq: 1 };
        e -= S[2][1];
        if (e < S[3][1]) { const f = e / S[3][1]; return { T: 100, k: 3, ice: 0, liq: 1 - f }; }
        e -= S[3][1];
        return { T: 100 + Math.min(e, S[4][1]) / (m * CS), k: 4, ice: 0, liq: 0 };
      }

      const loop = kit.loop((dt) => {
        const S = stages(), Etot = S.reduce((s, x) => s + x[1], 0);
        if (running && dt > 0) { E = Math.min(Etot, E + V.P * dt * V.sp); since += dt; if (E >= Etot) running = false; }
        const s = stateAt(E), tMin = E / V.P / 60;
        const C = kit.colors();
        const c = st.begin();
        // heater, beaker, contents
        const bx = 40, bw = Math.min(170, st.W * 0.26), bb = st.H - 42, bt = 40, bhh = bb - bt;
        c.fillStyle = kit.hue(10, 0.25 + 0.5 * V.P / 3000); c.fillRect(bx - 10, bb + 6, bw + 20, 14);
        kit.label(c, V.P + ' W heater', bx + bw / 2, bb + 32, { size: 11.5, align: 'center', color: C.muted });
        const water = C.dark ? 'rgba(90,160,255,.45)' : 'rgba(60,130,230,.35)';
        const lev = bhh * 0.55 * (s.k < 3 ? 1 : s.liq);
        if (s.liq > 0) { c.fillStyle = water; c.fillRect(bx, bb - lev, bw, lev); }
        const cubes = s.k === 0 ? 6 : s.k === 1 ? Math.ceil(6 * s.ice) : 0;
        for (let i = 0; i < cubes; i++) {
          const size = s.k === 1 ? 16 + 12 * s.ice : 28, cx = bx + 14 + (i % 3) * (bw - 28) / 2.3, cy = bb - 6 - size - Math.floor(i / 3) * (size + 4);
          c.fillStyle = C.dark ? 'rgba(210,235,255,.85)' : 'rgba(170,215,245,.95)'; c.strokeStyle = C.border2; c.lineWidth = 1;
          c.fillRect(cx, cy, size, size); c.strokeRect(cx, cy, size, size);
        }
        if (s.k === 3 && running) { if (bubbles.length < 40 && Math.random() < 0.6) bubbles.push({ x: bx + 8 + Math.random() * (bw - 16), y: bb - 4, r: 2 + Math.random() * 3 }); }
        for (let i = bubbles.length - 1; i >= 0; i--) {
          const q = bubbles[i]; q.y -= 60 * Math.max(dt, 0);
          if (s.k !== 3 || q.y < bb - lev) { bubbles.splice(i, 1); continue; }
          c.strokeStyle = C.text2; c.lineWidth = 1; c.beginPath(); c.arc(q.x, q.y, q.r, 0, 7); c.stroke();
        }
        if (s.k >= 3) {
          const amt = s.k === 3 ? 1 - s.liq : 1;
          c.fillStyle = C.dark ? 'rgba(230,230,240,' + (0.12 + 0.25 * amt) + ')' : 'rgba(120,120,140,' + (0.08 + 0.2 * amt) + ')';
          for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(bx + bw * (0.2 + 0.15 * i), bt - 6 + 8 * Math.sin(E * 1e-5 + i), 14 + 6 * amt, 0, 7); c.fill(); }
        }
        c.strokeStyle = C.border2; c.lineWidth = 3;
        c.beginPath(); c.moveTo(bx, bt); c.lineTo(bx, bb); c.lineTo(bx + bw, bb); c.lineTo(bx + bw, bt); c.stroke();
        // thermometer
        const tx = bx + bw + 26, tTop = bt, tBot = bb - 8;
        const f = clamp((s.T + 45) / 185, 0, 1);
        c.fillStyle = C.surface; c.fillRect(tx - 4, tTop, 8, tBot - tTop);
        c.fillStyle = C.bad; c.fillRect(tx - 3, tBot - (tBot - tTop) * f, 6, (tBot - tTop) * f);
        kit.dot(c, tx, tBot + 6, 8, C.bad);
        kit.label(c, fmt(s.T, 3) + ' °C', tx + 12, tBot - (tBot - tTop) * f, { size: 12, weight: 600, color: C.text });
        // energy budget
        const ex = tx + 80, ew = Math.max(60, st.W - ex - 20), big = Math.max(...S.map(x => x[1]));
        kit.label(c, 'Energy for each stage', ex, 22, { size: 12, weight: 600, color: C.text2 });
        let acc = 0;
        S.forEach(([lab, e], i) => {
          const yy = 42 + i * Math.min(34, (st.H - 60) / 5);
          const done = clamp((E - acc) / Math.max(e, 1e-9), 0, 1);
          acc += e;
          c.fillStyle = C.surface; c.fillRect(ex, yy + 8, ew, 9);
          c.fillStyle = i === 1 || i === 3 ? C.warn : C.accent; c.fillRect(ex, yy + 8, ew * (e / big) * done, 9);
          c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(ex, yy + 8, ew * (e / big), 9);
          kit.label(c, lab + ': ' + fmtU(e, 'J') + (i === 1 || i === 3 ? '  (latent heat)' : ''), ex, yy, { size: 11.5, color: i === s.k ? C.text : C.muted, weight: i === s.k ? 600 : 500 });
        });

        if (since > 0.1 || dt === 0) {
          since = 0;
          const pts = [[0, V.T0]]; let a2 = 0;
          const tempAfter = [0, 0, 100, 100, TEND];
          S.forEach((x, i) => { a2 += x[1]; pts.push([a2 / V.P / 60, tempAfter[i]]); });
          const done = pts.filter(p => p[0] <= tMin).concat([[tMin, s.T]]);
          plot.set({ series: [{ pts, color: C.faint, dash: [5, 5], width: 1.4 }, { pts: done, color: C.accent, width: 2.6 }],
            x: { label: 'time (min)', min: 0, max: Etot / V.P / 60 * 1.03 }, y: { label: 'temperature (°C)', min: -45, max: 140 },
            marks: [{ x: tMin, y: s.T }], hlines: [{ y: 0, color: C.faint }, { y: 100, color: C.faint }] });
        }
        ro.set('t', fmtTime(E / V.P));
        ro.set('E', fmtU(E, 'J') + ' of ' + fmtU(Etot, 'J'));
        ro.set('T', fmt(s.T, 3) + ' °C');
        ro.set('now', s.k === 1 ? 'melting: ' + Math.round(100 * (1 - s.ice)) + ' % melted' : s.k === 3 ? 'boiling: ' + Math.round(100 * (1 - s.liq)) + ' % boiled away' : S[s.k][0]);
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================== Newton's law of cooling */
  Hyper.sim('heat-cooling', {
    title: 'Cooling coffee: Newton\'s law of cooling',
    blurb: `A hot drink loses heat to the room at a rate proportional to how much hotter it is, so its temperature slides exponentially towards room temperature with time constant $\\tau = mc/hA$ (here $h$ lumps together convection, radiation and evaporation).

- Note how far the coffee falls in the first time constant, and then in the second: the excess over room temperature shrinks by the same factor, 1/e, each time.
- Try the espresso cup and the travel mug: small mass or poor heat transfer changes $\\tau$ from minutes to hours.
- **The milk puzzle.** Tick the comparison: cup A gets cold milk at once, cup B the same milk later. Which is cooler at the end? The coffee that stays hotter loses heat faster, so waiting wins.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200, maxH: 300 });
      const gb = document.createElement('div');
      gb.style.padding = '4px 10px 10px';
      box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (min)', min: 0 }, y: { label: 'temperature (°C)' }, legend: true }, 220);
      const CUPS = [
        ['Ceramic mug, 300 mL', { m: 0.30, A: 0.030, h: 19 }],
        ['Paper cup without a lid, 250 mL', { m: 0.25, A: 0.028, h: 22 }],
        ['Espresso cup, 40 mL', { m: 0.04, A: 0.009, h: 20 }],
        ['Bowl of soup, 350 mL', { m: 0.35, A: 0.060, h: 20 }],
        ['Insulated travel mug, 350 mL', { m: 0.35, A: 0.035, h: 2.5 }]
      ];
      const CW = 4186, CM = 3930, TMILK = 5, FMILK = 0.2;
      const ctl = kit.controls(box.side, [
        { id: 'cup', type: 'select', label: 'Container', options: CUPS, value: CUPS[0][1] },
        { id: 'T0', label: 'Poured at', min: 50, max: 100, step: 1, value: 90, unit: '°C' },
        { id: 'Ta', label: 'Room temperature', min: 0, max: 35, step: 1, value: 20, unit: '°C' },
        { id: 'milk', type: 'check', label: 'Compare: milk at once (A) or later (B)', value: false },
        { id: 'tm', label: 'B: milk added after', min: 1, max: 30, step: 1, value: 10, unit: 'min' },
        { type: 'buttons', items: [{ id: 'go', label: 'Pour again', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'pause') paused = !paused;
        else { t = 0; paused = false; }
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tau', 'Time constant τ = mc/hA'], ['A', 'Cup A now'], ['B', 'Cup B now'], ['t60', 'Cup A reaches 60 °C after'], ['half', 'Half-time τ ln 2']]);
      let t = 0, paused = false, since = 1;
      const tauOf = () => V.cup.m * CW / (V.cup.h * V.cup.A);          // s, black coffee
      const tEnd = () => clamp(3 * tauOf() / 60, 30, 300);             // min
      /* temperature (°C) after t minutes; milk at tm minutes (null = never) */
      function curve(tm) {
        const q = V.cup, C0 = q.m * CW, Cm = C0 + FMILK * q.m * CM, hA = q.h * q.A;
        const mix = T => (C0 * T + FMILK * q.m * CM * TMILK) / Cm, Ta = V.Ta;
        return tt => {
          if (tm == null || tt < tm) return Ta + (V.T0 - Ta) * Math.exp(-tt * 60 * hA / C0);
          const Tb = Ta + (V.T0 - Ta) * Math.exp(-tm * 60 * hA / C0);
          return Ta + (mix(Tb) - Ta) * Math.exp(-(tt - tm) * 60 * hA / Cm);
        };
      }
      function drawCup(c, C, x, y, T, milky, label, pour) {
        const w = 70, h = 64;
        c.fillStyle = milky ? 'rgb(176,128,86)' : 'rgb(96,58,32)';
        c.beginPath(); c.moveTo(x - w / 2 + 3, y - h + 10); c.lineTo(x + w / 2 - 3, y - h + 10); c.lineTo(x + w / 2 - 9, y - 3); c.lineTo(x - w / 2 + 9, y - 3); c.closePath(); c.fill();
        c.strokeStyle = C.border2; c.lineWidth = 3;
        c.beginPath(); c.moveTo(x - w / 2, y - h); c.lineTo(x - w / 2 + 8, y); c.lineTo(x + w / 2 - 8, y); c.lineTo(x + w / 2, y - h); c.stroke();
        c.beginPath(); c.arc(x + w / 2 + 4, y - h / 2, 11, -1.2, 1.2); c.stroke();
        const f = clamp((T - V.Ta) / 70, 0, 1);
        c.save(); c.strokeStyle = C.muted; c.globalAlpha = 0.15 + 0.7 * f; c.lineWidth = 2;
        for (let k = -1; k <= 1; k++) {
          c.beginPath();
          for (let j = 0; j <= 20; j++) { const yy = y - h - 4 - j * 2 * (0.4 + f); const xx = x + k * 16 + 5 * Math.sin(j / 3 + t * 0.8 + k); j ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
          c.stroke();
        }
        c.restore();
        if (pour) { c.fillStyle = C.text2; c.fillRect(x - 3, y - h - 52, 6, 44); kit.label(c, 'milk', x + 8, y - h - 40, { size: 11, color: C.muted }); }
        kit.label(c, fmt(T, 3) + ' °C', x, y - h - 62 + (pour ? -12 : 0), { size: 13, weight: 600, align: 'center' });
        kit.label(c, label, x, y + 16, { size: 11.5, align: 'center', color: C.muted });
      }

      const loop = kit.loop((dt) => {
        const te = tEnd();
        if (!paused && dt > 0 && t < te) { t = Math.min(te, t + dt * te / 25); since += dt; }
        const cups = V.milk ? [[curve(0), 'A: milk at once', 0], [curve(V.tm), 'B: milk after ' + V.tm + ' min', V.tm]] : [[curve(null), 'black coffee', null]];
        const C = kit.colors();
        const c = st.begin();
        cups.forEach(([f, lab, tm], i) => {
          const x = st.W * (cups.length === 1 ? 0.5 : 0.3 + 0.4 * i);
          drawCup(c, C, x, st.H - 34, f(t), tm != null && t >= tm, lab, tm != null && t >= tm && t < tm + te / 60);
        });
        kit.label(c, 't = ' + fmt(t, 3) + ' min', 14, 16, { size: 12, color: C.muted });
        kit.label(c, 'room ' + V.Ta + ' °C', 14, 34, { size: 12, color: C.muted });
        if (since > 0.1 || dt === 0) {
          since = 0;
          const series = [];
          cups.forEach(([f, lab], i) => {
            const col = i ? C.series[1] : C.accent, all = [], done = [];
            for (let k = 0; k <= 200; k++) { const tt = te * k / 200; all.push([tt, f(tt)]); if (tt <= t) done.push([tt, f(tt)]); }
            done.push([t, f(t)]);
            series.push({ pts: all, color: col, dash: [4, 5], width: 1.2 }, { pts: done, color: col, width: 2.6, label: lab });
          });
          plot.set({ series, x: { label: 'time (min)', min: 0, max: te }, y: { label: 'temperature (°C)', min: Math.min(V.Ta, TMILK) - 2, max: V.T0 + 4 },
            hlines: [{ y: V.Ta, color: C.faint }, { y: 60, color: C.warn }], legend: true });
        }
        const tau = tauOf();
        const fA = cups[0][0];
        let t60 = null;
        for (let k = 0; k <= 3000; k++) { const tt = te * k / 3000; if (fA(tt) <= 60) { t60 = tt; break; } }
        ro.set('tau', fmt(tau / 60, 3) + ' min (m = ' + V.cup.m + ' kg, hA = ' + fmt(V.cup.h * V.cup.A, 3) + ' W/K)');
        ro.set('A', fmt(fA(t), 3) + ' °C');
        ro.set('B', V.milk ? fmt(cups[1][0](t), 3) + ' °C' : '—');
        ro.set('t60', V.T0 <= 60 ? 'already at or below 60 °C' : t60 == null ? 'not within ' + fmt(te, 3) + ' min' : fmt(t60, 3) + ' min');
        ro.set('half', fmt(tau * Math.LN2 / 60, 3) + ' min');
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================== thermal radiation */
  Hyper.sim('heat-radiation', {
    title: 'Thermal radiation: T⁴ and the colour of hot things',
    blurb: `A surface at temperature $T$ radiates $\\varepsilon\\sigma T^4$ watts per square metre and absorbs $\\varepsilon\\sigma T_s^4$ from surroundings at $T_s$. The graph below is the spectrum it emits (for $\\varepsilon = 1$ it is the blackbody spectrum); the two faint vertical lines bound the visible band, 0.38–0.75 µm.

- Double the temperature and read the power: sixteen times as much.
- Warm the object from 300 K upwards. Its glow first becomes visible, a dull red, at around 800 K; by the temperature of a lamp filament most of the radiation is still infrared.
- Watch the peak slide to shorter wavelengths as $T$ rises — Wien's law, $\\lambda_{max} = b/T$.
- Set the object to the temperature of the surroundings: it still radiates, but it absorbs exactly as much.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 210, maxH: 320 });
      const gb = document.createElement('div');
      gb.style.padding = '4px 10px 10px';
      box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'wavelength (µm)', min: 0.1, max: 100, log: true }, y: { label: 'W/(m²·µm)', min: 0 }, legend: true }, 220);
      const PRE = [['(pick an example)', 0], ['Ice, 0 °C', 273], ['Human skin, 33 °C', 306], ['Oven wall, 250 °C', 523], ['Stove ring, dull red', 900], ['Glowing iron', 1400], ['Lamp filament', 2800], ['Surface of the Sun', 5772]];
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature of the surface', min: 100, max: 6500, step: 10, value: 1000, unit: 'K' },
        { id: 'eps', label: 'Emissivity ε', min: 0.02, max: 1, step: 0.01, value: 0.9 },
        { id: 'Ts', label: 'Surroundings', min: 3, max: 400, step: 1, value: 293, unit: 'K' },
        { id: 'pre', type: 'select', label: 'Example', options: PRE, value: 0 }
      ], (id, v) => {
        if (id === 'pre' && v > 0) ctl.set('T', v);
        since = 1;
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Emitted εσT⁴ (per m²)'], ['Pa', 'Absorbed εσT_s⁴'], ['net', 'Net loss'], ['lam', 'Peak wavelength b/T'], ['vis', 'Share that is visible']]);
      let since = 1;
      const planck = (um, T) => { const l = um * 1e-6, x = HP * CL / (l * KB * T); if (x > 700) return 0; return 2 * Math.PI * HP * CL * CL / Math.pow(l, 5) / Math.expm1(x) * 1e-6; };
      function visFrac(T) {
        const a = 0.38, b = 0.75, N = 60, h = (b - a) / N;
        let s = planck(a, T) + planck(b, T);
        for (let i = 1; i < N; i++) s += (i % 2 ? 4 : 2) * planck(a + i * h, T);
        return s * h / 3 / (SIGMA * Math.pow(T, 4));
      }
      function glow(T) {
        const t = T / 100;
        let r, g, b;
        if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307; }
        else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); b = 255; }
        return [r, g, b].map(v => Math.round(clamp(v, 0, 255)));
      }

      const loop = kit.loop((dt) => {
        since += dt;
        const T = V.T, eps = V.eps, P = eps * SIGMA * Math.pow(T, 4), Pa = eps * SIGMA * Math.pow(V.Ts, 4);
        const fv = visFrac(T), Mv = fv * P;
        const C = kit.colors();
        const c = st.begin();
        // the glowing disc
        const R = Math.min(70, st.H * 0.3), cx = 30 + R, cy = st.H / 2;
        // the eye sees a glow from about 1e-4 W/m² of visible light (around 800 K) up to the dazzle of the Sun
        const [r, g, b] = glow(T), al = clamp((Math.log10(Math.max(Mv, 1e-12)) + 4) / 10, 0, 1);
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill();
        if (al > 0) {
          const gr = c.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
          gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + al + ')');
          gr.addColorStop(0.62, 'rgba(' + r + ',' + g + ',' + b + ',' + al * 0.9 + ')');
          gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
          c.fillStyle = gr; c.beginPath(); c.arc(cx, cy, R * 1.5, 0, 7); c.fill();
        }
        c.strokeStyle = C.border2; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke();
        kit.label(c, al > 0.02 ? 'visible glow' : 'no visible glow: infrared only', cx, cy + R + 16, { size: 11.5, align: 'center', color: C.muted });
        // P against T, on linear axes
        const x0 = cx + R * 1.6 + 50, w = Math.max(80, st.W - x0 - 20), y0 = 16, h = Math.max(60, st.H - 44);
        const TM = 6500, PM = eps * SIGMA * Math.pow(TM, 4) / 1e6;
        const ax = axes(c, kit, { x0, y0, w, h, xmin: 0, xmax: TM, ymin: 0, ymax: PM * 1.05, xlabel: 'T (K)', ylabel: 'εσT⁴ (MW/m²)' });
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        for (let k = 0; k <= 130; k++) { const TT = TM * k / 130, y = ax.Y(eps * SIGMA * Math.pow(TT, 4) / 1e6); k ? c.lineTo(ax.X(TT), y) : c.moveTo(ax.X(TT), y); }
        c.stroke();
        kit.dot(c, ax.X(T), ax.Y(P / 1e6), 6, C.bad, C.bg2);
        kit.dot(c, ax.X(T / 2), ax.Y(P / 16 / 1e6), 4.5, C.series[6], C.bg2);
        kit.label(c, 'T/2 radiates 1/16 as much', ax.X(T / 2) + 8, ax.Y(P / 16 / 1e6) - 12, { size: 11, color: C.muted });

        if (since > 0.1 || dt === 0) {
          since = 0;
          const pts = [], ptsS = [];
          for (let k = 0; k <= 220; k++) { const um = 0.1 * Math.pow(1000, k / 220); pts.push([um, eps * planck(um, T)]); ptsS.push([um, eps * planck(um, V.Ts)]); }
          let top = 0; for (const p of pts) top = Math.max(top, p[1]); for (const p of ptsS) top = Math.max(top, p[1]);
          plot.set({ series: [{ pts, color: C.bad, width: 2.4, label: 'surface at ' + T + ' K', fill: true }, { pts: ptsS, color: C.series[6], dash: [5, 4], width: 1.6, label: 'surroundings at ' + V.Ts + ' K' }],
            x: { label: 'wavelength (µm)', min: 0.1, max: 100, log: true }, y: { label: 'W/(m²·µm)', min: 0, max: Math.max(top * 1.08, 1e-12) },
            vlines: [{ x: 0.38, color: C.faint }, { x: 0.75, color: C.faint }], marks: [{ x: WIEN / T * 1e6, y: eps * planck(WIEN / T * 1e6, T), label: 'peak' }] });
        }
        ro.set('P', fmtU(P, 'W'));
        ro.set('Pa', fmtU(Pa, 'W'));
        ro.set('net', fmtU(P - Pa, 'W'));
        const lam = WIEN / T * 1e6;
        ro.set('lam', fmt(lam, 3) + ' µm' + (lam > 0.75 ? ' (infrared)' : lam < 0.38 ? ' (ultraviolet)' : ' (visible)'));
        ro.set('vis', fv < 1e-6 ? 'less than 0.0001 %' : fmt(100 * fv, 2) + ' %');
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
