/* HYPER-CORE · tex.js
 *
 * A TeX subset to MathML. The browser draws MathML natively (Chrome 109+, Edge,
 * Firefox, Safari), so formulas need no library and no network.
 *
 *   Hyper.tex(src, display)   -> '<math ...>...</math>'   (throws on bad input)
 *   Hyper.texSafe(src, display) -> same, or a red error span instead of throwing
 *
 * Covers what physics and maths text needs: fractions, roots, scripts, Greek,
 * operators and relations, big operators with limits, \left \right fences,
 * accents (\vec \hat \bar \dot ...), fonts (\mathbf \mathrm \mathbb \mathcal ...),
 * \text, matrices and cases, aligned equations, colour and highlight.
 *
 * Every identifier carries data-k="<its TeX>" (subscript included) so the UI can
 * light up a symbol inside a formula when the reader points at it in the legend.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};

  const GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ϵ', varepsilon: 'ε', zeta: 'ζ', eta: 'η',
    theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ', varkappa: 'ϰ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ',
    omicron: 'ο', pi: 'π', varpi: 'ϖ', rho: 'ρ', varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ',
    upsilon: 'υ', phi: 'ϕ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Upsilon: 'Υ',
    Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω'
  };

  // identifiers (drawn upright unless noted)
  const SYM_MI = {
    infty: '∞', partial: '∂', nabla: '∇', hbar: 'ℏ', hslash: 'ℏ', ell: 'ℓ', emptyset: '∅', varnothing: '∅',
    Re: 'ℜ', Im: 'ℑ', aleph: 'ℵ', imath: 'ı', jmath: 'ȷ', angle: '∠', measuredangle: '∡', triangle: '△',
    Box: '□', square: '□', checkmark: '✓', dagger: '†', ddagger: '‡', star: '⋆', wp: '℘', top: '⊤',
    bot: '⊥', flat: '♭', sharp: '♯', natural: '♮', degree: '°', prime: '′', AA: 'Å', diamond: '◇',
    clubsuit: '♣', heartsuit: '♡', spadesuit: '♠', diamondsuit: '♢', infin: '∞', odot: '⊙', oplus: '⊕',
    varDelta: 'Δ', mho: '℧', Angstrom: 'Å', sun: '☉', earth: '⊕'
  };

  // operators, relations, arrows, punctuation
  const SYM_MO = {
    cdot: '⋅', cdotp: '⋅', times: '×', div: '÷', pm: '±', mp: '∓', ast: '∗', bullet: '∙', circ: '∘',
    le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', lt: '<', gt: '>', leqslant: '⩽', geqslant: '⩾',
    approx: '≈', equiv: '≡', propto: '∝', sim: '∼', simeq: '≃', cong: '≅', ll: '≪', gg: '≫', doteq: '≐',
    to: '→', rightarrow: '→', leftarrow: '←', gets: '←', Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔',
    leftrightarrow: '↔', iff: '⟺', implies: '⟹', impliedby: '⟸', mapsto: '↦', longrightarrow: '⟶',
    longleftarrow: '⟵', Longrightarrow: '⟹', Longleftarrow: '⟸', Longleftrightarrow: '⟺', longleftrightarrow: '⟷',
    hookrightarrow: '↪', hookleftarrow: '↩', leadsto: '⇝', Uparrow: '⇑', Downarrow: '⇓', uparrow: '↑', downarrow: '↓', updownarrow: '↕',
    rightleftharpoons: '⇌', leftrightharpoons: '⇋', rightharpoonup: '⇀', nearrow: '↗', searrow: '↘',
    perp: '⊥', parallel: '∥', in: '∈', notin: '∉', ni: '∋', subset: '⊂', subseteq: '⊆', supset: '⊃',
    supseteq: '⊇', cup: '∪', cap: '∩', setminus: '∖', forall: '∀', exists: '∃', nexists: '∄', neg: '¬',
    lnot: '¬', land: '∧', lor: '∨', wedge: '∧', vee: '∨', otimes: '⊗', ominus: '⊖', oslash: '⊘',
    ldots: '…', cdots: '⋯', vdots: '⋮', ddots: '⋱', dots: '…', dotsc: '…', dotsb: '⋯',
    langle: '⟨', rangle: '⟩', lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉', vert: '|', Vert: '‖',
    lvert: '|', rvert: '|', lVert: '‖', rVert: '‖', mid: '∣', nmid: '∤', colon: ':', therefore: '∴',
    because: '∵', models: '⊨', vdash: '⊢', prec: '≺', succ: '≻', preceq: '⪯', succeq: '⪰',
    triangleq: '≜', coloneqq: '≔', smallsetminus: '∖', wr: '≀', amalg: '⨿', sqcup: '⊔', sqcap: '⊓',
    lhd: '⊲', rhd: '⊳', unlhd: '⊴', unrhd: '⊵', nless: '≮', ngtr: '≯', lesssim: '≲', gtrsim: '≳',
    backslash: '∖', centerdot: '⋅', diamondop: '⋄'
  };

  const BIG = { sum: '∑', prod: '∏', coprod: '∐', int: '∫', iint: '∬', iiint: '∭', oint: '∮', oiint: '∯',
                bigcup: '⋃', bigcap: '⋂', bigoplus: '⨁', bigotimes: '⨂', bigvee: '⋁', bigwedge: '⋀', bigsqcup: '⨆' };
  const INTEGRALS = new Set(['int', 'iint', 'iiint', 'oint', 'oiint']);

  const FUNCS = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'arcsin', 'arccos', 'arctan', 'arcsec', 'arccsc', 'arccot',
                 'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch', 'arsinh', 'arcosh', 'artanh',
                 'ln', 'log', 'lg', 'exp', 'dim', 'ker', 'arg', 'deg', 'hom', 'sgn', 'Tr', 'tr', 'erf', 'erfc'];
  const LIMFUNCS = ['lim', 'max', 'min', 'sup', 'inf', 'limsup', 'liminf', 'det', 'gcd', 'lcm', 'Pr', 'argmax', 'argmin'];
  const FUNCSET = new Set(FUNCS), LIMSET = new Set(LIMFUNCS);

  const ACCENTS = { vec: '→', hat: '^', widehat: '^', bar: '¯', dot: '˙', ddot: '¨', dddot: '⃛', tilde: '~',
                    widetilde: '~', check: 'ˇ', breve: '˘', acute: '´', grave: '`', mathring: '˚' };
  const WIDE = { overline: '‾', overrightarrow: '→', overleftarrow: '←', overleftrightarrow: '↔',
                 overbrace: '⏞', widehat: '^', widetilde: '~' };
  const UNDER = { underline: '_', underbrace: '⏟', underrightarrow: '→', underleftarrow: '←' };

  const SPACES = { ',': 0.1667, ':': 0.2222, '>': 0.2222, ';': 0.2778, ' ': 0.25, quad: 1, qquad: 2, enspace: 0.5,
                   thinspace: 0.1667, medspace: 0.2222, thickspace: 0.2778, '!': 0, negthinspace: 0 };

  const DELIMS = { '{': '{', '}': '}', '|': '‖', langle: '⟨', rangle: '⟩', lvert: '|', rvert: '|', lVert: '‖',
                   rVert: '‖', vert: '|', Vert: '‖', lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉',
                   uparrow: '↑', downarrow: '↓', backslash: '∖', lbrace: '{', rbrace: '}', lbrack: '[', rbrack: ']' };

  const BIGSIZE = { big: 1.2, Big: 1.8, bigg: 2.4, Bigg: 3.0 };

  /* Unicode mathematical alphanumerics: MathML Core only honours mathvariant="normal",
     so bold, blackboard, script... are written as the characters themselves. */
  const FONTS = {
    bf:   { A: 0x1D400, a: 0x1D41A, d: 0x1D7CE, G: 0x1D6A8, g: 0x1D6C2 },
    bi:   { A: 0x1D468, a: 0x1D482, d: 0x1D7CE, G: 0x1D71C, g: 0x1D736 },
    it:   { A: 0x1D434, a: 0x1D44E, G: 0x1D6E2, g: 0x1D6FC, ex: { h: 'ℎ' } },
    bb:   { A: 0x1D538, a: 0x1D552, d: 0x1D7D8, ex: { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' } },
    cal:  { A: 0x1D49C, a: 0x1D4B6, ex: { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' } },
    frak: { A: 0x1D504, a: 0x1D51E, ex: { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' } },
    sf:   { A: 0x1D5A0, a: 0x1D5BA, d: 0x1D7E2 },
    tt:   { A: 0x1D670, a: 0x1D68A, d: 0x1D7F6 }
  };
  const FONTCMD = { mathbf: 'bf', textbf: 'bf', bf: 'bf', boldsymbol: 'bi', bm: 'bi', mathbb: 'bb', Bbb: 'bb',
                    mathcal: 'cal', mathscr: 'cal', mathfrak: 'frak', mathsf: 'sf', mathtt: 'tt', mathit: 'it' };

  function mapChar(ch, font) {
    const f = FONTS[font];
    if (!f) return ch;
    if (f.ex && f.ex[ch]) return f.ex[ch];
    const c = ch.codePointAt(0);
    if (c >= 65 && c <= 90 && f.A) return String.fromCodePoint(f.A + c - 65);
    if (c >= 97 && c <= 122 && f.a) return String.fromCodePoint(f.a + c - 97);
    if (c >= 48 && c <= 57 && f.d) return String.fromCodePoint(f.d + c - 48);
    if (c >= 0x391 && c <= 0x3A9 && f.G) return String.fromCodePoint(f.G + c - 0x391);
    if (c >= 0x3B1 && c <= 0x3C9 && f.g) return String.fromCodePoint(f.g + c - 0x3B1);
    return ch;
  }

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function escA(s) { return esc(s).replace(/"/g, '&quot;'); }
  const norm = s => s.replace(/[\s{}]/g, '');

  /* ---------------------------------------------------------------- tokens */

  const LETTER = /[\p{L}]/u;

  function tokenize(s) {
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (c === '\\') {
        let j = i + 1;
        while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
        if (j === i + 1) j = Math.min(s.length, i + 2);
        out.push({ t: 'cmd', v: s.slice(i + 1, j), p: i, e: j });
        i = j;
        continue;
      }
      if (c === ' ' || c === '\n' || c === '\t' || c === '\r') { i++; continue; }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
        const m = /^[0-9]*\.?[0-9]+/.exec(s.slice(i));
        out.push({ t: 'num', v: m[0], p: i, e: i + m[0].length });
        i += m[0].length;
        continue;
      }
      if ('{}^_&\''.includes(c)) { out.push({ t: c, v: c, p: i, e: i + 1 }); i++; continue; }
      const cp = s.codePointAt(i);
      const ch = String.fromCodePoint(cp);
      out.push({ t: LETTER.test(ch) ? 'letter' : 'char', v: ch, p: i, e: i + ch.length });
      i += ch.length;
    }
    return out;
  }

  /* ---------------------------------------------------------------- parser
     Nodes are {m: mathml string, src: tex source, ...flags}. */

  function mrow(items) {
    const list = items.filter(Boolean);
    if (list.length === 1) return list[0].m;
    let h = '';
    for (let i = 0; i < list.length; i++) {
      h += list[i].m;
      // a function name is followed by a thin space unless an opening fence follows
      if (list[i].fn && i + 1 < list.length && !list[i + 1].open && !list[i + 1].space) h += '<mspace width="0.1667em"></mspace>';
    }
    return '<mrow>' + h + '</mrow>';
  }

  class Parser {
    constructor(src, display) {
      this.src = src;
      this.toks = tokenize(src);
      this.i = 0;
      this.display = display;
    }
    peek(o) { return this.toks[this.i + (o || 0)]; }
    next() { return this.toks[this.i++]; }
    err(msg, t) {
      const at = t ? t.p : (this.peek() ? this.peek().p : this.src.length);
      throw new Error(msg + ' at "' + this.src.slice(Math.max(0, at - 12), at + 12) + '"');
    }
    expect(type) {
      const t = this.next();
      if (!t || t.t !== type) this.err('Expected ' + type, t);
      return t;
    }
    isCmd(t, v) { return t && t.t === 'cmd' && t.v === v; }

    /* raw text of a {...} group, braces balanced; the token index moves past it */
    rawBraced() {
      const t = this.next();
      if (!t || t.t !== '{') this.err('Expected {', t);
      let depth = 1, j = t.e;
      while (j < this.src.length && depth) {
        const c = this.src[j];
        if (c === '\\') { j += 2; continue; }
        if (c === '{') depth++;
        else if (c === '}') depth--;
        j++;
      }
      if (depth) this.err('Unclosed {', t);
      while (this.peek() && this.peek().p < j) this.i++;
      return this.src.slice(t.e, j - 1);
    }

    /* a sequence of atoms until stop(token) is true (the stop token is not consumed) */
    seq(stop, st) {
      const items = [];
      for (;;) {
        const t = this.peek();
        if (!t || stop(t)) break;
        if (t.t === 'cmd' && (t.v === 'displaystyle' || t.v === 'textstyle' || t.v === 'scriptstyle')) {
          this.i++;
          const rest = this.seq(stop, st);
          items.push({ m: '<mstyle displaystyle="' + (t.v === 'displaystyle') + '"' +
                          (t.v === 'scriptstyle' ? ' scriptlevel="1"' : '') + '>' + mrow(rest) + '</mstyle>' });
          break;
        }
        const a = this.scripted(st);
        if (!a) continue;
        // "\Delta x" is one symbol (a change in x): one element, one key, so it can be
        // highlighted and clicked as a whole
        const prev = items[items.length - 1];
        if (prev && prev.src === '\\Delta' && !prev.merged && a.k && /^(\\[a-zA-Z]+|[A-Za-z])/.test(a.k) && !a.fn) {
          items[items.length - 1] = { m: '<mrow data-k="' + escA(norm('\\Delta' + a.k)) + '">' + prev.m + a.m + '</mrow>', src: '\\Delta ' + a.src, k: norm('\\Delta' + a.k), merged: true };
          continue;
        }
        items.push(a);
      }
      return items;
    }

    /* rows and cells for tables: cells split by &, rows by \\ */
    rows(stop, st) {
      const rows = [[]];
      for (;;) {
        const cell = this.seq(t => stop(t) || t.t === '&' || this.isCmd(t, '\\') || this.isCmd(t, 'cr'), st);
        rows[rows.length - 1].push(cell);
        const t = this.peek();
        if (!t || stop(t)) break;
        this.i++;
        if (t.t === '&') continue;
        const o = this.peek();
        if (o && o.t === 'char' && o.v === '[') { while (this.peek() && !(this.peek().t === 'char' && this.peek().v === ']')) this.i++; this.i++; }
        rows.push([]);
      }
      const last = rows[rows.length - 1];
      if (rows.length > 1 && last.length === 1 && last[0].length === 0) rows.pop();
      return rows;
    }

    /* an atom with its sub/superscripts and primes */
    scripted(st) {
      const t0 = this.peek();
      const base = this.atom(st);
      if (!base) return null;
      let sub = null, sup = null, primes = 0;
      for (;;) {
        const t = this.peek();
        if (!t) break;
        if (t.t === '_' && !sub) { this.i++; sub = this.arg(st, true); continue; }
        if (t.t === '^' && !sup) { this.i++; sup = this.arg(st, true); continue; }
        if (t.t === '\'') { this.i++; primes++; continue; }
        if (t.t === 'cmd' && (t.v === 'limits' || t.v === 'nolimits')) { this.i++; base.limits = t.v === 'limits'; continue; }
        break;
      }
      if (primes) {
        const pr = { m: '<mo>' + ['′', '″', '‴', '⁗'][Math.min(primes, 4) - 1] + '</mo>' };
        sup = sup ? { m: '<mrow>' + pr.m + sup.m + '</mrow>' } : pr;
      }
      if (!sub && !sup) { if (base.k == null && base.src != null && !base.fn && !base.movable) base.k = norm(base.src); return base; }
      const end = this.peek() ? this.peek().p : this.src.length;
      const src = this.src.slice(t0.p, end);
      // x′ is its own symbol, distinct from x; x² is still x
      const key = base.src == null ? null : (sub ? norm(base.src + '_' + sub.src) : norm(base.src)) + '\''.repeat(primes);
      const k = (sub || primes) && key != null ? ' data-k="' + escA(key) + '"' : '';
      const over = base.limits === true || (base.limits !== false && base.movable);
      let m;
      if (over) {
        if (sub && sup) m = '<munderover>' + base.m + sub.m + sup.m + '</munderover>';
        else if (sub) m = '<munder>' + base.m + sub.m + '</munder>';
        else m = '<mover>' + base.m + sup.m + '</mover>';
      } else if (sub && sup) m = '<msubsup' + k + '>' + base.m + sub.m + sup.m + '</msubsup>';
      else if (sub) m = '<msub' + k + '>' + base.m + sub.m + '</msub>';
      else m = '<msup' + k + '>' + base.m + sup.m + '</msup>';
      return { m, src, fn: base.fn, k: base.fn || base.movable ? null : key };
    }

    /* one argument: a {group} or a single atom without scripts */
    arg(st, script) {
      const t = this.peek();
      if (!t) this.err('Missing argument');
      if (t.t === '{') {
        this.i++;
        const inner = this.seq(x => x.t === '}', st);
        const close = this.expect('}');
        return { m: mrow(inner) || '<mrow></mrow>', src: this.src.slice(t.e, close.p) };
      }
      if (t.t === 'num' && t.v.length > 1) {
        if (script) {                                       // x^10 means x^{10} here
          this.i++;
          return { m: '<mn>' + t.v + '</mn>', src: t.v };
        }
        // \frac12 : an argument is one digit, as in TeX; the rest stays for later
        const d = t.v[0];
        t.v = t.v.slice(1); t.p += 1;
        return { m: '<mn>' + d + '</mn>', src: d };
      }
      const a = this.atom(st);
      if (!a) this.err('Missing argument', t);
      return a;
    }

    atom(st) {
      const t = this.next();
      switch (t.t) {
        case '{': {
          const inner = this.seq(x => x.t === '}', st);
          const close = this.expect('}');
          const src = this.src.slice(t.e, close.p);
          return { m: mrow(inner) || '<mrow></mrow>', src, group: true };
        }
        case 'num': {
          if (st.font && st.font !== 'rm' && st.font !== 'text') return { m: '<mn>' + t.v.split('').map(c => mapChar(c, st.font)).join('') + '</mn>', src: t.v };
          return { m: '<mn>' + t.v + '</mn>', src: t.v };
        }
        case 'letter': return this.letter(t, st);
        case 'char': return this.char(t.v, st);
        case '\'': return { m: '<mo>′</mo>' };
        case '^': case '_':
          this.i--;                      // a script with nothing before it: ^{14}C
          return { m: '<mrow></mrow>', src: '' };
        case '}': this.err('Unexpected }', t); break;
        case '&': this.err('Unexpected &', t); break;
        case 'cmd': return this.command(t, st);
      }
      return null;
    }

    letter(t, st) {
      if (st.font === 'rm' || st.font === 'text') {
        // upright: a run of adjacent letters is one identifier (m/s, kg, sin)
        let s = t.v, e = t.e;
        while (this.peek() && this.peek().t === 'letter' && this.peek().p === e) { s += this.peek().v; e = this.peek().e; this.i++; }
        return { m: '<mi mathvariant="normal" data-k="' + escA(s) + '">' + esc(s) + '</mi>', src: s };
      }
      if (st.font) return { m: '<mi data-k="' + escA(t.v) + '">' + esc(mapChar(t.v, st.font)) + '</mi>', src: t.v };
      const up = /[Α-Ω]/.test(t.v);
      return { m: '<mi' + (up ? ' mathvariant="normal"' : '') + ' data-k="' + escA(t.v) + '">' + esc(t.v) + '</mi>', src: t.v };
    }

    char(c, st) {
      switch (c) {
        case '(': case '[': return { m: '<mo stretchy="false">' + c + '</mo>', open: true };
        case ')': case ']': return { m: '<mo stretchy="false">' + c + '</mo>' };
        case '|': return { m: '<mo stretchy="false">|</mo>' };
        case '-': return { m: '<mo>−</mo>' };
        case '*': return { m: '<mo>∗</mo>' };
        case '<': return { m: '<mo>&lt;</mo>' };
        case '>': return { m: '<mo>&gt;</mo>' };
        case '~': return { m: '<mspace width="0.333em"></mspace>', space: true };
        case '/': return { m: '<mo form="infix" lspace="0" rspace="0">/</mo>' };
        case '.': return { m: '<mo form="infix" lspace="0" rspace="0">.</mo>' };
        case '°': return { m: '<mi mathvariant="normal">°</mi>' };
        case '%': return { m: '<mi mathvariant="normal">%</mi>' };
        default:
          if (st.font === 'rm' || st.font === 'text') return { m: '<mo>' + esc(c) + '</mo>' };
          return { m: '<mo>' + esc(c) + '</mo>' };
      }
    }

    delim() {
      const t = this.next();
      if (!t) this.err('Missing delimiter');
      if (t.t === 'char') {
        if (t.v === '.') return '';
        if (t.v === '<') return '⟨';
        if (t.v === '>') return '⟩';
        return esc(t.v);
      }
      if (t.t === 'cmd') {
        if (DELIMS[t.v] != null) return DELIMS[t.v];
      }
      this.err('Bad delimiter', t);
    }

    command(t, st) {
      const v = t.v;
      if (GREEK[v]) {
        const up = /^[A-Z]/.test(v);
        const ch = st.font && st.font !== 'rm' ? mapChar(GREEK[v], st.font) : GREEK[v];
        return { m: '<mi' + (up && !st.font ? ' mathvariant="normal"' : '') + ' data-k="' + escA('\\' + v) + '">' + ch + '</mi>', src: '\\' + v };
      }
      if (SYM_MI[v]) return { m: '<mi mathvariant="normal" data-k="' + escA('\\' + v) + '">' + SYM_MI[v] + '</mi>', src: '\\' + v };
      if (SYM_MO[v]) {
        const ch = SYM_MO[v];
        const open = v === 'langle' || v === 'lfloor' || v === 'lceil' || v === 'lvert' || v === 'lVert';
        const fence = open || v === 'rangle' || v === 'rfloor' || v === 'rceil' || v === 'rvert' || v === 'rVert';
        return { m: '<mo' + (fence ? ' stretchy="false"' : '') + '>' + esc(ch) + '</mo>', open, src: '\\' + v };
      }
      if (BIG[v]) {
        const integ = INTEGRALS.has(v);
        return { m: '<mo largeop="true"' + (integ ? ' movablelimits="false"' : ' movablelimits="true"') + '>' + BIG[v] + '</mo>',
                 movable: !integ, src: '\\' + v };
      }
      if (FUNCSET.has(v)) return { m: '<mi mathvariant="normal">' + v + '</mi>', fn: true, src: '\\' + v };
      if (LIMSET.has(v)) {
        const word = v === 'limsup' ? 'lim sup' : v === 'liminf' ? 'lim inf' : v;
        return { m: '<mo movablelimits="true" form="prefix" lspace="0">' + word + '</mo>', movable: true, fn: true, src: '\\' + v };
      }
      if (v in SPACES) {
        if (v === '!' || v === 'negthinspace') return { m: '<mspace width="0"></mspace>', space: true };
        return { m: '<mspace width="' + SPACES[v] + 'em"></mspace>', space: true };
      }
      if (FONTCMD[v]) {
        const a = this.arg(Object.assign({}, st, { font: FONTCMD[v] }));
        return { m: '<mrow data-k="' + escA(norm('\\' + v + a.src)) + '">' + a.m + '</mrow>', src: '\\' + v + '{' + a.src + '}' };
      }
      switch (v) {
        case 'frac': case 'dfrac': case 'tfrac': case 'cfrac': {
          const a = this.arg(st), b = this.arg(st);
          const ds = v === 'dfrac' || v === 'cfrac' ? ' displaystyle="true"' : v === 'tfrac' ? ' displaystyle="false"' : '';
          const m = '<mfrac>' + a.m + b.m + '</mfrac>';
          return { m: ds ? '<mstyle' + ds + '>' + m + '</mstyle>' : m, src: '\\frac{' + a.src + '}{' + b.src + '}' };
        }
        case 'binom': case 'dbinom': case 'tbinom': {
          const a = this.arg(st), b = this.arg(st);
          return { m: '<mrow><mo>(</mo><mfrac linethickness="0">' + a.m + b.m + '</mfrac><mo>)</mo></mrow>' };
        }
        case 'sqrt': {
          const o = this.peek();
          if (o && o.t === 'char' && o.v === '[') {
            this.i++;
            const idx = this.seq(x => x.t === 'char' && x.v === ']', st);
            this.i++;
            const a = this.arg(st);
            return { m: '<mroot>' + a.m + mrow(idx) + '</mroot>' };
          }
          const a = this.arg(st);
          return { m: '<msqrt>' + a.m + '</msqrt>', src: '\\sqrt{' + a.src + '}' };
        }
        case 'left': {
          const d1 = this.delim();
          let h = d1 ? '<mo stretchy="true" form="prefix" fence="true">' + d1 + '</mo>' : '';
          for (;;) {
            const inner = this.seq(x => this.isCmd(x, 'right') || this.isCmd(x, 'middle'), st);
            h += mrow(inner) || '';
            const tt = this.next();
            if (!tt) this.err('\\left without \\right', t);
            if (tt.v === 'middle') { h += '<mo stretchy="true" fence="true" lspace="0.1em" rspace="0.1em">' + this.delim() + '</mo>'; continue; }
            const d2 = this.delim();
            if (d2) h += '<mo stretchy="true" form="postfix" fence="true">' + d2 + '</mo>';
            break;
          }
          return { m: '<mrow>' + h + '</mrow>' };
        }
        case 'right': case 'middle': this.err('\\' + v + ' without \\left', t); break;
        case 'big': case 'Big': case 'bigg': case 'Bigg':
        case 'bigl': case 'Bigl': case 'biggl': case 'Biggl':
        case 'bigr': case 'Bigr': case 'biggr': case 'Biggr':
        case 'bigm': case 'Bigm': {
          const sz = BIGSIZE[v.replace(/[lrm]$/, '')];
          const d = this.delim();
          return { m: '<mo stretchy="true" symmetric="true" minsize="' + sz + 'em" maxsize="' + sz + 'em">' + (d || '') + '</mo>', open: /l$/.test(v) };
        }
        case 'overline': case 'overrightarrow': case 'overleftarrow': case 'overleftrightarrow': case 'overbrace': case 'widehat': case 'widetilde': {
          const a = this.arg(st);
          return { m: '<mover' + (v === 'overbrace' ? '' : ' accent="true"') + '>' + a.m + '<mo stretchy="true">' + WIDE[v] + '</mo></mover>',
                   src: '\\' + v + '{' + a.src + '}', movable: v === 'overbrace', limits: v === 'overbrace' ? true : undefined };
        }
        case 'underline': case 'underbrace': case 'underrightarrow': case 'underleftarrow': {
          const a = this.arg(st);
          return { m: '<munder' + (v === 'underbrace' ? '' : ' accentunder="true"') + '>' + a.m + '<mo stretchy="true">' + UNDER[v] + '</mo></munder>',
                   movable: v === 'underbrace', limits: v === 'underbrace' ? true : undefined };
        }
        case 'xrightarrow': case 'xleftarrow': case 'xleftrightarrow': case 'xRightarrow': case 'xrightleftharpoons': {
          const o = this.peek();
          let under = null;
          if (o && o.t === 'char' && o.v === '[') { this.i++; under = mrow(this.seq(x => x.t === 'char' && x.v === ']', st)); this.i++; }
          const a = this.arg(st);
          const ch = { xrightarrow: '→', xleftarrow: '←', xleftrightarrow: '↔', xRightarrow: '⇒', xrightleftharpoons: '⇌' }[v];
          const arrow = '<mo stretchy="true" lspace="0.28em" rspace="0.28em">' + ch + '</mo>';
          const above = '<mpadded lspace="0.4em" width="+0.8em"><mstyle scriptlevel="1">' + a.m + '</mstyle></mpadded>';
          return { m: under ? '<munderover>' + arrow + '<mstyle scriptlevel="1">' + under + '</mstyle>' + above + '</munderover>' : '<mover>' + arrow + above + '</mover>' };
        }
        case 'overset': case 'stackrel': case 'underset': {
          const a = this.arg(st), b = this.arg(st);
          const tag = v === 'underset' ? 'munder' : 'mover';
          return { m: '<' + tag + '>' + b.m + '<mrow>' + a.m + '</mrow></' + tag + '>' };
        }
        case 'text': case 'textrm': case 'textit': case 'mbox': case 'textnormal': case 'textsf': case 'texttt': {
          const raw = this.rawBraced().replace(/\\([%$&#_{}])/g, '$1');
          const s = esc(raw).replace(/^ /, ' ').replace(/ $/, ' ');
          return { m: '<mtext data-k="' + escA(norm(raw)) + '"' + (v === 'textit' ? ' style="font-style:italic"' : '') + '>' + s + '</mtext>', src: raw };
        }
        case 'mathrm': case 'mathnormal': case 'rm': case 'mathup': {
          const a = this.arg(Object.assign({}, st, { font: 'rm' }));
          const src = '\\mathrm{' + a.src + '}';
          return { m: '<mrow data-k="' + escA(norm(src)) + '">' + a.m + '</mrow>', src };
        }
        case 'operatorname': {
          const raw = this.rawBraced();
          return { m: '<mi mathvariant="normal">' + esc(raw.replace(/\\,/g, '')) + '</mi>', fn: true, src: raw };
        }
        case 'color': case 'textcolor': {
          const c = this.rawBraced().replace(/[^#A-Za-z0-9-]/g, '');
          const a = this.arg(st);
          const col = /^#|^[a-z]+$/i.test(c) && !c.startsWith('--') ? c : 'var(--' + c.replace(/^-+/, '') + ')';
          return { m: '<mrow style="color:' + col + '">' + a.m + '</mrow>', src: a.src };
        }
        case 'hl': {                       // highlight used by worked solutions
          const a = this.arg(st);
          return { m: '<mrow class="tx-hl">' + a.m + '</mrow>', src: a.src };
        }
        case 'class': {
          const c = this.rawBraced().replace(/[^A-Za-z0-9 _-]/g, '');
          const a = this.arg(st);
          return { m: '<mrow class="' + c + '">' + a.m + '</mrow>', src: a.src };
        }
        case 'boxed': case 'fbox': {
          const a = this.arg(st);
          return { m: '<mrow class="tx-box">' + a.m + '</mrow>' };
        }
        case 'cancel': case 'bcancel': case 'xcancel': {
          const a = this.arg(st);
          return { m: '<mrow class="tx-cancel">' + a.m + '</mrow>' };
        }
        case 'phantom': { const a = this.arg(st); return { m: '<mphantom>' + a.m + '</mphantom>' }; }
        case 'vphantom': case 'hphantom': case 'label': case 'tag': { this.arg(st); return null; }
        case 'nonumber': case 'notag': case 'hline': case 'limits': case 'nolimits': case 'centering': case 'noindent': return null;
        case 'hspace': case 'mspace': case 'kern': {
          const raw = this.rawBraced();
          const n = parseFloat(raw) || 0;
          const unit = /em/.test(raw) ? n : /mu/.test(raw) ? n / 18 : n / 10;
          return { m: '<mspace width="' + Math.max(0, unit) + 'em"></mspace>', space: true };
        }
        case 'not': {
          const n = this.peek();
          if (n && n.t === 'char' && n.v === '=') { this.i++; return { m: '<mo>≠</mo>' }; }
          const a = this.atom(st);
          return { m: '<mo>' + (a && a.m.replace(/<[^>]+>/g, '')) + '̸</mo>' };
        }
        case 'pmod': {
          const a = this.arg(st);
          return { m: '<mrow><mspace width="0.5em"></mspace><mo>(</mo><mi mathvariant="normal">mod</mi><mspace width="0.3333em"></mspace>' + a.m + '<mo>)</mo></mrow>' };
        }
        case 'bmod': case 'mod': return { m: '<mo lspace="0.2778em" rspace="0.2778em">mod</mo>' };
        case '{': return { m: '<mo stretchy="false">{</mo>', open: true };
        case '}': return { m: '<mo stretchy="false">}</mo>' };
        case '|': return { m: '<mo stretchy="false">‖</mo>' };
        case '%': case '$': case '#': case '&': case '_': return { m: '<mi mathvariant="normal">' + esc(v) + '</mi>' };
        case '\\': case 'cr': case 'newline': return null;
        case 'begin': return this.env(st, t);
        case 'end': this.err('\\end without \\begin', t); break;
        case 'unit': case 'si': case 'mathunit': {        // \unit{m/s^2}: an upright unit
          const a = this.arg(Object.assign({}, st, { font: 'rm' }));
          return { m: '<mrow class="tx-unit">' + a.m + '</mrow>', src: a.src };
        }
        case 'ce': {                                       // light chemistry: \ce{H2O}
          return this.chem(this.rawBraced());
        }
        case 'dv': case 'odv': case 'pdv': {               // \dv{f}{x} -> df/dx, \dv[2]{f}{x}, \pdv{u}{x}
          let order = null;
          const o = this.peek();
          if (o && o.t === 'char' && o.v === '[') { this.i++; order = mrow(this.seq(x => x.t === 'char' && x.v === ']', st)); this.i++; }
          const d = v === 'pdv' ? '<mi mathvariant="normal">∂</mi>' : '<mi mathvariant="normal">d</mi>';
          const dn = order ? '<msup>' + d + order + '</msup>' : d;
          const a = this.arg(st), b = this.arg(st);
          return { m: '<mfrac><mrow>' + dn + a.m + '</mrow><mrow>' + d + (order ? '<msup>' + b.m + order + '</msup>' : b.m) + '</mrow></mfrac>' };
        }
        case 'dd': return { m: '<mi mathvariant="normal">d</mi>' };
        case 'e': return { m: '<mi mathvariant="normal">e</mi>' };
      }
      if (ACCENTS[v]) {
        const a = this.arg(st);
        const stretch = v === 'widehat' || v === 'widetilde' ? 'true' : 'false';
        return { m: '<mover accent="true" data-k="' + escA(norm('\\' + v + a.src)) + '" class="tx-acc tx-' + v + '">' + a.m + '<mo stretchy="' + stretch + '">' + ACCENTS[v] + '</mo></mover>',
                 src: '\\' + v + '{' + a.src + '}' };
      }
      this.err('Unknown command \\' + v, t);
    }

    env(st, t) {
      const name = this.rawBraced();
      let spec = null;
      if (name === 'array' || name === 'alignat' || name === 'alignedat') spec = this.rawBraced();
      const rows = this.rows(x => this.isCmd(x, 'end'), st);
      if (!this.isCmd(this.next(), 'end')) this.err('Missing \\end{' + name + '}', t);
      const endName = this.rawBraced();
      if (endName !== name) this.err('\\begin{' + name + '} ended by \\end{' + endName + '}', t);
      const base = name.replace(/\*$/, '');
      const fences = { pmatrix: ['(', ')'], bmatrix: ['[', ']'], Bmatrix: ['{', '}'], vmatrix: ['|', '|'], Vmatrix: ['‖', '‖'], matrix: null, smallmatrix: null };
      if (base in fences) {
        const tbl = table(rows, () => 'center', 'tx-matrix');
        const f = fences[base];
        return { m: f ? '<mrow><mo stretchy="true" fence="true" form="prefix">' + f[0] + '</mo>' + tbl + '<mo stretchy="true" fence="true" form="postfix">' + f[1] + '</mo></mrow>' : tbl };
      }
      if (base === 'cases' || base === 'dcases' || base === 'rcases') {
        const tbl = table(rows, () => 'left', 'tx-cases');
        return { m: base === 'rcases'
          ? '<mrow>' + tbl + '<mo stretchy="true" fence="true" form="postfix">}</mo></mrow>'
          : '<mrow><mo stretchy="true" fence="true" form="prefix">{</mo>' + tbl + '</mrow>' };
      }
      if (base === 'aligned' || base === 'align' || base === 'split' || base === 'alignat' || base === 'alignedat' || base === 'eqnarray') {
        return { m: alignedTable(rows) };
      }
      if (base === 'gathered' || base === 'gather' || base === 'multline' || base === 'equation') {
        return { m: table(rows, () => 'center', 'tx-gathered') };
      }
      if (base === 'array') {
        // column letters, and a | before a column draws a rule there (augmented matrices)
        const cols = [], bars = new Set();
        for (const ch of (spec || '')) { if (ch === '|') bars.add(cols.length); else if ('lcr'.includes(ch)) cols.push(ch); }
        const al = j => ({ l: 'left', c: 'center', r: 'right' })[cols[j]] || 'center';
        const rule = j => bars.has(j) && j > 0 ? ';border-left:1.2px solid currentColor' : '';
        return { m: table(rows, j => al(j) + rule(j), 'tx-array') };
      }
      this.err('Unknown environment ' + name, t);
    }

    /* \ce{2H2 + O2 -> 2H2O}, \ce{Fe^3+}, \ce{SO4^2-} : enough for reactions and ions */
    chem(raw) {
      let h = '';
      const s = raw.replace(/<->|<=>/g, '⇌').replace(/->/g, '→').replace(/<-/g, '←');
      const parts = s.match(/⇌|→|←|\+(?=\s)|\s+|[A-Z][a-z]?|\(|\)|\[|\]|\^[0-9]*[+-]?|[0-9]+|[a-z]+|./g) || [];
      let prevElem = false;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (/^\s+$/.test(p)) { prevElem = false; continue; }
        if (p === '→' || p === '⇌' || p === '←') { h += '<mo lspace="0.35em" rspace="0.35em">' + p + '</mo>'; prevElem = false; continue; }
        if (p === '+' && !prevElem) { h += '<mo>+</mo>'; continue; }
        if (/^\^/.test(p)) { h += '<msup><mrow></mrow><mn>' + esc(p.slice(1).replace('-', '−')) + '</mn></msup>'; continue; }
        if (/^[0-9]+$/.test(p)) { h += prevElem ? '<msub><mrow></mrow><mn>' + p + '</mn></msub>' : '<mn>' + p + '</mn>'; continue; }
        if (/^[A-Z][a-z]?$/.test(p)) { h += '<mi mathvariant="normal">' + p + '</mi>'; prevElem = true; continue; }
        if (p === ')' || p === ']') { h += '<mo stretchy="false">' + p + '</mo>'; prevElem = true; continue; }
        if (p === '(' || p === '[') { h += '<mo stretchy="false">' + p + '</mo>'; prevElem = false; continue; }
        if (p === '+' || p === '-') { h += '<mo>' + (p === '-' ? '−' : '+') + '</mo>'; prevElem = false; continue; }
        h += '<mi mathvariant="normal">' + esc(p) + '</mi>'; prevElem = false;
      }
      return { m: '<mrow class="tx-ce">' + h + '</mrow>' };
    }
  }

  function table(rows, align, cls) {
    let h = '<mtable class="' + cls + '">';
    for (const r of rows) {
      h += '<mtr>';
      r.forEach((c, j) => { h += '<mtd style="text-align:' + align(j) + '">' + (mrow(c) || '') + '</mtd>'; });
      h += '</mtr>';
    }
    return h + '</mtable>';
  }

  /* aligned: pairs of columns, right then left, the second starting with its relation */
  function alignedTable(rows) {
    let h = '<mtable class="tx-aligned" displaystyle="true">';
    for (const r of rows) {
      h += '<mtr>';
      r.forEach((c, j) => {
        const right = j % 2 === 0;
        const pad = right ? (j ? 'padding:0.2em 0 0.2em 1.5em' : 'padding:0.2em 0') : 'padding:0.2em 0';
        // an empty row in front keeps a leading "=" an infix operator with its spacing
        h += '<mtd style="text-align:' + (right ? 'right' : 'left') + ';' + pad + '">' + (right ? '' : '<mrow></mrow>') + (mrow(c) || '') + '</mtd>';
      });
      h += '</mtr>';
    }
    return h + '</mtable>';
  }

  function render(src, display) {
    const p = new Parser(String(src), !!display);
    const rows = p.rows(() => false, {});
    if (p.i < p.toks.length) p.err('Unexpected ' + p.peek().v, p.peek());
    let body;
    if (rows.length === 1 && rows[0].length === 1) body = mrow(rows[0][0]) || '<mrow></mrow>';
    else if (rows.some(r => r.length > 1)) body = alignedTable(rows);
    else body = table(rows, () => 'center', 'tx-gathered');
    return '<math' + (display ? ' display="block"' : '') + '>' + body + '</math>';
  }

  /* The key a symbol's TeX gets inside a rendered formula (its data-k). Parsed rather
     than just stripped, so "X_\text{s}", "X_{\text{s}}" and "X_{s}" all agree with
     the formula they appear in. */
  const keys = new Map();
  H.texKey = function (tex) {
    let k = keys.get(tex);
    if (k != null) return k;
    k = norm(String(tex));
    try {
      const p = new Parser(String(tex), false);
      const items = p.seq(() => false, {});
      if (items.length === 1 && items[0].k) k = items[0].k;
    } catch (e) { /* keep the plain form */ }
    keys.set(tex, k);
    return k;
  };

  const cache = new Map();
  H.tex = function (src, display) {
    const key = (display ? 'D' : 'I') + src;
    let r = cache.get(key);
    if (r == null) {
      r = render(src, display);
      if (cache.size > 4000) cache.clear();
      cache.set(key, r);
    }
    return r;
  };
  H.texSafe = function (src, display) {
    try { return H.tex(src, display); }
    catch (e) {
      if (H.texErrors) H.texErrors.push({ src, error: e.message });
      return '<span class="tex-err" title="' + escA(e.message) + '">' + esc(src) + '</span>';
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
