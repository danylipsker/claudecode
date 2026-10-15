/* HYPER-WATER · sims/the-ocean-that-remembers-heat.js — the simulations of the topic "The ocean that remembers heat".
 *   heat-cp-curve        the heat capacity of water against temperature (−30 to 100 °C, ice and steam), beside other materials
 *                        per kilogram and per mole of atoms, with the Dulong–Petit value
 *   heat-column          the same heat put into a column of air and a column of sea; and the same warming turned into a rise in
 *                        sea level by thermal expansion (view = 'level')
 *   heat-surface-cycle   a surface of adjustable heat capacity under the daily or yearly sun: a one-box energy balance (schematic),
 *                        beside the open ocean, with approximate monthly means of London and Moscow
 *   heat-conduction-pot  a pot of water heated from below, with and without convection: the diffusion equation plus a
 *                        convective adjustment (schematic), and the conductivities of common materials
 *   heat-wet-bulb        sweating against temperature and humidity: the wet-bulb temperature and a skin heat balance (Lewis relation)
 *   heat-parcel          a parcel of tropical air rising: dry adiabat, condensation, moist adiabat, CAPE (schematic)
 *   heat-cooling-loop    Q = ṁ c ΔT: the flow of coolant a heat load needs, for water and for its rivals
 *   heat-body-37         a two-node model of the body's core temperature with sweating, shivering and blood-flow control (schematic)
 * The numbers come from kit.water (water.js), the drawing from kit.wsym (watersym.js). Where a model is written here it is said so
 * in the blurb and called schematic: it teaches the mechanism, it is not a forecast.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const YEAR = 3.15576e7;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* temperature colour: blue (cold) through violet to orange-red (hot), no green in between */
  const hot = t => {
    const u = clamp(t, 0, 1) * 2, a = u < 1 ? [40, 120, 230] : [140, 90, 200], b = u < 1 ? [140, 90, 200] : [236, 110, 50], f = u < 1 ? u : u - 1;
    return 'rgb(' + a.map((x, i) => Math.round(x + (b[i] - x) * f)).join(',') + ')';
  };
  const sci = (v, d) => {
    if (!isFinite(v)) return '—';
    if (v === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(v)));
    const m = v / Math.pow(10, e);
    return m.toFixed(d == null ? 1 : d) + ' × 10' + String(e).replace(/-/g, '⁻').replace(/\d/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]);
  };
  const si = (v, unit) => {
    if (!isFinite(v)) return '—';
    const a = Math.abs(v);
    if (a >= 1e9) return (v / 1e9).toPrecision(3) + ' G' + unit;
    if (a >= 1e6) return (v / 1e6).toPrecision(3) + ' M' + unit;
    if (a >= 1e3) return (v / 1e3).toPrecision(3) + ' k' + unit;
    if (a >= 1) return v.toPrecision(3) + ' ' + unit;
    return (v * 1e3).toPrecision(3) + ' m' + unit;
  };
  const kWfmt = v => (v >= 1e6 ? (v / 1e6).toPrecision(3) + ' GW' : v >= 1e3 ? (v / 1e3).toPrecision(3) + ' MW' : v >= 1 ? v.toPrecision(3) + ' kW' : (v * 1e3).toPrecision(3) + ' W');

  /* density of sea water at one atmosphere, kg/m³, salinity S in g/kg and T in °C: the UNESCO 1980 equation of state (EOS-80,
   * Millero and Poisson 1981). The engine's densityBrine is linear in salinity and is too crude for the expansion coefficient
   * of cold sea water, which is what the sea-level view needs. */
  function eos80(S, T) {
    const rw = 999.842594 + 6.793952e-2 * T - 9.095290e-3 * T * T + 1.001685e-4 * T * T * T - 1.120083e-6 * T * T * T * T + 6.536332e-9 * T * T * T * T * T;
    const A = 8.24493e-1 - 4.0899e-3 * T + 7.6438e-5 * T * T - 8.2467e-7 * T * T * T + 5.3875e-9 * T * T * T * T;
    const B = -5.72466e-3 + 1.0227e-4 * T - 1.6546e-6 * T * T;
    return rw + A * S + B * Math.pow(S, 1.5) + 4.8314e-4 * S * S;
  }

  /* horizontal bar chart on a canvas: items [{ label, v, col, bold }] */
  function bars(c, kit, C, x, y, w, h, items, o) {
    o = o || {};
    const lw = o.labelW || 150, n = items.length, row = h / n;
    const max = o.max || Math.max.apply(null, items.map(i => i.v)) * 1.08;
    const lo = o.log ? o.min : 0;
    const pos = v => o.log ? (Math.log(Math.max(v, lo)) - Math.log(lo)) / (Math.log(max) - Math.log(lo)) : v / max;
    items.forEach((it, i) => {
      const yy = y + i * row;
      kit.label(c, it.label, x + lw - 8, yy + row / 2, { size: 11.5, color: it.bold ? C.text : C.muted, align: 'right', baseline: 'middle', weight: it.bold ? 700 : 400 });
      const bw = Math.max(1, pos(it.v) * (w - lw - 70));
      c.fillStyle = it.col || (it.bold ? C.accent : C.faint);
      c.globalAlpha = it.bold ? 1 : 0.75;
      c.fillRect(x + lw, yy + row * 0.18, bw, row * 0.64);
      c.globalAlpha = 1;
      kit.label(c, (o.fmt ? o.fmt(it.v) : it.v.toFixed(0)), x + lw + bw + 5, yy + row / 2, { size: 11.5, color: C.text, baseline: 'middle' });
    });
    if (o.line != null) {
      const lx = x + lw + pos(o.line) * (w - lw - 70);
      c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([5, 4]);
      c.beginPath(); c.moveTo(lx, y - 4); c.lineTo(lx, y + h); c.stroke(); c.restore();
      kit.label(c, o.lineLabel || '', lx + 4, y - 8, { size: 11, color: C.warn, weight: 600 });
    }
  }

  /* ================================================================ 1. the heat-capacity curve */
  Hyper.sim('heat-cp-curve', {
    title: 'Where the heat goes: the heat capacity of water',
    blurb: `Above: the heat capacity of a handful of materials, first per kilogram and then per mole of atoms. Below: the heat capacity of water against temperature, from supercooled liquid at −30 °C to the boiling point, with ice and steam for comparison. Drag the temperature to read the value.

**Try this**
- *Per kilogram*, water is far ahead of everything: nine times iron, thirty times lead. Now switch to *per mole of atoms*. The metals line up at about 25 J/(mol·K), the Dulong–Petit value $3R$; water joins them. The kilogram of iron is simply ten times fewer atoms than the kilogram of water.
- But look at ethanol, ice and steam in the same view: molecular substances normally sit at *half* of $3R$ per atom, because the stiff O–H and C–H vibrations are frozen at room temperature. Liquid water is the exception: it has an extra store of energy in its hydrogen bonds.
- On the curve, find the shallow minimum near 35 °C, and follow the liquid below 0 °C: the supercooled heat capacity climbs steeply (values at −30 °C are approximate).`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 380 });
      box.stage.appendChild(graph);
      const R = W.R;
      const MAT = [   // [name, cp J/(kg·K), mean mass per atom g/mol]
        ['Lead', 129, 207.2], ['Mercury (liquid)', 140, 200.59], ['Iron', 449, 55.845], ['Copper', 385, 63.546], ['Aluminium', 897, 26.982],
        ['Diamond', 509, 12.011], ['Ice, 0 °C', 2050, 18.015 / 3], ['Water vapour (ideal gas)', 33.6 / 0.018015, 18.015 / 3],
        ['Ethanol (liquid)', 2440, 46.069 / 9], ['Liquid water, 25 °C', 4182, 18.015 / 3]
      ];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Compare', options: [['Per kilogram', 'kg'], ['Per mole of atoms', 'atom']], value: params.view || 'kg' },
        { id: 'T', label: 'Temperature of the water', min: -30, max: 100, step: 1, value: params.T != null ? params.T : 25, unit: '°C' },
        { id: 'ice', type: 'check', label: 'Show ice and steam on the curve', value: true }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cp', 'Heat capacity now'], ['mol', 'Per mole of molecules'], ['dp', 'Dulong–Petit, 3 atoms × 3R'], ['gas', 'Water as a gas (per mole)'], ['ex', 'Liquid minus gas: the bonds'], ['min', 'Minimum of the liquid curve']]);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)', min: -30, max: 100 }, y: { label: 'heat capacity (J/(kg·K))', min: 1500, max: 5400 }, legend: true }, 210);
      let liq = [], iceS = [];
      for (let t = -30; t <= 100; t += 1) liq.push([t, W.heatCapacity(t)]);
      for (let t = -30; t <= 0; t += 1) iceS.push([t, W.heatCapacityIce(t)]);
      let tmin = 0, cmin = 1e9;
      for (let t = 0; t <= 100; t += 0.5) { const v = W.heatCapacity(t); if (v < cmin) { cmin = v; tmin = t; } }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const atom = V.view === 'atom';
        const items = MAT.map(m => ({ label: m[0], v: atom ? m[1] * m[2] / 1000 : m[1], bold: m[0].indexOf('water') >= 0 && m[0].indexOf('vapour') < 0 }));
        // the liquid-water bar follows the temperature slider
        items[items.length - 1].v = (atom ? W.heatCapacity(V.T) * 18.015 / 3 / 1000 : W.heatCapacity(V.T));
        items[items.length - 1].label = 'Liquid water, ' + Math.round(V.T) + ' °C';
        kit.label(c, atom ? 'Heat capacity per mole of atoms, J/(mol·K)' : 'Specific heat capacity, J/(kg·K)', 12, 16, { size: 12.5, color: C.text, weight: 650 });
        bars(c, kit, C, 8, 34, Wd - 16, Hh - 44, items, {
          labelW: 160, max: atom ? 32 : 4800, fmt: v => atom ? v.toFixed(1) : Math.round(v).toLocaleString('en-GB'),
          line: atom ? 3 * R : null, lineLabel: atom ? '3R = 24.9' : ''
        });
        const cp = W.heatCapacity(V.T);
        plot.set({
          series: [
            { pts: liq, label: 'liquid water', color: C.accent, width: 2.5 },
            ...(V.ice ? [{ pts: iceS, label: 'ice', color: C.series[1], dash: [5, 4] }] : [])
          ],
          marks: [{ x: V.T, y: cp, label: Math.round(cp).toLocaleString('en-GB') + ' J/(kg·K)' }].concat(V.ice ? [{ x: 100, y: W.heatCapacitySteam, label: 'steam 2,010', color: C.muted }] : []),
          x: { label: 'temperature (°C)', min: -30, max: 100 }, y: { label: 'heat capacity (J/(kg·K))', min: 1500, max: 5400 },
          hlines: [{ y: 4182, label: '4,182' }]
        });
        ro.set('cp', Math.round(cp).toLocaleString('en-GB') + ' J/(kg·K)');
        ro.set('mol', (cp * W.M / 1000).toFixed(1) + ' J/(mol·K)');
        ro.set('dp', (9 * R).toFixed(1) + ' J/(mol·K)');
        ro.set('gas', '33.6 J/(mol·K)');
        ro.set('ex', (cp * W.M / 1000 - 33.6).toFixed(1) + ' J/(mol·K)');
        ro.set('min', Math.round(cmin) + ' J/(kg·K) at ' + tmin.toFixed(0) + ' °C');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 2. a column of air and a column of sea */
  Hyper.sim('heat-column', {
    title: 'The same heat into air and into sea',
    blurb: `The same heat is poured, per square metre, into the whole column of the atmosphere (about 10 tonnes of air above each square metre) and into a layer of sea of the depth you choose. Colour shows the warming. Treat it as an accounting device: in reality the heat is shared and the air is warmed by the sea, not isolated from it.

**Try this**
- Leave the heat input at 1 W/m² (about what the oceans took up on average in recent decades) and run it for 20 years: the air column would warm by tens of kelvin, the top 100 m of sea by a few tenths. The ratio never depends on the time or the power, only on the heat capacities.
- Make the sea layer 3.5 m deep: the two columns warm together. That is the depth of sea whose heat capacity equals the whole atmosphere's.
- Switch the view to *sea level*: the warmed layer expands. Start at 28 °C and compare with the blue line, which starts at 2 °C: the same heat lifts the warm sea about four times as far, because water expands more the warmer it is. The dashed line is the linear estimate α·ΔT·D, which the real curve follows closely for small warming.
- The stacked bar on the right is where the extra heat of 1971–2018 actually went (IPCC AR6): nine-tenths into the oceans.`,
    mount(box, kit, params) {
      const W = kit.water, E = W.EARTH;
      const AIRM = E.atmosphereMass / (4 * Math.PI * Math.pow(6.371e6, 2));     // kg per m² of the Earth
      const CAIR = AIRM * E.cpAir;                                              // J/(m²·K)
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 330 });
      box.stage.appendChild(graph);
      let t = 0, wait = 0;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Warming of the two columns', 'warming'], ['Sea level from expansion', 'level']], value: params.view || 'warming' },
        { id: 'F', label: 'Heat input', min: 0.1, max: 10, log: true, value: 1, unit: 'W/m²', sig: 2 },
        { id: 'D', label: 'Depth of the sea layer', min: 3, max: 2000, log: true, value: params.D || 100, unit: 'm', sig: 3 },
        { id: 'T0', label: 'Sea temperature at the start', min: 0, max: 30, step: 1, value: params.T0 != null ? params.T0 : 15, unit: '°C' },
        { id: 'yrs', label: 'Years to run', min: 1, max: 100, step: 1, value: 20, unit: 'yr' },
        { type: 'buttons', items: [{ id: 'go', label: 'Restart', primary: true }] }
      ], (id) => { if (id === 'go' || id === 'yrs' || id === 'D' || id === 'F' || id === 'T0' || id === 'view') { t = 0; wait = 0; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Q', 'Heat added per m²'], ['air', 'Warming of the air column'], ['sea', 'Warming of the sea layer'], ['ratio', 'Air warms … times more'], ['eq', 'Sea as deep as all the air'], ['lvl', 'Rise of the sea layer'], ['alpha', 'Expansion coefficient (sea, 35 g/kg)']]);
      const plot = kit.plot(graph, { x: { label: 'time (years)', min: 0 }, y: { label: 'warming (K)', min: 0 }, legend: true }, 200);
      const rhoS = T => eos80(35, T);
      const alphaS = T => -(rhoS(T + 0.05) - rhoS(T - 0.05)) / 0.1 / rhoS(T);
      const dTsea = (tt) => V.F * tt * YEAR / (E.rhoSeawater * E.cpSeawater * V.D);
      const rise = (T0, dT) => V.D * (rhoS(T0) / rhoS(T0 + dT) - 1) * 1000;    // mm, fixed mass of sea
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const yrs = V.yrs;
        if (t < yrs) t = Math.min(yrs, t + dt * yrs / 6); else { wait += dt; if (wait > 4) { t = 0; wait = 0; } }
        const Q = V.F * t * YEAR;
        const dA = Q / CAIR, dS = Q / (E.rhoSeawater * E.cpSeawater * V.D);
        /* ---- the two columns */
        const top = 44, bot = Hh - 54, colW = Math.min(76, Wd * 0.14), x1 = Wd * 0.16, x2 = Wd * 0.46;
        const tint = d => hot(d / 12);
        c.fillStyle = tint(dA); c.fillRect(x1, top, colW, bot - top);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x1, top, colW, bot - top);
        c.fillStyle = tint(dS); c.fillRect(x2, top, colW, bot - top);
        c.strokeRect(x2, top, colW, bot - top);
        kit.label(c, 'all the air', x1 + colW / 2, top - 22, { align: 'center', size: 12.5, weight: 650 });
        kit.label(c, 'above 1 m²: ' + Math.round(AIRM).toLocaleString('en-GB') + ' kg', x1 + colW / 2, top - 8, { align: 'center', size: 11, color: C.muted });
        kit.label(c, V.D < 10 ? V.D.toFixed(1) + ' m of sea' : Math.round(V.D) + ' m of sea', x2 + colW / 2, top - 22, { align: 'center', size: 12.5, weight: 650 });
        kit.label(c, Math.round(V.D * E.rhoSeawater).toLocaleString('en-GB') + ' kg', x2 + colW / 2, top - 8, { align: 'center', size: 11, color: C.muted });
        kit.label(c, '+' + dA.toFixed(dA < 10 ? 2 : 1) + ' K', x1 + colW / 2, (top + bot) / 2, { align: 'center', size: 16, weight: 700, color: dA > 5 ? '#fff' : C.text });
        kit.label(c, '+' + dS.toFixed(dS < 1 ? 3 : 2) + ' K', x2 + colW / 2, (top + bot) / 2, { align: 'center', size: 16, weight: 700, color: dS > 5 ? '#fff' : C.text });
        kit.label(c, 'heat capacity ' + sci(CAIR, 1) + ' J/(m²·K)', x1 + colW / 2, bot + 18, { align: 'center', size: 11, color: C.muted });
        kit.label(c, sci(E.rhoSeawater * E.cpSeawater * V.D, 1) + ' J/(m²·K)', x2 + colW / 2, bot + 18, { align: 'center', size: 11, color: C.muted });
        // the 3.5 m marker in the sea column
        const eq = W.oceanLayerEqualToAtmosphere();
        if (V.D > eq) {
          const my = top + (bot - top) * eq / V.D;
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x2 - 6, my); c.lineTo(x2 + colW + 6, my); c.stroke();
          kit.label(c, 'top ' + eq.toFixed(1) + ' m = all the air', x2 + colW + 10, Math.min(my + 2, bot - 14), { size: 11, color: C.warn, baseline: 'middle', weight: 600 });
        }
        // the stacked bar: where the heat of 1971–2018 went (IPCC AR6)
        const sx = Wd - 112, sw = 34, parts = [['ocean 91 %', 0.91, C.accent], ['land 5 %', 0.05, C.series[2]], ['ice 3 %', 0.03, C.series[1]], ['air 1 %', 0.01, C.bad]];
        let yy = top;
        for (const [lab, f, col] of parts) {
          const hh = (bot - top) * f;
          c.fillStyle = col; c.fillRect(sx, yy, sw, hh);
          if (f > 0.04) kit.label(c, lab, sx + sw + 6, yy + hh / 2, { size: 11, baseline: 'middle', color: C.text });
          yy += hh;
        }
        kit.label(c, 'where the extra heat', sx + sw / 2, top - 22, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'went, 1971–2018', sx + sw / 2, top - 8, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'land 5 · ice 3 · air 1', sx + sw / 2, bot + 18, { align: 'center', size: 10.5, color: C.muted });
        /* ---- the graph */
        const n = 60, a = [], s = [], lv = [], lvc = [], lin = [];
        const T0 = V.T0, Tc = 2;
        for (let i = 0; i <= n; i++) {
          const tt = t * i / n, d = dTsea(tt);
          a.push([tt, V.F * tt * YEAR / CAIR]); s.push([tt, d]);
          lv.push([tt, rise(T0, d)]); lvc.push([tt, rise(Tc, d)]); lin.push([tt, alphaS(T0) * d * V.D * 1000]);
        }
        if (V.view === 'level') {
          plot.set({ series: [{ pts: lv, label: 'start at ' + T0 + ' °C', color: C.bad, width: 2.5 }, { pts: lvc, label: 'start at 2 °C (polar)', color: C.accent, width: 2.5 }, { pts: lin, label: 'α·ΔT·D at ' + T0 + ' °C', color: C.muted, dash: [5, 4] }],
            x: { label: 'time (years)', min: 0, max: yrs }, y: { label: 'sea-level rise from the layer (mm)', min: 0 }, marks: [], hlines: [] });
        } else {
          plot.set({ series: [{ pts: a, label: 'air column', color: C.bad, width: 2.5 }, { pts: s, label: V.D.toFixed(0) + ' m of sea', color: C.accent, width: 2.5 }],
            x: { label: 'time (years)', min: 0, max: yrs }, y: { label: 'warming (K)', min: 0 }, marks: [], hlines: [] });
        }
        ro.set('Q', sci(Q, 2) + ' J/m²');
        ro.set('air', dA.toFixed(2) + ' K');
        ro.set('sea', dS.toFixed(3) + ' K');
        ro.set('ratio', dS > 0 ? (dA / dS).toFixed(0) + ' ×' : '—');
        ro.set('eq', eq.toFixed(2) + ' m');
        ro.set('lvl', rise(V.T0, dS).toFixed(rise(V.T0, dS) < 10 ? 2 : 1) + ' mm');
        ro.set('alpha', (alphaS(V.T0) * 1e4).toFixed(2) + ' × 10⁻⁴ /K at ' + V.T0 + ' °C');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 3. a surface under the daily or yearly sun */
  Hyper.sim('heat-surface-cycle', {
    title: 'A surface under the daily and yearly sun',
    blurb: `A one-box energy balance, schematic: the sun's heating swings sinusoidally, the surface loses heat in proportion to how much warmer it is than its surroundings, and the *heat capacity* decides how far it swings and how late it peaks: $C\\,dT/dt = F_1\\cos(\\omega t) - \\lambda T$. The heat capacity is given as the depth of water that would have it: bare sand, whose heat reaches only a few centimetres in a day, is equivalent to centimetres of water; a mixed layer of sea is tens of metres.

**Try this**
- Choose *one day*, *desert sand*: it swings by nearly 30 K and peaks about four hours after noon. Switch to *coastal sea*: the swing is a fraction of a kelvin.
- Choose *one year* and compare *dry land* with *open ocean* (the dashed line): the sea swings several times less and peaks two to three months after the solstice, not a few weeks, which is why the sea is warmest in August or September.
- Tick *London and Moscow* in the yearly view: two places at nearly the same latitude, one with the Atlantic upwind and one with a continent. They fall between the model's land and sea, as real places do.
- Raise the heat lost per kelvin (wet soil, wind, evaporation): the swing shrinks and the lag shortens.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 150, maxH: 200 });
      box.stage.appendChild(graph);
      const PRE = { daily: { desert: 0.05, dry: 0.1, moist: 0.25, coast: 5, ocean: 10 }, annual: { desert: 1, dry: 2, moist: 5, coast: 30, ocean: 80 } };
      const F1D = { daily: 250, annual: 90 };
      // approximate monthly means, °C, rounded (Met Office and Roshydromet normals): January … December
      const LON = [5.0, 5.5, 7.5, 10.0, 13.5, 16.5, 19.0, 18.5, 15.5, 12.0, 8.0, 5.5];
      const MOS = [-7.0, -6.5, -1.0, 6.5, 13.5, 17.5, 19.5, 17.5, 11.5, 5.0, -1.0, -5.0];
      const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
      const cyc0 = params.cycle || 'daily';
      const ctl = kit.controls(box.side, [
        { id: 'cycle', type: 'select', label: 'The cycle', options: [['One day', 'daily'], ['One year', 'annual']], value: cyc0 },
        { id: 'surf', type: 'select', label: 'The surface', options: [['Desert sand', 'desert'], ['Dry land', 'dry'], ['Moist soil', 'moist'], ['Coastal sea', 'coast'], ['Open ocean', 'ocean'], ['Custom (use the slider)', 'custom']], value: params.surf || 'dry' },
        { id: 'd', label: 'Heat capacity, as depth of water', min: 0.01, max: 200, log: true, value: PRE[cyc0][params.surf || 'dry'], unit: 'm', sig: 3 },
        { id: 'lam', label: 'Heat lost per kelvin', min: 2, max: 25, step: 0.5, value: 8, unit: 'W/(m²·K)' },
        { id: 'F1', label: 'Swing of the sun’s heating', min: 20, max: 400, step: 5, value: F1D[cyc0], unit: 'W/m²' },
        { id: 'cmp', type: 'check', label: 'Compare with the open ocean', value: true },
        { id: 'data', type: 'check', label: 'Show London and Moscow (year only)', value: !!params.data }
      ], (id, v) => {
        if (id === 'cycle') { ctl.set('F1', F1D[v]); if (V.surf !== 'custom') ctl.set('d', PRE[v][V.surf]); }
        else if (id === 'surf' && v !== 'custom') ctl.set('d', PRE[V.cycle][v]);
        else if (id === 'd') ctl.set('surf', 'custom');
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['C', 'Heat capacity'], ['tau', 'Time constant C/λ'], ['swing', 'Swing, warmest minus coolest'], ['lag', 'Peak lags the sun by'], ['peak', 'Warmest at'], ['sea', 'Open ocean: swing and lag']]);
      const plot = kit.plot(graph, { x: { label: 'time', min: 0, max: 24 }, y: { label: 'temperature about the mean (K)' }, legend: true }, 210);
      let ph = 0;
      const model = (dm, per, lam, F1) => {
        const w = TAU / per, Cc = dm * 998 * 4182, A = F1 / Math.hypot(lam, Cc * w), phi = Math.atan2(Cc * w, lam);
        return { w, C: Cc, A, phi, tau: Cc / lam };
      };
      const fmtLag = (sec, daily) => daily ? (sec / 3600).toFixed(1) + ' h' : (sec / 86400 < 100 ? (sec / 86400).toFixed(0) + ' days' : (sec / 86400 / 30.44).toFixed(1) + ' months');
      const fmtTau = (sec, daily) => sec < 5400 ? (sec / 60).toFixed(0) + ' min' : sec < 3 * 86400 ? (sec / 3600).toFixed(1) + ' h' : sec < 200 * 86400 ? (sec / 86400).toFixed(0) + ' days' : (sec / YEAR).toFixed(2) + ' yr';
      const clock = h => { const hh = ((h % 24) + 24) % 24; return String(Math.floor(hh)).padStart(2, '0') + ':' + String(Math.floor((hh % 1) * 60)).padStart(2, '0'); };
      const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = m => { const mm = ((m % 12) + 12) % 12, i = Math.floor(mm); return Math.round(1 + (mm - i) * 30) + ' ' + MON[i]; };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const daily = V.cycle === 'daily', per = daily ? 86400 : YEAR, len = daily ? 24 : 12, tpk = daily ? 12 : 5.65;
        ph = (ph + dt / 14) % 1;
        const x = ph * len;
        const M = model(V.d, per, V.lam, V.F1), Mo = model(PRE[V.cycle].ocean, per, V.lam, V.F1);
        const Tof = (m, xx) => m.A * Math.cos(TAU * (xx - tpk) / len - m.phi);
        const Tnow = Tof(M, x), Tsea = Tof(Mo, x);
        /* ---- the scene: sun above a land strip and a sea strip */
        const hz = Hh * 0.62;
        c.fillStyle = C.bg2; c.fillRect(0, 0, Wd, hz);
        const sunUp = daily ? Math.max(0, Math.sin(TAU * (x - 6) / 24)) : 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(TAU * (x - tpk) / len));
        const sx = daily ? Wd * (0.08 + 0.84 * clamp((x - 6) / 12, 0, 1)) : Wd * 0.5;
        const sy = hz - 14 - (hz - 40) * sunUp;
        if (daily ? (x > 5.5 && x < 18.5) : true) { c.fillStyle = '#f5b82e'; c.beginPath(); c.arc(sx, sy, 13, 0, TAU); c.fill(); for (let i = 0; i < 8; i++) { const a = i * TAU / 8; c.strokeStyle = '#f5b82e'; c.lineWidth = 2; c.beginPath(); c.moveTo(sx + 17 * Math.cos(a), sy + 17 * Math.sin(a)); c.lineTo(sx + 23 * Math.cos(a), sy + 23 * Math.sin(a)); c.stroke(); } }
        const spread = 6 / Math.max(0.5, Math.max(M.A, Mo.A, 1));
        c.fillStyle = hot(0.5 + Tnow / Math.max(2 * Math.max(M.A, 4), 8)); c.fillRect(0, hz, Wd * 0.5, Hh - hz);
        c.fillStyle = hot(0.5 + Tsea / Math.max(2 * Math.max(M.A, 4), 8)); c.fillRect(Wd * 0.5, hz, Wd * 0.5, Hh - hz);
        kit.label(c, 'your surface  ' + (Tnow >= 0 ? '+' : '') + Tnow.toFixed(1) + ' K', Wd * 0.25, hz + (Hh - hz) / 2, { align: 'center', baseline: 'middle', size: 13, color: '#fff', weight: 700 });
        kit.label(c, 'open ocean  ' + (Tsea >= 0 ? '+' : '') + Tsea.toFixed(1) + ' K', Wd * 0.75, hz + (Hh - hz) / 2, { align: 'center', baseline: 'middle', size: 13, color: '#fff', weight: 700 });
        kit.label(c, daily ? 'clock ' + clock(x) : date(x), 10, 16, { size: 12.5, color: C.text, weight: 650 });
        /* ---- the graph */
        const n = 120, pts = [], ps = [];
        for (let i = 0; i <= n; i++) { const xx = len * i / n; pts.push([xx, Tof(M, xx)]); ps.push([xx, Tof(Mo, xx)]); }
        const series = [{ pts, label: 'your surface', color: C.bad, width: 2.5 }];
        if (V.cmp) series.push({ pts: ps, label: 'open ocean', color: C.accent, dash: [6, 4], width: 2 });
        if (!daily && V.data) {
          const mL = mean(LON), mM = mean(MOS);
          series.push({ pts: LON.map((v, i) => [i + 0.5, v - mL]), label: 'London (monthly means)', color: C.series[2], line: false, dots: 3.5 });
          series.push({ pts: MOS.map((v, i) => [i + 0.5, v - mM]), label: 'Moscow (monthly means)', color: C.series[3], line: false, dots: 3.5 });
        }
        plot.set({ series, x: { label: daily ? 'hour of the day' : 'month (0 = 1 January)', min: 0, max: len }, y: { label: 'temperature about the mean (K)' }, vlines: [{ x: tpk, label: daily ? 'noon' : 'solstice' }, { x, color: C.warn }], marks: [], hlines: [] });
        const lagS = M.phi / (TAU / per), lagO = Mo.phi / (TAU / per);
        ro.set('C', sci(M.C, 2) + ' J/(m²·K)');
        ro.set('tau', fmtTau(M.tau, daily));
        ro.set('swing', (2 * M.A).toFixed(2) + ' K');
        ro.set('lag', fmtLag(lagS, daily));
        ro.set('peak', daily ? clock(tpk + lagS / 3600) : date(tpk + lagS / (YEAR / 12)));
        ro.set('sea', (2 * Mo.A).toFixed(2) + ' K, ' + fmtLag(lagO, daily));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 4. a pot heated from below */
  Hyper.sim('heat-conduction-pot', {
    title: 'A pot of water: conduction and convection',
    blurb: `A 10 cm column of water in a pot with a lid (the top is insulated), heated from below. With *convection* switched off, heat can only creep upward by conduction, and the bottom boils long before the top notices; switch it on and the warm water at the bottom, being lighter, rises and mixes the whole pot. The model is schematic: the diffusion equation in 40 layers, with the density of water from the engine deciding which layers overturn.

**Try this**
- Leave convection off and raise the speed: the bottom layer reaches 100 °C within a minute, where further heat can only make steam, while the top is still at its starting temperature an hour later. Water conducts heat (0.6 W/(m·K)), but slowly: crossing 10 cm takes the heat the better part of a day.
- Switch convection on and restart: the whole pot warms together and is at the boil in about twenty minutes (3 kg of water at 1 kW needs 1,000 s to gain 80 K). In real pots the circulation is the main way heat travels through water; conduction only matters in a thin skin at the bottom.
- Compare the bars on the right: water conducts 23 times better than air and some 650 times worse than copper; ice conducts almost four times better than liquid water.
- Watch the pot with convection on, even at a few hundred watts: the circulation arrows appear and the top and bottom temperatures stay within a few kelvin of each other until the very end.`,
    mount(box, kit, params) {
      const W = kit.water, N = 40, Lp = 0.10, dz = Lp / N, AREA = 0.03;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300, maxH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Heater power', min: 100, max: 2000, step: 50, value: 1000, unit: 'W' },
        { id: 'conv', type: 'check', label: 'Convection (water free to overturn)', value: params.conv != null ? !!params.conv : false },
        { id: 'speed', label: 'Time speed-up', min: 1, max: 20000, log: true, value: 600, unit: '×', sig: 2 },
        { type: 'buttons', items: [{ id: 'go', label: 'Restart cold', primary: true }] }
      ], (id) => { if (id === 'go') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['bot', 'Bottom of the pot'], ['top', 'Top of the water'], ['mean', 'Mean temperature'], ['diff', 'Time for conduction alone to cross 10 cm'], ['k', 'Conductivity of water now'], ['kk', 'Water ÷ air · copper ÷ water']]);
      let T = [], t = 0, steam = 0, flow = 0;
      function reset() { T = new Array(N).fill(20); t = 0; steam = 0; }
      reset();
      const KS = [['Air', 0.026], ['Pine wood', 0.12], ['Water, 20 °C', 0.6], ['Glass', 1.0], ['Concrete', 1.7], ['Ice', 2.2], ['Stainless steel', 15], ['Iron', 80], ['Aluminium', 237], ['Copper', 401]];
      const sub = (h) => {
        const alpha = W.thermalConductivity(mean(T)) / (W.density(mean(T)) * W.heatCapacity(mean(T)));
        const r = alpha * h / (dz * dz);
        const a = T.slice();
        for (let i = 0; i < N; i++) {
          const dn = i > 0 ? a[i - 1] : a[i], up = i < N - 1 ? a[i + 1] : a[i];
          T[i] = a[i] + r * (dn - 2 * a[i] + up);
        }
        const q = V.P / AREA;                                   // W/m² into the bottom layer
        const rho = W.density(T[0]), cp = W.heatCapacity(T[0]);
        T[0] += q * h / (rho * cp * dz);
        if (T[0] > 100) { steam += (T[0] - 100) * rho * cp * dz * AREA; T[0] = 100; }
        if (V.conv) {
          let moved = 0;
          for (let pass = 0; pass < 60; pass++) {
            let any = false;
            for (let i = 0; i < N - 1; i++) {
              if (W.density(T[i]) < W.density(T[i + 1]) - 1e-9) { const m = (T[i] + T[i + 1]) / 2; moved += Math.abs(T[i] - T[i + 1]); T[i] = m; T[i + 1] = m; any = true; }
            }
            if (!any) break;
          }
          flow = flow * 0.9 + moved * 0.1;
        } else flow *= 0.9;
      };
      const mean = a => { let s = 0; for (const x of a) s += x; return s / a.length; };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        let simS = Math.min(dt, 0.05) * V.speed;
        const hmax = 5;
        const nsub = Math.min(3000, Math.max(1, Math.ceil(simS / hmax)));
        const h = simS / nsub;
        for (let i = 0; i < nsub; i++) sub(h);
        t += simS;
        /* ---- the pot */
        const px = 30, pw = Math.min(Wd * 0.3, 190), py = 44, ph = Hh - 110;
        c.fillStyle = C.surface; c.fillRect(px - 8, py - 6, pw + 16, ph + 14);
        for (let i = 0; i < N; i++) {
          const y = py + ph - (i + 1) * ph / N;
          c.fillStyle = hot((T[i] - 20) / 80); c.fillRect(px, y, pw, ph / N + 0.6);
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(px, py, pw, ph);
        // heater and flame
        c.fillStyle = C.bad; c.fillRect(px - 8, py + ph + 8, pw + 16, 6);
        for (let i = 0; i < 6; i++) { const fx = px + 10 + i * (pw - 20) / 5, fh = 6 + 10 * V.P / 2000 + 3 * Math.sin(t * 0.3 + i * 2 + performance.now() / 120); c.fillStyle = 'rgba(245,160,40,0.85)'; c.beginPath(); c.moveTo(fx - 5, py + ph + 14); c.lineTo(fx, py + ph + 14 + fh); c.lineTo(fx + 5, py + ph + 14); c.fill(); }
        // convection arrows
        if (V.conv && flow > 0.02) {
          const a = clamp(flow * 4, 0.2, 1);
          c.globalAlpha = a;
          kit.arrow(c, px + pw * 0.3, py + ph - 14, px + pw * 0.3, py + 18, '#fff', 2.2);
          kit.arrow(c, px + pw * 0.7, py + 18, px + pw * 0.7, py + ph - 14, '#fff', 2.2);
          c.globalAlpha = 1;
        }
        if (T[0] >= 99.9) for (let i = 0; i < 4; i++) kit.label(c, '○', px + 14 + i * (pw - 28) / 3, py + ph - 8 - ((t * 0.7 + i * 7) % 18), { size: 9, color: 'rgba(255,255,255,0.8)', align: 'center' });
        kit.label(c, 'lid (insulated)', px + pw / 2, py - 16, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'top ' + T[N - 1].toFixed(1) + ' °C', px + pw + 14, py + 8, { size: 12, color: C.text, weight: 650 });
        kit.label(c, 'bottom ' + T[0].toFixed(1) + ' °C', px + pw + 14, py + ph - 8, { size: 12, color: C.text, weight: 650 });
        kit.label(c, V.conv ? 'convection on' : 'conduction only', px + pw / 2, Hh - 16, { align: 'center', size: 12.5, weight: 650, color: V.conv ? C.ok : C.warn });
        /* ---- the conductivities, log scale */
        const bx = px + pw + 110, bw = Wd - bx - 8;
        const kw = W.thermalConductivity(mean(T));
        const items = KS.map(k => ({ label: k[0], v: k[1], bold: k[0].indexOf('Water') === 0 }));
        items[2].v = kw;
        kit.label(c, 'Thermal conductivity, W/(m·K), log scale', bx, 16, { size: 12, weight: 650 });
        bars(c, kit, C, bx, 34, bw, Hh - 60, items, { labelW: 96, log: true, min: 0.01, max: 1000, fmt: v => v < 1 ? v.toFixed(3) : v < 10 ? v.toFixed(1) : Math.round(v) });
        /* ---- readouts */
        const tm = Math.round(t);
        ro.set('t', t < 5400 ? Math.floor(t / 60) + ' min ' + (tm % 60) + ' s' : (t / 3600).toFixed(1) + ' h');
        ro.set('bot', T[0].toFixed(1) + ' °C' + (T[0] >= 99.9 ? ' (boiling)' : ''));
        ro.set('top', T[N - 1].toFixed(1) + ' °C');
        ro.set('mean', mean(T).toFixed(1) + ' °C');
        const aa = kw / (W.density(mean(T)) * W.heatCapacity(mean(T)));
        ro.set('diff', (Lp * Lp / aa / 3600).toFixed(0) + ' h  (L²/α, α = ' + (aa * 1e7).toFixed(2) + ' × 10⁻⁷ m²/s)');
        ro.set('k', kw.toFixed(3) + ' W/(m·K)');
        ro.set('kk', (kw / 0.026).toFixed(0) + ' × · 1/' + (401 / kw).toFixed(0));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 5. sweating against the wet bulb */
  Hyper.sim('heat-wet-bulb', {
    title: 'Sweat, humidity and the wet-bulb limit',
    blurb: `A person must lose to the air every watt the body makes. When the air is cooler than the skin (35 °C here) some of it goes by convection and radiation; the rest must leave as sweat that evaporates, taking 2.4 MJ per kilogram. The map shows which combinations of air temperature and humidity leave sweat unable to keep up (red): above them the body's core temperature must rise. The model is a skin heat balance with the Lewis relation between convection and evaporation: schematic, with fixed skin temperature and an average adult (1.8 m²).

**Try this**
- At 40 °C and 20 % humidity the point is well inside the safe zone: dry air makes a hot day bearable. Raise the humidity and watch the wet-bulb temperature climb and the margin vanish.
- The white contours are wet-bulb temperatures of 31 °C and 35 °C. The red region begins well before 35 °C for anyone doing any work: raise the activity to 400 W.
- Wind speeds both evaporation and convection. Set 45 °C and 30 % humidity: in still air (0.2 m/s) sweat only just fails to keep up, with a 3 m/s fan it copes easily. Then raise the humidity to 70 %: nothing helps, and the fan only adds heat.
- The last read-out is a swamp cooler: air blown through a wet pad cools toward the wet-bulb temperature, which is why it works in a desert and fails in a rain forest.`,
    mount(box, kit, params) {
      const W = kit.water, A = 1.8, TS = 35;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Air temperature', min: 15, max: 55, step: 0.5, value: params.T != null ? params.T : 38, unit: '°C' },
        { id: 'RH', label: 'Relative humidity', min: 5, max: 100, step: 1, value: params.RH != null ? params.RH : 40, unit: '%' },
        { id: 'M', label: 'Heat the body makes', min: 80, max: 800, step: 10, value: params.M || 120, unit: 'W' },
        { id: 'v', label: 'Wind speed', min: 0, max: 8, step: 0.1, value: 1, unit: 'm/s' }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['wb', 'Wet-bulb temperature'], ['dew', 'Dew point'], ['need', 'Heat to lose by sweat'], ['cap', 'Most the skin can evaporate'], ['sw', 'Sweat that must evaporate'], ['v', 'Verdict'], ['sc', 'Swamp cooler, 80 % effective, delivers']]);
      const calc = (Ta, RH, M, v) => {
        const hc = Math.max(3.1, 8.3 * Math.pow(v, 0.6));
        const need = Math.max(0, M + (hc + 4.7) * A * (Ta - TS));
        const pSk = W.vapourPressure(TS) / 1000, pA = RH * W.vapourPressure(Ta) / 1000;
        const cap = 16.5 * hc * A * Math.max(0, pSk - pA);
        return { hc, need, cap, pSk, pA };
      };
      const wbRoot = (T, target) => {
        if (W.wetBulb(T, 0.99) < target) return null;
        if (W.wetBulb(T, 0.05) > target) return 0.05;
        let a = 0.05, b = 0.99;
        for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (W.wetBulb(T, m) < target) a = m; else b = m; }
        return (a + b) / 2;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const x0 = 52, x1 = Wd - 14, y0 = 16, y1 = Hh - 40, TMIN = 15, TMAX = 55;
        const X = T => x0 + (T - TMIN) / (TMAX - TMIN) * (x1 - x0), Y = rh => y1 - rh * (y1 - y0);
        c.fillStyle = C.surface; c.fillRect(x0, y0, x1 - x0, y1 - y0);
        // the red region: relative humidity above which sweat cannot keep up
        c.fillStyle = 'rgba(220,70,60,0.30)';
        const path = [];
        for (let px = x0; px <= x1; px += 3) {
          const Ta = TMIN + (px - x0) / (x1 - x0) * (TMAX - TMIN), k = calc(Ta, 0, V.M, V.v);
          const esA = W.vapourPressure(Ta) / 1000;
          const rhc = clamp((k.pSk - k.need / (16.5 * k.hc * A)) / esA, 0, 1.5);
          path.push([px, Y(clamp(rhc, 0, 1))]);
        }
        c.beginPath(); c.moveTo(x0, y0);
        for (const p of path) c.lineTo(p[0], p[1] - 0);
        c.lineTo(x1, y0); c.closePath();
        c.fillStyle = 'rgba(220,70,60,0.28)'; c.fill();
        // wet-bulb contours
        for (const [tw, col] of [[31, C.warn], [35, C.text]]) {
          c.strokeStyle = col; c.lineWidth = 1.8; c.beginPath(); let pen = false;
          for (let px = x0; px <= x1; px += 3) {
            const Ta = TMIN + (px - x0) / (x1 - x0) * (TMAX - TMIN), r = wbRoot(Ta, tw);
            if (r == null) { pen = false; continue; }
            if (pen) c.lineTo(px, Y(r)); else c.moveTo(px, Y(r));
            pen = true;
          }
          c.stroke();
          const lt = Math.min(TMAX - 1, 36 + (tw - 31) * 2.2), rr = wbRoot(lt, tw);
          if (rr != null) kit.label(c, 'wet-bulb ' + tw + ' °C', X(lt) + 4, Y(rr) - 8, { size: 11, color: col, weight: 600 });
        }
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
        for (let T = 20; T <= 50; T += 10) { kit.label(c, T + ' °C', X(T), y1 + 6, { align: 'center', size: 11, color: C.muted, baseline: 'top' }); c.beginPath(); c.moveTo(X(T), y1); c.lineTo(X(T), y1 + 4); c.stroke(); }
        for (let r = 0; r <= 1; r += 0.25) kit.label(c, Math.round(r * 100) + ' %', x0 - 6, Y(r), { align: 'right', size: 11, color: C.muted, baseline: 'middle' });
        kit.label(c, 'air temperature', (x0 + x1) / 2, y1 + 22, { align: 'center', size: 11.5, color: C.muted, baseline: 'top' });
        kit.label(c, 'relative humidity ↑', x0 + 8, y0 + 14, { size: 11.5, color: C.muted });
        kit.label(c, 'sweat cannot keep up', x1 - 8, y0 + 14, { align: 'right', size: 12, color: C.bad, weight: 650 });
        kit.label(c, 'cooling works', x0 + 8, y1 - 12, { size: 12, color: C.ok, weight: 650 });
        // the point
        const k = calc(V.T, V.RH / 100, V.M, V.v), ok = k.need <= k.cap;
        kit.dot(c, X(V.T), Y(V.RH / 100), 7, ok ? C.ok : C.bad, C.text);
        const wb = W.wetBulb(V.T, V.RH / 100), Lv = W.latentVaporisation(TS);
        const sweatLh = k.need / Lv * 3600;                       // kg/h ≈ L/h
        ro.set('wb', wb.toFixed(1) + ' °C');
        ro.set('dew', W.dewPoint(V.T, V.RH / 100).toFixed(1) + ' °C');
        ro.set('need', Math.round(k.need) + ' W');
        ro.set('cap', Math.round(k.cap) + ' W');
        ro.set('sw', sweatLh.toFixed(2) + ' L/h (2.4 MJ/kg at the skin)');
        ro.set('v', k.need <= 1 ? 'no sweat needed: dry loss is enough' : !ok ? 'sweat cannot keep up: the core warms' : sweatLh > 1.5 ? 'more sweat than a body can sustain' : 'works: the core stays steady');
        ro.set('sc', (V.T - 0.8 * (V.T - wb)).toFixed(1) + ' °C');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 6. a parcel of tropical air rising */
  Hyper.sim('heat-parcel', {
    title: 'A parcel of warm moist air rising',
    blurb: `A parcel of air at the sea surface is lifted: it expands and cools by 9.8 K/km until its water vapour condenses (the *lifting condensation level*), then cools more slowly because condensing vapour gives back the latent heat. If it stays warmer than the surrounding air it keeps rising; the area between the two curves is the energy available to drive the storm (CAPE). The right-hand panel is a sketch of a hurricane cross-section: warm moist air flows in over the sea, rises in the eye wall, and flows out aloft. Schematic: a reversible parcel with no mixing, over a fixed tropical sounding.

**Try this**
- Lower the sea temperature from 28 °C to 24 °C: the parcel loses most of its buoyancy; at 22 °C it never rises. Around 26–27 °C the engine switches on, the sea-temperature threshold quoted for hurricanes (26.5 °C).
- Dry the air (lower the humidity): the parcel has to rise further before it condenses, and has less water to condense. The latent heat released per kilogram falls.
- Compare the heat released by the condensing water (read-out, kJ per kg of air) with the 1 kJ it takes to warm a kilogram of air by one kelvin.
- Steeper environment lapse rates make the atmosphere more unstable: more energy for the same sea.`,
    mount(box, kit, params) {
      const W = kit.water;
      const g = 9.80665, Rd = 287.05, cpA = 1005, eps = 0.622;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'sst', label: 'Sea-surface temperature', min: 20, max: 32, step: 0.5, value: params.sst != null ? params.sst : 28, unit: '°C' },
        { id: 'rh', label: 'Humidity of the surface air', min: 40, max: 100, step: 1, value: params.rh || 85, unit: '%' },
        { id: 'lapse', label: 'Environment lapse rate', min: 5, max: 8, step: 0.1, value: 6.2, unit: 'K/km' },
        { id: 'sketch', type: 'check', label: 'Show the hurricane sketch', value: true }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lcl', 'Cloud base (condensation level)'], ['top', 'Cloud top (parcel stops rising)'], ['cape', 'CAPE'], ['w', 'Ideal updraft √(2·CAPE)'], ['cond', 'Water condensed'], ['lat', 'Latent heat released per kg of air'], ['thr', 'Against the 26.5 °C threshold']]);
      let key = '', S = null, ph = 0;
      function compute() {
        const k = [V.sst, V.rh, V.lapse].join('|');
        if (k === key) return S;
        key = k;
        const T0e = 299.15, lapse = V.lapse, Te = z => T0e - lapse * Math.min(z, 15500) / 1000;
        const RHe = 0.7, dz = 20;
        let p = 101325, z = 0, T = V.sst + 273.15, sat = false, lcl = null, rl = 0, top = 0, cape = 0;
        const es0 = W.vapourPressure(V.sst), r0 = eps * V.rh / 100 * es0 / (p - V.rh / 100 * es0);
        let rs = r0;
        const pts = [[0, T - 273.15, Te(0) - 273.15, 0]];
        while (z < 17000) {
          const Tenv = Te(z);
          p *= Math.exp(-g * dz / (Rd * Tenv));
          if (!sat) {
            T -= g / cpA * dz;
            const es = W.vapourPressure(T - 273.15), rsat = eps * es / (p - es);
            if (r0 >= rsat) { sat = true; lcl = z + dz; rs = rsat; }
          } else {
            const es = W.vapourPressure(T - 273.15); rs = eps * es / (p - es);
            const Lv = W.latentVaporisation(T - 273.15);
            const G = g * (1 + Lv * rs / (Rd * T)) / (cpA + Lv * Lv * rs * eps / (Rd * T * T));
            T -= G * dz; rl = Math.max(0, r0 - rs);
          }
          z += dz;
          const esE = W.vapourPressure(Te(z) - 273.15), rE = Math.min(0.03, RHe * eps * esE / Math.max(1, p - esE));
          const rv = sat ? rs : r0;
          const Tvp = T * (1 + 0.608 * rv) * (1 - rl), Tve = Te(z) * (1 + 0.608 * rE);
          const b = g * (Tvp - Tve) / Tve;
          if (b > 0) { cape += b * dz; top = z; }
          if (Math.round(z / dz) % 5 === 0) pts.push([z / 1000, T - 273.15, Te(z) - 273.15, b]);
        }
        S = { pts, lcl: lcl == null ? 0 : lcl, top, cape, rl, Tenv: Te };
        return S;
      }
      const path = (cx, rw, sea, ytop, side) => {      // inflow along the sea, up the eye wall, out aloft
        const e = rw * 0.07, s = side;
        return [[cx + s * rw * 0.47, sea - 6], [cx + s * rw * 0.22, sea - 8], [cx + s * (e + 6), sea - 14], [cx + s * (e + 12), sea - (sea - ytop) * 0.35], [cx + s * (e + rw * 0.08), sea - (sea - ytop) * 0.7], [cx + s * (e + rw * 0.17), ytop + 12], [cx + s * rw * 0.47, ytop + 4]];
      };
      const along = (pts, f) => {
        let L = 0; const seg = [];
        for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(d); L += d; }
        let d = f * L;
        for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const u = d / seg[i]; return [pts[i][0] + u * (pts[i + 1][0] - pts[i][0]), pts[i][1] + u * (pts[i + 1][1] - pts[i][1])]; } d -= seg[i]; }
        return pts[pts.length - 1];
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const S0 = compute();
        const dw = V.sketch ? Wd * 0.58 : Wd;
        /* ---- the sounding */
        const x0 = 46, x1 = dw - 14, y0 = 20, y1 = Hh - 36, TL = -85, TH = 35, ZH = 17;
        const X = T => x0 + (T - TL) / (TH - TL) * (x1 - x0), Y = z => y1 - z / ZH * (y1 - y0);
        c.fillStyle = C.surface; c.fillRect(x0, y0, x1 - x0, y1 - y0);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let z = 0; z <= 16; z += 4) { c.beginPath(); c.moveTo(x0, Y(z)); c.lineTo(x1, Y(z)); c.stroke(); kit.label(c, z + ' km', x0 - 5, Y(z), { align: 'right', size: 11, color: C.muted, baseline: 'middle' }); }
        for (let T = -80; T <= 30; T += 20) { kit.label(c, T + ' °C', X(T), y1 + 6, { align: 'center', size: 11, color: C.muted, baseline: 'top' }); }
        // CAPE: where the parcel is buoyant
        c.fillStyle = 'rgba(230,90,60,0.30)';
        for (let i = 0; i < S0.pts.length - 1; i++) {
          const a = S0.pts[i], b = S0.pts[i + 1];
          if (a[3] > 0 && b[3] > 0) { c.beginPath(); c.moveTo(X(a[2]), Y(a[0])); c.lineTo(X(a[1]), Y(a[0])); c.lineTo(X(b[1]), Y(b[0])); c.lineTo(X(b[2]), Y(b[0])); c.closePath(); c.fill(); }
        }
        const line = (idx, col, w, dash) => {
          c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath();
          S0.pts.forEach((p, i) => { if (i) c.lineTo(X(p[idx]), Y(p[0])); else c.moveTo(X(p[idx]), Y(p[0])); });
          c.stroke(); c.setLineDash([]);
        };
        line(2, C.muted, 2.2); line(1, C.bad, 2.6);
        if (S0.lcl > 0) { c.strokeStyle = C.accent; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, Y(S0.lcl / 1000)); c.lineTo(x1, Y(S0.lcl / 1000)); c.stroke(); c.setLineDash([]); kit.label(c, 'cloud base ' + (S0.lcl / 1000).toFixed(2) + ' km', x1 - 4, Y(S0.lcl / 1000) - 8, { align: 'right', size: 11, color: C.accent }); }
        if (S0.cape > 1) { kit.label(c, 'cloud top ' + (S0.top / 1000).toFixed(1) + ' km', x1 - 4, Y(S0.top / 1000) - 8, { align: 'right', size: 11, color: C.bad, weight: 600 }); }
        c.strokeStyle = C.axis; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
        kit.label(c, 'surrounding air', X(S0.Tenv(8500) - 273.15) - 8, Y(8.5), { size: 11.5, color: C.muted, weight: 600, align: 'right' });
        if (S0.cape > 1) kit.label(c, 'the rising parcel', X(S0.Tenv(5000) - 273.15) + 16, Y(5), { size: 11.5, color: C.bad, weight: 600 });
        kit.label(c, 'shaded: parcel lighter than its surroundings', x1 - 6, y0 + 12, { size: 10.5, color: C.muted, align: 'right' });
        /* ---- the hurricane sketch */
        if (V.sketch) {
          const rx = dw + 8, rw = Wd - rx - 8, cx = rx + rw / 2, sea = y1 - 24, ytop = y0 + 28, wUp = Math.sqrt(2 * S0.cape);
          c.fillStyle = 'rgba(70,150,235,0.35)'; c.fillRect(rx, sea, rw, y1 - sea);
          kit.label(c, 'warm sea', rx + rw - 6, sea + 12, { size: 11, color: C.text, baseline: 'middle', align: 'right' });
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(rx, y0, rw, y1 - y0);
          const e = rw * 0.07;
          // eye wall and eye
          c.strokeStyle = C.text; c.lineWidth = 2.4;
          for (const s of [-1, 1]) { c.beginPath(); c.moveTo(cx + s * (e + 6), sea - 10); c.quadraticCurveTo(cx + s * (e + 10), (sea + ytop) / 2, cx + s * (e + rw * 0.17), ytop + 12); c.stroke(); }
          kit.label(c, 'eye', cx, sea - 30, { align: 'center', size: 11.5, color: C.muted });
          kit.label(c, 'eye wall', cx + e + rw * 0.12, (sea + ytop) / 2, { size: 11.5, color: C.text, weight: 650 });
          kit.label(c, 'outflow', cx + rw * 0.28, ytop - 8 + 8, { size: 11, color: C.muted });
          kit.label(c, 'inflow', rx + 6, sea - 14, { size: 10.5, color: C.muted });
          ph = (ph + dt * (0.04 + 0.2 * clamp(wUp / 60, 0, 1))) % 1;
          if (S0.cape > 1) {
            for (const s of [-1, 1]) {
              const P = path(cx, rw, sea, ytop, s);
              for (let i = 0; i < 9; i++) { const f = (ph + i / 9) % 1, p = along(P, f), warm = f < 0.2 ? 0.2 : f < 0.7 ? 0.8 : 0.4; c.fillStyle = hot(warm); c.beginPath(); c.arc(p[0], p[1], 3.2, 0, TAU); c.fill(); }
            }
          } else kit.label(c, 'no buoyancy: no engine', cx, (sea + ytop) / 2, { align: 'center', size: 12, color: C.bad, weight: 650 });
          kit.label(c, 'mature hurricane: about 6 × 10¹⁴ W of latent heat', cx, y0 + 12, { align: 'center', size: 10.5, color: C.muted });
        }
        const heat = W.latentVaporisation(15) * S0.rl / 1000;
        ro.set('lcl', S0.lcl > 0 ? (S0.lcl / 1000).toFixed(2) + ' km' : '—');
        ro.set('top', S0.cape > 1 ? (S0.top / 1000).toFixed(1) + ' km' : 'does not rise');
        ro.set('cape', Math.round(S0.cape).toLocaleString('en-GB') + ' J/kg');
        ro.set('w', S0.cape > 0 ? Math.sqrt(2 * S0.cape).toFixed(0) + ' m/s (real updrafts reach ~10 %)' : '—');
        ro.set('cond', (S0.rl * 1000).toFixed(1) + ' g per kg of air');
        ro.set('lat', heat.toFixed(0) + ' kJ/kg (warms the air 1 K per 1.005 kJ)');
        ro.set('thr', V.sst >= 26.5 ? 'sea warmer than 26.5 °C by ' + (V.sst - 26.5).toFixed(1) + ' K' : 'sea cooler than 26.5 °C by ' + (26.5 - V.sst).toFixed(1) + ' K');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 7. Q = m c dT, the cooling loop */
  Hyper.sim('heat-cooling-loop', {
    title: 'How much coolant does a heat load need?',
    blurb: `A heat load is cooled by a stream of coolant that enters cold and leaves warm. Whatever the machine, the flow needed is the same relation, $Q = \\dot m\\,c\\,\\Delta T$. Pick a machine (from a processor to a power station), a coolant and the warming you allow, and read off the flow, the pipe it needs at the chosen speed, and the boiling point you must stay below.

**Try this**
- Take the *server rack* (20 kW) and switch the coolant from water to *air*: the flow of air is thousands of times larger in volume, which is why data centres push cold water to the racks and why air-cooled machines are mostly fans and fins.
- Take the *power station* (2 GW of rejected heat): cooling by warming river water by 8 K needs a river; cooling by *evaporation* needs about a thousandth of that flow, but it is gone, up the tower as vapour. Tick the box to compare.
- Choose the *car engine* and compare water with the glycol mixture: antifreeze carries less heat per kilogram, so it needs more flow for the same job, but it boils higher and freezes lower. Raise the system pressure to 2 bar and watch the boiling margin.
- Allow a larger warming: the flow falls in proportion.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 340 });
      const COOL = { water: { n: 'Water', cp: 4182, rho: 998 }, glycol: { n: 'Water + 50 % ethylene glycol', cp: 3300, rho: 1070 }, oil: { n: 'Mineral oil', cp: 1900, rho: 870 }, air: { n: 'Air', cp: 1005, rho: 1.2 } };
      const LOADS = [['A processor chip, 0.15 kW', 0.15], ['A car engine at cruise, 40 kW', 40], ['A server rack, 20 kW', 20], ['A data-centre hall, 10 MW', 1e4], ['A power station: 2 GW of heat', 2e6]];
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'A machine', options: LOADS.concat([['Custom (use the slider)', 0]]), value: params.pre != null ? params.pre : 20 },
        { id: 'Q', label: 'Heat to carry away', min: 0.1, max: 5e6, log: true, value: params.Q || 20, fmt: kWfmt },
        { id: 'cool', type: 'select', label: 'Coolant', options: [['Water', 'water'], ['Water + 50 % glycol', 'glycol'], ['Mineral oil', 'oil'], ['Air', 'air']], value: params.cool || 'water' },
        { id: 'dT', label: 'Warming of the coolant', min: 2, max: 40, step: 1, value: 10, unit: 'K' },
        { id: 'Tin', label: 'Coolant temperature in', min: 5, max: 80, step: 1, value: 30, unit: '°C' },
        { id: 'v', label: 'Speed in the pipe', min: 0.5, max: 10, step: 0.5, value: 2, unit: 'm/s' },
        { id: 'p', label: 'System pressure (absolute)', min: 1, max: 3, step: 0.1, value: 1, unit: 'bar' },
        { id: 'evap', type: 'check', label: 'Compare with cooling by evaporation', value: !!params.evap }
      ], (id, v) => { if (id === 'pre' && v > 0) ctl.set('Q', v); else if (id === 'Q') ctl.set('pre', 0); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Mass flow'], ['Vf', 'Volume flow'], ['D', 'Pipe diameter at that speed'], ['out', 'Coolant leaves at'], ['bp', 'Coolant boils at'], ['ratio', 'Volume vs water'], ['ev', 'Water evaporated for the same heat']]);
      let ph = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const cl = COOL[V.cool], Q = V.Q * 1e3;
        const m = Q / (cl.cp * V.dT), Vf = m / cl.rho, D = Math.sqrt(4 * Vf / (Math.PI * V.v));
        const Vw = m * (cl.cp / 4182) / 998 * 1;                             // water volume flow for the same heat: Q/(4182 dT)/998
        const Vwater = Q / (4182 * V.dT) / 998;
        const out = V.Tin + V.dT;
        const bp = V.cool === 'water' ? W.boilingPoint(V.p * 1e5) : V.cool === 'glycol' ? W.boilingPoint(V.p * 1e5) + 7 : V.cool === 'oil' ? 250 : Infinity;
        const evap = Q / W.latentVaporisation(35);
        /* ---- the loop */
        const x0 = 40, x1 = Wd - 40, y0 = 70, y1 = Hh - 64, bw = 110, bh = y1 - y0;
        const wd = clamp(2 + 3.2 * Math.log10(Math.max(D * 1000, 1)), 3, 16);
        c.strokeStyle = C.axis; c.lineWidth = wd; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(x0 + bw, y0 + bh * 0.25); c.lineTo(x1 - bw, y0 + bh * 0.25); c.moveTo(x0 + bw, y0 + bh * 0.75); c.lineTo(x1 - bw, y0 + bh * 0.75); c.stroke();
        // machine (left) and the sink (right)
        c.fillStyle = hot(0.85); c.fillRect(x0, y0, bw, bh); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x0, y0, bw, bh);
        c.fillStyle = hot(0.1); c.fillRect(x1 - bw, y0, bw, bh); c.strokeRect(x1 - bw, y0, bw, bh);
        kit.label(c, 'the machine', x0 + bw / 2, y0 + bh / 2 - 8, { align: 'center', size: 12.5, color: '#fff', weight: 700 });
        kit.label(c, kWfmt(V.Q), x0 + bw / 2, y0 + bh / 2 + 10, { align: 'center', size: 12, color: '#fff' });
        kit.label(c, 'radiator, tower', x1 - bw / 2, y0 + bh / 2 - 8, { align: 'center', size: 12, color: '#fff', weight: 700 });
        kit.label(c, 'or river', x1 - bw / 2, y0 + bh / 2 + 10, { align: 'center', size: 12, color: '#fff' });
        // moving particles: cold along the lower pipe (to the machine side), warm along the upper (to the sink)
        ph = (ph + dt * (0.12 + 0.05 * V.v)) % 1;
        const L = x1 - x0 - 2 * bw;
        for (let i = 0; i < 16; i++) {
          const f = (ph + i / 16) % 1;
          c.fillStyle = hot(0.1); c.beginPath(); c.arc(x1 - bw - f * L, y0 + bh * 0.75, wd * 0.28 + 1, 0, TAU); c.fill();
          c.fillStyle = hot(0.35 + 0.65 * V.dT / 40); c.beginPath(); c.arc(x0 + bw + f * L, y0 + bh * 0.25, wd * 0.28 + 1, 0, TAU); c.fill();
        }
        kit.label(c, 'in ' + V.Tin + ' °C', x0 + bw + 6, y0 + bh * 0.75 + wd + 8, { size: 12, color: C.accent, weight: 650, baseline: 'top' });
        kit.label(c, 'out ' + out + ' °C' + (out >= bp ? '  — boils!' : ''), x0 + bw + 6, y0 + bh * 0.25 - wd - 8, { size: 12, color: out >= bp ? C.bad : C.warn, weight: 650, baseline: 'bottom' });
        kit.label(c, cl.n + ' · ' + (m >= 100 ? Math.round(m).toLocaleString('en-GB') : m.toPrecision(3)) + ' kg/s', Wd / 2, 18, { align: 'center', size: 13, weight: 650 });
        kit.label(c, 'Q = ṁ · c · ΔT = ' + (m >= 100 ? Math.round(m) : m.toPrecision(2)) + ' × ' + cl.cp + ' × ' + V.dT + ' = ' + si(Q, 'W'), Wd / 2, 40, { align: 'center', size: 12, color: C.muted });
        if (V.evap) kit.label(c, 'by evaporation instead: ' + evap.toPrecision(3) + ' kg/s of water leaves as vapour', Wd / 2, Hh - 22, { align: 'center', size: 12, color: C.series[2], weight: 600 });
        ro.set('m', (m >= 100 ? Math.round(m).toLocaleString('en-GB') : m.toPrecision(3)) + ' kg/s');
        ro.set('Vf', Vf >= 1 ? Vf.toPrecision(3) + ' m³/s' : (Vf * 1000).toPrecision(3) + ' L/s');
        ro.set('D', D >= 1 ? D.toFixed(2) + ' m' : (D * 1000).toFixed(0) + ' mm');
        ro.set('out', out + ' °C');
        ro.set('bp', Number.isFinite(bp) ? bp.toFixed(0) + ' °C' + (out >= bp ? ' — would boil' : ' (margin ' + (bp - out).toFixed(0) + ' K)') : 'does not boil in this range');
        ro.set('ratio', (Vf / Vwater).toFixed(Vf / Vwater < 10 ? 2 : 0) + ' ×');
        ro.set('ev', evap >= 1 ? evap.toPrecision(3) + ' kg/s' : (evap * 3600).toPrecision(3) + ' kg/h');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 8. the body's core temperature */
  Hyper.sim('heat-body-37', {
    title: 'The body at 37 °C: heat in, heat out',
    blurb: `A person of 60 kg is mostly water, with a heat capacity of about 208 kJ/K. A two-node model, schematic and in the spirit of Gagge's: a core that makes heat and a skin that exchanges it with the world. Blood flow to the skin rises when the core is warm and falls when it is cold; sweating starts above about 37.1 °C and evaporates as the air allows; shivering starts below about 36.7 °C and fades as the core falls under 35 °C. The model describes how the body responds; it is not advice for any situation.

**Try this**
- Start at rest in a 22 °C room. The core sits at 37 °C with a skin cooler than the core: the body is in balance with almost no effort.
- Choose *hard running* at 25 °C with a wind of 3 m/s (the breeze of running): the core settles at about 39 °C and sweat carries away some 800 W. Now raise the humidity to 90 %: more sweat is made than evaporates, and the core climbs past 41 °C.
- Switch the medium to *water* at 15 °C: the heat loss is many times larger than in air of the same temperature, shivering cannot keep up, and the core falls by degrees over an hour or two. In water at 30 °C the core holds near normal for hours.
- Compare *lean* and *insulated* in the 15 °C water: the body's own fat acts as clothing, and the lean build cools far faster.`,
    mount(box, kit, params) {
      const W = kit.water, A = 1.8, CB = 60 * 3470;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 300 });
      box.stage.appendChild(graph);
      const ACT = [['Sleeping, 70 W', 70], ['Resting, 100 W', 100], ['Walking, 250 W', 250], ['Jogging, 600 W', 600], ['Hard running, 900 W', 900]];
      const ctl = kit.controls(box.side, [
        { id: 'med', type: 'select', label: 'Medium', options: [['Air', 'air'], ['Water (immersed)', 'water']], value: params.med || 'air' },
        { id: 'Ta', label: 'Temperature of air or water', min: -10, max: 50, step: 1, value: params.Ta != null ? params.Ta : 22, unit: '°C' },
        { id: 'RH', label: 'Relative humidity (air)', min: 5, max: 100, step: 1, value: params.RH || 40, unit: '%' },
        { id: 'M', type: 'select', label: 'Activity', options: ACT, value: params.M || 100 },
        { id: 'clo', label: 'Clothing', min: 0, max: 3, step: 0.1, value: 0.6, unit: 'clo' },
        { id: 'v', label: 'Wind speed', min: 0, max: 10, step: 0.1, value: 0.2, unit: 'm/s' },
        { id: 'fat', type: 'select', label: 'Build', options: [['Lean', 1.25], ['Average', 1], ['Insulated (more fat)', 0.75]], value: 1 },
        { id: 'speed', label: 'Time speed-up', min: 1, max: 60, step: 1, value: 12, unit: 'min/s' },
        { type: 'buttons', items: [{ id: 'go', label: 'Restart at 37 °C', primary: true }] }
      ], (id) => { if (id === 'go') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Tc', 'Core temperature'], ['Ts', 'Skin temperature'], ['dry', 'Heat lost by skin to the surroundings'], ['ev', 'Heat lost by evaporation'], ['sh', 'Heat made by shivering'], ['sw', 'Sweat produced · evaporated'], ['state', 'The core is']]);
      const plot = kit.plot(graph, { x: { label: 'time (minutes)', min: 0 }, y: { label: 'core temperature (°C)', min: 30, max: 44 } }, 170);
      let s, pts, tt;
      function reset() { s = { Tc: 37, Ts: 33, E: 0, dry: 0, sh: 0, sweat: 0 }; pts = [[0, 37]]; tt = 0; }
      reset();
      const step = (dt) => {
        const hc = Math.max(3.1, 8.3 * Math.pow(V.v, 0.6)), water = V.med === 'water';
        const Kse = water ? A * 200 : A * (hc + 4.7) / (1 + (hc + 4.7) * 0.155 * V.clo);
        const dTc = s.Tc - 37;
        const Kcs = clamp((14 + 90 * dTc) * V.fat, (water ? 22 : 8) * V.fat, 90);
        const shiv = clamp(-dTc - 0.3, 0, 3) * 150, shCap = clamp((s.Tc - 31) / 4, 0, 1) * 400;
        const sh = Math.min(shiv, shCap);
        const sweat = Math.min(clamp(dTc - 0.1, 0, 3) * 350, 1000);
        const pSk = W.vapourPressure(s.Ts) / 1000, pA = V.RH / 100 * W.vapourPressure(V.Ta) / 1000;
        const Emax = water ? 0 : 16.5 * hc * A * Math.max(0, pSk - pA) / (1 + 0.7 * V.clo);
        const E = Math.min(sweat + 15, Emax);
        const Ts = (Kcs * s.Tc + Kse * V.Ta - E) / (Kcs + Kse);
        s.Ts = Ts; s.dry = Kcs * (s.Tc - Ts); s.E = E; s.sh = sh; s.sweat = sweat + 15;
        s.Tc += (V.M + sh - s.dry) / CB * dt;
        s.Tc = clamp(s.Tc, 20, 46);
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const simS = Math.min(dt, 0.05) * V.speed * 60, n = Math.max(1, Math.ceil(simS / 5));
        for (let i = 0; i < n; i++) step(simS / n);
        tt += simS;
        if (!pts.length || tt / 60 - pts[pts.length - 1][0] > 0.5) pts.push([tt / 60, s.Tc]);
        if (pts.length > 1500) pts = pts.filter((p, i) => i % 2 === 0);
        /* ---- the figure */
        const cx = Wd * 0.36, top = 22, hb = Hh - 40;
        c.fillStyle = V.med === 'water' ? 'rgba(70,150,235,0.28)' : C.bg2;
        if (V.med === 'water') c.fillRect(0, top + 46, Wd, Hh);
        const skin = hot((s.Ts - 12) / 30), core = hot((s.Tc - 30) / 14);
        c.fillStyle = skin; c.beginPath(); c.arc(cx, top + 16, 15, 0, TAU); c.fill();
        c.fillRect(cx - 22, top + 34, 44, hb * 0.45);
        c.fillRect(cx - 40, top + 36, 14, hb * 0.38); c.fillRect(cx + 26, top + 36, 14, hb * 0.38);
        c.fillRect(cx - 21, top + 34 + hb * 0.45, 18, hb * 0.42); c.fillRect(cx + 3, top + 34 + hb * 0.45, 18, hb * 0.42);
        c.fillStyle = core; c.beginPath(); c.ellipse(cx, top + 34 + hb * 0.22, 14, hb * 0.18, 0, 0, TAU); c.fill();
        kit.label(c, 'core ' + s.Tc.toFixed(1) + ' °C', cx, top + 34 + hb * 0.22, { align: 'center', baseline: 'middle', size: 11.5, color: '#fff', weight: 700 });
        // the heat flows as arrows scaled by watts
        const aw = w => clamp(1.2 + w / 220, 1.2, 8);
        kit.arrow(c, cx - 110, top + 60, cx - 52, top + 60, C.warn, aw(V.M));
        kit.label(c, 'made: ' + Math.round(V.M) + ' W', cx - 110, top + 46, { size: 11.5, color: C.warn, weight: 650 });
        if (s.sh > 3) { kit.arrow(c, cx - 110, top + 100, cx - 52, top + 100, C.series[1], aw(s.sh)); kit.label(c, 'shivering: ' + Math.round(s.sh) + ' W', cx - 110, top + 86, { size: 11.5, color: C.series[1], weight: 650 }); }
        kit.arrow(c, cx + 52, top + 120, cx + 120, top + 120, C.bad, aw(Math.max(0, s.dry)));
        kit.label(c, 'to the surroundings: ' + Math.round(s.dry) + ' W', cx + 52, top + 106, { size: 11.5, color: C.bad, weight: 650 });
        if (s.E > 20) { kit.arrow(c, cx + 52, top + 60, cx + 120, top + 40, C.accent, aw(s.E)); kit.label(c, 'sweat evaporating: ' + Math.round(s.E) + ' W', cx + 52, top + 26, { size: 11.5, color: C.accent, weight: 650 }); }
        kit.label(c, 'skin ' + s.Ts.toFixed(1) + ' °C', cx, Hh - 12, { align: 'center', size: 11.5, color: C.muted });
        const hrs = tt / 3600;
        kit.label(c, hrs < 1 ? Math.round(tt / 60) + ' min' : hrs.toFixed(1) + ' h', Wd - 10, 16, { align: 'right', size: 12.5, weight: 650 });
        plot.set({ series: [{ pts, color: C.bad, width: 2.5 }], x: { label: 'time (minutes)', min: 0, max: Math.max(30, tt / 60) }, y: { label: 'core temperature (°C)', min: 30, max: 44 }, hlines: [{ y: 35, label: 'hypothermia below 35' }, { y: 40, label: 'heat stroke above 40' }], marks: [], vlines: [] });
        const T = s.Tc, state = T < 32 ? 'severely hypothermic' : T < 35 ? 'hypothermic' : T < 36.4 ? 'cool, shivering' : T < 37.5 ? 'normal' : T < 38.5 ? 'warm, as in exercise' : T < 40 ? 'hyperthermic' : T < 42 ? 'in the heat-stroke range' : 'at dangerous temperature';
        ro.set('Tc', T.toFixed(2) + ' °C');
        ro.set('Ts', s.Ts.toFixed(1) + ' °C');
        ro.set('dry', Math.round(s.dry) + ' W');
        ro.set('ev', Math.round(s.E) + ' W');
        ro.set('sh', Math.round(s.sh) + ' W');
        ro.set('sw', (s.sweat / W.latentVaporisation(35) * 3600).toFixed(2) + ' · ' + (s.E / W.latentVaporisation(35) * 3600).toFixed(2) + ' L/h');
        ro.set('state', state);
      }, box.stage);
      loop.start();
    }
  });
})();
