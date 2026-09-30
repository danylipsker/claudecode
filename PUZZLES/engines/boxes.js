/* The Puzzle Cabinet · engines/boxes.js
 *
 * Dots and boxes endgames against the computer. Some lines are drawn and some
 * boxes already won; it is your move. Draw a line between two neighbouring
 * dots; complete a box and it is yours — and you must move again. The computer
 * plays perfectly: every position is solved exactly, by working backwards
 * through every way the remaining lines can be drawn (a table of 2^n values
 * for the n lines left, n ≤ 22).
 *
 * Hints use Elwyn Berlekamp's ideas in our own words: safe lines, chains and
 * loops, control, double-dealing (all but two, all but four), the half- and
 * hard-hearted handouts, and the long chain rule.
 *
 * data: {
 *   rows, cols                boxes down and across
 *   lines: '0110…'            the lines drawn at the start: first the horizontal ones,
 *                             row by row (rows + 1 rows of cols), then the vertical ones
 *                             (rows rows of cols + 1)
 *   owners: '..y.c…'          boxes already won (y you, c me), row by row; exactly the full ones
 *   goal: { win: true } | { atLeast: n }   win more boxes in all, or take n of the boxes left
 *   last: [line, …]           optional: the lines I have just drawn (shown in my colour)
 *   best: n                   optional: the most boxes you can take of those left (checked)
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* =====================================================================
   * the board: lines and boxes
   * ===================================================================== */

  function geometry(rows, cols) {
    const H = (rows + 1) * cols, N = H + rows * (cols + 1);
    const hIdx = (r, c) => r * cols + c, vIdx = (r, c) => H + r * (cols + 1) + c;
    const boxLines = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) boxLines.push([hIdx(r, c), hIdx(r + 1, c), vIdx(r, c), vIdx(r, c + 1)]);
    const lineBoxes = [];
    for (let i = 0; i < N; i++) lineBoxes.push([]);
    boxLines.forEach((ls, b) => ls.forEach((l) => lineBoxes[l].push(b)));
    // the ends of each line, in dot coordinates [x, y]
    const ends = [];
    for (let i = 0; i < N; i++) {
      if (i < H) { const r = Math.floor(i / cols), c = i % cols; ends.push([[c, r], [c + 1, r]]); }
      else { const k = i - H, r = Math.floor(k / (cols + 1)), c = k % (cols + 1); ends.push([[c, r], [c, r + 1]]); }
    }
    return { rows, cols, H, N, hIdx, vIdx, boxLines, lineBoxes, ends };
  }

  function parse(d) {
    const G = geometry(d.rows, d.cols);
    const drawn = String(d.lines || '').split('').map((ch) => ch === '1');
    const owners = String(d.owners || '').split('');
    return { G, drawn, owners };
  }

  /* =====================================================================
   * the solver: val[mask] = the best (my boxes − your boxes) from here on,
   * for the player to move, where mask = the remaining lines drawn so far
   * ===================================================================== */

  const cache = new Map(); // the last few positions solved, by board and lines
  function solverFor(d) {
    const key = d.rows + "x" + d.cols + ":" + d.lines;
    let S = cache.get(key);
    if (S) return S;
    const { G, drawn } = parse(d);
    const R = [], bitOf = new Array(G.N).fill(-1);
    for (let i = 0; i < G.N; i++) if (!drawn[i]) { bitOf[i] = R.length; R.push(i); }
    const n = R.length;
    if (n > 24) throw new Error('too many lines left to solve exactly (' + n + ')');
    const full = n === 32 ? -1 : (1 << n) - 1;
    // the boxes still open, each as the mask of its undrawn lines
    const openBoxes = [], boxMask = new Array(G.boxLines.length).fill(-1);
    G.boxLines.forEach((ls, b) => {
      let mk = 0;
      ls.forEach((l) => { if (!drawn[l]) mk |= 1 << bitOf[l]; });
      if (mk) { boxMask[b] = mk; openBoxes.push(b); }
    });
    // for each remaining line: the other lines each neighbouring open box still needs
    const needA = new Int32Array(n).fill(-1), needB = new Int32Array(n).fill(-1);
    for (let i = 0; i < n; i++) {
      const bs = G.lineBoxes[R[i]].filter((b) => boxMask[b] !== -1);
      const others = bs.map((b) => boxMask[b] & ~(1 << i));
      if (others.length > 0) needA[i] = others[0];
      if (others.length > 1) needB[i] = others[1];
    }
    const done = (m, i) => ((needA[i] >= 0 && (m & needA[i]) === needA[i]) ? 1 : 0) + ((needB[i] >= 0 && (m & needB[i]) === needB[i]) ? 1 : 0);
    const val = new Int8Array(n === 0 ? 1 : 1 << n);
    for (let m = full - 1; m >= 0; m--) {
      let best = -127, free = full & ~m;
      while (free) {
        const b = free & -free, i = 31 - Math.clz32(b);
        free ^= b;
        const c = done(m, i), v = c ? c + val[m | b] : -val[m | b];
        if (v > best) best = v;
      }
      val[m] = best;
    }
    S = {
      G, R, n, full, bitOf, openBoxes, boxMask, val, done,
      value: (m) => (m === full ? 0 : val[m]),
      // every move from m: { i (bit), line, c (boxes it completes), net (for the mover) }
      moves(m) {
        const out = [];
        let free = full & ~m;
        while (free) {
          const b = free & -free, i = 31 - Math.clz32(b);
          free ^= b;
          const c = done(m, i), rest = (m | b) === full ? 0 : val[m | b];
          out.push({ i, line: R[i], c, net: c ? c + rest : -rest });
        }
        return out;
      }
    };
    cache.set(key, S);
    if (cache.size > 6) cache.delete(cache.keys().next().value);
    return S;
  }

  /* =====================================================================
   * strings and coins: safe lines, chains and loops
   * ===================================================================== */

  // the open boxes and their undrawn sides, with mask m of remaining lines drawn
  function structure(S, m) {
    if (S.stM === m && S.stV) return S.stV;
    const G = S.G;
    const undrawn = (line) => { const i = S.bitOf[line]; return i >= 0 && !(m & (1 << i)); };
    const deg = new Array(G.boxLines.length).fill(0), open = [];
    G.boxLines.forEach((ls, b) => { const k = ls.filter(undrawn).length; deg[b] = k; if (k) open.push(b); });
    const safe = [], give = [];
    for (let i = 0; i < S.n; i++) {
      if (m & (1 << i)) continue;
      const bs = G.lineBoxes[S.R[i]];
      if (bs.some((b) => deg[b] === 1)) continue; // completes a box
      if (bs.every((b) => deg[b] >= 3)) safe.push(i); else give.push(i);
    }
    const ready = open.filter((b) => deg[b] === 1);
    // components of boxes joined by undrawn shared lines
    const nb = (b) => {
      const out = [];
      G.boxLines[b].forEach((l) => { if (!undrawn(l)) return; G.lineBoxes[l].forEach((x) => { if (x !== b) out.push(x); }); });
      return out;
    };
    const seen = new Set(), comps = [];
    open.forEach((b) => {
      if (seen.has(b)) return;
      const comp = [], stack = [b];
      seen.add(b);
      while (stack.length) { const x = stack.pop(); comp.push(x); nb(x).forEach((y) => { if (!seen.has(y)) { seen.add(y); stack.push(y); } }); }
      const simple = comp.every((x) => deg[x] <= 2);
      const edges = comp.reduce((a, x) => a + nb(x).length, 0) / 2;
      let kind = 'tangle';
      if (simple) kind = edges === comp.length && comp.every((x) => nb(x).length === 2) ? 'loop' : 'chain';
      comps.push({ boxes: order(comp, nb), kind, len: comp.length });
    });
    S.stM = m;
    S.stV = { deg, open, safe, give, ready, comps };
    return S.stV;
  }
  // boxes of a chain or loop in order along it
  function order(comp, nb) {
    if (comp.length < 2) return comp.slice();
    const set = new Set(comp);
    let start = comp.find((x) => nb(x).filter((y) => set.has(y)).length <= 1);
    if (start == null) start = comp[0];
    const out = [start], used = new Set([start]);
    let cur = start;
    for (;;) {
      const nx = nb(cur).find((y) => set.has(y) && !used.has(y));
      if (nx == null) break;
      out.push(nx); used.add(nx); cur = nx;
    }
    comp.forEach((x) => { if (!used.has(x)) out.push(x); });
    return out;
  }

  // a loop that has been opened: one run of boxes with a ready box at each end
  function openedLoop(st) { return st.comps.some((c) => c.boxes.filter((b) => st.deg[b] === 1).length >= 2 && c.len >= 3); }

  // what kind of move a line is, from position m
  function moveKind(S, m, i) {
    const st = structure(S, m);
    const c = S.done(m, i);
    if (c) return { kind: 'take', c };
    const G = S.G, line = S.R[i];
    const bs = G.lineBoxes[line];
    const gives = bs.some((b) => st.deg[b] === 2);
    if (!gives) return { kind: 'safe' };
    if (st.ready.length) return { kind: 'decline' };
    if (st.safe.length) return { kind: 'sacrifice' };
    // opening a chain: which, and is it the middle of a two-chain?
    const comp = st.comps.find((k) => k.boxes.some((b) => bs.includes(b)));
    const mid = comp && comp.kind === 'chain' && comp.len === 2 && bs.length === 2 && bs.every((b) => comp.boxes.includes(b));
    return { kind: 'open', comp, hard: !!mid };
  }

  /* =====================================================================
   * the game: scores, the goal, the moves each side prefers
   * ===================================================================== */

  function gameOf(d) {
    const S = solverFor(d);
    const owners = String(d.owners || '');
    const preY = owners.split('').filter((c) => c === 'y').length, preC = owners.split('').filter((c) => c === 'c').length;
    const B = S.openBoxes.length, total = d.rows * d.cols;
    const goal = d.goal || { win: true };
    const Gm = {
      S, preY, preC, B, total, goal,
      // the least future net (your boxes − mine, from here on) that still meets the goal
      need(gY, gC) {
        const left = B - gY - gC;
        if (goal.atLeast != null) return 2 * (goal.atLeast - gY) - left;
        return 1 - (preY + gY) + (preC + gC);
      },
      secured(gY, gC) { return goal.atLeast != null ? gY >= goal.atLeast : (preY + gY) * 2 > total; },
      lost(gY, gC) { return goal.atLeast != null ? gC > B - goal.atLeast : (preC + gC) * 2 >= total; },
      // replay a list of moves [[bit, 'y'|'c'], …]
      replay(mv) {
        let m = 0, gY = 0, gC = 0, turn = 'y';
        const own = {}, who = {};
        mv.forEach(([i, w]) => {
          const c = S.done(m, i);
          m |= 1 << i;
          who[i] = w;
          if (c) S.G.lineBoxes[S.R[i]].forEach((b) => { const k = S.boxMask[b]; if (k !== -1 && (m & k) === k && !own[b]) { own[b] = w; if (w === 'y') gY++; else gC++; } });
          else turn = w === 'y' ? 'c' : 'y';
        });
        return { m, gY, gC, turn, own, who, over: m === S.full };
      },
      keeping(m, gY, gC) { const nd = Gm.need(gY, gC); return S.moves(m).filter((x) => x.net >= nd); },
      canStill(m, gY, gC) { return m !== S.full && S.value(m) >= Gm.need(gY, gC); },
      // the move a hint recommends: keeps the goal, the most boxes, a capture or a quiet line when equal
      best(m, gY, gC) {
        const ks = Gm.keeping(m, gY, gC);
        if (!ks.length) return null;
        const top = Math.max.apply(null, ks.map((x) => x.net));
        const cand = ks.filter((x) => x.net === top);
        return cand.find((x) => x.c) || cand.find((x) => moveKind(S, m, x.i).kind === 'safe') || cand[0];
      },
      // my move: the most boxes for me; then captures; then the fewest good replies for you
      cpu(m, gY, gC) {
        const ms = S.moves(m);
        const top = Math.max.apply(null, ms.map((x) => x.net));
        const cand = ms.filter((x) => x.net === top);
        const cap = cand.filter((x) => x.c).sort((a, b) => b.c - a.c);
        if (cap.length) return cap[0];
        let best = null, bs = Infinity;
        cand.forEach((x) => {
          const m2 = m | (1 << x.i);
          const k = Gm.keeping(m2, gY, gC).length;
          const kind = moveKind(S, m, x.i).kind;
          const sc = k * 10 + (kind === 'safe' ? 0 : 1);
          if (sc < bs) { bs = sc; best = x; }
        });
        return best || ms[0];
      }
    };
    return Gm;
  }

  // follow best play from the start: how many choices matter, and which ideas they need
  function analyse(d) {
    const Gm = gameOf(d), S = Gm.S;
    let m = 0, gY = 0, gC = 0, turn = 'y', crit = 0, decisions = 0, steps = 0, hardN = 0;
    const feats = { take: 0, decline: 0, sacrifice: 0, hard: 0, loop: 0, safe: 0 };
    let firstK = 0, firstL = 0;
    while (m !== S.full && steps++ < 80) {
      if (Gm.secured(gY, gC)) break;
      let x;
      if (turn === 'y') {
        const all = S.moves(m), ks = Gm.keeping(m, gY, gC);
        if (!ks.length) return null;
        if (!firstL) { firstL = all.length; firstK = ks.length; }
        x = Gm.best(m, gY, gC);
        if (ks.length < all.length) {
          decisions++;
          const k = moveKind(S, m, x.i);
          const bad = all.filter((y) => y.net < Gm.need(gY, gC)).map((y) => moveKind(S, m, y.i));
          // taking a free box is easy — unless some other capture is the trap
          const hard = k.kind !== 'take' || bad.some((b) => b.kind === 'take');
          crit += (hard ? 1 : 0.25) * Math.log2(all.length / ks.length);
          if (hard) hardN++;
          if (k.kind === 'decline' && bad.some((b) => b.kind === 'take')) { feats.decline++; if (openedLoop(structure(S, m))) feats.loop++; }
          if (k.kind === 'sacrifice' && bad.some((b) => b.kind === 'safe')) feats.sacrifice++;
          if (k.kind === 'open' && k.hard && bad.some((b) => b.kind === 'open')) feats.hard++;
          if (k.kind === 'take' && bad.some((b) => b.kind !== 'take')) feats.take++;
          if (k.kind === 'safe' && bad.length) feats.safe++;
        }
      } else x = Gm.cpu(m, gY, gC);
      const c = x.c;
      m |= 1 << x.i;
      if (c) { if (turn === 'y') gY += c; else gC += c; } else turn = turn === 'y' ? 'c' : 'y';
    }
    return { crit, decisions, hard: hardN, feats, firstK, firstL, best: (Gm.B + S.value(0)) / 2, value: S.value(0) };
  }

  /* =====================================================================
   * words for hints
   * ===================================================================== */

  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many || one + 's');
  function inventory(st) {
    const parts = [];
    const chains = st.comps.filter((c) => c.kind === 'chain').map((c) => c.len).sort((a, b) => a - b);
    const loops = st.comps.filter((c) => c.kind === 'loop').map((c) => c.len).sort((a, b) => a - b);
    const tangles = st.comps.filter((c) => c.kind === 'tangle').length;
    if (chains.length) parts.push((chains.length === 1 ? 'a chain of ' : 'chains of ') + chains.join(', ').replace(/, (\d+)$/, ' and $1'));
    if (loops.length) parts.push((loops.length === 1 ? 'a loop of ' : 'loops of ') + loops.join(', ').replace(/, (\d+)$/, ' and $1'));
    if (tangles) parts.push(plural(tangles, 'tangle') + ' not yet sorted into chains');
    return (parts.join('; ') || 'nothing left') + (st.safe.length ? ' — and ' + plural(st.safe.length, 'safe line') : ' — and no safe lines');
  }
  function reasonFor(Gm, m, gY, gC, x) {
    const S = Gm.S, st = structure(S, m), k = moveKind(S, m, x.i);
    const long = st.comps.filter((c) => c.kind === 'chain' && c.len >= 3).length;
    const inv = 'On the board: ' + inventory(st) + '.';
    if (k.kind === 'take') {
      const after = structure(S, m | (1 << x.i));
      return inv + ' **Take the box.** ' + (st.ready.length > 1 || after.ready.length ? 'Here taking is right — but watch the end of the chain: sometimes the last two boxes are worth more left behind (double-dealing).' : 'It costs nothing, and you move again.');
    }
    if (k.kind === 'decline') {
      const loop = openedLoop(st);
      return inv + ' **Double-deal.** Do not take the last ' + (loop ? 'four boxes of the loop' : 'two boxes of the chain') + ': draw the line that leaves them for me as ' + (loop ? 'two pairs' : 'a pair') + ', taken with one stroke. I take them — and then I must move again, and open the next chain for you. Giving up ' + (loop ? 'four' : 'two') + ' keeps you in **control**: you collect the bigger chains.';
    }
    if (k.kind === 'sacrifice') {
      return inv + ' **A sacrifice.** There are still safe lines, but playing one would leave the count of safe lines wrong for you. Giving me a box or two now changes whose turn it is when the safe lines run out — and that decides who must open the long chains.';
    }
    if (k.kind === 'open') {
      if (k.hard) return inv + ' Every line now gives something away. Give the two-box chain — and draw its **middle** line: that hands me two single boxes (a *hard-hearted handout*), so I cannot decline them and hand the chain back. Drawn at the end, it would let me double-deal.';
      const len = k.comp ? k.comp.len : 0;
      return inv + ' Every line now gives something away: open the ' + (k.comp && k.comp.kind === 'loop' ? 'loop' : 'chain') + ' of ' + len + '. ' + (long ? 'Give away the small things first; whoever must open the **long** chains loses them.' : 'Nothing long is left, so just give the least.');
    }
    // a safe line
    const after = structure(S, m | (1 << x.i));
    return inv + ' Draw a **safe line** — one that gives nothing away. After it ' + plural(after.safe.length, 'safe line') + ' will be left with me to move' + (after.safe.length % 2 === 0 ? ': if we both play safe, I run out first and have to open a chain for you.' : '.') + (long ? ' That is the **long chain rule** at work: fight for the parity that makes the other player open the first long chain.' : '');
  }

  /* =====================================================================
   * the board on the table
   * ===================================================================== */

  const Q = 100;
  const COL = { y: 'you', c: 'me' };

  function mountGame(ctx, p) {
    const d = p.data, wb = ctx.wb, Sv = ctx.s;
    const Gm = gameOf(d), S = Gm.S, G = S.G;
    const { drawn } = parse(d);
    const pre = String(d.owners || '');
    const W = d.cols * Q, Hh = d.rows * Q;
    let st = { mv: [], over: null };
    let busy = false, timer = null, warned = false, hoverL = -1, stopAnim = [];

    const layer = wb.layer('board'), topL = wb.layer('top');
    const g0 = Sv('g', { class: 'bx' }, layer);
    Sv('rect', { x: -44, y: -44, width: W + 88, height: Hh + 88, rx: 14, class: 'bx-paper' }, g0);
    const grid = Sv('g', { class: 'bx-grid' }, g0);
    for (let x = -Q / 4; x <= W + Q / 4; x += Q / 4) Sv('line', { x1: x, x2: x, y1: -40, y2: Hh + 40 }, grid);
    for (let y = -Q / 4; y <= Hh + Q / 4; y += Q / 4) Sv('line', { y1: y, y2: y, x1: -40, x2: W + 40 }, grid);
    const boxG = Sv('g', {}, g0), lineG = Sv('g', {}, g0), dotG = Sv('g', {}, g0);
    const boxEls = G.boxLines.map((ls, b) => {
      const r = Math.floor(b / d.cols), c = b % d.cols;
      const g = Sv('g', { class: 'bx-box', transform: 'translate(' + (c * Q + Q / 2) + ' ' + (r * Q + Q / 2) + ')' }, boxG);
      Sv('rect', { x: -Q / 2 + 7, y: -Q / 2 + 7, width: Q - 14, height: Q - 14, rx: 8, 'data-key': 'box' + b }, g);
      const t = Sv('text', { y: 2, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
      return { g, t };
    });
    const lineEls = G.ends.map((e, i) => {
      const [a, b] = e;
      return Sv('line', { x1: a[0] * Q, y1: a[1] * Q, x2: b[0] * Q, y2: b[1] * Q, class: 'bx-l' + (drawn[i] ? ' pre' : ' off') }, lineG);
    });
    for (let r = 0; r <= d.rows; r++) for (let c = 0; c <= d.cols; c++) Sv('circle', { cx: c * Q, cy: r * Q, r: 8.5, class: 'bx-dot' }, dotG);
    const ghost = Sv('line', { class: 'bx-ghost' }, topL);
    ghost.style.display = 'none';
    const markG = Sv('g', { class: 'bx-marks' }, topL);
    // who is to move, and the score
    const cx = W / 2;
    const pill = Sv('g', { class: 'bx-pill' }, g0);
    const pillR = Sv('rect', { x: cx - 120, y: -128, width: 240, height: 46, rx: 23 }, pill);
    Sv('circle', { cx: cx - 94, cy: -105, r: 9, class: 'bx-pill-dot' }, pill);
    const pillT = Sv('text', { x: cx + 12, y: -104, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, pill);
    const score = Sv('text', { x: cx, y: Hh + 84, class: 'bx-score', 'text-anchor': 'middle' }, g0);
    wb.setBounds({ x0: Math.min(-52, cx - 150), y0: -142, x1: Math.max(W + 52, cx + 150), y1: Hh + 104 }, 0.04);

    const goalText = () => (Gm.goal.atLeast != null ? 'take at least **' + Gm.goal.atLeast + '** of the ' + Gm.B + ' boxes still open' : 'finish with **more boxes** than me (' + (Gm.preY || Gm.preC ? 'counting the ' + (Gm.preY + Gm.preC) + ' already won' : 'all ' + Gm.total + ' of them') + ')');
    if (!p.goal) ctx.setGoal('Your move: ' + goalText() + '. Complete a box and you move again. I play perfectly.');
    const takeBack = ctx.button('Take back my last move', () => { const pl = C.currentPlayer && C.currentPlayer(); if (pl) pl.undo(); }, 'small');
    takeBack.hidden = true;
    const chainsBtn = ctx.button('Show the chains', () => { chainsOn = !chainsOn; chainsBtn.textContent = chainsOn ? 'Hide the chains' : 'Show the chains'; drawChains(); }, 'small ghost');
    chainsBtn.title = 'Outline the chains and loops of boxes (each box with two sides still open)';
    let chainsOn = false;

    function cur() { return Gm.replay(st.mv); }
    function setTurn(who) {
      pill.setAttribute('class', 'bx-pill ' + (who || (st.over === 'you' ? 'won' : 'lost')));
      pillT.textContent = who === 'y' ? 'Your move' : who === 'c' ? 'My move…' : st.over === 'you' ? 'You did it!' : 'I won this one';
    }
    function draw(anim) {
      const R0 = cur();
      stopAnim.forEach((f) => f());
      stopAnim = [];
      lineEls.forEach((el, line) => {
        if (drawn[line]) { if (d.last && d.last.includes(line)) el.setAttribute('class', 'bx-l me' + (st.mv.length ? '' : ' last')); return; }
        const i = S.bitOf[line], w = R0.who[i];
        const cls = 'bx-l ' + (w ? (w === 'y' ? 'you' : 'me') : 'off');
        el.setAttribute('class', cls + (anim && anim.includes(i) ? ' new' : ''));
        if (anim && anim.includes(i)) {
          el.style.strokeDasharray = Q; el.style.strokeDashoffset = Q;
          const clear = () => { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; };
          const stop = C.tween(C.anim(260), (t) => { el.style.strokeDashoffset = String(Q * (1 - t)); }, clear);
          stopAnim.push(() => { stop(); clear(); });
        }
      });
      boxEls.forEach((e, b) => {
        const o = pre[b] === 'y' || pre[b] === 'c' ? pre[b] : R0.own[b];
        const was = e.g.getAttribute('data-o');
        e.g.setAttribute('class', 'bx-box' + (o ? ' ' + COL[o] : '') + (pre[b] === o && o ? ' pre' : '') + (o && was !== o && anim ? ' pop' : ''));
        e.g.setAttribute('data-o', o || '');
        e.t.textContent = o === 'y' ? 'YOU' : o === 'c' ? 'ME' : '';
      });
      const y = Gm.preY + R0.gY, c = Gm.preC + R0.gC, left = Gm.B - R0.gY - R0.gC;
      score.textContent = 'You ' + y + '  ·  Me ' + c + (left ? '  ·  ' + left + ' left' : '') + (Gm.goal.atLeast != null ? '   (you need ' + Gm.goal.atLeast + ' of the ' + Gm.B + ': ' + R0.gY + ' so far)' : '');
      ctx.stat('Boxes', y + ' : ' + c);
      clearMarks();
      if (chainsOn) drawChains();
      wb.applyPaints();
    }
    function clearMarks() { markG.innerHTML = ''; }
    function drawChains() {
      markG.querySelectorAll('.bx-chain').forEach((e) => e.remove());
      if (!chainsOn) return;
      const R0 = cur(), stc = structure(S, R0.m);
      const cen = (b) => [(b % d.cols) * Q + Q / 2, Math.floor(b / d.cols) * Q + Q / 2];
      stc.comps.forEach((k, j) => {
        const pts = k.boxes.map(cen);
        const g = Sv('g', { class: 'bx-chain ' + k.kind + (k.kind === 'chain' && k.len >= 3 ? ' long' : '') }, markG);
        if (k.kind === 'tangle') { k.boxes.forEach((b) => { const c = cen(b); Sv('circle', { cx: c[0], cy: c[1], r: 16 }, g); }); return; }
        Sv('path', { d: C.pathOf(pts, k.kind === 'loop') }, g);
        const c0 = pts[0];
        Sv('circle', { cx: c0[0], cy: c0[1], r: 17, class: 'bx-chain-b' }, g);
        Sv('text', { x: c0[0], y: c0[1] + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central', text: (k.kind === 'loop' ? '○' : '') + k.len }, g);
      });
    }
    function markLine(i) {
      clearMarks();
      const [a, b] = G.ends[S.R[i]];
      Sv('line', { x1: a[0] * Q, y1: a[1] * Q, x2: b[0] * Q, y2: b[1] * Q, class: 'bx-mark' }, markG);
      if (chainsOn) drawChains();
    }
    function showTakeBack(on) { takeBack.hidden = !on; }

    function afterMove(R0, who, c, lastBit) {
      if (Gm.secured(R0.gY, R0.gC)) return finish('you');
      if (R0.over || Gm.lost(R0.gY, R0.gC)) return finish(Gm.secured(R0.gY, R0.gC) ? 'you' : 'cpu');
      return null;
    }
    function finish(who) {
      st.over = who;
      setTurn(null);
      const R0 = cur(), y = Gm.preY + R0.gY, c = Gm.preC + R0.gC;
      if (who === 'you') ctx.say((Gm.goal.atLeast != null ? 'You have your ' + R0.gY + ' boxes' : 'You have ' + y + ' boxes to my ' + c + (R0.over ? '' : ' — more than half, whatever happens now')) + '. Well played!', 'good');
      else { ctx.say((Gm.goal.atLeast != null ? 'I have made sure you cannot reach ' + Gm.goal.atLeast : 'I have ' + c + ' boxes — you can no longer finish ahead') + '. **Take back** your move and try another.', 'warn'); showTakeBack(true); }
      return who;
    }

    function userMove(i) {
      if (busy || st.over) return;
      const R0 = cur();
      if (R0.m & (1 << i)) return;
      const keepBefore = Gm.canStill(R0.m, R0.gY, R0.gC);
      const c = S.done(R0.m, i);
      st.mv.push([i, 'y']);
      ctx.sfx(c ? 'snap' : 'tap');
      ctx.move();
      draw([i]);
      const R1 = cur();
      if (afterMove(R1, 'y', c, i)) { ctx.changed('move'); return; }
      if (c) {
        const ok = Gm.canStill(R1.m, R1.gY, R1.gC);
        ctx.say((c === 2 ? 'Two boxes with one line! Move again' : 'A box! Move again') + (ok ? '.' : ' — but from here I can stop you, whatever you do.'), ok ? 'good' : 'warn');
        showTakeBack(!ok);
        ctx.changed('move');
        checkHope(R1, keepBefore);
        return;
      }
      if (keepBefore && !Gm.canStill(R1.m, R1.gY, R1.gC) && !warned) { warned = true; ctx.toast('Hmm… that lets me in. (Undo is right there.)'); }
      busy = true;
      ctx.lockUndo(true);
      setTurn('c');
      ctx.say('Thinking…', 'info');
      turnStats = { took: 0 };
      timer = setTimeout(cpuStep, C.anim(650));
    }
    function checkHope(R1, keepBefore) {
      if (keepBefore && !Gm.canStill(R1.m, R1.gY, R1.gC) && !warned) { warned = true; ctx.toast('Hmm… that lets me in. (Undo is right there.)'); }
    }
    let turnStats = { took: 0 };
    function cpuStep() {
      timer = null;
      const R0 = cur();
      const x = Gm.cpu(R0.m, R0.gY, R0.gC);
      if (!x) { busy = false; ctx.lockUndo(false); return; }
      const kind = moveKind(S, R0.m, x.i).kind;
      st.mv.push([x.i, 'c']);
      ctx.sfx(x.c ? 'snap' : 'tap');
      draw([x.i]);
      const R1 = cur();
      turnStats.took += x.c;
      const done = afterMove(R1, 'c', x.c, x.i);
      if (!done && x.c) { timer = setTimeout(cpuStep, C.anim(520)); return; }
      busy = false;
      ctx.lockUndo(false);
      if (!done) {
        setTurn('y');
        const t = turnStats.took;
        const msg = t ? 'I took ' + plural(t, 'box', 'boxes') + (kind === 'decline' ? ' and left the last ones for you — now you must move.' : kind === 'safe' ? ', then drew a quiet line.' : ', then had to give you something.')
          : kind === 'safe' ? 'I drew a safe line.' : kind === 'open' || kind === 'sacrifice' ? 'I had to give you something — or is it a trap?' : 'Your move.';
        const ok = Gm.canStill(R1.m, R1.gY, R1.gC);
        ctx.say(msg + (ok ? ' Your move.' : ' Your move — but I have the upper hand now.'), ok ? '' : 'warn');
        showTakeBack(!ok);
        if (!ok) warned = true;
      }
      ctx.changed('move');
    }

    // the pointer: the nearest open line
    function lineAt(pt) {
      const R0 = cur();
      let best = -1, bd = Q * 0.32;
      for (let i = 0; i < S.n; i++) {
        if (R0.m & (1 << i)) continue;
        const [a, b] = G.ends[S.R[i]];
        const x1 = a[0] * Q, y1 = a[1] * Q, x2 = b[0] * Q, y2 = b[1] * Q;
        const t = Math.max(0, Math.min(1, ((pt[0] - x1) * (x2 - x1) + (pt[1] - y1) * (y2 - y1)) / (Q * Q)));
        const dd = Math.hypot(pt[0] - (x1 + t * (x2 - x1)), pt[1] - (y1 + t * (y2 - y1)));
        if (dd < bd) { bd = dd; best = i; }
      }
      return best;
    }
    function showGhost(i) {
      hoverL = i;
      if (i < 0 || busy || st.over) { ghost.style.display = 'none'; return; }
      const [a, b] = G.ends[S.R[i]];
      ghost.setAttribute('x1', a[0] * Q); ghost.setAttribute('y1', a[1] * Q); ghost.setAttribute('x2', b[0] * Q); ghost.setAttribute('y2', b[1] * Q);
      ghost.style.display = '';
    }
    let downL = -1;
    wb.handlers.board = {
      down(pt) {
        if (busy || st.over) return false;
        const i = lineAt(pt);
        if (i < 0) return false;
        downL = i;
        showGhost(i);
        return true;
      },
      move(pt) { if (downL >= 0) showGhost(lineAt(pt) === downL ? downL : -1); },
      up(pt) {
        const i0 = downL;
        downL = -1;
        showGhost(-1);
        if (i0 >= 0 && lineAt(pt) === i0) userMove(i0);
      },
      hover(pt) { showGhost(lineAt(pt)); }
    };

    draw(null);
    setTurn('y');
    ctx.say(d.last ? 'I have just drawn the line in my colour. Your move.' : 'Your move.', '');

    return {
      noMoves: false,
      check() {
        if (st.over === 'you') return { solved: true, msg: 'You met the goal against perfect play.' };
        if (st.over === 'cpu') return { solved: false, msg: 'I won that one. Take back your last move and try another.' };
        return { solved: false, msg: 'The game is not over yet — it is your move.' };
      },
      hint(n) {
        const R0 = cur();
        if (st.over === 'you') return 'You have already done it!';
        if (busy) return 'Wait for my move first…';
        if (st.over === 'cpu' || !Gm.canStill(R0.m, R0.gY, R0.gC)) {
          return { text: 'From here I can stop you whatever you do: an earlier move let me in. **Take back** your last move and look for another.', show() { showTakeBack(true); } };
        }
        const x = Gm.best(R0.m, R0.gY, R0.gC);
        if (!x) return null;
        const k = moveKind(S, R0.m, x.i).kind;
        const what = { take: 'Take a box: the line marked on the board.', decline: 'Decline! Draw the marked line — it leaves boxes for me on purpose.', sacrifice: 'Give something away: the marked line.', open: 'Open the marked chain.', safe: 'Draw the marked line — it gives nothing away.' }[k];
        if (n % 2 === 0) return { text: what + ' (Ask again for the reason.)', show() { markLine(x.i); } };
        return { text: reasonFor(Gm, R0.m, R0.gY, R0.gC, x), show() { markLine(x.i); if (!chainsOn) { chainsOn = true; chainsBtn.textContent = 'Hide the chains'; drawChains(); } } };
      },
      solve() {
        clearTimeout(timer);
        clearMarks();
        if (st.over === 'you') { ctx.changed('solve'); return; }
        busy = true;
        ctx.lockUndo(true);
        // back to where you could still do it
        let R0 = cur();
        while (st.mv.length && (st.over === 'cpu' || !Gm.canStill(R0.m, R0.gY, R0.gC) || R0.turn !== 'y')) { st.mv.pop(); st.over = null; R0 = cur(); }
        st.over = null;
        draw(null);
        const step = () => {
          const R1 = cur();
          if (st.over || R1.over) { busy = false; ctx.lockUndo(false); ctx.changed('solve'); return; }
          const who = R1.turn;
          const x = who === 'y' ? Gm.best(R1.m, R1.gY, R1.gC) : Gm.cpu(R1.m, R1.gY, R1.gC);
          if (!x) { busy = false; ctx.lockUndo(false); ctx.changed('solve'); return; }
          st.mv.push([x.i, who]);
          if (who === 'y') ctx.move();
          draw([x.i]);
          setTurn(who === 'y' ? (x.c ? 'y' : 'c') : (x.c ? 'c' : 'y'));
          const R2 = cur();
          if (afterMove(R2, who, x.c, x.i)) { busy = false; ctx.lockUndo(false); ctx.changed('solve'); return; }
          timer = setTimeout(step, C.anim(who === 'y' ? 480 : 520));
        };
        ctx.say('Watch: best play from here.', 'info');
        timer = setTimeout(step, C.anim(350));
      },
      explain() { return explainOf(d); },
      getState() { return { mv: st.mv.map((x) => x.slice()), over: st.over }; },
      setState(x) {
        if (!x || !x.mv) return;
        clearTimeout(timer);
        timer = null;
        busy = false;
        ctx.lockUndo(false);
        st = { mv: x.mv.map((y) => y.slice()), over: x.over || null };
        draw(null);
        const R0 = cur();
        const ok = !st.over && Gm.canStill(R0.m, R0.gY, R0.gC);
        warned = !ok;
        setTurn(st.over ? null : 'y');
        showTakeBack(st.over === 'cpu' || (!st.over && !ok));
        if (!st.over) ctx.say(ok ? 'Your move.' : 'Your move — but from here I can stop you.', ok ? '' : 'warn');
      },
      destroy() { clearTimeout(timer); stopAnim.forEach((f) => f()); wb.handlers.board = null; }
    };
  }

  // the story of best play, for the explanation
  function explainOf(d) {
    const Gm = gameOf(d), S = Gm.S;
    let m = 0, gY = 0, gC = 0, turn = 'y', steps = 0;
    const out = [];
    let run = null;
    const flush = () => { if (run) { out.push(run.who === 'y' ? 'you ' + run.text : 'I ' + run.text); run = null; } };
    while (m !== S.full && steps++ < 80 && !Gm.secured(gY, gC) && !Gm.lost(gY, gC)) {
      const x = turn === 'y' ? Gm.best(m, gY, gC) : Gm.cpu(m, gY, gC);
      if (!x) break;
      const k = moveKind(S, m, x.i);
      if (k.kind === 'take') {
        if (run && run.who === turn && run.take != null) { run.take += x.c; run.text = 'take ' + plural(run.take, 'box', 'boxes'); }
        else { flush(); run = { who: turn, take: x.c, text: 'take ' + plural(x.c, 'box', 'boxes') }; }
      } else {
        flush();
        const t = { decline: 'decline the last ' + (openedLoop(structure(S, m)) ? 'four' : 'two') + ' boxes (double-dealing)', sacrifice: 'sacrifice a box to change the parity', open: k.hard ? 'give a two-chain by its middle line' : 'open a ' + (k.comp && k.comp.kind === 'loop' ? 'loop' : 'chain') + (k.comp ? ' of ' + k.comp.len : ''), safe: 'draw a safe line' }[k.kind];
        out.push((turn === 'y' ? 'you ' : 'I ') + t);
      }
      m |= 1 << x.i;
      if (x.c) { if (turn === 'y') gY += x.c; else gC += x.c; } else turn = turn === 'y' ? 'c' : 'y';
    }
    flush();
    const best = (Gm.B + S.value(0)) / 2;
    const y = Gm.preY + gY, c = Gm.preC + gC;
    return 'With best play on both sides: ' + out.join(', ') + '. ' + (Gm.goal.atLeast != null ? 'You collect ' + gY + ' of the ' + Gm.B + ' open boxes — the most you can force is ' + best + '.' : 'You finish ahead: ' + y + ' to ' + c + (m !== S.full ? ' already, with the rest still to play' : '') + '.') +
      '\n\nThe ideas: a **safe line** gives nothing away; when none are left, someone must open a **chain**. The player in **control** takes all but the last two boxes of each chain (all but four of a loop) and hands those back, so the other side must open the next chain. Sacrificing a box or two early can seize control.';
  }

  /* =====================================================================
   * making endgames (Endless drawers, and tools/gen/boxes.js)
   * ===================================================================== */

  // play safe lines at random until only a few are left, then clear whole
  // chains (as if won earlier) until the rest can be solved exactly
  function randomPosition(rng, rows, cols, safeLeft, maxLeft) {
    const G = geometry(rows, cols);
    const drawn = new Array(G.N).fill(false);
    const deg = (b) => G.boxLines[b].filter((l) => !drawn[l]).length;
    const isSafe = (l) => !drawn[l] && G.lineBoxes[l].every((b) => deg(b) >= 3);
    for (;;) {
      const safe = [];
      for (let l = 0; l < G.N; l++) if (isSafe(l)) safe.push(l);
      if (safe.length <= safeLeft) break;
      drawn[safe[rng.int(safe.length)]] = true;
    }
    const owner = new Array(G.boxLines.length).fill('.');
    const settle = () => G.boxLines.forEach((ls, b) => { if (owner[b] === '.' && ls.every((l) => drawn[l])) owner[b] = rng() < 0.5 ? 'y' : 'c'; });
    let guard = 0;
    while (drawn.filter((x) => !x).length > maxLeft && guard++ < 40) {
      // clear one chain or loop (or a single box) completely
      const d0 = { rows, cols, lines: drawn.map((x) => (x ? '1' : '0')).join(''), owners: owner.join('') };
      const Gx = geometry(rows, cols);
      const open = [];
      Gx.boxLines.forEach((ls, b) => { if (ls.some((l) => !drawn[l])) open.push(b); });
      if (!open.length) break;
      // grow a small group of boxes from a random one through undrawn shared lines
      const start = open[rng.int(open.length)], group = [start], want = rng.range(1, 4);
      while (group.length < want) {
        const nb = [];
        group.forEach((b) => Gx.boxLines[b].forEach((l) => { if (!drawn[l]) Gx.lineBoxes[l].forEach((x) => { if (!group.includes(x) && open.includes(x)) nb.push(x); }); }));
        if (!nb.length) break;
        group.push(nb[rng.int(nb.length)]);
      }
      group.forEach((b) => Gx.boxLines[b].forEach((l) => { drawn[l] = true; }));
      settle();
      void d0;
    }
    settle();
    if (drawn.filter((x) => !x).length > maxLeft) return null;
    return { rows, cols, lines: drawn.map((x) => (x ? '1' : '0')).join(''), owners: owner.join('') };
  }

  const SIZES = [null, [[1, 3], [2, 2], [2, 3], [3, 2]], [[2, 3], [3, 3], [2, 4], [3, 2]], [[3, 3], [3, 4], [4, 3]], [[3, 4], [4, 4], [4, 3]], [[4, 4], [4, 5], [5, 4]]];
  const MAXLEFT = [0, 9, 12, 14, 16, 18];
  function accept(a, level) {
    const f = a.feats, tricks = f.decline + f.sacrifice + f.hard;
    if (level === 1) return a.crit >= 1 && a.crit <= 5 && tricks === 0;
    if (level === 2) return a.hard >= 1 && a.crit >= 2 && tricks <= 1;
    if (level === 3) return tricks >= 1 && a.hard >= 2;
    if (level === 4) return tricks >= 2 && a.hard >= 2;
    return tricks >= 2 && a.hard >= 3 && (f.sacrifice >= 1 || f.loop >= 1 || f.decline >= 2);
  }
  // choose the goal: the most you can force, or a win made tight by the boxes already won
  function setGoal(rng, pos, level) {
    const S = solverFor(pos);
    const V = S.value(0), B = S.openBoxes.length;
    const preIdx = [];
    pos.owners.split('').forEach((o, b) => { if (o !== '.') preIdx.push(b); });
    const P = preIdx.length;
    const best = (B + V) / 2;
    if (best < 1) return null;
    if (best * 2 >= B && (level >= 3 ? rng() < 0.7 : rng() < 0.25)) {
      if (best === B && B > 2) return null; // taking everything is too easy a goal to state
      return Object.assign({}, pos, { goal: { atLeast: best } });
    }
    const k = Math.ceil((1 + P - V) / 2);
    if (k > P) return best * 2 >= B ? Object.assign({}, pos, { goal: { atLeast: best } }) : null;
    const kk = Math.max(0, k);
    const pick = rng.shuffle(preIdx.slice()).slice(0, kk);
    const own = pos.owners.split('').map((o, b) => (o === '.' ? '.' : pick.includes(b) ? 'y' : 'c')).join('');
    return Object.assign({}, pos, { owners: own, goal: { win: true } });
  }
  function makeGame(rng, level, tries) {
    for (let t = 0; t < (tries || 14); t++) {
      const sz = rng.pick(SIZES[level]);
      const pos = randomPosition(rng, sz[0], sz[1], rng.range(0, level >= 3 ? 3 : 2), MAXLEFT[level]);
      if (!pos) continue;
      const S = solverFor(pos);
      if (S.n < 4 || S.openBoxes.length < 2) continue;
      const d = setGoal(rng, pos, level);
      if (!d) continue;
      const a = analyse(d);
      if (!a || !accept(a, level)) continue;
      return { d, a };
    }
    return null;
  }
  function gameText(d) {
    const Gm = gameOf(d);
    const won = !Gm.preY && !Gm.preC ? '' : !Gm.preY ? ' So far I have won **' + plural(Gm.preC, 'box', 'boxes') + '** and you none.' : !Gm.preC ? ' So far you have won **' + plural(Gm.preY, 'box', 'boxes') + '** and I none.' : ' So far you have won **' + plural(Gm.preY, 'box', 'boxes') + '** and I have **' + Gm.preC + '**.';
    const goal = d.goal.atLeast != null ? 'Take at least **' + d.goal.atLeast + '** of the ' + Gm.B + ' boxes still open' : 'Finish with more boxes than me';
    return 'A game of dots and boxes on a ' + d.rows + ' × ' + d.cols + ' board is nearly over, and it is your move.' + won + ' ' + goal + ' — against perfect play.';
  }
  function gameTitle(d) {
    const Gm = gameOf(d);
    return d.goal.atLeast != null ? 'Take ' + d.goal.atLeast + ' of ' + Gm.B : (Gm.preC > Gm.preY ? 'Come from Behind' : Gm.preY > Gm.preC ? 'Hold the Lead' : 'Win the ' + d.rows + ' × ' + d.cols);
  }

  /* =====================================================================
   * checking a position
   * ===================================================================== */

  function verify(p) {
    const d = p.data;
    if (!d || !Number.isInteger(d.rows) || !Number.isInteger(d.cols) || d.rows < 1 || d.cols < 1 || d.rows > 7 || d.cols > 7) return { ok: false, err: 'rows and cols must be 1..7' };
    const G = geometry(d.rows, d.cols);
    if (typeof d.lines !== 'string' || d.lines.length !== G.N || /[^01]/.test(d.lines)) return { ok: false, err: 'lines must be ' + G.N + ' characters of 0 and 1' };
    if (typeof d.owners !== 'string' || d.owners.length !== d.rows * d.cols || /[^.yc]/.test(d.owners)) return { ok: false, err: 'owners must be ' + d.rows * d.cols + ' characters of . y c' };
    const drawn = d.lines.split('').map((c) => c === '1');
    for (let b = 0; b < G.boxLines.length; b++) {
      const full = G.boxLines[b].every((l) => drawn[l]);
      if (full !== (d.owners[b] !== '.')) return { ok: false, err: 'box ' + b + (full ? ' is complete but has no owner' : ' has an owner but is not complete') };
    }
    const left = drawn.filter((x) => !x).length;
    if (!left) return { ok: false, err: 'the game is already over' };
    if (left > 22) return { ok: false, err: 'too many lines left to solve exactly (' + left + ' > 22)' };
    if (!d.goal || (d.goal.win !== true && !Number.isInteger(d.goal.atLeast))) return { ok: false, err: 'goal must be { win: true } or { atLeast: n }' };
    if (d.last && (!Array.isArray(d.last) || d.last.some((l) => !drawn[l]))) return { ok: false, err: 'last must list drawn lines' };
    const Gm = gameOf(d), S = Gm.S;
    if (d.goal.atLeast != null && (d.goal.atLeast < 1 || d.goal.atLeast > Gm.B)) return { ok: false, err: 'atLeast must be 1..' + Gm.B };
    if (Gm.secured(0, 0)) return { ok: false, err: 'the goal is met before a line is drawn' };
    if (S.value(0) < Gm.need(0, 0)) return { ok: false, err: 'the goal cannot be forced: best is ' + (Gm.B + S.value(0)) / 2 + ' of ' + Gm.B };
    if (d.best != null && d.best !== (Gm.B + S.value(0)) / 2) return { ok: false, err: 'best is ' + (Gm.B + S.value(0)) / 2 + ', not ' + d.best };
    const keep = Gm.keeping(0, 0, 0).length, all = S.moves(0).length;
    return keep === all ? { ok: true, warn: 'every first move keeps the goal' } : { ok: true };
  }

  C.engine({
    id: 'boxes',
    name: 'Dots and boxes',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    movesLabel: 'Lines',
    about: '**Click between two dots** to draw a line — point first and the line shows faintly. Complete the fourth side of a box and it is yours, and you **move again**. After your turn the computer answers, and it never makes a mistake: let it in and it will make you pay — but **Take back** (or Undo) is always there. **Show the chains** outlines chains and loops of boxes. Hints give the best line first, then the reason: safe lines, chains, control and double-dealing.',
    stateVersion: 1,

    generate(rng, level) {
      const g = makeGame(rng, level, level >= 5 ? 40 : level === 4 ? 30 : 16);
      if (!g) return null;
      return { title: gameTitle(g.d), text: gameText(g.d), diff: level, data: g.d };
    },

    verify,
    mount(ctx, p) { return mountGame(ctx, p); },

    thumb(p) {
      const d = p.data, G = geometry(d.rows, d.cols), q = 30;
      let s = '<svg viewBox="' + (-12) + ' ' + (-12) + ' ' + (d.cols * q + 24) + ' ' + (d.rows * q + 24) + '" preserveAspectRatio="xMidYMid meet"><rect x="-12" y="-12" width="' + (d.cols * q + 24) + '" height="' + (d.rows * q + 24) + '" rx="6" fill="#fbf7ea"/>';
      String(d.owners).split('').forEach((o, b) => {
        if (o === '.') return;
        const r = Math.floor(b / d.cols), c = b % d.cols;
        s += '<rect x="' + (c * q + 3) + '" y="' + (r * q + 3) + '" width="' + (q - 6) + '" height="' + (q - 6) + '" rx="3" fill="' + (o === 'y' ? '#b9c0f5' : '#f3bdd6') + '"/>';
      });
      d.lines.split('').forEach((ch, i) => {
        if (ch !== '1') return;
        const [a, b] = G.ends[i];
        s += '<line x1="' + a[0] * q + '" y1="' + a[1] * q + '" x2="' + b[0] * q + '" y2="' + b[1] * q + '" stroke="#5d6177" stroke-width="3.2" stroke-linecap="round"/>';
      });
      for (let r = 0; r <= d.rows; r++) for (let c = 0; c <= d.cols; c++) s += '<circle cx="' + c * q + '" cy="' + r * q + '" r="3.3" fill="#2a2c3a"/>';
      return s + '</svg>';
    }
  });

  C.boxesLib = { geometry, parse, solverFor, structure, moveKind, gameOf, analyse, explainOf, reasonFor, randomPosition, setGoal, makeGame, accept, gameText, gameTitle, verify };

  C.css('boxes', `
    .bx-paper { fill: #fbf7ea; stroke: #cfc4a6; stroke-width: 2; filter: drop-shadow(0 6px 10px rgba(0,0,0,.28)); }
    .bx-grid line { stroke: #bcd3ea; stroke-width: 1; opacity: .55; }
    .bx-dot { fill: #2a2c3a; pointer-events: none; }
    .bx-l { stroke-linecap: round; stroke-width: 11; pointer-events: none; }
    .bx-l.off { stroke: transparent; }
    .bx-l.pre { stroke: #6a6e82; }
    .bx-l.you { stroke: #4f5fe6; }
    .bx-l.me { stroke: #d24c8e; }
    .bx-l.last { animation: bxglow 1.1s ease-in-out 3; }
    @keyframes bxglow { 50% { stroke-width: 17; } }
    .bx-ghost { stroke: #c48600; stroke-width: 11; stroke-linecap: round; stroke-dasharray: 3 16; opacity: .9; pointer-events: none; }
    .bx-box rect { fill: transparent; transition: fill .25s; }
    .bx-box.you rect { fill: rgba(79,95,230,.24); }
    .bx-box.me rect { fill: rgba(210,76,142,.24); }
    .bx-box.pre rect { opacity: .75; }
    .bx-box text { font: 800 21px "Segoe UI", system-ui, sans-serif; letter-spacing: .06em; pointer-events: none; }
    .bx-box.you text { fill: #3a47b8; } .bx-box.me text { fill: #a8306b; }
    .bx-box.pop { animation: bxpop .45s ease-out; transform-box: fill-box; transform-origin: center; }
    @keyframes bxpop { 0% { opacity: .2; } 40% { opacity: 1; } }
    .bx-mark { stroke: #c48600; stroke-width: 15; stroke-linecap: round; stroke-dasharray: 4 14; fill: none; animation: bxblink 1s ease-in-out infinite; pointer-events: none; }
    @keyframes bxblink { 50% { opacity: .3; } }
    .bx-chain path { fill: none; stroke-width: 26; stroke-linecap: round; stroke-linejoin: round; opacity: .28; pointer-events: none; }
    .bx-chain.chain path { stroke: #0d948f; } .bx-chain.chain.long path { stroke: #c48600; } .bx-chain.loop path { stroke: #7d52d6; }
    .bx-chain circle { fill: #0d948f; opacity: .9; pointer-events: none; }
    .bx-chain.long circle { fill: #c48600; } .bx-chain.loop circle { fill: #7d52d6; } .bx-chain.tangle circle { fill: #8d8577; opacity: .35; }
    .bx-chain text { font: 800 16px "Segoe UI", system-ui, sans-serif; fill: #fff; pointer-events: none; }
    .bx-pill rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 2; }
    .bx-pill text { font: 700 24px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .bx-pill-dot { fill: #4f5fe6; }
    .bx-pill.c .bx-pill-dot { fill: #d24c8e; animation: bxblink .7s ease-in-out infinite; }
    .bx-pill.won rect { fill: var(--green); stroke: var(--green); } .bx-pill.won text { fill: #0b2a1a; } .bx-pill.won .bx-pill-dot { fill: #fff; }
    .bx-pill.lost rect { stroke: var(--pink); } .bx-pill.lost .bx-pill-dot { fill: var(--pink); }
    .bx-score { font: 700 21px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
