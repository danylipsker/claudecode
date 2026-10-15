/* HYPER-WATER · sims/water-for-people.js — simulations for the topic Water for people.
 *   us-water-balance       a day's water in and out, the thirst loop, and the sodium of a body that drinks too fast
 *   us-treatment-train     screens to disinfection: turbidity and log removal of four organisms per stage (schematic)
 *   us-reverse-osmosis     recovery, brine, applied pressure and energy per cubic metre beside the thermodynamic floor
 *   us-neutron-moderation  Monte Carlo: neutrons slowing in light water, heavy water (any purity) and graphite
 *   us-water-units         the water-based definitions: kilogram, litre, degree, calorie, against the engine's numbers
 *   us-resistivity         resistivity of water with a trace of ions, the temperature and the carbon dioxide of the air
 *   us-cooking-time        boiling point and cooking time against altitude, a pressure cooker and salt
 *   us-solvents            five criteria for six candidate liquids; a "follow the water" decision tree for ten worlds
 *   us-meal-footprint      build a meal and see its green, blue and grey water
 * Numbers that the water engine (kit.water) can give are taken from it; the cooking, treatment and moderation models
 * are local and schematic, said so in each blurb.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const num = (v, d) => Number.isFinite(v) ? v : (d == null ? 0 : d);
  /* a small seeded generator so that Monte Carlo pictures do not jump when a control moves */
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  /* a stacked column drawn upwards from y0; segs = [{ v, color, label }]; returns the top y */
  function column(kit, c, x, y0, w, scale, segs, C, size) {
    let y = y0;
    for (const s of segs) {
      const h = Math.max(0, s.v * scale);
      if (h <= 0.4) continue;
      c.fillStyle = s.color; c.fillRect(x, y - h, w, h);
      c.strokeStyle = C.bg2; c.lineWidth = 1; c.strokeRect(x + 0.5, y - h + 0.5, w - 1, h - 1);
      if (h >= 15 && s.label) kit.label(c, s.label, x + w / 2, y - h / 2, { size: size || 11, color: '#fff', align: 'center', weight: 600 });
      y -= h;
    }
    return y;
  }

  /* ================================================================ 1. the water balance and the thirst loop */
  Hyper.sim('us-water-balance', {
    title: 'A day of water: in, out, and the thirst that watches',
    blurb: `**A day's budget.** Left, the water that arrives (drinks, the moisture in food, water made by metabolism); right, the water that leaves (urine, skin, breath, sweat, gut). The kidney is the adjustable part: give it more than it needs and it passes the surplus, give it less and it cuts urine to its minimum of about half a litre, after which the body starts to run a deficit. The gauge shows what the brain's sensors see: the blood's osmolality, which rises as the water falls.

**Try this**
- Leave the settings at their defaults: a balanced day, 2.5 litres each way.
- Raise the temperature to 38 °C and add two hours of hard exercise: the sweat can pass 2 litres. Press *Drink only as thirst asks* and see how far behind the thirst lets a healthy adult fall (about 1 % of body mass) and how far an older adult with a blunted response (about 3 %).
- Switch to *Drinking too fast*: six litres in two hours, with the kidney able to pass at most 0.9 L an hour. Watch the sodium fall below 135 mmol/L. Tick the hormone box (as in a hard race) and the kidney's limit drops to 0.2 L/h.

A simplified one-pool model of a 70 kg person (42 L of body water, 140 mmol/L sodium): it explains a pattern and does not give advice.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '6px 10px 10px'; box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'time (h)', min: 0, max: 12 }, y: { label: 'serum sodium (mmol/L)', min: 110, max: 145 } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Question', options: [['A day\'s budget', 'day'], ['Drinking too fast', 'fast']], value: params.mode || 'day' },
        { id: 'T', label: 'Air temperature', min: 5, max: 42, step: 1, value: 20, unit: '°C' },
        { id: 'ex', label: 'Hard exercise', min: 0, max: 4, step: 0.25, value: 0, unit: 'h' },
        { id: 'food', type: 'select', label: 'Diet', options: [['Dry food: 0.4 L of water', 0.4], ['Typical: 0.7 L', 0.7], ['Fruit and vegetables: 1.2 L', 1.2]], value: 0.7 },
        { id: 'age', type: 'select', label: 'Thirst response', options: [['Healthy adult', 295], ['Older adult, blunted', 305]], value: 295 },
        { id: 'drink', label: 'Drinks taken', min: 0, max: 6, step: 0.1, value: 1.5, unit: 'L' },
        { type: 'buttons', items: [{ id: 'thirst', label: 'Drink only as thirst asks', primary: true }] },
        { id: 'V', label: 'Water drunk', min: 0, max: 12, step: 0.5, value: 6, unit: 'L' },
        { id: 'hrs', label: 'Drunk over', min: 0.5, max: 8, step: 0.5, value: 2, unit: 'h' },
        { id: 'adh', type: 'check', label: 'Hormone is holding back urine (hard race, illness)', value: false }
      ], (id) => {
        if (id === 'mode') layout();
        if (id === 'thirst') {
          const d = dayModel(ctl.values), b = 42 * (290 / ctl.values.age - 1), avail = 0.5 + b;
          ctl.set('drink', clamp(Math.round((avail + d.fixedOut - d.food - d.meta) * 10) / 10, 0, 6), false);
        }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Water in'], ['b', 'Water out'], ['c', 'Balance'], ['d', 'Blood osmolality'], ['e', 'Body mass lost']]);
      const DAYC = ['drink', 'T', 'ex', 'food', 'age'], FASTC = ['V', 'hrs', 'adh'];
      function layout() {
        const day = V.mode === 'day';
        for (const id of DAYC) ctl.show(id, day);
        ctl.show('thirst', day);
        for (const id of FASTC) ctl.show(id, !day);
        gdiv.style.display = day ? 'none' : '';
        if (day) { ro.show('a', true); ro.show('b', true); ro.show('c', true); ro.show('d', true); ro.show('e', true); }
        else { ro.show('a', true); ro.show('b', true); ro.show('c', true); ro.show('d', true); ro.show('e', true); }
      }
      /* one day: litres; the kidney passes any surplus but cannot make less than about 0.5 L of urine */
      function dayModel(v) {
        const T = v.T, ex = v.ex;
        const skin = 0.45, breath = 0.35 + 0.1 * ex, faeces = 0.1;
        const sweat = 0.1 + 0.04 * Math.max(0, T - 20) + ex * (0.4 + 0.04 * Math.max(0, T - 10));
        const food = v.food, meta = 0.3 * (1 + 0.15 * ex);
        const fixedOut = skin + breath + faeces + sweat;
        const avail = v.drink + food + meta - fixedOut;
        const urine = Math.max(0.5, avail);
        return { skin, breath, faeces, sweat, food, meta, drink: v.drink, urine, fixedOut, bal: avail - urine };
      }
      /* the sodium of a body that takes in water faster than the kidney can clear it (one pool of 42 L) */
      function fastModel(v) {
        const pts = [], dt = 0.01, cap = v.adh ? 0.2 : 0.9, Na = 140 * 42;
        let vol = 42, below = 0, minNa = 140, maxX = 0;
        for (let t = 0; t <= 12.0001; t += dt) {
          const na = Na / vol;
          if (Math.round(t / dt) % 10 === 0) pts.push([t, na]);
          if (na < minNa) minNa = na;
          if (na < 135) below += dt;
          maxX = Math.max(maxX, vol - 42);
          const rin = t < v.hrs ? v.V / v.hrs : 0;
          const rout = clamp((vol - 42) * 50, 0, cap);
          vol += (rin - rout) * dt;
        }
        return { pts, minNa, below, maxX, cap };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.mode === 'day') {
          const d = dayModel(V);
          const inn = d.drink + d.food + d.meta, out = d.urine + d.fixedOut;
          const osm = 290 * 42 / (42 + d.bal);
          const top = 34, base = Hh - 34, scale = (base - top) / Math.max(3.6, Math.max(inn, out) * 1.05);
          const cw = Math.min(90, Wd * 0.17), x1 = Wd * 0.08, x2 = x1 + cw + Wd * 0.1;
          kit.label(c, 'IN', x1 + cw / 2, 16, { align: 'center', weight: 700, color: C.muted });
          kit.label(c, 'OUT', x2 + cw / 2, 16, { align: 'center', weight: 700, color: C.muted });
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x1 - 8, base + 0.5); c.lineTo(x2 + cw + 8, base + 0.5); c.stroke();
          column(kit, c, x1, base, cw, scale, [{ v: d.drink, color: C.accent, label: 'drinks ' + d.drink.toFixed(1) }, { v: d.food, color: C.series[1] || C.ok, label: 'food ' + d.food.toFixed(1) }, { v: d.meta, color: C.series[4] || C.warn, label: 'metabolic ' + d.meta.toFixed(1) }], C);
          column(kit, c, x2, base, cw, scale, [{ v: d.urine, color: C.warn, label: 'urine ' + d.urine.toFixed(1) }, { v: d.skin, color: C.series[2] || C.muted, label: 'skin' }, { v: d.breath, color: C.series[3] || C.muted, label: 'breath' }, { v: d.sweat, color: C.bad, label: 'sweat ' + d.sweat.toFixed(1) }, { v: d.faeces, color: C.faint, label: '' }], C, 10.5);
          if (d.bal < -0.005) {
            const yTop = base - inn * scale, h = -d.bal * scale;
            c.save(); c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.lineWidth = 1.5; c.strokeRect(x1 + 0.5, yTop - h + 0.5, cw - 1, h - 1); c.restore();
            kit.label(c, 'missing ' + (-d.bal).toFixed(2) + ' L', x1 + cw / 2, yTop - h - 9, { align: 'center', color: C.bad, size: 11.5, weight: 600 });
          }
          kit.label(c, inn.toFixed(2) + ' L', x1 + cw / 2, base + 14, { align: 'center', weight: 600 });
          kit.label(c, out.toFixed(2) + ' L', x2 + cw / 2, base + 14, { align: 'center', weight: 600 });
          // the osmolality gauge
          const gx = x2 + cw + Wd * 0.1, gw = Wd - gx - 16, gy = top + 30, gh = 22;
          if (gw > 60) {
            const lo = 280, hi = 315, px = v => gx + (v - lo) / (hi - lo) * gw;
            c.fillStyle = 'rgba(80,190,120,0.35)'; c.fillRect(px(lo), gy, px(295) - px(lo), gh);
            c.fillStyle = 'rgba(240,190,70,0.4)'; c.fillRect(px(295), gy, px(305) - px(295), gh);
            c.fillStyle = 'rgba(230,90,80,0.4)'; c.fillRect(px(305), gy, px(hi) - px(305), gh);
            c.strokeStyle = C.axis; c.strokeRect(gx + 0.5, gy + 0.5, gw - 1, gh - 1);
            const nx = clamp(px(osm), gx, gx + gw);
            c.fillStyle = C.text; c.beginPath(); c.moveTo(nx, gy + gh + 2); c.lineTo(nx - 6, gy + gh + 12); c.lineTo(nx + 6, gy + gh + 12); c.fill();
            kit.label(c, 'blood osmolality, mOsm/kg', gx, gy - 12, { size: 11.5, color: C.muted });
            kit.label(c, '280', px(280), gy + gh + 24, { size: 11, color: C.muted, align: 'center' });
            kit.label(c, '295 thirst', px(295), gy + gh + 24, { size: 11, color: C.muted, align: 'center' });
            kit.label(c, '305', px(305), gy + gh + 24, { size: 11, color: C.muted, align: 'center' });
            kit.label(c, osm.toFixed(1), nx, gy + gh + 38, { size: 12.5, weight: 700, align: 'center' });
            const thr = V.age;
            kit.label(c, thr > 300 ? 'blunted: thirst starts near ' + thr : 'thirst starts near ' + thr, gx, gy + gh + 62, { size: 11.5, color: C.muted });
            kit.label(c, osm >= thr ? 'thirst: the brain asks for a drink' : 'no thirst', gx, gy + gh + 80, { size: 12, color: osm >= thr ? C.warn : C.ok, weight: 600 });
          }
          ro.set('a', inn.toFixed(2) + ' L');
          ro.set('b', out.toFixed(2) + ' L (urine ' + d.urine.toFixed(2) + ')');
          ro.set('c', (d.bal >= -0.005 ? 'level (the kidney passes the surplus)' : (d.bal.toFixed(2) + ' L')));
          ro.set('d', osm.toFixed(1) + ' mOsm/kg');
          ro.set('e', (d.bal < 0 ? (-d.bal / 70 * 100).toFixed(1) + ' % of 70 kg' : '0 %'));
        } else {
          const m = fastModel(V);
          plot.set({ series: [{ pts: m.pts, label: 'serum sodium', color: C.accent }], x: { label: 'time (h)', min: 0, max: 12 }, y: { label: 'serum sodium (mmol/L)', min: Math.min(110, Math.floor(m.minNa / 5) * 5), max: 145 }, hlines: [{ y: 135, label: 'below 135: hyponatraemia' }, { y: 125, label: 'severe range' }] });
          // the body as a tank with the extra water in it
          const tx = 30, tw = Math.min(Wd * 0.28, 170), ty = 24, th = Hh - 58;
          const vmax = 42 + Math.max(2, m.maxX * 1.1);
          c.strokeStyle = C.axis; c.lineWidth = 2; c.strokeRect(tx, ty, tw, th);
          c.fillStyle = 'rgba(70,150,235,0.35)'; const h42 = th * 42 / vmax; c.fillRect(tx, ty + th - h42, tw, h42);
          const hx = th * m.maxX / vmax; c.fillStyle = 'rgba(230,90,80,0.45)'; c.fillRect(tx, ty + th - h42 - hx, tw, hx);
          kit.label(c, '42 L of body water', tx + tw / 2, ty + th - h42 / 2, { align: 'center', size: 11.5 });
          kit.label(c, '+' + m.maxX.toFixed(1) + ' L at the peak', tx + tw / 2, ty + th - h42 - hx / 2 - (hx < 14 ? 12 : 0), { align: 'center', size: 11.5, color: C.bad, weight: 600 });
          const ax = tx + tw + 26;
          kit.label(c, 'in: ' + (V.V / V.hrs).toFixed(1) + ' L/h for ' + V.hrs + ' h', ax, ty + 14, { size: 12.5, weight: 600, color: C.accent });
          kit.label(c, 'kidney can clear at most ' + m.cap.toFixed(1) + ' L/h', ax, ty + 36, { size: 12.5, weight: 600, color: C.warn });
          kit.label(c, V.V / V.hrs > m.cap ? 'faster than the kidney: water piles up' : 'within the kidney\'s capacity', ax, ty + 62, { size: 12, color: V.V / V.hrs > m.cap ? C.bad : C.ok });
          kit.label(c, 'sodium = 5,880 mmol shared among the water', ax, ty + 94, { size: 11.5, color: C.muted });
          ro.set('a', V.V.toFixed(1) + ' L in ' + V.hrs + ' h');
          ro.set('b', 'at most ' + m.cap.toFixed(1) + ' L/h');
          ro.set('c', '+' + m.maxX.toFixed(1) + ' L at the peak');
          ro.set('d', 'lowest sodium ' + m.minNa.toFixed(1) + ' mmol/L');
          ro.set('e', m.below > 0.005 ? m.below.toFixed(1) + ' h below 135' : 'never below 135');
        }
      }, box.stage);
      layout();
      loop.start();
    }
  });

  /* ================================================================ 2. the treatment train */
  Hyper.sim('us-treatment-train', {
    title: 'From river to tap: the treatment train',
    blurb: `Water enters at the left as a cloudy river and passes four barriers: coagulation and settling, a sand filter, chlorine and (if you choose) ultraviolet light. The flasks show the turbidity at each stage in NTU. The bars at the bottom give the *log removal* of four organisms: blue from the physical steps, green from chlorine, purple from UV. The ticks are the targets of the US rules: 3 log for *Giardia*, 4 log for viruses and 2 log for *Cryptosporidium*.

**Try this**
- With the defaults every target is met. Set the alum to zero: the filter is flooded with cloud and the physical removal collapses.
- Raise the alum far above the optimum: over-dosing also fails (the particles take on charge again).
- Cool the water to 2 °C, or raise the pH to 8.5: the same chlorine kills *Giardia* much less. The CT value is the product of concentration and time, but temperature and pH change what a CT is worth.
- Find the lowest chlorine dose that still meets the viruses and *Giardia* targets. Then try to meet *Cryptosporidium* with chlorine alone and add UV: 12 mJ/cm² is enough for 3 log.

A schematic model: the shapes (optimum dose, settling, CT and UV law) follow the textbook ones; the numbers are tuned to typical values (EPA log credits, Chick–Watson constants) and are not a design tool.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'turb', label: 'Raw water turbidity', min: 1, max: 1000, value: params.turb || 30, unit: 'NTU', log: true, sig: 2 },
        { id: 'temp', label: 'Water temperature', min: 1, max: 30, step: 1, value: 10, unit: '°C' },
        { id: 'alum', label: 'Alum (coagulant) dose', min: 0, max: 80, step: 1, value: 20, unit: 'mg/L' },
        { id: 'settle', label: 'Settling time', min: 0.5, max: 4, step: 0.25, value: 2, unit: 'h' },
        { id: 'rate', label: 'Sand filter rate', min: 2, max: 20, step: 1, value: 8, unit: 'm/h' },
        { id: 'cl', label: 'Chlorine dose', min: 0, max: 4, step: 0.1, value: 1.5, unit: 'mg/L' },
        { id: 'ct', label: 'Contact time', min: 5, max: 120, step: 5, value: 30, unit: 'min' },
        { id: 'ph', label: 'pH', min: 6, max: 9, step: 0.1, value: 7.5 },
        { id: 'uv', label: 'UV dose', min: 0, max: 80, step: 1, value: params.uv || 0, unit: 'mJ/cm²' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T1', 'After settling'], ['T2', 'After the sand filter'], ['ct', 'CT value'], ['hocl', 'Chlorine as HOCl'], ['verdict', 'Targets']]);
      const ORG = [['E. coli (bacterium)', 'ecoli', null], ['Virus', 'virus', 4], ['Giardia cysts', 'giardia', 3], ['Cryptosporidium', 'crypto', 2]];
      const CREDIT = { ecoli: 3, virus: 2, giardia: 2.5, crypto: 2 };       // log credit of conventional filtration (EPA)
      const KCL = { ecoli: 20, virus: 0.67, giardia: 0.035, crypto: 0.00014 };   // L/(mg·min) at 10 °C, pH 7 (HOCl share 0.76)
      const KUV = { ecoli: 0.4, virus: 0.0215, giardia: 0.27, crypto: 0.25 };    // log per mJ/cm²
      function model() {
        const Dopt = 8 + 6 * Math.log10(V.turb);
        let ec = Math.exp(-Math.pow((V.alum - Dopt) / (0.8 * Dopt), 2));
        ec *= 0.6 + 0.4 * Math.min(1, V.temp / 15);                 // cold water flocculates slowly
        const settle = 1 - Math.exp(-V.settle / 0.8);
        const T0 = V.turb, T1 = Math.max(0.2, T0 * (1 - Math.min(0.99, (0.05 + 0.97 * ec) * settle)));
        const f = 0.015 + 0.003 * V.rate + 0.35 * (1 - ec);
        const T2 = Math.max(0.05, T1 * Math.min(1, f));
        const q = clamp(1 - 0.9 * Math.log10(Math.max(T2, 0.3) / 0.3), 0.1, 1);
        const resid = Math.max(0, V.cl - 0.4 - 0.15 * T2);
        const fH = 1 / (1 + Math.pow(10, V.ph - 7.5)), tf = Math.pow(2, (V.temp - 10) / 10);
        const CT = resid * V.ct, out = {};
        for (const [, k] of ORG) {
          const phys = CREDIT[k] * q, chl = Math.min(8, KCL[k] * (fH / 0.76) * tf * CT), uv = Math.min(6, KUV[k] * V.uv / (1 + 0.1 * T2));
          out[k] = { phys, chl, uv, tot: phys + chl + uv };
        }
        return { Dopt, ec, T0, T1, T2, CT, fH, resid, out };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H, m = model();
        // the four flasks
        const names = ['Raw river', 'After settling', 'After the filter', 'Disinfected'];
        const vals = [m.T0, m.T1, m.T2, m.T2];
        const n = 4, pad = 14, cw = (Wd - pad * 2) / n;
        for (let i = 0; i < n; i++) {
          const x = pad + i * cw, fw = Math.min(cw - 34, 90), fx = x + (cw - fw) / 2, fy = 30, fh = Hh * 0.30;
          const a = clamp(Math.log10(vals[i] + 1) / 3, 0.02, 0.85);
          c.fillStyle = 'rgba(150,120,70,' + a.toFixed(3) + ')'; c.fillRect(fx, fy, fw, fh);
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.strokeRect(fx, fy, fw, fh);
          kit.label(c, names[i], x + cw / 2, 14, { size: 12, align: 'center', weight: 600 });
          kit.label(c, i === 3 ? 'same, now safe' : kit.fmt(vals[i], 2) + ' NTU', x + cw / 2, fy + fh + 14, { size: 12.5, align: 'center', color: i === 3 ? C.ok : C.text, weight: 600 });
          if (i < n - 1) kit.arrow(c, x + cw - 14, fy + fh / 2, x + cw + 6, fy + fh / 2, C.muted, 2);
        }
        const labs = ['coagulation · settling', 'sand filter', 'chlorine · UV'];
        for (let i = 0; i < 3; i++) kit.label(c, labs[i], pad + (i + 1) * cw, 30 + Hh * 0.30 + 34, { size: 11, align: 'center', color: C.muted });
        // the log-removal bars
        const by = Hh * 0.30 + 100, bx = Math.min(150, Wd * 0.26), bw = Wd - bx - 30, rowH = Math.max(24, (Hh - by - 30) / 4), maxL = 8;
        kit.label(c, 'log removal (each log = 90 % of what is left)', bx, by - 14, { size: 11.5, color: C.muted });
        let ok = true;
        ORG.forEach(([nm, k, target], i) => {
          const y = by + i * rowH, o = m.out[k], s = bw / maxL;
          let x = bx;
          for (const [v, col] of [[o.phys, C.accent], [o.chl, C.ok], [o.uv, C.series[3] || C.warn]]) {
            const w = Math.max(0, Math.min(maxL, v) * s - (x - bx > 0 ? 0 : 0));
            const ww = Math.min(w, bx + bw - x);
            if (ww > 0.5) { c.fillStyle = col; c.fillRect(x, y, ww, rowH * 0.55); x += ww; }
          }
          kit.label(c, nm, bx - 8, y + rowH * 0.27, { align: 'right', size: 12 });
          kit.label(c, o.tot.toFixed(1), Math.min(x + 6, bx + bw - 22), y + rowH * 0.27, { size: 11.5, color: C.text, weight: 600 });
          if (target) {
            const tx = bx + target * s;
            c.strokeStyle = o.tot >= target ? C.ok : C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(tx, y - 3); c.lineTo(tx, y + rowH * 0.55 + 3); c.stroke();
            kit.label(c, 'target ' + target, tx + 4, y + rowH * 0.55 + 10, { size: 10.5, color: o.tot >= target ? C.ok : C.bad });
            if (o.tot < target) ok = false;
          }
        });
        const key = [['physical', C.accent], ['chlorine', C.ok], ['UV', C.series[3] || C.warn]];
        key.forEach(([t, col], i) => { c.fillStyle = col; c.fillRect(bx + i * 86, Hh - 14, 10, 10); kit.label(c, t, bx + i * 86 + 14, Hh - 9, { size: 11, color: C.muted }); });
        ro.set('T1', kit.fmt(m.T1, 2) + ' NTU (optimum alum about ' + m.Dopt.toFixed(0) + ' mg/L)');
        ro.set('T2', kit.fmt(m.T2, 2) + ' NTU' + (m.T2 <= 0.3 ? ' (meets 0.3)' : ' (above 0.3: filter credit reduced)'));
        ro.set('ct', m.CT.toFixed(1) + ' mg·min/L (residual ' + m.resid.toFixed(2) + ' mg/L)');
        ro.set('hocl', (m.fH * 100).toFixed(0) + ' % at pH ' + V.ph.toFixed(1));
        ro.set('verdict', ok ? 'all three met' : 'not all met');
      }, box.stage);
      loop.once();
      loop.start();
    }
  });

  /* ================================================================ 3. reverse osmosis */
  Hyper.sim('us-reverse-osmosis', {
    title: 'Squeezing fresh water out of the sea',
    blurb: `A sea-water membrane vessel, feed entering at the left. As water crosses the membrane the brine left behind gets saltier, so the osmotic pressure the membrane has to beat rises from the feed's 27 bar to the brine's value at the outlet. The green line is the pressure the pump applies; the shaded gap is the pressure left over to drive water through; the dotted line is the osmotic pressure along the vessel. The bars compare the energy per cubic metre of fresh water with the thermodynamic floor.

**Try this**
- Raise the recovery from 30 % to 70 %: the brine's osmotic pressure climbs towards the membrane's rating of 83 bar (the bar turns red), and the energy follows.
- Turn the energy recovery down to 0: the pump energy more than doubles.
- Lower the feed salinity to a brackish 5 g/L: the energy falls to a fraction. Raise it to 45 (the Gulf): the plant needs more pressure for the same recovery.
- The floor (the dashed curve in the graph) rises with recovery too, but much more slowly than a real plant's energy. Why is the gap the *driving pressure* and the pump losses?

The osmotic pressure comes from the van 't Hoff relation using 1.1 osmol/L at 35 g/kg; the plant overhead (intake, pretreatment, post-treatment) is a fixed 0.8 kWh/m³ added to the pump energy; perfect salt rejection assumed.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '6px 10px 10px'; box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'recovery (%)', min: 20, max: 80 }, y: { label: 'kWh per m³ of fresh water', min: 0 }, legend: true }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'S', label: 'Feed salinity', min: 3, max: 50, step: 1, value: params.S || 35, unit: 'g/kg' },
        { id: 'T', label: 'Feed temperature', min: 5, max: 40, step: 1, value: 25, unit: '°C' },
        { id: 'r', label: 'Recovery', min: 20, max: 80, step: 1, value: 45, unit: '%' },
        { id: 'dp', label: 'Pressure above the brine\'s osmotic pressure', min: 2, max: 20, step: 1, value: 6, unit: 'bar' },
        { id: 'eta', label: 'Pump efficiency', min: 60, max: 95, step: 1, value: 85, unit: '%' },
        { id: 'eps', label: 'Energy recovery (brine to feed)', min: 0, max: 98, step: 1, value: 95, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pi0', 'Osmotic pressure of the feed'], ['pib', 'Osmotic pressure of the brine'], ['p', 'Feed pressure'], ['E', 'Pump energy per m³'], ['Etot', 'Whole plant (+0.8 overhead)'], ['Emin', 'Thermodynamic floor'], ['ratio', 'Plant ÷ floor']]);
      const OVER = 0.8, LIMIT = 83;
      function calc(S, T, r, dp, eta, eps) {
        const pi0 = W.osmoticPressure(1.1 * S / 35, 1, T + 273.15) / 1e5;
        const pib = pi0 / (1 - r), p = pib + dp;
        const E = p / (36 * eta * r) * (1 - eps * (1 - r));
        const Emin = pi0 / 36 * (-Math.log(1 - r)) / r;
        return { pi0, pib, p, E, Emin };
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const r = V.r / 100, eta = V.eta / 100, eps = V.eps / 100;
        const m = calc(V.S, V.T, r, V.dp, eta, eps);
        // the vessel
        const vx = 28, vw = Wd * 0.60, vy = Hh * 0.18, vh = Hh * 0.30;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.strokeRect(vx, vy, vw, vh);
        const nseg = 24;
        for (let i = 0; i < nseg; i++) {
          const x0 = vx + i * vw / nseg, cf = 1 / (1 - r * (i + 0.5) / nseg);        // concentration factor along the vessel
          const a = clamp(0.10 + 0.55 * (cf - 1) / (1 / (1 - 0.8) - 1) + 0.15 * (V.S / 50), 0.05, 0.9);
          c.fillStyle = 'rgba(40,110,200,' + a.toFixed(3) + ')'; c.fillRect(x0 + 1, vy + 1, vw / nseg, vh * 0.78);
        }
        c.fillStyle = C.grid; c.fillRect(vx, vy + vh * 0.78 + 1, vw, vh * 0.22 - 1);       // the membrane and permeate channel
        kit.label(c, 'membrane', vx + vw / 2, vy + vh * 0.89, { size: 11, align: 'center', color: C.muted });
        // permeate drops
        for (let i = 0; i < 14; i++) {
          const ph = ((t * 0.7 + i * 0.37) % 1), x = vx + (i + 0.5) * vw / 14, a = 1 - 0.8 * (i / 14);
          const y = vy + vh * 0.8 + ph * (vh * 0.9);
          c.fillStyle = 'rgba(120,200,255,' + (0.9 * a * (1 - ph)).toFixed(2) + ')'; c.beginPath(); c.arc(x, y, 2.4, 0, TAU); c.fill();
        }
        kit.arrow(c, vx - 24, vy + vh * 0.4, vx - 2, vy + vh * 0.4, C.accent, 2.5);
        kit.label(c, 'feed ' + V.S + ' g/kg', vx - 4, vy - 10, { size: 11.5, color: C.muted });
        kit.arrow(c, vx + vw + 2, vy + vh * 0.4, vx + vw + 28, vy + vh * 0.4, C.warn, 2.5);
        kit.label(c, 'brine ' + (V.S / (1 - r)).toFixed(0) + ' g/kg', vx + vw - 4, vy - 10, { size: 11.5, color: C.warn, align: 'right' });
        kit.label(c, 'fresh water ' + V.r + ' % of the feed', vx + vw / 2, vy + vh + 24, { size: 11.5, color: C.accent, align: 'center' });
        // the pressure profile
        const py0 = Hh - 22, pyh = Hh * 0.30, pmax = Math.max(90, m.p * 1.1), sc = pyh / pmax, N = 40;
        c.beginPath(); c.moveTo(vx, py0);
        for (let i = 0; i <= N; i++) { const f = i / N, pi = m.pi0 / (1 - r * f); c.lineTo(vx + f * vw, py0 - pi * sc); }
        c.lineTo(vx + vw, py0 - m.p * sc); c.lineTo(vx, py0 - m.p * sc); c.closePath(); c.fillStyle = 'rgba(230,170,60,0.25)'; c.fill();
        c.beginPath(); for (let i = 0; i <= N; i++) { const f = i / N, pi = m.pi0 / (1 - r * f); i ? c.lineTo(vx + f * vw, py0 - pi * sc) : c.moveTo(vx, py0 - pi * sc); }
        c.setLineDash([3, 3]); c.strokeStyle = C.warn; c.lineWidth = 2; c.stroke(); c.setLineDash([]);
        c.strokeStyle = m.p > LIMIT ? C.bad : C.ok; c.lineWidth = 2.5; c.beginPath(); c.moveTo(vx, py0 - m.p * sc); c.lineTo(vx + vw, py0 - m.p * sc); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(vx, py0 - LIMIT * sc); c.lineTo(vx + vw, py0 - LIMIT * sc); c.stroke(); c.setLineDash([]);
        kit.label(c, 'membrane rating 83 bar', vx + vw, py0 - LIMIT * sc - 8, { size: 10.5, color: C.faint, align: 'right' });
        kit.label(c, 'applied ' + m.p.toFixed(0) + ' bar', vx + 4, py0 - m.p * sc - 9, { size: 11.5, color: m.p > LIMIT ? C.bad : C.ok, weight: 600 });
        kit.label(c, 'osmotic pressure ' + m.pi0.toFixed(0) + ' → ' + m.pib.toFixed(0) + ' bar', vx + vw * 0.5, py0 - (m.pi0 / (1 - r * 0.5)) * sc + 16, { size: 11.5, color: C.warn });
        kit.label(c, 'excess = the driving pressure', vx + 4, py0 - (m.p + m.pi0) / 2 * sc - 0, { size: 10.5, color: C.muted });
        // the energy bars on the right
        const bx = vx + vw + 60, bw = Wd - bx - 12, items = [['floor', m.Emin, C.ok], ['plant', m.E + OVER, C.accent], ['no recovery', calc(V.S, V.T, r, V.dp, eta, 0).E + OVER, C.warn], ['thermal', 12, C.bad]];
        if (bw > 40) {
          const mx = 16, rowH = (Hh * 0.62) / items.length, by = Hh * 0.18;
          kit.label(c, 'kWh per m³', bx, by - 12, { size: 11, color: C.muted });
          items.forEach(([nm, v, col], i) => {
            const y = by + i * rowH + 6, w = clamp(v / mx, 0, 1) * bw;
            c.fillStyle = col; c.fillRect(bx, y, w, rowH * 0.5);
            kit.label(c, nm + ' ' + v.toFixed(1), bx, y + rowH * 0.5 + 10, { size: 10.5, color: C.muted });
          });
        }
        // the energy curves
        const f1 = [], f2 = [], f3 = [];
        for (let rr = 25; rr <= 75; rr += 2.5) {
          const q = rr / 100, a = calc(V.S, V.T, q, V.dp, eta, eps), b = calc(V.S, V.T, q, V.dp, eta, 0);
          f1.push([rr, a.Emin]); f2.push([rr, a.E + OVER]); f3.push([rr, b.E + OVER]);
        }
        plot.set({ series: [{ pts: f1, label: 'thermodynamic floor', color: C.ok, dash: true }, { pts: f2, label: 'RO plant with energy recovery', color: C.accent }, { pts: f3, label: 'RO plant, no recovery', color: C.warn }], x: { label: 'recovery (%)', min: 25, max: 75 }, y: { label: 'kWh per m³ of fresh water', min: 0, max: Math.max(6, Math.ceil(f3[0][1] / 2) * 2) }, marks: [{ x: V.r, y: m.E + OVER, label: 'now', color: C.text }] });
        ro.set('pi0', m.pi0.toFixed(1) + ' bar');
        ro.set('pib', m.pib.toFixed(1) + ' bar at recovery ' + V.r + ' %');
        ro.set('p', m.p.toFixed(1) + ' bar' + (m.p > LIMIT ? '  — above the 83 bar rating!' : ''));
        ro.set('E', m.E.toFixed(2) + ' kWh/m³');
        ro.set('Etot', (m.E + OVER).toFixed(2) + ' kWh/m³');
        ro.set('Emin', m.Emin.toFixed(2) + ' kWh/m³');
        ro.set('ratio', ((m.E + OVER) / m.Emin).toFixed(1) + ' ×');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 4. neutrons in a moderator */
  Hyper.sim('us-neutron-moderation', {
    title: 'Neutrons slowing down: light water against heavy water',
    blurb: `Fast neutrons (2 MeV, red) are released at the dot and scatter off the nuclei of the moderator, losing energy at each collision until they are slow (thermal, blue). A track ends when the neutron is captured (a cross) or has slowed below 0.1 eV (a ring). Left: ordinary water. Right: the moderator you choose. The read-outs come from 1,500 neutrons for each side.

**Try this**
- Count the collisions. Hydrogen needs about 18 and the heavier deuterium about 25 (more for the whole molecule with its oxygen); graphite needs over 100 and spreads the neutrons over a much larger volume.
- Watch the crosses. In light water the neutrons are captured by hydrogen as they slow; in heavy water almost none are. That is the whole case for heavy water in a reactor on natural uranium.
- Lower the D₂O purity from 99.75 % to 90 %: the moderating ratio collapses from about 1,900 to about 130, because ordinary hydrogen takes neutrons far more readily. Even 1 % of ordinary hydrogen in heavy water cuts its ratio to about a quarter.

A Monte Carlo of elastic scattering with energy-dependent cross-sections that are simplified (hydrogen 20 b, falling to 3 b at 2 MeV; absorption following 1/v), isotropic scattering in the centre-of-mass frame, and no leakage; the geometry is schematic. The real numbers are in Lamarsh and Baratta.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mod', type: 'select', label: 'Compare light water with', options: [['Heavy water (D₂O)', 'd2o'], ['Graphite', 'c']], value: params.mod || 'd2o' },
        { id: 'pur', label: 'D₂O purity (D among hydrogen atoms)', min: 50, max: 100, step: 0.05, value: 99.75, unit: '%' },
        { type: 'buttons', items: [{ id: 'go', label: 'Release neutrons again', primary: true }] }
      ], (id) => { if (id === 'mod') ctl.show('pur', ctl.values.mod === 'd2o'); if (id === 'go') { seed += 17; } rebuild(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Collisions to slow down (light | other)'], ['cap', 'Captured while slowing (light | other)'], ['rms', 'Distance birth to slow (light | other)'], ['mr', 'Moderating ratio (light | other)'], ['th', 'Collisions at thermal energy before capture']]);
      // cross-sections in barns, tables in eV; log-linear in E
      const SIG = {
        H: [[0.01, 20.4], [1e3, 20.4], [1e5, 11.5], [1e6, 4.2], [2e6, 2.9]],
        D: [[0.01, 3.4], [1e5, 3.4], [1e6, 3.0], [2e6, 2.9]],
        O: [[0.01, 3.8], [1e5, 3.8], [1e6, 2.5], [2e6, 1.6]],
        C: [[0.01, 4.7], [1e5, 4.7], [1e6, 2.6], [2e6, 2.0]]
      };
      const SA = { H: 0.332, D: 0.00052, O: 0.00019, C: 0.0035 }, AM = { H: 1, D: 2, O: 16, C: 12 };
      const ND = { water: 0.03343, d2o: 0.03320, c: 0.0803 };
      function sig(k, E) {
        const t = SIG[k], x = Math.log10(E);
        if (E <= t[0][0]) return t[0][1];
        for (let i = 1; i < t.length; i++) {
          const x0 = Math.log10(t[i - 1][0]), x1 = Math.log10(t[i][0]);
          if (x <= x1) return t[i - 1][1] + (t[i][1] - t[i - 1][1]) * (x - x0) / (x1 - x0);
        }
        return t[t.length - 1][1];
      }
      function medium(kind, pur) {
        if (kind === 'water') return [{ k: 'H', n: 2 * ND.water }, { k: 'O', n: ND.water }];
        if (kind === 'c') return [{ k: 'C', n: ND.c }];
        const p = pur / 100;
        return [{ k: 'D', n: 2 * ND.d2o * p }, { k: 'H', n: 2 * ND.d2o * (1 - p) }, { k: 'O', n: ND.d2o }];
      }
      const alpha = k => Math.pow((AM[k] - 1) / (AM[k] + 1), 2);
      const xiOf = k => { const a = alpha(k); return AM[k] === 1 ? 1 : 1 + a * Math.log(a) / (1 - a); };
      function ratios(med) {
        let ss = 0, xs = 0, sa = 0, sth = 0;
        for (const m of med) { const s = m.n * sig(m.k, 1); ss += s; xs += s * xiOf(m.k); sa += m.n * SA[m.k]; sth += m.n * sig(m.k, 0.0253); }
        return { mr: xs / sa, th: sth / sa };
      }
      function track(med, rnd, keep) {
        let E = 2e6, x = 0, y = 0, z = 0, coll = 0;
        const pts = keep ? [{ x: 0, y: 0, E }] : null;
        for (let i = 0; i < 3000; i++) {
          let ss = 0, sa = 0; const w = [];
          for (const m of med) { const s = m.n * sig(m.k, E); w.push(s); ss += s; sa += m.n * SA[m.k] * Math.sqrt(0.0253 / E); }
          const d = -Math.log(1 - rnd()) / (ss + sa), mu = 2 * rnd() - 1, ph = TAU * rnd(), s = Math.sqrt(1 - mu * mu);
          x += d * s * Math.cos(ph); y += d * s * Math.sin(ph); z += d * mu;
          if (rnd() < sa / (ss + sa)) { if (keep) pts.push({ x, y, E }); return { coll, cap: true, r: Math.sqrt(x * x + y * y + z * z), pts }; }
          let u = rnd() * ss, j = 0; while (j < w.length - 1 && u > w[j]) { u -= w[j]; j++; }
          const a = alpha(med[j].k); E = E * (a + (1 - a) * rnd()); coll++;
          if (keep) pts.push({ x, y, E });
          if (E < 0.1) return { coll, cap: false, r: Math.sqrt(x * x + y * y + z * z), pts };
        }
        return { coll, cap: true, r: 0, pts };
      }
      function stats(med, seed0) {
        const rnd = rng(seed0); let n = 0, c = 0, cap = 0, r2 = 0, th = 0;
        for (let i = 0; i < 1500; i++) { const t = track(med, rnd, false); if (t.cap) cap++; else { th++; c += t.coll; r2 += t.r * t.r; } n++; }
        return { coll: th ? c / th : 0, cap: cap / n, rms: th ? Math.sqrt(r2 / th) : 0 };
      }
      let seed = 11, A = null, B = null, tracksA = [], tracksB = [], prog = 0;
      function rebuild() {
        const mA = medium('water'), mB = medium(V.mod, V.pur);
        const sA = stats(mA, seed), sB = stats(mB, seed + 1), rA = ratios(mA), rB = ratios(mB);
        A = { m: mA, s: sA, r: rA }; B = { m: mB, s: sB, r: rB };
        const r1 = rng(seed + 5), r2 = rng(seed + 6);
        tracksA = []; tracksB = [];
        for (let i = 0; i < 12; i++) { tracksA.push(track(mA, r1, true)); tracksB.push(track(mB, r2, true)); }
        prog = 0;
        ro.set('n', sA.coll.toFixed(0) + '  |  ' + sB.coll.toFixed(0));
        ro.set('cap', (sA.cap * 100).toFixed(1) + ' %  |  ' + (sB.cap * 100).toFixed(2) + ' %');
        ro.set('rms', sA.rms.toFixed(0) + ' cm  |  ' + sB.rms.toFixed(0) + ' cm');
        ro.set('mr', rA.mr.toFixed(0) + '  |  ' + rB.mr.toFixed(0));
        ro.set('th', rA.th.toFixed(0) + '  |  ' + rB.th.toFixed(0));
      }
      ctl.show('pur', V.mod === 'd2o');
      rebuild();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        prog += dt * 22;
        const pw = Wd / 2 - 6;
        [[A, tracksA, 0, 'Light water, H₂O'], [B, tracksB, 1, V.mod === 'd2o' ? 'Heavy water, ' + V.pur.toFixed(2) + ' % D' : 'Graphite']].forEach(([M, T, side, name]) => {
          const x0 = side * (pw + 12) + 4, cx = x0 + pw / 2, cy = Hh / 2 + 6, sc = Math.min(pw, Hh - 40) / 2 / 45;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x0 + 0.5, 24.5, pw - 1, Hh - 30);
          kit.label(c, name, cx, 13, { align: 'center', weight: 700, size: 12.5 });
          for (const tr of T) {
            const n = tr.pts.length, upto = Math.min(n - 1, Math.floor(prog));
            for (let i = 1; i <= upto; i++) {
              const a = tr.pts[i - 1], b = tr.pts[i], lg = Math.log10(Math.max(b.E, 0.01));
              const h = clamp(220 - 220 * (lg + 1.6) / 7.9, 0, 220);
              c.strokeStyle = 'hsl(' + h.toFixed(0) + ',85%,' + (C.dark ? 62 : 46) + '%)'; c.lineWidth = 1.2;
              c.beginPath(); c.moveTo(cx + a.x * sc, cy + a.y * sc); c.lineTo(cx + b.x * sc, cy + b.y * sc); c.stroke();
            }
            if (upto === n - 1) {
              const e = tr.pts[n - 1], X = cx + e.x * sc, Y = cy + e.y * sc;
              if (tr.cap) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(X - 4, Y - 4); c.lineTo(X + 4, Y + 4); c.moveTo(X + 4, Y - 4); c.lineTo(X - 4, Y + 4); c.stroke(); }
              else { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(X, Y, 3.5, 0, TAU); c.stroke(); }
            }
          }
          kit.dot(c, cx, cy, 3.5, C.text);
          kit.label(c, 'each side 90 cm across · ' + (M.s.cap * 100).toFixed(M.s.cap < 0.01 ? 2 : 1) + ' % captured while slowing', x0 + 6, Hh - 6, { size: 10.5, color: C.muted });
        });
        kit.label(c, '× captured   ○ slowed to 0.1 eV', Wd / 2, Hh - 6, { size: 10.5, color: C.muted, align: 'center' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 5. the water-based units */
  Hyper.sim('us-water-units', {
    title: 'Water as the measure of things',
    blurb: `Three of the units that were once defined by water, set beside what the water actually does.

**Kilogram and litre.** The mass of a cubic decimetre of water changes with temperature. The 1795 gramme was taken at melting ice (0 °C); the 1799 kilogram at the density maximum (3.98 °C), where a thermometer error costs almost nothing. Drag the slider and watch the mass of a cubic decimetre, and see what a 0.1 K thermometer error does at 0 °C and at 4 °C.

**Celsius degree.** Anders Celsius's own scale of 1742 put 0 at the boiling point and 100 at the freezing point. The boiling point depends on the pressure, which he knew; slide the pressure down a mountain and see it fall. On the 1990 scale, boiling at one atmosphere is 99.974 °C.

**Calorie.** The old definition was the heat for one gram of water by one degree. The specific heat of water changes by about 0.4 % across the liquid range, so no single temperature defines it; three calories are in use.

All numbers come from the water data of the app (density, vapour pressure, specific heat).`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 320 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '6px 10px 10px'; box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'T (°C)', min: 0, max: 30 }, y: { label: 'y' } }, 200);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Unit', options: [['Kilogram and litre (density)', 'kg'], ['Celsius degree (boiling point)', 'C'], ['Calorie (specific heat)', 'cal']], value: params.mode || 'kg' },
        { id: 'T', label: 'Water temperature', min: 0, max: 30, step: 0.1, value: 4, unit: '°C' },
        { id: 'err', label: 'Thermometer error', min: 0, max: 0.5, step: 0.05, value: 0.1, unit: 'K' },
        { id: 'p', label: 'Air pressure', min: 30, max: 110, step: 0.5, value: 101.325, unit: 'kPa' },
        { id: 'Tc', label: 'Water temperature', min: 0, max: 100, step: 1, value: 15, unit: '°C' }
      ], () => { layout(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rho', 'Density'], ['m', 'Mass of 1 dm³'], ['dev', 'Departure from 1 kg'], ['er', 'Mass error from the thermometer error'], ['lit', 'Mass of the 1901 litre (1.000028 dm³)'],
        ['bp', 'Boiling point'], ['dev2', 'Departure from 100 °C'], ['inv', 'Celsius\'s 1742 number'], ['k', 'In kelvin'],
        ['cp', 'Specific heat'], ['calx', 'Heat for 1 g by 1 K'], ['dev3', 'Against the thermochemical calorie']]);
      const GROUP = { kg: ['rho', 'm', 'dev', 'er', 'lit'], C: ['bp', 'dev2', 'inv', 'k'], cal: ['cp', 'calx', 'dev3'] };
      function layout() {
        for (const g in GROUP) for (const k of GROUP[g]) ro.show(k, g === V.mode);
        ctl.show('T', V.mode === 'kg'); ctl.show('err', V.mode === 'kg'); ctl.show('p', V.mode === 'C'); ctl.show('Tc', V.mode === 'cal');
      }
      function draw() {
        const C = kit.colors();
        if (V.mode === 'kg') {
          const pts = []; for (let t = 0; t <= 30.01; t += 0.5) pts.push([t, W.density(t)]);
          const rho = W.density(V.T), slope = Math.abs(W.expansion(V.T));
          plot.set({ series: [{ pts, label: 'density of water', color: C.accent }], x: { label: 'T (°C)', min: 0, max: 30 }, y: { label: 'density (kg/m³)', min: 995.5, max: 1000.5 }, vlines: [{ x: 0, label: '1795: melting ice' }, { x: W.TMAX, label: '1799: maximum density' }], marks: [{ x: V.T, y: rho, label: 'now', color: C.text }] });
          ro.set('rho', rho.toFixed(3) + ' kg/m³');
          ro.set('m', (rho / 1000).toFixed(5) + ' kg');
          ro.set('dev', ((rho / 1000 - 1) * 1e6).toFixed(0) + ' ppm');
          ro.set('er', (slope * V.err * 1e6).toFixed(2) + ' ppm for ' + V.err.toFixed(2) + ' K');
          ro.set('lit', (rho * 1.000028 / 1000).toFixed(5) + ' kg');
        } else if (V.mode === 'C') {
          const pts = []; for (let i = 0; i <= 60; i++) { const p = 0.6 * Math.pow(150 / 0.6, i / 60); pts.push([p, W.boilingPoint(p * 1000)]); }
          const bp = W.boilingPoint(V.p * 1000);
          plot.set({ series: [{ pts, label: 'boiling point', color: C.accent }], x: { label: 'pressure (kPa)', min: 0.5, max: 150, log: true }, y: { label: 'boiling point (°C)', min: 0, max: 115 }, vlines: [{ x: 101.325, label: '1 atm' }], marks: [{ x: V.p, y: bp, label: 'now', color: C.text }, { x: 0.611657, y: 0.01, label: 'triple point', color: C.warn }] });
          ro.set('bp', bp.toFixed(2) + ' °C');
          ro.set('dev2', (bp - 100 >= 0 ? '+' : '') + (bp - 100).toFixed(2) + ' K');
          ro.set('inv', (100 - bp).toFixed(2) + '  (0 at boiling, 100 at freezing)');
          ro.set('k', (bp + 273.15).toFixed(2) + ' K');
        } else {
          const pts = []; for (let t = 0; t <= 100.01; t += 2) pts.push([t, W.heatCapacity(t)]);
          const cp = W.heatCapacity(V.Tc);
          plot.set({ series: [{ pts, label: 'specific heat of liquid water', color: C.accent }], x: { label: 'T (°C)', min: 0, max: 100 }, y: { label: 'specific heat (J/(kg·K))', min: 4165, max: 4225 }, hlines: [{ y: 4184, label: 'thermochemical calorie 4.184' }, { y: 4186.8, label: 'IT calorie 4.1868' }], marks: [{ x: V.Tc, y: cp, label: 'now', color: C.text }] });
          ro.set('cp', cp.toFixed(1) + ' J/(kg·K)');
          ro.set('calx', (cp / 1000).toFixed(4) + ' J  =  ' + (cp / 4184).toFixed(5) + ' cal');
          ro.set('dev3', ((cp / 4184 - 1) * 100).toFixed(2) + ' %');
        }
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        draw();
        if (V.mode === 'kg') {
          const rho = W.density(V.T), hh = Hh - 70, bw = Math.min(110, Wd * 0.2);
          S.beaker(c, 36, 20, bw, hh, 0.8, { liquid: 'rgba(70,150,235,0.45)', label: '1 dm³ of water' });
          S.thermometer(c, 36 + bw + 34, 20, hh, V.T, { min: 0, max: 30 });
          kit.label(c, V.T.toFixed(1) + ' °C', 36 + bw + 34, Hh - 30, { align: 'center', size: 12 });
          // a balance reading
          const bx = Wd * 0.45, by = 40;
          c.strokeStyle = C.axis; c.lineWidth = 2; c.strokeRect(bx, by, Math.min(220, Wd * 0.5), 70);
          kit.label(c, (rho / 1000).toFixed(5) + ' kg', bx + Math.min(220, Wd * 0.5) / 2, by + 36, { align: 'center', size: 22, weight: 700 });
          kit.label(c, 'balance: mass of the cubic decimetre', bx, by + 92, { size: 11.5, color: C.muted });
          kit.label(c, 'the 1799 kilogram was fixed where this number peaks', bx, by + 112, { size: 11.5, color: C.muted });
        } else if (V.mode === 'C') {
          const bp = W.boilingPoint(V.p * 1000), hh = Hh - 70;
          S.thermometer(c, 60, 20, hh, bp, { min: 0, max: 110, label: 'modern' });
          kit.label(c, 'today: ' + bp.toFixed(1) + ' °C', 60, Hh - 30, { align: 'center', size: 12 });
          S.thermometer(c, Wd * 0.35, 20, hh, 100 - bp, { min: 0, max: 110, color: C.warn, label: 'Celsius 1742' });
          kit.label(c, '1742: ' + (100 - bp).toFixed(1), Wd * 0.35, Hh - 30, { align: 'center', size: 12, color: C.warn });
          kit.label(c, 'At 1 atm the boiling point is 99.974 °C;', Wd * 0.52, 50, { size: 12.5 });
          kit.label(c, 'at 50 kPa (5,500 m) it is 81 °C.', Wd * 0.52, 72, { size: 12.5 });
          kit.label(c, 'So Celsius named the pressure at which to mark 100.', Wd * 0.52, 106, { size: 11.5, color: C.muted });
        } else {
          kit.label(c, '1 cal = heat for 1 g of water by 1 K', Wd / 2, 32, { align: 'center', size: 14, weight: 700 });
          const rows = [['15 °C calorie', 4185.5], ['thermochemical calorie', 4184], ['International Table calorie', 4186.8], ['water here, ' + V.Tc + ' °C', W.heatCapacity(V.Tc)]];
          rows.forEach(([nm, v], i) => {
            const y = 70 + i * 36, w = (v - 4160) / 70 * (Wd - 250);
            c.fillStyle = i === 3 ? C.accent : C.series[(i + 1) % 6]; c.fillRect(200, y - 9, Math.max(2, w), 18);
            kit.label(c, nm, 192, y, { align: 'right', size: 12 });
            kit.label(c, v.toFixed(1) + ' J/(kg·K)', 206 + Math.max(2, w), y, { size: 11.5 });
          });
        }
      }, box.stage);
      layout();
      loop.once();
      loop.start();
    }
  });

  /* ================================================================ 6. resistivity of ultrapure water */
  Hyper.sim('us-resistivity', {
    title: 'The meter that sees one part per billion',
    blurb: `Resistivity is how an ultrapure-water plant sees its product. Pure water is limited by its own ions to 18.18 MΩ·cm at 25 °C (0.055 µS/cm). The meter at the top places the water against the grades from tap water to ultrapure; the graph shows resistivity against the amount of salt dissolved.

**Try this**
- Start at 1 µg/L of NaCl (one part per billion): the resistivity falls from 18.18 to about 17.5 MΩ·cm. At 100 µg/L it is only 3.7: ultrapure water is lost with a pinch.
- Compare the salts: acid and base conduct more per gram than salt because H⁺ and OH⁻ are so mobile. HCl does about five times as much damage as NaCl for the same mass.
- Tick *Open to the air*: the dissolved CO₂ of the air (420 ppm) alone takes the water to about 1 MΩ·cm. This is why ultrapure water is kept in closed loops.
- Warm the water to 50 °C. The reading changes even though nothing has been added, because water ionises more when warm. Meters correct to 25 °C.

The molar conductivities are limiting values at 25 °C scaled by 2 % per kelvin; the CO₂ is Henry's law plus the first dissociation of carbonic acid. All dilute-solution approximations.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 190, maxH: 250 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '6px 10px 10px'; box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'dissolved salt (µg/L)', log: true, min: 0.01, max: 1e4 }, y: { label: 'resistivity (MΩ·cm)', log: true, min: 1e-3, max: 30 }, legend: true }, 210);
      const SALTS = [['Sodium chloride, NaCl', 'NaCl'], ['Potassium chloride, KCl', 'KCl'], ['Hydrochloric acid, HCl', 'HCl'], ['Sodium hydroxide, NaOH', 'NaOH'], ['Calcium chloride, CaCl₂', 'CaCl2']];
      const DATA = { NaCl: [58.44, 126.4], KCl: [74.55, 149.9], HCl: [36.46, 426.2], NaOH: [40.0, 247.8], CaCl2: [55.49, 135.8] };   // g per mole (or equivalent), S·cm²/mol
      const ctl = kit.controls(box.side, [
        { id: 'salt', type: 'select', label: 'Dissolved', options: SALTS, value: params.salt || 'NaCl' },
        { id: 'c', label: 'Amount (µg per litre)', min: 0.01, max: 10000, value: params.c || 1, log: true, sig: 2, unit: 'µg/L' },
        { id: 'T', label: 'Water temperature', min: 5, max: 60, step: 1, value: 25, unit: '°C' },
        { id: 'air', type: 'check', label: 'Open to the air (420 ppm CO₂)', value: !!params.air }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rho', 'Resistivity'], ['k', 'Conductivity'], ['pure', 'Pure water alone at this temperature'], ['own', 'Carried by the water\'s own ions'], ['grade', 'Grade']]);
      const kPure = T => W.conductivityPure(T) * 1e4;                            // µS/cm
      const kSalt = (salt, c, T) => { const [M, L] = DATA[salt]; return L * (1 + 0.02 * (T - 25)) * (c / M) / 1000; };     // c in µg/L = µmol/L × M ... (c/M) µmol/L; κ µS/cm = Λ·c(µmol/L)/1000
      const kCO2 = T => {
        const cco2 = W.henry('CO2', T) * 420e-6, Ka = 4.45e-7 * (1 + 0.005 * (T - 25)), h = Math.sqrt(Ka * cco2);
        return h * (349.8 + 44.5) * (1 + 0.02 * (T - 25)) * 1e3;                // mol/L × S·cm²/mol → µS/cm
      };
      const total = (salt, c, T, air) => kPure(T) + kSalt(salt, c, T) + (air ? kCO2(T) : 0);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const k = total(V.salt, V.c, V.T, V.air), rho = 1 / k, kp = kPure(V.T);
        // the meter: log scale from 0.001 to 30 MΩ·cm
        const mx = 40, mw = Wd - 80, my = Hh * 0.50, lo = -3, hi = Math.log10(30), px = r => mx + (Math.log10(clamp(r, 1e-3, 30)) - lo) / (hi - lo) * mw;
        const bands = [[0.0012, 0.01, 'tap water', C.bad], [0.2, 1, 'stored distilled', C.warn], [1, 10, 'deionised', C.accent], [17, 18.18, 'ultrapure', C.ok]];
        c.fillStyle = C.grid; c.fillRect(mx, my, mw, 16);
        bands.forEach(([a, b, nm, col]) => { c.fillStyle = col; c.globalAlpha = 0.55; c.fillRect(px(a), my, Math.max(3, px(b) - px(a)), 16); c.globalAlpha = 1; kit.label(c, nm, (px(a) + px(b)) / 2, my - 12, { size: 11, align: 'center', color: C.muted }); });
        for (const t of [0.001, 0.01, 0.1, 1, 10]) { c.fillStyle = C.axis; c.fillRect(px(t), my + 16, 1, 5); kit.label(c, String(t), px(t), my + 31, { size: 10.5, align: 'center', color: C.muted }); }
        kit.label(c, 'MΩ·cm', mx + mw + 2, my + 31, { size: 10.5, color: C.muted });
        const nx = px(rho); c.fillStyle = C.text; c.beginPath(); c.moveTo(nx, my - 2); c.lineTo(nx - 7, my - 18); c.lineTo(nx + 7, my - 18); c.closePath(); c.fill();
        kit.label(c, rho >= 1 ? rho.toFixed(2) + ' MΩ·cm' : (rho * 1000).toFixed(rho < 0.01 ? 1 : 0) + ' kΩ·cm', Math.min(Math.max(nx, mx + 50), mx + mw - 50), my - 34, { align: 'center', weight: 700, size: 13 });
        kit.label(c, 'limit of pure water at ' + V.T + ' °C: ' + (1 / kp).toFixed(2) + ' MΩ·cm', mx, Hh - 14, { size: 11.5, color: C.muted });
        // the curve
        const pts = [], pts0 = [];
        for (let i = 0; i <= 50; i++) { const cc = 0.01 * Math.pow(1e6, i / 50); pts.push([cc, 1 / total(V.salt, cc, V.T, V.air)]); pts0.push([cc, 1 / total(V.salt, cc, V.T, false)]); }
        plot.set({ series: [{ pts, label: (V.air ? 'with air' : 'closed') + ', ' + V.salt, color: C.accent }, { pts: pts0, label: 'closed container', color: C.faint, dash: true }], x: { label: 'dissolved salt (µg/L)', log: true, min: 0.01, max: 1e4 }, y: { label: 'resistivity (MΩ·cm)', log: true, min: 1e-3, max: 30 }, hlines: [{ y: 18.18, label: 'ultrapure limit at 25 °C' }, { y: 1, label: '1 MΩ·cm' }], marks: [{ x: V.c, y: rho, label: 'now', color: C.text }] });
        ro.set('rho', (rho >= 1 ? rho.toFixed(2) : rho.toFixed(3)) + ' MΩ·cm');
        ro.set('k', k.toFixed(k < 1 ? 3 : 2) + ' µS/cm');
        ro.set('pure', (1 / kp).toFixed(2) + ' MΩ·cm (' + kp.toFixed(3) + ' µS/cm)');
        ro.set('own', (kp / k * 100).toFixed(kp / k > 0.1 ? 0 : 1) + ' %');
        ro.set('grade', rho > 17 ? 'ultrapure (within 7 % of the limit)' : rho > 5 ? 'deionised, high grade' : rho > 0.5 ? 'distilled or deionised' : rho > 0.012 ? 'weak solution' : 'tap-water range');
      }, box.stage);
      loop.once();
      loop.start();
    }
  });

  /* ================================================================ 7. cooking time against altitude and pressure */
  Hyper.sim('us-cooking-time', {
    title: 'The boiling point is the ceiling of the pot',
    blurb: `The water in an open pot cannot get hotter than its boiling point, and the boiling point is set by the pressure above it. Slide the altitude, or switch on the pressure cooker, and read the temperature at which the pot actually cooks; the time follows from the Arrhenius law with an activation energy for each food.

**Try this**
- Take the pot from the Dead Sea (−430 m) to Denver (1,609 m) and then to La Paz (3,640 m): the water boils at 101.4, 94.6 and 87.8 °C, and the potatoes go from 19 to 29 minutes. At the summit of Everest, water boils at 70 °C and the egg barely sets.
- Switch on the cooker (1 bar gauge, about 2 atmospheres): about 120 °C and a third of the time.
- Add salt: move it to the pasta-water level, 10 g per litre, and the boiling point rises by 0.18 K, far too little to matter. Move to 300 g/L (a near-saturated brine) and it rises by about 5 K.
- Compare foods: collagen in a stew (high activation energy) gains more from a hotter pot than rice does.

Activation energies are round, illustrative values within the 60–130 kJ/mol quoted for softening of vegetables, starch, collagen and egg protein; the standard atmosphere gives the pressure at altitude; the boiling point is from the vapour-pressure curve of water; salt acts as an ideal solute.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '6px 10px 10px'; box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'altitude (m)', min: -500, max: 9000 }, y: { label: 'cooking time (min)', min: 0 } }, 190);
      const FOODS = { pot: { n: 'Potato cubes', t0: 20, Ea: 80 }, rice: { n: 'White rice', t0: 15, Ea: 70 }, beans: { n: 'Soaked dried beans', t0: 90, Ea: 75 }, stew: { n: 'Tough beef stew (collagen)', t0: 150, Ea: 100 }, egg: { n: 'Hard-boiled egg', t0: 10, Ea: 130 } };
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Altitude', min: -430, max: 8849, step: 10, value: params.h != null ? params.h : 0, unit: 'm' },
        { id: 'cook', type: 'check', label: 'Pressure cooker', value: !!params.cook },
        { id: 'g', label: 'Cooker pressure above the air', min: 0.2, max: 1.5, step: 0.05, value: 1.0, unit: 'bar' },
        { id: 'food', type: 'select', label: 'Food', options: Object.keys(FOODS).map(k => [FOODS[k].n + ' (' + FOODS[k].t0 + ' min at sea level, Ea ' + FOODS[k].Ea + ')', k]), value: params.food || 'pot' },
        { id: 'salt', label: 'Salt in the water', min: 0, max: 300, step: 5, value: 10, unit: 'g/L' }
      ], () => { ctl.show('g', V.cook); loop.once(); });
      const V = ctl.values;
      ctl.show('g', V.cook);
      const ro = kit.readout(box.side, [['p', 'Pressure over the water'], ['tb', 'Boiling point (the pot\'s ceiling)'], ['salt', 'of which the salt'], ['time', 'Cooking time'], ['fac', 'Compared with sea level']]);
      const R = 8.314462618, P0 = 101325, Tref = W.boilingPoint(P0);
      const atm = h => P0 * Math.pow(1 - 2.25577e-5 * h, 5.25588);
      const sat = (salt) => { const m = (salt / 58.44) / Math.max(0.2, 1 - salt / 1000); return 0.512 * 2 * m; };
      const timeAt = (food, Tb) => FOODS[food].t0 * Math.exp(FOODS[food].Ea * 1000 / R * (1 / (Tb + 273.15) - 1 / (Tref + 273.15)));
      let bubbles = [];
      for (let i = 0; i < 28; i++) bubbles.push({ x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 3.5, s: 0.5 + Math.random() });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const pAbs = atm(V.h) + (V.cook ? V.g * 1e5 : 0), tb0 = W.boilingPoint(pAbs), ds = sat(V.salt), Tb = tb0 + ds;
        const tm = timeAt(V.food, Tb), tm0 = FOODS[V.food].t0;
        // the pot
        const px = 40, pw = Math.min(Wd * 0.42, 230), py = Hh * 0.30, ph = Hh * 0.52;
        c.fillStyle = 'rgba(70,150,235,0.40)'; c.fillRect(px, py + ph * 0.18, pw, ph * 0.82);
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py + ph); c.lineTo(px + pw, py + ph); c.lineTo(px + pw, py); c.stroke();
        if (V.cook) { c.fillStyle = C.faint; c.fillRect(px - 6, py - 10, pw + 12, 10); kit.label(c, 'sealed lid, weight on the vent', px + pw / 2, py - 24, { size: 11.5, color: C.muted, align: 'center' }); }
        for (const b of bubbles) {
          b.y -= dt * 0.35 * b.s * (V.cook ? 1.4 : 1); if (b.y < 0) { b.y = 1; b.x = Math.random(); }
          const bx = px + 6 + b.x * (pw - 12), by = py + ph * 0.18 + b.y * ph * 0.78;
          c.strokeStyle = 'rgba(220,240,255,0.85)'; c.lineWidth = 1; c.beginPath(); c.arc(bx, by, b.r, 0, TAU); c.stroke();
        }
        if (!V.cook) for (let i = 0; i < 4; i++) kit.label(c, '~', px + pw * (0.2 + 0.2 * i), py - 6 - 6 * Math.sin(performance.now() / 400 + i), { size: 15, color: C.muted, align: 'center' });
        kit.wsym.thermometer(c, px + pw + 40, py - 8, ph + 8, Tb, { min: 60, max: 130, color: Tb > 105 ? C.bad : C.accent });
        kit.label(c, Tb.toFixed(1) + ' °C', px + pw + 40, py + ph + 20, { align: 'center', weight: 700, size: 13 });
        // the mountain
        const mx0 = Wd * 0.62, mw = Wd - mx0 - 16, my0 = Hh - 16, mh = Hh * 0.7;
        c.fillStyle = 'rgba(130,140,150,0.35)'; c.beginPath(); c.moveTo(mx0, my0); c.lineTo(mx0 + mw * 0.55, my0 - mh); c.lineTo(mx0 + mw, my0); c.closePath(); c.fill();
        const f = (V.h + 430) / (8849 + 430), ay = my0 - f * mh, ax = mx0 + mw * 0.55 * Math.min(1, 1 - (1 - f) * 0.9) + (1 - f) * mw * 0.0;
        kit.dot(c, mx0 + mw * (0.05 + 0.5 * f), ay, 5, C.warn);
        kit.label(c, V.h + ' m', mx0 + mw * (0.05 + 0.5 * f) + 9, ay, { size: 11.5, color: C.warn });
        kit.label(c, 'Everest 8,849 m · 70 °C', mx0 + mw * 0.55, my0 - mh - 8, { size: 10.5, color: C.muted, align: 'center' });
        // the curve
        const pts = [];
        for (let h = -500; h <= 9000; h += 250) pts.push([h, timeAt(V.food, W.boilingPoint(atm(Math.max(h, -430))) + ds)]);
        plot.set({ series: [{ pts, label: FOODS[V.food].n + ' in an open pot', color: C.accent }], x: { label: 'altitude (m)', min: -500, max: 9000 }, y: { label: 'cooking time (min)', min: 0, max: Math.min(Math.max(...pts.map(q => q[1])) * 1.05, tm0 * 14) }, marks: [{ x: -430, y: timeAt(V.food, W.boilingPoint(atm(-430)) + ds), label: 'Dead Sea' }, { x: 750, y: timeAt(V.food, W.boilingPoint(atm(750)) + ds), label: 'Jerusalem' }, { x: 1609, y: timeAt(V.food, W.boilingPoint(atm(1609)) + ds), label: 'Denver' }, { x: 3640, y: timeAt(V.food, W.boilingPoint(atm(3640)) + ds), label: 'La Paz' }, { x: V.h, y: V.cook ? NaN : tm, label: 'now', color: C.text }].filter(m => Number.isFinite(m.y)) });
        ro.set('p', (pAbs / 1000).toFixed(1) + ' kPa  (' + (pAbs / 101325).toFixed(2) + ' atm)');
        ro.set('tb', Tb.toFixed(1) + ' °C');
        ro.set('salt', '+' + ds.toFixed(2) + ' K');
        ro.set('time', tm >= 100 ? (tm / 60).toFixed(1) + ' h' : tm.toFixed(0) + ' min');
        ro.set('fac', (tm / tm0).toFixed(2) + ' × the sea-level time of ' + tm0 + ' min');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 8. other liquids; follow the water */
  Hyper.sim('us-solvents', {
    title: 'Could another liquid do water\'s job?',
    blurb: `Two views of one question.

**Compare the liquids.** Seven candidate solvents scored from 0 to 1 on five criteria that Henderson and the 2007 NRC report would ask: a **useful liquid range**, **polarity** (dielectric constant), a **hydrogen-bond network**, **common ingredients** (the scarcest element's abundance in the Sun) and **chemistry that runs at the liquid's own temperature** (an Arrhenius rate relative to 25 °C). Weight the criteria as you like; click a row for its note. The scores are crude; the point is that water scores well on all five at once and every alternative falls down somewhere.

**Follow the water: a decision tree.** Pick a world and walk down five questions: liquid water now? an energy source? the six elements? lasting long enough? can we reach and measure it? The verdict is a summary of the question, not a probability of life.

Properties of water, ammonia, hydrogen fluoride and methane come from the app's water data; the others are from standard references. The tree uses published findings (Cassini, Galileo, Hubble, Curiosity, JWST); the missions are as planned in 2025.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 560 });
      const ff = getComputedStyle(document.body).fontFamily;
      const M = id => W.MOLECULES.find(m => m.id === id);
      const SOLV = [
        { id: 'water', name: 'Water', mp: M('H2O').mp, bp: M('H2O').bp, eps: W.LIQUIDS[0].eps, don: M('H2O').donors, acc: M('H2O').acceptors, el: ['H', 'O'], T: 298, note: 'Wide liquid range at 1 atm, a dielectric constant of 78, four hydrogen bonds per molecule, and the third-most abundant element in the universe among its ingredients.' },
        { id: 'nh3', name: 'Ammonia', mp: M('NH3').mp, bp: M('NH3').bp, eps: W.LIQUIDS.find(l => l.id === 'ammonia').eps, don: M('NH3').donors, acc: M('NH3').acceptors, el: ['N', 'H'], T: 240, note: 'Liquid only from −78 to −33 °C at 1 atm (or under about 9 bar at room temperature); three hydrogens but one lone pair, so a thinner network; a base that destroys many organic molecules.' },
        { id: 'hf', name: 'Hydrogen fluoride', mp: M('HF').mp, bp: M('HF').bp, eps: 84, don: M('HF').donors, acc: M('HF').acceptors, el: ['F', 'H'], T: 283, note: 'Very polar, strongly hydrogen-bonded chains; but fluorine is tens of thousands of times scarcer than oxygen, and the liquid attacks glass, silicates and most organic molecules.' },
        { id: 'form', name: 'Formamide', mp: 2.5, bp: 210, eps: 111, don: 2, acc: 2, el: ['C', 'N', 'O'], T: 298, note: 'Polar, hydrogen-bonded, liquid from 2.5 to 210 °C; it makes nucleobases in prebiotic-chemistry experiments. No natural sea of it is known.' },
        { id: 'h2so4', name: 'Sulfuric acid', mp: 10.3, bp: 337, eps: 100, don: 2, acc: 4, el: ['S', 'O'], T: 300, note: 'The droplets of Venus\'s clouds, at about 300 K at the right height. Dehydrating and strongly acidic; laboratory tests in the 2020s found that some biomolecules survive in it, which is not the same as supporting life.' },
        { id: 'ch4', name: 'Liquid methane (Titan, 94 K)', mp: M('CH4').mp, bp: M('CH4').bp, eps: 1.7, don: M('CH4').donors, acc: M('CH4').acceptors, el: ['C', 'H'], T: 94, note: 'The seas of Titan: carbon and hydrogen are common, but a dielectric constant of 1.7 cannot hold ions and 94 K makes chemistry some 10^19 times slower than at 25 °C.' },
        { id: 'co2', name: 'Supercritical CO₂', mp: 31, bp: 331, eps: 1.5, don: 0, acc: 0, el: ['C', 'O'], T: 310, span: 300, note: 'Above 31 °C and 74 bar; non-polar, a fine solvent for oily molecules. Venus\'s surface (92 bar, 464 °C) has it, but at a temperature far above where organic molecules last.' }
      ];
      const A = { H: 12, C: 8.43, N: 7.83, O: 8.69, F: 4.56, S: 7.12 };      // solar abundances, log scale with H = 12 (Asplund et al. 2009)
      const CRIT = [['Liquid range', 'range'], ['Polarity', 'pol'], ['Hydrogen bonds', 'hb'], ['Common ingredients', 'ab'], ['Chemistry speed', 'chem']];
      const WORLDS = [
        { id: 'earth', n: 'Earth', q: [['yes', '1.34 billion km³ of liquid ocean at the surface.'], ['yes', 'Sunlight and chemical energy in vents and rocks.'], ['yes', 'Carbon, hydrogen, nitrogen, oxygen, phosphorus and sulfur are all abundant.'], ['yes', 'Liquid for about four billion years.'], ['yes', 'We are here; this is the reference.']] },
        { id: 'mars', n: 'Mars', q: [['no', 'Ice and thin air near the triple-point pressure: no lasting liquid today; lakes and deltas about 3–4 billion years ago.'], ['maybe', 'Faint sunlight; chemical energy underground is possible but unshown.'], ['yes', 'Curiosity found organic molecules, nitrates and sulfates; phosphorus is in the rocks.'], ['maybe', 'Lakes may have lasted tens to hundreds of millions of years.'], ['yes', 'Perseverance is caching samples; their return is under review.']] },
        { id: 'europa', n: 'Europa', q: [['yes', 'A salty ocean under 15–25 km of ice (Galileo magnetometer); a probable plume (Hubble 2016).'], ['maybe', 'Tidal heating and radiation-made oxidants from the surface; seafloor activity not shown.'], ['unknown', 'CO₂ on the surface (JWST 2023); the others not measured.'], ['yes', 'The ocean is probably as old as the moon.'], ['maybe', 'Europa Clipper: launched October 2024, arrival planned for 2030.']] },
        { id: 'ganymede', n: 'Ganymede', q: [['yes', 'A salty ocean between ice layers (Hubble aurora, 2015).'], ['maybe', 'Weak tidal heating; the ocean may be cut off from the rock by a layer of high-pressure ice.'], ['unknown', 'No measurement of the ingredients yet.'], ['yes', 'Old.'], ['maybe', 'JUICE: launched April 2023; Jupiter 2031, Ganymede orbit 2034 (planned).']] },
        { id: 'enceladus', n: 'Enceladus', q: [['yes', 'A global ocean under 5–30 km of ice; a plume from the south pole, sampled by Cassini.'], ['yes', 'Hydrogen in the plume (2015) means chemical energy; tidal heat.'], ['maybe', 'C, H, N and O seen; phosphates found in 2023; sulfur likely, not yet shown.'], ['maybe', 'The age of the ocean is uncertain: tens of millions to billions of years.'], ['maybe', 'No mission approved yet; orbiter and lander studies.']] },
        { id: 'titan', n: 'Titan', q: [['maybe', 'A water–ammonia ocean far below the ice (Cassini tides); the lakes at the surface are methane and ethane.'], ['maybe', 'Dim sunlight chemistry; tidal heat at depth.'], ['maybe', 'C, H and N abound at the surface; oxygen is locked in ice; phosphorus unknown.'], ['yes', 'Long-lived.'], ['yes', 'Dragonfly: launch planned 2028, arrival 2034.']] },
        { id: 'trappist', n: 'TRAPPIST-1 e (exoplanet)', q: [['unknown', 'In the habitable zone of a cool star 40 light-years away; whether it has air or water is unknown.'], ['maybe', 'Infrared-rich starlight; flares.'], ['unknown', 'Unknown.'], ['maybe', 'The star is billions of years old, but early flares may have stripped the air.'], ['maybe', 'Only by transit spectroscopy: JWST, then larger telescopes.']] },
        { id: 'moon', n: 'The Moon', q: [['no', 'Ice in shadowed polar craters, perhaps a cubic kilometre; no liquid.'], ['no', 'Sunlight but nothing to use it with.'], ['maybe', 'Some volatiles in the ice.'], ['no', 'No.'], ['yes', 'Easy to reach.']] }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Compare the liquids', 'cmp'], ['Follow the water: a decision tree', 'tree']], value: params.mode === 'tree' ? 'tree' : 'cmp' },
        { id: 'Ea', label: 'Activation energy of the chemistry', min: 20, max: 100, step: 5, value: 50, unit: 'kJ/mol' },
        { id: 'w0', label: 'Weight: liquid range', min: 0, max: 3, step: 0.5, value: 1 },
        { id: 'w1', label: 'Weight: polarity', min: 0, max: 3, step: 0.5, value: 1 },
        { id: 'w2', label: 'Weight: hydrogen bonds', min: 0, max: 3, step: 0.5, value: 1 },
        { id: 'w3', label: 'Weight: common ingredients', min: 0, max: 3, step: 0.5, value: 1 },
        { id: 'w4', label: 'Weight: chemistry speed', min: 0, max: 3, step: 0.5, value: 1 },
        { id: 'world', type: 'select', label: 'World', options: WORLDS.map(w => [w.n, w.id]), value: params.world || 'europa' },
        { type: 'buttons', items: [{ id: 'replay', label: 'Walk down the tree again', primary: true }] }
      ], (id) => { if (id === 'view') layout(); if (id === 'replay' || id === 'world') shown = 0; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Selected'], ['b', 'Total score'], ['c', 'Verdict']]);
      let sel = 0, shown = 0;
      function layout() {
        const cmp = V.view === 'cmp';
        for (const id of ['Ea', 'w0', 'w1', 'w2', 'w3', 'w4']) ctl.show(id, cmp);
        ctl.show('world', !cmp); ctl.show('replay', !cmp);
        ro.show('a', true); ro.show('b', cmp); ro.show('c', !cmp);
      }
      layout();
      function scores(s) {
        const span = s.span || (s.bp - s.mp);
        const f = Math.exp(-V.Ea * 1000 / 8.314 / 1 * (1 / s.T - 1 / 298.15));
        const minA = Math.min(...s.el.map(e => A[e]));
        return { range: clamp(span / 100, 0, 1), pol: clamp(Math.log10(s.eps) / Math.log10(80), 0, 1), hb: clamp(Math.min(s.don, s.acc) / 2, 0, 1), ab: clamp((minA - 4) / (8.69 - 4), 0, 1), chem: f >= 1 ? 1 : clamp((Math.log10(f) + 15) / 15, 0, 1), logf: Math.log10(Math.min(f, 1e6)) };
      }
      function wrap(c, text, x, y, w, lh, color, size) {
        c.font = '500 ' + (size || 12) + 'px ' + ff; c.fillStyle = color; c.textAlign = 'left'; c.textBaseline = 'middle';
        const words = String(text).split(' '); let line = '', yy = y, n = 0;
        for (const wd of words) {
          const t = line ? line + ' ' + wd : wd;
          if (c.measureText(t).width > w && line) { c.fillText(line, x, yy); yy += lh; line = wd; n++; } else line = t;
        }
        if (line) { c.fillText(line, x, yy); n++; }
        return n;
      }
      kit.click(st, p => { if (V.view !== 'cmp') return; const i = Math.floor((p.y - rowY0) / rowH); if (i >= 0 && i < SOLV.length) { sel = i; loop.once(); } }, p => V.view === 'cmp');
      let rowY0 = 56, rowH = 44;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.view === 'cmp') {
          const nameW = Math.min(150, Wd * 0.27), totW = 44, bx = nameW + 14, bw = Wd - bx - totW - 14, cellW = bw / 5;
          rowY0 = 56; rowH = Math.min(46, (Hh - 120) / SOLV.length);
          CRIT.forEach(([nm], j) => kit.label(c, nm, bx + j * cellW + cellW / 2, 24, { size: 10.5, color: C.muted, align: 'center' }));
          kit.label(c, 'total', Wd - totW / 2 - 6, 24, { size: 10.5, color: C.muted, align: 'center' });
          const wsum = [V.w0, V.w1, V.w2, V.w3, V.w4], sw = wsum.reduce((a, b) => a + b, 0) || 1;
          const tot = SOLV.map(s => { const sc = scores(s); return [sc.range, sc.pol, sc.hb, sc.ab, sc.chem].reduce((a, v, j) => a + v * wsum[j], 0) / sw; });
          SOLV.forEach((s, i) => {
            const y = rowY0 + i * rowH, sc = scores(s), vals = [sc.range, sc.pol, sc.hb, sc.ab, sc.chem];
            if (i === sel) { c.fillStyle = 'rgba(100,160,255,0.12)'; c.fillRect(4, y - 2, Wd - 8, rowH - 2); }
            kit.label(c, s.name, 10, y + rowH * 0.45, { size: 12, weight: i === sel ? 700 : 500 });
            vals.forEach((v, j) => {
              const x = bx + j * cellW + 4, w = cellW - 8;
              c.fillStyle = C.grid; c.fillRect(x, y + 8, w, rowH * 0.42);
              c.fillStyle = v > 0.66 ? C.ok : v > 0.33 ? C.warn : C.bad; c.fillRect(x, y + 8, w * v, rowH * 0.42);
            });
            kit.label(c, tot[i].toFixed(2), Wd - totW / 2 - 6, y + rowH * 0.45, { size: 13, weight: 700, align: 'center' });
          });
          const s = SOLV[sel], sc = scores(s);
          wrap(c, s.note, 10, rowY0 + SOLV.length * rowH + 22, Wd - 20, 16, C.text, 12);
          ro.set('a', s.name + ': ' + [sc.range, sc.pol, sc.hb, sc.ab, sc.chem].map(v => v.toFixed(2)).join(' / '));
          ro.set('b', tot[sel].toFixed(2) + ' (water ' + tot[0].toFixed(2) + ')');
          kit.label(c, 'chemistry speed uses ' + V.Ea + ' kJ/mol at the liquid\'s own temperature (' + s.T + ' K): rate ' + (sc.logf > -0.5 ? 'about the same as' : '10^' + sc.logf.toFixed(1) + ' × the rate') + ' at 25 °C', 10, Hh - 10, { size: 10.5, color: C.muted });
        } else {
          const w = WORLDS.find(x => x.id === V.world) || WORLDS[0];
          shown = Math.min(7, shown + dt * 1.4);
          const QS = ['Liquid water now?', 'An energy source?', 'The six elements (C H N O P S)?', 'Lasting long enough?', 'Can we reach and measure it?'];
          const COL = { yes: C.ok, maybe: C.warn, unknown: C.faint, no: C.bad }, TXT = { yes: 'YES', maybe: 'MAYBE', unknown: 'UNKNOWN', no: 'NO' };
          kit.label(c, w.n, 12, 16, { size: 15, weight: 700 });
          const top = 34, rh = (Hh - top - 62) / 5;
          let dead = -1;
          for (let i = 0; i < 5; i++) {
            if (shown < i + 0.3) break;
            const y = top + i * rh, a = w.q[i][0], al = clamp(shown - i, 0, 1);
            c.globalAlpha = al;
            c.fillStyle = C.surface; c.fillRect(8, y, Wd - 16, rh - 8);
            c.fillStyle = COL[a]; c.fillRect(8, y, 5, rh - 8);
            kit.label(c, (i + 1) + '. ' + QS[i], 22, y + 14, { size: 12.5, weight: 700 });
            c.fillStyle = COL[a]; c.beginPath(); c.roundRect ? c.roundRect(Wd - 96, y + 5, 80, 20, 8) : c.rect(Wd - 96, y + 5, 80, 20); c.fill();
            kit.label(c, TXT[a], Wd - 56, y + 15, { size: 11, weight: 700, color: '#fff', align: 'center' });
            wrap(c, w.q[i][1], 22, y + 34, Wd - 40, 15, C.text, 11.5);
            c.globalAlpha = 1;
            if (a === 'no' && dead < 0) dead = i;
            if (dead >= 0 && i > dead) { c.fillStyle = 'rgba(128,128,128,0.0)'; }
          }
          const qs = w.q.map(q => q[0]);
          let verdict, vc;
          const firstNo = qs.indexOf('no');
          if (firstNo >= 0) { verdict = 'Dead end at question ' + (firstNo + 1) + ': ' + (firstNo === 0 ? 'no liquid water now; look for fossil evidence instead' : 'a requirement is missing'); vc = C.bad; }
          else if (qs.includes('unknown')) { verdict = 'Open: the next mission or telescope decides'; vc = C.faint; }
          else if (qs.every(q => q === 'yes')) { verdict = 'A top target: everything checks out'; vc = C.ok; }
          else { verdict = 'Promising, with open questions'; vc = C.warn; }
          if (shown >= 5.2) kit.label(c, verdict, 12, Hh - 24, { size: 13.5, weight: 700, color: vc });
          kit.label(c, 'A summary of the question, not a probability of life.', 12, Hh - 8, { size: 10.5, color: C.muted });
          ro.set('a', w.n);
          ro.set('c', shown >= 5.2 ? verdict : '…');
        }
      }, box.stage);
      loop.once();
      loop.start();
    }
  });

  /* ================================================================ 9. a meal and its water */
  Hyper.sim('us-meal-footprint', {
    title: 'The water in a meal',
    blurb: `Build a meal from twelve foods and see how much water went into it. Each bar is split into **green water** (rain used by the plants), **blue water** (taken from rivers and aquifers) and **grey water** (the volume needed to dilute the pollution). The values are the global averages of Mekonnen and Hoekstra (2011, 2012), in litres per kilogram. The markers show a day's drinking water (2.5 L), a bath (150 L) and the world average of all the water in a person's daily food and goods (about 3,800 L).

**Try this**
- Press *Burger*: 150 g of beef, a bun and a tomato come to about 2,400 L. Nearly all of it is the beef, and nearly all of that is green water: the rain on the pasture and the feed crops.
- Press *Chicken and rice*, then *Vegetable plate*. Swap the beef for chicken and the footprint falls to a quarter; for potatoes and maize, to a fiftieth.
- Tick *Show only the blue water* to see what is actually taken from rivers and wells: the picture changes, and rice and wheat move up.
- Note the grey water of rice and pork: pollution, not use.

Global averages hide large differences between farms and countries, and a footprint is an inventory, not an impact.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 520 });
      // L/kg: total, green, blue, grey  (Mekonnen and Hoekstra 2011, 2012; global averages)
      const F = [
        { id: 'beef', n: 'Beef', g: 14414, b: 550, y: 451 }, { id: 'pork', n: 'Pork', g: 4907, b: 459, y: 622 }, { id: 'chicken', n: 'Chicken', g: 3545, b: 313, y: 467 },
        { id: 'eggs', n: 'Eggs', g: 2592, b: 244, y: 429 }, { id: 'milk', n: 'Milk', g: 863, b: 86, y: 72 }, { id: 'rice', n: 'Rice (dry)', g: 1146, b: 341, y: 1010 },
        { id: 'wheat', n: 'Wheat flour', g: 1277, b: 342, y: 207 }, { id: 'maize', n: 'Maize', g: 947, b: 81, y: 194 }, { id: 'potatoes', n: 'Potatoes', g: 191, b: 33, y: 63 },
        { id: 'tomatoes', n: 'Tomatoes', g: 108, b: 63, y: 43 }, { id: 'apples', n: 'Apples', g: 561, b: 133, y: 127 }, { id: 'soy', n: 'Soybeans', g: 2037, b: 70, y: 38 }
      ];
      const defs = F.map(f => ({ id: f.id, label: f.n + ' (' + (f.g + f.b + f.y).toLocaleString('en-GB') + ' L/kg)', min: 0, max: 400, step: 10, value: 0, unit: 'g' }));
      const PRE = { burger: { beef: 150, wheat: 60, tomatoes: 30 }, chickrice: { chicken: 150, rice: 100, tomatoes: 100 }, veg: { potatoes: 200, maize: 80, tomatoes: 150, apples: 100, soy: 40 }, clear: {} };
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'burger', label: 'Burger', primary: true }, { id: 'chickrice', label: 'Chicken and rice' }, { id: 'veg', label: 'Vegetable plate' }, { id: 'clear', label: 'Clear' }] },
        { id: 'blue', type: 'check', label: 'Show only the blue water', value: false },
        ...defs
      ], (id) => {
        if (PRE[id]) { for (const f of F) ctl.set(f.id, PRE[id][f.id] || 0, false); }
        loop.once();
      });
      const V = ctl.values;
      for (const f of F) ctl.set(f.id, PRE.burger[f.id] || 0, false);
      const ro = kit.readout(box.side, [['tot', 'Water footprint of the meal'], ['bath', 'In baths of 150 L'], ['drink', 'Days of drinking water (2.5 L)'], ['day', 'Share of an average day\'s 3,800 L'], ['split', 'Green | blue | grey']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const rows = F.map(f => ({ f, kg: V[f.id] / 1000 })).filter(r => r.kg > 0).map(r => ({ ...r, G: r.kg * r.f.g, B: r.kg * r.f.b, Y: r.kg * r.f.y }));
        const useBlue = V.blue;
        const val = r => useBlue ? r.B : r.G + r.B + r.Y;
        const totG = rows.reduce((a, r) => a + r.G, 0), totB = rows.reduce((a, r) => a + r.B, 0), totY = rows.reduce((a, r) => a + r.Y, 0), tot = useBlue ? totB : totG + totB + totY;
        const lx = 118, bw = Wd - lx - 24, mx = Math.max(useBlue ? 300 : 4000, tot * 1.08), px = v => lx + v / mx * bw;
        const bar = (x0, y, h, r) => {
          let x = x0;
          for (const [v, col] of (useBlue ? [[r.B, C.accent]] : [[r.G, C.ok], [r.B, C.accent], [r.Y, C.muted]])) { const w = v / mx * bw; if (w > 0) { c.fillStyle = col; c.fillRect(x, y, w, h); x += w; } }
        };
        kit.label(c, 'This meal', 8, 34, { size: 13, weight: 700 });
        bar(lx, 22, 26, { G: totG, B: totB, Y: totY });
        kit.label(c, Math.round(tot).toLocaleString('en-GB') + ' L', px(tot) + 6, 35, { size: 12.5, weight: 700 });
        // reference markers
        const refs = useBlue ? [[150, 'a bath, 150 L']] : [[150, 'a bath, 150 L'], [3800, 'average day, 3,800 L']];
        refs.forEach(([v, nm], i) => { if (v <= mx) { c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(px(v), 58); c.lineTo(px(v), Hh - 24); c.stroke(); c.setLineDash([]); kit.label(c, nm, px(v) + 3, 66 + i * 14, { size: 10.5, color: C.muted }); } });
        const sorted = rows.slice().sort((a, b) => val(b) - val(a));
        const ry0 = 84, rh = Math.min(30, (Hh - ry0 - 40) / Math.max(1, sorted.length));
        sorted.forEach((r, i) => {
          const y = ry0 + i * rh;
          kit.label(c, r.f.n + ' ' + V[r.f.id] + ' g', 8, y + rh * 0.4, { size: 11.5 });
          bar(lx, y, rh * 0.62, r);
          kit.label(c, Math.round(val(r)).toLocaleString('en-GB') + ' L', px(val(r)) + 5, y + rh * 0.34, { size: 11, color: C.muted });
        });
        if (!rows.length) kit.label(c, 'Choose some foods, or press a meal.', Wd / 2, Hh / 2, { align: 'center', color: C.muted });
        const key = useBlue ? [['blue: taken from rivers and wells', C.accent]] : [['green: rain on the crop', C.ok], ['blue: river and well water', C.accent], ['grey: dilution of pollution', C.muted]];
        key.forEach(([t, col], i) => { c.fillStyle = col; c.fillRect(8 + i * Math.min(190, Wd / 3), Hh - 16, 10, 10); kit.label(c, t, 22 + i * Math.min(190, Wd / 3), Hh - 11, { size: 10.5, color: C.muted }); });
        const all = totG + totB + totY;
        ro.set('tot', Math.round(all).toLocaleString('en-GB') + ' L  (blue part ' + Math.round(totB).toLocaleString('en-GB') + ' L)');
        ro.set('bath', (all / 150).toFixed(1));
        ro.set('drink', (all / 2.5).toFixed(0) + ' days');
        ro.set('day', (all / 3800 * 100).toFixed(0) + ' %');
        ro.set('split', all > 0 ? (totG / all * 100).toFixed(0) + ' % | ' + (totB / all * 100).toFixed(0) + ' % | ' + (totY / all * 100).toFixed(0) + ' %' : '—');
      }, box.stage);
      loop.once();
      loop.start();
    }
  });
})();
