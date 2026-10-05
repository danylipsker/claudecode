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
| `js/pharma.js` | Pharmaceutics (kit.pharma): ionisation, pH–solubility, log D and buffer capacity; Noyes–Whitney dissolution of a powder, release models and f₂; degradation orders, t₉₀, Arrhenius shelf life; powder flow, Heckel, Stokes, HLB, Fick; isotonicity, osmolarity, mEq, dilution and alligation; F₀ and log reduction; two-compartment and Michaelis–Menten kinetics, non-compartmental analysis, bioequivalence, occupancy and the Hill equation |
| `js/bio.js` | Biology (kit.bio): the genetic code, reverse complement, translation, open reading frames, GC and Tm, molar masses, restriction sites with cut positions and end types; Punnett squares, Hardy–Weinberg and χ² tests, map functions; growth, predator–prey and competition models, Michaelis–Menten with inhibitors, Wright–Fisher drift, PCR, plate counts, diversity indices, Kleiber scaling, gel migration |
| `js/quantum.js` | Quantum behaviour, QED and fields (kit.qm): complex arrows and their sums, QED's mirror and glass sheet, slit patterns and sampling, a Crank–Nicolson Schrödinger solver, stationary states of 1-D potentials, barrier transmission, two-state systems and the ammonia molecule, spin-½ and spin-1 rotations, Lorentz boosts, fields and field lines of charges and currents, the action of a path and the stationary path, Planck, hydrogen, oscillator states |
| `js/glossary.js` | The math terms dictionary (122 terms in 9 groups): what each symbol means and how to deal with it; `[[?term]]` markup in any text and detection of the terms in a formula's TeX |
| `js/motors.js` | Motors (kit.motor): torque and power, brushed DC motors (the torque–speed line, transients, PWM ripple), induction motors (the per-phase equivalent circuit with deep-bar rotors, torque–slip curves, V/f), steppers (torque against speed), move profiles, reflected inertia and RMS torque, screws, belts and encoders, winding heat, duty and insulation classes, IE efficiency classes and IEC frames, hydraulic and air motors, cable voltage drop, braking energy, the Steinmetz capacitor |
| `js/ergo.js` | Ergonomics (kit.ergo): representative anthropometry for men and women (24 dimensions), percentiles and mixed populations, how many a range fits, manikin link lengths, workstation rules, the revised NIOSH lifting equation, noise dose and L_EX,8h, vibration A(8) and the EU values, Fanger's PMV/PPD, WBGT, wind chill, Pandolf's load carriage, Fitts and Hick, Blondel's stair rule, lighting levels |
| `js/projection.js` | Projections (kit.proj): 4 × 4 matrices and the principal views, axonometric (isometric, dimetric, trimetric with their foreshortenings), oblique and planometric, the perspective matrix, cameras (lookAt, the OpenGL matrices), vanishing points and lines, fisheye / cylindrical / equirectangular mappings, the sphere and its geodesy (great circles, rhumb lines), a registry of about 45 map projections (azimuthal, cylindrical, conic, pseudocylindrical, compromise, polyhedral nets, Ptolemy's) with graticules, outlines, path clipping, numeric inverses and Tissot's indicatrix, and wireframe models with hidden-line tests |
| `js/geodata.js` | The world for the map lab (kit.world): simplified coastlines of the continents and larger islands, a few lakes, sixty cities |
| `js/celestial.js` | The sky (kit.sky): Julian date and sidereal time, horizon / equatorial / ecliptic / galactic coordinates and the rotations between them, the Sun, the Moon and the planets to a fraction of a degree, rise, set and transit, the Sun's path and the analemma, 654 bright stars with the stick figures of all 88 constellations |
| `js/construct.js` | The ruler-and-compass construction kit: a drawing as a sequence of steps each made with one named hand tool (straightedge, T-square, set square, compass, dividers, scale, protractor, pencil, fold, thread), plane geometry helpers, 3-D projection helpers (`k.project`, `k.wire`), an SVG renderer that draws step by step, and the targets the practice board checks |
| `js/optics.js` | Geometrical optics (kit.optics): spectral lines and bands, some forty optical materials with their dispersion (Sellmeier or n_d, V_d), metals, Snell and Fresnel (complex indices), prisms, the rainbow, thin lenses, ray-transfer matrices and cardinal points, lens systems as prescriptions with first-order properties and pupils, exact ray tracing through spherical, conic and aspheric surfaces and mirrors, spot diagrams, ray fans, longitudinal and chromatic aberration, Seidel sums, a library of prescriptions (singlets, an achromat, the Cooke triplet, a double Gauss, mirrors, a Cassegrain, a schematic eye) and design helpers (singlet by shape factor, achromat, telescopes, two-group zoom) |
| `js/optics-wave.js` | Wave optics (kit.optics): thin-film stacks by the characteristic matrix with ready-made coatings (anti-reflection, mirrors, band-pass and edge filters, metal mirrors), the etalon, Bessel functions and Fresnel integrals, slits, the Airy pattern, gratings, resolution criteria, MTF of lens, pixel, defocus and motion, Gaussian beams through lenses, resonator stability and modes, the laser families, laser classes and exposure limits, polarization by Jones vectors, Stokes parameters and Mueller matrices |
| `js/optics-vision.js` | Light as people and cameras meet it (kit.optics): photometry and Planck, spectra of lamp families, lamp bases and bulb shapes, CIE 1931 colour matching, chromaticity, sRGB, CIELAB, an approximate Munsell system, colour-vision deficiencies, sensor formats and lens mounts with their flange distances, field of view, depth of field, exposure, photons and noise, zoom and resampling, the eye (accommodation, pupil, acuity, prescriptions, progressive lenses), scanners, beam shaping, optical fibres and their connectors |
| `js/opticsym.js` | Drawing optics on a canvas (kit.osym): lenses with their true surfaces, mirrors, whole prescriptions with their rays, stops, screens and sensors, eyes and light sources, prisms and beam splitters, rays coloured by wavelength, beams, waves and wavefronts, angle marks and dimensions, spectra, fringe patterns and spot diagrams |
| `js/esp32-chips.js`, `js/esp32-boards.js` | Hyper ESP32's catalogue, compiled from datasheets and makers' pages (dated in the file): 15 Espressif chips with their numbers, virtues and limits, every GPIO of 11 of them (ADC, touch, strapping, flash, USB, state at reset, a verdict), 89 modules, 573 boards from 29 makers with what each carries, 70 of them with their header pins, and 79 finished products with an ESP inside |
| `js/esp32.js` | Questions asked of that catalogue (`Hyper.esp`): pins and their kinds, a pin planner that assigns pins to a list of jobs and says why, and the project advisor — needs read out of a description in words, chips scored and ranked with the reasons and what rules the others out, boards that carry the winner |
| `js/esp32-calc.js` | The arithmetic of ESP projects (kit.esp): LEDC PWM and servos, the ADC and dividers, NTCs, batteries and duty cycles, link budgets, Wi-Fi/BLE/802.15.4 channels, LoRa air time, UART / I2C / SPI / 1-Wire / WS2812 / CAN / NEC / quadrature as edge lists, CRCs, flash partitions, timers, a fixed-priority scheduler, filters, debouncing, PID and a first-order plant, move profiles, and state machines that run, are checked, drawn and turned into C++ and MicroPython |
| `js/espcode.js`, `js/esp32-api.js` | Programs on a page (`Hyper.code`): syntax highlighting for C++, Python, YAML, JSON and shell; the block notation — parser, categories and the renderer; checks (blocks parse, brackets balance, API forms that are out of date) and the versions the programs are written for |
| `js/espgfx.js` | Displays without hardware (kit.gfx): frame buffers of 1, 8 and 16 bits with the classic 5 × 7 font and drawing primitives, an HD44780 character LCD, seven-segment digits, a widget kit with hit testing, resistive-touch calibration, frame sizes and bus frame rates, a catalogue of 28 display modules, and drawing in OLED, TFT, e-paper, LED and round styles |
| `js/espsym.js` | Drawing ESP projects on a canvas (kit.esym): boards with their real header pins coloured by kind, chips, modules, LEDs, pixels, buttons, relays, servos, motors, batteries, wires, breadboards, logic-analyser traces, bit boxes, packets, memory layers, current timelines, network nodes and messages, radio rings, antenna patterns, state-machine diagrams |
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
| `js/ui/pharmatools.js` | Hyper Pharmaceutics' tools: pharmacy calculators (strength and dilution, alligation, isotonicity, mmol/mEq/mOsm, infusion rates, F₀ and SAL); formulation (pH–solubility and BCS, dissolution, release-model fitting and f₂, Arrhenius shelf life and mean kinetic temperature, powder flow and tablet strength, HLB and creaming); pharmacokinetics (dosing regimens, NCA of pasted data, two compartments, saturable elimination, a bioequivalence CI, dose–response and therapeutic index) |
| `js/ui/biotools.js` | Hyper Biology's tools: a sequence workbench (composition, six-frame translation and ORFs, the genetic code, restriction digest with map and virtual gel, primers and PCR); genetics (crosses and Punnett squares, Hardy–Weinberg, drift, linkage mapping, χ²); a cell explorer (animal, plant and bacterial cells) and calculators for microbial growth, enzyme kinetics, predator–prey, competition, diversity and mark–recapture, size and metabolic scaling |
| `js/ui/terms.js` | Math terms everywhere: the card that opens from a `[[?term]]` or a formula chip, the chips under every formula card, and Tools → Math terms (all apps) |
| `js/ui/feyntools.js` | Hyper Feynman's tools: QED arrows (a mirror where every point reflects, scraped into a grating; a glass sheet), the two-slit lab in real units, a space-time diagram with boosts and the twin paradox, field lines and equipotentials of charges and currents, quantum wells (stationary states, sloshing mixtures, wave packets) |
| `js/ui/motortools.js` | Hyper Motors' tools: a motor lab (DC, induction on the mains or a VFD, stepper, hydraulic, air), sizing (linear axis, conveyor, hoist, pump or fan energy, cable drop, a motor-family selection guide), interactive wiring (three-phase terminal box, single-phase motors, starter control circuits, stepper leads, sensors and switches) and drives (PWM ripple, step/dir with DIP switches, VFD ramps, starting methods compared, homing) |
| `js/ui/construct.js` | Hand constructions on a page (Hyper Projections): the construction card with its step player (animated stroke per step, worksheet printing, SVG download), the practice board (virtual point, straightedge, compass, dividers, set square and pencil; snapping to intersections; every stroke checked against the step; hints, show, undo, best runs) and the Tools → Constructions gallery |
| `js/ui/projtools.js` | Hyper Projections' tools: the projection lab (the picture and its projectors in space for every parallel and central projection, six views on a sheet in first and third angle, a matrix workbench), the perspective lab (one-, two- and three-point with live vanishing points, curvilinear 4-, 5-, 6-point and lens mappings, the plan-and-elevation construction step by step), the map lab (every projection with graticule, coastlines, Tissot's indicatrix, routes and a globe; a gallery) and the sky lab (the sky from any place and time as a camera view, all-sky fisheye, stereographic, planisphere and all-sky chart; the sun-path diagram and the analemma) |
| `js/ui/ergotools.js` | Hyper Ergonomics' tools: body sizes (who a range fits; one person's every dimension beside another), workstation fitter (seated and standing, across the range of users), lifting (the NIOSH equation, load carriage), the environment (noise, vibration, thermal comfort, heat, cold, lighting) and the Dimension finder that gathers every recommended range |
| `js/ui/optictools.js`, `js/ui/optics-*.js` | Hyper Optics' tools: the Optics dictionary (every term the pages define, A to Z, with abbreviations) and the labs — ray bench, lens lab, camera and lens calculators, coatings and glass, colour lab with the chromaticity diagram and the Munsell wheel, the eye and its glasses, lasers and beams, a gallery of illusions |
| `js/ui/espcode.js`, `js/ui/esptools.js`, `js/ui/esp-*.js` | Hyper ESP32's program card (blocks, Arduino C++, MicroPython, ESP-IDF, ESPHome — one choice of language kept across pages) and its tools: project advisor, chip explorer and comparison, board finder, pinout explorer with the pin planner and boot-pin table, block lab, display and GUI lab, state-machine lab, signal lab, calculators, dictionary |
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
node HYPER-CORE/tools/test-pharma.js                  # solubility, dissolution, release, stability, powders, isotonicity, F₀, PK models, NCA, bioequivalence
node HYPER-CORE/tools/test-bio.js                     # genetic code, ORFs, Tm, restriction ends, Punnett, Hardy–Weinberg, χ², growth, enzymes, drift, lab numbers
node HYPER-CORE/tools/test-quantum.js                 # complex arrows, QED glass and mirror, slits, Crank–Nicolson, box and oscillator energies, barriers, two-state systems, spin, Lorentz, fields, least action, Planck, hydrogen
node HYPER-CORE/tools/test-motors.js                  # DC line and transients, PWM ripple, induction curves and deep bars, V/f, steppers, move profiles, inertia, screws, encoders, heat, IE classes, hydraulic and air motors
node HYPER-CORE/tools/test-ergo.js                    # percentiles and mixed populations, workstation rules, the NIOSH multipliers and limits, noise and vibration exposure, PMV/PPD against ISO 7730's worked examples, WBGT, wind chill, Pandolf
node HYPER-CORE/tools/test-optics.js                  # glass catalogue values, Snell and Fresnel, prisms, matrices, ray tracing against Seidel theory, the triplet and the double Gauss, coatings, diffraction, MTF, beams, laser classes, polarization, colour, lamps, mounts, the eye, scanners, fibres, the drawing kit
node HYPER-CORE/tools/labtest.js                      # runs the Tools labs of Hyper Optics headless, every control to its ends
node HYPER-CORE/tools/test-esp32.js                   # the chip, pin and board catalogue, the pin planner, the project advisor, PWM/ADC/battery/radio arithmetic, bus signals, CRCs, state machines, displays, the block notation
node HYPER-CORE/tools/labtest.js --app esp32          # runs the Tools labs of Hyper ESP32 headless
node HYPER-CORE/tools/test-espblocks.js               # the block lab: programs run on the virtual board, and the C++ and MicroPython written from blocks
node HYPER-CORE/tools/test-displaylab.js              # the display and GUI lab: widgets, touch calibration, the LVGL / GFX / MicroPython code it writes
node HYPER-CORE/tools/test-fsmlab.js                  # the state-machine lab: designs, checks, generated code
node HYPER-CORE/tools/test-signals.js                 # the signal lab: every bus model decoded back from its own edges
node HYPER-CORE/tools/test-espcalc.js                 # the calculators: worked cases and fuzzing
node HYPER-CORE/tools/compile-esp32.js --report       # builds every Arduino C++ program of Hyper ESP32 with arduino-cli and the ESP32 core, if they are installed (about an hour and a half); writes HYPER-ESP32/COMPILED.md
node HYPER-CORE/tools/wire.js HYPER-ESP32             # lists new content, simulation and lab files in the app's index.html
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
