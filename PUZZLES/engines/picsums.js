/* The Puzzle Cabinet · engines/picsums.js
 *
 * Picture sums: little pictures stand for whole numbers — the same picture,
 * the same number — and lines, grids or balance scales give their totals.
 * Enter a value under each picture in the key: every line, row or scale
 * checks itself as you go (a scale even tips when your values are wrong).
 * Many end with a last line to work out, and the later ones hide a trap in
 * it: a bunch with fewer bananas, half an apple, a cat wearing the hat, or a
 * multiplication that must be done before the addition.
 *
 * data: {
 *   kind: 'lines' | 'grid' | 'balance',
 *   pics: ['apple', 'banana', …]      the unknowns (picture ids from js/lib/picart.js)
 *   sol: [10, 4, …]                   their values (whole numbers > 0)
 *   lines: [{ t: [term, op, term, …], r: 30 }]            (lines)
 *   grid: [[0, 1, 2], …], rs: [sum | null], cs: [sum | null]   (grid: row and column totals; null = not shown)
 *   bal: [{ l: [term…], r: [term…] }]                     (balance: each scale balances)
 *   ask: { t: [...] } | { row: i } | { col: j } | { l: [term…] }   the last line (optional)
 *   ans: 19                            its value
 * }
 * terms: k (picture k) · { k, n } (picture k showing n parts instead of the usual number) ·
 *        { k, hat: j } (picture k wearing picture j) · { v: 7 } (a number) ·
 *        { u: 3 } (three marbles, worth 1 each) · { w: 10 } (a weight of 10 marbles)
 * ops: '+', '-', '*'
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const ART = () => C.picArt;

  /* =====================================================================
   * numbers: values of terms, lines as equations
   * ===================================================================== */

  const isPic = (t) => typeof t === 'number' || (t && t.k != null);
  const kOf = (t) => (typeof t === 'number' ? t : t.k);
  function mainOf(d, k) { const a = ART(); return (a && a.info[d.pics[k]] && a.info[d.pics[k]].main) || 1; }

  // the value of a term with the values x (null if a value is missing)
  function termVal(d, t, x) {
    if (typeof t === 'number') return x[t] == null ? null : x[t];
    if (t.v != null) return t.v;
    if (t.u != null) return t.u;
    if (t.w != null) return t.w;
    const v = x[t.k];
    if (v == null) return null;
    let out = t.n != null ? v * t.n / mainOf(d, t.k) : v;
    if (t.hat != null) { if (x[t.hat] == null) return null; out += x[t.hat]; }
    return out;
  }
  // an expression [term, op, term, …] with × before + and −
  function evalExpr(d, e, x, leftToRight) {
    const vals = [], ops = [];
    for (let i = 0; i < e.length; i += 2) { const v = termVal(d, e[i], x); if (v == null) return null; vals.push(v); if (i + 1 < e.length) ops.push(e[i + 1]); }
    if (leftToRight) { let acc = vals[0]; ops.forEach((o, i) => { acc = o === '*' ? acc * vals[i + 1] : o === '+' ? acc + vals[i + 1] : acc - vals[i + 1]; }); return acc; }
    const sums = [vals[0]], sg = [1];
    ops.forEach((o, i) => { if (o === '*') sums[sums.length - 1] *= vals[i + 1]; else { sums.push(vals[i + 1]); sg.push(o === '-' ? -1 : 1); } });
    return sums.reduce((a, v, i) => a + sg[i] * v, 0);
  }
  const panVal = (d, items, x) => { let s = 0; for (const t of items) { const v = termVal(d, t, x); if (v == null) return null; s += v; } return s; };

  // a linear expression: { c: [coef per picture], k: constant } (null if two pictures are multiplied)
  function linear(d, e) {
    const n = d.pics.length;
    const out = { c: new Array(n).fill(0), k: 0 };
    let prod = null, sign = 1;
    const flush = () => { if (!prod) return; if (prod.pic == null) out.k += sign * prod.f; else out.c[prod.pic] += sign * prod.f; };
    for (let i = 0; i < e.length; i += 2) {
      const t = e[i], op = i ? e[i - 1] : '+';
      let f = 1, pic = null;
      if (isPic(t)) { if (typeof t !== 'number' && (t.n != null || t.hat != null)) return null; pic = kOf(t); } else f = t.v != null ? t.v : t.u != null ? t.u : t.w;
      if (op === '*') {
        if (pic != null && prod.pic != null) return null;
        prod = { f: prod.f * f, pic: pic != null ? pic : prod.pic };
      } else { flush(); sign = op === '-' ? -1 : 1; prod = { f, pic }; }
    }
    flush();
    return out;
  }
  function panLinear(d, items) {
    const out = { c: new Array(d.pics.length).fill(0), k: 0 };
    for (const t of items) {
      if (isPic(t)) { if (typeof t !== 'number' && (t.n != null || t.hat != null)) return null; out.c[kOf(t)]++; } else out.k += termVal(d, t, []);
    }
    return out;
  }

  // every equation the puzzle gives: { c, r, name, ref }
  function equations(d) {
    const out = [];
    if (d.kind === 'lines') {
      d.lines.forEach((L, i) => { const q = linear(d, L.t); if (q) out.push({ c: q.c, r: L.r - q.k, name: 'line ' + (i + 1), ref: i }); });
    } else if (d.kind === 'grid') {
      const n = d.pics.length;
      d.grid.forEach((row, i) => { if (d.rs[i] == null) return; const c = new Array(n).fill(0); row.forEach((k) => c[k]++); out.push({ c, r: d.rs[i], name: 'row ' + (i + 1), ref: 'r' + i }); });
      d.cs.forEach((s, j) => { if (s == null) return; const c = new Array(n).fill(0); d.grid.forEach((row) => c[row[j]]++); out.push({ c, r: s, name: 'column ' + (j + 1), ref: 'c' + j }); });
    } else {
      d.bal.forEach((B, i) => {
        const a = panLinear(d, B.l), b = panLinear(d, B.r);
        if (!a || !b) return;
        out.push({ c: a.c.map((v, k) => v - b.c[k]), r: b.k - a.k, name: 'scale ' + (i + 1), ref: i });
      });
    }
    return out;
  }

  // the last line's value
  function askVal(d, x, leftToRight) {
    const a = d.ask;
    if (!a) return null;
    if (a.t) return evalExpr(d, a.t, x, leftToRight);
    if (a.row != null) return d.grid[a.row].reduce((s, k) => s + x[k], 0);
    if (a.col != null) return d.grid.reduce((s, row) => s + x[row[a.col]], 0);
    if (a.l) return panVal(d, a.l, x);
    return null;
  }
  // what the last line would be if its pictures were the usual ones (the trap)
  function naiveVal(d, x) {
    const a = d.ask;
    if (!a || !(a.t || a.l)) return null;
    const plain = (t) => (t && t.k != null ? t.k : t);
    return a.t ? evalExpr(d, a.t.map((t, i) => (i % 2 ? t : plain(t))), x) : panVal(d, a.l.map(plain), x);
  }
  function askTraps(d) {
    const a = d.ask, out = { parts: false, hat: false, order: false };
    if (!a) return out;
    const terms = a.t ? a.t.filter((t, i) => i % 2 === 0) : a.l || [];
    terms.forEach((t) => { if (t && t.n != null) out.parts = true; if (t && t.hat != null) out.hat = true; });
    if (a.t) {
      const ops = a.t.filter((t, i) => i % 2 === 1);
      out.order = ops.includes('*') && ops.some((o) => o !== '*') && evalExpr(d, a.t, d.sol) !== evalExpr(d, a.t, d.sol, true);
    }
    return out;
  }

  /* =====================================================================
   * solving step by step (the hints, the grade, and the proof of uniqueness)
   * ===================================================================== */

  // the equation with the known values moved to the right-hand side
  function reduce(q, known, x) {
    const c = q.c.slice();
    let r = q.r;
    c.forEach((v, k) => { if (v && known[k]) { r -= v * x[k]; c[k] = 0; } });
    return { c, r };
  }
  const nz = (c) => { const out = []; c.forEach((v, k) => { if (v) out.push(k); }); return out; };

  // the easiest next step from the known values: one equation, then two combined, then three
  function nextStep(eqs, known, x) {
    const R = eqs.map((q) => reduce(q, known, x));
    const single = (cmb, uses, mult, kind) => {
      const z = nz(cmb.c);
      if (z.length !== 1) return null;
      const t = z[0];
      if (known[t]) return null;
      return { kind, uses, mult, t, coef: cmb.c[t], rhs: cmb.r, val: cmb.r / cmb.c[t] };
    };
    for (let i = 0; i < R.length; i++) { const s = single(R[i], [i], [1], 1); if (s) return s; }
    const comb = (list, mult) => {
      const c = new Array(eqs[0].c.length).fill(0);
      let r = 0;
      list.forEach((i, m) => { R[i].c.forEach((v, k) => { c[k] += mult[m] * v; }); r += mult[m] * R[i].r; });
      return { c, r };
    };
    let best = null;
    const M2 = [1, 2, 3, 4];
    for (let a = 0; a < R.length; a++) for (let b = 0; b < R.length; b++) {
      if (a === b) continue;
      for (const al of M2) for (const be of [-1, -2, -3, -4, 1, 2, 3, 4]) {
        if (be > 0 && b < a) continue;
        const s = single(comb([a, b], [al, be]), [a, b], [al, be], 2);
        if (s && (!best || al + Math.abs(be) < best.mult[0] + Math.abs(best.mult[1]))) best = s;
      }
    }
    if (best) return best;
    const M3 = [1, -1, 2, -2];
    for (let a = 0; a < R.length; a++) for (let b = a + 1; b < R.length; b++) for (let c = b + 1; c < R.length; c++) {
      for (const x1 of [1, 2]) for (const x2 of M3) for (const x3 of M3) {
        const s = single(comb([a, b, c], [x1, x2, x3]), [a, b, c], [x1, x2, x3], 3);
        if (s && (!best || x1 + Math.abs(x2) + Math.abs(x3) < best.mult.reduce((p, v) => p + Math.abs(v), 0))) best = s;
      }
    }
    return best;
  }

  // the whole road from nothing known to everything known (null if it gets stuck)
  function solvePath(d) {
    const eqs = equations(d), n = d.pics.length, x = d.sol;
    const known = new Array(n).fill(false);
    const path = [];
    if (!eqs.length) return null;
    for (let guard = 0; guard < n + 2 && known.some((v) => !v); guard++) {
      const s = nextStep(eqs, known, x);
      if (!s) return null;
      if (Math.abs(s.val - x[s.t]) > 1e-9) return null;
      s.known = known.slice();
      path.push(s);
      known[s.t] = true;
    }
    return known.every(Boolean) ? { path, eqs, maxKind: Math.max(...path.map((s) => s.kind)) } : null;
  }

  function levelOf(d, sp) {
    sp = sp || solvePath(d);
    if (!sp) return 0;
    const n = d.pics.length;
    const tr = askTraps(d);
    let lv = n <= 2 ? 1 : n === 3 ? 2 : n === 4 ? 3 : 4;
    lv += sp.maxKind - 1;
    if (tr.parts || tr.hat) lv += 1;
    if (d.kind === 'grid' && d.grid.length * d.grid[0].length >= 16) lv += 0;
    return Math.max(1, Math.min(5, lv));
  }

  /* =====================================================================
   * words (with the pictures drawn in the text)
   * ===================================================================== */

  const OPS = { '+': ' + ', '-': ' − ', '*': ' × ' };
  const icon = (d, k, n, hat) => (ART() ? ART().inline(d.pics[k], n, hat ? { hat: true } : null) : d.pics[k]);
  function termHTML(d, t) {
    if (typeof t === 'number') return icon(d, t);
    if (t.v != null) return String(t.v);
    if (t.u != null) return t.u + ' ' + (t.u === 1 ? 'marble' : 'marbles');
    if (t.w != null) return 'a weight of ' + t.w;
    return icon(d, t.k, t.n != null ? t.n : undefined, t.hat != null);
  }
  const exprHTML = (d, e) => e.map((t, i) => (i % 2 ? OPS[t] : termHTML(d, t))).join('');
  // c · pictures = r, written with pictures: "2 × 🍌 + 🍇 = 17"
  function combHTML(d, c, r) {
    // an equation whose pictures all count negative reads better turned round
    if (c.every((v) => v <= 0) || (r < 0 && c.some((v) => v < 0))) { c = c.map((v) => -v); r = -r; }
    const parts = [];
    const many = c.filter((v) => v).length > 1;
    c.forEach((v, k) => {
      if (!v) return;
      const a = Math.abs(v);
      const body = a === 1 ? icon(d, k) : a <= 3 && !many ? new Array(a).fill(icon(d, k)).join(' + ') : a + ' × ' + icon(d, k);
      parts.push({ neg: v < 0, s: body });
    });
    parts.sort((p, q) => p.neg - q.neg);
    let s = '';
    parts.forEach((p, i) => { s += i ? (p.neg ? ' − ' : ' + ') + p.s : (p.neg ? '−' : '') + p.s; });
    return s + ' = ' + r;
  }
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const TIMES = { 1: '', 2: 'twice ', 3: 'three times ', 4: 'four times ' };
  function combName(eqs, uses, mult) {
    let s = '';
    uses.forEach((i, m) => {
      const a = Math.abs(mult[m]);
      const nm = (a in TIMES ? TIMES[a] : a + ' × ') + eqs[i].name;
      s += m === 0 ? (mult[m] < 0 ? 'minus ' : '') + nm : (mult[m] < 0 ? ' minus ' : ' plus ') + nm;
    });
    return cap(s);
  }
  function knownList(d, eq, known) {
    const ks = [];
    eq.c.forEach((v, k) => { if (v && known[k]) ks.push(k); });
    return ks;
  }
  function eqHTML(d, q) {
    // the equation as the puzzle shows it
    if (d.kind === 'lines') return exprHTML(d, d.lines[q.ref].t) + ' = ' + d.lines[q.ref].r;
    if (d.kind === 'balance') { const B = d.bal[q.ref]; return B.l.map((t) => termHTML(d, t)).join(' + ') + ' balance ' + B.r.map((t) => termHTML(d, t)).join(' + '); }
    return combHTML(d, q.c, q.r);
  }

  // the words of one step; gentle: only where to look
  function stepText(d, sp, s, gentle) {
    const eqs = sp.eqs, x = d.sol, n = d.pics.length;
    const V = (k) => icon(d, k) + ' = **' + x[k] + '**';
    if (s.kind === 1) {
      const q = eqs[s.uses[0]], ks = knownList(d, q, s.known);
      if (gentle) return ks.length ? 'Look at ' + q.name + ': you already know ' + ks.map((k) => icon(d, k)).join(' and ') + ', and only one other picture is in it.' : cap(q.name) + ' has only one kind of picture in it.';
      const red = reduce(q, s.known, x);
      const a = Math.abs(s.coef), many = a > 1 ? (a <= 3 ? ['', '', 'two', 'three'][a] : String(a)) + ' of them make ' + Math.abs(s.rhs) : '';
      let t = cap(q.name) + ': ' + eqHTML(d, q) + '. ';
      if (ks.length) {
        t += 'You know ' + ks.map((k) => icon(d, k) + ' = ' + x[k]).join(' and ') + ', so ';
        return t + (a > 1 ? combHTML(d, red.c, red.r) + ': ' + many + ', and ' : '') + V(s.t) + '.';
      }
      return t + (a > 1 ? cap(many) + ', so ' : 'So ') + V(s.t) + '.';
    }
    const nm = combName(eqs, s.uses, s.mult);
    if (gentle) {
      if (s.kind === 2) return 'Compare ' + eqs[s.uses[0]].name + ' with ' + eqs[s.uses[1]].name + ': what is different between them' + (s.mult.some((m) => Math.abs(m) > 1) ? ' (try doubling one of them)' : '') + '?';
      return 'Try combining ' + eqs[s.uses[0]].name + ', ' + eqs[s.uses[1]].name + ' and ' + eqs[s.uses[2]].name + (s.mult.every((m) => m === 1) ? ': add them all up.' : '.');
    }
    const c = new Array(n).fill(0);
    let r = 0;
    s.uses.forEach((i, m) => { eqs[i].c.forEach((v, k) => { c[k] += s.mult[m] * v; }); r += s.mult[m] * eqs[i].r; });
    let t = d.kind === 'balance' ? 'Put the scales together — ' + nm.charAt(0).toLowerCase() + nm.slice(1) + ' — and take away what is on both sides: ' + combHTML(d, c, r) + '. ' :
      nm + ' leaves ' + combHTML(d, c, r) + '. ';
    const ks = [];
    c.forEach((v, k) => { if (v && s.known[k]) ks.push(k); });
    if (ks.length) {
      const red = { c: c.slice(), r };
      ks.forEach((k) => { red.r -= red.c[k] * x[k]; red.c[k] = 0; });
      t += 'You know ' + ks.map((k) => icon(d, k) + ' = ' + x[k]).join(' and ') + ', so ' + (Math.abs(s.coef) > 1 ? combHTML(d, red.c, red.r) + ', and ' : '');
      return t + (Math.abs(s.coef) > 1 ? 'dividing by ' + Math.abs(s.coef) + ', ' : '') + V(s.t) + '.';
    }
    if (Math.abs(s.coef) === 1) return t.replace(/ leaves .*. $/, ' leaves ' + V(s.t) + '.').replace(/: [^:]*. $/, ': ' + V(s.t) + '.');
    return t + 'Divide by ' + Math.abs(s.coef) + ': ' + V(s.t) + '.';
  }

  // the last line, worked out
  function askText(d, gentle) {
    const tr = askTraps(d), x = d.sol, a = d.ask;
    if (gentle) {
      const bits = [];
      if (tr.parts || tr.hat) bits.push('Look closely at the pictures in the last line: are they exactly the same as the ones above?');
      if (tr.order) bits.push('Remember that × comes before + and −.');
      return bits.length ? bits.join(' ') : 'Put your values into the last line and add them up.';
    }
    const notes = [];
    const terms = a.t ? a.t.filter((t, i) => i % 2 === 0) : a.l || [];
    terms.forEach((t) => {
      if (!t || t.k == null) return;
      const k = t.k, info = ART() && ART().info[d.pics[k]];
      if (t.n != null) {
        const main = mainOf(d, k), v = x[k] * t.n / main;
        const what = { apple: 'only half an apple', banana: 'only ' + t.n + ' banana' + (t.n === 1 ? '' : 's') + ', not ' + main, cherries: t.n === 1 ? 'a single cherry, not a pair' : t.n + ' cherries, not ' + main, flower: t.n + ' petals, not ' + main, clover: t.n + ' leaves, not ' + main, star: t.n + ' points, not ' + main }[d.pics[k]] || t.n + ' parts, not ' + main;
        const fr = { '1/2': 'half', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾', '1/5': '⅕', '2/5': '⅖', '3/5': '⅗', '4/5': '⅘' }[t.n + '/' + main] || t.n + '/' + main;
        notes.push(icon(d, k, t.n) + ' has ' + what + ': it is worth ' + fr + ' of ' + x[k] + ' = **' + v + '**');
      }
      if (t.hat != null) notes.push('the ' + (info ? info.name : 'picture') + ' ' + icon(d, k, undefined, true) + ' is wearing ' + icon(d, t.hat) + ': ' + x[k] + ' + ' + x[t.hat] + ' = **' + (x[k] + x[t.hat]) + '**');
    });
    let t = notes.length ? cap(notes.join('; ')) + '. ' : '';
    if (a.t) {
      const nums = a.t.map((u, i) => (i % 2 ? OPS[u] : String(termVal(d, u, x)))).join('');
      t += 'The last line is ' + nums + (tr.order ? ' — multiplication first' : '') + ' = **' + d.ans + '**.';
    } else if (a.l) t += 'The last scale holds ' + a.l.map((u) => String(termVal(d, u, x))).join(' + ') + ' = **' + d.ans + '** marbles.';
    else t += 'The missing total is ' + (a.row != null ? d.grid[a.row] : d.grid.map((r) => r[a.col])).map((k) => x[k]).join(' + ') + ' = **' + d.ans + '**.';
    return t;
  }

  function explainAll(d) {
    const sp = solvePath(d);
    if (!sp) return '';
    let t = sp.path.map((s, i) => (i + 1) + '. ' + stepText(d, sp, s, false)).join('\n');
    if (d.ask) t += '\n\n' + askText(d, false);
    return t;
  }

  /* =====================================================================
   * checking a puzzle
   * ===================================================================== */

  const isInt = (v) => Number.isInteger(v) && v > 0;
  function checkTerm(d, t, ctx) {
    if (typeof t === 'number') return Number.isInteger(t) && t >= 0 && t < d.pics.length;
    if (!t || typeof t !== 'object') return false;
    if (t.v != null) return Number.isInteger(t.v) && ctx !== 'pan';
    if (t.u != null || t.w != null) return ctx === 'pan' && isInt(t.u != null ? t.u : t.w);
    if (!(Number.isInteger(t.k) && t.k >= 0 && t.k < d.pics.length)) return false;
    if (t.n != null && !(isInt(t.n) && t.n <= 8)) return false;
    if (t.hat != null && !(Number.isInteger(t.hat) && d.pics[t.hat] === 'hat' && t.hat !== t.k)) return false;
    return true;
  }
  function checkData(d) {
    if (!d || !['lines', 'grid', 'balance'].includes(d.kind)) return 'kind must be lines, grid or balance';
    if (!Array.isArray(d.pics) || d.pics.length < 1 || d.pics.length > 6) return 'one to six pictures';
    if (ART() && d.pics.some((id) => !ART().has(id))) return 'unknown picture ' + d.pics.find((id) => !ART().has(id));
    if (new Set(d.pics).size !== d.pics.length) return 'a picture is listed twice';
    if (!Array.isArray(d.sol) || d.sol.length !== d.pics.length || d.sol.some((v) => !isInt(v))) return 'sol must give a whole number > 0 for every picture';
    const expr = (e) => Array.isArray(e) && e.length % 2 === 1 && e.every((t, i) => (i % 2 ? ['+', '-', '*'].includes(t) : checkTerm(d, t, 'expr')));
    if (d.kind === 'lines') {
      if (!Array.isArray(d.lines) || !d.lines.length) return 'lines are needed';
      for (const L of d.lines) {
        if (!expr(L.t) || !Number.isInteger(L.r)) return 'a line is malformed';
        if (evalExpr(d, L.t, d.sol) !== L.r) return 'a line does not add up: ' + JSON.stringify(L);
      }
      if (d.ask && !expr(d.ask.t)) return 'the last line is malformed';
    } else if (d.kind === 'grid') {
      if (!Array.isArray(d.grid) || !d.grid.length || d.grid.some((r) => !Array.isArray(r) || r.length !== d.grid[0].length || r.some((k) => !checkTerm(d, k)))) return 'grid must be rows of picture numbers';
      if (!Array.isArray(d.rs) || d.rs.length !== d.grid.length || !Array.isArray(d.cs) || d.cs.length !== d.grid[0].length) return 'rs and cs must give a total (or null) for every row and column';
      for (let i = 0; i < d.rs.length; i++) if (d.rs[i] != null && d.rs[i] !== d.grid[i].reduce((s, k) => s + d.sol[k], 0)) return 'row ' + (i + 1) + ' does not add up';
      for (let j = 0; j < d.cs.length; j++) if (d.cs[j] != null && d.cs[j] !== d.grid.reduce((s, r) => s + d.sol[r[j]], 0)) return 'column ' + (j + 1) + ' does not add up';
      if (d.ask && (d.ask.row != null ? d.rs[d.ask.row] !== null : d.ask.col != null ? d.cs[d.ask.col] !== null : true)) return 'the asked total must be hidden (null)';
    } else {
      if (!Array.isArray(d.bal) || !d.bal.length) return 'bal is needed';
      for (const B of d.bal) {
        if (!Array.isArray(B.l) || !Array.isArray(B.r) || !B.l.length || !B.r.length || B.l.concat(B.r).some((t) => !checkTerm(d, t, 'pan'))) return 'a scale is malformed';
        if (panVal(d, B.l, d.sol) !== panVal(d, B.r, d.sol)) return 'a scale does not balance';
      }
      if (d.ask && !(Array.isArray(d.ask.l) && d.ask.l.length && d.ask.l.every((t) => checkTerm(d, t, 'pan')))) return 'the last scale is malformed';
    }
    if (d.ask) {
      const v = askVal(d, d.sol);
      if (!isInt(v)) return 'the last line must come to a whole number above 0 (it is ' + v + ')';
      if (v !== d.ans) return 'ans is ' + d.ans + ' but the last line comes to ' + v;
    } else if (d.ans != null) return 'ans without a last line';
    return null;
  }

  /* =====================================================================
   * making puzzles (Endless drawers and tools/gen/picsums.js)
   * ===================================================================== */

  const THEMES = ['fruit', 'garden', 'animals', 'shapes', 'sweets'];
  const VARIANT = { apple: [1], banana: [1, 2], cherries: [1, 3], flower: [3, 4, 6], clover: [3], star: [4, 6] };
  const TITLEW = { banana: 'Bananas', cherries: 'Cherries', grapes: 'Grapes', watermelon: 'Melons', clover: 'Clovers', fish: 'Fish', icecream: 'Ice Creams', bunny: 'Rabbits', donut: 'Doughnuts' };
  const titleWord = (id) => TITLEW[id] || cap(ART().info[id].plural);

  function distinctValues(rng, n, lo, hi, must) {
    for (let tries = 0; tries < 50; tries++) {
      const out = [];
      for (let k = 0; k < n; k++) {
        let v = rng.range(lo, hi);
        if (must && must[k] > 1) v = must[k] * rng.range(Math.max(1, Math.ceil(lo / must[k])), Math.max(1, Math.floor(hi / must[k])));
        out.push(v);
      }
      if (new Set(out).size === n) return out;
    }
    return null;
  }

  function pickPics(rng, n, want) {
    let theme = want.hat ? 'animals' : want.parts ? rng.pick(['fruit', 'fruit', 'garden', 'shapes']) : rng.pick(THEMES);
    let pool = ART().themes[theme].filter((id) => id !== 'hat');
    rng.shuffle(pool);
    let pics = pool.slice(0, want.hat ? n - 1 : n);
    let vk = -1;
    if (want.parts) {
      const cand = pool.filter((id) => VARIANT[id]);
      if (!cand.length) return null;
      if (!pics.some((id) => VARIANT[id])) pics[0] = cand[0];
      vk = pics.findIndex((id) => VARIANT[id]);
    }
    if (want.hat) { pics.splice(rng.int(pics.length + 1), 0, 'hat'); }
    if (pics.length !== n) return null;
    return { pics, theme, vk };
  }

  // a line made of pictures: mult[k] copies of picture k (and maybe a − or a k ×)
  function lineOf(rng, d, mult, allowMinus, allowTimes) {
    const t = [];
    const order = [];
    mult.forEach((m, k) => { if (m) order.push(k); });
    rng.shuffle(order);
    let minusDone = false;
    order.forEach((k) => {
      const m = mult[k];
      const neg = allowMinus && !minusDone && t.length && m === 1 && rng() < 0.4;
      if (neg) minusDone = true;
      const block = m >= 3 && allowTimes && rng() < 0.6 ? [{ v: m }, '*', k] : m >= 2 && allowTimes && rng() < 0.25 ? [{ v: m }, '*', k] : null;
      if (block) { if (t.length) t.push('+'); t.push(...block); return; }
      for (let i = 0; i < m; i++) { if (t.length) t.push(neg && i === 0 ? '-' : '+'); t.push(k); }
    });
    const r = evalExpr(d, t, d.sol);
    if (!(r > 0)) return null;
    return { t, r };
  }

  function makeAsk(rng, d, level, trick, vk) {
    const n = d.pics.length, K = [];
    for (let k = 0; k < n; k++) if (d.pics[k] !== 'hat') K.push(k);
    rng.shuffle(K);
    const hatK = d.pics.indexOf('hat');
    let terms;
    if (trick === 'parts' && vk >= 0) {
      const alt = rng.pick(VARIANT[d.pics[vk]]);
      terms = [{ k: vk, n: alt }].concat(K.filter((k) => k !== vk).slice(0, rng.range(1, 2)));
    } else if (trick === 'hat' && hatK >= 0) {
      terms = [{ k: K[0], hat: hatK }].concat(K.slice(1, rng.range(2, 3)));
    } else terms = K.slice(0, Math.min(K.length, rng.range(2, 3)));
    rng.shuffle(terms);
    const t = [];
    const order = level >= 2 && terms.length >= 2 && rng() < (level >= 3 ? 0.75 : 0.5);
    terms.forEach((u, i) => { if (i) t.push('+'); t.push(u); });
    if (order) {
      // one multiplication that must be done first
      const at = 1 + 2 * rng.int(terms.length - 1);
      t[at] = '*';
      if (terms.length === 3) { const other = at === 1 ? 3 : 1; t[other] = rng() < 0.5 ? '-' : '+'; }
    }
    const v = evalExpr(d, t, d.sol);
    if (!isInt(v)) return null;
    return { ask: { t }, ans: v };
  }

  function makeLines(rng, level) {
    const n = level === 1 ? (rng() < 0.6 ? 2 : 3) : level === 2 ? 3 : level === 3 ? rng.range(3, 4) : level === 4 ? 4 : rng.range(4, 5);
    const trick = level >= 4 ? rng.pick(['parts', 'parts', 'hat', 'none']) : level === 3 ? rng.pick(['parts', 'none', 'none']) : 'none';
    const pp = pickPics(rng, n, { parts: trick === 'parts', hat: trick === 'hat' });
    if (!pp) return null;
    const must = pp.pics.map((id, k) => (k === pp.vk ? ART().info[id].main : 1));
    const hi = [0, 10, 12, 16, 20, 24][level];
    const sol = distinctValues(rng, n, level === 1 ? 1 : 2, hi, must);
    if (!sol) return null;
    const d = { kind: 'lines', pics: pp.pics, sol, lines: [] };
    const chain = level <= 2 || rng() < 0.3;
    const idx = rng.shuffle(pp.pics.map((p, k) => k));
    for (let i = 0; i < n; i++) {
      const mult = new Array(n).fill(0);
      if (chain) {
        if (i === 0) mult[idx[0]] = rng.range(2, 3);
        else { mult[idx[i]] = rng.range(1, 2); const extra = rng.range(1, Math.min(2, i)); for (let e = 0; e < extra; e++) mult[idx[rng.int(i)]] += 1; }
      } else {
        const kinds = rng.shuffle(idx.slice()).slice(0, rng.range(2, Math.min(3, n)));
        kinds.forEach((k) => { mult[k] = rng.range(1, 2); });
      }
      const L = lineOf(rng, d, mult, level >= 2, level >= 3);
      if (!L) return null;
      d.lines.push(L);
    }
    if (!chain) rng.shuffle(d.lines);
    if (!(level === 1 && rng() < 0.4)) {
      const a = makeAsk(rng, d, level, trick, pp.vk);
      if (!a) return null;
      Object.assign(d, a);
    }
    return d;
  }

  function makeGrid(rng, level) {
    const dims = [null, [2, 3], [3, 3], rng() < 0.5 ? [3, 3] : [3, 4], [4, 4], [4, 4]][level];
    const n = [0, 2, 3, rng.range(3, 4), 4, 5][level];
    const pp = pickPics(rng, n, {});
    if (!pp) return null;
    const sol = distinctValues(rng, n, 1, [0, 9, 12, 15, 18, 20][level]);
    if (!sol) return null;
    const [R, Cn] = dims;
    const grid = [];
    for (let i = 0; i < R; i++) { const row = []; for (let j = 0; j < Cn; j++) row.push(rng.int(n)); grid.push(row); }
    const used = new Set(grid.flat());
    if (used.size !== n) return null;
    const d = { kind: 'grid', pics: pp.pics, sol, grid };
    d.rs = grid.map((row) => row.reduce((s, k) => s + sol[k], 0));
    d.cs = grid[0].map((x, j) => grid.reduce((s, row) => s + sol[row[j]], 0));
    const hide = level <= 2 ? rng.range(0, 1) : level === 3 ? rng.range(1, 2) : rng.range(2, 3);
    const slots = [];
    d.rs.forEach((v, i) => slots.push(['r', i]));
    d.cs.forEach((v, j) => slots.push(['c', j]));
    rng.shuffle(slots);
    slots.slice(0, hide).forEach(([w, i]) => { if (w === 'r') d.rs[i] = null; else d.cs[i] = null; });
    if (hide && rng() < 0.75) {
      const [w, i] = slots[0];
      d.ask = w === 'r' ? { row: i } : { col: i };
      d.ans = askVal(d, sol);
    }
    return d;
  }

  function makeBalance(rng, level) {
    const n = [0, rng.range(1, 2), rng.range(2, 3), 3, rng.range(3, 4), 4][level];
    const trick = level >= 4 && rng() < 0.4 ? 'parts' : 'none';
    const pp = pickPics(rng, n, { parts: trick === 'parts' });
    if (!pp) return null;
    const must = pp.pics.map((id, k) => (k === pp.vk && trick === 'parts' ? ART().info[id].main : 1));
    const sol = distinctValues(rng, n, 1, [0, 6, 7, 9, 10, 12][level], must);
    if (!sol) return null;
    const d = { kind: 'balance', pics: pp.pics, sol, bal: [] };
    const idx = rng.shuffle(pp.pics.map((p, k) => k));
    const units = (v) => (v <= 6 ? { u: v } : { w: v });
    const chain = level <= 2 || rng() < 0.35;
    for (let i = 0; i < n; i++) {
      const L = [], Rr = [];
      if (chain) {
        const m = i === 0 ? rng.range(1, 2) : 1;
        for (let c = 0; c < m; c++) L.push(idx[i]);
        if (i > 0) { const j = idx[rng.int(i)]; if (rng() < 0.5) L.push(j); else Rr.push(j); }
      } else {
        const ks = rng.shuffle(idx.slice()).slice(0, rng.range(2, Math.min(3, n)));
        ks.forEach((k, c) => { const side = c === 0 ? L : c === 1 ? Rr : (rng() < 0.5 ? L : Rr); const m = rng.range(1, 2); for (let q = 0; q < m; q++) side.push(k); });
      }
      const a = panVal(d, L, sol), b = panVal(d, Rr, sol);
      if (a > b) Rr.push(units(a - b)); else if (b > a) L.push(units(b - a));
      if (!L.length || !Rr.length) return null;
      if (L.length + Rr.length > 7) return null;
      d.bal.push({ l: L, r: Rr });
    }
    if (!chain) rng.shuffle(d.bal);
    if (!(level === 1 && rng() < 0.3)) {
      const K = rng.shuffle(idx.slice());
      let l = K.slice(0, rng.range(Math.min(2, n), Math.min(3, n)));
      if (trick === 'parts' && pp.vk >= 0) l = [{ k: pp.vk, n: rng.pick(VARIANT[pp.pics[pp.vk]]) }].concat(K.filter((k) => k !== pp.vk).slice(0, rng.range(1, 2)));
      if (l.length === 1 && rng() < 0.6) l.push(l[0]);
      d.ask = { l };
      d.ans = panVal(d, l, sol);
      if (!isInt(d.ans)) return null;
    }
    return d;
  }

  function titleOf(d) {
    const names = d.pics.filter((id) => id !== 'hat').map(titleWord);
    const list = names.length === 1 ? names[0] : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
    if (d.kind === 'balance') return 'Weighing ' + list;
    if (d.kind === 'grid') return list + ' in a Grid';
    return d.pics.includes('hat') ? list + ' in Hats' : list;
  }
  function textOf(d) {
    const tr = askTraps(d);
    if (d.kind === 'balance') {
      return 'Every scale balances. Each kind of picture weighs a whole number of marbles (a marble weighs 1; a metal weight counts as many marbles as its label says). ' +
        (d.ask ? 'How many marbles balance the last scale?' : 'What does each picture weigh?');
    }
    if (d.kind === 'grid') {
      return 'Each picture stands for a whole number — the same picture, the same number. The numbers beside the rows and under the columns are their totals. ' +
        (d.ask ? 'What is the missing total marked **?**' : 'Find the number behind every picture.');
    }
    return 'Each picture stands for a whole number — the same picture, the same number. ' +
      (d.ask ? 'Find them, then work out the last line.' + (tr.parts || tr.hat ? ' Look carefully!' : '') : 'Find the number behind every picture.');
  }

  function generate(rng, level, kind) {
    for (let tries = 0; tries < 40; tries++) {
      const k = kind || (level === 1 ? rng.pick(['lines', 'lines', 'balance', 'grid']) : rng.pick(['lines', 'lines', 'grid', 'balance']));
      const d = k === 'grid' ? makeGrid(rng, level) : k === 'balance' ? makeBalance(rng, level) : makeLines(rng, level);
      if (!d || checkData(d)) continue;
      const sp = solvePath(d);
      if (!sp || levelOf(d, sp) !== level) continue;
      return d;
    }
    return null;
  }

  C.picSums = { termVal, evalExpr, linear, equations, askVal, naiveVal, askTraps, nextStep, solvePath, levelOf, stepText, askText, explainAll, checkData, generate, makeLines, makeGrid, makeBalance, titleOf, textOf };

  /* =====================================================================
   * the board
   * ===================================================================== */

  const OPG = { '+': '+', '-': '−', '*': '×' };

  function mountSums(ctx, p) {
    const d = p.data, wb = ctx.wb, n = d.pics.length, A = ART();
    const sp = solvePath(d);
    let vals = new Array(n).fill(null), cur = 0, fresh = true, answered = false;
    let timers = [], lastGentle = null, stopTilt = [];
    const board = wb.layer('board');
    const root = ctx.s('g', { class: 'ps-board ps-' + d.kind }, board);
    const occ = [];     // every picture drawn: { k, g, tag, main }
    const checks = [];  // live totals: { el, value(x), target, ref, yours }
    const refEls = {};  // equation ref -> elements to light up in a hint
    const addRef = (ref, el) => { (refEls[ref] = refEls[ref] || []).push(el); };

    function pic(parent, t, x, y, size, opt) {
      opt = opt || {};
      const k = typeof t === 'number' ? t : t.k;
      const g = ctx.s('g', { class: 'ps-pic', transform: 'translate(' + x + ' ' + y + ')', 'data-k': k }, parent);
      ctx.s('circle', { cx: size / 2, cy: size / 2, r: size * 0.52, class: 'ps-halo' }, g);
      const inner = ctx.s('g', { transform: 'scale(' + size / 100 + ')' }, g);
      inner.innerHTML = A.svg(d.pics[k], typeof t === 'number' || t.n == null ? undefined : t.n, t.hat != null ? { hat: true } : null);
      const main = typeof t === 'number' && !opt.noTag;
      let tag = null;
      if (main) {
        tag = ctx.s('g', { class: 'ps-vtag', transform: opt.tagIn ? 'translate(' + (size - 16) + ' ' + (size - 8) + ') scale(.85)' : 'translate(' + size / 2 + ' ' + (size + 14) + ')' }, g);
        ctx.s('rect', { x: -24, y: -14, width: 48, height: 28, rx: 14 }, tag);
        ctx.s('text', { y: 1, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, tag);
      }
      occ.push({ k, g, tag, main });
      return g;
    }
    function totalBox(parent, x, y, w, h, text, cls) {
      const g = ctx.s('g', { class: 'ps-total ' + (cls || '') }, parent);
      ctx.s('rect', { x, y, width: w, height: h, rx: 16 }, g);
      const t = ctx.s('text', { x: x + w / 2, y: y + h / 2 + 2, 'text-anchor': 'middle', 'dominant-baseline': 'central', text }, g);
      const yours = ctx.s('text', { x: x + w / 2, y: y + h + 20, class: 'ps-yours', 'text-anchor': 'middle' }, g);
      return { g, t, yours };
    }

    /* ---------- lines ---------- */
    let box = { x0: 0, y0: 0, x1: 0, y1: 0 };
    const bands = [];
    let askBox = null;
    if (d.kind === 'lines') {
      let y = 0, maxX = 0;
      const line = (t, total, i) => {
        const g = ctx.s('g', { class: 'ps-line' }, root);
        bands.push(ctx.s('rect', { x: -6, y: y - 8, height: 138, rx: 18, class: 'ps-band' }, g));
        if (i != null) ctx.s('text', { x: 22, y: y + 52, class: 'ps-lnum', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(i + 1) }, g);
        let x = 56;
        t.forEach((u, j) => {
          if (j % 2) { ctx.s('text', { x: x + 26, y: y + 52, class: 'ps-op', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: OPG[u] }, g); x += 52; return; }
          if (isPic(u)) { pic(g, u, x, y, 100); x += 100; return; }
          ctx.s('text', { x: x + 32, y: y + 52, class: 'ps-num', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(u.v) }, g);
          x += 64;
        });
        ctx.s('text', { x: x + 26, y: y + 52, class: 'ps-op', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: '=' }, g);
        x += 52;
        const tb = totalBox(g, x, y + 14, 124, 76, total == null ? '?' : String(total), total == null ? 'ps-ask' : '');
        maxX = Math.max(maxX, x + 124);
        return { g, tb };
      };
      d.lines.forEach((L, i) => {
        const r = line(L.t, L.r, i);
        checks.push({ el: r.tb, value: (x) => evalExpr(d, L.t, x), target: L.r });
        addRef(i, r.g);
        y += 152;
      });
      if (d.ask) {
        ctx.s('path', { d: 'M0 ' + (y - 22) + 'H' + maxX, class: 'ps-rule' }, root);
        y += 10;
        const r = line(d.ask.t, null, null);
        askBox = r.tb;
        addRef('ask', r.g);
        y += 152;
      }
      bands.forEach((b) => b.setAttribute('width', maxX + 14));
      box = { x0: 0, y0: -10, x1: maxX, y1: y - 20 };
    }

    /* ---------- grid ---------- */
    if (d.kind === 'grid') {
      const Q = 112, R = d.grid.length, Cn = d.grid[0].length;
      const g = ctx.s('g', {}, root);
      ctx.s('rect', { x: -8, y: -8, width: Cn * Q + 8, height: R * Q + 8, rx: 14, class: 'ps-gridbg' }, g);
      d.grid.forEach((row, i) => row.forEach((k, j) => {
        ctx.s('rect', { x: j * Q, y: i * Q, width: Q - 8, height: Q - 8, rx: 10, class: 'ps-cell', 'data-key': 'c' + i + '-' + j }, g);
        pic(g, k, j * Q + 6, i * Q + 2, 92, { tagIn: true });
      }));
      d.rs.forEach((s, i) => {
        const asked = d.ask && d.ask.row === i;
        const tb = totalBox(g, Cn * Q + 24, i * Q + 12, 112, 76, s == null ? (asked ? '?' : '') : String(s), s == null ? (asked ? 'ps-ask' : 'ps-hidden') : '');
        if (s != null) checks.push({ el: tb, value: (x) => row2(x, i), target: s });
        if (asked) askBox = tb;
        addRef('r' + i, tb.g);
        if (asked) addRef('ask', tb.g);
      });
      d.cs.forEach((s, j) => {
        const asked = d.ask && d.ask.col === j;
        const tb = totalBox(g, j * Q - 4, R * Q + 22, 104, 70, s == null ? (asked ? '?' : '') : String(s), s == null ? (asked ? 'ps-ask' : 'ps-hidden') : '');
        if (s != null) checks.push({ el: tb, value: (x) => col2(x, j), target: s });
        if (asked) askBox = tb;
        addRef('c' + j, tb.g);
        if (asked) addRef('ask', tb.g);
      });
      box = { x0: -10, y0: -10, x1: Cn * Q + 140, y1: R * Q + 110 };
    }
    function row2(x, i) { let s = 0; for (const k of d.grid[i]) { if (x[k] == null) return null; s += x[k]; } return s; }
    function col2(x, j) { let s = 0; for (const row of d.grid) { if (x[row[j]] == null) return null; s += x[row[j]]; } return s; }

    /* ---------- balance scales ---------- */
    const scales = [];
    if (d.kind === 'balance') {
      const SW = 540, SH = 440;
      const all = d.bal.map((B, i) => ({ B, i })).concat(d.ask ? [{ B: { l: d.ask.l, r: null }, i: 'ask' }] : []);
      const cols = all.length === 1 ? 1 : 2;
      all.forEach((S, idx) => {
        const inRow = Math.min(cols, all.length - Math.floor(idx / cols) * cols);
        const ox = (idx % cols) * SW + (cols - inRow) * SW / 2, oy = Math.floor(idx / cols) * SH;
        const g = ctx.s('g', { class: 'ps-scale', transform: 'translate(' + ox + ' ' + oy + ')' }, root);
        const PX = 250, PY = 318, LB = 150;
        ctx.s('path', { d: 'M' + (PX - 66) + ' ' + (PY + 86) + 'H' + (PX + 66) + 'L' + (PX + 48) + ' ' + (PY + 62) + 'H' + (PX - 48) + 'Z', class: 'ps-stand' }, g);
        ctx.s('path', { d: 'M' + (PX - 11) + ' ' + (PY + 64) + 'L' + (PX - 5) + ' ' + PY + 'H' + (PX + 5) + 'L' + (PX + 11) + ' ' + (PY + 64) + 'Z', class: 'ps-stand' }, g);
        ctx.s('text', { x: PX, y: PY + 112, class: 'ps-snum', 'text-anchor': 'middle', text: S.i === 'ask' ? 'the last scale' : 'scale ' + (S.i + 1) }, g);
        const beam = ctx.s('g', {}, g);
        ctx.s('rect', { x: PX - LB - 14, y: PY - 8, width: 2 * LB + 28, height: 16, rx: 8, class: 'ps-beam' }, beam);
        ctx.s('circle', { cx: PX, cy: PY, r: 12, class: 'ps-pivot' }, g);
        const badge = ctx.s('g', { class: 'ps-badge', transform: 'translate(' + PX + ' ' + (PY + 36) + ')' }, g);
        ctx.s('circle', { r: 16 }, badge);
        const badgeT = ctx.s('text', { y: 1, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, badge);
        const pan = (items, side) => {
          const pg = ctx.s('g', { class: 'ps-pan' }, g);
          const cx = PX + side * LB;
          ctx.s('rect', { x: cx - 6, y: PY - 30, width: 12, height: 26, class: 'ps-post' }, pg);
          ctx.s('rect', { x: cx - 88, y: PY - 42, width: 176, height: 14, rx: 7, class: 'ps-plate' }, pg);
          if (!items) {
            const card = ctx.s('g', { class: 'ps-askcard' }, pg);
            ctx.s('rect', { x: cx - 50, y: PY - 150, width: 100, height: 104, rx: 16 }, card);
            const t = ctx.s('text', { x: cx, y: PY - 97, 'text-anchor': 'middle', 'dominant-baseline': 'central', text: '?' }, card);
            askBox = { g: card, t, yours: t, card: true };
            return pg;
          }
          // flow the items onto the plate, rows from the bottom up
          const flat = [];
          items.forEach((t) => { if (t && t.u != null) for (let q = 0; q < t.u; q++) flat.push({ m: true }); else flat.push({ t, w: t && t.w != null }); });
          const width = (it) => (it.m ? 38 : it.w ? 80 : 78);
          const rows = [[]];
          let rw = 0;
          flat.forEach((it) => { if (rw + width(it) > 176 && rows[rows.length - 1].length) { rows.push([]); rw = 0; } rows[rows.length - 1].push(it); rw += width(it); });
          rows.forEach((row, ri) => {
            const tw = row.reduce((s, it) => s + width(it), 0);
            let x = cx - tw / 2;
            const base = PY - 42 - ri * 80;
            row.forEach((it) => {
              const wdt = width(it);
              if (it.m) { const mg = ctx.s('g', { transform: 'translate(' + (x + 1) + ' ' + (base - 36) + ') scale(.36)' }, pg); mg.innerHTML = A.svg('marble'); }
              else if (it.w) { const wg = ctx.s('g', { transform: 'translate(' + x + ' ' + (base - 80) + ') scale(.82)' }, pg); wg.innerHTML = A.svg('weight', 1, { label: it.t.w }); }
              else pic(pg, it.t, x, base - 78, 78, { noTag: true });
              x += wdt;
            });
          });
          return pg;
        };
        const lp = pan(S.B.l, -1), rp = pan(S.B.r, 1);
        const sc = { i: S.i, beam, lp, rp, PX, PY, LB, badge, badgeT, ang: 0, ask: S.i === 'ask' };
        scales.push(sc);
        if (S.i !== 'ask') addRef(S.i, g); else addRef('ask', g);
      });
      const rowsN = Math.ceil(all.length / cols);
      box = { x0: -10, y0: -30, x1: cols * SW - 20, y1: rowsN * SH - 10 };
    }
    function tilt(sc, ang) {
      const a = ang * Math.PI / 180, dy = sc.LB * Math.sin(a), dx = sc.LB * (1 - Math.cos(a));
      sc.beam.setAttribute('transform', 'rotate(' + ang + ' ' + sc.PX + ' ' + sc.PY + ')');
      sc.lp.setAttribute('transform', 'translate(' + dx + ' ' + (-dy) + ')');
      sc.rp.setAttribute('transform', 'translate(' + (-dx) + ' ' + dy + ')');
      sc.ang = ang;
    }

    /* ---------- the key: a box under every picture ---------- */
    const keyG = ctx.s('g', { class: 'ps-key' }, root);
    const KW = 124, ky = box.y1 + 50;
    const items = d.kind === 'balance' ? [{ unit: true }].concat(d.pics.map((id, k) => ({ k }))) : d.pics.map((id, k) => ({ k }));
    const kx0 = (box.x0 + box.x1) / 2 - items.length * KW / 2;
    ctx.s('text', { x: (box.x0 + box.x1) / 2, y: ky - 14, class: 'ps-keycap', 'text-anchor': 'middle', text: 'your values' }, keyG);
    ctx.s('rect', { x: kx0 - 14, y: ky - 4, width: items.length * KW + 4, height: 176, rx: 18, class: 'ps-keybg' }, keyG);
    const kboxes = [];
    items.forEach((it, i) => {
      const x = kx0 + i * KW;
      if (it.unit) {
        const mg = ctx.s('g', { transform: 'translate(' + (x + 14) + ' ' + (ky + 12) + ') scale(.7)' }, keyG);
        mg.innerHTML = A.svg('marble');
        const g = ctx.s('g', { class: 'ps-kbox fixed' }, keyG);
        ctx.s('rect', { x: x + 4, y: ky + 100, width: 96, height: 60, rx: 14 }, g);
        ctx.s('text', { x: x + 52, y: ky + 131, 'text-anchor': 'middle', 'dominant-baseline': 'central', text: '1' }, g);
        return;
      }
      pic(keyG, it.k, x + 7, ky + 6, 90);
      occ[occ.length - 1].key = true;
      const g = ctx.s('g', { class: 'ps-kbox', 'data-k': it.k }, keyG);
      ctx.s('rect', { x: x + 4, y: ky + 100, width: 96, height: 60, rx: 14 }, g);
      const t = ctx.s('text', { x: x + 52, y: ky + 131, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
      const caret = ctx.s('rect', { x: x + 50, y: ky + 112, width: 3, height: 36, class: 'ps-caret' }, g);
      kboxes[it.k] = { g, t, caret, x: x + 52 };
    });
    occ.forEach((o) => { if (o.key && o.tag) { o.tag.remove(); o.tag = null; } });
    const allBox = { x0: Math.min(box.x0, kx0 - 20), y0: box.y0 - 10, x1: Math.max(box.x1, kx0 + items.length * KW + 10), y1: ky + 190 };
    wb.setBounds(allBox, 0.05);

    /* ---------- drawing the state ---------- */
    const allRight = () => vals.every((v, k) => v === d.sol[k]);
    function draw() {
      kboxes.forEach((b, k) => {
        if (!b) return;
        b.t.textContent = vals[k] == null ? '' : String(vals[k]);
        b.g.classList.toggle('cur', k === cur && !answered);
        const w = vals[k] == null ? 0 : String(vals[k]).length * 10;
        b.caret.setAttribute('x', b.x + (fresh && vals[k] != null ? w + 4 : w + 1));
        b.caret.classList.toggle('replace', fresh && vals[k] != null);
      });
      occ.forEach((o) => {
        o.g.classList.toggle('sel', o.k === cur && !answered);
        if (o.tag) {
          const v = vals[o.k];
          o.tag.style.display = v == null ? 'none' : '';
          if (v != null) o.tag.lastChild.textContent = String(v);
        }
      });
      checks.forEach((c) => {
        const v = c.value(vals);
        c.el.g.classList.toggle('ok', v != null && v === c.target);
        c.el.g.classList.toggle('bad', v != null && v !== c.target);
        c.el.yours.textContent = v != null && v !== c.target ? 'yours: ' + v : '';
      });
      scales.forEach((sc) => {
        if (sc.ask) {
          const v = answered ? d.ans : null;
          sc.badge.style.display = 'none';
          if (askBox) askBox.t.textContent = v == null ? '?' : String(v);
          return;
        }
        const B = d.bal[sc.i];
        const a = panVal(d, B.l, vals), b = panVal(d, B.r, vals);
        const target = a == null || b == null ? 0 : Math.max(-13, Math.min(13, (b - a) * 2.2));
        sc.badge.setAttribute('class', 'ps-badge' + (a == null || b == null ? '' : a === b ? ' ok' : ' bad'));
        sc.badgeT.textContent = a == null || b == null ? '' : a === b ? '✓' : '✗';
        if (Math.abs(target - sc.ang) > 0.01) {
          if (sc.stop) sc.stop();
          const from = sc.ang;
          sc.stop = C.tween(C.anim(420), (t) => tilt(sc, from + (target - from) * t), () => { sc.stop = null; tilt(sc, target); });
        }
      });
      if (askBox && !askBox.card) {
        askBox.t.textContent = answered ? String(d.ans) : '?';
        askBox.g.classList.toggle('done', answered);
      } else if (askBox && askBox.card) askBox.g.classList.toggle('done', answered);
      const filled = vals.filter((v) => v != null).length;
      ctx.stat('Pictures', filled + '/' + n);
    }
    function pop(k) {
      const b = kboxes[k];
      if (!b) return;
      b.g.classList.remove('pop'); void b.g.getBoundingClientRect(); b.g.classList.add('pop');
      timers.push(setTimeout(() => b.g.classList.remove('pop'), 400));
    }
    function flashRefs(refs, cls) {
      Object.values(refEls).forEach((list) => list.forEach((el) => el.classList.remove('ps-hint', 'ps-wrong')));
      refs.forEach((r) => (refEls[r] || []).forEach((el) => el.classList.add(cls || 'ps-hint')));
      timers.push(setTimeout(() => refs.forEach((r) => (refEls[r] || []).forEach((el) => el.classList.remove(cls || 'ps-hint'))), 9000));
    }

    /* ---------- typing ---------- */
    function select(k) { if (k == null || k < 0 || k >= n) return; cur = k; fresh = true; draw(); }
    function typeDigit(dg) {
      if (answered || cur < 0) return;
      let s = fresh || vals[cur] == null ? '' : String(vals[cur]);
      if (s.length >= 3) { ctx.toast('Three digits are plenty here.'); return; }
      s += dg;
      vals[cur] = parseInt(s, 10);
      fresh = false;
      ctx.sfx('tap');
      pop(cur);
      draw();
      ctx.changed('type');
      if (allRight()) ctx.say(d.ask ? 'Every picture is right. Now the last line!' : 'Every line adds up.', 'good');
    }
    function rubOut(all) {
      if (answered || vals[cur] == null) return;
      const s = String(vals[cur]).slice(0, -1);
      vals[cur] = all || !s ? null : parseInt(s, 10);
      fresh = false;
      draw();
      ctx.changed('erase');
    }
    function step(dir) { select((cur + dir + n) % n); }

    wb.handlers.board = {
      down(pt, ev, el) {
        if (ev && ev.button === 2) return false;
        const t = el && el.closest ? el.closest('[data-k]') : null;
        if (!t) return false;
        select(+t.getAttribute('data-k'));
        // on a phone the number pad sits below the board: bring it into view
        if (wb.isNarrow() && !answered && pad.scrollIntoView) { try { pad.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* old browsers */ } }
        ctx.sfx('tap');
        return true;
      },
      hover(pt, ev, el) {
        const t = el && el.closest ? el.closest('[data-k]') : null;
        const k = t ? +t.getAttribute('data-k') : -1;
        occ.forEach((o) => o.g.classList.toggle('hov', o.k === k));
      }
    };

    const pad = C.numberPad({ keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, { k: 'prev', label: '‹' }, 0, { k: 'next', label: '›' }, 'clear'], cols: 7, label: 'Type the value of the picture with the gold box (or use the keyboard)',
      onKey: (k) => { if (k === 'clear') rubOut(false); else if (k === 'next') step(1); else if (k === 'prev') step(-1); else typeDigit(String(k)); } });
    ctx.panel.appendChild(pad);

    let ansBox = null;
    if (d.ask) {
      const label = d.kind === 'balance' ? 'How many marbles balance the last scale?' : d.kind === 'grid' ? 'What is the missing total?' : 'What does the last line come to?';
      ansBox = ctx.answer({
        kind: 'number', label, placeholder: d.kind === 'lines' ? 'The last line' : 'Your answer',
        check(v) {
          const x = C.answerTools ? C.answerTools.readNumber(v) : parseFloat(String(v).replace(',', '.'));
          if (x === d.ans) {
            answered = true;
            draw();
            ctx.changed('answer');
            return { ok: true, msg: 'Yes: **' + d.ans + '**.' };
          }
          const naive = naiveVal(d, d.sol), l2r = d.ask.t ? evalExpr(d, d.ask.t, d.sol, true) : null;
          if (naive != null && x === naive && naive !== d.ans) return { ok: false, msg: 'That is what the last line would be with the usual pictures. Look closely at them!' };
          if (l2r != null && x === l2r && l2r !== d.ans) return { ok: false, msg: 'Careful with the order: multiplication comes before + and −.' };
          if (!allRight()) return { ok: false, msg: 'Not that. Find the value of every picture first — each line turns green when it adds up.' };
          return { ok: false, msg: 'Not that. Your values are right: check the arithmetic of the last line.' };
        }
      });
    }

    const eqs = sp ? sp.eqs : equations(d);
    draw();
    ctx.setGoal(p.goal || (d.ask ? (d.kind === 'balance' ? 'How many marbles balance the last scale?' : d.kind === 'grid' ? 'Find the missing total.' : 'Work out the last line.') + ' Your values in the key help: a line turns green when it adds up.' :
      'Give every picture its number in the key. Each ' + (d.kind === 'balance' ? 'scale shows a tick when it balances.' : d.kind === 'grid' ? 'total turns green when it adds up.' : 'line turns green when it adds up.')));

    return {
      noMoves: true,
      check() {
        if (d.ask) {
          if (answered) return { solved: true, msg: 'The last line is **' + d.ans + '**.' };
          return { solved: false, msg: allRight() ? 'Your values are right — now put the last line into the answer box.' : 'Find the value of every picture, then the last line.' };
        }
        if (allRight()) return { solved: true, msg: 'Every picture has its number.' };
        if (vals.some((v) => v == null)) return { solved: false, msg: 'Every picture needs a number.' };
        const bad = d.kind === 'balance' ? d.bal.filter((B) => panVal(d, B.l, vals) !== panVal(d, B.r, vals)).length : checks.filter((c) => c.value(vals) !== c.target).length;
        return { solved: false, msg: bad ? 'Not yet: ' + (bad === 1 ? 'one total does' : bad + ' totals do') + ' not add up.' : 'Not yet.' };
      },
      hint() {
        if (answered || (!d.ask && allRight())) return 'All done!';
        const wrong = vals.findIndex((v, k) => v != null && v !== d.sol[k]);
        if (wrong >= 0) {
          const q = eqs.find((e) => e.c[wrong] && e.c.every((v, k) => !v || vals[k] != null) && e.c.reduce((s, v, k) => s + v * (vals[k] || 0), 0) !== e.r);
          return { text: 'Your ' + icon(d, wrong) + ' = ' + vals[wrong] + ' is not right' + (q ? ': ' + q.name + ' does not add up with it' : '') + '. Rub it out and think again.', show() { select(wrong); if (q) flashRefs([q.ref], 'ps-wrong'); } };
        }
        const known = vals.map((v, k) => v === d.sol[k]);
        if (known.some((v) => !v)) {
          const s = nextStep(eqs, known, d.sol);
          if (!s) return null;
          s.known = known;
          const key = s.t + ':' + s.uses.join(',');
          const stage = lastGentle && lastGentle.key === key ? Math.min(2, lastGentle.stage + 1) : 0;
          lastGentle = { key, stage };
          const refs = s.uses.map((i) => eqs[i].ref);
          if (stage === 2) return { text: 'I have written it in for you: ' + icon(d, s.t) + ' = **' + d.sol[s.t] + '**. (' + stepText(d, { eqs }, s, false) + ')', show() { flashRefs(refs); vals[s.t] = d.sol[s.t]; cur = s.t; fresh = true; pop(s.t); draw(); ctx.changed('hint'); } };
          return { text: stepText(d, { eqs }, s, stage === 0), show() { flashRefs(refs); if (stage) select(s.t); } };
        }
        if (d.ask) {
          const gentle = !(lastGentle && lastGentle.key === 'ask');
          lastGentle = { key: 'ask', stage: 1 };
          return { text: askText(d, gentle), show() { flashRefs(['ask']); if (ansBox && ansBox.el.focusInput) ansBox.el.focusInput(); } };
        }
        return null;
      },
      solve() {
        timers.forEach(clearTimeout);
        timers = [];
        const order = sp ? sp.path.map((s) => s.t) : d.pics.map((x, k) => k);
        let i = 0;
        const next = () => {
          while (i < order.length && vals[order[i]] === d.sol[order[i]]) i++;
          if (i < order.length) {
            const k = order[i++];
            cur = k; fresh = true;
            vals[k] = d.sol[k];
            pop(k);
            draw();
            timers.push(setTimeout(next, C.anim(380)));
            return;
          }
          vals = d.sol.slice();
          if (d.ask) { answered = true; if (ansBox) ansBox.feedback(C.md(askText(d, false)), 'good'); }
          draw();
          ctx.changed('solve');
        };
        vals = vals.map((v, k) => (v === d.sol[k] ? v : null));
        draw();
        timers.push(setTimeout(next, C.anim(250)));
      },
      explain() { return p.explain || explainAll(d); },
      getState() { return { vals: vals.slice(), cur, answered }; },
      setState(s) {
        if (!s || !Array.isArray(s.vals)) return;
        vals = d.pics.map((x, k) => (Number.isInteger(s.vals[k]) ? s.vals[k] : null));
        cur = s.cur >= 0 && s.cur < n ? s.cur : 0;
        answered = !!s.answered && !!d.ask;
        fresh = true;
        draw();
      },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (/^[0-9]$/.test(ev.key)) { typeDigit(ev.key); return true; }
        if (ev.key === 'Backspace') { rubOut(false); return true; }
        if (ev.key === 'Delete') { rubOut(true); return true; }
        if (ev.key === 'ArrowRight' || (ev.key === 'Tab' && !ev.shiftKey)) { step(1); return true; }
        if (ev.key === 'ArrowLeft' || (ev.key === 'Tab' && ev.shiftKey)) { step(-1); return true; }
        return false;
      },
      destroy() {
        timers.forEach(clearTimeout);
        scales.forEach((sc) => { if (sc.stop) sc.stop(); });
        wb.handlers.board = null;
      }
    };
  }

  /* =====================================================================
   * the engine
   * ===================================================================== */

  const ABOUT = {
    lines: '**Each picture stands for a whole number** — the same picture, always the same number. Click a picture (or its box in the key below) and type its value with the keyboard or the number pad; Tab or the arrows move to the next box, Backspace rubs out. Your values appear under every copy of the picture, and each line turns **green** when it adds up (red, with your total, when it does not).\n\nWhen there is a last line, work it out and type it in the answer box — and look closely at its pictures. Hints walk you through the elimination one step at a time.',
    grid: '**Each picture stands for a whole number.** The totals beside the rows and under the columns are the sums of their pictures. Click a picture (or its box in the key) and type its value; every total turns **green** when your values make it right. Hints walk you through the steps.',
    balance: '**Every scale balances.** Each kind of picture weighs a whole number of marbles (a marble weighs 1; a metal weight is worth the number on it). Click a picture (or its box in the key) and type its weight. With your weights the scales **tip** toward the heavier side — and level out, with a tick, when you have it right. Hints walk you through the steps.'
  };

  C.engine({
    id: 'picsums',
    name: 'Picture sums',
    deps: ['js/lib/picart.js'],
    stateVersion: 1,
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about(p) { const k = p && p.data && p.data.kind; return ABOUT[k] || ABOUT.lines; },

    verify(p) {
      const d = p.data;
      const e = checkData(d);
      if (e) return { ok: false, err: e };
      const sp = solvePath(d);
      if (!sp) return { ok: false, err: 'the values cannot be found step by step (or are not unique)' };
      return { ok: true };
    },

    answerKey(p) { return p.data.ask ? String(p.data.ans) : null; },

    generate(rng, level) {
      const d = generate(rng, level);
      if (!d) return null;
      return { title: titleOf(d), text: textOf(d), diff: level, data: d };
    },

    mount(ctx, p) { return mountSums(ctx, p); },

    thumb(p) {
      const d = p.data, A = ART();
      if (!A) return '';
      const g = (id, t, x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s / 100 + ')">' + A.svg(id, t && t.n != null ? t.n : undefined, t && t.hat != null ? { hat: true } : null) + '</g>';
      let b = '', w = 0, h = 100;
      if (d.kind === 'grid') {
        d.grid.forEach((row, i) => row.forEach((k, j) => { b += g(d.pics[k], null, j * 100, i * 100, 96); }));
        w = d.grid[0].length * 100; h = d.grid.length * 100;
      } else if (d.kind === 'balance') {
        const items = d.bal[0].l.concat(d.bal[0].r).filter(isPic);
        items.forEach((t, i) => { b += g(d.pics[kOf(t)], t, i * 100, 0, 96); });
        w = Math.max(1, items.length) * 100;
        b += '<path d="M0 108H' + w + '" stroke="#8a5a26" stroke-width="10" stroke-linecap="round"/>';
        h = 118;
      } else {
        const t = d.lines[0].t;
        t.forEach((u, i) => {
          if (i % 2) { b += '<text x="' + (w + 22) + '" y="62" text-anchor="middle" font-size="48" font-weight="700" fill="currentColor">' + OPG[u] + '</text>'; w += 44; }
          else if (isPic(u)) { b += g(d.pics[kOf(u)], u, w, 0, 100); w += 100; }
          else { b += '<text x="' + (w + 30) + '" y="64" text-anchor="middle" font-size="48" font-weight="800" fill="currentColor">' + u.v + '</text>'; w += 60; }
        });
        b += '<text x="' + (w + 22) + '" y="62" text-anchor="middle" font-size="48" font-weight="700" fill="currentColor">=</text><text x="' + (w + 90) + '" y="64" text-anchor="middle" font-size="48" font-weight="800" fill="currentColor">' + d.lines[0].r + '</text>';
        w += 140;
      }
      return '<svg viewBox="-6 -14 ' + (w + 12) + ' ' + (h + 20) + '" preserveAspectRatio="xMidYMid meet">' + b + '</svg>';
    }
  });

  C.css('picsums', `
    .ps-inl { width: 1.55em; height: 1.55em; vertical-align: -0.42em; display: inline-block; }
    .ps-lnum { font: 700 22px "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
    .ps-op { font: 700 46px "Segoe UI", system-ui, sans-serif; fill: var(--ink-2); }
    .ps-num { font: 800 46px "Segoe UI", system-ui, sans-serif; fill: var(--ink); }
    .ps-rule { stroke: var(--grid-2); stroke-width: 3; stroke-dasharray: 10 10; }
    .ps-total rect { fill: var(--cell); stroke: var(--line); stroke-width: 3; transition: fill .2s, stroke .2s; }
    .ps-total text { font: 800 40px "Segoe UI", system-ui, sans-serif; fill: var(--ink); }
    .ps-total.ok rect { fill: rgba(78, 203, 141, .2); stroke: var(--green); stroke-width: 4; }
    .ps-total.ok text { fill: var(--green); }
    .ps-total.bad rect { fill: rgba(255, 107, 107, .12); stroke: var(--red); stroke-width: 4; }
    .ps-total .ps-yours { font: 700 17px "Segoe UI", system-ui, sans-serif; fill: var(--red); }
    .ps-total.ps-ask rect { fill: rgba(255, 209, 102, .12); stroke: var(--gold); stroke-width: 4; stroke-dasharray: 10 7; }
    .ps-total.ps-ask text { fill: var(--gold); }
    .ps-total.ps-ask.done rect { fill: rgba(78, 203, 141, .2); stroke: var(--green); stroke-dasharray: none; }
    .ps-total.ps-ask.done text { fill: var(--green); }
    .ps-total.ps-hidden rect { fill: none; stroke: var(--grid-2); stroke-dasharray: 6 8; }
    .ps-band { fill: var(--accent); fill-opacity: 0; stroke: var(--accent); stroke-opacity: 0; stroke-width: 3; pointer-events: none; transition: fill-opacity .25s, stroke-opacity .25s; }
    .ps-line.ps-hint .ps-band { fill-opacity: .1; stroke-opacity: .6; }
    .ps-line.ps-wrong .ps-band { fill: var(--red); stroke: var(--red); fill-opacity: .1; stroke-opacity: .6; }
    .ps-total.ps-hint, .ps-scale.ps-hint { animation: pshint 1.1s ease-in-out 4; }
    .ps-total.ps-hint rect { stroke: var(--accent); stroke-width: 5; }
    .ps-line.ps-hint .ps-total rect, .ps-scale.ps-hint .ps-beam { stroke: var(--accent); stroke-width: 5; }
    .ps-line.ps-wrong .ps-total rect, .ps-total.ps-wrong rect, .ps-scale.ps-wrong .ps-beam { stroke: var(--red); stroke-width: 6; }
    @keyframes pshint { 50% { opacity: .55; } }
    .ps-pic { cursor: pointer; }
    .ps-halo { fill: var(--gold); fill-opacity: 0; stroke: var(--gold); stroke-opacity: 0; stroke-width: 3; stroke-dasharray: 8 6; transition: fill-opacity .15s, stroke-opacity .15s; }
    .ps-pic.hov .ps-halo { fill-opacity: .1; }
    .ps-pic.sel .ps-halo { fill-opacity: .12; stroke-opacity: .85; }
    .ps-vtag rect { fill: var(--accent); }
    .ps-vtag text { font: 800 18px "Segoe UI", system-ui, sans-serif; fill: #fff; }
    .ps-gridbg { fill: var(--board-2); stroke: var(--grid-2); stroke-width: 2; }
    .ps-cell { fill: var(--cell); stroke: var(--grid); stroke-width: 2; }
    .ps-keybg { fill: var(--board-2); stroke: var(--grid); stroke-width: 2; }
    .ps-keycap { font: 700 17px "Segoe UI", system-ui, sans-serif; fill: var(--faint); letter-spacing: .12em; text-transform: uppercase; }
    .ps-kbox { cursor: pointer; }
    .ps-kbox rect:first-child { fill: var(--input); stroke: var(--line); stroke-width: 3; }
    .ps-kbox text { font: 800 34px "Segoe UI", system-ui, sans-serif; fill: var(--ink); }
    .ps-kbox.cur rect:first-child { stroke: var(--gold); stroke-width: 4; }
    .ps-kbox.fixed { cursor: default; } .ps-kbox.fixed text { fill: var(--muted); }
    .ps-caret { fill: var(--gold); opacity: 0; pointer-events: none; }
    .ps-kbox.cur .ps-caret { opacity: 1; animation: pscaret 1s steps(2) infinite; }
    .ps-kbox.cur .ps-caret.replace { opacity: .5; }
    @keyframes pscaret { 50% { opacity: 0; } }
    .ps-kbox.pop text { animation: pspop .35s ease-out; transform-box: fill-box; transform-origin: center; }
    @keyframes pspop { 0% { transform: scale(1.5); } 100% { transform: scale(1); } }
    .ps-stand { fill: var(--wood-dark); }
    .ps-beam { fill: var(--wood); stroke: var(--wood-dark); stroke-width: 3; }
    .ps-pivot { fill: var(--metal); stroke: var(--wood-dark); stroke-width: 3; }
    .ps-post { fill: var(--wood-dark); }
    .ps-plate { fill: var(--metal); stroke: #6b7280; stroke-width: 2; }
    .ps-snum { font: 700 24px "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
    .ps-badge circle { fill: var(--panel-2); stroke: var(--line); stroke-width: 2; }
    .ps-badge text { font: 800 18px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .ps-badge.ok circle { fill: var(--green); stroke: var(--green); } .ps-badge.ok text { fill: #fff; }
    .ps-badge.bad circle { fill: var(--red); stroke: var(--red); } .ps-badge.bad text { fill: #fff; }
    .ps-askcard rect { fill: rgba(255, 209, 102, .14); stroke: var(--gold); stroke-width: 4; stroke-dasharray: 10 7; }
    .ps-askcard text { font: 800 50px "Segoe UI", system-ui, sans-serif; fill: var(--gold); }
    .ps-askcard.done rect { fill: rgba(78, 203, 141, .2); stroke: var(--green); stroke-dasharray: none; } .ps-askcard.done text { fill: var(--green); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
