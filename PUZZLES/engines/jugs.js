/* The Puzzle Cabinet · engines/jugs.js
 *
 * Measuring with jugs that have no marks. Pour one jug into another until the
 * first is empty or the second is full; where there is a tap you may fill a
 * jug to the brim, where there is a drain you may empty one.
 *
 * data: {
 *   caps:  [8, 5, 3],          capacities
 *   start: [8, 0, 0],          what is in each at the start
 *   goal:  { any: 4 }          some jug holds exactly 4
 *        | { jug: 0, amount: 4 }
 *        | { state: [4, 4, 0] }   exactly this (null = any amount)
 *        | { total: 4, jugs: [1, 2] }  these jugs hold 4 between them
 *   tap: true, drain: true,    an endless source / somewhere to pour away
 *   unit: 'L'                  shown on the jugs ('pints', 'quarts' …)
 *   names: ['barrel', ...]     optional names
 * }
 * p.par = the fewest moves (worked out by the solver below).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the rules ---------- */

  function moves(a, d) {
    const out = [], n = a.length, caps = d.caps;
    for (let i = 0; i < n; i++) {
      if (d.tap && a[i] < caps[i]) { const b = a.slice(); b[i] = caps[i]; out.push({ t: 'fill', i, s: b }); }
      if (d.drain && a[i] > 0) { const b = a.slice(); b[i] = 0; out.push({ t: 'empty', i, s: b }); }
      for (let j = 0; j < n; j++) {
        if (i === j || a[i] === 0 || a[j] === caps[j]) continue;
        const q = Math.min(a[i], caps[j] - a[j]);
        const b = a.slice(); b[i] -= q; b[j] += q;
        out.push({ t: 'pour', i, j, q, s: b });
      }
    }
    return out;
  }

  function isGoal(a, g) {
    if (!g) return false;
    if (g.any != null) return a.some((v) => v === g.any);
    if (g.jug != null) return a[g.jug] === g.amount;
    if (g.state) return g.state.every((v, i) => v == null || v === a[i]);
    if (g.total != null) return g.jugs.reduce((s, i) => s + a[i], 0) === g.total;
    if (g.all) return g.all.every((pair) => a[pair[0]] === pair[1]);
    return false;
  }

  // breadth-first search: the shortest list of moves from a to the goal
  function solve(d, from) {
    const start = (from || d.start).slice();
    const key = (a) => a.join(',');
    if (isGoal(start, d.goal)) return [];
    const prev = new Map([[key(start), null]]);
    let frontier = [start];
    while (frontier.length) {
      const next = [];
      for (const a of frontier) {
        for (const m of moves(a, d)) {
          const k = key(m.s);
          if (prev.has(k)) continue;
          prev.set(k, { from: key(a), m });
          if (isGoal(m.s, d.goal)) {
            const path = [];
            let cur = k;
            while (prev.get(cur)) { const e = prev.get(cur); path.unshift(e.m); cur = e.from; }
            return path;
          }
          next.push(m.s);
        }
      }
      frontier = next;
      if (prev.size > 200000) break;
    }
    return null;
  }

  const UNIT1 = { L: 'litre', pints: 'pint', gal: 'gallon', oz: 'ounce', quarts: 'quart', cups: 'cup' };
  function jugName(d, i) {
    if (d.names && d.names[i]) return 'the ' + d.names[i];
    return 'the ' + d.caps[i] + '-' + (UNIT1[d.unit] || 'litre') + ' jug';
  }
  function describe(d, m) {
    if (m.t === 'fill') return 'Fill ' + jugName(d, m.i) + ' from the tap.';
    if (m.t === 'empty') return 'Empty ' + jugName(d, m.i) + '.';
    return 'Pour ' + jugName(d, m.i) + ' into ' + jugName(d, m.j) + '.';
  }

  function goalText(d) {
    const u = d.unit ? ' ' + d.unit : '';
    const g = d.goal;
    if (g.any != null) return 'Get exactly **' + g.any + u + '** in one of the jugs.';
    if (g.jug != null) return 'Get exactly **' + g.amount + u + '** in ' + jugName(d, g.jug) + '.';
    if (g.total != null) return 'Get **' + g.total + u + '** in ' + g.jugs.map((i) => jugName(d, i)).join(' and ') + ' together.';
    if (g.state) return 'Finish with ' + g.state.map((v, i) => v == null ? null : '**' + v + u + '** in ' + jugName(d, i)).filter(Boolean).join(', ') + '.';
    return '';
  }

  /* ---------- drawing ---------- */

  const JW = 76, GAP = 46;

  function layout(d) {
    const maxCap = Math.max.apply(null, d.caps);
    const unit = Math.min(30, 280 / maxCap);
    const xs = [];
    let x = d.tap ? 110 : 20;
    d.caps.forEach((c) => {
      const w = Math.max(56, Math.min(110, JW * Math.sqrt(Math.max(1, c / (maxCap * 0.6)))));
      xs.push({ x, w, h: c * unit });
      x += w + GAP;
    });
    return { unit, xs, width: x - GAP + (d.drain ? 110 : 20), base: 330 };
  }

  function jugPath(x, y0, w, h) {
    // a jug with a lip and a spout on the right
    const r = Math.min(14, w * 0.2), top = y0 - h;
    return 'M' + (x + 4) + ' ' + (top - 8) +
      'L' + (x + 4) + ' ' + (top) +
      'Q' + x + ' ' + (top + 4) + ' ' + x + ' ' + (top + 12) +
      'L' + x + ' ' + (y0 - r) + 'Q' + x + ' ' + y0 + ' ' + (x + r) + ' ' + y0 +
      'L' + (x + w - r) + ' ' + y0 + 'Q' + (x + w) + ' ' + y0 + ' ' + (x + w) + ' ' + (y0 - r) +
      'L' + (x + w) + ' ' + (top + 12) + 'Q' + (x + w) + ' ' + (top + 4) + ' ' + (x + w + 6) + ' ' + (top - 6) +
      'L' + (x + w + 2) + ' ' + (top - 10) + 'L' + (x + w - 6) + ' ' + (top - 4) + 'L' + (x + 8) + ' ' + (top - 4) + 'L' + (x + 8) + ' ' + (top - 8) + 'Z';
  }

  C.engine({
    id: 'jugs',
    name: 'Water jugs',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'paint', 'loupe'],
    about: 'Drag one jug onto another to pour (or tap one, then the other). Pouring stops when the first jug is empty or the second is full — the jugs have no marks, so there is no stopping halfway. Where there is a **tap** you can fill a jug to the brim, and where there is a **drain** you can empty one. Keys: press two jug numbers (1, 2 …) to pour the first into the second.',

    // endless: a new puzzle of the asked level (1-5), found by trying random jugs and measuring the par
    generate(rng, level) {
      const band = [null, [3, 4], [5, 6], [7, 9], [10, 13], [14, 40]][level];
      for (let tries = 0; tries < 400; tries++) {
        const kind = rng.int(3);
        let d;
        if (kind === 0) {
          const a = rng.range(3, 15), b = rng.range(2, a - 1);
          d = { caps: [a, b], start: [0, 0], goal: { any: rng.range(1, a - 1) }, tap: true, drain: true };
        } else if (kind === 1) {
          const a = rng.range(6, 18), b = rng.range(3, a - 1), c = rng.range(2, b - 1);
          d = a % 2 === 0 && b >= a / 2 && rng() < 0.6
            ? { caps: [a, b, c], start: [a, 0, 0], goal: { state: [a / 2, a / 2, 0] } }
            : { caps: [a, b, c], start: [a, 0, 0], goal: { any: rng.range(1, b - 1) } };
        } else {
          const a = rng.range(5, 13), b = rng.range(3, a - 1), c = rng.range(2, b - 1), j = rng.int(3);
          d = { caps: [a, b, c], start: [0, 0, 0], goal: { jug: j, amount: 0 }, tap: true, drain: true };
          d.goal.amount = rng.range(1, d.caps[j] - 1);
        }
        const path = solve(d);
        if (!path || path.length < band[0] || path.length > band[1]) continue;
        d.unit = rng.pick(['L', 'L', 'pints', 'gal']);
        const u = d.unit;
        const text = d.tap
          ? 'Jugs of ' + d.caps.map((c) => c + ' ' + u).join(', ') + ', a tap to fill from and a drain to pour away.'
          : 'The ' + d.caps[0] + ' ' + u + ' jug is full; the ' + d.caps.slice(1).map((c) => c + ' ' + u).join(' and the ') + ' jugs are empty. No tap, no drain: only pouring.';
        return { title: 'Jugs of ' + d.caps.join(', '), text, data: d, par: path.length, diff: level };
      }
      return null;
    },

    verify(p) {
      const d = p.data;
      if (!d || !d.caps || !d.start || !d.goal) return { ok: false, err: 'caps, start and goal are needed' };
      if (d.start.length !== d.caps.length || d.start.some((v, i) => v < 0 || v > d.caps[i])) return { ok: false, err: 'start does not fit the jugs' };
      const path = solve(d);
      if (!path) return { ok: false, err: 'no solution' };
      if (!path.length) return { ok: false, err: 'already solved at the start' };
      if (p.par != null && p.par !== path.length) return { ok: false, err: 'par is ' + p.par + ' but the fewest moves is ' + path.length };
      return { ok: true, par: path.length };
    },

    mount(ctx, p) {
      const d = p.data, wb = ctx.wb;
      const L = layout(d);
      let a = d.start.slice();
      let sel = -1, busy = false, hover = -1;
      ctx.setGoal(goalText(d));
      const board = wb.layer('board');
      const top = wb.layer('top');
      wb.setBounds({ x0: 0, y0: 0, x1: L.width, y1: L.base + 70 }, 0.07);

      const g = ctx.s('g', { class: 'jugs' }, board);
      // the table
      ctx.s('rect', { x: 0, y: L.base, width: L.width, height: 16, rx: 6, class: 'jug-table' }, g);
      if (d.tap) {
        const tg = ctx.s('g', { class: 'jug-tap' }, g);
        ctx.s('path', { d: 'M10 70h60v16H48v18H32V86H10z', class: 'tap-body' }, tg);
        ctx.s('path', { d: 'M28 58h24', class: 'tap-handle' }, tg);
        ctx.s('text', { x: 40, y: 128, class: 'jug-cap', 'text-anchor': 'middle', text: 'tap' }, tg);
      }
      if (d.drain) {
        const dg = ctx.s('g', { class: 'jug-drain' }, g);
        const x0 = L.width - 96;
        ctx.s('path', { d: 'M' + x0 + ' ' + (L.base - 40) + 'h80l-10 40h-60z', class: 'drain-body' }, dg);
        ctx.s('text', { x: x0 + 40, y: L.base - 50, class: 'jug-cap', 'text-anchor': 'middle', text: 'drain' }, dg);
      }
      const jugs = L.xs.map((j, i) => {
        const jg = ctx.s('g', { class: 'jug', 'data-i': i }, g);
        const clip = 'jugclip-' + p.id.replace(/[^\w-]/g, '') + '-' + i;
        const defs = ctx.s('defs', null, jg);
        const cp = ctx.s('clipPath', { id: clip }, defs);
        ctx.s('path', { d: jugPath(j.x, L.base, j.w, j.h) }, cp);
        ctx.s('path', { d: jugPath(j.x, L.base, j.w, j.h), class: 'jug-back' }, jg);
        const water = ctx.s('rect', { x: j.x - 2, width: j.w + 12, y: L.base, height: 0, class: 'jug-water', 'clip-path': 'url(#' + clip + ')' }, jg);
        const surf = ctx.s('rect', { x: j.x - 2, width: j.w + 12, y: L.base, height: 3, class: 'jug-surf', 'clip-path': 'url(#' + clip + ')' }, jg);
        ctx.s('path', { d: jugPath(j.x, L.base, j.w, j.h), class: 'jug-glass', 'data-key': 'jug' + i }, jg);
        ctx.s('path', { d: 'M' + (j.x + 9) + ' ' + (L.base - j.h + 16) + 'V' + (L.base - 12), class: 'jug-shine' }, jg);
        const amt = ctx.s('text', { x: j.x + j.w / 2, y: L.base - j.h - 20, class: 'jug-amt', 'text-anchor': 'middle' }, jg);
        ctx.s('text', { x: j.x + j.w / 2, y: L.base + 38, class: 'jug-cap', 'text-anchor': 'middle', text: (d.names && d.names[i] ? d.names[i] + ' · ' : '') + d.caps[i] + ' ' + (d.unit || 'L') }, jg);
        const num = ctx.s('text', { x: j.x + j.w / 2, y: L.base + 56, class: 'jug-num', 'text-anchor': 'middle', text: String(i + 1) }, jg);
        const hit = ctx.s('rect', { x: j.x - 12, y: L.base - j.h - 50, width: j.w + 24, height: j.h + 110, class: 'jug-hit' }, jg);
        return { jg, water, surf, amt, num, hit, j };
      });
      const arrow = ctx.s('path', { class: 'jug-arrow' }, top);

      function level(i, v) {
        const j = L.xs[i], hh = v * L.unit;
        jugs[i].water.setAttribute('y', L.base - hh);
        jugs[i].water.setAttribute('height', hh + 2);
        jugs[i].surf.setAttribute('y', L.base - hh);
        jugs[i].surf.style.opacity = v > 0 ? 1 : 0;
        jugs[i].amt.textContent = C.fmtCalc ? C.fmtCalc(Math.round(v * 100) / 100) : v;
      }
      function draw() {
        a.forEach((v, i) => level(i, v));
        jugs.forEach((J, i) => {
          J.jg.classList.toggle('sel', i === sel);
          J.jg.classList.toggle('hov', i === hover && sel >= 0 && i !== sel);
          J.jg.classList.toggle('goal', isGoalJug(i));
        });
      }
      function isGoalJug(i) {
        const gl = d.goal;
        if (gl.any != null) return a[i] === gl.any;
        if (gl.jug != null) return gl.jug === i && a[i] === gl.amount;
        if (gl.state) return gl.state[i] != null && gl.state[i] > 0 && gl.state[i] === a[i];
        return false;
      }

      function animate(from, to, done) {
        busy = true;
        C.tween(C.anim(380), (e) => from.forEach((v, i) => level(i, v + (to[i] - v) * e)),
          () => { busy = false; a = to.slice(); draw(); if (done) done(); });
      }

      function doMove(m, silent) {
        const from = a.slice();
        ctx.sfx('pour');
        showStream(m);
        animate(from, m.s, () => { arrow.setAttribute('d', ''); if (!silent) { ctx.move(); ctx.changed('move'); } });
        a = m.s.slice(); // the logical state changes at once
        const q = m.t === 'pour' ? m.q : 0;
        if (m.t === 'pour') ctx.say('Poured ' + q + ' ' + (d.unit || 'L') + '.');
        else if (m.t === 'fill') ctx.say('Filled from the tap.');
        else ctx.say('Emptied.');
      }
      function showStream(m) {
        let x1, y1, x2, y2;
        if (m.t === 'fill') { x1 = 40; y1 = 104; const j = L.xs[m.i]; x2 = j.x + j.w / 2; y2 = L.base - j.h; }
        else if (m.t === 'empty') { const j = L.xs[m.i]; x1 = j.x + j.w; y1 = L.base - j.h - 8; x2 = L.width - 56; y2 = L.base - 30; }
        else { const j = L.xs[m.i], k = L.xs[m.j]; x1 = j.x + j.w + 4; y1 = L.base - j.h - 8; x2 = k.x + k.w / 2; y2 = L.base - k.h; }
        const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 60;
        arrow.setAttribute('d', 'M' + x1 + ' ' + y1 + 'Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2);
      }
      function pour(i, j) {
        if (busy || i === j) return;
        if (a[i] === 0) { ctx.say(cap(jugName(d, i)) + ' is empty.', 'warn'); return; }
        if (a[j] === d.caps[j]) { ctx.say(cap(jugName(d, j)) + ' is already full.', 'warn'); return; }
        doMove(moves(a, d).find((m) => m.t === 'pour' && m.i === i && m.j === j));
      }
      function fill(i) {
        if (busy || !d.tap) return;
        if (a[i] === d.caps[i]) { ctx.say('It is already full.', 'warn'); return; }
        doMove(moves(a, d).find((m) => m.t === 'fill' && m.i === i));
      }
      function empty(i) {
        if (busy || !d.drain) return;
        if (a[i] === 0) { ctx.say('It is already empty.', 'warn'); return; }
        doMove(moves(a, d).find((m) => m.t === 'empty' && m.i === i));
      }
      const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

      // buttons under the jugs for the tap and the drain
      if (d.tap || d.drain) {
        jugs.forEach((J, i) => {
          const j = J.j;
          const mk = (label, dx, fn) => {
            const bg = ctx.s('g', { class: 'jug-btn' }, g);
            ctx.s('rect', { x: j.x + dx, y: L.base + 64, width: 50, height: 24, rx: 7 }, bg);
            ctx.s('text', { x: j.x + dx + 25, y: L.base + 80.5, 'text-anchor': 'middle', text: label }, bg);
            bg.addEventListener('pointerdown', (e) => { e.stopPropagation(); fn(i); });
          };
          const both = d.tap && d.drain;
          if (d.tap) mk('Fill', both ? j.w / 2 - 53 : j.w / 2 - 25, fill);
          if (d.drain) mk('Empty', both ? j.w / 2 + 3 : j.w / 2 - 25, empty);
        });
        wb.setBounds({ x0: 0, y0: 0, x1: L.width, y1: L.base + 100 }, 0.07);
      }

      function jugAt(pt) {
        for (let i = 0; i < L.xs.length; i++) {
          const j = L.xs[i];
          if (pt[0] >= j.x - 14 && pt[0] <= j.x + j.w + 14 && pt[1] >= L.base - j.h - 55 && pt[1] <= L.base + 60) return i;
        }
        return -1;
      }
      let dragFrom = -1, dragged = false;
      wb.handlers.board = {
        down(pt) {
          const i = jugAt(pt);
          if (i < 0 || busy) { if (sel >= 0) { sel = -1; draw(); } return false; }
          dragFrom = i; dragged = false;
          return true;
        },
        move(pt) {
          if (dragFrom < 0) return;
          const j = L.xs[dragFrom];
          const x1 = j.x + j.w / 2, y1 = L.base - j.h - 10;
          if (Math.hypot(pt[0] - x1, pt[1] - y1) > 30) dragged = true;
          if (!dragged) return;
          arrow.setAttribute('d', 'M' + x1 + ' ' + y1 + 'Q' + ((x1 + pt[0]) / 2) + ' ' + (Math.min(y1, pt[1]) - 50) + ' ' + pt[0] + ' ' + pt[1]);
          const h2 = jugAt(pt);
          if (h2 !== hover) { hover = h2; sel = dragFrom; draw(); }
        },
        up(pt) {
          const i = dragFrom;
          dragFrom = -1;
          arrow.setAttribute('d', '');
          hover = -1;
          if (i < 0) return;
          const t = jugAt(pt);
          if (dragged) {
            sel = -1; draw();
            if (t >= 0 && t !== i) pour(i, t);
            return;
          }
          // a tap: select, or pour into the tapped jug
          if (sel < 0) { sel = i; draw(); ctx.say('Now tap the jug to pour into' + (d.drain ? ' (or Empty)' : '') + '.'); }
          else if (sel === i) { sel = -1; draw(); }
          else { const s = sel; sel = -1; draw(); pour(s, i); }
        }
      };

      let keyFirst = -1;
      draw();
      ctx.stat('Moves', 0);

      return {
        check() {
          if (isGoal(a, d.goal)) return { solved: true, msg: 'Measured!' };
          return { solved: false, msg: 'Not measured yet.' };
        },
        hint() {
          const path = solve(d, a);
          if (!path) return 'From here there is no way to the goal — undo a few steps.';
          if (!path.length) return 'You are already there!';
          const m = path[0];
          return {
            text: describe(d, m) + ' (From here it takes ' + C.plural(path.length, 'more move') + '.)',
            show() {
              const idx = m.t === 'pour' ? [m.i, m.j] : [m.i];
              idx.forEach((i) => { jugs[i].jg.classList.add('hinted'); setTimeout(() => jugs[i].jg.classList.remove('hinted'), 2200); });
            }
          };
        },
        solve() {
          const path = solve(d, a);
          if (!path) return;
          let k = 0;
          const next = () => {
            if (k >= path.length) { ctx.changed('solve'); return; }
            doMove(path[k++], true);
            ctx.move();
            setTimeout(next, C.anim(650));
          };
          next();
        },
        explain() {
          const path = solve(d);
          return path ? 'One shortest way (' + C.plural(path.length, 'move') + '): ' + path.map((m, i) => (i + 1) + '. ' + describe(d, m)).join(' ') : '';
        },
        getState() { return { a: a.slice() }; },
        setState(s) { if (s && s.a) { a = s.a.slice(); sel = -1; draw(); } },
        key(ev) {
          if (ev.type !== 'keydown') return false;
          const n = parseInt(ev.key, 10);
          if (!(n >= 1 && n <= a.length)) return false;
          if (keyFirst < 0) { keyFirst = n - 1; sel = keyFirst; draw(); return true; }
          const s = keyFirst; keyFirst = -1; sel = -1; draw();
          if (s !== n - 1) pour(s, n - 1);
          return true;
        }
      };
    },

    thumb(p) {
      const d = p.data, L = layout(d);
      let s = '<svg viewBox="-10 ' + (L.base - 300) + ' ' + (L.width + 20) + ' 350" preserveAspectRatio="xMidYMid meet">';
      L.xs.forEach((j, i) => {
        const hh = d.start[i] * L.unit;
        s += '<path d="' + jugPath(j.x, L.base, j.w, j.h) + '" fill="rgba(160,200,255,.08)" stroke="var(--ink-2)" stroke-width="4"/>';
        if (hh) s += '<rect x="' + (j.x + 2) + '" y="' + (L.base - hh) + '" width="' + (j.w - 4) + '" height="' + (hh - 2) + '" rx="8" fill="var(--water)" opacity=".75"/>';
        s += '<text x="' + (j.x + j.w / 2) + '" y="' + (L.base + 34) + '" text-anchor="middle" font-size="30" font-weight="700" fill="var(--muted)">' + d.caps[i] + '</text>';
      });
      const g = d.goal;
      const want = g.any != null ? g.any : g.amount != null ? g.amount : g.total != null ? g.total : null;
      if (want != null) s += '<text x="' + (L.width - 10) + '" y="' + (L.base - 250) + '" text-anchor="end" font-size="44" font-weight="800" fill="var(--gold)">→' + want + '</text>';
      return s + '</svg>';
    }
  });

  C.jugsSolver = { solve, moves, isGoal };

  C.css('jugs', `
    .jug-table { fill: var(--wood-dark); opacity: .55; }
    .tap-body { fill: var(--metal); stroke: rgba(0,0,0,.35); stroke-width: 2; }
    .tap-handle { stroke: var(--metal); stroke-width: 7; stroke-linecap: round; }
    .drain-body { fill: none; stroke: var(--ink-2); stroke-width: 4; stroke-linejoin: round; }
    .jug { cursor: pointer; transition: transform .18s; }
    .jug.sel { transform: translateY(-10px); }
    .jug-back { fill: rgba(160, 200, 255, .06); }
    .jug-water { fill: var(--water); opacity: .82; }
    .jug-surf { fill: #bfe6ff; opacity: .9; }
    .jug-glass { fill: none; stroke: var(--ink-2); stroke-width: 3.5; stroke-linejoin: round; }
    .jug.sel .jug-glass { stroke: var(--accent); stroke-width: 4.5; }
    .jug.hov .jug-glass { stroke: var(--gold); stroke-width: 4.5; }
    .jug.goal .jug-glass { stroke: var(--green); stroke-width: 4.5; }
    .jug.hinted .jug-glass { stroke: var(--gold); stroke-width: 6; filter: drop-shadow(0 0 6px var(--gold)); }
    .jug-shine { stroke: rgba(255,255,255,.22); stroke-width: 5; stroke-linecap: round; }
    .jug-amt { font: 800 26px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .jug.goal .jug-amt { fill: var(--green); }
    .jug-cap { font: 600 15px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .jug-num { font: 700 12px "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
    .jug-hit { fill: transparent; }
    .jug-arrow { fill: none; stroke: var(--water); stroke-width: 5; stroke-linecap: round; stroke-dasharray: 2 10; animation: jugflow .5s linear infinite; pointer-events: none; }
    @keyframes jugflow { to { stroke-dashoffset: -12; } }
    .jug-btn { cursor: pointer; }
    .jug-btn rect { fill: var(--panel-2); stroke: var(--line); }
    .jug-btn:hover rect { stroke: var(--accent); }
    .jug-btn text { font: 600 12px "Segoe UI", system-ui, sans-serif; fill: var(--text); pointer-events: none; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
