/* The Puzzle Cabinet · tools/gen/josephus.js
 *
 *   node tools/gen/josephus.js        writes data/josephus.js
 *
 * Counting-out puzzles: every second, every third, other counts, counts
 * that start elsewhere, the last two, choosing the count, and the two old
 * stories (Josephus's circle and Bachet's ship). Every answer is found, and
 * checked, by playing the count.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/josephus.js'));
const J = C.josephus;
const eng = C.engines.josephus;

const out = [];
let serial = 0;
const add = (p) => {
  p.id = p.id || 'jos-' + String(++serial).padStart(3, '0');
  p.data = Object.assign({ start: 1, ask: 'last', theme: 'kids' }, p.data);
  p.text = p.text || J.textOf(p.data);
  p.diff = p.diff || J.diffOf(p.data);
  p.concepts = p.concepts || (p.data.k === 2 ? ['binary', 'modular'] : ['modular', 'recursion']);
  out.push(p);
  return p;
};

/* ---------- warm-ups and rhymes ---------- */

add({
  id: 'jos-five', title: 'Five in a Ring', diff: 1,
  text: 'Five children stand in a circle. Starting with seat 1 and going clockwise, they count "one, two", and the child on "two" sits down; the counting carries on from the next child still standing. The last one standing wins. Where should you stand?',
  data: { n: 5, k: 2 },
  hints: ['Just play it out: seat 2 sits down first, then seat 4. Who is next?'],
  explain: 'The order out is 2, 4, 1, 5 — seat 3 is left. With every second child out, the first round removes all the even seats.'
});
add({
  id: 'jos-eeny', title: 'Eeny, Meeny, Miny, Moe', diff: 1,
  text: 'Six children pick who stays with the old counting rhyme: four words, one child per word, and whoever gets "moe" sits down. The rhyme starts again from the next child. Where do you stand to be the last one left?',
  data: { n: 6, k: 4 },
  hints: ['Seat 4 is the first "moe". The next rhyme starts at seat 5.'],
  concepts: ['modular']
});
add({
  id: 'jos-potato', title: 'One Potato, Two Potato', diff: 2,
  text: 'Seven children, and a longer rhyme: "one potato, two potato, three potato, four; five potato, six potato, seven potato, MORE!" — eight beats, one child per beat, and the child on "more" is out. With only seven in the ring the rhyme goes all the way round and past the start. Who is left?',
  data: { n: 7, k: 8 },
  hints: ['Eight beats in a ring of seven: the first "more" lands on seat 1 again.'],
  concepts: ['modular']
});

/* ---------- every second one ---------- */

const two = [[6, 'Six Round the Maypole'], [7, 'Seven Dwarfs'], [8, 'Eight at the Party'], [10, 'Ten in the Playground'], [12, 'A Dozen'], [16, 'Sixteen Friends'], [20, 'Twenty Players'], [25, 'A Class of Twenty-Five'], [32, 'Thirty-Two'], [41, 'Forty-One, Every Second'], [50, 'Fifty'], [64, 'Sixty-Four Squares'], [100, 'A Hundred Players']];
two.forEach(([n, title]) => {
  const p = add({ title, data: { n, k: 2, theme: n >= 41 ? 'story' : n === 32 || n === 50 ? 'sailors' : 'kids' } });
  if (n === 16) p.hints = ['Sixteen is a power of two. What happens after each full lap of the circle?'];
  if (n === 41) {
    p.hints = ['41 = 32 + 9. After 9 people have gone, 32 remain — a power of two — and the count starts at the next person.', 'The 9th person out is in seat 18.'];
    p.explain = 'Seat 19. Write the number of people as a power of two plus the rest, n = 2ᵐ + l: the last one is seat 2l + 1. In [[c:binary|binary]] that is a neat trick: move the leading 1 to the end. 41 = 101001₂ → 010011₂ = 19.';
    p.concepts = ['binary', 'modular'];
  }
  if (n === 100) p.explain = 'Seat 73: 100 = 64 + 36, and 2 × 36 + 1 = 73. In binary, 1100100₂ becomes 1001001₂ = 73 — the leading 1 moved to the end.';
});

/* ---------- every third, and other counts ---------- */

const three = [[5, 'Every Third of Five'], [6, 'Six and Three'], [8, 'Eight and Three'], [10, 'Every Third of Ten'], [12, 'Twelve at the Round Table'], [15, 'Fifteen on the Green'], [20, 'Twenty and Three'], [30, 'Thirty in the Courtyard']];
three.forEach(([n, title]) => add({ title, data: { n, k: 3, theme: n >= 20 ? 'story' : 'kids' } }));
add({ title: 'Nine and Four', data: { n: 9, k: 4 } });
add({ title: 'Every Fifth of Twelve', data: { n: 12, k: 5, theme: 'sailors' } });
add({ title: 'Seven Seas', data: { n: 20, k: 7, theme: 'sailors' } });

/* ---------- the count starts elsewhere ---------- */

add({ title: 'Starting from Seat Four', data: { n: 10, k: 2, start: 4 }, hints: ['Pretend seat 4 is seat 1: solve the puzzle as if the count started there, then turn the answer round.'] });
add({ title: 'Seven Starts', data: { n: 12, k: 3, start: 7 } });
add({ title: 'Eleven Begins', data: { n: 15, k: 4, start: 11, theme: 'sailors' } });

/* ---------- choose the count ---------- */

// seats for which exactly one count works
function countPuzzle(n, kmin, kmax, pref) {
  for (const seat of pref) {
    const a = J.answerOf({ n, ask: 'count', seat, kmin, kmax, start: 1 });
    if (a.length === 1) return { n, ask: 'count', seat, kmin, kmax, k: 3 };
  }
  throw new Error('no unique count for ' + n);
}
add({ title: 'Pick the Rhyme', data: countPuzzle(7, 2, 7, [3, 1, 2, 4, 5, 6, 7]) });
add({ title: 'Choose Your Count', data: countPuzzle(9, 2, 8, [1, 9, 5, 2, 3, 4, 6, 7, 8]) });
add({ title: 'Twelve and a Wish', data: countPuzzle(12, 2, 9, [12, 1, 6, 2, 3, 4, 5, 7, 8, 9, 10, 11]) });

/* ---------- the last two ---------- */

add({ title: 'Two Friends', data: { n: 6, k: 2, ask: 'last2' }, hints: ['Play the count until two are left; those are your seats.'] });
add({ title: 'Best Friends', data: { n: 10, k: 3, ask: 'last2' } });
add({ title: 'Twenty, Two Left', data: { n: 20, k: 2, ask: 'last2' } });
add({ title: 'The Last Two of Thirty-Six', data: { n: 36, k: 5, ask: 'last2', theme: 'sailors' } });
add({ title: 'Fifty, Every Third', data: { n: 50, k: 3, theme: 'story' } });

/* ---------- the stories ---------- */

add({
  id: 'jos-josephus', title: 'Josephus and the Forty', diff: 5,
  source: 'Flavius Josephus tells of the cave in *The Jewish War*, book III; the circle is a later retelling. The puzzle is named after him.',
  text: 'In AD 67, during the Jewish revolt against Rome, the historian Flavius Josephus and forty companions were trapped in a cave at Yodfat. The companions refused to surrender and agreed to draw lots for the order in which they would give up their lives. By his own account Josephus was one of the last two left — and the two of them surrendered to the Romans instead.\n\nLater storytellers turned the lots into a circle: forty-one people, every third one counted out. Where should Josephus and his friend stand to be the last two?',
  data: { n: 41, k: 3, ask: 'last2', theme: 'story' },
  hints: ['Build up from small circles. With m people let L be the last seat; with m + 1 it is L + 3, wrapped round. Do the same for the second-to-last.', 'The very last seat is 31.'],
  explain: 'Seats 16 and 31. Josephus\'s rule: if seat L is last among m people, then seat L + k (counted round, [[c:modular|modulo]] m + 1) is last among m + 1 — because once the first person is gone, the circle of m + 1 has become a circle of m that starts k seats further on. The same holds for the second-to-last.',
  concepts: ['modular', 'recursion'], links: ['jos-forty-one']
});
add({
  id: 'jos-forty-one', title: 'The Last of Forty-One', diff: 5,
  text: 'Forty-one people in a circle, every third one counted out. Only one place is safe to the very end. Which?',
  data: { n: 41, k: 3, theme: 'story' },
  concepts: ['modular', 'recursion'], links: ['jos-josephus']
});
add({
  id: 'jos-little-ship', title: 'The Little Ferry', diff: 3,
  text: 'A small ferry is too heavy for the rising wind: five of its ten sailors must row the dinghy ashore. The five of the Blue watch want to stay aboard, and the Reds are happy to row. The captain lines everyone up in a circle and sends every third one to the dinghy. Give five sailors blue caps so that only Reds are counted out.',
  data: { n: 10, k: 3, ask: 'group', stay: 5, theme: 'sailors' },
  hints: ['Play the count with the pen, crossing seats out: the first five crossed out must be the Reds.'],
  concepts: ['modular'], links: ['jos-bachet']
});
add({
  id: 'jos-bachet', title: 'Bachet\'s Ship', diff: 5, year: 1612,
  source: 'Claude-Gaspard Bachet, *Problèmes plaisants et délectables* (1612).',
  text: 'An old puzzle: a ship caught in a storm must be lightened, and half of its thirty passengers must leave it. The old tellings set two groups of passengers against each other; ours is kinder. Fifteen sailors of the Blue watch will stay to sail the ship, and fifteen of the Red watch will row the ship\'s boat to the nearby shore. The captain stands all thirty in a circle and sends every **ninth** one to the boat. Where must the Blues stand so that the first fifteen sent are all Reds?',
  data: { n: 30, k: 9, ask: 'group', stay: 15, theme: 'sailors' },
  hints: ['Counting in nines is hard in your head: play it with the pen, crossing out seats 9, 18, 27, …', 'The first five counted out are seats 9, 18, 27, 6 and 16.', 'An old memory aid gives the order round the circle as groups: 4 Blue, 5 Red, 2 Blue, 1 Red, 3 Blue, 1 Red, 1 Blue, 2 Red, 2 Blue, 3 Red, 1 Blue, 2 Red, 2 Blue, 1 Red.'],
  explain: 'Blue caps on seats 1, 2, 3, 4, 10, 11, 13, 14, 15, 17, 20, 21, 25, 28 and 29. Old books remembered the pattern with a verse whose vowels stood for the numbers (a = 1, e = 2, i = 3, o = 4, u = 5): the lengths of the runs 4, 5, 2, 1, 3, 1, 1, 2, 2, 3, 1, 2, 2, 1.',
  concepts: ['modular'], links: ['jos-little-ship', 'jos-josephus']
});

/* ---------- check, order, write ---------- */

const titles = new Set();
out.forEach((p) => {
  const r = eng.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  if (titles.has(p.title)) throw new Error('duplicate title ' + p.title);
  titles.add(p.title);
});
const bachet = J.answerOf({ n: 30, k: 9, ask: 'group', stay: 15 }).join(',');
if (bachet !== '1,2,3,4,10,11,13,14,15,17,20,21,25,28,29') throw new Error('Bachet answer changed: ' + bachet);
const jo = J.answerOf({ n: 41, k: 3, ask: 'last2' }).join(',');
if (jo !== '16,31') throw new Error('Josephus answer changed: ' + jo);

const order = out.map((p, i) => ({ p, i })).sort((a, b) => a.p.diff - b.p.diff || a.p.data.n - b.p.data.n || a.i - b.i);
const lines = [];
lines.push('/* The Puzzle Cabinet · data/josephus.js — made by tools/gen/josephus.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'josephus', engine: 'josephus', cat: 'mechanical', name: 'Counting out', order: 3,");
lines.push("  blurb: 'A circle, a count, and every k-th one steps out. Where must you stand to be the last one left?',");
lines.push("  origin: { year: 1612, who: 'Claude-Gaspard Bachet', note: 'Counting-out games are as old as children. The puzzle is named after Flavius Josephus, who tells of lots drawn in a cave in AD 67; Bachet printed the ship version in 1612. With every second one out, the answer is a trick with binary numbers.' },");
lines.push("  concepts: ['modular', 'recursion', 'binary']");
lines.push('}, [');
order.forEach(({ p }) => {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'data', 'hints', 'explain', 'links', 'concepts'].filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
});
lines.push(']);');
lines.push('Cabinet.history([');
lines.push("  { year: 67, title: 'Josephus in the cave', text: 'During the Jewish revolt against Rome, the historian Flavius Josephus and his companions are trapped in a cave at Yodfat and draw lots; he is one of the last two left. Later retellings turn the lots into a counting circle — the Josephus problem.', links: ['josephus', 'jos-josephus'] },");
lines.push("  { year: 1612, title: 'Bachet\\'s ship', text: 'Bachet\\'s Problèmes plaisants et délectables includes the ship that must lose half its passengers, counted out in a circle by nines.', links: ['jos-bachet'] }");
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/josephus.js'), lines.join('\n') + '\n');
const byDiff = [0, 0, 0, 0, 0, 0];
out.forEach((p) => byDiff[p.diff]++);
console.log('josephus: ' + out.length + ' puzzles; by difficulty 1-5: ' + byDiff.slice(1).join(' / '));
