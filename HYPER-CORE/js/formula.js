/* HYPER-CORE · formula.js
 *
 * A formula as the content declares it, made into something that can be solved
 * for any of its variables, plotted, and turned into practice problems.
 *
 *   {
 *     name: 'Range on level ground',
 *     expr: 'R = v0^2*sin(2*theta)/g',            // one equation, any shape
 *     tex:  'R = \\frac{v_0^2 \\sin 2\\theta}{g}',  // optional, drawn from expr if absent
 *     vars: {
 *       R:     { name: 'range', q: 'length', unit: 'm' },
 *       v0:    { name: 'launch speed', q: 'speed', unit: 'm/s', value: 20 },
 *       theta: { name: 'launch angle', q: 'angle', unit: '°', value: 45, min: 0, max: 90 },
 *       g:     { const: 'g' }
 *     },
 *     solveFor: 'R',          // the unknown the card opens with (default: a lone left-hand side)
 *     note: 'Lands at the height it was launched from; no air resistance.',
 *     stories: { R: 'A ball is kicked at {v0}, {theta} above the ground. How far away does it land?' }
 *   }
 *
 * Values, min and max are written in the variable's own unit; everything inside is SI.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const X = () => H.expr, U = () => H.units;

  const ALIAS = { deg: '°', degree: '°', degrees: '°', degC: '°C', degF: '°F', ohm: 'Ω', ohms: 'Ω', kohm: 'kΩ', Mohm: 'MΩ',
                  'm/s^2': 'm/s²', 'm^2': 'm²', 'm^3': 'm³', 'cm^3': 'cm³', 'cm^2': 'cm²', 'kg*m^2': 'kg·m²', 'kg m^2': 'kg·m²',
                  'N*m': 'N·m', 'N m': 'N·m', 'N*s': 'N·s', 'kg*m/s': 'kg·m/s', 'kg/m^3': 'kg/m³', 'g/cm^3': 'g/cm³',
                  'W/m^2': 'W/m²', 'rad/s^2': 'rad/s²', 'J/(kg*K)': 'J/(kg·K)', 'J/(mol*K)': 'J/(mol·K)', 'W/(m*K)': 'W/(m·K)',
                  'Ohm': 'Ω', 'Ω*m': 'Ω·m', 'ohm*m': 'Ω·m', 'ohm m': 'Ω·m', 'A*m^2': 'A·m²', 'T*m^2': 'T·m²', 'Pa*s': 'Pa·s',
                  'ang': 'Å', 'angstrom': 'Å', 'years': 'yr', 'year': 'yr', 'days': 'day', 'hr': 'h', 'sec': 's', 'lbs': 'lb' };

  /* the quantity and the unit a variable is shown in */
  function resolveUnit(v) {
    const u = U();
    let unit = v.unit != null ? String(v.unit) : null;
    if (unit != null && ALIAS[unit]) unit = ALIAS[unit];
    if (unit && /^u./.test(unit) && !u.UNIT_INDEX[unit] && u.UNIT_INDEX['µ' + unit.slice(1)]) unit = 'µ' + unit.slice(1);
    let q = v.q;
    if (!q && unit != null) q = u.UNIT_INDEX[unit] || null;
    if (q && !u.Q[q]) return { q: null, unit: unit || '', fixed: true, error: 'unknown quantity "' + q + '"' };
    if (q && unit == null) unit = u.Q[q].units[0][0];
    if (q && !u.unitRow(q, unit)) return { q, unit, fixed: true, error: 'unit "' + unit + '" is not a unit of ' + q };
    return { q, unit: unit || '', fixed: !q };
  }

  class Formula {
    constructor(def, node) {
      this.def = def;
      this.node = node;
      this.name = def.name || 'Formula';
      this.errors = [];
      try {
        // declared names win over functions of the same name (a variable called gamma, sign, deg...)
        this.eq = X().parseEq(def.expr, { known: new Set(Object.keys(def.vars || {})) });
        if (!this.eq.r) throw new Error('needs an "=" sign');
      } catch (e) {
        this.errors.push('expression "' + def.expr + '": ' + e.message);
        this.eq = null;
        this.vars = [];
        return;
      }
      const used = new Set([...X().vars(this.eq.l), ...X().vars(this.eq.r)]);
      this.vars = [];
      this.byName = {};
      const decl = def.vars || {};
      for (const name of Object.keys(decl)) {
        if (!used.has(name)) { this.errors.push('variable "' + name + '" is declared but not in the expression'); continue; }
        this.addVar(name, decl[name]);
      }
      for (const name of used) if (!this.byName[name]) {
        this.errors.push('"' + name + '" is used in the expression but not declared');
        this.addVar(name, { name });
      }
      // the unknown the card opens with
      let t = def.solveFor;
      if (!t && this.eq.l.t === 'var') t = this.eq.l.n;
      if (!t || !this.byName[t]) t = this.vars.find(v => !v.isConst) ? this.vars.find(v => !v.isConst).id : this.vars[0].id;
      this.target = t;
      this.explicit = {};
      this.residual = (() => {
        const l = X().compile(this.eq.l), r = X().compile(this.eq.r);
        return s => l(s) - r(s);
      })();
      // default values: compute the target from the others so the card starts consistent
      const scope = this.defaults();
      const res = this.solve(this.target, scope);
      if (res.ok) this.byName[this.target].def = res.value;
    }

    addVar(name, d) {
      if (name === 'e' || name === 'pi') this.errors.push('"' + name + '" is reserved for the mathematical constant; call the variable something else (qe for the elementary charge)');
      let base = d;
      if (d.const) {
        const c = U().C[d.const];
        if (!c) this.errors.push('unknown constant "' + d.const + '"');
        else base = Object.assign({ name: c.name, tex: c.tex, q: c.q, unit: c.q ? c.u : c.u, value: c.v }, d);
      }
      const ru = resolveUnit(base);
      if (ru.error) this.errors.push('variable "' + name + '": ' + ru.error);
      const toSI = x => (x == null || !ru.q) ? x : U().toSI(x, ru.q, ru.unit);
      const v = {
        id: name,
        name: base.name || name,
        tex: base.tex || X().autoTex(name),
        q: ru.q,
        unit: ru.unit,
        fixedUnit: ru.fixed,
        isConst: !!d.const || !!base.fixed,
        constId: d.const || null,
        signed: !!base.signed,
        int: !!base.int,
        def: toSI(base.value),
        min: toSI(base.min),
        max: toSI(base.max),
        step: base.step,
        hint: base.hint || '',
        log: !!base.log
      };
      if (ru.q === 'temperature' && base.min == null) v.min = 0;
      this.vars.push(v);
      this.byName[name] = v;
    }

    /* SI values for every variable: the declared value, else something reasonable */
    defaults() {
      const s = {};
      for (const v of this.vars) {
        if (v.def != null) s[v.id] = v.def;
        else if (v.min != null && v.max != null) s[v.id] = (v.min + v.max) / 2;
        else s[v.id] = v.q ? U().toSI(1, v.q, v.unit) : 1;
      }
      return s;
    }

    texOf(name) { const v = this.byName[name]; return v ? v.tex : null; }

    get displayTex() {
      if (this.def.tex) return this.def.tex;
      if (!this.eq) return this.def.expr;
      const t = n => this.texOf(n);
      return X().toTex(this.eq.l, t) + ' = ' + X().toTex(this.eq.r, t);
    }

    /* the explicit form for `name`, when it can be isolated (cached) */
    isolated(name) {
      if (!(name in this.explicit)) {
        let tree = null;
        try { tree = this.eq ? X().isolate(this.eq, name) : null; } catch (e) { tree = null; }
        this.explicit[name] = tree ? { tree, fn: X().compile(tree) } : null;
      }
      return this.explicit[name];
    }

    rearrangedTex(name) {
      const iso = this.isolated(name);
      if (!iso) return null;
      return this.texOf(name) + ' = ' + X().toTex(iso.tree, n => this.texOf(n));
    }

    /* Solve for `name` given the SI values in scope (scope[name] is used as the guess).
       -> {ok, value, all:[...], method, reason} */
    solve(name, scope) {
      const v = this.byName[name];
      if (!v || !this.eq) return { ok: false, reason: 'no such variable' };
      const inRange = x => (v.min == null || x >= v.min - 1e-12 * Math.abs(v.min || 1)) && (v.max == null || x <= v.max + 1e-12 * Math.abs(v.max || 1));
      const acceptable = x => Number.isFinite(x) && (v.signed || x >= 0) && inRange(x);
      const iso = this.isolated(name);
      let primary = null;
      if (iso) {
        const val = iso.fn(scope);
        if (Number.isFinite(val)) primary = val;
      }
      // numeric roots: when there is no explicit form, or to find the other branches
      let all = [];
      const bounded = v.min != null && v.max != null;
      if (!iso || bounded || v.signed) {
        const s = Object.assign({}, scope);
        const f = x => { s[name] = x; return this.residual(s); };
        try {
          all = X().roots(f, {
            min: bounded ? v.min : undefined, max: bounded ? v.max : undefined,
            guess: primary != null ? primary : scope[name], positive: !v.signed, log: v.log
          });
        } catch (e) { all = []; }
      }
      if (primary != null) {
        if (!all.some(r => Math.abs(r - primary) <= 1e-7 * Math.max(1, Math.abs(r)))) all.unshift(primary);
        else all = [primary].concat(all.filter(r => Math.abs(r - primary) > 1e-7 * Math.max(1, Math.abs(r))));
      }
      let good = all.filter(acceptable);
      if (v.int) {
        const whole = good.filter(x => Math.abs(x - Math.round(x)) < 1e-6);
        // from measured values a count rarely comes out exact: give it, and the whole number it is closest to
        if (!whole.length && good.length) {
          const x = good[0];
          return { ok: true, value: x, all: good, method: iso ? 'explicit' : 'numeric', note: 'not a whole number: the nearest is ' + Math.round(x) };
        }
        good = whole;
      }
      if (!good.length) {
        const why = all.length ? (all.every(x => x < 0) && !v.signed ? 'the only solution is negative' : 'the solution falls outside the allowed range')
                               : (iso ? 'no real solution for these values' : 'no solution found for these values');
        return { ok: false, reason: why, all };
      }
      return { ok: true, value: good[0], all: good, method: iso ? 'explicit' : 'numeric' };
    }

    /* ---------------------------------------------------------------- practice */

    /* A numeric problem: every variable but one given, find that one.
       opts: {seed, unknown, mixedUnits} */
    problem(opts) {
      opts = opts || {};
      const rnd = H.util.rng(opts.seed != null ? opts.seed : (Math.random() * 1e9) | 0);
      const cands = this.vars.filter(v => !v.isConst);
      const pool = (this.def.practice && this.def.practice.unknowns) ? this.def.practice.unknowns.map(n => this.byName[n]).filter(Boolean) : cands;
      if (!pool.length) return null;
      for (let attempt = 0; attempt < 40; attempt++) {
        const unk = opts.unknown ? this.byName[opts.unknown] : pool[Math.floor(rnd() * pool.length)];
        const s = {};
        const given = [];
        for (const v of this.vars) {
          if (v === unk) continue;
          let x;
          const base = v.def != null ? v.def : 1;
          if (v.isConst) x = base;
          else if (v.min != null && v.max != null) {
            const lo = v.min + 0.08 * (v.max - v.min), hi = v.max - 0.08 * (v.max - v.min);
            x = lo + rnd() * (hi - lo);
          } else x = base * Math.pow(10, (rnd() - 0.5) * 0.6) * (v.signed && rnd() < 0.25 ? -1 : 1);   // ×0.5 … ×2
          // nice numbers in the unit the reader sees
          let unit = v.unit;
          if (opts.mixedUnits && v.q && !v.isConst && U().Q[v.q].units.length > 1 && rnd() < 0.5) {
            const us = U().Q[v.q].units.slice(0, 5);
            unit = us[Math.floor(rnd() * us.length)][0];
          }
          if (v.q && !v.isConst) {
            let shown = U().fromSI(x, v.q, unit);
            shown = v.int ? (v.signed ? Math.round(shown) : Math.max(1, Math.round(shown))) : H.util.nice(shown, rnd() < 0.5 ? 2 : 3);
            x = U().toSI(shown, v.q, unit);
          } else if (!v.isConst) {
            x = v.int ? (v.signed ? Math.round(x) : Math.max(1, Math.round(x))) : H.util.nice(x, 3);
          }
          s[v.id] = x;
          given.push({ v, si: x, unit: v.isConst ? v.unit : unit });
        }
        s[unk.id] = unk.def != null ? unk.def : 1;
        const res = this.solve(unk.id, s);
        if (!res.ok || !Number.isFinite(res.value) || res.value === 0) continue;
        if (Math.abs(res.value) > 1e40 || Math.abs(res.value) < 1e-40) continue;
        return {
          formula: this,
          unknown: unk,
          given,
          answer: res.value,
          alternatives: res.all.slice(1),
          unit: unk.unit,
          seed: opts.seed
        };
      }
      return null;
    }

    /* "20 m/s" for a value in a unit */
    static show(si, v, unit) {
      unit = unit != null ? unit : v.unit;
      const x = v.q ? U().fromSI(si, v.q, unit) : si;
      const n = H.util.fmt(x, 4);
      if (!unit) return n;
      return n + (unit === '°' || unit === '′' || unit === '″' ? '' : ' ') + unit;
    }
    static showTex(si, v, unit) {
      unit = unit != null ? unit : v.unit;
      const x = v.q ? U().fromSI(si, v.q, unit) : si;
      const n = H.util.fmtTex(x, 4);
      if (!unit) return n;
      if (unit === '°') return n + '^{\\circ}';
      return n + '\\,' + U().unitTex(unit);
    }

    /* The text of a problem, and its worked solution as a list of {text, tex} steps */
    problemText(p) {
      const story = this.def.stories && this.def.stories[p.unknown.id];
      const givenTex = p.given.filter(g => !g.v.isConst).map(g => '$' + g.v.tex + ' = ' + Formula.showTex(g.si, g.v, g.unit) + '$');
      if (story) {
        // placeholders are filled only outside $…$, where braces belong to TeX
        return story.split(/(\$\$[\s\S]*?\$\$|\$[^$]*\$)/).map((part, i) => i % 2 ? part : part.replace(/\{(\w+)\}/g, (m, id) => {
          const g = p.given.find(x => x.v.id === id);
          if (g) return '$' + Formula.showTex(g.si, g.v, g.unit) + '$';
          if (id === p.unknown.id) return '$' + p.unknown.tex + '$';
          return m;
        })).join('');
      }
      return 'Given ' + givenTex.join(', ') + (p.given.some(g => g.v.isConst) ? ' (and ' + p.given.filter(g => g.v.isConst).map(g => '$' + g.v.tex + '$').join(', ') + ' as usual)' : '') +
             '. Find the ' + p.unknown.name + ' $' + p.unknown.tex + '$.';
    }

    solutionSteps(p) {
      const steps = [];
      const unk = p.unknown;
      steps.push({ text: 'Start from the relation', tex: this.displayTex });
      const iso = this.isolated(unk.id);
      const alone = this.eq.l.t === 'var' && this.eq.l.n === unk.id;
      if (iso && !alone) steps.push({ text: 'Rearrange for $' + unk.tex + '$', tex: this.rearrangedTex(unk.id) });
      const conv = p.given.filter(g => g.v.q && g.unit !== U().Q[g.v.q].units[0][0] && g.v.q !== 'angle' && g.v.q !== 'none' && g.v.q !== 'ratio');
      if (conv.length) steps.push({ text: 'Convert to SI units', tex: '\\begin{aligned}' + conv.map(g => g.v.tex + ' &= ' + Formula.showTex(g.si, g.v, g.unit) + ' = ' + Formula.showTex(g.si, g.v, U().Q[g.v.q].units[0][0])).join('\\\\') + '\\end{aligned}' });
      if (iso) {
        const subst = X().toTex(iso.tree, n => {
          const g = p.given.find(x => x.v.id === n);
          if (!g) return null;
          if (g.v.q === 'angle') return '\\left(' + H.util.fmtTex(U().fromSI(g.si, 'angle', '°'), 4) + '^{\\circ}\\right)';
          const t = H.util.fmtTex(g.si, 4);
          return g.si < 0 || /times/.test(t) ? '\\left(' + t + '\\right)' : t;
        });
        steps.push({ text: 'Substitute the values (SI units)', tex: unk.tex + ' = ' + subst });
      } else {
        steps.push({ text: '$' + unk.tex + '$ appears more than once, so solve numerically (or by algebra) with the given values' });
      }
      const siUnit = unk.q ? U().Q[unk.q].units[0][0] : unk.unit;
      let res = unk.tex + ' = ' + Formula.showTex(p.answer, unk, siUnit);
      if (unk.q && p.unit !== siUnit) res += ' = ' + Formula.showTex(p.answer, unk, p.unit);
      steps.push({ text: 'Result', tex: '\\boxed{' + res + '}' });
      if (p.alternatives && p.alternatives.length) {
        steps.push({ text: 'Another value also satisfies the relation: ' + p.alternatives.slice(0, 2).map(a => '$' + unk.tex + ' = ' + Formula.showTex(a, unk) + '$').join(', ') + '.' });
      }
      return steps;
    }
  }

  H.Formula = Formula;
  H.resolveUnit = resolveUnit;
  H.UNIT_ALIAS = ALIAS;

  /* formulas of a node, built once */
  H.formulasOf = function (node) {
    if (!node._formulas) node._formulas = (node.formulas || []).map((d, i) => {
      const f = new Formula(d, node);
      f.index = i;
      f.key = node.id + '/' + (d.id || i);
      return f;
    });
    return node._formulas;
  };
})(typeof window !== 'undefined' ? window : globalThis);
