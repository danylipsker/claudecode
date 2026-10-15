/* HYPER-WATER · sims/discovering-water.js — the simulations of the topic "Discovering water".
 *   dw-spark-jar     Cavendish's experiment in a glass jar: two gases, a spark, a dew on the glass, and the mass unchanged
 *                    (schematic: molecules as dots, one dot = 5 mL of gas; the amounts, the dew and the pressure are computed)
 *   dw-gun-barrel    Lavoisier's hot gun barrel: steam in, hydrogen out, the iron gaining the oxygen's mass
 *                    (schematic rate: a smooth switch between about 450 and 750 °C; the stoichiometry is exact)
 *   dw-two-to-one    two volumes of hydrogen and one of oxygen: three rival pictures of the atoms, the volumes each predicts,
 *                    and the atomic weight of oxygen each implies
 *   dw-timeline      a scrubbable timeline of the discovery of water, with what was believed at each date
 *   dw-blind-trial   a blinded test of "water memory": many labs, the statistics of a null result, and how bias creates one
 *   dw-fitness       Henderson's argument as a dashboard: where water stands among ten liquids on five properties
 * Numbers come from kit.water where it has them (vapour pressure, liquids, Avogadro's number, the gas constant); the rest are
 * standard molar masses written once at the top of this file.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const MH2 = 2.016, MO2 = 31.998, MN2 = 28.014, MH2O = 18.015, MO = 15.999, MFE = 55.845;   // g/mol
  const fm = (x, d) => Number.isFinite(x) ? x.toFixed(d) : '—';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const rnd = (a, b) => a + (b - a) * Math.random();
  /* a small seeded generator, so that molecules sit in the same places each time a jar is refilled */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const roundRectPath = (c, x, y, w, h, r) => { if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };

  /* ================================================================ Cavendish's spark */
  Hyper.sim('dw-spark-jar', {
    title: 'Cavendish\'s spark in a jar',
    blurb: `A glass jar holds two gases and two wires. A spark crosses the gap, the gases vanish in a flash, and a dew forms on the glass. Weigh the sealed jar before and after: it has not changed. The dots are molecules (one dot is 5 mL of gas, schematic), but the amounts, the mass of the dew and the pressure afterwards are computed.

**Try this**
- Give it *twice as much* inflammable air as the other gas (100 mL and 50 mL): both disappear completely and the dew weighs 75 mg. That is the 2 : 1 of the next pages.
- Add more of either gas than the ratio allows: the extra is left over, untouched. The spark burns exactly two of one for one of the other, never more.
- Choose *common air* as the other gas. It takes about 480 mL of air to burn 100 mL of inflammable air, because only a fifth is oxygen, and most of the rest — nitrogen — is left. Cavendish saw that remainder and wrote it down.
- Look at the pressure after the jar cools: the gas has shrunk to a dew, which is a thousand times smaller in volume.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const Tk = 293.15, P0 = 101325, molPerMl = P0 * 1e-6 / (W.R * Tk);      // gas at 20 °C and 1 atm: 24.06 L/mol
      const DOT = 5;                                                           // mL of gas per drawn dot
      const ctl = kit.controls(box.side, [
        { id: 'vh', label: 'Inflammable air (hydrogen)', min: 0, max: 200, step: 5, value: params.vh != null ? params.vh : 100, unit: 'mL' },
        { id: 'src', type: 'select', label: 'The other gas', options: [['Dephlogisticated air (pure oxygen)', 'o2'], ['Common air (21 % oxygen)', 'air']], value: params.src || 'o2' },
        { id: 'vo', label: 'Amount of that gas', min: 0, max: 600, step: 5, value: params.vo != null ? params.vo : 50, unit: 'mL' },
        { type: 'buttons', items: [{ id: 'spark', label: 'Strike the spark', primary: true }, { id: 'reset', label: 'Refill the jar' }] }
      ], (id) => { if (id === 'spark') fire(); else fill(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vol', 'Gas sealed in the jar'], ['gm', 'Mass of that gas'], ['dew', 'Dew on the glass'], ['left', 'Gas left over'], ['ratio', 'Hydrogen used : oxygen used'], ['p', 'Pressure after cooling to 20 °C'], ['bal', 'Jar and contents, before → after']]);
      const VESSEL = 250;                                                      // g, the empty jar
      let P = [], drops = [], phase = 'ready', pt = 0, pl = null, hot = 0;

      function plan() {
        const o2 = V.src === 'air' ? 0.2095 * V.vo : V.vo, n2 = V.src === 'air' ? 0.7905 * V.vo : 0;
        const nH = V.vh * molPerMl, nO = o2 * molPerMl, nN = n2 * molPerMl;
        const x = Math.min(nH, 2 * nO);                                         // mol of H₂ burned = mol of water made
        const ntot = nH + nO + nN, nleft = ntot - 1.5 * x, Vj = (V.vh + V.vo) * 1e-6;
        const pgas = ntot > 0 ? P0 * nleft / ntot : 0;
        const pvap = Vj > 0 ? Math.min(W.vapourPressure(20), x * W.R * Tk / Vj) : 0;
        return { nH, nO, nN, x, nleft, ntot, pAfter: pgas + pvap, mgas: nH * MH2 + nO * MO2 + nN * MN2, dew: x * MH2O,
          Hl: (nH - x) / molPerMl, Ol: (nO - x / 2) / molPerMl, Nl: nN / molPerMl,
          dots: { H: Math.round(V.vh / DOT), O: Math.round(o2 / DOT), N: Math.round(n2 / DOT) } };
      }
      function fill() {
        pl = plan(); phase = 'ready'; pt = 0; drops = []; hot = 0; P = [];
        const geo = jar(), r = rng(7 + Math.round(V.vh) * 31 + Math.round(V.vo));
        for (const k of ['H', 'O', 'N']) {
          let n = pl.dots[k];
          if (n === 0 && ((k === 'H' && V.vh > 0) || (k === 'O' && V.vo > 0 && pl.nO > 0) || (k === 'N' && pl.nN > 0))) n = 1;
          for (let i = 0; i < n; i++) {
            const a = r() * TAU, d = Math.sqrt(r()) * geo.R * 0.85, sp = (k === 'H' ? 130 : 55) * (0.5 + r()), b = r() * TAU;
            P.push({ k, x: geo.cx + Math.cos(a) * d, y: geo.cy + Math.sin(a) * d, vx: Math.cos(b) * sp, vy: Math.sin(b) * sp, die: -1, a: 1 });
          }
        }
        show(false);
      }
      function jar() { const Wd = st.W, Hh = st.H, R = Math.max(40, Math.min(Hh * 0.36, Wd * 0.25)); return { cx: Wd * 0.33, cy: Hh * 0.47, R }; }
      function fire() {
        if (phase !== 'ready') fill();
        phase = 'flash'; pt = 0;
        // choose which dots are consumed (those that the arithmetic says disappear), each with its own delay
        const goal = { H: Math.max(0, Math.round(pl.Hl / DOT)), O: Math.max(0, Math.round(pl.Ol / DOT)), N: P.filter(p => p.k === 'N').length };
        for (const k of ['H', 'O']) {
          const mine = P.filter(p => p.k === k);
          const kill = mine.length - goal[k];
          for (let i = 0; i < kill && i < mine.length; i++) mine[i].die = 0.2 + Math.random() * 1.3;
        }
        hot = 1;
      }
      function show(done) {
        if (!pl) return;
        ro.set('vol', fm(V.vh + V.vo, 0) + ' mL (' + fm(V.vh, 0) + ' of inflammable air, ' + fm(V.vo, 0) + ' of ' + (V.src === 'air' ? 'common air' : 'dephlogisticated air') + ')');
        ro.set('gm', fm(pl.mgas * 1000, 1) + ' mg');
        if (!done) { for (const k of ['dew', 'left', 'ratio', 'p']) ro.set(k, '—'); ro.set('bal', fm(VESSEL + pl.mgas, 4) + ' g → (strike the spark)'); return; }
        ro.set('dew', pl.x > 0 ? fm(pl.dew * 1000, 1) + ' mg (' + fm(pl.x * 1000, 2) + ' mmol of water)' : 'none');
        const left = [];
        if (pl.Hl > 0.05) left.push(fm(pl.Hl, 0) + ' mL hydrogen');
        if (pl.Ol > 0.05) left.push(fm(pl.Ol, 0) + ' mL oxygen');
        if (pl.Nl > 0.05) left.push(fm(pl.Nl, 0) + ' mL nitrogen and the rest of the air');
        ro.set('left', left.length ? left.join(', ') : 'nothing: both gases used up');
        ro.set('ratio', pl.x > 0 ? '2.00 : 1  (volumes at one temperature and pressure)' : '—');
        ro.set('p', pl.ntot > 0 ? fm(pl.pAfter / 1000, 1) + ' kPa (was 101.3)' : '—');
        ro.set('bal', fm(VESSEL + pl.mgas, 4) + ' g → ' + fm(VESSEL + pl.mgas, 4) + ' g  (no change)');
      }
      fill();
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), mc = S.molColor(), Wd = st.W, Hh = st.H, g = jar();
        pt += dt;
        if (phase === 'flash' && pt > 0.35) { phase = 'react'; pt = 0; }
        if (phase === 'react' && pt > 1.9) {
          phase = 'done'; pt = 0; show(true);
          const nd = pl.x > 0 ? 14 : 0;
          for (let i = 0; i < nd; i++) drops.push({ a: Math.PI * (0.15 + 0.7 * Math.random()), r: 1.6 + 3.2 * Math.min(1, pl.dew / 0.075) * Math.random(), d: 0.98 });
        }
        hot = phase === 'done' ? Math.max(0, hot - dt * 0.5) : hot;
        /* ---- the jar */
        c.save();
        c.fillStyle = C.dark ? 'rgba(160,200,255,0.08)' : 'rgba(120,170,230,0.10)'; c.strokeStyle = C.text; c.lineWidth = 2.2;
        c.beginPath(); c.arc(g.cx, g.cy, g.R, 0, TAU); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(g.cx - 10, g.cy - g.R + 1); c.lineTo(g.cx - 10, g.cy - g.R - 20); c.moveTo(g.cx + 10, g.cy - g.R + 1); c.lineTo(g.cx + 10, g.cy - g.R - 20); c.stroke();
        // the wires and the gap
        const gap = g.R * 0.12;
        c.strokeStyle = C.muted; c.lineWidth = 3; c.lineCap = 'round';
        c.beginPath(); c.moveTo(g.cx - g.R - 28, g.cy); c.lineTo(g.cx - gap, g.cy); c.moveTo(g.cx + g.R + 28, g.cy); c.lineTo(g.cx + gap, g.cy); c.stroke();
        c.restore();
        kit.label(c, 'to the electric machine', g.cx - g.R - 30, g.cy - 14, { color: C.muted, size: 10.5, align: 'left' });
        kit.label(c, 'to the electric machine', g.cx + g.R + 30, g.cy - 14, { color: C.muted, size: 10.5, align: 'right' });
        /* ---- the flash */
        if (phase === 'flash') {
          const k = 1 - pt / 0.35;
          c.save(); c.globalAlpha = Math.max(0, k);
          const gr = c.createRadialGradient ? c.createRadialGradient(g.cx, g.cy, 1, g.cx, g.cy, g.R * 0.9) : null;
          if (gr) { gr.addColorStop(0, 'rgba(255,240,170,0.95)'); gr.addColorStop(1, 'rgba(255,170,60,0)'); c.fillStyle = gr; c.beginPath(); c.arc(g.cx, g.cy, g.R * 0.9, 0, TAU); c.fill(); }
          c.strokeStyle = C.warn; c.lineWidth = 2.5; c.beginPath(); c.moveTo(g.cx - gap, g.cy); c.lineTo(g.cx - gap * 0.4, g.cy - 7); c.lineTo(g.cx + gap * 0.3, g.cy + 6); c.lineTo(g.cx + gap, g.cy); c.stroke();
          c.restore();
        }
        /* ---- the molecules */
        const heat = 1 + 0.8 * hot, lim = g.R - 7;
        for (const p of P) {
          if (p.die >= 0 && (phase === 'done' || (phase === 'react' && pt >= p.die))) {
            p.a = Math.max(0, p.a - dt * 3); const dx = g.cx - p.x, dy = g.cy - p.y; p.x += dx * dt * 4; p.y += dy * dt * 4;
          } else {
            p.x += p.vx * dt * heat; p.y += p.vy * dt * heat;
            const dx = p.x - g.cx, dy = p.y - g.cy, d = Math.hypot(dx, dy);
            if (d > lim) { const nx = dx / d, ny = dy / d, vn = p.vx * nx + p.vy * ny; p.vx -= 2 * vn * nx; p.vy -= 2 * vn * ny; p.x = g.cx + nx * lim; p.y = g.cy + ny * lim; }
          }
        }
        P = P.filter(p => p.a > 0.02);
        for (const p of P) {
          c.save(); c.globalAlpha = p.a;
          if (p.k === 'H') { kit.dot(c, p.x, p.y, 3.4, mc.H, mc.Hstroke); }
          else if (p.k === 'O') { kit.dot(c, p.x - 2.6, p.y, 4.4, mc.O); kit.dot(c, p.x + 2.6, p.y, 4.4, mc.O); }
          else { kit.dot(c, p.x - 2.4, p.y, 3.8, '#7d93b8'); kit.dot(c, p.x + 2.4, p.y, 3.8, '#7d93b8'); }
          c.restore();
        }
        /* ---- the dew, drops on the glass that run down and gather at the bottom */
        for (const d of drops) {
          const x = g.cx + Math.cos(d.a) * (g.R - 4) * d.d, y = g.cy + Math.sin(d.a) * (g.R - 4) * d.d;
          S.drop(c, x, y, d.r);
        }
        if (phase === 'done' && drops.length) kit.label(c, 'dew: pure water', g.cx, g.cy + g.R + 18, { color: C.accent, size: 12, align: 'center', weight: 650 });
        /* ---- the balance on the right: the sealed jar weighs the same before and after */
        const bx = Wd * 0.72, by = Hh * 0.42, bw = Math.min(150, Wd * 0.22);
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.fillStyle = C.muted;
        c.beginPath(); c.moveTo(bx, by + 20); c.lineTo(bx, by + 80); c.moveTo(bx - 28, by + 80); c.lineTo(bx + 28, by + 80); c.stroke();
        c.beginPath(); c.moveTo(bx - bw / 2, by); c.lineTo(bx + bw / 2, by); c.stroke();           // level beam
        for (const sx of [-1, 1]) { const px = bx + sx * bw / 2; c.beginPath(); c.moveTo(px, by); c.lineTo(px - 22, by + 30); c.moveTo(px, by); c.lineTo(px + 22, by + 30); c.moveTo(px - 24, by + 30); c.lineTo(px + 24, by + 30); c.stroke(); }
        c.beginPath(); c.arc(bx - bw / 2, by + 20, 9, 0, TAU); c.fillStyle = 'rgba(120,170,230,0.25)'; c.fill(); c.stroke();
        c.fillStyle = C.muted; c.fillRect(bx + bw / 2 - 12, by + 20, 24, 10); c.fillRect(bx + bw / 2 - 8, by + 12, 16, 8);
        c.restore();
        kit.label(c, 'jar', bx - bw / 2, by + 46, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'weights', bx + bw / 2, by + 46, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, phase === 'done' ? 'still level: the mass is the same' : 'level', bx, by + 98, { color: phase === 'done' ? C.ok : C.muted, size: 11.5, align: 'center', weight: 600 });
        /* ---- legend */
        const ly = Hh - 18;
        kit.dot(c, 16, ly, 3.4, mc.H, mc.Hstroke); kit.label(c, 'hydrogen H₂', 26, ly, { size: 11, color: C.muted });
        kit.dot(c, 114, ly, 4, mc.O); kit.dot(c, 121, ly, 4, mc.O); kit.label(c, 'oxygen O₂', 130, ly, { size: 11, color: C.muted });
        if (V.src === 'air') { kit.dot(c, 208, ly, 3.6, '#7d93b8'); kit.dot(c, 215, ly, 3.6, '#7d93b8'); kit.label(c, 'nitrogen N₂', 224, ly, { size: 11, color: C.muted }); }
        S.molecule(c, Wd - 120, ly + 3, { angle: -Math.PI / 2, scale: 6 }); kit.label(c, 'water H₂O', Wd - 100, ly, { size: 11, color: C.muted });
        kit.label(c, '1 dot = ' + DOT + ' mL', Wd - 12, 14, { size: 10.5, color: C.faint, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Lavoisier's gun barrel */
  Hyper.sim('dw-gun-barrel', {
    title: 'Lavoisier\'s hot gun barrel',
    blurb: `Water boils in a flask; its steam passes through a gun barrel packed with iron turnings and glowing in a furnace; what comes out at the far end is not steam but an inflammable gas, collected over water. Meanwhile the iron has gained weight: it has taken the oxygen out of the water. The rate is schematic (a smooth switch between about 450 and 750 °C, and never more than half the steam changed in one pass); the masses are exact: 3 Fe + 4 H₂O → Fe₃O₄ + 4 H₂.

**Try this**
- Keep the furnace *cold* (300 °C): the steam goes straight through and nothing happens. Raise it past 525 °C, the temperature at which iron first glows, and the gas begins to come over.
- Watch the ledger: the water that disappears is always exactly the hydrogen collected plus the weight the iron gained, and the iron gains **eight times** the weight of hydrogen. That is Lavoisier's proof that water is not an element.
- Press *burn the hydrogen*: it turns back into precisely the water that was decomposed (using oxygen from the air). Decomposition, then synthesis.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const Tk = 293.15, P0 = 101325, molPerMl = P0 * 1e-6 / (W.R * Tk);
      const FE0 = 5, FLASK0 = 100;                                       // g of iron turnings, g of water in the flask
      const KFE = 3 * MFE / (4 * MH2O), KH = 4 * MH2 / (4 * MH2O + 0), KO = 4 * MO / (4 * MH2O);   // g Fe, H₂, O per g of water decomposed (3Fe+4H₂O → Fe₃O₄+4H₂)
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Furnace temperature', min: 200, max: 1000, step: 10, value: params.T != null ? params.T : 700, unit: '°C' },
        { id: 'F', label: 'Steam supplied', min: 0.05, max: 1, step: 0.05, value: 0.3, unit: 'g/s' },
        { id: 'speed', label: 'Time speed-up', min: 1, max: 100, step: 1, value: 15, unit: '×' },
        { type: 'buttons', items: [{ id: 'burn', label: 'Burn the hydrogen', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], (id) => { if (id === 'reset') reset(); else if (id === 'burn') burn(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Furnace'], ['steam', 'Steam sent through'], ['conv', 'Water decomposed'], ['hyd', 'Hydrogen collected'], ['gain', 'Iron turnings, before → now'], ['ledger', 'Water decomposed − hydrogen − iron\'s gain'], ['back', 'Water regained by burning the hydrogen']]);
      let t = 0, flask = FLASK0, passed = 0, conv = 0, hyd = 0, burnedH = 0, regained = 0, bubbles = [], puffs = [], rate = 0, flash = 0;
      function reset() { t = 0; flask = FLASK0; passed = 0; conv = 0; hyd = 0; burnedH = 0; regained = 0; bubbles = []; puffs = []; rate = 0; flash = 0; }
      function burn() { if (hyd > 0) { regained += hyd * MH2O / MH2; burnedH += hyd; hyd = 0; flash = 1; } }
      const eff = T => 0.5 / (1 + Math.exp(-(T - 600) / 55));            // share of the steam that reacts in one pass (schematic)
      const glow = T => { const u = clamp((T - 450) / 500, 0, 1), r = Math.round(60 + 195 * Math.pow(u, 0.55)), gg = Math.round(40 + 150 * Math.pow(u, 1.6)), b = Math.round(40 + 70 * Math.pow(u, 3.5)); return 'rgb(' + r + ',' + gg + ',' + b + ')'; };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        /* ---- the chemistry */
        const h = dt * V.speed;
        const ironLeft = FE0 - conv * KFE;
        let dc = 0;
        if (flask > 0) {
          const dm = Math.min(flask, V.F * h);
          flask -= dm; passed += dm;
          dc = Math.min(dm * eff(V.T) * clamp(ironLeft / FE0, 0, 1), Math.max(0, ironLeft) / KFE);
        }
        conv += dc; hyd += dc * KH;
        const gain = (conv * KO);
        rate = h > 0 ? dc * KH / h : 0;
        t += h; flash = Math.max(0, flash - dt * 1.5);
        /* ---- geometry */
        const fx = Wd * 0.04, fy = Hh * 0.46, fw = Wd * 0.14, fh = Hh * 0.30;
        const bx0 = Wd * 0.22, bx1 = Wd * 0.66, byc = Hh * 0.30, jx = Wd * 0.80, jw = Math.min(70, Wd * 0.14), jtop = Hh * 0.40, jbot = Hh * 0.80, dishY = Hh * 0.80;
        /* flask, flame, steam pipe */
        S.beaker(c, fx, fy, fw, fh, clamp(flask / FLASK0, 0, 1), { label: 'boiling water' });
        if (flask > 0) { c.fillStyle = C.warn; c.beginPath(); c.moveTo(fx + fw / 2, fy + fh + 30); c.quadraticCurveTo(fx + fw / 2 - 9, fy + fh + 44, fx + fw / 2, fy + fh + 56); c.quadraticCurveTo(fx + fw / 2 + 9, fy + fh + 44, fx + fw / 2, fy + fh + 30); c.fill(); }
        c.strokeStyle = C.muted; c.lineWidth = 3; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(fx + fw / 2, fy); c.lineTo(fx + fw / 2, byc); c.lineTo(bx0, byc); c.stroke();
        if (flask > 0) { if (Math.random() < dt * 14) puffs.push({ u: 0 }); }
        puffs = puffs.filter(p => (p.u += dt * 0.5) < 1);
        const up = fy - byc, plen1 = up + Math.max(0, bx0 - (fx + fw / 2));
        for (const p of puffs) { const s = p.u * plen1; const x = s < up ? fx + fw / 2 : fx + fw / 2 + (s - up), y = s < up ? fy - s : byc; kit.dot(c, x, y + (Math.random() - 0.5), 3.2, 'rgba(180,190,200,0.75)'); }
        kit.label(c, 'steam', fx + fw / 2 + 8, (fy + byc) / 2, { color: C.muted, size: 11 });
        /* barrel with iron, furnace */
        const frac = clamp(conv * KFE / FE0, 0, 1);
        const mix = (a, b, u) => 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * u) + ',' + Math.round(a[1] + (b[1] - a[1]) * u) + ',' + Math.round(a[2] + (b[2] - a[2]) * u) + ')';
        c.fillStyle = mix([150, 156, 165], [40, 42, 48], frac); c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); roundRectPath(c, bx0, byc - 12, bx1 - bx0, 24, 5); c.fill(); c.stroke();
        const fx0 = bx0 + (bx1 - bx0) * 0.25, fx1 = bx0 + (bx1 - bx0) * 0.75;
        c.fillStyle = glow(V.T); c.globalAlpha = 0.55; c.fillRect(fx0, byc - 30, fx1 - fx0, 60); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.strokeRect(fx0, byc - 30, fx1 - fx0, 60);
        c.fillStyle = mix([150, 156, 165], [40, 42, 48], frac); c.fillRect(fx0 + 1, byc - 11, fx1 - fx0 - 2, 22);
        kit.label(c, 'gun barrel with iron turnings', (bx0 + bx1) / 2, byc - 42, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, fm(V.T, 0) + ' °C', (fx0 + fx1) / 2, byc + 44, { color: C.text, size: 11.5, align: 'center', weight: 650 });
        /* delivery pipe, trough and jar */
        c.strokeStyle = C.muted; c.lineWidth = 3;
        const dpath = [[bx1, byc], [jx + jw * 0.9, byc], [jx + jw * 0.9, dishY + Hh * 0.055], [jx, dishY + Hh * 0.055], [jx, dishY - 4], [jx, jtop]];
        c.beginPath(); dpath.slice(0, 5).forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
        c.fillStyle = 'rgba(70,150,235,0.35)'; c.fillRect(jx - jw * 1.5, dishY, jw * 3, Hh * 0.10); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(jx - jw * 1.5, dishY, jw * 3, Hh * 0.10);
        const cap = 3000, gasFrac = clamp((hyd / MH2 / molPerMl) / cap, 0, 1);
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(jx - jw / 2, dishY + 4); c.lineTo(jx - jw / 2, jtop); c.lineTo(jx + jw / 2, jtop); c.lineTo(jx + jw / 2, dishY + 4); c.stroke();
        c.fillStyle = 'rgba(70,150,235,0.40)'; const wl = jtop + (dishY - jtop) * gasFrac; c.fillRect(jx - jw / 2 + 1, wl, jw - 2, dishY - wl);
        c.fillStyle = C.dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'; c.fillRect(jx - jw / 2 + 1, jtop + 1, jw - 2, wl - jtop);
        kit.label(c, 'inflammable air', jx, jtop - 12, { color: C.muted, size: 11, align: 'center' });
        if (gasFrac >= 1) kit.label(c, 'jar full', jx, jtop + 14, { color: C.warn, size: 11, align: 'center' });
        if (flash > 0) { c.save(); c.globalAlpha = flash; kit.dot(c, jx, (jtop + wl) / 2, jw * 0.7, 'rgba(255,200,90,0.9)'); c.restore(); }
        // bubbles along the delivery pipe, then up through the water
        if (rate > 0 && Math.random() < dt * clamp(rate * 600, 0, 40)) bubbles.push({ u: 0 });
        bubbles = bubbles.filter(b => (b.u += dt * 0.55) < 1);
        const seg = []; let tl = 0; for (let i = 0; i < dpath.length - 1; i++) { const l = Math.hypot(dpath[i + 1][0] - dpath[i][0], dpath[i + 1][1] - dpath[i][1]); seg.push(l); tl += l; }
        for (const b of bubbles) {
          let s = b.u * tl, i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; }
          const k = seg[i] > 0 ? s / seg[i] : 0, x = dpath[i][0] + (dpath[i + 1][0] - dpath[i][0]) * k, y = dpath[i][1] + (dpath[i + 1][1] - dpath[i][1]) * k;
          if (y < wl + 3) continue;
          kit.dot(c, x, y, 2.6, 'rgba(235,240,250,0.9)', C.muted);
        }
        /* the iron ledger as a bar */
        const ix = Wd * 0.22, iy = Hh * 0.90, iw = Wd * 0.50;
        const maxG = FE0 * KO / KFE, tot = FE0 + maxG;
        c.fillStyle = C.bg2 || 'rgba(128,128,128,0.15)'; c.fillRect(ix, iy - 8, iw, 16);
        c.fillStyle = mix([150, 156, 165], [90, 94, 102], frac); c.fillRect(ix, iy - 8, iw * (FE0 - conv * KFE) / tot, 16);
        c.fillStyle = '#2b2d33'; const oxw = iw * (conv * KFE + gain) / tot; c.fillRect(ix + iw * (FE0 - conv * KFE) / tot, iy - 8, oxw, 16);
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(ix, iy - 8, iw, 16);
        kit.label(c, 'iron', ix, iy - 20, { color: C.muted, size: 11 });
        kit.label(c, 'iron + the oxygen it took (Fe₃O₄)', ix + iw, iy - 20, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'iron turnings: ' + fm(FE0, 3) + ' g → ' + fm(FE0 + gain, 3) + ' g', ix + iw / 2, iy + 20, { color: C.text, size: 11.5, align: 'center', weight: 600 });
        /* ---- read-outs */
        ro.set('T', fm(V.T, 0) + ' °C — ' + (V.T < 450 ? 'too cool for the iron to react' : V.T < 525 ? 'iron hardly reacts, not yet glowing' : V.T < 700 ? 'dull red: the iron is reacting' : V.T < 850 ? 'cherry red: brisk' : 'bright red'));
        ro.set('steam', fm(passed, 1) + ' g');
        ro.set('conv', fm(conv, 3) + ' g (' + fm(passed > 0 ? 100 * conv / passed : 0, 0) + ' % of the steam)');
        const vol = (hyd + burnedH) / MH2 / molPerMl;
        ro.set('hyd', fm((hyd + burnedH) * 1000, 0) + ' mg, ' + fm(vol, 0) + ' mL at 20 °C' + (burnedH > 0 ? ' (' + fm(burnedH * 1000, 0) + ' mg burned)' : ''));
        ro.set('gain', fm(FE0, 3) + ' g → ' + fm(FE0 + gain, 3) + ' g (+' + fm(gain * 1000, 0) + ' mg, ' + fm(hyd + burnedH > 0 ? gain / (hyd + burnedH) : 0, 2) + ' × the hydrogen)');
        ro.set('ledger', fm(conv - (hyd + burnedH) - gain, 4) + ' g');
        ro.set('back', burnedH > 0 ? fm(regained, 3) + ' g — against ' + fm(burnedH / KH, 3) + ' g of water that gave that hydrogen' : '— (press the button)');
      }, box.stage);
      reset();
      loop.start();
    }
  });

  /* ================================================================ two volumes to one */
  Hyper.sim('dw-two-to-one', {
    title: 'Two volumes to one: counting the atoms',
    blurb: `Gay-Lussac and Humboldt measured it in 1805: hydrogen and oxygen combine in the volumes 2 : 1, and two volumes of steam come out. Each jar here holds the same number of particles for the same volume (that is Avogadro's hypothesis). Choose a picture of what the particles are, and see what volume of steam that picture predicts, next to what is measured.

**Try this**
- Start with Dalton's picture (single atoms, water = HO). It predicts one volume of steam for the 20 mL of hydrogen and 20 mL of oxygen that it would use — not the two to one that is measured. And its oxygen weighs 7.9 hydrogens.
- Switch to *atoms with H₂O*: now two volumes of hydrogen and one of oxygen do combine — but only one volume of steam comes out, where two are measured.
- Switch to Avogadro's picture (two-atom molecules H₂ and O₂): hydrogen, oxygen and steam come out 2 : 1 : 2 with no half-atoms, and oxygen is 15.9 times the hydrogen atom.
- Change the amounts: the extra gas is left over, whatever the picture.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'vh', label: 'Hydrogen', min: 0, max: 40, step: 4, value: params.vh != null ? params.vh : 40, unit: 'mL' },
        { id: 'vo', label: 'Oxygen', min: 0, max: 40, step: 2, value: params.vo != null ? params.vo : 20, unit: 'mL' },
        { id: 'model', type: 'select', label: 'Picture of the particles', options: [['Dalton 1808: atoms H and O; water is HO', 'm1'], ['Atoms H and O; water is H₂O', 'm2'], ['Avogadro 1811: molecules H₂ and O₂; water is H₂O', 'm3']], value: params.model || 'm3' }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Particles in 1 mL of gas (20 °C, 1 atm)'], ['pred', 'Steam this picture predicts'], ['meas', 'Steam measured'], ['verdict', 'Verdict'], ['ow', 'Weight of one oxygen atom this picture implies (H = 1)'], ['water', 'Liquid water once cooled']]);
      const molPerMl = 101325 * 1e-6 / (W.R * 293.15);
      const ratioOH = MO / (2 * 1.008);                                       // oxygen : hydrogen by mass in water, 7.94
      const seeds = [];
      const r0 = rng(11);
      for (let i = 0; i < 80; i++) seeds.push([r0() * TAU, r0() * TAU, r0()]);

      function outcome(model) {
        const nH = Math.round(V.vh / 2), nO = Math.round(V.vo / 2);        // one particle per 2 mL
        let prod, hl, ol;
        if (model === 'm1') { prod = Math.min(nH, nO); hl = nH - prod; ol = nO - prod; }
        else if (model === 'm2') { prod = Math.min(Math.floor(nH / 2), nO); hl = nH - 2 * prod; ol = nO - prod; }
        else { prod = Math.min(nH, 2 * nO); hl = nH - prod; ol = nO - Math.ceil(prod / 2); }
        return { nH, nO, prod, hl, ol };
      }
      /* one particle of a given kind at (x, y) in a cell of side s */
      function particle(c, kind, x, y, s, sd, t) {
        const mc = S.molColor(), j = 0.07 * s, ox = j * Math.sin(t * 2 + sd[0]), oy = j * Math.cos(t * 2.3 + sd[1]);
        x += ox; y += oy;
        const rH = 0.17 * s, rO = 0.24 * s, a = sd[0];
        if (kind === 'H') kit.dot(c, x, y, rH, mc.H, mc.Hstroke);
        else if (kind === 'O') kit.dot(c, x, y, rO, mc.O);
        else if (kind === 'H2') { const d = 0.2 * s; kit.dot(c, x - d * Math.cos(a), y - d * Math.sin(a), rH, mc.H, mc.Hstroke); kit.dot(c, x + d * Math.cos(a), y + d * Math.sin(a), rH, mc.H, mc.Hstroke); }
        else if (kind === 'O2') { const d = 0.22 * s; kit.dot(c, x - d * Math.cos(a), y - d * Math.sin(a), rO, mc.O); kit.dot(c, x + d * Math.cos(a), y + d * Math.sin(a), rO, mc.O); }
        else if (kind === 'HO') { const d = 0.24 * s; kit.dot(c, x - d * Math.cos(a), y - d * Math.sin(a), rO, mc.O); kit.dot(c, x + d * Math.cos(a), y + d * Math.sin(a), rH, mc.H, mc.Hstroke); }
        else S.molecule(c, x, y - 0.1 * s, { angle: a, scale: 0.55 * s });
      }
      /* a jar holding a list of [kind, count] */
      function jar(c, C, x0, base, cols, s, items, title, sub, t) {
        const list = []; for (const [k, n] of items) for (let i = 0; i < n; i++) list.push(k);
        const rows = Math.max(1, Math.ceil(list.length / cols));
        const w = cols * s, h = rows * s;
        c.save();
        c.fillStyle = list.length ? (C.dark ? 'rgba(120,170,230,0.10)' : 'rgba(120,170,230,0.12)') : 'transparent';
        c.fillRect(x0, base - h, w, h);
        c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(x0, base - rows * s - 4); c.lineTo(x0, base); c.lineTo(x0 + w, base); c.lineTo(x0 + w, base - rows * s - 4); c.stroke();
        c.restore();
        list.forEach((k, i) => particle(c, k, x0 + ((i % cols) + 0.5) * s, base - (Math.floor(i / cols) + 0.5) * s, s, seeds[i % seeds.length], t));
        kit.label(c, title, x0 + w / 2, base - 8 * s - 6, { color: C.text, size: 11.5, align: 'center', weight: 650 });
        (Array.isArray(sub) ? sub : [sub]).forEach((line, i) => kit.label(c, line, x0 + w / 2, base + 14 + 13 * i, { color: C.muted, size: 11, align: 'center' }));
      }
      let tt = 0;
      const loop = kit.loop((dt) => {
        tt += dt;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const cols = 4, s = clamp((Wd - 24) / 22, 9, 24), gap = 1.4 * s, base = Hh * 0.74;
        const m = V.model, o = outcome(m), meas = outcome('m3');
        const atoms = m !== 'm3', kH = atoms ? 'H' : 'H2', kO = atoms ? 'O' : 'O2', kP = m === 'm1' ? 'HO' : 'H2O';
        const x1 = 12, x2 = x1 + cols * s + gap, x3 = x2 + cols * s + 1.7 * gap, x4 = x3 + cols * s + gap;
        jar(c, C, x1, base, cols, s, [[kH, o.nH]], 'hydrogen', [fm(V.vh, 0) + ' mL'], tt);
        jar(c, C, x2, base, cols, s, [[kO, o.nO]], 'oxygen', [fm(V.vo, 0) + ' mL'], tt);
        kit.label(c, '+', x1 + cols * s + gap / 2, base - 2 * s, { color: C.muted, size: 18, align: 'center' });
        kit.arrow(c, x2 + cols * s + 0.2 * gap, base - 2 * s, x3 - 0.2 * gap, base - 2 * s, C.warn, 2);
        kit.label(c, 'spark', x2 + cols * s + gap, base - 2 * s - 12, { color: C.warn, size: 11, align: 'center' });
        jar(c, C, x3, base, cols, s, [[kP, o.prod], [kH, o.hl], [kO, o.ol]], 'predicted', [fm(o.prod * 2, 0) + ' mL steam'].concat(o.hl + o.ol ? [fm((o.hl + o.ol) * 2, 0) + ' mL left over'] : []), tt);
        jar(c, C, x4, base, cols, s, [['H2O', meas.prod], ['H2', meas.hl], ['O2', meas.ol]], 'measured', [fm(meas.prod * 2, 0) + ' mL steam'].concat(meas.hl + meas.ol ? [fm((meas.hl + meas.ol) * 2, 0) + ' mL left over'] : []), tt);
        kit.label(c, 'one particle = 2 mL; equal volumes, equal numbers of particles', 12, Hh - 14, { color: C.faint, size: 11 });
        ro.set('n', (101325 * 1e-6 / (1.380649e-23 * 293.15)).toExponential(2) + ' (the same for every gas)');
        ro.set('pred', fm(o.prod * 2, 0) + ' mL');
        ro.set('meas', fm(meas.prod * 2, 0) + ' mL  (hydrogen : oxygen : steam = 2 : 1 : 2)');
        const same = o.prod === meas.prod && o.hl === meas.hl && o.ol === meas.ol;
        ro.set('verdict', V.vh === 0 || V.vo === 0 ? 'nothing to react' : same ? 'agrees with the measurement' : (o.prod !== meas.prod ? 'does not agree: it predicts ' + fm(o.prod * 2, 0) + ' mL of steam where ' + fm(meas.prod * 2, 0) + ' mL is measured' : 'does not agree: the gas left over differs from what is found'));
        ro.set('ow', m === 'm1' ? fm(ratioOH, 2) + '  (Dalton wrote 7)' : fm(2 * ratioOH, 2) + '  (modern: 15.9)');
        ro.set('water', fm(meas.prod * 2 * molPerMl * MH2O * 1000, 1) + ' mg');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the timeline */
  const EV = [
    { y: -585, t: 'Thales', h: 'Thales: water is the source of all things', x: 'Thales of Miletus (active about 585 BC) is reported by Aristotle to have held that everything comes from water and that the Earth floats on it. Nothing he wrote survives; we know him only through later writers. It is a first attempt to explain the variety of things by one material.' },
    { y: -450, t: 'Empedocles', h: 'Empedocles: four roots', x: 'Empedocles of Acragas (about 450 BC) taught that fire, air, water and earth are the four unchanging roots of everything, mixed by Love and parted by Strife. Water is now one of several elements rather than the only one.' },
    { y: -360, t: 'Plato', h: 'Plato gives water a shape', x: 'In the Timaeus (about 360 BC) Plato pairs the four elements with four regular solids. Water is the icosahedron, with twenty triangular faces, the roundest and most mobile of them: a geometric guess about why water flows.' },
    { y: -350, t: 'Aristotle', h: 'Aristotle: elements change into one another', x: 'Aristotle (about 350 BC) defines each element by two of four qualities, hot, cold, wet and dry; water is cold and wet. Elements that share a quality can pass into each other, water into air as it boils. For two thousand years this is the textbook account.' },
    { y: 1648, t: 'Van Helmont', h: 'Van Helmont\'s willow', x: 'Jan Baptist van Helmont, in a book printed in 1648 after his death, tells of a willow of 5 pounds grown for five years in 200 pounds of dried earth and given only rain water. The tree weighed about 169 pounds and the earth had lost about 2 ounces. His conclusion: the tree is made of water. He had overlooked the air, but a fresh tree is, in fact, about half water.' },
    { y: 1661, t: 'Boyle', h: 'Boyle doubts the elements', x: 'In The Sceptical Chymist (1661) Robert Boyle argues that an element is whatever experiment cannot break down, not whatever a philosopher declares one to be. Water passes the test of his day: nobody can decompose it.' },
    { y: 1766, t: 'Cavendish', h: 'Cavendish isolates inflammable air', x: 'Henry Cavendish shows that metals dissolved in acids give off a distinct gas, which he finds to be roughly a tenth of the density of air, and burns. He calls it inflammable air. We call it hydrogen.' },
    { y: 1774, t: 'Priestley', h: 'Oxygen is found', x: 'Joseph Priestley, heating red calx of mercury with a burning-glass on 1 August 1774, gets a gas in which a candle burns brilliantly: dephlogisticated air. Carl Wilhelm Scheele had made it earlier but printed his account later, in 1777. Lavoisier would name it oxygen.' },
    { y: 1781, t: 'The dew', h: 'The dew in the sparked jar', x: 'John Warltire sparks a mixture of inflammable air and common air in a closed vessel and reports a loss of weight. Priestley repeats it and notices a dew on the clean glass. Cavendish takes up the experiment in London, weighs with care, and finds that the dew is water and that nothing measurable is lost.' },
    { y: 1783, t: 'Lavoisier', h: 'Lavoisier and Laplace make water', x: 'In June 1783, a few days after Charles Blagden brings news of Cavendish\'s result to Paris, Lavoisier and Laplace burn hydrogen in oxygen and weigh the water. Lavoisier concludes that water is a compound. In April James Watt had written to Priestley with a similar idea.' },
    { y: 1784, t: 'Gun barrel', h: 'Cavendish publishes; the gun barrel', x: 'Cavendish\'s Experiments on Air is read to the Royal Society in January and printed in 1784. Lavoisier and Meusnier decompose water by passing steam over red-hot iron and collecting hydrogen. Watt\'s own paper is read in April: the water controversy begins.' },
    { y: 1787, t: 'Nomenclature', h: 'Hydrogen is named', x: 'The Méthode de nomenclature chimique (1787), by Guyton de Morveau, Lavoisier, Berthollet and Fourcroy, names the gas hydrogène, "water-former", and oxygène. Phlogiston leaves the vocabulary.' },
    { y: 1800, t: 'Electrolysis', h: 'Water is split by electricity', x: 'William Nicholson and Anthony Carlisle pass the current of a Volta pile through water in London on 2 May 1800 and see gas rise from each wire: hydrogen at one, oxygen at the other.' },
    { y: 1805, t: 'Gay-Lussac', h: 'Two volumes to one', x: 'Joseph Louis Gay-Lussac and Alexander von Humboldt show in Paris that 100 volumes of oxygen take very nearly 200 of hydrogen to make water. In 1808 Gay-Lussac states the general law: gases combine in simple whole-number ratios by volume.' },
    { y: 1808, t: 'Dalton', h: 'Dalton\'s atoms, and HO', x: 'John Dalton\'s New System of Chemical Philosophy (1808) gives each element its own atom and weight. With his rule that two elements forming one compound combine one atom to one, water is HO and, from its mass ratio, oxygen weighs about 7 times hydrogen. He doubts Gay-Lussac\'s volumes.' },
    { y: 1811, t: 'Avogadro', h: 'Avogadro\'s hypothesis', x: 'Amedeo Avogadro proposes that equal volumes of all gases, at the same temperature and pressure, hold the same number of molecules, and that the molecules of hydrogen and of oxygen have two atoms each. Then two volumes of hydrogen and one of oxygen make two of steam, and water is H₂O. Few chemists accept it for almost fifty years.' },
    { y: 1860, t: 'Karlsruhe', h: 'Karlsruhe settles the formula', x: 'At the first international congress of chemists, in Karlsruhe in September 1860, Stanislao Cannizzaro makes Avogadro\'s hypothesis the key to one consistent table of atomic weights. Within a few years textbooks write water as H₂O, with oxygen at 16.' },
    { y: 1913, t: 'Henderson', h: 'The fitness of the environment', x: 'Lawrence J. Henderson, a Harvard physiologist, publishes The Fitness of the Environment, a catalogue of the ways in which water\'s properties suit it to life.' },
    { y: 1962, t: 'Anomalous water', h: 'Anomalous water in quartz capillaries', x: 'Nikolai Fedyakin, in Kostroma, reports a liquid condensed in very fine quartz capillaries that is denser and far more viscous than water and does not freeze at 0 °C. Boris Deryagin takes up the work in Moscow.' },
    { y: 1966, t: 'Nottingham', h: 'The West takes notice', x: 'Deryagin presents the work at a meeting of the Faraday Society in Nottingham in 1966. Laboratories in Britain and the United States begin to make the material.' },
    { y: 1969, t: 'Polywater', h: 'The name polywater', x: 'Ellis Lippincott and colleagues at the University of Maryland publish infrared and Raman spectra that they read as a polymeric form of water, and the press calls it polywater. Newspapers raise the fear that it might convert ordinary water, the ice-nine of Vonnegut\'s novel.' },
    { y: 1971, t: 'Sweat', h: 'Polywater is impure water', x: 'Denis Rousseau of Bell Laboratories shows that polywater\'s infrared spectrum matches that of human sweat, and that the samples contain what dissolves from glass and from fingers. Samples made with more care lose their anomalous properties.' },
    { y: 1973, t: 'Closed', h: 'The case is closed', x: 'By 1973 the consensus is that polywater never existed. The group that had begun the work has come to accept the explanation of contamination. Some hundreds of papers had been written.' },
    { y: 1988, t: 'Benveniste', h: 'The memory of water', x: 'Jacques Benveniste and colleagues publish in Nature (30 June 1988) that white blood cells respond to an antibody diluted until no molecule of it can be left. Nature\'s editor John Maddox, the conjuror James Randi and the fraud investigator Walter Stewart visit the laboratory in July. The effect does not survive blinding.' }
  ];
  const yearStr = y => y < 0 ? Math.abs(Math.round(y)) + ' BC' : String(Math.round(y));
  const VIEW = {
    water: y => y < -585 ? 'nothing yet written down' : y < -450 ? 'the source of all things (Thales)' : y < 1783 ? 'one of four elements: fire, air, water, earth' : y < 1860 ? 'a compound of hydrogen and oxygen (proportions argued over)' : 'a compound, H₂O: two hydrogen to one oxygen',
    formula: y => y < 1783 ? 'none: an element has no formula' : y < 1805 ? 'none yet; Lavoisier\'s weights: about 85 parts oxygen to 15 of hydrogen' : y < 1860 ? 'HO (oxygen = 8) in many books, H₂O in others' : 'H₂O (oxygen = 16)',
    hydro: y => y < 1766 ? 'not known as a substance' : y < 1787 ? 'inflammable air' : 'hydrogen, the water-former',
    oxy: y => y < 1774 ? 'not known' : y < 1787 ? 'dephlogisticated air' : 'oxygen, the acid-former',
    poly: y => y < 1962 ? 'unheard of' : y < 1966 ? 'anomalous water, in a few Soviet laboratories' : y < 1969 ? 'spreading to laboratories in the West' : y < 1970 ? 'polywater: a sensation' : y < 1973 ? 'under attack: its spectra match impurities' : 'finished: it was contaminated water',
    mem: y => y < 1988 ? 'not yet claimed' : 'claimed (Nature, 30 June 1988); gone when the test is blinded'
  };

  Hyper.sim('dw-timeline', {
    title: 'The discovery of water, year by year',
    blurb: `Drag the year along the line. Each dot is an event; the box lists what was believed at that date about what water is, what it is made of, and what its two ingredients were called. The line is spaced by event, not by year, so the busy decades are legible.

**Try this**
- Start before 1766 and move on slowly: water is an element, hydrogen and oxygen do not exist as substances, and the formula is a meaningless question.
- Stop at 1783 and 1784: within eighteen months the answer changes from "element" to "compound", and a quarrel about who found it begins.
- Stop at 1808 and 1811, then at 1860: Dalton's *HO* and Avogadro's *H₂O* stand side by side for almost half a century.
- With *Previous* and *Next* step event by event; *Play* walks the whole line.`,
    mount(box, kit, params) {
      const from = params.from != null ? params.from : 1600, to = params.to != null ? params.to : 1913;
      const E = EV.filter(e => e.y >= from && e.y <= to);
      const recent = from >= 1900;
      const ctl = kit.controls(box.side, [
        { id: 'year', label: 'Year', min: from, max: to, step: 1, value: params.year != null ? params.year : from, fmt: yearStr },
        { type: 'buttons', items: [{ id: 'prev', label: 'Previous event' }, { id: 'next', label: 'Next event' }, { id: 'play', label: 'Play', primary: true }] },
        { id: 'card', type: 'html', html: '' }
      ], (id, v) => {
        if (id === 'prev' || id === 'next') {
          playing = false;
          const y = V.year; let tgt;
          if (id === 'next') tgt = (E.find(e => e.y > y) || E[E.length - 1] || { y: to }).y;
          else { const past = E.filter(e => e.y < y); tgt = past.length ? past[past.length - 1].y : from; }
          ctl.set('year', tgt, false);
        } else if (id === 'play') { playing = true; ctl.set('year', from, false); wait = 0; }
        else if (id === 'year') playing = false;
      });
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ro = recent ? kit.readout(box.side, [['poly', 'Polywater'], ['mem', 'Water memory']]) : kit.readout(box.side, [['water', 'Water is regarded as'], ['formula', 'Its formula'], ['hydro', 'Hydrogen is'], ['oxy', 'Oxygen is']]);
      let playing = false, wait = 0, shown = -1;
      const pts = [from].concat(E.map(e => e.y), [to]);                    // the line's stations: the two ends and the events
      function xOf(year, x0, w) {
        const n = pts.length - 1;
        if (n < 1) return x0;
        let i = 0; while (i < n - 1 && pts[i + 1] <= year) i++;
        const a = pts[i], b = pts[i + 1], u = b > a ? clamp((year - a) / (b - a), 0, 1) : (year >= b ? 1 : 0);
        return x0 + (i + u) / n * w;
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (playing) {
          wait -= dt;
          if (wait <= 0) {
            const nx = E.find(e => e.y > V.year);
            if (nx) { ctl.set('year', nx.y, false); wait = 2.6; } else playing = false;
          }
        }
        const y = V.year, x0 = 26, w = Wd - 52, ay = Hh * 0.60, n = pts.length - 1;
        // axis
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, ay); c.lineTo(x0 + w, ay); c.stroke();
        const cx = xOf(y, x0, w);
        c.strokeStyle = C.accent; c.lineWidth = 3.5; c.beginPath(); c.moveTo(x0, ay); c.lineTo(cx, ay); c.stroke();
        let last = -1; E.forEach((e, i) => { if (e.y <= y) last = i; });
        const spacing = w / Math.max(1, n);
        E.forEach((e, i) => {
          const x = x0 + (i + 1) / n * w, past = e.y <= y;
          c.save();
          c.fillStyle = past ? C.accent : C.surface || 'rgba(0,0,0,0)'; c.strokeStyle = past ? C.accent : C.faint; c.lineWidth = 1.6;
          c.beginPath(); c.arc(x, ay, i === last ? 8 : 5.5, 0, TAU); c.fill(); c.stroke();
          if (i === last) { c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(x, ay, 11, 0, TAU); c.stroke(); }
          c.translate(x + 3, ay - 16); c.rotate(-Math.PI / 3);
          c.font = (i === last ? 650 : 500) + ' 11.5px ' + getComputedStyle(document.body).fontFamily;
          c.fillStyle = past ? C.text : C.faint; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(e.t, 0, 0);
          c.restore();
          if (spacing > 34 || i % 2 === 0) kit.label(c, yearStr(e.y), x, ay + 22, { color: past ? C.muted : C.faint, size: 10.5, align: 'center' });
        });
        // the cursor
        c.fillStyle = C.warn; c.beginPath(); c.moveTo(cx, ay + 6); c.lineTo(cx - 6, ay + 16); c.lineTo(cx + 6, ay + 16); c.closePath(); c.fill();
        kit.label(c, yearStr(y), clamp(cx, 28, Wd - 28), ay + 44, { color: C.warn, size: 14, align: 'center', weight: 700 });
        kit.label(c, yearStr(from), x0, Hh - 14, { color: C.faint, size: 10.5 });
        kit.label(c, yearStr(to), x0 + w, Hh - 14, { color: C.faint, size: 10.5, align: 'right' });
        kit.label(c, 'spaced by event, not by year', Wd / 2, Hh - 14, { color: C.faint, size: 10.5, align: 'center' });
        // the card and the state of knowledge
        if (last !== shown) {
          shown = last;
          const e = E[last];
          ctl.set('card', e ? '<b>' + yearStr(e.y) + ' — ' + Hyper.util.esc(e.h) + '</b><br>' + Hyper.util.esc(e.x) : 'Before the first event on this line.');
        }
        for (const k of Object.keys(VIEW)) ro.set(k, VIEW[k](y));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a blinded test of water memory */
  Hyper.sim('dw-blind-trial', {
    title: 'A blinded test of "water memory"',
    blurb: `Suppose the water in coded vials is either plain or "treated", and in each trial an assessor says which. If there is nothing to detect, the assessor is guessing and gets half right. Each laboratory runs the same number of trials; the histogram shows how many laboratories got how many right. A laboratory reports a "significant effect" if its score would arise by chance less than one time in twenty.

**Try this**
- Leave the chance at 50 % and press *Run* again and again: about 1 laboratory in 20 still reports a significant effect from guessing alone. Publish only those and you have a literature.
- Pool all the laboratories: the total hovers around 50 % and the pooled p-value is unremarkable. Replication is what kills an accident.
- Untick *blinded*: the assessor knows which vial is which and leans towards the expected answer. Laboratories now "find" an effect with nothing to find. That is why the Nature investigators of 1988 recoded the vials.
- Give the effect a real size (say 65 %): then blinding does not hide it, and nearly every laboratory sees it. A real effect survives blinding.
- Move the dilution slider: beyond about 12 steps of 1 in 100 there is, on average, less than one molecule of the original substance left in the vial.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Trials in each laboratory', min: 10, max: 200, step: 2, value: params.n || 40 },
        { id: 'L', label: 'Laboratories', min: 1, max: 300, step: 1, value: params.L || 100 },
        { id: 'q', label: 'True chance of a correct call', min: 50, max: 80, step: 1, value: params.q || 50, unit: '%' },
        { id: 'blind', type: 'check', label: 'Blinded (the assessor does not know the vial)', value: params.blind !== false },
        { id: 'bias', label: 'Lean of an assessor who knows', min: 0, max: 30, step: 1, value: params.bias != null ? params.bias : 15, unit: '%' },
        { id: 'dil', label: 'Dilution steps of 1 in 100', min: 0, max: 60, step: 1, value: params.dil != null ? params.dil : 12 },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the experiment', primary: true }] }
      ], (id) => { if (id === 'dil') { dilution(); return; } if (id === 'blind') ctl.show('bias', !V.blind); run(); });
      const V = ctl.values;
      ctl.show('bias', !V.blind);
      const ro = kit.readout(box.side, [['need', 'Correct calls needed for p < 0.05'], ['lab1', 'First laboratory'], ['sig', 'Laboratories reporting an effect'], ['pool', 'All laboratories pooled'], ['dil', 'Original substance left, from one mole']]);
      /* log factorials for exact binomial tails */
      const lf = [0]; for (let i = 1; i <= 400; i++) lf[i] = lf[i - 1] + Math.log(i);
      const tail = (n, k) => { let s = 0; for (let j = k; j <= n; j++) s += Math.exp(lf[n] - lf[j] - lf[n - j] - n * Math.LN2); return Math.min(1, s); };
      const erf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
      const phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
      let hist = [], strip = [], kc = 0, sig = 0, tot = 0, hits1 = 0, n = 0, L = 0, pe = 0.5;
      function run() {
        n = Math.round(V.n); L = Math.round(V.L);
        const q = V.q / 100;
        pe = V.blind ? q : q + (V.bias / 100) * (1 - q);
        kc = n + 1; for (let k = 0; k <= n; k++) if (tail(n, k) <= 0.05) { kc = k; break; }
        hist = new Array(n + 1).fill(0); strip = []; sig = 0; tot = 0;
        for (let l = 0; l < L; l++) {
          let h = 0;
          for (let i = 0; i < n; i++) { const hit = Math.random() < pe; if (hit) h++; if (l === 0) strip.push(hit); }
          hist[h]++; tot += h; if (h >= kc) sig++;
          if (l === 0) hits1 = h;
        }
        const N = n * L, z = (tot - N / 2 - 0.5) / (Math.sqrt(N) / 2), pp = 1 - phi(z);
        ro.set('need', kc <= n ? kc + ' of ' + n + ' (' + fm(100 * kc / n, 0) + ' %); chance alone gets this ' + fm(100 * tail(n, kc), 1) + ' % of the time' : 'more than the trials allow');
        ro.set('lab1', hits1 + ' of ' + n + ' (' + fm(100 * hits1 / n, 0) + ' %), p = ' + (tail(n, hits1) < 0.001 ? '<0.001' : fm(tail(n, hits1), 3)));
        ro.set('sig', sig + ' of ' + L + ' (' + fm(100 * sig / L, 0) + ' %)');
        ro.set('pool', tot + ' of ' + N + ' (' + fm(100 * tot / N, 1) + ' %), p = ' + (pp < 0.001 ? '<0.001' : fm(pp, 3)));
        dilution();
      }
      function dilution() {
        const N0 = 6.02214076e23 * Math.pow(10, -2 * V.dil);
        ro.set('dil', N0 >= 10 ? N0.toExponential(1) + ' molecules' : N0 >= 0.01 ? fm(N0, 2) + ' molecules on average; the chance that even one remains is ' + fm(100 * (1 - Math.exp(-N0)), 0) + ' %' : N0.toExponential(1) + ' molecules: almost certainly none at all');
      }
      run();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        /* the first laboratory's calls */
        const topH = Hh * 0.22, tz = clamp(Math.sqrt((Wd - 24) * topH / Math.max(1, n)), 4, 15), cols = Math.max(1, Math.floor((Wd - 24) / tz));
        kit.label(c, 'one laboratory, trial by trial: ' + hits1 + ' correct (green), ' + (n - hits1) + ' wrong (grey)', 12, 12, { color: C.muted, size: 11.5 });
        strip.forEach((hit, i) => { c.fillStyle = hit ? C.ok : (C.dark ? 'rgba(160,160,170,0.35)' : 'rgba(120,120,130,0.30)'); c.fillRect(12 + (i % cols) * tz, 24 + Math.floor(i / cols) * tz, tz - 1.5, tz - 1.5); });
        /* the histogram of all laboratories */
        const hx0 = 40, hx1 = Wd - 14, hy0 = Hh * 0.37, hy1 = Hh - 40;
        const sd = Math.sqrt(n) / 2, centre = n * pe;
        const lo = Math.max(0, Math.floor(Math.min(n / 2, centre) - 4.2 * sd)), hi = Math.min(n, Math.ceil(Math.max(n / 2, centre) + 4.2 * sd));
        const span = Math.max(1, hi - lo + 1), bw = (hx1 - hx0) / span;
        let ymax = 1; for (let k = lo; k <= hi; k++) ymax = Math.max(ymax, hist[k] || 0);
        const step = Hyper.niceStep ? Hyper.niceStep(ymax, 4) : Math.max(1, Math.ceil(ymax / 4));
        const top = Math.ceil(ymax / step) * step;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let v = 0; v <= top; v += step) { const y = hy1 - (v / top) * (hy1 - hy0); c.beginPath(); c.moveTo(hx0, y); c.lineTo(hx1, y); c.stroke(); kit.label(c, String(v), hx0 - 5, y, { color: C.muted, size: 10.5, align: 'right' }); }
        for (let k = lo; k <= hi; k++) {
          const v = hist[k] || 0, h = (v / top) * (hy1 - hy0), x = hx0 + (k - lo) * bw;
          c.fillStyle = k >= kc ? C.warn : C.accent; c.fillRect(x + 0.5, hy1 - h, Math.max(1, bw - 1), h);
        }
        c.strokeStyle = C.axis || C.muted; c.beginPath(); c.moveTo(hx0, hy1); c.lineTo(hx1, hy1); c.stroke();
        const tickStep = Hyper.niceStep ? Hyper.niceStep(span, 8) : Math.max(1, Math.ceil(span / 8));
        for (let k = Math.ceil(lo / tickStep) * tickStep; k <= hi; k += tickStep) kit.label(c, String(k), hx0 + (k - lo + 0.5) * bw, hy1 + 11, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, 'correct calls in one laboratory (out of ' + n + ')', (hx0 + hx1) / 2, Hh - 12, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'laboratories', 12, hy0 - 10, { color: C.muted, size: 11 });
        // chance line and the significance line
        if (n / 2 >= lo && n / 2 <= hi) {
          const x = hx0 + (n / 2 - lo + 0.5) * bw; c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.text; c.beginPath(); c.moveTo(x, hy0 - 4); c.lineTo(x, hy1); c.stroke(); c.restore();
          kit.label(c, 'pure guessing', x, hy0 - 12, { color: C.text, size: 11, align: 'center' });
        }
        if (kc >= lo && kc <= hi) {
          const x = hx0 + (kc - lo) * bw; c.save(); c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x, hy0 + 6); c.lineTo(x, hy1); c.stroke(); c.restore();
          kit.label(c, '"significant" from here →', x - 4, hy0 + 2, { color: C.warn, size: 11, align: 'right', weight: 600 });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the fitness dashboard */
  Hyper.sim('dw-fitness', {
    title: 'Henderson\'s fitness dashboard',
    blurb: `Where does water stand among ten liquids on the five properties Henderson stressed in 1913? Pick a property and the bars rank the liquids; the read-outs give water's rank on all five. Water is highest on the list in all five among the ordinary liquids — but not without exceptions, and the exceptions are instructive.

**Try this**
- With *all ten* liquids, water is first on only two of the five. Liquid ammonia (at −33 °C, a liquid only when cold) stores a little more heat per kilogram, and mercury, a metal, has the higher surface tension and conductivity. Both are ruled out of ordinary life.
- Switch to *ordinary liquids*: water is first on all five, and often by a wide margin. Turn on the log scale to see the factor.
- Look at the latent heat of vaporisation: water's 2,257 kJ/kg is more than twice that of the next ordinary liquid, glycerol (974). That one number is why sweating cools you and why a kettle takes so long to boil dry.
- Then ask Henderson's question: if you had to design a liquid for life, how many of these five would you want at the top?`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const PROPS = [
        { id: 'cp', name: 'Specific heat', unit: 'J/(kg·K)', dig: 0, role: 'It stores and carries heat: oceans, blood, hot-water heating.' },
        { id: 'Lv', name: 'Latent heat of vaporisation', unit: 'kJ/kg', dig: 0, role: 'It cools by evaporation: sweat, leaves, the water cycle.' },
        { id: 'sigma', name: 'Surface tension', unit: 'mN/m', dig: 1, role: 'It lifts water in soil, in capillaries and in trees.' },
        { id: 'eps', name: 'Dielectric constant', unit: '', dig: 1, role: 'It pulls salts and charged molecules apart: the solvent of cells.' },
        { id: 'k', name: 'Thermal conductivity', unit: 'W/(m·K)', dig: 2, role: 'It evens out temperature across a cell or a lake.' }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'prop', type: 'select', label: 'Property', options: PROPS.map(p => [p.name, p.id]), value: params.prop || 'Lv' },
        { id: 'peers', type: 'select', label: 'Compared with', options: [['All ten liquids', 'all'], ['Without liquid ammonia (liquid only below −33 °C)', 'noNH3'], ['Ordinary liquids (no mercury, no ammonia)', 'ordinary']], value: params.peers || 'all' },
        { id: 'log', type: 'check', label: 'Logarithmic scale', value: !!params.log }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, PROPS.map(p => [p.id, p.name]).concat([['first', 'Properties where water is first']]));
      const pool = () => W.LIQUIDS.filter(l => V.peers === 'all' || (V.peers === 'noNH3' && l.id !== 'ammonia') || (V.peers === 'ordinary' && l.id !== 'ammonia' && l.id !== 'mercury'));
      const short = l => l.name.replace(/ \(.*/, '');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const P = PROPS.find(p => p.id === V.prop), list = pool().filter(l => Number.isFinite(l[P.id])).sort((a, b) => b[P.id] - a[P.id]);
        const x0 = Math.min(150, Wd * 0.3), x1 = Wd - 70, y0 = 44, rh = Math.min(30, (Hh - y0 - 44) / Math.max(1, list.length));
        kit.label(c, P.name + (P.unit ? ' (' + P.unit + ')' : '') + ', around 20–25 °C', 12, 16, { color: C.text, size: 13, weight: 650 });
        kit.label(c, P.role, 12, 33, { color: C.muted, size: 11.5 });
        const vals = list.map(l => l[P.id]), vmax = Math.max.apply(null, vals), vmin = Math.min.apply(null, vals);
        const scale = v => V.log ? clamp((Math.log(v) - Math.log(vmin * 0.6)) / (Math.log(vmax) - Math.log(vmin * 0.6)), 0.02, 1) : clamp(v / vmax, 0.005, 1);
        list.forEach((l, i) => {
          const y = y0 + i * rh, isW = l.id === 'water', w = (x1 - x0) * scale(l[P.id]);
          c.fillStyle = isW ? C.accent : (C.dark ? 'rgba(170,175,190,0.45)' : 'rgba(110,115,130,0.40)');
          c.beginPath(); roundRectPath(c, x0, y + 3, Math.max(2, w), rh - 7, 3); c.fill();
          kit.label(c, short(l), x0 - 8, y + rh / 2, { color: isW ? C.accent : C.text, size: 12, align: 'right', weight: isW ? 700 : 500 });
          kit.label(c, fm(l[P.id], P.dig), x0 + Math.max(2, w) + 6, y + rh / 2, { color: isW ? C.accent : C.muted, size: 11.5, weight: isW ? 700 : 500 });
        });
        const w = list.find(l => l.id === 'water'), others = list.filter(l => l.id !== 'water').map(l => l[P.id]).sort((a, b) => a - b);
        const med = others.length ? (others.length % 2 ? others[(others.length - 1) / 2] : (others[others.length / 2 - 1] + others[others.length / 2]) / 2) : NaN;
        if (w) kit.label(c, 'water is ' + fm(w[P.id] / med, 1) + ' × the median of the others' + (V.log ? ' (log scale)' : ''), 12, Hh - 14, { color: C.muted, size: 11.5 });
        let first = 0;
        for (const p of PROPS) {
          const lst = pool().filter(l => Number.isFinite(l[p.id])).sort((a, b) => b[p.id] - a[p.id]);
          const rank = lst.findIndex(l => l.id === 'water') + 1;
          if (rank === 1) first++;
          const next = lst[rank === 1 ? 1 : 0];
          ro.set(p.id, rank + ' of ' + lst.length + (rank === 1 && next ? ' — ' + fm(lst[0][p.id] / next[p.id], 1) + ' × the runner-up (' + short(next) + ')' : next ? ' — behind ' + short(next) : ''));
        }
        ro.set('first', first + ' of 5');
      }, box.stage);
      loop.start();
    }
  });
})();
