/* HYPER-ESP32 · sims/designing-a-solution.js
 *
 * Simulations of the topic "Designing a solution". Each is a step of the method, worked on the greenhouse monitor:
 *
 *   de-requirements      an idea in words, then as testable sentences: what the advisor recognises and ranks
 *   de-block-diagram     the six blocks drawn one at a time, the pins they ask for, and a valve that does not fit one cell
 *   de-power-budget      the monitor's battery life from the parts chosen: regulator, probe, divider, cell
 *   de-prototype-stages  which stage of prototyping can answer which question, and what a mistake costs there
 *   de-minimal-circuit   the circuit around a module as a schematic; click a part for its job and what happens without it
 *   de-schematic-review  a first draft with six planted mistakes to find
 *   de-pcb-layout        place the parts on a board and watch the layout rules turn green
 *   de-cost-stack        what a unit costs: the stack, the unit cost against quantity, and where a bare chip overtakes a module
 *
 * Numbers about chips come from the catalogue. The costs in de-cost-stack are invented units, and the layout and
 * review rules are the common ones, not any one datasheet's.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const FONT = 'system-ui, "Segoe UI", sans-serif';
  const isNarrow = box => (box.stage.clientWidth || 700) < 560;

  /* the width of a string at a size, and the string shortened with an ellipsis so that it fits */
  function tw(c, str, size, weight) {
    c.save(); c.font = (weight || 500) + ' ' + size + 'px ' + FONT;
    const w = c.measureText(String(str)).width; c.restore(); return w;
  }
  function fit(c, str, maxW, size, weight) {
    let s = String(str);
    if (tw(c, s, size, weight) <= maxW) return s;
    while (s.length > 1 && tw(c, s + '…', size, weight) > maxW) s = s.slice(0, -1);
    return s + '…';
  }
  /* break words ({ t }) into lines no wider than maxW: -> { lines: [[word, …], …], sp } and each word gets .w */
  function wrapWords(c, words, maxW, size, weight) {
    const sp = tw(c, ' ', size, weight), lines = [];
    let line = [], w = 0;
    for (const word of words) {
      word.w = tw(c, word.t, size, weight);
      if (line.length && w + sp + word.w > maxW) { lines.push(line); line = []; w = 0; }
      w += (line.length ? sp : 0) + word.w; line.push(word);
    }
    if (line.length) lines.push(line);
    return { lines, sp };
  }
  /* plain wrapped text: -> the number of lines used */
  function paragraph(kit, c, str, x, y, maxW, size, o) {
    o = o || {};
    const L = wrapWords(c, String(str).split(' ').map(t => ({ t })), maxW, size, o.weight), lh = o.lh || size + 5;
    L.lines.forEach((line, i) => kit.label(c, line.map(w => w.t).join(' '), x, y + i * lh, { size, color: o.color, weight: o.weight }));
    return L.lines.length;
  }
  const softFill = C => (C.dark ? 'rgba(123,140,255,.26)' : 'rgba(60,90,220,.14)');

  /* ================================================================ de-requirements */
  const IDEAS = [
    { id: 'greenhouse', name: 'Greenhouse monitor',
      vague: 'Water my greenhouse when it is dry and tell me how it is doing from my phone.',
      exact: 'Every 10 minutes, measure air temperature to within 0.5 °C, humidity and soil moisture, send them over Wi-Fi to a home server 15 m away, and run 12 months on one battery, from -10 to 50 °C.' },
    { id: 'door', name: 'Shed door sensor',
      vague: 'Tell me when the shed door opens.',
      exact: 'A door sensor on a coin cell that lasts 2 years and reports within 2 s over Zigbee to Home Assistant, up to 10 m from the nearest Zigbee device, indoors at 0 to 40 °C.' },
    { id: 'thermostat', name: 'Thermostat',
      vague: 'A thermostat with a touch screen.',
      exact: 'A 4.3 inch touch panel thermostat with a smooth LVGL interface that holds 21 °C within 0.5 °C, redraws in under 100 ms and switches a relay, in a living room at 5 to 35 °C.' },
    { id: 'lamp', name: 'Voice lamp',
      vague: 'A lamp I can control with my voice.',
      exact: 'A voice-controlled lamp with an LED strip of 60 LEDs, a microphone for a wake word that answers within 1 s up to 4 m away, and Matter support.' },
    { id: 'console', name: 'Handheld console',
      vague: 'A game console.',
      exact: 'A handheld retro game console with a 3.5 inch colour screen at 30 frames per second, sound and a USB gamepad, running 4 hours on a battery.' }
  ];
  /* the five questions of the page, and a plain test for "this sentence gives a number for it" */
  const QS = [
    ['How often?', t => /\bevery\s+\d|\bwithin\s+\d+(\.\d+)?\s*(ms|s|seconds?|minutes?)\b|\bunder\s+\d+\s*ms|per\s+(second|minute|hour|day)/i.test(t)],
    ['How far?', t => /\b\d+(\.\d+)?\s*(m|km|metres?|meters?)\b/i.test(t)],
    ['How long on a battery?', t => /\b\d+\s*(months?|years?|days?|weeks?|hours?)\b/i.test(t) && /battery|cell|lasts/i.test(t)],
    ['How accurate?', t => /within\s+\d+(\.\d+)?\s*(°|%)/i.test(t) || /±/.test(t)],
    ['Where does it live?', t => /\d+\s*(to|-)\s*\d+\s*°\s*C|\bIP\d\d\b|-\d+\s*to\s*\d+\s*°/i.test(t)]
  ];

  Hyper.sim('de-requirements', {
    title: 'From words to needs',
    blurb: `The first step of the method: an idea, and what the project advisor can make of it. Phrases it recognises are lit in the sentence; below are the needs it found, the questions your sentence has put a number to, and the ranking of the chips of the catalogue.

**Try this**
- Read the greenhouse idea as people first say it: the advisor finds one need ("talks to a phone") and the first five chips are within a few points of each other.
- Tick **Write it as testable sentences**: Wi-Fi, analogue inputs and a battery appear, and the ranking changes.
- Do the same for the shed door sensor: "tell me when it opens" decides nothing, while a coin cell and Zigbee rule out most chips.
- The questions are a plain text check for a number, a text heuristic and not an engineer: use it to see what is still missing.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { height: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'idea', type: 'select', label: 'The idea', options: IDEAS.map(i => [i.name, i.id]), value: IDEAS.some(i => i.id === params.idea) ? params.idea : 'greenhouse' },
        { id: 'exact', type: 'check', label: 'Write it as testable sentences', value: !!params.exact }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['needs', 'Needs recognised'], ['nums', 'Questions with a number'], ['top', 'The advisor puts first'], ['spread', 'Gap between first and fifth']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const idea = IDEAS.find(i => i.id === ctl.values.idea) || IDEAS[0];
        const text = ctl.values.exact ? idea.exact : idea.vague;
        const u = E.understand(text), a = E.advise(text);
        const M = 14, W = st.W - 2 * M;
        let y = 18;
        kit.label(c, ctl.values.exact ? 'The idea, written as testable sentences' : 'The idea, as people first say it', M, y, { size: 12, weight: 650, color: C.text2 });
        y += 24;
        // the sentence, the recognised phrases lit
        const lower = text.toLowerCase(), marks = [];
        for (const n of u) for (const w of n.words) { let i = lower.indexOf(w); while (i >= 0) { marks.push([i, i + w.length]); i = lower.indexOf(w, i + 1); } }
        const words = []; let pos = 0;
        for (const part of text.split(' ')) { words.push({ t: part, a: pos, b: pos + part.length }); pos += part.length + 1; }
        const L = wrapWords(c, words, W, 13, 500), lh = 21;
        L.lines.forEach((line, li) => {
          let x = M;
          for (const wd of line) {
            const hot = marks.some(m => m[0] < wd.b && m[1] > wd.a), yy = y + li * lh;
            if (hot) { c.fillStyle = softFill(C); c.fillRect(x - 3, yy - 10, wd.w + 6, 19); }
            kit.label(c, wd.t, x, yy, { size: 13, color: hot ? C.text : C.text2, weight: hot ? 650 : 500 });
            x += wd.w + L.sp;
          }
        });
        y += L.lines.length * lh + 14;
        // the needs
        kit.label(c, 'What the advisor recognised', M, y, { size: 11.5, weight: 650, color: C.muted });
        y += 20;
        const labels = a.needs.map(id => ((E.NEEDS.find(n => n.id === id) || {}).label || id).replace(/\s*\(.*\)/, ''));
        if (!labels.length) { kit.label(c, 'nothing: no chip is better than another for this sentence', M, y, { size: 12, color: C.warn }); y += 26; }
        else {
          let x = M;
          labels.forEach(l => {
            const w = Math.min(W, tw(c, l, 11.5, 600) + 22);
            if (x + w > M + W + 1) { x = M; y += 28; }
            S.box(c, x, y - 11, w, 22, { label: fit(c, l, w - 10, 11.5, 600), size: 11.5, r: 11, active: true, color: C.accent });
            x += w + 6;
          });
          y += 32;
        }
        // the questions
        kit.label(c, 'Questions your sentence has put a number to', M, y, { size: 11.5, weight: 650, color: C.muted });
        y += 19;
        let nums = 0;
        QS.forEach(q => {
          const ok = !!q[1](text); if (ok) nums++;
          kit.label(c, ok ? '✓' : '○', M, y, { size: 13, color: ok ? C.ok : C.faint, weight: 700 });
          kit.label(c, q[0], M + 20, y, { size: 12, color: ok ? C.text : C.muted });
          y += 18;
        });
        y += 10;
        // the ranking
        kit.label(c, 'The advisor\'s ranking (score out of 100; the bars start at 40)', M, y, { size: 11.5, weight: 650, color: C.muted });
        y += 20;
        const top = a.ranked.slice(0, 5), nameW = Math.min(104, W * 0.3), bx = M + nameW + 6, bwid = Math.max(40, W - nameW - 6 - 34);
        top.forEach((r, i) => {
          const ch = E.chip(r.chip), nm = ch ? ch.name.replace(/\s*\(.*\)/, '') : String(r.chip);
          kit.label(c, nm, M, y, { size: 12, color: i === 0 ? C.text : C.text2, weight: i === 0 ? 650 : 500 });
          const f = clamp((r.score - 40) / 60, 0.02, 1);
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, y - 6, bwid, 12);
          c.fillStyle = i === 0 ? C.accent : (C.dark ? 'rgba(150,156,189,.7)' : 'rgba(110,116,150,.6)'); c.fillRect(bx, y - 6, bwid * f, 12);
          kit.label(c, String(Math.round(r.score)), bx + bwid + 6, y, { size: 11.5, color: C.text2 });
          y += 21;
        });
        y += 4;
        const out = a.out || [];
        const outTxt = out.length ? 'Ruled out: ' + out.length + ' chip' + (out.length === 1 ? '' : 's') + (out[0] && out[0].why && out[0].why[0] ? ', for example ' + out[0].chip.replace('esp32-', 'ESP32-').replace(/^esp32$/, 'ESP32') + ': ' + out[0].why[0] : '') : 'Ruled out: none';
        paragraph(kit, c, outTxt, M, y, W, 11, { color: C.muted, lh: 15 });
        const top0 = top[0], w0 = top0 && top0.watch && top0.watch[0];
        if (w0) paragraph(kit, c, 'To watch for the first choice: ' + w0, M, y + 34, W, 11, { color: C.muted, lh: 15 });
        // the read-out
        ro.set('needs', labels.length ? labels.length + ': ' + labels.join(', ') : 'none');
        ro.set('nums', nums + ' of 5');
        const name0 = top0 && E.chip(top0.chip) ? E.chip(top0.chip).name.replace(/\s*\(.*\)/, '') : '—';
        ro.set('top', top0 ? name0 + ' (' + Math.round(top0.score) + ')' : '—');
        const spread = top.length > 4 ? Math.round(top[0].score - top[4].score) : 0;
        ro.set('spread', spread + ' points' + (labels.length ? '' : ': the sentence decides nothing'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ de-block-diagram */
  const BLOCKS = [
    { id: 'cpu', label: 'Processing', sub: 'ESP32-C3', hue: 8, pins: 0, q: 'Which chip? How many pins does everything else ask for?' },
    { id: 'pow', label: 'Power', sub: 'one 18650 cell, 3.3 V regulator', hue: 40, pins: 1, q: 'How long on the cell? Which voltages, which peaks, what does it draw asleep?' },
    { id: 'sens', label: 'Sensing', sub: 'SHT3x on I2C, soil probe', hue: 160, pins: 4, q: 'Which interface and voltage? How much does it draw, and can it be switched off?' },
    { id: 'comm', label: 'Communication', sub: 'Wi-Fi, MQTT', hue: 212, pins: 0, q: 'To what, how far, how often? Is the radio in the chip enough?' },
    { id: 'act', label: 'Actuation', sub: '12 V valve and MOSFET', hue: 340, pins: 1, q: 'How much current, at which voltage? What if it sticks open?' },
    { id: 'ui', label: 'User interface', sub: 'LED and button', hue: 280, pins: 2, q: 'What must a person see or press? Is a screen needed at all?' }
  ];

  Hyper.sim('de-block-diagram', {
    title: 'The block diagram, one block at a time',
    blurb: `The greenhouse monitor drawn the way the page describes: six blocks, every line labelled. Move **Blocks drawn** to add them in order; each one raises a question, shown under the drawing.

**Try this**
- Step through the six blocks and watch **Pins on the chip** grow: seven in all, so the pins do not choose the chip.
- Reach *Actuation* with the valve **on this unit**: the verdict turns red, because a 12 V valve and a year on one 3.7 V cell do not fit together.
- Move the valve **to its own unit**: a second device with an adapter takes it over, joined by Wi-Fi, and the conflict is gone.
- Read the peak current on the power line: it is the radio's, from the catalogue, and it sizes the regulator.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.25 : 0.7, minH: 380, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'step', label: 'Blocks drawn', min: 0, max: 6, step: 1, value: 2 },
        { id: 'valve', type: 'select', label: 'The 12 V valve is', options: [['on this unit', 'same'], ['on its own unit (Wi-Fi)', 'own']], value: 'same' },
        { type: 'buttons', items: [{ id: 'next', label: 'Add the next block', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], (id) => {
        if (id === 'next') ctl.set('step', Math.min(6, ctl.values.step + 1));
        else if (id === 'reset') ctl.set('step', 0);
        loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Blocks drawn'], ['pins', 'Pins on the chip'], ['peak', 'Largest current on 3.3 V'], ['verdict', 'Verdict']]);
      const peak = (E.chip('esp32-c3') || {}).txMa;
      function place(W, H) {
        const narrow = W < 560, M = 10;
        const bw = narrow ? Math.floor((W - 2 * M - 2 * 16) / 3) : Math.min(176, Math.floor((W - 2 * M - 2 * 70) / 3)), bh = narrow ? 56 : 60;
        const cx = [M + bw / 2, W / 2, W - M - bw / 2], ry = [H * 0.14 + bh / 2 - 8, H * 0.36 + bh / 2, H * 0.58 + bh / 2 + 8];
        return { narrow, bw, bh, pos: { pow: [cx[0], ry[0]], sens: [cx[0], ry[1]], ui: [cx[0], ry[2]], cpu: [cx[1], ry[1]], comm: [cx[2], ry[0]], act: [cx[2], ry[2]] } };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const step = clamp(Math.round(ctl.values.step), 0, 6), same = ctl.values.valve === 'same';
        const P = place(st.W, st.H), has = id => BLOCKS.findIndex(b => b.id === id) < step;
        const bx = id => { const p = P.pos[id]; return { x: p[0] - P.bw / 2, y: p[1] - P.bh / 2 }; };
        const conflict = has('act') && same;
        // the lines first, under the boxes
        const line = (a, b, label, o) => {
          if (!has(a) || !has(b)) return;
          const A = P.pos[a], B = P.pos[b], dx = B[0] - A[0], dy = B[1] - A[1];
          const sx = Math.abs(dx) > 1 ? Math.sign(dx) * (P.bw / 2) : 0, sy = Math.abs(dx) > 1 ? 0 : Math.sign(dy) * (P.bh / 2);
          const x1 = A[0] + sx, y1 = A[1] + sy, x2 = B[0] - sx, y2 = B[1] - sy;
          S.link(c, x1, y1, x2, y2, Object.assign({ label: P.narrow ? undefined : label, labelBg: C.bg2, color: C.muted }, o || {}));
        };
        line('pow', 'cpu', '3.3 V, ' + (peak || 335) + ' mA peak', { arrow: 'end' });
        line('sens', 'cpu', 'I2C, analogue', { arrow: 'end' });
        line('cpu', 'comm', 'data', { arrow: 'both' });
        line('ui', 'cpu', 'LED, button', { arrow: 'both' });
        if (has('act') && same) line('cpu', 'act', 'switch', { arrow: 'end', color: C.bad });
        // the boxes
        BLOCKS.forEach((b, i) => {
          if (i >= step) return;
          if (b.id === 'act' && !same) return;
          const p = bx(b.id), bad = b.id === 'act' && same;
          S.box(c, p.x, p.y, P.bw, P.bh, { label: b.label, sub: fit(c, b.sub, P.bw - 10, 10), size: P.narrow ? 12 : 13, color: bad ? C.bad : kit.hue(b.hue), active: i === step - 1 || bad });
        });
        if (has('act') && !same) {          // the valve moved to a unit of its own, reached over Wi-Fi
          const p = P.pos.act, q = P.pos.comm;
          S.node(c, p[0], p[1] - 10, { kind: 'motor', label: 'Waterer unit', sub: '12 V adapter, valve', r: P.narrow ? 17 : 20, color: 340 });
          S.link(c, q[0], q[1] + P.bh / 2, p[0], p[1] - 32, { wireless: true, arrow: 'both', label: P.narrow ? undefined : 'Wi-Fi, MQTT', labelBg: C.bg2 });
        }
        // the question of the latest block
        const capY = st.H * 0.58 + P.bh + 36, W = st.W - 24;
        if (step === 0) paragraph(kit, c, 'Nothing drawn yet. Add the blocks one at a time, and read the question each one raises.', 12, capY, W, 12, { color: C.muted });
        else {
          const b = BLOCKS[step - 1];
          kit.label(c, 'Block ' + step + ': ' + b.label, 12, capY, { size: 12.5, weight: 650, color: C.text });
          let q = b.q;
          if (b.id === 'act') q = same ? 'A 12 V valve on a unit that must live a year on one cell: where does its power come from?' : 'The valve has its own unit with an adapter; the monitor only sends a message.';
          paragraph(kit, c, q, 12, capY + 20, W, 12, { color: C.text2 });
        }
        // the numbers
        const pins = BLOCKS.reduce((s, b, i) => s + (i < step && !(b.id === 'act' && !same) ? b.pins : 0), 0);
        ro.set('n', step + ' of 6');
        ro.set('pins', pins + (pins ? ' (any ESP32 has that many)' : ''));
        ro.set('peak', has('pow') ? (peak ? peak + ' mA when the radio transmits' : 'see the datasheet') : '—');
        ro.set('verdict', step < 6 ? (conflict ? 'conflict: a 12 V valve on one cell' : 'keep drawing') : conflict ? 'conflict: a 12 V valve on one cell' : 'consistent: a sipping monitor and a plugged-in waterer');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ de-power-budget */
  const AWAKE_MA = 80, PROBE_UA = 5000, SHT_UA = 0.2, REQ_DAYS = 365;      // the awake average and the probe are assumptions of the exercise
  const REGS = {
    classic: { label: 'Classic 1117-type linear (5 mA)', iq: 5000, eff: 1 },
    lowiq: { label: 'Battery-grade linear (3 µA)', iq: 3, eff: 1 },
    buck: { label: 'Step-down converter (20 µA, 90 %)', iq: 20, eff: 0.9 }
  };
  const uaText = v => (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1) + ' mA' : v >= 10 ? Math.round(v) + ' µA' : v.toFixed(1) + ' µA');

  Hyper.sim('de-power-budget', {
    title: 'Does the monitor last a year?',
    blurb: `The energy budget of the greenhouse monitor. The chip's sleep current comes from the catalogue; the rest are typical values for each choice. The awake part is taken as an average of 80 mA, an assumption of the exercise (the radio's peaks are higher). The requirement is **365 days**.

**Try this**
- Start from the defaults: a good design that still misses a year at 1.5 s awake. Shorten **Awake for** until the banner turns green; the readout gives the longest time that still meets it.
- Choose the **classic 1117-type regulator**: the battery lasts weeks, and the bars show why.
- Leave the **soil probe always powered**: another milliamps, another few weeks.
- Compare the **cells**: the energy in the cell and its self-discharge both matter.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.15 : 0.74, minH: 420, maxH: 600 });
      const chips = ['esp32-c3', 'esp32-c6', 'esp32-s3', 'esp32', 'esp32-c2'].filter(id => E.chip(id));
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(id => [E.chip(id).name.replace(/\s*\(.*\)/, ''), id]), value: chips[0] },
        { id: 'cell', type: 'select', label: 'Cell', options: E.CELLS.map(x => [x.name, x.id]), value: '18650' },
        { id: 'interval', label: 'A reading every', min: 1, max: 60, step: 1, value: 10, unit: 'min' },
        { id: 'awake', label: 'Awake for', min: 0.3, max: 6, step: 0.1, value: 1.5, unit: 's' },
        { id: 'reg', type: 'select', label: 'Regulator', options: Object.keys(REGS).map(k => [REGS[k].label, k]), value: 'lowiq' },
        { id: 'probe', type: 'select', label: 'Soil probe', options: [['always powered (5 mA)', 'always'], ['powered 0.1 s per reading', 'switched']], value: 'switched' },
        { id: 'div', type: 'select', label: 'Battery divider', options: [['2 x 1 MΩ', 'm1'], ['2 x 100 kΩ', 'k100'], ['switched off between readings', 'sw']], value: 'm1' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['sleep', 'Board asleep'], ['avg', 'Average current'], ['life', 'Battery life'], ['req', 'Against 365 days'], ['max', 'Longest awake time that meets it']]);
      function budget(v) {
        const chip = E.chip(v.chip) || {}, cell = E.CELLS.find(x => x.id === v.cell) || E.CELLS[1], reg = REGS[v.reg] || REGS.lowiq;
        const T = v.interval * 60, a = Math.min(v.awake, T);
        const parts = [
          ['Chip asleep', chip.sleepUa != null ? chip.sleepUa : 0],
          ['Regulator', reg.iq],
          ['Soil probe', v.probe === 'always' ? PROBE_UA : 0],
          ['Battery divider', v.div === 'm1' ? cell.v / 2e6 * 1e6 : v.div === 'k100' ? cell.v / 2e5 * 1e6 : 0],
          ['Humidity sensor', SHT_UA]
        ];
        const sleepUa = parts.reduce((s, p) => s + p[1], 0), sleepMa = sleepUa / 1000;
        const awakeCharge = (AWAKE_MA * a + (v.probe === 'switched' ? PROBE_UA / 1000 * 0.1 : 0)) / reg.eff;      // mA·s per cycle
        const sleepCharge = sleepMa * Math.max(0, T - a);
        const avg = (awakeCharge + sleepCharge) / T;
        const life = E.batteryLife(cell.mAh, avg, { cell });
        const needAvg = 0.8 * cell.mAh / (REQ_DAYS * 24) - cell.sd * cell.mAh / 720;
        const maxAwake = needAvg > sleepMa ? Math.min(T, (needAvg - sleepMa) * T / (AWAKE_MA / reg.eff - sleepMa)) : null;
        return { parts, sleepUa, awakeCharge, sleepCharge, avg, days: life.days, years: life.years, maxAwake, T, cell, chip };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const b = budget(ctl.values), M = 14, W = st.W - 2 * M;
        let y = 20;
        kit.label(c, 'Where the charge of one ' + (ctl.values.interval) + '-minute cycle goes', M, y, { size: 12, weight: 650, color: C.text2 });
        y += 16;
        const total = b.awakeCharge + b.sleepCharge || 1, fa = clamp(b.awakeCharge / total, 0, 1);
        c.fillStyle = C.accent; c.fillRect(M, y, W * fa, 28);
        c.fillStyle = C.warn; c.fillRect(M + W * fa, y, W * (1 - fa), 28);
        const aw = Math.round(fa * 100), sl = 100 - aw;
        if (W * fa > 70) kit.label(c, 'awake ' + aw + ' %', M + 8, y + 14, { size: 12, weight: 650, color: C.dark ? '#0d1020' : '#fff' });
        if (W * (1 - fa) > 70) kit.label(c, 'asleep ' + sl + ' %', M + W - 8, y + 14, { size: 12, weight: 650, align: 'right', color: C.dark ? '#0d1020' : '#fff' });
        y += 28 + 15;
        kit.label(c, 'awake: ' + kit.fmt(b.awakeCharge, 3) + ' mA·s', M, y, { size: 11, color: C.muted });
        kit.label(c, 'asleep: ' + kit.fmt(b.sleepCharge, 3) + ' mA·s', M + W, y, { size: 11, color: C.muted, align: 'right' });
        y += 30;
        kit.label(c, 'What the board draws asleep, part by part (log scale, 0.1 µA to 10 mA)', M, y, { size: 12, weight: 650, color: C.text2 });
        y += 22;
        const nameW = Math.min(118, W * 0.34), bx = M + nameW + 4, bwid = Math.max(40, W - nameW - 4 - 60);
        b.parts.forEach(p => {
          kit.label(c, p[0], M, y, { size: 12, color: C.text2 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, y - 7, bwid, 14);
          const f = p[1] > 0 ? clamp(Math.log10(Math.max(p[1], 0.1) / 0.1) / 5, 0.01, 1) : 0;
          c.fillStyle = p[1] >= 1000 ? C.bad : p[1] >= 50 ? C.warn : C.accent; c.fillRect(bx, y - 7, bwid * f, 14);
          kit.label(c, p[1] > 0 ? uaText(p[1]) : 'off', bx + bwid + 6, y, { size: 11.5, color: C.text });
          y += 24;
        });
        y += 6;
        kit.label(c, 'Board asleep, total: ' + uaText(b.sleepUa), M, y, { size: 12, weight: 650, color: C.text });
        y += 24;
        const ok = b.days >= REQ_DAYS, margin = Math.round((b.days / REQ_DAYS - 1) * 100);
        S.box(c, M, y, W, 46, { label: fit(c, 'Lasts ' + Math.round(b.days) + ' days, ' + (b.years >= 0.1 ? kit.fmt(b.years, 2) + ' years' : 'under a month'), W - 16, 14, 600), sub: fit(c, ok ? 'meets 365 days with a margin of ' + margin + ' %' : 'misses 365 days by ' + Math.abs(margin) + ' %', W - 16, 11), size: 14, color: ok ? C.ok : C.bad, active: true });
        ro.set('sleep', uaText(b.sleepUa) + ' (chip ' + uaText(b.parts[0][1]) + ')');
        ro.set('avg', b.avg >= 1 ? kit.fmt(b.avg, 3) + ' mA' : kit.fmt(b.avg * 1000, 3) + ' µA');
        ro.set('life', Math.round(b.days) + ' days (' + kit.fmt(b.years, 2) + ' years)');
        ro.set('req', ok ? 'met, margin ' + margin + ' %' : 'missed by ' + Math.abs(margin) + ' %');
        ro.set('max', b.maxAwake == null ? 'none: the sleep current alone is too high' : kit.fmt(b.maxAwake, 2) + ' s' + (b.maxAwake < ctl.values.awake ? ' (shorter than now)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ de-prototype-stages */
  const PSTAGES = [
    { short: 'Paper', name: 'Paper and simulation', cost: 0.1, cannot: 'anything analogue, thermal or radio' },
    { short: 'Bread', name: 'Breadboard', cost: 1, cannot: 'contact quality, noise, radio range, how it fits' },
    { short: 'Perf', name: 'Perfboard or modules on a carrier', cost: 10, cannot: 'repeatable assembly and layout effects' },
    { short: '1st PCB', name: 'First board (spin 1)', cost: 100, cannot: 'yield and the production process' },
    { short: 'Pilot', name: 'Pilot batch', cost: 1000, cannot: 'years in the field' }
  ];
  /* what each stage can tell about each question: 0 no, 1 partly, 2 yes (a judgement, not a measurement) */
  const PQS = [
    ['The program logic works', [1, 2, 2, 2, 2]],
    ['Every part talks to the chip', [0, 2, 2, 2, 2]],
    ['The sensor stays accurate for weeks', [0, 1, 2, 2, 2]],
    ['The battery lasts as budgeted', [1, 1, 2, 2, 2]],
    ['The radio reaches from the box', [0, 0, 1, 2, 2]],
    ['No noise or crosstalk from the layout', [0, 0, 0, 2, 2]],
    ['It fits the enclosure', [1, 0, 1, 2, 2]],
    ['Assembly yield and test', [0, 0, 0, 1, 2]]
  ];

  Hyper.sim('de-prototype-stages', {
    title: 'Which stage answers which question?',
    blurb: `Rows are the questions a design has to answer, columns the stages of prototyping. A filled circle means the stage can settle the question, a half circle that it can partly, an empty one that it cannot. Pick the **riskiest question** (or click a row) and the first stage that can answer it is ringed.

This is a judgement, drawn from experience and not measured. The cost bars use a rule of thumb: each stage makes a change about ten times dearer.

**Try this**
- Pick *The radio reaches from the box*: a breadboard cannot say; a first board does.
- Pick *No noise or crosstalk from the layout*: only a real board can answer, so the layout is the part you cannot test cheaply.
- Switch on **the cost of a mistake** to see why the cheap questions go first.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.15 : 0.62, minH: 420, maxH: 560 });
      let q = 4;
      const ctl = kit.controls(box.side, [
        { id: 'q', type: 'select', label: 'The riskiest question', options: PQS.map((r, i) => [r[0], i]), value: q },
        { id: 'cost', type: 'check', label: 'Show what a mistake costs', value: false }
      ], (id, v) => { if (id === 'q') q = v; loop.once(); });
      const ro = kit.readout(box.side, [['first', 'Cheapest stage that can answer it'], ['full', 'Settles it fully'], ['blind', 'That stage cannot show'], ['cost', 'A mistake found there costs']]);
      let hits = [];
      function dotAt(c, C, x, y, r, v, hot) {
        c.save();
        c.lineWidth = 1.6; c.strokeStyle = v ? (hot ? C.accent : C.text2) : C.faint;
        c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
        c.fillStyle = hot ? C.accent : C.text2;
        if (v === 2) { c.beginPath(); c.arc(x, y, r - 3, 0, Math.PI * 2); c.fill(); }
        else if (v === 1) { c.beginPath(); c.arc(x, y, r - 3, Math.PI / 2, Math.PI * 1.5); c.closePath(); c.fill(); }
        c.restore();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const M = 12, labW = Math.min(250, st.W * 0.42), x0 = M + labW, cw = (st.W - M - x0) / PSTAGES.length, rh = 27;
        let y = 24;
        PSTAGES.forEach((s, i) => kit.label(c, s.short, x0 + cw * (i + 0.5), y, { size: st.W < 560 ? 10 : 11.5, weight: 650, color: C.text2, align: 'center' }));
        y += 16;
        hits = [];
        const row = PQS[q] || PQS[0], firstAny = row[1].findIndex(v => v >= 1), firstFull = row[1].findIndex(v => v === 2);
        PQS.forEach((r, ri) => {
          const yy = y + ri * rh + rh / 2, sel = ri === q;
          if (sel) { c.fillStyle = softFill(C); c.fillRect(M - 4, yy - rh / 2 + 1, st.W - 2 * M + 8, rh - 2); }
          kit.label(c, fit(c, r[0], labW - 8, st.W < 560 ? 11 : 12), M, yy, { size: st.W < 560 ? 11 : 12, color: sel ? C.text : C.text2, weight: sel ? 650 : 500 });
          r[1].forEach((v, si) => dotAt(c, C, x0 + cw * (si + 0.5), yy, 8, v, sel && si === firstAny));
          if (sel && firstAny >= 0) { c.strokeStyle = C.accent; c.lineWidth = 2; c.setLineDash([3, 3]); c.strokeRect(x0 + cw * firstAny + 3, yy - rh / 2 + 2, cw - 6, rh - 4); c.setLineDash([]); }
          hits.push({ x: M - 4, y: yy - rh / 2, w: st.W - 2 * M + 8, h: rh, i: ri });
        });
        y += PQS.length * rh + 10;
        kit.label(c, '● settles it    ◐ partly    ○ cannot', M, y, { size: 10.5, color: C.muted });
        y += 18;
        if (ctl.values.cost) {
          kit.label(c, 'What changing your mind costs at each stage (rule of thumb, times the breadboard)', M, y, { size: 11, weight: 650, color: C.text2 });
          y += 16;
          const bh = Math.max(40, st.H - y - 16), top = Math.log10(1000 * 3), bot = Math.log10(0.05);
          PSTAGES.forEach((s, i) => {
            const f = (Math.log10(s.cost) - bot) / (top - bot), h = bh * clamp(f, 0.04, 1), x = x0 + cw * i + cw * 0.18;
            c.fillStyle = i === firstAny ? C.accent : (C.dark ? 'rgba(150,156,189,.55)' : 'rgba(110,116,150,.5)');
            c.fillRect(x, y + bh - h, cw * 0.64, h);
            kit.label(c, 'x' + (s.cost < 1 ? s.cost : s.cost), x + cw * 0.32, y + bh - h - 8, { size: 10.5, color: C.text2, align: 'center' });
          });
        }
        if (firstAny >= 0) {
          const s = PSTAGES[firstAny];
          ro.set('first', s.name + (row[1][firstAny] === 1 ? ' (partly)' : ''));
          ro.set('full', firstFull >= 0 ? PSTAGES[firstFull].name : 'no stage');
          ro.set('blind', s.cannot);
          ro.set('cost', 'about x' + s.cost + ' the breadboard');
        } else { ro.set('first', 'none'); ro.set('full', 'none'); ro.set('blind', '—'); ro.set('cost', '—'); }
      }, box.stage);
      kit.click(st, p => { const h = hits.find(t => p.x >= t.x && p.x <= t.x + t.w && p.y >= t.y && p.y <= t.y + t.h); if (h) { q = h.i; ctl.set('q', h.i); loop.once(); } },
        p => hits.some(t => p.x >= t.x && p.x <= t.x + t.w && p.y >= t.y && p.y <= t.y + t.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ de-minimal-circuit */
  const MPARTS = [
    { id: 'reg', name: 'Regulator, 3.3 V', job: 'Turns the 5 V from USB, or the cell, into 3.3 V, and must be able to give about 500 mA for the radio\'s bursts.', without: 'Nothing powers the module. A regulator that is too weak makes the chip brown out whenever the radio transmits.' },
    { id: 'bulk', name: 'C1, 10 µF bulk capacitor', job: 'A small reservoir at the module\'s supply pin: it gives the radio\'s current bursts while the regulator catches up.', without: 'The rail dips at every transmission: brownout resets, and Wi-Fi that drops out.' },
    { id: 'dec', name: 'C2, 100 nF decoupling capacitor', job: 'Supplies the fast, tiny current edges at the pin and shorts high-frequency noise on the rail to ground.', without: 'Noise on the supply: erratic readings, a radio that works on the bench and not in the field.' },
    { id: 'enr', name: 'R1, 10 kΩ pull-up on EN', job: 'Holds EN high so that the chip runs, and charges C3 so that EN rises slowly.', without: 'EN floats: the chip starts and stops at random.' },
    { id: 'enc', name: 'C3, 1 µF on EN', job: 'With R1 makes EN rise in about 10 ms, so that the chip starts only after the supply has settled.', without: 'The chip may start before 3.3 V is stable and then fail to start, on some units and not on others.' },
    { id: 'rst', name: 'SW1, reset button', job: 'Pulls EN to ground: a manual reset.', without: 'Only a power cycle resets the board. Nothing is lost in the design, only convenience.' },
    { id: 'boot', name: 'SW2, boot button', job: 'Holds the boot pin (GPIO9 on the C3) low while the chip starts: download mode, for loading a new program.', without: 'No way into download mode by hand. It has to come from a USB host or an adapter that drives EN and the boot pin.' },
    { id: 'prog', name: 'Programming path', job: 'Gets the first program in: USB straight to GPIO18 and GPIO19 on a C3, or a header (TX, RX, EN, BOOT, ground) for an adapter.', without: 'Nothing can load firmware: every board has to be programmed once before it does anything.' },
    { id: 'ant', name: 'The antenna end', job: 'The printed antenna: at the board edge with nothing near it, no copper under it and no battery beside it.', without: 'With copper or a battery near it the antenna is detuned: the radio still works, but the range can fall by half.' },
    { id: 'mod', name: 'The module', job: 'The chip with its flash, crystal and radio matching built in. It brings 3V3, ground, EN, the boot pin and the I/O.', without: 'There is no circuit without it.' }
  ];

  Hyper.sim('de-minimal-circuit', {
    title: 'The minimal circuit around a module',
    blurb: `The five jobs of the page as a schematic: power, reset, boot, programming, and a clear antenna. Hover over a part, click it, or choose it from the list: its name, its job and what happens without it appear below the drawing.

**Try this**
- Click C1 and C2 and read how they differ: one is a reservoir for the radio's bursts, the other a filter for fast edges.
- Select R1, tick **Leave it out**, and read what the chip does with a floating EN pin.
- Select the boot button: why is a button to ground enough to choose download mode?
- Click the antenna end and see why it sits at the board edge.`,
    mount(box, kit) {
      const S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.22 : 0.8, minH: 440, maxH: 640 });
      let sel = null, hov = null, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'Part', options: [['(click one in the drawing)', 'none']].concat(MPARTS.map(p => [p.name, p.id])), value: 'none' },
        { id: 'out', type: 'check', label: 'Leave it out', value: false }
      ], (id, v) => { if (id === 'part') sel = v === 'none' ? null : v; loop.once(); });
      const ro = kit.readout(box.side, [['name', 'Part'], ['job', 'Its job'], ['without', 'Without it']]);
      const hitAt = p => hits.find(h => p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const W = st.W, H = st.H, M = 10, wide = W >= 560;
        const rw = Math.max(46, Math.round(W * 0.12)), mw = Math.max(122, Math.round(W * 0.3));
        const railY = 34, gndY = H - 76;
        const xm = W - M - mw, xr0 = M + rw + 8, dx = (xm - 20 - xr0) / 5.2, col = i => Math.round(xr0 + dx * (i + 0.6));
        const mTop = 58, mBot = gndY - 52, mh = mBot - mTop, canTop = mTop + 0.24 * mh;
        const y3 = Math.round(canTop + 24), yEN = y3 + 46, yB = yEN + 46;
        const shown = hov || sel, leftOut = ctl.values.out && sel;
        const wc = { color: C.text2 }, pc = id => (id === shown ? C.accent : leftOut && id === sel ? C.bad : undefined);
        hits = [];
        const add = (id, x, y, w, h) => hits.push({ id, x, y, w, h });
        const tag = (id, text, x, y) => kit.label(c, text, x, y, { size: 10.5, color: id === shown ? C.accent : C.muted, weight: id === shown ? 650 : 500 });
        const cross = (x, y) => kit.label(c, '✕', x, y, { size: 20, color: C.bad, align: 'center', weight: 700 });
        // ground bus and the supply rail
        S.wire(c, [[M + 4, gndY], [xm + mw * 0.2, gndY]], wc);
        SC.ground(c, M + 4, gndY);
        S.wire(c, [[M + rw, railY], [xm - 10, railY]], wc);
        kit.label(c, '+3.3 V', xr0 + 4, railY - 12, { size: 10.5, color: C.muted });
        // the regulator
        S.box(c, M, railY - 22, rw, 44, { label: 'LDO', sub: '3.3 V', size: 12, color: pc('reg') || C.muted, active: shown === 'reg' });
        S.wire(c, [[M + rw / 2, railY + 22], [M + rw / 2, gndY]], wc);
        add('reg', M, railY - 22, rw, 44);
        if (leftOut && sel === 'reg') cross(M + rw / 2, railY);
        // the two capacitors at the supply
        [['bulk', 0, 'C1', '10 µF'], ['dec', 1, 'C2', '100 nF']].forEach(([id, i, nm, val]) => {
          const x = col(i), my = Math.round((railY + gndY) / 2);
          SC.capacitor(c, x, railY, x, gndY, { color: pc(id) });
          SC.node(c, x, railY); SC.node(c, x, gndY);
          tag(id, wide ? nm + ' ' + val : nm, x + 12, my);
          add(id, x - 14, my - 26, 28, 52);
          if (leftOut && sel === id) cross(x, my);
        });
        // the EN network and the reset button
        const cr = col(2), cs1 = col(3), cs2 = col(4);
        SC.resistor(c, cr, railY, cr, yEN, { color: pc('enr') });
        SC.capacitor(c, cr, yEN, cr, gndY, { color: pc('enc') });
        SC.node(c, cr, railY); SC.node(c, cr, yEN); SC.node(c, cr, gndY);
        S.wire(c, [[cr, yEN], [xm, yEN]], wc);
        const myR = Math.round((railY + yEN) / 2), myC = Math.round((yEN + gndY) / 2), myB = Math.round((yB + gndY) / 2);
        tag('enr', wide ? 'R1 10 kΩ' : 'R1', cr + 12, myR); add('enr', cr - 14, myR - 26, 28, 52);
        tag('enc', wide ? 'C3 1 µF' : 'C3', cr + 12, myC); add('enc', cr - 14, myC - 26, 28, 52);
        if (leftOut && sel === 'enr') cross(cr, myR);
        if (leftOut && sel === 'enc') cross(cr, myC);
        SC.switch(c, cs1, yEN, cs1, gndY, { closed: false, color: pc('rst') });
        SC.node(c, cs1, yEN); SC.node(c, cs1, gndY);
        tag('rst', 'SW1', cs1 + 10, myC); add('rst', cs1 - 12, myC - 26, 24, 52);
        if (leftOut && sel === 'rst') cross(cs1, myC);
        // the boot button
        S.wire(c, [[xm, yB], [cs2, yB]], wc);
        SC.switch(c, cs2, yB, cs2, gndY, { closed: false, color: pc('boot') });
        SC.node(c, cs2, yB); SC.node(c, cs2, gndY);
        tag('boot', 'SW2', cs2 + 10, myB); add('boot', cs2 - 12, myB - 26, 24, 52);
        if (leftOut && sel === 'boot') cross(cs2, myB);
        // the module, its pins and the board edge
        S.wire(c, [[xm, y3], [xm - 10, y3], [xm - 10, railY]], wc);
        SC.node(c, xm - 10, railY);
        S.wire(c, [[xm + mw * 0.2, mBot], [xm + mw * 0.2, gndY]], wc);
        SC.node(c, xm + mw * 0.2, gndY);
        S.module(c, xm, mTop, mw, mh, { label: 'ESP32-C3-MINI-1', antenna: 'pcb' });
        const dark = '#2a2f3a';
        [[y3, '3V3'], [yEN, 'EN'], [yB, 'IO9']].forEach(([y, t]) => { SC.node(c, xm, y, { r: 2.6 }); kit.label(c, t, xm + 8, y, { size: 9.5, color: dark, weight: 650 }); });
        ['TX', 'RX', 'D−', 'D+'].forEach((t, i) => { const y = Math.round(canTop + 24 + i * 22); SC.node(c, xm + mw, y, { r: 2.6 }); kit.label(c, t, xm + mw - 8, y, { size: 9.5, color: dark, weight: 650, align: 'right' }); });
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(xm - 14, mTop - 3); c.lineTo(xm + mw + 6, mTop - 3); c.stroke(); c.restore();
        kit.label(c, 'board edge', xm + mw / 2, mTop - 12, { size: 10, color: C.faint, align: 'center' });
        // the programming path
        const xp = xm + Math.round(mw * 0.4), wp = xm + mw - xp;
        S.wire(c, [[xm + mw * 0.7, mBot], [xm + mw * 0.7, gndY - 44]], wc);
        S.box(c, xp, gndY - 44, wp, 28, { label: fit(c, wide ? 'USB or UART header' : 'USB / header', wp - 8, 11, 600), size: 11, color: pc('prog') || C.muted, active: shown === 'prog' });
        add('prog', xp, gndY - 44, wp, 28);
        if (leftOut && sel === 'prog') cross(xp + wp / 2, gndY - 30);
        // the module and its antenna end last, so that the small parts are found first
        add('ant', xm, mTop, mw, Math.round(0.24 * mh));
        add('mod', xm, canTop, mw, mBot - canTop);
        // the lit part
        const lit = hits.find(h => h.id === shown);
        if (lit) { c.save(); c.fillStyle = softFill(C); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.setLineDash([4, 3]); c.fillRect(lit.x - 2, lit.y - 2, lit.w + 4, lit.h + 4); c.strokeRect(lit.x - 2, lit.y - 2, lit.w + 4, lit.h + 4); c.restore(); }
        // the text under the drawing
        const P = MPARTS.find(p => p.id === shown);
        if (P) {
          kit.label(c, P.name, M, H - 58, { size: 12, weight: 650, color: C.text });
          if (leftOut && sel === P.id) paragraph(kit, c, 'Without it: ' + P.without, M, H - 41, W - 2 * M, 11.5, { color: C.bad, lh: 15 });
          else paragraph(kit, c, P.job, M, H - 41, W - 2 * M, 11.5, { color: C.text2, lh: 15 });
        } else paragraph(kit, c, 'Hover over a part, or click it, to see its job. Tick "Leave it out" to see what fails.', M, H - 50, W - 2 * M, 11.5, { color: C.muted, lh: 15 });
        ro.set('name', P ? P.name : 'click a part');
        ro.set('job', P ? P.job : '—');
        ro.set('without', P ? P.without : '—');
      }, box.stage);
      kit.click(st, p => { const h = hitAt(p); sel = h ? h.id : null; ctl.set('part', sel || 'none'); loop.once(); }, p => !!hitAt(p));
      st.canvas.addEventListener('pointermove', e => { const h = hitAt(st.pos(e)), id = h ? h.id : null; if (id !== hov) { hov = id; loop.once(); } });
      st.canvas.addEventListener('pointerleave', () => { if (hov) { hov = null; loop.once(); } });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ de-schematic-review */
  const FLAWS = [
    { n: 1, name: 'EN left floating', why: 'EN has no pull-up and no capacitor: the pin floats, so the chip may reset at random. Add 10 kΩ to 3.3 V and 1 µF to ground.' },
    { n: 2, name: 'No capacitor at the 3V3 pin', why: 'There is no capacitor at the module\'s supply pin: the radio\'s bursts pull the rail down. Add 10 µF and 100 nF right at the pin.' },
    { n: 3, name: 'I2C without pull-ups', why: 'I2C lines need pull-up resistors (about 4.7 kΩ to 3.3 V); neither the module nor the sensor board provides them here, so the bus cannot work.' },
    { n: 4, name: 'LED without a resistor', why: 'An LED wired straight from the pin to ground has nothing to limit its current. Add a series resistor (a few hundred ohms).' },
    { n: 5, name: '5 V into an ADC pin', why: 'The probe puts out up to 5 V, and the ADC pin may not see more than 3.3 V. Use a divider, or a probe that works from 3.3 V.' },
    { n: 6, name: 'Button on a strapping pin without a pull-up', why: 'GPIO2 is a strapping pin that must be high at reset, and a button to ground leaves it floating while released. Add a 10 kΩ pull-up to 3.3 V.' }
  ];
  const DECOYS = {
    supply: 'That is fine: a 3.3 V supply. What is missing is the capacitor beside the pin it feeds.',
    module: 'That is fine: the module itself. Look at what is wired to its pins.',
    sht: 'That is fine: the sensor board. The problem, if any, is on the wires to it.'
  };

  Hyper.sim('de-schematic-review', {
    title: 'Find the six mistakes',
    blurb: `A first draft of the greenhouse monitor's schematic, with six mistakes planted in it of the kinds the page lists. Click where you think one is. A real mistake is circled and explained; a click on a part that is fine counts as a false alarm.

**Try this**
- Look first at the pins of the module, then at what is wired to each: what does each pin need that is not drawn?
- Use **Give me a hint** once you are stuck: it ringed the next mistake, without naming it.
- **Show all six** to read every explanation, then **Start again**.
- None of these would be found by an electrical rules check; each is a missing idea, not a wrong connection.`,
    mount(box, kit) {
      const S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.12 : 0.72, minH: 430, maxH: 620 });
      let found = new Set(), fake = 0, last = null, hint = 0, hits = [];
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'hint', label: 'Give me a hint', primary: true }, { id: 'all', label: 'Show all six' }, { id: 'again', label: 'Start again' }] }
      ], id => {
        if (id === 'hint') { const f = FLAWS.find(x => !found.has(x.n)); hint = f ? f.n : 0; }
        else if (id === 'all') { FLAWS.forEach(f => found.add(f.n)); hint = 0; last = { text: 'All six are shown. Read each, then start again and look for them without help.' }; }
        else { found = new Set(); fake = 0; last = null; hint = 0; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['found', 'Mistakes found'], ['fake', 'False alarms'], ['last', 'What you clicked']]);
      const hitAt = p => hits.find(h => p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const W = st.W, M = 10, wc = { color: C.text2 };
        const wm = Math.max(116, Math.round(W * 0.28)), xm = Math.round(W * 0.38), ym = 56, xr = xm + wm;
        const y3 = ym + 30, yEN = ym + 76, y2 = ym + 122, ySDA = ym + 30, ySCL = ym + 60, yADC = ym + 122, yLED = ym + 182;
        const hm = 226, xt = W - M - 86, xp = xt;
        hits = [];
        const flawBox = (n, x, y, w, h) => hits.push({ flaw: n, x, y, w, h });
        const decoy = (k, x, y, w, h) => hits.push({ decoy: k, x, y, w, h });
        // the module and its pins
        kit.label(c, 'ESP32-C3 module', xm + wm / 2, ym - 14, { size: 11.5, weight: 650, color: C.text2, align: 'center' });
        S.box(c, xm, ym, wm, hm, { color: C.muted });
        [[y3, '3V3'], [yEN, 'EN'], [y2, 'GPIO2']].forEach(([y, t]) => { SC.node(c, xm, y, { r: 2.6 }); kit.label(c, t, xm + 7, y, { size: 10, color: C.text2 }); });
        [[ySDA, 'SDA 6'], [ySCL, 'SCL 7'], [yADC, 'ADC 3'], [yLED, 'LED 5']].forEach(([y, t]) => { SC.node(c, xr, y, { r: 2.6 }); kit.label(c, t, xr - 7, y, { size: 10, color: C.text2, align: 'right' }); });
        decoy('module', xm, ym, wm, hm);
        // the supply, straight to the pin
        const sw = Math.max(60, xm - 50 - M);
        S.box(c, M, y3 - 18, sw, 36, { label: '3.3 V supply', size: 11, color: C.muted });
        S.wire(c, [[M + sw, y3], [xm, y3]], wc);
        decoy('supply', M, y3 - 18, sw, 36);
        flawBox(2, xm - 46, y3 - 18, 46, 36);
        // EN, left open
        S.wire(c, [[xm, yEN], [xm - 28, yEN]], wc);
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 2; c.beginPath(); c.arc(xm - 32, yEN, 3.6, 0, Math.PI * 2); c.stroke(); c.restore();
        flawBox(1, xm - 48, yEN - 14, 48, 28);
        // GPIO2 to a button, no pull-up
        const bx = xm - 36;
        S.wire(c, [[xm, y2], [bx, y2]], wc);
        SC.node(c, bx, y2);
        SC.switch(c, bx, y2, bx, y2 + 50, { closed: false });
        SC.ground(c, bx, y2 + 50);
        flawBox(6, bx - 20, y2 + 4, 40, 52);
        // I2C straight to the sensor
        S.tile(c, xt, ym, 86, 90, { label: 'SHT3x', sub: 'I2C sensor', color: 'blue', pins: ['SDA', 'SCL'], side: 'left' });
        S.wire(c, [[xr, ySDA], [xt + 4, ySDA]], wc);
        S.wire(c, [[xr, ySCL], [xt + 4, ySCL]], wc);
        decoy('sht', xt, ym, 86, 90);
        flawBox(3, xr + 2, ySDA - 12, xt - xr - 4, ySCL - ySDA + 24);
        // the probe, 5 V out
        S.box(c, xp, ym + 100, 86, 44, { label: 'Soil probe', sub: '0 to 5 V out', size: 11, color: C.muted });
        S.wire(c, [[xr, yADC], [xp, yADC]], wc);
        flawBox(5, xr + 2, ym + 100, xp + 86 - xr - 2, 44);
        // the LED, straight from the pin
        const lx1 = xr + 26, lx2 = lx1 + 48;
        S.wire(c, [[xr, yLED], [lx1, yLED]], wc);
        SC.diode(c, lx1, yLED, lx2, yLED, { kind: 'led' });
        S.wire(c, [[lx2, yLED], [lx2, yLED + 24]], wc);
        SC.ground(c, lx2, yLED + 24);
        flawBox(4, xr + 8, yLED - 18, lx2 - xr + 14, 36);
        // the markers: found, and the hint
        const centre = f => { const h = hits.find(t => t.flaw === f); return [h.x + h.w / 2, h.y + h.h / 2, h]; };
        FLAWS.forEach(f => {
          const [cx, cy, h] = centre(f.n);
          if (found.has(f.n)) {
            c.save(); c.strokeStyle = C.ok; c.lineWidth = 2.2; c.beginPath(); c.arc(cx, cy, Math.max(h.w, h.h) / 2 + 3, 0, Math.PI * 2); c.stroke(); c.restore();
            S.box(c, cx - 9, h.y - 22, 18, 18, { label: String(f.n), size: 11, r: 9, color: C.ok, active: true });
          } else if (hint === f.n) {
            c.save(); c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.arc(cx, cy, Math.max(h.w, h.h) / 2 + 6, 0, Math.PI * 2); c.stroke(); c.restore();
          }
        });
        // the text below
        let y = ym + hm + 26;
        kit.label(c, 'Click where you see a mistake.', M, y, { size: 12, weight: 650, color: C.text2 });
        y += 20;
        if (last) paragraph(kit, c, last.text, M, y, W - 2 * M, 12, { color: last.bad ? C.warn : C.text, lh: 17 });
        ro.set('found', found.size + ' of 6');
        ro.set('fake', String(fake));
        ro.set('last', last ? last.text : '—');
      }, box.stage);
      kit.click(st, p => {
        const h = hitAt(p);
        if (!h) { last = null; loop.once(); return; }
        if (h.flaw) {
          const f = FLAWS.find(x => x.n === h.flaw);
          found.add(f.n); if (hint === f.n) hint = 0;
          last = { text: f.n + '. ' + f.name + ': ' + f.why };
        } else { fake++; last = { text: DECOYS[h.decoy], bad: true }; }
        loop.once();
      }, p => !!hitAt(p));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ de-pcb-layout */
  const BW = 60, BH = 40;                                  // the board, in millimetres
  const LPARTS = [
    { id: 'mod', name: 'Module', w: 13.2, h: 16.6, min: 0 },
    { id: 'reg', name: 'LDO', w: 6.5, h: 7 },
    { id: 'c1', name: 'C1', w: 4, h: 2.8 },
    { id: 'c2', name: 'C2', w: 2.2, h: 1.4 },
    { id: 'usb', name: 'USB-C', w: 9, h: 7.5 },
    { id: 'bat', name: 'Battery', w: 8, h: 6 },
    { id: 'probe', name: 'Probe', w: 8, h: 3.5 },
    { id: 'temp', name: 'T sensor', w: 3.2, h: 3.2 },
    { id: 'btn', name: 'Button', w: 6, h: 6 }
  ];
  /* centres in millimetres: a careless first try, and a layout that meets every rule */
  const LAYOUT_POOR = { mod: [30, 24], reg: [34, 31], c1: [46, 8], c2: [10, 8], usb: [50, 22], bat: [22, 12], probe: [36, 38], temp: [36, 33], btn: [6, 8] };
  const LAYOUT_GOOD = { mod: [30, 8.3], reg: [13, 14], c1: [19.5, 14.5], c2: [21.4, 12.5], usb: [30, 36], bat: [52, 30], probe: [52, 12], temp: [50, 22], btn: [8, 34] };

  Hyper.sim('de-pcb-layout', {
    title: 'Place the parts, then route',
    blurb: `A 60 by 40 mm board with the parts of the monitor. **Drag** each part; the rules below the board turn green as the placement improves. The rules are the common ones of the page, with illustrative distances: for a real board use your module's own drawing.

**Try this**
- Start from the careless layout and fix the rules one at a time. Begin with the module: its antenna end belongs at the top edge, hanging over it if you like.
- Move the battery connector into the keep-out (the red box) and watch two rules fail.
- Put C2, the 100 nF capacitor, a centimetre from the supply pin: the board still works on paper, and fails in the field.
- Tick **ground pour also under the antenna**: copper under the antenna is a fault, not a bonus.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.3 : 0.86, minH: 480, maxH: 700 });
      const pos = {};
      const reset = L => { for (const p of LPARTS) pos[p.id] = L[p.id].slice(); };
      reset(LAYOUT_POOR);
      const ctl = kit.controls(box.side, [
        { id: 'pour', type: 'check', label: 'Ground pour also under the antenna', value: false },
        { type: 'buttons', items: [{ id: 'good', label: 'A good layout', primary: true }, { id: 'poor', label: 'The careless layout' }] }
      ], id => { if (id === 'good') reset(LAYOUT_GOOD); else if (id === 'poor') reset(LAYOUT_POOR); loop.once(); });
      const ro = kit.readout(box.side, [['met', 'Rules met'], ['first', 'First rule still failing'], ['edge', 'Antenna end']]);
      const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      const get = id => LPARTS.find(p => p.id === id);
      function check() {
        const m = LPARTS[0], mc = pos.mod, mh = m.h, left = mc[0] - m.w / 2, right = mc[0] + m.w / 2, top = mc[1] - mh / 2;
        const antH = 0.24 * mh, P = [left, top + 0.75 * mh], antC = [mc[0], top + antH / 2];
        const zone = { x0: left - 4, x1: right + 4, y1: top + antH + 4 };
        const inZone = id => { const q = pos[id]; return q[0] >= zone.x0 && q[0] <= zone.x1 && q[1] <= zone.y1; };
        const others = LPARTS.filter(p => p.id !== 'mod').map(p => p.id);
        const edgeD = id => { const q = pos[id], p = get(id); return Math.min(q[0] - p.w / 2, BW - q[0] - p.w / 2, q[1] - p.h / 2, BH - q[1] - p.h / 2); };
        const inside = others.filter(inZone);
        return {
          zone, P, top,
          rules: [
            ['Antenna end at the board edge', top <= 0.5, ['mod']],
            ['Nothing inside the antenna keep-out', inside.length === 0, inside],
            ['C2 (100 nF) within 5 mm of the supply pin', dist(pos.c2, P) <= 5, ['c2']],
            ['C1 (10 µF) within 10 mm of the supply pin', dist(pos.c1, P) <= 10, ['c1']],
            ['Regulator within 22 mm of the module', dist(pos.reg, mc) <= 22, ['reg']],
            ['USB connector at a board edge', edgeD('usb') <= 1.6, ['usb']],
            ['Battery connector 12 mm or more from the antenna', dist(pos.bat, antC) >= 12, ['bat']],
            ['Probe input and T sensor 12 mm from the regulator', dist(pos.probe, pos.reg) >= 12 && dist(pos.temp, pos.reg) >= 12, ['probe', 'temp', 'reg']],
            ['No ground pour under the antenna', !ctl.values.pour, []]
          ]
        };
      }
      let hits = [], geo = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const W = st.W, M = 12, rowH = 16, listH = 9 * rowH;
        const s = Math.max(2, Math.min((W - 2 * M) / BW, (st.H - 8 - 14 - listH - 18) / (BH + 6.5)));
        const bx0 = Math.round((W - BW * s) / 2), by0 = Math.round(8 + 6.5 * s);
        geo = { s, bx0, by0 };
        const X = mm => bx0 + mm * s, Y = mm => by0 + mm * s;
        const R = check();
        // the board
        c.save();
        c.fillStyle = C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.6;
        c.fillRect(bx0, by0, BW * s, BH * s); c.strokeRect(bx0, by0, BW * s, BH * s);
        // the ground pour on the bottom layer, with a cut-out under the antenna unless it is ticked
        c.fillStyle = C.dark ? 'rgba(224,160,48,.10)' : 'rgba(224,160,48,.16)';
        if (ctl.values.pour) c.fillRect(bx0 + 1, by0 + 1, BW * s - 2, BH * s - 2);
        else {
          const zx0 = clamp(X(R.zone.x0), bx0 + 1, bx0 + BW * s), zx1 = clamp(X(R.zone.x1), bx0 + 1, bx0 + BW * s), zy1 = clamp(Y(R.zone.y1), by0 + 1, by0 + BH * s);
          c.fillRect(bx0 + 1, zy1, BW * s - 2, BH * s - 2 - (zy1 - by0));
          c.fillRect(bx0 + 1, by0 + 1, Math.max(0, zx0 - bx0 - 1), zy1 - by0 - 1);
          c.fillRect(zx1, by0 + 1, Math.max(0, bx0 + BW * s - 1 - zx1), zy1 - by0 - 1);
        }
        c.restore();
        // the keep-out
        c.save(); c.strokeStyle = C.bad; c.fillStyle = C.dark ? 'rgba(229,72,77,.10)' : 'rgba(229,72,77,.08)'; c.lineWidth = 1.4; c.setLineDash([5, 4]);
        const kx0 = X(R.zone.x0), kx1 = X(R.zone.x1), ky0 = Y(-6.5), ky1 = Y(R.zone.y1);
        c.fillRect(kx0, ky0, kx1 - kx0, ky1 - ky0); c.strokeRect(kx0, ky0, kx1 - kx0, ky1 - ky0); c.restore();
        kit.label(c, 'keep clear', kx0 + 4, ky0 + 9, { size: 9.5, color: C.bad });
        kit.label(c, 'board edge', bx0 + BW * s - 4, by0 - 7, { size: 9.5, color: C.faint, align: 'right' });
        // the parts; any in a failing rule are red
        const bad = new Set(); R.rules.forEach(r => { if (!r[1]) r[2].forEach(id => bad.add(id)); });
        hits = [];
        LPARTS.forEach(p => {
          const q = pos[p.id], w = Math.max(p.w * s, 22), h = Math.max(p.h * s, 14), x = X(q[0]) - w / 2, y = Y(q[1]) - h / 2;
          if (p.id === 'mod') S.module(c, x, y, w, h, { label: 'C3-MINI', antenna: 'pcb' });
          else S.box(c, x, y, w, h, { label: fit(c, p.name, w - 4, 9.5, 600), size: 9.5, r: 3, color: bad.has(p.id) ? C.bad : C.muted, active: bad.has(p.id) });
          if (p.id === 'mod' && bad.has('mod')) { c.save(); c.strokeStyle = C.bad; c.lineWidth = 2; c.strokeRect(x, y, w, h); c.restore(); }
          hits.push({ i: p.id, x: Math.min(x, X(q[0]) - 12), y: Math.min(y, Y(q[1]) - 10), w: Math.max(w, 24), h: Math.max(h, 20) });
        });
        // the supply pin of the module
        c.fillStyle = C.accent; c.beginPath(); c.arc(X(R.P[0]), Y(R.P[1]), 3, 0, Math.PI * 2); c.fill();
        // the rules
        let y = by0 + BH * s + 24;
        let met = 0, firstBad = null;
        R.rules.forEach(r => {
          if (r[1]) met++; else if (!firstBad) firstBad = r[0];
          kit.label(c, r[1] ? '✓' : '✗', M, y, { size: 13, weight: 700, color: r[1] ? C.ok : C.bad });
          kit.label(c, fit(c, r[0], W - 2 * M - 22, 11.5), M + 20, y, { size: 11.5, color: r[1] ? C.text2 : C.text });
          y += rowH;
        });
        ro.set('met', met + ' of 9');
        ro.set('first', firstBad || 'none: every rule is met');
        const o = -R.top;
        ro.set('edge', R.top <= 0.5 ? (o > 0.5 ? 'overhangs the edge by ' + kit.fmt(o, 2) + ' mm' : 'flush with the edge') : kit.fmt(R.top, 3) + ' mm in from the edge');
      }, box.stage);
      let grab = null;
      kit.drag(st, {
        hover: true,
        hit(p) { for (let k = hits.length - 1; k >= 0; k--) { const h = hits[k]; if (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h) return h.i; } return null; },
        start(id, p) { const q = pos[id]; grab = [q[0] - (p.x - geo.bx0) / geo.s, q[1] - (p.y - geo.by0) / geo.s]; },
        move(id, p) {
          if (!grab || !geo) return;
          const pt = get(id), lo = id === 'mod' ? 2 : 1;
          pos[id] = [clamp((p.x - geo.bx0) / geo.s + grab[0], 1, BW - 1), clamp((p.y - geo.by0) / geo.s + grab[1], lo, BH - 1)];
          loop.once();
        },
        end() { grab = null; loop.once(); }
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ de-cost-stack */
  /* the costs are invented units (cu): they show shapes, not prices */
  const ROUTES = {
    module: { name: 'Module (ESP32-C3-MINI-1)',
      items: [['Radio module', 20], ['Other parts', 18], ['Circuit board', 5], ['Assembly', 6], ['Test', 3], ['Enclosure and packaging', 10]],
      fixed: 7900 },
    chip: { name: 'Bare chip (ESP32-C3FH4)',
      items: [['Chip', 10], ['Crystal and RF parts', 4], ['Circuit board, four layers', 8], ['Other parts', 18], ['Assembly', 7], ['Test, with radio', 3.5], ['Enclosure and packaging', 10]],
      fixed: 15900 }
  };
  const FIXED_NOTE = { module: 'design 4000, box 800, jig 600, EMC and safety tests 2500', chip: 'design 4000, RF layout 1500, box 800, jig 600, radio, EMC and safety tests 9000' };
  const buildCost = r => r.items.reduce((s, i) => s + i[1], 0);

  Hyper.sim('de-cost-stack', {
    title: 'What does one unit cost?',
    blurb: `The cost of one greenhouse monitor, stacked, for a module or a bare chip, against the number made. The figures are **invented cost units** (cu), chosen to show the shapes: replace them with your own quotes. The curve is the formula of the page, u = b + F / Q, for both routes; where the lines cross is the quantity at which the chip route starts to pay.

**Try this**
- At 50 units the one-off costs dwarf the parts: the hatched slice is most of the bar.
- Move to 100 000: the one-off slice vanishes and only the parts and the build are left.
- Compare the routes at 500 units, then at 20 000: the module wins first, the chip later.
- Tick **the first RF board needs a second spin**: the crossover moves up by thousands of units.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.0 : 0.62, minH: 380, maxH: 520 });
      const cross = params && params.view === 'crossover';
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Units made', min: 10, max: 100000, value: cross ? 5000 : 500, log: true, sig: 2, fmt: v => kit.fmt(Math.round(v), 3) },
        { id: 'route', type: 'select', label: 'Route', options: [[ROUTES.module.name, 'module'], [ROUTES.chip.name, 'chip']], value: cross ? 'chip' : 'module' },
        { id: 'spin', type: 'check', label: 'The first RF board needs a second spin', value: false }
      ], () => { draw(); loop.once(); });
      const ro = kit.readout(box.side, [['u', 'Cost of one unit'], ['b', 'Build cost per unit'], ['f', 'One-off cost per unit'], ['both', 'Module and chip'], ['x', 'Crossover']]);
      const plot = kit.plot(box.side, {}, 230);
      const fixedOf = (id, spin) => ROUTES[id].fixed + (id === 'chip' && spin ? 6000 : 0);
      const unitCost = (id, Q, spin) => buildCost(ROUTES[id]) + fixedOf(id, spin) / Q;
      function crossover(spin) {
        const db = buildCost(ROUTES.module) - buildCost(ROUTES.chip), dF = fixedOf('chip', spin) - fixedOf('module', spin);
        return db > 0 ? dF / db : null;
      }
      function draw() {
        const Q = Math.max(1, ctl.values.Q), spin = ctl.values.spin, qx = crossover(spin);
        const pts = id => { const a = []; for (let k = 0; k <= 60; k++) { const q = 10 * Math.pow(10000, k / 60); a.push([q, unitCost(id, q, spin)]); } return a; };
        plot.set({
          series: [{ pts: pts('module'), label: 'Module' }, { pts: pts('chip'), label: 'Bare chip' }],
          x: { label: 'Units made', min: 10, max: 100000, log: true }, y: { label: 'Cost of one unit (cu)', min: 40, max: 2000, log: true },
          marks: [{ x: Q, y: unitCost(ctl.values.route, Q, spin), label: 'you' }],
          vlines: qx && qx >= 10 && qx <= 100000 ? [{ x: qx, label: 'crossover' }] : []
        });
        const um = unitCost('module', Q, spin), uc = unitCost('chip', Q, spin), id = ctl.values.route, r = ROUTES[id];
        ro.set('u', kit.fmt(unitCost(id, Q, spin), 4) + ' cu');
        ro.set('b', kit.fmt(buildCost(r), 4) + ' cu');
        ro.set('f', kit.fmt(fixedOf(id, spin) / Q, 4) + ' cu (' + kit.fmt(fixedOf(id, spin), 4) + ' over ' + kit.fmt(Math.round(Q), 4) + ')');
        ro.set('both', kit.fmt(um, 4) + ' · ' + kit.fmt(uc, 4) + ' cu: ' + (um <= uc ? 'the module is cheaper here' : 'the chip is cheaper here'));
        ro.set('x', qx ? 'about ' + kit.fmt(Math.round(qx), 3) + ' units' : 'none');
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const Q = Math.max(1, ctl.values.Q), spin = ctl.values.spin, id = ctl.values.route, r = ROUTES[id];
        const M = 14, W = st.W - 2 * M;
        const fx = fixedOf(id, spin) / Q, total = buildCost(r) + fx;
        let y = 20;
        kit.label(c, r.name + ', ' + kit.fmt(Math.round(Q), 3) + ' units: ' + kit.fmt(total, 4) + ' cu each', M, y, { size: 12.5, weight: 650, color: C.text });
        y += 14;
        // the stacked bar
        const cols = (i) => (C.series ? C.series[i % C.series.length] : C.accent);
        let x = M;
        r.items.forEach((it, i) => { const w = W * it[1] / total; c.fillStyle = cols(i); c.fillRect(x, y, Math.max(0, w), 32); x += w; });
        const fw = W * fx / total;
        c.fillStyle = C.warn; c.fillRect(x, y, Math.max(0, fw), 32);
        c.save(); c.strokeStyle = C.dark ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.6)'; c.lineWidth = 1.5; c.beginPath();
        for (let hx = x - 32; hx < x + fw; hx += 7) { c.moveTo(Math.max(x, hx), y + (hx < x ? x - hx : 0)); c.lineTo(Math.min(x + fw, hx + 32), y + 32 - (hx + 32 > x + fw ? hx + 32 - (x + fw) : 0)); }
        c.stroke(); c.restore();
        y += 32 + 22;
        // the legend: each slice with its value and its share
        const nameW = Math.min(190, W * 0.52), bx = M + 18 + nameW, bw = Math.max(30, W - nameW - 18 - 56);
        const rows = r.items.map((it, i) => [it[0], it[1], cols(i)]).concat([['One-off costs, spread', fx, C.warn]]);
        rows.forEach(row => {
          c.fillStyle = row[2]; c.fillRect(M, y - 6, 12, 12);
          kit.label(c, fit(c, row[0], nameW - 4, 11.5), M + 18, y, { size: 11.5, color: C.text2 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, y - 5, bw, 10);
          c.fillStyle = row[2]; c.fillRect(bx, y - 5, bw * clamp(row[1] / total, 0, 1), 10);
          kit.label(c, kit.fmt(row[1], 3), bx + bw + 6, y, { size: 11, color: C.text });
          y += 20;
        });
        y += 6;
        paragraph(kit, c, 'One-off costs: ' + FIXED_NOTE[id] + (id === 'chip' && spin ? ', a second RF spin 6000' : '') + '. Invented units.', M, y, W, 10.5, { color: C.muted, lh: 14 });
      }, box.stage);
      st.onResize(() => loop.once());
      draw(); loop.once();
    }
  });
})();
