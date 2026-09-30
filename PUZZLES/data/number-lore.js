/* The Puzzle Cabinet · data/number-lore.js
 * Number puzzles from the world's traditions: Maya bars and dots, Inca knots, Chinese counting rods,
 * the abacus, Babylonian wedges, Hebrew and Greek letter-numbers, Sanskrit number words, Japanese
 * temple-book problems, the count of calendars. Each is retold in our own words, with the tradition
 * or the book named in the source line. */
(function () {
'use strict';

const INK = '#3a3020', RED = '#b0472f', BLUE = '#3a6ea5', GREEN = '#5a8a3a', SAND = '#e9dfc4';
const f1 = (x) => +x.toFixed(1);
function txt(x, y, s, o) {
  o = o || {};
  return '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (o.anchor || 'middle') + '" font-size="' + (o.size || 13) + '" font-family="' + (o.font || 'Georgia,serif') + '"' +
    (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.italic ? ' font-style="italic"' : '') + ' fill="' + (o.fill || INK) + '">' + s + '</text>';
}

/* ---------- Maya numerals: a dot is 1, a bar is 5, a shell is 0 ---------- */
function mayaDigit(d, cx, yb) {   // yb = the bottom of the glyph
  if (d === 0) {
    const cy = yb - 14;
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="27" ry="14" fill="' + SAND + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M' + (cx - 17) + ' ' + cy + ' Q' + cx + ' ' + (cy - 13) + ' ' + (cx + 17) + ' ' + cy + ' M' + (cx - 17) + ' ' + cy + ' Q' + cx + ' ' + (cy + 12) + ' ' + (cx + 17) + ' ' + cy + '" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="3.2" fill="' + INK + '"/>';
  }
  const bars = Math.floor(d / 5), dots = d % 5;
  let s = '';
  for (let b = 0; b < bars; b++) s += '<rect x="' + (cx - 30) + '" y="' + (yb - 12 - b * 16) + '" width="60" height="12" rx="6" fill="' + RED + '" stroke="' + INK + '" stroke-width="2.4"/>';
  const base = yb - bars * 16;
  for (let k = 0; k < dots; k++) s += '<circle cx="' + f1(cx - (dots - 1) * 9.5 + k * 19) + '" cy="' + (base - 8) + '" r="7" fill="' + RED + '" stroke="' + INK + '" stroke-width="2.4"/>';
  return s;
}
function mayaColumn(digits) {   // the top digit is the highest place; the column stands in the middle
  const cellH = 80;
  let s = '';
  digits.forEach(function (d, i) {
    s += mayaDigit(d, 200, 10 + (i + 1) * cellH - 12);
    if (i < digits.length - 1) s += '<line x1="130" y1="' + (10 + (i + 1) * cellH - 2) + '" x2="270" y2="' + (10 + (i + 1) * cellH - 2) + '" stroke="' + INK + '" stroke-width="1" stroke-dasharray="3 4" opacity=".45"/>';
  });
  return { w: 400, h: digits.length * cellH + 16, svg: s };
}
function mayaRow(digits, labels) {
  let s = '';
  digits.forEach(function (d, i) {
    const cx = 40 + i * 80;
    s += mayaDigit(d, cx, 92) + txt(cx, 116, labels[i], { size: 12, italic: true });
    if (i) s += '<line x1="' + (cx - 40) + '" y1="20" x2="' + (cx - 40) + '" y2="122" stroke="' + INK + '" stroke-width="1" stroke-dasharray="3 4" opacity=".45"/>';
  });
  return { w: 400, h: 132, svg: s };
}

/* ---------- Chinese counting rods: vertical rods for ones, hundreds ..., flat rods for tens, thousands ... ---------- */
function rodCell(d, vertical, cx, cy) {
  if (!d) return '';
  const rod = function (x, y, w, h) { return '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + w + '" height="' + h + '" rx="1.6" fill="' + INK + '"/>'; };
  const five = d >= 6, n = five ? d - 5 : d;
  let s = '';
  if (vertical) {
    if (!five) for (let i = 0; i < n; i++) s += rod(cx - (n - 1) * 4.5 + i * 9 - 2, cy - 24, 4, 48);
    else { s += rod(cx - 22, cy - 26, 44, 4); for (let i = 0; i < n; i++) s += rod(cx - (n - 1) * 4.5 + i * 9 - 2, cy - 16, 4, 42); }
  } else if (!five) for (let i = 0; i < n; i++) s += rod(cx - 22, cy - (n - 1) * 4.5 + i * 9 - 2, 44, 4);
  else { s += rod(cx - 2, cy - 27, 4, 18); for (let i = 0; i < n; i++) s += rod(cx - 22, cy - 4 + i * 9, 44, 4); }
  return s;
}
function rodsFigure(digits) {   // digits from the highest place; the last place is vertical
  const n = digits.length, cw = 66, x0 = 200 - n * cw / 2;
  let s = '';
  digits.forEach(function (d, i) {
    const p = n - 1 - i, cx = x0 + i * cw + cw / 2;
    s += rodCell(d, p % 2 === 0, cx, 44);
    s += '<line x1="' + (x0 + i * cw) + '" y1="8" x2="' + (x0 + i * cw) + '" y2="80" stroke="' + INK + '" stroke-width="1" stroke-dasharray="3 4" opacity=".4"/>';
  });
  s += '<line x1="' + (x0 + n * cw) + '" y1="8" x2="' + (x0 + n * cw) + '" y2="80" stroke="' + INK + '" stroke-width="1" stroke-dasharray="3 4" opacity=".4"/>';
  s += '<line x1="' + x0 + '" y1="80" x2="' + (x0 + n * cw) + '" y2="80" stroke="' + INK + '" stroke-width="2"/>';
  return { w: 400, h: 94, svg: s };
}

/* ---------- the abacus: soroban (1 + 4 beads) and suanpan (2 + 5 beads); beads pushed to the beam count ---------- */
function abacusFigure(digits, heaven, earth) {
  const bw = 30, bh = 17, pitch = 46, n = digits.length, x0 = 200 - (n - 1) * pitch / 2;
  const top = 18, hLen = heaven * (bh + 1) + 24, beamH = 7, beamY = top + hLen, eTop = beamY + beamH, eLen = earth * (bh + 1) + 24, bottom = eTop + eLen;
  const left = x0 - pitch / 2 - 6, width = (n - 1) * pitch + pitch + 12;
  let s = '<rect x="' + left + '" y="' + (top - 8) + '" width="' + width + '" height="' + (bottom - top + 16) + '" rx="8" fill="none" stroke="' + INK + '" stroke-width="4"/>';
  s += '<rect x="' + left + '" y="' + beamY + '" width="' + width + '" height="' + beamH + '" fill="' + INK + '"/>';
  const bead = function (cx, cy) {
    return '<polygon points="' + (cx - bw / 2) + ',' + cy + ' ' + cx + ',' + (cy - bh / 2) + ' ' + (cx + bw / 2) + ',' + cy + ' ' + cx + ',' + (cy + bh / 2) + '" fill="#a0693a" stroke="' + INK + '" stroke-width="2"/>';
  };
  digits.forEach(function (d, i) {
    const x = x0 + i * pitch;
    s += '<line x1="' + x + '" y1="' + top + '" x2="' + x + '" y2="' + bottom + '" stroke="#6b5a3a" stroke-width="2.5"/>';
    const ha = Math.min(heaven, Math.floor(d / 5)), ea = d - ha * 5;
    for (let k = 0; k < heaven; k++) {
      s += bead(x, k < ha ? beamY - 1 - bh / 2 - k * (bh + 1) : top + 1 + bh / 2 + (k - ha) * (bh + 1));
    }
    for (let k = 0; k < earth; k++) {
      s += bead(x, k < ea ? eTop + 1 + bh / 2 + k * (bh + 1) : bottom - 1 - bh / 2 - (earth - 1 - k) * (bh + 1));
    }
  });
  return { w: 400, h: bottom + 22, svg: s };
}

/* ---------- Babylonian wedges: a vertical wedge is 1, a corner wedge is 10 ---------- */
function babyDigit(d, cx, cy) {
  const t = Math.floor(d / 10), u = d % 10, cols = Math.min(u, 3), rows = Math.ceil(u / 3);
  const tw = t * 22, uw = cols * 17, gap = t && u ? 12 : 0, total = tw + gap + uw;
  let x = cx - total / 2, s = '';
  for (let k = 0; k < t; k++) { s += '<path d="M' + f1(x + 20) + ' ' + (cy - 10) + ' L' + f1(x + 2) + ' ' + cy + ' L' + f1(x + 20) + ' ' + (cy + 10) + ' L' + f1(x + 20) + ' ' + (cy + 5) + ' L' + f1(x + 10) + ' ' + cy + ' L' + f1(x + 20) + ' ' + (cy - 5) + ' Z" fill="' + INK + '"/>'; x += 22; }
  x += gap;
  for (let r = 0; r < rows; r++) {
    const inRow = Math.min(3, u - r * 3);
    for (let c = 0; c < inRow; c++) {
      const wx = x + c * 17 + 8, wy = cy - rows * 11 + r * 22;
      s += '<path d="M' + f1(wx - 6) + ' ' + wy + ' L' + f1(wx + 6) + ' ' + wy + ' L' + wx + ' ' + (wy + 19) + ' Z" fill="' + INK + '"/>';
    }
  }
  return '<g transform="translate(' + cx + ' ' + cy + ') scale(1.5) translate(' + (-cx) + ' ' + (-cy) + ')">' + s + '</g>';
}

/* ---------- Egyptian hieroglyph numerals: stroke 1, heel-bone 10, coil of rope 100, lotus 1000 ---------- */
function heroSymbol(kind, cx, cy) {
  if (kind === 0) return '<line x1="' + cx + '" y1="' + (cy - 13) + '" x2="' + cx + '" y2="' + (cy + 13) + '" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/>';
  if (kind === 1) return '<path d="M' + (cx - 10) + ' ' + (cy + 12) + ' L' + (cx - 10) + ' ' + (cy - 2) + ' Q' + (cx - 10) + ' ' + (cy - 13) + ' ' + cx + ' ' + (cy - 13) + ' Q' + (cx + 10) + ' ' + (cy - 13) + ' ' + (cx + 10) + ' ' + (cy - 2) + ' L' + (cx + 10) + ' ' + (cy + 12) + '" fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/>';
  if (kind === 2) return '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="none" stroke="' + RED + '" stroke-width="3.5"/><circle cx="' + cx + '" cy="' + cy + '" r="5.5" fill="none" stroke="' + RED + '" stroke-width="3.5"/><path d="M' + (cx + 12) + ' ' + cy + ' L' + (cx + 5.5) + ' ' + cy + '" stroke="' + RED + '" stroke-width="3.5"/>';
  return '<path d="M' + cx + ' ' + (cy + 15) + ' L' + cx + ' ' + (cy - 1) + '" stroke="' + GREEN + '" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="' + cx + '" cy="' + (cy - 8) + '" rx="4.2" ry="8.5" fill="' + GREEN + '" opacity=".85"/><ellipse cx="' + (cx - 7) + '" cy="' + (cy - 5) + '" rx="3.6" ry="7.5" fill="' + GREEN + '" opacity=".85" transform="rotate(-32 ' + (cx - 7) + ' ' + (cy - 5) + ')"/><ellipse cx="' + (cx + 7) + '" cy="' + (cy - 5) + '" rx="3.6" ry="7.5" fill="' + GREEN + '" opacity=".85" transform="rotate(32 ' + (cx + 7) + ' ' + (cy - 5) + ')"/>';
}
function heroFigure(counts) {   // counts = [thousands, hundreds, tens, units]; the highest group stands at the left
  let x = 24, s = '';
  const order = [3, 2, 1, 0];
  order.forEach(function (kind, gi) {
    const c = counts[gi];
    if (!c) return;
    const cols = c > 3 ? Math.ceil(c / 2) : c, rows = c > 3 ? 2 : 1, cw = kind === 0 ? 16 : 30;
    for (let k = 0; k < c; k++) {
      const r = Math.floor(k / cols), col = k % cols;
      s += heroSymbol(kind, x + col * cw + cw / 2, 40 + r * 36 - (rows - 1) * 18 + 18);
    }
    x += cols * cw + 26;
  });
  const contentW = x - 50, off = (400 - contentW * 1.35) / 2 - 24 * 1.35;
  return { w: 400, h: 128, svg: '<g transform="translate(' + f1(off) + ' 0) scale(1.35)">' + s + '</g>' };
}

/* ---------- Aztec tribute signs: dot 1, flag 20, feather 400, bag 8000 ---------- */
function aztecFigure(feathers, flags, dots) {
  let x = 34, s = '';
  for (let k = 0; k < feathers; k++) { s += '<path d="M' + x + ' 24 Q' + (x + 13) + ' 50 ' + x + ' 78 Q' + (x - 13) + ' 50 ' + x + ' 24 Z" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="2.4"/><path d="M' + x + ' 24 L' + x + ' 88" stroke="' + INK + '" stroke-width="2.4"/>'; x += 36; }
  x += 16;
  for (let k = 0; k < flags; k++) { s += '<path d="M' + x + ' 24 L' + x + ' 84" stroke="' + INK + '" stroke-width="3"/><path d="M' + x + ' 26 L' + (x + 28) + ' 38 L' + x + ' 52 Z" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="2.4"/>'; x += 44; }
  x += 16;
  const cols = Math.min(dots, 4);
  for (let k = 0; k < dots; k++) s += '<circle cx="' + (x + (k % cols) * 20) + '" cy="' + (44 + Math.floor(k / cols) * 22) + '" r="7.5" fill="' + RED + '" stroke="' + INK + '" stroke-width="2.4"/>';
  return { w: 400, h: 110, svg: s };
}

/* ---------- an Inca quipu: knots on hanging cords; hundreds high, tens in the middle, units at the foot ---------- */
function quipuFigure(values) {
  const n = values.length, gap = 300 / Math.max(1, n), x0 = 200 - (n - 1) * gap / 2;
  let s = '<rect x="24" y="18" width="352" height="9" rx="4" fill="#8a6a3a" stroke="' + INK + '" stroke-width="2"/>';
  const knot = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="5.2" fill="#e9dfc4" stroke="' + INK + '" stroke-width="2"/>'; };
  values.forEach(function (v, i) {
    const x = x0 + i * gap, h = Math.floor(v / 100), t = Math.floor(v / 10) % 10, u = v % 10;
    s += '<line x1="' + x + '" y1="27" x2="' + x + '" y2="222" stroke="#8a6a3a" stroke-width="3"/>';
    for (let k = 0; k < h; k++) s += knot(x, 52 + k * 12);
    for (let k = 0; k < t; k++) s += knot(x, 112 + k * 12);
    if (u === 1) s += '<path d="M' + (x - 6) + ' 190 C' + (x - 6) + ' 180 ' + (x + 6) + ' 196 ' + (x + 6) + ' 186 M' + (x + 6) + ' 190 C' + (x + 6) + ' 180 ' + (x - 6) + ' 196 ' + (x - 6) + ' 186" fill="none" stroke="' + INK + '" stroke-width="2.4"/><circle cx="' + x + '" cy="188" r="7" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
    else if (u > 1) {
      const hh = 10 + u * 4;
      s += '<rect x="' + (x - 5.5) + '" y="' + (176) + '" width="11" height="' + hh + '" rx="5.5" fill="#e9dfc4" stroke="' + INK + '" stroke-width="2"/>';
      for (let k = 0; k < u; k++) s += '<line x1="' + (x - 5.5) + '" y1="' + (182 + k * 4) + '" x2="' + (x + 5.5) + '" y2="' + (180 + k * 4) + '" stroke="' + INK + '" stroke-width="1.4"/>';
    }
  });
  return { w: 400, h: 238, svg: s };
}

/* ---------- tables of letter values (Hebrew, Greek, Arabic abjad) ---------- */
function letterTable(rows, rtl) {
  const cw = 40, ch = 46;
  let s = '';
  rows.forEach(function (row, ri) {
    const cells = rtl ? row.slice().reverse() : row;
    const x0 = 200 - cells.length * cw / 2, y0 = 8 + ri * (ch + 8);
    cells.forEach(function (c, ci) {
      const x = x0 + ci * cw;
      s += '<rect x="' + (x + 2) + '" y="' + y0 + '" width="' + (cw - 4) + '" height="' + ch + '" rx="6" fill="#fbf8ef" stroke="' + INK + '" stroke-width="1.6"/>';
      s += txt(x + cw / 2, y0 + 26, c[0], { size: 24, font: 'serif' });
      s += txt(x + cw / 2, y0 + 41, c[1], { size: 12, fill: RED, weight: 700 });
    });
  });
  return { w: 400, h: rows.length * (ch + 8) + 10, svg: s };
}
const HEBREW = letterTable([
  [['א', 1], ['ב', 2], ['ג', 3], ['ד', 4], ['ה', 5], ['ו', 6], ['ז', 7], ['ח', 8], ['ט', 9]],
  [['י', 10], ['כ', 20], ['ל', 30], ['מ', 40], ['נ', 50], ['ס', 60], ['ע', 70], ['פ', 80], ['צ', 90]],
  [['ק', 100], ['ר', 200], ['ש', 300], ['ת', 400]]
], true);
const GREEK = letterTable([
  [['Α', 1], ['Β', 2], ['Γ', 3], ['Δ', 4], ['Ε', 5], ['Ϛ', 6], ['Ζ', 7], ['Η', 8], ['Θ', 9]],
  [['Ι', 10], ['Κ', 20], ['Λ', 30], ['Μ', 40], ['Ν', 50], ['Ξ', 60], ['Ο', 70], ['Π', 80], ['Ϟ', 90]],
  [['Ρ', 100], ['Σ', 200], ['Τ', 300], ['Υ', 400], ['Φ', 500], ['Χ', 600], ['Ψ', 700], ['Ω', 800], ['Ϡ', 900]]
], false);
const ABJAD = letterTable([
  [['ا', 1], ['ب', 2], ['ج', 3], ['د', 4], ['ه', 5], ['و', 6], ['ز', 7], ['ح', 8], ['ط', 9], ['ي', 10]],
  [['ك', 20], ['ل', 30], ['م', 40], ['ن', 50], ['س', 60], ['ع', 70], ['ف', 80], ['ص', 90]],
  [['ق', 100], ['ر', 200], ['ش', 300], ['ت', 400], ['ث', 500], ['خ', 600], ['ذ', 700], ['ض', 800], ['ظ', 900], ['غ', 1000]]
], true);

/* the Luoshu square with its four corners hidden */
const LUOSHU = (function () {
  let s = '';
  const cells = [['?', 9, '?'], [3, 5, 7], ['?', 1, '?']];
  cells.forEach(function (row, r) {
    row.forEach(function (c, k) {
      const x = 120 + k * 60, y = 8 + r * 60;
      s += '<rect x="' + x + '" y="' + y + '" width="58" height="58" fill="#fbf8ef" stroke="' + INK + '" stroke-width="2.4"/>' + txt(x + 29, y + 41, c, { size: 30, weight: 700, fill: c === '?' ? RED : INK });
    });
  });
  return { w: 400, h: 196, svg: s };
})();

Cabinet.concepts([
  { id: 'place-value', name: 'Place value and the empty place', see: ['number-bases', 'binary'],
    text: 'The same sign means more when it stands further to the left: in 505 the two fives are worth 500 and 5. That idea, **place value**, was invented again and again: by the Babylonians (in sixties), the Maya (in twenties), the Chinese counting rods, the Inca knot-cords and, in tens, in India. Each of them ran into the same problem, how to show that a place is empty. The Babylonians left a space and later a small sign; the Maya drew a shell; the Chinese left a blank; the Inca left a gap in the cord; India drew a dot and then a circle, our zero.' },
  { id: 'alphabetic-numerals', name: 'Letters that are numbers', see: ['roman-numerals'],
    text: 'Where there were no separate signs for numbers, letters did the work: the Greeks, the Hebrews and the Arabs gave their alphabets a value (alpha 1, beta 2 … or alef 1, bet 2 …). So every word has a number, its sum. Readers looked for meaning in the sums: *gematria* in Hebrew, *isopsephy* in Greek, *abjad* reckoning in Arabic, and the Latin *chronogram*, which hides a year in the capital letters of a sentence.' },
  { id: 'calendar-cycles', name: 'Calendar cycles and the lowest common multiple', see: ['modular', 'gcd'],
    text: 'When one cycle of days runs beside another, they start together again after a length of time equal to the **lowest common multiple** of the two lengths. The Maya set a 260-day round beside a 365-day year; the Chinese ran ten stems beside twelve branches; the Jewish calendar matches lunar months to the solar year in a cycle of nineteen years. To find the time of a match, look for the smallest number that both lengths divide.' }
]);
Cabinet.family({
  id: 'number-lore', engine: 'question', cat: 'numbers', name: 'Numbers around the world', order: 13,
  blurb: 'Read a Maya column, an Inca cord, a set of Chinese counting rods and a soroban; add up a Hebrew word; find the day the Maya calendars meet. Number puzzles from the world\'s own traditions.',
  origin: { who: 'Every culture that ever counted', note: 'Nobody invented numbers once. The Babylonians counted in sixties, the Maya in twenties, the Chinese laid out rods on a board, the Inca tied knots in cords, the Hebrews and Greeks gave every letter a value. These puzzles let you read those systems the way their users did.' },
  concepts: ['place-value', 'number-bases']
}, [

  /* ---------- the Maya ---------- */
  {
    id: 'lore-maya-13', title: 'Bars and Dots', diff: 1,
    source: 'The numerals of the Maya of Mexico and Central America, known from stone inscriptions and from the surviving bark-paper books.',
    text: 'The Maya wrote every number with only three signs: a **dot** for one, a **bar** for five, and a **shell** for zero. The bars sit under the dots. What number is written in the picture?',
    hints: ['Each bar is worth 5, each dot is worth 1.', 'Add the bars first, then the dots.'],
    explain: 'Two bars make 10 and three dots make 3: **13**. With only these signs, and up to three bars and four dots, the Maya could write any number from 0 to 19 in one glyph, and then used place value (in twenties) for anything larger.',
    data: { answer: { num: 13 }, glyph: '13', figure: mayaColumn([13]) },
    concepts: ['place-value'], links: ['lore-maya-60']
  },
  {
    id: 'lore-maya-60', title: 'The Shell', diff: 2,
    source: 'The numerals of the Maya of Mexico and Central America; the shell as a sign for zero appears in inscriptions and in the Dresden Codex.',
    text: 'The Maya wrote large numbers as **columns**, with the biggest place at the top. The bottom place counts ones. The next place up does not count tens: it counts **twenties**. A shell means that a place is empty.\n\nWhat number is written in the column?',
    hints: ['The lower glyph is the shell, so there are no ones.', 'The upper glyph counts twenties: how many twenties are there?'],
    explain: 'Three dots in the twenties place are 3 × 20 = 60, and the shell says that there are no ones: **60**. The shell is one of the earliest true zeros in history: a sign that says “nothing goes in this place”.',
    data: { answer: { num: 60 }, glyph: '60', figure: mayaColumn([3, 0]) },
    concepts: ['place-value', 'number-bases'], links: ['lore-maya-13', 'lore-maya-544']
  },
  {
    id: 'lore-maya-544', title: 'Three Floors', diff: 3,
    source: 'The numerals of the Maya of Mexico and Central America.',
    text: 'A column of three glyphs counts, from the bottom, **ones**, **twenties** and **four hundreds** (20 × 20). Read the column from the top.\n\nWhat number is it?',
    hints: ['The top glyph is one dot: one four-hundred.', 'The middle glyph is a bar and two dots, 7, counted in twenties; the bottom is 4.'],
    explain: '1 × 400 + 7 × 20 + 4 × 1 = 400 + 140 + 4 = **544**. Reading a column is exactly like reading 544 in our own tens, except that the places are worth 1, 20 and 400 instead of 1, 10 and 100.',
    data: { answer: { num: 544 }, glyph: '544', figure: mayaColumn([1, 7, 4]) },
    concepts: ['place-value', 'number-bases'], links: ['lore-maya-60', 'lore-maya-longcount']
  },
  {
    id: 'lore-maya-longcount', title: 'The Long Count', diff: 4,
    source: 'The Maya Long Count calendar, carved on stone monuments of the Classic period (about AD 250 to 900).',
    text: 'The Maya counted the days since the start of their era in a *Long Count*. It is a number written in places, but the third place is a small exception: the places are worth **1** (*k’in*), **20** (*winal*), **360** (*tun*, close to a year), **7,200** (*k’atun*) and **144,000** (*b’ak’tun*).\n\nThe picture shows the Long Count date 13.0.0.0.0, the one that fell on 21 December 2012 by the usual reckoning. How many days is it?',
    hints: ['Only the b’ak’tun place holds anything: the four others hold shells.', 'Multiply the 13 by the value of the b’ak’tun place.'],
    explain: '13 × 144,000 = **1,872,000** days, about 5,125 years. Nothing in the Maya record says that the world was to end when the count reached 13.0.0.0.0: the odometer of days simply rolled over to a fresh column, like a car’s. (If every place were worth 20 times the last, the third would be 400, and the answer 2,080,000: the special value of 360 is the trap.)',
    data: {
      answer: { num: 1872000 },
      traps: [{ match: 2080000, msg: 'That counts every place in twenties. In the calendar the third place is worth 360, not 400.' }],
      glyph: '13.0',
      figure: mayaRow([13, 0, 0, 0, 0], ['b’ak’tun', 'k’atun', 'tun', 'winal', 'k’in'])
    },
    concepts: ['place-value', 'calendar-cycles'], links: ['lore-maya-544', 'lore-calendar-round']
  },

  {
    id: 'lore-maya-add', title: 'Four Thousand Days Later', diff: 5,
    source: 'The Maya Long Count calendar, carved on stone monuments of the Classic period (about AD 250 to 900); the date in the puzzle is invented for the sum.',
    text: 'A Maya scribe wants to record a date **4,000 days** after the Long Count date shown: 9.12.11.5.18 (in the picture). The places are worth 1 (*k’in*), 20 (*winal*), 360 (*tun*), 7,200 (*k’atun*) and 144,000 (*b’ak’tun*). Each place carries into the next when it reaches its limit: 20 k’in make a winal, 18 winal make a tun, and 20 tun make a k’atun (the winal place only goes up to 17).\n\nWhat is the new date? Give the five numbers, from the b’ak’tun to the k’in, separated by commas.',
    hints: ['Change 4,000 days into places: 4,000 = 11 tun (3,960) and 40 more days, which are 2 winal.', 'Add place by place: k’in 18 + 0, winal 5 + 2, tun 11 + 11 = 22, which is more than a k’atun’s worth: carry.'],
    explain: '4,000 = 11 × 360 + 2 × 20 + 0. Adding place by place: k’in 18 + 0 = **18**; winal 5 + 2 = **7**; tun 11 + 11 = 22, which is 20 + 2, so the tun place is **2** and one k’atun is carried: 12 + 1 = **13**; the b’ak’tun stays **9**. The new date is **9.13.2.7.18**. In days: 1,386,478 + 4,000 = 1,390,478, and 9 × 144,000 + 13 × 7,200 + 2 × 360 + 7 × 20 + 18 = 1,390,478. Every place has a limit of 20 except the winal, which stops at 18.',
    data: {
      ask: 'The new date, from b’ak’tun to k’in:',
      answer: { nums: [9, 13, 2, 7, 18], ordered: true },
      glyph: '9.13',
      figure: mayaRow([9, 12, 11, 5, 18], ['b’ak’tun', 'k’atun', 'tun', 'winal', 'k’in'])
    },
    concepts: ['place-value', 'calendar-cycles'], links: ['lore-maya-longcount']
  },

  /* ---------- the Aztecs ---------- */
  {
    id: 'lore-aztec-tribute', title: 'The Tribute List', diff: 2,
    source: 'The *Codex Mendoza*, an Aztec tribute record painted about 1541; the signs are the standard ones of Aztec accounts.',
    text: 'Aztec scribes counted with four signs: a **dot** is 1, a **flag** is 20, a **feather** is 400, and a **bag** (of incense) is 8,000. A tribute list shows the amount of cloth mantles a town owes.\n\nThe picture shows 2 feathers, 3 flags and 7 dots. How many mantles is it?',
    hints: ['Start with the feathers: 400 each.', 'Then the flags, twenty each, and the dots.'],
    explain: '2 × 400 + 3 × 20 + 7 = 800 + 60 + 7 = **867**. The Aztec system, like the Maya, counted in twenties, but it did not use place value: it had a separate sign for each power (1, 20, 400, 8,000) and simply piled them up, as the Romans did.',
    data: {
      answer: { num: 867 },
      traps: [{ match: 87, msg: 'That is what you get if a feather counts only 20. It counts 400.' }],
      glyph: '867',
      figure: aztecFigure(2, 3, 7)
    },
    concepts: ['number-bases'], links: ['lore-nahuatl-twenties']
  },
  {
    id: 'lore-nahuatl-twenties', title: 'Counting in Twenties', diff: 2,
    source: 'Classical Nahuatl, the language of the Aztecs of central Mexico; the number words are the standard ones.',
    text: 'Nahuatl counts in twenties. The small numbers are *ce* 1, *ome* 2, *yei* 3, *nahui* 4, *macuilli* 5. Then *cempohualli* is “one twenty” (20), *ompohualli* “two twenties” (40), *yeipohualli* “three twenties” (60). And *centzontli* is 400, twenty twenties.\n\nWhat are **macuilpohualli** and **ome centzontli**? Give the two numbers, in that order, separated by a comma.',
    hints: ['*Macuilli* is 5, so *macuilpohualli* is five twenties.', '*Ome* is 2, so *ome centzontli* is two four-hundreds.'],
    explain: '*Macuilpohualli* is five twenties, **100**, and *ome centzontli* is two four-hundreds, **800**. The word for a hundred is literally “five twenties”.',
    data: { ask: 'Two numbers, in order:', answer: { nums: [100, 800], ordered: true }, glyph: '20' },
    concepts: ['number-bases'], links: ['lore-aztec-tribute']
  },

  /* ---------- the Inca ---------- */
  {
    id: 'lore-quipu-243', title: 'The Knotted Cord', diff: 2,
    source: 'The quipu (*khipu*) of the Inca of the Andes: cords with knots, used for accounts; the decimal reading is the one worked out by Marcia and Robert Ascher.',
    text: 'The Inca had no writing, but they kept accounts on **quipus**: bundles of cords hung from a main cord, with knots tied along them. On one hanging cord, the position of a knot along the cord gives its place value, and a group of knots gives a digit:\n\n• the group **nearest the top** counts hundreds, the next group tens, the group at the foot units;\n• in the hundreds and tens groups, the digit is the number of knots;\n• in the units group a single **long knot** is tied with as many turns as the digit (one turn, the digit 1, is tied as a figure-of-eight knot);\n• an empty place is a gap on the cord.\n\nWhat number is on the cord in the picture?',
    hints: ['Count the knots in the top group: that is the hundreds digit.', 'The long knot at the foot has as many turns (lines across it) as the units digit.'],
    explain: 'Two knots at the top (200), four in the next group (40), and a long knot with three turns (3): **243**. The Inca were able to keep the records of an empire of millions without a written word, and the knots were read by trained officials called *quipucamayocs*.',
    data: { answer: { num: 243 }, glyph: '243', figure: quipuFigure([243]) },
    concepts: ['place-value'], links: ['lore-quipu-507']
  },
  {
    id: 'lore-quipu-507', title: 'The Gap in the Cord', diff: 3,
    source: 'The quipu (*khipu*) of the Inca of the Andes: cords with knots, used for accounts.',
    text: 'On a quipu, the hundreds are the top group of knots, the tens the middle group, and the units are at the foot, tied as a long knot with as many turns as the digit. A place with nothing in it is left as a bare stretch of cord.\n\nWhat number is on the cord in the picture?',
    hints: ['Count the knots at the top: they are the hundreds. Then see whether anything is in the middle.', 'A gap in the middle place is a zero: it is what tells you that the units are units and not tens.'],
    explain: 'Five knots in the hundreds (500), nothing in the tens (0), and a long knot with seven turns (7): **507**. The bare gap is the Inca zero: without it, 507 and 57 would look alike. Every place-value system has to find some way of showing the empty place.',
    data: {
      answer: { num: 507 },
      traps: [{ match: 57, msg: 'The empty stretch of cord is a place too: the units are three floors below the hundreds, not two.' }],
      glyph: '507',
      figure: quipuFigure([507])
    },
    concepts: ['place-value'], links: ['lore-quipu-243']
  },

  /* ---------- China: counting rods, the abacus and the jin ---------- */
  {
    id: 'lore-rods-472', title: 'Counting Rods', diff: 2,
    source: 'Chinese counting rods (*chóu*, 筹), used for calculation from at least the Han dynasty until the abacus replaced them; the layout is described in the *Sunzi suanjing* and later books.',
    text: 'Chinese mathematicians calculated with **counting rods**: small sticks laid out on a board, one column for each place. The digits 1 to 5 are that many rods. For 6 to 9, one rod set across stands for five, and the rest are added beside it. An empty place is left blank.\n\nTo avoid confusion, the rods **change direction** with the place: in the ones, hundreds, ten-thousands … places they stand **upright**, and in the tens, thousands … places they lie **flat**.\n\nWhat number is on the board?',
    hints: ['Read from the left, in three columns: hundreds, tens, ones.', 'The middle column lies flat: a rod across the top of a flat digit stands for five.'],
    explain: 'The hundreds column has four upright rods (4), the tens has one upright rod on top of two flat ones (5 + 2 = 7), and the ones has two upright rods (2): **472**. The turning of the rods was a clever way to avoid mistaking 41 for 5 or 14 for 23. The same rods were used to solve equations by a method very close to modern matrix work, in the *Nine Chapters* about two thousand years ago.',
    data: { answer: { num: 472 }, glyph: '筹', figure: rodsFigure([4, 7, 2]) },
    concepts: ['place-value'], links: ['lore-rods-6084']
  },
  {
    id: 'lore-rods-6084', title: 'The Blank Column', diff: 3,
    source: 'Chinese counting rods (*chóu*, 筹), used for calculation from the Han dynasty; an empty place was left blank until a written zero came into use in the Song dynasty.',
    text: 'Counting rods: the digits 1 to 5 are that many rods; for 6 to 9 a rod at the head stands for five. The rods stand **upright** in the ones, hundreds … places and lie **flat** in the tens, thousands … places, and an empty place is left blank.\n\nWhat number is on the board?',
    hints: ['Four columns: thousands (flat), hundreds (upright), tens (flat), ones (upright).', 'One column is empty: it holds a zero.'],
    explain: 'The thousands column is a rod standing on a single flat rod (5 + 1 = 6), the hundreds column is blank (0), the tens column is a rod standing on three flat rods (5 + 3 = 8) and the ones column has four upright rods: **6084**. The blank column made the position of the digits matter, and it was only in the Song dynasty that a circle was drawn there: our 0.',
    data: { answer: { num: 6084 }, traps: [{ match: 684, msg: 'The blank column is a place, too: the digits after it are worth ten times more than you have read them.' }], glyph: '算', figure: rodsFigure([6, 0, 8, 4]) },
    concepts: ['place-value'], links: ['lore-rods-472']
  },
  {
    id: 'lore-soroban-read', title: 'Reading the Soroban', diff: 2,
    source: 'The soroban, the Japanese abacus, in use in Japan since the sixteenth or seventeenth century; the layout of one bead above the beam and four below is the modern one.',
    text: 'Each rod of a Japanese **soroban** is one place. The single bead above the beam is worth **5**, and each of the four beads below it is worth **1**. A bead counts only when it is pushed toward the beam.\n\nWhat number is on this soroban?',
    hints: ['Read each rod on its own, from the left: a bead touching the beam counts.', 'The rods have digits 4, 0, 6, 9, 2, read left to right.'],
    explain: 'The rods read 4, 0, 6, 9 and 2 (a rod with no bead at the beam is 0; five plus four is 9), so the number is **40,692**. A skilled operator can add and subtract on a soroban as fast as most people can key a sum into a calculator, and Japanese schools still hold soroban contests.',
    data: { answer: { num: 40692 }, glyph: '珠', figure: abacusFigure([4, 0, 6, 9, 2], 1, 4) },
    concepts: ['place-value'], links: ['lore-suanpan-13']
  },
  {
    id: 'lore-suanpan-13', title: 'Thirteen on One Rod', diff: 3,
    source: 'The suanpan, the Chinese abacus, in use in China for many centuries; it has two beads above the beam and five below.',
    text: 'The Chinese **suanpan** has **two** beads above the beam, each worth 5, and **five** below, each worth 1, so one rod can hold up to 15. That was useful when the old weight of a *jin* was 16 *liang*: a rod could hold a full set of *liang*.\n\nThe abacus shows four rods, worth (from the left) 1000, 100, 10 and 1. **Do not carry**: read each rod as it stands, even if it holds more than 9. What number is it?',
    hints: ['The third rod has both upper beads down (10) and three lower beads up (3).', 'The third rod is worth 13 tens.'],
    explain: 'The rods hold 2, 0, 13 and 8: 2 × 1000 + 0 × 100 + 13 × 10 + 8 = **2,138**. A soroban would carry the ten and show 2,1,3,8 as well, but the suanpan can leave the extra ten sitting on the rod until the end of the sum. The soroban is a suanpan with the spare beads taken away.',
    data: { answer: { num: 2138 }, traps: [{ match: 2038, msg: 'Check the third rod again: both upper beads are down as well as three lower ones.' }], glyph: '算', figure: abacusFigure([2, 0, 13, 8], 2, 5) },
    concepts: ['place-value'], links: ['lore-soroban-read', 'lore-jin-liang']
  },
  {
    id: 'lore-jin-liang', title: 'Half a Jin, Eight Liang', diff: 1,
    source: 'The traditional Chinese system of weights, in which 1 *jin* was 16 *liang* (the *jin* has been 10 *liang*, 500 grams, in mainland China since 1959).',
    text: 'In the traditional Chinese weights, one **jin** (斤) was **16 liang** (两). So a shopkeeper who weighs out “half a jin” gives you 8 liang, and a Chinese saying, *bàn jīn bā liǎng* (半斤八两), “half a jin, eight liang”, means “six of one and half a dozen of the other”: two things that come to the same.\n\nA buyer asks for two and a half jin of tea. How many liang is that?',
    hints: ['Two jin, and half a jin.', 'One jin is 16 liang; half a jin is 8.'],
    explain: '2 × 16 + 8 = **40 liang**. The odd number 16 is often given as the reason why the suanpan has room for 15 on each rod. The jin of the People’s Republic is now 10 liang, and the saying is left as a relic of the old weights: when the jin changed, the idiom stayed.',
    data: { answer: { num: 40, unit: 'liang' }, glyph: '斤' },
    concepts: ['number-bases'], links: ['lore-suanpan-13']
  },

  /* ---------- Babylon ---------- */
  {
    id: 'lore-babylon-83', title: 'Wedges in Sixties', diff: 2,
    source: 'Babylonian cuneiform numerals: the sexagesimal (base 60) place-value system of the scribes of Mesopotamia, in use from about 2000 BC.',
    text: 'The Babylonians pressed wedges into wet clay. A vertical wedge is **1**, a corner wedge is **10**, and the places count in **sixties**: the place on the right is ones, the place to its left is sixties.\n\nWhat number is on the tablet?',
    hints: ['The right-hand group is two corner wedges (20) and three vertical wedges (3).', 'The left-hand group is one wedge, worth one sixty.'],
    explain: 'The left place has one wedge (60) and the right has two tens and three ones (23): 60 + 23 = **83**. We still count minutes and seconds in sixties, and angles in degrees, minutes and seconds, because the Babylonians did.',
    data: {
      answer: { num: 83 },
      glyph: '83',
      figure: { w: 400, h: 110, svg: babyDigit(1, 120, 50) + '<line x1="200" y1="14" x2="200" y2="86" stroke="' + INK + '" stroke-width="1" stroke-dasharray="3 4" opacity=".45"/>' + babyDigit(23, 290, 50) }
    },
    concepts: ['place-value', 'number-bases'], links: ['lore-babylon-gap']
  },
  {
    id: 'lore-babylon-gap', title: 'The Empty Place', diff: 3,
    source: 'Babylonian cuneiform numerals; in the older tablets an empty place was shown only by a wider gap, and a sign for it (two slanted wedges) came in around 300 BC.',
    text: 'On an old Babylonian tablet a scribe has written a number of two places, a single wedge, then a **wide gap**, then three wedges. He did not have a sign for “nothing”, so a wide gap means that a place is empty. The places are worth 1, 60 and 3,600, from the right.\n\nThe gap is wide enough for exactly one empty place. What number is it?',
    hints: ['One wedge, one empty place, then three wedges: three places in all.', 'The first wedge is in the 3,600 place.'],
    explain: '1 × 3,600 + 0 × 60 + 3 = **3,603**. A reader who saw a narrow space might read 1 and 3 side by side as 1 × 60 + 3 = 63. The scribes needed their readers to judge the gap by eye until, many centuries later, they made a mark to show an empty place.',
    data: {
      answer: { num: 3603 },
      traps: [{ match: 63, msg: 'That is what the two signs would say if there were no gap. What is the gap worth?' }],
      glyph: '3603',
      figure: { w: 400, h: 110, svg: babyDigit(1, 70, 50) + babyDigit(3, 320, 50) + '<path d="M120 84 L270 84" stroke="' + RED + '" stroke-width="2" stroke-dasharray="4 4"/>' + txt(195, 76, 'a wide gap', { size: 12, italic: true, fill: RED }) }
    },
    concepts: ['place-value'], links: ['lore-babylon-83']
  },

  /* ---------- multiplying by halving and doubling ---------- */
  {
    id: 'lore-peasant-rows', title: 'Halve One, Double the Other', diff: 2,
    source: 'A method of multiplication known in books as Egyptian, Ethiopian or Russian-peasant multiplication; the idea of doubling is in the Rhind papyrus (about 1650 BC).',
    text: 'There is a way to multiply that needs no times-table. To find **37 × 19**, write 37 on the left and 19 on the right. Halve the left number each row (dropping any half) and double the right number:\n\n37 | 19<br>18 | 38<br>9 | 76<br>4 | 152<br>2 | 304<br>1 | 608\n\nThen keep only the rows where the **left number is odd**, and add up the right-hand numbers of the kept rows to get the answer.\n\nWhich rows do you keep?',
    goal: 'Choose every row you keep.',
    hints: ['Look at the left column: which numbers are odd?', 'The odd ones are 37, 9 and 1.'],
    explain: 'Keep the rows 37 | 19, 9 | 76 and 1 | 608, and add 19 + 76 + 608 = **703**, which is 37 × 19. The method is “halve and double”, and it has been used in many countries; in some books it is called Ethiopian multiplication. See [[aar-egypt-doubling]] for the Egyptian form; the method is binary in disguise.',
    data: { answer: { multi: [0, 2, 5], choices: ['37 | 19', '18 | 38', '9 | 76', '4 | 152', '2 | 304', '1 | 608'] }, glyph: '×' },
    concepts: ['binary'], links: ['lore-peasant-why', 'aar-egypt-doubling']
  },
  {
    id: 'lore-peasant-why', title: 'Why Halving and Doubling Works', diff: 3,
    source: 'The method known as Egyptian, Ethiopian or Russian-peasant multiplication.',
    text: 'In the halve-and-double method for 37 × 19, you keep the rows in which the left-hand number is odd. Why does that give the right answer?',
    hints: ['Write the left-hand column’s odd and even marks in a line, starting at the bottom: 1, 0, 1, 0, 0, 1.', 'Those marks spell 37 in binary: 100101.'],
    explain: 'Each row of the table stands for a power of two times 19: the odd/even marks of the left column, read from the bottom, are the **binary digits of 37** (100101). The kept rows are exactly the powers of two that add up to 37, so the sum is 37 × 19. The halving was working out the binary digits of 37 all along.',
    data: {
      ask: 'Why does it work?',
      answer: { choice: 0, choices: ['The odd/even marks of the left column are the binary digits of 37, and each kept row adds a power of two times 19', 'The method only works for prime numbers', 'Odd numbers always multiply faster', 'It is a lucky accident that works for small numbers'] },
      traps: [{ match: 1, msg: '37 is prime, but the method works for every number, prime or not.' }, { match: 3, msg: 'It is never an accident: it works for every pair of numbers.' }],
      glyph: '2×'
    },
    concepts: ['binary'], links: ['lore-peasant-rows', 'aar-egypt-doubling']
  },

  /* ---------- Egypt ---------- */
  {
    id: 'lore-hiero-1204', title: 'Lotus, Coils and Strokes', diff: 1,
    source: 'Egyptian hieroglyphic numerals: a stroke for 1, a heel-bone for 10, a coil of rope for 100 and a lotus for 1,000, used from about 3000 BC.',
    text: 'The Egyptians wrote numbers with a sign for each power of ten: a **stroke** is 1, a **heel-bone** (an arch) is 10, a **coil of rope** is 100, and a **lotus flower** is 1,000. The signs are simply piled up, with the biggest at the left in this picture.\n\nWhat number is written?',
    hints: ['Count each sign: the lotus (1,000), the coils (100), the arches (10) and the strokes (1).', 'No arches at all: that place is empty.'],
    explain: 'One lotus (1,000), two coils (200), no arches (0) and four strokes (4): **1,204**. This system did not need a zero: a place with nothing simply had no signs. The price was that a large number meant a lot of carving; 999 takes 27 signs.',
    data: { answer: { num: 1204 }, glyph: '𓆼', figure: heroFigure([1, 2, 0, 4]) },
    concepts: ['place-value']
  },

  /* ---------- Rome ---------- */
  {
    id: 'lore-roman-mdclxvi', title: 'Every Letter Once', diff: 1,
    source: 'Roman numerals, in use in Rome from about the third century BC; the year is the one of the Great Fire of London.',
    text: 'The Roman numeral **MDCLXVI** uses each of the seven Roman digits once, from the biggest to the smallest: M (1000), D (500), C (100), L (50), X (10), V (5), I (1). It is also the year of a great fire in London.\n\nWhat number is it?',
    hints: ['Add up the seven values: none is taken away, since each smaller letter follows a bigger one.', '1000 + 500 + 100 + 50 + 10 + 5 + 1.'],
    explain: '1000 + 500 = 1500; + 100 = 1600; + 50 = 1650; + 10 = 1660; + 5 = 1665; + 1 = **1666**, the year of the Great Fire of London.',
    data: { answer: { num: 1666 }, glyph: 'MDCLXVI' },
    concepts: ['roman-numerals']
  },
  {
    id: 'lore-roman-half12', title: 'Half of Twelve Is Seven', diff: 3,
    source: 'A traditional numeral puzzle with Roman numerals; the trick works in any typeface with plain letters.',
    text: 'A riddle for lovers of Roman numerals: **prove that half of twelve is seven.**\n\nWrite twelve in Roman numerals, XII, and cut it in half. How?',
    hints: ['Cut along the length of the figure, or across?', 'Look at what the top half of an X looks like.'],
    explain: 'Cut XII in half **across the middle, along the line of the picture**: the top half of X looks like V, and the top half of each I is still a stroke, so the top half of XII is **VII**, seven. Half of twelve is seven, after a fashion; Roman numerals lend themselves to such tricks, since they are made of straight lines.',
    data: {
      ask: 'How is it done?',
      answer: { choice: 1, choices: ['Cut it down the middle, and keep the left half', 'Cut it in half across the middle and keep the top half, which reads VII', 'Turn it upside down', 'Write the two halves in Greek'] },
      traps: [{ match: 0, msg: 'Cut down the middle and you are left with an odd scrap that is not a numeral. Try cutting the other way.' }, { match: 2, msg: 'Upside down XII reads IIX, which is nothing. The trick is in the cutting.' }],
      glyph: 'XII',
      figure: { w: 400, h: 120, svg: txt(200, 92, 'XII', { size: 96, weight: 700 }) + '<line x1="80" y1="60" x2="320" y2="60" stroke="' + RED + '" stroke-width="3" stroke-dasharray="7 6"/>' }
    },
    concepts: ['roman-numerals', 'lateral']
  },
  {
    id: 'lore-roman-fractions', title: 'Twelfths of an As', diff: 3,
    source: 'Roman money and measures: the *as* divided into twelve *unciae*, from which our words ounce and inch come.',
    text: 'The Romans divided a pound (an *as*) into **twelve** parts called *unciae*, the word that gave us “ounce” and “inch”. Each fraction had its own name. A *semis* is half an as, a *quadrans* a quarter, a *triens* a third.\n\nAdd together a semis, a quadrans and a triens. How many *unciae* is it?',
    hints: ['Change each fraction to twelfths: a half of 12, a quarter of 12, a third of 12.', '6 + 3 + 4.'],
    explain: '6 + 3 + 4 = **13 unciae**, that is one whole as and one uncia over (1 1/12). The Romans’ fractions were twelfths because 12 divides nicely by 2, 3, 4 and 6, and the Latin names lasted: *quincunx* was five-twelfths, *septunx* seven-twelfths, and a *bes* two-thirds.',
    data: { ask: 'How many unciae?', answer: { num: 13, unit: 'unciae' }, traps: [{ match: 12, msg: 'One as is 12 unciae, but the three fractions come to a little more than an as. Add them up.' }], glyph: '⅓' },
    concepts: ['roman-numerals']
  },
  {
    id: 'lore-roman-six', title: 'One Stroke to Make Six', diff: 2,
    source: 'A traditional Roman-numeral riddle.',
    text: 'Here is IX, the Roman numeral for nine.\n\n**Add a single stroke to it to make it six.**\n\nWhat do you add, and where?',
    hints: ['The result is not a Roman numeral but a word.', 'You add a curvy stroke in front.'],
    explain: 'Put an **S** in front of IX: **SIX**, the word for six in English. A single curling stroke turns nine into six, though not in Roman numerals. (In the matchstick version of the puzzle, [[f:roman-matches|Roman sums]], the answer must stay a numeral.)',
    data: { answer: { text: ['six', 's', 'an s', 'the letter s', 'add an s', 'add s', 'an s in front', 's in front', 'put an s in front', 'a letter s', 'six in english'] }, traps: [{ match: ['x', 'v', 'i', 'a v', 'a line', 'a stroke', 'vi'], msg: 'Six would be VI in Roman numerals, but that takes more than one stroke and a reorder. Think of a word.' }], glyph: 'IX' },
    concepts: ['roman-numerals', 'lateral']
  },

  /* ---------- counting on the fingers ---------- */
  {
    id: 'lore-china-hand', title: 'Eight on One Hand', diff: 1,
    source: 'The hand signs for numbers used in China: a widely known system for showing 1 to 10 with one hand.',
    text: 'In China the numbers 1 to 10 are shown with one hand. From 1 to 5 you raise that many fingers. Then the signs change: **6** is the thumb and the little finger held out (the “telephone” shape), **7** is the thumb and the first two fingertips pinched together, **9** is the index finger hooked like a question mark, and **10** is a closed fist.\n\nWhat number does the thumb and the index finger held out, in an L shape, show?',
    hints: ['The numbers after 5 all keep the thumb out. Six is thumb and little finger; seven is thumb and pinched fingertips.', 'The next number is just the thumb and one more finger, the index.'],
    explain: '**8**: thumb and index finger out. The system lets a single hand show every number from 1 to 10, which is very handy in a noisy market where a shout would be lost.',
    data: { answer: { num: 8 }, traps: [{ match: 7, msg: 'Seven pinches the fingertips together. The L shape is the next number.' }], glyph: '✋' },
    concepts: ['place-value']
  },
  {
    id: 'lore-bede-9999', title: 'Counting on Two Hands', diff: 3,
    source: 'Bede, *De temporum ratione* (“On the Reckoning of Time”, AD 725), chapter 1: “On counting and speaking with the fingers”.',
    text: 'The English monk Bede opened his book on the reckoning of time with a lesson in **finger counting**, a system widely known in medieval Europe. On the **left hand** the positions of the fingers show units (1 to 9) and tens (10 to 90). On the **right hand** the same positions show hundreds (100 to 900) and thousands (1,000 to 9,000).\n\nWhat is the largest number that Bede’s two hands can show?',
    hints: ['The left hand can show every number up to 99, a ten and a unit at once.', 'The right hand does the same with hundreds and thousands: 9,000 and 900.'],
    explain: 'The left hand goes up to 99 and the right hand shows 9,900: together **9,999**. Bede goes on to describe positions of the hands against the chest, the hip and the thigh for the tens of thousands and the hundred thousands, until a monk clasping his two hands together stood for a million. It was the calculator of the age.',
    data: { answer: { num: 9999 }, traps: [{ match: 99, msg: 'That is what the left hand can show alone. The right hand adds hundreds and thousands.' }, { match: 999, msg: 'Nearly, but the right hand shows both hundreds and thousands.' }], glyph: '9999' },
    concepts: ['place-value']
  },

  /* ---------- letters that are numbers ---------- */
  {
    id: 'lore-gem-chai', title: 'Chai: The Word for Life', diff: 1,
    source: 'Hebrew letter-numbers (*gematria*), used in Jewish writing since at least the Talmudic age; the sum of the word for “life”, *chai*, is a well-known number in Jewish custom.',
    text: 'In Hebrew every letter has a number, and every word has a sum. The table shows the letters and their values (Hebrew reads from right to left, so the alef, worth 1, is at the right).\n\nThe word **חי** (*chai*, “life”) is spelled with two letters: **ח** (*chet*) and **י** (*yod*). What is its value?',
    hints: ['Find ח in the first row and י at the beginning of the second row.', 'Add the two values.'],
    explain: 'ח is 8 and י is 10, so *chai* is **18**. Eighteen has been a lucky number in Jewish life ever since: gifts of money are often given in multiples of 18, a sign of the wish for life for the person who receives it.',
    data: { answer: { num: 18 }, glyph: 'חי', figure: HEBREW },
    concepts: ['alphabetic-numerals'], links: ['lore-gem-echad', 'lore-gem-emet', 'lore-gem-tetvav']
  },
  {
    id: 'lore-gem-echad', title: 'Love and One', diff: 2,
    source: 'Hebrew letter-numbers (*gematria*); the equality of *ahavah* and *echad* is a favourite in Jewish teaching.',
    text: 'Two Hebrew words look quite unlike: **אהבה** (*ahavah*, “love”) is spelled alef, heh, bet, heh; **אחד** (*echad*, “one”) is spelled alef, chet, dalet. Use the table of letter values.\n\nBoth words have the **same value**. What is it?',
    hints: ['Add up the four letters of *ahavah*: 1, 5, 2, 5.', 'Check your answer with *echad*: 1, 8, 4.'],
    explain: '*Ahavah*: 1 + 5 + 2 + 5 = **13**. *Echad*: 1 + 8 + 4 = **13**. Jewish teachers noticed that “love” and “one” are worth the same, and said that love makes two people one. It is only a coincidence of the alphabet, but a very well-liked one.',
    data: { answer: { num: 13 }, glyph: '13', figure: HEBREW },
    concepts: ['alphabetic-numerals'], links: ['lore-gem-chai', 'lore-gem-emet']
  },
  {
    id: 'lore-gem-emet', title: 'Truth Is a Square', diff: 3,
    source: 'Hebrew letter-numbers (*gematria*); Jewish teachers point out that *emet* is spelled with the first, the middle and the last letters of the alphabet.',
    text: 'The Hebrew word for “truth” is **אמת** (*emet*). It is spelled with the first letter of the alphabet, alef; a letter from the middle, mem; and the last letter, tav. Look up the three letters in the table.\n\nWhat is the value of *emet*?',
    hints: ['Alef is 1, mem is 40, tav is 400.', 'Add them up: it is a well-known perfect square.'],
    explain: '1 + 40 + 400 = **441**, which is 21 × 21. Jewish teachers say that truth stands firm from the first letter to the last, while the word for a lie, *sheker*, is spelled with three letters that are crowded near the end of the alphabet.',
    data: { answer: { num: 441 }, traps: [{ match: 41, msg: 'Tav is worth 400, not 4: check the third row of the table.' }], glyph: 'אמת', figure: HEBREW },
    concepts: ['alphabetic-numerals'], links: ['lore-gem-chai', 'lore-gem-echad']
  },
  {
    id: 'lore-gem-tetvav', title: 'Why Fifteen Is Nine and Six', diff: 2,
    source: 'Hebrew letter-numbers (*gematria*): the written form of 15 and 16 in Hebrew dates and page numbers.',
    text: 'In Hebrew writing a number is spelled with letters added together. The number 15 should be **י** (10) and **ה** (5), and 16 should be **י** (10) and **ו** (6). But in dates and page numbers 15 is always written **ט** (9) and **ו** (6), and 16 as **ט** (9) and **ז** (7).\n\nWhy?',
    hints: ['The two letters י and ה together spell a word.', 'It is a word that is not written lightly.'],
    explain: '**יה** (*Yah*) is a name of God, and **יו** is made of two letters of the four-letter Name, so writers avoided both for the ordinary business of numbering. The habit is a thousand years old and is used to this day: 15 is **ט״ו** and 16 is **ט״ז**.',
    data: {
      ask: 'Why is 15 written 9 + 6?',
      answer: { choice: 0, choices: ['Because י + ה spells a name of God, which is not written lightly', 'Because nine and six are luckier numbers than ten and five', 'Because ה was not yet in the alphabet', 'To make numbers shorter'] },
      traps: [{ match: 1, msg: 'The reason is not luck but respect for a word.' }, { match: 3, msg: 'It is no shorter: both are two letters.' }],
      glyph: 'טו',
      figure: HEBREW
    },
    concepts: ['alphabetic-numerals'], links: ['lore-gem-chai']
  },
  {
    id: 'lore-greek-545', title: 'A Number on a Wall', diff: 2,
    source: 'The Greek alphabetic numerals (from about the fifth century BC); a scratched wall message of the kind found at Pompeii read “I love her whose number is 545”.',
    text: 'The Greeks wrote numbers with letters: alpha for 1, beta for 2, and so on, with a small mark (**ʹ**) to show that the letters are a number. The table shows the values.\n\nA Greek graffito at Pompeii says that its writer loved the lady “whose number is **ΦΜΕʹ**”, presumably the sum of the letters of her name. What is her number?',
    hints: ['Look up Φ, Μ and Ε in the table: hundreds, tens and units.', 'Φ is worth 500.'],
    explain: 'Φ (500) + Μ (40) + Ε (5) = **545**. The lover kept her name secret: many names add up to the same sum, so nobody could say who she was. Graffiti of this kind is a fine example of “isopsephy”, the Greek habit of counting the letters in a word.',
    data: { answer: { num: 545 }, glyph: 'ΦΜΕ', figure: GREEK },
    concepts: ['alphabetic-numerals']
  },
  {
    id: 'lore-abjad-nur', title: 'The Number of Light', diff: 3,
    source: 'The Arabic *abjad* letter-numbers, used in Arabic and Persian writing for centuries, in poetry, dates and calendars.',
    text: 'In the *abjad* system of Arabic each letter has a value, in an order that begins with *a-b-j-d*. The table shows the values (Arabic reads from right to left).\n\nThe Arabic word for “light”, **نور** (*nūr*), is spelled with the letters nun, waw and ra. What is its value?',
    hints: ['Find ن (nun) in the second row, و (waw) in the first row, and ر (ra) in the third row.', 'They are worth 50, 6 and 200.'],
    explain: '50 + 6 + 200 = **256**, which is 2 to the eighth power, a number every programmer knows. Arabic and Persian poets used the *abjad* value of a phrase to give a date, and a well-chosen phrase could carry the year of a building or a birth in its letters.',
    data: { answer: { num: 256 }, glyph: 'نور', figure: ABJAD },
    concepts: ['alphabetic-numerals']
  },

  /* ---------- Japan: the Jinkōki ---------- */
  {
    id: 'lore-mamakodate', title: 'The Stepchildren’s Places', diff: 3,
    source: 'A counting-out problem (*mamakodate*, “stepchild-sorting”) of the kind made famous by Yoshida Mitsuyoshi’s *Jinkōki* (1627) and the Japanese mathematics books that followed.',
    text: 'A widow has 30 children, 15 of her own and 15 stepchildren, standing in a circle. She counts, starting from the first child, and every **10th** child counted leaves the circle; counting goes on round the circle (the ones who have left are not counted). The stepmother wants the 15 stepchildren to be the first 15 who leave. Which positions must they stand in?\n\nThe children leave in this order: 10th, 20th, 30th, 11th … Which position leaves **fifth**?',
    hints: ['After the 10th, 20th and 30th have gone, counting continues at position 1.', 'Positions 10, 20, 30 and 11 have gone by the fourth departure. The next count starts at 12 and skips the empty places.'],
    explain: 'The order is 10, 20, 30, 11, **22**, 3, 15, 27, 9, 24, 7, 23, 8, 26, 14: the fifth is position **22**. The 15 stepchildren must stand at these positions, and the rest are her own. The problem is a cousin of the Josephus problem: [[num-josephus-10]].',
    data: { ask: 'Which position leaves fifth?', answer: { num: 22 }, traps: [{ match: 21, msg: 'The child at position 20 has left already, and so has 10. Count carefully from 12.' }], glyph: '30' },
    concepts: ['modular'], links: ['num-josephus-10']
  },
  {
    id: 'lore-nezumizan', title: 'The Rats That Multiply', diff: 3,
    source: 'The rat problem (*nezumizan*, “rat arithmetic”) of the kind made famous by Yoshida Mitsuyoshi’s *Jinkōki* (1627), the most popular arithmetic book of Japan.',
    text: 'In January a pair of rats has twelve young, six pairs, and so there are now 7 pairs, 14 rats. In February **each pair** of the 7 has twelve young again, and so on every month. Nobody dies.\n\nHow many rats are there at the end of December?',
    hints: ['Every month each pair becomes 7 pairs: the number of rats is multiplied by 7 every month.', 'You need 2 × 7 × 7 × … twelve times: that is 2 × 7¹².'],
    explain: '2 × 7¹² = **27,682,574,402** rats, more than three times the population of the world. The Jinkōki uses the problem to show how fast repeated multiplication grows. In the West the famous multiplying animals are Fibonacci’s rabbits of 1202: see [[seq-fibonacci]].',
    data: { answer: { num: 27682574402 }, traps: [{ match: 84, msg: 'That would be adding 7 twelve times. The number of pairs is multiplied by 7 each month.' }], glyph: '🐀' },
    concepts: ['geometric-series'], links: ['seq-fibonacci']
  },
  {
    id: 'lore-abura-wake', title: 'Dividing the Oil', diff: 4,
    source: 'The oil-dividing problem (*abura-wake-zan*) of the kind found in Yoshida Mitsuyoshi’s *Jinkōki* (1627) and the Japanese arithmetic books that followed it.',
    text: 'A merchant has **10 shō** of oil in a large tub. He has two empty measures, one of **7 shō** and one of **3 shō**, and nothing else. He wants to divide the oil into two equal halves of 5 shō each. A pouring means tipping one vessel into another until the first is empty or the second is full.\n\nWhat is the fewest number of pourings?',
    hints: ['This is a sister of the jug puzzles: pour the big vessel into the 7, then the 7 into the 3.', 'Make a list of the three amounts after each pouring: (10, 0, 0), (3, 7, 0), (3, 4, 3) …'],
    explain: 'It can be done in **9** pourings: (10,0,0) → (3,7,0) → (3,4,3) → (6,4,0) → (6,1,3) → (9,1,0) → (9,0,1) → (2,7,1) → (2,5,3) → (5,5,0). A computer check of every possible pouring shows that nothing shorter works. It is the same kind of puzzle as those on the cabinet’s jug shelf: [[f:jugs|the jugs]].',
    data: { ask: 'Fewest pourings?', answer: { num: 9 }, traps: [{ match: 8, msg: 'Very close. Not quite: eight pourings is not enough. Trace the amounts after each pouring.' }], glyph: '10' },
    concepts: ['state-space', 'gcd']
  },

  /* ---------- India ---------- */
  {
    id: 'lore-aryabhata', title: 'The Rule for the Circle', diff: 2,
    source: 'Aryabhata, *Aryabhatiya* (AD 499), Ganitapada verse 10: the rule for the circumference of a circle.',
    text: 'In AD 499 the Indian astronomer Aryabhata gave a rule for finding the circumference of a circle, in a single verse: *“Add four to a hundred, multiply by eight, and add sixty-two thousand. The result is approximately the circumference of a circle whose diameter is twenty thousand.”*\n\nWhat number does the rule give?',
    hints: ['Add 4 to 100 first, then multiply the result by 8.', '104 × 8 = 832. Now add 62,000.'],
    explain: '(100 + 4) × 8 + 62,000 = **62,832**. Divide by the diameter, 20,000, and you get 3.1416, the value of π correct to four decimal places (π = 3.14159265…). Aryabhata used the word *āsanna*, “approaching”, to say that the value was only near the truth: he knew that the ratio was not a fraction he could write exactly.',
    data: { answer: { num: 62832 }, traps: [{ match: 62000, msg: 'That is the last term of the rule. Add the first part too: four to a hundred, times eight.' }], glyph: 'π' },
    concepts: ['place-value'], links: ['lore-hemachandra']
  },
  {
    id: 'lore-hemachandra', title: 'Rhythms of Six Beats', diff: 2,
    source: 'Sanskrit writers on verse-metre: the counting rule was known to Virahanka (about AD 700) and stated by Hemachandra (about 1150), long before Fibonacci’s *Liber abaci* (1202).',
    text: 'A line of Sanskrit verse is built from **short** syllables (one beat) and **long** ones (two beats). The poets asked: how many different rhythms are there that fill exactly a given number of beats? For 3 beats there are three: short-short-short, short-long, and long-short.\n\nHow many different rhythms fill exactly **6 beats**?',
    hints: ['Count the patterns for 1, 2, 3, 4 beats: 1, 2, 3, 5.', 'A pattern for n beats ends in a short (leaving n − 1 beats) or a long (leaving n − 2): add the two earlier counts.'],
    explain: 'The counts for 1, 2, 3, 4, 5, 6 beats are 1, 2, 3, 5, 8 and **13**: each is the sum of the two before. These are the **Fibonacci numbers**, and Indian prosody had them five centuries before Fibonacci published his rabbits (see [[seq-fibonacci]]). Some call them Hemachandra numbers, after the scholar who put the rule most clearly.',
    data: { ask: 'How many rhythms of 6 beats?', answer: { num: 13 }, traps: [{ match: 12, msg: 'Nearly: count again, with the patterns for 4 beats (5) and 5 beats (8) to help.' }, { match: 8, msg: 'That is the count for five beats. One more step.' }], glyph: '13' },
    concepts: ['sequence', 'recursion'], links: ['lore-aryabhata', 'seq-fibonacci']
  },
  {
    id: 'lore-kaprekar', title: 'The Number 6174', diff: 3,
    source: 'D. R. Kaprekar (1905–1986), an Indian schoolteacher, who found the routine in 1949 at Devlali, India.',
    text: 'The Indian teacher D. R. Kaprekar found a strange routine. Take a four-digit number in which the digits are not all the same. Arrange its digits in **descending** order to make one number and in **ascending** order to make another, and subtract the smaller from the larger. Do the same to the result, and again.\n\nStart with **3524**: 5432 − 2345 = 3087, then continue in the same way. How many subtractions in all until you first reach **6174**?',
    hints: ['Take 3087: descending 8730, ascending 0378 (write the 0 in front). 8730 − 0378 = 8352.', 'Now 8352: 8532 − 2358.'],
    explain: '3524 → 3087 → 8352 → **6174**: three subtractions. And 7641 − 1467 = 6174 again, so it stays there. Every four-digit number that is not all one digit reaches 6174 in at most seven steps, and it is a small marvel of arithmetic discovered by a schoolteacher with no computer.',
    data: { ask: 'How many subtractions?', answer: { num: 3 }, traps: [{ match: 2, msg: 'Count the first subtraction (5432 − 2345) too.' }, { match: 4, msg: 'The fourth subtraction would only give 6174 again. You need the first time it appears.' }], glyph: '6174' },
    concepts: ['place-value'], links: ['lore-hemachandra']
  },
  {
    id: 'lore-bhutasankhya', title: 'Numbers in Words', diff: 3,
    source: 'The Sanskrit “object numbers” (*bhūta-saṅkhyā*) used in verse in Indian astronomy from about the sixth century.',
    text: 'Indian astronomers wrote their tables in verse, and numbers had to fit the metre. So they used **words that stand for numbers**: *moon* is 1, *eyes* is 2, *fire* is 3 (the three sacrificial fires), *Veda* is 4, *arrow* is 5 (the five arrows of Kāma), *season* is 6, *sage* is 7 (the seven sages), *elephant* is 8 (the eight elephants of the directions), *planet* is 9, and *sky* is 0.\n\nThe digits are given **starting from the units** (the rule is “numbers go leftwards”). What number is “fire, sky, sage, moon”?',
    hints: ['Fire is the units digit, then sky is the tens digit, then sage, then moon.', 'The digits are 3, 0, 7, 1, in that order, from the right.'],
    explain: 'Units 3 (fire), tens 0 (sky), hundreds 7 (sage), thousands 1 (moon): **1,703**. A poet could make a number to fit any metre by choosing among the many words for each digit (many things are “moons”: anything that comes only once). The system also has a place for zero, the “sky”, or “void”: the Sanskrit *śūnya* that gave us “zero”.',
    data: { ask: 'What number?', answer: { num: 1703 }, traps: [{ match: 3071, msg: 'You have read the digits from the wrong end: the first word is the units digit.' }], glyph: '🌙' },
    concepts: ['place-value'], links: ['lore-katapayadi', 'lore-zero-word']
  },
  {
    id: 'lore-katapayadi', title: 'Pi in a Verse', diff: 4,
    source: 'The *katapayadi* system of number-syllables of Indian (especially Kerala) astronomers, in use since about the seventh century AD; the π verse *gopībhāgya-madhuvrāta…* is a well-known mnemonic in this system.',
    text: 'In the Sanskrit *katapayadi* system each consonant stands for a digit, so a word can hide a number. The key: **ka** 1, **kha** 2, **ga** 3, **gha** 4, **ṅa** 5, **ca** 6, **cha** 7, **ja** 8, **jha** 9, **ña** 0; **ṭa** 1 … **ṇa** 5, **ta** 6, **tha** 7, **da** 8, **dha** 9, **na** 0; **pa** 1, **pha** 2, **ba** 3, **bha** 4, **ma** 5; **ya** 1, **ra** 2, **la** 3, **va** 4, **śa** 5, **ṣa** 6, **sa** 7, **ha** 8. Vowels do not count, and when consonants come together only the **last** one counts.\n\nA famous mnemonic begins **go-pī-bhā-gya-ma-dhu-vrā-ta**. Read the syllables in order. What number do they spell? (It begins like a well-known constant.)',
    hints: ['Take each syllable: go = ga = 3, pī = pa = 1, bhā = bha = 4 …', 'In *gya* and *vrā* two consonants come together, and only the last counts: ya = 1, ra = 2.'],
    explain: 'go 3, pī 1, bhā 4, gya 1, ma 5, dhu 9, vrā 2, ta 6: **31415926**, the digits of **π**. The whole verse gives 32 digits, and it is at the same time a prayer to Krishna and the gopis. A schoolchild in Kerala could keep the constant in a line of poetry.',
    data: { ask: 'What number?', answer: { num: 31415926 }, glyph: 'गो' },
    concepts: ['alphabetic-numerals', 'place-value'], links: ['lore-bhutasankhya', 'lore-aryabhata']
  },

  /* ---------- China ---------- */
  {
    id: 'lore-luoshu', title: 'The Turtle’s Square', diff: 3,
    source: 'The Luoshu, the ancient Chinese magic square of legend; the rhyme is recorded in early Chinese writings on numbers (the *Shushu jiyi* and its commentary).',
    text: 'The legend says that when the great Yu was taming the floods of China, a turtle rose from the river Luo with a pattern of dots on its shell: the **Luoshu**, the oldest magic square in the world. An old rhyme tells where its numbers sit: *“Nine on the head, one at the feet; three on the left, seven on the right; two and four are the shoulders, six and eight are the feet; five in the middle.”*\n\nEvery row, every column and both diagonals add up to **15**. The picture shows the nine numbers with the four corners hidden. Give the four corners in this order: top-left, top-right, bottom-left, bottom-right.',
    hints: ['The shoulders are two and four, and the feet are six and eight. Which of each pair is at the left?', 'The left column is ? + 3 + ? = 15, so the two left corners add to 12.'],
    explain: 'The left corners must add to 12, and the only way is 4 (top) and 8 (bottom); the right corners add up to 8, so 2 (top) and 6 (bottom). The square is **4 9 2 / 3 5 7 / 8 1 6**. The centre is always 5 in a 3 × 3 magic square, and this is the only one, apart from turning and flipping it. (The cabinet has the same square laid out in cards: [[f:card-arrangements|card arrangements]].)',
    data: { ask: 'The four corners, in order:', answer: { nums: [4, 2, 8, 6], ordered: true }, glyph: '洛', figure: LUOSHU },
    concepts: ['magic-constant'], links: ['lore-sexagenary']
  },
  {
    id: 'lore-sexagenary', title: 'Sixty Years, Not One Hundred and Twenty', diff: 3,
    source: 'The Chinese sexagenary cycle of the ten “heavenly stems” and twelve “earthly branches”, in use for naming years for more than two thousand years.',
    text: 'Chinese years are named by a **pair**: one of ten heavenly stems and one of twelve earthly branches, both taken in order and both starting again after the last. The year 2026 is a **Bǐng-wǔ** (丙午) year: the stem *bǐng* (fire) together with the branch *wǔ* (the horse), the “Fire Horse”.\n\nIn what year will a Bǐng-wǔ year come again?',
    hints: ['The horse comes back every 12 years. The stem *bǐng* comes back every 10 years.', 'You need a number that both 10 and 12 divide.'],
    explain: 'Both cycles must come round together: the smallest number divisible by 10 and 12 is 60, so the same pair recurs every **60 years**, and the next Fire Horse is **2086**. (There are only 60 pairs, not 10 × 12 = 120, because a stem and a branch always advance together: only stems and branches of the same parity, yin or yang, meet.) In Japan the Fire Horse year, *hinoe-uma*, was thought unlucky for girls born in it, and 1966 saw a sharp fall in the birth rate.',
    data: { ask: 'Which year?', answer: { num: 2086 }, traps: [{ match: 2038, msg: 'That is a Horse year, since horses come every 12 years, but with a different stem. The pair needs 10 and 12 to meet.' }, { match: 2036, msg: 'The stem comes back after 10 years, but then the animal is different. Both must return together.' }], glyph: '午' },
    concepts: ['calendar-cycles', 'gcd'], links: ['lore-calendar-round', 'lore-luoshu']
  },
  {
    id: 'lore-myriads', title: 'Counting in Ten-Thousands', diff: 3,
    source: 'The number words of Chinese, Japanese and Korean, which group large numbers in fours (myriads) rather than threes.',
    text: 'English groups big numbers in threes: thousand, million, billion. Chinese groups them in **fours**: the unit of **10,000** is 万 (*wàn*), and the next unit, 亿 (*yì*), is 10,000 × 10,000 = 100,000,000.\n\nHow many is **二亿五千万** (*èr yì wǔ qiān wàn*: “two *yì*, five thousand *wàn*”)?',
    hints: ['Two *yì* is 200,000,000.', 'Five thousand *wàn* is 5,000 × 10,000.'],
    explain: '2 × 100,000,000 + 5,000 × 10,000 = 200,000,000 + 50,000,000 = **250,000,000**. English speakers say “two hundred and fifty million” for the same number, and each language finds the other’s grouping awkward. It is a good example of how the words you count with change the way big numbers look.',
    data: { answer: { num: 250000000 }, traps: [{ match: 25000000, msg: 'Check the zeros: a *yì* is a hundred million, so two *yì* alone is 200,000,000.' }], glyph: '亿' },
    concepts: ['number-bases']
  },
  {
    id: 'lore-zhuangzi-stick', title: 'The Foot-Long Stick', diff: 3,
    source: 'The *Zhuangzi*, chapter 33 (“The World”), which reports the paradoxes of the school of the Chinese debaters: “Take half of a foot-long stick each day, and in ten thousand generations you will not run out.”',
    text: 'A paradox of the ancient Chinese debaters: **take a stick one foot long, and each day cut off half of what is left. It will never be used up, though you do this for ten thousand generations.**\n\nA foot (*chǐ*) is 10 *cùn* (inches). After **6 days** of cutting, how long is the piece that is left? Give the length in *cùn*; a fraction is fine.',
    hints: ['After day 1, 5 cùn are left. After day 2, half of that.', 'The length is 10 divided by 2, six times.'],
    explain: '10 ÷ 2⁶ = 10 ÷ 64 = 5/32 = **0.15625 cùn**. Every day half of what is left goes, and something always remains: the stick is never used up, though it soon becomes too small to see. It is the same reasoning as Zeno’s runner ([[num-achilles]]), which the Greeks were making at about the same time.',
    data: { answer: { num: 0.15625, unit: 'cun' }, traps: [{ match: 0.3125, msg: 'That is the length after five days. One more cut.' }, { match: 0.078125, msg: 'That is the length after seven days. One cut too many.' }], glyph: '尺' },
    concepts: ['geometric-series'], links: ['num-achilles']
  },

  /* ---------- calendars ---------- */
  {
    id: 'lore-calendar-round', title: 'When the Two Calendars Meet', diff: 4,
    source: 'The Maya *Calendar Round*: the 260-day sacred round (*tzolk’in*) and the 365-day year (*haab’*), used across Mesoamerica.',
    text: 'The Maya kept two calendars at once. The sacred round, the **tzolk’in**, had 260 days (13 numbers running alongside 20 day-names). The **haab’** had 365 days. Every day had a name in each.\n\nIf both count from the same day, after how many days do both calendars begin again together?',
    hints: ['You need the smallest number that both 260 and 365 divide.', '260 = 4 × 5 × 13 and 365 = 5 × 73. Take each prime factor at its highest power.'],
    explain: 'The lowest common multiple of 260 and 365 is 4 × 5 × 13 × 73 = **18,980 days**, which is 52 haab’ years and 73 sacred rounds. The Maya (like the Aztecs) called this stretch of 52 years the Calendar Round, and its end was marked by a great ceremony: a person’s date came round again only once, or at most twice, in a lifetime.',
    data: { answer: { num: 18980, unit: 'days' }, traps: [{ match: 94900, msg: 'That is 260 × 365, a common multiple but not the lowest: 260 and 365 share a factor of 5.' }, { match: 365, msg: 'The year alone comes round in 365, but the sacred round does not.' }], glyph: '52' },
    concepts: ['calendar-cycles', 'gcd'], links: ['lore-maya-longcount', 'lore-sexagenary']
  },
  {
    id: 'lore-metonic', title: 'Nineteen Years, 235 Moons', diff: 3,
    source: 'The Jewish calendar, which fits twelve or thirteen lunar months to the year, in a nineteen-year cycle known to the Babylonians and to Meton of Athens (432 BC).',
    text: 'The Jewish calendar follows the moon and the sun together. An ordinary year has **12** lunar months, and a leap year has **13**. In every cycle of 19 years, **7** are leap years (the 3rd, 6th, 8th, 11th, 14th, 17th and 19th).\n\nHow many lunar months are there in the whole cycle?',
    hints: ['There are 12 ordinary years and 7 leap years in the cycle.', '12 × 12, plus 7 × 13.'],
    explain: '12 × 12 + 7 × 13 = 144 + 91 = **235** months. That number is chosen because 235 moons last 6,939.7 days and 19 years last 6,939.6 days: the moon and the sun agree to within two hours in nineteen years. Babylonian astronomers knew it, and the Greek astronomer Meton put it to use in Athens. The Hebrew calendar and the date of Easter both depend on it.',
    data: { answer: { num: 235, unit: 'months' }, traps: [{ match: 228, msg: '12 × 19 counts every year as ordinary. Seven of them have a thirteenth month.' }], glyph: '235' },
    concepts: ['calendar-cycles']
  },

  /* ---------- the Middle East: the camels ---------- */
  {
    id: 'lore-camels-17', title: 'Seventeen Camels', diff: 3,
    source: 'A traditional inheritance problem of the Middle East, told in many versions in the Arab world and Persia.',
    text: 'A father dies and leaves 17 camels to his three sons. His will says that the eldest is to have **half** of them, the second **a third**, and the youngest **a ninth**. The sons cannot divide 17 in half, or in thirds, without cutting camels, and they quarrel.\n\nA wise man rides by, and hears the argument. He says, “I will lend you my camel,” and puts it with the rest, making 18. He then gives out the shares, and the sons are all content.\n\nHow many camels does each of the three sons receive, eldest first?',
    hints: ['With the borrowed camel, there are 18 to share.', 'Half of 18, a third of 18, and a ninth of 18.'],
    explain: 'The shares of 18 are **9, 6 and 2**, which add up to 17. So 17 camels are shared, and the wise man’s own camel is left over, and he rides off on it. Each brother received a bit more than his true share, since ½ + ⅓ + ⅑ is only 17/18 of the herd. The puzzle depends on the fractions not adding up to a whole. Malba Tahan told a version with 35 camels: [[lore-camels-35]].',
    data: { ask: 'The three shares, eldest first:', answer: { nums: [9, 6, 2], ordered: true }, traps: [{ match: '8.5, 5.67, 1.89', msg: 'Those are the shares without the borrowed camel: they are not whole numbers, and that is the trouble.' }], glyph: '🐪' },
    concepts: ['lateral'], links: ['lore-camels-35']
  },
  {
    id: 'lore-camels-35', title: 'Thirty-Five Camels', diff: 2,
    source: 'Malba Tahan (the pen-name of the Brazilian teacher Júlio César de Mello e Souza), *O Homem que Calculava* (“The Man Who Counted”, 1938), which retells the old camel story.',
    text: 'In a Brazilian book of 1938 the old tale is told again, with 35 camels. The eldest son is to have half, the second a third, and the youngest a ninth. The calculator Beremiz lends his own camel, and there are now 36.\n\nWhen the three shares of the 36 camels have been handed out, how many camels are **left over**?',
    hints: ['Share out 36: half, a third, a ninth.', 'The shares are 18, 12 and 4; how many is that in all?'],
    explain: '18 + 12 + 4 = 34, so **2 camels** are left over. Beremiz took back his own camel, and said that the other one was his payment for the arithmetic. With 35 camels the trick works because the three fractions ½, ⅓ and ⅑ add to 17/18, and 36 is the smallest herd that all three can divide.',
    data: { ask: 'How many are left over?', answer: { num: 2, unit: 'camels' }, traps: [{ match: 1, msg: 'One is Beremiz’s own, but a second is left over: 18 + 12 + 4 is less than 36 by more than one.' }], glyph: '35' },
    concepts: ['lateral'], links: ['lore-camels-17']
  },

  /* ---------- other scripts, other digits ---------- */
  {
    id: 'lore-devanagari-1947', title: 'A Year in Devanagari', diff: 1,
    source: 'The Devanagari digits, used for Hindi, Marathi and Nepali, descendants of the Brahmi numerals of India from which our own digits come.',
    text: 'Our digits came from India, and India still uses forms of them. In Devanagari, the script of Hindi, the digits 0 to 9 are: **० १ २ ३ ४ ५ ६ ७ ८ ९**.\n\nThe year that India became independent is written **१९४७**. What year is it?',
    hints: ['Match the digits one by one against the row: १, ९, ४, ७.', 'They are written from the left, with the thousands first, just as we write.'],
    explain: '**1947**, the year of independence. The digits of India spread through the Arab world to Europe, where they were known as “Arabic numerals”: what we call 4 and 7 and 9 are recognisably cousins of ४, ७ and ९.',
    data: { answer: { num: 1947 }, glyph: '१९४७' },
    concepts: ['place-value'], links: ['lore-arabic-504']
  },
  {
    id: 'lore-arabic-504', title: 'Digits from Right to Left', diff: 2,
    source: 'The Eastern Arabic-Indic digits, in use in Egypt, Syria, Iraq and other Arabic-speaking countries (and, in a variant form, in Iran).',
    text: 'In the east of the Arab world the digits are: **٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩** (0 to 9). Arabic is written from right to left, but **numbers are written from the left**, with the biggest place first, as in our own.\n\nThe round shape ٥ looks like our 0, and the zero, ٠, is only a dot. What number is **٥٠٤**?',
    hints: ['Read the digits: ٥ is five, ٠ is the dot, ٤ is four.', 'Do not be tricked by the shape ٥.'],
    explain: '**504**: five hundreds, no tens (the dot), and four. The trap is the ٥ that looks like our zero, and the zero that looks like a full stop. The digits used in the West are a different branch of the same family from those used in the east of the Arab world.',
    data: { answer: { num: 504 }, traps: [{ match: 4, msg: 'The first digit ٥ is a five, not a zero.' }, { match: 5, msg: 'The dot is a zero: it makes the digits on either side worth ten times more.' }], glyph: '٥٠٤' },
    concepts: ['place-value'], links: ['lore-devanagari-1947']
  },
  {
    id: 'lore-thai-2569', title: 'A Year in the Buddhist Era', diff: 3,
    source: 'The Thai digits and the Thai Buddhist Era (BE), in which the year 1 corresponds to 543 BC; used in Thailand’s official calendar.',
    text: 'Thailand counts its years from the death of the Buddha, in the Buddhist Era, which is **543 years ahead** of the Gregorian calendar. The Thai digits 0 to 9 are: **๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙**.\n\nA Thai calendar shows the year **๒๕๖๙**. Which year is it in the Gregorian calendar?',
    hints: ['First read the digits: ๒ is 2, ๕ is 5, ๖ is 6, ๙ is 9.', 'Subtract 543.'],
    explain: 'The digits read **2569**, and 2569 − 543 = **2026**. Thai newspapers and government papers use the Buddhist year, and visitors can be confused when they see a date more than five hundred years in the future.',
    data: { ask: 'The Gregorian year:', answer: { num: 2026 }, traps: [{ match: 2569, msg: 'That is the year as it is written. It counts from the Buddha, 543 years earlier than the Gregorian year zero.' }, { match: 3112, msg: 'You have added 543. The Thai count is ahead, so you have to subtract.' }], glyph: '๒๕๖๙' },
    concepts: ['place-value']
  },
  {
    id: 'lore-geez-2016', title: 'A Year in Ethiopia', diff: 3,
    source: 'The Ethiopic (Ge’ez) numerals, used in Ethiopia and Eritrea, with the Ethiopian calendar, which runs about seven or eight years behind the Gregorian one.',
    text: 'The Ethiopic numerals have separate signs for 1 to 9: **፩ ፪ ፫ ፬ ፭ ፮ ፯ ፰ ፱**; for the tens 10 to 90: **፲ ፳ ፴ ፵ ፶ ፷ ፸ ፹ ፺**; and for 100: **፻**. A number written before ፻ multiplies it, so **፳፻** is 20 hundreds. There is no zero.\n\nThe number **፳፻፲፮** is the Ethiopian calendar year that began in September 2023. What number is it?',
    hints: ['Read the first two signs together: ፳ is 20 and ፻ multiplies: twenty hundreds.', 'Then add ፲ (10) and ፮ (6).'],
    explain: '፳፻ = 20 × 100 = 2,000, and ፲ ፮ adds 10 and 6: **2,016**. The Ethiopian calendar has 13 months (twelve of 30 days and a short one of 5 or 6) and begins in September, which puts its year seven or eight behind ours. The numerals are thought to come from Greek letters, and the Church has kept them in use.',
    data: { answer: { num: 2016 }, traps: [{ match: 2000, msg: 'You have the first part. Add the two signs after it.' }, { match: 26, msg: 'The sign ፻ multiplies the number in front of it: twenty hundreds.' }], glyph: '፳፻' },
    concepts: ['place-value']
  },

  /* ---------- number words ---------- */
  {
    id: 'lore-danish-halvfems', title: 'Half-Fifth Twenties', diff: 3,
    source: 'The Danish number words, which count in twenties from fifty to ninety.',
    text: 'The Danes count in **twenties**, and in halves of twenties. *Halvtreds* (50) means “half-third times twenty”, 2½ × 20. *Tres* (60) is 3 × 20. *Halvfjerds* (70) is “half-fourth times twenty”, 3½ × 20. *Firs* (80) is 4 × 20.\n\nWhat number is ***halvfems***, “half-fifth times twenty”?',
    hints: ['“Half-fifth” means half way to the fifth twenty: 4½.', '4½ × 20.'],
    explain: '4½ × 20 = **90**. The Danes are hardly alone: French says *quatre-vingts* (four twenties) for 80, and *quatre-vingt-quinze* for 95. A Dane learning to tell a price has to do a sum every time.',
    data: { answer: { num: 90 }, traps: [{ match: 80, msg: '“Half-fifth” is not four twenties: it is halfway from the fourth twenty to the fifth.' }, { match: 100, msg: 'Five twenties would be a hundred, but it is “half” of the way to the fifth, not the whole way.' }], glyph: '90' },
    concepts: ['number-bases']
  },
  {
    id: 'lore-zulu-eight', title: 'Leaving Two', diff: 1,
    source: 'The number words of isiZulu, of southern Africa, of which those for 6 to 9 are taken from finger counting.',
    text: 'In isiZulu the numbers from six to nine are named from the fingers. After counting to five on one hand you begin again: **6** is *isithupha*, “the thumb”; **7** is *isikhombisa*, “the pointer” (the index finger). Then come **8**, *isishiyagalombili*, “leaving two”, and **9**, *isishiyagalolunye*, “leaving one”.\n\nThe “leaving” refers to the fingers not used, out of a full ten. What number is “leaving two”?',
    hints: ['You have ten fingers altogether.', 'Ten, leaving two out.'],
    explain: 'Ten fingers, with two left out, is **8**, and “leaving one” is 9. The Zulu number words are a small piece of the history of counting on fingers: a great many languages built their words for numbers from the hand.',
    data: { answer: { num: 8 }, glyph: '8' },
    concepts: ['number-bases']
  },
  {
    id: 'lore-yoruba-35', title: 'Five Less than Forty', diff: 3,
    source: 'The number words of Yoruba, of Nigeria and Benin, which count in twenties and use subtraction for many numbers.',
    text: 'The Yoruba language counts mainly in **twenties**, and it likes to **subtract**. Fifteen is said as “five less than twenty”, and twenty-five as “five less than thirty”.\n\nHow does a Yoruba speaker say **thirty-five**, in the same pattern?',
    hints: ['Twenty-five is five less than the next ten.', 'The next ten above thirty-five is forty.'],
    explain: 'Thirty-five is “**five less than forty**”, 45 is “five less than fifty”, and so on: a Yoruba speaker subtracts five whenever the number is 5 short of the next ten. The Yoruba system has a subtraction for many numbers, and a person who speaks it does a small sum for each word.',
    data: {
      ask: 'How is 35 said?',
      answer: { choice: 0, choices: ['Five less than forty', 'Five more than thirty', 'Twenty and fifteen', 'Three tens and five'] },
      traps: [{ match: 1, msg: 'That would be the English pattern. Yoruba uses subtraction here.' }, { match: 2, msg: 'That is a correct sum, but not the Yoruba pattern.' }, { match: 3, msg: 'That is more like the Chinese system. Yoruba subtracts instead.' }],
      glyph: '35'
    },
    concepts: ['number-bases']
  },
  {
    id: 'lore-zero-word', title: 'Where Zero Came From', diff: 2,
    source: 'The history of the words “zero” and “cipher”, from Sanskrit *śūnya* through Arabic *ṣifr* and Latin and Italian.',
    text: 'The idea of zero as a number came from India, with the Sanskrit word *śūnya*, “empty” or “void”. The Arabs translated it into their own word for “empty”. Two English words go back to that Arabic word.\n\nWhich two?',
    hints: ['One means nothing, and one means a secret code.', 'The Arabic word is *ṣifr*.'],
    explain: '**Zero** and **cipher**: both come from the Arabic *ṣifr*, “empty”, which translated the Sanskrit *śūnya*. When the Italian merchants took the word *zefiro* they shortened it to *zero*, and the French *chiffre* gave “cipher”, a digit and then a secret code, because the new numerals seemed to the Europeans like a secret writing.',
    data: {
      ask: 'Which two words?',
      answer: { choice: 0, choices: ['Zero and cipher', 'Digit and figure', 'Number and numeral', 'Nought and null'] },
      traps: [{ match: 3, msg: '“Nought” is an English word and “null” comes from Latin. The Arabic *ṣifr* gave a different pair.' }],
      glyph: '0'
    },
    concepts: ['place-value'], links: ['lore-bhutasankhya']
  },

  /* */
].map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));

})();
