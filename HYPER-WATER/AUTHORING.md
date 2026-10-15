# Hyper Water — authoring guide

This is the guide for writing a topic of Hyper Water. Read **`HYPER-CORE/AUTHORING.md` first, lines 1–290**
(the format of a concept, text and TeX, the backslash trap, formulas as calculators, examples and quizzes,
simulations and the kit) and its section *Checking your work*. The sections in between belong to other apps.
This file adds what is special here: the `terms` of every page, the water engine and the drawing kit, the
sources, and the rules of the subject. Then read the three reference pages and their simulations —
`content/reference.js` and `sims/reference.js` — they set the depth, tone and layout.

Plain JavaScript, no build step, no libraries, no network at run time. **All text must be original**: write
every explanation, example and question yourself; do not fetch or paraphrase any web page, book, film or
transcript. Standard physics and chemistry, published constants, measured values and the findings of named
papers are of course fine — state them in your own words and say where they come from.

## What the app is, and who reads it

Dany asked for an app that presents "what is water, how surprising and unique it is", built from the science
behind a two-hour film, *The Strange Reason All Life Depends On One Molecule* (Sundown Science, 2026), and the
thirteen sources listed under it (digested in **`SOURCES.md`**; use its facts and cite its sources by name). The
reader is an intelligent adult — a student, an engineer, a teacher, a curious person who has just learned that
ice should not float — who wants each surprising fact explained properly, with its number, its reason and its
consequence. The thread of the whole app is one argument: **the bent, lopsided molecule makes a hydrogen bond
that is strong enough to hold and weak enough to let go, and every strange property of water follows.** Every
page should connect back to that thread at least once.

So every concept page has, besides the explanation, key ideas, mix-ups, formulas, examples and quiz of any
Hyper page:

1. **Terms** (`terms: [...]`, 3–6 per page): the vocabulary the page introduces, each with a definition of one
   to three sentences that stands on its own, and the other names and abbreviations it goes by. They are shown
   on the page ("Terms on this page"), gathered into the **Water dictionary** (Tools), and found by the search
   box.
   ```js
   terms: [
     { term: 'Latent heat of vaporisation', also: ['enthalpy of vaporisation', 'ΔH_vap', 'heat of evaporation'],
       def: 'The heat needed to turn a unit mass of liquid into vapour at constant temperature: 2,257 kJ/kg for water at 100 °C, 2,442 kJ/kg at 25 °C — the highest of any common liquid.' },
     …
   ]
   ```
   Define a term on the page where it *belongs*; elsewhere, link to that page.
2. **A simulation** (`sim: 'id'`): water should be seen, and every page shows its idea. One simulation may serve
   two or three pages through `params` (`sim: { id: 'xx-lake', params: { season: 'winter' } }`); a topic of ten
   pages needs about six to eight simulations. Use the engine (`kit.water`) for every number — never type a
   density, a vapour pressure or a heat capacity a function could give you — and the drawing kit (`kit.wsym`)
   for molecules, bonds, lattices, drops and glassware.
3. **Real numbers**, with units, in a table where there are several: densities, energies in kJ/mol and kJ/kg,
   temperatures, pressures, times (picoseconds for bonds, years for residence times), distances in ångström and
   in light-years. Say where a number comes from ("IAPWS", "USGS", "measured by Cassini", "Koch et al. 2004").
   Give the *comparison* that makes the number surprising: iron's specific heat next to water's, methane's boiling
   point next to water's, a comet's deuterium next to the ocean's.
4. **Where you meet it** (`applications: [...]`, 3–5 items) and, where the idea has a story, `history`.
5. **Sources** (`sources: [...]`, 2–4): the paper, book chapter, data source or mission behind the page. Use the
   thirteen film sources where they apply (named in `SOURCES.md`, each with what it establishes) and standard
   references otherwise: Eisenberg and Kauzmann, *The Structure and Properties of Water*; Franks (ed.), *Water: A
   Comprehensive Treatise*; Ball, *H₂O: A Biography of Water*; Petrenko and Whitworth, *Physics of Ice*; Finney,
   *Water: A Very Short Introduction*; the CRC *Handbook of Chemistry and Physics*; the IAPWS releases; the USGS
   Water Science School; Atkins, *Physical Chemistry*; Taiz and Zeiger, *Plant Physiology* (for trees); the IPCC
   AR6 report (for climate numbers); NASA and ESA mission pages. Never invent a title, an author, a year or a
   number.

The validator warns when a page has no simulation, fewer than two terms, no applications or no sources.

A body runs **1800–3500 characters** with `###` subheadings: a concrete picture first (a glass, a lake, a cell,
a comet), then the mechanism, then the numbers with their comparisons, then what follows from it and what it is
confused with. British spelling (vapour, colour, centre, metre, grey, sulfur as IUPAC spells it) with *-ise*
(vaporise, ionise, crystallise). End with a `> [!key]` callout that states the page in two sentences.

## Files

```
HYPER-WATER/
  content/outline.js            the branches, topics and planned concepts (do not edit)
  content/reference.js          the three reference concepts (do not edit): what-a-hydrogen-bond-is, why-ice-floats, specific-heat-of-water
  content/<topic>.js            your concepts                                   ← you write
  sims/reference.js             ref-hbond-network, ref-ice-floats, ref-heat-capacity (do not edit)
  sims/<topic>.js               your simulations                                ← you write
  AUTHORING.md                  this file
  SOURCES.md                    what each of the film's sources establishes, with its numbers
HYPER-CORE/js/water.js          kit.water — density, vapour pressure, the phase diagram, properties, solutions, humidity, the network, data
HYPER-CORE/js/watersym.js       kit.wsym  — molecules, hydrogen bonds, a flickering network, ice lattices, snowflakes, drops, beakers, thermometers
HYPER-CORE/tools/test-water.js  the engine's tests: short examples of every function in use
```

Write only `content/<topic>.js` and `sims/<topic>.js` for your topic id. Do not edit the outline, the reference
files, anything in `HYPER-CORE`, `index.html`, or another writer's files; the integrator wires your files in.
Wrap the sims file in `(function () { 'use strict'; … })();`. Every simulation id starts with your **topic
code** (given in your brief), e.g. `ice-lake-seasons`.

**Ids.** Use the ids of your topic's `plan` in the outline, exactly. The three reference concepts are not to be
written again. Link freely to any planned id of the whole outline — `[[the-density-maximum]]`,
`[[enceladus|the plumes of Enceladus]]` — whether or not it is written yet. Links to other apps (the validator
checks the id against that app's `catalog.js`):

- `chemistry:` hydrogen-bonding intermolecular-forces bond-polarity molecular-polarity vsepr isotopes
  lattice-energy vapor-pressure phase-diagrams clausius-clapeyron crystal-structures surface-tension-viscosity
  solutions solubility henrys-law colligative-properties osmotic-pressure calorimetry entropy arrhenius-equation
  equilibrium le-chatelier solubility-product acid-base-theory water-autoionization ph-scale amino-acids-proteins
  enzyme-kinetics molarity concentration-units gas-laws ideal-gas-law
- `physics:` density pressure hydrostatic-pressure buoyancy viscosity surface-tension thermal-expansion
  specific-heat latent-heat heat-transfer conduction convection kinetic-theory entropy sound speed-of-sound
  dielectrics shear-bulk-modulus tides crystal-structure planets
- `biology:` water-in-life ph-in-biology protein-structure enzymes membranes membrane-structure diffusion-osmosis
  water-potential photosynthesis transpiration thermoregulation-animals osmoregulation climate-ecosystems
- `hydraulics:` density-specific-weight viscosity viscosity-temperature bulk-modulus vapour-pressure
  surface-tension hydrostatics pressure-with-depth buoyancy-archimedes cavitation water-hammer
  groundwater-darcy water-supply water-resources
- `medicine:` electrolytes acid-base-balance thermoregulation blood blood-composition kidney-function
  urine-concentration membrane-transport · `aerodynamics:` humidity-air air-density speed-of-sound ·
  `pneumatics:` humidity-dew-point condensate · `feynman:` brownian-movement flow-of-wet-water
  kinetic-theory-feyn entropy-and-order dielectrics-feyn · `math:` polar-coordinates

Use two to four **prerequisites** per page (they draw the concept map), mostly from your own topic and the ones
before it in the outline; the three reference pages are good prerequisites for almost anything.

## Conventions

- **Temperature** in °C in text and controls; in kelvin where thermodynamics needs it (say which). In a formula a
  variable with `q: 'temperature', unit: '°C'` arrives in **kelvin**, which is right for $RT$, Clausius–Clapeyron
  and Arrhenius; a difference is `q: 'dtemp'`. Never write $T + 273.15$ into an expression: declare the variable
  as a temperature and let the calculator convert.
- **Pressure** `q: 'pressure'` (Pa, kPa, MPa, GPa, bar, atm, mmHg); say *absolute* or *gauge* where it matters.
- **Energy**: `q: 'molarenergy'` (kJ/mol) for bonds and enthalpies per mole, `q: 'latent'` (kJ/kg) per mass,
  `q: 'specificheat'` (J/(kg·K)), `q: 'energy'` (J, kJ, MJ) for amounts. **Density** `q: 'density'` (kg/m³,
  g/cm³), **surface tension** `q: 'surfacetension'` (mN/m), **viscosity** `q: 'viscosity'` (mPa·s),
  **thermal conductivity** `q: 'thermcond'`, **expansion** `q: 'expansion'` (1/K, ppm/K), **concentration**
  `q: 'concentration'` (mol/L, mmol/L), **molality** `q: 'molality'`, **volume** (L, mL, km³ is not a unit — use
  m³ or give km³ as a plain number), **time** (ps, s, min, h, day, yr). Ratios shown as percentages are
  `q: 'ratio', unit: '%'` (the formula receives a fraction). Constants: `T0` (273.15 K), `rhoW` (1000 kg/m³),
  `cW` (4186 J/(kg·K), tex $c_w$ — write $c_w$ in your tex), `R`, `kB`, `NA`, `atm`, `g`, `G`, `Msun`, `AU`, `ly`.
- **Ångström** is not a unit the calculator knows: give bond lengths in `pm` (`q: 'length'`) or as plain numbers
  "(Å)" in a variable's name. **Debye** likewise: a plain number named "(D)".
- Say "hydrogen bond", "ice Ih", "vapour pressure", "heavy water (D₂O)", "deuterium-to-hydrogen ratio (D/H)",
  "Vienna Standard Mean Ocean Water (VSMOW)". Use `$\\ce{H2O}$`, `$\\ce{D2O}$`, `$\\ce{H3O+}$`, `$\\ce{OH-}$` in maths.
- Dates and findings: give the year and the people ("Cleeves and colleagues, 2014"; "Rosetta's ROSINA
  instrument, 2014"; "Koch, Sillett, Jennings and Davis, 2004"). Where a result is contested (the Mpemba effect,
  the liquid–liquid critical point, the source of Earth's water), say so and give the state of the argument;
  where a claim is pseudoscience (water memory, "structured water"), say so plainly and explain how it was tested.
- Never name the engine or its functions in reader-facing text (the validator warns): write "the density at this
  temperature", not "W.density(T)".

## The engine: `kit.water` (water.js)

Every number on a page about a property should be the engine's number (or quote the same source the engine
uses). Temperatures are °C unless the function says K.

```
const W = kit.water;
W.density(T)  W.densityIce(T)  W.densityD2O(T)  W.TMAX (3.98)  W.RHO_MAX  W.expansion(T)      kg/m³; 1/K
W.vapourPressure(T)  W.sublimationPressure(T)  W.saturationPressure(T)  W.boilingPoint(p Pa) -> °C
W.meltingPressure(T K)  W.meltingPoint(p Pa) -> { T (K), ice: 'Ih'|'III'|'V'|'VI'|'VII' }  W.MELT  (IAPWS melting curves)
W.phaseAt(T K, p Pa) -> 'liquid' | 'vapour' | 'supercritical' | 'ice Ih' | 'ice VI' | …   W.ICE_BOUNDARIES (approximate solid–solid lines, [[T K, p MPa], …])
W.TRIPLE { T: 273.16, p: 611.657 }  W.CRITICAL { T: 647.096, p: 22.064e6, rho: 322 }
W.surfaceTension(T) N/m   W.viscosity(T) Pa·s   W.kinematicViscosity(T)   W.heatCapacity(T) J/(kg·K)   W.heatCapacityIce(T)   W.heatCapacitySteam
W.thermalConductivity(T)  W.thermalConductivityIce   W.dielectric(T)   W.speedOfSound(T)   W.compressibility(T) 1/Pa   W.bulkModulus(T)
W.pKw(T)  W.Kw(T)  W.pHneutral(T)  W.conductivityPure(T) S/m   W.ionFraction(T)   W.selfDiffusion(T) m²/s
W.latentVaporisation(T) J/kg   W.LATENT_FUSION   W.LATENT_SUBLIMATION   W.ccSlope(T) Pa/K   W.heatToWarm(m, T1, T2) J (ice → water → steam)
W.henry(gas, T) mol/(L·atm) for O2 N2 CO2 He Ne Ar H2 CH4 NH3 SO2 H2S Cl2   W.HENRY   W.dissolvedOxygen(T, salinity) mg/L
W.freezingDepression(m, i) K   W.boilingElevation(m, i)   W.osmoticPressure(M mol/L, i, T K) Pa   W.Kf  W.Kb   W.SEAWATER { salinity, density, freezing, osmotic, ions }   W.densityBrine(S, T)
W.laplace(r, σ)  W.laplaceBubble(r, σ)  W.jurin(r, θ°, σ, ρ) m   W.capillaryLength(T) m (2.7 mm)   W.bondNumber(L, T)   W.youngContact(σsg, σsl, σlg) °
W.relativeHumidity(T, Td)  W.dewPoint(T, RH)  W.absoluteHumidity(T, RH) kg/m³  W.mixingRatio(T, RH, p)  W.wetBulb(T, RH) °C  W.kelvinRatio(r, T)
W.hbondsPerMolecule(T) (≈3.7 at 25 °C)  W.hbondLifetime(T) s (1.2 ps at 25 °C)  W.HBOND { energy, covalent, OO, OH, angle, dipole, oscillation, reorganisation, kT }
W.molecules(massKg)  W.moleculesPerLitre(T)  W.molarVolume(T) cm³/mol  W.meanSpeed(T)  W.M  W.NA  W.R  W.Rs
W.MOLECULES   CH4 NH3 H2O HF Ne H2S H2Se H2Te CH3OH CO2 — { name, tex, mass, mp, bp, dipole, shape, donors, acceptors, note }   W.ladderExpected (−80 °C)
W.LIQUIDS     water ethanol methanol acetone hexane benzene glycerol oil mercury ammonia — { cp, sigma, eta, eps, k, Lv, rho, bp }   W.SOLIDS_CP [[name, cp], …]
W.D2O { mp, bp, Tmax, rhoMax, rho25, M, viscosity25, pKw25 }
W.VSMOW (1.5576e-4)   W.DH [{ id, name, dh, kind: standard|planet|giant|oort|jfc|meteorite|moon|ism, src }]   twenty bodies
W.WORLDS [{ id, name, km3, ocean, depth, note, src }]   Earth, Europa, Ganymede, Callisto, Titan, Enceladus, Triton, Pluto, Ceres, Mars, Moon, 67P, the quasar
W.EARTH { totalWater, oceans, oceanMass, oceanArea, oceanMeanDepth, icecaps, groundwater, lakes, rivers, atmosphere, …, flux: {…}, residence: {…}, atmosphereMass, cpAir, cpSeawater, heatUptake }
W.oceanLayerEqualToAtmosphere() (3.5 m)   W.oceanFractionOfEarth()
W.ANOMALIES [{ id, name, normal, water, value, why, prop }]   W.ICES [{ id, name, year, rho, p, structure, ordered, note }]   W.CLATHRATES
W.habitableZone(L) { inner, outer } AU   W.snowLine(L) AU   W.equilibriumTemperature(L, dAU, albedo) K
W.hydrostaticHead(h) Pa   W.suctionLimit(p) m (10.3)   W.xylemTension(h, resistance)
W.interp(table, x)  W.bisect(f, a, b)  W.K(°C) W.C(K)
```

Not in the engine (write a short local model in your sims file and say in a comment what it is): the dynamics of
a lake's seasonal turnover, nucleation rates, glacier flow, erosion rates, protein folding, the water cycle as a
flow network, tidal forces, D/H fractionation chemistry, osmosis across a membrane as a time series, Grotthuss
hopping as an animation. Keep such models simple and label them "schematic" in the blurb where they are.

## The drawing kit: `kit.wsym` (watersym.js)

```
const S = kit.wsym;
S.molecule(ctx, x, y, { angle, scale, charges, labels, lone, alpha }) -> { O, H: [[x,y],[x,y]], lone }   a bent H₂O; angle = direction of the bisector (rad), scale = px per Å
S.hbond(ctx, x1, y1, x2, y2, { color, alpha, width })                dashed
S.makeNetwork(n, W, H, scale, seed)  S.stepNetwork(net, dt, { T, W, H, scale }) -> bonds  S.bondsOf(net, scale)  S.network(ctx, net, { scale, bonds, highlight })
S.iceLattice(ctx, cx, cy, a, rings, { angle, molecules, color }) -> points   the honeycomb of ice Ih seen down the c-axis
S.snowflake(ctx, cx, cy, r, complexity, { color, seed })
S.drop(ctx, x, y, r, { color, highlight })   S.beaker(ctx, x, y, w, h, fill, { liquid, label, color })   S.thermometer(ctx, x, y, h, T, { min, max, color, label })
S.waves(ctx, x0, y, x1, amp, phase, { color, n })   S.molColor() -> { O, H, Hstroke, bond }
```

Molecules in 3-D: `kit.mol` and `kit.chem.molecule('H2O')` (see HYPER-CORE/AUTHORING.md, Chemistry) — `kit.chem.molecule('NH3')`, `'CH4'`, `'H2O'` exist; draw with `kit.mol.draw`. Everything else is plain canvas
with `kit.plot`, `kit.table`, `kit.label`, `kit.arrow`, `kit.grid`. Use the theme colours (`kit.colors()`);
water's accent is blue, so draw ice in `C.accent` or white-blue, warmth in `C.warn`/`C.bad`, vapour in `C.muted`.

## Formulas that teach

Prefer formulas whose variables the reader can feel: the submerged fraction of an iceberg, the heat to boil a
kettle, the dew point of a room, the freezing point of a salted road, the osmotic pressure of sea water, the
height water rises in a capillary, the tension a tree needs at 100 m, the equilibrium temperature of a planet at
a distance, the ratio of a comet's D/H to the ocean's. Three or four per page; conceptual pages (history, the
list of anomalies, what remains unknown) may have none. Every formula is checked by the validator for solving
back to its own values — give every variable except the unknown a realistic `value`.

## Checking your work

```bash
node HYPER-CORE/tools/validate.js HYPER-WATER --only <topic>
node HYPER-CORE/tools/simtest.js HYPER-WATER --only sims/<topic>.js
```

Fix every error; read the warnings and fix the real ones. Notes about planned concepts other writers have not
written yet are expected. Do not leave a server running or take over a shared browser.
