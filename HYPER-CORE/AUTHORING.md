# Writing content for the Hyper apps

The Hyper apps (Hyper Physics, Math, Electronics, Chemistry, Finances, Medicine, Aerodynamics, Hydraulics and Pneumatics)
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
first: they are the reference for depth, tone and layout. Each later discipline has its
own reference concept and simulations in `content/reference.js` and `sims/reference.js`
(the voltage divider in Electronics, the limiting reagent and a VSEPR lab in Chemistry,
amortization with a loan explorer and the compound-interest snowball in Finances,
blood pressure with a cuff simulation and an ECG monitor in Medicine, the lift equation with an airfoil
in a stream in Aerodynamics, the hydraulic cylinder and its circuit in Hydraulics, the pneumatic cylinder and
its air consumption in Pneumatics).

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
| `[the periodic table](#/tools/periodic)` | link to a view of the app (`#/tools/chemcalc`, `#/formulas`, `#/map`) |
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
`$…$` and inside `[[link|text]]` are fine and must **not** be escaped: `[[medicine:gfr|text]]` in a table
cell is right, `[[medicine:gfr\|text]]` is not — the `\|` in the quick-reference table above is only
Markdown's own escape).
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
  asin acos atan sinh cosh tanh sec csc cot abs atan2(y,x) hypot min max fact erf ncdf` (ncdf is the
  standard normal distribution function, drawn as N), and `pi`, `e`.
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
  gain (dB), apparentpower (VA), reactivepower (var), datarate, slewrate, thermalres (K/W, °C/W), rate,
  molality, molarenergy, molarvolume, reactionrate, rateconst2, molarabs, henry, colligative
  (see the Chemistry section below), money and years (see the Finance section), and the clinical quantities of the Medicine section.
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
  one symbol. A variable's tex must parse as **one** symbol: several letters in a row are
  several symbols, so write clearance as `\\mathrm{CL}`, EC₅₀ as `\\mathrm{EC}_{50}` and log P as
  `{\\log P}_{\\text{o/w}}` (a braced group needs a subscript to count as one symbol). The validator warns
  when a symbol is missing from the tex.
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
`kit.plot(el, opts, height)` → a `Hyper.Plot` (a live graph: `plot.set({ series: [{ pts: [[x, y], ...], label, dash, fill, dots, line: false }], x: {label, min, max, log, reverse}, y: {...}, marks: [{x, y, label}], vlines: [{x, label}], hlines: [{y, label}] })`; `reverse: true` runs the x-axis right to left, as IR spectra do, and the y-axis downwards, as audiograms do),
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

### Chemistry: formulas, elements and molecules

**Chemical notation** goes in `\\ce{...}` inside maths, in text, formulas, quizzes and
examples alike: `$\\ce{2H2 + O2 -> 2H2O}$`. It follows mhchem:

| Write | You get |
|---|---|
| `\\ce{H2SO4}`, `\\ce{Ca(OH)2}`, `\\ce{[Cu(NH3)4]^2+}` | subscripts from the digits, brackets with counts |
| `\\ce{SO4^2-}`, `\\ce{Fe^3+}`, `\\ce{NH4+}`, `\\ce{OH-}`, `\\ce{e-}` | charges (write `Fe^3+`, not `Fe3+`, when the digit is the charge) |
| `\\ce{2H2O}`, `\\ce{1/2 O2}` | coefficients |
| `\\ce{NaCl(aq)}`, `\\ce{H2O(l)}`, `\\ce{CO2(g)}`, `\\ce{AgCl(s)}` | states |
| `->`, `<-`, `<=>`, `<=>>`, `<<=>`, `<->` | reaction, equilibrium (and lying to one side), resonance arrows |
| `\\ce{CaCO3 ->[\\Delta] CaO + CO2}`, `->[Pt][500 °C]` | text above and below an arrow |
| `\\ce{CuSO4.5H2O}` or `\\ce{CuSO4·5H2O}` | a hydrate dot |
| `\\ce{^{235}_{92}U}`, `\\ce{^{14}_{6}C}`, `\\ce{^{0}_{-1}e}`, `\\ce{^{A}_{Z}X}` | isotopes and particles (mass number and atomic number) |
| `\\ce{C_xH_yO_z}`, `\\ce{(CH2)_n}` | counts written as letters |
| `\\ce{CH3-CH3}`, `\\ce{CH2=CH2}`, `\\ce{HC#CH}` | single, double and triple bonds between atoms |

Separate the species of an equation with **" + " (spaces on both sides)**, so that the
charge sign in `Fe^3+ + e-` stays attached. In a formula's `tex` (and a variable's), wrap
a concentration as one symbol, `\\mathrm{[\\ce{H3O+}]}`, and a p-quantity as `{\\mathrm{p}K}_a`,
so the calculator can highlight and click it. Everything in `\\ce` is upright, as chemical
formulas should be; for a variable such as $K_c$ or $[\\ce{H+}]$ use ordinary TeX outside
or around `\\ce`: `K_c = \\frac{[\\ce{NH3}]^2}{[\\ce{N2}][\\ce{H2}]^3}`.

**Formulas with chemistry quantities.** The quantities you will use most: `amount` (mol,
mmol), `molarmass` (g/mol), `mass`, `volume` (L, mL), `concentration` (M = mol/L, mM, µM),
`molality` (mol/kg), `molarenergy` (kJ/mol, J/mol, kcal/mol), `molarheat` (J/(mol·K), for
entropy and heat capacity per mole), `molarvolume` (L/mol), `pressure` (atm, bar, kPa,
mmHg), `temperature` (K, °C; use `dtemp` for a difference), `rate` (1/s: first-order rate
constants), `reactionrate` (M/s), `rateconst2` (1/(M·s): second-order rate constants),
`molarabs` (L/(mol·cm)), `henry` (M/atm), `colligative` (K·kg/mol: Kb and Kf),
`voltage` (cell potentials), `charge`, `current`, `time`. Constants: `R`, `NA`, `F`, `kB`,
`h`, `c`, `atm`, `T0`, `Vm`. Equilibrium constants, pH, pKa and mole fractions are pure
numbers (no `q`).

> **Concentrations inside a logarithm or an equilibrium constant must be dimensionless.**
> The calculator evaluates every formula in SI, and the SI unit of concentration is
> mol/m³ — so `pH = -log(H)` with `q: 'concentration', unit: 'M'` would take the log of
> 1000 × [H⁺]. Declare such a variable without `q`, named in mol/L:
> `H: { name: '[H⁺] (mol/L)', value: 1e-4, tex: '\\mathrm{[\\ce{H+}]}' }`. The same goes for `Kc`,
> `Ka`, `Ksp`, `Q` and the concentrations that appear in them. Concentrations that are only
> multiplied or divided (`n = c*V`, dilution, rate = k·[A]) should keep
> `q: 'concentration'`, so the reader can pick units.

Mark stoichiometric coefficients `int: true` (and `fixed: true` when the story names a
particular reaction, so that practice problems keep them).

**The chemistry module** (`HYPER-CORE/js/chem.js`, as `kit.chem` in simulations and
`Hyper.chem` anywhere) knows all 118 elements and does the arithmetic of formulas:

```js
const C = kit.chem;
C.el('Fe')              // or C.el(26): { z, sym, name, mass, group, period, block, cat, en, ie (eV), r (pm, covalent),
                        //   ox: [common oxidation states], config: '[Ar] 3d6 4s2', color: CPK '#rrggbb', radioactive }
C.elements              // all 118, in order;  C.bySym.Na
C.fullConfig(11)        // '1s2 2s2 2p6 3s1'
C.parse('Ca(OH)2')      // { atoms: { Ca: 1, O: 2, H: 2 }, charge: 0 };  C.parse('SO4^2-').charge === -2
C.molarMass('CuSO4·5H2O')        // 249.68 (g/mol)
C.composition('H2O')             // [{ sym, n, mass, fraction }, ...]
C.balance('Fe + O2 -> Fe2O3')    // { ok, coefficients: [4, 3, 2], reactants, products, text: '4 Fe + 3 O2 -> 2 Fe2O3', elements }
                                 //   ions and electrons too: 'MnO4- + Fe^2+ + H+ -> Mn^2+ + Fe^3+ + H2O'
C.vsepr(3, 1)                    // bonding pairs, lone pairs -> { name: 'trigonal pyramidal', angle, electronGeometry, dirs, lone }
C.molecule('H2O')                // a 3-D model: H2O NH3 CH4 CO2 BF3 SF6 PCl5 XeF4 SF4 ClF3 H2 HCl N2 O2 C2H4 C2H2 C6H6 C2H5OH
C.fromVsepr('S', ['F','F','F','F'], 1)   // build one: central atom, ligands, lone pairs (optional bond orders)
```

Never type atomic masses or electronegativities into a simulation: read them from
`kit.chem`, so every page agrees with the periodic table (Tools → Periodic table).

**Molecules in 3-D** (`HYPER-CORE/js/molecule.js`, `kit.mol`). A molecule is
`{ atoms: [{ el, x, y, z, label?, charge?, radius? }], bonds: [[i, j, order]], lone: [{ atom, dir: [x, y, z] }] }`
(`radius` in ångström overrides the drawn size, e.g. for touching spheres in a unit cell)
with coordinates in ångström; draw it on a stage and let the reader turn it:

```js
const view = kit.mol.view({ rotX: -0.4, rotY: 0.6, scale: 70 });   // scale: pixels per ångström
kit.mol.rotator(st, view, () => loop.once());                       // drag to turn
kit.mol.draw(ctx, mol, view, { cx: st.W / 2, cy: st.H / 2, style: 'ball' /* or 'space' */, labels: true,
                               lone: true, highlight: [0], angle: [1, 0, 2] });   // an arc and the angle 1–0–2 in degrees
kit.mol.angle(mol, 1, 0, 2)                                         // the bond angle, degrees
kit.mol.project([x, y, z], view, { cx, cy })                        // a point (Å, from the drawing centre — pass
                                                                    //   centre: [0, 0, 0] to draw) on the canvas, for arrows and labels
```

Atoms are shaded in their CPK colours and sorted by depth, bonds are drawn single, double
or triple, lone pairs as lobes. For a flat picture (a reaction in a flask, a lattice
seen from above, a titration beaker) draw your own circles, still coloured with
`kit.chem.el(sym).color`. `HYPER-CHEMISTRY/sims/reference.js` shows both: particles
reacting in a flask with bars and a graph, and a VSEPR lab whose shapes come from electron
pairs repelling on a sphere.

### Finance: money, rates and time

Hyper Finances is read all over the world, and every reader picks a currency (Tools →
Money calculators). So **an amount is never written with a real currency sign**:

- **In text** (body, ideas, pitfalls, quizzes, examples, notes) write amounts with `¤`:
  `¤250,000`, `¤1,461.48 a month`. It is shown as the reader's currency ($, €, ₪ …). Never
  write `$250` — a dollar sign starts maths. Inside maths `¤` works too, with TeX
  thousands separators: `$M = ¤1{,}461.48$`.
- **In formulas** a money variable is `q: 'money', unit: '$'` (the `$` there means "the
  reader's currency", whatever it is; `'$k'`, `'$M'` are thousands and millions). The
  calculator shows it grouped with cents ($1,461.48) and accepts "250,000" as input.
- **Rates** are `q: 'ratio', unit: '%'`: the reader types 5 and the formula receives 0.05,
  so the expression uses the fraction — `A = P*(1 + r)^t`, `M = P*(r/12)/(1 - (1 + r/12)^(-12*T))`.
  `value`, `min` and `max` are given in the unit: `value: 5, min: 0.01, max: 50` (per cent).
- **Time** is `q: 'years'` (units yr, mo, wk, day; the formula receives years). Never use
  `q: 'time'` for finance — its SI unit is the second. A number of payments is a count
  (`int: true`); write formulas with a term in years and `12*T` payments where possible.
- Coefficients that a story fixes (12 payments a year, a particular product's fee) are
  `fixed: true` so practice problems keep them.

```js
{ name: 'Future value with compound interest', expr: 'A = P*(1 + r)^t',
  vars: { A: { name: 'value at the end', q: 'money', unit: '$' },
          P: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
          r: { name: 'yearly return', q: 'ratio', unit: '%', value: 6, min: -90, max: 100 },
          t: { name: 'years invested', q: 'years', unit: 'yr', value: 20 } },
  stories: { A: 'You invest {P} at {r} a year for {t}. What is it worth at the end?' } }
```

**The finance module** (`HYPER-CORE/js/finance.js`; `kit.fin` in simulations, `Hyper.finance`
anywhere, tested by `tools/test-finance.js`) does the arithmetic, so simulations never
re-derive it. Rates are fractions; `i` is a rate per period.

```js
const F = kit.fin;
F.payment(250000, 0.05 / 12, 300)            // 1461.48: the level payment (annuity; French; Spitzer)
F.amortize({ principal, annual, years, method: 'annuity' | 'linear' | 'interest-only',
             extra, lumps: [{ k: 60, amount }], prepay: 'shorten' | 'reduce',
             rates: [[1, 0.05], [61, 0.065]], inflation /* index-linked */, balloon, fees })
   // -> { rows: [{ k, year, rate, payment, interest, principal, extra, indexation, balance }],
   //      totals: { interest, principal, extra, indexation, paid, cost }, periods, firstPayment, maxPayment, years }
F.yearly(schedule)                           // the same, summed per year
F.fv(pv, i, n)  F.pv(fv, i, n)  F.fvAnnuity(pmt, i, n, due)  F.pvAnnuity(pmt, i, n, due)  F.nper(P, i, pmt)  F.rateOf(P, n, pmt)
F.effective(annual, m)  F.nominal(eff, m)  F.real(nominal, inflation)  F.cagr(start, end, years)  F.doublingTime(r)
F.npv(rate, flows, times?)  F.irr(flows, times?)  F.irrAll(flows, times?)  F.apr({ principal, fees, payments | payment + n, perYear })
F.grow({ initial, contribution, raise, annual, years, perYear, fee, inflation })   // a savings plan, period by period (+ real values)
F.timeToGoal({ goal, initial, contribution, annual })  F.drawdown({ balance, withdrawal, annual, inflation, years })
F.monteCarlo({ initial, contribution, withdrawal, inflation, years, mean, sd, runs, seed, percentiles })   // -> { years: [{ year, p }], success }
F.normals(seed)  F.uniforms(seed)            // reproducible sources of standard normal and of uniform [0, 1) numbers
F.bond({ face, coupon, ytm, years, freq })   // -> { price, macaulay, modified, convexity, currentYield }   F.bondYield({ price, … })
F.blackScholes({ S, K, r, sigma, T, type })  F.payoff(type, S, K, premium, short)  F.ncdf(x)
F.mix2({ w, mu1, mu2, s1, s2, rho })  F.sharpe(mu, sd, rf)  F.leveraged(ret, L, borrowRate)  F.marginCallPrice(p0, m0, mm)  F.leveragedPath(returns, L)
F.minimumPayoff({ balance, apr, minPct, minFloor, fixed })   F.affordable(pmt, i, n)
```

In Hyper Finances the accent colour is green, like `C.ok`: for a neutral series next to
ok/bad/warn use `kit.hue(215)` (blue). `¤` in `kit.label` text, control labels and read-out
values is also shown as the reader's currency. Show money with `kit.money(v)` ("$1,461.48" in the reader's currency; `kit.money(v, 0, true)`
is compact, "$250k", for axes), rates with `kit.pct(0.0525)` ("5.25 %"). A money axis on a
`kit.plot`: `y: { label, min: 0, fmt: v => kit.money(v, 0, true) }` and `fmtY: v => kit.money(v)`
for the hover read-out. Schedules and comparisons go in `kit.table(el, columns, opts)`.
For seeded randomness (market paths) use `kit.fin.normals(seed)` so a simulation is
reproducible. `HYPER-FINANCES/sims/reference.js` shows a loan drawn year by year with its
schedule, and the compound-interest snowball.

**The Money calculators** (Tools) already cover loans and mortgages with full schedules,
comparing offers, savings plans, financial independence with Monte Carlo, CAGR and IRR,
inflation and credit cards. Link to them from pages where a reader would want to try their
own numbers: `[the loan calculator](#/tools/money/loan)` (also `compare`, `save`, `retire`,
`returns`, `inflation`, `card`). Your simulations should teach one idea visually rather
than repeat a general calculator.

**Writing about money.** Explain, never advise: show the trade-offs, the numbers and the
questions to ask, and leave the decision to the reader. Write for every country: describe
the common patterns (fixed, variable and inflation-linked mortgages; tax-advantaged
retirement accounts; deposit insurance) and, where a country does something distinctive,
name it ("in the US…", "in the UK…", "in Israel…", "in the euro area…"). Do not state
today's rates, prices or index levels as current facts — use round illustrative numbers,
and give historical figures as approximate ranges with their period ("over 1926–2020, US
large company shares returned roughly 10 % a year before inflation"). Never recommend a
product, fund, broker or company by name. Be frank about risk, especially leverage, and
kind about fear: the aim is that a worried reader finishes a page calmer and more capable.

### Medicine: the body, units and safety

**Units.** Clinical formulas are written in clinical units, and the quantities follow them:
`pressure` has mmHg and cmH₂O; `frequency` has bpm and breaths/min; `flowrate` has mL/min,
mL/h and L/min; `concentration` has mmol/L and mEq/L (= mmol/L for ions of charge 1);
`massconc` (mg/L, µg/mL, ng/mL, mg/dL) for drug levels; `doseperkg` (mg/kg); `volperkg`
(mL/kg) — these three are counted in their first unit, not SI, so they combine directly with
kilograms and with variables declared without q in mg, L or mL (`LD = Css*Vd` with Css in
mg/L and Vd "(L)" gives mg; `BV = k*m` with k in mL/kg and m in kg gives mL); `vascres` (mmHg·min/L = Wood units); `power` has kcal/day. Laboratory analytes are
quantities of their own, so the reader can switch between conventional and SI units — each
lists **the unit its standard formulas use first**, and your expression must be written in
that unit: `glucose` (mmol/L | mg/dL), `creatinine` (**mg/dL** | µmol/L), `cholesterol` and
`triglycerides` (mmol/L | mg/dL), `urea` (mmol/L | mg/dL BUN), `calcium` (mmol/L | mg/dL),
`bilirubin` (µmol/L | mg/dL), `hemoglobin` (**g/dL** | g/L | mmol/L), `albumin` (g/dL | g/L).
Remember that formulas are evaluated in SI: a pressure variable in mmHg arrives in pascals and
a flow in m³/s, which is right for physical laws (MAP = CO × SVR with `vascres`) but wrong for
empirical formulas with fitted constants (eGFR, QTc, BMR, Parkland). For those, declare the
variables **without q**, named with their unit — `scr: { name: 'serum creatinine (mg/dL)' }`,
`qt: { name: 'QT interval (ms)' }` — or use the analyte quantities above, which are not SI.
Better still, give such a variable a plain unit label with `q: false`:
`LD: { name: 'loading dose', q: false, unit: 'mg' }` is shown as "500 mg" in the calculator,
the practice problems and the worked solutions, with no conversion.

**The medicine module** (`HYPER-CORE/js/medicine.js`; `kit.med` in simulations, `Hyper.med`
anywhere; tested by `tools/test-medicine.js`):

```js
const M = kit.med;
M.ecg({ rhythm, hr, seconds, seed })   // rhythm: sinus brady tachy afib aflutter pvc block1 block3 vt vf asystole
                                       // -> { at(t) -> mV (lead II), beats: [{ t, kind, rr, p }], hr }
M.hh({ I: t => µA/cm², tEnd: ms, dt, gNa, gK })   // Hodgkin–Huxley: { t, V, m, h, n, INa, IK, spikes }
M.nernst(z, cOut, cIn, T)  M.goldman({ pK, pNa, pCl, Ko, Ki, Nao, Nai, Clo, Cli })   // mV
M.sat(po2, { pH, T, p50 })  M.p50({ pH, T })  M.o2content(hb, sat, po2)  M.alveolarO2({ fio2, patm, paco2, rq })
M.pk({ halfLife: h, Vd: L, doses: [{ t, amount: mg, route: 'iv' | 'oral' | 'infusion', F, ka, duration }] })   // -> { at(t) mg/L, k, clearance }
M.steadyState({ dose, tau, halfLife, Vd, F })  M.loadingDose(C, Vd, F)  M.maintenanceDose(C, CL, tau, F)  M.emax(C, Emax, EC50, n)
M.bayes({ prevalence, sensitivity, specificity, N })   // -> { ppv, npv, lrPos, lrNeg, counts: { tp, fn, fp, tn } }
M.postTest(pre, lr)  M.risk({ cer, eer })  /* -> { arr, rrr, rr, or, nnt } */  M.wilson(k, n)
M.sir({ R0, infectious: days, N, I0, vaccinated, days })   // -> { series: [{ day, S, I, R }], peak, infected, herd }
M.bmi(kg, m)  M.bsa(kg, cm)  M.egfr(scrMgDl, age, female)  M.cockcroftGault(age, kg, scr, female)  M.map(s, d)
M.qtc(qtMs, hr, 'bazett' | 'fridericia')  M.anionGap(na, cl, hco3)  M.correctedCalcium(caMgDl, albGdl)  M.ibw(cm, female)
M.bmr(kg, cm, age, female)  M.maxHR(age)  M.karvonen(rest, max, intensity)  M.parkland(kg, tbsa)  M.maintenanceFluids(kg)
M.dripRate(mL, minutes, dropFactor)  M.winters(hco3)  M.cardiacOutput(hr, svMl)
```

`HYPER-MEDICINE/sims/reference.js` shows a blood-pressure cuff measured beat by beat and an
ECG monitor on standard paper (`sim: { id: 'ref-ecg', params: { rhythm: 'afib' } }` opens it
on a rhythm). The app's tools — link to them: the **body map** (`[the body map](#/tools/body)`)
and the **medical calculators** (`#/tools/clinical/body`, `kidney`, `heart`, `blood`, `test`,
`risk`, `fluids`).

**Writing about health — the rules.**

- **Explain; never diagnose or prescribe.** Describe how conditions and treatments work and
  what the evidence shows; never tell the reader what they have or what they should take.
  Frame decisions as questions to discuss with a doctor, nurse or pharmacist.
- **Emergencies first.** Wherever a condition can be an emergency, give its warning signs in a
  `> [!warn]` callout ending with "call your local emergency number". Never suggest waiting
  or treating at home when the guidance is to seek care.
- **Medicines by their generic names** (paracetamol/acetaminophen, ibuprofen, metformin),
  never brand names; describe classes and mechanisms. No dosing instructions for the public;
  pharmacology calculations use clearly hypothetical examples. First-aid steps follow the
  current resuscitation guidelines (ERC/AHA/ILCOR) and say so.
- **Numbers with their source and date**: prevalence, mortality, survival and guideline
  thresholds are approximate and dated ("WHO estimates, 2021"; "the 2017 American
  guideline"). Reference ranges vary by laboratory: say so wherever you quote one. Give lab
  values in both conventional and SI units.
- **Mental health and suicide**: follow safe-messaging practice — no method details, no
  sensational language, stress that help works and how to find it (local emergency number;
  crisis lines such as 988 in the US, Samaritans 116 123 in the UK and Ireland, ERAN 1201 in
  Israel). On eating disorders avoid numbers (calories, weights) that could be misused.
- **People first, without stigma**: "a person with diabetes", not "a diabetic"; describe
  addiction and mental illness as health conditions.
- **Visuals are schematic**, never graphic.

### Fluids: aerodynamics, hydraulics and pneumatics

Hyper Aerodynamics, Hyper Hydraulics and Hyper Pneumatics share one fluid engine and one
symbol kit. Their references: the lift equation with an airfoil in a stream and a lift balance
(Aerodynamics); the hydraulic cylinder with a working 4/3-valve circuit (Hydraulics); the
pneumatic cylinder with a 5/2 valve, meter-out throttles and its air consumption (Pneumatics).

**Units.**

- **Pressure is always measured from something — say which.** Gas laws, compression ratios,
  ISO 6358 valve flow and dew points need **absolute** pressure; forces on pistons, relief
  settings and pressure drops use **gauge** pressure or differences. Catalogues and gauges read
  gauge: "6 bar" in a workshop is 7.0 bar absolute. Name the variable accordingly
  (`p1: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar' }`) and write the
  conversion into the formula with an atmosphere variable where needed. `pressure` has Pa, hPa,
  kPa, MPa, bar, mbar, psi, atm, mmHg, inHg, inH₂O, mmH₂O, mH₂O, kgf/cm².
- **Flow.** Liquids: `flowrate` (L/min, L/s, m³/h, gal/min, cfm, cm³/min). Compressed air is
  counted as **free air**: `airflow` in `L/min ANR`, `L/s ANR`, `m³/min ANR`, `m³/h ANR` or `SCFM` —
  the volume the air would fill at the ISO 8778 reference atmosphere (20 °C, 100 kPa). A
  compressed volume V at absolute pressure p is V·p/p_ref of free air (at the same temperature).
  Mass flow: `massflow`.
- **Pumps and motors.** `displacement` per revolution (cm³/rev, cc/rev, L/rev); shaft speed as
  `frequency` in **rpm** (revolutions, so $Q = V_g n$ works directly); angular speed as
  `angvel` only in $P = T\omega$. Torque from displacement per revolution is
  $T = V_g\,\Delta p/(2\pi)$.
- **Valves.** Sonic conductance `flowcond` (dm³/(s·bar)) with the critical pressure ratio *b*
  (dimensionless). Kv (m³/h of water at 1 bar drop) and Cv (US gal/min at 1 psi) are
  empirical: declare the flow, the coefficient and the pressure drop with `q: false` labels
  (`Q: { name: 'flow', q: false, unit: 'm³/h' }`, `dp: { name: 'pressure drop', q: false, unit: 'bar' }`)
  so the formula is evaluated in those units. Kv = 0.865 Cv.
- **Air and flight.** Speeds in m/s, km/h, kt, mph, ft/min (climb rates); altitude as `length`
  (m, ft); angles as `angle` in ° (converted to radians inside the expression, so a lift slope of
  2π per radian works); viscosity `viscosity` (Pa·s, mPa·s, cP) and `kinvisc` (m²/s, mm²/s, cSt).
  Reynolds and Mach numbers, coefficients ($C_L$, $C_D$, $C_p$), efficiencies and ratios have no q.
  Head is a `length`; specific weight (N/m³) and Manning's *n* go without q, their unit in the name.
- **Constants:** `g`, `atm` (101 325 Pa), `Rair` (287.058 J/(kg·K)), `rhoSL` (1.225 kg/m³, ISA sea
  level), `aSL` (340.3 m/s), `rhoW` (1000 kg/m³), `R`.
- **Keep symbols apart.** $C_L$ (wing) and $c_l$ (section), $C_D$, $C_{D,0}$ and $C_{D,i}$; $p$,
  $p_0$ (stagnation) and $p^*$ (sonic); $T$ and $T_0$; $\rho$ and $\rho_0$; $A$ and $A^*$ (throat);
  $Q$ (volume flow), $q$ (dynamic pressure) and $\dot m$; piston area $A_1$ and annulus $A_2$;
  $\eta_v$, $\eta_{hm}$, $\eta_t$. The validator warns when one formula uses two symbols with the
  same key. (In content files every backslash is doubled, as always.)

**The fluid module** (`HYPER-CORE/js/fluid.js`; `kit.fluid` in simulations, `Hyper.fluid`
anywhere; tested by `tools/test-fluid.js` against published tables). SI throughout, angles in
radians:

```js
const F = kit.fluid;
F.isa(h)                        // standard atmosphere to 84.85 km (ISA, US 1976 above 47 km) -> { T, p, rho, a, mu, nu }
F.isentropic(M, g)              // -> { T0T, p0p, rho0rho, AAstar, mu }   (g = γ, default 1.4)
F.machFromArea(AAstar, g, supersonic)   F.normalShock(M) -> { M2, p2p1, rho2rho1, T2T1, p02p01 }
F.obliqueShock(M, theta) -> { beta, M2, p2p1, …, strong: {…}, thetaMax, detached }
F.prandtlMeyer(M)  F.machFromNu(nu)
F.naca4(m, p, t, n) -> [[x, y], …]    // a NACA four-digit airfoil, chord 1 (m, p, t as fractions)
F.panel(points, alpha) -> { cl, cm, cp: [{ x, y, cp, upper }], velAt(x, y) -> [u, v] }   // inviscid, V∞ = 1
F.thinAirfoil(m, p) -> { alpha0, cmc4, clAt(alpha) }
F.liftingLine({ AR, taper, alpha, alpha0, twist, a0 }) -> { CL, CDi, e, dist: [{ y, gamma, cl }] }
F.flatPlate(Re) -> { cfLam, cfTurb }  F.blasiusDelta(x, Rex)  F.turbDelta(x, Rex)
F.friction(Re, eps/D)           // Darcy friction factor: 64/Re, Colebrook, blended 2300–4000
F.colebrook(Re, rr)  F.swameeJain(Re, rr)  F.headLoss({ f, L, D, V })
F.operatingPoint(pumpH(Q), systemH(Q), Qmax) -> { Q, H }   F.affinity({ Q, H, P }, n1, n2, D1, D2)
F.section(y, b, z)  F.manningQ(y, { b, z, n, S })  F.normalDepth({ Q, b, z, n, S })  F.criticalDepth({ Q, b, z })
F.froude(V, D)  F.hydraulicJump(y1, Fr1) -> { y2, loss }  F.weirRect(Cd, b, H)  F.weirV(Cd, thetaDeg, H)
F.waveSpeed({ K, rho, D, e, E })  F.joukowsky(rho, a, dv)  F.orifice(Cd, A, dp, rho)
F.oilViscosity(46 | { v40, v100 }, T°C) -> m²/s    // ISO VG grade, Walther/ASTM D341
F.iso6358({ C, b, p1, p2, T1 }) -> { mdot, qANR, choked }   // absolute pressures in Pa
F.dewPoint(T°C, RH)  F.pressureDewPoint(T°C, RH, p1, p2) -> { pdp, condenses }
F.compressorWork(p1, p2, V1, n)   // J; n = 1 isothermal, 1.4 adiabatic
F.pneuCylinder({ bore, rod, stroke, mass, load, psupply, patm, Cvalve, bvalve, CthrottleA, CthrottleB, dead, fc, fv })
   // -> { state: { x, v, pA, pB, t, air }, step(dt, cmd), AA, AB, airNl() }  a cylinder, 5/2 valve and
   //    meter-out throttles; chamber pressures by the adiabatic energy balance, valve flow by ISO 6358
```

**The fluid-power symbol kit** (`HYPER-CORE/js/fluidsym.js`; `kit.fsym`), drawn in the manner of
ISO 1219-1. Every symbol returns its ports as `[x, y]` points to draw lines between:

```js
const S = kit.fsym;
S.line(ctx, [[x1, y1], [x2, y1], [x2, y2]], { state: 'pressure' })   // pressure return pilot metered suction air exhaust idle
                                                               // kind: 'pilot' (long dashes) or 'drain' (short) is set by state 'pilot' or given
S.flow(ctx, pts, phase, { color: S.col('pressure') })          // moving dots; advance phase (px) by speed × dt
S.junction(ctx, x, y)   S.plug(ctx, x, y)   S.col(state)   S.bar(pascals) -> '6.0 bar'
const v = S.valve(ctx, x, y, { spec: '4/3 closed', state: 1, left: 'solenoid', right: 'solenoid', labels: true })
   // spec: '2/2 NC' '2/2 NO' '3/2 NC' '3/2 NO' '4/2' '5/2' '4/3 closed' '4/3 tandem' '4/3 float' '4/3 open'
   //       '5/3 closed' '5/3 exhaust' '5/3 pressure' (or your own { top, bottom, boxes, normal })
   // state: which box sits at the ports, 0 = leftmost; the normal (spring) box is 1; fractional while shifting
   // left / right: 'spring' 'solenoid' 'prop' 'lever' 'pushbutton' 'roller' 'pilot' 'detent' 'manual', joined with '+'
   // pneumatic: true (hollow pilot triangles, port numbers 1 2 4 3 5 with labels), exhaust: true | 'silencer'
   // -> { P, T, A, B, R, S, pilotL, pilotR, left, right }   the ports stay put while the boxes slide
S.pump(ctx, x, y, { variable, bidir, motor: true })  S.compressor(…)  -> { in, out }
S.motor(ctx, x, y, { pneumatic, bidir, angle })  -> { a, b, shaft }   S.emotor(ctx, x, y) -> { shaft }
S.cylinder(ctx, x, y, { len, h, pos: 0..1, single: 'retract' | 'extend', through, cushion, fillA, fillB, rot }) -> { A, B, tip }
S.check(ctx, x, y, { open, spring, pilot, rot }) -> { in, out, X }        // free flow in (bottom) -> out (top)
S.pressureValve(ctx, x, y, { kind: 'relief' | 'reducing' | 'sequence' | 'regulator', open: 0..1 }) -> { in, out, L }
S.throttle(ctx, x, y, { adjustable }) -> { a, b }   S.flowControl(ctx, x, y, { free: 'up' | 'down', compensated }) -> { a, b }
S.accumulator(ctx, x, y, { level }) -> { P }   S.tank(ctx, x, y) -> { T }   S.filter / S.cooler -> { a, b }
S.gauge(ctx, x, y, { frac, value: S.bar(p) }) -> { P }   S.source(ctx, x, y, { pneumatic }) -> { P }
S.exhaust(ctx, x, y, { silencer, rot })   S.frl(ctx, x, y) -> { in, out }
S.shuttle(ctx, x, y, { side }) (OR) · S.andValve (two-pressure, AND) · S.quickExhaust · S.ejector -> { P, V } · S.cup -> { V }
```

Conventions: hydraulic ports are P (pressure), T (tank), A and B (to the actuator), X and Y
(pilots), L (drain); pneumatic ports are numbered 1 (supply), 2 and 4 (outputs), 3 and 5
(exhausts), 12 and 14 (pilot signals: 14 connects 1 to 4). Working lines are solid, pilot lines
long-dashed, drain lines short-dashed; a dot marks a connection, lines that cross without a
dot are not connected. Draw the circuit in the state it is in — the working box of each valve
at its ports — and colour the lines by what they carry (`S.col`): pressure red, return blue,
pilot orange, metered yellow, suction green; compressed air blue, exhausting air light blue.
Show gauges with the pressure in bar (and psi where American practice matters).

**Modelling fluid-power circuits.** For most sims a *quasi-steady* model is right and robust:
the pump flow divides between the open paths so that the pressures balance — a cylinder moves
at flow/area, its pressure is load/area plus the losses in its paths (orifice law
$Q = C_d A\sqrt{2\Delta p/\rho}$), and when the pressure it needs exceeds the relief setting
the relief valve takes the surplus flow and the cylinder slows or stops. Use a dynamic model
with oil compressibility ($\dot p = \beta/V\,(\sum Q - A\dot x)$, $\beta \approx 1$–1.5 GPa)
only when the transient is the point — pressure spikes, a load running away, water hammer —
and then integrate in fixed sub-steps of 10–50 µs. For pneumatics, where compressibility *is*
the point, use `kit.fluid.pneuCylinder` or its pattern (`HYPER-PNEUMATICS/sims/reference.js`).

**Tools to link to.** Aerodynamics: the airfoil lab (`#/tools/airfoil`) and the atmosphere and
flight calculators (`#/tools/flight/atmosphere`, `airspeed`, `isentropic`, `normal`, `oblique`,
`wing`). Hydraulics: pipes, pumps and channels (`#/tools/hydro/pipe`, `pump`, `channel`,
`hammer`), fluid-power calculators (`#/tools/fpower/cylinder`, `pump`, `motor`, `orifice`,
`accumulator`, `oil`) and the ISO 1219 symbol chart (`#/tools/iso`). Pneumatics: the pneumatics
calculators (`#/tools/pneu/cylinder`, `valve`, `air`, `leak`, `vacuum`, `receiver`) and
`#/tools/iso`.

**Writing about machines that can hurt — the rules.**

- **Stored energy first.** Wherever work on a system is described, say that pressure must be
  released, accumulators discharged, raised loads supported and energy sources locked out
  first (lock-out/tag-out), in a `> [!warn]` callout.
- **Hydraulic injection.** Oil at hundreds of bar can pierce the skin through a pinhole leak;
  an injection injury looks small but is a surgical emergency — "seek emergency medical care
  at once". Never feel for a leak with a hand; hoses can whip when a fitting fails; oil can be
  hot enough to burn.
- **Compressed air** is never pointed at people or used to blow dust off skin or clothes; a
  receiver and its lines store energy; cylinders can jump when a system is first pressurised
  (soft-start valves); exhausts are loud (silencers, hearing protection).
- **Standards and figures are dated and typical**: ISO 1219-1:2012, ISO 4406:2021, ISO 4413 and
  ISO 4414:2010, ISO 6358-1:2013, ISO 8573-1:2010, ISO 15552; aircraft and machine figures are
  rounded examples. Aerodynamics explains; flying follows the aircraft's approved manuals and
  the rules of the air, and drones the local rules.

### Pharmaceutics and biology

Hyper Pharmaceutics and Hyper Biology have their own modules. References: shelf life and the Arrhenius
equation with a stability study and a dissolving powder (Pharmaceutics); enzyme kinetics with enzymes as
particles and genetic drift in replicate populations (Biology).

**Units.** `concentration` (mM, µM, mol/L), `massconc` (mg/L first, mg/mL, µg/mL — not SI, as in Medicine),
`osmol` (mOsm/L — counted in its clinical unit), `enzymeactivity` (kat, U), `numberdensity` (1/mL, 1/µL for
cells), `rate` (1/s … 1/mo), `time` (… wk, mo, yr), `molarenergy` (kJ/mol), `reactionrate`, `rateconst2`.
Write concentrations in TeX as `\\mathrm{[S]}` and `\\mathrm{[E]}_0` (brackets alone cannot be clicked).
Pharmacy formulas with mixed practical units (mg, mL, h, mg/(mL·day)) use `q: false` labels throughout the
formula, as the Medicine section explains.

```js
const P = kit.pharma;      // pharma.js, tested by tools/test-pharma.js
P.ionised(pKa, pH, acid)  P.solubility({ S0, pKa, pH, acid })  P.logD(logP, pKa, pH, acid)  P.bufferCapacity(C, pKa, pH)
P.noyesWhitney({ D, A, h, Cs, C, V })  P.dissolve({ dose, r0, rho, Cs, D, h, V, T, dt }) -> [[t s, fraction], …]
P.release.zero|first|higuchi|korsmeyer|weibull|hixson  P.f2(ref, test)
P.degrade({ order, k, C0, t })  P.t90({ order, k, C0 })  P.arrhenius({ k1, T1, T2, Ea })  P.shelfLife({ order, kRef, TRef, Ea, T })
P.carr(bulk, tapped)  P.hausner  P.flowClass(ci)  P.heckel(D)  P.stokes({ d, rhoP, rhoF, eta })  P.hlbMix  P.fickFlux  P.aerodynamic
P.naclToAdd({ volume, drugs: [[g, E]] })  P.fpdMethod({ a, b })  P.osmolarity({ gPerL, MW, n })  P.mEq({ mg, MW, valence })  P.dilute  P.alligation
P.f0(profile, z, Tref)  P.logReduction(t, D)  P.dAtT({ D121, z, T })
P.twoComp({ dose, V1, k10, k12, k21 })  P.mmPK({ dose, Vd, Vmax, Km, tau, n })  P.nca(times, concs, nz)  P.be(test, ref, seq)  P.occupancy  P.hill  P.ti
// and kit.med.pk / steadyState / loadingDose / maintenanceDose / emax / cockcroftGault / bsa (medicine.js)

const B = kit.bio;         // bio.js, tested by tools/test-bio.js
B.translate(seq, frame)  B.transcribe  B.revComp  B.gc  B.tm  B.orfs  B.mwProtein  B.mwDNA  B.sites(seq, 'EcoRI')  B.CODE  B.AA  B.ENZYMES  B.CUT  B.ends('EcoRI') (cut, overhang, end type)
B.punnett('AaBb', 'aabb')  B.hardyWeinberg(p)  B.hwTest(nAA, nAa, naa)  B.chiSquare(obs, exp)  B.chiP(chi2, df)  B.haldane(r)  B.kosambi(r)
B.exponential  B.logistic  B.growthCurve  B.lotkaVolterra({ x, y, a, b, c, d, T })  B.competition(…)  B.rk4(f, y, T, dt)
B.mm(S, Vmax, Km, { I, Ki, type })  B.hill  B.wrightFisher({ N, p0, gens, s, h, seed })  B.rng(seed)  B.binomial(n, p, rng)  B.poisson(λ, rng)
B.pcr(N0, cycles, eff)  B.cfu  B.shannon(counts)  B.simpson  B.kleiber(kg)  B.diffusionTime(x, D)  B.osmoticPressure(i, C, T)  B.gelDistance(bp)
```

**Tools to link to** (each has sub-pages, e.g. `[the dilution calculator](#/tools/pharmcalc/dilution)`).
Pharmaceutics: `#/tools/pharmcalc/` dilution, alligation, isotonic, electrolytes, infusion, sterile (F₀ and SAL);
`#/tools/formulation/` solubility (pH profile, log D, BCS), dissolution, release (model fitting, f₂), stability
(Arrhenius, MKT), powder (Carr, Hausner, tensile strength), emulsion (HLB, Stokes); `#/tools/pk/` dosing, nca,
twocomp, nonlinear, be (90 % CI), pd (antagonists, therapeutic index).
Biology: `#/tools/sequence/` analyse, translate (six frames, ORFs, the code table), digest (map and gel), primers
(PCR); `#/tools/genetics/` cross (Punnett), hardy, drift, linkage, chi; `#/tools/cell/` explorer (animal, plant and
bacterial cells), growth (curve, plate count), enzyme (inhibitors, Lineweaver–Burk), predator, competition,
ecology (diversity, mark–recapture), scale (diffusion, Kleiber).

**Writing about medicines — the rules** (in addition to the Medicine section's):

- **Examples are hypothetical.** Dose, dilution, infusion and compounding calculations use clearly
  illustrative drugs and numbers, never real dosing guidance; say that real preparation and dosing follow
  the product information, local protocols and an independent check.
- **Generic names only**, mechanisms and classes; no brand promotion; no advice to start, stop or change a
  medicine — refer to a pharmacist or doctor.
- **No recipes for harm**: never describe how to synthesise, extract, purify or concentrate controlled,
  illicit or dangerous substances, how to defeat abuse-deterrent formulations, or how to obtain medicines
  outside the law. Overdose and toxicity are explained as pharmacology, with emergency callouts and poison
  centre advice.
- Regulatory facts (FDA, EMA, ICH guidelines, pharmacopoeia chapters) are named with their dates and
  described generally.

**Writing about living things — the rules.** Biotechnology, microbiology and virology pages explain how
techniques and organisms work; they are not protocols. No step-by-step methods for culturing pathogens,
enhancing transmissibility or virulence, producing toxins or modifying viruses; biosafety described
generally. Human genetics is accurate and respectful (human variation is mostly within populations;
"races" are not discrete biological categories); people-first language for genetic conditions.

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
