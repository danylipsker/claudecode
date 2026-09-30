/* The Puzzle Cabinet · data/brainteasers.js
 * Famous brainteasers: hats, islanders, pirates, prisoners and their friends. Every puzzle is retold in our
 * own words; where a source is named it is one we are sure of, and the rest are folklore. */
(function () {
  'use strict';
  const C = Cabinet;

  C.concepts([
    { id: 'induction', name: 'Induction: one case at a time', see: ['recursion', 'working-backwards'],
      text: 'Some puzzles are hopeless for a hundred people but easy for one, and then for two, and then for three, each case leaning on the case below it. Solve the smallest case, show that every case follows from the one before, and the whole tower stands. The pirates who divide the gold, the muddy children and the blue-eyed islanders are all solved this way: start with the smallest crowd and climb.' },
    { id: 'common-knowledge', name: 'Common knowledge', see: ['deduction', 'induction'],
      text: 'A fact is **common knowledge** in a group when everybody knows it, everybody knows that everybody knows it, and so on for ever. That is much more than everybody knowing it. A public announcement can change what a crowd is able to work out, even when each person already knew the news in private, because now everybody also knows that everybody heard it.' },
    { id: 'game-theory', name: 'Rational players', see: ['working-backwards', 'expected-value'],
      text: 'When each player’s best move depends on what the others will do, and they are all reasoning about one another, the usual way in is to start from the end: what would the last player do? Then the one before, knowing that? The answers can be surprising: the weakest shot should fire into the air, the boss of the pirates keeps almost everything, and a room of perfectly logical people all guess zero.' },
    { id: 'paradox', name: 'Paradoxes',
      text: 'A paradox is an argument that looks sound and ends in an impossible conclusion. The fun is in finding the step that is not as sound as it looks: a hidden assumption, a quantity that quietly changes meaning halfway through, or a statement that is trying to talk about its own truth.' },
    { id: 'information', name: 'Yes-or-no questions and information', see: ['binary', 'pigeonhole'],
      text: 'Every yes-or-no answer can at best cut the possibilities in half, so *n* questions can tell apart at most 2ⁿ things. That single fact says how many questions you need to find a number from 1 to 1000 (ten), how few tasters can test a cellar of wine (also ten) and why some strategies for the prisoners with hats simply cannot exist.' }
  ]);

  /* ---------- small helpers ---------- */

  // a choice answer: the right one goes to a place that cycles from puzzle to puzzle; each wrong one may carry the message shown when it is picked
  let mcCount = 0;
  function mc(right, wrongs, extra) {
    const at = (mcCount++ * 7 + 2) % (wrongs.length + 1);
    const choices = wrongs.map((w) => (Array.isArray(w) ? w[0] : w));
    choices.splice(at, 0, right);
    const msgs = wrongs.map((w) => (Array.isArray(w) ? w[1] : null));
    msgs.splice(at, 0, null);
    const idx = choices.map((_, i) => i);
    const ex = Object.assign({}, extra || {});
    if (ex.order) {
      const key = (c) => { const i = ex.order.findIndex((k) => c.indexOf(k) >= 0); return i < 0 ? 99 : i; };
      idx.sort((a, b) => key(choices[a]) - key(choices[b]));
    }
    delete ex.order;
    const traps = [];
    idx.forEach((oldI, newI) => { if (msgs[oldI]) traps.push({ match: newI, msg: msgs[oldI] }); });
    return Object.assign({ answer: { choice: idx.indexOf(at), choices: idx.map((i) => choices[i]) }, traps }, ex);
  }

  const INK = '#3a3020', CREAM = '#fbf8ef', TAN = '#e9dfc4', RED = '#b0472f', BLUE = '#3a6ea5', GREEN = '#5a8a3a', GOLD = '#c9a24a', GREY = '#cfc7b0';
  const el = (tag, at, inner) => '<' + tag + Object.keys(at).map((k) => ' ' + k + '="' + at[k] + '"').join('') + (inner == null ? '/>' : '>' + inner + '</' + tag + '>');
  const txt = (x, y, s, size, o) => el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': size || 14, 'font-family': 'Georgia,serif', fill: INK }, o || {}), s);
  const box = (x, y, w, h, fill, o) => el('rect', Object.assign({ x, y, width: w, height: h, fill: fill || 'none', stroke: INK, 'stroke-width': 3, rx: 4 }, o || {}));
  const ball = (x, y, r, fill, o) => el('circle', Object.assign({ cx: x, cy: y, r, fill: fill || 'none', stroke: INK, 'stroke-width': 3 }, o || {}));
  const ln = (x1, y1, x2, y2, o) => el('line', Object.assign({ x1, y1, x2, y2, stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, o || {}));
  const path = (d, o) => el('path', Object.assign({ d, fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, o || {}));

  // a little person standing with feet at (x, y); hat: null, a colour, or '?' for a hidden hat
  function person(x, y, s, hat, o) {
    o = o || {};
    let g = ln(x - 4 * s, y - 12 * s, x - 5 * s, y) + ln(x + 4 * s, y - 12 * s, x + 5 * s, y);
    g += box(x - 8 * s, y - 36 * s, 16 * s, 26 * s, o.shirt || BLUE, { rx: 6 * s, 'stroke-width': 2.5 });
    g += ball(x, y - 46 * s, 9 * s, '#f5e6c8', { 'stroke-width': 2.5 });
    if (hat) {
      const col = hat === '?' ? GREY : hat;
      g += el('ellipse', { cx: x, cy: y - 53 * s, rx: 12 * s, ry: 3 * s, fill: col, stroke: INK, 'stroke-width': 2.5 });
      g += el('path', { d: 'M' + (x - 8 * s) + ' ' + (y - 54 * s) + ' Q' + x + ' ' + (y - 74 * s) + ' ' + (x + 8 * s) + ' ' + (y - 54 * s) + ' Z', fill: col, stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
      if (hat === '?') g += txt(x, y - 58 * s, '?', 11 * s, { 'font-weight': 700 });
    }
    return g;
  }

  const F = {
    well: {
      w: 420, h: 240, svg: box(150, 30, 120, 190, '#c9c0a4', { rx: 3 }) + box(166, 30, 88, 190, '#8fb8d8', { rx: 0, 'stroke-width': 2 }) +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => ln(270, 220 - k * 19, k % 5 ? 282 : 292, 220 - k * 19, { 'stroke-width': 2 }) + (k % 5 === 0 ? txt(312, 225 - k * 19, k + ' m', 13) : '')).join('') +
        el('ellipse', { cx: 210, cy: 210, rx: 16, ry: 9, fill: '#c98a5a', stroke: INK, 'stroke-width': 2.5 }) + ball(226, 204, 5, '#c98a5a', { 'stroke-width': 2.5 }) + ln(228, 199, 232, 190, { 'stroke-width': 2 }) + ln(224, 199, 222, 190, { 'stroke-width': 2 }) +
        txt(100, 210, 'snail', 14, { 'font-style': 'italic' }) + txt(210, 20, 'a well 10 m deep', 14, { 'font-style': 'italic' })
    },
    fiveHats: {
      w: 400, h: 215, svg: person(110, 168, 1.7, '?') + person(210, 168, 1.7, '?', { shirt: GREEN }) + person(310, 168, 1.7, '?', { shirt: RED }) +
        ln(60, 178, 350, 178, { 'stroke-width': 2, stroke: '#b0a070' }) +
        txt(110, 200, 'sees two hats', 13) + txt(210, 200, 'sees one', 13) + txt(310, 200, 'sees none', 13) +
        el('polygon', { points: '345,140 365,132 365,148', fill: INK }) +
        txt(200, 22, 'three white hats and two black ones in the bag', 14, { 'font-style': 'italic' })
    },
    fourHats: {
      w: 420, h: 200, svg: person(60, 140, 1.6, '?') + person(140, 140, 1.6, '?', { shirt: GREEN }) + person(220, 140, 1.6, '?', { shirt: RED }) +
        box(280, 30, 14, 130, '#a08f6a', { rx: 2 }) + person(350, 140, 1.6, '?', { shirt: '#8a6ea5' }) +
        ln(20, 150, 390, 150, { 'stroke-width': 2, stroke: '#b0a070' }) +
        txt(60, 176, 'A', 15, { 'font-weight': 700 }) + txt(140, 176, 'B', 15, { 'font-weight': 700 }) + txt(220, 176, 'C', 15, { 'font-weight': 700 }) + txt(350, 176, 'D', 15, { 'font-weight': 700 }) +
        txt(287, 22, 'wall', 13, { 'font-style': 'italic' }) + txt(150, 26, 'facing the wall', 13, { 'font-style': 'italic' })
    },
    hatLine: {
      w: 420, h: 150, svg: (function () {
        let s = '';
        const cols = ['#2a2a2a', '#f6f1e2', '#f6f1e2', '#2a2a2a', '#2a2a2a', '#f6f1e2', '#2a2a2a', '#f6f1e2', '#f6f1e2', '#2a2a2a'];
        for (let i = 0; i < 10; i++) s += person(38 + i * 38, 118, 0.95, cols[i], { shirt: i % 2 ? '#7d9bbf' : '#8fb072' });
        s += el('polygon', { points: '406,92 416,86 416,98', fill: INK });
        s += txt(210, 20, 'one possible line-up: everyone sees only the hats in front', 13, { 'font-style': 'italic' });
        return s;
      })()
    },
    wason: {
      w: 420, h: 150, svg: ['E', 'K', '4', '7'].map((c, i) => box(20 + i * 100, 25, 80, 100, CREAM, { rx: 8 }) + txt(60 + i * 100, 88, c, 44, { 'font-weight': 700, fill: i % 2 ? BLUE : RED })).join('')
    },
    antsRod: {
      w: 440, h: 130, svg: box(30, 60, 380, 12, '#c9a970', { rx: 6 }) + txt(30, 100, '0 cm', 13) + txt(410, 100, '100 cm', 13) +
        [[90, 1], [160, -1], [230, 1], [300, -1], [350, 1]].map((a) =>
          el('ellipse', { cx: a[0], cy: 52, rx: 9, ry: 5, fill: INK }) + ball(a[0] + a[1] * 10, 51, 3.5, INK, { 'stroke-width': 0 }) +
          path('M' + (a[0] + a[1] * 14) + ' 38 L' + (a[0] + a[1] * 30) + ' 38 M' + (a[0] + a[1] * 24) + ' 33 L' + (a[0] + a[1] * 30) + ' 38 L' + (a[0] + a[1] * 24) + ' 43', { stroke: RED, 'stroke-width': 2.5 })).join('') +
        txt(220, 22, 'every ant walks at 1 cm per second', 14, { 'font-style': 'italic' })
    },
    goldChain: {
      w: 420, h: 110, svg: (function () {
        let s = '';
        for (let i = 0; i < 7; i++) s += el('ellipse', { cx: 40 + i * 56, cy: 55, rx: 32, ry: 15, fill: 'none', stroke: GOLD, 'stroke-width': 9 }) + el('ellipse', { cx: 40 + i * 56, cy: 55, rx: 32, ry: 15, fill: 'none', stroke: INK, 'stroke-width': 1.5 });
        s += txt(210, 100, 'seven gold links', 14, { 'font-style': 'italic' });
        return s;
      })()
    },
    lockers: {
      w: 420, h: 250, svg: (function () {
        let s = '';
        for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
          const n = r * 10 + c + 1;
          s += box(30 + c * 36, 12 + r * 22, 32, 19, '#dfe6ee', { 'stroke-width': 1.5, rx: 2 }) + txt(46 + c * 36, 26 + r * 22, n, 10);
        }
        return s;
      })()
    },
    clock: {
      w: 300, h: 220, svg: ball(150, 110, 90, CREAM) + (function () {
        let s = '';
        for (let i = 0; i < 12; i++) {
          const a = i * Math.PI / 6;
          s += ln(150 + 78 * Math.sin(a), 110 - 78 * Math.cos(a), 150 + 88 * Math.sin(a), 110 - 88 * Math.cos(a), { 'stroke-width': 3 });
        }
        s += ln(150, 110, 150, 46, { 'stroke-width': 3 }) + ln(150, 110, 150, 68, { 'stroke-width': 6, stroke: RED }) + ball(150, 110, 5, INK);
        return s;
      })()
    },
    keyBoard: {
      w: 420, h: 190, svg: (function () {
        const heads = [1, 2, 5, 7];
        let s = '';
        for (let i = 0; i < 8; i++) {
          const x = 30 + (i % 4) * 90, y = 40 + Math.floor(i / 4) * 66;
          s += box(x, y, 84, 60, (i % 4 + Math.floor(i / 4)) % 2 ? '#e8d9b0' : '#f3ead0', { 'stroke-width': 2, rx: 2 }) + txt(x + 14, y + 16, i, 13, { 'font-weight': 700, fill: BLUE });
          if (heads.indexOf(i) >= 0) s += ball(x + 46, y + 34, 18, GOLD, { 'stroke-width': 2.5 }) + txt(x + 46, y + 40, 'H', 17, { 'font-weight': 700 });
          else s += ball(x + 46, y + 34, 18, '#b8b3a0', { 'stroke-width': 2.5 }) + txt(x + 46, y + 40, 'T', 17, { 'font-weight': 700 });
        }
        // key marker under square 4
        s += ball(30 + 12, 40 + 66 + 48, 6, 'none', { stroke: RED, 'stroke-width': 3 }) + ln(48, 154, 58, 154, { stroke: RED, 'stroke-width': 3 }) + ln(55, 154, 55, 160, { stroke: RED, 'stroke-width': 3 });
        s += txt(210, 20, 'heads on 1, 2, 5, 7 · the key is under 4', 13, { 'font-style': 'italic' });
        return s;
      })()
    },
    building: {
      w: 420, h: 250, svg: (function () {
        let s = box(150, 20, 120, 200, '#e9dfc4', { rx: 3 });
        for (let f = 0; f < 10; f++) for (let c = 0; c < 3; c++) s += box(162 + c * 34, 30 + f * 19, 22, 12, '#b8d0e6', { 'stroke-width': 1.5, rx: 1 });
        s += ln(60, 220, 360, 220, { 'stroke-width': 3 });
        s += el('ellipse', { cx: 92, cy: 205, rx: 13, ry: 16, fill: CREAM, stroke: INK, 'stroke-width': 3 }) + el('ellipse', { cx: 128, cy: 205, rx: 13, ry: 16, fill: CREAM, stroke: INK, 'stroke-width': 3 });
        s += txt(210, 242, 'two identical eggs', 13, { 'font-style': 'italic' }) + txt(340, 100, 'floors', 13, { 'font-style': 'italic' });
        return s;
      })()
    },
    truel: {
      w: 420, h: 230, svg: path('M210 40 L80 180 L340 180 Z', { 'stroke-width': 2, 'stroke-dasharray': '6 5' }) +
        ball(210, 40, 24, '#8fb072') + ball(80, 180, 24, '#e0b070') + ball(340, 180, 24, '#c98080') +
        txt(210, 46, 'Ada', 14, { 'font-weight': 700 }) + txt(80, 186, 'Ben', 14, { 'font-weight': 700 }) + txt(340, 186, 'Cy', 14, { 'font-weight': 700 }) +
        txt(210, 20, 'hits 1 time in 3', 13, { 'font-style': 'italic' }) + txt(80, 216, 'hits 2 times in 3', 13, { 'font-style': 'italic' }) + txt(340, 216, 'never misses', 13, { 'font-style': 'italic' })
    },
    hotel: {
      w: 440, h: 130, svg: (function () {
        let s = '';
        for (let i = 0; i < 6; i++) s += box(24 + i * 62, 40, 50, 60, '#e9dfc4', { rx: 3 }) + txt(49 + i * 62, 76, i + 1, 20, { 'font-weight': 700 }) + ball(49 + i * 62, 54, 4, INK);
        s += txt(410, 78, '…', 30, { 'font-weight': 700 }) + txt(220, 22, 'every room is taken', 14, { 'font-style': 'italic' });
        return s;
      })()
    },
    candles: {
      w: 340, h: 200, svg: [[100, '4 hours'], [240, '5 hours']].map((c) => box(c[0] - 18, 70, 36, 100, '#f2e2b0', { rx: 3 }) + path('M' + c[0] + ' 70 L' + c[0] + ' 58', { 'stroke-width': 2 }) +
        el('path', { d: 'M' + c[0] + ' 30 Q' + (c[0] + 9) + ' 46 ' + c[0] + ' 58 Q' + (c[0] - 9) + ' 46 ' + c[0] + ' 30 Z', fill: '#e8a040', stroke: INK, 'stroke-width': 2 }) + txt(c[0], 192, 'burns out in ' + c[1], 13, { 'font-style': 'italic' })).join('')
    },
    antsTriangle: {
      w: 420, h: 210, svg: path('M210 30 L70 170 L350 170 Z', { 'stroke-width': 3, fill: '#efe7cc' }) + [[210, 30], [70, 170], [350, 170]].map((p) => el('ellipse', { cx: p[0], cy: p[1], rx: 12, ry: 7, fill: INK })).join('') +
        txt(210, 196, 'each ant picks an edge and walks along it', 13, { 'font-style': 'italic' })
    },
    pirates: {
      w: 440, h: 200, svg: (function () {
        let s = '';
        const labels = ['captain', 'rank 2', 'rank 3', 'rank 4', 'cabin boy'];
        for (let i = 0; i < 5; i++) s += person(60 + i * 80, 140, 1.5, i === 0 ? RED : null, { shirt: i === 0 ? '#8a3b2a' : (i % 2 ? '#7d9bbf' : '#8fb072') }) + txt(60 + i * 80, 168, labels[i], 12, { 'font-style': 'italic' });
        s += txt(220, 24, '100 gold coins · proposals · a vote', 14, { 'font-style': 'italic' });
        return s;
      })()
    }
  };

  const REF = { crt: 'Shane Frederick, “Cognitive Reflection and Decision Making”, Journal of Economic Perspectives (2005).' };

  Cabinet.family({
    id: 'brainteasers', engine: 'question', cat: 'logic', name: 'Famous brainteasers', order: 3,
    blurb: 'Hats, islanders, pirates and prisoners: the great logic puzzles that mathematicians pass around, each with the trap it is famous for.',
    origin: { year: 1950, who: 'Mathematicians, logicians and puzzle columnists', note: 'Most of these puzzles were handed from mathematician to mathematician for years before they were written down: the hats and the prisoners, the islanders and the pirates. Martin Gardner and other columnists carried many of them to a wide public in the second half of the twentieth century.' },
    concepts: ['deduction', 'induction', 'common-knowledge']
  }, [

    /* ============================ EASY ============================ */
    {
      id: 'bt-brick', title: 'The Brick', diff: 1,
      source: 'A traditional puzzle.',
      text: 'A brick weighs **1 kilogram plus half a brick**.\n\nHow many kilograms does a whole brick weigh?',
      hints: ['The brick is made of two equal halves. One of them is the “half a brick” in the puzzle.', 'So what must the other half weigh?'],
      explain: 'A whole brick is two halves. The puzzle says a whole brick weighs 1 kg plus one half-brick, so the *other* half-brick must weigh exactly 1 kg, and the whole brick weighs **2 kg**. In symbols: *b* = 1 + *b*/2, so *b*/2 = 1.',
      data: { answer: { num: 2, unit: 'kg' }, traps: [{ match: 1.5, msg: 'Try it: half of 1.5 kg is 0.75 kg, and 1 + 0.75 is 1.75 kg, not 1.5.' }, { match: 1, msg: 'If it weighed 1 kg, then half a brick would be half a kilogram, and 1 + ½ is 1½ kg, not 1.' }], glyph: '🧱' },
      concepts: ['deduction'], links: ['bt-bat-ball']
    },
    {
      id: 'bt-fenceposts', title: 'Posts Along the Fence', diff: 1,
      source: 'A traditional puzzle.',
      text: 'A straight fence is **100 metres** long. Fence posts stand along it **every 10 metres**, with one post at each end.\n\nHow many posts are there?',
      hints: ['Draw a short fence, 30 metres long with posts every 10 metres, and count the posts and the gaps.', 'How does the number of gaps compare with the number of posts?'],
      explain: 'There are ten gaps of 10 metres each, but a fence with a post at each end always has **one more post than gaps**: **11** posts. The same trap catches people who count floors, birthday candles or steps: the number of gaps is one fewer than the number of things they lie between.',
      data: { answer: { num: 11 }, traps: [{ match: 10, msg: 'That is the number of gaps between the posts. Now count the posts themselves, at both ends.' }], glyph: '🚧' },
      concepts: ['sequence'], links: ['bt-brick']
    },
    {
      id: 'bt-bat-ball', title: 'The Bat and the Ball', diff: 1,
      source: REF.crt,
      text: 'A bat and a ball cost **$1.10** together. The bat costs **$1.00 more** than the ball.\n\nHow much does the ball cost?',
      hints: ['“One dollar more” means the difference between the two prices is exactly a dollar.', 'If the ball cost 10 cents, what would the bat cost, and what would the two cost together?'],
      explain: 'If the ball costs *b*, the bat costs *b* + 100 cents, so together 2*b* + 100 = 110 and *b* = **5 cents**. The quick answer, 10 cents, makes the bat $1.10 and the pair $1.20. Shane Frederick used this puzzle in a short test of whether people check their first answer, and a surprising number of clever people do not.',
      data: { answer: { num: 5, unit: 'cents' }, ask: 'Give the price of the ball in cents.', traps: [{ match: 10, msg: 'That is the famous quick answer. Check it: the bat would then cost $1.10 and the pair $1.20.' }], glyph: '5¢' },
      concepts: ['deduction'], links: ['bt-widgets', 'bt-lily-pad']
    },
    {
      id: 'bt-lily-pad', title: 'The Lily Pads', diff: 1,
      source: REF.crt,
      text: 'Lily pads spread over a pond. The patch **doubles in size every day**, and on day 48 it covers the whole pond.\n\nOn which day did the patch cover exactly **half** of the pond?',
      hints: ['What was the patch the day before it covered everything?', 'If it doubles every day, then a day earlier it was half as big.'],
      explain: 'The patch doubles each day, so the day before the pond is full it was half full: **day 47**. Growth by doubling is a great deal quicker than it feels, and the last day does half the work.',
      data: { answer: { num: 47 }, ask: 'Which day?', traps: [{ match: 24, msg: 'Halfway in time is not halfway in pond. The patch is tiny for most of the 48 days, and then it explodes.' }], glyph: '×2' },
      concepts: ['geometric-series'], links: ['bt-bat-ball', 'bt-widgets']
    },
    {
      id: 'bt-tournament', title: 'The Knockout Tournament', diff: 2,
      text: 'A hundred players enter a knockout tennis tournament. Every match has a winner and a loser, and the loser is out for good. (When the numbers do not work out, some players get a free pass to the next round.)\n\nHow many matches must be played in all to find the champion?',
      hints: ['Do not count matches round by round. Count the players who have to lose.', 'Every match knocks out exactly one player.'],
      explain: 'Only one player is left at the end, so 99 have been knocked out. Each match knocks out exactly one, so there are **99** matches, however the draw is arranged. The round-by-round count (50 + 25 + 13 …) gets to the same place, more slowly.',
      data: { answer: { num: 99 }, traps: [{ match: 50, msg: 'That is only the first round.' }, { match: 100, msg: 'One match per player? Then everybody would be knocked out, champion included.' }], glyph: '🎾' },
      concepts: ['invariant'], links: ['bt-chocolate-bar']
    },
    {
      id: 'bt-chocolate-bar', title: 'The Chocolate Bar', diff: 2,
      text: 'A bar of chocolate has 5 × 8 = **40 squares**. Every break snaps *one piece* along one of its grooves into two pieces (you may not stack pieces and snap them together).\n\nWhat is the **fewest** number of breaks that separates all 40 squares?',
      hints: ['How many pieces are there before the first break, and after each break?', 'A break turns one piece into two, so it adds exactly one piece.'],
      explain: 'You begin with 1 piece and need 40. Every break adds exactly one piece, so it takes **39** breaks, and there is no cleverer way, whatever order you use. It is the same idea as the knockout tournament: count what changes by one each time.',
      data: { answer: { num: 39 }, traps: [{ match: 11, msg: 'That would be right if one snap could cut all the pieces at once. It cannot.' }, { match: 40, msg: 'The last break makes two pieces at once, so one fewer.' }], glyph: '🍫' },
      concepts: ['invariant'], links: ['bt-tournament']
    },
    {
      id: 'bt-widgets', title: 'Machines and Widgets', diff: 2,
      source: REF.crt,
      text: 'It takes **5 machines 5 minutes** to make **5 widgets**.\n\nHow many minutes would it take **100 machines** to make **100 widgets**?',
      hints: ['How long does one machine take to make a single widget?', 'If one machine makes a widget in 5 minutes, a hundred machines each make a widget at the same time.'],
      explain: 'Each machine makes one widget in 5 minutes. A hundred machines working side by side make a hundred widgets in the same **5 minutes**. The rate per machine never changed; only the tempting pattern “5, 5, 5 … 100, 100, 100” did.',
      data: { answer: { num: 5, unit: 'minutes' }, traps: [{ match: 100, msg: 'That is the pattern talking. Work out what *one* machine does in 5 minutes.' }], glyph: '⚙' },
      concepts: ['rates'], links: ['bt-bat-ball']
    },
    {
      id: 'bt-average-speed', title: 'Out and Back', diff: 2,
      text: 'A delivery van drives from town to the harbour at **30 km/h** through the morning traffic, and comes back by the same road at **60 km/h**.\n\nWhat is its **average speed** for the whole round trip, in km/h?',
      hints: ['Average speed is total distance divided by total time, not the average of the speeds.', 'Pick a distance, say 60 km each way, and count the hours out and back.'],
      explain: 'Take 60 km each way: out takes 2 hours, back takes 1 hour, so 120 km in 3 hours, **40 km/h**. The van spends longer at the slow speed, so the slow speed counts for more than the fast one. (This kind of average is called the harmonic mean.)',
      data: { answer: { num: 40, unit: 'km/h' }, traps: [{ match: 45, msg: 'That is the plain average of 30 and 60, but the van spends twice as long at 30.' }], glyph: '🚚' },
      concepts: ['rates'], links: ['bt-widgets', 'bt-clock-hands']
    },
    {
      id: 'bt-missing-dollar', title: 'The Missing Dollar', diff: 2,
      source: 'A traditional puzzle.',
      text: 'Three friends take a hotel room and each pays **$10**: $30 in all. Later the clerk sees that the room costs only **$25** and sends the bellboy up with $5 in change. The bellboy, who is not honest, keeps **$2** and gives each friend **$1** back.\n\nNow each friend has paid $9, so together they have paid 3 × 9 = **$27**. The bellboy holds another **$2**. That makes $29. Where has the other dollar gone?',
      hints: ['Add up where the $27 actually went.', 'Is it sensible to *add* the bellboy’s $2 to the $27?'],
      explain: 'Nothing has gone missing: the sum is simply the wrong sum. The $27 the friends paid is made of the **$25** for the room and the **$2** the bellboy kept. Adding the $2 to the $27 counts it twice. The honest sum runs the other way: $25 (room) + $2 (bellboy) + $3 (given back) = $30.',
      data: mc('Nothing is missing: the $27 already includes the bellboy’s $2, so adding it again is the mistake', [['The bellboy really kept $3, not $2, and the missing dollar is the one he did not confess to', 'He keeps $2 and gives back $3: that is exactly the $5 of change.'], ['The clerk made a second mistake: the room cost $24 and not $25, and the dollar went into the till', 'The room costs $25, and everything adds up perfectly at that price.'], ['The dollar is in the hotel’s safe: the hotel kept $25 and the friends must each have paid a little extra', 'Nobody paid extra: each friend paid $9 in the end.']], { glyph: '$?' }),
      concepts: ['lateral', 'paradox'], links: ['bt-bat-ball']
    },
    {
      id: 'bt-ten-statements', title: 'Ten Statements', diff: 2,
      text: 'On a sign there are ten statements:\n\n**1.** Exactly **one** of these ten statements is false.<br>**2.** Exactly **two** of these ten statements are false.<br>**3.** Exactly **three** of these ten statements are false.<br>… and so on, up to …<br>**10.** Exactly **ten** of these ten statements are false.\n\nWhich statement is the true one?',
      hints: ['Two different statements cannot both be true, because they give different numbers of false ones.', 'So at most one statement is true. Then how many are false?'],
      explain: 'The statements contradict one another, so at most one of them is true. If none were true, all ten would be false, and then statement 10 would be true, a contradiction. So exactly **one** is true and nine are false; the only statement that says “exactly nine are false” is number **9**.',
      data: { answer: { num: 9 }, ask: 'The number of the true statement.', traps: [{ match: 1, msg: 'If statement 1 were true, then exactly one statement would be false, but all the others contradict each other.' }, { match: 10, msg: 'If all ten were false, statement 10 would be true, so it cannot be false. Try again.' }], glyph: '9' },
      concepts: ['deduction', 'paradox']
    },
    {
      id: 'bt-three-logicians', title: 'Three Logicians in a Café', diff: 2,
      source: 'A well-known piece of logicians’ folklore.',
      text: 'Three logicians walk into a café and sit at a table. The waiter asks: “Would you *all* like a coffee?”\n\nThe first logician says, “I don’t know.”\n\nThe second logician says, “I don’t know.”\n\nThe third says, “Yes!”\n\nHow many of the three wanted a coffee?',
      hints: ['If the first logician did not want a coffee, could he have said “I don’t know”?', 'Each “I don’t know” says something about the speaker’s own wish.'],
      explain: 'The first logician can answer “I don’t know” only if he wants a coffee: if he did not, he would know that *not all* want one and say “No”. So he wants one, but does not know about the others. The same goes for the second. The third, who knows that the other two want coffee, can say “Yes”, and so the answer is **all three**.',
      data: { answer: { num: 3 }, traps: [{ match: 1, msg: 'The first two said “I don’t know”, not “No”. Think about why they did not say “No”.' }], glyph: '☕' },
      concepts: ['deduction', 'common-knowledge'], links: ['bt-muddy-3']
    },
    {
      id: 'bt-candle-stubs', title: 'The Thrifty Candle-Maker', diff: 2,
      source: 'A traditional puzzle.',
      text: 'A candle burns for exactly **one hour**. A thrifty man saves the stubs and melts **four stubs into one new candle**, which also burns for an hour and leaves one stub.\n\nHe starts with **16 new candles**. For how many hours in all can he have light?',
      hints: ['Burn all 16 first, and see how many new candles the stubs make.', 'Keep going until you have fewer than four stubs.'],
      explain: 'Sixteen candles burn for 16 hours and leave 16 stubs. Those make 4 new candles: 4 more hours and 4 stubs. Those make one more candle: another hour, and one stub is left over, too few for a new candle. In all 16 + 4 + 1 = **21 hours**.',
      data: { answer: { num: 21, unit: 'hours' }, traps: [{ match: 16, msg: 'That is only the first batch. What about the stubs?' }, { match: 20, msg: 'Nearly. The four stubs of the second batch make one more candle.' }], glyph: '🕯' },
      concepts: ['recursion'], links: ['bt-candles-two']
    },
    {
      id: 'bt-twenty-questions', title: 'Twenty Questions, But Fewer', diff: 2,
      text: 'A friend thinks of a whole number from **1 to 1000**. You may ask any yes-or-no questions, one at a time, and your friend always answers truthfully.\n\nWhat is the **smallest number of questions** that guarantees you find the number?',
      hints: ['Ask a question that cuts the possible numbers in half.', 'After each question, how many numbers can be left, at most? 1000, 500, 250 …'],
      explain: 'Ask “Is it more than 500?”, then halve what is left each time: 1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1. That is **10** questions. It cannot be done in 9, because nine yes-or-no answers give only 2⁹ = 512 different patterns, and there are 1000 numbers.',
      data: { answer: { num: 10 }, traps: [{ match: 9, msg: 'Nine questions have only 2⁹ = 512 possible answer patterns, fewer than 1000 numbers.' }, { match: 20, msg: 'That is the name of the party game, but you can be smarter about it.' }], glyph: '10?' },
      concepts: ['binary', 'information'], links: ['bt-wine-8', 'bt-wine-1000']
    },
    {
      id: 'bt-wine-8', title: 'The Poisoned Wine: Eight Bottles', diff: 2,
      text: 'A wicked king has **8 bottles** of wine, and **exactly one** is poisoned. A drop of the poison kills whoever drinks it **in exactly one hour**. The feast begins in an hour and a quarter, so there is only time for one round of tasting, all at once at the same moment.\n\nWhat is the **smallest number of tasters** who can be certain to find the poisoned bottle?',
      hints: ['Each taster may drink a mixture from several bottles. Each taster gives one yes-or-no answer: dies, or lives.', 'How many different patterns of dead and alive can 3 tasters show?'],
      explain: 'Three tasters can show 2 × 2 × 2 = 8 patterns of dead and alive, exactly enough. Number the bottles 0 to 7 in binary. Taster 1 drinks from the bottles whose first binary digit is 1, taster 2 from those whose second digit is 1, taster 3 from those whose third digit is 1. The pattern of who dies is the poisoned bottle’s number in binary. So **3** tasters suffice, and two cannot (only 4 patterns).',
      data: { answer: { num: 3 }, traps: [{ match: 8, msg: 'One taster per bottle works, but there is a far cheaper way: tasters can drink from many bottles each.' }, { match: 2, msg: 'Two tasters can show only 4 patterns (both die, one, the other, neither). That is not enough for 8 bottles.' }], glyph: '🍷' },
      concepts: ['binary', 'information'], links: ['bt-wine-1000', 'bt-wine-two-rounds']
    },
    {
      id: 'bt-five-hats', title: 'Five Hats, Three Men', diff: 2,
      text: 'Three men stand in a line, all facing the same way, so that each can see the hats of the men in front of him but not his own, or anyone behind. The last man sees two hats, the middle man sees one, and the first man sees none.\n\nThey are told that the five hats in a bag are **three white and two black**, that each man is wearing one of them, and that the first to say what colour his own hat is will be freed, but only if he is right.\n\nThe last man says: “I cannot tell.” Then the middle man says: “I cannot tell either.”\n\nWhat colour is the **first** man’s hat, the one who sees nothing?',
      hints: ['What would the last man have known if both hats in front of him were black?', 'From the last man’s silence, what does the middle man learn about the first man’s hat?'],
      explain: 'There are only two black hats. If the two hats in front of the last man were both black, he would know his own was white. So they are **not both black**. Now the middle man, who can see the first man’s hat, knows this. If the first man’s hat were black, the middle man would know that his own must be white. He said he could not tell, so the first man’s hat is **white**.',
      data: mc('White', [['Black', 'If it were black, the middle man would have known that his own hat is white, and would not have said “I cannot tell”.'], ['It cannot be known', 'It can, though only by thinking about why the other two could not answer.']], { figure: F.fiveHats, glyph: '🎩' }),
      concepts: ['deduction', 'common-knowledge'], links: ['bt-four-hats-wall', 'bt-hat-line-10']
    },

    {
      id: 'bt-snail-well', title: 'The Snail in the Well', diff: 2,
      source: 'A traditional puzzle.',
      text: 'A snail is at the bottom of a well **10 metres deep**. Every day it climbs **3 metres**, and every night, while it rests, it slips back **2 metres**.\n\nOn which day does the snail first reach the top of the well?',
      hints: ['How far ahead is the snail after one whole day and night?', 'On the last day, does the snail have to go through a night before it is at the top?'],
      explain: 'A whole day and night gains only 1 metre, so after 7 days and nights the snail is 7 metres up. On the **8th day** it climbs 3 more metres and reaches the top at 10 metres, in daylight, before it has any chance to slip back. The tempting answer, 10 days, forgets that the last climb has no night after it.',
      data: { answer: { num: 8 }, ask: 'Which day?', traps: [{ match: 10, msg: 'One metre gained per day and night is right for most of the way, but on the last day the snail is at the top before night falls.' }, { match: 7, msg: 'After 7 days and nights it is 7 metres up: 3 metres short. It has not arrived yet.' }], figure: F.well, glyph: '🐌' },
      concepts: ['sequence'], links: ['bt-fenceposts']
    },
    /* ============================ FAIR ============================ */
    {
      id: 'bt-zeros-100', title: 'Zeros at the End of 100!', diff: 3,
      text: 'Multiply all the whole numbers from 1 to 100: 1 × 2 × 3 × … × 100. The answer, called **100 factorial**, is enormous: it has 158 digits.\n\nHow many **zeros** does it end with?',
      hints: ['A zero at the end of a number comes from a factor of 10 = 2 × 5. In 1 × 2 × … × 100 there are many more factors of 2 than of 5, so count the fives.', 'Every multiple of 5 brings a five, but some multiples, like 25, bring two.'],
      explain: 'Each trailing zero needs a factor 10 = 2 × 5, and there are plenty of twos, so the fives set the count. Up to 100 there are 20 multiples of 5, each with one five; and the 4 multiples of 25 (25, 50, 75, 100) each hide a *second* five. That is 20 + 4 = **24** fives, so 100! ends in 24 zeros. (No number up to 100 is a multiple of 125.)',
      data: { answer: { num: 24 }, traps: [{ match: 20, msg: 'That counts one five for each multiple of 5. But 25, 50, 75 and 100 each contain two fives.' }, { match: 10, msg: 'That is just the number of multiples of 10. Every multiple of 5 helps, in company with a two.' }], glyph: '100!' },
      concepts: ['combinatorics'], links: ['bt-lockers-360']
    },
    {
      id: 'bt-blind-coins', title: 'Coins in the Dark', diff: 3,
      source: 'A well-known puzzle, often told with cards and a blindfold.',
      text: 'On a table in a pitch-dark room lie **20 coins**. You are told that exactly **7 of them are heads up** and the other 13 are tails up. You cannot see the coins, and you cannot feel which side is up, but you can move them about and turn any of them over.\n\nHow can you split them into **two piles with the same number of heads** in each?',
      hints: ['You cannot tell heads from tails, so the method must work whatever coins you happen to pick.', 'Suppose you take 7 coins and call them the small pile. If the small pile holds *h* heads, how many heads are left in the big pile? What happens to the small pile if you turn every coin over?'],
      explain: 'Take any **7** coins as a small pile, leave the other 13 as the big pile, and turn over every coin in the small pile. If the small pile happened to contain *h* heads, the big pile contains 7 − *h* heads. Turning the small pile over turns its *h* heads into tails and its 7 − *h* tails into heads: it now has exactly 7 − *h* heads, the same as the big pile. It works whatever *h* was, and you never had to know it.',
      data: mc('Take any 7 coins as one pile, leave the other 13 as the second pile, and turn over every coin in the pile of 7', [['Take any 7 coins as one pile, leave the other 13 as the second pile, and turn over every coin in the pile of 13', 'If the pile of 7 holds h heads, the pile of 13 holds 7 − h. Turning the big pile over gives it 6 + h heads, and that is not h.'], ['Split the coins into two equal piles of 10 and turn over every coin in one of the two piles', 'If the first pile holds h heads, the other holds 7 − h. After turning one pile the counts are 10 − h and 7 − h, which are never equal.'], ['It cannot be done in the dark, because you have no way to find out how many heads are in either pile', 'It can. You do not need to see them: you only need to know how many there are in all.']], { glyph: '🪙' }),
      concepts: ['symmetry', 'invariant'], links: ['bt-hilbert-one']
    },
    {
      id: 'bt-combination', title: 'The Failed Attempts', diff: 3,
      source: 'A code-breaking puzzle of the “Mastermind” kind; the clues here are our own.',
      text: 'The code of a small safe is a **three-digit number whose three digits are all different**. Someone tried some numbers, and the safe answered each attempt with a **✓** for every digit that is right and in the right place, and a **~** for every digit that is right but in the wrong place. A wrong digit gets no mark at all.\n\n**3 6 2** — no marks at all<br>**9 4 2** — ✓ ~<br>**9 6 3** — ~<br>**0 2 8** — ~\n\nWhat is the code?',
      hints: ['The first attempt tells you three digits that are certainly not in the code. Cross them out.', 'In 9 4 2 the digit 2 is out, so the two marks belong to 9 and 4: both are in the code, and one of them is in the right place.', 'In 9 6 3 the 9 is marked ~: it is in the code, but not in first place. Which of the two, 9 or 4, is therefore in the right place in 9 4 2?'],
      explain: 'From 3 6 2 the digits 3, 6 and 2 are out. In 9 4 2 the 2 is out, so the marks ✓ and ~ belong to **9** and **4**: both are in the code, one in place and one not. In 9 6 3 the 9 gets a ~ (the 6 and the 3 are out), so 9 is in the code but is not first. Look at 9 4 2 again: its 9 stands in first place and is not in the right place, so the ✓ must belong to the **4**: the code is ? 4 ?. The 9 is not first, so it is last: ? 4 9. Finally 0 2 8 has one ~. The 2 is out, so the marked digit is 0 or 8, and it is in the code but in the wrong place. Only the first place is free, and the 0 *stands* in first place in 0 2 8, so it would have earned a ✓, not a ~. So the missing digit is **8**, which is third in 0 2 8 but belongs first. The code is **849**.',
      data: { answer: { num: 849 }, ask: 'The three digits.', glyph: '🔐' },
      concepts: ['deduction'], links: ['bt-ages-36']
    },
    {
      id: 'bt-clock-hands', title: 'When the Hands Meet', diff: 3,
      text: 'At midnight the hour hand and the minute hand of a clock lie exactly on top of one another.\n\nCounting from that midnight up to (but not including) the next midnight, how many times in a **whole day and night** do the two hands overlap exactly?',
      hints: ['Between 12:00 and the next 12:00 the minute hand goes round 12 times and the hour hand once. How often does the fast hand pass the slow one?', 'The minute hand laps the hour hand once for every full turn it gains. Count the laps in 12 hours, then double.'],
      explain: 'In 12 hours the minute hand makes 12 turns and the hour hand 1, so it gains **11** turns and overtakes the hour hand 11 times: at 12:00, then about 1:05, 2:11, 3:16 and so on, up to 10:54, and the next overlap is 12:00 again. That is 11 in 12 hours and **22** in a whole day, not 24, because there is no overlap “at eleven o’clock”; it happens at 12:00 instead.',
      data: { answer: { num: 22 }, traps: [{ match: 24, msg: 'One meeting an hour feels right, but the hands meet slightly less often than that: the overlap after 10 o’clock is at 12:00, not at 11:00.' }, { match: 23, msg: 'Close, but do not count the midnight that ends the day as well as the one that begins it.' }], figure: F.clock, glyph: '🕛' },
      concepts: ['rates', 'modular'], links: ['bt-average-speed']
    },
    {
      id: 'bt-ages-36', title: 'The Census-Taker', diff: 3,
      source: 'A classic puzzle of number and logic, passed round by word of mouth.',
      text: 'A census-taker knocks at a door. A woman says she has three children. “The **product** of their ages is **36**,” she tells him, “and the **sum** of their ages is the **number on this house**.”\n\nThe census-taker looks at the number on the door and thinks. “I still can’t tell,” he says.\n\n“Oh, I’m sorry,” says the woman, “my **eldest** is asleep upstairs.” The man thanks her and writes down the three ages.\n\nWhat are the children’s ages (whole numbers of years)?',
      hints: ['List every way three whole numbers can multiply to 36 (1·1·36, 1·2·18 …) and add up each triple.', 'The census-taker knows the house number and *still* cannot tell: so the house number is a sum that two different triples share.', 'Which of the two triples has an eldest child?'],
      explain: 'The triples with product 36 and their sums are: 1,1,36 (38); 1,2,18 (21); 1,3,12 (16); 1,4,9 (14); 1,6,6 (13); 2,2,9 (13); 2,3,6 (11); 3,3,4 (10). Only the sum 13 appears twice, so that is the house number and the man could not decide between **1, 6, 6** and **2, 2, 9**. “The eldest” shows there is one oldest child, which rules out the twins of 6: the ages are **2, 2, 9**.',
      data: { answer: { nums: [2, 2, 9] }, ask: 'The three ages, separated by commas.', traps: [{ match: ['1, 6, 6', '1 6 6', '6, 6, 1', '6 6 1', '6, 1, 6'], msg: 'That is the other triple with the same sum. But it has twins as the eldest, and the woman spoke of “the eldest”.' }], glyph: '36' },
      concepts: ['deduction', 'diophantine'], links: ['bt-ages-72']
    },
    {
      id: 'bt-ages-72', title: 'The Census-Taker Returns', diff: 3,
      source: 'A variant of the classic census-taker puzzle.',
      text: 'The census-taker knocks at another door. “I have three children,” says the man who answers. “The **product** of their ages is **72**, and the **sum** is the **number on my door**.”\n\n“I still can’t tell,” says the census-taker, after looking at the door.\n\n“Wait,” says the man, “my **youngest** is the only one with red hair.” The census-taker writes down the ages.\n\nWhat are the three ages (whole numbers of years)?',
      hints: ['List the triples with product 72 and their sums. Which sum occurs twice?', 'Now “my youngest” is a single child. Which of the two triples has a single youngest?'],
      explain: 'The triples with product 72 have the sums 74, 39, 28, 23, 19, 18, 22, 17, 15, 14 (2,6,6), 14 (3,3,8) and 13. Only 14 repeats, so the choice is between **2, 6, 6** and **3, 3, 8**. “The youngest” is a single child, and 3, 3, 8 has twin youngest, so the ages are **2, 6, 6**. (Last time it was the eldest that broke the tie; this time it is the youngest.)',
      data: { answer: { nums: [2, 6, 6] }, ask: 'The three ages, separated by commas.', traps: [{ match: ['3, 3, 8', '3 3 8', '8, 3, 3', '8 3 3', '3, 8, 3'], msg: 'That is the other triple with the same sum. But it has twin youngest children, and the man spoke of “my youngest”.' }], glyph: '72' },
      concepts: ['deduction', 'diophantine'], links: ['bt-ages-36']
    },
    {
      id: 'bt-mary-ann', title: 'Mary and Ann', diff: 3,
      source: 'A traditional age puzzle.',
      text: 'Mary is **24** years old. She is **twice as old as Ann was when Mary was as old as Ann is now**.\n\nHow old is Ann?',
      hints: ['The difference between their ages never changes. Call it *d*, so Ann is 24 − *d* now.', 'Go back *d* years, to when Mary was as old as Ann is now. How old was Ann then?'],
      explain: 'Let Ann be *A* now and the age gap *d* = 24 − *A*. *d* years ago Mary was 24 − *d* = *A*, and Ann was *A* − *d* = 2*A* − 24. Mary’s present age is twice that: 24 = 2 (2*A* − 24), so 4*A* = 72 and *A* = **18**. Check: the gap is 6; six years ago Mary was 18 (Ann’s age now) and Ann was 12; and 24 = 2 × 12.',
      data: { answer: { num: 18 }, traps: [{ match: 12, msg: 'That is how old Ann *was* at the time in the story, not how old she is now.' }, { match: 16, msg: 'Try checking your guess: go back until Mary was as old as your Ann is now, and see if Mary’s 24 is twice Ann’s age then.' }], glyph: '👭' },
      concepts: ['diophantine', 'deduction']
    },
    {
      id: 'bt-candles-two', title: 'Two Candles', diff: 3,
      source: 'A traditional puzzle.',
      text: 'Two candles of the same length are lit at the same moment. One would burn out in **4 hours** and the other in **5 hours**; each burns steadily.\n\nSome time later, one candle stub is exactly **four times as long** as the other. How long have the candles been burning, in **minutes**?',
      hints: ['After *t* hours the first candle has 1 − *t*/4 of its length left and the second has 1 − *t*/5.', 'The slower candle is the longer one. Solve 1 − *t*/5 = 4 × (1 − *t*/4).'],
      explain: 'After *t* hours the candles have 1 − *t*/4 and 1 − *t*/5 of their length left. The five-hour candle is the longer, so 1 − *t*/5 = 4(1 − *t*/4), giving *t* = 15/4 hours: **3 hours 45 minutes**, or 225 minutes. Then the shorter has 1/16 left and the longer 1/4, exactly four times as much.',
      data: { answer: { num: 225, unit: 'minutes' }, ask: 'In minutes.', traps: [{ match: 3.75, msg: 'That is the right time in hours. The answer is wanted in minutes.' }], figure: F.candles, glyph: '🕯' },
      concepts: ['rates'], links: ['bt-candle-stubs']
    },
    {
      id: 'bt-lockers-360', title: 'Who Touched Locker 360?', diff: 3,
      text: 'A long corridor has closed lockers numbered 1, 2, 3 …, and a long line of students goes down it. **Student 1** touches every locker, **student 2** every second locker (2, 4, 6 …), **student 3** every third, and so on: student *k* touches lockers *k*, 2*k*, 3*k* …\n\nHow many students touch **locker 360**?',
      hints: ['Student *k* touches locker 360 exactly when *k* divides 360.', 'Count the divisors of 360. Write 360 = 2³ × 3² × 5 and think about how a divisor is built.'],
      explain: 'A student touches locker 360 exactly when their number divides 360. With 360 = 2³ × 3² × 5, a divisor takes 0 to 3 twos, 0 to 2 threes and 0 or 1 five: 4 × 3 × 2 = **24** divisors. Divisors nearly always come in pairs (*d* and 360 ÷ *d*), which is why the counts are almost always even, and why the locker game has such a neat answer.',
      data: { answer: { num: 24 }, traps: [{ match: 12, msg: 'You have counted half of the divisors, one from each pair. Both 5 and 72 touch locker 360.' }], glyph: '360' },
      concepts: ['combinatorics'], links: ['bt-lockers-100', 'bt-lockers-1000']
    },
    {
      id: 'bt-lockers-100', title: 'The Hundred Lockers', diff: 3,
      source: 'A well-known school puzzle.',
      text: 'A hundred closed lockers stand in a row, numbered 1 to 100. A hundred students walk down the row. **Student 1** opens every locker. **Student 2** changes every second locker (opens it if it is closed and closes it if it is open). **Student 3** changes every third locker, and so on, up to **student 100**, who changes only locker 100.\n\nWhen all the students have gone by, how many lockers are **open**?',
      hints: ['A locker ends up open only if it has been changed an odd number of times.', 'Locker *n* is changed once for each divisor of *n*. When does a number have an odd number of divisors?'],
      explain: 'Locker *n* is changed once by each student whose number divides *n*, so it ends open exactly when *n* has an odd number of divisors. Divisors come in pairs (*d*, *n*/*d*) and a pair is only spoiled when *d* = *n*/*d*, that is, when *n* is a **perfect square**. The open lockers are 1, 4, 9, 16, …, 100: **ten** of them.',
      data: { answer: { num: 10 }, traps: [{ match: 50, msg: 'Half would be right if each locker had a 50–50 chance. Try locker 6: touched by students 1, 2, 3 and 6.' }], figure: F.lockers, glyph: '▦' },
      concepts: ['parity', 'combinatorics'], links: ['bt-lockers-360', 'bt-lockers-1000']
    },
    {
      id: 'bt-lockers-1000', title: 'A Thousand Lockers', diff: 3,
      text: 'The locker game is played again, this time with **1000** lockers and 1000 students. Student *k* changes every *k*th locker (opens it if closed, closes it if open), as before, and all lockers start closed.\n\nHow many lockers are **open** at the end?',
      hints: ['The open lockers are those with an odd number of divisors: the perfect squares.', 'How many perfect squares are there from 1 to 1000? Find the biggest whole number whose square is at most 1000.'],
      explain: 'The open lockers are the perfect squares up to 1000. Since 31² = 961 and 32² = 1024, the squares are 1², 2², …, 31²: **31** lockers, the last of them locker 961.',
      data: { answer: { num: 31 }, traps: [{ match: 32, msg: '32² is 1024, more than 1000.' }, { match: 30, msg: 'One short: 31² = 961 is still below 1000.' }], glyph: '31' },
      concepts: ['combinatorics'], links: ['bt-lockers-100', 'bt-lockers-360']
    },
    {
      id: 'bt-ants-rod', title: 'Ants on a Stick', diff: 3,
      source: 'A well-known puzzle of the “ghost” kind: the ants may as well pass through one another.',
      text: 'A number of ants stand on a one-metre stick, anywhere along it, each facing one end. At the same moment they all start walking at **1 cm per second**. When two ants meet head-on, each turns round at once and walks the other way. An ant that reaches an end of the stick falls off.\n\nWhat is the **longest time**, in seconds, that it can possibly take for every ant to fall off, whatever the number and starting places of the ants?',
      hints: ['What would change if, instead of turning round, two ants who meet just walked *through* each other like ghosts?', 'Watch the ants as a crowd: at every moment the crowd looks the same either way. Which ghost takes longest?'],
      explain: 'When two ants meet and turn back, that looks exactly like two ghost ants walking through each other and swapping names. Ghosts never bounce, so each one just walks in a straight line to the end and falls off. The slowest possible ghost starts right at one end and walks the whole metre: **100 seconds**. The crowd is off the stick when the last ghost is.',
      data: { answer: { num: 100, unit: 'seconds' }, traps: [{ match: 50, msg: 'That is the time for a single ant standing in the middle. A lone ant at one end is slower.' }], figure: F.antsRod, glyph: '🐜' },
      concepts: ['symmetry', 'invariant'], links: ['bt-ants-triangle']
    },
    {
      id: 'bt-ants-triangle', title: 'Ants on a Triangle', diff: 3,
      text: 'Three ants sit on the three corners of a triangle. Each ant picks one of the two edges at its corner at random and walks along it to the next corner. The ants all walk at the same speed and start together. If two ants meet, they collide.\n\nWhat is the chance that **no two ants collide**?',
      hints: ['Each ant has two choices, so there are 2 × 2 × 2 = 8 equally likely ways to choose.', 'When can two ants avoid meeting? Try the case where all go the same way round.'],
      explain: 'There are 8 equally likely choices. If two ants go along the same edge, in opposite directions, they collide; if two go to the same corner along different edges, they meet there. The only ways for nobody to collide are all three going clockwise or all three going anticlockwise: 2 out of 8, that is **1 in 4**.',
      data: { answer: { num: 0.25, show: '1/4' }, ask: 'A fraction or a decimal.', traps: [{ match: 0.5, msg: 'Just a coin toss? There are eight equally likely sets of choices; count the ones with no collision.' }], figure: F.antsTriangle, glyph: '△' },
      concepts: ['probability', 'combinatorics'], links: ['bt-ants-rod']
    },
    {
      id: 'bt-gold-chain', title: 'The Gold Chain', diff: 3,
      source: 'A traditional puzzle.',
      text: 'A traveller has to stay at an inn for **seven nights** and has no money except a **gold chain of seven links**. The innkeeper wants **one link for each night**, paid every morning, so after the third morning he must be holding three links’ worth, and so on. He is happy to hand back change: he will return a piece of chain he holds in exchange for another. A jeweller can open a link (which splits the chain), but every link opened costs the traveller money.\n\nWhat is the **fewest number of links** the traveller has to open?',
      hints: ['You do not have to give links one by one. Pieces of chain of different sizes can be swapped for one another.', 'Which sizes of piece would let you pay 1, then 2, then 3 links, and so on up to 7?'],
      explain: 'Cut just **one** link, the third from an end. That leaves three pieces of 1, 2 and 4 links (the cut link itself, and the two pieces on either side of it). Morning 1: pay the single link. Morning 2: pay the piece of 2 and take the single link back. Morning 3: pay the single link again (the innkeeper holds 2 + 1). Morning 4: pay the piece of 4 and take back the 2 and the 1. And so on. Every number of links from 1 to 7 can be made from pieces of 1, 2 and 4: binary numbers again.',
      data: { answer: { num: 1 }, traps: [{ match: 6, msg: 'Cutting every link but one works, but is very wasteful.' }, { match: 2, msg: 'One cut is enough, if you choose the link well.' }], figure: F.goldChain, glyph: '⛓' },
      concepts: ['binary', 'lateral'], links: ['bt-wine-8']
    },
    {
      id: 'bt-lion-unicorn', title: 'The Lion and the Unicorn', diff: 3,
      source: 'The Lion and the Unicorn are from Lewis Carroll’s *Through the Looking-Glass* (1871); their days of lying are in the style of Raymond Smullyan’s Alice puzzles.',
      text: 'In the forest where the Lion and the Unicorn live, the **Lion lies on Monday, Tuesday and Wednesday** and tells the truth on all the other days. The **Unicorn lies on Thursday, Friday and Saturday** and tells the truth on all the other days.\n\nOne day both of them say to Alice: “Yesterday was one of my lying days.”\n\nWhat day of the week is it?',
      hints: ['For each day of the week, decide whether the Lion could truthfully or falsely say that sentence. Then do the same for the Unicorn.', 'On a lying day the sentence must be false; on a truthful day it must be true.'],
      explain: 'The Lion can say it on **Monday** (it is a lying day, and yesterday, Sunday, was truthful, so the sentence is false) and on **Thursday** (a truthful day, and Wednesday was a lying day). The Unicorn can say it on **Thursday** (a lying day, and Wednesday was honest, so the sentence is false) and on **Sunday**. The only day that suits both is **Thursday**.',
      data: { answer: { text: ['thursday', 'thu', 'on thursday'], exact: true }, ask: 'A day of the week.', traps: [{ match: ['monday', 'mon'], msg: 'The Lion could say it on a Monday, but what about the Unicorn?' }, { match: ['sunday', 'sun'], msg: 'The Unicorn could say it on a Sunday, but what about the Lion?' }], glyph: '🦁' },
      concepts: ['truth-logic', 'deduction']
    },
    {
      id: 'bt-four-hats-wall', title: 'Four Prisoners and a Wall', diff: 3,
      source: 'A classic hat puzzle, in many versions.',
      text: 'Four prisoners are given hats from a box that holds **two white and two black** hats, and each is wearing one. **A**, **B** and **C** stand in a line facing a high wall: C sees the hats of B and A, B sees only A’s hat, and A sees only the wall. **D** stands alone on the other side of the wall and sees nobody.\n\nThe jailer says: “The first who calls out the colour of his own hat, correctly, will go free. Anyone who guesses wrong is executed. Nobody may speak unless he is certain.”\n\nAfter a whole minute of silence, one prisoner speaks, and he is right. **Who is it?**',
      hints: ['When could C be certain? What must A’s and B’s hats look like, for C to know his own colour at once?', 'C stayed silent. What does that tell B about A’s hat and about his own?'],
      explain: 'There are only two hats of each colour. If A and B wore the *same* colour, C would see both of them and know that his own hat is the *other* colour, and he would call it out at once. C is silent, so A and B wear **different** hats. B sees A’s hat, so he knows his own is the opposite: **B** speaks. (A cannot know, seeing only a wall, and D sees nobody.)',
      data: mc('B, the middle prisoner', [['A, who faces the wall', 'A sees nothing at all, and could work it out only after B had spoken.'], ['C, who sees two hats', 'C stays silent: he cannot tell. His silence is the clue that helps B.'], ['D, behind the wall', 'D sees no one, and hears only silence, which tells him nothing about his own hat.']], { order: ['A, who','B, the','C, who','D, behind'], figure: F.fourHats, glyph: 'A B C' }),
      concepts: ['deduction', 'common-knowledge'], links: ['bt-five-hats', 'bt-hat-line-10']
    },
    {
      id: 'bt-wine-1000', title: 'The Poisoned Wine: A Thousand Bottles', diff: 3,
      source: 'A well-known puzzle, told in many ways.',
      text: 'A wicked king has **1000 bottles** of wine, and **exactly one** is poisoned. A single drop of the poison kills whoever drinks it in **exactly one day**. The feast begins in 24 hours, so there is time for **one round** of tasting, with everybody drinking at the same moment. Each taster may drink a mixture with a few drops from as many bottles as you like.\n\nWhat is the **fewest number of tasters** who can be certain to find the poisoned bottle?',
      hints: ['Each taster gives one bit of information: dead or alive. How many different patterns can *n* tasters show?', 'You need at least 1000 different patterns. Which power of two is the first one above 1000?'],
      explain: 'Number the bottles 0 to 999 in binary; ten binary digits are enough, since 2¹⁰ = 1024 ≥ 1000. Taster *k* drinks from every bottle whose *k*th binary digit is 1. Whoever dies tomorrow tells you the digits of the bottle’s number: **ten** tasters. Nine could show only 2⁹ = 512 patterns, too few.',
      data: { answer: { num: 10 }, traps: [{ match: 9, msg: 'Nine tasters can show only 2⁹ = 512 patterns of dead and alive: not enough for 1000 bottles.' }, { match: 1000, msg: 'One taster per bottle would do, but one taster can taste many bottles at once.' }, { match: 999, msg: 'Testing 999 bottles one taster each would be enough, but tasters can share bottles, and then far fewer will do.' }], glyph: '🍾' },
      concepts: ['binary', 'information'], links: ['bt-wine-8', 'bt-wine-two-rounds']
    },
    {
      id: 'bt-eggs-36', title: 'Two Eggs, Thirty-Six Floors', diff: 3,
      source: 'A popular puzzle and interview question, known in many forms.',
      text: 'A building has **36 floors**. An egg dropped from a low floor survives; dropped from a high enough floor it breaks. There is a highest safe floor (it might even be the ground, or the top). You have **two identical eggs**. An egg that survives a drop is as good as new; a broken egg is gone.\n\nWhat is the **smallest number of drops** that is guaranteed to find the highest safe floor, in the worst case?',
      hints: ['If you have only one egg you must go floor by floor. With two eggs you can take bigger steps first, and then go floor by floor with the second egg.', 'Try dropping the first egg from floors 8, 15, 21, 26 …: the steps get smaller by one each time so that the total number of drops is the same however it turns out.'],
      explain: 'Drop the first egg from floor 8. If it breaks, go floor by floor from 1 to 7 with the second egg: at most 8 drops in all. If it survives, the next drop is from floor 8 + 7 = 15, so that if it breaks you have 6 floors to check (again 8 drops in all), then 21, 26, 30, 33, 35, 36. Steps of 8, 7, 6, … 1 add up to 36, so **8** drops suffice, and 7 drops would cover only 7 + 6 + … + 1 = 28 floors.',
      data: { answer: { num: 8 }, traps: [{ match: 6, msg: 'Six drops are not enough for 36 floors, even with a great deal of luck; the plan must work in the worst case.' }, { match: 36, msg: 'Going floor by floor with one egg needs 36 drops, but you have two eggs.' }, { match: 18, msg: 'Splitting the building in half is the right idea when you have plenty of eggs. Here a broken egg is gone for good, and if the first one breaks the second must go floor by floor.' }], figure: F.building, glyph: '🥚' },
      concepts: ['sequence', 'working-backwards'], links: ['bt-eggs-100']
    },
    {
      id: 'bt-wason', title: 'The Four Cards', diff: 3,
      year: 1966,
      source: 'Peter Wason’s selection task (1966), one of the most famous experiments on how people reason.',
      text: 'Four cards lie on a table. Each card has a **letter** on one side and a **number** on the other. You can see one side of each:\n\n**E**  **K**  **4**  **7**\n\nHere is a rule: *“If a card has a vowel on one side, then it has an even number on the other side.”*\n\nWhich cards must you turn over, and *only* those, to find out whether the rule is broken?',
      hints: ['The rule is broken by a card that has a vowel on one side and an odd number on the other. Which of the four could be that card?', 'Ask about each card: could turning it show a vowel with an odd number? If it cannot, it does not need turning.'],
      explain: 'Turn **E**: if the other side is odd the rule is broken. Turn **7**: if the other side is a vowel the rule is broken. **K** is a consonant and the rule says nothing about consonants. **4** is even, and the rule does not say that only vowels sit on the back of an even number, so nothing behind it can break the rule. Most people turn E and 4; hardly anybody turns the 7.',
      data: { answer: { multi: [0, 3], choices: ['E', 'K', '4', '7'] }, ask: 'Tick all the cards you must turn.', figure: F.wason, glyph: 'E4' },
      concepts: ['deduction'], links: ['bt-ten-statements']
    },
    {
      id: 'bt-hilbert-one', title: 'The Grand Hotel', diff: 3,
      source: 'Hilbert’s Grand Hotel, after the mathematician David Hilbert, whose lecture on the infinite (1924) is its traditional source; popularised by George Gamow in *One Two Three … Infinity* (1947).',
      text: 'The Grand Hotel has **infinitely many rooms**, numbered 1, 2, 3, … without end. Tonight **every room is taken**. Then a new guest arrives and asks for a room.\n\n“We are full,” says the manager, “but you shall have a room.” How does the manager manage it, without putting two guests in one room and without throwing anyone out?',
      hints: ['There is no last room to put the newcomer in, so someone has to move.', 'What if every guest moves to the next room along?'],
      explain: 'The manager asks every guest to move to the next room: the guest in room 1 goes to room 2, the guest in room 2 to room 3, and in general room *n* moves to room *n* + 1. Every guest still has a room, and room 1 is now empty for the newcomer. With infinitely many rooms, a full hotel can always take one more. A finite hotel could never do this, since somebody would have to move into a room that is not there.',
      data: mc('Every guest moves one room along, from room n to room n + 1, and the newcomer takes room 1', [['The newcomer is given the very last room of the hotel, and every other guest stays exactly where he is', 'An infinite hotel has no last room.'], ['The newcomer is turned away politely, since a full hotel is full however many rooms it may have', 'A full hotel with infinitely many rooms behaves quite differently from a full hotel with finitely many rooms.'], ['The newcomer shares room 1 with the guest who is already in it, and everybody else stays put', 'The manager does not want two guests in one room.']], { figure: F.hotel, glyph: '∞' }),
      concepts: ['paradox'], links: ['bt-hilbert-bus']
    },
    {
      id: 'bt-hardest-logic-count', title: 'The Three Gods: How Few Questions?', diff: 3,
      source: 'George Boolos, “The Hardest Logic Puzzle Ever” (1996), after a puzzle of Raymond Smullyan.',
      text: 'Three gods, **A**, **B** and **C**, are called **True**, **False** and **Random**, in some order that you do not know. True always answers truthfully and False always lies. Random answers yes or no as he pleases. You must find out which god is which by putting yes-or-no questions, one at a time, each to any god you choose.\n\nHow to do it is the famous “hardest logic puzzle ever”. Here is an easier question: **how many yes-or-no questions, at the very least, are needed** just to tell apart the different ways the three gods could be arranged, even if every answer were honest?',
      hints: ['How many different orders can the three names True, False and Random be in?', 'How many different results can *n* yes-or-no answers give?'],
      explain: 'The three names can be arranged in 3 × 2 × 1 = 6 orders. Two yes-or-no questions give only 2 × 2 = 4 patterns of answers, too few; three give 8, enough. So at least **3** questions are needed, and Boolos showed that three are also enough for the puzzle with a lying god and a random one, though the questions must be very cleverly worded.',
      data: { answer: { num: 3 }, traps: [{ match: 2, msg: 'Two questions give only 4 different patterns of answers, but there are 6 possible arrangements.' }, { match: 6, msg: 'That is the number of arrangements, not the number of questions. Each question can split the arrangements in two.' }], glyph: '⚖' },
      concepts: ['information', 'truth-logic'], links: ['bt-twenty-questions']
    },
    {
      id: 'bt-pirates-3', title: 'Three Pirates and the Gold', diff: 3,
      source: 'A pirate puzzle, told in many forms since the 1990s.',
      text: 'Three pirates find **100 gold coins**. The most senior, **Captain Cal**, proposes how to share them out. All three pirates vote, the captain too, and if **at least half** of the votes are in favour, the proposal is carried out. Otherwise the captain is thrown overboard, the next most senior pirate (**Ben**) proposes a share-out, and so on, with the last pirate (**Ann**) getting it all if she is left alone.\n\nAll the pirates are perfectly logical. Each wants, in this order, to stay alive, to get as much gold as possible, and (if all else is equal) to see the others thrown overboard: a pirate votes “yes” only if the plan gives him **strictly more** gold than he would otherwise get.\n\nHow many coins does Captain Cal keep?',
      hints: ['Start from the end. If Cal is thrown overboard, what would Ben propose to Ann, and how many votes does he need?', 'Ben would keep all 100 coins (his own vote is half the votes). So what would Ann get if Cal fails? What is the cheapest way for Cal to win her vote?'],
      explain: 'Work backwards. If only Ben and Ann were left, Ben would keep all 100 coins: his own vote is half of the two votes, enough. So Ann gets nothing if Cal is thrown overboard, and she would vote for any plan that gives her a coin. Cal needs two votes out of three, so he offers Ann **1 coin**, gives Ben none, and keeps **99**.',
      data: { answer: { num: 99 }, traps: [{ match: 100, msg: 'Cal needs at least one other vote. Who is the cheapest to buy?' }, { match: 50, msg: 'Cal does not have to be fair: he only has to win two votes out of three, and one of them is his own.' }, { match: 34, msg: 'Cal does not have to be fair: he only has to win two votes out of three, and one of them is his own.' }], glyph: '🏴' },
      concepts: ['game-theory', 'induction', 'working-backwards'], links: ['bt-pirates-5', 'bt-pirates-10']
    },
    {
      id: 'bt-handshake-parity', title: 'The Handshake Party', diff: 3,
      text: 'At a party of **25 people**, everyone wants to shake hands with exactly **three** others, each pair shaking hands at most once.\n\nCan the party be organised so that everybody shakes exactly three hands?',
      hints: ['Count the handshakes from the point of view of each guest: each shakes 3 hands. How many hand-ends is that in all?', 'Every handshake has two ends, one for each of the two people. Can the number of ends be odd?'],
      explain: 'Count every guest’s handshakes: 25 × 3 = 75 hand-ends. But every handshake has exactly **two** ends, one at each person, so the number of ends must be even. 75 is odd, so the party is **impossible**; it would need 37½ handshakes. Whenever people shake an odd number of hands each, there must be an even number of them: an old and general fact about *parity*.',
      data: mc('No: it would need 25 × 3 ÷ 2 = 37½ handshakes', [['Yes: put them in groups of four, each group shaking hands all round', '25 cannot be split into groups of four.'], ['Yes: sit them round a table and let each shake hands with both neighbours and the person opposite', 'With 25 people at a round table nobody sits exactly opposite anybody.'], ['Yes, if the host arranges the groups cleverly, in any party of more than three people', 'Count the handshake-ends: 25 × 3 = 75. Is that a number that two people can share?']], { glyph: '🤝' }),
      concepts: ['parity', 'graph'], links: ['bt-party-six']
    },
    {
      id: 'bt-hat-line-10', title: 'A Line of Ten Prisoners', diff: 3,
      source: 'A classic hat puzzle, told in many versions since the late twentieth century.',
      text: 'Ten prisoners will stand in a line, one behind the other, all facing forward. The jailer puts a **black or white** hat on each head, as many of each as he likes. Each prisoner sees the hats of all those in front of him, but not his own or anyone’s behind him.\n\nStarting with the **last** prisoner, who can see nine hats, each in turn must call out one word, “black” or “white”, meant as a guess about his own hat. Everybody hears every call, but nobody is told whether it was right. Anybody who names his own colour correctly is set free.\n\nThey may agree on a plan beforehand. How many prisoners can be **sure** to be freed, whatever the hats are?',
      hints: ['The last prisoner sees nine hats; his call can tell the others something about them, and not only be a guess about himself.', 'What if the last prisoner calls out whether the number of black hats he can see is even or odd?'],
      explain: 'The last prisoner has no way to be sure about his own hat, so he uses his call to send a message: say “black” if he sees an *odd* number of black hats and “white” if *even*. The prisoner in front of him counts the hats he can see, compares with that message and works out his own hat exactly. So can the next, who hears all the calls so far and sees all the hats in front. All the others are certain of their hats: **9** are sure to be freed, and the last one has a fifty–fifty chance.',
      data: { answer: { num: 9 }, traps: [{ match: 10, msg: 'The last prisoner sees only the hats in front and knows nothing about his own: he can only be lucky.' }, { match: 5, msg: 'Half is what pure guessing gives. The prisoners can do much better by planning.' }], figure: F.hatLine, glyph: '⚫⚪' },
      concepts: ['parity', 'binary'], links: ['bt-hat-line-strategy', 'bt-hat-line-colours']
    },
    {
      id: 'bt-hat-line-strategy', title: 'The First Call', diff: 3,
      source: 'A classic hat puzzle, told in many versions since the late twentieth century.',
      text: 'Ten prisoners stand in a line, all facing forward, with a black or white hat on each. Each can see all the hats in front of him and none of the others. Starting from the back, each calls “black” or “white” aloud, and all hear every call. Everybody who names his own hat correctly goes free.\n\nThe prisoners have agreed a plan. Which **first call** by the last prisoner lets everyone else in the line be certain of his own hat?',
      hints: ['The last prisoner cannot know his own hat, so his call has to carry information about what *he* sees.', 'Think about counting the black hats. What single yes-or-no fact about that number is easy to send in one word?'],
      explain: 'The last prisoner says “black” if he sees an **even** number of black hats and “white” if he sees an odd number (or the other way round: whatever they agreed). The next prisoner counts the black hats he can see. If the parity matches the message, his own hat is white; otherwise it is black. Each following prisoner remembers the calls of those behind him, adds up the hats in front, and finds his own colour in the same way.',
      data: mc('He calls “black” if he sees an even number of black hats and “white” if he sees an odd number', [['He calls the colour of the hat directly in front of him, so that the next prisoner can simply copy it', 'That tells the next prisoner nothing he cannot already see for himself.'], ['He calls whichever colour he can see more of among the hats in front of him, black or white', 'The prisoner in front sees a different set of hats and cannot use that call to find his own hat.'], ['He calls the colour he guesses his own hat to be, and every other prisoner does the same', 'A guess may save him, but it tells the others nothing.']], { glyph: '⚫⚪' }),
      concepts: ['parity', 'binary'], links: ['bt-hat-line-10', 'bt-hat-line-colours']
    },
    {
      id: 'bt-islanders-2', title: 'Two Blue Eyes', diff: 3,
      source: 'A version of the blue-eyed islanders puzzle, itself a cousin of the “muddy children” puzzles of the 1950s and later.',
      text: 'On an island, every inhabitant has **blue** or **brown** eyes. Nobody knows his own eye colour, nobody may talk about eye colour, and there are no mirrors, but everybody sees the eyes of everybody else. A rule says: **anyone who works out his own eye colour must leave the island on the ferry the next morning.**\n\nAll the islanders are perfectly logical, and everybody knows that everybody else is too. In fact **two** islanders have blue eyes and the rest have brown.\n\nOne day a truthful visitor says aloud, in front of all: “At least one of you has blue eyes.” On which morning after that do the blue-eyed islanders leave? (The morning after the announcement is morning **1**.)',
      hints: ['Put yourself in the place of a blue-eyed islander. You see exactly one other blue-eyed person. What if your own eyes were brown?', 'If your own eyes were brown, the other blue-eyed person would see nobody with blue eyes, and would leave at once on morning 1. Does that happen?'],
      explain: 'Blue-eyed Ann sees one blue-eyed person, Ben. If her own eyes were brown, Ben would see no blue eyes at all and would know at once that *he* is the blue-eyed one the visitor spoke of, and leave on morning 1. On morning 1 nobody leaves, so Ann knows her eyes are **blue**, and Ben reasons in the same way. Both leave on morning **2**.',
      data: { answer: { num: 2 }, ask: 'Which morning?', traps: [{ match: 1, msg: 'On morning 1 a blue-eyed islander sees another blue-eyed person, and cannot yet be sure of his own colour.' }], glyph: '👁' },
      concepts: ['common-knowledge', 'induction'], links: ['bt-islanders-100', 'bt-muddy-3']
    },
    {
      id: 'bt-light-bulb-count', title: 'The Counter’s Count', diff: 3,
      source: 'From the puzzle of the one hundred prisoners and the light bulb, which went round mathematicians and computer scientists in the early 2000s.',
      text: 'One hundred prisoners agree a plan in the yard; after that they are locked in separate cells and cannot talk. Each day the jailer picks one prisoner **at random** (the same one may be picked again and again) to visit a room with a single light and a switch, and then takes him back. The light is **off** to begin with, and every prisoner knows this. Nobody can see the light except when visiting the room.\n\nAt any time a prisoner may declare: “All of us have now visited the room.” If he is right, everybody goes free; if wrong, they are all kept for ever.\n\nTheir plan: one prisoner is the **counter**. Every other prisoner, the first time he finds the light **off** on a visit, turns it **on**, and never touches the switch again. The counter turns the light **off** every time he finds it on, and counts. The counter should declare when his count has reached which number?',
      hints: ['How many prisoners besides the counter are there? Each of them turns the light on exactly once.', 'The counter is sure everybody has been when he has turned off a light 99 times: 99 different prisoners have each switched it on once.'],
      explain: 'Each of the **99** prisoners besides the counter switches the light on exactly once, and only the counter ever switches it off. Every time the counter finds the light on and turns it off, he knows that a *new* prisoner has visited. When his count reaches **99**, everybody has been to the room, and he declares. (It takes a very long time: about 10,000 days, or 28 years, on average.)',
      data: { answer: { num: 99 }, traps: [{ match: 100, msg: 'The counter knows about himself already: he counts only the *others*.' }], glyph: '💡' },
      concepts: ['deduction', 'information'], links: ['bt-light-bulb-strategy']
    },

    /* ============================ HARD ============================ */
    {
      id: 'bt-party-six', title: 'Six at a Party', diff: 4,
      source: 'A special case of Frank Ramsey’s theorem (1930); the party form of it became a well-loved puzzle in the 1950s.',
      text: 'At a party, every two guests are either **friends** or **strangers**: nothing in between, and friendship goes both ways.\n\nWhat is the **smallest number of guests** that guarantees that, however the friendships are arranged, there will always be **three guests who are all friends** with one another, or **three who are all strangers** to one another?',
      hints: ['Try to build a party of five with no three mutual friends and no three mutual strangers. A pentagon might help.', 'For six guests, pick one guest, X. The other five each are friends or strangers of X. By the pigeonhole principle, at least three fall into the same group.'],
      explain: 'Five guests are not enough: sit them round a table and let neighbours be friends and all others strangers. Then no three are mutual friends (a pentagon has no triangle) and no three are mutual strangers (the five diagonals form another pentagon). Six always work. Pick a guest X: of the other five, at least three are friends of X or at least three are strangers to X. Say three are friends of X. If any two of those three are friends, they make a friendly triangle with X; if not, the three are mutual strangers. The other case is the same with the words swapped. So the answer is **6**.',
      data: { answer: { num: 6 }, traps: [{ match: 5, msg: 'Five is not enough: seat five guests round a table, friends with the neighbours and strangers with the other two, and see what happens.' }, { match: [3, 4], msg: 'That is too few: you can arrange friendships so that neither kind of triangle appears.' }], glyph: '6' },
      concepts: ['pigeonhole', 'graph', 'combinatorics'], links: ['bt-handshake-parity']
    },
    {
      id: 'bt-pirates-5', title: 'Five Pirates and the Gold', diff: 4,
      source: 'A pirate puzzle, told in many forms since the 1990s.',
      text: 'Five pirates, ranked from the captain (rank 1) down to the cabin boy (rank 5), find **100 gold coins**. The captain proposes how to share them. All five vote, the captain too, and if **at least half** of the votes are in favour, the plan is carried out. Otherwise the captain is thrown overboard and the pirate of the next rank proposes, in the same way, and so on.\n\nAll the pirates are perfectly logical. Each wants, in this order, to stay alive, to get as much gold as possible, and (if all else is equal) to see others thrown overboard: so a pirate votes “yes” only if the plan gives him **strictly more** gold than he would get otherwise.\n\nHow many coins does the captain keep?',
      hints: ['Work backwards: what happens with two pirates, then three, then four?', 'With three pirates the captain keeps 99 and gives 1 coin to the junior. With four the captain needs two votes: whom is it cheapest to buy?', 'Five pirates: the captain needs three votes in all. Which pirates get *nothing* if he is thrown overboard, and would therefore vote for one coin?'],
      explain: 'Three pirates: the captain keeps 99 and pays the junior 1. Four: the captain needs two votes and pays 1 to the pirate who would get nothing in the three-pirate case (rank 3 of the four), keeping 99. Five: the captain needs three votes, his own and two more. Those who would get nothing after his fall are the pirates the four-pirate captain leaves empty-handed: in the five-pirate ranking, ranks 3 and 5. One coin each buys their votes. The captain keeps **98**, and the pirates of rank 2 and 4 get nothing.',
      data: { answer: { num: 98 }, traps: [{ match: 100, msg: 'He needs three votes out of five, and his own is only one.' }, { match: 99, msg: 'That is what a captain of three or four pirates keeps. With five he needs three votes.' }, { match: 96, msg: 'He does not need to pay more than a coin each, and only two of them.' }], figure: F.pirates, glyph: '🏴‍☠️' },
      concepts: ['game-theory', 'induction', 'working-backwards'], links: ['bt-pirates-3', 'bt-pirates-10']
    },
    {
      id: 'bt-eggs-100', title: 'Two Eggs, a Hundred Floors', diff: 4,
      source: 'A popular puzzle and interview question, known in many forms.',
      text: 'A building has **100 floors**. An egg dropped from a low floor survives; dropped from a high enough floor it breaks. There is a highest safe floor (possibly the ground, possibly the top). You have **two identical eggs**. An egg that survives is as good as new; a broken egg is gone.\n\nWhat is the smallest number of drops that will **certainly** find the highest safe floor?',
      hints: ['If the first egg breaks you must check the floors below it one by one with the second. So the number of floors you can afford to check depends on how many drops you have left.', 'Let the first drop be from floor *k*; the steps then get smaller by one each time: *k*, *k* + (*k* − 1), … Find the least *k* with *k* + (*k* − 1) + … + 1 ≥ 100.'],
      explain: 'With *k* drops in hand, the first drop can be from floor *k*: if the egg breaks, floors 1 to *k* − 1 can be searched one by one with the second egg in the *k* − 1 drops left. If it survives, you have *k* − 1 drops left to search the floors above, and the next drop is *k* − 1 floors higher. So *k* drops cover *k* + (*k* − 1) + … + 1 = *k*(*k* + 1)/2 floors. For 100 floors we need *k*(*k* + 1)/2 ≥ 100, and *k* = 13 gives only 91 while *k* = **14** gives 105.',
      data: { answer: { num: 14 }, traps: [{ match: 13, msg: 'Thirteen drops cover only 13 + 12 + … + 1 = 91 floors.' }, { match: 10, msg: 'Ten is what you get by testing every tenth floor with luck, but the worst case is worse: the second egg may then have to check nine floors one by one.' }, { match: 50, msg: 'With two eggs you can do much better than half the building.' }, { match: 7, msg: 'That is far too few: two eggs and seven drops cover only 28 floors.' }], glyph: '🥚' },
      concepts: ['sequence', 'working-backwards'], links: ['bt-eggs-36', 'bt-eggs-3-100']
    },
    {
      id: 'bt-eggs-3-100', title: 'Three Eggs, a Hundred Floors', diff: 4,
      source: 'A popular puzzle and interview question, known in many forms.',
      text: 'The same building again, with **100 floors** and a highest safe floor for eggs, but this time you have **three** identical eggs.\n\nWhat is the smallest number of drops that will certainly find the highest safe floor?',
      hints: ['Let *f*(*e*, *k*) be how many floors *e* eggs and *k* drops can search. The first drop is from some floor; if the egg breaks you have *e* − 1 eggs and *k* − 1 drops left, if not you still have *e* eggs and *k* − 1 drops.', 'So *f*(*e*, *k*) = *f*(*e* − 1, *k* − 1) + 1 + *f*(*e*, *k* − 1). Two eggs give *k*(*k* + 1)/2; three eggs give a sum of three binomial terms: *k* + *k*(*k* − 1)/2 + *k*(*k* − 1)(*k* − 2)/6.'],
      explain: 'Three eggs and *k* drops search *f* = *k* + *k*(*k* − 1)/2 + *k*(*k* − 1)(*k* − 2)/6 floors. With *k* = 8 that is 8 + 28 + 56 = 92, short of 100; with *k* = **9** it is 9 + 36 + 84 = 129, plenty. So nine drops are enough and eight are not. An extra egg saves five drops: 14 for two eggs, 9 for three.',
      data: { answer: { num: 9 }, traps: [{ match: 8, msg: 'Eight drops with three eggs search only 92 floors.' }, { match: 14, msg: 'That is the answer for two eggs. A third egg lets you use larger first steps.' }], glyph: '🥚🥚🥚' },
      concepts: ['sequence', 'combinatorics', 'recursion'], links: ['bt-eggs-100', 'bt-eggs-36']
    },
    {
      id: 'bt-hilbert-bus', title: 'The Grand Hotel: The Endless Coach', diff: 4,
      source: 'Hilbert’s Grand Hotel, after the mathematician David Hilbert; popularised by George Gamow in *One Two Three … Infinity* (1947).',
      text: 'The Grand Hotel has infinitely many rooms, numbered 1, 2, 3 …, and tonight every room is taken. Then an **infinite coach** arrives, carrying infinitely many new guests, numbered 1, 2, 3 … , and all want a room.\n\nThe manager can move the guests already in the hotel, as often as he likes, but two guests may not share a room. What should he do?',
      hints: ['Moving everybody one room along makes just one empty room. You need infinitely many empty rooms, and the guests already there need somewhere to go.', 'Which infinite set of rooms could be left empty and yet leave every existing guest in a room? Think of the odd numbers and the even numbers.'],
      explain: 'The manager asks the guest in room *n* to move to room **2*n***. Everybody has a room (the even ones) and all the odd rooms 1, 3, 5 … are empty. New guest number *k* takes room 2*k* − 1. So one infinity fits neatly inside another. (The hotel could even take infinitely many coaches, each with infinitely many guests, by using powers of primes.)',
      data: mc('Move the guest in room n to room 2n, and seat coach guest k in room 2k − 1', [['Move the guest in room n to room n + 1, and seat all the coach guests in room 1', 'Two guests cannot share a room, and one empty room does not hold an infinite coach.'], ['Move the guest in room n to room n + 1000000, and seat the coach guests in the rooms left', 'A million rooms are freed, but the coach holds infinitely many guests.'], ['It cannot be done: infinity plus infinity is more than the hotel holds', 'Infinities are odd: infinity plus infinity is just infinity again, and it fits.']], { figure: F.hotel, glyph: '∞∞' }),
      concepts: ['paradox'], links: ['bt-hilbert-one']
    },
    {
      id: 'bt-hat-line-colours', title: 'A Line of Twenty and Four Colours', diff: 4,
      source: 'A variation of the classic hat puzzle.',
      text: 'Twenty prisoners stand in a line, one behind the other, all facing forward. This time the jailer puts on each head a hat that is **red, blue, green or yellow**, in any mixture. Everybody sees all the hats in front of him and none of the others. Starting from the last, each prisoner calls out one colour aloud as a guess about his own hat; everybody hears every call, but nobody is told whether it was right. Whoever names his own colour correctly goes free.\n\nThe prisoners can agree a plan beforehand. How many are **sure** to be freed?',
      hints: ['With two colours the last prisoner announced whether the number of black hats was even or odd. What replaces “even or odd” when there are four colours?', 'Number the colours 0, 1, 2 and 3, and add up all the numbers ahead of him. Use the remainder when the total is divided by 4.'],
      explain: 'Number the colours 0 to 3. The last prisoner adds the numbers of all the hats he sees and calls the colour whose number is that sum’s remainder on division by 4. The next prisoner adds the hats he sees, subtracts the result from the call he heard (again taking remainders) and finds his own colour. Every prisoner does the same, remembering all the calls of those behind him. All but the last are certain: **19** are sure to be freed.',
      data: { answer: { num: 19 }, traps: [{ match: 20, msg: 'The last prisoner has no way to know his own hat. He can only be lucky.' }, { match: 10, msg: 'A good plan does a lot better than that.' }], glyph: '🎨' },
      concepts: ['modular', 'binary'], links: ['bt-hat-line-10', 'bt-hat-line-strategy']
    },
    {
      id: 'bt-hats-three-together', title: 'Three Players, Three Hats', diff: 4,
      source: 'A classic of the hat-guessing puzzles, which became famous among mathematicians in the 1990s.',
      text: 'Three players are each given a hat, **red or blue**, chosen by the toss of a fair coin. Each can see the other two hats, not his own. They may not talk or signal. Each **at the same moment** either guesses the colour of his own hat, or passes.\n\nThe team **wins** if at least one player guesses and **nobody guesses wrong**. They may agree on a plan beforehand.\n\nWhat is the **best chance** of winning?',
      hints: ['A single player who guesses wins half the time. The trick is to arrange that the wrong guesses all happen together.', 'Try: “If I see two hats of the same colour I guess the opposite; if I see two different colours, I pass.” Check all eight possible sets of hats.'],
      explain: 'Use the plan: if you see two hats of the *same* colour, guess the *other* colour; if you see one of each, pass. Of the eight possible hat sets, two have all hats the same, and then everybody guesses wrong. In each of the other six, exactly one player sees two hats alike and guesses right, and the other two pass. The team wins **6 times out of 8 = 3/4**. The plan crowds all the wrong guesses into two of the eight cases.',
      data: { answer: { num: 0.75, show: '3/4' }, ask: 'A fraction or a decimal.', traps: [{ match: 0.5, msg: 'One player alone guessing gets half. A team that plans together can do better.' }, { match: 0.875, msg: 'That is possible only with seven players. With three, no plan does better than 3/4.' }], glyph: '🎩🎩🎩' },
      concepts: ['probability', 'combinatorics'], links: ['bt-hats-seven']
    },
    {
      id: 'bt-muddy-3', title: 'The Muddy Children', diff: 4,
      source: 'The muddy children puzzle is a classic from the logic of knowledge; it has been retold in many forms since the mid-twentieth century.',
      text: 'Five children play in a garden. **Three** of them get mud on their foreheads. Each child can see the others’ foreheads but not his own, and they may not talk.\n\nTheir father comes and says: “**At least one of you has mud on his forehead.**” Then he says: “If you know you are muddy, step forward.” Nobody moves. He asks again, and again. Each time all the children answer at the same moment.\n\nThe children are perfectly logical and know that the others are too. **At which asking** do the muddy children step forward?',
      hints: ['Imagine only one muddy child. What does he see when his father speaks, and what does he do?', 'With two muddy children, each sees one muddy face. If nobody steps forward at the first asking, what can each of them work out?'],
      explain: 'One muddy child would see no mud, know at once that he is the one, and step forward at the first asking. With two muddy children, each sees one muddy face and thinks: “If I were clean, he would see no mud and step forward now.” When nobody does, both conclude that they are muddy, and step out at the second asking. With three: each muddy child sees two muddy faces, waits two rounds for one of them to move, and when neither does, knows that he too is muddy. So all three step forward at the **third** asking. In general, *k* muddy children step forward at the *k*th asking.',
      data: { answer: { num: 3 }, ask: 'At which asking (1st, 2nd, 3rd …)?', traps: [{ match: 1, msg: 'At the first asking a muddy child sees two muddy foreheads, so his own might be clean. He cannot be sure.' }, { match: 2, msg: 'With two muddy children that would be right. With three, each muddy child needs one more round.' }], glyph: '👦' },
      concepts: ['common-knowledge', 'induction'], links: ['bt-islanders-2', 'bt-islanders-100']
    },
    {
      id: 'bt-two-envelopes', title: 'The Two Envelopes', diff: 4,
      source: 'A well-known paradox, known in many forms, including wallets and neckties, since the mid-twentieth century.',
      text: 'Two envelopes each contain money, and one contains **twice as much as the other**. You choose one envelope at random. **You do not open it.** Then you are offered the chance to swap.\n\nA friend argues: “Say your envelope holds *X*. The other holds 2*X* or *X*/2 with equal chance, so on average it holds ½(2*X*) + ½(*X*/2) = 1.25 *X*. Swapping gains you 25%!” But by the same argument, having swapped, you would want to swap back, and back again.\n\nWhat is the truth?',
      hints: ['In the argument the letter *X* is used for two different amounts. In which case does *X* stand for the smaller amount, and in which for the larger?', 'Call the two amounts *a* and 2*a*. What is the average of what you hold, and what is the average of what you would get by swapping?'],
      explain: 'Let the envelopes hold *a* and 2*a*. Half the time you hold *a* and swapping gains *a*; half the time you hold 2*a* and swapping loses *a*. On average the swap gains nothing. The friend’s argument uses *X* for the amount in your envelope in both cases: in the first case *X* = *a* and the other holds 2*X*, in the second *X* = 2*a* and the other holds *X*/2, but these are two different values of *X*, so the average of “2*X* and *X*/2” mixes up different amounts. No fair way of choosing the two amounts makes “double or half” a 50–50 matter for *every* possible *X*. (If you *open* the envelope and know how the amounts were chosen, the answer can change.)',
      data: mc('No: on average you gain nothing, because “X” means two different amounts in the two halves of the argument', [['Yes: swapping gains 25% on average, so you should swap, and there is nothing wrong with swapping back again', 'Then swapping back would gain 25% too, and so would swapping again, for ever. An argument that leads to that has a fault in it.'], ['Yes, but only if you open your envelope first: then the odds always favour swapping, whatever amount you see', 'Seeing the amount can change the odds, but it does not make swapping a sure gain for every possible amount.'], ['No, because the two envelopes must hold the same amount, or the game would not be fair to the player', 'They do not: one holds twice as much as the other.']], { glyph: '✉✉' }),
      concepts: ['expected-value', 'paradox', 'probability'], links: ['bt-boarding-pass']
    },
    {
      id: 'bt-boarding-pass', title: 'The Lost Boarding Pass', diff: 4,
      source: 'A well-known probability puzzle.',
      text: 'A hundred passengers queue to board a plane that has exactly 100 seats, and each has a ticket for a **particular seat**. The first passenger has lost his ticket, and sits in a seat chosen **at random**. Every passenger after him, boarding in order, goes to his own seat if it is free, and otherwise takes a free seat **at random**.\n\nWhat is the chance that the **last** passenger finds his own seat free?',
      hints: ['Try it with two passengers, then three. Do you see a pattern?', 'Only two seats really matter: the seat of the first passenger and the seat of the last. Whichever of the two is taken *first*, by a passenger with a random choice, decides everything.'],
      explain: 'A passenger who finds his own seat free takes it and changes nothing. Trouble is passed on only when a passenger finds his seat taken and chooses at random. Whenever a random choice is made, the seat of the first passenger (seat 1) and the seat of the last passenger (seat 100) are each equally likely to be picked; and the first time either is taken, the whole matter is settled: if seat 1 is taken, everybody after that finds his own seat; if seat 100 is taken, the last passenger is out of luck. By symmetry each happens with the same chance: **1/2**.',
      data: { answer: { num: 0.5, show: '1/2' }, ask: 'A fraction or a decimal.', traps: [{ match: 0.99, msg: 'Nearly everybody finds their seat, but the last passenger is affected by every random choice before him. Try a plane with only three passengers.' }, { match: 0.01, msg: 'That is the chance that the first passenger happens to pick the last seat. But the chain goes on.' }], glyph: '✈' },
      concepts: ['probability', 'symmetry'], links: ['bt-two-envelopes']
    },
    {
      id: 'bt-handshakes-couples', title: 'Couples and Handshakes', diff: 4,
      source: 'A classic party puzzle, often told with the host and hostess.',
      text: 'At a party there are **five married couples**, the host and hostess among them: ten people. Some of the guests shake hands with one another. Nobody shakes hands with himself or with his own husband or wife.\n\nThe host asks each of the other **nine** people how many hands he or she shook. All nine answers are **different**.\n\nHow many hands did the **hostess** shake?',
      hints: ['What are the nine different answers? Nobody shakes more than 8 hands (not their own, not their partner’s), and nobody fewer than 0.', 'The person who shook 8 hands shook everyone except his or her partner. Who must the partner be, and how many hands did that partner shake?'],
      explain: 'The nine answers are all different, so they are 0, 1, 2, … 8. The person who shook 8 hands shook everyone except his or her partner, so the partner is the one who shook 0. Remove that couple: the person with 7 shook everyone except the 0 and the partner, so the partner is the one who shook 1. And so on: 8 and 0, 7 and 1, 6 and 2, 5 and 3 are couples. That leaves the person who shook **4**, who can only be the hostess: she is the host’s partner, and the host was the one asking.',
      data: { answer: { num: 4 }, traps: [{ match: 5, msg: 'Try pairing off the people who shook 8 and 0 hands, then 7 and 1, and see who is left over.' }, { match: 0, msg: 'Nobody who shook 0 hands can be paired with someone who shook fewer than 8. Work out who is partnered with the person who shook 8.' }], glyph: '🤝' },
      concepts: ['deduction', 'pigeonhole', 'graph'], links: ['bt-handshake-parity']
    },
    {
      id: 'bt-von-neumann-coin', title: 'A Fair Toss from a Bent Coin', diff: 4,
      source: 'A trick attributed to John von Neumann (1951).',
      text: 'You have a **bent coin**. It lands heads with some chance *p* that you do not know (it is neither 0 nor 1), and each toss is independent of the others. You want to make a fair choice between two things, with a **fifty–fifty** chance of each.\n\nWhich method works?',
      hints: ['Look for two different outcomes of a pair of tosses that have exactly the same chance, whatever *p* is.', 'Heads-then-tails has chance *p*(1 − *p*). What is the chance of tails-then-heads?'],
      explain: 'Toss the coin **twice**. If you get heads then tails, choose the first thing; if tails then heads, choose the second; if both tosses agree, ignore them and start again. Heads-then-tails and tails-then-heads each have chance *p*(1 − *p*), so given that one of them happens they are equally likely, whatever *p* is. The method wastes some tosses if the coin is very biased, but it is exactly fair.',
      data: mc('Toss twice: heads-tails means the first choice, tails-heads the second; if the tosses agree, start again', [['Toss once: heads means the first choice, tails means the second, and hope that the bend does not matter', 'That is fair only if p is exactly one half, and you do not know that it is.'], ['Toss twice: two heads means the first choice, and anything else means the second choice, whatever the coin does', 'The chance of two heads is p², and the other three cases together are 1 − p², which is not a half.'], ['Toss twice: two heads means the first choice, two tails the second, and if the tosses differ, start again', 'The chances are p² and (1 − p)², and these differ unless p is a half.']], { glyph: '🪙' }),
      concepts: ['probability', 'symmetry'], links: ['bt-hats-three-together']
    },
    {
      id: 'bt-two-thirds', title: 'Two Thirds of the Average', diff: 4,
      source: 'The “guess two-thirds of the average” game, based on John Maynard Keynes’s comparison of the stock market with a beauty contest (1936), and often played with real crowds.',
      text: 'A crowd of people each write down a number between 0 and 100 (decimals allowed). Whoever is closest to **two-thirds of the average** of all the numbers wins.\n\nEveryone is perfectly logical, everyone knows the others are too, and so on. What number does a perfectly logical player choose?',
      hints: ['The average can never be above 100, so two-thirds of it never above about 67. Would a sensible player ever write more than 67?', 'If no logical player would write more than 67, the average is at most 67, so two-thirds of it is at most 44. Keep going.'],
      explain: 'Nobody sensible writes a number above 2/3 of 100, about 67. But if nobody does, the average is at most 67, so nobody should write more than 2/3 of 67, about 44; then 30, 20, 13, and so on, shrinking by a third each time. The only number that stays put is **0**. Real crowds do not think so far: in experiments, most people stop after a step or two, and the winning number is often somewhere between 13 and 27.',
      data: { answer: { num: 0 }, ask: 'What number?', traps: [{ match: [33, 22, 44, 30, 20], msg: 'That is roughly what real crowds pick, after one or two steps of thinking. A perfectly logical crowd keeps going.' }, { match: [50, 67], msg: 'A logical player knows that nobody logical would choose so high. Go on.' }], glyph: '⅔' },
      concepts: ['game-theory', 'induction'], links: ['bt-truel']
    },
    {
      id: 'bt-key-flip', title: 'The Prisoners and the Board', diff: 4,
      source: 'A well-known prisoner puzzle in many forms, usually played on a chessboard of 64 squares.',
      text: 'Two prisoners, **A** and **B**, are to play a game against the jailer. The jailer lays out a board of **8 squares**, numbered 0 to 7, and puts a coin, heads or tails as he likes, on every square. He hides a key under one square. Prisoner A sees the whole board and the key; he must turn over **exactly one coin**, then leave. Prisoner B comes in, sees only the coins, and points to one square. They go free if he points to the key.\n\nThey agree a plan beforehand. B’s plan is this: write the numbers 0–7 in binary, and take all the squares showing **heads**. In each of the three binary columns, count the 1s: the column of the code gets a 1 if the count is **odd** and a 0 if it is even. B points to the square whose number is the code.\n\nToday the coins show heads on squares **1, 2, 5 and 7**, and the key is under square **4**. Which square’s coin must A turn over?',
      hints: ['First find the code of the board as it stands: write 1, 2, 5, 7 in binary (001, 010, 101, 111) and count the 1s in each column.', 'Turning a coin over adds its square’s number to the code, or takes it away: the column count changes by one where that number has a 1. Which number turns the present code into the key’s number, 4?'],
      explain: 'The heads 1, 2, 5, 7 are 001, 010, 101, 111 in binary. The units column has three 1s (odd, so 1); the twos column has two (even, 0); the fours column has two (0). The code is 001, that is **1**, and B would point at square 1. To make it 4 = 100, the code must change by 001 XOR 100 = **101**, which is 5. Turning the coin on square 5 (from heads to tails) removes 101 from the count, and the code becomes 100 = 4. B points at 4, and they are free. Whatever the board and the key, there is always one coin whose number produces the change needed.',
      data: { answer: { num: 5 }, ask: 'A square number, 0 to 7.', traps: [{ match: 4, msg: 'Square 4 is where the key is, but turning its coin changes the code by 4, from 1 to 5, not to 4.' }, { match: 1, msg: 'Turning square 1 would change the code from 1 to 0, and B would point at square 0.' }], figure: F.keyBoard, glyph: '🗝' },
      concepts: ['binary', 'parity', 'information'], links: ['bt-key-theorem']
    },
    {
      id: 'bt-hanging', title: 'The Unexpected Hanging', diff: 4,
      source: 'The surprise examination or unexpected hanging paradox, which began to circulate in the 1940s; the philosopher W. V. Quine analysed it in the journal *Mind* in 1953.',
      text: 'A judge tells a prisoner: “You will be hanged at noon on one day next week, Monday to Friday. You will not know which day until the morning of the hanging: it will be a **surprise**.”\n\nThe prisoner reasons in his cell. “It cannot be Friday: if I am alive on Thursday evening I will know it is Friday, so that would be no surprise. So Friday is out. Then it cannot be Thursday: if I am alive on Wednesday evening, with Friday out, I will know it is Thursday. And so on: not Wednesday, not Tuesday, not Monday. I cannot be hanged at all!”\n\nOn Wednesday morning the hangman knocks at the door, and the prisoner is quite astonished. What went wrong?',
      hints: ['The prisoner uses the judge’s announcement to prove that the announcement cannot come true. Has he a right to rely on it while proving that?', 'When the prisoner reaches “I cannot be hanged”, is he still sure that the judge’s statement is true?'],
      explain: 'The prisoner’s chain of reasoning rules out Friday by taking for granted that the judge’s announcement is *true and known to be true*, but he then uses it to conclude that it is false. Once he has convinced himself that it cannot be true, he can no longer be certain of it, and a hanging on Wednesday really does surprise him, so the judge’s words come true after all. Philosophers still argue about the best diagnosis; the usual one is that “you will not know” makes a claim about what the prisoner will *know*, and the prisoner’s own reasoning cannot both use and destroy that claim.',
      data: mc('He relies on the judge being right in order to prove the judge wrong; once he doubts the judge, a hanging can surprise him', [['The judge lied: the announcement was false, since the prisoner was hanged and he was not really surprised', 'The prisoner was astonished: the hanging was a surprise.'], ['The prisoner is right: a surprise hanging is logically impossible, so it cannot take place, whatever the judge says', 'But the hanging did take place, and it was a surprise. The reasoning must have a hole in it.'], ['The week has seven days, not five, so the chain of reasoning breaks down when it reaches the weekend', 'The number of days does not matter: any number of days gives the same puzzle.']], { glyph: '⏳' }),
      concepts: ['paradox', 'common-knowledge'], links: ['bt-ten-statements']
    },
    {
      id: 'bt-date-puzzle', title: 'When Is Vera’s Party?', diff: 4,
      source: 'A logic puzzle of the “date” kind, a family made popular in the 2010s; the dates and the dialogue here are our own.',
      text: 'Ines and Tomas want to know the date of a party. Their friend Vera says: “It is on one of these twelve days.”\n\n**June 5** · **July 8, 9, 15** · **October 6, 10, 12** · **December 4, 6, 9, 10, 14**\n\nVera whispers the **month** to Ines and the **day** (the number) to Tomas. Neither hears what the other was told. Both are perfectly logical, and each of them hears what the other says.\n\n**Ines:** “I don’t know when the party is.”<br>**Tomas:** “I didn’t know either.”<br>**Ines:** “I still don’t know.”<br>**Tomas:** “Now I know!”\n\nWhen is the party?',
      hints: ['Ines’s first remark rules out a month. Which month is it, and why?', 'Tomas did not know either: his day must be a number that appears in more than one month, among the dates that are left.', 'Go on like that: after each remark, strike out the dates that would have made the speaker say something different.'],
      explain: 'Ines does not know the date, so her month has more than one date: **June 5** goes. Tomas does not know either, so his day appears more than once among the rest: the days 9, 6 and 10. That leaves July 9, October 6, October 10, December 6, December 9 and December 10. Ines still does not know, so her month has more than one of these: July goes. Left are October 6, October 10, December 6, December 9, December 10. Tomas now knows, so his day appears only once: the days 6 and 10 each appear twice, but 9 appears only in December. The party is on **December 9**.',
      data: { answer: { text: ['December 9', '9 December', 'December 9th', '9th December', 'Dec 9', '9 Dec', 'Dec 9th', '9th Dec', '12/9', '9/12'], exact: true }, ask: 'A date, such as June 5.', traps: [{ match: ['October 6', 'October 10', 'December 6', 'December 10', 'July 9'], msg: 'That date is still possible after the first steps, but not after Tomas says “Now I know”: that day would appear twice among the remaining dates.' }], glyph: '📅' },
      concepts: ['deduction', 'common-knowledge'], links: ['bt-sum-product']
    },
    {
      id: 'bt-boxes-strategy', title: 'The Hundred Prisoners and the Boxes', diff: 4,
      source: 'A puzzle traced to Peter Bro Miltersen (2003).',
      text: 'A hundred prisoners are numbered 1 to 100. In a room stand **100 boxes**, numbered 1 to 100. The jailer has put into each box a slip of paper bearing a prisoner’s number, each number used once, in a random order.\n\nOne by one, each prisoner enters the room, opens **at most 50 boxes**, in any order he likes, and leaves everything as he found it. He is looking for the slip with his own number. If **every** prisoner finds his own number, all are freed; if even one fails, all are lost. The prisoners cannot communicate once the game has begun, but can agree on a plan beforehand.\n\nIf each prisoner just opens 50 random boxes, the chance that all succeed is (1/2)¹⁰⁰: hopeless. Which plan gives them a decent chance, about one in three?',
      hints: ['The slips give a rule: box *k* holds the number of some prisoner. Think of the boxes as arrows: box *k* points to the number inside it.', 'What if prisoner *k* first opens box *k*, and then the box whose number he just read, and so on? Where does this chain of boxes end?'],
      explain: 'Each prisoner **starts with the box that has his own number**, and then opens the box whose number he has just found, and continues like this. Following the arrows *k* → (number in box *k*) traces the loop that contains his own number, and it ends when he finds his own number, in the last box of his loop. He succeeds if his loop has length at most 50. So *all* prisoners succeed if and only if **no loop is longer than 50**. For a random shuffle of 100 that happens with chance about **31%**: not certain, but enormously better than (1/2)¹⁰⁰.',
      data: mc('Prisoner k opens box k first, and then the box whose number he has just found, and so on', [['Every prisoner opens boxes 1 to 50, because the first fifty boxes are the ones most likely to hold the slips', 'Only 50 slips can be in those boxes, so at least 50 prisoners must fail.'], ['Prisoner k opens the fifty boxes numbered k, k + 1, … , k + 49, wrapping round after box 100', 'Any fixed choice of fifty boxes per prisoner leaves their successes unlinked: the chance that all succeed is astronomically small, under one in 10²⁹.'], ['Nothing helps: each prisoner has a fifty–fifty chance, and the chances just multiply', 'Their chances are not independent. A cunning plan makes all the successes and failures happen together.']], { glyph: '📦' }),
      concepts: ['probability', 'combinatorics'], links: ['bt-boxes-probability']
    },
    {
      id: 'bt-light-bulb-strategy', title: 'The Prisoners and the Light Bulb', diff: 4,
      source: 'From the puzzle of the one hundred prisoners and the light bulb, which went round mathematicians and computer scientists in the early 2000s.',
      text: 'One hundred prisoners agree a plan and are then locked in separate cells. Each day the jailer picks one prisoner **at random** (the same one may be picked many days in a row) to visit a room with **one light and one switch**, and then takes him back. The light is **off** to begin with, and everyone knows that. Nobody can see the light except when visiting the room.\n\nAt any time a prisoner may say: “All of us have now visited the room.” If he is right, all go free; if wrong, they are all kept for ever.\n\nWhich plan works?',
      hints: ['Only the light can carry a message from one prisoner to another, one bit at a time. Who could be the one to listen?', 'One prisoner acts as a counter. What should each of the others do, so that the counter can tell that a new prisoner has been in?'],
      explain: 'They choose a **counter**. Every other prisoner turns the light **on** the *first* time he finds it off, and after that never touches the switch. The counter turns the light **off** every time he finds it on, and counts. Each turn-off means a new prisoner has been. When the counter’s count reaches 99, everybody has been, and he announces it. The other plans suffer from two faults: a message that can be overwritten by anyone, or no way for the counter to be sure that a *different* prisoner sent each signal.',
      data: mc('One prisoner is the counter and switches the light off, counting; the others switch it on once only; the counter declares at 99', [['Every prisoner flips the switch on each visit, and the first to find the light on for the hundredth time declares', 'The same prisoner can visit many times in a row, and nothing tells the announcer that a hundred different prisoners have been.'], ['On the hundredth day, whoever is visited declares that everyone has been, because a hundred days are enough', 'On day 100 the jailer will most probably have missed several prisoners.'], ['Every prisoner leaves the light as he found it, and the one who has visited most often declares when he has been ten times', 'Nobody can know how often the others have visited, and the light carries no message.']], { glyph: '💡' }),
      concepts: ['deduction', 'information'], links: ['bt-light-bulb-count']
    },

    {
      id: 'bt-25-horses', title: 'The Three Fastest of Twenty-Five', diff: 4,
      source: 'A well-known puzzle, popular as a problem in interviews for computer scientists.',
      text: 'You have **25 racehorses** and a track on which **5 horses** can race at a time. You have **no stopwatch**: a race tells you only the order in which the horses in it finished, not their times. Each horse always runs at its own steady speed, and no two horses have the same speed.\n\nWhat is the **smallest number of races** with which you can be sure to find the **three fastest** horses?',
      hints: ['Start with 5 heats, so that every horse has raced once. Then race the five heat winners against each other.', 'After the winners’ race, which horses can *no longer* be among the top three? A horse that already has three others faster than it is out.'],
      explain: 'Run five heats (5 races); then race the five heat winners (race 6). Call them, in the order of race 6, A1 (the fastest), B1, C1, D1, E1, and call the other horses of each heat A2, A3 … B2, B3 … in the order they finished their heat. A1 is the fastest horse of all. For second and third place only five horses are still possible: A2 and A3 (only A1, or A1 and A2, can be ahead of them), B1 (only A1 can be ahead of it), B2 and C1 (only A1 and B1 can be ahead of them). Everyone else has at least three horses faster than it. Race these five (race 7): the first two home are the second and third fastest of all. So **7** races are enough, and seven is the best that can be done.',
      data: { answer: { num: 7 }, traps: [{ match: 5, msg: 'Five races tell you the order within each group of five, but not how the groups compare.' }, { match: 6, msg: 'Six races settle who is the fastest of all, but the second and third are not yet certain.' }, { match: [8, 9], msg: 'One does better than that: after the first six races only five horses can still be second or third.' }], glyph: '🐎' },
      concepts: ['deduction', 'combinatorics'], links: ['bt-eggs-100']
    },

    /* ============================ FIENDISH ============================ */
    {
      id: 'bt-pirates-10', title: 'Ten Pirates and the Gold', diff: 5,
      source: 'A pirate puzzle, told in many forms since the 1990s.',
      text: 'Ten pirates, ranked from the captain (rank 1) down to the cabin boy (rank 10), find **100 gold coins**. The captain proposes how to share them; all ten vote, the captain too, and if **at least half** of the votes are in favour, the plan is carried out. Otherwise the captain is thrown overboard and the next pirate proposes, and so on.\n\nAll the pirates are perfectly logical. Each wants, in this order, to stay alive, to get as much gold as possible, and (if all else is equal) to see others thrown overboard: a pirate votes “yes” only if the plan gives him **strictly more** than he would get otherwise.\n\nHow many coins does the captain keep?',
      hints: ['The pattern in the small cases (3 pirates: the captain keeps 99; 5 pirates: 98) tells you how many votes have to be bought at each size. How many votes does a ten-pirate captain need, including his own?', 'Five votes are needed, so four must be bought, one coin each. From whom? From the four who would get nothing if the captain were thrown overboard.'],
      explain: 'Work up from small cases: three pirates, the captain keeps 99; four, 99; five, 98; six, 98; and so on, the captain needing half the votes. With ten pirates he needs **five** votes: his own and four more. In the nine-pirate case four of the pirates get nothing, and one coin each now buys their votes. So the captain keeps 100 − 4 = **96**, and four pirates get one coin each. (With more than 200 pirates the pattern breaks in a spectacular way: some captains are simply doomed.)',
      data: { answer: { num: 96 }, traps: [{ match: 95, msg: 'He needs five votes in all, including his own, so he buys four, not five.' }, { match: [98, 99], msg: 'That is what he keeps with three, four, five or six pirates. With ten, he needs five votes.' }, { match: 90, msg: 'One coin per vote is enough to win the vote of a pirate who would otherwise get nothing.' }], glyph: '🏴‍☠️' },
      concepts: ['game-theory', 'induction', 'working-backwards'], links: ['bt-pirates-5', 'bt-pirates-3']
    },
    {
      id: 'bt-islanders-100', title: 'One Hundred Blue Eyes', diff: 5,
      source: 'A version of the blue-eyed islanders puzzle, itself a cousin of the “muddy children” puzzles.',
      text: 'On an island, every inhabitant has **blue** or **brown** eyes. Nobody knows his own eye colour, nobody may talk about eye colour, and there are no mirrors, but everybody sees the eyes of everyone else. A rule says: **anyone who works out his own eye colour must leave the island on the ferry the next morning.**\n\nAll islanders are perfectly logical, and everybody knows that everybody else is too. In fact **100** islanders have blue eyes, and 100 have brown eyes.\n\nOne day a truthful visitor says, so that all can hear: “At least one of you has blue eyes.” On which morning after that do the blue-eyed islanders leave? (The morning after the visitor speaks is morning **1**.)',
      hints: ['Solve it for one blue-eyed islander, then two, then three. What does each islander learn when nobody leaves on the morning before?', 'With *k* blue-eyed islanders, each of them sees *k* − 1 others. If nobody leaves on morning *k* − 1, what does each of them work out?'],
      explain: 'If there were one blue-eyed islander, he would see none and leave on morning 1. With two, each sees one, and when that one does not leave on morning 1, he knows he is blue-eyed too, and both leave on morning 2. With three, each waits until morning 2 for the other two to leave; when they do not, each knows he is the third, and all leave on morning 3. In general *k* blue-eyed islanders all leave on morning *k*, so with 100, they leave on morning **100**. It is the muddy children again, in a different costume.',
      data: { answer: { num: 100 }, ask: 'Which morning?', traps: [{ match: 99, msg: 'Each blue-eyed islander waits for the ninety-nine others to leave on morning 99. Since they do not, he then knows.' }, { match: 1, msg: 'On morning 1 a blue-eyed islander sees 99 other blue-eyed people, and is far from sure of his own colour.' }], glyph: '👁' },
      concepts: ['common-knowledge', 'induction'], links: ['bt-islanders-2', 'bt-islanders-news', 'bt-muddy-3']
    },
    {
      id: 'bt-islanders-news', title: 'What Did the Visitor Say?', diff: 5,
      source: 'A question about the blue-eyed islanders puzzle, which asks what the visitor *added*.',
      text: 'On an island, **100** islanders have blue eyes and 100 have brown eyes. Everyone sees everyone else’s eyes but not their own, and nobody is allowed to speak of eye colour. Anyone who works out his own eye colour leaves the next morning. All islanders are perfectly logical.\n\nOne day a visitor says, in front of everyone: “At least one of you has blue eyes.” Puzzlingly, **every islander already knew** this: each of them could see plenty of blue-eyed people. Yet after his words, all the blue-eyed islanders leave, on the hundredth morning; before it, nobody ever left.\n\nSo what did the visitor tell them that they did not know before?',
      hints: ['Everybody knew that someone had blue eyes. Did everybody know that *everybody else* knew? Did everybody know that everybody knew that everybody knew?', 'Take just two blue-eyed islanders, Ann and Ben. Ann knows there is a blue eye (Ben’s). Does Ann know that Ben knows there is a blue eye?'],
      explain: 'Everyone already knew that someone had blue eyes; what nobody knew was that it was **common knowledge**: that everybody knows, and that everybody knows that everybody knows, and so on to any depth. With a hundred blue-eyed islanders, each knows the fact, each knows that everyone else knows it, but somewhere down the chain (“I know that you know that he knows … that there is a blue eye”) the chain runs out and someone cannot be sure of the next link. The visitor’s public announcement closes the chain for good, and it starts the countdown of the puzzle.',
      data: mc('Nothing new as a fact, but the fact became common knowledge: everyone knows that everyone knows it, at every level', [['That there are exactly one hundred blue-eyed islanders, which each of them could only guess before', 'He did not say that. He said only that at least one had blue eyes.'], ['The colour of the visitor’s own eyes, which lets each islander compare and work out his own colour', 'The visitor said nothing about his own eyes.'], ['Nothing at all: his words changed nothing, and the islanders would have left in the end anyway', 'They would not: without the announcement, the puzzle says nobody ever left.']], { glyph: '👁👁' }),
      concepts: ['common-knowledge', 'induction'], links: ['bt-islanders-100']
    },
    {
      id: 'bt-hats-seven', title: 'Seven Players, Seven Hats', diff: 5,
      source: 'A hat puzzle made famous in the 1990s; its best solution uses the Hamming code, invented by Richard Hamming for computers in 1950.',
      text: 'Seven players are each given a hat, **red or blue**, by an independent toss of a fair coin. Each sees the six other hats but not his own, and they may not communicate. All at the same moment, each either guesses his own colour or passes. The team **wins** if at least one player guesses and **nobody guesses wrong**.\n\nWith three players the best plan wins 3 times in 4. What is the **best possible chance** with seven players?',
      hints: ['Think of the seven players as the numbers 1 to 7 in binary. Which arrangements of hats have a nice property that can be tested by adding numbers in binary (without carrying)?', 'Call an arrangement *special* if the binary sum, without carrying, of the numbers of the blue-hatted players is 0. There are 16 special arrangements out of 128. Each player guesses so as to *avoid* a special arrangement.'],
      explain: 'The plan: each player imagines both possible colours for his own hat. If one of them would make the arrangement *special* (the numbers of the blue-hatted players add up to zero, without carrying), he guesses the *other* colour; if neither would, he passes. If the arrangement is special, everybody guesses wrong and the team loses: 16 of 128 arrangements, that is 1 in 8. If it is not special, exactly one player’s guess applies, and it is right. So the team wins **7 times out of 8**. No plan can do better: over all the arrangements a player guesses right as often as wrong, so the total of right guesses equals the total of wrong ones; winning arrangements contain at least one right guess and no wrong ones, losing arrangements at most seven wrong ones, so wins ≤ 7 × losses.',
      data: { answer: { num: 0.875, show: '7/8' }, ask: 'A fraction or a decimal.', traps: [{ match: 0.75, msg: 'That is the three-player answer. With seven players you can crowd all the wrong guesses into far fewer cases.' }, { match: 0.5, msg: 'Only a single player guessing gets half. A team that plans together can do better.' }], glyph: '7/8' },
      concepts: ['binary', 'probability', 'information'], links: ['bt-hats-three-together']
    },
    {
      id: 'bt-boxes-probability', title: 'The Boxes: What Are the Odds?', diff: 5,
      source: 'A puzzle traced to Peter Bro Miltersen (2003).',
      text: 'A hundred prisoners are numbered 1 to 100. A hundred boxes are numbered 1 to 100, each holding a slip with a different prisoner’s number, in random order. Each prisoner enters alone, opens **at most 50** boxes, and must find his own number. All go free if **every** prisoner succeeds; if one fails, all are lost.\n\nThe prisoners use the following plan. Prisoner *k* opens box *k* first; if the slip inside has number *m*, he opens box *m* next, and so on, until he finds his own number or has opened 50 boxes.\n\nTheir chance of freedom is the chance that a random shuffle of 100 numbers has **no cycle longer than 50**. What is it, to the nearest per cent?',
      hints: ['Following boxes traces a loop. A prisoner succeeds exactly when the loop he lies on has at most 50 boxes. So everybody succeeds when no loop has more than 50 boxes.', 'There can be at most one loop with more than 50 boxes. The chance of a loop of length exactly *k* (for *k* > 50) is 1/*k*. Add these chances for *k* = 51 to 100.'],
      explain: 'At most one loop can be longer than 50. For each *k* from 51 to 100, the chance that a random shuffle contains a loop of exactly *k* boxes is 1/*k*. So the chance of a long loop is 1/51 + 1/52 + … + 1/100 ≈ 0.688, and the chance that there is none is 1 − 0.688 ≈ **0.31**. That is about 31%: some 10³⁰ times better than random guessing, and it hardly gets worse for a thousand prisoners.',
      data: { answer: { num: 0.31, tol: 0.006 }, ask: 'As a percentage or a decimal, to the nearest per cent.', traps: [{ match: [0.5, 0.69], msg: 'The chance of a long loop is about 0.69, and that is the chance that they *fail*.' }], glyph: '31%' },
      concepts: ['probability', 'combinatorics'], links: ['bt-boxes-strategy']
    },
    {
      id: 'bt-truel', title: 'The Three-Way Duel', diff: 5,
      source: 'The “truel”, a three-way duel; it has been studied by mathematicians since at least the mid-twentieth century.',
      text: 'Three duellists stand at the corners of a triangle and will shoot in turn, **Ada, Ben, Cy, Ada, Ben, Cy …**, skipping anyone who has been killed, until only one is left alive. **Ada** hits her target one time in three. **Ben** hits two times in three. **Cy** never misses. Each wants only to survive, and each may shoot at either of the others, or fire into the air on purpose.\n\nAda shoots first. What should she do?',
      hints: ['If Ada kills Cy, she faces Ben, who shoots first at her. If Ada kills Ben, she faces Cy, who never misses. What if she does neither?', 'What will Ben do when it is his turn, if all three are alive? Whom is the greater danger to him?'],
      explain: 'Ada should fire into the air. If she shoots at Cy she survives only about 31% of the time, and if she aims at Ben only about 26%. If she deliberately misses, Ben must shoot next, and he will aim at Cy, the deadliest of the two others (Cy would aim at Ben in turn). If Ben kills Cy, Ada begins a duel with Ben and shoots first; if Ben misses, Cy kills Ben, and Ada gets the first shot at Cy. Adding it all up, Ada survives with chance 25/63, about **40%**, the best of the three choices, the weakest shot having the best odds. The duellist who is weakest is a smaller danger to the others, and that is her protection.',
      data: mc('Fire into the air on purpose', [['Shoot at Cy, who never misses', 'Then, about one time in three, she kills Cy and must face Ben, who shoots first and is a better shot: she survives only about 31% of the time in all.'], ['Shoot at Ben, the better of the two others who miss sometimes', 'If she hits Ben, Cy, who never misses, shoots next and she is dead. She survives only about 26% of the time in all.']], { figure: F.truel, glyph: '⚔' }),
      concepts: ['game-theory', 'probability', 'working-backwards'], links: ['bt-two-thirds']
    },
    {
      id: 'bt-sum-product', title: 'The Sum and the Product', diff: 5,
      year: 1969,
      source: 'Hans Freudenthal, in *Nieuw Archief voor Wiskunde* (1969); known ever since as the “impossible puzzle”.',
      text: 'Two different whole numbers, both greater than 1, are chosen, and their sum is at most 100. **Sam** is told only the **sum**, **Polly** is told only the **product**. Both know the rules above, both are perfectly logical, and each hears everything the other says.\n\n**Polly:** “I cannot tell what the two numbers are.”<br>**Sam:** “I knew that you couldn’t.”<br>**Polly:** “Now I know what they are.”<br>**Sam:** “Now I know too.”\n\nWhat are the two numbers?',
      hints: ['Polly’s first sentence: her product must be reachable in more than one way. For example, a product of two different primes could be made only one way. What does “I knew that you couldn’t” say about Sam’s sum? Try the sum 11: 2 + 9, 3 + 8, 4 + 7, 5 + 6.', 'Sam’s sentence says that every split of his sum gives an ambiguous product. That leaves only the sums 11, 17, 23, 27, 29, 35, 37, 41, 47 and 53.', 'Now Polly can decide: exactly one of the ways to write her product has a sum in that list. Then Sam, seeing that only one split of his sum is left, knows. Try the sums in the list, one at a time.'],
      explain: 'Polly’s first remark means that her product can be split in more than one way. Sam knew this, so **every** split of his sum has an ambiguous product; this leaves only the sums 11, 17, 23, 27, 29, 35, 37, 41, 47 and 53 (all odd, since every even sum up to 100 is a sum of two primes, whose product is unambiguous). Polly now knows: exactly one way of writing her product as *x* × *y* has a sum in this list. Finally Sam knows: exactly one of the splits of his sum yields a product that Polly could now solve. The only pair that works is **4 and 13**: the sum is 17 and the product is 52. It is a tour de force of reasoning about reasoning, and few solve it without a computer.',
      data: { answer: { nums: [4, 13] }, ask: 'The two numbers, separated by a comma.', traps: [{ match: ['2, 3', '2 3'], msg: 'Their product, 6, could only be 2 × 3, so Polly would know at once.' }], glyph: '+ ×' },
      concepts: ['deduction', 'common-knowledge'], links: ['bt-date-puzzle']
    },
    {
      id: 'bt-key-theorem', title: 'The Prisoners and the Board: Which Sizes?', diff: 5,
      source: 'A theorem about a well-known prisoner puzzle, proved by a short counting argument.',
      text: 'Two prisoners play against the jailer. The jailer lays out a board of **n squares**, puts a coin, heads or tails as he likes, on each, and hides a key under one square. Prisoner A sees the board and the key and must turn over **exactly one coin**. Prisoner B then sees the coins (but not the key) and points to a square. They win if he points to the key.\n\nThey may agree a plan beforehand. For which board sizes *n* can they be **sure** to win, whatever the jailer does?',
      hints: ['They can manage with 2, 4, 8, 64 squares by the binary trick. Does it work for 3? Try to count.', 'Suppose a plan exists. Let *S*(k) be the set of coin patterns that B reads as “key under square k”. From every pattern, A must be able to reach a pattern in each *S*(k) by turning exactly one coin. Count the pairs.'],
      explain: 'A plan means dividing all 2ⁿ coin patterns into *n* groups *S*(1), …, *S*(*n*) (the patterns B reads as each square), so that from **every** pattern one coin turn reaches every group: there are exactly *n* turns and *n* groups, so exactly one turn reaches each group. Count pairs (pattern, neighbour in *S*(k)): every pattern has exactly one such neighbour, giving 2ⁿ pairs; every member of *S*(k) has *n* neighbours, giving *n* × |*S*(k)| pairs. So *n* × |*S*(k)| = 2ⁿ, and *n* must divide 2ⁿ. That is possible only when *n* is a **power of two**. And for powers of two the binary plan does the job.',
      data: mc('Exactly when the number of squares is a power of two: 2, 4, 8, 16, 32, 64 …', [['For every number of squares at all, provided the prisoners agree a cunning code in advance', 'Try 3 squares: it cannot be done. A counting argument shows that n must divide 2ⁿ.'], ['Exactly when the number of squares is even, so that the coins can be paired off in twos', 'Six squares is even, but 6 does not divide 2⁶ = 64, so the counting argument rules it out.'], ['Only for the 64 squares of a chessboard, the size of the puzzle as it is usually told', 'The binary plan works for any power of two: 2, 4, 8, 16 and so on.']], { glyph: '2ⁿ' }),
      concepts: ['binary', 'parity', 'combinatorics'], links: ['bt-key-flip']
    },
    {
      id: 'bt-wine-two-rounds', title: 'The Poisoned Wine: Two Rounds', diff: 5,
      source: 'A variation of the well-known poisoned wine puzzle.',
      text: 'A wicked king has **1000 bottles** of wine, and **exactly one** is poisoned. Whoever drinks the poison dies in **exactly 24 hours**. This time the feast is in 48 hours, so there is room for **two rounds** of tasting: the first now, the second in 24 hours’ time. A taster may drink from any bottles in each round in which he is still alive (in the second round he may drink a different mixture), and his fate is known after 48 hours.\n\nWhat is the **fewest number of tasters** who can be sure to find the poisoned bottle?',
      hints: ['Each taster ends in one of several ways. How many? “Dead after 24 hours” is one.', 'A taster can be dead after 24 hours, dead after 48 hours, or alive at the end. That is three outcomes for each taster. How many patterns of outcomes can *n* tasters give?'],
      explain: 'Each taster ends in one of three ways: dead after 24 hours (he drank the poison in round 1), dead after 48 hours (he drank it in round 2) or alive. So *n* tasters give 3ⁿ patterns. Six tasters give 3⁶ = 729, too few for 1000 bottles; seven give 3⁷ = 2187, enough. And a plan exists: number the bottles in base three with seven digits, digit 0 = never drunk, 1 = drunk in round 1, 2 = drunk in round 2. The answer is **7**, and this holds however cleverly the second round is planned.',
      data: { answer: { num: 7 }, traps: [{ match: 10, msg: 'That is the answer with a single round of tasting. With two rounds each taster can show three different things, not two.' }, { match: 5, msg: 'Five tasters give only 3⁵ = 243 patterns.' }, { match: 6, msg: 'Six tasters give 3⁶ = 729 patterns, fewer than 1000.' }], glyph: '🍷🍷' },
      concepts: ['information', 'binary', 'combinatorics'], links: ['bt-wine-1000', 'bt-wine-8']
    },

  ].sort((a, b) => a.diff - b.diff));
})();
