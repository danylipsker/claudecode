/* HYPER-CORE · expr.js
 *
 * Expressions and equations as the calculators need them.
 *
 *   Hyper.expr.parse('v0^2*sin(2*theta)/g')      -> syntax tree
 *   Hyper.expr.parseEq('R = v0^2*sin(2*theta)/g') -> {l, r}
 *   Hyper.expr.compile(tree)(scope)              -> number
 *   Hyper.expr.isolate(eq, 'v0')                 -> tree for v0, or null when v0 appears twice
 *   Hyper.expr.toTex(tree, texOf)                -> TeX, for "rearranged" and worked solutions
 *   Hyper.expr.roots(f, opts)                    -> every root of f in a range, nearest the guess first
 *   Hyper.expr.equivalent(a, b, names)           -> do two answers agree at random points
 *
 * No eval: the tree is compiled into closures over a fixed set of functions.
 * Implicit multiplication (2x, 3 sin x, (a)(b)) is accepted, so readers can type
 * answers the way they would write them.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};

  const fact = n => {
    if (n < 0 || n !== Math.floor(n)) return gamma(n + 1);
    let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
  };
  // Lanczos approximation, for non-integer factorials
  function gamma(z) {
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    z -= 1;
    let x = c[0];
    for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  function erf(x) {
    const s = Math.sign(x); x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  }

  const FN = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    asinh: Math.asinh, acosh: Math.acosh, atanh: Math.atanh,
    sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x), cot: x => 1 / Math.tan(x),
    sqrt: Math.sqrt, cbrt: Math.cbrt, exp: Math.exp, ln: Math.log, log: Math.log10, log10: Math.log10, log2: Math.log2,
    abs: Math.abs, floor: Math.floor, ceil: Math.ceil, round: Math.round, sign: Math.sign, sgn: Math.sign,
    atan2: Math.atan2, hypot: Math.hypot, min: Math.min, max: Math.max, pow: Math.pow,
    root: (x, n) => (x < 0 && Math.round(n) % 2 === 1) ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n),
    fact, gamma, erf,
    deg: x => x * 180 / Math.PI, rad: x => x * Math.PI / 180,
    logb: (x, b) => Math.log(x) / Math.log(b),
    nCr: (n, k) => fact(n) / (fact(k) * fact(n - k)), nPr: (n, k) => fact(n) / fact(n - k)
  };
  const ARITY = { atan2: 2, pow: 2, root: 2, logb: 2, nCr: 2, nPr: 2, hypot: -1, min: -1, max: -1 };
  const CONST = { pi: Math.PI, 'π': Math.PI, e: Math.E, inf: Infinity, infinity: Infinity, '∞': Infinity };

  /* ---------------------------------------------------------------- tokens */

  const SUPS = { '²': '^2', '³': '^3', '¹': '^1', '⁴': '^4', '⁻¹': '^(-1)', '⁻²': '^(-2)' };
  // Greek letters typed directly become their names (λ → lambda); π stays the constant
  const GREEK_LETTERS = { 'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta', 'ε': 'epsilon', 'ϵ': 'epsilon', 'ζ': 'zeta', 'η': 'eta', 'θ': 'theta',
    'ι': 'iota', 'κ': 'kappa', 'λ': 'lambda', 'μ': 'mu', 'ν': 'nu', 'ξ': 'xi', 'ρ': 'rho', 'σ': 'sigma', 'τ': 'tau', 'υ': 'upsilon', 'φ': 'phi', 'ϕ': 'phi',
    'χ': 'chi', 'ψ': 'psi', 'ω': 'omega', 'Γ': 'Gamma', 'Δ': 'Delta', 'Θ': 'Theta', 'Λ': 'Lambda', 'Σ': 'Sigma', 'Φ': 'Phi', 'Ψ': 'Psi', 'Ω': 'Omega' };

  function tokenize(src, opts) {
    let s = String(src).replace(/[α-ωΑ-Ωϵϕ]/g, c => GREEK_LETTERS[c] ? ' ' + GREEK_LETTERS[c] + ' ' : c)
      .replace(/⁻¹|⁻²|[²³¹⁴]/g, m => SUPS[m])
      .replace(/[·×∙⋅]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\*\*/g, '^')
      .replace(/√/g, 'sqrt');
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      let m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(s.slice(i));
      if (m) { out.push({ t: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue; }
      m = /^[\p{L}_][\p{L}\p{N}_]*/u.exec(s.slice(i));
      if (m) {
        for (const part of splitIdent(m[0], opts)) out.push({ t: 'id', v: part });
        i += m[0].length;
        continue;
      }
      if ('+-*/^(),=!|[]'.includes(c)) { out.push({ t: c === '[' ? '(' : c === ']' ? ')' : c }); i++; continue; }
      throw new Error('Unexpected "' + c + '"');
    }
    return out;
  }

  /* With a list of known names, "xy" or "xsinx" is split into x·y and x·sin·x. */
  function splitIdent(id, opts) {
    const known = opts && opts.known;
    if (!known || known.has(id) || FN[id] || id in CONST) return [id];
    const names = [...known, ...Object.keys(FN), ...Object.keys(CONST)].sort((a, b) => b.length - a.length);
    const parts = [];
    let i = 0;
    while (i < id.length) {
      const n = names.find(x => id.startsWith(x, i));
      if (!n) return [id];
      parts.push(n);
      i += n.length;
    }
    return parts;
  }

  /* ---------------------------------------------------------------- parser */

  function parse(src, opts) {
    const toks = tokenize(src, opts);
    let i = 0;
    const peek = () => toks[i];
    const eat = t => { if (toks[i] && toks[i].t === t) { i++; return true; } return false; };
    const need = t => { if (!eat(t)) throw new Error('Expected "' + t + '"'); };

    function expr() {
      let a = term();
      for (;;) {
        if (eat('+')) a = { t: 'add', a, b: term() };
        else if (eat('-')) a = { t: 'sub', a, b: term() };
        else return a;
      }
    }
    function startsFactor(t) {
      return t && (t.t === 'num' || t.t === 'id' || t.t === '(');
    }
    function term() {
      let a = unary();
      for (;;) {
        if (eat('*')) a = { t: 'mul', a, b: unary() };
        else if (eat('/')) a = { t: 'div', a, b: unary() };
        else if (startsFactor(peek())) a = { t: 'mul', a, b: power(), imp: true };
        else return a;
      }
    }
    function unary() {
      if (eat('-')) return { t: 'neg', a: unary() };
      if (eat('+')) return unary();
      return power();
    }
    function power() {
      const b = postfix();
      if (eat('^')) return { t: 'pow', a: b, b: unary() };
      return b;
    }
    function postfix() {
      let a = primary();
      while (eat('!')) a = { t: 'fn', f: 'fact', args: [a] };
      return a;
    }
    function primary() {
      const t = peek();
      if (!t) throw new Error('Unexpected end');
      if (t.t === 'num') { i++; return { t: 'num', v: t.v }; }
      if (t.t === '(') { i++; const e = expr(); need(')'); return e; }
      if (t.t === '|') { i++; const e = expr(); need('|'); return { t: 'fn', f: 'abs', args: [e] }; }
      if (t.t === 'id') {
        i++;
        const name = t.v;
        const known = opts && opts.known && opts.known.has(name);
        if (FN[name] && !known) {
          if (eat('(')) {
            const args = [];
            if (!eat(')')) { do { args.push(expr()); } while (eat(',')); need(')'); }
            const ar = ARITY[name] || 1;
            if (ar > 0 && args.length !== ar && !(name === 'log' && args.length === 2)) throw new Error(name + ' takes ' + ar + ' argument' + (ar > 1 ? 's' : ''));
            if (name === 'log' && args.length === 2) return { t: 'fn', f: 'logb', args };
            // sin(x)^2 is (sin x)^2, handled by power() around us
            return { t: 'fn', f: name, args };
          }
          // sin x, sin 2x, sin x^2: the operand is the following juxtaposed factors
          if (eat('^')) {            // sin^2 x  ->  (sin x)^2
            const ex = unary();
            const arg = fnOperand();
            return { t: 'pow', a: { t: 'fn', f: name, args: [arg] }, b: ex };
          }
          return { t: 'fn', f: name, args: [fnOperand()] };
        }
        return { t: 'var', n: name };
      }
      throw new Error('Unexpected "' + t.t + '"');
    }
    function fnOperand() {
      let a = power();
      while (startsFactor(peek()) && !(peek().t === 'id' && FN[peek().v])) a = { t: 'mul', a, b: power(), imp: true };
      return a;
    }

    const tree = expr();
    if (opts && opts.eq && eat('=')) {
      const r = expr();
      if (i < toks.length) throw new Error('Unexpected "' + toks[i].t + '"');
      return { l: tree, r };
    }
    if (i < toks.length) throw new Error('Unexpected "' + (toks[i].v != null ? toks[i].v : toks[i].t) + '"');
    return opts && opts.eq ? { l: tree, r: null } : tree;
  }

  function parseEq(src, opts) {
    return parse(src, Object.assign({}, opts, { eq: true }));
  }

  /* ---------------------------------------------------------------- evaluation */

  function compile(n) {
    switch (n.t) {
      case 'num': { const v = n.v; return () => v; }
      case 'var': {
        const name = n.n;
        const c = CONST[name];
        return s => (s && name in s) ? s[name] : (c !== undefined ? c : NaN);
      }
      case 'neg': { const a = compile(n.a); return s => -a(s); }
      case 'add': { const a = compile(n.a), b = compile(n.b); return s => a(s) + b(s); }
      case 'sub': { const a = compile(n.a), b = compile(n.b); return s => a(s) - b(s); }
      case 'mul': { const a = compile(n.a), b = compile(n.b); return s => a(s) * b(s); }
      case 'div': { const a = compile(n.a), b = compile(n.b); return s => a(s) / b(s); }
      case 'pow': {
        const a = compile(n.a), b = compile(n.b);
        return s => {
          const x = a(s), y = b(s);
          if (x < 0 && y !== Math.round(y)) {
            // odd roots of negatives: (-8)^(1/3) = -2
            const inv = 1 / y;
            if (Math.abs(inv - Math.round(inv)) < 1e-9 && Math.round(inv) % 2 !== 0) return -Math.pow(-x, y);
          }
          return Math.pow(x, y);
        };
      }
      case 'fn': {
        const f = FN[n.f];
        if (!f) throw new Error('Unknown function ' + n.f);
        const args = n.args.map(compile);
        if (args.length === 1) { const a = args[0]; return s => f(a(s)); }
        if (args.length === 2) { const a = args[0], b = args[1]; return s => f(a(s), b(s)); }
        return s => f.apply(null, args.map(g => g(s)));
      }
    }
    throw new Error('Bad node ' + n.t);
  }

  function evaluate(n, scope) { return compile(n)(scope); }

  /* names of the variables a tree uses (constants like pi and e included only if
     `withConst`) */
  function vars(n, out, withConst) {
    out = out || new Set();
    (function walk(x) {
      if (!x) return;
      if (x.t === 'var') { if (withConst || !(x.n in CONST)) out.add(x.n); return; }
      if (x.a) walk(x.a);
      if (x.b) walk(x.b);
      if (x.args) x.args.forEach(walk);
    })(n);
    return out;
  }

  function count(n, name) {
    if (!n) return 0;
    if (n.t === 'var') return n.n === name ? 1 : 0;
    let c = count(n.a, name) + count(n.b, name);
    if (n.args) for (const a of n.args) c += count(a, name);
    return c;
  }

  /* ---------------------------------------------------------------- rearranging */

  const num = v => ({ t: 'num', v });
  const INV = { sin: 'asin', cos: 'acos', tan: 'atan', asin: 'sin', acos: 'cos', atan: 'tan', arcsin: 'sin', arccos: 'cos', arctan: 'tan',
                sinh: 'asinh', cosh: 'acosh', tanh: 'atanh', asinh: 'sinh', acosh: 'cosh', atanh: 'tanh', exp: 'ln', ln: 'exp' };

  /* Solve l = r for `name` when it appears exactly once. Returns a tree or null. */
  function isolate(eq, name) {
    let T, V;
    const cl = count(eq.l, name), cr = count(eq.r, name);
    if (cl + cr !== 1) return null;
    if (cl) { T = eq.l; V = eq.r; } else { T = eq.r; V = eq.l; }
    let guard = 0;
    while (!(T.t === 'var' && T.n === name)) {
      if (guard++ > 200) return null;
      const inA = T.a && count(T.a, name) > 0;
      switch (T.t) {
        case 'add': V = inA ? { t: 'sub', a: V, b: T.b } : { t: 'sub', a: V, b: T.a }; T = inA ? T.a : T.b; break;
        case 'sub': V = inA ? { t: 'add', a: V, b: T.b } : { t: 'sub', a: T.a, b: V }; T = inA ? T.a : T.b; break;
        case 'mul': V = inA ? { t: 'div', a: V, b: T.b } : { t: 'div', a: V, b: T.a }; T = inA ? T.a : T.b; break;
        case 'div': V = inA ? { t: 'mul', a: V, b: T.b } : { t: 'div', a: T.a, b: V }; T = inA ? T.a : T.b; break;
        case 'neg': V = { t: 'neg', a: V }; T = T.a; break;
        case 'pow':
          if (inA) {
            const e = T.b;
            if (e.t === 'num' && e.v === 2) V = { t: 'fn', f: 'sqrt', args: [V] };
            else if (e.t === 'num' && e.v === 3) V = { t: 'fn', f: 'cbrt', args: [V] };
            else if (e.t === 'num' && e.v === 0.5) V = { t: 'pow', a: V, b: num(2) };
            else if (e.t === 'num' && e.v === -1) V = { t: 'div', a: num(1), b: V };
            else if (e.t === 'num' && e.v === -2) V = { t: 'div', a: num(1), b: { t: 'fn', f: 'sqrt', args: [V] } };
            else if (e.t === 'div' && e.a.t === 'num' && e.a.v === 1) V = { t: 'pow', a: V, b: e.b };
            else if (e.t === 'neg' && e.a.t === 'num') V = { t: 'pow', a: V, b: { t: 'div', a: num(-1), b: e.a } };
            else V = { t: 'pow', a: V, b: { t: 'div', a: num(1), b: e } };
            T = T.a;
          } else {
            // x in the exponent
            if (T.a.t === 'var' && T.a.n === 'e') V = { t: 'fn', f: 'ln', args: [V] };
            else if (T.a.t === 'num' && T.a.v === 10) V = { t: 'fn', f: 'log', args: [V] };
            else V = { t: 'div', a: { t: 'fn', f: 'ln', args: [V] }, b: { t: 'fn', f: 'ln', args: [T.a] } };
            T = T.b;
          }
          break;
        case 'fn': {
          if (T.args.length !== 1) return null;
          const f = T.f;
          if (INV[f]) V = { t: 'fn', f: INV[f], args: [V] };
          else if (f === 'sqrt') V = { t: 'pow', a: V, b: num(2) };
          else if (f === 'cbrt') V = { t: 'pow', a: V, b: num(3) };
          else if (f === 'log' || f === 'log10') V = { t: 'pow', a: num(10), b: V };
          else if (f === 'log2') V = { t: 'pow', a: num(2), b: V };
          else if (f === 'abs') { /* take the positive branch */ }
          else if (f === 'sec') V = { t: 'fn', f: 'acos', args: [{ t: 'div', a: num(1), b: V }] };
          else if (f === 'csc') V = { t: 'fn', f: 'asin', args: [{ t: 'div', a: num(1), b: V }] };
          else if (f === 'cot') V = { t: 'fn', f: 'atan', args: [{ t: 'div', a: num(1), b: V }] };
          else return null;
          T = T.args[0];
          break;
        }
        default: return null;
      }
    }
    return simplify(V);
  }

  /* Light tidying: fold numbers, drop ×1, ÷1, ^1, +0, double negatives. */
  function simplify(n) {
    if (!n || n.t === 'num' || n.t === 'var') return n;
    const a = simplify(n.a), b = simplify(n.b);
    const args = n.args && n.args.map(simplify);
    const isN = (x, v) => x && x.t === 'num' && (v === undefined || x.v === v);
    switch (n.t) {
      case 'neg':
        if (a.t === 'neg') return a.a;
        if (isN(a)) return num(-a.v);
        return { t: 'neg', a };
      case 'add':
        if (isN(a, 0)) return b;
        if (isN(b, 0)) return a;
        if (isN(a) && isN(b)) return num(a.v + b.v);
        if (b.t === 'neg') return { t: 'sub', a, b: b.a };
        return { t: 'add', a, b };
      case 'sub':
        if (isN(b, 0)) return a;
        if (isN(a, 0)) return simplify({ t: 'neg', a: b });
        if (isN(a) && isN(b)) return num(a.v - b.v);
        if (b.t === 'neg') return { t: 'add', a, b: b.a };
        return { t: 'sub', a, b };
      case 'mul':
        if (isN(a, 1)) return b;
        if (isN(b, 1)) return a;
        if (isN(a) && isN(b)) return num(a.v * b.v);
        if (isN(a, -1)) return simplify({ t: 'neg', a: b });
        return { t: 'mul', a, b, imp: n.imp };
      case 'div':
        if (isN(b, 1)) return a;
        if (isN(a) && isN(b) && Number.isInteger(a.v / b.v)) return num(a.v / b.v);
        if (b.t === 'div') return simplify({ t: 'div', a: { t: 'mul', a, b: b.b }, b: b.a });
        if (a.t === 'div') return simplify({ t: 'div', a: a.a, b: { t: 'mul', a: a.b, b } });
        return { t: 'div', a, b };
      case 'pow':
        if (isN(b, 1)) return a;
        if (isN(b, 0.5)) return { t: 'fn', f: 'sqrt', args: [a] };
        if (a.t === 'fn' && a.f === 'sqrt' && isN(b, 2)) return a.args[0];
        return { t: 'pow', a, b };
      case 'fn':
        if (n.f === 'sqrt' && args[0].t === 'pow' && isN(args[0].b, 2)) return args[0].a;
        return { t: 'fn', f: n.f, args };
    }
    return n;
  }

  /* ---------------------------------------------------------------- TeX output */

  const GREEK = new Set(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta', 'theta', 'vartheta', 'iota', 'kappa',
    'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'varphi', 'chi', 'psi', 'omega',
    'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Phi', 'Psi', 'Omega']);

  /* A variable name as TeX: v0 -> v_0, theta1 -> \theta_1, k_B -> k_{B}, omega -> \omega */
  function autoTex(name) {
    if (GREEK.has(name)) return '\\' + name;
    if (name === 'pi' || name === 'π') return '\\pi';
    let m = /^([A-Za-z]+?)_(.+)$/.exec(name);
    if (m) return autoTex(m[1]) + '_{' + (m[2].length > 1 && !/^\d+$/.test(m[2]) ? '\\mathrm{' + m[2] + '}' : m[2]) + '}';
    m = /^([A-Za-z]+?)(\d+)$/.exec(name);
    if (m) return autoTex(m[1]) + '_{' + m[2] + '}';
    for (const g of GREEK) if (name.startsWith(g) && name.length > g.length) return '\\' + g + '_{' + name.slice(g.length) + '}';
    if (name.length === 1) return name;
    if (/^[A-Za-z][a-z]$/.test(name)) return name[0] + '_' + name[1];      // vx -> v_x, Fy -> F_y
    return '\\mathrm{' + name + '}';
  }

  function numTex(v) {
    if (Number.isInteger(v) && Math.abs(v) < 1e7) return String(v);
    return H.util ? H.util.fmtTex(v, 6) : String(v);
  }

  const PREC = { add: 1, sub: 1, mul: 2, div: 2, neg: 2, pow: 4, fn: 5, fact: 5, num: 6, var: 6 };
  const TEXFN = { sin: '\\sin', cos: '\\cos', tan: '\\tan', asin: '\\arcsin', acos: '\\arccos', atan: '\\arctan',
    arcsin: '\\arcsin', arccos: '\\arccos', arctan: '\\arctan', sinh: '\\sinh', cosh: '\\cosh', tanh: '\\tanh',
    sec: '\\sec', csc: '\\csc', cot: '\\cot', ln: '\\ln', log: '\\log', log10: '\\log_{10}', log2: '\\log_{2}',
    asinh: '\\operatorname{arsinh}', acosh: '\\operatorname{arcosh}', atanh: '\\operatorname{artanh}', exp: '\\exp',
    erf: '\\operatorname{erf}', sign: '\\operatorname{sgn}', sgn: '\\operatorname{sgn}' };

  /* texOf(name) gives a variable's TeX, or nothing to fall back on the defaults */
  function toTex(n, texOf) {
    const P = x => PREC[x.t] || 0;
    const wrap = s => '\\left(' + s + '\\right)';
    function go(x) {
      switch (x.t) {
        case 'num': return x.v < 0 ? wrap(numTex(x.v)) : numTex(x.v);
        case 'var': {
          const t = texOf && texOf(x.n);
          if (t) return t;
          if (x.n === 'e') return '\\mathrm{e}';
          if (x.n === 'pi' || x.n === 'π') return '\\pi';
          if (x.n in CONST) return '\\infty';
          return autoTex(x.n);
        }
        case 'add': return go(x.a) + ' + ' + go(x.b);
        case 'sub': return go(x.a) + ' - ' + (P(x.b) <= 1 || x.b.t === 'neg' ? wrap(go(x.b)) : go(x.b));
        case 'neg': return '-' + (P(x.a) <= 2 && x.a.t !== 'div' && x.a.t !== 'mul' ? wrap(go(x.a)) : go(x.a));
        case 'div': return '\\frac{' + go(x.a) + '}{' + go(x.b) + '}';
        case 'mul': {
          const fs = [];
          (function flat(y) { if (y.t === 'mul') { flat(y.a); flat(y.b); } else fs.push(y); })(x);
          let s = '';
          fs.forEach((f, i) => {
            let t = P(f) <= 1 || f.t === 'neg' ? wrap(go(f)) : go(f);
            if (i) {
              const prev = fs[i - 1];
              const leadsWithNum = f.t === 'num' || (f.t === 'pow' && f.a.t === 'num') || (f.t === 'div' && false);
              if (leadsWithNum) s += ' \\cdot ';
              else if (prev.t === 'num' && f.t === 'num') s += ' \\times ';
              else s += ' \\, ';
            }
            s += t;
          });
          return s;
        }
        case 'pow': {
          const b = x.b;
          if (b.t === 'num' && b.v === 0.5) return '\\sqrt{' + go(x.a) + '}';
          if (b.t === 'div' && b.a.t === 'num' && b.a.v === 1) return '\\sqrt[' + go(b.b) + ']{' + go(x.a) + '}';
          if (x.a.t === 'var' && x.a.n === 'e') return '\\mathrm{e}^{' + go(b) + '}';
          const base = P(x.a) < 5 || x.a.t === 'fn' || (x.a.t === 'num' && x.a.v < 0) ? wrap(go(x.a)) : go(x.a);
          return base + '^{' + go(b) + '}';
        }
        case 'fn': {
          const a = x.args;
          switch (x.f) {
            case 'sqrt': return '\\sqrt{' + go(a[0]) + '}';
            case 'cbrt': return '\\sqrt[3]{' + go(a[0]) + '}';
            case 'root': return '\\sqrt[' + go(a[1]) + ']{' + go(a[0]) + '}';
            case 'abs': return '\\left|' + go(a[0]) + '\\right|';
            case 'exp': return '\\mathrm{e}^{' + go(a[0]) + '}';
            case 'fact': return (P(a[0]) < 6 ? wrap(go(a[0])) : go(a[0])) + '!';
            case 'floor': return '\\left\\lfloor ' + go(a[0]) + '\\right\\rfloor';
            case 'ceil': return '\\left\\lceil ' + go(a[0]) + '\\right\\rceil';
            case 'logb': return '\\log_{' + go(a[1]) + '}' + wrap(go(a[0]));
            case 'nCr': return '\\binom{' + go(a[0]) + '}{' + go(a[1]) + '}';
          }
          const name = TEXFN[x.f] || '\\operatorname{' + x.f + '}';
          if (a.length === 1) {
            const simple = a[0].t === 'var' || (a[0].t === 'num' && a[0].v >= 0);
            return name + (simple ? ' ' + go(a[0]) : wrap(go(a[0])));
          }
          return name + wrap(a.map(go).join(',\\ '));
        }
      }
      return '?';
    }
    return go(n);
  }

  /* ---------------------------------------------------------------- numeric roots */

  /* Find the roots of f in a range.
     opts: {min, max, guess, positive (default true), log (sample logarithmically)}
     Returns an array of roots, nearest the guess first. */
  function roots(f, opts) {
    opts = opts || {};
    const found = [];
    const ok = x => Number.isFinite(x);
    const bisect = (a, fa, b, fb) => {
      // Illinois false position, with a plain bisection every eighth step
      let side = 0, c = (a + b) / 2;
      for (let k = 0; k < 300; k++) {
        c = (a * fb - b * fa) / (fb - fa);
        if (!(c > Math.min(a, b) && c < Math.max(a, b)) || k % 8 === 7) c = (a + b) / 2;
        let fc = f(c);
        if (!ok(fc)) { c = (a + b) / 2; fc = f(c); if (!ok(fc)) return c; }
        if (fc === 0) return c;
        if (Math.sign(fc) === Math.sign(fb)) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; }
        else { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; }
        if (Math.abs(b - a) <= 4e-16 * Math.max(Math.abs(a), Math.abs(b))) break;
      }
      return c;
    };
    /* a root where f only touches zero (a double root, e.g. at a maximum): |f| has a
       local minimum between samples and reaches (numerically) zero there */
    const touch = (a, b, fa, fb) => {
      const gr = 0.6180339887498949;
      let x1 = b - gr * (b - a), x2 = a + gr * (b - a), f1 = Math.abs(f(x1)), f2 = Math.abs(f(x2));
      for (let k = 0; k < 90; k++) {
        if (f1 < f2) { b = x2; x2 = x1; f2 = f1; x1 = b - gr * (b - a); f1 = Math.abs(f(x1)); }
        else { a = x1; x1 = x2; f1 = f2; x2 = a + gr * (b - a); f2 = Math.abs(f(x2)); }
      }
      const x = (a + b) / 2, fx = Math.abs(f(x));
      if (ok(fx) && fx <= 1e-9 * Math.max(Math.abs(fa), Math.abs(fb))) found.push(x);
    };
    const scan = xs => {
      let px = xs[0], pf = f(px), ppx = null, ppf = null;
      for (let k = 1; k < xs.length; k++) {
        const x = xs[k], fx = f(x);
        if (ok(pf) && ok(fx)) {
          if (fx === 0) found.push(x);
          else if (pf !== 0 && Math.sign(pf) !== Math.sign(fx)) {
            const r = bisect(px, pf, x, fx);
            // reject poles: a real root leaves |f| small next to it
            const fr = Math.abs(f(r));
            if (fr <= 1e-6 * Math.max(Math.abs(pf), Math.abs(fx)) || fr < 1e-12) found.push(r);
          } else if (ppf != null && ok(ppf) && Math.sign(ppf) === Math.sign(pf) && Math.sign(pf) === Math.sign(fx) &&
                     Math.abs(pf) < Math.abs(ppf) && Math.abs(pf) < Math.abs(fx) && Math.abs(pf) < 0.05 * Math.max(Math.abs(ppf), Math.abs(fx))) {
            touch(ppx, x, ppf, fx);
          }
        }
        ppx = px; ppf = pf;
        px = x; pf = fx;
      }
    };
    const lo = opts.min, hi = opts.max;
    const pos = opts.positive !== false;
    if (lo != null && hi != null && Number.isFinite(lo) && Number.isFinite(hi)) {
      const xs = [];
      const N = 600;
      if (opts.log && lo > 0) for (let k = 0; k <= N; k++) xs.push(lo * Math.pow(hi / lo, k / N));
      else for (let k = 0; k <= N; k++) xs.push(lo + (hi - lo) * k / N);
      scan(xs);
      // a root exactly on an end of the range has no sign change beside it
      let fmax = 0;
      for (const x of xs) { const v = Math.abs(f(x)); if (ok(v) && v > fmax) fmax = v; }
      for (const x of [lo, hi]) { const v = Math.abs(f(x)); if (ok(v) && v <= 1e-11 * fmax) found.push(x); }
    } else {
      // near the guess first, finely (2 % steps, ×0.05 … ×20), so close pairs of roots are both seen
      const g = opts.guess;
      if (g && Number.isFinite(g) && g !== 0) {
        const xs = [];
        for (let k = -150; k <= 150; k++) xs.push(Math.abs(g) * Math.pow(1.02, k));
        scan(xs);
        if (!pos) scan(xs.map(x => -x).reverse());
      }
      if (!found.length) {
        const xs = [];
        for (let e = -45; e <= 45; e += 0.125) xs.push(Math.pow(10, e));
        scan(xs);
        if (!pos) { scan(xs.map(x => -x).reverse()); scan([-1e-45, 0, 1e-45]); }
      }
      // zero itself, for signed quantities: no logarithmic grid reaches it
      if (!pos) {
        const f0 = f(0), s = Math.abs(g) || 1;
        const ref = Math.max(Math.abs(f(s)), Math.abs(f(-s)));
        if (ok(f0) && (f0 === 0 || (ok(ref) && Math.abs(f0) <= 1e-12 * ref))) found.push(0);
      }
    }
    // unique, nearest the guess first
    const uniq = [];
    for (const r of found) if (!uniq.some(u => Math.abs(u - r) <= 1e-9 * Math.max(Math.abs(u), Math.abs(r), 1e-300))) uniq.push(r);
    const g = opts.guess;
    if (g != null && Number.isFinite(g)) {
      const d = x => (g > 0 && x > 0) ? Math.abs(Math.log(x / g)) : Math.abs(x - g) / (Math.abs(g) + 1e-300) + 50;
      uniq.sort((a, b) => d(a) - d(b));
    }
    return uniq;
  }

  /* ---------------------------------------------------------------- answers */

  /* Do two expressions agree? Compared at random points of the named variables. */
  function equivalent(a, b, names, opts) {
    const fa = typeof a === 'function' ? a : compile(typeof a === 'string' ? parse(a, { known: new Set(names) }) : a);
    const fb = typeof b === 'function' ? b : compile(typeof b === 'string' ? parse(b, { known: new Set(names) }) : b);
    const rnd = H.util ? H.util.rng(12345) : Math.random;
    let good = 0;
    for (let k = 0; k < 40 && good < 8; k++) {
      const s = {};
      for (const n of names) s[n] = (opts && opts.positive ? 0.2 : -2.5) + rnd() * (opts && opts.positive ? 2.8 : 5);
      const x = fa(s), y = fb(s);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      const tol = 1e-6 * Math.max(1, Math.abs(x), Math.abs(y));
      if (Math.abs(x - y) > tol) return false;
      good++;
    }
    return good >= 3;
  }

  H.expr = { parse, parseEq, compile, evaluate, vars, count, isolate, simplify, toTex, autoTex, roots, equivalent,
             FN, CONST, isFunction: n => !!FN[n], isConst: n => n in CONST };
})(typeof window !== 'undefined' ? window : globalThis);
