/* The Puzzle Cabinet · engines/twiddle.js
 *
 * Permutation puzzles on a flat board, all solved by turning or sliding
 * groups of pieces:
 *
 *   twiddle  a numbered grid; turn any k×k block a quarter turn (Simon
 *            Tatham's Twiddle). Options: orient (every tile must also end
 *            upright), rows (tiles carry only their row number).
 *   turn     turntables: the same, but only the blocks on the round tables turn
 *   loop     Loopover / Sixteen: slide a whole row or column one step; the
 *            tile pushed off one end comes back at the other
 *   rings    Hungarian rings: two rings of balls that cross at two places;
 *            turn either ring by any number of steps
 *
 * data: {
 *   kind: 'twiddle' | 'turn' | 'loop' | 'rings',
 *   w, h, k                 grid size and block size (twiddle, turn, loop)
 *   tables: [[bx, by], …]   the turntables (turn): top-left cell of each k×k block
 *   orient, rows            twiddle options
 *   start: [labels]         labels in reading order (goal: 0, 1, 2 … or the row number)
 *   ori: [0..3]             quarter turns of each tile clockwise from upright (orient)
 *   n, m, goal, start       rings: n places per ring; the rings cross at places m and n − m of the
 *                           left ring; goal and start are strings, one letter per ball
 *   sol: "3+ 0- 2+"         a shortest solution (tokens below); p.par = its length
 * }
 * Tokens: block turns "b+" / "b-" (block number in reading order, + = clockwise);
 * slides "r2+" (row 2 right) "r2-" "c0+" (column 0 down) "c0-"; ring turns "A3" "B-2"
 * (left or right ring, steps clockwise; one token counts one move, whatever the steps).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the models: states are strings, one character per place ---------- */

  const CH0 = 48;
  const enc = (arr) => String.fromCharCode.apply(null, arr.map((x) => x + CH0));
  const dec = (s) => Array.from(s, (c) => c.charCodeAt(0) - CH0);

  function blocksOf(d) {
    if (d.kind === 'turn') return d.tables.map((t) => t.slice());
    const out = [];
    for (let by = 0; by <= d.h - d.k; by++) for (let bx = 0; bx <= d.w - d.k; bx++) out.push([bx, by]);
    return out;
  }

  const modelCache = new Map();
  function model(d) {
    const key = JSON.stringify([d.kind, d.w, d.h, d.k, d.tables, d.orient, d.rows, d.n, d.m, d.goal]);
    if (modelCache.has(key)) return modelCache.get(key);
    let M;
    if (d.kind === 'twiddle' || d.kind === 'turn') M = gridModel(d);
    else if (d.kind === 'loop') M = loopModel(d);
    else if (d.kind === 'rings') M = ringModel(d);
    else throw new Error('twiddle: unknown kind ' + d.kind);
    if (modelCache.size > 40) modelCache.clear();
    modelCache.set(key, M);
    return M;
  }

  function gridModel(d) {
    const w = d.w, h = d.h, k = d.k, n = w * h, orient = !!d.orient;
    const blocks = blocksOf(d), gens = [];
    blocks.forEach(([bx, by], bi) => {
      const cw = new Int16Array(n), rot = new Int8Array(n);
      for (let i = 0; i < n; i++) cw[i] = i;
      for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) {
        const old = (bx + i) + (by + j) * w, nw = (bx + k - 1 - j) + (by + i) * w;
        cw[nw] = old; rot[nw] = 1;
      }
      const ccw = new Int16Array(n);
      for (let i = 0; i < n; i++) ccw[cw[i]] = i;
      const rot3 = rot.map((x) => x * 3);
      gens.push({ perm: cw, rot: orient ? rot : null, block: bi, dir: 1, inv: gens.length + 1, tok: bi + '+' });
      gens.push({ perm: ccw, rot: orient ? rot3 : null, block: bi, dir: -1, inv: gens.length - 1, tok: bi + '-' });
    });
    const goalArr = [];
    for (let i = 0; i < n; i++) goalArr.push((d.rows ? Math.floor(i / w) : i) * (orient ? 4 : 1));
    return { kind: d.kind, d, n, w, h, k, orient, blocks, gens, goal: enc(goalArr), cost: () => 1 };
  }

  function loopModel(d) {
    const w = d.w, h = d.h, n = w * h, gens = [];
    for (let r = 0; r < h; r++) {
      const p = new Int16Array(n);
      for (let i = 0; i < n; i++) p[i] = i;
      for (let x = 0; x < w; x++) p[((x + 1) % w) + r * w] = x + r * w;
      const q = new Int16Array(n); for (let i = 0; i < n; i++) q[p[i]] = i;
      gens.push({ perm: p, line: 'r', idx: r, dir: 1, inv: gens.length + 1, tok: 'r' + r + '+' });
      gens.push({ perm: q, line: 'r', idx: r, dir: -1, inv: gens.length - 1, tok: 'r' + r + '-' });
    }
    for (let c = 0; c < w; c++) {
      const p = new Int16Array(n);
      for (let i = 0; i < n; i++) p[i] = i;
      for (let y = 0; y < h; y++) p[c + ((y + 1) % h) * w] = c + y * w;
      const q = new Int16Array(n); for (let i = 0; i < n; i++) q[p[i]] = i;
      gens.push({ perm: p, line: 'c', idx: c, dir: 1, inv: gens.length + 1, tok: 'c' + c + '+' });
      gens.push({ perm: q, line: 'c', idx: c, dir: -1, inv: gens.length - 1, tok: 'c' + c + '-' });
    }
    const goalArr = [];
    for (let i = 0; i < n; i++) goalArr.push(i);
    return { kind: 'loop', d, n, w, h, gens, goal: enc(goalArr), cost: () => 1 };
  }

  // two rings of n places; they share the left ring's places m and n − m
  function ringModel(d) {
    const n = d.n, m = d.m;
    const A = [], B = [];
    for (let k = 0; k < n; k++) A.push(k);
    let next = n;
    for (let k = 0; k < n; k++) B.push(k === n / 2 - m ? m : k === n / 2 + m ? n - m : next++);
    const total = next, gens = [];
    [A, B].forEach((ring, ri) => {
      for (let s = 1; s < n; s++) {
        const p = new Int16Array(total);
        for (let i = 0; i < total; i++) p[i] = i;
        for (let k = 0; k < n; k++) p[ring[(k + s) % n]] = ring[k];
        const signed = s <= n / 2 ? s : s - n;
        gens.push({ perm: p, ring: ri, steps: signed, tok: 'AB'[ri] + signed });
      }
    });
    gens.forEach((g) => { g.inv = gens.findIndex((x) => x.ring === g.ring && ((x.steps + g.steps) % n === 0)); });
    return { kind: 'rings', d, n, m, A, B, total, gens, goal: d.goal, cost: () => 1 };
  }

  function apply(M, s, gi) {
    const g = M.gens[gi], p = g.perm, n = p.length;
    const out = new Array(n);
    if (M.kind === 'rings') {
      for (let j = 0; j < n; j++) out[j] = s[p[j]];
      return out.join('');
    }
    if (g.rot) {
      for (let j = 0; j < n; j++) { const c = s.charCodeAt(p[j]) - CH0; out[j] = ((c & ~3) | ((c + g.rot[j]) & 3)) + CH0; }
    } else {
      for (let j = 0; j < n; j++) out[j] = s.charCodeAt(p[j]);
    }
    return String.fromCharCode.apply(null, out);
  }

  function tokIndex(M, tok) {
    const i = M.gens.findIndex((g) => g.tok === tok);
    if (i < 0) throw new Error('twiddle: no move ' + tok);
    return i;
  }
  const parseSol = (M, sol) => String(sol || '').trim().split(/\s+/).filter(Boolean).map((t) => tokIndex(M, t));

  function startOf(M, d) {
    if (M.kind === 'rings') return d.start;
    const o = M.orient;
    return enc(d.start.map((l, i) => (o ? l * 4 + ((d.ori && d.ori[i]) || 0) : l)));
  }

  /* bidirectional breadth-first search: a shortest list of moves from a to b */
  function solve(M, a, b, limit) {
    b = b || M.goal;
    if (a === b) return { path: [], nodes: 0 };
    limit = limit || 400000;
    const G = M.gens;
    const fw = new Map([[a, null]]), bw = new Map([[b, null]]);
    let ff = [a], bf = [b], fd = 0, bd = 0, nodes = 0;
    const depth = new Map([[a, 0]]), bdepth = new Map([[b, 0]]);
    while (ff.length && bf.length) {
      const forward = ff.length <= bf.length;
      const front = forward ? ff : bf, mine = forward ? fw : bw, other = forward ? bw : fw;
      const myDepth = forward ? depth : bdepth, otherDepth = forward ? bdepth : depth;
      const nextF = [];
      let best = null;
      for (const x of front) {
        const dx = myDepth.get(x);
        for (let gi = 0; gi < G.length; gi++) {
          const y = apply(M, x, forward ? gi : G[gi].inv);
          if (mine.has(y)) continue;
          mine.set(y, [x, gi]);
          myDepth.set(y, dx + 1);
          nodes++;
          if (other.has(y)) {
            const len = dx + 1 + otherDepth.get(y);
            if (!best || len < best.len) best = { y, len };
          }
          nextF.push(y);
        }
        if (nodes > limit) return { fail: 'nodes', nodes };
      }
      if (best) {
        const path = [];
        let cur = best.y;
        while (fw.get(cur)) { const e = fw.get(cur); path.unshift(e[1]); cur = e[0]; }
        cur = best.y;
        while (bw.get(cur)) { const e = bw.get(cur); path.push(e[1]); cur = e[0]; }
        return { path, nodes };
      }
      if (forward) { ff = nextF; fd++; } else { bf = nextF; bd++; }
    }
    return { fail: 'none', nodes };
  }

  /* ---------- checking ---------- */

  function sameMultiset(a, b) { return a.length === b.length && a.split('').sort().join('') === b.split('').sort().join(''); }

  function verify(p) {
    const d = p.data;
    let M;
    try { M = model(d); } catch (e) { return { ok: false, err: e.message }; }
    if (M.kind === 'rings') {
      if (d.n % 2 || d.m < 1 || 4 * d.m >= d.n) return { ok: false, err: 'rings: n must be even and 0 < m < n/4' };
      if (!d.goal || d.goal.length !== M.total) return { ok: false, err: 'rings: goal must have ' + M.total + ' balls' };
    } else if (!Array.isArray(d.start) || d.start.length !== M.n) return { ok: false, err: 'start must list ' + M.n + ' tiles' };
    const start = startOf(M, d);
    if (!sameMultiset(start.split('').map((c) => (M.orient ? String.fromCharCode(((c.charCodeAt(0) - CH0) & ~3) + CH0) : c)).join(''),
      M.goal)) return { ok: false, err: 'start does not use the goal\'s pieces' };
    if (start === M.goal) return { ok: false, err: 'already solved' };
    let sol;
    try { sol = parseSol(M, d.sol); } catch (e) { return { ok: false, err: e.message }; }
    let s = start;
    sol.forEach((gi) => { s = apply(M, s, gi); });
    if (s !== M.goal) return { ok: false, err: 'the stored solution does not reach the goal' };
    if (p.par != null && p.par !== sol.length) return { ok: false, err: 'par ' + p.par + ' but the stored solution has ' + sol.length };
    // nothing shorter
    const r = solve(M, start, M.goal, 2500000);
    if (r.fail) return { ok: true, par: sol.length, warn: 'optimality not proved (' + r.fail + ')' };
    if (r.path.length !== sol.length) return { ok: false, err: 'the stored solution has ' + sol.length + ' moves but ' + r.path.length + ' is enough' };
    return { ok: true, par: sol.length };
  }

  /* ---------- making puzzles ---------- */

  // a random scramble of `depth` moves from the goal; returns the puzzle data with a shortest solution
  function scramble(d, rng, depth, exact) {
    const M = model(d);
    let s = M.goal, last = -1;
    for (let i = 0; i < depth * 8 && i < 400; i++) {
      let gi;
      do { gi = rng.int(M.gens.length); } while (last >= 0 && (gi === M.gens[last].inv || (M.kind === 'rings' && M.gens[gi].ring === M.gens[last].ring)));
      s = apply(M, s, gi); last = gi;
      if (i + 1 >= depth) {
        if (s === M.goal) continue;
        const r = solve(M, s, M.goal, 1500000);
        if (r.fail) return null;
        if (exact ? r.path.length === depth : r.path.length >= depth) return finish(M, d, s, r.path);
        if (r.path.length > depth) return null;
      }
    }
    return null;
  }
  function finish(M, d, s, path) {
    const out = Object.assign({}, d);
    if (M.kind === 'rings') out.start = s;
    else {
      const a = dec(s);
      out.start = a.map((c) => (M.orient ? c >> 2 : c));
      if (M.orient) out.ori = a.map((c) => c & 3);
    }
    out.sol = path.map((gi) => M.gens[gi].tok).join(' ');
    return { data: out, par: path.length };
  }

  // the goal colours of the rings: 'three' (left red, right blue, crossings gold),
  // 'four' (halves of four colours, crossings white) or 'numbers'
  function ringGoal(n, m, style) {
    const M = ringModel({ n, m, goal: '' });
    const g = new Array(M.total).fill('?');
    const half = (k) => { const a = k * 2 * Math.PI / n; return Math.sin(a) < -1e-9 ? 'up' : Math.sin(a) > 1e-9 ? 'down' : k === 0 ? 'up' : 'down'; };
    for (let k = 0; k < n; k++) {
      const ia = M.A[k], ib = M.B[k];
      if (style === 'three') { g[ia] = 'R'; if (g[ib] === '?') g[ib] = 'B'; }
      else if (style === 'four') { g[ia] = half(k) === 'up' ? 'R' : 'Y'; if (g[ib] === '?') g[ib] = half(k) === 'up' ? 'B' : 'G'; }
    }
    if (style === 'numbers') return Array.from({ length: M.total }, (_, i) => String.fromCharCode(97 + i)).join('');
    g[m] = style === 'three' ? 'O' : 'W';
    g[n - m] = style === 'three' ? 'O' : 'W';
    return g.join('');
  }

  const KINDS = {
    twiddle: 'Twiddle', turn: 'Turntables', loop: 'Loopover', rings: 'Hungarian rings'
  };
  function titleFor(d) {
    if (d.kind === 'rings') return 'Rings of ' + (d.goal.length);
    if (d.kind === 'loop') return 'Loopover ' + d.w + '×' + d.h;
    return (d.kind === 'turn' ? 'Turntables ' : 'Twiddle ') + d.w + '×' + d.h + (d.orient ? ', upright' : d.rows ? ', rows' : '');
  }
  function textFor(d, par) {
    const moves = C.plural(par, d.kind === 'rings' ? 'turn' : 'move');
    if (d.kind === 'twiddle') return 'Turn ' + d.k + '×' + d.k + ' blocks a quarter turn at a time until ' + (d.rows ? 'every row holds only its own number' : 'the tiles read 1, 2, 3 … in rows') + (d.orient ? ', every tile standing upright' : '') + '. It can be done in ' + moves + '.';
    if (d.kind === 'turn') return 'Only the blocks on the round turntables can turn. Put the tiles back in order, 1, 2, 3 … in rows, in ' + moves + '.';
    if (d.kind === 'loop') return 'Slide whole rows and columns — a tile pushed off one edge comes back at the other — until the tiles are in order again. It can be done in ' + moves + '.';
    return 'Turn the two rings until every ball is back where the picture in the corner shows. ' + C.plural(par, 'turn') + ' will do it — a turn of a ring by any number of places counts as one.';
  }

  const GEN_PLAN = {
    1: [['twiddle', { w: 3, h: 3, k: 2 }, [2, 3]], ['loop', { w: 3, h: 3 }, [2, 3]], ['rings', { n: 10, m: 2, style: 'three' }, [2, 2]], ['turn', { w: 4, h: 3, k: 2, tables: [[0, 0], [2, 0], [1, 1]] }, [2, 3]]],
    2: [['twiddle', { w: 3, h: 3, k: 2 }, [4, 5]], ['loop', { w: 3, h: 3 }, [4, 5]], ['rings', { n: 10, m: 2, style: 'three' }, [3, 3]], ['twiddle', { w: 3, h: 3, k: 2, rows: true }, [4, 5]]],
    3: [['twiddle', { w: 3, h: 3, k: 2 }, [6, 7]], ['loop', { w: 4, h: 4 }, [5, 6]], ['rings', { n: 10, m: 2, style: 'four' }, [3, 4]], ['twiddle', { w: 4, h: 4, k: 3 }, [4, 5]], ['turn', { w: 4, h: 4, k: 2, tables: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]] }, [4, 5]]],
    4: [['twiddle', { w: 3, h: 3, k: 2 }, [8, 9]], ['loop', { w: 4, h: 4 }, [7, 7]], ['rings', { n: 16, m: 3, style: 'four' }, [4, 4]], ['twiddle', { w: 3, h: 3, k: 2, orient: true }, [6, 7]], ['twiddle', { w: 4, h: 4, k: 2 }, [6, 6]]],
    5: [['twiddle', { w: 3, h: 3, k: 2 }, [9, 11]], ['loop', { w: 5, h: 5 }, [7, 7]], ['rings', { n: 10, m: 2, style: 'numbers' }, [5, 5]], ['twiddle', { w: 3, h: 3, k: 2, orient: true }, [8, 9]], ['twiddle', { w: 4, h: 4, k: 2 }, [7, 7]]]
  };

  function generate(rng, level) {
    const plan = rng.pick(GEN_PLAN[level]);
    const d = Object.assign({ kind: plan[0] }, plan[1]);
    if (d.kind === 'rings') { d.goal = ringGoal(d.n, d.m, d.style); delete d.style; }
    const depth = plan[2][0];
    for (let tries = 0; tries < 6; tries++) {
      const r = scramble(d, rng, depth, false);
      if (!r || r.par > plan[2][1]) continue;
      return { title: titleFor(d) + ' · ' + r.par, text: textFor(d, r.par), par: r.par, diff: level, data: r.data };
    }
    return null;
  }

  /* ---------- colours and small drawing helpers ---------- */

  const ROW_HUES = [212, 152, 38, 336, 268, 12, 186];
  function tileColour(M, label) {
    const w = M.w, h = M.h;
    const row = M.d.rows ? label : Math.floor(label / w), col = M.d.rows ? (w - 1) / 2 : label % w;
    const hue = ROW_HUES[row % ROW_HUES.length];
    const light = 76 - (w > 1 ? col / (w - 1) : 0.5) * 14;
    return 'hsl(' + hue + ' 62% ' + light + '%)';
  }
  const BALL = { R: '#e5484d', B: '#3e7bfa', Y: '#f5c518', G: '#30a46c', W: '#f1efe8', O: '#f7a531', K: '#3a3a44', P: '#9b6cf5' };
  function ballColour(ch) {
    if (BALL[ch]) return BALL[ch];
    const i = ch.charCodeAt(0) - 97;
    return 'hsl(' + ((i * 47) % 360) + ' 62% 62%)';
  }
  const isNumbered = (M) => M.kind === 'rings' && /[a-z]/.test(M.goal);

  // an arc with an arrow head, around (cx, cy); dir +1 clockwise on screen
  function arcArrow(cx, cy, r, dir, a0, sweep) {
    const a1 = a0 + dir * sweep;
    const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const s = p(a0), e = p(a1);
    const large = sweep > Math.PI ? 1 : 0, sweepFlag = dir > 0 ? 1 : 0;
    const t = [-Math.sin(a1) * dir, Math.cos(a1) * dir]; // direction of travel at the end
    const nx = Math.cos(a1), ny = Math.sin(a1), hl = r * 0.42;
    const tip = [e[0] + t[0] * hl * 0.6, e[1] + t[1] * hl * 0.6];
    const b1 = [e[0] + nx * hl * 0.5 - t[0] * hl * 0.2, e[1] + ny * hl * 0.5 - t[1] * hl * 0.2];
    const b2 = [e[0] - nx * hl * 0.5 - t[0] * hl * 0.2, e[1] - ny * hl * 0.5 - t[1] * hl * 0.2];
    const f = (q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1);
    return { arc: 'M' + f(s) + 'A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 ' + large + ' ' + sweepFlag + ' ' + f(e), head: 'M' + f(tip) + 'L' + f(b1) + 'L' + f(b2) + 'Z' };
  }

  /* ---------- the board views ---------- */

  const CELL = 100;

  // Twiddle and turntables: tiles drawn place by place; a block turns as a group
  function gridView(ctx, M, api) {
    const wb = ctx.wb, W = M.w * CELL, H = M.h * CELL, k = M.k;
    const board = wb.layer('board'), top = wb.layer('top');
    const g = ctx.s('g', { class: 'tw-grid' }, board);
    const pad = 22;
    ctx.s('rect', { x: -pad, y: -pad, width: W + 2 * pad, height: H + 2 * pad, rx: 22, class: 'tw-tray' }, g);
    ctx.s('rect', { x: -4, y: -4, width: W + 8, height: H + 8, rx: 12, class: 'tw-well' }, g);
    const centre = (b) => [(M.blocks[b][0] + k / 2) * CELL, (M.blocks[b][1] + k / 2) * CELL];
    if (M.kind === 'turn') {
      M.blocks.forEach((bl, b) => {
        const c = centre(b);
        ctx.s('circle', { cx: c[0], cy: c[1], r: k * CELL * 0.71, class: 'tw-table' }, g);
        ctx.s('circle', { cx: c[0], cy: c[1], r: 7, class: 'tw-pin' }, g);
      });
    }
    const tiles = [];
    for (let j = 0; j < M.n; j++) {
      const tg = ctx.s('g', { class: 'tw-tile' }, g);
      const rect = ctx.s('rect', { x: -CELL / 2 + 5, y: -CELL / 2 + 5, width: CELL - 10, height: CELL - 10, rx: 14, class: 'tw-face', 'data-key': 'place' + j }, tg);
      const mark = M.orient ? ctx.s('path', { d: 'M-18 -35h36', class: 'tw-mark' }, tg) : null;
      const txt = ctx.s('text', { x: 0, y: 14, 'text-anchor': 'middle', class: 'tw-num' }, tg);
      tiles.push({ tg, rect, mark, txt, x: (j % M.w + 0.5) * CELL, y: (Math.floor(j / M.w) + 0.5) * CELL, rot: 0 });
    }
    const hl = ctx.s('g', { class: 'tw-hl' }, top);
    wb.setBounds({ x0: -pad - 10, y0: -pad - 10, x1: W + pad + 10, y1: H + pad + 10 }, 0.06);

    let cur = '';
    function draw(s) {
      cur = s;
      for (let j = 0; j < M.n; j++) {
        const c = s.charCodeAt(j) - CH0, label = M.orient ? c >> 2 : c, ori = M.orient ? c & 3 : 0;
        const t = tiles[j];
        t.rot = ori * 90;
        t.rect.setAttribute('fill', tileColour(M, label));
        t.txt.textContent = String(label + 1);
        const home = (M.d.rows ? Math.floor(j / M.w) === label : j === label) && ori === 0;
        t.tg.classList.toggle('home', home);
        place(t, 0, null);
      }
      wb.applyPaints();
    }
    function place(t, ang, c) {
      t.tg.setAttribute('transform', (ang && c ? 'rotate(' + ang.toFixed(2) + ' ' + c[0] + ' ' + c[1] + ') ' : '') + 'translate(' + t.x + ' ' + t.y + ') rotate(' + t.rot + ')');
    }
    const inBlock = (b) => {
      const [bx, by] = M.blocks[b], out = [];
      for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) out.push((bx + i) + (by + j) * M.w);
      return out;
    };
    function turnTo(b, ang) { const c = centre(b); inBlock(b).forEach((j) => place(tiles[j], ang, c)); }
    function nearest(pt) {
      let best = -1, bd = Infinity;
      M.blocks.forEach((bl, b) => {
        const c = centre(b), dd = Math.hypot(pt[0] - c[0], pt[1] - c[1]);
        if (dd < bd) { bd = dd; best = b; }
      });
      const reach = M.kind === 'turn' ? k * CELL * 0.78 : k * CELL * 0.9;
      if (pt[0] < -pad || pt[1] < -pad || pt[0] > W + pad || pt[1] > H + pad) return -1;
      return bd <= reach ? best : -1;
    }
    let hover = -1, cursor = -1, shift = false;
    function drawHl(b, dir, gold) {
      hl.innerHTML = '';
      if (b < 0) return;
      const c = centre(b), [bx, by] = M.blocks[b];
      if (M.kind === 'turn') ctx.s('circle', { cx: c[0], cy: c[1], r: k * CELL * 0.71 + 3, class: 'tw-ring' + (gold ? ' gold' : '') }, hl);
      else ctx.s('rect', { x: bx * CELL + 2, y: by * CELL + 2, width: k * CELL - 4, height: k * CELL - 4, rx: 16, class: 'tw-ring' + (gold ? ' gold' : '') }, hl);
      const r = Math.min(34, k * CELL * 0.22);
      const a = arcArrow(c[0], c[1], r, dir, -Math.PI / 2 - dir * 0.2, Math.PI * 1.35);
      const ag = ctx.s('g', { class: 'tw-arrow' + (gold ? ' gold' : '') }, hl);
      ctx.s('circle', { cx: c[0], cy: c[1], r: r + 14, class: 'tw-arrow-bg' }, ag);
      ctx.s('path', { d: a.arc, class: 'tw-arrow-arc' }, ag);
      ctx.s('path', { d: a.head, class: 'tw-arrow-head' }, ag);
    }
    const tapDir = () => (api.tapDir() * (shift ? -1 : 1));

    let drag = null;
    wb.handlers.board = {
      down(pt, ev) {
        if (api.busy()) return true;
        const b = nearest(pt);
        if (b < 0) return false;
        const c = centre(b);
        drag = { b, p0: pt, a0: Math.atan2(pt[1] - c[1], pt[0] - c[0]), acc: 0, last: null, live: false, right: ev.button === 2 || ev.shiftKey };
        return true;
      },
      move(pt) {
        if (!drag) return;
        const c = centre(drag.b);
        if (!drag.live) {
          if (Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) < 14 || Math.hypot(pt[0] - c[0], pt[1] - c[1]) < 10) return;
          drag.live = true; drag.last = drag.a0;
          hl.innerHTML = '';
        }
        const a = Math.atan2(pt[1] - c[1], pt[0] - c[0]);
        let da = a - drag.last;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        drag.acc += da; drag.last = a;
        drag.acc = Math.max(-Math.PI * 1.1, Math.min(Math.PI * 1.1, drag.acc));
        turnTo(drag.b, drag.acc * 180 / Math.PI);
      },
      up() {
        const dr = drag; drag = null;
        if (!dr) return;
        if (!dr.live) { api.turn(dr.b, dr.right ? -tapDir() : tapDir()); return; }
        const deg = dr.acc * 180 / Math.PI;
        let q = Math.round(deg / 90);
        if (q === 0 && Math.abs(deg) > 24) q = Math.sign(deg);
        q = Math.max(-2, Math.min(2, q));
        api.turn(dr.b, q, deg);
      },
      longpress(pt) {
        drag = null;
        const b = nearest(pt);
        if (b >= 0 && !api.busy()) api.turn(b, -tapDir());
      },
      hover(pt, ev) {
        shift = !!ev.shiftKey;
        const b = api.busy() ? -1 : nearest(pt);
        if (b !== hover || b >= 0) { hover = b; drawHl(b, tapDir(), false); }
      }
    };
    return {
      draw,
      // turn block b from `from` to `to` degrees (clockwise on screen), then done()
      spin(b, from, to, done) {
        hl.innerHTML = '';
        return C.tween(C.anim(Math.max(90, Math.abs(to - from) * 2.1)), (t) => turnTo(b, from + (to - from) * t), () => { if (!to) draw(cur); done(); });
      },
      play(gi, done) { const gn = M.gens[gi]; return this.spin(gn.block, 0, gn.dir * 90, done); },
      gen: (b, dir) => M.gens.findIndex((x) => x.block === b && x.dir === dir),
      describe(gi) {
        const gn = M.gens[gi], [bx, by] = M.blocks[gn.block];
        const c0 = cur.charCodeAt(bx + by * M.w) - CH0, lab = (M.orient ? c0 >> 2 : c0) + 1;
        const where = M.kind === 'turn' ? 'the turntable whose top-left tile is ' + lab : 'the ' + k + '×' + k + ' block whose top-left tile is ' + lab;
        return 'Turn ' + where + ' a quarter turn ' + (gn.dir > 0 ? 'clockwise' : 'anticlockwise') + '.';
      },
      show(gi) {
        const gn = M.gens[gi];
        drawHl(gn.block, gn.dir, true);
        setTimeout(() => { if (hover < 0) hl.innerHTML = ''; else drawHl(hover, tapDir(), false); }, 2600);
      },
      key(ev) {
        const kk = ev.key;
        const nb = M.blocks.length;
        if (cursor < 0 && /^Arrow/.test(kk)) { cursor = 0; drawHl(cursor, 1, false); return true; }
        const move = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[kk];
        if (move) {
          const c = centre(cursor);
          let best = cursor, bd = Infinity;
          M.blocks.forEach((bl, b) => {
            const q = centre(b), dx = q[0] - c[0], dy = q[1] - c[1];
            const along = dx * move[0] + dy * move[1], off = Math.abs(dx * move[1]) + Math.abs(dy * move[0]);
            if (along <= 0) return;
            const sc = along + off * 2;
            if (sc < bd) { bd = sc; best = b; }
          });
          cursor = best; drawHl(cursor, 1, false);
          return true;
        }
        if (cursor >= 0 && (kk === ' ' || kk === 'Enter' || kk === '.' || kk === ',')) {
          api.turn(cursor, kk === ',' || ev.shiftKey ? -1 : 1);
          later(() => drawHl(cursor, 1, false), C.anim(260));
          return true;
        }
        if (kk === 'Escape' && cursor >= 0) { cursor = -1; hl.innerHTML = ''; return true; }
        return nb ? false : false;
      },
      destroy() {}
    };
    function later(fn, ms) { setTimeout(fn, ms); }
  }

  // Loopover: rows and columns slide round; arrows at the edges; drag a tile to slide its line
  function loopView(ctx, M, api) {
    const wb = ctx.wb, W = M.w * CELL, H = M.h * CELL;
    const board = wb.layer('board'), top = wb.layer('top');
    const g = ctx.s('g', { class: 'tw-grid' }, board);
    const pad = 16, AR = 44;
    ctx.s('rect', { x: -pad, y: -pad, width: W + 2 * pad, height: H + 2 * pad, rx: 18, class: 'tw-tray' }, g);
    ctx.s('rect', { x: -4, y: -4, width: W + 8, height: H + 8, rx: 12, class: 'tw-well' }, g);
    const clipId = 'twclip-' + String(ctx.p.id).replace(/[^\w-]/g, '') + '-' + Math.floor(Math.random() * 1e6);
    const defs = ctx.s('defs', null, g);
    const cp = ctx.s('clipPath', { id: clipId }, defs);
    ctx.s('rect', { x: 0, y: 0, width: W, height: H }, cp);
    const tl = ctx.s('g', { 'clip-path': 'url(#' + clipId + ')' }, g);
    const tiles = [];
    function mkTile(parent) {
      const tg = ctx.s('g', { class: 'tw-tile' }, parent);
      const rect = ctx.s('rect', { x: -CELL / 2 + 5, y: -CELL / 2 + 5, width: CELL - 10, height: CELL - 10, rx: 14, class: 'tw-face' }, tg);
      const txt = ctx.s('text', { x: 0, y: 14, 'text-anchor': 'middle', class: 'tw-num' }, tg);
      return { tg, rect, txt };
    }
    for (let j = 0; j < M.n; j++) tiles.push(Object.assign(mkTile(tl), { x: (j % M.w + 0.5) * CELL, y: (Math.floor(j / M.w) + 0.5) * CELL }));
    // the arrows round the edge
    const arrows = ctx.s('g', { class: 'tw-arrows' }, g);
    const tri = (x, y, dx, dy) => {
      const px = -dy, py = dx;
      return 'M' + (x + dx * 13) + ' ' + (y + dy * 13) + 'L' + (x - dx * 9 + px * 13) + ' ' + (y - dy * 9 + py * 13) + 'L' + (x - dx * 9 - px * 13) + ' ' + (y - dy * 9 - py * 13) + 'Z';
    };
    const arrowEls = [];
    M.gens.forEach((gn, gi) => {
      const along = (gn.idx + 0.5) * CELL;
      let x, y, dx = 0, dy = 0;
      if (gn.line === 'r') { dx = gn.dir; y = along; x = gn.dir > 0 ? W + pad + AR / 2 : -pad - AR / 2; }
      else { dy = gn.dir; x = along; y = gn.dir > 0 ? H + pad + AR / 2 : -pad - AR / 2; }
      const ag = ctx.s('g', { class: 'tw-arr' }, arrows);
      ctx.s('circle', { cx: x, cy: y, r: 20, class: 'tw-arr-bg' }, ag);
      ctx.s('path', { d: tri(x, y, dx, dy), class: 'tw-arr-tri' }, ag);
      ag.addEventListener('pointerdown', (e) => { e.stopPropagation(); if (e.button === 0 && !api.busy()) api.slide(gi); });
      arrowEls[gi] = ag;
    });
    const hl = ctx.s('g', { class: 'tw-hl' }, top);
    wb.setBounds({ x0: -pad - AR - 6, y0: -pad - AR - 6, x1: W + pad + AR + 6, y1: H + pad + AR + 6 }, 0.05);

    let cur = '';
    function paint(t, label) {
      t.rect.setAttribute('fill', tileColour(M, label));
      t.txt.textContent = String(label + 1);
    }
    function draw(s) {
      cur = s;
      clearGhosts();
      for (let j = 0; j < M.n; j++) {
        const label = s.charCodeAt(j) - CH0, t = tiles[j];
        paint(t, label);
        t.tg.classList.toggle('home', j === label);
        t.tg.setAttribute('transform', 'translate(' + t.x + ' ' + t.y + ')');
      }
    }
    let ghosts = [];
    function clearGhosts() { ghosts.forEach((q) => q.tg.remove()); ghosts = []; }
    const lineCells = (line, idx) => {
      const out = [];
      if (line === 'r') for (let x = 0; x < M.w; x++) out.push(x + idx * M.w);
      else for (let y = 0; y < M.h; y++) out.push(idx + y * M.w);
      return out;
    };
    // show a line slid by `off` world units (wrapping round)
    function slideTo(line, idx, off) {
      const cells = lineCells(line, idx), L = line === 'r' ? W : H;
      if (!ghosts.length) cells.forEach((j) => { const gh = mkTile(tl); paint(gh, cur.charCodeAt(j) - CH0); gh.j = j; ghosts.push(gh); });
      cells.forEach((j, k) => {
        const t = tiles[j], base = (k + 0.5) * CELL;
        let pos = ((base + off) % L + L) % L;
        const other = pos > L / 2 ? pos - L : pos + L;
        if (line === 'r') { t.tg.setAttribute('transform', 'translate(' + pos + ' ' + t.y + ')'); ghosts[k].tg.setAttribute('transform', 'translate(' + other + ' ' + t.y + ')'); }
        else { t.tg.setAttribute('transform', 'translate(' + t.x + ' ' + pos + ')'); ghosts[k].tg.setAttribute('transform', 'translate(' + t.x + ' ' + other + ')'); }
      });
    }
    let drag = null, cursor = null;
    wb.handlers.board = {
      down(pt) {
        if (api.busy()) return true;
        if (pt[0] < 0 || pt[1] < 0 || pt[0] > W || pt[1] > H) return false;
        drag = { p0: pt, line: null, off: 0, col: Math.floor(pt[0] / CELL), row: Math.floor(pt[1] / CELL) };
        return true;
      },
      move(pt) {
        if (!drag) return;
        const dx = pt[0] - drag.p0[0], dy = pt[1] - drag.p0[1];
        if (!drag.line) {
          if (Math.hypot(dx, dy) < 12) return;
          drag.line = Math.abs(dx) >= Math.abs(dy) ? 'r' : 'c';
          drag.idx = drag.line === 'r' ? drag.row : drag.col;
        }
        drag.off = drag.line === 'r' ? dx : dy;
        slideTo(drag.line, drag.idx, drag.off);
      },
      up() {
        const dr = drag; drag = null;
        if (!dr || !dr.line) return;
        let q = Math.round(dr.off / CELL);
        if (q === 0 && Math.abs(dr.off) > CELL * 0.28) q = Math.sign(dr.off);
        const L = dr.line === 'r' ? M.w : M.h;
        q = Math.max(-(L - 1), Math.min(L - 1, q));
        api.slideBy(dr.line, dr.idx, q, dr.off);
      }
    };
    function drawCursor() {
      hl.innerHTML = '';
      if (!cursor) return;
      ctx.s('rect', { x: cursor[0] * CELL + 3, y: cursor[1] * CELL + 3, width: CELL - 6, height: CELL - 6, rx: 15, class: 'tw-ring' }, hl);
    }
    return {
      draw,
      // slide a line from `from` to `to` world units (right / down positive), then done()
      shift(line, idx, from, to, done) {
        return C.tween(C.anim(Math.max(90, Math.abs(to - from) * 1.9)), (t) => slideTo(line, idx, from + (to - from) * t), () => { if (!to) draw(cur); done(); });
      },
      play(gi, done) { const gn = M.gens[gi]; return this.shift(gn.line, gn.idx, 0, gn.dir * CELL, done); },
      gen: (line, idx, dir) => M.gens.findIndex((x) => x.line === line && x.idx === idx && x.dir === dir),
      describe(gi) {
        const gn = M.gens[gi];
        return gn.line === 'r' ? 'Slide row ' + (gn.idx + 1) + ' (from the top) one step to the ' + (gn.dir > 0 ? 'right' : 'left') + '.'
          : 'Slide column ' + (gn.idx + 1) + ' (from the left) one step ' + (gn.dir > 0 ? 'down' : 'up') + '.';
      },
      show(gi) {
        const el = arrowEls[gi];
        el.classList.add('hint');
        const gn = M.gens[gi];
        const box = gn.line === 'r' ? { x: 0, y: gn.idx * CELL, width: W, height: CELL } : { x: gn.idx * CELL, y: 0, width: CELL, height: H };
        const r = ctx.s('rect', Object.assign({ rx: 14, class: 'tw-ring gold' }, box), hl);
        setTimeout(() => { el.classList.remove('hint'); r.remove(); }, 2600);
      },
      key(ev) {
        const kk = ev.key;
        const mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[kk];
        if (!mv) { if (kk === 'Escape' && cursor) { cursor = null; drawCursor(); return true; } return false; }
        if (!cursor) { cursor = [0, 0]; drawCursor(); return true; }
        if (ev.shiftKey) {
          const gi = mv[0] ? M.gens.findIndex((x) => x.line === 'r' && x.idx === cursor[1] && x.dir === mv[0]) : M.gens.findIndex((x) => x.line === 'c' && x.idx === cursor[0] && x.dir === mv[1]);
          if (gi >= 0 && !api.busy()) { api.slide(gi); cursor = [(cursor[0] + mv[0] + M.w) % M.w, (cursor[1] + mv[1] + M.h) % M.h]; drawCursor(); }
          return true;
        }
        cursor = [(cursor[0] + mv[0] + M.w) % M.w, (cursor[1] + mv[1] + M.h) % M.h];
        drawCursor();
        return true;
      },
      destroy() {}
    };
  }
  // the geometry of the rings, shared by the board and the thumbnail
  function ringGeom(M, R) {
    const n = M.n, th = M.m * 2 * Math.PI / n, dx = R * Math.cos(th);
    const centres = [[-dx, 0], [dx, 0]], step = 2 * Math.PI / n;
    const chord = 2 * R * Math.sin(Math.PI / n);
    const br = Math.min(chord * 0.37, R * 0.17);
    const pos = [], member = [];
    [M.A, M.B].forEach((ring, ri) => ring.forEach((j, k) => {
      if (!pos[j]) pos[j] = [centres[ri][0] + R * Math.cos(k * step), centres[ri][1] + R * Math.sin(k * step)];
      (member[j] = member[j] || []).push([ri, k]);
    }));
    return { R, dx, centres, step, br, pos, member };
  }
  function ballSvg(x, y, r, ch, num) {
    const col = ballColour(ch);
    let s = '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + col + '" stroke="rgba(0,0,0,.35)" stroke-width="' + (r * 0.08).toFixed(2) + '"/>';
    s += '<ellipse cx="' + (x - r * 0.3).toFixed(1) + '" cy="' + (y - r * 0.35).toFixed(1) + '" rx="' + (r * 0.36).toFixed(1) + '" ry="' + (r * 0.22).toFixed(1) + '" fill="rgba(255,255,255,.5)"/>';
    if (num != null) s += '<text x="' + x.toFixed(1) + '" y="' + (y + r * 0.36).toFixed(1) + '" text-anchor="middle" font-size="' + (r * 0.95).toFixed(1) + '" font-weight="800" fill="#1b2140">' + num + '</text>';
    return s;
  }

  // Hungarian rings: drag a ball round its ring (at a crossing, the way you drag picks the ring)
  function ringView(ctx, M, api) {
    const wb = ctx.wb, R = 200, G = ringGeom(M, R), n = M.n, numbered = isNumbered(M);
    const board = wb.layer('board'), top = wb.layer('top');
    const g = ctx.s('g', { class: 'tw-rings' }, board);
    const tracks = G.centres.map((c) => ctx.s('circle', { cx: c[0], cy: c[1], r: R, class: 'tw-track' }, g));
    G.centres.forEach((c) => ctx.s('circle', { cx: c[0], cy: c[1], r: 9, class: 'tw-pin' }, g));
    const balls = [];
    for (let j = 0; j < M.total; j++) {
      const bg = ctx.s('g', { class: 'tw-ball' }, g);
      const c = ctx.s('circle', { cx: 0, cy: 0, r: G.br, class: 'tw-ball-c', 'data-key': 'ball' + j }, bg);
      ctx.s('ellipse', { cx: -G.br * 0.3, cy: -G.br * 0.35, rx: G.br * 0.36, ry: G.br * 0.22, class: 'tw-ball-shine' }, bg);
      const txt = numbered ? ctx.s('text', { x: 0, y: G.br * 0.36, 'text-anchor': 'middle', class: 'tw-ball-num', style: 'font-size:' + (G.br * 0.95).toFixed(1) + 'px' }, bg) : null;
      balls.push({ bg, c, txt });
    }
    // turn buttons outside each ring
    const btns = [];
    G.centres.forEach((c, ri) => {
      const x = c[0] + (ri ? 1 : -1) * (R + G.br + 44);
      [-1, 1].forEach((dir) => {
        const y = dir * 46;
        const bg = ctx.s('g', { class: 'tw-rbtn' }, g);
        ctx.s('circle', { cx: x, cy: y, r: 30 }, bg);
        const a = arcArrow(x, y, 14, dir, dir > 0 ? Math.PI : 0, Math.PI * 1.25);
        ctx.s('path', { d: a.arc, class: 'tw-rbtn-arc' }, bg);
        ctx.s('path', { d: a.head, class: 'tw-rbtn-head' }, bg);
        bg.addEventListener('pointerdown', (e) => { e.stopPropagation(); if (e.button === 0 && !api.busy()) api.ringTurn(ri, dir, 0); });
        btns.push(bg);
      });
    });
    // the goal, small, under the rings
    const mini = ctx.s('g', { class: 'tw-mini' }, g);
    const sc = 0.27, gy = R + G.br + R * sc + 40;
    ctx.s('text', { x: 0, y: gy - (R * sc + 18), 'text-anchor': 'middle', class: 'tw-mini-cap', text: 'goal' }, mini);
    let ms = '';
    G.centres.forEach((c) => { ms += '<circle cx="' + (c[0] * sc) + '" cy="' + (gy + c[1] * sc) + '" r="' + (R * sc) + '" fill="none" stroke="var(--line)" stroke-width="3"/>'; });
    for (let j = 0; j < M.total; j++) ms += ballSvg(G.pos[j][0] * sc, gy + G.pos[j][1] * sc, G.br * sc * 1.25, M.goal[j], null);
    const mg = ctx.s('g', null, mini);
    mg.innerHTML = ms;
    const hl = ctx.s('g', { class: 'tw-hl' }, top);
    const xw = G.dx + R + G.br + 80;
    wb.setBounds({ x0: -xw, y0: -R - G.br - 16, x1: xw, y1: gy + R * sc + 10 }, 0.05);

    let cur = '';
    function draw(s) {
      cur = s;
      for (let j = 0; j < M.total; j++) {
        const b = balls[j];
        b.c.setAttribute('fill', ballColour(s[j]));
        if (b.txt) b.txt.textContent = String(s.charCodeAt(j) - 96);
        b.bg.setAttribute('transform', 'translate(' + G.pos[j][0].toFixed(2) + ' ' + G.pos[j][1].toFixed(2) + ')');
        b.bg.classList.toggle('home', s[j] === M.goal[j]);
      }
      wb.applyPaints();
    }
    function turnRing(ri, ang) {
      const ring = ri ? M.B : M.A, c = G.centres[ri];
      ring.forEach((j, k) => {
        const a = k * G.step + ang;
        balls[j].bg.setAttribute('transform', 'translate(' + (c[0] + R * Math.cos(a)).toFixed(2) + ' ' + (c[1] + R * Math.sin(a)).toFixed(2) + ')');
      });
    }
    function ballAt(pt) {
      let best = -1, bd = G.br * 1.25;
      for (let j = 0; j < M.total; j++) { const dd = Math.hypot(pt[0] - G.pos[j][0], pt[1] - G.pos[j][1]); if (dd < bd) { bd = dd; best = j; } }
      return best;
    }
    let drag = null, sel = -1;
    function drawSel() {
      tracks.forEach((t, ri) => t.classList.toggle('sel', ri === sel));
    }
    wb.handlers.board = {
      down(pt) {
        if (api.busy()) return true;
        const j = ballAt(pt);
        let cand;
        if (j >= 0) cand = G.member[j].map((x) => x[0]);
        else {
          cand = [0, 1].filter((ri) => Math.abs(Math.hypot(pt[0] - G.centres[ri][0], pt[1] - G.centres[ri][1]) - R) < G.br);
          if (cand.length !== 1) return false;
        }
        drag = { j, cand, p0: pt, ring: cand.length === 1 ? cand[0] : -1, acc: 0, last: 0 };
        if (drag.ring >= 0) { const c = G.centres[drag.ring]; drag.last = Math.atan2(pt[1] - c[1], pt[0] - c[0]); }
        return true;
      },
      move(pt) {
        if (!drag) return;
        const mx = pt[0] - drag.p0[0], my = pt[1] - drag.p0[1];
        if (drag.ring < 0) {
          if (Math.hypot(mx, my) < 10) return;
          let best = -1, bs = -1;
          drag.cand.forEach((ri) => {
            const c = G.centres[ri], p = G.pos[drag.j], tx = -(p[1] - c[1]), ty = p[0] - c[0];
            const sc = Math.abs(mx * tx + my * ty) / Math.hypot(tx, ty);
            if (sc > bs) { bs = sc; best = ri; }
          });
          drag.ring = best;
          const c = G.centres[best];
          drag.last = Math.atan2(drag.p0[1] - c[1], drag.p0[0] - c[0]);
        }
        const c = G.centres[drag.ring], a = Math.atan2(pt[1] - c[1], pt[0] - c[0]);
        let da = a - drag.last;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        drag.acc += da; drag.last = a;
        if (Math.abs(drag.acc) > 0.02 || drag.moved) { drag.moved = true; turnRing(drag.ring, drag.acc); }
      },
      up() {
        const dr = drag; drag = null;
        if (!dr || dr.ring < 0 || !dr.moved) return;
        let q = Math.round(dr.acc / G.step);
        if (q === 0 && Math.abs(dr.acc) > G.step * 0.3) q = Math.sign(dr.acc);
        api.ringTurn(dr.ring, q, dr.acc);
      }
    };
    return {
      draw,
      rot(ri, from, to, done) {
        return C.tween(C.anim(Math.max(110, Math.min(520, Math.abs(to - from) * 260))), (t) => turnRing(ri, from + (to - from) * t), () => { if (!to) draw(cur); done(); });
      },
      play(gi, done) { const gn = M.gens[gi]; return this.rot(gn.ring, 0, gn.steps * G.step, done); },
      step: G.step,
      describe(gi) {
        const gn = M.gens[gi], k = Math.abs(gn.steps);
        return 'Turn the ' + (gn.ring ? 'right' : 'left') + ' ring ' + C.plural(k, 'place') + ' ' + (gn.steps > 0 ? 'clockwise' : 'anticlockwise') + '.';
      },
      show(gi) {
        const gn = M.gens[gi], c = G.centres[gn.ring];
        hl.innerHTML = '';
        ctx.s('circle', { cx: c[0], cy: c[1], r: R, class: 'tw-ring gold wide' }, hl);
        const a = arcArrow(c[0], c[1], R * 0.55, Math.sign(gn.steps), gn.ring ? 0 : Math.PI, Math.min(Math.PI * 1.6, Math.abs(gn.steps) * G.step));
        const ag = ctx.s('g', { class: 'tw-arrow gold' }, hl);
        ctx.s('path', { d: a.arc, class: 'tw-arrow-arc' }, ag);
        ctx.s('path', { d: a.head, class: 'tw-arrow-head' }, ag);
        setTimeout(() => { hl.innerHTML = ''; }, 2800);
      },
      key(ev) {
        const kk = ev.key;
        if (kk === 'ArrowUp' || kk === 'ArrowDown') { sel = sel < 0 ? 0 : 1 - sel; drawSel(); return true; }
        if (kk === 'ArrowLeft' || kk === 'ArrowRight') {
          if (sel < 0) { sel = 0; drawSel(); }
          if (!api.busy()) api.ringTurn(sel, kk === 'ArrowRight' ? 1 : -1, 0);
          return true;
        }
        if (kk === 'Escape' && sel >= 0) { sel = -1; drawSel(); return true; }
        return false;
      },
      destroy() {}
    };
  }

  /* ---------- playing ---------- */

  function goalText(M) {
    if (M.kind === 'rings') return 'Turn the rings until every ball matches the goal picture under them.';
    if (M.kind === 'loop') return 'Put the tiles in order: 1, 2, 3 … row by row.';
    if (M.d.rows) return 'Every row holds only its own number: 1s on top, then 2s, then 3s.';
    return 'Put the tiles in order: 1, 2, 3 … row by row' + (M.orient ? ', every tile upright (its bar at the top)' : '') + '.';
  }

  function mount(ctx, p) {
    const d = p.data, M = model(d), wb = ctx.wb;
    const start = startOf(M, d);
    let s = start, hist = [], busy = null, solving = false, runId = 0;
    const sol0 = parseSol(M, d.sol);
    let tapDir = C.store.get('twiddle-tapdir', 1);
    const timers = [];
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    ctx.setGoal(goalText(M));
    wb.host.classList.add('tw-stage');

    function record(gi) {
      if (M.kind !== 'rings' || !hist.length) { hist.push(gi); return; }
      const last = M.gens[hist[hist.length - 1]], gn = M.gens[gi];
      if (last.ring !== gn.ring) { hist.push(gi); return; }
      hist.pop();
      let st = ((last.steps + gn.steps) % M.n + M.n) % M.n;
      if (!st) return;
      if (st > M.n / 2) st -= M.n;
      hist.push(M.gens.findIndex((x) => x.ring === gn.ring && x.steps === st));
    }
    function commit(list, how) {
      list.forEach((gi) => { s = apply(M, s, gi); record(gi); });
      ctx.move(hist.length);
      V.draw(s);
      if (how === 'solve') return;
      ctx.sfx(M.kind === 'rings' ? 'snap' : 'tap');
      ctx.changed('move');
    }
    const api = {
      busy: () => !!busy || solving,
      tapDir: () => tapDir,
      // grid: turn block b by q quarter turns (drag release starts at fromDeg)
      turn(b, q, fromDeg) {
        if (busy) return;
        if (!q) { busy = V.spin(b, fromDeg || 0, 0, () => { busy = null; }); return; }
        const gi = V.gen(b, Math.sign(q)), list = Math.abs(q) === 2 ? [gi, gi] : [gi];
        busy = V.spin(b, fromDeg || 0, q * 90, () => { busy = null; commit(list, 'user'); });
      },
      slide(gi) {
        if (busy) return;
        busy = V.play(gi, () => { busy = null; commit([gi], 'user'); });
      },
      slideBy(line, idx, q, fromOff) {
        if (busy) return;
        if (!q) { busy = V.shift(line, idx, fromOff, 0, () => { busy = null; }); return; }
        const gi = V.gen(line, idx, Math.sign(q)), list = new Array(Math.abs(q)).fill(gi);
        busy = V.shift(line, idx, fromOff, q * CELL, () => { busy = null; commit(list, 'user'); });
      },
      ringTurn(ri, q, fromAng) {
        if (busy) return;
        let st = ((q % M.n) + M.n) % M.n;
        if (!st) { busy = V.rot(ri, fromAng, 0, () => { busy = null; }); return; }
        if (st > M.n / 2) st -= M.n;
        const gi = M.gens.findIndex((x) => x.ring === ri && x.steps === st);
        busy = V.rot(ri, fromAng, q * V.step, () => { busy = null; commit([gi], 'user'); });
      }
    };
    const V = M.kind === 'rings' ? ringView(ctx, M, api) : M.kind === 'loop' ? loopView(ctx, M, api) : gridView(ctx, M, api);
    V.draw(s);

    if (M.kind === 'twiddle' || M.kind === 'turn') {
      const tb = ctx.button(tapDir > 0 ? 'A tap turns ↻ clockwise' : 'A tap turns ↺ anticlockwise', () => {
        tapDir = -tapDir; C.store.set('twiddle-tapdir', tapDir);
        tb.textContent = tapDir > 0 ? 'A tap turns ↻ clockwise' : 'A tap turns ↺ anticlockwise';
      }, 'small ghost');
    }

    // the shortest way from here if the search is quick; else back along the way we know
    function simplifyPath(list) {
      const out = [];
      list.forEach((gi) => {
        if (out.length && M.gens[out[out.length - 1]].inv === gi) { out.pop(); return; }
        if (M.kind === 'rings' && out.length && M.gens[out[out.length - 1]].ring === M.gens[gi].ring) {
          const last = M.gens[out.pop()];
          let st = ((last.steps + M.gens[gi].steps) % M.n + M.n) % M.n;
          if (!st) return;
          if (st > M.n / 2) st -= M.n;
          out.push(M.gens.findIndex((x) => x.ring === last.ring && x.steps === st));
          return;
        }
        out.push(gi);
      });
      return out;
    }
    function plan(limit) {
      const r = solve(M, s, M.goal, limit);
      if (!r.fail) return { path: r.path, optimal: true };
      const back = hist.slice().reverse().map((gi) => M.gens[gi].inv).concat(sol0);
      return { path: simplifyPath(back), optimal: false, undo: hist.length > 0 };
    }
    function flush() {
      if (busy) { busy(); busy = null; V.draw(s); }
    }

    return {
      check() {
        if (s === M.goal) return { solved: true, msg: M.kind === 'rings' ? 'Every ball is home!' : 'In order!' };
        let home = 0, total = 0;
        if (M.kind === 'rings') { for (let j = 0; j < M.total; j++) { total++; if (s[j] === M.goal[j]) home++; } }
        else for (let j = 0; j < M.n; j++) { total++; if (s[j] === M.goal[j]) home++; }
        return { solved: false, msg: home + ' of ' + total + ' are home.' };
      },
      hint() {
        if (solving) return null;
        flush();
        const pl = plan(M.kind === 'loop' && M.w >= 5 ? 250000 : 160000);
        if (!pl.path.length) return 'It is already solved — look again!';
        const gi = pl.path[0];
        let text = V.describe(gi);
        if (pl.optimal) text += ' From here it takes ' + C.plural(pl.path.length, M.kind === 'rings' ? 'turn' : 'move') + '.';
        else if (pl.undo) text = 'You have wandered a long way from the goal; this takes back your last move. ' + text;
        return { text, show() { V.show(gi); } };
      },
      solve() {
        flush();
        const pl = plan(600000);
        solving = true;
        const id = runId;
        let k = 0;
        const step = () => {
          if (id !== runId) return;
          if (k >= pl.path.length) { solving = false; ctx.changed('solve'); return; }
          const gi = pl.path[k++];
          busy = V.play(gi, () => { busy = null; commit([gi], 'solve'); later(step, C.anim(90)); });
        };
        step();
      },
      explain() {
        const toks = sol0.map((gi) => V.describe(gi).replace(/\.$/, ''));
        if (!toks.length) return '';
        return 'One shortest way (' + C.plural(toks.length, M.kind === 'rings' ? 'turn' : 'move') + '): ' + toks.map((t, i) => (i + 1) + '. ' + t.replace(/^\w/, (c) => c.toLowerCase())).join('; ') + '.';
      },
      getState() { return { s, h: hist.slice() }; },
      setState(st) {
        if (!st || st.s == null) return;
        runId++;
        if (busy) { busy(); busy = null; }
        solving = false;
        s = st.s; hist = (st.h || []).slice();
        V.draw(s);
      },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (solving) return false;
        return V.key(ev) === true;
      },
      destroy() {
        runId++;
        if (busy) { busy(); busy = null; }
        timers.forEach((t) => clearTimeout(t));
        V.destroy();
        wb.host.classList.remove('tw-stage');
      }
    };
  }

  /* ---------- pictures for the drawer ---------- */

  function thumb(p) {
    const d = p.data;
    let M;
    try { M = model(d); } catch (e) { return ''; }
    const s = startOf(M, d);
    if (M.kind === 'rings') {
      const G = ringGeom(M, 100), xw = G.dx + 100 + G.br + 4;
      let out = '<svg viewBox="' + (-xw) + ' ' + (-100 - G.br - 4) + ' ' + (2 * xw) + ' ' + (200 + 2 * G.br + 8) + '">';
      G.centres.forEach((c) => { out += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="100" fill="none" stroke="var(--line)" stroke-width="' + (G.br * 0.9).toFixed(1) + '"/>'; });
      for (let j = 0; j < M.total; j++) out += ballSvg(G.pos[j][0], G.pos[j][1], G.br, s[j], isNumbered(M) ? s.charCodeAt(j) - 96 : null);
      return out + '</svg>';
    }
    const W = M.w * CELL, H = M.h * CELL, pad = M.kind === 'loop' ? 40 : 20;
    let out = '<svg viewBox="' + (-pad) + ' ' + (-pad) + ' ' + (W + 2 * pad) + ' ' + (H + 2 * pad) + '">';
    out += '<rect x="' + (-pad + 6) + '" y="' + (-pad + 6) + '" width="' + (W + 2 * pad - 12) + '" height="' + (H + 2 * pad - 12) + '" rx="18" fill="var(--wood-dark)" opacity=".55"/>';
    if (M.kind === 'turn') M.blocks.forEach(([bx, by]) => { out += '<circle cx="' + ((bx + M.k / 2) * CELL) + '" cy="' + ((by + M.k / 2) * CELL) + '" r="' + (M.k * CELL * 0.71) + '" fill="rgba(255,255,255,.1)" stroke="var(--line)" stroke-width="5"/>'; });
    for (let j = 0; j < M.n; j++) {
      const c = s.charCodeAt(j) - CH0, label = M.orient ? c >> 2 : c, ori = M.orient ? c & 3 : 0;
      const x = (j % M.w + 0.5) * CELL, y = (Math.floor(j / M.w) + 0.5) * CELL;
      out += '<g transform="translate(' + x + ' ' + y + ') rotate(' + ori * 90 + ')"><rect x="-44" y="-44" width="88" height="88" rx="14" fill="' + tileColour(M, label) + '"/>' +
        (M.orient ? '<path d="M-18 -35h36" stroke="#1b2140" stroke-width="7" stroke-linecap="round"/>' : '') +
        '<text y="17" text-anchor="middle" font-size="48" font-weight="800" fill="#1b2140">' + (label + 1) + '</text></g>';
    }
    if (M.kind === 'loop') {
      for (let r = 0; r < M.h; r++) out += '<path d="M' + (W + 12) + ' ' + ((r + 0.5) * CELL - 12) + 'l18 12l-18 12z" fill="var(--muted)"/><path d="M-12 ' + ((r + 0.5) * CELL - 12) + 'l-18 12l18 12z" fill="var(--muted)"/>';
    }
    return out + '</svg>';
  }

  C.engine({
    id: 'twiddle',
    name: 'Twiddle and friends',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    workbench: { ctxBar: false, selectFrame: false },
    stateVersion: 1,
    about(p) {
      const k = p && p.data && p.data.kind;
      if (k === 'loop') return '**Drag a tile** sideways or up and down: its whole row or column slides with it, and whatever leaves one edge comes back at the other. Or **click the arrows** round the edge. Each one-step slide counts as a move.\n\nKeys: the arrow keys move a cursor; **Shift + arrow** slides its row or column.';
      if (k === 'rings') return '**Drag a ball** round its ring: the whole ring turns with it and settles on the nearest place. At a crossing, the way you drag chooses the ring. Or click the **round arrows** beside each ring. A turn of a ring by any number of places counts as one move.\n\nKeys: ↑ ↓ choose a ring, ← → turn it.';
      return '**Click a block** of tiles to turn it a quarter turn clockwise; **right-click** (or Shift-click, or a long press on a touch screen) turns it anticlockwise. The block that will turn is outlined as you point. You can also **drag round** a block to turn it either way — it follows your pointer and settles on the nearest quarter turn. A panel button swaps what a plain tap does.\n\nKeys: the arrow keys choose a block; Space or . turns it clockwise, Shift+Space or , anticlockwise.';
    },
    verify,
    generate,
    mount,
    thumb
  });

  C.twiddle = { model, apply, solve, parseSol, startOf, scramble, ringGoal, titleFor, textFor, verify, KINDS };

  C.css('twiddle', `
    .tw-tray { fill: var(--wood-dark); opacity: .5; }
    .tw-well { fill: rgba(0,0,0,.18); }
    .tw-table { fill: rgba(255,255,255,.07); stroke: var(--line); stroke-width: 5; }
    .tw-pin { fill: var(--metal); opacity: .7; }
    .tw-face { stroke: rgba(0,0,0,.35); stroke-width: 2.5; }
    .tw-tile.home .tw-face { stroke: rgba(255,255,255,.75); stroke-width: 3.5; }
    .tw-num { font: 800 42px "Segoe UI", system-ui, sans-serif; fill: #1b2140; pointer-events: none; }
    .tw-mark { stroke: #1b2140; stroke-width: 7; stroke-linecap: round; }
    .tw-ring { fill: none; stroke: var(--accent); stroke-width: 5; stroke-dasharray: 10 7; pointer-events: none; }
    .tw-ring.gold { stroke: var(--gold); stroke-dasharray: none; stroke-width: 7; filter: drop-shadow(0 0 6px var(--gold)); }
    .tw-ring.wide { stroke-width: 14; opacity: .7; }
    .tw-arrow { pointer-events: none; }
    .tw-arrow-bg { fill: rgba(12,14,30,.45); }
    .tw-arrow-arc { fill: none; stroke: #fff; stroke-width: 6; stroke-linecap: round; }
    .tw-arrow-head { fill: #fff; }
    .tw-arrow.gold .tw-arrow-arc { stroke: var(--gold); stroke-width: 9; }
    .tw-arrow.gold .tw-arrow-head { fill: var(--gold); }
    .tw-arr { cursor: pointer; }
    .tw-arr-bg { fill: var(--panel-2); stroke: var(--line); stroke-width: 2; }
    .tw-arr:hover .tw-arr-bg { stroke: var(--accent); }
    .tw-arr-tri { fill: var(--muted); }
    .tw-arr:hover .tw-arr-tri { fill: var(--accent); }
    .tw-arr.hint .tw-arr-bg { stroke: var(--gold); stroke-width: 5; }
    .tw-arr.hint .tw-arr-tri { fill: var(--gold); }
    .tw-track { fill: none; stroke: var(--wood-dark); stroke-width: 52; opacity: .5; }
    .tw-track.sel { stroke: var(--accent); opacity: .35; }
    .tw-ball-c { stroke: rgba(0,0,0,.35); stroke-width: 2.5; }
    .tw-ball.home .tw-ball-c { stroke: rgba(255,255,255,.7); }
    .tw-ball-shine { fill: rgba(255,255,255,.45); pointer-events: none; }
    .tw-ball-num { font-weight: 800; fill: #1b2140; pointer-events: none; font-family: "Segoe UI", system-ui, sans-serif; }
    .tw-rbtn { cursor: pointer; }
    .tw-rbtn circle { fill: var(--panel-2); stroke: var(--line); stroke-width: 2; }
    .tw-rbtn:hover circle { stroke: var(--accent); }
    .tw-rbtn-arc { fill: none; stroke: var(--muted); stroke-width: 4.5; stroke-linecap: round; }
    .tw-rbtn-head { fill: var(--muted); }
    .tw-rbtn:hover .tw-rbtn-arc { stroke: var(--accent); }
    .tw-rbtn:hover .tw-rbtn-head { fill: var(--accent); }
    .tw-mini-cap { font: 700 15px "Segoe UI", system-ui, sans-serif; fill: var(--muted); letter-spacing: .08em; text-transform: uppercase; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);

