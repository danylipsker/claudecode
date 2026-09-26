# Writing content for the Hyper apps

The Hyper apps (Hyper Physics, Hyper Math, later Hyper Electronics and Hyper Chemistry)
are interactive study maps in the spirit of HyperPhysics: every concept is a page that
shows where it sits in a web of ideas, explains it properly, turns each formula into a
calculator that solves for any variable, lets you play with a simulation, and gives
practice with worked solutions. Everything runs in the browser from plain script files —
no build step, no libraries, no network.

**All text must be original.** HyperPhysics is the model for the *structure*, not a
source to copy. Do not fetch or paraphrase text from HyperPhysics, Wikipedia or any
other site. Write every explanation, example and question yourself; standard physics
facts, formulas and constants are of course fine.

Read `HYPER-PHYSICS/content/kinematics.js` and `HYPER-PHYSICS/sims/kinematics.js`
first: they are the reference for depth, tone and layout.

## Files

```
HYPER-CORE/            the engine (do not edit — report problems instead)
  AUTHORING.md         this guide
  tools/validate.js    run it on your files until it reports no errors
HYPER-PHYSICS/
  content/outline.js   root, branches and topics, with the planned concepts (do not edit)
  content/<topic>.js   concepts, one file per topic, e.g. content/dynamics.js
  sims/<topic>.js      simulations used by those concepts
  catalog.js           generated titles (do not edit)
HYPER-MATH/            the same layout
```

Write only the files you were given. Do not edit `outline.js`, `index.html`, anything in
`HYPER-CORE`, or another author's files; the integrator wires new files into
`index.html`. The validator loads every file in `content/` and `sims/` on its own.

## A concept

```js
Hyper.add(
{
  id: 'projectile-motion',                // lowercase-with-dashes, unique in the discipline
  parent: 'kinematics',                   // the topic it belongs to (from outline.js)
  title: 'Projectile motion',
  level: 2,                               // 1 introductory · 2 intermediate · 3 advanced
  short: 'One or two sentences: what it is, in plain words.',
  keywords: ['trajectory', 'range', ...], // search terms a learner might type
  prereq: ['constant-acceleration', 'free-fall', 'math:vectors'],  // what to know first
  related: ['drag-force'],                // "see also" (no need to repeat prerequisites)
  body: `Markdown with $inline$ and $$display$$ math ...`,
  ideas: ['Key idea one.', 'Key idea two.'],                        // 3–5 short sentences
  pitfalls: ['The misconception — Why it is wrong and what is true.'], // 2–3
  derivation: { title: 'Derive the range formula', steps: [{ text: '...', tex: '...' }] },  // optional
  formulas: [ ... ],                      // see below
  examples: [{ title, q, steps: ['...', '...'], a: '...' }],       // 1–3 worked examples
  quiz: [ ... ],                          // 3–5 questions, see below
  problems: [ ... ],                      // optional numeric word problems
  applications: ['Where this shows up in real life.'],             // optional, 2–4
  history: 'A short note on who and when.',                        // optional
  sim: 'projectile'                       // or ['a', 'b'] or { id: 'a', params: {...} }
}
);
```

Several concepts go in one `Hyper.add( {...}, {...}, ... );` call.

**What makes a good page.** Start with intuition and a concrete picture, then the
formula, then what it means (limits, special cases, orders of magnitude, what changes
when a variable doubles), then subtleties. A body of 1500–3500 characters is typical;
advanced topics may run longer. Use `### Subheadings` to break it up. Give real numbers
(the speed of a sprinter, the charge on a balloon, the wavelength of green light). Link
generously to other concepts where they are mentioned. Prefer SI units and British
spelling (metre, colour, centre, behaviour), matching the reference file.

**Prerequisites** are the concepts a learner should meet first; they drive the concept
map ("builds on" / "leads to") and the learning paths, so choose them with care: two to
four direct prerequisites, not everything remotely related. Links into the other
discipline use a prefix: `math:derivative`, `physics:simple-harmonic-motion`.

**Ids you can link to:** everything in the `plan` lists of both `outline.js` files
(planned concepts are fine to link even before they are written), plus the ids you
create yourself. If you add a concept that is not in the plan, give it an id that cannot
clash (check both outlines).

## Text

| Write | Get |
|---|---|
| `**bold**`, `*italic*`, `` `code` `` | emphasis |
| `$v = at$` | inline math |
| `$$E = mc^2$$` (own line, may span lines) | display math |
| `[[free-fall]]`, `[[free-fall\|falling freely]]` | link to a concept (title or your words) |
| `[[math:derivative\|derivative]]` | link into the other discipline |
| `### Heading`, `#### Smaller` | headings |
| `- item`, `1. item` | lists |
| `> [!tip] text` — also `note`, `warn`, `key`, `fact`, `history`, `why` | coloured callout |
| `\| a \| b \|` then `\|---\|---\|` | table |

### Backslashes — the one trap

Content is JavaScript, so **every TeX backslash is doubled** in the source: write
`'\\frac{a}{b}'` and `` `$\\theta$` ``. A single backslash silently breaks things:
`\frac` becomes a form feed, `\theta` a tab, `\nu` a new line, `\vec` a vertical tab.
The validator catches these. Also avoid `${` inside template strings (it starts a JS
substitution); write `$ {}^{14}C$` or use a plain string.

### TeX that works

Fractions `\\frac`, `\\dfrac`, `\\tfrac`; roots `\\sqrt{x}`, `\\sqrt[3]{x}`; scripts
`x^2`, `x_{0}`, `x_0^2`; Greek `\\alpha … \\omega`, `\\Delta`, `\\varepsilon`; operators
`\\cdot \\times \\pm \\le \\ge \\ne \\approx \\propto \\sim \\to \\Rightarrow \\infty \\partial \\nabla \\hbar`;
big operators with limits `\\sum_{n=1}^{\\infty}`, `\\int_0^1`, `\\oint`, `\\lim_{x\\to 0}`;
functions `\\sin \\cos \\tan \\ln \\log \\exp \\arcsin \\sinh`; fences `\\left( … \\right)`,
`\\left| … \\right|`, `\\langle \\rangle`; accents `\\vec{F}`, `\\hat{n}`, `\\bar{x}`,
`\\dot{x}`, `\\ddot{x}`, `\\overline{AB}`; fonts `\\mathbf{F}`, `\\boldsymbol{\\omega}`,
`\\mathrm{kg}`, `\\mathbb{R}`, `\\mathcal{L}`, `\\text{words}`; units `\\,\\mathrm{m/s^2}`
or `\\unit{m/s^2}`; spacing `\\, \\; \\quad`; environments `pmatrix`, `bmatrix`,
`vmatrix`, `cases`, `aligned` (with `&` and `\\\\`), `array{lcr}`; `\\binom{n}{k}`,
`\\boxed{…}`, `\\underbrace{…}_{…}`, `\\overset{…}{…}`, `\\color{red}{…}`, `\\hl{…}`
(highlight), `\\ce{2H2 + O2 -> 2H2O}` (simple chemistry), `\\dv{f}{x}`, `\\pdv{f}{x}`,
`\\dv[2]{x}{t}`, `\\xrightarrow{…}`. In tables write a literal bar as `\\|` (bars inside
`$…$` and inside `[[link|text]]` are fine).
Anything else is reported by the validator as an unknown command.

## Formulas: every one is a calculator

```js
{
  name: 'Range on level ground',
  expr: 'R = v0^2*sin(2*theta)/g',          // the equation, in calculator syntax
  tex:  'R = \\frac{v_0^2 \\sin 2\\theta}{g}', // how it is displayed (optional; made from expr if absent)
  vars: {
    R:     { name: 'range', q: 'length', unit: 'm' },
    v0:    { name: 'launch speed', q: 'speed', unit: 'm/s', value: 20 },
    theta: { name: 'launch angle', q: 'angle', unit: '°', value: 35, min: 0, max: 90 },
    g:     { const: 'g' }                     // a physical constant (editable, e.g. for the Moon)
  },
  solveFor: 'R',                              // the unknown shown first (default: a lone left-hand side)
  note: 'When it applies: lands at launch height, no air resistance.',
  stories: { R: 'A football is kicked at {v0}, {theta} above the ground. How far does it land?' },
  practice: { unknowns: ['R', 'v0'] }         // optional: which unknowns problems ask for
}
```

- **expr** uses `+ - * / ^`, parentheses, and `sqrt cbrt exp ln log (base 10) log2 sin cos tan
  asin acos atan sinh cosh tanh sec csc cot abs atan2(y,x) hypot min max fact`, and `pi`, `e`.
  Angles inside `sin(...)` are radians internally; an angle variable with `q: 'angle'` and
  `unit: '°'` is converted for you.
- **Every identifier in expr must be declared in vars**, and every var must appear in expr.
  Never name a variable `e` or `pi` (use `qe` for the elementary charge, `E` for energy is fine). A declared variable may share a function's name (`gamma`, `deg`), it is then a variable.
- **The calculator solves for any variable.** If a variable appears once it is isolated
  symbolically (and the rearranged formula is shown); otherwise it is found numerically.
  The validator checks that solving for each variable gives back the starting values.
- **value** is a realistic starting value *in the variable's unit*; give one to every
  variable except the one computed. `min`/`max` bound a variable (and its slider) — use them
  for angles and for anything with a physical range; the solver then finds *all* roots in
  the range (both launch angles, both times a ball passes a height).
- **signed: true** for quantities that may be negative (velocity components, charge,
  displacement, work, potential energy, temperatures in a difference...). Unsigned
  variables must come out non-negative.
- **int: true** for counts (number of turns, quantum numbers, harmonics).
- **fixed: true** marks a variable as a fixed number of the formula (like a constant: shown with a
  badge, never asked for in practice), e.g. the 10 pc of the distance modulus.
- **q** is the quantity, which gives the unit menu. Quantities available:
  none, ratio, count, length, area, volume, mass, time, frequency, angle, solidangle, angvel,
  angacc, speed, accel, force, energy, power, pressure, momentum, torque, inertia, angmom,
  density, lindensity, arealdensity, stiffness, surfacetension, temperature, dtemp, charge,
  current, voltage, resistance, resistivity, conductance, conductivity, capacitance,
  inductance, bfield, hfield, flux, efield, eflux, dipole, mdipole, chargedensity,
  surfacecharge, linecharge, currentdensity, specificheat, heatcap, molarheat, entropy,
  latent, thermcond, heattransfer, thermres, expansion, intensity, soundlevel, amount,
  molarmass, concentration, numberdensity, viscosity, kinvisc, flowrate, massflow,
  wavenumber, optpower, activity, decayconst, dose, doseeq, luminousflux, illuminance,
  luminousint, stress, strain, energydensity, specificenergy, pressureGrad, hubble, gravparam,
  gain (dB), apparentpower (VA), reactivepower (var), datarate, slewrate, thermalres (K/W, °C/W), rate.
  The unit must be one of that quantity's units (see `HYPER-CORE/js/units.js`); aliases
  such as `deg`, `ohm`, `m/s^2` are accepted. A variable with a unit outside these
  (e.g. `N·m²/C²`) may give just `unit: '...'` without `q`: it is then shown fixed, in SI.
  Pure numbers (most of maths) need neither.
- **Constants** (`const: 'name'`): c, g, G, h, hbar, qe, me, mp, mn, amu, kB, NA, R, eps0,
  mu0, ke, sigma, bW, a0, Rinf, alpha, muB, eV, Ry, atm, T0, Vm, F, lambdaC, Msun, Rsun, Lsun,
  Mearth, Rearth, AU, ly, pc, H0, rhoW, cW, vs, I0, gMoon. Values are SI.
- **tex** should show every variable with the same TeX as its `vars[..].tex` (the default
  is derived from the name: `v0` → `v_0`, `theta` → `\\theta`, `k_B` → `k_{B}`), so pointing
  at a row lights the symbol up and clicking the symbol solves for it. `\\Delta x` works as
  one symbol. The validator warns when a symbol is missing from the tex.
- **stories** are optional word problems per unknown; `{name}` is replaced by the value
  with its unit. Put placeholders outside `$…$` (inside maths, braces belong to TeX). Without a story the problem reads "Given …, find …".
- Choose formulas that teach: the defining relation, the one or two results people
  actually use, and a limiting case if it is instructive. Four is plenty for most pages;
  many conceptual pages (e.g. Newton's first law) need none.

Maths works the same way with dimensionless variables: `expr: 'c = sqrt(a^2 + b^2)'`,
`expr: 'A = P*(1 + r/n)^(n*t)'`, `expr: 'a*x^2 + b*x + c = 0'` (solveFor `x`, `x` signed:
both roots are found).

## Worked examples, quizzes, problems

```js
examples: [{
  title: 'A long jump',
  q: 'Problem statement (Markdown).',
  steps: ['First step, with $math$.', { text: 'A step with a displayed equation:', tex: 'R = \\frac{v^2}{g}' }],
  a: 'The answer in a line.'
}],
quiz: [
  { q: 'Multiple choice?', choices: ['one', 'two', 'three', 'four'], a: 1, why: 'Why two is right and the others are not.' },
  { q: 'A true/false statement.', a: false, why: '...' },
  { q: 'Differentiate $x^3$.', answer: '3x^2', vars: ['x'], why: '...' },         // typed expression, checked numerically
  { q: 'Simplify $\sqrt{x^2}$ for $x > 0$.', answer: 'x', vars: ['x'], positive: true },   // compared at positive values only
  { q: 'How many metres in a light-second?', answer: 2.998e8, unit: 'm', why: '...' } // a number (unit optional), 2 % tolerance
],
problems: [
  { q: 'A word problem with a numeric answer.', answer: 12.5, unit: 'm/s', tol: 0.02,
    hint: 'Optional nudge.', steps: ['Worked solution step', '...'] }
]
```

Quiz questions should test understanding, not recall: predict what happens, spot the
misconception, compare two cases, estimate. Distractors should be the mistakes people
really make. Always explain in `why`. Choices may contain math. Mix in a true/false or an
expression question where natural (expression answers suit maths).

## Simulations

A simulation is a small interactive canvas. Put them in `sims/<topic>.js` and reference
them from a concept with `sim: 'id'`.

```js
Hyper.sim('pendulum', {
  title: 'Pendulum lab',
  blurb: `Markdown under the sim: **what to try** and what to notice (a short list).`,
  mount(box, kit, params) {
    const st = kit.stage(box.stage, { aspect: 0.55 });  // canvas: st.ctx, st.W, st.H (CSS px), st.begin() clears
    const ctl = kit.controls(box.side, [
      { id: 'L', label: 'Length', min: 0.1, max: 3, step: 0.05, value: 1, unit: 'm' },
      { id: 'm', label: 'Mass', min: 0.1, max: 10, value: 1, unit: 'kg', log: true },   // log slider
      { id: 'damp', type: 'check', label: 'Air friction', value: false },
      { id: 'g', type: 'select', label: 'Planet', options: [['Earth', 9.81], ['Moon', 1.62]], value: 9.81 },
      { type: 'buttons', items: [{ id: 'reset', label: 'Release', primary: true }] }
    ], (id, value, all) => { /* react to a change; ctl.values holds everything */ });
    const ro = kit.readout(box.side, [['T', 'Period'], ['E', 'Energy']]);  // ro.set('T', '2.01 s')
    const loop = kit.loop((dt, t) => {                 // dt ≤ 0.05 s; pauses off-screen, stops on leaving
      const c = st.begin();                            // clears to the theme background, returns ctx
      const C = kit.colors();                          // theme: C.text C.muted C.faint C.accent C.ok C.bad C.warn
                                                       //   C.grid C.axis C.bg2 C.surface C.series[0..6] C.dark
      // physics step, then draw
    }, box.stage);
    loop.start();
    return () => { /* optional cleanup */ };
  }
});
```

Helpers: `kit.arrow(ctx, x1, y1, x2, y2, color, width)`, `kit.label(ctx, text, x, y, {size, color, align, baseline, weight, bg})`,
`kit.dot(ctx, x, y, r, color, stroke)`, `kit.grid(ctx, x0, y0, w, h, step, color)`,
`kit.drag(st, { hit(p) → thing|null, move(thing, p), end(thing), hover: true })` for dragging with the pointer (`p = {x, y}`),
`kit.click(st, p => {...}, p => isClickable)` for clicking things on the canvas,
`kit.plot(el, opts, height)` → a `Hyper.Plot` (a live graph: `plot.set({ series: [{ pts: [[x, y], ...], label, dash, fill, dots, line: false }], x: {label, min, max, log}, y: {...}, marks: [{x, y, label}], vlines: [{x, label}], hlines: [{y, label}] })`),
`ctl.show(id, false)` / `ro.show(false)` / `ro.show(key, false)` to hide controls or read-outs (for sims with modes), `st.onResize(fn)`, `st.pos(event)`, `loop.once()` (draw one frame while stopped), `loop.running`, `kit.fmt(v, sig)`.
`Hyper.niceStep(span, n)` gives round grid spacings.

Guidelines: draw everything from the theme colours (it must look right in light and dark
themes); use real units and label axes; show numbers in the readout; integrate with small
fixed sub-steps (a pendulum should not gain energy); keep a sim to one clear idea with
a handful of controls; include a short "try this" list in the blurb. Plain canvas 2-D
only — no libraries. `mount` must not throw; guard divisions by zero. A good branch has a
simulation on each of its most visual concepts — typically 4–8 per author.

Wrap a whole sims file in `(function () { 'use strict'; ... })();` so its helper names
cannot collide with another author's file, and give scratch files you create elsewhere
unique names (the scratchpad is shared).

### Circuits: the simulator and the schematic kit

For anything electrical, do not approximate a circuit by hand: build it and let the
simulator solve it (`HYPER-CORE/js/circuit.js`, modified nodal analysis, tested against
textbook results). `HYPER-ELECTRONICS/sims/reference.js` shows both tools in use.

```js
const c = new kit.Circuit();                 // nodes are strings; ground is 'gnd' (or '0')
                                             //   new kit.Circuit({ method: 'trap' }) for ringing LC/RLC (no numerical damping)
const V1 = c.V('in', 'gnd', 12);              // + first. Value, or a function of time: t => 5*Math.sin(2*Math.PI*50*t)
                                             //   options: { r: internal resistance, ac: amplitude for c.ac(), phase }
const R1 = c.R('in', 'out', 10e3);            // R(a, b, ohms)       .i current a→b, .p power
c.C('out', 'gnd', 100e-9, 0);                 // C(a, b, farads, v0) .vc voltage, .i current
c.L('x', 'y', 10e-3, 0);                      // L(a, b, henries, i0)
c.I('gnd', 'a', 1e-3);                        // current source, from → to
c.D('a', 'k');                                // diode anode → cathode; { is, n, rs } — LED: { is: 1e-18, n: 2 }; Zener: { vz: 5.1 } (1 mA at vz)
c.VCVS('op', 'on', 'ip', 'in', 100);         // ideal voltage-controlled voltage source (out+, out−, in+, in−, gain)
c.XFMR('p1', 'n1', 'p2', 'n2', 0.05);         // ideal transformer, v2 = ratio · v1 (N2/N1); .i secondary, .i1 primary current
c.SW('a', 'b', true);                         // switch (closed); change .closed and solve again
c.NPN('c', 'b', 'e', { beta: 100 });          // also PNP — .ic .ib .ie .vce
c.NMOS('d', 'g', 's', { vt: 2, k: 0.5 });     // also PMOS (vt as a positive number) — .id .vgs .vds
c.OPAMP('p', 'n', 'out', { vpos: 15, vneg: -15, gain: 1e5, gbw: 1e6 });   // + input, − input, output; clips at the rails
                                             //   add { sr: 0.5e6 } (V/s) for a slew-limited integrator model in transients
c.dc();                                       // the operating point: c.v('out'), R1.i, V1.i (out of +), c.ok
c.reset(); c.step(1e-6);                      // transient, from the initial conditions: c.t, c.v(...)
c.ac(1000).v('out')                           // small-signal AC -> { mag, phase (°), re, im }; sources need { ac: 1 }
c.ac(1000).i(R1)                              // the AC current of any element, same direction as its DC .i
Hyper.circuit.eSeries(4700, 'E12')            // nearest standard resistor value
```

Build a new circuit (or change element values and call `dc()` / `step()` again) when a
control changes. For transients step with a small fixed `dt` (a hundredth of the fastest
time constant or period) several times per frame. `kit.eng(4700, 'Ω')` formats
engineering values ("4.7 kΩ"). Draw with `kit.schem` (`HYPER-CORE/js/schematic.js`):

```js
const S = kit.schem;
S.wire(ctx, [[x1, y1], [x2, y1], [x2, y2]]);  S.node(ctx, x, y);  S.ground(ctx, x, y);  S.rail(ctx, x, y, '+5 V');
S.resistor(ctx, x1, y1, x2, y2, { label: 'R1', value: '10 kΩ' });     // parts go between two points, any angle
S.capacitor(..., { polarized }); S.inductor(..., { core }); S.pot(..., { wiper: 0..1 }); S.fuse(...);
S.battery / S.vsource(..., { ac: true }) / S.isource   (+ at the first point; current source arrow first → second)
S.diode(..., { kind: 'led' | 'zener' | 'schottky' | 'photo', on, glow }); S.switch(..., { closed }); S.lamp(..., { on, brightness });
S.motor / S.speaker; S.meter(ctx, x, y, 'V', '5.00 V');
const q = S.npn(ctx, x, y, { pnp, label });      // returns pins { b, c, e } as [x, y]; S.nmos(...) -> { g, d, s }
const a = S.opamp(ctx, x, y, { flip });          // -> { inp, inn, out }  (− input on top unless flip)
const g = S.gate(ctx, 'nand', x, y, { inputs: 2 });   // and or not nand nor xor xnor buf -> { in: [...], out }
S.led(ctx, x, y, on);                            // a logic-level indicator
S.flow(ctx, pts, phase, { color });              // current as moving dots: phase += speed(current) * dt
S.scope(ctx, x, y, w, h, { tdiv, traces: [{ pts: [[t, v], ...] | fn: t => v, vdiv, offset, label, unit: 'A' }] });
```

Symbols use the theme's text colour unless given `color`; keep live quantities (current,
logic levels) in the accent/warn/ok colours so they stand out.

## Checking your work

```bash
node HYPER-CORE/tools/validate.js HYPER-PHYSICS --only content/dynamics.js,content/work-energy.js,sims/dynamics.js
```

Fix every **error**. Read the **warnings** and fix the ones that are real (a symbol not
found in the tex, a variable with no value, a short body). Notes about planned concepts
that other authors have not written yet are expected. Run it again until it says OK.

Then run your simulations headless — each is mounted, run for hundreds of frames, and
every control moved to both ends; exceptions, NaN reaching the canvas and NaN readouts
are reported with the line in your file:

```bash
node HYPER-CORE/tools/simtest.js HYPER-PHYSICS --only sims/dynamics.js
```

Pages can also be opened in a browser before they are wired in: serve the repository
root (`node scripts/serve.js 8172`) and open
`http://localhost:8172/HYPER-PHYSICS/index.html?extra=content/dynamics.js,sims/dynamics.js#/c/friction`.
Several authors work at once, so do not leave a server running or take over a shared
browser; the two command-line checks are what must pass.
