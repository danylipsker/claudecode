/* The Puzzle Cabinet · engines/cards.js
 *
 * Playing cards on a green baize: puzzles of arrangement and of dealing.
 * Every card is a workbench piece drawn here (our own clean design: corner
 * indices, pips, and framed court letters). Drag cards into the places on the
 * table; a double tap (or the ⇋ button) turns a card over.
 *
 * Card codes: rank + suit, 'AS' 'TH' (ten) 'QD' 'KC'. Values: A = 1 … T = 10,
 * J = 11, Q = 12, K = 13.
 *
 * data.kind:
 *  'arrange'  place cards in slots so that every rule holds
 *     slots: [[x, y], …]      slot centres in card cells (x × 2.9, y × 3.9 world units)
 *     hand:  ['AS', …]        the cards to place;  given: { slot: 'KH' } fixed cards
 *     rules: [ { t: 'distinct', by: 'suit'|'rank'|'colour', lines: [[slot…]…], badge: 'end'|'side' },
 *              { t: 'sum', total: 15, lines: [[…]…] },
 *              { t: 'apart', by: 'colour'|'suit'|'rank'|'consec', pairs: [[a, b]…] },
 *              { t: 'langford', row: [slot…], skolem: false } ]
 *     sol: a card for every slot (checked);  unique: true → verify proves there is one solution
 *  'deal'     put a pile in order so that a dealing rule brings the cards out as target says
 *     cards: [...] the pile as it starts (top first);  target: [...] the order to deal them
 *     rule: { under: 1, first: 'down' | 'under' } | { spell: ['ONE', 'TWO', …] }
 *     sol: the pile order (top first) that works
 *  'piles'    the three-pile trick: deal into three piles, the spectator names the pile,
 *             you choose where it goes; after the rounds the card must be at place `target`
 *     n: 27, rounds: 3, target: 14
 *  'ask'      a question with a demonstration on the table
 *     answer: { num } | { choice, choices, vals }, calc: { … } recomputed by verify, demo: { … }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;

  /* ---------- the cards ---------- */

  const RANKS = 'A23456789TJQK';
  const SUITS = 'SHDC';
  const SYM = { S: '♠', H: '♥', D: '♦', C: '♣' };
  const SUITNAME = { S: 'spades', H: 'hearts', D: 'diamonds', C: 'clubs' };
  const RANKNAME = ['', 'ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
  const CW = 2.5, CH = 3.5;          // a card, in world units
  const SX = 2.9, SY = 3.9;          // one slot cell

  const cache = {};
  function card(code) {
    let c = cache[code];
    if (!c) {
      const r = RANKS.indexOf(code[0]) + 1;
      c = cache[code] = { code, r, s: code[1], red: code[1] === 'H' || code[1] === 'D' };
    }
    return c;
  }
  const rankText = (r) => (r === 10 ? '10' : RANKS[r - 1]);
  const short = (code) => rankText(card(code).r) + SYM[card(code).s];
  const longName = (code) => 'the ' + RANKNAME[card(code).r] + ' of ' + SUITNAME[card(code).s];
  const mk = (r, s) => RANKS[r - 1] + s;

  /* ---------- arrangements: rules and a solver ---------- */

  function itemsOf(d) {
    const items = [];
    (d.rules || []).forEach((r, ri) => {
      if (r.t === 'distinct' || r.t === 'sum') r.lines.forEach((ln, li) => items.push({ t: r.t, by: r.by, total: r.total, slots: ln, ri, li }));
      else if (r.t === 'apart') r.pairs.forEach((pr, li) => items.push({ t: 'apart', by: r.by, slots: pr, ri, li }));
      else if (r.t === 'langford') items.push({ t: 'langford', slots: r.row, skolem: !!r.skolem, ri, li: 0 });
    });
    return items;
  }

  function attr(c, by) { return by === 'suit' ? c.s : by === 'rank' ? c.r : by === 'colour' ? (c.red ? 1 : 0) : c.code; }
  function differ(a, b, by) {
    if (by === 'consec') return Math.abs(a.r - b.r) !== 1;
    return attr(a, by) !== attr(b, by);
  }
  function gapOf(r, skolem) { return skolem ? r : r + 1; }

  // is the item still possible with the cards placed so far (A: slot -> card or null)?
  function itemOk(it, A, left) {
    if (it.t === 'distinct') {
      const seen = new Set();
      for (const s of it.slots) {
        const c = A[s];
        if (!c) continue;
        const k = attr(c, it.by);
        if (seen.has(k)) return false;
        seen.add(k);
      }
      return true;
    }
    if (it.t === 'sum') {
      let sum = 0, u = 0;
      for (const s of it.slots) { const c = A[s]; if (c) sum += c.r; else u++; }
      if (!u) return sum === it.total;
      if (!left) return sum < it.total;
      return sum + u * left.min <= it.total && sum + u * left.max >= it.total;
    }
    if (it.t === 'apart') {
      const a = A[it.slots[0]], b = A[it.slots[1]];
      return !a || !b || differ(a, b, it.by);
    }
    if (it.t === 'langford') {
      const row = it.slots, at = {};
      for (let i = 0; i < row.length; i++) { const c = A[row[i]]; if (c) (at[c.r] = at[c.r] || []).push(i); }
      for (const r in at) {
        const ps = at[r], g = gapOf(+r, it.skolem);
        if (ps.length > 2) return false;
        if (ps.length === 2) { if (Math.abs(ps[0] - ps[1]) !== g) return false; continue; }
        const p = ps[0];
        const fits = (q) => q >= 0 && q < row.length && (!A[row[q]] || A[row[q]].r === +r);
        if (!fits(p + g) && !fits(p - g)) return false;
      }
      return true;
    }
    return true;
  }

  // search for arrangements. opts: { fixed: {slot: code}, limit, nodes, rng }
  function solveArrange(d, opts) {
    opts = opts || {};
    const n = d.slots.length, items = itemsOf(d);
    const bySlot = Array.from({ length: n }, () => []);
    items.forEach((it) => it.slots.forEach((s) => bySlot[s].push(it)));
    const A = new Array(n).fill(null);
    const pool = d.hand.map(card), used = pool.map(() => false);
    for (const k in d.given || {}) A[+k] = card(d.given[k]);
    for (const k in opts.fixed || {}) {
      if (A[+k]) continue;
      const i = pool.findIndex((c, j) => !used[j] && c.code === opts.fixed[k]);
      if (i < 0) return { count: 0, sols: [], nodes: 0 };
      used[i] = true; A[+k] = pool[i];
    }
    const left = () => {
      let min = Infinity, max = -Infinity;
      pool.forEach((c, j) => { if (!used[j]) { if (c.r < min) min = c.r; if (c.r > max) max = c.r; } });
      return { min, max };
    };
    let L0 = left();
    for (const it of items) if (!itemOk(it, A, L0.min === Infinity ? null : L0)) return { count: 0, sols: [], nodes: 0 };
    // slot order: the one most tied to slots already decided first, so lines close early
    const open = [];
    for (let s = 0; s < n; s++) if (!A[s]) open.push(s);
    const chosen = new Set();
    for (let s = 0; s < n; s++) if (A[s]) chosen.add(s);
    const order = [];
    while (order.length < open.length) {
      let best = -1, bs = -1;
      for (const s of open) {
        if (chosen.has(s)) continue;
        let sc = 0;
        bySlot[s].forEach((it) => { const k = it.slots.filter((q) => chosen.has(q)).length; sc += 100 * k + 1 + (it.slots.length - k === 1 ? 500 : 0); });
        if (sc > bs) { bs = sc; best = s; }
      }
      order.push(best); chosen.add(best);
    }
    const idx = pool.map((c, i) => i);
    const limit = opts.limit || 1, maxNodes = opts.nodes || 2e6;
    let count = 0, nodes = 0, aborted = false;
    const sols = [];
    const rec = (k) => {
      if (k === order.length) { count++; sols.push(A.map((c) => c.code)); return; }
      const s = order[k], tried = new Set();
      const ids = opts.rng ? opts.rng.shuffle(idx.slice()) : idx;
      for (const i of ids) {
        if (used[i]) continue;
        const c = pool[i];
        if (tried.has(c.code)) continue;
        tried.add(c.code);
        if (++nodes > maxNodes) { aborted = true; return; }
        used[i] = true; A[s] = c;
        const L = k + 1 < order.length ? left() : null;
        let ok = true;
        for (const it of bySlot[s]) if (!itemOk(it, A, L)) { ok = false; break; }
        if (ok) rec(k + 1);
        A[s] = null; used[i] = false;
        if (count >= limit || aborted) return;
      }
    };
    rec(0);
    return { count, sols, nodes, aborted };
  }

  // a full report for the table: every item, and whether it is broken or complete
  function analyse(d, A) {
    const items = itemsOf(d);
    return items.map((it) => {
      const r = { it, bad: false, done: it.slots.every((s) => A[s]), pairs: [] };
      if (it.t === 'distinct') {
        for (let i = 0; i < it.slots.length; i++) for (let j = i + 1; j < it.slots.length; j++) {
          const a = A[it.slots[i]], b = A[it.slots[j]];
          if (a && b && attr(a, it.by) === attr(b, it.by)) { r.bad = true; r.pairs.push([it.slots[i], it.slots[j]]); }
        }
      } else if (it.t === 'sum') {
        r.sum = it.slots.reduce((t, s) => t + (A[s] ? A[s].r : 0), 0);
        r.bad = r.done ? r.sum !== it.total : r.sum >= it.total;
      } else if (it.t === 'apart') {
        const a = A[it.slots[0]], b = A[it.slots[1]];
        if (a && b && !differ(a, b, it.by)) { r.bad = true; r.pairs.push(it.slots.slice()); }
      } else if (it.t === 'langford') {
        const at = {};
        it.slots.forEach((s, i) => { const c = A[s]; if (c) (at[c.r] = at[c.r] || []).push(i); });
        r.arcs = [];
        for (const k in at) {
          if (at[k].length !== 2) continue;
          const [p, q] = at[k], good = Math.abs(p - q) === gapOf(+k, it.skolem);
          r.arcs.push({ r: +k, a: it.slots[p], b: it.slots[q], good, between: Math.abs(p - q) - 1 });
          if (!good) r.bad = true;
        }
      }
      return r;
    });
  }

  function verifyArrange(p) {
    const d = p.data;
    if (!d.slots || !d.hand || !d.rules) return { ok: false, err: 'slots, hand and rules are needed' };
    const n = d.slots.length, given = d.given || {};
    const all = d.hand.concat(Object.values(given));
    if (all.length !== n) return { ok: false, err: all.length + ' cards for ' + n + ' places' };
    if (all.some((c) => !/^[A2-9TJQK][SHDC]$/.test(c))) return { ok: false, err: 'bad card code' };
    const items = itemsOf(d);
    if (items.some((it) => it.slots.some((s) => s < 0 || s >= n))) return { ok: false, err: 'a rule names a missing place' };
    if (d.sol) {
      if (d.sol.length !== n) return { ok: false, err: 'sol has the wrong length' };
      for (const k in given) if (d.sol[+k] !== given[k]) return { ok: false, err: 'sol disagrees with the given card at ' + k };
      if (d.sol.slice().sort().join() !== all.slice().sort().join()) return { ok: false, err: 'sol does not use the cards' };
      const A = d.sol.map(card);
      const bad = items.find((it) => !itemOk(it, A, null));
      if (bad) return { ok: false, err: 'sol breaks rule ' + bad.ri + ' line ' + bad.li };
    }
    const r = solveArrange(d, { limit: d.unique ? 2 : 1, nodes: 4e6 });
    if (r.aborted && !r.count && !d.sol) return { ok: false, err: 'search gave up' };
    if (!r.count && !r.aborted) return { ok: false, err: 'no arrangement works' };
    if (d.unique) {
      if (r.aborted) return { ok: false, err: 'uniqueness search gave up' };
      if (r.count !== 1) return { ok: false, err: 'more than one solution' };
      if (d.sol && r.sols[0].join() !== d.sol.join()) return { ok: false, err: 'sol is not the solution found' };
    }
    return { ok: true };
  }

  /* ---------- deals ---------- */

  // the dealing, card by card: steps [{t:'under'|'down', i: pile index, letter, j}] and the order dealt
  function dealSteps(n, rule) {
    const q = [];
    for (let i = 0; i < n; i++) q.push(i);
    const out = [], steps = [];
    const under = (letter) => { if (q.length > 1) { const c = q.shift(); q.push(c); steps.push({ t: 'under', i: c, letter }); } else steps.push({ t: 'stay', i: q[0], letter }); };
    const down = (letter) => { const c = q.shift(); out.push(c); steps.push({ t: 'down', i: c, j: out.length - 1, letter }); };
    if (rule.spell) {
      for (const w of rule.spell) {
        if (!q.length) break;
        for (let k = 0; k < w.length - 1; k++) under(w[k]);
        down(w[w.length - 1]);
      }
      while (q.length) down(null);
    } else {
      const u = rule.under || 1;
      let first = rule.first === 'under';
      while (q.length) {
        if (first) { for (let k = 0; k < u; k++) under(null); first = false; continue; }
        down(null);
        if (q.length) for (let k = 0; k < u; k++) under(null);
      }
    }
    return { out, steps };
  }
  function dealt(pile, rule) { return dealSteps(pile.length, rule).out.map((i) => pile[i]); }
  function pileFor(target, rule) {
    const { out } = dealSteps(target.length, rule);
    const pile = new Array(target.length);
    out.forEach((pi, j) => { pile[pi] = target[j]; });
    return pile;
  }
  function ruleText(rule) {
    if (rule.spell) return 'spell';
    const u = rule.under || 1;
    const un = u === 1 ? 'one under' : u + ' under';
    return rule.first === 'under' ? un + ', one down' : 'one down, ' + un;
  }

  function verifyDeal(p) {
    const d = p.data;
    if (!d.cards || !d.target || !d.rule) return { ok: false, err: 'cards, target and rule are needed' };
    const n = d.cards.length;
    if (d.target.length !== n || d.cards.slice().sort().join() !== d.target.slice().sort().join()) return { ok: false, err: 'target is not the same cards' };
    if (new Set(d.cards).size !== n) return { ok: false, err: 'repeated card' };
    if (d.rule.spell && d.rule.spell.length !== n) return { ok: false, err: 'one word per card, please' };
    const sol = pileFor(d.target, d.rule);
    if (dealt(sol, d.rule).join() !== d.target.join()) return { ok: false, err: 'internal: the pile does not deal right' };
    if (d.sol && d.sol.join() !== sol.join()) return { ok: false, err: 'sol is not the pile that works' };
    if (dealt(d.cards, d.rule).join() === d.target.join()) return { ok: false, err: 'already solved at the start' };
    return { ok: true };
  }

  /* ---------- the three-pile trick ---------- */

  function pileDeal(deck) {
    const piles = [[], [], []];
    deck.forEach((c, i) => piles[i % 3].push(c));
    return piles;
  }
  // put the named pile at place t (0 top, 1 middle, 2 bottom); the other two keep their order
  function gatherAt(piles, pi, t) {
    const order = [0, 1, 2].filter((i) => i !== pi);
    order.splice(t, 0, pi);
    return { deck: order.reduce((a, i) => a.concat(piles[i]), []), order };
  }
  // follow position p through the rounds with the choices; returns the final 0-based position
  function followPos(n, p, choices) {
    let deck = [];
    for (let i = 0; i < n; i++) deck.push(i);
    for (const t of choices) {
      const piles = pileDeal(deck);
      const pi = piles.findIndex((pl) => pl.includes(p));
      deck = gatherAt(piles, pi, t).deck;
    }
    return deck.indexOf(p);
  }
  function allChoices(rounds) {
    const out = [];
    const rec = (a) => { if (a.length === rounds) { out.push(a.slice()); return; } for (let t = 0; t < 3; t++) { a.push(t); rec(a); a.pop(); } };
    rec([]);
    return out;
  }
  // the choices that bring a card starting at p to the target place (1-based)
  function pileChoices(n, rounds, p, target) {
    return allChoices(rounds).find((ch) => followPos(n, p, ch) === target - 1) || null;
  }
  function verifyPiles(p) {
    const d = p.data;
    if (!d.n || d.n % 3 || !d.rounds || !d.target) return { ok: false, err: 'n (a multiple of 3), rounds and target are needed' };
    if (d.target < 1 || d.target > d.n) return { ok: false, err: 'target out of range' };
    for (let s = 0; s < d.n; s++) if (!pileChoices(d.n, d.rounds, s, d.target)) return { ok: false, err: 'a card starting at ' + (s + 1) + ' cannot reach place ' + d.target };
    return { ok: true };
  }

  /* ---------- Gilbreath: deal some cards off (reversing them) and riffle ---------- */

  // true when EVERY cut and every riffle leaves each group of `period` cards with one of each kind
  function gilbreathAlways(n, period, reverse) {
    const cls = (i) => i % period;
    for (let k = 1; k < n; k++) {
      let A = [], B = [];
      for (let i = 0; i < k; i++) A.push(cls(i));
      for (let i = k; i < n; i++) B.push(cls(i));
      if (reverse) A.reverse();
      // search the interleavings for one that breaks a group
      const seen = new Set();
      const full = (1 << period) - 1;
      const bad = (i, j, mask) => {
        const pos = i + j;
        if (pos === n) return false;
        if (pos % period === 0) mask = 0;
        const key = i + ',' + j + ',' + mask;
        if (seen.has(key)) return false;
        seen.add(key);
        const tryC = (c, ni, nj) => {
          if (mask & (1 << c)) return true; // a repeat inside a group
          let m2 = mask | (1 << c);
          if ((pos + 1) % period === 0 && m2 !== full) return true;
          return bad(ni, nj, m2);
        };
        if (i < A.length && tryC(A[i], i + 1, j)) return true;
        if (j < B.length && tryC(B[j], i, j + 1)) return true;
        return false;
      };
      if (n % period === 0 && bad(0, 0, 0)) return false;
      if (n % period) return false;
    }
    return true;
  }

  // question calculators: the value the answer must match
  function calc(c) {
    if (!c) return undefined;
    if (c.t === 'gilbreath') return gilbreathAlways(c.n, c.period, !!c.reverse);
    if (c.t === 'last') { const o = dealSteps(c.n, c.rule).out; return o[o.length - 1] + 1; }
    if (c.t === 'nth') return dealSteps(c.n, c.rule).out[c.k - 1] + 1;
    if (c.t === 'dealtAt') return dealSteps(c.n, c.rule).out.indexOf(c.pos - 1) + 1;
    if (c.t === 'pile') {
      const vals = new Set();
      for (let s = 0; s < c.n; s++) vals.add(followPos(c.n, s, c.choices) + 1);
      return vals.size === 1 ? vals.values().next().value : null;
    }
    if (c.t === 'value') return c.v;
    return undefined;
  }
  function readNum(v) {
    const s = String(v).trim().replace(/[−–]/g, '-').replace(/(st|nd|rd|th|\.)$/i, '').trim();
    let m;
    if ((m = /^(-?\d+)\s+(\d+)\/(\d+)$/.exec(s))) return +m[1] + (+m[2]) / (+m[3]);
    if ((m = /^(-?\d+)\/(\d+)$/.exec(s))) return (+m[1]) / (+m[2]);
    if (/^-?\d+(\.\d+)?$/.test(s)) return +s;
    if (C.answerTools) return C.answerTools.readNumber(s);
    return NaN;
  }
  function verifyAsk(p) {
    const d = p.data, a = d.answer;
    if (!a) return { ok: false, err: 'no answer' };
    if (a.num == null && a.choice == null) return { ok: false, err: 'answer.num or answer.choice is needed' };
    if (a.choice != null && (!a.choices || a.choice < 0 || a.choice >= a.choices.length)) return { ok: false, err: 'bad choice' };
    if (d.calc) {
      const v = calc(d.calc);
      if (v === undefined || v === null) return { ok: false, err: 'calc gives no single value' };
      if (a.num != null && Math.abs(v - a.num) > 1e-9) return { ok: false, err: 'answer ' + a.num + ' but the calculation gives ' + v };
      if (a.choice != null) {
        if (!a.vals) return { ok: false, err: 'a choice answer with calc needs vals' };
        if (a.vals[a.choice] !== v) return { ok: false, err: 'the calculation gives ' + v + ', which is not the chosen answer' };
        if (a.vals.filter((x) => x === v).length !== 1) return { ok: false, err: 'two choices share the right value' };
      }
    }
    return { ok: true };
  }

  /* ---------- generators (endless and tools/gen/cards.js) ---------- */

  function gridSlots(w, h) { const s = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) s.push([x, y]); return s; }
  function gridLines(w, h, diag) {
    const rows = [], cols = [], diags = [];
    for (let y = 0; y < h; y++) { const r = []; for (let x = 0; x < w; x++) r.push(y * w + x); rows.push(r); }
    for (let x = 0; x < w; x++) { const c = []; for (let y = 0; y < h; y++) c.push(y * w + x); cols.push(c); }
    if (diag && w === h) {
      const a = [], b = [];
      for (let i = 0; i < w; i++) { a.push(i * w + i); b.push(i * w + (w - 1 - i)); }
      diags.push(a, b);
    }
    return rows.concat(cols, diags);
  }
  // an n × n court-card square: every line with one of each suit and one of each rank
  function courtSquare(n, diag) {
    const suits = SUITS.slice(0, n).split('');
    const ranks = n === 3 ? [13, 12, 11] : [1, 13, 12, 11];
    const hand = [];
    ranks.forEach((r) => suits.forEach((s) => hand.push(mk(r, s))));
    const lines = gridLines(n, n, diag);
    return {
      kind: 'arrange', slots: gridSlots(n, n), hand,
      rules: [{ t: 'distinct', by: 'suit', lines }, { t: 'distinct', by: 'rank', lines }]
    };
  }
  // take a solved square and leave only enough cards that exactly one arrangement fits, plus `extra` more
  function withGivens(d, rng, extra, keepMin) {
    const full = solveArrange(d, { rng, limit: 1, nodes: 2e6 }).sols[0];
    if (!full) return null;
    const n = full.length;
    let given = {};
    full.forEach((c, i) => { given[i] = c; });
    const order = rng.shuffle(full.map((c, i) => i));
    const test = (g) => {
      const dd = Object.assign({}, d, { hand: full.filter((c, i) => g[i] == null), given: g });
      return solveArrange(dd, { limit: 2, nodes: 3e5 });
    };
    for (const i of order) {
      if (Object.keys(given).length <= (keepMin || 1)) break;
      const g2 = Object.assign({}, given);
      delete g2[i];
      const r = test(g2);
      if (r.count === 1 && !r.aborted) given = g2;
    }
    // give some back for easier levels
    const out = order.filter((i) => given[i] == null);
    for (let k = 0; k < extra && k < out.length - 1; k++) given[out[k]] = full[out[k]];
    const g = {};
    Object.keys(given).map(Number).sort((a, b) => a - b).forEach((k) => { g[k] = given[k]; });
    return Object.assign({}, d, { hand: full.filter((c, i) => g[i] == null), given: g, sol: full, unique: true });
  }

  // a magic triangle: A–9 on the sides of a triangle, four to a side, every side adding to `total`
  const TRI_SLOTS = [[2, 0], [1.5, 1], [1, 2], [0.5, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [3.5, 3], [3, 2], [2.5, 1]];
  function triangle(total, perSide) {
    // perSide 4: corners 0, 3, 6 of a 9-ring (positions below map onto the 12-slot outline)
    const pos = perSide === 4 ? [[2, 0], [1.33, 1.33], [0.67, 2.67], [0, 4], [1.33, 4], [2.67, 4], [4, 4], [3.33, 2.67], [2.67, 1.33]] : TRI_SLOTS;
    const k = pos.length, side = perSide - 1;
    const lines = [0, 1, 2].map((s) => { const ln = []; for (let i = 0; i <= side; i++) ln.push((s * side + i) % k); return ln; });
    const hand = [];
    for (let r = 1; r <= k; r++) hand.push(mk(r, 'D'));
    return { kind: 'arrange', slots: pos, hand, rules: [{ t: 'sum', total, lines, badge: 'side' }] };
  }

  function genArrange(rng, level) {
    let d;
    if (level === 1) { d = withGivens(courtSquare(3, false), rng, 1, 2); }
    else if (level === 2) { d = rng() < 0.3 ? withGivens(courtSquare(3, false), rng, 0, 2) : withGivens(courtSquare(4, false), rng, 3, 3); }
    else if (level === 3) { d = rng() < 0.6 ? withGivens(courtSquare(4, false), rng, 0, 3) : withGivens(courtSquare(4, true), rng, 2, 2); }
    else if (level === 4) { d = withGivens(courtSquare(4, true), rng, 0, 2); }
    else {
      // a magic triangle with one corner given
      const total = rng.pick([17, 19, 20, 21, 23]);
      const t = triangle(total, 4);
      const s = solveArrange(t, { rng, limit: 1 });
      if (!s.count) return null;
      const full = s.sols[0];
      const c = rng.pick([0, 3, 6]);
      d = Object.assign({}, t, { given: { [c]: full[c] }, hand: full.filter((x, i) => i !== c), sol: full });
    }
    return d;
  }

  const SPELL = ['', 'ACE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'JACK', 'QUEEN', 'KING'];
  function genDeal(rng, level) {
    const n = [0, 5, 7, 9, 11, 13][level];
    const suit = rng.pick(SUITS.split(''));
    const target = [];
    for (let r = 1; r <= n; r++) target.push(mk(r, suit));
    let rule;
    if (level <= 2) rule = rng() < 0.7 ? { under: 1 } : { under: 1, first: 'under' };
    else if (level === 3) rule = rng.pick([{ under: 1 }, { under: 2 }, { under: 1, first: 'under' }]);
    else if (level === 4) rule = rng.pick([{ under: 2 }, { spell: SPELL.slice(1, n + 1) }, { under: 1 }]);
    else rule = rng.pick([{ under: 2, first: 'under' }, { spell: SPELL.slice(1, n + 1) }, { under: 3 }]);
    const sol = pileFor(target, rule);
    let cards;
    for (let k = 0; k < 20; k++) { cards = rng.shuffle(target.slice()); if (dealt(cards, rule).join() !== target.join()) break; }
    return { kind: 'deal', cards, target, rule, sol };
  }

  /* ---------- drawing a card ---------- */

  const SUITPATH = {
    H: ['M0 46C-10 34-48 10-48-16C-48-34-35-46-22-46C-11-46-3-39 0-30C3-39 11-46 22-46C35-46 48-34 48-16C48 10 10 34 0 46Z'],
    D: ['M0-48Q13-21 36 0Q13 21 0 48Q-13 21-36 0Q-13-21 0-48Z'],
    S: ['M0-48C10-32 48-12 48 12C48 28 36 38 23 38C14 38 7 34 3 28C5 38 11 45 20 48L-20 48C-11 45-5 38-3 28C-7 34-14 38-23 38C-36 38-48 28-48 12C-48-12-10-32 0-48Z'],
    C: ['M-21-22a21 21 0 1 0 42 0a21 21 0 1 0-42 0Z', 'M-44 9a21 21 0 1 0 42 0a21 21 0 1 0-42 0Z', 'M2 9a21 21 0 1 0 42 0a21 21 0 1 0-42 0Z', 'M-11 3a11 11 0 1 0 22 0a11 11 0 1 0-22 0Z', 'M-3 12C-5 32-11 42-20 48L20 48C11 42 5 32 3 12Z']
  };
  const EMBLEM = {
    13: 'M-42 22L-48-22L-22 2L0-32L22 2L48-22L42 22Z', // a crown
    12: 'M-44 20Q0-16 44 20ZM-34-4a8 8 0 1 0 16 0a8 8 0 1 0-16 0ZM-8-18a8 8 0 1 0 16 0a8 8 0 1 0-16 0ZM18-4a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z', // a tiara
    11: 'M-44 14Q-6-40 44-14Q6 40-44 14Z' // a plume
  };
  const PX = 0.52, PY = 1.12;
  const PIPS = {
    2: [[0, -PY], [0, PY]],
    3: [[0, -PY], [0, 0], [0, PY]],
    4: [[-PX, -PY], [PX, -PY], [-PX, PY], [PX, PY]],
    5: [[-PX, -PY], [PX, -PY], [0, 0], [-PX, PY], [PX, PY]],
    6: [[-PX, -PY], [PX, -PY], [-PX, 0], [PX, 0], [-PX, PY], [PX, PY]],
    7: [[-PX, -PY], [PX, -PY], [0, -PY / 2], [-PX, 0], [PX, 0], [-PX, PY], [PX, PY]],
    8: [[-PX, -PY], [PX, -PY], [0, -PY / 2], [-PX, 0], [PX, 0], [0, PY / 2], [-PX, PY], [PX, PY]],
    9: [[-PX, -PY], [PX, -PY], [-PX, -PY / 3], [PX, -PY / 3], [0, 0], [-PX, PY / 3], [PX, PY / 3], [-PX, PY], [PX, PY]],
    10: [[-PX, -PY], [PX, -PY], [0, -PY * 0.68], [-PX, -PY / 3], [PX, -PY / 3], [-PX, PY / 3], [PX, PY / 3], [0, PY * 0.68], [-PX, PY], [PX, PY]]
  };
  const RECT = [[-CW / 2, -CH / 2], [CW / 2, -CH / 2], [CW / 2, CH / 2], [-CW / 2, CH / 2]];

  // symbols, the lattice on the backs and the baize gradient, once per table
  function makeDefs(pre, parent) {
    const defs = C.s('defs', null, parent);
    let s = '';
    for (const k in SUITPATH) s += '<symbol id="' + pre + '-' + k + '" viewBox="-50 -50 100 100" overflow="visible">' + SUITPATH[k].map((d) => '<path d="' + d + '"/>').join('') + '</symbol>';
    for (const k in EMBLEM) s += '<symbol id="' + pre + '-e' + k + '" viewBox="-50 -50 100 100" overflow="visible"><path d="' + EMBLEM[k] + '"/></symbol>';
    s += '<pattern id="' + pre + '-lat" width=".3" height=".3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width=".3" height=".3" class="cd-latbg"/><path d="M0 0H.3M0 0V.3" class="cd-latln"/></pattern>';
    s += '<radialGradient id="' + pre + '-felt" cx="50%" cy="42%" r="75%"><stop offset="0" class="cd-f0"/><stop offset="1" class="cd-f1"/></radialGradient>';
    defs.innerHTML = s;
    return defs;
  }
  function pip(parent, pre, suit, x, y, size, cls, flip) {
    return C.s('use', { href: '#' + pre + '-' + suit, x: x - size / 2, y: y - size / 2, width: size, height: size, class: cls, transform: flip ? 'rotate(180 ' + x + ' ' + y + ')' : null }, parent);
  }
  function drawCard(g, code, up, pre) {
    const S = C.s;
    S('rect', { x: -CW / 2 + 0.06, y: -CH / 2 + 0.09, width: CW, height: CH, rx: 0.17, class: 'cd-shadow' }, g);
    const inner = S('g', { class: 'cd-in' }, g);
    if (!up || !code) {
      S('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 0.17, class: 'cd-back' }, inner);
      S('rect', { x: -CW / 2 + 0.17, y: -CH / 2 + 0.17, width: CW - 0.34, height: CH - 0.34, rx: 0.07, fill: 'url(#' + pre + '-lat)', class: 'cd-backin' }, inner);
      S('ellipse', { cx: 0, cy: 0, rx: 0.56, ry: 0.78, class: 'cd-medal' }, inner);
      ['S', 'H', 'D', 'C'].forEach((s, i) => pip(inner, pre, s, [0, 0.3, 0, -0.3][i], [-0.34, 0, 0.34, 0][i], 0.26, 'cd-medalpip'));
      return inner;
    }
    const c = card(code), col = c.red ? 'cd-r' : 'cd-k';
    S('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 0.17, class: 'cd-face' }, inner);
    for (const rot of [false, true]) {
      const gi = S('g', { transform: rot ? 'rotate(180)' : null }, inner);
      S('text', { x: -CW / 2 + 0.29, y: -CH / 2 + 0.56, class: 'cd-idx ' + col + (c.r === 10 ? ' ten' : ''), 'text-anchor': 'middle', text: rankText(c.r) }, gi);
      pip(gi, pre, c.s, -CW / 2 + 0.29, -CH / 2 + 0.84, 0.32, col);
    }
    if (c.r === 1) pip(inner, pre, c.s, 0, 0, c.s === 'S' ? 1.35 : 1.15, col);
    else if (c.r <= 10) PIPS[c.r].forEach(([x, y]) => pip(inner, pre, c.s, x, y, 0.48, col, y > 0.01));
    else {
      S('rect', { x: -0.76, y: -1.26, width: 1.52, height: 2.52, rx: 0.06, class: 'cd-frame ' + (c.red ? 'red' : 'blk') }, inner);
      S('rect', { x: -0.66, y: -1.16, width: 1.32, height: 2.32, rx: 0.04, class: 'cd-frame2 ' + col }, inner);
      for (const rot of [false, true]) {
        const ge = S('g', { transform: rot ? 'rotate(180)' : null }, inner);
        S('use', { href: '#' + pre + '-e' + c.r, x: -0.27, y: -1.1, width: 0.54, height: 0.54, class: 'cd-emblem ' + (c.r === 11 ? col : 'gold') }, ge);
        pip(ge, pre, c.s, -0.45, -0.93, 0.26, col);
      }
      S('text', { x: 0, y: 0.4, class: 'cd-court ' + col, 'text-anchor': 'middle', text: RANKS[c.r - 1] }, inner);
    }
    return inner;
  }

  // a small card as an SVG string (thumbnails)
  function miniCard(x, y, code, up, w, corner) {
    w = w || 20;
    const h = w * 1.4;
    if (!up) return '<rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + w * 0.1 + '" fill="#7c1f2e" stroke="#f0d9a8" stroke-width="' + w * 0.04 + '"/>';
    const c = card(code), col = c.red ? '#cf2f3d' : '#1e2233';
    const face = '<rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + w * 0.1 + '" fill="#fcfaf4" stroke="rgba(0,0,0,.35)" stroke-width="' + w * 0.03 + '"/>';
    if (corner) return face + '<text x="' + (x - w * 0.22) + '" y="' + (y - h / 2 + h * 0.24) + '" text-anchor="middle" font-size="' + w * 0.32 + '" font-weight="700" font-family="Georgia,serif" fill="' + col + '">' + rankText(c.r) + '</text><text x="' + (x + w * 0.2) + '" y="' + (y - h / 2 + h * 0.24) + '" text-anchor="middle" font-size="' + w * 0.34 + '" fill="' + col + '">' + SYM[c.s] + '</text>';
    return face +
      '<text x="' + x + '" y="' + (y - h * 0.04) + '" text-anchor="middle" font-size="' + w * 0.46 + '" font-weight="700" font-family="Georgia,serif" fill="' + col + '">' + rankText(c.r) + '</text>' +
      '<text x="' + x + '" y="' + (y + h * 0.36) + '" text-anchor="middle" font-size="' + w * 0.5 + '" fill="' + col + '">' + SYM[c.s] + '</text>';
  }

  /* ---------- the table kit shared by every kind ---------- */

  let uid = 0;
  function kit(ctx) {
    const wb = ctx.wb, pre = 'cd' + (++uid);
    const K = { wb, pre, alive: true, timers: [] };
    makeDefs(pre, wb.layer('bg'));
    wb.type('card', { poly: () => RECT, draw: (g, o) => drawCard(g, o.data.c, o.data.up !== false, pre) });
    K.later = (fn, ms) => { const t = setTimeout(() => { if (K.alive) fn(); }, C.anim(ms)); K.timers.push(t); return t; };
    K.wait = (ms) => new Promise((res) => K.later(res, ms));
    // a tween: fn(eased t) every frame; resolves true when done, false if the table was cleared
    K.tween = (ms, fn) => new Promise((res) => {
      const t0 = performance.now(), dur = Math.max(1, C.anim(ms));
      const step = (now) => {
        if (!K.alive) { res(false); return; }
        const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        fn(e, k);
        if (k < 1) requestAnimationFrame(step); else res(true);
      };
      requestAnimationFrame(step);
    });
    // glide a card (its real place changes at once; the drawing follows)
    K.glide = (o, x, y, ms, arc) => {
      const fx = o.x, fy = o.y;
      o.x = x; o.y = y;
      return K.tween(ms || 300, (e) => {
        if (!o.el) return;
        const lift = arc ? Math.sin(e * Math.PI) * arc : 0;
        o.el.setAttribute('transform', G.svgTransform({ x: fx + (x - fx) * e, y: fy + (y - fy) * e - lift, rot: o.rot }));
      }).then((ok) => { if (o.el) wb.place(o); return ok; });
    };
    // turn a card over, squeezing it to an edge and back
    K.turn = (o, up, ms) => {
      if ((o.data.up !== false) === up) return Promise.resolve(true);
      let swapped = false;
      return K.tween(ms || 260, (e, k) => {
        if (!o.el) return;
        if (k >= 0.5 && !swapped) { swapped = true; o.data.up = up; wb.renderObj(o); }
        const inner = o.el.querySelector('.cd-in');
        if (inner) inner.setAttribute('transform', 'scale(' + Math.max(0.02, Math.abs(1 - 2 * e)) + ' 1)');
      }).then((ok) => { if (!swapped) { o.data.up = up; } if (o.el) wb.renderObj(o); return ok; });
    };
    K.toTop = (list) => {
      const ids = new Set(list.map((o) => o.id));
      wb.order = wb.order.filter((id) => !ids.has(id)).concat(list.map((o) => o.id));
      wb.restack();
    };
    K.stop = () => { K.alive = false; K.timers.forEach(clearTimeout); };
    // pieces looked up by id every time: undo and reset rebuild the piece objects
    K.byId = (prefix) => new Proxy({}, { get: (t, k) => (typeof k === 'string' ? wb.get(prefix + k) : undefined), set: () => true });
    K.felt = (b) => {
      const bg = wb.layer('bg');
      C.s('rect', { x: b.x0, y: b.y0, width: b.x1 - b.x0, height: b.y1 - b.y0, rx: 0.9, class: 'cd-felt', fill: 'url(#' + pre + '-felt)' }, bg);
      C.s('rect', { x: b.x0 + 0.25, y: b.y0 + 0.25, width: b.x1 - b.x0 - 0.5, height: b.y1 - b.y0 - 0.5, rx: 0.7, class: 'cd-feltedge' }, bg);
    };
    K.slot = (x, y, cls, label) => {
      const g = C.s('g', { class: 'cd-slot' + (cls ? ' ' + cls : '') }, wb.layer('bg'));
      C.s('rect', { x: x - CW / 2, y: y - CH / 2, width: CW, height: CH, rx: 0.17 }, g);
      if (label) C.s('text', { x, y: y + 0.18, 'text-anchor': 'middle', text: label }, g);
      return g;
    };
    // double tap turns a movable card over (a toy, and a way to hide what you have placed)
    K.onDbl = (fn) => wb.on('dbltap', ({ obj }) => { if (obj && obj.type === 'card' && obj.move !== false && !K.busy) fn(obj); });
    wb.ctxActions.push({
      icon: 'flip', title: 'Turn over (double tap)',
      when: (sel) => sel.some((o) => o.type === 'card' && o.move !== false) && !K.busy,
      run: (sel) => { sel.filter((o) => o.type === 'card' && o.move !== false).forEach((o) => K.turn(o, o.data.up === false, 260)); K.later(() => wb.emit('change', { why: 'turn', objs: sel }), 300); }
    });
    return K;
  }

  const slotXY = (s) => [s[0] * SX, s[1] * SY];

  /* ---------- arrange: cards into places ---------- */

  function mountArrange(ctx, p, K) {
    const d = p.data, wb = ctx.wb, n = d.slots.length;
    const SP = d.slots.map(slotXY);
    const given = d.given || {};
    const sb = G.bbox([SP]);
    const cx0 = sb.x0 - CW / 2, cx1 = sb.x1 + CW / 2, cy0 = sb.y0 - CH / 2, cy1 = sb.y1 + CH / 2;
    const items = itemsOf(d);
    const centre = [(sb.x0 + sb.x1) / 2, (sb.y0 + sb.y1) / 2];
    const badges = items.filter((it) => it.t === 'distinct' || it.t === 'sum').map(badgeAt);
    const bb = badges.length ? G.bbox([badges]) : { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    const area = {
      x0: Math.min(cx0 - 0.7, bb.x0 - 0.8), y0: Math.min(cy0 - (items.some((it) => it.t === 'langford') ? 2.4 : 0.7), bb.y0 - 0.8),
      x1: Math.max(cx1 + 0.7, bb.x1 + 0.8), y1: Math.max(cy1 + 0.7, bb.y1 + 0.8)
    };
    // the tray of loose cards, below the layout
    const trng = C.rng(p.id + ':tray');
    const handIdx = trng.shuffle(d.hand.map((c, i) => i));
    const aw = area.x1 - area.x0, ah = area.y1 - area.y0;
    const home = {};
    let trayBox;
    const PW = CW + 0.35, PH = CH + 0.35;
    if (!wb.isNarrow() && aw < ah * 1.35) {
      // beside the layout, in columns
      const rowsFit = Math.max(2, Math.floor((ah - 0.2) / PH));
      const rowsUsed = Math.min(rowsFit, handIdx.length), cols = Math.ceil(handIdx.length / rowsFit);
      const tx0 = area.x1 + 0.9 + CW / 2, ty0 = (area.y0 + area.y1) / 2 - (rowsUsed * PH - 0.35) / 2 + CH / 2;
      handIdx.forEach((hi, k) => { home[d.hand[hi]] = [tx0 + Math.floor(k / rowsFit) * PW, ty0 + (k % rowsFit) * PH]; });
      trayBox = { x0: tx0 - CW / 2 - 0.35, y0: ty0 - CH / 2 - 0.35, x1: tx0 - CW / 2 + cols * PW, y1: ty0 - CH / 2 + rowsUsed * PH };
    } else {
      const per = Math.max(4, Math.min(handIdx.length, Math.floor((Math.max(aw, 16) + 0.3) / PW)));
      const rows = Math.ceil(handIdx.length / per);
      const trayW = Math.min(handIdx.length, per) * PW - 0.35;
      const tx0 = (area.x0 + area.x1) / 2 - trayW / 2 + CW / 2, ty0 = area.y1 + 0.7 + CH / 2;
      handIdx.forEach((hi, k) => { home[d.hand[hi]] = [tx0 + (k % per) * PW, ty0 + Math.floor(k / per) * PH]; });
      trayBox = { x0: tx0 - CW / 2 - 0.35, y0: ty0 - CH / 2 - 0.35, x1: tx0 - CW / 2 + trayW + 0.35, y1: ty0 - CH / 2 + rows * PH };
    }
    const all = { x0: Math.min(area.x0, trayBox.x0) - 0.4, y0: Math.min(area.y0, trayBox.y0) - 0.4, x1: Math.max(area.x1, trayBox.x1) + 0.4, y1: Math.max(area.y1, trayBox.y1) + 0.4 };
    K.felt(all);
    C.s('rect', { x: trayBox.x0, y: trayBox.y0, width: trayBox.x1 - trayBox.x0, height: trayBox.y1 - trayBox.y0, rx: 0.4, class: 'cd-tray' }, wb.layer('bg'));
    // faint guide lines along every line that must add up (the star and the triangle need them to be seen)
    items.forEach((it) => {
      if (it.t !== 'sum' || it.slots.length < 2) return;
      const a = SP[it.slots[0]], b = SP[it.slots[it.slots.length - 1]], u = G.norm(G.sub(b, a));
      const A = G.sub(a, G.mul(u, 1.4)), B = G.add(b, G.mul(u, 1.4));
      C.s('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], class: 'cd-guide' }, wb.layer('bg'));
    });
    const langRow = items.find((it) => it.t === 'langford');
    SP.forEach((q, i) => K.slot(q[0], q[1], given[i] ? 'given' : '', langRow && langRow.slots.includes(i) ? String(langRow.slots.indexOf(i) + 1) : null));
    wb.setBounds(all, 0.04);

    for (const k in given) {
      const q = SP[+k];
      wb.add({ id: 'g' + given[k], type: 'card', kind: 'card', name: short(given[k]) + ' (fixed)', x: q[0], y: q[1], move: false, cls: 'cd-given', data: { c: given[k], up: true, given: true } });
    }
    d.hand.forEach((code) => {
      const h = home[code];
      wb.add({ id: 'c' + code, type: 'card', kind: 'card', name: short(code), x: h[0], y: h[1], snap: true, data: { c: code, up: true } });
    });
    const movable = () => wb.all().filter((o) => o.type === 'card' && o.move !== false);
    const slotAt = (x, y) => { for (let i = 0; i < n; i++) if (Math.abs(SP[i][0] - x) < 0.3 && Math.abs(SP[i][1] - y) < 0.3) return i; return -1; };
    function placement() {
      const A = new Array(n).fill(null), where = {};
      for (const k in given) A[+k] = card(given[k]);
      movable().forEach((o) => { const s = slotAt(o.x, o.y); if (s >= 0 && !A[s]) { A[s] = card(o.data.c); where[o.data.c] = s; } });
      return { A, where };
    }
    let last = {};
    const remember = () => { last = {}; movable().forEach((o) => { last[o.id] = [o.x, o.y]; }); };
    remember();

    function tweenEl(o, from) {
      if (!o.el) return;
      const to = [o.x, o.y];
      if (G.dist(from, to) < 1e-3) return;
      K.tween(160, (e) => { if (o.el && o.x === to[0] && o.y === to[1]) o.el.setAttribute('transform', G.svgTransform({ x: from[0] + (to[0] - from[0]) * e, y: from[1] + (to[1] - from[1]) * e })); }).then(() => { if (o.el) wb.place(o); });
    }

    wb.handlers.snap = (o, at) => {
      let best = -1, bd = 1.6;
      SP.forEach((q, i) => { const dd = Math.hypot(q[0] - at.x, q[1] - at.y); if (dd < bd) { bd = dd; best = i; } });
      return best >= 0 ? { x: SP[best][0], y: SP[best][1] } : null;
    };
    wb.handlers.settle = (objs, why) => {
      if (why !== 'move') return;
      const moved = objs.filter((o) => o.type === 'card' && o.move !== false && last[o.id] && G.dist(last[o.id], [o.x, o.y]) > 1e-6);
      moved.forEach((o) => {
        const s = slotAt(o.x, o.y);
        if (s < 0) return;
        if (given[s]) {
          const from = [o.x, o.y];
          o.x = last[o.id][0]; o.y = last[o.id][1];
          tweenEl(o, from);
          ctx.toast('That place holds a fixed card.');
          return;
        }
        const q = movable().find((x) => x !== o && Math.abs(x.x - o.x) < 0.3 && Math.abs(x.y - o.y) < 0.3);
        if (q) { const from = [q.x, q.y]; q.x = last[o.id][0]; q.y = last[o.id][1]; tweenEl(q, from); }
      });
      if (moved.length) ctx.move();
      remember();
      refresh();
    };
    wb.on('restore', () => { remember(); refresh(); });
    K.onDbl((o) => { K.turn(o, o.data.up === false, 260).then(() => wb.emit('change', { why: 'turn', objs: [o] })); });

    /* the badges and marks that say how each line is doing */
    const ov = C.s('g', { class: 'cd-ov' }, wb.layer('top'));
    const hintG = C.s('g', { class: 'cd-hintg' }, wb.layer('top'));
    function badgeAt(it) {
      const pts = it.slots.map((s) => SP[s]);
      const a = pts[0], b = pts[pts.length - 1];
      const rule = d.rules[it.ri];
      if (rule.badge === 'side') {
        const mid = G.mid(a, b);
        let nrm = G.perp(G.norm(G.sub(b, a)));
        if (G.dot(nrm, G.sub(mid, centre)) < 0) nrm = G.mul(nrm, -1);
        return G.add(mid, G.mul(nrm, 2.4));
      }
      const u = G.norm(G.sub(b, a));
      const ext = Math.abs(u[0]) > Math.abs(u[1]) * 1.2 ? 2.2 : Math.abs(u[1]) > Math.abs(u[0]) * 1.2 ? 2.55 : 2.6;
      return G.add(b, G.mul(u, ext));
    }
    function outline(s, cls) {
      const q = SP[s];
      C.s('rect', { x: q[0] - CW / 2 - 0.1, y: q[1] - CH / 2 - 0.1, width: CW + 0.2, height: CH + 0.2, rx: 0.24, class: 'cd-mark ' + cls }, ov);
    }
    function refresh() {
      const { A } = placement();
      const rep = analyse(d, A);
      ov.innerHTML = '';
      const marked = new Set();
      rep.forEach((r) => {
        const it = r.it;
        if (it.t === 'distinct' || it.t === 'sum') {
          const at = badgeAt(it);
          const cls = r.bad ? 'bad' : r.done ? 'ok' : '';
          const g = C.s('g', { class: 'cd-bdg ' + cls, transform: 'translate(' + at[0] + ' ' + at[1] + ')' }, ov);
          C.s('circle', { r: 0.5 }, g);
          const txt = it.t === 'sum' ? (r.sum ? String(r.sum) : '·') : r.bad ? '✗' : r.done ? '✓' : '·';
          C.s('text', { y: 0.19, 'text-anchor': 'middle', text: txt, class: it.t === 'sum' ? 'num' : '' }, g);
          if (r.bad && it.t === 'distinct') r.pairs.forEach(([x, y]) => { [x, y].forEach((s) => { if (!marked.has(s)) { marked.add(s); outline(s, 'bad'); } }); });
          if (r.bad && it.t === 'sum' && r.done) it.slots.forEach((s) => { if (!marked.has(s)) { marked.add(s); outline(s, 'warn'); } });
        } else if (it.t === 'apart' && r.bad) {
          const a = SP[it.slots[0]], b = SP[it.slots[1]];
          C.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'cd-link bad' }, ov);
          it.slots.forEach((s) => { if (!marked.has(s)) { marked.add(s); outline(s, 'bad'); } });
        } else if (it.t === 'langford') {
          (r.arcs || []).forEach((ac, k) => {
            const a = SP[ac.a], b = SP[ac.b], h = 1.1 + 0.28 * (ac.r % 4);
            const y = Math.min(a[1], b[1]) - CH / 2 - 0.1;
            C.s('path', { d: 'M' + a[0] + ' ' + y + 'C' + a[0] + ' ' + (y - h) + ' ' + b[0] + ' ' + (y - h) + ' ' + b[0] + ' ' + y, class: 'cd-arc ' + (ac.good ? 'ok' : 'bad') }, ov);
            C.s('text', { x: (a[0] + b[0]) / 2, y: y - h * 0.78, 'text-anchor': 'middle', class: 'cd-arct ' + (ac.good ? 'ok' : 'bad'), text: ac.between + ' between' }, ov);
          });
        }
      });
      const placed = A.filter(Boolean).length - Object.keys(given).length;
      ctx.stat('Placed', placed + ' / ' + d.hand.length);
      return { A, rep };
    }

    function check() {
      const { A, rep } = refresh();
      const empty = A.filter((c) => !c).length;
      const bad = rep.find((r) => r.bad && (r.it.t !== 'sum' || r.done));
      if (!empty && !bad) return { solved: true, msg: 'Every line is right.' };
      if (bad) return { solved: false, msg: badText(bad, A) };
      return { solved: false, msg: 'Place all the cards first: ' + C.plural(empty, 'place') + ' still empty.' };
    }
    function badText(r, A) {
      const it = r.it;
      if (it.t === 'distinct') {
        const [x, y] = r.pairs[0];
        const what = it.by === 'suit' ? 'suit' : it.by === 'rank' ? 'rank' : 'colour';
        return 'A line has two cards of the same ' + what + ': ' + short(A[x].code) + ' and ' + short(A[y].code) + '.';
      }
      if (it.t === 'sum') return 'A line adds up to ' + r.sum + ', not ' + it.total + '.';
      if (it.t === 'apart') {
        const [x, y] = it.slots;
        const why = it.by === 'consec' ? 'are next to each other in rank' : it.by === 'colour' ? 'are the same colour' : it.by === 'suit' ? 'are the same suit' : 'are the same rank';
        return short(A[x].code) + ' and ' + short(A[y].code) + ' ' + why + ' and they touch.';
      }
      if (it.t === 'langford') { const a = r.arcs.find((x) => !x.good); return 'The two ' + RANKNAME[a.r] + 's have ' + a.between + ' cards between them; they need ' + (gapOf(a.r, it.skolem) - 1) + '.'; }
      return 'Something is not right yet.';
    }

    function showHint(o, s) {
      hintG.innerHTML = '';
      if (s != null) { const q = SP[s]; C.s('rect', { x: q[0] - CW / 2 - 0.12, y: q[1] - CH / 2 - 0.12, width: CW + 0.24, height: CH + 0.24, rx: 0.26, class: 'cd-hintbox' }, hintG); }
      if (o && o.el) { o.el.classList.add('cd-hinted'); K.later(() => o.el && o.el.classList.remove('cd-hinted'), 4500); }
      K.later(() => { hintG.innerHTML = ''; }, 4500);
    }

    refresh();
    ctx.setGoal(p.goal || null);
    return {
      check,
      hint() {
        const { A, where } = placement();
        const fixed = {};
        for (const c in where) fixed[where[c]] = c;
        const r = solveArrange(d, { fixed, limit: 1, nodes: 4e5 });
        if (r.count) {
          const sol = r.sols[0];
          const s = sol.findIndex((c, i) => !A[i]);
          if (s < 0) return 'Every card is in a good place — press Check.';
          const o = wb.get('c' + sol[s]);
          return { text: 'The **' + short(sol[s]) + '** can go in the glowing place.', show() { showHint(o, s); } };
        }
        if (r.aborted) return 'Look for a line where two cards share a suit or a rank — one of them has to move.';
        for (const s in fixed) {
          const f2 = Object.assign({}, fixed);
          delete f2[s];
          const r2 = solveArrange(d, { fixed: f2, limit: 1, nodes: 2e5 });
          if (r2.count) {
            const o = wb.get('c' + fixed[s]);
            return { text: 'The **' + short(fixed[s]) + '** cannot stay where it is: no finished arrangement keeps it there.', show() { showHint(o, +s); } };
          }
        }
        return 'The cards you have placed cannot all stay. Put a few back in the tray and try again.';
      },
      solve() {
        let sol = d.sol;
        if (!sol) { const r = solveArrange(d, { limit: 1 }); sol = r.sols[0]; }
        if (!sol) return;
        wb.select([]);
        const moves = [];
        sol.forEach((code, s) => { if (given[s]) return; const o = wb.get('c' + code); if (o) moves.push({ o, x: SP[s][0], y: SP[s][1] }); });
        moves.forEach((m) => { if (m.o.data.up === false) K.turn(m.o, true, 200); });
        K.toTop(moves.map((m) => m.o));
        Promise.all(moves.map((m, i) => K.wait(i * 50).then(() => K.glide(m.o, m.x, m.y, 420, 0.8)))).then(() => {
          if (!K.alive) return;
          remember(); refresh(); ctx.changed('solve');
        });
      },
      destroy() { K.stop(); wb.handlers.snap = null; wb.handlers.settle = null; }
    };
  }

  /* ---------- deal: order the pile, then deal it ---------- */

  function mountDeal(ctx, p, K) {
    const d = p.data, wb = ctx.wb, n = d.cards.length;
    // on a phone the pile and the dealt cards wrap into rows of about five
    const narrow = wb.isNarrow();
    const perRow = narrow ? (n <= 5 ? n : Math.ceil(n / Math.ceil(n / 5))) : n > 7 ? Math.ceil(n / 2) : n;
    const SPX = 2.9, SPY = 4.9;
    const slotPos = (i) => [(i % perRow) * SPX, Math.floor(i / perRow) * SPY];
    const rowsH = (Math.ceil(n / perRow) - 1) * SPY;
    const pileAt = [-3.6, rowsH + 6.4];
    const dPer = narrow ? perRow : n;
    const dsp = narrow ? SPX : n <= 6 ? 2.9 : n <= 9 ? 2.2 : 1.7;
    const dealAt = (j) => [(j % dPer) * dsp, rowsH + 6.4 + Math.floor(j / dPer) * 4.4];
    const w = Math.max((perRow - 1) * SPX, (Math.min(n, dPer) - 1) * dsp);
    const box = { x0: pileAt[0] - CW / 2 - 0.9, y0: -CH / 2 - 1.6, x1: w + CW / 2 + 0.9, y1: dealAt(n - 1)[1] + CH / 2 + 1.1 };
    K.felt(box);
    for (let i = 0; i < n; i++) {
      const q = slotPos(i);
      K.slot(q[0], q[1], 'pile');
      C.s('text', { x: q[0], y: q[1] - CH / 2 - 0.3, 'text-anchor': 'middle', class: 'cd-slotno', text: i === 0 ? '1 · top' : i === n - 1 ? n + ' · bottom' : String(i + 1) }, wb.layer('bg'));
    }
    // where the cards should come out
    for (let j = 0; j < n; j++) { const q = dealAt(j); K.slot(q[0], q[1], 'dealt', short(d.target[j])); }
    C.s('text', { x: pileAt[0], y: pileAt[1] - CH / 2 - 0.3, 'text-anchor': 'middle', class: 'cd-slotno', text: 'the pile' }, wb.layer('bg'));
    K.slot(pileAt[0], pileAt[1], 'pilespot');
    C.s('text', { x: 0 - CW / 2, y: pileAt[1] - CH / 2 - 0.3, class: 'cd-slotno', text: 'dealt, in this order →' }, wb.layer('bg'));
    wb.setBounds(box, 0.04);
    const spellG = C.s('g', { class: 'cd-spell' }, wb.layer('top'));
    const markG = C.s('g', { class: 'cd-ov' }, wb.layer('top'));

    let order = d.cards.slice();
    let dealtOk = false;
    const byCode = K.byId('c');
    order.forEach((code, i) => {
      const q = slotPos(i);
      byCode[code] = wb.add({ id: 'c' + code, type: 'card', kind: 'card', name: short(code), x: q[0], y: q[1], snap: true, data: { c: code, up: true } });
    });
    function layout(animate) {
      order.forEach((code, i) => {
        const o = byCode[code], q = slotPos(i);
        if (o.data.up === false) { o.data.up = true; wb.renderObj(o); }
        if (animate) K.glide(o, q[0], q[1], 260); else wb.update(o, { x: q[0], y: q[1] });
      });
      markG.innerHTML = '';
      spellG.innerHTML = '';
    }
    const slotNear = (x, y) => { let best = -1, bd = 1.7; for (let i = 0; i < n; i++) { const q = slotPos(i); const dd = Math.hypot(q[0] - x, q[1] - y); if (dd < bd) { bd = dd; best = i; } } return best; };
    wb.handlers.snap = (o, at) => { const s = slotNear(at.x, at.y); if (s < 0) return null; const q = slotPos(s); return { x: q[0], y: q[1] }; };
    wb.handlers.settle = (objs, why) => {
      if (why !== 'move' || K.busy) return;
      const o = objs.find((x) => x.type === 'card');
      if (!o) return;
      const from = order.indexOf(o.data.c), s = slotNear(o.x, o.y);
      if (s >= 0 && s !== from) {
        const t = order[s];
        order[s] = o.data.c; order[from] = t;
        ctx.move();
        ctx.sfx('snap');
      }
      dealtOk = false;
      layout(true);
    };
    wb.handlers.pick = () => { if (dealtOk || stray) { dealtOk = false; stray = false; layout(true); } };
    let stray = false;
    K.onDbl((o) => { K.turn(o, o.data.up === false, 240); });

    let gen = 0;
    const hold = (on) => { order.map((c) => byCode[c]).forEach((o) => { o.move = !on; }); K.busy = on; ctx.lockUndo(on); };
    async function play(fromSolve) {
      if (K.busy) return;
      const my = ++gen;
      const live = () => K.alive && my === gen;
      hold(true);
      wb.select([]);
      layout(false);
      stray = true;
      const cards = order.map((c) => byCode[c]);
      const stackY = (k, of) => pileAt[1] - (of - 1 - k) * 0.035;
      // gather the pile, face down, top card on top
      K.toTop(cards.slice().reverse());
      ctx.say('Gathering the pile…');
      await Promise.all(cards.map((o, i) => K.wait(i * 35).then(() => Promise.all([K.glide(o, pileAt[0], stackY(i, n), 340, 1.2), K.turn(o, false, 300)]))));
      if (!live()) return;
      ctx.say(d.rule.spell ? 'Spelling and dealing…' : 'Dealing: ' + ruleText(d.rule) + '…');
      await K.wait(250);
      const { steps } = dealSteps(n, d.rule);
      const q = order.slice();
      const out = [];
      let wrong = -1, word = null, wi = 0;
      const words = d.rule.spell || null;
      let letterIdx = 0;
      const drawWord = () => {
        spellG.innerHTML = '';
        if (!word) return;
        const x0 = pileAt[0] - (word.length - 1) * 0.36;
        word.split('').forEach((ch, k) => C.s('text', { x: x0 + k * 0.72, y: pileAt[1] - CH / 2 - 1.1, 'text-anchor': 'middle', class: 'cd-letter' + (k < letterIdx ? ' on' : '') + (k === letterIdx - 1 ? ' now' : ''), text: ch }, spellG));
      };
      for (let si = 0; si < steps.length; si++) {
        const st = steps[si];
        const speed = Math.max(0.45, 1 - si / (steps.length * 1.4));
        if (words && st.letter) {
          if (!word || letterIdx >= word.length) { word = words[wi++] || null; letterIdx = 0; }
          letterIdx++;
          drawWord();
        }
        if (st.t === 'stay') { await K.wait(220 * speed); if (!live()) return; continue; }
        const code = q.shift(), o = byCode[code];
        if (st.t === 'under') {
          q.push(code);
          ctx.sfx('tap');
          await K.glide(o, pileAt[0] + 2.0, pileAt[1] - 0.8, 170 * speed);
          if (!live()) return;
          // under the pile: to the bottom of the stack
          const pileIds = q.slice().reverse().map((c) => byCode[c].id), outIds = out.map((c) => byCode[c].id);
          const set = new Set(pileIds.concat(outIds));
          wb.order = wb.order.filter((id) => !set.has(id)).concat(pileIds, outIds);
          wb.restack();
          q.forEach((c, k) => { if (c !== code) wb.update(byCode[c], { x: pileAt[0], y: stackY(k, q.length) }); });
          await K.glide(o, pileAt[0], stackY(q.length - 1, q.length), 170 * speed);
          if (!live()) return;
        } else {
          out.push(code);
          const j = out.length - 1, to = dealAt(j);
          K.toTop([o]);
          ctx.sfx('snap');
          await Promise.all([K.glide(o, to[0], to[1], 330 * speed, 1.4), K.wait(60 * speed).then(() => K.turn(o, true, 240 * speed))]);
          if (!live()) return;
          if (code !== d.target[j]) { wrong = j; break; }
        }
      }
      spellG.innerHTML = '';
      if (!live()) return;
      if (wrong >= 0) {
        const o = byCode[out[wrong]], at = dealAt(wrong);
        C.s('rect', { x: at[0] - CW / 2 - 0.1, y: at[1] - CH / 2 - 0.1, width: CW + 0.2, height: CH + 0.2, rx: 0.24, class: 'cd-mark bad' }, markG);
        if (o.el) { o.el.classList.add('cd-shake'); K.later(() => o.el && o.el.classList.remove('cd-shake'), 600); }
        ctx.sfx('wrong');
        ctx.say('Card ' + (wrong + 1) + ' came out as the **' + short(out[wrong]) + '**, but the **' + short(d.target[wrong]) + '** was wanted there. Back to the pile — try again.', 'warn');
        await K.wait(1500);
        if (!live()) return;
        markG.innerHTML = '';
        hold(false);
        layout(true);
        stray = false;
        return;
      }
      // a little wave of joy along the dealt row
      out.forEach((c, j) => K.wait(j * 45).then(() => { const o = byCode[c]; if (o && o.el) { o.el.classList.add('cd-hop'); K.later(() => o.el && o.el.classList.remove('cd-hop'), 700); } }));
      dealtOk = true;
      hold(false);
      ctx.say('Every card came out in order.', 'good');
      if (fromSolve) ctx.changed('solve'); else ctx.solved({ msg: 'The deal came out ' + d.target.map(short).join(' ') + '.' });
    }

    ctx.setGoal(p.goal || ('Order the pile so that the deal brings out ' + d.target.map(short).join(' ') + '. Then press **Deal**.'));


    return {
      checkLabel: 'Deal',
      check(manual) {
        if (manual) { if (!K.busy) play(false); return null; }
        return { solved: dealtOk && order.join() === pileFor(d.target, d.rule).join(), msg: '' };
      },
      hint(k) {
        const sol = pileFor(d.target, d.rule);
        const wrongAt = order.findIndex((c, i) => c !== sol[i]);
        if (wrongAt < 0) return 'The pile is right — press **Deal** and watch.';
        const { out } = dealSteps(n, d.rule);
        const j = out.indexOf(wrongAt);
        if (k === 0) return 'Work backwards from the end: the last card dealt is the one left alone at the very end. Which place in the pile does the ' + ordinal(n) + ' card dealt come from? Deal a pile of numbered places in your head (or with the pen) and see.';
        return {
          text: 'Place ' + (wrongAt + 1) + ' of the pile is dealt ' + ordinal(j + 1) + ', so the **' + short(sol[wrongAt]) + '** belongs there.',
          show() { const o = byCode[sol[wrongAt]]; if (o && o.el) { o.el.classList.add('cd-hinted'); K.later(() => o.el && o.el.classList.remove('cd-hinted'), 4000); } const q = slotPos(wrongAt); markG.innerHTML = ''; C.s('rect', { x: q[0] - CW / 2 - 0.12, y: q[1] - CH / 2 - 0.12, width: CW + 0.24, height: CH + 0.24, rx: 0.26, class: 'cd-hintbox' }, markG); K.later(() => { markG.innerHTML = ''; }, 4000); }
        };
      },
      solve() {
        const sol = pileFor(d.target, d.rule);
        order = sol.slice();
        dealtOk = false;
        layout(true);
        K.later(() => play(true), 450);
      },
      explain() {
        return 'Work backwards: deal a pile of numbered places (1 = top) by the rule and note which place comes out first, second, and so on. Then put the card that must come out first in the place that is dealt first, and so on. For this deal the places come out in the order ' + dealSteps(n, d.rule).out.map((i) => i + 1).join(', ') + '.';
      },
      getState() { return { order: order.slice(), ok: dealtOk }; },
      setState(s) {
        if (!s || !s.order) return;
        if (K.busy) { gen++; hold(false); }
        order = s.order.slice(); dealtOk = false; stray = false;
        layout(false);
        K.toTop(order.map((c) => byCode[c]));
      },
      reset() { ctx.say(''); },
      destroy() { K.stop(); wb.handlers.snap = null; wb.handlers.settle = null; wb.handlers.pick = null; }
    };
  }
  function ordinal(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

  /* ---------- piles: the three-pile trick, played as the magician ---------- */

  const PLACE = ['on top', 'in the middle', 'at the bottom'];
  const PILENAME = ['left', 'middle', 'right'];

  function fullPack() { const f = []; for (const s of SUITS) for (let r = 1; r <= 13; r++) f.push(mk(r, s)); return f; }

  function mountPiles(ctx, p, K) {
    const d = p.data, wb = ctx.wb, n = d.n, rounds = d.rounds, per = n / 3;
    const rng = C.rng(p.id + ':deck');
    const deck0 = rng.shuffle(fullPack()).slice(0, n);
    const secret = deck0[rng.int(n)];
    const deckAt = [0, 0];
    const colX = (c) => 4.4 + c * 3.4, colY = (k) => -1.2 + k * 0.78;
    const colH = CH + (per - 1) * 0.78;
    const rowY = colY(0) + colH + 1.9;
    const cnt = Math.max(d.target, 1);
    const csp = Math.min(1.45, 11 / cnt);
    const countAt = (j) => [-0.2 + j * csp, rowY];
    const box = { x0: deckAt[0] - CW / 2 - 0.9, y0: -CH / 2 - 4.4, x1: Math.max(colX(2), countAt(cnt - 1)[0]) + CW / 2 + 0.9, y1: rowY + CH / 2 + 0.9 };
    K.felt(box);
    K.slot(deckAt[0], deckAt[1], 'pilespot');
    C.s('text', { x: deckAt[0], y: deckAt[1] + CH / 2 + 0.6, 'text-anchor': 'middle', class: 'cd-slotno', text: 'the deck' }, wb.layer('bg'));
    const glow = [0, 1, 2].map((c) => C.s('rect', { x: colX(c) - CW / 2 - 0.25, y: colY(0) - CH / 2 - 0.25, width: CW + 0.5, height: colH + 0.5, rx: 0.4, class: 'cd-pileglow' }, wb.layer('board')));
    [0, 1, 2].forEach((c) => C.s('text', { x: colX(c), y: colY(0) - CH / 2 - 0.45, 'text-anchor': 'middle', class: 'cd-slotno', text: PILENAME[c] + ' pile' }, wb.layer('bg')));
    const bubble = C.s('g', { class: 'cd-bubble' }, wb.layer('top'));
    wb.setBounds(box, 0.04);
    const byCode = K.byId('c');
    deck0.forEach((code, i) => { byCode[code] = wb.add({ id: 'c' + code, type: 'card', kind: 'card', name: short(code), x: deckAt[0], y: deckAt[1], move: false, cls: 'cd-noptr', data: { c: code, up: false } }); });

    let choices = [], shown = false;
    const deckAfter = (ch) => { let dk = deck0.slice(); ch.forEach((t) => { const pl = pileDeal(dk); dk = gatherAt(pl, pl.findIndex((x) => x.includes(secret)), t).deck; }); return dk; };
    const pileOfSecret = (dk) => pileDeal(dk).findIndex((x) => x.includes(secret));
    function say(text, x) {
      bubble.innerHTML = '';
      if (!text) return;
      const w = Math.max(6, text.length * 0.27);
      const bx = x == null ? colX(1) : x;
      C.s('rect', { x: bx - w / 2, y: -CH / 2 - 4.1, width: w, height: 1.25, rx: 0.5 }, bubble);
      C.s('path', { d: 'M' + (bx - 0.35) + ' ' + (-CH / 2 - 2.86) + 'l0.35 0.5l0.35-0.5z' }, bubble);
      C.s('text', { x: bx, y: -CH / 2 - 3.25, 'text-anchor': 'middle', text }, bubble);
    }
    function lightPile(c) { glow.forEach((g, i) => g.classList.toggle('on', i === c)); }
    function placePiles(dk) {
      const pl = pileDeal(dk);
      pl.forEach((pile, c) => pile.forEach((code, k) => { const o = byCode[code]; o.data.up = true; wb.update(o, { x: colX(c), y: colY(k) }, true); }));
      K.toTop(pl.reduce((a, pile) => a.concat(pile.map((c) => byCode[c])), []).sort((a, b) => a.y - b.y));
    }
    function placeDeck(dk) { dk.slice().reverse().forEach((code, k) => { const o = byCode[code]; o.data.up = false; wb.update(o, { x: deckAt[0], y: deckAt[1] - k * 0.03 }, true); }); K.toTop(dk.slice().reverse().map((c) => byCode[c])); }
    function finalPos() { return deckAfter(choices).indexOf(secret); }
    function render() {
      const dk = deckAfter(choices);
      lightPile(-1);
      if (choices.length < rounds) {
        placePiles(dk);
        const pi = pileOfSecret(dk);
        lightPile(pi);
        say('My card is in the ' + PILENAME[pi] + ' pile.', colX(pi));
        ctx.say('Round ' + (choices.length + 1) + ' of ' + rounds + ': where does the ' + PILENAME[pi] + ' pile go when you gather them?');
      } else {
        placeDeck(dk);
        const out = dk.slice(0, d.target);
        out.forEach((code, j) => { const o = byCode[code], q = countAt(j); o.data.up = j === d.target - 1; wb.update(o, { x: q[0], y: q[1] }, true); });
        K.toTop(out.map((c) => byCode[c]));
        const ok = dk[d.target - 1] === secret;
        say(ok ? 'That is my card! How did you do that?' : 'No — my card was the ' + short(secret) + '.', countAt(d.target - 1)[0]);
        ctx.say(ok ? 'The ' + ordinal(d.target) + ' card is the one.' : 'The chosen card ended up ' + ordinal(dk.indexOf(secret) + 1) + '. Undo your last choices, or Reset.', ok ? 'good' : 'warn');
      }
      syncButtons();
    }
    const btns = PLACE.map((w, t) => ctx.button('Put it ' + w, () => choose(t), t === 1 ? 'primary' : ''));
    function syncButtons() { btns.forEach((b) => { b.disabled = K.busy || choices.length >= rounds; }); }

    let gen = 0;
    async function gatherAndDeal(t, my) {
      const live = () => K.alive && my === gen;
      const dk = deckAfter(choices);
      const pl = pileDeal(dk), pi = pileOfSecret(dk);
      const { order } = gatherAt(pl, pi, t);
      say('');
      lightPile(-1);
      // gather: the piles go onto the deck, the first one in the order ending on top
      const moving = [];
      order.slice().reverse().forEach((c, idx) => pl[c].slice().reverse().forEach((code, k) => moving.push({ o: byCode[code], delay: idx * 140 + k * 12 })));
      K.toTop(moving.map((m) => m.o));
      await Promise.all(moving.map((m) => K.wait(m.delay).then(() => Promise.all([K.glide(m.o, deckAt[0], deckAt[1], 300, 0.6), K.turn(m.o, false, 240)]))));
      if (!live()) return false;
      choices.push(t);
      const nd = deckAfter(choices);
      placeDeck(nd);
      await K.wait(220);
      if (!live()) return false;
      if (choices.length < rounds) {
        // deal the next round, face up, left-middle-right
        for (let i = 0; i < nd.length; i++) {
          const code = nd[i], o = byCode[code], c = i % 3, k = Math.floor(i / 3);
          K.toTop([o]);
          if (c === 0) ctx.sfx('tap');
          K.glide(o, colX(c), colY(k), 220, 0.5);
          K.turn(o, true, 200);
          await K.wait(40);
          if (!live()) return false;
        }
        await K.wait(260);
      } else {
        // count down to the target place and turn that card up
        for (let j = 0; j < d.target; j++) {
          const o = byCode[nd[j]], q = countAt(j);
          K.toTop([o]);
          ctx.sfx('tap');
          await K.glide(o, q[0], q[1], 200, 0.5);
          if (!live()) return false;
        }
        await K.turn(byCode[nd[d.target - 1]], true, 320);
        shown = true;
      }
      return live();
    }
    async function choose(t, fromSolve) {
      if (K.busy || choices.length >= rounds) return false;
      K.busy = true; ctx.lockUndo(true); syncButtons();
      const ok = await gatherAndDeal(t, gen);
      if (!ok) return false;
      K.busy = false; ctx.lockUndo(false);
      render();
      if (choices.length === rounds && finalPos() === d.target - 1) ctx.sfx('solve');
      else if (choices.length === rounds) ctx.sfx('wrong');
      ctx.move();
      ctx.changed(fromSolve && choices.length === rounds ? 'solve' : 'choice');
      return true;
    }
    function planFrom(ch) {
      let pos = deckAfter(ch).indexOf(secret);
      // the remaining choices from here: follow a card at this position
      const left = rounds - ch.length;
      const tail = allChoices(left).find((rest) => followPos(n, pos, rest) === d.target - 1);
      return tail || null;
    }

    ctx.setGoal(p.goal || ('After ' + C.plural(rounds, 'round') + ', the spectator\'s card must be the **' + ordinal(d.target) + '** card from the top.'));
    render();
    return {
      noMoves: false,
      check() {
        if (choices.length < rounds) return { solved: false, msg: C.plural(rounds - choices.length, 'round') + ' still to go.' };
        const ok = shown && finalPos() === d.target - 1;
        return { solved: ok, msg: ok ? 'The ' + ordinal(d.target) + ' card is the spectator\'s.' : 'The card is ' + ordinal(finalPos() + 1) + ', not ' + ordinal(d.target) + '.' };
      },
      hint(k) {
        if (choices.length >= rounds) return finalPos() === d.target - 1 ? 'Done!' : 'Take back your choices (Undo) and try again.';
        const tail = planFrom(choices);
        if (!tail) return 'From here the card cannot reach place ' + d.target + ' any more — undo a choice.';
        if (k === 0) return 'Each gathering decides one digit of the card\'s final place, written in base 3: the first round is the units, the second the threes, the third the nines. Write ' + (d.target - 1) + ' in base 3.';
        return 'This round, put the named pile **' + PLACE[tail[0]] + '**.';
      },
      solve() {
        const go = async () => {
          let tail = planFrom(choices);
          if (!tail) { choices = []; shown = false; render(); tail = planFrom(choices); }
          for (const t of tail) { if (!(await choose(t, true))) return; await K.wait(200); }
        };
        if (K.busy) K.later(() => this.solve(), 400); else go();
      },
      explain() {
        const digits = [];
        let v = d.target - 1;
        for (let i = 0; i < rounds; i++) { digits.push(v % 3); v = Math.floor(v / 3); }
        return 'After each deal a card\'s new place depends only on where its pile goes and how deep it lies in the pile — and the depth is its old place divided by three. So the old place is shaved away one base-3 digit per round, and your choices write in the new digits: top = 0, middle = 1, bottom = 2, the first round giving the units. Place ' + d.target + ' is ' + (d.target - 1) + ' counting from 0, which is ' + digits.slice().reverse().join('') + ' in base 3; so the choices are ' + digits.map((x) => PLACE[x]).join(', then ') + '.';
      },
      getState() { return { ch: choices.slice(), shown }; },
      setState(s) {
        if (!s) return;
        if (K.busy) { gen++; K.busy = false; ctx.lockUndo(false); }
        choices = (s.ch || []).slice(); shown = choices.length >= rounds;
        render();
      },
      destroy() { K.stop(); }
    };
  }

  /* ---------- ask: a question, with an experiment on the table ---------- */

  function mountAsk(ctx, p, K) {
    const d = p.data, wb = ctx.wb, a = d.answer, demo = d.demo || { type: 'static', cards: [] };
    const box = ctx.answer({
      kind: a.choice != null ? 'choice' : 'number',
      choices: a.choices, label: d.ask || null,
      placeholder: 'A number',
      check: (v) => {
        if (a.choice != null) {
          if (v === a.choice) return { ok: true, msg: a.msg || ('Yes: **' + a.choices[a.choice] + '**.') };
          const t = (d.traps || []).find((x) => x.match === v);
          return { ok: false, msg: t ? t.msg : null };
        }
        const x = readNum(v);
        if (isNaN(x)) return { ok: false, msg: 'That does not look like a number.' };
        if (Math.abs(x - a.num) < 1e-9) return { ok: true, msg: a.msg || ('Yes: **' + a.num + '**.') };
        const t = (d.traps || []).find((tr) => Math.abs(tr.match - x) < 1e-9);
        return { ok: false, msg: t ? t.msg : null };
      }
    });
    const inst = { noMoves: true, destroy() { K.stop(); }, solve() { box.feedback('The answer: <b>' + (a.choice != null ? C.md(a.choices[a.choice]) : a.num) + '</b>', 'good'); } };
    if (demo.type === 'gilbreath') demoGilbreath(ctx, K, demo);
    else if (demo.type === 'downunder') demoDownUnder(ctx, K, demo);
    else {
      const cs = demo.cards || [];
      const sp = demo.gap || 2.9;
      const bx = { x0: -CW / 2 - 1, y0: -CH / 2 - 1, x1: Math.max(0, cs.length - 1) * sp + CW / 2 + 1, y1: CH / 2 + 1 };
      K.felt(bx);
      cs.forEach((c, i) => wb.add({ id: 'c' + c + i, type: 'card', kind: 'card', name: short(c), x: i * sp, y: 0, data: { c, up: demo.down ? false : true } }));
      K.onDbl((o) => K.turn(o, o.data.up === false, 240));
      wb.setBounds(bx, 0.06);
    }
    return inst;
  }

  function demoGilbreath(ctx, K, demo) {
    const wb = ctx.wb, n = demo.n || 16, period = demo.period || 2, reverse = demo.reverse !== false;
    const suitsCycle = period === 2 ? ['H', 'S', 'D', 'C'] : ['S', 'H', 'C', 'D'];
    const deck = [];
    for (let i = 0; i < n; i++) deck.push(mk((Math.floor(i / suitsCycle.length) % 13) + 1 + (period === 2 ? (i % 2) * 0 : 0), suitsCycle[i % suitsCycle.length]));
    const sp = 1.45, y0 = 0, y1 = 5.2;
    const bx = { x0: -CW / 2 - 1, y0: -CH / 2 - 1.2, x1: (n - 1) * sp + CW / 2 + 1, y1: y1 + CH / 2 + 1.4 };
    K.felt(bx);
    wb.setBounds(bx, 0.05);
    const byCode = K.byId('c');
    deck.forEach((c, i) => { byCode[c] = wb.add({ id: 'c' + c, type: 'card', kind: 'card', name: short(c), x: i * sp, y: y0, move: false, cls: 'cd-noptr', data: { c, up: true } }); });
    const marks = C.s('g', { class: 'cd-ov' }, wb.layer('top'));
    let row = deck.slice(), A = null, B = null, seed = 1;
    wb.on('restore', () => { if (K.busy) return; row = deck.slice(); A = B = null; marks.innerHTML = ''; });
    const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    seed = (Date.now() % 100000) + 7;
    const layRow = (list, y, ms) => Promise.all(list.map((c, i) => { K.toTop([byCode[c]]); return K.glide(byCode[c], i * sp, y, ms, 0.4); }));
    const busy = (on) => { K.busy = on; btns.forEach((b) => { b.disabled = on; }); };
    const btns = [
      ctx.button(reverse ? 'Deal about half off' : 'Cut about half off', async () => {
        if (K.busy || A) return;
        busy(true); marks.innerHTML = '';
        const k = Math.max(2, Math.min(n - 2, Math.round(n / 2 + (rng() - 0.5) * n * 0.4)));
        A = row.slice(0, k); B = row.slice(k);
        if (reverse) {
          // dealt one by one into a pile: the order turns round
          for (let i = 0; i < k; i++) { const o = byCode[row[i]]; K.toTop([o]); await K.glide(o, (k - 1 - i) * sp * 0 + 0, y1, 160, 0.6); if (!K.alive) return; }
          A = A.reverse();
          await layRow(A, y1, 260);
        } else await layRow(A, y1, 320);
        await layRow(B, y0, 260);
        ctx.say(reverse ? 'Dealt ' + k + ' cards into a pile (their order is now reversed). Now riffle the two packets together.' : 'Cut ' + k + ' cards off the top. Now riffle the two packets together.');
        busy(false);
      }),
      ctx.button('Riffle', async () => {
        if (K.busy) return;
        if (!A) { ctx.toast(reverse ? 'Deal some cards off first.' : 'Cut some cards off first.'); return; }
        busy(true);
        const out = [];
        let i = 0, j = 0;
        while (i < A.length || j < B.length) {
          const pa = (A.length - i) / (A.length - i + B.length - j);
          if (j >= B.length || (i < A.length && rng() < pa)) out.push(A[i++]); else out.push(B[j++]);
        }
        for (let k = 0; k < out.length; k++) { const o = byCode[out[k]]; K.toTop([o]); K.glide(o, k * sp, y0 + 2.4, 150, 0.3); await K.wait(40); if (!K.alive) return; }
        await K.wait(200);
        await layRow(out, y0, 220);
        row = out; A = null; B = null;
        busy(false);
        showGroups();
      }, 'primary'),
      ctx.button('New deck', async () => { if (K.busy) return; busy(true); marks.innerHTML = ''; A = B = null; row = deck.slice(); await layRow(row, y0, 300); busy(false); ctx.say(''); })
    ];
    function showGroups() {
      marks.innerHTML = '';
      let good = 0, total = 0;
      for (let g = 0; g + period <= row.length; g += period) {
        const grp = row.slice(g, g + period).map(card);
        const ok = period === 2 ? grp[0].red !== grp[1].red : new Set(grp.map((c) => c.s)).size === period;
        total++; if (ok) good++;
        const x0 = g * sp - CW / 2 + 0.1, x1 = (g + period - 1) * sp + CW / 2 - 0.1;
        C.s('path', { d: 'M' + x0 + ' ' + (y0 + CH / 2 + 0.3) + 'v0.35H' + x1 + 'v-0.35', class: 'cd-brace ' + (ok ? 'ok' : 'bad') }, marks);
      }
      ctx.say(good + ' of ' + total + ' groups of ' + period + ' have ' + (period === 2 ? 'one red and one black card' : 'one card of each suit') + '.', good === total ? 'good' : 'warn');
    }
    ctx.say('A deck arranged ' + (period === 2 ? 'red, black, red, black…' : 'in the suit order ♠ ♥ ♣ ♦ again and again') + '. Try the shuffle as often as you like.');
  }

  function demoDownUnder(ctx, K, demo) {
    const wb = ctx.wb, rule = demo.rule || { under: 1 };
    let m = demo.n || 10;
    const sp = 2.1, y1 = 5.4, max = 13;
    const bx = { x0: -CW / 2 - 1, y0: -CH / 2 - 1.3, x1: (max - 1) * sp + CW / 2 + 1, y1: y1 + CH / 2 + 1 };
    K.felt(bx);
    wb.setBounds(bx, 0.05);
    for (let r = 1; r <= max; r++) wb.add({ id: 'c' + r, type: 'card', kind: 'card', name: short(mk(r, 'S')), x: (r - 1) * sp, y: 0, move: false, cls: 'cd-noptr', data: { c: mk(r, 'S'), up: true } });
    const cardAt = (i) => wb.get('c' + (i + 1));
    const marks = C.s('g', { class: 'cd-ov' }, wb.layer('top'));
    const lab = C.s('text', { x: -CW / 2, y: -CH / 2 - 0.45, class: 'cd-slotno' }, wb.layer('top'));
    const show = () => {
      marks.innerHTML = '';
      for (let i = 0; i < max; i++) { const o = cardAt(i); if (!o) continue; o.visible = i < m; o.data.up = true; wb.update(o, { x: i * sp, y: 0 }, true); }
      lab.textContent = 'A pile of ' + m + ' cards, the ace on top';
    };
    wb.on('restore', () => { if (!K.busy) show(); });
    const set = (v) => { if (K.busy) return; m = Math.max(2, Math.min(max, v)); show(); };
    ctx.button('− one card', () => set(m - 1), 'small');
    ctx.button('+ one card', () => set(m + 1), 'small');
    ctx.button('Deal it', async () => {
      if (K.busy) return;
      K.busy = true;
      show();
      const { steps } = dealSteps(m, rule);
      const q = [];
      for (let i = 0; i < m; i++) q.push(i);
      const pos = (k) => [(k) * sp, 0];
      let j = 0;
      for (const st of steps) {
        if (st.t === 'stay') continue;
        const o = cardAt(st.i);
        if (!o) break;
        if (st.t === 'under') {
          q.push(q.shift());
          await K.glide(o, o.x, -1.4, 110);
          q.forEach((ci, k) => { if (ci !== st.i && cardAt(ci)) K.glide(cardAt(ci), pos(k)[0], 0, 110); });
          await K.glide(o, pos(q.length - 1)[0], 0, 130, 0.5);
        } else {
          q.shift();
          K.toTop([o]);
          await K.glide(o, j * sp, y1, 220, 1);
          j++;
          q.forEach((ci, k) => { if (cardAt(ci)) K.glide(cardAt(ci), pos(k)[0], 0, 120); });
        }
        if (!K.alive) return;
      }
      const li = steps.filter((s) => s.t === 'down').pop().i, lastO = cardAt(li);
      if (lastO) {
        C.s('rect', { x: lastO.x - CW / 2 - 0.1, y: lastO.y - CH / 2 - 0.1, width: CW + 0.2, height: CH + 0.2, rx: 0.24, class: 'cd-hintbox' }, marks);
        ctx.say('With ' + m + ' cards the last one dealt is the **' + short(lastO.data.c) + '** — it was ' + ordinal(li + 1) + ' in the pile.', 'info');
      }
      K.busy = false;
    }, 'primary');
    show();
  }

  /* ---------- the engine ---------- */

  const ABOUT = {
    arrange: 'Drag the cards from the tray into the places on the baize; a card dropped on another swaps with it. Badges at the ends of the lines light up **✓** when a line is right and **✗** when two cards clash (sums show the running total). Cards with a gold edge are fixed. Double-tap a card (or ⇋) to turn it face down.',
    deal: 'The row is the pile, **top card first**. Drag a card onto another place to swap the two. When you think the order is right, press **Deal**: the pile is gathered face down and dealt by the rule, card by card, and must come out in the order shown on the table. Work backwards!',
    piles: 'You are the magician. A spectator has picked a card; you deal the deck into three piles, face up, and they tell you which pile holds their card. Choose where that pile goes when you gather the piles up — **on top**, **in the middle** or **at the bottom**. After the last round you count down to the place you promised.',
    ask: 'Answer in the panel. The cards on the table are there to experiment with: use the buttons to shuffle, deal or cut, as often as you like.'
  };

  C.engine({
    id: 'cards',
    name: 'Cards on the baize',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    workbench: { snapPx: 14 },
    about: (p) => ABOUT[(p && p.data && p.data.kind) || 'arrange'],

    verify(p) {
      const d = p.data;
      if (!d || !d.kind) return { ok: false, err: 'data.kind is needed' };
      if (d.kind === 'arrange') return verifyArrange(p);
      if (d.kind === 'deal') return verifyDeal(p);
      if (d.kind === 'piles') return verifyPiles(p);
      if (d.kind === 'ask') return verifyAsk(p);
      return { ok: false, err: 'unknown kind ' + d.kind };
    },

    answerKey(p) {
      const d = p.data;
      if (d.kind !== 'ask') return null;
      return d.answer.choice != null ? d.answer.choice : String(d.answer.num);
    },

    generate(rng, level, fam) {
      if (fam && fam.id === 'card-deals') {
        if (level >= 3 && rng() < 0.3) {
          const target = rng.range(1, 27);
          return { title: 'The ' + ordinal(target) + ' Card', text: 'Twenty-seven cards, three piles, three rounds. The spectator only ever tells you which pile holds the card. Make it turn up as the **' + ordinal(target) + '** card from the top.', data: { kind: 'piles', n: 27, rounds: 3, target }, diff: level };
        }
        const d = genDeal(rng, level);
        return { title: 'Deal ' + d.target.map(short).slice(0, 3).join(' ') + '…', text: dealText(d), data: d, diff: level };
      }
      const d = genArrange(rng, level);
      if (!d) return null;
      return { title: arrangeTitle(d), text: arrangeText(d), data: d, diff: level };
    },
    generates: ['card-arrangements', 'card-deals'],

    mount(ctx, p) {
      const K = kit(ctx);
      const kind = p.data.kind;
      if (kind === 'deal') return mountDeal(ctx, p, K);
      if (kind === 'piles') return mountPiles(ctx, p, K);
      if (kind === 'ask') return mountAsk(ctx, p, K);
      return mountArrange(ctx, p, K);
    },

    thumb(p) {
      const d = p.data;
      let s = '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet"><rect x="4" y="4" width="152" height="112" rx="12" fill="#1f5a44"/>';
      if (d.kind === 'arrange') {
        const SPt = d.slots.map(slotXY), b = G.bbox([SPt]);
        const k = Math.min(128 / (b.w + CW + 0.4), 96 / (b.h + CH + 0.4));
        const ox = 80 - (b.cx) * k, oy = 60 - (b.cy) * k;
        const w = CW * k;
        SPt.forEach((q, i) => {
          const code = (d.given || {})[i];
          const x = ox + q[0] * k, y = oy + q[1] * k;
          s += code ? miniCard(x, y, code, true, w) : '<rect x="' + (x - w / 2) + '" y="' + (y - w * 0.7) + '" width="' + w + '" height="' + w * 1.4 + '" rx="' + w * 0.1 + '" fill="rgba(0,0,0,.18)" stroke="rgba(255,255,255,.45)" stroke-dasharray="' + w * 0.12 + ' ' + w * 0.08 + '" stroke-width="' + Math.max(0.6, w * 0.03) + '"/>';
        });
      } else if (d.kind === 'deal') {
        const n = d.target.length, show = Math.min(n, 6);
        for (let i = 0; i < 5; i++) s += miniCard(28 + i * 1.2, 44 - i * 1.2, null, false, 26);
        for (let j = 0; j < show; j++) s += miniCard(60 + j * 15, 70, d.target[j], true, 22);
        s += '<path d="M40 76q4 14 16 8" fill="none" stroke="#ffd166" stroke-width="2.5" stroke-linecap="round"/>';
      } else if (d.kind === 'piles') {
        const f = C.rng(p.id + ':t').shuffle(fullPack());
        for (let c = 0; c < 3; c++) for (let k = 0; k < 5; k++) s += miniCard(44 + c * 36, 30 + k * 12, f[c * 5 + k], true, 28, true);
      } else {
        const demo = d.demo || {};
        const list = demo.cards && demo.cards.length ? demo.cards.slice(0, 7) : ['AH', '2S', '3D', '4C', '5H', '6S', '7D'];
        list.forEach((c, i) => { s += miniCard(30 + i * (100 / Math.max(1, list.length - 1)), 60 + (i % 2) * 4 - 2, c, !demo.down, 26); });
      }
      return s + '</svg>';
    }
  });

  function arrangeTitle(d) {
    if (d.rules.some((r) => r.t === 'sum')) return 'Triangle of ' + d.rules[0].total;
    const n = Math.round(Math.sqrt(d.slots.length));
    const diag = d.rules[0].lines.length > 2 * n;
    return (n === 3 ? 'Nine' : 'Sixteen') + ' Courtiers' + (diag ? ', Diagonals Too' : '') + ' (' + C.plural(Object.keys(d.given || {}).length, 'given') + ')';
  }
  function arrangeText(d) {
    if (d.rules.some((r) => r.t === 'sum')) return 'Put the ace to nine of diamonds on the triangle, four cards to a side, so that every side adds up to **' + d.rules[0].total + '**. The ace counts 1. One corner is placed for you.';
    const n = Math.round(Math.sqrt(d.slots.length));
    const diag = d.rules[0].lines.length > 2 * n;
    return 'Fill the square with the ' + (n === 3 ? 'nine' : 'sixteen') + ' court cards so that no row' + (diag ? ', no column and neither long diagonal' : ' and no column') + ' holds two cards of the same suit or two of the same rank. The cards already on the table stay where they are.';
  }
  function dealText(d) {
    const names = d.target.map(short).join(', ');
    let how;
    if (d.rule.spell) how = 'For each card, spell its name — A-C-E, T-W-O, T-H-R-E-E and so on — moving one card from the top of the pile to the bottom for every letter but the last. On the last letter, deal the top card face up.';
    else {
      const u = d.rule.under || 1, und = u === 1 ? 'move the next card from the top to the bottom of the pile' : 'move ' + u + ' cards, one at a time, from the top to the bottom';
      how = d.rule.first === 'under' ? 'First ' + und.replace('the next', 'the top') + ', then deal the next card face up onto the table; repeat until every card is dealt.' : 'Deal the top card face up onto the table, then ' + und + '; repeat until every card is dealt.';
    }
    return 'Hold the ' + d.target.length + ' cards face down as a pile. ' + how + '\n\nArrange the pile so that the cards come out in the order ' + names + '.';
  }

  C.cardsLib = { card, short, longName, solveArrange, analyse, itemsOf, dealSteps, dealt, pileFor, followPos, pileChoices, allChoices, gilbreathAlways, calc, courtSquare, withGivens, triangle, genArrange, genDeal, gridSlots, gridLines, mk, dealText, arrangeText, arrangeTitle, ordinal, SPELL };

  C.css('cards', `
    .cd-felt { stroke: rgba(0,0,0,.35); stroke-width: .08; }
    .cd-f0 { stop-color: #25694f; } .cd-f1 { stop-color: #164534; }
    [data-theme="light"] .cd-f0 { stop-color: #3a8a63; } [data-theme="light"] .cd-f1 { stop-color: #276d4c; }
    .cd-feltedge { fill: none; stroke: rgba(255,255,255,.08); stroke-width: .06; stroke-dasharray: .25 .18; }
    .cd-tray { fill: rgba(0,0,0,.14); stroke: rgba(255,255,255,.12); stroke-width: .05; }
    .cd-guide { stroke: rgba(255,226,160,.32); stroke-width: .12; stroke-linecap: round; }
    .cd-slot rect { fill: rgba(0,0,0,.16); stroke: rgba(255,255,255,.34); stroke-width: .05; stroke-dasharray: .22 .14; }
    .cd-slot.given rect { stroke: rgba(255,209,102,.5); }
    .cd-slot.dealt rect { fill: rgba(0,0,0,.1); stroke: rgba(255,255,255,.2); }
    .cd-slot.pilespot rect { stroke: rgba(255,209,102,.4); }
    .cd-slot text { font: 700 .72px Georgia, serif; fill: rgba(255,255,255,.3); }
    .cd-slotno { font: 600 .42px "Segoe UI", system-ui, sans-serif; fill: rgba(255,255,255,.55); }
    .cd-shadow { fill: rgba(0,0,0,.3); transition: transform .12s; }
    .wb-obj.drag .cd-shadow { transform: translate(.16px, .24px); fill: rgba(0,0,0,.24); }
    .cd-face { fill: #fcfaf4; stroke: rgba(0,0,0,.38); stroke-width: .03; }
    .cd-back { fill: #7c1f2e; stroke: rgba(0,0,0,.45); stroke-width: .03; }
    .cd-backin { stroke: #f0d9a8; stroke-width: .035; }
    .cd-latbg { fill: #8e2638; } .cd-latln { stroke: rgba(240,217,168,.5); stroke-width: .035; fill: none; }
    .cd-medal { fill: #7c1f2e; stroke: #f0d9a8; stroke-width: .045; }
    .cd-medalpip { fill: #f0d9a8; }
    .wb-obj.sel .cd-face, .wb-obj.sel .cd-back { stroke: var(--accent); stroke-width: .08; }
    .cd-given .cd-face { stroke: #c9962b; stroke-width: .07; }
    .cd-r { fill: #cf2f3d; } .cd-k { fill: #1e2233; }
    .cd-idx { font: 700 .5px Georgia, "Times New Roman", serif; }
    .cd-idx.ten { font-size: .42px; letter-spacing: -.03px; }
    .cd-court { font: 700 1.15px Georgia, "Times New Roman", serif; }
    .cd-frame { stroke-width: .03; } .cd-frame.red { fill: #fdebe7; stroke: #cf2f3d; } .cd-frame.blk { fill: #e8ecf6; stroke: #1e2233; }
    .cd-frame2 { fill: none; stroke-width: .02; opacity: .55; }
    .cd-frame2.cd-r { stroke: #cf2f3d; } .cd-frame2.cd-k { stroke: #1e2233; }
    .cd-emblem.gold { fill: #c9962b; }
    .cd-ov, .cd-hintg, .cd-bubble, .cd-spell, .wb-obj.cd-noptr { pointer-events: none; }
    .cd-bdg circle { fill: rgba(0,0,0,.35); stroke: rgba(255,255,255,.35); stroke-width: .05; }
    .cd-bdg text { font: 800 .55px "Segoe UI", system-ui, sans-serif; fill: rgba(255,255,255,.8); }
    .cd-bdg text.num { font-size: .44px; }
    .cd-bdg.ok circle { fill: #2f9e6a; stroke: #bff0d4; } .cd-bdg.ok text { fill: #fff; }
    .cd-bdg.bad circle { fill: #d8443f; stroke: #ffd0cc; } .cd-bdg.bad text { fill: #fff; }
    .cd-mark { fill: none; stroke-width: .12; }
    .cd-mark.bad { stroke: #ff5a52; } .cd-mark.warn { stroke: #ffb057; stroke-dasharray: .3 .2; }
    .cd-link.bad { stroke: #ff5a52; stroke-width: .12; stroke-dasharray: .25 .15; }
    .cd-arc { fill: none; stroke-width: .08; } .cd-arc.ok { stroke: #7be0a8; } .cd-arc.bad { stroke: #ff5a52; }
    .cd-arct { font: 700 .42px "Segoe UI", system-ui, sans-serif; } .cd-arct.ok { fill: #bff0d4; } .cd-arct.bad { fill: #ffd0cc; }
    .cd-hintbox { fill: rgba(255,209,102,.12); stroke: #ffd166; stroke-width: .12; stroke-dasharray: .3 .2; animation: cdpulse 1s ease-in-out infinite; }
    .cd-hinted .cd-face { stroke: #ffd166; stroke-width: .14; }
    @keyframes cdpulse { 50% { opacity: .4; } }
    .cd-shake { animation: cdshake .5s; }
    @keyframes cdshake { 20%, 60% { translate: -.18px 0; } 40%, 80% { translate: .18px 0; } }
    .cd-hop { animation: cdhop .6s ease-out; }
    @keyframes cdhop { 40% { translate: 0 -.7px; } }
    .cd-letter { font: 800 .7px Georgia, serif; fill: rgba(255,255,255,.3); }
    .cd-letter.on { fill: #ffd166; } .cd-letter.now { fill: #fff; font-size: .9px; }
    .cd-pileglow { fill: rgba(255,209,102,0); stroke: none; transition: fill .3s; }
    .cd-pileglow.on { fill: rgba(255,209,102,.14); stroke: rgba(255,209,102,.45); stroke-width: .06; }
    .cd-bubble rect, .cd-bubble path { fill: #fffdf6; stroke: rgba(0,0,0,.3); stroke-width: .04; }
    .cd-bubble text { font: 600 .5px "Segoe UI", system-ui, sans-serif; fill: #23263a; }
    .cd-brace { fill: none; stroke-width: .1; } .cd-brace.ok { stroke: #7be0a8; } .cd-brace.bad { stroke: #ff5a52; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
