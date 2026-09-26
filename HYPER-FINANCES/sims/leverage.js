/* HYPER-FINANCES · sims/leverage.js — simulations for Leverage, Margin and Derivatives:
 *   lev-amplifier       the leverage amplifier: the investment's return against the return on your money
 *   lev-margin-account  a margin account over a simulated price path: equity, loan, the call line, forced sales
 *   lev-etf-drag        daily-leveraged and inverse funds on random markets: volatility drag
 *   lev-fx-position     a currency position: pip value, margin, the 50 % close-out
 *   lev-futures-mtm     a futures position marked to market every day, with margin calls
 *   lev-payoff-builder  option strategies: profit at expiry, and value today
 *   lev-option-value    Black–Scholes value against the share price and the time left; time decay
 *   lev-hedge-puts      protecting a portfolio with puts: the premium against the loss avoided
 * Every price path here is simulated (seeded, reproducible) — never market data. */
(function () {
  'use strict';

  const FONT = '11px system-ui, sans-serif';

  /* a chart frame: gridlines, tick labels and a zero line; returns the maps x -> px, y -> px */
  function frame(kit, c, o) {
    const C = o.C;
    const X = v => o.x0 + (v - o.xmin) / ((o.xmax - o.xmin) || 1) * o.w;
    const Y = v => o.y0 + o.h - (v - o.ymin) / ((o.ymax - o.ymin) || 1) * o.h;
    c.save();
    c.font = FONT; c.lineWidth = 1;
    const sy = Hyper.niceStep(o.ymax - o.ymin, o.ny || 5);
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(o.ymin / sy - 1e-9) * sy, i = 0; v <= o.ymax + sy * 1e-9 && i < 40; v += sy, i++) {
      const y = Y(v), zero = Math.abs(v) < sy * 1e-6;
      c.strokeStyle = zero ? C.axis : C.grid; c.beginPath(); c.moveTo(o.x0, y); c.lineTo(o.x0 + o.w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(o.fy ? o.fy(zero ? 0 : v) : kit.fmt(v, 3), o.x0 - 6, y);
    }
    const sx = o.sx || Hyper.niceStep(o.xmax - o.xmin, o.nx || 6);
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (let v = Math.ceil(o.xmin / sx - 1e-9) * sx, i = 0; v <= o.xmax + sx * 1e-9 && i < 60; v += sx, i++) {
      const x = X(v), zero = Math.abs(v) < sx * 1e-6;
      c.strokeStyle = zero ? C.axis : C.grid; c.beginPath(); c.moveTo(x, o.y0); c.lineTo(x, o.y0 + o.h); c.stroke();
      c.fillStyle = C.muted; c.fillText(o.fx ? o.fx(zero ? 0 : v) : kit.fmt(v, 3), x, o.y0 + o.h + 5);
    }
    c.restore();
    if (o.xlabel) kit.label(c, o.xlabel, o.x0 + o.w, o.y0 + o.h + 25, { size: 11.5, color: C.muted, align: 'right' });
    if (o.ylabel) kit.label(c, o.ylabel, o.x0 - 50, o.y0 - 13, { size: 11.5, color: C.muted });
    return { X, Y };
  }
  /* a polyline through points [[x, y], ...] in data units, clipped to the frame */
  function line(c, pts, M, o, color, width, dash) {
    c.save();
    c.beginPath(); c.rect(o.x0, o.y0 - 1, o.w, o.h + 2); c.clip();
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath();
    let pen = false;
    for (const p of pts) {
      if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) { pen = false; continue; }
      const x = M.X(p[0]), y = Math.max(o.y0 - 50, Math.min(o.y0 + o.h + 50, M.Y(p[1])));
      if (pen) c.lineTo(x, y); else c.moveTo(x, y);
      pen = true;
    }
    c.stroke();
    c.restore();
  }
  function hline(c, M, o, y, color, text, dash) {
    const Y = M.Y(y);
    if (!Number.isFinite(Y) || Y < o.y0 - 1 || Y > o.y0 + o.h + 1) return;
    c.save(); c.strokeStyle = color; c.lineWidth = 1.3; c.setLineDash(dash || [5, 4]);
    c.beginPath(); c.moveTo(o.x0, Y); c.lineTo(o.x0 + o.w, Y); c.stroke(); c.restore();
    if (text) {
      c.save(); c.font = FONT; c.fillStyle = color; c.textAlign = 'right'; c.textBaseline = 'bottom';
      c.fillText(text, o.x0 + o.w - 4, Y - 3); c.restore();
    }
  }
  function vline(c, M, o, x, color, text, dash) {
    const X = M.X(x);
    if (!Number.isFinite(X) || X < o.x0 - 1 || X > o.x0 + o.w + 1) return;
    c.save(); c.strokeStyle = color; c.lineWidth = 1.3; c.setLineDash(dash || [5, 4]);
    c.beginPath(); c.moveTo(X, o.y0); c.lineTo(X, o.y0 + o.h); c.stroke(); c.restore();
    if (text) {
      c.save(); c.font = FONT; c.fillStyle = color; c.textAlign = X > o.x0 + o.w * 0.7 ? 'right' : 'left'; c.textBaseline = 'top';
      c.fillText(text, X + (X > o.x0 + o.w * 0.7 ? -4 : 4), o.y0 + 3); c.restore();
    }
  }
  /* a row of legend entries starting at x — or ending at x when right is true */
  function legend(kit, c, x, y, items, C, right) {
    c.font = '11.5px system-ui, sans-serif';
    let xx = x;
    if (right) xx = x - items.reduce((a, it) => a + 21 + c.measureText(it[1]).width + 16, 0) + 16;
    for (const [col, t, dash] of items) {
      c.save(); c.strokeStyle = col; c.lineWidth = 3; c.setLineDash(dash || []);
      c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + 16, y); c.stroke(); c.restore();
      kit.label(c, t, xx + 21, y, { size: 11.5, color: C.text2 });
      c.font = '11.5px system-ui, sans-serif';
      xx += 21 + c.measureText(t).width + 16;
    }
  }
  const pctTick = v => Math.round(v * 100) + ' %';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ================================================================ the leverage amplifier */
  Hyper.sim('lev-amplifier', {
    title: 'The leverage amplifier',
    blurb: `The chart turns the investment's return (across) into the return on **your own money** (up). The grey dashed line is investing without borrowing; the coloured line is your leverage, after the interest on the loan. The bars on the right show the position before and after: the loan does not shrink when the price falls, so the whole loss lands on your part.

- Leave the return at +15 % and raise the leverage: the gain grows — then set the return to −15 %.
- The lines cross where the investment earns exactly the loan's rate: below that, borrowing makes you poorer than not borrowing. The green mark is lower still — where your own money merely breaks even. Raise the borrowing rate and watch both move.
- Set 30 : 1 and move the return by just a few per cent. The red zone is where you owe more than you put in.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Leverage', min: 1, max: 30, value: (params && params.L) || 2, log: true, sig: 2, fmt: v => (v < 10 ? v.toFixed(1) : v.toFixed(0)) + ' : 1' },
        { id: 'ra', label: 'Return of the investment', min: -60, max: 60, step: 1, value: 15, unit: '%' },
        { id: 'rb', label: 'Interest on the loan', min: 0, max: 20, step: 0.25, value: 6, unit: '%' },
        { id: 'E', label: 'Your own money', min: 1000, max: 100000, value: 10000, log: true, sig: 2, fmt: v => kit.money(v, 0) }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pos', 'Position'], ['loan', 'Borrowed'], ['res', 'Result on your money'], ['cmp', 'Without borrowing'],
        ['beat', 'Beats not borrowing when'], ['be', 'Your money breaks even at'], ['wipe', 'Fall that wipes you out'], ['after', 'Leverage afterwards']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const L = Math.max(1, V.L), ra = V.ra / 100, rb = V.rb / 100, E0 = V.E;
        const A0 = L * E0, D0 = A0 - E0, A1 = A0 * (1 + ra), D1 = D0 * (1 + rb), E1 = A1 - D1;
        const R = kit.fin.leveraged(ra, L, rb);
        const wipe = 1 - (L - 1) * (1 + rb) / L;           // fall of the investment that leaves nothing, interest included
        const be = (L - 1) / L * rb;

        // left: the amplifier chart
        const o = { C, x0: 58, y0: 34, w: Math.max(120, W * 0.62 - 70), h: Hh - 34 - 44, xmin: -0.6, xmax: 0.6, ymin: -1.5, ymax: 1.5, fx: pctTick, fy: pctTick, ny: 6, nx: 6,
          xlabel: 'return of the investment', ylabel: 'return on your money' };
        const M = frame(kit, c, o);
        // the zone where your money is more than gone
        c.save(); c.fillStyle = C.bad; c.globalAlpha = 0.12; c.fillRect(o.x0, M.Y(-1), o.w, o.y0 + o.h - M.Y(-1)); c.restore();
        kit.label(c, 'you owe more than you put in', o.x0 + 6, M.Y(-1) + 11, { size: 11, color: C.bad });
        const pts1 = [], ptsL = [];
        for (let x = -0.6; x <= 0.6001; x += 0.01) { pts1.push([x, x]); ptsL.push([x, kit.fin.leveraged(x, L, rb)]); }
        line(c, pts1, M, o, C.muted, 1.6, [6, 4]);
        line(c, ptsL, M, o, C.accent, 2.6);
        if (L > 1.01) {
          vline(c, M, o, be, C.ok, 'your money breaks even', [3, 3]);
          kit.dot(c, M.X(rb), M.Y(rb), 4, C.text, C.bg2);
          kit.label(c, 'loan rate', M.X(rb) + 7, M.Y(rb) + 10, { size: 11, color: C.muted });
          if (-wipe >= -0.6) vline(c, M, o, -wipe, C.bad, 'wiped out at ' + kit.pct(-wipe, 1), [3, 3]);
        }
        const py = M.Y(clamp(R, -1.5, 1.5));
        kit.dot(c, M.X(ra), py, 6, R >= 0 ? C.ok : C.bad, C.bg2);
        legend(kit, c, o.x0 + o.w, 14, [[C.accent, 'at ' + (L < 10 ? L.toFixed(1) : L.toFixed(0)) + ' : 1'], [C.muted, 'no borrowing', [6, 4]]], C, true);

        // right: the position before and after
        const bx0 = o.x0 + o.w + 40, bw = Math.max(30, (W - bx0 - 20) / 2 - 18), top = 44, bh = Hh - top - 50;
        const max = Math.max(A0, A1, D1) * 1.08 || 1;
        const sy = v => top + bh - v / max * bh;
        const bar = (x, assets, loan, title) => {
          const lo = Math.min(assets, loan);
          c.fillStyle = C.warn; c.fillRect(x, sy(lo), bw, sy(0) - sy(lo));
          if (assets > loan) { c.fillStyle = C.accent; c.fillRect(x, sy(assets), bw, sy(loan) - sy(assets)); }
          else if (loan > assets) {
            c.save(); c.strokeStyle = C.bad; c.lineWidth = 2; c.setLineDash([4, 3]); c.strokeRect(x + 1, sy(loan), bw - 2, sy(assets) - sy(loan)); c.restore();
          }
          kit.label(c, title, x + bw / 2, top + bh + 14, { size: 11.5, color: C.text2, align: 'center' });
          kit.label(c, kit.money(assets, 0, true), x + bw / 2, sy(Math.max(assets, loan)) - 10, { size: 11, color: C.text, align: 'center' });
        };
        bar(bx0, A0, D0, 'start');
        bar(bx0 + bw + 36, A1, D1, 'after a year');
        c.fillStyle = C.accent; c.fillRect(bx0, 12, 11, 11); kit.label(c, 'yours', bx0 + 15, 18, { size: 11.5, color: C.text2 });
        c.fillStyle = C.warn; c.fillRect(bx0 + 62, 12, 11, 11); kit.label(c, 'owed', bx0 + 77, 18, { size: 11.5, color: C.text2 });

        ro.set('pos', kit.money(A0, 0));
        ro.set('loan', D0 > 0 ? kit.money(D0, 0) + ' at ' + kit.pct(rb, 2) : 'nothing');
        ro.set('res', (E1 - E0 >= 0 ? '+' : '') + kit.money(E1 - E0, 0) + ' (' + (R >= 0 ? '+' : '') + kit.pct(R, 1) + ')');
        ro.set('cmp', (ra >= 0 ? '+' : '') + kit.pct(ra, 1));
        ro.set('beat', L > 1.01 ? 'the investment beats ' + kit.pct(rb, 2) : '— (no loan)');
        ro.set('be', L > 1.01 ? 'an investment return of ' + kit.pct(be, 2) : '— (no loan)');
        ro.set('wipe', kit.pct(wipe, 1) + (L > 1.01 ? ' (1/L = ' + kit.pct(1 / L, 1) + ')' : ''));
        ro.set('after', E1 > 0 ? (A1 / E1).toFixed(2) + ' : 1' : 'your money is gone');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ a margin account */
  Hyper.sim('lev-margin-account', {
    title: 'A margin account on a simulated share',
    blurb: `You put in ¤10,000 and buy a share at ¤100 with a margin loan; the price then follows a **simulated** random path for two years. Top: the value of your shares, the loan, and the red **call line** — the value the shares must stay above (loan ÷ (1 − maintenance margin)). The shaded band is your equity. Bottom: your margin against the maintenance level. The dashed grey line is someone who bought with the same ¤10,000 in cash.

- Press **New path** a few times: how often does borrowing half (50 %) bring a call? And borrowing a quarter (75 %)?
- Switch **When a call comes** to *Broker sells everything*, find a path with a call followed by a recovery, and compare the two investors at the end.
- Raise the volatility: calls come sooner and more often, and selling at the bottom costs more.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'm0', label: 'Your share of the purchase (initial margin)', min: 25, max: 100, step: 5, value: (params && params.m0) || 50, unit: '%' },
        { id: 'mm', label: 'Maintenance margin', min: 15, max: 60, step: 5, value: 25, unit: '%' },
        { id: 'sigma', label: 'Volatility of the share', min: 10, max: 80, step: 5, value: (params && params.sigma) || 30, unit: '%' },
        { id: 'mu', label: 'Expected return a year', min: -10, max: 20, step: 1, value: 7, unit: '%' },
        { id: 'rb', label: 'Margin interest', min: 0, max: 15, step: 0.5, value: 8, unit: '%' },
        { id: 'resp', type: 'select', label: 'When a call comes', options: [['Broker sells enough to restore the margin', 'sell'], ['You deposit the shortfall in cash', 'deposit'], ['Broker sells everything', 'all']], value: 'sell' },
        { type: 'buttons', items: [{ id: 'new', label: 'New path', primary: true }, { id: 'replay', label: 'Replay' }] }
      ], (id) => {
        if (id === 'new') { seed++; simulate(); play(); return; }
        if (id === 'replay') { play(); return; }
        simulate(); shown = N; loop.once();
      });
      const ro = kit.readout(box.side, [['day', 'Day'], ['price', 'Share price'], ['eq', 'Your equity'], ['mg', 'Margin'], ['calls', 'Margin calls'], ['act', 'Deposited / sold'], ['res', 'Your result'], ['cash', 'Cash buyer\'s result']]);
      const V = ctl.values;
      const E0 = 10000, N = 504, dt = 1 / 252;
      let seed = 7, rows = [], shown = 0, stats = null;

      function simulate() {
        const g = kit.fin.normals(seed * 7919 + 13);
        const m0 = V.m0 / 100, mm = V.mm / 100, s = V.sigma / 100, mu = V.mu / 100, rb = V.rb / 100;
        let P = 100, n = E0 / (m0 * P), D = n * P - E0, out = false, deposits = 0, sold = 0, calls = 0, firstCall = -1, low = 1;
        const cashN = E0 / P;
        rows = [{ k: 0, P, value: n * P, loan: D, eq: n * P - D, m: m0, cash: E0, call: 0, dep: 0, sold: 0 }];
        for (let k = 1; k <= N; k++) {
          P *= Math.exp((mu - s * s / 2) * dt + s * Math.sqrt(dt) * g());
          if (!out && D > 0) D *= 1 + rb * dt;
          let value = n * P, call = 0;
          let m = value > 0 ? (value - D) / value : 0;
          if (!out && n > 0 && D > 0 && m < mm) {
            calls++; if (firstCall < 0) firstCall = k;
            const S = D - (1 - mm) * value;               // the shortfall
            if (V.resp === 'deposit') { D -= S; deposits += S; call = 1; }
            else {
              const X = V.resp === 'all' ? value : Math.min(value, S / mm);   // selling adds no equity: sell S / mm
              n -= X / P; D -= X; sold += X; call = 2;
              if (n * P < 1e-6) { n = 0; out = true; }
            }
            value = n * P;
            m = value > 0 ? (value - D) / value : 0;
          }
          low = Math.min(low, m);
          rows.push({ k, P, value, loan: D, eq: value - D, m, cash: cashN * P, call, dep: deposits, sold });
        }
        stats = { deposits, sold, calls, firstCall, low };
      }
      function play() { shown = 0; loop.start(); }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        if (!rows.length) return;
        const k = Math.max(0, Math.min(N, Math.floor(shown)));
        const vis = rows.slice(0, k + 1);
        const r = rows[k];
        const mm = V.mm / 100;
        // top: money
        const maxV = Math.max(...rows.map(q => Math.max(q.value, q.cash, q.loan / (1 - mm)))) * 1.08;
        const hTop = Math.round((Hh - 60) * 0.62), hBot = Hh - 60 - hTop - 34;
        const o = { C, x0: 64, y0: 26, w: W - 64 - 16, h: hTop, xmin: 0, xmax: N, ymin: 0, ymax: Math.max(1, maxV), sx: 63, fx: v => '', fy: v => kit.money(v, 0, true), ny: 4 };
        const M = frame(kit, c, o);
        // equity band
        c.save(); c.beginPath(); c.rect(o.x0, o.y0, o.w, o.h); c.clip();
        c.fillStyle = C.accent; c.globalAlpha = 0.16; c.beginPath();
        vis.forEach((q, i) => { const x = M.X(q.k), y = M.Y(q.value); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
        for (let i = vis.length - 1; i >= 0; i--) c.lineTo(M.X(vis[i].k), M.Y(Math.max(0, Math.min(vis[i].value, vis[i].loan))));
        c.closePath(); c.fill(); c.restore();
        line(c, vis.map(q => [q.k, q.cash]), M, o, C.muted, 1.6, [6, 4]);
        line(c, vis.map(q => [q.k, q.loan > 0 && q.value > 0 ? q.loan / (1 - mm) : NaN]), M, o, C.bad, 1.5, [4, 3]);
        line(c, vis.map(q => [q.k, Math.max(0, q.loan)]), M, o, C.warn, 2);
        line(c, vis.map(q => [q.k, q.value]), M, o, C.text, 2.2);
        for (const q of vis) if (q.call) kit.dot(c, M.X(q.k), M.Y(q.value), 3.5, C.bad);
        legend(kit, c, o.x0 + 4, 12, [[C.text, 'your shares'], [C.warn, 'loan'], [C.bad, 'call line', [4, 3]], [C.muted, 'cash buyer', [6, 4]]], C);
        // bottom: margin
        const ob = { C, x0: 64, y0: o.y0 + hTop + 30, w: o.w, h: Math.max(40, hBot), xmin: 0, xmax: N, ymin: 0, ymax: 1, sx: 63, fx: v => Math.round(v / 21) + ' mo', fy: pctTick, ny: 2 };
        const Mb = frame(kit, c, ob);
        hline(c, Mb, ob, mm, C.bad, 'maintenance ' + V.mm + ' %');
        hline(c, Mb, ob, V.m0 / 100, C.muted, '');
        line(c, vis.map(q => [q.k, q.value > 0 ? clamp(q.m, 0, 1) : NaN]), Mb, ob, C.accent, 2);
        kit.label(c, 'margin (equity ÷ value)', ob.x0 + 4, ob.y0 - 9, { size: 11.5, color: C.muted });

        ro.set('day', k + ' of ' + N + ' (month ' + (k / 21).toFixed(1) + ')');
        ro.set('price', kit.money(r.P) + ' (simulated)');
        ro.set('eq', kit.money(r.eq, 0));
        ro.set('mg', r.value > 0 ? kit.pct(r.m, 1) : (r.eq >= 0 ? 'all sold' : 'negative'));
        const callsSoFar = vis.filter(q => q.call).length;
        ro.set('calls', callsSoFar ? callsSoFar + ' (first on day ' + vis.find(q => q.call).k + ')' : 'none');
        const dep = r.dep;
        ro.set('act', V.resp === 'deposit' ? kit.money(dep, 0) + ' deposited' : kit.money(r.sold, 0) + ' of shares sold');
        const inv = E0 + dep;
        ro.set('res', kit.money(r.eq - inv, 0) + ' (' + kit.pct((r.eq - inv) / inv, 1) + ')');
        ro.set('cash', kit.money(r.cash - E0, 0) + ' (' + kit.pct((r.cash - E0) / E0, 1) + ')');
      }
      const loop = kit.loop((dt2) => {
        if (shown < N) { shown = Math.min(N, shown + Math.max(1, dt2 * 140)); draw(); }
        else { draw(); loop.stop(); }
      }, box.stage);
      simulate();
      play();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ leveraged ETFs */
  Hyper.sim('lev-etf-drag', {
    title: 'Leveraged funds on random markets',
    blurb: `A **simulated** index moves at random each trading day; a fund resets every day to the chosen leverage. The dashed line is what "L times the index" would have given over the whole period. The read-outs also run 300 different random markets with the same settings.

- With 3× and 20 % volatility press **New market** several times: the fund usually trails the dashed line; now and then, in a smooth rise, it beats it.
- Set the trend to 0 %: the index wanders around where it started, the 3× fund drifts down — the volatility drag. Compare the drag formula in the read-out.
- Raise the volatility to 50 % and look at the share of markets where the fund lost money while the index rose.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'L', type: 'select', label: 'Fund', options: [['3× daily', 3], ['2× daily', 2], ['−1× daily (inverse)', -1], ['−2× daily (inverse)', -2], ['−3× daily (inverse)', -3]], value: (params && params.L) || 3 },
        { id: 'sigma', label: 'Index volatility', min: 5, max: 80, step: 1, value: 20, unit: '%' },
        { id: 'mu', label: 'Index trend a year', min: -30, max: 30, step: 1, value: 7, unit: '%' },
        { id: 'T', label: 'Years held', min: 0.25, max: 5, step: 0.25, value: 1 },
        { id: 'fee', label: 'Fees and financing a year', min: 0, max: 3, step: 0.1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New market', primary: true }] }
      ], (id) => { if (id === 'new') seed++; solve(); loop.once(); });
      const ro = kit.readout(box.side, [['idx', 'Index'], ['fund', 'Fund'], ['naive', 'L × the index'], ['formula', 'Drag formula says'], ['med', '300 markets: median fund'], ['lost', 'Fund lost money'], ['trap', 'Index rose, fund lost']]);
      const V = ctl.values;
      let seed = 3, path = [], many = null;

      function returnsFor(sd, days) {
        const g = kit.fin.normals(sd);
        const m = V.mu / 100 / 252, s = V.sigma / 100 / Math.sqrt(252);
        const out = new Array(days);
        for (let k = 0; k < days; k++) out[k] = Math.max(-0.95, m + s * g());
        return out;
      }
      function solve() {
        const days = Math.max(1, Math.round(V.T * 252)), L = V.L, fee = V.fee / 100;
        path = kit.fin.leveragedPath(returnsFor(seed * 104729 + 1, days), L).map(([k, u, v]) => [k, u, v * Math.exp(-fee * k / 252)]);
        const finals = [];
        let lost = 0, trap = 0;
        for (let j = 0; j < 300; j++) {
          const p = kit.fin.leveragedPath(returnsFor(900001 + j * 7717, days), L);
          const [k, u, v0] = p[p.length - 1];
          const v = v0 * Math.exp(-fee * k / 252);
          finals.push(v);
          if (v < 1) lost++;
          if ((L > 0 ? u > 1 : u < 1) && v < 1) trap++;
        }
        finals.sort((a, b) => a - b);
        many = { med: finals[150], lost: lost / 300, trap: trap / 300 };
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        if (!path.length) return;
        const L = V.L, days = path.length - 1;
        const naive = path.map(([k, u]) => [k / 252, Math.max(0, 1 + L * (u - 1))]);
        const all = path.map(p => Math.max(p[1], p[2])).concat(naive.map(p => p[1]));
        const ymax = Math.max(1.2, ...all) * 1.05, ymin = Math.min(0.8, ...path.map(p => Math.min(p[1], p[2])), ...naive.map(p => p[1])) * 0.95;
        const o = { C, x0: 64, y0: 30, w: W - 64 - 16, h: Hh - 30 - 44, xmin: 0, xmax: days / 252, ymin: Math.max(0, ymin), ymax,
          fx: v => (Math.round(v * 100) / 100) + ' yr', fy: v => kit.money(v * 10000, 0, true), ny: 5, xlabel: 'time (simulated trading days)', ylabel: 'value of ' + kit.money(10000, 0) };
        const M = frame(kit, c, o);
        hline(c, M, o, 1, C.faint, '', [2, 3]);
        line(c, naive, M, o, C.warn, 1.8, [6, 4]);
        line(c, path.map(([k, u]) => [k / 252, u]), M, o, C.muted, 1.8);
        line(c, path.map(([k, , v]) => [k / 252, v]), M, o, C.accent, 2.5);
        const lab = (L > 0 ? L + '×' : '−' + (-L) + '×') + ' fund';
        legend(kit, c, o.x0 + o.w, 14, [[C.muted, 'index'], [C.accent, lab], [C.warn, L + ' × the index\'s return', [6, 4]]], C, true);

        const last = path[path.length - 1], u = last[1], v = last[2];
        const T = days / 252, s = V.sigma / 100;
        const pred = Math.pow(u, L) * Math.exp(-(L * L - L) * s * s * T / 2) * Math.exp(-V.fee / 100 * T);
        ro.set('idx', kit.pct(u - 1, 1));
        ro.set('fund', kit.pct(v - 1, 1));
        ro.set('naive', kit.pct(Math.max(-1, L * (u - 1)), 1));
        ro.set('formula', kit.pct(pred - 1, 1) + ' (drag ' + kit.pct(1 - Math.exp(-(L * L - L) * s * s * T / 2), 1) + ')');
        if (many) {
          ro.set('med', kit.pct(many.med - 1, 1));
          ro.set('lost', kit.pct(many.lost, 0) + ' of markets');
          ro.set('trap', kit.pct(many.trap, 0) + (L > 0 ? ' (index up, fund down)' : ' (index down, fund down)'));
        }
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ a forex position */
  Hyper.sim('lev-fx-position', {
    title: 'A currency position and its close-out',
    blurb: `A **simulated** exchange rate starts at 1.1000 and moves hour by hour for eight weeks of trading. Your account is in the quote currency; the provider closes the position when your equity falls to **half the required margin** (the EU and UK rule), shown by the red line.

- With the defaults (a ¤1,000 deposit, 0.27 lots ≈ ¤30,000 at 30 : 1) press **New path** a few times: how long does the position usually survive?
- Keep the deposit and cut the size to 0.03 lots. The close-out moves far away: effective leverage, not the leverage offered, decides the risk.
- Choose 500 : 1 and a size the margin allows: the close-out is a few pips away and the spread alone eats into it.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'dep', label: 'Deposit', min: 100, max: 20000, value: 1000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'lots', label: 'Size (lots of 100,000)', min: 0.01, max: 5, value: 0.27, log: true, sig: 2, fmt: v => v.toFixed(v < 0.1 ? 3 : 2) + ' lots' },
        { id: 'lev', type: 'select', label: 'Leverage offered', options: [['30 : 1 (EU, UK, Australia: major pairs)', 30], ['20 : 1 (other pairs)', 20], ['50 : 1 (US: major pairs)', 50], ['100 : 1', 100], ['500 : 1 (offshore)', 500]], value: 30 },
        { id: 'dir', type: 'select', label: 'Direction', options: [['Buy the base currency', 1], ['Sell the base currency', -1]], value: 1 },
        { id: 'sigma', label: 'Volatility of the pair', min: 3, max: 20, step: 0.5, value: 8, unit: '%' },
        { id: 'spread', label: 'Spread', min: 0, max: 5, step: 0.1, value: 1, unit: 'pips' },
        { type: 'buttons', items: [{ id: 'new', label: 'New path', primary: true }, { id: 'replay', label: 'Replay' }] }
      ], (id) => {
        if (id === 'new') { seed++; simulate(); play(); return; }
        if (id === 'replay') { play(); return; }
        simulate(); shown = N; loop.once();
      });
      const ro = kit.readout(box.side, [['pos', 'Position'], ['mar', 'Margin required'], ['eff', 'Effective leverage'], ['pip', 'One pip'], ['one', 'A 1 % move'], ['stop', 'Close-out'], ['now', 'Status']]);
      const V = ctl.values;
      const X0 = 1.1, PIP = 0.0001, N = 960;
      let seed = 11, rate = [], shown = 0, trade = null;

      function simulate() {
        const g = kit.fin.normals(seed * 6151 + 5);
        const s = V.sigma / 100 / Math.sqrt(252 * 24);
        rate = [X0];
        let x = X0;
        for (let k = 1; k <= N; k++) { x *= Math.exp(s * g()); rate.push(x); }
        const u = V.lots * 100000, notional = u * X0, margin = notional / V.lev, cost = V.spread * PIP * u;
        const can = margin <= V.dep;
        const stopDist = (V.dep - 0.5 * margin - cost) / u;       // in price units
        const stopRate = X0 - V.dir * stopDist;
        let closedAt = -1;
        const eq = [];
        for (let k = 0; k <= N; k++) {
          if (!can) { eq.push(V.dep); continue; }
          if (closedAt >= 0) { eq.push(eq[closedAt]); continue; }
          const e = V.dep + V.dir * u * (rate[k] - X0) - cost;
          if (e <= 0.5 * margin) closedAt = k;
          eq.push(Math.max(0, e));                                  // negative balance protection
        }
        trade = { u, notional, margin, cost, can, stopDist, stopRate, closedAt, eq };
      }
      function play() { shown = 0; loop.start(); }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        if (!trade) return;
        const k = Math.max(0, Math.min(N, Math.floor(shown)));
        const t = trade;
        const end = t.closedAt >= 0 ? Math.min(k, t.closedAt) : k;
        const hTop = Math.round((Hh - 64) * 0.6), hBot = Hh - 64 - hTop - 30;
        const vals = rate.slice(0, k + 1).concat([X0 * 1.002, X0 * 0.998]).concat(t.can && Math.abs(t.stopDist) < 0.25 ? [t.stopRate] : []);
        const lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo) * 0.08 || 0.001;
        const o = { C, x0: 64, y0: 26, w: W - 64 - 16, h: hTop, xmin: 0, xmax: N, ymin: lo - pad, ymax: hi + pad, sx: 120, fx: v => '', fy: v => v.toFixed(4), ny: 4 };
        const M = frame(kit, c, o);
        hline(c, M, o, X0, C.muted, 'entry 1.1000');
        if (t.can) hline(c, M, o, t.stopRate, C.bad, 'close-out ' + t.stopRate.toFixed(4));
        line(c, rate.slice(0, k + 1).map((x, i) => [i, x]), M, o, C.text, 1.8);
        if (t.closedAt >= 0 && k >= t.closedAt) kit.dot(c, M.X(t.closedAt), M.Y(rate[t.closedAt]), 6, C.bad, C.bg2);
        kit.label(c, 'exchange rate (simulated)', o.x0 + 4, 12, { size: 11.5, color: C.muted });
        const ob = { C, x0: 64, y0: o.y0 + hTop + 28, w: o.w, h: Math.max(40, hBot), xmin: 0, xmax: N, ymin: 0, ymax: Math.max(V.dep, ...t.eq.slice(0, k + 1)) * 1.1, sx: 120,
          fx: v => 'wk ' + Math.round(v / 120), fy: v => kit.money(v, 0, true), ny: 2 };
        const Mb = frame(kit, c, ob);
        hline(c, Mb, ob, V.dep, C.muted, '');
        if (t.can) hline(c, Mb, ob, 0.5 * t.margin, C.bad, 'close-out at half the margin');
        line(c, t.eq.slice(0, end + 1).map((e, i) => [i, e]), Mb, ob, C.accent, 2);
        kit.label(c, 'your equity', ob.x0 + 4, ob.y0 - 9, { size: 11.5, color: C.muted });
        if (!t.can) kit.label(c, 'This position needs ' + kit.money(t.margin, 0) + ' of margin — more than the deposit. It cannot be opened.', o.x0 + o.w / 2, o.y0 + o.h / 2, { size: 13, color: C.bad, align: 'center', bg: C.bg2 });

        ro.set('pos', Hyper.util.group(Math.round(t.u), 0) + ' units = ' + kit.money(t.notional, 0));
        ro.set('mar', kit.money(t.margin, 0) + ' (' + kit.pct(t.margin / V.dep, 0) + ' of the deposit)');
        ro.set('eff', (t.notional / V.dep).toFixed(1) + ' : 1');
        ro.set('pip', kit.money(t.u * PIP));
        ro.set('one', kit.money(t.notional * 0.01, 0) + ' = ' + kit.pct(t.notional * 0.01 / V.dep, 0) + ' of the deposit');
        ro.set('stop', t.can ? (t.stopDist > 0 ? Math.round(t.stopDist / PIP) + ' pips, ' + kit.pct(t.stopDist / X0, 2) + ' against you' : 'immediately: the spread alone') : '—');
        if (!t.can) ro.set('now', 'not opened');
        else if (t.closedAt >= 0 && k >= t.closedAt) ro.set('now', 'closed out after ' + (t.closedAt / 24).toFixed(1) + ' trading days: ' + kit.money(t.eq[t.closedAt] - V.dep, 0));
        else ro.set('now', 'open, ' + ((t.eq[k] - V.dep) >= 0 ? '+' : '') + kit.money(t.eq[k] - V.dep, 0));
      }
      const loop = kit.loop((dt) => {
        if (shown < N) { shown = Math.min(N, shown + Math.max(1, dt * 200)); draw(); }
        else { draw(); loop.stop(); }
      }, box.stage);
      simulate();
      play();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ futures, marked to market */
  Hyper.sim('lev-futures-mtm', {
    title: 'A futures position, marked to market',
    blurb: `One index future at 5,000 points, worth ¤50 a point (¤250,000 of index), on a **simulated** index. Every trading day the gain or loss is settled in cash: top, the futures price; bottom, your margin account with its initial and maintenance levels. Red dots are margin calls; the table lists them.

- With the defaults press **New path** a few times and count the calls in three months. Each one is cash you must find within a day.
- Lower the initial margin to 3 %: leverage above 30 : 1, and calls on ordinary days.
- Switch to **Close the position** and find a path that is called early and ends in profit: the position was right, but you were not there to see it.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'dir', type: 'select', label: 'Position', options: [['Long (bought)', 1], ['Short (sold)', -1]], value: 1 },
        { id: 'n', label: 'Contracts', min: 1, max: 10, step: 1, value: 1 },
        { id: 'im', label: 'Initial margin (share of the contract)', min: 3, max: 20, step: 0.5, value: 6, unit: '%' },
        { id: 'mmr', label: 'Maintenance (share of initial margin)', min: 50, max: 95, step: 5, value: 80, unit: '%' },
        { id: 'sigma', label: 'Index volatility', min: 10, max: 60, step: 1, value: 20, unit: '%' },
        { id: 'days', label: 'Trading days', min: 20, max: 250, step: 5, value: 63 },
        { id: 'resp', type: 'select', label: 'On a margin call', options: [['Pay in cash up to the initial margin', 'pay'], ['Close the position', 'close']], value: 'pay' },
        { type: 'buttons', items: [{ id: 'new', label: 'New path', primary: true }, { id: 'replay', label: 'Replay' }] }
      ], (id) => {
        if (id === 'new') { seed++; simulate(); play(); return; }
        if (id === 'replay') { play(); return; }
        simulate(); shown = rows.length - 1; loop.once();
      });
      const ro = kit.readout(box.side, [['val', 'Contract value'], ['lev', 'Leverage'], ['move', 'A 1 % move'], ['acct', 'Account'], ['calls', 'Margin calls'], ['paid', 'Cash put in'], ['pl', 'Gain or loss']]);
      const tbl = kit.table(box.stage, [
        { label: 'Day', key: 'k', align: 'left' }, { label: 'Settlement', key: 'F', fmt: v => v.toFixed(1) },
        { label: 'Change', key: 'd', fmt: v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) }, { label: 'Gain or loss', key: 'pl', fmt: v => kit.money(v, 0) },
        { label: 'Account', key: 'acct', fmt: v => kit.money(v, 0) }, { label: 'Call', key: 'call', fmt: v => v > 0 ? 'pay in ' + kit.money(v, 0) : v < 0 ? 'position closed' : '' }
      ], { maxHeight: 170 });
      const V = ctl.values;
      const F0 = 5000, MULT = 50;
      let seed = 5, rows = [], shown = 0, lastK = -1, info = null;

      function simulate() {
        const g = kit.fin.normals(seed * 3571 + 7);
        const dt = 1 / 252, s = V.sigma / 100, n = Math.round(V.n), dir = V.dir;
        const IM = V.im / 100 * F0 * MULT, MM = IM * V.mmr / 100;
        let F = F0, acct = IM * n, paid = acct, open = true, cum = 0, closedDay = -1;
        rows = [{ k: 0, F, d: 0, pl: 0, acct, call: 0, paid, cum: 0 }];
        for (let k = 1; k <= Math.round(V.days); k++) {
          const Fn = F * Math.exp(s * Math.sqrt(dt) * g() - s * s * dt / 2);
          const d = Fn - F;
          F = Fn;
          const pl = open ? dir * d * MULT * n : 0;
          acct += pl; cum += pl;
          let call = 0;
          if (open && acct < MM * n) {
            if (V.resp === 'pay') { call = IM * n - acct; acct = IM * n; paid += call; }
            else { call = -1; open = false; closedDay = k; }
          }
          rows.push({ k, F, d, pl, acct, call, paid, cum });
        }
        info = { IM, MM, n, closedDay };
        lastK = -1;
      }
      function play() { shown = 0; loop.start(); }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        if (!rows.length) return;
        const N = rows.length - 1, k = Math.max(0, Math.min(N, Math.floor(shown)));
        const vis = rows.slice(0, k + 1), r = rows[k];
        const hTop = Math.round((Hh - 62) * 0.5), hBot = Hh - 62 - hTop - 30;
        const lo = Math.min(F0, ...rows.map(q => q.F)), hi = Math.max(F0, ...rows.map(q => q.F)), pad = (hi - lo) * 0.08 + 1;
        const o = { C, x0: 64, y0: 24, w: W - 64 - 16, h: hTop, xmin: 0, xmax: N, ymin: lo - pad, ymax: hi + pad, fx: v => '', fy: v => v.toFixed(0), ny: 3 };
        const M = frame(kit, c, o);
        hline(c, M, o, F0, C.muted, 'opened at 5,000');
        line(c, vis.map(q => [q.k, q.F]), M, o, C.text, 2);
        kit.label(c, 'futures price, index points (simulated)', o.x0 + 4, 11, { size: 11.5, color: C.muted });
        const accts = rows.map(q => q.acct);
        const amin = Math.min(0, ...accts), amax = Math.max(info.IM * info.n * 1.3, ...accts) * 1.05;
        const ob = { C, x0: 64, y0: o.y0 + hTop + 28, w: o.w, h: Math.max(40, hBot), xmin: 0, xmax: N, ymin: amin, ymax: amax, fx: v => 'day ' + Math.round(v), fy: v => kit.money(v, 0, true), ny: 3 };
        const Mb = frame(kit, c, ob);
        hline(c, Mb, ob, info.IM * info.n, C.muted, 'initial margin');
        hline(c, Mb, ob, info.MM * info.n, C.bad, 'maintenance');
        line(c, vis.map(q => [q.k, q.acct]), Mb, ob, C.accent, 2.2);
        for (const q of vis) if (q.call) kit.dot(c, Mb.X(q.k), Mb.Y(q.call > 0 ? q.acct - q.call : q.acct), 4, C.bad);
        kit.label(c, 'your margin account', ob.x0 + 4, ob.y0 - 9, { size: 11.5, color: C.muted });

        const value = F0 * MULT * info.n;
        ro.set('val', info.n + ' × ' + kit.money(F0 * MULT, 0) + ' = ' + kit.money(value, 0));
        ro.set('lev', (F0 * MULT / info.IM).toFixed(1) + ' : 1');
        ro.set('move', kit.money(0.01 * value, 0) + ' = ' + kit.pct(0.01 * F0 * MULT / info.IM, 0) + ' of the initial margin');
        ro.set('acct', kit.money(r.acct, 0));
        const calls = vis.filter(q => q.call);
        ro.set('calls', calls.length ? calls.length + (info.closedDay > 0 && k >= info.closedDay ? ' (closed on day ' + info.closedDay + ')' : '') : 'none so far');
        ro.set('paid', kit.money(r.paid, 0));
        ro.set('pl', (r.cum >= 0 ? '+' : '') + kit.money(r.cum, 0) + ' (' + kit.pct(r.cum / r.paid, 1) + ' of the cash put in)');
        if (k !== lastK) {
          lastK = k;
          tbl.set(vis.filter(q => q.call || q.k === 0 || q.k === k).slice(-12).reverse().map(q => Object.assign({}, q, { _cls: q.call ? 'hl' : '' })));
        }
      }
      const loop = kit.loop((dt) => {
        if (shown < rows.length - 1) { shown = Math.min(rows.length - 1, shown + Math.max(0.5, dt * 30)); draw(); }
        else { draw(); loop.stop(); }
      }, box.stage);
      simulate();
      play();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ option payoffs */
  // legs: [type, which strike ('K1' | 'K2' | null for the share), quantity (+1 bought, −1 sold)]
  const PRESETS = {
    call: { name: 'Bought call', legs: [['call', 'K2', 1]], K1: 45, K2: 55, uses: ['K2'] },
    put: { name: 'Bought put', legs: [['put', 'K1', 1]], K1: 45, K2: 55, uses: ['K1'] },
    covered: { name: 'Covered call', legs: [['stock', null, 1], ['call', 'K2', -1]], K1: 45, K2: 55, uses: ['K2'] },
    protective: { name: 'Protective put', legs: [['stock', null, 1], ['put', 'K1', 1]], K1: 45, K2: 55, uses: ['K1'] },
    collar: { name: 'Collar', legs: [['stock', null, 1], ['put', 'K1', 1], ['call', 'K2', -1]], K1: 45, K2: 55, uses: ['K1', 'K2'] },
    bull: { name: 'Bull call spread', legs: [['call', 'K1', 1], ['call', 'K2', -1]], K1: 50, K2: 55, uses: ['K1', 'K2'] },
    bear: { name: 'Bear put spread', legs: [['put', 'K2', 1], ['put', 'K1', -1]], K1: 45, K2: 50, uses: ['K1', 'K2'] },
    straddle: { name: 'Long straddle', legs: [['call', 'K1', 1], ['put', 'K1', 1]], K1: 50, K2: 55, uses: ['K1'] },
    strangle: { name: 'Long strangle', legs: [['put', 'K1', 1], ['call', 'K2', 1]], K1: 45, K2: 55, uses: ['K1', 'K2'] },
    shortstrangle: { name: 'Short strangle', legs: [['put', 'K1', -1], ['call', 'K2', -1]], K1: 45, K2: 55, uses: ['K1', 'K2'] }
  };
  Hyper.sim('lev-payoff-builder', {
    title: 'Option strategy builder',
    blurb: `A share trades at ¤50. Choose a strategy: the solid line is the **profit or loss per share at expiry** against the share price then (green where it gains, red where it loses); the dashed line is the position's value halfway to expiry. Premiums come from the Black–Scholes model with the volatility, time and interest you set.

- Step through the presets and, for each, read the worst case first: which ones say "unlimited"?
- Choose **Bull call spread** and widen the gap between the strikes: more to gain, more to pay.
- Choose **Long straddle** and raise the volatility: the premiums rise and the break-evens move apart. The market charges for the movement you are betting on.
- The "chance of a profit" is a model figure, with the share drifting at the interest rate — not a forecast.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const first = (params && params.preset && PRESETS[params.preset]) ? params.preset : 'bull';
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Strategy', options: Object.keys(PRESETS).map(k => [PRESETS[k].name, k]), value: first },
        { id: 'K1', label: 'Strike 1 (lower)', min: 30, max: 70, step: 1, value: PRESETS[first].K1, fmt: v => kit.money(v, 0) },
        { id: 'K2', label: 'Strike 2 (upper)', min: 35, max: 80, step: 1, value: PRESETS[first].K2, fmt: v => kit.money(v, 0) },
        { id: 'sigma', label: 'Volatility', min: 10, max: 80, step: 1, value: 30, unit: '%' },
        { id: 'weeks', label: 'Weeks to expiry', min: 1, max: 52, step: 1, value: 13 },
        { id: 'r', label: 'Interest rate', min: 0, max: 10, step: 0.25, value: 4, unit: '%' },
        { id: 'half', type: 'check', label: 'Show the value halfway to expiry', value: true }
      ], (id, v) => {
        if (id === 'preset') { const P = PRESETS[v] || PRESETS.bull; ctl.set('K1', P.K1); ctl.set('K2', P.K2); showStrikes(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['legs', 'Position'], ['cost', 'Net premium'], ['max', 'Most you can make'], ['min', 'Most you can lose'], ['be', 'Break-even at expiry'], ['prob', 'Chance of a profit (model)']]);
      const V = ctl.values;
      const S0 = 50;
      function showStrikes() { const P = PRESETS[V.preset] || PRESETS.bull; ctl.show('K1', P.uses.includes('K1')); ctl.show('K2', P.uses.includes('K2')); }
      showStrikes();

      function legs() {
        const P = PRESETS[V.preset] || PRESETS.bull, T = V.weeks / 52, r = V.r / 100, s = V.sigma / 100;
        return P.legs.map(([type, kk, q]) => {
          const K = kk ? V[kk] : 0;
          const prem = type === 'stock' ? S0 : kit.fin.blackScholes({ S: S0, K, r, sigma: s, T, type }).price;
          return { type, K, q, prem };
        });
      }
      function profit(L, S, tLeft) {
        const r = V.r / 100, s = V.sigma / 100;
        let v = 0;
        for (const g of L) {
          if (g.type === 'stock') v += g.q * (S - S0);
          else if (tLeft > 0) v += g.q * (kit.fin.blackScholes({ S: Math.max(S, 1e-6), K: g.K, r, sigma: s, T: tLeft, type: g.type }).price - g.prem);
          else v += Math.abs(g.q) * kit.fin.payoff(g.type, S, g.K, g.prem, g.q < 0);
        }
        return v;
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const L = legs(), T = V.weeks / 52, r = V.r / 100, s = V.sigma / 100;
        // extremes, break-evens and the model chance of a profit, on a fine grid
        const grid = [];
        for (let S = 0.01; S <= 4 * S0; S += 0.05) grid.push([S, profit(L, S, 0)]);
        let best = -Infinity, worst = Infinity;
        for (const [, v] of grid) { best = Math.max(best, v); worst = Math.min(worst, v); }
        const slope = L.reduce((a, g) => a + (g.type === 'put' ? 0 : g.q), 0);
        const bes = [];
        for (let i = 1; i < grid.length; i++) {
          const [a, fa] = grid[i - 1], [b, fb] = grid[i];
          if ((fa < 0 && fb >= 0) || (fa >= 0 && fb < 0)) bes.push(a + (b - a) * (0 - fa) / ((fb - fa) || 1));
        }
        const cdf = S => kit.fin.ncdf((Math.log(S / S0) - (r - s * s / 2) * T) / (s * Math.sqrt(T)));
        let prob = 0;
        for (let i = 1; i < grid.length; i++) if (profit(L, (grid[i - 1][0] + grid[i][0]) / 2, 0) > 0) prob += cdf(grid[i][0]) - cdf(grid[i - 1][0]);
        if (slope > 0 && grid[grid.length - 1][1] > 0) prob += 1 - cdf(grid[grid.length - 1][0]);

        // the chart
        const xs = [];
        for (let S = 0.4 * S0; S <= 1.8 * S0 + 1e-9; S += 0.25) xs.push(S);
        const exp = xs.map(S => [S, profit(L, S, 0)]);
        const half = V.half ? xs.map(S => [S, profit(L, S, T / 2)]) : [];
        const ys = exp.concat(half).map(p => p[1]);
        let ymin = Math.min(0, ...ys), ymax = Math.max(0, ...ys);
        const pad = (ymax - ymin) * 0.1 || 1; ymin -= pad; ymax += pad;
        const o = { C, x0: 58, y0: 30, w: W - 58 - 16, h: Hh - 30 - 44, xmin: 0.4 * S0, xmax: 1.8 * S0, ymin, ymax, fx: v => kit.money(v, 0), fy: v => kit.money(v, 2),
          ny: 6, xlabel: 'share price at expiry', ylabel: 'profit per share' };
        const M = frame(kit, c, o);
        // gains in green, losses in red
        for (const [col, top, bot] of [[C.ok, o.y0, M.Y(0)], [C.bad, M.Y(0), o.y0 + o.h]]) {
          if (bot <= top) continue;
          c.save(); c.beginPath(); c.rect(o.x0, top, o.w, bot - top); c.clip();
          c.globalAlpha = 0.16; c.fillStyle = col; c.beginPath(); c.moveTo(M.X(exp[0][0]), M.Y(0));
          for (const p of exp) c.lineTo(M.X(p[0]), M.Y(p[1]));
          c.lineTo(M.X(exp[exp.length - 1][0]), M.Y(0)); c.closePath(); c.fill(); c.restore();
        }
        vline(c, M, o, S0, C.muted, 'today ' + kit.money(S0, 0), [2, 3]);
        if (half.length) line(c, half, M, o, C.muted, 1.6, [6, 4]);
        line(c, exp, M, o, C.accent, 2.6);
        for (const b of bes) if (b >= o.xmin && b <= o.xmax) kit.dot(c, M.X(b), M.Y(0), 4.5, C.text, C.bg2);
        legend(kit, c, o.x0 + o.w, 14, [[C.accent, 'at expiry']].concat(half.length ? [[C.muted, 'halfway to expiry', [6, 4]]] : []), C, true);

        const P = PRESETS[V.preset] || PRESETS.bull;
        ro.set('legs', L.map(g => (g.q > 0 ? 'buy ' : 'sell ') + (g.type === 'stock' ? 'share at ' + kit.money(S0, 0) : g.type + ' ' + kit.money(g.K, 0) + ' @ ' + kit.money(g.prem))).join(' · '));
        const net = L.reduce((a, g) => a + (g.type === 'stock' ? 0 : g.q * g.prem), 0);
        ro.set('cost', Math.abs(net) < 0.005 ? 'none' : (net > 0 ? 'you pay ' : 'you receive ') + kit.money(Math.abs(net)) + ' a share (' + kit.money(Math.abs(net) * 100, 0) + ' per 100)');
        ro.set('max', slope > 0 ? 'unlimited' : (best >= 0 ? '' : '−') + kit.money(Math.abs(best)) + ' a share');
        ro.set('min', slope < 0 ? 'unlimited' : kit.money(Math.max(0, -worst)) + ' a share');
        ro.set('be', bes.length ? bes.slice(0, 3).map(b => kit.money(b)).join(' and ') : 'none');
        ro.set('prob', kit.pct(Math.min(1, Math.max(0, prob)), 0) + ' (' + P.name.toLowerCase() + ')');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ option value and time decay */
  Hyper.sim('lev-option-value', {
    title: 'What an option is worth, and how time eats it',
    blurb: `The thick line is the Black–Scholes value of the option against the share price, with the time to expiry you choose; the thin lines show the same option with six months, three months, one month and one week left, and the dashed line its value at expiry (the intrinsic value). The gap between the dashed line and the curve is the **time value**.

- Press **Let time pass** and watch the curve sag onto the dashed line — slowly at first, then fast in the final weeks.
- Raise the volatility: every curve lifts. Uncertainty is what an option buyer pays for.
- Compare a call and a put with the same strike: their difference is always $S - K e^{-rT}$ (put–call parity, in the read-out).`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Option', options: [['Call', 'call'], ['Put', 'put']], value: (params && params.type) || 'call' },
        { id: 'S', label: 'Share price', min: 20, max: 90, step: 0.5, value: 50, fmt: v => kit.money(v) },
        { id: 'K', label: 'Strike', min: 30, max: 70, step: 1, value: 50, fmt: v => kit.money(v, 0) },
        { id: 'sigma', label: 'Volatility', min: 5, max: 80, step: 1, value: 30, unit: '%' },
        { id: 'r', label: 'Interest rate', min: 0, max: 10, step: 0.25, value: 4, unit: '%' },
        { id: 'days', label: 'Days to expiry', min: 0, max: 365, step: 0.25, value: 91.25, fmt: v => Math.round(v) + ' days' },
        { type: 'buttons', items: [{ id: 'pass', label: 'Let time pass', primary: true }, { id: 'back', label: 'Back to 3 months' }] }
      ], (id) => {
        if (id === 'pass') { if (V.days <= 0) ctl.set('days', 91.25); passing = true; loop.start(); return; }
        if (id === 'back') { passing = false; ctl.set('days', 91.25); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['val', 'Value'], ['intr', 'Intrinsic value'], ['tv', 'Time value'], ['delta', 'Delta'], ['theta', 'Time decay (theta)'], ['vega', 'Per 1 % of volatility (vega)'], ['par', 'Put–call parity']]);
      const V = ctl.values;
      let passing = false;
      const bs = (S, T, type, sig) => kit.fin.blackScholes({ S: Math.max(S, 1e-6), K: V.K, r: V.r / 100, sigma: sig != null ? sig : V.sigma / 100, T: Math.max(0, T), type: type || V.type });

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const T = V.days / 365;
        const xs = [];
        for (let S = 20; S <= 90.001; S += 0.5) xs.push(S);
        const refs = [[182.5, '6 mo'], [91.25, '3 mo'], [30.4, '1 mo'], [7, '1 wk']];
        const cur = xs.map(S => [S, bs(S, T).price]);
        const intr = xs.map(S => [S, V.type === 'put' ? Math.max(V.K - S, 0) : Math.max(S - V.K, 0)]);
        const ymax = Math.max(5, ...cur.map(p => p[1]), ...refs.map(([d]) => bs(90, d / 365).price), ...refs.map(([d]) => bs(20, d / 365).price)) * 1.05;
        const o = { C, x0: 58, y0: 30, w: W - 58 - 16, h: Hh - 30 - 44, xmin: 20, xmax: 90, ymin: 0, ymax, fx: v => kit.money(v, 0), fy: v => kit.money(v, 0), ny: 5,
          xlabel: 'share price', ylabel: 'value of the ' + V.type };
        const M = frame(kit, c, o);
        for (const [d, lab] of refs) {
          if (Math.abs(d - V.days) < 2) continue;
          const pts = xs.map(S => [S, bs(S, d / 365).price]);
          line(c, pts, M, o, C.faint, 1.2);
          const endS = V.type === 'put' ? 21 : 88;
          kit.label(c, lab, M.X(endS), M.Y(bs(endS, d / 365).price) - 8, { size: 10.5, color: C.muted, align: V.type === 'put' ? 'left' : 'right' });
        }
        line(c, intr, M, o, C.text, 1.6, [6, 4]);
        line(c, cur, M, o, C.accent, 2.8);
        vline(c, M, o, V.K, C.muted, 'strike', [2, 3]);
        const v = bs(V.S, T), iv = V.type === 'put' ? Math.max(V.K - V.S, 0) : Math.max(V.S - V.K, 0);
        const x = M.X(V.S);
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(x, M.Y(iv)); c.lineTo(x, M.Y(v.price)); c.stroke(); c.restore();
        kit.dot(c, x, M.Y(v.price), 5.5, C.accent, C.bg2);
        legend(kit, c, o.x0 + o.w, 14, [[C.accent, Math.round(V.days) + ' days left'], [C.text, 'at expiry', [6, 4]], [C.warn, 'time value']], C, true);

        const vT1 = bs(V.S, T - 1 / 365).price, vv = bs(V.S, T, null, V.sigma / 100 + 0.01).price;
        const call = bs(V.S, T, 'call').price, put = bs(V.S, T, 'put').price;
        ro.set('val', kit.money(v.price));
        ro.set('intr', kit.money(iv));
        ro.set('tv', kit.money(Math.max(0, v.price - iv)) + (v.price < iv - 1e-9 ? ' (European put: below intrinsic)' : ''));
        ro.set('delta', v.delta.toFixed(2).replace('-', '−') + ' (moves ' + kit.money(Math.abs(v.delta)) + ' per ' + kit.money(1, 0) + ')');
        ro.set('theta', T > 0 ? '−' + kit.money(Math.max(0, v.price - vT1), 3) + ' a day' : '—');
        ro.set('vega', T > 0 ? '+' + kit.money(vv - v.price, 3) : '—');
        ro.set('par', 'C − P = ' + kit.money(call - put) + ';  S − K·e^(−rT) = ' + kit.money(V.S - V.K * Math.exp(-V.r / 100 * T)));
      }
      const loop = kit.loop((dt) => {
        if (passing) {
          const d = Math.max(0, V.days - Math.max(0.2, dt * 30));
          ctl.set('days', Math.round(d * 10) / 10);
          if (d <= 0) { passing = false; draw(); loop.stop(); return; }
          draw();
        } else { draw(); loop.stop(); }
      }, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ hedging with puts */
  Hyper.sim('lev-hedge-puts', {
    title: 'Insuring a portfolio with puts',
    blurb: `A portfolio that tracks a share index, protected for one year by puts at the floor you choose; the premium comes from the Black–Scholes model at the **implied** volatility. Left: the result at the year's end against the market's return — unprotected (grey) and protected (coloured). Right: 2,000 **simulated** years with the market's real volatility and expected return, as histograms.

- Move the floor from 100 % down to 80 %: the premium falls and the deductible grows.
- Raise the implied volatility above the real one — insurance bought when markets are frightened — and watch the average cost in the read-out climb.
- Compare the worst simulated year with and without puts: that difference is what the premium buys.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Portfolio', min: 10000, max: 1000000, value: 100000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'k', label: 'Floor (put strike)', min: 70, max: 100, step: 1, value: 90, unit: '% of today' },
        { id: 'iv', label: 'Implied volatility (sets the premium)', min: 10, max: 40, step: 1, value: 18, unit: '%' },
        { id: 'rv', label: 'Real volatility of the market', min: 10, max: 40, step: 1, value: 18, unit: '%' },
        { id: 'mu', label: 'Expected market return', min: 0, max: 12, step: 0.5, value: 7, unit: '%' },
        { id: 'r', label: 'Interest rate', min: 0, max: 8, step: 0.25, value: 4, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New simulated years', primary: true }] }
      ], (id) => { if (id === 'new') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['prem', 'Premium for a year'], ['floor', 'Most you can lose'], ['crash', 'In a year of −35 %'], ['avg', 'Average year (simulated)'], ['paid', 'Years the puts paid out'], ['worst', 'Worst simulated year']]);
      const V = ctl.values;
      let seed = 2;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const k = V.k / 100, Vp = V.V;
        const prem = Vp * kit.fin.blackScholes({ S: 1, K: k, r: V.r / 100, sigma: V.iv / 100, T: 1, type: 'put' }).price;
        const hedged = x => Vp * x + Vp * Math.max(k - (1 + x), 0) - prem;     // x: the market's return over the year
        // left: the result against the market's return
        const wL = Math.max(160, (W - 40) * 0.5);
        const o = { C, x0: 62, y0: 30, w: wL - 62, h: Hh - 30 - 44, xmin: -0.5, xmax: 0.5, ymin: -0.55 * Vp, ymax: 0.55 * Vp, fx: pctTick, fy: v => kit.money(v, 0, true), ny: 5, nx: 4,
          xlabel: 'market return', ylabel: 'your result' };
        const M = frame(kit, c, o);
        const xs = [];
        for (let x = -0.5; x <= 0.5001; x += 0.01) xs.push(x);
        line(c, xs.map(x => [x, Vp * x]), M, o, C.muted, 1.8);
        line(c, xs.map(x => [x, hedged(x)]), M, o, C.accent, 2.6);
        hline(c, M, o, -(Vp * (1 - k) + prem), C.bad, 'floor', [3, 3]);
        legend(kit, c, o.x0 + o.w, 14, [[C.muted, 'no puts'], [C.accent, 'with puts']], C, true);
        // right: 2,000 simulated years
        const g = kit.fin.normals(seed * 2654435 + 1);
        const s = V.rv / 100, mu = V.mu / 100;
        const bins = 24, lo = -0.6, hi = 0.6, bw = (hi - lo) / bins;
        const hu = new Array(bins).fill(0), hh = new Array(bins).fill(0);
        let sumU = 0, sumH = 0, paid = 0, worstU = Infinity, worstH = Infinity;
        const runs = 2000;
        for (let j = 0; j < runs; j++) {
          const x = Math.exp(mu - s * s / 2 + s * g()) - 1;
          const u = Vp * x, h = hedged(x);
          sumU += u; sumH += h;
          if (1 + x < k) paid++;
          worstU = Math.min(worstU, u); worstH = Math.min(worstH, h);
          hu[clamp(Math.floor((u / Vp - lo) / bw), 0, bins - 1)]++;
          hh[clamp(Math.floor((h / Vp - lo) / bw), 0, bins - 1)]++;
        }
        const x1 = o.x0 + o.w + 40, w1 = W - x1 - 16;
        const ob = { C, x0: x1, y0: 30, w: Math.max(80, w1), h: o.h, xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(...hu, ...hh) * 1.1 || 1, fx: pctTick, fy: v => '', ny: 4, nx: 4,
          xlabel: 'result, % of the portfolio' };
        const Mb = frame(kit, c, ob);
        for (let i = 0; i < bins; i++) {
          const xa = Mb.X(lo + i * bw), xb = Mb.X(lo + (i + 1) * bw), wd = (xb - xa) / 2 - 1;
          c.fillStyle = C.muted; c.globalAlpha = 0.7; c.fillRect(xa + 0.5, Mb.Y(hu[i]), wd, Mb.Y(0) - Mb.Y(hu[i]));
          c.fillStyle = C.accent; c.globalAlpha = 0.9; c.fillRect(xa + wd + 1, Mb.Y(hh[i]), wd, Mb.Y(0) - Mb.Y(hh[i]));
          c.globalAlpha = 1;
        }
        kit.label(c, runs + ' simulated years', ob.x0 + 4, 14, { size: 11.5, color: C.muted });

        ro.set('prem', kit.money(prem, 0) + ' (' + kit.pct(prem / Vp, 2) + ')');
        ro.set('floor', kit.money(Vp * (1 - k) + prem, 0) + ' (' + kit.pct(1 - k, 0) + ' deductible + premium)');
        ro.set('crash', 'no puts ' + kit.money(-0.35 * Vp, 0) + ', with puts ' + kit.money(hedged(-0.35), 0));
        ro.set('avg', 'no puts ' + kit.money(sumU / runs, 0) + ', with puts ' + kit.money(sumH / runs, 0) + ' (cost ' + kit.money((sumU - sumH) / runs, 0) + ' a year)');
        ro.set('paid', kit.pct(paid / runs, 0) + ' of years');
        ro.set('worst', 'no puts ' + kit.money(worstU, 0) + ', with puts ' + kit.money(worstH, 0));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

})();
