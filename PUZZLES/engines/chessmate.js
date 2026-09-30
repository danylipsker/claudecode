/* The Puzzle Cabinet · engines/chessmate.js
 *
 * Chess problems on the full board (rules and searches in js/lib/chess-rules.js),
 * chosen by data.kind:
 *
 *   mate     the side to move mates in n moves against any defence; the computer defends.
 *            data: { fen, n, key: 'uci', unique?: true (no other key: a sound problem),
 *                    line?: ['uci', ...] (a main line to show), last?: 'uci' (the move before, highlighted),
 *                    no?: the move number to start counting from (game finishes), flip? }
 *   help     a helpmate: the side to move starts, both sides cooperate, and the other side
 *            mates on its n-th move. data: { fen, n, sol: ['uci', ...] }
 *   ending   mate the lone king (king and queen, rook, or two bishops) within `limit` moves
 *            against the computer, which defends from an endgame table. data: { fen, limit }
 *   defend   the side to move finds the only move that stops mate in n. data: { fen, n, key }
 *   draw     the side to move, far behind, forces stalemate (or a board where nobody can
 *            mate) within n moves. data: { fen, n, key }
 *
 * p.par: n for mate and help; the fewest moves to mate (from the table) for ending.
 * Moves are counted for the solver's side (for helpmates: the mating side).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;
  const CH = () => C.Chess;

  const NAME = { 1: 'pawn', 2: 'knight', 3: 'bishop', 4: 'rook', 5: 'queen', 6: 'king' };
  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const word = (k) => WORDS[k] || String(k);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const sideName = (s) => (s > 0 ? 'White' : 'Black');
  const abs = Math.abs;

  /* ---------- drawing the pieces (the Cabinet's chessmen, on a 100 × 100 square standing on y = 91) ---------- */

  const BASE = 'M22 91V86Q22 81 28 81H72Q78 81 78 86V91Z';
  const SHAPES = {
    N: { body: ['M32 81C32 70 37 63 45 57C39 58 33 61 27 63C21 65 16 61 17 55C18 50 23 46 29 42L33 33C35 28 38 24 41 22L41 12L48 20C63 20 76 33 74 55C73 67 68 74 70 81Z'], lines: ['M52 25C63 31 68 44 65 60'], dots: [[37.5, 34, 2.8], [22, 56, 1.4]] },
    Q: { body: ['M31 81L37 50H63L69 81Z', 'M30 51L20 25L35 38L34 18L45 34L50 13L55 34L66 18L65 38L80 25L70 51Z'], balls: [[20, 23, 4.5], [34, 16, 4.5], [50, 11, 5], [66, 16, 4.5], [80, 23, 4.5]], lines: ['M33 58H67'] },
    K: { body: ['M31 81L37 52H63L69 81Z', 'M33 53C27 42 35 31 50 33C65 31 73 42 67 53Z', 'M46 9H54V16H61V23H54V33H46V23H39V16H46Z'], lines: ['M34 60H66'] },
    R: { body: ['M29 81L33 74L36 41L30 37V20H39V27H46V20H54V27H61V20H70V37L64 41L67 74L71 81Z'], lines: ['M36 41H64M34 74H66'] },
    B: { body: ['M33 81C37 71 41 64 43 58H57C59 64 63 71 67 81Z', 'M38 51H62V58H38Z', 'M50 16C63 26 67 39 61 51H39C33 39 37 26 50 16Z'], balls: [[50, 12, 4.5]], lines: ['M52 28L59 37'] },
    P: { body: ['M34 81C38 70 42 62 44 56H56C58 62 62 70 66 81Z', 'M38 50H62V56H38Z'], balls: [[50, 38, 12]] }
  };
  // styled by classes (the stage) or by inline colours (thumbnails, which live outside the engine's CSS)
  function pieceSVG(type, white, inline) {
    const sh = SHAPES[type];
    const body = inline ? ' fill="' + (white ? '#f7f2e7' : '#33313b') + '" stroke="' + (white ? '#3a3228' : '#0d0c10') + '" stroke-width="3" stroke-linejoin="round"' : ' class="cq-pb"';
    const line = inline ? ' fill="none" stroke="' + (white ? '#3a3228' : '#cfcac0') + '" stroke-width="2.4" stroke-linecap="round"' : ' class="cq-pl"';
    const dot = inline ? ' fill="' + (white ? '#3a3228' : '#e8e2d6') + '"' : ' class="cq-pd"';
    let s = '<g' + (inline ? '' : ' class="cq-p ' + (white ? 'wht' : 'blk') + '"') + '><path' + body + ' d="' + BASE + '"/>';
    sh.body.forEach((d) => { s += '<path' + body + ' d="' + d + '"/>'; });
    (sh.balls || []).forEach((c) => { s += '<circle' + body + ' cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>'; });
    (sh.lines || []).forEach((d) => { s += '<path' + line + ' d="' + d + '"/>'; });
    (sh.dots || []).forEach((c) => { s += '<circle' + dot + ' cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>'; });
    return s + '</g>';
  }
  const letterOf = (p) => ' PNBRQK'[abs(p)];

  /* ---------- notation ---------- */

  // "1. Qb8+ Nxb8 2. Rd8#", or "1… Kf7 2. Qg4 Ke8 3. Qd7#" when Black starts
  function fmtLine(turn, sans, no) {
    let s = '';
    no = no || 1;
    sans.forEach((x, i) => {
      if (turn > 0) s += (i ? ' ' : '') + no + '. ' + x;
      else { s += (i === 0 ? no + '… ' : ' ') + x; no++; }
      turn = -turn;
    });
    return s;
  }
  // SAN of a list of uci moves from a position (the position is left as it was)
  function sansOf(pos, ucis) {
    const q = pos.clone(), out = [];
    for (const u of ucis) {
      const m = q.moveFromUci(u);
      if (!m) break;
      out.push(q.san(m));
      q.make(m);
    }
    return out;
  }
  const lineText = (pos, ucis, no) => fmtLine(pos.turn, sansOf(pos, ucis), no);
  // one move in running text: "1. Qg4" or "1… Kf7" (i = plies from the start)
  function oneMove(startTurn, i, san) {
    const mover = i % 2 === 0 ? startTurn : -startTurn;
    const no = startTurn > 0 ? Math.floor(i / 2) + 1 : Math.floor((i + 1) / 2) + 1;
    return (mover > 0 ? no + '. ' : no + '… ') + san;
  }
  const sqn = (sq) => CH().sqName(sq);
  const pieceWord = (p) => NAME[abs(p)];

  /* ---------- analysis: keys, threats, variations, tries ---------- */

  // the attacker's fastest forced mate from pos (attacker to move): { d, m } or null
  function bestAttack(S, left, prefer) {
    const d = S.dist(left);
    if (!d) return null;
    if (prefer) {
      const m = S.pos.moveFromUci(prefer);
      if (m) { S.pos.make(m); const ok = d === 1 ? S.pos.status() === 'mate' : S.defend(d); S.pos.unmake(m); if (ok) return { d, m }; }
    }
    const ks = S.keys(d, 1);
    return ks.length ? { d, m: ks[0] } : null;
  }
  // the defender's longest resistance (defender to move, attacker has `left` moves); ties broken by rng
  function bestDefence(S, left, rng) {
    const rs = S.replies(left);
    if (!rs.length) return null;
    const esc = rs.filter((r) => !r.d);
    if (esc.length) return { m: (rng ? rng.pick(esc) : esc[0]).m, d: 0, esc: true };
    const worst = Math.max.apply(null, rs.map((r) => r.d));
    const all = rs.filter((r) => r.d === worst);
    return { m: (rng ? rng.pick(all) : all[0]).m, d: worst };
  }
  // a main line: the attacker's quickest mates against the longest defences
  function mainLine(pos, n, firstUci) {
    const S = new (CH().Solver)(pos, { limit: 2e6 });
    const out = [];
    let left = n;
    for (let guard = 0; guard < 2 * n + 2; guard++) {
      const a = bestAttack(S, left, out.length ? null : firstUci);
      if (!a) break;
      out.push(CH().uci(a.m));
      S.pos.make(a.m);
      if (S.pos.status() === 'mate') break;
      left = a.d - 1;
      const dfn = bestDefence(S, left, null);
      if (!dfn) break;
      out.push(CH().uci(dfn.m));
      S.pos.make(dfn.m);
    }
    return out;
  }

  // what a mating move does, in words (pos before the move)
  function mateWords(pos, m) {
    const Ch = CH();
    const me = pos.turn;
    const san = pos.san(m);
    pos.make(m);
    const k = me > 0 ? pos.bk : pos.wk;
    const checkers = pos.attackers(k, me);
    const flights = [];
    for (const o of Ch.K_OFF) {
      const t = k + o;
      if (t & 0x88) continue;
      const c = pos.b[t];
      flights.push({ sq: t, own: c && (c > 0) === (me < 0), by: c && (c > 0) === (me < 0) ? [] : pos.attackers(t, me) });
    }
    const moved = m.to, movedP = pos.b[moved];
    const disc = !checkers.includes(moved);
    const dbl = checkers.length > 1;
    const own = flights.filter((f) => f.own).length;
    const smothered = abs(movedP) === Ch.KNIGHT && !disc && flights.every((f) => f.own);
    const backRank = (me > 0 ? (k >> 4) === 7 : (k >> 4) === 0) && checkers.some((s) => (s >> 4) === (k >> 4) && [Ch.ROOK, Ch.QUEEN].includes(abs(pos.b[s])));
    const guard = pos.attackers(moved, me).filter((s) => s !== moved);
    const adjacent = Ch.K_OFF.includes(moved - k);
    pos.unmake(m);
    const bits = [];
    const who = pieceWord(movedP);
    if (m.flags & Ch.F_CASTLE) bits.push('castling brings the rook to ' + sqn(m.to + ((m.to & 7) === 6 ? -1 : 1)) + ' with check — a mate that only a king and rook that have never moved can give');
    else if (m.flags & Ch.F_EP) bits.push('The pawn takes *en passant*, as it may only on the very next move after the double step');
    else if (m.promo) bits.push(abs(m.promo) === Ch.QUEEN ? 'The pawn promotes to a queen' : 'The pawn promotes — to a ' + NAME[abs(m.promo)] + ', not a queen');
    if (m.flags & Ch.F_CASTLE) { /* said above */ }
    else if (smothered) bits.push('a smothered mate: the king is walled in by its own men and the knight jumps over them');
    else if (dbl) bits.push('a double check — no block or capture can meet two checks at once, and the king has nowhere to go');
    else if (disc) bits.push('a discovered check: the ' + who + ' steps aside and the ' + pieceWord(pos.b[checkers[0]]) + ' behind it gives the check');
    else if (backRank) bits.push('a back-rank mate: ' + (own ? 'the king\'s own men leave it no air' : 'the king cannot leave its back rank'));
    if (!disc && adjacent && guard.length) bits.push('the ' + who + ' cannot be taken, since the ' + (abs(pos.b[guard[0]]) === Ch.KING ? sideName(me).toLowerCase() + ' king' : pieceWord(pos.b[guard[0]])) + ' on ' + sqn(guard[0]) + ' guards it');
    if (!bits.length) bits.push('the ' + who + ' gives check and every flight square is covered');
    const text = ('**' + san + '** — ' + bits.join('; ') + '.').replace('— The', '— the');
    return { text, smothered, backRank, disc, dbl };
  }

  // grouped answers to each defence after the key (for mate in 2): [{ reps: [san], mates: [san] }]
  function variations(pos, key, n) {
    const S = new (CH().Solver)(pos, { limit: 2e6 });
    S.pos.make(key);
    const out = [];
    if (n === 2) {
      for (const r of S.pos.legal()) {
        const rs = S.pos.san(r);
        S.pos.make(r);
        const mates = S.pos.legal().filter((w) => S.pos.mates(w)).map((w) => S.pos.san(w));
        S.pos.unmake(r);
        out.push({ rep: rs, mates, m: r });
      }
    }
    return out;
  }
  // first moves that fail to exactly one defence (the problemist's "tries"), mate in n
  function tries(pos, n, keyUci, max) {
    const S = new (CH().Solver)(pos, { limit: 1e6 });
    const out = [];
    try {
      for (const m of S.pos.legal()) {
        if (CH().uci(m) === keyUci) continue;
        S.pos.make(m);
        if (S.pos.status()) { S.pos.unmake(m); continue; }
        let refs = 0, ref = null;
        for (const r of S.pos.legal()) {
          S.pos.make(r);
          const ok = n <= 1 ? false : S.attack(n - 1);
          S.pos.unmake(r);
          if (!ok) { refs++; ref = r; if (refs > 1) break; }
        }
        S.pos.unmake(m);
        if (refs === 1) {
          const ms = S.pos.san(m);
          S.pos.make(m);
          const rs = S.pos.san(ref);
          S.pos.unmake(m);
          out.push({ m, san: ms, ref: rs });
          if (out.length >= (max || 99)) break;
        }
      }
    } catch (e) { /* enough */ }
    return out;
  }

  // everything the generator and the explanations need about a mate in n (attacker to move)
  function mateInfo(fen, n, keyUci) {
    const Ch = CH(), pos = Ch.fromFEN(fen);
    const S = new Ch.Solver(pos, { limit: 3e6 });
    const info = { n, me: pos.turn };
    if (n > 1 && S.attack(n - 1)) { info.short = true; return info; }
    info.keys = S.keys(n, 3);
    if (!info.keys.length) return info;
    const key = keyUci ? pos.moveFromUci(keyUci) : info.keys[0];
    info.key = key;
    info.keyUci = Ch.uci(key);
    info.san = pos.san(key);
    info.check = pos.gives(key);
    info.capture = !!key.cap;
    info.promo = !!key.promo;
    info.castle = !!(key.flags & Ch.F_CASTLE);
    info.ep = !!(key.flags & Ch.F_EP);
    info.piece = abs(key.p);
    info.whiteMoves = pos.legal().length;
    info.checks = pos.legal().filter((m) => pos.gives(m)).length;
    // what the defender can do after the key
    pos.make(key);
    info.replies = pos.legal().length;
    const k = pos.turn > 0 ? pos.wk : pos.bk;
    info.flightsAfter = pos.legal().filter((m) => m.from === k).length;
    info.sacrifice = !info.check && pos.attacked(key.to, pos.turn) && abs(key.p) !== Ch.KING && !pos.attacked(key.to, -pos.turn);
    if (n > 1) {
      info.threats = null;
      if (!pos.inCheck()) {
        // what the attacker would do if the defender could pass
        pos.makeNull();
        info.threats = pos.legal().filter((m) => pos.mates(m)).map((m) => pos.san(m));
        pos.unmakeNull();
      }
      info.zugzwang = n === 2 && !!(info.threats && !info.threats.length && !info.check);
    }
    pos.unmake(key);
    // flights before the key (if the defender could move now)
    pos.makeNull();
    const k0 = pos.turn > 0 ? pos.wk : pos.bk;
    info.flightsBefore = pos.inCheck() ? 0 : pos.legal().filter((m) => m.from === k0).length;
    pos.unmakeNull();
    info.flightGiving = info.flightsAfter > info.flightsBefore;
    if (n === 1) {
      const mw = mateWords(pos, key);
      info.words = mw.text;
      info.smothered = mw.smothered;
      info.backRank = mw.backRank;
      info.discovered = mw.disc && !info.castle;
      info.double = mw.dbl;
    }
    return info;
  }

  // how hard a mate in n is, as a number (the levels cut this scale)
  function hardness(info) {
    let h = 0;
    if (info.n === 1) {
      h += Math.min(2.5, info.whiteMoves / 16);
      h += Math.min(3, (info.checks - 1) * 0.35);
      h += { 5: 0, 4: 0.4, 3: 1, 2: 1.3, 1: 1.2, 6: 1.6 }[info.piece] || 0;
      if (info.discovered) h += 1.4;
      if (info.double) h += 0.6;
      if (info.capture) h -= 0.6;
      if (info.promo) h += 0.8;
      if (info.castle || info.ep) h += 2.5;
      return h;
    }
    h += info.n === 2 ? 2 : 5;
    if (info.check) h -= 1.8;
    else if (info.capture) h -= 0.8;
    else h += 0.8;
    if (info.sacrifice) h += 0.8;
    if (info.flightGiving) h += 1;
    if (info.zugzwang) h += 0.8;
    if (abs(info.key.p) === CH().KING) h += 0.5;
    h += Math.min(1.5, (info.tries || 0) * 0.35);
    h += Math.min(1.2, info.replies * 0.06);
    h += Math.min(1, info.whiteMoves / 40);
    return h;
  }
  // beauty, for choosing among many generated problems
  function elegance(info) {
    let e = 0;
    if (info.n > 1) {
      if (!info.check && !info.capture) e += 3;
      if (info.check) e -= 3;
      if (info.capture) e -= 1;
      if (info.sacrifice) e += 2;
      if (info.flightGiving) e += 2;
      if (info.zugzwang) e += 1;
      e += Math.min(2, (info.variety || 0) * 0.4);
    } else {
      if (info.discovered || info.double) e += 1;
      if (info.capture) e -= 1;
      e += Math.min(2, (info.checks - 1) * 0.3);
    }
    e -= 2 * (info.idle || 0);
    return e;
  }

  // white pieces that play no part: the problem works without them
  function idlePieces(fen, n, keyUci) {
    const Ch = CH(), pos = Ch.fromFEN(fen), me = pos.turn;
    let idle = 0;
    for (const sq of pos.pieces(me)) {
      if (abs(pos.b[sq]) === Ch.KING || sq === Ch.sqOf(keyUci.slice(0, 2))) continue;
      const q = pos.clone();
      q.b[sq] = 0;
      q.castle = 0;
      q.rehash();
      if (q.problems()) continue;
      try {
        const S = new Ch.Solver(q, { limit: 2e5 });
        if (S.attack(n)) idle++;
      } catch (e) { /* treat as needed */ }
    }
    return idle;
  }

  // the explanation shown after solving (stored puzzles carry their own copy)
  function explainMate(fen, n, keyUci, line) {
    const Ch = CH(), pos = Ch.fromFEN(fen), me = pos.turn;
    const info = mateInfo(fen, n, keyUci);
    if (!info.key) return '';
    const who = sideName(me), foe = sideName(-me);
    if (n === 1) {
      let t = info.words;
      const others = pos.legal().filter((m) => pos.gives(m) && !pos.mates(m));
      if (others.length) {
        const o = others[0];
        const os = pos.san(o);
        pos.make(o);
        const esc = pos.legal()[0];
        const es = esc ? pos.san(esc) : '';
        pos.unmake(o);
        t += '\n\nOther checks fall short: after ' + oneMove(me, 0, os) + '? ' + foe + ' answers ' + oneMove(me, 1, es) + '.';
      }
      return t;
    }
    const parts = [];
    const tag = info.check ? 'a check' : info.capture ? 'a capture' : info.promo ? 'a promotion, without check' : info.sacrifice ? 'a quiet move that offers the piece' : 'a quiet move — no check, no capture';
    parts.push('The key is **' + oneMove(me, 0, info.san) + '!**, ' + tag + (info.flightGiving ? ', and it even gives the king a new flight square' : '') + '.');
    if (n === 2 && info.threats && info.threats.length) parts.push('It threatens ' + oneMove(me, 2, info.threats[0]) + '.');
    else if (info.zugzwang) parts.push('It threatens nothing at all: ' + foe + ' is in *zugzwang* — obliged to move, and every move weakens something.');
    if (n === 2) {
      const vs = variations(pos, info.key, 2);
      const thr = new Set(info.threats || []);
      const shown = vs.filter((v) => v.mates.length && !v.mates.some((x) => thr.has(x))).slice(0, 5);
      if (shown.length) parts.push('The defences and the mates that punish them: ' + shown.map((v) => oneMove(me, 1, v.rep) + ' ' + oneMove(me, 2, v.mates[0])).join('; ') + '.');
      if (thr.size && vs.length > shown.length) parts.push(shown.length ? 'Anything else allows the threat.' : 'No defence stops it.');
      const tr = tries(pos, 2, info.keyUci, 2);
      if (tr.length) parts.push('Close, but no: ' + tr.map((x) => oneMove(me, 0, x.san) + '? fails to ' + oneMove(me, 1, x.ref) + '!').join('; ') + '.');
    } else {
      const ml = line && line.length ? line : mainLine(pos, n, info.keyUci);
      parts.push('The main line: ' + lineText(pos, ml) + '.');
    }
    return parts.join(' ');
  }

  // what a helpmate solution does, in words
  function explainHelp(fen, sol) {
    const Ch = CH(), pos = Ch.fromFEN(fen);
    const sans = sansOf(pos, sol);
    const q = pos.clone();
    const movedTo = [];
    sol.forEach((u) => { const m = q.moveFromUci(u); movedTo.push({ to: m.to, side: q.turn, p: m.p }); q.make(m); });
    const k = q.turn > 0 ? q.wk : q.bk;
    const blocks = movedTo.filter((x) => x.side === pos.turn && abs(x.p) !== Ch.KING && Ch.K_OFF.includes(x.to - k) && q.b[x.to] === x.p);
    const kingWalk = movedTo.some((x) => x.side === pos.turn && abs(x.p) === Ch.KING);
    let t = 'The only solution: **' + fmtLine(pos.turn, sans) + '**.';
    const bits = [];
    if (kingWalk) bits.push(sideName(pos.turn) + '\'s king walks into the net');
    if (blocks.length) bits.push(sideName(pos.turn) + '\'s ' + blocks.map((x) => pieceWord(x.p)).join(' and ') + ' ' + (blocks.length > 1 ? 'block' : 'blocks') + ' the king\'s own escape (' + blocks.map((x) => sqn(x.to)).join(', ') + ')');
    if (bits.length) t += ' ' + cap(bits.join('; ')) + ', and ' + sideName(-pos.turn) + ' mates.';
    // is it a pure mate? every free square around the king is covered once
    let pure = true;
    for (const o of Ch.K_OFF) {
      const x = k + o;
      if (x & 0x88) continue;
      const c = q.b[x];
      if (c && (c > 0) === (pos.turn > 0)) continue;
      if (q.attackers(x, -pos.turn).length !== 1) { pure = false; break; }
    }
    if (pure && q.attackers(k, -pos.turn).length === 1) t += ' The final picture is a *pure mate*: each square around the king is shut exactly once.';
    return t;
  }

  /* ---------- making problems (the endless drawers, and tools/gen/chess.js with a fixed seed) ---------- */

  function fenFrom(b, turn, castle, ep) {
    let s = '';
    for (let r = 7; r >= 0; r--) {
      let e = 0;
      for (let f = 0; f < 8; f++) { const x = b[r * 8 + f]; if (!x) { e++; continue; } if (e) { s += e; e = 0; } s += x; }
      if (e) s += e;
      if (r) s += '/';
    }
    return s + ' ' + (turn > 0 ? 'w' : 'b') + ' ' + (castle || '-') + ' ' + (ep || '-') + ' 0 1';
  }
  const cheb = (a, b) => Math.max(abs((a >> 3) - (b >> 3)), abs((a & 7) - (b & 7)));
  const lightSq = (s) => (((s >> 3) + (s & 7)) & 1) === 1;

  // a sparse, natural-looking position: White's men gather round a black king near its home side
  // o: { w: [min, max] white men besides the king, b: [min, max] black men, pool, bpool, turn, shelter, kingNear }
  function randomSetup(rng, o) {
    const b = new Array(64).fill('');
    const rk = rng() < 0.62 ? 7 : rng() < 0.55 ? 6 : 2 + rng.int(5);
    const fk = rng() < 0.5 ? rng.pick([0, 1, 2, 5, 6, 7]) : rng.int(8);
    const bk = rk * 8 + fk;
    b[bk] = 'k';
    const free = (s) => s >= 0 && s < 64 && !b[s];
    const place = (ch, near, d) => {
      for (let t = 0; t < 40; t++) {
        let s;
        if (near >= 0) {
          const r = (near >> 3) + rng.int(2 * d + 1) - d, f = (near & 7) + rng.int(2 * d + 1) - d;
          if (r < 0 || r > 7 || f < 0 || f > 7) continue;
          s = r * 8 + f;
        } else s = rng.int(64);
        if (!free(s)) continue;
        const r = s >> 3, lo = ch.toLowerCase();
        if (lo === 'p' && (r === 0 || r === 7)) continue;
        if (ch === 'P' && r === 6 && rng() < 0.75) continue;
        if (ch === 'p' && r === 1 && rng() < 0.75) continue;
        if (lo === 'b' && b.some((x, i) => x === ch && lightSq(i) === lightSq(s))) continue;
        b[s] = ch;
        return s;
      }
      return -1;
    };
    // a pawn shelter in front of a king on its back rank
    if (rk === 7 && rng() < (o.shelter == null ? 0.5 : o.shelter)) {
      for (let df = -1; df <= 1; df++) {
        const f = fk + df;
        if (f < 0 || f > 7 || rng() < 0.3) continue;
        const r = rng() < 0.75 ? 6 : 5;
        if (!b[r * 8 + f]) b[r * 8 + f] = 'p';
      }
    }
    // the white king: usually far away, sometimes close enough to help
    let wk = -1;
    for (let t = 0; t < 60 && wk < 0; t++) {
      let s = rng.int(32);
      if (rng() < (o.kingNear == null ? 0.15 : o.kingNear)) {
        const r = rk - 2 + rng.int(3), f = fk - 2 + rng.int(5);
        s = r >= 0 && r < 8 && f >= 0 && f < 8 ? r * 8 + f : -1;
      }
      if (s >= 0 && free(s) && cheb(s, bk) >= 2) wk = s;
    }
    if (wk < 0) return null;
    b[wk] = 'K';
    const nw = rng.range(o.w[0], o.w[1]), nb = rng.range(o.b[0], o.b[1]);
    const pool = (o.pool || 'QRRBBNNPPP').split(''), bpool = (o.bpool || 'PPPPRBNN').split('');
    let queens = 0, bq = 0;
    for (let i = 0; i < nw; i++) {
      let ch = rng.pick(pool);
      if (ch === 'Q' && queens++) ch = 'R';
      place(ch, rng() < 0.85 ? bk : -1, ch === 'P' ? 3 : 4);
    }
    for (let i = 0; i < nb; i++) {
      let ch = rng.pick(bpool);
      if (ch === 'Q' && bq++) ch = 'R';
      place(ch.toLowerCase(), rng() < 0.7 ? bk : -1, 2);
    }
    let pos;
    try { pos = CH().fromFEN(fenFrom(b, o.turn || 1)); } catch (e) { return null; }
    if (pos.problems() || pos.inCheck()) return null;
    return pos;
  }

  // the setup for a level: more men, more choice, as the levels rise
  function setupFor(n, level) {
    if (n === 1) {
      return [null,
        { w: [1, 2], b: [0, 2], pool: 'QQRRRBN' },
        { w: [2, 3], b: [1, 3], pool: 'QRRBBNNP' },
        { w: [2, 4], b: [1, 4] },
        { w: [3, 5], b: [2, 5], bpool: 'PPPRRBNNQ' },
        { w: [3, 5], b: [3, 6], bpool: 'PPPRRBNNQ' }][level];
    }
    if (n === 2) {
      return [null,
        { w: [1, 3], b: [0, 2], pool: 'QQRRBN' },
        { w: [2, 3], b: [0, 3] },
        { w: [2, 4], b: [1, 4] },
        { w: [2, 4], b: [1, 4], bpool: 'PPPRRBNNQ' },
        { w: [3, 5], b: [2, 5], bpool: 'PPPRRBNNQ' }][level];
    }
    return { w: [2, 3], b: [1, 3], pool: 'QRRBBNNP', kingNear: 0.4 };
  }

  // hardness cut points between the levels (from a large generated sample)
  const CUTS = { 1: [1.8, 2.5, 3.35, 4.35], 2: [1.7, 2.8, 4.4] };
  function levelOf(info) {
    if (info.n >= 3) return 5;
    const c = CUTS[info.n];
    let l = 1;
    while (l <= c.length && info.h > c[l - 1]) l++;
    return l;
  }

  // a unique mate in n from a random position, with its measures; null if this one fails
  function mateCandidate(rng, n, o, deep, pre) {
    const Ch = CH();
    const pos = randomSetup(rng, o);
    if (!pos) return null;
    const S = new Ch.Solver(pos, { limit: n >= 3 ? 300000 : 120000 });
    try {
      if (n > 1 && S.attack(n - 1)) return null;
      if (S.keys(n, 2).length !== 1) return null;
    } catch (e) { return null; }
    const fen = pos.fen();
    let info;
    try { info = mateInfo(fen, n); } catch (e) { return null; }
    if (!info.key) return null;
    info.fen = fen;
    if (pre && !pre(info)) return null;   // a cheap test before the costly measures
    if (deep) {
      info.idle = idlePieces(fen, n, info.keyUci);
      if (n === 2) {
        info.tries = tries(pos, 2, info.keyUci, 6).length;
        info.variety = new Set(variations(pos, info.key, 2).map((v) => v.mates[0]).filter(Boolean)).size;
      }
    }
    info.h = hardness(info);
    info.e = elegance(info);
    return info;
  }

  const TITLES = {
    back: ['The Back Rank', 'No Air to Breathe', 'Locked Behind the Pawns', 'The Closed Window', 'Trapped at Home', 'The Last Rank', 'A Wall of Its Own', 'Home Is a Prison', 'The Low Ceiling'],
    smother: ['Smothered', 'No Room at All', 'The Crowded Corner', 'Buried Alive', 'The Stifled King'],
    double: ['Double Trouble', 'Two Checks at Once', 'The Pincer', 'Both Barrels', 'Twice Over'],
    disc: ['Unmasked', 'The Curtain Rises', 'Behind the Door', 'The Hidden Battery', 'Out of the Shadows', 'Stepping Aside', 'The Reveal', 'The Sliding Door'],
    castle: ['Castle and Mate', 'The Castle Gate'],
    ep: ['In Passing', 'En Passant'],
    under: ['Knighted', 'The Humble Crown', 'Not a Queen'],
    promo: ['A New Queen', 'Crowned', 'Coronation', 'Eighth-Rank Glory'],
    Q: ['The Queen Arrives', 'Royal Visit', 'Her Majesty', 'The Queen\'s Kiss', 'Queen Takes Command', 'By Royal Decree', 'The Long Reach', 'Queen of the Board', 'A Queen\'s Welcome', 'Across the Board', 'The Queen Descends', 'Majesty', 'The Ermine Glove', 'Court Is in Session'],
    R: ['Rook Lift', 'The Open File', 'Along the Rank', 'The Iron Rook', 'Tower Strike', 'The Rook Rolls In', 'Straight and True', 'Down the File', 'A Rook on the Loose', 'The Siege Tower', 'The Battering Ram', 'Rank and File'],
    B: ['The Long Diagonal', 'Bishop\'s Blessing', 'The Sniper', 'From Afar', 'Diagonal Drop', 'The Bishop\'s Crook', 'Slanting Light', 'Along the Colour', 'The Mitre', 'The Cross-Country Bishop', 'Corner to Corner', 'The Silent Bishop'],
    N: ['Knight\'s Leap', 'The Horseman', 'Out of Nowhere', 'The Knight Rides In', 'Hop and Mate', 'The Crooked Path', 'Knight Errant', 'Over the Wall', 'The Cavalry', 'The Dark Horse', 'The L-Shaped Blow', 'Saddle Up'],
    P: ['The Humble Pawn', 'Foot Soldier', 'Pawn Power', 'The Little Hero', 'A Pawn\'s Revenge', 'One Small Step', 'The Infantry', 'Small but Deadly'],
    K: ['The King Steps Aside', 'His Majesty Moves'],
    quiet: ['A Quiet Move', 'Silence Before the Storm', 'Softly, Softly', 'The Calm Key', 'Tiptoe', 'Without a Check', 'Patience', 'The Waiting Game', 'A Gentle Step', 'Hush', 'Still Waters', 'The Soft Answer', 'Understatement', 'A Modest Proposal', 'Mind the Gap', 'The Long Pause', 'Unhurried', 'Sleight of Hand', 'The Quiet Hour', 'Whisper'],
    sac: ['The Offer', 'Take It If You Dare', 'A Gift', 'The Poisoned Present', 'The Bold Offer', 'Here, Have a Piece', 'The Trojan Horse', 'Something for Nothing'],
    flight: ['An Open Door', 'Room to Run', 'The Generous Key', 'Here Is a Square', 'Go On, Run', 'The Invitation'],
    zugzwang: ['Zugzwang', 'Nothing to Do', 'Every Move Hurts', 'Frozen', 'The Squeeze', 'Your Move, Sadly', 'Stuck Fast'],
    check: ['Check First', 'Forcing Play', 'Chase the King', 'No Time to Think', 'Hounded', 'The Drive', 'Harried'],
    capture: ['Clearing the Way', 'Snatch and Mate', 'First, a Capture', 'Grab and Go'],
    three: ['Three Steps to Mate', 'The Long Road', 'Slowly Closing', 'The Net Tightens', 'Three Moves Deep', 'Patience Rewarded', 'The Slow Squeeze', 'The Hunt', 'Step by Step', 'The Long Way Round', 'Closing the Net', 'The Third Move', 'Deep Waters', 'The Distant Mate', 'A Plan in Three'],
    help: ['Walking into It', 'A Friendly Game', 'Cooperation', 'Hand in Hand', 'After You', 'The Obliging King', 'Help Wanted', 'Mutual Aid', 'Partners', 'Lending a Hand', 'Stepping into the Net', 'Joint Venture', 'All Together', 'The Willing Victim', 'Duet', 'Pas de Deux', 'In Step', 'The Courtesy', 'Arm in Arm', 'Good Manners', 'The Polite King', 'Please, Go Ahead', 'The Dance', 'Shall We?']
  };
  function themeOf(info) {
    if (info.n === 1) {
      if (info.castle) return 'castle';
      if (info.ep) return 'ep';
      if (info.promo) return abs(info.key.promo) === CH().QUEEN ? 'promo' : 'under';
      if (info.smothered) return 'smother';
      if (info.double) return 'double';
      if (info.discovered) return 'disc';
      if (info.backRank) return 'back';
      return ' PNBRQK'[info.piece];
    }
    if (info.n >= 3) return 'three';
    if (info.zugzwang) return 'zugzwang';
    if (info.flightGiving) return 'flight';
    if (info.sacrifice) return 'sac';
    if (info.check) return 'check';
    if (info.capture) return 'capture';
    return 'quiet';
  }
  // for when a theme's own list runs out
  const GENERAL = ['A Tight Spot', 'No Escape', 'Nowhere to Hide', 'The Final Blow', 'The Clincher', 'Coup de Grâce', 'Curtains', 'The Knockout', 'Bolt from the Blue',
    'The Closing Door', 'Lights Out', 'The Neat Finish', 'Short and Sweet', 'The Long Shot', 'Fair and Square', 'A Royal Mess', 'The Uneasy Crown', 'Heavy Lies the Crown',
    'Palace Intrigue', 'Blindside', 'The Ambush', 'Hemmed In', 'Boxed In', 'Tight Corner', 'Dead End', 'Cul-de-Sac', 'The Snare', 'Caught Napping', 'The Sting',
    'The Killing Square', 'Crossfire', 'The Net', 'Sealed Off', 'Closing Time', 'Last Orders', 'Final Curtain', 'The Clockwork King', 'The King\'s Ransom', 'Throne Room',
    'A Sticky End', 'Surrounded', 'Outflanked', 'Cut Off', 'Home Truths', 'The Last Word', 'Checkmate at Dawn', 'Game Over', 'The Trap Snaps Shut', 'Sudden Silence',
    'The Iron Ring', 'Nowhere Left', 'The Narrow Gate', 'Royal Siege', 'The Tripwire', 'Checkmate Alley', 'The Pin Drop', 'Out of Air', 'A Small World', 'No Way Through',
    'The Squeeze Play', 'End of the Road', 'The Cornered Crown', 'Close Quarters', 'The Clean Finish', 'The Master Stroke', 'Endgame', 'The Iron Gate', 'Walled Up'];
  // a title from the theme's list; with `used` (a Set) the first unused one, then the general list, then numbered
  function titleFor(theme, rng, used) {
    const list = TITLES[theme] || TITLES.quiet;
    if (!used) return rng.pick(list);
    let t = list.find((x) => !used.has(x)) || GENERAL.find((x) => !used.has(x));
    for (let k = 2; !t; k++) { const c = list[0] + ' ' + (['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][k] || String(k)); if (!used.has(c)) t = c; }
    used.add(t);
    return t;
  }
  function mateStatement(me, n, fen) {
    let t = sideName(me) + ' to play and mate in ' + word(n) + '.';
    const pos = CH().fromFEN(fen);
    const mine = me > 0 ? pos.castle & 3 : pos.castle & 12;
    if (mine) t += ' Castling is still allowed: the king and the rook' + (mine === 3 || mine === 12 ? 's have' : ' have') + ' not moved.';
    return t;
  }
  function mateProblem(info, level, rng, used) {
    return {
      title: titleFor(themeOf(info), rng, used),
      text: mateStatement(info.me, info.n, info.fen),
      par: info.n,
      diff: level,
      data: { kind: 'mate', fen: info.fen, n: info.n, key: info.keyUci, unique: true }
    };
  }
  // endless: the same rng always gives the same puzzle, so the searches count attempts, not milliseconds
  // (a generous clock only guards against a very slow machine)
  function genMate(rng, level, fam) {
    const n = fam === 'mate-in-one' ? 1 : level >= 5 ? 3 : 2;
    const o = setupFor(n, n === 3 ? 5 : level);
    const want = 1;
    const pre = (x) => !(n > 1 && level >= 3 && x.check) && (n === 3 || levelOf(Object.assign({}, x, { h: hardness(x) + 1.5 })) >= level);
    const t0 = Date.now();
    let best = null, found = 0;
    for (let t = 0; t < 40000 && found < want; t++) {
      if ((t & 15) === 15 && Date.now() - t0 > 3000) return null;
      const info = mateCandidate(rng, n, o, true, pre);
      if (!info || levelOf(info) !== level) continue;
      if (info.idle > (level <= 1 ? 1 : 0)) continue;
      if (n === 1 && level === 1 && !['Q', 'R', 'back'].includes(themeOf(info))) continue;
      if (n > 1 && level >= 3 && info.check) continue;
      found++;
      if (!best || info.e > best.e) best = info;
    }
    return best ? mateProblem(best, level, rng) : null;
  }

  // helpmates: the side to move (Black) starts and helps White mate on White's n-th move; one solution only
  function helpCandidate(rng, n, o) {
    const Ch = CH();
    const pos = randomSetup(rng, Object.assign({ turn: -1 }, o));
    if (!pos || !pos.hasLegal()) return null;
    const S = new Ch.Solver(pos, { limit: 250000 });
    let sols;
    try {
      for (let k = 1; k < n; k++) if (S.help(k, 1).length) return null;
      sols = S.help(n, 2);
    } catch (e) { return null; }
    if (sols.length !== 1) return null;
    // Black's help must matter: White, moving first, could not force the mate alone
    pos.makeNull();
    let direct = false;
    try { direct = new Ch.Solver(pos, { limit: 100000 }).attack(n); } catch (e) { direct = false; }
    pos.unmakeNull();
    if (direct) return null;
    const sol = sols[0].map(Ch.uci);
    const fen = pos.fen();
    // beauty: no captures, several black men at work, a pure final mate
    let e = 0, caps = 0;
    const movers = new Set();
    sols[0].forEach((m, i) => { if (m.cap) caps++; if (i % 2 === 0) movers.add(m.from + ':' + i); });
    const blackMen = new Set(sols[0].filter((m, i) => i % 2 === 0).map((m) => abs(m.p)));
    e -= caps * 1.5;
    e += blackMen.size;
    const ex = explainHelp(fen, sol);
    if (/pure mate/.test(ex)) e += 2;
    const h = n + (caps ? 0 : 0.5) + blackMen.size * 0.3 + pos.legal().length / 30;
    return { fen, n, sol, e, h, explain: ex };
  }
  function helpProblem(c, level, rng, used) {
    return {
      title: titleFor('help', rng, used),
      text: 'Helpmate in ' + word(c.n) + ': Black moves first, and the two sides work together so that White mates on White\'s ' + ['', 'first', 'second', 'third'][c.n] + ' move. There is exactly one way.',
      par: c.n,
      diff: level,
      explain: c.explain,
      data: { kind: 'help', fen: c.fen, n: c.n, sol: c.sol }
    };
  }
  const HELP_SETUP = [null,
    { w: [1, 2], b: [1, 2], pool: 'QRRBN', bpool: 'PPRBN' },
    { w: [1, 3], b: [2, 4], pool: 'QRRBBNNP', bpool: 'PPRRBBN' },
    { w: [2, 3], b: [1, 3], pool: 'QRRBBNNP', bpool: 'PPRBN', kingNear: 0.5 },
    { w: [2, 3], b: [1, 3], pool: 'QRRBBNNP', bpool: 'PPRBN', kingNear: 0.5 },
    { w: [2, 3], b: [1, 3], pool: 'QRRBBNNP', bpool: 'PPRRBN', kingNear: 0.5 }];
  function genHelp(rng, level) {
    const n = level <= 2 ? 1 : 2;
    const want = [0, 1, 3, 1, 2, 3][level];
    const t0 = Date.now();
    let best = null;
    for (let t = 0; t < (n === 1 ? 3000 : 160); t++) {
      if ((t & 7) === 7 && Date.now() - t0 > 3000) return null;
      const c = helpCandidate(rng, n, HELP_SETUP[level]);
      if (c && c.e >= want) return helpProblem(c, level, rng);
      if (c && (!best || c.e > best.e)) best = c;
    }
    return best && best.e >= want - 1 ? helpProblem(best, level, rng) : null;
  }

  // endgames: a random position of this material with White to move and mate in lo..hi moves
  function endingCandidate(rng, mat, lo, hi, tries0) {
    const Ch = CH(), tb = Ch.Table.get(mat);
    if (!tb.done) tb.build();
    for (let t = 0; t < (tries0 || 400); t++) {
      const b = new Array(64).fill('');
      const put = (ch, test) => { for (let k = 0; k < 50; k++) { const s = rng.int(64); if (!b[s] && (!test || test(s))) { b[s] = ch; return s; } } return -1; };
      const bk = put('k'), wk = put('K', (s) => cheb(s, bk) >= 2);
      if (wk < 0) continue;
      if (mat === 'BB') { if (put('B', lightSq) < 0 || put('B', (s) => !lightSq(s)) < 0) continue; } else if (put(mat) < 0) continue;
      let pos;
      try { pos = Ch.fromFEN(fenFrom(b, 1)); } catch (e) { continue; }
      if (pos.problems() || pos.inCheck()) continue;
      // no piece hanging next to the king at the start
      if (pos.pieces(1).some((s) => abs(pos.b[s]) !== Ch.KING && pos.attacked(s, -1) && !pos.attacked(s, 1))) continue;
      const v = tb.probe(pos);
      if (v < 0) continue;
      const m = (v + 1) / 2;
      if (m >= lo && m <= hi) return { fen: pos.fen(), mat, dtm: m };
    }
    return null;
  }
  const limitFor = (dtm) => dtm + Math.max(2, Math.ceil(dtm * 0.35));
  const MAT_WORDS = { Q: 'king and queen', R: 'king and rook', BB: 'king and two bishops' };
  const LESSON = {
    Q: ['Shrink the king\'s box: put the queen a knight\'s jump away from the king and follow it as it moves.', 'Once the king is on the edge, bring your own king up to guard the mating square — and watch for stalemate: always leave the king a move until the last one.'],
    R: ['Cut the king off with the rook along a rank or a file, then walk your own king towards it.', 'When the kings stand face to face with one square between them, a rook check from the side drives the king back a line. A waiting rook move sets that up.'],
    BB: ['Side by side, the two bishops make a wall the king cannot cross. Push the wall forward a line at a time.', 'The mate comes in a corner, with your king close by to take away the last squares.']
  };
  const END_TITLES = {
    Q: ['The Queen\'s Box', 'Queen and King Together', 'The Shrinking Square', 'Herding the King', 'The Queen\'s March', 'Drive to the Edge', 'Mind the Stalemate', 'The Royal Escort', 'Corner the King', 'Two Against One', 'The Last Stand', 'Cornered'],
    R: ['The Rook\'s Wall', 'Cutting Off', 'The Waiting Move', 'Face to Face', 'The Opposition', 'Line by Line', 'The Long March', 'The Box Method', 'Squeezing the Box', 'The Rook\'s Patience', 'Edge of the World', 'Rook and King Together', 'The Final File', 'The Border'],
    BB: ['Side by Side', 'The Bishops\' Wall', 'Two Diagonals', 'Into the Corner', 'The Mitred Pair', 'Clergy at Work', 'The Diagonal Net', 'The Last Corner']
  };
  function endingProblem(c, level, rng, used) {
    const lim = limitFor(c.dtm);
    const names = END_TITLES[c.mat];
    let title = used ? names.find((x) => !used.has(x)) : rng.pick(names);
    if (!title) title = cap(MAT_WORDS[c.mat]) + ', ' + c.dtm + ' Moves';
    if (used) used.add(title);
    return {
      title,
      text: 'White has ' + MAT_WORDS[c.mat] + ' against the lone black king. Mate within ' + lim + ' moves — the computer defends as stubbornly as it can. With perfect play it takes ' + word(c.dtm) + '.',
      par: c.dtm,
      diff: level,
      hints: LESSON[c.mat].slice(),
      data: { kind: 'ending', fen: c.fen, limit: lim }
    };
  }
  function genEnding(rng, level) {
    const spec = [null, ['Q', 1, 4], ['Q', 5, 8], ['R', 5, 10], ['R', 11, 14], ['R', 15, 16]][level];
    const c = endingCandidate(rng, spec[0], spec[1], spec[2], 600);
    return c ? endingProblem(c, level, rng) : null;
  }

  /* ---------- the board on the stage ---------- */

  let uid = 0;
  const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  const ordinal = (k) => ORD[k] || k + 'th';

  function mount(ctx, p) {
    const Ch = CH(), d = p.data, wb = ctx.wb;
    const kind = d.kind || 'mate';
    const start = Ch.fromFEN(d.fen);
    const me = start.turn;                       // the side the solver plays (both sides in a helpmate)
    const counted = kind === 'help' ? -me : me;  // whose moves count
    const n = d.n || 1;
    const limit = kind === 'ending' ? d.limit : n;
    const foe = sideName(-me);
    let pos = start.clone(), moves = [], sans = [], flags = [], over = null, note = '';
    let flip = d.flip != null ? !!d.flip : (kind !== 'help' && me < 0);
    let sel = -1, busy = false, timer = null, workT = null, g = null, picker = null, dead = false, hintMem = null;
    let els = {}, needBefore = null, epoch = 0;
    let table = null, tableReady = kind !== 'ending';
    const lastPre = d.last ? { from: Ch.sqOf(d.last.slice(0, 2)), to: Ch.sqOf(d.last.slice(2, 4)) } : null;
    const moverAt = (i) => (i % 2 ? -start.turn : start.turn);
    const used = () => moves.filter((m, i) => moverAt(i) === counted).length;

    /* the board */
    const XY = (sq) => { const f = sq & 7, r = sq >> 4; return flip ? [7 - f, r] : [f, 7 - r]; };
    const sqAt = (pt) => {
      const c = Math.floor(pt[0]), r = Math.floor(pt[1]);
      if (c < 0 || c > 7 || r < 0 || r > 7) return -1;
      return flip ? r * 16 + (7 - c) : (7 - r) * 16 + c;
    };
    const bg = wb.layer('board'), top = wb.layer('top');
    const gRoot = ctx.s('g', { class: 'cq' }, bg);
    const gid = 'cqck' + (++uid);
    const defs = ctx.s('defs', null, gRoot);
    const grad = ctx.s('radialGradient', { id: gid }, defs);
    ctx.s('stop', { offset: '0', 'stop-color': '#ff4136', 'stop-opacity': '.95' }, grad);
    ctx.s('stop', { offset: '.5', 'stop-color': '#e3261d', 'stop-opacity': '.6' }, grad);
    ctx.s('stop', { offset: '1', 'stop-color': '#e3261d', 'stop-opacity': '0' }, grad);
    const gBoard = ctx.s('g', null, gRoot), gMark = ctx.s('g', null, gRoot), gHint = ctx.s('g', null, gRoot);
    const gPieces = ctx.s('g', null, gRoot), gDots = ctx.s('g', null, gRoot);
    const gDrag = ctx.s('g', { class: 'cq' }, top), gFlash = ctx.s('g', { class: 'cq' }, top), gPick = ctx.s('g', { class: 'cq' }, top);
    wb.setBounds({ x0: -0.5, y0: -0.5, x1: 8.5, y1: 8.5 }, 0.03);

    function drawBoard() {
      gBoard.innerHTML = '';
      const m = 0.36;
      ctx.s('rect', { x: -m, y: -m, width: 8 + 2 * m, height: 8 + 2 * m, rx: 0.14, class: 'cq-frame' }, gBoard);
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const real = flip ? r * 16 + 7 - c : (7 - r) * 16 + c;
          ctx.s('rect', { x: c, y: r, width: 1.004, height: 1.004, class: 'cq-sq ' + ((r + c) % 2 ? 'dark' : 'light'), 'data-key': 'sq-' + sqn(real) }, gBoard);
        }
      }
      for (let c = 0; c < 8; c++) ctx.s('text', { x: c + 0.5, y: 8 + m / 2 + 0.01, class: 'cq-coord', text: Ch.FILES[flip ? 7 - c : c] }, gBoard);
      for (let r = 0; r < 8; r++) ctx.s('text', { x: -m / 2, y: r + 0.5, class: 'cq-coord', text: String(flip ? r + 1 : 8 - r) }, gBoard);
      if (wb.applyPaints) wb.applyPaints();
    }
    function drawPiece(parent, pc, x, y, cls) {
      const el = ctx.s('g', { class: 'cq-piece' + (cls ? ' ' + cls : ''), transform: 'translate(' + x + ' ' + y + ') scale(.01)' }, parent);
      el.innerHTML = pieceSVG(letterOf(pc), pc > 0);
      return el;
    }
    const place = (el, x, y) => el.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(.01)');
    function mark(sq, cls) { const [x, y] = XY(sq); ctx.s('rect', { x, y, width: 1, height: 1, class: 'cq-mark ' + cls }, gMark); }

    function movable(pc) {
      if (over || busy || !tableReady || picker) return false;
      if ((pc > 0) !== (pos.turn > 0)) return false;
      return kind === 'help' || pos.turn === me;
    }
    // the legal moves of the piece on `from` (one per target square)
    function targets(from) {
      return pos.legal().filter((m) => m.from === from && (!m.promo || abs(m.promo) === Ch.QUEEN));
    }

    function render() {
      gMark.innerHTML = '';
      gPieces.innerHTML = '';
      gDots.innerHTML = '';
      gDrag.innerHTML = '';
      els = {};
      const last = moves.length ? moves[moves.length - 1] : lastPre;
      if (last) { mark(last.from, 'last'); mark(last.to, 'last'); }
      if (sel >= 0) mark(sel, 'sel');
      if (pos.inCheck()) {
        const k = pos.turn > 0 ? pos.wk : pos.bk, [x, y] = XY(k);
        ctx.s('rect', { x, y, width: 1, height: 1, fill: 'url(#' + gid + ')', class: 'cq-check' }, gMark);
      }
      for (let sq = 0; sq < 128; sq++) {
        if (sq & 0x88) { sq += 7; continue; }
        const pc = pos.b[sq];
        if (!pc) continue;
        const [x, y] = XY(sq);
        els[sq] = drawPiece(gPieces, pc, x, y, movable(pc) ? 'mine' : '');
      }
      if (sel >= 0) {
        targets(sel).forEach((m) => {
          const [x, y] = XY(m.to);
          if (pos.b[m.to] || (m.flags & Ch.F_EP)) ctx.s('circle', { cx: x + 0.5, cy: y + 0.5, r: 0.43, class: 'cq-ring' }, gDots);
          else ctx.s('circle', { cx: x + 0.5, cy: y + 0.5, r: 0.15, class: 'cq-dot' }, gDots);
        });
      }
      // whose move it is: a small disc on the frame, on that side of the board
      const bottom = (pos.turn > 0) !== flip;
      ctx.s('circle', { cx: 8.18, cy: bottom ? 7.82 : 0.18, r: 0.1, class: 'cq-turn ' + (pos.turn > 0 ? 'w' : 'b') }, gMark);
      drawList();
    }

    /* the side panel: the moves so far, and the buttons */
    const listEl = ctx.h('div.cq-moves');
    ctx.panel.appendChild(listEl);
    function drawList() {
      listEl.innerHTML = '';
      if (!sans.length) {
        listEl.appendChild(ctx.h('span.cq-none', kind === 'help' ? sideName(me) + ' moves first.' : sideName(me) + ' to play.'));
        return;
      }
      let no = d.no || 1, t = start.turn;
      sans.forEach((s, i) => {
        if (t > 0) listEl.appendChild(ctx.h('span.cq-no', no + '.'));
        else if (i === 0) listEl.appendChild(ctx.h('span.cq-no', no + '…'));
        listEl.appendChild(ctx.h('span.cq-mv' + (t > 0 ? '.w' : '.b') + (i === sans.length - 1 ? '.cur' : '') + (flags[i] ? '.' + flags[i] : ''), s + (flags[i] === 'ref' ? '!' : '')));
        if (t < 0) no++;
        t = -t;
      });
    }
    ctx.button('Turn the board', () => { flip = !flip; drawBoard(); render(); hintMem = null; gHint.innerHTML = ''; gFlash.innerHTML = ''; }, 'small');
    const backBtn = ctx.button('Take back', () => { if (!busy) ctx.undo(); }, 'small gold');
    backBtn.hidden = true;

    /* moving */
    function whyNot(pc) {
      if (over === 'win') ctx.say('Solved! Undo or Reset to play it again.', 'info');
      else if (over === 'fail') ctx.say('This try is over — **Take back** your move first.', 'warn');
      else if (!tableReady) ctx.say('A moment: the endgame table is still being set up.', 'info');
      else if (kind !== 'help' && (pc > 0) !== (me > 0)) ctx.say(foe + '\'s men are moved by the computer. You play ' + sideName(me) + '.', 'info');
      else if ((pc > 0) !== (pos.turn > 0)) ctx.say('It is ' + sideName(pos.turn) + '\'s move.', 'info');
    }
    function illegalNote(from, to) {
      const pc = pos.b[from];
      const pseudo = pos.pseudo([]).some((m) => m.from === from && m.to === to);
      if (pseudo) ctx.say('That would leave the ' + sideName(pc) + ' king in check.', 'warn');
      else if (pos.b[to] && (pos.b[to] > 0) === (pc > 0)) ctx.say('That square is taken by your own ' + pieceWord(pos.b[to]) + '.', 'warn');
      else ctx.say('A ' + pieceWord(pc) + ' cannot move like that.', 'warn');
    }
    function attempt(from, to, animate) {
      const ms = pos.legal().filter((m) => m.from === from && m.to === to);
      if (!ms.length) return false;
      if (ms.length > 1) { openPicker(ms, animate); return true; }
      play(ms[0], animate);
      return true;
    }
    function openPicker(ms, animate) {
      sel = -1;
      render();
      const [x, y] = XY(ms[0].to);
      const dir = y < 4 ? 1 : -1;
      picker = { ms, animate, boxes: [] };
      gPick.innerHTML = '';
      ctx.s('rect', { x: -0.4, y: -0.4, width: 8.8, height: 8.8, class: 'cq-shade' }, gPick);
      [Ch.QUEEN, Ch.KNIGHT, Ch.ROOK, Ch.BISHOP].forEach((t, i) => {
        const m = ms.find((mm) => abs(mm.promo) === t);
        const yy = y + dir * i;
        ctx.s('rect', { x: x + 0.03, y: yy + 0.03, width: 0.94, height: 0.94, rx: 0.16, class: 'cq-pick' }, gPick);
        drawPiece(gPick, t * pos.turn, x, yy, '');
        picker.boxes.push({ x, y: yy, m });
      });
      ctx.say('The pawn is promoted: choose its new rank.', 'info');
    }
    function closePicker() { picker = null; gPick.innerHTML = ''; render(); }
    function pickAt(pt) {
      const b = picker.boxes.find((bx) => pt[0] >= bx.x && pt[0] < bx.x + 1 && pt[1] >= bx.y && pt[1] < bx.y + 1);
      const pk = picker;
      closePicker();
      if (b) play(b.m, pk.animate); else ctx.say('');
    }

    function animateMove(m, done) {
      const el = els[m.from];
      if (!el || dead) { done(); return; }
      const ep = epoch;
      busy = true;
      gDrag.appendChild(el);
      const a = XY(m.from), b = XY(m.to);
      let rook = null, ra = null, rb = null;
      if (m.flags & Ch.F_CASTLE) {
        const rf = (m.to & 7) === 6 ? m.to + 1 : m.to - 2, rt = (m.to & 7) === 6 ? m.to - 1 : m.to + 1;
        rook = els[rf]; ra = XY(rf); rb = XY(rt);
      }
      const victim = m.cap ? els[(m.flags & Ch.F_EP) ? m.to - 16 * (m.p > 0 ? 1 : -1) : m.to] : null;
      const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const jump = abs(m.p) === Ch.KNIGHT ? 0.28 : 0;
      const dur = C.anim(150 + 45 * Math.min(6, dist));
      const t0 = root.performance ? root.performance.now() : Date.now();
      const step = (now) => {
        if (dead || ep !== epoch) return;
        const k = Math.min(1, (now - t0) / (dur || 1)), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        place(el, a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e - jump * Math.sin(k * Math.PI));
        if (rook) place(rook, ra[0] + (rb[0] - ra[0]) * e, ra[1] + (rb[1] - ra[1]) * e);
        if (victim) victim.style.opacity = String(1 - 0.85 * e);
        if (k < 1) root.requestAnimationFrame(step);
        else { busy = false; done(); }
      };
      root.requestAnimationFrame(step);
    }
    function slideBack(el, from, to, done) {
      const t0 = root.performance ? root.performance.now() : Date.now(), dur = C.anim(150), ep = epoch;
      busy = true;
      const step = (now) => {
        if (dead || ep !== epoch) return;
        const k = Math.min(1, (now - t0) / (dur || 1)), e = 1 - (1 - k) * (1 - k);
        place(el, from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e);
        if (k < 1) root.requestAnimationFrame(step);
        else { busy = false; done(); }
      };
      root.requestAnimationFrame(step);
    }

    function commit(m, san, flag) {
      pos.make(m);
      moves.push(m); sans.push(san); flags.push(flag || '');
      if (-pos.turn === counted) ctx.move();
      render();
      ctx.sfx(m.cap ? 'snap' : 'tap');
    }
    // the user's move
    function play(m, animate) {
      sel = -1;
      hintMem = null;
      gHint.innerHTML = '';
      gFlash.innerHTML = '';
      if (kind === 'ending' && table) { const v = table.probe(pos); needBefore = v >= 0 ? (v + 1) / 2 : null; }
      const san = pos.san(m);
      const go = () => { commit(m, san, ''); afterUser(); };
      if (animate) animateMove(m, go); else go();
    }
    // the computer's move, after a short pause; choose() -> { m, flag, ... } or null
    function reply(choose, after, pause) {
      busy = true;
      ctx.lockUndo(true);
      render();
      const ep = epoch;
      timer = setTimeout(() => {
        timer = null;
        if (dead || ep !== epoch) return;
        let r = null;
        try { r = choose(); } catch (e) { const all = pos.legal(); r = all.length ? { m: all[0] } : null; }
        if (!r || !r.m) { busy = false; ctx.lockUndo(false); after(null, ''); return; }
        const san = pos.san(r.m);
        animateMove(r.m, () => { commit(r.m, san, r.flag || ''); busy = false; ctx.lockUndo(false); after(r, san); });
      }, C.anim(pause == null ? 420 : pause));
    }
    function finish(state, msg) {
      over = state;
      note = msg || '';
      sel = -1;
      render();
      if (state === 'fail') {
        ctx.sfx('wrong');
        ctx.say(msg + ' **Take back** your move and try again.', 'warn');
        backBtn.hidden = false;
      } else ctx.say(msg, 'good');
      ctx.changed(state === 'fail' ? 'fail' : 'move');
    }
    const drawNow = () => pos.status() === 'stalemate' || pos.deadDraw();

    function afterUser() {
      const st = pos.status();
      if (kind === 'help') {
        if (st === 'mate') return pos.turn === me ? finish('win', 'Checkmate — worked out together.') : finish('fail', 'That mates the wrong king!');
        if (st === 'stalemate') return finish('fail', 'Stalemate: a draw, not a mate.');
        if (used() >= n && pos.turn === me) return finish('fail', 'White has made ' + (n === 1 ? 'its move' : 'all ' + word(n) + ' moves') + ', and there is no mate.');
        let ok = true;
        try { ok = new Ch.Solver(pos, { limit: 300000 }).helpPlies(2 * n - moves.length, 1).length > 0; } catch (e) { ok = true; }
        if (!ok) return finish('fail', 'From here no mate can come in time.');
        ctx.say(sideName(pos.turn) + ' to move.', '');
        ctx.changed('move');
        return;
      }
      if (kind === 'defend') {
        let dd = 0;
        try { dd = new Ch.Solver(pos, { limit: 800000 }).dist(n); } catch (e) { dd = 0; }
        if (!dd) return finish('win', 'Held! ' + foe + ' has no mate in ' + word(n) + ' any more.');
        return punish(dd);
      }
      if (kind === 'draw') {
        if (drawNow()) return finish('win', drawWords());
        const left = n - used();
        ctx.say(foe + ' is thinking…', 'info');
        reply(() => {
          const S = new Ch.Solver(pos, { limit: 500000 });
          const all = pos.legal(), esc = [];
          for (const r of all) { pos.make(r); S.pos = pos; let ok = true; try { ok = S.saverHolds(left); } catch (e) { ok = true; } pos.unmake(r); if (!ok) esc.push(r); }
          if (esc.length) return { m: ctx.rng.pick(esc), esc: true, flag: 'ref' };
          return { m: ctx.rng.pick(all) };
        }, (r, san) => {
          if (drawNow()) return finish('win', foe + ' plays ' + san + ' — ' + drawWords());
          if (!r) return finish('fail', 'Something went wrong.');
          if (r.esc) return finish('fail', foe + ' answers ' + san + ' and slips out of the trap.');
          if (left <= 0) return finish('fail', 'Your moves are used up and the game goes on.');
          ctx.say(foe + ' plays ' + san + '. Your move.', '');
          ctx.changed('move');
        });
        return;
      }
      // mate problems and endings: the computer defends
      if (st === 'mate') return finish('win', kind === 'ending' ? (used() <= p.par ? 'Checkmate, in the fewest moves possible!' : 'Checkmate in ' + C.plural(used(), 'move') + '.') : 'Checkmate!');
      if (st === 'stalemate') return finish('fail', 'Stalemate! ' + foe + ' has no legal move but is not in check — and that is a draw.');
      const left = limit - used();
      if (left <= 0) return finish('fail', kind === 'ending' ? 'All ' + limit + ' moves are used up without mate.' : 'That was your ' + ordinal(limit) + ' move, and ' + foe + ' is not mated.');
      ctx.say(foe + ' is thinking…', 'info');
      if (kind === 'ending') {
        reply(() => {
          const all = pos.legal(), caps = all.filter((x) => x.cap);
          if (caps.length) return { m: caps[0], cap: true, flag: 'ref' };
          let best = -1, list = [];
          for (const x of all) {
            pos.make(x);
            const v = table.probe(pos);
            pos.unmake(x);
            const val = v < 0 ? 999 : v;
            if (val > best) { best = val; list = [x]; } else if (val === best) list.push(x);
          }
          return { m: ctx.rng.pick(list) };
        }, (r, san) => {
          if (!r) return finish('fail', 'Stalemate!');
          if (r.cap) return finish('fail', 'The king takes your ' + NAME[abs(r.m.cap)] + ' — and without it there is no mate: a draw.');
          const v = table.probe(pos);
          if (v < 0) return finish('fail', 'The win has slipped away.');
          const need = (v + 1) / 2, left2 = limit - used();
          if (need > left2) return finish('fail', foe + ' plays ' + san + '. Mate now needs ' + need + ' more moves, but only ' + left2 + ' are left.');
          let msg = foe + ' plays ' + san + '.';
          if (needBefore != null && need > needBefore - 1) msg += ' (Not the quickest: mate now takes ' + need + ' more.)';
          ctx.say(msg, '');
          ctx.changed('move');
        }, 260);
        return;
      }
      reply(() => {
        const r = bestDefence(new Ch.Solver(pos, { limit: 800000 }), left, ctx.rng);
        return r ? { m: r.m, esc: r.esc, flag: r.esc ? 'ref' : '' } : null;
      }, (r, san) => {
        if (!r) return finish('fail', 'Stalemate!');
        if (r.esc) return finish('fail', foe + ' answers **' + san + '**! — now there is no mate in time.');
        ctx.say(foe + ' answers ' + san + '. Your move' + (left === 1 ? ' — and it must be mate.' : '.'), '');
        ctx.changed('move');
      });
    }
    function drawWords() {
      if (pos.deadDraw()) return 'nothing is left that could ever mate: a draw!';
      return 'stalemate! ' + sideName(pos.turn) + ' has no legal move and is not in check: a draw.';
    }
    // a wrong defence: the computer shows the mate that follows
    function punish(dd) {
      let left = dd;
      const next = () => {
        if (pos.status() === 'mate') return finish('fail', 'Mate. That move did not hold.');
        reply(() => {
          const S = new Ch.Solver(pos, { limit: 800000 });
          if (pos.turn !== me) { const a = bestAttack(S, left, null); return a ? { m: a.m } : null; }
          const r = bestDefence(S, left, ctx.rng);
          return r ? { m: r.m } : null;
        }, (r) => {
          if (!r) return finish('fail', 'That move did not hold.');
          if (pos.turn === me) left--;
          next();
        }, 520);
      };
      ctx.say(foe + ' pounces…', 'warn');
      next();
    }

    /* pointer */
    wb.handlers.board = {
      down(pt) {
        if (picker) { pickAt(pt); return true; }
        if (busy) return false;
        const s = sqAt(pt);
        if (s < 0) { if (sel >= 0) { sel = -1; render(); } return false; }
        const pc = pos.b[s];
        if (sel >= 0 && s !== sel && targets(sel).some((m) => m.to === s)) { g = { to: s, from: sel }; return true; }
        if (pc && movable(pc)) { g = { from: s, p0: pt, moved: false }; return true; }
        if (sel >= 0) { sel = -1; render(); }
        if (pc) whyNot(pc);
        return false;
      },
      move(pt) {
        if (!g || g.to != null) return;
        if (!g.moved && G.dist(pt, g.p0) < 0.15) return;
        if (!g.moved) {
          g.moved = true;
          sel = g.from;
          render();
          const el0 = els[g.from];
          if (el0) { gDrag.appendChild(el0); el0.classList.add('lift'); }
        }
        const el = els[g.from];
        if (el) place(el, pt[0] - 0.5, pt[1] - 0.62);
      },
      up(pt) {
        const gg = g;
        g = null;
        if (!gg) return;
        if (gg.to != null) { attempt(gg.from, gg.to, true); return; }
        if (!gg.moved) {
          sel = sel === gg.from ? -1 : gg.from;
          render();
          if (sel >= 0 && !targets(sel).length) ctx.say('That ' + pieceWord(pos.b[sel]) + ' has no legal move.', 'warn');
          return;
        }
        const t = sqAt(pt);
        if (t >= 0 && t !== gg.from && targets(gg.from).some((m) => m.to === t)) { attempt(gg.from, t, false); return; }
        if (t >= 0 && t !== gg.from) illegalNote(gg.from, t);
        const el = els[gg.from];
        sel = t === gg.from ? gg.from : -1;
        if (el) slideBack(el, [pt[0] - 0.5, pt[1] - 0.62], XY(gg.from), render); else render();
      }
    };

    /* hints: first the piece, then the square */
    function pulse(sq, cls) {
      const [x, y] = XY(sq);
      const el = ctx.s('rect', { x: x + 0.04, y: y + 0.04, width: 0.92, height: 0.92, rx: 0.1, class: 'cq-pulse' + (cls ? ' ' + cls : '') }, gFlash);
      setTimeout(() => el.remove(), 3600);
    }
    function arrow(a, b) {
      const [x1, y1] = XY(a), [x2, y2] = XY(b);
      const p1 = [x1 + 0.5, y1 + 0.5], p2 = [x2 + 0.5, y2 + 0.5];
      const L = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) || 1, ux = (p2[0] - p1[0]) / L, uy = (p2[1] - p1[1]) / L;
      const e = [p2[0] - ux * 0.3, p2[1] - uy * 0.3];
      gHint.innerHTML = '';
      ctx.s('path', { d: 'M' + p1[0] + ' ' + p1[1] + 'L' + e[0] + ' ' + e[1], class: 'cq-arrow' }, gHint);
      ctx.s('path', { d: 'M' + (p2[0] - ux * 0.05) + ' ' + (p2[1] - uy * 0.05) + 'L' + (e[0] - uy * 0.22) + ' ' + (e[1] + ux * 0.22) + 'L' + (e[0] + uy * 0.22) + ' ' + (e[1] - ux * 0.22) + 'Z', class: 'cq-arrowhead' }, gHint);
    }
    // the move the solution continues with from here, or null
    function bestNow() {
      const S = new Ch.Solver(pos, { limit: 800000 });
      try {
        if (kind === 'mate') { if (pos.turn !== me) return null; const a = bestAttack(S, limit - used(), moves.length ? null : d.key); return a && a.m; }
        if (kind === 'help') {
          const done = moves.map(Ch.uci);
          if (done.every((u, i) => d.sol[i] === u) && d.sol[done.length]) return pos.moveFromUci(d.sol[done.length]);
          const s = S.helpPlies(2 * n - moves.length, 1);
          return s.length ? s[0][0] : null;
        }
        if (kind === 'ending') {
          let best = 999, bm = null;
          for (const x of pos.legal()) { pos.make(x); const v = table.probe(pos); pos.unmake(x); if (v >= 0 && v < best) { best = v; bm = x; } }
          return bm;
        }
        if (kind === 'defend') return moves.length ? null : pos.moveFromUci(d.key);
        if (kind === 'draw') {
          if (!moves.length) return pos.moveFromUci(d.key);
          const ks = S.drawKeys(n - used());
          return ks[0] || null;
        }
      } catch (e) { return null; }
      return null;
    }

    /* the solution, played out */
    function resetToStart() {
      epoch++;
      pos = start.clone(); moves = []; sans = []; flags = []; over = null; note = '';
      sel = -1; backBtn.hidden = true;
      ctx.move(0);
      render();
    }
    function solvedNow() {
      const st = pos.status();
      if (kind === 'mate') return st === 'mate' && pos.turn === -me && used() <= limit;
      if (kind === 'ending') return st === 'mate' && used() <= limit;
      if (kind === 'help') return st === 'mate' && pos.turn === me;
      if (kind === 'draw') return drawNow() && used() <= n;
      return over === 'win';
    }
    function runSolution(nextMove) {
      const ep = epoch;
      busy = true;
      ctx.lockUndo(true);
      const stepOnce = () => {
        timer = null;
        if (dead || ep !== epoch) return;
        let m = null;
        if (!pos.status() && !(kind === 'draw' && drawNow())) { try { m = nextMove(); } catch (e) { m = null; } }
        if (!m) {
          busy = false;
          ctx.lockUndo(false);
          if (solvedNow()) { over = 'win'; ctx.say('There it is.', 'good'); }
          render();
          ctx.changed('solve');
          return;
        }
        const san = pos.san(m);
        animateMove(m, () => { commit(m, san, ''); busy = true; timer = setTimeout(stepOnce, C.anim(420)); });
      };
      stepOnce();
    }
    function solve() {
      epoch++;
      clearTimeout(timer);
      timer = null;
      if (picker) closePicker();
      if (over === 'win' || solvedNow()) { over = 'win'; ctx.changed('solve'); return; }
      if (!tableReady) { timer = setTimeout(solve, 60); return; }
      busy = false;
      let fresh = !!over || (kind !== 'help' && pos.turn !== me) || kind === 'help' || kind === 'defend';
      if (!fresh && kind === 'mate') { try { fresh = !new Ch.Solver(pos, { limit: 600000 }).attack(limit - used()); } catch (e) { fresh = true; } }
      if (!fresh && kind === 'ending') { const v = table.probe(pos); fresh = v < 0 || (v + 1) / 2 > limit - used(); }
      if (!fresh && kind === 'draw') { try { fresh = !new Ch.Solver(pos, { limit: 600000 }).saverHolds(n - used()); } catch (e) { fresh = true; } }
      if (fresh) resetToStart();
      const line = !moves.length && kind === 'mate' && d.line ? d.line.slice() : kind === 'help' ? d.sol.slice() : null;
      let li = 0;
      runSolution(() => {
        if (line) return li < line.length ? pos.moveFromUci(line[li++]) : null;
        if (kind === 'defend') { if (moves.length) { over = 'win'; return null; } return pos.moveFromUci(d.key); }
        const S = new Ch.Solver(pos, { limit: 1e6 });
        if (kind === 'ending') {
          if (pos.turn === me) return bestNow();
          let best = -1, bm = null;
          for (const x of pos.legal()) { pos.make(x); const v = table.probe(pos); pos.unmake(x); if (v > best) { best = v; bm = x; } }
          return bm;
        }
        if (kind === 'draw') {
          if (pos.turn === me) return bestNow();
          return pos.legal()[0] || null;
        }
        if (pos.turn === me) { const a = bestAttack(S, limit - used(), moves.length ? null : d.key); return a ? a.m : null; }
        const r = bestDefence(S, limit - used(), null);
        return r ? r.m : null;
      });
    }

    /* the goal and the start */
    const goals = {
      mate: 'Checkmate the ' + foe.toLowerCase() + ' king in ' + (n === 1 ? 'one move' : word(n) + ' moves') + ', whatever ' + foe + ' does.',
      help: 'Move both sides: ' + sideName(me) + ' first, then in turn, until ' + sideName(-me) + ' mates on its ' + ordinal(n) + ' move.',
      ending: 'Mate the lone king within ' + limit + ' moves.',
      defend: 'Find the only move that stops ' + foe + ' mating in ' + word(n) + '.',
      draw: 'Save the game: force stalemate, or leave nothing that could mate, within ' + (n === 1 ? 'one move' : word(n) + ' moves') + '.'
    };
    ctx.setGoal(p.goal || goals[kind]);
    drawBoard();
    render();
    ctx.say(kind === 'help' ? sideName(me) + ' moves first.' : sideName(me) + ' to play.', '');
    if (kind === 'ending') {
      const mat = Ch.Table.materialOf(start);
      table = Ch.Table.get(mat);
      ctx.stat('Limit', limit);
      tableReady = table.done;
      if (tableReady) render();
      else {
        tableReady = false;
        ctx.say('Setting up the endgame table…', 'info');
        const work = () => {
          workT = null;
          if (dead) return;
          if (table.step(24)) { tableReady = true; render(); ctx.say(sideName(me) + ' to play.', ''); }
          else workT = setTimeout(work, 0);
        };
        workT = setTimeout(work, 30);
      }
    }

    return {
      check() {
        if (over === 'win' || (over !== 'fail' && solvedNow())) {
          const r = { solved: true, msg: note || (kind === 'draw' ? 'Saved — a draw.' : kind === 'defend' ? 'The only defence.' : 'Checkmate!') };
          if (kind === 'ending') {
            const u = used();
            r.perfect = u <= p.par;
            r.stars = u <= p.par ? 3 : u <= p.par + Math.ceil((limit - p.par) / 2) ? 2 : 1;
            r.msg = u <= p.par ? 'Mate in ' + u + ' — par, the fewest possible.' : 'Mate in ' + u + ' (par ' + p.par + ').';
          }
          return r;
        }
        if (over === 'fail') return { solved: false, msg: note || 'That try failed.' };
        if (kind === 'mate' || kind === 'ending') return { solved: false, msg: 'No mate yet: ' + C.plural(Math.max(0, limit - used()), 'move') + ' left.' };
        return { solved: false, msg: goals[kind] };
      },
      hint() {
        if (over === 'win') return 'Solved already!';
        if (busy) return 'A moment — ' + foe + ' is thinking.';
        if (!tableReady) return 'The endgame table is still being set up — try again in a second.';
        if (over === 'fail') return { text: 'This try has failed: **Take back** (or Undo) and look again.', show() { backBtn.classList.add('flash'); setTimeout(() => backBtn.classList.remove('flash'), 1600); } };
        const m = bestNow();
        if (!m) return 'From here it cannot be done in time — take back a move or two.';
        const u = Ch.uci(m), k = pos.key();
        if (!hintMem || hintMem.u !== u || hintMem.k !== k) hintMem = { u, k, stage: 0 };
        if (hintMem.stage === 0) {
          hintMem.stage = 1;
          const who = kind === 'help' ? sideName(m.p) + '\'s ' : 'the ';
          return { text: 'Move ' + who + pieceWord(m.p) + ' on ' + sqn(m.from) + '.', show() { pulse(m.from); } };
        }
        hintMem.stage = 2;
        let extra = '';
        if (kind === 'ending') { pos.make(m); const v = table.probe(pos); pos.unmake(m); if (v >= 0) extra = ' — mate in ' + Math.ceil(v / 2) + ' more from there'; }
        else if (kind === 'mate' && !moves.length && n > 1) extra = pos.gives(m) ? '' : ' — a quiet move';
        return { text: 'Play **' + pos.san(m) + '**' + extra + '.', show() { pulse(m.to); arrow(m.from, m.to); } };
      },
      solve,
      explain() {
        try {
          if (kind === 'mate') return explainMate(d.fen, n, d.key, d.line);
          if (kind === 'help') return explainHelp(d.fen, d.sol);
          if (kind === 'ending') return 'With best play on both sides the mate takes ' + C.plural(p.par, 'move') + ' — the par. ' + (LESSON[Ch.Table.materialOf(start)] || []).join(' ');
          if (kind === 'defend' || kind === 'draw') return 'The move is **' + oneMove(me, 0, start.san(start.moveFromUci(d.key))) + '**.';
        } catch (e) { return ''; }
        return '';
      },
      getState() { return { h: moves.map(Ch.uci), f: flags.slice(), o: over, t: note }; },
      setState(s) {
        epoch++;
        ctx.lockUndo(false);
        clearTimeout(timer);
        timer = null;
        busy = false;
        picker = null;
        gPick.innerHTML = '';
        gFlash.innerHTML = '';
        gHint.innerHTML = '';
        pos = start.clone(); moves = []; sans = []; flags = [];
        for (const u of (s && s.h) || []) {
          const m = pos.moveFromUci(u);
          if (!m) break;
          sans.push(pos.san(m));
          pos.make(m);
          moves.push(m);
        }
        flags = ((s && s.f) || []).slice(0, moves.length);
        while (flags.length < moves.length) flags.push('');
        over = (s && s.o) || null;
        note = (s && s.t) || '';
        sel = -1;
        hintMem = null;
        backBtn.hidden = over !== 'fail';
        render();
        if (over === 'fail') ctx.say(note + ' **Take back** your move and try again.', 'warn');
        else if (!over) ctx.say(kind === 'help' || pos.turn === me ? sideName(pos.turn) + ' to play.' : '', '');
      },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.key === 'Escape' && (picker || sel >= 0)) { if (picker) closePicker(); sel = -1; render(); return true; }
        return false;
      },
      destroy() { dead = true; clearTimeout(timer); clearTimeout(workT); }
    };
  }

  /* ---------- checking the data ---------- */

  function replayLine(pos, ucis) {
    const q = pos.clone();
    for (const u of ucis) { const m = q.moveFromUci(u); if (!m) return null; q.make(m); }
    return q;
  }
  function verifyData(p) {
    const Ch = CH(), d = p.data;
    if (!d || !d.fen) return 'no position';
    let pos;
    try { pos = Ch.fromFEN(d.fen); } catch (e) { return e.message; }
    const pr = pos.problems();
    if (pr) return pr;
    if (pos.status()) return 'the game is already over';
    const kind = d.kind || 'mate';
    if (d.last) {
      const f = Ch.sqOf(d.last.slice(0, 2)), t = Ch.sqOf(d.last.slice(2, 4));
      if (pos.b[f] || !pos.b[t] || (pos.b[t] > 0) === (pos.turn > 0)) return 'the last move does not fit the position';
    }
    const S = new Ch.Solver(pos, { limit: 8e6 });
    try {
      if (kind === 'mate') {
        const n = d.n;
        if (!(n >= 1 && n <= 5)) return 'n must be 1..5';
        if (p.par != null && p.par !== n) return 'par must equal n';
        if (n > 1 && S.attack(n - 1)) return 'there is a quicker mate than in ' + n;
        const ks = S.keys(n, d.unique ? 2 : 1);
        if (!ks.length) return 'no mate in ' + n;
        if (d.unique && ks.length > 1) return 'more than one key: ' + ks.map((m) => pos.san(m)).join(', ');
        const km = d.key ? pos.moveFromUci(d.key) : null;
        if (d.key && !km) return 'the key is not a legal move';
        if (km) {
          if (d.unique && Ch.uci(ks[0]) !== d.key) return 'the key is ' + Ch.uci(ks[0]) + ', not ' + d.key;
          pos.make(km);
          const ok = new Ch.Solver(pos, { limit: 8e6 }).defend(n);
          pos.unmake(km);
          if (!ok) return 'the stored key does not force mate in ' + n;
        }
        if (d.line) {
          if (d.key && d.line[0] !== d.key) return 'the line does not start with the key';
          const q = replayLine(pos, d.line);
          if (!q) return 'the line has an illegal move';
          if (q.status() !== 'mate' || Math.ceil(d.line.length / 2) > n) return 'the line does not end in mate within ' + n;
        }
        return null;
      }
      if (kind === 'help') {
        const n = d.n;
        if (p.par != null && p.par !== n) return 'par must equal n';
        for (let k = 1; k < n; k++) if (S.help(k, 1).length) return 'a shorter helpmate exists (in ' + k + ')';
        const sols = S.help(n, 2);
        if (sols.length !== 1) return sols.length ? 'more than one solution' : 'no solution';
        if (sols[0].map(Ch.uci).join() !== (d.sol || []).join()) return 'the stored solution differs from ' + sols[0].map(Ch.uci).join(' ');
        return null;
      }
      if (kind === 'ending') {
        const mat = Ch.Table.materialOf(pos);
        if (!mat) return 'not king and queen, rook or two bishops against a lone king';
        if (pos.turn < 0) return 'White must be to move';
        const tb = Ch.Table.get(mat);
        if (!tb.done) tb.build();
        const v = tb.probe(pos);
        if (v < 0) return 'there is no forced mate';
        const dtm = (v + 1) / 2;
        if (p.par !== dtm) return 'par is ' + p.par + ' but the quickest mate takes ' + dtm;
        if (!(d.limit >= dtm)) return 'the limit is below par';
        return null;
      }
      if (kind === 'defend') {
        const rs = S.replies(d.n);
        const holds = rs.filter((r) => !r.d);
        if (holds.length !== 1) return holds.length ? holds.length + ' moves hold' : 'no move holds';
        if (Ch.uci(holds[0].m) !== d.key) return 'the move that holds is ' + Ch.uci(holds[0].m);
        return null;
      }
      if (kind === 'draw') {
        if (S.saverHolds(d.n - 1)) return 'a quicker draw exists';
        const ks = S.drawKeys(d.n);
        if (ks.length !== 1) return ks.length ? ks.length + ' moves save the game' : 'no move saves the game';
        if (Ch.uci(ks[0]) !== d.key) return 'the saving move is ' + Ch.uci(ks[0]);
        return null;
      }
    } catch (e) {
      return e === Ch.ABORT ? 'the search ran out of time' : 'the search failed: ' + e.message;
    }
    return 'unknown kind ' + kind;
  }

  /* ---------- small pictures ---------- */

  function thumbSVG(fen, flip, last) {
    const Ch = CH(), pos = Ch.fromFEN(fen);
    let s = '<svg viewBox="-0.3 -0.3 8.6 8.6" preserveAspectRatio="xMidYMid meet"><rect x="-0.22" y="-0.22" width="8.44" height="8.44" rx=".14" fill="#6b4a2b"/>';
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) s += '<rect x="' + c + '" y="' + r + '" width="1.01" height="1.01" fill="' + ((r + c) % 2 ? '#b88a5a' : '#ecd9b5') + '"/>';
    const XY = (sq) => { const f = sq & 7, r = sq >> 4; return flip ? [7 - f, r] : [f, 7 - r]; };
    if (last) [last.slice(0, 2), last.slice(2, 4)].forEach((nm) => { const [x, y] = XY(Ch.sqOf(nm)); s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="rgba(255,214,90,.45)"/>'; });
    for (const sq of pos.pieces()) {
      const pc = pos.b[sq], [x, y] = XY(sq);
      s += '<g transform="translate(' + x + ' ' + y + ') scale(.01)">' + pieceSVG(letterOf(pc), pc > 0, true) + '</g>';
    }
    const bottom = (pos.turn > 0) !== !!flip;
    s += '<circle cx="8.08" cy="' + (bottom ? 7.92 : 0.08) + '" r=".16" fill="' + (pos.turn > 0 ? '#f7f2e7' : '#33313b') + '" stroke="#2b2118" stroke-width=".05"/>';
    return s + '</svg>';
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'chessmate',
    name: 'Chess problems',
    deps: ['js/lib/chess-rules.js'],
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'paint', 'loupe'],
    stateVersion: 1,
    generates: ['mate-in-one', 'mate-in-two', 'helpmates', 'chess-endings'],
    about: '**Moving:** drag a piece to its new square, or click it and then click one of the dots (a ring marks a capture). A pawn that reaches the far rank asks which piece it becomes. *Turn the board* shows the game from the other side.\n\n' +
      '**Mate problems:** you play the side named in the statement; the computer answers every move with its most stubborn defence. A wrong first move is refuted at once — **Take back** (or Undo) and try another. The move list in the side panel keeps the score.\n\n' +
      '**Helpmates:** you move both sides, in turn, Black first: the two work together so that White mates in the stated number of moves.\n\n' +
      '**Endgame lessons:** mate the lone king before the move limit runs out. The computer defends perfectly from an endgame table; par is the fewest moves possible. Some lessons ask you to save a lost game instead.\n\n' +
      'Hints name the piece to move first, then the square.',

    generate(rng, level, meta) {
      const id = meta && meta.id;
      if (id === 'mate-in-one' || id === 'mate-in-two') return genMate(rng, level, id);
      if (id === 'helpmates') return genHelp(rng, level);
      if (id === 'chess-endings') return genEnding(rng, level);
      return null;
    },

    verify(p) {
      let err;
      try { err = verifyData(p); } catch (e) { err = 'threw ' + e.message; }
      return err ? { ok: false, err } : { ok: true };
    },

    mount,

    thumb(p) {
      const d = p.data;
      let flip = d.flip;
      if (flip == null) flip = (d.kind || 'mate') !== 'help' && / b /.test(d.fen);
      try { return thumbSVG(d.fen, flip, d.last); } catch (e) { return ''; }
    }
  });

  C.chessmate = {
    mateInfo, explainMate, explainHelp, mainLine, randomSetup, setupFor, mateCandidate, helpCandidate, endingCandidate,
    mateProblem, helpProblem, endingProblem, mateStatement, levelOf, hardness, elegance, titleFor, themeOf, TITLES, END_TITLES,
    fenFrom, lineText, fmtLine, sansOf, oneMove, limitFor, LESSON, MAT_WORDS, genMate, genHelp, genEnding, verifyData,
    word, sideName, idlePieces, tries, variations, CUTS, bestAttack, bestDefence, thumbSVG, pieceSVG
  };

  C.css('chessmate', `
    .cq-frame { fill: #6b4a2b; stroke: rgba(0,0,0,.4); stroke-width: .03; }
    .cq-sq.light { fill: #ecd9b5; }
    .cq-sq.dark { fill: #b88a5a; }
    .cq-coord { font: 700 .2px "Segoe UI", system-ui, sans-serif; fill: #e9d7b6; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .cq-mark { pointer-events: none; }
    .cq-mark.last { fill: rgba(255, 214, 90, .46); }
    .cq-mark.sel { fill: rgba(92, 170, 96, .5); }
    .cq-check { pointer-events: none; }
    .cq-turn { stroke: #1d160f; stroke-width: .03; pointer-events: none; }
    .cq-turn.w { fill: #f7f2e7; }
    .cq-turn.b { fill: #2b2a33; }
    .cq-piece { cursor: default; }
    .cq-piece.mine { cursor: grab; }
    .cq-piece.lift { filter: drop-shadow(0 6px 5px rgba(0,0,0,.35)); cursor: grabbing; }
    .cq-p .cq-pb { stroke-width: 3; stroke-linejoin: round; }
    .cq-p.wht .cq-pb { fill: #f7f2e7; stroke: #3a3228; }
    .cq-p.blk .cq-pb { fill: #33313b; stroke: #0d0c10; }
    .cq-p .cq-pl { fill: none; stroke-width: 2.4; stroke-linecap: round; }
    .cq-p.wht .cq-pl { stroke: #3a3228; }
    .cq-p.blk .cq-pl { stroke: #cfcac0; }
    .cq-p.wht .cq-pd { fill: #3a3228; }
    .cq-p.blk .cq-pd { fill: #e8e2d6; }
    .cq-dot { fill: rgba(30, 70, 40, .38); pointer-events: none; }
    .cq-ring { fill: none; stroke: rgba(30, 70, 40, .42); stroke-width: .08; pointer-events: none; }
    .cq-shade { fill: rgba(20, 16, 12, .45); }
    .cq-pick { fill: #f4ead6; stroke: #e0a100; stroke-width: .05; cursor: pointer; }
    .cq-pulse { fill: rgba(255, 209, 102, .35); stroke: #e0a100; stroke-width: .06; pointer-events: none; animation: cqpulse .8s ease-in-out infinite alternate; }
    @keyframes cqpulse { to { opacity: .35; } }
    .cq-arrow { fill: none; stroke: rgba(224, 140, 0, .85); stroke-width: .16; stroke-linecap: round; pointer-events: none; }
    .cq-arrowhead { fill: rgba(224, 140, 0, .9); pointer-events: none; }
    .cq-moves { display: flex; flex-wrap: wrap; gap: 2px 6px; align-items: baseline; margin: 4px 0 8px; padding: 8px 10px; border-radius: 8px; background: var(--panel-2); font: 600 14px "Segoe UI", system-ui, sans-serif; line-height: 1.6; min-height: 1.6em; }
    .cq-moves .cq-no { color: var(--muted); font-weight: 500; }
    .cq-moves .cq-mv { color: var(--text); padding: 0 3px; border-radius: 4px; }
    .cq-moves .cq-mv.cur { background: rgba(255, 214, 90, .28); }
    .cq-moves .cq-mv.ref { color: var(--red); }
    .cq-moves .cq-none { color: var(--muted); font-weight: 500; }
    .btn.flash { box-shadow: 0 0 0 3px var(--gold); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
