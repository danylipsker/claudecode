/* The Puzzle Cabinet · tools/gen/clocks.js
 *
 *   node tools/gen/clocks.js      writes data/clock-puzzles.js
 *
 * Setting the hands (overlaps, right angles, mirrors, clocks that run fast),
 * angles between the hands, counting and striking, the clock that gains or
 * loses, Roman faces, and cutting the face into parts with equal sums. Every
 * target time and answer is recomputed by the engine's verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/clocks.js'));
const L = C.clockLib;
const E = C.engines.clocks;
const H = 3600, M = 60;
const list = [];
const T = (h, m, s) => (h % 12) * H + (m || 0) * M + (s || 0);
const hm = (t) => L.fmt(t, false);
// minutes as a whole number and elevenths: 16 4/11
function frac11(x) {
  const n = Math.round(x * 11), w = Math.floor(n / 11), r = n % 11;
  if (Math.abs(x * 11 - n) > 1e-6) return C.fmtCalc(Math.round(x * 1e4) / 1e4);
  return r ? (w ? w + ' ' : '') + r + '/11' : String(w);
}

function setP(id, title, diff, text, cond, extra) {
  const target = L.targetsOf(cond);
  const d = Object.assign({ kind: 'set', start: 0, face: 'arabic', seconds: true, target, tol: 3, cond }, extra && extra.data);
  const p = Object.assign({ id, title, diff, text, concepts: ['rates'], tags: ['set the hands'], data: d }, extra || {});
  p.data = d;
  if (!p.explain && p.explainAuto !== false) p.explain = null;
  delete p.explainAuto;
  return p;
}
function askP(id, title, diff, text, answer, calc, extra) {
  const d = Object.assign({ kind: 'ask', start: 0, face: 'arabic', answer, calc }, extra && extra.data);
  const p = Object.assign({ id, title, diff, text, tags: ['question'], data: d }, extra || {});
  p.data = d;
  return p;
}

/* ---------- setting the hands ---------- */

list.push(setP('clock-set-twenty-to-five', 'Twenty to Five', 1, 'Set the clock to **twenty to five**. Drag the long hand round (or grab anywhere on the face); the short hand follows by itself, just as in a real clock.', { at: T(4, 40) },
  { data: { start: T(12, 0), seconds: false, tol: 30 }, goal: 'The clock shows 4:40.', hints: ['Twenty to five is 4:40: the minute hand points at the 8.', 'The hour hand should be two-thirds of the way from the 4 to the 5.'], concepts: [] }));
list.push(setP('clock-set-quarter-past-nine', 'A Quarter Past Nine', 1, 'Set the clock to **a quarter past nine**. You can drag the short hand too: it moves the hours, and the long hand whirls round twelve times as fast.', { at: T(9, 15) },
  { data: { start: T(3, 0), seconds: false, tol: 30 }, goal: 'The clock shows 9:15.', hints: ['The minute hand points at the 3.', 'The hour hand sits a quarter of the way from the 9 to the 10 — not on the 9.'], concepts: [] }));
list.push(setP('clock-set-mirror-same', 'Looks the Same in the Glass', 2, 'Set the clock to a time — any time — at which the clock and its reflection in a mirror show exactly the same time.', { same: true },
  { data: { start: T(3, 0), seconds: false, tol: 20 }, goal: 'The mirror image shows the same time as the clock.', hints: ['A mirror swaps left and right: a hand pointing to the 3 seems to point to the 9.', 'Both hands must point straight up or straight down.'], explain: 'A left–right mirror turns a hand at angle θ from 12 into one at 360° − θ. Both hands look the same only if each points at 12 or at 6 — and the hands only do that together at **12:00** and **6:00**.', concepts: ['symmetry'], tags: ['mirror'] }));
[
  ['clock-set-overlap-3', 'Together after Three', 3, 3, 0, 'At three o\'clock the minute hand is a quarter-turn behind the hour hand. Set the clock to the moment it catches up — when the two hands lie exactly on top of each other.', ['At 3:00 the minute hand is 90° behind.', 'The minute hand turns 6° a minute, the hour hand ½°: it gains 5½° every minute. How many minutes to gain 90°?', '90 ÷ 5½ = 16 4/11 minutes — that is 16 minutes and nearly 22 seconds.']],
  ['clock-set-overlap-12', 'The Hands Meet Again', 3, 0, 0, 'At noon the two hands are together. Set the clock to the next moment they are exactly together again.', ['It is not 1:05 exactly — the hour hand has moved on a little by then.', 'The minute hand has to gain a whole turn on the hour hand in the 11 overlaps of 12 hours.'], true],
  ['clock-set-overlap-6', 'Together after Six', 3, 6, 0, 'Set the clock to the first moment after six o\'clock when the two hands lie exactly on top of each other.', ['At 6:00 the hands are 180° apart, and the minute hand gains 5½° a minute.']],
  ['clock-set-overlap-9', 'Together after Nine', 3, 9, 0, 'Set the clock to the first moment after nine o\'clock when the hands are together.', ['At 9:00 the minute hand is 270° behind the hour hand.']],
  ['clock-set-right-3', 'Square after Three', 3, 3, 90, 'At three o\'clock the hands make a right angle. Set the clock to the **next** moment they are at right angles.', ['After 3:00 the minute hand catches the hour hand, passes it, and must then get 90° ahead.', 'It must gain 180° altogether: 180 ÷ 5½ minutes.']],
  ['clock-set-right-12', 'The First Right Angle', 3, 0, 90, 'Starting from noon, set the clock to the first moment the two hands make a right angle.', ['The minute hand must gain 90° on the hour hand, at 5½° a minute.']],
  ['clock-set-opposite-12', 'Straight Across after Noon', 3, 0, 180, 'Starting from noon, set the clock to the first moment the two hands point in exactly opposite directions — a straight line through the centre.', ['The minute hand must gain 180°.']],
  ['clock-set-opposite-4', 'Opposite after Four', 3, 4, 180, 'Set the clock to the first moment after four o\'clock when the hands point in exactly opposite directions.', ['At 4:00 the hour hand is 120° ahead; the minute hand must get 180° beyond it.']],
  ['clock-set-opposite-7', 'Opposite after Seven', 3, 7, 180, 'Set the clock to the first moment after seven o\'clock when the hands point in exactly opposite directions.', ['At 7:00 the minute hand is 210° behind the hour hand, measured the way the hands turn.', 'It only has to close that to 180°: a gain of 30°, at 5½° a minute.']],
  ['clock-set-60-after-2', 'Sixty Degrees Apart', 4, 2, 60, 'At two o\'clock the hands are exactly 60° apart. Set the clock to the **next** moment they are 60° apart.', ['The minute hand must catch up the 60°, pass the hour hand, and get 60° ahead: 120° gained.']],
  ['clock-set-120-after-4', 'A Third of the Way Round', 4, 4, 120, 'At four o\'clock the hands are 120° apart. Set the clock to the next moment they are 120° apart again.', ['The minute hand must gain 240° altogether.']]
].forEach(([id, title, diff, h, A, text, hints, special]) => {
  const tt = L.nextAngle(A, h * H);
  const gain = ((tt - h * H) / 60) * 5.5;
  list.push(setP(id, title, diff, text + ' (The clock accepts 3 seconds either way.)', { angle: A, after: h * H }, {
    data: { start: T(h, 0) },
    goal: 'Hands ' + (A === 0 ? 'together' : A === 180 ? 'opposite' : A + '° apart') + ', to within 3 seconds.',
    hints,
    explain: special
      ? 'The minute hand gains 5½° a minute on the hour hand, so it gains a full turn every 360 ÷ 5½ = 65 5/11 minutes. The hands meet at **' + L.fmtExact(tt) + '** — 1 hour, 5 minutes and 27 3/11 seconds after noon — and then every 65 5/11 minutes, 11 times in 12 hours.'
      : 'The minute hand turns 6° a minute and the hour hand ½°, so the minute hand gains **5½° a minute**. From ' + (h || 12) + ':00 it has to gain ' + C.fmtCalc(Math.round(gain * 1000) / 1000) + '°, which takes ' + frac11(gain / 5.5) + ' minutes: the moment is **' + L.fmtExact(tt) + '**.',
    concepts: ['rates'], tags: ['set the hands', A === 0 ? 'overlap' : A === 180 ? 'opposite' : 'angle']
  }));
});
list.push(setP('clock-set-mirror-hands', 'Mirror-Image Hands', 4, 'Between one and two o\'clock there is a moment when the two hands are exact mirror images of each other across the line from 12 to 6 — one as far to the right of 12 as the other is to the left. Set the clock to it (within 3 seconds).', { sym: true, after: H },
  { data: { start: T(1, 0) }, hints: ['The hour hand is a little past the 1; the minute hand must be the same distance before the 12.', 'The two angles from 12, measured clockwise, add up to 360°: (60 + ½m) + 6m = 360.'], explain: 'Measured clockwise from 12, the hour hand is at 30 + ½m degrees and the minute hand at 6m (m minutes past one). Mirror images means they add up to 360°: 30 + ½m + 6m = 360, so m = 330 ÷ 6½ = 50 10/13 minutes: **' + L.fmtExact(L.nextSym(H)) + '**.', concepts: ['symmetry', 'rates'], tags: ['symmetry'] }));
list.push(setP('clock-set-lose-10', 'The Lazy Clock', 3, 'A clock loses **10 minutes every hour**, steadily. It was set right at midnight, and now it shows **5:00**. What is the real time? Set the real clock.', { rate: -10, shows: T(5, 0) },
  { data: { start: T(5, 0), seconds: true }, hints: ['In one real hour the clock moves only 50 minutes.', 'It has moved 300 minutes: that took 300 ÷ 50 real hours.'], explain: 'The clock runs at 50/60 of the right speed. It has shown 5 hours pass, so 5 × 60/50 = **6** real hours have gone by: it is 6:00.', tags: ['rates'] }));
list.push(setP('clock-set-gain-5', 'The Hasty Clock', 4, 'A clock gains **5 minutes every hour**, steadily. It was set right at noon, and it now shows **6:00**. What is the real time? Set the real clock (within 3 seconds).', { rate: 5, shows: T(6, 0) },
  { data: { start: T(6, 0), seconds: true }, hints: ['In one real hour the clock moves 65 minutes.', 'It has moved 360 minutes; that took 360 ÷ 65 real hours.'], explain: 'The clock runs at 65/60 of the right speed; it shows 360 minutes gone, so the real time gone is 360 × 60/65 = 332 4/13 minutes: **' + L.fmtExact(6 * H * 60 / 65) + '**. (A common slip is to take off 30 minutes: that would be right only if the clock gained 5 minutes in each of *its* hours.)', tags: ['rates'] }));
{
  const sw = L.swapTimes(2 * H, 3 * H);
  list.push(setP('clock-set-swap', 'Swap the Hands', 5, 'At some moments you could swap the two hands and the clock would still show a possible time (at most times it would not: the hour hand would be in the wrong place for the minutes). Set the clock to such a moment between **2 and 3 o\'clock** — but not one where the hands lie on top of each other. Any of them will do, to within 3 seconds.', { swap: [2 * H, 3 * H] },
    { data: { start: T(2, 30) }, hints: ['Measure angles from 12, in degrees. The minute hand is at 12 times the hour hand\'s angle (less whole turns). After the swap the same must hold the other way round.', 'So the hour hand\'s angle h must satisfy 144 h = h plus whole turns: 143 h is a multiple of 360.', 'h = 360k/143 for a whole number k. Between 2 and 3 the hour hand is between 60° and 90°: try k = 24, which gives 2:00:50.3.'], explain: 'If the hour hand is at h degrees, the minute hand is at 12h (less whole turns). Swapped, the old minute hand becomes the hour hand, so the old hour hand must be at 12 × 12h: 144h ≡ h, i.e. 143h is a whole number of turns. There are 143 such moments in 12 hours, 11 of them overlaps. Between 2 and 3 the good ones are ' + sw.map((t) => L.fmtExact(t)).join(', ') + '.', concepts: ['modular'], tags: ['swap'] }));
}

list.push(setP('clock-set-marks', 'One Mark Ahead', 4, 'Once in every twelve hours, **both** hands point exactly at minute marks and the minute hand is **exactly one mark ahead** of the hour hand. Set the clock to that moment (within 20 seconds).', { marks: 1 },
  { data: { start: T(12, 0), seconds: false, tol: 20 }, hints: ['The hour hand moves one minute mark every 12 minutes, so it is exactly on a mark only at times that are a multiple of 12 minutes.', 'At 12k minutes past twelve the hour hand is on mark k and the minute hand on mark 12k − 60 × (whole hours). You want 12k = k + 1, give or take multiples of 60.', '11k leaves remainder 1 on division by 60. Try k = 11.'], explain: 'The hour hand is on a mark only at multiples of 12 minutes; at 12k minutes it is on mark k, and the minute hand on mark 12k (counting round the dial, less 60s). One mark ahead means 11k ≡ 1 (mod 60), and since 11 × 11 = 121 = 2 × 60 + 1, k = 11: 132 minutes past twelve, **2:12**. The hour hand is then on the 11th mark and the minute hand on the 12th.', concepts: ['modular'], tags: ['marks'] }));

/* ---------- mirrors ---------- */

[
  ['clock-mirror-3', 'The Looking-Glass Clock', 1, T(3, 0), 'v', ['A mirror swaps left and right: the 3 and the 9 change places.']],
  ['clock-mirror-420', 'Twenty Past Four?', 2, T(4, 20), 'v', ['In a mirror, a hand at the 4 seems to be at the 8.', 'Mirror time and real time add up to 12:00.']],
  ['clock-mirror-1010', 'The Smiling Clock', 2, T(10, 10), 'v', ['The hands seem to be at 10 and 2. Swap left and right.']],
  ['clock-mirror-237', 'An Awkward Reflection', 2, T(2, 37), 'v', ['Take the mirror time away from 12:00 (or 11:60).']],
  ['clock-mirror-lake-140', 'Reflected in the Lake', 3, T(1, 40), 'h', ['Still water turns the clock upside down: the 12 and the 6 change places, the 3 and the 9 stay put.', 'Real time and water time add up to 6:00 — or to 18:00, if that is easier.']],
  ['clock-mirror-lake-1105', 'Upside Down at Five Past Eleven', 3, T(11, 5), 'h', ['An upside-down reflection sends a hand at angle θ from 12 to 180° − θ.']]
].forEach(([id, title, diff, show, axis, hints]) => {
  const target = L.mirrorOf(show, axis);
  list.push({
    id, title, diff,
    text: (axis === 'v' ? 'Seen in a mirror, a clock seems to say **' : 'Upside down in the still water of a lake, a clock seems to say **') + hm(show) + '**. What time is it really? Set the real clock to it.',
    goal: 'The real clock shows the true time (within 30 seconds).',
    hints,
    explain: axis === 'v' ? 'A mirror turns every hand at angle θ from 12 into one at 360° − θ, so real time + mirror time = 12:00. Here 12:00 − ' + hm(show) + ' = **' + hm(target) + '**.' : 'An upside-down reflection turns a hand at angle θ from 12 into one at 180° − θ, so real time + reflected time = 6:00 (or 18:00). Here the real time is **' + hm(target) + '**.',
    concepts: ['symmetry', 'modular'], tags: ['mirror'],
    data: { kind: 'mirror', show, axis, start: T(12, 0), face: 'arabic', seconds: false, target: [target], tol: 30, cond: { mirror: show, axis } }
  });
});

/* ---------- angles ---------- */

[
  ['clock-angle-1', 1, 0, 1, 'One O\'Clock', []],
  ['clock-angle-4', 4, 0, 1, 'Four O\'Clock', []],
  ['clock-angle-315', 3, 15, 2, 'A Quarter Past Three', ['By a quarter past, the hour hand has moved a quarter of the way from the 3 to the 4.'], 0, 'Not quite: the hour hand has moved on since three o\'clock.'],
  ['clock-angle-945', 9, 45, 2, 'A Quarter to Ten', ['The minute hand is on the 9, but the hour hand is three quarters of the way to the 10.']],
  ['clock-angle-720', 7, 20, 2, 'Twenty Past Seven', ['The minute hand is on the 4 (120°); the hour hand is a third of the way from the 7 to the 8.']],
  ['clock-angle-1230', 12, 30, 2, 'Half Past Twelve', ['The hour hand has moved half an hour\'s worth: 15° past the 12.'], 180, 'The hands are not quite opposite: the hour hand has moved 15° past the 12.'],
  ['clock-angle-220', 2, 20, 2, 'Twenty Past Two', ['The minute hand is on the 4 (120°).']],
  ['clock-angle-1150', 11, 50, 3, 'Ten to Twelve', ['The minute hand is at 300°; the hour hand at 355°.']],
  ['clock-angle-437', 4, 37, 3, 'Four Thirty-Seven', ['Minute hand: 6° a minute. Hour hand: 30° an hour plus ½° a minute.']],
  ['clock-angle-1010', 10, 10, 3, 'The Watchmaker\'s Time', ['Clock and watch advertisements love 10:10. Minute hand at 60°, hour hand at 305°.']],
  ['clock-angle-827', 8, 27, 3, 'Eight Twenty-Seven', ['The formula: angle = |30h − 5½m|, then take 360° minus it if it is over 180°.']],
  ['clock-angle-555', 5, 55, 3, 'Five to Six', null],
  ['clock-angle-633', 6, 33, 4, 'Nearly Together', ['The minute hand passes the hour hand at about 6:33. Which is ahead?']]
].forEach(([id, h, m, diff, title, hints, trap, trapMsg]) => {
  const t = T(h, m), A = L.angleAt(t);
  list.push(askP(id, title, diff, 'The clock shows **' + hm(t) + '**. What is the angle between the hour hand and the minute hand, in degrees? (The smaller of the two angles.)', { num: A, unit: '°' }, { angle: t }, {
    hints: hints && hints.length ? hints : null,
    explain: 'The minute hand turns 6° a minute: at ' + m + ' minutes it is at ' + (6 * m) + '°. The hour hand turns 30° an hour and ½° a minute: at ' + hm(t) + ' it is at ' + C.fmtCalc(((h % 12) * 30 + m / 2)) + '°. The difference is ' + C.fmtCalc(Math.abs((h % 12) * 30 + m / 2 - 6 * m)) + '°' + (Math.abs((h % 12) * 30 + m / 2 - 6 * m) > 180 ? ', so the smaller angle is 360° minus that: **' + C.fmtCalc(A) + '°**.' : ': **' + C.fmtCalc(A) + '°**.'),
    concepts: ['rates'], tags: ['angle'],
    data: { start: t, showAngle: true, traps: trap != null ? [{ match: trap, msg: trapMsg }] : undefined }
  }));
});

/* ---------- counting ---------- */

list.push(askP('clock-count-overlaps', 'Meetings in a Day', 3, 'In one whole day — from midnight to the next midnight, counting midnight once — how many times do the hour hand and the minute hand lie exactly on top of each other?', { num: 22 }, { count: 'overlap', span: 86400 },
  { hints: ['Not 24: count the meetings between noon and one, and between eleven and noon.', 'In 12 hours the minute hand goes round 12 times and the hour hand once, so the minute hand laps it 11 times.'], explain: 'The minute hand makes 12 turns in 12 hours and the hour hand one, so the minute hand overtakes it 12 − 1 = 11 times every 12 hours: **22** times a day. There is no meeting between 11 and 1 other than at 12 itself.', traps: [{ match: 24, msg: 'Once an hour sounds right — but between 11 and 1 the hands meet only once, at 12.' }], concepts: ['rates', 'modular'], tags: ['count'], data: { start: T(12, 0) } }));
list.push(askP('clock-count-right', 'Right Angles in a Day', 4, 'In one whole day, how many times do the two hands make an exact right angle?', { num: 44 }, { count: 'right', span: 86400 },
  { hints: ['Each time the minute hand laps the hour hand it passes through two right angles: one before and one after.', 'How many laps in a day?'], explain: 'Between one meeting of the hands and the next, the minute hand gains a full turn on the hour hand, passing 90° ahead once and 90° behind once. With 22 laps a day that is **44** right angles.', traps: [{ match: 48, msg: 'Twice an hour sounds right, but the hands only lap 22 times a day, not 24.' }], concepts: ['rates'], tags: ['count'], data: { start: T(3, 0) } }));
list.push(askP('clock-count-opposite', 'Straight Lines in a Day', 3, 'In one whole day, how many times do the two hands point in exactly opposite directions?', { num: 22 }, { count: 'opposite', span: 86400 },
  { hints: ['Once in each lap of the minute hand.'], explain: 'Once in each of the 22 laps a day: **22** times.', traps: [{ match: 24, msg: 'Between 5 and 7 they are opposite only once, at 6.' }], concepts: ['rates'], tags: ['count'], data: { start: T(6, 0) } }));
list.push(askP('clock-count-between', 'From One Meeting to the Next', 3, 'How many minutes pass between one meeting of the hands and the next? (Fractions are welcome: 12 1/2, say.)', { num: 720 / 11, tol: 0.01, show: '65 5/11', unit: 'minutes' }, { between: 'overlap' },
  { hints: ['The minute hand gains 5½° a minute on the hour hand.', 'It has to gain 360°.'], explain: 'Gaining 5½° a minute, the minute hand takes 360 ÷ 5½ = **65 5/11** minutes to gain a full turn — about 65 minutes 27 seconds. Equivalently: 11 meetings share 12 hours equally.', traps: [{ match: 60, msg: 'The hour hand runs away while the minute hand goes round.' }, { match: 65, msg: 'A little more than 65.' }], concepts: ['rates'], tags: ['overlap'], data: { start: T(12, 0) } }));

/* ---------- gaining and losing ---------- */

list.push({
  id: 'clock-carroll', title: 'Which Clock Is Better?', diff: 2,
  source: 'After Lewis Carroll\'s playful piece "The Two Clocks", written for his family\'s home-made magazine.',
  text: 'You may have one of two clocks. The first loses one minute a day. The second has stopped altogether. If what you want is a clock that is **right** as often as possible, which should you take?',
  hints: ['How often is a stopped clock right?', 'The losing clock has to lose a whole 12 hours before it is right again.'],
  explain: 'The stopped clock is exactly right **twice every day**. The clock that loses a minute a day must fall 12 hours behind — 720 minutes, so 720 days — before it shows the right time again: once in nearly two years. By that measure the stopped clock wins easily (though you would never know *when* it was right).',
  concepts: ['rates'], tags: ['carroll'],
  data: { kind: 'ask', start: T(12, 0), face: 'roman4', answer: { choice: 1, choices: ['The one that loses a minute a day', 'The stopped clock', 'Neither: they are right equally often'] } }
});
[
  ['clock-gain-1', 'Right Again', 2, 'A clock gains **1 minute a day**, steadily. It is set right today. After how many days will it next show the right time?', 1, ['It must get a whole 12 hours ahead.'], 720],
  ['clock-lose-4', 'Four Minutes a Day', 2, 'A clock loses **4 minutes a day**. It is set right at noon today. After how many days will it next show the right time?', 4, ['12 hours is 720 minutes.'], 180],
  ['clock-two-drift', 'Two Clocks Drift Apart', 3, 'Two clocks are set right at noon. One gains **3 minutes a day**, the other loses **2 minutes a day**. After how many days will they next show the same time as each other?', 5, ['Each day they get 5 minutes further apart.', 'They agree again when they are 12 hours apart.'], 144],
  ['clock-two-hourly', 'A Minute an Hour', 3, 'Two clocks are set together. One gains **a minute an hour**, the other loses **a minute an hour**. After how many days will they next show the same time?', 48, ['They drift apart by 2 minutes an hour: 48 minutes a day.'], 15]
].forEach(([id, title, diff, text, agree, hints, ans]) => {
  list.push(askP(id, title, diff, text, { num: ans, unit: 'days' }, { agree }, {
    hints,
    explain: 'A 12-hour face shows the same thing again once the difference reaches 12 hours = 720 minutes. At ' + agree + ' minute' + (agree > 1 ? 's' : '') + ' a day that takes 720 ÷ ' + agree + ' = **' + ans + '** days.',
    traps: [{ match: 1440 / agree, msg: 'A 12-hour dial looks right again after 12 hours of error, not 24.' }],
    concepts: ['rates', 'modular'], tags: ['gain and lose'],
    data: { start: T(12, 0) }
  }));
});

/* ---------- striking ---------- */

[
  ['clock-strike-3-6', 'Three in Two Seconds', 1, 3, 2, 6, ['Between three strokes there are two gaps.']],
  ['clock-strike-6-12', 'Striking Twelve', 2, 6, 5, 12, ['Six strokes have five gaps between them.', 'Each gap is a second.']],
  ['clock-strike-4-7', 'Seven Strokes', 2, 4, 6, 7, ['Four strokes, three gaps, two seconds a gap.']]
].forEach(([id, title, diff, n, s, m, hints]) => {
  const v = (m - 1) * s / (n - 1);
  list.push(askP(id, title, diff, 'A clock takes **' + s + ' seconds** to strike ' + n + ' (from the first stroke to the last, the strokes evenly spaced). How many seconds does it take to strike ' + m + '?', { num: v, unit: 's' }, { strike: [n, s, m] }, {
    hints,
    explain: n + ' strokes have ' + (n - 1) + ' gaps, so each gap is ' + C.fmtCalc(s / (n - 1)) + ' s. ' + m + ' strokes have ' + (m - 1) + ' gaps: **' + C.fmtCalc(v) + '** seconds.',
    traps: [{ match: s * m / n, msg: 'The time is in the gaps between the strokes, not in the strokes.' }],
    concepts: ['rates'], tags: ['striking'],
    data: { start: T(n, 0), face: 'roman4' }
  }));
});
list.push(askP('clock-strokes-day', 'Strokes in a Day', 2, 'A clock strikes the hours: once at one o\'clock, twice at two, and twelve times at twelve. How many strokes does it make in a whole day?', { num: 156 }, { strokes: 'hours' },
  { hints: ['1 + 2 + … + 12 in twelve hours.', 'And a day has two rounds of twelve hours.'], explain: '1 + 2 + … + 12 = 78 in twelve hours, and twice that in a day: **156**.', traps: [{ match: 78, msg: 'That is only half a day.' }], concepts: ['rates'], tags: ['striking'], data: { start: T(12, 0), face: 'roman4' } }));
list.push(askP('clock-strokes-halves', 'And One at the Half Hour', 3, 'A clock strikes the hours (once at one o\'clock … twelve times at twelve) and also strikes **once at every half hour**. How many strokes in a whole day?', { num: 180 }, { strokes: 'halves' },
  { hints: ['156 for the hours, as in [[clock-strokes-day]].', 'How many half hours are there in a day?'], explain: '156 for the hours plus one for each of the 24 half hours: **180**.', traps: [{ match: 168, msg: 'Count the half hours again: 24 in a day, not 12.' }], links: ['clock-strokes-day'], concepts: ['rates'], tags: ['striking'], data: { start: T(12, 30), face: 'roman4' } }));

/* ---------- Roman faces ---------- */

list.push(askP('clock-roman-v', 'Count the V\'s', 1, 'On this Roman clock face (which writes four as IIII, as many clock faces do), how many times does the letter **V** appear?', { num: 4 }, { roman: 'V', style: 'IIII' },
  { hints: ['V, VI, VII, VIII…'], explain: 'V, VI, VII and VIII: **4**. (On a face that writes four as IV there would be 5.)', concepts: [], tags: ['roman'], data: { face: 'roman4', start: T(10, 7, 30) } }));
list.push(askP('clock-roman-i4', 'Count the I\'s', 2, 'This Roman clock face writes four as **IIII**. How many times does the letter **I** appear on it altogether?', { num: 20 }, { roman: 'I', style: 'IIII' },
  { hints: ['Go round the face: I, II, III, IIII, then VI, VII, VIII, IX, XI, XII.', 'Use the highlighter on each I as you count.'], explain: 'I (1) + II (2) + III (3) + IIII (4) + VI (1) + VII (2) + VIII (3) + IX (1) + XI (1) + XII (2) = **20**.', traps: [{ match: 17, msg: 'That would be right for a face with IV — look at the four.' }], concepts: [], tags: ['roman'], data: { face: 'roman4', start: T(10, 7, 30) } }));
list.push(askP('clock-roman-iv', 'IV Instead', 2, 'This clock face writes four as **IV**. How many I\'s are on it?', { num: 17 }, { roman: 'I', style: 'IV' },
  { hints: ['Compared with a IIII face, three I\'s are gone and a V has come.'], explain: 'IIII has four I\'s and IV only one: 20 − 3 = **17**.', links: ['clock-roman-i4'], concepts: [], tags: ['roman'], data: { face: 'roman', start: T(1, 52, 30) } }));
list.push(askP('clock-roman-all', 'Every Letter', 2, 'On this IIII face, how many letters are there altogether — every I, V and X?', { num: 28 }, { roman: 'all', style: 'IIII' },
  { hints: ['20 I\'s, as in [[clock-roman-i4]]. Now the V\'s and X\'s.'], explain: '20 I\'s, 4 V\'s (V, VI, VII, VIII) and 4 X\'s (IX, X, XI, XII): **28**.', concepts: [], tags: ['roman'], data: { face: 'roman4', start: T(8, 22, 30) } }));

/* ---------- cutting the face ---------- */

[
  ['clock-cut-two', 'One Line, Two Halves', 1, { parts: 2, sum: 39, maxLines: 1 }, 'Draw **one straight line** across the clock face so that the numbers on the two sides add up to the same total.', [[3, 9]], ['The numbers 1 to 12 add up to 78.', 'Each side must make 39. Try cutting off the numbers from 10 round to 3.']],
  ['clock-cut-double', 'Twice as Much', 2, { sums: [26, 52], maxLines: 1 }, 'Draw **one straight line** across the face so that the numbers on one side add up to exactly **twice** those on the other.', [[2, 10]], ['The two parts must make 26 and 52.', 'Four numbers in a row can make 26.']],
  ['clock-cut-three', 'Three Equal Parts', 2, { parts: 3, sum: 26, maxLines: 2 }, 'Draw **two straight lines** across the face to cut it into three parts whose numbers have equal totals.', [[2, 10], [4, 8]], ['Each part must make 26.', '11 + 12 + 1 + 2 = 26.']],
  ['clock-cut-consecutive', 'Twenty-Five, Six, Seven', 3, { sums: [25, 26, 27], maxLines: 2 }, 'With **two straight lines**, cut the face into three parts that add up to **25, 26 and 27**.', [[2, 7], [2, 10]], ['The lines may start from the same gap.', 'One part can be the 11, 12, 1 and 2 again.']],
  ['clock-cut-thirds', 'Thirteen, Twenty-Six, Thirty-Nine', 3, { sums: [13, 26, 39], maxLines: 2 }, 'With **two straight lines**, cut the face into three parts adding up to **13, 26 and 39**.', [[1, 11], [3, 9]], ['12 + 1 = 13.']],
  ['clock-cut-six', 'Six Pairs', 3, { parts: 6, sum: 13, maxLines: 5 }, 'With **five straight lines**, cut the face into **six** parts that all have the same total.', [[1, 11], [2, 10], [3, 9], [4, 8], [5, 7]], ['The total 78 shared six ways is 13 a part.', '12 + 1, 11 + 2, 10 + 3…', 'All five lines are parallel.']],
  ['clock-cut-lopsided', 'Twenty-Four, Six, Eight', 4, { sums: [24, 26, 28], maxLines: 2 }, 'With **two straight lines**, cut the face into three parts adding up to **24, 26 and 28**.', null, ['The part with 26 can be 5, 6, 7, 8.']],
  ['clock-cut-four', 'Four in a Row', 5, { sums: [18, 19, 20, 21], maxLines: 3 }, 'With **three straight lines**, cut the face into four parts whose totals are four numbers in a row: **18, 19, 20 and 21**.', null, ['The lines may cross, or meet at the rim.', 'Two of the lines can start from the same gap between the numbers.']],
  ['clock-cut-nearly', 'As Fair as It Gets', 5, { sums: [19, 19, 20, 20], maxLines: 3 }, '78 cannot be shared equally four ways. With **three straight lines**, cut the face into four parts adding up to **19, 19, 20 and 20** — as fair as it gets.', null, ['There is only one way (the computer checked every set of three lines).', 'One of the parts is %PART%.']],
  ['clock-cut-roman', 'Fair Shares of I', 3, { parts: 2, sum: 10, maxLines: 1, value: 'I', face: 'roman4' }, 'This time count **letters I**, not values. Draw one straight line across this Roman face (four is IIII) so that the two sides have the same number of I\'s.', [[0, 4]], ['There are 20 I\'s altogether.', 'The numbers I to IIII alone have ten.']]
].forEach(([id, title, diff, spec, text, sol, hints]) => {
  const d = Object.assign({ kind: 'cut', face: 'arabic' }, spec);
  if (!sol) {
    const ch = []; for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) ch.push([a, b]);
    const rec = (from, acc) => {
      if (acc.length && L.cutOk(acc, d).ok) return acc.slice();
      if (acc.length >= d.maxLines) return null;
      for (let i = from; i < ch.length; i++) { acc.push(ch[i]); const r = rec(i + 1, acc); acc.pop(); if (r) return r; }
      return null;
    };
    sol = rec(0, []);
  }
  d.sol = sol;
  const gs = L.groups(sol, d);
  const part = gs.slice().sort((a, b) => b.nums.length - a.nums.length)[0];
  hints = hints && hints.map((h) => h.replace('%PART%', part.nums.join(' + ') + ' = ' + part.sum));
  list.push({
    id, title, diff, text, hints,
    explain: 'One way: ' + gs.map((g) => g.nums.join(' + ') + ' = ' + g.sum).join('; ') + '.' + (d.parts === 6 ? ' The six pairs 12 + 1, 11 + 2, 10 + 3, 9 + 4, 8 + 5 and 7 + 6 each make 13 — the same trick young Gauss is said to have used to add up 1 to 100.' : ''),
    concepts: d.value === 'I' ? [] : ['magic-constant'], tags: ['cut'],
    data: d
  });
});

// sort easiest first (stable)
const out = list.map((p, i) => ({ p, i })).sort((a, b) => a.p.diff - b.p.diff || a.i - b.i).map((x) => x.p);
const lines = ['/* The Puzzle Cabinet · data/clock-puzzles.js — made by tools/gen/clocks.js */', 'Cabinet.family(' + JSON.stringify({
  id: 'clock-puzzles', engine: 'clocks', cat: 'cards', name: 'Clock puzzles', order: 3,
  blurb: 'Hands that meet, part and point opposite; clocks in mirrors, clocks that run fast, faces cut into equal parts.',
  origin: { who: 'Puzzle columns of every age', note: 'The hands-of-the-clock problem — when do the hands next meet? — is a staple of puzzle books from the 18th century on, and mirror clocks, striking clocks and gaining clocks have been set as riddles for as long.' },
  concepts: ['rates', 'modular']
}, null, 2).replace(/"(\w+)":/g, '$1:') + ', ['];
out.forEach((p, i) => {
  Object.keys(p).forEach((k) => { if (p[k] == null) delete p[k]; });
  Object.keys(p.data).forEach((k) => { if (p.data[k] === undefined) delete p.data[k]; });
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  lines.push('  { ' + Object.keys(p).map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < out.length - 1 ? ',' : ''));
});
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/clock-puzzles.js'), lines.join('\n') + '\n');
const by = [0, 0, 0, 0, 0, 0];
out.forEach((p) => by[p.diff]++);
console.log('clock-puzzles.js: ' + out.length + ' puzzles; by difficulty ' + by.slice(1).join(' / '));
