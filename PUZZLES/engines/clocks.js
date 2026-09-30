/* The Puzzle Cabinet · engines/clocks.js
 *
 * A clock face with hands you can turn. The minute hand is geared to the hour
 * hand 12 : 1 (and to the second hand 1 : 60), as in a real clock: drag either
 * hand, or anywhere on the face, and the others follow. Fine buttons and the
 * arrow keys move the time a minute or a second at a time.
 *
 * Time t = seconds after 12:00:00, on a 12-hour dial (0 ≤ t < 43200).
 *
 * data.kind:
 *  'set'     set the hands to the time asked; target: [t…] (any one), tol (seconds)
 *            cond: how verify works the targets out again:
 *              { at: t } | { angle: A, after: T } (first time after T with the hands A° apart)
 *              { sym: true, after: T } (hands mirror each other across the 12–6 line)
 *              { swap: [T0, T1] } (swapping the hands gives a real time; not an overlap)
 *              { rate: g, shows: T } (a clock gaining g min an hour, set right at 12, shows T)
 *              { mirror: T, axis: 'v' | 'h' }  (the time a reflection showing T really is)
 *  'mirror'  as 'set', with the reflected clock shown beside it (show: T, axis)
 *  'ask'     a question answered in the panel: answer { num, tol } | { choice, choices, vals };
 *            calc recomputes it; the clock shows `start` (fixed hands) unless noClock
 *  'cut'     draw straight lines across the face so the parts add up as asked:
 *            sum (every part) and parts, or sums (the list of part totals); maxLines;
 *            value: 'num' | 'I' (count the letters I on a Roman face); sol: [[g1, g2]…]
 *  face: 'arabic' | 'roman' (IV) | 'roman4' (IIII) | 'bare';  seconds: show the second hand
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;

  const DAY = 43200;
  const R = 10;
  const ROMAN = { IV: ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'], IIII: ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'] };

  /* ---------- the arithmetic of the hands ---------- */

  const mod = (a, m) => ((a % m) + m) % m;
  const hourDeg = (t) => mod(t / 120, 360);
  const minDeg = (t) => mod(t / 10, 360);
  const secDeg = (t) => mod(t * 6, 360);
  function angleAt(t) { const d = mod(minDeg(t) - hourDeg(t), 360); return Math.min(d, 360 - d); }
  // the first time strictly after T when the hands are A degrees apart
  function nextAngle(A, T, nth) {
    const k = 120 / 11, out = [];
    for (let j = -2; j < 30; j++) {
      out.push((A + 360 * j) * k);
      out.push((360 * j - A) * k);
    }
    const c = out.filter((t) => t > T + 1e-6).sort((a, b) => a - b);
    const uniq = c.filter((t, i) => i === 0 || t - c[i - 1] > 1e-6);
    return uniq[(nth || 1) - 1];
  }
  function nextSym(T) { const k = 360 * 120 / 13; let j = Math.floor(T / k) + 1; return j * k; }
  function swapTimes(T0, T1) {
    const out = [];
    for (let k = 0; k < 143 * 2; k++) { const t = DAY * k / 143; if (t >= T0 - 1e-6 && t < T1 - 1e-6 && k % 13) out.push(t); }
    return out;
  }
  const mirrorOf = (t, axis) => mod((axis === 'h' ? DAY / 2 : DAY) - t, DAY);
  function countTimes(kind, span) {
    const rels = kind === 'overlap' ? [0] : kind === 'opposite' ? [180] : kind === 'right' ? [90, 270] : [0, 180];
    let n = 0;
    rels.forEach((a) => { for (let j = 0; j < 100; j++) { const t = (a + 360 * j) * 120 / 11; if (t < span - 1e-6) n++; } });
    return n;
  }
  const romanOf = (h, style) => ROMAN[style === 'IV' ? 'IV' : 'IIII'][h % 12];
  function romanCount(letter, style) { let n = 0; for (let h = 1; h <= 12; h++) n += romanOf(h, style).split('').filter((c) => c === letter).length; return n; }

  function targetsOf(cond) {
    if (!cond) return null;
    if (cond.at != null) return [mod(cond.at, DAY)];
    if (cond.angle != null) return [mod(nextAngle(cond.angle, cond.after || 0, cond.nth), DAY)];
    if (cond.sym) return [mod(nextSym(cond.after || 0), DAY)];
    if (cond.swap) return swapTimes(cond.swap[0], cond.swap[1]);
    if (cond.rate != null) return [mod(cond.shows * 60 / (60 + cond.rate), DAY)];
    if (cond.mirror != null) return [mirrorOf(cond.mirror, cond.axis)];
    if (cond.same) return [0, DAY / 2];
    if (cond.marks != null) {
      // both hands exactly on minute marks, the minute hand `marks` marks ahead of the hour hand
      const out = [];
      for (let k = 0; k < 60; k++) { const mm = (12 * k) % 60; if (mod(mm - k - cond.marks, 60) === 0) out.push(k * 720); }
      return out;
    }
    return null;
  }
  function calc(c) {
    if (!c) return undefined;
    if (c.angle != null) return angleAt(c.angle);
    if (c.count) return countTimes(c.count, c.span || 2 * DAY);
    if (c.between) return 720 / 11;
    if (c.agree) return 720 / c.agree;              // total drift per day in minutes
    if (c.strike) { const [n, s, m] = c.strike; return (m - 1) * s / (n - 1); }
    if (c.strokes) return c.strokes === 'halves' ? 2 * (78 + 12) : 2 * 78;
    if (c.roman) return c.roman === 'all' ? ['I', 'V', 'X'].reduce((a, l) => a + romanCount(l, c.style), 0) : romanCount(c.roman, c.style);
    if (c.value != null) return c.value;
    return undefined;
  }

  function fmt(t, secs) {
    t = mod(Math.round(t), DAY);
    const h = Math.floor(t / 3600) || 12, m = Math.floor(t / 60) % 60, s = t % 60;
    return h + ':' + String(m).padStart(2, '0') + (secs === false ? '' : ':' + String(s).padStart(2, '0'));
  }
  function fmtExact(t) {
    // 3:16:21.8 — to a tenth of a second
    t = mod(t, DAY);
    const h = Math.floor(t / 3600) || 12, m = Math.floor(t / 60) % 60, s = t - Math.floor(t / 60) * 60;
    return h + ':' + String(m).padStart(2, '0') + ':' + (s < 10 ? '0' : '') + (Math.round(s * 10) / 10).toFixed(1);
  }
  const cdist = (a, b) => { const d = mod(a - b, DAY); return Math.min(d, DAY - d); };

  /* ---------- cutting the face ---------- */

  const RN = 7.6;                 // numerals sit on this circle when the face is cut
  const RG = RN * 0.965;          // the points the lines run through, between the numerals
  const gapPt = (g) => { const a = (g + 0.5) * 30 * Math.PI / 180; return [Math.sin(a) * RG, -Math.cos(a) * RG]; };
  const numPt = (h, r) => { const a = h * 30 * Math.PI / 180; return [Math.sin(a) * r, -Math.cos(a) * r]; };
  function valueOf(h, d) { return d.value === 'I' ? romanOf(h, d.face === 'roman' ? 'IV' : 'IIII').split('').filter((c) => c === 'I').length : h; }
  function groups(chords, d) {
    const map = new Map();
    for (let h = 1; h <= 12; h++) {
      const p = numPt(h % 12, RN);
      const sig = chords.map(([a, b]) => (G.side(p, gapPt(a), gapPt(b)) > 0 ? '1' : '0')).join('');
      if (!map.has(sig)) map.set(sig, { sig, nums: [], sum: 0 });
      const g = map.get(sig);
      g.nums.push(h);
      g.sum += valueOf(h, d);
    }
    return Array.from(map.values());
  }
  function cutOk(chords, d) {
    const gs = groups(chords, d);
    if (d.maxLines && chords.length > d.maxLines) return { ok: false, gs, msg: 'Use at most ' + C.plural(d.maxLines, 'line') + '.' };
    if (d.sums) {
      const a = gs.map((g) => g.sum).sort((x, y) => x - y), b = d.sums.slice().sort((x, y) => x - y);
      const ok = a.length === b.length && a.every((v, i) => v === b[i]);
      return { ok, gs, msg: ok ? '' : 'The parts add up to ' + a.join(', ') + '; the puzzle wants ' + b.join(', ') + '.' };
    }
    const ok = gs.length === d.parts && gs.every((g) => g.sum === d.sum);
    return { ok, gs, msg: ok ? '' : gs.length !== d.parts ? 'That makes ' + C.plural(gs.length, 'part') + ' with numbers in them, not ' + d.parts + '.' : 'The parts add up to ' + gs.map((g) => g.sum).join(', ') + ' — they must all be ' + d.sum + '.' };
  }
  // a convex region of the disc: the half-planes of the chords on the sides given by sig
  function regionPoly(chords, sig) {
    let poly = [];
    for (let i = 0; i < 90; i++) { const a = i / 90 * Math.PI * 2; poly.push([Math.cos(a) * R * 0.985, Math.sin(a) * R * 0.985]); }
    chords.forEach(([a, b], k) => {
      const A = gapPt(a), B = gapPt(b), want = sig[k] === '1' ? 1 : -1;
      const out = [];
      for (let i = 0; i < poly.length; i++) {
        const P = poly[i], Q = poly[(i + 1) % poly.length];
        const sp = G.side(P, A, B) * want, sq = G.side(Q, A, B) * want;
        if (sp >= 0) out.push(P);
        if ((sp >= 0) !== (sq >= 0)) { const x = G.lineCross(P, Q, A, B); if (x) out.push(x); }
      }
      poly = out;
    });
    return poly;
  }

  /* ---------- verify ---------- */

  function verify(p) {
    const d = p.data;
    if (!d || !d.kind) return { ok: false, err: 'data.kind is needed' };
    if (d.kind === 'set' || d.kind === 'mirror') {
      if (!d.target || !d.target.length) return { ok: false, err: 'target is needed' };
      const tg = targetsOf(d.cond);
      if (!tg) return { ok: false, err: 'cond is needed to check the target' };
      if (tg.length !== d.target.length || !tg.every((t, i) => Math.abs(t - d.target[i]) < 0.05)) return { ok: false, err: 'target ' + d.target.map(fmtExact) + ' but cond gives ' + tg.map(fmtExact) };
      if (d.kind === 'mirror' && (d.show == null || Math.abs(mirrorOf(d.show, d.axis) - d.target[0]) > 0.05)) return { ok: false, err: 'the mirror clock does not match the target' };
      const tol = d.tol == null ? 3 : d.tol;
      if (d.target.some((t) => cdist(t, d.start || 0) <= tol)) return { ok: false, err: 'already solved at the start' };
      return { ok: true };
    }
    if (d.kind === 'ask') {
      const a = d.answer;
      if (!a || (a.num == null && a.choice == null)) return { ok: false, err: 'answer is needed' };
      if (a.choice != null && (!a.choices || a.choice < 0 || a.choice >= a.choices.length)) return { ok: false, err: 'bad choice' };
      if (d.calc) {
        const v = calc(d.calc);
        if (v == null || isNaN(v)) return { ok: false, err: 'calc gives nothing' };
        if (a.num != null && Math.abs(v - a.num) > 1e-6) return { ok: false, err: 'answer ' + a.num + ' but calc gives ' + v };
        if (a.choice != null && (!a.vals || a.vals[a.choice] !== v)) return { ok: false, err: 'calc gives ' + v + ', not the chosen answer' };
      }
      return { ok: true };
    }
    if (d.kind === 'cut') {
      if (!d.sol) return { ok: false, err: 'sol is needed' };
      if (!d.sums && !(d.parts && d.sum)) return { ok: false, err: 'parts and sum (or sums) are needed' };
      if (d.sol.some(([a, b]) => a === b || a < 0 || b < 0 || a > 11 || b > 11)) return { ok: false, err: 'bad chord' };
      const r = cutOk(d.sol, d);
      if (!r.ok) return { ok: false, err: 'the stored lines fail: ' + r.msg };
      if (cutOk([], d).ok) return { ok: false, err: 'already solved' };
      return { ok: true };
    }
    return { ok: false, err: 'unknown kind ' + d.kind };
  }

  /* ---------- drawing a clock ---------- */

  function handPath(len, tail, w0, w1) {
    // a tapered hand with a small lozenge near the tip
    const L = -len, T = tail;
    return 'M' + (-w0) + ' ' + T + 'L' + (-w0 * 0.9) + ' 0L' + (-w1 * 1.9) + ' ' + (L * 0.78) + 'L0 ' + (L * 0.84) + 'L' + (w1 * 1.9) + ' ' + (L * 0.78) +
      'L' + (w0 * 0.9) + ' 0L' + w0 + ' ' + T + 'Z' + 'M' + (-w1 * 1.9) + ' ' + (L * 0.78) + 'L0 ' + L + 'L' + (w1 * 1.9) + ' ' + (L * 0.78) + 'L0 ' + (L * 0.84) + 'Z';
  }
  let uid = 0;
  function drawClock(parent, o) {
    const S = C.s;
    const id = 'ck' + (++uid);
    const g = S('g', { class: 'ck' + (o.cls ? ' ' + o.cls : ''), transform: 'translate(' + o.x + ' ' + o.y + ')' }, parent);
    const defs = S('defs', null, g);
    defs.innerHTML = '<radialGradient id="' + id + '-f" cx="50%" cy="40%" r="65%"><stop offset="0" class="ck-f0"/><stop offset="1" class="ck-f1"/></radialGradient>' +
      '<linearGradient id="' + id + '-r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="ck-r0"/><stop offset=".5" class="ck-r1"/><stop offset="1" class="ck-r2"/></linearGradient>';
    const body = S('g', { transform: o.mirror === 'v' ? 'scale(-1 1)' : o.mirror === 'h' ? 'scale(1 -1)' : null }, g);
    S('circle', { r: R + 0.9, class: 'ck-rim', fill: 'url(#' + id + '-r)' }, body);
    S('circle', { r: R, class: 'ck-face', fill: 'url(#' + id + '-f)' }, body);
    const ticks = S('g', { class: 'ck-ticks' }, body);
    for (let i = 0; i < 60; i++) {
      const a = i * 6 * Math.PI / 180, hr = i % 5 === 0;
      const r0 = hr ? R * 0.86 : R * 0.915, r1 = R * 0.965;
      S('line', { x1: Math.sin(a) * r0, y1: -Math.cos(a) * r0, x2: Math.sin(a) * r1, y2: -Math.cos(a) * r1, class: hr ? 'hr' : '' }, ticks);
    }
    const nums = S('g', { class: 'ck-nums' + (o.face === 'arabic' || !o.face ? '' : ' roman') }, body);
    const cutFace = !!o.cutFace;
    if (o.face !== 'bare') {
      for (let h = 1; h <= 12; h++) {
        if (o.face === 'arabic' || !o.face) {
          const pt = numPt(h % 12, cutFace ? RN : R * 0.72);
          S('text', { x: pt[0], y: pt[1] + (cutFace ? 0.42 : 0.6), 'text-anchor': 'middle', text: String(h), class: cutFace ? 'small' : '', 'data-key': o.keys ? 'n' + h : null }, nums);
        } else {
          const txt = romanOf(h, o.face === 'roman' ? 'IV' : 'IIII');
          const r = cutFace ? RN : R * 0.73;
          S('text', { x: 0, y: -r + 0.45, 'text-anchor': 'middle', text: txt, transform: 'rotate(' + h * 30 + ')', class: cutFace ? 'small' : '', 'data-key': o.keys ? 'n' + h : null }, nums);
        }
      }
    }
    if (o.maker !== false) S('text', { x: 0, y: -R * 0.36, 'text-anchor': 'middle', class: 'ck-maker', text: 'PUZZLE CABINET' }, body);
    const hands = S('g', { class: 'ck-hands' }, body);
    const shade = S('g', { class: 'ck-hand ck-shadows', transform: 'translate(.18 .3)' }, hands);
    const mk = (cls, d) => { const sg = S('g', null, shade); S('path', { d, class: 'sh' }, sg); const hg = S('g', { class: 'ck-hand ' + cls }, hands); S('path', { d }, hg); return { hg, sg }; };
    const H = mk('hour', handPath(5.5, 1.5, 0.34, 0.12));
    const M = mk('min', handPath(8.3, 1.9, 0.24, 0.085));
    let Sd = null, Ss = null;
    if (o.seconds) {
      Ss = S('g', null, shade);
      S('line', { x1: 0, y1: 2.6, x2: 0, y2: -8.9, class: 'sh' }, Ss);
      Sd = S('g', { class: 'ck-hand sec' }, hands);
      S('line', { x1: 0, y1: 2.6, x2: 0, y2: -8.9 }, Sd);
      S('circle', { cx: 0, cy: 1.9, r: 0.42 }, Sd);
    }
    S('circle', { r: 0.62, class: 'ck-cap' }, hands);
    S('circle', { r: 0.22, class: 'ck-cap2' }, hands);
    if (!o.hands) hands.style.display = 'none';
    const over = S('g', { class: 'ck-over' }, body);
    let cur = 0;
    const api = {
      g, body, over, id,
      set(t) {
        cur = t;
        const hr = 'rotate(' + hourDeg(t).toFixed(3) + ')', mn = 'rotate(' + minDeg(t).toFixed(3) + ')';
        H.hg.setAttribute('transform', hr); H.sg.setAttribute('transform', hr);
        M.hg.setAttribute('transform', mn); M.sg.setAttribute('transform', mn);
        if (Sd) { const sc = 'rotate(' + secDeg(Math.round(t)).toFixed(2) + ')'; Sd.setAttribute('transform', sc); Ss.setAttribute('transform', sc); }
      },
      get: () => cur,
      handsEl: hands,
      glow(on) { g.classList.toggle('ck-good', !!on); }
    };
    api.set(o.t || 0);
    return api;
  }

  /* ---------- mount ---------- */

  function mount(ctx, p) {
    const d = p.data, wb = ctx.wb, kind = d.kind;
    const board = wb.layer('board');
    let alive = true;
    const timers = [];
    const later = (fn, ms) => { const t = setTimeout(() => { if (alive) fn(); }, C.anim(ms)); timers.push(t); };
    const settable = kind === 'set' || kind === 'mirror';
    const face = d.face || 'arabic';
    let t = mod(d.start || 0, DAY);
    let clockX = 0;
    let mirrorClock = null;
    // on a phone the mirror goes above the real clock, else beside it
    const stacked = kind === 'mirror' && wb.isNarrow && wb.isNarrow();
    if (kind === 'mirror') {
      const mx = stacked ? 0 : -2 * R - 5, my = stacked ? -2 * R - 8.6 : 0;
      const frame = C.s('g', { class: 'ck-mirror' }, board);
      C.s('rect', { x: mx - R - 2.4, y: my - R - 2.4, width: 2 * R + 4.8, height: 2 * R + 4.8, rx: 1.4, class: 'ck-glass' }, frame);
      mirrorClock = drawClock(frame, { x: mx, y: my, face, hands: true, seconds: false, mirror: d.axis || 'v', t: d.show, cls: 'mirrored' });
      C.s('path', { d: 'M' + (mx - R - 1.6) + ' ' + (my - R + 3) + 'l5-5M' + (mx - R - 1.6) + ' ' + (my - R + 6) + 'l8-8M' + (mx + R - 3) + ' ' + (my + R + 1.6) + 'l4.4-4.4', class: 'ck-sheen' }, frame);
      C.s('text', { x: mx, y: stacked ? my + R + 3.7 : R + 5.5, 'text-anchor': 'middle', class: 'ck-cap-t', text: d.axis === 'h' ? 'reflected in still water' : 'seen in a mirror' }, frame);
      C.s('text', { x: 0, y: R + 5.5, 'text-anchor': 'middle', class: 'ck-cap-t', text: 'the real clock' }, board);
    }
    const noClock = kind === 'ask' && d.noClock;
    const clock = noClock ? null : drawClock(board, { x: clockX, y: 0, face, hands: kind !== 'cut', seconds: !!d.seconds, t, cutFace: kind === 'cut', keys: kind === 'cut' || kind === 'ask', maker: kind !== 'cut' });
    const readoutOn = settable && d.readout !== false;
    let readout = null;
    if (clock && readoutOn) {
      const rg = C.s('g', { class: 'ck-lcd' }, board);
      C.s('rect', { x: -4.2, y: R + 1.6, width: 8.4, height: 2.3, rx: 0.5 }, rg);
      readout = C.s('text', { x: 0, y: R + 3.28, 'text-anchor': 'middle' }, rg);
    }
    const x0 = kind === 'mirror' && !stacked ? -3 * R - 8 : -R - 2.6, y1 = R + (readoutOn || kind === 'mirror' ? 6.4 : 2);
    wb.setBounds({ x0, y0: stacked ? -3 * R - 11.3 : -R - 2.2, x1: R + 2.6, y1 }, 0.05);

    function show() {
      if (!clock) return;
      clock.set(t);
      if (readout) readout.textContent = fmt(t);
    }
    // animate the time to t2 (the hands sweep the short way round)
    function sweep(t2, ms, done) {
      const t0 = t;
      let dt = mod(t2 - t0, DAY);
      if (dt > DAY / 2) dt -= DAY;
      const start = performance.now(), dur = Math.max(1, C.anim(ms));
      const step = (now) => {
        if (!alive) return;
        const k = Math.min(1, (now - start) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        t = mod(t0 + dt * e, DAY);
        show();
        if (k < 1) requestAnimationFrame(step); else { t = mod(t2, DAY); show(); if (done) done(); }
      };
      requestAnimationFrame(step);
    }

    const inst = { noMoves: true, destroy() { alive = false; timers.forEach(clearTimeout); wb.handlers.board = null; } };

    if (settable) {
      const targets = d.target;
      const tol = d.tol == null ? 3 : d.tol;
      let drag = null;
      const angOf = (pt) => G.normDeg(Math.atan2(pt[0], -pt[1]) * 180 / Math.PI);
      const wrap = (a) => { a = mod(a + 180, 360) - 180; return a; };
      wb.handlers.board = {
        down(pt) {
          const r = Math.hypot(pt[0] - clockX, pt[1]);
          if (r > R + 1) return false;
          const a = angOf([pt[0] - clockX, pt[1]]);
          const dh = Math.abs(wrap(a - hourDeg(t))), dm = Math.abs(wrap(a - minDeg(t)));
          const hand = r < 6.2 && dh < 16 && (dh < dm || r < 4.5) ? 'hour' : 'min';
          drag = { hand, a, moved: false };
          clock.g.classList.add('drag-' + hand);
          return true;
        },
        move(pt) {
          if (!drag) return;
          const a = angOf([pt[0] - clockX, pt[1]]);
          const da = wrap(a - drag.a);
          drag.a = a;
          if (Math.abs(da) > 0) drag.moved = true;
          t = mod(t + da * (drag.hand === 'hour' ? 120 : 10), DAY);
          show();
        },
        up() {
          if (!drag) return;
          clock.g.classList.remove('drag-hour', 'drag-min');
          const moved = drag.moved;
          drag = null;
          t = mod(Math.round(t), DAY);
          show();
          if (moved) { ctx.sfx('tap'); ctx.changed('hands'); }
        },
        hover(pt) {
          if (!clock) return;
          const r = Math.hypot(pt[0] - clockX, pt[1]);
          clock.g.classList.toggle('hover', r <= R + 1);
        }
      };
      const nudge = (s) => { t = mod(Math.round(t) + s, DAY); show(); ctx.changed('hands'); };
      const row = ctx.h('div.ck-knobs',
        ctx.h('button.btn.small', { type: 'button', title: 'Back one hour (↓)', onclick: () => nudge(-3600) }, '−1 h'),
        ctx.h('button.btn.small', { type: 'button', title: 'Back one minute (←)', onclick: () => nudge(-60) }, '−1 min'),
        ctx.h('button.btn.small', { type: 'button', title: 'Back one second (Shift+←)', onclick: () => nudge(-1) }, '−1 s'),
        ctx.h('button.btn.small', { type: 'button', title: 'On one second (Shift+→)', onclick: () => nudge(1) }, '+1 s'),
        ctx.h('button.btn.small', { type: 'button', title: 'On one minute (→)', onclick: () => nudge(60) }, '+1 min'),
        ctx.h('button.btn.small', { type: 'button', title: 'On one hour (↑)', onclick: () => nudge(3600) }, '+1 h'));
      ctx.panel.appendChild(ctx.h('div.ck-panel', ctx.h('div.ck-knobt', 'Turn the hands, or fine-tune:'), row));
      inst.key = (ev) => {
        if (ev.type !== 'keydown') return false;
        const k = ev.key;
        if (k === 'ArrowRight') { nudge(ev.shiftKey ? 1 : 60); return true; }
        if (k === 'ArrowLeft') { nudge(ev.shiftKey ? -1 : -60); return true; }
        if (k === 'ArrowUp') { nudge(3600); return true; }
        if (k === 'ArrowDown') { nudge(-3600); return true; }
        return false;
      };
      const best = () => targets.reduce((b, x) => (cdist(x, t) < cdist(b, t) ? x : b), targets[0]);
      inst.check = (manual) => {
        const b = best(), off = cdist(b, t);
        if (off <= tol) { clock.glow(true); return { solved: true, msg: 'The clock says ' + fmt(t) + (Math.abs(b - Math.round(b)) > 0.05 ? ' — exactly, it is ' + fmtExact(b) + '.' : '.') }; }
        clock.glow(false);
        if (!manual) return { solved: false };
        if (off <= 60) return { solved: false, msg: 'Very close — within a minute, but not to the second.' };
        if (off <= 600) return { solved: false, msg: 'Near, but more than a minute out.' };
        return { solved: false, msg: 'Not yet.' };
      };
      inst.hint = (k) => {
        const b = best();
        if (k === 0) return { text: 'The hour on the target is **' + (Math.floor(b / 3600) || 12) + '**. The minute hand gains 5½° a minute on the hour hand.', show() {} };
        if (k === 1) return { text: 'It is between ' + fmt(Math.floor(b / 60) * 60, false) + ' and ' + fmt(Math.floor(b / 60) * 60 + 60, false) + '.', show() {} };
        return { text: 'To the second: ' + fmt(b) + '.', show() {} };
      };
      inst.solve = () => sweep(best(), 900, () => { t = Math.round(best()); show(); ctx.changed('solve'); });
      inst.getState = () => ({ t: Math.round(t) });
      inst.setState = (s) => { if (s && s.t != null) { t = s.t; show(); } };
      inst.explain = () => (p.explain ? null : 'The exact moment is ' + fmtExact(best()) + '.');
      ctx.setGoal(p.goal || ('Set the real clock to the time asked (to within ' + tol + ' seconds).'));
      show();
      return inst;
    }

    if (kind === 'cut') {
      let chords = [];
      const regs = C.s('g', { class: 'ck-regs' }, clock.body);
      clock.body.insertBefore(regs, clock.body.querySelector('.ck-ticks'));
      const lines = C.s('g', { class: 'ck-lines' }, clock.over);
      const dots = C.s('g', { class: 'ck-gaps' }, clock.over);
      const live = C.s('g', { class: 'ck-live' }, clock.over);
      const bubbles = C.s('g', { class: 'ck-sums' }, clock.over);
      for (let g = 0; g < 12; g++) { const q = gapPt(g); C.s('circle', { cx: q[0], cy: q[1], r: 0.2 }, dots); }
      const PAL = ['#ff8a8a', '#ffc27a', '#ffe08a', '#8fe0b0', '#7fe3df', '#9fa9ff', '#c9a6ff', '#ff9fc9', '#b5e37f', '#f5b3ff', '#89d0ff', '#ffd1a1'];
      const ends = (a, b) => {
        const A = gapPt(a), B = gapPt(b), u = G.norm(G.sub(B, A));
        // extend to the rim
        const f = (P, s) => { let lo = 0, hi = 30; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; const Q = G.add(P, G.mul(u, s * m)); if (Math.hypot(Q[0], Q[1]) < R * 0.985) lo = m; else hi = m; } return G.add(P, G.mul(u, s * lo)); };
        return [f(A, -1), f(B, 1)];
      };
      function draw() {
        regs.innerHTML = ''; lines.innerHTML = ''; bubbles.innerHTML = '';
        const r = cutOk(chords, d);
        if (chords.length) {
          r.gs.forEach((g, i) => {
            const poly = regionPoly(chords, g.sig);
            if (poly.length < 3) return;
            C.s('path', { d: C.pathOf(poly), fill: PAL[i % PAL.length], class: 'ck-reg' }, regs);
            const c = G.centroid(poly);
            const bg = C.s('g', { class: 'ck-sum' + ((d.sum && g.sum === d.sum) || (d.sums && d.sums.includes(g.sum)) ? ' ok' : ''), transform: 'translate(' + c[0] + ' ' + c[1] + ')' }, bubbles);
            C.s('circle', { r: 0.78 }, bg);
            C.s('text', { y: 0.27, 'text-anchor': 'middle', text: String(g.sum) }, bg);
          });
        }
        chords.forEach(([a, b], k) => {
          const [P, Q] = ends(a, b);
          C.s('line', { x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], class: 'ck-line', 'data-k': k }, lines);
        });
        ctx.stat('Lines', chords.length + (d.maxLines ? ' / ' + d.maxLines : ''));
        ctx.stat('Parts', r.gs.length);
        clock.glow(r.ok);
      }
      const nearGap = (pt) => { let best = -1, bd = 2.2; for (let g = 0; g < 12; g++) { const dd = G.dist(pt, gapPt(g)); if (dd < bd) { bd = dd; best = g; } } return best; };
      const gapByAngle = (pt) => { const a = G.normDeg(Math.atan2(pt[0], -pt[1]) * 180 / Math.PI); return mod(Math.round((a - 15) / 30), 12); };
      let drawing = null;
      wb.handlers.board = {
        down(pt) {
          if (Math.hypot(pt[0], pt[1]) > R + 1) return false;
          // a tap on a line takes it away
          const hit = chords.findIndex(([a, b]) => { const [P, Q] = ends(a, b); return G.segDist(pt, P, Q) < 0.35; });
          const g = Math.hypot(pt[0], pt[1]) > RG - 2.4 ? gapByAngle(pt) : nearGap(pt);
          drawing = { a: g, b: g, hit, p0: pt };
          return true;
        },
        move(pt) {
          if (!drawing) return;
          drawing.b = gapByAngle(pt);
          live.innerHTML = '';
          if (drawing.a >= 0 && drawing.b !== drawing.a && G.dist(pt, drawing.p0) > 0.6) {
            const [P, Q] = ends(drawing.a, drawing.b);
            C.s('line', { x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], class: 'ck-line live' }, live);
            [drawing.a, drawing.b].forEach((g) => { const q = gapPt(g); C.s('circle', { cx: q[0], cy: q[1], r: 0.38, class: 'ck-gapon' }, live); });
          }
        },
        up(pt) {
          if (!drawing) return;
          const dr = drawing;
          drawing = null;
          live.innerHTML = '';
          if (G.dist(pt, dr.p0) <= 0.6) {
            if (dr.hit >= 0) { chords.splice(dr.hit, 1); ctx.sfx('tap'); draw(); ctx.changed('line'); }
            return;
          }
          if (dr.a < 0 || dr.b === dr.a) return;
          const key = [Math.min(dr.a, dr.b), Math.max(dr.a, dr.b)];
          if (chords.some((c) => c[0] === key[0] && c[1] === key[1])) { ctx.toast('That line is already drawn.'); return; }
          chords.push(key);
          ctx.sfx('cut');

          draw();
          ctx.changed('line');
        }
      };
      ctx.button('Rub out the lines', () => { chords = []; draw(); ctx.changed('clear'); }, 'small');
      inst.check = (manual) => { const r = cutOk(chords, d); if (r.ok) return { solved: true, msg: 'Every part adds up.' }; return { solved: false, msg: chords.length ? r.msg : 'Drag across the face to draw a line.' }; };
      inst.hint = (k) => {
        const s = d.sol[Math.min(k, d.sol.length - 1)];
        if (k >= d.sol.length) return null;
        return { text: 'One line runs from between ' + (s[0] || 12) + ' and ' + (s[0] + 1) + ' to between ' + (s[1] || 12) + ' and ' + (s[1] + 1) + '.', show() { const [P, Q] = ends(s[0], s[1]); live.innerHTML = ''; C.s('line', { x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], class: 'ck-line hint' }, live); later(() => { live.innerHTML = ''; }, 4500); } };
      };
      inst.solve = () => {
        chords = [];
        draw();
        let i = 0;
        const step = () => { if (i >= d.sol.length) { ctx.changed('solve'); return; } chords.push(d.sol[i++].slice()); ctx.sfx('cut'); draw(); later(step, 420); };
        later(step, 200);
      };
      inst.getState = () => ({ chords: chords.map((c) => c.slice()) });
      inst.setState = (s) => { chords = (s && s.chords || []).map((c) => c.slice()); draw(); };
      inst.noMoves = false;
      ctx.setGoal(p.goal || (d.sums ? 'Cut the face into parts adding up to ' + d.sums.join(', ') + '.' : 'Cut the face into ' + d.parts + ' parts, each adding up to ' + d.sum + '.'));
      draw();
      return inst;
    }

    // ask: a question; the clock only shows the time in question
    if (clock) { clock.set(t); if (d.seconds) clock.set(t); }
    const a = d.answer;
    const box = ctx.answer({
      kind: a.choice != null ? 'choice' : 'number',
      choices: a.choices, unit: a.unit, label: d.ask || null,
      placeholder: a.unit === '°' ? 'Degrees (7.5 or 7 1/2)' : 'A number',
      check: (v) => {
        if (a.choice != null) {
          if (v === a.choice) return { ok: true, msg: a.msg || ('Yes: **' + a.choices[a.choice] + '**.') };
          const tr = (d.traps || []).find((x) => x.match === v);
          return { ok: false, msg: tr ? tr.msg : null };
        }
        const x = readNum(v);
        if (isNaN(x)) return { ok: false, msg: 'That does not look like a number.' };
        if (Math.abs(x - a.num) <= (a.tol || 1e-6)) return { ok: true, msg: a.msg || ('Yes: **' + (a.show || C.fmtCalc(a.num)) + (a.unit ? ' ' + a.unit : '') + '**.') };
        const tr = (d.traps || []).find((q) => Math.abs(q.match - x) <= (a.tol || 1e-6));
        if (tr) return { ok: false, msg: tr.msg };
        return { ok: false, msg: Math.abs(x - a.num) / Math.max(1, Math.abs(a.num)) < 0.1 ? 'Close, but not exact.' : null };
      }
    });
    if (clock && d.showAngle) {
      // mark the angle between the hands with an arc
      const h = hourDeg(t), m = minDeg(t);
      let a0 = h, a1 = m;
      if (mod(a1 - a0, 360) > 180) { const tmp = a0; a0 = a1; a1 = tmp; }
      const span = mod(a1 - a0, 360), r = 3.2;
      const P = (deg) => [Math.sin(deg * Math.PI / 180) * r, -Math.cos(deg * Math.PI / 180) * r];
      const A = P(a0), B = P(a0 + span);
      C.s('path', { d: 'M0 0L' + A[0] + ' ' + A[1] + 'A' + r + ' ' + r + ' 0 ' + (span > 180 ? 1 : 0) + ' 1 ' + B[0] + ' ' + B[1] + 'Z', class: 'ck-angle' }, clock.over);
    }
    inst.solve = () => { box.feedback('The answer: <b>' + (a.choice != null ? C.md(a.choices[a.choice]) : (a.show || C.fmtCalc(a.num)) + (a.unit ? ' ' + a.unit : '')) + '</b>', 'good'); };
    return inst;
  }

  function readNum(v) {
    const s = String(v).trim().replace(/[−–]/g, '-').replace(/°|degrees?|days?|seconds?|secs?|s$|minutes?|mins?|strokes?|times?/gi, '').replace(/½/g, ' 1/2').replace(/¼/g, ' 1/4').replace(/¾/g, ' 3/4').trim();
    let m;
    if ((m = /^(-?\d+)\s+(\d+)\/(\d+)$/.exec(s))) return +m[1] + (+m[2]) / (+m[3]);
    if ((m = /^(-?\d+)\/(\d+)$/.exec(s))) return (+m[1]) / (+m[2]);
    if (/^-?\d+(\.\d+)?$/.test(s)) return +s;
    if (C.answerTools) return C.answerTools.readNumber(s);
    return NaN;
  }

  /* ---------- endless ---------- */

  const H = 3600;
  const fmtHM = (t) => fmt(t, false);
  function generate(rng, level) {
    for (let k = 0; k < 12; k++) { const p = generate1(rng, level); if (p) return p; }
    return null;
  }
  function generate1(rng, level) {
    const pickTime = (step) => rng.int(DAY / step) * step;
    const face = rng.pick(['arabic', 'arabic', 'roman4', 'roman']);
    if (level === 1) {
      if (rng() < 0.5) {
        const t = pickTime(15 * 60);
        const A = angleAt(t);
        return { title: 'The Angle at ' + fmtHM(t), text: 'What is the angle between the hour hand and the minute hand at **' + fmtHM(t) + '**? (The smaller angle, in degrees.)', data: { kind: 'ask', start: t, face, answer: { num: A, unit: '°' }, calc: { angle: t } }, diff: 1 };
      }
      const show = pickTime(5 * 60) || 3 * H;
      const target = mirrorOf(show, 'v');
      if (cdist(target, show) < 60) return null;
      return { title: 'The Looking-Glass Clock', text: 'A clock seen in a mirror seems to say **' + fmtHM(show) + '**. What time is it really? Set the real clock.', data: { kind: 'mirror', show, axis: 'v', start: 0, face, target: [target], tol: 30, cond: { mirror: show, axis: 'v' } }, diff: 1 };
    }
    if (level === 2) {
      const r = rng.int(3);
      if (r === 0) {
        const t = pickTime(5 * 60);
        return { title: 'The Angle at ' + fmtHM(t), text: 'At **' + fmtHM(t) + '**, how many degrees apart are the two hands? (The smaller angle.)', data: { kind: 'ask', start: t, face, answer: { num: angleAt(t), unit: '°' }, calc: { angle: t } }, diff: 2 };
      }
      if (r === 1) {
        const n = rng.range(3, 7), s = (n - 1) * rng.range(1, 3), m = rng.range(n + 2, 12);
        const v = (m - 1) * s / (n - 1);
        return { title: 'Striking ' + m, text: 'A clock takes **' + s + ' seconds** to strike ' + n + ' o\'clock. How many seconds does it take to strike ' + m + '? (The strokes come at even intervals; count from the first stroke to the last.)', data: { kind: 'ask', start: n * H, face, answer: { num: v, unit: 's' }, calc: { strike: [n, s, m] }, traps: [{ match: s * m / n, msg: 'The time is in the gaps between the strokes, not in the strokes themselves.' }] }, diff: 2 };
      }
      const axis = rng() < 0.5 ? 'v' : 'h';
      const show = pickTime(60);
      const target = mirrorOf(show, axis);
      if (cdist(target, show) < 60) return null;
      return { title: axis === 'v' ? 'Mirror Time' : 'Reflected in the Lake', text: (axis === 'v' ? 'In a mirror, a clock seems to say **' : 'Upside down in the still water of a lake, a clock seems to say **') + fmtHM(show) + '**. What is the real time? Set the real clock.', data: { kind: 'mirror', show, axis, start: 0, face, target: [target], tol: 30, cond: { mirror: show, axis } }, diff: 2 };
    }
    if (level === 3) {
      const A = rng.pick([0, 0, 180, 90]), h = rng.range(0, 11);
      const tt = nextAngle(A, h * H);
      if (Math.floor(tt / H) !== h) return null;
      const what = A === 0 ? 'on top of each other' : A === 180 ? 'pointing in exactly opposite directions' : 'at right angles';
      return { title: (A === 0 ? 'Together' : A === 180 ? 'Opposite' : 'Square') + ' after ' + (h || 12), text: 'Set the clock to the first moment after ' + (h || 12) + ' o\'clock when the hands are ' + what + '. (To the second: the clock will accept 3 seconds either way.)', data: { kind: 'set', start: h * H, face: 'arabic', seconds: true, target: [tt], tol: 3, cond: { angle: A, after: h * H } }, diff: 3 };
    }
    if (level === 4) {
      if (rng() < 0.5) {
        const t = pickTime(60);
        if (t % 300 === 0) return null;
        return { title: 'The Angle at ' + fmtHM(t), text: 'What is the angle between the hands at **' + fmtHM(t) + '**? (The smaller one; halves are allowed.)', data: { kind: 'ask', start: t, face, answer: { num: angleAt(t), unit: '°' }, calc: { angle: t } }, diff: 4 };
      }
      const g = rng.pick([-10, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 10, 12, 15]);
      const shows = rng.range(2, 10) * H + rng.pick([0, 30 * 60]);
      const real = shows * 60 / (60 + g);
      return { title: g > 0 ? 'The Hasty Clock' : 'The Lazy Clock', text: 'A clock ' + (g > 0 ? 'gains' : 'loses') + ' **' + Math.abs(g) + ' minutes every hour**, steadily. It was set right at 12 noon, and now it shows **' + fmtHM(shows) + '**. What is the real time? Set the real clock.', data: { kind: 'set', start: shows, face: 'arabic', seconds: true, target: [mod(real, DAY)], tol: 3, cond: { rate: g, shows } }, diff: 4 };
    }
    const r = rng.int(3);
    if (r === 0) {
      const A = rng.pick([30, 60, 120, 150, 45, 135]), h = rng.range(0, 11), nth = rng.pick([1, 2]);
      const tt = nextAngle(A, h * H, nth);
      if (!tt || Math.floor(tt / H) !== h) return null;
      return { title: A + '° after ' + (h || 12) + (nth === 2 ? ', the second time' : ''), text: 'After ' + (h || 12) + ' o\'clock, the hands will be exactly **' + A + '°** apart ' + (nth === 2 ? 'twice before ' + ((h + 1) % 12 || 12) + '. Set the clock to the **second** of those moments.' : 'soon. Set the clock to the first such moment.') + ' (Within 3 seconds.)', data: { kind: 'set', start: h * H, face: 'arabic', seconds: true, target: [tt], tol: 3, cond: { angle: A, after: h * H, nth } }, diff: 5 };
    }
    if (r === 1) {
      const h = rng.range(0, 11);
      const tt = nextSym(h * H);
      if (Math.floor(tt / H) !== h) return null;
      return { title: 'Mirror Hands after ' + (h || 12), text: 'Between ' + (h || 12) + ' and ' + ((h + 1) % 12 || 12) + ' there is a moment when the two hands are mirror images of each other across the line from 12 to 6. Set the clock to it (within 3 seconds).', data: { kind: 'set', start: h * H, face: 'arabic', seconds: true, target: [tt], tol: 3, cond: { sym: true, after: h * H } }, diff: 5 };
    }
    const agree = rng.pick([1, 2, 3, 4, 5, 6, 8, 9, 10, 12]);
    const a = rng.range(1, agree), b = agree - a;
    const text = b > 0 ? 'Two clocks are set right at noon. One gains **' + a + ' minute' + (a > 1 ? 's' : '') + ' a day**, the other loses **' + b + ' minute' + (b > 1 ? 's' : '') + ' a day**. After how many days will they next show the same time?' : 'A clock gains **' + a + ' minute' + (a > 1 ? 's' : '') + ' a day**. It is set right today. After how many days will it next show the right time?';
    return { title: b > 0 ? 'Two Clocks Drift Apart' : 'Right Again', text, data: { kind: 'ask', start: 12 * H % DAY, face, answer: { num: 720 / agree, unit: 'days' }, calc: { agree } }, diff: 5 };
  }

  C.engine({
    id: 'clocks',
    name: 'Clock faces',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    noMoves: true,
    about: (p) => {
      const k = p && p.data && p.data.kind;
      if (k === 'cut') return '**Drag across the face** from one gap between the numbers to another to draw a straight line. The parts are coloured and each shows its total. **Tap a line** to take it away.';
      if (k === 'ask') return 'Work it out and answer in the panel. The clock shows the time in question; the pen, the highlighter and the paint tool work on the face.';
      return '**Drag the minute hand** (or anywhere on the face) to turn the hands; the hour hand follows, geared 12 to 1, as in a real clock. Drag the short hand to move the hours. Fine-tune with the buttons or the arrow keys: ← → a minute, Shift + ← → a second, ↑ ↓ an hour.';
    },
    verify,
    answerKey(p) { const d = p.data; if (d.kind !== 'ask') return null; return d.answer.choice != null ? d.answer.choice : String(d.answer.num); },
    generate,
    mount,
    thumb(p) {
      const d = p.data;
      const t = d.kind === 'mirror' ? d.show : d.kind === 'set' ? (d.target[0] || 0) : d.start || 0;
      const h = hourDeg(d.kind === 'set' ? d.start || 0 : t), m = minDeg(d.kind === 'set' ? d.start || 0 : t);
      const flip = d.kind === 'mirror' ? (d.axis === 'h' ? ' transform="scale(1 -1)"' : ' transform="scale(-1 1)"') : '';
      let s = '<svg viewBox="-16 -12 32 24" preserveAspectRatio="xMidYMid meet"><g' + flip + '><circle r="10.6" fill="#b08a3e"/><circle r="10" fill="#f7f1e1"/>';
      for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; s += '<line x1="' + (Math.sin(a) * 8.6).toFixed(2) + '" y1="' + (-Math.cos(a) * 8.6).toFixed(2) + '" x2="' + (Math.sin(a) * 9.6).toFixed(2) + '" y2="' + (-Math.cos(a) * 9.6).toFixed(2) + '" stroke="#2a2c3a" stroke-width=".5"/>'; }
      if (d.kind === 'cut') {
        (d.sol || []).forEach(([a, b]) => { const A = gapPt(a), B = gapPt(b); s += '<line x1="' + A[0].toFixed(2) + '" y1="' + A[1].toFixed(2) + '" x2="' + B[0].toFixed(2) + '" y2="' + B[1].toFixed(2) + '" stroke="#cf2f3d" stroke-width=".45" stroke-dasharray="1 .6"/>'; });
        for (let n = 1; n <= 12; n++) { const q = numPt(n % 12, 7); s += '<text x="' + q[0].toFixed(2) + '" y="' + (q[1] + 0.8).toFixed(2) + '" text-anchor="middle" font-size="2.4" font-weight="700" fill="#2a2c3a">' + n + '</text>'; }
      } else {
        s += '<g transform="rotate(' + h.toFixed(1) + ')"><path d="M-.5 1.5L0-5.6L.5 1.5z" fill="#2a2c3a"/></g><g transform="rotate(' + m.toFixed(1) + ')"><path d="M-.35 1.8L0-8.4L.35 1.8z" fill="#2a2c3a"/></g><circle r=".7" fill="#b08a3e"/>';
      }
      s += '</g>';
      if (d.kind === 'ask' && d.answer && d.answer.unit === '°') s += '<text x="15" y="-8" text-anchor="end" font-size="4" font-weight="800" fill="var(--gold)">?°</text>';
      return s + '</svg>';
    }
  });

  C.clockLib = { angleAt, nextAngle, nextSym, swapTimes, mirrorOf, countTimes, romanCount, targetsOf, calc, fmt, fmtExact, cutOk, groups, gapPt, generate, DAY };

  C.css('clocks', `
    .ck-rim { stroke: rgba(0,0,0,.4); stroke-width: .08; }
    .ck-r0 { stop-color: #e9c77a; } .ck-r1 { stop-color: #a8792e; } .ck-r2 { stop-color: #f1d690; }
    .ck-face { stroke: rgba(0,0,0,.35); stroke-width: .06; }
    .ck-f0 { stop-color: #fbf7ec; } .ck-f1 { stop-color: #e9dfc6; }
    .ck-ticks line { stroke: #3a3a48; stroke-width: .07; stroke-linecap: round; }
    .ck-ticks line.hr { stroke-width: .2; }
    .ck-nums text { font: 600 1.75px Georgia, "Times New Roman", serif; fill: #262838; }
    .ck-nums.roman text { font: 600 1.25px Georgia, "Times New Roman", serif; letter-spacing: -.06px; }
    .ck-nums text.small { font-size: 1.3px; }
    .ck-nums.roman text.small { font-size: 1.05px; }
    .ck-maker { font: 600 .48px Georgia, serif; letter-spacing: .12px; fill: rgba(38,40,56,.45); }
    .ck-hand path, .ck-hand line { fill: #1f2130; stroke: #1f2130; stroke-width: .03; stroke-linejoin: round; }
    .ck-hand .sh { fill: rgba(0,0,0,.22); stroke: none; }
    .ck-hand.sec line { stroke: #c62f35; stroke-width: .1; }
    .ck-shadows line.sh { stroke: rgba(0,0,0,.18); stroke-width: .1; }
    .ck-shadows { pointer-events: none; }
    .ck-hand.sec circle { fill: #c62f35; }
    .ck-cap { fill: #b08a3e; stroke: rgba(0,0,0,.4); stroke-width: .05; }
    .ck-cap2 { fill: #e9c77a; }
    .ck.hover .ck-face { cursor: grab; }
    .ck.drag-min .ck-hand.min path:not(.sh), .ck.drag-hour .ck-hand.hour path:not(.sh) { fill: #3b4bd1; stroke: #3b4bd1; }
    .ck.ck-good .ck-face { stroke: var(--green); stroke-width: .35; }
    .ck-lcd rect { fill: #1b2a22; stroke: rgba(0,0,0,.5); stroke-width: .06; }
    .ck-lcd text { font: 700 1.45px "Consolas", "Courier New", monospace; fill: #8ff0b8; letter-spacing: .08px; }
    .ck-glass { fill: rgba(170, 200, 230, .16); stroke: #b08a3e; stroke-width: .5; }
    .ck-sheen { stroke: rgba(255,255,255,.35); stroke-width: .35; stroke-linecap: round; pointer-events: none; }
    .ck.mirrored { opacity: .92; }
    .ck-cap-t { font: 600 1px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .ck-reg { opacity: .42; }
    .ck-line { stroke: #c62f35; stroke-width: .16; stroke-linecap: round; }
    .ck-line.live { stroke-dasharray: .5 .3; opacity: .85; }
    .ck-line.hint { stroke: #ffd166; stroke-width: .24; stroke-dasharray: .6 .35; animation: ckpulse 1s ease-in-out infinite; }
    @keyframes ckpulse { 50% { opacity: .35; } }
    .ck-gaps circle { fill: rgba(38,40,56,.35); }
    .ck-gapon { fill: #c62f35; }
    .ck-sum circle { fill: #fffdf6; stroke: rgba(0,0,0,.35); stroke-width: .06; }
    .ck-sum text { font: 800 .8px "Segoe UI", system-ui, sans-serif; fill: #262838; }
    .ck-sum.ok circle { fill: #2f9e6a; } .ck-sum.ok text { fill: #fff; }
    .ck-over, .ck-sums, .ck-live { pointer-events: none; }
    .ck-angle { fill: rgba(255,176,87,.35); stroke: #e08a2a; stroke-width: .08; }
    .ck-panel { display: flex; flex-direction: column; gap: 6px; width: 100%; }
    .ck-knobt { font-size: .85rem; color: var(--muted); }
    .ck-knobs { display: flex; flex-wrap: wrap; gap: 4px; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
