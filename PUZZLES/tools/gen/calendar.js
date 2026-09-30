/* The Puzzle Cabinet · tools/gen/calendar.js
 *
 *   node tools/gen/calendar.js        writes data/calendar-puzzles.js
 *
 * Hand-written calendar puzzles (the Doomsday lessons, famous dates, the
 * Julian–Gregorian switch, Easter, Friday the 13th, leap years, the calendar
 * cubes), then a few made by the engine's own generator. Every answer is
 * worked out here with the engine's calendar arithmetic and checked by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/calendar.js'));
const L = C.calendarLib, E = C.engines.calendar;
const WD = L.WD, M = L.MONTHS;

const MODERN = { from: 2020, to: 2030 };
// a weekday puzzle: the modern almanac, the date marked, the Doomsday card
function wd(date, opts) {
  opts = opts || {};
  const st = opts.style || 'g';
  const cal = Object.assign({}, opts.cal || MODERN, { style: st, at: (opts.cal && opts.cal.at) || [2026, date[1]], marks: [[date[0], date[1], date[2], 't']] });
  if (opts.cal && opts.cal.dd) cal.dd = true;
  const q = st === 'g' ? { wd: date } : { wd: date, cal: st };
  const data = { kind: 'weekday', q, ans: L.calc(q), cal };
  if (opts.card !== false) data.card = { date, style: st === 'j' ? 'j' : 'g' };
  return data;
}
function ask(kind, q, extra) {
  const d = Object.assign({ kind, q }, extra || {});
  if (kind === 'multi') d.ans = L.calcMulti(q, d.vals);
  else if (kind === 'choice') { const v = JSON.stringify(L.calc(q)); d.ans = d.vals.findIndex((x) => JSON.stringify(x) === v); }
  else d.ans = L.calc(q);
  return d;
}
const fmt = L.fmtDate;
const MONTH_CHOICES = M.slice();
const MONTH_VALS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// the 13ths of a year, for a hint
function thirteenths(y, upto) {
  return MONTH_VALS.slice(0, upto || 12).map((m) => M[m - 1].slice(0, 3) + ' ' + WD[L.weekday('g', y, m, 13)].slice(0, 3)).join(', ');
}
// the anonymous Easter algorithm, worked for one year (for hints)
function easterWork(Y) {
  const a = Y % 19, b = Math.floor(Y / 100), c = Y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = ((32 + 2 * e + 2 * i - h - k) % 7 + 7) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return { a, b, c, d, e, f, g, h, i, k, l, m, n: h + l - 7 * m + 114 };
}
function orthoWork(Y) {
  const a = Y % 4, b = Y % 7, c = Y % 19, d = (19 * c + 15) % 30, e = ((2 * a + 4 * b - d + 34) % 7 + 7) % 7;
  return { a, b, c, d, e, n: d + e + 114 };
}

const P = [];
const add = (p) => P.push(p);

/* ---------------- Conway's Doomsday rule, step by step ---------------- */

add({ id: 'cal-dd-line-up', title: 'The Doomsdays Line Up', diff: 1, group: 0,
  text: 'Every year the dates **4/4, 6/6, 8/8, 10/10 and 12/12** — 4 April, 6 June, 8 August, 10 October and 12 December — fall on the same day of the week. John Conway called that day the year’s **doomsday**. The almanac marks them with little red diamonds. Turn its pages: what is the doomsday of 2026?',
  hints: ['Look at 4 April 2026, then turn to June and find 6 June. Same column?'],
  explain: 'From 4/4 to 6/6 is 63 days — exactly 9 weeks — and so is each step after that: 6/6 to 8/8, 8/8 to 10/10, 10/10 to 12/12. So all five dates share a weekday, in every year. In 2026 they are all **Saturdays**. Know one doomsday, and you have a signpost in every even month.',
  concepts: ['modular'], tags: ['doomsday', 'lesson'],
  data: ask('weekday', { dd: 2026 }, { cal: { from: 2026, to: 2026, at: [2026, 4], dd: true, open: true } }) });

add({ id: 'cal-dd-even-months', title: 'Christmas by Doomsday', diff: 1, group: 0,
  text: 'In 2027 the doomsday is a **Sunday**: 4 April, 6 June, 8 August, 10 October and 12 December 2027 are all Sundays. On which day of the week is Christmas Day, **25 December 2027**?',
  hints: ['12 December is a Sunday. Christmas is 13 days later — one whole week and 6 days more.'],
  explain: '12/12 is a Sunday. 25 is 12 + 13, and 13 = 7 + 6, so Christmas comes 6 weekdays after Sunday: a **Saturday**. Whole weeks never change the weekday — only the remainder after dividing by 7 counts. That is arithmetic *modulo 7*.',
  concepts: ['modular'], tags: ['doomsday', 'lesson', 'christmas'],
  data: ask('weekday', { wd: [2027, 12, 25] }, { cal: { from: 2026, to: 2026, at: [2026, 12], marks: [[2026, 12, 12, 'a', 'a doomsday']], dd: true } }) });

add({ id: 'cal-dd-nine-to-five', title: 'Nine to Five at the 7-Eleven', diff: 1, group: 0,
  text: 'The odd months have doomsdays too: **9/5 and 5/9** (9 May and 5 September) and **7/11 and 11/7** (11 July and 7 November). A way to remember them: *I work nine to five at the 7-Eleven.* In 2026 the doomsday is a **Saturday**. On which day of the week is **14 July 2026**?',
  hints: ['11 July 2026 is a doomsday, so it is a Saturday.'],
  explain: '11 July (7/11) is a Saturday; 14 July is 3 days later: a **Tuesday**. The pairs 9/5–5/9 and 7/11–11/7 work either way round, which is what makes them easy to remember.',
  concepts: ['modular'], tags: ['doomsday', 'lesson'],
  data: ask('weekday', { wd: [2026, 7, 14] }, { cal: { from: 2025, to: 2025, at: [2025, 7], dd: true } }) });

add({ id: 'cal-dd-pi-day', title: 'Pi Day and the End of February', diff: 2, group: 0,
  text: 'Two more doomsdays: **14 March** (3/14 — Pi Day) and **the last day of February**, the 28th or, in a leap year, the 29th. The doomsday of 2028, a leap year, is a **Tuesday**. On which day of the week does **1 March 2028** fall?',
  hints: ['In 2028 February has 29 days — and 29 February 2028 is a doomsday.'],
  explain: '29 February 2028 is a doomsday, a Tuesday, so the next day, 1 March, is a **Wednesday**. (Pi Day, 14 March, is exactly two weeks after 29 February: a Tuesday too. People sometimes call the last day of February "March 0" for that reason.)',
  concepts: ['modular'], tags: ['doomsday', 'lesson', 'leap year'],
  data: ask('weekday', { wd: [2028, 3, 1] }, { cal: { from: 2026, to: 2026, at: [2026, 3], dd: true } }) });

add({ id: 'cal-dd-january', title: 'The Third of January', diff: 2, group: 0,
  text: 'January’s doomsday is the **3rd** in a common year and the **4th** in a leap year — the 3rd three years in four, the 4th in the fourth. The doomsday of 2025 was a **Friday**. On which day of the week was **1 January 2025**?',
  hints: ['2025 is not a leap year, so 3 January 2025 was a Friday.'],
  explain: '3 January 2025 was a doomsday, a Friday; 1 January was two days earlier: a **Wednesday**.',
  concepts: ['modular'], tags: ['doomsday', 'lesson', 'new year'],
  data: ask('weekday', { wd: [2025, 1, 1] }, { cal: { from: 2026, to: 2026, at: [2026, 1], dd: true } }) });

add({ id: 'cal-dd-next-year', title: 'One Year On', diff: 2, group: 0,
  text: 'A common year is 52 weeks and 1 day, so from one year to the next the doomsday moves on by **one** weekday — or by **two** when the new year has a 29 February (which comes before its April doomsday). The doomsday of 2026 is a **Saturday**. What is the doomsday of **2029**?',
  hints: ['2027: one step. 2028 is a leap year: two steps. 2029: one step.'],
  explain: '2027: Sunday. 2028 is a leap year: Tuesday. 2029: **Wednesday**. Four steps in all from Saturday.',
  concepts: ['modular'], tags: ['doomsday', 'lesson'],
  data: ask('weekday', { dd: 2029 }, { cal: { from: 2026, to: 2026, at: [2026, 4], dd: true } }) });

add({ id: 'cal-dd-twelve', title: 'The Twelve-Year Stride', diff: 3, group: 0,
  text: 'Twelve years hold 12 × 365 days and 3 leap days: 4383 days, which is 626 weeks and **1 day**. So every 12 years the doomsday moves on by one weekday. The doomsday of 2000 was a **Tuesday**. What is the doomsday of **2036**?',
  hints: ['36 = 3 × 12: three strides.'],
  explain: 'Three strides of twelve years: Tuesday + 3 = **Friday**. The same stride gives ' + WD[L.doomsday(2012)] + ' for 2012 and ' + WD[L.doomsday(2024)] + ' for 2024. This is the heart of Conway’s rule: dozens of years count 1 each.',
  concepts: ['modular'], tags: ['doomsday', 'lesson'],
  data: ask('weekday', { dd: 2036 }, { card: { year: 2036, show: 1 } }) });

add({ id: 'cal-dd-recipe', title: 'Conway’s Recipe', diff: 3, group: 0,
  text: 'Conway’s recipe for the doomsday of a year: start from the century’s **anchor** — Wednesday for the 1900s. Take the last two digits of the year, say 69. Add up how many **dozens** it holds (5), the **remainder** (9), and how many **4s** fit into that remainder (2). Move on that many days from the anchor, casting out whole weeks. What is the doomsday of **1969**?',
  hints: ['5 + 9 + 2 = 16, and 16 = 2 × 7 + 2.'],
  explain: 'Dozens of years move the doomsday one day each (see [[cal-dd-twelve]]); the leftover years move it one day each, plus one more for every leap year among them. For 1969: 5 + 9 + 2 = 16 ≡ 2 (mod 7), and Wednesday + 2 = **Friday**.',
  links: ['cal-dd-twelve'], concepts: ['modular'], tags: ['doomsday', 'lesson'],
  data: ask('weekday', { dd: 1969 }, { cal: { from: 2020, to: 2030, at: [2026, 4], dd: true }, card: { year: 1969, show: 1 } }) });

add({ id: 'cal-dd-anchors', title: 'Century Anchors', diff: 3, group: 0,
  text: 'The anchor days of the centuries run **Friday** (the 1800s), **Wednesday** (1900s), **Tuesday** (2000s), **Sunday** (2100s) — and then the pattern starts again, because 400 Gregorian years are exactly 20,871 weeks. What is the anchor day of the **2300s** — the doomsday of the year 2300?',
  hints: ['The pattern repeats every 400 years: which of the four centuries is 400 years before the 2300s?'],
  explain: '2300 is 400 years after 1900, so its anchor is the same: **Wednesday**. Each Gregorian century of 36,524 days moves the anchor back two weekdays (36,524 = 5217 × 7 + 5, and +5 is −2), except that every fourth century has one leap day more.',
  concepts: ['modular'], tags: ['doomsday', 'lesson'],
  data: ask('weekday', { anchor: 2300 }, { card: { year: 2300, show: 0 } }) });

add({ id: 'cal-dd-together', title: 'Putting It Together', diff: 3, group: 0,
  text: 'Now all three steps: the century anchor, the year’s doomsday, then count from the nearest doomsday date in the month. On which day of the week was **31 December 1999**, the last day before the year 2000?',
  hints: ['1999: 99 = 8 × 12 + 3, and 3 holds no 4s. From Wednesday, 8 + 3 + 0 = 11 steps.'],
  concepts: ['modular'], tags: ['doomsday'],
  data: wd([1999, 12, 31], { card: true }) });

add({ id: 'cal-dd-odd-eleven', title: 'Odd + 11', diff: 4, group: 0,
  text: 'A later shortcut for the year’s doomsday is known as **“odd + 11”**. Take the last two digits of the year. If they are odd, add 11. Halve. If the result is odd, add 11 again. Then find the remainder after dividing by 7, and count that many days **back** from the century’s anchor. Try it: what is the doomsday of **2047**? (The anchor of the 2000s is Tuesday.)',
  hints: ['47 is odd: 58. Halve: 29. Odd again: 40.', '40 = 5 × 7 + 5: count 5 days back from Tuesday.'],
  explain: '47 → 58 → 29 → 40, and 40 leaves 5 after dividing by 7. Five days back from Tuesday is **Thursday**. Conway’s dozens give the same: 47 = 3 × 12 + 11, 11 holds two 4s, 3 + 11 + 2 = 16 ≡ 2, and Tuesday + 2 = Thursday.',
  concepts: ['modular'], tags: ['doomsday', 'lesson'],
  data: ask('weekday', { dd: 2047 }, { card: { year: 2047, show: 0 } }) });

/* ---------------- famous dates ---------------- */

add({ id: 'cal-black-tuesday', title: 'Black Something', diff: 1, group: 1,
  text: 'The worst day of the Wall Street Crash, **29 October 1929**, is remembered by the day of the week it fell on: Black ______. Which day?',
  hints: ['If the name escapes you: the doomsday of 1929 is a Thursday, and 10 October is a doomsday.'],
  explain: 'Black **Tuesday**. By the rule: 10/10 was a Thursday; 29 October is 19 days later, and 19 = 2 × 7 + 5, so Thursday + 5 = Tuesday. (The Thursday before it, 24 October, was Black Thursday.)',
  concepts: ['modular'], tags: ['famous date', '1920s'],
  data: wd([1929, 10, 29]) });

add({ id: 'cal-moon-landing', title: 'The Eagle Has Landed', diff: 2, group: 1,
  text: 'Apollo 11’s lunar module *Eagle* touched down on the Moon on **20 July 1969**, at 20:17 by Greenwich time. On which day of the week was that?',
  concepts: ['modular'], tags: ['famous date', 'space'],
  explain: 'The doomsday of 1969 is a Friday (Wednesday + 5 + 9 + 2). 11 July — 7/11 — was a Friday, and 20 July is 9 days later: Friday + 2 = **Sunday**.',
  data: wd([1969, 7, 20]) });

add({ id: 'cal-berlin-wall', title: 'The Wall Comes Down', diff: 2, group: 1,
  text: 'On the evening of **9 November 1989** the crossings in the Berlin Wall were thrown open and crowds poured through. On which day of the week?',
  concepts: ['modular'], tags: ['famous date'],
  data: wd([1989, 11, 9]) });

add({ id: 'cal-d-day', title: 'D-Day', diff: 2, group: 1,
  text: 'The Allied landings in Normandy took place on **6 June 1944**. On which day of the week?',
  hints: ['6/6 is itself a doomsday date: you only need the doomsday of 1944.'],
  explain: '6 June is a doomsday date, so the answer is the doomsday of 1944: 44 = 3 × 12 + 8, with two 4s in the 8; Wednesday + 3 + 8 + 2 = Wednesday + 13 = Wednesday + 6 = **Tuesday**.',
  concepts: ['modular'], tags: ['famous date'],
  data: wd([1944, 6, 6]) });

add({ id: 'cal-armistice', title: 'The Eleventh Hour', diff: 2, group: 1,
  text: 'The armistice that ended the fighting of the First World War took effect at 11 o’clock on **11 November 1918**. On which day of the week?',
  concepts: ['modular'], tags: ['famous date'],
  data: wd([1918, 11, 11]) });

add({ id: 'cal-sputnik', title: 'Beep, Beep', diff: 2, group: 1,
  text: 'Sputnik 1, the first artificial satellite, was launched on **4 October 1957**. On which day of the week?',
  concepts: ['modular'], tags: ['famous date', 'space'],
  data: wd([1957, 10, 4]) });

add({ id: 'cal-y2k', title: 'The First Day of 2000', diff: 2, group: 1,
  text: 'Programmers worried for years about what their computers would do on **1 January 2000**. On which day of the week did it fall?',
  hints: ['2000 is a leap year (it divides by 400), so January’s doomsday is the 4th.'],
  explain: 'The anchor of the 2000s is Tuesday, and 00 adds nothing: the doomsday of 2000 is a Tuesday. In a leap year January’s doomsday is the 4th, so 1 January 2000, three days earlier, was a **Saturday**.',
  concepts: ['modular'], tags: ['famous date', 'leap year'],
  data: wd([2000, 1, 1]) });

add({ id: 'cal-einstein', title: 'Born on Pi Day', diff: 2, group: 1,
  text: 'Albert Einstein was born on **14 March 1879** — Pi Day, as it is called now. On which day of the week?',
  hints: ['Pi Day, 3/14, is a doomsday date. You only need the doomsday of 1879 (the anchor of the 1800s is Friday).'],
  concepts: ['modular'], tags: ['famous date', 'pi'],
  data: wd([1879, 3, 14]) });

add({ id: 'cal-wright', title: 'Twelve Seconds at Kitty Hawk', diff: 3, group: 1,
  text: 'Orville Wright’s first powered flight, near Kitty Hawk in North Carolina, lasted about twelve seconds. It took place on **17 December 1903**. On which day of the week?',
  concepts: ['modular'], tags: ['famous date', 'flight'],
  data: wd([1903, 12, 17]) });

add({ id: 'cal-independence', title: 'The Fourth of July', diff: 3, group: 1,
  text: 'The Continental Congress adopted the Declaration of Independence on **4 July 1776**. On which day of the week?',
  concepts: ['modular'], tags: ['famous date'],
  data: wd([1776, 7, 4]) });

add({ id: 'cal-bastille', title: 'Storming the Bastille', diff: 3, group: 1,
  text: 'The crowd stormed the Bastille in Paris on **14 July 1789**. On which day of the week?',
  concepts: ['modular'], tags: ['famous date'],
  data: wd([1789, 7, 14]) });

add({ id: 'cal-titanic', title: 'A Night in April', diff: 3, group: 1,
  text: 'The *Titanic* struck an iceberg late on 14 April 1912 and sank in the early hours of **15 April 1912**. On which day of the week did she sink?',
  concepts: ['modular'], tags: ['famous date', 'leap year'],
  data: wd([1912, 4, 15]) });

add({ id: 'cal-waterloo', title: 'Waterloo', diff: 3, group: 1,
  text: 'The Battle of Waterloo was fought on **18 June 1815**. On which day of the week?',
  concepts: ['modular'], tags: ['famous date'],
  data: wd([1815, 6, 18]) });

add({ id: 'cal-darwin-lincoln', title: 'Born the Same Day', diff: 3, group: 1,
  text: 'Charles Darwin and Abraham Lincoln were born on the very same day, **12 February 1809**, an ocean apart. On which day of the week?',
  concepts: ['modular'], tags: ['famous date'],
  data: wd([1809, 2, 12]) });

add({ id: 'cal-gettysburg', title: 'Four Score and Seven', diff: 3, group: 1,
  text: 'Abraham Lincoln gave his Gettysburg Address on **19 November 1863**. On which day of the week?',
  concepts: ['modular'], tags: ['famous date'],
  data: wd([1863, 11, 19]) });

add({ id: 'cal-hastings', title: 'Hastings, 1066', diff: 4, group: 1,
  text: 'The Battle of Hastings was fought on **14 October 1066** — a date in the **Julian calendar**, which England used then. On which day of the week? (The Doomsday rule works in the Julian calendar too; only the century anchors differ.)',
  hints: ['A Julian century is 36,525 days: 5217 weeks and 6 days. So in the Julian calendar the century anchor steps **back** one weekday every century.'],
  concepts: ['modular'], tags: ['famous date', 'julian'],
  data: wd([1066, 10, 14], { style: 'j' }) });

add({ id: 'cal-constantinople', title: 'The Fall of Constantinople', diff: 4, group: 1,
  text: 'Constantinople fell to the Ottoman army of Mehmed II on **29 May 1453**, by the Julian calendar. On which day of the week?',
  hints: ['In the Julian calendar the anchor steps back one day each century; the card shows the anchor for the 1400s.'],
  concepts: ['modular'], tags: ['famous date', 'julian'],
  data: wd([1453, 5, 29], { style: 'j' }) });

add({ id: 'cal-columbus', title: 'Land Ho!', diff: 4, group: 1,
  text: 'Columbus’s ships sighted land in the Bahamas and he went ashore on **12 October 1492** (Julian calendar). On which day of the week?',
  concepts: ['modular'], tags: ['famous date', 'julian'],
  data: wd([1492, 10, 12], { style: 'j' }) });

add({ id: 'cal-magna-carta', title: 'Runnymede', diff: 5, group: 1,
  text: 'King John set his seal to Magna Carta at Runnymede on **15 June 1215** (Julian calendar). On which day of the week?',
  hints: ['Work out the Julian anchor for the 1200s by stepping back one day per century from a century you know — or trust the card.'],
  concepts: ['modular'], tags: ['famous date', 'julian'],
  data: wd([1215, 6, 15], { style: 'j' }) });

/* ---------------- the Julian–Gregorian switch ---------------- */

const OLD = (style) => ({ from: 2020, to: 2030, style, at: [2026, 9] });

add({ id: 'cal-jg-september-1752', title: 'Thirty Days Hath September?', diff: 1, group: 2, year: 1752,
  text: 'In Britain and its colonies, **Wednesday 2 September 1752** was followed by **Thursday 14 September 1752**: eleven dates were dropped to bring the calendar back into step with the seasons — and with most of Europe. How many days did September 1752 have there?',
  explain: 'Thirty days less eleven: **19**. The Calendar Act of 1750 made the change. Turn the almanac to September 1752 to see the famous page. Sweden did it even more oddly: after skipping one leap day in 1700 it changed its mind, and in 1712 added two — so Sweden had a 30 February.',
  concepts: ['modular'], tags: ['julian', 'gregorian', '1752'],
  data: ask('number', { monthLen: [1752, 9, 'uk'] }, { unit: 'days', cal: OLD('uk'), after: [1752, 9] }) });

add({ id: 'cal-jg-no-break', title: 'No Break in the Week', diff: 2, group: 2, year: 1752,
  text: 'In Britain, Wednesday 2 September 1752 was followed straight away by 14 September — eleven dates simply vanished. On which day of the week did **14 September 1752** fall?',
  hints: ['The reform changed the numbering of the days, not the days themselves.'],
  explain: 'The day after Wednesday was **Thursday**, as always: the reform dropped dates, not days, and the week ran on unbroken.',
  concepts: ['modular'], tags: ['julian', 'gregorian', '1752'],
  data: Object.assign(ask('weekday', { wd: [1752, 9, 14], cal: 'uk' }, { cal: OLD('uk') })) });

add({ id: 'cal-jg-rome', title: 'The Pope’s Ten Days', diff: 2, group: 2, year: 1582,
  text: 'Pope Gregory XIII’s reform began in Rome in 1582, when **Thursday 4 October** was followed by Friday … which date? Ten dates were dropped.',
  hints: ['4 + 1 + 10.'],
  explain: 'Friday **15 October 1582**. Ten days made up for the leap years the Julian calendar had counted too many since the Council of Nicaea in 325; from then on, century years are leap years only when divisible by 400.',
  concepts: ['modular'], tags: ['julian', 'gregorian', '1582'],
  data: ask('date', { add: [[1582, 10, 4], 1], cal: 'rome' }, { year: 1582, cal: OLD('rome'), after: [1582, 10] }) });

add({ id: 'cal-jg-russia', title: 'Russia Catches Up', diff: 3, group: 2, year: 1918,
  text: 'Rome dropped 10 days in 1582. Britain, switching in 1752, had to drop 11, because 1700 had been a leap year in the Julian calendar but not in the Gregorian. Russia switched in 1918. How many days did it have to drop?',
  hints: ['Which century years between 1752 and 1918 are leap years in the Julian calendar only?'],
  explain: '1800 and 1900 were Julian leap years but not Gregorian ones, so the gap had grown to **13** days. In 1918, 31 January was followed by 14 February.',
  concepts: ['modular'], tags: ['julian', 'gregorian', '1918'],
  data: ask('number', { gapDays: 1918 }, { unit: 'days', cal: OLD('ru'), after: [1918, 2] }) });

add({ id: 'cal-jg-2100', title: 'When the Gap Grows Again', diff: 3, group: 2,
  text: 'Today the Julian calendar runs 13 days behind the Gregorian. In which year will the gap first grow to **14** days?',
  hints: ['The gap grows only on a 29 February that the Julian calendar has and the Gregorian does not.'],
  explain: '**2100** is a leap year in the Julian calendar but not in the Gregorian. From the Julian 29 February 2100 — Gregorian 14 March 2100 — the gap is 14 days, until 2200 makes it 15.',
  concepts: ['modular'], tags: ['julian', 'gregorian'],
  data: ask('number', { gapYear: 14 }, { cal: OLD('g'), after: [2100, 3] }) });

add({ id: 'cal-jg-newton', title: 'Newton’s Christmas', diff: 3, group: 2, year: 1642,
  text: 'Isaac Newton was born on **25 December 1642** by the Julian calendar still used in England. What was that date by the Gregorian calendar, already in use across much of Europe?',
  hints: ['In the 1600s the Julian calendar was 10 days behind.'],
  explain: 'Ten days on from 25 December 1642 is **4 January 1643**. By his own calendar Newton was a Christmas baby; by ours he was born in 1643.',
  concepts: ['modular'], tags: ['julian', 'gregorian', 'famous date'],
  data: ask('date', { conv: [1642, 12, 25] }, { cal: OLD('g'), traps: [{ match: [1643, 1, 5], msg: 'In the 1600s the gap was 10 days, not 11 — 1700 had not yet happened.' }] }) });

add({ id: 'cal-jg-shakespeare', title: 'The Twenty-Third of April', diff: 3, group: 2, year: 1616,
  text: 'William Shakespeare died on **23 April 1616** by the Julian calendar used in England. What was that date by the Gregorian calendar?',
  explain: 'The gap was 10 days, so it was **3 May 1616**. Spain had adopted the Gregorian calendar at once in 1582, so its dates from that spring are ten days “ahead” of England’s.',
  concepts: ['modular'], tags: ['julian', 'gregorian', 'famous date'],
  data: ask('date', { conv: [1616, 4, 23] }, { cal: OLD('g') }) });

add({ id: 'cal-jg-october', title: 'The October Revolution in November', diff: 3, group: 2, year: 1917,
  text: 'Russia’s October Revolution began on **25 October 1917** by the Julian calendar Russia still used — which is why its anniversaries were kept in November. What was the Gregorian date?',
  hints: ['1800 and 1900 had both widened the gap: it was 13 days.'],
  explain: '25 October + 13 days = **7 November 1917**.',
  concepts: ['modular'], tags: ['julian', 'gregorian', 'famous date'],
  data: ask('date', { conv: [1917, 10, 25] }, { cal: OLD('g'), year: 1917 }) });

add({ id: 'cal-jg-old-new-year', title: 'Old New Year', diff: 2, group: 2,
  text: 'In Russia, Serbia and some other countries, people still celebrate an “Old New Year”: 1 January by the Julian calendar. On which Gregorian date does it fall in 2026?',
  hints: ['Between 1900 and 2100 the Julian calendar is 13 days behind.'],
  explain: 'Julian 1 January 2026 is Gregorian **14 January 2026**.',
  concepts: ['modular'], tags: ['julian', 'gregorian', 'new year'],
  data: ask('date', { conv: [2026, 1, 1] }, { cal: { from: 2026, to: 2026, at: [2026, 1] }, year: 2026 }) });

add({ id: 'cal-jg-christmas', title: 'Christmas in January', diff: 2, group: 2,
  text: 'Churches that keep the Julian calendar celebrate Christmas on its 25 December. On which Gregorian date does that fall, at the end of the Julian year 2026?',
  hints: ['Add 13 days — and watch the year.'],
  explain: 'Julian 25 December 2026 is Gregorian **7 January 2027**, which is why Orthodox Christmas is on 7 January in this century.',
  concepts: ['modular'], tags: ['julian', 'gregorian', 'christmas'],
  data: ask('date', { conv: [2026, 12, 25] }, { cal: { from: 2026, to: 2027, at: [2026, 12] }, traps: [{ match: [2026, 1, 7], msg: 'Right day and month — but the 25 December that ends the year 2026 lands in the next one.' }] }) });

add({ id: 'cal-jg-washington', title: 'Washington’s Two Birthdays', diff: 4, group: 2, year: 1732,
  text: 'George Washington’s birth was recorded as **11 February 1731**. In the British reckoning of the time the year began on **25 March**, so February still belonged to “1731”; and the Julian calendar was then 11 days behind the Gregorian. What is his birthday in today’s reckoning — day, month and year?',
  hints: ['First the year: January to 24 March of “1731” is what we call 1732.', 'Then the calendar: add 11 days.'],
  explain: 'The year that began on 25 March 1731 ran to 24 March of what we call 1732, so the birth fell in our 1732; eleven days on from 11 February is **22 February 1732** — the date Americans keep.',
  concepts: ['modular'], tags: ['julian', 'gregorian', 'famous date'],
  data: ask('date', { conv: [1732, 2, 11] }, { cal: OLD('g'), traps: [{ match: [1731, 2, 22], msg: 'Right day and month. But the old “1731” went on until 24 March: to us, that February was in 1732.' }] }) });

add({ id: 'cal-jg-short-1751', title: 'England’s Short Year', diff: 4, group: 2, year: 1751,
  text: 'Until the 1750s England’s legal year began on **25 March**. The Calendar Act of 1750 moved New Year’s Day to 1 January from 1752 on — so the year 1751 began on 25 March and ended on 31 December. How many days did 1751 have?',
  hints: ['From 25 March to 31 March is 7 days; then April to December in full.'],
  explain: '7 days of March, then 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 + 31 = 275 days from April to December: **282** days. And 1752, the next year, lost 11 days in September.',
  links: ['cal-jg-september-1752'], concepts: ['modular'], tags: ['julian', '1752'],
  data: ask('number', { days: [[1751, 3, 25], [1752, 1, 1]], cal: 'uk' }, { unit: 'days', cal: OLD('uk'), after: [1751, 3] }) });

add({ id: 'cal-jg-1752-length', title: 'The Year of 355 Days', diff: 3, group: 2, year: 1752,
  text: 'The year 1752 was the first in England to begin on 1 January, and it was a leap year — but in September it lost eleven dates. How many days did 1752 have in Britain?',
  explain: '366 − 11 = **355** days.',
  links: ['cal-jg-september-1752', 'cal-jg-short-1751'], concepts: ['modular'], tags: ['julian', '1752', 'leap year'],
  data: ask('number', { yearLen: [1752, 'uk'] }, { unit: 'days', cal: OLD('uk'), after: [1752, 9] }) });

/* ---------------- Easter ---------------- */

add({ id: 'cal-easter-sunday', title: 'A Trick Question', diff: 1, group: 3,
  text: 'On which day of the week will Easter fall in the year 2099?',
  hints: ['Think of the name people give to Easter Day.'],
  explain: 'Easter is always a **Sunday**: the first Sunday after the Paschal full moon, which the churches work out from tables rather than from the sky.',
  concepts: ['modular'], tags: ['easter', 'riddle'],
  data: ask('weekday', { easterWd: 2099 }, { cal: { from: 2026, to: 2026, at: [2026, 4] } }) });

add({ id: 'cal-easter-golden', title: 'The Golden Number', diff: 2, group: 3,
  text: 'Nineteen years hold almost exactly a whole number of lunar months (the Metonic cycle), so the Easter tables number the years 1 to 19. A year’s **golden number** is the remainder after dividing it by 19, plus one. What is the golden number of **2031**?',
  hints: ['19 × 106 = 2014.'],
  explain: '2031 = 19 × 106 + 17, so the golden number is **18**. Years with the same golden number have their Paschal full moons on the same dates.',
  concepts: ['modular'], tags: ['easter'],
  data: ask('number', { golden: 2031 }, { cal: { from: 2026, to: 2026, at: [2026, 4] } }) });

const W31 = easterWork(2031);
add({ id: 'cal-easter-2031', title: 'Easter 2031', diff: 4, group: 3, year: 1876,
  source: 'The algorithm was sent anonymously to *Nature* in 1876.',
  text: 'An algorithm sent anonymously to the journal *Nature* in 1876 finds the date of Easter with a few divisions (“div” keeps the whole part, “mod” the remainder). Work it for **Y = 2031**:\n\n' +
    'a = Y mod 19 · b = Y div 100 · c = Y mod 100\nd = b div 4 · e = b mod 4 · f = (b + 8) div 25 · g = (b − f + 1) div 3\nh = (19a + b − d − g + 15) mod 30 · i = c div 4 · k = c mod 4\nl = (32 + 2e + 2i − h − k) mod 7 · m = (a + 11h + 22l) div 451\n' +
    'n = h + l − 7m + 114: the month is n div 31, the day (n mod 31) + 1.\n\nWhen is Easter Sunday 2031? Type the date or click it on the almanac.',
  hints: ['a = ' + W31.a + ', b = ' + W31.b + ', c = ' + W31.c + ', d = ' + W31.d + ', e = ' + W31.e + ', f = ' + W31.f + ', g = ' + W31.g + '.',
    'h = ' + W31.h + ', i = ' + W31.i + ', k = ' + W31.k + ', l = ' + W31.l + ', m = ' + W31.m + '.',
    'n = ' + W31.n + ' = 31 × ' + Math.floor(W31.n / 31) + ' + ' + (W31.n % 31) + '.'],
  explain: 'n = ' + W31.n + ': month ' + Math.floor(W31.n / 31) + ', day ' + (W31.n % 31 + 1) + ' — **' + fmt(L.easterG(2031)) + '**. The number h places the Paschal full moon, l counts on to the Sunday after it, and m is a rare correction.',
  concepts: ['modular'], tags: ['easter', 'algorithm'],
  data: ask('date', { easter: 2031 }, { year: 2031, cal: { from: 2031, to: 2031, at: [2031, 3] } }) });

add({ id: 'cal-easter-earliest', title: 'The Earliest Easter of the Century', diff: 4, group: 3,
  text: 'Easter can fall as early as 22 March and as late as 25 April. In the 21st century (2000–2099) it never falls on 22 March. What is the earliest Easter of the century? Give the full date.',
  hints: ['It is not long ago — the year of the Beijing Olympics.', 'It is 23 March of that year.'],
  explain: 'Easter 2008 fell on **23 March** — the earliest of the century, and as early as it will be until 2160. (22 March last happened in 1818 and next in 2285.)',
  concepts: ['modular'], tags: ['easter'],
  data: ask('date', { easterMin: [2000, 2099] }, { cal: { from: 2020, to: 2030, at: [2026, 3] } }) });

add({ id: 'cal-easter-latest', title: 'The Latest Easter', diff: 4, group: 3,
  text: 'The latest Easter Sunday of the 21st century falls on the latest date possible. What is it? Give the full date.',
  hints: ['The latest possible Easter is 25 April.', 'The year is in the 2030s.'],
  explain: 'Easter 2038 falls on **25 April**, as late as Easter can be; the last time was 1943.',
  concepts: ['modular'], tags: ['easter'],
  data: ask('date', { easterMax: [2000, 2099] }, { cal: { from: 2020, to: 2030, at: [2026, 4] } }) });

const eBoth = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
add({ id: 'cal-easter-together', title: 'East Meets West', diff: 5, group: 3,
  text: 'Western churches reckon Easter by the Gregorian calendar; most Orthodox churches by the Julian calendar and its own tables. Sometimes the two Easters fall on the same Sunday. In which of these years?',
  hints: ['Western Easter: ' + eBoth.map((y) => y + ' ' + L.fmtDate(L.easterG(y)).replace(/ \d{4}$/, '')).join(', ') + '.', 'Orthodox Easter (as Gregorian dates): ' + eBoth.map((y) => y + ' ' + L.fmtDate(L.easterO(y)).replace(/ \d{4}$/, '')).join(', ') + '.'],
  explain: 'They coincide in ' + L.calcMulti({ pred: 'sameEaster' }, eBoth).map((i) => eBoth[i]).join(' and ') + '. In the other years the Julian reckoning — whose calendar is 13 days behind and whose moon tables run a few days late — puts Orthodox Easter one or more weeks after the Western one.',
  concepts: ['modular'], tags: ['easter', 'julian'],
  data: ask('multi', { pred: 'sameEaster' }, { choices: eBoth.map(String), vals: eBoth, cal: { from: 2020, to: 2030, at: [2026, 4] } }) });

const O26 = orthoWork(2026);
const o26j = L.easterJul(2026);
add({ id: 'cal-easter-orthodox', title: 'Orthodox Easter 2026', diff: 5, group: 3,
  text: 'The Julian reckoning of Easter is shorter: with Y = 2026,\n\na = Y mod 4 · b = Y mod 7 · c = Y mod 19\nd = (19c + 15) mod 30 · e = (2a + 4b − d + 34) mod 7\nn = d + e + 114: the month is n div 31, the day (n mod 31) + 1.\n\nThat gives a date in the **Julian** calendar. On which **Gregorian** date is Orthodox Easter 2026?',
  hints: ['a = ' + O26.a + ', b = ' + O26.b + ', c = ' + O26.c + ', d = ' + O26.d + ', e = ' + O26.e + '.', 'n = ' + O26.n + ': Julian ' + fmt(o26j) + '. Now add the 13 days.'],
  explain: 'Julian ' + fmt(o26j) + ' is Gregorian **' + fmt(L.easterO(2026)) + '**, a week after Western Easter (' + fmt(L.easterG(2026)) + ').',
  concepts: ['modular'], tags: ['easter', 'julian', 'algorithm'],
  data: ask('date', { easterO: 2026 }, { year: 2026, cal: { from: 2026, to: 2026, at: [2026, 4] } }) });

/* ---------------- Friday the 13th ---------------- */

add({ id: 'cal-f13-start', title: 'Unlucky Beginnings', diff: 1, group: 4,
  text: 'A month has a Friday the 13th exactly when its **first** day falls on one particular day of the week. Which?',
  hints: ['The 13th is 12 days after the 1st, and 12 = 7 + 5.'],
  explain: 'The 13th is 12 days — one week and 5 days — after the 1st. For the 13th to be a Friday the 1st must be 5 days before Friday: a **Sunday**. Any month that begins on a Sunday has a Friday the 13th.',
  concepts: ['modular'], tags: ['friday 13th'],
  data: ask('weekday', { f13start: 1 }, { cal: { from: 2026, to: 2026, at: [2026, 2], open: true } }) });

add({ id: 'cal-f13-2026', title: 'Friday the 13ths of 2026', diff: 2, group: 4,
  text: '2026 begins on a **Thursday**. How many Friday the 13ths does it have?',
  hints: ['13 January is 12 days after Thursday 1 January: a Tuesday. From one 13th to the next the weekday moves on by the length of the month, less whole weeks: 31 days → 3, 30 → 2, 28 → 0.', 'The 13ths of 2026 fall on: ' + thirteenths(2026, 6) + ' …'],
  explain: 'The 13ths go ' + thirteenths(2026) + '. Fridays in February, March and November: **3**. February and March go together in every common year, because February has exactly four weeks.',
  concepts: ['modular'], tags: ['friday 13th'],
  data: ask('number', { f13: 2026 }, { cal: { from: 2025, to: 2025, at: [2025, 1] }, after: [2026, 2] }) });

add({ id: 'cal-f13-most', title: 'Three in a Year', diff: 2, group: 4,
  text: 'What is the greatest number of Friday the 13ths a single year can have?',
  hints: ['In a common year, February and March have their 13ths on the same weekday — and so, 35 weeks later, does November.'],
  explain: '**3**: February, March and November in a common year that begins on a Thursday (like 2015 and 2026); January, April and July in a leap year that begins on a Sunday (like 2012).',
  concepts: ['modular'], tags: ['friday 13th'],
  data: ask('number', { f13stat: 'max' }, { cal: { from: 2026, to: 2026, at: [2026, 2], open: true } }) });

add({ id: 'cal-f13-least', title: 'Never Without One', diff: 3, group: 4,
  text: 'Can a whole year pass without a single Friday the 13th? What is the fewest a year can have?',
  hints: ['List how far each month’s 13th is, in weekdays, from January’s: 0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5 in a common year. Are all seven remainders there?'],
  explain: 'In a common year the 13ths of the twelve months sit 0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3 and 5 weekdays on from January’s — every remainder from 0 to 6 appears, so one of them must be a Friday. The same holds in leap years. So the fewest is **1**.',
  concepts: ['modular'], tags: ['friday 13th'],
  data: ask('number', { f13stat: 'min' }, { cal: { from: 2026, to: 2026, at: [2026, 1], open: true } }) });

add({ id: 'cal-f13-thursday', title: 'Thursday Years', diff: 3, group: 4,
  text: 'In every **common** year (not a leap year) that begins on a **Thursday**, the Friday the 13ths fall in the same months. Which?',
  hints: ['If 1 January is a Thursday, 13 January is a Tuesday. Carry on month by month: +3 after a 31-day month, +2 after 30, +0 after February.'],
  explain: 'The 13ths go Tue, Fri, Fri, Mon, Wed, Sat, Mon, Thu, Sun, Tue, Fri, Sun: **February, March and November** — the most a year can have.',
  links: ['cal-f13-most'], concepts: ['modular'], tags: ['friday 13th'],
  data: ask('multi', { pred: 'f13type', w: 4, leap: false }, { choices: MONTH_CHOICES, vals: MONTH_VALS, cal: { from: 2026, to: 2026, at: [2026, 1], open: true } }) });

add({ id: 'cal-f13-2027', title: 'Which Months in 2027?', diff: 3, group: 4,
  text: '2027 begins on a Friday. In which of its months is there a Friday the 13th?',
  hints: ['13 January 2027 is 12 days after Friday 1 January: a Wednesday.', 'The 13ths of 2027: ' + thirteenths(2027, 6) + ' …'],
  explain: 'The 13ths of 2027 fall on ' + thirteenths(2027) + ': just one Friday, in **' + L.f13(2027).map((m) => M[m - 1]).join(' and ') + '**.',
  concepts: ['modular'], tags: ['friday 13th'],
  data: ask('multi', { pred: 'f13', y: 2027 }, { choices: MONTH_CHOICES, vals: MONTH_VALS, cal: { from: 2026, to: 2026, at: [2026, 1] }, after: [2027, L.f13(2027)[0]] }) });

add({ id: 'cal-f13-gap', title: 'The Longest Wait', diff: 4, group: 4,
  text: 'What is the longest wait from one Friday the 13th to the next — counted in months, from the month of one to the month of the other?',
  hints: ['A long wait needs the 13ths to avoid Friday month after month. Try a year that begins on a Monday and has its only Friday the 13th in July, then follow into the next year.'],
  explain: '**14 months** — for example from July 2001 to September 2002. Over the whole 400-year cycle no wait is longer.',
  concepts: ['modular'], tags: ['friday 13th'],
  data: ask('number', { f13stat: 'gap' }, { unit: 'months', cal: { from: 2026, to: 2026, at: [2026, 1], open: true } }) });

add({ id: 'cal-f13-favourite', title: 'The Thirteenth’s Favourite Day', diff: 4, group: 4,
  text: 'Over the 400-year cycle of the Gregorian calendar — 4800 months — the 13th falls on some weekdays a little more often than others. On which day of the week does it fall most often?',
  hints: ['400 years are exactly 20,871 weeks, so the cycle repeats exactly, and the counts need not be equal. The answer is a small surprise.'],
  explain: '**Friday**: ' + L.f13Stats().byWd.map((n, w) => WD[w] + ' ' + n).join(', ') + '. The superstitious day is, very slightly, the likeliest one.',
  concepts: ['modular'], tags: ['friday 13th'],
  data: ask('weekday', { f13stat: 'most' }, { cal: { from: 2026, to: 2026, at: [2026, 2], open: true } }) });

/* ---------------- calendars that repeat ---------------- */

const OLDC = { from: 2000, to: 2010, at: [2000, 1] };
add({ id: 'cal-repeat-2026', title: 'Reusing the 2026 Calendar', diff: 2, group: 5,
  text: 'You have a beautiful wall calendar for 2026. In which year will it next be exactly right again — every date on the same day of the week?',
  hints: ['The year must begin on the same weekday as 2026 (a Thursday) and must not be a leap year.', 'Each common year moves 1 January on by one weekday, a leap year by two. 2027 begins on a Friday, 2028 on a Saturday, 2029 on a Monday …'],
  explain: 'Counting on: 2027 Fri, 2028 Sat (leap), 2029 Mon, 2030 Tue, 2031 Wed, 2032 Thu (but a leap year), 2033 Sat, 2034 Sun, 2035 Mon, 2036 Tue (leap), 2037 **Thursday**, a common year: **2037**.',
  concepts: ['modular'], tags: ['repeat'],
  data: ask('number', { repeat: 2026 }, { cal: OLDC, after: [2037, 1] }) });

add({ id: 'cal-repeat-2024', title: 'A Leap-Year Calendar', diff: 3, group: 5,
  text: 'A calendar for 2024 — a leap year beginning on a Monday. When can it next be hung on the wall?',
  hints: ['It needs a leap year beginning on a Monday. Leap years come every 4 years, and each 4-year step moves 1 January on by 5 weekdays.'],
  explain: 'Four years are 1461 days, 208 weeks and 5 days, so leap years step round the week by 5 at a time: 2028 Sat, 2032 Thu, 2036 Tue, 2040 Sun, 2044 Fri, 2048 Wed, **2052** Mon. Seven steps: 28 years.',
  concepts: ['modular'], tags: ['repeat', 'leap year'],
  data: ask('number', { repeat: 2024 }, { cal: OLDC, after: [2052, 2] }) });

add({ id: 'cal-repeat-1900', title: 'Grandfather’s Calendar', diff: 4, group: 5,
  text: 'Your great-grandfather kept his calendar for **1900**. In which year could he have used it again?',
  hints: ['1900 was **not** a leap year (it divides by 100 but not by 400). 1 January 1900 was a Monday.'],
  explain: '1901 began on a Tuesday, 1902 Wednesday, 1903 Thursday, 1904 Friday (a leap year), 1905 Sunday, 1906 **Monday** — a common year: **1906**. Anyone who thought 1900 was a leap year would have waited for 1928 in vain.',
  concepts: ['modular'], tags: ['repeat', 'leap year'],
  data: ask('number', { repeat: 1900 }, { cal: OLDC, after: [1906, 1], traps: [{ match: 1928, msg: 'That would be right if 1900 had been a leap year. Was it?' }] }) });

const r2000 = [2028, 2034, 2040, 2056, 2072, 2084, 2096, 2100];
add({ id: 'cal-repeat-2000', title: 'The Calendar of 2000', diff: 4, group: 5,
  text: 'The year 2000 was a leap year that began on a Saturday. In which of these years can its calendar be used again?',
  hints: ['Only leap years qualify. 2100 is not one.', 'Among leap years, 1 January steps on 5 weekdays every 4 years, so a match comes every 28 years — as long as no century year gets in the way.'],
  explain: '**2028, 2056 and 2084**. The 28-year rhythm then breaks at 2100, which is not a leap year: the next year with the calendar of 2000 is ' + (() => { for (let y = 2085; ; y++) if (L.sameCal(2000, y)) return y; })() + '.',
  concepts: ['modular'], tags: ['repeat', 'leap year'],
  data: ask('multi', { pred: 'sameCal', y: 2000 }, { choices: r2000.map(String), vals: r2000, cal: { from: 2010, to: 2020, at: [2010, 1] } }) });

/* ---------------- leap years ---------------- */

const lyVals = [1600, 1700, 1800, 1900, 2000, 2024, 2100];
add({ id: 'cal-leap-which', title: 'Leap or Not?', diff: 1, group: 6,
  text: 'Which of these are leap years in the Gregorian calendar?',
  hints: ['Every year divisible by 4 is a leap year — except century years, which are leap years only when divisible by 400.'],
  explain: '**1600, 2000 and 2024.** 1700, 1800, 1900 and 2100 divide by 100 but not by 400. The rule drops three leap days every four centuries, making the average year 365.2425 days.',
  concepts: ['modular'], tags: ['leap year'],
  data: ask('multi', { pred: 'leap' }, { choices: lyVals.map(String), vals: lyVals, cal: { from: 2026, to: 2026, at: [2026, 2] } }) });

add({ id: 'cal-leap-count', title: 'Leap Years of the 1800s', diff: 2, group: 6,
  text: 'How many leap years were there from 1801 to 1900, both included?',
  hints: ['From 1804 to 1900 there are 25 years divisible by 4. Are they all leap years?'],
  explain: '1804, 1808 … 1896 — that is **24**. The 25th candidate, 1900, is a century year not divisible by 400.',
  concepts: ['modular'], tags: ['leap year'],
  data: ask('number', { leapCount: [1801, 1900] }, { cal: { from: 2026, to: 2026, at: [2026, 2] }, traps: [{ match: 25, msg: 'Was 1900 a leap year?' }] }) });

add({ id: 'cal-leap-birthday', title: 'Forty Years, Ten Birthdays', diff: 2, group: 6,
  text: 'Leila was born on **29 February 2004**. By the time she turns 40, in 2044, how many real birthdays — 29 Februarys — will she have had, not counting the day she was born?',
  hints: ['2008, 2012, …, 2044.'],
  explain: '2008, 2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040 and 2044: **10** — no century year in the way.',
  concepts: ['modular'], tags: ['leap year', 'birthday'],
  data: ask('number', { feb29: [2004, 40] }, { cal: { from: 2026, to: 2026, at: [2026, 2] } }) });

add({ id: 'cal-leap-third', title: 'The Missing Birthday', diff: 3, group: 6,
  text: 'A girl born on **29 February 1892** celebrated her birthday only when a 29 February came round. How old was she, in years, at her **third** real birthday?',
  hints: ['1896 was the first. What about 1900?'],
  explain: '1896 (age 4), then **not** 1900, then 1904 (age 12) and 1908 (age **16**). She waited eight years between her first and second birthdays.',
  concepts: ['modular'], tags: ['leap year', 'birthday'],
  data: ask('number', { feb29nth: [1892, 3], age: true }, { unit: 'years', cal: { from: 2026, to: 2026, at: [2026, 2] }, traps: [{ match: 12, msg: 'That would be right if 1900 had been a leap year.' }] }) });

add({ id: 'cal-leap-pirates', title: 'The Apprentice’s Indentures', diff: 4, group: 6,
  source: 'In the spirit of Gilbert and Sullivan’s *The Pirates of Penzance* (1879), whose hero was born on 29 February.',
  text: 'An apprentice born on **29 February 1872** is bound to serve until his **21st birthday** — and his master insists on counting only real birthdays, the 29 Februarys. In which year is he free at last?',
  hints: ['From 1876 to 1896 he has 6 birthdays.', 'Then comes 1900. Is it a leap year?'],
  explain: '1876 … 1896 gives 6 birthdays; 1900 gives none; 1904 … 1960 gives 15 more. His 21st real birthday is 29 February **1960**, when he is 88 years old.',
  concepts: ['modular'], tags: ['leap year', 'birthday'],
  data: ask('number', { feb29nth: [1872, 21] }, { cal: { from: 2026, to: 2026, at: [2026, 2] }, traps: [{ match: 1956, msg: 'Close! Is 1900 a leap year?' }] }) });

add({ id: 'cal-leap-gap', title: 'The Longest Wait for 29 February', diff: 3, group: 6,
  text: 'Usually a 29 February comes round every four years. What is the longest wait, in years, from one 29 February to the next?',
  hints: ['Look near a century year that is not divisible by 400.'],
  explain: '**8 years**, across a century year that is not a leap year: 1896 to 1904, or 2096 to 2104.',
  concepts: ['modular'], tags: ['leap year'],
  data: ask('number', { feb29gap: 1 }, { unit: 'years', cal: { from: 2026, to: 2026, at: [2026, 2] } }) });

add({ id: 'cal-leap-400', title: 'Four Hundred Years', diff: 3, group: 6,
  text: 'How many days are there in 400 years of the Gregorian calendar?',
  hints: ['400 × 365, plus one leap day for every year divisible by 4, less the century years that are not leap years.'],
  explain: '400 × 365 = 146,000, plus 100 leap days less 3 (1700, 1800, 1900 in a cycle like 1601–2000): **146,097**. It is exactly 20,871 weeks — which is why the Gregorian calendar repeats every 400 years to the day.',
  concepts: ['modular'], tags: ['leap year'],
  data: ask('number', { days400: 1 }, { unit: 'days', cal: { from: 2026, to: 2026, at: [2026, 1] } }) });

add({ id: 'cal-leap-average', title: 'The Average Year', diff: 4, group: 6,
  text: 'What is the average length of a Gregorian calendar year, in days? Give the exact decimal.',
  hints: ['Divide the days of a 400-year cycle by 400.'],
  explain: '146,097 ÷ 400 = **365.2425** days — within about half a minute of the year of the seasons, 365.2422 days.',
  links: ['cal-leap-400'], concepts: ['modular'], tags: ['leap year'],
  data: ask('number', { avgYear: 1 }, { unit: 'days', cal: { from: 2026, to: 2026, at: [2026, 2] } }) });

/* ---------------- dates to find ---------------- */

add({ id: 'cal-thanksgiving', title: 'Thanksgiving 2031', diff: 3, group: 7,
  text: 'In the United States, Thanksgiving is the **fourth Thursday of November**. What is its date in 2031?',
  hints: ['Find the weekday of 7 November 2031 — a doomsday date — first.'],
  concepts: ['modular'], tags: ['holiday'],
  explain: 'The doomsday of 2031 is a ' + WD[L.doomsday(2031)] + ', so 7 November 2031 is a ' + WD[L.doomsday(2031)] + ' and the first Thursday falls on ' + L.nthWd(2031, 11, 4, 1)[2] + ' November. Three weeks later: **' + fmt(L.nthWd(2031, 11, 4, 4)) + '**.',
  data: ask('date', { nth: [2031, 11, 4, 4] }, { year: 2031, cal: { from: 2026, to: 2026, at: [2026, 11] } }) });

add({ id: 'cal-summer-time', title: 'Clocks Forward', diff: 3, group: 7,
  text: 'In the European Union, summer time begins on the **last Sunday of March**. On what date does it begin in 2029?',
  hints: ['14 March (Pi Day) is a doomsday. The doomsday of 2029 is a Wednesday.'],
  explain: 'Pi Day, 14 March 2029, is a Wednesday, so the Sundays are the 18th and the 25th: **' + fmt(L.nthWd(2029, 3, 0, -1)) + '**.',
  concepts: ['modular'], tags: ['holiday'],
  data: ask('date', { nth: [2029, 3, 0, -1] }, { year: 2029, cal: { from: 2026, to: 2026, at: [2026, 3] } }) });

const five = L.calcMulti({ pred: 'five', y: 2027, wd: 5 }, MONTH_VALS);
add({ id: 'cal-five-fridays', title: 'Five Fridays', diff: 3, group: 7,
  text: '2027 begins on a Friday. Which of its months have **five** Fridays?',
  hints: ['Four weeks are 28 days, so a month has five Fridays when one of its first few days is a Friday: the 1st, 2nd or 3rd of a 31-day month, the 1st or 2nd of a 30-day month.', 'Find the weekday of the 1st of each month: 2027 is a common year, so the 1sts move on by 3 after a 31-day month, 2 after a 30-day month and 0 after February.'],
  explain: 'Months of 2027 with five Fridays: **' + five.map((i) => M[i]).join(', ') + '**.',
  concepts: ['modular'], tags: ['counting'],
  data: ask('multi', { pred: 'five', y: 2027, wd: 5 }, { choices: MONTH_CHOICES, vals: MONTH_VALS, cal: { from: 2026, to: 2026, at: [2026, 1] }, after: [2027, 1] }) });

add({ id: 'cal-wall-to-unity', title: 'From the Wall to Unity', diff: 3, group: 7,
  text: 'The Berlin Wall opened on **9 November 1989**; Germany was reunified on **3 October 1990**. How many days after the first was the second?',
  concepts: ['modular'], tags: ['days between', 'famous date'],
  data: ask('number', { days: [[1989, 11, 9], [1990, 10, 3]] }, { unit: 'days', cal: { from: 1989, to: 1990, at: [1989, 11], marks: [[1989, 11, 9, 'a', 'wall'], [1990, 10, 3, 't']] } }) });

add({ id: 'cal-century-days', title: 'A Century of Days', diff: 3, group: 7,
  text: 'The 20th century ran from 1 January 1901 to 31 December 2000. How many days did it have?',
  hints: ['100 × 365, plus a leap day for every year divisible by 4 from 1904 to 2000 — and 2000 is one of them.'],
  explain: '36,500 + 25 leap days (1904 … 2000, with 2000 a leap year as it divides by 400) = **36,525** days.',
  concepts: ['modular'], tags: ['days between', 'leap year'],
  data: ask('number', { days: [[1901, 1, 1], [2001, 1, 1]] }, { unit: 'days', cal: { from: 2026, to: 2026, at: [2026, 1] } }) });

add({ id: 'cal-10000-days', title: 'Ten Thousand Days Old', diff: 4, group: 7,
  text: 'A baby born on **1 January 2000** is one day old on 2 January. On what date is she **10,000 days** old?',
  concepts: ['modular'], tags: ['days between'],
  data: ask('date', { add: [[2000, 1, 1], 10000] }, { cal: { from: 2000, to: 2000, at: [2000, 1], marks: [[2000, 1, 1, 'a', 'born']] } }) });

/* ---------------- the calendar cubes ---------------- */

add({ id: 'cal-cubes-both', title: 'On Both Cubes', diff: 2, group: 8,
  text: 'A desk calendar shows the day of the month with two cubes side by side, each with one digit on every face: 01, 02 … 31. Which digits **must** appear on **both** cubes? (A 6 may be turned upside down to serve as a 9.)',
  hints: ['Which days need the same digit twice?', 'And 01 to 09: the 0 must sit beside nine different digits.'],
  explain: '**0, 1 and 2.** Days 11 and 22 need a 1 and a 2 on each cube. The 0 must pair with 1 to 9: one cube cannot hold nine other digits on its six faces, so the 0 goes on both as well.',
  concepts: ['pigeonhole'], tags: ['cubes'],
  data: ask('multi', { pred: 'cubeBoth', six: true }, { choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], vals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], show: 'cubes' }) });

add({ id: 'cal-cubes-second', title: 'The Second Cube', diff: 2, group: 8,
  text: 'A desk calendar shows the day of the month with two cubes. The first is already printed with **0, 1, 2, 3, 4, 5**. Write a digit on each face of the second cube so that together they can show every day from 01 to 31. (A 6 turned upside down makes a 9.)',
  explain: 'The second cube needs 0, 1 and 2 (for 10, 11, 20, 22 and the like, and 01–09 with the 0 of the first cube) and then 6, 7, 8 — the 6 doubling as a 9.',
  concepts: ['pigeonhole'], tags: ['cubes'],
  data: { kind: 'cubes', six: true, fixed: [[0, 1, 2, 3, 4, 5], null] } });

add({ id: 'cal-cubes', title: 'The Calendar Cubes', diff: 3, group: 8,
  text: 'Label two blank cubes, one digit on each face, so that side by side they can show every day of the month from **01** to **31**. You may turn a 6 upside down to make a 9.',
  explain: 'Both cubes carry 0, 1 and 2; the other six faces take 3, 4, 5, 6, 7, 8, three on each cube, the 6 doubling as the 9. It works only because of that upside-down 6.',
  links: ['cal-cubes-both', 'cal-cubes-no-flip'], concepts: ['pigeonhole'], tags: ['cubes'],
  data: { kind: 'cubes', six: true } });

add({ id: 'cal-cubes-no-flip', title: 'Without Turning the Six', diff: 3, group: 8,
  text: 'Suppose the 6 may **not** be turned upside down to make a 9. Can two cubes still show every day from 01 to 31?',
  hints: ['Count the faces: which digits need to be on both cubes, and how many digits are left over for the remaining faces?'],
  explain: '**No.** 0, 1 and 2 must be on both cubes — six of the twelve faces. The other six faces would have to hold seven digits, 3 to 9. One is always missing.',
  concepts: ['pigeonhole'], tags: ['cubes', 'impossible'],
  data: ask('choice', { cubes: 'possible', six: false }, { choices: ['Yes, it can be done', 'No, it cannot be done'], vals: [true, false], show: 'cubes' }) });

add({ id: 'cal-cubes-count', title: 'How Many Ways?', diff: 4, group: 8,
  text: 'Count a pair of calendar cubes only by which digits are on each — not where they sit on the faces, and not which cube is which. In how many different ways can the two cubes be labelled to show every day from 01 to 31? (A 6 serves as a 9.)',
  hints: ['0, 1 and 2 are on both cubes. That leaves the six digits 3, 4, 5, 6, 7, 8 to share out, three to a cube.'],
  explain: 'Choose which three of 3, 4, 5, 6, 7, 8 go on the first cube: 20 ways. Swapping the cubes gives the same pair, so there are **10**.',
  concepts: ['combinatorics'], tags: ['cubes', 'counting'],
  data: ask('number', { cubes: 'count', six: true }, { show: 'cubes' }) });

/* ---------------- a few made by the engine ---------------- */

const genned = [];
for (let lv = 1; lv <= 5; lv++) {
  let seed = 0, w = 0, dd = 0;
  while (w < 1 || dd < 1) {
    const rng = C.rng(20260930 + lv * 1000 + seed++);
    const p = rng() < 0.5 ? L.genWeekday(C.rng(seed * 7 + lv), lv) : L.genDays(C.rng(seed * 11 + lv), lv);
    if (!p) continue;
    const isW = p.data.kind === 'weekday';
    if (isW && w >= 1) continue;
    if (!isW && dd >= 1) continue;
    if (isW) w++; else dd++;
    genned.push(Object.assign(p, { group: 9 }));
  }
}
genned.forEach((p, i) => { p.id = 'cal-g' + String(i + 1).padStart(3, '0'); P.push(p); });

/* ---------------- check, sort, write ---------------- */

const seenT = new Set();
P.forEach((p) => {
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  if (seenT.has(p.title)) throw new Error('duplicate title ' + p.title);
  seenT.add(p.title);
});
const order = P.map((p, i) => ({ p, i })).sort((a, b) => a.p.diff - b.p.diff || a.p.group - b.p.group || a.i - b.i).map((x) => x.p);

const lines = [];
lines.push('/* The Puzzle Cabinet · data/calendar-puzzles.js — made by tools/gen/calendar.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'calendar-puzzles', engine: 'calendar', cat: 'cards', name: 'Calendars', order: 6,");
lines.push("  blurb: 'What day was the Moon landing? When is Easter in 2031? Leap days, lost days, Friday the 13th and Conway’s Doomsday rule — with an almanac to turn.',");
lines.push("  origin: { year: 1582, who: 'Pope Gregory XIII', note: 'The calendar most of the world uses comes from Pope Gregory XIII’s reform of 1582, which dropped ten dates and three leap days in every four centuries. In 1973 John Conway devised his Doomsday rule for finding the weekday of any date in your head.' },");
lines.push("  concepts: ['modular', 'working-backwards']");
lines.push('}, [');
const emit = (p) => {
  const q = Object.assign({}, p);
  delete q.group;
  const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags', 'data'].filter((k) => q[k] != null && !(Array.isArray(q[k]) && !q[k].length));
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(q[k])).join(',\n    ') + ' },');
};
order.forEach(emit);
lines.push(']);');
lines.push('');
lines.push('Cabinet.history([');
lines.push("  { year: 1582, title: 'The Gregorian calendar', text: 'Pope Gregory XIII’s reform: in Rome, Thursday 4 October is followed by Friday 15 October, and from now on century years are leap years only when divisible by 400.', links: ['cal-jg-rome', 'calendar-puzzles'] },");
lines.push("  { year: 1752, title: 'Britain loses eleven days', text: 'Under the Calendar Act of 1750, Wednesday 2 September 1752 is followed by Thursday 14 September in Britain and its colonies; the year now begins on 1 January.', links: ['cal-jg-september-1752', 'calendar-puzzles'] },");
lines.push("  { year: 1876, title: 'An Easter algorithm', text: 'An anonymous correspondent sends Nature a recipe for the date of Easter in the Gregorian calendar, using nothing but divisions and remainders.', links: ['cal-easter-2031'] },");
lines.push("  { year: 1973, title: 'The Doomsday rule', text: 'John Conway devises a way to find the day of the week of any date in your head: century anchors, the year’s doomsday, and dates like 4/4, 6/6 and 9/5 that always share it.', links: ['cal-dd-line-up', 'calendar-puzzles'] }");
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/calendar-puzzles.js'), lines.join('\n') + '\n');
const byDiff = [0, 0, 0, 0, 0, 0];
order.forEach((p) => byDiff[p.diff]++);
console.log('calendar-puzzles: ' + order.length + ' puzzles; by difficulty ' + byDiff.slice(1).join(' / '));
