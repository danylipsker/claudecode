/* HYPER-WATER · content/trees-and-the-tallest.js — How a tree lifts water (branch: Water in Life).
 *   transpiration-pull · negative-pressure-in-the-xylem · cavitation-and-embolism · why-suction-stops-at-ten-metres
 *   the-height-limit-of-trees · stomata-and-the-cost-of-carbon · roots-and-root-pressure · a-tree-moves-a-tonne
 * Simulations: sims/trees-and-the-tallest.js (ids tree-…). Numbers are the engine's (hydrostatic head, vapour pressure, surface
 * tension, viscosity, latent heat) or are quoted from the sources named on each page (Koch et al. 2004 above all).
 */
Hyper.add(

/* ================================================================ the pull */
{
  id: 'transpiration-pull', parent: 'trees-and-the-tallest', title: 'Transpiration pull', level: 2,
  short: 'A tree has no pump. Water evaporating from the wet walls of its leaves forms microscopic menisci that pull on a continuous thread of sap, held together by hydrogen bonds, all the way down to the roots. The energy that lifts a hundred-metre column is the Sun\'s, spent on evaporation.',
  keywords: ['transpiration', 'cohesion-tension theory', 'cohesion', 'adhesion', 'xylem', 'sap ascent', 'how trees drink', 'Dixon and Joly', 'meniscus', 'leaf', 'water potential', 'ascent of sap'],
  prereq: ['what-a-hydrogen-bond-is', 'surface-tension', 'capillary-rise', 'vapour-pressure-and-evaporation'],
  related: ['negative-pressure-in-the-xylem', 'stomata-and-the-cost-of-carbon', 'a-tree-moves-a-tonne', 'osmosis-in-cells', 'humidity-and-dew-point', 'biology:transpiration', 'biology:water-potential', 'physics:hydrostatic-pressure'],
  body: `
A coast redwood stands a hundred metres tall, and on a summer day it lifts hundreds of litres of water from its roots to its crown. There is no heart, no pump and no moving part anywhere in the trunk. The water climbs through dead, empty tubes of wood, and what pulls it is the dry air above the leaves.

### The pull starts in the leaf
Every living cell in a leaf is wrapped in a wall of cellulose fibres, and the wall is a wet sponge, full of pores 10 to 50 nanometres across. Water evaporates from these walls into the air spaces of the leaf and leaves through the stomata. As the water retreats into the pores, its surface bends into a tiny concave meniscus, and a curved water surface pulls: the pressure just behind it is lower than the air in front by $2\\sigma/r$ (the same law as in [[capillary-rise]], with [[surface-tension]] doing the work). For a pore 30 nm in radius that is 4.9 MPa, nearly fifty atmospheres. The menisci are the engine, and each one is smaller than a virus.

### A rope made of hydrogen bonds
A pull at the top reaches the roots only if the water is one unbroken thread. It is, for two reasons. **Cohesion**: water molecules hold each other by hydrogen bonds ([[what-a-hydrogen-bond-is]]), so a thread of water in a narrow tube resists being pulled apart almost as a thin wire does. **Adhesion**: the walls of the xylem conduits are cellulose and lignin, covered in hydroxyl groups that hydrogen-bond to water, so the thread does not peel off the wall. The conduits are 10 to 200 micrometres wide, dead at maturity and joined end to end through perforated walls and pits, and together they make the thread continuous from the finest root to the finest leaf vein. This is the **cohesion–tension theory**, put forward by Henry Dixon and John Joly in Dublin in 1894 and independently by Eduard Askenasy in Heidelberg in 1895.

### Where the energy comes from
Lifting a kilogram of water 100 m takes about 980 J. Evaporating it takes 2.44 MJ. The tree does the second and the first comes free, because the Sun already paid for the evaporation: the lift is less than a twentieth of one per cent of the energy flowing through. A tree is less a pump than a wick, and the wick is lit by the Sun.

### What the air asks for
Dry air pulls on water with a force that is almost absurd. The water potential of air at relative humidity $RH$ is $\\psi = (RT/V_w)\\ln RH$ (the [[vapour-pressure-and-evaporation]] equilibrium, written as a pressure):

| Where | Water potential at 25 °C |
|---|---|
| moist soil, field capacity | about −0.03 MPa |
| xylem at 50 m, at dawn | about −0.6 MPa |
| leaf wall at midday, 100 m tree | −1.5 to −2 MPa |
| air at 99 % humidity | −1.4 MPa |
| air at 90 % | −14.5 MPa |
| air at 50 % | −95 MPa |
| air at 20 % | −221 MPa |

Water flows down this staircase wherever there is a path. The tree does not need a bigger pull; it needs a throttle, and the stomata are the throttle ([[stomata-and-the-cost-of-carbon]]).

### How we know
Cut a twig and pressurise it in a sealed chamber until sap just returns to the cut end: that pressure, found by Per Scholander's group in 1965, equals the tension the twig was under. Trunks shrink by tens of micrometres at midday and swell at night, pulled inward by the tension. And in the 1890s Eduard Strasburger killed 20-metre trees with poison and steam, and water still rose for days: living cells are not pumping.

> [!key] A tree lifts water by evaporation: menisci in the wet walls of the leaves pull on a thread of sap that hydrogen bonds hold together, and the Sun, not the tree, supplies the energy. The column is under tension, not pushed from below.`,
  ideas: ['Evaporation from leaf cell walls curves the water surface into menisci 10–50 nm across, which lower the pressure behind them by $2\\sigma/r$: several MPa.', 'The pull is transmitted down a continuous thread of water because cohesion (hydrogen bonds) holds the water together and adhesion holds it to the conduit wall.', 'The energy that lifts the water is the heat of evaporation from the Sun; the work of lifting is a few hundredths of a per cent of it.', 'Dry air is a far larger pull than the tree needs: the stomata throttle it.'],
  pitfalls: ['"Roots or living cells pump water to the top" — Trees killed with poison or steam still raised water for days, and the pressure that roots can make is a tenth of what a tall tree needs; the pull comes from the leaves.', '"Capillary action lifts the water" — The same surface-tension physics acts in the leaf pores, but capillary rise in a 20 µm vessel would be less than a metre; it is the tension at the top, not rise from below, that does the work.', '"Evaporation pulls because vapour rises" — Vapour does not drag the liquid; what pulls is the curved liquid surface, which carries a pressure drop, and that drop is passed down the water thread by cohesion.'],
  terms: [
    { term: 'Cohesion–tension theory', also: ['cohesion theory', 'Dixon–Joly theory', 'transpiration–cohesion–tension theory'], def: 'The explanation of how water rises in tall plants: evaporation from leaf walls puts the sap in the xylem under tension, and cohesion between water molecules transmits the pull to the roots. Proposed by Dixon and Joly (1894) and Askenasy (1895).' },
    { term: 'Transpiration', also: ['evaporation from leaves'], def: 'The loss of water vapour from a plant, mostly through the stomata of its leaves. It is the process that creates the pull in the xylem and also the plant\'s main water cost.' },
    { term: 'Cohesion', also: ['cohesive force'], def: 'The attraction between like molecules. In liquid water it comes from hydrogen bonds and gives the liquid a tensile strength that is orders of magnitude above what any ordinary fluid shows.' },
    { term: 'Adhesion', also: ['wall adhesion'], def: 'The attraction between water and a solid surface. The hydroxyl-rich cellulose and lignin walls of the xylem hold water by hydrogen bonds, so the sap thread does not detach from its tube.' },
    { term: 'Xylem', also: ['sapwood', 'vessel', 'tracheid', 'water-conducting tissue'], def: 'The tissue of dead, hollow, lignin-walled tubes (tracheids in conifers, vessels in flowering trees) that carries water and minerals from roots to leaves, forming the wood of a tree.' },
    { term: 'Water potential', also: ['ψ', 'psi'], def: 'The free energy of water per unit volume relative to pure water at atmospheric pressure, measured in megapascals: 0 for free water, negative when water is held by solutes, surfaces or tension. Water flows toward lower (more negative) potential.' }
  ],
  formulas: [
    { name: 'The pull of a meniscus', expr: 'P = 2*sigma*cos(theta)/r', tex: 'P = \\frac{2\\sigma\\cos\\theta}{r}',
      vars: { P: { name: 'pressure drop across the meniscus', q: 'pressure', unit: 'MPa', hint: 'How far the pressure behind the curved surface falls below the pressure in front of it.' }, sigma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma', hint: '72.7 mN/m at 20 °C.' }, theta: { name: 'contact angle', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta', hint: 'Near 0° for water on cellulose: the wall is wetted.' }, r: { name: 'pore radius', q: 'length', unit: 'nm', value: 30, hint: 'Leaf cell-wall pores are 10–50 nm across.' } },
      solveFor: 'P', note: 'The Young–Laplace pressure of a hemispherical meniscus; a smaller pore pulls harder.',
      stories: { P: 'Water in a leaf cell-wall pore of radius {r} wets the wall at {theta}. By how much is the pressure behind the meniscus below the pressure of the air?', r: 'A meniscus holds a pressure drop of {P}. What pore radius does that need?' } },
    { name: 'The water potential of humid air', expr: 'psi = R*T/Vw*ln(RH)', tex: '\\psi = \\frac{R\\,T}{V_w}\\ln \\mathrm{RH}',
      vars: { psi: { name: 'water potential of the air', q: 'pressure', unit: 'MPa', signed: true, tex: '\\psi', hint: 'How strongly the air pulls on liquid water.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -20, max: 50 }, Vw: { name: 'molar volume of water', q: 'molarvolume', unit: 'cm³/mol', value: 18.07, fixed: true, tex: 'V_w', hint: '18.07 cm³ per mole of liquid water at 25 °C.' }, RH: { name: 'relative humidity', q: 'ratio', unit: '%', value: 50, min: 1, max: 100 } },
      solveFor: 'psi', note: 'Equilibrium between liquid water at ψ and its vapour at humidity RH (the Kelvin relation). At 100 % the potential is zero.',
      stories: { psi: 'Air at {T} has a relative humidity of {RH}. What water potential does it exert on the liquid water in a leaf?', RH: 'Air at {T} has a water potential of {psi}. What is its relative humidity?' } },
    { name: 'Lifting compared with evaporating', expr: 'f = g*h/Lv', tex: 'f = \\frac{g\\,h}{L_v}',
      vars: { f: { name: 'energy of lifting as a share of the energy of evaporating', q: 'ratio', unit: '%', hint: 'Per kilogram of water: the work to raise it h metres divided by the heat to evaporate it.' }, g: { const: 'g' }, h: { name: 'height lifted', q: 'length', unit: 'm', value: 100 }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2442, tex: 'L_v', hint: '2,442 kJ/kg at 25 °C, 2,257 at 100 °C.' } },
      solveFor: 'f', note: 'The tree lifts its water for a few hundredths of a per cent of the energy that evaporation costs.',
      stories: { f: 'A tree lifts water {h} and evaporates it at {Lv}. What share of the evaporation energy does the lifting need?' } }
  ],
  examples: [
    { title: 'The pull of a leaf pore', q: 'The menisci in a leaf have radius 30 nm and wet the wall completely. How much negative pressure can they supply, and what height of water would that hold up?',
      steps: [{ text: 'Pressure drop of one meniscus, with $\\sigma = 72.7$ mN/m at 20 °C:', tex: 'P = \\frac{2\\sigma}{r} = \\frac{2 \\times 0.0727}{30\\times10^{-9}} = 4.85\\ \\mathrm{MPa}' }, { text: 'A column that a pressure difference P holds up has height', tex: 'h = \\frac{P}{\\rho g} = \\frac{4.85\\times10^{6}}{998 \\times 9.81} \\approx 495\\ \\mathrm{m}' }],
      a: 'About 4.9 MPa, enough to support almost 500 m of water. The leaf can supply five times the pull the tallest tree needs, which is why a tree can dial it down at will.' },
    { title: 'Lifting against the Sun', q: 'A tree evaporates 500 kg of water in a summer day from leaves at 25 °C, and the average height of the water it lifts is 100 m. Compare the work of lifting with the heat of evaporation.',
      steps: ['Lifting: $mgh = 500 \\times 9.81 \\times 100 = 0.49$ MJ, about 0.14 kWh.', 'Evaporating: $mL_v = 500 \\times 2.44$ MJ $= 1.22$ GJ, about 340 kWh.', 'Ratio: 0.49 MJ / 1,220 MJ = 0.04 %.'],
      a: 'The lifting is one 2,500th of the evaporation energy. A tree that works as a wick spends nearly all its solar energy on cooling and on letting the leaves breathe, and almost none on climbing.' }
  ],
  quiz: [
    { q: 'What supplies the energy that raises sap to the top of a tall tree?', choices: ['ATP burned by the cells of the trunk', 'Root pressure pushing from below', 'The Sun, which evaporates water from the leaves', 'Atmospheric pressure pushing on the soil'], a: 2, why: 'Evaporation costs 2.44 MJ per kilogram and the Sun pays it. Root pressure is at most a few tenths of a MPa and absent by day; the atmosphere can push water up only 10 m (see [[why-suction-stops-at-ten-metres]]); and the xylem is dead tissue that burns nothing.' },
    { q: 'The living cells in a trunk pump the sap upward.', a: false, why: 'Strasburger killed 20 m trees with poison and with steam in the 1890s and water still rose for days. The xylem is dead wood; the pull comes from evaporation at the leaves.' },
    { q: 'When the pore radius of a leaf wall falls from 50 nm to 25 nm as the leaf dries, the pull the menisci can supply', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 0, why: 'The pressure drop is $2\\sigma\\cos\\theta/r$, inversely proportional to the radius: 2.9 MPa at 50 nm, 5.8 MPa at 25 nm.' },
    { q: 'Air at 50 % relative humidity and 25 °C has a water potential of roughly', choices: ['−0.1 MPa', '−1 MPa', '−10 MPa', '−95 MPa'], a: 3, why: '$\\psi = (RT/V_w)\\ln 0.5 = 137\\ \\mathrm{MPa} \\times (-0.693) = -95$ MPa. The air can pull far harder than the 1–3 MPa a tree uses, which is why plants must have a valve.' },
    { q: 'What pressure drop (MPa) does a meniscus of radius 50 nm supply, for a wetted wall at 20 °C ($\\sigma = 72.7$ mN/m)?', answer: 2.91, why: '$2\\sigma/r = 2 \\times 0.0727 / 50\\times10^{-9} = 2.91\\times10^{6}$ Pa.' }
  ],
  applications: ['Irrigation and pruning of orchards and vineyards: a pressure chamber on a leaf tells the grower how hard the tree is pulling.', 'Cut flowers last longer when stems are re-cut under water, which keeps air out of the conduits that pull water.', 'Designing artificial trees: microfabricated hydrogel and nanoporous "synthetic trees" have been made to pull water through by evaporation in the laboratory.', 'Predicting forest drought stress from satellite and sap-flow data starts from this pull.'],
  history: 'Stephen Hales measured the force of rising sap in *Vegetable Staticks* (1727). The cohesion–tension theory arrived in 1894–95 with Dixon and Joly in Dublin and Askenasy in Heidelberg; it was argued over for decades because "negative pressure in a liquid" seemed impossible. Scholander\'s pressure chamber (1965) made tensions measurable in the field, and the verdict, after a 1990s dispute over a competing pressure-probe technique, is firmly in the theory\'s favour.',
  sources: ['Dixon and Joly, "On the ascent of sap" (1894), and Askenasy, "Über das Saftsteigen" (1895) — the cohesion–tension theory.', 'Scholander, Hammel, Bradstreet and Hemmingsen, "Sap pressure in vascular plants", *Science* 148, 339 (1965).', 'Tyree and Zimmermann, *Xylem Structure and the Ascent of Sap* (2nd ed., Springer, 2002), ch. 1 and 4.', 'Taiz and Zeiger, *Plant Physiology*, the chapters on water balance and on the transport of water in the xylem.', 'Koch, Sillett, Jennings and Davis, "The limits to tree height", *Nature* 428, 851 (2004).'],
  sim: { id: 'tree-pressure-profile', params: { h: 100, RH: 50 } }
},

/* ================================================================ negative pressure */
{
  id: 'negative-pressure-in-the-xylem', parent: 'trees-and-the-tallest', title: 'Negative pressure in the xylem', level: 2,
  short: 'The sap in a transpiring tree is not under pressure but under tension: typical midday xylem pressures are −0.5 to −3 MPa, and −8 MPa or lower in desert shrubs. Water can be stretched like this because it is a metastable liquid, held together by its hydrogen bonds, with a strength of tens to hundreds of MPa.',
  keywords: ['negative pressure', 'tension', 'xylem pressure', 'metastable', 'tensile strength of water', 'Scholander pressure bomb', 'Hagen–Poiseuille', 'friction', 'gradient', 'predawn water potential', 'stretched water'],
  prereq: ['transpiration-pull', 'what-a-hydrogen-bond-is', 'physics:hydrostatic-pressure'],
  related: ['cavitation-and-embolism', 'why-suction-stops-at-ten-metres', 'the-height-limit-of-trees', 'incompressibility-and-water-hammer', 'hydraulics:pressure-with-depth', 'hydraulics:cavitation', 'biology:water-potential', 'viscosity-of-water'],
  body: `
Cut a leafy branch from a tree on a hot afternoon and watch the cut end. Nothing spurts. If anything moves, the sap in the cut conduits slips back into the wood and air creeps in behind it, which is why florists re-cut stems under water. The sap in a transpiring tree is not pushed; it is pulled, and a liquid that is pulled is under **negative pressure**.

### What it means
Plant physiologists quote xylem pressure against the atmosphere, so a pressure of −1 MPa is 1 MPa below the surrounding air, about −0.9 MPa absolute. That is not a vacuum. A vacuum is zero absolute pressure, the lowest a gas can reach, and a liquid under tension is stretched beyond it: the molecules are pulled apart against their mutual attraction, and the sap tries to contract and pull the walls of its conduit inward. Typical midday values are −0.5 to −3 MPa in trees, down to −8 MPa and beyond in desert shrubs.

### A liquid that should not be there
At a pressure below its vapour pressure water is unstable against boiling; under tension it is a **metastable** liquid, like a supercooled drop. It persists because a bubble must pay for its surface before it can gain from relieving the tension: a bubble grows only once its radius exceeds $2\\sigma/|P|$, which is 73 nm at −2 MPa. A clean, gas-free liquid has no such seeds. The measured strength of water is large:

| Water under tension | Tension reached |
|---|---|
| xylem sap, midday | 0.5–3 MPa |
| xylem in a desert shrub | up to 8 MPa and more |
| spinning water in a glass capillary (Briggs, 1950) | about 28 MPa |
| water in microscopic quartz inclusions (Zheng et al., 1991) | about 140 MPa |
| theoretical limit, depending on the model | around 100 MPa and beyond |

The root of the strength is the hydrogen bond ([[what-a-hydrogen-bond-is]]). The heat of vaporisation per unit volume, the energy density that holds the liquid together, is 2.3 GPa, and water can bear a few per cent of that before it parts. A tree works at about one fiftieth of the strength of the liquid and loses its water column long before water itself gives way: the weak point is the plumbing, not the sap ([[cavitation-and-embolism]]).

### Gravity plus friction
Going up costs 9.8 kPa per metre, whatever the tree does (the hydrostatic pressure of [[the-height-limit-of-trees]]). Flow adds friction. For laminar flow of speed $u$ in a round tube of radius $r$ the Hagen–Poiseuille law gives a pressure gradient $8\\eta u/r^2$ with $\\eta \\approx 1$ mPa·s: halve the radius and the friction quadruples, which is why a tree's finest conduits sit in the leaf and the twig, where flow is slow. Real conduits add more from pits and end walls, often as much again.

| Height | Gravity alone | With 5 kPa/m of friction |
|---|---|---|
| 10 m | 0.10 MPa | 0.15 MPa |
| 30 m | 0.29 MPa | 0.44 MPa |
| 60 m | 0.59 MPa | 0.89 MPa |
| 100 m | 0.98 MPa | 1.48 MPa |
| 115 m | 1.13 MPa | 1.70 MPa |

Those figures come on top of the soil's own hold on water and the leaf's own demand.

### Day and night
At night, with the stomata shut and no flow, the water at the foot and the water at the top are in equilibrium: the tension at height $h$ is the soil's tension plus $\\rho g h$. That is why physiologists measure leaf water potential before dawn: it reads the soil, through the tree. By afternoon the flow has doubled the tension, the trunk has shrunk by tens of micrometres, and a pressure bomb on a twig reads −2 MPa.

> [!key] The sap of a transpiring tree is stretched, not squeezed: a metastable liquid at −1 to −3 MPa, held by hydrogen bonds that could bear fifty times more. Gravity costs 0.0098 MPa per metre of height, and friction in the conduits adds more.`,
  ideas: ['Xylem pressure is measured against the atmosphere; −1 MPa is a tension, not a vacuum, and it lies below zero absolute pressure.', 'Water under tension is metastable: a bubble grows only above radius $2\\sigma/|P|$, and clean water can be stretched by tens to hundreds of MPa.', 'Each metre of height adds 0.0098 MPa of tension from gravity, and flow adds friction that grows as $1/r^2$ in a narrow conduit.', 'At night, with no flow, the tension is the soil\'s plus gravity; by day it is much more.'],
  pitfalls: ['"Negative pressure means a vacuum" — A vacuum is zero absolute pressure. A liquid under tension has an absolute pressure below zero, which no gas can reach, and its molecules are pulled apart rather than missing.', '"The sap is under pressure like water in a pipe" — A pressurised pipe pushes outwards on its wall; the xylem pulls inwards, which is why trunks shrink by day and why wood must be thick-walled to avoid collapse.', '"Water cannot withstand tension" — A bulk liquid in a vessel with free surfaces breaks at about −0.1 MPa, but clean water in clean, wettable capillaries bears tens to hundreds of MPa.'],
  terms: [
    { term: 'Negative pressure', also: ['tension', 'xylem tension'], def: 'A pressure below the pressure of the surrounding atmosphere (or, for strong cases, below zero absolute): the liquid is pulled apart rather than squeezed. In trees −0.5 to −3 MPa by day.' },
    { term: 'Metastable liquid', also: ['superheated liquid under tension'], def: 'A liquid held in a state that is not the lowest in energy (here vapour would be) by an energy barrier. Stretched water persists until a bubble of critical size forms.' },
    { term: 'Pressure chamber', also: ['pressure bomb', 'Scholander bomb'], def: 'A sealed vessel in which a cut leaf or twig is pressurised until sap reappears at the cut end; the balancing pressure equals the tension in the xylem before cutting.' },
    { term: 'Hagen–Poiseuille law', also: ['Poiseuille flow'], def: 'For slow laminar flow in a round tube, the pressure gradient is $8\\eta u/r^2$ for mean speed $u$ and viscosity $\\eta$; the flow for a given gradient scales as $r^4$.' },
    { term: 'Predawn water potential', also: ['predawn leaf potential'], def: 'The water potential of a leaf measured before sunrise, when transpiration has stopped. It equals the soil\'s potential less the weight of the water column, and shows how dry the soil is.' }
  ],
  formulas: [
    { name: 'Weight of the water column', expr: 'p = rhoW*g*h', tex: 'p = \\rho_w\\,g\\,h',
      vars: { p: { name: 'pressure difference due to height', q: 'pressure', unit: 'MPa', hint: 'The pressure that gravity alone adds between the foot and the top of the column.' }, rhoW: { const: 'rhoW' }, g: { const: 'g' }, h: { name: 'height', q: 'length', unit: 'm', value: 100 } },
      solveFor: 'p', note: 'About 0.0098 MPa per metre, whatever the width of the conduits.',
      stories: { p: 'A column of sap stands {h} high. What pressure difference does its weight alone make?', h: 'Gravity alone makes a pressure difference of {p} over the column. How tall is it?' } },
    { name: 'Friction in a conduit', expr: 'G = 8*eta*u/r^2', tex: 'G = \\frac{8\\,\\eta\\,u}{r^2}',
      vars: { G: { name: 'pressure gradient', q: 'pressureGrad', unit: 'kPa/m', hint: 'The extra tension per metre of path caused by friction.' }, eta: { name: 'viscosity of the sap', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta', hint: '1.0 mPa·s at 20 °C, 1.3 at 10 °C.' }, u: { name: 'mean sap speed in the conduit', q: 'speed', unit: 'mm/s', value: 1, hint: 'Conifers 0.1–1 mm/s; wide-vessel trees such as oaks up to 10 mm/s.' }, r: { name: 'conduit radius', q: 'length', unit: 'µm', value: 25, hint: 'Conifer tracheids 5–15 µm, flowering-tree vessels 15–150 µm.' } },
      solveFor: 'G', note: 'The ideal lower bound: pits and end walls add to it. The $r^2$ in the denominator is why wide vessels are fast and why they are vulnerable.',
      stories: { G: 'Sap of viscosity {eta} flows at {u} in a conduit of radius {r}. How large is the pressure gradient?', r: 'What conduit radius gives a gradient of {G} for sap of {eta} moving at {u}?' } },
    { name: 'Pressure at the top of a tree', expr: 'Pt = Ps - (rhoW*g + G)*h', tex: 'P_{top} = P_s - (\\rho_w\\,g + G)\\,h',
      vars: { Pt: { name: 'xylem pressure at the top', q: 'pressure', unit: 'MPa', signed: true, tex: 'P_{top}', hint: 'Negative: the sap at the top is under tension.' }, Ps: { name: 'pressure at the foot (soil water potential)', q: 'pressure', unit: 'MPa', signed: true, value: -0.1, tex: 'P_s', hint: 'Near 0 in wet soil, −1.5 MPa at the conventional wilting point.' }, rhoW: { const: 'rhoW' }, g: { const: 'g' }, G: { name: 'friction gradient', q: 'pressureGrad', unit: 'kPa/m', value: 5, hint: '2–15 kPa/m for trees in leaf.' }, h: { name: 'height', q: 'length', unit: 'm', value: 100, min: 0 } },
      solveFor: 'Pt', note: 'Both gravity and friction subtract: the pressure falls linearly up the trunk. Real profiles curve because friction concentrates in the narrow twigs and leaf veins.',
      stories: { Pt: 'Soil water holds the foot of a {h} tree at {Ps}, and friction costs {G}. What is the xylem pressure at the top?', h: 'The foot of a tree sits at {Ps}, friction is {G}, and the top is at {Pt}. How tall is the tree?' } }
  ],
  examples: [
    { title: 'The top of a hundred-metre redwood', q: 'The soil is damp (−0.1 MPa) and friction costs 5 kPa/m. What is the xylem pressure at the top of a 100 m tree?',
      steps: [{ text: 'Gravity: $\\rho_w g = 9.81$ kPa/m; with friction the gradient is 14.8 kPa/m.', tex: 'P_{top} = -0.1 - 14.8\\ \\mathrm{kPa/m} \\times 100\\ \\mathrm{m} = -0.1 - 1.48' }, 'Over 100 m the column costs 1.48 MPa and the soil another 0.1.'],
      a: 'About −1.58 MPa. Gravity gives two-thirds of the tension; the leaf\'s own demand comes on top of it, which is why midday values at the top are near −2 MPa.' },
    { title: 'Why wide vessels carry more but are weaker', q: 'Sap flows at 1 mm/s in a conduit of radius 25 µm and in one of radius 100 µm. How large is the friction gradient in each, for sap at 1 mPa·s?',
      steps: [{ text: 'In the narrow conduit:', tex: 'G = \\frac{8 \\times 10^{-3} \\times 10^{-3}}{(25\\times10^{-6})^2} = 12.8\\ \\mathrm{kPa/m}' }, { text: 'In the wide one the radius is four times as large, so the friction is sixteen times smaller:', tex: 'G = \\frac{8 \\times 10^{-3} \\times 10^{-3}}{(100\\times10^{-6})^2} = 0.8\\ \\mathrm{kPa/m}' }, 'Equivalently, at the same gradient the wide conduit would carry $4^4 = 256$ times the flow.'],
      a: '12.8 kPa/m against 0.8 kPa/m: the narrow conduit costs more than gravity does (9.8 kPa/m), the wide one almost nothing. The trade-off is that wide conduits are more vulnerable to embolism ([[cavitation-and-embolism]]).' }
  ],
  quiz: [
    { q: 'A branch is cut from a tree that is transpiring hard. What happens to the sap in the cut conduits?', choices: ['It spurts out under pressure', 'It drips slowly', 'It is drawn back into the wood and air enters', 'Nothing: the sap is at rest'], a: 2, why: 'The sap is under tension: opening it to the atmosphere lets the atmosphere push air in and the sap retreats. Only root-pressure species bleed, and only at night or in spring.' },
    { q: 'An xylem pressure of −1 MPa means the sap is at a vacuum.', a: false, why: 'A vacuum is zero absolute pressure; −1 MPa relative to the atmosphere is about −0.9 MPa absolute, a stretched liquid. Gases cannot go below zero but a liquid held by hydrogen bonds can.' },
    { q: 'Doubling the radius of a conduit at the same sap speed changes the friction gradient by', choices: ['a factor of 2', 'a factor of 4 (down)', 'a factor of 16 (down)', 'nothing'], a: 1, why: 'The gradient is $8\\eta u/r^2$; doubling $r$ divides it by four. At the same pressure gradient, the flow (not the speed) would rise sixteen-fold.' },
    { q: 'Why do plant physiologists measure leaf water potential before dawn?', choices: ['The leaf is coolest then', 'Transpiration has stopped, so the leaf reads the soil\'s potential plus the weight of the column', 'The stomata are wide open', 'The pressure bomb works only in the dark'], a: 1, why: 'With no flow, the whole tree is in equilibrium with the wet soil at its roots, and the predawn potential reports that. It is the standard measure of how dry the soil is.' },
    { q: 'What extra tension (MPa) does gravity alone add between the foot and the top of a 50 m tree?', answer: 0.49, why: '$\\rho g h = 1000 \\times 9.81 \\times 50 = 4.9\\times10^{5}$ Pa.' }
  ],
  applications: ['Predawn and midday leaf-water-potential measurements schedule irrigation in vineyards and orchards.', 'Florists, and nurseries shipping cut stock, re-cut stems under water to avoid air entering the stretched columns.', 'Dendrometers on trunks use the daily shrinkage as a continuous record of how hard the tree is pulling.', 'Wood engineers and plant breeders select for narrow or wide conduits, trading flow against the risk of embolism.'],
  history: 'The centrifuge experiments of Lyman Briggs (1950) first put a number on the strength of water; laboratory work on microscopic inclusions in quartz brought the strongest reading, about −140 MPa, in 1991. A dispute in the 1990s over whether a pressure probe inserted into single conduits gave less tension than the pressure bomb has largely faded, as later measurements by several groups agreed with the theory.',
  sources: ['Tyree and Zimmermann, *Xylem Structure and the Ascent of Sap* (2nd ed., 2002), ch. 4 and 5 (tension, metastability, pressure measurement).', 'Zheng, Durben, Wolf and Angell, "Liquids at large negative pressures: water at the homogeneous nucleation limit", *Science* 254, 829 (1991).', 'Briggs, "Limiting negative pressure of water", *Journal of Applied Physics* 21, 721 (1950).', 'Koch, Sillett, Jennings and Davis, "The limits to tree height", *Nature* 428, 851 (2004).', 'Taiz and Zeiger, *Plant Physiology*, the chapter on water transport.'],
  sim: { id: 'tree-pressure-profile', params: { h: 60 } }
},

/* ================================================================ cavitation */
{
  id: 'cavitation-and-embolism', parent: 'trees-and-the-tallest', title: 'Cavitation and embolism', level: 3,
  short: 'A stretched thread of sap can snap. Air pulled through a microscopic pore of a pit membrane, or a bubble from freezing sap, empties a conduit in a click and blocks it for good. How easily a wood embolises, summed in its vulnerability curve, decides where each tree can live.',
  keywords: ['cavitation', 'embolism', 'air seeding', 'pit membrane', 'vulnerability curve', 'P50', 'freeze-thaw embolism', 'acoustic emission', 'drought mortality', 'hydraulic failure', 'refilling', 'tracheids vs vessels'],
  prereq: ['negative-pressure-in-the-xylem', 'transpiration-pull', 'surface-tension'],
  related: ['why-suction-stops-at-ten-metres', 'the-height-limit-of-trees', 'roots-and-root-pressure', 'frost-wedging-and-burst-pipes', 'supercooling-and-nucleation', 'gases-in-water', 'hydraulics:cavitation', 'biology:water-potential'],
  body: `
Hold an ultrasonic microphone against the branch of a tree in a dry spell and you hear it click, up to hundreds of times a minute. Each click is a conduit failing: the thread of sap in one tube of wood has snapped, and the tube has emptied. The tree has lost a little plumbing. Over a long drought it can lose enough to die.

### How a column breaks
When the stretched water in a conduit suddenly makes a bubble, the tension in that conduit vanishes at once, the water pulls back and vapour and a little air fill the tube. This is **cavitation** (see also [[incompressibility-and-water-hammer]]), and the blocked tube is an **embolism**, from the Greek for a plug. The conduit now carries nothing, and water has to go around it.

Where does the bubble come from? Mostly from the neighbours. Conduits talk to each other through **pits**, thin windows in the wall closed by a membrane of cellulose with pores a few tens of nanometres across. The pit membrane holds the sap in its pores by [[surface-tension]]: air on the other side can push through only when the tension exceeds $2\\sigma\\cos\\theta/r$. This is **air seeding**:

| Largest pore in the pit membrane | Tension at which air gets through |
|---|---|
| 100 nm | 1.5 MPa |
| 50 nm | 2.9 MPa |
| 25 nm | 5.8 MPa |
| 20 nm | 7.3 MPa |
| 10 nm | 14.6 MPa |

The tree is a patchwork of conduits, some of which have been cut by insects, wind or a thrush's beak and are full of air. The pit membrane is the guard between a wounded conduit and a sound one, and the largest pore in it sets the tension at which the guard fails. Small pores buy safety and cost flow.

### Freezing
Sap contains dissolved air, about 20 mL per litre. When it freezes, ice excludes the gas and forces it into bubbles. On thaw, a small bubble dissolves again quickly, because surface tension squeezes it and the time to dissolve scales with the square of its radius. A large bubble outlasts the thaw, and then the returning tension makes it grow if its radius exceeds $2\\sigma/|P|$, 0.15 µm at −1 MPa. The bubbles in a conduit scale with its width, so freeze–thaw embolism is a disease of wide conduits: the risk rises sharply above about 30–45 µm in diameter. That is why conifers, with tracheids 10–30 µm wide, hold the cold lands, and oaks and ash, with vessels of 100–300 µm, drop their leaves in winter and survive on the newest ring of wood.

### The vulnerability curve
Measure the flow a stem can carry, dry it to a given tension, measure again: the percentage loss of conductivity (PLC) climbs from zero to 100 in an S-curve. The tension at 50 % loss is **P50**, a species' fingerprint.

| Wood | P50, roughly |
|---|---|
| poplar, aspen | −1.5 to −2 MPa |
| maples, oaks | −2 to −4 MPa |
| pines and coast redwood | −3 to −5 MPa |
| Mediterranean shrubs | −5 to −10 MPa |
| the record, Australian cypress-pine *Callitris tuberculata* | below −18 MPa |

A 2012 survey of 226 forest species (Choat and colleagues) found that about seventy per cent operate within 1 MPa of their own P50: forests run with little margin.

### The price of width, and repair
Wide conduits are fast: flow at a given gradient goes as $r^4$, so one vessel of radius 100 µm carries what 10,000 tracheids of radius 10 µm carry. But they are weaker in frost. Narrow ones are slow and safe. Most trees cannot mend a conduit; they build a new ring of wood. Some refill: root pressure at night or in spring ([[roots-and-root-pressure]]), and possibly osmotic repair even under tension, which is still argued over because cutting a sample can itself create artefacts.

> [!key] A tree's water thread snaps where a bubble begins: through a pit pore at a tension of 2σ/r, or from gas coming out of freezing sap in wide conduits. The vulnerability curve, summarised by P50, shows how close each wood runs to the edge.`,
  ideas: ['Cavitation is the sudden appearance of vapour in a stretched conduit; the empty tube is an embolism and carries no water.', 'Air seeding: air is pulled through the largest pore of a pit membrane when tension exceeds $2\\sigma\\cos\\theta/r$ — 2.9 MPa for a 50 nm pore.', 'Freezing releases dissolved gas as bubbles; wide conduits make big bubbles that survive the thaw, so conifers with narrow tracheids live in the cold.', 'The vulnerability curve gives the loss of conductivity against tension; P50 sums it up, and most forest species run within 1 MPa of theirs.'],
  pitfalls: ['"Embolism happens when the sap boils in the heat" — Heat is not needed. The sap is stretched below its vapour pressure, and a bubble relieves the tension; it is boiling by pulling, not by warming.', '"A tree under drought lacks water, so it dies of thirst" — Often the proximate cause is hydraulic failure: soil water may remain, but the conduits are emptied, and the canopy cannot be reached.', '"Wide vessels are simply better because they flow more" — Flow rises as $r^4$ but so do freeze–thaw and drought vulnerability; every wood is a trade-off, which is why wide-vessel trees shed their leaves.'],
  terms: [
    { term: 'Cavitation', also: ['bubble nucleation in the xylem'], def: 'The sudden formation of a vapour or gas bubble in a liquid under tension. In wood it releases the tension in the conduit and fills it with vapour and air.' },
    { term: 'Embolism', also: ['xylem embolism', 'gas embolism'], def: 'A conduit blocked with gas after cavitation; the tube no longer carries water. From the Greek *embolos*, a plug.' },
    { term: 'Air seeding', also: ['air entry'], def: 'Entry of air from an air-filled conduit into a water-filled neighbour through the largest pore of the pit membrane when the tension exceeds $2\\sigma\\cos\\theta/r$.' },
    { term: 'Pit membrane', also: ['pit', 'bordered pit'], def: 'A thin porous sheet of cellulose closing the window (pit) between two xylem conduits. Its pores, 5–100 nm across, let water through and stop air.' },
    { term: 'Vulnerability curve', also: ['P50', 'percent loss of conductivity', 'PLC'], def: 'The loss of hydraulic conductivity of a stem as a function of xylem tension. P50 is the tension at which half the conductivity is lost.' },
    { term: 'Freeze–thaw embolism', also: ['frost embolism'], def: 'Embolism caused when gas forced out of freezing sap forms bubbles that survive the thaw and expand under tension; it affects wide conduits above about 30–45 µm.' }
  ],
  formulas: [
    { name: 'Tension at which air seeds', expr: 'T = 2*sigma*cos(theta)/r', tex: 'T = \\frac{2\\sigma\\cos\\theta}{r}',
      vars: { T: { name: 'air-seeding tension', q: 'pressure', unit: 'MPa', hint: 'The tension in the sap at which air is pulled through the pore.' }, sigma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, theta: { name: 'contact angle', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta', hint: 'Zero for a perfectly wetted pore; larger values weaken the seal.' }, r: { name: 'pore radius', q: 'length', unit: 'nm', value: 50, hint: 'The largest pore in the pit membrane.' } },
      solveFor: 'T', note: 'One large pore decides it: the membrane is only as safe as its biggest hole.',
      stories: { T: 'The largest pore in a pit membrane has radius {r} and the contact angle is {theta}. At what tension does air get through?', r: 'Air seeds at {T}. What is the largest pore radius?' } },
    { name: 'The smallest bubble that survives', expr: 'rc = 2*sigma/T', tex: 'r_c = \\frac{2\\sigma}{T}',
      vars: { rc: { name: 'critical bubble radius', q: 'length', unit: 'µm', tex: 'r_c', hint: 'A bubble larger than this grows under the tension; a smaller one collapses.' }, sigma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, T: { name: 'tension', q: 'pressure', unit: 'MPa', value: 1, hint: 'The size of the tension, as a positive number.' } },
      solveFor: 'rc', note: 'Under 1 MPa of tension the critical bubble is 0.15 µm across; the gas bubbles from freezing sap are far larger once they have grown.',
      stories: { rc: 'The sap is under a tension of {T}. What is the radius of the smallest bubble that grows?' } },
    { name: 'The vulnerability curve', expr: 'PLC = 1 - 2^(-(T/P50)^s)', tex: '\\mathrm{PLC} = 1 - 2^{-(T/P_{50})^{s}}',
      vars: { PLC: { name: 'loss of conductivity', q: 'ratio', unit: '%', tex: '\\mathrm{PLC}', hint: 'The share of the stem\'s flow capacity lost.' }, T: { name: 'xylem tension', q: 'pressure', unit: 'MPa', value: 3, hint: 'As a positive number.' }, P50: { name: 'tension at 50 % loss', q: 'pressure', unit: 'MPa', value: 3.5, tex: 'P_{50}', hint: 'About 1.5 for poplars, 3–4 for oaks and pines.' }, s: { name: 'steepness of the curve', value: 4, min: 1, max: 12, hint: 'Higher means a sharper cliff; 3–6 is typical.' } },
      solveFor: 'PLC', note: 'A Weibull-type fit written so that PLC is exactly 50 % at T = P50.',
      stories: { PLC: 'A wood has a P50 of {P50} and a steepness of {s}. What share of its conductivity does it lose at a tension of {T}?', T: 'A wood with a P50 of {P50} and a steepness of {s} has lost {PLC} of its conductivity. What was the tension?' } },
    { name: 'Wide against narrow', expr: 'K = (r1/r2)^4', tex: 'K = \\left(\\frac{r_1}{r_2}\\right)^{4}',
      vars: { K: { name: 'how many narrow conduits equal one wide one', hint: 'From the Hagen–Poiseuille law, flow at a given gradient goes as $r^4$.' }, r1: { name: 'radius of the wide conduit', q: 'length', unit: 'µm', value: 100, tex: 'r_1' }, r2: { name: 'radius of the narrow conduit', q: 'length', unit: 'µm', value: 10, tex: 'r_2' } },
      solveFor: 'K', note: 'Ideal tubes at the same pressure gradient; real conduits are less extreme because of end walls.',
      stories: { K: 'An oak vessel has radius {r1}; a conifer tracheid {r2}. How many tracheids carry as much as one vessel at the same gradient?' } }
  ],
  examples: [
    { title: 'The pit that fails', q: 'The largest pore of a pit membrane is 40 nm in radius and wets completely. At what tension does air seed, and does a tree at −3 MPa lose the conduit?',
      steps: [{ text: 'Air-seeding tension:', tex: 'T = \\frac{2\\sigma}{r} = \\frac{2\\times 0.0727}{40\\times10^{-9}} = 3.6\\ \\mathrm{MPa}' }, 'At 3.0 MPa the tension is below the threshold, so the membrane holds. At 4 MPa it fails.'],
      a: 'The membrane holds up to 3.6 MPa of tension. The conduit is lost only if the tree goes below −3.6 MPa — a margin of 0.6 MPa, close to what many forest trees have.' },
    { title: 'Reading a vulnerability curve', q: 'A wood has P50 = 3.5 MPa and steepness 4. How much conductivity has it lost at tensions of 2, 3, 4 and 5 MPa?',
      steps: ['$\\mathrm{PLC} = 1 - 2^{-(T/3.5)^4}$.', 'At 2 MPa: $(0.571)^4 = 0.107$, PLC 7 %. At 3 MPa: $(0.857)^4 = 0.540$, PLC 31 %.', 'At 4 MPa: $(1.143)^4 = 1.706$, PLC 69 %. At 5 MPa: $(1.429)^4 = 4.17$, PLC 94 %.'],
      a: '7 %, 31 %, 69 % and 94 %: a cliff within 3 MPa. A tree that spent most of its life at 2 MPa and met a drought at 5 would lose nearly all its flow.' }
  ],
  quiz: [
    { q: 'Air seeding is', choices: ['air bubbling out of sap that has been heated', 'air pulled through a pore of the pit membrane from an air-filled conduit into a sap-filled one', 'seeds carried up in the sap stream', 'air entering through the stomata of the leaf'], a: 1, why: 'The pit membrane\'s largest pore holds a meniscus until the tension exceeds $2\\sigma/r$; then air is pulled through and the neighbouring conduit cavitates.' },
    { q: 'Embolism happens because the sap in the conduit boils in the heat of the day.', a: false, why: 'Temperature is incidental. The sap is stretched below its vapour pressure, and a bubble relieves the tension; the same happens at 5 °C.' },
    { q: 'A pit membrane with pores of 20 nm protects against a tension about … that of one with 50 nm pores.', choices: ['2.5 times higher than', 'the same as', '2.5 times lower than', 'zero times'], a: 0, why: 'Air-seeding tension scales as $1/r$: 7.3 MPa for 20 nm against 2.9 MPa for 50 nm, a ratio of 2.5.' },
    { q: 'Why are conifers, with tracheids 10–30 µm wide, dominant in the coldest forests?', choices: ['Their leaves are needles, which shed snow', 'Narrow conduits make small bubbles on freezing, which dissolve on thaw before tension returns', 'Their wood is fire-proof', 'They need less water'], a: 1, why: 'Freeze–thaw embolism needs a large bubble; bubble size scales with conduit width, so narrow tracheids resist it. The price is slower flow.' },
    { q: 'What tension (MPa) lets air through a wetted pit pore of radius 25 nm at 20 °C?', answer: 5.8, why: '$2\\sigma/r = 2\\times0.0727/(25\\times10^{-9}) = 5.8\\times10^{6}$ Pa.' }
  ],
  applications: ['Forest dieback in droughts (Europe 2003, Texas 2011, California 2012–16) is increasingly traced to hydraulic failure of the xylem rather than starvation.', 'Ultrasonic acoustic sensors count embolising conduits in orchard and vineyard trees to schedule irrigation.', 'Plant breeders and foresters rank species and provenances by P50 to choose trees for a drier future.', 'The wide-vessel versus narrow-tracheid choice explains why deciduous trees dominate warm lands and conifers the cold and the high.'],
  history: 'Clicks from cavitating xylem were first picked up in the 1960s; the air-seeding hypothesis was set out in the 1980s (Zimmermann, then Sperry and Tyree in 1988); X-ray micro-computed tomography of intact plants, from about 2010, finally allowed biologists to see conduits empty and sometimes refill. Whether trees can refill conduits under tension is still debated.',
  sources: ['Sperry and Tyree, "Mechanism of water stress-induced xylem embolism", *Plant Physiology* 88, 581 (1988).', 'Davis, Sperry and Hacke, "The relationship between xylem conduit diameter and cavitation caused by freezing", *American Journal of Botany* 86, 1367 (1999).', 'Choat et al., "Global convergence in the vulnerability of forests to drought", *Nature* 491, 752 (2012).', 'Tyree and Zimmermann, *Xylem Structure and the Ascent of Sap* (2nd ed., 2002), the chapters on cavitation and pit structure.', 'Holbrook and Zwieniecki (eds.), *Vascular Transport in Plants* (Elsevier, 2005).'],
  sim: 'tree-embolism-lab'
},

/* ================================================================ why suction stops at ten metres */
{
  id: 'why-suction-stops-at-ten-metres', parent: 'trees-and-the-tallest', title: 'Why suction stops at 10 metres', level: 1,
  short: 'No pump can suck water up more than about 10 metres, because the atmosphere does the pushing and its weight is only worth a 10.3 m column of water. A tree lifts water ten times higher because it does not suck from the top with a vacuum: it pulls on a continuous thread, and a thread can be under tension.',
  keywords: ['suction pump', '10 metres', '10.3 m', 'atmospheric pressure', 'Torricelli', 'barometer', 'Galileo', 'vacuum', 'siphon', 'water column', 'well pump', 'why trees can lift water higher than pumps'],
  prereq: ['negative-pressure-in-the-xylem', 'vapour-pressure-and-evaporation', 'physics:hydrostatic-pressure'],
  related: ['transpiration-pull', 'the-height-limit-of-trees', 'cavitation-and-embolism', 'incompressibility-and-water-hammer', 'boiling-at-altitude', 'hydraulics:pressure-with-depth', 'physics:pressure'],
  body: `
In the 1630s the pump-makers of Florence discovered an embarrassing rule: no pump, however well made, would draw water from a well deeper than about eighteen braccia, some 10.5 metres. Galileo, in his last book (1638), has one of his speakers report it, and wonders that nature's abhorrence of a vacuum should have a limit, as if a column of water could break under its own weight like a rope. A few years later Evangelista Torricelli saw what was going on, and the answer was neither in the pump nor in the water. It was in the air.

### A pump does not suck
A suction pump removes the air from the top of a pipe whose lower end stands in the well. The air above the well presses on the open surface with a pressure of 101.3 kPa, and that pressure pushes water up the pipe until the weight of the column balances the difference. The height is

$$h = \\frac{p_\\text{atm} - p_\\text{top}}{\\rho g}$$

and $p_\\text{top}$ cannot fall below zero (in fact not below the vapour pressure of water, 2.3 kPa at 20 °C, where the water in the pipe boils). With $p_\\text{top} = 0$ the limit is $101.3\\ \\mathrm{kPa} / 9.79\\ \\mathrm{kPa/m} = 10.3$ m. Torricelli proved it with mercury, 13.6 times denser than water: the same atmosphere holds up 76 cm of mercury, and Pascal showed in 1648, by sending his brother-in-law up the Puy de Dôme with a barometer, that the column fell with altitude, because there was less air above.

| Condition | Highest suction lift |
|---|---|
| sea level, 20 °C | 10.1 m |
| sea level, water at 60 °C | 8.4 m |
| sea level, water at 90 °C | 3.3 m |
| Denver (83 kPa), 20 °C | 8.3 m |
| La Paz (65 kPa), 20 °C | 6.4 m |
| summit of Everest (34 kPa), 20 °C | 3.2 m |

Real pumps with friction and leaks manage 6 to 8 m.

### A tree is not a pump
A redwood lifts its water ten times higher. It cannot be using the atmosphere's push, which is worth 10.3 m, and it is not. What it uses is a pull. The top of its column is not a vacuum but a field of menisci in the walls of leaf cells, and the water in the xylem is a continuous thread which can stand tension ([[negative-pressure-in-the-xylem]]). In the tree the absolute pressure at 100 m is not zero; it is about −1.5 MPa. The limit of 10.3 m is a limit on pushing a column with a vacuum above it. The limit on pulling a thread is set by when it breaks, and that is a tension, not a pressure:

| Tension the column bears | Height of water that tension could support |
|---|---|
| 1 MPa | 102 m |
| 2 MPa | 204 m |
| 3 MPa | 306 m |
| 5 MPa | 511 m |

### Why the pump's column breaks and the tree's does not
At the top of a pump pipe the water has a large free surface facing a void, plus dissolved gas and scratches in the metal: ready-made seeds. As soon as the pressure falls to the vapour pressure the water boils into the gap, and the column breaks. In a tree the sap is in tubes 10–200 µm wide, with walls that water wets, and the top ends in menisci held in pores 30 nm wide that air cannot enter. The water is stretched like a rope, and a rope can hold up its own weight for as far as its strength allows. Careful laboratory experiments in the 2010s showed that even a siphon, which the textbooks say needs the atmosphere, can run in a vacuum chamber by cohesion alone.

> [!key] A suction pump is limited to 10.3 m because the atmosphere pushes and it can push only so hard. A tree pulls on a continuous thread of water that the hydrogen bonds hold together under tension, so the vacuum limit does not apply; its limit is how far the thread can be stretched.`,
  ideas: ['A suction pump lowers the pressure at the top of a pipe; the atmosphere pushes the water up, and the limit is $p_\\text{atm}/\\rho g = 10.3$ m.', 'The limit falls with altitude and with water temperature, because the vapour pressure takes a share of the atmosphere\'s push.', 'A tree has no vacuum at the top: it pulls on a continuous thread, with absolute pressure below zero, so the 10 m limit does not apply.', 'The thread\'s limit is how much tension the water and the plumbing can bear, 2–10 MPa in wood: hundreds of metres in principle.'],
  pitfalls: ['"A pump sucks water up" — Nothing sucks: the atmosphere pushes, and the pump only lowers the pressure at the top. That is why the limit depends on the weight of the air.', '"Water cannot be lifted higher than 10 m by any means" — Pumps that push (from the bottom, or in stages) lift water as high as you like; and trees pull it ten times higher by tension.', '"Trees prove that the atmosphere pushes sap up" — The atmosphere pushes only 10.3 m; the rest of a tall tree\'s lift is the tension in the xylem, which has no atmosphere in it.'],
  terms: [
    { term: 'Suction lift', also: ['suction head', 'maximum lift of a pump'], def: 'The height to which a pump above the water can raise it by lowering the pressure at its inlet; at most (atmospheric − vapour pressure) divided by ρg, about 10 m at sea level.' },
    { term: 'Absolute pressure', also: ['gauge pressure'], def: 'Pressure measured from a perfect vacuum, in contrast to gauge pressure, measured from the surrounding atmosphere. An absolute pressure below zero means the liquid is under tension.' },
    { term: 'Barometer', also: ['Torricellian tube', 'water barometer'], def: 'A tube of liquid closed at the top and standing in a dish of the same liquid, whose height measures atmospheric pressure: 76 cm of mercury, or 10.3 m of water.' },
    { term: 'Torricellian vacuum', also: ['Torricelli vacuum'], def: 'The empty space (really filled with a little vapour) above the liquid in a barometer tube, discovered by Torricelli in 1643.' },
    { term: 'Siphon', also: ['siphon limit'], def: 'A tube that lifts liquid over a hump and lets it fall to a lower level. Its working height was long taught as limited to 10 m by the atmosphere; cohesion is what holds the liquid together over the hump.' }
  ],
  formulas: [
    { name: 'The highest a suction pump can lift water', expr: 'h = (p - pv)/(rho*g)', tex: 'h = \\frac{p - p_v}{\\rho\\,g}',
      vars: { h: { name: 'highest lift', q: 'length', unit: 'm', hint: 'Above this the column breaks and water boils inside the pipe.' }, p: { name: 'atmospheric pressure', q: 'pressure', unit: 'kPa', value: 101.325, hint: '101.3 kPa at sea level, 33 kPa on the summit of Everest.' }, pv: { name: 'vapour pressure of the water', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v', hint: '2.3 kPa at 20 °C, 20 kPa at 60 °C, 101 kPa at 100 °C.' }, rho: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho' }, g: { const: 'g' } },
      solveFor: 'h', note: 'With $p_v = 0$ and sea-level pressure this is the 10.3 m of the textbook.',
      stories: { h: 'A well pump at a place where the air pressure is {p} lifts water at a temperature that has a vapour pressure of {pv}. How high can it lift?', p: 'A pump lifts water at most {h}. At what atmospheric pressure is it working (vapour pressure {pv})?' } },
    { name: 'The height a tension can support', expr: 'h = T/(rho*g)', tex: 'h = \\frac{T}{\\rho\\,g}',
      vars: { h: { name: 'height of water supported', q: 'length', unit: 'm' }, T: { name: 'tension the column bears', q: 'pressure', unit: 'MPa', value: 2, hint: 'Xylem fails at 2–10 MPa depending on the wood.' }, rho: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho' }, g: { const: 'g' } },
      solveFor: 'h', note: 'The tension limit of a thread of water, with no vacuum involved: 100 m per MPa.',
      stories: { h: 'The wood of a tree can bear a tension of {T}. How tall a column of water could it hold, ignoring friction?' } },
    { name: 'The atmosphere from a barometer', expr: 'p = rho*g*h', tex: 'p = \\rho\\,g\\,h',
      vars: { p: { name: 'atmospheric pressure', q: 'pressure', unit: 'kPa' }, rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 13534, tex: '\\rho', hint: '13,534 for mercury, 998 for water.' }, g: { const: 'g' }, h: { name: 'height of the column', q: 'length', unit: 'mm', value: 760 } },
      solveFor: 'p', note: 'Torricelli\'s mercury barometer: 760 mm at sea level. In water the same pressure gives 10.3 m.',
      stories: { p: 'A mercury column stands {h} high. What is the air pressure?', h: 'The air pressure is {p}. How high does a column of this liquid stand?' } }
  ],
  examples: [
    { title: 'A well pump in the Andes', q: 'A hand pump at an altitude where the air pressure is 70 kPa draws water at 20 °C (vapour pressure 2.34 kPa). How deep can the well be?',
      steps: [{ text: 'Suction lift:', tex: 'h = \\frac{70 - 2.34}{9.79} = 6.9\\ \\mathrm{m}' }, 'The maximum is 6.9 m in ideal conditions; with friction and a worn seal, 5 m is realistic.'],
      a: 'About 7 m at best. At sea level the same pump would manage 10 m. Deep wells use a submerged pump that pushes up, or a pump at the bottom.' },
    { title: 'How tall could a tree be if only the wood\'s strength mattered?', q: 'The xylem of a species holds 2.5 MPa of tension before it cavitates. How tall a column of water is that, and how does it compare with the tallest trees?',
      steps: [{ text: 'Height supported by the tension:', tex: 'h = \\frac{2.5\\times10^{6}}{998 \\times 9.81} = 255\\ \\mathrm{m}' }, 'Gravity alone would limit the tree to 255 m; friction and the leaf\'s own demand cut it further.'],
      a: 'About 255 m by this count, far more than the 116 m of the tallest known tree. The leaves, not the wood, run out first ([[the-height-limit-of-trees]]).' }
  ],
  quiz: [
    { q: 'What makes a suction pump lift water?', choices: ['The vacuum pulls the water up', 'The atmosphere pushes water up into the low-pressure pipe', 'Cohesion between water molecules', 'The pump piston grips the water'], a: 1, why: 'Nothing sucks; the weight of the atmosphere on the open surface pushes the water up into a pipe where the pressure has been lowered.' },
    { q: 'On the summit of a high mountain a suction pump can lift water', choices: ['higher than at sea level', 'the same height', 'less high than at sea level', 'not at all, whatever the pressure'], a: 2, why: 'The limit is $(p_\\text{atm} - p_v)/\\rho g$; at 34 kPa on Everest it is about 3 m.' },
    { q: 'Trees lift water 100 m, so the atmosphere must push on the roots with extra force.', a: false, why: 'The atmosphere is worth only 10.3 m of water. The rest of the lift is tension: the pull of the evaporating leaves on a continuous thread.' },
    { q: 'Why does a pump lift hot water less far than cold?', choices: ['Hot water is denser', 'Its vapour pressure takes a larger share of the atmosphere\'s push, so the water boils in the pipe', 'It is more viscous', 'The air is thinner'], a: 1, why: 'The pipe can be pulled down only to the vapour pressure: 2.3 kPa at 20 °C but 70 kPa at 90 °C, which leaves a lift of only 3.3 m.' },
    { q: 'How high (m) would a water barometer stand at 101.3 kPa, taking the vapour pressure as zero and the density as 998 kg/m³?', answer: 10.35, why: '$h = p/\\rho g = 101{,}325 / (998.2 \\times 9.807) = 10.35$ m — the figure behind the Florentine pump-makers\' rule.' }
  ],
  applications: ['Pumps for wells and boats are rated by their suction lift, and the installation rules (short, straight inlet pipes; low position) come from this limit.', 'Mercury barometers and sphygmomanometers use a high-density liquid to keep the column practical.', 'Cavitation in pump inlets, the destruction of impellers when the inlet pressure falls to the vapour pressure, is the pump version of the failure that empties conduits.', 'Altitude and boiling: a kettle boils at 90 °C at 3,000 m for the same reason the pump fails.'],
  history: 'The Florentine rule was recorded by Galileo in the *Discorsi* of 1638. Torricelli\'s tube of mercury (1643), the Roman experiments with water barometers of Gasparo Berti in the early 1640s, and Pascal\'s mountain experiment (1648, carried out by Florin Périer) established that air has weight. Berthelot in 1850 and Briggs in 1950 held water under tension in the laboratory, and Dixon and Joly\'s 1894 proposal carried the same physics into the tree.',
  sources: ['Galileo Galilei, *Discorsi e dimostrazioni matematiche* (1638), the first day (the failure of pumps at eighteen braccia).', 'Pascal, *Récit de la grande expérience de l\'équilibre des liqueurs* (1648).', 'Koch, Sillett, Jennings and Davis, "The limits to tree height", *Nature* 428, 851 (2004).', 'Tyree and Zimmermann, *Xylem Structure and the Ascent of Sap* (2nd ed., 2002), ch. 1 (the history of the problem).'],
  sim: 'tree-pump-vs-tree'
},

/* ================================================================ the height limit */
{
  id: 'the-height-limit-of-trees', parent: 'trees-and-the-tallest', title: 'The height limit of trees', level: 3,
  short: 'No tree stands much above 120 metres. Koch and colleagues found in 2004 that the leaves at the top of the tallest redwoods are in permanent drought, however wet the ground: gravity and friction in the sap thread eat up the water pressure the leaves need, and the calculation lands at 122–130 m.',
  keywords: ['height limit', 'tallest tree', 'Hyperion', 'coast redwood', 'Sequoia sempervirens', 'Koch', 'hydraulic limitation', 'leaf water potential', 'turgor', 'leaf size', 'gravity', 'Eucalyptus regnans', '122 130 m'],
  prereq: ['negative-pressure-in-the-xylem', 'transpiration-pull', 'why-suction-stops-at-ten-metres'],
  related: ['cavitation-and-embolism', 'stomata-and-the-cost-of-carbon', 'a-tree-moves-a-tonne', 'osmosis-in-cells', 'clouds-rain-and-snow', 'physics:hydrostatic-pressure', 'biology:water-potential', 'biology:transpiration'],
  body: `
In 2004 a team led by George Koch climbed the redwoods of Humboldt Redwoods State Park, California, with ropes and pruning poles, and collected leaves from the crowns of trees over a hundred metres tall. The soil beneath was wet; the fog of the Pacific coast wrapped the trees. And yet the foliage at the top was in the condition of a plant in a desert: small, thick, tough, with its stomata largely shut. The tallest trees are drought-stressed in their own crowns, and the reason is the length of the thread of water.

### The numbers
| Tree | Height |
|---|---|
| Hyperion, coast redwood, California (found 2006) | 115.9 m |
| tallest redwood measured when Koch et al. reported (2004) | 112.7 m |
| Centurion, mountain ash (*Eucalyptus regnans*), Tasmania | 100.5 m |
| tallest Douglas firs, Pacific North-West | about 100 m |
| the Koch et al. prediction of the limit | 122–130 m |

Claims of 120–130 m for Victorian mountain ash and for Douglas firs in the nineteenth century have never been verified. A redwood may be 2,000 years old, so these trees have had the time; they have not had the water.

### Gravity first
Whatever the sap does, the pressure at height $h$ is lower than at the foot by $\\rho g h$: 0.0098 MPa per metre ([[negative-pressure-in-the-xylem]]), 1.13 MPa at 115 m. That price cannot be negotiated. Add friction, a few kPa per metre in the narrow conduits of branches and leaf veins, and the gradient is 0.014 MPa/m or so. The leaf at the top needs, to function, a water potential above some floor. In the redwoods that floor is near −1.9 MPa. The simple sum

$$h_\\text{max} = \\frac{P_s - P_\\text{min}}{\\rho_w g + G}$$

with the soil at −0.1 MPa gives about 126 m, which sits inside Koch's 122–130 m. It is also very sensitive to friction:

| Friction gradient | Height limit |
|---|---|
| 0 | 184 m |
| 2 kPa/m | 153 m |
| 4.5 kPa/m | 126 m |
| 8 kPa/m | 101 m |
| 12 kPa/m | 83 m |

### Why the leaf is the limit, not the wood
The wood could take 3–6 MPa, enough for 300 m of water. The leaf cannot. A plant cell grows by swelling against its wall, and for that it needs turgor ([[osmosis-in-cells]]), the pressure of the cell sap against the wall. When the water potential outside the cell falls, the turgor falls with it, until the cell cannot expand and the stomata, which are themselves turgor valves, must close ([[stomata-and-the-cost-of-carbon]]). Photosynthesis needs open stomata, and so leaf by leaf the tree slows down at the top.

Koch's team measured exactly this up the trunk. Predawn leaf water potential fell linearly with height at about the gravitational rate. Leaves got smaller and thicker with height (more leaf mass per unit area), their photosynthesis fell, and the proportion of carbon-13 in the leaf rose, a chemical record of stomata closing on the way to the top. Redwoods do not grow to the limit of the wood's strength; they grow to where the top's carbon income no longer pays for more height.

### What else bends the limit
Redwoods also drink fog through their leaves (Burgess and Dawson, 2004), which relieves the top at night; thicker sapwood and smaller leaves lower the friction per leaf; and a tree on a wetter, foggier coast may reach higher than one in a dry forest. Others argue that wind, lightning, nutrients or the supply of carbon to growing tips also limit height; the hydraulic account has the best evidence and the neatest numbers, but it is not the only voice.

> [!key] Gravity takes 0.0098 MPa for every metre of height and friction adds more, until the leaves at the top, still in wet ground, are too dry to grow or photosynthesise. In coast redwoods that comes at about 122–130 m: the limit is in the leaf, not the wood.`,
  ideas: ['The pressure in the sap falls 0.0098 MPa for each metre of height from gravity alone, plus friction.', 'The leaf, not the wood, is the limit: below a leaf water potential of about −1.9 MPa in redwoods the cells lose turgor, stomata close and photosynthesis stalls.', 'Koch et al. (2004) measured leaves in the tallest redwoods and predicted a height limit of 122–130 m; the tallest known tree is 115.9 m.', 'Top leaves are small, thick and slow, and their carbon isotopes record partly closed stomata.'],
  pitfalls: ['"Trees stop growing because the wood cannot stand more tension" — The xylem could carry 3–6 MPa; the leaves at the top run out of turgor well before that.', '"The tallest trees are limited by the 10 m of the atmosphere" — That limit applies only to pushing with a vacuum ([[why-suction-stops-at-ten-metres]]); the redwoods are ten times higher and still lifting.', '"There is a single proven reason for the height limit" — Hydraulics is the best-supported account, but wind, lightning, fire and nutrient supply also cap real trees and some researchers weigh carbon supply more.'],
  terms: [
    { term: 'Hydraulic limitation hypothesis', also: ['height limitation hypothesis'], def: 'The proposal (Ryan and Yoder, 1997; Koch et al., 2004) that the height of a tree is limited by the growing resistance and weight of the water column, which lowers the leaf water potential and so the leaves\' ability to grow and photosynthesise.' },
    { term: 'Turgor pressure', also: ['turgor', 'cell pressure'], def: 'The pressure of the cell contents against the wall of a plant cell, usually 0.3–1 MPa. It drives cell growth and keeps stomata and leaves firm; it falls as the water potential outside falls.' },
    { term: 'Leaf mass per area', also: ['LMA'], def: 'The dry mass of a leaf divided by its area. It rises with height in a tall tree: leaves are thicker and denser near the top, where water is scarce.' },
    { term: 'Foliar water uptake', also: ['fog uptake'], def: 'Absorption of water, often from fog or dew, directly through the leaf surface. It supplies water to the crown of coast redwoods without help from the roots.' },
    { term: 'Carbon-13 ratio', also: ['δ¹³C', 'carbon isotope discrimination'], def: 'The ratio of the heavy carbon isotope in plant tissue. When stomata partly close, the leaf discriminates less against the heavy isotope and the ratio rises, recording the water stress.' }
  ],
  formulas: [
    { name: 'The height at which the top leaf runs out', expr: 'h = (Ps - Pmin)/(rhoW*g + G)', tex: 'h_{max} = \\frac{P_s - P_{min}}{\\rho_w\\,g + G}',
      vars: { h: { name: 'height limit', q: 'length', unit: 'm', tex: 'h_{max}' }, Ps: { name: 'soil water potential', q: 'pressure', unit: 'MPa', signed: true, value: -0.1, tex: 'P_s', hint: 'About −0.03 MPa in moist soil, −1.5 MPa at wilting.' }, Pmin: { name: 'lowest leaf water potential that still works', q: 'pressure', unit: 'MPa', signed: true, value: -1.9, tex: 'P_{min}', hint: 'The potential at which the leaf can still grow and photosynthesise; about −1.9 MPa in redwoods.' }, rhoW: { const: 'rhoW' }, g: { const: 'g' }, G: { name: 'friction gradient', q: 'pressureGrad', unit: 'kPa/m', value: 4.5, hint: 'The extra tension per metre from flow in the conduits.' } },
      solveFor: 'h', note: 'A first-order account of Koch et al. 2004: soil, floor and gradient decide the height. Real trees vary the floor and the friction as they grow.',
      stories: { h: 'The soil holds water at {Ps}, the top leaves work down to {Pmin}, and the gradient is {G}. How tall can the tree grow?', G: 'A tree reaches {h}, with soil at {Ps} and a leaf floor of {Pmin}. What is the total gradient?' } },
    { name: 'The share of the gradient that is gravity', expr: 'f = rhoW*g/(rhoW*g + G)', tex: 'f = \\frac{\\rho_w\\,g}{\\rho_w\\,g + G}',
      vars: { f: { name: 'gravity\'s share', q: 'ratio', unit: '%', hint: 'The fraction of the tension per metre that comes from the weight of the water.' }, rhoW: { const: 'rhoW' }, g: { const: 'g' }, G: { name: 'friction gradient', q: 'pressureGrad', unit: 'kPa/m', value: 4.5 } },
      solveFor: 'f', note: 'Gravity is unchangeable at 9.8 kPa/m; friction is the part the tree can reduce.',
      stories: { f: 'Friction costs {G} per metre. What share of the total gradient is the weight of the water?' } },
    { name: 'Predawn water potential at height', expr: 'psi = Ps - rhoW*g*h', tex: '\\psi = P_s - \\rho_w\\,g\\,h',
      vars: { psi: { name: 'predawn leaf water potential', q: 'pressure', unit: 'MPa', signed: true, tex: '\\psi', hint: 'With no flow, the leaf is in equilibrium with the soil through the column.' }, Ps: { name: 'soil water potential', q: 'pressure', unit: 'MPa', signed: true, value: -0.1, tex: 'P_s' }, rhoW: { const: 'rhoW' }, g: { const: 'g' }, h: { name: 'height of the leaf', q: 'length', unit: 'm', value: 110 } },
      solveFor: 'psi', note: 'Koch et al. found the predawn values falling with height at about this rate.',
      stories: { psi: 'Wet soil holds water at {Ps}. What is the predawn water potential of a leaf {h} above the ground?', h: 'A leaf has a predawn potential of {psi} over soil at {Ps}. How high is it?' } }
  ],
  examples: [
    { title: 'A leaf at 110 metres', q: 'The soil is at −0.1 MPa, friction costs 4.5 kPa/m, and the leaf needs a further 0.15 MPa drop across itself at midday. What is its water potential before dawn, and at midday?',
      steps: [{ text: 'Predawn (no flow, so gravity only):', tex: '\\psi = -0.1 - 0.00981 \\times 110 = -1.18\\ \\mathrm{MPa}' }, { text: 'Midday: add the flow\'s friction and the leaf\'s own drop:', tex: '\\psi = -0.1 - (0.00981 + 0.0045) \\times 110 - 0.15 = -1.82\\ \\mathrm{MPa}' }],
      a: 'About −1.2 MPa before dawn and −1.8 MPa at midday. The midday figure is within a tenth of a megapascal of the leaf floor of −1.9 MPa, so a tree this tall has almost nothing in hand.' },
    { title: 'What if the friction doubled?', q: 'A tree whose conduits are twice as resistant (9 kPa/m) has the same soil (−0.1 MPa) and the same floor (−1.9 MPa). How tall can it grow?',
      steps: [{ text: 'Gradient:', tex: '\\rho_w g + G = 9.81 + 9 = 18.8\\ \\mathrm{kPa/m}' }, { text: 'Height limit:', tex: 'h_{max} = \\frac{1.8\\ \\mathrm{MPa}}{0.0188\\ \\mathrm{MPa/m}} = 96\\ \\mathrm{m}' }],
      a: 'About 96 m instead of 126 m: doubling the friction cuts the limit by a quarter. Since gravity is fixed, a tree\'s plumbing makes the difference between a 100 m giant and a 60 m one.' }
  ],
  quiz: [
    { q: 'What did Koch\'s team find in the foliage at the top of 110 m redwoods?', choices: ['Lush, large leaves because the light is best there', 'Small, thick leaves under drought stress, with partly closed stomata', 'Dead leaves because the sap cannot reach so high', 'No difference from the lower crown'], a: 1, why: 'Leaf size fell and mass per area rose with height, photosynthesis dropped, and carbon isotopes recorded partly closed stomata: the signature of drought stress in wet ground.' },
    { q: 'Gravity alone lowers the pressure in the sap by about … per metre of height.', choices: ['0.098 MPa', '0.0098 MPa', '0.00098 MPa', '1 MPa'], a: 1, why: '$\\rho g = 9.8$ kPa/m = 0.0098 MPa/m; over 100 m that is 0.98 MPa.' },
    { q: 'The limit to tree height is that the wood cannot withstand the tension.', a: false, why: 'The xylem is stronger than the leaves need: it bears 3–6 MPa, enough for 300 m of water, while the leaves lose turgor and close their stomata near −2 MPa.' },
    { q: 'If a tree could halve the friction in its branches and twigs, its height limit would', choices: ['halve', 'stay the same', 'rise, but not double, because gravity is fixed', 'double exactly'], a: 2, why: 'The limit is $(P_s - P_{min})/(\\rho g + G)$. Halving G helps but the fixed 9.8 kPa/m remains: from 126 m to about 144 m with these numbers.' },
    { q: 'With soil at −0.1 MPa, a leaf floor of −2.0 MPa and a friction gradient of 3 kPa/m, how tall (m) can a tree grow?', answer: 148, why: '$h = 1.9\\ \\mathrm{MPa} / (0.00981 + 0.003)\\ \\mathrm{MPa/m} = 148$ m.' }
  ],
  applications: ['Foresters and conservationists use the limit to predict how tall coast redwoods can be in a changing, drier climate.', 'Satellite and drone lidar surveys of forest height, and records such as Hyperion, are interpreted against the water-limited maximum.', 'Wood engineers and tree-breeders look at the friction in conduits to select taller-growing varieties.', 'Climate models of forest carbon storage depend on the height at which trees are limited by water supply.'],
  history: 'The idea that gravity and friction limit height was set out by Ryan and Yoder in 1997 and tested with climbing and sampling by Koch and colleagues in 2004; the tallest tree found since then, Hyperion (2006), is still within the predicted limit. George Koch\'s team climbed the Humboldt redwoods with Stephen Sillett, who had pioneered the study of redwood canopies.',
  sources: ['Koch, Sillett, Jennings and Davis, "The limits to tree height", *Nature* 428, 851 (2004).', 'Ryan and Yoder, "Hydraulic limits to tree height and tree growth", *BioScience* 47, 235 (1997).', 'Burgess and Dawson, "The contribution of fog to the water relations of *Sequoia sempervirens*", *Plant, Cell and Environment* 27, 1023 (2004).', 'Taiz and Zeiger, *Plant Physiology*, chapters on water balance and plant–water relations.'],
  sim: 'tree-height-limit'
},

/* ================================================================ stomata and the cost of carbon */
{
  id: 'stomata-and-the-cost-of-carbon', parent: 'trees-and-the-tallest', title: 'Stomata and the cost of carbon', level: 2,
  short: 'A leaf must open pores to let carbon dioxide in, and every time it does water vapour pours out: about 400 molecules of water lost for each CO₂ fixed. The stomata are turgor-driven valves that bargain between the two, and the cheaper bargains of C4 and CAM plants show what it costs.',
  keywords: ['stomata', 'guard cells', 'water-use efficiency', 'transpiration', 'carbon dioxide', 'photosynthesis', 'C4', 'CAM', 'abscisic acid', 'turgor', 'stomatal conductance', '400 molecules'],
  prereq: ['transpiration-pull', 'osmosis-in-cells', 'humidity-and-dew-point'],
  related: ['the-height-limit-of-trees', 'a-tree-moves-a-tonne', 'roots-and-root-pressure', 'the-water-cycle', 'vapour-pressure-and-evaporation', 'biology:photosynthesis', 'biology:transpiration'],
  body: `
A leaf makes sugar from carbon dioxide, and the air has very little of it: 0.04 %, one molecule in 2,500. Inside the leaf, the air in contact with the wet cell walls is saturated with water vapour, 3 % at 25 °C. So the pore that lets one CO₂ molecule in is a pore through which water vapour, at seventy times the concentration, can pour out. The leaf has to open to eat, and every time it opens it loses water.

### The pores
The pores are **stomata** (singular stoma), each bordered by a pair of **guard cells**. A typical stoma is 5–10 µm wide and 20–30 µm long, and there are 100–300 of them per square millimetre of leaf, together a few per cent of its area at most. Nearly all the gas exchange of the leaf goes through them, and nearly all the water lost from a tree passes out of them.

### How the valve works
A guard cell is a pressure vessel with a stiff, hoop-reinforced wall. In light, and especially blue light, proton pumps in its membrane push hydrogen ions out; potassium ions and their negative partners (malate and chloride) flow in, and the sap concentration rises from about 0.1 to about 0.4 mol/L. By osmosis ([[osmosis-in-cells]]) water follows, and the osmotic pressure ($\\Pi = icRT$) rises to about 2 MPa, which gives the cell a turgor of a megapascal or so. Because the cellulose microfibrils wind around the cell like hoops, the cell cannot widen; it lengthens and bows outward, and the two cells part to open the pore. To close, the solutes leave and the water follows. In drought the plant releases the hormone **abscisic acid**, which triggers closure within minutes; low humidity, darkness and high internal CO₂ also close them. The whole cycle takes a quarter of an hour to an hour.

### The price
Let the leaf have a conductance $g_s$ (mol of water per square metre per second per unit mole fraction) and let the air outside be at humidity such that the vapour-pressure deficit is VPD ([[humidity-and-dew-point]]). Then water vapour leaves at $E = g_s \\times \\text{VPD}/p$ and carbon dioxide enters at $A = (g_s/1.6)(c_a - c_i)$, because water vapour diffuses 1.6 times faster in air. The water lost per carbon gained is therefore

$$\\frac{E}{A} = \\frac{1.6\\,\\text{VPD}/p}{c_a - c_i}.$$

Typical numbers: a VPD of 2 kPa, a gradient $c_a - c_i$ of 120 µmol/mol. That is 263 water molecules per CO₂. On a dry day with a VPD of 4 kPa the price doubles to 526. This is the origin of the oft-quoted figure of about **400 H₂O per CO₂** for ordinary (C3) plants, and the reason that stomata of plants in dry air close at midday.

| Photosynthesis | Typical water lost per CO₂ fixed |
|---|---|
| C3 (most trees, wheat, rice) | about 400 molecules |
| C4 (maize, sugar cane, many grasses) | about 150 |
| CAM (cacti, agaves, pineapple) | about 50 |

C4 plants concentrate CO₂ inside the leaf, so they can run with a larger gradient and a smaller pore; CAM plants open their stomata only at night, when the air is cool and humid, and store the carbon as an acid until the sun arrives.

### The scale of the bargain
Fixing a kilogram of dry wood takes about 40 mol of carbon, and at 400 H₂O per CO₂ about 300 kg of water passes through the leaves. At the global scale, land plants send tens of thousands of cubic kilometres of water into the air each year: estimates are 40,000–60,000 km³ of the 73,000 km³ that evaporate from the land ([[the-water-cycle]]), most of it through stomata. Rising CO₂ narrows the stomata slightly, making forests a little more frugal.

> [!key] To let CO₂ in, a leaf must let water out: about 400 water molecules for each CO₂ in a typical tree, 150 in C4 and 50 in CAM plants. Stomata are turgor valves, opened by potassium and water and closed by drought, and they set the price of every gram of wood.`,
  ideas: ['The air holds 0.04 % CO₂ and the inside of the leaf 3 % water vapour, so a pore that lets carbon in lets water out about seventy times as readily.', 'Guard cells open by taking up potassium, which draws water in by osmosis; the turgor bends them apart, and loss of solute closes them.', 'Water lost per CO₂ fixed is $1.6\\,(\\text{VPD}/p)/(c_a - c_i)$, rising with dry air: about 400 for C3 plants, 150 for C4, 50 for CAM.', 'Land plants transpire about 40,000–60,000 km³ per year, a majority of land evaporation.'],
  pitfalls: ['"Plants lose water by accident" — Evaporation through open pores is the unavoidable cost of absorbing CO₂, and also the engine of sap flow and cooling; plants regulate it constantly by turgor.', '"Closing the stomata saves water at no cost" — It saves water but stops carbon gain; a plant with permanently closed pores starves. The best strategy depends on the marginal price of carbon.', '"Stomata open to let oxygen out" — Oxygen does leave through them, but the reason they open is carbon dioxide.'],
  terms: [
    { term: 'Stoma', also: ['stomata', 'stomatal pore'], def: 'A microscopic pore in the leaf surface, 5–10 µm wide, through which CO₂ enters and water vapour leaves. Usually 100–300 per square millimetre.' },
    { term: 'Guard cell', also: ['guard cells'], def: 'One of the pair of cells bordering a stoma. Their turgor, controlled by potassium and its anions, bends them apart to open the pore and lets them relax to close it.' },
    { term: 'Water-use efficiency', also: ['WUE', 'transpiration ratio'], def: 'The carbon gained per unit of water lost. Its inverse, the transpiration ratio, is about 400 mol of water per mol of CO₂ in C3 plants.' },
    { term: 'Stomatal conductance', also: ['g_s', 'gs'], def: 'How freely gas passes through the stomata, expressed in mol of water per square metre of leaf per second; 0.1–0.4 in trees by day, near 0.02 at night.' },
    { term: 'C4 and CAM photosynthesis', also: ['C4 plants', 'crassulacean acid metabolism'], def: 'Variants of photosynthesis that concentrate CO₂ spatially (C4) or in time (CAM, stomata open at night), cutting the water lost per carbon fixed to about 150 and 50 molecules.' },
    { term: 'Abscisic acid', also: ['ABA'], def: 'A plant hormone released in drought that closes stomata within minutes by making guard cells lose potassium and water.' }
  ],
  formulas: [
    { name: 'Water lost per CO₂ fixed', expr: 'n = 1.6*VPD/p*1000000/dc', tex: 'n = 1.6\\,\\frac{\\mathrm{VPD}}{p}\\,\\frac{10^{6}}{\\Delta c}',
      vars: { n: { name: 'water molecules lost per CO₂ molecule fixed', hint: 'The transpiration ratio, in mol/mol; about 400 for C3 plants.' }, VPD: { name: 'vapour-pressure deficit', q: 'pressure', unit: 'kPa', value: 2, tex: '\\mathrm{VPD}', hint: 'Saturation vapour pressure at the leaf minus the vapour pressure of the air; 0.5 kPa on a damp morning, 4 kPa in a heat wave.' }, p: { name: 'air pressure', q: 'pressure', unit: 'kPa', value: 101.325 }, dc: { name: 'CO₂ gradient across the pore (outside minus inside)', value: 120, min: 1, tex: '\\Delta c', hint: 'In µmol of CO₂ per mol of air; about 120–150 for a C3 leaf at 400 ppm outside.' } },
      solveFor: 'n', note: 'The 1.6 is the ratio of the diffusivities of water vapour and CO₂ in air.',
      stories: { n: 'A leaf transpires into air with a vapour-pressure deficit of {VPD} at {p}, with a CO₂ gradient of {dc} µmol/mol. How many water molecules are lost per CO₂ fixed?', VPD: 'A leaf loses {n} water molecules per CO₂ with a gradient of {dc} µmol/mol at {p}. What vapour-pressure deficit does that imply?' } },
    { name: 'Transpiration rate through the stomata', expr: 'E = gs*VPD/p*1000', tex: 'E = g_s\\,\\frac{\\mathrm{VPD}}{p}\\times 1000',
      vars: { E: { name: 'transpiration rate (mmol m⁻² s⁻¹)', hint: 'Water lost per square metre of leaf per second, in millimoles.' }, gs: { name: 'stomatal conductance (mol m⁻² s⁻¹)', value: 0.2, min: 0, tex: 'g_s', hint: '0.2 is a typical open tree leaf by day.' }, VPD: { name: 'vapour-pressure deficit', q: 'pressure', unit: 'kPa', value: 2, tex: '\\mathrm{VPD}' }, p: { name: 'air pressure', q: 'pressure', unit: 'kPa', value: 101.325 } },
      solveFor: 'E', note: 'A diffusion law: the flux is conductance times the driving mole fraction difference.',
      stories: { E: 'A leaf has a stomatal conductance of {gs} mol m⁻² s⁻¹ in air with a vapour-pressure deficit of {VPD}. How fast does it transpire?' } },
    { name: 'Osmotic pressure of the guard cell', expr: 'Pi = i*c*R*T', tex: '\\Pi = i\\,c\\,R\\,T',
      vars: { Pi: { name: 'osmotic pressure', q: 'pressure', unit: 'MPa', tex: '\\Pi' }, i: { name: 'particles per solute unit', value: 2, min: 1, max: 3, hint: 'About 2 for K⁺ with its anion.' }, c: { name: 'solute concentration', q: 'concentration', unit: 'mmol/L', value: 400 }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0 } },
      solveFor: 'Pi', note: 'The van \'t Hoff relation again: the open guard cell at 0.4 mol/L and closed at 0.1 differ by 1.5 MPa of osmotic pressure.',
      stories: { Pi: 'The sap of an open guard cell contains {c} of solute with {i} particles per unit, at {T}. What is its osmotic pressure?' } }
  ],
  examples: [
    { title: 'What the potassium buys', q: 'A closed guard cell holds 100 mmol/L of K⁺ and its anions (taking two particles per unit); an open one holds 400. How much does the osmotic pressure change, at 25 °C?',
      steps: [{ text: 'Open:', tex: '\\Pi = 2 \\times 400\\ \\mathrm{mol/m^3} \\times 8.314 \\times 298.15 = 1.98\\ \\mathrm{MPa}' }, { text: 'Closed:', tex: '\\Pi = 2 \\times 100 \\times 8.314 \\times 298.15 = 0.50\\ \\mathrm{MPa}' }],
      a: 'The osmotic pressure rises from 0.50 to 1.98 MPa, a gain of 1.5 MPa. Against a leaf water potential of about −0.5 to −1 MPa this leaves the guard cell a turgor of roughly 1 MPa, enough to bend and open the pore; in a dry leaf at −1.9 MPa the same gain would hold almost no turgor.' },
    { title: 'A heat wave raises the price', q: 'A C3 leaf holds a CO₂ gradient of 120 µmol/mol across its pores. How many water molecules does it lose for each CO₂ fixed when the vapour-pressure deficit is 2 kPa, and when it is 4 kPa?',
      steps: [{ text: 'At 2 kPa:', tex: 'n = 1.6 \\times \\frac{2}{101.3} \\times \\frac{10^{6}}{120} = 263' }, { text: 'At 4 kPa the deficit doubles, so the price does:', tex: 'n = 1.6 \\times \\frac{4}{101.3} \\times \\frac{10^{6}}{120} = 526' }],
      a: '263 against 526 water molecules per CO₂: the same carbon costs twice as much water in hot dry air, which is why stomata close at midday.' }
  ],
  quiz: [
    { q: 'Why does a leaf lose far more water than it gains carbon dioxide?', choices: ['Its pores are too big for water', 'The vapour inside the leaf is about a hundred times as concentrated as the CO₂ outside, and water diffuses faster', 'Water is heavier than CO₂', 'Photosynthesis makes water'], a: 1, why: '3 % vapour inside against 0.04 % CO₂ outside gives a gradient about seventy times larger for water; the 1.6 times higher diffusivity of vapour makes up the rest.' },
    { q: 'Guard cells open the pore by', choices: ['taking up potassium, which draws in water and raises turgor so the cells bend apart', 'losing water so they shrink', 'photosynthesis producing gas bubbles', 'muscle-like contraction'], a: 0, why: 'Potassium and anions enter; osmosis draws in water; the hoop-reinforced cells cannot widen but bend outward and part.' },
    { q: 'Closing the stomata completely during the day is the cheapest way for a plant to live.', a: false, why: 'It saves water but halts photosynthesis; a leaf with its stomata permanently shut starves. Plants close them to the degree the dry air demands.' },
    { q: 'Why do C4 plants lose less water per carbon fixed than C3 plants?', choices: ['They have no stomata', 'They concentrate CO₂ inside the leaf, so a smaller opening gives the same gradient', 'They live only in water', 'They photosynthesise in the dark'], a: 1, why: 'C4 plants use PEP carboxylase to pump CO₂ to the site where Rubisco works, keeping the internal CO₂ low, a steeper gradient and a smaller pore for the same carbon: about 150 H₂O per CO₂ against 400.' },
    { q: 'How many water molecules are lost per CO₂ fixed for a VPD of 3 kPa, air pressure 101.3 kPa and a CO₂ gradient of 150 µmol/mol?', answer: 316, why: '$1.6 \\times (3/101.3) \\times 10^{6} / 150 = 316$.' }
  ],
  applications: ['Crop breeding aims at higher water-use efficiency: C4 rice projects, drought-tolerant lines, partial-irrigation schedules that use ABA signalling.', 'Climate models need stomatal conductance to predict how much water forests return to the air and how this changes as CO₂ rises.', 'Porometers and infrared gas analysers measure stomatal conductance and photosynthesis in the field.', 'Succulent gardening and green roofs choose CAM plants because they lose so little water.'],
  history: 'Stephen Hales weighed potted plants in the 1720s and showed that they lose water through their leaves. Hugo von Mohl described the stoma and guard cells in 1856; Raschke and others in the 1970s identified abscisic acid as the drought signal, and in 2001 the blue-light receptors (phototropins) that open the stomata were located. Cowan and Farquhar\'s 1977 theory proposed that plants regulate stomata to make the carbon gained per water lost as large as the day allows.',
  sources: ['Taiz and Zeiger, *Plant Physiology*, the chapters on gas exchange and stomatal biology.', 'Cowan and Farquhar, "Stomatal function in relation to leaf metabolism and environment", *Symposia of the Society for Experimental Biology* 31, 471 (1977).', 'Jasechko et al., "Terrestrial water fluxes dominated by transpiration", *Nature* 496, 347 (2013); Schlesinger and Jasechko, "Transpiration in the global water cycle", *Agricultural and Forest Meteorology* 189–190, 115 (2014).', 'Hetherington and Woodward, "The role of stomata in sensing and driving environmental change", *Nature* 424, 901 (2003).'],
  sim: 'tree-stoma'
},

/* ================================================================ roots and root pressure */
{
  id: 'roots-and-root-pressure', parent: 'trees-and-the-tallest', title: 'Roots and root pressure', level: 2,
  short: 'Roots collect water through a vast surface of root hairs and fungal threads, and cross the Casparian strip into the xylem. At night the root is an osmotic pump that makes 0.1–0.5 MPa of positive pressure and drops at the leaf tips, but that pressure is a tenth of what a tall tree needs, and by day the pull of the leaves overrides it.',
  keywords: ['root pressure', 'root hair', 'Casparian strip', 'endodermis', 'guttation', 'mycorrhiza', 'bleeding sap', 'soil water potential', 'osmosis in roots', 'wilting point', 'salt stress', 'mangrove'],
  prereq: ['osmosis-in-cells', 'transpiration-pull', 'negative-pressure-in-the-xylem'],
  related: ['cavitation-and-embolism', 'stomata-and-the-cost-of-carbon', 'osmosis-and-osmotic-pressure', 'the-salt-of-the-sea', 'aquaporins', 'a-tree-moves-a-tonne', 'biology:water-potential', 'chemistry:osmotic-pressure'],
  body: `
On a still, humid dawn the tips of grass blades are strung with drops. It is not dew: the drops come from inside, squeezed out through pores at the leaf margin in the night when the stomata are shut. This is **guttation**, and the force behind it is the root's own osmotic pump.

### The collecting surface
A plant drinks through its roots, and a root is an immense surface. **Root hairs**, tubular extensions of the outer cells about 10 µm wide and up to a millimetre long, multiply the area: Dittmer's classic count of a single winter rye plant (1937) gave roughly 600 km of root and some 10,000 km of root hair. Beyond the hairs, **mycorrhizal** fungi, which live on the roots of about eight in ten plant species, spread threads a few micrometres wide through the soil and bring back water and phosphate for sugar. All of this water is held in the soil with a potential that decides who can take it:

| Soil water | Water potential |
|---|---|
| saturated soil | 0 to −0.01 MPa |
| field capacity (drained, still moist) | about −0.03 MPa |
| a crop beginning to stress | −0.5 MPa |
| the conventional permanent wilting point | −1.5 MPa |
| sea water (osmotic) | −2.7 MPa |
| air-dry soil | −100 MPa and lower |

### Across the root
Water crosses the cortex through the cell walls and through the cells themselves (via the aquaporins of [[aquaporins]]) until it reaches the **endodermis**, a cylinder of cells around the central stele. Their side walls carry a band of waxy suberin and lignin, the **Casparian strip**, which seals the gaps between the cells. No water can slip past in the walls; all must pass through the membranes of the endodermal cells. Two things follow. The root can choose what enters the xylem, and the root acts as an osmometer: the cells of the stele pump ions into the xylem sap and the strip stops them from leaking back.

### Root pressure
Osmosis does the rest ([[osmosis-and-osmotic-pressure]]). If the sap holds 60 mmol/L of solutes against 10 mmol/L in the soil water, the osmotic pressure difference is $\\Delta\\Pi = \\Delta c\\,RT$ = 120 kPa at 15 °C, and with a reflection coefficient $\\sigma$ of 0.9 for the strip the root holds a positive pressure of about 108 kPa. This is **root pressure**: a root can maintain 0.1–0.2 MPa, and occasionally up to 0.5 MPa. It shows as guttation, as the bleeding of a pruned grapevine in spring, and as the rise of sap in birch and maple.

Root pressure is real, but it cannot lift trees:

- It is **small**. A pressure of 0.1 MPa balances only 10 m of water. A 100 m tree needs about 1.5 MPa ([[negative-pressure-in-the-xylem]]).
- It is **feeble in flow**. It can push a few millilitres an hour, where a tree moves litres a minute.
- It **vanishes by day**. Once the leaves pull, the xylem pressure goes negative and root pressure is overridden. Many tall conifers show no root pressure at all.

Where it does matter is at night and in spring, when the leaves are off. Then root pressure can push gas into solution and refill conduits that embolised during the day ([[cavitation-and-embolism]]).

### When the soil is salty
If the soil water has more solute than the sap, the pump runs backwards: the root loses water to the soil, and the plant wilts in wet ground. A mangrove, standing in sea water at −2.7 MPa, avoids it by holding its xylem at −3 to −6 MPa and pulling water through the roots by tension, filtering out the salt with the endodermis.

> [!key] The root is an osmotic pump: the Casparian strip keeps ions in the xylem and water follows, giving a positive pressure of 0.1–0.5 MPa that shows as guttation at night. It cannot lift a tree, for it is a tenth as strong as needed and is overridden by day by the tension from the leaves.`,
  ideas: ['Root hairs and mycorrhizal fungi give the root a collecting surface hundreds of times the size of its visible skin.', 'The Casparian strip seals the walls of the endodermis, forcing water through membranes and trapping ions in the xylem: the root becomes an osmometer.', 'Root pressure is $\\sigma\\,\\Delta c\\,RT$, 0.1–0.5 MPa: enough for guttation and for refilling at night, but only 10 m of lift.', 'By day the leaves pull the xylem pressure negative; salty soil can reverse the osmosis and dry the plant.'],
  pitfalls: ['"Root pressure pushes the sap up the tree" — It is a tenth of what a tall tree needs, its flow is tiny, and by day the xylem is under tension, not pressure; the sap is pulled from above ([[transpiration-pull]]).', '"The drops on leaf tips at dawn are dew" — Dew forms on the surface from the air; guttation drops come out of the leaf through hydathodes, pushed by root pressure, and taste of the plant\'s solutes.', '"Plants die in salty soil because the salt is poisonous" — Often the first harm is osmotic: the soil water has a lower potential than the root can match, and the plant is physically unable to take up water.'],
  terms: [
    { term: 'Root pressure', also: ['osmotic root pressure'], def: 'The positive pressure (0.1–0.5 MPa) that roots build in the xylem by pumping solutes in and drawing water by osmosis; it shows when transpiration is low, at night or in spring.' },
    { term: 'Casparian strip', also: ['endodermis', 'suberin band'], def: 'A waxy band of suberin and lignin in the radial walls of the endodermis that seals the spaces between cells, so water and solutes must cross a membrane to enter the xylem. Described by Robert Caspary in 1865.' },
    { term: 'Root hair', also: ['root hairs'], def: 'A tubular outgrowth of a root epidermal cell, about 10 µm wide and up to 1 mm long, that multiplies the absorbing surface and reaches into soil pores.' },
    { term: 'Guttation', also: ['hydathode', 'bleeding'], def: 'The exudation of liquid water from the tips and edges of leaves through pores called hydathodes, driven by root pressure when transpiration is stopped.' },
    { term: 'Mycorrhiza', also: ['mycorrhizae', 'mycorrhizal fungi'], def: 'A partnership between a fungus and a plant root, in which the fungus brings water and nutrients from the soil in exchange for sugar. About 80 % of plant species have it.' }
  ],
  formulas: [
    { name: 'Root pressure', expr: 'Pr = sigma*(cs - ce)*R*T', tex: 'P_r = \\sigma\\,(c_s - c_e)\\,R\\,T',
      vars: { Pr: { name: 'root pressure', q: 'pressure', unit: 'kPa', signed: true, tex: 'P_r', hint: 'Positive: the root pushes sap up. Negative: the soil is saltier than the sap and the root loses water.' }, sigma: { name: 'reflection coefficient of the root', q: 'ratio', unit: '', value: 0.9, min: 0, max: 1, tex: '\\sigma', hint: '1 means the strip holds the solutes perfectly; real roots are 0.5–0.9.' }, cs: { name: 'solutes in the xylem sap', q: 'concentration', unit: 'mmol/L', value: 60, min: 0, tex: 'c_s', hint: 'Typically 20–100 mmol/L of ions and sugars in the root sap.' }, ce: { name: 'solutes in the soil water', q: 'concentration', unit: 'mmol/L', value: 10, min: 0, tex: 'c_e', hint: 'About 5–20 mmol/L in fertile soil, 600 in sea water.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 15, min: 0, max: 40 } },
      solveFor: 'Pr', note: 'A van \'t Hoff osmotic pressure with the Casparian strip\'s selectivity; counts total particles, so enter the total concentration of ions and molecules.',
      stories: { Pr: 'Root sap holds {cs} of solutes, the soil water {ce}; the Casparian strip has $\\sigma$ = {sigma}, and the roots are at {T}. What root pressure follows?', cs: 'A root holds {Pr} of pressure against soil water at {ce}, with $\\sigma$ = {sigma} at {T}. What is the solute concentration of its sap?' } },
    { name: 'How high root pressure can hold water', expr: 'h = Pr/(rhoW*g)', tex: 'h = \\frac{P_r}{\\rho_w\\,g}',
      vars: { h: { name: 'height of the column held', q: 'length', unit: 'm' }, Pr: { name: 'root pressure', q: 'pressure', unit: 'kPa', value: 108, tex: 'P_r' }, rhoW: { const: 'rhoW' }, g: { const: 'g' } },
      solveFor: 'h', note: 'A static column only: at this height no water flows, and friction makes the real figure lower.',
      stories: { h: 'A root holds a pressure of {Pr}. How tall a column of sap could it support if no water were flowing?' } },
    { name: 'Osmotic potential of the soil solution', expr: 'psi = -i*c*R*T', tex: '\\psi_s = -\\,i\\,c\\,R\\,T',
      vars: { psi: { name: 'osmotic potential', q: 'pressure', unit: 'MPa', signed: true, tex: '\\psi_s', hint: 'Sea water is about −2.7 MPa; fertile soil water about −0.02 MPa.' }, i: { name: 'particles per solute unit', value: 1.86, min: 1, max: 3, hint: 'About 1.86 for sodium chloride at sea-water strength.' }, c: { name: 'solute concentration', q: 'concentration', unit: 'mol/L', value: 0.6 }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0, max: 40 } },
      solveFor: 'psi', note: 'The pull a salty solution exerts on water, which a root must beat to take any up.',
      stories: { psi: 'Soil water holds {c} of salt, at {i} particles per unit, at {T}. What osmotic potential does it exert on the roots?' } }
  ],
  examples: [
    { title: 'A root in fertile soil', q: 'Xylem sap holds 60 mmol/L of solutes, the soil water 10 mmol/L, the root reflection coefficient is 0.9 and the temperature 15 °C. What root pressure results, and how tall a column could it hold?',
      steps: [{ text: 'Osmotic difference:', tex: '\\Delta\\Pi = 50\\ \\mathrm{mol/m^3} \\times 8.314 \\times 288.15 = 120\\ \\mathrm{kPa}' }, 'With $\\sigma = 0.9$ the root pressure is $0.9 \\times 120 = 108$ kPa.', { text: 'Height:', tex: 'h = \\frac{108\\ \\mathrm{kPa}}{9.8\\ \\mathrm{kPa/m}} = 11\\ \\mathrm{m}' }],
      a: 'About 108 kPa, a static column of 11 m. A good root pump in damp soil lifts a shrub or a vine in the night, not a redwood.' },
    { title: 'Could root pressure lift a hundred-metre tree?', q: 'To push sap up a 100 m tree with 5 kPa/m of friction needs 1.48 MPa. What solute difference between the xylem and the soil would that need with $\\sigma = 0.9$ at 15 °C?',
      steps: [{ text: 'Required osmotic difference:', tex: '\\Delta c = \\frac{P_r}{\\sigma R T} = \\frac{1.48\\times10^{6}}{0.9 \\times 8.314 \\times 288.15} = 690\\ \\mathrm{mol/m^3}' }],
      a: 'About 0.69 mol/L, over ten times the 50 mmol/L difference real roots keep up. Root pressure cannot do the job, which is why the leaves have to pull.' }
  ],
  quiz: [
    { q: 'Drops at the tips of grass blades on a still, humid dawn are most likely', choices: ['dew condensing from the air', 'guttation, pushed out by root pressure', 'rain from the night', 'water pulled through the stomata'], a: 1, why: 'With the stomata shut and the air humid, there is no transpiration; the root pump still runs and squeezes sap out through the hydathodes at the leaf margins.' },
    { q: 'Root pressure lifts the sap to the crown of a redwood.', a: false, why: 'Root pressure is 0.1–0.5 MPa, worth 10–50 m of static column and almost no flow; a 100 m tree needs about 1.5 MPa and moves litres per minute. By day the pressure is negative and the pull comes from the leaves.' },
    { q: 'What does the Casparian strip do?', choices: ['Holds the root in the soil', 'Seals the gaps between endodermal cells so water must cross a membrane, making the root an osmometer', 'Fixes nitrogen', 'Stores starch'], a: 1, why: 'The waxy band blocks the wall route between the cells; all water and ions must pass a membrane, so the ions pumped into the xylem cannot leak out.' },
    { q: 'If the soil water becomes saltier than the root sap, a plant in wet soil will', choices: ['take up water faster', 'be unaffected', 'lose water to the soil and wilt', 'make more root pressure'], a: 2, why: 'The osmotic difference reverses; water flows from the root to the soil. This is why irrigation with salty water kills crops without any poisoning.' },
    { q: 'What root pressure (kPa) would a root make with $\\sigma = 1$ and a solute difference of 50 mmol/L at 20 °C?', answer: 122, why: '$\\Delta\\Pi = 50 \\times 8.314 \\times 293.15 = 121.9$ kPa.' }
  ],
  applications: ['Sap tapping of birch and maple in late winter and spring (partly a freeze–thaw stem pressure, partly root pressure).', 'Salt-affected farmland: breeders look for crops whose roots exclude salt or adjust their osmotic potential.', 'Hydroponics and potted plants: guttation drops on leaf tips are a sign of a well-watered, humid, root-pressured plant (and of over-fertilising when the drops leave deposits).', 'Rewilding and restoration forestry use mycorrhizal inoculation to help seedlings take up water.'],
  history: 'Stephen Hales measured root pressure in a bleeding grapevine in 1727 with a manometer. Robert Caspary described the strip in 1865. In 1891 Eduard Strasburger showed that trunks killed with poison still raised water for days, which pointed to the leaves rather than to living cells or roots; the cohesion–tension theory of 1894 explained how.',
  sources: ['Steudle, "Water uptake by plant roots: an integration of views", *Plant and Soil* 226, 45 (2000).', 'Dittmer, "A quantitative study of the roots and root hairs of a winter rye plant", *American Journal of Botany* 24, 417 (1937).', 'Taiz and Zeiger, *Plant Physiology*, the chapters on water balance and on the transport of water.', 'Smith and Read, *Mycorrhizal Symbiosis* (3rd ed., Academic Press, 2008).'],
  sim: 'tree-root-pressure'
},

/* ================================================================ a tree moves a tonne */
{
  id: 'a-tree-moves-a-tonne', parent: 'trees-and-the-tallest', title: 'A tree moves a tonne a day', level: 1,
  short: 'A big tree can move hundreds of litres of water on a summer day, and the giants approach a tonne. Evaporating it takes tens of kilowatts of sunlight, which is why a forest cools the air, and a forest as large as the Amazon sends tens of billions of tonnes a day into the sky: the "flying rivers" that feed the next rain.',
  keywords: ['transpiration rate', 'sap flow', 'evapotranspiration', 'cooling by evaporation', 'flying rivers', 'Amazon', 'forest rainfall', 'latent heat', 'vapour pressure deficit', 'tonne of water', 'daily water use of a tree'],
  prereq: ['stomata-and-the-cost-of-carbon', 'transpiration-pull', 'latent-heat-of-vaporisation', 'the-water-cycle'],
  related: ['evaporative-cooling', 'humidity-and-dew-point', 'clouds-rain-and-snow', 'vapour-pressure-and-evaporation', 'how-much-water-things-take', 'roots-and-root-pressure', 'biology:transpiration', 'aerodynamics:humidity-air'],
  body: `
Stand under an oak on a hot July afternoon and the air is cooler and softer than in the open field. That coolness is paid for in water. A large broadleaf tree typically moves a hundred to a few hundred litres on a summer day, and the biggest trees on the hottest days approach a tonne, a cubic metre of water, drawn from the soil, lifted, and sent out through the leaves as vapour.

### The energy bill
Evaporating a litre of water takes 2.44 MJ at leaf temperature. A tonne takes 2.44 GJ, which is 678 kWh. Spread over a 12-hour day that is a steady 56 kW of heat leaving the tree as latent heat, about the cooling power of fifteen domestic air conditioners (a "ton of refrigeration" is 3.5 kW). The Sun delivers about 800 W to every square metre of a crown at midday, so a crown of 200 m² receives 160 kW and spends a third of it on evaporation. That is the tree's thermostat: a leaf in full sun that could not evaporate would heat 5–10 K above the air.

| What | Water moved per day |
|---|---|
| a garden tree, 5–10 m | 20–50 L |
| a large oak or beech in summer | 100–400 L |
| a giant redwood on a hot day | 500–1,000 L |
| a hectare of forest | 20,000–40,000 L (2–4 mm of rain) |
| the whole Amazon basin | about 20 billion tonnes |
| all land plants together | roughly 110–160 billion tonnes |

### What sets the rate
Three things. **Sunlight** opens the stomata and heats the leaf. **The vapour-pressure deficit**, the difference between the saturated vapour pressure at leaf temperature and the vapour pressure of the air ([[humidity-and-dew-point]]), is the driving force: it doubles from a damp morning to a dry afternoon. **The soil** limits the supply: if the water potential in the root zone falls, the stomata close to protect the xylem ([[cavitation-and-embolism]]). The result is a curve that rises with the morning, peaks in early afternoon rather than at solar noon, because the air keeps drying and warming after the light peaks, and may dip at midday as the stomata throttle. At night it falls near to zero.

The water is not drawn only from the soil at the moment of use. A big trunk is also a tank: its diameter shrinks by a fraction of a millimetre at midday and recovers at night, and a tenth or so of a large tree's daily water can come from its own storage.

### Flying rivers
A hectare of forest transpiring 3 mm a day is 30 tonnes. The Amazon basin, 6 million km² of mostly forest, moves about 20 billion tonnes a day through its trees, comparable with the 17–18 billion tonnes a day that the Amazon River carries to the sea. Isotope studies by Salati and colleagues in the 1970s showed that between a quarter and a half of the basin's rain has already been through the forest once: the air that crosses the continent from the Atlantic rains out, is re-evaporated by the trees, and rains again. Brazilian climatologist Antonio Nobre called this movement of moist air "flying rivers". When forest is cleared, the recycling stops, and satellite studies find less rain downwind of the cleared land (Spracklen et al., 2012). A forest is part of the machinery of its own rainfall ([[the-water-cycle]]).

> [!key] A large tree moves hundreds of litres, up to about a tonne, of water a day: a latent-heat flux of tens of kilowatts, which cools its surroundings. At the scale of a continent the same stomata send tens of billions of tonnes a day into the air to fall as rain again.`,
  ideas: ['Evaporating a tonne of water takes 2.44 GJ, about 56 kW over a 12-hour day: a large tree is a cooling plant.', 'The rate follows sunlight, the vapour-pressure deficit and soil water, peaking in the early afternoon.', 'A hectare of forest transpires 20,000–40,000 L a day; the Amazon basin about 20 billion tonnes.', 'Forests recycle between a quarter and a half of the rain over the Amazon, so clearing them reduces rainfall.'],
  pitfalls: ['"A tree uses most of its water to grow" — Less than one per cent of the water that passes through a plant is retained in its tissues; nearly all leaves as vapour, as the price of letting CO₂ in.', '"Transpiration is just wasted water" — It also cools the leaf, brings nutrients up and is part of the rain cycle; a forest that stops transpiring is hotter, drier and less rainy.', '"Cooling by trees is shade only" — Shade is part of it, but evaporation does most: a transpiring tree stays cooler than a dry post in the same sun.'],
  terms: [
    { term: 'Sap flow', also: ['sap flux', 'xylem flux'], def: 'The volume of water moving up through the trunk per unit time, measured with heat-pulse or heat-dissipation sensors. Large trees show 100–1,000 L a day in summer.' },
    { term: 'Vapour-pressure deficit', also: ['VPD', 'saturation deficit'], def: 'The difference between the saturated vapour pressure at the leaf temperature and the actual vapour pressure of the air. It is the driving force for transpiration, typically 0.5–4 kPa.' },
    { term: 'Evapotranspiration', also: ['ET', 'evaporation plus transpiration'], def: 'The total water returned to the air from a land surface by evaporation from soil and water and transpiration from plants.' },
    { term: 'Precipitation recycling', also: ['moisture recycling', 'flying rivers'], def: 'The fraction of the rain over a region that comes from water evaporated or transpired within that region; a quarter to a half over the Amazon basin.' },
    { term: 'Latent heat flux', also: ['latent heat of evaporation flux'], def: 'The heat carried away from a surface by evaporating water, in watts per square metre or in total watts; for a large transpiring tree tens of kilowatts.' }
  ],
  formulas: [
    { name: 'Cooling power of evaporation', expr: 'P = m*Lv/t', tex: 'P = \\frac{m\\,L_v}{t}',
      vars: { P: { name: 'cooling power', q: 'power', unit: 'kW', hint: 'The heat removed by evaporating the water, averaged over the time.' }, m: { name: 'mass of water evaporated', q: 'mass', unit: 'kg', value: 1000, hint: '1,000 kg is one tonne, one cubic metre.' }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2442, tex: 'L_v', hint: '2,442 kJ/kg at 25 °C.' }, t: { name: 'time it takes', q: 'time', unit: 'h', value: 12, hint: 'Most transpiration happens in the daylight hours.' } },
      solveFor: 'P', note: 'About 680 W per litre per hour. A tonne in 12 hours takes 56 kW.',
      stories: { P: 'A tree evaporates {m} of water in {t}, with a latent heat of {Lv}. What is the average cooling power?', m: 'A tree cools at {P} for {t} by evaporation ({Lv}). How much water does it move?' } },
    { name: 'Water moved by a forest', expr: 'V = A*d', tex: 'V = A\\,d',
      vars: { V: { name: 'volume of water', q: 'volume', unit: 'L' }, A: { name: 'forest area', q: 'area', unit: 'ha', value: 1 }, d: { name: 'depth transpired (as if over the area)', q: 'length', unit: 'mm', value: 3, hint: '2–4 mm a day in a leafy forest in summer.' } },
      solveFor: 'V', note: '1 mm over 1 hectare is 10,000 litres.',
      stories: { V: 'A forest of {A} transpires the equivalent of {d} of water a day. How many litres is that?' } },
    { name: 'The share of the Sun spent on evaporation', expr: 'f = P/(I*Ac)', tex: 'f = \\frac{P}{I\\,A_c}',
      vars: { f: { name: 'share of intercepted sunlight spent on evaporation', q: 'ratio', unit: '%' }, P: { name: 'cooling power', q: 'power', unit: 'kW', value: 56 }, I: { name: 'sunlight on the crown', q: 'intensity', unit: 'W/m²', value: 800, hint: 'About 1,000 W/m² at noon in clear skies; 800 for a slanted crown surface.' }, Ac: { name: 'crown area facing the Sun', q: 'area', unit: 'm²', value: 200, tex: 'A_c' } },
      solveFor: 'f', note: 'A rough energy balance; the rest of the sunlight goes into photosynthesis (about 1 %), heating the air and the leaves, and reflection.',
      stories: { f: 'A tree cools at {P} under sunlight of {I} on a crown of {Ac}. What fraction of the intercepted sunlight does the evaporation take?' } }
  ],
  examples: [
    { title: 'A tonne in a day', q: 'A big tree transpires 1,000 kg of water in 12 hours at a latent heat of 2,442 kJ/kg. What cooling power is that, and how many 3.5 kW air conditioners does it match?',
      steps: [{ text: 'Energy:', tex: 'Q = m L_v = 1000 \\times 2.442\\times10^{6} = 2.44\\ \\mathrm{GJ} = 678\\ \\mathrm{kWh}' }, { text: 'Power:', tex: 'P = \\frac{2.44\\times10^{9}}{12\\times3600} = 56\\ \\mathrm{kW}' }, 'Divide by 3.5 kW for each air conditioner.'],
      a: '56 kW, as much as sixteen domestic air conditioners. A tonne a day is a day\'s hard work for a very large tree.' },
    { title: 'Flying rivers', q: 'The Amazon basin covers 6 million km². If its forest transpires on average 3 mm of water a day, how much water is that, and how does it compare with the Amazon River\'s 200,000 m³/s?',
      steps: [{ text: 'Volume per day:', tex: 'V = 6\\times10^{12}\\ \\mathrm{m^2} \\times 0.003\\ \\mathrm{m} = 1.8\\times10^{10}\\ \\mathrm{m^3}' }, { text: 'The river per day:', tex: '200{,}000 \\times 86{,}400 = 1.7\\times10^{10}\\ \\mathrm{m^3}' }],
      a: 'About 18 billion tonnes a day, about the same as the river itself. The river that runs on the ground and the one that rises into the air are of the same size.' }
  ],
  quiz: [
    { q: 'Roughly how much power does a large tree spend on evaporation on a sunny summer day?', choices: ['50 W', '5 kW', '50 kW', '50 MW'], a: 2, why: 'A tonne a day at 2.44 MJ/kg is 2.44 GJ, or 56 kW over 12 hours; a more modest 300 L is 17 kW. Tens of kilowatts is the right order.' },
    { q: 'The tree gets the energy for evaporation from burning its stored sugar.', a: false, why: 'The energy is sunlight, absorbed by the leaves as heat. Photosynthesis stores about one per cent of the sunlight; evaporation sends a third or more away as latent heat.' },
    { q: 'Transpiration usually peaks in the early afternoon rather than at solar noon because', choices: ['the roots work best then', 'the vapour-pressure deficit keeps rising as the air warms and dries after the light peaks', 'sunlight is brightest then', 'the soil is wettest then'], a: 1, why: 'The driving force is the vapour-pressure deficit, which follows the air temperature, which peaks 2–3 hours after solar noon. If the stomata close at midday the peak is even later.' },
    { q: 'Between a quarter and a half of the rain that falls on the Amazon basin comes from', choices: ['the Pacific Ocean', 'the Atlantic only', 'water already evaporated or transpired by the forest', 'the Andes ice caps'], a: 2, why: 'Isotope studies showed that the moisture is recycled by the forest. Clearing trees reduces both the recycled supply and the rain downwind.' },
    { q: 'How much energy (GJ) does it take to evaporate one tonne of water at 2,442 kJ/kg?', answer: 2.44, why: '$1000\\ \\mathrm{kg} \\times 2.442\\ \\mathrm{MJ/kg} = 2442$ MJ = 2.44 GJ.' }
  ],
  applications: ['Urban planners count the cooling of street trees: a transpiring tree can lower the air temperature beneath it by several degrees, and shade and evaporation together can cut a building\'s summer cooling load.', 'Foresters and hydrologists use sap-flow sensors and stand water balances to predict how felling or planting trees changes streamflow and groundwater.', 'The Amazon "flying rivers" idea is used in arguments about the rainfall consequences of deforestation for farmers and cities downwind.', 'Irrigation planners treat a crop\'s evapotranspiration as the main component of its water demand.'],
  history: 'Stephen Hales measured how much water a plant passes in 1727 by weighing potted sunflowers. Bruno Huber introduced the heat-pulse method for sap flow in 1932, and today sap-flow sensors are installed on trees worldwide. The isotope study of Salati and colleagues (1979) and later work by Nobre and others put numbers on the Amazon\'s moisture recycling.',
  sources: ['Wullschleger, Meinzer and Vertessy, "A review of whole-plant water use studies in trees", *Tree Physiology* 18, 499 (1998).', 'Salati, Dall\'Olio, Matsui and Gat, "Recycling of water in the Amazon basin: an isotopic study", *Water Resources Research* 15, 1250 (1979).', 'Spracklen, Arnold and Taylor, "Observations of increased tropical rainfall preceded by air passage over forests", *Nature* 489, 282 (2012).', 'Jasechko et al., "Terrestrial water fluxes dominated by transpiration", *Nature* 496, 347 (2013).', 'Taiz and Zeiger, *Plant Physiology*, the chapters on water balance and on plants in the environment.'],
  sim: 'tree-transpiration-day'
}

);
