/* HYPER-FINANCES · sims/macro.js — simulations for Macroeconomics:
 *   mac-gdp     GDP from its parts, and real against nominal growth
 *   mac-cpi     a price index built from a basket, and whose inflation it is
 *   mac-cycle   a simulated economy: output gap, recessions, unemployment flows
 *   mac-taylor  a Taylor-style rule, and what the rate does to a mortgage, a bond and a flat
 *   mac-debt    public debt dynamics: r − g and the primary balance
 *   mac-fx      an exchange-rate move: prices, exporters, foreign loans and the J-curve
 *   mac-bubble  value and momentum traders, credit and margin calls
 *   mac-hyper   deficits financed by printing, velocity and hyperinflation */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const FONT = '11px system-ui, sans-serif';
  const fin = v => Number.isFinite(v);

  // horizontal gridlines with labels on the left (or right) of a chart area
  function yAxis(c, C, x0, y0, w, h, lo, hi, fmt, right) {
    if (!(hi > lo)) return;
    const step = Hyper.niceStep(hi - lo, Math.max(3, Math.floor(h / 42)));
    c.font = FONT; c.textBaseline = 'middle'; c.textAlign = right ? 'left' : 'right';
    for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) {
      const y = y0 + h - (v - lo) / (hi - lo) * h;
      c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(fmt(Math.abs(v) < step * 1e-9 ? 0 : v), right ? x0 + w + 6 : x0 - 6, y);
    }
  }
  function xLabels(c, C, x0, w, yb, lo, hi, step, fmt) {
    c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = C.muted;
    if (!(hi > lo) || !(step > 0)) return;
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) c.fillText(fmt(v), x0 + (v - lo) / (hi - lo) * w, yb + 4);
  }
  function polyline(c, pts, color, width, dash) {
    const ok = pts.filter(p => fin(p[0]) && fin(p[1]));
    if (ok.length < 2) return;
    c.save(); c.strokeStyle = color; c.lineWidth = width || 2; if (dash) c.setLineDash(dash);
    c.beginPath(); ok.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
  }
  function legend(kit, c, C, items, x, y) {
    let xx = x;
    for (const [col, text, dash] of items) {
      c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.5;
      if (dash) { c.setLineDash(dash); c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + 16, y); c.stroke(); }
      else c.fillRect(xx, y - 5, 12, 10);
      c.restore();
      kit.label(c, text, xx + 20, y, { size: 11.5, color: C.text2 });
      xx += 28 + text.length * 6.2;
    }
  }
  const pctS = (v, d) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(d == null ? 1 : d) + ' %';
  const rateS = v => (v < -0.004 ? '−' : '') + Math.abs(v).toFixed(2) + ' %';
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const pow10 = k => k <= 3 ? String(Math.round(Math.pow(10, k))).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '10' + String(k).split('').map(ch => SUP[ch] || ch).join('');
  // a percentage that may be astronomically large: 0.35 -> "35 %", 8e8 -> "8 × 10¹⁰ %"
  function bigPct(frac) {
    if (!fin(frac)) return 'beyond measure';
    const p = frac * 100;
    if (Math.abs(p) < 1e6) return (p < 0 ? '−' : '') + Hyper.util.group(Math.abs(p), Math.abs(p) < 10 ? 1 : 0) + ' %';
    const e = Math.floor(Math.log10(p)), m = p / Math.pow(10, e);
    return m.toFixed(1) + ' × 10' + String(e).split('').map(ch => SUP[ch] || ch).join('') + ' %';
  }

  /* ================================================================ GDP */
  Hyper.sim('mac-gdp', {
    title: 'GDP from its parts, and real against nominal',
    blurb: `The column adds up **who buys** this year's output — households (C), firms (I), government (G) and foreigners (exports, X) — and takes away **imports** (M), which were made abroad. What is left is GDP. The chart grows that GDP for twenty years and splits the growth into **real** growth and **rising prices**.

- Press **Import cars**: consumption and imports rise together and GDP does not move.
- Set real growth to 0 and inflation to 5 %: nominal GDP still climbs — all of it prices.
- Compare 2 % and 3 % real growth: after twenty years one point a year adds up to a fifth more output.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const bn = v => kit.money(v, 0) + ' bn';
      const D = { C: 1200, I: 400, G: 350, X: 500, M: 450, g: 2.5, p: 3 };
      const ctl = kit.controls(box.side, [
        { id: 'C', label: 'Consumption (C)', min: 0, max: 3000, step: 10, value: D.C, fmt: bn },
        { id: 'I', label: 'Investment (I)', min: 0, max: 1500, step: 10, value: D.I, fmt: bn },
        { id: 'G', label: 'Government purchases (G)', min: 0, max: 1500, step: 10, value: D.G, fmt: bn },
        { id: 'X', label: 'Exports (X)', min: 0, max: 2000, step: 10, value: D.X, fmt: bn },
        { id: 'M', label: 'Imports (M)', min: 0, max: 2000, step: 10, value: D.M, fmt: bn },
        { id: 'g', label: 'Real growth a year', min: -3, max: 8, step: 0.1, value: D.g, unit: '%' },
        { id: 'p', label: 'Inflation (deflator) a year', min: -2, max: 15, step: 0.1, value: D.p, unit: '%' },
        { type: 'buttons', items: [{ id: 'car', label: 'Import cars worth ' + kit.money(50, 0) + ' bn' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'car') {
          const add = Math.min(50, 3000 - V.C, 2000 - V.M);
          if (add > 0) { ctl.set('C', V.C + add); ctl.set('M', V.M + add); }
        } else if (id === 'reset') for (const k of Object.keys(D)) ctl.set(k, D[k]);
        loop.once();
      });
      const ro = kit.readout(box.side, [['gdp', 'GDP'], ['sh', 'Shares C · I · G · NX'], ['nom', 'Nominal GDP in 20 years'], ['real', 'Real GDP in 20 years'], ['defl', 'Deflator in 20 years'], ['pr', 'Nominal growth that is prices']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const Y = V.C + V.I + V.G + V.X - V.M;
        const top = V.C + V.I + V.G + V.X;
        // ---- the column
        const x0 = 64, y0 = 34, h = Hh - y0 - 40, cw = Math.min(110, W * 0.14);
        const maxV = Math.max(top, 400) * 1.08;
        yAxis(c, C, x0, y0, cw + 70, h, 0, maxV, v => kit.money(v, 0, true));
        const Yp = v => y0 + h - v / maxV * h;
        kit.label(c, 'spending, billions', x0, y0 - 18, { size: 11.5, color: C.muted });
        const parts = [['C', V.C, C.accent], ['I', V.I, C.series[2]], ['G', V.G, C.series[5]], ['X', V.X, C.series[1]]];
        let acc = 0;
        const bx = x0 + 12;
        const visTop = top - V.M;     // above this the column is covered by the imports block
        for (const [nm, v, col] of parts) {
          if (v <= 0) continue;
          c.fillStyle = col; c.fillRect(bx, Yp(acc + v), cw, Yp(acc) - Yp(acc + v));
          const vt = Math.min(acc + v, visTop);
          if (Yp(acc) - Yp(vt) > 16) kit.label(c, nm, bx + cw / 2, (Yp(acc) + Yp(vt)) / 2, { size: 12, color: C.bg2, align: 'center', weight: 700 });
          acc += v;
        }
        // imports: a hatched block taken off the top
        if (V.M > 0) {
          const yt = Yp(top), yb = Yp(Math.max(0, top - V.M));
          c.save(); c.fillStyle = C.bg2; c.globalAlpha = 0.72; c.fillRect(bx - 4, yt, cw + 8, yb - yt); c.restore();
          c.save(); c.strokeStyle = C.bad; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.strokeRect(bx - 4, yt, cw + 8, yb - yt); c.restore();
          if (yb - yt > 16) kit.label(c, '− M', bx + cw / 2, (yt + yb) / 2, { size: 12, color: C.bad, align: 'center', weight: 700 });
        }
        if (Y > 0) {
          const yg = Yp(Y);
          c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 8, yg); c.lineTo(bx + cw + 14, yg); c.stroke(); c.restore();
          kit.label(c, 'GDP', bx + cw + 18, yg - 8, { size: 12, color: C.text, weight: 700 });
          kit.label(c, kit.money(Y, 0, true), bx + cw + 18, yg + 8, { size: 11.5, color: C.text2 });
        } else kit.label(c, 'imports exceed all spending', bx - 4, y0 + 10, { size: 11.5, color: C.bad });
        // ---- nominal against real over 20 years
        const rx0 = x0 + cw + 140, rw = W - rx0 - 58;
        const g = V.g / 100, p = V.p / 100, T = 20;
        const Y0 = Math.max(Y, 0);
        const nom = [], real = [];
        for (let t = 0; t <= T; t++) { real.push(Y0 * Math.pow(1 + g, t)); nom.push(Y0 * Math.pow(1 + g, t) * Math.pow(1 + p, t)); }
        if (rw > 80) {
          const hi = Math.max(1, ...nom, ...real) * 1.08, lo = Math.min(0, ...nom, ...real);
          yAxis(c, C, rx0, y0, rw, h, lo, hi, v => kit.money(v, 0, true));
          const X = t => rx0 + t / T * rw, Yq = v => y0 + h - (v - lo) / (hi - lo) * h;
          // the gap between the lines is price rises only
          c.save(); c.fillStyle = C.warn; c.globalAlpha = 0.16; c.beginPath();
          nom.forEach((v, t) => t ? c.lineTo(X(t), Yq(v)) : c.moveTo(X(t), Yq(v)));
          for (let t = T; t >= 0; t--) c.lineTo(X(t), Yq(real[t]));
          c.closePath(); c.fill(); c.restore();
          polyline(c, nom.map((v, t) => [X(t), Yq(v)]), C.warn, 2.4);
          polyline(c, real.map((v, t) => [X(t), Yq(v)]), C.ok, 2.4);
          xLabels(c, C, rx0, rw, y0 + h, 0, T, 5, v => String(v));
          kit.label(c, 'years from now', rx0 + rw / 2, y0 + h + 26, { size: 11.5, color: C.muted, align: 'center' });
          legend(kit, c, C, [[C.warn, 'nominal'], [C.ok, 'real (today\'s prices)']], rx0, y0 - 16);
        }
        if (Y0 > 0) {
          ro.set('nom', kit.money(nom[T], 0) + ' bn');
          ro.set('real', kit.money(real[T], 0) + ' bn (' + pctS((real[T] / Y0 - 1) * 100, 0) + ')');
          ro.set('defl', (100 * Math.pow(1 + p, T)).toFixed(1) + ' (base 100)');
          const nomG = nom[T] / Y0 - 1, realG = real[T] / Y0 - 1;
          ro.set('pr', Math.abs(nomG) > 1e-9 ? kit.pct(clamp((nomG - realG) / nomG, -9, 9), 0) : '—');
        }
        ro.set('gdp', Y > 0 ? kit.money(Y, 0) + ' bn' : 'not possible');
        ro.set('sh', Y > 0 ? [V.C, V.I, V.G, V.X - V.M].map(v => Math.round(v / Y * 100) + '%').join(' · ') : '—');
        if (Y <= 0) { ro.set('nom', '—'); ro.set('real', '—'); ro.set('defl', '—'); ro.set('pr', '—'); }
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ CPI */
  const CATS = ['Food', 'Housing', 'Energy', 'Transport', 'Health', 'Other'];
  const PROFILES = {
    avg: [15, 30, 8, 12, 8, 27],        // an illustrative index basket
    renter: [14, 45, 6, 8, 3, 24],
    retired: [22, 12, 14, 8, 20, 24],
    commuter: [18, 25, 9, 22, 6, 20]
  };
  const SCEN = {
    calm: [2, 3, 1, 2, 3, 1.5],
    energy: [8, 4, 40, 15, 3, 4],
    rent: [2, 9, 0, 1, 3, 1],
    gadgets: [2, 3, -5, 0, 5, -1]
  };
  Hyper.sim('mac-cpi', {
    title: 'Build a price index: whose inflation?',
    blurb: `Each block is one kind of spending: its **width** is its share of the basket, its **height** the price change over the year, so its **area** is its contribution. The dashed line is the weighted average — inflation. The top row is the average household of the index; the bottom row is the household you pick.

- Choose **An energy shock**, then compare the **retired homeowner** and the **young renter**: the same year, very different inflation.
- Choose **A rent boom**: now the renter is hit hardest.
- Stretch **Years at this pace**: a few points of inflation become a large rise in the cost of your month.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'prof', type: 'select', label: 'Your household', options: [['The average household (index weights)', 'avg'], ['A young renter in a city', 'renter'], ['A retired homeowner', 'retired'], ['A family with a long commute', 'commuter']], value: 'renter' },
        { id: 'scen', type: 'select', label: 'The year', options: [['A calm year', 'calm'], ['An energy shock', 'energy'], ['A rent boom', 'rent'], ['Cheaper energy, dearer services', 'gadgets']], value: 'calm' },
        { id: 'en', label: 'Energy prices', min: -40, max: 80, step: 1, value: SCEN.calm[2], unit: '%' },
        { id: 'ho', label: 'Housing costs', min: -10, max: 20, step: 0.5, value: SCEN.calm[1], unit: '%' },
        { id: 'sp', label: 'Your monthly spending', min: 500, max: 10000, step: 50, value: 3000, fmt: v => kit.money(v, 0) },
        { id: 'yrs', label: 'Years at this pace', min: 1, max: 30, step: 1, value: 10 }
      ], id => {
        if (id === 'scen') { ctl.set('en', SCEN[V.scen][2]); ctl.set('ho', SCEN[V.scen][1]); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['idx', 'Index inflation'], ['you', 'Your inflation'], ['core', 'Core (no food, energy)'], ['extra', 'Your year costs more by'], ['later', 'Your month after the years'], ['buy', 'What cash keeps']]);
      const V = ctl.values;

      function changes() { const s = (SCEN[V.scen] || SCEN.calm).slice(); s[1] = V.ho; s[2] = V.en; return s; }
      const avgOf = (w, s) => w.reduce((a, wi, i) => a + wi * s[i], 0) / 100;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const s = changes(), wA = PROFILES.avg, wY = PROFILES[V.prof] || PROFILES.avg;
        const infA = avgOf(wA, s), infY = avgOf(wY, s);
        const coreW = wA.reduce((a, w, i) => a + (i === 0 || i === 2 ? 0 : w), 0);
        const core = wA.reduce((a, w, i) => a + (i === 0 || i === 2 ? 0 : w * s[i]), 0) / coreW;
        const pos = Math.max(5, ...s), neg = Math.max(0, ...s.map(v => -v));
        const x0 = 58, w = W - x0 - 20, R = (Hh - 8) / 2;
        const rows = [[wA, infA, 'The index basket (an average household)'], [wY, infY, 'Your basket']];
        rows.forEach(([wts, inf, title], r) => {
          const top = 4 + r * R;
          const scale = (R - 56) / (pos + neg);
          const base = top + 34 + pos * scale;
          kit.label(c, title, x0, top + 10, { size: 12, color: C.text, weight: 600 });
          // percentage guides
          c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
          const stp = Hyper.niceStep(pos + neg, 4);
          for (let v = -Math.floor(neg / stp) * stp; v <= pos + 1e-9; v += stp) {
            const y = base - v * scale;
            c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
            c.fillStyle = C.muted; c.fillText((v > 0 ? '+' : '') + Math.round(v) + '%', x0 - 6, y);
          }
          let xx = x0;
          wts.forEach((wi, i) => {
            const bw = w * wi / 100, v = s[i];
            const y1 = base - Math.max(v, 0) * scale, hh = Math.abs(v) * scale;
            c.save(); c.fillStyle = C.series[i % C.series.length]; c.globalAlpha = 0.85; c.fillRect(xx + 1, y1, Math.max(0, bw - 2), Math.max(hh, 1)); c.restore();
            if (bw > 34) {
              kit.label(c, CATS[i], xx + bw / 2, v >= 0 ? base + 10 : base - 10, { size: 10.5, color: C.text2, align: 'center' });
              kit.label(c, pctS(v, v % 1 ? 1 : 0), xx + bw / 2, v >= 0 ? y1 - 8 : y1 + hh + 8, { size: 10.5, color: C.muted, align: 'center' });
            }
            xx += bw;
          });
          c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, base); c.lineTo(x0 + w, base); c.stroke();
          const ya = base - inf * scale;
          c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(x0, ya); c.lineTo(x0 + w, ya); c.stroke(); c.restore();
          kit.label(c, 'inflation ' + pctS(inf, 2), x0 + w - 4, ya - 10, { size: 11.5, color: C.text, align: 'right', weight: 600, bg: C.bg2 });
        });
        const n = V.yrs, sp = V.sp;
        ro.set('idx', pctS(infA, 2));
        ro.set('you', pctS(infY, 2) + (Math.abs(infY - infA) >= 0.05 ? ' (' + (infY > infA ? 'above' : 'below') + ' the index)' : ''));
        ro.set('core', pctS(core, 2));
        ro.set('extra', kit.money(sp * 12 * infY / 100, 0));
        ro.set('later', kit.money(sp * Math.pow(1 + infY / 100, n), 0) + ' after ' + n + ' yr');
        ro.set('buy', kit.pct(1 / Math.pow(1 + infY / 100, n), 0) + ' of its value after ' + n + ' yr');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ BUSINESS CYCLE */
  Hyper.sim('mac-cycle', {
    title: 'A simulated economy: booms, recessions and jobs',
    blurb: `Real GDP (solid) swings around **potential output** (dashed), which grows 2 % a year. Grey bands are recessions — here, two or more quarters of falling output. Below, unemployment is not drawn from a formula: every month some workers **lose jobs** and some of the unemployed **find jobs**, at rates that worsen when output is below potential.

- Press **Financial crisis** and watch the order of events: output falls first, unemployment keeps rising after output has turned — it lags.
- Tick **Central bank leans against the cycle**: the swings shrink, and so do the recessions.
- Raise **Momentum of the economy**: shocks echo for longer and booms and busts grow.`,
    mount(box, kit, params) {
      const focus = params && params.focus;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'sig', label: 'Size of random shocks', min: 0, max: 1.2, step: 0.05, value: 0.4, unit: '%' },
        { id: 'rho', label: 'Momentum of the economy', min: 0.5, max: 0.95, step: 0.01, value: 0.85 },
        { id: 'pol', type: 'check', label: 'Central bank leans against the cycle', value: false },
        { id: 'spd', label: 'Speed (quarters a second)', min: 1, max: 12, step: 1, value: focus === 'jobs' ? 3 : 4 },
        { type: 'buttons', items: [{ id: 'crisis', label: 'Financial crisis', primary: true }, { id: 'boom', label: 'Boom' }, { id: 'pause', label: 'Pause / run' }, { id: 'reseed', label: 'New economy' }] }
      ], id => {
        if (id === 'crisis') { push = -0.009; pushDecay = 0.8; }
        else if (id === 'boom') { push = 0.007; pushDecay = 0.75; }
        else if (id === 'pause') running = !running;
        else if (id === 'reseed') { seed++; init(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['q', 'Time'], ['gr', 'Growth (yearly rate)'], ['gap', 'Output gap'], ['u', 'Unemployment'], ['flows', 'Lose · find jobs a month'], ['ustar', 'Unemployment heads to'], ['ph', 'Phase'], ['rec', 'Recessions so far']]);
      const V = ctl.values;
      const OM = 2 * Math.PI / 24, S0 = 0.015, F0 = 0.25, UN = S0 / (S0 + F0), SHOW = 48;
      let seed = 11, g, hist, x1, x2, push, pushDecay, lnYs, lnY, gs, u, neg, q, recs, acc, running = true, crisisDone = false, lastS = S0, lastF = F0;

      function quarter() {
        const r = V.rho - (V.pol ? 0.12 : 0);
        const a1 = 2 * r * Math.cos(OM), a2 = -r * r;
        let x = a1 * x1 + a2 * x2 + V.sig / 100 * g() + push - (V.pol ? 0.1 * x1 : 0);
        push *= pushDecay; if (Math.abs(push) < 1e-5) push = 0;
        x = clamp(x, -0.2, 0.15);
        x2 = x1; x1 = x;
        const prev = lnY;
        lnYs += Math.log(1.005);
        lnY = lnYs + Math.log(1 + x);
        const gq = lnY - prev;
        gs += (x - gs) * 0.3;
        for (let k = 0; k < 3; k++) {
          lastS = S0 * Math.exp(-5 * gs); lastF = clamp(F0 * Math.exp(6 * gs), 0.02, 0.9);
          u = clamp(u + lastS * (1 - u) - lastF * u, 0.005, 0.6);
        }
        q++;
        const h = { q, Y: Math.exp(lnY), Ys: Math.exp(lnYs), u, x, gq, rec: false, mark: '' };
        const last = hist[hist.length - 1];
        if (gq < 0) neg++; else {
          if (neg >= 2 && last) last.mark = 'trough';
          neg = 0;
        }
        if (neg >= 2) {
          h.rec = true;
          if (last) last.rec = true;
          if (neg === 2) { recs++; const pk = hist[hist.length - 2]; if (pk) pk.mark = 'peak'; }
        }
        hist.push(h);
        if (hist.length > 400) hist.shift();
      }
      function init() {
        g = kit.fin.normals(seed);
        hist = []; x1 = 0; x2 = 0; push = 0; pushDecay = 0.8; lnYs = Math.log(100); lnY = lnYs; gs = 0; u = UN; neg = 0; q = -SHOW; recs = 0; acc = 0;
        for (let i = 0; i < SHOW; i++) quarter();
        recs = 0;
      }
      init();

      function draw(dt) {
        if (running && dt > 0) {
          acc += dt * V.spd;
          let n = 0;
          while (acc >= 1 && n < 20) { quarter(); acc -= 1; n++; }
          if (focus === 'recession' && !crisisDone && q >= 8) { push = -0.009; pushDecay = 0.8; crisisDone = true; }
        }
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const view = hist.slice(-SHOW);
        const n = view.length;
        if (n < 2) return;
        const x0 = 58, wTop = W - x0 - 18;
        const topH = focus === 'jobs' ? (Hh - 60) * 0.45 : (Hh - 60) * 0.58, y0 = 28;
        const botY = y0 + topH + 40, botH = Hh - botY - 26;
        const X = i => x0 + i / (SHOW - 1) * wTop;
        // recession bands
        const band = (yA, hA) => {
          c.save(); c.fillStyle = C.muted; c.globalAlpha = 0.16;
          view.forEach((h, i) => { if (h.rec) c.fillRect(X(i) - wTop / (SHOW - 1) / 2, yA, wTop / (SHOW - 1), hA); });
          c.restore();
        };
        // ---- output and potential
        let lo = Infinity, hi = -Infinity;
        for (const h of view) { lo = Math.min(lo, h.Y, h.Ys); hi = Math.max(hi, h.Y, h.Ys); }
        const pad = (hi - lo) * 0.08 + 0.5; lo -= pad; hi += pad;
        band(y0, topH);
        yAxis(c, C, x0, y0, wTop, topH, lo, hi, v => v.toFixed(0));
        const Yp = v => y0 + topH - (v - lo) / (hi - lo) * topH;
        polyline(c, view.map((h, i) => [X(i), Yp(h.Ys)]), C.muted, 1.6, [6, 5]);
        polyline(c, view.map((h, i) => [X(i), Yp(h.Y)]), C.accent, 2.6);
        view.forEach((h, i) => {
          const room = X(i) > x0 + 22 && X(i) < x0 + wTop - 22;
          if (h.mark === 'peak') { kit.dot(c, X(i), Yp(h.Y), 4.5, C.warn, C.bg2); if (room) kit.label(c, 'peak', X(i), Yp(h.Y) - 12, { size: 10.5, color: C.warn, align: 'center' }); }
          if (h.mark === 'trough') { kit.dot(c, X(i), Yp(h.Y), 4.5, C.ok, C.bg2); if (room) kit.label(c, 'trough', X(i), Yp(h.Y) + 13, { size: 10.5, color: C.ok, align: 'center' }); }
        });
        const cur = view[n - 1];
        kit.dot(c, X(n - 1), Yp(cur.Y), 5, C.accent, C.bg2);
        legend(kit, c, C, [[C.accent, 'real GDP (index)', null], [C.muted, 'potential output', [6, 5]]], x0, y0 - 14);
        // ---- unemployment
        const wB = focus === 'jobs' ? wTop * 0.6 : wTop * 0.66;
        const XB = i => x0 + i / (SHOW - 1) * wB;
        let uMax = 0.12; for (const h of view) uMax = Math.max(uMax, h.u + 0.01);
        c.save(); c.fillStyle = C.muted; c.globalAlpha = 0.16;
        view.forEach((h, i) => { if (h.rec) c.fillRect(XB(i) - wB / (SHOW - 1) / 2, botY, wB / (SHOW - 1), botH); });
        c.restore();
        yAxis(c, C, x0, botY, wB, botH, 0, uMax * 100, v => v.toFixed(0) + '%');
        const Up = v => botY + botH - v / uMax * botH;
        polyline(c, [[x0, Up(UN)], [x0 + wB, Up(UN)]], C.muted, 1.4, [5, 5]);
        polyline(c, view.map((h, i) => [XB(i), Up(h.u)]), C.bad, 2.4);
        kit.dot(c, XB(n - 1), Up(cur.u), 4.5, C.bad, C.bg2);
        legend(kit, c, C, [[C.bad, 'unemployment rate', null], [C.muted, 'normal level', [5, 5]]], x0, botY - 14);
        c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = C.muted;
        for (let k = 0; k <= SHOW - 1; k += 8) c.fillText(k === 0 ? 'now' : '−' + (k / 4) + ' yr', X(SHOW - 1 - k), y0 + topH + 4);
        // ---- the bath: flows between employed and unemployed
        const fx = x0 + wB + 26, fw = W - fx - 14;
        if (fw > 200 && botH > 110) {
          const bh = 34, e1 = [fx, botY + 8], u1 = [fx + fw - 88, botY + botH - bh - 4];
          c.save(); c.fillStyle = C.surface || C.bg2; c.strokeStyle = C.border || C.muted; c.lineWidth = 1.2;
          c.fillRect(e1[0], e1[1], 88, bh); c.strokeRect(e1[0], e1[1], 88, bh);
          c.fillRect(u1[0], u1[1], 88, bh); c.strokeRect(u1[0], u1[1], 88, bh); c.restore();
          kit.label(c, 'employed', e1[0] + 44, e1[1] + 11, { size: 11, color: C.text, align: 'center', weight: 600 });
          kit.label(c, kit.pct(1 - cur.u, 1), e1[0] + 44, e1[1] + 25, { size: 11, color: C.text2, align: 'center' });
          kit.label(c, 'unemployed', u1[0] + 44, u1[1] + 11, { size: 11, color: C.text, align: 'center', weight: 600 });
          kit.label(c, kit.pct(cur.u, 1), u1[0] + 44, u1[1] + 25, { size: 11, color: C.bad, align: 'center' });
          const outF = lastS * (1 - cur.u), inF = lastF * cur.u;
          const wOut = clamp(outF * 250, 1.5, 9), wIn = clamp(inF * 250, 1.5, 9);
          kit.arrow(c, e1[0] + 88, e1[1] + bh / 2, u1[0] + 60, u1[1], C.bad, wOut);
          kit.arrow(c, u1[0], u1[1] + bh / 2, e1[0] + 30, e1[1] + bh, C.ok, wIn);
          kit.label(c, 'lose jobs ' + kit.pct(lastS, 1) + '/mo', fx + fw, e1[1] + bh + 10, { size: 10.5, color: C.bad, align: 'right' });
          kit.label(c, 'find jobs ' + kit.pct(lastF, 0) + '/mo', fx, u1[1] + bh - 4, { size: 10.5, color: C.ok });
        }
        // readouts
        const yr = Math.floor((cur.q - 1) / 4) + 1, qq = ((cur.q - 1) % 4 + 4) % 4 + 1;
        ro.set('q', cur.q > 0 ? 'year ' + yr + ', quarter ' + qq : 'history');
        ro.set('gr', pctS((Math.exp(4 * cur.gq) - 1) * 100, 1));
        ro.set('gap', pctS(cur.x * 100, 1));
        ro.set('u', kit.pct(cur.u, 1));
        ro.set('flows', kit.pct(lastS, 2) + ' · ' + kit.pct(lastF, 0));
        ro.set('ustar', kit.pct(lastS / (lastS + lastF), 1));
        ro.set('ph', cur.rec ? 'recession' : cur.gq < 0 ? 'contraction' : cur.x < -0.005 ? 'recovery, below potential' : cur.x > 0.01 ? 'boom, above potential' : 'expansion');
        ro.set('rec', String(recs) + (running ? '' : ' (paused)'));
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ TAYLOR RULE AND TRANSMISSION */
  Hyper.sim('mac-taylor', {
    title: 'From the central bank to your mortgage',
    blurb: `Left: a **Taylor-style rule** builds a policy rate from the neutral real rate, inflation, the gap between inflation and its 2 % target, and the output gap. Right: what that rate reaches — a variable-rate mortgage of ¤250,000 over 25 years, a new fixed-rate mortgage priced off the 10-year yield, a 10-year bond paying 3 %, and a simple discounted value of a flat renting for ¤12,000 a year. Ticks mark each one at a neutral setting.

- Raise **inflation** from 2 % to 6 %: the rate rises by more than inflation (the Taylor principle), and payments, bond and flat move at once.
- Set **Rate rise per point of inflation** below 1: now the real rate falls as inflation rises — policy feeds the fire instead of damping it.
- Set inflation to 1 % and the gap to −4 %: the rule wants a negative rate and the policy rate is stuck at zero. Now lower the **term premium**, as quantitative easing does: long rates, fixed payments and asset values still move.`,
    mount(box, kit, params) {
      const focus = params && params.focus;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const qe = focus === 'qe';
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Inflation', min: -2, max: 12, step: 0.1, value: qe ? 1 : 4, unit: '%' },
        { id: 'x', label: 'Output gap', min: -6, max: 6, step: 0.1, value: qe ? -4 : 1, unit: '%' },
        { id: 'rn', label: 'Neutral real rate r*', min: -1, max: 4, step: 0.1, value: qe ? 0.5 : 1, unit: '%' },
        { id: 'a', label: 'Rate rise per point of inflation', min: 0.5, max: 2.5, step: 0.05, value: 1.5 },
        { id: 'tp', label: 'Term premium (QE pushes it down)', min: -1.5, max: 2.5, step: 0.1, value: 0.5, unit: '%' },
        { id: 'zlb', type: 'check', label: 'The policy rate cannot go below zero', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['rule', 'The rule suggests'], ['rate', 'Policy rate'], ['real', 'Real policy rate'], ['y10', '10-year yield'], ['pay', 'Variable-rate payment'], ['stance', 'Stance']]);
      const V = ctl.values;
      const PT = 2, B = 0.5, MARGIN = 1.5, RISK = 4, RENT = 12000, RG = 0.02;

      function model(pi, gap, rn, a, tp, zlb) {
        const rule = rn + pi + a * (pi - PT) + B * gap;
        const rate = zlb ? Math.max(0, rule) : rule;
        const n = rn + PT;                                   // neutral nominal rate
        const y10 = n + 0.29 * (rate - n) + tp;              // expected short rates plus a term premium
        const vr = Math.max(0.05, rate + MARGIN), fr = Math.max(0.05, y10 + MARGIN);
        const payV = kit.fin.payment(250000, vr / 1200, 300), payF = kit.fin.payment(250000, fr / 1200, 300);
        const bond = kit.fin.bond({ face: 100, coupon: 0.03, ytm: y10 / 100, years: 10, freq: 1 }).price;
        const k = Math.max(y10 / 100 + RISK / 100, RG + 0.01);
        const flat = RENT * (1 + RG) / (k - RG);
        return { rule, rate, y10, payV, payF, bond, flat, real: ((1 + rate / 100) / (1 + pi / 100) - 1) * 100, n };
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const m = model(V.p, V.x, V.rn, V.a - 1, V.tp, V.zlb);
        const ref = model(PT, 0, V.rn, V.a - 1, 0.5, V.zlb);
        // ---- the rule as a waterfall
        const steps = [['r*', V.rn], ['π', V.p], ['a(π−2)', (V.a - 1) * (V.p - PT)], ['½ gap', B * V.x]];
        let cum = 0; const cols = [];
        for (const [lab, v] of steps) { cols.push({ lab, from: cum, to: cum + v }); cum += v; }
        cols.push({ lab: 'rule', from: 0, to: m.rule, total: true });
        cols.push({ lab: 'policy', from: 0, to: m.rate, total: true, pol: true });
        let lo = 0, hi = 1;
        for (const k of cols) { lo = Math.min(lo, k.from, k.to); hi = Math.max(hi, k.from, k.to); }
        lo = Math.floor(lo - 0.5); hi = Math.ceil(hi + 0.5);
        const x0 = 46, y0 = 34, lw = W < 540 ? W - 46 - 20 : Math.min(W * 0.42, 330), h = Hh - y0 - 44;
        yAxis(c, C, x0, y0, lw, h, lo, hi, v => v.toFixed(0) + '%');
        const Yp = v => y0 + h - (v - lo) / (hi - lo) * h;
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, Yp(0)); c.lineTo(x0 + lw, Yp(0)); c.stroke();
        const cw = lw / cols.length;
        cols.forEach((k, i) => {
          const bx = x0 + i * cw + cw * 0.14, bw = cw * 0.72;
          const ya = Yp(Math.max(k.from, k.to)), yb = Yp(Math.min(k.from, k.to));
          c.fillStyle = k.pol ? C.ok : k.total ? C.warn : k.to >= k.from ? C.accent : C.bad;
          c.fillRect(bx, ya, bw, Math.max(1.5, yb - ya));
          kit.label(c, k.lab, bx + bw / 2, y0 + h + 12, { size: cw < 48 ? 9 : 10.5, color: C.text2, align: 'center' });
          const val = k.total ? k.to : k.to - k.from;
          kit.label(c, (val < 0 ? '−' : '') + Math.abs(val).toFixed(1), bx + bw / 2, (k.to >= k.from ? ya - 9 : yb + 9), { size: cw < 48 ? 9 : 10.5, color: C.muted, align: 'center' });
        });
        kit.label(c, 'building the policy rate (per cent)', x0, y0 - 18, { size: 11.5, color: C.muted });
        if (V.zlb && m.rule < 0) kit.label(c, 'the rule wants ' + rateS(m.rule) + ', but the rate stops at zero', x0, y0 + h + 30, { size: 11, color: C.bad });
        // ---- what the rate reaches
        const rx = x0 + lw + 40, rw = W - rx - 24;
        if (rw > 120) {
          const rows = [
            ['Variable-rate payment', m.payV, ref.payV, v => kit.money(v, 0) + '/mo', false],
            ['New fixed-rate payment', m.payF, ref.payF, v => kit.money(v, 0) + '/mo', false],
            ['10-year bond (3 % coupon)', m.bond, ref.bond, v => v.toFixed(1), true],
            ['Model value of the flat', m.flat, ref.flat, v => kit.money(v, 0, true), true]
          ];
          const rh = (Hh - y0 - 20) / rows.length;
          kit.label(c, 'where it reaches (tick = neutral)', rx, y0 - 18, { size: 11.5, color: C.muted });
          rows.forEach(([lab, v, r0, f, good], i) => {
            const top = y0 + i * rh;
            const max = Math.max(v, r0) * 1.35;
            const bw = v / max * rw, tw = r0 / max * rw;
            kit.label(c, lab, rx, top + 8, { size: 11.5, color: C.text, weight: 600 });
            c.fillStyle = C.bg2; c.fillRect(rx, top + 18, rw, 16);
            c.fillStyle = (v > r0) === good ? C.ok : Math.abs(v - r0) / (r0 || 1) < 0.005 ? C.accent : C.bad;
            c.fillRect(rx, top + 18, Math.max(1, bw), 16);
            c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(rx + tw, top + 14); c.lineTo(rx + tw, top + 38); c.stroke();
            const chg = r0 ? (v / r0 - 1) * 100 : 0;
            kit.label(c, f(v) + '  (' + pctS(chg, 1) + ')', rx + Math.min(bw, rw - 150) + 6, top + 26, { size: 11, color: C.text2 });
          });
        }
        ro.set('rule', rateS(m.rule));
        ro.set('rate', rateS(m.rate));
        ro.set('real', rateS(m.real));
        ro.set('y10', rateS(m.y10));
        ro.set('pay', kit.money(m.payV) + ' (' + (m.payV >= ref.payV ? '+' : '−') + kit.money(Math.abs(m.payV - ref.payV)) + ')');
        const gapN = m.rate - m.n;
        ro.set('stance', Math.abs(gapN) < 0.25 ? 'neutral' : gapN > 0 ? 'tight (' + gapN.toFixed(1) + ' points above neutral)' : 'loose (' + (-gapN).toFixed(1) + ' points below neutral)');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ PUBLIC DEBT */
  Hyper.sim('mac-debt', {
    title: 'Public debt: the r − g snowball',
    blurb: `The line is government debt as a share of GDP, year by year: $d_{t+1} = d_t(1 + r)/(1 + g) - s$. The dashed line is the same path with a **balanced primary budget** ($s = 0$), and the bars at the bottom are the interest bill as a share of GDP.

- Set the interest rate above growth: with a balanced primary budget debt still climbs. Set it below: debt melts even with a small deficit.
- Tick **A recession in year 5**: two bad years leave a step that the arithmetic then carries forward.
- Tick **Lenders charge more as debt rises** and start at 150 %: past a point, higher debt raises the rate, which raises the debt — a sovereign-debt spiral.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'd0', label: 'Debt today (share of GDP)', min: 0, max: 250, step: 1, value: 90, unit: '%' },
        { id: 'r', label: 'Interest rate on the debt', min: 0, max: 10, step: 0.1, value: 4, unit: '%' },
        { id: 'g', label: 'Nominal GDP growth', min: -2, max: 10, step: 0.1, value: 3.5, unit: '%' },
        { id: 's', label: 'Primary balance (surplus +)', min: -6, max: 6, step: 0.1, value: -1, unit: '% of GDP' },
        { id: 'T', label: 'Years ahead', min: 5, max: 50, step: 1, value: 30 },
        { id: 'rec', type: 'check', label: 'A recession in year 5', value: false },
        { id: 'prem', type: 'check', label: 'Lenders charge more as debt rises', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['end', 'Debt at the end'], ['need', 'Surplus to hold today\'s ratio'], ['rg', 'r − g'], ['int', 'Interest bill, last year'], ['def', 'Overall balance, last year'], ['dir', 'On its own the ratio']]);
      const V = ctl.values;

      function path(sFix) {
        const T = Math.round(V.T), out = [{ t: 0, d: V.d0, int: 0, r: V.r }];
        let d = V.d0;
        for (let t = 1; t <= T; t++) {
          let g = V.g / 100, s = (sFix == null ? V.s : sFix) / 100;
          if (V.rec && (t === 5 || t === 6)) { g = -0.03; s -= 0.04; }
          let r = V.r / 100;
          if (V.prem) r += 0.0003 * Math.max(0, d - 100);
          r = Math.min(r, 0.3);
          const int = r * d / (1 + g);
          d = clamp(d * (1 + r) / (1 + g) - s * 100, -200, 5000);
          out.push({ t, d, int, r: r * 100, ob: (s * 100 - int) });
        }
        return out;
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const a = path(null), b = path(0), T = a.length - 1;
        const x0 = 58, y0 = 30, w = W - x0 - 24, hAll = Hh - y0 - 40, h = hAll * 0.74, bh = hAll * 0.2;
        let hi = 50, lo = 0;
        for (const p of a.concat(b)) { hi = Math.max(hi, p.d); lo = Math.min(lo, p.d); }
        hi = Math.min(hi * 1.08, 400); lo = Math.max(lo, -100);
        yAxis(c, C, x0, y0, w, h, lo, hi, v => v.toFixed(0) + '%');
        const X = t => x0 + t / T * w, Yp = v => y0 + h - (clamp(v, lo, hi) - lo) / (hi - lo) * h;
        if (V.rec && T >= 6) { c.save(); c.fillStyle = C.muted; c.globalAlpha = 0.16; c.fillRect(X(4), y0, X(6) - X(4), h); c.restore(); kit.label(c, 'recession', (X(4) + X(6)) / 2, y0 + 10, { size: 10.5, color: C.muted, align: 'center' }); }
        polyline(c, [[x0, Yp(V.d0)], [x0 + w, Yp(V.d0)]], C.faint || C.muted, 1.2, [3, 5]);
        polyline(c, b.map(p => [X(p.t), Yp(p.d)]), C.muted, 1.8, [7, 5]);
        polyline(c, a.map(p => [X(p.t), Yp(p.d)]), C.accent, 2.8);
        const endP = a[T];
        kit.dot(c, X(T), Yp(endP.d), 5, C.accent, C.bg2);
        if (endP.d > hi) kit.label(c, 'off the chart: ' + endP.d.toFixed(0) + ' %', X(T) - 4, y0 + 10, { size: 11, color: C.bad, align: 'right' });
        legend(kit, c, C, [[C.accent, 'debt ÷ GDP'], [C.muted, 'with a balanced primary budget', [7, 5]]], x0, y0 - 14);
        // interest bill bars
        const by = y0 + h + 30, maxI = Math.max(2, ...a.map(p => p.int)) * 1.1;
        kit.label(c, 'interest bill, % of GDP', x0, by - 8, { size: 10.5, color: C.muted });
        a.forEach(p => {
          if (p.t === 0) return;
          const bhh = p.int / maxI * bh, bw = Math.max(1, w / T * 0.7);
          c.fillStyle = C.warn; c.fillRect(X(p.t) - bw / 2, by + bh - bhh, bw, bhh);
        });
        kit.label(c, endP.int.toFixed(1) + '%', X(T), by + bh - (endP.int / maxI * bh) - 8, { size: 10.5, color: C.warn, align: 'right' });
        { const stp = T > 30 ? 10 : 5; c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = C.muted; for (let v = stp; v <= T; v += stp) c.fillText('yr ' + v, X(v), y0 + h + 4); }
        // readouts
        const r = V.r / 100, g = V.g / 100;
        ro.set('end', endP.d > 400 ? 'over 400 % of GDP: a debt spiral' : endP.d.toFixed(1) + ' % of GDP (' + pctS(endP.d - V.d0, 1).replace('%', 'points') + ')');
        const need = V.d0 * (r - g) / (1 + g);
        ro.set('need', (need >= 0 ? 'a surplus of ' : 'a deficit of up to ') + Math.abs(need).toFixed(2) + ' % of GDP');
        ro.set('rg', ((r - g) * 100).toFixed(1) + ' points');
        ro.set('int', endP.d > 400 ? 'more than any tax base can carry' : endP.int.toFixed(1) + ' % of GDP' + (endP.r > V.r + 0.05 ? ' (rate now ' + endP.r.toFixed(1) + ' %)' : ''));
        ro.set('def', endP.d > 400 ? 'out of control' : (endP.ob >= 0 ? 'surplus ' : 'deficit ') + Math.abs(endP.ob).toFixed(1) + ' % of GDP');
        ro.set('dir', Math.abs(r - g) < 1e-9 ? 'stays where it is' : r > g ? 'snowballs up (r > g)' : 'melts down (g > r)');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ EXCHANGE RATES AND THE J-CURVE */
  Hyper.sim('mac-fx', {
    title: 'When the currency moves',
    blurb: `The rate starts at 3.50 home units per foreign unit; move it. Left: four people it reaches at once — an importer buying a machine priced at 10,000 foreign units, the consumer price index, an exporter selling at 50 foreign units with costs of ¤150 a unit, and a family paying 500 foreign units a month on a foreign-currency loan. Right: the **trade balance** in the three years after the move, with exports and imports starting at ¤100 bn a year each.

- With foreign currency 15 % dearer, the exporter's margin more than doubles, the loan payment rises by the same 15 %, and prices creep up with the pass-through.
- Watch the trade balance **dip before it rises** — the J-curve — as volumes slowly respond to the new prices.
- Lower **How strongly trade responds** below 1: the balance never recovers (the Marshall–Lerner condition fails).`,
    mount(box, kit, params) {
      const focus = params && params.focus;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'ch', label: 'Foreign currency becomes dearer by', min: -30, max: 50, step: 1, value: focus === 'trade' ? 20 : 15, unit: '%' },
        { id: 'pt', label: 'Pass-through to import prices', min: 0, max: 100, step: 5, value: 50, unit: '%' },
        { id: 'w', label: 'Imports in the consumer basket', min: 0, max: 60, step: 1, value: 30, unit: '%' },
        { id: 'el', label: 'How strongly trade responds', min: 0.2, max: 3, step: 0.1, value: 1.4 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play the next three years', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], id => {
        if (id === 'play') { tm = 0; playing = true; }
        else if (id === 'pause') playing = !playing;
        else if (id === 'ch') { tm = 0; playing = true; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['rate', 'Exchange rate'], ['mach', 'Imported machine'], ['cpi', 'Consumer prices'], ['exp', 'Exporter\'s margin a unit'], ['loan', 'Loan payment a month'], ['tb3', 'Trade balance, 3 months on'], ['tb36', 'Trade balance, 3 years on'], ['ml', 'Trade responds enough?']]);
      const V = ctl.values;
      const S0 = 3.5;
      let tm = 0, playing = true;

      function trade(t) {
        const s = 1 + V.ch / 100, pm = 1 + V.pt / 100 * (s - 1);
        const a = 1 - Math.exp(-t / 9);
        const ex = V.el * 0.55, em = V.el * 0.45;
        const X = 100 * Math.pow(s, ex * a);                        // exports priced at home: volumes respond
        const M = 100 * pm * Math.pow(pm, -em * a);                 // imports: dearer at once, volumes respond slowly
        return { X, M, TB: X - M };
      }

      function draw(dt) {
        if (playing && dt > 0) { tm += dt * 6; if (tm >= 36) { tm = 36; playing = false; } }
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const S1 = S0 * (1 + V.ch / 100);
        // ---- four people, before and after
        const x0 = 16, y0 = 26, lw = W < 600 ? W - 40 : Math.min(W * 0.46, 360), rows = [
          ['Imported machine (10,000 units)', S0 * 10000, S1 * 10000, v => kit.money(v, 0), false],
          ['Exporter\'s margin per unit', 50 * S0 - 150, 50 * S1 - 150, v => kit.money(v, 2), true],
          ['Foreign-loan payment a month', 500 * S0, 500 * S1, v => kit.money(v, 0), false]
        ];
        const rh = (Hh - y0 - 70) / rows.length;
        kit.label(c, 'before (grey) and after the move', x0, y0 - 12, { size: 11.5, color: C.muted });
        rows.forEach(([lab, b, a, f, good], i) => {
          const top = y0 + i * rh;
          const max = Math.max(Math.abs(b), Math.abs(a), 1) * 1.45;
          const bar = (v, y, col) => { const len = Math.abs(v) / max * (lw - 20); c.fillStyle = v < 0 ? C.bad : col; c.fillRect(x0, y, Math.max(1, len), 12); return len; };
          kit.label(c, lab, x0, top + 8, { size: 11.5, color: C.text, weight: 600 });
          const l1 = bar(b, top + 18, C.muted);
          kit.label(c, f(b), x0 + l1 + 6, top + 24, { size: 10.5, color: C.muted });
          const better = good ? a >= b : a <= b;
          const l2 = bar(a, top + 34, Math.abs(a - b) < 1e-9 ? C.accent : better ? C.ok : C.warn);
          kit.label(c, f(a) + (b ? '  ' + pctS((a / b - 1) * 100, 1) : ''), x0 + l2 + 6, top + 40, { size: 10.5, color: C.text2 });
        });
        const dCPI = V.w / 100 * V.pt / 100 * V.ch;
        kit.label(c, 'Consumer prices: ' + pctS(dCPI, 2) + ' (first round)', x0, Hh - 40, { size: 12, color: dCPI > 0 ? C.warn : dCPI < 0 ? C.ok : C.text, weight: 600 });
        kit.label(c, V.ch > 0 ? 'home currency: ' + (100 - 100 / (1 + V.ch / 100)).toFixed(1) + ' % less in foreign money' : V.ch < 0 ? 'the home currency strengthened' : 'no change', x0, Hh - 20, { size: 11, color: C.muted });
        // ---- the J-curve
        const rx = x0 + lw + 64, rw = W - rx - 20, ph = Hh - y0 - 50;
        if (rw > 180) {
          const pts = [];
          let lo = -5, hi = 5;
          for (let t = 0; t <= 36; t += 0.5) { const v = trade(t).TB; pts.push([t, v]); lo = Math.min(lo, v); hi = Math.max(hi, v); }
          const pad = (hi - lo) * 0.15; lo -= pad; hi += pad;
          yAxis(c, C, rx, y0, rw, ph, lo, hi, v => kit.money(v, 0, true) + 'bn');
          const X = t => rx + t / 36 * rw, Yp = v => y0 + ph - (v - lo) / (hi - lo) * ph;
          c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(rx, Yp(0)); c.lineTo(rx + rw, Yp(0)); c.stroke();
          polyline(c, pts.map(p => [X(p[0]), Yp(p[1])]), C.faint || C.muted, 1.4, [4, 4]);
          const done = pts.filter(p => p[0] <= tm + 1e-9);
          if (done.length > 1) {
            c.save(); c.globalAlpha = 0.22;
            for (let i = 1; i < done.length; i++) {
              const [ta, va] = done[i - 1], [tb, vb] = done[i];
              c.fillStyle = (va + vb) / 2 >= 0 ? C.ok : C.bad;
              c.beginPath(); c.moveTo(X(ta), Yp(0)); c.lineTo(X(ta), Yp(va)); c.lineTo(X(tb), Yp(vb)); c.lineTo(X(tb), Yp(0)); c.closePath(); c.fill();
            }
            c.restore();
            polyline(c, done.map(p => [X(p[0]), Yp(p[1])]), C.accent, 2.6);
          }
          const now = trade(tm);
          kit.dot(c, X(tm), Yp(now.TB), 5, C.accent, C.bg2);
          xLabels(c, C, rx, rw, y0 + ph, 0, 36, 6, v => v + ' mo');
          kit.label(c, 'trade balance, billions a year', rx, y0 - 12, { size: 11.5, color: C.muted });
        }
        const t3 = trade(3).TB, t36 = trade(36).TB;
        ro.set('rate', S1.toFixed(3) + ' per foreign unit (was 3.500)');
        ro.set('mach', kit.money(S1 * 10000, 0) + ' (' + pctS(V.ch, 0) + ')');
        ro.set('cpi', pctS(dCPI, 2));
        ro.set('exp', kit.money(50 * S1 - 150, 2) + ' (was ' + kit.money(50 * S0 - 150, 2) + ')');
        ro.set('loan', kit.money(500 * S1, 0) + ' (was ' + kit.money(500 * S0, 0) + ')');
        ro.set('tb3', kit.money(t3, 1) + ' bn');
        ro.set('tb36', kit.money(t36, 1) + ' bn');
        ro.set('ml', V.el > 1 ? 'yes: responses add to ' + V.el.toFixed(1) + ' > 1' : 'no: responses add to ' + V.el.toFixed(1) + ' ≤ 1');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ BUBBLES */
  Hyper.sim('mac-bubble', {
    title: 'A market with value buyers, momentum buyers and credit',
    blurb: `The dashed line is the asset's **value** — what its income is worth — which drifts with news. The solid line is the **price**, set week by week by two kinds of trader: **value buyers**, who buy below value and sell above it, and **momentum buyers**, who buy what has been rising. With **credit**, momentum buyers borrow to buy more on the way up — and when the price falls well below its peak, lenders force them to sell (red marks: margin calls). The scale is logarithmic: equal distances are equal percentage moves.

- Start with few momentum buyers: the price hugs its value.
- Raise **Momentum buyers** past about half: booms and busts appear on their own, with no change in value.
- Add **credit**: the booms go higher, and the falls turn into crashes as forced selling feeds on itself.
- Press **A new-era story** in a calm market: a good story alone can start a boom.`,
    mount(box, kit, params) {
      const focus = params && params.focus;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'w', label: 'Momentum buyers (share of trading)', min: 0, max: 80, step: 1, value: focus === 'credit' ? 55 : 30, unit: '%' },
        { id: 'L', label: 'Credit: momentum buyers\' leverage', min: 1, max: 4, step: 0.1, value: focus === 'credit' ? 2.5 : 1, fmt: v => v.toFixed(1) + ' ×' },
        { id: 'spd', label: 'Speed (weeks a second)', min: 2, max: 40, step: 1, value: 14 },
        { type: 'buttons', items: [{ id: 'story', label: 'A new-era story', primary: true }, { id: 'pause', label: 'Pause / run' }, { id: 'new', label: 'New market' }] }
      ], id => {
        if (id === 'story') hype = 1;
        else if (id === 'pause') running = !running;
        else if (id === 'new') { seed++; init(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['t', 'Time'], ['pv', 'Price ÷ value'], ['boom', 'Largest overvaluation'], ['dd', 'Deepest fall from a peak'], ['mc', 'Weeks of forced selling'], ['now', 'This week']]);
      const V = ctl.values;
      const CV = 0.02, CM = 0.012, SM = 0.004, A = 0.1, DRIFT = 0.0008, SHOW = 520;
      let seed = 5, g, f, p, m, pk, hype, debt, wk, hist, maxOver, maxDD, forcedWeeks, acc, running = true, flow = { v: 0, m: 0, cr: 0, fs: 0 };

      function init() {
        g = kit.fin.normals(seed);
        f = 0; p = 0; m = 0; pk = 0; hype = 0; debt = 0; wk = 0; hist = []; maxOver = 0; maxDD = 0; forcedWeeks = 0; acc = 0;
      }
      function week() {
        const w = V.w / 100, L = V.L;
        f += DRIFT + 0.01 * g();
        const dev = clamp(p - f, -6, 6);
        const Dv = -CV * Math.sinh(dev);
        const Dm = CM * Math.tanh((m + 0.006 * hype) / SM);
        hype *= 0.985; if (hype < 1e-3) hype = 0;
        let credit = 0, forced = 0;
        if (Dm > 0 && L > 1) { credit = Dm * (L - 1) * 0.6; debt += credit; }
        if (debt > 0 && pk - p > 0.25 / L) { forced = Math.min(debt, 0.01 * (L - 1) + 0.15 * debt); debt -= forced; forcedWeeks++; }
        debt *= 0.995;
        const r = DRIFT + (1 - w) * Dv + w * (Dm + credit - forced) + 0.01 * g();
        p = clamp(p + r, f - 6, f + 6);
        m = (1 - A) * m + A * r;
        pk = Math.max(pk - 0.002, p);
        wk++;
        maxOver = Math.max(maxOver, Math.exp(p - f) - 1);
        maxDD = Math.max(maxDD, 1 - Math.exp(p - pk));
        flow = { v: (1 - w) * Dv, m: w * Dm, cr: w * credit, fs: -w * forced };
        hist.push({ p, f, forced: forced > 0 });
        if (hist.length > SHOW) hist.shift();
      }
      init();
      for (let i = 0; i < 26; i++) week();

      function draw(dt) {
        if (running && dt > 0) { acc += dt * V.spd; let n = 0; while (acc >= 1 && n < 60) { week(); acc -= 1; n++; } }
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const n = hist.length;
        if (n < 2) return;
        const x0 = 58, y0 = 28, w = W - x0 - 20, h = (Hh - y0 - 40) * 0.66;
        let lo = Infinity, hi = -Infinity;
        for (const q of hist) { lo = Math.min(lo, q.p, q.f); hi = Math.max(hi, q.p, q.f); }
        lo -= 0.1; hi += 0.1;
        // log scale: gridlines at nice price levels relative to the start (1 = starting value)
        const L10 = Math.LN10, lo10 = lo / L10, hi10 = hi / L10;
        const Yp = v => y0 + h - (v / L10 - lo10) / (hi10 - lo10) * h;
        c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
        const marks = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
        const span = hi10 - lo10;
        for (const mk of marks) {
          const l = Math.log10(mk);
          if (l < lo10 || l > hi10) continue;
          if (span > 1.6 && [0.2, 2, 20, 200].includes(mk)) continue;
          const y = y0 + h - (l - lo10) / span * h;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
          c.fillStyle = C.muted; c.fillText(String(mk), x0 - 6, y);
        }
        const X = i => x0 + (SHOW - n + i) / (SHOW - 1) * w;
        polyline(c, hist.map((q, i) => [X(i), Yp(q.f)]), C.muted, 1.8, [6, 5]);
        polyline(c, hist.map((q, i) => [X(i), Yp(q.p)]), C.accent, 2.4);
        hist.forEach((q, i) => { if (q.forced) { c.fillStyle = C.bad; c.fillRect(X(i) - 1, y0 + h - 6, 2.5, 6); } });
        const cur = hist[n - 1];
        kit.dot(c, X(n - 1), Yp(cur.p), 4.5, C.accent, C.bg2);
        legend(kit, c, C, [[C.accent, 'price'], [C.muted, 'value', [6, 5]], [C.bad, 'margin calls']], x0, y0 - 14);
        const yrs = wk / 52;
        c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let k = Math.ceil(Math.max(0, yrs - SHOW / 52)); k <= Math.floor(yrs); k++) {
          const i = n - 1 - (wk - k * 52);
          if (i >= 0) c.fillText('yr ' + k, X(i), y0 + h + 4);
        }
        // ---- this week's orders
        const by = y0 + h + 34, bh = Hh - by - 8, cx = x0 + w / 2, half = w / 2 - 110;
        const rowsB = [['value buyers', flow.v, C.series[2]], ['momentum buyers', flow.m, C.series[1]], ['bought on credit', flow.cr, C.warn], ['forced selling', flow.fs, C.bad]];
        const rh = bh / rowsB.length, sc = half / 0.03;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, by - 4); c.lineTo(cx, by + bh); c.stroke();
        kit.label(c, '← selling · this week · buying →', cx, by - 12, { size: 10.5, color: C.muted, align: 'center' });
        rowsB.forEach(([lab, v, col], i) => {
          const y = by + i * rh + 2, len = clamp(v * sc, -half, half);
          c.fillStyle = col; c.fillRect(Math.min(cx, cx + len), y, Math.abs(len), Math.max(4, rh - 5));
          kit.label(c, lab, x0, y + rh / 2 - 1, { size: 10.5, color: C.text2 });
        });
        ro.set('t', 'year ' + yrs.toFixed(1) + (running ? '' : ' (paused)'));
        ro.set('pv', Math.exp(cur.p - cur.f).toFixed(2) + (Math.exp(cur.p - cur.f) > 1.5 ? ' — a bubble' : Math.exp(cur.p - cur.f) < 0.7 ? ' — a slump' : ''));
        ro.set('boom', '+' + Math.round(maxOver * 100) + ' % above value');
        ro.set('dd', '−' + Math.round(maxDD * 100) + ' %');
        ro.set('mc', String(forcedWeeks));
        const tot = flow.v + flow.m + flow.cr + flow.fs;
        ro.set('now', flow.fs < 0 ? 'forced selling' : hype > 0.05 ? 'a new-era story is spreading' : tot > 0.004 ? 'buyers dominate' : tot < -0.004 ? 'sellers dominate' : 'balanced');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ HYPERINFLATION */
  Hyper.sim('mac-hyper', {
    title: 'Printing to pay the bills: how hyperinflation runs away',
    blurb: `A government covers part of its budget each month by having the central bank create money. People hold less money the more inflation they expect, so as inflation rises the money is spent faster (**velocity** rises) and each new batch of money pushes prices up **more**. The top chart is the price level on a logarithmic scale; the bars are inflation each month, against the 50 %-a-month line of hyperinflation.

- With a deficit of 2–4 % of GDP, inflation settles at a high but steady rate.
- Push the deficit above about 9 % of GDP: no rate of inflation can raise that much, and the spiral runs away until the currency is abandoned.
- Try **Price freeze** without closing the deficit: prices pause, money piles up, and prices jump when the freeze ends.
- Press **Stabilise**: close the deficit and stop the printing, and inflation stops almost at once — as in Germany in 1923 and Israel in 1985.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Deficit covered by printing', min: 0, max: 15, step: 0.5, value: 4, unit: '% of GDP' },
        { id: 'spd', label: 'Speed (months a second)', min: 1, max: 8, step: 1, value: 3 },
        { type: 'buttons', items: [{ id: 'stab', label: 'Stabilise: close the deficit', primary: true }, { id: 'freeze', label: 'Price freeze (4 months)' }, { id: 'restart', label: 'Start again' }] }
      ], id => {
        if (id === 'stab') {
          ctl.set('d', 0);
          pe *= 0.15;
          if (collapsed) { newCur = Math.max(0, Math.floor((lnP - lnP0) / Math.LN10)); lnP0 = lnP; lnM = lnP + Math.log(M0); pe = 0; collapsed = false; }
          stabilised = true; freeze = 0;
        } else if (id === 'freeze') { if (!collapsed) freeze = 4; }
        else if (id === 'restart') init();
        loop.once();
      });
      const ro = kit.readout(box.side, [['mo', 'Month'], ['pi', 'Inflation this month'], ['yr', 'At this pace, a year'], ['dbl', 'Prices double every'], ['vel', 'Velocity (spent a year)'], ['bal', 'Money people hold'], ['tax', 'Lost by holding cash, a month'], ['st', 'Status']]);
      const V = ctl.values;
      const M0 = 1.5, ALPHA = 5, LAM = 0.15, SHOW = 120;
      let t, pe, lnM, lnP, lnP0, hist, acc, freeze, collapsed, stabilised, newCur, running = true;

      function init() {
        t = 0; pe = 0; lnM = Math.log(M0); lnP = 0; lnP0 = 0; hist = [{ t: 0, lp: 0, pi: 0, m: M0 }]; acc = 0; freeze = 0; collapsed = false; stabilised = false; newCur = 0;
      }
      init();

      function month() {
        if (collapsed) return;
        const d = V.d / 100;
        if (d > 0) stabilised = false;
        const md = M0 * Math.exp(-ALPHA * pe);
        const before = lnP;
        if (freeze > 0) {
          lnP += Math.log(1.01);
          lnM += Math.log(1 + d * Math.exp(lnP - lnM));
          freeze--;
        } else if (d > 0 && md <= d * 1.05) {
          collapsed = true;
          lnP += Math.log(1e6);
        } else {
          lnM -= Math.log(1 - d / md);
          let lp = lnM - Math.log(md);
          if (d === 0 && lp < before) { lp = before; lnM = lp + Math.log(md); }   // money supplied to meet demand, not deflation
          lnP = lp;
        }
        const pi = Math.exp(Math.min(lnP - before, 50)) - 1;
        if (!collapsed) pe = clamp(pe + (stabilised ? 0.6 : LAM) * (pi - pe), -0.05, 50);
        t++;
        hist.push({ t, lp: (lnP - lnP0) / Math.LN10, pi, m: Math.exp(lnM - lnP), frozen: freeze > 0 });
        if (hist.length > 600) hist.shift();
      }

      function draw(dt) {
        if (running && dt > 0 && !collapsed) { acc += dt * V.spd; let n = 0; while (acc >= 1 && n < 10) { month(); acc -= 1; n++; } }
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const view = hist.slice(-SHOW), n = view.length;
        const tStart = view[0].t;
        const x0 = 58, y0 = 28, w = W - x0 - 20, h1 = (Hh - y0 - 50) * 0.55, y2 = y0 + h1 + 36, h2 = Hh - y2 - 22;
        const X = tt => x0 + (tt - tStart) / Math.max(SHOW, 1) * w;
        // ---- price level, log scale
        let hi = 1; for (const q of view) hi = Math.max(hi, q.lp);
        let lo = 0; for (const q of view) lo = Math.min(lo, q.lp);
        hi = Math.ceil(hi + 0.3); lo = Math.floor(lo);
        const Yp = v => y0 + h1 - (v - lo) / Math.max(hi - lo, 1e-9) * h1;
        const stepD = Math.max(1, Math.ceil((hi - lo) / 6));
        c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let k = lo; k <= hi; k += stepD) {
          const y = Yp(k);
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
          c.fillStyle = C.muted; c.fillText(pow10(k), x0 - 6, y);
        }
        view.forEach(q => { if (q.frozen) { c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.12; c.fillRect(X(q.t) - w / SHOW / 2, y0, w / SHOW, h1); c.restore(); } });
        polyline(c, view.map(q => [X(q.t), Yp(q.lp)]), C.warn, 2.6);
        const cur = view[n - 1];
        kit.dot(c, X(cur.t), Yp(cur.lp), 4.5, C.warn, C.bg2);
        kit.label(c, 'price level (month 0 = 1' + (newCur ? '; after the reform, in the new currency' : '') + ')', x0, y0 - 14, { size: 11.5, color: C.muted });
        if (collapsed) kit.label(c, 'the currency has collapsed', x0 + w - 6, y0 + 12, { size: 12, color: C.bad, align: 'right', weight: 700, bg: C.bg2 });
        // ---- inflation each month, log scale from 0.1 % to 10⁶ %
        const LO = -1, HI = 6;
        const Yb = v => y2 + h2 - (clamp(v, LO, HI) - LO) / (HI - LO) * h2;
        for (let k = LO; k <= HI; k++) {
          const y = Yb(k);
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
          c.fillStyle = C.muted; c.textAlign = 'right'; c.fillText(k < 0 ? '0.1%' : pow10(k) + '%', x0 - 6, y);
        }
        const bw = Math.max(1, w / SHOW * 0.75);
        view.forEach(q => {
          if (!(q.pi > 0.001)) return;
          const v = Math.log10(q.pi * 100);
          c.fillStyle = q.pi >= 0.5 ? C.bad : C.accent;
          c.fillRect(X(q.t) - bw / 2, Yb(v), bw, y2 + h2 - Yb(v));
        });
        const yc = Yb(Math.log10(50));
        polyline(c, [[x0, yc], [x0 + w, yc]], C.bad, 1.4, [6, 4]);
        kit.label(c, '50 % a month: hyperinflation', x0 + w - 4, yc - 9, { size: 10.5, color: C.bad, align: 'right' });
        kit.label(c, 'inflation each month', x0, y2 - 14, { size: 11.5, color: C.muted });
        c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top'; c.font = FONT;
        for (let k = Math.max(12, Math.ceil(tStart / 12) * 12); k <= cur.t; k += 12) c.fillText('yr ' + k / 12, X(k), y2 + h2 + 4);
        // readouts
        const pi = cur.pi;
        ro.set('mo', String(cur.t) + (freeze > 0 ? ' (prices frozen)' : ''));
        ro.set('pi', collapsed ? 'beyond measure' : bigPct(pi));
        const lnYr = 12 * Math.log(1 + Math.max(pi, -0.99));
        ro.set('yr', collapsed ? '—' : lnYr > 690 ? 'beyond measure' : bigPct(Math.exp(lnYr) - 1));
        if (pi > 1e-4 && !collapsed) {
          const days = Math.log(2) / Math.log(1 + pi) * 365.25 / 12;
          ro.set('dbl', days < 1 ? (days * 24).toFixed(1) + ' hours' : days < 60 ? days.toFixed(1) + ' days' : days < 730 ? (days / 30.44).toFixed(1) + ' months' : (days / 365.25).toFixed(1) + ' years');
        } else ro.set('dbl', collapsed ? '—' : 'prices are stable');
        const mh = cur.m;
        ro.set('vel', collapsed ? '—' : (12 / Math.max(mh, 1e-9)).toFixed(1) + ' times');
        ro.set('bal', collapsed ? 'none' : (mh * 4.35).toFixed(1) + ' weeks of income');
        ro.set('tax', collapsed ? 'everything' : pi > 0 ? kit.pct(pi / (1 + pi), 1) + ' of its value' : 'nothing');
        ro.set('st', collapsed ? 'collapsed — Stabilise brings a new currency' : stabilised ? (newCur ? 'stabilised: 1 new unit = ' + pow10(newCur) + ' old' : 'stabilised') : freeze > 0 ? 'price freeze — money is piling up' : pi >= 0.5 ? 'hyperinflation' : pi > 0.05 ? 'very high inflation' : pi > 0.01 ? 'high inflation' : 'moderate');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
