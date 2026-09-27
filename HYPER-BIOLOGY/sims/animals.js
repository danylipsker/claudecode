/* HYPER-BIOLOGY · sims/animals.js — simulations for "Animal Form and Function" (content/animals.js).
 *   ani-gills      a gill lamella with water and blood flowing against or with each other: PO₂ profiles, O₂ extraction,
 *                  and the exact steady state of exchanger theory (effectiveness–NTU)
 *   ani-thermo     a lizard and a small mammal of the same mass through a day in a desert, meadow or forest: heat
 *                  budgets, basking and shuttling, torpor, energy used per day
 *   ani-allometry  mouse to whale on log–log axes: metabolic rate, heart rate, breathing, lifespan, heartbeats (kit.bio.kleiber)
 *   ani-nerve      a race between an unmyelinated and a myelinated axon (square-root and linear speed rules, saltatory jumps)
 *   ani-loop       the countercurrent multiplier of the loop of Henle, step by step: loop length -> urine concentration
 *   ani-lever      a limb as a lever driven by a Hill-type muscle: speed against force, time to lift a load
 *   ani-feedback   a negative-feedback loop with gain and delay: steady error D/(1 + G), overshoot, positive feedback
 *   ani-morphogen  a morphogen gradient forming by diffusion and decay, read by threshold genes (the French flag)
 */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmt = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '—');
  // a temperature as a colour: blue when cold, red when hot
  const tempHue = T => 220 - 220 * clamp((T - 5) / 40, 0, 1);

  /* ================================================================ ani-gills */
  Hyper.sim('ani-gills', {
    title: 'Countercurrent and concurrent gills',
    blurb: `A gill lamella drawn open: water (top) flows from left to right over a thin barrier, and blood (bottom) flows beneath it — against the water (countercurrent, as in real fish) or with it (concurrent). Oxygen crosses wherever the water's partial pressure is higher than the blood's. The colours and the graph show PO₂ along the lamella as the two streams are followed cell by cell until the profiles settle; the read-out compares the result with the exact steady state of exchanger theory.

**Try this**
- In countercurrent flow the water leaves with little oxygen left, and the blood leaves with nearly the PO₂ of the incoming water. Press *Switch direction*: the two streams now converge on a middle value, and extraction falls to at most a half.
- Raise the diffusing capacity (more lamellae, thinner barriers): countercurrent extraction climbs towards 100 %, concurrent levels off at 50 %.
- Make the blood flow much larger than the water flow: now the water is stripped almost completely in either arrangement. The advantage of countercurrent flow is greatest when the two flows are matched — as fish keep them.
- Lower the PO₂ of the incoming water, as in a stagnant pond: the percentage extracted stays the same, but the blood leaving carries less.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const N = 60, Pw = new Float64Array(N), Pb = new Float64Array(N);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Blood flows', options: [['against the water (countercurrent)', 'counter'], ['with the water (concurrent)', 'con']], value: 'counter' },
        { id: 'K', label: 'Diffusing capacity (area ÷ barrier thickness)', min: 0.5, max: 10, step: 0.1, value: 5 },
        { id: 'Qw', label: 'Water flow (relative)', min: 0.25, max: 4, value: 1, log: true, sig: 2 },
        { id: 'Qb', label: 'Blood flow × its O₂ capacity (relative)', min: 0.25, max: 4, value: 1, log: true, sig: 2 },
        { id: 'Pin', label: 'PO₂ of the incoming water', min: 4, max: 21, step: 0.5, value: 21, unit: 'kPa' },
        { id: 'Pv', label: 'PO₂ of the incoming (venous) blood', min: 0, max: 8, step: 0.5, value: 2, unit: 'kPa' },
        { type: 'buttons', items: [{ id: 'swap', label: 'Switch direction', primary: true }, { id: 'fill', label: 'Start again' }] }
      ], (id) => {
        if (id === 'swap') ctl.set('mode', V.mode === 'counter' ? 'con' : 'counter');
        if (id === 'fill') fill();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ext', 'O₂ taken from the water'], ['art', 'PO₂ of the blood leaving'], ['wout', 'PO₂ of the water leaving'], ['th', 'Steady state: countercurrent / concurrent'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'position along the lamella, in the direction of the water (%)', min: 0, max: 100 }, y: { label: 'PO₂ (kPa)', min: 0, max: 22 }, legend: true }, 170);
      const R = kit.bio.rng(11);
      const dotsW = Array.from({ length: 36 }, () => ({ p: R(), y: R() })), dotsB = Array.from({ length: 36 }, () => ({ p: R(), y: R() }));
      let acc = 0;
      function fill() { for (let i = 0; i < N; i++) { Pw[i] = V.Pin; Pb[i] = V.Pv; } }
      fill();
      // exact steady state of a two-stream exchanger (effectiveness–NTU method)
      function theory(counter) {
        const Cw = V.Qw, Cb = V.Qb, Cmin = Math.min(Cw, Cb), Cr = Cmin / Math.max(Cw, Cb), ntu = V.K / Cmin;
        const eps = counter
          ? (Math.abs(1 - Cr) < 1e-6 ? ntu / (1 + ntu) : (1 - Math.exp(-ntu * (1 - Cr))) / (1 - Cr * Math.exp(-ntu * (1 - Cr))))
          : (1 - Math.exp(-ntu * (1 + Cr))) / (1 + Cr);
        const q = eps * Cmin * Math.max(0, V.Pin - V.Pv);
        return { ext: V.Pin > 0 ? q / (Cw * V.Pin) : 0, art: V.Pv + q / Cb };
      }
      // one cell's worth of flow for both streams, then exchange for the time a parcel spends in a cell
      function step() {
        const counter = V.mode === 'counter', dt = 1 / N;
        for (let i = N - 1; i > 0; i--) Pw[i] = Pw[i - 1];
        Pw[0] = V.Pin;
        if (counter) { for (let i = 0; i < N - 1; i++) Pb[i] = Pb[i + 1]; Pb[N - 1] = V.Pv; }
        else { for (let i = N - 1; i > 0; i--) Pb[i] = Pb[i - 1]; Pb[0] = V.Pv; }
        const a = V.K / V.Qw, b = V.K / V.Qb, s = a + b, dec = Math.exp(-s * dt);
        for (let i = 0; i < N; i++) {
          // the pair relaxes exactly towards its capacity-weighted mean
          const d = Pw[i] - Pb[i], m = (b * Pw[i] + a * Pb[i]) / s, dn = d * dec;
          Pw[i] = m + a / s * dn; Pb[i] = m - b / s * dn;
        }
      }
      const colW = P => 'hsl(200 75% ' + (22 + 45 * clamp(P / 21, 0, 1)).toFixed(0) + '%)';
      const colB = P => 'hsl(350 70% ' + (20 + 38 * clamp(P / 21, 0, 1)).toFixed(0) + '%)';
      const loop = kit.loop((dt) => {
        const counter = V.mode === 'counter';
        acc += dt * N / 2.5;                                    // a parcel crosses the lamella in about 2.5 s on screen
        let n = 0;
        while (acc >= 1 && n < 12) { step(); acc -= 1; n++; }
        if (acc > 1) acc = 0;
        for (const d of dotsW) d.p = (d.p + dt * 0.4 * Math.sqrt(V.Qw)) % 1;
        for (const d of dotsB) d.p = (d.p + dt * 0.4 * Math.sqrt(V.Qb)) % 1;
        const wout = Pw[N - 1], art = counter ? Pb[0] : Pb[N - 1];
        const ext = V.Pin > 0 ? (V.Pin - wout) / V.Pin : 0, tc = theory(true), tp = theory(false);
        ro.set('ext', (100 * ext).toFixed(0) + ' % (steady state ' + (100 * (counter ? tc : tp).ext).toFixed(0) + ' %)');
        ro.set('art', fmt(art) + ' kPa (incoming water ' + fmt(V.Pin) + ' kPa)');
        ro.set('wout', fmt(wout) + ' kPa');
        ro.set('th', (100 * tc.ext).toFixed(0) + ' % / ' + (100 * tp.ext).toFixed(0) + ' % of the oxygen');
        ro.set('msg', counter ? 'countercurrent: blood leaves where the freshest water enters' : 'concurrent: both streams leave at the same end');
        plot.set({ series: [
          { pts: Array.from(Pw, (p, i) => [100 * (i + 0.5) / N, p]), label: 'water', color: 'hsl(200 75% 50%)' },
          { pts: Array.from(Pb, (p, i) => [100 * (i + 0.5) / N, p]), label: 'blood', color: 'hsl(350 70% 52%)' }
        ] });
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, m = 70, x0 = m, x1 = W - m, cw = (x1 - x0) / N;
        const yw0 = H * 0.16, yw1 = H * 0.45, yb0 = H * 0.53, yb1 = H * 0.82;
        for (let i = 0; i < N; i++) {
          c.fillStyle = colW(Pw[i]); c.fillRect(x0 + i * cw, yw0, cw + 0.6, yw1 - yw0);
          c.fillStyle = colB(Pb[i]); c.fillRect(x0 + i * cw, yb0, cw + 0.6, yb1 - yb0);
        }
        c.fillStyle = C.muted; c.fillRect(x0, yw1, x1 - x0, yb0 - yw1);
        // moving particles show the direction of each stream
        c.fillStyle = 'rgba(255,255,255,.55)';
        for (const d of dotsW) { c.beginPath(); c.arc(x0 + d.p * (x1 - x0), yw0 + 5 + d.y * (yw1 - yw0 - 10), 2, 0, 6.283); c.fill(); }
        for (const d of dotsB) { const p = counter ? 1 - d.p : d.p; c.beginPath(); c.arc(x0 + p * (x1 - x0), yb0 + 5 + d.y * (yb1 - yb0 - 10), 2.4, 0, 6.283); c.fill(); }
        // oxygen crossing the barrier: arrows sized by the local difference
        for (let i = 3; i < N; i += 6) {
          const d = Pw[i] - Pb[i], x = x0 + (i + 0.5) * cw, len = clamp(d / 21, 0, 1) * (yb0 - yw1 + 26);
          if (len > 3) kit.arrow(c, x, yw1 - 10, x, yw1 - 10 + len, C.warn, 1.8);
        }
        const lab = (t, x, y, al) => kit.label(c, t, x, y, { size: 11.5, color: C.text, align: al || 'center', bg: C.bg2 });
        lab('water in', x0 - 36, (yw0 + yw1) / 2 - 8); lab(fmt(V.Pin) + ' kPa', x0 - 36, (yw0 + yw1) / 2 + 8);
        lab('water out', x1 + 36, (yw0 + yw1) / 2 - 8); lab(fmt(wout) + ' kPa', x1 + 36, (yw0 + yw1) / 2 + 8);
        const bin = counter ? x1 + 36 : x0 - 36, bout = counter ? x0 - 36 : x1 + 36;
        lab('blood in', bin, (yb0 + yb1) / 2 - 8); lab(fmt(V.Pv) + ' kPa', bin, (yb0 + yb1) / 2 + 8);
        lab('blood out', bout, (yb0 + yb1) / 2 - 8); lab(fmt(art) + ' kPa', bout, (yb0 + yb1) / 2 + 8);
        kit.arrow(c, W / 2 - 40, yw0 - 9, W / 2 + 40, yw0 - 9, C.text, 2);
        if (counter) kit.arrow(c, W / 2 + 40, yb1 + 10, W / 2 - 40, yb1 + 10, C.text, 2);
        else kit.arrow(c, W / 2 - 40, yb1 + 10, W / 2 + 40, yb1 + 10, C.text, 2);
        kit.label(c, 'water', W / 2 + 50, yw0 - 9, { size: 11.5, color: C.muted, align: 'left' });
        kit.label(c, 'blood', W / 2 + 50, yb1 + 10, { size: 11.5, color: C.muted, align: 'left' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ani-thermo */
  Hyper.sim('ani-thermo', {
    title: 'A lizard and a mouse through the day',
    blurb: `A lizard (an ectotherm) and a small mammal (an endotherm) of the same mass live through the same days. The lizard's temperature follows its heat budget — sunshine absorbed, heat lost to the air or the burrow, a little metabolism that rises with temperature ($Q_{10} = 2.5$) — and, if it behaves, it basks, shuttles into shade and retreats to its burrow to stay near its preferred temperature. The mammal stays in the shade and holds 37 °C by making heat (up to six times its basal rate) or by evaporating water; at night it can drop into torpor. The graphs show both temperatures and both metabolic rates; the read-out keeps the energy used each day.

**Try this**
- In the hot desert, watch the lizard bask at dawn, shuttle between sun and shade through the morning and hide in its burrow in the afternoon heat. Its daily energy is a small fraction of the mammal's — compare the two lines on the logarithmic power graph.
- Switch off the lizard's behaviour: sitting in the open it overheats at midday and chills at night.
- Move to the temperate meadow and make both animals small (20 g): the mammal's energy bill soars on cold nights. Now allow torpor and watch the saving — and the cost of rewarming at dawn.
- On the forest floor the sun rarely reaches the ground: the lizard cannot reach its preferred temperature and stays sluggish. Forest lizards in fact prefer lower temperatures.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const HAB = {
        desert: { name: 'hot desert', Tm: 24, A: 13, S: 1000, Tbur: 27 },
        meadow: { name: 'temperate meadow in spring', Tm: 13, A: 7, S: 750, Tbur: 12 },
        forest: { name: 'tropical forest floor', Tm: 26, A: 3.5, S: 150, Tbur: 25.5 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'hab', type: 'select', label: 'Habitat', options: [['Hot desert', 'desert'], ['Temperate meadow in spring', 'meadow'], ['Tropical forest floor', 'forest']], value: 'desert' },
        { id: 'M', label: 'Body mass of each animal', min: 0.01, max: 10, value: 0.1, log: true, unit: 'kg', sig: 2 },
        { id: 'behave', type: 'check', label: 'Lizard thermoregulates by behaviour', value: true },
        { id: 'Tp', label: 'Lizard\'s preferred temperature', min: 28, max: 40, step: 0.5, value: 36, unit: '°C' },
        { id: 'torpor', type: 'check', label: 'Mammal goes into torpor at night (22:00–06:00)', value: false },
        { id: 'speed', label: 'Speed (hours of the day per second)', min: 0.25, max: 6, value: 1.5, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start at dawn', primary: true }] }
      ], (id) => { if (id === 'restart' || id === 'hab' || id === 'M') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['time', 'Time'], ['env', 'Air / sunshine'], ['liz', 'Lizard'], ['mam', 'Mammal'], ['today', 'Energy used so far today'], ['yday', 'Energy used yesterday'], ['act', 'Lizard near its preferred temperature'], ['water', 'Mammal\'s water evaporated for cooling']]);
      const pT = kit.plot(gb, { x: { label: 'hour of the day', min: 0, max: 24 }, y: { label: 'temperature (°C)' }, legend: true }, 160);
      const gb2 = document.createElement('div'); gb2.style.padding = '0 10px 10px'; box.stage.appendChild(gb2);
      const pP = kit.plot(gb2, { x: { label: 'hour of the day', min: 0, max: 24 }, y: { label: 'metabolic rate (W)', log: true }, legend: true }, 140);
      let t, TL, TM, loc, day, eL, eM, wat, act, last, sAir, sL, sM, sPL, sPM, nextSample, Pm, Pe;
      function restart() {
        const H = HAB[V.hab];
        t = 5; TL = H.Tbur; TM = 37; loc = 'burrow'; day = 1; eL = 0; eM = 0; wat = 0; act = 0; last = null; Pm = 0; Pe = 0;
        sAir = []; sL = []; sM = []; sPL = []; sPM = []; nextSample = t;
      }
      restart();
      const air = (H, hr) => H.Tm + H.A * Math.cos(2 * Math.PI * (hr - 15) / 24);
      const sun = (H, hr) => H.S * Math.max(0, Math.sin(Math.PI * (hr - 6) / 12));
      function sub(dt) {                                           // dt in seconds of model time
        const H = HAB[V.hab], hr = t % 24, Ta = air(H, hr), S = sun(H, hr), M = V.M, mc = M * 3500;
        // ---- lizard: behaviour, then its heat budget
        const lo = V.Tp - 2, hi = V.Tp + 1.5;
        if (!V.behave) loc = 'open';
        else if (S < 40) loc = 'burrow';
        else if (loc === 'sun') { if (TL >= hi) loc = Ta > hi ? 'burrow' : 'shade'; }
        else if (loc === 'shade') { if (TL < lo) loc = 'sun'; else if (Ta > hi) loc = 'burrow'; }
        else if (loc === 'burrow') { if (TL < lo - 1) loc = 'sun'; }
        else loc = 'shade';
        const A = 0.12 * Math.pow(M, 2 / 3);
        const smr = 3.4 * Math.pow(M, 0.75) / 8 * Math.pow(2.5, (TL - 37) / 10);
        const absorbed = loc === 'sun' ? 0.9 * 0.3 * A * S : loc === 'open' ? 0.9 * 0.2 * A * S : 0;
        const lost = loc === 'burrow' ? 8 * A * (TL - H.Tbur) : 12 * A * (TL - Ta);
        TL += (smr + absorbed - lost) * dt / mc;
        eL += smr * dt;
        if (loc !== 'burrow' && TL >= V.Tp - 4 && TL <= V.Tp + 2) act += dt / 3600;
        // ---- mammal: proportional control of heat production, evaporation when too warm
        const bmr = 3.4 * Math.pow(M, 0.75), Cc = 0.173 * Math.sqrt(M), G = 20 * Cc;
        const torpid = V.torpor && (hr >= 22 || hr < 6), Tset = torpid ? 12 : 37;          // in torpor it defends only 12 °C
        const pmin = torpid ? 0.1 * bmr * Math.pow(2.5, (TM - 37) / 10) : bmr;
        Pm = clamp(Cc * (TM - Ta) + G * (Tset - TM), pmin, 6 * bmr);
        Pe = !torpid && TM > Tset + 0.2 ? clamp(G * (TM - Tset - 0.2), 0, 10 * bmr) : 0;
        TM += (Pm - Cc * (TM - Ta) - Pe) * dt / mc;
        eM += Pm * dt; wat += Pe * dt / 2.43e6 * 1000;
        t += dt / 3600;
        if (Math.floor(t / 24) + 1 > day) {                       // midnight: close the day's accounts
          last = { eL, eM, act, wat }; eL = 0; eM = 0; act = 0; wat = 0; day++;
          sAir = []; sL = []; sM = []; sPL = []; sPM = []; nextSample = t;
        }
        if (t >= nextSample) {
          const h = t % 24;
          sAir.push([h, Ta]); sL.push([h, TL]); sM.push([h, TM]); sPL.push([h, smr]); sPM.push([h, Pm]);
          nextSample += 0.1;
        }
        return { Ta, S };
      }
      const where = { sun: 'basking in the sun', shade: 'in the shade', burrow: 'in its burrow', open: 'sitting in the open' };
      const loop = kit.loop((dt) => {
        let env = null, left = dt * V.speed * 3600;
        while (left > 1e-9) { const h = Math.min(20, left); env = sub(h); left -= h; }
        const H = HAB[V.hab], hr = t % 24;
        if (!env) env = { Ta: air(H, hr), S: sun(H, hr) };
        const hh = Math.floor(hr), mm = Math.floor((hr - hh) * 60);
        ro.set('time', 'day ' + day + ', ' + String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ' — ' + H.name);
        ro.set('env', fmt(env.Ta) + ' °C / ' + env.S.toFixed(0) + ' W/m²');
        ro.set('liz', fmt(TL) + ' °C, ' + where[loc] + (TL > 44 ? ' — overheating!' : TL < V.Tp - 12 && loc !== 'burrow' ? ' — too cold to move well' : ''));
        ro.set('mam', fmt(TM) + ' °C, making ' + kit.fmt(Pm, 3) + ' W' + (Pe > 0 ? ', evaporating water' : '') + (V.torpor && (hr >= 22 || hr < 6) ? ', in torpor' : ''));
        ro.set('today', 'lizard ' + kit.fmt(eL / 1000, 3) + ' kJ · mammal ' + kit.fmt(eM / 1000, 3) + ' kJ');
        ro.set('yday', last ? 'lizard ' + kit.fmt(last.eL / 1000, 3) + ' kJ · mammal ' + kit.fmt(last.eM / 1000, 3) + ' kJ (' + (last.eL > 0 ? (last.eM / last.eL).toFixed(0) : '—') + ' times as much)' : 'after the first midnight');
        ro.set('act', last ? fmt(last.act) + ' hours yesterday' : fmt(act) + ' hours so far');
        ro.set('water', (last ? fmt(last.wat) + ' g yesterday' : fmt(wat) + ' g so far') + ' (' + fmt(100 * (last ? last.wat : wat) / (V.M * 1000)) + ' % of body mass)');
        pT.set({ series: [{ pts: sAir, label: 'air', dash: [5, 4], color: kit.colors().muted }, { pts: sL, label: 'lizard', color: 'hsl(140 55% 45%)' }, { pts: sM, label: 'mammal', color: 'hsl(25 85% 55%)' }], vlines: [{ x: hr }] });
        pP.set({ series: [{ pts: sPL.filter(p => p[1] > 0), label: 'lizard', color: 'hsl(140 55% 45%)' }, { pts: sPM.filter(p => p[1] > 0), label: 'mammal', color: 'hsl(25 85% 55%)' }], vlines: [{ x: hr }] });
        // ---- the scene
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gy = Hh * 0.68;
        const night = clamp(1 - env.S / 200, 0, 1);
        c.fillStyle = 'hsl(230 45% 18% / ' + (0.45 * night).toFixed(2) + ')'; c.fillRect(0, 0, W, gy);
        if (env.S > 0) {                                            // the sun on its arc
          const f = (hr - 6) / 12, sx = W * (0.08 + 0.84 * f), sy = gy - (gy - 22) * Math.sin(Math.PI * f);
          kit.dot(c, sx, sy, 13, 'hsl(45 95% 60%)');
        }
        c.fillStyle = 'hsl(35 45% 50% / .35)'; c.fillRect(0, gy, W, Hh - gy);
        const rx = W * 0.22, bx = W * 0.5, ux = W * 0.78;
        c.fillStyle = 'hsl(30 10% 55%)'; c.beginPath(); c.ellipse(rx, gy, 58, 26, 0, Math.PI, 0); c.fill();                    // rock
        c.fillStyle = 'hsl(120 35% 35%)'; for (const [dx, dy, r] of [[-26, -20, 20], [0, -34, 24], [26, -20, 20]]) { c.beginPath(); c.arc(bx + dx, gy + dy, r, 0, 6.283); c.fill(); }
        c.fillStyle = 'hsl(30 30% 20% / .75)'; c.beginPath(); c.ellipse(ux, gy + 16, 34, 16, 0, 0, 6.283); c.fill();            // burrow
        kit.label(c, 'rock', rx, gy + 14, { size: 11, color: C.muted }); kit.label(c, 'shade', bx, gy + 14, { size: 11, color: C.muted }); kit.label(c, 'burrow', ux, gy + 44, { size: 11, color: C.muted });
        const lp = loc === 'sun' ? [rx, gy - 30] : loc === 'shade' ? [bx - 10, gy - 6] : loc === 'burrow' ? [ux, gy + 16] : [W * 0.36, gy - 6];
        c.fillStyle = 'hsl(' + tempHue(TL).toFixed(0) + ' 75% 50%)';                                                           // lizard
        c.beginPath(); c.ellipse(lp[0], lp[1], 16, 5, 0, 0, 6.283); c.fill();
        c.beginPath(); c.moveTo(lp[0] - 14, lp[1]); c.lineTo(lp[0] - 36, lp[1] + 3); c.lineTo(lp[0] - 14, lp[1] + 3); c.fill();
        c.beginPath(); c.arc(lp[0] + 17, lp[1] - 1, 4, 0, 6.283); c.fill();
        kit.label(c, fmt(TL) + ' °C', lp[0], lp[1] - 16, { size: 11.5, color: C.text, bg: C.bg2 });
        const mx = bx + 38, my = gy - 9;                                                                                          // mammal
        c.fillStyle = 'hsl(' + tempHue(TM).toFixed(0) + ' 60% 55%)';
        c.beginPath(); c.ellipse(mx, my, 13, 9, 0, 0, 6.283); c.fill(); c.beginPath(); c.arc(mx + 11, my - 8, 4, 0, 6.283); c.fill();
        kit.label(c, fmt(TM) + ' °C' + (V.torpor && (hr >= 22 || hr < 6) ? ' zzz' : ''), mx + 8, my - 22, { size: 11.5, color: C.text, bg: C.bg2 });
        kit.label(c, String(Math.floor(hr)).padStart(2, '0') + ':' + String(Math.floor((hr % 1) * 60)).padStart(2, '0'), 12, 14, { size: 13, color: C.text, align: 'left', weight: 600 });
        kit.label(c, 'air ' + fmt(env.Ta) + ' °C', 12, 32, { size: 11.5, color: C.muted, align: 'left' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ani-allometry */
  const MIN_PER_YEAR = 525960;
  // approximate literature values for resting adults: mass (kg), resting metabolic rate (W), heart rate and breathing
  // rate (per minute), maximum recorded lifespan (years); null where no good measurement exists
  const MAMMALS = [
    ['Etruscan shrew', 0.0018, null, 835, null, 3],
    ['mouse', 0.025, 0.19, 600, 160, 4],
    ['rat', 0.3, 1.45, 350, 85, 4],
    ['rabbit', 2.5, 7, 200, 45, 12],
    ['cat', 4, 10, 150, 25, 30],
    ['dog', 20, 35, 90, 20, 24],
    ['human', 70, 80, 70, 13, 122],
    ['horse', 500, 400, 36, 12, 57],
    ['elephant', 3700, 2000, 30, 6, 80],
    ['blue whale', 100000, null, 8, null, 110]
  ];
  const LONG_LIVED = [                                           // lifespan only: birds and bats outlive mammals of their size
    ['hummingbird', 0.004, 12, 'bird'], ['budgerigar', 0.035, 21, 'bird'], ['pigeon', 0.35, 35, 'bird'], ['herring gull', 1, 49, 'bird'], ['ostrich', 100, 50, 'bird'],
    ['Brandt\'s bat', 0.007, 41, 'bat'], ['little brown bat', 0.008, 34, 'bat']
  ];

  Hyper.sim('ani-allometry', {
    title: 'From mouse to whale: scaling on log–log axes',
    blurb: `Ten mammals from a 2 g shrew to a 100-tonne whale, plotted on logarithmic axes, with the allometric law for each quantity drawn as a straight line: resting metabolic rate (Kleiber's law, $3.4\\,M^{0.75}$ W), metabolic rate per kilogram, heart rate ($241\\,M^{-0.25}$ per minute), breathing rate, maximum lifespan ($11.8\\,M^{0.2}$ years) and heartbeats in a lifetime. The animals above the graph pulse at their resting heart rates, slowed ten times. Values are approximate typical figures; species scatter around every line.

**Try this**
- Pick metabolic rate and slide the body mass from a mouse to an elephant: 160 000 times the mass, about 8000 times the energy. Switch to "per kilogram": the line now slopes down.
- Tick *Fit a line to the data*: the slope that best fits the points is close to 3/4. Tick *Surface law* to compare Rubner's 2/3: it fits worse at the large end.
- Choose heart rate and watch the pulsing row: the shrew's heart is a blur, the whale's barely moves.
- Choose heartbeats in a lifetime: the line is almost flat — about a billion beats for most mammals. Find the outliers (humans), and show the birds and bats on the lifespan graph.`,
    mount(box, kit, params) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 130 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const Q = {
        bmr: { label: 'resting metabolic rate (W)', law: 'B = 3.4 M^0.75 (Kleiber)', f: m => B.kleiber(m), b: 0.75, val: d => d[2], unit: 'W' },
        spec: { label: 'metabolic rate per kilogram (W/kg)', law: 'B/M = 3.4 M^−0.25', f: m => B.kleiber(m) / m, b: -0.25, val: d => (d[2] != null ? d[2] / d[1] : null), unit: 'W/kg' },
        heart: { label: 'resting heart rate (per minute)', law: 'f = 241 M^−0.25', f: m => 241 * Math.pow(m, -0.25), b: -0.25, val: d => d[3], unit: 'per minute' },
        breath: { label: 'breathing rate (per minute)', law: 'f = 53.5 M^−0.26', f: m => 53.5 * Math.pow(m, -0.26), b: -0.26, val: d => d[4], unit: 'per minute' },
        life: { label: 'maximum lifespan (years)', law: 'L = 11.8 M^0.20', f: m => 11.8 * Math.pow(m, 0.2), b: 0.2, val: d => d[5], unit: 'years' },
        beats: { label: 'heartbeats in a lifetime', law: 'N = f L ≈ 1.5×10⁹ M^−0.05', f: m => 241 * 11.8 * MIN_PER_YEAR * Math.pow(m, -0.05), b: -0.05, val: d => (d[3] && d[5] ? d[3] * d[5] * MIN_PER_YEAR : null), unit: '' }
      };
      const start = params && Q[params.show] ? params.show : 'bmr';
      const ctl = kit.controls(box.side, [
        { id: 'show', type: 'select', label: 'Quantity', options: [['Resting metabolic rate', 'bmr'], ['Metabolic rate per kilogram', 'spec'], ['Heart rate', 'heart'], ['Breathing rate', 'breath'], ['Maximum lifespan', 'life'], ['Heartbeats in a lifetime', 'beats']], value: start },
        { id: 'M', label: 'Body mass', min: 0.002, max: 150000, value: 1, log: true, unit: 'kg', sig: 2 },
        { id: 'fit', type: 'check', label: 'Fit a line to the data (least squares on logs)', value: false },
        { id: 'rub', type: 'check', label: 'Surface law: best line of slope 2/3 (metabolism)', value: false },
        { id: 'birds', type: 'check', label: 'Show birds and bats (lifespan)', value: false }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['law', 'Law'], ['pred', 'Predicted for this mass'], ['near', 'Nearest animal: measured / predicted'], ['fit', 'Fitted slope (mammals shown)'], ['all', 'This mass: metabolism · heart · life']]);
      const plot = kit.plot(gb, { x: { label: 'body mass (kg)', min: 0.001, max: 200000, log: true }, y: { label: '', log: true }, legend: true }, 230);
      const phases = MAMMALS.map(() => 0);
      let userPhase = 0;
      const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
      const fmtv = v => { if (!(v >= 1e5 || v < 0.01)) return kit.fmt(v, 3); const [m, e] = v.toExponential(2).split('e'); return m + ' × 10' + String(+e).split('').map(ch => SUP[ch] || ch).join(''); };
      // least squares on log10 values, optionally with a fixed slope
      function fitLog(pts, slope) {
        const xs = pts.map(p => Math.log10(p[0])), ys = pts.map(p => Math.log10(p[1])), n = xs.length;
        if (n < 2) return null;
        const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0, syy = 0;
        for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
        const b = slope != null ? slope : (sxx > 0 ? sxy / sxx : 0), a = my - b * mx;
        let ss = 0; for (let i = 0; i < n; i++) ss += (ys[i] - a - b * xs[i]) ** 2;
        return { b, a, r2: syy > 0 ? 1 - ss / syy : 1 };
      }
      const loop = kit.loop((dt) => {
        const q = Q[V.show] || Q.bmr, C = kit.colors();
        const pts = MAMMALS.filter(d => q.val(d) != null).map(d => [d[1], q.val(d)]);
        const line = [];
        for (let i = 0; i <= 60; i++) { const m = 0.001 * Math.pow(2e8, i / 60); line.push([m, q.f(m)]); }
        const series = [{ pts: line, label: q.law, color: C.accent }, { pts: pts, label: 'mammals', line: false, dots: 4.5, color: 'hsl(25 85% 55%)' }];
        let fitTxt = 'tick "Fit a line"';
        if (V.fit) {
          const f = fitLog(pts);
          if (f) { series.push({ pts: [[0.001, Math.pow(10, f.a + f.b * -3)], [200000, Math.pow(10, f.a + f.b * Math.log10(200000))]], label: 'best fit, slope ' + f.b.toFixed(2), dash: [6, 4], color: C.ok }); fitTxt = 'b = ' + f.b.toFixed(3) + ' (law ' + q.b + '), R² = ' + f.r2.toFixed(3); }
        }
        if (V.rub && (V.show === 'bmr' || V.show === 'spec')) {
          const f = fitLog(pts, V.show === 'bmr' ? 2 / 3 : -1 / 3);
          if (f) series.push({ pts: [[0.001, Math.pow(10, f.a + f.b * -3)], [200000, Math.pow(10, f.a + f.b * Math.log10(200000))]], label: 'surface law, slope ' + (V.show === 'bmr' ? '2/3' : '−1/3'), dash: [2, 3], color: C.warn });
        }
        if (V.birds && V.show === 'life') {
          series.push({ pts: LONG_LIVED.filter(d => d[3] === 'bird').map(d => [d[1], d[2]]), label: 'birds', line: false, dots: 4, color: 'hsl(200 70% 50%)' });
          series.push({ pts: LONG_LIVED.filter(d => d[3] === 'bat').map(d => [d[1], d[2]]), label: 'bats', line: false, dots: 4, color: 'hsl(280 55% 60%)' });
        }
        const yv = q.f(V.M);
        plot.set({ series, y: { label: q.label, log: true }, marks: [{ x: V.M, y: yv, label: fmtv(yv) }] });
        let near = MAMMALS[0], bd = Infinity;
        for (const d of MAMMALS) { const dd = Math.abs(Math.log(d[1] / V.M)); if (dd < bd) { bd = dd; near = d; } }
        const nv = q.val(near);
        ro.set('law', q.law + ', M in kg');
        ro.set('pred', (fmtv(yv) + ' ' + q.unit).trim());
        ro.set('near', near[0] + ' (' + kit.fmt(near[1], 2) + ' kg): ' + (nv != null ? fmtv(nv) : 'not measured') + ' / ' + fmtv(q.f(near[1])));
        ro.set('fit', fitTxt);
        ro.set('all', kit.fmt(B.kleiber(V.M), 3) + ' W · ' + (241 * Math.pow(V.M, -0.25)).toFixed(0) + ' per min · ' + (11.8 * Math.pow(V.M, 0.2)).toFixed(0) + ' yr');
        // the row of animals, each pulsing at its heart rate slowed ten times
        const c = st.begin(), W = st.W, Hh = st.H, n = MAMMALS.length, cy = Hh * 0.45;
        const beat = ph => Math.exp(-8 * (ph % 1));
        MAMMALS.forEach((d, i) => {
          phases[i] += dt * d[3] / 60 / 10;
          const x = W * (i + 0.5) / (n + 1), r = 4 + 2.2 * Math.log10(d[1] / 0.001), p = beat(phases[i]);
          c.fillStyle = 'hsl(350 70% ' + (38 + 22 * p).toFixed(0) + '% / ' + (0.45 + 0.55 * p).toFixed(2) + ')';
          c.beginPath(); c.arc(x, cy, r * (1 + 0.18 * p), 0, 6.283); c.fill();
          if (d === near) { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(x, cy, r * 1.25 + 4, 0, 6.283); c.stroke(); }
          kit.label(c, W < 700 ? d[0].split(' ').pop() : d[0], x, Hh - 12, { size: 10.5, color: d === near ? C.text : C.muted });
        });
        const hr = 241 * Math.pow(V.M, -0.25);
        userPhase += dt * hr / 60 / 10;
        const ux = W * (n + 0.5) / (n + 1), ur = 4 + 2.2 * Math.log10(V.M / 0.001), up = beat(userPhase);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.setLineDash([4, 3]);
        c.beginPath(); c.arc(ux, cy, ur * (1 + 0.18 * up), 0, 6.283); c.stroke(); c.setLineDash([]);
        kit.label(c, kit.fmt(V.M, 2) + ' kg', ux, Hh - 12, { size: 10.5, color: C.accent });
        kit.label(c, 'hearts beating at their resting rates, slowed ten times (sizes not to scale)', 10, 12, { size: 11, color: C.muted, align: 'left' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ani-nerve */
  Hyper.sim('ani-nerve', {
    title: 'The nerve race: myelinated against unmyelinated',
    blurb: `Both axons are stimulated at the left at the same moment. The bare (unmyelinated) axon conducts at about $1.1\\sqrt{d}$ m/s (d in µm) — the square-root rule, calibrated on the squid giant axon — and its impulse glides continuously. The myelinated fibre conducts at about $6d$ m/s (Hursh's rule) and its impulse jumps from node to node of Ranvier. Real time is slowed so that the slower impulse takes about six seconds; the clock shows the real milliseconds. The graph shows both speed rules on logarithmic axes.

**Try this**
- Squid giant axon (500 µm) against a 10 µm myelinated fibre: the thin fibre wins, though it is fifty times narrower.
- Pain against touch on a human arm: the dull C-fibre pain arrives about a second after the touch.
- Make the bare axon as fast as the myelinated one: read how wide it would have to be, and how many myelinated fibres would fit in its place.
- Try the blue whale: 20 m of nerve. With bare axons, a signal from the tail would take many seconds.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const PRE = {
        squid: { du: 500, dm: 10, L: 0.1 },
        pain: { du: 1, dm: 10, L: 1 },
        giraffe: { du: 1, dm: 15, L: 2.5 },
        whale: { du: 1, dm: 16, L: 20 }
      };
      let busy = false;
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Example', options: [['Squid giant axon against a myelinated fibre (10 cm)', 'squid'], ['Pain (C fibre) against touch, human arm (1 m)', 'pain'], ['Giraffe leg (2.5 m)', 'giraffe'], ['Blue whale, tail to brain (20 m)', 'whale'], ['Your own numbers', 'custom']], value: 'squid' },
        { id: 'du', label: 'Unmyelinated axon diameter', min: 0.2, max: 1000, value: 500, log: true, unit: 'µm', sig: 2 },
        { id: 'dm', label: 'Myelinated fibre diameter', min: 1, max: 20, step: 0.5, value: 10, unit: 'µm' },
        { id: 'L', label: 'Length of the nerve', min: 0.01, max: 30, value: 0.1, log: true, unit: 'm', sig: 2 },
        { type: 'buttons', items: [{ id: 'fire', label: 'Stimulate', primary: true }] }
      ], (id, v) => {
        if (busy) return;
        busy = true;
        if (id === 'pre' && PRE[v]) { ctl.set('du', PRE[v].du); ctl.set('dm', PRE[v].dm); ctl.set('L', PRE[v].L); }
        else if (id === 'du' || id === 'dm' || id === 'L') ctl.set('pre', 'custom');
        busy = false;
        t = 0;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['clock', 'Real time since the stimulus'], ['v', 'Speeds: unmyelinated / myelinated'], ['arr', 'Arrival: unmyelinated / myelinated'], ['match', 'Bare axon needed to match the myelinated one'], ['nodes', 'Internodes (about 100 × diameter apart)']]);
      const plot = kit.plot(gb, { x: { label: 'diameter (µm)', min: 0.1, max: 1000, log: true }, y: { label: 'conduction speed (m/s)', min: 0.3, max: 200, log: true }, legend: true }, 170);
      let t = 0;                                                   // screen seconds since the stimulus
      const vu = () => 1.12 * Math.sqrt(V.du), vm = () => 6 * V.dm;
      const loop = kit.loop((dt) => {
        const su = vu(), sm = vm(), L = V.L, slow = Math.min(su, sm), tEnd = L / slow, k = tEnd / 6;   // real seconds per screen second
        t += dt;
        if (t > 8.5) t = 0;                                       // repeat after a pause
        const tr = t * k, xu = Math.min(L, su * tr), xmTrue = Math.min(L, sm * tr);
        const Lint = V.dm * 1e-4, nInt = L / Lint, nd = Math.max(1, Math.min(40, Math.round(nInt))), seg = L / nd;
        const xm = xmTrue >= L ? L : Math.floor(xmTrue / seg) * seg;
        const dMatch = V.du * Math.pow(sm / su, 2);
        ro.set('clock', kit.fmt(tr * 1000, 3) + ' ms (' + (k < 1 ? 'slowed ' + kit.fmt(1 / k, 2) : 'speeded up ' + kit.fmt(k, 2)) + ' times)');
        ro.set('v', kit.fmt(su, 3) + ' m/s / ' + kit.fmt(sm, 3) + ' m/s');
        ro.set('arr', kit.fmt(L / su * 1000, 3) + ' ms / ' + kit.fmt(L / sm * 1000, 3) + ' ms (' + (su < sm ? 'myelinated ' + kit.fmt(sm / su, 2) + '× sooner' : 'unmyelinated ' + kit.fmt(su / sm, 2) + '× sooner') + ')');
        ro.set('match', dMatch >= 1000 ? kit.fmt(dMatch / 1000, 3) + ' mm across — room for about ' + kit.fmt(Math.pow(dMatch / V.dm, 2), 2) + ' myelinated fibres' : kit.fmt(dMatch, 3) + ' µm across');
        ro.set('nodes', kit.fmt(Lint * 1000, 2) + ' mm apart, ' + kit.fmt(nInt, 3) + ' along the nerve' + (nInt > 40 ? ' (drawn as 40 segments)' : ''));
        const dl = [], ml = [];
        for (let i = 0; i <= 40; i++) { const d = 0.1 * Math.pow(1e4, i / 40); dl.push([d, 1.12 * Math.sqrt(d)]); }
        for (let i = 0; i <= 20; i++) { const d = 0.5 + i * 1.25; ml.push([d, 6 * d]); }
        plot.set({ series: [{ pts: dl, label: 'unmyelinated: 1.1 √d', color: 'hsl(200 70% 50%)' }, { pts: ml, label: 'myelinated: 6 d', color: 'hsl(25 85% 55%)' }],
          marks: [{ x: V.du, y: su, label: 'bare ' + kit.fmt(su, 2) + ' m/s', color: 'hsl(200 70% 50%)' }, { x: V.dm, y: sm, label: 'myelinated ' + kit.fmt(sm, 2) + ' m/s', color: 'hsl(25 85% 55%)' }] });
        // drawing: two tracks
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, x0 = 60, x1 = W - 40, span = x1 - x0;
        const yu = Hh * 0.32, ym = Hh * 0.72, wu = clamp(1.5 + 2.2 * Math.log10(V.du / 0.1), 1.5, 12);
        c.strokeStyle = 'hsl(200 50% 55%)'; c.lineWidth = wu; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x0, yu); c.lineTo(x1, yu); c.stroke(); c.lineCap = 'butt';
        const sw = span / nd;
        c.strokeStyle = 'hsl(25 80% 55%)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, ym); c.lineTo(x1, ym); c.stroke();
        c.fillStyle = 'hsl(45 30% 80% / .9)'; c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let i = 0; i < nd; i++) { const a = x0 + i * sw + Math.min(2, sw * 0.15), w = sw - 2 * Math.min(2, sw * 0.15); c.fillRect(a, ym - 7, w, 14); c.strokeRect(a, ym - 7, w, 14); }
        // the impulses: the active region is about 1 ms of travel long
        const glow = (x, y, len, col) => { const px = x0 + span * x / L, w = Math.max(6, span * len / L); c.fillStyle = col; c.fillRect(Math.max(x0, px - w), y - 11, Math.min(w, px - x0 + 1), 22); kit.dot(c, px, y, 6, 'hsl(45 95% 55%)'); };
        if (t > 0) { glow(xu, yu, su * 1e-3, 'hsl(45 95% 55% / .35)'); glow(xm, ym, sm * 1e-3, 'hsl(45 95% 55% / .35)'); }
        if (xmTrue < L && t > 0) { const node = x0 + span * xm / L; c.strokeStyle = 'hsl(45 95% 55%)'; c.lineWidth = 2; c.beginPath(); c.arc(node, ym, 10, 0, 6.283); c.stroke(); }
        kit.label(c, 'unmyelinated axon, ' + kit.fmt(V.du, 3) + ' µm', x0, yu - 20, { size: 11.5, color: C.text, align: 'left' });
        kit.label(c, 'myelinated fibre, ' + kit.fmt(V.dm, 3) + ' µm — the impulse jumps from node to node', x0, ym - 22, { size: 11.5, color: C.text, align: 'left' });
        kit.label(c, 'stimulus', x0 - 30, (yu + ym) / 2, { size: 11, color: C.muted });
        kit.label(c, kit.fmt(L, 3) + ' m', x1, (yu + ym) / 2, { size: 11, color: C.muted, align: 'right' });
        if (xu >= L) kit.label(c, 'arrived ' + kit.fmt(L / su * 1000, 3) + ' ms', x1, yu + 18, { size: 11, color: C.ok, align: 'right' });
        if (xmTrue >= L) kit.label(c, 'arrived ' + kit.fmt(L / sm * 1000, 3) + ' ms', x1, ym + 22, { size: 11, color: C.ok, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ani-loop */
  Hyper.sim('ani-loop', {
    title: 'The loop of Henle: a countercurrent multiplier',
    blurb: `The classic step-by-step model of the loop of Henle. Each level of the medulla has a box of descending limb, interstitium and ascending limb. In every cycle (1) the ascending limb pumps salt into the interstitium until the two differ by the **single effect** (about 200 mOsm/kg), while the descending limb loses water until it matches the interstitium; then (2) fluid flows one step: fresh 300 mOsm/kg fluid enters the descending limb at the top, the fluid at the bend turns up into the ascending limb, and dilute fluid leaves at the top. The top level is the cortex, held at 300 by its rich blood flow. With the hormone ADH, urine in the collecting duct (right) equilibrates with the interstitium on its way down and leaves as concentrated as the tip of the loop.

**Try this**
- Watch a short loop (the beaver) settle in a few cycles, then choose the kangaroo rat and press *Run to steady state*: the same small single effect, multiplied along a long loop, reaches over 5000 mOsm/kg.
- Double the single effect: every level's step doubles. In this idealised model the tip reaches 300 plus the single effect for every level of the loop.
- Turn up the medullary blood flow: it washes the salt away, and the longest loops lose the most — one reason the vasa recta are themselves countercurrent loops with slow flow.
- Switch ADH off: the loop still builds its gradient, but the collecting duct no longer lets water out, and the urine stays dilute.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 460 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const PRE = { beaver: 1, human: 5, dog: 10, krat: 26, notomys: 46 };
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Animal (loop length)', options: [['Beaver: short loops', 'beaver'], ['Human', 'human'], ['Dog', 'dog'], ['Kangaroo rat', 'krat'], ['Australian hopping mouse', 'notomys'], ['Your own loop', 'custom']], value: 'human' },
        { id: 'N', label: 'Loop length (levels in the medulla)', min: 1, max: 50, step: 1, value: 5 },
        { id: 'delta', label: 'Single effect of the pumps', min: 50, max: 300, step: 10, value: 200, unit: 'mOsm/kg' },
        { id: 'wash', label: 'Medullary blood flow (washout per cycle)', min: 0, max: 0.05, step: 0.001, value: 0 },
        { id: 'adh', type: 'check', label: 'ADH present (collecting duct lets water out)', value: true },
        { id: 'speed', label: 'Cycles per second', min: 0.5, max: 40, value: 2, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'ff', label: 'Run to steady state', primary: true }, { id: 'reset', label: 'Start from 300' }] }
      ], (id, v) => {
        if (id === 'pre' && PRE[v]) { ctl.set('N', PRE[v]); reset(); }
        else if (id === 'N') { ctl.set('pre', 'custom'); reset(); }
        else if (id === 'reset') reset();
        else if (id === 'ff') runToSteady();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cyc', 'Cycles'], ['tip', 'Interstitium at the tip'], ['out', 'Fluid leaving the loop'], ['urine', 'Urine'], ['up', 'Urine ÷ plasma'], ['th', 'Ideal steady tip, 300 + levels × single effect']]);
      const plot = kit.plot(gb, { x: { label: 'depth: level in the medulla (0 = cortex)', min: 0 }, y: { label: 'osmolality (mOsm/kg)', min: 0 }, legend: true }, 170);
      let L, D, A, I, cycles, phase, acc, out;
      function reset() {
        L = Math.round(V.N) + 1;
        D = new Float64Array(L).fill(300); A = new Float64Array(L).fill(300); I = new Float64Array(L).fill(300);
        cycles = 0; phase = 0; acc = 0; out = 300;
      }
      reset();
      function pump() {
        for (let i = 1; i < L; i++) {
          const S = A[i] + D[i] + I[i];
          let X = (S + V.delta) / 3, Y = X - V.delta;
          if (Y < 0) { Y = 0; X = S / 2; }
          X += V.wash * (300 - X);                                // blood carries some salt away
          A[i] = Y; D[i] = X; I[i] = X;
        }
        I[0] = 300; D[0] = 300; A[0] = Math.min(A[0], Math.max(0, 300 - V.delta));
      }
      function flow() {
        out = A[0];
        for (let i = 0; i < L - 1; i++) A[i] = A[i + 1];
        A[L - 1] = D[L - 1];
        for (let i = L - 1; i > 0; i--) D[i] = D[i - 1];
        D[0] = 300;
        cycles++;
      }
      function runToSteady() {
        let prev = I[L - 1];
        for (let k = 0; k < 60000; k++) {
          pump(); flow();
          if (k % 200 === 199) { if (Math.abs(I[L - 1] - prev) < 0.05) break; prev = I[L - 1]; }
        }
        pump(); phase = 1;
      }
      const urine = () => (V.adh ? I[L - 1] : Math.max(50, out - 50));
      const colOf = c => { const f = clamp(Math.log(Math.max(c, 30) / 50) / Math.log(200), 0, 1); return { bg: 'hsl(' + (205 - 180 * f).toFixed(0) + ' 70% ' + (84 - 44 * f).toFixed(0) + '%)', fg: f < 0.55 ? '#1a1a1a' : '#ffffff' }; };
      const loop = kit.loop((dt) => {
        if (L !== Math.round(V.N) + 1) reset();
        acc += dt * V.speed * 2;                                  // two phases per cycle
        let n = 0;
        while (acc >= 1 && n < 400) { if (phase === 0) { pump(); phase = 1; } else { flow(); phase = 0; } acc -= 1; n++; }
        if (acc > 1) acc = 0;
        const tip = I[L - 1], u = urine();
        ro.set('cyc', String(cycles) + (V.speed <= 3 ? (phase === 1 ? ' — salt pumped, water left the descending limb' : ' — fluid moved one step') : ''));
        ro.set('tip', tip.toFixed(0) + ' mOsm/kg');
        ro.set('out', out.toFixed(0) + ' mOsm/kg (dilute)');
        ro.set('urine', u.toFixed(0) + ' mOsm/kg' + (V.adh ? '' : ' (no ADH: dilute urine)'));
        ro.set('up', (u / 300).toFixed(2));
        ro.set('th', (300 + (L - 1) * V.delta).toFixed(0) + ' mOsm/kg' + (V.wash > 0 ? ' (without washout)' : ''));
        plot.set({ series: [
          { pts: Array.from(I, (v, i) => [i, v]), label: 'interstitium (and descending limb)', color: 'hsl(25 85% 55%)', dots: L < 20 ? 3 : 0 },
          { pts: Array.from(A, (v, i) => [i, v]), label: 'ascending limb', color: 'hsl(200 70% 50%)' },
          { pts: Array.from(I, (v, i) => [i, V.adh ? (i === 0 ? 300 : v) : u]), label: 'collecting duct', dash: [5, 4], color: 'hsl(140 50% 45%)' }
        ], x: { label: 'depth: level in the medulla (0 = cortex)', min: 0, max: Math.max(1, L - 1) }, hlines: [{ y: 300, label: 'plasma 300' }] });
        // drawing: columns for descending limb, interstitium, ascending limb and collecting duct
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, top = 34, bot = 26, bh = (Hh - top - bot) / L;
        const cx = [W * 0.12, W * 0.26, W * 0.5, W * 0.76], cw = [W * 0.1, W * 0.2, W * 0.1, W * 0.1];
        const cols = [D, I, A, null];
        const names = ['descending limb', 'interstitium', 'ascending limb', 'collecting duct'];
        for (let k = 0; k < 4; k++) {
          kit.label(c, names[k], cx[k] + cw[k] / 2, 14, { size: 11, color: C.muted });
          for (let i = 0; i < L; i++) {
            const v = k === 3 ? (V.adh ? (i === 0 ? 300 : I[i]) : u) : cols[k][i], col = colOf(v), y = top + i * bh;
            c.fillStyle = col.bg; c.fillRect(cx[k], y, cw[k], bh - (bh > 6 ? 1 : 0));
            if (bh >= 14) kit.label(c, v.toFixed(0), cx[k] + cw[k] / 2, y + bh / 2, { size: Math.min(12, bh * 0.7), color: col.fg });
          }
        }
        // the hairpin, flow arrows, and the cortex/medulla boundary
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx[0] + cw[0] / 2, Hh - bot); c.quadraticCurveTo((cx[0] + cx[2] + cw[2]) / 2, Hh - 2, cx[2] + cw[2] / 2, Hh - bot); c.stroke();
        kit.arrow(c, cx[0] - 10, top + 4, cx[0] - 10, top + 40, C.text, 1.6);
        kit.arrow(c, cx[2] + cw[2] + 10, top + 40, cx[2] + cw[2] + 10, top + 4, C.text, 1.6);
        kit.arrow(c, cx[3] + cw[3] + 10, top + 4, cx[3] + cw[3] + 10, top + 40, C.text, 1.6);
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx[0] - 20, top + bh); c.lineTo(cx[3] + cw[3] + 20, top + bh); c.stroke(); c.setLineDash([]);
        kit.label(c, 'cortex', cx[0] - 22, top + bh / 2, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'tip', cx[0] - 22, Hh - bot - bh / 2, { size: 10.5, color: C.muted, align: 'right' });
        if (V.speed <= 3) {
          const y = top + Math.min(L - 1, 1) * bh + bh / 2;
          if (phase === 1) { kit.arrow(c, cx[2] - 2, y, cx[1] + cw[1] - 6, y, C.warn, 2); kit.label(c, 'NaCl', (cx[1] + cw[1] + cx[2]) / 2, y - 10, { size: 10.5, color: C.warn }); kit.arrow(c, cx[0] + cw[0] + 2, y, cx[1] + 6, y, 'hsl(200 70% 50%)', 2); kit.label(c, 'H₂O', (cx[0] + cw[0] + cx[1]) / 2, y - 10, { size: 10.5, color: 'hsl(200 70% 50%)' }); }
        }
        kit.label(c, 'urine ' + u.toFixed(0), cx[3] + cw[3] / 2, Hh - 10, { size: 11.5, color: C.text, weight: 600 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ani-lever */
  Hyper.sim('ani-lever', {
    title: 'A limb as a lever: speed against force',
    blurb: `A muscle attached at a distance $L_{in}$ from the joint swings a limb of length $L_{out}$ carrying a load at its tip. The muscle follows Hill's force–velocity relation: its full force $F_0$ when it cannot move, less and less as it shortens faster, none at its top speed $V_{\\max}$. Press *Go* to lift the load through 90° (slowed five times). The graph shows force against speed at the tip for this lever, for an in-lever twice as long and for one half as long — or, if you choose, the time to lift this load for every attachment point.

**Try this**
- Compare the runner's and the digger's limb with the same muscle: the runner's tip moves faster with a light load, the digger's is far stronger.
- Keep the human forearm and raise the load step by step. Watch the time to lift it, and read which attachment point would lift it fastest — close attachments win for light loads, distant ones for heavy loads.
- Switch the graph to *time to lift*: the curve has a minimum, the best compromise between force and speed for that load.
- Double $F_0$ (a muscle with twice the cross-section): the whole force–speed curve doubles in height but not in width.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const PRE = { human: { Lin: 4, Lout: 35 }, runner: { Lin: 3, Lout: 50 }, digger: { Lin: 5, Lout: 12 } };
      let busy = false, dirty = true, sweep = [], best = null;
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Limb', options: [['Human forearm (biceps)', 'human'], ['Runner: long limb, close attachment', 'runner'], ['Digger: short limb, distant attachment', 'digger'], ['Your own lever', 'custom']], value: 'human' },
        { id: 'Lin', label: 'In-lever: joint to muscle attachment', min: 1, max: 15, step: 0.5, value: 4, unit: 'cm' },
        { id: 'Lout', label: 'Out-lever: joint to the load', min: 8, max: 60, step: 1, value: 35, unit: 'cm' },
        { id: 'm', label: 'Load at the tip', min: 0, max: 40, step: 0.5, value: 2, unit: 'kg' },
        { id: 'F0', label: 'Muscle force, isometric F₀', min: 200, max: 3000, step: 50, value: 1000, unit: 'N' },
        { id: 'Vmax', label: 'Muscle top speed V_max', min: 0.2, max: 3, step: 0.05, value: 1, unit: 'm/s' },
        { id: 'grav', type: 'check', label: 'Lift against gravity (otherwise swing sideways)', value: true },
        { id: 'graph', type: 'select', label: 'Graph', options: [['Force against speed at the tip', 'fv'], ['Time to lift this load, by attachment point', 'sweep']], value: 'fv' },
        { type: 'buttons', items: [{ id: 'go', label: 'Go', primary: true }] }
      ], (id, v) => {
        if (busy) return;
        busy = true;
        if (id === 'pre' && PRE[v]) { ctl.set('Lin', PRE[v].Lin); ctl.set('Lout', PRE[v].Lout); }
        else if (id === 'Lin' || id === 'Lout') ctl.set('pre', 'custom');
        busy = false;
        if (id !== 'graph') { dirty = true; start(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ma', 'Mechanical advantage L_in / L_out'], ['max', 'Heaviest load it can hold level'], ['vtop', 'Fastest tip speed (no load)'], ['run', 'This lift: time / final tip speed'], ['best', 'Fastest attachment for this load']]);
      const plot = kit.plot(gb, { x: { label: 'speed at the tip (m/s)', min: 0 }, y: { label: 'force at the tip (N)', min: 0 }, legend: true }, 180);
      const K = 0.25, g = 9.81;
      const hill = vr => (vr >= 0 ? Math.max(0, (1 - vr) / (1 + vr / K)) : 1.5 - 0.5 * Math.exp(vr / 0.05));
      function parts(Lin) {                                      // SI values of the lever
        const a = Lin / 100, b = V.Lout / 100, ml = 1.5 * b / 0.35;
        return { a, b, ml, I: V.m * b * b + ml * b * b / 3, gt: V.grav ? (V.m * b + ml * b / 2) * g : 0 };
      }
      // integrate the swing from 0 to 90°; returns the time taken (Infinity if the muscle cannot lift it)
      function simulate(Lin, h) {
        const p = parts(Lin);
        if (V.F0 * p.a <= p.gt * 1.0001) return { T: Infinity, v: 0, pk: 0 };
        let th = 0, w = 0, t = 0, pk = 0;
        while (th < Math.PI / 2 && t < 5) {
          const F = V.F0 * hill(w * p.a / V.Vmax), tq = F * p.a - p.gt * Math.cos(th);
          pk = Math.max(pk, F * w * p.a);
          w = Math.max(0, w + tq / p.I * h); th += w * h; t += h;
        }
        return { T: th >= Math.PI / 2 ? t : Infinity, v: w * p.b, pk };
      }
      let th = 0, w = 0, tr = 0, pk = 0, done = false, hold = 0, result = null, Fm = 0;
      const C0 = () => kit.colors().accent;
      function start() { th = 0; w = 0; tr = 0; pk = 0; done = false; hold = 0; }
      start();
      const loop = kit.loop((dt) => {
        const p = parts(V.Lin);
        if (dirty) {
          sweep = []; best = null;
          for (let Lin = 1; Lin <= 15.0001; Lin += 0.5) { const r = simulate(Lin, 5e-4); sweep.push([Lin, r.T]); if (Number.isFinite(r.T) && (!best || r.T < best[1])) best = [Lin, r.T]; }
          result = simulate(V.Lin, 2e-4);
          dirty = false;
        }
        // the animated lift, five times slower than life
        if (!done) {
          let left = dt / 5;
          while (left > 1e-9) {
            const h = Math.min(2e-4, left);
            Fm = V.F0 * hill(w * p.a / V.Vmax);
            const tq = Fm * p.a - p.gt * Math.cos(th);
            w = Math.max(0, w + tq / p.I * h); th += w * h; tr += h; left -= h;
            pk = Math.max(pk, Fm * w * p.a);
            if (th >= Math.PI / 2) { th = Math.PI / 2; done = true; break; }
            if (tr > 5) { done = true; break; }
          }
        } else { hold += dt; if (hold > 1.5) start(); }
        const maxLoad = Math.max(0, (V.F0 * p.a / (p.b * g) - p.ml / 2));
        ro.set('ma', (V.Lin / V.Lout).toFixed(3) + ' (the muscle pulls ' + (V.Lout / V.Lin).toFixed(1) + '× the force at the tip)');
        ro.set('max', kit.fmt(V.F0 * p.a / p.b, 3) + ' N at the tip' + (V.grav ? ', a load of ' + kit.fmt(maxLoad, 3) + ' kg' : ''));
        ro.set('vtop', kit.fmt(V.Vmax * V.Lout / V.Lin, 3) + ' m/s');
        ro.set('run', result && Number.isFinite(result.T) ? (result.T * 1000).toFixed(0) + ' ms / ' + result.v.toFixed(2) + ' m/s (peak muscle power ' + kit.fmt(result.pk, 3) + ' W)' : 'too heavy — the muscle cannot lift it');
        ro.set('best', best ? best[0].toFixed(1) + ' cm from the joint (' + (best[1] * 1000).toFixed(0) + ' ms)' : 'none: too heavy for every attachment');
        if (V.graph === 'sweep') {
          plot.set({ series: [{ pts: sweep.filter(s => Number.isFinite(s[1])).map(s => [s[0], s[1] * 1000]), label: 'time to lift through 90°', dots: 3, color: C0() }],
            x: { label: 'in-lever: attachment distance from the joint (cm)', min: 1, max: 15 }, y: { label: 'time to lift (ms)', min: 0 },
            marks: result && Number.isFinite(result.T) ? [{ x: V.Lin, y: result.T * 1000, label: 'this limb' }] : [], hlines: [] });
        } else {
          const curve = (Lin, lab, dash, col) => { const a = Lin / 100, vt = V.Vmax * p.b / a, pts = []; for (let i = 0; i <= 40; i++) { const v = vt * i / 40; pts.push([v, V.F0 * a / p.b * hill(v * a / p.b / V.Vmax)]); } return { pts, label: lab, dash, color: col }; };
          plot.set({ series: [curve(V.Lin, 'this lever (' + V.Lin + ' cm)', null, C0()), curve(V.Lin * 2, 'in-lever × 2', [6, 4], 'hsl(140 50% 45%)'), curve(V.Lin / 2, 'in-lever ÷ 2', [2, 3], 'hsl(25 85% 55%)')],
            x: { label: 'speed at the tip (m/s)', min: 0 }, y: { label: 'force at the tip (N)', min: 0 },
            marks: [{ x: w * p.b, y: Fm * p.a / p.b, label: 'now' }], hlines: V.grav && V.m > 0 ? [{ y: (V.m + p.ml / 2) * g, label: 'weight of load and limb' }] : [] });
        }
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = Math.min(W * 0.62, Hh * 0.95) / 0.62;
        const jx = W * 0.2, jy = Hh * 0.72, ex = jx + Math.cos(th) * p.b * s, ey = jy - Math.sin(th) * p.b * s;
        const ix = jx + Math.cos(th) * p.a * s, iy = jy - Math.sin(th) * p.a * s, ox = jx - 0.02 * s, oy = jy - 0.28 * s;
        c.strokeStyle = C.muted; c.lineWidth = 9; c.lineCap = 'round';
        c.beginPath(); c.moveTo(jx, jy); c.lineTo(jx - 0.03 * s, jy - 0.3 * s); c.stroke();                                      // upper bone
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(jx, jy); c.lineTo(ex, ey); c.stroke(); c.lineCap = 'butt';             // lever
        const mw = 2 + 10 * clamp(Fm / 3000, 0, 1);
        c.strokeStyle = 'hsl(355 70% 50%)'; c.lineWidth = mw; c.beginPath(); c.moveTo(ox, oy); c.lineTo(ix, iy); c.stroke();  // muscle
        kit.dot(c, jx, jy, 7, C.bg2, C.text);
        const lr = 5 + 3 * Math.cbrt(V.m + 0.001);
        if (V.m > 0) kit.dot(c, ex, ey, lr, 'hsl(215 30% 55%)');
        if (V.grav) kit.arrow(c, ex, ey + lr, ex, ey + lr + 22, C.muted, 1.5);
        kit.label(c, 'muscle ' + kit.fmt(Fm, 3) + ' N', (ox + ix) / 2 + 12, (oy + iy) / 2, { size: 11.5, color: 'hsl(355 70% 50%)', align: 'left' });
        kit.label(c, 'L_in = ' + V.Lin + ' cm', jx + p.a * s / 2, jy + 16, { size: 11, color: C.muted });
        kit.label(c, 'L_out = ' + V.Lout + ' cm', jx + p.b * s / 2, jy + 32, { size: 11, color: C.muted });
        kit.label(c, (th * 180 / Math.PI).toFixed(0) + '°, ' + (tr * 1000).toFixed(0) + ' ms (slowed 5×)', 12, 14, { size: 12, color: C.text, align: 'left' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ani-feedback */
  Hyper.sim('ani-feedback', {
    title: 'A feedback loop with gain and delay',
    blurb: `A 100 g mammal holds its body at a set point of 37 °C. It loses heat to the air in proportion to the difference (a conductance of 0.06 W/K; heat capacity 350 J/K), and its control centre adds heat in proportion to the error it senses: extra heat = gain × conductance × (37 °C − the sensed temperature). The sensor and the response can be delayed. Change the air temperature and compare how far the body temperature moves with the prediction $E = D/(1 + G)$, where D is how far it would move with no regulation — then see what a slow loop, or a reversed sign, does.

**Try this**
- With a gain of 10, press *Cold snap*: the air falls by 20 °C but the body cools by only 20/11 ≈ 1.8 °C. Raise the gain to 40 and the error shrinks to about 0.5 °C.
- Now add a delay of 10 minutes and press *Back to 20 °C* or *Cold snap* again: the correction arrives late, overshoots, and the temperature oscillates — dying away with a gain of 10, swinging for ever with a gain of 40.
- Set the feedback to *none*: the body slowly follows the air all the way (the gain is zero, so E = D).
- Set it to *positive*: a small error grows into a runaway until the heater is flat out or switched off — which is why positive feedback is used only to finish processes quickly.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'G', label: 'Loop gain G', min: 0, max: 60, step: 1, value: 10 },
        { id: 'delay', label: 'Delay in the loop', min: 0, max: 20, step: 0.5, value: 0, unit: 'min' },
        { id: 'sign', type: 'select', label: 'Feedback', options: [['Negative (opposes the error)', 1], ['None', 0], ['Positive (amplifies the error)', -1]], value: 1 },
        { id: 'Ta', label: 'Air temperature', min: -10, max: 40, step: 1, value: 20, unit: '°C' },
        { id: 'speed', label: 'Speed (minutes per second)', min: 1, max: 60, value: 10, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'cold', label: 'Cold snap (0 °C)', primary: true }, { id: 'warm', label: 'Back to 20 °C' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'cold') ctl.set('Ta', 0);
        if (id === 'warm') ctl.set('Ta', 20);
        if (id === 'reset') reset();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['time', 'Time'], ['T', 'Body temperature'], ['err', 'Error (body − set point)'], ['pred', 'Steady error predicted, D/(1 + G)'], ['P', 'Heat production']]);
      const plot = kit.plot(gb, { x: { label: 'time (min)' }, y: { label: 'temperature (°C)' }, legend: true }, 170);
      const Cth = 350, Cc = 0.06, P0 = Cc * 17, Pmax = 6, SET = 37, H = 0.05;      // time step in minutes
      let t, T, hist, P, samples, next;
      function reset() { t = 0; T = 37; P = P0; hist = [[0, 37]]; samples = []; next = 0; }
      reset();
      function sensed() {                                          // the temperature the control centre sees: delayed
        const tt = t - V.delay;
        if (tt <= hist[0][0]) return hist[0][1];
        for (let i = hist.length - 1; i >= 0; i--) if (hist[i][0] <= tt) return hist[i][1];
        return hist[0][1];
      }
      const loop = kit.loop((dt) => {
        let left = dt * V.speed;
        while (left > 1e-9) {
          const h = Math.min(H, left);
          P = clamp(P0 + V.sign * V.G * Cc * (SET - sensed()), 0, Pmax);
          T += (P - Cc * (T - V.Ta)) * h * 60 / Cth;
          t += h; left -= h;
          hist.push([t, T]);
          if (hist.length > 1200) hist.splice(0, hist.length - 1200);
          if (t >= next) { samples.push([t, T, V.Ta]); next += 0.5; if (samples.length > 1200) samples.shift(); }
        }
        const D = V.Ta - 20, pred = V.sign === 1 ? D / (1 + V.G) : V.sign === 0 ? D : NaN;
        ro.set('time', t.toFixed(0) + ' min');
        ro.set('T', fmt(T, 2) + ' °C (air ' + V.Ta + ' °C)');
        ro.set('err', (T - SET >= 0 ? '+' : '') + fmt(T - SET, 2) + ' °C');
        ro.set('pred', Number.isFinite(pred) ? (pred >= 0 ? '+' : '') + fmt(pred, 2) + ' °C (D = ' + D + ' °C)' : 'no steady state: runaway');
        ro.set('P', fmt(P, 2) + ' W' + (P >= Pmax - 1e-9 ? ' — flat out' : P <= 1e-9 ? ' — switched off' : ''));
        const x0 = Math.max(0, t - 300);
        plot.set({ series: [{ pts: samples.filter(s => s[0] >= x0).map(s => [s[0], s[1]]), label: 'body', color: 'hsl(355 70% 52%)' }, { pts: samples.filter(s => s[0] >= x0).map(s => [s[0], s[2]]), label: 'air', dash: [5, 4], color: 'hsl(200 70% 50%)' }],
          x: { label: 'time (min)', min: x0, max: Math.max(x0 + 60, t) }, hlines: [{ y: SET, label: 'set point 37 °C' }] });
        // the loop as a diagram
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const bw = Math.min(150, W * 0.2), bh = 44, pos = [[W * 0.2, Hh * 0.25], [W * 0.8, Hh * 0.25], [W * 0.8, Hh * 0.72], [W * 0.2, Hh * 0.72]];
        const names = ['sensor', 'control centre', 'effector: heat', 'body'];
        const vals = [fmt(sensed(), 2) + ' °C' + (V.delay > 0 ? ' (' + V.delay + ' min old)' : ''), 'error ' + fmt(SET - sensed(), 2) + ' °C', fmt(P, 2) + ' W', fmt(T, 2) + ' °C'];
        for (let k = 0; k < 4; k++) {
          const [x, y] = pos[k];
          c.fillStyle = k === 3 ? 'hsl(' + tempHue(T).toFixed(0) + ' 65% 55% / .45)' : C.surface;
          c.strokeStyle = C.muted; c.lineWidth = 1.2;
          c.fillRect(x - bw / 2, y - bh / 2, bw, bh); c.strokeRect(x - bw / 2, y - bh / 2, bw, bh);
          kit.label(c, names[k], x, y - 9, { size: 11.5, color: C.muted });
          kit.label(c, vals[k], x, y + 9, { size: 12, color: C.text, weight: 600 });
        }
        const col = V.sign === 1 ? C.ok : V.sign === -1 ? C.bad : C.faint;
        kit.arrow(c, pos[0][0] + bw / 2 + 4, pos[0][1], pos[1][0] - bw / 2 - 4, pos[1][1], col, 2);
        kit.arrow(c, pos[1][0], pos[1][1] + bh / 2 + 3, pos[2][0], pos[2][1] - bh / 2 - 3, col, 2);
        kit.arrow(c, pos[2][0] - bw / 2 - 4, pos[2][1], pos[3][0] + bw / 2 + 4, pos[3][1], col, 2);
        kit.arrow(c, pos[3][0], pos[3][1] - bh / 2 - 3, pos[0][0], pos[0][1] + bh / 2 + 3, col, 2);
        kit.label(c, V.sign === 1 ? 'negative feedback: − (opposes the change)' : V.sign === -1 ? 'positive feedback: + (amplifies the change)' : 'loop open: no feedback', W / 2, Hh * 0.485, { size: 12, color: col, weight: 600 });
        kit.label(c, 'set point 37 °C', pos[1][0], pos[1][1] - bh / 2 - 10, { size: 11, color: C.muted });
        kit.label(c, 'air ' + V.Ta + ' °C → heat loss ' + fmt(Cc * (T - V.Ta), 2) + ' W', pos[3][0], pos[3][1] + bh / 2 + 12, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ani-morphogen */
  Hyper.sim('ani-morphogen', {
    title: 'A morphogen gradient and the French flag',
    blurb: `A signalling molecule is made at the front end of a 500 µm embryo (left), spreads by diffusion and is broken down everywhere at a steady rate. Its concentration settles into an exponential gradient whose length constant is $\\lambda = \\sqrt{D\\tau}$ (D, the diffusion coefficient; τ, the mean lifetime of a molecule). Every cell reads the local level: above the high threshold it turns blue, between the thresholds white, below the low threshold red — Wolpert's French flag. The numbers are in the range measured for Bicoid in the fruit-fly egg.

**Try this**
- Press *Start again* and watch the gradient build up over about an hour, the boundaries creeping backwards until they settle.
- Double the dose at the source: every boundary moves back by λ ln 2, about 70 µm — the shift seen in flies whose mothers carry extra copies of *bicoid*.
- Raise the lifetime or the diffusion coefficient: λ grows and the whole flag stretches.
- Move the thresholds together or apart to change the width of the white stripe.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'dose', label: 'Dose at the source (× normal)', min: 0.25, max: 4, value: 1, log: true, sig: 2 },
        { id: 'D', label: 'Diffusion coefficient', min: 0.5, max: 20, value: 3, log: true, unit: 'µm²/s', sig: 2 },
        { id: 'tau', label: 'Mean lifetime of a molecule', min: 5, max: 120, step: 1, value: 50, unit: 'min' },
        { id: 'hi', label: 'High threshold', min: 2, max: 45, step: 0.5, value: 20, unit: 'nM' },
        { id: 'lo', label: 'Low threshold', min: 0.5, max: 20, step: 0.5, value: 5, unit: 'nM' },
        { id: 'speed', label: 'Speed (minutes per second)', min: 1, max: 30, value: 8, log: true, sig: 2 },
        { id: 'log', type: 'check', label: 'Logarithmic concentration axis', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], (id) => { if (id === 'reset') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['time', 'Time since the source switched on'], ['lam', 'Length constant λ = √(Dτ)'], ['b1', 'Blue | white boundary: now / steady state'], ['b2', 'White | red boundary: now / steady state']]);
      const plot = kit.plot(gb, { x: { label: 'distance from the front of the embryo (µm)', min: 0, max: 500 }, y: { label: 'concentration (nM)', min: 0 }, legend: true }, 170);
      const N = 101, LEN = 500, dx = LEN / (N - 1), Cmol = new Float64Array(N);
      let t = 0;
      function reset() { Cmol.fill(0); t = 0; }
      reset();
      const C0 = () => 50 * V.dose;
      const boundary = thr => { for (let i = 0; i < N; i++) if (Cmol[i] < thr) return i * dx; return LEN; };
      const loop = kit.loop((dt) => {
        const D = V.D, k = 1 / (V.tau * 60), h = Math.min(2, 0.4 * dx * dx / D);
        let left = dt * V.speed * 60;
        const nxt = new Float64Array(N);
        while (left > 1e-9) {
          const s = Math.min(h, left);
          Cmol[0] = C0();
          for (let i = 1; i < N; i++) {
            const r = i < N - 1 ? Cmol[i + 1] : Cmol[i - 1];     // no flux out of the back end
            nxt[i] = Cmol[i] + s * (D * (Cmol[i - 1] - 2 * Cmol[i] + r) / (dx * dx) - k * Cmol[i]);
          }
          for (let i = 1; i < N; i++) Cmol[i] = Math.max(0, nxt[i]);
          t += s; left -= s;
        }
        Cmol[0] = C0();
        const lam = Math.sqrt(D * V.tau * 60), hi = Math.max(V.hi, V.lo), lo = Math.min(V.hi, V.lo);
        const steady = x => C0() * Math.cosh((LEN - x) / lam) / Math.cosh(LEN / lam);
        const pred = thr => (C0() > thr ? Math.min(LEN, lam * Math.log(C0() / thr)) : 0);
        const b1 = boundary(hi), b2 = boundary(lo);
        ro.set('time', (t / 60).toFixed(0) + ' min');
        ro.set('lam', lam.toFixed(0) + ' µm (' + (100 * lam / LEN).toFixed(0) + ' % of the embryo)');
        ro.set('b1', b1.toFixed(0) + ' µm / ' + pred(hi).toFixed(0) + ' µm (λ ln(C₀/C_high))');
        ro.set('b2', b2.toFixed(0) + ' µm / ' + pred(lo).toFixed(0) + ' µm');
        const pts = Array.from(Cmol, (v, i) => [i * dx, V.log ? Math.max(v, 0.05) : v]);
        const sp = []; for (let i = 0; i <= 50; i++) { const x = i * 10; sp.push([x, V.log ? Math.max(steady(x), 0.05) : steady(x)]); }
        plot.set({ series: [{ pts, label: 'concentration now', color: kit.colors().accent }, { pts: sp, label: 'steady state', dash: [5, 4], color: kit.colors().muted }],
          y: V.log ? { label: 'concentration (nM)', log: true, min: 0.05, max: 250 } : { label: 'concentration (nM)', min: 0 },
          hlines: [{ y: hi, label: 'high threshold' }, { y: lo, label: 'low threshold' }], vlines: [{ x: b1 }, { x: b2 }] });
        // the embryo, its cells coloured by what they read
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, ex0 = 40, ex1 = W - 40, ecy = Hh * 0.56, ery = Hh * 0.3;
        const X = x => ex0 + (ex1 - ex0) * x / LEN;
        c.save(); c.beginPath(); c.ellipse((ex0 + ex1) / 2, ecy, (ex1 - ex0) / 2, ery, 0, 0, 6.283); c.clip();
        for (let i = 0; i < N - 1; i += 2) {
          const v = Cmol[i], col = v >= hi ? 'hsl(225 70% 45%)' : v >= lo ? 'hsl(0 0% 96%)' : 'hsl(355 75% 52%)';
          c.fillStyle = col; c.fillRect(X(i * dx), ecy - ery, X((i + 2) * dx) - X(i * dx) + 0.5, 2 * ery);
          c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 1; c.beginPath(); c.moveTo(X(i * dx), ecy - ery); c.lineTo(X(i * dx), ecy + ery); c.stroke();
        }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.ellipse((ex0 + ex1) / 2, ecy, (ex1 - ex0) / 2, ery, 0, 0, 6.283); c.stroke();
        for (let i = 0; i < N; i += 2) {                          // the gradient as a bar above the embryo
          const f = clamp(Cmol[i] / (50 * 4), 0, 1);
          c.fillStyle = 'hsl(45 90% ' + (92 - 50 * Math.sqrt(f)).toFixed(0) + '%)'; c.fillRect(X(i * dx), 12, X(2 * dx) - X(0) + 0.5, 12);
        }
        kit.label(c, 'source', ex0, ecy, { size: 11, color: C.text, align: 'right', bg: C.bg2 });
        kit.label(c, b1.toFixed(0) + ' µm', X(b1), ecy + ery + 12, { size: 11, color: C.text });
        kit.label(c, b2.toFixed(0) + ' µm', X(b2), ecy + ery + 12, { size: 11, color: C.text });
        kit.label(c, (t / 60).toFixed(0) + ' min', W - 12, 34, { size: 12, color: C.muted, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

})();
