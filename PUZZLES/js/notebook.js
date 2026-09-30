/* The Puzzle Cabinet · notebook.js
 *
 * The notebook beside every puzzle: a page for working notes and a
 * calculator that remembers its lines and variables ("a = 17", then "a*3").
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- a small, safe expression evaluator ---------- */

  const FUNCS = {
    sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil, round: Math.round,
    ln: Math.log, log: Math.log10, log2: Math.log2, exp: Math.exp,
    sin: (x) => Math.sin(x * Math.PI / 180), cos: (x) => Math.cos(x * Math.PI / 180), tan: (x) => Math.tan(x * Math.PI / 180),
    asin: (x) => Math.asin(x) * 180 / Math.PI, acos: (x) => Math.acos(x) * 180 / Math.PI, atan: (x) => Math.atan(x) * 180 / Math.PI,
    fact: (n) => { n = Math.round(n); if (n < 0 || n > 170) return NaN; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
    min: Math.min, max: Math.max,
    gcd: (a, b) => { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { const t = a % b; a = b; b = t; } return a; },
    lcm: (a, b) => { const g = FUNCS.gcd(a, b); return g ? Math.abs(Math.round(a) * Math.round(b)) / g : 0; },
    choose: (n, k) => { n = Math.round(n); k = Math.round(k); if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }
  };
  const CONSTS = { pi: Math.PI, e: Math.E, phi: (1 + Math.sqrt(5)) / 2 };

  function evaluate(src, vars) {
    const toks = [];
    const re = /\s*(?:(\d+(?:\.\d*)?(?:e[+-]?\d+)?|\.\d+)|([A-Za-z_][A-Za-z_0-9]*)|(\*\*|[-+*/^%(),!]))/gy;
    let m, pos = 0;
    src = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    while (pos < src.length) {
      re.lastIndex = pos;
      m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(pos))) break; throw new Error('I cannot read "' + src.slice(pos).trim().slice(0, 8) + '"'); }
      pos = re.lastIndex;
      if (m[1]) toks.push({ t: 'n', v: parseFloat(m[1]) });
      else if (m[2]) toks.push({ t: 'id', v: m[2] });
      else toks.push({ t: 'op', v: m[3] === '**' ? '^' : m[3] });
    }
    let i = 0;
    const peek = () => toks[i], next = () => toks[i++];
    const expect = (v) => { const t = next(); if (!t || t.v !== v) throw new Error('Expected ' + v); };
    function expr() {
      let v = term();
      while (peek() && (peek().v === '+' || peek().v === '-')) { const op = next().v; const r = term(); v = op === '+' ? v + r : v - r; }
      return v;
    }
    function term() {
      let v = unary();
      for (;;) {
        const t = peek();
        if (t && (t.v === '*' || t.v === '/' || t.v === '%')) { next(); const r = unary(); v = t.v === '*' ? v * r : t.v === '/' ? v / r : v % r; }
        else if (t && (t.t === 'n' || t.t === 'id' || t.v === '(')) v = v * unary(); // 2pi, 3(4+1)
        else break;
      }
      return v;
    }
    function unary() {
      const t = peek();
      if (t && t.v === '-') { next(); return -unary(); }
      if (t && t.v === '+') { next(); return unary(); }
      return power();
    }
    function power() {
      let b = postfix();
      if (peek() && peek().v === '^') { next(); return Math.pow(b, unary()); }
      return b;
    }
    function postfix() {
      let v = atom();
      while (peek() && peek().v === '!') { next(); v = FUNCS.fact(v); }
      return v;
    }
    function atom() {
      const t = next();
      if (!t) throw new Error('Unfinished');
      if (t.t === 'n') return t.v;
      if (t.v === '(') { const v = expr(); expect(')'); return v; }
      if (t.t === 'id') {
        const name = t.v;
        if (FUNCS[name] && peek() && peek().v === '(') {
          next();
          const args = [];
          if (peek() && peek().v !== ')') { args.push(expr()); while (peek() && peek().v === ',') { next(); args.push(expr()); } }
          expect(')');
          return FUNCS[name].apply(null, args);
        }
        if (vars && Object.prototype.hasOwnProperty.call(vars, name)) return vars[name];
        if (CONSTS[name] != null) return CONSTS[name];
        throw new Error('Unknown name ' + name);
      }
      throw new Error('Unexpected ' + t.v);
    }
    const v = expr();
    if (i < toks.length) throw new Error('Unexpected ' + toks[i].v);
    return v;
  }
  C.evaluate = evaluate;

  function fmt(v) {
    if (!isFinite(v)) return String(v);
    if (Math.abs(v - Math.round(v)) < 1e-10 && Math.abs(v) < 1e15) return String(Math.round(v));
    const s = Number(v.toPrecision(12)).toString();
    return s;
  }
  C.fmtCalc = fmt;

  /* ---------- the panel ---------- */

  C.Notebook = function (host, state, onChange) {
    state.text = state.text || '';
    state.calc = state.calc || [];
    state.vars = state.vars || {};
    host.innerHTML = '';
    const ta = C.h('textarea.nb-text', { placeholder: 'Working notes: sums in the middle, ideas, what you tried…', spellcheck: 'false' });
    ta.value = state.text;
    ta.addEventListener('input', () => { state.text = ta.value; onChange(); });
    ta.addEventListener('keydown', (e) => e.stopPropagation());

    const log = C.h('div.nb-log');
    const input = C.h('input.nb-in', { type: 'text', placeholder: 'Calculate: 12*7, sqrt(2), a = 15, a/4 …', spellcheck: 'false', autocomplete: 'off' });
    const draw = () => {
      log.innerHTML = '';
      state.calc.slice(-40).forEach((r) => {
        log.appendChild(C.h('div.nb-row' + (r.err ? '.err' : ''), {
          title: 'Click to use this line again',
          onclick: () => { input.value = r.src; input.focus(); }
        }, C.h('span.nb-src', r.src), C.h('span.nb-eq', r.err ? '!' : '='), C.h('span.nb-val', r.err || r.val)));
      });
      log.scrollTop = log.scrollHeight;
      const names = Object.keys(state.vars).filter((k) => k !== 'ans');
      vars.textContent = names.length ? 'Remembered: ' + names.map((k) => k + ' = ' + fmt(state.vars[k])).join(',  ') : '';
    };
    const vars = C.h('div.nb-vars');
    let hist = -1;
    input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const list = state.calc;
        if (!list.length) return;
        hist = e.key === 'ArrowUp' ? (hist < 0 ? list.length - 1 : Math.max(0, hist - 1)) : Math.min(list.length, hist + 1);
        input.value = hist < list.length ? list[hist].src : '';
        e.preventDefault();
        return;
      }
      if (e.key !== 'Enter') return;
      const src = input.value.trim();
      if (!src) return;
      hist = -1;
      let name = null, body = src;
      const as = /^([A-Za-z_][A-Za-z_0-9]*)\s*=(?!=)\s*(.+)$/.exec(src);
      if (as && !FUNCS[as[1]] && !CONSTS[as[1]]) { name = as[1]; body = as[2]; }
      try {
        const v = evaluate(body, state.vars);
        state.vars.ans = v;
        if (name) state.vars[name] = v;
        state.calc.push({ src, val: fmt(v) });
        input.value = '';
      } catch (err) {
        state.calc.push({ src, err: err.message });
      }
      if (state.calc.length > 80) state.calc.splice(0, state.calc.length - 80);
      draw();
      onChange();
    });
    const clear = C.h('button.btn.small', { type: 'button', onclick: () => { state.calc = []; state.vars = {}; draw(); onChange(); } }, 'Clear the calculator');
    host.append(
      C.h('div.nb-head', C.h('span', 'Notebook'), C.h('small', 'kept with this puzzle')),
      ta,
      C.h('div.nb-head', C.h('span', 'Calculator'), C.h('small', 'sqrt, sin (degrees), fact, choose, gcd, pi…')),
      log, input, vars,
      C.h('div.nb-foot', clear)
    );
    draw();
    return { focus: () => ta.focus() };
  };
})(typeof window !== 'undefined' ? window : globalThis);
