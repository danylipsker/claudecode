/* The Puzzle Cabinet · engines/rings.js
 *
 * The Chinese rings (baguenaudier) and Spin-Out. Rings hang on a wire loop.
 * Ring 1, at the far end, can always go on or off. Any other ring k can go on
 * or off only when ring k − 1 is on the loop and every ring below k − 1 is
 * off. Those are the whole rules, and they make the positions line up in a
 * single long road: the order of a Gray code.
 *
 * Move rule: one ring at a time ("single"). The variant rule "double" also
 * lets rings 1 and 2 go on or off together, in one move, when both are on or
 * both are off. Par is found by breadth-first search over all 2ⁿ positions;
 * for the single rule, n rings take ⌈2ⁿ⁺¹/3⌉ − 1 moves to come off.
 *
 * data: {
 *   n: 5,                       rings (up to 10)
 *   start: [1, 1, 1, 1, 1],     ring 1 first: 1 = on the loop, 0 = off
 *   goal:  [0, 0, 0, 0, 0],
 *   rule: 'single' | 'double',
 *   look: 'rings' | 'spinout'   Spin-Out: spinners in a case; on = locked (across), off = turned upright
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const toInt = (bits) => bits.reduce((s, b, k) => s | ((b ? 1 : 0) << k), 0);
  const toBits = (s, n) => Array.from({ length: n }, (_, k) => (s >> k) & 1);

  function model(d) {
    const n = d.n, dbl = d.rule === 'double';
    const size = 1 << n, goal = toInt(d.goal);
    let dist = null;
    function can(s, k) {
      if (k === 0) return true;
      if (!((s >> (k - 1)) & 1)) return false;
      return (s & ((1 << (k - 1)) - 1)) === 0;
    }
    const pairOK = (s) => dbl && n >= 2 && (s & 1) === ((s >> 1) & 1);
    function moves(s) {
      const out = [];
      for (let k = 0; k < n; k++) if (can(s, k)) out.push({ k, s: s ^ (1 << k) });
      if (pairOK(s)) out.push({ k: -1, s: s ^ 3 });
      return out;
    }
    function table() {
      if (dist) return dist;
      dist = new Int32Array(size).fill(-1);
      const q = new Int32Array(size);
      let qh = 0, qt = 0;
      dist[goal] = 0; q[qt++] = goal;
      while (qh < qt) {
        const s = q[qh++];
        for (const m of moves(s)) if (dist[m.s] < 0) { dist[m.s] = dist[s] + 1; q[qt++] = m.s; }
      }
      return dist;
    }
    function best(s) {
      const tab = table(), cur = tab[s];
      if (cur <= 0) return null;
      // prefer single-ring moves, then the pair
      const ms = moves(s).sort((a, b) => (a.k < 0) - (b.k < 0));
      for (const m of ms) if (tab[m.s] === cur - 1) return m;
      return null;
    }
    return { n, dbl, size, goal, start: d.start ? toInt(d.start) : 0, can, pairOK, moves, table, best, dist: (s) => table()[s] };
  }

  function parOf(d) { const M = model(d); return M.dist(M.start); }
  function pathFrom(M, s) {
    const out = [];
    for (let g = 0; g < 5000; g++) { const m = M.best(s); if (!m) break; out.push(m); s = m.s; }
    return out;
  }

  // inverse Gray code: how many single moves from all-off (ring 1 = the lowest bit)
  function grayRank(s) { let b = 0; for (; s; s >>= 1) b ^= s; return b; }

  /* ---------- words ---------- */

  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const W = (k) => WORDS[k] || String(k);
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const isSpin = (d) => d.look === 'spinout';
  const unit = (d, pl) => (isSpin(d) ? (pl ? 'spinners' : 'spinner') : (pl ? 'rings' : 'ring'));
  const allOf = (bits, v) => bits.every((b) => b === v);

  function goalText(d) {
    const u = unit(d, true);
    if (allOf(d.goal, 0)) return isSpin(d) ? 'Turn every spinner **upright**, so the slider can come out of its case.' : 'Take every ring **off** the loop.';
    if (allOf(d.goal, 1)) return isSpin(d) ? 'Turn every spinner **across** (locked).' : 'Put every ring **on** the loop.';
    return 'Make the pattern in the **Goal** row: ● ' + (isSpin(d) ? 'across' : 'on the loop') + ', ○ ' + (isSpin(d) ? 'upright' : 'off') + '. (' + cap1(u) + ' are numbered from the ' + (isSpin(d) ? 'right' : 'far end') + '.)';
  }
  function ruleText(d) {
    if (isSpin(d)) return 'Spinner 1 (on the right) can always turn. Any other spinner can turn only when the one just to its right is **across** and every spinner beyond that is **upright**.';
    let s = 'Ring 1 (at the far end) can always go on or off. Any other ring can move only when the ring just before it is **on** the loop and every ring before that is **off**.';
    if (d.rule === 'double') s += ' In this puzzle rings 1 and 2 may also go on or off **together**, as one move, when both are on or both are off.';
    return s;
  }
  function moveWords(d, s, m) {
    if (m.k < 0) return ((s & 1) ? 'Take rings 1 and 2 off together.' : 'Put rings 1 and 2 on together.');
    const on = (s >> m.k) & 1;
    if (isSpin(d)) return 'Turn spinner ' + (m.k + 1) + (on ? ' upright.' : ' across.');
    return (on ? 'Take ring ' + (m.k + 1) + ' off the loop.' : 'Put ring ' + (m.k + 1) + ' back on the loop.');
  }
  function whyNot(d, s, k) {
    const u = isSpin(d) ? 'Spinner' : 'Ring', on = isSpin(d) ? 'across' : 'on', off = isSpin(d) ? 'upright' : 'off';
    if (k === 1) return u + ' 2 is stuck: it can move only while ' + u.toLowerCase() + ' 1 is ' + on + '.';
    const below = k - 1 === 1 ? u.toLowerCase() + ' 1' : u.toLowerCase() + 's 1–' + (k - 1);
    return u + ' ' + (k + 1) + ' is stuck: it can move only while ' + u.toLowerCase() + ' ' + k + ' is ' + on + ' and ' + below + ' ' + (k - 1 === 1 ? 'is' : 'are') + ' ' + off + '.';
  }

  /* ---------- making puzzles ---------- */

  const BANDS = [null, [2, 5], [6, 12], [13, 25], [26, 60], [61, 200]];
  function diffOf(par) { return par <= 5 ? 1 : par <= 12 ? 2 : par <= 25 ? 3 : par <= 60 ? 4 : 5; }

  // kind: 'off' 'on' 'partial' 'pattern'
  function build(kind, rng, level, opts) {
    opts = opts || {};
    const band = opts.band || BANDS[level];
    const rule = opts.rule || 'single', look = opts.look || 'rings';
    const n = opts.n || [0, rng.pick([2, 3]), 4, 5, 6, rng.pick([7, 8])][level];
    const all = (v) => Array.from({ length: n }, () => v);
    if (kind === 'off') return { n, start: all(1), goal: all(0), rule, look };
    if (kind === 'on') return { n, start: all(0), goal: all(1), rule, look };
    const goal = kind === 'pattern' ? toBits(1 + rng.int((1 << n) - 2), n) : all(rng() < 0.75 ? 0 : 1);
    const d = { n, start: null, goal, rule, look };
    const tab = model(d).table(), pick = [];
    for (let s = 0; s < tab.length; s++) if (tab[s] >= band[0] && tab[s] <= band[1]) pick.push(s);
    if (!pick.length) return null;
    d.start = toBits(pick[rng.int(pick.length)], n);
    return d;
  }
  function titleOf(d, kind) {
    const u = unit(d, true), n = d.n;
    if (kind === 'off') return (isSpin(d) ? 'Spin-Out, ' + W(n) + ' spinners' : cap1(W(n)) + ' rings') + (d.rule === 'double' ? ', quick pair' : '');
    if (kind === 'on') return (isSpin(d) ? 'Lock ' + W(n) + ' spinners' : cap1(W(n)) + ' rings back on');
    if (kind === 'pattern') return 'A pattern of ' + W(n) + ' ' + u;
    return 'Halfway with ' + W(n) + ' ' + u;
  }
  function textOf(d, kind) {
    const n = d.n;
    if (isSpin(d)) {
      if (kind === 'off') return 'A Spin-Out slider with ' + W(n) + ' spinners, all turned across, locked in its case. Turn them all upright so the slider comes free.';
      return cap1(W(n)) + ' spinners, some across and some upright. ' + goalText(d).replace(/\*\*/g, '');
    }
    if (kind === 'off') return cap1(W(n)) + ' rings hang on the wire loop. Take them all off.' + (d.rule === 'double' ? ' This time rings 1 and 2 may travel together as one move.' : '');
    if (kind === 'on') return 'All ' + W(n) + ' rings are off the loop. Put every one of them back on.';
    if (kind === 'pattern') return cap1(W(n)) + ' rings, some on the loop and some off. Rearrange them into the pattern of the goal row.';
    return 'Somebody gave up halfway: ' + W(n) + ' rings, some on and some off. ' + (allOf(d.goal, 0) ? 'Take them all off.' : 'Put them all on.');
  }

  /* ---------- drawing ---------- */

  const SP = 50, RX = 12, RY = 30, DROP = 44, ROD = 84, X0 = 116;
  function layout(d) {
    const n = d.n;
    const x = (k) => X0 + (n - 1 - k) * SP;
    return { n, x, xE: x(0) + 42, W: x(0) + 60 };
  }
  const f1 = (v) => Math.round(v * 10) / 10;

  function sceneSVG(d, bits) {
    const L = layout(d), n = d.n;
    let s = '';
    if (isSpin(d)) {
      s += '<rect x="' + (X0 - 44) + '" y="-34" width="' + (L.xE - X0 + 50) + '" height="68" rx="20" fill="#2a8f8a"/>';
      s += '<rect x="' + (X0 - 34) + '" y="-24" width="' + (L.xE - X0 + 30) + '" height="48" rx="14" fill="#1d6662"/>';
      bits.forEach((b, k) => {
        const x = L.x(k);
        s += '<circle cx="' + x + '" cy="0" r="18" fill="#e9f1f0"/>';
        s += '<rect x="' + (x - 14) + '" y="-5" width="28" height="10" rx="5" fill="#1d6662" transform="rotate(' + (b ? 0 : 90) + ' ' + x + ' 0)"/>';
      });
      return s;
    }
    s += '<rect x="' + (X0 - 30) + '" y="96" width="' + (L.xE - X0 + 18) + '" height="9" rx="4" fill="#8f96a8"/>';
    s += '<rect x="6" y="-13" width="52" height="26" rx="12" fill="#b07a42"/>';
    bits.forEach((b, k) => {
      const x = L.x(k), y = b ? 0 : DROP;
      s += '<line x1="' + x + '" y1="' + (y + RY) + '" x2="' + x + '" y2="' + (y + RY + ROD) + '" stroke="#9aa1b3" stroke-width="3"/>';
      if (!b) s += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + RX + '" ry="' + RY + '" fill="none" stroke="#c9a14a" stroke-width="5"/>';
    });
    s += '<path d="M56 -7H' + L.xE + 'A7 7 0 0 1 ' + L.xE + ' 7H56" fill="none" stroke="#c9cfdd" stroke-width="3.5"/>';
    bits.forEach((b, k) => { if (b) s += '<ellipse cx="' + L.x(k) + '" cy="0" rx="' + RX + '" ry="' + RY + '" fill="none" stroke="#e0b44c" stroke-width="5"/>'; });
    return s;
  }

  C.engine({
    id: 'rings',
    name: 'Chinese rings',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about(p) {
      const d = p && p.data || { n: 5, goal: [] };
      return 'Click a ' + unit(d) + ' to ' + (isSpin(d) ? 'turn it' : 'slide it on or off the loop') + ' (or press its number, 1–' + Math.min(9, d.n) + '). ' + ruleText(d) +
        (d.rule === 'double' ? ' Click the **1+2** bracket (or press D) to move rings 1 and 2 together.' : '') +
        ' A move against the rules is refused with a note saying why. The par is the fewest moves.';
    },

    generate(rng, level) {
      const pools = [null, ['off', 'on', 'partial', 'off'], ['off', 'on', 'partial', 'pattern'], ['off', 'partial', 'pattern', 'partial'], ['off', 'partial', 'pattern', 'partial'], ['off', 'partial', 'pattern', 'partial']];
      const band = BANDS[level];
      for (let tries = 0; tries < 12; tries++) {
        const kind = rng.pick(pools[level]);
        const opts = { look: rng() < 0.3 ? 'spinout' : 'rings', rule: rng() < 0.2 ? 'double' : 'single' };
        if (opts.look === 'spinout') opts.rule = 'single';
        if (kind === 'off' || kind === 'on') {
          // pick the number of rings that lands in the band
          const ns = [];
          for (let n = 2; n <= 9; n++) { const p = parOf({ n, start: Array(n).fill(kind === 'off' ? 1 : 0), goal: Array(n).fill(kind === 'off' ? 0 : 1), rule: opts.rule }); if (p >= band[0] && p <= band[1]) ns.push(n); }
          if (!ns.length) continue;
          opts.n = rng.pick(ns);
        }
        const d = build(kind, rng, level, opts);
        if (!d) continue;
        const par = parOf(d);
        if (!(par >= band[0] && par <= band[1])) continue;
        return { title: titleOf(d, kind), text: textOf(d, kind), data: d, par, diff: level };
      }
      return null;
    },

    verify(p) {
      const d = p.data;
      if (!d || !d.n || !d.start || !d.goal) return { ok: false, err: 'n, start and goal are needed' };
      if (d.n < 1 || d.n > 10) return { ok: false, err: 'between 1 and 10 rings' };
      if (d.start.length !== d.n || d.goal.length !== d.n) return { ok: false, err: 'start and goal need one entry per ring' };
      if (d.rule && !['single', 'double'].includes(d.rule)) return { ok: false, err: 'unknown rule ' + d.rule };
      const par = parOf(d);
      if (par < 0) return { ok: false, err: 'the goal cannot be reached' };
      if (par === 0) return { ok: false, err: 'already solved at the start' };
      if (!d.rule || d.rule === 'single') {
        // the single-move road is a Gray code: check the search against the formula
        const g = Math.abs(grayRank(toInt(d.start)) - grayRank(toInt(d.goal)));
        if (g !== par) return { ok: false, err: 'search and Gray code disagree: ' + par + ' vs ' + g };
      }
      if (p.par != null && p.par !== par) return { ok: false, err: 'par is ' + p.par + ' but the fewest moves is ' + par };
      return { ok: true, par };
    },

    mount(ctx, p) {
      const d = p.data, wb = ctx.wb, M = model(d), L = layout(d), n = d.n;
      const S = ctx.s, spin = isSpin(d);
      let s = M.start, hov = -2, solving = false, dead = false, hintK = null, showBits = true;
      const timers = [];
      const later = (fn, ms) => { const t = setTimeout(() => { const i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); if (!dead) fn(); }, ms); timers.push(t); return t; };
      const pattern = !allOf(d.goal, 0) && !allOf(d.goal, 1);
      ctx.setGoal(goalText(d));

      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      const yReg = spin ? 64 : 186;
      const y1 = yReg + (pattern ? 44 : 22);
      wb.setBounds({ x0: 0, y0: d.rule === 'double' ? -80 : -64, x1: L.W, y1 }, 0.06);
      const pre = 'rg' + (++uid);
      const defs = S('defs', null, bg);
      defs.innerHTML =
        '<linearGradient id="' + pre + '-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dca565"/><stop offset=".6" stop-color="#b07a42"/><stop offset="1" stop-color="#7a4c1a"/></linearGradient>' +
        '<linearGradient id="' + pre + '-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4e8f0"/><stop offset=".5" stop-color="#9aa1b3"/><stop offset="1" stop-color="#5d6478"/></linearGradient>' +
        '<linearGradient id="' + pre + '-case" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43b3ad"/><stop offset=".55" stop-color="#2a8f8a"/><stop offset="1" stop-color="#1b625e"/></linearGradient>' +
        '<radialGradient id="' + pre + '-knob" cx=".38" cy=".34" r=".72"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#dfe9e8"/><stop offset="1" stop-color="#9fb3b1"/></radialGradient>';
      const url = (k) => 'url(#' + pre + '-' + k + ')';

      const cols = [];
      const gCols = S('g', null, bg);
      for (let k = 0; k < n; k++) cols.push(S('rect', { x: L.x(k) - SP / 2 + 3, y: spin ? -44 : -58, width: SP - 6, height: spin ? 88 : 236, rx: 14, class: 'rg-col' }, gCols));

      const parts = []; // per ring: groups that move together
      const gRods = S('g', null, board), gBack = S('g', null, board), gMid = S('g', null, board), gFront = S('g', null, board);
      let slider = null;
      if (spin) {
        S('rect', { x: X0 - 46, y: -32, width: L.xE - X0 + 54, height: 70, rx: 22, class: 'rg-shadow' }, bg);
        S('rect', { x: X0 - 44, y: -34, width: L.xE - X0 + 50, height: 68, rx: 20, fill: url('case') }, gRods);
        S('rect', { x: X0 - 44, y: -34, width: L.xE - X0 + 50, height: 68, rx: 20, class: 'rg-case-edge' }, gRods);
        S('rect', { x: X0 - 34, y: -24, width: L.xE - X0 + 30, height: 48, rx: 14, class: 'rg-channel' }, gRods);
        S('rect', { x: L.xE - 10, y: -9, width: 22, height: 18, rx: 6, class: 'rg-gate' }, gRods);
        slider = S('g', { class: 'rg-slider' }, gMid);
        S('rect', { x: X0 - 30, y: -8, width: L.xE - X0 + 20, height: 16, rx: 8, class: 'rg-strip' }, slider);
        for (let k = 0; k < n; k++) {
          const g = S('g', { class: 'rg-spinner', transform: 'translate(' + L.x(k) + ' 0)' }, slider);
          const gin = S('g', null, g);
          S('circle', { r: 19.5, class: 'rg-knob-rim' }, gin);
          S('circle', { r: 18, fill: url('knob') }, gin);
          const rot = S('g', { class: 'rg-rotor' }, gin);
          S('rect', { x: -15, y: -5.5, width: 30, height: 11, rx: 5.5, class: 'rg-bar' }, rot);
          S('circle', { cx: -9, cy: 0, r: 1.8, class: 'rg-dot' }, rot);
          S('circle', { cx: 9, cy: 0, r: 1.8, class: 'rg-dot' }, rot);
          parts.push({ all: [g], rot, shake: [gin] });
        }
      } else {
        // the bar with the rods, the handle and the loop
        S('rect', { x: X0 - 32, y: 97, width: L.xE - X0 + 22, height: 12, rx: 5, class: 'rg-shadow' }, bg);
        for (let k = 0; k < n; k++) {
          const rod = S('g', { class: 'rg-part' }, gRods);
          S('line', { x1: 0, y1: RY, x2: 0, y2: RY + ROD, class: 'rg-rod' }, rod);
          S('circle', { cx: 0, cy: RY + ROD + 3, r: 4.5, class: 'rg-knob' }, rod);
          const back = S('g', { class: 'rg-part' }, gBack);
          const inB = S('g', null, back);
          S('path', { d: 'M0 ' + (-RY) + 'A' + RX + ' ' + RY + ' 0 0 0 0 ' + RY, class: 'rg-ring-dark' }, inB);
          S('path', { d: 'M0 ' + (-RY) + 'A' + RX + ' ' + RY + ' 0 0 0 0 ' + RY, class: 'rg-ring' }, inB);
          const front = S('g', { class: 'rg-part' }, gFront);
          const inF = S('g', null, front);
          S('path', { d: 'M0 ' + (-RY) + 'A' + RX + ' ' + RY + ' 0 0 1 0 ' + RY, class: 'rg-ring-dark' }, inF);
          S('path', { d: 'M0 ' + (-RY) + 'A' + RX + ' ' + RY + ' 0 0 1 0 ' + RY, class: 'rg-ring' }, inF);
          S('path', { d: 'M1.5 ' + (-RY + 6) + 'A' + (RX - 3) + ' ' + (RY - 6) + ' 0 0 1 ' + (RX - 2.5) + ' 0', class: 'rg-ring-shine' }, inF);
          parts.push({ all: [rod, back, front], shake: [inB, inF] });
        }
        S('rect', { x: X0 - 30, y: 96, width: L.xE - X0 + 18, height: 10, rx: 4, fill: url('bar') }, gMid);
        for (let k = 0; k < n; k++) S('ellipse', { cx: L.x(k), cy: 97.5, rx: 4, ry: 1.6, class: 'rg-hole' }, gMid);
        // the loop: its back wire behind the rings' front halves, its front wire too (both pass through a ring on the loop)
        S('path', { d: 'M56 -7H' + L.xE + 'A7 7 0 0 1 ' + L.xE + ' 7H56', class: 'rg-wire-dark' }, gMid);
        S('path', { d: 'M56 -7H' + L.xE + 'A7 7 0 0 1 ' + L.xE + ' 7H56', class: 'rg-wire' }, gMid);
        S('rect', { x: 4, y: -15, width: 56, height: 30, rx: 13, fill: url('wood') }, gMid);
        S('path', { d: 'M12 -9C26 -12 40 -11 54 -8M12 3C28 1 40 2 54 5', class: 'rg-handle-grain' }, gMid);
      }
      // numbers above, the 0/1 register (and the goal) below
      const gNums = S('g', { class: 'rg-nums' }, bg);
      for (let k = 0; k < n; k++) S('text', { x: L.x(k), y: spin ? -44 : -44, 'text-anchor': 'middle', text: String(k + 1) }, gNums);
      const gReg = S('g', { class: 'rg-reg' }, top);
      const regCells = [];
      S('text', { x: X0 - 40, y: yReg + 5, 'text-anchor': 'end', class: 'rg-reg-label', text: spin ? 'across' : 'on' }, gReg);
      for (let k = 0; k < n; k++) {
        S('rect', { x: L.x(k) - 13, y: yReg - 13, width: 26, height: 26, rx: 6, class: 'rg-cell' }, gReg);
        regCells.push(S('text', { x: L.x(k), y: yReg + 6, 'text-anchor': 'middle', class: 'rg-bit' }, gReg));
      }
      if (pattern) {
        S('text', { x: X0 - 40, y: yReg + 31, 'text-anchor': 'end', class: 'rg-reg-label goal', text: 'goal' }, gReg);
        for (let k = 0; k < n; k++) S('circle', { cx: L.x(k), cy: yReg + 27, r: 6, class: 'rg-goal' + (d.goal[k] ? ' on' : '') }, gReg);
      }
      let pairEl = null;
      if (d.rule === 'double' && n >= 2) {
        pairEl = S('g', { class: 'rg-pair' }, top);
        const xa = L.x(1), xb = L.x(0);
        S('rect', { x: xa - 18, y: -78, width: xb - xa + 36, height: 22, rx: 11, class: 'rg-pair-bg' }, pairEl);
        S('text', { x: (xa + xb) / 2, y: -62.5, 'text-anchor': 'middle', class: 'rg-pair-t', text: 'move 1 + 2' }, pairEl);
      }

      function placeRing(k, on, instant) {
        const P = parts[k];
        if (spin) {
          P.rot.style.transitionDuration = instant ? '0ms' : C.anim(260) + 'ms';
          P.rot.style.transform = 'rotate(' + (on ? 0 : 90) + 'deg)';
          return;
        }
        const y = on ? 0 : DROP;
        P.all.forEach((g) => {
          g.style.transitionDuration = instant ? '0ms' : C.anim(340) + 'ms';
          g.style.transform = 'translate(' + L.x(k) + 'px,' + y + 'px)';
        });
      }
      function draw(instant) {
        for (let k = 0; k < n; k++) {
          const on = (s >> k) & 1;
          placeRing(k, on, instant);
          regCells[k].textContent = on ? '1' : '0';
          regCells[k].classList.toggle('on', !!on);
          const can = M.can(s, k);
          cols[k].classList.toggle('hov', hov === k);
          cols[k].classList.toggle('can', hov === k && can && !solving);
          cols[k].classList.toggle('cant', hov === k && !can && !solving);
          cols[k].classList.toggle('hint', hintK != null && (hintK === k || (hintK === -1 && k < 2)));
        }
        gReg.classList.toggle('hidden', !showBits);
        if (pairEl) {
          pairEl.classList.toggle('can', M.pairOK(s));
          pairEl.classList.toggle('hint', hintK === -1);
        }
        if (slider) slider.classList.toggle('free', s === 0 && M.goal === 0);
      }

      function toggle(k, silent) {
        if (k === -1) {
          if (!M.pairOK(s)) { ctx.say(d.rule === 'double' ? 'Rings 1 and 2 move together only when both are on or both are off.' : '', 'warn'); ctx.sfx('tap'); return false; }
          s ^= 3;
        } else {
          if (!M.can(s, k)) { ctx.say(whyNot(d, s, k), 'warn'); ctx.sfx('tap'); nudge(k); return false; }
          s ^= 1 << k;
        }
        hintK = null;
        draw();
        if (!silent) {
          ctx.sfx(spin ? 'tap' : 'snap');
          ctx.say('');
          ctx.move();
          ctx.changed('move');
        }
        return true;
      }
      function nudge(k) {
        parts[k].shake.forEach((g) => { g.classList.remove('rg-nudge'); void g.getBBox; g.classList.add('rg-nudge'); });
        later(() => parts[k].shake.forEach((g) => g.classList.remove('rg-nudge')), 420);
      }
      function ringAt(pt) {
        const i = Math.round((pt[0] - X0) / SP);
        if (i < 0 || i >= n || Math.abs(pt[0] - (X0 + i * SP)) > SP / 2) return -2;
        if (pairEl && pt[1] < -54 && pt[1] > -82) return (i >= n - 2) ? -1 : -2;
        if (pt[1] < (spin ? -48 : -62) || pt[1] > (spin ? 48 : 180)) return -2;
        return n - 1 - i;
      }

      wb.handlers.board = {
        down(pt) {
          if (solving) return true;
          const k = ringAt(pt);
          if (k === -2) return false;
          toggle(k);
          return true;
        },
        hover(pt) {
          const k = ringAt(pt);
          if (k !== hov) { hov = k; draw(true); }
        }
      };

      const box = ctx.h('label.rg-opt', ctx.h('input', { type: 'checkbox', checked: true, onchange: (e) => { showBits = e.target.checked; draw(true); } }), ' Show the 0s and 1s');
      ctx.panel.appendChild(box);

      draw(true);

      return {
        check() {
          if (s === M.goal) return { solved: true, msg: allOf(d.goal, 0) ? (spin ? 'Every spinner is upright — the slider slips out.' : 'Every ring is off the loop.') : allOf(d.goal, 1) ? 'Every ' + unit(d) + ' is ' + (spin ? 'locked across.' : 'on the loop.') : 'The pattern matches.' };
          return { solved: false, msg: 'Not yet.' };
        },
        hint() {
          const m = M.best(s), left = M.dist(s);
          if (left === 0) return 'You are there already!';
          if (!m) return 'Something is wrong — undo a move.';
          return {
            text: moveWords(d, s, m) + ' (From here the goal is ' + C.plural(left, 'move') + ' away.)',
            show() { hintK = m.k; draw(true); later(() => { if (hintK === m.k) { hintK = null; draw(true); } }, 2800); }
          };
        },
        solve() {
          const path = pathFrom(M, s);
          hintK = null;
          if (!path.length) { ctx.changed('solve'); return; }
          solving = true;
          ctx.lockUndo(true);
          const stepMs = Math.max(70, Math.min(520, 36000 / path.length));
          let i = 0;
          const next = () => {
            if (i >= path.length) { solving = false; ctx.lockUndo(false); draw(); ctx.changed('solve'); return; }
            toggle(path[i++].k, true);
            ctx.move();
            later(next, C.anim(stepMs));
          };
          next();
        },
        explain() {
          const par = M.dist(M.start);
          let t = 'The fewest moves is **' + par + '**.';
          if (d.rule !== 'double') {
            t += ' Read the ' + unit(d, true) + ' as a binary number, ' + unit(d) + ' ' + n + ' on the left, 1 for ' + (spin ? 'across' : 'on') + ': here the start is ' + toBits(M.start, n).reverse().join('') +
              '. The positions follow a [[c:gray-code|Gray code]]: each move changes one digit, and there is never a choice worth making — at every moment only two moves are possible, and one of them just undoes the last. Decode the Gray code (each binary digit is the running parity of the Gray digits from the left) and you get the number of moves from all-off: ' +
              toBits(M.start, n).reverse().join('') + ' → ' + grayRank(M.start) + '. The goal decodes to ' + grayRank(M.goal) + ', and the difference is the par.';
          } else {
            t += ' Moving rings 1 and 2 together saves a move each time the pair comes on or off, so the count drops to about two thirds of the single-ring road.';
          }
          return t;
        },
        getState() { return { s }; },
        setState(o) {
          if (!o || o.s == null) return;
          if (solving) { timers.forEach(clearTimeout); timers.length = 0; solving = false; ctx.lockUndo(false); }
          s = o.s; hintK = null;
          draw(true);
        },
        key(ev) {
          if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey || solving) return false;
          const k = parseInt(ev.key, 10);
          if (k >= 1 && k <= Math.min(9, n)) { toggle(k - 1); return true; }
          if ((ev.key === 'd' || ev.key === 'D') && d.rule === 'double') { toggle(-1); return true; }
          return false;
        },
        destroy() { dead = true; timers.forEach(clearTimeout); wb.handlers.board = null; }
      };
    },

    thumb(p) {
      const d = p.data, L = layout(d);
      const vb = isSpin(d) ? [X0 - 50, -44, L.xE - X0 + 62, 88] : [0, -40, L.W, 200];
      return '<svg viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid meet">' + sceneSVG(d, d.start) + '</svg>';
    }
  });

  let uid = 0;
  C.rings = { model, parOf, build, titleOf, textOf, diffOf, grayRank, toBits, toInt, BANDS };

  C.css('rings', `
    .rg-col { fill: transparent; cursor: pointer; transition: fill .15s; }
    .rg-col.can { fill: rgba(78, 203, 141, .12); }
    .rg-col.cant { fill: rgba(255, 107, 107, .08); cursor: not-allowed; }
    .rg-col.hint { fill: rgba(255, 209, 102, .2); animation: rgpulse 1s ease-in-out infinite; }
    .rg-shadow { fill: rgba(0, 0, 0, .25); transform: translate(3px, 5px); }
    .rg-part { transition-property: transform; transition-timing-function: cubic-bezier(.34, 1.36, .5, 1); pointer-events: none; }
    .rg-rod { stroke: #a9b0c2; stroke-width: 3; stroke-linecap: round; }
    .rg-knob { fill: #7d8598; }
    .rg-ring { fill: none; stroke: #e2b54c; stroke-width: 3.2; stroke-linecap: round; }
    .rg-ring-dark { fill: none; stroke: #7a5714; stroke-width: 6.4; stroke-linecap: round; }
    .rg-ring-shine { fill: none; stroke: rgba(255, 250, 220, .75); stroke-width: 1.3; stroke-linecap: round; }
    .rg-hole { fill: rgba(0, 0, 0, .45); }
    .rg-wire { fill: none; stroke: #e6eaf2; stroke-width: 2.2; stroke-linecap: round; }
    .rg-wire-dark { fill: none; stroke: #596075; stroke-width: 4.6; stroke-linecap: round; }
    .rg-handle-grain { fill: none; stroke: rgba(80, 40, 10, .35); stroke-width: 1; }
    .rg-nudge { animation: rgnudge .4s ease; }
    .rg-nums text { font: 700 13px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .rg-reg.hidden { display: none; }
    .rg-cell { fill: var(--panel-2); stroke: var(--line); }
    .rg-bit { font: 800 15px ui-monospace, "Cascadia Mono", Consolas, monospace; fill: var(--faint); }
    .rg-bit.on { fill: var(--gold); }
    .rg-reg-label { font: 600 11px "Segoe UI", system-ui, sans-serif; fill: var(--muted); letter-spacing: .06em; }
    .rg-reg-label.goal { fill: var(--gold); }
    .rg-goal { fill: none; stroke: var(--gold); stroke-width: 1.6; }
    .rg-goal.on { fill: var(--gold); }
    .rg-pair { cursor: pointer; opacity: .45; }
    .rg-pair.can { opacity: 1; }
    .rg-pair.hint .rg-pair-bg { stroke: var(--gold); stroke-width: 2.5; animation: rgpulse 1s ease-in-out infinite; }
    .rg-pair-bg { fill: var(--panel-2); stroke: var(--line); }
    .rg-pair-t { font: 700 11.5px "Segoe UI", system-ui, sans-serif; fill: var(--text); pointer-events: none; }
    .rg-case-edge { fill: none; stroke: rgba(255, 255, 255, .25); stroke-width: 1.5; }
    .rg-channel { fill: #174f4c; stroke: rgba(0, 0, 0, .3); }
    .rg-gate { fill: #174f4c; }
    .rg-strip { fill: #c9d6d4; opacity: .5; }
    .rg-slider { transition: transform .9s cubic-bezier(.5, 0, .3, 1); }
    .rg-slider.free { transform: translateX(-26px); }
    .rg-knob-rim { fill: #0f3b39; }
    .rg-rotor { transition-property: transform; transition-timing-function: cubic-bezier(.34, 1.4, .5, 1); pointer-events: none; }
    .rg-bar { fill: #1f7a75; stroke: #0f3b39; stroke-width: 1; }
    .rg-dot { fill: #d8efec; }
    .rg-opt { display: flex; gap: 6px; align-items: center; font-size: .9rem; color: var(--muted); cursor: pointer; }
    @keyframes rgpulse { 50% { opacity: .5; } }
    @keyframes rgnudge { 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(2px); } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
