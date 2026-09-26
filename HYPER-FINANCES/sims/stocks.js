/* HYPER-FINANCES · sims/stocks.js — simulations for The Stock Market:
 * a live order book, a random-walk candlestick chart (and the signals it seems to give),
 * how an index is weighted, simulated bull and bear markets, a short sale's payoff,
 * earnings and the P/E, the Gordon growth model and a DCF valuation.
 * Every price here is simulated: random numbers or illustrative companies, never a real market. */
(function () {
  'use strict';

  const FONT = '11px system-ui, sans-serif';
  const rngOf = seed => Hyper.util.rng(seed >>> 0);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = x => Number.isFinite(x);
  function gauss(u) { let a = 0; while (a <= 1e-12) a = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * u()); }
  function poisson(u, lam) { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= u(); } while (p > L && k < 60); return k - 1; }
  const geo = (u, mean) => mean > 0 ? Math.floor(-Math.log(Math.max(1e-12, u())) * mean) : 0;
  const group = n => Hyper.util.group(n, 0);
  const pctS = (f, d) => (f > 0 ? '+' : '') + Hyper.util.pct(f, d == null ? 1 : d);
  const median = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };

  // horizontal gridlines with labels for a linear axis from lo to hi
  function yAxis(c, C, x0, y0, w, h, lo, hi, fmt, n) {
    const span = hi - lo;
    if (!(span > 0) || !fin(span)) return;
    const step = Hyper.niceStep(span, n || 5);
    c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) {
      const y = y0 + h - (v - lo) / span * h;
      c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(fmt(Math.abs(v) < step * 1e-9 ? 0 : v), x0 - 6, y);
    }
  }
  // the same for a logarithmic axis (values > 0)
  function yAxisLog(c, C, x0, y0, w, h, lo, hi, fmt) {
    const L0 = Math.log(lo), L1 = Math.log(hi);
    if (!(L1 > L0) || !fin(L1 - L0)) return;
    const decades = Math.log10(hi / lo), vals = [];
    if (decades < 0.7) {            // a narrow range: round values, placed on the log scale
      const step = Hyper.niceStep(hi - lo, 5);
      for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) vals.push(v);
    } else {
      const marks = decades > 3 ? [1] : decades > 1.2 ? [1, 2, 5] : [1, 1.5, 2, 3, 5, 7];
      for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++) for (const m of marks) { const v = m * Math.pow(10, e); if (v >= lo && v <= hi) vals.push(v); }
    }
    c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (const v of vals) {
      const y = y0 + h - (Math.log(v) - L0) / (L1 - L0) * h;
      c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(fmt(v), x0 - 6, y);
    }
  }
  function tri(c, x, y, up, s, col) {
    c.fillStyle = col; c.beginPath();
    if (up) { c.moveTo(x, y - s); c.lineTo(x - s, y + s * 0.8); c.lineTo(x + s, y + s * 0.8); }
    else { c.moveTo(x, y + s); c.lineTo(x - s, y - s * 0.8); c.lineTo(x + s, y - s * 0.8); }
    c.closePath(); c.fill();
  }
  function legend(kit, c, C, x, y, items) {
    let xx = x;
    for (const [col, t, dash] of items) {
      c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.2;
      if (dash) { c.setLineDash([5, 4]); c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + 16, y); c.stroke(); c.setLineDash([]); }
      else c.fillRect(xx, y - 5, 11, 11);
      kit.label(c, t, xx + (dash ? 21 : 16), y, { size: 11.5, color: C.text2 });
      xx += (dash ? 26 : 22) + t.length * 6.2;
    }
  }

  /* ================================================================ order book */
  // a "zero-intelligence" book: limit orders arrive near the best prices, market orders take
  // liquidity, and every resting order is cancelled at a steady rate (per second)
  const OB = {
    deep: { mid0: 5000, size: 400, gap: 3, min: 1, rateL: 12, rateM: 1.6, mkt: 500, cancel: 0.25, levels: 12 },
    thin: { mid0: 490, size: 300, gap: 6, min: 4, rateL: 4, rateM: 0.4, mkt: 300, cancel: 0.1, levels: 8 }
  };
  function lot(u, mean) { return Math.max(100, Math.round(mean * Math.exp(0.6 * gauss(u) - 0.18) / 100) * 100); }
  function bookSide(b, s) { return s === 'bid' ? b.bids : b.asks; }
  function addOrder(b, s, px, q, mine) {
    const arr = bookSide(b, s), better = s === 'bid' ? (a, x) => a > x : (a, x) => a < x;
    let i = 0;
    while (i < arr.length && better(arr[i].px, px)) i++;
    const o = { q, mine: !!mine };
    if (i < arr.length && arr[i].px === px) arr[i].orders.push(o);
    else arr.splice(i, 0, { px, orders: [o] });
    return o;
  }
  const bestPx = (b, s) => { const a = bookSide(b, s); return a.length ? a[0].px : null; };
  const levelQty = lv => lv.orders.reduce((s, o) => s + o.q, 0);
  function midOf(b) {
    const bb = bestPx(b, 'bid'), aa = bestPx(b, 'ask');
    return bb != null && aa != null ? (bb + aa) / 2 : bb != null ? bb + 0.5 : aa != null ? aa - 0.5 : b.last;
  }
  // an order that takes liquidity: 'buy' lifts the asks, 'sell' hits the bids, down to `limit` (ticks) if given
  function takeBook(b, aggr, qty, limit, mine) {
    const arr = aggr === 'buy' ? b.asks : b.bids, fills = [];
    while (qty > 0 && arr.length) {
      const lv = arr[0];
      if (limit != null && (aggr === 'buy' ? lv.px > limit : lv.px < limit)) break;
      while (qty > 0 && lv.orders.length) {
        const o = lv.orders[0], q = Math.min(qty, o.q);
        o.q -= q; qty -= q;
        const f = fills.length && fills[fills.length - 1].px === lv.px ? fills[fills.length - 1] : null;
        if (f) f.q += q; else fills.push({ px: lv.px, q });
        b.trades.push({ t: b.t, px: lv.px, q, mine: !!mine || o.mine });
        if (o.q <= 0) lv.orders.shift();
      }
      if (!lv.orders.length) arr.shift();
    }
    if (b.trades.length > 700) b.trades.splice(0, b.trades.length - 700);
    if (fills.length) b.last = fills[fills.length - 1].px;
    return { fills, left: qty };
  }
  function refillBook(b) {
    const M = b.M, u = b.u;
    for (const s of ['bid', 'ask']) {
      const arr = bookSide(b, s);
      let guard = 0;
      while (arr.length < Math.ceil(M.levels * 0.6) && guard++ < 40) {
        const edge = arr.length ? arr[arr.length - 1].px : (s === 'bid' ? Math.round(midOf(b)) - 1 : Math.round(midOf(b)) + 1);
        const px = arr.length ? (s === 'bid' ? edge - 1 - geo(u, M.gap) : edge + 1 + geo(u, M.gap)) : edge;
        if (px < 2) break;
        addOrder(b, s, px, lot(u, M.size), false);
      }
      while (arr.length > 32 && !arr[arr.length - 1].orders.some(o => o.mine)) arr.pop();
    }
  }
  function newBook(mode, seed) {
    const M = OB[mode] || OB.deep;
    const b = { M, u: rngOf(seed), bids: [], asks: [], trades: [], hist: [], t: 0, histT: -1, last: M.mid0 };
    for (const s of ['bid', 'ask']) {
      let px = s === 'bid' ? M.mid0 - 1 : M.mid0 + 1;
      for (let k = 0; k < M.levels; k++) {
        const m = 1 + Math.floor(b.u() * 3);
        for (let j = 0; j < m; j++) addOrder(b, s, px, lot(b.u, M.size), false);
        px += (s === 'bid' ? -1 : 1) * (1 + geo(b.u, M.gap));
      }
    }
    return b;
  }
  function stepBook(b, dt) {
    const M = b.M, u = b.u;
    b.t += dt;
    for (let k = poisson(u, M.rateL * dt); k > 0; k--) {
      const s = u() < 0.5 ? 'bid' : 'ask';
      const oa = bestPx(b, 'ask'), ob = bestPx(b, 'bid');
      const px = s === 'bid' ? (oa != null ? oa : b.last + 1) - M.min - geo(u, M.gap) : (ob != null ? ob : b.last - 1) + M.min + geo(u, M.gap);
      if (px > 1) addOrder(b, s, px, lot(u, M.size), false);
    }
    for (let k = poisson(u, M.rateM * dt); k > 0; k--) takeBook(b, u() < 0.5 ? 'buy' : 'sell', lot(u, M.mkt), null, false);
    const pc = 1 - Math.exp(-M.cancel * dt);
    for (const arr of [b.bids, b.asks]) for (let i = arr.length - 1; i >= 0; i--) {
      const lv = arr[i];
      lv.orders = lv.orders.filter(o => o.mine || u() >= pc);
      if (!lv.orders.length) arr.splice(i, 1);
    }
    refillBook(b);
    if (b.t - b.histT >= 0.2) {
      b.histT = b.t;
      b.hist.push({ t: b.t, bid: bestPx(b, 'bid'), ask: bestPx(b, 'ask') });
      if (b.hist.length > 500) b.hist.shift();
    }
  }

  Hyper.sim('stk-order-book', {
    title: 'A live order book',
    blurb: `A **simulated** exchange order book: sellers' offers (asks) above, buyers' bids below, each bar a queue of orders at one price. Random traders keep adding, cancelling and trading. Your orders are shown in the accent colour.

- Send a **market** buy of 3,000 shares and look at the fills: the order takes the best ask first and then walks up the book. Compare the average price with the best ask and the mid.
- Switch to a **thin small share**: the spread widens and the same order moves the price much more.
- Place a **limit** buy a little below the mid: it joins the queue and waits. Watch the number of shares ahead of you shrink — or the price run away without you.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'side', type: 'select', label: 'Your order', options: [['Buy', 'buy'], ['Sell', 'sell']], value: 'buy' },
        { id: 'type', type: 'select', label: 'Order type', options: [['Market order', 'market'], ['Limit order', 'limit']], value: params && params.type === 'limit' ? 'limit' : 'market' },
        { id: 'qty', label: 'Shares', min: 100, max: 5000, step: 100, value: 3000 },
        { id: 'lim', label: 'Limit price, relative to the mid', min: -0.25, max: 0.25, step: 0.01, value: -0.03, fmt: v => (v < 0 ? 'mid − ' : 'mid + ') + kit.money(Math.abs(v)) },
        { id: 'mode', type: 'select', label: 'Share', options: [['Busy large share', 'deep'], ['Thin small share', 'thin']], value: 'deep' },
        { id: 'speed', type: 'select', label: 'Speed', options: [['Paused', 0], ['Slow', 0.35], ['Normal', 1], ['Fast', 3]], value: 1 },
        { type: 'buttons', items: [{ id: 'send', label: 'Send order', primary: true }, { id: 'cancel', label: 'Cancel my limit' }, { id: 'reset', label: 'New market' }] }
      ], (id, v) => {
        if (id === 'send') send();
        else if (id === 'cancel') cancelMine();
        else if (id === 'reset' || id === 'mode') { seed += 1; book = newBook(V.mode, seed); my = null; last = null; tbl.set([]); }
        else if (id === 'side') ctl.set('lim', -V.lim);
        loop.once();
      });
      const ro = kit.readout(box.side, [['quote', 'Best bid | best ask'], ['spread', 'Spread'], ['depth', 'Depth within 1 % of the mid'], ['fill', 'Your last fill'], ['slip', 'Paid beyond the best price'], ['mine', 'Your limit order']]);
      const tbl = kit.table(box.stage, [
        { label: 'Your fills: price', key: 'px', align: 'left', fmt: v => v == null ? 'total' : kit.money(v / 100) },
        { label: 'Shares', key: 'q', fmt: v => group(v) },
        { label: 'Cost', key: 'cost', fmt: v => kit.money(v) }
      ], { maxHeight: 150 });
      const V = ctl.values;
      let seed = 11, book = newBook(V.mode, seed), my = null, last = null;

      function cancelMine() {
        if (!my) return;
        for (const arr of [book.bids, book.asks]) for (let i = 0; i < arr.length; i++) {
          const k = arr[i].orders.indexOf(my.o);
          if (k >= 0) { arr[i].orders.splice(k, 1); if (!arr[i].orders.length) arr.splice(i, 1); break; }
        }
        my = null;
      }
      function send() {
        const s = V.side, qty = Math.round(V.qty);
        const bestBefore = s === 'buy' ? bestPx(book, 'ask') : bestPx(book, 'bid'), midBefore = midOf(book);
        let r;
        if (V.type === 'market') r = takeBook(book, s, qty, null, true);
        else {
          cancelMine();
          const lim = Math.max(1, Math.round(midBefore + V.lim * 100));
          r = takeBook(book, s, qty, lim, true);
          if (r.left > 0) { const o = addOrder(book, s === 'buy' ? 'bid' : 'ask', lim, r.left, true); my = { side: s, px: lim, q0: r.left, o }; }
        }
        if (r.fills.length) {
          const filled = r.fills.reduce((a, f) => a + f.q, 0), val = r.fills.reduce((a, f) => a + f.q * f.px, 0);
          const sg = s === 'buy' ? 1 : -1, best = bestBefore != null ? bestBefore : midBefore;
          last = { side: s, filled, avg: val / filled, vsBest: sg * (val - filled * best) / 100, vsMid: sg * (val - filled * midBefore) / 100, levels: r.fills.length, unfilled: V.type === 'market' ? r.left : 0 };
          const rows = r.fills.map(f => ({ px: f.px, q: f.q, cost: f.q * f.px / 100 }));
          rows.push({ px: null, q: filled, cost: val / 100, _cls: 'hl' });
          tbl.set(rows);
        }
        refillBook(book);
      }
      function readouts() {
        const bb = bestPx(book, 'bid'), aa = bestPx(book, 'ask'), mid = midOf(book);
        if (bb != null && aa != null) {
          ro.set('quote', kit.money(bb / 100) + ' × ' + group(levelQty(book.bids[0])) + '  |  ' + kit.money(aa / 100) + ' × ' + group(levelQty(book.asks[0])));
          ro.set('spread', kit.money((aa - bb) / 100) + ' (' + kit.pct((aa - bb) / mid, 2) + ' of the mid)');
        }
        const near = (arr, ok) => arr.filter(lv => ok(lv.px)).reduce((s, lv) => s + levelQty(lv), 0);
        ro.set('depth', group(near(book.bids, p => p >= mid * 0.99)) + ' to buy · ' + group(near(book.asks, p => p <= mid * 1.01)) + ' to sell');
        ro.set('fill', last ? (last.side === 'buy' ? 'bought ' : 'sold ') + group(last.filled) + ' at ' + kit.money(last.avg / 100, 3) + ' on average (' + last.levels + (last.levels > 1 ? ' price levels)' : ' level)') +
          (last.unfilled > 0 ? '; ' + group(last.unfilled) + ' not filled — the book ran out' : '') : 'none yet — send an order');
        ro.set('slip', last ? kit.money(last.vsBest) + ' vs the best quote, ' + kit.money(last.vsMid) + ' vs the mid' : '—');
        if (!my) ro.set('mine', V.type === 'limit' ? 'none waiting — send one' : 'none (market orders do not wait)');
        else if (my.o.q <= 0) ro.set('mine', 'filled: all ' + group(my.q0) + ' at ' + kit.money(my.px / 100));
        else {
          const arr = bookSide(book, my.side === 'buy' ? 'bid' : 'ask');
          let ahead = 0;
          for (const lv of arr) {
            if (lv.px === my.px) { for (const o of lv.orders) { if (o === my.o) break; ahead += o.q; } break; }
            ahead += levelQty(lv);
          }
          const done = my.q0 - my.o.q;
          ro.set('mine', (my.side === 'buy' ? 'buy ' : 'sell ') + group(my.o.q) + ' at ' + kit.money(my.px / 100) + ': ' + group(ahead) + ' shares ahead' + (done > 0 ? ' (' + group(done) + ' filled)' : ''));
        }
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const rows = 8, top = 34, rowH = (Hh - top - 14) / (2 * rows + 1), midY = top + rows * rowH + rowH / 2;
        const lx = 8, lw = Math.min(W * 0.46, 360), pxX = lx + 62, barX = lx + 70, barW = Math.max(40, lw - 70 - 52);
        kit.label(c, 'Simulated order book', lx, 14, { size: 11.5, color: C.muted });
        const shown = [book.asks.slice(0, rows), book.bids.slice(0, rows)];
        const maxQ = Math.max(1, ...shown[0].map(levelQty), ...shown[1].map(levelQty));
        [['ask', shown[0], -1, C.bad], ['bid', shown[1], 1, C.ok]].forEach(([s, lvs, dir, col]) => {
          lvs.forEach((lv, i) => {
            const y = midY + dir * (i + 1) * rowH;
            c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillStyle = C.text;
            c.fillText(kit.money(lv.px / 100), pxX, y);
            let x = barX;
            for (const o of lv.orders) {
              const w = o.q / maxQ * barW;
              c.globalAlpha = o.mine ? 1 : 0.7; c.fillStyle = o.mine ? C.accent : col;
              c.fillRect(x, y - rowH * 0.36, Math.max(1, w - 1), rowH * 0.72);
              if (o.mine) { c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x, y - rowH * 0.36, Math.max(1, w - 1), rowH * 0.72); }
              x += w;
            }
            c.globalAlpha = 1;
            c.textAlign = 'right'; c.fillStyle = C.muted; c.fillText(group(levelQty(lv)), lx + lw, y);
          });
        });
        const bb = bestPx(book, 'bid'), aa = bestPx(book, 'ask');
        c.strokeStyle = C.border2 || C.grid; c.lineWidth = 1;
        c.beginPath(); c.moveTo(lx, midY - rowH / 2); c.lineTo(lx + lw, midY - rowH / 2); c.moveTo(lx, midY + rowH / 2); c.lineTo(lx + lw, midY + rowH / 2); c.stroke();
        kit.label(c, bb != null && aa != null ? 'spread ' + kit.money((aa - bb) / 100) : 'one side of the book is empty', lx + lw / 2, midY, { size: 11.5, color: C.warn, align: 'center', weight: 600 });
        kit.label(c, 'sellers (asks)', barX, top - 10, { size: 11, color: C.bad });
        kit.label(c, 'buyers (bids)', barX, Math.min(Hh - 6, midY + (rows + 0.9) * rowH), { size: 11, color: C.ok });

        // the tape: best bid and ask over the last minute, and the trades
        const cx = lx + lw + 64, cw = W - cx - 12, cy = top, ch = Hh - top - 30;
        if (cw < 80) return;
        const t1 = book.t, t0 = t1 - 60;
        const hs = book.hist.filter(h => h.t >= t0), trs = book.trades.filter(tr => tr.t >= t0);
        let lo = Infinity, hi = -Infinity;
        for (const h of hs) { if (h.bid != null) lo = Math.min(lo, h.bid); if (h.ask != null) hi = Math.max(hi, h.ask); }
        for (const tr of trs) { lo = Math.min(lo, tr.px); hi = Math.max(hi, tr.px); }
        if (my && my.o.q > 0) { lo = Math.min(lo, my.px); hi = Math.max(hi, my.px); }
        if (!fin(lo) || !fin(hi)) { lo = midOf(book) - 5; hi = midOf(book) + 5; }
        const pad = Math.max(2, (hi - lo) * 0.12); lo -= pad; hi += pad;
        const X = t => cx + (t - t0) / 60 * cw, Y = p => cy + ch - (p - lo) / (hi - lo) * ch;
        yAxis(c, C, cx, cy, cw, ch, lo, hi, v => kit.money(v / 100), 5);
        for (const [key, col] of [['ask', C.bad], ['bid', C.ok]]) {
          c.strokeStyle = col; c.lineWidth = 1.6; c.beginPath();
          let started = false, prevY = 0;
          for (const h of hs) {
            if (h[key] == null) continue;
            const x = X(h.t), y = Y(h[key]);
            if (!started) { c.moveTo(x, y); started = true; } else { c.lineTo(x, prevY); c.lineTo(x, y); }
            prevY = y;
          }
          if (started) c.lineTo(X(t1), prevY);
          c.stroke();
        }
        for (const tr of trs) kit.dot(c, X(tr.t), Y(tr.px), tr.mine ? 3.6 : 1.2 + Math.sqrt(tr.q) / 40, tr.mine ? C.accent : C.text2);
        if (my && my.o.q > 0) {
          c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(cx, Y(my.px)); c.lineTo(cx + cw, Y(my.px)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'your limit', cx + 4, Y(my.px) - 9, { size: 11, color: C.accent });
        }
        kit.label(c, cw > 260 ? 'best bid, best ask and trades, last 60 s' : 'last 60 s', cx + cw, 14, { size: 11, color: C.muted, align: 'right' });
      }
      const loop = kit.loop(dt => {
        let left = dt * V.speed;
        while (left > 1e-9) { const h = Math.min(0.05, left); stepBook(book, h); left -= h; }
        readouts(); draw();
      }, box.stage);
      readouts(); loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ candlestick chart of a random walk */
  function nextDay(g, prev, sd, m) {
    const o = prev * Math.exp(m * 0.2 + sd * 0.35 * g());
    const sub = 8, ss = sd * Math.sqrt(1 - 0.35 * 0.35) / Math.sqrt(sub);
    let p = o, hi = o, lo = o;
    for (let k = 0; k < sub; k++) { p *= Math.exp(m * 0.8 / sub + ss * g()); if (p > hi) hi = p; if (p < lo) lo = p; }
    const v = 1.5e6 * (0.55 + 0.9 * Math.abs(Math.log(p / prev)) / sd) * Math.exp(0.25 * g());
    return { o, h: hi, l: lo, c: p, v };
  }
  const maAt = (d, i, n) => { if (i < n - 1) return null; let s = 0; for (let k = i - n + 1; k <= i; k++) s += d[k].c; return s / n; };
  // does a trend signal beat buy-and-hold on pure random walks? (3 years each, 0.1 % per switch)
  function testSignal(kit, kind, sigma, mu) {
    const runs = 500, N = 756, pre = 60, sd = sigma / Math.sqrt(252), m = Math.log(1 + mu) / 252;
    const rule = [], hold = [];
    let wins = 0;
    const c = new Float64Array(N + pre + 1);
    for (let s = 1; s <= runs; s++) {
      const g = kit.fin.normals(90001 + s * 7919);
      c[0] = 100;
      for (let i = 1; i <= N + pre; i++) c[i] = c[i - 1] * Math.exp(m - sd * sd / 2 + sd * g());
      let eq = 1, pos = false, s20 = 0, s50 = 0;
      for (let k = pre - 19; k <= pre; k++) s20 += c[k];
      for (let k = pre - 49; k <= pre; k++) s50 += c[k];
      for (let i = pre; i < N + pre; i++) {
        if (i > pre) { s20 += c[i] - c[i - 20]; s50 += c[i] - c[i - 50]; }
        let want;
        if (kind === 'sr') {
          let hi = 0, lo = 1e300;
          for (let j = i - 60; j < i; j++) { if (c[j] > hi) hi = c[j]; if (c[j] < lo) lo = c[j]; }
          want = pos ? !(c[i] < lo) : c[i] > hi;
        } else want = s20 / 20 > s50 / 50;
        if (want !== pos) { eq *= 0.999; pos = want; }
        if (pos) eq *= c[i + 1] / c[i];
      }
      const yrs = N / 252, a = Math.pow(eq, 1 / yrs) - 1, h = Math.pow(c[N + pre] / c[pre], 1 / yrs) - 1;
      if (a > h) wins++;
      rule.push(a); hold.push(h);
    }
    return { wins: wins / runs, rule: median(rule), hold: median(hold), runs };
  }

  Hyper.sim('stk-chart', {
    title: 'Reading a chart — of pure chance',
    blurb: `A candlestick chart with volume, drawn from **random numbers only**: each day's move is a coin toss scaled by the volatility, plus a small built-in trend. There is no company, no news and nothing to predict. Each candle shows the day's open, high, low and close (rising days filled in the "up" colour).

- Read the terms from the chart: the day's range, volume against its average, the 52-week range, the measured volatility.
- Turn on **moving averages** or **breakouts**: the chart fills with buy and sell "signals" and convincing trends — in noise.
- Press **Test the signal**: the same rule is run on 500 random markets of three years each, paying 0.1 % per trade. With no built-in trend it wins about as often as it loses; with an upward trend it usually trails simply holding, because it spends time out of the market. The patterns on screen predicted nothing.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sigma', label: 'Volatility (yearly)', min: 5, max: 60, step: 1, value: 25, unit: '%' },
        { id: 'mu', label: 'Built-in trend (yearly)', min: -10, max: 20, step: 0.5, value: 6, unit: '%' },
        { id: 'overlay', type: 'select', label: 'Chart "signals"', options: [['None', 'none'], ['Moving averages, 20 and 50 days', 'ma'], ['Breakouts: 60-day high and low', 'sr']], value: params && params.overlay || 'none' },
        { id: 'speed', type: 'select', label: 'New days', options: [['Paused', 0], ['2 a second', 2], ['6 a second', 6], ['20 a second', 20]], value: 6 },
        { type: 'buttons', items: [{ id: 'new', label: 'New random market', primary: true }, { id: 'test', label: 'Test the signal on 500 markets' }] }
      ], id => {
        if (id === 'new') reset();
        else if (id === 'test') runTest();
        else if (id === 'sigma' || id === 'mu') testMsg = null;
        update(); loop.once();
      });
      const ro = kit.readout(box.side, [['last', 'Last close'], ['day', 'Today\'s range'], ['wk', '52-week range'], ['vol', 'Volume'], ['sig', 'Measured volatility'], ['sgn', 'Signals on screen'], ['test', 'Signal against holding']]);
      const V = ctl.values;
      const SHOW = 120;
      let seed = 3, g, days, acc = 0, testMsg = null;
      function reset() {
        seed += 1; g = kit.fin.normals(seed * 104729);
        days = []; let p = 50;
        for (let i = 0; i < 320; i++) { const d = nextDay(g, p, V.sigma / 100 / Math.sqrt(252), Math.log(1 + V.mu / 100) / 252); days.push(d); p = d.c; }
      }
      function addDay() {
        const d = nextDay(g, days[days.length - 1].c, V.sigma / 100 / Math.sqrt(252), Math.log(1 + V.mu / 100) / 252);
        days.push(d);
        if (days.length > 800) days.splice(0, days.length - 800);
      }
      function runTest() {
        const kind = V.overlay === 'sr' ? 'sr' : 'ma';
        const r = testSignal(kit, kind, V.sigma / 100, V.mu / 100);
        testMsg = (kind === 'sr' ? 'Breakout rule' : 'Moving-average rule') + ' beat holding in ' + kit.pct(r.wins, 0) + ' of ' + r.runs + ' markets; median yearly return ' + kit.pct(r.rule, 1) + ' against ' + kit.pct(r.hold, 1) + ' for holding';
      }
      function signals(from) {
        const out = [];
        for (let i = Math.max(from, 60); i < days.length; i++) {
          if (V.overlay === 'ma') {
            const a0 = maAt(days, i - 1, 20), b0 = maAt(days, i - 1, 50), a1 = maAt(days, i, 20), b1 = maAt(days, i, 50);
            if (a0 != null && b0 != null && (a0 - b0) * (a1 - b1) < 0) out.push({ i, up: a1 > b1, p: a1 });
          } else if (V.overlay === 'sr') {
            let hi = 0, lo = 1e300;
            for (let j = i - 60; j < i; j++) { if (days[j].c > hi) hi = days[j].c; if (days[j].c < lo) lo = days[j].c; }
            if (days[i].c > hi && days[i - 1].c <= hi) out.push({ i, up: true, p: days[i].c });
            else if (days[i].c < lo && days[i - 1].c >= lo) out.push({ i, up: false, p: days[i].c });
          }
        }
        return out;
      }
      function update() {
        const n = days.length, d = days[n - 1], prev = days[n - 2];
        ro.set('last', kit.money(d.c) + ' (' + pctS(d.c / prev.c - 1, 2) + ' on the day)');
        ro.set('day', 'open ' + kit.money(d.o) + ', high ' + kit.money(d.h) + ', low ' + kit.money(d.l));
        const yr = days.slice(-252);
        const lo = Math.min(...yr.map(x => x.l)), hi = Math.max(...yr.map(x => x.h));
        ro.set('wk', kit.money(lo) + ' – ' + kit.money(hi) + ' (now ' + kit.pct((d.c - lo) / Math.max(1e-9, hi - lo), 0) + ' of the way up)');
        const avg = yr.reduce((s, x) => s + x.v, 0) / yr.length;
        ro.set('vol', (d.v / 1e6).toFixed(2) + ' million shares (' + (d.v / avg).toFixed(1) + ' × the yearly average)');
        const rets = []; for (let i = 1; i < yr.length; i++) rets.push(Math.log(yr[i].c / yr[i - 1].c));
        const mean = rets.reduce((s, x) => s + x, 0) / rets.length;
        const sd = Math.sqrt(rets.reduce((s, x) => s + (x - mean) * (x - mean), 0) / Math.max(1, rets.length - 1));
        ro.set('sig', kit.pct(sd * Math.sqrt(252), 1) + ' a year (' + kit.pct(sd, 2) + ' a typical day)');
        ro.set('sgn', V.overlay === 'none' ? 'choose a signal to draw' : signals(n - SHOW).length + ' in the last ' + SHOW + ' days');
        ro.set('test', testMsg || 'press "Test the signal"');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 62, y0 = 30, w = W - x0 - 14, hAll = Hh - y0 - 26, hP = hAll * 0.74, hV = hAll - hP - 10, yV = y0 + hP + 10;
        const n = days.length, s0 = Math.max(0, n - SHOW), view = days.slice(s0);
        const ma20 = [], ma50 = [];
        for (let i = s0; i < n; i++) { ma20.push(maAt(days, i, 20)); ma50.push(maAt(days, i, 50)); }
        let lo = Math.min(...view.map(d => d.l)), hi = Math.max(...view.map(d => d.h));
        if (V.overlay === 'ma') for (const v of ma20.concat(ma50)) if (v != null) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        const pad = (hi - lo) * 0.06 || 1; lo -= pad; hi += pad;
        const Y = p => y0 + hP - (p - lo) / (hi - lo) * hP, cw = w / SHOW, X = k => x0 + (k + 0.5) * cw;
        yAxis(c, C, x0, y0, w, hP, lo, hi, v => kit.money(v, 2), 5);
        kit.label(c, W > 520 ? 'Simulated prices — random numbers, not a real share' : 'Simulated prices (random numbers)', x0, y0 - 16, { size: 11.5, color: C.muted });
        // volume
        const maxV = Math.max(...view.map(d => d.v));
        view.forEach((d, k) => {
          const hh = d.v / maxV * hV;
          c.globalAlpha = 0.5; c.fillStyle = d.c >= d.o ? C.ok : C.bad;
          c.fillRect(X(k) - Math.max(0.5, cw * 0.32), yV + hV - hh, Math.max(1, cw * 0.64), hh);
        });
        c.globalAlpha = 1;
        kit.label(c, 'volume', x0 - 6, yV + hV / 2, { size: 11, color: C.muted, align: 'right' });
        // candles
        view.forEach((d, k) => {
          const up = d.c >= d.o, col = up ? C.ok : C.bad, x = X(k);
          c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.moveTo(x, Y(d.h)); c.lineTo(x, Y(d.l)); c.stroke();
          const yT = Y(Math.max(d.o, d.c)), yB = Y(Math.min(d.o, d.c)), bw = Math.max(1, cw * 0.64);
          c.fillStyle = col; c.fillRect(x - bw / 2, yT, bw, Math.max(1, yB - yT));
        });
        // overlays
        if (V.overlay === 'ma') {
          for (const [arr, col] of [[ma20, C.accent], [ma50, C.warn]]) {
            c.strokeStyle = col; c.lineWidth = 1.8; c.beginPath(); let on = false;
            arr.forEach((v, k) => { if (v == null) return; if (!on) { c.moveTo(X(k), Y(v)); on = true; } else c.lineTo(X(k), Y(v)); });
            c.stroke();
          }
          legend(kit, c, C, x0, Hh - 8, [[C.accent, '20-day average', true], [C.warn, '50-day average', true]]);
        } else if (V.overlay === 'sr') {
          c.setLineDash([4, 3]); c.lineWidth = 1.2;
          for (const which of ['hi', 'lo']) {
            c.strokeStyle = which === 'hi' ? C.ok : C.bad; c.beginPath(); let on = false;
            for (let i = s0; i < n; i++) {
              if (i < 60) continue;
              let v = which === 'hi' ? 0 : 1e300;
              for (let j = i - 60; j < i; j++) v = which === 'hi' ? Math.max(v, days[j].c) : Math.min(v, days[j].c);
              const k = i - s0;
              if (!on) { c.moveTo(X(k) - cw / 2, Y(v)); on = true; } else c.lineTo(X(k) - cw / 2, Y(v));
              c.lineTo(X(k) + cw / 2, Y(v));
            }
            c.stroke();
          }
          c.setLineDash([]);
          legend(kit, c, C, x0, Hh - 8, [[C.ok, '60-day high', true], [C.bad, '60-day low', true]]);
        }
        for (const sg of signals(s0)) {
          const k = sg.i - s0, d = days[sg.i];
          tri(c, X(k), sg.up ? Y(d.l) + 9 : Y(d.h) - 9, sg.up, 5, sg.up ? C.ok : C.bad);
        }
        kit.label(c, 'last ' + SHOW + ' trading days', x0 + w, Hh - 8, { size: 11, color: C.muted, align: 'right' });
      }
      reset(); update();
      const loop = kit.loop(dt => {
        acc += dt * V.speed;
        let added = false;
        while (acc >= 1) { acc -= 1; addDay(); added = true; }
        if (added) update();
        draw();
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ index weighting */
  const COS = [
    { name: 'Alder Tools', P: 400, N: 20e6 },
    { name: 'Birch Foods', P: 25, N: 800e6 },
    { name: 'Cedar Energy', P: 60, N: 250e6 },
    { name: 'Dune Software', P: 150, N: 300e6 },
    { name: 'Elm Retail', P: 12, N: 1000e6 }
  ];
  Hyper.sim('stk-index', {
    title: 'Building an index: price-weighted or capitalisation-weighted',
    blurb: `Five illustrative companies, one small with a high share price (Alder Tools) and one large with a low price (Birch Foods). Three indices start at 1,000: **price-weighted** (like the Dow or the Nikkei 225), **capitalisation-weighted** (like most indices) and **equal-weighted**. Move the prices and compare.

- Raise Alder Tools 10 %: the price-weighted index jumps, the cap-weighted one hardly moves. Now raise Dune Software 10 % instead.
- Tick **Alder Tools splits 4-for-1** and untick **Adjust the divisor**: the price-weighted index "crashes" although nothing happened. Adjust the divisor and the level is right again — but Alder's weight in it has fallen from about 62 % to about 29 %.
- The bars show each company's weight in the two indices.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const defs = COS.map((co, i) => ({ id: 'c' + i, label: co.name + ': price change', min: -50, max: 100, step: 1, value: 0, unit: '%' }));
      defs.push({ id: 'split', type: 'check', label: 'Alder Tools splits 4-for-1', value: false });
      defs.push({ id: 'adj', type: 'check', label: 'Adjust the divisor for the split', value: true });
      defs.push({ type: 'buttons', items: [{ id: 'reset', label: 'Reset prices' }] });
      const ctl = kit.controls(box.side, defs, id => {
        if (id === 'reset') COS.forEach((co, i) => ctl.set('c' + i, 0));
        loop.once();
      });
      const ro = kit.readout(box.side, [['pw', 'Price-weighted'], ['cw', 'Cap-weighted'], ['ew', 'Equal-weighted'], ['div', 'Divisor'], ['alder', 'A 10 % move in Alder Tools moves']]);
      const V = ctl.values;
      function compute() {
        const split = !!V.split, S0 = COS.reduce((s, co) => s + co.P, 0), d0 = S0 / 1000;
        const cos = COS.map((co, i) => {
          let P = co.P * (1 + V['c' + i] / 100), N = co.N;
          if (i === 0 && split) { P /= 4; N *= 4; }
          return { name: co.name, P, N, cap: P * N, rel: (1 + V['c' + i] / 100) };
        });
        const d = split && V.adj ? d0 * (S0 - COS[0].P + COS[0].P / 4) / S0 : d0;
        const sumP = cos.reduce((s, x) => s + x.P, 0), cap = cos.reduce((s, x) => s + x.cap, 0), cap0 = COS.reduce((s, co) => s + co.P * co.N, 0);
        const pw = sumP / d, cw = 1000 * cap / cap0, ew = 1000 * cos.reduce((s, x) => s + x.rel, 0) / cos.length;
        cos.forEach(x => { x.wp = x.P / sumP; x.wc = x.cap / cap; });
        return { cos, pw, cw, ew, d, d0, sumP };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const r = compute();
        ro.set('pw', r.pw.toFixed(1) + ' (' + pctS(r.pw / 1000 - 1, 2) + ')');
        ro.set('cw', r.cw.toFixed(1) + ' (' + pctS(r.cw / 1000 - 1, 2) + ')');
        ro.set('ew', r.ew.toFixed(1) + ' (' + pctS(r.ew / 1000 - 1, 2) + ')');
        ro.set('div', r.d.toFixed(4) + (V.split ? (V.adj ? ' (adjusted from ' + r.d0.toFixed(3) + ')' : ' (not adjusted!)') : ''));
        ro.set('alder', 'price-weighted ' + kit.pct(r.cos[0].wp * 0.1, 2) + ', cap-weighted ' + kit.pct(r.cos[0].wc * 0.1, 2));
        // three tiles
        const tiles = [['Price-weighted', r.pw], ['Cap-weighted', r.cw], ['Equal-weighted', r.ew]];
        const tw = (W - 16 - 2 * 10) / 3, th = 58;
        tiles.forEach(([name, v], i) => {
          const x = 8 + i * (tw + 10), y = 8, ch = v / 1000 - 1;
          c.fillStyle = C.surface; c.strokeStyle = C.border; c.lineWidth = 1;
          c.beginPath(); if (c.roundRect) c.roundRect(x, y, tw, th, 8); else c.rect(x, y, tw, th); c.fill(); c.stroke();
          kit.label(c, name, x + 10, y + 14, { size: 11.5, color: C.muted });
          const wide = tw > 150, chCol = Math.abs(ch) < 5e-5 ? C.muted : ch > 0 ? C.ok : C.bad;
          kit.label(c, v.toFixed(1), x + 10, y + (wide ? 38 : 32), { size: wide ? 19 : 16, weight: 700, color: C.text });
          kit.label(c, pctS(ch, 2), wide ? x + tw - 10 : x + 10, y + (wide ? 38 : 49), { size: wide ? 13 : 11.5, weight: 600, color: chCol, align: wide ? 'right' : 'left' });
        });
        // rows: company, price, value, weights
        const y0 = 8 + th + 34, rowH = Math.max(34, (Hh - y0 - 26) / COS.length);
        const nameW = Math.min(150, W * 0.28), bx = 8 + nameW + 8, bw = W - bx - 70;
        const maxW = Math.max(0.5, ...r.cos.map(x => Math.max(x.wp, x.wc)));
        legend(kit, c, C, bx, y0 - 16, W > 520 ? [[C.accent, 'weight, price-weighted'], [C.warn, 'weight, cap-weighted']] : [[C.accent, 'price-weighted'], [C.warn, 'cap-weighted']]);
        r.cos.forEach((x, i) => {
          const y = y0 + i * rowH;
          kit.label(c, x.name, 8, y + 8, { size: 12.5, weight: 600, color: C.text });
          kit.label(c, kit.money(x.P) + ' · ' + kit.money(x.cap, 0, true), 8, y + 24, { size: 11, color: C.muted });
          const bh = Math.min(11, rowH * 0.3);
          [[x.wp, C.accent, y + 4], [x.wc, C.warn, y + 6 + bh]].forEach(([wgt, col, yy]) => {
            c.fillStyle = col; c.fillRect(bx, yy, wgt / maxW * bw, bh);
            kit.label(c, kit.pct(wgt, 1), bx + wgt / maxW * bw + 6, yy + bh / 2, { size: 11, color: C.text2 });
          });
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(8, y + rowH - 3); c.lineTo(W - 8, y + rowH - 3); c.stroke();
        });
        kit.label(c, 'Illustrative companies; each index starts at 1,000.', 8, Hh - 10, { size: 11, color: C.muted });
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ bull and bear markets */
  function phasesOf(p, th) {
    const out = [];
    let state = 'bull', ext = 0, start = 0;
    for (let i = 1; i < p.length; i++) {
      if (state === 'bull') {
        if (p[i] > p[ext]) ext = i;
        else if (p[i] <= p[ext] * (1 - th)) { out.push({ type: 'bull', from: start, to: ext }); start = ext; state = 'bear'; ext = i; }
      } else {
        if (p[i] < p[ext]) ext = i;
        else if (p[i] >= p[ext] * (1 + th)) { out.push({ type: 'bear', from: start, to: ext }); start = ext; state = 'bull'; ext = i; }
      }
    }
    out.push({ type: state, from: start, to: state === 'bear' ? ext : p.length - 1, open: true });
    return out.filter(ph => ph.to > ph.from);
  }
  Hyper.sim('stk-bull-bear', {
    title: 'Bull and bear markets in a simulated history',
    blurb: `A long **simulated** market history, month by month: random returns around a steady trend, with no crises written in. Periods that fell 20 % or more from a peak — **bear markets** — are shaded; the lower panel shows how far below its last peak the market stood ("underwater").

- Press **New history** several times: bear markets appear every few years, some deep, purely from randomness.
- Raise the volatility: bears become deeper and more frequent, though the trend is unchanged.
- Look at how much of the time the market spends more than 10 % below an earlier peak, even in a history that grows well overall.
- Switch off **occasional big shocks** to see how much of the damage comes from the rare large months.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'mu', label: 'Trend growth (yearly)', min: 0, max: 12, step: 0.5, value: 7, unit: '%' },
        { id: 'sigma', label: 'Volatility (yearly)', min: 5, max: 35, step: 1, value: 16, unit: '%' },
        { id: 'years', label: 'Years of history', min: 20, max: 100, step: 5, value: 60 },
        { id: 'th', label: 'Bear market = fall of at least', min: 10, max: 40, step: 1, value: 20, unit: '%' },
        { id: 'fat', type: 'check', label: 'Occasional big shocks', value: true },
        { id: 'log', type: 'check', label: 'Logarithmic price scale', value: true },
        { type: 'buttons', items: [{ id: 'new', label: 'New history', primary: true }] }
      ], id => { if (id === 'new') seed += 1; build(); loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Bear markets'], ['bear', 'Average bear market'], ['bull', 'Average bull market'], ['worst', 'Deepest fall'], ['under', 'Time more than 10 % below an earlier peak'], ['cagr', 'Growth over the whole history']]);
      const V = ctl.values;
      let seed = 21, p = [], dd = [], ph = [];
      function build() {
        const g = kit.fin.normals(seed * 7331), u = rngOf(seed * 131 + 7);
        const n = Math.round(V.years) * 12, s = V.sigma / 100 / Math.sqrt(12), m = Math.log(1 + V.mu / 100) / 12;
        p = [100];
        for (let i = 1; i <= n; i++) {
          let z = g();
          if (V.fat && u() < 0.03) z *= 3;
          p.push(p[i - 1] * Math.exp(m + s * z));
        }
        dd = []; let pk = p[0];
        for (const v of p) { pk = Math.max(pk, v); dd.push(1 - v / pk); }
        ph = phasesOf(p, V.th / 100);
        const bears = ph.filter(x => x.type === 'bear'), bulls = ph.filter(x => x.type === 'bull' && !x.open);
        const yrs = n / 12;
        ro.set('n', bears.length + (bears.length ? ' (one every ' + (yrs / bears.length).toFixed(1) + ' years)' : ''));
        if (bears.length) {
          const fall = bears.reduce((a, b) => a + (1 - p[b.to] / p[b.from]), 0) / bears.length;
          const mo = bears.reduce((a, b) => a + (b.to - b.from), 0) / bears.length;
          ro.set('bear', '−' + kit.pct(fall, 0) + ' over ' + mo.toFixed(0) + ' months');
        } else ro.set('bear', 'none in this history');
        if (bulls.length) {
          const rise = bulls.reduce((a, b) => a + (p[b.to] / p[b.from] - 1), 0) / bulls.length;
          const mo = bulls.reduce((a, b) => a + (b.to - b.from), 0) / bulls.length;
          ro.set('bull', '+' + kit.pct(rise, 0) + ' over ' + (mo / 12).toFixed(1) + ' years');
        } else ro.set('bull', 'one long rise');
        let wi = 0; dd.forEach((v, i) => { if (v > dd[wi]) wi = i; });
        let pi = wi; while (pi > 0 && dd[pi] > 0) pi--;
        let ri = wi; while (ri < p.length && p[ri] < p[pi]) ri++;
        ro.set('worst', '−' + kit.pct(dd[wi], 0) + (ri < p.length ? '; back to the old peak ' + ((ri - pi) / 12).toFixed(1) + ' years after it' : '; not yet back to the old peak'));
        ro.set('under', kit.pct(dd.filter(v => v > 0.1).length / dd.length, 0) + ' of all months');
        ro.set('cagr', kit.pct(Math.pow(p[n] / p[0], 1 / yrs) - 1, 1) + ' a year (100 became ' + group(p[n]) + ')');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 62, y0 = 30, w = W - x0 - 14, hAll = Hh - y0 - 30, hP = hAll * 0.68, gap = 16, hD = hAll - hP - gap, yD = y0 + hP + gap;
        const n = p.length - 1, X = i => x0 + i / n * w;
        let lo = Math.min(...p), hi = Math.max(...p);
        const logS = !!V.log;
        const Y = logS ? v => y0 + hP - (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * hP : v => y0 + hP - (v - lo) / (hi - lo) * hP;
        if (logS) { lo *= 0.9; hi *= 1.1; yAxisLog(c, C, x0, y0, w, hP, lo, hi, v => String(Number(v.toPrecision(3)))); }
        else { lo = 0; hi *= 1.05; yAxis(c, C, x0, y0, w, hP, lo, hi, v => String(Math.round(v)), 5); }
        const maxDD = Math.max(0.2, ...dd) * 1.05;
        yAxis(c, C, x0, yD, w, hD, -maxDD, 0, v => Math.round(v * 100) + ' %', 3);
        // bear shading and labels
        for (const b of ph.filter(x => x.type === 'bear')) {
          const xa = X(b.from), xb = X(b.to);
          c.globalAlpha = 0.16; c.fillStyle = C.bad; c.fillRect(xa, y0, Math.max(1.5, xb - xa), hP); c.fillRect(xa, yD, Math.max(1.5, xb - xa), hD); c.globalAlpha = 1;
          if (xb - xa > 22) kit.label(c, '−' + Math.round((1 - p[b.to] / p[b.from]) * 100) + ' %', (xa + xb) / 2, y0 + 10, { size: 10.5, color: C.bad, align: 'center', weight: 600 });
        }
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        p.forEach((v, i) => i ? c.lineTo(X(i), Y(v)) : c.moveTo(X(i), Y(v)));
        c.stroke();
        // underwater
        c.fillStyle = C.bad; c.globalAlpha = 0.45; c.beginPath(); c.moveTo(X(0), yD);
        dd.forEach((v, i) => c.lineTo(X(i), yD + v / maxDD * hD));
        c.lineTo(X(n), yD); c.closePath(); c.fill(); c.globalAlpha = 1;
        // axes text
        c.fillStyle = C.muted; c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top';
        const yrs = n / 12, tick = yrs > 60 ? 20 : yrs > 30 ? 10 : 5;
        for (let yv = 0; yv <= yrs + 1e-9; yv += tick) c.fillText(String(yv), X(yv * 12), yD + hD + 4);
        kit.label(c, W > 520 ? 'Simulated history — random monthly returns (start = 100)' : 'Simulated history (start = 100)', x0, y0 - 16, { size: 11.5, color: C.muted });
        kit.label(c, 'below the last peak', x0 + 6, yD + 9, { size: 11, color: C.text2 });
        kit.label(c, 'year', x0 + w, yD + hD + 21, { size: 11, color: C.muted, align: 'right' });
      }
      build();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ short selling */
  Hyper.sim('stk-short', {
    title: 'A short sale: capped gain, open-ended loss',
    blurb: `You sell short shares at **¤50** and must buy them back later. The chart shows your profit or loss against the buy-back price, after the borrowing fee and the dividends you must pay; the dashed line is what simply **owning** the shares would give. Right of the margin-call price the broker would force you to buy back.

- Move the buy-back price to ¤100, then ¤150: the loss keeps growing, while the gain can never exceed the ¤50 a share you sold for.
- Hold the short longer or raise the borrowing fee: the whole line sinks, and break-even moves below ¤50.
- **Play a random path** or **a short squeeze**: a simulated price wanders for the months you hold. A short can be right in the end and still be called out first.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const P0 = 50, M0 = 0.5;
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Shares sold short', min: 100, max: 1000, step: 100, value: 100 },
        { id: 'P1', label: 'Price when you buy back', min: 0, max: 150, step: 0.5, value: 40, fmt: v => kit.money(v) },
        { id: 'mo', label: 'Months the short is open', min: 1, max: 36, step: 1, value: 6 },
        { id: 'fee', label: 'Borrowing fee (yearly)', min: 0.25, max: 50, value: 2, log: true, sig: 2, unit: '%' },
        { id: 'div', label: 'Dividends paid meanwhile, per share', min: 0, max: 3, step: 0.05, value: 0.6, fmt: v => kit.money(v) },
        { id: 'mm', type: 'select', label: 'Maintenance margin', options: [['25 %', 0.25], ['30 %', 0.3], ['40 %', 0.4]], value: 0.3 },
        { id: 'long', type: 'check', label: 'Compare with owning the shares', value: true },
        { type: 'buttons', items: [{ id: 'walk', label: 'Play a random path', primary: true }, { id: 'squeeze', label: 'Play a short squeeze' }] }
      ], id => {
        if (id === 'walk' || id === 'squeeze') startPath(id === 'squeeze');
        else if (id === 'P1') path = null;
        loop.once();
      });
      const ro = kit.readout(box.side, [['proc', 'Received from the sale'], ['cost', 'Borrowing fee + dividends'], ['pl', 'Profit or loss at this price'], ['be', 'Break-even buy-back price'], ['max', 'Most you can gain'], ['dbl', 'If the price doubles'], ['call', 'Margin call at'], ['path', 'Simulated path']]);
      const V = ctl.values;
      let path = null, pathSeed = 5;
      const costsOf = () => V.n * (P0 * V.fee / 100 * V.mo / 12 + V.div);
      const shortPL = P => V.n * (P0 - P) - costsOf();
      const longPL = P => V.n * (P - P0) + V.n * V.div;
      const callPx = () => P0 * (1 + M0) / (1 + V.mm);
      function startPath(squeeze) {
        pathSeed += 1;
        const g = kit.fin.normals(pathSeed * 4099), days = Math.max(21, Math.round(V.mo * 21)), sd = 0.45 / Math.sqrt(252);
        const pts = [P0];
        for (let k = 1; k <= days; k++) {
          let r = sd * g() - 0.0002;
          if (squeeze && k > days * 0.55 && k <= days * 0.55 + 12) r = 0.075 + sd * g();
          pts.push(clamp(pts[k - 1] * Math.exp(r), 0.5, 150));
        }
        path = { pts, k: 0, acc: 0, called: -1, squeeze };
        loop.start();
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 76, y0 = 28, w = W - x0 - 18, h = Hh - y0 - 40;
        const n = V.n, cost = costsOf(), pc = callPx();
        const yLo = Math.min(shortPL(150), longPL(0)) * 1.05, yHi = Math.max(longPL(150), shortPL(0)) * 1.08;
        const X = P => x0 + P / 150 * w, Y = v => y0 + h - (v - yLo) / (yHi - yLo) * h;
        yAxis(c, C, x0, y0, w, h, yLo, yHi, v => kit.money(v, 0, true), 6);
        c.fillStyle = C.muted; c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let P = 0; P <= 150; P += 25) c.fillText(kit.money(P, 0), X(P), y0 + h + 5);
        kit.label(c, 'price when you buy back', x0 + w, y0 + h + 26, { size: 11, color: C.muted, align: 'right' });
        // margin-call zone
        if (pc < 150) {
          c.globalAlpha = 0.12; c.fillStyle = C.warn; c.fillRect(X(pc), y0, X(150) - X(pc), h); c.globalAlpha = 1;
          kit.label(c, 'margin call zone', X(pc) + 6, y0 + 10, { size: 11, color: C.warn, weight: 600 });
        }
        // zero line and the ¤50 sale price
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, Y(0)); c.lineTo(x0 + w, Y(0)); c.stroke();
        c.strokeStyle = C.grid; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(P0), y0); c.lineTo(X(P0), y0 + h); c.stroke(); c.setLineDash([]);
        // capped gain
        const cap = shortPL(0);
        c.strokeStyle = C.ok; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(x0, Y(cap)); c.lineTo(x0 + w, Y(cap)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'most the short can gain: ' + kit.money(cap, 0), x0 + w - 4, Y(cap) - 9, { size: 11, color: C.ok, align: 'right' });
        if (V.long) {
          c.strokeStyle = C.muted; c.lineWidth = 1.6; c.setLineDash([6, 4]);
          c.beginPath(); c.moveTo(X(0), Y(longPL(0))); c.lineTo(X(150), Y(longPL(150))); c.stroke(); c.setLineDash([]);
          kit.label(c, 'owning the shares', X(140), Y(longPL(140)) + 12, { size: 11, color: C.muted, align: 'right' });
        }
        c.strokeStyle = C.accent; c.lineWidth = 2.6;
        c.beginPath(); c.moveTo(X(0), Y(shortPL(0))); c.lineTo(X(150), Y(shortPL(150))); c.stroke();
        kit.arrow(c, X(135), Y(shortPL(135)), X(149), Y(shortPL(149)), C.accent, 2.6);
        kit.label(c, 'the loss keeps growing', X(146), Y(shortPL(146)) - 14, { size: 11, color: C.accent, align: 'right', weight: 600 });
        const be = P0 - cost / n;
        if (be > 0) { tri(c, X(be), Y(0) + 8, true, 4.5, C.text2); kit.label(c, 'break-even', X(be), Y(0) + 22, { size: 10.5, color: C.text2, align: 'center' }); }
        // the current price
        const P1 = V.P1, v = shortPL(P1);
        kit.dot(c, X(P1), Y(v), 6, v >= 0 ? C.ok : C.bad, C.bg2);
        kit.label(c, (v >= 0 ? '+' : '') + kit.money(v, 0), X(P1) + (P1 > 110 ? -10 : 10), Y(v) - 12, { size: 12.5, weight: 700, color: v >= 0 ? C.ok : C.bad, align: P1 > 110 ? 'right' : 'left' });
        // the simulated path, small, in the corner
        if (path) {
          const bx = x0 + 10, by = y0 + h - 76, bw = Math.min(220, w * 0.4), bh = 66;
          c.fillStyle = C.surface; c.strokeStyle = C.border; c.lineWidth = 1;
          c.beginPath(); if (c.roundRect) c.roundRect(bx, by, bw, bh, 6); else c.rect(bx, by, bw, bh); c.fill(); c.stroke();
          const pts = path.pts, top = Math.max(pc * 1.1, ...pts), K = pts.length - 1;
          const PX = k => bx + 6 + k / K * (bw - 12), PY = q => by + bh - 6 - q / top * (bh - 20);
          c.strokeStyle = C.warn; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(bx + 6, PY(pc)); c.lineTo(bx + bw - 6, PY(pc)); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.text2; c.lineWidth = 1.4; c.beginPath();
          for (let k = 0; k <= path.k; k++) k ? c.lineTo(PX(k), PY(pts[k])) : c.moveTo(PX(k), PY(pts[k]));
          c.stroke();
          kit.label(c, 'simulated price, ' + V.mo + ' months', bx + 6, by + 9, { size: 10.5, color: C.muted });
        }
        // read-outs
        ro.set('proc', kit.money(n * P0, 0) + ' (' + group(n) + ' × ' + kit.money(P0, 0) + ')');
        ro.set('cost', kit.money(cost));
        ro.set('pl', (v >= 0 ? '+' : '') + kit.money(v) + ' at ' + kit.money(P1));
        ro.set('be', be > 0 ? kit.money(be) : 'never: the costs exceed the sale price');
        ro.set('max', kit.money(cap) + ' (if the price falls to zero)');
        ro.set('dbl', kit.money(shortPL(2 * P0)) + ' at ' + kit.money(2 * P0, 0));
        ro.set('call', kit.money(pc) + ' (a rise of ' + kit.pct(pc / P0 - 1, 0) + ')');
        ro.set('path', !path ? 'press Play' : path.called >= 0 ? 'margin call on day ' + path.called + ' — bought back at ' + kit.money(path.pts[path.called]) : path.k >= path.pts.length - 1 ? 'held to the end: bought back at ' + kit.money(path.pts[path.k]) : 'day ' + path.k + ' of ' + (path.pts.length - 1));
      }
      const loop = kit.loop(dt => {
        if (path && path.called < 0 && path.k < path.pts.length - 1) {
          path.acc += dt * 30;
          while (path.acc >= 1 && path.k < path.pts.length - 1) {
            path.acc -= 1; path.k++;
            if (path.pts[path.k] >= callPx()) { path.called = path.k; break; }
          }
          ctl.set('P1', Math.round(path.pts[path.k] * 2) / 2);
        } else if (loop.running && dt > 0) loop.stop();
        draw();
      }, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ earnings, P/E and price */
  Hyper.sim('stk-pe', {
    title: 'Price = earnings × P/E',
    blurb: `A share's price is its earnings per share times the multiple investors pay for them. Here EPS starts at ¤2 and grows steadily while the P/E drifts from its starting to its ending value. The shaded gap is what the **change in the multiple** did; the bar on the right splits the yearly return into earnings growth, the change in P/E and reinvested dividends.

- With the defaults, earnings grow 6 % a year but the P/E falls from 25 to 15: the price barely moves in ten years.
- Swap the multiples (15 to 25): the same company returns far more.
- Set both P/Es equal: the price return equals the earnings growth. Over long periods, that and dividends are what is left.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'g', label: 'EPS growth (yearly)', min: -5, max: 20, step: 0.5, value: 6, unit: '%' },
        { id: 'pe0', label: 'P/E when you buy', min: 5, max: 50, step: 1, value: 25 },
        { id: 'pe1', label: 'P/E at the end', min: 5, max: 50, step: 1, value: 15 },
        { id: 'pay', label: 'Share of profit paid as dividends', min: 0, max: 100, step: 5, value: 40, unit: '%' },
        { id: 'T', label: 'Years held', min: 1, max: 30, step: 1, value: 10 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['p0', 'Price at the start'], ['p1', 'Price at the end'], ['pr', 'Price return'], ['dy', 'Average dividend yield'], ['tot', 'Total return (dividends reinvested)'], ['split', 'Where it came from, each year']]);
      const V = ctl.values;
      function model() {
        const g = V.g / 100, T = Math.round(V.T), E0 = 2, pts = [], flat = [];
        const steps = T * 12;
        for (let k = 0; k <= steps; k++) {
          const t = k / 12, E = E0 * Math.pow(1 + g, t), pe = V.pe0 * Math.pow(V.pe1 / V.pe0, t / T);
          pts.push([t, E * pe]); flat.push([t, E * V.pe0]);
        }
        let shares = 1, ySum = 0;
        for (let y = 1; y <= T; y++) {
          const E = E0 * Math.pow(1 + g, y), pe = V.pe0 * Math.pow(V.pe1 / V.pe0, y / T), P = E * pe, D = V.pay / 100 * E;
          shares *= 1 + D / P; ySum += D / P;
        }
        const P0 = E0 * V.pe0, P1 = E0 * Math.pow(1 + g, T) * V.pe1;
        const pr = Math.pow(P1 / P0, 1 / T) - 1, tr = Math.pow(shares * P1 / P0, 1 / T) - 1;
        return { pts, flat, P0, P1, E1: E0 * Math.pow(1 + g, T), pr, tr, g, mult: pr - g, div: tr - pr, dy: ySum / T, T, shares };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, m = model();
        const x0 = 66, y0 = 30, barW = 120, w = W - x0 - barW - 40, h = Hh - y0 - 40;
        const all = m.pts.concat(m.flat).map(p => p[1]);
        const lo = Math.min(...all) * 0.9, hi = Math.max(...all) * 1.1;
        const X = t => x0 + t / m.T * w, Y = v => y0 + h - (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * h;
        yAxisLog(c, C, x0, y0, w, h, lo, hi, v => kit.money(v, v < 10 ? 2 : 0));
        // gap between the two paths
        c.globalAlpha = 0.18; c.fillStyle = V.pe1 >= V.pe0 ? C.ok : C.bad; c.beginPath();
        m.pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1])));
        for (let i = m.flat.length - 1; i >= 0; i--) c.lineTo(X(m.flat[i][0]), Y(m.flat[i][1]));
        c.closePath(); c.fill(); c.globalAlpha = 1;
        c.strokeStyle = C.muted; c.lineWidth = 1.6; c.setLineDash([6, 4]); c.beginPath();
        m.flat.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath();
        m.pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
        c.fillStyle = C.muted; c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top';
        const tick = m.T > 20 ? 5 : m.T > 10 ? 2 : 1;
        for (let t = 0; t <= m.T; t += tick) c.fillText(String(t), X(t), y0 + h + 5);
        kit.label(c, 'year', x0 + w, y0 + h + 24, { size: 11, color: C.muted, align: 'right' });
        legend(kit, c, C, x0, y0 - 16, W > 560 ? [[C.accent, 'price = EPS × P/E', true], [C.muted, 'if the P/E had not changed', true]] : [[C.accent, 'price', true], [C.muted, 'P/E unchanged', true]]);
        // decomposition bar (percentage points a year)
        const parts = [['earnings', m.g, C.accent], ['P/E change', m.mult, m.mult >= 0 ? C.ok : C.bad], ['dividends', m.div, C.warn]];
        const pos = parts.reduce((s, p) => s + Math.max(0, p[1]), 0), neg = parts.reduce((s, p) => s + Math.max(0, -p[1]), 0);
        const bx = x0 + w + 40, bTop = y0 + 52, bBot = y0 + h, sc = (bBot - bTop) / Math.max(0.02, pos + neg), bz = bTop + pos * sc;
        kit.label(c, 'return each year', W - 8, y0 - 16, { size: 11, color: C.muted, align: 'right' });
        parts.forEach(([name, val, col], i) => kit.label(c, name + ' ' + pctS(val), bx - 4, y0 + 2 + i * 15, { size: 10.5, color: col, weight: 600 }));
        let up = bz, dn = bz;
        for (const [, val, col] of parts) {
          const hh = Math.abs(val) * sc;
          c.fillStyle = col;
          if (val >= 0) { c.fillRect(bx, up - hh, 34, hh); up -= hh; } else { c.fillRect(bx, dn, 34, hh); dn += hh; }
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 6, bz); c.lineTo(bx + 40, bz); c.stroke();
        kit.label(c, '0', bx - 9, bz, { size: 10.5, color: C.muted, align: 'right' });
        kit.dot(c, bx + 17, bz - m.tr * sc, 4.5, C.text, C.bg2);
        kit.label(c, 'total ' + pctS(m.tr), bx + 40, bz - m.tr * sc, { size: 11, color: C.text, weight: 600 });
        ro.set('p0', kit.money(m.P0) + ' = ' + kit.money(2) + ' × ' + V.pe0);
        ro.set('p1', kit.money(m.P1) + ' = ' + kit.money(m.E1) + ' × ' + V.pe1);
        ro.set('pr', pctS(m.pr, 2) + ' a year (× ' + (m.P1 / m.P0).toFixed(2) + ' in ' + m.T + ' years)');
        ro.set('dy', kit.pct(m.dy, 2));
        ro.set('tot', pctS(m.tr, 2) + ' a year (× ' + (m.shares * m.P1 / m.P0).toFixed(2) + ')');
        ro.set('split', 'earnings ' + pctS(m.g) + ', P/E ' + pctS(m.mult) + ', dividends ' + pctS(m.div));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Gordon growth model */
  Hyper.sim('stk-gordon', {
    title: 'The Gordon model: how growth and the discount rate drive value',
    blurb: `The value of a share whose dividend (**¤3** next year by default) grows at a steady rate for ever is $D_1/(r - g)$. The upper chart shows that value against the growth rate for your required return and one point either side; the lower chart shows what each future year's dividend is worth today.

- Push the growth towards the required return: the value shoots up, and at $g = r$ it has no limit.
- Move the required return by one point and watch the value jump — the reason share prices react so strongly to interest rates.
- In the lower chart, count how much of the value comes after the horizon you choose: with the defaults, most of it lies beyond ten years.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'D1', label: 'Dividend next year', min: 0.5, max: 10, step: 0.1, value: 3, fmt: v => kit.money(v) },
        { id: 'r', label: 'Required return', min: 3, max: 15, step: 0.1, value: 8, unit: '%' },
        { id: 'g', label: 'Dividend growth, for ever', min: -3, max: 12, step: 0.1, value: 4, unit: '%' },
        { id: 'N', label: 'Horizon for the "later" share', min: 5, max: 50, step: 1, value: 10, unit: 'years' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['val', 'Value today'], ['yield', 'Dividend yield at that value'], ['gup', 'With growth one point higher'], ['rup', 'With the required return one point higher'], ['tail', 'Value from dividends after the horizon']]);
      const V = ctl.values;
      const val = (D, r, g) => r - g > 1e-9 ? D / (r - g) : Infinity;
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const r = V.r / 100, g = V.g / 100, D1 = V.D1, v = val(D1, r, g), ok = fin(v);
        const x0 = 66, y0 = 30, w = W - x0 - 16, hAll = Hh - y0 - 34, hT = hAll * 0.56, gap = 60, hB = hAll - hT - gap, yB = y0 + hT + gap;
        // upper: value against growth
        const gLo = -0.03, gHi = 0.12, X = gg => x0 + (gg - gLo) / (gHi - gLo) * w;
        const yMax = ok ? Math.max(v * 2.2, D1 * 25) : D1 * 60;
        const Y = vv => y0 + hT - Math.min(vv, yMax) / yMax * hT;
        yAxis(c, C, x0, y0, w, hT, 0, yMax, vv => kit.money(vv, 0, true), 4);
        c.fillStyle = C.muted; c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let gg = -0.02; gg <= 0.12 + 1e-9; gg += 0.02) c.fillText(Math.round(gg * 100) + ' %', X(gg), y0 + hT + 4);
        kit.label(c, 'dividend growth g', x0 + w, y0 + hT + 20, { size: 11, color: C.muted, align: 'right' });
        [[r - 0.01, C.series[1], 'r − 1'], [r, C.accent, 'r'], [r + 0.01, C.series[2], 'r + 1']].forEach(([rr, col, name]) => {
          c.strokeStyle = col; c.lineWidth = rr === r ? 2.6 : 1.4; c.beginPath(); let on = false;
          for (let k = 0; k <= 300; k++) {
            const gg = gLo + k / 300 * (gHi - gLo);
            if (gg >= rr - 1e-4) break;
            const vv = val(D1, rr, gg);
            if (!fin(vv)) break;
            if (!on) { c.moveTo(X(gg), Y(vv)); on = true; } else c.lineTo(X(gg), Y(vv));
            if (vv > yMax) break;
          }
          c.stroke();
          if (rr > gLo && rr < gHi) {
            c.setLineDash([3, 4]); c.lineWidth = 1; c.beginPath(); c.moveTo(X(rr), y0); c.lineTo(X(rr), y0 + hT); c.stroke(); c.setLineDash([]);
            kit.label(c, 'g = ' + name, X(rr) + 3, y0 + 8 + (rr === r ? 0 : rr < r ? 14 : 28), { size: 10.5, color: col });
          }
        });
        if (ok && v <= yMax) {
          const left = X(g) < x0 + 110;
          kit.dot(c, X(g), Y(v), 6, C.accent, C.bg2);
          kit.label(c, kit.money(v), X(g) + (left ? 10 : -10), Y(v) - 12, { size: 12.5, weight: 700, color: C.text, align: left ? 'left' : 'right' });
        }
        else kit.label(c, W > 560 ? 'g ≥ r: no finite value — growth this fast cannot last for ever' : 'g ≥ r: no finite value', x0 + 10, y0 + 12, { size: 12, weight: 600, color: C.bad });
        // lower: present value of each year's dividend
        const K = 60, pv = [];
        for (let k = 1; k <= K; k++) pv.push(D1 * Math.pow(1 + g, k - 1) / Math.pow(1 + r, k));
        const pmax = Math.max(...pv) * 1.1, bw = w / K;
        yAxis(c, C, x0, yB, w, hB, 0, pmax, vv => kit.money(vv, 2), 3);
        pv.forEach((p, i) => { c.fillStyle = i + 1 <= V.N ? C.accent : C.warn; c.fillRect(x0 + i * bw + bw * 0.12, yB + hB - p / pmax * hB, bw * 0.76, p / pmax * hB); });
        c.fillStyle = C.muted; c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let k = 10; k <= K; k += 10) c.fillText(String(k), x0 + (k - 0.5) * bw, yB + hB + 4);
        kit.label(c, W > 520 ? 'what each year\'s dividend is worth today (years 1–' + K + ')' : 'each year\'s dividend, valued today', x0, yB - 28, { size: 11, color: C.muted });
        const tail = ok ? Math.pow((1 + g) / (1 + r), V.N) : 1;
        kit.label(c, 'after year ' + V.N + ': ' + (ok ? kit.pct(tail, 0) : 'all') + ' of the value', x0, yB - 12, { size: 11.5, color: C.warn, weight: 600 });
        ro.set('val', ok ? kit.money(v) : 'no finite value (g ≥ r)');
        ro.set('yield', ok ? kit.pct(D1 / v, 2) + ' (= r − g)' : '—');
        const vg = val(D1, r, g + 0.01), vr = val(D1, r + 0.01, g);
        ro.set('gup', fin(vg) ? kit.money(vg) + (ok ? ' (' + pctS(vg / v - 1, 0) + ')' : '') : 'no finite value');
        ro.set('rup', fin(vr) ? kit.money(vr) + (ok ? ' (' + pctS(vr / v - 1, 0) + ')' : '') : 'no finite value');
        ro.set('tail', ok ? kit.pct(tail, 1) + ' comes after year ' + V.N : 'the sum never settles');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ DCF */
  Hyper.sim('stk-dcf', {
    title: 'A discounted cash-flow valuation',
    blurb: `An illustrative company's free cash flows for the forecast years (outlined), what each is worth today (filled), and the **terminal value** for every year after, also discounted (the last bar). The stacked bar on the right shows where the value lies; the table shows the value per share for a point more or less on the discount rate and half a point on long-run growth.

- With the defaults the terminal value is about three quarters of the whole. Shorten the forecast to three years and it grows further.
- Move the WACC from 9 % to 8 %, then 10 %: a single point changes the value per share by about a fifth.
- Add net debt: the business is worth the same, but less of it belongs to the shareholders.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'F1', label: 'Free cash flow next year', min: 10, max: 500, step: 5, value: 100, fmt: v => kit.money(v, 0) + 'M' },
        { id: 'gr', label: 'Growth during the forecast', min: -5, max: 25, step: 0.5, value: 8, unit: '%' },
        { id: 'N', label: 'Forecast years', min: 3, max: 15, step: 1, value: 5 },
        { id: 'g', label: 'Growth for ever after', min: 0, max: 4, step: 0.1, value: 2.5, unit: '%' },
        { id: 'w', label: 'Discount rate (WACC)', min: 5, max: 14, step: 0.1, value: 9, unit: '%' },
        { id: 'nd', label: 'Net debt', min: -500, max: 2000, step: 25, value: 300, fmt: v => kit.money(v, 0) + 'M' },
        { id: 'sh', label: 'Shares (millions)', min: 10, max: 200, step: 1, value: 50 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pvE', 'Forecast years, discounted'], ['pvT', 'Terminal value, discounted'], ['ev', 'Enterprise value'], ['eq', 'Equity value'], ['ps', 'Value per share'], ['mult', 'Terminal value ÷ last cash flow']]);
      const tbl = kit.table(box.stage, [
        { label: 'WACC', key: 'w', align: 'left' },
        { label: 'growth − 0.5 pt', key: 'a', fmt: v => kit.money(v) },
        { label: 'growth as set', key: 'b', fmt: v => kit.money(v) },
        { label: 'growth + 0.5 pt', key: 'c', fmt: v => kit.money(v) }
      ], { maxHeight: 140 });
      const V = ctl.values;
      // amounts in millions: "¤450M", "¤1.8bn"
      const fmtM = v => Math.abs(v) >= 1000 ? kit.money(v / 1000, 2) + 'bn' : kit.money(v, v && Math.abs(v) < 10 ? 1 : 0) + 'M';
      function value(w, g) {
        const N = Math.round(V.N), flows = [], pvs = [];
        for (let k = 1; k <= N; k++) { const f = V.F1 * Math.pow(1 + V.gr / 100, k - 1); flows.push(f); pvs.push(f / Math.pow(1 + w, k)); }
        const TV = w - g > 1e-9 ? flows[N - 1] * (1 + g) / (w - g) : NaN, pvT = TV / Math.pow(1 + w, N);
        const pvE = pvs.reduce((a, b) => a + b, 0), ev = pvE + pvT, eq = ev - V.nd;
        return { flows, pvs, TV, pvT, pvE, ev, eq, ps: eq / V.sh, N };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const w = V.w / 100, g = V.g / 100, r = value(w, g);
        const x0 = 70, y0 = 30, sideW = 130, cw = W - x0 - sideW - 30, h = Hh - y0 - 42;
        const top = Math.max(r.pvT, ...r.flows) * 1.08;
        const Y = v => y0 + h - v / top * h;
        yAxis(c, C, x0, y0, cw, h, 0, top, fmtM, 5);
        const nb = r.N + 1, bw = cw / (nb + 0.5);
        r.flows.forEach((f, i) => {
          const x = x0 + i * bw + bw * 0.15, bi = bw * 0.7;
          c.strokeStyle = C.accent; c.lineWidth = 1.4; c.strokeRect(x, Y(f), bi, y0 + h - Y(f));
          c.fillStyle = C.accent; c.fillRect(x, Y(r.pvs[i]), bi, y0 + h - Y(r.pvs[i]));
        });
        const xt = x0 + r.N * bw + bw * 0.4, bt = bw * 0.9;
        c.fillStyle = C.warn; c.fillRect(xt, Y(r.pvT), bt, y0 + h - Y(r.pvT));
        kit.label(c, kit.money(r.pvT, 0) + 'M', xt + bt / 2, Y(r.pvT) - 9, { size: 11, color: C.warn, align: 'center', weight: 600 });
        c.fillStyle = C.muted; c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top';
        const tick = r.N > 10 ? 2 : 1;
        for (let k = 1; k <= r.N; k += tick) c.fillText(String(k), x0 + (k - 1) * bw + bw / 2, y0 + h + 5);
        c.fillText('terminal', xt + bt / 2, y0 + h + 5);
        kit.label(c, 'year', x0, y0 + h + 24, { size: 11, color: C.muted });
        legend(kit, c, C, x0, y0 - 16, W > 520 ? [[C.accent, 'cash flow, and its value today'], [C.warn, 'terminal value today']] : [[C.accent, 'value today'], [C.warn, 'terminal']]);
        // where the value is
        const sx = x0 + cw + 40, sw = 34, tot = r.ev;
        if (tot > 0) {
          const hE = r.pvE / tot * h, hT = r.pvT / tot * h;
          c.fillStyle = C.accent; c.fillRect(sx, y0 + h - hE, sw, hE);
          c.fillStyle = C.warn; c.fillRect(sx, y0 + h - hE - hT, sw, hT);
          kit.label(c, kit.pct(r.pvT / tot, 0), sx + sw + 6, y0 + h - hE - hT / 2, { size: 12, weight: 700, color: C.warn });
          kit.label(c, kit.pct(r.pvE / tot, 0), sx + sw + 6, y0 + h - hE / 2, { size: 12, weight: 700, color: C.accent });
          kit.label(c, 'share of value', sx + sw / 2, y0 + h + 12, { size: 11, color: C.muted, align: 'center' });
        }
        ro.set('pvE', kit.money(r.pvE, 1) + 'M');
        ro.set('pvT', kit.money(r.pvT, 1) + 'M (' + kit.pct(r.pvT / r.ev, 0) + ' of the total)');
        ro.set('ev', kit.money(r.ev, 1) + 'M');
        ro.set('eq', kit.money(r.eq, 1) + 'M');
        ro.set('ps', r.eq > 0 ? kit.money(r.ps) : 'nothing left for shareholders (' + kit.money(r.ps) + ')');
        ro.set('mult', (r.TV / r.flows[r.N - 1]).toFixed(1) + ' ×');
        const rows = [-0.01, 0, 0.01].map(dw => {
          const ww = w + dw;
          return { w: kit.pct(ww, 1) + (dw === 0 ? ' (as set)' : ''), a: value(ww, Math.max(0, g - 0.005)).ps, b: value(ww, g).ps, c: value(ww, g + 0.005).ps, _cls: dw === 0 ? 'hl' : '' };
        });
        tbl.set(rows);
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
