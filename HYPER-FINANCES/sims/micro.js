/* HYPER-FINANCES · sims/micro.js — microeconomics: supply and demand with surplus, elasticity
 * and revenue, taxes and price controls, cost curves and break-even, from monopoly to
 * competition, an externality with a corrective tax, a prisoner's dilemma tournament, and
 * comparative advantage with two production frontiers. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const n0 = v => Hyper.util.group(Math.round(v), 0);
  const n1 = v => Hyper.util.group(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1);
  const sgnMoney = (kit, v, dec) => (v > 0.005 ? '+' : '') + kit.money(v, dec);
  const sgn = (v, dec) => (v < -1e-12 ? '−' : v > 1e-12 ? '+' : '') + Math.abs(v).toFixed(dec);
  const neg = (v, dec) => (v < -1e-12 ? '−' : '') + Math.abs(v).toFixed(dec);

  /* ---------------------------------------------------------------- a chart area
     g.X(q), g.Y(p): data to pixels; g.q(x), g.p(y): pixels to data */
  function layout(st, o) {
    const x0 = o.x0 != null ? o.x0 : 60, y0 = o.y0 != null ? o.y0 : 26;
    const w = Math.max(40, o.w != null ? o.w : st.W - x0 - (o.right != null ? o.right : 18));
    const h = Math.max(40, o.h != null ? o.h : st.H - y0 - (o.bottom != null ? o.bottom : 44));
    const g = { x0, y0, w, h, qmax: o.qmax, pmax: o.pmax };
    g.X = q => g.x0 + q / g.qmax * g.w;
    g.Y = p => g.y0 + g.h - p / g.pmax * g.h;
    g.q = x => (x - g.x0) / g.w * g.qmax;
    g.p = y => (g.y0 + g.h - y) / g.h * g.pmax;
    g.inside = p => p.x >= g.x0 - 4 && p.x <= g.x0 + g.w + 4 && p.y >= g.y0 - 4 && p.y <= g.y0 + g.h + 4;
    return g;
  }
  function niceUp(v) {
    const s = Hyper.niceStep(v, 5);
    return Math.max(s, Math.ceil(v / s - 1e-9) * s);
  }
  function axes(kit, c, g, C, o) {
    o = o || {};
    const ps = Hyper.niceStep(g.pmax, o.ny || 5), qs = Hyper.niceStep(g.qmax, o.nx || 6);
    c.save();
    c.lineWidth = 1; c.font = '11px system-ui, sans-serif';
    c.strokeStyle = C.grid; c.fillStyle = C.muted;
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let p = ps; p <= g.pmax + 1e-9; p += ps) {
      const y = g.Y(p);
      c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x0 + g.w, y); c.stroke();
      c.fillText(o.fmtP ? o.fmtP(p) : kit.money(p, ps < 1 ? 2 : 0, true), g.x0 - 5, y);
    }
    c.fillText(o.fmtP ? o.fmtP(0) : '0', g.x0 - 5, g.y0 + g.h);
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (let q = qs; q <= g.qmax + 1e-9; q += qs) {
      const x = g.X(q);
      c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y0 + g.h); c.stroke();
      c.fillText(o.fmtQ ? o.fmtQ(q) : n1(q), x, g.y0 + g.h + 4);
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(g.x0, g.y0); c.lineTo(g.x0, g.y0 + g.h); c.lineTo(g.x0 + g.w, g.y0 + g.h); c.stroke();
    c.restore();
    if (o.xl) kit.label(c, o.xl, g.x0 + g.w, g.y0 + g.h + 27, { size: 11, color: C.muted, align: 'right' });
    if (o.yl) kit.label(c, o.yl, g.x0 - 50, g.y0 - 13, { size: 11, color: C.muted });
  }
  function clip(c, g) { c.save(); c.beginPath(); c.rect(g.x0, g.y0, g.w, g.h); c.clip(); }
  // a polygon given in data coordinates [q, p]
  function fillD(c, g, pts, color, alpha) {
    if (pts.length < 3) return;
    c.save(); c.globalAlpha = alpha == null ? 0.22 : alpha; c.fillStyle = color;
    c.beginPath(); c.moveTo(g.X(pts[0][0]), g.Y(pts[0][1]));
    for (let i = 1; i < pts.length; i++) c.lineTo(g.X(pts[i][0]), g.Y(pts[i][1]));
    c.closePath(); c.fill(); c.restore();
  }
  function lineD(c, g, pts, color, width, dash) {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = color; c.lineWidth = width || 2; c.lineJoin = 'round';
    if (dash) c.setLineDash(dash);
    c.beginPath(); c.moveTo(g.X(pts[0][0]), g.Y(pts[0][1]));
    for (let i = 1; i < pts.length; i++) c.lineTo(g.X(pts[i][0]), g.Y(pts[i][1]));
    c.stroke(); c.restore();
  }
  // a dashed guide from a point to both axes
  function guides(c, g, q, p, color) {
    c.save(); c.strokeStyle = color; c.lineWidth = 1; c.setLineDash([4, 4]);
    c.beginPath(); c.moveTo(g.X(0), g.Y(p)); c.lineTo(g.X(q), g.Y(p)); c.lineTo(g.X(q), g.Y(0)); c.stroke(); c.restore();
  }
  // a label that stays inside the chart
  function tag(kit, c, g, text, x, y, o) {
    o = o || {};
    const w = text.length * 6.4;
    let xx = x;
    if ((o.align || 'left') === 'left') xx = Math.min(x, g.x0 + g.w - w - 2);
    else if (o.align === 'right') xx = Math.max(x, g.x0 + w + 2);
    kit.label(c, text, xx, clamp(y, g.y0 + 8, g.y0 + g.h - 8), o);
  }
  // legend swatches in a row above a chart
  function legend(kit, c, x, y, items, C) {
    let xx = x;
    for (const [col, t] of items) {
      c.save(); c.globalAlpha = 0.55; c.fillStyle = col; c.fillRect(xx, y - 5, 11, 11); c.restore();
      kit.label(c, t, xx + 15, y + 0.5, { size: 11, color: C.text2 });
      xx += 22 + t.length * 6.2;
    }
  }
  // a seeded random source (mulberry32): the same seed gives the same games
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* the strawberry market used on every page: Qd = 1200 − 50P, Qs = −300 + 100P (kg a week, ¤ per kg) */
  const A0 = 1200, B0 = 50, C0 = -300, D0 = 100;

  /* ================================================================ supply and demand */
  Hyper.sim('mic-supply-demand', {
    title: 'Supply and demand: where the price settles',
    blurb: `A town's weekly market for strawberries. **Demand** (falling line) is how many kilograms buyers want at each price; **supply** (rising line) is how many growers bring. They cross at the **equilibrium**: ¤10 a kilogram and 700 kg a week. **Drag either curve** sideways to shift it, or use the sliders.

- Shift demand to the right (a heat wave, a health report): price and quantity both rise. Shift supply to the left (a rainy season): the price rises and the quantity falls.
- Tick **Fix the price myself** and set ¤8: buyers want 800 kg, growers bring 500 — a shortage. Press **Let the price adjust** and watch the shortage pull the price up to where the plans match.
- The shaded triangles are the **consumer surplus** (what buyers would have paid above the price) and the **producer surplus**. Make buyers less responsive and see who gains.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const kg = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(Math.round(v)) + ' kg';
      const per1 = ' (kg per ' + kit.money(1, 0) + ')';
      let adjusting = false, g = null;
      const ctl = kit.controls(box.side, [
        { id: 'dD', label: 'Demand shift, at every price', min: -400, max: 400, step: 10, value: 0, fmt: kg },
        { id: 'dS', label: 'Supply shift, at every price', min: -400, max: 250, step: 10, value: 0, fmt: kg },
        { id: 'b', label: 'Buyers\' response' + per1, min: 20, max: 150, step: 5, value: B0, fmt: v => '−' + Math.round(v) + ' kg' },
        { id: 'd', label: 'Growers\' response' + per1, min: 30, max: 300, step: 5, value: D0, fmt: v => '+' + Math.round(v) + ' kg' },
        { id: 'surplus', type: 'check', label: 'Shade consumer and producer surplus', value: params.surplus !== false },
        { id: 'manual', type: 'check', label: 'Fix the price myself', value: !!params.manual },
        { id: 'P', label: 'Price you set', min: 1, max: 28, step: 0.1, value: params.P || 8, fmt: v => kit.money(v) },
        { type: 'buttons', items: [{ id: 'release', label: 'Let the price adjust', primary: true }, { id: 'reset', label: 'Reset curves' }] }
      ], id => {
        if (id === 'reset') { ctl.set('dD', 0); ctl.set('dS', 0); ctl.set('b', B0); ctl.set('d', D0); adjusting = false; }
        else if (id === 'release') { if (!V.manual) ctl.set('manual', true); adjusting = equil(model()).Q > 0; }
        else adjusting = false;
        if (adjusting) loop.start(); else loop.once();
      });
      const ro = kit.readout(box.side, [['eq', 'Equilibrium'], ['cs', 'Consumer surplus'], ['ps', 'Producer surplus'], ['at', 'At your price'], ['gap', 'Gap']]);
      const V = ctl.values;
      const model = () => ({ a: A0 + V.dD, b: V.b, c: C0 + V.dS, d: V.d });
      function equil(m) {
        const P = (m.a - m.c) / (m.b + m.d), Q = m.a - m.b * P;
        return Q > 0 ? { P, Q } : { P: 0, Q: 0, none: true };
      }

      function draw(dt) {
        const m = model(), e = equil(m);
        if (adjusting && dt > 0) {
          // the price moves in the direction of the gap: up when buyers want more than is offered
          const P = V.P + 0.9 * (e.P - V.P) * Math.min(dt, 0.05) * 2;
          if (Math.abs(e.P - P) < 0.01) { ctl.set('P', Math.round(e.P * 100) / 100); adjusting = false; loop.stop(); }
          else ctl.set('P', clamp(P, 1, 28));
        }
        const C = kit.colors(), c = st.begin();
        g = layout(st, { qmax: 1600, pmax: 30 });
        axes(kit, c, g, C, { xl: 'kilograms a week', yl: 'price per kg' });
        const colD = C.accent, colS = C.series[1];
        clip(c, g);
        if (V.surplus && !V.manual && !e.none) {
          fillD(c, g, [[0, e.P], [0, m.a / m.b], [e.Q, e.P]], colD, 0.2);
          fillD(c, g, [[0, e.P], [0, -m.c / m.d], [e.Q, e.P]], colS, 0.22);
        }
        // the starting curves, faint, once they have moved
        if (V.dD !== 0 || V.b !== B0) lineD(c, g, [[A0, 0], [0, A0 / B0]], colD, 1.2, [5, 5]);
        if (V.dS !== 0 || V.d !== D0) lineD(c, g, [[0, -C0 / D0], [C0 + D0 * 40, 40]], colS, 1.2, [5, 5]);
        lineD(c, g, [[m.a, 0], [0, m.a / m.b]], colD, 2.6);
        lineD(c, g, [[0, -m.c / m.d], [m.c + m.d * 40, 40]], colS, 2.6);
        c.restore();
        // names on the curves
        const pD = Math.min(m.a / m.b, g.pmax) * 0.86, qD = m.a - m.b * pD;
        tag(kit, c, g, 'Demand', g.X(qD) + 8, g.Y(pD), { size: 12, color: colD, weight: 600 });
        let qS = m.c + m.d * g.pmax * 0.9, pS = g.pmax * 0.9;
        if (qS > g.qmax * 0.92) { qS = g.qmax * 0.92; pS = (qS - m.c) / m.d; }
        tag(kit, c, g, 'Supply', g.X(qS) + 8, g.Y(pS), { size: 12, color: colS, weight: 600 });
        if (V.surplus && !V.manual && !e.none) {
          tag(kit, c, g, 'consumer surplus', g.X(e.Q * 0.12), g.Y(e.P + (m.a / m.b - e.P) * 0.3), { size: 11, color: C.text2 });
          tag(kit, c, g, 'producer surplus', g.X(e.Q * 0.12), g.Y(e.P - (e.P + m.c / m.d) * 0.35), { size: 11, color: C.text2 });
        }
        if (!e.none) {
          guides(c, g, e.Q, e.P, C.faint);
          kit.dot(c, g.X(e.Q), g.Y(e.P), 5.5, C.text, C.bg2);
          if (!V.manual) tag(kit, c, g, 'equilibrium ' + kit.money(e.P) + ', ' + n0(e.Q) + ' kg', g.X(e.Q) + 10, g.Y(e.P) - 12, { size: 11.5, color: C.text, bg: C.bg2 });
        }
        ro.set('eq', e.none ? 'no trade: the cheapest grower asks more than any buyer will pay' : kit.money(e.P) + ' per kg, ' + n0(e.Q) + ' kg a week');
        ro.set('cs', e.none ? '—' : kit.money(0.5 * (m.a / m.b - e.P) * e.Q, 0));
        ro.set('ps', e.none ? '—' : kit.money(0.5 * (e.P + m.c / m.d) * e.Q, 0));
        if (V.manual) {
          const P = V.P, qd = Math.max(0, m.a - m.b * P), qs = Math.max(0, m.c + m.d * P), y = g.Y(P);
          c.save(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.setLineDash([7, 4]);
          c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x0 + g.w, y); c.stroke(); c.restore();
          kit.label(c, kit.money(P), g.x0 + 4, y - 9, { size: 11, color: C.text, weight: 600 });
          if (qd <= g.qmax) kit.dot(c, g.X(qd), y, 4.5, colD, C.bg2);
          if (qs <= g.qmax) kit.dot(c, g.X(qs), y, 4.5, colS, C.bg2);
          const gap = qd - qs;
          if (Math.abs(gap) > 2) {
            const xa = g.X(Math.min(qd, qs, g.qmax)), xb = g.X(Math.min(Math.max(qd, qs), g.qmax));
            c.save(); c.strokeStyle = gap > 0 ? C.bad : C.warn; c.lineWidth = 4; c.globalAlpha = 0.7;
            c.beginPath(); c.moveTo(xa, y); c.lineTo(xb, y); c.stroke(); c.restore();
            const txt = (gap > 0 ? 'shortage ' : 'surplus ') + n0(Math.abs(gap)) + ' kg';
            tag(kit, c, g, txt, (xa + xb) / 2 - txt.length * 3, y + (gap > 0 ? 14 : -14), { size: 11.5, color: gap > 0 ? C.bad : C.warn, weight: 600 });
            const ax = Math.min(xb + 18, g.x0 + g.w - 10);
            kit.arrow(c, ax, y, ax, y + (gap > 0 ? -26 : 26), gap > 0 ? C.bad : C.warn, 2);
          }
          ro.set('at', 'buyers want ' + n0(qd) + ' kg, growers bring ' + n0(qs) + ' kg');
          ro.set('gap', Math.abs(gap) < 1 ? 'none: the plans match' : gap > 0 ? 'shortage of ' + n0(gap) + ' kg: the price is pushed up' : 'surplus of ' + n0(-gap) + ' kg: the price is pushed down');
        } else { ro.set('at', 'tick "Fix the price myself"'); ro.set('gap', '—'); }
      }
      kit.drag(st, {
        hit(p) {
          if (!g || !g.inside(p)) return null;
          if (V.manual && Math.abs(p.y - g.Y(V.P)) < 9) return 'P';
          const m = model(), q = g.q(p.x), pr = g.p(p.y);
          const dD = Math.abs(q - (m.a - m.b * pr)) / g.qmax * g.w, dS = Math.abs(q - (m.c + m.d * pr)) / g.qmax * g.w;
          if (Math.min(dD, dS) > 14) return null;
          return dD <= dS ? 'D' : 'S';
        },
        move(k, p) {
          const q = clamp(g.q(p.x), 0, g.qmax), pr = clamp(g.p(p.y), 0, g.pmax);
          adjusting = false;
          if (k === 'P') ctl.set('P', clamp(Math.round(pr * 10) / 10, 1, 28));
          else if (k === 'D') ctl.set('dD', clamp(Math.round((q + V.b * pr - A0) / 10) * 10, -400, 400));
          else ctl.set('dS', clamp(Math.round((q - V.d * pr - C0) / 10) * 10, -400, 250));
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ elasticity */
  Hyper.sim('mic-elasticity', {
    title: 'Elasticity and revenue along a demand curve',
    blurb: `Left: the strawberry demand curve, with the **revenue** at the chosen price as a rectangle (price × quantity). Right: revenue at every price. Drag on either chart or use the slider, then look at what a **price change** does: the green area is revenue gained on the kilograms still sold, the red area revenue lost on the kilograms no longer bought.

- On the straight line, low prices are **inelastic** (a price rise raises revenue) and high prices **elastic** (a rise lowers it). Revenue peaks at ¤12, the midpoint, where the elasticity is exactly −1.
- Switch to a **constant-elasticity** curve: with elasticity 1 revenue is the same at every price; with 0.5 a rise always pays; with 2 it never does.
- Try a cut of −20 % at ¤18 and at ¤6: the same cut, opposite effects on revenue.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Demand curve', options: [['Straight line', 'lin'], ['Constant elasticity 0.5 (inelastic)', 0.5], ['Constant elasticity 1 (unit)', 1], ['Constant elasticity 2 (elastic)', 2]], value: params.shape || 'lin' },
        { id: 'P', label: 'Price per kg', min: 1, max: 23, step: 0.1, value: params.P || 10, fmt: v => kit.money(v) },
        { id: 'chg', label: 'Then change the price by', min: -30, max: 30, step: 1, value: 10, fmt: v => (v > 0 ? '+' : '') + Math.round(v) + ' %' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pt', 'Price and quantity'], ['e', 'Elasticity here'], ['r', 'Revenue'], ['nw', 'After the change'], ['dr', 'Revenue change'], ['arc', 'Midpoint elasticity']]);
      const V = ctl.values;
      const Qof = P => V.shape === 'lin' ? Math.max(0, A0 - B0 * P) : 700 * Math.pow(10 / Math.max(P, 1e-6), V.shape);
      const Eof = P => { if (V.shape !== 'lin') return -V.shape; const Q = Qof(P); return Q > 0 ? -B0 * P / Q : -Infinity; };
      let gL = null, gR = null;
      function draw() {
        const C = kit.colors(), c = st.begin();
        const split = Math.round(st.W * 0.56);
        gL = layout(st, { x0: 58, w: split - 58 - 14, qmax: 1600, pmax: 25, y0: 30 });
        gR = layout(st, { x0: split + 46, w: st.W - split - 46 - 16, qmax: 12000, pmax: 25, y0: 30 });
        axes(kit, c, gL, C, { xl: 'kg a week', yl: 'price per kg', nx: 4 });
        axes(kit, c, gR, C, { xl: 'revenue a week', yl: '', fmtQ: v => kit.money(v, 0, true), nx: 3 });
        const P = V.P, Q = Qof(P), R = P * Q, E = Eof(P);
        const P2 = clamp(P * (1 + V.chg / 100), 0.05, 40), Q2 = Qof(P2), R2 = P2 * Q2;
        const colE = C.series[3], colI = C.series[2];
        // revenue rectangle and the change
        clip(c, gL);
        fillD(c, gL, [[0, 0], [Q, 0], [Q, P], [0, P]], C.accent, 0.16);
        if (Math.abs(V.chg) > 0.5) {
          if (P2 > P) { fillD(c, gL, [[0, P], [Q2, P], [Q2, P2], [0, P2]], C.ok, 0.45); fillD(c, gL, [[Q2, 0], [Q, 0], [Q, P], [Q2, P]], C.bad, 0.45); }
          else { fillD(c, gL, [[Q, 0], [Q2, 0], [Q2, P2], [Q, P2]], C.ok, 0.45); fillD(c, gL, [[0, P2], [Q, P2], [Q, P], [0, P]], C.bad, 0.45); }
        }
        // the curve
        if (V.shape === 'lin') {
          lineD(c, gL, [[0, 24], [600, 12]], colE, 2.8);
          lineD(c, gL, [[600, 12], [1200, 0]], colI, 2.8);
        } else {
          const pts = [];
          for (let p = 0.3; p <= 26; p += 0.1) pts.push([Qof(p), p]);
          lineD(c, gL, pts, V.shape > 1 ? colE : V.shape < 1 ? colI : C.accent, 2.8);
        }
        c.restore();
        if (V.shape === 'lin') {
          kit.dot(c, gL.X(600), gL.Y(12), 4, C.text, C.bg2);
          tag(kit, c, gL, 'elastic', gL.X(250) + 10, gL.Y(19), { size: 11.5, color: colE, weight: 600 });
          tag(kit, c, gL, 'unit elastic', gL.X(600) + 9, gL.Y(12) - 2, { size: 11, color: C.text2 });
          tag(kit, c, gL, 'inelastic', gL.X(950) + 8, gL.Y(6), { size: 11.5, color: colI, weight: 600 });
        }
        if (Q <= gL.qmax) { guides(c, gL, Q, P, C.faint); kit.dot(c, gL.X(Q), gL.Y(P), 6, C.accent, C.bg2); }
        if (Math.abs(V.chg) > 0.5 && Q2 <= gL.qmax && P2 <= gL.pmax) kit.dot(c, gL.X(Q2), gL.Y(P2), 4.5, C.text, C.bg2);
        if (Math.abs(V.chg) > 0.5) {
          const gain = P2 > P ? (P2 - P) * Q2 : P2 * (Q2 - Q), loss = P2 > P ? P * (Q - Q2) : (P - P2) * Q;
          kit.label(c, '+' + kit.money(gain, 0) + ' gained', gL.x0 + 6, gL.y0 + 8, { size: 11.5, color: C.ok, weight: 600 });
          kit.label(c, '−' + kit.money(loss, 0) + ' lost', gL.x0 + 6, gL.y0 + 24, { size: 11.5, color: C.bad, weight: 600 });
        }
        // revenue at every price (price on the vertical axis, as on the left)
        clip(c, gR);
        const rp = [];
        for (let p = 0.2; p <= 25.05; p += 0.1) rp.push([p * Qof(p), p]);
        lineD(c, gR, rp, C.accent, 2.4);
        c.restore();
        if (V.shape === 'lin') { kit.dot(c, gR.X(7200), gR.Y(12), 3.5, C.text, C.bg2); tag(kit, c, gR, 'most revenue', gR.X(7200) + 8, gR.Y(12), { size: 11, color: C.text2 }); }
        if (R <= gR.qmax) kit.dot(c, gR.X(R), gR.Y(P), 6, C.accent, C.bg2);
        if (Math.abs(V.chg) > 0.5 && R2 <= gR.qmax && P2 <= gR.pmax && R <= gR.qmax) kit.arrow(c, gR.X(R), gR.Y(P), gR.X(R2), gR.Y(P2), R2 >= R ? C.ok : C.bad, 2);
        // read-outs
        const kind = E === -Infinity ? 'nobody buys' : Math.abs(E + 1) < 0.02 ? 'unit elastic' : E < -1 ? 'elastic' : 'inelastic';
        ro.set('pt', kit.money(P) + ' → ' + n0(Q) + ' kg');
        ro.set('e', (E === -Infinity ? '−∞' : neg(E, 2)) + ' (' + kind + ')');
        ro.set('r', kit.money(R, 0));
        ro.set('nw', kit.money(P2) + ' → ' + n0(Q2) + ' kg, revenue ' + kit.money(R2, 0));
        ro.set('dr', sgnMoney(kit, R2 - R, 0) + (R > 0 ? ' (' + sgn((R2 / R - 1) * 100, 1) + ' %)' : ''));
        const arc = (Math.abs(P2 - P) > 1e-9 && Q + Q2 > 0) ? ((Q2 - Q) / ((Q + Q2) / 2)) / ((P2 - P) / ((P + P2) / 2)) : NaN;
        ro.set('arc', Number.isFinite(arc) ? neg(arc, 2) : '—');
      }
      kit.drag(st, {
        hit: p => (gL && gL.inside(p)) || (gR && gR.inside(p)) ? 'P' : null,
        move(k, p) { ctl.set('P', clamp(Math.round(gL.p(p.y) * 10) / 10, 1, 23)); loop.once(); },
        hover: true
      });
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ taxes and price controls */
  Hyper.sim('mic-policy', {
    title: 'Taxes, ceilings and floors: who gains, who loses',
    blurb: `The strawberry market again (¤10 and 700 kg a week without any policy), now with a rule from the government. The shaded areas are **consumer surplus**, **producer surplus**, the **tax revenue**, and in red the **deadweight loss** — the value of trades that no longer happen.

- **Tax**: at ¤3 a kilogram buyers pay ¤12 and growers keep ¤9, so buyers carry two-thirds. Switch between a tax collected from sellers and one collected from buyers: the outcome is identical.
- Make buyers less responsive (fewer kilograms lost per ¤1): they carry more of the tax and the red triangle shrinks. Double the tax: the red triangle grows about four times.
- **Ceiling** at ¤8: growers bring 500 kg, buyers want 800. **Floor** at ¤12: 900 kg offered, 600 bought. Either way the red triangle is the value of the kilograms no longer traded (200 under the ceiling, 100 under the floor) — and buyers as a group gain from the ceiling even though the market shrinks.`,
    mount(box, kit, params) {
      params = params || {};
      const mode0 = params.mode || 'tax';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const per1 = ' (kg per ' + kit.money(1, 0) + ')';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Policy', options: [['A tax per kg, collected from sellers', 'tax'], ['A tax per kg, collected from buyers', 'taxb'], ['A price ceiling (maximum price)', 'ceiling'], ['A price floor (minimum price)', 'floor'], ['No policy', 'none']], value: mode0 },
        { id: 't', label: 'Tax per kg', min: 0, max: 14, step: 0.1, value: params.t != null ? params.t : 3, fmt: v => kit.money(v) },
        { id: 'lim', label: 'Legal price limit', min: 2, max: 22, step: 0.1, value: mode0 === 'floor' ? 12 : 8, fmt: v => kit.money(v) },
        { id: 'b', label: 'Buyers\' response' + per1, min: 25, max: 150, step: 5, value: B0, fmt: v => '−' + Math.round(v) + ' kg' },
        { id: 'd', label: 'Growers\' response' + per1, min: 40, max: 300, step: 5, value: D0, fmt: v => '+' + Math.round(v) + ' kg' }
      ], (id, v) => {
        if (id === 'mode') { if (v === 'ceiling') ctl.set('lim', 8); if (v === 'floor') ctl.set('lim', 12); showRows(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['q', 'Quantity traded'], ['pb', 'Buyers pay'], ['ps', 'Growers receive'], ['rev', 'Tax revenue'], ['split', 'Who carries the tax'], ['gap', 'Shortage or surplus'], ['dwl', 'Deadweight loss'], ['cs', 'Consumer surplus'], ['ps2', 'Producer surplus']]);
      const V = ctl.values;
      function showRows() {
        const tax = V.mode === 'tax' || V.mode === 'taxb', lim = V.mode === 'ceiling' || V.mode === 'floor';
        ctl.show('t', tax); ctl.show('lim', lim);
        ro.show('rev', tax); ro.show('split', tax); ro.show('gap', lim);
      }
      showRows();
      function solve() {
        const a = A0, c = C0, b = V.b, d = V.d;
        const P0 = (a - c) / (b + d), Q0 = a - b * P0, Pmax = a / b, Pmin = -c / d;
        const TS0 = 0.5 * (Pmax - Pmin) * Q0;
        const r = { a, b, c, d, P0, Q0, Pmax, Pmin, TS0, Q: Q0, Pb: P0, Ps: P0, rev: 0, gap: 0, binding: false };
        if (V.mode === 'tax' || V.mode === 'taxb') {
          const t = V.t;
          r.Q = Math.max(0, Q0 - t * b * d / (b + d));
          r.Pb = r.Q > 0 ? (a - r.Q) / b : Pmax; r.Ps = r.Q > 0 ? (r.Q - c) / d : Pmin;
          r.rev = t * r.Q; r.binding = t > 0;
          r.cs = 0.5 * (Pmax - r.Pb) * r.Q; r.ps = 0.5 * (r.Ps - Pmin) * r.Q;
        } else if (V.mode === 'ceiling' && V.lim < P0) {
          const L = V.lim;
          r.binding = true; r.Q = Math.max(0, c + d * L); r.Pb = r.Ps = L; r.gap = (a - b * L) - r.Q;
          r.Pd = (a - r.Q) / b;
          r.cs = (Pmax - L) * r.Q - r.Q * r.Q / (2 * b); r.ps = 0.5 * Math.max(0, L - Pmin) * r.Q;
        } else if (V.mode === 'floor' && V.lim > P0) {
          const L = V.lim;
          r.binding = true; r.Q = Math.max(0, a - b * L); r.Pb = r.Ps = L; r.gap = (c + d * L) - r.Q;
          r.Pl = (r.Q - c) / d;
          r.cs = 0.5 * Math.max(0, Pmax - L) * r.Q; r.ps = (L - Pmin) * r.Q - r.Q * r.Q / (2 * d);
        } else { r.cs = 0.5 * (Pmax - P0) * Q0; r.ps = 0.5 * (P0 - Pmin) * Q0; }
        r.dwl = Math.max(0, r.TS0 - r.cs - r.ps - r.rev);
        return r;
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), r = solve();
        const g = layout(st, { qmax: 1600, pmax: 30 });
        axes(kit, c, g, C, { xl: 'kilograms a week', yl: 'price per kg' });
        const colD = C.accent, colS = C.series[1], colT = C.series[5];
        const tax = V.mode === 'tax' || V.mode === 'taxb';
        clip(c, g);
        if (r.Q > 0) {
          // consumer surplus, producer surplus, tax revenue, lost trades
          if (V.mode === 'ceiling' && r.binding) fillD(c, g, [[0, r.Pmax], [r.Q, r.Pd], [r.Q, V.lim], [0, V.lim]], colD, 0.2);
          else fillD(c, g, [[0, r.Pmax], [r.Q, r.Pb], [0, r.Pb]], colD, 0.2);
          if (V.mode === 'floor' && r.binding) fillD(c, g, [[0, r.Pmin], [r.Q, r.Pl], [r.Q, V.lim], [0, V.lim]], colS, 0.22);
          else fillD(c, g, [[0, r.Pmin], [r.Q, r.Ps], [0, r.Ps]], colS, 0.22);
          if (tax && r.rev > 0) fillD(c, g, [[0, r.Ps], [r.Q, r.Ps], [r.Q, r.Pb], [0, r.Pb]], colT, 0.3);
        }
        if (r.binding && r.dwl > 0.5) {
          let top, bot;
          if (tax) { top = r.Q > 0 ? r.Pb : r.Pmax; bot = r.Q > 0 ? r.Ps : r.Pmin; }
          else if (V.mode === 'ceiling') { top = r.Pd; bot = V.lim; }
          else { top = V.lim; bot = r.Pl; }
          fillD(c, g, [[r.Q, top], [r.Q0, r.P0], [r.Q, bot]], C.bad, 0.5);
        }
        // curves
        lineD(c, g, [[r.a, 0], [0, r.Pmax]], colD, 2.6);
        lineD(c, g, [[0, r.Pmin], [r.c + r.d * 40, 40]], colS, 2.6);
        if (V.mode === 'tax' && V.t > 0) lineD(c, g, [[0, r.Pmin + V.t], [r.c + r.d * 40, 40 + V.t]], colS, 1.6, [7, 5]);
        if (V.mode === 'taxb' && V.t > 0) lineD(c, g, [[r.a, -V.t], [0, r.Pmax - V.t]], colD, 1.6, [7, 5]);
        c.restore();
        tag(kit, c, g, 'Demand', g.X(r.a - r.b * Math.min(r.Pmax, 29) * 0.9) + 8, g.Y(Math.min(r.Pmax, 29) * 0.9), { size: 12, color: colD, weight: 600 });
        let qS = r.c + r.d * 27, pS = 27;
        if (qS > g.qmax * 0.9) { qS = g.qmax * 0.9; pS = (qS - r.c) / r.d; }
        tag(kit, c, g, 'Supply', g.X(qS) + 8, g.Y(pS) + 8, { size: 12, color: colS, weight: 600 });
        if (V.mode === 'tax' && V.t > 0) tag(kit, c, g, 'supply + tax', g.X(Math.max(0, qS - r.d * V.t)) - 90, g.Y(pS), { size: 11, color: colS });
        if (V.mode === 'taxb' && V.t > 0) tag(kit, c, g, 'demand − tax', g.X(Math.max(0, r.a - r.b * (8 + V.t))) + 6, g.Y(8) + 4, { size: 11, color: colD });
        // the old equilibrium
        kit.dot(c, g.X(r.Q0), g.Y(r.P0), 4, C.faint, C.bg2);
        // prices
        const hline = (p, col, txt, below) => {
          const y = g.Y(p);
          c.save(); c.strokeStyle = col; c.lineWidth = 1.3; c.setLineDash([5, 4]);
          c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x0 + g.w, y); c.stroke(); c.restore();
          kit.label(c, txt, g.x0 + g.w - 4, y + (below ? 10 : -9), { size: 11, color: col, align: 'right', weight: 600 });
        };
        if (tax && r.Q > 0 && V.t > 0) {
          hline(r.Pb, C.text, 'buyers pay ' + kit.money(r.Pb), false);
          hline(r.Ps, C.text2, 'growers keep ' + kit.money(r.Ps), true);
          tag(kit, c, g, 'tax revenue', g.X(r.Q * 0.35), g.Y((r.Pb + r.Ps) / 2), { size: 11, color: C.text });
        }
        if (V.mode === 'ceiling' || V.mode === 'floor') {
          hline(V.lim, r.binding ? C.bad : C.muted, (V.mode === 'ceiling' ? 'ceiling ' : 'floor ') + kit.money(V.lim) + (r.binding ? '' : ' (not binding)'), V.mode === 'ceiling');
          if (r.binding && r.gap > 0) {
            const qa = r.Q, qb = r.Q + r.gap, y = g.Y(V.lim);
            c.save(); c.strokeStyle = V.mode === 'ceiling' ? C.bad : C.warn; c.lineWidth = 4; c.globalAlpha = 0.75;
            c.beginPath(); c.moveTo(g.X(qa), y); c.lineTo(g.X(Math.min(qb, g.qmax)), y); c.stroke(); c.restore();
            tag(kit, c, g, (V.mode === 'ceiling' ? 'shortage ' : 'surplus ') + n0(r.gap) + ' kg', g.X((qa + Math.min(qb, g.qmax)) / 2) - 40, y + (V.mode === 'ceiling' ? -12 : 13), { size: 11.5, color: V.mode === 'ceiling' ? C.bad : C.warn, weight: 600 });
          }
        }
        if (r.binding && r.dwl > 0.5 && r.Q < r.Q0) tag(kit, c, g, 'lost trades', g.X(r.Q0) + 8, g.Y(r.P0) + 16, { size: 11, color: C.bad, weight: 600 });
        legend(kit, c, g.x0 + 60, g.y0 - 13, [[colD, 'consumers'], [colS, 'producers']].concat(tax ? [[colT, 'tax']] : []).concat([[C.bad, 'lost']]), C);
        // read-outs
        ro.set('q', n0(r.Q) + ' kg (' + n0(r.Q0) + ' without the policy)');
        ro.set('pb', r.Q > 0 ? kit.money(r.Pb) : '—');
        ro.set('ps', r.Q > 0 ? kit.money(r.Ps) : '—');
        ro.set('rev', kit.money(r.rev, 0));
        const bShare = V.t > 0 && r.Q > 0 ? (r.Pb - r.P0) / (r.Pb - r.Ps) : r.d / (r.b + r.d);
        ro.set('split', 'buyers ' + kit.pct(bShare, 0) + ', growers ' + kit.pct(1 - bShare, 0));
        ro.set('gap', !r.binding ? 'none: the limit does not bind' : (V.mode === 'ceiling' ? 'shortage of ' : 'surplus of ') + n0(r.gap) + ' kg');
        ro.set('dwl', kit.money(r.dwl, 0) + ' a week');
        ro.set('cs', kit.money(r.cs, 0) + ' (' + sgnMoney(kit, r.cs - 0.5 * (r.Pmax - r.P0) * r.Q0, 0) + ')');
        ro.set('ps2', kit.money(r.ps, 0) + ' (' + sgnMoney(kit, r.ps - 0.5 * (r.P0 - r.Pmin) * r.Q0, 0) + ')');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ costs and break-even */
  Hyper.sim('mic-costs', {
    title: 'Costs, the best output and the break-even point',
    blurb: `A small firm that sells at the going market price. Its costs are **fixed** (rent, equipment — paid whatever it makes), **variable** (ingredients, energy), and at high output **marginal cost rises** (overtime, crowded ovens).

- **Per unit** view: the best output is where the price line meets **marginal cost**. The rectangle between price and **average total cost** is the profit (green) or loss (red). Drag the price line.
- Lower the price below the lowest average total cost: the firm makes a loss, but keeps producing as long as the price covers **average variable cost** — stopping would lose all the fixed costs.
- **Totals** view: revenue is a straight line, cost a curve; they cross at the **break-even points**, and profit is largest where the two slopes are equal. Set the rise in marginal cost to zero for the classic straight-line break-even chart.`,
    mount(box, kit, params) {
      params = params || {};
      const unit = params.unit || 'loaves', one = params.one || 'loaf', per = params.per || 'week';
      const QMAX = params.qmax || 4000;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Per unit: cost curves', 'unit'], ['Totals: revenue and cost', 'total']], value: params.view || 'unit' },
        { id: 'P', label: 'Price per ' + one, min: 0.2, max: 14, step: 0.05, value: params.P != null ? params.P : 3, fmt: v => kit.money(v) },
        { id: 'F', label: 'Fixed costs a ' + per, min: 0, max: 8000, step: 100, value: params.F != null ? params.F : 2000, fmt: v => kit.money(v, 0) },
        { id: 'v', label: 'Variable cost per ' + one, min: 0, max: 8, step: 0.05, value: params.v != null ? params.v : 0.5, fmt: v => kit.money(v) },
        { id: 'm', label: 'Marginal cost rises, per 1,000 ' + unit, min: 0, max: 3, step: 0.05, value: params.m != null ? params.m : 1, fmt: v => '+' + kit.money(v) }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['best', 'Best output'], ['profit', 'Profit a ' + per], ['avg', 'Average cost there'], ['be', 'Break-even price'], ['shut', 'Shut-down price'], ['beq', 'Break-even output']]);
      const V = ctl.values;
      function econ() {
        const F = V.F, v = V.v, m = V.m, P = V.P;
        const TC = Q => F + v * Q + m * Q * Q / 2000;
        const MC = Q => v + m * Q / 1000;
        const AVC = Q => v + m * Q / 2000;
        const ATC = Q => TC(Q) / Math.max(Q, 1e-9);
        let Qb, why;
        if (P <= v) { Qb = 0; why = 'shut down'; }
        else if (m > 0 && 1000 * (P - v) / m < QMAX) { Qb = 1000 * (P - v) / m; why = 'price = marginal cost'; }
        else { Qb = QMAX; why = 'full capacity'; }
        const profit = P * Qb - TC(Qb);
        let qLow = m > 0 ? Math.sqrt(2000 * F / m) : QMAX;
        if (qLow > QMAX) qLow = QMAX;
        const bePrice = F <= 0 ? v : ATC(Math.max(qLow, 1e-6));
        const be = [];
        if (m > 0) {
          const A = m / 2000, B = P - v, D = B * B - 4 * A * F;
          if (B > 0 && D >= 0) for (const q of [(B - Math.sqrt(D)) / (2 * A), (B + Math.sqrt(D)) / (2 * A)]) if (q > 0 && q <= QMAX) be.push(q);
        } else if (P > v) { const q = F / (P - v); if (q <= QMAX) be.push(q); }
        return { F, v, m, P, TC, MC, AVC, ATC, Qb, why, profit, qLow, bePrice, be };
      }
      let g = null;
      function draw() {
        const C = kit.colors(), c = st.begin(), e = econ();
        const colMC = C.series[3], colATC = C.accent, colAVC = C.series[2], colP = C.text;
        if (V.view === 'unit') {
          const pmax = niceUp(Math.max(e.P * 1.6, e.bePrice * 1.8, e.v + 1, 2));
          g = layout(st, { qmax: QMAX, pmax });
          axes(kit, c, g, C, { xl: unit + ' a ' + per, yl: 'per ' + one, fmtP: p => kit.money(p, pmax < 10 ? 2 : 0) });
          clip(c, g);
          if (e.Qb > 0) {
            const atc = e.ATC(e.Qb);
            fillD(c, g, [[0, atc], [e.Qb, atc], [e.Qb, e.P], [0, e.P]], e.profit >= 0 ? C.ok : C.bad, 0.3);
          }
          const atc = [], avc = [];
          for (let i = 1; i <= 240; i++) { const q = QMAX * i / 240; atc.push([q, e.ATC(q)]); avc.push([q, e.AVC(q)]); }
          lineD(c, g, avc, colAVC, 2, [6, 4]);
          lineD(c, g, atc, colATC, 2.4);
          lineD(c, g, [[0, e.MC(0)], [QMAX, e.MC(QMAX)]], colMC, 2.4);
          lineD(c, g, [[0, e.P], [QMAX, e.P]], colP, 1.8);
          c.restore();
          tag(kit, c, g, 'price (= marginal revenue)', g.x0 + 6, g.Y(e.P) - 10, { size: 11, color: colP, weight: 600 });
          const lab = (t, q, p, col, dy) => { if (p < pmax * 0.97 && p > 0) tag(kit, c, g, t, g.X(q) + 6, g.Y(p) + (dy || 0), { size: 11.5, color: col, weight: 600 }); };
          lab('marginal cost', QMAX * 0.8, e.MC(QMAX * 0.8), colMC, -12);
          lab('average total cost', QMAX * 0.62, e.ATC(QMAX * 0.62), colATC, -12);
          lab('average variable cost', QMAX * 0.7, e.AVC(QMAX * 0.7), colAVC, 12);
          if (e.bePrice < pmax) {
            kit.dot(c, g.X(e.qLow), g.Y(e.bePrice), 4, colATC, C.bg2);
          }
          if (e.Qb > 0) {
            guides(c, g, e.Qb, e.P, C.faint);
            kit.dot(c, g.X(e.Qb), g.Y(e.P), 6, colMC, C.bg2);
            const atcB = e.ATC(e.Qb);
            if (atcB < pmax) tag(kit, c, g, (e.profit >= 0 ? 'profit ' : 'loss ') + kit.money(Math.abs(e.profit), 0), g.X(e.Qb * 0.5) - 30, g.Y((e.P + atcB) / 2), { size: 11.5, color: C.text, weight: 600, bg: C.bg2 });
          } else tag(kit, c, g, 'price below average variable cost: produce nothing', g.x0 + 10, g.y0 + 12, { size: 11.5, color: C.bad, weight: 600 });
        } else {
          const ymax = niceUp(Math.max(e.P * QMAX, e.TC(QMAX), e.F * 1.2, 100) * 1.05);
          g = layout(st, { qmax: QMAX, pmax: ymax, x0: 66 });
          axes(kit, c, g, C, { xl: unit + ' a ' + per, yl: 'a ' + per, fmtP: p => kit.money(p, 0, true) });
          clip(c, g);
          const n = 200;
          for (let i = 0; i < n; i++) {
            const q1 = QMAX * i / n, q2 = QMAX * (i + 1) / n, qm = (q1 + q2) / 2;
            const up = e.P * qm - e.TC(qm) >= 0;
            fillD(c, g, [[q1, e.P * q1], [q2, e.P * q2], [q2, e.TC(q2)], [q1, e.TC(q1)]], up ? C.ok : C.bad, 0.22);
          }
          const tc = [], vc = [];
          for (let i = 0; i <= n; i++) { const q = QMAX * i / n; tc.push([q, e.TC(q)]); vc.push([q, e.TC(q) - e.F]); }
          lineD(c, g, [[0, e.F], [QMAX, e.F]], C.muted, 1.4, [4, 4]);
          lineD(c, g, vc, colAVC, 1.8, [6, 4]);
          lineD(c, g, tc, colATC, 2.6);
          lineD(c, g, [[0, 0], [QMAX, e.P * QMAX]], colMC, 2.6);
          c.restore();
          tag(kit, c, g, 'revenue', g.X(QMAX * 0.86) + 4, g.Y(e.P * QMAX * 0.86) - 12, { size: 11.5, color: colMC, weight: 600 });
          tag(kit, c, g, 'total cost', g.X(QMAX * 0.93) - 70, g.Y(e.TC(QMAX * 0.93)) + 13, { size: 11.5, color: colATC, weight: 600 });
          tag(kit, c, g, 'fixed cost', g.x0 + 6, g.Y(e.F) - 9, { size: 11, color: C.muted });
          tag(kit, c, g, 'variable cost', g.X(QMAX * 0.5) + 6, g.Y(e.TC(QMAX * 0.5) - e.F) + 11, { size: 11, color: colAVC });
          for (const q of e.be) {
            kit.dot(c, g.X(q), g.Y(e.P * q), 5.5, C.warn, C.bg2);
            tag(kit, c, g, 'break-even ' + n0(Math.ceil(q - 1e-9)), g.X(q) + 7, g.Y(e.P * q) + 14, { size: 11, color: C.warn, weight: 600 });
          }
          if (e.Qb > 0 && e.Qb < QMAX) {
            const y1 = g.Y(e.P * e.Qb), y2 = g.Y(e.TC(e.Qb)), x = g.X(e.Qb);
            c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y1); c.lineTo(x, y2); c.stroke(); c.restore();
            tag(kit, c, g, (e.profit >= 0 ? 'most profit ' : 'smallest loss ') + kit.money(Math.abs(e.profit), 0), x + 6, (y1 + y2) / 2, { size: 11.5, color: C.text, weight: 600, bg: C.bg2 });
          }
        }
        ro.set('best', e.Qb > 0 ? n0(e.Qb) + ' ' + unit + ' (' + e.why + ')' : 'none: shut down (price at or below ' + kit.money(e.v) + ')');
        ro.set('profit', sgnMoney(kit, e.profit, 0) + (e.Qb === 0 ? ' (the fixed costs)' : ''));
        ro.set('avg', e.Qb > 0 ? kit.money(e.ATC(e.Qb)) + ' per ' + one + ' (price ' + kit.money(e.P) + ')' : '—');
        ro.set('be', kit.money(e.bePrice) + ' (lowest average total cost)');
        ro.set('shut', kit.money(e.v) + ' (lowest average variable cost)');
        ro.set('beq', e.be.length ? e.be.map(q => n0(Math.ceil(q - 1e-9))).join(' and ') + ' ' + unit : 'none at this price (within ' + n0(QMAX) + ')');
      }
      kit.drag(st, {
        hit(p) {
          if (!g || !g.inside(p)) return null;
          if (V.view === 'unit') return Math.abs(p.y - g.Y(V.P)) < 12 ? 'P' : null;
          const q = g.q(p.x);
          return q > QMAX * 0.08 && Math.abs(p.y - g.Y(V.P * q)) < 14 ? 'R' : null;
        },
        move(k, p) {
          let P;
          if (k === 'P') P = g.p(p.y);
          else { const q = Math.max(g.q(p.x), QMAX * 0.08); P = g.p(p.y) / q; }
          ctl.set('P', clamp(Math.round(P * 20) / 20, 0.2, 14));
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ monopoly, oligopoly, competition */
  Hyper.sim('mic-oligopoly', {
    title: 'From monopoly to competition',
    blurb: `A ferry route with demand $P = 60 - 0.01\\,Q$ (a fare in ¤, trips a week) and a constant cost per trip. With **one firm**, the monopolist sets marginal revenue equal to marginal cost: a high fare, fewer trips, a large profit — and the red triangle of trips that would have been worth making. Add firms: each chooses how many trips to run given the others (**Cournot** competition), and the fare falls towards cost.

- Go from 1 to 2, 4 and 10 firms and watch the fare in the lower graph: most of the fall comes from the first few rivals.
- Tick **cartel**: the firms agree to act as one monopolist and share the profit. Then tick **one member cheats**: its profit rises — which is why cartels are hard to hold together.
- Raise the cost per trip: with market power, only part of a cost increase is passed on to the fare.`,
    mount(box, kit) {
      const A = 60, B = 0.01, QC = 6000;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Number of firms', min: 1, max: 20, step: 1, value: 1 },
        { id: 'c', label: 'Cost of one more trip', min: 0, max: 40, step: 1, value: 10, fmt: v => kit.money(v, 0) },
        { id: 'cartel', type: 'check', label: 'The firms form a cartel', value: false },
        { id: 'cheat', type: 'check', label: 'One member secretly runs more trips', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['p', 'Fare'], ['q', 'Trips a week'], ['mk', 'Markup over cost'], ['pr', 'Profit a week'], ['cs', 'Passengers\' surplus'], ['dwl', 'Deadweight loss'], ['hhi', 'Concentration (HHI)'], ['ch', 'The cheater']]);
      const plot = kit.plot(box.stage, { x: { label: 'number of firms', min: 1, max: 20 }, y: { label: 'fare', min: 0, max: 60, fmt: v => kit.money(v, 0) }, fmtY: v => kit.money(v) }, 150);
      const V = ctl.values;
      function market() {
        const N = Math.max(1, Math.round(V.N)), c = V.c, Qc = (A - c) / B;
        const r = { N, c, Qc, cheat: false };
        if (V.cartel || N === 1) {
          const Qm = (A - c) / (2 * B), q = Qm / N;
          if (V.cartel && V.cheat && N >= 2) {
            const qx = Math.max(0, (A - c - B * (N - 1) * q) / (2 * B));
            r.Q = (N - 1) * q + qx; r.P = A - B * r.Q; r.cheat = true;
            r.qx = qx; r.q = q; r.pix = (r.P - c) * qx; r.pio = (r.P - c) * q; r.piCartel = (A - B * Qm - c) * q;
            const S = r.Q; r.hhi = ((N - 1) * Math.pow(q / S * 100, 2) + Math.pow(qx / S * 100, 2));
          } else { r.Q = Qm; r.P = A - B * Qm; r.hhi = 10000 / N; }
        } else {
          r.Q = N / (N + 1) * Qc; r.P = (A + N * c) / (N + 1); r.hhi = 10000 / N;
        }
        r.profit = (r.P - c) * r.Q; r.cs = 0.5 * (A - r.P) * r.Q; r.dwl = 0.5 * (r.P - c) * (Qc - r.Q);
        return r;
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), r = market();
        const g = layout(st, { qmax: QC, pmax: 65 });
        axes(kit, c, g, C, { xl: 'trips a week', yl: 'fare' });
        const colD = C.accent, colMC = C.series[1], colMR = C.series[3];
        clip(c, g);
        fillD(c, g, [[0, A], [r.Q, r.P], [0, r.P]], colD, 0.2);
        fillD(c, g, [[0, r.c], [r.Q, r.c], [r.Q, r.P], [0, r.P]], C.ok, 0.3);
        fillD(c, g, [[r.Q, r.P], [r.Qc, r.c], [r.Q, r.c]], C.bad, 0.5);
        lineD(c, g, [[0, A], [A / B, 0]], colD, 2.6);
        lineD(c, g, [[0, r.c], [QC, r.c]], colMC, 2.4);
        if (r.N === 1 || V.cartel) lineD(c, g, [[0, A], [A / (2 * B), 0]], colMR, 1.8, [7, 5]);
        c.restore();
        tag(kit, c, g, 'demand', g.X(4800) + 6, g.Y(A - B * 4800) - 10, { size: 11.5, color: colD, weight: 600 });
        tag(kit, c, g, 'marginal cost', g.X(QC * 0.8), g.Y(r.c) - 10, { size: 11.5, color: colMC, weight: 600 });
        if (r.N === 1 || V.cartel) tag(kit, c, g, 'marginal revenue', g.X(1900) + 8, g.Y(A - 2 * B * 1900), { size: 11, color: colMR, weight: 600 });
        guides(c, g, r.Q, r.P, C.faint);
        kit.dot(c, g.X(r.Qc), g.Y(r.c), 4, C.faint, C.bg2);
        kit.dot(c, g.X(r.Q), g.Y(r.P), 6, C.text, C.bg2);
        tag(kit, c, g, (r.N === 1 ? 'monopoly' : V.cartel ? (r.cheat ? 'cartel, one cheating' : 'cartel') : r.N + ' firms') + ': ' + kit.money(r.P), g.X(r.Q) + 9, g.Y(r.P) - 12, { size: 11.5, color: C.text, weight: 600, bg: C.bg2 });
        tag(kit, c, g, 'competitive', g.X(r.Qc) - 30, g.Y(r.c) + 14, { size: 11, color: C.muted });
        legend(kit, c, g.x0 + 60, g.y0 - 13, [[colD, 'passengers'], [C.ok, 'profit'], [C.bad, 'lost trips']], C);
        // the fare as firms are added
        const pts = [];
        for (let n = 1; n <= 20; n++) pts.push([n, (A + n * r.c) / (n + 1)]);
        const series = [{ pts, label: 'fare with N competing firms', dots: 3 }];
        if (V.cartel) series.push({ pts: [[1, (A + r.c) / 2], [20, (A + r.c) / 2]], label: 'cartel fare', dash: [6, 4] });
        plot.set({ series, hlines: [{ y: r.c, label: 'cost' }], marks: [{ x: r.N, y: r.P, label: kit.money(r.P) }] });
        ro.set('p', kit.money(r.P) + ' (cost ' + kit.money(r.c, 0) + ')');
        ro.set('q', n0(r.Q) + ' of ' + n0(r.Qc) + ' worth making');
        ro.set('mk', r.P > 0 ? kit.pct((r.P - r.c) / r.P, 0) + ' of the fare' : '—');
        ro.set('pr', kit.money(r.profit, 0) + (r.N > 1 && !r.cheat ? ' (' + kit.money(r.profit / r.N, 0) + ' each)' : ''));
        ro.set('cs', kit.money(r.cs, 0));
        ro.set('dwl', kit.money(r.dwl, 0));
        ro.set('hhi', n0(r.hhi) + (r.hhi > 2500 ? ' (highly concentrated)' : r.hhi > 1500 ? ' (moderately concentrated)' : ' (unconcentrated)'));
        ro.set('ch', r.cheat ? 'earns ' + kit.money(r.pix, 0) + ' instead of ' + kit.money(r.piCartel, 0) + '; each loyal member ' + kit.money(r.pio, 0) : '—');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ externality */
  Hyper.sim('mic-externality', {
    title: 'An external cost and a corrective tax',
    blurb: `A product whose making pollutes. Buyers' willingness to pay is the demand curve; the producers' own costs are the **private** supply curve. The pollution does harm to other people — the **external cost** per tonne — which nobody in the market pays. Adding it gives the **social cost** curve.

- With no tax, the market makes 25 thousand tonnes, where demand meets private cost; the best amount for society is 17.5, where demand meets social cost. The red triangle is the value lost by producing the extra units.
- Press **Tax = harm**: a tax equal to the external cost makes producers face the full cost, and the market lands exactly on the best amount (a *Pigouvian* tax).
- Set the tax above the harm: now too little is produced, and a red triangle appears on the other side.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'mec', label: 'Harm to others, per tonne', min: 0, max: 60, step: 1, value: 30, fmt: v => kit.money(v, 0) },
        { id: 't', label: 'Tax per tonne', min: 0, max: 80, step: 1, value: 0, fmt: v => kit.money(v, 0) },
        { id: 'soc', type: 'check', label: 'Show the social cost curve', value: true },
        { type: 'buttons', items: [{ id: 'pigou', label: 'Tax = harm', primary: true }, { id: 'zero', label: 'No tax' }] }
      ], id => { if (id === 'pigou') ctl.set('t', V.mec); if (id === 'zero') ctl.set('t', 0); loop.once(); });
      const ro = kit.readout(box.side, [['q', 'Output'], ['best', 'Best for society'], ['pb', 'Price buyers pay'], ['dmg', 'Harm done a year'], ['rev', 'Tax raised a year'], ['dwl', 'Value lost a year']]);
      const V = ctl.values;
      // thousand tonnes a year, ¤ per tonne: demand P = 120 − 2Q, private cost 20 + 2Q
      const MB = q => 120 - 2 * q, MPC = q => 20 + 2 * q;
      function draw() {
        const C = kit.colors(), c = st.begin();
        const g = layout(st, { qmax: 50, pmax: 140 });
        axes(kit, c, g, C, { xl: 'thousand tonnes a year', yl: 'per tonne' });
        const mec = V.mec, t = V.t;
        const Qt = clamp((100 - t) / 4, 0, 50), Qo = clamp((100 - mec) / 4, 0, 50);
        const colD = C.accent, colS = C.series[1], colSoc = C.series[3];
        clip(c, g);
        if (Math.abs(Qt - Qo) > 1e-6) {
          if (Qt > Qo) fillD(c, g, [[Qo, MB(Qo)], [Qt, MPC(Qt) + mec], [Qt, MB(Qt)]], C.bad, 0.5);
          else fillD(c, g, [[Qt, MB(Qt)], [Qt, MPC(Qt) + mec], [Qo, MB(Qo)]], C.bad, 0.5);
        }
        if (t > 0 && Qt > 0) fillD(c, g, [[0, MPC(Qt)], [Qt, MPC(Qt)], [Qt, MB(Qt)], [0, MB(Qt)]], C.series[5], 0.25);
        lineD(c, g, [[0, 120], [60, 0]], colD, 2.6);
        lineD(c, g, [[0, 20], [60, 140]], colS, 2.6);
        if (V.soc && mec > 0) lineD(c, g, [[0, 20 + mec], [60, 140 + mec]], colSoc, 2.2, [8, 5]);
        if (t > 0) lineD(c, g, [[0, 20 + t], [60, 140 + t]], colS, 1.5, [3, 4]);
        c.restore();
        tag(kit, c, g, 'demand (value to buyers)', g.X(40) - 20, g.Y(MB(40)) + 16, { size: 11.5, color: colD, weight: 600 });
        tag(kit, c, g, 'private cost', g.X(44) + 6, g.Y(MPC(44)) + 6, { size: 11.5, color: colS, weight: 600 });
        if (V.soc && mec > 0) tag(kit, c, g, 'social cost', g.X(Math.min(44, (120 - mec) / 2)) - 80, g.Y(MPC(Math.min(44, (120 - mec) / 2)) + mec), { size: 11.5, color: colSoc, weight: 600 });
        if (t > 0) tag(kit, c, g, 'private cost + tax', g.X(Math.max(2, (125 - t) / 2)) + 6, g.Y(MPC(Math.max(2, (125 - t) / 2)) + t) + 12, { size: 11, color: colS });
        guides(c, g, Qt, MB(Qt), C.faint);
        kit.dot(c, g.X(Qt), g.Y(MB(Qt)), 6, C.text, C.bg2);
        tag(kit, c, g, 'market', g.X(Qt) + 9, g.Y(MB(Qt)) - 12, { size: 11.5, color: C.text, weight: 600 });
        if (mec > 0 && Math.abs(Qt - Qo) > 0.05) { kit.dot(c, g.X(Qo), g.Y(MB(Qo)), 5, colSoc, C.bg2); tag(kit, c, g, 'best', g.X(Qo) - 38, g.Y(MB(Qo)) - 12, { size: 11.5, color: colSoc, weight: 600 }); }
        legend(kit, c, g.x0 + 60, g.y0 - 13, [[C.series[5], 'tax raised'], [C.bad, 'value lost']], C);
        const dwl = 0.5 * Math.abs(mec - t) * Math.abs(Qt - Qo) * 1000;
        ro.set('q', n1(Qt) + ' thousand tonnes');
        ro.set('best', n1(Qo) + ' thousand tonnes');
        ro.set('pb', kit.money(MB(Qt)) + ' per tonne');
        ro.set('dmg', kit.money(mec * Qt * 1000, 0));
        ro.set('rev', kit.money(t * Qt * 1000, 0));
        ro.set('dwl', kit.money(dwl, 0) + (dwl < 1 ? ' (none)' : Qt > Qo ? ' (too much made)' : ' (too little made)'));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ repeated prisoner's dilemma */
  const STRATS = [
    { name: 'Always cooperate', move: () => 1 },
    { name: 'Always defect', move: () => 0 },
    { name: 'Tit for tat', move: (me, op) => op.length ? op[op.length - 1] : 1 },
    { name: 'Grim trigger', move: (me, op, rnd, s) => (s.angry = s.angry || (op.length > 0 && op[op.length - 1] === 0)) ? 0 : 1 },
    { name: 'Tit for two tats', move: (me, op) => op.length >= 2 && op[op.length - 1] === 0 && op[op.length - 2] === 0 ? 0 : 1 },
    { name: 'Win-stay, lose-shift', move: (me, op) => !me.length ? 1 : me[me.length - 1] === op[op.length - 1] ? 1 : 0 },
    { name: 'Generous tit for tat', move: (me, op, rnd) => !op.length || op[op.length - 1] === 1 ? 1 : rnd() < 1 / 3 ? 1 : 0 },
    { name: 'Random', move: (me, op, rnd) => rnd() < 0.5 ? 1 : 0 }
  ];
  Hyper.sim('mic-prisoners', {
    title: 'A prisoner\'s dilemma tournament',
    blurb: `Eight strategies play the repeated prisoner's dilemma against each other and against a copy of themselves. Each round both players choose to **cooperate** or **defect**: both cooperate, 3 points each; both defect, 1 each; a defector facing a cooperator gets the **temptation** (5) and the cooperator 0. The bars show each strategy's average points per round.

- With no noise, strategies that never defect first fill the top places — grim trigger, tit for tat and its relatives. **Always defect** never scores less than its opponent in any single game, yet it finishes last: it only ever earns 1 point a round from anyone who hits back.
- Add a little **noise** (1–3 % of moves go wrong by accident): one mistake sets strict retaliators feuding, and **win-stay, lose-shift**, which repairs a mistake within two rounds, usually rises to the top. Press **Play again** to see how much luck matters. At 10 % noise, trust is so hard to keep that always defect and grim trigger lead.
- **Evolution**: each generation, strategies grow in proportion to their score. Start with **mostly unconditional cooperators** and 2 % noise: always defect feeds on them and swells, then starves once they are gone, and retaliating cooperators inherit the population.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      let seed = 7;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Round-robin tournament', 'tour'], ['Evolution of a population', 'evo']], value: 'tour' },
        { id: 'start', type: 'select', label: 'Starting population', options: [['Equal shares', 'eq'], ['Mostly unconditional cooperators', 'naive']], value: 'eq' },
        { id: 'n', label: 'Rounds in each game', min: 5, max: 300, step: 5, value: 150 },
        { id: 'noise', label: 'Noise (moves that go wrong)', min: 0, max: 10, step: 0.5, value: 0, unit: '%' },
        { id: 'T', label: 'Temptation to defect', min: 3.2, max: 5.9, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' points' },
        { type: 'buttons', items: [{ id: 'again', label: 'Play again', primary: true }, { id: 'evo', label: 'Run evolution' }] }
      ], id => {
        if (id === 'again') seed = (seed * 16807) % 2147483647 || 7;
        if (id === 'evo' || id === 'start') ctl.set('mode', 'evo');
        compute();
        if (V.mode === 'evo') loop.start(); else { loop.stop(); loop.once(); }
      });
      const ro = kit.readout(box.side, [['win', 'Top scorer'], ['tft', 'Tit for tat'], ['coop', 'Moves that were cooperation'], ['gen', 'Generation'], ['lead', 'Largest share']]);
      const V = ctl.values;
      const K = STRATS.length;
      let M = [], score = [], coop = 0, shares = [], hist = [], gen = 0, acc = 0;
      function compute() {
        const rnd = rng(seed), n = Math.round(V.n), eps = V.noise / 100, R = 3, P = 1, S = 0, T = V.T;
        const pay = (a, b) => a ? (b ? R : S) : (b ? T : P);
        M = []; for (let i = 0; i < K; i++) M.push(new Array(K).fill(0));
        let nc = 0, nm = 0;
        const REPS = 3;
        for (let rep = 0; rep < REPS; rep++) for (let i = 0; i < K; i++) for (let j = i; j < K; j++) {
          const hi = [], hj = [], si = {}, sj = {};
          let a1 = 0, a2 = 0;
          for (let k = 0; k < n; k++) {
            let x = STRATS[i].move(hi, hj, rnd, si), y = STRATS[j].move(hj, hi, rnd, sj);
            if (rnd() < eps) x = 1 - x;
            if (rnd() < eps) y = 1 - y;
            hi.push(x); hj.push(y);
            a1 += pay(x, y); a2 += pay(y, x); nc += x + y; nm += 2;
          }
          if (i === j) M[i][i] += (a1 + a2) / 2 / n / REPS;
          else { M[i][j] += a1 / n / REPS; M[j][i] += a2 / n / REPS; }
        }
        coop = nm ? nc / nm : 0;
        score = M.map(row => row.reduce((s, v) => s + v, 0) / K);
        shares = V.start === 'naive' ? [0.6].concat(new Array(K - 1).fill(0.4 / (K - 1))) : new Array(K).fill(1 / K);
        hist = [shares.slice()]; gen = 0; acc = 0;
      }
      function evolve() {
        const f = shares.map((x, i) => M[i].reduce((s, v, j) => s + v * shares[j], 0));
        const avg = shares.reduce((s, x, i) => s + x * f[i], 0);
        if (avg <= 0) return;
        shares = shares.map((x, i) => x * f[i] / avg);
        gen++; hist.push(shares.slice());
      }
      const GMAX = 120;
      function colorOf(C, i) { return i < 7 ? C.series[i] : C.muted; }
      function draw(dt) {
        if (V.mode === 'evo' && dt > 0 && gen < GMAX) { acc += dt; while (acc > 0.05 && gen < GMAX) { acc -= 0.05; evolve(); } }
        if (V.mode === 'evo' && gen >= GMAX && loop.running) loop.stop();
        const C = kit.colors(), c = st.begin();
        const order = score.map((s, i) => i).sort((a, b) => score[b] - score[a]);
        if (V.mode === 'tour') {
          const x0 = Math.min(170, st.W * 0.36), y0 = 30, w = st.W - x0 - 60, h = st.H - y0 - 40, bh = h / K;
          const g = { x0, y0, w, h, X: v => x0 + v / V.T * w };
          c.save(); c.strokeStyle = C.grid; c.fillStyle = C.muted; c.font = '11px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
          for (let v = 0; v <= V.T + 1e-9; v += 1) { const x = g.X(v); c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y0 + h); c.stroke(); c.fillText(String(v), x, y0 + h + 4); }
          c.restore();
          kit.label(c, 'average points per round', x0 + w, y0 + h + 26, { size: 11, color: C.muted, align: 'right' });
          for (const [lv, lab] of [[3, 'all cooperate'], [1, 'all defect']]) {
            const x = g.X(lv);
            c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x, y0 - 4); c.lineTo(x, y0 + h); c.stroke(); c.restore();
            kit.label(c, lab, x, y0 - 12, { size: 10.5, color: C.muted, align: 'center' });
          }
          order.forEach((i, k) => {
            const y = y0 + k * bh + bh * 0.15, hh = bh * 0.7;
            c.save(); c.globalAlpha = 0.8; c.fillStyle = colorOf(C, i); c.fillRect(x0, y, Math.max(0, g.X(score[i]) - x0), hh); c.restore();
            kit.label(c, STRATS[i].name, x0 - 8, y + hh / 2, { size: st.W < 520 ? 10.5 : 12, color: C.text, align: 'right', weight: i === 2 ? 700 : 500 });
            kit.label(c, score[i].toFixed(2), g.X(score[i]) + 6, y + hh / 2, { size: 11.5, color: C.text2 });
          });
        } else {
          const g = layout(st, { qmax: GMAX, pmax: 100, x0: 48, right: 150 });
          axes(kit, c, g, C, { xl: 'generation', yl: 'share of population', fmtP: p => Math.round(p) + ' %', fmtQ: q => String(Math.round(q)) });
          const ends = [];
          for (let i = 0; i < K; i++) {
            const pts = hist.map((s, k) => [k, s[i] * 100]);
            if (pts.length > 1) lineD(c, g, pts, colorOf(C, i), i === 2 ? 3 : 2);
            ends.push([i, shares[i] * 100]);
          }
          ends.sort((a, b) => b[1] - a[1]);
          let lastY = -1e9;
          ends.forEach(([i, v]) => {
            let y = g.Y(v);
            if (y < lastY + 13) y = lastY + 13;
            lastY = y;
            kit.label(c, STRATS[i].name + ' ' + v.toFixed(0) + ' %', g.x0 + g.w + 8, Math.min(y, st.H - 8), { size: 11, color: colorOf(C, i), weight: 600 });
          });
        }
        const rankT = order.indexOf(2) + 1;
        ro.set('win', STRATS[order[0]].name + ' (' + score[order[0]].toFixed(2) + ' a round)');
        ro.set('tft', 'place ' + rankT + ' of ' + K + ' (' + score[2].toFixed(2) + ')');
        ro.set('coop', kit.pct(coop, 0));
        ro.set('gen', V.mode === 'evo' ? gen + ' of ' + GMAX : '—');
        const lead = shares.reduce((b, x, i) => x > shares[b] ? i : b, 0);
        ro.set('lead', V.mode === 'evo' ? STRATS[lead].name + ' ' + kit.pct(shares[lead], 0) : '—');
      }
      compute();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ comparative advantage */
  const SCEN = {
    a: { A: [30, 10], B: [20, 4], spec: { ta: 70, tb: 0, x: 2, p: 4 } },
    b: { A: [30, 10], B: [15, 5], spec: { ta: 50, tb: 40, x: 1, p: 3 } },
    c: { A: [12, 8], B: [30, 5], spec: { ta: 100, tb: 0, x: 3, p: 3 } }
  };
  Hyper.sim('mic-trade', {
    title: 'Comparative advantage: two people, two goods',
    blurb: `Ana and Ben each have one working day and can bake bread or sew shirts. The line in each panel is what that person can make alone (the **production possibility frontier**); the square is what they make, the dot what they end up with after trading.

- In the first example Ana is better at **both** — yet a shirt costs her 3 loaves of bread given up, and Ben 5. Press **Specialise and trade**: Ben bakes only bread, Ana mostly sews, and they swap 2 shirts for 8 loaves. Both dots land **outside** their own frontiers.
- Move the **price of a shirt**: any price between 3 and 5 loaves helps both. Outside that range one of them would do better alone.
- Choose **equal opportunity costs**: now no trade can put both beyond their frontiers.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Example', options: [['Ana better at both', 'a'], ['Equal opportunity costs', 'b'], ['Each better at one good', 'c']], value: 'a' },
        { id: 'ta', label: 'Ana\'s day spent sewing', min: 0, max: 100, step: 5, value: 50, unit: '%' },
        { id: 'tb', label: 'Ben\'s day spent sewing', min: 0, max: 100, step: 5, value: 50, unit: '%' },
        { id: 'p', label: 'Price of a shirt, in loaves', min: 1, max: 8, step: 0.25, value: 4, fmt: v => v.toFixed(2).replace(/\.?0+$/, '') + ' loaves' },
        { id: 'x', label: 'Shirts Ana sells to Ben', min: -8, max: 8, step: 0.5, value: 0, fmt: v => (v > 0 ? '+' : '') + v },
        { type: 'buttons', items: [{ id: 'spec', label: 'Specialise and trade', primary: true }, { id: 'alone', label: 'Each alone' }] }
      ], id => {
        const s = SCEN[V.scen];
        if (id === 'spec') { ctl.set('ta', s.spec.ta); ctl.set('tb', s.spec.tb); ctl.set('x', s.spec.x); ctl.set('p', s.spec.p); }
        if (id === 'alone' || id === 'scen') { ctl.set('ta', 50); ctl.set('tb', 50); ctl.set('x', 0); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['oc', 'Cost of a shirt'], ['ana', 'Ana ends with'], ['ben', 'Ben ends with'], ['ga', 'Ana vs her frontier'], ['gb', 'Ben vs his frontier'], ['tot', 'Made in total']]);
      const V = ctl.values;
      function person(L, S, share) { return { Lmax: L, Smax: S, oc: L / S, s: share * S, l: (1 - share) * L }; }
      const fmtN = v => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(1)).replace('-', '−');
      const loaves = v => fmtN(v) + (Math.abs(v - 1) < 1e-9 ? ' loaf' : ' loaves');
      function draw() {
        const C = kit.colors(), c = st.begin(), sc = SCEN[V.scen];
        const a = person(sc.A[0], sc.A[1], V.ta / 100), b = person(sc.B[0], sc.B[1], V.tb / 100);
        const x = V.x, p = V.p;
        a.cs = a.s - x; a.cl = a.l + p * x; b.cs = b.s + x; b.cl = b.l - p * x;
        a.gain = a.cl + a.oc * a.cs - a.Lmax; b.gain = b.cl + b.oc * b.cs - b.Lmax;
        const half = st.W / 2;
        const panels = [[a, 'Ana', 0], [b, 'Ben', half]];
        for (const [q, name, off] of panels) {
          const g = layout(st, { x0: off + 44, w: half - 44 - 16, y0: 40, qmax: 12, pmax: 40 });
          axes(kit, c, g, C, { xl: 'shirts', yl: 'loaves', fmtP: v => String(Math.round(v)), fmtQ: v => String(Math.round(v)), nx: 4, ny: 4 });
          kit.label(c, name + ': ' + q.Lmax + ' loaves or ' + q.Smax + ' shirts' + (half > 300 ? ' a day' : ''), off + 10, 12, { size: half > 300 ? 12 : 10.5, color: C.text, weight: 600 });
          clip(c, g);
          fillD(c, g, [[0, 0], [0, q.Lmax], [q.Smax, 0]], C.accent, 0.12);
          lineD(c, g, [[0, q.Lmax], [q.Smax, 0]], C.accent, 2.4);
          // the trade line through the production point
          if (Math.abs(x) > 1e-9) lineD(c, g, [[q.s, q.l], [clamp(q.cs, -5, 20), q.cl]], C.faint, 1.5, [5, 4]);
          c.restore();
          c.save(); c.fillStyle = C.text; c.fillRect(g.X(q.s) - 5, g.Y(q.l) - 5, 10, 10); c.restore();
          const ok = q.cs >= -1e-9 && q.cl >= -1e-9;
          const col = !ok ? C.bad : q.gain > 1e-6 ? C.ok : q.gain < -1e-6 ? C.bad : C.warn;
          const cx = g.X(clamp(q.cs, 0, 12)), cy = g.Y(clamp(q.cl, 0, 40));
          if (Math.abs(x) > 1e-9) kit.arrow(c, g.X(q.s), g.Y(q.l), cx, cy, col, 1.8);
          kit.dot(c, cx, cy, 6.5, col, C.bg2);
          const msg = !ok ? 'cannot: not enough to give' : Math.abs(q.gain) < 1e-6 ? 'on the frontier' : (q.gain > 0 ? '+' : '−') + loaves(Math.abs(q.gain)) + ' ' + (q.gain > 0 ? 'beyond' : 'inside') + ' the frontier';
          tag(kit, c, g, msg, g.x0 + g.w * 0.3, g.y0 + 10, { size: 11.5, color: col, weight: 600 });
        }
        ro.set('oc', 'Ana ' + fmtN(a.oc) + ' loaves, Ben ' + fmtN(b.oc) + ' loaves');
        ro.set('ana', fmtN(a.cl) + ' loaves, ' + fmtN(a.cs) + ' shirts');
        ro.set('ben', fmtN(b.cl) + ' loaves, ' + fmtN(b.cs) + ' shirts');
        const gtxt = q => (q.cs < -1e-9 || q.cl < -1e-9) ? 'impossible trade' : Math.abs(q.gain) < 1e-6 ? 'exactly on it' : (q.gain > 0 ? '+' : '−') + loaves(Math.abs(q.gain)) + ' ' + (q.gain > 0 ? 'better' : 'worse') + ' than alone';
        ro.set('ga', gtxt(a)); ro.set('gb', gtxt(b));
        ro.set('tot', fmtN(a.l + b.l) + ' loaves, ' + fmtN(a.s + b.s) + ' shirts');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
