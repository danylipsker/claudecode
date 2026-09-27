/* HYPER-PNEUMATICS · sims/treatment.js — simulations for the Air Treatment branch (prefix treat-).
 *   treat-chain       compressor → aftercooler → separator → receiver → dryer → filter → network:
 *                     temperature, pressure dew point and water removed at each stage (kit.fluid.magnus / dewPoint)
 *   treat-dryers      refrigerated, heatless, heated-purge, blower-purge and membrane dryers compared:
 *                     dew point, electricity, purge air and pressure drop per year; a twin-tower heatless dryer at work
 *   treat-iso-class   ISO 8573-1:2010 class picker: measurements or an application → [A:B:C] and the treatment
 *   treat-regulator   a direct-acting diaphragm regulator: force balance, droop, supply effect, relieving vent,
 *                     ISO 6358 flow through the seat, the downstream volume filled and emptied; the flow characteristic
 *   treat-filter      a coalescing filter's pressure drop rising with time and the energy cost of changing it late
 *   treat-drains      a timed drain against a level-sensing drain: condensate, flooding and the compressed air blown away
 */
(function () {
  'use strict';
  const PATM = 101325, RV = 461.5, PANR = 1e5, RHO_ANR = 1.185;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // dew point (°C) of a water-vapour partial pressure e (Pa), by kit.fluid's Magnus formula
  const dewOf = (F, e) => F.dewPoint(20, Math.max(e, 1e-9) / F.magnus(20));
  // ISO 8573-1:2010 water class from a pressure dew point (°C)
  const waterClass = pdp => pdp <= -70 ? '1' : pdp <= -40 ? '2' : pdp <= -20 ? '3' : pdp <= 3 ? '4' : pdp <= 7 ? '5' : pdp <= 10 ? '6' : '7–X (liquid)';
  // draw on a design grid of w × h scaled to fit the stage, centred
  function design(c, st, w, h) { const k = Math.min(st.W / w, st.H / h); c.save(); c.translate((st.W - w * k) / 2, (st.H - h * k) / 2); c.scale(k, k); return k; }
  const f1 = v => (Math.abs(v) < 9.95 ? v.toFixed(1) : v.toFixed(0));
  const f2 = v => (Math.abs(v) < 0.995 ? v.toFixed(2) : Math.abs(v) < 9.95 ? v.toFixed(1) : v.toFixed(0));
  const waterCol = kit => kit.colors().dark ? '#5ab4ff' : '#1a73c9';
  function diamond(c, x, y, r, color, fill) {
    c.beginPath(); c.moveTo(x - r, y); c.lineTo(x, y - r); c.lineTo(x + r, y); c.lineTo(x, y + r); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    c.strokeStyle = color; c.lineWidth = 1.8; c.setLineDash([]); c.stroke();
  }
  function drops(c, x, y0, y1, phase, rate, color) {
    // falling drops, spaced by 1/rate
    if (!(rate > 0)) return;
    c.fillStyle = color;
    const gap = 16, span = y1 - y0;
    for (let s = ((phase % gap) + gap) % gap; s < span; s += gap) {
      c.beginPath(); c.moveTo(x, y0 + s - 3.5); c.quadraticCurveTo(x + 3, y0 + s + 1, x, y0 + s + 2.5); c.quadraticCurveTo(x - 3, y0 + s + 1, x, y0 + s - 3.5); c.fill();
    }
  }

  /* ================================================================ the treatment chain */
  Hyper.sim('treat-chain', {
    title: 'Where the water goes: a compressed-air treatment chain',
    blurb: `Air is drawn in with the humidity you set, compressed, cooled in the aftercooler (whose separator catches 95 % of the droplets), cooled further in the receiver, dried and filtered, and finally meets the coldest pipe of the network. Above each stage: its temperature and the pressure dew point (PDP) of the air there; below, the condensate its drain collects in litres a day. The bars show the water still carried, in grams per cubic metre of free air, and the graph the temperature and dew point along the chain. Water contents come from the Magnus formula of \`kit.fluid\`; free air is counted at intake conditions.

**Try this**
- Start with no dryer: the air leaves the receiver saturated, and wherever a pipe is colder the water condenses in the network. Now choose the refrigerated dryer.
- Move the coldest pipe below +3 °C (an outdoor line in winter): the refrigerated dryer is no longer enough. Switch to a −40 °C desiccant dryer — and note the purge air it costs.
- Raise the intake to 35 °C and 80 %: the aftercooler condenses more than 200 litres a day at 10 m³/min.
- Let the aftercooler run 20 K above the cooling air (a dusty cooler): more water reaches the receiver and the dryer.
- Compare the oil-injected screw (air out at about 85 °C) with an oil-free compressor (about 170 °C): the aftercooler's heat load more than doubles, the water does not change.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const gdiv = document.createElement('div');
      gdiv.style.cssText = 'padding:4px 10px 10px';
      box.stage.appendChild(gdiv);
      const NAMES = ['intake', 'compressor', 'aftercooler', 'receiver', 'dryer', 'filter', 'network'];
      let dirty = true, res = null;
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Intake air temperature', min: -10, max: 45, step: 1, value: 25, unit: '°C' },
        { id: 'RH', label: 'Intake relative humidity', min: 10, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'p', label: 'Line pressure (gauge)', min: 3, max: 13, step: 0.5, value: 7, unit: 'bar' },
        { id: 'Q', label: 'Free air delivery', min: 0.5, max: 60, value: 10, unit: 'm³/min', log: true, sig: 2 },
        { id: 'comp', type: 'select', label: 'Compressor', options: [['Oil-injected screw — air out at about 85 °C', 85], ['Oil-free screw, two stages — about 170 °C', 170], ['Piston, one stage — about 190 °C', 190]], value: 85 },
        { id: 'Tc', label: 'Cooling air or water temperature', min: 0, max: 45, step: 1, value: 25, unit: '°C' },
        { id: 'app', label: 'Aftercooler approach (above the cooling medium)', min: 3, max: 25, step: 1, value: 10, unit: 'K' },
        { id: 'dryer', type: 'select', label: 'Dryer', options: [['None', 'none'], ['Refrigerated, PDP +3 °C', 'ref'], ['Membrane, 30 K below its inlet', 'mem'], ['Desiccant, PDP −40 °C', 'd40'], ['Desiccant, molecular sieve, −70 °C', 'd70']], value: 'ref' },
        { id: 'Tp', label: 'Coldest pipe in the network', min: -25, max: 30, step: 1, value: 15, unit: '°C' },
        { id: 'h', label: 'Running hours per day', min: 1, max: 24, step: 1, value: 16, unit: 'h' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['in', 'Water drawn in'], ['ac', 'Aftercooler + separator'], ['rec', 'Receiver drain'], ['dry', 'Dryer'], ['net', 'Condenses in the network'], ['pdp', 'PDP delivered / ISO 8573-1 water class'], ['heat', 'Aftercooler heat load'], ['purge', 'Purge air lost']]);
      const plot = kit.plot(gdiv, { x: { label: 'stage', min: 0, max: 6, fmt: v => (Math.abs(v - Math.round(v)) < 1e-6 && NAMES[Math.round(v)]) || '' }, y: { label: 'temperature (°C)' }, legend: true }, 150);
      const V = ctl.values;

      function calc() {
        const pabs = V.p * 1e5 + PATM, TinK = V.T + 273.15;
        const wOf = e => e * PATM / (pabs * RV * TinK) * 1000;          // g per m³ of free air ↔ vapour pressure at line pressure
        const e0 = V.RH / 100 * F.magnus(V.T), w0 = e0 / (RV * TinK) * 1000;
        const St = [];
        St.push({ T: V.T, pdp: F.dewPoint(V.T, V.RH / 100), w: w0, removed: 0 });
        // compressor outlet: all vapour (unless the discharge is below the pressure dew point)
        const Td = V.comp;
        let e = e0 * pabs / PATM, w = w0, cond0 = 0;
        if (e > F.magnus(Td)) { e = F.magnus(Td); cond0 = w0 - wOf(e); w = wOf(e); }
        St.push({ T: Td, pdp: dewOf(F, e), w, removed: 0 });
        // aftercooler + separator (95 % of the droplets)
        const Tac = Math.min(Td, V.Tc + V.app);
        const condAc = Math.max(0, w - wOf(F.magnus(Tac))) + cond0;
        e = Math.min(e, F.magnus(Tac)); w = wOf(e);
        const remAc = 0.95 * condAc, carry = 0.05 * condAc;
        St.push({ T: Tac, pdp: dewOf(F, e), w, removed: remAc });
        // receiver: cools half-way to the room; its drain takes the new condensate and the carried-over drops
        const Trec = Tac - 0.5 * Math.max(0, Tac - V.Tc);
        const condRec = Math.max(0, w - wOf(F.magnus(Trec)));
        e = Math.min(e, F.magnus(Trec)); w = wOf(e);
        St.push({ T: Trec, pdp: dewOf(F, e), w, removed: condRec + carry });
        // dryer
        let Tdry = Trec, remDry = 0, purge = 0, vapour = false;
        if (V.dryer !== 'none') {
          const target = V.dryer === 'ref' ? 3 : V.dryer === 'mem' ? dewOf(F, e) - 30 : V.dryer === 'd40' ? -40 : -70;
          const eT = F.magnus(target);
          if (eT < e) { remDry = w - wOf(eT); e = eT; w = wOf(e); }
          if (V.dryer === 'ref') Tdry = 3 + 0.7 * Math.max(0, Trec - 3);
          else if (V.dryer === 'mem') { purge = 0.2; vapour = true; }
          else { purge = 1.2 * PATM / pabs; Tdry = Trec + 2; vapour = true; }
        }
        St.push({ T: Tdry, pdp: dewOf(F, e), w, removed: remDry, vapour });
        St.push({ T: Tdry, pdp: dewOf(F, e), w, removed: 0 });
        // the coldest pipe
        const condNet = Math.max(0, w - wOf(F.magnus(V.Tp)));
        const eN = Math.min(e, F.magnus(V.Tp));
        St.push({ T: V.Tp, pdp: dewOf(F, eN), w: wOf(eN), removed: condNet });
        const perDay = g => g * V.Q * 60 * V.h / 1000;                     // g/m³ → L/day
        const sens = RHO_ANR * V.Q / 60 * 1005 * Math.max(0, Td - Tac) / 1000, lat = V.Q / 60 * condAc / 1000 * 2.42e6 / 1000;
        return { St, perDay, sens, lat, purge, vapour, w0, remAc, condNet, pdpOut: St[5].pdp };
      }

      let ph = 0;
      const loop = kit.loop((dt) => {
        if (dirty || !res) {
          dirty = false; res = calc();
          const R = res, L = R.perDay;
          ro.set('in', R.w0.toFixed(1) + ' g/m³ · ' + f1(L(R.w0)) + ' L/day');
          ro.set('ac', f1(L(R.remAc)) + ' L/day — ' + (R.w0 > 0 ? (100 * R.remAc / R.w0).toFixed(0) : '0') + ' % of the water');
          ro.set('rec', f1(L(R.St[3].removed)) + ' L/day');
          ro.set('dry', V.dryer === 'none' ? 'no dryer' : f1(L(R.St[4].removed)) + ' L/day' + (R.vapour ? ', leaving as vapour in the purge' : ' to its drain'));
          ro.set('net', R.condNet > 1e-6 ? f1(L(R.condNet)) + ' L/day' + (V.Tp < 0 ? ' — and it freezes' : '') : 'none: the pipes stay above the dew point');
          ro.set('pdp', R.pdpOut.toFixed(1) + ' °C / class ' + waterClass(R.pdpOut));
          ro.set('heat', R.sens.toFixed(1) + ' kW sensible + ' + R.lat.toFixed(1) + ' kW latent');
          ro.set('purge', R.purge > 0 ? (100 * R.purge).toFixed(0) + ' % = ' + f2(R.purge * V.Q) + ' m³/min of free air' : 'none');
          plot.set({ series: [{ pts: R.St.map((s, i) => [i, s.T]), label: 'air temperature', dots: 3 }, { pts: R.St.map((s, i) => [i, s.pdp]), label: 'dew point (at the pressure there)', dash: [5, 4], dots: 3 }],
            hlines: [{ y: V.Tp, label: 'coldest pipe' }] });
        }
        const R = res, C = kit.colors(), c = st.begin(), WC = waterCol(kit);
        ph += dt * (20 + 6 * Math.log2(1 + V.Q));
        design(c, st, 760, 420);
        const air = S.col('air');
        // ---- the chain on its line
        const Y = 110;
        S.line(c, [[60, 164], [60, Y], [117, Y]], { state: 'air' });
        S.line(c, [[163, Y], [202, Y]], { state: 'air' }); S.line(c, [[248, Y], [285, Y]], { state: 'air' });
        S.line(c, [[355, Y], [412, Y]], { state: 'air' }); S.line(c, [[448, Y], [507, Y]], { state: 'air' });
        const cold = R.condNet > 1e-6;
        S.line(c, [[553, Y], [640, Y]], { state: 'air' });
        S.line(c, [[640, Y], [740, Y]], { color: cold ? (V.Tp < 0 ? C.accent : C.bad) : air, width: 4 });
        S.flow(c, [[60, 164], [60, Y], [740, Y]], ph, { color: air });
        S.line(c, [[60, 216], [60, 232]], { state: 'air' });
        kit.label(c, 'air in', 60, 244, { color: C.muted, size: 11, align: 'center' });
        S.compressor(c, 60, 190, { motor: true });
        S.cooler(c, 140, Y, { rot: 90 });
        // separator: a diamond with a drain
        diamond(c, 225, Y, 13, C.text, C.bg2); S.line(c, [[212, Y], [202, Y]], {}); S.line(c, [[238, Y], [248, Y]], {});
        c.fillStyle = C.text; c.beginPath(); c.moveTo(219, Y + 3); c.lineTo(231, Y + 3); c.lineTo(225, Y + 9); c.closePath(); c.fill();
        // receiver
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath();
        if (c.roundRect) c.roundRect(285, Y - 18, 70, 36, 16); else c.rect(285, Y - 18, 70, 36);
        c.stroke();
        // dryer
        if (V.dryer === 'ref') S.cooler(c, 430, Y, { rot: 90 });
        else if (V.dryer === 'none') S.line(c, [[412, Y], [448, Y]], { state: 'air' });
        else {
          diamond(c, 430, Y, 13, C.text, C.bg2); S.line(c, [[417, Y], [412, Y]], {}); S.line(c, [[443, Y], [448, Y]], {});
          if (V.dryer === 'mem') for (const dx of [-4, 0, 4]) S.line(c, [[430 + dx, Y - 7], [430 + dx, Y + 7]], { kind: 'drain', width: 1.2 });
          else { c.fillStyle = C.text; for (const [dx, dy] of [[-5, -2], [0, -5], [5, -2], [-2, 3], [3, 3], [0, 0]]) { c.beginPath(); c.arc(430 + dx, Y + dy, 1.4, 0, 7); c.fill(); } }
        }
        S.filter(c, 530, Y, { rot: 90 });
        // labels above each stage
        const X = [60, 140, 225, 320, 430, 530, 690];
        const heads = ['compressor', 'aftercooler', 'separator', 'receiver', V.dryer === 'none' ? '(no dryer)' : 'dryer', 'filter', 'coldest pipe'];
        const idx = [1, 2, 2, 3, 4, 5, 6];
        heads.forEach((hd, i) => {
          const s = R.St[idx[i]];
          kit.label(c, hd, X[i], 26, { color: C.text, size: 12, weight: 700, align: 'center' });
          if (i === 2) return;
          kit.label(c, s.T.toFixed(0) + ' °C', X[i], 44, { color: C.muted, size: 11, align: 'center' });
          kit.label(c, 'PDP ' + s.pdp.toFixed(0) + ' °C', X[i], 60, { color: s.pdp > (i === 6 ? V.Tp : s.T) - 0.05 ? C.warn : C.ok, size: 11, align: 'center' });
        });
        // drains and what they collect
        const drain = (x, y, grams) => {
          S.line(c, [[x, y], [x, y + 18]], { kind: 'drain', color: C.muted });
          const L = R.perDay(grams);
          drops(c, x, y + 22, y + 56, ph * 0.8, L, WC);
          kit.label(c, L > 0.05 ? f1(L) + ' L/day' : '—', x, y + 68, { color: L > 0.05 ? WC : C.muted, size: 11, weight: 700, align: 'center' });
        };
        drain(225, Y + 13, R.St[2].removed);
        drain(320, Y + 18, R.St[3].removed);
        if (V.dryer === 'ref') drain(430, Y + 13, R.St[4].removed);
        if (R.vapour) {
          // desiccant or membrane: the water leaves as vapour with the purge air
          S.line(c, [[430, Y + 13], [430, Y + 26]], { state: 'exhaust' }); S.exhaust(c, 430, Y + 26, { silencer: true });
          kit.label(c, f1(R.perDay(R.St[4].removed)) + ' L/day as vapour', 430, Y + 58, { color: WC, size: 11, weight: 700, align: 'center' });
          kit.label(c, 'purge ' + (100 * R.purge).toFixed(0) + ' %', 430, Y + 72, { color: C.warn, size: 11, align: 'center' });
          for (let k = 0; k < 3; k++) { const a = ((ph * 0.05 + k / 3) % 1); c.strokeStyle = S.col('exhaust'); c.globalAlpha = 1 - a; c.lineWidth = 1.5; c.beginPath(); c.arc(430, Y + 44 + 4 * a, 3 + 8 * a, 0, 7); c.stroke(); c.globalAlpha = 1; }
        }
        if (cold) {
          drops(c, 690, Y + 6, Y + 40, ph * 0.8, 1, V.Tp < 0 ? C.accent : C.bad);
          kit.label(c, f1(R.perDay(R.condNet)) + ' L/day ' + (V.Tp < 0 ? 'freeze in the pipes' : 'condense in the pipes'), 690, Y + 54, { color: C.bad, size: 11, weight: 700, align: 'center' });
        } else kit.label(c, 'stays dry', 690, Y + 30, { color: C.ok, size: 11, weight: 700, align: 'center' });
        // ---- bars: water carried per m³ of free air
        const top = 250, base = 390, mx = Math.max(1, R.w0);
        kit.label(c, 'water carried, g per m³ of free air (vapour; the rest has been drained)', 380, top - 16, { color: C.muted, size: 11, align: 'center' });
        R.St.forEach((s, i) => {
          const x = 70 + i * 103, h = (base - top) * clamp(s.w / mx, 0, 1);
          c.fillStyle = i === 6 && cold ? C.bad : WC; c.globalAlpha = 0.75; c.fillRect(x - 20, base - h, 40, Math.max(h, 1)); c.globalAlpha = 1;
          kit.label(c, s.w >= 0.1 ? s.w.toFixed(1) : s.w.toFixed(3), x, base - h - 10, { color: C.text, size: 11, weight: 700, align: 'center' });
          kit.label(c, NAMES[i], x, base + 14, { color: C.muted, size: 11, align: 'center' });
        });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(30, base + 0.5); c.lineTo(740, base + 0.5); c.stroke();
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dryers compared */
  Hyper.sim('treat-dryers', {
    title: 'Refrigerated or desiccant? Dryers compared',
    blurb: `On the left a heatless (pressure-swing) desiccant dryer at work, one simulated minute per second: wet air rises through the drying tower, whose loaded zone (blue) creeps upwards, while part of the dried air is expanded through the purge orifice and blown down through the other tower to atmosphere, carrying its water away. On the right, what five kinds of dryer cost a year for the same duty: their own electricity, the compressed air they purge (at the compressor's specific power), and the compressor energy spent on their pressure drop (with their filters). Water loads come from \`kit.fluid.magnus\`; the purge of the heatless dryer is 1.2 × $p_\\text{atm}/p_\\text{abs}$ of its rated flow.

**Try this**
- At 10 m³/min compare the refrigerated and the heatless dryer: the purge air costs several times the refrigerated dryer's electricity — the price of −40 °C.
- Lower the line pressure to 5 bar: the heatless purge rises towards 20 %.
- Tick load-following control at 40 % load: the heatless dryer's half-cycles stretch and its purge falls; a cycling refrigerated dryer saves most of its power too.
- Raise the inlet temperature to 45 °C with a fixed timer: the water load nearly doubles and the wet zone reaches the top of the tower — breakthrough.
- Set the flow to 1 m³/min: small dryers cost little whichever you choose, which is why heatless and membrane dryers are popular there.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      let dirty = true, res = null;
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Dryer rated flow (free air)', min: 0.5, max: 100, value: 10, unit: 'm³/min', log: true, sig: 2 },
        { id: 'p', label: 'Line pressure (gauge)', min: 4, max: 13, step: 0.5, value: 7, unit: 'bar' },
        { id: 'Tin', label: 'Air entering, saturated at', min: 20, max: 50, step: 1, value: 35, unit: '°C' },
        { id: 'load', label: 'Average load', min: 10, max: 100, step: 5, value: 70, unit: '%' },
        { id: 'ddc', type: 'check', label: 'Load-following control (dew-point switching, cycling refrigeration)', value: false },
        { id: 'sp', label: 'Compressor specific power', min: 5, max: 9, step: 0.1, value: 6.5, unit: 'kW per m³/min' },
        { id: 'h', label: 'Hours a year', min: 1000, max: 8760, step: 10, value: 6000, unit: 'h' },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['water', 'Water to remove'], ['purge', 'Heatless purge'], ['tower', 'Heatless tower cycle'], ['best', 'Cheapest to run']]);
      const tbl = kit.table(box.side, [{ label: 'Dryer', key: 'name', align: 'left' }, { label: 'PDP', key: 'pdp' }, { label: 'kW', key: 'kw', fmt: v => v.toFixed(1) }, { label: 'Per year', key: 'cost', fmt: v => kit.money(v, 0) }]);
      const V = ctl.values;
      const wOf = (t, pabs) => F.magnus(t) * PATM / (pabs * RV * 293.15);      // kg of water per m³ of free air, saturated at t
      function calc() {
        const pabs = V.p * 1e5 + PATM, L = V.load / 100, Qs = V.Q / 60, Qa = V.Q * L;
        const w = wOf(V.Tin, pabs), wRef = wOf(35, 7e5 + PATM);
        const Pcomp = V.sp * Qa;                                             // compressor power for the average flow, kW
        const dpCost = dp => Pcomp * Math.log(1 + dp * 1e5 / pabs) / Math.log(pabs / PATM);
        const follow = V.ddc ? L : 1;                                        // regeneration follows the load, or runs for the rated duty
        const waterRate = w * Qs * follow;                                   // kg/s of water the regeneration drives off
        const D = [];
        // refrigerated: cooling load to +3 °C, half recovered in the air-to-air exchanger, COP 3, fan
        const Pc = Qs * (RHO_ANR * 1005 * Math.max(0, V.Tin - 3) + Math.max(0, w - wOf(3, pabs)) * 2.45e6) / 1000;
        const PeFull = Pc * 0.5 / 3 + 0.02 * V.Q;
        D.push({ name: 'Refrigerated', short: 'refrigerated', pdp: '+3 °C', elec: PeFull * (V.ddc ? 0.1 + 0.9 * L : 0.8 + 0.2 * L), purge: 0, dp: dpCost(0.3) });
        // heatless: purge 1.2 patm/pabs of the rated flow; with dew-point switching, in proportion to the water load
        const f = 1.2 * PATM / pabs, loadHL = V.ddc ? Math.min(1, L * w / wRef) : 1;
        D.push({ name: 'Heatless desiccant', short: 'heatless', pdp: '−40 °C', elec: 0.02, purge: f * V.Q * loadHL * V.sp, dp: dpCost(0.4) });
        // heated purge and blower purge: heat of desorption about 2.8 MJ per kg of water
        D.push({ name: 'Heated purge', short: 'heated purge', pdp: '−40 °C', elec: waterRate * 2.8e6 / 0.8 / 1000 + 0.02, purge: 0.07 * V.Q * follow * V.sp, dp: dpCost(0.4) });
        D.push({ name: 'Blower purge', short: 'blower purge', pdp: '−40 °C', elec: waterRate * 2.8e6 / 0.65 / 1000 + 0.06 * V.Q * follow, purge: 0.02 * V.Q * follow * V.sp, dp: dpCost(0.4) });
        D.push({ name: 'Membrane (point of use)', short: 'membrane', pdp: (V.Tin - 30).toFixed(0) + ' °C', elec: 0, purge: 0.2 * Qa * V.sp, dp: dpCost(0.25) });
        for (const d of D) { d.kw = d.elec + d.purge + d.dp; d.cost = d.kw * V.h * V.price; }
        // the drying tower's wet front, per minute: a fixed timer is sized to load 60 % of the bed at the rated flow, 35 °C and 7 bar
        const rate = 0.6 / 5 * L * w / wRef;
        return { D, f, w, rate, loadHL, Qa };
      }
      // the twin towers (time in minutes)
      const T = { active: 0, half: 0, front: [0.05, 0.3], purgeRate: 0.3 / 4.5, broke: false, ph: 0, phP: 0 };
      function stepTowers(dtm, R) {
        const a = T.active, b = 1 - a;
        T.half += dtm;
        T.front[a] = Math.min(1, T.front[a] + R.rate * dtm);
        if (T.front[a] >= 1) T.broke = true;
        if (T.half < 4.5) T.front[b] = Math.max(0, T.front[b] - T.purgeRate * dtm);
        const due = V.ddc ? (T.half >= 5 && T.front[a] >= 0.6) || T.front[a] >= 0.95 : T.half >= 5;
        if (due) {
          T.active = b; T.half = 0; T.broke = false;
          T.purgeRate = Math.max(T.front[a], 0.02) / 4.5;
        }
      }
      const loop = kit.loop((dt) => {
        if (dirty || !res) {
          dirty = false; res = calc();
          const R = res;
          ro.set('water', (R.w * 1000).toFixed(2) + ' g per m³ of free air · ' + f1(R.w * R.Qa * 60 * 24) + ' L/day at the average load');
          ro.set('purge', (100 * R.f).toFixed(1) + ' % of the rated flow' + (V.ddc ? ', × ' + (100 * R.loadHL).toFixed(0) + ' % with switching' : '') + ' = ' + f2(R.f * V.Q * R.loadHL) + ' m³/min');
          ro.set('tower', V.ddc ? (R.rate > 0 ? 'switches at 60 % loading: every ' + f1(Math.max(5, 0.6 / R.rate)) + ' min' : '—') : 'fixed timer: 5 min drying, 4.5 min purge, 0.5 min repressurising');
          const best = R.D.reduce((m, d) => d.cost < m.cost ? d : m, R.D[0]);
          ro.set('best', best.name + ', ' + kit.money(best.cost, 0) + ' a year');
          tbl.set(R.D);
        }
        const R = res, C = kit.colors(), c = st.begin(), WC = waterCol(kit);
        stepTowers(Math.min(dt, 0.05), R);
        const qn = 20 + 8 * Math.log2(1 + V.Q * V.load / 100);
        T.ph += dt * qn; T.phP += dt * 30;
        design(c, st, 760, 400);
        // ---- twin towers
        const X = [95, 225], y0 = 100, y1 = 290, a = T.active, b = 1 - a, purging = T.half < 4.5;
        const air = S.col('air'), exh = S.col('exhaust');
        // pipework: inlet manifold (bottom), outlet manifold (top), purge line between the tops, exhaust branches
        for (let i = 0; i < 2; i++) {
          S.line(c, [[X[i], 340], [X[i], y1]], { state: 'idle' });
          S.line(c, [[X[i], y0], [X[i], 50]], { state: 'idle' });
          S.line(c, [[X[i], 315], [160, 315]], { state: 'idle' });
        }
        S.line(c, [[20, 340], [X[1], 340]], { state: 'idle' });
        S.line(c, [[X[0], 50], [330, 50]], { state: 'idle' });
        S.line(c, [[X[0], 60], [X[1], 60]], { state: 'idle', width: 1.4 });
        S.line(c, [[160, 315], [160, 372]], { state: purging ? 'exhaust' : 'idle' });
        S.line(c, [[20, 340], [X[a], 340], [X[a], y1]], { state: 'air' });
        S.line(c, [[X[a], y0], [X[a], 50], [330, 50]], { state: 'air' });
        if (purging) {
          S.line(c, [[X[a], 60], [X[b], 60], [X[b], y0]], { state: 'exhaust', width: 1.6 });
          S.line(c, [[X[b], y1], [X[b], 315], [160, 315]], { state: 'exhaust' });
        }
        for (const [jx, jy] of [[X[0], 60], [X[1], 60], [X[0], 315], [X[1], 315], [160, 315]]) S.junction(c, jx, jy);
        S.exhaust(c, 160, 372, { silencer: true });
        // purge orifice between the tower tops
        c.fillStyle = C.bg2; c.fillRect(150, 53, 20, 14); c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(150, 53, 20, 14);
        c.beginPath(); c.moveTo(154, 55); c.lineTo(160, 60); c.lineTo(166, 55); c.moveTo(154, 65); c.lineTo(160, 60); c.lineTo(166, 65); c.stroke();
        kit.label(c, 'purge orifice', 160, 80, { color: C.muted, size: 10, align: 'center' });
        for (let i = 0; i < 2; i++) {
          const x = X[i], h = y1 - y0;
          c.fillStyle = C.surface; c.fillRect(x - 26, y0, 52, h);
          c.fillStyle = WC; c.globalAlpha = 0.5; c.fillRect(x - 26, y1 - h * T.front[i], 52, h * T.front[i]); c.globalAlpha = 1;
          c.fillStyle = C.muted;
          for (let yy = y0 + 8; yy < y1; yy += 12) for (let xx = x - 20 + ((yy / 12) % 2) * 5; xx < x + 22; xx += 10) { c.beginPath(); c.arc(xx, yy, 1.6, 0, 7); c.fill(); }
          c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x - 26, y0, 52, h);
          const lab = i === a ? 'drying' : purging ? 'purging' : V.ddc && T.half >= 5 ? 'regenerated, waiting' : 'repressurising';
          kit.label(c, lab, x + (i ? 12 : -12), 356, { color: i === a ? C.ok : C.warn, size: 12, weight: 700, align: 'center' });
          kit.label(c, (100 * T.front[i]).toFixed(0) + ' % loaded', x + (i ? 12 : -12), 371, { color: C.muted, size: 11, align: 'center' });
        }
        S.flow(c, [[20, 340], [X[a], 340], [X[a], 50], [330, 50]], T.ph, { color: air });
        if (purging) S.flow(c, [[X[a], 60], [X[b], 60], [X[b], 315], [160, 315], [160, 372]], T.phP, { color: exh, r: 2 });
        kit.label(c, 'wet air in', 22, 328, { color: C.muted, size: 11 });
        kit.label(c, 'dry air out', 330, 38, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'purge to atmosphere', 160, 396, { color: C.muted, size: 10, align: 'center' });
        kit.label(c, 'minute ' + T.half.toFixed(1) + ' of the half-cycle', 160, 20, { color: C.text, size: 12, weight: 700, align: 'center' });
        if (T.broke) kit.label(c, 'breakthrough: wet air reaches the outlet!', 160, y0 - 12, { color: C.bad, size: 12, weight: 700, align: 'center' });
        // ---- yearly cost, stacked
        const bx = 390, bw = 46, gap = 74, base = 330, top = 70, mx = Math.max(...R.D.map(d => d.kw), 0.01);
        kit.label(c, 'running cost per year', 565, 20, { color: C.text, size: 12, weight: 700, align: 'center' });
        const parts = [['elec', C.accent, 'electricity'], ['purge', C.warn, 'purge air'], ['dp', C.muted, 'pressure drop']];
        parts.forEach((p, k) => { c.fillStyle = p[1]; c.fillRect(420 + k * 110, 36, 10, 10); kit.label(c, p[2], 434 + k * 110, 41, { color: C.muted, size: 11 }); });
        R.D.forEach((d, i) => {
          const x = bx + i * gap;
          let y = base;
          for (const p of parts) { const hgt = (base - top) * d[p[0]] / mx; c.fillStyle = p[1]; c.fillRect(x, y - hgt, bw, hgt); y -= hgt; }
          kit.label(c, kit.money(d.cost, 0, true), x + bw / 2, y - 10, { color: C.text, size: 11, weight: 700, align: 'center' });
          kit.label(c, d.short, x + bw / 2, base + 14, { color: C.text, size: 11, align: 'center' });
          kit.label(c, 'PDP ' + d.pdp, x + bw / 2, base + 29, { color: C.muted, size: 10, align: 'center' });
        });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 8, base + 0.5); c.lineTo(bx + 4 * gap + bw + 8, base + 0.5); c.stroke();
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ISO 8573-1 class picker */
  const P_LIM = [[20000, 400, 10], [400000, 6000, 100], [Infinity, 90000, 1000], [Infinity, Infinity, 10000], [Infinity, Infinity, 100000]];
  const APPS = {
    custom: null,
    shop: { pm: 'mass', mass: 4, wm: 'pdp', pdp: 2, oil: 4, why: 'Blow-off, air tools, general workshop: dust and liquid water kept out of the tools.' },
    auto: { pm: 'count', n1: 5e6, n2: 5e5, n3: 8e4, wm: 'pdp', pdp: 2, oil: 4, why: 'Cylinders and valves: dry enough not to wash out their grease; 5 µm filtration.' },
    inst: { pm: 'count', n1: 3e5, n2: 5000, n3: 80, wm: 'pdp', pdp: -25, oil: 0.08, why: 'Instrument air: the dew point 10 K below the coldest the lines see; clean and nearly oil-free for small nozzles.' },
    paint: { pm: 'count', n1: 15000, n2: 300, n3: 8, wm: 'pdp', pdp: 2, oil: 0.008, why: 'Spray painting: oil and dust ruin the finish; water class 4 is enough indoors.' },
    food: { pm: 'count', n1: 3e5, n2: 5000, n3: 80, wm: 'pdp', pdp: -42, oil: 0.008, why: 'Food and drink, air touching the product: no oil, and too dry for microbes to grow.' },
    foodnc: { pm: 'count', n1: 3e5, n2: 5000, n3: 80, wm: 'pdp', pdp: 2, oil: 0.08, why: 'Food and drink, air near but not touching the product.' },
    pharma: { pm: 'count', n1: 15000, n2: 300, n3: 8, wm: 'pdp', pdp: -42, oil: 0.008, why: 'Pharmaceutical and electronics production.' },
    outdoor: { pm: 'count', n1: 3e6, n2: 8e4, n3: 800, wm: 'pdp', pdp: -42, oil: 0.8, why: 'Lines outdoors down to −25 °C: a dew point of −35 °C or lower, so water class 2.' }
  };
  function particleClass(v) {
    if (v.pm === 'mass') return v.mass <= 5 ? '6' : v.mass <= 10 ? '7' : 'X';
    for (let k = 0; k < 5; k++) if (v.n1 <= P_LIM[k][0] && v.n2 <= P_LIM[k][1] && v.n3 <= P_LIM[k][2]) return String(k + 1);
    return '6+';
  }
  function waterClassOf(v) {
    if (v.wm === 'pdp') return v.pdp <= 10 ? waterClass(v.pdp) : '7+';
    return v.lw <= 0.5 ? '7' : v.lw <= 5 ? '8' : v.lw <= 10 ? '9' : 'X';
  }
  const oilClass = o => o <= 0.01 ? '1' : o <= 0.1 ? '2' : o <= 1 ? '3' : o <= 5 ? '4' : 'X';
  const TREAT = {
    p: { 1: 'high-efficiency filter, 0.01 µm (and a dust filter after any desiccant dryer)', 2: 'high-efficiency filter, 0.01 µm', 3: 'general-purpose filter, 1 µm', 4: '5 µm filter', 5: '5 µm filter', 6: '25–40 µm service-unit filter', 7: '25–40 µm service-unit filter', X: 'water separator only', '6+': 'beyond the count classes: measure the mass concentration' },
    w: { 1: 'desiccant dryer with molecular sieve (−70 °C)', 2: 'desiccant dryer (−40 °C)', 3: 'desiccant (−40 °C) or membrane dryer', 4: 'refrigerated dryer (+3 °C)', 5: 'refrigerated dryer', 6: 'refrigerated or membrane dryer', 7: 'aftercooler, separator and drains', 8: 'aftercooler and separator', 9: 'aftercooler and separator', X: 'none — liquid water in the lines', '7+': 'above +10 °C: classed by the liquid water it carries' },
    o: { 1: 'two coalescers and activated carbon (or an oil-free compressor with a fine filter)', 2: 'general-purpose and high-efficiency coalescers', 3: 'general-purpose coalescer', 4: 'a well-kept oil-injected compressor as delivered (2–5 mg/m³)', X: 'lubricated air, or no treatment' }
  };

  Hyper.sim('treat-iso-class', {
    title: 'ISO 8573-1:2010 class picker',
    blurb: `Pick an application to see the class it typically asks for, or enter measured values — particle counts in the three size ranges (or the mass concentration for dirty air), the pressure dew point (or the liquid water for undried air) and the total oil — and read the class code **ISO 8573-1:2010 [A:B:C]**, with the row of each table that decides it and the treatment that usually gets there. The limits are those of the 2010 edition; the applications are typical specifications, not requirements of the standard.

**Try this**
- Choose spray painting: [1:4:1]. Then raise the oil to 0.02 mg/m³ — a single high-efficiency coalescer without carbon — and watch the oil class drop to 2.
- Move the dew point from +3 °C to +4 °C: water class 4 becomes 5. The classes are limits, so one degree can change the code.
- For particles, the worst size range decides: a clean 0.1–0.5 µm count does not help if the 1–5 µm count is high.
- Switch the water to liquid water: air with no dryer at all falls into classes 7–X.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'app', type: 'select', label: 'Application', options: [['Your own values', 'custom'], ['General workshop, air tools', 'shop'], ['Cylinders and valves', 'auto'], ['Instrument air', 'inst'], ['Spray painting', 'paint'], ['Food, air touching the product', 'food'], ['Food, air near the product', 'foodnc'], ['Pharmaceutical, electronics', 'pharma'], ['Outdoor lines to −25 °C', 'outdoor']], value: 'paint' },
        { id: 'pm', type: 'select', label: 'Particles measured as', options: [['Counts per m³ (classes 1–5)', 'count'], ['Mass concentration (classes 6–X)', 'mass']], value: 'count' },
        { id: 'n1', label: 'Particles 0.1–0.5 µm per m³', min: 1, max: 1e7, value: 15000, log: true, sig: 2 },
        { id: 'n2', label: 'Particles 0.5–1 µm per m³', min: 1, max: 1e7, value: 300, log: true, sig: 2 },
        { id: 'n3', label: 'Particles 1–5 µm per m³', min: 1, max: 1e7, value: 8, log: true, sig: 2 },
        { id: 'mass', label: 'Particle mass concentration', min: 0.1, max: 50, value: 4, unit: 'mg/m³', log: true, sig: 2 },
        { id: 'wm', type: 'select', label: 'Water measured as', options: [['Pressure dew point (classes 1–6)', 'pdp'], ['Liquid water (classes 7–X)', 'liquid']], value: 'pdp' },
        { id: 'pdp', label: 'Pressure dew point', min: -80, max: 20, step: 1, value: 2, unit: '°C' },
        { id: 'lw', label: 'Liquid water', min: 0.05, max: 50, value: 2, unit: 'g/m³', log: true, sig: 2 },
        { id: 'oil', label: 'Total oil (aerosol, liquid and vapour)', min: 0.001, max: 50, value: 0.008, unit: 'mg/m³', log: true, sig: 2 }
      ], (id, v) => {
        if (id === 'app' && APPS[v]) { for (const [k, x] of Object.entries(APPS[v])) if (k !== 'why') ctl.set(k, x); }
        else if (id !== 'app' && id !== 'pm' && id !== 'wm') ctl.set('app', 'custom');
        modes(); loop.once();
      });
      const ro = kit.readout(box.side, [['code', 'Class code'], ['p', 'Particles'], ['w', 'Water'], ['o', 'Oil']]);
      const V = ctl.values;
      function modes() {
        const cnt = V.pm === 'count';
        ctl.show('n1', cnt); ctl.show('n2', cnt); ctl.show('n3', cnt); ctl.show('mass', !cnt);
        ctl.show('pdp', V.wm === 'pdp'); ctl.show('lw', V.wm !== 'pdp');
      }
      const fmtN = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e4 ? Math.round(n / 1000) + 'k' : String(Math.round(n));
      function table(c, C, x, y, title, head, rows, active, widths) {
        kit.label(c, title, x, y, { color: C.text, size: 12, weight: 700 });
        let yy = y + 20;
        const W = widths.reduce((a, b) => a + b, 0);
        let xx = x;
        head.forEach((hd, j) => { kit.label(c, hd, xx + 4, yy, { color: C.muted, size: 10 }); xx += widths[j]; });
        yy += 16;
        rows.forEach(r => {
          if (String(r[0]) === active) { c.fillStyle = C.accent; c.globalAlpha = 0.25; c.fillRect(x - 2, yy - 9, W + 4, 18); c.globalAlpha = 1; }
          xx = x;
          r.forEach((cell, j) => { kit.label(c, String(cell), xx + 4, yy, { color: String(r[0]) === active ? C.text : C.muted, size: 11, weight: j === 0 || String(r[0]) === active ? 700 : 500 }); xx += widths[j]; });
          yy += 18;
        });
      }
      const loop = kit.loop(() => {
        const C = kit.colors(), c = st.begin();
        const pc = particleClass(V), wc = waterClassOf(V), oc = oilClass(V.oil);
        const code = '[' + pc + ':' + wc + ':' + oc + ']';
        ro.set('code', 'ISO 8573-1:2010 ' + code);
        ro.set('p', V.pm === 'mass' ? V.mass.toFixed(2) + ' mg/m³ → class ' + pc : fmtN(V.n1) + ' / ' + fmtN(V.n2) + ' / ' + fmtN(V.n3) + ' per m³ → class ' + pc);
        ro.set('w', V.wm === 'pdp' ? 'PDP ' + V.pdp.toFixed(0) + ' °C → class ' + wc : V.lw.toFixed(2) + ' g/m³ liquid → class ' + wc);
        ro.set('o', (V.oil < 0.1 ? V.oil.toFixed(3) : V.oil.toFixed(2)) + ' mg/m³ → class ' + oc);
        design(c, st, 760, 470);
        kit.label(c, 'ISO 8573-1:2010 ' + code, 380, 26, { color: C.accent, size: 24, weight: 800, align: 'center' });
        const app = APPS[V.app];
        kit.label(c, app ? app.why : 'Your own values: move any slider.', 380, 54, { color: C.muted, size: 12, align: 'center' });
        table(c, C, 12, 84, 'Particles — maximum per m³', ['class', '0.1–0.5 µm', '0.5–1 µm', '1–5 µm'],
          [[1, '20 000', '400', '10'], [2, '400 000', '6 000', '100'], [3, '—', '90 000', '1 000'], [4, '—', '—', '10 000'], [5, '—', '—', '100 000'], [6, '≤ 5 mg/m³', '', ''], [7, '≤ 10 mg/m³', '', ''], ['X', '> 10 mg/m³', '', '']],
          pc === '6+' ? '' : pc, [40, 82, 70, 64]);
        table(c, C, 290, 84, 'Water', ['class', 'requirement'],
          [[1, 'PDP ≤ −70 °C'], [2, 'PDP ≤ −40 °C'], [3, 'PDP ≤ −20 °C'], [4, 'PDP ≤ +3 °C'], [5, 'PDP ≤ +7 °C'], [6, 'PDP ≤ +10 °C'], [7, 'liquid ≤ 0.5 g/m³'], [8, 'liquid ≤ 5 g/m³'], [9, 'liquid ≤ 10 g/m³'], ['X', 'liquid > 10 g/m³']],
          wc.length > 2 ? wc.charAt(0) : wc, [40, 130]);
        table(c, C, 530, 84, 'Oil (total)', ['class', 'mg/m³'],
          [[1, '≤ 0.01'], [2, '≤ 0.1'], [3, '≤ 1'], [4, '≤ 5'], ['X', '> 5']],
          oc, [40, 90]);
        // the treatment that usually reaches it
        const ty = 336;
        kit.label(c, 'Typical treatment to reach it', 12, ty, { color: C.text, size: 12, weight: 700 });
        const lines = [['particles', TREAT.p[pc] || ''], ['water', TREAT.w[wc] || TREAT.w[wc.charAt(0)] || ''], ['oil', TREAT.o[oc] || '']];
        lines.forEach((l, i) => {
          kit.label(c, l[0], 12, ty + 24 + i * 22, { color: C.muted, size: 12, weight: 700 });
          kit.label(c, l[1], 90, ty + 24 + i * 22, { color: C.text, size: 12 });
        });
        kit.label(c, 'Concentrations at the reference conditions of the standard: 20 °C, 1 bar absolute, dry.', 12, 452, { color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      modes();
      loop.once();
    }
  });

  /* ================================================================ pressure regulator */
  // diaphragm area, seat diameter, set-spring stiffness (N/m), sonic conductance of the open seat (m³/(s·Pa)), rated flow (L/min)
  const REG = {
    small: { Ad: 12.6e-4, ds: 6e-3, k: 25e3, C: 6e-8, Qr: 1500 },
    medium: { Ad: 19.6e-4, ds: 10e-3, k: 40e3, C: 16e-8, Qr: 4500 },
    large: { Ad: 38.5e-4, ds: 16e-3, k: 60e3, C: 40e-8, Qr: 12000 },
    precision: { Ad: 12.6e-4, ds: 6e-3, k: 0.4e3, C: 5e-8, Qr: 1200, bal: true, bleed: 3 }   // the pilot stage acts as a very soft spring
  };
  Hyper.sim('treat-regulator', {
    title: 'Inside a pressure regulator',
    blurb: `A direct-acting diaphragm regulator in cross-section (left) and as its ISO 1219 symbol (right). The set spring pushes the diaphragm and poppet open; the outlet pressure under the diaphragm pushes back; the inlet pressure pushes the poppet shut on its seat area. At each instant the poppet sits where these forces balance, the air through the seat follows ISO 6358 (\`kit.fluid.iso6358\`), and the volume downstream fills or empties — consumer, vent and supply together set the outlet pressure. The graph is the regulator's **flow characteristic** at the present supply and at 2 bar less and more; the dot is where it is working now.

**Try this**
- Raise the demand from 0 to 100 % of the rated flow: the outlet droops as the poppet opens and the set spring relaxes. Towards 150 % the poppet is nearly wide open and the curve bends down steeply.
- At a small demand (10 %), lower the supply from 7 to 5.5 bar: with an unbalanced poppet the outlet *rises* a little; raise it to 10 bar and the outlet falls. Tick the balanced poppet and the effect all but disappears.
- Set the demand to 0 and turn the set pressure down by 2 bar: the relieving regulator vents at once. Untick relieving and do it again — the gauge stays up until air is used.
- Compare the general-purpose regulators with the precision one: its pilot acts like a very soft spring, so it droops only millibars — and bleeds a few L/min all the time.
- Set the supply below the setting: a regulator cannot raise pressure, the outlet simply follows the supply.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const gdiv = document.createElement('div');
      gdiv.style.cssText = 'padding:4px 10px 10px';
      box.stage.appendChild(gdiv);
      let M = null, dirty = true, tPlot = 0;
      const ctl = kit.controls(box.side, [
        { id: 'size', type: 'select', label: 'Regulator', options: [['General purpose, G1/4', 'small'], ['General purpose, G1/2', 'medium'], ['General purpose, G1', 'large'], ['Precision, pilot-operated, G1/4', 'precision']], value: 'medium' },
        { id: 'set', label: 'Set pressure (no flow, 7 bar supply)', min: 0.5, max: 8, step: 0.1, value: 5, unit: 'bar' },
        { id: 'p1', label: 'Supply pressure (gauge)', min: 1, max: 10, step: 0.1, value: 7, unit: 'bar' },
        { id: 'q', label: 'Consumer demand at the set pressure', min: 0, max: 150, step: 1, value: 50, unit: '% of rated flow' },
        { id: 'bal', type: 'check', label: 'Balanced poppet', value: false },
        { id: 'rel', type: 'check', label: 'Relieving (vent through the diaphragm)', value: true },
        { id: 'vol', label: 'Volume downstream', min: 0.2, max: 50, value: 5, unit: 'L', log: true, sig: 2 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id) => { if (id !== 'slow' && id !== 'vol') dirty = true; });
      const ro = kit.readout(box.side, [['p', 'Supply / outlet (gauge)'], ['err', 'Outlet minus setting'], ['x', 'Poppet opening'], ['q', 'Flow in / to the consumer'], ['vent', 'Vent'], ['sup', 'Supply effect']]);
      const plot = kit.plot(gdiv, { x: { label: 'flow to the consumer (L/min ANR)', min: 0 }, y: { label: 'outlet, gauge (bar)' }, legend: true }, 170);
      const V = ctl.values;
      let p2 = PATM + V.set * 1e5, ph = [0, 0, 0], last = null;
      function model() {
        const R = REG[V.size], Avg = Math.PI * R.ds * R.ds / 4;
        const Av = (V.bal || R.bal) ? 0.03 * Avg : Avg, Ae = R.Ad - Av;
        const Fs = V.set * 1e5 * Ae + 7e5 * Av;                               // set with no flow at 7 bar supply
        const Qd = V.q / 100 * R.Qr / 60000;                                   // m³/s of free air wanted at the set pressure
        const q1 = F.iso6358({ C: 1, b: 0.5, p1: V.set * 1e5 + PATM, p2: PATM }).qANR;
        return { R, Av, Ae, Fs, xf: R.ds / 4, xmax: 1.15 * R.ds / 4, Cload: q1 > 0 ? Qd / q1 : 0, bleed: (R.bleed || 0) / 60000 };
      }
      // spring travel left before the poppet closes (m): negative when the outlet pushes the diaphragm off the stem
      const travel = (m, p2g, p1g) => (m.Fs - p2g * m.Ae - p1g * m.Av) / m.R.k;
      const seatFlow = (m, x, p1a, p2a) => x > 0 ? F.iso6358({ C: m.R.C * Math.min(1, x / m.xf), b: 0.35, p1: p1a, p2: p2a }).qANR : 0;
      function flows(m, p2a) {
        const p1a = V.p1 * 1e5 + PATM, r = travel(m, p2a - PATM, V.p1 * 1e5);
        const x = clamp(r, 0, m.xmax), qin = seatFlow(m, x, p1a, p2a);
        const lift = Math.max(0, -r), y = V.rel ? Math.max(0, lift - 0.05e-3) : 0;       // a small overlap before the vent opens
        const qv = y > 0 ? F.iso6358({ C: 0.08 * m.R.C * Math.min(1, y / 0.5e-3), b: 0.4, p1: p2a, p2: PATM }).qANR : 0;
        const qc = F.iso6358({ C: m.Cload, b: 0.5, p1: p2a, p2: PATM }).qANR;
        const qb = m.bleed * clamp((p2a - PATM) / 0.5e5, 0, 1);
        return { x, lift, qin, qv, qc, qb };
      }
      // one implicit (backward Euler) step of the downstream pressure, solved by bisection: stable for any stiffness
      function step(m, h) {
        const K = PANR / (V.vol / 1000), old = p2, p1a = V.p1 * 1e5 + PATM;
        const g = p => { const f = flows(m, p); return p - old - h * K * (f.qin - f.qc - f.qv - f.qb); };
        let lo = PATM, hi = Math.max(old, p1a) + 1000;
        if (g(lo) >= 0) { p2 = lo; return; }
        for (let i = 0; i < 44; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) hi = mid; else lo = mid; }
        p2 = (lo + hi) / 2;
      }
      // the steady flow characteristic: outlet pressure (gauge) for a drawn flow Q, or null beyond capacity
      function steady(m, p1g, Q) {
        const p1a = p1g * 1e5 + PATM;
        const qin = p => seatFlow(m, clamp(travel(m, p - PATM, p1g * 1e5), 0, m.xmax), p1a, p);
        if (qin(PATM) < Q) return null;
        let lo = PATM, hi = p1a;
        for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (qin(mid) > Q) lo = mid; else hi = mid; }
        return (lo + hi) / 2 - PATM;
      }
      function curves(m) {
        const out = [];
        for (const [p1g, dash] of [[V.p1, null], [V.p1 - 2, [6, 4]], [V.p1 + 2, [2, 3]]]) {
          if (p1g < 0.5 || p1g > 12) continue;
          const pts = [];
          for (let i = 0; i <= 80; i++) {
            const Q = 1.6 * m.R.Qr / 60000 * i / 80, y = steady(m, p1g, Q + m.bleed);
            if (y == null) break;
            pts.push([Q * 60000, y / 1e5]);
          }
          out.push({ pts, label: 'supply ' + p1g.toFixed(1) + ' bar', dash: dash || undefined });
        }
        return out;
      }
      const loop = kit.loop((dt) => {
        if (dirty || !M) {
          dirty = false; M = model();
          plot.set({ series: curves(M), hlines: [{ y: V.set, label: 'set' }], x: { label: 'flow to the consumer (L/min ANR)', min: 0, max: 1.6 * M.R.Qr } });
        }
        const m = M, sdt = Math.min(dt, 0.05) * V.slow, n = Math.max(1, Math.ceil(sdt / 0.002));
        for (let i = 0; i < n; i++) step(m, sdt / n);
        const f = flows(m, p2), p2g = (p2 - PATM) / 1e5;
        last = f;
        ro.set('p', V.p1.toFixed(1) + ' / ' + p2g.toFixed(2) + ' bar');
        const err = p2g - V.set;
        ro.set('err', (err >= 0 ? '+' : '−') + Math.abs(err).toFixed(3) + ' bar');
        ro.set('x', f.x > 1e-7 ? (f.x * 1000).toFixed(2) + ' mm (' + Math.min(100, 100 * f.x / m.xf).toFixed(0) + ' % open)' : 'closed');
        ro.set('q', (f.qin * 60000).toFixed(0) + ' / ' + (f.qc * 60000).toFixed(0) + ' L/min' + (m.bleed ? ' (+ bleed ' + (f.qb * 60000).toFixed(1) + ')' : ''));
        ro.set('vent', V.rel ? (f.qv * 60000 > 0.05 ? (f.qv * 60000).toFixed(0) + ' L/min to atmosphere' : 'closed') : 'non-relieving: cannot vent');
        ro.set('sup', '+' + (m.Av / m.Ae).toFixed(3) + ' bar per bar the supply falls');
        tPlot += dt;
        if (tPlot > 0.1) { tPlot = 0; plot.set({ marks: [{ x: f.qc * 60000, y: p2g, label: 'now' }] }); }
        // ---- drawing on a 760 × 330 grid
        const C = kit.colors(), c = st.begin(), air = S.col('air'), exh = S.col('exhaust');
        const k = design(c, st, 760, 330);
        const fillP = p => (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + clamp(0.06 + 0.4 * p / 10e5, 0.06, 0.46) + ')';
        const xpx = 14 * clamp(f.x / m.xf, 0, 1.15), ypx = 10 * clamp(f.lift / 0.6e-3, 0, 1);
        const dy = 125 + xpx - ypx;
        // chambers
        c.fillStyle = fillP(V.p1 * 1e5);
        c.beginPath(); [[20, 215], [60, 215], [60, 190], [350, 190], [350, 270], [60, 270], [60, 245], [20, 245]].forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill();
        c.fillStyle = fillP(p2 - PATM);
        c.beginPath(); [[130, 125], [350, 125], [350, 150], [440, 150], [440, 182], [350, 182], [350, 190], [130, 190]].forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2; c.setLineDash([]);
        const wall = pts => { c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); };
        wall([[20, 215], [60, 215], [60, 190], [228, 190]]); wall([[252, 190], [350, 190]]);
        wall([[20, 245], [60, 245], [60, 270], [350, 270], [350, 190], [350, 182], [440, 182]]);
        wall([[440, 150], [350, 150], [350, 125]]); wall([[130, 125], [130, 190]]);
        // bonnet (at atmospheric pressure) and knob
        wall([[130, 125], [150, 125], [150, 40], [212, 40]]); wall([[268, 40], [330, 40], [330, 72]]); wall([[330, 88], [330, 125], [350, 125]]);
        c.fillStyle = C.surface; c.fillRect(212, 8, 56, 18); c.strokeRect(212, 8, 56, 18);
        wall([[240, 26], [240, 36]]); c.fillStyle = C.text; c.fillRect(214, 36, 52, 5);
        S.zigzag(c, 240, 41, 240, dy - 7, 16, 5, C.text);
        // diaphragm and its plate, with the vent hole of a relieving regulator
        c.lineWidth = 2.4; wall([[130, 125], [205, dy]]); wall([[275, dy], [350, 125]]);
        c.fillStyle = C.text; c.fillRect(205, dy - 7, 70, 7);
        if (V.rel) { c.fillStyle = C.bg2; c.fillRect(237.5, dy - 7, 5, 7); }
        // poppet, stem and return spring
        const top = 190 + xpx;
        c.fillStyle = C.muted; c.fillRect(237.5, 125 + xpx, 5, top - (125 + xpx));
        c.fillStyle = C.text; c.fillRect(220, top, 40, 18);
        S.zigzag(c, 240, top + 18, 240, 268, 9, 4, C.muted);
        // flows
        const qr = m.R.Qr / 60000;
        ph[0] += dt * 90 * clamp(f.qin / qr, 0, 1.6); ph[1] += dt * 90 * clamp(f.qv / (0.1 * qr), 0, 1.6);
        if (f.qin > qr * 0.005) S.flow(c, [[20, 230], [200, 230], [240, 200 + xpx], [240, 175], [300, 166], [440, 166]], ph[0], { color: air });
        if (f.qv > qr * 0.001) S.flow(c, [[240, 170], [240, 60], [300, 60], [330, 80], [372, 80]], ph[1], { color: exh });
        // gauges and labels
        S.gauge(c, 40, 193, { frac: V.p1 / 12 }); kit.label(c, V.p1.toFixed(1) + ' bar', 40, 172, { color: C.text, size: 11, weight: 700, align: 'center' });
        S.gauge(c, 405, 128, { frac: clamp(p2g / 12, 0, 1) }); kit.label(c, p2g.toFixed(2) + ' bar', 405, 107, { color: C.text, size: 11, weight: 700, align: 'center' });
        kit.label(c, 'inlet', 24, 258, { color: C.muted, size: 11 });
        kit.label(c, 'outlet', 440, 196, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'set spring', 262, 72, { color: C.muted, size: 11 });
        kit.label(c, 'diaphragm', 355, 112, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'poppet', 266, 204 + xpx, { color: C.muted, size: 11 });
        kit.label(c, V.rel ? 'vent' : 'no vent', 338, 80, { color: V.rel ? C.muted : C.faint, size: 11 });
        kit.label(c, 'cross-section (schematic)', 20, 316, { color: C.muted, size: 11 });
        // ---- the ISO 1219 symbol
        S.line(c, [[560, 298], [560, 244]], { state: 'air' }); S.line(c, [[560, 272], [610, 272]], { state: 'air' });
        S.line(c, [[560, 186], [560, 110], [700, 110], [700, 124]], { state: p2g > 0.05 ? 'air' : 'idle' }); S.line(c, [[560, 150], [610, 150]], { state: p2g > 0.05 ? 'air' : 'idle' });
        S.junction(c, 560, 272); S.junction(c, 560, 150);
        if (f.qin > qr * 0.005) { S.flow(c, [[560, 298], [560, 244]], ph[0], { color: air }); S.flow(c, [[560, 186], [560, 110], [700, 110], [700, 124]], ph[0], { color: air }); }
        S.source(c, 560, 318, { pneumatic: true });
        S.pressureValve(c, 560, 215, { kind: V.rel ? 'regulator' : 'reducing', open: clamp(f.x / m.xf, 0, 1) });
        S.gauge(c, 610, 251, { frac: V.p1 / 12 }); S.gauge(c, 610, 129, { frac: clamp(p2g / 12, 0, 1) });
        S.throttle(c, 700, 140, { adjustable: true });
        S.exhaust(c, 700, 156, {});
        kit.label(c, 'supply', 574, 300, { color: C.muted, size: 11 });
        kit.label(c, V.rel ? 'relieving regulator' : 'non-relieving regulator', 600, 205, { color: C.text, size: 11, weight: 700 });
        kit.label(c, 'consumer', 716, 140, { color: C.muted, size: 11 });
        kit.label(c, 'ISO 1219 symbol', 740, 316, { color: C.muted, size: 11, align: 'right' });
        // the same regulator as part of a service unit: filter, regulator with gauge, lubricator (simplified symbol)
        S.line(c, [[566, 58], [592, 58]], { state: 'air' }); S.line(c, [[688, 58], [714, 58]], { state: p2g > 0.05 ? 'air' : 'idle' });
        S.frl(c, 640, 58);
        kit.label(c, 'in a service unit (FRL)', 640, 90, { color: C.muted, size: 10, align: 'center' });
        c.restore();
        return k;
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a clogging filter */
  const GRADES = { gp: { wet: 0.1, coal: true }, he: { wet: 0.15, coal: true }, dust: { wet: 0.05, coal: false } };
  Hyper.sim('treat-filter', {
    title: 'A clogging filter and what it costs',
    blurb: `A filter element's pressure drop starts at its clean (for a coalescer, wetted) value and climbs as dirt loads it — slowly at first, then faster — until the element is changed. The compressor has to make up that drop: its power rises by $\\ln(1 + \\Delta p/p_\\text{abs})/\\ln(p_\\text{abs}/p_\\text{atm})$ of the power it spends on the air passing the filter. The upper graph runs three years of the filter's life with the change interval you choose; the lower one adds, for every interval from 1 to 36 months, the energy and the elements per year — and finds the cheapest. The dirt model is illustrative: the drop through the fibre bed is taken proportional to the flow, and the dirt adds 0.25 bar at the rated flow after the time set by the dirt level (24, 12 or 5 months) and four times as much after twice that time.

**Try this**
- With average dirt, compare changing every 24 months with the cheapest interval: the late change costs far more in electricity than the elements saved.
- Make the element ¤500: the best interval moves later, but not by much.
- Run the filter at 130 % of its rating, then at 50 % (a filter one size larger): the drop and its cost fall for the element's whole life.
- For coalescers, note the yearly line: even when the pressure drop is low, their efficiency falls with age, so change them at least every 12 months.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const gbox = document.createElement('div');
      gbox.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gbox);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gbox.appendChild(g1); gbox.appendChild(g2);
      let dirty = true, tm = 0, tPlot = 0, ph = 0, R = null;
      const ctl = kit.controls(box.side, [
        { id: 'grade', type: 'select', label: 'Filter', options: [['High-efficiency coalescer, 0.01 µm', 'he'], ['General-purpose coalescer, 1 µm', 'gp'], ['Particulate filter, 1 µm', 'dust']], value: 'he' },
        { id: 'Q', label: 'Air flow through it (free air)', min: 1, max: 100, value: 10, unit: 'm³/min', log: true, sig: 2 },
        { id: 'fr', label: 'Flow as a share of the filter\'s rating', min: 30, max: 130, step: 5, value: 80, unit: '%' },
        { id: 'p', label: 'Line pressure (gauge)', min: 4, max: 10, step: 0.5, value: 7, unit: 'bar' },
        { id: 'dirt', type: 'select', label: 'Dirt in the air', options: [['Clean: after a dryer, new pipes', 24], ['Average', 12], ['Dirty: old steel pipes, rust', 5]], value: 12 },
        { id: 'T', label: 'Element changed every', min: 1, max: 36, step: 1, value: 24, unit: 'months' },
        { id: 'el', label: 'Price of an element', min: 20, max: 600, step: 10, value: 150, unit: '¤' },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' },
        { id: 'h', label: 'Hours a year', min: 1000, max: 8760, step: 10, value: 6000, unit: 'h' },
        { id: 'sp', label: 'Compressor specific power', min: 5, max: 9, step: 0.1, value: 6.5, unit: 'kW per m³/min' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['dp', 'Pressure drop now'], ['kw', 'Extra compressor power now'], ['year', 'Cost per year at your interval'], ['opt', 'Cheapest interval'], ['save', 'Saved by changing at the cheapest interval']]);
      const p1 = kit.plot(g1, { x: { label: 'months in service', min: 0, max: 36 }, y: { label: 'pressure drop (bar)', min: 0 } }, 150);
      const p2 = kit.plot(g2, { x: { label: 'element changed every (months)', min: 1, max: 36 }, y: { label: 'cost per year', min: 0, fmt: v => kit.money(v, 0, true) }, fmtY: v => kit.money(v, 0), legend: true }, 150);
      const V = ctl.values;
      const dpAt = age => Math.min(1.5, V.fr / 100 * (GRADES[V.grade].wet + 0.25 * Math.pow(age / V.dirt, 2)));
      const kwAt = dp => { const pabs = V.p * 1e5 + PATM; return V.sp * V.Q * Math.log(1 + dp * 1e5 / pabs) / Math.log(pabs / PATM); };
      function yearly(T) {
        const n = Math.max(8, Math.round(T * 8));
        let kwh = 0;
        for (let i = 0; i < n; i++) kwh += kwAt(dpAt((i + 0.5) * T / n)) * (T / n) * V.h / 12;
        const energy = kwh * V.price * 12 / T, elements = V.el * 12 / T;
        return { energy, elements, total: energy + elements };
      }
      function update() {
        const pts = [], E = [], El = [], Tot = [];
        for (let t = 0; t <= 36.0001; t += 0.1) pts.push([t, dpAt(t % V.T)]);
        let best = null;
        for (let T = 1; T <= 36.0001; T += 0.5) {
          const y = yearly(T);
          E.push([T, y.energy]); El.push([T, y.elements]); Tot.push([T, y.total]);
          if (!best || y.total < best.total) best = { T, total: y.total };
        }
        const mine = yearly(V.T);
        p1.set({ series: [{ pts, label: 'pressure drop', fill: true }], hlines: [{ y: 0.35, label: 'indicator turns red (typical)' }],
          vlines: GRADES[V.grade].coal ? [{ x: 12, label: 'coalescer: yearly' }] : [] });
        p2.set({ series: [{ pts: E, label: 'energy' }, { pts: El, label: 'elements', dash: [5, 4] }, { pts: Tot, label: 'total', width: 3 }],
          marks: [{ x: V.T, y: mine.total, label: 'yours' }, { x: best.T, y: best.total, label: 'cheapest', color: kit.colors().ok }] });
        ro.set('year', kit.money(mine.total, 0) + ' (energy ' + kit.money(mine.energy, 0) + ', elements ' + kit.money(mine.elements, 0) + ')');
        ro.set('opt', 'every ' + best.T.toFixed(1) + ' months: ' + kit.money(best.total, 0) + ' a year');
        ro.set('save', kit.money(Math.max(0, mine.total - best.total), 0) + ' a year');
        return { best, mine };
      }
      const loop = kit.loop((dt) => {
        if (dirty || !R) { dirty = false; R = update(); }
        tm = (tm + dt * 3) % 36;
        const age = tm % V.T, dp = dpAt(age), kw = kwAt(dp);
        ro.set('dp', dp.toFixed(3) + ' bar (element ' + age.toFixed(1) + ' months old)');
        ro.set('kw', kw.toFixed(2) + ' kW');
        tPlot += dt;
        if (tPlot > 0.12) { tPlot = 0; p1.set({ marks: [{ x: tm, y: dp, label: 'now' }] }); }
        const C = kit.colors(), c = st.begin(), air = S.col('air'), WC = waterCol(kit);
        ph += dt * (15 + 6 * Math.log2(1 + V.Q));
        design(c, st, 760, 300);
        // housing: head, bowl, element
        const dirtF = clamp((dp / Math.max(V.fr / 100, 0.3) - GRADES[V.grade].wet) / 0.9, 0, 1);
        c.fillStyle = C.surface; c.fillRect(100, 78, 160, 160);
        c.fillStyle = C.bg2; c.fillRect(140, 92, 80, 118);
        c.fillStyle = C.dark ? 'rgba(170,120,60,' + (0.1 + 0.6 * dirtF) + ')' : 'rgba(120,80,30,' + (0.08 + 0.55 * dirtF) + ')';
        c.fillRect(140, 92, 80, 118);
        c.fillStyle = C.bg2; c.fillRect(166, 92, 28, 118);
        c.strokeStyle = C.text; c.lineWidth = 2; c.setLineDash([]);
        c.strokeRect(140, 92, 80, 118); c.strokeRect(166, 92, 28, 118);
        c.fillStyle = C.surface; c.fillRect(70, 40, 220, 38); c.strokeRect(70, 40, 220, 38);
        c.beginPath(); if (c.roundRect) c.roundRect(100, 78, 160, 162, [0, 0, 18, 18]); else c.rect(100, 78, 160, 162); c.stroke();
        c.fillStyle = WC; c.globalAlpha = 0.5; c.fillRect(102, 224, 156, 14); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(180, 240); c.lineTo(180, 256); c.stroke();
        S.line(c, [[30, 59], [70, 59]], { state: 'air', width: 3 }); S.line(c, [[290, 59], [330, 59]], { state: 'air', width: 3 });
        S.flow(c, [[30, 59], [180, 59], [180, 180], [238, 150], [248, 78], [248, 59], [330, 59]], ph, { color: air });
        if (GRADES[V.grade].coal) { drops(c, 228, 110, 222, ph * 0.5, 1, WC); drops(c, 132, 120, 222, ph * 0.5 + 7, 1, WC); }
        kit.label(c, 'in', 34, 48, { color: C.muted, size: 11 }); kit.label(c, 'out', 326, 48, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'element: air flows from the core outwards', 180, 270, { color: C.muted, size: 11, align: 'center' });
        // differential pressure gauge, 0–1 bar
        const gx = 440, gy = 130, r = 58, a0 = -225 * Math.PI / 180, span = 270 * Math.PI / 180;
        const arc = (f0, f1, col) => { c.strokeStyle = col; c.lineWidth = 9; c.beginPath(); c.arc(gx, gy, r - 8, a0 + span * f0, a0 + span * f1); c.stroke(); };
        arc(0, 0.35, C.ok); arc(0.35, 0.7, C.warn); arc(0.7, 1, C.bad);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(gx, gy, r, 0, 7); c.stroke();
        const an = a0 + span * clamp(dp, 0, 1);
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + (r - 14) * Math.cos(an), gy + (r - 14) * Math.sin(an)); c.stroke();
        for (const v of [0, 0.5, 1]) { const a = a0 + span * v; kit.label(c, String(v), gx + (r + 12) * Math.cos(a), gy + (r + 12) * Math.sin(a), { color: C.muted, size: 10, align: 'center' }); }
        kit.label(c, 'Δp ' + dp.toFixed(2) + ' bar', gx, gy + 28, { color: dp > 0.7 ? C.bad : dp > 0.35 ? C.warn : C.text, size: 13, weight: 700, align: 'center' });
        kit.label(c, 'differential gauge', gx, gy + r + 26, { color: C.muted, size: 11, align: 'center' });
        // ISO symbol and the clock
        S.line(c, [[560, 70], [597, 70]], { state: 'air' }); S.line(c, [[643, 70], [690, 70]], { state: 'air' });
        S.filter(c, 620, 70, { rot: 90 });
        kit.label(c, 'ISO 1219 filter', 625, 100, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'month ' + tm.toFixed(1) + ' of 36', 625, 140, { color: C.text, size: 13, weight: 700, align: 'center' });
        kit.label(c, 'extra compressor power ' + kw.toFixed(2) + ' kW', 625, 162, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'element changed every ' + V.T + ' months', 625, 180, { color: C.muted, size: 11, align: 'center' });
        if (dp >= 1.49) kit.label(c, 'element at its limit: it may collapse or tear', 625, 200, { color: C.bad, size: 11, weight: 700, align: 'center' });
        // a timeline of three years, coloured by the pressure drop
        const tx0 = 380, tx1 = 740, ty = 262;
        for (let i = 0; i < 72; i++) {
          const t = (i + 0.5) / 2, d = dpAt(t % V.T);
          c.fillStyle = d > 0.7 ? C.bad : d > 0.35 ? C.warn : C.ok;
          c.fillRect(tx0 + (tx1 - tx0) * i / 72, ty - 5, (tx1 - tx0) / 72 + 0.5, 10);
        }
        for (let t = V.T; t < 36; t += V.T) { const x = tx0 + (tx1 - tx0) * t / 36; c.fillStyle = C.text; c.fillRect(x - 1, ty - 10, 2, 20); }
        const xc = tx0 + (tx1 - tx0) * tm / 36;
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(xc, ty - 8); c.lineTo(xc - 6, ty - 18); c.lineTo(xc + 6, ty - 18); c.closePath(); c.fill();
        kit.label(c, '0', tx0, ty + 18, { color: C.muted, size: 10, align: 'center' }); kit.label(c, '36 months', tx1, ty + 18, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'changes marked', (tx0 + tx1) / 2, ty + 18, { color: C.muted, size: 10, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ drains */
  Hyper.sim('treat-drains', {
    title: 'Timed drain or level-sensing drain?',
    blurb: `Two drains under the same separator, fed the same condensate. The **timed drain** (left) opens for a fixed time at fixed intervals: when there is water behind it the water goes out in a moment, and for the rest of the opening it blows compressed air through its orifice — choked flow, 0.0404 × 0.65 × A × p_abs/√T, as for a leak. If the water arrives faster than the openings remove it, the sump fills and water is carried on downstream. The **level-sensing drain** (right) opens when its sensor sees the high level and closes at the low level, before any air can escape. The yearly figures assume the line is pressurised all year, 6.5 kW per m³/min of free air and ¤0.15 per kWh.

**Try this**
- On a dry day (0.5 L/h) the timed drain opens on an almost empty sump every time: nearly all its opening time blows air.
- Stretch its interval to 30 minutes on a wet day (6 L/h): now it floods and water passes on to the dryer, while the level-sensing drain simply opens more often.
- Try the timed settings of 10 s every 2 min — a common "safe" setting — and read the yearly cost.
- Raise the pressure: the air lost grows with the absolute pressure.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gdiv = document.createElement('div');
      gdiv.style.cssText = 'padding:4px 10px 10px';
      box.stage.appendChild(gdiv);
      const ctl = kit.controls(box.side, [
        { id: 'qw', label: 'Condensate arriving', min: 0, max: 20, step: 0.1, value: 2, unit: 'L/h' },
        { id: 'p', label: 'Line pressure (gauge)', min: 3, max: 10, step: 0.5, value: 7, unit: 'bar' },
        { id: 'd', type: 'select', label: 'Drain valve orifice', options: [['2 mm', 2], ['3 mm', 3], ['4 mm', 4]], value: 3 },
        { id: 'ton', label: 'Timed drain: open for', min: 1, max: 20, step: 1, value: 5, unit: 's' },
        { id: 'tc', label: 'Timed drain: every', min: 0.5, max: 30, step: 0.5, value: 5, unit: 'min' },
        { id: 'speed', type: 'select', label: 'Time', options: [['10 × real time', 10], ['60 × — a minute a second', 60], ['300 × — five minutes a second', 300]], value: 60 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again' }] }
      ], (id) => { if (id === 'reset') reset(); });
      const ro = kit.readout(box.side, [['open', 'Air through an open valve'], ['tAir', 'Timed drain: average air lost'], ['tYear', 'Timed drain, per year'], ['tFlood', 'Timed drain: water passed on'], ['lvl', 'Level-sensing drain'], ['sim', 'Simulated so far']]);
      const plot = kit.plot(gdiv, { x: { label: 'time (min)' }, y: { label: 'sump level (%)', min: 0, max: 105 }, legend: true }, 140);
      const V = ctl.values, VS = 0.25;             // litres the sump holds before water is carried on
      let s;
      function reset() { s = { t: 0, T: { lvl: 0.02, air: 0, flood: 0, open: false }, L: { lvl: 0.02, air: 0, flood: 0, open: false, opens: 0 }, hist: [], tH: 0, ph: 0 }; }
      reset();
      const valve = () => {
        const A = Math.PI * Math.pow(V.d / 2000, 2), pabs = V.p * 1e5 + PATM;
        return { air: 0.0404 * 0.65 * A * pabs / Math.sqrt(293.15) / RHO_ANR,        // m³/s of free air
                 liq: 0.65 * A * Math.sqrt(2 * V.p * 1e5 / 1000) * 1000 };          // L/s of water
      };
      function step(h, q) {
        const inflow = V.qw / 3600 * h;
        // timed
        const T = s.T;
        T.open = (s.t % (V.tc * 60)) < V.ton;
        T.lvl += inflow;
        if (T.open) {
          const out = q.liq * h;
          if (T.lvl >= out) T.lvl -= out;
          else { T.air += q.air * h * (1 - T.lvl / out); T.lvl = 0; }
        }
        if (T.lvl > VS) { T.flood += T.lvl - VS; T.lvl = VS; }
        // level-sensing
        const L = s.L;
        L.lvl += inflow;
        if (!L.open && L.lvl >= 0.8 * VS) { L.open = true; L.opens++; }
        if (L.open) { L.lvl = Math.max(0, L.lvl - q.liq * h); if (L.lvl <= 0.1 * VS) L.open = false; }
        if (L.lvl > VS) { L.flood += L.lvl - VS; L.lvl = VS; }
        s.t += h;
      }
      const loop = kit.loop((dt) => {
        const q = valve(), sdt = Math.min(dt, 0.05) * V.speed, n = Math.min(1000, Math.max(1, Math.ceil(sdt / 0.02)));
        for (let i = 0; i < n; i++) step(sdt / n, q);
        s.tH += sdt;
        if (s.tH >= 5) { s.tH = 0; s.hist.push([s.t / 60, 100 * s.T.lvl / VS, 100 * s.L.lvl / VS]); }
        const win = Math.max(20, 4 * V.tc);
        while (s.hist.length && s.hist[0][0] < s.t / 60 - win) s.hist.shift();
        // steady state of the timed drain, per cycle
        const Wc = V.qw / 3600 * V.tc * 60, tWater = Wc / q.liq;
        const airCycle = q.air * Math.max(0, V.ton - tWater), avg = airCycle / (V.tc * 60);           // m³/s
        const floodH = Math.max(0, Wc - q.liq * V.ton) / (V.tc / 60);                               // L/h passed on
        const kwh = avg * 60 * 6.5 * 8760;
        ro.set('open', (q.air * 60000).toFixed(0) + ' L/min of free air');
        ro.set('tAir', (avg * 60000).toFixed(1) + ' L/min (' + (100 * Math.max(0, V.ton - tWater) / V.ton).toFixed(0) + ' % of each opening blows air)');
        ro.set('tYear', (avg * 3600 * 8760).toFixed(0) + ' m³ of free air, ' + kwh.toFixed(0) + ' kWh, ' + kit.money(kwh * 0.15, 0));
        ro.set('tFlood', floodH > 1e-6 ? floodH.toFixed(2) + ' L/h — it floods' : 'none');
        ro.set('lvl', (V.qw > 0 ? (V.qw / (0.7 * VS)).toFixed(1) + ' openings an hour' : 'never opens') + ', no air lost');
        ro.set('sim', (s.t / 3600).toFixed(2) + ' h: timed drain lost ' + (s.T.air * 1000).toFixed(0) + ' L of free air');
        if (s.hist.length > 1) plot.set({ series: [{ pts: s.hist.map(r => [r[0], r[1]]), label: 'timed' }, { pts: s.hist.map(r => [r[0], r[2]]), label: 'level-sensing', dash: [5, 4] }], x: { label: 'time (min)', min: Math.max(0, s.t / 60 - win), max: Math.max(win, s.t / 60) } });
        // ---- drawing
        const C = kit.colors(), c = st.begin(), WC = waterCol(kit), S = kit.fsym;
        s.ph += dt * 40;
        design(c, st, 760, 300);
        const drawSump = (x, d, title, timed) => {
          kit.label(c, title, x, 16, { color: C.text, size: 12, weight: 700, align: 'center' });
          S.line(c, [[x, 28], [x, 60]], { state: 'air' });
          c.fillStyle = C.surface; c.fillRect(x - 55, 60, 110, 140);
          const hw = 136 * d.lvl / VS;
          c.fillStyle = WC; c.globalAlpha = 0.55; c.fillRect(x - 53, 198 - hw, 106, hw); c.globalAlpha = 1;
          drops(c, x, 64, 196 - hw, s.ph, V.qw, WC);
          c.strokeStyle = C.text; c.lineWidth = 2; c.setLineDash([]); c.strokeRect(x - 55, 60, 110, 140);
          if (!timed) for (const [f, lab] of [[0.8, 'high'], [0.1, 'low']]) {
            const y = 198 - 136 * f;
            c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + 55, y); c.lineTo(x + 30, y); c.stroke();
            kit.label(c, lab, x + 60, y, { color: C.warn, size: 10 });
          }
          // the drain valve: a bow-tie, filled when open
          const vy = 222;
          S.line(c, [[x, 200], [x, vy - 8]], {}); S.line(c, [[x, vy + 8], [x, 250]], {});
          c.beginPath(); c.moveTo(x - 10, vy - 8); c.lineTo(x + 10, vy + 8); c.lineTo(x + 10, vy - 8); c.lineTo(x - 10, vy + 8); c.closePath();
          c.fillStyle = d.open ? C.accent : C.bg2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
          c.strokeRect(x + 14, vy - 7, 16, 14);
          kit.label(c, timed ? 'timer' : 'sensor', x + 34, vy, { color: C.muted, size: 10 });
          if (d.open && d.lvl <= 1e-4) {
            for (let k = 0; k < 3; k++) { const a = ((s.ph * 0.03 + k / 3) % 1); c.strokeStyle = S.col('exhaust'); c.globalAlpha = 1 - a; c.lineWidth = 2; c.beginPath(); c.arc(x, 258 + 8 * a, 4 + 14 * a, 0, 7); c.stroke(); c.globalAlpha = 1; }
            kit.label(c, 'blowing compressed air!', x, 288, { color: C.warn, size: 11, weight: 700, align: 'center' });
          } else if (d.open) { drops(c, x, 252, 284, s.ph * 2, 1, WC); kit.label(c, 'draining water', x, 290, { color: WC, size: 11, align: 'center' }); }
          if (d.lvl >= VS - 1e-6 && V.qw > 0) kit.label(c, 'full: water carried on downstream', x, 44, { color: C.bad, size: 11, weight: 700, align: 'center' });
          kit.label(c, 'air lost ' + (d.air * 1000).toFixed(0) + ' L', x - 60, 250, { color: C.muted, size: 11, align: 'right' });
        };
        drawSump(200, s.T, 'Timed: ' + V.ton + ' s every ' + V.tc + ' min', true);
        drawSump(560, s.L, 'Level-sensing (zero air loss)', false);
        kit.label(c, 'separator or receiver above', 380, 40, { color: C.muted, size: 11, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
