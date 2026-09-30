/* The Puzzle Cabinet · engines/chomp.js
 *
 * Chomp (David Gale, 1974): a bar of chocolate whose bottom-left square is
 * poisoned. A bite takes one square together with every square above it and
 * to its right. Whoever has to eat the poisoned square loses. You play the
 * computer, which searches every position (boards up to about 10 × 9 have at
 * most a few tens of thousands of shapes) and never slips.
 *
 * data: {
 *   rows: [7, 7, 5, 2]   the row lengths from the bottom (non-increasing): the bar you face
 *   first: 'cpu'         the computer bites first, from rows (which must then be a loss for it)
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the game ---------- */

  const keyOf = (s) => s.join(',');
  function bite(s, x, y) {
    const out = [];
    for (let i = 0; i < s.length; i++) {
      const r = i >= y ? Math.min(s[i], x) : s[i];
      if (r > 0) out.push(r);
    }
    return out;
  }
  function moves(s) {
    const out = [];
    for (let y = 0; y < s.length; y++) for (let x = 0; x < s[y]; x++) if (x || y) out.push({ m: { x, y }, s: bite(s, x, y) });
    return out;
  }
  const size = (s) => s.reduce((a, b) => a + b, 0);

  const MEMO = new Map();
  // does the player to move win? (only the poison left: no moves, a loss)
  function win(s) {
    const k = keyOf(s);
    let r = MEMO.get(k);
    if (r !== undefined) return r;
    r = false;
    outer: for (let y = 0; y < s.length; y++) {
      for (let x = 0; x < s[y]; x++) {
        if (!x && !y) continue;
        if (!win(bite(s, x, y))) { r = true; break outer; }
      }
    }
    MEMO.set(k, r);
    return r;
  }
  const winning = (s) => moves(s).filter((x) => !win(x.s));

  function transpose(s) {
    const out = [];
    for (let x = 0; x < (s[0] || 0); x++) out.push(s.filter((r) => r > x).length);
    return out;
  }
  const isRect = (s) => s.every((r) => r === s[0]);
  const isL = (s) => s.length > 1 && s[0] > 1 && s.slice(1).every((r) => r === 1);

  // what kind of position this is, for the words
  function shapeOf(s) {
    if (s.length === 1) return 'row';
    if (s[0] === 1) return 'col';
    if (isL(s)) return 'L';
    if (isRect(s) && s.length === s[0]) return 'square';
    if (s.length === 2) return 'two-rows';
    if (s[0] === 2) return 'two-cols';
    return isRect(s) ? 'rect' : 'other';
  }

  // the move a person would make with the known strategies
  function explained(s, W) {
    const sh = shapeOf(s);
    const find = (f) => W.find((x) => f(x.s));
    if (sh === 'row' || sh === 'col') return find((t) => t.length === 1 && t[0] === 1);
    if (sh === 'square') return W.find((x) => x.m.x === 1 && x.m.y === 1);
    if (sh === 'L') return find((t) => isL(t) && t[0] - 1 === t.length - 1);
    if (sh === 'two-rows') return find((t) => t.length === 2 && t[0] === t[1] + 1) || find((t) => t.length === 1 && t[0] === 2);
    if (sh === 'two-cols') { return find((t) => { const u = transpose(t); return (u.length === 2 && u[0] === u[1] + 1) || (u.length === 1 && u[0] === 2); }); }
    return null;
  }

  function bestMove(s) {
    const W = winning(s);
    if (!W.length) return null;
    return explained(s, W) || W.reduce((b, x) => (size(x.s) > size(b.s) ? x : b), W[0]);
  }

  function cpuMove(s) {
    const all = moves(s);
    if (!all.length) return null;
    const W = all.filter((x) => !win(x.s));
    if (W.length) return explained(s, W) || W.reduce((b, x) => (size(x.s) > size(b.s) ? x : b), W[0]);
    // lost: leave the fewest winning replies, and as much chocolate as possible
    let best = null, bs = Infinity;
    all.forEach((x) => {
      const sc = winning(x.s).length * 1000 - size(x.s);
      if (sc < bs) { bs = sc; best = x; }
    });
    return best;
  }

  /* ---------- words ---------- */

  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const numw = (n) => NUMW[n] || String(n);
  const sq = (n) => n + (n === 1 ? ' square' : ' squares');

  function describe(m, s, who) {
    const n = size(s) - size(bite(s, m.x, m.y));
    const where = 'the square in column ' + (m.x + 1) + ', row ' + (m.y + 1) + ' (' + sq(n) + ')';
    return (who === 'cpu' ? 'I bit off ' : 'Bite off ') + where + '.';
  }

  function stealing() {
    return 'Why the first player can always win a **full rectangle** (the “strategy-stealing” argument): suppose not. Then biting off just the top-right square would lose, so the other player would have a winning answer to it. But every bite takes the top-right square anyway, so that same answer was available as a first move — and it would win. The contradiction shows a winning first bite exists, though the argument never says which one. For most rectangles only a search finds it.';
  }

  function reason(s, mv) {
    const sh = shapeOf(s);
    const W = winning(s), all = moves(s);
    const took = mv ? describe(mv.m, s, 'you') : '';
    switch (sh) {
      case 'row':
      case 'col':
        return 'Only one line of chocolate is left: eat everything except the poison, and I am left with the poisoned square alone. ' + took;
      case 'square':
        return '**The L strategy.** Bite off the square diagonally next to the poison: that eats the whole top-right block and leaves an L with two arms of the same length. From then on, whatever I bite from one arm, bite the same from the other. The arms stay equal, so you are never the one left with only the poison. ' + took;
      case 'L': {
        const a = s[0] - 1, b = s.length - 1;
        return 'Only two arms are left beside the poison: ' + sq(a) + ' along the bottom and ' + sq(b) + ' up the side. **Make them equal**, then copy each of my bites on the other arm — a symmetry strategy, as in Nim with two equal rows. ' + took;
      }
      case 'two-rows':
      case 'two-cols': {
        const t = sh === 'two-rows' ? s : transpose(s);
        const line = sh === 'two-rows' ? 'row' : 'column';
        return 'With two ' + line + 's there is a formula. The positions to leave me are those where the first ' + line + ' (with the poison) is **exactly one square longer** than the second — like 5 and 4. From such a position every bite I take can be answered by biting back to one of them, until I am left with the poison and one square beside it… and then the poison alone. Now the ' + line + 's are ' + t[0] + ' and ' + (t[1] || 0) + '. ' + took;
      }
      default: {
        const rect = isRect(s);
        return (rect ? 'A full rectangle of ' + s.length + ' rows is always a win for the first player (see the explanation) — but ' : 'With three or more rows ') +
          'no formula is known: the winning bites are found by working backwards. Mark the poison alone “lost”; a position is “won” if some bite leads to a “lost” one, and “lost” if every bite leads to a “won” one. Here only **' + numw(W.length) + '** of the ' + all.length + ' possible bites win. ' + took + ' Every bite I can take from there lets you back into a lost position for me.';
      }
    }
  }

  function goalOf(d) {
    return 'A bite takes a square and every square above it and to its right. Whoever has to eat the **poisoned square** (bottom left) loses. ' + (d.first === 'cpu' ? 'I bite first — then win.' : 'You bite first — win.');
  }

  /* ---------- the view ---------- */

  const Q = 84;
  const X = (x) => x * Q, Y = (y) => -(y + 1) * Q;
  const SKULL = (cx, cy, k) => '<g class="ch-skull" transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')">' +
    '<path d="M-15 4C-19-2-19-16-10-21C-4-24 4-24 10-21C19-16 19-2 15 4L11 6V13H-11V6Z"/>' +
    '<circle cx="-7" cy="-7" r="5.2" class="ch-eye"/><circle cx="7" cy="-7" r="5.2" class="ch-eye"/>' +
    '<path d="M0-1L-3 4H3Z" class="ch-eye"/><path d="M-6 8V13M0 8V13M6 8V13" class="ch-teeth"/></g>';

  function view(orig) {
    return function (ctx, g0, top) {
      const H = orig.length, Wd = orig[0];
      ctx.s('rect', { x: -16, y: Y(H - 1) - 16, width: Wd * Q + 32, height: H * Q + 32, rx: 18, class: 'ch-foil' }, g0);
      ctx.s('path', { d: 'M' + 2 + ' ' + (Y(H - 1) - 8) + 'H' + (Wd * Q * 0.45), class: 'ch-foil-shine' }, g0);
      for (let x = 0; x < Wd; x++) ctx.s('text', { x: X(x) + Q / 2, y: 44, class: 'ch-ax', 'text-anchor': 'middle', text: String(x + 1) }, g0);
      for (let y = 0; y < H; y++) ctx.s('text', { x: -34, y: Y(y) + Q / 2, class: 'ch-ax', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(y + 1) }, g0);
      const sqG = ctx.s('g', {}, g0);
      const cells = [];
      for (let y = 0; y < H; y++) {
        cells.push([]);
        for (let x = 0; x < orig[y]; x++) {
          const g = ctx.s('g', { class: 'ch-sq' + (!x && !y ? ' poison' : '') }, sqG);
          const inner = ctx.s('g', { class: 'ch-in' }, g);
          ctx.s('rect', { x: X(x) + 3, y: Y(y) + 3, width: Q - 6, height: Q - 6, rx: 10, class: 'ch-choc', 'data-key': 'c' + x + '-' + y }, inner);
          ctx.s('rect', { x: X(x) + 13, y: Y(y) + 13, width: Q - 26, height: Q - 26, rx: 6, class: 'ch-choc-in' }, inner);
          ctx.s('path', { d: 'M' + (X(x) + 17) + ' ' + (Y(y) + Q - 19) + 'V' + (Y(y) + 19) + 'H' + (X(x) + Q - 19), class: 'ch-shine' }, inner);
          if (!x && !y) inner.insertAdjacentHTML('beforeend', SKULL(X(0) + Q / 2, Y(0) + Q / 2 + 1, 1.05));
          cells[y].push({ g, inner, x, y });
        }
      }
      const lenT = [];
      for (let y = 0; y < H; y++) lenT.push(ctx.s('text', { y: Y(y) + Q / 2, class: 'ch-len', 'dominant-baseline': 'central' }, g0));
      const crumbs = ctx.s('g', { class: 'ch-crumbs' }, top);
      const tag = ctx.s('g', { class: 'ch-tag' }, top);
      const tagR = ctx.s('rect', { rx: 14, height: 34 }, tag);
      const tagT = ctx.s('text', { 'dominant-baseline': 'central', 'text-anchor': 'middle' }, tag);
      tag.style.display = 'none';
      let stop = null, cur = orig.slice();
      const each = (fn) => cells.forEach((row) => row.forEach(fn));
      const inS = (s, c) => c.y < s.length && c.x < s[c.y];

      function place(s) {
        each((c) => {
          c.g.removeAttribute('transform');
          c.g.style.opacity = '';
          c.g.style.display = inS(s, c) ? '' : 'none';
          c.g.classList.remove('cpu', 'bite', 'bad', 'mark');
        });
      }
      function draw(s, info, done) {
        if (stop) { stop(); stop = null; }
        crumbs.innerHTML = '';
        tag.style.display = 'none';
        lenT.forEach((t) => { t.textContent = ''; });
        cur = s.slice();
        if (!info || !info.m || !info.from) { place(s); done(); return; }
        const from = info.from, m = info.m;
        place(from);
        const gone = [];
        each((c) => { if (inS(from, c) && !inS(s, c)) gone.push(c); });
        const maxD = Math.max(1, ...gone.map((c) => c.x - m.x + c.y - m.y));
        const pop = () => {
          // crumbs: a few specks fly from every square that goes
          const specks = [];
          gone.forEach((c, i) => {
            for (let k = 0; k < 3; k++) {
              const a = ((i * 3 + k) * 2.39996) % (Math.PI * 2);
              const el = ctx.s('circle', { r: 3 + ((i + k) % 3) * 1.5, class: 'ch-crumb' }, crumbs);
              specks.push({ el, x: X(c.x) + Q / 2, y: Y(c.y) + Q / 2, vx: Math.cos(a) * 70, vy: -60 - ((i + k) % 4) * 25, d: (c.x - m.x + c.y - m.y) / maxD });
            }
          });
          stop = C.tween(C.anim(520), (t) => {
            gone.forEach((c) => {
              const d = (c.x - m.x + c.y - m.y) / maxD;
              const e = Math.max(0, Math.min(1, (t - d * 0.35) / 0.65));
              const cx = X(c.x) + Q / 2, cy = Y(c.y) + Q / 2;
              c.g.setAttribute('transform', 'translate(' + cx + ' ' + (cy - 36 * e) + ') rotate(' + (e * (c.x % 2 ? 24 : -24)) + ') scale(' + (1 - 0.75 * e) + ') translate(' + (-cx) + ' ' + (-cy) + ')');
              c.g.style.opacity = String(1 - e);
            });
            specks.forEach((p) => {
              const e = Math.max(0, Math.min(1, (t - p.d * 0.35) / 0.65));
              p.el.setAttribute('cx', p.x + p.vx * e);
              p.el.setAttribute('cy', p.y + p.vy * e + 150 * e * e);
              p.el.style.opacity = String(e > 0 ? 1 - e : 0);
            });
          }, () => { stop = null; crumbs.innerHTML = ''; place(s); done(); }, 'linear');
        };
        if (info.who === 'cpu') {
          gone.forEach((c) => c.g.classList.add('cpu'));
          stop = C.tween(C.anim(420), () => {}, () => { stop = null; pop(); });
        } else pop();
      }
      function region(m, s) { const out = []; each((c) => { if (inS(s, c) && c.x >= m.x && c.y >= m.y) out.push(c); }); return out; }
      function moveAt(pt, s) {
        const x = Math.floor(pt[0] / Q), y = Math.floor(-pt[1] / Q);
        if (y < 0 || x < 0 || y >= s.length || x >= s[y]) return null;
        if (!x && !y) return { x, y, bad: s.length === 1 && s[0] === 1 ? 'Only the poison is left…' : 'That is the poisoned square! Eating it loses at once — bite somewhere else.' };
        return { x, y };
      }
      function preview(m, s) {
        each((c) => c.g.classList.remove('bite', 'bad'));
        if (!m) { tag.style.display = 'none'; return; }
        const r = region(m, s);
        r.forEach((c) => c.g.classList.add(m.bad ? 'bad' : 'bite'));
        const label = m.bad ? 'poison!' : 'bite ' + r.length;
        const w = 26 + label.length * 12;
        const topY = Y(s.length - 1) - 30;
        const xr = X(Math.max(...r.map((c) => c.x)) + 1) - Q / 2;
        tagR.setAttribute('x', xr - w / 2); tagR.setAttribute('y', topY - 17); tagR.setAttribute('width', w);
        tagT.setAttribute('x', xr); tagT.setAttribute('y', topY + 1);
        tagT.textContent = label;
        tag.setAttribute('class', 'ch-tag' + (m.bad ? ' bad' : ''));
        tag.style.display = '';
      }
      function mark(m, s) { clearMarks(); region(m, s).forEach((c) => c.g.classList.add('mark')); }
      function clearMarks() { each((c) => c.g.classList.remove('mark')); }
      function showReason(s) {
        s.forEach((r, y) => { lenT[y].setAttribute('x', X(r) + 14); lenT[y].textContent = String(r); });
      }
      return {
        box: { x0: -60, y0: Y(H - 1) - 60, x1: Wd * Q + 60, y1: 60 },
        draw, moveAt, preview, mark, clearMarks, showReason,
        destroy() { if (stop) stop(); }
      };
    };
  }

  /* ---------- checking and making positions ---------- */

  function checkData(d) {
    const r = d && d.rows;
    if (!Array.isArray(r) || !r.length) return 'rows are needed';
    if (r.length > 9) return 'at most 9 rows';
    if (r.some((v, i) => !Number.isInteger(v) || v < 1 || v > 10 || (i && v > r[i - 1]))) return 'rows must be whole numbers 1..10, never longer than the row below';
    if (d.first != null && d.first !== 'cpu') return 'first must be "cpu" or absent';
    return null;
  }

  function startOf(d) {
    if (d.first !== 'cpu') return { start: d.rows.slice(), opening: null };
    const x = cpuMove(d.rows);
    return { start: x.s, opening: { m: x.m, from: d.rows.slice() } };
  }

  // a staircase inside w × h: rows[0] = w, h rows, each at most the one below
  function young(rng, w, h, eat) {
    const rows = [w];
    for (let y = 1; y < h; y++) {
      const prev = rows[y - 1];
      let r = prev - (rng() < eat ? rng.range(0, Math.max(1, Math.ceil(prev / 3))) : 0);
      rows.push(Math.max(1, Math.min(prev, r)));
    }
    return rows;
  }

  function levelOf(d) {
    const s = startOf(d).start;
    const n = size(s), sh = shapeOf(s);
    const W = winning(s).length, all = moves(s).length;
    if (sh === 'row' || sh === 'col') return 1;
    if (sh === 'L') return n <= 9 ? 1 : 2;
    if (sh === 'square') return s.length <= 4 ? 1 : 2;
    if (sh === 'two-rows' || sh === 'two-cols') return n <= 10 && W === 1 ? 1 : 2;
    const rows = Math.min(s.length, s[0]);
    let lv = rows <= 3 ? (n <= 12 ? 3 : 3) : rows === 4 ? 4 : 5;
    if (rows === 3 && n <= 8) lv = 2;
    if (d.first === 'cpu' && lv < 5 && rows >= 4) lv++;
    if (W / all > 0.25 && lv > 2) lv--;
    return Math.max(1, Math.min(5, lv));
  }

  function titleOf(d) {
    const r = d.rows, sh = shapeOf(r);
    const h = r.length, w = r[0];
    if (isRect(r)) return (sh === 'square' ? 'A Square Bar, ' : 'A Bar of ') + h + ' × ' + w;
    if (sh === 'L') return 'The L of ' + (w - 1) + ' and ' + (h - 1);
    if (sh === 'two-rows') return 'Two Rows: ' + r[0] + ' and ' + r[1];
    if (sh === 'two-cols') { const t = transpose(r); return 'Two Columns: ' + t[0] + ' and ' + t[1]; }
    return 'A Nibbled ' + h + ' × ' + w + ' Bar';
  }
  function textOf(d) {
    const r = d.rows, n = size(r), full = r[0] * r.length;
    const what = isRect(r) ? 'A bar of chocolate, ' + numw(r.length) + ' rows of ' + r[0] + ' squares.' :
      'A bar of ' + r.length + ' × ' + r[0] + ' squares that someone has already nibbled: ' + n + ' of the ' + full + ' squares are left.';
    return what + ' The square at the bottom left is poisoned. ' + (d.first === 'cpu' ? 'I take the first bite, and I never make a mistake when I can help it — but here I cannot help it.' : 'You take the first bite, and the computer never makes a mistake.');
  }

  function generate(rng, level) {
    for (let tries = 0; tries < 60; tries++) {
      let d;
      const k = rng();
      if (level === 1) {
        if (k < 0.35) { const n = rng.range(3, 6); d = { rows: [n, n] }; }
        else if (k < 0.7) { const a = rng.range(2, 5), b = rng.range(1, 4); if (a - 1 === b) continue; d = { rows: [a + 1].concat(new Array(b).fill(1)) }; }
        else if (k < 0.85) { const n = rng.range(3, 4); d = { rows: new Array(n).fill(n) }; }
        else { const a = rng.range(3, 6), b = rng.range(1, a); if (a === b + 1) continue; d = { rows: [a, b] }; }
      } else if (level === 2) {
        if (k < 0.3) { const a = rng.range(5, 9), b = rng.range(1, a); if (a === b + 1) continue; d = { rows: [a, b] }; }
        else if (k < 0.5) { const n = rng.range(5, 6); d = { rows: new Array(n).fill(n) }; }
        else if (k < 0.7) { const a = rng.range(5, 8), b = rng.range(3, 7); if (a - 1 === b) continue; d = { rows: [a].concat(new Array(b).fill(1)) }; }
        else if (k < 0.85) { const t = [rng.range(4, 8)]; t.push(rng.range(1, t[0])); d = { rows: transpose(t) }; if (t[0] === t[1] + 1) continue; }
        else d = { rows: young(rng, rng.range(3, 4), 3, 0.7) };
      } else if (level === 3) {
        d = k < 0.5 ? { rows: new Array(3).fill(rng.range(3, 6)) } : { rows: young(rng, rng.range(4, 6), 3, 0.8) };
      } else if (level === 4) {
        if (k < 0.35) d = { rows: new Array(4).fill(rng.range(5, 7)) };
        else if (k < 0.5) d = { rows: new Array(3).fill(rng.range(7, 8)) };
        else if (k < 0.85) d = { rows: young(rng, rng.range(5, 6), 4, 0.8) };
        else { d = { rows: young(rng, rng.range(4, 6), 3 + rng.int(2), 0.9), first: 'cpu' }; }
      } else {
        if (k < 0.35) { const h = rng.range(5, 6); d = { rows: new Array(h).fill(rng.range(h + 1, 8)) }; }
        else if (k < 0.75) d = { rows: young(rng, rng.range(6, 8), rng.range(5, 6), 0.8) };
        else d = { rows: young(rng, rng.range(5, 7), rng.range(4, 5), 0.9), first: 'cpu' };
      }
      if (!d || checkData(d)) continue;
      if (d.first === 'cpu') { if (size(d.rows) < 4 || win(d.rows)) continue; }
      else if (!win(d.rows)) continue;
      if (levelOf(d) !== level) continue;
      return d;
    }
    return null;
  }

  C.chompGame = { bite, moves, win, winning, size, shapeOf, transpose, bestMove, cpuMove, levelOf, titleOf, textOf, generate, checkData, startOf, goalOf };

  /* ---------- the engine ---------- */

  C.engine({
    id: 'chomp',
    name: 'Chomp',
    deps: ['js/lib/duel.js'],
    movesLabel: 'Bites',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: '**You bite first; the computer answers.** Point at a square: it lifts together with every square above it and to its right — that is the bite. Click to take it. Whoever is left with only the poisoned square (bottom left, with the skull) has to eat it and **loses**.\n\nThe computer searches every position and never slips: let it in and it will win — but **Take back** (or Undo) is always there. Hints give the winning bite first, then the reason.',

    verify(p) {
      const d = p.data;
      const e = checkData(d);
      if (e) return { ok: false, err: e };
      if (d.first === 'cpu') {
        if (size(d.rows) < 2) return { ok: false, err: 'nothing to bite' };
        if (win(d.rows)) return { ok: false, err: 'the computer would win moving first from here' };
        return { ok: true };
      }
      if (size(d.rows) < 2) return { ok: false, err: 'only the poison: the game is over before it starts' };
      if (!win(d.rows)) return { ok: false, err: 'the first player loses from here — the start must be a win for you' };
      return { ok: true };
    },

    generate(rng, level) {
      const d = generate(rng, level);
      if (!d) return null;
      return { title: titleOf(d), text: textOf(d), diff: level, data: d };
    },

    mount(ctx, p) {
      const d = p.data;
      const so = startOf(d);
      if (!p.goal) ctx.setGoal(goalOf(d));
      return C.duel(ctx, p, {
        start: so.start,
        opening: so.opening,
        moves: (s) => moves(s),
        wins: (s) => win(s),
        best: bestMove,
        cpu: cpuMove,
        same: (a, b) => !!a && !!b && a.x === b.x && a.y === b.y,
        describe,
        reason,
        explain() {
          const b = bestMove(so.start);
          const r = reason(so.start, b);
          return isRect(d.rows) && d.first !== 'cpu' && shapeOf(d.rows) === 'rect' ? r + '\n\n' + stealing() : r;
        },
        winMsg: 'Only the poisoned square is left, and it is my turn — you win!',
        loseMsg: 'Only the poisoned square is left for you — I win this time.',
        view: view(d.rows)
      });
    },

    thumb(p) {
      const r = p.data.rows, H = r.length, W = r[0], q = 20;
      let b = '<rect x="-4" y="-4" width="' + (W * q + 8) + '" height="' + (H * q + 8) + '" rx="5" fill="#c9d0d8"/>';
      r.forEach((len, y) => {
        for (let x = 0; x < len; x++) {
          const px = x * q, py = (H - 1 - y) * q;
          b += '<rect x="' + (px + 1) + '" y="' + (py + 1) + '" width="' + (q - 2) + '" height="' + (q - 2) + '" rx="3" fill="' + (!x && !y ? '#5a8a34' : '#6b3f22') + '"/>' +
            '<rect x="' + (px + 4) + '" y="' + (py + 4) + '" width="' + (q - 8) + '" height="' + (q - 8) + '" rx="2" fill="' + (!x && !y ? '#6fa543' : '#83502d') + '"/>';
        }
      });
      return '<svg viewBox="-8 -8 ' + (W * q + 16) + ' ' + (H * q + 16) + '" preserveAspectRatio="xMidYMid meet">' + b + '</svg>';
    }
  });

  C.css('chomp', `
    .ch-foil { fill: #c9d0d8; stroke: #8e98a4; stroke-width: 3; }
    [data-theme="light"] .ch-foil { fill: #d8dde3; }
    .ch-foil-shine { stroke: #fff; stroke-opacity: .45; stroke-width: 4; stroke-linecap: round; fill: none; }
    .ch-ax { font: 600 20px "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
    .ch-len { font: 800 26px "Segoe UI", system-ui, sans-serif; fill: var(--teal); }
    .ch-sq { cursor: pointer; }
    .ch-in { transition: transform .14s; }
    .ch-choc { fill: #6b3f22; stroke: #3e2312; stroke-width: 2.5; }
    .ch-choc-in { fill: #80502c; stroke: #5b361b; stroke-width: 2; }
    .ch-shine { fill: none; stroke: #fff; stroke-opacity: .2; stroke-width: 4; stroke-linecap: round; }
    .ch-sq.poison .ch-choc { fill: #3f6b27; stroke: #25431a; }
    .ch-sq.poison .ch-choc-in { fill: #578f36; stroke: #33591f; }
    .ch-skull path:first-child { fill: #f3f0e6; stroke: #25431a; stroke-width: 2; }
    .ch-skull .ch-eye { fill: #25431a; }
    .ch-skull .ch-teeth { stroke: #25431a; stroke-width: 2; fill: none; }
    .ch-sq.bite .ch-in { transform: translateY(-7px); }
    .ch-sq.bite .ch-choc { stroke: var(--gold); stroke-width: 5; }
    .ch-sq.bad .ch-choc { stroke: var(--red); stroke-width: 6; }
    .ch-sq.cpu .ch-choc { stroke: var(--pink); stroke-width: 6; stroke-dasharray: 9 6; }
    .ch-sq.mark .ch-choc { stroke: var(--gold); stroke-width: 6; stroke-dasharray: 12 7; }
    .ch-sq.mark .ch-in { animation: chmark 1s ease-in-out infinite; }
    @keyframes chmark { 50% { transform: translateY(-6px); } }
    .ch-crumb { fill: #5b361b; pointer-events: none; }
    .ch-tag { pointer-events: none; }
    .ch-tag rect { fill: var(--gold); }
    .ch-tag text { font: 700 20px "Segoe UI", system-ui, sans-serif; fill: #2a2006; }
    .ch-tag.bad rect { fill: var(--red); } .ch-tag.bad text { fill: #fff; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
