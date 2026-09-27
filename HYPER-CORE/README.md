# HYPER-CORE — the engine behind the Hyper apps

Hyper Physics, Math, Electronics, Chemistry, Finances and Medicine are one engine with
different content. This folder is the engine: the concept graph, a TeX to
MathML renderer, an expression engine that solves any formula for any variable, units
and constants, the calculators, concept maps, simulations kit, practice and progress.

Plain JavaScript and CSS: no build step, no libraries, no network. A discipline is a
folder beside this one with an `index.html` that loads the engine and its own content.

## Why separate apps with one engine

Each discipline is its own app, with its own home page, map, formula sheet and
progress, so it stays focused and fast. But they share everything else, and they link
into each other: a physics page lists `math:vectors` as a prerequisite and the link
opens Hyper Math on that page; each app loads the other's `catalog.js`, so those links
carry real titles and the search box finds concepts in both. A new discipline costs
only its content.

## Files

| File | What it does |
|---|---|
| `js/hyper.js` | Namespace, registry (`Hyper.add`, `Hyper.sim`, `Hyper.catalog`), the graph (children, "leads to", branches, reading order, learning paths), utilities |
| `js/tex.js` | TeX subset → MathML, drawn natively by the browser. Every symbol carries `data-k` so formulas can be highlighted and clicked. `\ce{...}` renders chemical formulas and equations (mhchem-like: charges, states, isotopes, hydrates, arrows with conditions) |
| `js/expr.js` | Expression parser (implicit multiplication, functions), compiler, symbolic isolation of a variable, TeX output, numeric root finder, answer equivalence |
| `js/units.js` | 102 quantities with their units (SI plus common alternatives, including molarity, molality, kJ/mol, rate constants, money in the reader's currency and time in years) and 43 physical constants |
| `js/text.js` | The content's Markdown dialect: inline/display math, `[[concept]]` links, links to other apps and to views, callouts, tables |
| `js/formula.js` | A formula as a calculator: solve for any variable, all roots in a range, generated practice problems with worked solutions |
| `js/circuit.js` | A circuit simulator (modified nodal analysis): DC operating point, transient steps, small-signal AC; R, C, L, sources, diodes (LED, Zener), switches, BJTs, MOSFETs, op-amps with rails and gain–bandwidth; E-series values |
| `js/chem.js` | The chemistry module: the 118 elements (masses, electronegativity, ionisation energy, radii, oxidation states, electron configurations with the exceptions, CPK colours), formula parsing (brackets, hydrates, charges), molar mass and composition, exact equation balancing (BigInt row reduction, ions and electrons), VSEPR geometry and a small library of 3-D molecules |
| `js/finance.js` | The arithmetic of money: level and equal-capital loans with extras, rate changes, index-linking and balloons; APR, NPV and IRR; savings plans, drawdown and Monte Carlo futures; bonds (price, yield, duration, convexity); Black–Scholes; two-asset portfolios; leverage and margin |
| `js/medicine.js` | Physiology and clinical arithmetic: a synthetic ECG in eleven rhythms, the Hodgkin–Huxley neuron, Nernst and Goldman potentials, oxygen saturation, one-compartment drug levels, Bayes for test results, risk and NNT, an SIR epidemic, and the standard clinical formulas (BMI, BSA, eGFR 2021, Cockcroft–Gault, MAP, QTc, anion gap, fluids …) |
| `js/fluid.js` | Fluid mechanics for engineers: the standard atmosphere, isentropic flow, normal and oblique shocks, Prandtl–Meyer; NACA airfoils and a Hess–Smith panel method, thin-airfoil and lifting-line theory; boundary layers; pipe friction (Colebrook), pumps and affinity laws, open channels, water hammer, orifices, oil viscosity; ISO 6358 valve flow, dew points, compression work and a simulated pneumatic cylinder |
| `js/fluidsym.js` | Fluid-power symbols in the manner of ISO 1219-1 for simulations (kit.fsym): directional valves with sliding boxes and actuators, pumps, motors, cylinders, pressure and flow valves, accumulators, conditioning, pneumatic logic, vacuum, lines coloured by what they carry and moving flow dots |
| `js/molecule.js` | Molecules in 3-D on a canvas: perspective, drag to turn, depth-sorted ball-and-stick or space-filling atoms, multiple bonds, lone-pair lobes, bond-angle arcs |
| `js/schematic.js` | Circuit symbols (passives, sources, diodes, transistors, op-amp, logic gates, meters), moving current dots and an oscilloscope screen, for simulations |
| `js/ui/app.js` | Shell, router, contents tree, search, link previews, saved progress, theme, home page, shortcuts |
| `js/ui/concept.js` | The concept page: map, explanation, formulas, simulations, examples, practice, connections |
| `js/ui/calc.js` | The formula card (calculator, sliders, units, relationship graph, inline practice) |
| `js/ui/map.js` | The local concept map on every page, and the zoomable radial map of the whole discipline |
| `js/ui/practice.js` | Questions (multiple choice, true/false, typed expressions, numbers with units), sessions, flashcards, daily review |
| `js/ui/money.js` | Tools → Money calculators (Hyper Finances): loan and mortgage with its schedule and CSV, comparing offers, savings, financial independence, CAGR and IRR, inflation, credit cards; the reader's currency |
| `js/ui/medtools.js` | Hyper Medicine's tools: a clickable body map of the organs, and medical calculators (body size, kidney function, blood pressure and QTc, blood chemistry and lab units, test results as 1 000 people, treatment benefit, fluids) |
| `js/ui/fluidtools.js` | The tools of Hyper Aerodynamics, Hydraulics and Pneumatics: an airfoil lab (panel method, lift curve, critical Mach, coordinates for CAD), atmosphere and gas-dynamics calculators, a finite wing; pipes, pumps, channels and water hammer; cylinder, pump, motor, orifice, accumulator and oil calculators; pneumatics calculators (air and cost, valve flow, condensate, leaks, vacuum cups, receivers); the ISO 1219 symbol chart |
| `js/ui/views.js` | Formula sheet, tools (function plotter, calculator, unit converter, constants, interactive periodic table, symbol glossary, A–Z index; in Hyper Chemistry also a molar-mass calculator and equation balancer), progress, learning paths |
| `js/ui/plot.js` | A canvas plotter (nice ticks, log axes, hover read-out) |
| `js/ui/simkit.js` | The kit simulations are built with, and the card they live in |
| `css/hyper.css` | The look: light and dark themes, discipline and branch hues, responsive down to phones |
| `AUTHORING.md` | How to write content: schema, text, TeX, formulas, quizzes, simulations |

## Tools

```bash
node HYPER-CORE/tools/test-core.js                    # unit tests of the engine (TeX, expressions, units, formulas)
node HYPER-CORE/tools/test-circuit.js                 # the circuit simulator against textbook results
node HYPER-CORE/tools/test-finance.js                 # loans, APR, NPV/IRR, savings, Monte Carlo, bonds, options, money formatting
node HYPER-CORE/tools/test-medicine.js                # clinical formulas against published values, ECG, neuron, oxygen, drug levels, Bayes, SIR, lab units
node HYPER-CORE/tools/test-fluid.js                   # atmosphere, shock tables, panel method, Moody chart, channels, water hammer, ISO 6358, the symbol kit
node HYPER-CORE/tools/test-chem.js                    # elements, configurations, molar masses, balancing, VSEPR, \ce notation
node HYPER-CORE/tools/validate.js HYPER-PHYSICS       # checks all content: links, TeX, formulas solve both ways, quizzes
node HYPER-CORE/tools/simtest.js HYPER-PHYSICS        # runs every simulation headless, every control to its ends
node HYPER-CORE/tools/catalog.js --all                # regenerates each discipline's catalog.js (titles for cross-links)
```

`validate.js --final` also requires every planned concept to exist; `--only a.js,b.js`
limits the report to some files.

## Adding a discipline

1. Add it to `Hyper.DISCIPLINES` in `js/hyper.js` (id, title, folder, hue, `ready: true`)
   and to the folder maps in `tools/validate.js` and `tools/catalog.js`.
2. Copy `HYPER-MATH/index.html` into the new folder and change the discipline id and
   the content scripts.
3. Write `content/outline.js` (root, branches with `icon` and `hue`, topics with `plan`)
   and the content files, following `AUTHORING.md`.
4. Run the validator and the simulation test; run `catalog.js --all` so the other apps
   can link to the new one.

## Progress and privacy

Progress (visited pages, answers, bookmarks) is kept in the browser's `localStorage`
under `hyper:<discipline>`; the theme under `hyper:settings`. Nothing leaves the page.
The Progress view exports and imports it as JSON.
