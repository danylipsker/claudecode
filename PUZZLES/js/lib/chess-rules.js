/* The Puzzle Cabinet · js/lib/chess-rules.js
 *
 * The rules of chess and the searches behind engines/chessmate.js.
 *
 *   Cabinet.Chess.fromFEN(fen) -> Pos      a position (0x88 board: sq = rank * 16 + file, a1 = 0, h8 = 119)
 *   pos.legal() -> [move]                   every legal move (castling, en passant, promotion)
 *   pos.make(m) / pos.unmake(m)             play and take back (keeps a 2 × 32-bit hash)
 *   pos.san(m) / pos.moveFromSan('Nf3')     algebraic notation
 *   pos.inCheck(), pos.hasLegal(), pos.status() -> 'mate' | 'stalemate' | ''
 *   Chess.perft(pos, depth)                 counting leaves, to test the rules
 *   Chess.Solver(pos)                       mate in n (keys, defences, best reply), helpmates,
 *                                           forced goals (stalemate tricks)
 *   Chess.Table(material)                   an endgame table (K + Q, R or two bishops against K),
 *                                           built backwards from the mates, step by step
 *
 * Moves are objects { from, to, p, cap, promo, flags } with signed pieces:
 * 1 pawn, 2 knight, 3 bishop, 4 rook, 5 queen, 6 king; black pieces negative.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet || (root.Cabinet = {});

  const PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6;
  const LETTER = ' PNBRQK';
  const FILES = 'abcdefgh';
  const N_OFF = [33, 31, 18, 14, -33, -31, -18, -14];
  const K_OFF = [1, -1, 16, -16, 15, 17, -15, -17];
  const B_DIR = [15, 17, -15, -17];
  const R_DIR = [1, -1, 16, -16];
  const Q_DIR = [1, -1, 16, -16, 15, 17, -15, -17];
  const F_EP = 1, F_CASTLE = 2, F_DOUBLE = 4;
  // castling rights: 1 white short, 2 white long, 4 black short, 8 black long
  const CASTLE_MASK = new Uint8Array(128).fill(15);
  CASTLE_MASK[4] = 12; CASTLE_MASK[0] = 13; CASTLE_MASK[7] = 14;
  CASTLE_MASK[116] = 3; CASTLE_MASK[112] = 7; CASTLE_MASK[119] = 11;

  const sqName = (sq) => FILES[sq & 7] + ((sq >> 4) + 1);
  const sqOf = (name) => (name.charCodeAt(1) - 49) * 16 + (name.charCodeAt(0) - 97);
  const onBoard = (sq) => sq >= 0 && !(sq & 0x88);

  /* ---------- hashing (Zobrist, two 32-bit halves) ---------- */

  let zs = 0x2545F491;
  const zr = () => {
    zs = (zs + 0x6D2B79F5) >>> 0;
    let t = zs;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) | 0;
  };
  const Z1 = new Int32Array(13 * 128), Z2 = new Int32Array(13 * 128);
  for (let i = 0; i < Z1.length; i++) { Z1[i] = zr(); Z2[i] = zr(); }
  const ZT1 = zr(), ZT2 = zr();
  const ZC1 = new Int32Array(16), ZC2 = new Int32Array(16), ZE1 = new Int32Array(8), ZE2 = new Int32Array(8);
  for (let i = 0; i < 16; i++) { ZC1[i] = zr(); ZC2[i] = zr(); }
  for (let i = 0; i < 8; i++) { ZE1[i] = zr(); ZE2[i] = zr(); }

  /* ---------- the position ---------- */

  function Pos() {
    this.b = new Int8Array(128);
    this.turn = 1;          // 1 white, -1 black
    this.castle = 0;
    this.ep = -1;           // the square a pawn may capture onto en passant
    this.half = 0;
    this.full = 1;
    this.wk = -1;
    this.bk = -1;
    this.h1 = 0;
    this.h2 = 0;
    this.stack = [];
  }
  const P = Pos.prototype;

  P.rehash = function () {
    let h1 = 0, h2 = 0;
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const p = this.b[sq];
      if (p) { h1 ^= Z1[(p + 6) * 128 + sq]; h2 ^= Z2[(p + 6) * 128 + sq]; }
    }
    if (this.turn < 0) { h1 ^= ZT1; h2 ^= ZT2; }
    h1 ^= ZC1[this.castle]; h2 ^= ZC2[this.castle];
    if (this.ep >= 0) { h1 ^= ZE1[this.ep & 7]; h2 ^= ZE2[this.ep & 7]; }
    this.h1 = h1; this.h2 = h2;
  };
  // a 53-bit number for maps
  P.key = function () { return (this.h1 >>> 0) * 0x200000 + (this.h2 >>> 11); };

  P.clone = function () {
    const q = new Pos();
    q.b.set(this.b);
    q.turn = this.turn; q.castle = this.castle; q.ep = this.ep; q.half = this.half; q.full = this.full;
    q.wk = this.wk; q.bk = this.bk; q.h1 = this.h1; q.h2 = this.h2;
    return q;
  };

  P.attacked = function (sq, by) {
    const b = this.b;
    let t;
    if (by > 0) {
      t = sq - 15; if (!(t & 0x88) && b[t] === PAWN) return true;
      t = sq - 17; if (!(t & 0x88) && b[t] === PAWN) return true;
    } else {
      t = sq + 15; if (!(t & 0x88) && b[t] === -PAWN) return true;
      t = sq + 17; if (!(t & 0x88) && b[t] === -PAWN) return true;
    }
    const nn = KNIGHT * by, kk = KING * by, bb = BISHOP * by, rr = ROOK * by, qq = QUEEN * by;
    for (let i = 0; i < 8; i++) { t = sq + N_OFF[i]; if (!(t & 0x88) && b[t] === nn) return true; }
    for (let i = 0; i < 8; i++) { t = sq + K_OFF[i]; if (!(t & 0x88) && b[t] === kk) return true; }
    for (let i = 0; i < 4; i++) {
      const d = B_DIR[i];
      t = sq + d;
      while (!(t & 0x88)) { const c = b[t]; if (c) { if (c === bb || c === qq) return true; break; } t += d; }
    }
    for (let i = 0; i < 4; i++) {
      const d = R_DIR[i];
      t = sq + d;
      while (!(t & 0x88)) { const c = b[t]; if (c) { if (c === rr || c === qq) return true; break; } t += d; }
    }
    return false;
  };
  // every square of `by`'s pieces that attack sq (for explanations and highlights)
  P.attackers = function (sq, by) {
    const out = [], b = this.b;
    for (let s = 0; s < 128; s++) {
      if (s & 0x88) { s += 7; continue; }
      const p = b[s];
      if (!p || (p > 0) !== (by > 0)) continue;
      if (this.hits(s, sq)) out.push(s);
    }
    return out;
  };
  // does the piece on `from` attack square `to` (ignoring pins)?
  P.hits = function (from, to) {
    const b = this.b, p = b[from], t = p > 0 ? p : -p, s = p > 0 ? 1 : -1;
    const d = to - from;
    if (!p || from === to) return false;
    if (t === PAWN) return d === 16 * s + 1 || d === 16 * s - 1;
    if (t === KNIGHT) return N_OFF.includes(d);
    if (t === KING) return K_OFF.includes(d);
    const dirs = t === BISHOP ? B_DIR : t === ROOK ? R_DIR : Q_DIR;
    for (const dd of dirs) {
      let x = from + dd;
      while (!(x & 0x88)) { if (x === to) return true; if (b[x]) break; x += dd; }
    }
    return false;
  };

  P.inCheck = function (side) {
    side = side || this.turn;
    return this.attacked(side > 0 ? this.wk : this.bk, -side);
  };

  function mv(from, to, p, cap, promo, flags) { return { from, to, p, cap, promo, flags }; }

  P.pseudo = function (out) {
    const b = this.b, s = this.turn;
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const p = b[sq];
      if (!p || (p > 0) !== (s > 0)) continue;
      const t = p * s;
      if (t === PAWN) {
        const dir = 16 * s, last = s > 0 ? 7 : 0, start = s > 0 ? 1 : 6;
        let to = sq + dir;
        if (!(to & 0x88) && !b[to]) {
          if ((to >> 4) === last) { for (let k = QUEEN; k >= KNIGHT; k--) out.push(mv(sq, to, p, 0, k * s, 0)); }
          else {
            out.push(mv(sq, to, p, 0, 0, 0));
            if ((sq >> 4) === start && !b[to + dir]) out.push(mv(sq, to + dir, p, 0, 0, F_DOUBLE));
          }
        }
        for (let k = 0; k < 2; k++) {
          to = sq + dir + (k ? 1 : -1);
          if (to & 0x88) continue;
          const c = b[to];
          if (c && (c > 0) !== (s > 0)) {
            if ((to >> 4) === last) { for (let q = QUEEN; q >= KNIGHT; q--) out.push(mv(sq, to, p, c, q * s, 0)); }
            else out.push(mv(sq, to, p, c, 0, 0));
          } else if (!c && to === this.ep && b[to - dir] === -PAWN * s) out.push(mv(sq, to, p, -PAWN * s, 0, F_EP));
        }
      } else if (t === KNIGHT || t === KING) {
        const offs = t === KNIGHT ? N_OFF : K_OFF;
        for (let i = 0; i < 8; i++) {
          const to = sq + offs[i];
          if (to & 0x88) continue;
          const c = b[to];
          if (!c || (c > 0) !== (s > 0)) out.push(mv(sq, to, p, c, 0, 0));
        }
        if (t === KING && this.castle) {
          if (s > 0 && sq === 4) {
            if ((this.castle & 1) && !b[5] && !b[6] && b[7] === ROOK && !this.attacked(4, -1) && !this.attacked(5, -1) && !this.attacked(6, -1)) out.push(mv(4, 6, p, 0, 0, F_CASTLE));
            if ((this.castle & 2) && !b[3] && !b[2] && !b[1] && b[0] === ROOK && !this.attacked(4, -1) && !this.attacked(3, -1) && !this.attacked(2, -1)) out.push(mv(4, 2, p, 0, 0, F_CASTLE));
          } else if (s < 0 && sq === 116) {
            if ((this.castle & 4) && !b[117] && !b[118] && b[119] === -ROOK && !this.attacked(116, 1) && !this.attacked(117, 1) && !this.attacked(118, 1)) out.push(mv(116, 118, p, 0, 0, F_CASTLE));
            if ((this.castle & 8) && !b[115] && !b[114] && !b[113] && b[112] === -ROOK && !this.attacked(116, 1) && !this.attacked(115, 1) && !this.attacked(114, 1)) out.push(mv(116, 114, p, 0, 0, F_CASTLE));
          }
        }
      } else {
        const dirs = t === BISHOP ? B_DIR : t === ROOK ? R_DIR : Q_DIR;
        for (let i = 0; i < dirs.length; i++) {
          const d = dirs[i];
          let to = sq + d;
          while (!(to & 0x88)) {
            const c = b[to];
            if (!c) out.push(mv(sq, to, p, 0, 0, 0));
            else { if ((c > 0) !== (s > 0)) out.push(mv(sq, to, p, c, 0, 0)); break; }
            to += d;
          }
        }
      }
    }
    return out;
  };

  P.make = function (m) {
    const b = this.b, s = this.turn, st = this.stack;
    st.push(this.castle, this.ep, this.half, this.h1, this.h2);
    let h1 = this.h1, h2 = this.h2;
    const p = m.p;
    h1 ^= Z1[(p + 6) * 128 + m.from]; h2 ^= Z2[(p + 6) * 128 + m.from];
    if (m.flags & F_EP) {
      const cs = m.to - 16 * s;
      h1 ^= Z1[(m.cap + 6) * 128 + cs]; h2 ^= Z2[(m.cap + 6) * 128 + cs];
      b[cs] = 0;
    } else if (m.cap) { h1 ^= Z1[(m.cap + 6) * 128 + m.to]; h2 ^= Z2[(m.cap + 6) * 128 + m.to]; }
    const np = m.promo || p;
    b[m.to] = np; b[m.from] = 0;
    h1 ^= Z1[(np + 6) * 128 + m.to]; h2 ^= Z2[(np + 6) * 128 + m.to];
    if (m.flags & F_CASTLE) {
      const rf = (m.to & 7) === 6 ? m.to + 1 : m.to - 2, rt = (m.to & 7) === 6 ? m.to - 1 : m.to + 1;
      const r = b[rf];
      b[rt] = r; b[rf] = 0;
      h1 ^= Z1[(r + 6) * 128 + rf] ^ Z1[(r + 6) * 128 + rt]; h2 ^= Z2[(r + 6) * 128 + rf] ^ Z2[(r + 6) * 128 + rt];
    }
    if (p === KING) this.wk = m.to; else if (p === -KING) this.bk = m.to;
    const nc = this.castle & CASTLE_MASK[m.from] & CASTLE_MASK[m.to];
    if (nc !== this.castle) { h1 ^= ZC1[this.castle] ^ ZC1[nc]; h2 ^= ZC2[this.castle] ^ ZC2[nc]; this.castle = nc; }
    if (this.ep >= 0) { h1 ^= ZE1[this.ep & 7]; h2 ^= ZE2[this.ep & 7]; }
    this.ep = (m.flags & F_DOUBLE) ? m.from + 16 * s : -1;
    if (this.ep >= 0) { h1 ^= ZE1[this.ep & 7]; h2 ^= ZE2[this.ep & 7]; }
    this.half = (p === PAWN || p === -PAWN || m.cap) ? 0 : this.half + 1;
    if (s < 0) this.full++;
    this.turn = -s;
    h1 ^= ZT1; h2 ^= ZT2;
    this.h1 = h1; this.h2 = h2;
  };

  P.unmake = function (m) {
    const b = this.b, st = this.stack;
    this.turn = -this.turn;
    const s = this.turn;
    if (s < 0) this.full--;
    this.h2 = st.pop(); this.h1 = st.pop(); this.half = st.pop(); this.ep = st.pop(); this.castle = st.pop();
    b[m.from] = m.p;
    if (m.flags & F_EP) { b[m.to] = 0; b[m.to - 16 * s] = m.cap; }
    else b[m.to] = m.cap;
    if (m.flags & F_CASTLE) {
      const rf = (m.to & 7) === 6 ? m.to + 1 : m.to - 2, rt = (m.to & 7) === 6 ? m.to - 1 : m.to + 1;
      b[rf] = b[rt]; b[rt] = 0;
    }
    if (m.p === KING) this.wk = m.from; else if (m.p === -KING) this.bk = m.from;
  };

  // pass (for threats): the other side moves again
  P.makeNull = function () {
    this.stack.push(this.ep, this.h1, this.h2);
    if (this.ep >= 0) { this.h1 ^= ZE1[this.ep & 7]; this.h2 ^= ZE2[this.ep & 7]; }
    this.ep = -1;
    this.turn = -this.turn;
    this.h1 ^= ZT1; this.h2 ^= ZT2;
  };
  P.unmakeNull = function () {
    this.turn = -this.turn;
    this.h2 = this.stack.pop(); this.h1 = this.stack.pop(); this.ep = this.stack.pop();
  };

  P.legal = function () {
    const ps = this.pseudo([]), out = [], s = this.turn;
    for (let i = 0; i < ps.length; i++) {
      const m = ps[i];
      this.make(m);
      if (!this.attacked(s > 0 ? this.wk : this.bk, -s)) out.push(m);
      this.unmake(m);
    }
    return out;
  };
  P.hasLegal = function () {
    const ps = this.pseudo([]), s = this.turn;
    for (let i = 0; i < ps.length; i++) {
      const m = ps[i];
      this.make(m);
      const ok = !this.attacked(s > 0 ? this.wk : this.bk, -s);
      this.unmake(m);
      if (ok) return true;
    }
    return false;
  };
  P.status = function () {
    if (this.hasLegal()) return '';
    return this.inCheck() ? 'mate' : 'stalemate';
  };
  // does this move give mate?
  P.mates = function (m) {
    this.make(m);
    const r = this.inCheck() && !this.hasLegal();
    this.unmake(m);
    return r;
  };
  P.gives = function (m) {
    this.make(m);
    const r = this.inCheck();
    this.unmake(m);
    return r;
  };
  // nothing left that could ever mate: K v K, K + minor v K
  P.deadDraw = function () {
    let minors = 0;
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const t = Math.abs(this.b[sq]);
      if (!t || t === KING) continue;
      if (t === KNIGHT || t === BISHOP) { minors++; continue; }
      return false;
    }
    return minors <= 1;
  };
  P.pieces = function (side) {
    const out = [];
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const p = this.b[sq];
      if (p && (!side || (p > 0) === (side > 0))) out.push(sq);
    }
    return out;
  };

  /* ---------- notation ---------- */

  const sameMove = (a, b) => a.from === b.from && a.to === b.to && (a.promo || 0) === (b.promo || 0);

  P.san = function (m, legal) {
    let s;
    const t = Math.abs(m.p);
    if (m.flags & F_CASTLE) s = (m.to & 7) === 6 ? 'O-O' : 'O-O-O';
    else if (t === PAWN) {
      s = (m.cap ? FILES[m.from & 7] + 'x' : '') + sqName(m.to);
      if (m.promo) s += '=' + LETTER[Math.abs(m.promo)];
    } else {
      s = LETTER[t];
      legal = legal || this.legal();
      const others = legal.filter((x) => x.p === m.p && x.to === m.to && x.from !== m.from);
      if (others.length) {
        const sameFile = others.some((x) => (x.from & 7) === (m.from & 7));
        const sameRank = others.some((x) => (x.from >> 4) === (m.from >> 4));
        if (!sameFile) s += FILES[m.from & 7];
        else if (!sameRank) s += String((m.from >> 4) + 1);
        else s += sqName(m.from);
      }
      if (m.cap) s += 'x';
      s += sqName(m.to);
    }
    this.make(m);
    if (this.inCheck()) s += this.hasLegal() ? '+' : '#';
    this.unmake(m);
    return s;
  };
  // 'Nf3', 'exd6', 'e8=N', 'O-O' (checks, marks and 'e.p.' ignored); null if no legal move matches
  P.moveFromSan = function (text) {
    const clean = (x) => x.replace(/[+#!?]/g, '').replace(/e\.p\./, '').replace(/0/g, 'O').trim();
    const want = clean(text);
    const legal = this.legal();
    for (const m of legal) if (clean(this.san(m, legal)) === want) return m;
    return null;
  };
  P.findMove = function (from, to, promo) {
    return this.legal().find((m) => m.from === from && m.to === to && (!m.promo || Math.abs(m.promo) === (promo || QUEEN))) || null;
  };
  // 'e2e4', 'e7e8q'
  const uci = (m) => sqName(m.from) + sqName(m.to) + (m.promo ? 'nbrq'[Math.abs(m.promo) - 2] : '');
  P.moveFromUci = function (u) {
    const from = sqOf(u.slice(0, 2)), to = sqOf(u.slice(2, 4));
    const pr = u[4] ? ' pnbrqk'.indexOf(u[4]) : 0;
    return this.legal().find((m) => m.from === from && m.to === to && Math.abs(m.promo || 0) === pr) || null;
  };

  /* ---------- FEN ---------- */

  function fromFEN(fen) {
    const parts = String(fen).trim().split(/\s+/);
    const pos = new Pos();
    const rows = parts[0].split('/');
    if (rows.length !== 8) throw new Error('FEN needs 8 rows: ' + fen);
    for (let i = 0; i < 8; i++) {
      const rank = 7 - i;
      let file = 0;
      for (const ch of rows[i]) {
        if (ch >= '1' && ch <= '8') { file += +ch; continue; }
        const t = ' pnbrqk'.indexOf(ch.toLowerCase());
        if (t < 1 || file > 7) throw new Error('bad FEN piece ' + ch + ' in ' + fen);
        const p = ch === ch.toLowerCase() ? -t : t;
        pos.b[rank * 16 + file] = p;
        if (p === KING) pos.wk = rank * 16 + file;
        if (p === -KING) pos.bk = rank * 16 + file;
        file++;
      }
      if (file !== 8) throw new Error('bad FEN row ' + rows[i]);
    }
    pos.turn = parts[1] === 'b' ? -1 : 1;
    const cs = parts[2] || '-';
    pos.castle = (cs.includes('K') ? 1 : 0) | (cs.includes('Q') ? 2 : 0) | (cs.includes('k') ? 4 : 0) | (cs.includes('q') ? 8 : 0);
    pos.ep = parts[3] && parts[3] !== '-' ? sqOf(parts[3]) : -1;
    pos.half = parts[4] ? +parts[4] : 0;
    pos.full = parts[5] ? +parts[5] : 1;
    pos.rehash();
    return pos;
  }
  P.fen = function () {
    let s = '';
    for (let rank = 7; rank >= 0; rank--) {
      let empty = 0;
      for (let file = 0; file < 8; file++) {
        const p = this.b[rank * 16 + file];
        if (!p) { empty++; continue; }
        if (empty) { s += empty; empty = 0; }
        const ch = ' pnbrqk'[Math.abs(p)];
        s += p > 0 ? ch.toUpperCase() : ch;
      }
      if (empty) s += empty;
      if (rank) s += '/';
    }
    let cs = (this.castle & 1 ? 'K' : '') + (this.castle & 2 ? 'Q' : '') + (this.castle & 4 ? 'k' : '') + (this.castle & 8 ? 'q' : '');
    return s + ' ' + (this.turn > 0 ? 'w' : 'b') + ' ' + (cs || '-') + ' ' + (this.ep >= 0 ? sqName(this.ep) : '-') + ' ' + this.half + ' ' + this.full;
  };
  // the board part only, for comparing positions
  P.boardKey = function () { return this.fen().split(' ').slice(0, 4).join(' '); };

  // problems: legal enough to set up (one king each, pawns off the end ranks, the side not to move not in check)
  P.problems = function () {
    let wk = 0, bk = 0, wp = 0, bp = 0, wn = 0, bn = 0;
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const p = this.b[sq];
      if (p === KING) wk++;
      if (p === -KING) bk++;
      if (p > 0) wn++; else if (p < 0) bn++;
      if (Math.abs(p) === PAWN) {
        if ((sq >> 4) === 0 || (sq >> 4) === 7) return 'a pawn on the first or last rank';
        if (p > 0) wp++; else bp++;
      }
    }
    if (wk !== 1 || bk !== 1) return 'each side needs exactly one king';
    if (wp > 8 || bp > 8 || wn > 16 || bn > 16) return 'too many pieces';
    if (this.attacked(this.turn > 0 ? this.bk : this.wk, this.turn)) return 'the side not to move is in check';
    const c = this.castle, b = this.b;
    if ((c & 1) && !(b[4] === KING && b[7] === ROOK)) return 'castling short without king and rook at home';
    if ((c & 2) && !(b[4] === KING && b[0] === ROOK)) return 'castling long without king and rook at home';
    if ((c & 4) && !(b[116] === -KING && b[119] === -ROOK)) return 'black castling short without king and rook at home';
    if ((c & 8) && !(b[116] === -KING && b[112] === -ROOK)) return 'black castling long without king and rook at home';
    if (this.ep >= 0) {
      const s = this.turn, r = this.ep >> 4;
      if (r !== (s > 0 ? 5 : 2) || b[this.ep - 16 * s] !== -PAWN * s || b[this.ep] || b[this.ep + 16 * s]) return 'no pawn could just have moved two squares';
    }
    return null;
  };

  function perft(pos, depth) {
    const moves = pos.legal();
    if (depth <= 1) return depth === 1 ? moves.length : 1;
    let n = 0;
    for (const m of moves) { pos.make(m); n += perft(pos, depth - 1); pos.unmake(m); }
    return n;
  }

  /* ---------- searches: mate in n, helpmates, forced draws ---------- */

  const ABORT = new Error('search limit');

  function Solver(pos, opts) {
    opts = opts || {};
    this.pos = pos.clone();
    this.tt = new Map();
    this.nodes = 0;
    this.limit = opts.limit || 4e6;
    this.killer = [];
  }
  const S = Solver.prototype;
  S.tick = function () { if (++this.nodes > this.limit) throw ABORT; };

  // the side to move (the attacker) can force mate within n of its moves
  S.attack = function (n) {
    const pos = this.pos, key = pos.key();
    let e = this.tt.get(key);
    if (e) { if (e.w <= n) return true; if (e.f >= n) return false; }
    this.tick();
    const moves = pos.legal();
    let res = false;
    if (n <= 1) {
      for (let i = 0; i < moves.length && !res; i++) res = pos.mates(moves[i]);
    } else {
      // checks first: they leave the fewest replies
      const checks = [], rest = [];
      for (const m of moves) { if (pos.gives(m)) checks.push(m); else rest.push(m); }
      const order = checks.concat(rest);
      for (let i = 0; i < order.length && !res; i++) {
        pos.make(order[i]);
        res = this.defend(n);
        pos.unmake(order[i]);
      }
    }
    if (!e) { e = { w: 99, f: 0 }; this.tt.set(key, e); }
    if (res) e.w = Math.min(e.w, n); else e.f = Math.max(e.f, n);
    return res;
  };
  // the defender is to move; the attacker then has n - 1 moves left. True if every reply loses.
  S.defend = function (n) {
    const pos = this.pos, moves = pos.legal();
    if (!moves.length) return pos.inCheck();
    if (n <= 1) return false;
    const k = this.killer[n];
    if (k) {
      const i = moves.findIndex((m) => m.from === k.from && m.to === k.to);
      if (i > 0) { const t = moves[0]; moves[0] = moves[i]; moves[i] = t; }
    }
    for (let i = 0; i < moves.length; i++) {
      const r = moves[i];
      pos.make(r);
      const ok = this.attack(n - 1);
      pos.unmake(r);
      if (!ok) { this.killer[n] = r; return false; }
    }
    return true;
  };
  // fewest moves to force mate (up to max); 0 when there is none within max
  S.dist = function (max) {
    for (let n = 1; n <= max; n++) if (this.attack(n)) return n;
    return 0;
  };
  // the first moves that force mate within n (at most `max` of them)
  S.keys = function (n, max) {
    const pos = this.pos, out = [];
    for (const m of pos.legal()) {
      pos.make(m);
      const ok = n <= 1 ? (pos.inCheck() && !pos.hasLegal()) : this.defend(n);
      pos.unmake(m);
      if (ok) { out.push(m); if (max && out.length >= max) break; }
    }
    return out;
  };
  // defender to move, the attacker has n moves: each reply with the attacker's fastest mate (0 = none in time)
  S.replies = function (n) {
    const pos = this.pos, out = [];
    for (const r of pos.legal()) {
      pos.make(r);
      out.push({ m: r, d: this.dist(n) });
      pos.unmake(r);
    }
    return out;
  };
  // the attacker's mating moves if the defender (to move, not in check) could pass
  S.threats = function () {
    const pos = this.pos;
    if (pos.inCheck()) return null;
    pos.makeNull();
    const out = pos.legal().filter((m) => pos.mates(m));
    pos.unmakeNull();
    return out;
  };

  // helpmates: the side to move starts, both sides cooperate, and the other side mates on its n-th move.
  // Returns up to `max` solutions (lists of moves), and whether the search ran out.
  S.help = function (n, max) { return this.helpPlies(2 * n, max); };
  // the same from any point: `plies` moves remain, the last of them mates
  S.helpPlies = function (plies, max) {
    const pos = this.pos, sols = [], line = [];
    max = max || 2;
    const dead = [];   // dead[left]: positions known to have no solution with `left` plies to go
    for (let i = 0; i <= plies; i++) dead.push(new Set());
    const go = (left) => {
      const key = pos.key();
      if (dead[left].has(key)) return;
      this.tick();
      const before = sols.length;
      const moves = pos.legal();
      if (left === 1) {
        for (const m of moves) {
          if (pos.mates(m)) { sols.push(line.concat([m])); if (sols.length >= max) return; }
        }
      } else {
        for (const m of moves) {
          line.push(m);
          pos.make(m);
          go(left - 1);
          pos.unmake(m);
          line.pop();
          if (sols.length >= max) return;
        }
      }
      if (sols.length === before) dead[left].add(key);
    };
    if (plies >= 1) go(plies);
    return sols;
  };

  // the side to move (the saver) forces, within n of its moves, a stalemate or a board where nobody can mate
  // (with this.stalemateOnly, only a stalemate counts)
  S.saverHolds = function (n) {
    const pos = this.pos;
    if (!this.stalemateOnly && pos.deadDraw()) return true;
    const moves = pos.legal();
    if (!moves.length) return !pos.inCheck();
    if (n <= 0) return false;
    this.tick();
    for (const m of moves) {
      pos.make(m);
      const ok = this.saverForced(n);
      pos.unmake(m);
      if (ok) return true;
    }
    return false;
  };
  S.saverForced = function (n) {
    const pos = this.pos;
    if (!this.stalemateOnly && pos.deadDraw()) return true;
    const moves = pos.legal();
    if (!moves.length) return this.stalemateOnly ? !pos.inCheck() : true;   // stalemate (or even mate) of the stronger side
    for (const r of moves) {
      pos.make(r);
      const ok = this.saverHolds(n - 1);
      pos.unmake(r);
      if (!ok) return false;
    }
    return true;
  };
  S.drawKeys = function (n) {
    const pos = this.pos, out = [];
    for (const m of pos.legal()) {
      pos.make(m);
      if (this.saverForced(n)) out.push(m);
      pos.unmake(m);
    }
    return out;
  };

  /* ---------- endgame tables: king and queen, king and rook, king and two bishops against a lone king ----------
   * Built backwards from every mate (retrograde analysis), using the eight symmetries of the board to put the
   * black king in the triangle a1-d1-d4. W[i] = plies to mate with White to move, B[i] with Black to move
   * (0 = mated now); 255 = no forced mate (draw, or not a legal position).
   */
  const SQ64 = (sq) => (sq >> 4) * 8 + (sq & 7);
  const SQ88 = (s) => (s >> 3) * 16 + (s & 7);
  const TRI_SQ = [0, 1, 2, 3, 9, 10, 11, 18, 19, 27];
  const TRI = new Int8Array(64).fill(-1);
  TRI_SQ.forEach((s, i) => { TRI[s] = i; });
  const XF = [];   // XF[t][s]: square s under symmetry t
  for (let t = 0; t < 8; t++) {
    const a = new Uint8Array(64);
    for (let s = 0; s < 64; s++) {
      let r = s >> 3, f = s & 7;
      if (t & 4) { const x = r; r = f; f = x; }
      if (t & 1) f = 7 - f;
      if (t & 2) r = 7 - r;
      a[s] = r * 8 + f;
    }
    XF.push(a);
  }
  const TFOR = [];   // the symmetries that bring each square into the triangle
  for (let s = 0; s < 64; s++) TFOR.push([0, 1, 2, 3, 4, 5, 6, 7].filter((t) => TRI[XF[t][s]] >= 0));
  const LIGHT = [], DARK = [], COLIDX = new Int8Array(64);
  for (let s = 0; s < 64; s++) { if (((s >> 3) + (s & 7)) & 1) { COLIDX[s] = LIGHT.length; LIGHT.push(s); } else { COLIDX[s] = DARK.length; DARK.push(s); } }
  const isLight = (s) => (((s >> 3) + (s & 7)) & 1) === 1;
  const KADJ = [];
  const kdist = (a, b) => Math.max(Math.abs((a >> 3) - (b >> 3)), Math.abs((a & 7) - (b & 7)));
  for (let s = 0; s < 64; s++) { const l = []; for (let t = 0; t < 64; t++) if (t !== s && kdist(s, t) === 1) l.push(t); KADJ.push(l); }
  const DIRS64 = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const LINE = new Int8Array(64 * 64).fill(-1);   // direction index from a to b, or -1
  const RAY = [];   // RAY[s][d]: squares from s in direction d
  for (let s = 0; s < 64; s++) {
    const rs = [];
    for (let d = 0; d < 8; d++) {
      const l = [];
      let r = (s >> 3) + DIRS64[d][0], f = (s & 7) + DIRS64[d][1];
      while (r >= 0 && r < 8 && f >= 0 && f < 8) { l.push(r * 8 + f); LINE[s * 64 + r * 8 + f] = d; r += DIRS64[d][0]; f += DIRS64[d][1]; }
      rs.push(l);
    }
    RAY.push(rs);
  }

  function Table(mat) {
    this.mat = mat;
    this.two = mat === 'BB';
    this.types = this.two ? [BISHOP, BISHOP] : [mat === 'Q' ? QUEEN : ROOK];
    this.size = this.two ? 10 * 64 * 32 * 32 : 10 * 64 * 64;
    this.W = new Uint8Array(this.size).fill(255);
    this.B = new Uint8Array(this.size).fill(255);
    this.cnt = new Uint8Array(this.size);
    this.occ = new Uint8Array(64);
    this.phase = 0; this.cur = 0; this.front = []; this.frontW = []; this.d = 0; this.done = false;
    this.q = [0, 0, 0, 0];
  }
  const TB = Table.prototype;
  TB.decode = function (idx, q) {
    if (this.two) { q[3] = DARK[idx & 31]; idx >>= 5; q[2] = LIGHT[idx & 31]; idx >>= 5; }
    else { q[2] = idx & 63; idx >>= 6; }
    q[1] = idx & 63; idx >>= 6;
    q[0] = TRI_SQ[idx];
  };
  // the smallest index over the symmetries that move the black king into the triangle
  TB.index = function (bk, wk, p1, p2) {
    let best = -1;
    const ts = TFOR[bk];
    for (let i = 0; i < ts.length; i++) {
      const x = XF[ts[i]];
      let idx = TRI[x[bk]] * 64 + x[wk];
      if (this.two) {
        let a = x[p1], b = x[p2];
        if (!isLight(a)) { const t = a; a = b; b = t; }
        idx = (idx * 32 + COLIDX[a]) * 32 + COLIDX[b];
      } else idx = idx * 64 + x[p1];
      if (best < 0 || idx < best) best = idx;
    }
    return best;
  };
  // is square x attacked by White (king wk, pieces at q[2], q[3]) with the board occupancy this.occ; skip = a captured piece
  TB.att = function (x, wk, p1, p2, skip) {
    if (kdist(x, wk) === 1) return true;
    for (let k = 0; k < this.types.length; k++) {
      if (k === skip) continue;
      const s = k ? p2 : p1;
      if (s === x) continue;
      const d = LINE[s * 64 + x];
      if (d < 0) continue;
      const t = this.types[k];
      if ((t === ROOK && d >= 4) || (t === BISHOP && d < 4)) continue;
      const ray = RAY[s][d];
      let ok = true;
      for (let i = 0; i < ray.length; i++) { const y = ray[i]; if (y === x) break; if (this.occ[y]) { ok = false; break; } }
      if (ok) return true;
    }
    return false;
  };
  TB.fill = function (bk, wk, p1, p2) {
    const o = this.occ;
    o.fill(0);
    if (bk >= 0) o[bk] = 1;
    o[wk] = 1; o[p1] = 1;
    if (this.two) o[p2] = 1;
  };
  TB.valid = function (q) {
    const [bk, wk, p1, p2] = q;
    if (bk === wk || bk === p1 || wk === p1 || kdist(bk, wk) < 2) return false;
    if (this.two && (p2 === bk || p2 === wk || p2 === p1)) return false;
    return true;
  };
  // run the build for about `ms` milliseconds; true when finished
  TB.step = function (ms) {
    const t0 = Date.now(), q = this.q;
    let n = 0;
    const late = () => ((++n & 1023) === 0 && Date.now() - t0 > ms);
    if (this.phase === 0) {
      // every Black-to-move position: count the moves, find the mates
      const seen = new Set();
      for (; this.cur < this.size; this.cur++) {
        if (late()) return false;
        const j = this.cur;
        this.decode(j, q);
        if (!this.valid(q)) continue;
        const [bk, wk, p1, p2] = q;
        if (this.index(bk, wk, p1, p2) !== j) continue;
        this.fill(-1, wk, p1, p2);
        let c = 0;
        seen.clear();
        const adj = KADJ[bk];
        for (let i = 0; i < adj.length; i++) {
          const x = adj[i];
          if (x === wk || kdist(x, wk) === 1) continue;
          const cap = x === p1 ? 0 : (this.two && x === p2) ? 1 : -1;
          if (this.att(x, wk, p1, p2, cap)) continue;
          if (cap >= 0) { c++; continue; }   // taking a piece: a draw
          const i2 = this.index(x, wk, p1, p2);
          if (!seen.has(i2)) { seen.add(i2); c++; }
        }
        if (!c) {
          this.fill(bk, wk, p1, p2);
          if (this.att(bk, wk, p1, p2, -1)) { this.B[j] = 0; this.front.push(j); }
        }
        this.cnt[j] = c;
      }
      this.phase = 1; this.cur = 0;
    }
    while (this.front.length || this.frontW.length) {
      if (this.phase === 1) {
        // White moves that lead into these lost positions
        for (; this.cur < this.front.length; this.cur++) {
          if (late()) return false;
          const j = this.front[this.cur], v = this.B[j] + 1;
          this.decode(j, q);
          const [bk, wk, p1, p2] = q;
          this.fill(bk, wk, p1, p2);
          // the king came from a neighbouring square
          const adj = KADJ[wk];
          for (let i = 0; i < adj.length; i++) {
            const t = adj[i];
            if (this.occ[t] || kdist(t, bk) < 2) continue;
            this.occ[wk] = 0; this.occ[t] = 1;
            const chk = this.att(bk, t, p1, p2, -1);
            this.occ[t] = 0; this.occ[wk] = 1;
            if (chk) continue;
            const i2 = this.index(bk, t, p1, p2);
            if (this.W[i2] === 255) { this.W[i2] = v; this.frontW.push(i2); }
          }
          // a piece came along one of its lines
          for (let k = 0; k < this.types.length; k++) {
            const s = k ? p2 : p1, ty = this.types[k];
            for (let d = 0; d < 8; d++) {
              if ((ty === ROOK && d >= 4) || (ty === BISHOP && d < 4)) continue;
              const ray = RAY[s][d];
              for (let r = 0; r < ray.length; r++) {
                const t = ray[r];
                if (this.occ[t]) break;
                this.occ[s] = 0; this.occ[t] = 1;
                const chk = k ? this.att(bk, wk, p1, t, -1) : this.att(bk, wk, t, p2, -1);
                this.occ[t] = 0; this.occ[s] = 1;
                if (chk) continue;
                const i2 = k ? this.index(bk, wk, p1, t) : this.index(bk, wk, t, p2);
                if (this.W[i2] === 255) { this.W[i2] = v; this.frontW.push(i2); }
              }
            }
          }
        }
        this.front = []; this.cur = 0; this.phase = 2;
      }
      if (this.phase === 2) {
        // Black moves that led into these won positions
        const seen = new Set();
        const next = this.nextB || (this.nextB = []);
        for (; this.cur < this.frontW.length; this.cur++) {
          if (late()) return false;
          const i = this.frontW[this.cur], v = this.W[i] + 1;
          this.decode(i, q);
          const [bk, wk, p1, p2] = q;
          seen.clear();
          const adj = KADJ[bk];
          for (let a = 0; a < adj.length; a++) {
            const t = adj[a];
            if (t === wk || t === p1 || (this.two && t === p2) || kdist(t, wk) < 2) continue;
            const j = this.index(t, wk, p1, p2);
            if (seen.has(j)) continue;
            seen.add(j);
            if (this.B[j] !== 255 || !this.cnt[j]) continue;
            if (--this.cnt[j] === 0) { this.B[j] = v; next.push(j); }
          }
        }
        this.frontW = []; this.front = next; this.nextB = null; this.cur = 0; this.phase = 1;
      }
    }
    this.done = true;
    return true;
  };
  TB.build = function () { while (!this.step(1e9)); return this; };
  // squares of a position of this material: [bk, wk, p1, p2] (64-square numbering), or null
  TB.fit = function (pos) {
    let wk = -1, bk = -1;
    const ps = [];
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const p = pos.b[sq];
      if (!p) continue;
      if (p === KING) wk = SQ64(sq); else if (p === -KING) bk = SQ64(sq);
      else if (p < 0) return null;
      else ps.push([p, SQ64(sq)]);
    }
    if (ps.length !== this.types.length || ps.some((x) => x[0] !== this.types[0])) return null;
    if (this.two) {
      const a = ps[0][1], b = ps[1][1];
      if (isLight(a) === isLight(b)) return null;
      return [bk, wk, isLight(a) ? a : b, isLight(a) ? b : a];
    }
    return [bk, wk, ps[0][1], 0];
  };
  // plies to mate from this position (the side to move as in pos), or -1 when there is no forced mate
  TB.probe = function (pos) {
    const q = this.fit(pos);
    if (!q) return -1;
    const i = this.index(q[0], q[1], q[2], q[3]);
    const v = pos.turn > 0 ? this.W[i] : this.B[i];
    return v === 255 ? -1 : v;
  };
  const tables = {};
  Table.get = function (mat) { return tables[mat] || (tables[mat] = new Table(mat)); };
  Table.materialOf = function (pos) {
    let s = '';
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const p = pos.b[sq];
      if (p < 0 && p !== -KING) return null;
      if (p > 0 && p !== KING) s += LETTER[p];
    }
    s = s.split('').sort().join('');
    return s === 'Q' || s === 'R' || s === 'BB' ? s : null;
  };

  C.Chess = {
    PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, LETTER, FILES, F_EP, F_CASTLE, F_DOUBLE,
    N_OFF, K_OFF, B_DIR, R_DIR, Q_DIR,
    Pos, fromFEN, perft, sqName, sqOf, onBoard, sameMove, uci, Solver, Table, ABORT, SQ64, SQ88,
    START: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  };
})(typeof window !== 'undefined' ? window : globalThis);
