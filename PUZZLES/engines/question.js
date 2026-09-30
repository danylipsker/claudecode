/* The Puzzle Cabinet · engines/question.js
 *
 * Riddles and problems answered in words, numbers or a choice. The riddle is
 * written on a card on the table (so it can be scribbled on, magnified and
 * covered in notes); a figure may sit under the text: plain SVG markup, or a
 * named figure from Cabinet.figures that can move and be played with.
 *
 * data: {
 *   answer: { num: 42, tol: 0.001, rel: 0.01, unit: 'km' }        a number (fractions and sums accepted)
 *         | { nums: [3, 4], ordered: false }                       several numbers
 *         | { text: ['candle', 'a candle'], exact: false }        words (case, articles, punctuation, typos forgiven)
 *         | { choice: 1, choices: ['a', 'b', 'c'] }                one choice
 *         | { multi: [0, 2], choices: [...] }                      all that apply
 *   traps: [{ match: '1/2' | 0.5 | ['a', 'b'] | choiceIndex, msg: 'That is the famous trap…' }],
 *   figure: { svg: '<g>…</g>', w: 400, h: 240 } | { fig: 'figure-id', params: {…}, w, h },
 *   card: false   (no card: the figure fills the table)
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const CARD_W = 620;

  function norm(s) {
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[’'`"“”.,!?;:()[\]{}]/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\b(a|an|the|it is|its|it s|is|are|of)\b/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const d = [];
    for (let i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[a.length][b.length];
  }
  const singular = (w) => w.length > 3 && /s$/.test(w) && !/ss$/.test(w) ? w.slice(0, -1) : w;

  function textMatches(input, alts, exact) {
    const n = norm(input);
    if (!n) return false;
    const nn = n.split(' ').map(singular).join(' ');
    for (const a of alts) {
      const t = norm(a);
      if (!t) continue;
      const tt = t.split(' ').map(singular).join(' ');
      if (n === t || nn === tt) return true;
      if (exact) continue;
      if (tt.length >= 4 && (' ' + nn + ' ').includes(' ' + tt + ' ')) return true;
      // a typo is forgiven, but not a different number ("half past 5" is not "half past 4")
      const digits = (x) => (x.match(/\d+/g) || []).join(',');
      if (tt.length >= 5 && digits(nn) === digits(tt) && lev(nn, tt) <= (tt.length >= 9 ? 2 : 1)) return true;
    }
    return false;
  }

  // read a number the way people write one: 12, 3.5, 1/3, 2 1/2, 1,000, 25%, or a sum
  const VULGAR = { '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4', '⅕': '1/5', '⅖': '2/5', '⅗': '3/5', '⅘': '4/5', '⅙': '1/6', '⅚': '5/6', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8' };
  function readNumber(s) {
    s = String(s).trim()
      .replace(/\s*≈.*$/, '')                                  // "4√2 ≈ 5.657": the exact part is enough
      .replace(/π/g, 'pi')
      // vulgar fractions: 1½ = 1.5, ¾ = 0.75
      .replace(/(\d*)\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g, (m, whole, f) => '(' + (whole || '0') + '+' + VULGAR[f] + ')')
      .replace(/√\s*(\([^)]*\)|\d+(?:\.\d+)?|pi)/g, 'sqrt($1)')   // √2, √(3/4), 2√3
      .replace(/[−–]/g, '-').replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/\s*(?:[a-z]+\.?)$/i, (m) => /^(pi|e|\))$/i.test(m.trim()) || /sqrt|pi/.test(s) ? m : '');
    let m;
    if ((m = /^(-?\d+)\s+(\d+)\/(\d+)$/.exec(s))) return (+m[1]) + Math.sign(+m[1] || 1) * (+m[2]) / (+m[3]);
    if ((m = /^(-?\d+(?:\.\d+)?)\s*%$/.exec(s))) return (+m[1]) / 100;
    if (/^-?\d+(\.\d+)?$/.test(s)) return +s;
    if (C.evaluate) { try { const v = C.evaluate(s, {}); if (isFinite(v)) return v; } catch (e) { /* not a sum */ } }
    return NaN;
  }
  function numEq(v, a) {
    // a whole-number answer must be exact (a huge count off by one is wrong); fractions get a hair of slack
    const tol = a.tol != null ? a.tol : (a.rel != null ? Math.abs(a.num) * a.rel : Number.isInteger(a.num) ? 1e-9 : 1e-6 * Math.max(1, Math.abs(a.num)));
    return Math.abs(v - a.num) <= tol + 1e-12;
  }

  function trapFor(p, value) {
    const traps = (p.data && p.data.traps) || [];
    for (const t of traps) {
      const ms = Array.isArray(t.match) ? t.match : [t.match];
      for (const m of ms) {
        if (typeof m === 'number' && typeof value === 'number' && Math.abs(m - value) < 1e-9) return t.msg;
        if (typeof m === 'number' && typeof value === 'string') { const v = readNumber(value); if (!isNaN(v) && Math.abs(v - m) < 1e-9 * Math.max(1, Math.abs(m))) return t.msg; }
        if (typeof m === 'string' && typeof value === 'string' && textMatches(value, [m], true)) return t.msg;
        if (typeof m === 'string' && typeof value === 'string') { const a = readNumber(m), b = readNumber(value); if (!isNaN(a) && !isNaN(b) && Math.abs(a - b) < 1e-9) return t.msg; }
      }
    }
    return null;
  }

  function checkAnswer(p, value) {
    const a = p.data.answer;
    if (a.num != null) {
      const v = readNumber(value);
      if (isNaN(v)) return { ok: false, msg: 'That does not look like a number to me.' };
      if (numEq(v, a)) return { ok: true, msg: 'Yes: **' + (a.show || C.fmtCalc ? (a.show || C.fmtCalc(a.num)) : a.num) + (a.unit ? ' ' + a.unit : '') + '**.' };
      const trap = trapFor(p, v);
      if (trap) return { ok: false, msg: trap };
      if (a.num !== 0 && Math.abs(v - a.num) / Math.abs(a.num) < 0.1) return { ok: false, msg: 'Close, but not exact.' };
      return { ok: false };
    }
    if (a.nums) {
      const got = String(value).split(/\s*(?:,|;|\band\b|&|\s)\s*/).filter(Boolean).map(readNumber);
      if (got.some(isNaN)) return { ok: false, msg: 'Write the numbers separated by commas.' };
      if (got.length !== a.nums.length) return { ok: false, msg: 'I am expecting ' + a.nums.length + ' numbers.' };
      const want = a.nums.slice();
      const g = got.slice();
      if (!a.ordered) { want.sort((x, y) => x - y); g.sort((x, y) => x - y); }
      const ok = want.every((w, i) => Math.abs(w - g[i]) <= (a.tol || 1e-6 * Math.max(1, Math.abs(w))));
      if (ok) return { ok: true, msg: 'Yes: **' + a.nums.join(', ') + '**.' };
      const trap = trapFor(p, String(value));
      return { ok: false, msg: trap || (a.ordered && want.slice().sort().join() === g.slice().sort().join() ? 'The right numbers, in the wrong order.' : null) };
    }
    if (a.text) {
      if (textMatches(value, a.text, a.exact)) return { ok: true, msg: 'Yes: **' + a.text[0] + '**.' };
      const trap = trapFor(p, value);
      return { ok: false, msg: trap };
    }
    if (a.choice != null) {
      if (value === a.choice) return { ok: true, msg: 'Yes: **' + a.choices[a.choice] + '**.' };
      const traps = (p.data.traps || []).filter((t) => t.match === value);
      return { ok: false, msg: traps.length ? traps[0].msg : null };
    }
    if (a.multi) {
      const want = a.multi.slice().sort((x, y) => x - y);
      if (value.length === want.length && value.every((v, i) => v === want[i])) return { ok: true };
      return { ok: false, msg: value.length < want.length ? 'There are more.' : (value.length > want.length ? 'Not all of those.' : null) };
    }
    return { ok: false, msg: 'This riddle has no answer key.' };
  }

  function answerText(a) {
    if (a.num != null) return (a.show || C.fmtCalc(a.num)) + (a.unit ? ' ' + a.unit : '');
    if (a.nums) return a.nums.join(', ');
    if (a.text) return a.text[0];
    if (a.choice != null) return a.choices[a.choice];
    if (a.multi) return a.multi.map((i) => a.choices[i]).join('; ');
    return '';
  }

  C.engine({
    id: 'question',
    name: 'Riddles and problems',
    noMoves: true,
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Read the riddle on the card, work it out, and type or pick your answer in the panel. The card is on the table: write on it with the pen, mark it with the highlighter, stick notes on it, zoom in. The notebook beside it has a calculator that remembers its lines.',

    // what the self-test types into the answer box
    answerKey(p) {
      const a = p.data.answer;
      return a.num != null ? (a.show || String(a.num)) : a.nums ? a.nums.join(', ') : a.text ? a.text[0] : a.choice != null ? a.choice : a.multi;
    },

    verify(p) {
      const a = p.data && p.data.answer;
      if (!a) return { ok: false, err: 'no answer' };
      if (a.num != null && !isFinite(a.num)) return { ok: false, err: 'answer.num is not a number' };
      if (a.nums && (!a.nums.length || a.nums.some((x) => !isFinite(x)))) return { ok: false, err: 'bad answer.nums' };
      if (a.text && (!Array.isArray(a.text) || !a.text.length)) return { ok: false, err: 'answer.text must be a list' };
      if (a.choice != null && (!a.choices || a.choice < 0 || a.choice >= a.choices.length)) return { ok: false, err: 'bad choice index' };
      if (a.multi && (!a.choices || a.multi.some((i) => i < 0 || i >= a.choices.length))) return { ok: false, err: 'bad multi' };
      if (a.num == null && !a.nums && !a.text && a.choice == null && !a.multi) return { ok: false, err: 'unknown answer kind' };
      if (p.data.figure && p.data.figure.fig && root.Cabinet.figures && !root.Cabinet.figures[p.data.figure.fig] && !p.data.figure.lazy) return { ok: true, warn: 'figure ' + p.data.figure.fig + ' not loaded here' };
      // the answer must be accepted by its own checker
      const probe = a.num != null ? String(a.num) : a.nums ? a.nums.join(', ') : a.text ? a.text[0] : a.choice != null ? a.choice : a.multi;
      const r = checkAnswer(p, probe);
      if (!r.ok) return { ok: false, err: 'the answer key does not pass its own check' };
      return { ok: true };
    },

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data || {};
      const fig = d.figure || null;
      const board = wb.layer('board');
      let y = 0;
      const W = fig && fig.w && d.card === false ? fig.w : CARD_W;
      const noCard = d.card === false;
      let figEl = null, figInst = null;
      if (!noCard) {
        // the card: title and text, then the figure
        const bg = ctx.s('rect', { x: -16, y: -16, width: W + 32, height: 60, rx: 18, class: 'q-cardbg' }, board);
        const fo = ctx.s('foreignObject', { x: 0, y: 0, width: W, height: 10, class: 'q-fo' }, board);
        const div = ctx.h('div.q-card',
          ctx.h('div.q-title', p.title),
          ctx.h('div.q-text', { html: C.md(p.text || '') })
        );
        fo.appendChild(div);
        const hgt = Math.max(60, measure(div, W));
        fo.setAttribute('height', hgt);
        y = hgt + 22;
        bg.setAttribute('height', hgt + 32);
      }
      if (fig) {
        const fw = fig.w || 400, fh = fig.h || 260;
        const scale = noCard ? 1 : Math.min(1, W / fw);
        const gx = noCard ? 0 : (W - fw * scale) / 2;
        figEl = ctx.s('g', { class: 'q-fig', transform: 'translate(' + gx + ' ' + y + ') scale(' + scale + ')' }, board);
        if (!noCard) ctx.s('rect', { x: 0, y: 0, width: fw, height: fh, rx: 12, class: 'q-figbg' }, figEl);
        if (fig.svg) {
          const g = ctx.s('g', null, figEl);
          g.innerHTML = fig.svg;
        } else if (fig.fig && C.figures[fig.fig]) {
          const g = ctx.s('g', null, figEl);
          try { figInst = C.figures[fig.fig].draw(g, fig.params || {}, ctx) || null; } catch (e) { console.error(e); }
        }
        y += fh * scale;
        const bgr = board.querySelector('.q-cardbg');
        if (bgr) bgr.setAttribute('height', y + 32);
      }
      wb.setBounds({ x0: -20, y0: -20, x1: W + 20, y1: Math.max(y, 120) + 20 }, 0.06);
      if (!noCard) ctx.hideText && ctx.hideText();

      const a = d.answer;
      const kind = a.num != null ? 'number' : a.nums ? 'text' : a.text ? 'text' : a.choice != null ? 'choice' : 'multi';
      const box = ctx.answer({
        kind,
        choices: a.choices,
        allowNone: !!(a.multi && (a.allowNone || a.multi.length === 0)),
        unit: a.unit,
        label: d.ask || p.ask || null,
        placeholder: a.nums ? 'Numbers, separated by commas' : a.num != null ? 'A number (fractions like 3/4 are fine)' : 'Your answer',
        check: (v) => checkAnswer(p, v)
      });

      return {
        noMoves: true,
        solve() {
          box.feedback('The answer: <b>' + C.esc(answerText(a)) + '</b>', 'good');
          if (figInst && figInst.solve) figInst.solve();
        },
        getState() { return figInst && figInst.getState ? { fig: figInst.getState() } : null; },
        setState(s) { if (s && s.fig && figInst && figInst.setState) figInst.setState(s.fig); },
        // the answer was accepted: let the figure play its demonstration
        onSolved(r) { if (figInst && figInst.onSolved) figInst.onSolved(r); },
        destroy() { if (figInst && figInst.destroy) figInst.destroy(); }
      };
    },

    thumb(p) {
      const t = C.esc((p.data && p.data.thumb) || p.title);
      const f = p.data && p.data.figure;
      if (f && f.svg && (f.w || 400) <= 900) {
        return '<svg viewBox="0 0 ' + (f.w || 400) + ' ' + (f.h || 260) + '" preserveAspectRatio="xMidYMid meet"><rect width="' + (f.w || 400) + '" height="' + (f.h || 260) + '" rx="14" fill="#fbf8ef"/>' + f.svg + '</svg>';
      }
      const glyph = (p.data && p.data.glyph) || '?';
      return '<svg viewBox="0 0 160 120"><rect x="18" y="14" width="124" height="92" rx="10" fill="var(--paper)" opacity=".92"/><text x="80" y="72" text-anchor="middle" font-size="46" font-weight="800" fill="#b08a3e" font-family="Georgia,serif">' + C.esc(glyph) + '</text></svg>';
    }
  });

  function measure(div, W) {
    const probe = div.cloneNode(true);
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;width:' + W + 'px;visibility:hidden';
    root.document.body.appendChild(probe);
    const hgt = probe.getBoundingClientRect().height;
    probe.remove();
    return Math.ceil(hgt);
  }

  // exported for figures and other engines that take typed answers
  C.answerTools = { norm, textMatches, readNumber, checkAnswer, answerText };
})(typeof window !== 'undefined' ? window : globalThis);
