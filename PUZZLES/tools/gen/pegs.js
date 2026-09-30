/* The Puzzle Cabinet · tools/gen/pegs.js
 *
 *   node tools/gen/pegs.js          writes data/peg-solitaire.js
 *
 * The classic games (full boards and the traditional figures on the English
 * board) are solved here by the engine's search; then many more puzzles are
 * made with the engine's own generator — played backwards from the finished
 * position, so each is solvable by construction — with fixed seeds, graded by
 * length and by how rarely random play wins. Every puzzle passes verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/pegs.js'));
const P = C.pegsLogic, BO = C.pegsBoards, E = C.engines.pegs;

function full(bk, vacName) {
  const bd = BO[bk], B = P.parse({ geo: bd.geo, board: bd.rows });
  const v = B.byName.get(vacName);
  if (v == null) throw new Error('no hole ' + vacName);
  let i = 0;
  return bd.rows.map((row) => row.replace(/\./g, () => (i++ === v ? '.' : 'o')));
}
function figure(bk, names) {
  const bd = BO[bk], B = P.parse({ geo: bd.geo, board: bd.rows });
  const on = new Set(names.map((n) => { const i = B.byName.get(n); if (i == null) throw new Error('no hole ' + n); return i; }));
  let i = 0;
  return bd.rows.map((row) => row.replace(/\./g, () => (on.has(i++) ? 'o' : '.')));
}
const cells = (list) => list.map(([r, c]) => String.fromCharCode(97 + c) + (r + 1));

/* ---------- the classics ---------- */
const CL = [
  { id: 'peg-cross', title: 'The Cross', diff: 1, board: 'english', start: figure('english', cells([[1, 3], [2, 2], [2, 3], [2, 4], [3, 3], [4, 3]])), goal: { one: 'd4' },
    text: 'Six pegs make a small cross in the middle of the English board. Jump until one peg is left, and finish in the centre hole, d4.',
    hints: ['Only one peg can make the first useful jump into the empty space below the cross\'s arms… look at the arms.', 'Clear the two arms first, then come down the middle.'],
    explain: 'Five jumps, one for every peg that goes. A traditional warm-up: most of the famous figures on the English board are to be cleared to the centre, and this is the smallest.' },
  { id: 'peg-plus', title: 'The Plus', diff: 1, board: 'english', start: figure('english', cells([[1, 3], [2, 3], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [4, 3], [5, 3]])), goal: { one: 'd4' },
    text: 'Nine pegs make a plus sign: a row of five across the middle and a column of five down it. Clear it down to one peg in the centre.',
    hints: ['The tips of the plus have to be jumped inwards — or jump outwards over the next peg.', 'Work on one arm at a time, turning the plus into a smaller cross.'],
    explain: 'Eight jumps. Clearing an arm often means jumping out beyond it and then back in again — a little dance that comes up all over peg solitaire.' },
  { id: 'peg-fireplace', title: 'The Fireplace', diff: 2, board: 'english', start: figure('english', cells([[0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 2], [2, 3], [2, 4], [3, 2], [3, 4]])), goal: { one: 'd4' },
    text: 'Eleven pegs fill the top arm of the English board and come down on both sides of the empty centre, like a chimney over a fireplace. Finish with one peg in the fireplace — the centre hole.',
    hints: ['The two pegs beside the centre are the hearth: leave them until late.', 'Clear the chimney from the top, jumping pegs downwards and sideways.'] },
  { id: 'peg-triangle', title: 'The Triangle', diff: 2, board: 'tri15', start: full('tri15', '1'), goal: { one: true },
    source: 'The fifteen-hole triangle, a favourite wooden table game.',
    text: 'The triangular board of fifteen holes, full except for the hole at the top. Jump until only one peg is left, anywhere.',
    hints: ['Start with a jump into the top hole — there are only two, and they are mirror images.', 'Keep the pegs together; a peg left alone in a corner can never be taken.'],
    explain: 'Thirteen jumps. Leave one peg and the board calls you a genius, by tradition; leave four or more and it is much less polite.' },
  { id: 'peg-pyramid', title: 'The Pyramid', diff: 2, board: 'english', start: figure('english', cells([[1, 3], [2, 2], [2, 3], [2, 4], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6]])), goal: { one: 'd4' },
    text: 'Sixteen pegs make a pyramid: one, three, five, seven, with its point at the top. Clear it to a single peg in the centre.',
    hints: ['The bottom row of seven reaches into the side arms; clear the ends first by jumping upwards.'] },
  { id: 'peg-triangle-home', title: 'Back to the Top', diff: 3, board: 'tri15', start: full('tri15', '1'), goal: { one: '1' },
    text: 'The fifteen-hole triangle again, empty at the top. This time the last peg must end up **in that same top hole**.',
    hints: ['From this start the last peg can only ever finish in hole 1, 7, 10 or 13.', 'Save a peg on the side of the triangle to make the last jump up into hole 1.'],
    explain: 'From a start with the top hole empty the last peg can finish in only four holes — 1, 7, 10 and 13 — a consequence of colouring the holes in three colours and watching how every jump changes the counts.',
    concepts: ['invariant', 'coloring-argument'] },
  { id: 'peg-five', title: 'Five by Five', diff: 3, board: 'sq5', start: full('sq5', 'c1'), goal: { one: true },
    text: 'A square board of twenty-five holes, full except the middle hole of the top row. Jump down to one peg.',
    hints: ['Corners are dangerous: a corner peg can only leave by jumping out itself.', 'Clear the corners early.'] },
  { id: 'peg-arrow', title: 'The Arrow', diff: 3, board: 'english', start: figure('english', cells([[0, 3], [1, 2], [1, 3], [1, 4], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [3, 3], [4, 3], [5, 2], [5, 3], [5, 4], [6, 2], [6, 3], [6, 4]])), goal: { one: 'd4' },
    text: 'Seventeen pegs make an arrow pointing up the English board, with feathers at the bottom. Finish with one peg in the centre.',
    hints: ['The feathers at the bottom are furthest from home: bring them up the shaft.'] },
  { id: 'peg-band', title: 'The Middle Band', diff: 3, board: 'english', start: figure('english', cells([[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 6], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6]])), goal: { one: 'd4' },
    text: 'Twenty pegs fill the three middle rows of the English board, except the centre. The top and bottom arms are empty. Finish in the centre.',
    hints: ['The empty arms above and below are room to jump into.', 'Clear the left and right ends of the band first.'] },
  { id: 'peg-triangle-21', title: 'Twenty-One Holes', diff: 3, board: 'tri21', start: full('tri21', '1'), goal: { one: true },
    text: 'A bigger triangle, six holes on a side, full except the top. Jump down to one peg.',
    hints: ['The same rules of thumb as on the small triangle: do not strand pegs in the corners.'] },
  { id: 'peg-diamond', title: 'The Diamond', diff: 3, board: 'english', start: figure('english', cells([[0, 3], [1, 2], [1, 3], [1, 4], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 6], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [5, 2], [5, 3], [5, 4], [6, 3]])), goal: { one: 'd4' },
    text: 'Twenty-four pegs make a great diamond, point to point across the English board, with the centre empty. Finish with one peg in the centre.',
    hints: ['The four points of the diamond are the loneliest pegs: deal with them early.'] },
  { id: 'peg-triangle-28', title: 'Twenty-Eight Holes', diff: 4, board: 'tri28', start: full('tri28', '2'), goal: { one: true },
    text: 'A triangle seven holes on a side — twenty-eight holes, all full except hole 2, just below the top. Jump down to one peg.',
    hints: ['Clear the top of the triangle first, while there is room to manoeuvre below.'] },
  { id: 'peg-six', title: 'Six by Six', diff: 4, board: 'sq6', start: full('sq6', 'b1'), goal: { one: true },
    text: 'A square board of thirty-six holes, full except b1, second from the left in the top row. Jump down to one peg.',
    hints: ['Four corners, four pegs that can only leave by jumping out: plan for each of them.'] },
  { id: 'peg-central', title: 'The Central Game', diff: 4, board: 'english', start: full('english', 'd4'), goal: { one: 'd4' },
    source: 'The standard game on the English board.',
    text: 'The English board of thirty-three holes, full except the centre. Jump until one peg is left — **in the centre**. Thirty-one jumps.',
    hints: ['Open up one of the arms first: jump a peg into the centre, then clear the arm you took it from.', 'Think in packages: three pegs in an L-shape next to an empty hole can often be cleared together, leaving the rest of the board as it was.', 'Leave the four corner-arm tips until they can be jumped inwards; save the centre area for the end.'],
    explain: 'Thirty-one jumps, of course — one for every peg that goes. Counting a chain of jumps by the same peg as one move, the central game can be done in eighteen moves: Ernest Bergholt found such a solution in 1912, and John Beasley proved in 1964 that no shorter one exists.',
    tags: ['classic'] },
  { id: 'peg-edge-in', title: 'From the Edge to the Middle', diff: 4, board: 'english', start: full('english', 'd1'), goal: { one: 'd4' },
    text: 'The English board, full except d1, the middle hole at the very top. Finish with the last peg **in the centre**.',
    hints: ['Your first jump can only be from d3 up into d1 — the board is symmetrical, and so is the start.'] },
  { id: 'peg-c1-home', title: 'Back to c1', diff: 5, board: 'english', start: full('english', 'c1'), goal: { one: 'c1' },
    text: 'The English board, full except c1, the top-left hole of the top arm. Finish with the last peg **back in c1**.',
    hints: ['Starting and finishing in the same hole is always possible on this board when the hole is in the right family: c1 is one of them.'],
    explain: 'On the English board every one-peg game from a single empty hole can finish in only a handful of holes, and for several starting holes the start itself is one of them — these are the "complement" problems.',
    concepts: ['invariant'] },
  { id: 'peg-c3-home', title: 'Back to c3', diff: 5, board: 'english', start: full('english', 'c3'), goal: { one: 'c3' },
    text: 'The English board, full except c3 — one step diagonally from the centre. Finish with the last peg **back in c3**.',
    links: ['peg-c1-home'] },
  { id: 'peg-french-b4', title: 'The French Board', diff: 5, board: 'french', start: full('french', 'b4'), goal: { one: 'c1' },
    source: 'The thirty-seven-hole board of French solitaire.',
    text: 'The French board has four more holes than the English one, filling in the corners. Here it is full except b4. Finish with one peg in **c1**.',
    hints: ['On the French board, starting from the centre can never leave one peg — the extra corner holes see to that. That is why this game starts elsewhere.', 'The four extra corner holes (b2, f2, b6, f6) must be cleared by jumping pegs out of them sideways.'],
    explain: 'The central game, so natural on the English board, is impossible here: colour the holes in three colours along the diagonals, and the colours of the pegs left on the board keep a pattern no jump can break — for a one-peg finish from the centre on this board, the pattern is wrong.',
    concepts: ['invariant', 'coloring-argument'], tags: ['classic'] },
  { id: 'peg-french-c4', title: 'Across the Middle', diff: 5, board: 'french', start: full('french', 'c4'), goal: { one: 'e4' },
    text: 'The French board, full except c4, just left of the centre. Finish with one peg in **e4**, just right of it.',
    links: ['peg-french-b4'] }
];

/* ---------- build ---------- */
const out = [];
const problems = [];
CL.forEach((c, k) => {
  const bd = BO[c.board];
  const d = { geo: bd.geo, board: c.start };
  if (bd.round) d.round = true;
  d.goal = c.goal;
  const B = P.parse(d);
  let r = null;
  for (const seed of [1000 + k, 11, 3, 5, 7, 13, 17]) {
    r = P.search(B, P.startOf(d, B), P.goalOf(d, B), { limit: 3e6, rng: C.rng(seed) });
    if (r.path || r.none) break;
  }
  if (!r.path) { problems.push(c.id + ': ' + (r.none ? 'no solution' : 'search gave up')); return; }
  d.sol = [].concat.apply([], r.path);
  const p = { id: c.id, title: c.title, diff: c.diff };
  ['year', 'source'].forEach((f) => { if (c[f]) p[f] = c[f]; });
  p.text = c.text;
  ['hints', 'explain', 'links', 'concepts', 'tags'].forEach((f) => { if (c[f]) p[f] = c[f]; });
  p.data = d;
  out.push(p);
});

// the made puzzles: [level, how many]
const PLAN = [[1, 24], [2, 30], [3, 30], [4, 26], [5, 20]];
const seen = new Set(out.map((p) => p.data.board.join('/') + JSON.stringify(p.data.goal)));
const made = [];
PLAN.forEach(([level, want]) => {
  const rng = C.rng(20260930 + level * 7919);
  const perBoard = {};
  let got = 0, guard = 0;
  while (got < want && guard++ < 5000) {
    const p = C.pegsMake(rng, level, { tries: 300 });
    if (!p || p.diff !== level) continue;
    const k = p.data.board.join('/') + JSON.stringify(p.data.goal);
    if (seen.has(k)) continue;
    // keep the boards mixed
    if ((perBoard[p.board] || 0) >= Math.ceil(want / 3)) continue;
    seen.add(k);
    perBoard[p.board] = (perBoard[p.board] || 0) + 1;
    made.push(p);
    got++;
  }
  if (got < want) problems.push('level ' + level + ': only ' + got + ' of ' + want);
});
const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const titles = new Set(out.map((p) => p.title));
made.sort((a, b) => a.diff - b.diff || a.len - b.len || b.luck - a.luck);
made.forEach((m, i) => {
  const g = m.data.goal, pegs = m.len + (g.pegs ? g.pegs.length : 1);
  let title = BO[m.board].name + ': ' + (WORD[pegs] || pegs) + ' to ' + (g.one === true ? 'one' : g.one ? g.one : WORD[g.pegs.length]);
  if (titles.has(title)) { let n = 2; while (titles.has(title + ' (' + n + ')')) n++; title += ' (' + n + ')'; }
  titles.add(title);
  const p = { id: 'peg-' + String(i + 1).padStart(3, '0'), title, diff: m.diff, text: m.text, data: m.data };
  out.push(p);
});

// verify everything
out.forEach((p) => { const v = E.verify(p); if (!v.ok) problems.push(p.id + ': ' + v.err); });
// easiest first: classics slot in among the made puzzles of their level
const cls = out.filter((p) => !/^peg-\d/.test(p.id)), gen = out.filter((p) => /^peg-\d/.test(p.id));
const ordered = [];
for (let lv = 1; lv <= 5; lv++) {
  ordered.push(...cls.filter((p) => p.diff === lv));
  ordered.push(...gen.filter((p) => p.diff === lv));
}
const lines = [];
lines.push('/* The Puzzle Cabinet · data/peg-solitaire.js — made by tools/gen/pegs.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'peg-solitaire', engine: 'pegs', cat: 'coins', name: 'Peg solitaire', order: 2,");
lines.push("  blurb: 'Jump a peg over its neighbour and take the jumped peg away, until only one is left — in the right hole.',");
lines.push('  origin: ' + JSON.stringify({ year: 1697, who: 'The court of Louis XIV', note: 'Peg solitaire was the fashion at the French court at the end of the seventeenth century: an engraving of 1697 shows Anne de Rohan-Chabot, Princesse de Soubise, at a solitaire board. The French board has 37 holes, the English board 33. Many of the positions here were made by playing backwards from the finish, so every one of them can be solved.' }) + ',');
lines.push("  concepts: ['working-backwards', 'invariant', 'state-space']");
lines.push('}, [');
ordered.forEach((p, i) => {
  const keys = Object.keys(p);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(', ') + ' }' + (i < ordered.length - 1 ? ',' : ''));
});
lines.push(']);');
lines.push('Cabinet.history([');
lines.push("  { year: 1697, title: 'Solitaire at Versailles', text: 'An engraving of 1697 shows the Princesse de Soubise at a peg solitaire board — the earliest firm picture of the game, then the fashion at the court of Louis XIV.', links: ['peg-solitaire', 'peg-french-b4'] }");
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/peg-solitaire.js'), lines.join('\n') + '\n');
console.log('peg-solitaire: ' + ordered.length + ' puzzles (' + cls.length + ' classics); by difficulty ' + [1, 2, 3, 4, 5].map((k) => ordered.filter((p) => p.diff === k).length).join('/') + '; ' + Math.round(lines.join('\n').length / 1024) + ' KB');
if (problems.length) { console.log('PROBLEMS:\n  ' + problems.join('\n  ')); process.exitCode = 1; }
