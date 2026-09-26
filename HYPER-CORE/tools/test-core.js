/* Unit tests for the DOM-free engine modules.
 *   node HYPER-CORE/tools/test-core.js
 */
'use strict';
const path = require('path');
const { loadCore } = require('./load');
const H = loadCore();

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; console.log('FAIL', msg); } }
function near(a, b, msg, rel) { ok(Math.abs(a - b) <= (rel || 1e-9) * Math.max(1, Math.abs(b)), msg + ' (got ' + a + ', want ' + b + ')'); }
function throws(fn, msg) { try { fn(); fail++; console.log('FAIL (no throw)', msg); } catch (e) { pass++; } }

/* ---------- TeX */
const texCases = [
  'R = \\frac{v_0^2 \\sin 2\\theta}{g}', 'E = mc^2', '\\vec{F}_{net} = m\\vec{a}', '\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}',
  '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', '\\left( \\frac{a}{b} \\right)^2',
  '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', 'f(x) = \\begin{cases} x & x \\ge 0 \\\\ -x & x < 0 \\end{cases}',
  '\\begin{aligned} a &= b + c \\\\ &= d \\end{aligned}', '\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B})',
  '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}', '\\oint \\vec B \\cdot d\\vec \\ell = \\mu_0 I', '\\hbar\\omega',
  '\\text{KE} = \\tfrac12 mv^2', 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', '\\sqrt[3]{27} = 3', '\\dot{x}, \\ddot{x}, \\hat{n}, \\bar{x}',
  '9.81\\,\\mathrm{m/s^2}', '{}^{14}_{6}\\mathrm{C}', '\\Delta S \\ge 0', '\\mathbb{R}^3', '\\langle x \\rangle', 'v = \\dfrac{d x}{d t}',
  '10^{-34}', 'x^10', '\\ce{2H2 + O2 -> 2H2O}', '\\binom{n}{k}', '\\color{red}{x}', '\\hl{x+1}', 'a \\ne b', 'a\\\\b',
  '\\left. \\frac{df}{dx} \\right|_{x=0}', '\\overline{AB}', '\\underbrace{a+b}_{n}', '\\theta^\\circ', "f'(x)", "f''(x)",
  '\\operatorname{sinc} x', '\\unit{kg\\cdot m^2}', '\\lVert v \\rVert', '|x|', '\\{1, 2\\}', '\\approx', '\\boxed{x=1}'
];
for (const t of texCases) {
  try { const m = H.tex(t, true); ok(m.startsWith('<math'), 'tex ' + t); } catch (e) { fail++; console.log('FAIL tex', t, e.message); }
}
throws(() => H.tex('\\frac{a}', true), 'unclosed frac');
throws(() => H.tex('\\foo x', true), 'unknown command');
throws(() => H.tex('a}', true), 'stray brace');
throws(() => H.tex('\\left( x', true), 'left without right');
ok(/data-k="v_0"/.test(H.tex('v_0^2', false)), 'data-k on subscripted symbol');
// every symbol's key is found in a formula that uses it
for (const [sym, formula] of [['X_\\text{sub}', 'Y = 2X_\\text{sub}'], ['X_{\\text{sub}}', 'Y = X_{\\text{sub}}^2'], ['\\Delta x', 'v = \\frac{\\Delta x}{t}'],
  ['\\vec{F}', '\\vec{F} = m\\vec{a}'], ['\\mathrm{KE}', '\\mathrm{KE} = \\tfrac12 mv^2'], ['\\text{KE}', '\\text{KE} = \\tfrac12 mv^2'],
  ['E_{\\mathrm{max}}', 'E_{\\mathrm{max}} = hf'], ["x'", "x' = \\gamma (x - vt)"], ["t'", "t'^2 = t^2"], ['\\mathrm{AU}', 'd = 1\\,\\mathrm{AU}'], ['\\theta', '\\sin\\theta'], ['\\omega_0', '\\omega_0 = \\sqrt{k/m}'], ['\\mathbf{F}', '\\mathbf{F} = q\\mathbf{E}'], ['\\Delta\\vec{p}', '\\Delta\\vec{p} = F t']]) {
  const k = H.texKey(sym);
  ok(H.tex(formula, true).includes('data-k="' + k.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;') + '"'), 'symbol ' + sym + ' (key ' + k + ') found in ' + formula);
}
ok(H.tex('A \\Longleftrightarrow B', false).includes('⟺'), 'Longleftrightarrow');
ok(/data-k="\\theta"/.test(H.tex('\\sin\\theta', false)), 'data-k on greek');

/* ---------- expressions */
const X = H.expr;
near(X.evaluate(X.parse('2x + 3'), { x: 4 }), 11, 'implicit mult');
near(X.evaluate(X.parse('-x^2'), { x: 3 }), -9, 'unary minus binds looser than power');
near(X.evaluate(X.parse('2^3^2'), {}), 512, 'right-assoc power');
near(X.evaluate(X.parse('sin x^2'), { x: 1.2 }), Math.sin(1.44), 'sin x^2');
near(X.evaluate(X.parse('sin 2x'), { x: 0.3 }), Math.sin(0.6), 'sin 2x');
near(X.evaluate(X.parse('sin x cos x'), { x: 0.3 }), Math.sin(0.3) * Math.cos(0.3), 'sin x cos x');
near(X.evaluate(X.parse('sin^2 x + cos^2 x'), { x: 0.7 }), 1, 'sin^2 x');
near(X.evaluate(X.parse('|x - 5|'), { x: 2 }), 3, 'abs bars');
near(X.evaluate(X.parse('5!'), {}), 120, 'factorial');
near(X.evaluate(X.parse('(-8)^(1/3)'), {}), -2, 'odd root of negative');
near(X.evaluate(X.parse('2pi'), {}), 2 * Math.PI, '2pi');
near(X.evaluate(X.parse('3x²'), { x: 2 }), 12, 'unicode square');
near(X.evaluate(X.parse('xy', { known: new Set(['x', 'y']) }), { x: 2, y: 5 }), 10, 'split xy');
near(X.evaluate(X.parse('xsinx', { known: new Set(['x']) }), { x: 1 }), Math.sin(1), 'split xsinx');
near(X.evaluate(X.parse('log(100)'), {}), 2, 'log10');
near(X.evaluate(X.parse('ln(e)'), {}), 1, 'ln e');
near(X.evaluate(X.parse('1.5e3'), {}), 1500, 'sci notation');
throws(() => X.parse('2 +'), 'dangling operator');
throws(() => X.parse('(2'), 'unclosed paren');
ok(X.equivalent('6x+2', '2*(3x+1)', ['x']), 'equivalent answers');
ok(!X.equivalent('6x+2', '6x+3', ['x']), 'non-equivalent answers');
ok(X.equivalent('3x^2 sin(x) + x^3 cos(x)', 'x^2(3sin x + x cos x)', ['x']), 'equivalent product rule');

// isolation round trips
const iso = (eq, v, scope) => {
  const e = X.parseEq(eq);
  const t = X.isolate(e, v);
  ok(t, 'isolate ' + v + ' in ' + eq);
  if (!t) return;
  const val = X.evaluate(t, scope);
  const s = Object.assign({}, scope, { [v]: val });
  near(X.evaluate(e.l, s), X.evaluate(e.r, s), 'isolated ' + v + ' satisfies ' + eq, 1e-9);
};
iso('R = v0^2*sin(2*theta)/g', 'v0', { R: 40, theta: 0.6, g: 9.81 });
iso('R = v0^2*sin(2*theta)/g', 'theta', { R: 30, v0: 20, g: 9.81 });
iso('R = v0^2*sin(2*theta)/g', 'g', { R: 30, v0: 20, theta: 0.6 });
iso('F = G*m1*m2/r^2', 'r', { F: 1e-9, G: 6.674e-11, m1: 10, m2: 20 });
iso('N = N0*exp(-lambda*t)', 't', { N: 30, N0: 100, lambda: 0.1 });
iso('N = N0*e^(-lambda*t)', 'lambda', { N: 30, N0: 100, t: 5 });
iso('T = 2*pi*sqrt(L/g)', 'L', { T: 2, g: 9.81 });
iso('beta = 10*log(I/I0)', 'I', { beta: 60, I0: 1e-12 });
iso('1/f = 1/do + 1/di', 'di', { f: 0.1, do: 0.3 });
ok(X.isolate(X.parseEq('x = a*x + b'), 'x') === null, 'two occurrences -> null');
const r = X.roots(x => x * x - 2, { guess: 1 });
near(r[0], Math.SQRT2, 'numeric root');
const r2 = X.roots(x => x * x - 2, { positive: false, guess: -1 });
ok(r2.length === 2, 'both roots when signed');
const r3 = X.roots(x => Math.tan(x) - 1, { min: 0, max: 1.5 });
ok(r3.length === 1, 'tan root without the pole');
ok(X.toTex(X.parse('v0^2*sin(2*theta)/g')).includes('\\frac'), 'toTex fraction');

/* ---------- units */
const U = H.units;
near(U.toSI(100, 'temperature', '°C'), 373.15, '°C to K');
near(U.fromSI(373.15, 'temperature', '°F'), 212, 'K to °F', 1e-9);
near(U.convert(36, 'speed', 'km/h', 'm/s'), 10, 'km/h');
near(U.toSI(45, 'angle', '°'), Math.PI / 4, 'degrees');

/* ---------- formulas */
const f = new H.Formula({
  name: 'Range', expr: 'R = v0^2*sin(2*theta)/g',
  vars: { R: { name: 'range', q: 'length' }, v0: { name: 'launch speed', q: 'speed', value: 20 },
          theta: { name: 'angle', q: 'angle', unit: 'deg', value: 45, min: 0, max: 90 }, g: { const: 'g' } }
});
ok(f.errors.length === 0, 'formula has no errors ' + f.errors.join('; '));
near(f.byName.R.def, 400 / 9.80665, 'default R computed');
const s = f.defaults();
s.R = 30;
const th = f.solve('theta', s);
ok(th.ok && th.all.length === 2, 'two launch angles for a range: ' + JSON.stringify(th));
const p = f.problem({ seed: 7 });
ok(p && Number.isFinite(p.answer), 'problem generated');
ok(f.solutionSteps(p).length >= 3, 'solution steps');
const q = new H.Formula({ name: 'quad', expr: 'a*x^2 + b*x + c = 0', vars: { a: { value: 1 }, b: { value: -3 }, c: { value: 2 }, x: { signed: true } }, solveFor: 'x' });
const qs = q.solve('x', Object.assign(q.defaults(), { x: 0 }));
ok(qs.ok && qs.all.length === 2, 'quadratic has two roots ' + JSON.stringify(qs.all));
const bad = new H.Formula({ name: 'bad', expr: 'y = m*x + c2', vars: { y: {}, m: {}, x: {} } });
ok(bad.errors.length === 1, 'undeclared variable reported');

/* ---------- text */
H.nodes.clear();
H.use('physics');
H.add({ id: 'force', title: 'Force' });
H.build();
const html = H.text('A **bold** $x^2$ link [[force]] and [[math:derivative|slope]].\n\n- one\n- two\n\n$$E = mc^2$$\n\n> [!tip] Remember\n\n| a | b |\n|---|---|\n| 1 | 2 |');
ok(html.includes('<strong>bold</strong>') && html.includes('<math') && html.includes('href="#/c/force"') && html.includes('../HYPER-MATH/index.html#/c/derivative'), 'text render');
ok(html.includes('<ul>') && html.includes('mathblock') && html.includes('callout co-tip') && html.includes('<table'), 'text blocks');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
