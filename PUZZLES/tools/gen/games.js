/* The Puzzle Cabinet · tools/gen/games.js
 *
 *   node tools/gen/games.js      writes data/nim.js, data/take-away.js, data/wythoff.js,
 *                                data/kayles.js, data/northcott.js, data/grundy-game.js
 *
 * Classic positions first, then winning starts made by the engine's own
 * generator (the one behind the Endless drawers) with fixed seeds. Every start
 * is checked to be a win for the player who moves first.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/nim.js'));
const N = C.nimGames;
const E = C.engines.nim;

function fail(msg) { throw new Error(msg); }
const ROMAN = ['', '', ' II', ' III', ' IV', ' V', ' VI', ' VII', ' VIII'];

function build(fam, classics, perLevel, seed) {
  const list = classics.map((c) => Object.assign({}, c));
  list.forEach((p) => { const r = E.verify(p); if (!r.ok) fail(p.id + ': ' + r.err); });
  const seen = new Set(list.map((p) => JSON.stringify(p.data)));
  const titles = new Map(list.map((p) => [p.title, 1]));
  const rng = C.rng(seed);
  const gen = [];
  for (let level = 1; level <= 5; level++) {
    let got = 0, guard = 0;
    while (got < perLevel[level] && guard++ < 5000) {
      const p = E.generate(rng, level, { id: fam.id });
      if (!p) continue;
      const key = JSON.stringify(p.data);
      if (seen.has(key)) continue;
      seen.add(key);
      const n = (titles.get(p.title) || 0) + 1;
      titles.set(p.title, n);
      if (n > 1) p.title += ROMAN[n] || ' (' + n + ')';
      if (E.verify(p).ok !== true) fail('generated puzzle fails: ' + JSON.stringify(p.data));
      p.concepts = fam.genConcepts;
      gen.push(p);
      got++;
    }
    if (got < perLevel[level]) fail(fam.id + ' level ' + level + ': only ' + got);
  }
  gen.forEach((p, i) => { p.id = fam.prefix + '-' + String(i + 1).padStart(3, '0'); p._gen = 1; });
  const all = list.concat(gen);
  all.forEach((p, i) => { p._i = i; });
  all.sort((a, b) => a.diff - b.diff || (a._gen || 0) - (b._gen || 0) || a._i - b._i);
  const ids = new Set(), tt = new Set();
  all.forEach((p) => {
    if (ids.has(p.id)) fail('duplicate id ' + p.id);
    if (tt.has(p.title)) fail('duplicate title ' + p.title);
    ids.add(p.id); tt.add(p.title);
  });
  return all;
}

function write(fam, list) {
  const lines = ['/* The Puzzle Cabinet · data/' + fam.id + '.js — made by tools/gen/games.js */', 'Cabinet.family({'];
  lines.push('  id: ' + JSON.stringify(fam.id) + ", engine: 'nim', cat: 'games', name: " + JSON.stringify(fam.name) + ', order: ' + fam.order + ',');
  lines.push('  blurb: ' + JSON.stringify(fam.blurb) + ',');
  lines.push('  origin: ' + JSON.stringify(fam.origin) + ',');
  lines.push('  concepts: ' + JSON.stringify(fam.concepts));
  lines.push('}, [');
  const order = ['id', 'title', 'diff', 'year', 'source', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags', 'data'];
  list.forEach((p) => {
    const keys = order.filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
  });
  lines.push(']);');
  fs.writeFileSync(path.join(ROOT, 'data/' + fam.id + '.js'), lines.join('\n') + '\n');
  const spread = [1, 2, 3, 4, 5].map((k) => list.filter((p) => p.diff === k).length).join('/');
  console.log(fam.id + ': ' + list.length + ' puzzles (' + list.filter((p) => !p._gen).length + ' classics), difficulty ' + spread);
}

/* ---------------- Nim ---------------- */

const MARIENBAD_TEXT = 'In Alain Resnais’s film *Last Year at Marienbad* (1961) a man keeps winning a game laid out in rows of 1, 3, 5 and 7 — and whoever takes the last one **loses**. From that start the player who moves first loses against perfect play, so he always lets his opponent begin. Here the computer has begun: ';
const nimFam = {
  id: 'nim', prefix: 'nim', name: 'Nim', order: 1,
  blurb: 'Rows of matches; take as many as you like from one row. Whoever takes the last match wins — or, in the misère game, loses. You move first: win.',
  origin: { year: 1901, who: 'Charles L. Bouton', note: 'Games of taking matches are old; Charles Bouton of Harvard named Nim and gave its complete theory in 1901: write the rows in binary and add without carrying. The winning moves are the ones that make that “nim-sum” zero.' },
  concepts: ['nim-sum', 'binary', 'symmetry'],
  genConcepts: ['nim-sum', 'binary']
};
const nimClassics = [
  { id: 'nim-copycat', title: 'Copycat', diff: 1,
    text: 'Two rows of matches, 3 and 5. Take as many matches as you like from one row; whoever takes the last match wins. You move first — and the computer never makes a mistake.',
    hints: ['What if the two rows were equal, and it was the computer’s turn?'],
    explain: 'Take 2 from the row of 5, leaving 3 and 3. Now copy: whatever the computer takes from one row, take the same from the other. The rows stay equal, so you can always answer — and you take the last match. That is **symmetry**, the simplest winning strategy there is.',
    concepts: ['symmetry'], tags: ['nim', 'two rows'],
    data: { game: 'nim', heaps: [3, 5] } },
  { id: 'nim-three-four-five', title: 'Three, Four, Five', diff: 2,
    text: 'The classic start: rows of 3, 4 and 5 matches. Take any number from one row; whoever takes the last match wins. You move first.',
    hints: ['Write 3, 4 and 5 in binary: 011, 100, 101.', 'Add the columns without carrying. Can you make every column add up to an even number?'],
    explain: 'In binary the rows are 011, 100 and 101; adding each column without carrying (odd → 1) gives 010 = 2. A position whose “nim-sum” is not zero is a win for the player to move: take 2 from the row of 3, leaving 1, 4, 5 — nim-sum 001 ⊕ 100 ⊕ 101 = 000. Every move the computer makes spoils the zero, and you can always restore it. Charles Bouton proved this in 1901.',
    concepts: ['nim-sum', 'binary'], tags: ['nim', 'classic'],
    data: { game: 'nim', heaps: [3, 4, 5] } },
  { id: 'nim-marienbad-1', title: 'Marienbad: the Long Row', diff: 3, year: 1961,
    source: 'The game in Alain Resnais’s film *L’Année dernière à Marienbad* (1961).',
    text: MARIENBAD_TEXT + 'it took two from the row of 7. Your move.',
    hints: ['Until the very end, play exactly as in ordinary Nim: leave a nim-sum of 0.', 'At the end, leave an ODD number of single matches, so the computer must take the last one.'],
    concepts: ['nim-sum', 'binary'], tags: ['nim', 'misère', 'marienbad', 'classic'],
    data: { game: 'nim', heaps: [1, 3, 5, 5], was: [1, 3, 5, 7], misere: true } },
  { id: 'nim-marienbad-2', title: 'Marienbad: the Short Row', diff: 3, year: 1961,
    source: 'The game in Alain Resnais’s film *L’Année dernière à Marienbad* (1961).',
    text: MARIENBAD_TEXT + 'it took one from the row of 3. Your move.',
    hints: ['Play as in ordinary Nim — make the nim-sum 0 — until only single matches would be left.'],
    concepts: ['nim-sum', 'binary'], tags: ['nim', 'misère', 'marienbad'],
    data: { game: 'nim', heaps: [1, 2, 5, 7], was: [1, 3, 5, 7], misere: true } },
  { id: 'nim-marienbad-3', title: 'Marienbad: the Middle Row', diff: 4, year: 1961,
    source: 'The game in Alain Resnais’s film *L’Année dernière à Marienbad* (1961).',
    text: MARIENBAD_TEXT + 'it took four from the row of 5. Your move.',
    concepts: ['nim-sum', 'binary'], tags: ['nim', 'misère', 'marienbad'],
    data: { game: 'nim', heaps: [1, 3, 1, 7], was: [1, 3, 5, 7], misere: true } },
  { id: 'nim-marienbad-4', title: 'Marienbad: Half the Seven', diff: 4, year: 1961,
    source: 'The game in Alain Resnais’s film *L’Année dernière à Marienbad* (1961).',
    text: MARIENBAD_TEXT + 'it took four from the row of 7. Your move.',
    concepts: ['nim-sum', 'binary'], tags: ['nim', 'misère', 'marienbad'],
    data: { game: 'nim', heaps: [1, 3, 5, 3], was: [1, 3, 5, 7], misere: true } },
  { id: 'nim-no-more-than-three', title: 'No More Than Three', diff: 4,
    text: 'Rows of 5, 6 and 9 matches — but nobody may take more than three at a time. Whoever takes the last match wins. You move first.',
    hints: ['With at most 3 per turn, a row of 4 is a trap for whoever touches it first.', 'A row counts only by its remainder after dividing by 4.'],
    explain: 'With at most three at a time, a row of n behaves exactly like a Nim row of n mod 4 (its remainder after dividing by 4): a row of 4 is dead, since whatever is taken the other player clears it. So 5, 6 and 9 act like Nim rows of 1, 2 and 1, whose nim-sum is 2. Take 2 from the row of 6, leaving 4 (worth 0): 1 ⊕ 0 ⊕ 1 = 0.',
    concepts: ['nim-sum', 'binary'], tags: ['nim', 'bounded'],
    data: { game: 'nim', heaps: [5, 6, 9], max: 3 } }
];

/* ---------------- take-away ---------------- */

const takeFam = {
  id: 'take-away', prefix: 'take', name: 'Take-away games', order: 2,
  blurb: 'One heap or several; take 1, 2 or 3 — or only the amounts on the list. Work backwards from the end to find the numbers you want to leave.',
  origin: { year: 1612, who: 'Claude-Gaspard Bachet', note: 'Bachet’s *Problèmes plaisans et délectables* (1612) has the race to 100: add 1 to 10 in turn, and whoever says 100 wins. Every such game falls to working backwards; with several heaps, each heap gets a Grundy number and the heaps are added like Nim (Sprague 1935, Grundy 1939).' },
  concepts: ['working-backwards', 'nim-sum'],
  genConcepts: ['working-backwards']
};
const takeClassics = [
  { id: 'take-twenty-one', title: 'Twenty-One', diff: 1,
    text: 'A heap of 21 counters. In turn, each player takes 1, 2 or 3. Whoever takes the last counter wins. You go first.',
    hints: ['If you leave 4, can the computer win?', 'Leave a multiple of 4 every time.'],
    explain: 'Work backwards: leave 4 and whatever the computer takes (1, 2 or 3) you take the rest (3, 2 or 1). So 4, 8, 12, 16, 20 are the numbers to leave. From 21, take 1.',
    concepts: ['working-backwards', 'modular'], tags: ['take-away', 'classic'],
    data: { game: 'take', heaps: [21], sub: [1, 2, 3] } },
  { id: 'take-last-loses', title: 'Don’t Take the Last', diff: 2,
    text: 'A heap of 22 counters. In turn, take 1, 2 or 3 — but this time whoever takes the **last** counter **loses**. You go first.',
    hints: ['Which number of counters do you want the computer to face at the very end?', 'Leave it 1, then 5, 9, 13 …'],
    explain: 'Now you want to leave exactly **one** counter at the end, so the numbers to leave are 1, 5, 9, 13, 17, 21 — one more than a multiple of 4. From 22, take 1.',
    concepts: ['working-backwards', 'modular'], tags: ['take-away', 'misère'],
    data: { game: 'take', heaps: [22], sub: [1, 2, 3], misere: true } },
  { id: 'take-bachet-hundred', title: 'Bachet’s Race to a Hundred', diff: 2, year: 1612,
    source: 'Claude-Gaspard Bachet, *Problèmes plaisans et délectables* (1612).',
    text: 'Two players take turns adding a number from 1 to 10 to a running total that starts at 0; whoever brings the total to exactly 100 wins. Here the 100 is a heap of counters, and adding means taking 1 to 10 counters away. You go first.',
    hints: ['Which total do you want to reach just before 100, so that the computer cannot get there and you can?', 'Say 89 — and before that, 78, 67 …'],
    explain: 'Reach 89 and the computer cannot reach 100 but you can. Working backwards by elevens, the totals to reach are 1, 12, 23, 34, 45, 56, 67, 78, 89, 100. So start by taking 1 (leaving 99), and then always make the two moves add up to 11.',
    concepts: ['working-backwards', 'modular'], tags: ['take-away', 'bachet', 'classic'],
    data: { game: 'take', heaps: [100], sub: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } },
  { id: 'take-one-three-four', title: 'One, Three or Four', diff: 3,
    text: 'A heap of 20 counters. In turn, take 1, 3 or 4 — never 2. Whoever takes the last counter wins. You go first.',
    hints: ['Work out, for 0, 1, 2, … counters, whether the player to move wins. Which small numbers lose?', 'The losing numbers repeat every 7.'],
    explain: 'Counting up from 0 the player to move loses at 0 and 2, then 7 and 9, 14 and 16, 21 and 23 … — the numbers that leave a remainder of 0 or 2 after dividing by 7. From 20 take 4 and leave 16.',
    concepts: ['working-backwards', 'modular'], tags: ['take-away'],
    data: { game: 'take', heaps: [20], sub: [1, 3, 4] } },
  { id: 'take-powers-of-two', title: 'Powers of Two', diff: 2,
    text: 'A heap of 25 counters. In turn, take 1, 2, 4, 8 or 16. Whoever takes the last counter wins. You go first.',
    hints: ['No power of two is a multiple of 3.'],
    explain: 'No power of two divides by 3, so from a multiple of 3 every move leaves a non-multiple — and from a non-multiple you can always take 1 or 2 to reach a multiple of 3. Leave multiples of 3: from 25, take 1 (or 4, or 16).',
    concepts: ['modular', 'working-backwards'], tags: ['take-away'],
    data: { game: 'take', heaps: [25], sub: [1, 2, 4, 8, 16] } },
  { id: 'take-subtract-a-square', title: 'Subtract a Square', diff: 4,
    text: 'A heap of 30 counters. In turn, take a square number of them: 1, 4, 9, 16 or 25. Whoever takes the last counter wins. You go first.',
    hints: ['Work backwards: 0 loses, so 1, 4, 9 … win; then 2 loses (you can only take 1).', 'The losing numbers begin 0, 2, 5, 7, 10, 12, 15, 17, 20, 22 — and then there is no pattern at all.'],
    explain: 'The positions that lose for the player to move are 0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 34, 39, 44 … — no simple rule describes them, so the only method is working backwards. From 30 the only winning move is to take 25, leaving 5.',
    concepts: ['working-backwards'], tags: ['take-away', 'squares'],
    data: { game: 'take', heaps: [30], sub: [1, 4, 9, 16, 25] } },
  { id: 'take-three-heaps', title: 'Three Heaps, One to Three', diff: 3,
    text: 'Three heaps of 5, 9 and 11 counters. In a turn you take 1, 2 or 3 counters from one heap. Whoever takes the last counter wins. You go first.',
    hints: ['A single heap under this rule behaves like a Nim row of its remainder after dividing by 4.', 'Remainders 1, 1, 3. Make their nim-sum zero.'],
    explain: 'By the Sprague–Grundy theorem each heap is worth a Nim heap of its **Grundy number** — here the remainder mod 4: 5, 9, 11 are worth 1, 1, 3. Their nim-sum is 3, so take 3 from the heap of 11 (leaving 8, worth 0): now 1 ⊕ 1 ⊕ 0 = 0.',
    concepts: ['nim-sum', 'modular'], tags: ['take-away', 'sprague-grundy'],
    data: { game: 'take', heaps: [5, 9, 11], sub: [1, 2, 3] } }
];

/* ---------------- Wythoff ---------------- */

const wyFam = {
  id: 'wythoff', prefix: 'wy', name: 'Wythoff’s queen', order: 3,
  blurb: 'A queen that may only move toward the corner: left, down or diagonally. Whoever reaches the corner wins. The safe squares follow the golden ratio.',
  origin: { year: 1907, who: 'Willem Abraham Wythoff', note: 'Wythoff studied Nim with two heaps where a player may also take the same number from both (1907), and found the losing positions: pairs (⌊nφ⌋, ⌊nφ²⌋) built on the golden ratio φ. Rufus Isaacs later turned it into a queen moving to the corner of a chessboard, a version Martin Gardner popularised.' },
  concepts: ['working-backwards', 'symmetry'],
  genConcepts: ['working-backwards']
};
const wyClassics = [
  { id: 'wy-corner-the-queen', title: 'Corner the Queen', diff: 2,
    text: 'A queen stands on column 7, row 5 of the board. Players take turns moving her left, down, or diagonally down-left, any number of squares. Whoever puts her on the starred corner wins. You move first.',
    hints: ['Mark the squares from which the player to move loses: the corner first, then (1, 2) and (2, 1).', 'The next safe squares are (3, 5) and (5, 3).'],
    explain: 'Working back from the corner, the safe squares (lose for the player to move) are (0, 0), (1, 2), (3, 5), (4, 7), (6, 10), (8, 13) … and their mirror images. From (7, 5), move the queen 4 squares left to (3, 5) — or 2 squares diagonally to (5, 3). The pairs are (⌊nφ⌋, ⌊nφ⌋ + n) for n = 0, 1, 2 …, with φ the golden ratio.',
    concepts: ['working-backwards'], tags: ['wythoff', 'queen', 'classic'],
    data: { game: 'wythoff', a: 7, b: 5 } },
  { id: 'wy-two-heaps', title: 'Wythoff’s Nim', diff: 2, year: 1907,
    source: 'W. A. Wythoff, “A modification of the game of Nim” (1907).',
    text: 'Two heaps of 3 and 6 counters. In a turn take any number from one heap, or the same number from both. Whoever takes the last counter wins. The board shows it as a queen: the heaps are her column and row. You move first.',
    hints: ['Work backwards from the corner: from (1, 2) and (2, 1) the player to move always loses. Which squares come next?', 'The next safe squares are (3, 5) and (5, 3).'],
    concepts: ['working-backwards'], tags: ['wythoff', 'classic'],
    data: { game: 'wythoff', a: 3, b: 6 } }
];

/* ---------------- Kayles ---------------- */

const kaFam = {
  id: 'kayles', prefix: 'ka', name: 'Kayles and skittles', order: 4,
  blurb: 'A row of skittles; each throw knocks down one, or two side by side. Whoever knocks down the last wins. Symmetry wins the first game — Grundy numbers the rest.',
  origin: { year: 1907, who: 'Henry Dudeney', note: 'Dudeney set the game of Kayles in *The Canterbury Puzzles* (1907), named after an old form of skittles; Sam Loyd told a similar tale about Rip Van Winkle. Richard Guy and Cedric Smith worked out its Grundy numbers in 1956: from 71 skittles on they repeat every 12.' },
  concepts: ['symmetry', 'nim-sum'],
  genConcepts: ['nim-sum']
};
const kaClassics = [
  { id: 'ka-mirror-seven', title: 'The Mirror Trick', diff: 1,
    text: 'Seven skittles stand in a row. A throw knocks down one skittle, or two standing side by side. Whoever knocks down the last skittle wins. You throw first.',
    hints: ['Can you split the row into two equal halves?'],
    explain: 'Knock down the middle skittle: two rows of three are left. Then copy every throw of the computer in the other row — it can never knock down the last one before you do. With an even row, knock down the middle two.',
    concepts: ['symmetry'], tags: ['kayles', 'symmetry'],
    data: { game: 'kayles', pins: '1111111' } },
  { id: 'ka-mirror-ten', title: 'Even Stevens', diff: 1,
    text: 'Ten skittles stand in a row. A throw knocks down one skittle, or two side by side. Whoever knocks down the last wins. You throw first.',
    hints: ['Ten is even — so what would make the two halves equal?'],
    explain: 'Knock down the two middle skittles (5 and 6), leaving two rows of four, and then mirror every throw.',
    concepts: ['symmetry'], tags: ['kayles', 'symmetry'],
    data: { game: 'kayles', pins: '1111111111' } },
  { id: 'ka-dudeney', title: 'Dudeney’s Kayles', diff: 3, year: 1907,
    source: 'H. E. Dudeney, *The Canterbury Puzzles* (1907), “The Game of Kayles”.',
    text: 'Thirteen kayle-pins stand in a row, but the second has already been knocked down. Each throw knocks down one pin, or two standing side by side. Whoever knocks down the last pin wins. It is your throw: how do you make sure of winning?',
    hints: ['The lone first pin and the row of eleven are two separate games.', 'Leave a single pin and two rows whose Grundy numbers cancel: 1, 3 and 7 pins will do.'],
    explain: 'Knock down the sixth pin, leaving groups of 1, 3 and 7. Their Grundy numbers are 1, 3 and 2, and 1 ⊕ 3 ⊕ 2 = 0 — a losing position for the computer. (Knocking down the tenth pin works too.)',
    concepts: ['nim-sum', 'symmetry'], tags: ['kayles', 'classic', 'dudeney'],
    data: { game: 'kayles', pins: '1011111111111' } }
];

/* ---------------- Northcott ---------------- */

const ncFam = {
  id: 'northcott', prefix: 'nc', name: 'Northcott’s game', order: 5,
  blurb: 'A checker of each colour in every row; slide yours toward mine or away, never past. It looks like a chess puzzle — it is Nim in disguise.',
  origin: { year: 1982, who: 'Winning Ways', note: 'Berlekamp, Conway and Guy’s *Winning Ways for your Mathematical Plays* (1982) calls it Northcott’s game. The gaps between the checkers are Nim heaps; retreating is allowed but never helps, because the winner simply follows.' },
  concepts: ['nim-sum', 'binary'],
  genConcepts: ['nim-sum', 'binary']
};
const ncClassics = [
  { id: 'nc-two-rows', title: 'Two Rows', diff: 1,
    text: 'Two rows of 8 squares. In each row your white checker and my red one face each other. In a turn you slide one of your checkers along its row, forward or back, as far as you like — never onto or over mine. Whoever cannot move loses. You move first.',
    hints: ['Count the empty squares between the checkers in each row.', 'What if both gaps were the same?'],
    explain: 'The gaps are 3 and 5. Close the bigger gap to 3 — then answer every move of mine in the other row. If I back away, follow me by the same amount; the gaps stay equal and I run out of moves first.',
    concepts: ['symmetry', 'nim-sum'], tags: ['northcott'],
    data: { game: 'northcott', width: 8, w: [0, 0], b: [4, 6] } }
];

/* ---------------- Grundy's game ---------------- */

const grFam = {
  id: 'grundy-game', prefix: 'gg', name: 'Grundy’s game', order: 6,
  blurb: 'Split a stack of coins into two unequal stacks; stacks of 1 and 2 are stuck. Whoever cannot move loses. Each stack has a Grundy number — and nobody knows whether they ever repeat.',
  origin: { year: 1939, who: 'Patrick Grundy', note: 'Patrick Grundy described this game in 1939, in the paper where he (independently of Roland Sprague, 1935) showed that every impartial game is equivalent to a Nim heap. The Grundy numbers of this game have been computed for billions of stacks without any sign of a period.' },
  concepts: ['nim-sum', 'working-backwards'],
  genConcepts: ['nim-sum', 'working-backwards']
};
const grClassics = [
  { id: 'gg-five', title: 'Five Coins', diff: 1,
    text: 'A stack of five coins. In a turn you split one stack into two stacks of different sizes (so 4 + 1 or 3 + 2 here). Stacks of 1 and 2 can never be split. Whoever cannot move loses. You move first.',
    hints: ['Try both splits in your head. After each, what can the computer do?'],
    explain: 'Split 4 + 1. The computer can only split the 4 into 3 + 1; you split the 3 into 2 + 1, and the computer is stuck. (After 3 + 2 instead, the computer would split the 3 and leave you stuck.)',
    concepts: ['working-backwards'], tags: ['grundy'],
    data: { game: 'grundy', heaps: [5] } },
  { id: 'gg-eight', title: 'Eight Coins', diff: 2,
    text: 'A stack of eight coins. Split one stack into two unequal stacks in each turn; stacks of 1 and 2 are stuck. Whoever cannot move loses. You move first.',
    hints: ['Stacks of 1, 2, 4 and 7 lose for the player to move.', 'Leave stacks whose Grundy numbers cancel — 7 and 1 does it.'],
    explain: 'The Grundy numbers of stacks 1, 2, 3 … are 0, 0, 1, 0, 2, 1, 0, 2 … — so a stack of 7 is worth 0 and so is a stack of 1. Split 8 into 7 + 1: nim-sum 0.',
    concepts: ['nim-sum', 'working-backwards'], tags: ['grundy'],
    data: { game: 'grundy', heaps: [8] } }
];

/* ---------------- write them all ---------------- */

write(nimFam, build(nimFam, nimClassics, [0, 6, 9, 10, 9, 9], 1901));
write(takeFam, build(takeFam, takeClassics, [0, 5, 7, 8, 7, 5], 1612));
write(wyFam, build(wyFam, wyClassics, [0, 3, 4, 4, 4, 3], 1907));
write(kaFam, build(kaFam, kaClassics, [0, 3, 4, 4, 3, 3], 1908));
write(ncFam, build(ncFam, ncClassics, [0, 2, 3, 3, 3, 3], 1982));
write(grFam, build(grFam, grClassics, [0, 2, 3, 3, 3, 2], 1939));
