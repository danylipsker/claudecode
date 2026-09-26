/* HYPER-FINANCES · sims/money-interest.js — simulations for Money and Interest:
 * inflation eating a banknote, simple against compound interest, compounding frequency,
 * the rule of 72, money on a timeline, an NPV/IRR explorer, and annuities built payment
 * by payment. Every calculation goes through kit.fin. */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const FONT = '11px system-ui, sans-serif';

  // horizontal gridlines with value labels on the left (money, per cent ...)
  function valueAxis(c, x0, y0, w, h, lo, hi, C, fmt) {
    if (!(hi > lo)) return;
    const step = Hyper.niceStep(hi - lo, Math.max(3, Math.floor(h / 42)));
    if (!(step > 0)) return;
    c.save();
    c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-9; v += step) {
      const zero = Math.abs(v) < step * 1e-6;
      const y = Math.round(y0 + h - (v - lo) / (hi - lo) * h) + 0.5;
      c.strokeStyle = zero ? C.axis : C.grid; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(fmt(zero ? 0 : v), x0 - 6, y);
    }
    c.restore();
  }
  // year labels under a time axis running from 0 to T
  function yearTicks(kit, c, x0, y, w, T, C, label, from) {
    from = from || 0;
    const step = Hyper.niceStep(T - from, Math.max(3, Math.floor(w / 64)));
    if (!(step > 0)) return;
    c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
    for (let v = Math.ceil(from / step) * step; v <= T + 1e-9; v += step) c.fillText(String(+v.toFixed(2)), x0 + (v - from) / (T - from) * w, y + 5);
    c.restore();
    if (label) kit.label(c, label, x0 + w / 2, y + 26, { size: 11.5, color: C.muted, align: 'center' });
  }
  // a legend of line samples: items [[colour, text, dash]]
  function legend(kit, c, items, x, y, C) {
    let xx = x;
    for (const [col, text, dash] of items) {
      c.save(); c.strokeStyle = col; c.lineWidth = 2.5; c.setLineDash(dash || []);
      c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + 18, y); c.stroke(); c.restore();
      kit.label(c, text, xx + 23, y, { size: 11.5, color: C.text2 });
      c.save(); c.font = '11.5px system-ui, sans-serif'; xx += 23 + c.measureText(text).width + 18; c.restore();
    }
  }
  function polyline(c, pts, col, width, dash) {
    c.save(); c.strokeStyle = col; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath(); pts.forEach(([x, y], k) => k ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore();
  }
  const years = v => (v >= 10 ? v.toFixed(0) : v.toFixed(1)) + ' years';

  /* ================================================================ inflation */
  Hyper.sim('mi-inflation', {
    title: 'What a banknote buys',
    blurb: `The note keeps its number, but the shaded part shows what it still **buys**, and the bags are the shopping it can pay for. The graph follows its purchasing power in today's money, year by year.

- Press **Live through the years** at 3 %: after about 23 years half of the note is gone.
- Compare the dashed curves: 2 %, 5 % and 10 % a year over a working life of 40 years.
- Set **Interest earned** above the inflation rate: the green line — the savings in today's money — rises instead of falling. Set it below and it still falls, however the statement looks.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'A', label: 'Money kept', min: 10, max: 100000, value: 100, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'pi', label: 'Inflation', min: 0, max: 15, step: 0.1, value: P.pi != null ? P.pi : 3, unit: '% a year' },
        { id: 'T', label: 'Years', min: 1, max: 80, step: 1, value: 40 },
        { id: 'earn', label: 'Interest earned on it', min: 0, max: 15, step: 0.1, value: P.earn != null ? P.earn : 0, unit: '% a year' },
        { id: 'cmp', type: 'check', label: 'Compare 2 %, 5 % and 10 %', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Live through the years', primary: true }, { id: 'end', label: 'Jump to the end' }] }
      ], id => {
        if (id === 'play') { t = 0; loop.start(); return; }
        if (id === 'end') loop.stop();
        if (!loop.running) t = V.T;
        loop.once();
      });
      const ro = kit.readout(box.side, [['buys', 'It buys'], ['price', 'Prices since then'], ['half', 'Half its value gone after'], ['save', 'Kept at interest'], ['real', 'Real rate']]);
      const V = ctl.values, F = kit.fin;
      let t = V.T;

      function bag(c, x, y, s, fill, C) {
        c.save();
        c.lineWidth = 1.4; c.strokeStyle = fill > 0 ? C.accent : C.faint;
        c.beginPath(); c.arc(x + s / 2, y + s * 0.18, s * 0.22, Math.PI, 0); c.stroke();
        c.beginPath(); c.rect(x, y + s * 0.18, s, s * 0.82); c.stroke();
        if (fill > 0) {
          c.fillStyle = C.accent; c.globalAlpha = 0.85;
          c.fillRect(x, y + s * 0.18, s * clamp(fill, 0, 1), s * 0.82);
        }
        c.restore();
      }

      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const T = Math.max(1, Math.round(V.T)), A = V.A, pi = V.pi / 100, earn = V.earn / 100;
        const tt = clamp(t, 0, T);
        const buys = F.pv(A, pi, tt), share = buys / A;
        const realOf = s => F.pv(F.fv(A, earn, s), pi, s);

        // --- the banknote and the shopping it pays for
        const topH = Math.max(120, Hh * 0.34);
        const nx = 18, ny = 30, nw = clamp(W * 0.44, 170, 320), nh = clamp(topH - 44, 64, nw * 0.5);
        kit.label(c, 'year ' + Math.round(tt) + ' of ' + T, nx, 14, { size: 12, color: C.text2, weight: 600 });
        c.save();
        c.fillStyle = C.surface; c.strokeStyle = C.text2; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect ? c.roundRect(nx, ny, nw, nh, 8) : c.rect(nx, ny, nw, nh); c.fill(); c.stroke();
        c.clip();
        c.fillStyle = C.accent; c.globalAlpha = 0.28; c.fillRect(nx, ny, nw * share, nh);
        c.globalAlpha = 1;
        c.beginPath(); c.rect(nx + nw * share, ny, nw * (1 - share), nh); c.clip();
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let x = nx - nh; x < nx + nw + nh; x += 9) { c.beginPath(); c.moveTo(x, ny + nh); c.lineTo(x + nh, ny); c.stroke(); }
        c.restore();
        kit.label(c, kit.money(A, 0), nx + 14, ny + nh * 0.36, { size: 20, weight: 700, color: C.text });
        kit.label(c, 'still buys ' + kit.money(buys) + ' of today\'s shopping', nx + 14, ny + nh * 0.72, { size: 11.5, color: C.text2 });
        if (share < 0.97) kit.label(c, 'lost to rising prices', nx + nw - 8, ny + nh + 12, { size: 11, color: C.muted, align: 'right' });
        // ten bags of shopping
        const bx = nx + nw + 26, bwid = W - bx - 16, s = clamp(Math.min(bwid / 5 - 10, (nh + 10) / 2 - 8), 12, 30);
        if (bwid > 80) {
          kit.label(c, 'the shopping it pays for', bx, 14, { size: 11.5, color: C.muted });
          for (let k = 0; k < 10; k++) bag(c, bx + (k % 5) * (s + 10), ny + Math.floor(k / 5) * (s + 12), s, share * 10 - k, C);
        }

        // --- purchasing power over the years
        const x0 = 64, y0 = topH + 34, w = W - x0 - 44, h = Hh - y0 - 44;
        const endReal = earn > 0 ? realOf(T) : A;
        const ymax = Math.max(A, endReal) * 1.08;
        valueAxis(c, x0, y0, w, h, 0, ymax, C, v => kit.money(v, 0, true));
        yearTicks(kit, c, x0, y0 + h, w, T, C, 'years from now');
        const X = s => x0 + s / T * w, Y = v => y0 + h - clamp(v, 0, ymax) / ymax * h;
        const curve = f => Array.from({ length: 121 }, (_, k) => { const s = T * k / 120; return [X(s), Y(f(s))]; });
        polyline(c, [[X(0), Y(A / 2)], [X(T), Y(A / 2)]], C.faint, 1, [3, 4]);
        kit.label(c, 'half', X(T) + 4, Y(A / 2), { size: 11, color: C.muted });
        if (V.cmp) for (const rr of [2, 5, 10]) {
          if (Math.abs(rr - V.pi) < 0.05) continue;
          polyline(c, curve(s => F.pv(A, rr / 100, s)), C.muted, 1.3, [5, 4]);
          const vEnd = F.pv(A, rr / 100, T);
          kit.label(c, rr + ' %', X(T) + 4, Y(vEnd), { size: 10.5, color: C.muted });
        }
        if (earn > 0) polyline(c, curve(realOf), C.ok, 2.4);
        polyline(c, curve(s => F.pv(A, pi, s)), C.accent, 2.8);
        // the cursor
        polyline(c, [[X(tt), y0], [X(tt), y0 + h]], C.text2, 1, [2, 3]);
        kit.dot(c, X(tt), Y(buys), 5, C.accent, C.bg2);
        if (earn > 0) kit.dot(c, X(tt), Y(realOf(tt)), 5, C.ok, C.bg2);
        const lg = [[C.accent, 'cash, in today\'s money']];
        if (earn > 0) lg.push([C.ok, 'kept at ' + V.earn.toFixed(1) + ' %, in today\'s money']);
        if (V.cmp) lg.push([C.muted, 'other inflation rates', [5, 4]]);
        legend(kit, c, lg, x0, y0 - 14, C);

        // --- numbers
        ro.set('buys', kit.money(buys) + ' (' + kit.pct(share, 0) + ' of its first value)');
        ro.set('price', '×' + F.fv(1, pi, tt).toFixed(2) + ' in ' + Math.round(tt) + ' years');
        ro.set('half', pi > 0 ? years(F.doublingTime(pi)) : 'never, with no inflation');
        if (earn > 0) {
          const nom = F.fv(A, earn, tt);
          ro.set('save', kit.money(nom) + ' on the statement = ' + kit.money(realOf(tt)) + ' today');
        } else ro.set('save', 'set "Interest earned" to compare');
        ro.set('real', kit.pct(F.real(earn, pi), 2) + ' a year' + (earn > 0 ? '' : ' (cash)'));
      }
      const loop = kit.loop(dt => {
        if (loop.running) { t += dt * Math.max(4, V.T / 6); if (t >= V.T) { t = V.T; loop.stop(); } }
        draw();
      }, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ simple against compound */
  Hyper.sim('mi-race', {
    title: 'Simple against compound interest',
    blurb: `Two accounts start with the same money at the same rate. One pays **simple** interest (always on the original amount), the other **compounds** (interest on the interest too). The shaded gap between them is the interest on interest.

- Press **Race**: for the first years the two are almost together — then the compound curve bends away.
- Find where each one doubles: simple interest needs 1/r years, compounding about 72 ÷ rate.
- Raise the rate from 3 % to 10 %: the gap grows much faster than the rate.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Amount invested', min: 100, max: 100000, value: 10000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Interest rate', min: 0.5, max: 20, step: 0.1, value: 7, unit: '% a year' },
        { id: 'T', label: 'Years', min: 5, max: 60, step: 1, value: 40 },
        { id: 'fill', type: 'check', label: 'Shade the interest on interest', value: true },
        { type: 'buttons', items: [{ id: 'race', label: 'Race', primary: true }, { id: 'all', label: 'Show the finish' }] }
      ], id => {
        if (id === 'race') { t = 0; loop.start(); return; }
        if (id === 'all') loop.stop();
        if (!loop.running) t = V.T;
        loop.once();
      });
      const ro = kit.readout(box.side, [['s', 'Simple interest'], ['c', 'Compound interest'], ['ii', 'Interest on interest'], ['d', 'Money doubles after'], ['x', 'Compound gain ÷ simple gain']]);
      const V = ctl.values, F = kit.fin;
      let t = V.T;

      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const T = Math.max(1, Math.round(V.T)), P = V.P, r = V.r / 100, tt = clamp(t, 0, T);
        const simple = s => P * (1 + r * s), comp = s => F.fv(P, r, s);
        const x0 = 70, y0 = 34, w = W - x0 - 96, h = Hh - y0 - 46;
        const ymax = comp(T) * 1.06;
        valueAxis(c, x0, y0, w, h, 0, ymax, C, v => kit.money(v, 0, true));
        yearTicks(kit, c, x0, y0 + h, w, T, C, 'years');
        const X = s => x0 + s / T * w, Y = v => y0 + h - clamp(v, 0, ymax) / ymax * h;
        const N = 160, sPts = [], cPts = [];
        for (let k = 0; k <= N; k++) { const s = tt * k / N; sPts.push([X(s), Y(simple(s))]); cPts.push([X(s), Y(comp(s))]); }
        if (V.fill && tt > 0) {
          c.save(); c.fillStyle = C.ok; c.globalAlpha = 0.22; c.beginPath();
          cPts.forEach(([x, y], k) => k ? c.lineTo(x, y) : c.moveTo(x, y));
          for (let k = sPts.length - 1; k >= 0; k--) c.lineTo(sPts[k][0], sPts[k][1]);
          c.closePath(); c.fill(); c.restore();
        }
        polyline(c, [[X(0), Y(P)], [X(T), Y(P)]], C.faint, 1, [4, 4]);
        kit.label(c, 'invested', X(0) + 4, Y(P) - 9, { size: 11, color: C.muted });
        polyline(c, sPts, C.warn, 2.4);
        polyline(c, cPts, C.accent, 2.8);
        // doubling marks
        const dS = 1 / r, dC = F.doublingTime(r);
        for (const [d, col, txt] of [[dC, C.accent, '×2 compound'], [dS, C.warn, '×2 simple']]) {
          if (d > tt) continue;
          polyline(c, [[X(d), Y(2 * P)], [X(d), y0 + h]], col, 1, [2, 3]);
          kit.dot(c, X(d), Y(2 * P), 3.5, col);
          kit.label(c, txt, X(d) + 4, Y(2 * P) + (col === C.warn ? 12 : -12), { size: 10.5, color: col });
        }
        // the runners
        const vs = simple(tt), vc = comp(tt);
        kit.dot(c, X(tt), Y(vs), 6, C.warn, C.bg2);
        kit.dot(c, X(tt), Y(vc), 6, C.accent, C.bg2);
        kit.label(c, kit.money(vc, 0, true), X(tt) + 10, Y(vc), { size: 11.5, color: C.accent, weight: 600, bg: C.bg2 });
        kit.label(c, kit.money(vs, 0, true), X(tt) + 10, Y(vs) + (Math.abs(Y(vs) - Y(vc)) < 18 ? 16 : 0), { size: 11.5, color: C.warn, weight: 600, bg: C.bg2 });
        const lg = [[C.accent, 'compound'], [C.warn, 'simple']];
        if (V.fill) lg.push([C.ok, 'interest on interest']);
        legend(kit, c, lg, x0, y0 - 16, C);
        kit.label(c, 'year ' + Math.round(tt), x0 + w, y0 - 16, { size: 12, color: C.text2, align: 'right', weight: 600 });

        ro.set('s', kit.money(vs) + ' (+' + kit.money(vs - P, 0) + ')');
        ro.set('c', kit.money(vc) + ' (+' + kit.money(vc - P, 0) + ')');
        ro.set('ii', kit.money(Math.max(0, vc - vs)) + (vc > P ? ' (' + kit.pct(Math.max(0, vc - vs) / (vc - P), 0) + ' of the growth)' : ''));
        ro.set('d', 'simple ' + years(dS) + ', compound ' + years(dC));
        ro.set('x', tt > 0 ? '×' + ((vc - P) / (vs - P)).toFixed(2) : '—');
      }
      const loop = kit.loop(dt => {
        if (loop.running) { t += dt * Math.max(5, V.T / 7); if (t >= V.T) { t = V.T; loop.stop(); } }
        draw();
      }, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ compounding frequency */
  const FREQ = [['once a year', 1], ['twice a year', 2], ['quarterly', 4], ['monthly', 12], ['weekly', 52], ['daily', 365], ['continuously', 0]];
  Hyper.sim('mi-frequency', {
    title: 'Compounding more often',
    blurb: `The left panel follows one year of a deposit: every step is a moment when interest is added. The right panel shows the **effective** yearly rate for each frequency, approaching the limit eʳ − 1.

- Start at 12 % once a year, then press **More often**: each step helps, but less and less.
- Compare monthly and daily: at ordinary rates the difference is tiny.
- Raise the rate to 100 %: ¤1 grows to at most e = 2.718…, however often interest is added.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Nominal rate', min: 1, max: 100, step: 0.5, value: 12, unit: '% a year' },
        { id: 'm', type: 'select', label: 'Interest added', options: FREQ, value: 1 },
        { id: 'P', label: 'Deposit', min: 100, max: 100000, value: 1000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { type: 'buttons', items: [{ id: 'more', label: 'More often', primary: true }] }
      ], id => {
        if (id === 'more') {
          const k = FREQ.findIndex(f => f[1] === V.m);
          ctl.set('m', FREQ[(k + 1) % FREQ.length][1]);
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['i', 'Rate per period'], ['E', 'Effective yearly rate'], ['lim', 'Continuous limit'], ['A', 'After one year'], ['gain', 'Gain over once a year']]);
      const V = ctl.values, F = kit.fin;
      const mOf = v => v === 0 ? Infinity : v;

      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const r = V.r / 100, m = mOf(V.m), P = V.P;
        const E = F.effective(r, m), lim = F.effective(r, Infinity);
        // --- left: one year of growth
        const lx0 = 66, ly0 = 34, lw = Math.max(120, W * 0.5 - lx0 - 10), lh = Hh - ly0 - 46;
        const lo = P * 0.99, hi = P * (1 + lim) * 1.01;
        valueAxis(c, lx0, ly0, lw, lh, lo, hi, C, v => kit.money(v, hi - lo < 50 ? 2 : 0));
        const X = s => lx0 + s * lw, Y = v => ly0 + lh - (v - lo) / (hi - lo) * lh;
        c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (const mo of [0, 3, 6, 9, 12]) c.fillText(String(mo), X(mo / 12), ly0 + lh + 5);
        c.restore();
        kit.label(c, 'months', lx0 + lw / 2, ly0 + lh + 26, { size: 11.5, color: C.muted, align: 'center' });
        polyline(c, [[X(0), Y(P)], [X(1), Y(P * (1 + r))]], C.faint, 1.3, [3, 3]);
        polyline(c, Array.from({ length: 101 }, (_, k) => [X(k / 100), Y(P * Math.exp(r * k / 100))]), C.ok, 1.8, [6, 4]);
        if (m === Infinity) polyline(c, Array.from({ length: 101 }, (_, k) => [X(k / 100), Y(P * Math.exp(r * k / 100))]), C.accent, 2.8);
        else {
          const pts = [];
          for (let k = 0; k < m; k++) {
            const v = F.fv(P, r / m, k);
            pts.push([X(k / m), Y(v)], [X((k + 1) / m), Y(v)]);
          }
          pts.push([X(1), Y(F.fv(P, r / m, m))]);
          polyline(c, pts, C.accent, 2.6);
        }
        kit.dot(c, X(1), Y(P * (1 + E)), 5, C.accent, C.bg2);
        legend(kit, c, [[C.accent, 'balance'], [C.ok, 'continuous', [6, 4]], [C.faint, 'no compounding', [3, 3]]], lx0, ly0 - 16, C);

        // --- right: effective rate against frequency
        const rx0 = lx0 + lw + 64, ry0 = 34, rw = W - rx0 - 18, rh = Hh - ry0 - 46;
        if (rw > 90) {
          const elo = r - (lim - r) * 0.12, ehi = lim + (lim - r) * 0.12;
          const dec = clamp(Math.ceil(-Math.log10((ehi - elo) * 25)), 1, 4);
          valueAxis(c, rx0, ry0, rw, rh, elo, ehi, C, v => kit.pct(v, dec));
          const slots = FREQ.map(f => f[1]);
          const XS = k => rx0 + (k + 0.5) / slots.length * rw, YS = e => ry0 + rh - (e - elo) / (ehi - elo) * rh;
          polyline(c, [[rx0, YS(lim)], [rx0 + rw, YS(lim)]], C.ok, 1.3, [6, 4]);
          kit.label(c, 'limit eʳ − 1 = ' + kit.pct(lim, 2), rx0 + rw, YS(lim) - 10, { size: 11, color: C.ok, align: 'right' });
          const pts = slots.map((v, k) => [XS(k), YS(F.effective(r, mOf(v)))]);
          polyline(c, pts, C.faint, 1.2);
          c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
          slots.forEach((v, k) => {
            const sel = v === V.m;
            kit.dot(c, pts[k][0], pts[k][1], sel ? 6 : 3.5, sel ? C.accent : C.muted, sel ? C.bg2 : null);
            c.fillText(v === 0 ? '∞' : String(v), XS(k), ry0 + rh + 5);
          });
          c.restore();
          kit.label(c, 'times a year', rx0 + rw / 2, ry0 + rh + 26, { size: 11.5, color: C.muted, align: 'center' });
          kit.label(c, 'effective yearly rate', rx0, ry0 - 16, { size: 11.5, color: C.text2 });
        }

        ro.set('i', m === Infinity ? 'continuous' : kit.pct(r / m, 4) + ' × ' + m);
        ro.set('E', kit.pct(E, 3));
        ro.set('lim', kit.pct(lim, 3));
        ro.set('A', kit.money(P * (1 + E)));
        ro.set('gain', '+' + kit.money(P * (E - r)) + ' (' + (100 * (E - r)).toFixed(3) + ' points)');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ rule of 72 */
  const RULES = [['72 ÷ rate', 72], ['70 ÷ rate', 70], ['69.3 ÷ rate', 69.3]];
  Hyper.sim('mi-rule72', {
    title: 'How good is the rule of 72?',
    blurb: `The top chart shows ¤1 growing on a **doubling scale**: every gridline is twice the one below, so steady growth is a straight line and doublings are evenly spaced. Dots mark the exact doubling times, orange ticks the rule's estimates. The graph below shows each rule's error at every rate.

- At 8 %, the rule of 72 is almost perfect; at 2 %, the rule of 70 is closer.
- Push the rate to 30 % and beyond: every rule says "sooner" than the truth.
- Hover over the lower graph to read the error at any rate.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Growth rate', min: 0.5, max: 50, step: 0.1, value: 8, unit: '% a year' },
        { id: 'rule', type: 'select', label: 'Rule', options: RULES, value: 72 }
      ], () => { update(); loop.once(); });
      const ro = kit.readout(box.side, [['ex', 'Exact doubling time'], ['est', 'Rule estimate'], ['err', 'Error'], ['best', 'This rule is exact at'], ['n40', 'Doublings in 40 years']]);
      const plot = kit.plot(box.stage, { x: { label: 'yearly rate (%)', min: 0, max: 50 }, y: { label: 'error of the rule (%)' }, fmtX: v => v.toFixed(1) + ' %', fmtY: v => v.toFixed(2) + ' %' }, 210);
      const V = ctl.values, F = kit.fin;
      const err = (K, R) => (K / R / F.doublingTime(R / 100) - 1) * 100;
      const curves = RULES.map(([, K]) => { const pts = []; for (let R = 0.5; R <= 50.001; R += 0.25) pts.push([R, err(K, R)]); return pts; });
      function exactAt(K) {
        let prev = null;
        for (let R = 0.1; R <= 50.001; R += 0.1) {
          const e = err(K, R);
          if (prev && Math.sign(prev[1]) !== Math.sign(e)) {
            let lo = prev[0], hi = R, flo = prev[1];
            for (let j = 0; j < 50; j++) { const mid = (lo + hi) / 2, fm = err(K, mid); if (Math.sign(fm) === Math.sign(flo)) { lo = mid; flo = fm; } else hi = mid; }
            return (lo + hi) / 2;
          }
          prev = [R, e];
        }
        return null;
      }
      const best = RULES.map(([, K]) => exactAt(K));

      function update() {
        const R = V.r, K = V.rule, e = err(K, R);
        plot.set({
          series: curves.map((pts, k) => ({ pts, label: 'rule of ' + RULES[k][1], width: RULES[k][1] === K ? 3 : 1.4, dash: RULES[k][1] === K ? null : [5, 4] })),
          hlines: [{ y: 0 }],
          vlines: [{ x: R, label: R.toFixed(1) + ' %' }],
          marks: [{ x: R, y: e, label: (e >= 0 ? '+' : '') + e.toFixed(1) + ' %' }]
        });
      }

      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const r = V.r / 100, K = V.rule, Td = F.doublingTime(r), Te = K / V.r;
        const n = 5, T = n * Td;
        const x0 = 56, y0 = 28, w = W - x0 - 24, h = Hh - y0 - 46;
        const X = s => x0 + s / T * w, Y = v => y0 + h - Math.log2(v) / n * h;
        c.save(); c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let k = 0; k <= n; k++) {
          const y = Math.round(Y(Math.pow(2, k))) + 0.5;
          c.strokeStyle = k ? C.grid : C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
          c.fillStyle = C.muted; c.fillText('×' + Math.pow(2, k), x0 - 6, y);
        }
        c.restore();
        yearTicks(kit, c, x0, y0 + h, w, T, C, 'years');
        polyline(c, Array.from({ length: 101 }, (_, k) => { const s = T * k / 100; return [X(s), Y(F.fv(1, r, s))]; }), C.accent, 2.6);
        for (let k = 1; k <= n; k++) {
          const xe = X(k * Td), xr = X(k * Te);
          polyline(c, [[xe, Y(Math.pow(2, k))], [xe, y0 + h]], C.accent, 1, [2, 3]);
          kit.dot(c, xe, Y(Math.pow(2, k)), 4.5, C.accent, C.bg2);
          if (xr >= x0 && xr <= x0 + w) {
            c.save(); c.fillStyle = C.warn; c.beginPath(); c.moveTo(xr, y0 + h - 1); c.lineTo(xr - 5, y0 + h - 10); c.lineTo(xr + 5, y0 + h - 10); c.closePath(); c.fill(); c.restore();
          }
          if (k === 1) {
            kit.label(c, years(Td) + ' exact', xe + 6, Y(2) + 12, { size: 11, color: C.accent });
            kit.label(c, years(Te) + ' by the rule', xr + 6, y0 + h - 22, { size: 11, color: C.warn });
          }
        }
        kit.label(c, 'value of ' + kit.money(1) + ', on a doubling scale', x0, y0 - 14, { size: 11.5, color: C.text2 });

        const e = err(K, V.r), bi = RULES.findIndex(q => q[1] === K);
        ro.set('ex', years(Td));
        ro.set('est', K + ' ÷ ' + V.r.toFixed(1) + ' = ' + Te.toFixed(2) + ' years');
        ro.set('err', (Te - Td >= 0 ? '+' : '−') + Math.abs(Te - Td).toFixed(2) + ' years (' + (e >= 0 ? '+' : '') + e.toFixed(1) + ' %)');
        ro.set('best', best[bi] != null ? 'about ' + best[bi].toFixed(2) + ' %' : 'no rate: always a little short');
        ro.set('n40', (40 / Td).toFixed(2) + ' (×' + kit.fmt(F.fv(1, r, 40), 3) + ')');
      }
      update();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ money on a timeline */
  const TL = {
    single: () => [{ t: 10, a: 10000 }],
    three: () => [{ t: 1, a: 3000 }, { t: 2, a: 4000 }, { t: 3, a: 5000 }],
    prize: () => Array.from({ length: 20 }, (_, k) => ({ t: k, a: 50000 })),
    pension: () => Array.from({ length: 25 }, (_, k) => ({ t: 20 + k, a: 12000 })),
    mine: () => [{ t: 2, a: 5000 }, { t: 5, a: 5000 }, { t: 10, a: 5000 }, { t: 20, a: 5000 }]
  };
  Hyper.sim('mi-timeline', {
    title: 'Money on a timeline',
    blurb: `Each coin is an amount paid at a date. Its outer ring is the amount; the filled disc is what it is worth **today** at the chosen rate. The column on the left adds everything up, then and now. **Drag a coin** along the timeline.

- Drag a coin further into the future and watch its present value shrink.
- Set the rate to 0 %: every coin is worth its face value. Raise it to 10 %: distant coins almost vanish.
- Try **A prize**: is ¤50,000 a year for 20 years worth more than ¤600,000 now? It depends on the rate.
- **A pension in 20 years** shows how little far-off money weighs at high rates.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Discount rate', min: 0, max: 20, step: 0.1, value: 5, unit: '% a year' },
        { id: 'preset', type: 'select', label: 'Cash flows', options: [['One amount in 10 years', 'single'], ['Three yearly amounts', 'three'], ['A prize: 20 yearly payments', 'prize'], ['A pension in 20 years', 'pension'], ['Four coins to drag', 'mine']], value: TL[P.preset] ? P.preset : 'single' },
        { id: 'curve', type: 'check', label: 'Show the discount curve', value: true }
      ], id => { if (id === 'preset') { flows = TL[V.preset](); sel = 0; } loop.once(); });
      const ro = kit.readout(box.side, [['tot', 'Paid in total'], ['pv', 'Worth today'], ['lost', 'Lost to waiting'], ['one', 'Selected coin'], ['df', 'Value of 1 in 10 years'], ['cmp', 'Or a lump sum now']]);
      const V = ctl.values, F = kit.fin;
      let flows = TL[V.preset](), sel = 0, geo = null;

      function layout() {
        const W = st.W, Hh = st.H;
        const maxT = Math.max(...flows.map(f => f.t));
        const T = [5, 10, 20, 30, 50].find(v => v >= maxT + 1) || 50;
        const x0 = 118, w = W - x0 - 26, axisY = Math.round(Hh * 0.7);
        const amax = Math.max(...flows.map(f => f.a));
        const spacing = w / Math.max(1, T) * (flows.length > 1 ? Math.max(1, Math.min(...flows.slice(1).map((f, k) => Math.abs(f.t - flows[k].t)))) : T);
        const R = clamp(Math.min(spacing * 0.46, (axisY - 70) / 2), 5, 38);
        return { T, x0, w, axisY, amax, R, X: t => x0 + t / T * w, cy: axisY - R - 8 };
      }

      kit.drag(st, {
        hover: true,
        hit(p) {
          if (!geo) return null;
          let best = null, bd = 1e9;
          flows.forEach((f, k) => { const d = Math.hypot(p.x - geo.X(f.t), p.y - geo.cy); if (d < Math.max(14, geo.R + 4) && d < bd) { bd = d; best = k; } });
          return best;
        },
        start(k) { sel = k; loop.once(); },
        move(k, p) {
          if (!geo || !flows[k]) return;
          const t = clamp((p.x - geo.x0) / geo.w * geo.T, 0, geo.T);
          flows[k].t = Math.round(t * 4) / 4;
          sel = k; loop.once();
        }
      });

      function draw() {
        const C = kit.colors(), c = st.begin(), Hh = st.H;
        const r = V.r / 100;
        geo = layout();
        const { T, x0, w, axisY, amax, R, X, cy } = geo;
        const pvs = flows.map(f => F.pv(f.a, r, f.t));
        const tot = flows.reduce((s, f) => s + f.a, 0), pv = pvs.reduce((s, v) => s + v, 0);
        // the discount curve: value today of 1 due at each date
        if (V.curve) {
          const top = 30, bot = cy - R - 24;
          if (bot - top > 30) {
            polyline(c, Array.from({ length: 101 }, (_, k) => { const t = T * k / 100; return [X(t), bot - F.pv(1, r, t) * (bot - top)]; }), C.muted, 1.5, [5, 4]);
            kit.label(c, 'value today of 1 due then', X(T) - 4, bot - F.pv(1, r, T) * (bot - top) - 10, { size: 11, color: C.muted, align: 'right' });
            kit.label(c, '1', x0 - 8, top, { size: 11, color: C.muted, align: 'right' });
          }
        }
        // the timeline
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, axisY); c.lineTo(x0 + w, axisY); c.stroke(); c.restore();
        yearTicks(kit, c, x0, axisY, w, T, C, 'years from today');
        kit.label(c, 'today', x0, axisY - 10, { size: 11, color: C.text2, align: 'center', weight: 600 });
        // coins
        const labelAll = w / Math.max(1, flows.length) > 58;
        flows.forEach((f, k) => {
          const x = X(f.t), ro2 = R * Math.sqrt(f.a / amax), ri = R * Math.sqrt(Math.max(0, pvs[k]) / amax);
          c.save();
          c.strokeStyle = k === sel ? C.text : C.warn; c.lineWidth = k === sel ? 2 : 1.4; c.setLineDash([3, 2]);
          c.beginPath(); c.arc(x, cy, ro2, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.accent; c.globalAlpha = 0.85; c.beginPath(); c.arc(x, cy, ri, 0, Math.PI * 2); c.fill();
          c.restore();
          polyline(c, [[x, cy + ro2], [x, axisY]], C.faint, 1);
          if (labelAll || k === sel || k === 0 || k === flows.length - 1) {
            kit.label(c, kit.money(f.a, 0, true), x, cy - ro2 - 9, { size: 10.5, color: C.warn, align: 'center' });
            kit.label(c, kit.money(pvs[k], 0, true), x, axisY + 44, { size: 10.5, color: C.accent, align: 'center' });
          }
        });
        // the column: everything added up
        const colX = 18, colW = 26, colTop = 34, colBot = axisY, maxV = Math.max(tot, 1);
        const hT = (colBot - colTop) * tot / maxV, hP = (colBot - colTop) * pv / maxV;
        c.save();
        c.strokeStyle = C.warn; c.setLineDash([3, 2]); c.lineWidth = 1.4; c.strokeRect(colX, colBot - hT, colW, hT); c.setLineDash([]);
        c.fillStyle = C.accent; c.fillRect(colX + 3, colBot - hP, colW - 6, hP);
        c.restore();
        kit.label(c, kit.money(tot, 0, true), colX + colW + 6, colBot - hT + 6, { size: 11, color: C.warn });
        kit.label(c, kit.money(pv, 0, true), colX + colW + 6, Math.min(colBot - 8, colBot - hP + 6 + (Math.abs(hT - hP) < 16 ? 14 : 0)), { size: 11, color: C.accent, weight: 600 });
        kit.label(c, 'paid', colX, Hh - 30, { size: 10.5, color: C.warn });
        kit.label(c, 'worth today', colX, Hh - 16, { size: 10.5, color: C.accent });

        ro.set('tot', kit.money(tot));
        ro.set('pv', kit.money(pv));
        ro.set('lost', tot > 0 ? kit.pct(1 - pv / tot, 1) : '—');
        const f = flows[sel];
        ro.set('one', f ? kit.money(f.a, 0) + ' in ' + f.t + ' yr → ' + kit.money(pvs[sel]) : '—');
        ro.set('df', F.pv(1, r, 10).toFixed(3));
        const lump = 600000;
        ro.show('cmp', V.preset === 'prize');
        ro.set('cmp', kit.money(lump, 0) + (pv > lump ? ': the payments are worth more' : ': the lump sum is worth more'));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ NPV and IRR */
  const PROJECTS = {
    solar: () => [-8000].concat(Array(15).fill(1000)),
    machine: () => [-20000, 6000, 8000, 9000, 5000],
    course: () => [-12000].concat(Array(10).fill(2000)),
    two: () => [-10000, 23000, -13200],
    loan: () => [10000].concat(Array(5).fill(-2637.97))
  };
  Hyper.sim('mi-npv-irr', {
    title: 'NPV and IRR explorer',
    blurb: `Bars are the cash flows of a project, year by year: money in above the line, money out below. The darker part of each bar is its value **today** at your discount rate. The graph underneath is the **NPV profile**: the net present value at every rate. Where it crosses zero is the **IRR**. **Drag a bar** up or down to change it.

- With the solar panels, move the rate: the NPV turns negative just above 9.1 %.
- Try **Two IRRs**: the profile crosses zero twice, at 10 % and 20 % — the IRR rule breaks down, the NPV at your rate still works.
- **A loan, from the borrower's side** starts with money in: its NPV *rises* with the rate, because the repayments are worth less.`,
    mount(box, kit, params) {
      const Pm = params || {};
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Project', options: [['Solar panels', 'solar'], ['A machine for a business', 'machine'], ['A course of study', 'course'], ['Two IRRs', 'two'], ['A loan, from the borrower\'s side', 'loan']], value: PROJECTS[Pm.preset] ? Pm.preset : 'solar' },
        { id: 'r', label: 'Discount rate', min: 0, max: 30, step: 0.1, value: 8, unit: '%' }
      ], id => { if (id === 'preset') { flows = PROJECTS[V.preset](); scale = null; } update(); loop.once(); });
      const ro = kit.readout(box.side, [['npv', 'NPV at your rate'], ['irr', 'IRR'], ['sum', 'Sum of the flows (NPV at 0 %)'], ['pb', 'Payback'], ['dec', 'At your rate']]);
      const plot = kit.plot(box.stage, { x: { label: 'discount rate (%)', min: 0, max: 30 }, y: { label: 'NPV', fmt: v => kit.money(v, 0, true) }, fmtX: v => v.toFixed(1) + ' %', fmtY: v => kit.money(v) }, 220);
      const V = ctl.values, F = kit.fin;
      let flows = PROJECTS[V.preset](), scale = null, geo = null, dragging = false;

      function irrs() {
        const f = r => F.npv(r, flows), out = [];
        let a = -0.5, fa = f(a);
        for (let k = 1; k <= 300; k++) {
          const b = -0.5 + k * 0.005, fb = f(b);
          if (fa === 0) out.push(a);
          else if (fb !== 0 && Math.sign(fa) !== Math.sign(fb)) {
            let lo = a, hi = b, flo = fa;
            for (let j = 0; j < 60; j++) { const m = (lo + hi) / 2, fm = f(m); if (Math.sign(fm) === Math.sign(flo)) { lo = m; flo = fm; } else hi = m; }
            out.push((lo + hi) / 2);
          }
          a = b; fa = fb;
        }
        return out.filter((x, k) => !k || Math.abs(x - out[k - 1]) > 1e-4);
      }
      function update() {
        const r = V.r / 100, roots = irrs();
        const pts = [];
        for (let R = 0; R <= 30.001; R += 0.25) pts.push([R, F.npv(R / 100, flows)]);
        const npv = F.npv(r, flows);
        plot.set({
          series: [{ pts, label: 'NPV', width: 2.5 }],
          hlines: [{ y: 0 }],
          vlines: [{ x: V.r, label: 'your rate' }],
          marks: roots.filter(x => x >= 0 && x <= 0.3).map(x => ({ x: x * 100, y: 0, label: 'IRR ' + (x * 100).toFixed(2) + ' %' })).concat([{ x: V.r, y: npv }])
        });
        ro.set('npv', (npv >= 0 ? '+' : '−') + kit.money(Math.abs(npv)));
        ro.set('irr', roots.length ? roots.map(x => (x * 100).toFixed(2) + ' %').join(' and ') : 'none: the flows never balance');
        const sum = flows.reduce((s, v) => s + v, 0);
        ro.set('sum', (sum >= 0 ? '+' : '−') + kit.money(Math.abs(sum), 0));
        let cum = 0, pb = null;
        if (flows[0] < 0) for (let k = 0; k < flows.length; k++) { const prev = cum; cum += flows[k]; if (k > 0 && prev < 0 && cum >= 0) { pb = k - 1 + (-prev) / flows[k]; break; } }
        ro.set('pb', flows[0] >= 0 ? '— (money comes first)' : pb == null ? 'never' : pb.toFixed(1) + ' years (ignores the time value)');
        ro.set('dec', npv > 0 ? 'adds ' + kit.money(npv, 0) + ' of value against ' + V.r.toFixed(1) + ' %' : npv < 0 ? 'the alternative at ' + V.r.toFixed(1) + ' % is better' : 'exactly break-even');
      }

      kit.drag(st, {
        hover: true,
        hit(p) {
          if (!geo) return null;
          const k = Math.floor((p.x - geo.x0) / geo.bw);
          return k >= 0 && k < flows.length && p.y > geo.y0 - 10 && p.y < geo.y0 + geo.h + 10 ? k : null;
        },
        start() { dragging = true; },
        move(k, p) {
          if (!geo) return;
          const v = geo.lo + (geo.y0 + geo.h - p.y) / geo.h * (geo.hi - geo.lo);
          flows[k] = Math.round(clamp(v, geo.lo, geo.hi) / 100) * 100;
          update(); loop.once();
        },
        end() { dragging = false; scale = null; loop.once(); }
      });

      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const r = V.r / 100, n = flows.length;
        if (!scale || !dragging) {
          const mx = Math.max(0, ...flows), mn = Math.min(0, ...flows), span = Math.max(1, mx - mn);
          scale = { hi: mx + span * 0.18 + (mx === 0 ? span * 0.1 : 0), lo: mn - span * 0.18 - (mn === 0 ? span * 0.1 : 0) };
        }
        const x0 = 70, y0 = 26, w = W - x0 - 16, h = Hh - y0 - 40, bw = w / n;
        geo = { x0, y0, w, h, bw, lo: scale.lo, hi: scale.hi };
        valueAxis(c, x0, y0, w, h, scale.lo, scale.hi, C, v => kit.money(v, 0, true));
        const Y = v => y0 + h - (v - scale.lo) / (scale.hi - scale.lo) * h;
        c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        flows.forEach((v, k) => {
          const x = x0 + k * bw, pv = F.pv(v, r, k), col = v >= 0 ? C.ok : C.bad;
          const bx = x + bw * 0.14, bwi = bw * 0.72;
          c.globalAlpha = 0.25; c.fillStyle = col; c.fillRect(bx, Math.min(Y(0), Y(v)), bwi, Math.abs(Y(v) - Y(0)));
          c.globalAlpha = 1; c.strokeStyle = col; c.lineWidth = 1.2; c.strokeRect(bx, Math.min(Y(0), Y(v)), bwi, Math.abs(Y(v) - Y(0)));
          c.fillStyle = col; c.fillRect(bx + bwi * 0.2, Math.min(Y(0), Y(pv)), bwi * 0.6, Math.abs(Y(pv) - Y(0)));
          c.fillStyle = C.muted;
          if (n <= 20 || k % 2 === 0) c.fillText(String(k), x + bw / 2, y0 + h + 5);
        });
        c.restore();
        if (n <= 11) flows.forEach((v, k) => kit.label(c, kit.money(v, 0, true), x0 + (k + 0.5) * bw, v >= 0 ? Y(v) - 9 : Y(v) + 10, { size: 10.5, color: C.text2, align: 'center' }));
        kit.label(c, 'year', x0 + w / 2, y0 + h + 27, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'cash flows (outline) and their value today (solid) at ' + V.r.toFixed(1) + ' %', x0, y0 - 12, { size: 11.5, color: C.text2 });
      }
      update();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ annuities and perpetuities */
  Hyper.sim('mi-annuity', {
    title: 'An annuity, payment by payment',
    blurb: `Each bar is one yearly payment: its outline is what is paid, the solid part what it is worth **today**. The line below adds up those present values; the dashed ceiling is what the payments would be worth if they went on **forever** — C / r, or C / (r − g) if they grow.

- Press **Build it**: the value climbs fast, then slowly — each later payment adds less.
- Tick **Forever**: the sum creeps up to the ceiling but never passes it.
- Lower the rate from 5 % to 4 %: the ceiling rises by a quarter. Let the payments **grow** close to the rate and it soars.
- Tick **Paid at the start**: every payment arrives a year sooner and the value rises by the factor 1 + r.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'C', label: 'Payment each year', min: 100, max: 10000, value: 1000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Discount rate', min: 0.5, max: 15, step: 0.1, value: 5, unit: '%' },
        { id: 'n', label: 'Number of payments', min: 1, max: 100, step: 1, value: 30 },
        { id: 'g', label: 'Payments grow by', min: -5, max: 8, step: 0.1, value: 0, unit: '% a year' },
        { id: 'forever', type: 'check', label: 'Forever (a perpetuity)', value: !!P.forever },
        { id: 'due', type: 'check', label: 'Paid at the start of each year', value: false },
        { type: 'buttons', items: [{ id: 'build', label: 'Build it', primary: true }, { id: 'all', label: 'Show all' }] }
      ], id => {
        if (id === 'build') { kb = 0; loop.start(); return; }
        if (id === 'all') loop.stop();
        ctl.show('n', !V.forever);
        if (!loop.running) kb = Infinity;
        loop.once();
      });
      const V = ctl.values, F = kit.fin;
      ctl.show('n', !V.forever);
      const ro = kit.readout(box.side, [['pv', 'Worth today'], ['paid', 'Paid in total'], ['perp', 'Forever it would be worth'], ['share', 'Share of the forever value'], ['fv', 'Value at the end']]);
      let kb = Infinity;

      function stream() {
        const N = V.forever ? 100 : Math.max(1, Math.round(V.n)), r = V.r / 100, g = V.g / 100;
        const list = [];
        let cum = 0;
        for (let k = 1; k <= N; k++) {
          const t = V.due ? k - 1 : k, a = V.C * Math.pow(1 + g, k - 1), pv = F.pv(a, r, t);
          cum += pv;
          list.push({ k, t, a, pv, cum });
        }
        const ceil = g < r ? V.C / (r - g) * (V.due ? 1 + r : 1) : null;
        return { N, r, g, list, ceil };
      }

      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const s = stream(), { N, list, ceil } = s;
        const shown = Math.min(N, kb);
        const x0 = 70, w = W - x0 - 20, bw = w / (N + 1), X = t => x0 + (t + 0.5) * bw;
        // --- top: the payments and their value today
        const y0 = 30, h1 = Math.max(70, Hh * 0.36);
        const amax = Math.max(V.C * 1.15, Math.min(Math.max(...list.map(q => q.a)), 4 * V.C) * 1.08);
        valueAxis(c, x0, y0, w, h1, 0, amax, C, v => kit.money(v, 0, true));
        const Y1 = v => y0 + h1 - clamp(v, 0, amax) / amax * h1;
        list.forEach(q => {
          if (q.k > shown) return;
          const x = X(q.t) - bw * 0.36, wi = Math.max(1, bw * 0.72);
          c.save();
          c.strokeStyle = C.warn; c.lineWidth = bw > 5 ? 1.2 : 0.8; c.strokeRect(x, Y1(q.a), wi, y0 + h1 - Y1(q.a));
          c.fillStyle = C.accent; c.fillRect(x, Y1(q.pv), wi, y0 + h1 - Y1(q.pv));
          c.restore();
        });
        legend(kit, c, [[C.warn, 'paid'], [C.accent, 'worth today']], x0, y0 - 14, C);
        // --- bottom: the running total of present values
        const y2 = y0 + h1 + 34, h2 = Hh - y2 - 42;
        const top = Math.max(ceil != null && ceil < list[N - 1].cum * 3 ? ceil : 0, list[N - 1].cum) * 1.1;
        valueAxis(c, x0, y2, w, h2, 0, top, C, v => kit.money(v, 0, true));
        yearTicks(kit, c, x0 + 0.5 * bw, y2 + h2, N * bw, N, C, 'years');
        const Y2 = v => y2 + h2 - clamp(v, 0, top) / top * h2;
        if (ceil != null && ceil <= top) {
          polyline(c, [[x0, Y2(ceil)], [x0 + w, Y2(ceil)]], C.ok, 1.5, [6, 4]);
          kit.label(c, 'forever: ' + kit.money(ceil, 0), x0 + w, Y2(ceil) - 10, { size: 11, color: C.ok, align: 'right' });
        }
        const pts = [[X(list[0].t) - bw * 0.5, Y2(0)]];
        list.forEach(q => { if (q.k <= shown) pts.push([X(q.t), Y2(q.cum)]); });
        polyline(c, pts, C.accent, 2.6);
        const last = list[Math.max(0, Math.min(N, Math.floor(shown)) - 1)];
        if (shown >= 1) {
          kit.dot(c, X(last.t), Y2(last.cum), 5, C.accent, C.bg2);
          kit.label(c, kit.money(last.cum, 0), X(last.t) + 8, Y2(last.cum) + 12, { size: 11.5, color: C.accent, weight: 600, bg: C.bg2 });
        }
        kit.label(c, 'value today of the payments so far', x0, y2 - 14, { size: 11.5, color: C.text2 });

        // --- numbers
        const pvN = list[N - 1].cum;
        const paid = list.reduce((a, q) => a + q.a, 0);
        const fvN = list.reduce((a, q) => a + F.fv(q.a, s.r, N - q.t), 0);
        if (V.forever) {
          ro.set('pv', ceil != null ? kit.money(ceil) : 'no finite value: growth ≥ rate');
          ro.set('paid', 'without end');
          ro.set('perp', ceil != null ? kit.money(ceil) + (V.due ? ' (first payment today)' : ' = C / ' + (s.g ? '(r − g)' : 'r')) : 'none — growth ≥ rate');
          const half = ceil != null ? list.find(q => q.cum >= ceil / 2) : null;
          ro.set('share', half ? 'half of it from the first ' + half.k + ' payments' : '—');
          ro.set('fv', '—');
        } else {
          ro.set('pv', kit.money(pvN));
          ro.set('paid', kit.money(paid, 0));
          ro.set('perp', ceil != null ? kit.money(ceil, 0) : 'none — growth ≥ rate');
          ro.set('share', ceil != null ? kit.pct(pvN / ceil, 1) : '—');
          ro.set('fv', kit.money(fvN) + ' after ' + N + ' years');
        }
      }
      const loop = kit.loop(dt => {
        if (loop.running) {
          const N = V.forever ? 100 : Math.max(1, Math.round(V.n));
          if (!Number.isFinite(kb)) kb = 0;
          kb += dt * Math.max(4, N / 4);
          if (kb >= N) { kb = Infinity; loop.stop(); }
        }
        draw();
      }, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
