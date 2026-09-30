/* The Puzzle Cabinet · tools/gen/cards.js
 *
 *   node tools/gen/cards.js      writes data/card-arrangements.js and data/card-deals.js
 *
 * Classic card arrangements (the sixteen court cards, magic squares and
 * triangles, Langford's pairs, the no-neighbours puzzle) and square puzzles
 * with givens that have exactly one solution; then the deals: down-under,
 * spelling, the three-pile trick and Gilbreath's shuffle. Every puzzle is
 * checked with the engine's verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/cards.js'));
const L = C.cardsLib;
const E = C.engines.cards;
const mk = L.mk, short = L.short;

function emitFile(file, meta, list, pre) {
  const lines = ['/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/cards.js */'].concat(pre ? [pre] : []).concat(['Cabinet.family(' + JSON.stringify(meta, null, 2).replace(/"(\w+)":/g, '$1:') + ', [']);
  list.forEach((p, i) => {
    const r = E.verify(p);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
    const keys = Object.keys(p).filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < list.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  fs.writeFileSync(path.join(ROOT, 'data', file), lines.join('\n') + '\n');
  const by = [0, 0, 0, 0, 0, 0];
  list.forEach((p) => by[p.diff]++);
  console.log(file + ': ' + list.length + ' puzzles; by difficulty ' + by.slice(1).join(' / '));
}

/* ================= arrangements ================= */

const arr = [];
function solOf(d, seed) {
  const r = L.solveArrange(d, { limit: 1, rng: seed != null ? C.rng(seed) : null, nodes: 5e6 });
  if (!r.count) throw new Error('no solution');
  return r.sols[0];
}
const court = (n, diag) => L.courtSquare(n, diag);

// 1. three by three
{
  const d = court(3, false);
  d.sol = solOf(d, 11);
  arr.push({
    id: 'card-arr-nine-courtiers', title: 'Nine Courtiers', diff: 1,
    text: 'Nine court cards: the king, queen and jack of spades, hearts and diamonds. Lay them in a 3 × 3 square so that **no row and no column** holds two cards of the same suit or two of the same rank.',
    goal: 'Every row and every column: three suits and three ranks.',
    hints: ['Put the three kings on a diagonal first — one in each row and each column.', 'Now the queens: again one in each row and column, and each in a suit its row does not have yet.'],
    explain: 'Each rank must appear once in every row and column, and so must each suit: the ranks form one **Latin square** and the suits another, laid on top of each other so that every rank meets every suit exactly once. Such a pair is called a Graeco-Latin (or Euler) square. Curiously, a 3 × 3 one can never have its two long diagonals right as well — try it, or ask the computer: there are 72 ways to lay these nine cards, and none of them manages the diagonals.',
    concepts: ['latin-square'], tags: ['court cards', 'latin square'],
    data: d
  });
}
// a few three-by-three with cards given
{
  const rng = C.rng(3301);
  const seen = new Set();
  let k = 0;
  while (k < 3) {
    const d = L.withGivens(court(3, false), rng, k === 0 ? 1 : 0, 2);
    const key = JSON.stringify(d.given);
    if (seen.has(key)) continue;
    seen.add(key);
    k++;
    arr.push({
      id: 'card-arr-nine-' + k, title: 'Nine Courtiers, ' + ['', 'First', 'Second', 'Third'][k] + ' Hand', diff: 1,
      text: 'Finish the square with the cards in the tray: no row and no column may hold two cards of the same suit or two of the same rank. The cards on the table stay put.',
      goal: 'Rows and columns: no suit and no rank twice.',
      concepts: ['latin-square'], tags: ['court cards', 'givens'],
      data: d
    });
  }
}
// 2. sixteen, rows and columns only
{
  const d = court(4, false);
  d.sol = solOf(d, 7);
  arr.push({
    id: 'card-arr-sixteen-plain', title: 'The Sixteen, in Rows', diff: 2,
    text: 'The sixteen court cards — ace, king, queen and jack of every suit. Arrange them in a 4 × 4 square so that no row and no column holds two cards of the same suit or two of the same rank.',
    goal: 'Every row and every column: four suits, four ranks.',
    hints: ['Put the four aces on the long diagonal, in four different suits.', 'Fill the rest row by row; each row is the row above with the ranks shifted along one place.'],
    explain: 'Ranks and suits each form a **Latin square**, and together every rank meets every suit once: a Graeco-Latin square. There are 6912 arrangements of these sixteen cards that satisfy the rows and columns.',
    concepts: ['latin-square'], tags: ['court cards', 'latin square'],
    data: d
  });
}
// 3. the classic, with diagonals
{
  const d = court(4, true);
  d.sol = solOf(d, 5);
  arr.push({
    id: 'card-arr-sixteen', title: 'The Sixteen Court Cards', diff: 3,
    source: 'A traditional problem of recreational mathematics; it is often credited to Jacques Ozanam\'s *Récréations mathématiques*.',
    text: 'The classic: lay out the aces, kings, queens and jacks of all four suits in a 4 × 4 square so that **no row, no column and neither of the two long diagonals** contains two cards of the same suit or two of the same rank.',
    goal: 'Rows, columns and both long diagonals: four suits and four ranks each.',
    hints: ['Settle the ranks first: an arrangement of A K Q J in which every row, column and diagonal has all four — then do the same for the suits separately.', 'For the ranks, try A K Q J on the top row and Q J A K on the second.', 'The suits need a second such square that "fits" the first: every rank must meet every suit once. Try ♠ ♥ ♦ ♣ on top and ♦ ♣ ♠ ♥ in the third row.'],
    explain: 'The ranks form a Latin square whose diagonals are also complete, and so do the suits; laid on top of each other, every rank meets every suit exactly once. There are **1152** such arrangements of the sixteen cards (a computer count; they fall into a handful of families related by turning, reflecting and relabelling). Euler asked the same of 36 officers — six ranks from six regiments in a 6 × 6 square, rows and columns only — and suspected it was impossible; Gaston Tarry proved it in 1901.',
    links: ['card-arr-sixteen-plain'],
    concepts: ['latin-square'], tags: ['court cards', 'classic', 'euler'],
    data: d
  });
}
// 4. corners and centre too
{
  const d = court(4, true);
  d.rules.push({ t: 'distinct', by: 'suit', lines: [[0, 3, 12, 15], [5, 6, 9, 10]] });
  d.rules.push({ t: 'distinct', by: 'rank', lines: [[0, 3, 12, 15], [5, 6, 9, 10]] });
  const r = L.solveArrange(d, { limit: 100000, nodes: 2e7 });
  d.sol = r.sols[0];
  arr.push({
    id: 'card-arr-sixteen-corners', title: 'Corners and Heart', diff: 4,
    text: 'As in [[card-arr-sixteen]], every row, column and long diagonal must have four suits and four ranks — and now the **four corners**, and the **four cards in the middle**, must also have four suits and four ranks.',
    goal: 'Rows, columns, diagonals, corners and centre: all different.',
    hints: ['The corners and the centre are on the diagonals too, so each diagonal is split between them.', 'Start from a solution of the ordinary puzzle and look for one whose corners already work.'],
    explain: 'The extra conditions cut the ' + 1152 + ' arrangements of the classic puzzle down to ' + r.count + '. Squares like these, where many more groups of four are complete, are the card version of the "most-perfect" magic squares.',
    links: ['card-arr-sixteen'],
    concepts: ['latin-square'], tags: ['court cards'],
    data: d
  });
}
// 5. sixteen with givens (one solution each)
{
  const rng = C.rng(4404);
  const seen = new Set();
  const plan = [[false, 3, 2], [false, 1, 2], [false, 0, 3], [true, 3, 3], [true, 1, 3], [true, 0, 4], [true, 0, 4], [false, 0, 3], [true, 2, 3], [true, 0, 5]];
  plan.forEach(([diag, extra, diff], i) => {
    let d;
    for (;;) { d = L.withGivens(court(4, diag), rng, extra, 2); const k = JSON.stringify(d.given); if (!seen.has(k)) { seen.add(k); break; } }
    const g = Object.keys(d.given).length;
    arr.push({
      id: 'card-arr-sixteen-' + (i + 1), title: (diag ? 'Diagonal Court' : 'Court Square') + ' ' + ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i], diff,
      text: 'Some court cards are already on the table. Place the rest so that no row' + (diag ? ', no column and neither long diagonal' : ' and no column') + ' holds two cards of the same suit or two of the same rank. There is exactly one way.',
      goal: (diag ? 'Rows, columns, diagonals' : 'Rows and columns') + ': four suits, four ranks. ' + C.plural(g, 'card is', 'cards are') + ' given.',
      concepts: ['latin-square'], tags: ['court cards', 'givens'],
      data: d
    });
  });
}
// 6. magic squares
{
  const lines = L.gridLines(3, 3, true);
  const hand = [];
  for (let r = 1; r <= 9; r++) hand.push(mk(r, 'H'));
  const d = { kind: 'arrange', slots: L.gridSlots(3, 3), hand, rules: [{ t: 'sum', total: 15, lines }] };
  d.sol = solOf(d, 2);
  const g = { kind: 'arrange', slots: L.gridSlots(3, 3), hand: hand.filter((c) => c !== '9H' && c !== '2H'), given: { 1: '9H', 2: '2H' }, rules: [{ t: 'sum', total: 15, lines }] };
  g.sol = solOf(g, 2);
  g.unique = true;
  arr.push({
    id: 'card-arr-lo-shu-start', title: 'Two Cards Down', diff: 1,
    text: 'The ace to nine of hearts (the ace counts 1). The 9 and the 2 are placed. Put the other seven so that every row, every column and both diagonals add up to **15**.',
    hints: ['Which card must go in the middle? It is on four of the lines.', 'The middle card is the 5; opposite the 9 across it you need 15 − 9 − 5.'],
    explain: 'The middle card is on four lines, the corners on three, the edges on two; the only card that works in the middle is the 5, and each pair of opposite cards through it adds up to 10.',
    concepts: ['magic-constant'], tags: ['magic square'],
    data: g
  });
  arr.push({
    id: 'card-arr-lo-shu', title: 'The Lo Shu in Hearts', diff: 2,
    source: 'The Lo Shu is the ancient Chinese magic square of legend; here it is laid with cards.',
    text: 'Arrange the ace to nine of hearts (the ace counts 1) in a 3 × 3 square so that every row, every column and both diagonals add up to the same total.',
    goal: 'Every line of three: 15.',
    hints: ['The nine cards add up to 45 and the three rows share it equally: every line must make 15.', 'The middle card is on four lines. Only the 5 can go there.', 'Put the even cards in the corners.'],
    explain: 'The magic total is 45 ÷ 3 = 15. The centre sits on four lines; adding those four lines counts the centre four times and every other card once: 60 = 45 + 3 × centre, so the centre is 5. Then the 9 cannot go in a corner (a corner is on three lines, and 9 fits into only two sums of three with the other cards), so the odd cards take the edges and the even cards the corners. Up to turning and reflecting there is just one magic square of order three.',
    links: ['card-arr-lo-shu-start'],
    concepts: ['magic-constant'], tags: ['magic square', 'classic'],
    data: d
  });
  const hand2 = [];
  for (let r = 2; r <= 10; r++) hand2.push(mk(r, 'C'));
  const d2 = { kind: 'arrange', slots: L.gridSlots(3, 3), hand: hand2, rules: [{ t: 'sum', total: 18, lines }] };
  d2.sol = solOf(d2, 3);
  arr.push({
    id: 'card-arr-magic-clubs', title: 'Two to Ten of Clubs', diff: 2,
    text: 'This time the cards are the 2 to 10 of clubs. Arrange them in a 3 × 3 square so that every row, column and diagonal has the same total. (Work out the total first.)',
    hints: ['The nine cards add up to 54.', 'Each line makes 18, and the middle card is the 6.'],
    explain: 'Adding 1 to every card of the Lo Shu adds 3 to every line: 15 becomes 18, and the centre becomes 6.',
    links: ['card-arr-lo-shu'],
    concepts: ['magic-constant'], tags: ['magic square'],
    data: d2
  });
}
// 7. magic triangles
{
  const plan = [[20, 2], [19, 3], [21, 3], [17, 4], [23, 4]];
  plan.forEach(([tot, diff], i) => {
    const d = L.triangle(tot, 4);
    const r = L.solveArrange(d, { limit: 1000 });
    d.sol = r.sols[0];
    arr.push({
      id: 'card-arr-triangle-' + tot, title: 'Triangle of ' + tot, diff,
      text: 'Lay the ace to nine of diamonds (the ace counts 1) around a triangle, four cards to each side — the corner cards count on two sides. Every side must add up to **' + tot + '**.',
      goal: 'All three sides: ' + tot + '.',
      hints: i === 0 ? ['The three sides together count the corner cards twice: 3 × ' + tot + ' = 45 + (the three corners).', 'So the corners add up to ' + (3 * tot - 45) + '.'] : ['The three sides add up to 3 × ' + tot + ' = ' + (3 * tot) + ', which is 45 plus the corners counted again.', 'The corners must add up to ' + (3 * tot - 45) + '. Try the smallest or the largest cards there.'],
      explain: 'Each corner lies on two sides, so the three side totals add up to 45 + corners. For ' + tot + ' the corners total ' + (3 * tot - 45) + '. The possible side totals with the ace to nine are 17, 19, 20, 21 and 23 — 18 and 22 cannot be done. There are ' + r.count + ' ways for ' + tot + ' (counting turns and reflections as different).',
      links: i ? ['card-arr-triangle-20'] : null,
      concepts: ['magic-constant'], tags: ['magic triangle'],
      data: d
    });
  });
}
// 8. the plus and the frame
{
  const slots = [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [2, 0], [2, 1], [2, 3], [2, 4]];
  const hand = [];
  for (let r = 1; r <= 9; r++) hand.push(mk(r, 'S'));
  const d = { kind: 'arrange', slots, hand, rules: [{ t: 'sum', total: 25, lines: [[0, 1, 2, 3, 4], [5, 6, 2, 7, 8]] }] };
  d.sol = solOf(d, 9);
  arr.push({
    id: 'card-arr-plus', title: 'The Plus Sign', diff: 1,
    text: 'The ace to nine of spades make a plus sign: a row of five crossing a column of five, sharing the middle card. Both the row and the column must add up to **25**.',
    hints: ['Row plus column counts every card once and the middle card twice: 50 = 45 + middle.', 'So the middle card is the 5.'],
    explain: 'Row + column = 45 + middle, so the middle is 50 − 45 = 5. Then split the other eight cards into two groups of four that each add up to 20.',
    concepts: ['magic-constant'], tags: ['cross'],
    data: d
  });
  const fslots = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];
  const fh = [];
  for (let r = 1; r <= 8; r++) fh.push(mk(r, 'H'));
  [[13, 2], [14, 2], [12, 3], [15, 3]].forEach(([tot, diff]) => {
    const fd = { kind: 'arrange', slots: fslots, hand: fh.slice(), rules: [{ t: 'sum', total: tot, badge: 'side', lines: [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0]] }] };
    const r = L.solveArrange(fd, { limit: 10000 });
    fd.sol = r.sols[0];
    arr.push({
      id: 'card-arr-frame-' + tot, title: 'Picture Frame of ' + tot, diff,
      text: 'The ace to eight of hearts make a square frame, three cards to a side (the corners belong to two sides). Every side must add up to **' + tot + '**.',
      hints: ['The four sides count the corners twice: 4 × ' + tot + ' = 36 + corners.', 'The corners must add up to ' + (4 * tot - 36) + '.'],
      explain: 'Four sides of ' + tot + ' make ' + (4 * tot) + ', which is the 36 pips of the eight cards plus the four corners again; so the corners total ' + (4 * tot - 36) + '. Sides of 12 to 15 can all be done.',
      concepts: ['magic-constant'], tags: ['frame'],
      data: fd
    });
  });
}
// 9. no neighbours
{
  const slots = [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2]];
  const pairs = [];
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const a = slots[i], b = slots[j]; if (Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) === 1) pairs.push([i, j]); }
  const hand = [];
  for (let r = 1; r <= 8; r++) hand.push(mk(r, 'C'));
  const d = { kind: 'arrange', slots, hand, rules: [{ t: 'apart', by: 'consec', pairs }] };
  const r = L.solveArrange(d, { limit: 100 });
  d.sol = r.sols[0];
  arr.push({
    id: 'card-arr-no-neighbours', title: 'No Next-Door Numbers', diff: 3,
    source: 'A well-known puzzle of uncertain origin, here with cards.',
    text: 'Place the ace to eight of clubs in the eight places so that **no two cards in touching places** — side by side, above and below, or corner to corner — are next to each other in rank. (The ace is 1, so ace and 2 may not touch; ace and 8 may.)',
    hints: ['The two middle places touch six others each. Which cards have only one neighbour in rank?', 'Put the ace and the 8 in the two middle places.', 'The 2 and the 7 then go in the far left and far right places.'],
    explain: 'The middle places touch all but one of the other places, so the cards there must have as few "next-door" ranks as possible: only the ace (next to 2 alone) and the 8 (next to 7 alone) will do. Then the 7 must go where it does not touch the 8, and the 2 where it does not touch the ace — the two end places — and the rest follows. There are just ' + r.count + ' solutions, reflections of one another.',
    concepts: ['deduction'], tags: ['no neighbours', 'classic'],
    data: d
  });
  // a ring
  const ring = [];
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ring.push([+(1.6 + Math.sin(a) * 1.6).toFixed(3), +(1.25 - Math.cos(a) * 1.25).toFixed(3)]); }
  const rp = [];
  for (let i = 0; i < 8; i++) rp.push([i, (i + 1) % 8]);
  const hh = [];
  for (let k = 1; k <= 8; k++) hh.push(mk(k, k % 2 ? 'D' : 'S'));
  const rd = { kind: 'arrange', slots: ring, hand: hh, rules: [{ t: 'apart', by: 'consec', pairs: rp }, { t: 'apart', by: 'colour', pairs: rp }] };
  const rr = L.solveArrange(rd, { limit: 10000 });
  rd.sol = rr.sols[0];
  arr.push({
    id: 'card-arr-ring', title: 'Round the Ring', diff: 2,
    text: 'Eight cards in a ring: the odd ones are diamonds, the even ones spades. Neighbours must be **different colours**, and must **not be next to each other in rank**.',
    hints: ['Different colours means odd and even alternate round the ring.', 'An odd card must sit between two even cards that are not one more or one less than it.'],
    explain: 'The colours force odd, even, odd, even round the ring. The ace may touch only 4, 6 or 8; the 3 only 6 or 8; the 5 only 2 or 8; the 7 only 2 or 4. With only a few choices for each, the ring closes in ' + rr.count + ' ways (counting turns and reflections).',
    concepts: ['deduction'], tags: ['no neighbours', 'ring'],
    data: rd
  });
}
// 10. Langford's pairs
{
  [[3, 2], [4, 3], [7, 4], [8, 5]].forEach(([n, diff]) => {
    const slots = [];
    for (let i = 0; i < 2 * n; i++) slots.push([i, 0]);
    const hand = [];
    for (let r = 1; r <= n; r++) hand.push(mk(r, 'S'), mk(r, 'H'));
    const d = { kind: 'arrange', slots, hand, rules: [{ t: 'langford', row: slots.map((s, i) => i) }] };
    const r = L.solveArrange(d, { limit: 100000, nodes: 3e7 });
    d.sol = r.sols[0];
    const names = ['', 'aces', 'twos', 'threes', 'fours', 'fives', 'sixes', 'sevens', 'eights'];
    arr.push({
      id: 'card-arr-langford-' + n, title: 'Langford\'s ' + ['', '', '', 'Three', 'Four', '', '', 'Seven', 'Eight'][n] + ' Pairs', diff,
      year: n === 3 ? 1958 : undefined,
      source: 'C. Dudley Langford noticed the pattern in his small son\'s coloured blocks and published the problem in 1958.',
      text: 'A spade and a heart of every rank from the ace to ' + ['', '', '', 'three', 'four', '', '', 'seven', 'eight'][n] + '. Lay all ' + 2 * n + ' cards in a row so that there is **one card between the two aces, two cards between the two twos, three between the threes**, and so on.',
      goal: 'Between the two cards of rank k: exactly k cards.',
      hints: n === 3 ? ['The two threes need three cards between them: they sit at places 1 and 5, or 2 and 6.', 'Try the threes at 1 and 5.'] : n === 4 ? ['Start with the fours: four cards between them, so they must be at places 1 and 6, 2 and 7, or 3 and 8.', 'Try the fours at 1 and 6.'] : ['Place the biggest pair first: it has the fewest places it can go.', 'Arcs over the row show how many cards lie between each pair.'],
      explain: 'Ignoring the suits, there ' + (r.count / Math.pow(2, n) / 2 === 1 ? 'is just one such row' : 'are ' + (r.count / Math.pow(2, n) / 2) + ' such rows') + ' for ' + n + ' pairs (a row and its reverse counted once). Langford arrangements exist only when the number of pairs leaves 0 or 3 over when divided by 4 — so with 5 or 6 pairs it cannot be done, however hard you try.',
      links: n > 3 ? ['card-arr-langford-3'] : null,
      concepts: ['combinatorics'], tags: ['langford', 'pairs'],
      data: d
    });
  });
}
// 10b. Skolem's pairs: exactly k apart
{
  [[4, 3], [5, 4]].forEach(([n, diff]) => {
    const slots = [];
    for (let i = 0; i < 2 * n; i++) slots.push([i, 0]);
    const hand = [];
    for (let r = 1; r <= n; r++) hand.push(mk(r, 'C'), mk(r, 'D'));
    const d = { kind: 'arrange', slots, hand, rules: [{ t: 'langford', row: slots.map((s, i) => i), skolem: true }] };
    const r = L.solveArrange(d, { limit: 1e6, nodes: 3e7 });
    d.sol = r.sols[0];
    arr.push({
      id: 'card-arr-skolem-' + n, title: 'Skolem\'s ' + (n === 4 ? 'Four' : 'Five') + ' Pairs', diff,
      source: 'Sequences like this were studied by the Norwegian mathematician Thoralf Skolem in the 1950s.',
      text: 'A club and a diamond of every rank from the ace to ' + (n === 4 ? 'four' : 'five') + '. This time each pair must be **exactly its rank apart**: the two aces side by side, the two twos with one card between them, the threes with two between, and so on.',
      goal: 'The two cards of rank k: k places apart.',
      hints: ['The aces are neighbours, so they are the easy ones to fit in last.', 'Place the ' + (n === 4 ? 'fours' : 'fives') + ' first: they need the widest gap.'],
      explain: 'This is the cousin of [[card-arr-langford-3|Langford\'s pairs]] with every gap one smaller. Such rows exist exactly when the number of pairs leaves 0 or 1 over when divided by 4. Ignoring suits, there are ' + (r.count / Math.pow(2, n) / 2) + ' rows for ' + n + ' pairs (a row and its reverse counted once).',
      links: ['card-arr-langford-3'],
      concepts: ['combinatorics'], tags: ['skolem', 'pairs'],
      data: d
    });
  });
}
// 10c. the chequered square
{
  const orth = [];
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { if (x < 3) orth.push([y * 4 + x, y * 4 + x + 1]); if (y < 3) orth.push([y * 4 + x, (y + 1) * 4 + x]); }
  const d = court(4, false);
  d.rules.push({ t: 'apart', by: 'colour', pairs: orth });
  const r = L.solveArrange(d, { limit: 1e5 });
  d.sol = r.sols[0];
  arr.push({
    id: 'card-arr-chequered', title: 'The Chequered Court', diff: 3,
    text: 'The sixteen court cards in a 4 × 4 square: no row and no column may hold two cards of the same suit or of the same rank — and **no two cards side by side or one above the other may be the same colour**.',
    goal: 'Rows and columns all different; red and black like a chessboard.',
    hints: ['Touching cards differ in colour, so the colours make a chessboard pattern.', 'Each row then has red, black, red, black: two red suits and two black ones, alternating.'],
    explain: 'The colour rule forces a chessboard of red and black, and the rest is a Graeco-Latin square that fits it: there are ' + r.count + ' of them. Asking for the long diagonals as well would be impossible: every diagonal of a chessboard is a single colour, but a diagonal would need two red suits and two black ones.',
    links: ['card-arr-sixteen'],
    concepts: ['latin-square', 'coloring-argument'], tags: ['court cards', 'colours'],
    data: d
  });
}
// 11. the six-pointed star
{
  const tips = [], inner = [];
  const Rr = 2.5, ri = Rr / Math.sqrt(3);
  for (let k = 0; k < 6; k++) { const a = (-90 + 60 * k) * Math.PI / 180; tips.push([Math.cos(a) * Rr, Math.sin(a) * Rr]); }
  for (let k = 0; k < 6; k++) { const a = (-60 + 60 * k) * Math.PI / 180; inner.push([Math.cos(a) * ri, Math.sin(a) * ri]); }
  const pts = tips.concat(inner);
  const lines = [];
  [[0, 2], [2, 4], [4, 0], [1, 3], [3, 5], [5, 1]].forEach(([a, b]) => {
    const A = tips[a], B = tips[b];
    const on = [];
    pts.forEach((q, i) => { const cr = (B[0] - A[0]) * (q[1] - A[1]) - (B[1] - A[1]) * (q[0] - A[0]); if (Math.abs(cr) < 1e-6) on.push(i); });
    on.sort((i, j) => ((pts[i][0] - A[0]) * (B[0] - A[0]) + (pts[i][1] - A[1]) * (B[1] - A[1])) - ((pts[j][0] - A[0]) * (B[0] - A[0]) + (pts[j][1] - A[1]) * (B[1] - A[1])));
    lines.push(on);
  });
  if (lines.some((l) => l.length !== 4)) throw new Error('hexagram lines');
  const slots = pts.map((q) => [+(q[0] * 1.25 + 3).toFixed(3), +(q[1] * 0.95 + 2.5).toFixed(3)]);
  const hand = [];
  for (let r = 1; r <= 12; r++) hand.push(mk(r, r % 2 ? 'H' : 'C'));
  const d = { kind: 'arrange', slots, hand, rules: [{ t: 'sum', total: 26, lines }] };
  const r = L.solveArrange(d, { limit: 100000, nodes: 5e7 });
  d.sol = r.sols[0];
  arr.push({
    id: 'card-arr-star', title: 'The Six-Pointed Star', diff: 5,
    text: 'Twelve cards, the ace to the queen (ace 1, jack 11, queen 12), go on the twelve points of a six-pointed star: its six tips and the six corners of the hexagon inside. Each of the six straight lines passes through four cards. Make **every line add up to 26**.',
    goal: 'All six lines of four: 26.',
    hints: ['Every card is on exactly two lines, so the six lines add up to twice 78 — that is why each must make 26.', 'Each line has two tips and two inner corners. Fill the inner hexagon first, then see what each tip must be.', 'In one solution the top point is the ' + L.longName(d.sol[0]).replace('the ', '') + ' and the bottom point the ' + L.longName(d.sol[3]).replace('the ', '') + '.'],
    explain: 'The twelve cards add up to 78 and each lies on two lines: 6 × 26 = 2 × 78. The computer finds ' + r.count + ' arrangements — ' + (r.count / 12) + ' if turns and reflections of the star count as the same. A curious fact of the same family: with ten cards on a five-pointed star, where the lines would each have to make 22, the ace to ten can never make all five lines equal (the computer tries every way and finds none).',
    concepts: ['magic-constant'], tags: ['star', 'magic'],
    data: d
  });
}

// sort easiest first, keeping the order within a difficulty
const order = (list) => list.map((p, i) => ({ p, i })).sort((a, b) => a.p.diff - b.p.diff || a.i - b.i).map((x) => x.p);
emitFile('card-arrangements.js', {
  id: 'card-arrangements', engine: 'cards', cat: 'cards', name: 'Cards in order', order: 1,
  blurb: 'Lay out the cards so every line is right: the sixteen court cards, magic squares and triangles, Langford\'s pairs.',
  origin: { who: 'The old books of recreations', note: 'Card arrangement puzzles are as old as printed books of mathematical recreations; the sixteen court cards are the most famous, and lead straight to Euler\'s problem of the 36 officers.' },
  concepts: ['latin-square', 'magic-constant']
}, order(arr));

/* ================= deals ================= */

const deals = [];
const suitRun = (n, s) => { const a = []; for (let r = 1; r <= n; r++) a.push(mk(r, s)); return a; };
function mkDeal(id, title, diff, target, rule, extra) {
  const rng = C.rng(id);
  let cards;
  for (let k = 0; k < 50; k++) { cards = rng.shuffle(target.slice()); if (L.dealt(cards, rule).join() !== target.join() && L.pileFor(target, rule).join() !== cards.join()) break; }
  const d = { kind: 'deal', cards, target, rule, sol: L.pileFor(target, rule) };
  return Object.assign({ id, title, diff, text: L.dealText(d), data: d, concepts: ['working-backwards'], tags: ['deal'] }, extra || {});
}
const DU = { under: 1 }, UD = { under: 1, first: 'under' };
deals.push(mkDeal('card-deal-four', 'Down Under with Four', 1, suitRun(4, 'S'), DU, {
  hints: ['Deal four face-down cards in your head, calling them places 1, 2, 3, 4 from the top. Which comes out first? Which second?', 'Place 1 is dealt first; place 2 goes under; place 3 is dealt second. So the 2 belongs in place 3.'],
  explain: 'Dealing the places 1–4 of the pile: 1 is dealt, 2 goes under, 3 is dealt, 4 goes under, 2 is dealt, and 4 is last. So the ace goes in place 1, the 2 in place 3, the 3 in place 2 and the 4 in place 4.'
}));
deals.push(mkDeal('card-deal-five', 'Down Under with Five', 1, suitRun(5, 'H'), DU, { hints: ['Work backwards: which place in the pile comes out last?'] }));
deals.push(mkDeal('card-deal-under-five', 'Under, Then Down', 1, suitRun(5, 'D'), UD, { hints: ['This time the top card goes under first. So the ace must start second.'] }));
deals.push(mkDeal('card-deal-spell-five', 'Spell It Out', 2, suitRun(5, 'C'), { spell: L.SPELL.slice(1, 6) }, {
  hints: ['A-C-E: two cards go under, and the third is dealt. So the ace is third from the top.', 'Then T-W-O: two more go under from what is left, and the next is the two.'],
  explain: 'Deal numbered places in your head with the spelling, and write down which place comes out for each word. Put the ace in the place dealt on A-C-E, the two in the place dealt on T-W-O, and so on. It is the same working-backwards trick as the down-under deal, with longer "under" runs.'
}));
deals.push(mkDeal('card-deal-six', 'Six Down Under', 2, suitRun(6, 'S'), DU));
deals.push(mkDeal('card-deal-eight', 'Eight Down Under', 2, suitRun(8, 'H'), DU, { hints: ['The odd places come out first: 1, 3, 5, 7. So the ace, 2, 3 and 4 go in places 1, 3, 5 and 7.'] }));
deals.push(mkDeal('card-deal-under-eight', 'Eight, Under First', 2, suitRun(8, 'C'), UD));
deals.push(mkDeal('card-deal-mixed', 'Four Suits in Turn', 3, ['AS', '2H', '3C', '4D', '5S', '6H', '7C'], DU, { hints: ['The suits do not change the deal at all — only the order the cards must come out in.'] }));
deals.push(mkDeal('card-deal-ten', 'Ace to Ten', 3, suitRun(10, 'D'), DU, {
  hints: ['The first time through, every other place is dealt: places 1, 3, 5, 7, 9.', 'After the 9th place is dealt, the 10th goes under, so the pile is now 2, 4, 6, 8, 10 and the 2nd place is dealt next.'],
  explain: 'Deal the places 1–10: out come 1, 3, 5, 7, 9, then 2, 6, 10, then 8, and last 4. So the ace goes in place 1, the 2 in place 3, the 3 in place 5 … the 9 in place 8 and the 10 in place 4.'
}));
deals.push(mkDeal('card-deal-two-under-seven', 'Two Under', 3, suitRun(7, 'S'), { under: 2 }));
deals.push(mkDeal('card-deal-thirteen', 'The Full Suit', 4, suitRun(13, 'S'), DU, {
  source: 'A traditional card trick: the "down-under" or "Australian" deal.',
  hints: ['Deal the places 1 to 13 by the rule, on paper or with the pen, and write down the order they come out.', 'Places 1, 3, 5, 7, 9, 11, 13 come out first; then the pile is 2, 4, 6, 8, 10, 12 — with 2 going under first, since 13 was just dealt.'],
  explain: 'The places come out in the order 1, 3, 5, 7, 9, 11, 13, 4, 8, 12, 6, 2, 10. So the ace goes in place 1, the 2 in place 3 … the 7 in place 13, the 8 in place 4, and so on — the king in place 10.'
}));
deals.push(mkDeal('card-deal-under-thirteen', 'Under-Down, Full Suit', 4, suitRun(13, 'H'), UD));
deals.push(mkDeal('card-deal-spell-ten', 'Spelling to Ten', 4, suitRun(10, 'H'), { spell: L.SPELL.slice(1, 11) }));
deals.push(mkDeal('card-deal-spell-thirteen', 'Spelling Bee', 5, suitRun(13, 'C'), { spell: L.SPELL.slice(1, 14) }, {
  source: 'The "spelling bee" is a traditional card trick; this is the full-suit version.',
  hints: ['Deal numbered places in your head (or on the notebook) with the spelling rule and record which comes out on each word.'],
  explain: 'Nothing but patience: follow numbered places through the spelling and put each card in the place that comes out on its word. The last few words cycle round a small pile, which is where most attempts go wrong.'
}));
deals.push(mkDeal('card-deal-two-under-thirteen', 'Two Under, Full Suit', 5, suitRun(13, 'D'), { under: 2 }));

// the three-pile trick
const piles = [
  ['card-deal-piles-14', 'The Twenty-Seven Card Trick', 2, 14, 'The classic: the spectator\'s card must come out **14th** — exactly in the middle of the 27. (Hint for magicians: there is one choice that works every round.)', ['Try putting the named pile in the middle every time.'], 'Putting the pile in the middle every round gives the digits 1, 1, 1 in base 3: 1 + 3 + 9 = 13 places above the card, so it is 14th.'],
  ['card-deal-piles-1', 'Top of the Deck', 2, 1, 'Make the spectator\'s card come out on **top** of the deck — the 1st card.', ['If the named pile goes on top, the card is somewhere in the top nine.'], null],
  ['card-deal-piles-27', 'Rock Bottom', 2, 27, 'Make the spectator\'s card end up at the very **bottom**: the 27th card.', null, null],
  ['card-deal-piles-10', 'Tenth Card', 3, 10, 'Make the spectator\'s card come out **10th**.', ['Counting from 0, the 10th card is at 9, which is 100 in base 3.'], null],
  ['card-deal-piles-20', 'Twentieth Card', 3, 20, 'Make the spectator\'s card come out **20th**.', ['Counting from 0 it is at 19, which is 201 in base 3: units 1, threes 0, nines 2.'], null],
  ['card-deal-piles-5', 'Fifth Card', 3, 5, 'Make the spectator\'s card come out **5th**.', null, null],
  ['card-deal-piles-23', 'Twenty-Third Card', 4, 23, 'Make the spectator\'s card come out **23rd**.', null, null],
  ['card-deal-piles-17', 'Seventeenth Card', 4, 17, 'Make the spectator\'s card come out **17th**.', null, null]
];
piles.forEach(([id, title, diff, target, text, hints, explain]) => {
  deals.push({
    id, title, diff,
    source: id === 'card-deal-piles-14' ? 'A traditional trick; the mathematics of it was worked out by Joseph Gergonne early in the 19th century.' : null,
    text: 'Twenty-seven cards. A spectator has looked at one of them. Each round you deal the deck into three piles, face up, and they say which pile their card is in; you gather the piles up — putting theirs on top, in the middle or at the bottom — and deal again. After three rounds you count down to the card. ' + text,
    hints, explain,
    concepts: ['base-three'], tags: ['three piles', 'trick'],
    data: { kind: 'piles', n: 27, rounds: 3, target }
  });
});
deals.push({
  id: 'card-deal-piles-21', title: 'The Twenty-One Card Trick', diff: 2,
  source: 'A traditional card trick, found in conjuring books for centuries.',
  text: 'The old version: twenty-one cards, three piles of seven, three rounds. Make the spectator\'s card end up **11th** — right in the middle.',
  hints: ['Put the named pile in the middle every time.'],
  explain: 'Each round the card moves towards the middle of its pile, and the pile goes in the middle of the deck: after the first round it is somewhere from 8th to 14th, after the second from 10th to 12th, and after the third it can only be 11th.',
  links: ['card-deal-piles-14'],
  concepts: ['base-three'], tags: ['three piles', 'trick'],
  data: { kind: 'piles', n: 21, rounds: 3, target: 11 }
});

// questions
deals.push({
  id: 'card-deal-ask-middle', title: 'Always in the Middle', diff: 2,
  text: 'In the 27-card trick you always put the spectator\'s pile **in the middle** when you gather the piles. After three rounds, which card from the top is theirs — whatever card they chose?',
  hints: ['After a round, the pile in the middle has 9 cards above it.', 'Round by round the card\'s place is 9 × (where its pile went) + its depth in the pile — and the depth is its old place divided by 3.'],
  explain: 'Counting from 0, each round sets one base-3 digit: middle = 1. Three middles make 111 in base 3, which is 9 + 3 + 1 = 13 — the **14th** card counting from 1.',
  links: ['card-deal-piles-14'],
  concepts: ['base-three'], tags: ['three piles'],
  data: { kind: 'ask', answer: { num: 14 }, calc: { t: 'pile', n: 27, choices: [1, 1, 1] }, ask: 'Which place from the top?', traps: [{ match: 13, msg: 'Counted from 0 it is 13 — but from the top it is one more.' }], demo: { type: 'static', cards: ['7H', '2S', 'QD'], down: true } }
});
deals.push({
  id: 'card-deal-ask-21', title: 'Twenty-One, Always the Middle', diff: 2,
  text: 'The 21-card trick: three piles of seven, the spectator\'s pile always gathered in the middle, three rounds. Which card from the top is theirs at the end?',
  hints: ['After the first round the card is somewhere between the 8th and the 14th.'],
  explain: 'The middle pile has 7 cards above it, and the card moves towards the middle of its pile each time: 8th–14th after one round, 10th–12th after two, and then it can only be the **11th**.',
  links: ['card-deal-piles-21'],
  concepts: ['base-three'], tags: ['three piles'],
  data: { kind: 'ask', answer: { num: 11 }, calc: { t: 'pile', n: 21, choices: [1, 1, 1] }, ask: 'Which place from the top?', demo: { type: 'static', cards: ['9C', 'KH', '4S'], down: true } }
});
deals.push({
  id: 'card-deal-ask-fifth', title: 'Which Place Comes Fifth?', diff: 2,
  text: 'A pile of 10 cards is dealt down-under: the top card is dealt, the next goes to the bottom, and so on. The card that comes out **fifth** — which place in the pile did it start in? (1 = the top.)',
  hints: ['The first time through, the odd places come out: 1, 3, 5, 7, 9.'],
  explain: 'Places 1, 3, 5, 7, 9 come out first, so the fifth card dealt started in place **9**.',
  concepts: ['working-backwards'], tags: ['down under'],
  data: { kind: 'ask', answer: { num: 9 }, calc: { t: 'nth', n: 10, rule: { under: 1 }, k: 5 }, ask: 'Place in the pile (1 = top)', demo: { type: 'downunder', n: 10, rule: { under: 1 } } }
});
deals.push({
  id: 'card-deal-ask-last', title: 'The Last Card of the Pack', diff: 3,
  text: 'A whole pack of **52** cards is dealt down-under: one card face up on the table, the next to the bottom of the pack, one on the table, one to the bottom … until one card remains and is dealt. Which place in the pack (1 = the top) did that last card start in?',
  hints: ['Try it with small piles on the table: 2, 3, 4 … 13 cards, and look for a pattern in where the last card starts.', 'When the number of cards is a power of 2 (2, 4, 8, 16, 32), the last card is the bottom card.', 'Beyond a power of 2, each extra card moves the last card two places further down: with 9 cards it starts 2nd, with 10 cards 4th, with 11 cards 6th.'],
  explain: 'If the pile has a power of 2 cards, each round through halves it evenly and the bottom card is dealt last. With 52 = 32 + 20 cards, after 20 cards have been dealt (and 20 put under) 32 remain, and the card at the bottom of those 32 — the one that was just put under — is the last. It started in place 2 × 20 = **40**. This is the Josephus problem in disguise.',
  concepts: ['working-backwards', 'binary'], tags: ['down under', 'josephus'],
  data: { kind: 'ask', answer: { num: 40 }, calc: { t: 'last', n: 52, rule: { under: 1 } }, ask: 'Place in the pack (1 = top)', traps: [{ match: 52, msg: 'The bottom card is last only when the pack is a power of 2.' }, { match: 41, msg: 'That is the answer for the under-down deal, where a card goes under first.' }], demo: { type: 'downunder', n: 8, rule: { under: 1 } } }
});
deals.push({
  id: 'card-deal-ask-last-ud', title: 'Under First, the Last Card', diff: 4,
  text: 'Now the pack of **52** is dealt the other way: first a card goes to the bottom, then one is dealt face up, then one to the bottom … Which place (1 = the top) did the last card dealt start in?',
  hints: ['Experiment with small piles and compare with [[card-deal-ask-last]].', 'With a power of 2, the top card is now the last one out.'],
  explain: 'This is exactly the Josephus problem with every second person counted out: write 52 = 32 + 20; the survivor is 2 × 20 + 1 = **41**. In binary, it is 52 = 110100 with the leading 1 moved to the end: 101001 = 41.',
  links: ['card-deal-ask-last'],
  concepts: ['working-backwards', 'binary'], tags: ['under down', 'josephus'],
  data: { kind: 'ask', answer: { num: 41 }, calc: { t: 'last', n: 52, rule: { under: 1, first: 'under' } }, ask: 'Place in the pack (1 = top)', traps: [{ match: 40, msg: 'That is for the down-under deal.' }], demo: { type: 'downunder', n: 8, rule: { under: 1, first: 'under' } } }
});
deals.push({
  id: 'card-deal-gilbreath', title: 'Gilbreath\'s Shuffle', diff: 2,
  year: 1958,
  source: 'Norman Gilbreath\'s principle (1958), made famous by Martin Gardner.',
  text: 'A packet of 16 cards alternates red, black, red, black. Deal about half of them, one at a time, into a pile on the table — which reverses their order — and then **riffle shuffle** that pile into the rest, as untidily as you like. Now take the cards off the top two at a time. How many of the eight pairs are one red and one black?',
  hints: ['Try it: the buttons below deal, riffle and check the pairs.', 'After dealing, both packets have cards of different colours on top.'],
  explain: 'Dealing reverses the first packet, so the two packets start with cards of different colours on top. Whichever packet the next card falls from, the next two cards to fall are always one of each colour — so **every pair** is mixed, however the riffle goes. Magicians have built many tricks on this surprise.',
  concepts: ['invariant'], tags: ['gilbreath', 'shuffle'],
  data: { kind: 'ask', answer: { choice: 0, choices: ['All eight, every time', 'About four, on average', 'It depends on where you deal to', 'None of them'], vals: [true, 'avg', false, 'none'] }, calc: { t: 'gilbreath', n: 16, period: 2, reverse: true }, demo: { type: 'gilbreath', n: 16, period: 2, reverse: true } }
});
deals.push({
  id: 'card-deal-gilbreath-cut', title: 'Just a Cut?', diff: 3,
  text: 'The same alternating packet of 16 — but this time, instead of dealing half into a pile, you simply **cut** it (lift off the top half as it is) and riffle the two halves together. Are the pairs from the top still always one red and one black?',
  hints: ['Try a few cuts and riffles with the buttons. Watch what happens when you cut off an even number of cards.'],
  explain: 'Not always. A cut does not reverse the top half, so if the two halves happen to start with the same colour on top, two cards of that colour can fall together. The dealing (reversing) in [[card-deal-gilbreath]] is what guarantees the magic — or a cut that happens to leave different colours on top.',
  links: ['card-deal-gilbreath'],
  concepts: ['invariant'], tags: ['gilbreath', 'shuffle'],
  data: { kind: 'ask', answer: { choice: 1, choices: ['Yes, always', 'No, it depends on the cut and the riffle'], vals: [true, false] }, calc: { t: 'gilbreath', n: 16, period: 2, reverse: false }, demo: { type: 'gilbreath', n: 16, period: 2, reverse: false } }
});
deals.push({
  id: 'card-deal-gilbreath-suits', title: 'Four Suits Survive', diff: 3,
  source: 'The general Gilbreath principle.',
  text: 'Now 16 cards repeat the suits in order: ♠ ♥ ♣ ♦, ♠ ♥ ♣ ♦ … Deal about half of them into a pile (reversing them) and riffle the pile into the rest. Take the cards from the top four at a time. How many of the four groups contain one card of each suit?',
  hints: ['Try it with the buttons.', 'It is the same principle as the red–black version, with four colours instead of two.'],
  explain: '**All four**, every time. The general Gilbreath principle: if a packet repeats a pattern of k kinds, and you deal some off (reversing them) and riffle, every run of k cards from the top still holds one of each kind. The riffle can only mix the two packets in a way that keeps each block of k complete.',
  links: ['card-deal-gilbreath'],
  concepts: ['invariant'], tags: ['gilbreath', 'shuffle'],
  data: { kind: 'ask', answer: { choice: 2, choices: ['None', 'Two, on average', 'All four, every time'], vals: ['none', 'avg', true] }, calc: { t: 'gilbreath', n: 16, period: 4, reverse: true }, demo: { type: 'gilbreath', n: 16, period: 4, reverse: true } }
});

emitFile('card-deals.js', {
  id: 'card-deals', engine: 'cards', cat: 'cards', name: 'Deals and shuffles', order: 2,
  blurb: 'Stack the pile so the deal comes out right, play the three-pile trick as the magician, and meet Gilbreath\'s shuffle.',
  origin: { who: 'Conjurers', note: 'Most of these are the working parts of old card tricks: the down-under deal, the spelling trick, the 21- and 27-card tricks and Gilbreath\'s principle of 1958.' },
  concepts: ['working-backwards', 'base-three']
}, order(deals), 'Cabinet.concepts(' + JSON.stringify([{
  id: 'base-three', name: 'Counting in threes', see: ['ternary', 'binary'],
  text: 'Write numbers with only the digits 0, 1 and 2 and each place is worth three times the one to its right: 1, 3, 9, 27… So 13 is 111 (9 + 3 + 1) and 26 is 222. The 27-card trick is base three at work: each deal into three piles shaves one base-3 digit off a card\'s old place, and where you put its pile writes in a new one — three deals, three digits, any place from 1 to 27. (Balanced ternary, with digits −1, 0 and 1, is its cousin from the world of weights.)'
}]) + ');');
