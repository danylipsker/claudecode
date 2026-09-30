/* The Puzzle Cabinet · engines/josephus.js
 *
 * Counting out: people stand in a circle, the count goes round clockwise and
 * every k-th person steps out of the circle; the count goes on from the next
 * one. Where must you stand to be the last one left? Pick a seat, press
 * Count, and watch. The answer is checked by simply playing the count.
 *
 * data: {
 *   n: 10, k: 3,          people, and every k-th is counted out
 *   start: 1,             the seat where the count begins (it counts "one")
 *   ask: 'last'           choose the seat that is left last
 *      | 'last2'          choose the two seats that are left last
 *      | 'group'          choose `stay` seats that are never counted out, while the others all are
 *      | 'count'          choose k (between kmin and kmax) so that `seat` is left last
 *   stay: 15, seat: 1, kmin: 2, kmax: 9,
 *   theme: 'kids' | 'sailors' | 'story'
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the count ---------- */

  // every elimination: the seats counted on the way, and who steps out
  function timeline(n, k, start) {
    const alive = [];
    for (let i = 1; i <= n; i++) alive.push(i);
    let idx = ((start || 1) - 1) % n;
    const out = [];
    while (alive.length) {
      const hops = [];
      for (let j = 0; j < k; j++) hops.push(alive[(idx + j) % alive.length]);
      idx = (idx + k - 1) % alive.length;
      const seat = alive.splice(idx, 1)[0];
      out.push({ hops, seat });
      if (idx >= alive.length) idx = 0;
    }
    return out;
  }
  const orderOf = (n, k, start) => timeline(n, k, start).map((e) => e.seat);
  const sortNum = (a) => a.slice().sort((x, y) => x - y);

  function answerOf(d) {
    const ask = d.ask || 'last', n = d.n;
    if (ask === 'count') {
      const ks = [];
      for (let k = d.kmin; k <= d.kmax; k++) { const o = orderOf(n, k, d.start); if (o[n - 1] === d.seat) ks.push(k); }
      return ks;
    }
    const o = orderOf(n, d.k, d.start);
    if (ask === 'last2') return sortNum(o.slice(n - 2));
    if (ask === 'group') return sortNum(o.slice(n - d.stay));
    return [o[n - 1]];
  }

  /* ---------- words ---------- */

  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const W = (k) => WORDS[k] || String(k);
  const ORD = (k) => { const s = ['th', 'st', 'nd', 'rd'], v = k % 100; return k + (s[(v - 20) % 10] || s[v] || s[0]); };
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const ordWord = (k) => ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'][k] || ORD(k);
  const nth = (k) => (k === 2 ? 'second' : k === 3 ? 'third' : ORD(k));
  const THEMES = {
    kids: { folk: 'children', one: 'child', out: 'sits down' },
    sailors: { folk: 'sailors', one: 'sailor', out: 'steps out' },
    story: { folk: 'people', one: 'person', out: 'steps out' }
  };
  const RHYMES = {
    4: ['Eeny', 'meeny', 'miny', 'MOE!'],
    8: ['One potato', 'two potato', 'three potato', 'four', 'five potato', 'six potato', 'seven potato', 'MORE!']
  };

  function goalText(d) {
    const ask = d.ask || 'last', k = d.k;
    const every = 'every **' + nth(k) + '**';
    if (ask === 'count') return 'Choose the count — every 2nd, 3rd … — so that seat **' + d.seat + '** is the last one left.';
    if (ask === 'last2') return 'Pick **two** seats (you and a friend) that are the last two left when ' + every + ' one is counted out.';
    if (ask === 'group') return 'Choose the **' + d.stay + '** seats that stay (click to give them blue caps): counting ' + every + ', all ' + (d.n - d.stay) + ' others must go first.';
    return 'Pick the seat that is left **last** when ' + every + ' one is counted out' + (d.start && d.start !== 1 ? ', starting at seat **' + d.start + '**' : '') + '.';
  }

  function diffOf(d) {
    const n = d.n, k = d.k || 3, ask = d.ask || 'last';
    if (ask === 'group') return n <= 12 ? 3 : n <= 20 ? 4 : 5;
    let x = n <= 6 ? 1 : n <= 10 ? 2 : k === 2 ? (n <= 24 ? 2 : n <= 64 ? 3 : 4) : n <= 16 ? 3 : n <= 30 ? 4 : 5;
    if (ask === 'last2') x = Math.min(5, x + 1);
    if (ask === 'count') x = Math.max(2, Math.min(5, x + (n > 10 ? 1 : 0)));
    return x;
  }

  function textOf(d) {
    const T = THEMES[d.theme || 'kids'], n = d.n, k = d.k, ask = d.ask || 'last';
    const st = d.start && d.start !== 1 ? 'seat ' + d.start : 'seat 1';
    if (ask === 'count') return cap1(W(n)) + ' ' + T.folk + ' stand in a circle, and you are in seat ' + d.seat + '. You get to choose the counting-out rhyme: whether every 2nd, 3rd, … up to every ' + nth(d.kmax) + ' ' + T.one + ' ' + T.out + '. The count starts at ' + st + ' and goes round clockwise. Which count leaves you as the last one standing?';
    const base = cap1(W(n)) + ' ' + T.folk + ' stand in a circle. Starting at ' + st + ' and going clockwise, they count round, and every ' + nth(k) + ' ' + T.one + ' ' + T.out + '; the count goes on from the next ' + T.one + ' still standing.';
    if (ask === 'last2') return base + ' You and a friend want to be the last two left. Where should you both stand?';
    if (ask === 'group') return base + ' Choose the ' + d.stay + ' seats that are never counted out while the other ' + (n - d.stay) + ' are.';
    return base + ' The last one left wins. Where should you stand?';
  }

  // live hints: from the method to the answer
  function liveHints(d) {
    const ask = d.ask || 'last', n = d.n, k = d.k, st = d.start || 1;
    const ans = answerOf(d);
    const shift = st !== 1 ? ' Here the count starts at seat ' + st + ', so turn the whole answer ' + (st - 1) + ' seats clockwise.' : '';
    const h = [];
    if (ask === 'count') {
      h.push('Try the counts one by one in your head or with the pen: for each, who goes first, second … You can also run the count from seat ' + d.seat + '\'s point of view: you must never be the one counted to ' + '“out”.');
      h.push('Work it out for small circles first and grow it: with m people the last seat L becomes L + k for m + 1 people (going round past the end).');
      h.push('Every ' + nth(ans[0]) + (ans.length > 1 ? ' (or every ' + ans.slice(1).map(nth).join(', every ') + ')' : '') + ' leaves seat ' + d.seat + ' last.');
      return h;
    }
    if (ask === 'group') {
      const o = orderOf(n, k, st);
      h.push('Play the count yourself, one person at a time, with the pen: mark the seats as they go. The first ' + (n - d.stay) + ' marked must all be red.');
      h.push('The first five counted out are seats ' + o.slice(0, 5).join(', ') + '.');
      h.push('The seats that stay: ' + ans.join(', ') + '.');
      return h;
    }
    if (k === 2) {
      const m = 1 << Math.floor(Math.log2(n)), l = n - m;
      h.push('Every second one: when the number of people is a power of two — 1, 2, 4, 8, 16 … — the person where the count starts is always last, because each time round half go and the count comes back to the start.');
      h.push(n + ' = ' + m + ' + ' + l + '. After ' + l + ' people have gone, ' + m + ' are left — a power of two — and the count starts afresh at the next person. Who is that?' + (l ? ' (' + l + ' out means ' + (2 * l) + ' seats counted.)' : '') + shift);
    } else {
      h.push('Start small. With one person, seat 1 is last. Each extra person moves the answer ' + k + ' seats on: if seat L is last with m people, seat L + ' + k + ' is last with m + 1 (wrapping round past the end).');
      const vals = [];
      let J = 0;
      for (let m = 1; m <= n; m++) { J = m === 1 ? 0 : (J + k) % m; if (m >= n - 3 && m < n) vals.push(m + ' people → seat ' + (J + 1)); }
      h.push('Counting from seat 1: ' + vals.join(', ') + '. Now one more person.' + shift);
    }
    if (ask === 'last2') h.push('The last two are seats ' + ans.join(' and ') + '.');
    else h.push('Stand in seat ' + ans[0] + '.');
    return h;
  }

  /* ---------- making puzzles ---------- */

  function randomPuzzle(rng, level) {
    const r = rng();
    let d;
    const theme = rng.pick(['kids', 'kids', 'sailors', 'story']);
    if (level === 1) d = { n: rng.range(5, 7), k: rng.pick([2, 2, 3]), ask: 'last' };
    else if (level === 2) {
      if (r < 0.25) d = { n: rng.range(6, 8), ask: 'count', seat: rng.range(1, 8), kmin: 2, kmax: 6 };
      else d = { n: rng.range(8, 12), k: rng.pick([2, 3, 4]), ask: 'last' };
    } else if (level === 3) {
      if (r < 0.2) d = { n: rng.range(7, 10), k: rng.pick([2, 3]), ask: 'last2' };
      else if (r < 0.4) d = { n: rng.range(10, 14), k: 3, ask: 'last', start: 0 };
      else if (r < 0.7) d = { n: rng.range(13, 40), k: 2, ask: 'last' };
      else d = { n: rng.range(11, 16), k: rng.pick([3, 4, 5]), ask: 'last' };
    } else if (level === 4) {
      if (r < 0.2) d = { n: rng.range(11, 20), k: rng.pick([2, 3]), ask: 'last2' };
      else if (r < 0.4) d = { n: rng.range(8, 12), k: rng.pick([2, 3, 4]), ask: 'group', stay: 0 };
      else if (r < 0.65) d = { n: rng.range(41, 100), k: 2, ask: 'last' };
      else d = { n: rng.range(17, 30), k: rng.pick([3, 4, 5, 6]), ask: 'last' };
    } else {
      if (r < 0.25) d = { n: rng.range(21, 41), k: rng.pick([3, 4]), ask: 'last2' };
      else if (r < 0.5) d = { n: rng.range(16, 30), k: rng.pick([3, 5, 7, 9]), ask: 'group', stay: 0 };
      else if (r < 0.7) d = { n: rng.range(12, 20), ask: 'count', seat: 0, kmin: 2, kmax: 9 };
      else d = { n: rng.range(31, 60), k: rng.pick([3, 4, 5, 6, 7]), ask: 'last' };
    }
    d.theme = d.ask === 'group' ? 'sailors' : theme;
    if (d.start === 0) d.start = rng.range(2, d.n);
    else d.start = 1;
    if (d.ask === 'group') d.stay = Math.floor(d.n / 2);
    if (d.ask === 'count') { if (!d.seat) d.seat = rng.range(1, d.n); d.k = 3; }
    return d;
  }

  C.engine({
    id: 'josephus',
    name: 'Counting out',
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Click a seat to stand there (a gold star marks you), then press **Count them out** — or the button in the middle of the circle, or Enter — and watch the count go round. If you are counted out, the count stops and you can try another seat; the fewer tries, the more stars. The pen, the highlighter and the paint pot are good for working it out first.',

    generate(rng, level) {
      for (let tries = 0; tries < 20; tries++) {
        const d = randomPuzzle(rng, level);
        const ans = answerOf(d);
        if (d.ask === 'count') {
          const allK = d.kmax - d.kmin + 1;
          if (!ans.length || ans.length > Math.max(1, allK / 3)) continue;
        }
        const df = diffOf(d);
        if (Math.abs(df - level) > 1) continue;
        return { title: titleOf(d), text: textOf(d), data: d, diff: level };
      }
      return null;
    },

    verify(p) {
      const d = p.data;
      if (!d || !(d.n >= 2) || d.n > 120) return { ok: false, err: 'n must be 2..120' };
      const ask = d.ask || 'last';
      if (!['last', 'last2', 'group', 'count'].includes(ask)) return { ok: false, err: 'unknown ask ' + ask };
      if (ask !== 'count' && !(d.k >= 1 && d.k <= 30)) return { ok: false, err: 'k must be 1..30' };
      if (d.start != null && !(d.start >= 1 && d.start <= d.n)) return { ok: false, err: 'start seat out of range' };
      if (ask === 'last2' && d.n < 3) return { ok: false, err: 'two survivors need at least 3 people' };
      if (ask === 'group' && !(d.stay >= 1 && d.stay < d.n)) return { ok: false, err: 'stay must be 1..n-1' };
      if (ask === 'count') {
        if (!(d.seat >= 1 && d.seat <= d.n) || !(d.kmin >= 1 && d.kmax >= d.kmin && d.kmax <= 30)) return { ok: false, err: 'seat, kmin and kmax are needed' };
      }
      const ans = answerOf(d);
      if (!ans.length) return { ok: false, err: 'no count leaves that seat last' };
      if (ask === 'count' && ans.length === d.kmax - d.kmin + 1) return { ok: false, err: 'every count works: no puzzle' };
      // the answer really survives when the count is played out
      const o = orderOf(d.n, ask === 'count' ? ans[0] : d.k, d.start);
      const keep = ask === 'group' ? d.stay : ask === 'last2' ? 2 : 1;
      const first = new Set(o.slice(0, d.n - keep));
      const who = ask === 'count' ? [d.seat] : ans;
      if (who.some((x) => first.has(x))) return { ok: false, err: 'simulation disagrees with the answer' };
      return { ok: true };
    },

    mount(ctx, p) {
      const d = p.data, wb = ctx.wb, n = d.n, S = ctx.s;
      const ask = d.ask || 'last', start = d.start || 1;
      const theme = d.theme || 'kids', T = THEMES[theme];
      const ANS = answerOf(d);
      const need = ask === 'last2' ? 2 : ask === 'group' ? d.stay : ask === 'last' ? 1 : 0;
      let pick = [], kk = ask === 'count' ? d.kmin : d.k, tries = 0, phase = 'pick', gone = [], tried = [], msg = '';
      let dead = false, speed = 1, run = null, solving = false;
      const timers = [];
      const later = (fn, ms) => { const t = setTimeout(() => { const i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); if (!dead) fn(); }, ms); timers.push(t); return t; };
      ctx.setGoal(goalText(d));

      /* the circle */
      const R = Math.max(130, n * 6.6);
      const sc = Math.min(2, (2 * Math.PI * R / n) / 26);
      const angle = (i) => -Math.PI / 2 + (i - 1) * 2 * Math.PI / n;
      const at = (i, r) => [Math.cos(angle(i)) * (r == null ? R : r), Math.sin(angle(i)) * (r == null ? R : r)];
      const rug = R + 66 * sc;
      wb.setBounds({ x0: -rug - 8, y0: -rug - 8, x1: rug + 8, y1: rug + 8 }, 0.04);
      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      const pre = 'jo' + (++uid);
      const PAL = {
        kids: { rug: ['#6fae55', '#4f8a3c'], ring: 'rgba(255,255,255,.18)' },
        sailors: { rug: ['#c9965a', '#9c6c38'], ring: 'rgba(60,30,5,.3)' },
        story: { rug: ['#9a948a', '#6e6a62'], ring: 'rgba(0,0,0,.2)' }
      }[theme];
      const defs = S('defs', null, bg);
      defs.innerHTML = '<radialGradient id="' + pre + '-rug" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="' + PAL.rug[0] + '"/><stop offset="1" stop-color="' + PAL.rug[1] + '"/></radialGradient>';
      S('circle', { cx: 4, cy: 8, r: rug, class: 'jo-rug-shadow' }, bg);
      S('circle', { cx: 0, cy: 0, r: rug, fill: 'url(#' + pre + '-rug)', class: 'jo-rug' }, bg);
      if (theme === 'sailors') {
        let dd = '';
        for (let y = -rug + 22; y < rug; y += 22) { const w = Math.sqrt(Math.max(0, rug * rug - y * y)); dd += 'M' + (-w).toFixed(1) + ' ' + y.toFixed(1) + 'H' + w.toFixed(1); }
        S('path', { d: dd, class: 'jo-planks' }, bg);
      } else if (theme === 'story') {
        const gr = C.rng('stones' + n);
        let dd = '';
        for (let k2 = 0; k2 < 40; k2++) { const a = gr() * Math.PI * 2, r0 = Math.sqrt(gr()) * rug * 0.95, x = Math.cos(a) * r0, y = Math.sin(a) * r0, w = 8 + gr() * 18; dd += 'M' + (x - w).toFixed(1) + ' ' + y.toFixed(1) + 'q' + w + ' ' + (-6 - gr() * 6).toFixed(1) + ' ' + (2 * w) + ' 0'; }
        S('path', { d: dd, class: 'jo-stones' }, bg);
      } else {
        const gr = C.rng('grass' + n);
        let dd = '';
        for (let k2 = 0; k2 < 90; k2++) { const a = gr() * Math.PI * 2, r0 = Math.sqrt(gr()) * rug * 0.96, x = Math.cos(a) * r0, y = Math.sin(a) * r0; dd += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'l-2 -6M' + (x + 3).toFixed(1) + ' ' + y.toFixed(1) + 'l1 -7'; }
        S('path', { d: dd, class: 'jo-grass' }, bg);
      }
      S('circle', { cx: 0, cy: 0, r: R, class: 'jo-ring', stroke: PAL.ring }, bg);
      // the start and the direction of the count
      const sa = angle(start), sr = R - 26 * Math.min(sc, 1.4) - 8;
      const a2 = sa + Math.min(0.5, 2.2 / n * Math.PI);
      S('path', { d: 'M' + (Math.cos(sa) * sr).toFixed(1) + ' ' + (Math.sin(sa) * sr).toFixed(1) + 'A' + sr + ' ' + sr + ' 0 0 1 ' + (Math.cos(a2) * sr).toFixed(1) + ' ' + (Math.sin(a2) * sr).toFixed(1), class: 'jo-dir' }, bg);
      const ah = [Math.cos(a2) * sr, Math.sin(a2) * sr], tang = [-Math.sin(a2), Math.cos(a2)], nrm = [Math.cos(a2), Math.sin(a2)];
      const hs = 7 * sc;
      S('path', { d: 'M' + (ah[0] + tang[0] * hs).toFixed(1) + ' ' + (ah[1] + tang[1] * hs).toFixed(1) + 'L' + (ah[0] + nrm[0] * hs * 0.8).toFixed(1) + ' ' + (ah[1] + nrm[1] * hs * 0.8).toFixed(1) + 'L' + (ah[0] - nrm[0] * hs * 0.8).toFixed(1) + ' ' + (ah[1] - nrm[1] * hs * 0.8).toFixed(1) + 'Z', class: 'jo-dir-head' }, bg);

      // seat numbers
      const gNum = S('g', { class: 'jo-nums' }, bg);
      const numEls = [];
      for (let i = 1; i <= n; i++) {
        const q = at(i, R + 46 * sc);
        numEls.push(S('text', { x: q[0].toFixed(1), y: (q[1] + 4.5 * Math.min(1.5, sc)).toFixed(1), 'text-anchor': 'middle', 'font-size': (11 * Math.min(1.5, sc)).toFixed(1), text: String(i), class: i === start ? 'start' : '' }, gNum));
      }

      // the pointer that walks round, the people
      const ptr = S('ellipse', { cx: 0, cy: 15 * sc, rx: 15 * sc, ry: 5.5 * sc, class: 'jo-ptr' }, board);
      const gFolk = S('g', null, board);
      const SHIRTS = ['#e4572e', '#f3a712', '#4caf50', '#2a9d8f', '#3f6fd8', '#9057d0', '#d9577f', '#f0c93a', '#26a0da', '#e0784a'];
      const SKIN = ['#f1c9a0', '#e2b089', '#c98f63', '#a86f48', '#f5d6b8'];
      const folk = [];
      for (let i = 1; i <= n; i++) {
        const q = at(i);
        const g = S('g', { transform: 'translate(' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ') scale(' + sc.toFixed(3) + ')', class: 'jo-seat' }, gFolk);
        const f = S('g', { class: 'jo-fig' }, g);
        S('ellipse', { cx: 0, cy: 15, rx: 11, ry: 3.6, class: 'jo-shadow' }, f);
        let shirt = SHIRTS[(i * 7) % SHIRTS.length];
        if (theme === 'sailors') shirt = '#f4f1e8';
        if (theme === 'story') shirt = ['#8a6a48', '#6f5a44', '#9b7b55', '#7b6450'][i % 4];
        const body = S('path', { d: 'M-9 15C-10 4 -9 -2 -5.5 -5H5.5C9 -2 10 4 9 15Z', fill: shirt, class: 'jo-body', 'data-key': 'seat' + i }, f);
        if (theme === 'sailors') S('path', { d: 'M-8.6 3H8.6M-9 8.5H9', class: 'jo-stripes' }, f);
        S('circle', { cx: 0, cy: -12, r: 7.5, fill: SKIN[(i * 3) % SKIN.length], class: 'jo-head' }, f);
        let cap = null;
        if (theme === 'sailors' || ask === 'group') cap = S('path', { d: 'M-7.6 -14C-6 -21 6 -21 7.6 -14Z', class: 'jo-cap' }, f);
        else if (theme === 'story') S('path', { d: 'M-8 -10C-9 -22 9 -22 8 -10C6 -17 -6 -17 -8 -10Z', class: 'jo-hood' }, f);
        else S('path', { d: 'M-7.3 -13.5C-6 -21 6 -21 7.3 -13.5C4 -17 -4 -17 -7.3 -13.5Z', fill: ['#3b2a1a', '#6b4423', '#c9a24a', '#2b2b2b', '#8a3b1c'][i % 5], class: 'jo-hair' }, f);
        S('circle', { cx: -2.6, cy: -11.5, r: 0.95, class: 'jo-eye' }, f);
        S('circle', { cx: 2.6, cy: -11.5, r: 0.95, class: 'jo-eye' }, f);
        const star = S('path', { d: starPath(0, -30, 7, 3), class: 'jo-star' }, f);
        const tick = S('text', { x: 0, y: -24, 'text-anchor': 'middle', class: 'jo-tried', text: '✗' }, f);
        const badge = S('g', { class: 'jo-badge' }, f);
        S('circle', { cx: 0, cy: -29, r: 7.5 }, badge);
        const bt = S('text', { x: 0, y: -25.8, 'text-anchor': 'middle' }, badge);
        folk.push({ g, f, body, cap, star, tick, badge, bt });
      }
      // speech bubble for the count
      const bub = S('g', { class: 'jo-bubble' }, top);
      const bubR = S('rect', { rx: 8 }, bub);
      const bubT = S('text', { 'text-anchor': 'middle' }, bub);
      bub.style.display = 'none';
      // the middle: a big button, then the count
      const mid = S('g', { class: 'jo-mid' }, top);
      const midR = Math.min(R * 0.42, Math.max(70, R * 0.28));
      S('circle', { r: midR, class: 'jo-mid-bg' }, mid);
      const midT = S('text', { y: 4, 'text-anchor': 'middle', class: 'jo-mid-t' }, mid);
      const midS = S('text', { y: 4 + midR * 0.42, 'text-anchor': 'middle', class: 'jo-mid-s' }, mid);
      midT.style.fontSize = (midR * 0.36).toFixed(1) + 'px';
      midS.style.fontSize = Math.max(10, midR * 0.2).toFixed(1) + 'px';

      function starPath(cx, cy, ro, ri) {
        let s = '';
        for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? ri : ro; s += (j ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(2) + ' ' + (cy + Math.sin(a) * r).toFixed(2); }
        return s + 'Z';
      }

      /* the panel */
      const panel = ctx.h('div.jo-panel');
      let kEl = null, cntEl = null;
      if (ask === 'count') {
        kEl = ctx.h('b.jo-k');
        panel.appendChild(ctx.h('div.jo-step',
          ctx.h('button.btn.small', { type: 'button', title: 'Fewer', onclick: () => setK(kk - 1) }, '−'),
          ctx.h('span', 'every ', kEl, ' one'),
          ctx.h('button.btn.small', { type: 'button', title: 'More', onclick: () => setK(kk + 1) }, '+')));
      }
      if (ask === 'group') { cntEl = ctx.h('div.jo-cnt'); panel.appendChild(cntEl); }
      const goBtn = ctx.h('button.btn.primary', { type: 'button', onclick: () => go() }, 'Count them out');
      const fastBtn = ctx.h('button.btn.small', { type: 'button', onclick: () => { speed = speed >= 4 ? 1 : speed * 2; fastBtn.textContent = speed >= 4 ? 'Normal speed' : 'Faster ×' + speed * 2; } }, 'Faster ×2');
      const skipBtn = ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => skip() }, 'Skip to the end');
      panel.append(ctx.h('div.jo-row', goBtn), ctx.h('div.jo-row', fastBtn, skipBtn));
      ctx.panel.appendChild(panel);

      function setK(v) {
        if (phase === 'run') return;
        kk = Math.max(d.kmin, Math.min(d.kmax, v));
        if (phase !== 'pick') resetCircle();
        draw();
        ctx.changed('k');
      }
      function ready() { return ask === 'count' ? true : pick.length === need; }
      function resetCircle() { phase = 'pick'; gone = []; msg = ''; }

      /* drawing */
      function draw() {
        const goneAt = new Map(gone.map((x, j) => [x, j + 1]));
        folk.forEach((F, j) => {
          const i = j + 1;
          const o = goneAt.get(i);
          F.g.classList.toggle('out', !!o);
          const q = at(i), len = Math.hypot(q[0], q[1]) || 1;
          F.f.style.transform = o ? 'translate(' + (q[0] / len * 18).toFixed(1) + 'px,' + (q[1] / len * 18).toFixed(1) + 'px) scale(.8)' : '';
          F.badge.style.display = o ? '' : 'none';
          F.bt.textContent = o ? String(o) : '';
          const me = ask === 'count' ? i === d.seat : pick.includes(i);
          F.star.style.display = me && ask !== 'group' && !o ? '' : 'none';
          F.star.classList.toggle('friend', ask === 'last2' && pick.length === 2 && pick[1] === i);
          F.g.classList.toggle('me', me);
          if (F.cap) {
            F.cap.classList.toggle('blue', ask === 'group' && pick.includes(i));
            F.cap.classList.toggle('red', ask === 'group' && !pick.includes(i));
          }
          F.tick.style.display = ask === 'last' && tried.includes(i) && !me && !o ? '' : 'none';
        });
        if (kEl) kEl.textContent = nth(kk);
        if (cntEl) cntEl.innerHTML = 'Blue caps: <b>' + pick.length + '</b> of ' + d.stay;
        const running = phase === 'run';
        goBtn.disabled = running || !ready() || (phase === 'done');
        goBtn.textContent = phase === 'fail' ? 'Count again' : 'Count them out';
        fastBtn.hidden = skipBtn.hidden = !running;
        mid.classList.toggle('ready', !running && ready() && phase !== 'done');
        if (!running) {
          midT.textContent = phase === 'done' ? '★' : phase === 'fail' ? 'Again?' : ready() ? 'Count!' : '?';
          midS.textContent = phase === 'done' ? 'the last!' : phase === 'fail' ? 'pick again' : ready() ? 'every ' + nth(kk) : (ask === 'group' ? 'choose ' + d.stay : ask === 'last2' ? 'pick two seats' : 'pick a seat');
        }
        if (!running) { ptr.style.display = 'none'; bub.style.display = 'none'; }
        wb.applyPaints();
      }

      /* choosing */
      function seatAt(pt) {
        const r = Math.hypot(pt[0], pt[1]);
        if (r < R - 44 * sc || r > R + 50 * sc) return 0;
        let a = Math.atan2(pt[1], pt[0]) + Math.PI / 2;
        a = ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return (Math.round(a / (2 * Math.PI / n)) % n) + 1;
      }
      function choose(i) {
        if (phase === 'run' || solving) return;
        if (phase === 'done') { ctx.say('Solved — press Reset to play it again.', 'info'); return; }
        if (phase === 'fail') resetCircle();
        if (ask === 'count') { ctx.say('Your seat is fixed at ' + d.seat + ' — change the count in the panel instead.', 'info'); draw(); return; }
        const at0 = pick.indexOf(i);
        if (at0 >= 0) pick.splice(at0, 1);
        else if (ask === 'group') {
          if (pick.length >= d.stay) { ctx.say('Already ' + d.stay + ' blue caps — click one to take it back first.', 'warn'); return; }
          pick.push(i);
        } else {
          pick.push(i);
          if (pick.length > need) pick.shift();
        }
        ctx.sfx('tap');
        ctx.say(ready() ? 'Ready: press **Count them out** (or click the middle).' : '');
        draw();
        ctx.changed('pick');
      }

      wb.handlers.board = {
        down(pt) {
          if (Math.hypot(pt[0], pt[1]) < midR) { go(); return true; }
          const i = seatAt(pt);
          if (!i) return false;
          choose(i);
          return true;
        }
      };

      /* the count */
      function showHop(i, count) {
        const q = at(i);
        ptr.style.display = '';
        ptr.style.transform = 'translate(' + q[0].toFixed(1) + 'px,' + q[1].toFixed(1) + 'px)';
        const words = theme === 'kids' && RHYMES[kk] ? RHYMES[kk] : null;
        const word = words ? words[count - 1] : String(count);
        bub.style.display = '';
        const fs = Math.max(11, 13 * Math.min(1.3, sc));
        bubT.style.fontSize = fs + 'px';
        bubT.textContent = word;
        const w = Math.max(fs * 1.9, word.length * fs * 0.58 + 14), h = fs * 1.7;
        const y = q[1] - 44 * sc;
        bubR.setAttribute('x', (q[0] - w / 2).toFixed(1)); bubR.setAttribute('y', (y - h / 2 - fs * 0.35).toFixed(1));
        bubR.setAttribute('width', w.toFixed(1)); bubR.setAttribute('height', h.toFixed(1));
        bubT.setAttribute('x', q[0].toFixed(1)); bubT.setAttribute('y', y.toFixed(1));
        bub.classList.toggle('outword', count === kk);
        midT.textContent = word;
        midS.textContent = gone.length + ' out · ' + (n - gone.length) + ' left';
      }
      function stopReason(seat) {
        const left = n - gone.length;
        if (ask === 'last' || ask === 'count') {
          const me = ask === 'count' ? d.seat : pick[0];
          if (seat === me) return 'fail';
          return left === 1 ? 'done' : null;
        }
        if (ask === 'last2') { if (pick.includes(seat)) return 'fail'; return left === 2 ? 'done' : null; }
        if (pick.includes(seat)) return 'fail';
        return gone.length === n - d.stay ? 'done' : null;
      }
      function finish(result, seat) {
        run = null;
        phase = result;
        ctx.lockUndo(false);
        if (result === 'done') {
          msg = ask === 'last' ? 'Seat ' + pick[0] + ' is the last one left!' :
            ask === 'last2' ? 'Seats ' + sortNum(pick).join(' and ') + ' are the last two!' :
            ask === 'group' ? 'All ' + (n - d.stay) + ' red caps went first; every blue cap stays.' :
            'Every ' + nth(kk) + ' — and seat ' + d.seat + ' is the last one left!';
          ctx.sfx('snap');
        } else {
          const ord = gone.length, left = n - gone.length;
          if (ask === 'last' && !tried.includes(pick[0])) tried.push(pick[0]);
          msg = ask === 'group' ? 'A blue cap in seat ' + seat + ' was counted out, the ' + ordWord(ord) + ' to go. Change some caps and count again.' :
            ask === 'count' ? 'With every ' + nth(kk) + ', seat ' + d.seat + ' was counted out ' + ordWord(ord) + ', with ' + left + ' still in the circle. Try another count.' :
            ask === 'last2' ? 'Seat ' + seat + ' was counted out ' + ordWord(ord) + ', with ' + left + ' still standing. Try another pair.' :
            'Seat ' + seat + ' was counted out — the ' + ordWord(ord) + ' to go, with ' + left + ' still in the circle. Try another seat.';
          ctx.sfx('wrong');
        }
        ctx.say(msg, result === 'done' ? 'good' : 'warn');
        draw();
        ctx.changed(solving ? 'solve' : 'count');
        solving = false;
      }
      function go(fast) {
        if (phase === 'run') return;
        if (phase === 'done') return;
        if (phase === 'fail') { resetCircle(); draw(); }
        if (!ready()) { ctx.say(ask === 'group' ? 'Give exactly ' + d.stay + ' sailors blue caps first.' : ask === 'last2' ? 'Pick two seats first.' : 'Pick a seat first: click one of the ' + T.folk + '.', 'warn'); ctx.sfx('tap'); return; }
        if (!solving) { tries++; ctx.stat('Tries', tries); }
        phase = 'run';
        gone = [];
        speed = fast ? 8 : 1;
        fastBtn.textContent = 'Faster ×2';
        ctx.lockUndo(true);
        ctx.say('Counting every ' + nth(kk) + '…', 'info');
        draw();
        const tl = timeline(n, kk, start);
        run = { tl, e: 0, h: 0 };
        const base = Math.max(55, Math.min(300, 7000 / (n * kk)));
        const tick = () => {
          if (!run || dead) return;
          const ev = run.tl[run.e];
          const i = ev.hops[run.h];
          showHop(i, run.h + 1);
          if (run.h < kk - 1) { run.h++; later(tick, C.anim(base) / speed); return; }
          // the k-th steps out
          gone.push(ev.seat);
          run.e++; run.h = 0;
          draw();
          ctx.sfx('tap');
          const why = stopReason(ev.seat);
          if (why) { run.stop = { why, seat: ev.seat }; later(() => finish(why, ev.seat), C.anim(base * 2) / speed); return; }
          later(tick, C.anim(base * 2.2) / speed);
        };
        tick();
      }
      // jump to the end of the count (every elimination so far is in `gone`, run.e is the next one)
      function skip() {
        if (!run) return;
        timers.forEach(clearTimeout);
        timers.length = 0;
        let stop = run.stop;
        while (!stop && run.e < run.tl.length) {
          const ev = run.tl[run.e++];
          gone.push(ev.seat);
          const why = stopReason(ev.seat);
          if (why) stop = { why, seat: ev.seat };
        }
        finish(stop ? stop.why : 'done', stop ? stop.seat : 0);
      }

      draw();

      return {
        check() {
          if (phase === 'done') return { solved: true, msg, stars: tries <= 1 ? 3 : tries === 2 ? 2 : 1 };
          if (phase === 'run') return { solved: false, msg: 'Wait for the count to finish.' };
          return { solved: false, msg: ready() ? 'Press **Count them out** to see whether you are right.' : 'Choose first, then count.' };
        },
        hint(k2) {
          const hs = liveHints(d);
          if (k2 >= hs.length) return null;
          return hs[k2];
        },
        solve() {
          timers.forEach(clearTimeout);
          timers.length = 0;
          run = null;
          if (ask === 'count') kk = ANS[0];
          else pick = ANS.slice();
          phase = 'pick'; gone = [];
          solving = true;
          go(true);
        },
        explain() {
          const o = orderOf(n, ask === 'count' ? ANS[0] : kk, start);
          let t;
          if (ask === 'count') t = 'Every ' + nth(ANS[0]) + ' leaves seat ' + d.seat + ' last. The order out: ' + o.join(', ') + '.';
          else t = 'The order out is ' + o.join(', ') + '.';
          if (ask === 'last' && d.k === 2) {
            const m = 1 << Math.floor(Math.log2(n)), l = n - m;
            t += ' With every second one out, write the number of people as a power of two plus the rest: ' + n + ' = ' + m + ' + ' + l + '. The last one is seat 2 × ' + l + ' + 1 = ' + (2 * l + 1) + ' counting from the start — in [[c:binary|binary]], move the leading 1 of ' + n.toString(2) + ' to the end: ' + (2 * l + 1).toString(2) + '.';
          } else if (ask === 'last' || ask === 'last2') {
            t += ' Josephus\'s rule: if seat L is last among m people, seat L + k (counted round the circle, [[c:modular|modulo]] m + 1) is last among m + 1. Building up from one person gives the answer without playing the count at all.';
          }
          return t;
        },
        getState() {
          return { pick: pick.slice(), k: kk, tries, phase: phase === 'run' ? 'pick' : phase, gone: phase === 'run' ? [] : gone.slice(), tried: tried.slice(), msg };
        },
        setState(s) {
          if (!s) return;
          timers.forEach(clearTimeout);
          timers.length = 0;
          run = null; solving = false;
          pick = (s.pick || []).slice();
          kk = s.k || kk;
          tries = Math.max(tries, s.tries || 0);
          phase = s.phase || 'pick';
          gone = (s.gone || []).slice();
          tried = Array.from(new Set(tried.concat(s.tried || [])));
          msg = s.msg || '';
          ctx.lockUndo(false);
          if (tries) ctx.stat('Tries', tries);
          draw();
        },
        key(ev) {
          if (ev.type !== 'keydown') return false;
          if (ev.key === 'Enter' && phase !== 'done' && phase !== 'run' && ready()) { go(); return true; }
          const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
          if (dir && phase !== 'run' && !solving) {
            if (ask === 'count') { setK(kk + dir); return true; }
            if (ask === 'last') {
              const cur = pick.length ? pick[0] : (dir > 0 ? n : 1);
              const nx = ((cur - 1 + dir + n) % n) + 1;
              if (phase === 'fail') resetCircle();
              if (phase !== 'done') { pick = [nx]; draw(); ctx.changed('pick'); }
              return true;
            }
          }
          return false;
        },
        destroy() { dead = true; timers.forEach(clearTimeout); wb.handlers.board = null; }
      };
    },

    thumb(p) {
      const d = p.data, n = d.n, R = 40;
      let s = '<svg viewBox="-56 -56 112 112" preserveAspectRatio="xMidYMid meet"><circle r="50" fill="var(--board-2)"/>';
      const r = Math.max(1.6, Math.min(6, 120 / n));
      for (let i = 1; i <= n; i++) {
        const a = -Math.PI / 2 + (i - 1) * 2 * Math.PI / n;
        const x = (Math.cos(a) * R).toFixed(1), y = (Math.sin(a) * R).toFixed(1);
        const fill = d.ask === 'count' && i === d.seat ? 'var(--gold)' : i === (d.start || 1) ? 'var(--green)' : 'var(--ink-2)';
        s += '<circle cx="' + x + '" cy="' + y + '" r="' + r.toFixed(1) + '" fill="' + fill + '"/>';
      }
      s += '<text y="7" text-anchor="middle" font-size="20" font-weight="800" fill="var(--gold)">' + (d.ask === 'count' ? '?' : d.k) + '</text>';
      return s + '</svg>';
    }
  });

  function titleOf(d) {
    const ask = d.ask || 'last';
    if (ask === 'count') return 'Choose the count for seat ' + d.seat;
    if (ask === 'last2') return 'The last two of ' + d.n;
    if (ask === 'group') return d.n + ' sailors, every ' + nth(d.k);
    return 'Every ' + nth(d.k) + ' of ' + d.n + (d.start && d.start !== 1 ? ', from seat ' + d.start : '');
  }

  let uid = 0;
  C.josephus = { timeline, orderOf, answerOf, textOf, titleOf, diffOf, goalText, randomPuzzle };

  C.css('josephus', `
    .jo-rug-shadow { fill: rgba(0, 0, 0, .25); }
    .jo-rug { stroke: rgba(0, 0, 0, .25); stroke-width: 2; }
    .jo-planks { stroke: rgba(70, 40, 10, .35); stroke-width: 1.4; fill: none; }
    .jo-stones { stroke: rgba(40, 36, 30, .35); stroke-width: 1.4; fill: none; }
    .jo-grass { stroke: rgba(30, 70, 20, .45); stroke-width: 1.2; fill: none; stroke-linecap: round; }
    .jo-ring { fill: none; stroke-width: 26; }
    .jo-dir { fill: none; stroke: rgba(255, 255, 255, .7); stroke-width: 2.4; stroke-dasharray: 4 4; }
    .jo-dir-head { fill: rgba(255, 255, 255, .8); }
    .jo-nums text { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: rgba(255, 255, 255, .85); pointer-events: none; paint-order: stroke; stroke: rgba(0, 0, 0, .35); stroke-width: 2.4px; }
    .jo-nums text.start { fill: #bdf5c9; }
    .jo-seat { cursor: pointer; }
    .jo-fig { transition: transform .45s cubic-bezier(.3, 1.4, .5, 1), opacity .45s; }
    .jo-seat.out .jo-fig { opacity: .38; }
    .jo-seat.out .jo-body, .jo-seat.out .jo-head { filter: grayscale(.8); }
    .jo-shadow { fill: rgba(0, 0, 0, .28); }
    .jo-body { stroke: rgba(0, 0, 0, .35); stroke-width: 1; }
    .jo-stripes { stroke: #2d4f9e; stroke-width: 2.2; }
    .jo-head { stroke: rgba(0, 0, 0, .3); stroke-width: .8; }
    .jo-eye { fill: #2b1d12; }
    .jo-hair { stroke: rgba(0, 0, 0, .25); stroke-width: .6; }
    .jo-hood { fill: #5d4a36; stroke: rgba(0, 0, 0, .3); stroke-width: .6; }
    .jo-cap { fill: #ffffff; stroke: #1c2f66; stroke-width: 1.2; }
    .jo-cap.blue { fill: #2f6fe0; stroke: #10245a; }
    .jo-cap.red { fill: #e0483b; stroke: #6a1510; }
    .jo-seat.me .jo-body { stroke: var(--gold); stroke-width: 2.2; }
    .jo-star { fill: #ffd166; stroke: #8a5a00; stroke-width: .8; filter: drop-shadow(0 0 3px rgba(255, 209, 102, .8)); }
    .jo-star.friend { fill: #dfe6f2; stroke: #5d6478; }
    .jo-tried { font: 800 11px "Segoe UI", system-ui, sans-serif; fill: rgba(255, 90, 80, .9); pointer-events: none; }
    .jo-badge circle { fill: #2b2f45; stroke: rgba(255, 255, 255, .6); stroke-width: 1; }
    .jo-badge text { font: 800 8.5px "Segoe UI", system-ui, sans-serif; fill: #fff; }
    .jo-ptr { fill: rgba(255, 209, 102, .35); stroke: var(--gold); stroke-width: 2.4; transition: transform .12s ease-out; pointer-events: none; }
    .jo-bubble rect { fill: #fffdf6; stroke: rgba(0, 0, 0, .35); stroke-width: 1; }
    .jo-bubble text { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 800; fill: #2b2f45; }
    .jo-bubble.outword rect { fill: #ffd166; }
    .jo-bubble { pointer-events: none; }
    .jo-mid { cursor: default; }
    .jo-mid.ready { cursor: pointer; }
    .jo-mid-bg { fill: rgba(20, 24, 45, .55); stroke: rgba(255, 255, 255, .35); stroke-width: 2; }
    .jo-mid.ready .jo-mid-bg { fill: var(--accent); stroke: #fff; animation: jopulse 1.6s ease-in-out infinite; }
    .jo-mid-t { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 800; fill: #fff; pointer-events: none; }
    .jo-mid-s { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 600; fill: rgba(255, 255, 255, .8); pointer-events: none; }
    .jo-panel { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .jo-row { display: flex; gap: 6px; flex-wrap: wrap; }
    .jo-step { display: flex; align-items: center; gap: 10px; }
    .jo-step b { color: var(--gold); }
    .jo-cnt b { color: var(--gold); }
    @keyframes jopulse { 50% { opacity: .82; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
