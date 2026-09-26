/* HYPER-ELECTRONICS · sims/digital.js — simulations for the digital branch: a logic-gate
 * bench, a Karnaugh-map solver, the CMOS inverter solved by the circuit simulator, a
 * ripple-carry adder with its carry chain and a clock edge, latches, flip-flops, counters
 * and shift registers with a live timing diagram, a traffic-light state machine, sampling
 * and quantisation with a DAC, and UART / SPI / I²C on the wire. */
(function () {
  'use strict';

  /* ================================================================ shared helpers */
  const FONT = '"Segoe UI", system-ui, sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const bin = (v, n) => (v >>> 0).toString(2).padStart(n, '0').slice(-n);
  const hex = (v, n) => '0x' + (v >>> 0).toString(16).toUpperCase().padStart(n || 2, '0');
  const toSigned = (v, n) => ((v & (1 << (n - 1))) ? v - (1 << n) : v);
  const lvl = (C, v) => (v === 1 || v === true ? C.ok : C.muted);
  const RED = '#e5484d', AMBER = '#f0a020', GREEN = '#22b37a';

  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
  }

  /* clickable regions, rebuilt on every frame: hit(p) returns the id under the pointer */
  function makeHot() {
    const list = [];
    return {
      clear() { list.length = 0; },
      add(x, y, w, h, id) { list.push({ x, y, w, h, id }); },
      hit(p) {
        for (let k = list.length - 1; k >= 0; k--) {
          const r = list[k];
          if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) return r.id;
        }
        return null;
      }
    };
  }
  function clickable(kit, st, hot, fn) {
    kit.drag(st, { hit: p => hot.hit(p), start: id => fn(id), move() {}, end() {}, hover: true });
  }

  /* text with overbars: '~A' bars one character, '~{A·B}' a group (nesting allowed) */
  function parseBars(s) {
    let i = 0;
    const seq = inner => {
      const out = [];
      let txt = '';
      const flush = () => { if (txt) { out.push(txt); txt = ''; } };
      while (i < s.length) {
        const ch = s[i];
        if (inner && ch === '}') { i++; break; }
        if (ch === '~') {
          flush(); i++;
          if (s[i] === '{') { i++; out.push({ bar: seq(true) }); }
          else if (i < s.length) { out.push({ bar: [s[i]] }); i++; }
          continue;
        }
        txt += ch; i++;
      }
      flush();
      return out;
    };
    return seq(false);
  }
  const depthOf = nodes => nodes.reduce((d, n) => (typeof n === 'string' ? d : Math.max(d, 1 + depthOf(n.bar))), 0);
  const widthOf = (c, nodes) => nodes.reduce((w, n) => w + (typeof n === 'string' ? c.measureText(n).width : widthOf(c, n.bar)), 0);
  function drawNodes(c, nodes, x, y, size) {
    for (const n of nodes) {
      if (typeof n === 'string') { c.fillText(n, x, y); x += c.measureText(n).width; continue; }
      const x1 = x;
      x = drawNodes(c, n.bar, x, y, size);
      const yb = y - size * 0.64 - 3 * depthOf(n.bar);
      c.beginPath(); c.moveTo(x1 + 1, yb); c.lineTo(x - 1, yb); c.stroke();
    }
    return x;
  }
  function drawExpr(c, s, x, y, o) {
    o = o || {};
    const size = o.size || 13;
    c.save();
    c.font = (o.weight || 600) + ' ' + size + 'px ' + FONT;
    c.textAlign = 'left'; c.textBaseline = 'middle';
    c.fillStyle = o.color || '#888'; c.strokeStyle = o.color || '#888'; c.lineWidth = Math.max(1, size / 12);
    const nodes = parseBars(String(s));
    const w = widthOf(c, nodes);
    const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    drawNodes(c, nodes, x0, y, size);
    c.restore();
    return w;
  }
  function exprWidth(c, s, size) {
    c.save(); c.font = '600 ' + (size || 13) + 'px ' + FONT;
    const w = widthOf(c, parseBars(String(s)));
    c.restore();
    return w;
  }
  /* the same, as plain text for a read-out: ~A -> A′, ~{A·B} -> (A·B)′ */
  function plain(s) {
    const go = nodes => nodes.map(n => {
      if (typeof n === 'string') return n;
      const t = go(n.bar);
      return /^[A-Za-z][0-9]*$/.test(t) ? t + '′' : '(' + t + ')′';
    }).join('');
    return go(parseBars(String(s)));
  }

  /* a logic input you click: a small 0/1 box */
  function logicSwitch(c, kit, C, x, y, v, label, o) {
    o = o || {};
    const w = o.w || 24, h = o.h || 22;
    rrect(c, x - w / 2, y - h / 2, w, h, 5);
    c.fillStyle = v ? C.ok : C.surface; c.fill();
    c.strokeStyle = v ? C.ok : C.muted; c.lineWidth = 1.5; c.stroke();
    kit.label(c, v ? '1' : '0', x, y + 0.5, { align: 'center', size: 13, weight: 700, color: v ? C.bg2 : C.text });
    if (label) drawExpr(c, label, x + (o.ldx || 0), y + (o.ldy != null ? o.ldy : -h / 2 - 10), { align: o.lalign || 'center', size: 12.5, color: C.text });
    if (o.hot && o.id != null) {
      const k = o.k || 1, m = o.map || ((a, b) => [a, b]);
      const p = m(x - w / 2 - 3, y - h / 2 - 3);
      o.hot.add(p[0], p[1], (w + 6) * k, (h + 6) * k, o.id);
    }
  }

  /* A logic-analyser view. rows: [{ label, data: [...], bus, analog, vmax, th: [...], color, fmt }],
     each sample is one column. Bits: 0/1 (or 'z' for high impedance); bus: any value, drawn as a
     hexagon with the value; analog: a number from 0 to vmax. o: { labelW, marks: [i], vlines: [{i, label, color}] }.
     Returns the geometry so callers can annotate. */
  function timing(c, C, x, y, w, h, rows, n, o) {
    o = o || {};
    const lw = o.labelW != null ? o.labelW : 54, x0 = x + lw, ww = Math.max(20, w - lw);
    const rh = h / Math.max(1, rows.length), dx = ww / Math.max(1, n);
    c.save();
    c.fillStyle = C.surface;
    c.fillRect(x0, y, ww, h);
    if (o.marks && o.marks.length) {
      c.strokeStyle = C.border || C.faint; c.lineWidth = 1;
      c.beginPath();
      for (const i of o.marks) { const xx = Math.round(x0 + i * dx) + 0.5; c.moveTo(xx, y); c.lineTo(xx, y + h); }
      c.stroke();
    }
    rows.forEach((r, j) => {
      const top = y + j * rh, yHi = top + rh * 0.18, yLo = top + rh * 0.82, ym = (yHi + yLo) / 2;
      const col = r.color || C.accent, d = r.data;
      drawExpr(c, r.label, x + lw - 8, ym, { align: 'right', size: 12, color: r.labelColor || C.text });
      if (j) { c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, top + 0.5); c.lineTo(x0 + ww, top + 0.5); c.stroke(); }
      if (r.bus) {
        c.lineWidth = 1.6;
        let i = 0;
        while (i < n) {
          const v = d[i];
          let k = i;
          while (k + 1 < n && d[k + 1] === v) k++;
          if (v != null && v !== '') {
            const xa = x0 + i * dx, xb = x0 + (k + 1) * dx, sl = Math.min(4, (xb - xa) / 3);
            c.beginPath();
            c.moveTo(xa, ym); c.lineTo(xa + sl, yHi); c.lineTo(xb - sl, yHi); c.lineTo(xb, ym); c.lineTo(xb - sl, yLo); c.lineTo(xa + sl, yLo); c.closePath();
            c.fillStyle = col; c.globalAlpha = 0.14; c.fill(); c.globalAlpha = 1;
            c.strokeStyle = col; c.stroke();
            const s = r.fmt ? r.fmt(v) : String(v);
            c.font = '600 11.5px ' + FONT;
            if (c.measureText(s).width + 6 < xb - xa) { c.fillStyle = C.text; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, (xa + xb) / 2, ym + 0.5); }
          }
          i = k + 1;
        }
      } else if (r.analog) {
        const vmax = r.vmax || 1, Y = v => yLo - (yLo - yHi) * clamp(v / vmax, -0.08, 1.08);
        c.setLineDash([3, 4]); c.lineWidth = 1; c.strokeStyle = C.faint;
        for (const t of (r.th || [])) { c.beginPath(); c.moveTo(x0, Y(t)); c.lineTo(x0 + ww, Y(t)); c.stroke(); }
        c.setLineDash([]);
        c.strokeStyle = col; c.lineWidth = 1.8; c.lineJoin = 'round';
        c.beginPath();
        let first = true;
        for (let i = 0; i < n; i++) {
          const v = d[i];
          if (v == null || !Number.isFinite(v)) { first = true; continue; }
          const xx = x0 + (i + 0.5) * dx, yy = Y(v);
          if (first) c.moveTo(xx, yy); else c.lineTo(xx, yy);
          first = false;
        }
        c.stroke();
      } else {
        c.fillStyle = col; c.globalAlpha = 0.13;
        for (let i = 0; i < n; i++) if (d[i] === 1 || d[i] === true) c.fillRect(x0 + i * dx, yHi, dx + 0.6, yLo - yHi);
        c.globalAlpha = 1;
        c.strokeStyle = col; c.lineWidth = 2; c.lineJoin = 'round';
        c.beginPath();
        let py = null;
        for (let i = 0; i < n; i++) {
          const v = d[i];
          if (v == null) { if (py != null) { c.stroke(); c.beginPath(); } py = null; continue; }
          const yy = v === 'z' ? ym : (v ? yHi : yLo), xa = x0 + i * dx;
          if (py == null) c.moveTo(xa, yy); else if (py !== yy) c.lineTo(xa, yy);
          c.lineTo(xa + dx, yy);
          py = yy;
        }
        c.stroke();
      }
    });
    for (const m of (o.vlines || [])) {
      const xx = x0 + m.i * dx;
      c.strokeStyle = m.color || C.warn; c.lineWidth = 1.5; c.setLineDash([5, 4]);
      c.beginPath(); c.moveTo(xx, y - 3); c.lineTo(xx, y + h); c.stroke(); c.setLineDash([]);
      if (m.label) { c.font = '600 11px ' + FONT; c.fillStyle = m.color || C.warn; c.textAlign = m.align || 'center'; c.textBaseline = 'bottom'; c.fillText(m.label, xx, y - 4); }
    }
    c.restore();
    return { x0, dx, rh, ww };
  }

  /* a flip-flop or latch drawn as a box. left/right: [{ name, v, clock, bubble, f }] where f is the
     pin's height as a fraction of the box (default: spread evenly). Returns the outer pin ends. */
  function ffBox(c, kit, C, x, y, w, h, left, right, title) {
    const S = kit.schem;
    rrect(c, x - w / 2, y - h / 2, w, h, 6);
    c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
    const xa = x - w / 2, xb = x + w / 2, pins = { in: [], out: [] };
    left.forEach((p, i) => {
      const yy = y - h / 2 + h * (p.f != null ? p.f : (i + 1) / (left.length + 1));
      S.wire(c, [[xa - 16, yy], [xa - (p.bubble ? 8 : 0), yy]], { color: lvl(C, p.v), width: p.v ? 2.6 : 2 });
      if (p.bubble) { c.beginPath(); c.arc(xa - 4, yy, 4, 0, 7); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke(); }
      if (p.clock) { c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xa, yy - 6); c.lineTo(xa + 8, yy); c.lineTo(xa, yy + 6); c.stroke(); }
      drawExpr(c, p.name, xa + (p.clock ? 11 : 6), yy, { size: 11.5, color: C.text });
      pins.in.push([xa - 16, yy]);
    });
    right.forEach((p, i) => {
      const yy = y - h / 2 + h * (p.f != null ? p.f : (i + 1) / (right.length + 1));
      S.wire(c, [[xb, yy], [xb + 16, yy]], { color: lvl(C, p.v), width: p.v ? 2.6 : 2 });
      drawExpr(c, p.name, xb - 6, yy, { size: 11.5, color: C.text, align: 'right' });
      pins.out.push([xb + 16, yy]);
    });
    if (title) kit.label(c, title, x, y + h / 2 + 11, { align: 'center', size: 11, color: C.muted });
    return pins;
  }
  /* a clock source: a box with a square wave, lit while the clock is high */
  function clockSource(c, kit, C, x, y, v) {
    rrect(c, x - 18, y - 12, 36, 24, 5);
    c.fillStyle = C.surface; c.fill(); c.strokeStyle = lvl(C, v); c.lineWidth = 2; c.stroke();
    c.beginPath(); c.moveTo(x - 12, y + 5); c.lineTo(x - 6, y + 5); c.lineTo(x - 6, y - 5); c.lineTo(x, y - 5); c.lineTo(x, y + 5); c.lineTo(x + 6, y + 5); c.lineTo(x + 6, y - 5); c.lineTo(x + 12, y - 5); c.stroke();
    kit.label(c, 'CLK', x, y - 21, { align: 'center', size: 11.5, weight: 600, color: C.text });
    return [x + 18, y];
  }
  function chipBox(c, kit, C, x, y, w, h, title, sub) {
    rrect(c, x - w / 2, y - h / 2, w, h, 7);
    c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
    kit.label(c, title, x, y - (sub ? 8 : 0), { align: 'center', size: 12.5, weight: 700, color: C.text });
    if (sub) kit.label(c, sub, x, y + 9, { align: 'center', size: 10.5, color: C.muted });
  }

  /* ================================================================ 1. logic gate bench */
  const GATE = {
    and: v => v.every(x => x), or: v => v.some(x => x), not: v => !v[0], buf: v => !!v[0],
    nand: v => !v.every(x => x), nor: v => !v.some(x => x),
    xor: v => v.reduce((a, x) => a ^ x, 0) === 1, xnor: v => v.reduce((a, x) => a ^ x, 0) === 0
  };
  const gateOut = (kind, v) => (GATE[kind](v) ? 1 : 0);

  function benchCircuit(id, kind, three) {
    if (id === 'demorgan') return {
      inputs: [['A', 40], ['B', 72]],
      gates: [
        { id: 'Y1', kind: 'nand', x: 280, y: 60, s: 1, ins: ['A', 'B'] },
        { id: 'Y2', kind: 'or', x: 280, y: 128, s: 1, ins: ['A', 'B'], neg: [1, 1] },
        { id: 'Y3', kind: 'nor', x: 280, y: 214, s: 1, ins: ['A', 'B'] },
        { id: 'Y4', kind: 'and', x: 280, y: 282, s: 1, ins: ['A', 'B'], neg: [1, 1] }
      ],
      outputs: [['Y1', '~{A·B}'], ['Y2', '~A+~B'], ['Y3', '~{A+B}'], ['Y4', '~A·~B']],
      note: 'Y1 = Y2 and Y3 = Y4 in every row: De Morgan\'s laws'
    };
    if (id === 'mux') return {
      inputs: [['A', 40], ['B', 72], ['S', 104]],
      gates: [
        { id: 'P', kind: 'and', x: 250, y: 100, s: 1.1, ins: ['A', 'S'], neg: [0, 1] },
        { id: 'Q', kind: 'and', x: 250, y: 240, s: 1.1, ins: ['B', 'S'] },
        { id: 'Y', kind: 'or', x: 372, y: 170, s: 1.1, ins: ['P', 'Q'] }
      ],
      outputs: [['Y', 'A·~S+B·S']],
      note: 'S = 0 passes A to Y; S = 1 passes B'
    };
    if (id === 'xor-nand') return {
      inputs: [['A', 40], ['B', 72]],
      gates: [
        { id: 'N1', kind: 'nand', x: 175, y: 170, s: 1, ins: ['A', 'B'], label: 'N1' },
        { id: 'N2', kind: 'nand', x: 292, y: 100, s: 1, ins: ['A', 'N1'], label: 'N2' },
        { id: 'N3', kind: 'nand', x: 292, y: 240, s: 1, ins: ['N1', 'B'], label: 'N3' },
        { id: 'Y', kind: 'nand', x: 398, y: 170, s: 1, ins: ['N2', 'N3'] }
      ],
      outputs: [['Y', 'A⊕B']],
      note: 'NAND is universal: four of them make an exclusive-OR'
    };
    if (id === 'decoder') return {
      inputs: [['EN', 40], ['A1', 72], ['A0', 104]],
      gates: [
        { id: 'Y0', kind: 'and', x: 296, y: 62, s: 1, ins: ['EN', 'A1', 'A0'], neg: [0, 1, 1] },
        { id: 'Y1', kind: 'and', x: 296, y: 134, s: 1, ins: ['EN', 'A1', 'A0'], neg: [0, 1, 0] },
        { id: 'Y2', kind: 'and', x: 296, y: 206, s: 1, ins: ['EN', 'A1', 'A0'], neg: [0, 0, 1] },
        { id: 'Y3', kind: 'and', x: 296, y: 278, s: 1, ins: ['EN', 'A1', 'A0'] }
      ],
      outputs: [['Y0', 'EN·~{A1}·~{A0}'], ['Y1', 'EN·~{A1}·A0'], ['Y2', 'EN·A1·~{A0}'], ['Y3', 'EN·A1·A0']],
      note: 'With EN = 1 exactly one output is high: the one numbered A1 A0'
    };
    const n = kind === 'not' || kind === 'buf' ? 1 : three ? 3 : 2;
    const names = ['A', 'B', 'C'].slice(0, n);
    const op = { and: '·', nand: '·', or: '+', nor: '+', xor: '⊕', xnor: '⊕' }[kind];
    let e = kind === 'not' ? '~A' : kind === 'buf' ? 'A' : names.join(op);
    if (kind === 'nand' || kind === 'nor' || kind === 'xnor') e = '~{' + e + '}';
    const notes = {
      and: 'The output is 1 only when every input is 1', or: 'The output is 1 when any input is 1',
      not: 'The output is the opposite of the input', buf: 'The output copies the input: a buffer adds drive, not logic',
      nand: 'The output is 0 only when every input is 1', nor: 'The output is 1 only when every input is 0',
      xor: n === 3 ? 'The output is 1 when an odd number of inputs are 1' : 'The output is 1 when the inputs differ',
      xnor: n === 3 ? 'The output is 1 when an even number of inputs are 1' : 'The output is 1 when the inputs are equal'
    };
    return {
      inputs: names.map((nm, i) => [nm, 40 + 32 * i]),
      gates: [{ id: 'Y', kind, x: 262, y: 176, s: 1.6, ins: names }],
      outputs: [['Y', e]],
      note: notes[kind]
    };
  }

  Hyper.sim('dig-gates', {
    title: 'Logic gate bench',
    blurb: `Click an input (the 0/1 boxes) or any row of the truth table. Wires carrying a 1 light up, and every combination you try is written into the table.

- **One gate:** fill in the whole table for NAND, then for NOR — every other function can be built from either one.
- **De Morgan pairs:** a NAND is an OR with inverted inputs (the bubbles), a NOR is an AND with inverted inputs. Compare the output columns.
- **Multiplexer:** S chooses which input reaches Y. **Decoder:** with EN = 1 exactly one output is high — the one whose number is on A1 A0.
- **XOR from four NANDs:** follow N1, N2 and N3 row by row to see how the exclusive-OR emerges.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const S = kit.schem;
      const hot = makeHot();
      const ctl = kit.controls(box.side, [
        { id: 'circuit', type: 'select', label: 'Circuit', options: [['One gate', 'gate'], ['De Morgan pairs', 'demorgan'], ['2-to-1 multiplexer', 'mux'], ['XOR from four NANDs', 'xor-nand'], ['2-to-4 decoder with enable', 'decoder']], value: params.circuit || 'gate' },
        { id: 'kind', type: 'select', label: 'Gate', options: [['AND', 'and'], ['OR', 'or'], ['NOT (inverter)', 'not'], ['NAND', 'nand'], ['NOR', 'nor'], ['XOR', 'xor'], ['XNOR', 'xnor'], ['Buffer', 'buf']], value: params.kind || 'nand' },
        { id: 'three', type: 'check', label: 'Three inputs', value: false },
        { id: 'auto', type: 'check', label: 'Count through the inputs', value: false },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the table' }] }
      ], id => {
        if (id === 'circuit' || id === 'kind' || id === 'three') setup();
        else if (id === 'clear') seen = {};
        update();
      });
      const ro = kit.readout(box.side, [['out', 'Output'], ['expr', 'Boolean expression'], ['rows', 'Rows tried']]);
      const V = ctl.values;
      let cir = null, sig = {}, ins = {}, seen = {}, tAuto = 0;

      function setup() {
        cir = benchCircuit(V.circuit, V.kind, V.three);
        const old = ins;
        ins = {};
        for (const [nm] of cir.inputs) ins[nm] = old[nm] != null ? old[nm] : (nm === 'EN' ? 1 : 0);
        seen = {};
        ctl.show('kind', V.circuit === 'gate');
        ctl.show('three', V.circuit === 'gate' && V.kind !== 'not' && V.kind !== 'buf');
      }
      const rowOf = () => cir.inputs.reduce((r, [nm]) => r * 2 + ins[nm], 0);
      function setRow(r) {
        const n = cir.inputs.length;
        cir.inputs.forEach(([nm], j) => { ins[nm] = (r >> (n - 1 - j)) & 1; });
      }
      function update() {
        sig = Object.assign({}, ins);
        for (const g of cir.gates) sig[g.id] = gateOut(g.kind, g.ins.map((s, k) => sig[s] ^ (g.neg && g.neg[k] ? 1 : 0)));
        seen[rowOf()] = cir.outputs.map(([id]) => sig[id]);
        const many = cir.outputs.length > 1;
        ro.set('out', cir.outputs.map(([id]) => (many ? id : 'Y') + ' = ' + sig[id]).join(', '));
        ro.set('expr', cir.outputs.map(([id, e]) => (many ? id : 'Y') + ' = ' + plain(e)).join(';  '));
        ro.set('rows', Object.keys(seen).length + ' of ' + (1 << cir.inputs.length));
      }
      clickable(kit, st, hot, id => {
        if (typeof id !== 'string') return;
        if (id.startsWith('in:')) { const nm = id.slice(3); ins[nm] = 1 - ins[nm]; }
        else if (id.startsWith('row:')) setRow(+id.slice(4));
        update();
      });

      function draw(dt) {
        if (V.auto) {
          tAuto += dt || 0;
          if (tAuto > 0.9) { tAuto = 0; setRow((rowOf() + 1) % (1 << cir.inputs.length)); update(); }
        }
        const C = kit.colors();
        const c = st.begin();
        hot.clear();
        const W = st.W, H = st.H, cw = W * 0.62;
        const k = Math.max(0.3, Math.min(cw / 480, H / 330));
        const ox = (cw - 480 * k) / 2, oy = (H - 322 * k) / 2;
        const map = (x, y) => [ox + x * k, oy + y * k];
        c.save(); c.translate(ox, oy); c.scale(k, k);
        // gates first, for their pin positions
        const pins = {}, uses = {};
        for (const g of cir.gates) {
          pins[g.id] = S.gate(c, g.kind, g.x, g.y, { size: g.s, inputs: g.ins.length, label: g.label, color: C.text });
          for (const s of g.ins) uses[s] = (uses[s] || 0) + 1;
        }
        const rails = {};
        for (const [nm, x] of cir.inputs) rails[nm] = x;
        const railEnd = {};
        for (const g of cir.gates) {
          g.ins.forEach((s, j) => {
            const p = pins[g.id].in[j], v = sig[s], col = lvl(C, v), w = v ? 2.6 : 2;
            if (rails[s] != null) {
              S.wire(c, [[rails[s], p[1]], p], { color: col, width: w });
              S.node(c, rails[s], p[1], { color: col });
              railEnd[s] = Math.max(railEnd[s] || 0, p[1]);
            } else {
              const o = pins[s].out, xm = (o[0] + p[0]) / 2;
              S.wire(c, [o, [xm, o[1]], [xm, p[1]], p], { color: col, width: w });
              if (uses[s] > 1) S.node(c, xm, o[1], { color: col });
            }
            if (g.neg && g.neg[j]) {
              c.beginPath(); c.arc(g.x - 20 * g.s - 5 * g.s, p[1], 4 * g.s, 0, 7);
              c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
            }
          });
        }
        // outputs
        const many = cir.outputs.length > 1;
        for (const [id, e] of cir.outputs) {
          const o = pins[id].out, v = sig[id];
          S.wire(c, [o, [o[0] + 12, o[1]]], { color: lvl(C, v), width: v ? 2.6 : 2 });
          S.led(c, o[0] + 20, o[1], v, { r: 8 });
          drawExpr(c, (many ? id : 'Y') + ' = ' + e, o[0] + 34, o[1], { size: 13, color: v ? C.ok : C.text });
        }
        // input rails and switches
        for (const [nm, x] of cir.inputs) {
          const v = ins[nm];
          S.wire(c, [[x, 44], [x, (railEnd[nm] || 60) + 2]], { color: lvl(C, v), width: v ? 2.6 : 2 });
          logicSwitch(c, kit, C, x, 32, v, nm, { hot, id: 'in:' + nm, map, k });
        }
        if (cir.note) kit.label(c, cir.note, 240, 316, { align: 'center', size: 12, color: C.muted });
        c.restore();

        // the truth table
        const tx = cw + 4, tw = W - cw - 10;
        const nIn = cir.inputs.length, nOut = cir.outputs.length, rows = 1 << nIn, cols = nIn + nOut;
        const colW = Math.min(34, (tw - 8) / cols), rowH = Math.min(24, (H - 56) / (rows + 1));
        const tabW = colW * cols, x0 = tx + (tw - tabW) / 2, y0 = Math.max(26, (H - rowH * (rows + 1)) / 2);
        kit.label(c, 'Truth table', x0 + tabW / 2, y0 - 12, { align: 'center', size: 12, color: C.muted });
        const heads = cir.inputs.map(i => i[0]).concat(cir.outputs.map(o => (many ? o[0] : 'Y')));
        heads.forEach((hd, j) => drawExpr(c, hd, x0 + (j + 0.5) * colW, y0 + rowH / 2, { align: 'center', size: 12, color: j < nIn ? C.text : C.accent }));
        c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x0 - 4, y0 + rowH); c.lineTo(x0 + tabW + 4, y0 + rowH);
        c.moveTo(x0 + nIn * colW, y0 + 2); c.lineTo(x0 + nIn * colW, y0 + rowH * (rows + 1)); c.stroke();
        const cur = rowOf();
        for (let r = 0; r < rows; r++) {
          const y = y0 + (r + 1) * rowH;
          if (r === cur) { c.fillStyle = C.accent; c.globalAlpha = 0.2; c.fillRect(x0 - 4, y, tabW + 8, rowH); c.globalAlpha = 1; }
          for (let j = 0; j < nIn; j++) kit.label(c, String((r >> (nIn - 1 - j)) & 1), x0 + (j + 0.5) * colW, y + rowH / 2, { align: 'center', size: 12.5, color: C.muted });
          const outs = seen[r];
          for (let j = 0; j < nOut; j++) kit.label(c, outs ? String(outs[j]) : '·', x0 + (nIn + j + 0.5) * colW, y + rowH / 2, { align: 'center', size: 12.5, weight: 700, color: outs ? (outs[j] ? C.ok : C.text) : C.faint });
          hot.add(x0 - 4, y, tabW + 8, rowH, 'row:' + r);
        }
      }
      setup(); update();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
    }
  });

  /* ================================================================ 2. Karnaugh-map solver */
  const popc = x => { let n = 0; while (x) { n += x & 1; x >>= 1; } return n; };
  const grayOf = b => (b === 1 ? [0, 1] : [0, 1, 3, 2]);
  const KM_EX = { 2: { on: [1, 2, 3], dc: [] }, 3: { on: [3, 5, 6, 7], dc: [] }, 4: { on: [0, 2, 6, 8], dc: [10, 11, 12, 13, 14, 15] } };

  /* minimal cover of the cells equal to target (1 for SOP, 0 for POS), with 2 = don't care */
  function kmapSolve(vals, n, target) {
    const N = 1 << n, full = N - 1;
    const ok = vals.map(v => v === target || v === 2);
    const on = [];
    vals.forEach((v, m) => { if (v === target) on.push(m); });
    const covers = (q, m) => (m & ~q.mask & full) === q.val;
    const lits = q => n - popc(q.mask);
    if (!on.length) return { cover: [], primes: [], essential: [], on, covers, lits };
    const valid = new Set(), cubes = [];
    for (let mask = 0; mask < N; mask++) for (let val = 0; val < N; val++) {
      if (val & mask) continue;
      let good = true;
      for (let m = 0; m < N && good; m++) if ((m & ~mask & full) === val && !ok[m]) good = false;
      if (good) { valid.add(mask * 64 + val); cubes.push({ mask, val }); }
    }
    const primes = cubes.filter(q => {
      for (let b = 0; b < n; b++) { const bit = 1 << b; if (!(q.mask & bit) && valid.has((q.mask | bit) * 64 + (q.val & ~bit))) return false; }
      return on.some(m => covers(q, m));
    });
    let best = null;
    const search = (unc, chosen, cost) => {
      if (!unc.length) {
        if (!best || chosen.length < best.list.length || (chosen.length === best.list.length && cost < best.cost)) best = { list: chosen.slice(), cost };
        return;
      }
      if (best && chosen.length + 1 > best.list.length) return;
      let opts = null;
      for (const m of unc) { const o = primes.filter(q => covers(q, m)); if (!opts || o.length < opts.length) opts = o; }
      opts.sort((a, b) => lits(a) - lits(b));
      for (const q of opts) { chosen.push(q); search(unc.filter(m => !covers(q, m)), chosen, cost + lits(q)); chosen.pop(); }
    };
    search(on, [], 0);
    const essential = primes.filter(q => on.some(m => covers(q, m) && primes.every(p => p === q || !covers(p, m))));
    return { cover: best ? best.list : [], primes, essential, on, covers, lits };
  }
  function termOf(q, n, pos) {
    const L = 'ABCD'.slice(0, n), parts = [];
    for (let i = 0; i < n; i++) {
      const bit = 1 << (n - 1 - i);
      if (q.mask & bit) continue;
      const one = !!(q.val & bit);
      parts.push((pos ? one : !one) ? '~' + L[i] : L[i]);
    }
    if (!parts.length) return pos ? '0' : '1';
    return pos ? (parts.length > 1 ? '(' + parts.join('+') + ')' : parts[0]) : parts.join('');
  }
  /* circular runs of occupied rows or columns: [start, end, openBefore, openAfter] */
  function runs(idx, len) {
    const s = [...new Set(idx)].sort((a, b) => a - b);
    if (s.length === len) return [[0, len - 1, false, false]];
    const out = [];
    let a = s[0], b = s[0];
    for (let i = 1; i < s.length; i++) { if (s[i] === b + 1) b = s[i]; else { out.push([a, b]); a = b = s[i]; } }
    out.push([a, b]);
    if (out.length === 2 && out[0][0] === 0 && out[1][1] === len - 1) return [[0, out[0][1], true, false], [out[1][0], len - 1, false, true]];
    return out.map(r => [r[0], r[1], false, false]);
  }

  Hyper.sim('dig-kmap', {
    title: 'Karnaugh map solver',
    blurb: `Click a cell to cycle it through 0 → 1 → X (don't care). The solver finds the fewest, largest groups and writes the minimal expression, each term in the colour of its group.

- Start from the example (segment *e* of a BCD seven-segment decoder): codes 10–15 never occur, so they are don't cares, and the four corners join into one group.
- Switch to **grouping the 0s** to get the same function as a product of sums.
- Make a checkerboard: no two 1s are neighbours, nothing can be grouped, and the result is an XOR — the worst case for a two-level circuit.
- Tick *every prime implicant* to see the groups the solver considered but did not need.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const hot = makeHot();
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'Variables', options: [['2: A, B', 2], ['3: A, B, C', 3], ['4: A, B, C, D', 4]], value: params.n || 4 },
        { id: 'form', type: 'select', label: 'Group', options: [['the 1s: sum of products', 'sop'], ['the 0s: product of sums', 'pos']], value: params.form || 'sop' },
        { id: 'primes', type: 'check', label: 'Show every prime implicant', value: false },
        { type: 'buttons', items: [{ id: 'example', label: 'Example' }, { id: 'random', label: 'Random' }, { id: 'clear', label: 'Clear' }] }
      ], id => {
        if (id === 'n' || id === 'example') load();
        else if (id === 'random') { for (let m = 0; m < vals.length; m++) { const r = Math.random(); vals[m] = r < 0.42 ? 1 : r < 0.52 ? 2 : 0; } }
        else if (id === 'clear') vals.fill(0);
        solve();
      });
      const ro = kit.readout(box.side, [['f', 'Minimal expression'], ['cost', 'Size'], ['pi', 'Prime implicants'], ['m', 'Minterms'], ['d', 'Don\'t cares']]);
      const V = ctl.values;
      let vals = [], sol = null;

      function load() {
        const n = V.n, ex = KM_EX[n];
        vals = new Array(1 << n).fill(0);
        ex.on.forEach(m => { vals[m] = 1; });
        ex.dc.forEach(m => { vals[m] = 2; });
      }
      function exprOf() {
        const pos = V.form === 'pos';
        if (!sol.cover.length) return pos ? '1' : '0';
        return sol.cover.map(q => termOf(q, V.n, pos)).join(pos ? '' : ' + ');
      }
      function solve() {
        const pos = V.form === 'pos';
        sol = kmapSolve(vals, V.n, pos ? 0 : 1);
        const e = exprOf(), L = sol.cover.reduce((s, q) => s + sol.lits(q), 0);
        ro.set('f', 'F = ' + plain(e));
        ro.set('cost', sol.cover.length + (sol.cover.length === 1 ? ' term, ' : ' terms, ') + L + (L === 1 ? ' literal' : ' literals'));
        ro.set('pi', sol.primes.length + ', of which ' + sol.essential.length + ' essential');
        const list = t => vals.map((v, m) => (v === t ? m : -1)).filter(m => m >= 0).join(', ') || '—';
        ro.set('m', 'Σm(' + list(1) + ')');
        ro.set('d', 'd(' + list(2) + ')');
      }
      clickable(kit, st, hot, id => {
        if (typeof id === 'string' && id.startsWith('cell:')) { const m = +id.slice(5); vals[m] = (vals[m] + 1) % 3; solve(); }
      });

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        hot.clear();
        const W = st.W, H = st.H, n = V.n, pos = V.form === 'pos';
        const rb = n === 4 ? 2 : 1, cb = n === 2 ? 1 : 2;
        const rg = grayOf(rb), cg = grayOf(cb), nr = rg.length, nc = cg.length;
        const rv = 'ABCD'.slice(0, rb), cv = 'ABCD'.slice(rb, n);
        const mx = 64, my = 64;
        const cs = Math.max(26, Math.min(66, (W * 0.56 - mx - 16) / nc, (H - my - 64) / nr));
        const gw = cs * nc, gh = cs * nr;
        const cellOf = m => [rg.indexOf(m >> cb), cg.indexOf(m & ((1 << cb) - 1))];
        // headers
        kit.label(c, rv, mx - 10, my - 12, { align: 'right', size: 13, weight: 700, color: C.accent });
        kit.label(c, cv, mx + gw / 2, my - 34, { align: 'center', size: 13, weight: 700, color: C.accent });
        cg.forEach((g, j) => kit.label(c, bin(g, cb), mx + (j + 0.5) * cs, my - 12, { align: 'center', size: 12, color: C.muted }));
        rg.forEach((g, i) => kit.label(c, bin(g, rb), mx - 10, my + (i + 0.5) * cs, { align: 'right', size: 12, color: C.muted }));
        // cells
        for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) {
          const m = (rg[i] << cb) | cg[j], v = vals[m], x = mx + j * cs, y = my + i * cs;
          c.fillStyle = C.surface; c.fillRect(x, y, cs, cs);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, cs, cs);
          const txt = v === 2 ? 'X' : String(v), tgt = pos ? 0 : 1;
          kit.label(c, txt, x + cs / 2, y + cs / 2 + 1, { align: 'center', size: Math.min(20, cs * 0.36), weight: 700, color: v === 2 ? C.warn : v === tgt ? C.text : C.faint });
          kit.label(c, String(m), x + 4, y + 9, { size: 9.5, color: C.faint });
          hot.add(x, y, cs, cs, 'cell:' + m);
        }
        // groups
        const drawGroup = (q, col, inset, dashed) => {
          const cells = [];
          for (let m = 0; m < vals.length; m++) if (sol.covers(q, m)) cells.push(cellOf(m));
          const rr = runs(cells.map(p => p[0]), nr), cc = runs(cells.map(p => p[1]), nc);
          c.save();
          c.beginPath(); c.rect(mx - 7, my - 7, gw + 14, gh + 14); c.clip();
          for (const R of rr) for (const K of cc) {
            let x1 = mx + K[0] * cs + inset, x2 = mx + (K[1] + 1) * cs - inset, y1 = my + R[0] * cs + inset, y2 = my + (R[1] + 1) * cs - inset;
            if (K[2]) x1 = mx - 12; if (K[3]) x2 = mx + gw + 12;
            if (R[2]) y1 = my - 12; if (R[3]) y2 = my + gh + 12;
            rrect(c, x1, y1, x2 - x1, y2 - y1, Math.min(14, cs / 3));
            if (!dashed) { c.fillStyle = col; c.globalAlpha = 0.13; c.fill(); c.globalAlpha = 1; }
            c.strokeStyle = col; c.lineWidth = dashed ? 1.5 : 2.6;
            if (dashed) c.setLineDash([4, 4]);
            c.stroke(); c.setLineDash([]);
          }
          c.restore();
        };
        if (V.primes) sol.primes.forEach((q, k) => { if (!sol.cover.includes(q)) drawGroup(q, C.faint, 3 + 3 * (k % 4), true); });
        sol.cover.forEach((q, k) => drawGroup(q, C.series[k % C.series.length], 4 + 4 * (k % 3), false));
        // the result on the right
        const px = mx + gw + 34, pw = W - px - 12;
        let y = my;
        kit.label(c, pos ? 'Minimal product of sums' : 'Minimal sum of products', px, y - 30, { size: 12, color: C.muted });
        let x = px + drawExpr(c, 'F = ', px, y, { size: 16, color: C.text });
        if (!sol.cover.length) drawExpr(c, pos ? '1' : '0', x, y, { size: 16, color: C.text });
        sol.cover.forEach((q, k) => {
          const t = termOf(q, n, pos), w = exprWidth(c, t, 16), sep = !pos && k ? ' + ' : '';
          const ws = sep ? exprWidth(c, sep, 16) : 0;
          if (x + ws + w > px + pw && x > px + 40) { x = px + 30; y += 28; }
          if (sep) x += drawExpr(c, sep, x, y, { size: 16, color: C.text });
          x += drawExpr(c, t, x, y, { size: 16, color: C.series[k % C.series.length] });
        });
        y += 34;
        sol.cover.forEach((q, k) => {
          if (y > H - 30) return;
          const col = C.series[k % C.series.length];
          c.fillStyle = col; c.fillRect(px, y - 6, 12, 12);
          const t = termOf(q, n, pos), cells = [];
          for (let m = 0; m < vals.length; m++) if (sol.covers(q, m)) cells.push(m);
          const w = drawExpr(c, t, px + 18, y, { size: 13, color: col });
          const ess = sol.essential.includes(q) ? ', essential' : '';
          kit.label(c, 'group of ' + cells.length + ess, px + 26 + w, y, { size: 11.5, color: C.muted });
          y += 22;
        });
        const L = sol.cover.reduce((s, q) => s + sol.lits(q), 0);
        kit.label(c, sol.cover.length + ' terms, ' + L + ' literals: a group of 2^k cells drops k variables', mx, my + gh + 26, { size: 12, color: C.muted });
      }
      load(); solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
    }
  });

  /* ================================================================ 3. CMOS inverter */
  Hyper.sim('dig-cmos', {
    title: 'CMOS inverter: transfer curve and supply current',
    blurb: `A PMOS and an NMOS transistor in series, solved by the circuit simulator at every input voltage. The blue curve is the output, the orange one the current drawn from the supply.

- At either end of the input range one transistor is fully off: the supply current is essentially zero. That is why a CMOS chip at rest draws only leakage.
- In between both conduct at once and a *shoot-through* current flows — an input left floating near the middle does exactly this, and can make the gate oscillate.
- Weaken the PMOS (k_p/k_n below 1) and the switching point moves down: that is how a 74HCT input is tuned to accept TTL levels.
- Lower the supply: the curve keeps its shape, scaled to the new rails, while the shoot-through current collapses — CMOS runs from a wide range of supplies (2–6 V for 74HC), only more slowly at the low end.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'vin', label: 'Input voltage', min: 0, max: 6, step: 0.02, value: params.vin != null ? params.vin : 0.4, unit: 'V' },
        { id: 'vdd', label: 'Supply V_DD', min: 1.8, max: 6, step: 0.1, value: 5, unit: 'V' },
        { id: 'vt', label: 'Threshold |V_T|', min: 0.3, max: 1.5, step: 0.05, value: 0.8, unit: 'V' },
        { id: 'ratio', label: 'PMOS strength k_p / k_n', min: 0.03, max: 5, value: 1, log: true, sig: 2 },
        { id: 'fam', type: 'select', label: 'Input levels shown', options: [['74HC: 30 % and 70 % of V_DD', 'hc'], ['74HCT: TTL levels, 0.8 V and 2.0 V', 'hct']], value: params.family || 'hc' }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['vout', 'Output voltage'], ['idd', 'Supply current'], ['p', 'Static power at this input'], ['vm', 'Switching point V_M'], ['vil', 'Unity-gain points V_IL / V_IH'], ['nm', 'Noise margins NM_L / NM_H']]);
      const V = ctl.values;
      const KN = 1e-3, NS = 240;
      let curve = [], icurve = [], imax = 1e-6, vm = 0, vil = NaN, vih = NaN, voh = 0, vol = 0, op = { vin: 0, vout: 0, idd: 0 }, phase = 0;
      const fixV = v => (Number.isFinite(v) ? (Math.abs(v) < 1e-4 ? 0 : v) : 0);
      const fixI = i => (Number.isFinite(i) ? Math.max(0, i) : 0);

      function rebuild() {
        const c = new kit.Circuit();
        const vdd = c.V('vdd', 'gnd', V.vdd);
        const vin = c.V('in', 'gnd', 0);
        c.PMOS('out', 'in', 'vdd', { vt: V.vt, k: KN * V.ratio, lambda: 0.02 });
        c.NMOS('out', 'in', 'gnd', { vt: V.vt, k: KN, lambda: 0.02 });
        curve = []; icurve = [];
        for (let k = 0; k <= NS; k++) {
          const x = V.vdd * k / NS;
          vin.v = x; c.dc();
          curve.push([x, clamp(fixV(c.v('out')), 0, V.vdd)]);
          icurve.push([x, fixI(vdd.i)]);
        }
        imax = Math.max(1e-6, ...icurve.map(p => p[1]));
        vm = V.vdd / 2;
        for (let k = 1; k < curve.length; k++) {
          const a = curve[k - 1], b = curve[k], da = a[1] - a[0], db = b[1] - b[0];
          if (da >= 0 && db < 0) { vm = a[0] + (b[0] - a[0]) * da / (da - db); break; }
        }
        vil = NaN; vih = NaN;
        for (let k = 1; k < curve.length; k++) {
          const s = (curve[k][1] - curve[k - 1][1]) / (curve[k][0] - curve[k - 1][0]);
          if (s < -1) { const xm = (curve[k][0] + curve[k - 1][0]) / 2; if (Number.isNaN(vil)) vil = xm; vih = xm; }
        }
        const at = x => curve[clamp(Math.round(x / V.vdd * NS), 0, NS)][1];
        voh = Number.isNaN(vil) ? V.vdd : at(vil);
        vol = Number.isNaN(vih) ? 0 : at(vih);
        const x = Math.min(V.vin, V.vdd);
        vin.v = x; c.dc();
        op = { vin: x, vout: clamp(fixV(c.v('out')), 0, V.vdd), idd: fixI(vdd.i) };
        ro.set('vout', kit.eng(op.vout, 'V') + (V.vin > V.vdd ? '  (input clamped to V_DD)' : ''));
        ro.set('idd', op.idd < 1e-9 ? 'below 1 nA (one transistor off)' : kit.eng(op.idd, 'A'));
        ro.set('p', op.idd < 1e-9 ? '≈ 0' : kit.eng(op.idd * V.vdd, 'W'));
        ro.set('vm', kit.eng(vm, 'V') + ' (' + Math.round(vm / V.vdd * 100) + ' % of V_DD)');
        ro.set('vil', Number.isNaN(vil) ? 'no gain above 1' : kit.eng(vil, 'V') + ' / ' + kit.eng(vih, 'V'));
        ro.set('nm', Number.isNaN(vil) ? '—' : kit.eng(Math.max(0, vil - vol), 'V') + ' / ' + kit.eng(Math.max(0, voh - vih), 'V'));
      }

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        // the inverter
        const sx = Math.max(96, W * 0.2), yP = H * 0.3, yN = H * 0.68;
        const onP = V.vdd - op.vin > V.vt, onN = op.vin > V.vt;
        const pP = S.pmos(c, sx, yP, { color: onP ? C.ok : C.faint, label: 'PMOS' });
        const pN = S.nmos(c, sx, yN, { color: onN ? C.ok : C.faint, label: 'NMOS' });
        const xc = pP.s[0], yTop = pP.s[1] - 12, yBot = pN.s[1] + 10;
        S.rail(c, xc, yTop, 'V_DD = ' + V.vdd.toFixed(1) + ' V');
        S.wire(c, [[xc, yTop], pP.s]);
        S.wire(c, [pN.s, [xc, yBot]]);
        S.ground(c, xc, yBot);
        const ymo = (pP.d[1] + pN.d[1]) / 2, vo = op.vout > V.vdd / 2 ? 1 : 0;
        S.wire(c, [pP.d, pN.d]);
        S.node(c, xc, ymo);
        S.wire(c, [[xc, ymo], [xc + 56, ymo]], { color: lvl(C, vo) });
        kit.label(c, 'out ' + kit.eng(op.vout, 'V'), xc + 60, ymo, { size: 12, color: C.accent });
        const xg = pP.g[0] - 16, yin = (pP.g[1] + pN.g[1]) / 2;
        S.wire(c, [pP.g, [xg, pP.g[1]], [xg, pN.g[1]], pN.g]);
        S.node(c, xg, yin);
        S.wire(c, [[xg, yin], [xg - 30, yin]]);
        kit.label(c, 'in ' + kit.eng(op.vin, 'V'), xg - 34, yin - 14, { align: 'right', size: 12, color: C.accent });
        if (op.idd > 1e-9) {
          phase += (dt || 0) * 30 * Math.log10(1 + op.idd / 1e-9);
          S.flow(c, [[xc, yTop], [xc, pP.s[1]], [xc, pN.s[1]], [xc, yBot]], phase, { color: C.warn });
        }
        kit.label(c, 'I_DD ' + (op.idd < 1e-9 ? '≈ 0' : kit.eng(op.idd, 'A')), xc + 14, yBot + 6, { size: 12, color: C.warn });
        // the graph
        const gx = Math.max(W * 0.44, sx + 150), gy = 26, gw = W - gx - 50, gh = H - gy - 46;
        if (gw < 60) return;
        const X = v => gx + gw * v / V.vdd, Y = v => gy + gh - gh * v / V.vdd, YI = i => gy + gh - gh * i / (imax * 1.15);
        const hct = V.fam === 'hct';
        const vils = hct ? 0.8 : 0.3 * V.vdd, vihs = hct ? Math.min(2.0, V.vdd) : 0.7 * V.vdd;
        c.fillStyle = C.ok; c.globalAlpha = 0.09; c.fillRect(X(0), gy, X(Math.min(vils, V.vdd)) - X(0), gh);
        c.fillStyle = C.accent; c.fillRect(X(vihs), gy, X(V.vdd) - X(vihs), gh); c.globalAlpha = 1;
        kit.label(c, 'reads 0', (X(0) + X(Math.min(vils, V.vdd))) / 2, gy + 10, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'reads 1', (X(vihs) + X(V.vdd)) / 2, gy + 10, { align: 'center', size: 11, color: C.muted });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(gx + 0.5, gy + 0.5, gw, gh);
        const step = V.vdd > 3.2 ? 1 : 0.5;
        for (let v = 0; v <= V.vdd + 1e-9; v += step) {
          kit.label(c, String(v), X(v), gy + gh + 11, { align: 'center', size: 10.5, color: C.muted });
          kit.label(c, String(v), gx - 5, Y(v), { align: 'right', size: 10.5, color: C.muted });
        }
        const istep = Hyper.niceStep(imax * 1.15, 4);
        for (let i = 0; i <= imax * 1.15 + 1e-15; i += istep) kit.label(c, kit.eng(i, 'A'), gx + gw + 5, YI(i), { size: 10, color: C.warn });
        kit.label(c, 'input voltage (V)', gx + gw / 2, gy + gh + 28, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'V_out', gx - 5, gy - 12, { align: 'right', size: 11.5, color: C.accent });
        kit.label(c, 'I_DD', gx + gw + 5, gy - 12, { size: 11.5, color: C.warn });
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(V.vdd), Y(V.vdd)); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath();
        icurve.forEach((p, k) => (k ? c.lineTo(X(p[0]), YI(p[1])) : c.moveTo(X(p[0]), YI(p[1])))); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath();
        curve.forEach((p, k) => (k ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1])))); c.stroke();
        kit.dot(c, X(vm), Y(vm), 4, C.text);
        kit.label(c, 'V_M', X(vm) + 7, Y(vm) - 9, { size: 11, color: C.text });
        if (!Number.isNaN(vil)) {
          for (const [v, t] of [[vil, 'V_IL'], [vih, 'V_IH']]) {
            c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(v), gy + gh); c.lineTo(X(v), gy + gh - 7); c.stroke();
            kit.label(c, t, X(v), gy + gh - 14, { align: 'center', size: 10.5, color: C.text });
          }
        }
        c.setLineDash([2, 3]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(X(op.vin), gy); c.lineTo(X(op.vin), gy + gh); c.stroke(); c.setLineDash([]);
        kit.dot(c, X(op.vin), Y(op.vout), 5.5, C.accent, C.bg2);
        kit.dot(c, X(op.vin), YI(op.idd), 5, C.warn, C.bg2);
      }
      rebuild();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
    }
  });

  /* ================================================================ 4. ripple-carry adder */
  function adderStep(g, A, B, sub, cin0) {
    const n = { bx: [], x1: [], a1: [], s: [], a2: [], co: [] };
    for (let i = 0; i < 4; i++) {
      const a = (A >> i) & 1, b = (B >> i) & 1, cin = i ? g.co[i - 1] : cin0;
      n.bx[i] = b ^ sub;               // the XOR that inverts B for a subtraction
      n.x1[i] = a ^ g.bx[i];
      n.a1[i] = a & g.bx[i];
      n.s[i] = g.x1[i] ^ cin;
      n.a2[i] = g.x1[i] & cin;
      n.co[i] = g.a1[i] | g.a2[i];
    }
    return n;
  }
  const adderZero = () => ({ bx: [0, 0, 0, 0], x1: [0, 0, 0, 0], a1: [0, 0, 0, 0], s: [0, 0, 0, 0], a2: [0, 0, 0, 0], co: [0, 0, 0, 0] });
  const sumOf = g => g.s[0] | (g.s[1] << 1) | (g.s[2] << 2) | (g.s[3] << 3);

  Hyper.sim('dig-adder', {
    title: 'A 4-bit ripple-carry adder, gate delay by gate delay',
    blurb: `Four full adders, each built from two XORs, two ANDs and an OR, every gate taking one delay τ. Click the bits of A, B and the carry-in; the change is replayed in slow motion and drawn on the timing diagram.

- The default 0111 + 0001 is the slow case: the carry has to ripple through every stage before S3 is right. Notice the wrong values the sum passes through on the way.
- Signed, 0111 + 0001 is 7 + 1 = −8: the result has overflowed. V = C4 ⊕ C3 flags it.
- Move the **clock edge** earlier than the settling time: the register captures a wrong sum. The critical path sets the fastest clock.
- In **A − B** mode each B bit goes through an XOR (inverting it) and the carry-in is 1: two's complement subtraction with the same adder.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380 });
      const S = kit.schem;
      const hot = makeHot();
      const TMAX = 18, PRE = 2;
      const ctl = kit.controls(box.side, [
        { id: 'op', type: 'select', label: 'Operation', options: [['A + B', 'add'], ['A − B (add the inverse of B, plus 1)', 'sub']], value: params.op || 'add' },
        { id: 'speed', label: 'Slow motion', min: 1, max: 12, step: 0.5, value: 3, unit: 'τ/s' },
        { id: 'tclk', label: 'Clock edge after', min: 2, max: 16, step: 1, value: params.tclk || 12, unit: 'τ' },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], id => { if (id === 'op') apply(); else if (id === 'replay') tA = 0; else if (id === 'tclk') report(); });
      const ro = kit.readout(box.side, [['a', 'A'], ['b', 'B'], ['s', 'Result'], ['flags', 'Carry / overflow'], ['settle', 'Settles after'], ['cap', 'Captured at the clock edge']]);
      const V = ctl.values;
      let A = params.a != null ? params.a : 7, B = params.b != null ? params.b : 1, cinT = 0;
      let last = { A: 0, B: 0, sub: 0, cin: 0 }, before = { A: 0, B: 0 }, hist = [], pre = null, tA = 0, ts = 0;

      const desc = v => bin(v, 4) + ' = ' + v + ' (signed ' + (toSigned(v, 4) > 0 ? '+' : '') + toSigned(v, 4) + ')';
      function settle(a, b, sub, cin) { let g = adderZero(); for (let k = 0; k < 30; k++) g = adderStep(g, a, b, sub, cin); return g; }
      /* the new inputs arrive at t = 0; the gates start from the state the old inputs had settled to */
      function apply() {
        const sub = V.op === 'sub' ? 1 : 0, cin = sub ? 1 : cinT;
        pre = settle(last.A, last.B, last.sub, last.cin);
        before = { A: last.A, B: last.B };
        hist = [pre];
        for (let t = 0; t < TMAX; t++) hist.push(adderStep(hist[t], A, B, sub, cin));
        const fin = hist[TMAX];
        const same = (g, h) => g.s.every((v, i) => v === h.s[i]) && g.co[3] === h.co[3];
        ts = TMAX;
        while (ts > 0 && same(hist[ts - 1], fin)) ts--;
        tA = 0;
        last = { A, B, sub, cin };
        report();
      }
      const capOk = () => { const g = hist[Math.min(TMAX, V.tclk)], f = hist[TMAX]; return sumOf(g) === sumOf(f) && g.co[3] === f.co[3]; };
      function report() {
        const sub = V.op === 'sub', fin = hist[TMAX], s = sumOf(fin), c4 = fin.co[3], v = fin.co[3] ^ fin.co[2];
        ro.set('a', desc(A));
        ro.set('b', desc(B));
        ro.set('s', desc(s) + (sub ? '' : ', or ' + (s + 16 * c4) + ' with the carry'));
        ro.set('flags', 'C4 = ' + c4 + ', V = ' + v + (v ? ' (signed overflow)' : ''));
        ro.set('settle', ts + ' τ (≈ ' + ts * 8 + ' ns at 8 ns per gate)');
        const cs = sumOf(hist[Math.min(TMAX, V.tclk)]);
        ro.set('cap', bin(cs, 4) + (capOk() ? '  ✓ correct' : '  ✗ wrong — not settled yet'));
      }
      clickable(kit, st, hot, id => {
        if (typeof id !== 'string') return;
        if (id.startsWith('a')) A ^= 1 << +id.slice(1);
        else if (id.startsWith('b')) B ^= 1 << +id.slice(1);
        else if (id === 'cin' && V.op === 'add') cinT ^= 1;
        apply();
      });

      function draw(dt) {
        tA = Math.min(TMAX, tA + (dt || 0) * V.speed);
        const C = kit.colors();
        const c = st.begin();
        hot.clear();
        const W = st.W, H = st.H, sub = V.op === 'sub' ? 1 : 0;
        const ti = Math.floor(tA), g = hist[ti], gp = hist[Math.max(0, ti - 1)];
        const topH = Math.max(160, H * 0.42), yb = topH * 0.5 + 8;
        const bw = clamp(W * 0.11, 58, 88), bh = 52;
        const xs = [0.8, 0.62, 0.44, 0.26].map(f => W * f);
        for (let i = 0; i < 4; i++) {
          const x = xs[i], a = (A >> i) & 1, b = (B >> i) & 1;
          // inputs
          const ya = yb - bh / 2 - 40;
          S.wire(c, [[x - 16, ya + 11], [x - 16, yb - bh / 2]], { color: lvl(C, a), width: a ? 2.6 : 2 });
          S.wire(c, [[x + 16, ya + 11], [x + 16, yb - bh / 2]], { color: lvl(C, g.bx[i]), width: g.bx[i] ? 2.6 : 2 });
          if (sub) { c.beginPath(); c.arc(x + 16, yb - bh / 2 - 12, 4, 0, 7); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke(); }
          logicSwitch(c, kit, C, x - 16, ya, a, 'A' + i, { hot, id: 'a' + i });
          logicSwitch(c, kit, C, x + 16, ya, b, 'B' + i, { hot, id: 'b' + i });
          // the box
          rrect(c, x - bw / 2, yb - bh / 2, bw, bh, 7);
          c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
          kit.label(c, 'FA', x, yb - 6, { align: 'center', size: 14, weight: 700, color: C.text });
          kit.label(c, 'bit ' + i, x, yb + 12, { align: 'center', size: 10.5, color: C.muted });
          // sum out
          const s = g.s[i], ch = s !== gp.s[i] && ti > 0;
          S.wire(c, [[x, yb + bh / 2], [x, yb + bh / 2 + 16]], { color: ch ? C.warn : lvl(C, s), width: s || ch ? 2.6 : 2 });
          S.led(c, x, yb + bh / 2 + 25, s, { r: 8 });
          kit.label(c, 'S' + i, x + 13, yb + bh / 2 + 25, { size: 12, weight: 600, color: C.text });
          // carry to the next stage
          const co = g.co[i], cch = co !== gp.co[i] && ti > 0;
          const xl = x - bw / 2, xr = i < 3 ? xs[i + 1] + bw / 2 : xl - 34;
          S.wire(c, [[xl, yb], [xr, yb]], { color: cch ? C.warn : lvl(C, co), width: co || cch ? 3 : 2 });
          kit.label(c, 'C' + (i + 1), (xl + xr) / 2, yb - 11, { align: 'center', size: 11.5, color: cch ? C.warn : C.muted });
        }
        // carry in, carry out, overflow
        const xr0 = xs[0] + bw / 2, cin = sub ? 1 : cinT;
        S.wire(c, [[xr0, yb], [xr0 + 26, yb]], { color: lvl(C, cin), width: cin ? 2.6 : 2 });
        logicSwitch(c, kit, C, xr0 + 40, yb, cin, sub ? 'Cin = 1' : 'Cin', { hot: sub ? null : hot, id: 'cin' });
        const xc4 = xs[3] - bw / 2 - 42;
        S.led(c, xc4, yb, g.co[3], { r: 8 });
        kit.label(c, 'C4', xc4, yb + 18, { align: 'center', size: 11.5, weight: 600, color: C.text });
        const vflag = g.co[3] ^ g.co[2];
        S.led(c, xc4, yb + 48, vflag, { r: 8, color: C.bad });
        kit.label(c, 'V', xc4, yb + 66, { align: 'center', size: 11.5, weight: 600, color: C.text });
        const sNow = sumOf(g);
        kit.label(c, (sub ? 'A − B:  ' : 'A + B:  ') + bin(A, 4) + (sub ? ' − ' : ' + ') + bin(B, 4) + '  →  S = ' + bin(sNow, 4) + (tA < ts ? '  (still settling)' : ''), 12, 14, { size: 12.5, weight: 600, color: tA < ts ? C.warn : C.text });
        kit.label(c, 't = ' + tA.toFixed(1) + ' τ', W - 12, 14, { align: 'right', size: 12, color: C.muted });
        // the timing diagram
        const n = TMAX + PRE, show = i => i - PRE <= tA;
        const col = (f, pick) => { const d = []; for (let i = 0; i < n; i++) { const t = i - PRE; d.push(!show(i) ? null : t < 0 ? pick(pre) : pick(hist[Math.min(TMAX, t)])); } return d; };
        const rows = [
          { label: 'A', bus: true, color: C.series[1], data: Array.from({ length: n }, (_, i) => (!show(i) ? null : i < PRE ? before.A : A)), fmt: v => bin(v, 4) },
          { label: 'B', bus: true, color: C.series[1], data: Array.from({ length: n }, (_, i) => (!show(i) ? null : i < PRE ? before.B : B)), fmt: v => bin(v, 4) }
        ];
        for (let i = 0; i < 4; i++) rows.push({ label: 'C' + (i + 1), color: C.warn, data: col(0, h => h.co[i]) });
        for (let i = 0; i < 4; i++) rows.push({ label: 'S' + i, color: C.accent, data: col(0, h => h.s[i]) });
        rows.push({ label: 'S', bus: true, color: C.ok, data: col(0, h => sumOf(h)), fmt: v => bin(v, 4) });
        const ty = topH + 26, th = H - ty - 26;
        const marks = [];
        for (let i = 0; i <= n; i++) marks.push(i);
        const geo = timing(c, C, 8, ty, W - 16, th, rows, n, {
          labelW: 40, marks,
          vlines: [{ i: PRE, label: 'inputs change', color: C.muted, align: 'left' }, { i: PRE + V.tclk, label: 'clock edge', color: capOk() ? C.ok : C.bad }]
        });
        kit.label(c, 'time in gate delays τ →   (the settled value is reached at ' + ts + ' τ)', geo.x0, ty + th + 14, { size: 11, color: C.muted });
      }
      last = { A: 0, B: 0, sub: V.op === 'sub' ? 1 : 0, cin: V.op === 'sub' ? 1 : 0 };
      apply();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
    }
  });

  /* ================================================================ 5. latches, flip-flops, counters, shift registers */
  Hyper.sim('dig-flipflops', {
    title: 'Latches, flip-flops, counters and shift registers',
    blurb: `Click the 0/1 inputs; the clock ticks on its own (or step it by hand) and the timing diagram scrolls like a logic analyser. The clock is slowed to about a hertz so you can watch — real parts run at many megahertz.

- **SR latch:** set, reset, then raise both S and R and release them together — the outputs race and settle at random. That is why S = R = 1 is forbidden.
- **D latch vs D flip-flop:** wiggle D while the clock is high. The latch lets it through; the flip-flop only takes the value present at the rising edge (see the master stage follow D while the clock is low).
- **JK:** J = K = 1 toggles on every edge, halving the frequency.
- **Counter:** tick *ripple* and watch the wrong intermediate values after each edge; set the modulus to 10 for a decade counter.
- **Shift register:** feed in a pattern one bit per clock and read it out in parallel.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 380 });
      const S = kit.schem;
      const hot = makeHot();
      const SUB = 32, WIN = 10 * SUB, DLY = 2;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Circuit', options: [['SR latch (two NOR gates)', 'sr'], ['D latch (transparent)', 'dlatch'], ['D flip-flop (master–slave)', 'dff'], ['JK flip-flop', 'jk'], ['4-bit counter', 'counter'], ['4-bit shift register', 'shift']], value: params.mode || 'dff' },
        { id: 'rate', label: 'Clock', min: 0.2, max: 3, step: 0.05, value: 0.8, unit: 'Hz' },
        { id: 'auto', type: 'check', label: 'Free-running clock', value: true },
        { id: 'ripple', type: 'check', label: 'Ripple counter (delays exaggerated)', value: !!params.ripple },
        { id: 'mod', label: 'Count modulo', min: 2, max: 16, step: 1, value: params.mod || 16 },
        { type: 'buttons', items: [{ id: 'pulse', label: 'Clock pulse', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], id => {
        if (id === 'mode') { reset(); showCtl(); }
        else if (id === 'clear') reset();
        else if (id === 'pulse') { if (V.auto) ctl.set('auto', false); pulse = SUB / 2; }
        else if (id === 'ripple') { events = []; }
      });
      const ro = kit.readout(box.side, [['q', 'Outputs'], ['next', 'What happens next']]);
      const V = ctl.values;
      let k = 0, acc = 0, pulse = 0, prevClk = 0, hist = [], events = [];
      let inp, q;

      function reset() {
        inp = { S: 0, R: 0, D: 1, J: 1, K: 1, EN: 1 };
        q = { Q: 0, Qb: 1, M: 0, bits: [0, 0, 0, 0], v: 0 };
        hist = []; events = []; k = 0; acc = 0; pulse = 0; prevClk = 0;
      }
      function showCtl() {
        const m = V.mode;
        ctl.show('rate', m !== 'sr'); ctl.show('auto', m !== 'sr'); ctl.show('pulse', m !== 'sr');
        ctl.show('ripple', m === 'counter'); ctl.show('mod', m === 'counter');
      }
      const valueOf = b => b[0] | (b[1] << 1) | (b[2] << 2) | (b[3] << 3);

      function tick() {
        const m = V.mode, M = Math.round(V.mod);
        let clk;
        if (m === 'sr') clk = 0;
        else if (V.auto) clk = (k % SUB) < SUB / 2 ? 1 : 0;
        else { clk = pulse > 0 ? 1 : 0; if (pulse > 0) pulse--; }
        const rise = clk === 1 && prevClk === 0;
        if (m === 'sr') {
          let nq = (inp.R || q.Qb) ? 0 : 1, nqb = (inp.S || q.Q) ? 0 : 1;
          // both outputs about to flip at once (S and R released together): real gates are never
          // perfectly matched, so after a few swings one of them wins, at random
          if (nq === nqb && nq !== q.Q && Math.random() < 0.3) { if (Math.random() < 0.5) nq = q.Q; else nqb = q.Qb; }
          q.Q = nq; q.Qb = nqb;
        } else if (m === 'dlatch') {
          if (clk) q.Q = inp.D;
          q.Qb = 1 - q.Q;
        } else if (m === 'dff') {
          const mNew = clk ? q.M : inp.D;       // master open while CLK = 0
          const sNew = clk ? q.M : q.Q;          // slave open while CLK = 1, fed by the master
          q.M = mNew; q.Q = sNew; q.Qb = 1 - sNew;
        } else if (m === 'jk') {
          if (rise) q.Q = (inp.J && !q.Q) || (!inp.K && q.Q) ? 1 : 0;
          q.Qb = 1 - q.Q;
        } else if (m === 'counter') {
          if (!V.ripple) {
            if (rise && inp.EN) q.v = q.v >= M - 1 ? 0 : q.v + 1;
            q.bits = [0, 1, 2, 3].map(b => (q.v >> b) & 1);
          } else {
            if (rise && inp.EN) events.push({ at: k + DLY, bit: 0 });
            const due = events.filter(e => e.at === k);
            events = events.filter(e => e.at !== k);
            for (const e of due) {
              if (e.clear) { q.bits = [0, 0, 0, 0]; continue; }
              const old = q.bits[e.bit];
              q.bits[e.bit] = 1 - old;
              if (old === 1 && e.bit < 3) events.push({ at: k + DLY, bit: e.bit + 1 });   // a falling output clocks the next stage
            }
            q.v = valueOf(q.bits);
            if (M < 16 && q.v === M && !events.some(e => e.clear)) events.push({ at: k + DLY, clear: true });   // decoded reset
          }
        } else if (m === 'shift') {
          if (rise) q.bits = [inp.D, q.bits[0], q.bits[1], q.bits[2]];
          q.v = valueOf(q.bits);
        }
        prevClk = clk;
        hist.push({ clk, S: inp.S, R: inp.R, D: inp.D, J: inp.J, K: inp.K, EN: inp.EN, Q: q.Q, Qb: q.Qb, M: q.M, b0: q.bits[0], b1: q.bits[1], b2: q.bits[2], b3: q.bits[3], v: q.v });
        if (hist.length > WIN) hist.shift();
        k++;
      }
      clickable(kit, st, hot, id => { if (typeof id === 'string' && id.startsWith('in:')) { const nm = id.slice(3); inp[nm] = 1 - inp[nm]; } });

      function rowsFor(C) {
        const col = key => hist.map(h => h[key]);
        const clkRow = { label: V.mode === 'dlatch' ? 'EN' : 'CLK', color: C.warn, data: col('clk') };
        const qRow = { label: 'Q', color: C.accent, data: col('Q') };
        switch (V.mode) {
          case 'sr': return [{ label: 'S', color: C.ok, data: col('S') }, { label: 'R', color: C.ok, data: col('R') }, qRow, { label: '~Q', color: C.series[3], data: col('Qb') }];
          case 'dlatch': return [clkRow, { label: 'D', color: C.ok, data: col('D') }, qRow];
          case 'dff': return [clkRow, { label: 'D', color: C.ok, data: col('D') }, { label: 'master', color: C.series[5], data: col('M') }, qRow];
          case 'jk': return [clkRow, { label: 'J', color: C.ok, data: col('J') }, { label: 'K', color: C.ok, data: col('K') }, qRow];
          case 'counter': return [clkRow, { label: 'EN', color: C.ok, data: col('EN') }].concat([0, 1, 2, 3].map(b => ({ label: 'Q' + b, color: C.accent, data: col('b' + b) })), [{ label: 'count', bus: true, color: C.series[1], data: col('v') }]);
          default: return [clkRow, { label: 'DIN', color: C.ok, data: col('D') }].concat([0, 1, 2, 3].map(b => ({ label: 'Q' + b, color: C.accent, data: col('b' + b) })), [{ label: 'Q3..Q0', bus: true, color: C.series[1], data: col('v'), fmt: v => bin(v, 4) }]);
        }
      }

      function drawTop(c, C, W, topH, clk) {
        const m = V.mode, cy = topH * 0.55;
        const sw = (x, y, nm, label) => logicSwitch(c, kit, C, x, y, inp[nm], label || nm, { hot, id: 'in:' + nm, ldx: -26, ldy: 0 });
        const out = (p, v, label) => { S.led(c, p[0] + 10, p[1], v, { r: 8 }); drawExpr(c, label, p[0] + 24, p[1], { size: 12.5, color: C.text }); };
        if (m === 'sr') {
          const gx = W * 0.46, y1 = topH * 0.33, y2 = topH * 0.75, s = 1.2;
          const g1 = S.gate(c, 'nor', gx, y1, { size: s, color: C.text }), g2 = S.gate(c, 'nor', gx, y2, { size: s, color: C.text });
          const xr = g1.out[0] + 14, xl = g1.in[0][0] - 14, ym = (y1 + y2) / 2;
          S.wire(c, [g1.out, [xr, y1], [xr, ym - 8], [xl, ym + 8], [xl, g2.in[0][1]], g2.in[0]], { color: lvl(C, q.Q), width: q.Q ? 2.6 : 2 });
          S.wire(c, [g2.out, [xr, y2], [xr, ym + 8], [xl, ym - 8], [xl, g1.in[1][1]], g1.in[1]], { color: lvl(C, q.Qb), width: q.Qb ? 2.6 : 2 });
          S.node(c, xr, y1, { color: lvl(C, q.Q) }); S.node(c, xr, y2, { color: lvl(C, q.Qb) });
          S.wire(c, [[xr, y1], [xr + 30, y1]], { color: lvl(C, q.Q) }); S.wire(c, [[xr, y2], [xr + 30, y2]], { color: lvl(C, q.Qb) });
          out([xr + 30, y1], q.Q, 'Q'); out([xr + 30, y2], q.Qb, '~Q');
          S.wire(c, [[g1.in[0][0] - 40, g1.in[0][1]], g1.in[0]], { color: lvl(C, inp.R) });
          S.wire(c, [[g2.in[1][0] - 40, g2.in[1][1]], g2.in[1]], { color: lvl(C, inp.S) });
          sw(g1.in[0][0] - 52, g1.in[0][1], 'R', 'R (reset)'); sw(g2.in[1][0] - 52, g2.in[1][1], 'S', 'S (set)');
          return;
        }
        const clkAt = (x, y) => clockSource(c, kit, C, x, y, clk);
        if (m === 'dlatch' || m === 'jk') {
          const bx = W * 0.5, bh = m === 'jk' ? 96 : 80;
          const left = m === 'jk'
            ? [{ name: 'J', v: inp.J }, { name: 'CLK', v: clk, clock: true }, { name: 'K', v: inp.K }]
            : [{ name: 'D', v: inp.D }, { name: 'EN', v: clk }];
          const p = ffBox(c, kit, C, bx, cy, 104, bh, left, [{ name: 'Q', v: q.Q }, { name: '~Q', v: q.Qb }], m === 'jk' ? 'JK flip-flop, rising edge' : 'D latch: Q follows D while EN = 1');
          const ck = p.in[1], cs = clkAt(ck[0] - 70, ck[1]);
          S.wire(c, [cs, ck], { color: lvl(C, clk), width: clk ? 2.6 : 2 });
          if (m === 'jk') {
            S.wire(c, [[p.in[0][0] - 36, p.in[0][1]], p.in[0]], { color: lvl(C, inp.J) }); sw(p.in[0][0] - 48, p.in[0][1], 'J');
            S.wire(c, [[p.in[2][0] - 36, p.in[2][1]], p.in[2]], { color: lvl(C, inp.K) }); sw(p.in[2][0] - 48, p.in[2][1], 'K');
          } else {
            S.wire(c, [[p.in[0][0] - 36, p.in[0][1]], p.in[0]], { color: lvl(C, inp.D) }); sw(p.in[0][0] - 48, p.in[0][1], 'D');
          }
          out(p.out[0], q.Q, 'Q'); out(p.out[1], q.Qb, '~Q');
          return;
        }
        if (m === 'dff') {
          const x1 = W * 0.36, x2 = W * 0.64, bh = 70, bw = Math.min(104, W * 0.17);
          const pm = ffBox(c, kit, C, x1, cy, bw, bh, [{ name: 'D', v: inp.D, f: 0.3 }, { name: 'EN', v: clk, bubble: true, f: 0.72 }], [{ name: 'Q', v: q.M, f: 0.3 }], 'master: open while CLK = 0');
          const ps = ffBox(c, kit, C, x2, cy, bw, bh, [{ name: 'D', v: q.M, f: 0.3 }, { name: 'EN', v: clk, f: 0.72 }], [{ name: 'Q', v: q.Q, f: 0.3 }, { name: '~Q', v: q.Qb, f: 0.72 }], 'slave: open while CLK = 1');
          S.wire(c, [pm.out[0], ps.in[0]], { color: lvl(C, q.M), width: q.M ? 2.6 : 2 });
          const yc = cy + bh / 2 + 26, cs = clkAt(pm.in[1][0] - 44, yc);
          S.wire(c, [cs, [ps.in[1][0], yc], ps.in[1]], { color: lvl(C, clk), width: clk ? 2.6 : 2 });
          S.wire(c, [[pm.in[1][0], yc], pm.in[1]], { color: lvl(C, clk), width: clk ? 2.6 : 2 });
          S.node(c, pm.in[1][0], yc, { color: lvl(C, clk) });
          S.wire(c, [[pm.in[0][0] - 30, pm.in[0][1]], pm.in[0]], { color: lvl(C, inp.D) });
          sw(pm.in[0][0] - 42, pm.in[0][1], 'D');
          out(ps.out[0], q.Q, 'Q'); out(ps.out[1], q.Qb, '~Q');
          return;
        }
        // counter and shift register: four flip-flops in a row
        const bw = Math.min(64, W * 0.09), bh = 50, xs = [0, 1, 2, 3].map(i => W * (0.33 + 0.155 * i)), yc = cy + bh / 2 + 22;
        const ripple = m === 'counter' && V.ripple;
        const pins = [];
        for (let i = 0; i < 4; i++) {
          const b = q.bits[i], cl = ripple ? (i ? q.bits[i - 1] : clk) : clk;
          const left = m === 'shift' ? [{ name: 'D', v: i ? q.bits[i - 1] : inp.D, f: 0.3 }, { name: '', v: cl, clock: true, f: 0.72 }] : [{ name: 'T', v: 1, f: 0.3 }, { name: '', v: cl, clock: true, bubble: ripple && i > 0, f: 0.72 }];
          pins.push(ffBox(c, kit, C, xs[i], cy, bw, bh, left, [{ name: 'Q', v: b, f: 0.3 }], 'FF' + i));
          const po = pins[i].out[0];
          S.wire(c, [po, [po[0] + 4, po[1]], [po[0] + 4, cy - bh / 2 - 16]], { color: lvl(C, b), width: b ? 2.6 : 2 });
          S.led(c, po[0] + 4, cy - bh / 2 - 24, b, { r: 8 });
          kit.label(c, 'Q' + i, po[0] + 16, cy - bh / 2 - 24, { size: 12, weight: 600, color: C.text });
        }
        const csx = xs[0] - bw / 2 - 58, cs = clkAt(csx, yc);
        if (ripple) {
          const p0 = pins[0].in[1];
          S.wire(c, [cs, [p0[0] - 10, yc], [p0[0] - 10, p0[1]], p0], { color: lvl(C, clk), width: clk ? 2.6 : 2 });
          for (let i = 1; i < 4; i++) {
            const po = pins[i - 1].out[0], pi = pins[i].in[1], b = q.bits[i - 1];
            S.wire(c, [[po[0] + 4, po[1]], [po[0] + 4, pi[1] + 16], [pi[0] - 6, pi[1] + 16], [pi[0] - 6, pi[1]], pi], { color: lvl(C, b), width: b ? 2.6 : 2 });
          }
          kit.label(c, 'each stage is clocked by the fall of the one before', W * 0.56, topH - 6, { align: 'center', size: 11, color: C.muted });
        } else {
          S.wire(c, [cs, [pins[3].in[1][0] - 6, yc]], { color: lvl(C, clk), width: clk ? 2.6 : 2 });
          for (let i = 0; i < 4; i++) { const pi = pins[i].in[1]; S.wire(c, [[pi[0] - 6, yc], [pi[0] - 6, pi[1]], pi], { color: lvl(C, clk), width: clk ? 2.6 : 2 }); S.node(c, pi[0] - 6, yc, { color: lvl(C, clk) }); }
          kit.label(c, m === 'shift' ? 'every flip-flop takes its left neighbour\'s bit on the same edge' : 'synchronous: one clock for all, logic decides which bits toggle', W * 0.56, topH - 6, { align: 'center', size: 11, color: C.muted });
        }
        if (m === 'shift') {
          for (let i = 1; i < 4; i++) { const po = pins[i - 1].out[0], pi = pins[i].in[0]; S.wire(c, [[po[0] + 4, po[1]], pi], { color: lvl(C, q.bits[i - 1]) }); }
          S.wire(c, [[pins[0].in[0][0] - 20, pins[0].in[0][1]], pins[0].in[0]], { color: lvl(C, inp.D) });
          sw(pins[0].in[0][0] - 32, pins[0].in[0][1], 'D', 'DIN');
        } else {
          sw(csx, cy - bh / 2 - 8, 'EN', 'EN');
          kit.label(c, 'count = ' + q.v, 14, 16, { size: 15, weight: 700, color: C.accent });
        }
      }

      function frame(dt) {
        // time runs on even with the clock stopped, so the diagram keeps scrolling
        acc += (dt || 0) * (V.mode === 'sr' ? 1.2 : V.rate) * SUB;
        let guard = 0;
        while (acc >= 1 && guard++ < 400) { acc -= 1; tick(); }
        const C = kit.colors();
        const c = st.begin();
        hot.clear();
        const W = st.W, H = st.H, topH = Math.max(150, H * 0.4);
        const last = hist.length ? hist[hist.length - 1] : { clk: 0 };
        drawTop(c, C, W, topH, last.clk);
        const rows = rowsFor(C), marks = [];
        for (let i = 1; i < hist.length; i++) if (hist[i].clk && !hist[i - 1].clk) marks.push(i);
        timing(c, C, 8, topH + 12, W - 16, H - topH - 22, rows, WIN, { labelW: 56, marks });
        const m = V.mode;
        ro.set('q', m === 'counter' || m === 'shift' ? 'Q3..Q0 = ' + bin(q.v, 4) + ' (' + q.v + ')' : 'Q = ' + q.Q + ', Q′ = ' + q.Qb);
        ro.set('next', {
          sr: inp.S && inp.R ? 'S = R = 1: both outputs forced to 0 (forbidden)' : inp.S ? 'set: Q goes to 1' : inp.R ? 'reset: Q goes to 0' : 'hold: the loop keeps its state',
          dlatch: 'while EN = 1, Q follows D (now ' + inp.D + ')',
          dff: 'at the next rising edge Q becomes ' + inp.D,
          jk: 'at the next rising edge: ' + (inp.J && inp.K ? 'toggle' : inp.J ? 'set' : inp.K ? 'reset' : 'hold'),
          counter: inp.EN ? 'counting, modulo ' + Math.round(V.mod) : 'held (EN = 0)',
          shift: 'next edge shifts in ' + inp.D
        }[m]);
      }
      reset(); showCtl();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
    }
  });

  /* ================================================================ 6. traffic-light state machine */
  const TL = [
    { id: 'MG', name: 'main green', main: 'G', side: 'R', walk: 0, time: 4 },
    { id: 'MA', name: 'main amber', main: 'A', side: 'R', walk: 0, time: 2 },
    { id: 'R1', name: 'all red', main: 'R', side: 'R', walk: 0, time: 1 },
    { id: 'SG', name: 'side green + walk', main: 'R', side: 'G', walk: 1, time: 4 },
    { id: 'SA', name: 'side amber', main: 'R', side: 'A', walk: 0, time: 2 },
    { id: 'R2', name: 'all red', main: 'R', side: 'R', walk: 0, time: 1 }
  ];
  const TL_CODE = { bin: i => bin(i, 3), gray: i => bin([0, 1, 3, 2, 6, 7][i], 3), hot: i => bin(1 << i, 6) };

  Hyper.sim('dig-fsm', {
    title: 'A traffic-light controller as a state machine',
    blurb: `A Moore machine with six states: the lights depend only on the state, and the state changes only on a clock edge. *done* means the state's own timer has run out; the main road stays green until someone presses the WALK button.

- Press the button while the main road is green and follow the lit circle around the diagram.
- Press it during the side-road green: the request waits for the next cycle.
- Change the **encoding**: the diagram does not change, only the pattern stored in the flip-flops — binary needs 3, one-hot needs 6 but makes the next-state logic trivial.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360 });
      const hot = makeHot();
      const SUBF = 8, WIN = 16 * SUBF;
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Clock', min: 0.5, max: 4, step: 0.1, value: 1.5, unit: 'Hz' },
        { id: 'run', type: 'check', label: 'Clock running', value: true },
        { id: 'rand', type: 'check', label: 'Pedestrians arrive at random', value: false },
        { id: 'enc', type: 'select', label: 'State encoding', options: [['Binary: 3 flip-flops', 'bin'], ['Gray: 3 flip-flops', 'gray'], ['One-hot: 6 flip-flops', 'hot']], value: 'bin' },
        { type: 'buttons', items: [{ id: 'req', label: 'Press WALK', primary: true }, { id: 'step', label: 'One clock tick' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'req') req = 1;
        else if (id === 'step') { for (let i = 0; i < SUBF; i++) substep(); }
        else if (id === 'reset') { state = 0; timer = 0; req = 0; hist = []; sub = 0; }
        report();
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['code', 'Flip-flop contents'], ['timer', 'Timer'], ['out', 'Outputs']]);
      const V = ctl.values;
      let state = 0, timer = 0, req = 0, acc = 0, sub = 0, from = -1, flash = 0, hist = [];

      function edge() {
        const s = TL[state], done = timer + 1 >= s.time;
        if (done && (state !== 0 || req)) { from = state; state = (state + 1) % TL.length; timer = 0; flash = 1; if (state === 3) req = 0; }
        else timer = Math.min(timer + 1, s.time);
        if (V.rand && Math.random() < 0.12) req = 1;
      }
      function substep() {
        if (sub === 0) edge();
        const s = TL[state];
        hist.push({ clk: sub < SUBF / 2 ? 1 : 0, req, st: s.id, main: s.main, side: s.side });
        if (hist.length > WIN) hist.shift();
        sub = (sub + 1) % SUBF;
      }
      function report() {
        const s = TL[state];
        ro.set('state', s.id + ': ' + s.name);
        ro.set('code', TL_CODE[V.enc](state) + '  (' + (V.enc === 'hot' ? 6 : 3) + ' flip-flops)');
        ro.set('timer', Math.min(timer + 1, s.time) + ' of ' + s.time + (state === 0 ? (req ? ', request waiting' : ', waiting for a request') : ''));
        ro.set('out', 'main ' + s.main + ', side ' + s.side + (s.walk ? ', WALK' : ', DON\'T WALK'));
      }
      clickable(kit, st, hot, id => { if (id === 'button') { req = 1; report(); } });

      function lamp(c, C, x, y, r, col, on) {
        c.beginPath(); c.arc(x, y, r, 0, 7);
        c.fillStyle = on ? col : C.surface; c.fill();
        if (on) { c.save(); c.globalAlpha = 0.3; c.beginPath(); c.arc(x, y, r + 5, 0, 7); c.fillStyle = col; c.fill(); c.restore(); }
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke();
      }
      function frame(dt) {
        if (V.run) {
          acc += (dt || 0) * V.rate * SUBF;
          let guard = 0;
          while (acc >= 1 && guard++ < 100) { acc -= 1; substep(); }
        }
        flash = Math.max(0, flash - (dt || 0) * 1.5);
        report();
        const C = kit.colors();
        const c = st.begin();
        hot.clear();
        const W = st.W, H = st.H, topH = H * 0.6;
        // the state diagram
        const cx = W * 0.31, cy = topH * 0.52, rx = W * 0.2, ry = topH * 0.33, r = clamp(Math.min(W, H) * 0.045, 18, 27);
        const P = i => { const a = -Math.PI / 2 + i * Math.PI / 3; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; };
        for (let i = 0; i < TL.length; i++) {
          const a = P(i), b = P((i + 1) % TL.length), d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
          const ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d;
          const hotArrow = flash > 0 && from === i;
          kit.arrow(c, a[0] + ux * (r + 3), a[1] + uy * (r + 3), b[0] - ux * (r + 4), b[1] - uy * (r + 4), hotArrow ? C.warn : C.muted, hotArrow ? 3 : 1.6);
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ox = mx - cx, oy = my - cy, od = Math.hypot(ox, oy) || 1;
          drawExpr(c, i === 0 ? 'REQ·done' : 'done', mx + ox / od * 16, my + oy / od * 12, { align: 'center', size: 11, color: hotArrow ? C.warn : C.muted });
        }
        for (let i = 0; i < TL.length; i++) {
          const [x, y] = P(i), cur = i === state;
          if (TL[i].time > 1) {
            // a self-loop on the outside: the state holds while its timer runs
            const ox = x - cx, oy = y - cy, od = Math.hypot(ox, oy) || 1, lx = x + ox / od * (r + 7), ly = y + oy / od * (r + 7);
            c.strokeStyle = C.muted; c.lineWidth = 1.4; c.beginPath(); c.arc(lx, ly, 9, 0, 7); c.stroke();
            if (i === 0) drawExpr(c, '~{REQ}+~{done}', lx, ly - 20, { align: 'center', size: 11, color: C.muted });
          }
          c.beginPath(); c.arc(x, y, r, 0, 7);
          c.fillStyle = C.surface; c.fill();
          if (cur) { c.fillStyle = C.accent; c.globalAlpha = 0.3; c.fill(); c.globalAlpha = 1; }
          c.strokeStyle = cur ? C.accent : C.text; c.lineWidth = cur ? 3 : 1.8; c.stroke();
          kit.label(c, TL[i].id, x, y - 5, { align: 'center', size: 13, weight: 700, color: C.text });
          kit.label(c, TL_CODE[V.enc](i), x, y + 9, { align: 'center', size: 9.5, color: C.muted });
        }
        // the lights
        const lx = W * 0.66, sx = W * 0.8, ly = topH * 0.12, lr = clamp(H * 0.03, 8, 13), gap = lr * 2.5;
        const s = TL[state];
        for (const [x, which, name] of [[lx, s.main, 'main road'], [sx, s.side, 'side road']]) {
          rrect(c, x - lr - 6, ly - lr - 6, 2 * lr + 12, 2 * gap + 2 * lr + 12, 7);
          c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke();
          lamp(c, C, x, ly, lr, RED, which === 'R');
          lamp(c, C, x, ly + gap, lr, AMBER, which === 'A');
          lamp(c, C, x, ly + 2 * gap, lr, GREEN, which === 'G');
          kit.label(c, name, x, ly + 2 * gap + lr + 18, { align: 'center', size: 11.5, color: C.muted });
        }
        const wy = ly + 2 * gap + lr + 46;
        rrect(c, lx - 34, wy - 13, 68, 26, 5); c.fillStyle = C.bg2; c.fill();
        kit.label(c, s.walk ? 'WALK' : 'WAIT', lx, wy, { align: 'center', size: 13, weight: 700, color: s.walk ? GREEN : RED });
        c.beginPath(); c.arc(sx, wy, 15, 0, 7); c.fillStyle = req ? C.warn : C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        kit.label(c, 'push', sx, wy, { align: 'center', size: 10.5, weight: 600, color: req ? C.bg2 : C.text });
        hot.add(sx - 18, wy - 18, 36, 36, 'button');
        // the timing diagram
        const col = key => hist.map(h => h[key]);
        const marks = [];
        for (let i = 1; i < hist.length; i++) if (hist[i].clk && !hist[i - 1].clk) marks.push(i);
        timing(c, C, 8, topH + 8, W - 16, H - topH - 16, [
          { label: 'CLK', color: C.warn, data: col('clk') },
          { label: 'REQ', color: C.ok, data: col('req') },
          { label: 'state', bus: true, color: C.accent, data: col('st') },
          { label: 'main', bus: true, color: C.series[1], data: col('main') },
          { label: 'side', bus: true, color: C.series[2], data: col('side') }
        ], WIN, { labelW: 50, marks });
      }
      for (let i = 0; i < SUBF; i++) substep();
      report();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
    }
  });

  /* ================================================================ 7. sampling, quantisation, DAC */
  Hyper.sim('dig-adc', {
    title: 'Sampling, quantisation and reconstruction',
    blurb: `A sine (blue) is sampled at the dots and each sample rounded to the nearest of 2^N levels; the DAC holds each code as a staircase (orange), and a reconstruction filter smooths it (green). The lower strip is the rounding error.

- Raise the resolution: each extra bit halves the steps and adds about 6 dB of signal-to-noise ratio.
- Push the signal above half the sampling rate: the samples — and the reconstructed output — now trace a slower sine. That is aliasing, and no processing afterwards can undo it.
- Try 9 kHz sampled at 10 kHz: a perfectly convincing 1 kHz wave that was never there.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 320 });
      const VREF = 3.3, PH = 0.35, MH = 24;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Signal frequency', min: 50, max: 20000, value: params.f || 1000, log: true, sig: 3, fmt: v => kit.eng(v, 'Hz') },
        { id: 'fs', label: 'Sampling rate', min: 500, max: 100000, value: params.fs || 10000, log: true, sig: 3, fmt: v => kit.eng(v, 'Hz') },
        { id: 'bits', label: 'Resolution', min: 1, max: 12, step: 1, value: params.bits || 3, unit: 'bits' },
        { id: 'amp', label: 'Amplitude (of full scale)', min: 10, max: 100, step: 1, value: 95, unit: '%' },
        { id: 'hold', type: 'check', label: 'DAC output (staircase)', value: params.hold !== false },
        { id: 'recon', type: 'check', label: 'Reconstruction filter', value: !!params.recon },
        { id: 'err', type: 'check', label: 'Quantisation error strip', value: true }
      ], () => { rebuild(); dirty = true; });
      const ro = kit.readout(box.side, [['lsb', '1 LSB (3.3 V reference)'], ['nyq', 'Nyquist frequency f_s/2'], ['spp', 'Samples per period'], ['fa', 'Frequency in the samples'], ['snr', 'Ideal SNR, 6.02N + 1.76'], ['rms', 'RMS error: measured / LSB/√12']]);
      const V = ctl.values;
      let D = null, dirty = true, since = 0;

      function rebuild() {
        const f = V.f, fs = V.fs, N = Math.round(V.bits), L = 1 << N, lsb = VREF / L, A = V.amp / 100 * VREF / 2;
        const fa = Math.abs(f - fs * Math.round(f / fs)), aliased = f > fs / 2;
        let Tw = 3 / f;
        if (aliased && fa > 1e-6) Tw = Math.min(3 / fa, 80 / fs);
        Tw = Math.min(Math.max(Tw, 4 / fs), 3000 / fs);
        const k1 = Math.ceil(Tw * fs);
        const smp = [];
        for (let k = -MH; k <= k1 + MH; k++) {
          const t = k / fs, v = VREF / 2 + A * Math.sin(2 * Math.PI * f * t + PH);
          const code = clamp(Math.round(v / lsb), 0, L - 1);
          smp.push({ t, v, code, q: code * lsb });
        }
        const inWin = smp.filter(s => s.t >= 0 && s.t <= Tw);
        const rms = Math.sqrt(inWin.reduce((s, p) => s + (p.v - p.q) * (p.v - p.q), 0) / Math.max(1, inWin.length));
        // the input, drawn finely
        const np = clamp(Math.ceil(f * Tw * 30), 200, 4000), sig = [];
        for (let i = 0; i <= np; i++) { const t = Tw * i / np; sig.push([t, VREF / 2 + A * Math.sin(2 * Math.PI * f * t + PH)]); }
        // ideal reconstruction: a windowed sinc through the DAC codes
        const rec = [];
        for (let i = 0; i <= 600; i++) {
          const t = Tw * i / 600, u = t * fs, base = Math.floor(u);
          let sum = 0;
          for (let k = base - MH + 1; k <= base + MH; k++) {
            const idx = k + MH;
            if (idx < 0 || idx >= smp.length) continue;
            const x = u - k, w = 0.5 * (1 + Math.cos(Math.PI * x / MH));
            sum += smp[idx].q * (Math.abs(x) < 1e-9 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)) * w;
          }
          rec.push([t, sum]);
        }
        D = { f, fs, N, L, lsb, Tw, smp, inWin, sig, rec, aliased, fa };
        ro.set('lsb', kit.eng(lsb, 'V'));
        ro.set('nyq', kit.eng(fs / 2, 'Hz'));
        ro.set('spp', (fs / f).toPrecision(3) + (aliased ? '  — fewer than 2!' : ''));
        ro.set('fa', aliased ? kit.eng(fa, 'Hz') + ' (an alias)' : kit.eng(f, 'Hz') + ' (correct)');
        ro.set('snr', (6.02 * N + 1.76).toFixed(1) + ' dB for a full-scale sine');
        ro.set('rms', kit.eng(rms, 'V') + ' / ' + kit.eng(lsb / Math.sqrt(12), 'V'));
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, d = D;
        const px = 54, pw = W - px - 14, py = 30, ph = (V.err ? 0.62 : 0.84) * H - py;
        const X = t => px + pw * t / d.Tw, Y = v => py + ph - ph * v / VREF;
        c.fillStyle = C.surface; c.fillRect(px, py, pw, ph);
        if (d.L <= 64) {
          c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.beginPath();
          for (let k = 0; k < d.L; k++) { const y = Math.round(Y(k * d.lsb)) + 0.5; c.moveTo(px, y); c.lineTo(px + pw, y); }
          c.stroke();
        }
        kit.label(c, '0', px - 6, Y(0), { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, '3.3 V', px - 6, Y(VREF), { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, '0', px, py + ph + 11, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, kit.eng(d.Tw, 's'), px + pw, py + ph + 11, { align: 'right', size: 10.5, color: C.muted });
        c.save(); c.beginPath(); c.rect(px, py - 4, pw, ph + 8); c.clip();
        c.strokeStyle = C.accent; c.lineWidth = 1.4; c.beginPath();
        d.sig.forEach((p, i) => (i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1])))); c.stroke();
        if (V.hold) {
          c.strokeStyle = C.warn; c.lineWidth = 2.2; c.beginPath();
          let first = true;
          for (let i = 0; i < d.smp.length - 1; i++) {
            const a = d.smp[i], b = d.smp[i + 1];
            if (b.t < 0 || a.t > d.Tw) continue;
            if (first) { c.moveTo(X(a.t), Y(a.q)); first = false; } else c.lineTo(X(a.t), Y(a.q));
            c.lineTo(X(b.t), Y(a.q));
          }
          c.stroke();
        }
        if (V.recon) {
          c.strokeStyle = C.ok; c.lineWidth = 2.4; c.beginPath();
          d.rec.forEach((p, i) => (i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1])))); c.stroke();
        }
        if (d.inWin.length <= 160) for (const s of d.inWin) kit.dot(c, X(s.t), Y(s.q), 3.2, C.text);
        c.restore();
        let lx = px + 4;
        for (const [txt, col, on] of [['input', C.accent, true], ['DAC staircase', C.warn, V.hold], ['reconstructed', C.ok, V.recon], ['samples', C.text, d.inWin.length <= 160]]) {
          if (!on) continue;
          c.fillStyle = col; c.fillRect(lx, 11, 14, 4);
          kit.label(c, txt, lx + 18, 13, { size: 11.5, color: C.muted });
          lx += 30 + txt.length * 6.3;
        }
        if (d.aliased) kit.label(c, 'f > f_s/2: the samples fit a ' + kit.eng(d.fa, 'Hz') + ' sine just as well', px + pw, 13, { align: 'right', size: 12, weight: 600, color: C.bad });
        if (V.err) {
          const ey = py + ph + 26, eh = H - ey - 22, Ye = e => ey + eh / 2 - (eh / 2) * clamp(e, -1, 1);
          c.fillStyle = C.surface; c.fillRect(px, ey, pw, eh);
          c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
          c.moveTo(px, Ye(0.5)); c.lineTo(px + pw, Ye(0.5)); c.moveTo(px, Ye(-0.5)); c.lineTo(px + pw, Ye(-0.5)); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.muted; c.beginPath(); c.moveTo(px, Ye(0)); c.lineTo(px + pw, Ye(0)); c.stroke();
          const many = d.inWin.length > 200;
          c.strokeStyle = C.series[3]; c.lineWidth = many ? 1.2 : 2; c.beginPath();
          d.inWin.forEach((s, i) => {
            const e = (s.v - s.q) / d.lsb;
            if (many) { if (i) c.lineTo(X(s.t), Ye(e)); else c.moveTo(X(s.t), Ye(e)); }
            else { c.moveTo(X(s.t), Ye(0)); c.lineTo(X(s.t), Ye(e)); }
          });
          c.stroke();
          kit.label(c, '+½', px - 6, Ye(0.5), { align: 'right', size: 10, color: C.muted });
          kit.label(c, '−½', px - 6, Ye(-0.5), { align: 'right', size: 10, color: C.muted });
          kit.label(c, 'quantisation error, in LSB', px + 4, ey + eh + 11, { size: 11, color: C.muted });
        }
      }
      rebuild();
      st.onResize(() => { dirty = true; });
      const loop = kit.loop(dt => { since += dt || 0; if (dirty || since > 0.5) { dirty = false; since = 0; draw(); } }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 8. UART, SPI and I²C */
  Hyper.sim('dig-bus', {
    title: 'UART, SPI and I²C on the wire',
    blurb: `The same byte sent three ways. The I²C lines are open-drain: the pull-up resistors and the bus capacitance are solved by the circuit simulator, so the rising edges are real RC curves (dashed lines: 30 % and 70 % of V_DD).

- **UART:** move the *receiver clock error*. The receiver re-times from the start bit and samples mid-bit; beyond about ±5 % the last bits are read in the wrong place.
- **SPI:** step through the four modes and watch which clock edge samples the data (the dots).
- **I²C:** raise the pull-up resistance or the bus capacitance until the clock no longer reaches 70 % before it falls again — then choose the pull-up the read-out recommends.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 360 });
      const S = kit.schem;
      const NP = 900, VDD = 3.3;
      const ctl = kit.controls(box.side, [
        { id: 'bus', type: 'select', label: 'Bus', options: [['UART', 'uart'], ['SPI', 'spi'], ['I²C', 'i2c']], value: params.bus || 'uart' },
        { id: 'byte', label: 'Byte sent', min: 0, max: 255, step: 1, value: 0x4B, fmt: v => hex(Math.round(v)) + '  ' + bin(Math.round(v), 8) },
        { id: 'baud', type: 'select', label: 'Baud rate', options: [['9600', 9600], ['115 200', 115200]], value: 115200 },
        { id: 'parity', type: 'select', label: 'Parity', options: [['none (8N1)', 'none'], ['even (8E1)', 'even'], ['odd (8O1)', 'odd']], value: 'none' },
        { id: 'err', label: 'Receiver clock error', min: -8, max: 8, step: 0.5, value: 0, unit: '%' },
        { id: 'mode', type: 'select', label: 'SPI mode (CPOL, CPHA)', options: [['0 (0, 0)', 0], ['1 (0, 1)', 1], ['2 (1, 0)', 2], ['3 (1, 1)', 3]], value: 0 },
        { id: 'sck', type: 'select', label: 'SPI clock', options: [['1 MHz', 1e6], ['8 MHz', 8e6], ['20 MHz', 20e6]], value: 8e6 },
        { id: 'speed', type: 'select', label: 'I²C speed', options: [['standard mode, 100 kHz', 1e5], ['fast mode, 400 kHz', 4e5]], value: params.speed || 1e5 },
        { id: 'rp', label: 'Pull-up resistors', min: 470, max: 22000, value: params.rp || 4700, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'cb', label: 'Bus capacitance', min: 20e-12, max: 600e-12, value: params.cb || 200e-12, log: true, sig: 2, fmt: v => kit.eng(v, 'F') }
      ], () => { rebuild(); dirty = true; });
      const ro = kit.readout(box.side, [['bit', 'Bit time'], ['frame', 'Transfer time'], ['rate', 'Payload throughput'], ['rx', 'Received'], ['tr', 'Rise time, 30 → 70 %'], ['lim', 'Pull-up range for this bus']]);
      const V = ctl.values;
      let W8 = null, dirty = true, since = 0;

      function show() {
        const b = V.bus;
        for (const id of ['baud', 'parity', 'err']) ctl.show(id, b === 'uart');
        for (const id of ['mode', 'sck']) ctl.show(id, b === 'spi');
        for (const id of ['speed', 'rp', 'cb']) ctl.show(id, b === 'i2c');
        ro.show('rx', b !== 'spi'); ro.show('tr', b === 'i2c'); ro.show('lim', b === 'i2c');
      }
      const sample = (T, fn) => { const d = []; for (let i = 0; i < NP; i++) d.push(fn((i + 0.5) * T / NP)); return d; };

      function uart() {
        const byte = Math.round(V.byte), Tb = 1 / V.baud, par = V.parity;
        const bits = [0];
        for (let k = 0; k < 8; k++) bits.push((byte >> k) & 1);
        let ones = 0;
        for (let k = 0; k < 8; k++) ones += (byte >> k) & 1;
        if (par !== 'none') bits.push(par === 'even' ? ones & 1 : 1 - (ones & 1));
        bits.push(1);
        const nf = bits.length, t0 = 1.2 * Tb, T = t0 + (nf + 1.8) * Tb;
        const level = t => { const u = (t - t0) / Tb; if (u < 0) return 1; if (u < nf) return bits[Math.floor(u)]; if (u < nf + 1) return 0; return byte & 1; };
        const names = ['start'].concat([0, 1, 2, 3, 4, 5, 6, 7].map(k => 'b' + k), par !== 'none' ? ['P'] : [], ['stop']);
        const smp = [];
        for (let k = 0; k < nf; k++) { const t = t0 + (k + 0.5) * Tb * (1 + V.err / 100); smp.push({ t, v: level(t), want: bits[k] }); }
        let got = 0;
        for (let k = 0; k < 8; k++) got |= smp[k + 1].v << k;
        const framing = smp[nf - 1].v !== 1, badStart = smp[0].v !== 0;
        let parityErr = false;
        if (par !== 'none') { let o = 0; for (let k = 0; k < 8; k++) o += (got >> k) & 1; const pb = smp[9].v; parityErr = par === 'even' ? ((o + pb) & 1) === 1 : ((o + pb) & 1) === 0; }
        const good = got === byte && !framing && !parityErr && !badStart;
        ro.set('bit', kit.eng(Tb, 's'));
        ro.set('frame', kit.eng(nf * Tb, 's') + ' for ' + nf + ' bits');
        ro.set('rate', kit.eng(V.baud / nf, 'B/s') + ' (8 of every ' + nf + ' bits are data)');
        ro.set('rx', hex(got) + (good ? '  ✓' : '  ✗') + (framing ? ' framing error' : '') + (parityErr ? ' parity error' : '') + (!good && !framing && !parityErr ? ' wrong byte' : ''));
        return {
          T, rows: [{ label: 'TX → RX', color: C0().accent, data: sample(T, level) }],
          notes: names.map((nm, k) => ({ t: t0 + (k + 0.5) * Tb, text: nm, sub: String(smp[k].v) })).concat([{ t: t0 + (nf + 0.5) * Tb, text: 'next' }]),
          samples: smp.map(s => ({ t: s.t, row: 0, v: s.v, ok: s.v === s.want })), edges: bits.map((_, k) => t0 + k * Tb).concat([t0 + nf * Tb])
        };
      }
      function spi() {
        const byte = Math.round(V.byte), reply = 0xA5, T = 1 / V.sck, mode = V.mode, cpol = mode >> 1, cpha = mode & 1;
        const t0 = 0.8 * T, Tt = t0 + 9.8 * T;
        const u = t => (t - t0) / T;
        const sck = t => { const x = u(t); if (x < 0.5 || x >= 8.5) return cpol; return ((x - 0.5) % 1) < 0.5 ? 1 - cpol : cpol; };
        const cs = t => (u(t) >= 0 && u(t) < 8.75 ? 0 : 1);
        const dat = (b, t) => { const x = u(t), s0 = cpha ? 0.5 : 0; if (x < s0 || x >= 8.75) return 'z'; return (b >> (7 - Math.min(7, Math.floor(x - s0)))) & 1; };
        const smpT = [];
        for (let k = 0; k < 8; k++) smpT.push(t0 + (cpha ? k + 1 : k + 0.5) * T);
        ro.set('bit', kit.eng(T, 's'));
        ro.set('frame', kit.eng(8.75 * T, 's') + ' for one byte, chip select included');
        ro.set('rate', kit.eng(V.sck / 8, 'B/s') + ' each way, at the same time');
        const C = C0();
        return {
          T: Tt, rows: [
            { label: '~{CS}', color: C.warn, data: sample(Tt, cs) },
            { label: 'SCK', color: C.series[1], data: sample(Tt, sck) },
            { label: 'MOSI', color: C.accent, data: sample(Tt, t => dat(byte, t)) },
            { label: 'MISO', color: C.ok, data: sample(Tt, t => dat(reply, t)) }
          ],
          notes: [0, 1, 2, 3, 4, 5, 6, 7].map(k => ({ t: t0 + (k + (cpha ? 1 : 0.5)) * T, text: 'b' + (7 - k), row: 2 })),
          samples: smpT.map(t => ({ t, row: 2, v: dat(byte, t), ok: true })).concat(smpT.map(t => ({ t, row: 3, v: dat(reply, t), ok: true }))),
          sampleLines: smpT
        };
      }
      function i2c() {
        const f = V.speed, T = 1 / f, q = T / 4, addr = 0x48, byte = Math.round(V.byte);
        const slots = [], labels = [];
        const push = (scl, sda, who) => slots.push([scl, sda, who]);
        push(1, 1, ''); push(1, 1, ''); push(1, 0, 'm'); push(1, 0, 'm');
        const bitSlots = (b, who) => { push(0, b, who); push(0, b, who); push(1, b, who); push(1, b, who); };
        const sendByte = (v, names) => {
          for (let k = 7; k >= 0; k--) { labels.push([slots.length, names[7 - k], 'm']); bitSlots((v >> k) & 1, 'm'); }
          labels.push([slots.length, 'ACK', 's']); bitSlots(0, 's');
        };
        sendByte((addr << 1) | 0, ['A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'W']);
        sendByte(byte, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0']);
        push(0, 0, 'm'); push(0, 0, 'm'); push(1, 0, 'm'); push(1, 1, ''); push(1, 1, ''); push(1, 1, '');
        const Tt = slots.length * q;
        // the bus itself: pull-ups, capacitance and two open-drain switches, stepped in time
        const c = new kit.Circuit();
        c.V('vdd', 'gnd', VDD);
        c.R('vdd', 'scl', V.rp); c.R('vdd', 'sda', V.rp);
        c.C('scl', 'gnd', V.cb, VDD); c.C('sda', 'gnd', V.cb, VDD);
        const swC = c.SW('scl', 'gnd', false, { ron: 40 }), swD = c.SW('sda', 'gnd', false, { ron: 40 });
        c.reset();
        const tau = V.rp * V.cb;
        const dt = Math.max(Math.min(q / 60, tau / 10), Tt / 30000);
        const scl = new Array(NP), sda = new Array(NP);
        let next = 0;
        const nsteps = Math.ceil(Tt / dt);
        for (let s = 0; s < nsteps && next < NP; s++) {
          const slot = slots[Math.min(slots.length - 1, Math.floor(s * dt / q))];
          swC.closed = slot[0] === 0; swD.closed = slot[1] === 0;
          c.step(dt);
          while (next < NP && (next + 0.5) * Tt / NP <= c.t) { scl[next] = c.v('scl'); sda[next] = c.v('sda'); next++; }
        }
        while (next < NP) { scl[next] = c.v('scl'); sda[next] = c.v('sda'); next++; }
        const tr = 0.8473 * tau, trMax = f > 2e5 ? 300e-9 : 1000e-9, rMin = (VDD - 0.4) / 3e-3, rMax = trMax / (0.8473 * V.cb);
        const reach = 1.204 * tau < T / 2;
        ro.set('bit', kit.eng(T, 's'));
        ro.set('frame', kit.eng(Tt, 's') + ' for address + one data byte');
        ro.set('rate', kit.eng(f / 9, 'B/s') + ' at most (9 clocks per byte)');
        ro.set('rx', reach ? 'address 0x48 ACKed, ' + hex(byte) + ' ACKed' : '✗ SCL never reaches 70 %: garbage');
        ro.set('tr', kit.eng(tr, 's') + (tr <= trMax ? '  ✓' : '  ✗') + ' (limit ' + kit.eng(trMax, 's') + ')');
        ro.set('lim', rMax < rMin ? 'none! reduce the bus capacitance' : kit.eng(rMin, 'Ω') + ' to ' + kit.eng(rMax, 'Ω') + (V.rp >= rMin && V.rp <= rMax ? '  ✓' : '  ✗'));
        const C = C0();
        return {
          T: Tt, rows: [
            { label: 'SCL', analog: true, vmax: VDD, th: [0.3 * VDD, 0.7 * VDD], color: C.series[1], data: scl },
            { label: 'SDA', analog: true, vmax: VDD, th: [0.3 * VDD, 0.7 * VDD], color: C.accent, data: sda }
          ],
          notes: labels.map(([s0, txt, who]) => ({ t: (s0 + 3) * q, text: txt, row: 1, who })).concat([{ t: 2.5 * q, text: 'S', row: 1, who: 'm' }, { t: (slots.length - 3.5) * q, text: 'P', row: 1, who: 'm' }]),
          bands: labels.filter(l => l[2] === 's').map(([s0]) => [s0 * q, (s0 + 4) * q])
        };
      }
      let C0 = () => kit.colors();
      function rebuild() {
        show();
        W8 = V.bus === 'spi' ? spi() : V.bus === 'i2c' ? i2c() : uart();
        if (V.bus === 'spi') ro.set('rx', '—');
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, b = V.bus, topH = Math.max(110, H * 0.3);
        // the connection
        const xa = W * 0.2, xb = W * 0.8, cy = topH * 0.55, bw = Math.min(130, W * 0.2), bh = Math.min(84, topH * 0.7);
        if (b === 'i2c') {
          chipBox(c, kit, C, xa, cy + 8, bw, bh * 0.8, 'MCU', 'master');
          chipBox(c, kit, C, xb, cy + 8, bw, bh * 0.8, 'ADS1115', 'slave at 0x48');
          const y1 = cy - 6, y2 = cy + 22, x1 = xa + bw / 2, x2 = xb - bw / 2, rx1 = W * 0.42, rx2 = W * 0.5, yr = 26;
          S.wire(c, [[x1, y1], [x2, y1]]); S.wire(c, [[x1, y2], [x2, y2]]);
          kit.label(c, 'SCL', x1 + 8, y1 - 9, { size: 11, color: C.muted }); kit.label(c, 'SDA', x1 + 8, y2 + 10, { size: 11, color: C.muted });
          S.wire(c, [[rx1 - 18, yr], [rx2 + 18, yr]]);
          kit.label(c, '+3.3 V', rx2 + 22, yr, { size: 11, color: C.text });
          S.resistor(c, rx1, yr, rx1, y1, { label: '', color: C.text }); S.node(c, rx1, y1);
          S.resistor(c, rx2, yr, rx2, y2, { label: '', color: C.text }); S.node(c, rx2, y2);
          kit.label(c, 'R_p = ' + kit.eng(V.rp, 'Ω'), (rx1 + rx2) / 2, yr - 10, { align: 'center', size: 11, color: C.accent });
          const cx1 = W * 0.6, cx2 = W * 0.66, yg = Math.min(topH - 18, y2 + 44);
          S.capacitor(c, cx1, y1, cx1, yg, { color: C.faint }); S.node(c, cx1, y1);
          S.capacitor(c, cx2, y2, cx2, yg, { color: C.faint }); S.node(c, cx2, y2);
          kit.label(c, 'C_bus ' + kit.eng(V.cb, 'F'), cx2 + 18, yg - 10, { size: 11, color: C.accent });
        } else if (b === 'spi') {
          chipBox(c, kit, C, xa, cy, bw, bh, 'MCU', 'master');
          chipBox(c, kit, C, xb, cy, bw, bh, 'slave', 'e.g. 74HC595 or an ADC');
          const ys = [-0.3, -0.1, 0.1, 0.3].map(f => cy + f * bh), nm = ['SCK', 'MOSI', 'MISO', '~{CS}'], dir = [1, 1, -1, 1];
          ys.forEach((y, i) => {
            if (dir[i] > 0) kit.arrow(c, xa + bw / 2, y, xb - bw / 2, y, C.text, 1.8); else kit.arrow(c, xb - bw / 2, y, xa + bw / 2, y, C.text, 1.8);
            drawExpr(c, nm[i], W / 2, y - 7, { align: 'center', size: 11, color: C.muted });
          });
        } else {
          chipBox(c, kit, C, xa, cy, bw, bh, 'MCU', 'UART');
          chipBox(c, kit, C, xb, cy, bw, bh, 'USB–serial', 'or another MCU');
          kit.arrow(c, xa + bw / 2, cy - 12, xb - bw / 2, cy - 12, C.text, 1.8);
          kit.arrow(c, xb - bw / 2, cy + 12, xa + bw / 2, cy + 12, C.text, 1.8);
          kit.label(c, 'TX → RX', W / 2, cy - 22, { align: 'center', size: 11, color: C.muted });
          kit.label(c, 'RX ← TX', W / 2, cy + 22, { align: 'center', size: 11, color: C.muted });
        }
        // the waveforms
        const w = W8, n = NP, ty = topH + 24, th = Math.min(H - ty - 36, w.rows.length * (b === 'uart' ? 90 : 62));
        const lw = 56, x0 = 8 + lw, ww = W - 16 - lw, tx = t => x0 + ww * t / w.T;
        for (const band of (w.bands || [])) { c.fillStyle = C.ok; c.globalAlpha = 0.12; c.fillRect(tx(band[0]), ty, tx(band[1]) - tx(band[0]), th); c.globalAlpha = 1; }
        const geo = timing(c, C, 8, ty, W - 16, th, w.rows, n, { labelW: lw, marks: (w.edges || []).map(t => t / w.T * n) });
        if (w.sampleLines) { c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.lineWidth = 1; c.beginPath(); for (const t of w.sampleLines) { c.moveTo(tx(t), ty); c.lineTo(tx(t), ty + th); } c.stroke(); c.setLineDash([]); }
        for (const nt of (w.notes || [])) {
          const row = nt.row || 0, yTop = ty + row * geo.rh;
          const col = nt.who === 's' ? C.ok : nt.text === 'start' || nt.text === 'stop' || nt.text === 'next' || nt.text === 'P' ? C.warn : C.text;
          kit.label(c, nt.text, tx(nt.t), row ? yTop + 7 : ty - 8, { align: 'center', size: 10.5, weight: 600, color: col });
          if (nt.sub != null) kit.label(c, nt.sub, tx(nt.t), ty + th + 10, { align: 'center', size: 10.5, color: C.muted });
        }
        for (const s of (w.samples || [])) {
          const yTop = ty + s.row * geo.rh, yy = s.v === 'z' ? yTop + geo.rh / 2 : s.v ? yTop + geo.rh * 0.18 : yTop + geo.rh * 0.82;
          kit.dot(c, tx(s.t), yy, 4, s.ok ? C.warn : C.bad, C.bg2);
        }
        const tb = (b === 'uart' ? 1 / V.baud : b === 'spi' ? 1 / V.sck : 1 / V.speed);
        kit.label(c, (b === 'uart' ? 'dots: where the receiver samples; below, the bits it reads' : b === 'spi' ? 'dots: the sampling edges' : 'shaded: the slave drives SDA (acknowledge)') + '   ·   one bit = ' + kit.eng(tb, 's'), x0, H - 10, { size: 11, color: C.muted });
      }
      rebuild();
      st.onResize(() => { dirty = true; });
      const loop = kit.loop(dt => { since += dt || 0; if (dirty || since > 0.5) { dirty = false; since = 0; draw(); } }, box.stage);
      loop.start();
    }
  });
})();
