/* HYPER-CORE · schematic.js
 *
 * Circuit symbols and an oscilloscope screen for simulations, drawn on a canvas
 * 2-D context, so every electronics simulation looks the same. Available in a
 * simulation as kit.schem (also Hyper.schem).
 *
 *   const S = kit.schem;
 *   S.wire(ctx, [[x1, y1], [x2, y1], [x2, y2]]);
 *   S.resistor(ctx, x1, y1, x2, y2, { label: 'R1', value: '10 kΩ' });   // two-terminal parts go between two points
 *   S.capacitor / S.inductor / S.battery / S.vsource({ac}) / S.isource / S.diode({kind: 'led'|'zener'|'schottky'|'photo'})
 *   S.switch({closed}) / S.lamp({on}) / S.fuse / S.pot / S.meter(ctx, x, y, 'V', '5.00 V') / S.motor / S.speaker
 *   S.ground(ctx, x, y) / S.rail(ctx, x, y, '+12 V') / S.node(ctx, x, y)
 *   const q = S.npn(ctx, x, y, { pnp: false, size }) -> { b, c, e }   pins as [x, y]
 *   const m = S.nmos(ctx, x, y, { pmos: false })   -> { g, d, s }
 *   const a = S.opamp(ctx, x, y, { size, flip })   -> { inp, inn, out }   (+ input on top unless flip)
 *   const g = S.gate(ctx, 'nand', x, y, { size, inputs: 2 }) -> { in: [[x, y], ...], out }
 *   S.flow(ctx, pts, phase, { color })  moving dots along a wire: advance phase by current × dt
 *   S.scope(ctx, x, y, w, h, { traces: [{ pts: [[t, v], ...] | fn: t => v, vdiv, offset, color, label }], tdiv, t0 })
 *
 * Options common to parts: color (the part), label, value, width. Nothing here uses the DOM.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const DEF = { text: '#c3c8e0', muted: '#959cbd', accent: '#7b8cff', ok: '#22b37a', bad: '#e5484d', warn: '#e0a030', bg2: '#10142a', surface: '#151a31', dark: true };
  const C = () => (H.ui && H.ui.colors) ? H.ui.colors() : DEF;
  const FONT = '"Segoe UI", system-ui, sans-serif';

  function line(c, pts, color, w) {
    c.strokeStyle = color; c.lineWidth = w || 2; c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.stroke();
  }
  function text(c, s, x, y, o) {
    if (s == null || s === '') return;
    o = o || {};
    c.save();
    c.font = (o.weight || 600) + ' ' + (o.size || 12) + 'px ' + FONT;
    c.fillStyle = o.color || C().text;
    c.textAlign = o.align || 'center';
    c.textBaseline = o.baseline || 'middle';
    c.fillText(String(s), x, y);
    c.restore();
  }

  /* a two-terminal part: leads from each point to a body of length L centred between them,
     drawn by body(c, L, color) in local coordinates (x from −L/2 to L/2 along the part) */
  /* default half-height of a part, for placing its labels */
  const hh = (o, h) => Object.assign({ hh: h }, o || {});

  function two(c, x1, y1, x2, y2, o, L, body) {
    o = o || {};
    const col = o.color || C().text;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const a = Math.atan2(y2 - y1, x2 - x1);
    L = Math.min(L * (o.scale || 1), len);
    c.save();
    c.translate((x1 + x2) / 2, (y1 + y2) / 2);
    c.rotate(a);
    line(c, [[-len / 2, 0], [-L / 2, 0]], col, o.width);
    line(c, [[L / 2, 0], [len / 2, 0]], col, o.width);
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = o.width || 2; c.lineJoin = 'round'; c.lineCap = 'round';
    body(c, L, col);
    c.restore();
    // labels beside the body, kept upright
    const vertical = Math.abs(Math.sin(a)) > 0.7;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    // labels clear the body: its half-height (hh) plus a margin, unless labelOffset is given
    const vertical0 = Math.abs(Math.sin(Math.atan2(y2 - y1, x2 - x1))) > 0.7;
    const off = o.labelOffset || (vertical0 ? (o.hh || 8) + 10 : (o.hh || 8) + 16);
    if (vertical) {
      text(c, o.label, mx + off, my - (o.value ? 8 : 0), { align: 'left', color: o.labelColor });
      text(c, o.value, mx + off, my + (o.label ? 8 : 0), { align: 'left', weight: 500, color: o.labelColor || C().muted });
    } else {
      text(c, o.label, mx, my - off - (o.value ? 7 : 0), { color: o.labelColor });
      text(c, o.value, mx, my - off + (o.label ? 7 : 0), { weight: 500, color: o.labelColor || C().muted });
    }
  }

  const S = {
    line, text,
    wire(c, pts, o) { line(c, pts, (o && o.color) || C().text, (o && o.width) || 2); },
    node(c, x, y, o) { c.beginPath(); c.arc(x, y, (o && o.r) || 3.5, 0, 7); c.fillStyle = (o && o.color) || C().text; c.fill(); },
    resistor(c, x1, y1, x2, y2, o) {
      two(c, x1, y1, x2, y2, hh(o, 7), 40, (c, L) => {
        if (o && o.iec) { c.strokeRect(-L / 2, -7, L, 14); return; }
        const n = 6, h = 7;
        c.beginPath(); c.moveTo(-L / 2, 0);
        for (let k = 0; k < n; k++) c.lineTo(-L / 2 + (k + 0.5) * L / n, k % 2 ? h : -h);
        c.lineTo(L / 2, 0); c.stroke();
      });
    },
    pot(c, x1, y1, x2, y2, o) {
      S.resistor(c, x1, y1, x2, y2, o);
      // the wiper arrow, across the body
      const a = Math.atan2(y2 - y1, x2 - x1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const col = (o && o.color) || C().text;
      const nx = -Math.sin(a), ny = Math.cos(a);
      const t = o && o.wiper != null ? o.wiper - 0.5 : 0;
      const px = mx + Math.cos(a) * t * 36, py = my + Math.sin(a) * t * 36;
      line(c, [[px + nx * 22, py + ny * 22], [px + nx * 9, py + ny * 9]], col, 2);
      c.beginPath(); c.moveTo(px + nx * 8, py + ny * 8);
      c.lineTo(px + nx * 14 + Math.cos(a) * 4, py + ny * 14 + Math.sin(a) * 4);
      c.lineTo(px + nx * 14 - Math.cos(a) * 4, py + ny * 14 - Math.sin(a) * 4);
      c.closePath(); c.fillStyle = col; c.fill();
    },
    capacitor(c, x1, y1, x2, y2, o) {
      two(c, x1, y1, x2, y2, hh(o, 13), 12, (c, L) => {
        line(c, [[-L / 2, -13], [-L / 2, 13]], c.strokeStyle, 2.4);
        if (o && o.polarized) {
          c.beginPath(); c.arc(L / 2 + 9, 0, 14, Math.PI - 0.95, Math.PI + 0.95); c.stroke();
          text(c, '+', -L / 2 - 8, -12, { size: 11, color: c.strokeStyle });
        } else line(c, [[L / 2, -13], [L / 2, 13]], c.strokeStyle, 2.4);
      });
    },
    inductor(c, x1, y1, x2, y2, o) {
      two(c, x1, y1, x2, y2, hh(o, 9), 44, (c, L) => {
        const n = 4, r = L / n / 2;
        c.beginPath();
        for (let k = 0; k < n; k++) c.arc(-L / 2 + r + 2 * r * k, 0, r, Math.PI, 0);
        c.stroke();
        if (o && o.core) { line(c, [[-L / 2, -r - 4], [L / 2, -r - 4]], c.strokeStyle, 1.5); line(c, [[-L / 2, -r - 7], [L / 2, -r - 7]], c.strokeStyle, 1.5); }
      });
    },
    battery(c, x1, y1, x2, y2, o) {
      // + terminal at the first point
      two(c, x1, y1, x2, y2, hh(o, 15), 12, (c, L) => {
        line(c, [[-L / 2, -15], [-L / 2, 15]], c.strokeStyle, 2);
        line(c, [[L / 2, -8], [L / 2, 8]], c.strokeStyle, 4);
        text(c, '+', -L / 2 - 9, -14, { size: 12, color: c.strokeStyle });
      });
    },
    vsource(c, x1, y1, x2, y2, o) {
      // + at the first point; {ac: true} draws a sine instead of + and −
      two(c, x1, y1, x2, y2, hh(o, 17), 34, (c, L) => {
        c.beginPath(); c.arc(0, 0, L / 2, 0, 7); c.stroke();
        c.save(); c.rotate(-Math.atan2(y2 - y1, x2 - x1));
        if (o && o.ac) {
          c.beginPath();
          for (let k = 0; k <= 20; k++) { const u = -9 + 18 * k / 20; const v = -6 * Math.sin(u / 9 * Math.PI); k ? c.lineTo(u, v) : c.moveTo(u, v); }
          c.stroke();
        } else {
          const dx = (x1 - x2) / Math.hypot(x2 - x1, y2 - y1) * 8, dy = (y1 - y2) / Math.hypot(x2 - x1, y2 - y1) * 8;
          text(c, '+', dx, dy, { size: 13, color: c.strokeStyle });
          text(c, '−', -dx, -dy, { size: 13, color: c.strokeStyle });
        }
        c.restore();
      });
    },
    isource(c, x1, y1, x2, y2, o) {
      // arrow points from the first point to the second (the direction of the current)
      two(c, x1, y1, x2, y2, hh(o, 17), 34, (c, L) => {
        c.beginPath(); c.arc(0, 0, L / 2, 0, 7); c.stroke();
        line(c, [[-9, 0], [7, 0]], c.strokeStyle, 2);
        c.beginPath(); c.moveTo(10, 0); c.lineTo(3, -5); c.lineTo(3, 5); c.closePath(); c.fill();
      });
    },
    diode(c, x1, y1, x2, y2, o) {
      // anode at the first point
      o = o || {};
      two(c, x1, y1, x2, y2, hh(o, 12), 22, (c, L) => {
        c.beginPath(); c.moveTo(-L / 2, -10); c.lineTo(L / 2, 0); c.lineTo(-L / 2, 10); c.closePath();
        if (o.kind === 'led' && o.on) { c.save(); c.fillStyle = o.glow || '#ff5050'; c.fill(); c.restore(); c.stroke(); } else c.stroke();
        if (o.kind === 'zener') line(c, [[L / 2 + 4, -12], [L / 2, -10], [L / 2, 10], [L / 2 - 4, 12]], c.strokeStyle, 2);
        else if (o.kind === 'schottky') line(c, [[L / 2 + 4, -7], [L / 2 + 4, -10], [L / 2, -10], [L / 2, 10], [L / 2 - 4, 10], [L / 2 - 4, 7]], c.strokeStyle, 2);
        else line(c, [[L / 2, -10], [L / 2, 10]], c.strokeStyle, 2.2);
        if (o.kind === 'led' || o.kind === 'photo') {
          const out = o.kind === 'led';
          for (const dx of [-3, 5]) {
            const sx = dx, sy = -13, ex = dx + (out ? 7 : -7), ey = -22 * (out ? 1 : 1) + (out ? 0 : 0);
            const [ax, ay, bx, by] = out ? [sx, sy, sx + 7, sy - 9] : [sx + 7, sy - 9, sx, sy];
            line(c, [[ax, ay], [bx, by]], c.strokeStyle, 1.5);
            const a = Math.atan2(by - ay, bx - ax);
            c.beginPath(); c.moveTo(bx, by); c.lineTo(bx - 5 * Math.cos(a - 0.5), by - 5 * Math.sin(a - 0.5)); c.lineTo(bx - 5 * Math.cos(a + 0.5), by - 5 * Math.sin(a + 0.5)); c.closePath(); c.fill();
            void ex; void ey;
          }
        }
      });
    },
    switch(c, x1, y1, x2, y2, o) {
      o = o || {};
      two(c, x1, y1, x2, y2, hh(o, 12), 34, (c, L) => {
        S.node(c, -L / 2, 0, { r: 3, color: c.strokeStyle });
        S.node(c, L / 2, 0, { r: 3, color: c.strokeStyle });
        const ang = o.closed ? 0 : -0.5;
        line(c, [[-L / 2, 0], [-L / 2 + L * Math.cos(ang), L * Math.sin(ang)]], c.strokeStyle, 2.2);
      });
    },
    lamp(c, x1, y1, x2, y2, o) {
      o = o || {};
      two(c, x1, y1, x2, y2, hh(o, 14), 28, (c, L) => {
        if (o.on) { c.save(); c.globalAlpha = Math.min(1, o.brightness != null ? o.brightness : 1) * 0.8; c.fillStyle = o.glow || '#ffd84a'; c.beginPath(); c.arc(0, 0, L / 2 + 6, 0, 7); c.fill(); c.restore(); }
        c.beginPath(); c.arc(0, 0, L / 2, 0, 7); c.stroke();
        const r = L / 2 * 0.7;
        line(c, [[-r, -r], [r, r]], c.strokeStyle, 1.8); line(c, [[-r, r], [r, -r]], c.strokeStyle, 1.8);
      });
    },
    fuse(c, x1, y1, x2, y2, o) {
      two(c, x1, y1, x2, y2, hh(o, 6), 36, (c, L) => { c.strokeRect(-L / 2, -6, L, 12); line(c, [[-L / 2, 0], [L / 2, 0]], c.strokeStyle, 1.5); });
    },
    motor(c, x1, y1, x2, y2, o) {
      two(c, x1, y1, x2, y2, hh(o, 17), 34, (c, L) => { c.beginPath(); c.arc(0, 0, L / 2, 0, 7); c.stroke(); c.save(); c.rotate(-Math.atan2(y2 - y1, x2 - x1)); text(c, 'M', 0, 1, { size: 15, color: c.strokeStyle }); c.restore(); });
    },
    speaker(c, x1, y1, x2, y2, o) {
      two(c, x1, y1, x2, y2, hh(o, 16), 24, (c, L) => { c.strokeRect(-L / 2, -6, L, 12); c.beginPath(); c.moveTo(-L / 2, -6); c.lineTo(-L / 2 - 6, -16); c.lineTo(L / 2 + 6, -16); c.lineTo(L / 2, -6); c.stroke(); });
    },
    meter(c, x, y, letter, reading, o) {
      o = o || {};
      const col = o.color || C().text;
      c.beginPath(); c.arc(x, y, o.r || 16, 0, 7); c.fillStyle = C().surface; c.fill();
      c.strokeStyle = col; c.lineWidth = 2; c.stroke();
      text(c, letter, x, y + 1, { size: 14, weight: 700, color: col });
      if (reading != null) text(c, reading, x + (o.r || 16) + 6, y, { align: 'left', size: 12.5, color: o.readingColor || C().accent });
    },
    ground(c, x, y, o) {
      const col = (o && o.color) || C().text;
      line(c, [[x, y], [x, y + 8]], col, 2);
      line(c, [[x - 11, y + 8], [x + 11, y + 8]], col, 2);
      line(c, [[x - 7, y + 12], [x + 7, y + 12]], col, 2);
      line(c, [[x - 3, y + 16], [x + 3, y + 16]], col, 2);
    },
    rail(c, x, y, label, o) {
      const col = (o && o.color) || C().text;
      line(c, [[x, y], [x, y - 10]], col, 2);
      line(c, [[x - 10, y - 10], [x + 10, y - 10]], col, 2.4);
      text(c, label, x, y - 20, { size: 12, color: col });
    },

    /* transistors: (x, y) is the centre of the body circle; returns the pin positions */
    npn(c, x, y, o) {
      o = o || {};
      const s = o.size || 1, col = o.color || C().text, r = 20 * s;
      c.save();
      c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2;
      c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
      const bx = x - 8 * s;
      line(c, [[bx, y - 12 * s], [bx, y + 12 * s]], col, 3);
      line(c, [[x - r - 12 * s, y], [bx, y]], col, 2);                         // base lead
      line(c, [[bx, y - 5 * s], [x + 8 * s, y - 14 * s], [x + 8 * s, y - r - 10 * s]], col, 2);   // collector
      line(c, [[bx, y + 5 * s], [x + 8 * s, y + 14 * s], [x + 8 * s, y + r + 10 * s]], col, 2);   // emitter
      // the arrow on the emitter: out for NPN, in for PNP
      const [ax, ay, tx, ty] = o.pnp ? [x + 6 * s, y + 13 * s, bx + 2 * s, y + 6.5 * s] : [bx + 3 * s, y + 7 * s, x + 7 * s, y + 13.5 * s];
      const a = Math.atan2(ty - ay, tx - ax);
      c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx - 7 * s * Math.cos(a - 0.45), ty - 7 * s * Math.sin(a - 0.45)); c.lineTo(tx - 7 * s * Math.cos(a + 0.45), ty - 7 * s * Math.sin(a + 0.45)); c.closePath(); c.fill();
      c.restore();
      if (o.labels !== false) { text(c, 'B', x - r - 6 * s, y - 9 * s, { size: 10, color: C().muted }); text(c, 'C', x + 16 * s, y - r - 4 * s, { size: 10, color: C().muted }); text(c, 'E', x + 16 * s, y + r + 4 * s, { size: 10, color: C().muted }); }
      text(c, o.label, x + r + 10 * s, y, { align: 'left', color: o.labelColor });
      const pins = { b: [x - r - 12 * s, y], c: [x + 8 * s, y - r - 10 * s], e: [x + 8 * s, y + r + 10 * s] };
      if (o.pnp) { const t = pins.c; pins.c = pins.e; pins.e = t; }        // PNP: emitter at the top
      return pins;
    },
    pnp(c, x, y, o) { return S.npn(c, x, y, Object.assign({}, o, { pnp: true })); },
    nmos(c, x, y, o) {
      o = o || {};
      const s = o.size || 1, col = o.color || C().text, r = 20 * s;
      c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2;
      c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
      const gx = x - 9 * s, cx = x - 4 * s;
      line(c, [[x - r - 12 * s, y + 8 * s], [gx, y + 8 * s], [gx, y - 10 * s]], col, 2);                 // gate
      for (const dy of [-11, 0, 11]) line(c, [[cx, y + (dy - 4) * s], [cx, y + (dy + 4) * s]], col, 3); // channel (enhancement: broken)
      line(c, [[cx, y - 11 * s], [x + 8 * s, y - 11 * s], [x + 8 * s, y - r - 10 * s]], col, 2);        // drain
      line(c, [[cx, y + 11 * s], [x + 8 * s, y + 11 * s], [x + 8 * s, y + r + 10 * s]], col, 2);        // source
      line(c, [[cx, y], [x + 8 * s, y], [x + 8 * s, y + 11 * s]], col, 2);                                // body to source
      const dir = o.pmos ? -1 : 1;
      c.beginPath(); c.moveTo(cx + (o.pmos ? 9 : 2) * s, y); c.lineTo(cx + (o.pmos ? 9 : 2) * s + dir * 6 * s, y - 4 * s); c.lineTo(cx + (o.pmos ? 9 : 2) * s + dir * 6 * s, y + 4 * s); c.closePath(); c.fill();
      c.restore();
      if (o.labels !== false) { text(c, 'G', x - r - 6 * s, y, { size: 10, color: C().muted }); text(c, o.pmos ? 'S' : 'D', x + 16 * s, y - r - 4 * s, { size: 10, color: C().muted }); text(c, o.pmos ? 'D' : 'S', x + 16 * s, y + r + 4 * s, { size: 10, color: C().muted }); }
      text(c, o.label, x + r + 10 * s, y, { align: 'left', color: o.labelColor });
      const pins = { g: [x - r - 12 * s, y + 8 * s], d: [x + 8 * s, y - r - 10 * s], s: [x + 8 * s, y + r + 10 * s] };
      if (o.pmos) { const t = pins.d; pins.d = pins.s; pins.s = t; }
      return pins;
    },
    pmos(c, x, y, o) { return S.nmos(c, x, y, Object.assign({}, o, { pmos: true })); },
    /* op-amp triangle pointing right; (x, y) is its centre */
    opamp(c, x, y, o) {
      o = o || {};
      const s = o.size || 1, col = o.color || C().text, w = 60 * s, h = 60 * s;
      c.save(); c.strokeStyle = col; c.lineWidth = 2;
      c.beginPath(); c.moveTo(x - w / 2, y - h / 2); c.lineTo(x + w / 2, y); c.lineTo(x - w / 2, y + h / 2); c.closePath();
      c.fillStyle = C().surface; c.fill(); c.stroke();
      c.restore();
      const top = o.flip ? '+' : '−', bottom = o.flip ? '−' : '+';
      text(c, top, x - w / 2 + 10 * s, y - 15 * s, { size: 15, color: col });
      text(c, bottom, x - w / 2 + 10 * s, y + 15 * s, { size: 15, color: col });
      line(c, [[x - w / 2 - 14 * s, y - 15 * s], [x - w / 2, y - 15 * s]], col, 2);
      line(c, [[x - w / 2 - 14 * s, y + 15 * s], [x - w / 2, y + 15 * s]], col, 2);
      line(c, [[x + w / 2, y], [x + w / 2 + 14 * s, y]], col, 2);
      text(c, o.label, x - 4 * s, y, { size: 11, color: C().muted });
      const a = [x - w / 2 - 14 * s, y - 15 * s], b = [x - w / 2 - 14 * s, y + 15 * s];
      return { inn: o.flip ? b : a, inp: o.flip ? a : b, out: [x + w / 2 + 14 * s, y] };
    },
    /* logic gates, pointing right; kinds: and, or, not, nand, nor, xor, xnor, buf */
    gate(c, kind, x, y, o) {
      o = o || {};
      const s = o.size || 1, col = o.color || C().text, w = 40 * s, h = 34 * s, n = kind === 'not' || kind === 'buf' ? 1 : (o.inputs || 2);
      const inv = kind === 'not' || kind === 'nand' || kind === 'nor' || kind === 'xnor';
      const base = kind.replace(/^n(?=and|or)/, '').replace('xnor', 'xor').replace('not', 'buf');
      c.save(); c.strokeStyle = col; c.lineWidth = 2; c.fillStyle = o.fill || C().surface;
      c.beginPath();
      const L = x - w / 2, R = x + w / 2;
      if (base === 'and') { c.moveTo(L, y - h / 2); c.lineTo(x, y - h / 2); c.arc(x, y, h / 2, -Math.PI / 2, Math.PI / 2); c.lineTo(L, y + h / 2); c.closePath(); }
      else if (base === 'buf') { c.moveTo(L, y - h / 2); c.lineTo(R - 6 * s, y); c.lineTo(L, y + h / 2); c.closePath(); }
      else { c.moveTo(L, y - h / 2); c.quadraticCurveTo(x + w * 0.1, y - h / 2, R, y); c.quadraticCurveTo(x + w * 0.1, y + h / 2, L, y + h / 2); c.quadraticCurveTo(L + 10 * s, y, L, y - h / 2); c.closePath(); }
      c.fill(); c.stroke();
      if (base === 'xor') { c.beginPath(); c.moveTo(L - 6 * s, y - h / 2); c.quadraticCurveTo(L + 4 * s, y, L - 6 * s, y + h / 2); c.stroke(); }
      const tip = base === 'buf' ? R - 6 * s : R;
      if (inv) { c.beginPath(); c.arc(tip + 4 * s, y, 4 * s, 0, 7); c.fillStyle = C().surface; c.fill(); c.stroke(); }
      c.restore();
      const out = [tip + (inv ? 8 : 0) * s + 12 * s, y];
      line(c, [[tip + (inv ? 8 : 0) * s, y], out], col, 2);
      const ins = [];
      for (let k = 0; k < n; k++) {
        const yy = n === 1 ? y : y - h / 2 + h * (k + 1) / (n + 1);
        const xin = L - 14 * s;
        ins.push([xin, yy]);
        line(c, [[xin, yy], [base === 'or' || base === 'xor' ? L + 4 * s : L, yy]], col, 2);
      }
      text(c, o.label, x, y + h / 2 + 12 * s, { size: 11, color: C().muted });
      return { in: ins, out };
    },
    /* logic level: a small lamp-like indicator */
    led(c, x, y, on, o) {
      o = o || {};
      c.beginPath(); c.arc(x, y, o.r || 7, 0, 7);
      c.fillStyle = on ? (o.color || C().ok) : C().surface; c.fill();
      c.strokeStyle = C().muted; c.lineWidth = 1.5; c.stroke();
    },

    /* moving dots along a path, spaced `gap` px, offset by phase (px). Advance phase by
       (current × some scale × dt) each frame; a negative current runs them backwards. */
    flow(c, pts, phase, o) {
      o = o || {};
      const gap = o.gap || 16, col = o.color || C().warn, r = o.r || 2.6;
      let total = 0;
      const segs = [];
      for (let k = 1; k < pts.length; k++) { const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); segs.push(l); total += l; }
      if (!total) return;
      let d = ((phase % gap) + gap) % gap;
      c.fillStyle = col;
      for (; d < total; d += gap) {
        let acc = 0, k = 0;
        while (k < segs.length && acc + segs[k] < d) { acc += segs[k]; k++; }
        if (k >= segs.length) break;
        const f = (d - acc) / (segs[k] || 1);
        const px = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, py = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f;
        c.beginPath(); c.arc(px, py, r, 0, 7); c.fill();
      }
    },

    /* an oscilloscope screen: 10 × 8 divisions, each trace with its own volts per division */
    scope(c, x, y, w, h, o) {
      o = o || {};
      const nx = o.divx || 10, ny = o.divy || 8, tdiv = o.tdiv || 1e-3, t0 = o.t0 || 0;
      const dx = w / nx, dy = h / ny;
      c.save();
      c.fillStyle = o.bg || '#0b1a14';
      c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, 6) : c.rect(x, y, w, h); c.fill();
      c.strokeStyle = 'rgba(120, 200, 150, 0.18)'; c.lineWidth = 1;
      c.beginPath();
      for (let k = 1; k < nx; k++) { c.moveTo(x + k * dx + 0.5, y); c.lineTo(x + k * dx + 0.5, y + h); }
      for (let k = 1; k < ny; k++) { c.moveTo(x, y + k * dy + 0.5); c.lineTo(x + w, y + k * dy + 0.5); }
      c.stroke();
      c.strokeStyle = 'rgba(120, 200, 150, 0.4)';
      c.beginPath(); c.moveTo(x, y + h / 2 + 0.5); c.lineTo(x + w, y + h / 2 + 0.5); c.moveTo(x + w / 2 + 0.5, y); c.lineTo(x + w / 2 + 0.5, y + h); c.stroke();
      for (let k = 0; k <= nx * 5; k++) { const px = x + k * dx / 5; c.beginPath(); c.moveTo(px, y + h / 2 - 3); c.lineTo(px, y + h / 2 + 3); c.stroke(); }
      c.beginPath(); c.rect(x, y, w, h); c.clip();
      const cols = ['#f4e04d', '#4dd6f4', '#f47ad6', '#7bf47a'];
      const labels = [];
      (o.traces || []).forEach((tr, i) => {
        const col = tr.color || cols[i % cols.length], vdiv = tr.vdiv || 1, off = tr.offset || 0;
        const Y = v => y + h / 2 - (v / vdiv + off) * dy;
        c.strokeStyle = col; c.lineWidth = tr.width || 2; c.shadowColor = col; c.shadowBlur = 4;
        c.beginPath();
        if (tr.fn) {
          const N = Math.max(200, Math.round(w));
          for (let k = 0; k <= N; k++) { const t = t0 + tdiv * nx * k / N; const v = tr.fn(t); const px = x + w * k / N, py = Y(v); k ? c.lineTo(px, py) : c.moveTo(px, py); }
        } else if (tr.pts) {
          let first = true;
          for (const p of tr.pts) {
            const px = x + (p[0] - t0) / (tdiv * nx) * w;
            if (!Number.isFinite(p[1])) { first = true; continue; }
            first ? c.moveTo(px, Y(p[1])) : c.lineTo(px, Y(p[1])); first = false;
          }
        }
        c.stroke(); c.shadowBlur = 0;
        labels.push([col, (tr.label || 'CH' + (i + 1)) + '  ' + fmtUnit(vdiv, tr.unit || 'V') + '/div']);
      });
      c.restore();
      // the scale, under the screen
      let lx = x + 4;
      labels.forEach(([col, s]) => { text(c, s, lx, y + h + 11, { align: 'left', size: 11, color: col }); lx += 12 + s.length * 6.4; });
      text(c, fmtUnit(tdiv, 's') + '/div', x + w - 4, y + h + 11, { align: 'right', size: 11, color: C().muted });
    }
  };

  /* 0.002 V -> "2 mV" */
  function fmtUnit(v, unit) {
    const a = Math.abs(v);
    const P = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
    for (const [f, p] of P) if (a >= f * 0.999) return Number((v / f).toPrecision(3)) + ' ' + p + unit;
    return v === 0 ? '0 ' + unit : Number((v / 1e-12).toPrecision(3)) + ' p' + unit;
  }
  S.fmt = fmtUnit;

  H.schem = S;
})(typeof window !== 'undefined' ? window : globalThis);
