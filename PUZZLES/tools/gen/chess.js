/* The Puzzle Cabinet · tools/gen/chess.js
 *
 *   node tools/gen/chess.js                 writes data/mate-in-one.js, data/mate-in-two.js,
 *                                           data/helpmates.js and data/chess-endings.js
 *   node tools/gen/chess.js --only m1,m2    only some of them (m1, m2, help, end)
 *
 * Mate problems: famous game finishes (replayed move by move from the game
 * score, so the position is certain) and problems found by search from random
 * sparse positions — kept only when the key is unique, every white man takes
 * part, and ranked by elegance (quiet keys, sacrifices, flight-giving keys and
 * zugzwangs score higher; checks and captures lower). Special rules get their
 * own searches: mate by castling, by en passant, by under-promotion.
 * Helpmates: random positions with exactly one solution and no shorter one.
 * Endgames: king and queen, rook or two bishops against the king, graded by the
 * fewest moves to mate from the engine's endgame tables; and a few lost games
 * to save (stalemate tricks, the only defence).
 * Everything is seeded, so re-running writes the same files.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/chess-rules.js'));
require(path.join(ROOT, 'engines/chessmate.js'));
const Ch = C.Chess, M = C.chessmate, eng = C.engines.chessmate;

const args = process.argv.slice(2);
const onlyArg = args.indexOf('--only') >= 0 ? args[args.indexOf('--only') + 1].split(',') : null;
const want = (k) => !onlyArg || onlyArg.includes(k);
const T0 = Date.now();
const log = (...a) => console.log('[' + ((Date.now() - T0) / 1000).toFixed(0) + 's]', ...a);

function write(fid, meta, list, extras) {
  list.forEach((p) => {
    const r = eng.verify(p);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
  });
  const ids = new Set();
  list.forEach((p) => { if (ids.has(p.id)) throw new Error('duplicate id ' + p.id); ids.add(p.id); });
  const titles = new Set();
  list.forEach((p) => { if (titles.has(p.title)) throw new Error('duplicate title ' + p.title); titles.add(p.title); });
  const lines = list.map((p) => '  ' + JSON.stringify(p));
  let out = '/* The Puzzle Cabinet · data/' + fid + '.js — made by tools/gen/chess.js */\n';
  if (extras) out += extras + '\n';
  out += 'Cabinet.family(' + JSON.stringify(meta, null, 2) + ', [\n' + lines.join(',\n') + '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data', fid + '.js'), out);
  const spread = [1, 2, 3, 4, 5].map((d) => list.filter((p) => p.diff === d).length);
  log('wrote data/' + fid + '.js:', list.length, 'puzzles, by difficulty', spread.join('/'), '(' + Math.round(out.length / 1024) + ' KB)');
}

// a game score replayed from the start: the position, the last move and the next move number
function replay(movetext) {
  const pos = Ch.fromFEN(Ch.START);
  const toks = movetext.split(/\s+/).map((x) => x.replace(/^\d+\.+/, '')).filter(Boolean);
  let last = null;
  for (const s of toks) {
    const m = pos.moveFromSan(s);
    if (!m) throw new Error('illegal move ' + s + ' in ' + movetext);
    last = Ch.uci(m);
    pos.make(m);
  }
  return { pos, fen: pos.fen(), last, no: pos.full };
}
function ucisOf(pos, sans) {
  const q = pos.clone(), out = [];
  for (const s of sans) { const m = q.moveFromSan(s); if (!m) throw new Error('bad line move ' + s); out.push(Ch.uci(m)); q.make(m); }
  return out;
}

const HINT1 = {
  back: 'Look at the squares in front of the king. Who is standing on them?',
  smother: 'The king is hemmed in by its own men. Which piece can jump over a wall?',
  double: 'Two checks at once cannot both be blocked.',
  disc: 'Sometimes the piece that moves is not the one that gives check.',
  castle: 'Neither the king nor the rook has moved yet…',
  ep: 'Black\'s last move was a pawn\'s double step — and that opens a special capture for one move only.',
  under: 'A queen is not always the best thing to become.',
  promo: 'A pawn is one step from the far rank.',
  Q: 'Count the king\'s flight squares, then find the one move that covers them all — with check.',
  R: 'Count the king\'s flight squares, then find the one move that covers them all — with check.',
  B: 'Look along the diagonals.',
  N: 'Only one piece can jump over others.',
  P: 'Even the humblest piece can give mate.',
  K: 'Sometimes the piece that moves is not the one that gives check.'
};
const HINT2 = {
  quiet: 'The key gives no check and takes nothing: it prepares.',
  zugzwang: 'White threatens nothing — but Black has to move, and every move gives something away.',
  sac: 'Be generous: the key puts a piece where it can be taken.',
  flight: 'Surprisingly, the key gives the king a new square to run to.',
  check: 'Start with a check — but which one?',
  capture: 'Start by taking something.',
  three: 'The first move prepares; the mate comes on the third.'
};
const TAGS = { back: 'back-rank', smother: 'smothered mate', double: 'double check', disc: 'discovered check', castle: 'castling', ep: 'en passant', under: 'under-promotion', promo: 'promotion', quiet: 'quiet key', zugzwang: 'zugzwang', sac: 'sacrifice', flight: 'flight-giving key', check: 'checking key', capture: 'capture key', three: 'mate in three' };

function mateEntry(info, level, used, id) {
  const p = M.mateProblem(info, level, null, used);
  const theme = M.themeOf(info);
  const out = { id, title: p.title, diff: level, text: p.text };
  const h = info.n === 1 ? HINT1[theme] : HINT2[theme];
  if (h) out.hints = [h];
  out.explain = M.explainMate(info.fen, info.n, info.keyUci);
  if (theme === 'zugzwang') out.concepts = ['zugzwang'];
  out.tags = ['chess', TAGS[theme] || NAMES_TAG[theme] || 'mate'].filter(Boolean);
  out.par = info.n;
  out.data = p.data;
  return out;
}
const NAMES_TAG = { Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn', K: 'king' };

// search random positions for mates until every level has `target` of them; bins[level] = [info]
// (counts, not seconds, so that the same seed always gives the same files)
function mateBins(n, target, seed, levels, keep) {
  const rng = C.rng(seed);
  const bins = {};
  levels.forEach((l) => { bins[l] = []; });
  let k = 0, seen = new Set();
  while (levels.some((l) => bins[l].length < target) && k < 5e6) {
    const lv = levels[k++ % levels.length];
    const info = M.mateCandidate(rng, n, M.setupFor(n, n === 3 ? 5 : lv), true);
    if (!info || info.idle > 0 || seen.has(info.fen)) continue;
    seen.add(info.fen);
    const l = M.levelOf(info);
    if (!bins[l] || !keep(info, l)) continue;
    bins[l].push(info);
  }
  return bins;
}
// the best of a bin by theme quotas ({ theme: count }), topped up from the rest; easiest first
function chooseQuota(list, quota, count) {
  list.sort((a, b) => b.e - a.e || a.h - b.h);
  const out = [], have = {}, keys = {};
  const ok = (x) => (keys[x.san.replace(/[+#]/, '')] || 0) < 2 && !out.includes(x);
  const take = (x) => { out.push(x); const t = M.themeOf(x); have[t] = (have[t] || 0) + 1; const k = x.san.replace(/[+#]/, ''); keys[k] = (keys[k] || 0) + 1; };
  for (const t in quota) for (const x of list) { if ((have[t] || 0) >= quota[t]) break; if (M.themeOf(x) === t && ok(x)) take(x); }
  for (const x of list) { if (out.length >= count) break; const t = M.themeOf(x); if (ok(x) && (have[t] || 0) < Math.max(3, (quota[t] || 0) + 2)) take(x); }
  return out.slice(0, count).sort((a, b) => a.h - b.h);
}
// the best of a bin, with variety: at most `cap` of one theme and two of one key move
function choose(list, count, cap, prefer) {
  list.sort((a, b) => (prefer ? prefer(b) - prefer(a) : 0) || b.e - a.e || a.h - b.h);
  const out = [], themes = {}, keys = {};
  for (const x of list) {
    const t = M.themeOf(x), ks = x.san.replace(/[+#]/, '');
    if ((themes[t] || 0) >= cap || (keys[ks] || 0) >= 2) continue;
    out.push(x);
    themes[t] = (themes[t] || 0) + 1;
    keys[ks] = (keys[ks] || 0) + 1;
    if (out.length >= count) break;
  }
  return out.sort((a, b) => a.h - b.h);
}

/* ---------- special mates in one ---------- */

function special(kind, seed, seconds) {
  const rng = C.rng(seed), t0 = Date.now();
  const cheb = (a, b) => Math.max(Math.abs((a >> 3) - (b >> 3)), Math.abs((a & 7) - (b & 7)));
  while (Date.now() - t0 < seconds * 1000) {
    const b = new Array(64).fill('');
    let castle = '-', ep = '-', last = null, bk;
    const free = (s) => s >= 0 && s < 64 && !b[s];
    const near = (c, d) => { for (let t = 0; t < 30; t++) { const r = (c >> 3) + rng.int(2 * d + 1) - d, f = (c & 7) + rng.int(2 * d + 1) - d; if (r >= 0 && r < 8 && f >= 0 && f < 8 && free(r * 8 + f)) return r * 8 + f; } return -1; };
    const put = (ch, s) => {
      if (ch === 'Q' && b.includes('Q')) ch = 'R';
      if (s >= 0 && free(s) && !(ch.toLowerCase() === 'p' && ((s >> 3) === 0 || (s >> 3) === 7))) { b[s] = ch; return true; }
      return false;
    };
    if (kind === 'castle') {
      const long = rng() < 0.5;
      b[4] = 'K'; b[long ? 0 : 7] = 'R';
      castle = long ? 'Q' : 'K';
      bk = (1 + rng.int(4)) * 8 + (long ? 3 : 5);
      if (!free(bk) || cheb(bk, 4) < 2) continue;
      b[bk] = 'k';
      for (let i = rng.range(1, 3); i > 0; i--) put(rng.pick('QRBBNNP'.split('')), near(bk, 3));
      for (let i = rng.range(1, 3); i > 0; i--) put(rng.pick('pppbnr'.split('')), near(bk, 1));
    } else if (kind === 'ep') {
      const f = rng.int(8), side = rng() < 0.5 ? -1 : 1;
      if (f + side < 0 || f + side > 7) continue;
      b[32 + f] = 'p'; b[32 + f + side] = 'P';
      ep = 'abcdefgh'[f] + '6';
      last = 'abcdefgh'[f] + '7' + 'abcdefgh'[f] + '5';
      bk = near(32 + f, 2);
      if (bk < 0) continue;
      b[bk] = 'k';
      let wk = -1;
      for (let t = 0; t < 30 && wk < 0; t++) { const s = rng.int(64); if (free(s) && cheb(s, bk) >= 2 && s !== 40 + f && s !== 48 + f) wk = s; }
      if (wk < 0) continue;
      b[wk] = 'K';
      // the pawn on f7 must not have been giving check before its double step
      if (cheb(wk, 48 + f) === 1 && (wk >> 3) === 5) continue;
      for (let i = rng.range(1, 3); i > 0; i--) put(rng.pick('QRBNNP'.split('')), near(bk, 3));
      for (let i = rng.range(1, 3); i > 0; i--) put(rng.pick('ppbnr'.split('')), near(bk, 1));
      if (b[40 + f] || b[48 + f]) continue;
    } else {
      const f = rng.int(8);
      b[48 + f] = 'P';
      bk = near(56 + f, 2);
      if (bk < 0) continue;
      b[bk] = 'k';
      let wk = -1;
      for (let t = 0; t < 30 && wk < 0; t++) { const s = rng.int(48); if (free(s) && cheb(s, bk) >= 2) wk = s; }
      if (wk < 0) continue;
      b[wk] = 'K';
      for (let i = rng.range(0, 2); i > 0; i--) put(rng.pick('RBNN'.split('')), near(bk, 3));
      for (let i = rng.range(1, 4); i > 0; i--) put(rng.pick('ppbnrr'.split('')), near(bk, 2));
    }
    if (kind !== 'ep' && !b.includes('K')) continue;
    let pos;
    try { pos = Ch.fromFEN(M.fenFrom(b, 1, castle, ep)); } catch (e) { continue; }
    if (pos.problems() || pos.inCheck() || !pos.hasLegal()) continue;
    const S = new Ch.Solver(pos, { limit: 100000 });
    let ks;
    try { ks = S.keys(1, 2); } catch (e) { continue; }
    if (ks.length !== 1) continue;
    const m = ks[0];
    if (kind === 'castle' && !(m.flags & Ch.F_CASTLE)) continue;
    if (kind === 'ep' && !(m.flags & Ch.F_EP)) continue;
    if (kind === 'under' && !(m.promo && Math.abs(m.promo) !== Ch.QUEEN)) continue;
    const fen = pos.fen();
    const info = M.mateInfo(fen, 1);
    info.fen = fen;
    info.idle = M.idlePieces(fen, 1, info.keyUci);
    if (info.idle > 0) continue;
    info.h = M.hardness(info);
    info.e = M.elegance(info);
    info.last = last;
    return info;
  }
  return null;
}

/* ---------- the families ---------- */

const CONCEPTS = 'Cabinet.concepts([\n  { id: \'zugzwang\', name: \'Zugzwang\', see: [\'working-backwards\'],\n    text: \'German for "compulsion to move". In chess you may not pass, and sometimes that is the whole trouble: every move the side to move could make spoils something — a guard is lifted, a line is opened, a square is given up. A problem whose key threatens nothing at all, and wins only because the other side must move, is built on zugzwang. The same idea decides many endgames and the games on the Games to Win shelf.\' }\n]);';
const HISTORY = 'Cabinet.history([\n  { year: 1851, title: \'The Immortal Game\', text: \'In London, Adolf Anderssen gives away both rooks, a bishop and his queen and mates Lionel Kieseritzky with three minor pieces — a casual game remembered as "the Immortal Game".\', links: [\'m2-immortal\'] },\n  { year: 1858, title: \'Morphy at the opera\', text: \'In a box at the Paris Opera, Paul Morphy beats the Duke of Brunswick and Count Isouard in seventeen moves, finishing with a queen sacrifice and mate on the back rank.\', links: [\'m2-opera\'] }\n]);';

function mateInOne() {
  const used = new Set();
  const list = [];
  // two classics from the very start of the game
  const sch = replay('1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6');
  used.add('Scholar\'s Mate');
  list.push({
    id: 'm1-scholar', title: 'Scholar\'s Mate', diff: 1,
    text: 'After 1. e4 e5 2. Bc4 Nc6 3. Qh5, Black has just defended the e5 pawn with 3… Nf6?? — and forgotten something. White to play and mate in one.',
    hints: ['The queen and the bishop both aim at the same square next to the black king.'],
    explain: '**4. Qxf7#** — the queen takes on f7, the one square next to the king that only the king itself defends. The bishop on c4 guards the queen, so the king cannot take it, and every flight square is covered. The oldest trap for beginners there is, and the reason experienced players answer 3. Qh5 with 3… g6 or 3… Qe7.',
    source: 'A traditional opening trap, known as Scholar\'s Mate.',
    tags: ['chess', 'classic', 'opening trap'], par: 1,
    data: { kind: 'mate', fen: sch.fen, n: 1, key: ucisOf(sch.pos, ['Qxf7#'])[0], unique: true, last: sch.last, no: sch.no }
  });
  const fool = replay('1.f3 e5 2.g4');
  used.add('Fool\'s Mate');
  const foolP = {
    id: 'm1-fool', title: 'Fool\'s Mate', diff: 1,
    text: 'White has opened 1. f3 e5 2. g4?? — the two worst moves on the board. Black to play and mate in one: the quickest possible checkmate in chess.',
    hints: ['White\'s king has lost the pawns that shielded it on the diagonal.'],
    explain: '**2… Qh4#** — the queen checks along the diagonal e1–h4 that White\'s pawn moves have opened. Nothing can block on f2 or g3, the king has no free square, and nothing can take the queen. No game can end sooner: this is the shortest checkmate there is.',
    source: 'Traditional: Fool\'s Mate, the shortest possible game of chess.',
    tags: ['chess', 'classic', 'opening trap'], par: 1,
    data: { kind: 'mate', fen: fool.fen, n: 1, key: ucisOf(fool.pos, ['Qh4#'])[0], unique: true, last: fool.last, no: fool.no }
  };
  // generated, by level
  log('mate in one: searching…');
  const bins = mateBins(1, 2500, 101, [1, 2, 3, 4, 5], () => true);
  log('mate in one pool:', [1, 2, 3, 4, 5].map((l) => bins[l].length).join('/'));
  const counts = { 1: 17, 2: 17, 3: 17, 4: 15, 5: 12 };
  const quotas = {
    1: { Q: 5, R: 4, back: 5, N: 1, B: 1, P: 1 },
    2: { Q: 3, R: 3, back: 3, N: 3, B: 2, P: 1, smother: 1, promo: 1 },
    3: { Q: 2, R: 2, back: 2, N: 3, B: 3, P: 1, disc: 2, double: 2 },
    4: { Q: 2, R: 2, back: 1, N: 2, B: 2, disc: 3, double: 2 },
    5: { Q: 1, R: 1, N: 2, B: 2, disc: 2, double: 2 }
  };
  const specials = [['castle', 5], ['ep', 5], ['under', 4]].map(([k, lv], i) => {
    const info = special(k, 500 + i, 120);
    log('special', k, info ? info.san + ' ' + info.fen : 'NOT FOUND');
    return info ? [info, lv] : null;
  }).filter(Boolean);
  let idn = 0;
  for (let lv = 1; lv <= 5; lv++) {
    const pick = chooseQuota(bins[lv], quotas[lv], counts[lv] - specials.filter((s) => s[1] === lv).length);
    const here = pick.map((x) => [x, lv]).concat(specials.filter((s) => s[1] === lv));
    here.forEach(([info]) => {
      const e = mateEntry(info, lv, used, 'm1-' + String(++idn).padStart(3, '0'));
      if (info.last) { e.data.last = info.last; e.text += ' Black\'s last move was the pawn\'s double step ' + info.last.slice(0, 2) + '–' + info.last.slice(2) + '.'; }
      list.push(e);
      if (lv === 1 && list.length === 5) list.push(foolP);
    });
  }
  if (!list.includes(foolP)) list.splice(4, 0, foolP);
  write('mate-in-one', {
    id: 'mate-in-one', engine: 'chessmate', cat: 'games', name: 'Mate in one', order: 10,
    blurb: 'One move and the king is caught. Find it — among the checks that only look good. From Scholar\'s Mate to mates by castling and en passant.',
    origin: { who: 'Chess problemists of every age', note: 'Composed chess positions — the Arabic *mansūbāt* — were collected more than a thousand years ago. Most of these are new: found by the Cabinet\'s own search from random positions and kept only when exactly one move mates.' },
    concepts: ['state-space']
  }, list);
}

function mateInTwo() {
  const used = new Set(['The Opera Box', 'Légal\'s Trap', 'The Immortal Game', 'The Evergreen']);
  const list = [];
  // classics
  const legal = replay('1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 Bxd1');
  const legalP = {
    id: 'm2-legal', title: 'Légal\'s Trap', diff: 2,
    text: 'Black has just taken White\'s queen: 5… Bxd1. It was bait. White to play and mate in two.',
    hints: ['The weakest square in Black\'s camp is f7.', 'After the king steps out, a knight finishes the job.'],
    explain: '**6. Bxf7+ Ke7 7. Nd5#** — the bishop drives the king out, and the knight on d5 mates, with the knight on e5 and the bishop covering every other square. Black is a whole queen up, and it does not help at all. The trap is named after the 18th-century French player Legall de Kermeur.',
    source: 'The traditional trap known as Légal\'s Mate (18th century).',
    tags: ['chess', 'classic', 'sacrifice'], par: 2,
    data: { kind: 'mate', fen: legal.fen, n: 2, key: ucisOf(legal.pos, ['Bxf7+'])[0], unique: true, line: ucisOf(legal.pos, ['Bxf7+', 'Ke7', 'Nd5#']), last: legal.last, no: legal.no }
  };
  const opera = replay('1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7');
  const operaP = {
    id: 'm2-opera', title: 'The Opera Box', diff: 3, year: 1858,
    text: 'Paris, 1858: Paul Morphy (White) against the Duke of Brunswick and Count Isouard, played in a box at the Opera. White has given up material freely to open the lines. White to play and mate in two.',
    hints: ['Black\'s pieces are tied up on the d-file. What if the knight had to leave d7?', 'The key is a queen sacrifice with check.'],
    explain: '**16. Qb8+!! Nxb8 17. Rd8#** — the queen offers herself so that the knight must leave d7, and the rook runs down the open file to mate on the back rank, guarded by the bishop on g5. A game that has been shown to beginners ever since as the model of quick development and open lines.',
    source: 'Morphy v. Duke Karl of Brunswick and Count Isouard, Paris 1858 (the "Opera Game").',
    tags: ['chess', 'classic', 'sacrifice', 'Morphy'], par: 2,
    data: { kind: 'mate', fen: opera.fen, n: 2, key: ucisOf(opera.pos, ['Qb8+'])[0], unique: true, line: ucisOf(opera.pos, ['Qb8+', 'Nxb8', 'Rd8#']), last: opera.last, no: opera.no }
  };
  const imm = replay('1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Bxg1 19.e5 Qxa1+ 20.Ke2 Na6');
  const immP = {
    id: 'm2-immortal', title: 'The Immortal Game', diff: 5, year: 1851,
    text: 'London, 1851: Adolf Anderssen (White) against Lionel Kieseritzky. White has given up both rooks and a bishop; Black\'s queen is in the corner at a1. White to play and mate in three.',
    hints: ['Start with a check that brings a knight closer.', 'The second move is the greatest sacrifice of all.'],
    explain: '**21. Nxg7+ Kd8 22. Qf6+!! Nxf6 23. Be7#** — having given away both rooks and a bishop, Anderssen gives the queen too, to drag the knight from g8, and mates with the three minor pieces he has left: the bishop on e7, covered by the knight on d5, while the knight on g7 guards e8. A casual game, played in London during the great tournament of 1851, and remembered as "the Immortal Game".',
    source: 'Anderssen v. Kieseritzky, London 1851 (the "Immortal Game").',
    tags: ['chess', 'classic', 'sacrifice', 'Anderssen'], par: 3,
    data: { kind: 'mate', fen: imm.fen, n: 3, key: ucisOf(imm.pos, ['Nxg7+'])[0], unique: true, line: ucisOf(imm.pos, ['Nxg7+', 'Kd8', 'Qf6+', 'Nxf6', 'Be7#']), last: imm.last, no: imm.no }
  };
  const ever = replay('1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4 Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6 Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7');
  const everP = {
    id: 'm2-evergreen', title: 'The Evergreen', diff: 5, year: 1852,
    text: 'Berlin, 1852: Adolf Anderssen (White) against Jean Dufresne. Black\'s queen has just taken the knight on f3 and threatens mate on g2 — but it is White\'s move. White to play and mate in four.',
    hints: ['The black king\'s guard on d7 is only a pawn. What if the queen took it?', 'After the king takes the queen, a bishop move gives two checks at once.'],
    explain: '**21. Qxd7+!! Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7#** — the queen is given away to pull the king onto the d-file; the bishop then steps off it with a double check (from itself and from the rook on d1), chases the king to f8, and the other bishop, from a3, mates on e7. It is remembered as "the Evergreen Game".',
    source: 'Anderssen v. Dufresne, Berlin 1852 (the "Evergreen Game").',
    tags: ['chess', 'classic', 'sacrifice', 'Anderssen'], par: 4,
    data: { kind: 'mate', fen: ever.fen, n: 4, key: ucisOf(ever.pos, ['Qxd7+'])[0], unique: true, line: ucisOf(ever.pos, ['Qxd7+', 'Kxd7', 'Bf5+', 'Ke8', 'Bd7+', 'Kf8', 'Bxe7#']), last: ever.last, no: ever.no }
  };
  log('mate in two: searching…');
  const bins = mateBins(2, 700, 202, [1, 2, 3, 4], (x, l) => l <= 2 || !x.check);
  log('mate in two pool:', [1, 2, 3, 4].map((l) => bins[l].length).join('/'));
  log('mate in three: searching…');
  const bins3 = mateBins(3, 250, 303, [5], (x) => !x.check || x.sacrifice);
  log('mate in three pool:', bins3[5].length);
  const counts = { 1: 15, 2: 16, 3: 17, 4: 17 };
  const quotas = {
    1: { check: 6, capture: 3, quiet: 4, zugzwang: 1 },
    2: { check: 4, capture: 3, quiet: 5, zugzwang: 2, flight: 1, sac: 1 },
    3: { quiet: 7, zugzwang: 3, flight: 3, sac: 2, capture: 2 },
    4: { quiet: 6, zugzwang: 4, flight: 3, sac: 3 }
  };
  let idn = 0;
  for (let lv = 1; lv <= 4; lv++) {
    const pick = chooseQuota(bins[lv], quotas[lv], counts[lv]);
    pick.forEach((info, i) => {
      list.push(mateEntry(info, lv, used, 'm2-' + String(++idn).padStart(3, '0')));
      if (lv === 2 && i === 5) list.push(legalP);
      if (lv === 3 && i === 8) list.push(operaP);
    });
  }
  if (!list.includes(legalP)) list.push(legalP);
  if (!list.includes(operaP)) list.push(operaP);
  const pick3 = choose(bins3[5], 13, 13);
  pick3.forEach((info) => list.push(mateEntry(info, 5, used, 'm2-' + String(++idn).padStart(3, '0'))));
  list.push(immP, everP);
  write('mate-in-two', {
    id: 'mate-in-two', engine: 'chessmate', cat: 'games', name: 'Mate in two', order: 11,
    blurb: 'White plays a key move, Black does its best, and White mates on the next move. The keys are quiet more often than not — and the drawer ends with a few mates in three and two famous games.',
    origin: { who: 'The chess problem tradition', note: 'The two-mover — "White to play and mate in two moves" — has been a favourite form of the chess problem since the 19th century, prized for a surprising first move (the key) and variety in Black\'s defences. Sam Loyd (1841–1911), later famous for puzzles of every kind, began as a composer of chess problems. The problems here are the Cabinet\'s own, found by search and kept only when the key is unique.' },
    concepts: ['state-space', 'working-backwards', 'zugzwang']
  }, list, CONCEPTS + '\n' + HISTORY);
}

function helpmates() {
  const used = new Set();
  const list = [];
  const pool = { 1: [], 2: [] };
  const setups = {
    1: [{ w: [1, 2], b: [1, 3], pool: 'QRRBN', bpool: 'PPRBN' }, { w: [1, 3], b: [2, 4], pool: 'QRRBBNNP', bpool: 'PPRRBBN' }],
    2: [{ w: [2, 3], b: [1, 3], pool: 'QRRBBNNP', bpool: 'PPRBN', kingNear: 0.5 }, { w: [1, 2], b: [2, 4], pool: 'QRRBBNN', bpool: 'PPRRBBN' }, { w: [2, 3], b: [2, 3], pool: 'QRRBBNNP', bpool: 'PPRRBN', kingNear: 0.5 }]
  };
  for (const n of [1, 2]) {
    const rng = C.rng(400 + n), t0 = Date.now(), seen = new Set();
    let k = 0;
    while (pool[n].length < (n === 1 ? 1500 : 300)) {
      const c = M.helpCandidate(rng, n, setups[n][k++ % setups[n].length]);
      if (!c || seen.has(c.fen)) continue;
      seen.add(c.fen);
      // no captures in the solution, please
      const pos = Ch.fromFEN(c.fen), q = pos.clone();
      let caps = 0;
      c.sol.forEach((u) => { const m = q.moveFromUci(u); if (m.cap) caps++; q.make(m); });
      if (caps) continue;
      pool[n].push(c);
    }
    log('helpmates in', n, 'pool', pool[n].length);
  }
  const pick = (arr, count) => {
    arr.sort((a, b) => b.e - a.e || a.h - b.h);
    const out = [], firsts = new Set();
    for (const c of arr) {
      const f = c.sol[0].slice(0, 2) + (c.sol[1] || '').slice(0, 2);
      if (firsts.has(f)) continue;
      firsts.add(f);
      out.push(c);
      if (out.length >= count) break;
    }
    return out.sort((a, b) => a.h - b.h);
  };
  const h1 = pick(pool[1], 5), h2 = pick(pool[2], 15);
  let idn = 0;
  const hints = (c) => {
    const pos = Ch.fromFEN(c.fen);
    const q = pos.clone(), sans = [];
    c.sol.forEach((u) => { const m = q.moveFromUci(u); sans.push(q.san(m)); q.make(m); });
    const k = q.turn > 0 ? q.wk : q.bk;
    return ['Picture the final mate first: where could the black king stand, and which of its own men would have to block it in?', 'White mates with ' + sans[sans.length - 1].replace(/[+#]/, '') + ' at the end.'];
  };
  h1.forEach((c, i) => {
    const e = M.helpProblem(c, i < 3 ? 1 : 2, null, used);
    list.push(Object.assign({ id: 'hm-' + String(++idn).padStart(2, '0') }, pick5(e), { hints: hints(c), concepts: ['working-backwards'], tags: ['chess', 'helpmate'] }));
  });
  h2.forEach((c, i) => {
    const e = M.helpProblem(c, 2 + Math.min(3, Math.floor(i / 4)), null, used);
    list.push(Object.assign({ id: 'hm-' + String(++idn).padStart(2, '0') }, pick5(e), { hints: hints(c), concepts: ['working-backwards'], tags: ['chess', 'helpmate'] }));
  });
  write('helpmates', {
    id: 'helpmates', engine: 'chessmate', cat: 'games', name: 'Helpmates', order: 13,
    blurb: 'Chess turned upside down: Black moves first and does everything it can to get mated. Move both sides — there is exactly one way.',
    about: 'You move **both** sides, in turn, Black first: drag a piece (or click it, then a dot). Black and White cooperate — Black wants to be mated! — and White must deliver mate on its last move, no sooner and no later. Every problem has exactly one solution. Undo takes a move back; hints show the next move of the solution.',
    origin: { who: 'The chess problem tradition', note: 'In a helpmate the two sides cooperate, so the whole art is in the one sequence that works — with Black\'s own men blocking the escape squares of their king. The form is a 19th-century invention and has become one of the most popular kinds of chess problem.' },
    concepts: ['working-backwards']
  }, list);
}
// the fields of a made puzzle, in a pleasant order
function pick5(e) { return { title: e.title, diff: e.diff, text: e.text, explain: e.explain, par: e.par, data: e.data }; }

/* ---------- lost games to save ---------- */

// White (far behind, to move) forces stalemate or a dead draw in n moves, one way only
function drawTrick(rng, n) {
  const cheb = (a, b) => Math.max(Math.abs((a >> 3) - (b >> 3)), Math.abs((a & 7) - (b & 7)));
  const b = new Array(64).fill('');
  const free = (s) => s >= 0 && s < 64 && !b[s];
  const corner = rng.pick([0, 7, 1, 6, 8, 15, 2, 5]);
  b[corner] = 'K';
  const near = (c, d) => { for (let t = 0; t < 30; t++) { const r = (c >> 3) + rng.int(2 * d + 1) - d, f = (c & 7) + rng.int(2 * d + 1) - d; if (r >= 0 && r < 8 && f >= 0 && f < 8 && free(r * 8 + f)) return r * 8 + f; } return -1; };
  const put = (ch, s) => { if (s >= 0 && free(s) && !(ch.toLowerCase() === 'p' && ((s >> 3) === 0 || (s >> 3) === 7))) { b[s] = ch; return s; } return -1; };
  // white pawns jammed against black ones next to the king
  for (let i = rng.range(1, 3); i > 0; i--) { const s = put('P', near(corner, 2)); if (s >= 0 && s + 8 < 64 && !b[s + 8] && (s >> 3) < 6) b[s + 8] = 'p'; }
  put(rng.pick(['Q', 'R', 'R', 'B', 'N']), rng.int(64));
  if (rng() < 0.3) put(rng.pick(['R', 'B', 'N']), rng.int(64));
  let bk = -1;
  for (let t = 0; t < 40 && bk < 0; t++) { const s = rng.int(64); if (free(s) && cheb(s, corner) >= 3) bk = s; }
  if (bk < 0) return null;
  b[bk] = 'k';
  put('q', near(corner, 4));
  if (rng() < 0.7) put(rng.pick(['r', 'r', 'b', 'n']), rng.int(64));
  for (let i = rng.range(0, 3); i > 0; i--) put('p', near(bk, 2));
  let pos;
  try { pos = Ch.fromFEN(M.fenFrom(b, 1)); } catch (e) { return null; }
  if (pos.problems() || pos.inCheck() || !pos.hasLegal()) return null;
  // Black must be far ahead
  const val = { 1: 1, 2: 3, 3: 3, 4: 5, 5: 9, 6: 0 };
  let wv = 0, bv = 0;
  pos.pieces().forEach((s) => { const p = pos.b[s]; if (p > 0) wv += val[p]; else bv += val[-p]; });
  if (bv - wv < 6) return null;
  const S = new Ch.Solver(pos, { limit: 300000 });
  try {
    if (S.attack(n)) return null;   // White could simply mate: no rescue needed
    if (S.saverHolds(n - 1)) return null;
    const ks = S.drawKeys(n);
    if (ks.length !== 1 || ks[0].cap) return null;
    // the draw must come by stalemate, not by winning Black's pieces
    const S2 = new Ch.Solver(pos, { limit: 300000 });
    S2.stalemateOnly = true;
    const ks2 = S2.drawKeys(n);
    if (ks2.length !== 1 || Ch.uci(ks2[0]) !== Ch.uci(ks[0])) return null;
    // and without the trick Black would win: after a quiet king move or two, Black has a mate or wins everything — at least, most moves let Black avoid the draw
    let saving = 0;
    for (const m of pos.legal()) { pos.make(m); S.pos = pos; let ok = false; try { ok = S.saverForced(n); } catch (e) { ok = false; } pos.unmake(m); if (ok) saving++; }
    if (saving !== 1) return null;
    return { fen: pos.fen(), n, key: Ch.uci(ks[0]), san: pos.san(ks[0]), check: pos.gives(ks[0]), cap: !!ks[0].cap };
  } catch (e) { return null; }
}
// Black to move: White threatens mate; exactly one Black move holds for n moves
function onlyDefence(rng, n) {
  const pos = M.randomSetup(rng, { turn: -1, w: [2, 4], b: [2, 4], pool: 'QRRBBNNP', bpool: 'PRRBBNNQ', kingNear: 0.3 });
  if (!pos) return null;
  const legal = pos.legal();
  if (legal.length < 8) return null;
  const S = new Ch.Solver(pos, { limit: 400000 });
  try {
    // passing would lose at once: a real threat
    pos.makeNull();
    const threat = pos.legal().some((m) => pos.mates(m));
    pos.unmakeNull();
    if (!threat) return null;
    const rs = S.replies(n);
    const holds = rs.filter((r) => !r.d);
    if (holds.length !== 1) return null;
    const m = holds[0].m;
    const k = pos.bk;
    return { fen: pos.fen(), n, key: Ch.uci(m), san: pos.san(m), king: m.from === k, cap: !!m.cap, check: pos.gives(m), rs };
  } catch (e) { return null; }
}

function endings() {
  const used = new Set();
  const list = [];
  const rng = C.rng(606);
  const plan = [
    ['Q', [2, 3, 4, 5, 6, 7, 8, 8, 9, 9]],
    ['R', [3, 5, 7, 9, 10, 11, 12, 14, 15, 16]],
    ['BB', [5, 8, 11, 14, 18]]
  ];
  const levelOf = (mat, dtm) => mat === 'Q' ? (dtm <= 4 ? 1 : dtm <= 7 ? 2 : 3) : mat === 'R' ? (dtm <= 6 ? 2 : dtm <= 11 ? 3 : dtm <= 14 ? 4 : 5) : (dtm <= 8 ? 4 : 5);
  const made = [];
  for (const [mat, dtms] of plan) {
    for (const dtm of dtms) {
      const c = M.endingCandidate(rng, mat, dtm, dtm, 20000);
      if (!c) { log('no', mat, 'ending with mate in', dtm); continue; }
      made.push([c, levelOf(mat, dtm)]);
    }
  }
  log('endings made', made.length);
  // saving lost games
  const saves = [];
  let rngD = C.rng(707), t0 = Date.now();
  while (saves.filter((x) => x.kind === 'draw').length < 3 && Date.now() - t0 < 240000) {
    const n = saves.filter((x) => x.kind === 'draw').length < 2 ? 1 : 2;
    const c = drawTrick(rngD, n);
    if (c && !saves.some((x) => x.fen === c.fen)) { c.kind = 'draw'; saves.push(c); log('stalemate trick', c.san, c.fen); }
  }
  rngD = C.rng(808); t0 = Date.now();
  const defs = [];
  while (Date.now() - t0 < 120000 && defs.length < 40) {
    const n = defs.length % 2 ? 2 : 1;
    const c = onlyDefence(rngD, n);
    if (c && !c.king && !defs.some((x) => x.fen === c.fen)) defs.push(c);
  }
  defs.sort((a, b) => (a.cap - b.cap) || (a.check - b.check) || (b.n - a.n));
  const pickD = [defs.find((x) => x.n === 1), defs.find((x) => x.n === 2), defs.filter((x) => x.n === 2)[1]].filter(Boolean);
  pickD.forEach((c) => { c.kind = 'defend'; saves.push(c); log('only defence', c.n, c.san, c.fen); });

  let idn = 0;
  const entries = made.map(([c, lv]) => {
    const e = M.endingProblem(c, lv, null, used);
    const tech = { Q: 'queen', R: 'rook', BB: 'bishops' }[c.mat];
    return {
      id: 'end-' + String(++idn).padStart(2, '0'), title: e.title, diff: lv, text: e.text, hints: e.hints,
      explain: 'With best play on both sides the mate takes ' + c.dtm + ' move' + (c.dtm > 1 ? 's' : '') + ' — that is the par, and the computer always picks the reply that makes you work longest. ' + M.LESSON[c.mat].join(' ') + (c.mat === 'BB' ? ' Two bishops can always force mate against a lone king; a single bishop or knight never can.' : ''),
      concepts: ['working-backwards'], tags: ['chess', 'endgame', tech], par: c.dtm, data: e.data
    };
  });
  const saveTitles = { draw: ['Stalemate Swindle', 'The Desperado', 'Saved by Stalemate', 'Nowhere to Move'], defend: ['The Only Move', 'One Way Out', 'Hold the Line', 'The Last Defender'] };
  saves.forEach((c, i) => {
    const pos = Ch.fromFEN(c.fen);
    const title = saveTitles[c.kind].find((t) => !used.has(t));
    used.add(title);
    let text, explain, hints, lv;
    if (c.kind === 'draw') {
      lv = c.n === 1 ? 3 : 4;
      text = 'White is hopelessly behind — but it is White\'s move. Save the game: force a stalemate, or a position where nobody can mate, within ' + (c.n === 1 ? 'one move' : M.word(c.n) + ' moves') + '.';
      hints = ['White\'s king has hardly any moves. What if White\'s other men disappeared?', 'Offer a piece that Black cannot refuse.'];
      const line = M.mainLine ? null : null;
      const q = pos.clone(), key = q.moveFromUci(c.key), ks = q.san(key);
      q.make(key);
      const reps = q.legal().map((r) => q.san(r));
      explain = 'The saving move is **1. ' + ks + '!** ' + (reps.length === 1 ? 'Black\'s only reply is 1… ' + reps[0] + ', and ' : 'Whatever Black answers (' + reps.slice(0, 4).join(', ') + (reps.length > 4 ? '…' : '') + '), ') + (c.n === 1 ? 'White is left without a legal move — stalemate, and the game is drawn.' : 'the stalemate follows on the next move.') + ' A stalemate is a draw however much material the other side has: the classic swindle when all seems lost.';
    } else {
      lv = c.n === 1 ? 3 : 4;
      text = 'Black to play. White threatens mate, and every Black move but one allows mate in ' + (c.n === 1 ? 'one' : M.word(c.n)) + '. Find the only defence.';
      hints = ['First find White\'s threat: what would White do if Black could pass?', 'The defence must stop that mate — and every other mate that the defence itself allows.'];
      const bad = c.rs.filter((r) => r.d).slice(0, 3).map((r) => {
        const q = pos.clone(), rs = q.san(r.m);
        q.make(r.m);
        const a = M.bestAttack(new Ch.Solver(q, { limit: 400000 }), r.d, null);
        const as = a ? q.san(a.m) : '';
        return '1… ' + rs + '? ' + '2. ' + as;
      });
      explain = 'Only **1… ' + c.san + '!** holds: after it White has no mate in ' + (c.n === 1 ? 'one' : M.word(c.n)) + '. Everything else loses, for example ' + bad.join('; ') + '.';
    }
    entries.push({
      id: 'end-' + String(++idn).padStart(2, '0'), title, diff: lv, text, hints, explain,
      concepts: c.kind === 'draw' ? ['working-backwards'] : ['state-space'], tags: ['chess', c.kind === 'draw' ? 'stalemate' : 'defence'],
      data: { kind: c.kind, fen: c.fen, n: c.n, key: c.key }
    });
  });
  // easiest first, lessons before rescues within a level
  const order = { Q: 0, R: 1, BB: 2 };
  entries.sort((a, b) => a.diff - b.diff || (a.data.kind === 'ending' ? 0 : 1) - (b.data.kind === 'ending' ? 0 : 1) || (a.par || 0) - (b.par || 0));
  entries.forEach((e, i) => { e.id = 'end-' + String(i + 1).padStart(2, '0'); });
  write('chess-endings', {
    id: 'chess-endings', engine: 'chessmate', cat: 'games', name: 'Endgame lessons', order: 12,
    blurb: 'Mate the lone king with queen, rook or two bishops before the moves run out — against a computer that defends perfectly. And a few lost games to save.',
    origin: { who: 'Every chess teacher', note: 'The basic mates are the first lessons of every chess book. The computer here plays from complete tables of every position, worked out backwards from the mates themselves (retrograde analysis) — the method that let computers solve endgames in the late 20th century.' },
    concepts: ['working-backwards', 'state-space']
  }, entries);
}

if (require.main === module) {
  if (want('m1')) mateInOne();
  if (want('m2')) mateInTwo();
  if (want('help')) helpmates();
  if (want('end')) endings();
  log('done');
}

module.exports = { replay, ucisOf, write, mateBins, choose, special, drawTrick, onlyDefence };
