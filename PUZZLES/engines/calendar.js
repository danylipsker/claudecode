/* The Puzzle Cabinet · engines/calendar.js
 *
 * Calendar puzzles: what day of the week, Conway's Doomsday rule, days between
 * two dates, leap years, calendars that repeat, Friday the 13th, the switch
 * from the Julian to the Gregorian calendar, Easter, and the two calendar cubes.
 *
 * The board is a desk almanac you can turn, month by month and year by year —
 * but it only covers the years the puzzle allows (pages beyond it are blank
 * ledgers without weekdays), so it never gives an answer away. Once solved it
 * opens up and turns to the page in question. Beside it, the Doomsday card
 * works the rule through step by step, one step per hint.
 *
 * Every answer is recomputed by verify() from data.q with the arithmetic below
 * (Julian day numbers; the proleptic Gregorian calendar, the Julian calendar,
 * and the switches in Rome 1582, Britain 1752 and Russia 1918).
 *
 * data: {
 *   kind: 'weekday' | 'number' | 'date' | 'choice' | 'multi' | 'cubes',
 *   q: { … }                what the answer is (see calc() below)
 *   ans                     weekday 0-6 (Sunday 0) | number | [y, m, d] | choice index | [indices]
 *   choices, vals           choice / multi: the texts, and the value each one stands for
 *   unit                    number: shown after the box
 *   year                    date: the year assumed when the answer leaves it out
 *   cal: { from, to, style, at: [y, m], marks: [[y, m, d, kind]], dd } | null
 *                           the almanac: the years it covers, its calendar ('g' Gregorian,
 *                           'j' Julian, 'uk' 'rome' 'ru' with their switch), the page it opens
 *                           on, marked dates ('t' the date asked, 'a' a given anchor), dd: show
 *                           the doomsdays from the start
 *   after: [y, m]           the page the almanac turns to once solved
 *   card: { date: [y, m, d], style, show } | { year } | null
 *                           the Doomsday card (show: steps visible from the start; 0 = closed)
 *   traps: [{ match, msg }] wrong answers that deserve a word
 *   cubes: six (a 6 turned over is a 9), fixed: [[…] | null, [...] | null]
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* =====================================================================
   * the arithmetic of calendars
   * ===================================================================== */

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MON3 = MONTHS.map((m) => m.slice(0, 3));
  const WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const WD3 = WD.map((w) => w.slice(0, 3));
  const fdiv = (a, b) => Math.floor(a / b);
  const mod = (a, n) => ((a % n) + n) % n;

  const leapG = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const leapJ = (y) => y % 4 === 0;

  // Julian day numbers (the count of days used by astronomers)
  function jdnG(y, m, d) {
    const a = fdiv(14 - m, 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    return d + fdiv(153 * mm + 2, 5) + 365 * yy + fdiv(yy, 4) - fdiv(yy, 100) + fdiv(yy, 400) - 32045;
  }
  function jdnJ(y, m, d) {
    const a = fdiv(14 - m, 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    return d + fdiv(153 * mm + 2, 5) + 365 * yy + fdiv(yy, 4) - 32083;
  }
  function fromG(j) {
    const a = j + 32044, b = fdiv(4 * a + 3, 146097), c = a - fdiv(146097 * b, 4);
    const d = fdiv(4 * c + 3, 1461), e = c - fdiv(1461 * d, 4), m = fdiv(5 * e + 2, 153);
    return [100 * b + d - 4800 + fdiv(m, 10), m + 3 - 12 * fdiv(m, 10), e - fdiv(153 * m + 2, 5) + 1];
  }
  function fromJ(j) {
    const c = j + 32082, d = fdiv(4 * c + 3, 1461), e = c - fdiv(1461 * d, 4), m = fdiv(5 * e + 2, 153);
    return [d - 4800 + fdiv(m, 10), m + 3 - 12 * fdiv(m, 10), e - fdiv(153 * m + 2, 5) + 1];
  }

  // calendars: g = Gregorian (also before 1582: "proleptic"), j = Julian, and three switches
  const STYLES = {
    g: { name: 'Gregorian calendar' },
    j: { name: 'Julian calendar (Old Style)', julian: true },
    rome: { name: 'Rome: Julian to 4 October 1582, then Gregorian', lastJ: [1582, 10, 4], firstG: [1582, 10, 15] },
    uk: { name: 'Britain: Julian to 2 September 1752, then Gregorian', lastJ: [1752, 9, 2], firstG: [1752, 9, 14] },
    ru: { name: 'Russia: Julian to 31 January 1918, then Gregorian', lastJ: [1918, 1, 31], firstG: [1918, 2, 14] }
  };
  const cmp = (a, b) => (a[0] - b[0]) || (a[1] - b[1]) || (a[2] - b[2]);
  const sameDate = (a, b) => !!a && !!b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

  // the day number of a date in a calendar, or null if there was no such day
  function jdn(style, y, m, d) {
    const S = STYLES[style || 'g'] || STYLES.g;
    if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d) || m < 1 || m > 12 || d < 1 || d > 31) return null;
    let j, back;
    if (S.julian || (S.lastJ && cmp([y, m, d], S.lastJ) <= 0)) { j = jdnJ(y, m, d); back = fromJ(j); }
    else if (S.lastJ && cmp([y, m, d], S.firstG) < 0) return null;
    else { j = jdnG(y, m, d); back = fromG(j); }
    return sameDate(back, [y, m, d]) ? j : null;
  }
  function fromJdn(style, j) {
    const S = STYLES[style || 'g'] || STYLES.g;
    if (S.julian) return fromJ(j);
    if (S.lastJ && j <= jdnJ(S.lastJ[0], S.lastJ[1], S.lastJ[2])) return fromJ(j);
    return fromG(j);
  }
  const wdOfJdn = (j) => mod(j + 1, 7); // 0 = Sunday
  function weekday(style, y, m, d) { const j = jdn(style, y, m, d); return j == null ? null : wdOfJdn(j); }
  function addDays(style, date, n) { const j = jdn(style, date[0], date[1], date[2]); return j == null ? null : fromJdn(style, j + n); }
  function daysBetween(style, a, b) { const x = jdn(style, a[0], a[1], a[2]), y = jdn(style, b[0], b[1], b[2]); return x == null || y == null ? null : y - x; }

  // the days a month really had: [{ d, j, wd }]
  function monthDays(style, y, m) {
    const out = [];
    for (let d = 1; d <= 31; d++) { const j = jdn(style, y, m, d); if (j != null) out.push({ d, j, wd: wdOfJdn(j) }); }
    return out;
  }
  const monthLen = (style, y, m) => monthDays(style, y, m).length;
  function yearLen(style, y) { let n = 0; for (let m = 1; m <= 12; m++) n += monthLen(style, y, m); return n; }
  const isLeap = (style, y) => (style === 'j' ? leapJ(y) : leapG(y));

  // Easter Sunday: the "anonymous Gregorian algorithm" (Nature, 1876) and the Julian computus
  function easterG(Y) {
    const a = Y % 19, b = fdiv(Y, 100), c = Y % 100, d = fdiv(b, 4), e = b % 4, f = fdiv(b + 8, 25), g = fdiv(b - f + 1, 3);
    const h = (19 * a + b - d - g + 15) % 30, i = fdiv(c, 4), k = c % 4, l = mod(32 + 2 * e + 2 * i - h - k, 7), mm = fdiv(a + 11 * h + 22 * l, 451);
    const n = h + l - 7 * mm + 114;
    return [Y, fdiv(n, 31), (n % 31) + 1];
  }
  function easterJul(Y) { // a date in the Julian calendar
    const a = Y % 4, b = Y % 7, c = Y % 19, d = (19 * c + 15) % 30, e = mod(2 * a + 4 * b - d + 34, 7), n = d + e + 114;
    return [Y, fdiv(n, 31), (n % 31) + 1];
  }
  function easterO(Y) { const e = easterJul(Y); return fromG(jdnJ(e[0], e[1], e[2])); } // Orthodox Easter, as a Gregorian date

  // Conway's Doomsday rule
  const doomsday = (y, style) => weekday(style === 'j' ? 'j' : 'g', y, 4, 4);
  const anchor = (y, style) => doomsday(fdiv(y, 100) * 100, style);
  // the doomsday date of each month (common year / leap year)
  function ddDate(m, leap) { return [leap ? 4 : 3, leap ? 29 : 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12][m - 1]; }

  const f13 = (y) => { const out = []; for (let m = 1; m <= 12; m++) if (weekday('g', y, m, 13) === 5) out.push(m); return out; };
  function sameCal(a, b) { return leapG(a) === leapG(b) && weekday('g', a, 1, 1) === weekday('g', b, 1, 1); }
  function repeatYear(y, n) { let k = 0; for (let z = y + 1; z < y + 500; z++) if (sameCal(y, z) && ++k === (n || 1)) return z; return null; }
  function nthWd(y, m, wd, n) {
    const days = monthDays('g', y, m).filter((x) => x.wd === wd);
    const x = n < 0 ? days[days.length + n] : days[n - 1];
    return x ? [y, m, x.d] : null;
  }
  const gapDays = (y) => jdnJ(y, 3, 1) - jdnG(y, 3, 1); // how far the Julian calendar is behind, from 1 March of y
  function feb29After(y0, count) { const out = []; for (let y = y0 + 1; out.length < count; y++) if (leapG(y)) out.push(y); return out; }

  // over the 400-year Gregorian cycle
  const CYCLE0 = 2001;
  let f13Cache = null;
  function f13Stats() {
    if (f13Cache) return f13Cache;
    const byWd = [0, 0, 0, 0, 0, 0, 0];
    const perYear = [];
    let last = null, gap = 0;
    for (let y = CYCLE0; y < CYCLE0 + 400; y++) {
      let n = 0;
      for (let m = 1; m <= 12; m++) {
        const w = weekday('g', y, m, 13);
        byWd[w]++;
        if (w === 5) { n++; const k = y * 12 + m; if (last != null) gap = Math.max(gap, k - last); last = k; }
      }
      perYear.push(n);
    }
    return (f13Cache = { byWd, min: Math.min.apply(null, perYear), max: Math.max.apply(null, perYear), gap });
  }
  function feb29MaxGap() { let last = null, g = 0; for (let y = 1601; y <= 2400; y++) if (leapG(y)) { if (last != null) g = Math.max(g, y - last); last = y; } return g; }

  // the calendar cubes: can the two cubes show every day 01..31?
  const sym = (d, six) => (six && d === 9 ? 6 : d);
  function cubeShows(A, B, n, six) {
    const a = new Set(A.map((d) => sym(d, six))), b = new Set(B.map((d) => sym(d, six)));
    const t = sym(Math.floor(n / 10), six), u = sym(n % 10, six);
    return (a.has(t) && b.has(u)) || (b.has(t) && a.has(u));
  }
  function cubesMissing(A, B, six, need) {
    const out = [];
    for (let n = 1; n <= (need || 31); n++) if (!cubeShows(A, B, n, six)) out.push(n);
    return out;
  }
  function combos(list, k) {
    const out = [];
    const rec = (i, cur) => { if (cur.length === k) { out.push(cur.slice()); return; } for (let j = i; j < list.length; j++) { cur.push(list[j]); rec(j + 1, cur); cur.pop(); } };
    rec(0, []);
    return out;
  }
  let cubeCache = {};
  function cubeSolutions(six) {
    const key = six ? 's' : 'n';
    if (cubeCache[key]) return cubeCache[key];
    const digits = six ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const faces = combos(digits, 6);
    const out = [];
    for (let i = 0; i < faces.length; i++) for (let j = i; j < faces.length; j++) if (!cubesMissing(faces[i], faces[j], six).length) out.push([faces[i], faces[j]]);
    return (cubeCache[key] = out);
  }

  // what an answer is, worked out afresh from data.q
  function calc(q) {
    const st = q.cal || 'g';
    if (q.wd) return weekday(st, q.wd[0], q.wd[1], q.wd[2]);
    if (q.easterWd) return weekday('g', ...easterG(q.easterWd));
    if (q.dd != null) return doomsday(q.dd, st);
    if (q.anchor != null) return anchor(q.anchor, st);
    if (q.days) return daysBetween(st, q.days[0], q.days[1]);
    if (q.add) return addDays(st, q.add[0], q.add[1]);
    if (q.easter != null) return easterG(q.easter);
    if (q.easterO != null) return easterO(q.easterO);
    if (q.golden != null) return (q.golden % 19) + 1;
    if (q.easterMin) { let b = null; for (let y = q.easterMin[0]; y <= q.easterMin[1]; y++) { const e = easterG(y); if (!b || e[1] * 100 + e[2] < b[1] * 100 + b[2]) b = e; } return b; }
    if (q.easterMax) { let b = null; for (let y = q.easterMax[0]; y <= q.easterMax[1]; y++) { const e = easterG(y); if (!b || e[1] * 100 + e[2] > b[1] * 100 + b[2]) b = e; } return b; }
    if (q.easterOn) { const [y0, y1, m, d] = q.easterOn; let n = 0; for (let y = y0; y <= y1; y++) { const e = easterG(y); if (e[1] === m && e[2] === d) n++; } return n; }
    if (q.f13 != null) return f13(q.f13).length;
    if (q.f13stat) { const s = f13Stats(); return q.f13stat === 'most' ? s.byWd.indexOf(Math.max.apply(null, s.byWd)) : s[q.f13stat]; }
    if (q.f13start) return mod(5 - 12, 7);
    if (q.repeat != null) return repeatYear(q.repeat, q.n || 1);
    if (q.leapCount) { let n = 0; for (let y = q.leapCount[0]; y <= q.leapCount[1]; y++) if (isLeap(st, y)) n++; return n; }
    if (q.feb29) { let n = 0; for (let y = q.feb29[0] + 1; y <= q.feb29[0] + q.feb29[1]; y++) if (leapG(y)) n++; return n; }
    if (q.feb29nth) { const ys = feb29After(q.feb29nth[0], q.feb29nth[1]); return q.age ? ys[ys.length - 1] - q.feb29nth[0] : ys[ys.length - 1]; }
    if (q.feb29gap) return feb29MaxGap();
    if (q.conv) return fromJdn(q.to || 'g', jdn(q.from || 'j', q.conv[0], q.conv[1], q.conv[2]));
    if (q.gapDays != null) return gapDays(q.gapDays);
    if (q.gapYear != null) { for (let y = 200; y < 4000; y++) if (gapDays(y) >= q.gapYear) return y; return null; }
    if (q.nth) return nthWd(q.nth[0], q.nth[1], q.nth[2], q.nth[3]);
    if (q.count) { const [y, m, w] = q.count; let n = 0; (m ? [m] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).forEach((mm) => { n += monthDays(st, y, mm).filter((x) => x.wd === w).length; }); return n; }
    if (q.monthLen) return monthLen(q.monthLen[2] || st, q.monthLen[0], q.monthLen[1]);
    if (q.yearLen) return yearLen(q.yearLen[1] || st, q.yearLen[0]);
    if (q.days400) return jdnG(2400, 1, 1) - jdnG(2000, 1, 1);
    if (q.weeks400) return (jdnG(2400, 1, 1) - jdnG(2000, 1, 1)) / 7;
    if (q.avgYear) return (jdnG(2400, 1, 1) - jdnG(2000, 1, 1)) / 400;
    if (q.cubes === 'count') return cubeSolutions(!!q.six).length;
    if (q.cubes === 'possible') return cubeSolutions(!!q.six).length > 0;
    return undefined;
  }

  // multi: which of the vals satisfy the predicate
  function pred(q, v) {
    switch (q.pred) {
      case 'leap': return isLeap(q.cal || 'g', v);
      case 'f13': return weekday('g', q.y, v, 13) === 5;
      case 'five': return monthDays('g', q.y, v).filter((x) => x.wd === q.wd).length === 5;
      case 'sameEaster': return sameDate(easterG(v), easterO(v));
      case 'sameCal': return sameCal(q.y, v);
      case 'cubeBoth': { const sols = cubeSolutions(!!q.six); return sols.length > 0 && sols.every(([A, B]) => A.includes(v) && B.includes(v)); }
      case 'f13type': { // a year that begins on weekday w (leap or not): which months have a Friday the 13th
        for (let y = 2001; y < 2401; y++) if (weekday('g', y, 1, 1) === q.w && leapG(y) === !!q.leap) return weekday('g', y, v, 13) === 5;
        return false;
      }
      default: return false;
    }
  }
  function calcMulti(q, vals) { const out = []; vals.forEach((v, i) => { if (pred(q, v)) out.push(i); }); return out; }

  /* =====================================================================
   * words: dates, weekdays, reading answers
   * ===================================================================== */

  const fmtDate = (a, noYear) => (a ? a[2] + ' ' + MONTHS[a[1] - 1] + (noYear ? '' : ' ' + a[0]) : '?');
  const ordinal = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  const plus = (w, n) => WD[mod(w + n, 7)];

  function monthOf(word) {
    const w = word.toLowerCase().replace(/\.$/, '');
    if (w.length < 3) return 0;
    for (let i = 0; i < 12; i++) if (MONTHS[i].toLowerCase().startsWith(w)) return i + 1;
    if (w === 'sept') return 9;
    return 0;
  }
  // "13 April 2031", "April 13, 2031", "13 Apr", "2031-04-13", "13/4/2031", "13.4.2031" -> [y, m, d] (y may be null)
  function parseDate(s) {
    s = String(s || '').trim().toLowerCase().replace(/(\d)(st|nd|rd|th)\b/g, '$1').replace(/,/g, ' ').replace(/\bof\b/g, ' ').replace(/\s+/g, ' ').trim();
    let m;
    if ((m = /^(\d{3,4})-(\d{1,2})-(\d{1,2})$/.exec(s))) return [+m[1], +m[2], +m[3]];
    if ((m = /^(\d{1,2})[/.](\d{1,2})(?:[/.](\d{3,4}))?$/.exec(s))) return [m[3] ? +m[3] : null, +m[2], +m[1]];
    const parts = s.split(' ');
    let d = null, mo = 0, y = null;
    for (const t of parts) {
      if (/^\d+$/.test(t)) { const n = +t; if (n > 31 || t.length >= 3) y = n; else if (d == null) d = n; else y = n; }
      else if (monthOf(t)) mo = monthOf(t);
      else if (!/^(ad|ce|the|on|in)$/.test(t)) return null;
    }
    if (!mo || d == null) return null;
    return [y, mo, d];
  }
  function readNum(v) {
    const s = String(v).trim().replace(/[−–]/g, '-').replace(/(\d)[,\s](?=\d{3}\b)/g, '$1').replace(/\s*[a-z]+\.?$/i, '');
    return /^-?\d+(\.\d+)?$/.test(s) ? +s : NaN;
  }

  /* ---------- the Doomsday card: the rule worked through for one date ---------- */

  function ddSteps(date, style) {
    const [y, m, d] = date;
    const jul = style === 'j';
    const c = fdiv(y, 100), t = y % 100, a = fdiv(t, 12), b = t % 12, e = fdiv(b, 4);
    const A = anchor(y, jul ? 'j' : 'g'), D = doomsday(y, jul ? 'j' : 'g');
    const leap = jul ? leapJ(y) : leapG(y);
    const dm = ddDate(m, leap), diff = d - dm;
    const w = mod(D + diff, 7);
    const steps = [];
    steps.push({
      head: 'Century anchor for ' + c + '··',
      lines: [jul ? 'Julian calendar: every century the anchor steps back one day.' : '1800 Fri · 1900 Wed · 2000 Tue · 2100 Sun, then round again every 400 years.'],
      result: WD[A]
    });
    const sum = a + b + e;
    steps.push({
      head: 'The doomsday of ' + y,
      lines: [String(t).padStart(2, '0') + ' = ' + a + ' × 12 + ' + b + ';  ' + b + ' ÷ 4 → ' + e,
        a + ' + ' + b + ' + ' + e + ' = ' + sum + (sum >= 7 ? ' = ' + fdiv(sum, 7) + ' × 7 + ' + (sum % 7) : '') + ';  ' + WD3[A] + ' + ' + (sum % 7)],
      result: WD[D]
    });
    const where = dm + ' ' + MONTHS[m - 1];
    const why = m === 1 ? (leap ? '(4 January in a leap year)' : '(3 January in a common year)') : m === 2 ? '(the last day of February)' : m === 3 ? '(Pi Day, 3/14)' : [4, 6, 8, 10, 12].includes(m) ? '(' + m + '/' + m + ')' : '(' + m + '/' + dm + ': 9-to-5 at the 7-Eleven)';
    const dist = Math.abs(diff);
    steps.push({
      head: d + ' ' + MONTHS[m - 1] + ' ' + y,
      lines: [where + ' ' + why + ' is a ' + WD[D] + '.',
        diff === 0 ? 'The very date: no counting needed.' : d + ' ' + MON3[m - 1] + ' is ' + dist + ' day' + (dist > 1 ? 's' : '') + (diff > 0 ? ' later' : ' earlier') + (dist >= 7 ? '; ' + dist + ' = ' + fdiv(dist, 7) + ' × 7 + ' + (dist % 7) : '') + ';  ' + WD3[D] + (diff > 0 ? ' + ' : ' − ') + (dist % 7)],
      result: WD[w]
    });
    return steps;
  }
  const DD_STRIP = 'Jan 3 (4) · Feb 28 (29) · Mar 14 · Apr 4 · May 9 · Jun 6 · Jul 11 · Aug 8 · Sep 5 · Oct 10 · Nov 7 · Dec 12';

  function wrap(text, n) {
    const out = [];
    let line = '';
    String(text).split(' ').forEach((w) => {
      if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w;
    });
    if (line) out.push(line);
    return out;
  }

  /* =====================================================================
   * the almanac: a desk calendar you can turn
   * ===================================================================== */

  const PW = 700, HEAD = 128, STRIP = 34, WROW = 40, CW = 100, CH = 72;
  const PAGE_H = HEAD + STRIP + WROW + 6 * CH + 14;

  function Almanac(ctx, parent, opt) {
    const S = ctx.s;
    const g = S('g', { class: 'al' }, parent);
    S('rect', { x: 8, y: 12, width: PW, height: PAGE_H, rx: 14, class: 'al-shadow' }, g);
    S('rect', { x: 4, y: 6, width: PW, height: PAGE_H, rx: 14, class: 'al-under' }, g);
    const pagesG = S('g', {}, g);
    const ringsG = S('g', { class: 'al-rings' }, g);
    for (let i = 0; i < 9; i++) {
      const x = 70 + i * 70;
      S('ellipse', { cx: x, cy: 16, rx: 7, ry: 5, class: 'al-hole' }, ringsG);
      S('path', { d: 'M' + (x - 5) + ' 17C' + (x - 7) + ' -6 ' + (x + 7) + ' -6 ' + (x + 5) + ' 17', class: 'al-ring' }, ringsG);
    }
    let cur = { y: opt.at[0], m: opt.at[1] }, open = false, picked = null, showDD = !!opt.dd;
    let hits = [], stop = null, pageEl = null, hover = null;
    const style = opt.style || 'g';
    const inWindow = (y) => open || opt.from == null || (y >= opt.from && y <= opt.to);
    const marksOn = (y, m) => (opt.marks || []).filter((k) => k[0] === y && k[1] === m);
    const winNote = () => (open || opt.from == null ? '' : 'This almanac covers ' + (opt.from === opt.to ? opt.from + ' only' : opt.from + '–' + opt.to));

    function button(pg, x, y, act, label, title) {
      const b = S('g', { class: 'al-btn', 'data-act': act, transform: 'translate(' + x + ' ' + y + ')' }, pg);
      S('circle', { r: 23 }, b);
      S('text', { y: 2, 'text-anchor': 'middle', 'dominant-baseline': 'central', text: label }, b);
      S('title', { text: title }, b);
      hits.push({ kind: 'btn', act, x: x - 26, y: y - 26, w: 52, h: 52, el: b });
    }
    function mark(pg, cx, cy, r, kind, label) {
      if (kind === 't') {
        S('circle', { cx, cy, r, class: 'al-mark t' }, pg);
        S('text', { x: cx + r * 0.72, y: cy - r * 0.72, class: 'al-mark-q', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: '?' }, pg);
      } else {
        S('circle', { cx, cy, r, class: 'al-mark a' }, pg);
        if (label) S('text', { x: cx, y: cy + r + 14, class: 'al-mark-l', 'text-anchor': 'middle', text: label }, pg);
      }
    }

    function build(y, m) {
      hits = [];
      const real = inWindow(y);
      const pg = S('g', { class: 'al-pg' + (real ? '' : ' ledger') });
      S('rect', { x: 0, y: 0, width: PW, height: PAGE_H, rx: 14, class: 'al-page' }, pg);
      S('path', { d: 'M0 ' + HEAD + 'V14Q0 0 14 0H' + (PW - 14) + 'Q' + PW + ' 0 ' + PW + ' 14V' + HEAD + 'Z', class: 'al-head' }, pg);
      S('rect', { x: 0, y: HEAD - 7, width: PW, height: 7, class: 'al-head-edge' }, pg);
      S('text', { x: PW / 2, y: 62, class: 'al-month', 'text-anchor': 'middle', text: MONTHS[m - 1].toUpperCase() }, pg);
      S('text', { x: PW / 2, y: 106, class: 'al-year', 'text-anchor': 'middle', text: y > 0 ? String(y) : '?' }, pg);
      button(pg, 50, 52, 'm-', '‹', 'Previous month (←)');
      button(pg, 50, 101, 'y-', '«', 'Previous year (↓); hold to run');
      button(pg, PW - 50, 52, 'm+', '›', 'Next month (→)');
      button(pg, PW - 50, 101, 'y+', '»', 'Next year (↑); hold to run');
      // a ledger page lists the month plainly: no weekdays, and no dates dropped by a calendar switch
      const SS = STYLES[style];
      const days = monthDays(real || !SS.lastJ ? style : (y <= SS.lastJ[0] ? 'j' : 'g'), y, m);
      S('text', { x: 18, y: HEAD + 23, class: 'al-strip', text: real ? SS.name : 'Beyond this almanac: no weekdays printed' }, pg);
      S('text', { x: PW - 18, y: HEAD + 23, class: 'al-strip r', 'text-anchor': 'end', text: winNote() }, pg);
      const y0 = HEAD + STRIP;
      if (real) {
        for (let i = 0; i < 7; i++) S('text', { x: i * CW + CW / 2, y: y0 + 27, class: 'al-wd' + (i === 0 ? ' sun' : ''), 'text-anchor': 'middle', text: WD3[i].toUpperCase() }, pg);
        const y1 = y0 + WROW;
        const leap = monthLen(style, y, 2) === 29;
        const ddd = ddDate(m, leap);
        let prev = null;
        days.forEach((x) => {
          const idx = days[0].wd + (x.j - days[0].j), r = Math.floor(idx / 7), c = idx % 7;
          const cx = c * CW, cy = y1 + r * CH;
          const cell = S('g', { class: 'al-cell' + (c === 0 ? ' sun' : '') }, pg);
          S('rect', { x: cx + 3, y: cy + 3, width: CW - 6, height: CH - 6, rx: 8, 'data-key': 'cal-' + y + '-' + m + '-' + x.d }, cell);
          S('text', { x: cx + 14, y: cy + 33, class: 'al-d', text: String(x.d) }, cell);
          if (prev && x.d !== prev.d + 1) {
            S('path', { d: 'M' + (cx + 4) + ' ' + (cy + 6) + 'l6 8l-6 8l6 8l-6 8l6 8l-6 8', class: 'al-tear' }, pg);
            S('text', { x: cx + CW / 2 + 6, y: cy + CH - 12, class: 'al-skip', 'text-anchor': 'middle', text: (prev.d + 1) + '–' + (x.d - 1) + ' skipped' }, pg);
          }
          if (showDD && x.d === ddd) S('path', { d: 'M' + (cx + CW - 22) + ' ' + (cy + 12) + 'l8 8l-8 8l-8-8z', class: 'al-dd' }, pg);
          if (picked && sameDate(picked, [y, m, x.d])) S('circle', { cx: cx + CW / 2, cy: cy + CH / 2, r: 30, class: 'al-pick' }, pg);
          marksOn(y, m).filter((k) => k[2] === x.d).forEach((k) => mark(pg, cx + CW / 2, cy + CH / 2, 31, k[3] || 't', k[4]));
          hits.push({ kind: 'day', date: [y, m, x.d], x: cx, y: cy, w: CW, h: CH, el: cell });
          prev = x;
        });
      } else {
        const cols = 8, cw = PW / cols, ch = (PAGE_H - y0 - 20) / 4;
        S('text', { x: PW / 2, y: y0 + 2 * ch + 20, class: 'al-stamp', 'text-anchor': 'middle', transform: 'rotate(-14 ' + PW / 2 + ' ' + (y0 + 2 * ch) + ')', text: 'NO WEEKDAYS' }, pg);
        days.forEach((x, i) => {
          const r = Math.floor(i / cols), c = i % cols, cx = c * cw, cy = y0 + 8 + r * ch;
          const cell = S('g', { class: 'al-cell ledger' }, pg);
          S('rect', { x: cx + 4, y: cy + 4, width: cw - 8, height: ch - 8, rx: 8 }, cell);
          S('text', { x: cx + cw / 2, y: cy + ch / 2 + 11, class: 'al-d', 'text-anchor': 'middle', text: String(x.d) }, cell);
          if (picked && sameDate(picked, [y, m, x.d])) S('circle', { cx: cx + cw / 2, cy: cy + ch / 2, r: 30, class: 'al-pick' }, pg);
          marksOn(y, m).filter((k) => k[2] === x.d).forEach((k) => mark(pg, cx + cw / 2, cy + ch / 2, 32, k[3] || 't', k[4]));
          hits.push({ kind: 'day', date: [y, m, x.d], x: cx, y: cy, w: cw, h: ch, el: cell });
        });
      }
      return pg;
    }

    function finish() { if (stop) { stop(); stop = null; } Array.from(pagesG.children).forEach((c) => { if (c !== pageEl) c.remove(); }); if (pageEl) pageEl.removeAttribute('transform'); if (pageEl) pageEl.style.opacity = ''; }
    function show(y, m, dir) {
      finish();
      cur = { y, m };
      const old = pageEl;
      pageEl = build(y, m);
      const paint = () => { try { ctx.wb.applyPaints(); } catch (e) { /* no paints yet */ } };
      if (!old || !dir) { if (old) old.remove(); pagesG.appendChild(pageEl); paint(); return; }
      if (dir > 0) {
        pagesG.insertBefore(pageEl, old);
        stop = C.tween(C.anim(260), (t) => { old.setAttribute('transform', 'scale(1 ' + Math.max(0.001, 1 - t) + ')'); old.style.opacity = String(1 - t * 0.7); }, () => { stop = null; old.remove(); });
      } else {
        pagesG.appendChild(pageEl);
        pageEl.setAttribute('transform', 'scale(1 0.001)');
        const pe = pageEl;
        stop = C.tween(C.anim(260), (t) => { pe.setAttribute('transform', 'scale(1 ' + Math.max(0.001, t) + ')'); }, () => { stop = null; pe.removeAttribute('transform'); old.remove(); });
      }
      paint();
    }
    function turn(dm, dy) {
      let y = cur.y + (dy || 0), m = cur.m + (dm || 0);
      while (m < 1) { m += 12; y--; }
      while (m > 12) { m -= 12; y++; }
      if (y < 1 || y > 9999) return;
      ctx.sfx('tap');
      show(y, m, (dy || dm) > 0 ? 1 : -1);
      if (opt.onTurn) opt.onTurn(cur);
    }
    function hit(pt) {
      for (const h of hits) if (pt[0] >= h.x && pt[0] <= h.x + h.w && pt[1] >= h.y && pt[1] <= h.y + h.h) return h;
      return null;
    }
    function setHover(h) {
      if (hover && hover.el) hover.el.classList.remove('hov');
      hover = h && (h.kind === 'btn' || opt.pick) ? h : null;
      if (hover && hover.el) hover.el.classList.add('hov');
    }
    show(cur.y, cur.m, 0);
    return {
      g, show, turn, hit, setHover,
      page: () => cur,
      redraw() { show(cur.y, cur.m, 0); },
      setPicked(dt) { picked = dt; show(cur.y, cur.m, 0); },
      setDD(on) { showDD = on; show(cur.y, cur.m, 0); },
      dd: () => showDD,
      unlock(to) { open = true; if (to) show(to[0], to[1], (to[0] * 12 + to[1]) >= (cur.y * 12 + cur.m) ? 1 : -1); else show(cur.y, cur.m, 0); },
      lock() { open = false; show(cur.y, cur.m, 0); },
      isOpen: () => open,
      destroy() { finish(); }
    };
  }

  /* ---------- the Doomsday card ---------- */

  const CARD_W = 470;
  function DoomsdayCard(ctx, parent, spec) {
    const S = ctx.s;
    const g = S('g', { class: 'dc' }, parent);
    const steps = spec.date ? ddSteps(spec.date, spec.style) : ddSteps([spec.year, 4, 4], spec.style).slice(0, 2);
    let shown = 0;
    function draw() {
      g.innerHTML = '';
      S('rect', { x: 6, y: 10, width: CARD_W, height: PAGE_H, rx: 12, class: 'al-shadow' }, g);
      S('rect', { x: 0, y: 0, width: CARD_W, height: PAGE_H, rx: 12, class: 'dc-card' }, g);
      if (!shown) {
        S('rect', { x: 18, y: 18, width: CARD_W - 36, height: PAGE_H - 36, rx: 8, class: 'dc-back' }, g);
        S('text', { x: CARD_W / 2, y: PAGE_H / 2 - 30, class: 'dc-back-t', 'text-anchor': 'middle', text: 'DOOMSDAY' }, g);
        S('text', { x: CARD_W / 2, y: PAGE_H / 2 + 10, class: 'dc-back-s', 'text-anchor': 'middle', text: 'John Conway’s rule, step by step' }, g);
        S('text', { x: CARD_W / 2, y: PAGE_H / 2 + 44, class: 'dc-back-s', 'text-anchor': 'middle', text: 'A hint turns the card over.' }, g);
        return;
      }
      for (let y = 104; y < PAGE_H - 20; y += 30) S('line', { x1: 14, x2: CARD_W - 14, y1: y, y2: y, class: 'dc-rule' }, g);
      S('line', { x1: 52, x2: 52, y1: 70, y2: PAGE_H - 10, class: 'dc-margin' }, g);
      S('path', { d: 'M0 64V12Q0 0 12 0H' + (CARD_W - 12) + 'Q' + CARD_W + ' 0 ' + CARD_W + ' 12V64Z', class: 'dc-band' }, g);
      S('text', { x: 20, y: 30, class: 'dc-title', text: 'DOOMSDAY CARD' }, g);
      S('text', { x: 20, y: 54, class: 'dc-sub', text: spec.date ? 'for ' + fmtDate(spec.date) + (spec.style === 'j' ? ' (Julian)' : '') : 'for the year ' + spec.year }, g);
      let y = 96;
      steps.forEach((st, i) => {
        const on = i < shown;
        S('circle', { cx: 30, cy: y - 7, r: 14, class: 'dc-num' + (on ? ' on' : '') }, g);
        S('text', { x: 30, y: y - 6, class: 'dc-num-t', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(i + 1) }, g);
        S('text', { x: 62, y, class: 'dc-head' + (on ? '' : ' off'), text: st.head }, g);
        y += 28;
        if (!on) {
          S('text', { x: 62, y: y + 2, class: 'dc-hidden', text: '… the next hint fills this in' }, g);
          y += 44;
          return;
        }
        st.lines.forEach((ln) => wrap(ln, 42).forEach((w) => { S('text', { x: 62, y, class: 'dc-line', text: w }, g); y += 25; }));
        S('text', { x: CARD_W - 20, y: y + 4, class: 'dc-res', 'text-anchor': 'end', text: '→ ' + st.result }, g);
        y += 40;
      });
      const strip = wrap(DD_STRIP, 54), yNums = PAGE_H - 16, ys = yNums - 28 - (strip.length - 1) * 21;
      S('rect', { x: 10, y: ys - 48, width: CARD_W - 20, height: PAGE_H - ys + 38, rx: 8, class: 'dc-foot-bg' }, g);
      S('text', { x: 20, y: ys - 25, class: 'dc-foot-h', text: 'Doomsday dates (all the same weekday):' }, g);
      strip.forEach((w, i) => S('text', { x: 20, y: ys + i * 21, class: 'dc-foot', text: w }, g));
      S('text', { x: 20, y: yNums, class: 'dc-foot n', text: 'Sun 0 · Mon 1 · Tue 2 · Wed 3 · Thu 4 · Fri 5 · Sat 6' }, g);
    }
    draw();
    return {
      g, steps,
      reveal(n) { shown = Math.max(shown, Math.min(n, steps.length)); draw(); },
      shown: () => shown,
      set(n) { shown = Math.min(n, steps.length); draw(); }
    };
  }

  /* =====================================================================
   * the calendar cubes: two cubes of digits show every day of the month
   * ===================================================================== */

  const NET = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]]; // top, left, front, right, bottom, back
  const FS = 78;

  function isoCube(ctx, parent, x, y, s, front, top, right, six) {
    const S = ctx.s;
    const dx = s * 0.36, dy = -s * 0.3;
    const g = S('g', { class: 'cc-cube' }, parent);
    S('path', { d: 'M' + x + ' ' + y + 'l' + dx + ' ' + dy + 'h' + s + 'l' + (-dx) + ' ' + (-dy) + 'z', class: 'cc-top' }, g);
    S('path', { d: 'M' + (x + s) + ' ' + y + 'l' + dx + ' ' + dy + 'v' + s + 'l' + (-dx) + ' ' + (-dy) + 'z', class: 'cc-side' }, g);
    S('rect', { x, y, width: s, height: s, class: 'cc-front' }, g);
    const digit = (v, tr, cls, sz) => {
      if (v == null) return;
      const t = S('text', { class: 'cc-dig ' + cls, 'text-anchor': 'middle', 'dominant-baseline': 'central', transform: tr, 'font-size': sz, text: v.flip ? '6' : String(v.d != null ? v.d : v) }, g);
      if (v.flip) t.setAttribute('transform', tr + ' rotate(180)');
      const d = v.d != null ? v.d : v;
      if (six && (d === 6 || d === 9)) S('line', { x1: -sz * 0.22, x2: sz * 0.22, y1: sz * 0.42, y2: sz * 0.42, transform: tr + (v.flip ? ' rotate(180)' : ''), class: 'cc-uline ' + cls }, g);
    };
    digit(front, 'translate(' + (x + s / 2) + ' ' + (y + s / 2 + 2) + ')', 'f', s * 0.72);
    const k = 1 / 100;
    digit(top, 'matrix(' + s * k + ' 0 ' + (-dx * k) + ' ' + (-dy * k) + ' ' + (x + s / 2 + dx / 2) + ' ' + (y + dy / 2) + ') scale(0.9 0.55)', 't', 100 * 0.6);
    digit(right, 'matrix(' + dx * k + ' ' + dy * k + ' 0 ' + s * k + ' ' + (x + s + dx / 2) + ' ' + (y + s / 2 + dy / 2) + ') scale(0.5 0.9)', 'r', 100 * 0.6);
    return g;
  }

  // which faces show the day n: [[cube, face, flip] tens, [cube, face, flip] units] or null
  function showWith(faces, n, six) {
    const t = Math.floor(n / 10), u = n % 10;
    const find = (c, digit) => {
      for (let f = 0; f < 6; f++) {
        const v = faces[c][f];
        if (v == null) continue;
        if (v === digit) return { f, flip: false };
        if (six && sym(v, true) === sym(digit, true)) return { f, flip: v !== digit };
      }
      return null;
    };
    for (const [a, b] of [[0, 1], [1, 0]]) {
      const x = find(a, t), y = find(b, u);
      if (x && y) return [{ c: a, f: x.f, flip: x.flip, d: t }, { c: b, f: y.f, flip: y.flip, d: u }];
    }
    return null;
  }

  function cubesPicture(ctx, parent) {
    const g = ctx.s('g', { class: 'cc-pic' }, parent);
    isoCube(ctx, g, 40, 70, 150, '?', '?', '?', false);
    isoCube(ctx, g, 270, 70, 150, '?', '?', '?', false);
    ctx.s('text', { x: 240, y: 290, class: 'cc-cap', 'text-anchor': 'middle', text: '01, 02, 03 … 31' }, g);
    return { g, w: 480, h: 310 };
  }

  /* =====================================================================
   * working it out: breakdowns of a span of days (hints, explanations)
   * ===================================================================== */

  const shortDate = (a, withYear) => a[2] + ' ' + MON3[a[1] - 1] + (withYear ? ' ' + a[0] : '');
  function breakdown(a, b, st) {
    const segs = [];
    let cur = a.slice();
    const clampDay = (y, m, dd) => Math.min(dd, monthLen(st, y, m) || 28);
    let yrs = 0;
    while (true) {
      const nx = [a[0] + yrs + 1, a[1], clampDay(a[0] + yrs + 1, a[1], a[2])];
      if (daysBetween(st, nx, b) < 0) break;
      yrs++;
    }
    if (yrs) {
      const to = [a[0] + yrs, a[1], clampDay(a[0] + yrs, a[1], a[2])];
      let leaps = 0;
      for (let y = a[0]; y < a[0] + yrs + 1; y++) { const f = jdn(st, y, 2, 29); if (f != null && f > jdn(st, a[0], a[1], a[2]) && f <= jdn(st, to[0], to[1], to[2])) leaps++; }
      segs.push({ from: cur, to, days: daysBetween(st, cur, to), what: yrs + ' year' + (yrs > 1 ? 's' : '') + ' (' + yrs + ' × 365 + ' + leaps + ' leap day' + (leaps === 1 ? '' : 's') + ')' });
      cur = to;
    }
    let mos = 0;
    while (true) {
      let y = cur[0], m = cur[1] + mos + 1;
      while (m > 12) { m -= 12; y++; }
      const nx = [y, m, clampDay(y, m, a[2])];
      if (daysBetween(st, nx, b) < 0) break;
      mos++;
    }
    if (mos) {
      let y = cur[0], m = cur[1] + mos;
      while (m > 12) { m -= 12; y++; }
      const to = [y, m, clampDay(y, m, a[2])];
      segs.push({ from: cur, to, days: daysBetween(st, cur, to), what: mos + ' month' + (mos > 1 ? 's' : '') });
      cur = to;
    }
    const rest = daysBetween(st, cur, b);
    if (rest && cur[1] !== b[1]) { // to the end of the month first
      const end = [cur[0], cur[1], monthLen(st, cur[0], cur[1])], k = daysBetween(st, cur, end);
      if (k > 0) { segs.push({ from: cur, to: end, days: k, what: k + ' day' + (k > 1 ? 's' : '') + ' to the end of ' + MONTHS[cur[1] - 1] }); cur = end; }
    }
    const last = daysBetween(st, cur, b);
    if (last) segs.push({ from: cur, to: b, days: last, what: last + ' day' + (last > 1 ? 's' : '') });
    return segs;
  }
  const segText = (s, withDays) => shortDate(s.from, true) + ' → ' + shortDate(s.to, true) + ': ' + s.what + (withDays && !/^\d+ days?\b/.test(s.what) ? ' = ' + s.days + ' days' : '');

  function autoHints(d) {
    const q = d.q, st = q.cal || 'g';
    if (q.days) {
      const segs = breakdown(q.days[0], q.days[1], st);
      return ['Go in big steps: whole years first (365 days each, 366 when a 29 February falls inside), then whole months (30, 31, or 28/29 for February), then the odd days.',
        'The steps: ' + segs.map((s) => segText(s, false)).join('; ') + '.',
        segs.map((s) => segText(s, true)).join('; ') + '. Now add them up.'];
    }
    if (q.add) {
      const ans = addDays(st, q.add[0], q.add[1]);
      const segs = breakdown(q.add[0], ans, st);
      const n = q.add[1];
      return ['Take off whole years first: each is 365 days, or 366 when a 29 February falls inside. ' + n + ' days is roughly ' + (n / 365.2425).toFixed(1) + ' years.',
        'After ' + segs.slice(0, -1).map((s) => s.what + ' (' + s.days + ' days)').join(' and ') + (segs.length > 1 ? ', ' + (n - segs.slice(0, -1).reduce((x, s) => x + s.days, 0)) + ' days are left to count' : ' there are ' + n + ' days to count') + '.',
        'The whole-year and whole-month steps bring you to **' + shortDate(segs[segs.length - 1].from, true) + '**; count the last ' + segs[segs.length - 1].days + ' days from there.'];
    }
    return [];
  }

  function explainQ(d) {
    const q = d.q, st = q.cal || 'g';
    if (q.wd) {
      const steps = ddSteps(q.wd, st === 'j' ? 'j' : 'g');
      return 'With the Doomsday rule: the century anchor is ' + steps[0].result + '. ' + steps[1].lines.join('; ') + ', so the doomsday of ' + q.wd[0] + ' is **' + steps[1].result + '**. ' + steps[2].lines.join(' ') + ': **' + steps[2].result + '**.' +
        (st === 'j' ? '\n\nIn the Julian calendar every fourth year is a leap year, centuries included, so the anchor steps back one weekday each century.' : '');
    }
    if (q.days) {
      const segs = breakdown(q.days[0], q.days[1], st);
      return segs.map((s) => segText(s, true)).join('.\n') + '.\n\nIn all: **' + daysBetween(st, q.days[0], q.days[1]) + ' days**.';
    }
    if (q.add) {
      const ans = addDays(st, q.add[0], q.add[1]);
      return breakdown(q.add[0], ans, st).map((s) => segText(s, true)).join('.\n') + '.\n\nThat adds up to ' + q.add[1] + ' days: the date is **' + fmtDate(ans) + '**.';
    }
    return '';
  }

  // the date a puzzle is about (for the almanac's last page)
  function targetOf(d) {
    const q = d.q || {};
    if (d.after) return [d.after[0], d.after[1], d.after[2] || 1];
    if (d.kind === 'date' && Array.isArray(d.ans)) return d.ans;
    if (q.wd) return q.wd;
    if (q.days) return q.days[1];
    if (q.conv) return calc(q);
    if (q.easter != null) return easterG(q.easter);
    return null;
  }

  /* =====================================================================
   * the puzzle page: a question, the almanac, the card
   * ===================================================================== */

  function mountQuestion(ctx, p) {
    const d = p.data, wb = ctx.wb, S = ctx.s;
    const g0 = S('g', { class: 'cal-board' }, wb.layer('board'));
    let alm = null, card = null, pic = null;
    const st = { picked: null, solved: false, dd: !!(d.cal && d.cal.dd) };
    if (d.cal) {
      const c = d.cal;
      alm = Almanac(ctx, S('g', {}, g0), { from: c.from, to: c.to, style: c.style || 'g', at: c.at || [c.from || 2026, 1], marks: c.marks, dd: c.dd, pick: d.kind === 'date' });
    }
    if (d.card) card = DoomsdayCard(ctx, S('g', {}, g0), d.card);
    if (d.show === 'cubes') pic = cubesPicture(ctx, S('g', {}, g0));
    const card0 = d.card ? d.card.show || 0 : 0;
    const cardSteps = card ? card.steps.length - card0 : 0;
    const engineHints = () => Math.max(0, ctx.hintCount() - (p.hints || []).length);
    if (card) card.set(card0 + Math.min(cardSteps, engineHints()));

    let ax = 0, ay = 0;
    function layout() {
      const narrow = wb.isNarrow();
      let w = 0, h = 0;
      if (alm) { alm.g.parentNode.setAttribute('transform', 'translate(0 0)'); w = PW + 10; h = PAGE_H + 12; }
      if (card) {
        const cx = alm ? (narrow ? (PW - CARD_W) / 2 : PW + 44) : 0, cy = alm && narrow ? PAGE_H + 44 : 0;
        card.g.parentNode.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')');
        w = Math.max(w, cx + CARD_W + 8); h = Math.max(h, cy + PAGE_H + 12);
      }
      if (pic) { const px = alm ? (narrow ? 0 : PW + 44) : 0, py = alm && narrow ? PAGE_H + 44 : 0; pic.g.parentNode.setAttribute('transform', 'translate(' + px + ' ' + py + ')'); w = Math.max(w, px + pic.w); h = Math.max(h, py + pic.h); }
      ax = 0; ay = 0;
      wb.setBounds({ x0: -16, y0: alm ? -28 : -12, x1: w + 12, y1: h + 12 }, 0.04);
    }
    layout();
    wb.on('layout', layout);

    // the answer
    const box = ctx.answer(answerSpec(ctx, p, onRight));
    const input = () => box.el.querySelector('.ans-in');
    function onRight() {
      st.solved = true;
      if (card) card.reveal(99);
      if (alm) setTimeout(() => { const t = targetOf(d); alm.unlock(t); if (d.kind === 'date') { st.picked = d.ans; alm.setPicked(d.ans); } }, C.anim(350));
    }

    // panel: the doomsday marks, back to the start
    let ddBtn = null;
    if (alm) {
      ddBtn = ctx.button(st.dd ? 'Hide the doomsdays' : 'Show the doomsdays', () => { st.dd = !st.dd; alm.setDD(st.dd); ddBtn.textContent = st.dd ? 'Hide the doomsdays' : 'Show the doomsdays'; }, 'small');
      ddBtn.title = 'Mark each month’s doomsday date: 4/4, 6/6, 8/8, 10/10, 12/12, 9/5, 5/9, 7/11, 11/7, Pi Day, the last of February, 3 or 4 January';
      ctx.button('Back to the first page', () => { const c = d.cal; alm.show((c.at || [c.from, 1])[0], (c.at || [c.from, 1])[1], -1); }, 'small ghost');
    }

    // the board: turn pages, pick a date
    let downH = null, rep = null;
    const clearRep = () => { clearTimeout(rep); clearInterval(rep); rep = null; };
    const act = (a) => { if (a === 'm-') alm.turn(-1, 0); else if (a === 'm+') alm.turn(1, 0); else if (a === 'y-') alm.turn(0, -1); else if (a === 'y+') alm.turn(0, 1); };
    const local = (pt) => [pt[0] - ax, pt[1] - ay];
    wb.handlers.board = {
      down(pt) {
        if (!alm) return false;
        const h = alm.hit(local(pt));
        if (!h) return false;
        downH = h;
        if (h.kind === 'btn') {
          act(h.act);
          clearRep();
          rep = setTimeout(() => { rep = setInterval(() => act(h.act), 150); }, 430);
        }
        return true;
      },
      up(pt) {
        clearRep();
        const h0 = downH;
        downH = null;
        if (!h0 || h0.kind !== 'day') return;
        const h = alm.hit(local(pt));
        if (!h || h.kind !== 'day' || !sameDate(h.date, h0.date)) return;
        if (d.kind !== 'date' || st.solved) return;
        st.picked = h.date;
        alm.setPicked(h.date);
        const inp = input();
        if (inp) { inp.value = fmtDate(h.date); inp.focus(); }
        ctx.sfx('tap');
        ctx.say('Picked **' + fmtDate(h.date) + '** — press **Answer** when you are sure.', '');
      },
      hover(pt) { if (alm) alm.setHover(alm.hit(local(pt))); }
    };

    ctx.say(alm ? 'Turn the almanac with ‹ › and « » (or the arrow keys).' : '', '');

    return {
      noMoves: true,
      hint(n) {
        if (card && n < cardSteps) {
          const k = card0 + n + 1, s = card.steps[k - 1];
          const text = k === 1 ? 'The **Doomsday card** is turned over (on the board). Step 1: ' + s.head.toLowerCase().replace(/^century/, 'the century') + ' is **' + s.result + '**.'
            : k < card.steps.length ? 'Step ' + k + ' on the card: ' + s.head.replace(/^The/, 'the') + ' is **' + s.result + '**.'
              : 'The last step on the card: count from the nearest doomsday date in the month.';
          return { text, show() { card.reveal(k); } };
        }
        const extra = (p.hints && p.hints.length) ? [] : autoHints(d);
        const i = n - cardSteps;
        return extra[i] || null;
      },
      solve() {
        if (card) card.reveal(99);
        box.feedback('The answer: <b>' + C.md(answerText(d)) + '</b>', 'good');
        st.solved = true;
        if (alm) { const t = targetOf(d); alm.unlock(t); if (d.kind === 'date') { st.picked = d.ans; alm.setPicked(d.ans); } }
      },
      explain() { return explainQ(d); },
      getState() { return { picked: st.picked, solved: st.solved, dd: st.dd }; },
      setState(x) {
        if (!x) return;
        st.picked = x.picked || null;
        st.dd = !!x.dd;
        if (alm) {
          alm.setDD(st.dd);
          if (ddBtn) ddBtn.textContent = st.dd ? 'Hide the doomsdays' : 'Show the doomsdays';
          alm.setPicked(st.picked);
          if (x.solved && !alm.isOpen()) { const t = targetOf(d); alm.unlock(t); }
        }
        st.solved = !!x.solved;
      },
      key(ev) {
        if (!alm || ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (ev.key === 'ArrowLeft') { alm.turn(-1, 0); return true; }
        if (ev.key === 'ArrowRight') { alm.turn(1, 0); return true; }
        if (ev.key === 'ArrowDown') { alm.turn(0, -1); return true; }
        if (ev.key === 'ArrowUp') { alm.turn(0, 1); return true; }
        return false;
      },
      destroy() { clearRep(); if (alm) alm.destroy(); wb.handlers.board = null; }
    };
  }

  function answerText(d) {
    switch (d.kind) {
      case 'weekday': return WD[d.ans];
      case 'number': return C.fmtCalc ? C.fmtCalc(d.ans) + (d.unit ? ' ' + d.unit : '') : String(d.ans);
      case 'date': return fmtDate(d.ans);
      case 'choice': return String(d.choices[d.ans]);
      case 'multi': return d.ans.length ? d.ans.map((i) => String(d.choices[i])).join(', ') : 'none of them';
      default: return '';
    }
  }

  function answerSpec(ctx, p, onRight) {
    const d = p.data;
    const trap = (v) => { const t = (d.traps || []).find((x) => JSON.stringify(x.match) === JSON.stringify(v)); return t ? t.msg : null; };
    const ok = (msg) => { onRight(); return { ok: true, msg: msg || 'Yes: **' + answerText(d) + '**.' }; };
    if (d.kind === 'weekday') {
      return {
        kind: 'choice', choices: WD.slice(), label: d.ask || 'Which day of the week?',
        check(v) {
          if (v === d.ans) return ok();
          const off = mod(v - d.ans, 7);
          return { ok: false, msg: trap(v) || (off === 1 || off === 6 ? 'One day out. A leap day counted (or missed), or a slip in the last count?' : 'Not that day.') };
        }
      };
    }
    if (d.kind === 'number') {
      return {
        kind: 'number', unit: d.unit, label: d.ask || null, placeholder: 'A number',
        check(v) {
          const x = readNum(v);
          if (isNaN(x)) return { ok: false, msg: 'That does not look like a number.' };
          if (Math.abs(x - d.ans) < 1e-9) return ok();
          const t = trap(x);
          if (t) return { ok: false, msg: t };
          if (Number.isInteger(d.ans) && Math.abs(x - d.ans) === 1) return { ok: false, msg: 'One out — does the count include both ends, or neither?' };
          return { ok: false, msg: x < d.ans ? 'More than that.' : 'Fewer than that.' };
        }
      };
    }
    if (d.kind === 'date') {
      return {
        kind: 'text', label: d.ask || 'The date — type it (for example *' + fmtDate([d.ans[0], d.ans[1] === 4 ? 5 : 4, 13]) + '*) or click it on the almanac.', placeholder: 'e.g. 13 April ' + d.ans[0],
        check(v) {
          const x = parseDate(v);
          if (!x) return { ok: false, msg: 'Write the date as a day, a month and a year, for example *13 April ' + d.ans[0] + '*.' };
          if (x[0] == null) { if (d.year) x[0] = d.year; else return { ok: false, msg: 'Which year? Add it to the date.' }; }
          if (sameDate(x, d.ans)) return ok();
          const t = trap(x);
          if (t) return { ok: false, msg: t };
          if (x[1] === d.ans[1] && x[2] === d.ans[2]) return { ok: false, msg: 'The right day and month — but not the right year.' };
          const j = jdn('g', x[0], x[1], x[2]), k = jdn('g', d.ans[0], d.ans[1], d.ans[2]);
          if (j == null) return { ok: false, msg: 'There is no such date.' };
          const off = Math.abs(j - k);
          return { ok: false, msg: off <= 3 ? 'Close — within a few days. Check the count once more.' : 'Not that date.' };
        }
      };
    }
    if (d.kind === 'choice') {
      return { kind: 'choice', choices: d.choices, label: d.ask || null, check: (v) => (v === d.ans ? ok() : { ok: false, msg: trap(v) || 'Not that one.' }) };
    }
    return {
      kind: 'multi', choices: d.choices, label: d.ask || 'Choose every one that fits, then press Answer.', allowNone: !!d.allowNone,
      check(v) {
        const a = (v || []).slice().sort((x, y) => x - y);
        if (JSON.stringify(a) === JSON.stringify(d.ans)) return ok();
        const miss = d.ans.filter((i) => !a.includes(i)).length, extra = a.filter((i) => !d.ans.includes(i)).length;
        return { ok: false, msg: trap(a) || (extra && miss ? 'Some of those are wrong, and some are missing.' : extra ? 'Too many: ' + (extra === 1 ? 'one of those does not fit.' : extra + ' of those do not fit.') : 'Not all of them: ' + (miss === 1 ? 'one more fits.' : miss + ' more fit.')) };
      }
    };
  }

  /* ---------- the calendar cubes, to label ---------- */

  function mountCubes(ctx, p) {
    const d = p.data, wb = ctx.wb, S = ctx.s;
    const six = !!d.six;
    const fixed = d.fixed || [null, null];
    const need = d.need || 31;
    const fresh = () => [0, 1].map((c) => (fixed[c] ? fixed[c].slice() : [null, null, null, null, null, null]));
    let faces = fresh(), sel = null, day = need, anim = null;
    const isFixed = (c, f) => !!(fixed[c] && fixed[c][f] != null);
    const firstFree = () => { for (let c = 0; c < 2; c++) for (let f = 0; f < 6; f++) if (!isFixed(c, f) && faces[c][f] == null) return { c, f }; for (let c = 0; c < 2; c++) for (let f = 0; f < 6; f++) if (!isFixed(c, f)) return { c, f }; return null; };
    sel = firstFree();
    const NXS = [20, 400], NY = 300;
    const g0 = S('g', { class: 'cc-board' }, wb.layer('board'));
    const disp = S('g', {}, g0), nets = S('g', {}, g0), strip = S('g', {}, g0), top = S('g', {}, wb.layer('top'));
    const faceXY = (c, f) => [NXS[c] + NET[f][0] * FS, NY + NET[f][1] * FS];
    const SY = NY + 4 * FS + 44, TW = 40, TG = 5;
    const tileXY = (n) => { const i = n - 1, r = Math.floor(i / 16), k = i % 16; return [k * (TW + TG) + (r ? (TW + TG) / 2 : 0), SY + r * (TW + TG + 6)]; };
    wb.setBounds({ x0: -10, y0: 10, x1: 16 * (TW + TG) + 10, y1: SY + 2 * (TW + TG + 6) + 10 }, 0.04);
    const vals = (c) => faces[c].filter((v) => v != null);
    const shows = (n) => cubeShows(vals(0), vals(1), n, six);

    function draw() {
      // the two cubes on the desk, showing the day
      disp.innerHTML = '';
      const how = showWith(faces, day, six);
      const other = (c, used) => { const fs = [0, 1, 2, 3, 4, 5].filter((f) => f !== used && faces[c][f] != null); return [fs.length ? faces[c][fs[0]] : null, fs.length > 1 ? faces[c][fs[1]] : null]; };
      [0, 1].forEach((pos) => {
        const x = 150 + pos * 200, y = 70;
        let front = '?', c = pos, used = -1;
        if (how) { const h = how[pos]; c = h.c; used = h.f; front = { d: h.d, flip: h.flip }; if (!h.flip) front = h.d; }
        const [t, r] = other(c, used);
        isoCube(ctx, disp, x, y, 130, front, t == null ? '' : t, r == null ? '' : r, six);
        S('text', { x: x + 65, y: y + 162, class: 'cc-lab', 'text-anchor': 'middle', text: how ? 'cube ' + 'AB'[c] : '' }, disp);
      });
      S('text', { x: 355, y: 262, class: 'cc-cap' + (how ? '' : ' bad'), 'text-anchor': 'middle', text: how ? 'Showing day ' + String(day).padStart(2, '0') : 'These cubes cannot show ' + String(day).padStart(2, '0') + ' yet' }, disp);
      // the nets
      nets.innerHTML = '';
      [0, 1].forEach((c) => {
        S('text', { x: NXS[c], y: NY - 14, class: 'cc-net-t', text: 'Cube ' + 'AB'[c] + (fixed[c] ? ' (printed)' : '') }, nets);
        for (let f = 0; f < 6; f++) {
          const [x, y] = faceXY(c, f), v = faces[c][f];
          const on = sel && sel.c === c && sel.f === f;
          const fg = S('g', { class: 'cc-face' + (isFixed(c, f) ? ' fixed' : '') + (v == null ? ' empty' : '') + (on ? ' sel' : '') }, nets);
          S('rect', { x: x + 3, y: y + 3, width: FS - 6, height: FS - 6, rx: 9, 'data-key': 'face' + c + f }, fg);
          if (v != null) {
            S('text', { x: x + FS / 2, y: y + FS / 2 + 2, class: 'cc-fd', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(v) }, fg);
            if (six && (v === 6 || v === 9)) S('line', { x1: x + FS / 2 - 11, x2: x + FS / 2 + 11, y1: y + FS / 2 + 26, y2: y + FS / 2 + 26, class: 'cc-fu' }, fg);
          }
        }
      });
      // the days
      strip.innerHTML = '';
      let ok = 0;
      for (let n = 1; n <= need; n++) {
        const [x, y] = tileXY(n), can = shows(n);
        if (can) ok++;
        const tg = S('g', { class: 'cc-tile' + (can ? ' ok' : '') + (n === day ? ' cur' : '') }, strip);
        S('rect', { x, y, width: TW, height: TW, rx: 7 }, tg);
        S('text', { x: x + TW / 2, y: y + TW / 2 + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(n).padStart(2, '0') }, tg);
      }
      ctx.stat('Days shown', ok + ' / ' + need);
      wb.applyPaints();
    }

    function setFace(c, f, v) {
      if (isFixed(c, f)) { ctx.toast('That face is printed already.'); return; }
      faces[c][f] = v;
      ctx.sfx('tap');
      if (v != null) { // on to the next face
        let k = c * 6 + f;
        for (let i = 1; i <= 12; i++) { const q = (k + i) % 12, cc = Math.floor(q / 6), ff = q % 6; if (!isFixed(cc, ff)) { sel = { c: cc, f: ff }; break; } }
      }
      draw();
      ctx.changed('face');
    }
    function pickAt(pt) {
      for (let c = 0; c < 2; c++) for (let f = 0; f < 6; f++) { const [x, y] = faceXY(c, f); if (pt[0] >= x && pt[0] <= x + FS && pt[1] >= y && pt[1] <= y + FS) return { face: { c, f } }; }
      for (let n = 1; n <= need; n++) { const [x, y] = tileXY(n); if (pt[0] >= x && pt[0] <= x + TW && pt[1] >= y && pt[1] <= y + TW) return { day: n }; }
      return null;
    }
    wb.handlers.board = {
      down(pt) {
        const h = pickAt(pt);
        if (!h || anim) return false;
        if (h.face) { if (isFixed(h.face.c, h.face.f)) ctx.toast('That face is printed already.'); else { sel = h.face; ctx.sfx('tap'); draw(); } }
        else { day = h.day; draw(); }
        return true;
      }
    };
    const pad = C.numberPad({ keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'clear'], cols: 6, label: 'Write on the chosen face', onKey(k) { if (!sel || anim) return; setFace(sel.c, sel.f, k === 'clear' ? null : k); } });
    ctx.panel.appendChild(pad);
    ctx.button('Clear the cubes', () => { faces = fresh(); sel = firstFree(); draw(); ctx.changed('clear'); }, 'small ghost');
    ctx.setGoal(p.goal || 'Write a digit on every face so that the two cubes, side by side, can show every day from 01 to ' + need + (six ? '. A 6 turned upside down serves as a 9.' : '.'));
    draw();

    function solution() {
      const ok = (cube, fx) => !fx || fx.every((v) => v == null || cube.some((x) => sym(x, six) === sym(v, six)));
      for (const [A, B] of cubeSolutions(six)) {
        if (ok(A, fixed[0]) && ok(B, fixed[1])) return [A, B];
        if (ok(B, fixed[0]) && ok(A, fixed[1])) return [B, A];
      }
      return null;
    }
    function fill(c, cube) {
      const out = faces[c].slice();
      const left = cube.slice();
      for (let f = 0; f < 6; f++) if (isFixed(c, f)) { const i = left.findIndex((x) => sym(x, six) === sym(out[f], six)); if (i >= 0) left.splice(i, 1); }
      for (let f = 0; f < 6; f++) if (!isFixed(c, f)) out[f] = left.length ? left.shift() : 0;
      return out;
    }
    return {
      noMoves: true,
      check() {
        const miss = cubesMissing(vals(0), vals(1), six, need);
        if (!miss.length) return { solved: true, msg: 'Every day from 01 to ' + need + ' can be shown.' };
        return { solved: false, msg: 'The cubes cannot yet show ' + miss.slice(0, 8).map((n) => String(n).padStart(2, '0')).join(', ') + (miss.length > 8 ? ' and ' + (miss.length - 8) + ' more' : '') + '.' };
      },
      hint(n) {
        const H = [
          'Days 11 and 22 need two 1s and two 2s at once — so there is a 1 and a 2 on **each** cube.',
          'The 0 must pair with every digit from 1 to 9 (01 to 09). One cube cannot carry nine digits besides the 0, so the 0 goes on **both** cubes too.',
          'That fills three faces of each cube with 0, 1, 2. Six faces are left for 3, 4, 5, 6, 7, 8 — three on each cube, any way you like. ' + (six ? 'And 9? Turn the 6 upside down.' : '')
        ];
        return H[n] || null;
      },
      solve() {
        const sol = solution();
        if (!sol) return;
        const target = [fill(0, sol[0]), fill(1, sol[1])];
        const order = [];
        for (let c = 0; c < 2; c++) for (let f = 0; f < 6; f++) if (!isFixed(c, f)) order.push({ c, f });
        let i = 0;
        const step = () => {
          if (i >= order.length) { anim = null; sel = null; day = 31; draw(); ctx.changed('solve'); return; }
          const o = order[i++];
          faces[o.c][o.f] = target[o.c][o.f];
          sel = o;
          draw();
          anim = setTimeout(step, C.anim(160));
        };
        anim = setTimeout(step, C.anim(100));
      },
      getState() { return { faces: C.clone(faces), day }; },
      setState(x) { if (!x || !x.faces) return; clearTimeout(anim); anim = null; faces = C.clone(x.faces); day = x.day || need; draw(); },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey || !sel || anim) return false;
        if (/^[0-9]$/.test(ev.key)) { setFace(sel.c, sel.f, +ev.key); return true; }
        if (ev.key === 'Backspace' || ev.key === 'Delete') { setFace(sel.c, sel.f, null); return true; }
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft' || ev.key === 'Tab') {
          const dir = ev.key === 'ArrowLeft' || (ev.key === 'Tab' && ev.shiftKey) ? -1 : 1;
          let k = sel.c * 6 + sel.f;
          for (let i = 0; i < 12; i++) { k = (k + dir + 12) % 12; if (!isFixed(Math.floor(k / 6), k % 6)) break; }
          sel = { c: Math.floor(k / 6), f: k % 6 };
          draw();
          return true;
        }
        return false;
      },
      destroy() { clearTimeout(anim); wb.handlers.board = null; top.remove(); }
    };
  }

  /* =====================================================================
   * making puzzles (Endless drawers, and tools/gen/calendar.js)
   * ===================================================================== */

  function randDate(rng, y0, y1, st) {
    const y = rng.range(y0, y1), m = rng.range(1, 12), days = monthDays(st || 'g', y, m);
    return [y, m, days[rng.int(days.length)].d];
  }
  const fmtN = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n));

  function genWeekday(rng, level) {
    let t, W, st = 'g';
    if (level === 1) { t = randDate(rng, 2001, 2039); W = t[0] + (rng() < 0.5 ? -1 : 1); }
    else if (level === 2) { t = randDate(rng, 1990, 2060); W = t[0] + (rng() < 0.5 ? -1 : 1) * rng.range(2, 9); }
    else if (level === 3) { t = randDate(rng, 1901, 2099); W = rng.range(2020, 2030); if (Math.abs(W - t[0]) < 10) return null; }
    else if (level === 4) { t = randDate(rng, 1700, 2299); W = rng.range(2020, 2030); if (Math.abs(W - t[0]) < 40) return null; }
    else {
      if (rng() < 0.3) { st = 'j'; t = randDate(rng, 800, 1580, 'j'); } else t = randDate(rng, 1583, 2799);
      W = rng.range(2020, 2030);
      if (Math.abs(W - t[0]) < 60) return null;
    }
    const jul = st === 'j';
    const hints = [];
    if (level <= 2) hints.push('Turn the almanac to ' + shortDate([W, t[1], Math.min(t[2], monthLen(st, W, t[1]))]) + ' ' + W + '. From year to year a date moves on by one weekday — by two when a 29 February comes in between.');
    else if (level === 3) hints.push('Either count from ' + W + ' (one weekday per year, two per leap day), or use the Doomsday rule — the next hints work it through on the card.');
    return {
      title: 'Weekday of ' + fmtDate(t),
      text: 'On which day of the week ' + (t[0] < 2026 ? 'did **' + fmtDate(t) + '** fall' : 'does **' + fmtDate(t) + '** fall') + (jul ? ' — a date in the **Julian calendar**, as it was reckoned at the time' : '') + '? Your almanac covers **' + W + '** only.',
      hints,
      diff: level,
      concepts: ['modular'],
      data: { kind: 'weekday', q: jul ? { wd: t, cal: 'j' } : { wd: t }, ans: weekday(st, t[0], t[1], t[2]), cal: { from: W, to: W, style: st, at: [W, t[1]], marks: [[t[0], t[1], t[2], 't']] }, card: { date: t, style: st } }
    };
  }

  function genDays(rng, level) {
    let a, b = null, n = null;
    if (level === 1) { a = randDate(rng, 2000, 2040); n = rng.range(8, 75); b = addDays('g', a, n); if (b[0] !== a[0] || b[1] === a[1]) return null; }
    else if (level === 2) { a = randDate(rng, 1990, 2060); n = rng.range(60, 330); b = addDays('g', a, n); }
    else if (level === 3) { a = randDate(rng, 1950, 2080); b = randDate(rng, a[0] + 2, a[0] + 12); }
    else if (level === 4) {
      if (rng() < 0.5) { a = randDate(rng, 1900, 2090); n = rng.pick([100, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000]); }
      else { a = randDate(rng, 1885, 1899); b = randDate(rng, 1901, 1915); }
    } else {
      if (rng() < 0.6) { a = randDate(rng, 1800, 2080); n = rng.pick([5000, 7500, 10000, 12345, 15000, 20000, 25000, 30000]); }
      else { a = randDate(rng, 1750, 1850); b = randDate(rng, 1950, 2050); }
    }
    if (b) {
      const days = daysBetween('g', a, b);
      if (days <= 0) return null;
      return {
        title: 'From ' + shortDate(a, true) + ' to ' + shortDate(b, true),
        text: 'How many days after **' + fmtDate(a) + '** is **' + fmtDate(b) + '**?' + (level >= 3 ? ' (Every 29 February counts.)' : ''),
        diff: level, concepts: ['modular'],
        data: { kind: 'number', unit: 'days', q: { days: [a, b] }, ans: days, cal: { from: a[0], to: level <= 2 ? b[0] : a[0], at: [a[0], a[1]], marks: [[a[0], a[1], a[2], 'a', 'from'], [b[0], b[1], b[2], 't']] } }
      };
    }
    const ans = addDays('g', a, n);
    return {
      title: fmtN(n) + ' Days after ' + shortDate(a, true),
      text: 'What date is **' + fmtN(n) + ' days** after **' + fmtDate(a) + '**? (The day after is 1 day after.)',
      diff: level, concepts: ['modular'],
      data: { kind: 'date', q: { add: [a, n] }, ans, cal: { from: a[0], to: a[0], at: [a[0], a[1]], marks: [[a[0], a[1], a[2], 'a', 'start']] } }
    };
  }

  function generate(rng, level) {
    for (let k = 0; k < 40; k++) {
      const p = rng() < 0.6 ? genWeekday(rng, level) : genDays(rng, level);
      if (p) return p;
    }
    return null;
  }

  /* =====================================================================
   * checking a puzzle
   * ===================================================================== */

  const KINDS = ['weekday', 'number', 'date', 'choice', 'multi', 'cubes'];
  const isDate = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isInteger);
  function giveaway(d) {
    const c = d.cal, q = d.q || {};
    if (!c || c.from == null || c.open) return null;
    const inside = (y) => y >= c.from && y <= c.to;
    if (q.wd && inside(q.wd[0])) return 'the almanac shows the date asked';
    if (q.f13 != null && inside(q.f13)) return 'the almanac shows the year asked';
    if (q.nth && inside(q.nth[0])) return 'the almanac shows the month asked';
    if (q.count && inside(q.count[0])) return 'the almanac shows the year asked';
    if (q.repeat != null && (inside(q.repeat) || inside(calc(q)))) return 'the almanac shows both calendars';
    if (q.dd != null && inside(q.dd)) return 'the almanac shows the doomsdays asked';
    return null;
  }

  function verify(p) {
    const d = p.data;
    if (!d || KINDS.indexOf(d.kind) < 0) return { ok: false, err: 'unknown kind' };
    if (d.cal) {
      const c = d.cal;
      if (c.from != null && !(Number.isInteger(c.from) && Number.isInteger(c.to) && c.from <= c.to)) return { ok: false, err: 'cal.from/to must be years, from ≤ to' };
      if (c.style && !STYLES[c.style]) return { ok: false, err: 'unknown calendar style' };
      if (c.at && !(Number.isInteger(c.at[0]) && c.at[1] >= 1 && c.at[1] <= 12)) return { ok: false, err: 'cal.at must be [year, month]' };
      for (const k of c.marks || []) if (jdn(c.style || 'g', k[0], k[1], k[2]) == null) return { ok: false, err: 'marked date does not exist: ' + k.slice(0, 3).join('-') };
    }
    if (d.card) {
      if (d.card.date && jdn(d.card.style === 'j' ? 'j' : 'g', d.card.date[0], d.card.date[1], d.card.date[2]) == null) return { ok: false, err: 'card date does not exist' };
      if (!d.card.date && !Number.isInteger(d.card.year)) return { ok: false, err: 'card needs a date or a year' };
    }
    if (d.kind === 'cubes') {
      const six = !!d.six, fx = d.fixed || [null, null];
      const fits = (cube, f) => !f || f.every((v) => v == null || cube.some((x) => sym(x, six) === sym(v, six)));
      const sols = cubeSolutions(six);
      if (!sols.some(([A, B]) => (fits(A, fx[0]) && fits(B, fx[1])) || (fits(B, fx[0]) && fits(A, fx[1])))) return { ok: false, err: 'no labelling of the cubes shows every day' };
      return { ok: true };
    }
    if (!d.q) return { ok: false, err: 'q is needed' };
    const g = giveaway(d);
    if (g) return { ok: false, err: g };
    if (d.kind === 'multi') {
      if (!Array.isArray(d.choices) || !Array.isArray(d.vals) || d.vals.length !== d.choices.length) return { ok: false, err: 'multi needs choices and vals of the same length' };
      const got = calcMulti(d.q, d.vals);
      if (JSON.stringify(got) !== JSON.stringify(d.ans)) return { ok: false, err: 'answer is ' + JSON.stringify(d.ans) + ' but the calendar says ' + JSON.stringify(got) };
      if (!got.length && !d.allowNone) return { ok: false, err: 'nothing fits: set allowNone' };
      return { ok: true };
    }
    const v = calc(d.q);
    if (v == null || (typeof v === 'number' && !isFinite(v))) return { ok: false, err: 'q gives no answer' };
    if (d.kind === 'weekday') return v === d.ans ? { ok: true } : { ok: false, err: 'answer is ' + WD[d.ans] + ' but the calendar says ' + WD[v] };
    if (d.kind === 'number') return typeof v === 'number' && Math.abs(v - d.ans) < 1e-9 ? { ok: true } : { ok: false, err: 'answer is ' + d.ans + ' but the calendar says ' + v };
    if (d.kind === 'date') return isDate(d.ans) && sameDate(v, d.ans) ? { ok: true } : { ok: false, err: 'answer is ' + JSON.stringify(d.ans) + ' but the calendar says ' + JSON.stringify(v) };
    if (d.kind === 'choice') {
      if (!Array.isArray(d.choices) || !Array.isArray(d.vals) || d.vals.length !== d.choices.length) return { ok: false, err: 'choice needs choices and vals of the same length' };
      const key = JSON.stringify(v);
      const hits = d.vals.map((x, i) => (JSON.stringify(x) === key ? i : -1)).filter((i) => i >= 0);
      if (hits.length !== 1 || hits[0] !== d.ans) return { ok: false, err: 'the calendar says ' + key + ', which is choice ' + JSON.stringify(hits) };
      return { ok: true };
    }
    return { ok: false, err: 'unchecked' };
  }

  function answerKey(p) {
    const d = p.data;
    switch (d.kind) {
      case 'weekday': case 'choice': return d.ans;
      case 'multi': return d.ans.slice();
      case 'number': return String(d.ans);
      case 'date': return fmtDate(d.ans);
      default: return null;
    }
  }

  const ABOUT_Q = '**Answer in the panel.** The **almanac** on the board turns with ‹ › (months) and « » (years) — or the arrow keys; hold a button and it runs. It covers only the years printed on it: pages beyond are blank ledgers with no weekdays, so it never gives the game away. Once you have answered it opens up and turns to the page in question. **Show the doomsdays** marks each month’s doomsday date. Hints turn over the **Doomsday card** one step at a time. The pen, the highlighter and the paint tool work on the pages.';
  const ABOUT_CUBES = '**Click a face** on a cube’s net, then type a digit (or use the keypad in the panel); the next face is chosen for you. Backspace rubs a face out; ← → move between faces. The tiles below turn green for every day the two cubes can already show side by side — click one to see it on the cubes. In puzzles that allow it, a 6 turned upside down is a 9.';

  C.engine({
    id: 'calendar',
    name: 'Calendars',
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: (p) => (p && p.data && p.data.kind === 'cubes' ? ABOUT_CUBES : ABOUT_Q + (p && p.data && p.data.kind === 'date' ? ' For a date, type it or **click it** on the almanac.' : '')),
    verify,
    answerKey,
    generate,
    mount(ctx, p) { return p.data.kind === 'cubes' ? mountCubes(ctx, p) : mountQuestion(ctx, p); },
    thumb(p) {
      const d = p.data;
      if (d.kind === 'cubes' || d.show === 'cubes') {
        const cube = (x, t) => '<path d="M' + x + ' 30l14 -12h40l-14 12z" fill="#e9e2cf" stroke="#6b5d3d" stroke-width="2"/><path d="M' + (x + 40) + ' 30l14 -12v40l-14 12z" fill="#cfc4a6" stroke="#6b5d3d" stroke-width="2"/><rect x="' + x + '" y="30" width="40" height="40" fill="#fbf7ea" stroke="#6b5d3d" stroke-width="2"/><text x="' + (x + 20) + '" y="60" text-anchor="middle" font-size="30" font-weight="800" fill="#2a2c3a">' + t + '</text>';
        return '<svg viewBox="0 0 130 82" preserveAspectRatio="xMidYMid meet">' + cube(8, d.kind === 'cubes' ? '3' : '?') + cube(66, d.kind === 'cubes' ? '1' : '?') + '</svg>';
      }
      const t = targetOf(d) || (d.cal && d.cal.at ? [d.cal.at[0], d.cal.at[1], 0] : [2026, 1, 0]);
      const big = d.kind === 'weekday' ? String(t[2]) : d.kind === 'date' ? '?' : t[2] ? String(t[2]) : '?';
      let s = '<svg viewBox="0 0 120 110" preserveAspectRatio="xMidYMid meet"><rect x="6" y="8" width="108" height="98" rx="8" fill="#fbf7ea" stroke="#b9ad8c" stroke-width="2"/>';
      s += '<path d="M6 40V16q0-8 8-8h92q8 0 8 8v24z" fill="#b3343d"/>';
      for (let i = 0; i < 5; i++) s += '<rect x="' + (20 + i * 20) + '" y="3" width="4" height="12" rx="2" fill="#9aa1b3"/>';
      s += '<text x="60" y="32" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" letter-spacing="2">' + MON3[t[1] - 1].toUpperCase() + ' ' + t[0] + '</text>';
      s += '<text x="60" y="88" text-anchor="middle" font-size="42" font-weight="800" fill="#2a2c3a">' + big + '</text>';
      if (d.kind === 'weekday') s += '<circle cx="96" cy="54" r="10" fill="#c48600"/><text x="96" y="59" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">?</text>';
      return s + '</svg>';
    }
  });

  C.calendarLib = { MONTHS, WD, leapG, leapJ, jdnG, jdnJ, fromG, fromJ, jdn, fromJdn, weekday, addDays, daysBetween, monthDays, monthLen, yearLen, easterG, easterJul, easterO, doomsday, anchor, ddDate, f13, sameCal, repeatYear, nthWd, gapDays, f13Stats, feb29MaxGap, cubeShows, cubesMissing, cubeSolutions, calc, calcMulti, fmtDate, parseDate, ddSteps, breakdown, autoHints, explainQ, generate, genWeekday, genDays, verify, STYLES };

  C.css('calendar', `
    .al-shadow { fill: rgba(0,0,0,.28); }
    .al-under { fill: #e4dcc6; stroke: #b9ad8c; stroke-width: 1.5; }
    .al-page { fill: #fbf7ea; stroke: #b9ad8c; stroke-width: 2; }
    .al-head { fill: #b3343d; }
    .al-head-edge { fill: #8e2530; }
    .al-pg.ledger .al-head { fill: #6f7488; } .al-pg.ledger .al-head-edge { fill: #545869; }
    .al-pg.ledger .al-page { fill: #f1ede2; }
    .al-month { font: 800 46px Georgia, "Times New Roman", serif; fill: #fff; letter-spacing: .08em; }
    .al-year { font: 700 30px "Segoe UI", system-ui, sans-serif; fill: rgba(255,255,255,.85); letter-spacing: .16em; }
    .al-btn { cursor: pointer; }
    .al-btn circle { fill: rgba(255,255,255,.14); stroke: rgba(255,255,255,.45); stroke-width: 2; transition: fill .12s; }
    .al-btn text { font: 700 34px "Segoe UI", system-ui, sans-serif; fill: #fff; pointer-events: none; }
    .al-btn.hov circle { fill: rgba(255,255,255,.34); }
    .al-strip { font: 600 17px "Segoe UI", system-ui, sans-serif; fill: #7a6f55; }
    .al-strip.r { fill: #9a5a1f; }
    .al-wd { font: 800 18px "Segoe UI", system-ui, sans-serif; fill: #4b4f63; letter-spacing: .08em; }
    .al-wd.sun { fill: #b3343d; }
    .al-cell rect { fill: #fffdf6; stroke: #e2d9c0; stroke-width: 1.5; transition: fill .12s; }
    .al-cell.sun rect { fill: #fbeeea; }
    .al-cell.ledger rect { fill: #faf7ef; stroke-dasharray: 5 4; }
    .al-cell.hov rect { fill: #fff1c2; stroke: #c48600; cursor: pointer; }
    .al-d { font: 700 27px "Segoe UI", system-ui, sans-serif; fill: #2a2c3a; pointer-events: none; }
    .al-cell.sun .al-d { fill: #b3343d; }
    .al-cell.ledger .al-d { fill: #5d6177; }
    .al-tear { fill: none; stroke: #b3343d; stroke-width: 3; stroke-linejoin: round; pointer-events: none; }
    .al-skip { font: 700 13px "Segoe UI", system-ui, sans-serif; fill: #b3343d; pointer-events: none; }
    .al-stamp { font: 900 76px "Segoe UI", system-ui, sans-serif; fill: rgba(111,116,136,.17); letter-spacing: .1em; pointer-events: none; }
    .al-dd { fill: #d64545; stroke: #fff; stroke-width: 1.5; pointer-events: none; }
    .al-pick { fill: rgba(79,95,230,.22); stroke: #4f5fe6; stroke-width: 4; pointer-events: none; }
    .al-mark { fill: none; stroke-width: 4; pointer-events: none; }
    .al-mark.t { stroke: #c48600; stroke-dasharray: 9 5; }
    .al-mark.a { stroke: #0d948f; }
    .al-mark-q { font: 900 16px "Segoe UI", system-ui, sans-serif; fill: #fff; paint-order: stroke; stroke: #c48600; stroke-width: 7px; pointer-events: none; }
    .al-mark-l { font: 700 12px "Segoe UI", system-ui, sans-serif; fill: #0d948f; pointer-events: none; }
    .al-hole { fill: #3b3524; }
    .al-ring { fill: none; stroke: #b8bfcc; stroke-width: 5; stroke-linecap: round; filter: drop-shadow(0 2px 1px rgba(0,0,0,.35)); }
    .dc-card { fill: #fffdf4; stroke: #c9bf9f; stroke-width: 2; }
    .dc-back { fill: #22305a; stroke: #c9a34e; stroke-width: 4; }
    .dc-back-t { font: 900 46px Georgia, serif; fill: #e8c46a; letter-spacing: .14em; }
    .dc-back-s { font: 600 18px "Segoe UI", system-ui, sans-serif; fill: #c9d0ea; }
    .dc-band { fill: #22305a; }
    .dc-title { font: 900 22px Georgia, serif; fill: #e8c46a; letter-spacing: .12em; }
    .dc-sub { font: 600 16px "Segoe UI", system-ui, sans-serif; fill: #c9d0ea; }
    .dc-rule { stroke: #bcd3ea; stroke-width: 1; }
    .dc-margin { stroke: #e7a6a6; stroke-width: 1.5; }
    .dc-num { fill: #d9d2bd; } .dc-num.on { fill: #22305a; }
    .dc-num-t { font: 800 15px "Segoe UI", system-ui, sans-serif; fill: #fff; }
    .dc-head { font: 800 19px "Segoe UI", system-ui, sans-serif; fill: #22305a; }
    .dc-head.off { fill: #9b957f; }
    .dc-line { font: 500 16.5px "Segoe UI", system-ui, sans-serif; fill: #2a2c3a; }
    .dc-hidden { font: italic 500 16px "Segoe UI", system-ui, sans-serif; fill: #a39c86; }
    .dc-res { font: 800 22px "Segoe UI", system-ui, sans-serif; fill: #b3343d; }
    .dc-foot-bg { fill: #f3eedc; stroke: #e0d6bb; stroke-width: 1.5; }
    .dc-foot-h { font: 700 15px "Segoe UI", system-ui, sans-serif; fill: #22305a; }
    .dc-foot { font: 500 14.5px "Segoe UI", system-ui, sans-serif; fill: #4b4f63; }
    .dc-foot.n { fill: #7a6f55; }
    .cc-top { fill: #efe8d4; stroke: #6b5d3d; stroke-width: 2.5; stroke-linejoin: round; }
    .cc-side { fill: #d6cbad; stroke: #6b5d3d; stroke-width: 2.5; stroke-linejoin: round; }
    .cc-front { fill: #fffcf2; stroke: #6b5d3d; stroke-width: 2.5; }
    .cc-cube { filter: drop-shadow(0 6px 5px rgba(0,0,0,.3)); }
    .cc-dig { font-family: Georgia, "Times New Roman", serif; font-weight: 800; fill: #2a2c3a; pointer-events: none; }
    .cc-dig.t, .cc-dig.r { fill: #6b5d3d; }
    .cc-uline { stroke: #2a2c3a; stroke-width: 4; stroke-linecap: round; }
    .cc-uline.t, .cc-uline.r { stroke-width: 0; }
    .cc-lab { font: 700 17px "Segoe UI", system-ui, sans-serif; fill: var(--muted); letter-spacing: .1em; text-transform: uppercase; }
    .cc-cap { font: 700 22px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .cc-cap.bad { fill: var(--warn); }
    .cc-net-t { font: 800 18px "Segoe UI", system-ui, sans-serif; fill: var(--muted); letter-spacing: .08em; }
    .cc-face { cursor: pointer; }
    .cc-face rect { fill: #fffcf2; stroke: #6b5d3d; stroke-width: 2.5; transition: fill .12s; }
    .cc-face.empty rect { fill: #efe8d4; stroke-dasharray: 6 5; }
    .cc-face.fixed rect { fill: #e2dccb; }
    .cc-face.fixed { cursor: default; }
    .cc-face.sel rect { stroke: var(--gold); stroke-width: 6; fill: #fff4cf; stroke-dasharray: none; }
    .cc-fd { font: 800 44px Georgia, "Times New Roman", serif; fill: #2a2c3a; pointer-events: none; }
    .cc-face.fixed .cc-fd { fill: #6b6553; }
    .cc-fu { stroke: #2a2c3a; stroke-width: 3.5; stroke-linecap: round; pointer-events: none; }
    .cc-tile { cursor: pointer; }
    .cc-tile rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 2; transition: fill .15s; }
    .cc-tile text { font: 800 17px "Segoe UI", system-ui, sans-serif; fill: var(--muted); pointer-events: none; }
    .cc-tile.ok rect { fill: var(--green); stroke: var(--green); }
    .cc-tile.ok text { fill: #08261a; }
    .cc-tile.cur rect { stroke: var(--gold); stroke-width: 4; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
