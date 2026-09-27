/* HYPER-PNEUMATICS · sims/sequences-safety.js — sequences, safety circuits, safety and maintenance.
 *   seq-step-diagram  a displacement–step (or –time) diagram builder: type or pick a sequence; the motion, the limit-valve
 *                     signals and the pilot signals of a plain limit-valve circuit draw themselves; overlaps, moves started at
 *                     the wrong time, repeated states, cascade groups and sequencer modules are found and flagged
 *   seq-cascade       the two-group cascade for A+ B+ B− A−, running (or pausing) step by step: group lines, cascade valve,
 *                     limit valves and start drawn in ISO 1219 symbols; cylinders simulated by kit.fluid.pneuCylinder
 *   seq-overlap       the same machine piped three ways: limit valves straight to the pilots (it jams), one-way rollers
 *                     (it runs while their pulses are long enough) and the cascade (it runs)
 *   seq-two-hand      a two-hand control block (type IIIA idea): both hands within 0.5 s, release either and the ram returns;
 *                     the stopping time is measured and the ISO 13855 distance S = K·T + C computed
 *   seq-estop         a vertical axis with a 5/3 valve (closed, exhaust or pressure centre), pilot-operated check valves and a
 *                     soft-start / dump valve: an emergency stop mid-lift, and restoring air with and without soft start
 *   seq-silencer      exhaust noise with and without a silencer: level while exhausting, equivalent level, daily exposure,
 *                     safe time, and the price of a silencer in exhaust flow (and of a clogged one)
 *   seq-trouble       a troubleshooting quiz: a cylinder circuit with a hidden fault; read the symptoms, click the culprit
 *
 * The pneumatic models: kit.fluid.pneuCylinder where a cylinder is driven by a 5/2 valve; for the 5/3 valve with its centre
 * positions, check valves and a supply that can be dumped and soft-started (seq-estop) and for the faults of seq-trouble
 * (leaks across the piston and at a fitting, a clogged filter) the same adiabatic chamber balance and ISO 6358 flows
 * (kit.fluid.iso6358) are written out here.
 */
(function () {
  'use strict';
  const PATM = 1.013e5, PREF = 1e5, RG = 287.058, TA = 293.15, GAM = 1.4, G0 = 9.81;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const MINUS = '−';

  /* ---------------------------------------------------------------- drawing on a design grid */
  function grid(st, W0, H0) { const k = Math.min(st.W / W0, st.H / H0); return { k, ox: (st.W - W0 * k) / 2, oy: (st.H - H0 * k) / 2 }; }
  function enter(c, g) { c.save(); c.translate(g.ox, g.oy); c.scale(g.k, g.k); }
  const toGrid = (g, p) => ({ x: (p.x - g.ox) / g.k, y: (p.y - g.oy) / g.k });
  // a line coloured by the gauge pressure it carries (Pa): live air, air still exhausting, or empty
  const lineState = (p, live) => p > 0.35e5 ? (live ? 'air' : 'exhaust') : 'idle';
  // signed mass flow (kg/s) through sonic conductance C (m³/(s·Pa)) between absolute pressures, ISO 6358
  function mflow(F, C, pFrom, pTo, b) {
    if (!(C > 0)) return 0;
    if (pFrom >= pTo) return F.iso6358({ C, b: b || 0.3, p1: pFrom, p2: pTo }).mdot;
    return -F.iso6358({ C, b: b || 0.3, p1: pTo, p2: pFrom }).mdot;
  }
  const series = (...cs) => 1 / Math.sqrt(cs.reduce((s, c) => s + 1 / (c * c), 0));

  /* ---------------------------------------------------------------- sequences: parsing and analysis */
  function parseSeq(text) {
    const moves = [], re = /([A-Da-d])\s*([+\-−–])/g;
    let m;
    while ((m = re.exec(String(text || ''))) && moves.length < 16) moves.push({ c: m[1].toUpperCase(), d: m[2] === '+' ? 1 : 0 });
    const cyls = [...new Set(moves.map(x => x.c))].sort();
    const pos = {}; cyls.forEach(c => { pos[c] = 0; });
    if (moves.length < 2) return { moves, cyls, error: 'Type a sequence such as A+ B+ B' + MINUS + ' A' + MINUS + ', or use the buttons.' };
    for (const mv of moves) {
      if (pos[mv.c] === mv.d) return { moves, cyls, error: mvName(mv) + ' comes when ' + mv.c + ' is already ' + (mv.d ? 'extended' : 'retracted') + '.' };
      pos[mv.c] = mv.d;
    }
    for (const c of cyls) if (pos[c]) return { moves, cyls, error: c + ' ends extended: add ' + c + MINUS + ' so that every cylinder is back at the end of the cycle.', partial: true };
    return { moves, cyls };
  }
  const mvName = mv => mv.c + (mv.d ? '+' : MINUS);
  const sensName = (c, d) => c.toLowerCase() + (d ? '₁' : '₀');
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'];
  function analyse(seq) {
    const moves = seq.moves, cyls = seq.cyls, N = moves.length;
    const states = [], pos = {};
    cyls.forEach(c => { pos[c] = 0; });
    for (let k = 0; k <= N; k++) { states.push(Object.assign({}, pos)); if (k < N) pos[moves[k].c] = moves[k].d; }
    // each move is started by the limit valve that confirms the move before it; the first also needs start
    const trig = moves.map((mv, k) => { const p = moves[(k + N - 1) % N]; return { c: p.c, d: p.d, start: k === 0 }; });
    const sensAt = (s, j) => states[j][s.c] === s.d;
    const holders = (c, d, j) => moves.map((mv, i) => i).filter(i => moves[i].c === c && moves[i].d === d && sensAt(trig[i], j) && (!trig[i].start || j === 0));
    const pilotOn = (c, d, j) => holders(c, d, j).length > 0;
    const jams = [], unwanted = [];
    for (let k = 0; k < N; k++) {
      const mv = moves[k];
      const h = holders(mv.c, 1 - mv.d, k);
      if (h.length) jams.push({ k, mv, by: h.map(i => sensName(trig[i].c, trig[i].d)) });
      for (const c of cyls) if (c !== mv.c) {
        const d = 1 - states[k][c];
        if (pilotOn(c, d, k) && !pilotOn(c, 1 - d, k)) unwanted.push({ k, c, d, by: holders(c, d, k).map(i => sensName(trig[i].c, trig[i].d)) });
      }
    }
    const seen = new Map();
    let repeat = null;
    for (let k = 0; k < N; k++) {
      const key = cyls.map(c => states[k][c]).join('');
      if (seen.has(key)) { if (!repeat && mvName(moves[seen.get(key)]) !== mvName(moves[k])) repeat = [seen.get(key), k]; }
      else seen.set(key, k);
    }
    // cascade groups: a new group whenever a letter would repeat; merge the last into the first if possible
    const groups = [];
    let g = [];
    for (let k = 0; k < N; k++) { if (g.some(i => moves[i].c === moves[k].c)) { groups.push(g); g = []; } g.push(k); }
    groups.push(g);
    let merged = false;
    if (groups.length > 1) {
      const a = groups[groups.length - 1], b = groups[0];
      if (!a.some(i => b.some(j => moves[i].c === moves[j].c))) { groups[0] = a.concat(b); groups.pop(); merged = true; }
    }
    const groupOf = new Array(N);
    groups.forEach((gr, gi) => gr.forEach(k => { groupOf[k] = gi; }));
    return { moves, cyls, N, states, trig, holders, pilotOn, jams, unwanted, repeat, groups, groupOf, merged };
  }

  /* ================================================================ seq-step-diagram */
  const PRESETS = [
    ['A+ B+ A− B−  (no overlap)', 'A+ B+ A- B-'],
    ['A+ B+ B− A−  (clamp, work, release)', 'A+ B+ B- A-'],
    ['A+ B+ C+ C− B− A−  (mirrored)', 'A+ B+ C+ C- B- A-'],
    ['A+ B+ C+ A− B− C−  (same order)', 'A+ B+ C+ A- B- C-'],
    ['A+ B+ B− C+ C− A−  (three groups)', 'A+ B+ B- C+ C- A-'],
    ['A+ A− B+ B−', 'A+ A- B+ B-'],
    ['A+ B+ B− B+ B− A−  (rivet twice)', 'A+ B+ B- B+ B- A-'],
    ['Your own (type or use the buttons)', 'custom']
  ];
  Hyper.sim('seq-step-diagram', {
    title: 'Displacement–step diagram builder',
    blurb: `Pick a sequence or build your own with the buttons (or type it: *A+ B+ B- A-*). The diagram draws each cylinder's motion step by step, the **limit valves** that report the end positions, and the **pilot signals** that a plain circuit would give — every move piloted by the limit valve that confirms the move before it. Where the pilot for one direction of a cylinder is still on when the opposite move is wanted, the step is marked **red**: that is signal overlap, and the plain circuit jams there. **Orange** marks a pilot that would start a move of another cylinder at the wrong time. The bar on top shows the cascade groups.

**Try this**
- Compare *A+ B+ A− B−* (runs on limit valves) with *A+ B+ B− A−* (two overlaps). Read the red steps: which limit valve holds the valve?
- *A+ A− B+ B−*: no red, but orange — a₀ starts B at the very beginning. The machine state (both retracted) comes twice.
- Watch the group bar: *A+ B+ B− C+ C− A−* needs three groups (two cascade valves); *A+ A− B+ B−* only two, once the last group is merged with the first.
- Switch to the displacement–time diagram and make one cylinder slow: the steps take their real widths and the cycle time appears.`,
    params: { seq: 'A+ B+ B- A-' },
    mount(box, kit, params) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 300, maxH: 560 });
      const pre = PRESETS.some(p => p[1] === params.seq) ? params.seq : 'custom';
      let custom = pre === 'custom' ? String(params.seq || '') : '';
      const ctl = kit.controls(box.side, [
        { id: 'seq', type: 'select', label: 'Sequence', options: PRESETS, value: pre },
        { type: 'buttons', items: [{ id: 'A+', label: 'A+' }, { id: 'A-', label: 'A' + MINUS }, { id: 'B+', label: 'B+' }, { id: 'B-', label: 'B' + MINUS }] },
        { type: 'buttons', items: [{ id: 'C+', label: 'C+' }, { id: 'C-', label: 'C' + MINUS }, { id: 'undo', label: 'Undo' }, { id: 'clear', label: 'Clear' }] },
        { id: 'time', type: 'check', label: 'Draw against time (displacement–time)', value: false },
        { id: 'tA', label: 'Stroke time of A', min: 0.1, max: 2.5, step: 0.05, value: 0.4, unit: 's' },
        { id: 'tB', label: 'Stroke time of B', min: 0.1, max: 2.5, step: 0.05, value: 0.6, unit: 's' },
        { id: 'tC', label: 'Stroke time of C', min: 0.1, max: 2.5, step: 0.05, value: 0.3, unit: 's' },
        { id: 'tD', label: 'Stroke time of D', min: 0.1, max: 2.5, step: 0.05, value: 0.5, unit: 's' },
        { id: 'anim', type: 'check', label: 'Run the machine along the diagram', value: true }
      ], (id, v) => {
        if (/^[A-D][+-]$/.test(id)) {
          if (V.seq !== 'custom') { custom = V.seq; ctl.set('seq', 'custom'); }
          custom = (custom + ' ' + id).trim(); inp.value = custom.replace(/-/g, MINUS);
        }
        if (id === 'undo') { if (V.seq !== 'custom') { custom = V.seq; ctl.set('seq', 'custom'); } custom = custom.replace(/\s*[A-Da-d]\s*[+\-−–]\s*$/, ''); inp.value = custom; }
        if (id === 'clear') { custom = ''; ctl.set('seq', 'custom'); inp.value = ''; }
        if (id === 'seq' && v !== 'custom') inp.value = v.replace(/-/g, MINUS);
        if (id === 'time') showTimes();
        rebuild();
      });
      const V = ctl.values;
      // a text box for typing a sequence
      const inp = document.createElement('input');
      inp.type = 'text'; inp.placeholder = 'type a sequence, e.g. A+ B+ B- A-';
      inp.style.cssText = 'width:100%;box-sizing:border-box;margin:4px 0 8px;padding:5px 8px;font:inherit;border-radius:6px;border:1px solid var(--border,#888);background:transparent;color:inherit';
      inp.value = (pre === 'custom' ? custom : pre).replace(/-/g, MINUS);
      box.side.appendChild(inp);
      inp.addEventListener('input', () => { custom = inp.value; ctl.set('seq', 'custom'); rebuild(); });
      const ro = kit.readout(box.side, [['seq', 'Sequence'], ['jam', 'Blocked (plain limit valves)'], ['unw', 'Started at the wrong time'], ['mem', 'Machine state repeats'], ['grp', 'Cascade groups'], ['hw', 'Cascade valves / sequencer modules'], ['T', 'Cycle time']]);
      function showTimes() { for (const k of ['tA', 'tB', 'tC', 'tD']) ctl.show(k, !!V.time); ro.show('T', !!V.time); }
      showTimes();
      let seq, an, tau = 0;
      function rebuild() {
        seq = parseSeq(V.seq === 'custom' ? custom : V.seq);
        an = seq.error ? null : analyse(seq);
        tau = 0;
        if (!an) {
          ro.set('seq', seq.moves.map(mvName).join(' ') || '—');
          for (const k of ['jam', 'unw', 'mem', 'grp', 'hw', 'T']) ro.set(k, '—');
        } else {
          ro.set('seq', an.moves.map(mvName).join(' '));
          ro.set('jam', an.jams.length ? an.jams.map(j => mvName(j.mv) + ' at step ' + (j.k + 1) + ' (held by ' + j.by.join(', ') + ')').join('; ') : 'none');
          ro.set('unw', an.unwanted.length ? an.unwanted.map(u => u.c + (u.d ? '+' : MINUS) + ' at step ' + (u.k + 1) + ' (by ' + u.by.join(', ') + ')').join('; ') : 'none');
          ro.set('mem', an.repeat ? 'yes: before steps ' + (an.repeat[0] + 1) + ' and ' + (an.repeat[1] + 1) + ' — needs memory' : 'no: limit valves alone can run it');
          ro.set('grp', an.groups.map(gr => gr.map(k => mvName(an.moves[k])).join(' ')).join(' / ') + (an.merged ? '  (last merged into first)' : ''));
          ro.set('hw', (an.groups.length - 1) + ' cascade valve' + (an.groups.length === 2 ? '' : 's') + ' / ' + an.N + ' modules');
        }
        loop.once();
      }
      const strokeTime = c => V['t' + c] || 0.5;
      const T0 = 0.03;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), g = grid(st, 760, 470);
        enter(c, g);
        if (!an) {
          kit.label(c, seq.moves.map(mvName).join('  ') || '…', 380, 190, { align: 'center', size: 26, weight: 700, color: C.text });
          kit.label(c, seq.error, 380, 240, { align: 'center', size: 14, color: seq.partial ? C.muted : C.warn });
          c.restore();
          return;
        }
        const N = an.N, m = an.cyls.length;
        // step boundaries (in step units or seconds)
        const dur = an.moves.map(mv => V.time ? T0 + strokeTime(mv.c) : 1);
        const tb = [0]; dur.forEach(d => tb.push(tb[tb.length - 1] + d));
        const total = tb[N];
        if (V.time) ro.set('T', total.toFixed(2) + ' s  (' + (3600 / total).toFixed(0) + ' cycles an hour, without loading)');
        const X0 = 150, X1 = 740, xOf = t => X0 + (X1 - X0) * t / total;
        const SR = Math.min(16, 316 / (m * 7.6)), RH = 3.6 * SR, top = 64;
        const yMotion = i => top + i * RH;                                  // row i: from yMotion + 8 (1) to yMotion + RH − 8 (0)
        const ySens0 = top + m * RH + 24, yPil0 = ySens0 + 2 * m * SR + 26, yEnd = yPil0 + 2 * m * SR;
        // the share of a step at its start before the moving cylinder has left its limit valve
        const lead = k => V.time ? Math.min(0.5, (T0 + 0.06 * strokeTime(an.moves[k].c)) / dur[k]) : 0.12;
        // animation cursor
        if (V.anim && dt > 0) { tau += dt * (V.time ? 0.5 : 1.1); if (tau > total * 1.12) tau = 0; }
        const tc = Math.min(tau, total);
        const posAt = (cyl, t) => {
          let k = 0; while (k < N - 1 && t > tb[k + 1]) k++;
          const a = an.states[k][cyl], b = an.states[k + 1][cyl];
          if (a === b) return a;
          const f = clamp((t - tb[k] - (V.time ? T0 : 0.1)) / (dur[k] - (V.time ? T0 : 0.2)), 0, 1);
          return a + (b - a) * f;
        };
        // cascade groups
        kit.label(c, 'cascade', X0 - 12, 21, { align: 'right', size: 11, color: C.muted });
        an.groups.forEach((gr, gi) => {
          // a group may wrap (merged): draw each run of consecutive steps
          const ks = gr.slice(), runs = [];
          let r = [ks[0]];
          for (let i = 1; i < ks.length; i++) { if (ks[i] === ks[i - 1] + 1) r.push(ks[i]); else { runs.push(r); r = [ks[i]]; } }
          runs.push(r);
          for (const rr of runs) {
            const xa = xOf(tb[rr[0]]) + 2, xb = xOf(tb[rr[rr.length - 1] + 1]) - 2;
            c.fillStyle = kit.hue(150 + gi * 70, C.dark ? 0.22 : 0.18); c.fillRect(xa, 14, xb - xa, 14);
            kit.label(c, 'group ' + ROMAN[gi], (xa + xb) / 2, 21, { align: 'center', size: 10.5, weight: 700, color: C.text });
          }
        });
        // marks for overlaps and wrong-time starts, under everything else
        for (const u of an.unwanted) { const xa = xOf(tb[u.k]), xb = xOf(tb[u.k + 1]); c.fillStyle = C.dark ? 'rgba(224,160,48,.13)' : 'rgba(184,115,10,.09)'; c.fillRect(xa, 34, xb - xa, yEnd - 30); }
        for (const j of an.jams) { const xa = xOf(tb[j.k]), xb = xOf(tb[j.k + 1]); c.fillStyle = C.dark ? 'rgba(229,72,77,.17)' : 'rgba(214,40,40,.10)'; c.fillRect(xa, 34, xb - xa, yEnd - 30); }
        // step lines and numbers
        c.save(); c.setLineDash([2, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let k = 0; k <= N; k++) { const x = xOf(tb[k]); c.beginPath(); c.moveTo(x, 50); c.lineTo(x, yEnd + 4); c.stroke(); }
        c.restore();
        for (let k = 0; k <= N; k++) kit.label(c, V.time ? tb[k].toFixed(2) : String(k + 1 > N ? 1 : k + 1), xOf(tb[k]), 42, { align: 'center', size: 11, weight: 600, color: C.text });
        kit.label(c, V.time ? 'time (s)' : 'step', X0 - 12, 42, { align: 'right', size: 11, color: C.muted });
        // motion rows
        an.cyls.forEach((cyl, i) => {
          const y1 = yMotion(i) + 8, y0 = yMotion(i) + RH - 8;
          c.strokeStyle = C.grid; c.lineWidth = 1;
          c.beginPath(); c.moveTo(X0, y1); c.lineTo(X1, y1); c.moveTo(X0, y0); c.lineTo(X1, y0); c.stroke();
          kit.label(c, '1', X0 - 6, y1, { align: 'right', size: 10, color: C.muted });
          kit.label(c, '0', X0 - 6, y0, { align: 'right', size: 10, color: C.muted });
          kit.label(c, cyl, 12, (y0 + y1) / 2, { size: 15, weight: 700, color: C.text });
          // the cylinder itself, moving with the cursor
          const p = posAt(cyl, tc);
          S.cylinder(c, 30, (y0 + y1) / 2, { len: 56, h: 16, rodLen: 34, pos: p, color: C.text });
          // the trace
          c.strokeStyle = kit.hue(215 + i * 40); c.lineWidth = 2.6; c.lineJoin = 'round';
          c.beginPath();
          for (let k = 0; k < N; k++) {
            const a = an.states[k][cyl], b = an.states[k + 1][cyl];
            const xa = xOf(tb[k]), xb = xOf(tb[k + 1]), ya = a ? y1 : y0, yb = b ? y1 : y0;
            if (k === 0) c.moveTo(xa, ya);
            if (a === b) c.lineTo(xb, yb);
            else { const inset = V.time ? (xb - xa) * T0 / dur[k] : 0; c.lineTo(xa + inset, ya); c.lineTo(xb, yb); }
          }
          c.stroke();
          // move labels
          for (let k = 0; k < N; k++) if (an.moves[k].c === cyl) kit.label(c, mvName(an.moves[k]), (xOf(tb[k]) + xOf(tb[k + 1])) / 2, (y0 + y1) / 2, { align: 'center', size: 10.5, weight: 700, color: C.muted, bg: C.bg2 });
        });
        // limit valve and pilot rows: onAt(k) -> [share of step k from its start during which it is on, colour]
        const bar = (y, h, onAt, label) => {
          kit.label(c, label, X0 - 8, y + h / 2, { align: 'right', size: Math.min(12, h), color: C.text });
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, y + h - 0.5); c.lineTo(X1, y + h - 0.5); c.stroke();
          for (let k = 0; k < N; k++) {
            const [f, col] = onAt(k);
            if (!(f > 0)) continue;
            const xa = xOf(tb[k]), xb = xOf(tb[k + 1]);
            c.fillStyle = col; c.fillRect(xa + 0.5, y + 2, (xb - xa) * f - (f === 1 ? 1 : 0), h - 4);
          }
        };
        kit.label(c, 'limit valves: actuated', X0, ySens0 - 12, { size: 11, weight: 600, color: C.muted });
        // a limit valve stays actuated while its cylinder stands at that end; a cylinder leaving it holds it for a moment
        const sensShare = (cyl, d, k) => an.moves[k].c !== cyl ? (an.states[k][cyl] === d ? 1 : 0) : (an.states[k][cyl] === d ? lead(k) : 0);
        const green = kit.hue(150, 0.85), blue = kit.hue(215, 0.8);
        an.cyls.forEach((cyl, i) => {
          for (const d of [0, 1]) bar(ySens0 + (2 * i + d) * SR, SR, k => [sensShare(cyl, d, k), green], sensName(cyl, d));
        });
        kit.label(c, 'pilot signals, if every limit valve pilots the next move directly', X0, yPil0 - 12, { size: 11, weight: 600, color: C.muted });
        const pilotShare = (cyl, d, k) => Math.max(0, ...an.moves.map((mv, i) => mv.c === cyl && mv.d === d && (!an.trig[i].start || k === 0) ? sensShare(an.trig[i].c, an.trig[i].d, k) : 0));
        an.cyls.forEach((cyl, i) => {
          for (const d of [1, 0]) {
            bar(yPil0 + (2 * i + (d ? 0 : 1)) * SR, SR, k => {
              const f = pilotShare(cyl, d, k);
              if (an.jams.some(j => j.k === k && j.mv.c === cyl)) return [f, C.bad];
              if (an.unwanted.some(u => u.k === k && u.c === cyl && u.d === d)) return [f, C.warn];
              return [f, blue];
            }, 'pilot ' + cyl + (d ? '+' : MINUS));
          }
        });
        // the cursor
        if (V.anim) { const x = xOf(tc); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, 40); c.lineTo(x, yEnd + 4); c.stroke(); }
        // verdict
        const verdict = an.jams.length ? an.jams.length + ' overlap' + (an.jams.length > 1 ? 's' : '') + ': the plain circuit jams' : an.unwanted.length ? 'a pilot starts a move at the wrong time' : 'runs on limit valves alone';
        kit.label(c, verdict, X1, yEnd + 18, { align: 'right', size: 12, weight: 700, color: an.jams.length ? C.bad : an.unwanted.length ? C.warn : C.ok });
        kit.label(c, an.groups.length + ' cascade group' + (an.groups.length > 1 ? 's' : '') + ' · ' + N + ' sequencer modules', X0, yEnd + 18, { size: 11, color: C.muted });
        c.restore();
      }, box.stage);
      rebuild();
      loop.start();
    }
  });

  /* ================================================================ seq-cascade and seq-overlap: A+ B+ B− A− */
  // Two cylinders on double-pilot (impulse) 5/2 valves, limit valves a0 a1 b0 b1, and three ways of piping the signals:
  // 'direct' — each limit valve straight to the next pilot (the overlapping signals jam it); 'rollers' — the overlapping
  // signals from one-way trip rollers just short of the end, whose short pulses must outlast the valve's switching time;
  // 'cascade' — two group lines from a cascade (memory) valve. The cylinders are kit.fluid.pneuCylinder.
  const SQ_STROKE = 0.1, SQ_TSW = 0.008, SQ_TRIP = 0.010, SQ_E = 0.0008;
  function seqMachine(F) {
    const mk = () => F.pneuCylinder({ bore: 0.032, rod: 0.012, stroke: SQ_STROKE, mass: 1.5, load: 0 });
    return { A: mk(), B: mk(), vA: 0, vB: 0, g: 0, t: 0, startT: 0, tokens: Infinity, tm: {}, jam: '', cycles: 0, t0: null, lastCycle: null, extendedA: false, sig: {} };
  }
  function seqSignals(m, mode, cont) {
    const xa = m.A.state.x, xb = m.B.state.x, va = m.A.state.v, vb = m.B.state.v;
    const a0 = xa < SQ_E, a1 = xa > SQ_STROKE - SQ_E, b0 = xb < SQ_E, b1 = xb > SQ_STROKE - SQ_E;
    const start = cont || m.startT > 0;
    // one-way rollers placed just short of the end, tripped only while moving in their direction
    const ra1 = va > 0.005 && xa > SQ_STROKE - SQ_E - SQ_TRIP && xa <= SQ_STROKE - SQ_E;
    const rb0 = vb < -0.005 && xb >= SQ_E && xb < SQ_E + SQ_TRIP;
    const I = m.g === 1, II = !I;
    let p;
    if (mode === 'direct') p = { Ap: start && a0, Am: b0, Bp: a1, Bm: b1 };
    else if (mode === 'rollers') p = { Ap: start && a0, Am: rb0, Bp: ra1, Bm: b1 };
    else p = { Ap: I, Am: b0 && II, Bp: a1 && I, Bm: II, Gs: start && a0 && II, Gr: b1 && I };
    return Object.assign(p, { a0, a1, b0, b1, ra1, rb0, start, I, II });
  }
  // a double-pilot valve: switches when one pilot has been on (alone) for the switching time; both on = it cannot move
  function seqPilot(m, key, plus, minus, dt, canSwitch) {
    const cur = m[key], want = plus && !minus ? 1 : minus && !plus ? 0 : null;
    if (want === null || want === cur) { m.tm[key] = 0; return plus && minus; }
    m.tm[key] = (m.tm[key] || 0) + dt;
    if (m.tm[key] >= SQ_TSW && canSwitch()) { m[key] = want; m.tm[key] = 0; }
    return false;
  }
  function seqStep(m, mode, dt, o) {
    const s = seqSignals(m, mode, o.cont);
    m.sig = s;
    const tok = () => { if (m.tokens <= 0) return false; m.tokens--; return true; };
    const jA = seqPilot(m, 'vA', s.Ap, s.Am, dt, tok), jB = seqPilot(m, 'vB', s.Bp, s.Bm, dt, tok);
    if (mode === 'cascade') seqPilot(m, 'g', s.Gs, s.Gr, dt, () => true);
    m.jam = jA ? 'A' : jB ? 'B' : '';
    const C = o.C * 1e-8, Ct = o.thr / 100 * 3e-8;
    for (const [c, v] of [[m.A, m.vA], [m.B, m.vB]]) { c.params.Cvalve = C; c.params.CthrottleA = c.params.CthrottleB = Math.max(1e-10, Ct); c.step(dt, v); }
    m.startT = Math.max(0, m.startT - dt);
    m.t += dt;
    if (m.A.state.x > SQ_STROKE / 2) m.extendedA = true;
    if (m.extendedA && s.a0 && s.b0 && m.vA === 0) { m.extendedA = false; m.cycles++; if (m.t0 != null) m.lastCycle = m.t - m.t0; m.t0 = null; }
    if (m.t0 == null && m.vA === 1) m.t0 = m.t;
    return s;
  }
  function mountSequence(box, kit, params, fixed) {
    const F = kit.fluid, S = kit.fsym;
    const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
    const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
    const defs = [];
    if (!fixed) defs.push({ id: 'mode', type: 'select', label: 'Piping of the signals', options: [['Limit valves straight to the pilots', 'direct'], ['One-way trip rollers for a₁ and b₀', 'rollers'], ['Cascade: two group lines', 'cascade']], value: (params && params.mode) || 'direct' });
    defs.push({ type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'next', label: 'Next step' }, { id: 'reset', label: 'Reset' }] },
      { id: 'cont', type: 'check', label: 'Run continuously', value: !!fixed },
      { id: 'stepm', type: 'check', label: 'Step by step (Next step lets each move start)', value: false },
      { id: 'thr', label: 'Speed controllers open', min: 5, max: 100, step: 1, value: fixed ? 40 : 30, unit: '%' },
      { id: 'C', label: 'Valve conductance C', min: 0.3, max: 3, step: 0.05, value: 1, unit: 'dm³/(s·bar)' },
      { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 });
    let m = seqMachine(F), hist = [], tPlot = 0;
    const ctl = kit.controls(box.side, defs, (id, v) => {
      if (id === 'start') { m.startT = 0.4; if (V.stepm) m.tokens = Math.max(m.tokens === Infinity ? 0 : m.tokens, 0) + 1; }
      if (id === 'next') m.tokens = (m.tokens === Infinity ? 0 : m.tokens) + 1;
      if (id === 'reset' || id === 'mode') { m = seqMachine(F); hist = []; if (V.stepm) m.tokens = 0; }
      if (id === 'stepm') m.tokens = v ? 0 : Infinity;
    });
    const V = ctl.values;
    const ro = kit.readout(box.side, [['state', 'Valves A / B'], ['group', 'Group line'], ['sig', 'Limit signals now'], ['cyc', 'Cycles / last cycle time'], ['msg', '']]);
    const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'stroke (mm)', min: 0, max: 100 }, legend: true }, 140);
    const mode = () => fixed || V.mode;
    const loop = kit.loop((dt) => {
      const sdt = Math.min(dt, 0.05) * V.slow, n = Math.max(1, Math.ceil(sdt / 0.0005));
      let s = m.sig;
      for (let k = 0; k < n; k++) s = seqStep(m, mode(), sdt / n, { cont: V.cont, C: V.C, thr: V.thr });
      const xa = m.A.state.x, xb = m.B.state.x;
      tPlot += dt; hist.push([m.t, xa * 1000, xb * 1000]); while (hist.length && hist[0][0] < m.t - 4) hist.shift();
      if (tPlot > 0.08) { tPlot = 0; plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'cylinder A' }, { pts: hist.map(h => [h[0], h[2]]), label: 'cylinder B', dash: [5, 4] }] }); }
      const on = x => x ? 'on' : '·';
      ro.set('state', (m.vA ? 'A+' : 'A' + MINUS) + ' / ' + (m.vB ? 'B+' : 'B' + MINUS));
      ro.set('group', mode() === 'cascade' ? (m.g ? 'I (A+, B+)' : 'II (B' + MINUS + ', A' + MINUS + ')') : '— (no groups)');
      ro.set('sig', ['a₀', 'a₁', 'b₀', 'b₁'].filter((_, i) => [s.a0, s.a1, s.b0, s.b1][i]).join(' ') || 'none');
      ro.set('cyc', m.cycles + ' / ' + (m.lastCycle ? m.lastCycle.toFixed(2) + ' s' : '—'));
      m.still = Math.abs(m.A.state.v) < 0.005 && Math.abs(m.B.state.v) < 0.005 ? (m.still || 0) + dt : 0;
      const stuck = m.still > 1.2 && !(s.a0 && s.b0) && !m.jam;
      const msg = m.jam ? 'JAMMED: valve ' + m.jam + ' has pilot signals on both sides' : stuck ? 'stopped mid-sequence: a trip pulse was too short to switch the next valve' : V.stepm && m.tokens === 0 ? 'waiting: press Next step' : !V.cont && !m.startT && xa < SQ_E && xb < SQ_E ? 'ready: press Start' : 'running';
      ro.set('msg', msg);
      // ---- drawing on a 760 × 440 grid
      const c = st.begin(), C = kit.colors(), g = grid(st, 760, 440);
      enter(c, g);
      const col = S.col, P = m.A.params, ps = P.psupply;
      const cyl = (x0, cy, name, mm) => {
        const pos = mm.state.x / SQ_STROKE, fill = p => p - PATM > 0.3e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.1 + 0.4 * (p - PATM) / (ps - PATM)) + ')' : null;
        const r = S.cylinder(c, x0, cy, { len: 180, h: 30, pos, rodLen: 60, fillA: fill(mm.state.pA), fillB: fill(mm.state.pB), cushion: true });
        kit.label(c, name, x0 - 14, cy, { size: 15, weight: 800, color: C.text });
        // the cam on the rod and the two limit valves (rollers)
        const tip0 = x0 + 71, tip1 = x0 + 236;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(r.tip[0], cy); c.lineTo(r.tip[0], cy - 26); c.stroke();
        return { r, tip0, tip1 };
      };
      const ca = cyl(50, 70, 'A', m.A), cb = cyl(420, 70, 'B', m.B);
      const roller = (x, y, act, live, name, oneWay) => {
        c.fillStyle = live ? col('pilot') : act ? C.ok : C.surface; c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.beginPath(); c.arc(x, y, 6, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(x, y - 6); c.lineTo(x, y - 14); c.stroke();
        if (oneWay) { c.beginPath(); c.moveTo(x - 5, y - 14); c.lineTo(x + 5, y - 10); c.stroke(); }
        kit.label(c, name, x, y - 22, { size: 12, weight: 700, color: act ? C.text : C.muted });
      };
      const md = mode(), casc = md === 'cascade';
      const liveA0 = casc ? s.a0 && s.II : s.a0, liveA1 = md === 'rollers' ? s.ra1 : casc ? s.a1 && s.I : s.a1;
      const liveB0 = md === 'rollers' ? s.rb0 : casc ? s.b0 && s.II : s.b0, liveB1 = casc ? s.b1 && s.I : s.b1;
      roller(ca.tip0, 36, s.a0, liveA0, 'a₀'); roller(ca.tip1, 36, s.a1, liveA1, 'a₁', md === 'rollers');
      roller(cb.tip0, 36, s.b0, liveB0, 'b₀', md === 'rollers'); roller(cb.tip1, 36, s.b1, liveB1, 'b₁');
      // power valves, their pipes and the supply
      const pipe = (from, via, to, live) => S.line(c, [from].concat(via, [to]), { state: live ? 'air' : 'exhaust' });
      const valve = (x, state, name, jam) => {
        const v = S.valve(c, x, 190, { spec: '5/2', state: 1 - state, left: 'pilot', right: 'pilot', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        if (jam) { c.strokeStyle = C.bad; c.lineWidth = 3; c.strokeRect(v.xl - 4, 170, v.xr - v.xl + 8, 40); }
        kit.label(c, name, v.xr + 14, 190, { size: 13, weight: 800, color: jam ? C.bad : C.text, align: 'left' });
        return v;
      };
      const VA = valve(150, m.vA, 'V1', m.jam === 'A'), VB = valve(520, m.vB, 'V2', m.jam === 'B');
      pipe(VA.B, [[VA.B[0], 128], [58, 128]], [58, 95], m.vA === 1); pipe(VA.A, [[VA.A[0], 120], [222, 120]], [222, 95], m.vA === 0);
      pipe(VB.B, [[VB.B[0], 128], [428, 128]], [428, 95], m.vB === 1); pipe(VB.A, [[VB.A[0], 120], [592, 120]], [592, 95], m.vB === 0);
      S.line(c, [[20, 240], [VB.P[0], 240], [VB.P[0], VB.P[1]]], { state: 'air' }); S.line(c, [[VA.P[0], 240], [VA.P[0], VA.P[1]]], { state: 'air' });
      S.junction(c, VA.P[0], 240); S.source(c, 20, 260, { pneumatic: true });
      // what each pilot sees, written at its port (orange when on; red when both pilots of a valve are on)
      const chip = (pt, text, onNow, side, bad) => kit.label(c, text, pt[0] + (side < 0 ? -4 : 4), pt[1], { size: 11, weight: 700, align: side < 0 ? 'right' : 'left', color: bad ? C.bad : onNow ? col('pilot') : C.muted });
      const names = casc ? { Ap: 'I', Am: 'b₀·II', Bp: 'a₁·I', Bm: 'II' } : md === 'rollers' ? { Ap: 'start·a₀', Am: 'b₀ (trip)', Bp: 'a₁ (trip)', Bm: 'b₁' } : { Ap: 'start·a₀', Am: 'b₀', Bp: 'a₁', Bm: 'b₁' };
      if (VA.pilotL) chip(VA.pilotL, names.Ap, s.Ap, -1, s.Ap && s.Am); if (VA.pilotR) chip(VA.pilotR, names.Am, s.Am, 1, s.Ap && s.Am);
      if (VB.pilotL) chip(VB.pilotL, names.Bp, s.Bp, -1, s.Bp && s.Bm); if (VB.pilotR) chip(VB.pilotR, names.Bm, s.Bm, 1, s.Bp && s.Bm);
      if (casc) {
        // the two group lines and the cascade valve that switches them
        S.line(c, [[40, 290], [720, 290]], { state: s.I ? 'air' : 'idle' }); S.line(c, [[40, 310], [720, 310]], { state: s.II ? 'air' : 'idle' });
        kit.label(c, 'I', 30, 290, { size: 13, weight: 800, color: s.I ? col('air') : C.muted }); kit.label(c, 'II', 30, 310, { size: 13, weight: 800, color: s.II ? col('air') : C.muted });
        const VG = S.valve(c, 380, 365, { spec: '5/2', state: 1 - m.g, left: 'pilot', right: 'pilot', s: 30, pneumatic: true, exhaust: 'silencer' });
        S.line(c, [VG.B, [VG.B[0], 290]], { state: s.I ? 'air' : 'idle' }); S.line(c, [VG.A, [VG.A[0], 310]], { state: s.II ? 'air' : 'idle' });
        S.junction(c, VG.B[0], 290); S.junction(c, VG.A[0], 310);
        S.line(c, [[VG.P[0], VG.P[1]], [VG.P[0], 405], [70, 405]], { state: 'air' }); S.source(c, 70, 425, { pneumatic: true });
        kit.label(c, 'cascade valve', VG.xr + 12, 365, { size: 12, weight: 700, color: C.text, align: 'left' });
        if (VG.pilotL) chip(VG.pilotL, 'start·a₀·II', s.Gs, -1, false); if (VG.pilotR) chip(VG.pilotR, 'b₁·I', s.Gr, 1, false);
      } else {
        kit.label(c, md === 'direct' ? 'each limit valve pilots the next move directly' : 'a₁ and b₀ are one-way rollers: they give a pulse only while the rod passes, just short of the end', 380, 300, { size: 12, color: C.muted });
        if (md === 'rollers') kit.label(c, 'pulse needs ≥ ' + (SQ_TSW * 1000).toFixed(0) + ' ms to switch a valve; a fast rod gives only ' + (SQ_TRIP / Math.max(0.01, Math.abs(m.A.state.v) || 0.3) * 1000).toFixed(1) + ' ms', 380, 322, { size: 12, color: C.muted });
      }
      if (m.jam) kit.label(c, 'valve ' + (m.jam === 'A' ? 'V1' : 'V2') + ' is held both ways — the machine is stuck', 380, 252, { size: 13, weight: 800, color: C.bad });
      c.restore();
    }, box.stage);
    loop.start();
  }

  Hyper.sim('seq-cascade', {
    title: 'The cascade for A+ B+ B− A−',
    blurb: `A clamp (A) and a punch (B) run the sequence A+ B+ B− A− piped as a two-group cascade: a memory valve feeds either group line I (A+, B+) or group line II (B−, A−), so no limit valve is live when it would hold the wrong side of a valve. The cylinders are simulated (32 mm bore, 100 mm stroke); orange marks a live pilot signal.

**Try this**
- Press Start and follow the orange signals: I feeds A+ directly; a₁ (fed from I) starts B+; b₁ switches the groups; II feeds B− directly; b₀ (fed from II) starts A−.
- Tick *Step by step* and press *Next step* to walk through the four moves. Watch which group line is live at each step.
- Close the speed controllers: every move slows, the logic does not change.
- Compare with the plain circuit on the *signal overlap* page, which jams.`,
    mount(box, kit, params) { mountSequence(box, kit, params, 'cascade'); }
  });

  Hyper.sim('seq-overlap', {
    title: 'Signal overlap: the same machine piped three ways',
    blurb: `The sequence A+ B+ B− A− with its limit valves wired straight to the next pilot jams twice: at the start b₀ holds A back while Start pushes it out, and later a₁ holds B out while b₁ tries to bring it back. Two classic cures: one-way trip rollers that only give a pulse while the rod passes, and the cascade.

**Try this**
- With the plain piping, press Start: valve V1 has pilot signals on both sides and cannot switch. Nothing moves.
- Switch to one-way rollers and start again: it runs. Now open the speed controllers fully — the trip pulses get shorter than the valve's switching time and the sequence stops.
- Switch to the cascade: it runs at any speed, because a signal is only live in its own group.`,
    mount(box, kit, params) { mountSequence(box, kit, params, null); }
  });

  /* ================================================================ seq-two-hand */
  Hyper.sim('seq-two-hand', {
    title: 'Two-hand control',
    blurb: `A press that only closes while both hands are on their buttons: the two presses must come within 0.5 s of each other, letting go of either stops the ram and sends it back, and both buttons must be released before a new stroke can begin — so tying one button down defeats nothing. The stopping time sets how far from the danger zone the buttons must be: S = K·T + C, with K = 1600 mm/s and C = 250 mm for two-hand devices (ISO 13855; the standard gives the conditions for a smaller C).

**Try this**
- Press both with a delay of 0.3 s: the ram closes. Try 0.7 s: nothing happens — release both and try again.
- Release one hand in mid-stroke: the ram stops and returns. Read the stopping time and the distance it requires.
- Tie the left button down, then press the right one alone, repeatedly: the press never cycles.
- Make the valve slower or the ram faster: the stopping time grows, and so does the safety distance.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ev = [];                                             // scheduled button events: [time, button, down]
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'both', label: 'Press both', primary: true }, { id: 'rl', label: 'Release left' }, { id: 'rr', label: 'Release right' }, { id: 'rel', label: 'Release both' }] },
        { id: 'delay', label: 'Second hand after', min: 0, max: 1.5, step: 0.05, value: 0.2, unit: 's' },
        { id: 'tie', type: 'check', label: 'Left button tied down', value: false },
        { id: 'resp', label: 'Control and valve response', min: 10, max: 150, step: 5, value: 40, unit: 'ms' },
        { id: 'v', label: 'Ram speed', min: 0.05, max: 0.6, step: 0.01, value: 0.25, unit: 'm/s' }
      ], (id) => {
        const t = s.t;
        if (id === 'both') { ev.push([t, 'L', true], [t + V.delay, 'R', true]); }
        if (id === 'rl') ev.push([t, 'L', false]);
        if (id === 'rr') ev.push([t, 'R', false]);
        if (id === 'rel') ev.push([t, 'L', false], [t, 'R', false]);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gap', 'Time between the hands'], ['out', 'Output'], ['T', 'Stopping time T (last stop)'], ['S', 'Safety distance S = K·T + C'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'signal', min: -0.2, max: 3.4 }, legend: true }, 130);
      const s = { t: 0, L: false, R: false, tL: null, tR: null, out: false, armed: true, y: 0, vy: 0, stopT: null, tRel: null, hist: [], tPlot: 0, gap: null, cmdOffAt: null };
      const STROKE = 0.15, AMAX = 6, ABRK = 8;
      const loop = kit.loop((dt) => {
        s.t += dt;
        while (ev.length && ev[0][0] <= s.t) { const [, b, d] = ev.shift(); if (b === 'L') { if (d && !s.L) s.tL = s.t; s.L = d; } else { if (d && !s.R) s.tR = s.t; s.R = d; } }
        ev.sort((a, b) => a[0] - b[0]);
        const L = s.L || V.tie, R = s.R;
        if (V.tie && s.tL === null) s.tL = 0;
        // type IIIA logic: both within 0.5 s, re-armed only when both are released
        if (!L && !R) s.armed = true;
        const within = s.tL != null && s.tR != null && Math.abs(s.tL - s.tR) <= 0.5;
        if (L && R && s.tL != null && s.tR != null) s.gap = Math.abs(s.tL - s.tR);
        const want = L && R && within && s.armed;
        if (want && !s.out) { s.out = true; s.cmdOffAt = null; }
        if (s.out && !(L && R)) { s.out = false; s.armed = false; s.tRel = s.t; s.cmdOffAt = s.t + V.resp / 1000; }
        if (L && R && !within) s.armed = false;
        // the ram: drives down while the valve is on; after the response delay it brakes and returns
        const driving = s.out || (s.cmdOffAt != null && s.t < s.cmdOffAt);
        if (driving) { s.vy = Math.min(V.v, s.vy + AMAX * dt); }
        else if (s.vy > 0) { s.vy = Math.max(0, s.vy - ABRK * dt); if (s.vy === 0 && s.tRel != null) { s.stopT = s.t - s.tRel; s.tRel = null; } s.vy = s.vy > 0 ? s.vy : -0.2; }
        else s.vy = s.y > 0 ? -0.2 : 0;
        s.y = clamp(s.y + s.vy * dt, 0, STROKE);
        if (s.y >= STROKE && s.vy > 0) s.vy = 0;
        s.hist.push([s.t, L ? 3 : 2.2, R ? 1.9 : 1.1, s.out ? 0.8 : 0]); while (s.hist.length && s.hist[0][0] < s.t - 6) s.hist.shift();
        s.tPlot += dt;
        if (s.tPlot > 0.08) { s.tPlot = 0; plot.set({ series: [{ pts: s.hist.map(h => [h[0], h[1]]), label: 'left' }, { pts: s.hist.map(h => [h[0], h[2]]), label: 'right' }, { pts: s.hist.map(h => [h[0], h[3]]), label: 'press output', width: 2.5 }] }); }
        ro.set('gap', s.gap != null ? s.gap.toFixed(2) + ' s' + (s.gap > 0.5 ? ' — too late' : '') : '—');
        ro.set('out', s.out ? 'ON: the ram closes' : 'off');
        const T = s.stopT != null ? s.stopT : V.resp / 1000 + V.v / ABRK;
        ro.set('T', (T * 1000).toFixed(0) + ' ms' + (s.stopT == null ? ' (estimate)' : ''));
        ro.set('S', (1600 * T + 250).toFixed(0) + ' mm');
        ro.set('msg', V.tie && !s.armed ? 'tied down: never re-armed' : !s.armed && (L || R) ? 'release both buttons to re-arm' : s.out ? '' : 'press both within 0.5 s');
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const px = W / 2, top = Hh * 0.08, frameH = Hh * 0.55, ramH = frameH * 0.35 + (s.y / STROKE) * frameH * 0.5;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        c.fillRect(px - 90, top, 180, 14); c.strokeRect(px - 90, top, 180, 14);                              // crosshead
        c.fillRect(px - 12, top + 14, 24, ramH - 14); c.strokeRect(px - 12, top + 14, 24, ramH - 14);     // ram
        c.fillStyle = s.out ? C.bad : C.muted; c.fillRect(px - 40, top + ramH, 80, 12);                        // tool
        c.fillStyle = C.surface; c.fillRect(px - 90, top + frameH + 12, 180, 16); c.strokeRect(px - 90, top + frameH + 12, 180, 16);   // table
        c.fillStyle = 'hsl(40 80% 60% / .35)'; c.fillRect(px - 60, top + frameH - 8, 120, 20);                  // danger zone
        kit.label(c, 'danger zone', px, top + frameH + 2, { size: 11, color: C.warn, weight: 700 });
        const btn = (x, on, label) => {
          c.fillStyle = on ? C.ok : C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
          c.beginPath(); c.arc(x, Hh * 0.86, Math.min(26, W * 0.05), 0, Math.PI * 2); c.fill(); c.stroke();
          kit.label(c, label, x, Hh * 0.86 + Math.min(26, W * 0.05) + 12, { size: 12, weight: 700, color: C.text });
        };
        btn(W * 0.18, L, V.tie ? 'left (tied)' : 'left'); btn(W * 0.82, R, 'right');
        kit.label(c, 'S = ' + (1600 * T + 250).toFixed(0) + ' mm from the danger zone', W / 2, Hh * 0.93, { size: 12, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ seq-estop */
  // A vertical axis lifting a load: bore 50 mm, rod 20 mm, 300 mm stroke; a spring-centred 5/3 valve (closed, exhaust or
  // pressure centre), optional pilot-operated check valves at the ports, and an optional soft-start / dump valve in the supply.
  function vAxis(F, mass) {
    const P = { bore: 0.05, rod: 0.02, stroke: 0.3, mass, C: 1e-8, b: 0.3, ps: 6e5 + PATM, fc: 30, fv: 120, leak: 4e-11, dead: 3e-5 };
    const AA = Math.PI * P.bore * P.bore / 4, AB = AA - Math.PI * P.rod * P.rod / 4;
    const pB0 = 3e5 + PATM, pA0 = (mass * G0 + pB0 * AB + PATM * (AA - AB)) / AA;
    const s = { x: 0.12, v: 0, pA: pA0, pB: pB0, psup: P.ps };
    function step(dt, pos, centre, checks, cSup) {
      const n = Math.max(1, Math.ceil(dt / 2e-5)), h = dt / n;
      for (let k = 0; k < n; k++) {
        // what each line is connected to
        let la, lb;
        if (pos === 'up') { la = 'P'; lb = 'R'; } else if (pos === 'down') { la = 'R'; lb = 'P'; }
        else if (centre === 'exhaust') { la = lb = 'R'; } else if (centre === 'pressure') { la = lb = 'P'; } else { la = lb = 'X'; }
        const flow = (line, p) => line === 'P' ? mflow(F, cSup || P.C, s.psup, p, P.b) : line === 'R' ? mflow(F, P.C, PATM, p, P.b) : 0;
        let mA = flow(la, s.pA), mB = flow(lb, s.pB);
        if (checks) {                                          // outflow only while the other line is pressurised (the pilot)
          const pilotA = lb === 'P' && s.psup > PATM + 1.5e5, pilotB = la === 'P' && s.psup > PATM + 1.5e5;
          if (mA < 0 && !pilotA) mA = 0; if (mB < 0 && !pilotB) mB = 0;
        }
        mA += mflow(F, P.leak, PATM, s.pA, P.b); mB += mflow(F, P.leak, PATM, s.pB, P.b);   // small leaks at seals and fittings
        const Fp = s.pA * AA - s.pB * AB - PATM * (AA - AB) - P.mass * G0;
        let a;
        if (Math.abs(s.v) < 1e-4 && Math.abs(Fp) <= P.fc) { a = 0; s.v = 0; }
        else a = (Fp - Math.sign(s.v || Fp) * P.fc - P.fv * s.v) / P.mass;
        s.v += a * h; s.x += s.v * h;
        if (s.x <= 0) { s.x = 0; if (s.v < 0) s.v = 0; } if (s.x >= P.stroke) { s.x = P.stroke; if (s.v > 0) s.v = 0; }
        const VA = P.dead + AA * s.x, VB = P.dead + AB * (P.stroke - s.x);
        s.pA = Math.max(PATM * 0.3, s.pA + h * (GAM * RG * TA * mA - GAM * s.pA * AA * s.v) / VA);
        s.pB = Math.max(PATM * 0.3, s.pB + h * (GAM * RG * TA * mB + GAM * s.pB * AB * s.v) / VB);
      }
    }
    return { P, s, step, AA, AB };
  }
  Hyper.sim('seq-estop', {
    title: 'Emergency stop on a vertical axis',
    blurb: `A cylinder lifts a load up and down. Press EMERGENCY STOP in mid-stroke: both solenoids drop out, the spring-centred 5/3 valve goes to its centre, and — if fitted — the dump valve exhausts the supply. What the load does next depends on the centre and on the check valves. Then restore the air, with and without soft start.

**Try this**
- Exhaust centre, no check valves: the load falls. Add the pilot-operated check valves: it stops and stays.
- Closed centre: the load stops, bouncing on the trapped air, and then creeps as the air leaks away past the seals.
- Pressure centre: both sides at supply pressure, so the net force is pressure × rod area (about 190 N here): a light load is pushed up, a heavy one sinks. Try 10 kg and 40 kg without the dump valve.
- Choose *Restoring the air*: after a stop with the chambers empty, the machine resumes its lift. Without soft start the cylinder shoots up with nothing to cushion it; with soft start the supply builds slowly and the first move is gentle.`,
    mount(box, kit, params) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'estop', label: 'EMERGENCY STOP', primary: true }, { id: 'restore', label: 'Restore air' }, { id: 'reset', label: 'Reset' }] },
        { id: 'scen', type: 'select', label: 'Scenario', options: [['An emergency stop mid-lift', 'stop'], ['Restoring the air after a stop', 'restart']], value: (params && params.scenario) || 'stop' },
        { id: 'centre', type: 'select', label: '5/3 valve centre', options: [['Exhaust centre (A and B to exhaust)', 'exhaust'], ['Closed centre (all ports blocked)', 'closed'], ['Pressure centre (1 to A and B)', 'pressure']], value: 'exhaust' },
        { id: 'checks', type: 'check', label: 'Pilot-operated check valves at the ports', value: false },
        { id: 'soft', type: 'check', label: 'Soft-start and dump valve in the supply', value: true },
        { id: 'mass', label: 'Load', min: 5, max: 60, step: 1, value: 25, unit: 'kg' }
      ], (id) => {
        if (id === 'estop') { s.stopped = true; s.tStop = s.t; s.xStop = ax.s.x; s.peak = 0; s.tRestore = null; if (V.soft) s.airOn = false; }
        if (id === 'restore') { s.airOn = true; s.tRestore = s.t; s.peak = 0; s.firstDone = false; s.softDone = false; if (V.scen === 'restart') { s.stopped = false; s.cmd = 'up'; } }
        if (id === 'reset' || id === 'scen' || id === 'mass') init();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'State'], ['pos', 'Height / speed'], ['p', 'Cap end / rod end (gauge)'], ['sup', 'Supply (gauge)'], ['res', 'Result']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'height (mm)', min: 0, max: 300 }, legend: true }, 130);
      let ax, s;
      function init() {
        ax = vAxis(F, V.mass);
        s = { t: 0, cmd: 'up', stopped: false, airOn: true, tStop: null, xStop: 0, tRestore: null, peak: 0, hist: [], tPlot: 0 };
        if (V.scen === 'restart') { ax.s.x = 0; ax.s.pA = PATM; ax.s.pB = PATM; ax.s.v = 0; s.stopped = true; s.airOn = false; ax.s.psup = V.soft ? PATM : ax.P.ps; s.tStop = 0; }
      }
      init();
      const loop = kit.loop((dt) => {
        const h = Math.min(dt, 0.05);
        // the supply: dumped on a stop (if the dump valve is fitted); restored suddenly or slowly (soft start)
        const target = s.airOn ? ax.P.ps : PATM, tau = target < ax.s.psup ? 0.08 : 0.03;
        ax.s.psup += (target - ax.s.psup) * (1 - Math.exp(-h / tau));
        // the cycle: up to the top, down to the bottom
        if (!s.stopped) { if (s.cmd === 'up' && ax.s.x >= ax.P.stroke - 1e-4) s.cmd = 'down'; else if (s.cmd === 'down' && ax.s.x <= 1e-4) s.cmd = 'up'; }
        // a soft-start valve first lets the air in through a small throttle, until the pressure passes half the supply
        // (it opens fully when the pressure downstream passes half the supply — which happens once the cylinder has arrived)
        const softing = V.soft && s.tRestore != null && !s.softDone;
        ax.step(h, s.stopped ? 'centre' : s.cmd, V.centre, V.checks, softing ? 0.08e-8 : 0);
        if (softing && Math.max(ax.s.pA, ax.s.pB) > PATM + 0.5 * (ax.P.ps - PATM)) s.softDone = true;
        s.t += h;
        // the peak speed: after a stop, and on the first stroke after the air returns
        if (s.tRestore != null && !s.firstDone) { s.peak = Math.max(s.peak, Math.abs(ax.s.v)); if (ax.s.x >= ax.P.stroke - 1e-4) s.firstDone = true; }
        else if (s.tStop != null && s.tRestore == null) s.peak = Math.max(s.peak, Math.abs(ax.s.v));
        s.hist.push([s.t, ax.s.x * 1000]); while (s.hist.length && s.hist[0][0] < s.t - 8) s.hist.shift();
        s.tPlot += dt;
        if (s.tPlot > 0.1) { s.tPlot = 0; plot.set({ series: [{ pts: s.hist.slice(), label: 'height' }], vlines: s.tStop != null && s.t - s.tStop < 8 ? [{ x: s.tStop, label: 'stop' }] : [] }); }
        const g = p => ((p - PATM) / 1e5).toFixed(2) + ' bar';
        ro.set('state', s.stopped ? 'EMERGENCY STOP' + (s.airOn ? '' : ', air off') : 'running: ' + (s.cmd === 'up' ? 'lifting' : 'lowering'));
        ro.set('pos', (ax.s.x * 1000).toFixed(0) + ' mm / ' + (ax.s.v * 1000).toFixed(0) + ' mm/s');
        ro.set('p', g(ax.s.pA) + ' / ' + g(ax.s.pB)); ro.set('sup', g(ax.s.psup));
        let res = '';
        if (V.scen === 'stop' && s.tStop != null) {
          const moved = (ax.s.x - s.xStop) * 1000;
          res = ax.s.x <= 1e-4 && moved < -5 ? 'the load fell ' + (-moved).toFixed(0) + ' mm to the bottom' : Math.abs(ax.s.v) > 0.002 ? 'moving ' + (ax.s.v * 1000).toFixed(1) + ' mm/s since the stop' : 'held, ' + (moved >= 0 ? '+' : '') + moved.toFixed(1) + ' mm from where it stopped';
        } else if (V.scen === 'restart') res = s.tRestore == null ? 'press Restore air' : 'fastest speed on the first stroke: ' + (s.peak * 1000).toFixed(0) + ' mm/s';
        ro.set('res', res);
        // ---- drawing on a 760 × 460 grid
        const c = st.begin(), C = kit.colors(), gr = grid(st, 760, 460);
        enter(c, gr);
        const fillP = p => p - PATM > 0.2e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.1 + 0.4 * (p - PATM) / 6e5) + ')' : null;
        const cy = S.cylinder(c, 180, 410, { rot: -90, len: 250, h: 44, rodLen: 100, pos: ax.s.x / ax.P.stroke, fillA: fillP(ax.s.pA), fillB: fillP(ax.s.pB) });
        const lw = 40 + V.mass * 0.9;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cy.tip[0] - lw / 2, cy.tip[1] - 34, lw, 34); c.strokeRect(cy.tip[0] - lw / 2, cy.tip[1] - 34, lw, 34);
        kit.label(c, V.mass + ' kg', cy.tip[0], cy.tip[1] - 17, { size: 12, weight: 700, color: C.text });
        const pos = s.stopped ? 1 : s.cmd === 'up' ? 2 : 0;
        const spec = V.centre === 'exhaust' ? '5/3 exhaust' : V.centre === 'pressure' ? '5/3 pressure' : '5/3 closed';
        const v53 = S.valve(c, 440, 330, { spec, state: pos, left: 'spring+solenoid', right: 'spring+solenoid', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        const liveB = pos === 0 || (pos === 1 && V.centre === 'pressure'), liveA = pos === 2 || (pos === 1 && V.centre === 'pressure');
        const lineSt = (live, p) => live && ax.s.psup > PATM + 0.3e5 ? 'air' : p - PATM > 0.3e5 ? 'exhaust' : 'idle';
        // port 4 → rod end (top), port 2 → cap end (bottom)
        S.line(c, [v53.B, [v53.B[0], cy.B[1]], [cy.B[0], cy.B[1]]], { state: lineSt(liveB, ax.s.pB) });
        S.line(c, [v53.A, [v53.A[0], 290], [500, 290], [500, 438], [cy.A[0], 438], cy.A], { state: lineSt(liveA, ax.s.pA) });
        if (V.checks) {
          S.check(c, 300, cy.B[1], { rot: -90, pilot: true, open: ax.s.v < -0.002 }); S.check(c, 300, 438, { rot: -90, pilot: true, open: ax.s.v > 0.002 });
          kit.label(c, 'pilot-operated check valves', 300, cy.B[1] - 22, { size: 11, color: C.muted });
        }
        S.line(c, [v53.P, [v53.P[0], 395], [640, 395]], { state: ax.s.psup - PATM > 0.3e5 ? 'air' : 'idle' });
        S.valve(c, 646, 420, { spec: '3/2 NC', state: s.stopped && V.soft ? 1 : 0, left: 'solenoid', right: 'spring', s: 26, pneumatic: true, exhaust: 'silencer' });
        kit.label(c, V.soft ? 'soft-start / dump valve' : 'plain shut-off', 646, 452, { size: 11, color: C.muted });
        kit.label(c, '5/3, spring-centred', 440, 372, { size: 11, color: C.muted });
        if (s.stopped) kit.label(c, 'E-STOP', 440, 250, { size: 16, weight: 800, color: C.bad });
        kit.label(c, 'supply ' + ((ax.s.psup - PATM) / 1e5).toFixed(1) + ' bar', 600, 380, { size: 12, weight: 700, color: C.text });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ seq-silencer */
  const SILENCERS = [['No silencer', 0, Infinity], ['Sintered bronze', 20, 3], ['Porous plastic', 25, 2], ['High-performance (fibre)', 30, 1.5], ['Piped to a central exhaust', 38, 4]];
  Hyper.sim('seq-silencer', {
    title: 'Exhaust noise and silencers',
    blurb: `Each time a valve exhausts a cylinder, air leaves at up to the speed of sound: a free exhaust at 6 bar can reach well over 90 dB(A) close by. What matters for hearing is the equivalent level over the day, which depends on how often the bursts come, how many valves there are and how close people work. The EU sets a lower action value of 80 dB(A), an upper action value of 85 dB(A) (hearing protection must be worn) and an exposure limit of 87 dB(A) at the ear, over 8 hours (Directive 2003/10/EC); every 3 dB more halves the time.

**Try this**
- Twelve valves without silencers at 1 m: read the equivalent level and the safe time. Fit sintered bronze silencers.
- Clog the silencers: the noise falls a little more, but the exhaust conductance collapses and the cylinders slow down — a clogged silencer is a common cause of "the machine got slower".
- Step back from 1 m to 4 m: −12 dB in the open, less in a hard-walled room.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Valves exhausting', min: 1, max: 24, step: 1, value: 12 },
        { id: 'cpm', label: 'Cycles per minute (each valve)', min: 1, max: 60, step: 1, value: 20 },
        { id: 'p', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'sil', type: 'select', label: 'Silencer', options: SILENCERS.map((x, i) => [x[0] + (x[1] ? ' (−' + x[1] + ' dB)' : ''), i]), value: 0 },
        { id: 'clog', type: 'check', label: 'Silencers clogged with oil and dirt', value: false },
        { id: 'r', label: 'Distance from the valves', min: 0.5, max: 8, step: 0.1, value: 1, unit: 'm' }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['burst', 'Level during an exhaust burst'], ['leq', 'Equivalent level L_EX,8h'], ['safe', 'Allowed daily exposure'], ['speed', 'Cylinder return speed'], ['msg', '']]);
      let t = 0;
      const loop = kit.loop((dt) => {
        t += dt;
        const sil = SILENCERS[+V.sil], clog = V.clog && +V.sil > 0;
        const L1 = 96 + 1.8 * (V.p - 6);                                   // one free exhaust burst at 1 m, typical
        const att = sil[1] + (clog ? 4 : 0);
        const Lb = L1 - att + 10 * Math.log10(V.n) - 20 * Math.log10(V.r);
        const duty = clamp(V.cpm * 0.15 / 60, 1e-4, 1);                        // each burst lasts about 0.15 s
        const Leq = Lb + 10 * Math.log10(Math.min(1, duty * 1));
        const Th = 8 * Math.pow(2, (85 - Leq) / 3);
        // exhaust conductance: the silencer in series with the valve (C_valve = 1)
        const Cs = clog ? sil[2] * 0.2 : sil[2], Ceff = 1 / Math.sqrt(1 + (isFinite(Cs) ? 1 / (Cs * Cs) : 0));
        ro.set('burst', Lb.toFixed(1) + ' dB(A)');
        ro.set('leq', Leq.toFixed(1) + ' dB(A)');
        ro.set('safe', Th >= 24 ? 'no limit in a working day' : Th >= 1 ? Th.toFixed(1) + ' h' : (Th * 60).toFixed(0) + ' min');
        ro.set('speed', (Ceff * 100).toFixed(0) + ' % of an unsilenced exhaust');
        ro.set('msg', Leq >= 87 ? 'above the exposure limit even with protection counted' : Leq >= 85 ? 'hearing protection required' : Leq >= 80 ? 'lower action value: protection available, information' : 'below the action values');
        // drawing: the valves bursting, and a level bar against the action values
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const nShow = Math.min(12, V.n), per = 60 / V.cpm;
        for (let i = 0; i < nShow; i++) {
          const x = W * 0.06 + i * (W * 0.46 / Math.max(1, nShow - 1 || 1)), y = Hh * 0.35;
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(x - 9, y - 10, 18, 20); c.strokeRect(x - 9, y - 10, 18, 20);
          const phase = ((t + i * per / nShow) % per) / per, burst = phase < 0.15 / per;
          if (burst) for (let k = 1; k <= 3; k++) { c.strokeStyle = 'hsl(' + (sil[1] ? 200 : 8) + ' 80% 60% / ' + (0.7 - k * 0.18) + ')'; c.beginPath(); c.arc(x, y + 18, k * (sil[1] ? 5 : 11), 0.2, Math.PI - 0.2); c.stroke(); }
          if (sil[1]) { c.fillStyle = clog ? 'hsl(30 40% 35%)' : C.muted; c.fillRect(x - 4, y + 10, 8, 10); }
        }
        kit.label(c, V.n > 12 ? V.n + ' valves (12 drawn)' : V.n + ' valve' + (V.n > 1 ? 's' : ''), W * 0.29, Hh * 0.12, { size: 12, color: C.muted });
        // the level bar
        const bx = W * 0.62, bw = W * 0.12, y0 = Hh * 0.9, y1 = Hh * 0.1, lo = 60, hi = 115;
        const yy = L => y0 - (y0 - y1) * clamp((L - lo) / (hi - lo), 0, 1);
        c.fillStyle = Leq >= 85 ? C.bad : Leq >= 80 ? C.warn : C.ok; c.fillRect(bx, yy(Leq), bw, y0 - yy(Leq));
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(bx, y1, bw, y0 - y1);
        c.fillStyle = C.faint; c.fillRect(bx + bw + 14, yy(Lb), bw * 0.5, y0 - yy(Lb));
        for (const [L, txt] of [[80, '80 lower action'], [85, '85 upper action'], [87, '87 limit']]) {
          c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(bx - 6, yy(L)); c.lineTo(bx + bw * 1.9 + 14, yy(L)); c.stroke(); c.setLineDash([]);
          kit.label(c, txt, bx + bw * 1.9 + 20, yy(L), { size: 11, color: C.muted, align: 'left' });
        }
        kit.label(c, 'L_EX,8h', bx + bw / 2, y0 + 12, { size: 11, color: C.text }); kit.label(c, 'burst', bx + bw + 14 + bw * 0.25, y0 + 12, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ seq-trouble */
  const FAULTS = [
    { part: 'source', sym: 'Nothing moves. The gauge after the service unit reads zero and there is no sound of air anywhere.', why: 'No air reaches the circuit: the supply is shut off (or the main line is dumped). Check the shut-off valve and the compressor before anything else.' },
    { part: 'frl', kind: 'filter', sym: 'Both strokes are slow. At rest the gauge reads 6 bar, but it sinks to about 3 bar each time the cylinder moves, and the filter bowl is dark.', why: 'A clogged filter element: at rest there is no flow and no pressure drop; as soon as air flows, the dirty element throttles it. Replace the element.' },
    { part: 'frl', kind: 'reg', sym: 'Both strokes are slow and the clamp is weak. The gauge reads 2.5 bar even at rest.', why: 'The regulator is set too low (or its spring has weakened). The pressure at rest shows it directly — set it back and lock the knob.' },
    { part: 'fcB', sym: 'The cylinder extends very slowly but smoothly, and retracts at normal speed.', why: 'Meter-out: extending, the air leaves from the rod end through its speed controller. That controller is nearly closed.' },
    { part: 'fcA', sym: 'The cylinder retracts very slowly and extends at normal speed.', why: 'Retracting, the air leaves from the cap end through the cap-end speed controller: it is nearly closed.' },
    { part: 'cyl', sym: 'Fully extended and at rest, air hisses steadily from the valve\'s exhaust. The cylinder is slower than before and cannot hold its full force.', why: 'The piston seal leaks: air passes from the pressurised cap end to the rod end, which is open to exhaust through the valve. Re-seal or replace the cylinder.' },
    { part: 'valve', sym: 'The cylinder extends when the solenoid is energised, but stays out when it is switched off — tapping the valve body sometimes brings it back.', why: 'The 5/2 valve does not return: a broken return spring or a spool sticking in varnish or dirt. Clean or replace the valve, and check the air quality.' },
    { part: 'fitA', sym: 'A constant hiss near the cylinder\'s cap-end fitting. The cylinder extends slowly and soapy water foams at that fitting.', why: 'A leaking fitting (or a split tube) on the cap-end line: the leak takes part of the flow and all the time costs energy.' }
  ];
  Hyper.sim('seq-trouble', {
    title: 'Troubleshooting: find the fault',
    blurb: `A cylinder circuit with one hidden fault. Watch how it behaves, read the symptoms, and click the component you would check first. Good troubleshooting starts from the evidence — the gauge at rest and in motion, which stroke is slow, where the air hisses — and from the simplest cause.

**Try this**
- Compare the gauge at rest and while the cylinder moves: it separates a clogged filter from a low regulator setting.
- One slow stroke points at one speed controller; which one depends on which end exhausts during that stroke (meter-out).
- A hiss from the valve exhaust with the cylinder at rest points past the valve — into the cylinder.

> [!warn] On a real machine, isolate and exhaust the air before touching components, and search for leaks with a leak-detection spray or an ultrasonic detector, never with your hands near a jet.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      let fault, cyl, s, score = { right: 0, tries: 0 }, answer = '', hit = [];
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'new', label: 'New fault', primary: true }, { id: 'show', label: 'Show the answer' }] }
      ], (id) => { if (id === 'new') pick(); if (id === 'show') { answer = 'The fault: ' + FAULTS[fault].why; s.done = true; } });
      const ro = kit.readout(box.side, [['sym', 'Symptoms'], ['you', 'Your answer'], ['score', 'Score']]);
      function pick() {
        let f; do { f = Math.floor(Math.random() * FAULTS.length); } while (f === fault && FAULTS.length > 1);
        fault = f; answer = ''; s = { t: 0, cmd: 1, wait: 0, done: false, gauge: 6 };
        const fl = FAULTS[fault], o = { bore: 0.04, rod: 0.016, stroke: 0.15, mass: 3, load: 60 };
        if (fl.kind === 'reg') o.psupply = 2.5e5 + PATM;
        cyl = F.pneuCylinder(o);
        const P = cyl.params;
        P.Cvalve = 1e-8; P.CthrottleA = P.CthrottleB = 1.5e-8;
        if (fl.part === 'fcB') P.CthrottleB = 0.12e-8; if (fl.part === 'fcA') P.CthrottleA = 0.12e-8;
        if (fl.kind === 'filter') P.Cvalve = 0.3e-8;
        if (fl.part === 'fitA') P.Cvalve = 0.45e-8;
        if (fl.part === 'cyl') { P.load = 250; P.Cvalve = 0.6e-8; }
      }
      pick();
      kit.click(st, p => {
        const g = grid(st, 760, 420), q = toGrid(g, p);
        const h = hit.find(r => q.x >= r.x0 && q.x <= r.x1 && q.y >= r.y0 && q.y <= r.y1);
        if (!h || s.done) return;
        score.tries++;
        if (h.part === FAULTS[fault].part) { score.right++; answer = 'Yes — ' + h.name + '. ' + FAULTS[fault].why; s.done = true; }
        else answer = 'Not the ' + h.name + '. Look again at the symptoms.';
      }, p => { const q = toGrid(grid(st, 760, 420), p); return hit.some(r => q.x >= r.x0 && q.x <= r.x1 && q.y >= r.y0 && q.y <= r.y1); });
      const loop = kit.loop((dt) => {
        const fl = FAULTS[fault], P = cyl.params, h = Math.min(dt, 0.05) * 0.5;
        const noAir = fl.part === 'source';
        if (!noAir) {
          const atEnd = s.cmd === 1 ? cyl.state.x >= P.stroke - 1e-4 : cyl.state.x <= 1e-4;
          if (atEnd) { s.wait += h; if (s.wait > 0.6) { s.cmd = 1 - s.cmd; s.wait = 0; } }
          const cmdEff = fl.part === 'valve' && s.cmd === 0 ? 1 : s.cmd;     // a valve that does not return
          cyl.step(h, cmdEff);
        }
        s.t += h;
        const moving = Math.abs(cyl.state.v) > 0.01;
        s.gauge = noAir ? 0 : fl.kind === 'reg' ? 2.5 : fl.kind === 'filter' && moving ? 3 : 6;
        ro.set('sym', fl.sym); ro.set('you', answer || 'click a component on the diagram'); ro.set('score', score.right + ' found in ' + score.tries + ' tries');
        // ---- drawing
        const c = st.begin(), C = kit.colors(), g = grid(st, 760, 420);
        enter(c, g);
        hit = [];
        const box = (x0, y0, x1, y1, part, name) => hit.push({ x0, y0, x1, y1, part, name });
        const pos = cyl.state.x / P.stroke, pA = cyl.state.pA - PATM, pB = cyl.state.pB - PATM;
        const fillP = p => p > 0.2e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.1 + 0.4 * p / 6e5) + ')' : null;
        const cy = S.cylinder(c, 230, 70, { len: 260, h: 40, rodLen: 120, pos, fillA: fillP(pA), fillB: fillP(pB) });
        box(220, 40, 500, 100, 'cyl', 'cylinder');
        const fA = S.flowControl(c, 238, 160, { free: 'up' }), fB = S.flowControl(c, 482, 160, { free: 'up' });
        box(222, 128, 272, 192, 'fcA', 'cap-end speed controller'); box(466, 128, 516, 192, 'fcB', 'rod-end speed controller');
        S.line(c, [cy.A, [238, 132]], { state: pA > 0.2e5 ? 'air' : 'idle' }); S.line(c, [cy.B, [482, 132]], { state: pB > 0.2e5 ? 'air' : 'idle' });
        const v = S.valve(c, 360, 270, { spec: '5/2', state: (fl.part === 'valve' ? 1 : s.cmd) ? 0 : 1, left: 'solenoid', right: 'spring', s: 32, pneumatic: true, labels: true, exhaust: 'silencer' });
        box(v.xl - 4, 245, v.xr + 4, 300, 'valve', '5/2 valve');
        S.line(c, [fA.a, [238, 215], [v.B[0], 215], v.B], { state: pA > 0.2e5 ? 'air' : 'idle' }); S.line(c, [fB.a, [482, 215], [v.A[0], 215], v.A], { state: pB > 0.2e5 ? 'air' : 'idle' });
        box(226, 200, 250, 230, 'fitA', 'cap-end fitting and tube');
        S.line(c, [v.P, [v.P[0], 360], [308, 360]], { state: noAir ? 'idle' : 'air' });
        S.frl(c, 250, 360); box(170, 330, 305, 395, 'frl', 'service unit (filter, regulator)');
        S.gauge(c, 250, 318 - 20, { frac: s.gauge / 10, value: s.gauge.toFixed(1) + ' bar' });
        S.line(c, [[192, 360], [110, 360]], { state: noAir ? 'idle' : 'air' }); S.source(c, 100, 380, { pneumatic: true }); box(80, 350, 125, 400, 'source', 'air supply');
        // hiss marks for leaks
        const hiss = (x, y) => { for (let k = 1; k <= 3; k++) { c.strokeStyle = 'hsl(8 80% 60% / ' + (0.8 - 0.2 * k) + ')'; c.beginPath(); c.arc(x, y, 5 + k * 5 + 3 * Math.sin(s.t * 20), -0.8, 0.8); c.stroke(); } };
        if (fl.part === 'fitA') hiss(250, 215);
        if (fl.part === 'cyl' && s.cmd === 1 && cyl.state.x >= P.stroke - 1e-4) hiss(v.S[0] + 10, v.S[1] + 12);
        if (fl.kind === 'filter') { c.fillStyle = 'hsl(30 40% 30% / .6)'; c.fillRect(214, 368, 16, 10); }
        kit.label(c, 'click the component you would check first', 380, 408, { size: 12, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
