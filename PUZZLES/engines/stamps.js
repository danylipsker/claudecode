/* The Puzzle Cabinet · engines/stamps.js
 *
 * Folding stamps: a strip (or a small sheet) of numbered stamps is folded
 * along its perforations until every stamp lies in one pile, which must read
 * a given order from top to bottom.
 *
 * A fold is always made through the whole packet (every layer at that
 * perforation turns over together), over the top or underneath. That is the
 * natural way to fold a strip: with such folds every pile a strip of up to six
 * stamps can make is reachable (1, 2, 6, 16, 50, 144 of them — the numbers
 * Lucas asked about); a few longer foldings need a flap tucked between
 * layers, which this cabinet does not do.
 *
 * State: the packet as a grid of w × h cells, each a stack (bottom → top) of
 * stamp codes n·4 + fx·2 + fy (fx / fy: mirrored left-right / top-bottom;
 * face up when fx = fy), plus where the packet lies on the table.
 *
 * data: {
 *   rows: 1, cols: 5,          the sheet (a strip when rows = 1); stamps numbered in reading order
 *   target: [1, 3, 2, 5, 4]    the pile from top to bottom (turned over counts too)
 * }
 * p.par = the fewest folds (breadth-first search).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the rules (node and browser) ---------- */

  function start(R, K) {
    const cells = [];
    for (let y = 0; y < R; y++) for (let x = 0; x < K; x++) cells.push([(y * K + x + 1) * 4]);
    return { w: K, h: R, cells, ox: 0, oy: 0 };
  }
  // fold along the perforation `at` (between columns at-1 and at, or rows);
  // side -1: the left (top) part turns over, +1: the right (bottom) part; under: it goes underneath
  function fold(st, axis, at, side, under) {
    const W = st.w, H = st.h, v = axis === 'v';
    const N = v ? W : H;
    if (!(at >= 1 && at <= N - 1)) return null;
    const newN = Math.max(at, N - at);
    const firstMoves = side < 0;
    const off = firstMoves ? at : at - newN;
    const nw = v ? newN : W, nh = v ? H : newN;
    const stay = new Array(nw * nh).fill(null), moved = new Array(nw * nh).fill(null);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const s = st.cells[y * W + x];
      const c = v ? x : y;
      const moves = firstMoves ? c < at : c >= at;
      const nc = moves ? 2 * at - 1 - c - off : c - off;
      const idx = v ? y * nw + nc : nc * nw + x;
      if (moves) moved[idx] = s.slice().reverse().map((q) => q ^ (v ? 2 : 1));
      else stay[idx] = s.slice();
    }
    const cells = stay.map((c, i) => { const m = moved[i]; if (!c) return m || []; if (!m) return c; return under ? m.concat(c) : c.concat(m); });
    return { w: nw, h: nh, cells, ox: (st.ox || 0) + (v ? off : 0), oy: (st.oy || 0) + (v ? 0 : off) };
  }
  // the whole packet turned over, left to right
  function turnOver(st) {
    const W = st.w, H = st.h, cells = new Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) cells[y * W + (W - 1 - x)] = st.cells[y * W + x].slice().reverse().map((q) => q ^ 2);
    return { w: W, h: H, cells, ox: st.ox, oy: st.oy };
  }
  const key = (s) => s.w + 'x' + s.h + ':' + s.cells.map((c) => c.join('.')).join('|');
  function movesOf(s) {
    const out = [];
    for (let at = 1; at < s.w; at++) for (const side of [-1, 1]) for (const under of [0, 1]) out.push(['v', at, side, under]);
    for (let at = 1; at < s.h; at++) for (const side of [-1, 1]) for (const under of [0, 1]) out.push(['h', at, side, under]);
    return out;
  }
  const pileOf = (s) => (s.w === 1 && s.h === 1 ? s.cells[0].slice().reverse().map((q) => q >> 2) : null);
  function isGoal(s, target) {
    const p = pileOf(s);
    if (!p || p.length !== target.length) return false;
    const a = p.join(','), t = target.join(','), r = target.slice().reverse().join(',');
    return a === t || a === r;
  }
  // breadth-first: the fewest folds from s to the pile (either way up); null if it cannot be made
  function solve(s, target, cap) {
    cap = cap || 400000;
    const k0 = key(s);
    if (isGoal(s, target)) return [];
    const prev = new Map([[k0, null]]);
    let fr = [s];
    while (fr.length) {
      const nx = [];
      for (const a of fr) {
        if (a.w === 1 && a.h === 1) continue;
        for (const m of movesOf(a)) {
          const b = fold(a, m[0], m[1], m[2], m[3]);
          const k = key(b);
          if (prev.has(k)) continue;
          prev.set(k, { from: a, m });
          if (isGoal(b, target)) {
            const path = [];
            let cur = b;
            for (;;) { const e = prev.get(key(cur)); if (!e) break; path.unshift(e.m); cur = e.from; }
            return path;
          }
          nx.push(b);
        }
      }
      fr = nx;
      if (prev.size > cap) return undefined;
    }
    return null;
  }
  // every pile a sheet can make, with the fewest folds for each: Map 'a b c' -> folds
  function allPiles(R, K) {
    const s0 = start(R, K);
    const seen = new Set([key(s0)]);
    const piles = new Map();
    let fr = [s0], depth = 0;
    while (fr.length) {
      const nx = [];
      depth++;
      for (const a of fr) {
        for (const m of movesOf(a)) {
          const b = fold(a, m[0], m[1], m[2], m[3]);
          const k = key(b);
          if (seen.has(k)) continue;
          seen.add(k);
          const p = pileOf(b);
          if (p) { const pk = p.join(' '); if (!piles.has(pk)) piles.set(pk, depth); } else nx.push(b);
        }
      }
      fr = nx;
    }
    return piles;
  }

  function describeMove(s, m) {
    const v = m[0] === 'v', N = v ? s.w : s.h, at = m[1];
    const count = m[2] < 0 ? at : N - at;
    const part = v ? (m[2] < 0 ? 'left' : 'right') : (m[2] < 0 ? 'top' : 'bottom');
    const what = s.h === 1 || s.w === 1
      ? (count === 1 ? 'the ' + part + ' end' : 'the ' + part + ' ' + count + ' stamp-widths')
      : (count === 1 ? 'the ' + part + (v ? ' column' : ' row') : 'the ' + part + ' ' + count + (v ? ' columns' : ' rows'));
    return 'fold ' + what + (m[3] ? ' underneath' : ' over the top');
  }

  function numbersWord(n) { return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][n] || String(n); }
  function sheetWord(d) { return d.rows === 1 ? 'strip of ' + numbersWord(d.cols) + ' stamps' : d.rows + ' × ' + d.cols + ' sheet of stamps'; }

  // difficulty from the size and the fewest folds
  function grade(R, K, par) {
    const n = R * K;
    let g = n <= 3 ? 1 : n === 4 ? (R === 1 ? (par <= 2 ? 1 : 2) : 2) : n === 5 ? 2 : n === 6 ? (R === 1 ? 3 : 3) : n === 7 ? 4 : n === 8 ? (R === 1 ? 5 : 4) : 5;
    if (n >= 5 && par <= Math.ceil(Math.log2(n)) && g > 1) g -= 1;
    return Math.max(1, Math.min(5, g));
  }
  const SIZES = [null, [[1, 3], [1, 4]], [[1, 4], [1, 5], [2, 2]], [[1, 6], [2, 3], [1, 5]], [[1, 7], [2, 4], [1, 6]], [[1, 8], [3, 3], [1, 7]]];

  function makeTitle(target, R, K) { return (R > 1 ? R + '×' + K + ' Sheet: ' : 'Pile ') + target.join('·'); }

  function generateOne(rng, level) {
    for (let tries = 0; tries < 60; tries++) {
      const sz = rng.pick(SIZES[level]);
      const R = sz[0], K = sz[1];
      // fold at random until everything lies in one pile
      let s = start(R, K), guard = 0;
      while (!(s.w === 1 && s.h === 1) && guard++ < 40) { const ms = movesOf(s); const m = rng.pick(ms); s = fold(s, m[0], m[1], m[2], m[3]); }
      const target = pileOf(s);
      if (!target) continue;
      if (rng() < 0.5) target.reverse();
      const path = solve(start(R, K), target);
      if (!path) continue;
      if (grade(R, K, path.length) !== level) continue;
      const d = { rows: R, cols: K, target };
      return {
        title: makeTitle(target, R, K), diff: level, par: path.length,
        text: 'Fold the ' + sheetWord(d) + ' along the perforations until they all lie in one pile that reads, from the top down: **' + target.join(' ') + '**. (A pile that reads the other way is fine too: just turn it over.)',
        data: d
      };
    }
    return null;
  }

  /* ---------- drawing (browser) ---------- */

  const INK = ['#b5473a', '#2e6fa8', '#3f8a55', '#8a4fa3', '#c07a2c', '#2a8f8f', '#8c5a3c', '#b04a78', '#5a6aa8', '#6d8a2e', '#a83e5a', '#3b7f9e'];
  const PAPER = '#f4ecd6', BACKP = '#e7dcc0';
  const f3 = (v) => Math.round(v * 1000) / 1000;
  function stampSVG(code, x, y, sz, opts) {
    opts = opts || {};
    const n = code >> 2, fx = (code >> 1) & 1, fy = code & 1;
    const up = fx === fy;
    const col = INK[(n - 1) % INK.length];
    const cx = x + sz / 2, cy = y + sz / 2, m = 0.05 * sz;
    let s = '<g class="st-stamp' + (up ? '' : ' down') + (opts.cls ? ' ' + opts.cls : '') + '">';
    s += '<rect class="st-paper" x="' + f3(x + m) + '" y="' + f3(y + m) + '" width="' + f3(sz - 2 * m) + '" height="' + f3(sz - 2 * m) + '" fill="' + (up ? PAPER : BACKP) + '"/>';
    s += '<rect class="st-perf" x="' + f3(x + m) + '" y="' + f3(y + m) + '" width="' + f3(sz - 2 * m) + '" height="' + f3(sz - 2 * m) + '" stroke-width="' + f3(sz * 0.05) + '" stroke-dasharray="0 ' + f3(sz * 0.1) + '"/>';
    if (up) {
      const i = 0.14 * sz;
      s += '<rect x="' + f3(x + i) + '" y="' + f3(y + i) + '" width="' + f3(sz - 2 * i) + '" height="' + f3(sz - 2 * i) + '" fill="' + col + '" rx="' + f3(0.03 * sz) + '"/>';
      s += '<rect class="st-frame" x="' + f3(x + i + 0.05 * sz) + '" y="' + f3(y + i + 0.05 * sz) + '" width="' + f3(sz - 2 * i - 0.1 * sz) + '" height="' + f3(sz - 2 * i - 0.1 * sz) + '" stroke-width="' + f3(sz * 0.012) + '"/>';
      s += '<text class="st-num" x="' + f3(cx) + '" y="' + f3(cy) + '" font-size="' + f3(sz * 0.42) + '"' + (fx ? ' transform="rotate(180 ' + f3(cx) + ' ' + f3(cy) + ')"' : '') + '>' + n + '</text>';
    } else {
      // the gummed back, with the number showing faintly through
      s += '<rect class="st-gum" x="' + f3(x + 0.12 * sz) + '" y="' + f3(y + 0.12 * sz) + '" width="' + f3(sz * 0.76) + '" height="' + f3(sz * 0.76) + '"/>';
      const tr = fx ? 'translate(' + f3(2 * cx) + ' 0) scale(-1 1)' : 'translate(0 ' + f3(2 * cy) + ') scale(1 -1)';
      s += '<text class="st-num back" x="' + f3(cx) + '" y="' + f3(cy) + '" font-size="' + f3(sz * 0.42) + '" transform="' + tr + '">' + n + '</text>';
    }
    return s + '</g>';
  }
  function chip(n, x, y, w, h, cls) {
    const col = INK[(n - 1) % INK.length];
    return '<g class="st-chip' + (cls ? ' ' + cls : '') + '"><rect x="' + f3(x) + '" y="' + f3(y) + '" width="' + f3(w) + '" height="' + f3(h) + '" rx="' + f3(h * 0.25) + '" fill="' + col + '"/>' +
      '<text x="' + f3(x + w / 2) + '" y="' + f3(y + h / 2) + '" font-size="' + f3(h * 0.72) + '">' + n + '</text></g>';
  }

  C.engine({
    id: 'stamps',
    name: 'Folding stamps',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: '**Drag** a stamp across a perforation to fold that part of the packet over (the crease is the perforation halfway along your drag). Hold **Shift** — or switch *Fold under* on in the panel — to fold it underneath instead. **Click** a perforation to choose from a menu. Every fold goes through all the layers at that perforation, as it would with real stamps.\n\nGoal: all the stamps in one pile that reads the given order from the top down (the other way up counts too). The picture below the stamps shows the packet from the side; the pile to make is in the card on the right. **Undo** takes a fold back; a hint shows the next fold.',

    verify(p) {
      const d = p.data;
      if (!d || !(d.rows >= 1) || !(d.cols >= 1) || !Array.isArray(d.target)) return { ok: false, err: 'rows, cols and target are needed' };
      const n = d.rows * d.cols;
      if (d.target.length !== n || d.target.slice().sort((a, b) => a - b).some((v, i) => v !== i + 1)) return { ok: false, err: 'target must use each stamp once' };
      if (n > 10) return { ok: false, err: 'too many stamps' };
      const path = solve(start(d.rows, d.cols), d.target);
      if (!path) return { ok: false, err: 'this pile cannot be folded' };
      if (!path.length) return { ok: false, err: 'already a pile' };
      if (p.par != null && p.par !== path.length) return { ok: false, err: 'par is ' + p.par + ' but the fewest folds is ' + path.length };
      return { ok: true, par: path.length };
    },

    generate(rng, level) { return generateOne(rng, level); },

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data;
      const R = d.rows, K = d.cols, n = R * K, strip = R === 1;
      const target = d.target.slice();
      let s = start(R, K);
      let busy = false, token = 0, raf = 0, timers = [];
      let under = false, hover = null, drag = null, menu = null, hintT = null;

      // layout: the stamps on top, the side view below, the goal card on the right
      const gap = strip ? Math.min(0.3, 2.6 / n) : 0;
      const sideY = R + 0.75;
      const sideH = strip ? Math.max(1.0, n * gap + 0.5) : (Math.min(n, 9) * 0.34 + 0.45);
      const cardX = K + 0.7, cardW = 1.5, chipH = Math.min(0.38, 4.2 / n);
      const cardH = n * (chipH + 0.06) + 0.95;
      const x1 = cardX + cardW + 0.4, y1 = Math.max(sideY + sideH + 0.3, cardH + 0.1);
      wb.setBounds({ x0: -0.5, y0: -0.55, x1, y1 }, 0.05);

      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      ctx.s('rect', { x: -0.08, y: -0.08, width: K + 0.16, height: R + 0.16, rx: 0.08, class: 'st-table' }, bg);
      const gCard = ctx.s('g', { class: 'st-card' }, bg);
      const gSide = ctx.s('g', { class: 'st-side' }, board);
      const gStamps = ctx.s('g', { class: 'st-stamps' }, board);
      const gPerf = ctx.s('g', { class: 'st-perfs' }, board);
      const gTop = ctx.s('g', { class: 'st-top' }, top);
      const gHint = ctx.s('g', { class: 'st-hint' }, top);

      function drawCard() {
        const pile = pileOf(s);
        let out = '<rect x="' + cardX + '" y="0" width="' + cardW + '" height="' + f3(cardH) + '" rx="0.14" class="st-cardbg"/>';
        out += '<text class="st-cardt" x="' + f3(cardX + cardW / 2) + '" y="0.34" font-size="0.22">Make this pile</text>';
        out += '<text class="st-cardl" x="' + f3(cardX + cardW / 2) + '" y="0.6" font-size="0.15">top</text>';
        let ok = false, rev = false;
        if (pile) { ok = pile.join() === target.join(); rev = pile.join() === target.slice().reverse().join(); }
        target.forEach((t, i) => {
          const y = 0.7 + i * (chipH + 0.06);
          const here = pile ? (rev ? pile[pile.length - 1 - i] : pile[i]) : null;
          out += chip(t, cardX + 0.3, y, cardW - 0.6, chipH, here == null ? '' : here === t ? 'hit' : 'miss');
        });
        out += '<text class="st-cardl" x="' + f3(cardX + cardW / 2) + '" y="' + f3(0.7 + n * (chipH + 0.06) + 0.16) + '" font-size="0.15">bottom</text>';
        gCard.innerHTML = out;
      }

      /* ----- the packet from above ----- */
      function cellXY(st, x, y) { return [st.ox + x, st.oy + y]; }
      function drawStamps(st) {
        let out = '';
        for (let y = 0; y < st.h; y++) for (let x = 0; x < st.w; x++) {
          const stack = st.cells[y * st.w + x];
          if (!stack.length) continue;
          const xy = cellXY(st, x, y);
          // layers below peek out a little
          for (let k = Math.max(0, stack.length - 3); k < stack.length - 1; k++) {
            const dd = (stack.length - 1 - k) * 0.035;
            out += '<rect class="st-under" x="' + f3(xy[0] + 0.05 + dd) + '" y="' + f3(xy[1] + 0.05 + dd) + '" width="0.9" height="0.9"/>';
          }
          out += stampSVG(stack[stack.length - 1], xy[0], xy[1], 1);
          if (stack.length > 1) out += '<g class="st-badge"><circle cx="' + f3(xy[0] + 0.86) + '" cy="' + f3(xy[1] + 0.14) + '" r="0.13"/><text x="' + f3(xy[0] + 0.86) + '" y="' + f3(xy[1] + 0.145) + '" font-size="0.15">' + stack.length + '</text></g>';
        }
        return out;
      }
      function drawPerfs(st) {
        let out = '';
        for (let at = 1; at < st.w; at++) {
          const x = st.ox + at;
          out += '<line class="st-perfline' + (hover && hover.axis === 'v' && hover.at === at ? ' hot' : '') + '" x1="' + x + '" y1="' + (st.oy + 0.04) + '" x2="' + x + '" y2="' + (st.oy + st.h - 0.04) + '"/>';
        }
        for (let at = 1; at < st.h; at++) {
          const y = st.oy + at;
          out += '<line class="st-perfline' + (hover && hover.axis === 'h' && hover.at === at ? ' hot' : '') + '" x1="' + (st.ox + 0.04) + '" y1="' + y + '" x2="' + (st.ox + st.w - 0.04) + '" y2="' + y + '"/>';
        }
        return out;
      }

      /* ----- the packet from the side ----- */
      function drawSide(st) {
        let out = '<text class="st-sidet" x="-0.3" y="' + f3(sideY - 0.12) + '" font-size="0.17">' + (strip ? 'From the side' : 'The stacks, top first') + '</text>';
        if (strip) {
          const base = sideY + sideH - 0.25;
          const pos = {};
          for (let x = 0; x < st.w; x++) st.cells[x].forEach((q, L) => { pos[q >> 2] = { x, L, fx: (q >> 1) & 1 }; });
          out += '<line class="st-ground" x1="-0.2" y1="' + f3(base + 0.07) + '" x2="' + (K + 0.2) + '" y2="' + f3(base + 0.07) + '"/>';
          for (let k = 1; k <= n; k++) {
            const a = pos[k], X = st.ox + a.x, Y = base - a.L * gap;
            out += '<rect x="' + f3(X + 0.08) + '" y="' + f3(Y - 0.04) + '" width="0.84" height="0.08" rx="0.04" fill="' + INK[(k - 1) % INK.length] + '"/>';
            out += '<text class="st-sidenum" x="' + f3(X + 0.5) + '" y="' + f3(Y - 0.02) + '" font-size="' + f3(Math.min(0.14, gap * 0.62)) + '">' + k + '</text>';
          }
          for (let k = 1; k < n; k++) {
            const a = pos[k], b = pos[k + 1];
            const ya = base - a.L * gap, yb = base - b.L * gap;
            if (a.x === b.x) {
              const right = !a.fx; // stamp k's right edge joins k + 1
              const ex = st.ox + a.x + (right ? 0.92 : 0.08);
              const r = Math.abs(ya - yb) / 2;
              out += '<path class="st-link" d="M' + f3(ex) + ' ' + f3(ya) + 'A' + f3(r) + ' ' + f3(r) + ' 0 0 ' + ((right ? ya > yb : ya < yb) ? 0 : 1) + ' ' + f3(ex) + ' ' + f3(yb) + '"/>';
            } else {
              const bx = st.ox + Math.max(a.x, b.x);
              out += '<path class="st-link" d="M' + f3(bx - 0.08) + ' ' + f3(a.x < b.x ? ya : yb) + 'L' + f3(bx + 0.08) + ' ' + f3(a.x < b.x ? yb : ya) + '"/>';
            }
          }
        } else {
          const cw = Math.min(0.9, (K + 0.4) / Math.max(1, st.w * st.h) - 0.1);
          let i = 0;
          for (let y = 0; y < st.h; y++) for (let x = 0; x < st.w; x++) {
            const stack = st.cells[y * st.w + x].slice().reverse();
            const X = -0.1 + i * (cw + 0.1);
            stack.forEach((q, L) => { out += chip(q >> 2, X, sideY + 0.05 + L * 0.34, cw, 0.28); });
            i++;
          }
        }
        return out;
      }

      function draw() {
        gStamps.innerHTML = drawStamps(s);
        gPerf.innerHTML = drawPerfs(s);
        gSide.innerHTML = drawSide(s);
        drawCard();
        ctx.stat('Layers', Math.max.apply(null, s.cells.map((c) => c.length)));
      }

      /* ----- folding, with the flap turning over its perforation ----- */
      function stopAnim() { token++; if (raf) cancelAnimationFrame(raf); raf = 0; timers.forEach(clearTimeout); timers = []; busy = false; }
      function play(ms, frame, done) {
        const my = token, t0 = performance.now();
        busy = true;
        const tick = (now) => {
          if (my !== token) return;
          const t = Math.min(1, (now - t0) / Math.max(1, ms));
          frame(t);
          if (t < 1) raf = requestAnimationFrame(tick); else { raf = 0; busy = false; if (done) done(); }
        };
        raf = requestAnimationFrame(tick);
      }
      // the part that moves: cells (in the old packet) on the moving side
      function movingCells(st, m) {
        const out = [];
        const v = m[0] === 'v';
        for (let y = 0; y < st.h; y++) for (let x = 0; x < st.w; x++) {
          const c = v ? x : y;
          if (m[2] < 0 ? c < m[1] : c >= m[1]) out.push([x, y]);
        }
        return out;
      }
      function animateFold(from, m, to, done) {
        const v = m[0] === 'v', line = (v ? from.ox : from.oy) + m[1];
        const mov = movingCells(from, m);
        const movSet = new Set(mov.map((c) => c[1] * from.w + c[0]));
        // the packet without the flap
        const rest = { w: from.w, h: from.h, ox: from.ox, oy: from.oy, cells: from.cells.map((c, i) => (movSet.has(i) ? [] : c)) };
        const restSVG = drawStamps(rest);
        play(C.anim(460), (t) => {
          const e = 0.5 - Math.cos(Math.PI * t) / 2, cz = Math.cos(Math.PI * e);
          const mtx = v ? [cz, 0, 0, 1, line - cz * line, 0] : [1, 0, 0, cz, 0, line - cz * line];
          let flap = '';
          mov.forEach((c) => {
            const stack = from.cells[c[1] * from.w + c[0]];
            if (!stack.length) return;
            const code = e < 0.5 ? stack[stack.length - 1] : stack[0] ^ (v ? 2 : 1);
            const xy = cellXY(from, c[0], c[1]);
            // at the turn we see the other face: draw it unmirrored inside the squashed frame
            const sgn = cz < 0 ? -1 : 1;
            const fr = v ? [sgn, 0, 0, 1, sgn < 0 ? 2 * xy[0] + 1 : 0, 0] : [1, 0, 0, sgn, 0, sgn < 0 ? 2 * xy[1] + 1 : 0];
            flap += '<g transform="matrix(' + mtx.map(f3).join(' ') + ')"><g transform="matrix(' + fr.join(' ') + ')">' + stampSVG(code, xy[0], xy[1], 1) + '</g>' +
              '<rect x="' + f3(xy[0] + 0.05) + '" y="' + f3(xy[1] + 0.05) + '" width="0.9" height="0.9" fill="#000" opacity="' + f3(0.4 * (1 - Math.abs(cz))) + '"/></g>';
          });
          const shadow = '<g opacity="' + f3(0.25 * Math.sin(Math.PI * e)) + '" transform="translate(0.08 0.12)">' + mov.map((c) => { const xy = cellXY(from, c[0], c[1]); return '<rect x="' + f3(xy[0] + 0.05) + '" y="' + f3(xy[1] + 0.05) + '" width="0.9" height="0.9" transform="matrix(' + mtx.map(f3).join(' ') + ')"/>'; }).join('') + '</g>';
          gStamps.innerHTML = m[3] && e > 0.5 ? flap + restSVG : restSVG + shadow + flap;
        }, () => {
          // slide the packet back onto the table if it hangs over
          const tx = Math.max(0, Math.min(K - to.w, to.ox)), ty = Math.max(0, Math.min(R - to.h, to.oy));
          if (tx === to.ox && ty === to.oy) { done(); return; }
          const sx = to.ox, sy = to.oy;
          play(C.anim(180), (t) => { to.ox = sx + (tx - sx) * t; to.oy = sy + (ty - sy) * t; gStamps.innerHTML = drawStamps(to); }, () => { to.ox = tx; to.oy = ty; done(); });
        });
      }
      function doFold(m, opts) {
        opts = opts || {};
        if (busy) return false;
        const t = fold(s, m[0], m[1], m[2], m[3]);
        if (!t) return false;
        clearHint();
        closeMenu();
        const from = s;
        s = t;
        ctx.sfx('fold');
        gPerf.innerHTML = '';
        animateFold(from, m, s, () => {
          draw();
          if (!opts.silent) { ctx.move(); ctx.changed('fold'); }
          if (opts.done) opts.done();
        });
        ctx.say(cap(describeMove(from, m)) + '.');
        return true;
      }
      const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);

      /* ----- pointing: hover a perforation, drag a stamp across one, click for the menu ----- */
      function inPacket(pt) { return pt[0] >= s.ox && pt[0] <= s.ox + s.w && pt[1] >= s.oy && pt[1] <= s.oy + s.h; }
      function perfAt(pt) {
        const tol = Math.max(0.12, wb.px(9));
        let best = null, bd = tol;
        if (pt[1] >= s.oy - 0.1 && pt[1] <= s.oy + s.h + 0.1) for (let at = 1; at < s.w; at++) { const dd = Math.abs(pt[0] - (s.ox + at)); if (dd < bd) { bd = dd; best = { axis: 'v', at }; } }
        if (pt[0] >= s.ox - 0.1 && pt[0] <= s.ox + s.w + 0.1) for (let at = 1; at < s.h; at++) { const dd = Math.abs(pt[1] - (s.oy + at)); if (dd < bd) { bd = dd; best = { axis: 'h', at }; } }
        return best;
      }
      function foldFromDrag(p0, p1, shift) {
        const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 0.3) return null;
        const v = Math.abs(dx) >= Math.abs(dy);
        if (v ? s.w < 2 : s.h < 2) return null;
        const N = v ? s.w : s.h, o = v ? s.ox : s.oy;
        const mid = ((v ? p0[0] + p1[0] : p0[1] + p1[1]) / 2) - o;
        const at = Math.max(1, Math.min(N - 1, Math.round(mid)));
        const side = (v ? p0[0] : p0[1]) - o < at ? -1 : 1;
        return [v ? 'v' : 'h', at, side, shift || under ? 1 : 0];
      }
      function preview(m) {
        gTop.innerHTML = '';
        if (!m) return;
        const v = m[0] === 'v', line = (v ? s.ox : s.oy) + m[1];
        let out = '';
        movingCells(s, m).forEach((c) => {
          const xy = cellXY(s, c[0], c[1]);
          out += '<rect class="st-lift" x="' + f3(xy[0] + 0.04) + '" y="' + f3(xy[1] + 0.04) + '" width="0.92" height="0.92"/>';
          const gx = v ? 2 * line - xy[0] - 1 : xy[0], gy = v ? xy[1] : 2 * line - xy[1] - 1;
          out += '<rect class="st-ghost' + (m[3] ? ' under' : '') + '" x="' + f3(gx + 0.07) + '" y="' + f3(gy + 0.07) + '" width="0.86" height="0.86"/>';
        });
        out += v ? '<line class="st-crease" x1="' + line + '" y1="' + (s.oy - 0.25) + '" x2="' + line + '" y2="' + (s.oy + s.h + 0.25) + '"/>'
          : '<line class="st-crease" x1="' + (s.ox - 0.25) + '" y1="' + line + '" x2="' + (s.ox + s.w + 0.25) + '" y2="' + line + '"/>';
        gTop.innerHTML = out;
        ctx.say(cap(describeMove(s, m)) + (m[3] ? '' : ' (Shift: underneath)') + '.', 'info');
      }
      wb.handlers.board = {
        down(pt, ev) {
          if (busy) return false;
          closeMenu();
          if (!inPacket(pt) && !perfAt(pt)) return false;
          drag = { p0: pt, m: null, moved: false };
          return true;
        },
        move(pt, ev) {
          if (!drag) return;
          const m = foldFromDrag(drag.p0, pt, ev.shiftKey);
          if (m) drag.moved = true;
          drag.m = m;
          preview(m);
        },
        up(pt, ev) {
          const dg = drag;
          drag = null;
          gTop.innerHTML = '';
          if (!dg) return;
          if (dg.moved && dg.m) { doFold(dg.m); return; }
          if (!dg.moved) { const pf = perfAt(dg.p0); if (pf) openMenu(pf, dg.p0); }
        }
      };
      function onHover(ev) {
        if (drag || busy) return;
        const pt = wb.toWorld(ev.clientX, ev.clientY);
        const pf = perfAt(pt);
        const same = (pf && hover && pf.axis === hover.axis && pf.at === hover.at) || (!pf && !hover);
        if (!same) { hover = pf; gPerf.innerHTML = drawPerfs(s); }
      }
      wb.svg.addEventListener('pointermove', onHover);

      function openMenu(pf, pt) {
        closeMenu();
        const v = pf.axis === 'v';
        const N = v ? s.w : s.h;
        const first = v ? 'left' : 'top', second = v ? 'right' : 'bottom';
        const nA = pf.at, nB = N - pf.at;
        const what = (k, part) => (strip ? (k === 1 ? 'the ' + part + ' stamp' : 'the ' + part + ' ' + k) : (k === 1 ? 'the ' + part + (v ? ' column' : ' row') : 'the ' + part + ' ' + k + (v ? ' columns' : ' rows')));
        const el = ctx.h('div.st-menu');
        const add = (label, m) => el.appendChild(ctx.h('button', { type: 'button', onclick: (e) => { e.stopPropagation(); closeMenu(); doFold(m); } }, label));
        el.appendChild(ctx.h('div.st-menu-t', 'Fold along this perforation'));
        add((v ? '◀ ' : '▲ ') + cap(what(nA, first)) + ' over the top', [pf.axis, pf.at, -1, 0]);
        add((v ? '◀ ' : '▲ ') + cap(what(nA, first)) + ' underneath', [pf.axis, pf.at, -1, 1]);
        add((v ? '▶ ' : '▼ ') + cap(what(nB, second)) + ' over the top', [pf.axis, pf.at, 1, 0]);
        add((v ? '▶ ' : '▼ ') + cap(what(nB, second)) + ' underneath', [pf.axis, pf.at, 1, 1]);
        el.appendChild(ctx.h('button.st-menu-x', { type: 'button', onclick: (e) => { e.stopPropagation(); closeMenu(); } }, 'Cancel'));
        el.addEventListener('pointerdown', (e) => e.stopPropagation());
        wb.host.appendChild(el);
        const sp = wb.toScreen(pt), hw = wb.host.getBoundingClientRect(), sw = wb.svg.getBoundingClientRect();
        const w = el.offsetWidth || 220, h = el.offsetHeight || 180;
        el.style.left = Math.max(6, Math.min(hw.width - w - 6, sp[0] + sw.left - hw.left + 12)) + 'px';
        el.style.top = Math.max(6, Math.min(hw.height - h - 6, sp[1] + sw.top - hw.top + 12)) + 'px';
        menu = el;
      }
      function closeMenu() { if (menu) { menu.remove(); menu = null; } }

      /* ----- panel ----- */
      const btnUnder = ctx.button('Fold under: off', () => { under = !under; btnUnder.textContent = 'Fold under: ' + (under ? 'on' : 'off'); btnUnder.classList.toggle('on', under); }, 'small');
      btnUnder.title = 'When on, a dragged fold goes underneath the packet (the same as holding Shift)';
      const btnTurn = ctx.button('Turn the packet over', () => {
        if (busy) return;
        clearHint();
        const t = turnOver(s);
        play(C.anim(380), (tt) => {
          const e = 0.5 - Math.cos(Math.PI * tt) / 2, cz = Math.cos(Math.PI * e), mid = s.ox + s.w / 2;
          const shown = e < 0.5 ? s : t;
          gStamps.innerHTML = '<g transform="matrix(' + f3(Math.abs(cz)) + ' 0 0 1 ' + f3(mid - Math.abs(cz) * mid) + ' 0)">' + drawStamps(shown) + '</g>';
        }, () => { s = t; draw(); ctx.changed('turn'); });
      }, 'small');
      btnTurn.title = 'Turn the whole packet over, left to right (not a fold)';

      /* ----- hints and the solution ----- */
      function clearHint() { gHint.innerHTML = ''; if (hintT) { clearTimeout(hintT); hintT = null; } }
      function showMove(m) {
        clearHint();
        const v = m[0] === 'v', line = (v ? s.ox : s.oy) + m[1];
        let out = '';
        movingCells(s, m).forEach((c) => { const xy = cellXY(s, c[0], c[1]); out += '<rect class="st-hintlift" x="' + f3(xy[0] + 0.04) + '" y="' + f3(xy[1] + 0.04) + '" width="0.92" height="0.92"/>'; });
        out += v ? '<line class="st-hintline" x1="' + line + '" y1="' + (s.oy - 0.35) + '" x2="' + line + '" y2="' + (s.oy + s.h + 0.35) + '"/>'
          : '<line class="st-hintline" x1="' + (s.ox - 0.35) + '" y1="' + line + '" x2="' + (s.ox + s.w + 0.35) + '" y2="' + line + '"/>';
        gHint.innerHTML = out;
        hintT = setTimeout(clearHint, 8000);
      }

      draw();
      ctx.setGoal('One pile that reads **' + target.join(' ') + '** from the top (or the other way up).');
      ctx.say(strip ? 'Drag a stamp across a perforation to fold. Click a perforation for a menu.' : 'Drag a stamp across a perforation to fold that part over. Click a perforation for a menu.');

      return {
        check() {
          const pile = pileOf(s);
          if (pile && isGoal(s, target)) return { solved: true, msg: 'The pile reads ' + pile.join(' ') + '.' };
          if (pile) return { solved: false, msg: 'All in one pile — but it reads ' + pile.join(' ') + ' from the top.' };
          return { solved: false, msg: 'Not all in one pile yet.' };
        },
        hint() {
          if (busy) return 'Let the fold finish first.';
          const path = solve(s, target, 150000);
          if (path === undefined) return 'Too many ways on from here for me to look through — try undoing a fold.';
          if (!path) return pileOf(s) ? 'The pile is closed and reads the wrong way: undo a few folds.' : 'From here that pile cannot be made any more — undo a fold or two.';
          if (!path.length) return 'Done already!';
          const m = path[0];
          return { text: cap(describeMove(s, m)) + ' along the dashed perforation. (' + C.plural(path.length, 'fold') + ' to go.)', show() { showMove(m); } };
        },
        solve() {
          stopAnim();
          let path = solve(s, target);
          if (!path) { s = start(R, K); draw(); path = solve(s, target); }
          if (!path) return;
          let k = 0;
          const next = () => {
            if (k >= path.length) { ctx.changed('solve'); return; }
            const m = path[k++];
            doFold(m, { silent: true, done: () => { ctx.move(); timers.push(setTimeout(next, C.anim(160))); } });
          };
          next();
        },
        explain() {
          const path = solve(start(R, K), target);
          if (!path) return '';
          let st = start(R, K);
          const words = path.map((m, i) => { const w = (i + 1) + '. ' + cap(describeMove(st, m)) + '.'; st = fold(st, m[0], m[1], m[2], m[3]); return w; });
          return 'One shortest way (' + C.plural(path.length, 'fold') + '): ' + words.join(' ');
        },
        getState() { return { w: s.w, h: s.h, ox: s.ox, oy: s.oy, cells: s.cells.map((c) => c.slice()) }; },
        setState(x) {
          stopAnim(); clearHint(); closeMenu();
          if (x && x.cells) s = { w: x.w, h: x.h, ox: x.ox || 0, oy: x.oy || 0, cells: x.cells.map((c) => c.slice()) };
          gTop.innerHTML = '';
          draw();
        },
        reset() { stopAnim(); clearHint(); closeMenu(); },
        destroy() { stopAnim(); closeMenu(); clearHint(); wb.svg.removeEventListener('pointermove', onHover); wb.handlers.board = null; }
      };
    },

    thumb(p) {
      const d = p.data, n = d.target.length;
      const w = Math.max(d.cols, 2.2) + 0.6;
      let s = '<svg viewBox="-0.3 -0.3 ' + f3(w + 1.4) + ' ' + f3(Math.max(d.rows, n * 0.36) + 0.6) + '" preserveAspectRatio="xMidYMid meet">';
      for (let y = 0; y < d.rows; y++) for (let x = 0; x < d.cols; x++) s += stampSVG((y * d.cols + x + 1) * 4, x * 0.72, y * 0.72, 0.72);
      const ch = Math.min(0.32, Math.max(d.rows, 2.4) / n);
      d.target.forEach((t, i) => { s += chip(t, w - 0.2, i * (ch + 0.04), 0.9, ch); });
      return s + '</svg>';
    }
  });

  C.stampsSolver = { start, fold, turnOver, solve, allPiles, movesOf, pileOf, isGoal, describeMove, grade, makeTitle, generateOne, sheetWord, numbersWord };

  C.css('stamps', `
    .st-table { fill: rgba(0,0,0,.12); stroke: var(--line); stroke-width: 1px; vector-effect: non-scaling-stroke; stroke-dasharray: 5 4; }
    .st-paper { stroke: none; }
    .st-perf { fill: none; stroke: var(--board); stroke-linecap: round; }
    .st-frame { fill: none; stroke: rgba(255,255,255,.55); }
    .st-num { font-family: Georgia, "Times New Roman", serif; font-weight: 700; fill: #fffaf0; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .st-num.back { fill: rgba(90, 70, 40, .42); }
    .st-gum { fill: rgba(255,255,255,.25); stroke: rgba(120,100,60,.25); stroke-width: 1px; vector-effect: non-scaling-stroke; }
    .st-under { fill: ${PAPER}; stroke: rgba(0,0,0,.28); stroke-width: 1px; vector-effect: non-scaling-stroke; }
    .st-badge circle { fill: var(--panel); stroke: var(--gold); stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
    .st-badge text { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--text); text-anchor: middle; dominant-baseline: central; }
    .st-perfline { stroke: transparent; stroke-width: 10px; vector-effect: non-scaling-stroke; cursor: pointer; }
    .st-perfline.hot { stroke: rgba(255, 209, 102, .45); stroke-width: 6px; }
    .st-crease { stroke: var(--gold); stroke-width: 2px; vector-effect: non-scaling-stroke; stroke-dasharray: 8 4 2 4; }
    .st-lift { fill: var(--accent); fill-opacity: .25; pointer-events: none; }
    .st-ghost { fill: var(--gold); fill-opacity: .24; stroke: var(--gold); stroke-width: 1.6px; vector-effect: non-scaling-stroke; stroke-dasharray: 5 4; pointer-events: none; }
    .st-ghost.under { fill: none; stroke: var(--teal); }
    .st-hintline { stroke: var(--gold); stroke-width: 3px; vector-effect: non-scaling-stroke; stroke-dasharray: 9 5; animation: stpulse 1s ease-in-out infinite; }
    .st-hintlift { fill: var(--gold); fill-opacity: .3; animation: stpulse 1s ease-in-out infinite; pointer-events: none; }
    @keyframes stpulse { 50% { opacity: .4; } }
    .st-cardbg { fill: var(--panel-2); stroke: var(--line); stroke-width: 1px; vector-effect: non-scaling-stroke; }
    .st-cardt { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--muted); text-anchor: middle; }
    .st-cardl { font-family: "Segoe UI", system-ui, sans-serif; fill: var(--faint); text-anchor: middle; font-style: italic; }
    .st-chip text { font-family: Georgia, serif; font-weight: 700; fill: #fffaf0; text-anchor: middle; dominant-baseline: central; }
    .st-chip.hit rect { stroke: var(--green); stroke-width: 2.5px; vector-effect: non-scaling-stroke; }
    .st-chip.miss rect { stroke: var(--red); stroke-width: 2.5px; vector-effect: non-scaling-stroke; stroke-dasharray: 4 3; }
    .st-sidet { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--muted); }
    .st-sidenum { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 800; fill: #fff; text-anchor: middle; dominant-baseline: central; paint-order: stroke; stroke: rgba(0,0,0,.35); stroke-width: 2px; }
    .st-ground { stroke: var(--line); stroke-width: 1px; vector-effect: non-scaling-stroke; }
    .st-link { fill: none; stroke: var(--ink-2); stroke-width: 1.4px; vector-effect: non-scaling-stroke; }
    .st-menu { position: absolute; z-index: 8; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 6px; box-shadow: 0 12px 30px var(--shadow); display: flex; flex-direction: column; gap: 3px; min-width: 210px; }
    .st-menu-t { font-size: .72rem; color: var(--muted); padding: 2px 6px 4px; font-weight: 700; }
    .st-menu button { text-align: left; border: 0; background: transparent; color: var(--text); padding: 7px 9px; border-radius: 8px; font: inherit; font-size: .84rem; cursor: pointer; }
    .st-menu button:hover { background: var(--panel-2); }
    .st-menu .st-menu-x { color: var(--muted); text-align: center; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
