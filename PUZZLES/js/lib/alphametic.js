/* The Puzzle Cabinet · js/lib/alphametic.js
 *
 * Cabinet.Alpha: letter sums (alphametics) and skeleton multiplications.
 *
 *   build(d)            the puzzle model from p.data (below)
 *   count(P, opts)      exact solver: { n, first, nodes, aborted } (n counted up to opts.limit)
 *   reason(P, known)    a human-style reasoner for sums: the steps a person would take
 *   hintStep(P, known)  the next letter that logic forces, with the reasoning
 *   make(rng, level)    a brand-new puzzle (endless drawers; the stored ones come from the same maker)
 *
 * p.data:
 *   op:     '+'  rows[0] + rows[1] + … = last row
 *           '-'  rows[0] − rows[1] = rows[2]
 *           '*'  rows[0] × rows[1] = last row; with the partial products in between
 *                (one per digit of rows[1], units first) when rows.length > 3
 *   rows:   strings; a letter stands for a digit (different letters, different digits),
 *           '*' is a hidden digit of its own (stars may repeat), '0'…'9' a digit printed
 *   sol:    the rows written in digits
 *   given:  letters whose digits are printed at the start (e.g. 'EM')
 *   digits: optional: the only digits allowed for letters and stars (e.g. '2357')
 *   lead0:  optional: true allows a number to begin with 0 (never used by default)
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const COLNAME = ['units', 'tens', 'hundreds', 'thousands', 'ten-thousands', 'hundred-thousands', 'millions', 'ten-millions', 'hundred-millions', 'billions'];
  const pc = (m) => { let n = 0; while (m) { m &= m - 1; n++; } return n; };
  const lowBit = (m) => { for (let v = 0; v < 10; v++) if (m >> v & 1) return v; return -1; };
  const digitsOf = (m) => { const out = []; for (let v = 0; v < 10; v++) if (m >> v & 1) out.push(v); return out; };

  /* ---------- the model ---------- */

  function build(d) {
    const rows = d.rows.map((r) => String(r).toUpperCase());
    const letters = [], li = {};
    rows.forEach((r) => { for (const ch of r) if (/[A-Z]/.test(ch) && li[ch] == null) { li[ch] = letters.length; letters.push(ch); } });
    let allow = 1023;
    if (d.digits) { allow = 0; for (const ch of String(d.digits)) allow |= 1 << +ch; }
    const stars = [];            // [row, pos from the right]
    const lead = new Array(letters.length).fill(false);
    const cells = rows.map((r, ri) => {
      const out = [];
      for (let k = r.length - 1, pos = 0; k >= 0; k--, pos++) {
        const ch = r.charAt(k);
        const top = k === 0 && r.length > 1 && !d.lead0;
        if (/[A-Z]/.test(ch)) { out.push({ t: 0, i: li[ch], top }); if (top) lead[li[ch]] = true; }
        else if (ch === '*') { out.push({ t: 1, i: stars.length, top }); stars.push([ri, pos]); }
        else out.push({ t: 2, i: +ch, top });
      }
      return out;
    });
    const allowL = letters.map((L, i) => allow & (lead[i] ? ~1 : 1023));
    const allowS = stars.map(([ri, pos]) => allow & (cells[ri][pos].top ? ~1 : 1023));
    const P = { d, op: d.op, rows, cells, letters, li, stars, lead, allow, allowL, allowS, nL: letters.length, nS: stars.length };
    if (d.op === '+') { P.terms = cells.slice(0, -1); P.res = cells[cells.length - 1]; P.termRows = rows.map((r, i) => i).slice(0, -1); P.resRow = rows.length - 1; }
    else if (d.op === '-') { P.terms = [cells[1], cells[2]]; P.res = cells[0]; P.termRows = [1, 2]; P.resRow = 0; }
    if (d.op === '*') {
      P.A = cells[0]; P.B = cells[1]; P.R = cells[cells.length - 1];
      P.parts = rows.length > 3 ? cells.slice(2, -1) : null;
    }
    P.given = {};
    if (d.given && d.sol) {
      const m = solMap(P, d.sol);
      for (const ch of String(d.given)) if (P.li[ch] != null && m) P.given[P.li[ch]] = m.L[P.li[ch]];
    }
    P.sol = d.sol ? solMap(P, d.sol) : null;
    return P;
  }

  // the stored solution as digits per letter and per star (null if it does not match the rows)
  function solMap(P, sol) {
    if (!Array.isArray(sol) || sol.length !== P.rows.length) return null;
    const L = new Array(P.nL).fill(-1), S = new Array(P.nS).fill(-1);
    for (let r = 0; r < P.rows.length; r++) {
      const s = String(sol[r]);
      if (s.length !== P.rows[r].length || !/^[0-9]+$/.test(s)) return null;
      for (let k = 0; k < s.length; k++) {
        const cell = P.cells[r][s.length - 1 - k], v = +s.charAt(k);
        if (cell.t === 0) { if (L[cell.i] >= 0 && L[cell.i] !== v) return null; L[cell.i] = v; }
        else if (cell.t === 1) S[cell.i] = v;
        else if (cell.i !== v) return null;
      }
    }
    return { L, S };
  }

  // the rows written out with the digits of an assignment ('?' for unknown)
  function rowsWith(P, L, S) {
    return P.cells.map((cs) => cs.map((c) => {
      const v = c.t === 0 ? L[c.i] : c.t === 1 ? (S ? S[c.i] : -1) : c.i;
      return v >= 0 ? String(v) : '?';
    }).reverse().join(''));
  }

  function shapeErr(d) {
    if (!d || !Array.isArray(d.rows) || d.rows.length < 3) return 'rows are needed (at least three)';
    if (!['+', '-', '*'].includes(d.op)) return 'op must be + - or *';
    for (const r of d.rows) if (!/^[A-Z0-9*]+$/.test(String(r))) return 'bad row ' + r;
    const P = build(d);
    if (P.nL > 10) return 'more than ten letters';
    const len = d.rows.map((r) => String(r).length);
    if (d.op === '+') { if (Math.max.apply(null, len.slice(0, -1)) > len[len.length - 1]) return 'a term is longer than the total'; }
    if (d.op === '-') { if (d.rows.length !== 3) return 'a subtraction has three rows'; if (len[1] > len[0] || len[2] > len[0]) return 'the result is longer than the top number'; }
    if (d.op === '*') {
      if (d.rows.length !== 3 && d.rows.length !== 3 + len[1]) return 'a multiplication has three rows, or one partial product per digit of the multiplier';
      if (len[1] === 1 && d.rows.length !== 3) return 'a one-digit multiplier has no partial products';
    }
    if (!d.sol) return 'sol is needed';
    if (!P.sol) return 'sol does not fit the rows';
    return null;
  }

  // does a complete assignment work? (letters different, allowed digits, no leading zeros, the arithmetic right)
  function checkFull(P, L, S) {
    const used = {};
    for (let i = 0; i < P.nL; i++) {
      const v = L[i];
      if (!(v >= 0 && v <= 9)) return 'letter ' + P.letters[i] + ' has no digit';
      if (used[v] != null) return 'two letters are ' + v;
      used[v] = i;
      if (!(P.allowL[i] >> v & 1)) return P.lead[i] && v === 0 ? 'a number begins with 0' : 'digit ' + v + ' is not allowed';
    }
    for (let i = 0; i < P.nS; i++) { const v = S[i]; if (!(v >= 0 && v <= 9)) return 'a star has no digit'; if (!(P.allowS[i] >> v & 1)) return 'a star digit is not allowed'; }
    const nums = rowsWith(P, L, S).map(Number);
    if (P.op === '+') { const s = nums.slice(0, -1).reduce((a, b) => a + b, 0); return s === nums[nums.length - 1] ? null : 'the sum does not work'; }
    if (P.op === '-') return nums[0] - nums[1] === nums[2] ? null : 'the subtraction does not work';
    const A = nums[0], B = nums[1];
    if (A * B !== nums[nums.length - 1]) return 'the product does not work';
    if (P.parts) {
      const bs = rowsWith(P, L, S)[1];
      for (let j = 0; j < P.parts.length; j++) if (A * +bs.charAt(bs.length - 1 - j) !== nums[2 + j]) return 'a partial product does not work';
    }
    return null;
  }

  /* ---------- the exact solver ----------
   * opts: { limit: 2, nodeLimit: 3e6, fixL: [digit|-1 per letter], fixS: [...] }
   * Sums go column by column from the units with the carry; products assign the
   * digits of both factors from the right and check the low digits of every
   * partial product and of the result as soon as they are known. */

  function count(P, opts) {
    opts = opts || {};
    const limit = opts.limit || 2, nodeLimit = opts.nodeLimit || 3e6;
    const val = new Int8Array(P.nL).fill(-1), star = new Int8Array(P.nS).fill(-1);
    let used = 0, n = 0, nodes = 0, stop = false, aborted = false, first = null;
    const pre = (arr, target, isL) => {
      if (!arr) return true;
      for (let i = 0; i < arr.length; i++) {
        const v = arr[i];
        if (v == null || v < 0) continue;
        if (isL) { if (used >> v & 1 || !(P.allowL[i] >> v & 1)) return false; target[i] = v; used |= 1 << v; }
        else { if (!(P.allowS[i] >> v & 1)) return false; target[i] = v; }
      }
      return true;
    };
    const fixL = opts.fixL || null;
    const gv = new Array(P.nL).fill(-1);
    for (const k in P.given) gv[k] = P.given[k];
    if (fixL) fixL.forEach((v, i) => { if (v != null && v >= 0) gv[i] = v; });
    if (!pre(gv, val, true) || !pre(opts.fixS, star, false)) return { n: 0, first: null, nodes: 0, aborted: false };
    const found = () => {
      n++;
      if (opts.onFound) opts.onFound(val, star);
      if (!first) first = { L: Array.from(val), S: Array.from(star) };
      if (n >= limit) stop = true;
    };
    const upto = opts.upto != null ? opts.upto : -1;
    const tick = () => { if (++nodes > nodeLimit) { stop = true; aborted = true; } };

    // try to put digit v in a cell; returns 0 fail, 1 fine (nothing to undo), 2 assigned letter, 3 assigned star
    function put(c, v) {
      if (c.t === 2) return c.i === v ? 1 : 0;
      if (c.t === 0) {
        const L = c.i;
        if (val[L] >= 0) return val[L] === v ? 1 : 0;
        if (!(P.allowL[L] >> v & 1) || (used >> v & 1)) return 0;
        val[L] = v; used |= 1 << v;
        return 2;
      }
      if (star[c.i] >= 0) return star[c.i] === v ? 1 : 0;
      if (!(P.allowS[c.i] >> v & 1)) return 0;
      star[c.i] = v;
      return 3;
    }
    function unput(c, how) {
      if (how === 2) { used &= ~(1 << val[c.i]); val[c.i] = -1; }
      else if (how === 3) star[c.i] = -1;
    }

    if (P.op === '+' || P.op === '-') {
      const T = P.terms, R = P.res, W = R.length;
      const colT = [];
      for (let c = 0; c < W; c++) colT.push(T.filter((t) => t.length > c).map((t) => t[c]));
      const go = (c, k, s) => {
        if (stop) return;
        tick();
        if (c === W) { if (s === 0) found(); return; }
        if (upto >= 0 && c === upto + 1 && k === 0) { found(); return; }
        const cells = colT[c];
        if (k < cells.length) {
          const cl = cells[k];
          if (cl.t === 2) { go(c, k + 1, s + cl.i); return; }
          const cur = cl.t === 0 ? val[cl.i] : star[cl.i];
          if (cur >= 0) { go(c, k + 1, s + cur); return; }
          for (let v = 0; v < 10 && !stop; v++) {
            const how = put(cl, v);
            if (!how) continue;
            go(c, k + 1, s + v);
            unput(cl, how);
          }
          return;
        }
        const r = s % 10, carry = (s - r) / 10;
        const how = put(R[c], r);
        if (!how) return;
        go(c + 1, 0, carry);
        unput(R[c], how);
      };
      go(0, 0, 0);
    } else {
      const A = P.A, B = P.B, R = P.R, parts = P.parts, m = A.length, nb = B.length, K = Math.max(m, nb);
      const bd = new Int8Array(nb);
      const pow = [1];
      for (let i = 1; i < 20; i++) pow.push(pow[i - 1] * 10);
      const digitAt = (x, k) => Math.floor(x / pow[k]) % 10;
      const checkCells = (cells, x, from, to, undo) => {
        // digits from..to-1 of x must fit cells; beyond the row the digit must be 0
        for (let k = from; k < to; k++) {
          const v = digitAt(x, k);
          if (k >= cells.length) { if (v !== 0) return false; continue; }
          const how = put(cells[k], v);
          if (!how) return false;
          if (how > 1) undo.push([cells[k], how]);
        }
        return true;
      };
      const final = (Av, Bv) => {
        const undo = [];
        let ok = true;
        if (parts) {
          for (let j = 0; j < nb && ok; j++) {
            const x = Av * bd[j];
            if (x >= pow[parts[j].length]) ok = false;
            else ok = checkCells(parts[j], x, K, parts[j].length, undo);
          }
        }
        if (ok) { const x = Av * Bv; ok = x < pow[R.length] && checkCells(R, x, K, R.length, undo); }
        if (ok) found();
        for (let u = undo.length - 1; u >= 0; u--) unput(undo[u][0], undo[u][1]);
      };
      const check = (k, Av, Bv) => {
        tick();
        const undo = [];
        let ok = true;
        if (parts) for (let j = 0; j <= Math.min(k, nb - 1) && ok; j++) ok = checkCells(parts[j], Av * bd[j], k, k + 1, undo);
        if (ok) ok = checkCells(R, Av * Bv, k, k + 1, undo);
        // a factor with a digit j already known also fixes partial products' digits below k (done as k grew)
        if (ok) { if (k === upto) found(); else if (k + 1 < K) stepA(k + 1, Av, Bv); else final(Av, Bv); }
        for (let u = undo.length - 1; u >= 0; u--) unput(undo[u][0], undo[u][1]);
      };
      const stepB = (k, Av, Bv) => {
        if (stop) return;
        if (k >= nb) { check(k, Av, Bv); return; }
        const cl = B[k];
        const cur = cl.t === 2 ? cl.i : cl.t === 0 ? val[cl.i] : star[cl.i];
        const catchUp = (v) => {
          // a new multiplier digit: its partial product's digits 0..k-1 are now known too
          bd[k] = v;
          if (!parts) { check(k, Av, Bv + v * pow[k]); return; }
          const undo = [];
          if (checkCells(parts[k], Av * v, 0, k, undo)) check(k, Av, Bv + v * pow[k]);
          for (let u = undo.length - 1; u >= 0; u--) unput(undo[u][0], undo[u][1]);
        };
        if (cur >= 0) { catchUp(cur); return; }
        for (let v = 0; v < 10 && !stop; v++) {
          const how = put(cl, v);
          if (!how) continue;
          catchUp(v);
          unput(cl, how);
        }
      };
      const stepA = (k, Av, Bv) => {
        if (stop) return;
        if (k >= m) { stepB(k, Av, Bv); return; }
        const cl = A[k];
        const cur = cl.t === 2 ? cl.i : cl.t === 0 ? val[cl.i] : star[cl.i];
        if (cur >= 0) { stepB(k, Av + cur * pow[k], Bv); return; }
        for (let v = 0; v < 10 && !stop; v++) {
          const how = put(cl, v);
          if (!how) continue;
          stepB(k, Av + v * pow[k], Bv);
          unput(cl, how);
        }
      };
      stepA(0, 0, 0);
    }
    return { n, first, nodes, aborted };
  }

  /* ---------- reasoning like a person (sums and differences) ----------
   * A difference A − B = C is read as the addition B + C = A (the way a
   * subtraction is checked). The state holds, for every letter, the digits it
   * may still be, and for every column the carries that may still come into it.
   * Steps, easiest first:
   *   lead    the front digit of a total longer than every term is a carry
   *   single  a letter known: no other letter may have its digit
   *   column  try every digit still open in one column (the column's arithmetic)
   *   hidden  ten letters use all ten digits: a digit only one letter can take
   *   pair    two letters share the same two digits between them
   *   trial   suppose a value and watch the sum break (a short what-if)
   */

  function sumModel(P) {
    if (P._sm) return P._sm;
    const T = P.terms, R = P.res, W = R.length, cols = [];
    for (let c = 0; c < W; c++) {
      const cells = T.filter((t) => t.length > c).map((t) => t[c]);
      const tl = [], mult = [];
      let k0 = 0;
      cells.forEach((cl) => {
        if (cl.t === 2) { k0 += cl.i; return; }
        const at = tl.indexOf(cl.i);
        if (at < 0) { tl.push(cl.i); mult.push(1); } else mult[at]++;
      });
      cols.push({ c, cells, tl, mult, k0, res: R[c], nTerms: cells.length });
    }
    const maxC = [0];
    for (let c = 0; c < W; c++) maxC.push(Math.floor((cols[c].nTerms * 9 + maxC[c]) / 10));
    const longest = Math.max.apply(null, T.map((t) => t.length));
    return (P._sm = { W, cols, maxC, longest, nTerms: T.length });
  }

  function newState(P, known) {
    const M = sumModel(P);
    const dom = new Int16Array(P.nL), car = new Int16Array(M.W + 1);
    for (let i = 0; i < P.nL; i++) dom[i] = P.allowL[i];
    for (const k in P.given) dom[k] = 1 << P.given[k];
    if (known) known.forEach((v, i) => { if (v != null && v >= 0) dom[i] = 1 << v; });
    car[0] = 1;
    for (let c = 1; c < M.W; c++) { let m = 0; for (let v = 0; v <= M.maxC[c]; v++) m |= 1 << v; car[c] = m; }
    car[M.W] = 1;
    return { dom, car, steps: [], fail: null, trials: 0, depth: 0 };
  }
  const cloneState = (S) => ({ dom: Int16Array.from(S.dom), car: Int16Array.from(S.car), steps: [], fail: null, trials: 0, depth: S.depth });

  // one column: every combination still open; returns the narrowed masks or a contradiction
  function colSupport(P, S, col) {
    const tl = col.tl, mult = col.mult, n = tl.length, res = col.res;
    const nd = new Int16Array(n);
    let nRes = 0, nCin = 0, nCout = 0;
    const cinD = S.car[col.c], coutD = S.car[col.c + 1];
    const resL = res.t === 0 ? res.i : -1, resIn = resL >= 0 ? tl.indexOf(resL) : -1;
    const vals = new Int8Array(n);
    let usedM = 0;
    const rec = (i, s) => {
      if (i === n) {
        for (let cin = 0; cin < 10; cin++) {
          if (!(cinD >> cin & 1)) continue;
          const t = s + cin, r = t % 10, co = (t - r) / 10;
          if (!(coutD >> co & 1)) continue;
          if (res.t === 2) { if (res.i !== r) continue; }
          else if (resIn >= 0) { if (vals[resIn] !== r) continue; }
          else if (!(S.dom[resL] >> r & 1) || (usedM >> r & 1)) continue;
          for (let k = 0; k < n; k++) nd[k] |= 1 << vals[k];
          nRes |= 1 << r; nCin |= 1 << cin; nCout |= 1 << co;
        }
        return;
      }
      const dm = S.dom[tl[i]];
      for (let v = 0; v < 10; v++) {
        if (!(dm >> v & 1) || (usedM >> v & 1)) continue;
        vals[i] = v; usedM |= 1 << v;
        rec(i + 1, s + v * mult[i]);
        usedM &= ~(1 << v);
      }
    };
    rec(0, col.k0);
    return { nd, nRes, nCin, nCout, resL, resIn };
  }

  // apply one column; returns a change list (empty if nothing new), or null on a contradiction
  function applyColumn(P, S, col) {
    const sp = colSupport(P, S, col);
    const ch = [];
    const set = (kind, i, before, after) => { if (before !== after) ch.push({ kind, i, before, after }); };
    for (let k = 0; k < col.tl.length; k++) set('L', col.tl[k], S.dom[col.tl[k]], S.dom[col.tl[k]] & sp.nd[k]);
    if (sp.resL >= 0 && sp.resIn < 0) set('L', sp.resL, S.dom[sp.resL], S.dom[sp.resL] & sp.nRes);
    set('C', col.c, S.car[col.c], S.car[col.c] & sp.nCin);
    set('C', col.c + 1, S.car[col.c + 1], S.car[col.c + 1] & sp.nCout);
    if (ch.some((x) => x.after === 0) || (!sp.nCin && !sp.nCout)) return null;
    ch.forEach((x) => { if (x.kind === 'L') S.dom[x.i] = x.after; else S.car[x.i] = x.after; });
    return ch;
  }

  // the next step from state S (it is applied); null when stuck; S.fail set on a contradiction
  function nextStep(P, S, noTrial, deep) {
    const M = sumModel(P), nL = P.nL;
    // single: a known letter's digit is nobody else's
    for (let i = 0; i < nL; i++) {
      if (pc(S.dom[i]) !== 1) continue;
      const b = S.dom[i], hit = [];
      for (let j = 0; j < nL; j++) if (j !== i && (S.dom[j] & b)) hit.push(j);
      if (!hit.length) continue;
      const ch = hit.map((j) => ({ kind: 'L', i: j, before: S.dom[j], after: S.dom[j] & ~b }));
      ch.forEach((x) => { S.dom[x.i] = x.after; });
      if (ch.some((x) => !x.after)) { S.fail = { kind: 'single', i, v: lowBit(b) }; return null; }
      return { kind: 'single', i, v: lowBit(b), ch };
    }
    // columns: the one with the fewest open combinations first (so the reasoning reads naturally)
    const order = M.cols.map((col) => {
      let w = 1;
      col.tl.forEach((L) => { w *= pc(S.dom[L]); });
      if (col.res.t === 0 && col.tl.indexOf(col.res.i) < 0) w *= pc(S.dom[col.res.i]);
      return { col, w: w * pc(S.car[col.c]) };
    }).sort((a, b) => a.w - b.w || b.col.c - a.col.c);
    for (const o of order) {
      const snap = { dom: Int16Array.from(S.dom), car: Int16Array.from(S.car) };
      const ch = applyColumn(P, S, o.col);
      if (ch === null) { S.dom = snap.dom; S.car = snap.car; S.fail = { kind: 'column', c: o.col.c }; return null; }
      if (ch.length) {
        const top = o.col.c === M.W - 1 && o.col.nTerms === 0;
        return { kind: top ? 'lead' : 'column', c: o.col.c, ch };
      }
    }
    // hidden: all ten digits are used by ten letters
    if (nL === 10) {
      for (let v = 0; v < 10; v++) {
        const who = [];
        for (let i = 0; i < nL; i++) if (S.dom[i] >> v & 1) who.push(i);
        if (!who.length) { S.fail = { kind: 'hidden', v }; return null; }
        if (who.length === 1 && pc(S.dom[who[0]]) > 1) {
          const i = who[0], before = S.dom[i];
          S.dom[i] = 1 << v;
          return { kind: 'hidden', v, i, ch: [{ kind: 'L', i, before, after: 1 << v }] };
        }
      }
    }
    // pair: two letters with the same two digits
    for (let i = 0; i < nL; i++) {
      if (pc(S.dom[i]) !== 2) continue;
      for (let j = i + 1; j < nL; j++) {
        if (S.dom[j] !== S.dom[i]) continue;
        const b = S.dom[i], ch = [];
        for (let k = 0; k < nL; k++) if (k !== i && k !== j && (S.dom[k] & b)) ch.push({ kind: 'L', i: k, before: S.dom[k], after: S.dom[k] & ~b });
        if (!ch.length) continue;
        ch.forEach((x) => { S.dom[x.i] = x.after; });
        if (ch.some((x) => !x.after)) { S.fail = { kind: 'pair', i, j }; return null; }
        return { kind: 'pair', i, j, ch };
      }
    }
    if (noTrial) return null;
    // trial: a letter with the fewest options; each value that leads to a contradiction goes
    const cand = [];
    for (let i = 0; i < nL; i++) if (pc(S.dom[i]) > 1) cand.push(i);
    cand.sort((a, b) => pc(S.dom[a]) - pc(S.dom[b]) || a - b);
    for (const i of cand) {
      const outs = [];
      let keep = 0;
      for (const v of digitsOf(S.dom[i])) {
        const T = cloneState(S);
        T.dom[i] = 1 << v;
        const why = propagate(P, T, true, 60);
        if (T.fail) outs.push({ v, fail: T.fail, why });
        else keep |= 1 << v;
      }
      if (outs.length && keep) {
        const before = S.dom[i];
        S.dom[i] = keep;
        S.trials++;
        return { kind: 'trial', i, outs, ch: [{ kind: 'L', i, before, after: keep }] };
      }
      if (!keep) { S.fail = { kind: 'trial', i }; return null; }
    }
    // a what-if about a carry: does this column carry or not?
    for (let c = 1; c < S.car.length - 1; c++) {
      if (pc(S.car[c]) < 2) continue;
      const outs = [];
      let keep = 0;
      for (const v of digitsOf(S.car[c])) {
        const T = cloneState(S);
        T.car[c] = 1 << v;
        const why = propagate(P, T, true, 60);
        if (T.fail) outs.push({ v, fail: T.fail, why });
        else keep |= 1 << v;
      }
      if (outs.length && keep) {
        const before = S.car[c];
        S.car[c] = keep;
        S.trials++;
        return { kind: 'ctrial', c, outs, ch: [{ kind: 'C', i: c, before, after: keep }] };
      }
    }
    if (!deep) return null;
    // a longer what-if: suppose a value and reason on, what-ifs included
    for (const i of cand) {
      if (pc(S.dom[i]) > 6) continue;
      const outs = [];
      let keep = 0;
      for (const v of digitsOf(S.dom[i])) {
        const T = cloneState(S);
        T.dom[i] = 1 << v;
        const why = propagate(P, T, false, 150, false);
        if (T.fail) outs.push({ v, fail: T.fail, why });
        else keep |= 1 << v;
      }
      if (outs.length && keep) {
        const before = S.dom[i];
        S.dom[i] = keep;
        S.trials += 2;
        return { kind: 'trial2', i, outs, ch: [{ kind: 'L', i, before, after: keep }] };
      }
    }
    return null;
  }

  function propagate(P, S, noTrial, maxSteps, deep) {
    const out = [];
    for (let k = 0; k < (maxSteps || 400); k++) {
      if (P.nL && S.dom.every((m) => pc(m) === 1) && fixedCarries(P, S)) {
        // everything is settled: every column must still add up
        const M = sumModel(P);
        for (const col of M.cols) {
          const sp = colSupport(P, S, col);
          if (!sp.nCin || sp.nd.some((m) => !m)) { S.fail = { kind: 'column', c: col.c }; break; }
        }
        break;
      }
      const st = nextStep(P, S, noTrial, deep);
      if (!st) break;
      out.push(st);
    }
    return out;
  }
  function fixedCarries(P, S) { for (let c = 0; c < S.car.length; c++) if (pc(S.car[c]) !== 1) return false; return true; }

  // reason from the givens (and letters already known) to the end, if logic gets there
  function reason(P, known) {
    if (!(P.op === '+' || P.op === '-') || P.nS) return null;
    const S = newState(P, known);
    const steps = propagate(P, S, false, 600, true);
    const solved = !S.fail && Array.from(S.dom).every((m) => pc(m) === 1);
    const counts = {};
    steps.forEach((s) => { counts[s.kind] = (counts[s.kind] || 0) + 1; });
    return { S, steps, solved, counts };
  }

  /* ---------- words for the reasons ---------- */

  function colName(c) { return COLNAME[c] || ('column ' + (c + 1) + ' from the right'); }
  function listOr(a) { return a.length <= 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]; }
  function listAnd(a) { return a.length <= 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  // the column as a little equation: "N + R + carry ends in E"
  function colEq(P, S, col) {
    const parts = col.cells.map((cl) => cl.t === 2 ? String(cl.i) : P.letters[cl.i]);
    if (S0cin(S, col) !== 1) parts.push('carry');
    const lhs = parts.length ? parts.join(' + ') : 'the carry';
    const r = col.res.t === 2 ? String(col.res.i) : P.letters[col.res.i];
    return lhs + (S.car[col.c + 1] === 1 ? ' = ' : ' ends in ') + r;
  }
  function S0cin(S, col) { return S.car[col.c]; }

  function domWords(P, x) {
    const L = P.letters[x.i], ds = digitsOf(x.after);
    if (ds.length === 1) return '**' + L + ' = ' + ds[0] + '**';
    return L + ' is ' + listOr(ds);
  }
  function carryWords(P, x, W) {
    const ds = digitsOf(x.after);
    if (x.i === 0 || x.i === W) return '';
    const into = colName(x.i);
    if (ds.length === 1) return ds[0] ? 'the ' + colName(x.i - 1) + ' column carries ' + ds[0] + ' into the ' + into : 'nothing carries into the ' + into + ' column';
    return '';
  }

  // one step in words; S is the state *before* the step (for the equation)
  function sayStep(P, st, before) {
    const M = sumModel(P);
    const Ls = st.ch.filter((x) => x.kind === 'L'), Cs = st.ch.filter((x) => x.kind === 'C');
    if (st.kind === 'single') {
      const got = Ls.filter((x) => pc(x.after) === 1);
      return P.letters[st.i] + ' is ' + st.v + ', so no other letter can be ' + st.v + '.' +
        (got.length ? ' That leaves ' + listAnd(got.map((x) => '**' + P.letters[x.i] + ' = ' + lowBit(x.after) + '**')) + '.' : '');
    }
    if (st.kind === 'lead') {
      const col = M.cols[st.c], r = P.letters[col.res.i] || String(col.res.i), k = M.nTerms, L = M.longest;
      const lim = NUMW[k] ? cap(NUMW[k]) : String(k);
      const big = '1' + '0'.repeat(L);
      const x = Ls.find((q) => q.i === col.res.i);
      const v = x ? digitsOf(x.after) : [];
      return 'The total is longer than every number in the sum, so its first digit ' + r + ' can only be a carry. ' + lim + ' numbers below ' + fmtBig(big) + ' add up to less than ' + fmtBig(String(k) + '0'.repeat(L)) +
        ', so ' + (v.length === 1 ? '**' + r + ' = ' + v[0] + '**' : r + ' is at most ' + (k - 1)) + ' (and a number cannot begin with 0).';
    }
    if (st.kind === 'column') {
      const col = M.cols[st.c];
      const eq = colEq(P, before, col);
      let pre = '';
      const resL = col.res.t === 0 ? col.res.i : -1, at = resL >= 0 ? col.tl.indexOf(resL) : -1;
      if (at >= 0 && col.mult[at] === 1 && col.tl.length > 1) {
        // the classic: a letter added to others comes back out, so the rest make a round ten
        const rest = [];
        col.cells.forEach((cl) => { if (!(cl.t === 0 && cl.i === resL)) rest.push(cl.t === 2 ? String(cl.i) : P.letters[cl.i]); });
        if (before.car[col.c] !== 1) rest.push('carry');
        const most = (col.nTerms - 1) * 9 + sumModel(P).maxC[col.c];
        pre = ' ' + P.letters[resL] + ' comes out as it went in, so ' + rest.join(' + ') + ' must make ' + (most >= 20 ? 'a round 0, 10 or 20' : '0 or 10') + '.';
      }
      const known = [];
      col.tl.concat(resL >= 0 && at < 0 ? [resL] : []).forEach((L) => {
        if (pc(before.dom[L]) === 1 && !Ls.some((x) => x.i === L)) known.push(P.letters[L] + ' = ' + lowBit(before.dom[L]));
      });
      // name what was learned: fixed letters always, narrowed ones only when few digits are left
      let got = Ls.filter((x) => pc(x.after) === 1 || pc(x.after) <= 3).map((x) => domWords(P, x));
      if (!got.length && Ls.length) got = [Ls.map((x) => P.letters[x.i]).join(', ') + ' lose' + (Ls.length === 1 ? 's' : '') + ' some digits'];
      const cw = Cs.map((x) => carryWords(P, x, M.W)).filter(Boolean);
      let t = '**' + cap(colName(st.c)) + ' column:** ' + eq + '.' + pre;
      if (known.length) t += ' With ' + listAnd(known) + ' known,';
      t += known.length ? ' the digits still open only fit if ' : ' Trying the digits still open, ';
      if (!got.length) t += cw.length ? listAnd(cw) + '.' : 'the carries are settled.';
      else t += listAnd(got) + (cw.length ? ' (and ' + listAnd(cw) + ')' : '') + '.';
      return t;
    }
    if (st.kind === 'hidden') return 'All ten digits are used, and ' + st.v + ' can only be ' + P.letters[st.i] + ' now: **' + P.letters[st.i] + ' = ' + st.v + '**.';
    if (st.kind === 'pair') {
      const ds = digitsOf(before.dom[st.i]);
      return P.letters[st.i] + ' and ' + P.letters[st.j] + ' are ' + ds[0] + ' and ' + ds[1] + ' in some order, so no other letter can be either.';
    }
    if (st.kind === 'ctrial') {
      const into = colName(st.c), from = colName(st.c - 1);
      const bits = st.outs.slice(0, 2).map((o) => {
        const chain = [];
        (o.why || []).forEach((q) => q.ch.forEach((x) => { if (x.kind === 'L' && pc(x.after) === 1 && chain.length < 3) chain.push(P.letters[x.i] + ' = ' + lowBit(x.after)); }));
        return 'if the ' + from + ' column carried ' + o.v + ' into the ' + into + (chain.length ? ', then ' + listAnd(chain) + ' and' : ',') + ' ' + failWords(P, o.fail);
      });
      const left = digitsOf(st.ch[0].after);
      return 'Ask whether the ' + from + ' column carries: ' + bits.join('; ') + '. So ' + (left.length === 1 ? 'it carries **' + left[0] + '**' : 'it carries ' + listOr(left)) + '.';
    }
    if (st.kind === 'trial' || st.kind === 'trial2') {
      const L = P.letters[st.i];
      if (st.kind === 'trial2') {
        const left = digitsOf(st.ch[0].after);
        return 'This needs a longer what-if. Suppose ' + L + ' were ' + listOr(st.outs.map((o) => o.v)) + ': reason on from there (what-ifs included) and every one of them ends with ' + failWords(P, st.outs[0].fail) + '. So ' +
          (left.length === 1 ? '**' + L + ' = ' + left[0] + '**' : L + ' is ' + listOr(left)) + '.';
      }
      const bits = st.outs.slice(0, 3).map((o) => {
        // the letters the supposition fixes on the way to the clash
        const chain = [];
        (o.why || []).forEach((q) => q.ch.forEach((x) => { if (x.kind === 'L' && x.i !== st.i && pc(x.after) === 1 && chain.length < 3) chain.push(P.letters[x.i] + ' = ' + lowBit(x.after)); }));
        return 'if ' + L + ' were ' + o.v + (chain.length ? ', then ' + listAnd(chain) + ' and' : ',') + ' ' + failWords(P, o.fail);
      });
      const left = digitsOf(st.ch[0].after);
      return 'Try the possibilities: ' + bits.join('; ') + (st.outs.length > 3 ? '; and so on' : '') + '. So ' + (left.length === 1 ? '**' + L + ' = ' + left[0] + '**' : L + ' is ' + listOr(left)) + '.';
    }
    return '';
  }
  function failWords(P, f) {
    if (!f) return 'the sum would break';
    if (f.kind === 'column') return 'the ' + colName(f.c) + ' column could not add up';
    if (f.kind === 'single' || f.kind === 'pair' || f.kind === 'hidden') return 'two letters would need the same digit';
    return 'the sum would break further on';
  }
  function fmtBig(s) {
    // 20000 → 20 000
    return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s;
  }

  // the next letter that logic forces from here, with the reasons (null if none)
  function hintStep(P, known) {
    if (!(P.op === '+' || P.op === '-') || P.nS) return null;
    const S = newState(P, known);
    const isKnown = (i) => (known && known[i] >= 0) || P.given[i] != null;
    const log = [];
    for (let k = 0; k < 600; k++) {
      const before = { dom: Int16Array.from(S.dom), car: Int16Array.from(S.car) };
      const st = nextStep(P, S, false, true);
      if (!st) return S.fail ? { fail: S.fail } : null;
      st.text = sayStep(P, st, before);
      log.push(st);
      const fixed = st.ch.find((x) => x.kind === 'L' && pc(x.after) === 1 && !isKnown(x.i));
      if (fixed) {
        // the reasons: this step, and the latest earlier steps that narrowed letters of the same column
        const col = st.c != null ? sumModel(P).cols[st.c] : null;
        const rel = new Set(col ? col.tl.concat(col.res.t === 0 ? [col.res.i] : []) : [fixed.i]);
        const earlier = log.slice(0, -1).filter((q) => q.kind !== 'single' && !(q.kind === st.kind && q.c === st.c) &&
          q.ch.some((x) => x.kind === 'L' && rel.has(x.i) && pc(x.after) <= 3)).slice(-2);
        return { i: fixed.i, v: lowBit(fixed.after), step: st, earlier, cols: col ? [col.c] : [], all: log };
      }
    }
    return null;
  }

  /* ---------- windows: what the last few digits alone force ----------
   * Only the last k+1 digits of the factors decide the last k+1 digits of every
   * partial product and of the answer (and in a sum, the last k+1 columns work
   * on their own). Try every way of filling that window; a cell that comes out
   * the same in all of them is forced. */

  function windowHint(P, fixL, fixS, knownL, knownS) {
    const K = P.op === '*' ? Math.max(P.A.length, P.B.length) : P.res.length - 1;
    const isK = (arr, i) => arr && arr[i] != null && arr[i] >= 0;
    for (let k = 0; k < K; k++) {
      const seenL = new Int16Array(P.nL), seenS = new Int16Array(P.nS);
      const unsetL = new Uint8Array(P.nL), unsetS = new Uint8Array(P.nS);
      let n = 0;
      const r = count(P, {
        limit: 20000, nodeLimit: 4e5, upto: k, fixL, fixS,
        onFound(val, star) {
          n++;
          for (let i = 0; i < P.nL; i++) { if (val[i] >= 0) seenL[i] |= 1 << val[i]; else unsetL[i] = 1; }
          for (let i = 0; i < P.nS; i++) { if (star[i] >= 0) seenS[i] |= 1 << star[i]; else unsetS[i] = 1; }
        }
      });
      if (r.aborted || r.n >= 20000) break;
      if (!n) return { fail: true };
      const forced = [];
      for (let i = 0; i < P.nL; i++) if (!unsetL[i] && pc(seenL[i]) === 1 && !isK(knownL, i) && P.given[i] == null) forced.push({ kind: 'L', i, v: lowBit(seenL[i]) });
      for (let i = 0; i < P.nS; i++) if (!unsetS[i] && pc(seenS[i]) === 1 && !isK(knownS, i)) forced.push({ kind: 'S', i, v: lowBit(seenS[i]) });
      if (forced.length) return { k, n, forced };
    }
    return null;
  }

  // the rows of a product that plain arithmetic now fills: both factors known
  function arithHint(P, L, S) {
    if (P.op !== '*') return null;
    const digit = (c) => c.t === 2 ? c.i : c.t === 0 ? L[c.i] : S[c.i];
    const rowVal = (cells) => { let x = 0; for (let k = cells.length - 1; k >= 0; k--) { const v = digit(cells[k]); if (!(v >= 0)) return null; x = x * 10 + v; } return x; };
    const Av = rowVal(P.A), Bv = rowVal(P.B);
    if (Av == null || Bv == null) return null;
    const bs = String(Bv);
    const rows = [];
    if (P.parts) P.parts.forEach((cells, j) => rows.push({ r: 2 + j, cells, x: Av * +bs.charAt(bs.length - 1 - j), how: Av + ' × ' + bs.charAt(bs.length - 1 - j) }));
    rows.push({ r: P.rows.length - 1, cells: P.R, x: Av * Bv, how: Av + ' × ' + Bv });
    for (const q of rows) {
      const s = String(q.x);
      if (s.length !== q.cells.length) return null;
      for (let k = 0; k < q.cells.length; k++) {
        const c = q.cells[k], v = +s.charAt(s.length - 1 - k);
        if (digit(c) >= 0) continue;
        return { row: q.r, pos: k, cell: c, v, text: 'Both numbers being multiplied are known now, so the rest is plain arithmetic: ' + q.how + ' = ' + s + '.' };
      }
    }
    return null;
  }

  /* ---------- words (our own lists, by theme) ---------- */

  const THEMES = {
    farm: { name: 'On the farm', words: 'COW PIG HEN RAM EWE GOAT LAMB DUCK MULE CALF COLT FOAL MARE BULL BARN HAY OATS CORN FARM CART PLOUGH SHEEP HORSE GOOSE CHICK FIELD CROPS WHEAT GRAIN TRACTOR DONKEY PONY FEED HERD FLOCK EGGS MILK SEED SOW PEN STY BARLEY STABLE MEADOW' },
    wild: { name: 'In the wild', words: 'LION TIGER BEAR WOLF FOX DEER ELK MOOSE BISON ZEBRA RHINO HIPPO CAMEL LLAMA OTTER BEAVER BADGER RABBIT HARE MOUSE RAT MOLE BAT OWL HAWK EAGLE RAVEN ROBIN CROW DOVE SWAN FROG TOAD SNAKE LIZARD MONKEY APE GORILLA PANDA KOALA HYENA JACKAL LEOPARD PUMA LYNX SEAL WALRUS WHALE SHARK TROUT SALMON EEL CRAB' },
    food: { name: 'In the kitchen', words: 'PIE JAM TEA EGG HAM BUN RICE CAKE MILK SOUP FISH MEAT BEEF CORN PEAR PLUM LIME SALT BREAD HONEY LEMON MANGO MELON APPLE GRAPE PEACH OLIVE PASTA PIZZA SALAD SUGAR TOAST BACON CREAM BUTTER CHEESE COFFEE COOKIE MUFFIN PEPPER CARROT TOMATO POTATO ORANGE BANANA CHERRY WAFFLE DINNER LUNCH SUPPER FEAST MEAL SAUCE GRAVY ONION BEANS PEAS' },
    music: { name: 'Music', words: 'SING SONG TUNE NOTE BAND DRUM HORN HARP LUTE BASS ALTO SOLO DUET TRIO PIANO FLUTE VIOLA CELLO OPERA WALTZ TEMPO CHORD MUSIC BANJO ORGAN TANGO RONDO MINUET SONATA GUITAR FIDDLE VIOLIN TUBA OBOE CHOIR HYMN CAROL BALLAD METRE RHYTHM MELODY SCORE STAVE LYRE BUGLE' },
    space: { name: 'The night sky', words: 'SUN MOON STAR MARS VENUS EARTH COMET ORBIT SPACE ROCKET PLANET SATURN URANUS NEPTUNE PLUTO JUPITER MERCURY GALAXY NOVA ALIEN LUNAR SOLAR METEOR ASTEROID COSMOS NEBULA ECLIPSE CRATER LAUNCH TITAN EUROPA' },
    sport: { name: 'Sports day', words: 'GOLF POLO SWIM RACE GAME BALL GOAL TEAM WINS WIN PLAY KICK SCORE MATCH RUGBY TENNIS HOCKEY SOCCER CHESS DARTS BOXING ROWING SKI SKATE SPRINT RELAY MEDAL CUP PRIZE BAT NET RUN JUMP DIVE LAP PASS SHOT' },
    weather: { name: 'The weather', words: 'RAIN SNOW HAIL WIND FOG MIST SUN STORM CLOUD FROST SLEET THUNDER BREEZE GALE HEAT COLD WARM DRY WET DAMP SUNNY RAINY WINDY CLOUDY FOGGY FLOOD DROUGHT SHOWER DRIZZLE' },
    home: { name: 'Home sweet home', words: 'BED DOOR ROOM HALL SOFA LAMP RUG DESK SINK OVEN ROOF WALL STAIR ATTIC CHAIR TABLE HOUSE HOME GATE PORCH YARD SHED TAP BATH BENCH STOOL SHELF CLOCK MIRROR CARPET CURTAIN PILLOW BLANKET KETTLE' },
    garden: { name: 'In the garden', words: 'TREE LEAF ROSE LILY OAK ELM ASH FERN MOSS SEED ROOT BUD PINE PALM IVY POND HEDGE DAISY TULIP IRIS POPPY VIOLET ORCHID LAWN RAKE HOE SPADE WEED SOIL BLOOM PETAL STEM THORN HERB MINT SAGE BASIL THYME' },
    colour: { name: 'Colours', words: 'RED TAN BLUE GOLD GREY PINK ROSE NAVY TEAL JADE LIME RUBY GREEN BLACK WHITE AMBER CORAL OLIVE IVORY BROWN CREAM SILVER ORANGE PURPLE YELLOW CYAN MAUVE LILAC PLUM BEIGE SCARLET CRIMSON INDIGO' },
    magic: { name: 'Magic', words: 'HOCUS POCUS PRESTO MAGIC SPELL WAND TRICK CARD HAT CAPE WITCH WIZARD CHARM POTION CAULDRON BROOM RABBIT DOVE ACE KING QUEEN SHOW STAGE CURTAIN MYSTIC OMEN RUNE GHOST' },
    time: { name: 'Time', words: 'DAY WEEK YEAR HOUR TIME CLOCK DAWN DUSK NOON NIGHT MONTH SPRING SUMMER AUTUMN WINTER MONDAY FRIDAY SUNDAY TODAY LATE EARLY SOON NOW THEN AGE ERA DATE MINUTE SECOND' },
    money: { name: 'Money', words: 'CASH COIN BANK LOAN RENT DEBT SAVE SPEND PRICE MONEY WEALTH GOLD SILVER PENNY CENT DIME POUND EURO DOLLAR TAX FEE PAY WAGE COST SALE DEAL PROFIT PURSE SAFE VAULT RICH POOR BUY SELL' },
    sea: { name: 'By the sea', words: 'SEA SAND SHIP BOAT SAIL WAVE TIDE SHORE BEACH COAST OCEAN ISLAND HARBOUR ANCHOR MAST DECK HULL OAR REEF SHELL PEARL CORAL CRAB FISH SEAL GULL CREW DOCK PORT BAY CAPE CLIFF SURF SWIM DIVE' },
    family: { name: 'Family', words: 'MOM DAD SON AUNT UNCLE NIECE BABY TWIN SISTER BROTHER MOTHER FATHER COUSIN NEPHEW KIN CLAN HOME LOVE HUGS KISS BRIDE GROOM WEDDING GRANNY' },
    school: { name: 'At school', words: 'READ WRITE SUMS MATHS BOOK PEN INK DESK CHALK CLASS TEACH LEARN TEST EXAM GRADE PUPIL RULER PAPER NOTES LESSON SCHOOL STUDY QUIZ ESSAY ATLAS GLOBE ART MUSIC' },
    body: { name: 'Head to toe', words: 'HEAD HAIR EYE EAR NOSE LIP CHIN NECK ARM HAND PALM FIST LEG KNEE FOOT TOE HEEL HIP BACK SKIN BONE HEART LUNG BRAIN THUMB WRIST ELBOW ANKLE MOUTH TEETH TONGUE' },
    town: { name: 'About town', words: 'TOWN CITY ROAD LANE PARK SHOP MALL BANK CAFE INN HOTEL CHURCH SCHOOL STREET SQUARE MARKET TRAIN TRAM BUS TAXI CAR BIKE BRIDGE TOWER STATION CORNER CROSS ROADS DANGER STOP SIGN MAP' }
  };
  const NUMWORDS = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN', 'TWENTY'];
  const TENS = { 30: 'THIRTY', 40: 'FORTY', 50: 'FIFTY', 60: 'SIXTY', 70: 'SEVENTY', 80: 'EIGHTY', 90: 'NINETY', 100: 'HUNDRED' };
  function numberWord(n) { return n <= 20 ? NUMWORDS[n] : TENS[n] || null; }
  const themeWords = {};
  for (const k in THEMES) themeWords[k] = Array.from(new Set(THEMES[k].words.split(/\s+/).filter(Boolean)));
  const ALLWORDS = Array.from(new Set([].concat.apply([], Object.keys(themeWords).map((k) => themeWords[k]))));

  function letterSet(words) { const s = new Set(); words.forEach((w) => { for (const ch of w) s.add(ch); }); return s; }

  /* ---------- grading ----------
   * The reasoner's path decides: how many columns had to be worked, how many
   * what-ifs were needed, whether it got stuck; the exact solver's effort breaks ties. */

  function grade(P, opts) {
    if (P.op === '*') return gradeMul(P);
    let r;
    if (opts && opts.fast) {
      // quick look first: without the long what-ifs; stuck means Fiendish anyway
      const S = newState(P);
      const steps = propagate(P, S, false, 600, false);
      const solved = !S.fail && Array.from(S.dom).every((m) => pc(m) === 1);
      if (!solved) return { level: 5, score: 99, counts: {}, nodes: 0, solved: false };
      const counts = {};
      steps.forEach((s) => { counts[s.kind] = (counts[s.kind] || 0) + 1; });
      r = { solved, counts };
    } else r = reason(P);
    const c = r ? r.counts : {};
    const nodes = count(P, { limit: 2 }).nodes;
    let score = (c.column || 0) + 0.5 * (c.lead || 0) + 3 * (c.pair || 0) + 3 * (c.hidden || 0) + 7 * (c.trial || 0) + 6 * (c.ctrial || 0) + 16 * (c.trial2 || 0);
    if (!r || !r.solved) score += 60;
    score += Math.log10(1 + nodes) * 2;
    let lv = score < 16 ? 1 : score < 24 ? 2 : score < 36 ? 3 : score < 60 ? 4 : 5;
    return { level: lv, score: Math.round(score * 10) / 10, counts: c, nodes, solved: !!(r && r.solved) };
  }
  // products: play the puzzle the way the hints would — plain arithmetic is free,
  // a window of the last k+1 digits costs more the wider it is, and a step that
  // needs the whole puzzle at once costs most
  function gradeMul(P) {
    const res = count(P, { limit: 2 });
    const sol = P.sol || (res.first ? { L: res.first.L, S: res.first.S } : null);
    const kL = new Array(P.nL).fill(-1), kS = new Array(P.nS).fill(-1);
    for (const k in P.given) kL[k] = P.given[k];
    let score = 0, wide = 0, whole = 0;
    const left = () => kL.some((v) => v < 0) || kS.some((v) => v < 0);
    for (let it = 0; it < 80 && left() && sol; it++) {
      const ar = arithHint(P, kL, kS);
      if (ar) { if (ar.cell.t === 0) kL[ar.cell.i] = ar.v; else if (ar.cell.t === 1) kS[ar.cell.i] = ar.v; score += 0.3; continue; }
      const w = windowHint(P, kL, kS, kL, kS);
      if (w && w.forced) {
        w.forced.forEach((f) => { if (f.kind === 'L') kL[f.i] = f.v; else kS[f.i] = f.v; });
        score += 1 + 1.6 * w.k + Math.log10(1 + w.n);
        wide = Math.max(wide, w.k);
        continue;
      }
      const i = kL.findIndex((v) => v < 0);
      if (i >= 0) kL[i] = sol.L[i]; else { const j = kS.findIndex((v) => v < 0); kS[j] = sol.S[j]; }
      score += 7;
      whole++;
    }
    score += Math.log10(1 + res.nodes) * 1.5;
    const lv = score < 10 ? 1 : score < 16 ? 2 : score < 24 ? 3 : score < 34 ? 4 : 5;
    return { level: lv, score: Math.round(score * 10) / 10, nodes: res.nodes, whole, wide };
  }

  /* ---------- making puzzles ---------- */

  // show letters one at a time (the most telling first) until there is one answer
  function addGivens(d, rng, want) {
    const P0 = build(Object.assign({}, d, { given: '' }));
    const sol = P0.sol;
    let given = '';
    for (let round = 0; round < 10; round++) {
      const P = build(Object.assign({}, d, { given }));
      const r = count(P, { limit: 30, nodeLimit: 2e5 });
      if (r.aborted) return null;
      if (r.n === 1 && given.length >= (want || 0)) return given;
      // pick the letter that cuts the answers most (ties broken at random)
      let best = null, bestN = 1e9;
      const order = rng.shuffle(P.letters.slice());
      for (const ch of order) {
        if (given.indexOf(ch) >= 0) continue;
        const Q = build(Object.assign({}, d, { given: given + ch }));
        const n = count(Q, { limit: 30, nodeLimit: 2e5 }).n;
        if (n >= 1 && n < bestN) { bestN = n; best = ch; if (n === 1) break; }
      }
      if (!best) return null;
      given += best;
      if (!sol) return null;
    }
    return null;
  }

  // a sum from a theme: terms from the theme, the total from the theme (or any word, if allowed)
  function sumCandidates(rng, terms, pool) {
    const L = Math.max.apply(null, terms.map((w) => w.length));
    const base = letterSet(terms);
    return pool.filter((w) => (w.length === L || w.length === L + 1) && terms.indexOf(w) < 0 && (() => {
      const s = new Set(base);
      for (const ch of w) s.add(ch);
      return s.size <= 10;
    })());
  }

  function solveRows(op, rows, extra) {
    const d = Object.assign({ op, rows }, extra || {});
    const P = build(d);
    const r = count(P, { limit: 5, nodeLimit: 3e5 });
    return { P, r };
  }

  // one random letter sum at about this level; null if the attempt found nothing
  function makeSum(rng, level, opts) {
    opts = opts || {};
    const keys = Object.keys(THEMES);
    const theme = opts.theme || rng.pick(keys);
    const words = themeWords[theme];
    const t0 = Date.now(), budget = opts.budget || 700;
    for (let tries = 0; tries < 40 && Date.now() - t0 < budget; tries++) {
      const k = level >= 4 && rng() < 0.35 ? 3 : 2;
      const terms = [];
      for (let i = 0; i < k; i++) terms.push(rng.pick(words.filter((w) => w.length >= (level <= 1 ? 3 : 4) && w.length <= (level <= 2 ? 5 : 7))));
      if (new Set(terms).size < 2) continue;
      if (letterSet(terms).size > 10) continue;
      const pool = rng.shuffle(sumCandidates(rng, terms, words).concat(rng() < 0.4 ? sumCandidates(rng, terms, ALLWORDS).slice(0, 40) : []));
      for (const res of pool.slice(0, 30)) {
        const rows = terms.concat([res]);
        const { P, r } = solveRows('+', rows);
        if (r.aborted || !r.n) continue;
        const sol = rowsWith(P, r.first.L, r.first.S);
        let d = { op: '+', rows, sol };
        if (r.n > 1) {
          if (level >= 4 || r.n > 4) continue;
          const g = addGivens(d, rng, 0);
          if (!g) continue;
          d.given = g;
          const c1 = count(build(d), { limit: 2 });
          if (c1.n !== 1) continue;
          d.sol = rowsWith(build(d), c1.first.L, c1.first.S);
        }
        const gr = grade(build(d), { fast: level <= 3 });
        if (gr.level === level) return { d, grade: level <= 3 ? gr : gr, theme };
        if (gr.level > level && level <= 3) {
          // too hard: show a letter or two
          const g2 = easeTo(d, rng, level);
          if (g2) return Object.assign(g2, { theme });
        }
      }
    }
    return null;
  }

  // reveal letters until the puzzle grades at the level wanted (or give up)
  function easeTo(d, rng, level) {
    const P = build(d);
    let given = d.given || '';
    const most = level <= 1 ? Math.ceil(P.nL / 2) : level === 2 ? Math.max(2, Math.floor(P.nL * 0.4)) : Math.max(2, Math.floor(P.nL / 3));
    const order = rng.shuffle(P.letters.filter((ch) => given.indexOf(ch) < 0));
    // letters that sit in many columns tell the most: try those first
    const weight = {};
    P.rows.forEach((r) => { for (const ch of r) weight[ch] = (weight[ch] || 0) + 1; });
    order.sort((a, b) => weight[b] - weight[a]);
    for (const ch of order) {
      if (given.length >= most) break;
      const g2 = given + ch;
      const d2 = Object.assign({}, d, { given: g2 });
      const gr = grade(build(d2), { fast: true });
      if (gr.level === level) return { d: d2, grade: gr };
      if (gr.level < level) continue;   // too much help: try another letter instead
      given = g2;
    }
    return null;
  }

  // a long multiplication in letters: the ten digits written with the letters of a key word
  const KEYWORDS = ['BLACKSMITH', 'PATHFINDER', 'LUMBERJACK', 'DUMBWAITER', 'TRAMPOLINE', 'BIRTHPLACE', 'CLOTHESPIN', 'COMPLAINTS', 'FLAMINGOES', 'HYDRAULICS', 'MOTHERLAND', 'NIGHTMARES', 'PLAYGROUND', 'REPUBLICAN', 'BANKRUPTCY', 'PRODUCTIVE', 'CAMPGROUND', 'COPYRIGHTS', 'BLOCKHEADS', 'FORMULATED', 'GUNPOWDERS', 'SPORTINGLY'];
  function codeRows(nums, key) {
    return nums.map((x) => String(x).split('').map((ch) => key.charAt(+ch)).join(''));
  }
  function mulRows(A, B, parts) {
    const rows = [A, B];
    const bs = String(B);
    if (parts && bs.length > 1) for (let j = 0; j < bs.length; j++) rows.push(A * +bs.charAt(bs.length - 1 - j));
    rows.push(A * B);
    return rows;
  }

  function makeMul(rng, level, opts) {
    opts = opts || {};
    const stars = opts.stars != null ? opts.stars : rng() < 0.5;
    const t0 = Date.now(), budget = opts.budget || 700;
    // [digits on top, digits in the multiplier, partial products shown]
    const sizes = stars ? [null, [[2, 2, 1], [3, 1, 0]], [[2, 2, 1], [3, 2, 1]], [[3, 2, 1], [2, 2, 1]], [[3, 2, 1], [4, 2, 1], [3, 3, 1]], [[3, 3, 1], [4, 2, 1], [4, 3, 1]]][level]
      : opts.needKey ? [null, [[3, 2, 1], [4, 2, 1]], [[3, 2, 1], [4, 2, 1], [3, 3, 1]], [[3, 2, 1], [3, 3, 1], [4, 3, 1]], [[3, 3, 1], [4, 3, 1]], [[4, 3, 1], [3, 3, 1]]][level]
        : [null, [[3, 2, 1], [4, 2, 1], [3, 3, 1]], [[3, 2, 1], [4, 2, 1], [2, 2, 0], [3, 1, 0]], [[2, 2, 0], [3, 1, 0], [3, 2, 1], [3, 3, 1]], [[2, 2, 0], [3, 1, 0], [3, 2, 0]], [[2, 2, 0], [3, 2, 0], [3, 1, 0]]][level];
    for (let tries = 0; tries < 40 && Date.now() - t0 < budget; tries++) {
      const sz = rng.pick(sizes);
      const lo = (n) => Math.pow(10, n - 1), hi = (n) => Math.pow(10, n) - 1;
      const A = rng.range(lo(sz[0]), hi(sz[0])), B = rng.range(Math.max(2, lo(sz[1])), hi(sz[1]));
      if (String(B).indexOf('0') >= 0 || B === 1) continue;
      const nums = mulRows(A, B, sz[1] > 1 && sz[2]);
      // a key word needs all ten digits somewhere in the multiplication
      const allTen = new Set(nums.join('')).size === 10;
      if (!stars && opts.needKey && !allTen) continue;
      let d;
      if (stars) {
        // everything hidden but a few digits, chosen until the answer is unique
        const rows = nums.map((x) => String(x).replace(/[0-9]/g, '*'));
        d = { op: '*', rows, sol: nums.map(String) };
        const out = revealStars(d, rng, level);
        if (!out) continue;
        d = out;
      } else {
        const key = rng.pick(KEYWORDS);
        const rows = codeRows(nums, key);
        d = { op: '*', rows, sol: nums.map(String) };
        if (allTen) d.key = key;
        const P = build(d);
        const r = count(P, { limit: 2, nodeLimit: 8e5 });
        if (r.aborted || r.n !== 1) {
          if (r.aborted || level >= 5) continue;
          const g = addGivens(d, rng, 0);
          if (!g) continue;
          d.given = g;
          if (count(build(d), { limit: 2 }).n !== 1) continue;
        }
      }
      const gr = grade(build(d));
      if (Math.abs(gr.level - level) <= (opts.loose ? 1 : 0)) return { d, grade: gr };
    }
    return null;
  }

  // star rows: show digits (spread out, at random) until only one multiplication fits, then drop any that are not needed
  function revealStars(d, rng, level) {
    const rows = d.rows.map((r) => r.split('')), sol = d.sol;
    const cells = [];
    rows.forEach((r, i) => r.forEach((ch, k) => cells.push([i, k])));
    rng.shuffle(cells);
    const make = () => ({ op: '*', rows: rows.map((r) => r.join('')), sol });
    const nOf = (dd) => count(build(dd), { limit: 2, nodeLimit: 6e5 });
    let k = 0;
    for (; k < cells.length; k++) {
      const r = nOf(make());
      if (r.aborted) return null;
      if (r.n === 1) break;
      const [i, j] = cells[k];
      rows[i][j] = sol[i].charAt(j);
    }
    // prune: take shown digits away again if the answer stays unique
    for (let q = k - 1; q >= 0; q--) {
      const [i, j] = cells[q];
      rows[i][j] = '*';
      const r = nOf(make());
      if (r.aborted || r.n !== 1) rows[i][j] = sol[i].charAt(j);
    }
    // a skeleton should be mostly stars: give up if too much must show
    const total = cells.length;
    let shown = 0;
    rows.forEach((r) => r.forEach((ch) => { if (ch !== '*') shown++; }));
    if (shown > total * 0.45 || total - shown < 5) return null;
    // easier levels show a few more (still leaving most of it hidden)
    const extra = Math.min([0, 2, 1, 1, 0, 0][level] || 0, Math.floor(total * 0.45) - shown);
    let added = 0;
    for (const [i, j] of cells) {
      if (added >= extra) break;
      if (rows[i][j] === '*') { rows[i][j] = sol[i].charAt(j); added++; }
    }
    const out = make();
    return nOf(out).n === 1 ? out : null;
  }

  /* ---------- exports (more below) ---------- */
  const Alpha = C.Alpha = C.Alpha || {};
  Object.assign(Alpha, { windowHint, arithHint, THEMES, themeWords, ALLWORDS, NUMWORDS, numberWord, KEYWORDS, grade, addGivens, makeSum, makeMul, revealStars, codeRows, mulRows, easeTo, letterSet });
  Object.assign(Alpha, { build, solMap, rowsWith, shapeErr, checkFull, count, COLNAME, pc, lowBit, digitsOf,
    sumModel, newState, nextStep, propagate, reason, hintStep, sayStep, colName, listAnd, listOr, fmtBig });
})(typeof window !== 'undefined' ? window : globalThis);
