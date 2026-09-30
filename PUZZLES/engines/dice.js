/* The Puzzle Cabinet · engines/dice.js
 *
 * Dice to turn in your head: stacks with hidden faces, a die rolled along a
 * path, and dice mazes where the die may only land on a number it shows on
 * top. Everything is drawn in 3D (drag to look around; switch to the flat
 * plan with the 2D / 3D button).
 *
 * A standard die here: opposite faces add up to 7, and with 1 on top and 2
 * facing south (towards you), 3 is on the east (your right).
 * An orientation is [top, south, east]; the other faces are 7 minus those.
 * Board: columns x to the east, rows y to the south.
 *
 * data.kind:
 *  'scene'  dice on a table: dice: [[x, level, y, top, south, east], …]
 *           ask: 'hidden' (sum of the faces nobody can see) | 'visible' | { face: [i, 't'|'b'|'n'|'s'|'e'|'w'] }
 *           answer: n
 *  'views'  one odd die (numbers placed anyhow) seen several ways: views: [[top, south, east], …],
 *           ask: { opposite: v }, answer: n (the views must decide it)
 *  'roll'   start: [x, y], die: [t, s, e], path: 'EESN…', ask: 't' | 'b' | 's' …, answer: n
 *  'maze'   grid: ['..3#', …] ('.' free, '#' a hole, 1–6: the die may land there only showing
 *           that number on top), start, goal, die, goalTop (optional); par = fewest rolls
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;

  /* ---------- the die ---------- */

  const DIRS = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
  function roll(o, dir) {
    const [t, s, e] = o;
    if (dir === 'E') return [7 - e, s, t];
    if (dir === 'W') return [e, s, 7 - t];
    if (dir === 'S') return [7 - s, t, e];
    return [s, 7 - t, e];
  }
  const faceOf = (o, f) => ({ t: o[0], b: 7 - o[0], s: o[1], n: 7 - o[1], e: o[2], w: 7 - o[2] })[f];
  const FACE = { t: 'top', b: 'bottom', n: 'north (back)', s: 'south (front)', e: 'east (right)', w: 'west (left)' };
  // the 24 ways a standard die can lie
  const ORIENTS = (() => {
    const seen = new Map(), q = [[1, 2, 3]];
    seen.set('1,2,3', [1, 2, 3]);
    while (q.length) { const o = q.shift(); for (const dir of 'NESW') { const n = roll(o, dir), k = n.join(); if (!seen.has(k)) { seen.set(k, n); q.push(n); } } }
    return seen;
  })();
  const validDie = (o) => ORIENTS.has(o.join());

  /* ---------- odd dice: numbers placed anyhow (for 'views') ---------- */

  // a labelling as {t,b,n,s,e,w}; its 24 turnings
  function turnings(L) {
    const rollL = (x, dir) => {
      if (dir === 'E') return { t: x.w, b: x.e, e: x.t, w: x.b, n: x.n, s: x.s };
      if (dir === 'S') return { t: x.n, b: x.s, s: x.t, n: x.b, e: x.e, w: x.w };
      return { t: x.t, b: x.b, n: x.w, e: x.n, s: x.e, w: x.s }; // spin: turn a quarter about the vertical
    };
    const out = [], seen = new Set(), q = [L];
    seen.add(JSON.stringify(L));
    while (q.length) { const x = q.shift(); out.push(x); for (const dir of ['E', 'S', 'Z']) { const y = rollL(x, dir), k = JSON.stringify(y); if (!seen.has(k)) { seen.add(k); q.push(y); } } }
    return out;
  }
  function allLabellings() {
    const out = [], perm = (a, k) => {
      if (k === a.length) { out.push({ t: a[0], b: a[1], n: a[2], s: a[3], e: a[4], w: a[5] }); return; }
      for (let i = k; i < a.length; i++) { [a[k], a[i]] = [a[i], a[k]]; perm(a, k + 1); [a[k], a[i]] = [a[i], a[k]]; }
    };
    perm([1, 2, 3, 4, 5, 6], 0);
    return out;
  }
  let LAB = null;
  // what the views allow the face opposite v to be
  function oppositeFromViews(views, v) {
    LAB = LAB || allLabellings();
    const vals = new Set();
    LAB.forEach((L) => {
      const T = turnings(L);
      const fits = views.every(([t, s, e]) => T.some((x) => x.t === t && x.s === s && x.e === e));
      if (!fits) return;
      const opp = { t: 'b', b: 't', n: 's', s: 'n', e: 'w', w: 'e' };
      const f = Object.keys(L).find((k) => L[k] === v);
      vals.add(L[opp[f]]);
    });
    return Array.from(vals);
  }

  /* ---------- scenes ---------- */

  function sceneInfo(d) {
    const at = new Map();
    d.dice.forEach((q, i) => at.set(q[0] + ',' + q[1] + ',' + q[2], i));
    const has = (x, y, z) => at.has(x + ',' + y + ',' + z);
    return d.dice.map((q, i) => {
      const [x, y, z] = q, o = [q[3], q[4], q[5]];
      const hid = {
        t: has(x, y + 1, z), b: y === 0 || has(x, y - 1, z),
        n: has(x, y, z - 1), s: has(x, y, z + 1), e: has(x + 1, y, z), w: has(x - 1, y, z)
      };
      return { i, x, y, z, o, hid };
    });
  }
  function sceneAnswer(d) {
    const info = sceneInfo(d);
    if (d.ask === 'hidden' || d.ask === 'visible') {
      let sum = 0;
      info.forEach((D) => { for (const f in D.hid) if (D.hid[f] === (d.ask === 'hidden')) sum += faceOf(D.o, f); });
      return sum;
    }
    if (d.ask && d.ask.face) {
      const [i, f] = d.ask.face, D = info[i];
      // decided by what can be seen of that die?
      const vals = new Set();
      ORIENTS.forEach((o) => {
        for (const g in D.hid) if (!D.hid[g] && faceOf(o, g) !== faceOf(D.o, g)) return;
        vals.add(faceOf(o, f));
      });
      return vals.size === 1 ? faceOf(D.o, f) : null;
    }
    if (d.ask && d.ask.sumFaces) {
      // the sum of some named faces, e.g. every bottom: [[i, 'b'], …]
      let s = 0;
      for (const [i, f] of d.ask.sumFaces) s += faceOf(info[i].o, f);
      return s;
    }
    return null;
  }

  /* ---------- rolling and mazes ---------- */

  function cellAt(d, x, y) {
    if (!d.grid) return '.';
    const row = d.grid[y];
    if (!row || x < 0 || x >= row.length) return '#';
    return row[x];
  }
  function canEnter(d, x, y, o2) {
    const c = cellAt(d, x, y);
    if (c === '#' || c === ' ') return false;
    if (c >= '1' && c <= '6') return o2[0] === +c;
    return true;
  }
  function mazeSolve(d, from, o0) {
    const start = { x: (from || d.start)[0], y: (from || d.start)[1], o: (o0 || d.die).slice() };
    const key = (s) => s.x + ',' + s.y + ',' + s.o.join('');
    const isGoal = (s) => s.x === d.goal[0] && s.y === d.goal[1] && (!d.goalTop || s.o[0] === d.goalTop);
    if (isGoal(start)) return [];
    const prev = new Map([[key(start), null]]);
    let fr = [start];
    while (fr.length) {
      const nx = [];
      for (const s of fr) {
        for (const dir of 'NESW') {
          const [dx, dy] = DIRS[dir], o2 = roll(s.o, dir), t = { x: s.x + dx, y: s.y + dy, o: o2 };
          if (!canEnter(d, t.x, t.y, o2)) continue;
          const k = key(t);
          if (prev.has(k)) continue;
          prev.set(k, { from: key(s), dir });
          if (isGoal(t)) {
            const path = [];
            let cur = k;
            while (prev.get(cur)) { const e = prev.get(cur); path.unshift(e.dir); cur = e.from; }
            return path;
          }
          nx.push(t);
        }
      }
      fr = nx;
    }
    return null;
  }
  function rollPath(d) {
    let x = d.start[0], y = d.start[1], o = d.die.slice();
    const cells = [[x, y]];
    for (const dir of d.path) { const [dx, dy] = DIRS[dir]; x += dx; y += dy; o = roll(o, dir); cells.push([x, y]); }
    return { x, y, o, cells };
  }

  /* ---------- verify ---------- */

  function verify(p) {
    const d = p.data;
    if (!d || !d.kind) return { ok: false, err: 'data.kind is needed' };
    if (d.kind === 'scene') {
      if (!d.dice || !d.dice.length) return { ok: false, err: 'dice are needed' };
      const seen = new Set();
      for (const q of d.dice) {
        if (!validDie([q[3], q[4], q[5]])) return { ok: false, err: 'not a standard die: ' + q.slice(3) };
        const k = q.slice(0, 3).join();
        if (seen.has(k)) return { ok: false, err: 'two dice in one place' };
        seen.add(k);
      }
      for (const q of d.dice) if (q[1] > 0 && !seen.has([q[0], q[1] - 1, q[2]].join())) return { ok: false, err: 'a die floats in the air' };
      const v = sceneAnswer(d);
      if (v == null) return { ok: false, err: 'what can be seen does not decide the answer' };
      if (v !== d.answer) return { ok: false, err: 'answer ' + d.answer + ' but the dice give ' + v };
      return { ok: true };
    }
    if (d.kind === 'views') {
      if (!d.views || !d.ask || d.ask.opposite == null) return { ok: false, err: 'views and ask.opposite are needed' };
      const vals = oppositeFromViews(d.views, d.ask.opposite);
      if (!vals.length) return { ok: false, err: 'no die fits all the views' };
      if (vals.length > 1) return { ok: false, err: 'the views allow ' + vals.join(' or ') };
      if (vals[0] !== d.answer) return { ok: false, err: 'answer ' + d.answer + ' but the views give ' + vals[0] };
      return { ok: true };
    }
    if (d.kind === 'roll') {
      if (!validDie(d.die)) return { ok: false, err: 'not a standard die' };
      if (!/^[NESW]+$/.test(d.path || '')) return { ok: false, err: 'path must be letters N E S W' };
      const r = rollPath(d);
      if (d.grid && r.cells.some(([x, y]) => cellAt(d, x, y) === '#')) return { ok: false, err: 'the path runs over a hole' };
      const v = faceOf(r.o, d.ask || 't');
      if (v !== d.answer) return { ok: false, err: 'answer ' + d.answer + ' but the die shows ' + v };
      return { ok: true };
    }
    if (d.kind === 'maze') {
      if (!validDie(d.die)) return { ok: false, err: 'not a standard die' };
      if (!d.grid || !d.start || !d.goal) return { ok: false, err: 'grid, start and goal are needed' };
      if (cellAt(d, d.start[0], d.start[1]) === '#' || cellAt(d, d.goal[0], d.goal[1]) === '#') return { ok: false, err: 'start or goal on a hole' };
      const path = mazeSolve(d);
      if (!path) return { ok: false, err: 'no way through' };
      if (!path.length) return { ok: false, err: 'already solved' };
      if (p.par != null && p.par !== path.length) return { ok: false, err: 'par is ' + p.par + ' but the fewest rolls is ' + path.length };
      return { ok: true, par: path.length };
    }
    return { ok: false, err: 'unknown kind ' + d.kind };
  }

  /* ---------- drawing: pips as decals ---------- */

  const PIPS = {
    1: [[0.5, 0.5]], 2: [[0.27, 0.27], [0.73, 0.73]], 3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]],
    4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]], 5: [[0.26, 0.26], [0.74, 0.26], [0.5, 0.5], [0.26, 0.74], [0.74, 0.74]],
    6: [[0.28, 0.24], [0.28, 0.5], [0.28, 0.76], [0.72, 0.24], [0.72, 0.5], [0.72, 0.76]]
  };
  const IVORY = '#f3eee2';
  function litCol(hex, k) {
    const n = parseInt(hex.slice(1), 16), f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return 'rgb(' + f(n >> 16 & 255) + ',' + f(n >> 8 & 255) + ',' + f(n & 255) + ')';
  }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath(); }
  function pipDecal(n, opts) {
    opts = opts || {};
    return {
      draw(c, lit) {
        const k = lit == null ? 1 : lit;
        c.fillStyle = litCol(opts.face || IVORY, Math.min(1.25, k * 1.06));
        rrect(c, 0.07, 0.07, 0.86, 0.86, 0.16);
        c.fill();
        if (n == null) { // a face you cannot see in this view
          c.fillStyle = litCol('#9a93a8', k);
          c.font = 'bold 0.5px "Segoe UI", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
          c.save(); c.translate(0.5, 0.5); c.scale(1, -1); c.fillText('?', 0, 0.03); c.restore();
          return;
        }
        (PIPS[n] || []).forEach(([x, y]) => {
          c.beginPath();
          c.arc(x, y, n === 1 ? 0.12 : 0.085, 0, Math.PI * 2);
          c.fillStyle = litCol(n === 1 && !opts.plain ? '#c62f35' : '#1d2034', Math.max(0.6, k));
          c.fill();
        });
      }
    };
  }
  function textDecal(txt, col, size) { return { text: txt, color: col, size: size || 0.55 }; }
  function dieCell(x, y, z, o, hidden, extra) {
    const f = (g) => (hidden && hidden[g] ? null : faceOf(o, g));
    return Object.assign({ x, y, z, color: IVORY, decals: { py: pipDecal(f('t')), ny: pipDecal(f('b')), pz: pipDecal(f('s')), nz: pipDecal(f('n')), px: pipDecal(f('e')), nx: pipDecal(f('w')) } }, extra || {});
  }

  /* ---------- 2D: a small flat picture of a die ---------- */

  function pips2D(parent, n, cx, cy, s, cls) {
    C.s('rect', { x: cx - s / 2, y: cy - s / 2, width: s, height: s, rx: s * 0.18, class: 'dc-die2 ' + (cls || '') }, parent);
    (PIPS[n] || []).forEach(([x, y]) => C.s('circle', { cx: cx - s / 2 + x * s, cy: cy - s / 2 + y * s, r: s * (n === 1 ? 0.12 : 0.085), class: 'dc-pip' + (n === 1 ? ' one' : '') }, parent));
  }

  /* ---------- mount ---------- */

  function mount(ctx, p) {
    const d = p.data;
    if (d.kind === 'scene' || d.kind === 'views') return mountScene(ctx, p);
    return mountBoard(ctx, p);
  }

  function answerBox(ctx, p) {
    const d = p.data;
    return ctx.answer({
      kind: 'number', label: d.askText || null, placeholder: 'A number',
      check: (v) => {
        const x = parseFloat(String(v).replace(/[^\d.-]/g, ''));
        if (isNaN(x)) return { ok: false, msg: 'That does not look like a number.' };
        if (x === d.answer) return { ok: true, msg: d.okMsg || ('Yes: **' + d.answer + '**.') };
        const tr = (d.traps || []).find((q) => q.match === x);
        return { ok: false, msg: tr ? tr.msg : null };
      }
    });
  }

  function clampOrbit(v) { return () => { if (v.cam.pitch < 6) { v.cam.pitch = 6; v.render(); } }; }

  function mountScene(ctx, p) {
    const d = p.data, wb = ctx.wb;
    let v = null;
    const build = () => {
      v.clear();
      let cells = [];
      if (d.kind === 'scene') {
        const info = sceneInfo(d);
        cells = info.map((D) => dieCell(D.x, D.y, D.z, D.o, { b: D.y === 0 }));
      } else {
        cells = d.views.map((o, i) => {
          const c = { x: i * 2, y: 0, z: 0, color: IVORY, decals: { py: pipDecal(o[0], { plain: true }), pz: pipDecal(o[1], { plain: true }), px: pipDecal(o[2], { plain: true }), ny: pipDecal(null), nz: pipDecal(null), nx: pipDecal(null) } };
          return c;
        });
      }
      const b = cells.reduce((a, c) => ({ x0: Math.min(a.x0, c.x), x1: Math.max(a.x1, c.x + 1), z0: Math.min(a.z0, c.z), z1: Math.max(a.z1, c.z + 1) }), { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9 });
      // the table cloth
      const m = 1.2;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const x0 = b.x0 - m + (b.x1 - b.x0 + 2 * m) * i / 4, x1 = b.x0 - m + (b.x1 - b.x0 + 2 * m) * (i + 1) / 4;
        const z0 = b.z0 - m + (b.z1 - b.z0 + 2 * m) * j / 4, z1 = b.z0 - m + (b.z1 - b.z0 + 2 * m) * (j + 1) / 4;
        v.add({ verts: [[x0, -0.002, z1], [x1, -0.002, z1], [x1, -0.002, z0], [x0, -0.002, z0]], faces: [[0, 1, 2, 3]], color: (i + j) % 2 ? '#2c5e48' : '#2a5944', stroke: false, smooth: true, pickable: false, bias: 1000 });
      }
      v.voxels(cells, { gap: d.kind === 'views' ? 0 : 0.012, id: 'dice', lw: 1 });
      if (d.kind === 'views') d.views.forEach((o, i) => v.add({ verts: [[i * 2 + 0.2, 0.001, 1.85], [i * 2 + 0.8, 0.001, 1.85], [i * 2 + 0.8, 0.001, 1.25], [i * 2 + 0.2, 0.001, 1.25]], faces: [[0, 1, 2, 3]], color: '#2a5944', stroke: false, pickable: false, bias: 900, decals: { 0: textDecal(String.fromCharCode(65 + i), '#f4efe1', 0.8) } }));
      v.fit(1.05);
      v.cam.yaw = 32; v.cam.pitch = 28;
      v.render();
    };
    v = wb.use3D({ orbit: () => clampOrbit(v)() });
    wb.set3D(true);
    wb.allow3D(false);
    build();
    // a flat card for the 2D side (if someone switches): the question on the board
    wb.setBounds({ x0: 0, y0: 0, x1: 10, y1: 6 });
    const box = answerBox(ctx, p);
    ctx.say(d.kind === 'views' ? 'Drag to turn the view. The faces with “?” are the ones you cannot see from where the picture was taken.' : 'Drag to walk round the table and look at the dice from every side.', 'info');
    return {
      noMoves: true,
      solve() { box.feedback('The answer: <b>' + d.answer + '</b>', 'good'); },
      destroy() {}
    };
  }

  function mountBoard(ctx, p) {
    const d = p.data, wb = ctx.wb, isMaze = d.kind === 'maze';
    // the board: the grid, or the cells of the path
    let W, Hh, cellOf;
    let pathInfo = null;
    if (isMaze) { Hh = d.grid.length; W = Math.max(...d.grid.map((r) => r.length)); cellOf = (x, y) => cellAt(d, x, y); }
    else {
      pathInfo = rollPath(d);
      const xs = pathInfo.cells.map((c) => c[0]), ys = pathInfo.cells.map((c) => c[1]);
      const ox = Math.min(...xs), oy = Math.min(...ys);
      W = Math.max(...xs) - ox + 1; Hh = Math.max(...ys) - oy + 1;
      const on = new Set(pathInfo.cells.map((c) => (c[0] - ox) + ',' + (c[1] - oy)));
      cellOf = (x, y) => (on.has(x + ',' + y) ? '.' : '#');
      pathInfo.ox = ox; pathInfo.oy = oy;
    }
    const sx = isMaze ? 0 : pathInfo.ox, sy = isMaze ? 0 : pathInfo.oy;
    const startAt = [d.start[0] - sx, d.start[1] - sy];
    let st = { x: startAt[0], y: startAt[1], o: d.die.slice() };
    let busy = false, alive = true;
    const goal = isMaze ? d.goal : null;
    const arrows = {};
    if (!isMaze) { let x = startAt[0], y = startAt[1]; for (const dir of d.path) { arrows[x + ',' + y] = dir; x += DIRS[dir][0]; y += DIRS[dir][1]; } arrows[x + ',' + y] = 'end'; }

    /* 2D plan */
    const CS = 2;
    const board = wb.layer('board');
    const g2 = C.s('g', { class: 'dc-plan' }, board);
    const tiles = C.s('g', null, g2);
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
      const c = cellOf(x, y);
      if (c === '#' || c === ' ' || c == null) continue;
      const cls = 'dc-tile' + ((x + y) % 2 ? ' odd' : '') + (goal && x === goal[0] && y === goal[1] ? ' goal' : '') + (x === startAt[0] && y === startAt[1] ? ' start' : '');
      C.s('rect', { x: x * CS + 0.06, y: y * CS + 0.06, width: CS - 0.12, height: CS - 0.12, rx: 0.2, class: cls, 'data-key': 'c' + x + '-' + y }, tiles);
      if (c >= '1' && c <= '6') C.s('text', { x: x * CS + CS / 2, y: y * CS + CS / 2 + 0.36, 'text-anchor': 'middle', class: 'dc-num', text: c }, tiles);
      const a = arrows[x + ',' + y];
      if (a && a !== 'end') {
        const [dx, dy] = DIRS[a], cx = x * CS + CS / 2 + dx * 0.72, cy = y * CS + CS / 2 + dy * 0.72;
        C.s('path', { d: 'M' + (cx - dy * 0.22 - dx * 0.2) + ' ' + (cy + dx * 0.22 - dy * 0.2) + 'L' + (cx + dx * 0.2) + ' ' + (cy + dy * 0.2) + 'L' + (cx + dy * 0.22 - dx * 0.2) + ' ' + (cy - dx * 0.22 - dy * 0.2), class: 'dc-arrow' }, tiles);
      }
      if (goal && x === goal[0] && y === goal[1]) C.s('text', { x: x * CS + CS / 2, y: y * CS + CS - 0.22, 'text-anchor': 'middle', class: 'dc-goalt', text: d.goalTop ? 'end with ' + d.goalTop : 'goal' }, tiles);
      if (!isMaze && a === 'end') C.s('text', { x: x * CS + CS / 2, y: y * CS + CS - 0.22, 'text-anchor': 'middle', class: 'dc-goalt', text: 'end' }, tiles);
    }
    const dieG = C.s('g', { class: 'dc-die' }, board);
    wb.setBounds({ x0: -0.6, y0: -0.6, x1: W * CS + 0.6, y1: Hh * CS + 0.6 }, 0.06);
    function draw2D(at, o, scale) {
      dieG.innerHTML = '';
      const cx = at[0] * CS + CS / 2, cy = at[1] * CS + CS / 2;
      const g = C.s('g', { transform: 'translate(' + cx + ' ' + cy + ') scale(' + (scale || 1) + ')' }, dieG);
      pips2D(g, o[0], 0, 0, 1.08);
      [['n', 0, -0.66], ['s', 0, 0.9], ['e', 0.76, 0.12], ['w', -0.76, 0.12]].forEach(([f, x, y]) => C.s('text', { x, y, 'text-anchor': 'middle', class: 'dc-side', text: String(faceOf(o, f)) }, g));
    }

    /* 3D */
    let v = null;
    const cellMesh = new Map();
    function build3D(fit) {
      if (!v) return;
      v.clear();
      for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
        const c = cellOf(x, y);
        if (c === '#' || c === ' ' || c == null) continue;
        const isGoal = goal && x === goal[0] && y === goal[1], isStart = x === startAt[0] && y === startAt[1];
        const col = isGoal ? '#d9a441' : isStart ? '#5fae83' : (x + y) % 2 ? '#c9a878' : '#d8bb8e';
        const decals = {};
        if (c >= '1' && c <= '6') decals[0] = textDecal(c, '#3a2a18', 0.6);
        else if (arrows[x + ',' + y] && arrows[x + ',' + y] !== 'end') decals[0] = arrowDecal(arrows[x + ',' + y]);
        else if (isGoal && d.goalTop) decals[0] = textDecal('→' + d.goalTop, '#3a2a18', 0.4);
        const m = v.add({ verts: [[x + 0.03, 0, y + 0.97], [x + 0.97, 0, y + 0.97], [x + 0.97, 0, y + 0.03], [x + 0.03, 0, y + 0.03]], faces: [[0, 1, 2, 3]], color: col, lw: 0.8, decals, cell: [x, y], bias: 500 });
        cellMesh.set(x + ',' + y, m);
        // the sides of the tile
        v.add({ verts: [[x + 0.03, -0.12, y + 0.97], [x + 0.97, -0.12, y + 0.97], [x + 0.97, 0, y + 0.97], [x + 0.03, 0, y + 0.97]], faces: [[0, 1, 2, 3]], color: '#8a6a44', stroke: false, pickable: false, bias: 500 });
      }
      dieMesh = v.voxels([dieCell(0, 0, 0, st.o)], { id: 'die', gap: 0.015, lw: 1.1 });
      dieMesh.m = C.M4.translate(st.x, 0, st.y);
      if (fit) { v.fit(W * Hh <= 6 ? 1.6 : W * Hh <= 12 ? 1.25 : 1.0); v.cam.yaw = 18; v.cam.pitch = 52; }
      v.render();
    }
    let dieMesh = null;
    function arrowDecal(dir) {
      return { draw(c) {
        c.save(); c.translate(0.5, 0.5);
        const rotd = { E: 0, N: Math.PI / 2, W: Math.PI, S: -Math.PI / 2 }[dir];
        c.rotate(rotd);
        c.strokeStyle = 'rgba(80,50,20,.75)'; c.lineWidth = 0.07; c.lineCap = 'round'; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(-0.22, 0); c.lineTo(0.2, 0); c.moveTo(0.06, -0.14); c.lineTo(0.22, 0); c.lineTo(0.06, 0.14); c.stroke();
        c.restore();
      } };
    }
    v = wb.use3D({
      onPick(hit) { if (!hit || !hit.mesh || !hit.mesh.cell || !isMaze) return; tryCell(hit.mesh.cell[0], hit.mesh.cell[1]); },
      orbit: () => { if (v.cam.pitch < 8) { v.cam.pitch = 8; v.render(); } }
    });
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) build3D(false); });

    function show() { draw2D([st.x, st.y], st.o); if (dieMesh) { dieMesh.m = C.M4.translate(st.x, 0, st.y); } build3D(false); }
    let moves = 0;

    function animRoll(dir, done) {
      const from = { x: st.x, y: st.y, o: st.o.slice() };
      const [dx, dy] = DIRS[dir];
      const to = { x: st.x + dx, y: st.y + dy, o: roll(st.o, dir) };
      busy = true;
      const ms = C.anim(300);
      const axis = dir === 'E' || dir === 'W' ? [0, 0, 1] : [1, 0, 0];
      const ang = { E: -90, W: 90, S: 90, N: -90 }[dir];
      const pivot = dir === 'E' ? [from.x + 1, 0, 0] : dir === 'W' ? [from.x, 0, 0] : dir === 'S' ? [0, 0, from.y + 1] : [0, 0, from.y];
      ctx.sfx('tap');
      const finish = () => { st = to; busy = false; show(); if (done) done(); };
      if (wb.is3D && dieMesh) {
        v.animate(ms, (e) => { dieMesh.m = C.M4.mul(C.M4.rotate(ang * e, axis, pivot), C.M4.translate(from.x, 0, from.y)); }, () => { if (alive) finish(); });
      } else {
        const t0 = performance.now();
        const step = (now) => {
          if (!alive) return;
          const k = Math.min(1, (now - t0) / Math.max(1, ms));
          const at = [from.x + dx * k, from.y + dy * k];
          draw2D(at, k < 0.5 ? from.o : to.o, 1 - Math.sin(k * Math.PI) * 0.22);
          if (k < 1) requestAnimationFrame(step); else finish();
        };
        requestAnimationFrame(step);
      }
    }
    function tryDir(dir) {
      if (busy || !isMaze) return;
      const [dx, dy] = DIRS[dir], o2 = roll(st.o, dir), x = st.x + dx, y = st.y + dy;
      const c = cellOf(x, y);
      if (c === '#' || c == null || c === ' ') { ctx.toast('There is no floor there.'); ctx.sfx('wrong'); return; }
      if (c >= '1' && c <= '6' && o2[0] !== +c) { ctx.toast('Rolled that way the die would show ' + o2[0] + ' on top — this square wants ' + c + '.'); ctx.sfx('wrong'); return; }
      moves++;
      animRoll(dir, () => { ctx.move(moves); ctx.changed('roll'); });
    }
    function tryCell(x, y) {
      const dx = x - st.x, dy = y - st.y;
      if (Math.abs(dx) + Math.abs(dy) !== 1) { if (dx || dy) ctx.toast('The die rolls one square at a time, to a neighbouring square.'); return; }
      tryDir(dx === 1 ? 'E' : dx === -1 ? 'W' : dy === 1 ? 'S' : 'N');
    }
    wb.handlers.board = {
      down(pt) { return isMaze && pt[0] >= 0 && pt[1] >= 0 && pt[0] < W * CS && pt[1] < Hh * CS; },
      up(pt) { if (isMaze) tryCell(Math.floor(pt[0] / CS), Math.floor(pt[1] / CS)); },
      tap(pt) { if (isMaze) tryCell(Math.floor(pt[0] / CS), Math.floor(pt[1] / CS)); }
    };

    const inst = { destroy() { alive = false; wb.handlers.board = null; } };
    if (isMaze) {

      const isGoal = () => st.x === goal[0] && st.y === goal[1] && (!d.goalTop || st.o[0] === d.goalTop);
      inst.check = () => (isGoal() ? { solved: true, msg: 'The die is home.' } : { solved: false, msg: st.x === goal[0] && st.y === goal[1] ? 'On the goal — but it must show ' + d.goalTop + ' on top.' : 'Not at the goal yet.' });
      inst.hint = () => {
        const path = mazeSolve(d, [st.x, st.y], st.o);
        if (!path) return 'From here the die cannot reach the goal — undo a few rolls.';
        if (!path.length) return 'You are there!';
        const nm = { N: 'north (up the page)', S: 'south (down)', E: 'east (right)', W: 'west (left)' };
        return 'Roll it **' + nm[path[0]] + '**. (From here the goal is ' + C.plural(path.length, 'roll') + ' away.)';
      };
      inst.solve = () => {
        const path = mazeSolve(d, [st.x, st.y], st.o);
        if (!path) { st = { x: startAt[0], y: startAt[1], o: d.die.slice() }; moves = 0; show(); return inst.solve(); }
        let i = 0;
        const next = () => { if (!alive) return; if (i >= path.length) { ctx.changed('solve'); return; } moves++; ctx.move(moves); animRoll(path[i++], () => setTimeout(next, C.anim(120))); };
        next();
      };
      inst.getState = () => ({ x: st.x, y: st.y, o: st.o.slice(), m: moves });
      inst.setState = (s) => { if (s && s.o) { st = { x: s.x, y: s.y, o: s.o.slice() }; moves = s.m || 0; show(); } };
      inst.key = (ev) => {
        if (ev.type !== 'keydown') return false;
        const map = { ArrowUp: 'N', ArrowDown: 'S', ArrowLeft: 'W', ArrowRight: 'E' };
        let dir = map[ev.key];
        if (!dir) return false;
        if (wb.is3D && v) {
          // arrows follow the camera: up is away from you
          const y = v.cam.yaw * Math.PI / 180;
          const fwd = [-Math.sin(y), -Math.cos(y)], right = [Math.cos(y), -Math.sin(y)];
          const want = dir === 'N' ? fwd : dir === 'S' ? [-fwd[0], -fwd[1]] : dir === 'E' ? right : [-right[0], -right[1]];
          dir = Object.keys(DIRS).reduce((b, k) => (DIRS[k][0] * want[0] + DIRS[k][1] * want[1] > DIRS[b][0] * want[0] + DIRS[b][1] * want[1] ? k : b), 'N');
        }
        tryDir(dir);
        return true;
      };
      ctx.setGoal(p.goal || ('Roll the die to the gold square' + (d.goalTop ? ', arriving with **' + d.goalTop + '** on top' : '') + '. A numbered square takes the die only if that number comes out on top.'));
    } else {
      const box = answerBox(ctx, p);
      let played = false;
      const playPath = (done) => {
        st = { x: startAt[0], y: startAt[1], o: d.die.slice() };
        show();
        let i = 0;
        const next = () => { if (!alive) return; if (i >= d.path.length) { played = true; if (done) done(); return; } animRoll(d.path[i++], () => setTimeout(next, C.anim(90))); };
        setTimeout(next, C.anim(250));
      };
      inst.noMoves = true;
      inst.solve = () => { box.feedback('The answer: <b>' + d.answer + '</b> — watch it roll.', 'good'); if (!busy) playPath(); };
      inst.hint = (k) => {
        let o = d.die.slice();
        const upto = Math.min(d.path.length - 1, Math.floor(d.path.length / 2) + k * 2);
        for (let i = 0; i < upto; i++) o = roll(o, d.path[i]);
        if (upto <= 0) return null;
        return 'After the first ' + C.plural(upto, 'roll') + ' (' + d.path.slice(0, upto).split('').join(' ') + ') the die has **' + o[0] + '** on top, **' + o[1] + '** facing south and **' + o[2] + '** facing east.';
      };
      void played;
      ctx.button('Show the start again', () => { if (!busy) { st = { x: startAt[0], y: startAt[1], o: d.die.slice() }; show(); } }, 'small');
    }
    wb.set3D(true);
    build3D(true);
    show();
    return inst;
  }

  /* ---------- endless ---------- */

  const ORLIST = Array.from(ORIENTS.values());
  function randDie(rng) { return rng.pick(ORLIST).slice(); }
  function genScene(rng, level) {
    let dice = [];
    let text;
    const kind = level === 1 ? rng.pick(['tower', 'single']) : level === 2 ? rng.pick(['tower', 'row']) : rng.pick(['row', 'block', 'tower']);
    if (kind === 'single') {
      const o = randDie(rng);
      dice = [[0, 0, 0, ...o]];
      return { title: 'Face Down', text: 'A standard die lies on the table. Walk round it and look. What number is on the face resting on the table?', data: { kind: 'scene', dice, ask: { face: [0, 'b'] }, answer: 7 - o[0] }, diff: 1 };
    }
    if (kind === 'tower') {
      const n = level === 1 ? rng.range(2, 3) : rng.range(3, 6);
      for (let i = 0; i < n; i++) dice.push([0, i, 0, ...randDie(rng)]);
      text = 'A tower of ' + n + ' standard dice. Add up every face you cannot see from anywhere: the faces pressed together and the one on the table.';
    } else if (kind === 'row') {
      const n = rng.range(3, level >= 4 ? 5 : 4);
      for (let i = 0; i < n; i++) dice.push([i, 0, 0, ...randDie(rng)]);
      text = n + ' standard dice stand side by side on a table, touching. What is the total of all the faces that are hidden — against the table or against each other?';
    } else {
      // a 2 × 2 block with some on top
      [[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1]].forEach((q) => dice.push([...q, ...randDie(rng)]));
      const top = rng.range(1, level >= 5 ? 4 : 2);
      const spots = rng.shuffle([[0, 1, 0], [1, 1, 0], [0, 1, 1], [1, 1, 1]]).slice(0, top);
      spots.forEach((q) => dice.push([...q, ...randDie(rng)]));
      text = 'Four standard dice make a square on the table, and ' + C.plural(top, 'more die', 'more dice') + ' sit' + (top === 1 ? 's' : '') + ' on top. What is the total of the hidden faces — every face touching the table or another die?';
    }
    const d = { kind: 'scene', dice, ask: 'hidden' };
    d.answer = sceneAnswer(d);
    return { title: kind === 'tower' ? 'A Tower of ' + dice.length : kind === 'row' ? 'Shoulder to Shoulder' : 'The Stack of ' + dice.length, text, data: d, diff: level };
  }
  function genRoll(rng, level) {
    const n = [0, 3, 5, 8, 12, 16][level];
    let x = 0, y = 0, path = '';
    const seen = new Set(['0,0']);
    const dirs = 'NESW';
    for (let i = 0; i < n; i++) {
      const opts = dirs.split('').filter((dd) => !seen.has((x + DIRS[dd][0]) + ',' + (y + DIRS[dd][1])) && (!path || dd !== { N: 'S', S: 'N', E: 'W', W: 'E' }[path[path.length - 1]]));
      if (!opts.length) return null;
      const dd = rng.pick(opts);
      path += dd; x += DIRS[dd][0]; y += DIRS[dd][1];
      seen.add(x + ',' + y);
    }
    const die = randDie(rng);
    const ask = level >= 4 && rng() < 0.4 ? 's' : 't';
    const d = { kind: 'roll', start: [0, 0], die, path, ask };
    d.answer = faceOf(rollPath(d).o, ask);
    const names = { N: 'north', S: 'south', E: 'east', W: 'west' };
    return { title: 'Rolling ' + path.length + ' Squares', text: 'The die starts with **' + die[0] + '** on top, **' + die[1] + '** facing you (south) and **' + die[2] + '** on the east side. It tips over its edges along the arrows: ' + path.split('').map((c) => names[c]).join(', ') + '. At the end, what number is ' + (ask === 't' ? 'on top' : 'facing south (towards you)') + '?', data: d, diff: level };
  }
  function genMaze(rng, level) {
    const band = [null, [2, 4], [4, 6], [6, 9], [9, 13], [13, 22]][level];
    const W = rng.range(4, 4 + Math.min(3, level)), Hh = rng.range(4, 4 + Math.min(3, level));
    for (let tries = 0; tries < 150; tries++) {
      const rows = [];
      for (let y = 0; y < Hh; y++) {
        let r = '';
        for (let x = 0; x < W; x++) { const u = rng(); r += u < 0.1 + level * 0.015 ? '#' : u < 0.1 + level * 0.015 + 0.3 + level * 0.06 ? String(rng.range(1, 6)) : '.'; }
        rows.push(r);
      }
      const start = [0, rng.int(Hh)], goal = [W - 1, rng.int(Hh)];
      const setC = (q, ch) => { rows[q[1]] = rows[q[1]].slice(0, q[0]) + ch + rows[q[1]].slice(q[0] + 1); };
      setC(start, '.'); setC(goal, '.');
      const d = { kind: 'maze', grid: rows, start, goal, die: randDie(rng) };
      if (level >= 4 && rng() < 0.6) d.goalTop = rng.range(1, 6);
      const path = mazeSolve(d);
      if (!path || path.length < band[0] || path.length > band[1]) continue;
      // the numbers must matter: without them the way would be shorter
      const free = Object.assign({}, d, { grid: rows.map((r) => r.replace(/[1-6]/g, '.')), goalTop: null });
      const fp = mazeSolve(free);
      if (level >= 3 && fp && fp.length === path.length) continue;
      return { title: 'Die Maze ' + W + '×' + Hh, text: 'Roll the die from the green square to the gold one. It tips over one edge at a time onto a neighbouring square. A numbered square only takes the die if that number comes out **on top**; blank squares take it any way up; there is no floor where there is no square.' + (d.goalTop ? ' It must arrive with **' + d.goalTop + '** on top.' : ''), data: d, par: path.length, diff: level };
    }
    return null;
  }
  function generate(rng, level) {
    for (let k = 0; k < 12; k++) { const p = generate1(rng, level); if (p) return p; }
    return null;
  }
  function generate1(rng, level) {
    const r = rng();
    if (level <= 2) return r < 0.5 ? genScene(rng, level) : r < 0.8 ? genRoll(rng, level) : genMaze(rng, level);
    if (level === 3) return r < 0.3 ? genScene(rng, level) : r < 0.6 ? genRoll(rng, level) : genMaze(rng, level);
    return r < 0.25 ? genRoll(rng, level) : r < 0.35 ? genScene(rng, level) : genMaze(rng, level);
  }

  C.engine({
    id: 'dice',
    name: 'Dice',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: (p) => {
      const k = p && p.data && p.data.kind;
      const common = ' **Drag** in the 3D view to look round; the wheel zooms. On these dice opposite faces add up to 7, and with 1 on top and 2 facing south (towards you), 3 is on the east.';
      if (k === 'maze') return 'Roll the die one square at a time: **click a neighbouring square** (in 3D or on the flat plan) or use the **arrow keys** (in 3D they follow your view). A numbered square takes the die only if that number comes out on top.' + common;
      if (k === 'roll') return 'Follow the die in your head as it tips along the arrows, and answer in the panel. The solution rolls it for you.' + common;
      return 'Look at the dice from every side and answer in the panel.' + common;
    },
    verify,
    answerKey(p) { return p.data.kind === 'maze' ? null : String(p.data.answer); },
    generate,
    mount,
    thumb(p) {
      const d = p.data;
      const face = (x, y, n, s) => {
        let out = '<rect x="' + (x - s / 2) + '" y="' + (y - s / 2) + '" width="' + s + '" height="' + s + '" rx="' + s * 0.18 + '" fill="#f3eee2" stroke="#8b8577" stroke-width="1.2"/>';
        (PIPS[n] || []).forEach(([u, w]) => { out += '<circle cx="' + (x - s / 2 + u * s) + '" cy="' + (y - s / 2 + w * s) + '" r="' + s * (n === 1 ? 0.12 : 0.085) + '" fill="' + (n === 1 ? '#c62f35' : '#1d2034') + '"/>'; });
        return out;
      };
      let s = '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet">';
      if (d.kind === 'maze' || d.kind === 'roll') {
        const cells = d.kind === 'maze' ? d.grid : null;
        if (cells) {
          const Wd = Math.max(...cells.map((r) => r.length)), Hd = cells.length, k = Math.min(140 / Wd, 104 / Hd), ox = 80 - Wd * k / 2, oy = 60 - Hd * k / 2;
          cells.forEach((row, y) => row.split('').forEach((c, x) => {
            if (c === '#') return;
            const gl = d.goal[0] === x && d.goal[1] === y, stt = d.start[0] === x && d.start[1] === y;
            s += '<rect x="' + (ox + x * k + 1) + '" y="' + (oy + y * k + 1) + '" width="' + (k - 2) + '" height="' + (k - 2) + '" rx="3" fill="' + (gl ? '#d9a441' : stt ? '#5fae83' : (x + y) % 2 ? '#c9a878' : '#d8bb8e') + '"/>';
            if (c !== '.') s += '<text x="' + (ox + x * k + k / 2) + '" y="' + (oy + y * k + k * 0.68) + '" text-anchor="middle" font-size="' + k * 0.5 + '" font-weight="700" fill="#3a2a18">' + c + '</text>';
          }));
          s += face(ox + d.start[0] * k + k / 2, oy + d.start[1] * k + k / 2, d.die[0], k * 0.7);
        } else {
          const r = rollPath(d), xs = r.cells.map((c) => c[0]), ys = r.cells.map((c) => c[1]);
          const x0 = Math.min(...xs), y0 = Math.min(...ys), Wd = Math.max(...xs) - x0 + 1, Hd = Math.max(...ys) - y0 + 1;
          const k = Math.min(140 / Wd, 104 / Hd, 34), ox = 80 - Wd * k / 2, oy = 60 - Hd * k / 2;
          r.cells.forEach(([x, y], i) => { s += '<rect x="' + (ox + (x - x0) * k + 1) + '" y="' + (oy + (y - y0) * k + 1) + '" width="' + (k - 2) + '" height="' + (k - 2) + '" rx="3" fill="' + (i === r.cells.length - 1 ? '#d9a441' : '#d8bb8e') + '"/>'; });
          s += face(ox + (d.start[0] - x0) * k + k / 2, oy + (d.start[1] - y0) * k + k / 2, d.die[0], k * 0.72);
        }
      } else if (d.kind === 'scene') {
        const n = d.dice.length, cols = {};
        d.dice.forEach((q) => { const k2 = q[0] + q[2] * 0.5; cols[k2] = Math.max(cols[k2] || 0, q[1] + 1); });
        const xs = Object.keys(cols).map(Number).sort((a, b) => a - b), mh = Math.max(...Object.values(cols));
        const sz = Math.min(30, 100 / Math.max(xs.length, mh));
        xs.forEach((x, i) => { for (let lv = 0; lv < cols[x]; lv++) { const q = d.dice.find((dd) => dd[0] + dd[2] * 0.5 === x && dd[1] === lv); s += face(80 + (i - (xs.length - 1) / 2) * (sz + 3), 104 - sz / 2 - lv * (sz + 1), q ? q[3] : 1, sz); } });
        void n;
      } else {
        d.views.forEach((o, i) => { s += face(30 + i * 50, 60, o[0], 30); });
      }
      return s + '</svg>';
    }
  });

  C.diceLib = { roll, faceOf, ORIENTS, validDie, sceneAnswer, sceneInfo, mazeSolve, rollPath, oppositeFromViews, turnings, genScene, genRoll, genMaze, generate };

  C.css('dice', `
    .dc-tile { fill: #d8bb8e; stroke: rgba(0,0,0,.25); stroke-width: .05; }
    .dc-tile.odd { fill: #c9a878; }
    .dc-tile.start { fill: #5fae83; } .dc-tile.goal { fill: #d9a441; }
    .dc-num { font: 800 1px Georgia, serif; fill: #3a2a18; pointer-events: none; }
    .dc-arrow { fill: none; stroke: rgba(80,50,20,.7); stroke-width: .14; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
    .dc-goalt { font: 700 .3px "Segoe UI", system-ui, sans-serif; fill: rgba(58,42,24,.8); pointer-events: none; }
    .dc-die { pointer-events: none; }
    .dc-die2 { fill: #f3eee2; stroke: #6f6a5e; stroke-width: .05; }
    .dc-pip { fill: #1d2034; } .dc-pip.one { fill: #c62f35; }
    .dc-side { font: 700 .32px "Segoe UI", system-ui, sans-serif; fill: rgba(30,30,40,.75); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
