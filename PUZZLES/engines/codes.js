/* The Puzzle Cabinet · engines/codes.js
 *
 * Codes and ciphers from Caesar's letters to Bacon's two typefaces. The coded
 * message is written on a card; under every symbol is a box for the letter it
 * stands for. Beside the card lies the code's own instrument — a cipher wheel
 * to turn, an alphabet to fold, a Polybius square, a pigpen key card, a Morse
 * tree with sound, a semaphore chart, rails to lay letters on, a Spartan rod to
 * wind a strip round, a Vigenère table, a book, a Braille chart, Bacon's table
 * — which helps you read without reading for you.
 *
 * data: {
 *   code: 'caesar' | 'atbash' | 'polybius' | 'pigpen' | 'morse' | 'semaphore' |
 *         'railfence' | 'scytale' | 'vigenere' | 'book' | 'braille' | 'bacon',
 *   msg:  'VENI VIDI VICI'          the plain message (letters, spaces, a little punctuation)
 *   key:  3 (Caesar shift) | 3 (rails) | 4 (letters round the rod) | 'LEMON' (Vigenère) | 'ZEBRA' (keyed Polybius square)
 *   show: false                     the key is not told (Caesar, rails, rod): find it
 *   riddle: 'What has keys…'        Vigenère: the keyword is the answer to this riddle
 *   card: true                      pigpen: the key card starts face up (else a hint turns it)
 *   chart: 'decade'                 Braille: only a–j are on the chart, with the rule for the rest
 *   torch: true                     Polybius: the digits are shown as torches, as Polybius described
 *   book: 'genesis', how: 'n' | 'lw' | 'lwl', mode: 'letter' | 'word', refs: [[12], …]   book codes
 *   ab: 'ab' | 'dots', cover: 'Dear Aunt…', subtle: true   Bacon: groups of a/b, or hidden in two typefaces
 * }
 * The cipher is always made from msg and key by js/lib/ciphers.js, so it cannot disagree with the answer.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const X = () => C.Ciphers;

  const NAMES = {
    caesar: 'Caesar shift', atbash: 'Atbash', polybius: 'Polybius square', pigpen: 'Pigpen',
    morse: 'Morse code', semaphore: 'Flag semaphore', railfence: 'Rail fence', scytale: 'Scytale',
    vigenere: 'Vigenère cipher', book: 'Book code', braille: 'Braille', bacon: 'Bacon\'s cipher'
  };

  // the key idea of each code: the first hint when the puzzle has none of its own
  function keyIdea(d) {
    switch (d.code) {
      case 'caesar': return d.show === false
        ? 'Every letter has been moved the same number of places along the alphabet. Turn the inner disc of the wheel until the short words make sense — a one-letter word is almost always A or I.'
        : 'Every letter has been moved **' + d.key + '** places along the alphabet. Turn the inner disc until code letter ' + X().AZ[d.key % 26] + ' sits under plain A, then read across.';
      case 'atbash': return 'The alphabet is folded in half: A and Z swap, B and Y, C and X, and so on. Fold the strip and read each letter against its partner.';
      case 'polybius': return 'Each pair of digits is a row and then a column of the square: 23 is row 2, column 3.';
      case 'pigpen': return 'Each symbol is the shape of the pen a letter sits in: the lines around its cell of the grid (or its wedge of the X), with a dot for the second grid.';
      case 'morse': return 'A dot is a short beep, a dash a long one. Start at the top of the tree and go left for a dot, right for a dash.';
      case 'semaphore': return 'Each figure spells one letter by the angle of its two flags. A–G keep one flag down while the other goes round; then H–N keep one flag low on the left.';
      case 'railfence': return d.show === false
        ? 'The message was written in a zigzag down and up some rails, and then read off rail by rail. Try 2 rails, then 3, then 4…'
        : 'The message was written in a zigzag on **' + d.key + '** rails and read off one rail at a time. Lay the letters back on the rails and follow the zigzag.';
      case 'scytale': return d.show === false
        ? 'The strip was wound round a rod and written on along its length. Try rods of different thickness until a row of letters reads as words, then turn the rod for the next row.'
        : 'Wind the strip round a rod **' + d.key + '** letters thick; the message runs along the rod. Read the row facing you, then turn the rod.';
      case 'vigenere': return 'Write the keyword over and over above the code letters. For each letter, go to the keyword letter\'s row of the table, find the code letter in that row, and read the plain letter at the top of its column.';
      case 'book': return d.mode === 'word' ? 'Each number is a word of the text on the card, counted from the start' + (d.how === 'lw' ? ' (line, then word in that line)' : '') + '.'
        : d.how === 'lwl' ? 'Each reference is line.word.letter: find the line, then the word in it, then the letter in the word.'
        : 'Each number is a word of the text on the card' + (d.how === 'lw' ? ' (line, then word in that line)' : ', counted from the start') + '; take its first letter.';
      case 'braille': return 'Each cell has six places for dots, three down on the left (1, 2, 3) and three on the right (4, 5, 6). The letters a to j use only the top four places; k to t add dot 3; u, v, x, y, z add dots 3 and 6.';
      case 'bacon': return d.cover
        ? 'Every letter of the innocent text is in one of two typefaces. Plain letters are *a*, the others *b*. Read them in fives: each group of five is one letter in Bacon\'s table.'
        : 'Each group of five is one letter: read it in Bacon\'s table. It is counting in binary with a for 0 and b for 1.';
      default: return '';
    }
  }

  // how it works, shown after solving when the puzzle has no explanation of its own
  function method(d) {
    const M = X().model(d);
    const s = '**' + NAMES[d.code] + '.** ';
    switch (d.code) {
      case 'caesar': return s + 'The shift was ' + d.key + ': each plain letter moved ' + d.key + ' places on (A → ' + X().AZ[d.key % 26] + '). There are only 25 shifts to try, which is why nobody has trusted this cipher for a very long time.';
      case 'atbash': return s + 'A ↔ Z, B ↔ Y, C ↔ X… The same step codes and decodes. It began as a Hebrew cipher: in the Book of Jeremiah, Sheshach stands for Babel.';
      case 'polybius': return s + 'The Greek historian Polybius described signalling letters with torches, by row and column of a table of letters. Two small numbers for each letter make it easy to tap, flash or knock.';
      case 'pigpen': return s + 'The pens of two noughts-and-crosses grids and two X shapes hold the alphabet. It looks mysterious but hides nothing from anyone who knows the grids.';
      case 'morse': return s + 'The commonest letters have the shortest codes (E is one dot, T one dash). Samuel Morse and Alfred Vail developed the code for the electric telegraph in the 1830s and 1840s.';
      case 'semaphore': return s + 'Two flags, held at eight possible angles, give enough pairs for the whole alphabet. It is read from a distance by eye, so it needs no wires at all.';
      case 'railfence': return s + 'On ' + d.key + ' rails the letters zigzag down and up; reading the rails one after another scrambles them. The letters stay the same — only their order changes, so it is a transposition cipher.';
      case 'scytale': return s + 'Round a rod ' + d.key + ' letters thick, the message was written in ' + d.key + ' rows along the rod. Unwound, the strip shows one letter of each row in turn. Plutarch describes the Spartans using this device.';
      case 'vigenere': return s + 'Keyword **' + X().letters(d.key) + '**: each keyword letter is a different Caesar shift, used in turn. First described by Giovan Battista Bellaso in 1553 and later credited to Blaise de Vigenère, it resisted attack for three centuries.';
      case 'book': return s + 'Only someone with the same text can read it — and the text can be any book both sides own.';
      case 'braille': return s + 'Louis Braille, blind from childhood, published his six-dot system in 1829. It is read by touch; the pattern of the first ten letters is repeated with extra dots for the rest.';
      case 'bacon': return s + (d.cover ? 'The message hides in plain sight: the text says one thing, the typefaces another. ' : '') + 'Francis Bacon described this two-letter alphabet in 1623 — five a/b choices give 32 patterns, enough for his 24 letters.';
      default: return M.err || '';
    }
  }

  /* ---------- glyphs: every symbol as SVG markup, with its size ---------- */

  const MORSE_DOT = 7, MORSE_DASH = 18, MORSE_GAP = 4;
  function morseWidth(m) {
    let w = 0;
    for (const c of m) w += (c === '.' ? MORSE_DOT : MORSE_DASH) + MORSE_GAP;
    return w - MORSE_GAP;
  }

  function glyphSize(code, g, d) {
    if (!g) return { w: 0, h: 0 };
    switch (code) {
      case 'caesar': case 'atbash': case 'vigenere': return { w: 30, h: 40 };
      case 'polybius': return d.torch ? { w: 44, h: 54 } : { w: 36, h: 40 };
      case 'pigpen': return { w: 32, h: 36 };
      case 'morse': return { w: Math.max(30, morseWidth(g.m) + 12), h: 26 };
      case 'semaphore': return { w: 46, h: 62 };
      case 'braille': return { w: 28, h: 42 };
      case 'bacon': return { w: 60, h: 22 };
      case 'book': return { w: Math.max(30, g.txt.length * 9 + 12), h: 24 };
      default: return { w: 30, h: 30 };
    }
  }

  const f1 = (v) => Math.round(v * 10) / 10;

  // pigpen: the pen a letter sits in, drawn in a box of side s at (x, y)
  function pigpenSVG(ch, x, y, s, cls) {
    const P = X().PIGPEN[ch];
    if (!P) return '';
    let d = '';
    let dot = null;
    if (P.g === 'sq') {
      const x1 = x + s, y1 = y + s;
      const segs = [];
      if (P.r > 0) segs.push([x, y, x1, y]);
      if (P.r < 2) segs.push([x, y1, x1, y1]);
      if (P.c > 0) segs.push([x, y, x, y1]);
      if (P.c < 2) segs.push([x1, y, x1, y1]);
      // join the lines into one path so the corners are neat
      d = segs.map((q) => 'M' + f1(q[0]) + ' ' + f1(q[1]) + 'L' + f1(q[2]) + ' ' + f1(q[3])).join('');
      dot = [x + s / 2, y + s / 2];
    } else {
      const m = s / 2;
      if (P.w === 'top') { d = 'M' + x + ' ' + y + 'L' + (x + m) + ' ' + (y + s) + 'L' + (x + s) + ' ' + y; dot = [x + m, y + s * 0.34]; }
      if (P.w === 'bottom') { d = 'M' + x + ' ' + (y + s) + 'L' + (x + m) + ' ' + y + 'L' + (x + s) + ' ' + (y + s); dot = [x + m, y + s * 0.66]; }
      if (P.w === 'left') { d = 'M' + x + ' ' + y + 'L' + (x + s) + ' ' + (y + m) + 'L' + x + ' ' + (y + s); dot = [x + s * 0.34, y + m]; }
      if (P.w === 'right') { d = 'M' + (x + s) + ' ' + y + 'L' + x + ' ' + (y + m) + 'L' + (x + s) + ' ' + (y + s); dot = [x + s * 0.66, y + m]; }
    }
    let out = '<path class="' + (cls || 'cx-pp') + '" d="' + d + '"/>';
    if (P.dot) out += '<circle class="cx-ppdot" cx="' + f1(dot[0]) + '" cy="' + f1(dot[1]) + '" r="' + f1(s * 0.1) + '"/>';
    return out;
  }

  // semaphore: a little signaller holding two flags; (cx, top) and a scale (1 = 62 high)
  function semaphoreSVG(pair, cx, top, sc, cls) {
    const S = X();
    const dirs = pair.split(' ');
    const ang = dirs.map((k) => S.DIR[k]);
    const vx = (a) => Math.sin(a * Math.PI / 180);
    // the arm reaching more to the left goes from the left shoulder
    const order = [0, 1].sort((i, j) => vx(ang[i]) - vx(ang[j]));
    const k = sc;
    const px = (v) => f1(cx + v * k), py = (v) => f1(top + v * k);
    let s = '<g class="' + (cls || 'cx-sem') + '">';
    // legs and body
    s += '<path class="cx-sem-body" d="M' + px(0) + ' ' + py(20) + 'L' + px(0) + ' ' + py(40) + 'M' + px(-7) + ' ' + py(58) + 'L' + px(0) + ' ' + py(40) + 'L' + px(7) + ' ' + py(58) + '"/>';
    s += '<circle class="cx-sem-head" cx="' + px(0) + '" cy="' + py(13) + '" r="' + f1(5.5 * k) + '"/>';
    order.forEach((i, n) => {
      const a = ang[i] * Math.PI / 180, ux = Math.sin(a), uy = -Math.cos(a);
      const sx = n === 0 ? -3.5 : 3.5, sy = 22;
      const hx = sx + ux * 17, hy = sy + uy * 17;           // the hand
      const ex = sx + ux * 27, ey = sy + uy * 27;           // the end of the stick
      s += '<path class="cx-sem-arm" d="M' + px(sx) + ' ' + py(sy) + 'L' + px(hx) + ' ' + py(hy) + '"/>';
      s += '<path class="cx-sem-stick" d="M' + px(hx) + ' ' + py(hy) + 'L' + px(ex) + ' ' + py(ey) + '"/>';
      // a square flag beside the end of the stick, split red and yellow on the diagonal
      const nx = -uy * (n === 0 ? -1 : 1), ny = ux * (n === 0 ? -1 : 1);
      const q0 = [ex, ey], q1 = [ex - ux * 9, ey - uy * 9], q2 = [q1[0] + nx * 9, q1[1] + ny * 9], q3 = [ex + nx * 9, ey + ny * 9];
      const P = (q) => px(q[0]) + ' ' + py(q[1]);
      s += '<path class="cx-flag-y" d="M' + P(q0) + 'L' + P(q1) + 'L' + P(q2) + 'Z"/>';
      s += '<path class="cx-flag-r" d="M' + P(q0) + 'L' + P(q2) + 'L' + P(q3) + 'Z"/>';
    });
    return s + '</g>';
  }

  // Braille: a cell of six places; raised dots are filled
  function brailleSVG(b, x, y, sc) {
    let s = '';
    const on = new Set(b.split(''));
    const pos = { 1: [0, 0], 2: [0, 1], 3: [0, 2], 4: [1, 0], 5: [1, 1], 6: [1, 2] };
    for (let n = 1; n <= 6; n++) {
      const p = pos[n], cx = f1(x + (7 + p[0] * 13) * sc), cy = f1(y + (8 + p[1] * 13) * sc);
      s += on.has(String(n)) ? '<circle class="cx-bd" cx="' + cx + '" cy="' + cy + '" r="' + f1(4.2 * sc) + '"/>'
        : '<circle class="cx-bd0" cx="' + cx + '" cy="' + cy + '" r="' + f1(1.7 * sc) + '"/>';
    }
    return s;
  }

  function morseSVG(m, x, cy) {
    let s = '', at = x;
    for (const c of m) {
      if (c === '.') { s += '<circle class="cx-md" cx="' + f1(at + MORSE_DOT / 2) + '" cy="' + cy + '" r="3.3"/>'; at += MORSE_DOT; }
      else { s += '<rect class="cx-md" x="' + f1(at) + '" y="' + (cy - 3) + '" width="' + MORSE_DASH + '" height="6" rx="3"/>'; at += MORSE_DASH; }
      at += MORSE_GAP;
    }
    return s;
  }

  function flameSVG(x, y) {
    return '<path class="cx-flame" d="M' + f1(x) + ' ' + f1(y) + 'c-3.4 3 -4.4 5.2 -2.6 7.6c1.2 1.6 4 1.6 5.2 0c1.8 -2.4 .8 -4.6 -2.6 -7.6z"/>' +
      '<path class="cx-torch" d="M' + f1(x - 1.2) + ' ' + f1(y + 8.6) + 'h2.4l-.6 2.6h-1.2z"/>';
  }

  // one symbol, drawn with its top-left corner at (0, 0)
  function glyphSVG(code, g, d) {
    const sz = glyphSize(code, g, d);
    const cx = sz.w / 2;
    switch (code) {
      case 'caesar': case 'atbash': case 'vigenere':
        return '<text class="cx-gl" x="' + cx + '" y="31" text-anchor="middle">' + g.ch + '</text>';
      case 'polybius':
        if (d.torch) {
          // two groups of torches behind a low wall: the left group counts the row, the right the column
          let s = '<path class="cx-wall" d="M' + cx + ' 2V52"/>';
          for (let i = 0; i < g.r; i++) s += flameSVG(cx - 11, 4 + i * 10);
          for (let i = 0; i < g.c; i++) s += flameSVG(cx + 11, 4 + i * 10);
          return s;
        }
        return '<text class="cx-gl cx-num" x="' + cx + '" y="30" text-anchor="middle">' + g.r + '<tspan dx="3">' + g.c + '</tspan></text>';
      case 'pigpen': return pigpenSVG(g.ch, cx - 12, 6, 24);
      case 'morse': return morseSVG(g.m, cx - morseWidth(g.m) / 2, 13);
      case 'semaphore': return semaphoreSVG(g.s, cx, 0, 1);
      case 'braille': return brailleSVG(g.b, cx - 13.5, 4, 1);
      case 'bacon':
        if (d.ab === 'dots') {
          let s = '';
          g.ab.split('').forEach((c, i) => { s += '<circle class="' + (c === 'B' ? 'cx-bb' : 'cx-ba') + '" cx="' + (cx - 20 + i * 10) + '" cy="11" r="3.8"/>'; });
          return s;
        }
        return '<text class="cx-ab" x="' + cx + '" y="16" text-anchor="middle">' + g.ab.toLowerCase() + '</text>';
      case 'book': return '<text class="cx-ref" x="' + cx + '" y="17" text-anchor="middle">' + g.txt + '</text>';
      default: return '';
    }
  }

  const SLOT_W = 28, SLOT_H = 36, UNIT_GAP = 5, WORD_GAP = 22;

  /* ---------- the instruments ----------
   * TOOLS[code] = { size(env) -> { w, h }, build(env, g) -> api }
   * api (all optional): down(pt, ev, el) -> true (handled) | 'drag' (capture), move(pt), up(pt),
   *   hover(pt, el), leave(), nudge(dir), setKey(key, animate), onSlot(i), destroy()
   * Anything with data-type="X" types the letter X when clicked; data-btn runs a button.
   * Points are in the tool's own coordinates. */

  const TOOLS = {};
  const polar = (cx, cy, r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  const angleOf = (cx, cy, p) => Math.atan2(p[0] - cx, -(p[1] - cy)) * 180 / Math.PI;

  /* Caesar: a cipher wheel. Plain letters on the fixed outer ring, code letters on the inner disc. */
  TOOLS.caesar = {
    size: () => ({ w: 340, h: 392 }),
    build(env, g) {
      const s = env.s, AZ = X().AZ, cx = 170, cy = 170, R1 = 162, R2 = 120, step = 360 / 26;
      let rot = 0, drag = null, hovered = -1;
      s('circle', { cx, cy, r: R1 + 4, class: 'cx-w-shadow' }, g);
      s('circle', { cx, cy, r: R1, class: 'cx-w-outer' }, g);
      const outer = [];
      for (let i = 0; i < 26; i++) {
        const a = i * step, p = polar(cx, cy, 142, a);
        const t = s('text', { x: f1(p[0]), y: f1(p[1] + 7), class: 'cx-w-o', 'text-anchor': 'middle', transform: 'rotate(' + f1(a) + ' ' + f1(p[0]) + ' ' + f1(p[1]) + ')', 'data-type': AZ[i], text: AZ[i] }, g);
        outer.push(t);
        const q0 = polar(cx, cy, R2 + 2, a + step / 2), q1 = polar(cx, cy, R1, a + step / 2);
        s('path', { d: 'M' + f1(q0[0]) + ' ' + f1(q0[1]) + 'L' + f1(q1[0]) + ' ' + f1(q1[1]), class: 'cx-w-tick' }, g);
      }
      const gi = s('g', { class: 'cx-w-disc' }, g);
      s('circle', { cx, cy, r: R2, class: 'cx-w-inner' }, gi);
      const inner = [];
      for (let j = 0; j < 26; j++) {
        const a = j * step, p = polar(cx, cy, 101, a);
        inner.push(s('text', { x: f1(p[0]), y: f1(p[1] + 7), class: 'cx-w-i', 'text-anchor': 'middle', transform: 'rotate(' + f1(a) + ' ' + f1(p[0]) + ' ' + f1(p[1]) + ')', text: AZ[j] }, gi));
        const q0 = polar(cx, cy, 46, a + step / 2), q1 = polar(cx, cy, R2 - 2, a + step / 2);
        s('path', { d: 'M' + f1(q0[0]) + ' ' + f1(q0[1]) + 'L' + f1(q1[0]) + ' ' + f1(q1[1]), class: 'cx-w-tick2' }, gi);
      }
      // a grip to show the disc can be turned
      for (let j = 0; j < 26; j += 2) { const p = polar(cx, cy, 62, j * step + step / 2); s('circle', { cx: f1(p[0]), cy: f1(p[1]), r: 2.2, class: 'cx-w-grip' }, gi); }
      s('circle', { cx, cy, r: 38, class: 'cx-w-hub' }, g);
      s('circle', { cx, cy, r: 5, class: 'cx-w-pin' }, g);
      const hubN = s('text', { x: cx, y: cy - 6, class: 'cx-w-hubn', 'text-anchor': 'middle', text: '+0' }, g);
      s('text', { x: cx, y: cy + 18, class: 'cx-w-hubl', 'text-anchor': 'middle', text: 'shift' }, g);
      s('text', { x: cx, y: 350, class: 'cx-cap', 'text-anchor': 'middle', text: 'outer ring: plain · inner disc: code · drag the disc to turn it' }, g);
      env.btn(g, cx - 96, 362, 44, 26, '◀', () => api.nudge(-1));
      env.btn(g, cx + 52, 362, 44, 26, '▶', () => api.nudge(1));
      const shift = () => X().mod(Math.round(rot / step), 26);
      function apply() {
        gi.setAttribute('transform', 'rotate(' + f1(-rot) + ' ' + cx + ' ' + cy + ')');
        hubN.textContent = '+' + shift();
        mark();
      }
      function mark() {
        const sh = shift();
        outer.forEach((t, i) => t.classList.toggle('hl', i === hovered));
        inner.forEach((t, j) => t.classList.toggle('hl', hovered >= 0 && j === X().mod(hovered + sh, 26)));
      }
      function snapTo(target, done) {
        const from = rot;
        env.anim(220, (t) => { rot = from + (target - from) * (1 - Math.pow(1 - t, 3)); apply(); }, () => { rot = target; apply(); if (done) done(); });
      }
      const api = {
        down(pt) {
          const r = Math.hypot(pt[0] - cx, pt[1] - cy);
          if (r > 38 && r < R2 + 2) { drag = { a0: angleOf(cx, cy, pt), rot0: rot }; return 'drag'; }
          return false;
        },
        move(pt) {
          if (!drag) return;
          let da = angleOf(cx, cy, pt) - drag.a0;
          while (da > 180) da -= 360;
          while (da < -180) da += 360;
          rot = drag.rot0 - da;
          apply();
        },
        up() {
          if (!drag) return;
          drag = null;
          snapTo(Math.round(rot / step) * step, () => env.sfx('tap'));
        },
        hover(pt) {
          let h = -1;
          const r = Math.hypot(pt[0] - cx, pt[1] - cy);
          if (r > 38 && r < R1) {
            const a = X().mod(angleOf(cx, cy, pt), 360);
            // over the inner disc, find the outer place of the code letter under the pointer
            h = r > R2 ? X().mod(Math.round(a / step), 26) : X().mod(Math.round(a / step), 26);
          }
          if (h !== hovered) { hovered = h; mark(); }
        },
        leave() { if (hovered >= 0) { hovered = -1; mark(); } },
        nudge(dir) { snapTo((Math.round(rot / step) + dir) * step, () => env.sfx('tap')); },
        setKey(k, animate) { const target = k * step; if (animate) snapTo(target); else { rot = target; apply(); } },
        shift
      };
      apply();
      return api;
    }
  };

  /* Atbash: the alphabet on a strip that folds in half, so A lies on Z. */
  TOOLS.atbash = {
    size: () => ({ w: 668, h: 172 }),
    build(env, g) {
      const s = env.s, AZ = X().AZ, CW = 24, x0 = 22, y0 = 26, H = 40, crease = x0 + 13 * CW, drop = 52;
      let folded = 0, busy = false, hovered = -1;
      s('text', { x: x0, y: 16, class: 'cx-cap', text: 'The alphabet on a paper strip' }, g);
      const left = s('g', null, g);
      const front = s('g', null, g);
      const back = s('g', { style: 'display:none' }, g);
      const cells = {};
      const cell = (parent, ch, x, y) => {
        const cg = s('g', { class: 'cx-ab-cell', 'data-type': ch }, parent);
        s('rect', { x, y, width: CW, height: H, class: 'cx-strip' }, cg);
        s('text', { x: x + CW / 2, y: y + 27, class: 'cx-strip-t', 'text-anchor': 'middle', text: ch }, cg);
        (cells[ch] = cells[ch] || []).push(cg);
        return cg;
      };
      for (let i = 0; i < 13; i++) cell(left, AZ[i], x0 + i * CW, y0);
      for (let i = 13; i < 26; i++) cell(front, AZ[i], x0 + i * CW, y0);
      for (let i = 0; i < 13; i++) cell(back, AZ[25 - i], x0 + i * CW, y0 + drop);
      const creaseL = s('path', { d: 'M' + crease + ' ' + (y0 - 6) + 'V' + (y0 + H + 6), class: 'cx-crease' }, g);
      const btn = env.btn(g, x0 + 13 * CW + 40, y0 + drop + 4, 150, 32, 'Fold in half', () => api.toggle());
      const cap = s('text', { x: x0, y: y0 + drop + H + 34, class: 'cx-cap', text: 'Fold the strip at the middle and each letter lies on its partner.' }, g);
      function place(t) {
        // t: 0 flat .. 1 folded; the right half turns over about the crease
        const c = Math.cos(Math.PI * t);
        if (t < 0.5) {
          front.style.display = ''; back.style.display = 'none';
          front.setAttribute('transform', 'translate(' + crease + ' ' + f1(drop * t) + ') scale(' + Math.max(0.001, c).toFixed(3) + ' 1) translate(' + (-crease) + ' 0)');
        } else {
          front.style.display = 'none'; back.style.display = '';
          back.setAttribute('transform', 'translate(' + crease + ' ' + f1(-drop * (1 - t)) + ') scale(' + Math.max(0.001, -c).toFixed(3) + ' 1) translate(' + (-crease) + ' 0)');
        }
      }
      function mark() {
        Object.keys(cells).forEach((ch) => cells[ch].forEach((cg) => cg.classList.remove('hl', 'hl2')));
        if (hovered < 0) return;
        (cells[AZ[hovered]] || []).forEach((cg) => cg.classList.add('hl'));
        if (folded) (cells[AZ[25 - hovered]] || []).forEach((cg) => cg.classList.add('hl2'));
      }
      const api = {
        toggle() {
          if (busy) return;
          busy = true;
          const from = folded, to = folded ? 0 : 1;
          env.sfx('fold');
          env.anim(650, (t) => place(from + (to - from) * (0.5 - Math.cos(Math.PI * t) / 2)), () => {
            folded = to; place(to); busy = false;
            btn.label(folded ? 'Unfold' : 'Fold in half');
            cap.textContent = folded ? 'Each letter now lies on its partner: A on Z, B on Y…' : 'Fold the strip at the middle and each letter lies on its partner.';
            creaseL.style.opacity = folded ? 0 : 1;
            mark();
          });
        },
        hover(pt, el) {
          const c = el && el.closest ? el.closest('[data-type]') : null;
          const h = c ? AZ.indexOf(c.getAttribute('data-type')) : -1;
          if (h !== hovered) { hovered = h; mark(); }
        },
        leave() { if (hovered >= 0) { hovered = -1; mark(); } },
        setKey() { if (!folded) api.toggle(); }
      };
      place(0);
      return api;
    }
  };

  /* Polybius: the 5 × 5 square with its row and column numbers. */
  TOOLS.polybius = {
    size: (env) => ({ w: 300, h: env.d.key ? 332 : 306 }),
    build(env, g) {
      const s = env.s, sq = X().polySquare(env.d.key || ''), CS = 46, x0 = 16 + CS, y0 = 12 + CS;
      const rowH = [], colH = [];
      s('rect', { x: x0 - CS + 4, y: y0 - CS + 4, width: CS * 6 - 8, height: CS * 6 - 8, rx: 10, class: 'cx-card' }, g);
      for (let k = 0; k < 5; k++) {
        colH.push(s('text', { x: x0 + k * CS + CS / 2, y: y0 - 14, class: 'cx-ps-h', 'text-anchor': 'middle', text: String(k + 1) }, g));
        rowH.push(s('text', { x: x0 - CS / 2 + 2, y: y0 + k * CS + CS / 2 + 7, class: 'cx-ps-h', 'text-anchor': 'middle', text: String(k + 1) }, g));
      }
      const band = s('g', null, g);
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
        const ch = sq[r * 5 + c];
        const cg = s('g', { class: 'cx-ps-cell', 'data-type': ch }, g);
        s('rect', { x: x0 + c * CS + 1, y: y0 + r * CS + 1, width: CS - 2, height: CS - 2, rx: 5 }, cg);
        s('text', { x: x0 + c * CS + CS / 2, y: y0 + r * CS + CS / 2 + 8, 'text-anchor': 'middle', text: ch === 'I' ? 'I/J' : ch, class: ch === 'I' ? 'small' : '' }, cg);
      }
      if (env.d.key) s('text', { x: 150, y: 324, class: 'cx-cap', 'text-anchor': 'middle', text: 'the square begins with the keyword ' + X().letters(env.d.key) }, g);
      let hov = null;
      function mark() {
        band.innerHTML = '';
        rowH.forEach((t, k) => t.classList.toggle('hl', !!hov && hov[0] === k));
        colH.forEach((t, k) => t.classList.toggle('hl', !!hov && hov[1] === k));
        if (!hov) return;
        s('rect', { x: x0, y: y0 + hov[0] * CS, width: CS * 5, height: CS, class: 'cx-band' }, band);
        s('rect', { x: x0 + hov[1] * CS, y: y0, width: CS, height: CS * 5, class: 'cx-band' }, band);
      }
      return {
        hover(pt) {
          const c = Math.floor((pt[0] - x0) / CS), r = Math.floor((pt[1] - y0) / CS);
          const h = r >= 0 && r < 5 && c >= 0 && c < 5 ? [r, c] : null;
          if (String(h) !== String(hov)) { hov = h; mark(); }
        },
        leave() { if (hov) { hov = null; mark(); } }
      };
    }
  };

  /* Pigpen: the key card, face down until a hint turns it (or face up in easy puzzles). */
  TOOLS.pigpen = {
    size: () => ({ w: 330, h: 350 }),
    build(env, g) {
      const s = env.s, W = 330, H = 320;
      const card = s('g', { class: 'cx-ppcard' }, g);
      const face = s('g', null, card), backS = s('g', null, card);
      s('rect', { x: 4, y: 4, width: W - 8, height: H - 8, rx: 14, class: 'cx-card' }, face);
      const grid = (ox, oy, letters, dot) => {
        const CS = 34;
        const gg = s('g', null, face);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
          const ch = letters[r * 3 + c];
          const cg = s('g', { class: 'cx-pk', 'data-type': ch }, gg);
          s('rect', { x: ox + c * CS, y: oy + r * CS, width: CS, height: CS, class: 'cx-pk-bg' }, cg);
          s('text', { x: ox + c * CS + (dot ? 13 : CS / 2), y: oy + r * CS + 23, 'text-anchor': 'middle', text: ch, class: 'cx-pk-t' }, cg);
          if (dot) s('circle', { cx: ox + c * CS + 25, cy: oy + r * CS + CS / 2, r: 3, class: 'cx-ppdot' }, cg);
        }
        s('path', { d: 'M' + (ox + CS) + ' ' + (oy - 4) + 'v' + (3 * CS + 8) + 'M' + (ox + 2 * CS) + ' ' + (oy - 4) + 'v' + (3 * CS + 8) +
          'M' + (ox - 4) + ' ' + (oy + CS) + 'h' + (3 * CS + 8) + 'M' + (ox - 4) + ' ' + (oy + 2 * CS) + 'h' + (3 * CS + 8), class: 'cx-pk-grid' }, gg);
      };
      const cross = (ox, oy, letters, dot) => {
        const Sx = 100, m = Sx / 2;
        const gg = s('g', null, face);
        const wedge = [[[ox, oy], [ox + m, oy + m], [ox + Sx, oy]], [[ox, oy], [ox + m, oy + m], [ox, oy + Sx]], [[ox + Sx, oy], [ox + m, oy + m], [ox + Sx, oy + Sx]], [[ox, oy + Sx], [ox + m, oy + m], [ox + Sx, oy + Sx]]];
        const at = [[ox + m, oy + 24], [ox + 20, oy + m + 7], [ox + Sx - 20, oy + m + 7], [ox + m, oy + Sx - 12]];
        letters.split('').forEach((ch, i) => {
          const cg = s('g', { class: 'cx-pk', 'data-type': ch }, gg);
          s('path', { d: C.pathOf(wedge[i]), class: 'cx-pk-bg' }, cg);
          s('text', { x: at[i][0] - (dot ? 5 : 0), y: at[i][1], 'text-anchor': 'middle', text: ch, class: 'cx-pk-t' }, cg);
          if (dot) s('circle', { cx: at[i][0] + 8, cy: at[i][1] - 6, r: 3, class: 'cx-ppdot' }, cg);
        });
        s('path', { d: 'M' + ox + ' ' + oy + 'L' + (ox + Sx) + ' ' + (oy + Sx) + 'M' + (ox + Sx) + ' ' + oy + 'L' + ox + ' ' + (oy + Sx), class: 'cx-pk-grid' }, gg);
      };
      grid(30, 36, 'ABCDEFGHI', false);
      grid(190, 36, 'JKLMNOPQR', true);
      cross(32, 184, 'STUV', false);
      cross(192, 184, 'WXYZ', true);
      s('text', { x: W / 2, y: H - 16, class: 'cx-cap', 'text-anchor': 'middle', text: 'each letter is drawn as the lines round its pen' }, face);
      // the back of the card
      s('rect', { x: 4, y: 4, width: W - 8, height: H - 8, rx: 14, class: 'cx-cardback' }, backS);
      for (let k = 0; k < 8; k++) s('path', { d: 'M' + (46 + k * 34) + ' 26v268', class: 'cx-cardback-l' }, backS);
      s('text', { x: W / 2, y: H / 2 + 10, class: 'cx-cardback-q', 'text-anchor': 'middle', text: '#' }, backS);
      s('text', { x: W / 2, y: H / 2 + 50, class: 'cx-cardback-t', 'text-anchor': 'middle', text: 'the key card' }, backS);
      const note = s('text', { x: W / 2, y: H + 22, class: 'cx-cap', 'text-anchor': 'middle', text: '' }, g);
      let up = !!env.cardUp();
      function show(anim) {
        const done = () => {
          face.style.display = up ? '' : 'none'; backS.style.display = up ? 'none' : '';
          card.removeAttribute('transform');
          note.textContent = up ? 'click a letter on the card to write it' : 'ask for a hint (?) to turn the card over';
        };
        if (!anim) { done(); return; }
        env.sfx('fold');
        env.anim(520, (t) => {
          const c = Math.cos(Math.PI * t);
          face.style.display = (t < 0.5 ? !up : up) ? '' : 'none';
          backS.style.display = (t < 0.5 ? up : !up) ? '' : 'none';
          card.setAttribute('transform', 'translate(' + W / 2 + ' 0) scale(' + Math.max(0.01, Math.abs(c)).toFixed(3) + ' 1) translate(' + (-W / 2) + ' 0)');
        }, done);
      }
      show(false);
      return {
        down(pt) {
          if (!up && pt[1] < H && pt[0] > 0 && pt[0] < W) { env.toast('The card is face down: ask for a hint (?) to turn it over.'); return true; }
          return false;
        },
        refresh(anim) { const now = !!env.cardUp(); if (now !== up) { up = now; show(anim); } },
        setKey() { if (!up) { up = true; show(true); } }
      };
    }
  };

  /* Morse: the dichotomic tree — left for a dot, right for a dash — and a lamp that flashes when it plays. */
  const MORSE_TREE = (() => {
    // node for every code up to four symbols; letters where there is one
    const nodes = [];
    const walk = (code, lvl, k) => {
      nodes.push({ code, lvl, k, ch: code ? (X().MORSE_BACK[code] || '') : '' });
      if (lvl < 4) { walk(code + '.', lvl + 1, k * 2); walk(code + '-', lvl + 1, k * 2 + 1); }
    };
    return { nodes, walk };
  })();
  TOOLS.morse = {
    size: () => ({ w: 560, h: 356 }),
    build(env, g) {
      const s = env.s, W = 560, top = 58, LV = 64;
      if (!MORSE_TREE.nodes.length) MORSE_TREE.walk('', 0, 0);
      const pos = (n) => [W * (n.k + 0.5) / Math.pow(2, n.lvl), top + n.lvl * LV];
      const byCode = {};
      MORSE_TREE.nodes.forEach((n) => { byCode[n.code] = n; });
      const edges = s('g', null, g), hl = s('g', null, g), dots = s('g', null, g);
      s('text', { x: 16, y: 20, class: 'cx-cap', text: '· go left      – go right' }, g);
      const lamp = s('circle', { cx: W - 30, cy: 22, r: 12, class: 'cx-lamp' }, g);
      s('text', { x: W - 50, y: 27, class: 'cx-cap', 'text-anchor': 'end', text: 'lamp' }, g);
      MORSE_TREE.nodes.forEach((n) => {
        if (!n.code) return;
        const parent = byCode[n.code.slice(0, -1)];
        const a = pos(parent), b = pos(n);
        s('path', { d: 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]), class: 'cx-mt-e ' + (n.code.slice(-1) === '.' ? 'dot' : 'dash') }, edges);
      });
      const els = {};
      MORSE_TREE.nodes.forEach((n) => {
        const p = pos(n);
        if (!n.code) {
          const cg = s('g', { class: 'cx-mt-n root' }, dots);
          s('circle', { cx: p[0], cy: p[1], r: 16 }, cg);
          s('text', { x: p[0], y: p[1] + 5, 'text-anchor': 'middle', text: 'start', class: 'small' }, cg);
          els[''] = cg;
          return;
        }
        if (!n.ch) { els[n.code] = s('circle', { cx: p[0], cy: p[1], r: 3, class: 'cx-mt-x' }, dots); return; }
        const cg = s('g', { class: 'cx-mt-n', 'data-type': n.ch, 'data-code': n.code }, dots);
        s('circle', { cx: p[0], cy: p[1], r: n.lvl === 4 ? 13 : 15 }, cg);
        s('text', { x: p[0], y: p[1] + 6, 'text-anchor': 'middle', text: n.ch }, cg);
        els[n.code] = cg;
      });
      const codeT = s('text', { x: W / 2, y: top + 4 * LV + 44, class: 'cx-mt-code', 'text-anchor': 'middle', text: '' }, g);
      let cur = null;
      function trace(code) {
        hl.innerHTML = '';
        Object.keys(els).forEach((k) => els[k].classList && els[k].classList.remove('on'));
        codeT.textContent = code ? code.replace(/\./g, '·').replace(/-/g, '–').split('').join(' ') + '   =   ' + (X().MORSE_BACK[code] || '') : '';
        if (!code) return;
        let prev = '';
        for (let i = 1; i <= code.length; i++) {
          const c = code.slice(0, i), a = pos(byCode[prev]), b = pos(byCode[c]);
          s('path', { d: 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]), class: 'cx-mt-hl' }, hl);
          prev = c;
        }
        if (els[code] && els[code].classList) els[code].classList.add('on');
      }
      return {
        hover(pt, el) {
          const c = el && el.closest ? el.closest('[data-code]') : null;
          const code = c ? c.getAttribute('data-code') : null;
          if (code !== cur) { cur = code; trace(code); }
        },
        leave() { if (cur) { cur = null; trace(null); } },
        lamp(on) { lamp.classList.toggle('on', !!on); }
      };
    }
  };

  /* Semaphore: the chart of all 26 letters. */
  TOOLS.semaphore = {
    size: () => ({ w: 458, h: 392 }),
    build(env, g) {
      const s = env.s, AZ = X().AZ, CW = 64, CH = 94, cols = 7;
      s('rect', { x: 2, y: 2, width: cols * CW + 12, height: 4 * CH + 12, rx: 12, class: 'cx-card' }, g);
      for (let i = 0; i < 26; i++) {
        const r = Math.floor(i / cols), c = i % cols;
        const x = 8 + c * CW, y = 8 + r * CH;
        const cg = s('g', { class: 'cx-sc', 'data-type': AZ[i] }, g);
        s('rect', { x: x + 1, y: y + 1, width: CW - 2, height: CH - 2, rx: 8, class: 'cx-sc-bg' }, cg);
        const pic = s('g', null, cg);
        pic.innerHTML = semaphoreSVG(X().SEMA[AZ[i]], x + CW / 2, y + 6, 0.98);
        s('text', { x: x + CW / 2, y: y + CH - 10, 'text-anchor': 'middle', class: 'cx-sc-t', text: AZ[i] }, cg);
      }
      return {};
    }
  };

  /* The rail fence: lay the code letters back on the rails, then read the zigzag. */
  TOOLS.railfence = {
    size(env) {
      const n = env.M.cipher.length, RM = Math.max(6, (env.d.key | 0) + 1);
      return { w: Math.max(420, n * 22 + 40), h: 84 + RM * 26 + 64 };
    },
    build(env, g) {
      const s = env.s, text = env.M.cipher, n = text.length, CW = 22, x0 = 20;
      const RM = Math.max(6, (env.d.key | 0) + 1), top = 84, RH = 26;
      let rails = env.d.show === false ? 2 : env.d.key | 0, laid = false, busy = false;
      const used = new Set();
      s('text', { x: x0, y: 16, class: 'cx-cap', text: 'The code, as it arrived:' }, g);
      const stripG = s('g', null, g);
      const tiles = [];
      for (let i = 0; i < n; i++) {
        const tg = s('g', { class: 'cx-tile' }, stripG);
        s('rect', { x: x0 + i * CW + 1, y: 24, width: CW - 2, height: 30, rx: 4 }, tg);
        s('text', { x: x0 + i * CW + CW / 2, y: 45, 'text-anchor': 'middle', text: text[i] }, tg);
        tiles.push(tg);
      }
      const railsG = s('g', null, g), zig = s('g', null, g), cellsG = s('g', null, g), flyG = s('g', null, g);
      const ctrlY = top + RM * RH + 18;
      const lab = s('text', { x: x0 + 118, y: ctrlY + 21, class: 'cx-ctl', 'text-anchor': 'middle', text: '' }, g);
      env.btn(g, x0, ctrlY, 40, 30, '−', () => setRails(rails - 1));
      env.btn(g, x0 + 196, ctrlY, 40, 30, '+', () => setRails(rails + 1));
      const layBtn = env.btn(g, x0 + 250, ctrlY, 170, 30, 'Lay the letters', () => { if (laid) clear(); else lay(true); }, 'gold');
      let cellEls = [];
      function positions(r) {
        // the zigzag place of every position, and the order the rails are read in
        const order = [];
        for (let k = 0; k < r; k++) for (let i = 0; i < n; i++) if (X().railOf(i, r) === k) order.push(i);
        return order;
      }
      function draw() {
        railsG.innerHTML = ''; zig.innerHTML = ''; cellsG.innerHTML = '';
        lab.textContent = rails + ' rails';
        for (let k = 0; k < rails; k++) {
          s('path', { d: 'M' + (x0 - 8) + ' ' + (top + k * RH + RH / 2) + 'H' + (x0 + n * CW + 8), class: 'cx-rail' }, railsG);
        }
        let d = '';
        for (let i = 0; i < n; i++) d += (i ? 'L' : 'M') + (x0 + i * CW + CW / 2) + ' ' + (top + X().railOf(i, rails) * RH + RH / 2);
        s('path', { d, class: 'cx-zig' }, zig);
        cellEls = [];
        const order = positions(rails), at = new Array(n);
        order.forEach((pos, j) => { at[pos] = j; });
        for (let i = 0; i < n; i++) {
          const k = X().railOf(i, rails), x = x0 + i * CW, y = top + k * RH;
          const ch = laid ? text[at[i]] : '';
          const cg = s('g', { class: 'cx-rc' + (laid ? ' laid' : '') + (used.has(i) ? ' used' : ''), 'data-rpos': i }, cellsG);
          if (laid) cg.setAttribute('data-type', ch);
          s('rect', { x: x + 2, y: y + 2, width: CW - 4, height: RH - 4, rx: 4 }, cg);
          if (laid) s('text', { x: x + CW / 2, y: y + RH / 2 + 6, 'text-anchor': 'middle', text: ch }, cg);
          cellEls.push(cg);
        }
      }
      function setRails(r) {
        r = Math.max(2, Math.min(Math.min(RM, n - 1), r));
        if (r === rails || busy) return;
        rails = r; laid = false; used.clear(); layBtn.label('Lay the letters');
        env.sfx('tap');
        draw();
      }
      function clear() { laid = false; used.clear(); layBtn.label('Lay the letters'); draw(); }
      function lay(anim) {
        if (busy) return;
        const order = positions(rails);
        if (!anim) { laid = true; layBtn.label('Take them off'); draw(); return; }
        busy = true;
        env.sfx('snap');
        // each code letter flies from the strip to its place, rail by rail
        flyG.innerHTML = '';
        const fl = order.map((pos, j) => {
          const t = s('text', { x: x0 + j * CW + CW / 2, y: 45, class: 'cx-fly', 'text-anchor': 'middle', text: text[j] }, flyG);
          return { t, from: [x0 + j * CW + CW / 2, 45], to: [x0 + pos * CW + CW / 2, top + X().railOf(pos, rails) * RH + RH / 2 + 6] };
        });
        env.anim(900, (t) => {
          fl.forEach((f, j) => {
            const u = Math.max(0, Math.min(1, t * 1.6 - j / n * 0.6));
            const e = u * u * (3 - 2 * u);
            f.t.setAttribute('x', f1(f.from[0] + (f.to[0] - f.from[0]) * e));
            f.t.setAttribute('y', f1(f.from[1] + (f.to[1] - f.from[1]) * e - Math.sin(Math.PI * e) * 18));
          });
        }, () => { flyG.innerHTML = ''; busy = false; laid = true; layBtn.label('Take them off'); draw(); });
      }
      draw();
      return {
        down(pt, ev, el) {
          const c = el && el.closest ? el.closest('[data-rpos]') : null;
          if (!c || !laid) return false;
          const i = +c.getAttribute('data-rpos');
          env.type(c.getAttribute('data-type'));
          used.add(i);
          c.classList.add('used');
          return true;
        },
        nudge(dir) { setRails(rails + dir); },
        setKey(k) { rails = k; used.clear(); lay(false); }
      };
    }
  };

  /* The scytale: a rod with the strip wound round it. Change its thickness, turn it, read along it. */
  TOOLS.scytale = {
    size(env) {
      const n = env.M.cipher.length;
      return { w: Math.max(460, Math.ceil(n / 2) * 34 + 130, Math.min(n, 36) * 20 + 40), h: (n > 36 ? 100 : 72) + 150 + 76 };
    },
    build(env, g) {
      const s = env.s, text = env.M.cipher, n = text.length, x0 = 50, R = 58, pitch = 34;
      const stripRows = n > 36 ? 2 : 1, per = Math.ceil(n / stripRows);
      const cy = (stripRows > 1 ? 100 : 72) + 76;
      let k = env.d.show === false ? 2 : env.d.key | 0, phi = 0, drag = null;
      s('text', { x: 20, y: 16, class: 'cx-cap', text: 'The strip, unwound:' }, g);
      for (let i = 0; i < n; i++) {
        const r = Math.floor(i / per), c = i % per;
        const tg = s('g', { class: 'cx-tile small' }, g);
        s('rect', { x: 20 + c * 20 + 1, y: 24 + r * 30, width: 18, height: 26, rx: 3 }, tg);
        s('text', { x: 20 + c * 20 + 10, y: 42 + r * 30, 'text-anchor': 'middle', text: text[i] }, tg);
      }
      const defs = s('defs', null, g);
      const gid = 'cxrod' + Math.floor(Math.random() * 1e9);
      defs.innerHTML = '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b3a1a"/><stop offset=".45" stop-color="#c99156"/><stop offset=".6" stop-color="#b07a42"/><stop offset="1" stop-color="#4a2e12"/></linearGradient>' +
        '<linearGradient id="' + gid + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".65" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>';
      const rodG = s('g', { class: 'cx-rod' }, g);
      const ctrlY = cy + R + 28;
      const lab = s('text', { x: 20 + 118, y: ctrlY + 21, class: 'cx-ctl', 'text-anchor': 'middle', text: '' }, g);
      env.btn(g, 20, ctrlY, 40, 30, '−', () => setK(k - 1));
      env.btn(g, 20 + 196, ctrlY, 40, 30, '+', () => setK(k + 1));
      env.btn(g, 270, ctrlY, 44, 30, '▲', () => turn(1));
      env.btn(g, 320, ctrlY, 44, 30, '▼', () => turn(-1));
      s('text', { x: 374, y: ctrlY + 20, class: 'cx-cap', text: 'turn (or drag the rod up and down)' }, g);
      const front = [];
      function draw() {
        rodG.innerHTML = '';
        lab.textContent = k + ' letters round';
        const m = Math.ceil(n / k), L = m * pitch + pitch;
        s('rect', { x: x0 - 16, y: cy - R, width: L + 32, height: 2 * R, rx: 6, fill: 'url(#' + gid + ')' }, rodG);
        s('ellipse', { cx: x0 + L + 16, cy, rx: 10, ry: R, class: 'cx-rod-end' }, rodG);
        // the wound strip: for each turn, the part facing us
        const band = s('g', null, rodG), let_ = s('g', null, rodG);
        front.length = 0;
        const th = (u) => 2 * Math.PI * (u - phi) / k;           // angle of strip position u (in letters)
        const xOf = (u) => x0 + pitch * (u / k) + pitch / 2;
        // every stretch of strip that faces us: a quarter turn either side of each place where it crosses the front
        for (let j = Math.floor((-0.5 - phi) / k) - 1; j <= Math.ceil((n - phi) / k) + 1; j++) {
          const uc = phi + j * k, ua = Math.max(-0.5, uc - k / 4), ub = Math.min(n - 0.5, uc + k / 4);
          if (ub <= ua) continue;
          const L2 = [], R2 = [];
          for (let q = 0; q <= 32; q++) {
            const u = ua + (ub - ua) * q / 32, a = th(u);
            const y = cy + R * Math.sin(a), x = xOf(u);
            L2.push([x - pitch / 2 + 1.5, y]); R2.push([x + pitch / 2 - 1.5, y]);
          }
          s('path', { d: C.pathOf(L2.concat(R2.reverse())), class: 'cx-band-strip' }, band);
        }
        for (let i = 0; i < n; i++) {
          const a = th(i), c = Math.cos(a);
          if (c < 0.12) continue;
          const y = cy + R * Math.sin(a), x = xOf(i);
          const sc = 0.55 + 0.45 * c;
          const isFront = Math.abs(Math.atan2(Math.sin(a), c)) < Math.PI / k * 0.999;
          const tg = s('text', { x: f1(x), y: f1(y + 7 * c), 'text-anchor': 'middle', class: 'cx-rod-t' + (isFront ? ' front' : ''),
            transform: 'translate(' + f1(x) + ' ' + f1(y) + ') scale(1 ' + c.toFixed(3) + ') translate(' + f1(-x) + ' ' + f1(-y) + ')',
            style: 'font-size:' + (22 * sc).toFixed(1) + 'px;opacity:' + Math.pow(c, 0.6).toFixed(2), text: text[i] }, let_);
          if (isFront) { tg.setAttribute('data-type', text[i]); front.push(tg); }
        }
        s('rect', { x: x0 - 16, y: cy - R, width: L + 32, height: 2 * R, rx: 6, fill: 'url(#' + gid + 's)', 'pointer-events': 'none' }, rodG);
        s('path', { d: 'M' + (x0 - 24) + ' ' + cy + 'h8M' + (x0 + L + 30) + ' ' + cy + 'h8', class: 'cx-rod-mark' }, rodG);
      }
      function animPhi(target, done) {
        const from = phi;
        env.anim(260, (t) => { phi = from + (target - from) * (1 - Math.pow(1 - t, 3)); draw(); }, () => { phi = X().mod(Math.round(target), k); draw(); if (done) done(); });
      }
      function setK(v) {
        v = Math.max(2, Math.min(Math.min(12, n - 1), v));
        if (v === k) return;
        k = v; phi = 0;
        env.sfx('tap');
        draw();
      }
      function turn(dir) { animPhi(Math.round(phi) + dir, () => env.sfx('tap')); }
      draw();
      return {
        down(pt, ev, el) {
          if (pt[1] > cy - R && pt[1] < cy + R && pt[0] > x0 - 16 && pt[0] < x0 + Math.ceil(n / k) * pitch + pitch + 26) {
            drag = { y0: pt[1], phi0: phi, moved: false, el };
            return 'drag';
          }
          return false;
        },
        move(pt) {
          if (!drag) return;
          const dy = pt[1] - drag.y0;
          if (Math.abs(dy) > 3) drag.moved = true;
          if (!drag.moved) return;
          phi = drag.phi0 - dy / (2 * Math.PI * R) * k * 1.4;
          draw();
        },
        up() {
          if (!drag) return;
          const dr = drag;
          drag = null;
          if (!dr.moved) {
            // a click on a front letter writes it
            const t = dr.el && dr.el.closest ? dr.el.closest('[data-type]') : null;
            if (t) env.type(t.getAttribute('data-type'));
            return;
          }
          animPhi(Math.round(phi), () => env.sfx('tap'));
        },
        nudge(dir) { turn(dir); },
        setKey(v) { k = v; phi = 0; draw(); }
      };
    }
  };

  /* Vigenère: the tabula recta. Key letters down the side, plain letters along the top. */
  TOOLS.vigenere = {
    size: () => ({ w: 436, h: 462 }),
    build(env, g) {
      const s = env.s, AZ = X().AZ, CS = 15.5, x0 = 30, y0 = 50;
      s('rect', { x: 2, y: 2, width: 432, height: 458, rx: 12, class: 'cx-card' }, g);
      s('text', { x: x0 + 13 * CS, y: 20, class: 'cx-cap', 'text-anchor': 'middle', text: 'plain letter ↓   ·   key letter →   ·   code letter inside' }, g);
      const bands = s('g', null, g);
      const tx = s('g', { class: 'cx-tr' }, g);
      const colH = [], rowH = [];
      for (let c = 0; c < 26; c++) {
        colH.push(s('text', { x: f1(x0 + c * CS + CS / 2), y: y0 - 8, 'text-anchor': 'middle', class: 'cx-tr-h', 'data-type': AZ[c], text: AZ[c] }, g));
        rowH.push(s('text', { x: x0 - 10, y: f1(y0 + c * CS + CS - 3.5), 'text-anchor': 'middle', class: 'cx-tr-h', text: AZ[c] }, g));
      }
      let html = '';
      for (let r = 0; r < 26; r++) for (let c = 0; c < 26; c++) {
        html += '<text x="' + f1(x0 + c * CS + CS / 2) + '" y="' + f1(y0 + r * CS + CS - 3.5) + '" text-anchor="middle">' + AZ[(r + c) % 26] + '</text>';
      }
      tx.innerHTML = html;
      const keyBand = s('rect', { x: x0 - 20, y: 0, width: 26 * CS + 20, height: CS, class: 'cx-keyband', style: 'display:none' }, bands);
      const hRow = s('rect', { x: x0 - 20, y: 0, width: 26 * CS + 20, height: CS, class: 'cx-band', style: 'display:none' }, bands);
      const hCol = s('rect', { x: 0, y: y0 - 22, width: CS, height: 26 * CS + 22, class: 'cx-band', style: 'display:none' }, bands);
      const cellHL = s('rect', { x: 0, y: 0, width: CS, height: CS, rx: 3, class: 'cx-tr-cell', style: 'display:none' }, bands);
      s('text', { x: x0 + 13 * CS, y: y0 + 26 * CS + 22, class: 'cx-cap', 'text-anchor': 'middle', text: 'click a letter in the table to write the plain letter above it' }, g);
      let hov = null, keyRow = -1;
      function mark() {
        rowH.forEach((t, r) => t.classList.toggle('hl', (!!hov && hov[0] === r) || r === keyRow));
        colH.forEach((t, c) => t.classList.toggle('hl', !!hov && hov[1] === c));
        keyBand.style.display = keyRow >= 0 ? '' : 'none';
        if (keyRow >= 0) keyBand.setAttribute('y', f1(y0 + keyRow * CS));
        if (!hov) { hRow.style.display = hCol.style.display = cellHL.style.display = 'none'; return; }
        hRow.style.display = hCol.style.display = cellHL.style.display = '';
        hRow.setAttribute('y', f1(y0 + hov[0] * CS));
        hCol.setAttribute('x', f1(x0 + hov[1] * CS));
        cellHL.setAttribute('x', f1(x0 + hov[1] * CS)); cellHL.setAttribute('y', f1(y0 + hov[0] * CS));
      }
      const at = (pt) => {
        const c = Math.floor((pt[0] - x0) / CS), r = Math.floor((pt[1] - y0) / CS);
        return r >= 0 && r < 26 && c >= 0 && c < 26 ? [r, c] : null;
      };
      return {
        hover(pt) { const h = at(pt); if (String(h) !== String(hov)) { hov = h; mark(); } },
        leave() { if (hov) { hov = null; mark(); } },
        down(pt) { const h = at(pt); if (!h) return false; env.type(AZ[h[1]]); return true; },
        onSlot(i) { const k = env.keyAt(i); keyRow = k ? AZ.indexOf(k) : -1; mark(); }
      };
    }
  };

  /* Book codes: the text on a card. Hover a word to see its number; click it to write. */
  function bookLayout(d) {
    const B = X().BOOKS[d.book];
    const maxC = Math.max(...B.lines.map((l) => l.length));
    return { B, w: Math.max(360, Math.round(maxC * 8.9) + (d.how === 'n' ? 50 : 76)), lineH: d.how === 'n' ? 34 : 30 };
  }
  TOOLS.book = {
    size(env) { const L = bookLayout(env.d); return { w: L.w, h: 70 + L.B.lines.length * L.lineH + 40 }; },
    build(env, g) {
      const s = env.s, d = env.d, L = bookLayout(d), B = L.B, how = d.how || 'n';
      const W = X().bookWords(d.book);
      const x0 = how === 'n' ? 26 : 50, y0 = 70;
      s('rect', { x: 2, y: 2, width: L.w - 4, height: y0 + B.lines.length * L.lineH + 14, rx: 10, class: 'cx-bookcard' }, g);
      s('text', { x: x0, y: 32, class: 'cx-book-title', text: B.title }, g);
      s('text', { x: x0, y: 52, class: 'cx-book-by', text: B.by }, g);
      const badges = s('g', { class: 'cx-badges' }, g);
      const numsG = s('g', { class: 'cx-wnums' }, g);
      const wordEls = [];
      let wi = 0;
      B.lines.forEach((ln, li) => {
        const y = y0 + li * L.lineH + 20;
        if (how !== 'n') s('text', { x: x0 - 14, y, class: 'cx-book-ln', 'text-anchor': 'end', text: String(li + 1) }, g);
        const t = s('text', { x: x0, y, class: 'cx-book-t' }, g);
        ln.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok) || !/[A-Za-z]/.test(tok)) { t.appendChild(root.document.createTextNode(tok)); return; }
          const w = W[wi++];
          const ts = s('tspan', { class: 'cx-bw', 'data-wi': wi - 1 }, t);
          if (d.mode === 'word') ts.setAttribute('data-word', w.w);
          else if (how !== 'lwl') ts.setAttribute('data-type', w.w[0]);
          if (how === 'lwl') {
            let k = 0;
            tok.split('').forEach((ch) => {
              if (/[A-Za-z]/.test(ch)) { s('tspan', { class: 'cx-bl', 'data-type': ch.toUpperCase(), 'data-li': ++k, text: ch }, ts); }
              else ts.appendChild(root.document.createTextNode(ch));
            });
          } else ts.textContent = tok;
          wordEls.push(ts);
        });
      });
      s('text', { x: L.w / 2, y: y0 + B.lines.length * L.lineH + 34, class: 'cx-cap', 'text-anchor': 'middle',
        text: how === 'lwl' ? 'hover a letter for its line.word.letter · click to write it' : d.mode === 'word' ? 'hover a word for its number · click it to write the word' : 'hover a word for its number · click it to write its first letter' }, g);
      const refOf = (w, li) => (how === 'n' ? String(w.n) : how === 'lw' ? w.line + '.' + w.word : w.line + '.' + w.word + '.' + li);
      let hovEl = null;
      function badge(el) {
        badges.innerHTML = '';
        if (!el) return;
        const wEl = el.closest('[data-wi]');
        const w = W[+wEl.getAttribute('data-wi')];
        const li = el.getAttribute('data-li');
        let bb;
        try { bb = el.getBBox(); } catch (e) { return; }
        const txt = refOf(w, li);
        const bw = txt.length * 8 + 14;
        s('rect', { x: f1(bb.x + bb.width / 2 - bw / 2), y: f1(bb.y - 22), width: bw, height: 19, rx: 6, class: 'cx-badge' }, badges);
        s('text', { x: f1(bb.x + bb.width / 2), y: f1(bb.y - 8), 'text-anchor': 'middle', class: 'cx-badge-t', text: txt }, badges);
      }
      let numbered = false;
      const api = {
        hover(pt, el) {
          const t = el && el.closest ? el.closest(how === 'lwl' ? '[data-li]' : '[data-wi]') : null;
          if (t !== hovEl) { hovEl = t; badge(t); wordEls.forEach((w) => w.classList.toggle('hl', !!t && w === t.closest('[data-wi]'))); }
        },
        leave() { if (hovEl) { hovEl = null; badge(null); wordEls.forEach((w) => w.classList.remove('hl')); } },
        down(pt, ev, el) {
          const t = el && el.closest ? el.closest('[data-word]') : null;
          if (!t) return false;
          env.typeWord(t.getAttribute('data-word'));
          return true;
        },
        numbers(on) {
          numbered = on;
          numsG.innerHTML = '';
          if (!on) return;
          wordEls.forEach((ts) => {
            let bb;
            try { bb = ts.getBBox(); } catch (e) { return; }
            const w = W[+ts.getAttribute('data-wi')];
            s('text', { x: f1(bb.x + bb.width / 2), y: f1(bb.y + bb.height + 9), 'text-anchor': 'middle', class: 'cx-wnum', text: how === 'n' ? String(w.n) : String(w.word) }, numsG);
          });
        },
        isNumbered: () => numbered
      };
      return api;
    }
  };

  /* Braille: the chart, the whole alphabet or only the first ten letters and the rule. */
  TOOLS.braille = {
    size: (env) => ({ w: 424, h: env.d.chart === 'decade' ? 214 : 250 }),
    build(env, g) {
      const s = env.s, AZ = X().AZ, decade = env.d.chart === 'decade', CW = 40;
      const H = decade ? 210 : 246;
      s('rect', { x: 2, y: 2, width: 420, height: H, rx: 12, class: 'cx-card' }, g);
      const rows = decade ? ['ABCDEFGHIJ'] : ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ'];
      rows.forEach((row, r) => {
        row.split('').forEach((ch, c) => {
          const x = 14 + c * CW, y = 12 + r * 76;
          const cg = s('g', { class: 'cx-bc', 'data-type': ch }, g);
          s('rect', { x: x + 1, y: y + 1, width: CW - 2, height: 70, rx: 7, class: 'cx-bc-bg' }, cg);
          const pic = s('g', null, cg);
          pic.innerHTML = brailleSVG(X().BRAILLE[ch], x + 6, y + 4, 1);
          s('text', { x: x + CW / 2, y: y + 62, 'text-anchor': 'middle', class: 'cx-bc-t', text: ch.toLowerCase() }, cg);
        });
      });
      if (decade) {
        const lines = ['k to t: the same as a to j, with dot 3 added (bottom left)', 'u, v, x, y, z: a to e with dots 3 and 6 added', 'w (a late arrival): j with dot 6 added'];
        lines.forEach((t, i) => s('text', { x: 20, y: 112 + i * 26, class: 'cx-rule', text: t }, g));
        const pic = s('g', null, g);
        pic.innerHTML = '<text class="cx-cap" x="310" y="194">places:</text>' + brailleSVG('123456', 366, 170, 0.8).replace(/cx-bd"/g, 'cx-bd0" ') +
          '<text class="cx-dn" x="359" y="180">1</text><text class="cx-dn" x="359" y="190.5">2</text><text class="cx-dn" x="359" y="201">3</text><text class="cx-dn" x="388" y="180">4</text><text class="cx-dn" x="388" y="190.5">5</text><text class="cx-dn" x="388" y="201">6</text>';
      } else {
        s('text', { x: 300, y: 12 + 2 * 76 + 40, class: 'cx-cap', text: 'k–t: a–j + dot 3' }, g);
        s('text', { x: 300, y: 12 + 2 * 76 + 58, class: 'cx-cap', text: 'u–z: + dots 3 and 6' }, g);
      }
      return {};
    }
  };

  /* Bacon: the table of a/b groups, and the innocent text when the message hides in two typefaces. */
  function coverLines(text, per) {
    const out = [];
    let line = '';
    text.split(' ').forEach((w) => {
      if (line && (line + ' ' + w).length > per) { out.push(line); line = w; }
      else line = line ? line + ' ' + w : w;
    });
    if (line) out.push(line);
    return out;
  }
  TOOLS.bacon = {
    size(env) {
      const cov = env.d.cover ? coverLines(env.d.cover, 46).length * 32 + 56 : 0;
      return { w: 470, h: cov + 222 };
    },
    build(env, g) {
      const s = env.s, d = env.d, AZ24 = X().BACON_AZ;
      let y = 0;
      const coverEls = [];
      if (d.cover) {
        const lines = coverLines(d.cover, 46);
        const H = lines.length * 32 + 34;
        s('rect', { x: 2, y: 2, width: 466, height: H, rx: 10, class: 'cx-bookcard' }, g);
        const bits = env.M.bits;
        let li = 0;
        lines.forEach((ln, r) => {
          const t = s('text', { x: 20, y: 34 + r * 32, class: 'cx-cover' + (d.subtle ? ' subtle' : '') }, g);
          ln.split('').forEach((ch) => {
            if (/[A-Za-z]/.test(ch)) {
              const b = bits[li];
              coverEls.push(s('tspan', { class: b === 'B' ? 'tb' : 'ta', 'data-li': li, text: ch }, t));
              li++;
            } else t.appendChild(root.document.createTextNode(ch));
          });
        });
        y = H + 20;
      }
      const tg = s('g', { transform: 'translate(0 ' + y + ')' }, g);
      s('rect', { x: 2, y: 2, width: 466, height: 196, rx: 12, class: 'cx-card' }, tg);
      AZ24.split('').forEach((ch, i) => {
        const c = Math.floor(i / 6), r = i % 6;
        const x = 14 + c * 114, yy = 12 + r * 30;
        const cg = s('g', { class: 'cx-bt', 'data-type': ch }, tg);
        s('rect', { x, y: yy, width: 108, height: 27, rx: 6, class: 'cx-bt-bg' }, cg);
        s('text', { x: x + 10, y: yy + 19, class: 'cx-bt-l', text: ch === 'I' ? 'I/J' : ch === 'U' ? 'U/V' : ch }, cg);
        s('text', { x: x + 98, y: yy + 19, class: 'cx-bt-g', 'text-anchor': 'end', text: X().BACON[ch].toLowerCase() }, cg);
      });
      return {
        onSlot(i) {
          coverEls.forEach((el, k) => el.classList.toggle('grp', i >= 0 && k >= i * 5 && k < i * 5 + 5));
        },
        groups(on) { coverEls.forEach((el, k) => el.classList.toggle('alt', on && Math.floor(k / 5) % 2 === 1)); }
      };
    }
  };

  /* ---------- checking a puzzle (node-safe) ---------- */

  function verify(p) {
    const d = p.data, S = X();
    if (!S) return { ok: false, err: 'js/lib/ciphers.js is not loaded' };
    if (!d || !d.code || !d.msg) return { ok: false, err: 'code and msg are needed' };
    const M = S.model(d);
    if (M.err) return { ok: false, err: M.err };
    const n = M.plain.length;
    if (n < 2 || n > 80) return { ok: false, err: 'the message has ' + n + ' letters (2..80)' };
    const dec = S.decode(d, M);
    if (dec == null || !S.same(d.code, dec, M.plain)) return { ok: false, err: 'the code does not decode to the message: ' + dec };
    const code = d.code;
    // a hidden key must be findable: no other key may give a readable message
    const extra = new Set(S.wordsOf(d.msg));
    if (code === 'caesar') {
      const k = d.key | 0;
      if (k < 1 || k > 25) return { ok: false, err: 'the shift must be 1..25' };
      if (d.show === false) {
        const cipher = S.caesar(M.msg, k);
        for (let s = 1; s < 26; s++) {
          if (s === k) continue;
          const t = S.caesar(cipher, -s);
          if (S.wordsKnown(t)) return { ok: false, err: 'shift ' + s + ' also reads as words: ' + t };
        }
      }
    }
    if (code === 'railfence' || code === 'scytale') {
      const k = d.key | 0;
      if (k >= n) return { ok: false, err: 'the key is too large for the message' };
      if (d.show === false) {
        for (let r = 2; r <= Math.min(12, n - 1); r++) {
          if (r === k) continue;
          const t = code === 'railfence' ? S.railDecode(M.cipher, r) : S.scytaleDecode(M.cipher, r).slice(0, n);
          if (t === M.plain) return { ok: false, err: 'key ' + r + ' gives the same message' };
          if (S.readable(t, extra)) return { ok: false, err: 'key ' + r + ' also reads as words: ' + t };
        }
      }
    }
    if (code === 'vigenere') {
      const kl = S.letters(d.key);
      if (kl.length < 2) return { ok: false, err: 'the keyword needs two letters or more' };
      if (/^A+$/.test(kl)) return { ok: false, err: 'a keyword of A\'s hides nothing' };
    }
    if (code === 'bacon' && d.cover && S.letters(d.cover).length < n * 5) return { ok: false, err: 'the cover text is too short' };
    if (code === 'pigpen' && d.card == null && p.diff <= 1) return { ok: true, warn: 'an easy pigpen puzzle with the key card face down' };
    return { ok: true };
  }

  /* ---------- endless: a fresh message in a fresh code ---------- */

  const LEVEL_LEN = [null, [4, 10], [9, 15], [14, 22], [20, 30], [26, 40]];
  const POOLS = {
    1: ['caesar', 'atbash', 'polybius', 'morse', 'braille', 'pigpen'],
    2: ['caesar', 'atbash', 'polybius', 'morse', 'braille', 'pigpen', 'semaphore', 'bacon', 'railfence', 'book'],
    3: ['caesar-hidden', 'semaphore', 'bacon', 'railfence', 'scytale', 'vigenere', 'book', 'pigpen-hidden', 'morse', 'polybius-torch'],
    4: ['caesar-hidden', 'railfence-hidden', 'scytale-hidden', 'vigenere', 'bacon-cover', 'braille-decade', 'polybius-keyed', 'book', 'semaphore'],
    5: ['vigenere-riddle', 'railfence-hidden', 'scytale-hidden', 'bacon-subtle', 'book-lwl', 'caesar-hidden', 'braille-decade', 'semaphore']
  };
  const TITLES = {
    caesar: ['A Letter from Rome', 'Turned by Three', 'The Wheel Turns', 'A Shifty Note'],
    atbash: ['Back to Front', 'The Folded Alphabet', 'Z for A'],
    polybius: ['Torches on the Wall', 'By Row and Column', 'Grid Reference'],
    pigpen: ['Pens and Dots', 'The Lodge Letter', 'Noughts and Crosses'],
    morse: ['Dots and Dashes', 'Over the Wire', 'A Signal Lamp at Night'],
    semaphore: ['Flags on the Quay', 'Signals from the Pier', 'Arms Up'],
    railfence: ['Zigzag', 'Down and Up the Rails', 'Along the Fence'],
    scytale: ['A Spartan Strip', 'Wound Round the Rod', 'The Leather Belt'],
    vigenere: ['A Table of Shifts', 'The Keyword', 'Twenty-Six Alphabets'],
    book: ['Chapter and Verse', 'By the Book', 'Word for Word'],
    braille: ['Six Dots', 'Read by Touch', 'Raised Dots'],
    bacon: ['Aa and Bb', 'Two Typefaces', 'Hidden in Plain Sight']
  };

  function genText(d, kind, riddle) {
    const S = X();
    let t = '';
    switch (d.code) {
      case 'caesar': t = d.show === false ? 'Every letter has been moved along the alphabet by the same amount — but by how much?' : 'Every letter has been moved **' + d.key + '** places along the alphabet.'; break;
      case 'atbash': t = 'The alphabet has been turned back to front: A for Z, B for Y, C for X…'; break;
      case 'polybius': t = (d.torch ? 'A watchman signals with torches: the left group gives the row, the right group the column.' : 'Each pair of digits is a row and a column of the square.') + (d.key ? ' This square begins with a keyword.' : ''); break;
      case 'pigpen': t = 'A note in the pigpen cipher. Each symbol is the pen a letter sits in.'; break;
      case 'morse': t = 'A message in Morse code. Press **Play** to hear it.'; break;
      case 'semaphore': t = 'A signaller on the quay spells out a message with two flags.'; break;
      case 'railfence': t = d.show === false ? 'A zigzag on some number of rails — how many?' : 'The message was written in a zigzag on **' + d.key + '** rails and read off rail by rail.'; break;
      case 'scytale': t = d.show === false ? 'A strip of leather covered in letters. Wind it round a rod of the right thickness.' : 'Wind the strip round a rod **' + d.key + '** letters thick and read along it.'; break;
      case 'vigenere': t = d.riddle ? 'The keyword is the answer to a riddle: *' + d.riddle + '*' : 'A Vigenère cipher with the keyword **' + S.letters(d.key) + '**.'; break;
      case 'book': t = d.mode === 'word' ? 'Each number is a word of *' + S.BOOKS[d.book].title + '*.' : 'Each ' + (d.how === 'lwl' ? 'reference is line.word.letter in' : d.how === 'lw' ? 'reference is line.word in' : 'number is a word of') + ' *' + S.BOOKS[d.book].title + '*' + (d.how === 'lwl' ? '.' : ': take its first letter.'); break;
      case 'braille': t = 'A message in Braille.' + (d.chart === 'decade' ? ' Only the first ten letters are on the chart; the rule gives the rest.' : ''); break;
      case 'bacon': t = d.cover ? 'An innocent-looking letter — but it is printed in two typefaces. Read them as a and b.' : 'Groups of five: each is one letter in Bacon\'s table.'; break;
      default:
    }
    if (riddle) t = '**Riddle:** ' + riddle[0] + ' The answer is in code below.\n\n' + t;
    return t;
  }

  function generate(rng, level, fam) {
    const S = X();
    const pool = POOLS[level] || POOLS[3];
    const pick = pool[Math.floor(rng() * pool.length)];
    const [code, variant] = pick.split('-');
    const len = LEVEL_LEN[level] || LEVEL_LEN[3];
    const d = { code };
    let opts = { kinds: level <= 2 ? ['pattern', 'pattern', 'proverb', 'riddle'] : ['pattern', 'proverb'] };
    let riddle = null;
    if (code === 'book') {
      // first letters of words (or any letter, line.word.letter): find a text that has every letter the message needs
      d.how = variant === 'lwl' || level >= 4 ? 'lwl' : level === 3 && rng() < 0.5 ? 'lw' : 'n';
      d.mode = 'letter';
      const books = rng.shuffle ? rng.shuffle(Object.keys(S.BOOKS)) : Object.keys(S.BOOKS);
      for (const b of books) {
        const m = S.makeMessage(rng, len[0], len[1], Object.assign({}, opts, { allowed: S.bookLetters(b, d.how) }));
        if (m) { d.book = b; d.msg = m.msg; riddle = m.riddle; break; }
      }
      if (!d.msg) return null;
    }
    if (!d.msg) {
      const m = S.makeMessage(rng, len[0], len[1], opts);
      if (!m) return null;
      d.msg = m.msg;
      riddle = m.riddle;
    }
    const n = S.letters(d.msg).length;
    switch (code) {
      case 'caesar': d.key = 1 + Math.floor(rng() * 25); if (variant === 'hidden') d.show = false; break;
      case 'polybius': if (variant === 'torch') d.torch = true; if (variant === 'keyed') d.key = S.LIST.password[Math.floor(rng() * S.LIST.password.length)]; break;
      case 'pigpen': if (variant !== 'hidden') d.card = true; break;
      case 'railfence': d.key = variant === 'hidden' ? 2 + Math.floor(rng() * 4) : level <= 2 ? 2 : 3; if (variant === 'hidden') d.show = false; break;
      case 'scytale': d.key = 3 + Math.floor(rng() * (level >= 4 ? 4 : 2)); if (variant === 'hidden') d.show = false; break;
      case 'vigenere':
        if (variant === 'riddle') { const r = S.KEY_RIDDLES[Math.floor(rng() * S.KEY_RIDDLES.length)]; d.key = r[1]; d.riddle = r[0]; }
        else {
          const ks = S.LIST.password.concat(S.LIST.animal).filter((w) => w.length >= (level >= 4 ? 5 : 3) && w.length <= (level >= 4 ? 8 : 5));
          d.key = ks[Math.floor(rng() * ks.length)] || 'LEMON';
        }
        break;
      case 'braille': if (variant === 'decade') d.chart = 'decade'; break;
      case 'bacon':
        if (variant === 'cover' || variant === 'subtle') {
          let cov = '';
          const start = Math.floor(rng() * S.COVERS.length);
          for (let i = 0; S.letters(cov).length < n * 5 && i < 20; i++) cov += (cov ? ' ' : '') + S.COVERS[(start + i) % S.COVERS.length];
          d.cover = cov;
          if (variant === 'subtle') d.subtle = true;
        } else d.ab = rng() < 0.3 && level >= 3 ? 'dots' : 'ab';
        break;
      case 'book': {
        d.refs = S.bookEncode(d.book, d.msg, d.how, d.mode, rng);
        if (!d.refs) return null;
        break;
      }
      default:
    }
    if ((code === 'railfence' || code === 'scytale') && d.key >= n) return null;
    const titles = TITLES[code];
    const p = {
      title: titles[Math.floor(rng() * titles.length)],
      text: genText(d, null, riddle),
      diff: level,
      data: d
    };
    return p;
  }

  function about(p) {
    const d = (p && p.data) || {};
    let s = 'Click a box under the code (or the symbol above it) and type the letter it stands for — or click a letter on the instrument beside the card, or use the letter pad in the panel. **←** **→** move between boxes, **Backspace** rubs out, **↑** **↓** turn the instrument.';
    if (X() && X().SUBST.has(d.code)) s += '\n\nIn this code the same symbol always means the same letter, so a letter you write appears under every copy of its symbol.';
    s += '\n\nHints first remind you how the code works, then give away a letter, then a whole word.';
    return s;
  }

  /* ---------- the page ---------- */

  function stageAspect(wb) {
    const el = wb.host || wb.svg;
    const w = el && el.clientWidth, h = el && el.clientHeight;
    return w > 40 && h > 40 ? w / h : 1.5;
  }
  const fitScale = (aspect, w, h) => Math.min(aspect * 1000 / w, 1000 / h);

  function mount(ctx, p) {
    const S = X(), d = p.data, wb = ctx.wb, s = ctx.s;
    const M = S.model(d);
    if (M.err) { ctx.say('This puzzle cannot be shown: ' + M.err, 'warn'); return {}; }
    const code = d.code, n = M.slots.length;
    const subst = S.SUBST.has(code) || (code === 'book' && d.mode !== 'word');
    const glyphless = S.TRANS.has(code) || (code === 'bacon' && !!d.cover);
    let a = new Array(n).fill('');
    let lock = new Set();
    let cardUp = !!d.card;
    let keyKnown = code !== 'vigenere' || !d.riddle;
    let cur = 0, hoverSig = null, busy = false;
    const timers = [], frames = [];
    let destroyed = false;

    /* the environment the instruments work in */
    const btnFns = new Map();
    let btnSeq = 0;
    const kwStore = 'cx-kw:' + p.id;
    let keyword = keyKnown && code === 'vigenere' ? S.letters(d.key) : (C.store.get(kwStore, '') || '');
    const env = {
      ctx, d, M, s,
      sfx: (x) => ctx.sfx(x),
      toast: (m) => ctx.toast(m),
      type: (L) => typeLetter(L),
      typeWord: (w) => typeWord(w),
      cardUp: () => cardUp,
      // every letter of the message uses up one letter of the keyword
      keyAt(i) { return keyword ? keyword[i % keyword.length] : null; },
      anim(ms, step, done) {
        const t0 = performance.now(), dur = Math.max(1, C.anim(ms));
        const tick = (now) => {
          if (destroyed) return;
          const t = Math.min(1, (now - t0) / dur);
          step(t);
          if (t < 1) frames.push(requestAnimationFrame(tick));
          else if (done) done();
        };
        frames.push(requestAnimationFrame(tick));
      },
      btn(parent, x, y, w, h, label, fn, cls) {
        const id = 'b' + (++btnSeq);
        const bg = s('g', { class: 'cx-btn' + (cls ? ' ' + cls : ''), 'data-btn': id }, parent);
        s('rect', { x, y, width: w, height: h, rx: 8 }, bg);
        const t = s('text', { x: x + w / 2, y: y + h / 2 + 5, 'text-anchor': 'middle', text: label }, bg);
        btnFns.set(id, fn);
        return { el: bg, label: (v) => { t.textContent = v; } };
      }
    };

    /* ---------- measuring and laying out the message ---------- */

    const tool = TOOLS[code];
    const tsz = tool.size(env);
    const keyRow = code === 'vigenere' ? 14 : 0;
    let GH = 0;
    const unitW = M.tokens.map((tk) => {
      if (tk.t === 'gap') return 0;
      if (tk.t === 'punct') return 14;
      const gs = glyphSize(code, tk.g, d);
      GH = Math.max(GH, gs.h);
      return Math.max(gs.w, tk.slots.length * SLOT_W + (tk.slots.length - 1) * 2);
    });
    GH += keyRow;
    const LH = (GH ? GH + 6 : 0) + SLOT_H + 20;
    const words = [[]];
    M.tokens.forEach((tk, i) => { if (tk.t === 'gap') words.push([]); else words[words.length - 1].push(i); });
    const wordW = (w) => w.reduce((sum, i) => sum + unitW[i] + UNIT_GAP, -UNIT_GAP);
    function wrap(maxW) {
      const lines = [];
      let line = [], lw = 0;
      const flush = () => { if (line.length) lines.push({ items: line, w: lw }); line = []; lw = 0; };
      words.forEach((w) => {
        const ww = wordW(w);
        if (ww > maxW) {
          // a word longer than a line is broken where it must be
          flush();
          w.forEach((i) => {
            if (lw && lw + UNIT_GAP + unitW[i] > maxW) flush();
            lw += (lw ? UNIT_GAP : 0) + unitW[i];
            line.push(i);
          });
          return;
        }
        if (line.length && lw + WORD_GAP + ww > maxW) flush();
        if (line.length) { line.push(-1); lw += WORD_GAP; }
        line.push(...w);
        lw += ww;
      });
      flush();
      return lines;
    }
    const PAD = 22, GAP = 34;
    const aspect = stageAspect(wb);
    let best = null;
    for (let maxW = 260; maxW <= 1300; maxW += 40) {
      const lines = wrap(maxW);
      const mw = Math.max(200, ...lines.map((l) => l.w)) + 2 * PAD, mh = lines.length * LH + 2 * PAD - 12;
      const opts = [
        { side: true, W: mw + GAP + tsz.w, H: Math.max(mh, tsz.h) },
        { side: false, W: Math.max(mw, tsz.w), H: mh + GAP + tsz.h }
      ];
      opts.forEach((o) => {
        const sc = fitScale(aspect, o.W + 30, o.H + 30) * (o.side ? 1 : 0.985);
        if (!best || sc > best.sc + 1e-9) best = Object.assign({ sc, lines, mw, mh }, o);
      });
    }
    const { lines, mw, mh, side } = best;
    const mx = side ? 0 : Math.max(0, (best.W - mw) / 2), my = side ? Math.max(0, (tsz.h - mh) / 2) : 0;
    const tx = side ? mw + GAP : Math.max(0, (best.W - tsz.w) / 2), ty = side ? Math.max(0, (mh - tsz.h) / 2) : mh + GAP;
    wb.setBounds({ x0: -12, y0: -12, x1: best.W + 12, y1: best.H + 12 }, 0.035);

    /* ---------- drawing the card ---------- */

    const board = wb.layer('board');
    const root_ = s('g', { class: 'cx' }, board);
    const msgG = s('g', { class: 'cx-msg', transform: 'translate(' + f1(mx) + ' ' + f1(my) + ')' }, root_);
    s('rect', { x: 0, y: 0, width: mw, height: mh, rx: 12, class: 'cx-paper' }, msgG);
    s('rect', { x: 7, y: 7, width: mw - 14, height: mh - 14, rx: 8, class: 'cx-paper-edge' }, msgG);
    const unitEls = [], slotEls = new Array(n), keyEls = [];
    lines.forEach((ln, li) => {
      let x = PAD + (mw - 2 * PAD - ln.w) / 2;
      const y = PAD + li * LH;
      ln.items.forEach((i) => {
        if (i < 0) { x += WORD_GAP; return; }
        const tk = M.tokens[i], w = unitW[i];
        if (tk.t === 'punct') {
          s('text', { x: x + w / 2, y: y + (GH ? GH + 6 : 0) + SLOT_H - 8, 'text-anchor': 'middle', class: 'cx-punct', text: tk.ch }, msgG);
          x += w + UNIT_GAP;
          return;
        }
        const ug = s('g', { class: 'cx-unit', 'data-unit': i, transform: 'translate(' + f1(x) + ' ' + f1(y) + ')' }, msgG);
        if (tk.g) {
          const gs = glyphSize(code, tk.g, d);
          const gg = s('g', { class: 'cx-glyph', transform: 'translate(' + f1((w - gs.w) / 2) + ' ' + keyRow + ')' }, ug);
          s('rect', { x: -2, y: -2, width: gs.w + 4, height: gs.h + 4, rx: 6, class: 'cx-gbg' }, gg);
          gg.insertAdjacentHTML('beforeend', glyphSVG(code, tk.g, d));
          if (code === 'vigenere') keyEls.push({ el: s('text', { x: w / 2, y: 11, 'text-anchor': 'middle', class: 'cx-key', text: '' }, ug), slot: tk.slots[0] });
        }
        const sw = tk.slots.length * SLOT_W + (tk.slots.length - 1) * 2;
        tk.slots.forEach((si, k) => {
          const sx = (w - sw) / 2 + k * (SLOT_W + 2), sy = GH ? GH + 6 : 0;
          const sg = s('g', { class: 'cx-slot', 'data-slot': si }, ug);
          s('rect', { x: sx, y: sy, width: SLOT_W, height: SLOT_H, rx: 5 }, sg);
          s('path', { d: 'M' + (sx + 4) + ' ' + (sy + SLOT_H - 5) + 'h' + (SLOT_W - 8), class: 'cx-line' }, sg);
          const t = s('text', { x: sx + SLOT_W / 2, y: sy + SLOT_H - 10, 'text-anchor': 'middle' }, sg);
          slotEls[si] = { g: sg, t, unit: i };
        });
        unitEls[i] = ug;
        x += w + UNIT_GAP;
      });
    });

    const toolG = s('g', { class: 'cx-tool', transform: 'translate(' + f1(tx) + ' ' + f1(ty) + ')' }, root_);
    const T = tool.build(env, toolG) || {};

    /* ---------- the letters ---------- */

    const sigOf = (i) => { const tk = M.tokens[M.slots[i].unit]; return tk ? tk.sig : null; };
    const group = (i) => {
      const sg = subst ? sigOf(i) : null;
      if (!sg) return [i];
      const out = [];
      for (let j = 0; j < n; j++) if (sigOf(j) === sg) out.push(j);
      return out;
    };
    const value = (i) => (lock.has(i) ? M.slots[i].ans : a[i]);
    const right = (i) => S.eqLetter(code, value(i), M.slots[i].ans);
    const allRight = () => { for (let i = 0; i < n; i++) if (!right(i)) return false; return true; };

    function draw() {
      const done = allRight();
      for (let i = 0; i < n; i++) {
        const e = slotEls[i];
        if (!e) continue;
        const v = value(i);
        e.t.textContent = v || '';
        e.g.classList.toggle('cur', i === cur && !done);
        e.g.classList.toggle('lock', lock.has(i));
        e.g.classList.toggle('filled', !!v);
        e.g.classList.toggle('same', !!hoverSig && sigOf(i) === hoverSig);
      }
      unitEls.forEach((u, i) => { if (u) u.classList.toggle('same', !!hoverSig && M.tokens[i].sig === hoverSig); });
      root_.classList.toggle('solved', done);
      keyEls.forEach((k) => { k.el.textContent = keyword ? env.keyAt(k.slot) : ''; });
      const left = a.reduce((c, v, i) => c + (value(i) ? 0 : 1), 0);
      ctx.stat('Letters', (n - left) + '/' + n);
    }
    function pop(list) {
      list.forEach((i) => {
        const e = slotEls[i];
        if (!e) return;
        e.g.classList.remove('pop'); void e.g.getBoundingClientRect(); e.g.classList.add('pop');
        timers.push(setTimeout(() => e.g.classList.remove('pop'), 260));
      });
    }
    function flash(list) {
      list.forEach((i) => { const e = slotEls[i]; if (e) { e.g.classList.add('flash'); timers.push(setTimeout(() => e.g.classList.remove('flash'), 2400)); } });
      const us = new Set(list.map((i) => M.slots[i].unit));
      us.forEach((u) => { if (unitEls[u]) { unitEls[u].classList.add('flash'); timers.push(setTimeout(() => unitEls[u].classList.remove('flash'), 2400)); } });
    }
    function select(i) {
      if (i < 0 || i >= n) return;
      cur = i;
      if (T.onSlot) T.onSlot(i);
      draw();
    }
    function nextEmpty(from) {
      for (let k = 1; k <= n; k++) { const j = (from + k) % n; if (!value(j) && !lock.has(j)) return j; }
      return -1;
    }
    function nextOpen(from, dir) {
      for (let j = from + dir; j >= 0 && j < n; j += dir) if (!lock.has(j)) return j;
      return from;
    }
    function typeLetter(L) {
      if (busy) return;
      L = String(L || '').toUpperCase();
      if (!/^[A-Z]$/.test(L)) return;
      let i = cur;
      if (lock.has(i)) { i = nextOpen(i, 1); if (lock.has(i)) return; }
      const gr = group(i).filter((j) => !lock.has(j));
      gr.forEach((j) => { a[j] = L; });
      ctx.sfx('tap');
      pop(gr);
      const nx = subst ? nextEmpty(i) : nextOpen(i, 1);
      cur = nx >= 0 ? nx : Math.min(n - 1, i + 1);
      if (T.onSlot) T.onSlot(cur);
      draw();
      ctx.changed('type');
    }
    function typeWord(w) {
      if (busy) return;
      const tk = M.tokens[M.slots[cur].unit];
      if (!tk || tk.slots.length !== w.length) { ctx.toast(tk ? 'That word has ' + w.length + ' letters; this space holds ' + tk.slots.length + '.' : 'Choose a space first.'); return; }
      tk.slots.forEach((j, k) => { if (!lock.has(j)) a[j] = w[k]; });
      ctx.sfx('snap');
      pop(tk.slots);
      const last = tk.slots[tk.slots.length - 1];
      cur = last + 1 < n ? last + 1 : last;
      draw();
      ctx.changed('type');
    }
    function rubOut(i, andGroup) {
      if (lock.has(i) || !a[i]) return false;
      (andGroup ? group(i) : [i]).forEach((j) => { if (!lock.has(j)) a[j] = ''; });
      return true;
    }
    function back() {
      if (rubOut(cur, subst)) { draw(); ctx.changed('erase'); return; }
      const j = nextOpen(cur, -1);
      if (j !== cur) { cur = j; if (rubOut(cur, subst)) { draw(); ctx.changed('erase'); } else draw(); }
    }

    /* ---------- the panel ---------- */

    const pad = C.numberPad({
      keys: S.AZ.split('').concat(['clear']),
      cols: 9,
      label: 'Write a letter',
      onKey: (k) => { if (k === 'clear') back(); else typeLetter(k); }
    });
    pad.classList.add('cx-pad');
    ctx.panel.appendChild(pad);

    let audio = null, playing = null, speed = 1;
    if (code === 'morse') {
      const row = ctx.h('div.cx-row');
      const play = ctx.h('button.btn.small.gold', { type: 'button', onclick: () => { if (playing) stopMorse(); else playMorse(); } }, '▶ Play the message');
      const sp = ctx.h('select.cx-sel', { title: 'Speed', onchange: (e) => { speed = +e.target.value; } },
        ctx.h('option', { value: 0 }, 'slow'), ctx.h('option', { value: 1, selected: true }, 'medium'), ctx.h('option', { value: 2 }, 'fast'));
      row.append(play, sp);
      ctx.panel.appendChild(row);
      ctx.panel.appendChild(ctx.h('div.cx-note', 'Click a symbol on the card to hear that letter alone.'));
      env.playBtn = play;
    }
    let kwInput = null;
    if (code === 'vigenere') {
      kwInput = ctx.h('input.cx-kw', { type: 'text', value: keyword, placeholder: d.riddle ? 'solve the riddle' : 'keyword', spellcheck: 'false', autocomplete: 'off' });
      kwInput.addEventListener('keydown', (e) => e.stopPropagation());
      kwInput.addEventListener('input', () => {
        keyword = S.letters(kwInput.value);
        if (d.riddle) C.store.set(kwStore, keyword);
        if (T.onSlot) T.onSlot(cur);
        draw();
      });
      ctx.panel.appendChild(ctx.h('label.cx-kwrow', ctx.h('span', 'Keyword, written over the letters:'), kwInput));
    }
    if (code === 'book') {
      const b = ctx.h('button.btn.small', { type: 'button', onclick: () => { if (T.numbers) { T.numbers(!T.isNumbered()); b.textContent = T.isNumbered() ? 'Hide the numbers' : 'Number every word'; } } }, 'Number every word');
      ctx.panel.appendChild(b);
    }
    if (code === 'bacon' && d.cover) {
      let on = false;
      const b = ctx.h('button.btn.small', { type: 'button', onclick: () => { on = !on; T.groups(on); b.textContent = on ? 'Hide the groups' : 'Mark the groups of five'; } }, 'Mark the groups of five');
      ctx.panel.appendChild(b);
    }

    /* Morse by ear: a tone with the dots and dashes, the lamp and the symbols lighting in step */
    function stopMorse() {
      if (!playing) return;
      try { playing.osc.stop(); } catch (e) { /* already stopped */ }
      playing.timers.forEach(clearTimeout);
      unitEls.forEach((u) => u && u.classList.remove('playing'));
      if (T.lamp) T.lamp(false);
      playing = null;
      if (env.playBtn) env.playBtn.textContent = '▶ Play the message';
    }
    function playMorse(onlyUnit) {
      stopMorse();
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) { ctx.toast('This browser cannot play sound.'); return; }
      try { audio = audio || new AC(); if (audio.state === 'suspended') audio.resume(); } catch (e) { return; }
      const U = [0.1, 0.075, 0.058][speed], gapK = [2.2, 1.5, 1][speed];
      const osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = 'sine'; osc.frequency.value = 640;
      gain.gain.value = 0;
      osc.connect(gain); gain.connect(audio.destination);
      const t0 = audio.currentTime + 0.08;
      let t = t0;
      const timersP = [];
      const at = (time, fn) => timersP.push(setTimeout(fn, Math.max(0, (time - audio.currentTime) * 1000)));
      const units = onlyUnit != null ? [onlyUnit] : M.tokens.map((tk, i) => (tk.t === 'unit' ? i : tk.t === 'gap' ? -1 : null)).filter((i) => i != null);
      units.forEach((ui) => {
        if (ui < 0) { t += U * 4 * gapK; return; }
        const m = M.tokens[ui].g.m;
        const el = unitEls[ui];
        at(t, () => { unitEls.forEach((u) => u && u.classList.remove('playing')); if (el) el.classList.add('playing'); });
        for (const c of m) {
          const dur = (c === '.' ? 1 : 3) * U;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.22, t + 0.006);
          gain.gain.setValueAtTime(0.22, t + dur - 0.006);
          gain.gain.linearRampToValueAtTime(0, t + dur);
          at(t, () => { if (T.lamp) T.lamp(true); });
          at(t + dur, () => { if (T.lamp) T.lamp(false); });
          t += dur + U;
        }
        t += U * 2 * gapK;
      });
      osc.start(t0);
      osc.stop(t + 0.05);
      at(t + 0.05, () => stopMorse());
      playing = { osc, timers: timersP };
      if (env.playBtn && onlyUnit == null) env.playBtn.textContent = '■ Stop';
    }

    /* ---------- pointer ---------- */

    const inTool = (pt) => pt[0] >= tx - 4 && pt[0] <= tx + tsz.w + 4 && pt[1] >= ty - 4 && pt[1] <= ty + tsz.h + 4;
    const local = (pt) => [pt[0] - tx, pt[1] - ty];
    let toolDrag = false;
    wb.handlers.board = {
      down(pt, ev, el) {
        if (ev && ev.button === 2) return false;
        const b = el && el.closest ? el.closest('[data-btn]') : null;
        if (b) { const fn = btnFns.get(b.getAttribute('data-btn')); if (fn) { ctx.sfx('tap'); fn(); } return true; }
        const sl = el && el.closest ? el.closest('[data-slot]') : null;
        if (sl) { select(+sl.getAttribute('data-slot')); return true; }
        const un = el && el.closest ? el.closest('[data-unit]') : null;
        if (un) {
          const tk = M.tokens[+un.getAttribute('data-unit')];
          const first = tk.slots.find((j) => !value(j)) ;
          select(first != null ? first : tk.slots[0]);
          if (code === 'morse') playMorse(+un.getAttribute('data-unit'));
          return true;
        }
        if (inTool(pt)) {
          const r = T.down ? T.down(local(pt), ev, el) : false;
          if (r === 'drag') { toolDrag = true; return true; }
          if (r) return true;
          const ty_ = el && el.closest ? el.closest('[data-type]') : null;
          if (ty_) { typeLetter(ty_.getAttribute('data-type')); return true; }
        }
        return false;
      },
      move(pt) { if (toolDrag && T.move) T.move(local(pt)); },
      up(pt) { if (toolDrag) { toolDrag = false; if (T.up) T.up(local(pt)); } },
      hover(pt, ev, el) {
        const un = el && el.closest ? el.closest('[data-unit]') : null;
        const sg = un && subst ? M.tokens[+un.getAttribute('data-unit')].sig : null;
        if (sg !== hoverSig) { hoverSig = sg; draw(); }
        if (inTool(pt)) { if (T.hover) T.hover(local(pt), el); }
        else if (T.leave) T.leave();
      }
    };

    /* ---------- hints ---------- */

    const hiddenKey = (code === 'caesar' || code === 'railfence' || code === 'scytale') ? d.show === false : code === 'vigenere' && !!d.riddle;
    const steps = [];
    if (!(p.hints && p.hints.length)) steps.push('idea');
    if (code === 'pigpen' && !d.card) steps.push('card');
    if (hiddenKey) steps.push('key');
    steps.push('letter');
    function reveal(list) {
      list.forEach((i) => { lock.add(i); a[i] = M.slots[i].ans; });
      draw();
      ctx.changed('hint');
    }
    function glyphName(i) {
      const tk = M.tokens[M.slots[i].unit];
      if (!tk || !tk.g) return 'the flashing box';
      const g = tk.g;
      switch (code) {
        case 'caesar': case 'atbash': return 'the code letter **' + g.ch + '**';
        case 'polybius': return '**' + g.r + g.c + '**';
        case 'morse': return '**' + g.m.replace(/\./g, '·').replace(/-/g, '–').split('').join(' ') + '**';
        case 'bacon': return '**' + g.ab.toLowerCase() + '**';
        case 'book': return 'reference **' + g.txt + '**';
        default: return 'the flashing symbol';
      }
    }
    function hint(k) {
      const step = k < steps.length ? steps[k] : 'word';
      if (allRight()) return null;
      if (step === 'idea') return keyIdea(d);
      if (step === 'card') {
        return { text: 'Here is the key card, turned over: find the shape of each symbol on it.', show() { cardUp = true; if (T.refresh) T.refresh(true); ctx.changed('hint'); } };
      }
      if (step === 'key') {
        if (code === 'caesar') return { text: 'The shift is **' + d.key + '**: turn the wheel until the hub says +' + d.key + '.', show() { if (T.setKey) T.setKey(d.key, true); } };
        if (code === 'railfence') return { text: 'There are **' + d.key + '** rails. The letters are on them now: read the zigzag from left to right.', show() { if (T.setKey) T.setKey(d.key, true); } };
        if (code === 'scytale') return { text: 'The rod is **' + d.key + '** letters round. Read the row facing you, then turn the rod.', show() { if (T.setKey) T.setKey(d.key, true); } };
        if (code === 'vigenere') {
          return { text: 'The keyword is **' + S.letters(d.key) + '**.', show() { keyKnown = true; keyword = S.letters(d.key); if (kwInput) kwInput.value = keyword; if (T.onSlot) T.onSlot(cur); draw(); ctx.changed('hint'); } };
        }
      }
      const wrong = [];
      for (let i = 0; i < n; i++) if (!right(i)) wrong.push(i);
      if (!wrong.length) return null;
      if (step === 'letter') {
        let pickI = wrong[0];
        if (subst) {
          // the symbol that would fill the most boxes
          let bestC = -1;
          wrong.forEach((i) => { const c = group(i).filter((j) => !right(j)).length; if (c > bestC) { bestC = c; pickI = i; } });
        } else pickI = wrong[Math.floor(wrong.length / 2)];
        const list = subst ? group(pickI) : [pickI];
        const L = M.slots[pickI].ans;
        const name = glyphName(pickI);
        reveal(list);
        return { text: (subst ? cap(name) + ' stands for **' + L + '**' + (list.length > 1 ? ' — written in all ' + list.length + ' places.' : '.') : 'The flashing box is **' + L + '**.'), show() { flash(list); } };
      }
      // a whole word: the shortest one still wrong
      const ws = M.words.map((w, wi) => ({ wi, w, bad: w.filter((i) => !right(i)).length })).filter((x) => x.bad > 0);
      ws.sort((x, y) => x.w.length - y.w.length || x.wi - y.wi);
      const W = ws[0];
      const word = W.w.map((i) => M.slots[i].ans).join('');
      reveal(W.w);
      return { text: 'One whole word: **' + word + '**.', show() { flash(W.w); } };
    }
    const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

    /* ---------- keys ---------- */

    function key(ev) {
      if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
      const k = ev.key;
      if (/^[a-zA-Z]$/.test(k)) { typeLetter(k); return true; }
      if (k === 'Backspace') { back(); return true; }
      if (k === 'Delete') { if (rubOut(cur, subst)) { draw(); ctx.changed('erase'); } return true; }
      if (k === 'ArrowLeft') { select(Math.max(0, cur - 1)); return true; }
      if (k === 'ArrowRight') { select(Math.min(n - 1, cur + 1)); return true; }
      if (k === 'Home') { select(0); return true; }
      if (k === 'End') { select(n - 1); return true; }
      if (k === ' ') {
        const wi = M.slots[cur].word, nw = M.words[wi + 1];
        if (nw) select(nw[0]);
        return true;
      }
      if ((k === 'ArrowUp' || k === 'ArrowDown') && T.nudge) { T.nudge(k === 'ArrowUp' ? 1 : -1); return true; }
      return false;
    }

    if (!p.goal) ctx.setGoal(glyphless ? 'Decode the message and write it in the boxes, one letter to a box.' : 'Decode the message: write the plain letter under every symbol.');
    draw();
    select(0);

    return {
      noMoves: true,
      check(manual) {
        if (allRight()) return { solved: true, msg: 'The message reads: **' + M.msg.replace(/\s+/g, ' ').trim() + '**' };
        if (!manual) return { solved: false };
        const empty = a.reduce((c, v, i) => c + (value(i) ? 0 : 1), 0);
        if (empty) return { solved: false, msg: C.plural(empty, 'box') + (empty === 1 ? ' is' : ' are') + ' still empty.' };
        let bad = 0;
        for (let i = 0; i < n; i++) if (!right(i)) bad++;
        return { solved: false, msg: bad === 1 ? 'One letter is not right yet.' : bad + ' letters are not right yet.' };
      },
      hint,
      solve() {
        busy = true;
        cardUp = true; keyKnown = true;
        if (code === 'vigenere') { keyword = S.letters(d.key); if (kwInput) kwInput.value = keyword; }
        if (T.refresh) T.refresh(true);
        if (T.setKey) T.setKey(code === 'caesar' || code === 'railfence' || code === 'scytale' ? d.key | 0 : d.key, true);
        const todo = [];
        for (let i = 0; i < n; i++) if (!right(i)) todo.push(i);
        let k = 0;
        const step = () => {
          if (destroyed) return;
          if (k >= todo.length) { busy = false; draw(); ctx.changed('solve'); return; }
          const i = todo[k++];
          a[i] = M.slots[i].ans;
          cur = i;
          pop([i]);
          draw();
          timers.push(setTimeout(step, C.anim(55)));
        };
        timers.push(setTimeout(step, C.anim(250)));
      },
      explain() { return method(d); },
      getState() { return { a: a.slice(), lock: Array.from(lock), card: cardUp, key: keyKnown }; },
      setState(st) {
        if (!st || !Array.isArray(st.a) || st.a.length !== n) return;
        a = st.a.map((v) => (typeof v === 'string' ? v : ''));
        (st.lock || []).forEach((i) => { if (i >= 0 && i < n) lock.add(i); });
        if (st.card) cardUp = true;
        if (st.key && !keyKnown) { keyKnown = true; if (code === 'vigenere') { keyword = S.letters(d.key); if (kwInput) kwInput.value = keyword; } }
        if (T.refresh) T.refresh(false);
        draw();
      },
      key,
      destroy() {
        destroyed = true;
        stopMorse();
        timers.forEach(clearTimeout);
        frames.forEach((f) => cancelAnimationFrame(f));
        if (audio && audio.close) { try { audio.close(); } catch (e) { /* closed */ } }
        wb.handlers.board = null;
      }
    };
  }

  /* ---------- a small picture for the drawer ---------- */

  function thumb(p) {
    const S = X(), d = p.data;
    if (!S || !d) return '';
    const M = S.model(d);
    if (M.err) return '';
    let body = '', W = 0, H = 0;
    if (S.TRANS.has(d.code) || (d.code === 'bacon' && d.cover)) {
      const txt = d.code === 'bacon' ? S.letters(d.cover).slice(0, 10) : M.cipher.slice(0, 10);
      txt.split('').forEach((ch, i) => {
        const b = d.code === 'bacon' ? M.bits[i] === 'B' : false;
        body += '<text x="' + (16 + i * 22) + '" y="46" text-anchor="middle" class="cx-th-t' + (b ? ' b' : '') + '">' + (d.code === 'bacon' ? ch.toLowerCase() : ch) + '</text>';
      });
      W = 16 + txt.length * 22; H = 70;
    } else {
      let x = 10;
      const units = M.tokens.filter((t) => t.t !== 'punct').slice(0, 7);
      units.forEach((tk) => {
        if (tk.t === 'gap') { x += 12; return; }
        const gs = glyphSize(d.code, tk.g, d);
        body += '<g transform="translate(' + x + ' 10)">' + glyphSVG(d.code, tk.g, d) + '</g>';
        x += gs.w + 5;
        H = Math.max(H, gs.h + 20);
      });
      W = x + 6;
    }
    W = Math.max(W, 120); H = Math.max(H, 60);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet"><rect x="2" y="2" width="' + (W - 4) + '" height="' + (H - 4) + '" rx="8" fill="#f4efe1" stroke="#c9b98f" stroke-width="2"/>' + body + '</svg>';
  }

  C.engine({
    id: 'codes',
    name: 'Codes and ciphers',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    deps: ['js/lib/ciphers.js'],
    noMoves: true,
    stateVersion: 1,
    about,
    verify,
    generate,
    mount,
    thumb
  });

  C.codes = { NAMES, keyIdea, method, verify, generate, glyphSVG, glyphSize };

  const INK = '#2b2418';
  C.css('codes', `
    .cx text { font-family: "Segoe UI", system-ui, sans-serif; }
    .cx-paper { fill: #f4efe1; stroke: #c9b98f; stroke-width: 2; filter: drop-shadow(0 3px 6px rgba(0,0,0,.35)); }
    .cx-paper-edge { fill: none; stroke: rgba(120, 95, 50, .22); stroke-width: 1.2; stroke-dasharray: 4 5; }
    .cx-gl { font: 700 27px Georgia, "Times New Roman", serif; fill: ${INK}; }
    .cx-num { font: 700 23px Georgia, serif; letter-spacing: .5px; }
    .cx-key { font: 700 11px "Segoe UI", system-ui, sans-serif; fill: #8a6a2a; letter-spacing: .5px; }
    .cx-gbg { fill: transparent; transition: fill .15s; }
    .cx-unit { cursor: pointer; }
    .cx-unit:hover .cx-gbg { fill: rgba(108, 123, 255, .12); }
    .cx-unit.same .cx-gbg { fill: rgba(255, 190, 70, .28); }
    .cx-unit.flash .cx-gbg { animation: cxflash 1.1s ease-in-out 2; }
    .cx-unit.playing .cx-gbg { fill: rgba(255, 170, 40, .55); }
    @keyframes cxflash { 50% { fill: rgba(255, 170, 40, .6); } }
    .cx-pp { fill: none; stroke: ${INK}; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
    .cx-ppdot { fill: ${INK}; }
    .cx-md { fill: ${INK}; }
    .cx-bd { fill: ${INK}; }
    .cx-bd0 { fill: rgba(43, 36, 24, .22); }
    .cx-ab { font: 700 17px "Courier New", monospace; fill: ${INK}; letter-spacing: 1px; }
    .cx-ba { fill: none; stroke: ${INK}; stroke-width: 1.6; }
    .cx-bb { fill: ${INK}; }
    .cx-ref { font: 700 16px Georgia, serif; fill: #7a2e1c; }
    .cx-flame { fill: #e8741c; stroke: #a33b0c; stroke-width: .8; }
    .cx-torch { fill: #6b4a2a; }
    .cx-wall { stroke: rgba(107, 74, 42, .45); stroke-width: 2; stroke-dasharray: 3 2; }
    .cx-sem-body { fill: none; stroke: ${INK}; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .cx-sem-head { fill: ${INK}; }
    .cx-sem-arm { stroke: ${INK}; stroke-width: 3; stroke-linecap: round; }
    .cx-sem-stick { stroke: #6b4a2a; stroke-width: 1.6; stroke-linecap: round; }
    .cx-flag-r { fill: #d8322a; }
    .cx-flag-y { fill: #f2c21b; }
    .cx-punct { font: 700 24px Georgia, serif; fill: ${INK}; }
    .cx-slot { cursor: text; }
    .cx-slot rect { fill: rgba(255,255,255,.55); stroke: rgba(80, 60, 30, .28); stroke-width: 1.2; transition: fill .15s, stroke .15s; }
    .cx-slot .cx-line { stroke: rgba(80, 60, 30, .45); stroke-width: 1.4; }
    .cx-slot text { font: 700 23px "Segoe UI", system-ui, sans-serif; fill: #2346a8; pointer-events: none; }
    .cx-slot:hover rect { stroke: #4f5fe6; }
    .cx-slot.same rect { fill: rgba(255, 205, 100, .4); }
    .cx-slot.cur rect { fill: rgba(108, 123, 255, .22); stroke: #4f5fe6; stroke-width: 2.4; animation: cxcaret 1.2s steps(2) infinite; }
    @keyframes cxcaret { 50% { stroke: #c48600; } }
    .cx-slot.lock text { fill: #a0620a; }
    .cx-slot.flash rect { animation: cxflashs 1.1s ease-in-out 2; }
    @keyframes cxflashs { 50% { fill: rgba(255, 170, 40, .6); } }
    .cx-slot.pop text { animation: cxpop .24s cubic-bezier(.3,1.7,.5,1); transform-box: fill-box; transform-origin: center; }
    @keyframes cxpop { 0% { transform: scale(.4); opacity: .3; } 100% { transform: scale(1); opacity: 1; } }
    .cx.solved .cx-slot text { fill: #1d8a55; }
    .cx.solved .cx-slot rect { fill: rgba(78, 203, 141, .18); stroke: rgba(29, 138, 85, .55); }
    .cx.solved .cx-paper { stroke: #4ecb8d; }
    .cx-cap { font-size: 12.5px; fill: var(--muted); }
    .cx-ctl { font-size: 15px; font-weight: 700; fill: var(--text); }
    .cx-card { fill: var(--board-2); stroke: var(--line); stroke-width: 1.5; }
    .cx-btn { cursor: pointer; }
    .cx-btn rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 1.5; transition: fill .12s, stroke .12s; }
    .cx-btn:hover rect { stroke: var(--accent); }
    .cx-btn:active rect { fill: var(--accent); }
    .cx-btn text { font-size: 14px; font-weight: 700; fill: var(--text); pointer-events: none; }
    .cx-btn.gold rect { fill: rgba(255, 209, 102, .18); stroke: var(--gold); }
    /* the Caesar wheel */
    .cx-w-shadow { fill: rgba(0,0,0,.28); filter: blur(4px); }
    .cx-w-outer { fill: #efe4c8; stroke: #8a7350; stroke-width: 2.5; }
    .cx-w-o { font: 700 19px Georgia, serif; fill: #3a2d17; cursor: pointer; }
    .cx-w-o:hover, .cx-w-o.hl { fill: #c2410c; font-size: 22px; }
    .cx-w-tick { stroke: rgba(90, 70, 40, .35); stroke-width: 1; }
    .cx-w-disc { cursor: grab; }
    .cx-w-inner { fill: #cfe0f1; stroke: #4d6f93; stroke-width: 2.5; filter: drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
    .cx-w-i { font: 700 18px Georgia, serif; fill: #1f3d63; pointer-events: none; }
    .cx-w-i.hl { fill: #c2410c; font-size: 21px; }
    .cx-w-tick2 { stroke: rgba(40, 70, 110, .28); stroke-width: 1; }
    .cx-w-grip { fill: rgba(40, 70, 110, .35); }
    .cx-w-hub { fill: #b8894a; stroke: #6b4a1f; stroke-width: 2; }
    .cx-w-pin { fill: #f6d27a; stroke: #6b4a1f; }
    .cx-w-hubn { font: 800 17px "Segoe UI", sans-serif; fill: #fff8e6; }
    .cx-w-hubl { font: 600 10px "Segoe UI", sans-serif; fill: #fbe7c0; letter-spacing: 1px; }
    /* Atbash strip */
    .cx-ab-cell { cursor: pointer; }
    .cx-strip { fill: #f4efe1; stroke: #b8a57a; stroke-width: 1; }
    .cx-strip-t { font: 700 19px Georgia, serif; fill: ${INK}; pointer-events: none; }
    .cx-ab-cell:hover .cx-strip, .cx-ab-cell.hl .cx-strip { fill: #ffe39a; }
    .cx-ab-cell.hl2 .cx-strip { fill: #ffc98a; }
    .cx-crease { stroke: #b8a57a; stroke-width: 1.5; stroke-dasharray: 3 3; }
    /* Polybius */
    .cx-ps-h { font: 800 17px "Segoe UI", sans-serif; fill: var(--muted); }
    .cx-ps-h.hl { fill: var(--gold); }
    .cx-band { fill: rgba(255, 209, 102, .16); pointer-events: none; }
    .cx-ps-cell { cursor: pointer; }
    .cx-ps-cell rect { fill: #f4efe1; stroke: #c9b98f; }
    .cx-ps-cell text { font: 700 20px Georgia, serif; fill: ${INK}; pointer-events: none; }
    .cx-ps-cell text.small { font-size: 15px; }
    .cx-ps-cell:hover rect { fill: #ffe39a; }
    /* pigpen card */
    .cx-pk { cursor: pointer; }
    .cx-pk-bg { fill: transparent; }
    .cx-pk:hover .cx-pk-bg { fill: rgba(255, 209, 102, .35); }
    .cx-pk-t { font: 700 18px Georgia, serif; fill: var(--text); pointer-events: none; }
    .cx-pk .cx-ppdot { fill: var(--text); }
    .cx-pk-grid { fill: none; stroke: var(--text); stroke-width: 3; stroke-linecap: round; }
    .cx-cardback { fill: #3b3f8f; stroke: #ffd166; stroke-width: 3; }
    .cx-cardback-l { stroke: rgba(255, 209, 102, .25); stroke-width: 2; }
    .cx-cardback-q { font: 800 90px Georgia, serif; fill: #ffd166; }
    .cx-cardback-t { font: 600 16px Georgia, serif; fill: #ffe7a3; font-style: italic; }
    /* Morse tree */
    .cx-mt-e { stroke: var(--grid-2); stroke-width: 2; }
    .cx-mt-e.dot { stroke-dasharray: 2 4; stroke-linecap: round; }
    .cx-mt-hl { stroke: var(--gold); stroke-width: 4; stroke-linecap: round; }
    .cx-mt-n { cursor: pointer; }
    .cx-mt-n circle { fill: var(--panel-2); stroke: var(--line); stroke-width: 1.5; }
    .cx-mt-n text { font: 700 15px "Segoe UI", sans-serif; fill: var(--text); pointer-events: none; }
    .cx-mt-n text.small { font-size: 11px; fill: var(--muted); }
    .cx-mt-n:hover circle, .cx-mt-n.on circle { fill: rgba(255, 209, 102, .3); stroke: var(--gold); }
    .cx-mt-x { fill: var(--faint); }
    .cx-mt-code { font: 800 22px "Segoe UI", sans-serif; fill: var(--gold); }
    .cx-lamp { fill: #4a3a18; stroke: #8a6a2a; stroke-width: 2; transition: fill .03s; }
    .cx-lamp.on { fill: #ffe066; filter: drop-shadow(0 0 8px #ffd23f); }
    /* semaphore chart */
    .cx-sc { cursor: pointer; }
    .cx-sc-bg { fill: #f4efe1; stroke: #d6c8a2; }
    .cx-sc:hover .cx-sc-bg { fill: #ffe39a; }
    .cx-sc-t { font: 800 15px "Segoe UI", sans-serif; fill: ${INK}; }
    /* rails */
    .cx-tile rect { fill: #f4efe1; stroke: #b8a57a; }
    .cx-tile text { font: 700 16px Georgia, serif; fill: ${INK}; }
    .cx-tile.small text { font-size: 14px; }
    .cx-rail { stroke: var(--wood); stroke-width: 3; opacity: .55; stroke-linecap: round; }
    .cx-zig { fill: none; stroke: var(--accent); stroke-width: 1.6; stroke-dasharray: 3 4; opacity: .7; }
    .cx-rc rect { fill: var(--panel-2); stroke: var(--line); }
    .cx-rc.laid { cursor: pointer; }
    .cx-rc.laid rect { fill: #f4efe1; stroke: #b8a57a; }
    .cx-rc text { font: 700 15px Georgia, serif; fill: ${INK}; pointer-events: none; }
    .cx-rc.laid:hover rect { fill: #ffe39a; }
    .cx-rc.used rect { fill: #cfe8d6; }
    .cx-rc.used text { fill: #6f8a78; }
    .cx-fly { font: 700 15px Georgia, serif; fill: #c2410c; pointer-events: none; }
    /* scytale */
    .cx-rod { cursor: ns-resize; }
    .cx-rod-end { fill: #6b4521; stroke: #3d260e; }
    .cx-band-strip { fill: #efe2c2; stroke: rgba(90, 60, 20, .45); stroke-width: .8; }
    .cx-rod-t { font-family: Georgia, serif; font-weight: 700; fill: ${INK}; pointer-events: none; }
    .cx-rod-t.front { fill: #7a1f10; pointer-events: auto; cursor: pointer; }
    .cx-rod-mark { stroke: var(--gold); stroke-width: 3; stroke-linecap: round; }
    /* tabula recta */
    .cx-tr text { font: 600 10.5px "Segoe UI", sans-serif; fill: var(--ink-2); pointer-events: none; }
    .cx-tr-h { font: 800 11.5px "Segoe UI", sans-serif; fill: var(--muted); cursor: pointer; }
    .cx-tr-h.hl { fill: var(--gold); }
    .cx-keyband { fill: rgba(108, 123, 255, .2); pointer-events: none; }
    .cx-tr-cell { fill: rgba(255, 209, 102, .55); pointer-events: none; }
    .cx-kwrow { display: flex; flex-direction: column; gap: 4px; font-size: .85rem; color: var(--muted); width: 100%; }
    .cx-kw { font: 700 1.05rem "Segoe UI", sans-serif; letter-spacing: 2px; text-transform: uppercase; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--input); color: var(--text); }
    /* book */
    .cx-bookcard { fill: #f7f1e0; stroke: #c9b98f; stroke-width: 2; filter: drop-shadow(0 3px 6px rgba(0,0,0,.3)); }
    .cx-book-title { font: italic 700 18px Georgia, serif; fill: #5a3a14; }
    .cx-book-by { font: italic 13px Georgia, serif; fill: #8a7350; }
    .cx-book-ln { font: 12px Georgia, serif; fill: #a08a60; }
    .cx-book-t { font: 17px Georgia, serif; fill: ${INK}; }
    .cx-bw { cursor: pointer; }
    .cx-bw:hover, .cx-bw.hl { fill: #b3400c; }
    .cx-bl:hover { fill: #1d4ed8; text-decoration: underline; }
    .cx-badge { fill: #2b2418; }
    .cx-badge-t { font: 700 12px "Segoe UI", sans-serif; fill: #ffe7a3; }
    .cx-wnum { font: 700 9px "Segoe UI", sans-serif; fill: #a0620a; }
    /* Braille chart */
    .cx-bc { cursor: pointer; }
    .cx-bc-bg { fill: #f4efe1; stroke: #d6c8a2; }
    .cx-bc:hover .cx-bc-bg { fill: #ffe39a; }
    .cx-bc-t { font: 800 14px "Segoe UI", sans-serif; fill: ${INK}; }
    .cx-rule { font-size: 13.5px; fill: var(--text); }
    .cx-dn { font: 700 8px "Segoe UI", sans-serif; fill: var(--muted); }
    /* Bacon */
    .cx-bt { cursor: pointer; }
    .cx-bt-bg { fill: #f4efe1; stroke: #d6c8a2; }
    .cx-bt:hover .cx-bt-bg { fill: #ffe39a; }
    .cx-bt-l { font: 800 14px "Segoe UI", sans-serif; fill: ${INK}; }
    .cx-bt-g { font: 700 14px "Courier New", monospace; fill: #6b4a2a; letter-spacing: 1px; }
    .cx-cover { font: 20px Georgia, "Times New Roman", serif; fill: ${INK}; }
    .cx-cover .tb { font-weight: 700; font-style: italic; }
    .cx-cover.subtle .tb { font-weight: 400; font-style: italic; }
    .cx-cover .grp { fill: #c2410c; text-decoration: underline; }
    .cx-cover .alt { fill: #1f5fbf; }
    /* panel */
    .cx-pad { margin-top: 4px; }
    .cx-row { display: flex; gap: 8px; align-items: center; }
    .cx-sel { padding: 4px 6px; border-radius: 8px; border: 1px solid var(--line); background: var(--input); color: var(--text); }
    .cx-note { font-size: .8rem; color: var(--muted); }
    .cx-th-t { font: 700 20px Georgia, serif; fill: ${INK}; }
    .cx-th-t.b { font-style: italic; font-weight: 800; fill: #7a2e1c; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
