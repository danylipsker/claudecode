/* The Puzzle Cabinet · js/lib/duel.js
 *
 * You against the computer: the table shared by the two-player games of
 * engines/hackenbush.js and engines/chomp.js (the same conventions as
 * engines/nim.js). The engine supplies the rules and a view; this file runs
 * the turns: your move, the computer's perfect answer, "Take back my move",
 * the pill that says whose turn it is, hints (the winning move, then the
 * reason), the solution played out, and the saved state.
 *
 *   C.duel(ctx, p, G) -> the engine instance
 *   G = {
 *     start,                      the position you move from (JSON)
 *     opening: { m, from } | null a move the computer made before you (drawn from `from`)
 *     moves(s, who)               [{ m, s }] legal moves for 'you' | 'cpu' (no moves = that player loses)
 *     wins(s, who)                does the player to move win from s (perfect play)?
 *     best(s)                     your recommended winning move { m, s } (or null)
 *     cpu(s)                      the computer's move { m, s } (perfect; resists when lost)
 *     same(a, b)                  are two moves the same?
 *     describe(m, s, who)         'Take …' / 'I took …'
 *     reason(s, mv)               why mv wins (markup)
 *     winMsg, loseMsg             the end of the game, from your side
 *     view(ctx, g0, top) -> { box, draw(s, info, done), moveAt(pt, s), preview(m, s), mark(m, s),
 *                             clearMarks(), showReason?(s), destroy?() }
 *       info = { m, who, from } when a move is to be animated; call done() when it has finished
 *   }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  C.duel = function (ctx, p, G) {
    const wb = ctx.wb;
    let st = { s: C.clone(G.start), over: null, hist: [] };
    let busy = false, timer = null, warned = false, downM = null, dead = false;

    const layer = wb.layer('board'), top = wb.layer('top');
    const g0 = ctx.s('g', { class: 'du-board' }, layer);
    const hitBg = ctx.s('rect', { class: 'du-hit' }, g0);
    const V = G.view(ctx, g0, top);
    const box = V.box;
    hitBg.setAttribute('x', box.x0); hitBg.setAttribute('y', box.y0);
    hitBg.setAttribute('width', box.x1 - box.x0); hitBg.setAttribute('height', box.y1 - box.y0);
    const pill = ctx.s('g', { class: 'du-pill' }, g0);
    const pillR = ctx.s('rect', { x: box.x0, y: box.y0 - 70, width: 230, height: 46, rx: 23 }, pill);
    ctx.s('circle', { cx: box.x0 + 26, cy: box.y0 - 47, r: 9, class: 'du-pill-dot' }, pill);
    const pillT = ctx.s('text', { x: box.x0 + 46, y: box.y0 - 46, 'dominant-baseline': 'central' }, pill);
    wb.setBounds({ x0: box.x0 - 20, y0: box.y0 - 90, x1: box.x1 + 20, y1: box.y1 + 20 }, 0.06);

    const takeBack = ctx.button('Take back my last move', () => ctx.undo(), 'small');
    takeBack.hidden = true;

    function setTurn(who) {
      pill.setAttribute('class', 'du-pill ' + (who || (st.over === 'you' ? 'won' : 'lost')));
      pillT.textContent = who === 'you' ? 'Your move' : who === 'cpu' ? 'My move…' : st.over === 'you' ? 'You won!' : 'I won';
      pillR.setAttribute('width', who === 'cpu' ? 200 : 220);
    }
    function lock(on) { busy = on; ctx.lockUndo(on); }
    const later = (fn, ms) => { clearTimeout(timer); timer = setTimeout(() => { timer = null; if (!dead) fn(); }, C.anim(ms)); };

    function finish(who, prefix) {
      st.over = who;
      setTurn(null);
      if (who === 'you') ctx.say((prefix ? prefix + ' ' : '') + G.winMsg, 'good');
      else {
        ctx.say((prefix ? prefix + ' ' : '') + G.loseMsg + ' **Take back** your move and try another.', 'warn');
        takeBack.hidden = false;
      }
    }

    function userMove(m) {
      if (busy || st.over) return;
      const x = G.moves(st.s, 'you').find((y) => G.same(y.m, m));
      if (!x) return;
      st.hist.push(C.clone(st.s));
      const from = st.s;
      st.s = x.s;
      V.clearMarks();
      V.preview(null, st.s);
      ctx.sfx('tap');
      ctx.move();
      lock(true);
      setTurn('cpu');
      const lets = G.wins(st.s, 'cpu');
      V.draw(st.s, { m: x.m, who: 'you', from }, () => {
        if (dead) return;
        if (!G.moves(st.s, 'cpu').length) { lock(false); finish('you'); ctx.changed('move'); return; }
        if (lets && !warned) { warned = true; ctx.toast('Hmm… that move lets me in. (Undo is right there.)'); }
        ctx.say('Thinking…', 'info');
        later(cpuTurn, 550);
      });
    }

    function cpuTurn() {
      const x = G.cpu(st.s);
      if (!x) { lock(false); finish('you'); ctx.changed('move'); return; }
      const from = st.s;
      st.s = x.s;
      ctx.sfx('snap');
      const msg = G.describe(x.m, from, 'cpu');
      V.draw(st.s, { m: x.m, who: 'cpu', from }, () => {
        if (dead) return;
        lock(false);
        if (!G.moves(st.s, 'you').length) finish('cpu', msg);
        else {
          setTurn('you');
          const ok = G.wins(st.s, 'you');
          ctx.say(msg + (ok ? ' Your move.' : ' Your move — but I have the upper hand now.'), ok ? '' : 'warn');
          takeBack.hidden = ok;
        }
        ctx.changed('move');
      });
    }

    wb.handlers.board = {
      down(pt, ev) {
        if (ev && ev.button === 2) return false;
        if (busy || st.over) return false;
        const m = V.moveAt(pt, st.s);
        if (!m) return false;
        downM = m;
        V.preview(m, st.s);
        return true;
      },
      move(pt) {
        if (!downM) return;
        const m = V.moveAt(pt, st.s);
        V.preview(m && G.same(m, downM) ? downM : null, st.s);
      },
      up(pt) {
        const m0 = downM;
        downM = null;
        if (!m0) return;
        const m = V.moveAt(pt, st.s);
        V.preview(null, st.s);
        if (!m || !G.same(m, m0)) return;
        if (m.bad) { ctx.say(m.bad, 'warn'); ctx.sfx('wrong'); return; }
        userMove(m);
      },
      hover(pt) {
        if (downM || busy || st.over) { if (!downM) V.preview(null, st.s); return; }
        V.preview(V.moveAt(pt, st.s), st.s);
      }
    };
    const leave = () => { if (!downM) V.preview(null, st.s); };
    wb.svg.addEventListener('pointerleave', leave);

    function showOpening() {
      if (!G.opening || st.hist.length || st.over) return;
      if (JSON.stringify(st.s) !== JSON.stringify(G.start)) return;
      lock(true);
      setTurn('cpu');
      V.draw(G.opening.from, {}, () => {});
      ctx.say('I move first…', 'info');
      later(() => {
        V.draw(st.s, { m: G.opening.m, who: 'cpu', from: G.opening.from }, () => {
          if (dead) return;
          lock(false);
          setTurn('you');
          ctx.say(G.describe(G.opening.m, G.opening.from, 'cpu').replace(/^I /, 'To start, I ') + ' Your move.', '');
        });
      }, 700);
    }

    V.draw(st.s, {}, () => {});
    setTurn('you');
    ctx.say(G.opening ? '' : 'You move first.', '');
    showOpening();

    return {
      check() {
        if (st.over === 'you') return { solved: true, msg: G.winMsg };
        if (st.over === 'cpu') return { solved: false, msg: 'I won that game. Take back your last move and try another.' };
        return { solved: false, msg: 'The game is not over yet — it is your move.' };
      },
      hint(n) {
        if (st.over === 'you') return 'You have already won!';
        if (busy) return 'Wait for my move first…';
        if (st.over === 'cpu' || !G.wins(st.s, 'you')) {
          return { text: 'From here I can win whatever you do: an earlier move of yours let me in. **Take back** your last move and look for another.', show() { takeBack.hidden = false; } };
        }
        const mv = G.best(st.s);
        if (!mv) return null;
        if (n % 2 === 0) return { text: G.describe(mv.m, st.s, 'you').replace(/\.$/, '') + ' — it is marked on the board. (Ask again for the reason.)', show() { V.mark(mv.m, st.s); } };
        return { text: G.reason(st.s, mv), show() { V.mark(mv.m, st.s); if (V.showReason) V.showReason(st.s); } };
      },
      solve() {
        clearTimeout(timer);
        V.clearMarks();
        if (st.over === 'you') { ctx.changed('solve'); return; }
        lock(true);
        if (st.over || !G.wins(st.s, 'you')) {
          let k = st.hist.length - 1;
          while (k >= 0 && !G.wins(st.hist[k], 'you')) k--;
          const s0 = k >= 0 ? st.hist[k] : C.clone(G.start);
          st.hist = st.hist.slice(0, Math.max(0, k));
          st.s = C.clone(s0);
          st.over = null;
          V.draw(st.s, {}, () => {});
          ctx.say('Back to where you were still winning…', 'info');
        }
        const stepYou = () => {
          const mv = G.best(st.s);
          if (!mv) { lock(false); ctx.changed('solve'); return; }
          st.hist.push(C.clone(st.s));
          const from = st.s;
          st.s = mv.s;
          ctx.move();
          ctx.say('You: ' + G.describe(mv.m, from, 'you'), 'info');
          setTurn('cpu');
          V.draw(st.s, { m: mv.m, who: 'you', from }, () => {
            if (dead) return;
            if (!G.moves(st.s, 'cpu').length) { lock(false); finish('you'); ctx.changed('solve'); return; }
            later(stepCpu, 450);
          });
        };
        const stepCpu = () => {
          const x = G.cpu(st.s);
          const from = st.s;
          st.s = x.s;
          const msg = G.describe(x.m, from, 'cpu');
          V.draw(st.s, { m: x.m, who: 'cpu', from }, () => {
            if (dead) return;
            if (!G.moves(st.s, 'you').length) { lock(false); finish('cpu', msg); ctx.changed('solve'); return; }
            setTurn('you');
            ctx.say(msg, 'info');
            later(stepYou, 450);
          });
        };
        setTurn('you');
        later(stepYou, 350);
      },
      explain() { return G.explain ? G.explain() : G.reason(G.start, G.best(G.start)); },
      getState() { return { s: st.s, over: st.over, hist: st.hist }; },
      setState(x) {
        if (!x || x.s == null) return;
        clearTimeout(timer);
        timer = null;
        lock(false);
        downM = null;
        st = { s: C.clone(x.s), over: x.over || null, hist: C.clone(x.hist || []) };
        V.clearMarks();
        V.preview(null, st.s);
        V.draw(st.s, {}, () => {});
        const ok = !st.over && G.wins(st.s, 'you');
        warned = !ok;
        setTurn(st.over ? null : 'you');
        takeBack.hidden = !(st.over === 'cpu' || (!st.over && !ok));
        if (st.over === 'you') ctx.say(G.winMsg, 'good');
        else if (st.over === 'cpu') ctx.say(G.loseMsg + ' **Take back** your move and try another.', 'warn');
        else ctx.say(ok ? 'Your move.' : 'Your move — but from here I can win.', ok ? '' : 'warn');
      },
      destroy() {
        dead = true;
        clearTimeout(timer);
        wb.svg.removeEventListener('pointerleave', leave);
        if (V.destroy) V.destroy();
        wb.handlers.board = null;
      }
    };
  };

  /* dyadic fractions for the value talk: 3/4 -> ¾, 1.5 -> 1½, -0.125 -> −⅛ */
  const VULGAR = { '1/2': '½', '1/4': '¼', '3/4': '¾', '1/8': '⅛', '3/8': '⅜', '5/8': '⅝', '7/8': '⅞' };
  C.fmtDyadic = function (x, plus) {
    if (x === 0) return '0';
    const neg = x < 0, a = Math.abs(x);
    let whole = Math.floor(a + 1e-12), fr = a - whole, den = 1;
    while (Math.abs(fr * den - Math.round(fr * den)) > 1e-9 && den < 1 << 20) den *= 2;
    const num = Math.round(fr * den);
    let s = '';
    if (whole) s += whole;
    if (num) { const k = num + '/' + den; s += VULGAR[k] || (whole ? ' ' : '') + k; }
    return (neg ? '−' : plus ? '+' : '') + s;
  };

  C.css('duel', `
    .du-hit { fill: transparent; }
    .du-pill rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 2; }
    .du-pill text { font: 700 24px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .du-pill-dot { fill: var(--green); }
    .du-pill.cpu .du-pill-dot { fill: var(--pink); animation: dublink .7s ease-in-out infinite; }
    .du-pill.won rect { fill: var(--green); stroke: var(--green); } .du-pill.won text { fill: #0b2a1a; } .du-pill.won .du-pill-dot { fill: #fff; }
    .du-pill.lost rect { stroke: var(--pink); } .du-pill.lost .du-pill-dot { fill: var(--pink); }
    @keyframes dublink { 50% { opacity: .25; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
