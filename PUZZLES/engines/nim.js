/* The Puzzle Cabinet · engines/nim.js
 *
 * Games to win. Two players move in turn; you move first, from a position
 * that is a win for the player to move — and the computer answers every move
 * perfectly. Blunder into a losing position and it will win (Undo is kind).
 *
 * All of these are *impartial* games: both players have the same moves. By
 * the Sprague–Grundy theorem every position is worth a Nim heap (its Grundy
 * number), and a sum of games is won by making the nim-sum of those numbers
 * zero. The solvers below use exactly that (and a plain game search where the
 * last player to move LOSES, which breaks the theory).
 *
 * data: {
 *   game: 'nim' | 'take' | 'wythoff' | 'kayles' | 'northcott' | 'grundy',
 *   heaps: [3, 4, 5]          nim, take, grundy: the heaps
 *   max: 3                    nim: take at most this many at a time
 *   sub: [1, 3, 4]            take: the amounts one may take
 *   misere: true              whoever makes the last move LOSES
 *   look: 'matches' | 'stones'
 *   a, b                      wythoff: the two heaps (the queen's column and row)
 *   pins: '1011111111111'     kayles: standing (1) and fallen (0) skittles
 *   width: 8, w: [..], b: [..]   northcott: board width; your (white) and my (black) column in each row
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* =====================================================================
   * Grundy numbers
   * ===================================================================== */

  function mex(set) { let g = 0; while (set.has(g)) g++; return g; }

  const KG = [0]; // Kayles: a row of n skittles
  function kayles(n) {
    while (KG.length <= n) {
      const m = KG.length, set = new Set();
      for (let a = 0; a <= m - 1; a++) set.add(KG[a] ^ KG[m - 1 - a]);
      for (let a = 0; a <= m - 2; a++) set.add(KG[a] ^ KG[m - 2 - a]);
      KG.push(mex(set));
    }
    return KG[n];
  }

  const GG = [0, 0, 0]; // Grundy's game: a heap of n split into two unequal heaps
  function grundyHeap(n) {
    while (GG.length <= n) {
      const m = GG.length, set = new Set();
      for (let a = 1; a < m - a; a++) set.add(GG[a] ^ GG[m - a]);
      GG.push(mex(set));
    }
    return GG[n];
  }

  const subCache = {};
  function subG(sub, n) { // a subtraction game with the amounts in sub
    const k = sub.join(',');
    const T = subCache[k] || (subCache[k] = [0]);
    while (T.length <= n) {
      const m = T.length, set = new Set();
      sub.forEach((t) => { if (t <= m) set.add(T[m - t]); });
      T.push(mex(set));
    }
    return T[n];
  }

  function heapG(d, h) {
    if (d.sub) return subG(d.sub, h);
    if (d.max) return h % (d.max + 1);
    return h;
  }

  const PHI = (1 + Math.sqrt(5)) / 2;
  function cold(a, b) { // Wythoff: a P-position (the player to move loses)
    if (a > b) { const t = a; a = b; b = t; }
    const k = b - a;
    return a === Math.floor(k * PHI);
  }

  /* =====================================================================
   * the games: moves (m = what the user did, s = the position after)
   * ===================================================================== */

  function takeable(d, h) {
    if (d.sub) return d.sub.filter((t) => t <= h);
    const mx = d.max ? Math.min(d.max, h) : h;
    const out = [];
    for (let t = 1; t <= mx; t++) out.push(t);
    return out;
  }

  function segments(pins) {
    const out = [];
    let run = 0;
    for (let i = 0; i <= pins.length; i++) {
      if (i < pins.length && pins[i]) run++;
      else { if (run) out.push(run); run = 0; }
    }
    return out;
  }

  const HEAPS = {
    init: (d) => d.heaps.slice(),
    moves(s, d) {
      const out = [];
      s.forEach((h, i) => takeable(d, h).forEach((t) => { const s2 = s.slice(); s2[i] = h - t; out.push({ m: { h: i, t }, s: s2 }); }));
      return out;
    },
    key: (s) => s.slice().sort((a, b) => a - b).join(','),
    grundy: (s, d) => s.reduce((x, h) => x ^ heapG(d, h), 0),
    size: (s) => s.reduce((a, b) => a + b, 0)
  };

  const GAMES = {
    nim: HEAPS,
    take: HEAPS,
    wythoff: {
      init: (d) => [d.a, d.b],
      moves(s) {
        const a = s[0], b = s[1], out = [];
        for (let t = 1; t <= a; t++) out.push({ m: { a: a - t, b }, s: [a - t, b] });
        for (let t = 1; t <= b; t++) out.push({ m: { a, b: b - t }, s: [a, b - t] });
        for (let t = 1; t <= Math.min(a, b); t++) out.push({ m: { a: a - t, b: b - t }, s: [a - t, b - t] });
        return out;
      },
      key: (s) => s[0] + ',' + s[1],
      win: (s) => !cold(s[0], s[1]),
      size: (s) => s[0] + s[1]
    },
    kayles: {
      init: (d) => d.pins.split('').map(Number),
      moves(s) {
        const out = [];
        for (let i = 0; i < s.length; i++) {
          if (!s[i]) continue;
          const s1 = s.slice(); s1[i] = 0;
          out.push({ m: { i, n: 1 }, s: s1 });
          if (s[i + 1]) { const s2 = s1.slice(); s2[i + 1] = 0; out.push({ m: { i, n: 2 }, s: s2 }); }
        }
        return out;
      },
      key: (s) => segments(s).sort((a, b) => a - b).join(','),
      grundy: (s) => segments(s).reduce((x, n) => x ^ kayles(n), 0),
      size: (s) => s.reduce((a, b) => a + b, 0)
    },
    grundy: {
      init: (d) => d.heaps.slice(),
      moves(s) {
        const out = [];
        s.forEach((h, i) => {
          for (let a = 1; a < h; a++) {
            if (a === h - a) continue;
            out.push({ m: { h: i, a }, s: s.slice(0, i).concat([a, h - a], s.slice(i + 1)) });
          }
        });
        return out;
      },
      key: (s) => s.filter((h) => h > 2).sort((a, b) => a - b).join(','),
      grundy: (s) => s.reduce((x, h) => x ^ grundyHeap(h), 0),
      size: (s) => s.reduce((a, h) => a + Math.max(0, h - 2), 0)
    },
    northcott: {
      // s = { w: [cols], b: [cols] }; you are white (moving right), I am black (moving left)
      init: (d) => ({ w: d.w.slice(), b: d.b.slice() }),
      moves(s, d, side) {
        const out = [];
        const W = d.width;
        s.w.forEach((wc, r) => {
          const bc = s.b[r];
          if (side === 'b') {
            for (let c = wc + 1; c < W; c++) {
              if (c === bc) continue;
              const b2 = s.b.slice(); b2[r] = c;
              out.push({ m: { r, side: 'b', to: c, back: c > bc }, s: { w: s.w.slice(), b: b2 } });
            }
          } else {
            for (let c = 0; c < bc; c++) {
              if (c === wc) continue;
              const w2 = s.w.slice(); w2[r] = c;
              out.push({ m: { r, side: 'w', to: c, back: c < wc }, s: { w: w2, b: s.b.slice() } });
            }
          }
        });
        return out;
      },
      forward(s, d, side) { return this.moves(s, d, side).filter((x) => !x.m.back); },
      key: (s) => s.w.map((w, r) => s.b[r] - w - 1).sort((a, b) => a - b).join(','),
      grundy: (s) => s.w.reduce((x, w, r) => x ^ (s.b[r] - w - 1), 0),
      terminal: (s) => s.w.every((w, r) => s.b[r] - w - 1 === 0),
      size: (s) => s.w.reduce((a, w, r) => a + s.b[r] - w - 1, 0)
    }
  };

  function gaps(s) { return s.w.map((w, r) => s.b[r] - w - 1); }

  /* =====================================================================
   * the solver
   * ===================================================================== */

  const solvers = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function solverFor(d) {
    let S = solvers && solvers.get(d);
    if (S) return S;
    const game = GAMES[d.game];
    const memo = new Map();
    // the moves that count for the analysis (Northcott: retreats are never needed)
    const amoves = (s, side) => (game.forward ? game.forward(s, d, side || 'w') : game.moves(s, d, side || 'w'));
    const terminal = (s) => (game.terminal ? game.terminal(s, d) : !game.moves(s, d, 'w').length);
    function win(s) { // does the player to move win?
      if (!d.misere) {
        if (game.win) return game.win(s, d);
        if (game.grundy) return game.grundy(s, d) !== 0;
      }
      const k = game.key(s, d);
      let r = memo.get(k);
      if (r !== undefined) return r;
      if (terminal(s)) r = !!d.misere;
      else {
        r = false;
        for (const x of amoves(s)) if (!win(x.s)) { r = true; break; }
      }
      memo.set(k, r);
      return r;
    }
    function winningMoves(s, side) { return amoves(s, side).filter((x) => !win(x.s) || (terminal(x.s) && !d.misere)); }
    S = { game, win, winningMoves, amoves, terminal, memo };
    if (solvers) solvers.set(d, S);
    return S;
  }

  // how long a perfect game lasts from s (both sides perfect; the loser resists), bounded
  function gameLength(d, s, limit) {
    const S = solverFor(d);
    let n = 0, side = 'w';
    let cur = s;
    while (!S.terminal(cur) && n < (limit || 400)) {
      const ms = S.amoves(cur, side);
      let pick;
      if (S.win(cur)) pick = ms.find((x) => !S.win(x.s));
      else pick = ms.reduce((b, x) => (!b || S.game.size(x.s, d) > S.game.size(b.s, d) ? x : b), null);
      if (!pick) break;
      cur = pick.s;
      side = side === 'w' ? 'b' : 'w';
      n++;
    }
    return n;
  }

  /* =====================================================================
   * words
   * ===================================================================== */

  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  const ord = (i) => ORD[i] || (i + 1) + 'th';
  function itemWord(d, n) {
    if (d.game === 'nim') return n === 1 ? 'match' : 'matches';
    return n === 1 ? 'counter' : 'counters';
  }
  function heapWord(d) { return d.game === 'nim' ? 'row' : 'heap'; }

  function describe(d, m, s, who) {
    const I = who === 'cpu' ? 'I ' : '';
    switch (d.game) {
      case 'nim':
      case 'take': {
        const one = s.length === 1;
        const where = one ? '' : ' from the ' + ord(m.h) + ' ' + heapWord(d) + ' (of ' + s[m.h] + ')';
        return (who === 'cpu' ? 'I took ' : 'Take ') + m.t + ' ' + itemWord(d, m.t) + where + '.';
      }
      case 'wythoff': {
        const da = s[0] - m.a, db = s[1] - m.b;
        const what = da && db ? 'diagonally, ' + da + ' square' + (da > 1 ? 's' : '') + ' toward the corner (' + da + ' from both heaps)' : da ? da + ' square' + (da > 1 ? 's' : '') + ' left (' + da + ' from the first heap)' : db + ' square' + (db > 1 ? 's' : '') + ' down (' + db + ' from the second heap)';
        return (who === 'cpu' ? 'I moved the queen ' : 'Move the queen ') + what + ', to column ' + m.a + ', row ' + m.b + '.';
      }
      case 'kayles':
        return (who === 'cpu' ? 'I knocked down ' : 'Knock down ') + (m.n === 1 ? 'skittle ' + (m.i + 1) : 'skittles ' + (m.i + 1) + ' and ' + (m.i + 2)) + '.';
      case 'grundy': {
        const h = s[m.h];
        return (who === 'cpu' ? 'I split ' : 'Split ') + 'the heap of ' + h + ' into ' + m.a + ' and ' + (h - m.a) + '.';
      }
      case 'northcott': {
        const g0 = s.b[m.r] - s.w[m.r] - 1;
        const g1 = m.side === 'w' ? s.b[m.r] - m.to - 1 : m.to - s.w[m.r] - 1;
        const dir = m.back ? 'back ' : '';
        return (who === 'cpu' ? 'I moved my checker in row ' + (m.r + 1) + ' ' + dir : 'Move your checker in row ' + (m.r + 1) + ' ' + dir) + 'to column ' + (m.to + 1) + ' (the gap goes from ' + g0 + ' to ' + g1 + ').';
      }
      default: return I;
    }
  }

  function bin(n, w) { return n.toString(2).padStart(w, '0'); }
  function binTable(rows, total) {
    // rows: [[label, value]]; total label
    const w = Math.max(1, ...rows.map((r) => r[1].toString(2).length));
    const lw = Math.max(...rows.map((r) => String(r[0]).length), 4);
    let x = 0;
    let t = '<span class="nm-bin">';
    rows.forEach((r) => { x ^= r[1]; t += String(r[0]).padStart(lw, ' ') + '  ' + bin(r[1], w) + '<br>'; });
    t += '<span class="nm-sum">' + (total || '⊕').padStart(lw, ' ') + '  ' + bin(x, w) + '</span></span>';
    return { html: t, x };
  }

  // why the recommended move wins (the "reason" hint), for position s where the user is to move
  function reason(d, s, mv) {
    const S = solverFor(d);
    switch (d.game) {
      case 'nim':
      case 'take': {
        if (d.game === 'take' && s.length === 1) {
          const safe = [];
          for (let n = 0; n <= s[0]; n++) if (!(d.misere ? S.win([n]) : subG(d.sub, n) !== 0)) safe.push(n);
          const show = safe.length > 12 ? safe.slice(0, 5).concat(['…']).concat(safe.slice(-5)) : safe;
          return 'Work backwards from the end. The numbers you want to leave me — from which every move I make lets you back onto one — are **' + show.join(', ') + '**. ' +
            (mv ? 'You have ' + s[0] + ': take ' + mv.m.t + ' to leave ' + mv.s[0] + '.' : '');
        }
        if (d.misere) {
          const big = s.filter((h) => h > 1).length;
          if (d.game === 'nim' && !d.max && big) {
            const T = binTable(s.map((h, i) => ['row ' + (i + 1), h]), 'sum');
            return 'The last-match-loses rule changes only the very end. Play as in ordinary Nim — leave me a nim-sum of 0 (write the rows in binary and add each column without carrying) — **until** your move would leave only rows of a single match. Then leave an **odd** number of them, so I must take the last. ' +
              (big === 1 ? 'Now only one row has more than one match: that moment has come. ' : '') + '<br>' + T.html + (mv ? '<br>' + describe(d, mv.m, s, 'you') : '');
          }
          return 'With the last-move-loses rule there is no neat formula: work backwards from the positions near the end, marking each one “win” or “lose” for the player to move. ' + (mv ? describe(d, mv.m, s, 'you') + ' leaves me a losing position.' : '');
        }
        if (d.game === 'nim' && !d.max) {
          const T = binTable(s.map((h, i) => ['row ' + (i + 1), h]), 'sum');
          return 'Write each row in binary and add every column **without carrying** (an odd number of 1s gives 1): the **nim-sum**. It is ' + T.x + ', not 0, so the player to move can win — by making it 0. Whatever I do then breaks the zero again. (Bouton, 1901.)<br>' + T.html + (mv ? '<br>' + describe(d, mv.m, s, 'you').replace(/\.$/, '') + ': the sum becomes 0.' : '');
        }
        const gs = s.map((h) => heapG(d, h));
        const T = binTable(gs.map((g, i) => [heapWord(d) + ' ' + (i + 1), g]), 'sum');
        const rule = d.max ? 'With at most ' + d.max + ' at a time, a ' + heapWord(d) + ' of n is worth a Nim heap of n mod ' + (d.max + 1) + ' (its remainder after dividing by ' + (d.max + 1) + ').' :
          'Each heap is worth a Nim heap of its **Grundy number**: 0 for an empty heap, and otherwise the smallest number not among the values of the heaps you can reach (the “mex”). For taking ' + listOr(d.sub) + ' they go: ' + seq((n) => subG(d.sub, n), 16) + '.';
        return rule + ' Add those values by nim-sum; leave me 0.<br>' + T.html + (mv ? '<br>' + describe(d, mv.m, s, 'you') : '');
      }
      case 'wythoff': {
        const list = [];
        for (let k = 0; list.length < 8; k++) { const a = Math.floor(k * PHI); list.push('(' + a + ', ' + (a + k) + ')'); }
        return 'The **safe squares** — lose-for-the-player-to-move — are (0, 0), then pairs found by working backwards: ' + list.join(', ') + ' … and their mirror images. The n-th pair is (⌊nφ⌋, ⌊nφ⌋ + n), where φ = 1.618… is the golden ratio: each row and each column holds exactly one safe square, and so does each diagonal. Move the queen onto one and I can never reach another. The blue dots on the board mark them.';
      }
      case 'kayles': {
        const seg = segments(s);
        if (seg.length === 1 && seg[0] === s.length && s.length > 2) {
          return '**Symmetry.** Knock down the middle skittle (odd row) or the middle two (even row): that leaves two equal rows. From then on, copy each of my moves in the other row — you can never run out of moves before me.';
        }
        const T = binTable(seg.map((n) => ['row of ' + n, kayles(n)]), 'sum');
        return 'Separate groups of skittles are separate games. Each group of n is worth a Nim heap of its Grundy number: ' + seq(kayles, 13) + ' for n = 0, 1, 2 … (they repeat with period 12 from n = 71 on). Leave me a nim-sum of 0.<br>' + T.html + (mv ? '<br>' + describe(d, mv.m, s, 'you') : '');
      }
      case 'northcott': {
        const gs = gaps(s);
        const T = binTable(gs.map((g, r) => ['row ' + (r + 1), g]), 'sum');
        return 'Only the **gaps** between the checkers matter: each gap is a Nim heap, and moving forward takes from it. Moving *back* adds to a gap — but it never helps, because the other player simply follows by the same amount. So play Nim with the gaps: leave me a nim-sum of 0.<br>' + T.html + (mv ? '<br>' + describe(d, mv.m, s, 'you') : '');
      }
      case 'grundy': {
        const live = s.filter((h) => h > 2);
        const T = binTable(live.map((h) => ['heap ' + h, grundyHeap(h)]), 'sum');
        return 'Heaps of 1 and 2 are dead (they cannot be split). Every other heap is worth a Nim heap of its **Grundy number** — for heaps of 1, 2, 3 … they go ' + seq((n) => grundyHeap(n), 16, 1) + '. Split so that the nim-sum of the heaps becomes 0.<br>' + T.html + (mv ? '<br>' + describe(d, mv.m, s, 'you') : '');
      }
      default: return '';
    }
  }
  function seq(f, n, from) { const out = []; for (let i = from || 0; i < n + (from || 0); i++) out.push(f(i)); return out.join(', ') + ' …'; }
  function listOr(a) { return a.length === 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]; }

  function rulesLine(d) {
    const last = d.misere ? 'whoever makes the last move **loses**' : 'whoever makes the last move **wins**';
    switch (d.game) {
      case 'nim': return 'Take ' + (d.max ? '1 to ' + d.max : 'any number of') + ' matches from one row; ' + (d.misere ? 'whoever takes the last match **loses**.' : 'whoever takes the last match **wins**.');
      case 'take': return 'Take ' + listOr(d.sub) + ' ' + (d.heaps.length > 1 ? 'from one heap' : 'counters') + '; ' + (d.misere ? 'whoever takes the last counter **loses**.' : 'whoever takes the last counter **wins**.') + (d.sub.indexOf(1) < 0 ? ' If you cannot move, you lose.' : '');
      case 'wythoff': return 'Move the queen left, down, or diagonally down-left, any distance; whoever reaches the corner **wins**.';
      case 'kayles': return 'Knock down one skittle or two standing side by side; ' + (d.misere ? 'whoever knocks down the last one **loses**.' : 'whoever knocks down the last one **wins**.');
      case 'northcott': return 'Slide one of your checkers along its row, forward or back, but never over mine; whoever cannot move **loses**.';
      case 'grundy': return 'Split one heap into two heaps of different sizes; whoever cannot move **loses**.';
      default: return last;
    }
  }

  C.nimGames = { GAMES, solverFor, kayles, grundyHeap, subG, heapG, cold, segments, gameLength, reason, describe, rulesLine, gaps, PHI };

  const KEYS = { nim: ['h', 't'], take: ['h', 't'], wythoff: ['a', 'b'], kayles: ['i', 'n'], grundy: ['h', 'a'], northcott: ['r', 'to'] };
  function sameMove(g, a, b) { return !!a && !!b && KEYS[g].every((k) => a[k] === b[k]); }
  const sameArr = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);

  const WIN_TEXT = {
    nim: 'You took the last match — you win!',
    take: 'You took the last counter — you win!',
    wythoff: 'Your queen reached the corner — you win!',
    kayles: 'You knocked down the last skittle — you win!',
    northcott: 'My checkers are hemmed in (running back would only put off the end) — you win!',
    grundy: 'No heap can be split any more, and it is my turn — you win!'
  };
  const LOSE_TEXT = {
    nim: 'I took the last match — I win this time.',
    take: 'I took the last counter — I win this time.',
    wythoff: 'My move reached the corner — I win this time.',
    kayles: 'I knocked down the last skittle — I win this time.',
    northcott: 'Your checkers are hemmed in — I win this time.',
    grundy: 'No heap can be split any more, and it is your turn — I win this time.'
  };

  /* =====================================================================
   * the table: you against the computer
   * ===================================================================== */

  function mountGame(ctx, p) {
    const d = p.data, wb = ctx.wb, S = solverFor(d), game = S.game;
    let st = { s: game.init(d), over: null, hist: [], back: 0 };
    let busy = false, timer = null, warned = false, lastUser = null, lastCpu = null, downM = null;

    const layer = wb.layer('board'), top = wb.layer('top');
    const g0 = ctx.s('g', { class: 'nm-board nm-' + d.game }, layer);
    const hitBg = ctx.s('rect', { class: 'nm-hit' }, g0);
    const V = VIEWS[d.game](ctx, d, g0, top);
    const box = V.box;
    hitBg.setAttribute('x', box.x0); hitBg.setAttribute('y', box.y0);
    hitBg.setAttribute('width', box.x1 - box.x0); hitBg.setAttribute('height', box.y1 - box.y0);
    // who is to move
    const pill = ctx.s('g', { class: 'nm-pill' }, g0);
    const pillR = ctx.s('rect', { x: box.x0, y: box.y0 - 70, width: 250, height: 46, rx: 23 }, pill);
    ctx.s('circle', { cx: box.x0 + 26, cy: box.y0 - 47, r: 9, class: 'nm-pill-dot' }, pill);
    const pillT = ctx.s('text', { x: box.x0 + 46, y: box.y0 - 46, 'dominant-baseline': 'central' }, pill);
    wb.setBounds({ x0: box.x0 - 20, y0: box.y0 - 90, x1: box.x1 + 20, y1: box.y1 + 20 }, 0.06);

    if (!p.goal) ctx.setGoal(rulesLine(d) + ' You move first — win the game.');
    const takeBack = ctx.button('Take back my last move', () => { const pl = C.currentPlayer && C.currentPlayer(); if (pl) pl.undo(); }, 'small');
    takeBack.hidden = true;

    function setTurn(who) {
      pill.setAttribute('class', 'nm-pill ' + (who || (st.over === 'you' ? 'won' : 'lost')));
      pillT.textContent = who === 'you' ? 'Your move' : who === 'cpu' ? 'My move…' : st.over === 'you' ? 'You won!' : 'I won';
      pillR.setAttribute('width', who === 'cpu' ? 210 : 230);
    }
    function showTakeBack(on) { takeBack.hidden = !on; }

    function bestMove(s) {
      const good = S.winningMoves(s, 'w');
      if (!good.length) return null;
      if (d.game === 'northcott' && lastCpu && lastCpu.back) { const f = good.find((x) => x.m.r === lastCpu.r); if (f) return f; }
      if (d.game === 'kayles') { const f = good.find((x) => { const sg = segments(x.s); return sg.length === 2 && sg[0] === sg[1] && segments(s).length === 1; }); if (f) return f; }
      return good[0];
    }

    function chooseCpu() {
      const s = st.s;
      const all = game.moves(s, d, 'b');
      const fwd = game.forward ? all.filter((x) => !x.m.back) : all;
      const good = fwd.filter((x) => !S.win(x.s));
      if (good.length) {
        if (d.game === 'northcott' && lastUser && lastUser.back) { const f = good.find((x) => x.m.r === lastUser.r); if (f) return f; }
        return good.reduce((b, x) => (game.size(x.s, d) < game.size(b.s, d) ? x : b), good[0]);
      }
      // a lost position: resist — leave you as few winning replies as possible, and the longest game
      if (d.game === 'northcott' && st.back < 2 && st.hist.length % 2 === 1) {
        const r = all.filter((x) => x.m.back && x.m.to === s.b[x.m.r] + 1);
        if (r.length) return r[st.hist.length % r.length];
      }
      let best = null, bs = Infinity;
      fwd.forEach((x) => {
        const wins = S.amoves(x.s, 'w').filter((y) => !S.win(y.s)).length;
        const sc = wins * 100000 - game.size(x.s, d);
        if (sc < bs) { bs = sc; best = x; }
      });
      return best || all[0];
    }

    function finish(who, prefix) {
      st.over = who;
      setTurn(null);
      if (who === 'you') ctx.say((prefix ? prefix + ' ' : '') + (d.misere ? 'I had to make the last move — you win!' : WIN_TEXT[d.game]), 'good');
      else {
        ctx.say((prefix ? prefix + ' ' : '') + (d.misere ? 'You had to make the last move — I win this time.' : LOSE_TEXT[d.game]) + ' **Take back** your move and try another.', 'warn');
        showTakeBack(true);
      }
    }

    function userMove(m) {
      if (busy || st.over) return;
      const x = game.moves(st.s, d, 'w').find((y) => sameMove(d.game, y.m, m));
      if (!x) return;
      st.hist.push(C.clone(st.s));
      const from = st.s;
      st.s = x.s;
      lastUser = x.m;
      if (x.m.back) ctx.toast('A retreat — it only makes the gap bigger…');
      V.clearMarks();
      V.draw(st.s, { m: x.m, who: 'you', from });
      ctx.sfx('tap');
      ctx.move();
      if (S.terminal(st.s)) { finish(d.misere ? 'cpu' : 'you'); ctx.changed('move'); return; }
      if (S.win(st.s) && !warned) { warned = true; ctx.toast('Hmm… that move lets me in. (Undo is right there.)'); }
      busy = true;
      setTurn('cpu');
      ctx.say('Thinking…', 'info');
      timer = setTimeout(cpuTurn, C.anim(700));
    }

    function cpuTurn() {
      timer = null;
      const x = chooseCpu();
      if (!x) { busy = false; return; }
      const from = st.s;
      st.s = x.s;
      if (x.m.back) st.back++;
      lastCpu = x.m;
      V.draw(st.s, { m: x.m, who: 'cpu', from });
      ctx.sfx('snap');
      busy = false;
      const msg = describe(d, x.m, from, 'cpu');
      if (S.terminal(st.s)) finish(d.misere ? 'you' : 'cpu', msg);
      else {
        setTurn('you');
        const ok = S.win(st.s);
        ctx.say(msg + (ok ? ' Your move.' : ' Your move — but I have the upper hand now.'), ok ? '' : 'warn');
        showTakeBack(!ok);
      }
      ctx.changed('move');
    }

    // pointer: hover shows what a click would do
    g0.addEventListener('pointermove', (ev) => {
      if (downM || busy || st.over || wb.mode !== 'select') return;
      V.preview(V.moveAt(wb.toWorld(ev.clientX, ev.clientY), st.s), st.s);
    });
    g0.addEventListener('pointerleave', () => { if (!downM) V.preview(null, st.s); });
    wb.handlers.board = {
      down(pt) {
        if (busy || st.over) return false;
        const m = V.moveAt(pt, st.s);
        if (!m) return false;
        downM = m;
        V.preview(m, st.s);
        return true;
      },
      move(pt) {
        if (!downM) return;
        const m = V.release ? V.release(pt, st.s, downM) : V.moveAt(pt, st.s);
        V.preview(m || downM, st.s);
      },
      up(pt) {
        const m0 = downM;
        downM = null;
        if (!m0) return;
        const m = V.release ? V.release(pt, st.s, m0) : (sameMove(d.game, V.moveAt(pt, st.s), m0) ? m0 : null);
        V.preview(null, st.s);
        if (!m) return;
        if (m.bad) { ctx.say(m.bad, 'warn'); ctx.sfx('wrong'); return; }
        userMove(m);
      }
    };

    V.draw(st.s, {});
    setTurn('you');
    ctx.say('You move first.', '');
    // a puzzle that starts after my opening move: show what I took
    const opening = () => {
      if (!d.was || st.hist.length || st.over) return;
      const i = d.was.findIndex((w, k) => w !== d.heaps[k]);
      if (i < 0 || !sameArr(st.s, d.heaps)) return;
      const m = { h: i, t: d.was[i] - d.heaps[i] };
      V.draw(st.s, { m, who: 'cpu', from: d.was });
      ctx.say(describe(d, m, d.was, 'cpu').replace('I took', 'I opened by taking') + ' Your move.', '');
    };
    opening();

    return {
      check() {
        if (st.over === 'you') return { solved: true, msg: d.misere ? 'I had to make the last move.' : WIN_TEXT[d.game] };
        if (st.over === 'cpu') return { solved: false, msg: 'I won that game. Take back your last move and try another.' };
        return { solved: false, msg: 'The game is not over yet — it is your move.' };
      },
      hint(n) {
        if (st.over === 'you') return 'You have already won!';
        if (busy) return 'Wait for my move first…';
        if (st.over === 'cpu' || !S.win(st.s)) {
          return { text: 'From here I can win whatever you do: an earlier move of yours let me in. **Take back** your last move and look for another.', show() { showTakeBack(true); } };
        }
        const mv = bestMove(st.s);
        if (!mv) return null;
        if (n % 2 === 0) return { text: describe(d, mv.m, st.s, 'you').replace(/\.$/, '') + ' — it is marked on the board. (Ask again for the reason.)', show() { V.mark(mv.m, st.s); } };
        return { text: reason(d, st.s, mv), show() { V.mark(mv.m, st.s); if (V.showReason) V.showReason(st.s); } };
      },
      solve() {
        clearTimeout(timer);
        V.clearMarks();
        if (st.over === 'you') { ctx.changed('solve'); return; }
        busy = true;
        if (st.over || !S.win(st.s)) {
          let k = st.hist.length - 1;
          while (k >= 0 && !S.win(st.hist[k])) k--;
          const s0 = k >= 0 ? st.hist[k] : game.init(d);
          st.hist = st.hist.slice(0, Math.max(0, k));
          st.s = C.clone(s0);
          st.over = null;
          lastCpu = null;
          V.draw(st.s, {});
          ctx.say('Back to where you were still winning…', 'info');
        }
        const stepYou = () => {
          const mv = bestMove(st.s);
          if (!mv) { busy = false; ctx.changed('solve'); return; }
          st.hist.push(C.clone(st.s));
          const from = st.s;
          st.s = mv.s;
          lastUser = mv.m;
          V.draw(st.s, { m: mv.m, who: 'you', from });
          ctx.move();
          ctx.say('You: ' + describe(d, mv.m, from, 'you'), 'info');
          if (S.terminal(st.s)) { finish(d.misere ? 'cpu' : 'you'); busy = false; ctx.changed('solve'); return; }
          setTurn('cpu');
          timer = setTimeout(stepCpu, C.anim(750));
        };
        const stepCpu = () => {
          const x = chooseCpu();
          const from = st.s;
          st.s = x.s;
          if (x.m.back) st.back++;
          lastCpu = x.m;
          V.draw(st.s, { m: x.m, who: 'cpu', from });
          const msg = describe(d, x.m, from, 'cpu');
          if (S.terminal(st.s)) { finish(d.misere ? 'you' : 'cpu', msg); busy = false; ctx.changed('solve'); return; }
          setTurn('you');
          ctx.say(msg, 'info');
          timer = setTimeout(stepYou, C.anim(750));
        };
        setTurn('you');
        timer = setTimeout(stepYou, C.anim(450));
      },
      explain() { return reason(d, game.init(d), bestMove(game.init(d))); },
      getState() { return { s: st.s, over: st.over, hist: st.hist, back: st.back }; },
      setState(x) {
        if (!x || x.s == null) return;
        clearTimeout(timer);
        timer = null;
        busy = false;
        downM = null;
        st = { s: C.clone(x.s), over: x.over || null, hist: C.clone(x.hist || []), back: x.back || 0 };
        lastCpu = null;
        lastUser = null;
        V.clearMarks();
        V.draw(st.s, {});
        const ok = !st.over && S.win(st.s);
        warned = !ok;
        setTurn(st.over ? null : 'you');
        showTakeBack(st.over === 'cpu' || (!st.over && !ok));
        if (!st.over) ctx.say(ok ? 'Your move.' : 'Your move — but from here I can win.', ok ? '' : 'warn');
        opening();
      },
      destroy() { clearTimeout(timer); if (V.destroy) V.destroy(); wb.handlers.board = null; }
    };
  }

  /* =====================================================================
   * views: how each game looks and what a click means
   *   box, draw(s, {m, who, from}), moveAt(pt, s) -> move | {…, bad} | null,
   *   release(pt, s, m0)?, preview(m, s), mark(m, s), clearMarks(), showReason(s)?
   * ===================================================================== */

  const VIEWS = {};

  /* ---------- heaps of matches or counters (nim, take-away) ---------- */

  const MATCH = { P: 46, LH: 205 };
  const STONE = { P: 74, LH: 80 };

  function heapLayout(d) {
    const matches = (d.look || (d.game === 'nim' ? 'matches' : 'stones')) === 'matches';
    const one = d.heaps.length === 1;
    const K = matches ? MATCH : STONE;
    const wrap = d.wrap || (matches ? 40 : one ? 10 : 12);
    const X0 = one ? 0 : 120;
    const heaps = [];
    let y = 0, maxX = 0;
    (d.was || d.heaps).forEach((h) => {
      const items = [];
      for (let j = 0; j < h; j++) {
        const line = Math.floor(j / wrap), col = j % wrap;
        items.push([X0 + col * K.P, y + line * K.LH]);
        maxX = Math.max(maxX, X0 + col * K.P);
      }
      const lines = Math.max(1, Math.ceil(h / wrap));
      heaps.push({ items, y0: y, lines });
      y += lines * K.LH + (matches ? 0 : 34);
    });
    const hy = matches ? 95 : 40;
    return { matches, one, K, heaps, box: { x0: one ? -50 : -10, y0: -(matches ? 110 : 60), x1: maxX + (matches ? 40 : 55), y1: y - (matches ? 0 : 34) - K.LH + hy } };
  }

  VIEWS.nim = VIEWS.take = function (ctx, d, g0, top) {
    const L = heapLayout(d);
    const K = L.K;
    const counts = [];
    if (L.one) counts.push(ctx.s('text', { x: L.box.x0 + 262, y: L.box.y0 - 46, class: 'nm-count big', 'dominant-baseline': 'central' }, g0));
    const els = L.heaps.map((H, i) => {
      if (!L.one) counts.push(ctx.s('text', { x: 40, y: H.y0 + (H.lines - 1) * K.LH / 2, class: 'nm-count', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g0));
      return H.items.map((q, j) => {
        const g = ctx.s('g', { class: 'nm-item', transform: 'translate(' + q[0] + ' ' + q[1] + ')' }, g0);
        const inner = ctx.s('g', { class: 'nm-inner' }, g);
        if (L.matches) {
          ctx.s('rect', { x: -6.5, y: -66, width: 13, height: 146, rx: 4, class: 'nm-stick', 'data-key': 'm' + i + '-' + j }, inner);
          ctx.s('ellipse', { cx: 0, cy: -70, rx: 10.5, ry: 15, class: 'nm-head' }, inner);
          ctx.s('ellipse', { cx: -3, cy: -75, rx: 3, ry: 5, class: 'nm-head-shine' }, inner);
        } else {
          ctx.s('circle', { r: 29, class: 'nm-stone', 'data-key': 'm' + i + '-' + j }, inner);
          ctx.s('circle', { r: 21, class: 'nm-stone-in' }, inner);
          ctx.s('ellipse', { cx: -9, cy: -11, rx: 9, ry: 5, class: 'nm-stone-shine' }, inner);
        }
        return { g, q };
      });
    });
    const tag = ctx.s('g', { class: 'nm-tag' }, top);
    const tagR = ctx.s('rect', { rx: 14, height: 34 }, tag);
    const tagT = ctx.s('text', { 'dominant-baseline': 'central', 'text-anchor': 'middle' }, tag);
    tag.style.display = 'none';
    let marks = [];

    function draw(s, info) {
      info = info || {};
      els.forEach((row, i) => row.forEach((e, j) => {
        const on = j < s[i];
        const gone = info.m && info.from && i === info.m.h && j >= s[i] && j < info.from[i];
        e.g.classList.remove('take', 'bad');
        if (on) e.g.classList.remove('off', 'go-you', 'go-cpu');
        else if (gone) { e.g.classList.remove('off'); e.g.classList.add(info.who === 'cpu' ? 'go-cpu' : 'go-you'); }
        else { e.g.classList.remove('go-you', 'go-cpu'); e.g.classList.add('off'); }
      }));
      if (L.one) counts[0].textContent = s[0] + ' left';
      else counts.forEach((t, i) => { t.textContent = s[i]; });
      tag.style.display = 'none';
      clearMarks();
    }
    function moveAt(pt, s) {
      let bi = -1, bj = -1, bd = Infinity;
      els.forEach((row, i) => row.forEach((e, j) => {
        if (j >= s[i]) return;
        const dx = pt[0] - e.q[0], dy = pt[1] - e.q[1];
        const inside = L.matches ? Math.abs(dx) <= K.P / 2 && dy >= -95 && dy <= 90 : Math.hypot(dx, dy) <= 37;
        if (!inside) return;
        const dd = Math.abs(dx) + Math.abs(dy) * 0.1;
        if (dd < bd) { bd = dd; bi = i; bj = j; }
      }));
      if (bi < 0) return null;
      const t = s[bi] - bj;
      const ok = takeable(d, s[bi]);
      if (ok.indexOf(t) >= 0) return { h: bi, t };
      const allowed = d.sub ? 'You may take only ' + listOr(d.sub) + ' at a time' : 'You may take at most ' + d.max + ' at a time';
      return { h: bi, t, bad: allowed + ' — not ' + t + '.' };
    }
    function paint(m, s, cls) {
      els[m.h].forEach((e, j) => { if (j >= s[m.h] - m.t && j < s[m.h]) e.g.classList.add(cls); });
    }
    function preview(m, s) {
      els.forEach((row) => row.forEach((e) => e.g.classList.remove('take', 'bad')));
      if (!m) { tag.style.display = 'none'; return; }
      paint(m, s, m.bad ? 'bad' : 'take');
      const last = els[m.h][s[m.h] - 1];
      const label = (m.bad ? '✕ ' : 'take ') + m.t;
      const w = 30 + label.length * 13;
      const x = last.q[0] + (L.matches ? 34 : 44) + w / 2, y = last.q[1] - (L.matches ? 60 : 30);
      tagR.setAttribute('x', x - w / 2); tagR.setAttribute('y', y - 17); tagR.setAttribute('width', w);
      tagT.setAttribute('x', x); tagT.setAttribute('y', y + 1);
      tagT.textContent = label;
      tag.setAttribute('class', 'nm-tag' + (m.bad ? ' bad' : ''));
      tag.style.display = '';
    }
    function mark(m, s) { clearMarks(); paint(m, s, 'mark'); marks = [m]; }
    function clearMarks() { els.forEach((row) => row.forEach((e) => e.g.classList.remove('mark'))); marks = []; }
    return { box: L.box, draw, moveAt, preview, mark, clearMarks };
  };

  /* ---------- Wythoff: a queen heading for the corner ---------- */

  VIEWS.wythoff = function (ctx, d, g0, top) {
    const A = d.a, Bn = d.b, Q = 80;
    const X = (c) => c * Q, Y = (r) => (Bn - r) * Q;
    const sq = [];
    for (let c = 0; c <= A; c++) {
      sq.push([]);
      for (let r = 0; r <= Bn; r++) {
        sq[c].push(ctx.s('rect', { x: X(c), y: Y(r), width: Q, height: Q, class: 'wy-sq ' + ((c + r) % 2 ? 'lt' : 'dk'), 'data-key': 'sq' + c + '-' + r }, g0));
      }
    }
    ctx.s('rect', { x: 0, y: 0, width: (A + 1) * Q, height: (Bn + 1) * Q, class: 'wy-frame' }, g0);
    ctx.s('text', { x: X(0) + Q / 2, y: Y(0) + Q / 2 + 2, class: 'wy-goal', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: '★' }, g0);
    for (let c = 0; c <= A; c++) ctx.s('text', { x: X(c) + Q / 2, y: Y(0) + Q + 30, class: 'wy-ax c', 'text-anchor': 'middle', text: String(c) }, g0);
    for (let r = 0; r <= Bn; r++) ctx.s('text', { x: -24, y: Y(r) + Q / 2, class: 'wy-ax r', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(r) }, g0);
    // the same game as two heaps: the queen's column and row
    const HX = (A + 1) * Q + 56, HH = (Bn + 1) * Q;
    const heapsG = ctx.s('g', { class: 'wy-heaps' }, g0);
    ctx.s('text', { x: HX + 24, y: -2, class: 'wy-hcap', 'text-anchor': 'middle', text: 'heaps' }, g0);
    function drawHeaps(s) {
      heapsG.innerHTML = '';
      const step = Math.min(26, (HH - 20) / Math.max(A, Bn, 1)), r = Math.min(11, step * 0.44);
      for (let k = 0; k < 2; k++) {
        for (let j = 0; j < s[k]; j++) ctx.s('circle', { cx: HX + k * 48, cy: HH - 14 - j * step, r, class: 'wy-stone h' + k }, heapsG);
        ctx.s('text', { x: HX + k * 48, y: HH + 30, class: 'wy-ax ' + (k ? 'r' : 'c'), 'text-anchor': 'middle', text: String(s[k]) }, heapsG);
      }
    }
    const coldG = ctx.s('g', { class: 'wy-colds' }, g0);
    for (let c = 0; c <= A; c++) for (let r = 0; r <= Bn; r++) if (cold(c, r)) ctx.s('circle', { cx: X(c) + Q / 2, cy: Y(r) + Q / 2, r: 11, class: 'wy-cold' }, coldG);
    coldG.style.display = 'none';
    const dots = ctx.s('g', { class: 'wy-dots' }, g0);
    const trail = ctx.s('path', { class: 'wy-trail' }, g0);
    const ghost = ctx.s('text', { class: 'wy-q ghost', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: '♛' }, g0);
    ghost.style.display = 'none';
    const queen = ctx.s('g', { class: 'wy-queen' }, g0);
    ctx.s('circle', { r: 31, class: 'wy-qbase' }, queen);
    ctx.s('text', { y: 2, class: 'wy-q', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: '♛' }, queen);
    const markEl = ctx.s('rect', { width: Q - 8, height: Q - 8, rx: 10, class: 'wy-mark' }, top);
    markEl.style.display = 'none';
    let at = [A, Bn], raf = 0;

    const legal = (s, c, r) => (c < s[0] && r === s[1]) || (c === s[0] && r < s[1]) || (s[0] - c === s[1] - r && c < s[0]);
    function place(c, r) { queen.setAttribute('transform', 'translate(' + (X(c) + Q / 2) + ' ' + (Y(r) + Q / 2) + ')'); }
    function draw(s, info) {
      info = info || {};
      cancelAnimationFrame(raf);
      dots.innerHTML = '';
      for (let c = 0; c <= A; c++) {
        for (let r = 0; r <= Bn; r++) {
          const ok = legal(s, c, r);
          sq[c][r].classList.toggle('reach', ok);
          if (ok) ctx.s('circle', { cx: X(c) + Q / 2, cy: Y(r) + Q / 2, r: c === 0 && r === 0 ? 30 : 9, class: 'wy-dot' + (c === 0 && r === 0 ? ' ring' : '') }, dots);
        }
      }
      if (info.m && info.from) {
        const f = info.from, t0 = performance.now(), ms = C.anim(420);
        trail.setAttribute('d', 'M' + (X(f[0]) + Q / 2) + ' ' + (Y(f[1]) + Q / 2) + 'L' + (X(s[0]) + Q / 2) + ' ' + (Y(s[1]) + Q / 2));
        trail.setAttribute('class', 'wy-trail ' + info.who);
        const step = (now) => {
          const k = Math.min(1, (now - t0) / ms), e = 0.5 - Math.cos(k * Math.PI) / 2;
          place(f[0] + (s[0] - f[0]) * e, f[1] + (s[1] - f[1]) * e);
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      } else { trail.setAttribute('d', ''); place(s[0], s[1]); }
      at = s.slice();
      drawHeaps(s);
      ghost.style.display = 'none';
      clearMarks();
    }
    function moveAt(pt, s) {
      const c = Math.floor(pt[0] / Q), r = Bn - Math.floor(pt[1] / Q);
      if (c < 0 || r < 0 || c > A || r > Bn) return null;
      if (c === s[0] && r === s[1]) return null;
      if (legal(s, c, r)) return { a: c, b: r };
      return { a: c, b: r, bad: c > s[0] || r > s[1] ? 'The queen only moves toward the corner: left, down, or diagonally down-left.' : 'The queen moves in straight lines: along the row, down the column, or along the diagonal.' };
    }
    function preview(m) {
      for (let c = 0; c <= A; c++) for (let r = 0; r <= Bn; r++) sq[c][r].classList.remove('hov', 'bad');
      if (!m) { ghost.style.display = 'none'; return; }
      sq[m.a][m.b].classList.add(m.bad ? 'bad' : 'hov');
      if (m.bad) { ghost.style.display = 'none'; return; }
      ghost.setAttribute('x', X(m.a) + Q / 2); ghost.setAttribute('y', Y(m.b) + Q / 2 + 2);
      ghost.style.display = '';
    }
    function mark(m) { markEl.setAttribute('x', X(m.a) + 4); markEl.setAttribute('y', Y(m.b) + 4); markEl.style.display = ''; }
    function clearMarks() { markEl.style.display = 'none'; }
    function showReason() { coldG.style.display = ''; }
    return { box: { x0: -50, y0: -30, x1: (A + 1) * Q + 130, y1: (Bn + 1) * Q + 45 }, draw, moveAt, preview, mark, clearMarks, showReason, destroy() { cancelAnimationFrame(raf); } };
  };

  /* ---------- Kayles: a row of skittles ---------- */

  const PIN = 'M-12 0C-25-30-22-60-10-86C-6-95-7-106-11-118C-15-136-8-150 0-150C8-150 15-136 11-118C7-106 6-95 10-86C22-60 25-30 12 0Z';

  VIEWS.kayles = function (ctx, d, g0, top) {
    const n = d.pins.length, P = 64;
    ctx.s('rect', { x: -40, y: 2, width: (n - 1) * P + 80, height: 12, rx: 6, class: 'kp-lane' }, g0);
    const pins = [];
    for (let i = 0; i < n; i++) {
      const g = ctx.s('g', { class: 'kp', transform: 'translate(' + i * P + ' 0)' }, g0);
      const body = ctx.s('g', { class: 'kp-body' + (i % 2 ? ' odd' : '') }, g);
      ctx.s('path', { d: PIN, class: 'kp-pin', 'data-key': 'pin' + i }, body);
      ctx.s('path', { d: 'M-8.5-104H8.5M-8-96H8', class: 'kp-stripe' }, body);
      ctx.s('ellipse', { cx: -5, cy: -60, rx: 3.5, ry: 16, class: 'kp-shine' }, body);
      ctx.s('text', { x: 0, y: 40, class: 'kp-num', 'text-anchor': 'middle', text: String(i + 1) }, g);
      pins.push(g);
    }
    const tag = ctx.s('text', { class: 'kp-tag', 'text-anchor': 'middle' }, top);
    function draw(s, info) {
      info = info || {};
      pins.forEach((g, i) => {
        g.classList.toggle('down', !s[i]);
        const hit = info.m && (i === info.m.i || (info.m.n === 2 && i === info.m.i + 1));
        g.classList.remove('you', 'cpu', 'take', 'mark');
        if (hit) g.classList.add(info.who);
      });
      tag.textContent = '';
    }
    function moveAt(pt, s) {
      if (pt[1] < -175 || pt[1] > 55) return null;
      const t = pt[0] / P, i0 = Math.floor(t), f = t - i0;
      if (f > 0.3 && f < 0.7 && s[i0] && s[i0 + 1]) return { i: i0, n: 2 };
      const i = Math.round(t);
      if (i < 0 || i >= n || !s[i]) return null;
      return { i, n: 1 };
    }
    function release(pt, s, m0) {
      const m = moveAt(pt, s);
      if (!m) return null;
      if (m.i === m0.i && m.n === m0.n) return m0;
      if (m0.n === 1 && m.n === 1 && Math.abs(m.i - m0.i) === 1) return { i: Math.min(m.i, m0.i), n: 2 };
      if (m0.n === 1 && m.n === 2 && (m.i === m0.i || m.i + 1 === m0.i)) return m;
      return null;
    }
    function paint(m, cls) { pins[m.i].classList.add(cls); if (m.n === 2) pins[m.i + 1].classList.add(cls); }
    function preview(m) {
      pins.forEach((g) => g.classList.remove('take'));
      if (!m) { tag.textContent = ''; return; }
      paint(m, 'take');
      tag.setAttribute('x', (m.i + (m.n === 2 ? 0.5 : 0)) * P);
      tag.setAttribute('y', -178);
      tag.textContent = m.n === 2 ? 'both' : '';
    }
    function mark(m) { clearMarks(); paint(m, 'mark'); }
    function clearMarks() { pins.forEach((g) => g.classList.remove('mark')); }
    return { box: { x0: -50, y0: -200, x1: (n - 1) * P + 50, y1: 60 }, draw, moveAt, release, preview, mark, clearMarks };
  };

  /* ---------- Northcott: checkers in rows ---------- */

  VIEWS.northcott = function (ctx, d, g0, top) {
    const Wd = d.width, R = d.w.length, Q = 80;
    const sq = [];
    for (let r = 0; r < R; r++) {
      sq.push([]);
      for (let c = 0; c < Wd; c++) sq[r].push(ctx.s('rect', { x: c * Q, y: r * Q, width: Q, height: Q, class: 'nc-sq ' + ((c + r) % 2 ? 'lt' : 'dk'), 'data-key': 'sq' + r + '-' + c }, g0));
    }
    ctx.s('rect', { x: 0, y: 0, width: Wd * Q, height: R * Q, class: 'wy-frame' }, g0);
    const gapT = [];
    for (let r = 0; r < R; r++) gapT.push(ctx.s('text', { x: Wd * Q + 34, y: r * Q + Q / 2, class: 'nc-gap', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g0));
    const gapG = gapT;
    let showGaps = false;
    const mk = (cls) => {
      const g = ctx.s('g', { class: 'nc-ck ' + cls }, g0);
      ctx.s('circle', { r: 30, class: 'nc-disc' }, g);
      ctx.s('circle', { r: 20, class: 'nc-ring' }, g);
      return g;
    };
    const whites = [], blacks = [];
    for (let r = 0; r < R; r++) { whites.push(mk('w')); blacks.push(mk('b')); }
    const ghost = mk('w ghost');
    ghost.style.display = 'none';
    const markEl = ctx.s('rect', { width: Q - 8, height: Q - 8, rx: 10, class: 'wy-mark' }, top);
    markEl.style.display = 'none';
    let raf = 0;
    const put = (g, c, r) => g.setAttribute('transform', 'translate(' + (c * Q + Q / 2) + ' ' + (r * Q + Q / 2) + ')');
    function draw(s, info) {
      info = info || {};
      cancelAnimationFrame(raf);
      for (let r = 0; r < R; r++) {
        put(whites[r], s.w[r], r);
        put(blacks[r], s.b[r], r);
        gapT[r].textContent = showGaps ? String(s.b[r] - s.w[r] - 1) : '';
        whites[r].classList.remove('moved');
        blacks[r].classList.remove('moved');
      }
      if (info.m && info.from) {
        const m = info.m, g = m.side === 'w' ? whites[m.r] : blacks[m.r];
        const c0 = m.side === 'w' ? info.from.w[m.r] : info.from.b[m.r];
        g.classList.add('moved');
        const t0 = performance.now(), ms = C.anim(380);
        const step = (now) => {
          const k = Math.min(1, (now - t0) / ms), e = 0.5 - Math.cos(k * Math.PI) / 2;
          put(g, c0 + (m.to - c0) * e, m.r);
          if (k < 1) raf = requestAnimationFrame(step);
        };
        put(g, c0, m.r);
        raf = requestAnimationFrame(step);
      }
      ghost.style.display = 'none';
      clearMarks();
    }
    function moveAt(pt, s) {
      const c = Math.floor(pt[0] / Q), r = Math.floor(pt[1] / Q);
      if (r < 0 || r >= R || c < 0 || c >= Wd) return null;
      if (c === s.w[r]) return null;
      if (c < s.b[r]) return { r, to: c };
      if (c === s.b[r]) return null;
      return { r, to: c, bad: 'Your checker cannot jump over mine.' };
    }
    function preview(m) {
      for (let r = 0; r < R; r++) for (let c = 0; c < Wd; c++) sq[r][c].classList.remove('hov', 'bad');
      if (!m) { ghost.style.display = 'none'; return; }
      sq[m.r][m.to].classList.add(m.bad ? 'bad' : 'hov');
      if (m.bad) { ghost.style.display = 'none'; return; }
      put(ghost, m.to, m.r);
      ghost.style.display = '';
    }
    function mark(m) { markEl.setAttribute('x', m.to * Q + 4); markEl.setAttribute('y', m.r * Q + 4); markEl.style.display = ''; }
    function clearMarks() { markEl.style.display = 'none'; }
    function showReason(s) { showGaps = true; for (let r = 0; r < R; r++) gapG[r].textContent = String(s.b[r] - s.w[r] - 1); }
    return { box: { x0: -10, y0: -10, x1: Wd * Q + 70, y1: R * Q + 10 }, draw, moveAt, preview, mark, clearMarks, showReason, destroy() { cancelAnimationFrame(raf); } };
  };

  /* ---------- Grundy's game: stacks of coins ---------- */

  VIEWS.grundy = function (ctx, d, g0, top) {
    const total = d.heaps.reduce((a, b) => a + b, 0);
    const PX = 100, CH = 22, CW = 78;
    const maxH = Math.max.apply(null, d.heaps);
    const liveMax = Math.max(d.heaps.length, Math.floor(total / 3));
    const trayX = liveMax * PX + 40, TP = 56, TR = 58;
    const coinsG = ctx.s('g', { class: 'gr-coins' }, g0);
    ctx.s('rect', { x: -PX / 2, y: 0, width: liveMax * PX, height: 10, rx: 5, class: 'kp-lane' }, g0);
    ctx.s('text', { x: trayX + TP, y: -maxH * CH - 40, class: 'gr-tray-t', 'text-anchor': 'middle', text: 'dead heaps' }, g0);
    const line = ctx.s('path', { class: 'gr-split' }, top);
    const labA = ctx.s('text', { class: 'gr-lab', 'text-anchor': 'start', 'dominant-baseline': 'central' }, top);
    const labB = ctx.s('text', { class: 'gr-lab', 'text-anchor': 'start', 'dominant-baseline': 'central' }, top);
    let coins = []; // coins[i][j] = element
    let lay = null, cur = null, marked = null;

    function layout(s) {
      const pos = [];
      let live = 0, dead = 0;
      s.forEach((h, i) => {
        if (h > 2) { pos.push({ x: live * PX, y: 0, k: 1, live: true }); live++; }
        else { const col = dead % 3, row = Math.floor(dead / 3); pos.push({ x: trayX + col * TP, y: -maxH * CH + 10 + row * TR + 2 * CH * 0.7, k: 0.7, live: false }); dead++; }
      });
      return pos;
    }
    function coinXY(P, j) { return [P.x, P.y - (j + 0.5) * CH * P.k]; }
    function draw(s, info) {
      info = info || {};
      const old = lay;
      lay = layout(s);
      cur = s.slice();
      coinsG.innerHTML = '';
      coins = s.map((h, i) => {
        const P = lay[i], row = [];
        for (let j = 0; j < h; j++) {
          const q = coinXY(P, j);
          const g = ctx.s('g', { class: 'gr-coin' + (P.live ? '' : ' dead') }, coinsG);
          ctx.s('rect', { x: q[0] - CW / 2 * P.k, y: q[1] - 4 * P.k, width: CW * P.k, height: 12 * P.k, rx: 4 * P.k, class: 'gr-side' }, g);
          ctx.s('ellipse', { cx: q[0], cy: q[1] - 4 * P.k, rx: CW / 2 * P.k, ry: 8 * P.k, class: 'gr-top', 'data-key': 'c' + i + '-' + j }, g);
          row.push(g);
        }
        if (P.live) ctx.s('text', { x: P.x, y: 34, class: 'gr-n', 'text-anchor': 'middle', text: String(h) }, coinsG);
        return row;
      });
      // slide the coins that moved from where they were
      if (info.m && info.from && old) {
        const m = info.m;
        coins.forEach((row, i) => row.forEach((g, j) => {
          let oi, oj;
          if (i < m.h) { oi = i; oj = j; } else if (i === m.h) { oi = m.h; oj = j; } else if (i === m.h + 1) { oi = m.h; oj = j + m.a; } else { oi = i - 1; oj = j; }
          const P0 = old[oi], P1 = lay[i];
          if (!P0) return;
          const a = coinXY(P0, oj), b = coinXY(P1, j);
          const dx = a[0] - b[0], dy = a[1] - b[1];
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
          g.style.transition = 'none';
          g.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
          g.getBoundingClientRect();
          g.style.transition = 'transform ' + (C.anim(420) / 1000) + 's ease-in-out';
          g.style.transform = '';
          if (i === m.h || i === m.h + 1) g.classList.add(info.who === 'cpu' ? 'cpu' : 'you');
        }));
      }
      hideSplit();
      marked = null;
    }
    function hideSplit() { line.setAttribute('d', ''); labA.textContent = ''; labB.textContent = ''; }
    function moveAt(pt, s) {
      if (!lay) return null;
      let bi = -1;
      lay.forEach((P, i) => { if (P.live && Math.abs(pt[0] - P.x) <= PX / 2) bi = i; });
      if (bi < 0) {
        lay.forEach((P, i) => { if (!P.live && Math.abs(pt[0] - P.x) <= TP / 2 && pt[1] <= P.y + 6 && pt[1] >= P.y - 3 * CH) bi = i; });
        if (bi >= 0) return { h: bi, a: 1, bad: 'A heap of ' + s[bi] + ' cannot be split into two different sizes.' };
        return null;
      }
      const h = s[bi];
      if (pt[1] < -(h * CH + 50) || pt[1] > 45) return null;
      let a = Math.round(-pt[1] / CH);
      a = Math.max(1, Math.min(h - 1, a));
      if (a === h - a) return { h: bi, a, bad: 'Two equal heaps (' + a + ' and ' + a + ') are not allowed — split it unevenly.' };
      return { h: bi, a };
    }
    function showSplit(m, s, cls) {
      const P = lay[m.h], h = s[m.h];
      if (!P || !P.live) { hideSplit(); return; }
      const y = P.y - m.a * CH - 4;
      line.setAttribute('d', 'M' + (P.x - CW / 2 - 12) + ' ' + y + 'H' + (P.x + CW / 2 + 12));
      line.setAttribute('class', 'gr-split ' + cls);
      labA.setAttribute('x', P.x + CW / 2 + 16); labA.setAttribute('y', y + 18); labA.textContent = String(m.a);
      labB.setAttribute('x', P.x + CW / 2 + 16); labB.setAttribute('y', y - 18); labB.textContent = String(h - m.a);
      labA.setAttribute('class', 'gr-lab ' + cls); labB.setAttribute('class', 'gr-lab ' + cls);
      coins[m.h].forEach((g, j) => g.classList.toggle('up', j >= m.a));
    }
    function preview(m, s) {
      coins.forEach((row) => row.forEach((g) => g.classList.remove('up')));
      if (!m) { if (marked) showSplit(marked, cur, 'mark'); else hideSplit(); return; }
      if (m.bad && !lay[m.h].live) { hideSplit(); return; }
      showSplit(m, s, m.bad ? 'bad' : 'ok');
    }
    function mark(m, s) { marked = m; showSplit(m, s, 'mark'); }
    function clearMarks() { marked = null; hideSplit(); coins.forEach((row) => row.forEach((g) => g.classList.remove('up'))); }
    return { box: { x0: -PX / 2 - 10, y0: -maxH * CH - 70, x1: trayX + 3 * TP + 10, y1: 50 + Math.max(0, Math.ceil((total - 1) / 3) * TR - maxH * CH) }, draw, moveAt, preview, mark, clearMarks };
  };

  /* =====================================================================
   * the engine
   * ===================================================================== */

  /* =====================================================================
   * making games (Endless drawers, and tools/gen/games.js)
   * ===================================================================== */

  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const numw = (n) => NUMW[n] || String(n);
  const capw = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const andList = (a) => (a.length === 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
  const SUBSETS = [[1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 3], [1, 4], [1, 3, 4], [1, 2, 4], [2, 3], [1, 2, 5], [1, 4, 5], [2, 5], [1, 2, 6], [1, 3, 5, 6], [1, 2, 4, 8], [1, 4, 9, 16]];

  function winsFirst(d) {
    if (checkData(d)) return false;
    const S = solverFor(d), s = S.game.init(d);
    return !S.terminal(s) && S.win(s);
  }

  // the text and title of a game position (the rules themselves go in the goal line)
  function gameText(d) {
    switch (d.game) {
      case 'nim': {
        const t = capw(numw(d.heaps.length)) + ' rows of matches: ' + andList(d.heaps) + '.';
        return t + (d.misere ? ' Careful — in this game whoever takes the **last** match **loses**.' : '') + (d.max ? ' Nobody may take more than ' + numw(d.max) + ' at a time.' : '') + ' You move first, and the computer never slips: find the moves that win whatever it does.';
      }
      case 'take': {
        const one = d.heaps.length === 1;
        const t = one ? 'A heap of ' + d.heaps[0] + ' counters.' : capw(numw(d.heaps.length)) + ' heaps of counters: ' + andList(d.heaps) + '.';
        return t + ' In a turn you take ' + listOr(d.sub) + (one ? '' : ' from any one heap') + '.' + (d.misere ? ' Whoever takes the last counter **loses**.' : ' Whoever takes the last counter wins.') + (d.sub[0] > 1 ? ' If you cannot move, you lose.' : '') + ' You go first.';
      }
      case 'wythoff':
        return 'The queen stands on column ' + d.a + ', row ' + d.b + '. Each move takes her left, down, or diagonally down-left, as far as you like; whoever puts her on the starred corner wins. (It is Nim with two heaps of ' + d.a + ' and ' + d.b + ', where you may also take the same number from both.) You move first.';
      case 'kayles': {
        const n = d.pins.length, down = d.pins.split('').filter((c) => c === '0').length;
        return capw(numw(n)) + ' skittles stand in a row' + (down ? ', but ' + (down === 1 ? 'one has' : numw(down) + ' have') + ' already fallen' : '') + '. A throw knocks down one skittle, or two that stand side by side. ' + (d.misere ? 'Whoever knocks down the last skittle **loses**.' : 'Whoever knocks down the last skittle wins.') + ' You throw first.';
      }
      case 'northcott':
        return capw(numw(d.w.length)) + ' rows of ' + d.width + ' squares, each with your white checker and my red one. In a turn you slide one of your own checkers along its row, forward or back, as far as you like — but never onto or over mine. Whoever cannot move loses. You move first.';
      case 'grundy': {
        const one = d.heaps.length === 1;
        return (one ? 'A stack of ' + d.heaps[0] + ' coins.' : capw(numw(d.heaps.length)) + ' stacks of coins: ' + andList(d.heaps) + '.') + ' In a turn you split one stack into two stacks of **different** sizes. Stacks of 1 and 2 can never be split. Whoever cannot move loses. You move first.';
      }
      default: return '';
    }
  }
  function gameTitle(d) {
    switch (d.game) {
      case 'nim': return (d.misere ? 'Last Match Loses: ' : d.max ? 'At Most ' + d.max + ': ' : 'Rows of ') + d.heaps.join(', ');
      case 'take': return (d.heaps.length === 1 ? d.heaps[0] + ' Counters' : 'Heaps of ' + d.heaps.join(', ')) + ', Take ' + listOr(d.sub) + (d.misere ? ' (Last Loses)' : '');
      case 'wythoff': return 'Queen at ' + d.a + ', ' + d.b;
      case 'kayles': { const n = d.pins.length, down = d.pins.split('').filter((c) => c === '0').length; return capw(numw(n)) + ' Skittles' + (down ? ', ' + capw(numw(down)) + ' Down' : '') + (d.misere ? ' (Last Loses)' : ''); }
      case 'northcott': return capw(numw(d.w.length)) + ' Rows · ' + d.b.map((b, r) => b - d.w[r] - 1).reduce((a, b) => a + b, 0) + ' Squares Apart';
      case 'grundy': return d.heaps.length === 1 ? 'A Stack of ' + d.heaps[0] : 'Stacks of ' + andList(d.heaps);
      default: return 'A game';
    }
  }

  const GEN = {
    nim(rng, level) {
      const r = (lo, hi) => rng.range(lo, hi);
      const heaps = (n, lo, hi) => { const a = []; for (let i = 0; i < n; i++) a.push(r(lo, hi)); return a.sort((x, y) => x - y); };
      let d;
      const kind = rng();
      if (level === 1) d = { heaps: heaps(2, 1, 7) };
      else if (level === 2) d = kind < 0.7 ? { heaps: heaps(3, 1, 6) } : { heaps: heaps(2, 2, 7), misere: true };
      else if (level === 3) d = kind < 0.4 ? { heaps: heaps(3, 2, 9) } : kind < 0.7 ? { heaps: heaps(4, 1, 6) } : { heaps: heaps(3, 1, 6), misere: true };
      else if (level === 4) d = kind < 0.35 ? { heaps: heaps(4, 2, 10) } : kind < 0.65 ? { heaps: heaps(r(3, 4), 3, 12), max: r(2, 4) } : { heaps: heaps(4, 1, 7), misere: true };
      else d = kind < 0.35 ? { heaps: heaps(5, 2, 12) } : kind < 0.7 ? { heaps: heaps(r(4, 5), 1, 9), misere: true } : { heaps: heaps(5, 3, 14), max: r(2, 5) };
      d = Object.assign({ game: 'nim' }, d);
      if (d.heaps.length === 2 && d.heaps[0] === d.heaps[1] && !d.misere) return null;
      return winsFirst(d) ? d : null;
    },
    take(rng, level) {
      let d;
      const kind = rng();
      const single = (sets, lo, hi, mis) => ({ heaps: [rng.range(lo, hi)], sub: rng.pick(sets).slice(), misere: mis || undefined });
      const multi = (sets, n, lo, hi, mis) => { const h = []; for (let i = 0; i < n; i++) h.push(rng.range(lo, hi)); return { heaps: h, sub: rng.pick(sets).slice(), misere: mis || undefined }; };
      if (level === 1) d = single([[1, 2], [1, 2, 3]], 7, 20);
      else if (level === 2) d = kind < 0.6 ? single([[1, 2, 3, 4], [1, 2, 3, 4, 5], [1, 3], [1, 4], [1, 2, 3]], 12, 30) : single([[1, 2], [1, 2, 3]], 9, 24, true);
      else if (level === 3) d = kind < 0.6 ? single([[1, 3, 4], [1, 2, 4], [2, 3], [1, 2, 5], [1, 4, 5], [2, 5], [1, 2, 6], [1, 2, 4, 8]], 14, 36) : multi([[1, 2], [1, 2, 3]], 2, 4, 13);
      else if (level === 4) d = kind < 0.5 ? multi([[1, 2, 3], [1, 3, 4], [1, 2, 4], [2, 3]], rng.range(2, 3), 5, 16) : kind < 0.8 ? single([[1, 3, 4], [1, 2, 4], [1, 4], [2, 3], [1, 2, 5]], 12, 30, true) : single([[1, 4, 9, 16]], 20, 45);
      else d = kind < 0.4 ? multi([[1, 3, 4], [1, 2, 5], [1, 4, 5], [2, 3], [1, 3, 5, 6], [1, 2, 4, 8]], 3, 6, 18) : kind < 0.7 ? multi([[1, 2], [1, 2, 3]], 3, 2, 7, true) : single([[1, 4, 9, 16], [1, 4, 9, 16, 25]], 30, 70);
      d = Object.assign({ game: 'take' }, d);
      if (!d.misere) delete d.misere;
      d.heaps.sort((a, b) => a - b);
      if (d.heaps.length === 1 && d.sub.indexOf(d.heaps[0]) >= 0) return null; // no one-move wins
      return winsFirst(d) ? d : null;
    },
    wythoff(rng, level) {
      const band = [null, [2, 4], [5, 7], [8, 10], [11, 14], [15, 20]][level];
      const big = rng.range(band[0], band[1]), small = rng.range(1, big - 1);
      const d = rng() < 0.5 ? { game: 'wythoff', a: big, b: small } : { game: 'wythoff', a: small, b: big };
      if (d.a === d.b || !d.a || !d.b) return null;
      return winsFirst(d) ? d : null;
    },
    kayles(rng, level) {
      const band = [null, [4, 8], [8, 11], [11, 14], [14, 18], [18, 24]][level];
      const n = rng.range(band[0], band[1]);
      const downs = level === 1 ? rng.int(2) : rng.range(1, Math.min(4, level));
      const mis = level >= 4 && n <= 12 && rng() < 0.3;
      const pins = new Array(n).fill(1);
      for (let i = 0; i < downs; i++) pins[rng.int(n)] = 0;
      if (pins.filter((v) => v).length < 3) return null;
      const d = { game: 'kayles', pins: pins.join('') };
      if (mis) d.misere = true;
      return winsFirst(d) ? d : null;
    },
    northcott(rng, level) {
      const rows = [null, 2, 3, rng.range(4, 5), rng.range(5, 6), rng.range(7, 8)][level];
      const width = level >= 4 ? rng.range(8, 10) : 8;
      const w = [], b = [];
      for (let r = 0; r < rows; r++) {
        const wc = rng.range(0, 2), gap = rng.range(0, Math.min(width - wc - 2, level + 3));
        w.push(wc); b.push(wc + gap + 1);
      }
      const d = { game: 'northcott', width, w, b };
      if (b.every((x, r) => x - w[r] - 1 === 0)) return null;
      return winsFirst(d) ? d : null;
    },
    grundy(rng, level) {
      let heaps;
      if (level === 1) heaps = [rng.range(3, 6)];
      else if (level === 2) heaps = rng() < 0.6 ? [rng.range(8, 12)] : [rng.range(3, 6), rng.range(3, 6)];
      else if (level === 3) heaps = rng() < 0.5 ? [rng.range(13, 18)] : [rng.range(4, 9), rng.range(5, 9)];
      else if (level === 4) heaps = rng() < 0.5 ? [rng.range(19, 25)] : [rng.range(4, 9), rng.range(5, 10), rng.range(3, 7)];
      else heaps = rng() < 0.4 ? [rng.range(26, 34)] : [rng.range(5, 12), rng.range(6, 14), rng.range(4, 10)];
      const d = { game: 'grundy', heaps: heaps.sort((a, b) => a - b) };
      return winsFirst(d) ? d : null;
    }
  };
  const FAMILY_GAME = { nim: 'nim', 'take-away': 'take', wythoff: 'wythoff', kayles: 'kayles', northcott: 'northcott', 'grundy-game': 'grundy' };

  function makeGame(rng, level, game) {
    for (let tries = 0; tries < 80; tries++) {
      const d = GEN[game](rng, level);
      if (d) return d;
    }
    return null;
  }

  const isInt = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
  function checkData(d) {
    switch (d.game) {
      case 'nim':
      case 'take':
      case 'grundy':
        if (!Array.isArray(d.heaps) || !d.heaps.length || d.heaps.some((h) => !isInt(h, 1, 120))) return 'heaps must be whole numbers 1..120';
        if (d.game === 'take' && (!Array.isArray(d.sub) || !d.sub.length || d.sub.some((t, i) => !isInt(t, 1, 60) || (i && t <= d.sub[i - 1])))) return 'sub must be increasing whole numbers';
        if (d.game !== 'take' && d.sub) return 'sub is only for take-away games';
        if (d.max != null && !isInt(d.max, 1, 60)) return 'max must be a whole number';
        if (d.game === 'grundy' && d.misere) return 'Grundy’s game is played the normal way here';
        if (d.was) {
          if (d.game === 'grundy' || !Array.isArray(d.was) || d.was.length !== d.heaps.length || d.was.some((w, i) => !isInt(w, d.heaps[i], 120))) return 'was must list the heaps before my opening move';
          const diff = d.was.filter((w, i) => w !== d.heaps[i]).length;
          if (diff !== 1) return 'was must differ from heaps in exactly one heap (my opening move)';
          const i = d.was.findIndex((w, k) => w !== d.heaps[k]);
          if (takeable(d, d.was[i]).indexOf(d.was[i] - d.heaps[i]) < 0) return 'my opening move breaks the rules';
        }
        return null;
      case 'wythoff':
        if (!isInt(d.a, 0, 30) || !isInt(d.b, 0, 30)) return 'a and b must be whole numbers 0..30';
        if (d.misere) return 'Wythoff is played the normal way here';
        return null;
      case 'kayles':
        if (!/^[01]{1,40}$/.test(d.pins || '')) return 'pins must be a string of 0 and 1';
        return null;
      case 'northcott':
        if (!isInt(d.width, 2, 16) || !Array.isArray(d.w) || !Array.isArray(d.b) || !d.w.length || d.w.length !== d.b.length) return 'width, w and b are needed';
        if (d.w.some((w, r) => !isInt(w, 0, d.width - 2) || !isInt(d.b[r], w + 1, d.width - 1))) return 'every white checker must stand left of its black one, on the board';
        if (d.misere) return 'Northcott is played the normal way here';
        return null;
      default: return 'unknown game';
    }
  }

  C.engine({
    id: 'nim',
    name: 'Games to win',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: '**You move first; the computer answers.** Point at the board to see what a click would do, then click. The computer never makes a mistake: let it in and it will win — but **Take back** (or Undo) is always there. Hints give the winning move first, then the reason behind it.\n\n' +
      '**Nim and take-away:** click a match or counter to take it and every one after it in its row. **Wythoff:** click the square the queen should move to. **Kayles:** click a skittle to knock it down; click between two standing side by side (or drag from one to the other) to knock down both. **Northcott:** click the square the checker in that row should slide to. **Grundy’s game:** point at a heap where it should split, and click.',

    // Endless: a new winning start of the asked level (graded by the size of the
    // position and the rule: more heaps, bigger boards, last-move-loses)
    generate(rng, level, fam) {
      const game = FAMILY_GAME[fam && fam.id] || 'nim';
      const d = makeGame(rng, level, game);
      if (!d) return null;
      return { title: gameTitle(d), text: gameText(d), diff: level, data: d };
    },

    verify(p) {
      const d = p.data;
      if (!d || !GAMES[d.game]) return { ok: false, err: 'unknown game' };
      const e = checkData(d);
      if (e) return { ok: false, err: e };
      const S = solverFor(d), s = S.game.init(d);
      if (S.terminal(s)) return { ok: false, err: 'the game is over before it starts' };
      if (!S.win(s)) return { ok: false, err: 'the first player loses from here — the start must be a win for you' };
      if (!S.winningMoves(s, 'w').length) return { ok: false, err: 'no winning move found' };
      return { ok: true };
    },

    mount(ctx, p) { return mountGame(ctx, p); },

    thumb(p) {
      const d = p.data;
      const svg = (x0, y0, w, h, body) => '<svg viewBox="' + x0 + ' ' + y0 + ' ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">' + body + '</svg>';
      if (d.game === 'nim' || d.game === 'take') {
        const L = heapLayout(d);
        let b = '';
        L.heaps.forEach((H, i) => H.items.forEach((q, j) => {
          if (j >= d.heaps[i]) return;
          if (L.matches) b += '<rect x="' + (q[0] - 7) + '" y="' + (q[1] - 64) + '" width="14" height="144" rx="4" fill="#e3b574"/><ellipse cx="' + q[0] + '" cy="' + (q[1] - 70) + '" rx="12" ry="16" fill="#d9443c"/>';
          else b += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="29" fill="#8fb3c9" stroke="#56788e" stroke-width="4"/>';
        }));
        const bx = L.box;
        return svg(bx.x0 + (L.one ? 30 : 100), bx.y0 - 20, bx.x1 - bx.x0 - (L.one ? 30 : 100) + 20, bx.y1 - bx.y0 + 30, b);
      }
      if (d.game === 'wythoff') {
        const A = d.a, B = d.b, Q = 80;
        let b = '';
        for (let c = 0; c <= A; c++) for (let r = 0; r <= B; r++) b += '<rect x="' + c * Q + '" y="' + (B - r) * Q + '" width="' + Q + '" height="' + Q + '" fill="' + ((c + r) % 2 ? '#d9c4a0' : '#9c7a52') + '"/>';
        b += '<text x="' + Q / 2 + '" y="' + (B * Q + Q * 0.75) + '" text-anchor="middle" font-size="' + Q * 0.7 + '" fill="#b8860b">★</text>';
        b += '<circle cx="' + (A * Q + Q / 2) + '" cy="' + Q / 2 + '" r="' + Q * 0.42 + '" fill="#2b2f4a"/><text x="' + (A * Q + Q / 2) + '" y="' + Q * 0.78 + '" text-anchor="middle" font-size="' + Q * 0.7 + '" fill="#ffd166">♛</text>';
        return svg(-10, -10, (A + 1) * Q + 20, (B + 1) * Q + 20, b);
      }
      if (d.game === 'kayles') {
        let b = '';
        d.pins.split('').forEach((v, i) => {
          b += v === '1' ? '<path transform="translate(' + i * 64 + ' 0)" d="' + PIN + '" fill="#f1ead8" stroke="#8d8577" stroke-width="3"/><path transform="translate(' + i * 64 + ' 0)" d="M-8.5-104H8.5M-8-96H8" stroke="#d9443c" stroke-width="4"/>'
            : '<path transform="translate(' + i * 64 + ' 0) rotate(80)" d="' + PIN + '" fill="#f1ead8" opacity=".3"/>';
        });
        return svg(-40, -165, (d.pins.length - 1) * 64 + 80, 190, b);
      }
      if (d.game === 'northcott') {
        const W = d.width, R = d.w.length, Q = 80;
        let b = '';
        for (let r = 0; r < R; r++) {
          for (let c = 0; c < W; c++) b += '<rect x="' + c * Q + '" y="' + r * Q + '" width="' + Q + '" height="' + Q + '" fill="' + ((c + r) % 2 ? '#d9c4a0' : '#9c7a52') + '"/>';
          b += '<circle cx="' + (d.w[r] * Q + Q / 2) + '" cy="' + (r * Q + Q / 2) + '" r="30" fill="#f4efe1" stroke="#555" stroke-width="4"/>';
          b += '<circle cx="' + (d.b[r] * Q + Q / 2) + '" cy="' + (r * Q + Q / 2) + '" r="30" fill="#7a1f24" stroke="#2a0b0d" stroke-width="4"/>';
        }
        return svg(-10, -10, W * Q + 20, R * Q + 20, b);
      }
      if (d.game === 'grundy') {
        let b = '', x = 0;
        const maxH = Math.max.apply(null, d.heaps);
        d.heaps.forEach((h) => {
          for (let j = 0; j < h; j++) { const y = -(j + 0.5) * 22; b += '<rect x="' + (x - 39) + '" y="' + (y - 4) + '" width="78" height="12" rx="4" fill="#a8741f"/><ellipse cx="' + x + '" cy="' + (y - 4) + '" rx="39" ry="8" fill="#f2c14e" stroke="#a8741f" stroke-width="2"/>'; }
          x += 100;
        });
        return svg(-60, -maxH * 22 - 30, x + 20, maxH * 22 + 50, b);
      }
      return '';
    }
  });

  C.css('nim', `
    .nm-hit { fill: transparent; }
    .nm-pill rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 2; }
    .nm-pill text { font: 700 24px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .nm-pill-dot { fill: var(--green); }
    .nm-pill.cpu .nm-pill-dot { fill: var(--pink); animation: nmblink .7s ease-in-out infinite; }
    .nm-pill.won rect { fill: var(--green); stroke: var(--green); } .nm-pill.won text { fill: #0b2a1a; } .nm-pill.won .nm-pill-dot { fill: #fff; }
    .nm-pill.lost rect { stroke: var(--pink); } .nm-pill.lost .nm-pill-dot { fill: var(--pink); }
    @keyframes nmblink { 50% { opacity: .25; } }
    .nm-count { font: 800 34px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .nm-count.big { font-size: 30px; fill: var(--text); }
    .nm-item { cursor: pointer; }
    .nm-inner { transition: transform .15s, opacity .2s; transform-box: fill-box; transform-origin: center; }
    .nm-stick { fill: #e3b574; stroke: #9a6a2c; stroke-width: 2; }
    .nm-head { fill: #d9443c; stroke: #8f2520; stroke-width: 2; }
    .nm-head-shine { fill: #fff; opacity: .35; }
    .nm-stone { fill: #8fb3c9; stroke: #56788e; stroke-width: 3; }
    .nm-stone-in { fill: #a4c6da; }
    .nm-stone-shine { fill: #fff; opacity: .45; }
    .nm-item.take .nm-inner { transform: translateY(-14px); }
    .nm-item.take .nm-stick, .nm-item.take .nm-stone { stroke: var(--gold); stroke-width: 5; }
    .nm-item.bad .nm-inner { opacity: .75; }
    .nm-item.bad .nm-stick, .nm-item.bad .nm-stone { stroke: var(--red); stroke-width: 5; }
    .nm-item.mark .nm-stick, .nm-item.mark .nm-stone { stroke: var(--gold); stroke-width: 6; }
    .nm-item.mark .nm-inner { animation: nmmark 1s ease-in-out infinite; }
    @keyframes nmmark { 50% { transform: translateY(-10px); } }
    .nm-item.off { display: none; }
    .nm-item.go-you .nm-inner { animation: nmgoyou .4s ease-in forwards; pointer-events: none; }
    .nm-item.go-cpu { pointer-events: none; }
    .nm-item.go-cpu .nm-inner { animation: nmgocpu .6s ease-out forwards; }
    .nm-item.go-cpu .nm-stick, .nm-item.go-cpu .nm-stone { stroke: var(--pink); stroke-width: 4; stroke-dasharray: 6 5; }
    @keyframes nmgoyou { to { transform: translateY(-40px); opacity: 0; } }
    @keyframes nmgocpu { 0% { transform: none; opacity: 1; } 35% { transform: translateY(-18px); opacity: 1; } 100% { transform: translateY(-6px); opacity: .22; } }
    .nm-tag rect { fill: var(--gold); }
    .nm-tag text { font: 700 20px "Segoe UI", system-ui, sans-serif; fill: #2a2006; }
    .nm-tag.bad rect { fill: var(--red); } .nm-tag.bad text { fill: #fff; }
    .nm-tag { pointer-events: none; }
    .nm-bin { white-space: pre; font-family: Consolas, "Cascadia Mono", Menlo, monospace; font-size: 13px; line-height: 1.35; display: inline-block; margin: 6px 0 4px; padding: 6px 10px; border-radius: 8px; background: var(--panel-3, rgba(127,127,127,.12)); }
    .nm-sum { display: inline-block; border-top: 1px solid currentColor; margin-top: 2px; font-weight: 700; }

    .wy-sq { stroke: rgba(0,0,0,.18); stroke-width: 1; transition: fill .12s; cursor: pointer; }
    .wy-sq.dk { fill: #8f6e48; } .wy-sq.lt { fill: #d6c09a; }
    [data-theme="light"] .wy-sq.dk { fill: #a98458; }
    .wy-sq.reach.dk { fill: #7f7a5a; } .wy-sq.reach.lt { fill: #e4d9a6; }
    .wy-sq.hov { fill: #ffd166 !important; }
    .wy-sq.bad { fill: #d77a6f !important; }
    .wy-frame { fill: none; stroke: var(--wood-dark); stroke-width: 6; pointer-events: none; }
    .wy-goal { font: 700 56px "Segoe UI Symbol", "Segoe UI", system-ui, sans-serif; fill: #b8860b; pointer-events: none; }
    .wy-ax { font: 600 22px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .wy-ax.c { fill: var(--teal); } .wy-ax.r { fill: var(--purple); }
    .wy-hcap { font: 600 18px "Segoe UI", system-ui, sans-serif; fill: var(--faint); letter-spacing: .06em; }
    .wy-stone.h0 { fill: var(--teal); stroke: rgba(0,0,0,.3); stroke-width: 2; }
    .wy-stone.h1 { fill: var(--purple); stroke: rgba(0,0,0,.3); stroke-width: 2; }
    .wy-cold { fill: #38a8e8; stroke: #fff; stroke-width: 3; pointer-events: none; }
    .wy-dot { fill: rgba(35, 40, 69, .38); pointer-events: none; }
    .wy-dot.ring { fill: none; stroke: rgba(35, 40, 69, .45); stroke-width: 6; }
    .wy-qbase { fill: #232845; stroke: #ffd166; stroke-width: 3; }
    .wy-q { font: 700 52px "Segoe UI Symbol", "Segoe UI", system-ui, sans-serif; fill: #ffd166; pointer-events: none; }
    .wy-q.ghost { fill: #232845; opacity: .5; }
    .wy-queen { pointer-events: none; filter: drop-shadow(0 3px 3px rgba(0,0,0,.4)); }
    .wy-trail { fill: none; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 3 12; pointer-events: none; }
    .wy-trail.you { stroke: var(--accent); } .wy-trail.cpu { stroke: var(--pink); }
    .wy-mark { fill: none; stroke: var(--gold); stroke-width: 7; stroke-dasharray: 14 9; pointer-events: none; animation: nmblink 1s ease-in-out infinite; }

    .kp-lane { fill: var(--wood-dark); opacity: .45; }
    .kp { cursor: pointer; }
    .kp-body { transition: transform .45s cubic-bezier(.5,-0.2,.7,1), opacity .45s; transform-box: fill-box; transform-origin: 50% 100%; }
    .kp-pin { fill: #f4eedf; stroke: #8d8577; stroke-width: 3; }
    .kp-stripe { stroke: #d9443c; stroke-width: 4; fill: none; }
    .kp-shine { fill: #fff; opacity: .6; }
    .kp-num { font: 600 20px "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
    .kp.down { cursor: default; }
    .kp.down .kp-body { transform: rotate(84deg); opacity: .28; }
    .kp.down .kp-body.odd { transform: rotate(-84deg); }
    .kp.down.cpu .kp-body { opacity: .55; }
    .kp.down.cpu .kp-pin { stroke: var(--pink); stroke-width: 5; }
    .kp.take:not(.down) .kp-pin { stroke: var(--gold); stroke-width: 6; }
    .kp.take:not(.down) .kp-body { transform: rotate(8deg); }
    .kp.mark:not(.down) .kp-pin { stroke: var(--gold); stroke-width: 7; stroke-dasharray: 10 7; }
    .kp-tag { font: 700 20px "Segoe UI", system-ui, sans-serif; fill: var(--gold); pointer-events: none; }

    .nc-sq { stroke: rgba(0,0,0,.18); stroke-width: 1; cursor: pointer; }
    .nc-sq.dk { fill: #8f6e48; } .nc-sq.lt { fill: #d6c09a; }
    [data-theme="light"] .nc-sq.dk { fill: #a98458; }
    .nc-sq.hov { fill: #ffd166; } .nc-sq.bad { fill: #d77a6f; }
    .nc-ck { pointer-events: none; filter: drop-shadow(0 3px 2px rgba(0,0,0,.35)); }
    .nc-ck.w .nc-disc { fill: #f4efe1; stroke: #6d6a60; stroke-width: 4; }
    .nc-ck.w .nc-ring { fill: none; stroke: #c9c1ad; stroke-width: 3; }
    .nc-ck.b .nc-disc { fill: #7a1f24; stroke: #2a0b0d; stroke-width: 4; }
    .nc-ck.b .nc-ring { fill: none; stroke: #a8434a; stroke-width: 3; }
    .nc-ck.ghost { opacity: .45; }
    .nc-ck.b.moved .nc-disc { stroke: var(--pink); stroke-width: 6; }
    .nc-gap { font: 800 28px "Segoe UI", system-ui, sans-serif; fill: var(--teal); }

    .gr-coin { transition: transform .15s; }
    .gr-side { fill: #a8741f; }
    .gr-top { fill: #f2c14e; stroke: #a8741f; stroke-width: 2; }
    .gr-coin.dead .gr-top { fill: #b9a577; } .gr-coin.dead .gr-side { fill: #7c6a45; }
    .gr-coin.up { transform: translateY(-10px); }
    .gr-coin.cpu .gr-top { stroke: var(--pink); stroke-width: 3; }
    .gr-n { font: 800 28px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .gr-tray-t { font: 600 20px "Segoe UI", system-ui, sans-serif; fill: var(--faint); letter-spacing: .06em; }
    .gr-split { fill: none; stroke-width: 5; stroke-dasharray: 10 6; pointer-events: none; }
    .gr-split.ok, .gr-split.mark { stroke: var(--gold); } .gr-split.bad { stroke: var(--red); }
    .gr-split.mark { animation: nmblink 1s ease-in-out infinite; }
    .gr-lab { font: 800 26px "Segoe UI", system-ui, sans-serif; pointer-events: none; }
    .gr-lab.ok, .gr-lab.mark { fill: var(--gold); } .gr-lab.bad { fill: var(--red); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
