/* HYPER-WATER · sims/the-sculptor-inside-every-cell.js — the simulations of the topic "The sculptor inside every cell".
 *   cell-crowded-cytoplasm   a cell's interior: crowded macromolecules, 99 % water by number, slowed first-shell water
 *   cell-body-water          where the body's water is (by age, sex and fat) and the daily water budget (a schematic model)
 *   cell-protein-surface     a protein surface with its ordered first shell, a looser second shell and the bulk beyond
 *   cell-hp-folding          the HP lattice model: hydrophobic (H) and polar (P) beads folding by Monte Carlo (schematic)
 *   cell-bilayer             amphiphiles on a 2-D lattice sorting themselves, the tails hiding from water (schematic)
 *   cell-dna-helix           the double helix at a chosen humidity: A form dry, B form wet; base pairs and melting
 *   cell-metabolic-water     water made by burning food against the water lost in breathing out
 *   cell-water-wire          a proton hopping along a chain of water (enzyme), the aquaporin that blocks it, a proton-gradient vent
 *   cell-osmosis             a red cell, a plant cell and a pond protist in solutions of chosen osmolarity
 * Numbers come from kit.water where the engine has them (densities, diffusion, bond lifetime, humidity, osmotic pressure,
 * pKw); the models that the engine does not hold (folding, self-assembly, hopping, fluid balance) are small, simple and
 * labelled "schematic" in their blurbs.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  /* a small seeded random generator (mulberry32) so a reshuffle is repeatable and the headless test is steady */
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pc = (f, d) => (100 * f).toFixed(d == null ? 0 : d) + ' %';

  /* ================================================================ the crowded cell */
  Hyper.sim('cell-crowded-cytoplasm', {
    title: 'Inside a crowded cell',
    blurb: `A slice through a cell, drawn as a flat section. The large discs are proteins and other macromolecules; the small dots are water molecules, far fewer than in the real cell (there are about 99 water molecules for every 1 of anything else). Orange dots are water in the first layer on a surface, whose motion is slowed by a factor of two or three; blue dots are water that behaves like water in a glass.

**Try this**
- Slide the macromolecule concentration from 50 to 450 g/L. Real cytoplasm is at 300–400 g/L: the gaps shrink to a handful of water molecules and no water is ever far from a surface.
- Compare the two bars on the right: by number the cell is 99 % water, by mass about two-thirds. Both are true; they count different things.
- Tick *Slow motion* and follow one orange dot against one blue dot: the first-shell water barely moves while the bulk water streams past.
- Warm the cell to 60 °C and see everything speed up, the orange water included: the ratio of the speeds hardly changes.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'c', label: 'Macromolecules', min: 50, max: 450, step: 10, value: params.c || 330, unit: 'g/L' },
        { id: 'T', label: 'Temperature', min: 0, max: 60, step: 1, value: 37, unit: '°C' },
        { id: 'water', type: 'check', label: 'Show water molecules', value: true },
        { id: 'shells', type: 'check', label: 'Mark the slowed first-shell water', value: true },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'shake', label: 'Reshuffle', primary: true }] }
      ], (id) => { if (id === 'c' || id === 'shake') build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['num', 'Water, by number of molecules'], ['mass', 'Water, by mass'], ['vol', 'Volume taken by macromolecules'], ['gap', 'Gap between neighbouring proteins'], ['shell', 'Water in first shells'], ['D', 'Mean water diffusion in the cell']]);
      const rnd = rng(11);
      let discs = [], water = [], bx = 12, by = 12, bw = 400, bh = 300;
      const SMALL = 30, CELL = 1050, MPROT = 50000;   // g/L of small solutes, g/L total, a typical 50 kDa protein
      function model(c, T) {
        const wmass = Math.max(1, CELL - c - SMALL);            // g/L of water
        const nw = wmass / 18.015;                                 // mol/L
        const ns = 0.30 + c / MPROT;                               // small solutes ~0.3 mol/L plus the macromolecules
        const xw = nw / (nw + ns);
        const fsh = Math.min(0.6, 0.3 * c / wmass);                // 0.3 g water per g of macromolecule in the first layer
        const n = (c / MPROT) * 1e3 * W.NA;                        // macromolecules per m³
        const sp = Math.cbrt(1 / n);                               // mean centre-to-centre spacing
        const Vp = (MPROT / 1e3) / (W.NA * 1350);                  // volume of one protein, m³ (1350 kg/m³)
        const dp = Math.cbrt(6 * Vp / Math.PI);
        return { xw, mass: wmass / CELL, vol: c / 1350, gap: Math.max(0, (sp - dp) * 1e9), fsh, D: W.selfDiffusion(T) * (fsh / 2.5 + 1 - fsh) };
      }
      const near = (x, y) => { let m = 1e9; for (const d of discs) { const e = Math.hypot(d.x - x, d.y - y) - d.r; if (e < m) m = e; } return m; };
      function build() {
        const Wd = st.W, Hh = st.H;
        bx = 12; by = 12; bw = Math.max(200, Wd * 0.6); bh = Math.max(150, Hh - 24);
        discs = [];
        const target = clamp(V.c / 1350, 0.03, 0.4) * bw * bh;
        const radii = [10, 12, 15, 18, 22];
        let area = 0, tries = 0;
        while (area < target && tries < 6000) {
          tries++;
          const r = radii[Math.floor(rnd() * radii.length)];
          const x = bx + r + rnd() * (bw - 2 * r), y = by + r + rnd() * (bh - 2 * r);
          let ok = true;
          for (const d of discs) if (Math.hypot(d.x - x, d.y - y) < d.r + r + 3) { ok = false; break; }
          if (ok) { discs.push({ x, y, r, col: Math.floor(rnd() * 6) }); area += Math.PI * r * r; }
        }
        water = [];
        let guard = 0;
        while (water.length < 460 && guard < 20000) {
          guard++;
          const x = bx + 3 + rnd() * (bw - 6), y = by + 3 + rnd() * (bh - 6);
          if (near(x, y) < 2) continue;
          water.push({ x, y, sh: near(x, y) < 7 });
        }
      }
      build();
      st.onResize(() => build());
      function bar(c, C, x, y, w, parts, title) {
        kit.label(c, title, x, y - 6, { color: C.muted, size: 10.5 });
        let xx = x;
        for (const p of parts) {
          const ww = Math.max(2, p.f * w);
          c.fillStyle = p.color; c.fillRect(xx, y, ww, 20); xx += ww;
        }
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x, y, w, 20);
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const h = Math.min(dt, 0.05) * (V.slow ? 0.25 : 1);
        const k = Math.sqrt(h * 60), tf = Math.sqrt((V.T + 273.15) / 310.15);
        // the macromolecules shuffle slowly
        for (const d of discs) {
          const nx = d.x + (rnd() - 0.5) * 1.0 * k * tf, ny = d.y + (rnd() - 0.5) * 1.0 * k * tf;
          if (nx < bx + d.r || nx > bx + bw - d.r || ny < by + d.r || ny > by + bh - d.r) continue;
          let ok = true;
          for (const e of discs) if (e !== d && Math.hypot(e.x - nx, e.y - ny) < e.r + d.r + 1) { ok = false; break; }
          if (ok) { d.x = nx; d.y = ny; }
        }
        // the water: bulk water moves freely, first-shell water about 2.5 times more slowly
        for (const w of water) {
          const s = (w.sh ? 0.9 : 2.2) * k * tf;
          const nx = w.x + (rnd() - 0.5) * 2 * s, ny = w.y + (rnd() - 0.5) * 2 * s;
          if (nx < bx + 2 || nx > bx + bw - 2 || ny < by + 2 || ny > by + bh - 2) continue;
          const e = near(nx, ny);
          if (e < 1.5) continue;
          w.x = nx; w.y = ny; w.sh = e < 7;
        }
        c.strokeStyle = C.faint; c.lineWidth = 1.5; c.strokeRect(bx, by, bw, bh);
        for (const d of discs) {
          c.beginPath(); c.arc(d.x, d.y, d.r, 0, TAU);
          c.fillStyle = C.series[d.col % C.series.length]; c.globalAlpha = 0.8; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 0.8; c.stroke();
        }
        if (V.shells) {
          c.strokeStyle = C.warn; c.lineWidth = 1; c.globalAlpha = 0.55; c.setLineDash([3, 3]);
          for (const d of discs) { c.beginPath(); c.arc(d.x, d.y, d.r + 7, 0, TAU); c.stroke(); }
          c.setLineDash([]); c.globalAlpha = 1;
        }
        if (V.water) {
          c.fillStyle = C.accent; c.globalAlpha = 0.85; c.beginPath();
          for (const w of water) if (!(V.shells && w.sh)) { c.moveTo(w.x + 1.7, w.y); c.arc(w.x, w.y, 1.7, 0, TAU); }
          c.fill();
          if (V.shells) {
            c.fillStyle = C.warn; c.globalAlpha = 1; c.beginPath();
            for (const w of water) if (w.sh) { c.moveTo(w.x + 2.1, w.y); c.arc(w.x, w.y, 2.1, 0, TAU); }
            c.fill();
          }
          c.globalAlpha = 1;
        }
        // the shares on the right
        const m = model(V.c, V.T), x0 = bx + bw + 14, pw = Math.max(60, Wd - x0 - 10);
        bar(c, C, x0, by + 28, pw, [{ f: 1 - m.xw, color: C.warn }, { f: m.xw, color: C.accent }], 'by number of molecules');
        kit.label(c, pc(m.xw, 1) + ' water', x0, by + 60, { color: C.accent, size: 12, weight: 650 });
        bar(c, C, x0, by + 100, pw, [{ f: 1 - m.mass, color: C.warn }, { f: m.mass, color: C.accent }], 'by mass');
        kit.label(c, pc(m.mass, 0) + ' water', x0, by + 134, { color: C.accent, size: 12, weight: 650 });
        kit.label(c, 'orange: slowed shell water', x0, by + 170, { color: C.warn, size: 10.5 });
        kit.label(c, 'blue: bulk-like water', x0, by + 186, { color: C.accent, size: 10.5 });
        kit.label(c, 'discs: proteins, RNA …', x0, by + 202, { color: C.muted, size: 10.5 });
        kit.label(c, 'a flat slice, not to scale', x0, by + 226, { color: C.faint, size: 10 });
        ro.set('num', pc(m.xw, 2));
        ro.set('mass', pc(m.mass, 0));
        ro.set('vol', pc(m.vol, 0) + ' of the cell volume');
        ro.set('gap', m.gap.toFixed(1) + ' nm (about ' + Math.round(m.gap / 0.28) + ' water molecules wide)');
        ro.set('shell', pc(m.fsh, 0) + ' of the cell water');
        ro.set('D', (m.D * 1e9).toFixed(2) + ' × 10⁻⁹ m²/s (' + (100 * m.D / W.selfDiffusion(V.T)).toFixed(0) + ' % of pure water)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ where the body's water is, and the daily budget */
  Hyper.sim('cell-body-water', {
    title: 'The body as a bag of water',
    blurb: `Two views of the same 42 litres. **Where the water is** splits a person's water into the cells (intracellular), the fluid around them (interstitial) and the blood plasma, for a newborn, a child, a man, a woman and the elderly, and lets you change the body mass and the fat: fat holds little water, so the leaner the person, the wetter. **The daily budget** follows the water in and out for three days and shows what the kidneys do about it. Both are schematic, built from standard textbook physiology, and they illustrate how the balance works; they are not advice on how much anyone should drink.

**Try this**
- In *Where the water is*, compare the newborn (75 %) with the older woman (about 46 %), then drag *Body fat* on the adult man from 10 % to 40 %: the water percentage falls with the fat.
- In *The daily budget*, leave the defaults: intake and output balance at about 2.5 L a day and the line is flat.
- Cut the drinks to 0.3 L and watch the plasma salt concentration (osmolality) rise towards the thirst threshold while the kidneys make little, strong urine.
- Raise the temperature to 38 °C and add an hour of exercise, then tick *Drink when thirsty*.
- Put 5 L of drinks into a 2-hour window: the kidneys can pass only about half a litre an hour, the blood is diluted, and the sodium line crosses the low-sodium mark.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const GROUPS = [['Newborn', 'newborn'], ['Infant, 1 year', 'infant'], ['Adult man', 'man'], ['Adult woman', 'woman'], ['Older man (70+)', 'oman'], ['Older woman (70+)', 'owoman']];
      const G = {
        newborn: { tbw: 0.75, fat: 0.14, ecf: 0.533, m: 3.5 }, infant: { tbw: 0.65, fat: 0.25, ecf: 0.385, m: 10 },
        man: { tbw: 0.60, fat: 0.20, ecf: 0.333, m: 70 }, woman: { tbw: 0.52, fat: 0.30, ecf: 0.36, m: 60 },
        oman: { tbw: 0.54, fat: 0.28, ecf: 0.37, m: 75 }, owoman: { tbw: 0.46, fat: 0.38, ecf: 0.40, m: 62 }
      };
      const ORGANS = [['Blood plasma', 92], ['Lung', 83], ['Kidney', 79], ['Heart', 79], ['Skeletal muscle', 76], ['Brain', 75], ['Liver', 70], ['Skin', 65], ['Fat tissue (10–20)', 15], ['Bone', 30]];
      const view0 = params.view === 'budget' ? 'budget' : 'where';
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Where the water is', 'where'], ['The daily budget', 'budget']], value: view0 },
        { id: 'grp', type: 'select', label: 'Person', options: GROUPS, value: params.grp || 'man' },
        { id: 'm', label: 'Body mass', min: 3, max: 120, step: 0.5, value: (G[params.grp || 'man'] || G.man).m, unit: 'kg' },
        { id: 'fat', label: 'Body fat', min: 5, max: 50, step: 1, value: Math.round(100 * (G[params.grp || 'man'] || G.man).fat), unit: '%' },
        { id: 'drink', label: 'Drinks per day', min: 0, max: 8, step: 0.1, value: 1.4, unit: 'L' },
        { id: 'win', label: 'Drunk within', min: 1, max: 16, step: 1, value: 12, unit: 'h' },
        { id: 'amb', label: 'Air temperature', min: 5, max: 42, step: 1, value: 20, unit: '°C' },
        { id: 'ex', label: 'Hard exercise', min: 0, max: 4, step: 0.5, value: 0, unit: 'h/day' },
        { id: 'thirst', type: 'check', label: 'Drink when thirsty', value: false }
      ], (id) => {
        if (id === 'grp') { const g = G[V.grp]; ctl.set('m', g.m); ctl.set('fat', Math.round(100 * g.fat)); }
        if (id === 'view') { setView(); }
        dirty = true;
      });
      const V = ctl.values;
      const roA = kit.readout(box.side, [['tbw', 'Total body water'], ['icf', 'Inside the cells'], ['ecf', 'Outside the cells'], ['int', '  of which interstitial'], ['pl', '  of which blood plasma'], ['dry', 'Not water']]);
      const roB = kit.readout(box.side, [['in', 'Intake per day'], ['out', 'Output per day'], ['bal', 'Balance'], ['osm', 'Plasma osmolality over the 3 days'], ['na', 'Plasma sodium, lowest (schematic)'], ['urine', 'Urine per day'], ['flag', 'State']]);
      const plot = kit.plot(graph, { x: { label: 'time (hours)', min: 0, max: 72 }, y: { label: 'change in body water (L)' } }, 190);
      let dirty = true, cur = { icf: 28, int: 11, pl: 3, dry: 28 }, sim = null;
      function setView() {
        const w = V.view === 'where';
        for (const id of ['grp', 'm', 'fat']) ctl.show(id, w);
        for (const id of ['drink', 'win', 'amb', 'ex', 'thirst']) ctl.show(id, !w);
        roA.show(w); roB.show(!w);
        graph.style.display = w ? 'none' : '';
      }
      setView();
      function where() {
        const g = G[V.grp] || G.man, f = V.fat / 100;
        const lean = (g.tbw - 0.10 * g.fat) / (1 - g.fat);
        const frac = (1 - f) * lean + f * 0.10;
        const tbw = V.m * frac, ecf = tbw * g.ecf, pl = ecf * 0.214;
        return { frac, tbw, ecf, icf: tbw - ecf, int: ecf - pl, pl, dry: V.m - tbw };
      }
      /* the budget: hourly steps for three days from 07:00; schematic textbook physiology */
      function simulate() {
        const dt = 0.25, W0 = 42, thirstP = 293;
        const dr = V.drink / V.win;
        let Wt = W0, maxP = 285, minP = 285, minNa = 140;
        const pts = [], acc = { drink: 0, food: 0, meta: 0, urine: 0, sb: 0, sweat: 0, fae: 0, extra: 0 };
        for (let i = 0; i <= 72 / dt; i++) {
          const t = i * dt, tod = t % 24;
          const P = 285 * W0 / Wt;
          let drink = tod < V.win ? dr : 0, extra = 0;
          if (V.thirst && P > 292) extra = 0.35;
          const food = 0.8 / 24, meta = 0.3 / 24;
          const sb = 0.9 / 24 * (1 + Math.max(0, V.amb - 22) * 0.02);
          const sw = 0.012 * Math.max(0, V.amb - 27) + (tod >= 10 && tod < 10 + V.ex ? 0.5 + 0.03 * Math.max(0, V.amb - 15) : 0);
          const U = 50 + 1150 * clamp((P - 281) / 11, 0, 1);
          const urine = 700 / 24 / U, fae = 0.1 / 24;
          pts.push([t, Wt - W0]);
          maxP = Math.max(maxP, P); minP = Math.min(minP, P); minNa = Math.min(minNa, 140 * W0 / Wt);
          if (i === 72 / dt) break;
          if (t >= 48) { acc.drink += drink * dt; acc.extra += extra * dt; acc.food += food * dt; acc.meta += meta * dt; acc.urine += urine * dt; acc.sb += sb * dt; acc.sweat += sw * dt; acc.fae += fae * dt; }
          Wt = Math.max(34, Wt + dt * (drink + extra + food + meta - sb - sw - urine - fae));
        }
        const Pend = 285 * W0 / Wt;
        return { pts, acc, Wt, P: Pend, Na: 140 * W0 / Wt, maxP, minP, minNa, W0, thirstP };
      }
      const tank = (c, C, x, y, w, h, parts, scale, title) => {
        let yy = y + h;
        for (const p of parts) {
          const hh = p.v * scale;
          c.fillStyle = p.color; c.fillRect(x, yy - hh, w, hh); yy -= hh;
          if (hh > 13) kit.label(c, p.label, x + w / 2, yy + hh / 2, { color: p.tc || C.text, size: 11, align: 'center', baseline: 'middle' });
        }
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x, yy, w, y + h - yy);
        kit.label(c, title, x + w / 2, y + h + 14, { color: C.muted, size: 11.5, align: 'center' });
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.view === 'where') {
          const w = where();
          const k = Math.min(1, dt * 6);
          cur.icf = lerp(cur.icf, w.icf, k); cur.int = lerp(cur.int, w.int, k); cur.pl = lerp(cur.pl, w.pl, k); cur.dry = lerp(cur.dry, w.dry, k);
          const th = Hh - 70;
          const sc2 = th / (Math.max(V.m, 1) * 1.0);
          tank(c, C, 24, 36, 70, th, [
            { v: cur.dry, color: C.faint, label: cur.dry > 1 ? 'not water ' + cur.dry.toFixed(0) : '', tc: C.text },
            { v: cur.icf, color: C.accent, label: 'cells ' + cur.icf.toFixed(1) + ' L', tc: '#fff' },
            { v: cur.int, color: C.series[2], label: 'between ' + cur.int.toFixed(1), tc: '#fff' },
            { v: cur.pl, color: C.bad, label: '', tc: '#fff' }
          ], sc2, 'body mass ' + V.m.toFixed(0) + ' kg');
          kit.label(c, 'plasma ' + cur.pl.toFixed(1) + ' L', 24, 24, { color: C.bad, size: 11, weight: 650 });
          // the water share of every kind of person
          const x0 = 116, pw = Math.max(120, Wd * 0.3);
          kit.label(c, 'water, share of body mass', x0, 24, { color: C.muted, size: 10.5 });
          GROUPS.forEach((gr, i) => {
            const y = 36 + i * 30, g = G[gr[1]], sel = gr[1] === V.grp;
            c.fillStyle = sel ? C.accent : C.series[0]; c.globalAlpha = sel ? 0.95 : 0.35;
            c.fillRect(x0, y, pw * g.tbw, 18); c.globalAlpha = 1;
            kit.label(c, gr[0] + '  ' + Math.round(100 * g.tbw) + ' %', x0 + 4, y + 9, { color: C.text, size: 11, baseline: 'middle', weight: sel ? 700 : 400 });
            if (sel) { c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + pw * w.frac, y - 3); c.lineTo(x0 + pw * w.frac, y + 21); c.stroke(); }
          });
          kit.label(c, 'mark: this body at ' + V.fat.toFixed(0) + ' % fat', x0, 36 + 6 * 30 + 8, { color: C.warn, size: 10.5 });
          // organs
          const ox = x0 + pw + 30, ow = Math.max(80, Wd - ox - 16);
          if (ow > 110) {
            kit.label(c, 'water in the tissues', ox, 24, { color: C.muted, size: 10.5 });
            ORGANS.forEach((o, i) => {
              const y = 36 + i * 24;
              c.fillStyle = C.series[2]; c.globalAlpha = 0.45; c.fillRect(ox, y, ow * o[1] / 100, 16); c.globalAlpha = 1;
              kit.label(c, o[0] + ' ' + (o[1] === 15 ? '' : o[1] + ' %'), ox + 4, y + 8, { color: C.text, size: 10.5, baseline: 'middle' });
            });
          }
          roA.set('tbw', w.tbw.toFixed(1) + ' L (' + pc(w.frac, 0) + ' of body mass)');
          roA.set('icf', w.icf.toFixed(1) + ' L (' + pc(w.icf / Math.max(w.tbw, 1e-9), 0) + ' of the water)');
          roA.set('ecf', w.ecf.toFixed(1) + ' L');
          roA.set('int', w.int.toFixed(1) + ' L');
          roA.set('pl', w.pl.toFixed(2) + ' L');
          roA.set('dry', w.dry.toFixed(1) + ' kg (protein, fat, minerals)');
        } else {
          if (dirty || !sim) {
            sim = simulate();
            plot.set({ series: [{ pts: sim.pts, label: 'body water vs normal', color: C.accent }], x: { label: 'time (hours from 07:00)', min: 0, max: 72 }, y: { label: 'change in body water (L)', min: Math.min(-3, ...sim.pts.map(p => p[1])), max: Math.max(3, ...sim.pts.map(p => p[1])) }, hlines: [{ y: 42 * (285 / sim.thirstP - 1), label: 'thirst threshold' }, { y: 42 * (140 / 135 - 1), label: 'sodium 135 mmol/L' }] });
          }
          const a = sim.acc;
          const ins = [{ v: a.drink + a.extra, color: C.accent, label: 'drinks' }, { v: a.food, color: C.series[2], label: 'food' }, { v: a.meta, color: C.series[4], label: 'metabolic' }];
          const outs = [{ v: a.urine, color: C.warn, label: 'urine' }, { v: a.sb, color: C.series[3], label: 'skin + breath' }, { v: a.sweat, color: C.bad, label: 'sweat' }, { v: a.fae, color: C.faint, label: '' }];
          const tin = ins.reduce((s, p) => s + p.v, 0), tout = outs.reduce((s, p) => s + p.v, 0);
          const th = Hh - 70, sc = th / Math.max(4, tin, tout);
          kit.label(c, 'the last of the three days, litres', 24, 14, { color: C.muted, size: 10.5 });
          tank(c, C, 24, 28, 64, th - 6, ins, sc, 'in ' + tin.toFixed(2) + ' L');
          tank(c, C, 108, 28, 64, th - 6, outs, sc, 'out ' + tout.toFixed(2) + ' L');
          const bal = tin - tout;
          const x0 = 200;
          kit.label(c, 'urine ' + a.urine.toFixed(2) + ' L', x0, 52, { color: C.warn, size: 11 });
          kit.label(c, 'sweat ' + a.sweat.toFixed(2) + ' L', x0, 68, { color: C.bad, size: 11 });
          kit.label(c, 'skin + breath ' + a.sb.toFixed(2) + ' L', x0, 84, { color: C.series[3], size: 11 });
          if (Wd - x0 > 150) {
            kit.label(c, 'plasma osmolality, schematic', x0, 112, { color: C.muted, size: 10.5 });
            const yb = 122, pw2 = Wd - x0 - 24;
            c.fillStyle = C.faint; c.globalAlpha = 0.3; c.fillRect(x0, yb, pw2, 18); c.globalAlpha = 1;
            const xs = v => x0 + pw2 * clamp((v - 275) / (305 - 275), 0, 1);
            c.fillStyle = C.accent; c.fillRect(x0, yb, xs(sim.P) - x0, 18);
            c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(xs(sim.thirstP), yb - 4); c.lineTo(xs(sim.thirstP), yb + 22); c.stroke();
            kit.label(c, 'thirst ≈ ' + sim.thirstP, x0 + pw2, yb + 36, { color: C.bad, size: 10.5, align: 'right' });
            kit.label(c, sim.P.toFixed(0) + ' mOsm/kg at the end', x0, yb + 36, { color: C.text, size: 10.5 });
          }
          const lossPc = (sim.W0 - sim.Wt) / 70 * 100;
          const flag = sim.minNa < 135 ? 'blood sodium diluted to ' + sim.minNa.toFixed(0) + ' mmol/L, below the usual 135' : lossPc > 3 ? 'a loss of ' + lossPc.toFixed(1) + ' % of body mass: in life, thirst would have forced a drink long before' : sim.P >= sim.thirstP ? 'past the thirst threshold' : sim.maxP >= sim.thirstP ? 'thirst threshold reached, then relieved' : Math.abs(bal) < 0.15 ? 'in balance' : bal > 0 ? 'taking in more than going out' : 'losing more than coming in';
          roB.set('in', tin.toFixed(2) + ' L (drinks ' + (a.drink + a.extra).toFixed(2) + ', food ' + a.food.toFixed(2) + ', metabolic ' + a.meta.toFixed(2) + ')');
          roB.set('out', tout.toFixed(2) + ' L');
          roB.set('bal', (bal >= 0 ? '+' : '') + bal.toFixed(2) + ' L per day');
          roB.set('osm', sim.minP.toFixed(0) + ' to ' + sim.maxP.toFixed(0) + ' mOsm/kg (usual range about 285–295)');
          roB.set('na', sim.minNa.toFixed(0) + ' mmol/L at the lowest (usual range 135–145)');
          roB.set('urine', a.urine.toFixed(2) + ' L');
          roB.set('flag', flag);
        }
        dirty = false;
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the surface of a protein */
  Hyper.sim('cell-protein-surface', {
    title: 'A protein and its water',
    blurb: `A slice through a small protein (the blob) in water, drawn at true scale: the protein is about 3 nm across and a water molecule 0.28 nm. The coloured patches on the surface are polar (blue), charged (green and red) and oily (orange). Water molecules next to the polar and charged patches sit in definite places, pointing their hydrogens or oxygens at the surface; the next layer is looser; beyond that the water is ordinary liquid.

**Try this**
- Colour the water by *Layer*: the first layer is outlined in orange, the second in yellow. Then colour by *Speed* and watch the first layer barely move while the bulk water streams past.
- Slide the protein mass from 6 to 150 kDa and read the hydration: a small protein carries about 0.35 g of water per gram in its first layer, a large one less, because surface grows more slowly than mass.
- Warm the water: all of it speeds up, and the read-out gives the bond lifetime and the diffusion for the bulk and the first layer.
- Look at the oily patches: few water molecules sit directly on them, and those that do are loosely held. Water prefers its own company to that of oil.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Protein mass', min: 6, max: 150, step: 1, value: params.M || 14, unit: 'kDa' },
        { id: 'T', label: 'Temperature', min: 0, max: 80, step: 1, value: 25, unit: '°C' },
        { id: 'view', type: 'select', label: 'Colour the water by', options: [['Layer', 'layer'], ['Speed', 'speed']], value: params.view || 'layer' },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'new', label: 'New surface', primary: true }] }
      ], (id) => { if (id === 'M' || id === 'new') build(id === 'new'); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A', 'Surface area (estimate)'], ['N1', 'Waters in the first layer'], ['g', 'Water per gram of protein'], ['tb', 'Bond reorganisation time, bulk'], ['ts', 'Bond reorganisation time, first layer'], ['D', 'Diffusion, bulk and first layer']]);
      let seed = 5, shape = [], types = [], waters = [], sc = 4, cx = 200, cy = 150, rA = 16;
      const TYPE_COL = ['accent', 'ok', 'bad', 'warn'];    // polar, positive, negative, oily
      const rnd = rng(99);
      function sphereRadius(M) {                                 // Å, for a protein of M kDa at 1.35 g/cm³
        const vol = M * 1e3 / (W.NA * 1.35);                        // cm³
        return Math.cbrt(3 * vol / (4 * Math.PI)) * 1e8;           // cm → Å
      }
      let p1 = 0, p2 = 1, p3 = 2;
      const R = th => rA * (1 + 0.09 * Math.sin(3 * th + p1) + 0.06 * Math.sin(5 * th + p2) + 0.04 * Math.sin(2 * th + p3));
      function build(fresh) {
        if (fresh) seed = (seed * 7 + 13) % 997;
        const rnd = rng(seed);
        p1 = rnd() * TAU; p2 = rnd() * TAU; p3 = rnd() * TAU;
        const Wd = st.W, Hh = st.H;
        rA = sphereRadius(V.M);
        sc = clamp((Hh / 2 - 36) / (rA * 1.12 + 9), 2.3, 5.4);
        cx = Wd * 0.5; cy = Hh * 0.5;
        // patches around the surface: runs of the same kind
        types = [];
        const NB = 72;
        while (types.length < NB) {
          const u = rnd(), t = u < 0.5 ? 0 : u < 0.62 ? 1 : u < 0.74 ? 2 : 3, len = 4 + Math.floor(rnd() * 6);
          for (let i = 0; i < len && types.length < NB; i++) types.push(t);
        }
        waters = [];
        // layer 1: sites round the surface, 3.0 Å apart on average
        const perim = TAU * rA * 1.0;
        const n1 = Math.max(8, Math.round(perim / 3.1));
        for (let i = 0; i < n1; i++) {
          const th = (i + 0.5) / n1 * TAU, kind = types[Math.floor(th / TAU * NB) % NB];
          if (kind === 3 && rnd() < 0.55) continue;                  // few waters sit on oily patches
          const d = kind === 3 ? 3.0 : 1.95;
          waters.push({ L: 1, th, d: R(th) + d, kind, ox: 0, oy: 0, a0: th + Math.PI * (rnd() < 0.5 ? 0 : 1), a: 0 });
        }
        // layer 2
        const n2 = Math.max(8, Math.round(TAU * (rA + 4.8) / 3.4));
        for (let i = 0; i < n2; i++) {
          if (rnd() < 0.25) continue;
          const th = (i + rnd() * 0.5) / n2 * TAU;
          waters.push({ L: 2, th, d: R(th) + 4.9, kind: -1, ox: 0, oy: 0, a0: rnd() * TAU, a: 0 });
        }
        // the bulk: free walkers further out
        let guard = 0, nb = 0;
        while (nb < 150 && guard < 6000) {
          guard++;
          const x = (rnd() - 0.5) * Wd / sc, y = (rnd() - 0.5) * Hh / sc, rr = Math.hypot(x, y), th = Math.atan2(y, x);
          if (rr < R(th) + 7) continue;
          waters.push({ L: 3, x, y, a: rnd() * TAU }); nb++;
        }
      }
      build(false);
      st.onResize(() => build(false));
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const h = Math.min(dt, 0.05) * (V.slow ? 0.25 : 1), k = Math.sqrt(h * 60), tf = Math.sqrt((V.T + 273.15) / 298.15);
        cx = Wd * 0.5; cy = Hh * 0.5;
        // the protein
        c.beginPath();
        for (let i = 0; i <= 120; i++) { const th = i / 120 * TAU, r = R(th) * sc; const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th); i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.stroke();
        for (let i = 0; i < types.length; i++) {
          const t0 = i / types.length * TAU, t1 = (i + 1) / types.length * TAU;
          c.beginPath();
          for (let j = 0; j <= 4; j++) { const th = lerp(t0, t1, j / 4), r = R(th) * sc; const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th); j ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.strokeStyle = C[TYPE_COL[types[i]]]; c.lineWidth = 5; c.lineCap = 'butt'; c.stroke();
        }
        kit.label(c, 'protein', cx, cy - 6, { color: C.muted, size: 13, align: 'center', baseline: 'middle' });
        kit.label(c, V.M.toFixed(0) + ' kDa · ' + (2 * rA / 10).toFixed(1) + ' nm across', cx, cy + 12, { color: C.faint, size: 11, align: 'center', baseline: 'middle' });
        // the water
        const speedMode = V.view === 'speed';
        for (const w of waters) {
          let x, y;
          if (w.L === 3) {
            const s = 1.5 * k * tf;
            const nx = w.x + (rnd() - 0.5) * 2 * s, ny = w.y + (rnd() - 0.5) * 2 * s;
            const th = Math.atan2(ny, nx);
            if (Math.hypot(nx, ny) > R(th) + 6.6 && Math.abs(nx) < Wd / 2 / sc - 1 && Math.abs(ny) < Hh / 2 / sc - 1) { w.x = nx; w.y = ny; }
            w.a += (rnd() - 0.5) * 0.5 * k * tf;
            x = cx + w.x * sc; y = cy + w.y * sc;
          } else {
            const amp = (w.L === 1 ? (w.kind === 3 ? 0.5 : 0.18) : 0.55) * tf * k;
            w.ox = w.ox * 0.88 + (rnd() - 0.5) * 2 * amp; w.oy = w.oy * 0.88 + (rnd() - 0.5) * 2 * amp;
            const r = w.d + w.ox;
            x = cx + (r * Math.cos(w.th) - w.oy * Math.sin(w.th)) * sc; y = cy + (r * Math.sin(w.th) + w.oy * Math.cos(w.th)) * sc;
            const wob = (w.L === 1 ? (w.kind === 3 ? 0.5 : 0.12) : 0.5) * tf;
            w.a = w.a0 + Math.sin(w.th * 7 + (w.ox + w.oy) * 3) * wob + w.ox * 0.4;
          }
          const col = w.L === 1 ? C.warn : w.L === 2 ? 'rgba(235,205,90,1)' : C.accent;
          if (!speedMode) { c.beginPath(); c.arc(x, y, 2.1 * sc, 0, TAU); c.strokeStyle = col; c.globalAlpha = w.L === 3 ? 0 : 0.8; c.lineWidth = 1.2; if (w.L !== 3) c.stroke(); c.globalAlpha = 1; }
          else { c.beginPath(); c.arc(x, y, 2.3 * sc, 0, TAU); c.fillStyle = w.L === 1 ? C.warn : w.L === 2 ? 'rgba(235,205,90,1)' : C.accent; c.globalAlpha = w.L === 1 ? 0.55 : w.L === 2 ? 0.4 : 0.18; c.fill(); c.globalAlpha = 1; }
          S.molecule(c, x, y, { angle: w.a, scale: sc * 1.05 });
        }
        // legend
        kit.label(c, 'first layer: slowed 2–3×', 10, Hh - 44, { color: C.warn, size: 10.5 });
        kit.label(c, 'second layer: looser', 10, Hh - 29, { color: 'rgb(200,165,40)', size: 10.5 });
        kit.label(c, 'beyond: bulk water', 10, Hh - 14, { color: C.accent, size: 10.5 });
        [['polar', C.accent], ['positive', C.ok], ['negative', C.bad], ['oily', C.warn]].forEach((k, i) => kit.label(c, '■ ' + k[0], 10 + i * 66, 14, { color: k[1], size: 10.5 }));
        // numbers
        const M = V.M * 1e3, A = 6.3 * Math.pow(M, 0.73), N1 = A / 25, g = 18.015 * N1 / M;
        const tb = W.hbondLifetime(V.T) * 1e12, Db = W.selfDiffusion(V.T);
        ro.set('A', Math.round(A).toLocaleString('en') + ' Å² (6.3 M^0.73)');
        ro.set('N1', Math.round(N1) + ' (25 Å² each)');
        ro.set('g', g.toFixed(2) + ' g/g (full first layer)');
        ro.set('tb', tb.toFixed(2) + ' ps');
        ro.set('ts', (2.5 * tb).toFixed(2) + ' ps (about 2.5×)');
        ro.set('D', (Db * 1e9).toFixed(2) + ' and ' + (Db / 2.5 * 1e9).toFixed(2) + ' × 10⁻⁹ m²/s');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ HP folding */
  Hyper.sim('cell-hp-folding', {
    title: 'A chain folds to hide its oily beads',
    blurb: `The HP model of Lau and Dill (1989), the simplest picture of protein folding: a chain of beads on a square grid, each either hydrophobic (H, orange) or polar (P, blue). The chain cannot cross itself. Every pair of H beads that end up side by side without being neighbours in the chain is worth one unit of energy ε, because it keeps two oily beads out of the water. A Monte Carlo program makes random moves and keeps each with the Metropolis rule: always if the energy falls, and with probability exp(−ΔE/kT) if it rises. The small blue dots are the water molecules that must arrange themselves around each exposed H. This is a schematic of the physics, not of any real protein.

**Try this**
- Press *Cool slowly* and watch the chain collapse: the H beads (orange) gather in a core and the P beads (blue) end up on the outside. The best known number of contacts is shown beside the count.
- Press *Heat shock*, or add *denaturant (urea)*, which weakens ε: the core dissolves and the chain becomes a coil. Remove the urea and cool again: it refolds, to the same shape or an equivalent one.
- Choose *All polar*: it never folds, whatever you do. Choose *All hydrophobic*: it collapses into a featureless block at once.
- Look at the energy graph on the right: at low temperature the chain sits on a plateau, then jumps; folding is a trip downhill across a landscape, not a search of all shapes.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const SEQS = [
        { name: '20 beads (best known 9 contacts)', s: 'HPHPPHHPHPPHPHHPPHPH', best: 9 },
        { name: '24 beads (best known 9)', s: 'HHPPHPPHPPHPPHPPHPPHPPHH', best: 9 },
        { name: '25 beads (best known 8)', s: 'PPHPPHHPPPPHHPPPPHHPPPPHH', best: 8 },
        { name: '36 beads (best known 14)', s: 'PPPHHPPHHPPPPPHHHHHHHPPHHPPPPHHPPHPP', best: 14 },
        { name: 'All hydrophobic, 16 beads', s: 'HHHHHHHHHHHHHHHH', best: 9 },
        { name: 'All polar, 16 beads', s: 'PPPPPPPPPPPPPPPP', best: 0 }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'seq', type: 'select', label: 'Chain', options: SEQS.map((s, i) => [s.name, i]), value: params.seq != null ? params.seq : 0 },
        { id: 'T', label: 'Temperature kT/ε', min: 0.1, max: 2, step: 0.05, value: 1.2 },
        { id: 'urea', label: 'Denaturant (urea)', min: 0, max: 100, step: 5, value: 0, unit: '%' },
        { id: 'speed', label: 'Speed', min: 1, max: 30, step: 1, value: 10 },
        { id: 'water', type: 'check', label: 'Show the caged water', value: true },
        { type: 'buttons', items: [{ id: 'cool', label: 'Cool slowly', primary: true }, { id: 'heat', label: 'Heat shock' }, { id: 'unfold', label: 'Unfold' }] }
      ], (id) => {
        if (id === 'seq') { load(V.seq); anneal = null; }
        if (id === 'unfold') { load(V.seq); anneal = null; }
        if (id === 'cool') anneal = { t: 0 };
        if (id === 'heat') { anneal = null; ctl.set('T', 1.8); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['c', 'H–H contacts'], ['ex', 'H beads touching water'], ['rg', 'Radius of gyration'], ['state', 'State'], ['mc', 'Monte Carlo moves']]);
      const rnd = rng(23);
      let n = 0, hp = [], X = [], Y = [], best = 0, anneal = { t: 0 }, hist = [], tick = 0, moves = 0, view = { ox: 0, oy: 0, cs: 20 };
      const key = (x, y) => (x + 1000) * 2048 + (y + 1000);
      const DIR = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      function load(i) {
        const q = SEQS[i] || SEQS[0];
        n = q.s.length; hp = Array.from(q.s, ch => ch === 'H'); best = q.best;
        X = []; Y = [];
        for (let k = 0; k < n; k++) { X.push(k - Math.floor(n / 2)); Y.push(0); }
        hist = []; moves = 0;
      }
      load(V.seq);
      /* contacts of a configuration, or -1 if the chain touches itself */
      function evaluate(nx, ny) {
        const m = new Map();
        for (let i = 0; i < n; i++) { const kk = key(nx[i], ny[i]); if (m.has(kk)) return -1; m.set(kk, i); }
        let c = 0;
        for (let i = 0; i < n; i++) {
          if (!hp[i]) continue;
          for (const d of DIR) { const j = m.get(key(nx[i] + d[0], ny[i] + d[1])); if (j !== undefined && j > i + 1 && hp[j]) c++; }
        }
        return c;
      }
      let cNow = evaluate(X, Y);
      function propose() {
        const nx = X.slice(), ny = Y.slice(), u = rnd();
        if (u < 0.3) {                                    // pivot: rotate or reflect one end of the chain about a bead
          const kx = 1 + Math.floor(rnd() * (n - 2)), t = 1 + Math.floor(rnd() * 7), tail = rnd() < 0.5;
          const from = tail ? kx + 1 : 0, to = tail ? n : kx;
          for (let i = from; i < to; i++) {
            const dx = X[i] - X[kx], dy = Y[i] - Y[kx];
            let ex, ey;
            switch (t) { case 1: ex = -dy; ey = dx; break; case 2: ex = -dx; ey = -dy; break; case 3: ex = dy; ey = -dx; break; case 4: ex = dx; ey = -dy; break; case 5: ex = -dx; ey = dy; break; case 6: ex = dy; ey = dx; break; default: ex = -dy; ey = -dx; }
            nx[i] = X[kx] + ex; ny[i] = Y[kx] + ey;
          }
        } else if (u < 0.45) {                            // an end bead swings to another free site
          const e = rnd() < 0.5 ? 0 : n - 1, nb = e === 0 ? 1 : n - 2, d = DIR[Math.floor(rnd() * 4)];
          nx[e] = X[nb] + d[0]; ny[e] = Y[nb] + d[1];
        } else if (u < 0.78) {                            // a corner flips over
          const i = 1 + Math.floor(rnd() * (n - 2));
          if (X[i - 1] === X[i + 1] || Y[i - 1] === Y[i + 1]) return null;
          nx[i] = X[i - 1] + X[i + 1] - X[i]; ny[i] = Y[i - 1] + Y[i + 1] - Y[i];
        } else {                                          // a U-turn flips (crankshaft)
          if (n < 5) return null;
          const i = 1 + Math.floor(rnd() * (n - 3)), a = i - 1, b = i, c = i + 1, d = i + 2;
          if (Math.abs(X[a] - X[d]) + Math.abs(Y[a] - Y[d]) !== 1) return null;
          const vx = X[b] - X[a], vy = Y[b] - Y[a];
          if (X[c] - X[d] !== vx || Y[c] - Y[d] !== vy) return null;
          nx[b] = X[a] - vx; ny[b] = Y[a] - vy; nx[c] = X[d] - vx; ny[c] = Y[d] - vy;
        }
        return [nx, ny];
      }
      function sweep(T, eps, count) {
        for (let q = 0; q < count; q++) {
          const p = propose();
          moves++;
          if (!p) continue;
          const c2 = evaluate(p[0], p[1]);
          if (c2 < 0) continue;
          const dc = c2 - cNow;
          if (dc >= 0 || rnd() < Math.exp(dc * eps / T)) { X = p[0]; Y = p[1]; cNow = c2; }
        }
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (anneal) {
          anneal.t += Math.min(dt, 0.05);
          const f = clamp(anneal.t / 9, 0, 1);
          ctl.set('T', 1.3 * Math.pow(0.22 / 1.3, f));
          if (f >= 1) anneal = null;
        }
        const eps = 1 - 0.8 * V.urea / 100;
        sweep(Math.max(0.05, V.T), eps, Math.round(V.speed * 40));
        { let a = 0, b = 0, c0 = 0, d0 = 0; a = b = 1e9; c0 = d0 = -1e9; for (let i = 0; i < n; i++) { a = Math.min(a, X[i]); c0 = Math.max(c0, X[i]); b = Math.min(b, Y[i]); d0 = Math.max(d0, Y[i]); } const sx = Math.round((a + c0) / 2), sy = Math.round((b + d0) / 2); if (sx || sy) for (let i = 0; i < n; i++) { X[i] -= sx; Y[i] -= sy; } }
        tick++;
        if (tick % 3 === 0) { hist.push(cNow); if (hist.length > 240) hist.shift(); }
        // layout
        const aw = Wd * 0.68, ah = Hh;
        let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
        for (let i = 0; i < n; i++) { mnx = Math.min(mnx, X[i]); mxx = Math.max(mxx, X[i]); mny = Math.min(mny, Y[i]); mxy = Math.max(mxy, Y[i]); }
        const cs0 = clamp(Math.min(aw / (mxx - mnx + 3), (ah - 20) / (mxy - mny + 3)), 8, 34);
        const ox0 = aw / 2 - (mnx + mxx) / 2 * cs0, oy0 = ah / 2 - (mny + mxy) / 2 * cs0;
        const kk = Math.min(1, dt * 6) || 0.1;
        view.cs = lerp(view.cs, cs0, kk); view.ox = lerp(view.ox, ox0, kk); view.oy = lerp(view.oy, oy0, kk);
        if (Math.abs(view.ox - ox0) > aw) { view.ox = ox0; view.oy = oy0; }
        const cs = view.cs, px = i => view.ox + X[i] * cs, py = i => view.oy + Y[i] * cs;
        const m = new Map();
        for (let i = 0; i < n; i++) m.set(key(X[i], Y[i]), i);
        let exposed = 0;
        // caged water: the empty sites next to an H bead
        if (V.water) {
          c.fillStyle = C.accent; c.globalAlpha = 0.5;
          const seen = new Set();
          for (let i = 0; i < n; i++) if (hp[i]) for (const d of DIR) {
            const x = X[i] + d[0], y = Y[i] + d[1], kq = key(x, y);
            if (m.has(kq)) continue;
            exposed++;
            if (seen.has(kq)) continue;
            seen.add(kq);
            c.beginPath(); c.arc(view.ox + x * cs, view.oy + y * cs, Math.max(2, cs * 0.16), 0, TAU); c.fill();
          }
          c.globalAlpha = 1;
        } else {
          for (let i = 0; i < n; i++) if (hp[i]) for (const d of DIR) if (!m.has(key(X[i] + d[0], Y[i] + d[1]))) exposed++;
        }
        // H–H contacts
        c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([4, 3]);
        for (let i = 0; i < n; i++) if (hp[i]) for (const d of DIR) {
          const j = m.get(key(X[i] + d[0], Y[i] + d[1]));
          if (j !== undefined && j > i + 1 && hp[j]) { c.beginPath(); c.moveTo(px(i), py(i)); c.lineTo(px(j), py(j)); c.stroke(); }
        }
        c.setLineDash([]);
        // the chain
        c.strokeStyle = C.text; c.lineWidth = Math.max(2, cs * 0.12); c.lineCap = 'round';
        c.beginPath(); for (let i = 0; i < n; i++) i ? c.lineTo(px(i), py(i)) : c.moveTo(px(i), py(i)); c.stroke();
        for (let i = 0; i < n; i++) {
          c.beginPath(); c.arc(px(i), py(i), cs * 0.34, 0, TAU);
          c.fillStyle = hp[i] ? C.warn : C.accent; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
        }
        // the energy history
        const gx = aw + 14, gw = Wd - gx - 12, gy = 34, gh = Math.min(170, Hh - 120);
        if (gw > 60) {
          kit.label(c, 'H–H contacts over time', gx, 20, { color: C.muted, size: 11.5 });
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
          const top = Math.max(best, 1);
          if (best > 0) { c.setLineDash([3, 3]); c.beginPath(); c.moveTo(gx, gy + gh * (1 - best / top)); c.lineTo(gx + gw, gy + gh * (1 - best / top)); c.strokeStyle = C.ok; c.stroke(); c.setLineDash([]); kit.label(c, 'best known ' + best, gx + gw - 4, gy + gh * (1 - best / top) - 7, { color: C.ok, size: 10.5, align: 'right' }); }
          c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath();
          hist.forEach((v, i) => { const x = gx + gw * i / 240, y = gy + gh * (1 - clamp(v / top, 0, 1)); i ? c.lineTo(x, y) : c.moveTo(x, y); });
          c.stroke();
          kit.label(c, 'time →', gx + gw, gy + gh + 12, { color: C.faint, size: 10.5, align: 'right' });
          kit.label(c, 'kT/ε = ' + V.T.toFixed(2) + ' · ε × ' + eps.toFixed(2), gx, gy + gh + 30, { color: C.muted, size: 11 });
        }
        kit.label(c, '● hydrophobic (H)   ● polar (P)', 12, Hh - 12, { color: C.muted, size: 11 });
        let gx2 = 0, gy2 = 0;
        for (let i = 0; i < n; i++) { gx2 += X[i]; gy2 += Y[i]; }
        gx2 /= n; gy2 /= n;
        let r2 = 0;
        for (let i = 0; i < n; i++) r2 += (X[i] - gx2) ** 2 + (Y[i] - gy2) ** 2;
        const rg = Math.sqrt(r2 / n);
        const state = best === 0 && cNow === 0 ? 'no oily beads to hide: it stays a coil' : cNow >= best ? 'at the best known fold' : cNow >= 0.75 * best ? 'compact, close to the native fold' : cNow >= 0.4 * best ? 'partly collapsed' : 'an extended coil';
        ro.set('c', cNow + ' of ' + best + ' possible');
        ro.set('ex', exposed + ' contacts with water');
        ro.set('rg', rg.toFixed(2) + ' bond lengths');
        ro.set('state', state);
        ro.set('mc', (moves / 1000).toFixed(0) + ' thousand');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ amphiphiles sorting themselves */
  Hyper.sim('cell-bilayer', {
    title: 'Lipids that sort themselves',
    blurb: `Water is the pale background; each lipid is a red head (it likes water a little) and a chain of yellow tail beads (they do not). A tail bead next to water costs energy; next to another tail it costs nothing. Nothing else acts: there is no bond or force between the tails, no template and no machine. A Monte Carlo program shuffles the lipids and keeps each move by the Metropolis rule (always if the energy falls, with probability exp(−ΔE/kT) if it rises), and the lipids sort themselves. The model is a lattice cartoon in two dimensions, a schematic of the idea and not of real lipids.

**Try this**
- Set *Water avoids tails* to 0: the lipids stay scattered. Raise it to 1.5 and watch the tails find each other while the heads end up facing the water.
- At low lipid concentration (5–10 %) you get small round micelles. At 30–40 %, and especially after *Cool slowly*, the micelles merge into larger clusters and bands, the cross-section of a bilayer, with a core of tails and a rim of heads. *Cool slowly* ramps the strength up gradually, which lets the lipids find the better arrangement instead of freezing in the first clump; merging takes a while, because every move is a single step.
- Lengthen the tail from 2 to 5 beads: a longer tail has more to lose in water, so the aggregates are stabler and free lipids rarer.
- Set the strength back to zero and the aggregates dissolve. They were held together by the water pushing the tails out, not by bonds between the lipids. In a real membrane the sheet curls round on itself into a closed vesicle, so it has no ends to hide.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const COLS = 44, ROWS = 28, N = COLS * ROWS;
      const ctl = kit.controls(box.side, [
        { id: 'eps', label: 'Water avoids tails (ε/kT)', min: 0, max: 3, step: 0.1, value: params.eps != null ? params.eps : 1.4 },
        { id: 'conc', label: 'Lipids', min: 5, max: 50, step: 1, value: params.conc || 25, unit: '% of sites' },
        { id: 'tail', label: 'Tail length', min: 2, max: 5, step: 1, value: params.tail || 3, unit: 'beads' },
        { id: 'speed', label: 'Speed', min: 1, max: 30, step: 1, value: 12 },
        { type: 'buttons', items: [{ id: 'stir', label: 'Stir', primary: true }, { id: 'cool', label: 'Cool slowly' }] }
      ], (id) => { if (id === 'conc' || id === 'tail' || id === 'stir') { build(); ann = null; } if (id === 'eps') ann = null; if (id === 'cool') { build(); ctl.set('eps', 0.3); ann = { t: 0 }; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['e', 'Tail beads touching water'], ['agg', 'Aggregates'], ['big', 'Lipids in the largest aggregate'], ['free', 'Lipids on their own'], ['face', 'Heads touching water'], ['mv', 'Monte Carlo moves']]);
      const rnd = rng(31);
      const typ = new Uint8Array(N), own = new Int16Array(N), NB = new Int32Array(N * 4), stamp = new Int32Array(N);
      let ann = null, stampId = 0, lip = [], moves = 0, stats = { e: 0, agg: 0, big: 0, free: 0, face: 0, m: 1 }, frameNo = 0;
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        const i = y * COLS + x;
        NB[i * 4] = y * COLS + (x + 1) % COLS; NB[i * 4 + 1] = y * COLS + (x + COLS - 1) % COLS;
        NB[i * 4 + 2] = ((y + 1) % ROWS) * COLS + x; NB[i * 4 + 3] = ((y + ROWS - 1) % ROWS) * COLS + x;
      }
      const wrapX = x => ((x % COLS) + COLS) % COLS, wrapY = y => ((y % ROWS) + ROWS) % ROWS;
      const site = (x, y) => wrapY(y) * COLS + wrapX(x);
      const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      /* energy near a set of sites: a tail bead costs 1 per water neighbour and 1 per head of another lipid; a head gains 0.2 per water neighbour */
      function localE(list) {
        let e = 0;
        for (const s of list) {
          const ts = typ[s];
          if (ts === 2) {
            for (let k = 0; k < 4; k++) {
              const q = NB[s * 4 + k];
              if (typ[q] === 0 || (typ[q] === 1 && own[q] !== own[s])) e += 1;
            }
          } else if (ts === 1) {
            for (let k = 0; k < 4; k++) if (typ[NB[s * 4 + k]] === 0) e -= 0.6;
          }
        }
        return e;
      }
      function gather(sites) {
        stampId++;
        const out = [];
        for (const s of sites) {
          if (stamp[s] !== stampId) { stamp[s] = stampId; out.push(s); }
          for (let k = 0; k < 4; k++) { const q = NB[s * 4 + k]; if (stamp[q] !== stampId) { stamp[q] = stampId; out.push(q); } }
        }
        return out;
      }
      function place(l, xs, ys) { l.x = xs; l.y = ys; }
      function paint(l, id) {
        for (let j = 0; j < l.x.length; j++) { const s = site(l.x[j], l.y[j]); typ[s] = id < 0 ? 0 : (j === 0 ? 1 : 2); own[s] = id; }
      }
      function build() {
        typ.fill(0); own.fill(-1); lip = []; moves = 0;
        const k = V.tail, count = Math.round(V.conc / 100 * N / (k + 1));
        let tries = 0;
        while (lip.length < count && tries < count * 60) {
          tries++;
          const x0 = Math.floor(rnd() * COLS), y0 = Math.floor(rnd() * ROWS), d = DIRS[Math.floor(rnd() * 4)];
          const xs = [], ys = [];
          let ok = true;
          for (let j = 0; j <= k; j++) { xs.push(x0 + d[0] * j); ys.push(y0 + d[1] * j); if (typ[site(xs[j], ys[j])] !== 0) { ok = false; break; } }
          if (!ok) continue;
          const l = { x: xs, y: ys };
          lip.push(l); paint(l, lip.length - 1);
        }
        for (let q = 0; q < 200; q++) sweep(40);
      }
      function sweep(count) {
        const eps = V.eps;
        for (let q = 0; q < count; q++) {
          if (!lip.length) return;
          const id = Math.floor(rnd() * lip.length), l = lip[id], k = l.x.length, u = rnd();
          let nx = l.x.slice(), ny = l.y.slice();
          if (u < 0.35) {                                           // slide the whole lipid by one site
            const d = DIRS[Math.floor(rnd() * 4)];
            for (let j = 0; j < k; j++) { nx[j] += d[0]; ny[j] += d[1]; }
          } else if (u < 0.55) {                                    // turn it about its head
            const r = 1 + Math.floor(rnd() * 3);
            for (let j = 1; j < k; j++) {
              const dx = l.x[j] - l.x[0], dy = l.y[j] - l.y[0];
              const e = r === 1 ? [-dy, dx] : r === 2 ? [-dx, -dy] : [dy, -dx];
              nx[j] = l.x[0] + e[0]; ny[j] = l.y[0] + e[1];
            }
          } else if (u < 0.78) {                                    // head leads, the tail follows
            const d = DIRS[Math.floor(rnd() * 4)];
            nx[0] = l.x[0] + d[0]; ny[0] = l.y[0] + d[1];
            for (let j = 1; j < k; j++) { nx[j] = l.x[j - 1]; ny[j] = l.y[j - 1]; }
          } else {                                                  // the tail end leads, the head follows
            const d = DIRS[Math.floor(rnd() * 4)];
            nx[k - 1] = l.x[k - 1] + d[0]; ny[k - 1] = l.y[k - 1] + d[1];
            for (let j = 0; j < k - 1; j++) { nx[j] = l.x[j + 1]; ny[j] = l.y[j + 1]; }
          }
          const ns = [];
          let ok = true;
          for (let j = 0; j < k; j++) { const s = site(nx[j], ny[j]); if (typ[s] !== 0 && own[s] !== id) { ok = false; break; } ns.push(s); }
          if (!ok) continue;
          moves++;
          const os = [];
          for (let j = 0; j < k; j++) os.push(site(l.x[j], l.y[j]));
          const region = gather(os.concat(ns));
          const e0 = localE(region);
          paint(l, -1);
          const old = { x: l.x, y: l.y };
          l.x = nx; l.y = ny; paint(l, id);
          const e1 = localE(region), dE = eps * (e1 - e0);
          if (dE <= 0 || rnd() < Math.exp(-dE)) {
            const hx = wrapX(l.x[0]) - l.x[0], hy = wrapY(l.y[0]) - l.y[0];
            if (hx || hy) { l.x = l.x.map(v => v + hx); l.y = l.y.map(v => v + hy); }
          } else { paint(l, -1); l.x = old.x; l.y = old.y; paint(l, id); }
        }
      }
      function analyse() {
        const m = lip.length, par = Array.from({ length: m }, (_, i) => i);
        const find = a => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
        let e = 0, face = 0;
        for (let id = 0; id < m; id++) for (let j = 0; j < lip[id].x.length; j++) {
          const s = site(lip[id].x[j], lip[id].y[j]);
          let wet = false;
          for (let k = 0; k < 4; k++) {
            const q = NB[s * 4 + k];
            if (j === 0 && typ[q] === 0) wet = true;
            if (typ[q] !== 0 && own[q] !== id && own[q] >= 0) { const a = find(id), b = find(own[q]); if (a !== b) par[a] = b; }
            if (j > 0 && typ[q] === 0) e++;
          }
          if (wet) face++;
        }
        const size = new Map();
        for (let i = 0; i < m; i++) { const r = find(i); size.set(r, (size.get(r) || 0) + 1); }
        let big = 0, free = 0, agg = 0;
        for (const v of size.values()) { if (v > big) big = v; if (v === 1) free++; else agg++; }
        stats = { e, agg, big, free, m, face };
      }
      build();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (ann) { ann.t += Math.min(dt, 0.05); const f = clamp(ann.t / 14, 0, 1); ctl.set('eps', Math.round((0.3 + 1.7 * f) * 100) / 100); if (f >= 1) ann = null; }
        sweep(V.speed * 120);
        frameNo++;
        if (frameNo % 12 === 1) analyse();
        const cs = Math.min((Wd - 16) / COLS, (Hh - 46) / ROWS), ox = (Wd - COLS * cs) / 2, oy = 8;
        c.fillStyle = C.accent; c.globalAlpha = 0.28; c.beginPath();
        for (let i = 0; i < N; i++) if (typ[i] === 0) { const x = ox + (i % COLS + 0.5) * cs, y = oy + (Math.floor(i / COLS) + 0.5) * cs; c.moveTo(x + cs * 0.1, y); c.arc(x, y, cs * 0.1, 0, TAU); }
        c.fill(); c.globalAlpha = 1;
        c.lineWidth = Math.max(1.5, cs * 0.12); c.strokeStyle = C.muted; c.lineCap = 'round';
        for (const l of lip) {
          c.beginPath();
          for (let j = 0; j < l.x.length; j++) {
            const x = ox + (wrapX(l.x[j]) + 0.5) * cs, y = oy + (wrapY(l.y[j]) + 0.5) * cs;
            if (j && (Math.abs(wrapX(l.x[j]) - wrapX(l.x[j - 1])) > 1 || Math.abs(wrapY(l.y[j]) - wrapY(l.y[j - 1])) > 1)) c.moveTo(x, y); else if (j) c.lineTo(x, y); else c.moveTo(x, y);
          }
          c.stroke();
        }
        for (const l of lip) for (let j = 0; j < l.x.length; j++) {
          const x = ox + (wrapX(l.x[j]) + 0.5) * cs, y = oy + (wrapY(l.y[j]) + 0.5) * cs;
          c.beginPath(); c.arc(x, y, cs * (j ? 0.34 : 0.42), 0, TAU);
          c.fillStyle = j ? 'rgb(230,185,60)' : C.bad; c.fill();
        }
        const ky = oy + ROWS * cs + 14;
        kit.label(c, '● head', 12, ky, { color: C.bad, size: 10.5 });
        kit.label(c, '● tail bead', 62, ky, { color: 'rgb(220,175,55)', size: 10.5 });
        kit.label(c, '· water', 135, ky, { color: C.accent, size: 10.5 });
        kit.label(c, 'cost: tail beside water ε · tail beside a foreign head ε · head beside water −0.6 ε', 12, ky + 16, { color: C.muted, size: 10 });
        ro.set('e', stats.e + ' (' + (lip.length ? (stats.e / lip.length).toFixed(1) : '0') + ' per lipid)');
        ro.set('agg', stats.agg + ' of two or more lipids');
        ro.set('big', stats.big + ' of ' + (stats.m || lip.length));
        ro.set('free', String(stats.free));
        ro.set('face', pc(stats.face / Math.max(1, stats.m), 0));
        ro.set('mv', (moves / 1000).toFixed(0) + ' thousand');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the double helix at a chosen humidity */
  Hyper.sim('cell-dna-helix', {
    title: 'The double helix and its water',
    blurb: `A side view of 26 base pairs. Drag the relative humidity of the air round a DNA fibre from wet to dry: above about 90 % the helix is the long, slim **B form** (10 base pairs per turn, 0.34 nm per pair) and its minor groove carries a chain of water molecules, the *spine of hydration*; below about 75 % it shortens into the fatter **A form** (11 pairs per turn, 0.26 nm per pair). Rungs are base pairs: two hydrogen bonds for A–T (orange), three for G–C (blue). Raise the temperature and the pairs open, the A–T-rich stretches first.

The helix is a schematic drawn from published parameters of idealised A and B DNA, and the water counts are approximate fibre values.

**Try this**
- Start at 95 % humidity (B form) and sweep down to 60 %: the helix shortens by a quarter, widens, and the spine of water in the groove thins and disappears.
- Raise *GC content* from 20 % to 70 %: more blue rungs, and the melting temperature in the read-out climbs by about 20 °C.
- Heat the DNA through its melting temperature (the read-out gives it) and watch it unzip; the stretches with more A–T open first.
- Tick *sodium ions* and count them: each phosphate carries a negative charge, and in water about three-quarters of that charge is hidden by ions close to the helix.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'rh', label: 'Relative humidity', min: 10, max: 100, step: 1, value: params.rh || 95, unit: '%' },
        { id: 'gc', label: 'GC content', min: 20, max: 80, step: 1, value: params.gc || 41, unit: '%' },
        { id: 'T', label: 'Temperature', min: 25, max: 110, step: 1, value: 25, unit: '°C' },
        { id: 'ions', type: 'check', label: 'Show sodium ions', value: false },
        { id: 'water', type: 'check', label: 'Show water', value: true },
        { id: 'spin', type: 'check', label: 'Turn the helix', value: true }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['form', 'Form'], ['turn', 'Base pairs per turn'], ['rise', 'Rise per base pair'], ['pitch', 'Pitch (one full turn)'], ['dia', 'Diameter'], ['minor', 'Minor groove'], ['w', 'Water per nucleotide (approx.)'], ['hb', 'Hydrogen bonds in 10 pairs'], ['tm', 'Melting temperature'], ['open', 'Pairs open at this temperature']]);
      const NBP = 26, rnd = rng(41);
      const u = Array.from({ length: NBP }, () => rnd());
      const wat = Array.from({ length: 360 }, () => ({ s: rnd(), a: rnd() * TAU, r: 3 + rnd() * 16, side: rnd() < 0.5 ? 1 : -1, ph: rnd() * TAU }));
      const ion = Array.from({ length: 60 }, () => ({ s: rnd(), r: 8 + rnd() * 20, side: rnd() < 0.5 ? 1 : -1, ph: rnd() * TAU }));
      const WT = [[10, 2], [30, 4], [50, 7], [75, 11], [92, 20], [100, 26]];
      const interp = (tab, x) => { if (x <= tab[0][0]) return tab[0][1]; for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) return lerp(tab[i - 1][1], tab[i][1], (x - tab[i - 1][0]) / (tab[i][0] - tab[i - 1][0])); return tab[tab.length - 1][1]; };
      let phase = 0;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.spin) phase += Math.min(dt, 0.05) * 0.5;
        const b = clamp((V.rh - 75) / 17, 0, 1);
        const turn = lerp(11, 10, b), rise = lerp(2.6, 3.4, b), dia = lerp(23, 20, b);
        const sc = (Wd * 0.88) / (NBP * 3.4), x0 = 22, cy = Hh * 0.46;
        const gcf = V.gc / 100, Tm = 69.3 + 0.41 * V.gc;
        const isGC = u.map(v => v < gcf);
        const open = isGC.map(g => 1 / (1 + Math.exp(-(V.T - (Tm + (g ? 5 : -5))) / 2.2)));
        const R0 = dia / 2 * sc;
        const xs = i => x0 + i * rise * sc;
        const Ri = i => R0 * (1 + 1.1 * open[clamp(i, 0, NBP - 1)]);
        const ph = i => TAU * i / turn + phase;
        const lay = (i) => ({ x: xs(i), r: Ri(Math.round(i)), p: ph(i) });
        const strand = (sign, front) => {
          c.beginPath();
          let started = false;
          for (let s = 0; s <= (NBP - 1) * 6; s++) {
            const i = s / 6, k = Math.min(NBP - 1, Math.floor(i)), f = i - k, k2 = Math.min(NBP - 1, k + 1);
            const R = lerp(Ri(k), Ri(k2), f), p = ph(i), z = Math.cos(p);
            const isFront = sign > 0 ? z >= 0 : z < 0;
            const x = x0 + i * rise * sc, y = cy + sign * R * Math.sin(p);
            if (isFront === front) { if (!started) { c.moveTo(x, y); started = true; } else c.lineTo(x, y); } else started = false;
          }
          c.stroke();
        };
        // water first, behind the helix
        const wpn = interp(WT, V.rh);
        if (V.water) {
          const nW = Math.round(wpn * NBP / 2 * 0.9), len = (NBP - 1) * rise * sc;
          c.fillStyle = C.accent; c.globalAlpha = 0.55; c.beginPath();
          for (let q = 0; q < Math.min(nW, wat.length); q++) {
            const w = wat[q], i = w.s * (NBP - 1), k = Math.min(NBP - 1, Math.floor(i));
            const R = Ri(k) + w.r + 2.5 * Math.sin(t * 2 + w.ph);
            const x = x0 + w.s * len + 1.5 * Math.cos(t * 1.7 + w.ph), y = cy + w.side * (R * 0.55 + w.r * 0.7) * (0.6 + 0.4 * Math.cos(w.a));
            c.moveTo(x + 1.8, y); c.arc(x, y, 1.8, 0, TAU);
          }
          c.fill(); c.globalAlpha = 1;
        }
        // the back strand, the rungs, the front strand
        c.lineCap = 'round'; c.lineJoin = 'round';
        c.strokeStyle = C.faint; c.lineWidth = 2.2; strand(1, false); strand(-1, false);
        for (let i = 0; i < NBP; i++) {
          const p = ph(i), R = Ri(i), x = xs(i), y1 = cy + R * Math.sin(p), y2 = cy - R * Math.sin(p), a = 1 - open[i];
          if (a < 0.08) continue;
          c.globalAlpha = a; c.strokeStyle = isGC[i] ? C.accent : C.warn; c.lineWidth = Math.max(2, sc * 1.3);
          c.beginPath(); c.moveTo(x, y1); c.lineTo(x, y2); c.stroke();
          const nh = isGC[i] ? 3 : 2;
          c.fillStyle = C.text;
          for (let h = 0; h < nh; h++) { const f = 0.5 + (h - (nh - 1) / 2) * 0.14; c.beginPath(); c.arc(x, lerp(y1, y2, f), 1.5, 0, TAU); c.fill(); }
          c.globalAlpha = 1;
        }
        c.strokeStyle = C.text; c.lineWidth = 3.2; strand(1, true); strand(-1, true);
        // the spine of hydration in the minor groove (B form)
        if (V.water && b > 0.02) {
          c.fillStyle = C.accent; c.globalAlpha = 0.25 + 0.7 * b;
          for (let i = 0; i < NBP - 1; i++) for (const f of [0.25, 0.75]) {
            const q = i + f, p = ph(q), R = Ri(i);
            const x = x0 + q * rise * sc, y = cy + 0.5 * R * Math.cos(p) * 0.6 + 0 * Math.sin(t);
            c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill();
          }
          c.globalAlpha = 1;
        }
        if (V.ions) {
          const nI = Math.round(0.76 * 2 * NBP * 0.8);
          c.fillStyle = C.warn; c.globalAlpha = 0.9;
          for (let q = 0; q < Math.min(nI, ion.length); q++) {
            const w = ion[q], i = w.s * (NBP - 1), R = Ri(Math.min(NBP - 1, Math.floor(i))) + 4 + w.r * 0.4;
            const x = x0 + i * rise * sc + 2 * Math.sin(t * 1.3 + w.ph), y = cy + w.side * R * (0.7 + 0.3 * Math.sin(w.ph));
            c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill();
          }
          c.globalAlpha = 1;
        }
        // scale bar and labels
        const nm = 10 * sc;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, Hh - 24); c.lineTo(x0 + nm, Hh - 24); c.stroke();
        kit.label(c, '1 nm', x0 + nm + 6, Hh - 24, { color: C.muted, size: 11, baseline: 'middle' });
        kit.label(c, b >= 0.98 ? 'B form: long and slim, narrow minor groove with its spine of water' : b <= 0.02 ? 'A form: short and wide, shallow minor groove' : 'in between: the transition from A to B', 14, 18, { color: C.text, size: 12.5, weight: 650 });
        kit.label(c, '▮ A–T (2 bonds)   ▮ G–C (3 bonds)', Wd - 14, Hh - 12, { color: C.muted, size: 11, align: 'right' });
        const nOpen = open.reduce((s, v) => s + v, 0);
        ro.set('form', b >= 0.98 ? 'B (wet)' : b <= 0.02 ? 'A (dry)' : 'between A and B');
        ro.set('turn', turn.toFixed(1));
        ro.set('rise', (rise / 10).toFixed(2) + ' nm');
        ro.set('pitch', (turn * rise / 10).toFixed(2) + ' nm');
        ro.set('dia', (dia / 10).toFixed(1) + ' nm');
        ro.set('minor', b > 0.5 ? 'narrow and deep (about 0.6 nm)' : 'wide and shallow');
        ro.set('w', '≈ ' + wpn.toFixed(0));
        ro.set('hb', Math.round(10 * (2 + gcf)) + ' (at ' + V.gc + ' % GC)');
        ro.set('tm', Tm.toFixed(0) + ' °C (0.15 M salt, Marmur–Doty)');
        ro.set('open', Math.round(nOpen) + ' of ' + NBP);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ water made by burning food */
  Hyper.sim('cell-metabolic-water', {
    title: 'Water made by burning food, water lost by breathing',
    blurb: `Burning food in the cells makes water: starch gives 0.56 g per gram, fat 1.13 g per gram. But the oxygen to burn it has to be breathed in, and every breath out carries water vapour away. This simulation counts both for a day. The air breathed in has the temperature and humidity you choose; the air breathed out is saturated at the temperature you choose (34 °C for a person breathing at rest). The vapour numbers are the engine's, the fuel numbers are textbook values for starch, palmitic acid (fat) and an average protein, and the whole is schematic.

**Try this**
- With the defaults (a 10 MJ day, 35 % of the energy from fat, dry-ish air at 20 °C, exhaled at 34 °C) the body makes about 290 g of water and loses more than that by breathing. Nobody lives on metabolic water alone.
- Lower the exhaled-air temperature to 24 °C, as a kangaroo rat's nose does by cooling the air on its way out: the breath loss falls by almost half and metabolism wins.
- Make the air you breathe in hot and dry (35 °C, 10 % humidity) and the loss climbs.
- Raise the fat share to 70 %: fat gives more water per kilojoule of oxygen than starch, but not by enough to change the verdict.
- Read the graph: the horizontal line is the water made, the curve the water breathed out; they cross at the break-even exhaled temperature given in the read-out.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 340 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'E', label: 'Energy used per day', min: 5, max: 25, step: 0.5, value: 10, unit: 'MJ' },
        { id: 'fat', label: 'Fat share of the energy', min: 10, max: 70, step: 5, value: 35, unit: '%' },
        { id: 'Tin', label: 'Air breathed in', min: -5, max: 45, step: 1, value: params.Tin != null ? params.Tin : 20, unit: '°C' },
        { id: 'RH', label: 'Humidity of that air', min: 5, max: 100, step: 5, value: params.RH || 50, unit: '%' },
        { id: 'Tex', label: 'Air breathed out, saturated at', min: 18, max: 36, step: 1, value: params.Tex || 34, unit: '°C' },
        { id: 'ext', label: 'Oxygen taken from the air', min: 2, max: 8, step: 0.5, value: 4, unit: '% of volume' }
      ], () => { dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['made', 'Water made by metabolism'], ['o2', 'Oxygen used'], ['air', 'Air breathed'], ['loss', 'Water breathed out (net of what came in)'], ['net', 'Net from metabolism and breathing'], ['be', 'Break-even exhaled temperature'], ['fat', 'Burning 1 g of fat: made, lost']]);
      const plot = kit.plot(graph, { x: { label: 'temperature of the air breathed out (°C)', min: 18, max: 36 }, y: { label: 'g of water per day', min: 0 } }, 170);
      const FUEL = { carb: { w: 0.556, kJ: 17.5, o2: 0.830 }, fat: { w: 1.125, kJ: 39.2, o2: 2.014 }, prot: { w: 0.41, kJ: 18.0, o2: 0.966 } };
      let dirty = true;
      function day() {
        const fs = V.fat / 100, shares = { fat: fs, prot: 0.15, carb: Math.max(0, 1 - fs - 0.15) };
        let made = 0, o2 = 0;
        for (const k of ['carb', 'fat', 'prot']) { const g = V.E * 1000 * shares[k] / FUEL[k].kJ; made += g * FUEL[k].w; o2 += g * FUEL[k].o2; }
        const air = o2 * 100 / V.ext / 1000;                                               // m³ per day
        const perM3 = Tex => Math.max(0, (W.absoluteHumidity(Tex, 1) - W.absoluteHumidity(V.Tin, V.RH / 100)) * 1000);   // g/m³ gained by the air
        return { made, o2, air, perM3, loss: air * perM3(V.Tex) };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const d = day();
        const lossAt = Tex => d.air * d.perM3(Tex);
        let be = NaN;
        for (let T = 18; T <= 36.001; T += 0.1) if (lossAt(T) >= d.made) { be = T; break; }
        if (dirty) {
          const pts = [];
          for (let T = 18; T <= 36; T += 1) pts.push([T, lossAt(T)]);
          plot.set({ series: [{ pts, label: 'water breathed out', color: C.bad }], x: { label: 'temperature of the air breathed out (°C)', min: 18, max: 36 }, y: { label: 'g of water per day', min: 0, max: Math.max(100, ...pts.map(p => p[1])) * 1.1 }, hlines: [{ y: d.made, label: 'made by metabolism' }], marks: [{ x: V.Tex, y: d.loss, label: 'you' }] });
          dirty = false;
        }
        const mx = Math.max(d.made, d.loss, 50) * 1.15, bw = Wd - 190, x0 = 150;
        const rows = [['made', d.made, C.accent, 'made by metabolism'], ['lost', d.loss, C.bad, 'lost by breathing'], ['net', Math.abs(d.made - d.loss), d.made >= d.loss ? C.ok : C.warn, d.made >= d.loss ? 'net gain' : 'net loss']];
        rows.forEach((r, i) => {
          const y = 22 + i * 52;
          c.fillStyle = r[2]; c.globalAlpha = 0.85; c.fillRect(x0, y, bw * r[1] / mx, 30); c.globalAlpha = 1;
          kit.label(c, r[3], x0 - 8, y + 15, { color: C.text, size: 12, align: 'right', baseline: 'middle' });
          kit.label(c, Math.round(r[1]) + ' g', x0 + bw * r[1] / mx + 6, y + 15, { color: C.text, size: 12.5, baseline: 'middle', weight: 650 });
        });
        kit.label(c, 'per day, for ' + V.E.toFixed(1) + ' MJ of food energy', x0, Hh - 14, { color: C.muted, size: 11.5 });
        const fgm = FUEL.fat.o2 * 100 / V.ext / 1000 * d.perM3(V.Tex);
        ro.set('made', Math.round(d.made) + ' g (' + (d.made / V.E / 1000 * 1000).toFixed(0) + ' g per MJ)');
        ro.set('o2', Math.round(d.o2) + ' L');
        ro.set('air', d.air.toFixed(1) + ' m³ (' + (100 / V.ext).toFixed(0) + ' L per L of oxygen)');
        ro.set('loss', Math.round(d.loss) + ' g (' + d.perM3(V.Tex).toFixed(1) + ' g per m³ of air)');
        ro.set('net', (d.made - d.loss >= 0 ? '+' : '−') + Math.round(Math.abs(d.made - d.loss)) + ' g per day');
        ro.set('be', Number.isFinite(be) ? be.toFixed(1) + ' °C' : 'below 18 °C: metabolism always wins');
        ro.set('fat', FUEL.fat.w.toFixed(2) + ' g made, ' + fgm.toFixed(2) + ' g lost');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ water wires: enzyme, aquaporin, vent */
  Hyper.sim('cell-water-wire', {
    title: 'A proton on a wire of water',
    blurb: `Three scenes with one idea: a proton does not travel through water, it is passed along. **The enzyme wire** shows an excess proton hopping down a row of water molecules (Grotthuss, 1806): each molecule hands a proton to the next, and afterwards the whole row has to turn round before the next proton can follow. **The aquaporin** passes water single file, but the dipoles of its waters are reversed at the middle (the NPA motif), so the proton wire is broken; press *Send a proton* and watch it stop. **The vent** is a thin mineral wall between acid sea and alkaline vent fluid; the proton gradient across it is a battery, and the read-out gives its voltage. The motion is schematic; the times and voltages come from the bond lifetime and the Nernst slope.

**Try this**
- *Enzyme wire:* lengthen the wire from 3 to 10 waters and watch the crossing time grow with the length while the turn-round time stays. Tick *a molecule turned the wrong way*: the proton waits at the defect.
- *Aquaporin:* raise the osmotic difference to speed up the water; the flow in each direction is the same at rest, and the net flow is the small difference.
- *Aquaporin:* tick *remove the NPA flip* and send a proton: with an unbroken wire it passes, which is exactly what a cell must not allow.
- *Vent:* with ocean pH 6 and vent fluid pH 9.5 the read-out gives about 240 mV across the wall, comparable to the voltage across a mitochondrion's membrane.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const MODES = [['A proton wire in an enzyme', 'wire'], ['An aquaporin channel', 'aqp'], ['A proton gradient across a vent wall', 'vent']];
      const mode0 = params.mode === 'aqp' || params.mode === 'vent' ? params.mode : 'wire';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Scene', options: MODES, value: mode0 },
        { id: 'n', label: 'Waters in the wire', min: 3, max: 10, step: 1, value: 5 },
        { id: 'reset', label: 'Time to turn the wire round', min: 2, max: 200, step: 1, value: 30, unit: 'ps' },
        { id: 'bad', type: 'check', label: 'A molecule turned the wrong way', value: false },
        { id: 'osm', label: 'Osmotic difference across the membrane', min: 0, max: 600, step: 10, value: 300, unit: 'mOsm/L' },
        { id: 'noflip', type: 'check', label: 'Remove the NPA flip (hypothetical)', value: false },
        { id: 'pHo', label: 'Ocean pH', min: 5, max: 8, step: 0.1, value: 6 },
        { id: 'pHv', label: 'Vent fluid pH', min: 8, max: 11, step: 0.1, value: 9.5 },
        { id: 'T', label: 'Temperature', min: 5, max: 90, step: 1, value: mode0 === 'vent' ? 70 : 25, unit: '°C' },
        { id: 'speed', label: 'Time scale', min: 0.5, max: 40, step: 0.5, value: 6, unit: 'ps per s' },
        { type: 'buttons', items: [{ id: 'go', label: 'Send a proton', primary: true }] }
      ], (id) => {
        if (id === 'mode') { ctl.set('T', V.mode === 'vent' ? 70 : 25); setMode(); reset(); phase = V.mode === 'wire' ? 'enter' : 'idle'; }
        if (id === 'go') send();
        if (id === 'n' || id === 'noflip' || id === 'bad') { reset(); phase = V.mode === 'wire' ? 'enter' : 'idle'; }
      });
      const V = ctl.values;
      const roW = kit.readout(box.side, [['hop', 'One hop (a bond rearrangement)'], ['cross', 'Time to cross the wire'], ['cyc', 'One full cycle (cross + turn round)'], ['max', 'Most protons the wire can carry'], ['ca', 'Carbonic anhydrase for comparison'], ['cnt', 'Protons passed']]);
      const roA = kit.readout(box.side, [['gross', 'Water crossing each way (reported)'], ['net', 'Net flow at this osmotic difference'], ['cell', 'A red cell with 200,000 channels'], ['pr', 'The proton']]);
      const roV = kit.readout(box.side, [['dpH', 'pH difference'], ['pmf', 'Voltage across the wall'], ['dG', 'Energy per mole of protons'], ['atp', 'Protons per ATP at 50 kJ/mol'], ['neu', 'Neutral pH at this temperature']]);
      const rnd = rng(53);
      let tsim = 0, orient = [], pos = 0, hopT = 0, phase = mode0 === 'wire' ? 'enter' : 'idle', count = 0, waitT = 0, flipDone = true, stall = false, belt = 0, spawn = 0, flashes = [], parts = [];
      function setMode() {
        const m = V.mode;
        ctl.show('n', m === 'wire'); ctl.show('reset', m === 'wire'); ctl.show('bad', m === 'wire');
        ctl.show('osm', m === 'aqp'); ctl.show('noflip', m === 'aqp');
        ctl.show('pHo', m === 'vent'); ctl.show('pHv', m === 'vent');
        ctl.show('go', m !== 'vent');
        roW.show(m === 'wire'); roA.show(m === 'aqp'); roV.show(m === 'vent');
      }
      const nW = () => (V.mode === 'aqp' ? 8 : V.n);
      function reset() {
        orient = [];
        const n = nW();
        for (let i = 0; i < n; i++) orient.push(1);
        flipDone = !(V.mode === 'wire' && V.bad);
        if (!flipDone) orient[Math.floor(n / 2)] = -1;
        pos = 0; hopT = 0; waitT = 0; stall = false;
      }
      function send() { if (V.mode === 'aqp' && (phase === 'idle' || phase === 'done')) { reset(); phase = 'enter'; } }
      setMode(); reset();
      const tauHop = () => Math.max(0.2, W.hbondLifetime(V.T) * 1e12);
      /* advance the proton by dp picoseconds */
      function advance(dp) {
        if (V.mode === 'vent') return;
        const n = nW(), th = tauHop(), mid = Math.floor(n / 2);
        stall = false;
        if (phase === 'enter') {
          waitT += dp;
          if (waitT >= 2) { phase = 'hop'; pos = 0; hopT = 0; }
        } else if (phase === 'hop') {
          hopT += dp;
          if (hopT >= th) {
            if (pos + 1 >= n) { phase = 'out'; waitT = 0; orient[pos] = V.mode === 'wire' ? -1 : orient[pos]; }
            else if (V.mode === 'aqp' && !V.noflip && pos + 1 >= mid) { phase = 'blocked'; waitT = 0; }
            else if (V.mode === 'wire' && !flipDone && pos + 1 === mid) {
              stall = true; hopT = th;
              if (rnd() < dp / 120) { flipDone = true; orient[mid] = 1; }
            } else { if (V.mode === 'wire') orient[pos] = -1; pos++; hopT = 0; }
          }
        } else if (phase === 'out') {
          waitT += dp;
          if (waitT >= th) { count++; waitT = 0; phase = V.mode === 'wire' ? 'turn' : 'done'; }
        } else if (phase === 'turn') {
          waitT += dp;
          for (let i = 0; i < n; i++) if (waitT >= V.reset * (i + 1) / n) orient[i] = (V.bad && i === mid) ? -1 : 1;
          if (waitT >= V.reset) { phase = 'enter'; waitT = 0; flipDone = !V.bad; if (V.bad) orient[mid] = -1; }
        } else if (phase === 'blocked') {
          waitT += dp;
          if (waitT >= 80) phase = 'done';
        }
      }
      function drawHydronium(c, C, x, y, sc) {
        c.beginPath(); c.arc(x, y, 2.2 * sc, 0, TAU);
        c.fillStyle = 'rgba(255,90,90,0.28)'; c.fill();
        c.strokeStyle = 'rgba(255,90,90,0.8)'; c.lineWidth = 1.5; c.stroke();
        kit.label(c, '+', x, y - 2.9 * sc, { color: C.bad, size: 15, weight: 800, align: 'center', baseline: 'middle' });
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const dp = Math.min(dt, 0.05) * V.speed;
        tsim += dp;
        const m = V.mode;
        if (m !== 'vent') {
          advance(dp);
          const n = nW(), sc = clamp((Wd - 90) / (n * 2.9 + 5), 4, 12), cy = Hh * 0.5, gap = 2.9 * sc, L = n * gap;
          const x0 = Wd / 2 - L / 2 + gap / 2, xr = x0 + (n - 1) * gap;
          const th = tauHop(), mid = Math.floor(n / 2);
          const wallH = 2.6 * sc;
          // the protein walls
          c.fillStyle = C.surface; c.strokeStyle = C.faint; c.lineWidth = 1.4;
          if (m === 'aqp') {
            for (const s of [-1, 1]) {
              c.beginPath(); c.moveTo(14, cy + s * (Hh * 0.46));
              c.lineTo(14, cy + s * 4.6 * sc); c.lineTo(x0 - gap, cy + s * 3.6 * sc);
              c.quadraticCurveTo(Wd / 2, cy + s * 1.1 * sc, xr + gap, cy + s * 3.6 * sc);
              c.lineTo(Wd - 14, cy + s * 4.6 * sc); c.lineTo(Wd - 14, cy + s * (Hh * 0.46)); c.closePath(); c.fill(); c.stroke();
            }
            kit.label(c, 'outside the cell', 24, cy - Hh * 0.36, { color: C.muted, size: 11.5 });
            kit.label(c, 'inside the cell', Wd - 24, cy - Hh * 0.36, { color: C.muted, size: 11.5, align: 'right' });
            kit.label(c, 'NPA', Wd / 2, cy - 1.6 * sc - 28, { color: C.warn, size: 12, align: 'center', weight: 700 });
            kit.label(c, 'ar/R filter', x0 + gap * 0.3, cy - 3.8 * sc - 8, { color: C.muted, size: 10.5, align: 'center' });
          } else {
            for (const s of [-1, 1]) { c.beginPath(); c.rect(14, s > 0 ? cy + wallH : cy - Hh * 0.46, Wd - 28, Hh * 0.46 - wallH); c.fill(); c.stroke(); }
            kit.label(c, 'proton donor', x0 - gap * 1.7, cy + wallH + 20, { color: C.muted, size: 11.5, align: 'center' });
            kit.label(c, 'acceptor', xr + gap * 1.7, cy + wallH + 20, { color: C.muted, size: 11.5, align: 'center' });
            kit.label(c, 'enzyme', Wd / 2, cy - wallH - 16, { color: C.muted, size: 12, align: 'center' });
          }
          // the chain of water molecules
          if (m === 'aqp') {
            belt += dp * (0.015 + 0.0004 * V.osm);
            const shift = (belt % 1) * gap;
            for (let j = 0; j <= n; j++) {
              const xx = x0 + (j - 1) * gap + shift;
              if (xx < x0 - gap * 0.6 || xx > xr + gap * 0.6) continue;
              const o = V.noflip ? 1 : xx < Wd / 2 - gap * 0.55 ? -1 : xx > Wd / 2 + gap * 0.55 ? 1 : 0;
              S.molecule(c, xx, cy + Math.sin(tsim * 0.7 + j * 1.9) * 0.15 * sc, { angle: o === 1 ? 0 : o === -1 ? Math.PI : Math.PI / 2, scale: sc * 1.1 });
            }
          } else {
            S.molecule(c, x0 - gap * 1.7, cy, { angle: 0, scale: sc * 1.1, alpha: 0.45 });
            S.molecule(c, xr + gap * 1.7, cy, { angle: Math.PI, scale: sc * 1.1, alpha: 0.45 });
            for (let i = 0; i < n; i++) S.molecule(c, x0 + i * gap, cy + Math.sin(tsim * 0.7 + i * 1.9) * 0.15 * sc, { angle: orient[i] === 1 ? 0 : Math.PI, scale: sc * 1.1 });
          }
          // the excess proton
          let px = x0 - gap * 1.7, vis = true;
          if (phase === 'enter') px = lerp(x0 - gap * 1.7, x0, clamp(waitT / 2, 0, 1));
          else if (phase === 'hop') px = x0 + pos * gap + (stall ? 0 : clamp((hopT - th * 0.6) / (th * 0.4), 0, 1)) * (pos + 1 < n ? gap : 0);
          else if (phase === 'out') px = lerp(xr, xr + gap * 1.7, clamp(waitT / th, 0, 1));
          else if (phase === 'blocked') px = x0 + pos * gap;
          else vis = false;
          if (vis) drawHydronium(c, C, px, cy, sc);
          if (phase === 'blocked') kit.label(c, 'blocked: the dipoles are reversed here', Wd / 2, cy + 4.8 * sc + 22, { color: C.bad, size: 12.5, align: 'center', weight: 700 });
          if (m === 'wire' && stall) kit.label(c, 'waiting for the molecule to turn round', Wd / 2, cy + wallH + 40, { color: C.warn, size: 12, align: 'center' });
          if (m === 'wire') kit.label(c, phase === 'turn' ? 'turning the wire round …' : '', Wd / 2, Hh - 14, { color: C.muted, size: 12, align: 'center' });
          if (m === 'aqp') kit.label(c, phase === 'idle' ? 'water: about 3 × 10⁹ molecules per second each way, single file · press Send a proton' : 'water: about 3 × 10⁹ molecules per second each way, single file', Wd / 2, Hh - 14, { color: C.muted, size: 11.5, align: 'center' });
          // read-outs
          const cross = n * th, cyc = cross + V.reset + 2;
          roW.set('hop', th.toFixed(2) + ' ps');
          roW.set('cross', cross.toFixed(1) + ' ps for ' + n + ' waters (' + (n * 0.28).toFixed(1) + ' nm)');
          roW.set('cyc', cyc.toFixed(0) + ' ps');
          roW.set('max', (1e12 / cyc).toExponential(1) + ' per second');
          roW.set('ca', '10⁶ per second: the wire could carry ' + Math.round(1e12 / cyc / 1e6).toLocaleString('en') + ' times more');
          roW.set('cnt', String(count));
          const fnet = clamp(9 * 1.8e-5 * V.osm, 0, 1);
          roA.set('gross', '≈ 3 × 10⁹ per second per channel');
          roA.set('net', (3e9 * fnet).toExponential(1) + ' per second (' + (100 * fnet).toFixed(1) + ' % of the exchange)');
          roA.set('cell', (2e5 * 3e9).toExponential(1) + ' per second each way: the cell’s ≈ 2 × 10¹² waters turn over in about ' + (2.1e12 / (2e5 * 3e9) * 1e3).toFixed(0) + ' ms');
          roA.set('pr', V.noflip ? (phase === 'done' ? 'passed through (hypothetical)' : 'passes if the wire is unbroken') : phase === 'blocked' || phase === 'done' ? 'stopped at the middle' : 'press Send a proton');
        } else {
          // ---- the vent
          const wallX = Wd * 0.5, wallW = 30;
          const pHo = V.pHo, pHv = V.pHv, dpH = pHv - pHo;
          const Tk = V.T + 273.15, mv = Math.log(10) * W.R * Tk / 96485.33212 * 1000;       // mV per pH unit
          const pmf = mv * dpH;
          c.fillStyle = 'rgba(230,110,70,0.20)'; c.fillRect(0, 0, wallX - wallW / 2, Hh);
          c.fillStyle = 'rgba(70,130,235,0.22)'; c.fillRect(wallX + wallW / 2, 0, Wd - wallX - wallW / 2, Hh);
          kit.label(c, 'ocean: pH ' + pHo.toFixed(1) + ' (acid, rich in CO₂)', 12, 20, { color: C.warn, size: 12, weight: 650 });
          kit.label(c, 'vent fluid: pH ' + pHv.toFixed(1) + ' (alkaline, with H₂)', Wd - 12, 20, { color: C.accent, size: 12, weight: 650, align: 'right' });
          c.fillStyle = C.surface; c.strokeStyle = C.faint; c.lineWidth = 1.4;
          const pores = [Hh * 0.28, Hh * 0.52, Hh * 0.76];
          let yy = 0;
          for (const py of [...pores, Hh + 12]) { c.beginPath(); c.rect(wallX - wallW / 2, yy, wallW, Math.max(0, py - 9 - yy)); c.fill(); c.stroke(); yy = py + 9; }
          kit.label(c, 'mineral wall, about a micrometre thick', wallX, Hh - 8, { color: C.muted, size: 11, align: 'center' });
          const nL = clamp(Math.round(300 * Math.pow(10, -(pHo - 5))), 1, 300), nR = clamp(Math.round(300 * Math.pow(10, -(pHv - 5))), 0, 40);
          while (parts.length < nL + nR + 20) parts.push({ x: rnd() * Wd, y: rnd() * Hh });
          c.fillStyle = C.bad; c.beginPath();
          for (let i = 0; i < nL; i++) {
            const p = parts[i];
            p.x = clamp(p.x + (rnd() - 0.5) * 3, 4, wallX - wallW / 2 - 4); p.y = clamp(p.y + (rnd() - 0.5) * 3, 6, Hh - 6);
            c.moveTo(p.x + 2.4, p.y); c.arc(p.x, p.y, 2.4, 0, TAU);
          }
          c.fill(); c.fillStyle = C.accent; c.beginPath();
          for (let i = 0; i < nR; i++) {
            const p = parts[nL + i];
            p.x = clamp(p.x + (rnd() - 0.5) * 3, wallX + wallW / 2 + 4, Wd - 4); p.y = clamp(p.y + (rnd() - 0.5) * 3, 6, Hh - 6);
            c.moveTo(p.x + 2.4, p.y); c.arc(p.x, p.y, 2.4, 0, TAU);
          }
          c.fill();
          spawn += dp * (0.02 + 0.07 * Math.max(0, dpH));
          while (spawn >= 1) { spawn -= 1; flashes.push({ t: 0, y: pores[Math.floor(rnd() * 3)] }); }
          c.fillStyle = C.bad; c.beginPath();
          for (const f of flashes) { f.t += dp * 0.5; const x = wallX - wallW / 2 - 18 + (wallW + 36) * clamp(f.t, 0, 1); c.moveTo(x + 3.6, f.y); c.arc(x, f.y, 3.6, 0, TAU); }
          c.fill();
          flashes = flashes.filter(f => f.t < 1);
          const sx = 24, sw = Wd - 48, sy = Hh - 40;
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + sw, sy); c.stroke();
          const xp = v => sx + sw * (v - 4) / 8;
          for (let v = 4; v <= 12; v++) { c.beginPath(); c.moveTo(xp(v), sy - 3); c.lineTo(xp(v), sy + 3); c.stroke(); kit.label(c, String(v), xp(v), sy + 14, { color: C.muted, size: 10.5, align: 'center' }); }
          const neu = W.pHneutral(V.T);
          c.fillStyle = C.ok; c.beginPath(); c.arc(xp(neu), sy, 5, 0, TAU); c.fill();
          kit.label(c, 'neutral ' + neu.toFixed(1), xp(neu), sy - 12, { color: C.ok, size: 11, align: 'center' });
          c.fillStyle = C.warn; c.beginPath(); c.arc(xp(pHo), sy, 5, 0, TAU); c.fill();
          c.fillStyle = C.accent; c.beginPath(); c.arc(xp(pHv), sy, 5, 0, TAU); c.fill();
          kit.label(c, '≈ ' + Math.abs(pmf).toFixed(0) + ' mV across the wall', wallX, sy - 34, { color: C.text, size: 12.5, align: 'center', weight: 700, bg: C.bg2 });
          roV.set('dpH', dpH.toFixed(1) + ' units');
          roV.set('pmf', pmf.toFixed(0) + ' mV (' + mv.toFixed(1) + ' mV per pH unit); a mitochondrion ≈ 150–200 mV');
          roV.set('dG', (96.485 * pmf / 1000).toFixed(1) + ' kJ/mol');
          roV.set('atp', pmf > 5 ? (50 / (96.485 * pmf / 1000)).toFixed(1) : '—');
          roV.set('neu', neu.toFixed(2) + ' (pKw ' + W.pKw(V.T).toFixed(2) + ')');
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osmosis in cells */
  Hyper.sim('cell-osmosis', {
    title: 'A cell in solutions of different strength',
    blurb: `Choose a cell and a solution. The grey dots outside are dissolved particles (ions, sugars) in the solution you choose; the dots inside are the cell's own. Water crosses the membrane towards the side with more particles, until the cell swells against its limit, shrinks, or finds a balance. A **red blood cell** has no wall and is a nearly ideal osmometer (the Boyle–van't Hoff law with a fifth of the volume taken by solids); it bursts when it swells to about 1.8 times its volume. A **plant cell** has a wall: it swells only a little, and the wall pushes back with a turgor pressure up to about 1 MPa. A **freshwater protist** has no wall and lives in water far weaker than itself, and keeps from bursting by pumping the water out with a contractile vacuole. The solutions are in milliosmoles per litre of dissolved particles; the models are schematic, built from textbook values.

**Try this**
- *Red cell:* start at 290 (isotonic saline, 0.9 % NaCl): the cell keeps its shape. Drop to 150 (0.45 %): it swells to a sphere and the first cells burst. Go to pure water: it bursts at once. Go to 920 (3 % saline): it shrivels and its edge turns spiky (crenation).
- *Plant cell:* in pure water the turgor climbs to the full 1 MPa and the cell is firm; at 200 the wall relaxes; above 400–470 the living part pulls away from the wall (plasmolysis).
- *Protist:* in pond water the vacuole beats every few seconds. Raise the outside to 60, then 100: the beat slows and stops as the outside matches the inside. Untick *vacuole working* in pond water and watch the cell swell.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const TYPES = [['Red blood cell', 'rbc'], ['Plant cell (with a wall)', 'plant'], ['Freshwater protist', 'protist']];
      const PRE = [['Choose a solution …', -1], ['Pure water', 0], ['Pond water (about 5)', 5], ['Dilute saline, 0.45 % (150)', 150], ['Isotonic saline, 0.9 % (290)', 290], ['Hypertonic saline, 3 % (920)', 920]];
      const type0 = params.type === 'plant' || params.type === 'protist' ? params.type : 'rbc';
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Cell', options: TYPES, value: type0 },
        { id: 'osm', label: 'Solution outside', min: 0, max: 1000, step: 5, value: params.osm != null ? params.osm : (type0 === 'rbc' ? 290 : type0 === 'plant' ? 100 : 5), unit: 'mOsm/L' },
        { id: 'pre', type: 'select', label: 'Or pick one', options: PRE, value: -1 },
        { id: 'vac', type: 'check', label: 'Contractile vacuole working', value: true },
        { type: 'buttons', items: [{ id: 'new', label: 'New cell', primary: true }] }
      ], (id, val) => {
        if (id === 'pre' && val >= 0) ctl.set('osm', val);
        if (id === 'type') { ctl.set('osm', V.type === 'rbc' ? 290 : V.type === 'plant' ? 100 : 5); fresh(); setType(); }
        if (id === 'new') fresh();
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sol', 'Solution outside'], ['pi', 'Osmotic pressure of the solution'], ['v', 'Cell volume (normal = 1)'], ['x', 'Extra'], ['state', 'State']]);
      const plot = kit.plot(graph, { x: { label: 'solution outside (mOsm/L)', min: 0, max: 1000 }, y: { label: '' } }, 170);
      const rnd = rng(61);
      const PL = { cfull: 400, V0: 0.85, T: 20 };
      const CIN = 100;                                         // schematic internal osmolarity of the protist, mOsm/L
      let v = 1, lysed = false, vph = 0, vph2 = 0.5, dirty = true, bursts = [], hb = [];
      const dots = Array.from({ length: 220 }, () => ({ x: rnd(), y: rnd(), a: rnd() * TAU }));
      const inner = Array.from({ length: 46 }, () => { const r = Math.sqrt(rnd()), a = rnd() * TAU; return { x: r * Math.cos(a), y: r * Math.sin(a), a: rnd() * TAU }; });
      function fresh() { v = 1; lysed = false; vph = 0; vph2 = 0.5; bursts = []; hb = []; }
      function setType() { ctl.show('vac', V.type === 'protist'); }
      setType();
      const eqRBC = osm => 0.2 + 0.8 * 290 / Math.max(osm, 1);
      const RTp = W.R * (PL.T + 273.15);
      function plantP(vol) { return PL.cfull * RTp * Math.max(0, (vol - PL.V0) / (1 - PL.V0)); }
      function eqPlant(osm) {
        const po = osm * RTp;
        if (po <= 0) return 1;
        const f = vol => PL.cfull * RTp / vol - plantP(vol) - po;
        let a = 0.15, b = 1;
        for (let i = 0; i < 60; i++) { const mid = (a + b) / 2; if (f(mid) > 0) a = mid; else b = mid; }
        return (a + b) / 2;
      }
      const vacPeriod = osm => osm >= CIN * 0.995 ? Infinity : 12 * (1 - 5 / CIN) / Math.max(1e-3, 1 - osm / CIN);
      function curve() {
        const pts = [];
        for (let o = 0; o <= 1000; o += 10) {
          if (V.type === 'rbc') pts.push([o, Math.min(2.4, eqRBC(o))]);
          else if (V.type === 'plant') pts.push([o, plantP(eqPlant(o)) / 1e6]);
          else if (o <= 120) pts.push([o, Number.isFinite(vacPeriod(o)) ? 60 / vacPeriod(o) : 0]);
        }
        return pts;
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const h = Math.min(dt, 0.05), osm = V.osm, type = V.type;
        // ---- the physics, schematic
        let state = '', extra = '', Tc = 20, flow = 0;
        if (type === 'rbc') {
          Tc = 37;
          const eq = eqRBC(osm);
          if (!lysed) { v += (eq - v) * (1 - Math.exp(-h * 2.2)); flow = eq - v; if (v > 1.8) { lysed = true; for (let i = 0; i < 40; i++) hb.push({ x: (rnd() - 0.5) * 0.6, y: (rnd() - 0.5) * 0.6, vx: (rnd() - 0.5) * 0.5, vy: (rnd() - 0.5) * 0.5 }); } }
          state = lysed ? 'burst (haemolysis)' : v > 1.5 ? 'swollen to a sphere, near bursting' : v > 1.05 ? 'swollen' : v < 0.85 ? 'shrunken and crenated' : v < 0.97 ? 'slightly shrunken' : 'normal';
          extra = 'area fixed at ≈ 140 µm²: a sphere of it holds ≈ 1.7 × normal volume';
        } else if (type === 'plant') {
          const eq = eqPlant(osm);
          v += (eq - v) * (1 - Math.exp(-h * 1.5)); flow = eq - v;
          const P = plantP(v);
          state = v < PL.V0 - 0.003 ? 'plasmolysed: the protoplast has pulled away from the wall' : P > 0.9 * PL.cfull * RTp ? 'fully turgid' : P > 0.02e6 ? 'turgid' : 'at the point of wilting';
          extra = 'turgor P = ' + (P / 1e6).toFixed(2) + ' MPa; cell water potential Ψ = P − π = ' + ((P - PL.cfull * RTp / v) / 1e6).toFixed(2) + ' MPa';
        } else {
          const per = vacPeriod(osm), infl = 1 / v - osm / CIN;
          const pump = V.vac ? Math.max(0, infl) : 0;
          if (!lysed) { v += h * 0.05 * (infl - pump); v = clamp(v, 0.3, 2.5); flow = infl; if (v > 1.5) lysed = true; }
          if (V.vac && Number.isFinite(per)) { vph += h / per; vph2 += h / per; if (vph >= 1) { vph = 0; bursts.push({ t: 0, k: 0 }); } if (vph2 >= 1) { vph2 = 0; bursts.push({ t: 0, k: 1 }); } }
          state = lysed ? 'burst' : !V.vac && infl > 0.2 ? 'swelling: nothing is pumping the water out' : !Number.isFinite(per) ? 'vacuole idle: nothing to pump out' : v < 0.8 ? 'shrinking in a strong solution' : 'steady';
          extra = Number.isFinite(per) ? 'vacuole beats every ' + per.toFixed(0) + ' s' : 'no vacuole beats';
        }
        // ---- the picture
        const cx = Wd * 0.36, cy = Hh * 0.5;
        // dissolved particles outside
        const nOut = Math.round(clamp(osm, 0, 1000) / 1000 * 190);
        c.fillStyle = C.muted; c.globalAlpha = 0.7; c.beginPath();
        const inside = (x, y) => {
          if (type === 'plant') { const s = 1; return Math.abs(x - cx) < 108 * s && Math.abs(y - cy) < 74 * s && v >= PL.V0 - 0.003; }
          if (type === 'protist') return ((x - cx) / (112 * Math.sqrt(v))) ** 2 + ((y - cy) / (64 * Math.sqrt(v))) ** 2 < 1;
          const rr = 74 * (lysed ? 0.8 : 1); return Math.hypot(x - cx, y - cy) < rr + 4;
        };
        for (let i = 0; i < nOut; i++) {
          const d = dots[i], x = (d.x * Wd * 0.7 + Math.sin(d.a + i + performance.now() / 1500) * 3) + 8, y = d.y * Hh + Math.cos(d.a + performance.now() / 1700) * 3;
          if (inside(x, y)) continue;
          c.moveTo(x + 2.2, y); c.arc(x, y, 2.2, 0, TAU);
        }
        c.fill(); c.globalAlpha = 1;
        if (type === 'rbc') {
          const R0 = Math.min(Hh * 0.27, 78), vv = lysed ? 1.7 : v;
          const rad = R0 * (vv >= 1 ? 1 - 0.18 * (vv - 1) / 0.7 : 1 - 0.12 * (1 - vv));
          const cre = clamp((0.95 - vv) / 0.35, 0, 1);
          c.beginPath();
          for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, r = rad * (1 + cre * 0.12 * Math.sin(16 * a)); const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.closePath();
          if (lysed) { c.setLineDash([5, 4]); c.strokeStyle = C.bad; c.lineWidth = 2; c.stroke(); c.setLineDash([]); }
          else { c.fillStyle = 'rgba(214,70,60,0.80)'; c.fill(); c.strokeStyle = C.bad; c.lineWidth = 2; c.stroke(); }
          if (!lysed) {
            c.beginPath(); c.arc(cx, cy, rad * 0.42 * clamp((1.7 - vv) / 0.7, 0, 1), 0, TAU); c.fillStyle = 'rgba(255,200,190,0.45)'; c.fill();
            c.fillStyle = C.text; c.globalAlpha = 0.8; c.beginPath();
            for (const p of inner) { const x = cx + p.x * rad * 0.82, y = cy + p.y * rad * 0.82; c.moveTo(x + 1.6, y); c.arc(x, y, 1.6, 0, TAU); }
            c.fill(); c.globalAlpha = 1;
          } else {
            c.fillStyle = 'rgb(200,50,50)'; c.globalAlpha = 0.8; c.beginPath();
            for (const p of hb) { p.x += p.vx * h * 0.6; p.y += p.vy * h * 0.6; const x = cx + p.x * 2 * R0, y = cy + p.y * 2 * R0; c.moveTo(x + 2.5, y); c.arc(x, y, 2.5, 0, TAU); }
            c.fill(); c.globalAlpha = 1;
            kit.label(c, 'haemoglobin escapes', cx, cy + R0 + 26, { color: C.bad, size: 12, align: 'center' });
          }
          kit.label(c, 'red blood cell · ' + (lysed ? 'burst' : (v * 90).toFixed(0) + ' fL'), cx, Hh - 14, { color: C.muted, size: 11.5, align: 'center' });
          if (!lysed) for (let i = 0; i < 8; i++) {
            const a = i / 8 * TAU + 0.3, dir = Math.sign(flow) || 0, m = Math.min(1, Math.abs(flow) * 3);
            if (m < 0.04) continue;
            const r1 = rad + 40 * (dir > 0 ? 1 : 0.25), r2 = rad + 40 * (dir > 0 ? 0.25 : 1);
            kit.arrow(c, cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), cx + r2 * Math.cos(a), cy + r2 * Math.sin(a), C.accent, 1.2 + 2 * m);
          }
        } else if (type === 'plant') {
          const P = plantP(v), Pmax = PL.cfull * RTp, sw = 1 + 0.05 * clamp((v - PL.V0) / (1 - PL.V0), 0, 1);
          const wallW = 220 * sw, wallH = 150 * sw, ix = wallW / 2 - 8, iy = wallH / 2 - 8;
          const fill = v >= PL.V0 ? 1 : Math.sqrt(v / PL.V0);
          c.fillStyle = 'rgba(70,170,110,0.35)'; c.strokeStyle = C.ok; c.lineWidth = 2;
          const rr = (x, y, w, hh, r) => { c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + hh - r); c.quadraticCurveTo(x + w, y + hh, x + w - r, y + hh); c.lineTo(x + r, y + hh); c.quadraticCurveTo(x, y + hh, x, y + hh - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath(); };
          rr(cx - ix * fill, cy - iy * fill, 2 * ix * fill, 2 * iy * fill, 14); c.fill(); c.lineWidth = 1.5; c.stroke();
          rr(cx - ix * fill * 0.72, cy - iy * fill * 0.7, 2 * ix * fill * 0.72, 2 * iy * fill * 0.7, 12); c.fillStyle = 'rgba(160,220,190,0.35)'; c.fill();
          c.strokeStyle = C.ok; c.lineWidth = 7; rr(cx - wallW / 2, cy - wallH / 2, wallW, wallH, 18); c.stroke();
          if (P > 1e4) for (let i = 0; i < 6; i++) {
            const a = i / 6 * TAU + 0.5, ca = Math.cos(a), sa = Math.sin(a), r0 = 0.55, L = 8 + 28 * P / Pmax;
            const px = cx + ca * ix * 0.62, py = cy + sa * iy * 0.62;
            kit.arrow(c, px, py, px + ca * L, py + sa * L, C.warn, 2);
          }
          kit.label(c, 'plant cell · wall in green', cx, Hh - 14, { color: C.muted, size: 11.5, align: 'center' });
          if (P > 1e4) kit.label(c, 'turgor ' + (P / 1e6).toFixed(2) + ' MPa', cx, cy + wallH / 2 + 22, { color: C.warn, size: 12, align: 'center', weight: 650 });
          else if (v < PL.V0 - 0.003) kit.label(c, 'plasmolysis', cx, cy + wallH / 2 + 22, { color: C.bad, size: 12, align: 'center', weight: 650 });
        } else {
          const rx = 112 * Math.sqrt(v), ry = 64 * Math.sqrt(v);
          c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU);
          c.fillStyle = lysed ? 'rgba(0,0,0,0)' : 'rgba(110,190,150,0.35)'; c.fill(); c.strokeStyle = C.ok; c.lineWidth = 2; if (lysed) c.setLineDash([5, 4]); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.ok; c.globalAlpha = 0.5; c.lineWidth = 1;
          for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, ca = Math.cos(a), sa = Math.sin(a), wob = Math.sin(performance.now() / 150 + i) * 2; c.beginPath(); c.moveTo(cx + rx * ca, cy + ry * sa); c.lineTo(cx + (rx + 9 + wob) * ca, cy + (ry + 9 + wob) * sa); c.stroke(); }
          c.globalAlpha = 1;
          if (!lysed) {
            c.fillStyle = C.text; c.globalAlpha = 0.7; c.beginPath();
            for (const p of inner) { const x = cx + p.x * rx * 0.6 + 4, y = cy + p.y * ry * 0.7; c.moveTo(x + 1.5, y); c.arc(x, y, 1.5, 0, TAU); }
            c.fill(); c.globalAlpha = 1;
            for (const [px, ph] of [[cx - rx * 0.55, vph], [cx + rx * 0.55, vph2]]) {
              c.beginPath(); c.arc(px, cy, 4 + 17 * Math.sqrt(clamp(ph, 0, 1)), 0, TAU); c.fillStyle = 'rgba(120,190,255,0.55)'; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.2; c.stroke();
            }
            for (const b of bursts) { b.t += h * 2.5; const px = cx + (b.k ? 1 : -1) * rx * 0.55, a = clamp(b.t, 0, 1); kit.arrow(c, px, cy - ry * 0.6, px, cy - ry - 18 * a, C.accent, 2); }
            bursts = bursts.filter(b => b.t < 1);
          }
          kit.label(c, 'freshwater protist · volume ' + (lysed ? 'burst' : v.toFixed(2)), cx, Hh - 14, { color: C.muted, size: 11.5, align: 'center' });
          if (!lysed && flow > 0.05) for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + 0.4; kit.arrow(c, cx + (rx + 40) * Math.cos(a), cy + (ry + 34) * Math.sin(a), cx + (rx + 12) * Math.cos(a), cy + (ry + 10) * Math.sin(a), C.accent, 1.2 + Math.min(2, flow)); }
        }
        // key
        kit.label(c, '· dissolved particles outside', 12, 16, { color: C.muted, size: 10.5 });
        kit.label(c, '→ water crossing the membrane', 12, 32, { color: C.accent, size: 10.5 });
        // read-outs and graph
        const nacl = osm * 0.00314;
        const pi = W.osmoticPressure(osm / 1000, 1, Tc + 273.15);
        ro.set('sol', osm.toFixed(0) + ' mOsm/L (like ' + nacl.toFixed(2) + ' % NaCl)');
        ro.set('pi', pi >= 1e6 ? (pi / 1e6).toFixed(2) + ' MPa' : (pi / 1e3).toFixed(0) + ' kPa (' + (pi / 101325).toFixed(1) + ' atm)');
        ro.set('v', lysed ? 'burst' : v.toFixed(2));
        ro.set('x', extra);
        ro.set('state', state);
        if (dirty) {
          const cur = type === 'rbc' ? Math.min(2.4, eqRBC(osm)) : type === 'plant' ? plantP(eqPlant(osm)) / 1e6 : (Number.isFinite(vacPeriod(osm)) ? 60 / vacPeriod(osm) : 0);
          const opts = type === 'rbc' ? { y: { label: 'equilibrium volume (normal = 1)', min: 0, max: 2.4 }, hlines: [{ y: 1.8, label: 'bursts above this' }, { y: 1, label: 'normal' }] }
            : type === 'plant' ? { y: { label: 'turgor pressure at equilibrium (MPa)', min: 0, max: 1.1 }, hlines: [] }
            : { y: { label: 'vacuole beats per minute', min: 0, max: 6 }, hlines: [] };
          plot.set(Object.assign({ series: [{ pts: curve(), label: 'at equilibrium', color: C.accent }], x: { label: 'solution outside (mOsm/L)', min: 0, max: type === 'protist' ? 120 : 1000 }, marks: [{ x: Math.min(osm, type === 'protist' ? 120 : 1000), y: cur, label: 'now' }] }, opts));
          dirty = false;
        }
      }, box.stage);
      loop.start();
    }
  });
})();
