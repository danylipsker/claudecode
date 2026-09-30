/* The Puzzle Cabinet · data/paper-riddles.js
 * Riddles about paper: Möbius bands and their cousins, folding in half until
 * the Moon, cuts that open a postcard wide enough to walk through, and a few
 * facts about creases. Answered with the question engine; the figures are
 * drawn here (a small 3-D ribbon renderer for the bands). */
(function () {
  'use strict';
  const C = Cabinet;

  const INK = '#3a3020', CREAM = '#fbf8ef', PAPER = '#f6e9c6', PAPER2 = '#e2cd95', RED = '#b0472f', BLUE = '#3a6ea5', GOLD = '#b98a1e', GREY = '#9d9278';
  const r2 = (v) => Math.round(v * 100) / 100;
  const el = (tag, at, inner) => '<' + tag + Object.keys(at).map((k) => ' ' + k + '="' + at[k] + '"').join('') + (inner == null ? '/>' : '>' + inner + '</' + tag + '>');
  const txt = (x, y, s, size, o) => el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': size || 14, 'font-family': 'Georgia,serif', fill: INK }, o || {}), s);
  const pathOf = (pts, close) => 'M' + pts.map((q) => r2(q[0]) + ' ' + r2(q[1])).join('L') + (close ? 'Z' : '');
  const bg = (w, h) => el('rect', { x: 0, y: 0, width: w, height: h, rx: 12, fill: CREAM });

  // multiple choice with the right answer placed by a hash of its text; wrong answers may carry a message
  function mc(right, wrongs, extra) {
    const at = C.hash(right) % (wrongs.length + 1);
    const choices = wrongs.map((w) => (Array.isArray(w) ? w[0] : w));
    choices.splice(at, 0, right);
    const traps = [];
    wrongs.forEach((w, i) => { if (Array.isArray(w) && w[1]) traps.push({ match: i >= at ? i + 1 : i, msg: w[1] }); });
    return Object.assign({ answer: { choice: at, choices }, traps }, extra || {});
  }

  /* A paper band in 3-D, seen from above at a slant, drawn back to front.
   * halfTwists: 0 plain loop, 1 Möbius band, 2 a full twist.
   * lines: [v, ...] lines along the band at these offsets (-1 … 1 across its width), dashed. */
  function band(o) {
    const N = 120, W = o.width || 0.34, tilt = (o.tilt || 118) * Math.PI / 180, turn = (o.turn || 0) * Math.PI / 180;
    const sc = o.scale || 90, cx = o.cx || 200, cy = o.cy || 110;
    const P = (u, v) => {
      const a = o.halfTwists * u / 2 + (o.phase || 0);
      const r = 1 + v * W * Math.cos(a);
      let x = r * Math.cos(u), y = r * Math.sin(u), z = v * W * Math.sin(a);
      if (o.rot) { const q = o.rot([x, y, z]); x = q[0]; y = q[1]; z = q[2]; }
      const x1 = x * Math.cos(turn) - y * Math.sin(turn), y1 = x * Math.sin(turn) + y * Math.cos(turn);
      const y2 = y1 * Math.cos(tilt) - z * Math.sin(tilt), z2 = y1 * Math.sin(tilt) + z * Math.cos(tilt);
      return [cx + x1 * sc + (o.dx || 0), cy + y2 * sc * (o.squash || 1), z2];
    };
    const polys = [];
    for (let i = 0; i < N; i++) {
      const u0 = 2 * Math.PI * i / N, u1 = 2 * Math.PI * (i + 1) / N;
      const q = [P(u0, -1), P(u1, -1), P(u1, 1), P(u0, 1)];
      const e1 = [q[1][0] - q[0][0], q[1][1] - q[0][1]], e2 = [q[3][0] - q[0][0], q[3][1] - q[0][1]];
      const facing = e1[0] * e2[1] - e1[1] * e2[0];
      const lines = (o.lines || []).map((v) => [P(u0, v), P(u1, v)]);
      polys.push({ q, z: (q[0][2] + q[1][2] + q[2][2] + q[3][2]) / 4, facing, lines });
    }
    return polys;
  }
  function drawBands(list, w, h) {
    const all = [];
    list.forEach((b) => band(b).forEach((p) => { p.b = b; all.push(p); }));
    all.sort((a, b) => b.z - a.z);
    let s = '';
    all.forEach((p) => {
      const fill = p.b.color || (p.facing > 0 ? PAPER : PAPER2);
      s += el('path', { d: pathOf(p.q, true), fill, stroke: fill, 'stroke-width': 0.8 });
      s += el('path', { d: pathOf([p.q[0], p.q[1]]) + pathOf([p.q[3], p.q[2]]), stroke: INK, 'stroke-width': 1.6, fill: 'none' });
      p.lines.forEach((ln) => { s += el('path', { d: pathOf(ln), stroke: RED, 'stroke-width': 1.6, 'stroke-dasharray': '4 3', fill: 'none' }); });
    });
    return s;
  }
  const mobiusFig = (lines, label) => ({ w: 400, h: 230, svg: bg(400, 230) + drawBands([{ halfTwists: 1, lines, cx: 200, cy: 116, scale: 108, tilt: 120, turn: 20 }]) + (label ? txt(200, 218, label, 13, { 'font-style': 'italic', fill: GREY }) : '') });

  /* the paper-folding (dragon) curve after n folds: turns R/L */
  function dragonTurns(n) {
    let seq = [];
    for (let k = 0; k < n; k++) seq = seq.concat([1], seq.map((t) => -t).reverse());
    return seq;
  }
  function dragonFig(n, w, h) {
    const turns = dragonTurns(n);
    let dir = 0, p = [0, 0];
    const pts = [p];
    const step = () => { const d = [[1, 0], [0, 1], [-1, 0], [0, -1]][dir]; p = [p[0] + d[0], p[1] + d[1]]; pts.push(p); };
    step();
    turns.forEach((t) => { dir = (dir + (t > 0 ? 1 : 3)) % 4; step(); });
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
    const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    const sc = Math.min((w - 60) / (x1 - x0 || 1), (h - 60) / (y1 - y0 || 1));
    const mp = pts.map((q) => [30 + (q[0] - x0) * sc + ((w - 60) - (x1 - x0) * sc) / 2, 30 + (q[1] - y0) * sc + ((h - 60) - (y1 - y0) * sc) / 2]);
    return bg(w, h) + el('path', { d: pathOf(mp), stroke: RED, 'stroke-width': Math.max(1.2, sc * 0.25), fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
  }

  // Haga's fold: the corner of a square brought to the middle of the top edge
  const HAGA = (function () {
    const X = 120, Y = 20, S = 180;
    const pt = (x, y) => [X + x * S, Y + (1 - y) * S];
    const stay = [pt(0, 0.125), pt(1, 0.625), pt(1, 1), pt(0, 1)];
    const flap = [pt(0, 0.125), pt(1, 0.625), pt(0.5, 1), pt(-0.1, 0.2)];
    let s = bg(420, 230);
    s += el('path', { d: pathOf([pt(0, 0), pt(1, 0), pt(1, 1), pt(0, 1)], true), fill: 'none', stroke: GREY, 'stroke-width': 1.5, 'stroke-dasharray': '5 4' });
    s += el('path', { d: pathOf(stay, true), fill: PAPER, stroke: INK, 'stroke-width': 2 });
    s += el('path', { d: pathOf(flap, true), fill: PAPER2, stroke: INK, 'stroke-width': 2 });
    s += el('path', { d: pathOf([pt(0, 0.125), pt(1, 0.625)]), stroke: GOLD, 'stroke-width': 2, 'stroke-dasharray': '8 4 2 4' });
    s += el('circle', { cx: pt(0.5, 1)[0], cy: pt(0.5, 1)[1], r: 4, fill: RED });
    s += el('circle', { cx: pt(0, 1 / 3)[0], cy: pt(0, 1 / 3)[1], r: 5, fill: 'none', stroke: RED, 'stroke-width': 2 });
    s += txt(pt(0, 1 / 3)[0] - 22, pt(0, 1 / 3)[1] + 5, '?', 20, { fill: RED, 'font-weight': 700 });
    s += txt(pt(1, 0)[0], pt(1, 0)[1] + 16, 'the corner came from here', 12, { 'font-style': 'italic', fill: GREY, 'text-anchor': 'end' });
    s += txt(pt(0.5, 1)[0], pt(0.5, 1)[1] - 6, 'middle of the top', 12, { 'font-style': 'italic', fill: RED });
    return { w: 420, h: 230, svg: s };
  })();

  // the postcard: fold down the middle, cuts alternately from the fold and from the edges, then along the fold
  const POSTCARD = (function () {
    const X = 30, Y = 25, Wd = 360, Ht = 180, k = 11;
    let s = bg(420, 240);
    s += el('rect', { x: X, y: Y, width: Wd, height: Ht, fill: PAPER, stroke: INK, 'stroke-width': 2, rx: 3 });
    const mid = Y + Ht / 2, gap = 9;
    s += el('path', { d: 'M' + X + ' ' + mid + 'H' + (X + Wd), stroke: GREY, 'stroke-width': 1.5, 'stroke-dasharray': '6 4' });
    for (let i = 0; i < k; i++) {
      const x = X + (i + 1) * Wd / (k + 1);
      if (i % 2 === 0) s += el('path', { d: 'M' + x + ' ' + (Y + gap) + 'V' + (Y + Ht - gap), stroke: RED, 'stroke-width': 2 });
      else s += el('path', { d: 'M' + x + ' ' + Y + 'V' + (mid - gap) + 'M' + x + ' ' + (Y + Ht) + 'V' + (mid + gap), stroke: RED, 'stroke-width': 2 });
    }
    const xa = X + Wd / (k + 1), xb = X + k * Wd / (k + 1);
    s += el('path', { d: 'M' + xa + ' ' + mid + 'H' + xb, stroke: RED, 'stroke-width': 3 });
    s += txt(210, 228, 'red: cuts   ·   grey: the fold, uncut at both ends', 13, { 'font-style': 'italic', fill: GREY });
    return { w: 420, h: 240, svg: s };
  })();

  const A4 = (function () {
    let s = bg(400, 220);
    s += el('rect', { x: 60, y: 30, width: 127, height: 180, fill: PAPER, stroke: INK, 'stroke-width': 2 });
    s += el('path', { d: 'M60 120H187', stroke: GOLD, 'stroke-width': 2, 'stroke-dasharray': '8 4' });
    s += el('rect', { x: 230, y: 75, width: 127, height: 90, fill: PAPER2, stroke: INK, 'stroke-width': 2 });
    s += txt(123, 22, 'the sheet', 13, { 'font-style': 'italic', fill: GREY });
    s += txt(293, 67, 'half of it, turned', 13, { 'font-style': 'italic', fill: GREY });
    s += txt(210, 125, '→', 26, { fill: GOLD });
    return { w: 400, h: 220, svg: s };
  })();

  const QUARTER_SNIP = (function () {
    let s = bg(400, 200);
    s += el('rect', { x: 40, y: 40, width: 120, height: 120, fill: PAPER, stroke: INK, 'stroke-width': 2 });
    s += el('path', { d: 'M40 100H160M100 40V160', stroke: GOLD, 'stroke-width': 1.5, 'stroke-dasharray': '6 4' });
    s += txt(100, 185, 'fold in half twice', 13, { 'font-style': 'italic', fill: GREY });
    s += txt(200, 105, '→', 26, { fill: GOLD });
    s += el('rect', { x: 250, y: 60, width: 80, height: 80, fill: PAPER2, stroke: INK, 'stroke-width': 2 });
    s += el('path', { d: 'M250 88L278 60', stroke: RED, 'stroke-width': 3 });
    s += txt(236, 58, 'the folded corner', 12, { 'font-style': 'italic', fill: RED, 'text-anchor': 'start' });
    s += txt(290, 185, 'snip off the centre corner', 13, { 'font-style': 'italic', fill: GREY });
    return { w: 400, h: 200, svg: s };
  })();

  const STAMPS4 = (function () {
    let s = bg(400, 130);
    const cols = ['#b5473a', '#2e6fa8', '#3f8a55', '#8a4fa3'];
    for (let i = 0; i < 4; i++) {
      const x = 50 + i * 78;
      s += el('rect', { x, y: 30, width: 72, height: 72, fill: '#f4ecd6', stroke: '#fbf8ef', 'stroke-width': 4, 'stroke-dasharray': '0 7', 'stroke-linecap': 'round' });
      s += el('rect', { x: x + 9, y: 39, width: 54, height: 54, fill: cols[i], rx: 2 });
      s += txt(x + 36, 76, String(i + 1), 30, { fill: '#fffaf0', 'font-weight': 700 });
    }
    return { w: 400, h: 130, svg: s };
  })();

  const SNOWFLAKE = (function () {
    let s = bg(300, 240);
    const cx = 150, cy = 120;
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3 - Math.PI / 2, d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]];
      const p = (t, off) => [cx + d[0] * t + n[0] * off, cy + d[1] * t + n[1] * off];
      s += el('path', { d: pathOf([p(0, 0), p(90, 0)]), stroke: BLUE, 'stroke-width': 4, 'stroke-linecap': 'round' });
      s += el('path', { d: pathOf([p(40, 0), p(62, 18)]) + pathOf([p(40, 0), p(62, -18)]) + pathOf([p(64, 0), p(80, 12)]) + pathOf([p(64, 0), p(80, -12)]), stroke: BLUE, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' });
    }
    return { w: 300, h: 240, svg: s };
  })();

  const TWO_LOOPS = { w: 400, h: 240, svg: bg(400, 240) + drawBands([
    { halfTwists: 0, cx: 200, cy: 196, scale: 60, tilt: 106, turn: 38, width: 0.28, rot: (q) => [q[0], q[2], q[1] + 1] },
    { halfTwists: 0, cx: 200, cy: 196, scale: 60, tilt: 106, turn: 38, width: 0.28, rot: (q) => [q[2], q[0], q[1] + 1], color: '#efdca8' }
  ]) + txt(200, 230, 'two plain loops glued where they cross', 13, { 'font-style': 'italic', fill: GREY }) };

  const THREE_BANDS = { w: 420, h: 170, svg: bg(420, 170) + drawBands([
    { halfTwists: 0, cx: 75, cy: 78, scale: 52, tilt: 118, turn: 10 },
    { halfTwists: 1, cx: 210, cy: 78, scale: 52, tilt: 118, turn: 10 },
    { halfTwists: 2, cx: 345, cy: 78, scale: 52, tilt: 118, turn: 10 }
  ]) + txt(75, 160, 'A', 16, { 'font-weight': 700 }) + txt(210, 160, 'B', 16, { 'font-weight': 700 }) + txt(345, 160, 'C', 16, { 'font-weight': 700 }) };

  const PLAIN = { w: 400, h: 230, svg: bg(400, 230) + drawBands([{ halfTwists: 0, lines: [0], cx: 200, cy: 112, scale: 118, tilt: 120, turn: 20 }]) };
  const FULL_TWIST = { w: 400, h: 230, svg: bg(400, 230) + drawBands([{ halfTwists: 2, lines: [0], cx: 200, cy: 112, scale: 118, tilt: 120, turn: 20 }]) };

  Cabinet.family({
    id: 'paper-riddles', engine: 'question', cat: 'paper', name: 'Paper riddles', order: 3,
    blurb: 'Möbius bands, folds to the Moon, a postcard you can walk through: questions about what paper does when you fold, twist and cut it.',
    origin: { year: 1858, who: 'August Möbius, Johann Listing, and generations of conjurors', note: 'The one-sided band was found in 1858 by August Möbius and, independently, by Johann Listing. Magicians turned cut bands into a stage trick, and puzzle books have long asked how far a sheet folded in half again and again would reach.' },
    concepts: ['topology', 'folding']
  }, [
    {
      id: 'paper-loop-cut', title: 'Cutting a Plain Loop', diff: 1,
      text: 'Glue the ends of a strip of paper together to make a plain loop — no twist. Now cut along the dashed line down the middle of the strip, all the way round. What do you have when the scissors come back to the start?',
      hints: ['Nothing strange yet: this is the loop without a twist.'],
      explain: 'Two separate loops, each as long as the first and half as wide. Keep this in mind for the next few riddles: one small twist changes everything.',
      concepts: ['topology'], links: ['paper-mobius-half'],
      data: mc('Two separate loops, as long as the first', ['One loop, twice as long', ['Two loops linked like a chain', 'Only a twisted band does that.'], 'One loop with a knot in it'], { figure: PLAIN, glyph: '○' })
    },
    {
      id: 'paper-snip-quarter', title: 'Snip the Middle Corner', diff: 1,
      text: 'Fold a square of paper in half, and in half again, into a smaller square. Snip off, with one straight cut, the corner where the folds meet — the corner that was the middle of the sheet. What do you see when you open it?',
      hints: ['That corner is the centre of the sheet, four times over.'],
      explain: 'A diamond-shaped hole in the middle. The snip cut a small triangle from each of the four layers, all meeting at the centre; opened, the four triangles form a square turned on its point. Try it on the table in [[fold-cut-diamond]].',
      concepts: ['folding', 'symmetry'], links: ['fold-cut-diamond'],
      data: mc('A diamond-shaped hole in the middle', [['Four small triangles cut from the four corners', 'The corners of the sheet were not where the folds met.'], 'A square hole with its sides along the edges', 'A single straight slit'], { figure: QUARTER_SNIP, glyph: '◇' })
    },
    {
      id: 'paper-mobius-half', title: 'Möbius Cut in Half', diff: 2, year: 1858,
      source: 'The band was described by August Möbius and by Johann Listing in 1858.',
      text: 'Take a strip of paper, give one end a half-twist, and glue the ends together: a **Möbius band**. Cut along the dashed line down the middle of the strip, all the way round, until the scissors are back where they started. What do you get?',
      hints: ['Draw a pencil line down the middle first: how many times does it go round before it meets itself?', 'A Möbius band has only one edge, and the cut never reaches it.'],
      explain: '**One** band, twice as long and half as wide. It is no longer a Möbius band: it has two full twists, and two sides. The middle line of a Möbius band goes round only once, but the band has a single edge that goes round twice; cutting along the middle leaves that one long edge holding a single, doubled loop.',
      concepts: ['topology'], links: ['paper-mobius-third', 'paper-loop-cut'],
      data: mc('One band, twice as long', [['Two separate bands', 'That is the plain loop. The half-twist joins the two halves into one.'], 'Two bands linked together', 'One Möbius band, just as long'], { figure: mobiusFig([0], 'cut along the dashed line'), glyph: '∞' })
    },
    {
      id: 'paper-afghan', title: 'The Afghan Bands', diff: 2,
      source: 'A conjuring trick with bands of paper or cloth, known to magicians for well over a century.',
      text: 'A magician shows three large paper bands and tears each one along its middle, all the way round. The first falls into two separate loops. The second becomes one huge loop. The third becomes two loops linked like a chain.\n\nOne band had no twist, one a half-twist, one a full twist. Which one had the **half**-twist?',
      hints: ['The half-twist is the Möbius band.'],
      explain: 'The second: a Möbius band cut down the middle stays in one piece, twice as long. The untwisted band gives two loops, and the band with a full twist gives two loops linked together. Magicians call this "the Afghan bands"; in a big band the twists are too gentle for an audience to notice.',
      concepts: ['topology'], links: ['paper-mobius-half', 'paper-full-twist'],
      data: mc('The one that became one huge loop', ['The one that fell into two separate loops', 'The one that became two linked loops', 'None of them: a half-twist would tear'], { figure: THREE_BANDS, glyph: '∞' })
    },
    {
      id: 'paper-fold-count', title: 'Three Folds, How Many Creases?', diff: 2,
      text: 'Fold a strip of paper in half. Fold it in half again, the same way, and a third time. Now open it out flat. How many creases does it have?',
      hints: ['Each fold creases every layer at once.', 'One fold: 1 crease. Two folds: the second fold creases two layers…'],
      explain: '**7**. After n folds the strip is cut into 2ⁿ equal sections by 2ⁿ − 1 creases: 1, 3, 7, 15, 31… Each new fold adds a crease in the middle of every section.',
      concepts: ['folding', 'geometric-series'], links: ['paper-mountains-valleys'],
      data: { answer: { num: 7 }, traps: [{ match: 3, msg: 'Three folds, but each fold creases all the layers: the second makes two creases, the third four.' }, { match: 8, msg: 'Eight is the number of sections between the creases.' }, { match: 6, msg: 'Count again: 1 + 2 + 4.' }], glyph: '〰' }
    },
    {
      id: 'paper-a4', title: 'The Shape That Halves Itself', diff: 2,
      text: 'Fold a sheet of A4 paper in half across its long side and you get A5 — which has exactly the same shape as A4, only smaller. (Fold A5 in half and you get A6, and so on.)\n\nWhat is the ratio of the long side to the short side? Two decimal places will do.',
      hints: ['Call the sides L and S. Half the sheet has sides S and L/2.', 'The same shape: L / S = S / (L/2).'],
      explain: 'L / S = S / (L/2) gives L² = 2S², so the ratio is **√2 ≈ 1.414**. No other rectangle keeps its shape when halved. The idea was proposed by Georg Lichtenberg in 1786 and became the German standard DIN 476 in 1922; A0 is the sheet of one square metre.',
      concepts: ['folding'],
      data: { answer: { num: 1.4142, tol: 0.006 }, traps: [{ match: 2, msg: 'That is the ratio of the areas of A4 and A5. The sides differ by less.' }, { match: 1.5, msg: 'Close, but halving a 3 : 2 sheet gives 4 : 3 — a different shape.' }], figure: A4, glyph: '√2' }
    },
    {
      id: 'paper-fold-to-moon', title: 'Folding to the Moon', diff: 2,
      text: 'A sheet of paper is 0.1 mm thick. Imagine you could fold it in half as often as you like, each fold doubling the thickness. How many folds would it take for the stack to reach the Moon, 384,000 km away?',
      hints: ['After 10 folds the stack is 2¹⁰ = 1024 sheets — about 10 cm.', 'Every 10 more folds multiply the thickness by about a thousand: 20 folds ≈ 100 m, 30 folds ≈ 100 km, 40 folds ≈ 100,000 km.'],
      explain: '**42** folds. 2⁴¹ × 0.1 mm is about 220,000 km, not quite there; 2⁴² × 0.1 mm is about 440,000 km — past the Moon. Doubling is so fast that, forty folds from a sheet of paper, you are most of the way. (No real sheet can be folded more than a dozen times or so: see [[paper-twelve-folds]].)',
      concepts: ['geometric-series'], links: ['paper-twelve-folds'],
      data: { answer: { num: 42 }, traps: [{ match: 41, msg: 'Just short: 2⁴¹ × 0.1 mm is about 220,000 km.' }, { match: 43, msg: 'One fold too many: 42 already reaches past the Moon.' }], glyph: '☾' }
    },
    {
      id: 'paper-twelve-folds', title: 'The Seven-Fold Rule', diff: 2, year: 2002,
      source: 'Britney Gallivan, *How to Fold Paper in Half Twelve Times* (2002).',
      text: 'An old saying: *no sheet of paper, however large or thin, can be folded in half more than seven times.* Is that true?',
      hints: ['Every fold doubles the thickness, and the curved fold at the edge eats up paper: the next fold needs a much longer sheet.'],
      explain: 'It is not. In 2002 a high-school student, Britney Gallivan, worked out how much paper each fold uses up at the bends, and then folded a single very long strip of thin paper in half **twelve** times. The saying is right about ordinary sheets only because each extra fold needs the paper to be very much longer.',
      concepts: ['geometric-series', 'folding'], links: ['paper-fold-to-moon'],
      data: mc('No: a long strip has been folded in half twelve times', [['Yes: seven is a law of nature', 'It is only a rule of thumb for ordinary sheets.'], 'Yes, unless the paper is wet', 'No: any sheet can be folded twenty times with enough force'], { glyph: '12' })
    },
    {
      id: 'paper-snowflake', title: 'The Six-Armed Snowflake', diff: 2,
      text: 'Real snowflakes have six arms, and each arm is a mirror image of itself down its middle. To cut such a snowflake from a circle of paper, you fold it into equal wedges, all layers together, and cut through the stack.\n\nInto how many wedges must the paper be folded?',
      hints: ['Every crease becomes a mirror line of the design.', 'Six arms, and each arm has its own mirror line down the middle as well as the lines between arms.'],
      explain: '**12** wedges of 30°. A snowflake has twelve mirror halves: six arms, each split by its own mirror line. Fold in half, then in thirds, then in half again, and every cut is repeated twelve times, mirrored — as in [[fold-cut-star-6]].',
      concepts: ['symmetry', 'folding'], links: ['fold-cut-star-6'],
      data: { answer: { num: 12 }, traps: [{ match: 6, msg: 'Six wedges give a design with six parts, but alternate parts are mirror images: that makes three matching pairs, not six matching arms.' }], figure: SNOWFLAKE, glyph: '❄' }
    },
    {
      id: 'paper-mobius-third', title: 'Möbius Cut in Thirds', diff: 3,
      text: 'Make another Möbius band. This time cut along a line one third of the way in from the edge, always keeping the same distance from the edge. Oddly, the scissors go round the band twice before they meet the start of the cut. What do you have at the end?',
      hints: ['The cut divides the strip into three lanes. The middle lane is a thinner Möbius band of its own.', 'The two outer lanes are really one lane — the band has only one edge.'],
      explain: '**Two bands, linked together**: the middle third is a thin Möbius band as long as the first, and the two outer thirds have become one band twice as long, with two full twists, looped through it.',
      concepts: ['topology'], links: ['paper-mobius-half'],
      data: mc('Two bands linked together: one as long as the first, one twice as long', [['One band, twice as long', 'That is the cut down the middle.'], 'Three separate bands', 'Two separate bands of the same length'], { figure: mobiusFig([-1 / 3, 1 / 3], 'one cut: it goes round twice'), glyph: '∞' })
    },
    {
      id: 'paper-full-twist', title: 'A Full Twist', diff: 3,
      text: 'This band has a **full** twist — two half-twists — before its ends were glued. Cut it down the middle, all the way round. What do you get?',
      hints: ['With two half-twists the band has two sides and two edges again, like a plain loop. But the two halves are wound round each other.'],
      explain: '**Two bands, each as long as the first, linked together** — each with a full twist of its own. The cut separates the two edges, as in a plain loop, but the twist has wound the two halves once round each other.',
      concepts: ['topology', 'knot-theory'], links: ['paper-afghan', 'paper-mobius-half'],
      data: mc('Two bands linked together, each as long as the first', ['Two separate bands', 'One band, twice as long', ['One band tied in a knot', 'That needs three half-twists: cut a band with three half-twists down the middle and you get a single band tied in an overhand (trefoil) knot.']], { figure: FULL_TWIST, glyph: '∞' })
    },
    {
      id: 'paper-postcard', title: 'Walk Through a Postcard', diff: 3,
      text: 'Can you cut a hole in an ordinary postcard large enough to step through — with nothing but scissors, no tape, no glue?',
      hints: ['The hole does not have to be made from a solid piece of card: a long thin ring of card would do.', 'Cut the card into a zigzag ribbon that stays joined in a loop: the figure shows one way.'],
      explain: '**Yes.** Fold the card in half lengthwise. Cut from the fold towards the edges, and from the edges towards the fold, alternately, never all the way. Unfold and cut along the fold, but not through the two end strips. The card opens into one long zigzag ring, and the more cuts, the longer the ring: a dozen are enough for a child to step through, a few dozen for an adult.',
      concepts: ['topology', 'lateral'],
      data: mc('Yes', [['No: a hole cannot be larger than the card', 'The card\'s area limits the paper, not the length of the ring you can cut from it.'], 'Only if the card is folded into a cone', 'Only a hole big enough for a hand'], { figure: POSTCARD, glyph: '✂' })
    },
    {
      id: 'paper-mountains-valleys', title: 'Mountains and Valleys', diff: 3,
      text: 'Fold a strip in half three times, always the same way, and open it again so the creases are half-folded. Looking at it from one side, some creases are *valleys* and some are *mountains*. Of the seven creases, are there as many of one kind as of the other?',
      hints: ['The first fold makes one crease. The second fold adds one crease on each side of it — but the two layers were facing opposite ways.'],
      explain: '**No — four of one kind and three of the other.** Each new fold adds a crease between every pair of old ones, alternately one kind and the other, and the middle crease belongs to the majority. Reading from one end the creases go V V M V V M M: the "regular paper-folding sequence". Opened to right angles, it draws the dragon curve ([[paper-dragon]]).',
      concepts: ['folding', 'sequence'], links: ['paper-fold-count', 'paper-dragon'],
      data: mc('No: four of one kind, three of the other', ['Yes: they alternate', ['Yes: the first four are one kind, the last three the other', 'The crease pattern is not so tidy: V V M V V M M.'], 'No: six of one kind, one of the other'], { glyph: '⋀⋁' })
    },
    {
      id: 'paper-stamps-four', title: 'The Impossible Pile', diff: 3,
      text: 'A strip of four stamps is folded along its perforations into one pile. Which of these orders, reading from the top of the pile down, can **not** be made?',
      hints: ['Stamps 1 and 2 are joined along one edge, and so are 3 and 4. Picture the joints from the side of the pile.', 'Joins between consecutive stamps alternate: 1–2 on one side of the pile, 2–3 on the other, 3–4 on the first side again.'],
      explain: '**1 3 2 4.** Seen from the side, the join 1–2 must wrap round stamp 3 and the join 3–4 must wrap round stamp 2 — and both joins are on the same side of the pile (joins alternate sides), so one would have to pass through the other. Of the 24 possible orders, 16 can be folded. Try folding piles yourself in [[f:stamp-folding|Folding stamps]].',
      concepts: ['folding', 'combinatorics'], links: ['stamps-1x4-1'],
      data: mc('1 3 2 4', ['1 2 3 4', '2 1 4 3', '4 3 1 2'], { figure: STAMPS4, glyph: '▦' })
    },
    {
      id: 'paper-dragon', title: 'The Dragon in the Strip', diff: 3,
      source: 'The dragon curve was first studied by the NASA physicists John Heighway, Bruce Banks and William Harter; Martin Gardner wrote about it in 1967.',
      text: 'Fold a long strip of paper in half, again and again, always the same way. Open it so that every crease makes a right angle, and look down on it: the strip draws a winding path that never crosses itself — the **dragon curve**. The picture shows it after ten folds.\n\nAfter **four** folds, how many straight pieces does the path have?',
      hints: ['The straight pieces are the sections between creases.', 'n folds make 2ⁿ − 1 creases.'],
      explain: '**16**: four folds cut the strip into 2⁴ = 16 sections, joined by 15 right-angle turns. The turns follow the paper-folding sequence (see [[paper-mountains-valleys]]); however long the strip, the path never crosses itself, and copies of the dragon fit together to tile the plane.',
      concepts: ['folding', 'sequence', 'recursion'], links: ['paper-mountains-valleys', 'paper-fold-count'],
      data: { answer: { num: 16 }, traps: [{ match: 15, msg: 'Fifteen is the number of creases — the turns. The pieces between them are one more.' }, { match: 4, msg: 'Each fold doubles the number of pieces.' }], figure: { w: 360, h: 260, svg: dragonFig(10, 360, 260) }, glyph: '🐉' }
    },
    {
      id: 'paper-two-loops', title: 'Two Loops Make a Square', diff: 4,
      text: 'Make two plain paper loops (no twists) of the same size, and glue them together at right angles where they cross, like the picture. Now cut each loop along its middle, all the way round (cutting through the glued square as you pass it). What falls out?',
      hints: ['Each loop cut down its middle would fall into two loops — but the glued square joins them.', 'Look at the glued square after both cuts: it has been cut into four small squares, each joined to two strips.'],
      explain: 'A **square** frame! The four half-loops are joined at the four quarters of the glued patch, each quarter joining one half of the first loop to one half of the second — four straight-ish sides meeting at four corners. It is a favourite demonstration of how cutting changes the way paper is connected.',
      concepts: ['topology'], links: ['paper-loop-cut'],
      data: mc('A square frame', ['Four separate loops', 'Two loops linked like a chain', 'One big loop, twice as long'], { figure: TWO_LOOPS, glyph: '□' })
    },
    {
      id: 'paper-knot-pentagon', title: 'The Knot in the Ribbon', diff: 3,
      text: 'Tie a simple overhand knot in a long, even strip of paper, and pull it gently tight so that it lies flat, creasing the paper where it folds. What is the shape of the flattened knot?',
      hints: ['The strip folds over itself at every corner, always at the same angle.', 'The corners come from the strip crossing itself: count the edges you see.'],
      explain: 'A **regular pentagon**. The flattened knot is made of five folds of the same strip, and because the strip has the same width everywhere, all the edges and all the angles come out equal.',
      concepts: ['folding', 'knot-theory'],
      data: mc('A regular pentagon', ['A square', 'A regular hexagon', 'An equilateral triangle'], { glyph: '🎗' })
    },
    {
      id: 'paper-haga', title: 'Haga\'s Fold', diff: 4,
      source: 'Kazuo Haga, a Japanese biologist who invented a whole school of origami geometry ("origamics") from folds like this one.',
      text: 'Take a square sheet. Fold its bottom-right corner up onto the middle of the top edge, and flatten the fold. The folded-over flap has an edge that runs down to the left side of the square.\n\nHow far up the left side does it cross it, as a fraction of the side? (Measure from the bottom.)',
      hints: ['Give the square side 1 and put its corners at (0, 0) and (1, 1). The corner (1, 0) lands at (½, 1).', 'The crease is the perpendicular bisector of the corner and its landing point: it runs from (0, ⅛) to (1, ⅝). The flap\'s edge is the reflection of the bottom edge in that crease.'],
      explain: '**1/3.** The folded edge goes from (½, 1) towards the reflection of the bottom-left corner, (−0.1, 0.2), and crosses the left side at height ⅓. So one fold finds a third of the side — no ruler needed. This is Haga\'s first theorem; the crease itself meets the right side at ⅝.',
      concepts: ['folding'],
      data: { answer: { num: 1 / 3, tol: 0.01, show: '1/3' }, traps: [{ match: 0.5, msg: 'Not a half — the flap\'s edge comes down steeper than that.' }, { match: 2 / 3, msg: 'Two thirds is measured from the top; the question measures from the bottom.' }], figure: HAGA, glyph: '⅓' }
    }
  ]);
})();
