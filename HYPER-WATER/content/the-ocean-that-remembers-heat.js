/* HYPER-WATER · content/the-ocean-that-remembers-heat.js — the topic "The ocean that remembers heat" (branch Heat and Climate).
 * specific-heat-of-water is written in content/reference.js; this file holds the other nine concepts:
 *   why-the-heat-capacity-is-so-high   oceans-as-a-heat-reservoir   maritime-and-continental-climates
 *   thermal-conductivity-of-water      evaporative-cooling          hurricanes-and-latent-heat
 *   thermal-expansion-of-the-sea       water-cools-machines         the-body-at-37-degrees
 * Simulations are in sims/the-ocean-that-remembers-heat.js (ids heat-…).
 */
Hyper.add(

/* ================================================================ why the heat capacity is so high */
{
  id: 'why-the-heat-capacity-is-so-high', parent: 'the-ocean-that-remembers-heat', title: 'Why the heat capacity is so high', level: 2,
  short: 'Per atom water stores heat as any metal does (25 J/(mol·K), the Dulong–Petit value); per kilogram it is extreme because its atoms are light. But the match hides a second story: the liquid holds twice as much per atom as ethanol, ice or steam, because warming it keeps rearranging a network of hydrogen bonds.',
  keywords: ['why is the specific heat of water high', 'Dulong-Petit', 'equipartition', 'degrees of freedom', 'configurational heat capacity', 'heat capacity minimum 35 C', 'supercooled heat capacity', 'heat capacity fluctuations'],
  prereq: ['specific-heat-of-water', 'what-a-hydrogen-bond-is', 'bonds-that-flicker'],
  related: ['the-structure-of-liquid-water', 'heat-capacity-and-compressibility-anomalies', 'supercooled-water-and-no-mans-land', 'two-liquids-in-one', 'latent-heat-of-vaporisation', 'physics:specific-heat', 'chemistry:calorimetry'],
  body: `
Heat a kilogram of iron and a kilogram of water with the same heater and the iron races ahead nine times as fast. "Water is special" is the reflex answer. A better one starts with a plainer question: where *can* heat go?

### Heat needs somewhere to go
Temperature measures one thing only, the random motion of molecules. Heat flowing into a body can be stored as faster translation, faster tumbling, stronger vibration of the atoms about their places and, in a liquid, a change in the way the molecules are arranged. The **equipartition theorem** says that at high enough temperature each independent way of storing energy (a **degree of freedom**) takes the same share, ½$k_BT$ per molecule, which is ½$R$ per mole in the heat capacity. More places to put the energy means more heat for each kelvin.

### Per atom, nothing is unusual
In a simple solid every atom can vibrate in three directions, each carrying kinetic and potential energy: six half-shares, $3R = 24.9$ J/(mol·K) per mole of atoms. This is the **Dulong–Petit law**, and metals keep it: iron 25.1, copper 24.5, lead 26.7. Liquid water has 75.3 J/(mol·K) per mole of molecules; each molecule has three atoms; that is **25.1 per mole of atoms**, indistinguishable from iron.

The surprise per kilogram is therefore arithmetic. An average atom in water weighs 6 g/mol, an atom of iron 56. A kilogram of water holds 167 mol of atoms, a kilogram of iron 18: nine times as many things to warm. Light atoms mean a high specific heat, which is why the hydrogen compounds (water, ammonia, methane) lead the table.

### But the match is partly a coincidence
Free water molecules in steam hold only **33.6 J/(mol·K)**, about $4R$: three translations and three rotations count, and the vibrations of the atoms inside the molecule do not. The stretch of an O–H bond is worth some eighteen times the thermal energy $k_BT$ at room temperature, and quantum mechanics keeps such a stiff mode frozen; it takes no heat. The same freezing explains why ethanol, ice and steam come to only about **half** of $3R$ per atom (12.5, 12.3 and 11.2), and why diamond, with its very stiff bonds, gives 6.1.

So liquid water is not "normal", it is double. It stores 41.7 J/(mol·K) more than the same molecules as a gas, **55 % of its total**, and that surplus is the **configurational heat capacity**: as the liquid warms, the hydrogen-bond network keeps loosening. The estimated number of bonds per molecule falls from about 3.9 at 0 °C to 3.1 at 100 °C, and every bond bent or broken stores energy as potential energy of arrangement rather than as motion (see [[bonds-that-flicker]]). Ice, whose bonds are locked in a lattice that cannot rearrange, has no such surplus and about half the liquid's value; steam has no bonds to loosen.

### Heat capacity is a measure of fluctuation
Statistical mechanics gives a second reading: $C = \\langle \\delta E^2\\rangle / k_BT^2$. The heat capacity measures how much the energy of a small sample fluctuates around its mean. A sample of water, whose bonds form and break every picosecond or so, fluctuates enormously, and so absorbs heat with little change in temperature.

### The curve is not flat
The specific heat has a shallow **minimum near 35 °C** (4,178 J/(kg·K)), rising to 4,217 at 0 °C and 4,216 at 100 °C. Two terms compete: the ordinary vibrational part rises with temperature as modes unfreeze, while the structural part shrinks as the network has less left to loosen. In supercooled water the structural part takes over: the heat capacity climbs steeply (about 5,000 at −30 °C, the engine's approximate figure; measurements on small droplets climb faster still). An old extrapolation by Speedy and Angell (1976) had it diverging near −45 °C; whether it would is [[supercooled-water-and-no-mans-land|still argued]]. The compressibility has its own minimum near 46 °C and the density its maximum at 4 °C: three response functions with turning points in the liquid range, the subject of [[heat-capacity-and-compressibility-anomalies]] and [[two-liquids-in-one]].

> [!key] Per atom, liquid water stores heat like a metal, and per kilogram it beats everything because its atoms are light. Beneath that coincidence lies the real anomaly: more than half of its heat capacity is the cost of rearranging hydrogen bonds, which is why the liquid holds twice what ethanol, ice or steam hold per atom.`,
  ideas: ['Per mole of atoms liquid water (25.1 J/(mol·K)) equals iron and the Dulong–Petit value $3R$; per kilogram it is nine times iron because its atoms are light.', 'Free water molecules in steam hold 33.6 J/(mol·K); the liquid holds 75.3, so 55 % of the liquid\'s heat capacity is the rearranging of the hydrogen-bond network.', 'Stiff vibrations are quantum-frozen at room temperature, which is why molecular substances usually hold only about half of $3R$ per atom; water is unusual in reaching the full value.', 'The liquid curve has a minimum near 35 °C and rises on both sides, steeply in the supercooled liquid.', 'Heat capacity measures energy fluctuations: a network that makes and breaks bonds every picosecond fluctuates a lot.'],
  pitfalls: ['"Water\'s heat capacity is high because its hydrogen bonds are strong" — The bonds are weak (about 20 kJ/mol). What matters is that they can be stretched and broken a few at a time over a whole range of temperature, so the liquid can store energy gradually.', '"Water must have a large heat capacity per molecule" — Per mole of atoms it is ordinary. The kilogram is large only because water\'s atoms are light, a fact about arithmetic rather than bonding.', '"Ice has fewer bonds, so it holds less heat" — Ice has more intact bonds than the liquid. It holds half as much because its bonds are fixed in a lattice and cannot rearrange as it warms.'],
  terms: [
    { term: 'Dulong–Petit law', also: ['law of Dulong and Petit', '3R'], def: 'The rule that a simple solid has a molar heat capacity of $3R$ = 24.9 J/(mol·K) per mole of atoms, found by Dulong and Petit in 1819. It follows from equipartition for six half-shares per atom and fails for stiff bonds (diamond) at room temperature.' },
    { term: 'Equipartition theorem', also: ['equipartition of energy'], def: 'In classical statistical mechanics each independent quadratic term in the energy of a molecule has an average of ½$k_BT$. Counting the terms predicts heat capacities, and a mode too stiff to be excited at the given temperature is "frozen out" and does not count.' },
    { term: 'Degree of freedom', also: ['mode of motion'], def: 'One independent way a molecule can hold energy: a direction of translation, an axis of rotation, a vibration. A water molecule has 3 translational, 3 rotational and 3 vibrational modes, of which the vibrations hold almost no heat at room temperature.' },
    { term: 'Configurational heat capacity', also: ['structural contribution', 'bond-breaking contribution'], def: 'The part of a liquid\'s heat capacity that goes into changing the arrangement of its molecules, here the bending and breaking of hydrogen bonds, rather than into their motion. For water it is the 41.7 J/(mol·K) by which the liquid exceeds the gas.' },
    { term: 'Response function', also: ['susceptibility', 'thermodynamic response function'], def: 'A quantity that says how a system responds to a change of temperature or pressure: heat capacity (to heating), compressibility (to squeezing), thermal expansivity (to warming). Each is proportional to a fluctuation, and water\'s are all anomalous.' }
  ],
  formulas: [
    { name: 'Dulong–Petit specific heat', expr: 'c = 3*n*R/M', tex: 'c = \\frac{3\\,n\\,R}{M}',
      vars: { c: { name: 'specific heat', q: 'specificheat', unit: 'J/(kg·K)' }, n: { name: 'atoms per formula unit', int: true, value: 1, min: 1, max: 12, tex: 'n', hint: 'One for a metal, three for \\ce{H2O} counting each atom.' }, R: { const: 'R' }, M: { name: 'molar mass of the formula unit', q: 'molarmass', unit: 'g/mol', value: 55.845, tex: 'M' } },
      solveFor: 'c', note: 'Good for metals (iron 447 against 449 measured); for water with $n = 3$ and $M$ = 18.015 g/mol it gives 4,153 against the measured 4,182, a coincidence of about 1 %, since the stiff internal vibrations are frozen and the bonds supply the difference.',
      stories: { c: 'An element with molar mass {M} follows the Dulong–Petit law with {n} atom per formula unit. What is its specific heat?' } },
    { name: 'Molar from specific heat', expr: 'Cm = c*M', tex: 'C_m = c\\,M',
      vars: { Cm: { name: 'molar heat capacity', q: 'molarheat', unit: 'J/(mol·K)' }, c: { name: 'specific heat', q: 'specificheat', unit: 'J/(kg·K)', value: 4182 }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 } },
      solveFor: 'Cm', note: 'Converts the engineer\'s unit (per kilogram) into the physicist\'s (per mole). Dividing again by the number of atoms in a molecule gives the figure to compare with $3R$.',
      stories: { Cm: 'A liquid has specific heat {c} and molar mass {M}. What is its molar heat capacity?' } },
    { name: 'Share of the liquid\'s heat capacity that is the bonds', expr: 'f = (Cl - Cg)/Cl', tex: 'f = \\frac{C_{\\text{liq}} - C_{\\text{gas}}}{C_{\\text{liq}}}',
      vars: { f: { name: 'share from rearranging the network', q: 'ratio', unit: '%' }, Cl: { name: 'molar heat capacity of the liquid', q: 'molarheat', unit: 'J/(mol·K)', value: 75.3, tex: 'C_{\\text{liq}}' }, Cg: { name: 'molar heat capacity of the vapour', q: 'molarheat', unit: 'J/(mol·K)', value: 33.6, tex: 'C_{\\text{gas}}' } },
      solveFor: 'f', note: 'A rough but instructive estimate: it treats the molecules\' own motion as unchanged by condensing, which is not exactly true.',
      stories: { f: 'A liquid has a molar heat capacity of {Cl} and its vapour {Cg}. What fraction of the liquid\'s heat capacity is not accounted for by the molecules\' own motion?' } },
    { name: 'A gas from equipartition', expr: 'Cp = (nf/2 + 1)*R', tex: 'C_p = \\left(\\frac{f}{2} + 1\\right) R',
      vars: { Cp: { name: 'molar heat capacity at constant pressure', q: 'molarheat', unit: 'J/(mol·K)' }, nf: { name: 'active degrees of freedom', int: true, value: 6, min: 3, max: 12, tex: 'f', hint: '3 for an atom, 5 for a diatomic at room temperature, 6 for a bent molecule such as water.' }, R: { const: 'R' } },
      solveFor: 'Cp', note: 'The extra $R$ is the work the gas does expanding at constant pressure. Six degrees of freedom for water vapour give 33.3, against 33.6 measured.',
      stories: { Cp: 'A gas molecule has {nf} active degrees of freedom. What is its molar heat capacity at constant pressure?' } }
  ],
  examples: [
    { title: 'Copper and water by Dulong and Petit', q: 'Predict the specific heats of copper (molar mass 63.55 g/mol, one atom per formula unit) and of liquid water (18.015 g/mol, three atoms) from $3R$ per mole of atoms, and compare with 385 and 4,182 J/(kg·K).',
      steps: [{ text: 'Copper:', tex: 'c = \\frac{3 \\times 8.314}{0.06355} = 392\\ \\mathrm{J/(kg\\cdot K)}' }, { text: 'Water, nine half-shares per molecule:', tex: 'c = \\frac{3 \\times 3 \\times 8.314}{0.018015} = 4{,}153\\ \\mathrm{J/(kg\\cdot K)}' }, 'Copper is 2 % high and water 0.7 % low. Water\'s agreement looks like another metal\'s, but only the liquid achieves it: ethanol, with nine atoms per 46 g/mol, would be predicted at 4,870 and measures 2,440.'],
      a: 'Copper 392, water 4,153 J/(kg·K): both within about 2 % of the measured values.' },
    { title: 'What the bonds contribute', q: 'Liquid water has $C_p$ = 75.3 J/(mol·K) at 25 °C, ice 36.9 at 0 °C and water vapour 33.6. Estimate how much heat per mole per kelvin goes into rearranging the network, and how it compares with the ice.',
      steps: ['Surplus of the liquid over the gas: $75.3 - 33.6 = 41.7$ J/(mol·K), which is $41.7/75.3 = 55\\ \\%$ of the liquid\'s value.', 'Surplus of the liquid over the ice: $75.3 - 36.9 = 38.4$ J/(mol·K). The two estimates agree: about 40 J/(mol·K), roughly $5R$, is what rearranging the network adds.'],
      a: 'About 40 J/(mol·K), more than half of the liquid\'s total.' }
  ],
  quiz: [
    { q: 'Per mole of atoms, liquid water\'s heat capacity compared with iron\'s is', choices: ['a ninth', 'about the same', 'twice as large', 'nine times as large'], a: 1, why: '75.3 J/(mol·K) per molecule is 25.1 per mole of atoms; iron is 25.1. The ninefold difference per kilogram comes from the atoms\' masses (6 g/mol for water\'s average atom, 56 for iron).' },
    { q: 'A mole of free water molecules in the vapour holds more heat per kelvin than a mole of liquid water.', a: false, why: 'The vapour holds 33.6 J/(mol·K), the liquid 75.3. Condensing adds the hydrogen-bond network and its capacity to store heat as rearrangement.' },
    { q: 'Why does diamond (6.1 J/(mol·K) per mole of atoms at room temperature) fall so far below the Dulong–Petit value?', choices: ['Its atoms are heavy', 'Its bonds are so stiff that many vibrations are frozen out by quantum mechanics', 'It conducts heat too well', 'It has no hydrogen bonds'], a: 1, why: 'Equipartition assumes every mode can be excited by thermal energy. In diamond the vibrations need much more than $k_BT$ at room temperature, so most of them take no heat; Einstein explained this in 1907.' },
    { q: 'Using $3R$ per mole of atoms, what specific heat does the Dulong–Petit law predict for lead (207.2 g/mol)? (J/(kg·K))', answer: 120.4, tol: 0.03, why: '$3 \\times 8.314 / 0.2072 = 120.4$ J/(kg·K); the measured value is 129. The law works best for heavy, soft metals.' },
    { q: 'The specific heat of liquid water between 0 and 100 °C has its minimum near', choices: ['0 °C', '4 °C', '35 °C', '100 °C'], a: 2, why: 'The minimum of about 4,178 J/(kg·K) lies near 35 °C. The density maximum is at 4 °C and the compressibility minimum near 46 °C: three different turning points of three different response functions.' }
  ],
  applications: ['Choosing a coolant or a heat-storage liquid: the heat capacity per kilogram and per litre both matter, and water wins both against almost everything.', 'Calorimetry: the "calorie" is defined by water\'s heat capacity, and calorimeters are calibrated against it.', 'Interpreting simulations of water: a good model must reproduce the heat capacity, a stringent test because it depends on the fluctuations of the whole network.', 'Understanding supercooled water: the rise of the heat capacity below 0 °C is one of the signs scientists use to test the two-liquid picture.'],
  history: 'Dulong and Petit announced in 1819 that the atoms of the elements they measured all had about the same heat capacity. Einstein explained the failures in 1907 with the first quantum theory of a solid, and Debye refined it in 1912.',
  sources: ['Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4 — the heat capacity of the liquid and its structural interpretation.', 'Atkins, *Physical Chemistry* — equipartition, the Dulong–Petit law, and heat capacity as a fluctuation.', 'CRC *Handbook of Chemistry and Physics* — heat capacity of water against temperature, and of the elements.', 'Henderson, *The Fitness of the Environment* (1913), ch. 2 — the first systematic account of water\'s thermal properties.'],
  sim: 'heat-cp-curve'
},

/* ================================================================ the oceans as a heat reservoir */
{
  id: 'oceans-as-a-heat-reservoir', parent: 'the-ocean-that-remembers-heat', title: 'The oceans as a heat reservoir', level: 2,
  short: 'The top 3.5 m of the sea hold as much heat as the whole atmosphere, and the whole ocean about a thousand times more. It has absorbed about nine-tenths of the heat trapped since 1971, gets hottest weeks after the sun does, and can run a fever of its own: the marine heatwave.',
  keywords: ['ocean heat content', 'energy imbalance', 'ocean heat uptake', '90 percent of global warming', 'marine heatwave', 'seasonal lag', 'mixed layer', 'Argo', 'thermal inertia of the ocean', 'committed warming'],
  prereq: ['specific-heat-of-water', 'how-much-water-earth-has'],
  related: ['maritime-and-continental-climates', 'thermal-expansion-of-the-sea', 'ocean-currents', 'water-vapour-greenhouse', 'sea-ice-and-albedo', 'hurricanes-and-latent-heat', 'the-water-cycle', 'physics:specific-heat'],
  body: `
Imagine peeling the atmosphere off the Earth, weighing it and measuring how much heat it takes to warm it by one kelvin. Now ask how deep a layer of the sea would need the same heat capacity. The answer is **3.5 metres**. The ocean, 3.7 km deep on average, holds about a thousand atmospheres' worth.

### A thousand atmospheres of heat capacity
| Reservoir | Mass, kg | Specific heat, J/(kg·K) | Heat capacity, J/K |
|---|---|---|---|
| atmosphere | 5.15 × 10¹⁸ | 1,005 | 5.2 × 10²¹ |
| top 700 m of sea | 2.6 × 10²⁰ | 3,990 | 1.0 × 10²⁴ |
| the whole ocean | 1.37 × 10²¹ | 3,990 | 5.5 × 10²⁴ |

Sea water's specific heat is a little below fresh water's 4,182 because of the salt. Even so, water has four times the specific heat of air and about eight hundred times its density: the ratio is what makes the ocean the planet's thermal memory (see [[specific-heat-of-water]] and [[why-the-heat-capacity-is-so-high]]).

### Where the extra heat went
Greenhouse gases, mainly carbon dioxide and [[water-vapour-greenhouse|water vapour]] responding to it, have left the Earth taking in more sunlight than it radiates away: an energy imbalance of about 0.5 to 1 W/m² averaged over the planet. Between 1971 and 2018 that added about 435 ZJ (4.35 × 10²³ J) to the climate system, according to the IPCC's sixth assessment: 91 % of it in the ocean, 5 % in the land, 3 % in the ice and 1 % in the air. The ocean's share, about 4 × 10²³ J, spread through the *whole* ocean amounts to only 0.07 K. Concentrated in the top 700 m it is a few tenths of a kelvin. The same energy poured into the atmosphere alone would have warmed it by roughly 77 K, which is the reason the thermometer on land has not shown it. Ship-borne instruments and the Argo array (about four thousand autonomous floats diving to 2,000 m since the early 2000s) record the heat directly.

### The sea runs late
Summer sunshine peaks at the solstice, but the northern mid-latitude sea is warmest in **August or September**. Sunlight is absorbed through the top metres and stirred by wind into a *mixed layer* some 30 to 100 m deep, whose heat capacity is so large that its temperature can follow the sun only with a delay of two to three months, and with a swing of a few kelvin instead of tens (compute it with the time constant below, or run [[maritime-and-continental-climates|the seasons simulation]]). In winter the stored heat is released, which warms the air blowing off the sea.

### Fever in the sea
The same inertia makes warm anomalies last. A **marine heatwave**, defined as sea temperature above the local 90th percentile for at least five days, can last months. The warm "Blob" in the north-east Pacific persisted from 2013 to 2016 with consequences for fisheries, seabirds and coral; record sea-surface temperatures in the North Atlantic and Mediterranean followed in 2022 and 2023. Because the ocean forgets slowly it also commits the climate to warming already underway: the surface air will not stop warming the day emissions stop, since the deep ocean takes decades to equalise.

### What the ocean does with it
The heat is not held in place: currents carry it poleward ([[ocean-currents]]), warm seas supply latent heat to storms ([[hurricanes-and-latent-heat]]) and the water itself expands ([[thermal-expansion-of-the-sea]]), so that part of sea-level rise is the ocean's thermometer reading.

> [!key] A few metres of sea hold the heat of the whole atmosphere, so the ocean took nine-tenths of the extra heat and warmed by only a fraction of a degree. Its large heat capacity makes it late in the year, slow to forget and the clock by which the climate runs.`,
  ideas: ['Ocean depth equivalent to the atmosphere\'s heat capacity: 3.5 m; the whole ocean holds about 1,000 times as much.', 'The ocean absorbed about 91 % of the Earth\'s extra heat in 1971–2018 (about 4 × 10²³ J), yet warmed by only 0.07 K on average, a few tenths in the top 700 m.', 'The sea is warmest one to three months after the sun, because the mixed layer has a large heat capacity relative to its heat loss.', 'Marine heatwaves are persistent warm anomalies, defined against the local 90th percentile.', 'Ocean heat memory means warming continues for decades after a change in forcing.'],
  pitfalls: ['"The oceans took most of the heat, so they must be much hotter" — Temperature is heat divided by heat capacity. The ocean absorbed 90 % of the heat and has about a thousand times the capacity of the air, so it warmed by far less.', '"The heat is gone from the climate system once it sinks into the deep ocean" — It remains there, and the same deep water exchanges slowly with the surface; the warming is delayed, not avoided.', '"The sea is hottest at midsummer, like the land" — The large heat capacity delays the peak by months; land peaks a few weeks after the solstice, the open ocean two to three months.'],
  terms: [
    { term: 'Ocean heat content', also: ['OHC', 'ocean heat uptake'], def: 'The heat stored in a layer of the ocean, measured as the change in temperature times mass times specific heat, summed over depth. It is the most direct gauge of the Earth\'s energy imbalance; about 90 % of the extra heat is found in it.' },
    { term: 'Earth\'s energy imbalance', also: ['radiative imbalance', 'top-of-atmosphere imbalance'], def: 'The difference between the sunlight the planet absorbs and the heat it radiates to space, about 0.5–1 W/m² on average in recent decades. A positive imbalance means the planet is gaining heat, nearly all into the ocean.' },
    { term: 'Mixed layer', also: ['surface mixed layer', 'upper ocean'], def: 'The top 10 to 100 m of the sea, stirred by wind and waves to a nearly uniform temperature. Its depth sets how much water takes part in the seasonal warming, and so how late and how small the seasonal swing is.' },
    { term: 'Thermal inertia', also: ['thermal memory', 'heat capacity per area'], def: 'The reluctance of a body to change temperature, set by its heat capacity relative to the rate at which it exchanges heat. The ocean\'s inertia is why the climate responds to forcing over decades.' },
    { term: 'Marine heatwave', also: ['MHW', 'ocean heatwave'], def: 'A period of at least five days when sea temperature at a place exceeds that place\'s 90th percentile for the time of year (the definition of Hobday and colleagues, 2016). Some last for months.' },
    { term: 'Argo float', also: ['Argo programme', 'profiling float'], def: 'An autonomous robot that drifts at 1,000 m, dives to 2,000 m and rises measuring temperature and salinity every ten days, then transmits by satellite. About four thousand of them have made the ocean\'s heat content measurable since the early 2000s.' }
  ],
  formulas: [
    { name: 'Warming of a layer of sea by a steady heat flux', expr: 'dT = F*t/(rho*c*D)', tex: '\\Delta T = \\frac{F\\,t}{\\rho\\,c\\,D}',
      vars: { dT: { name: 'warming', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, F: { name: 'heat flux into the layer', q: 'intensity', unit: 'W/m²', value: 0.5, hint: 'The Earth\'s energy imbalance has been about 0.5–1 W/m², nearly all of it entering the ocean.' }, t: { name: 'time', q: 'time', unit: 'yr', value: 48 }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, c: { name: 'specific heat of sea water', q: 'specificheat', unit: 'J/(kg·K)', value: 3990 }, D: { name: 'depth of the layer', q: 'length', unit: 'm', value: 700 } },
      solveFor: 'dT', note: 'Assumes all the heat stays in the layer: the real heat spreads deeper and is carried by currents, so this is an upper bound for the top 700 m.',
      stories: { dT: 'A flux of {F} enters the top {D} of the sea for {t}. By how much does it warm?', D: 'A flux of {F} for {t} warms a layer of sea by {dT}. How deep is the layer?' } },
    { name: 'Heat gained by the planet', expr: 'Q = F*A*t', tex: 'Q = F\\,A\\,t',
      vars: { Q: { name: 'heat gained', q: 'energy', unit: 'J' }, F: { name: 'energy imbalance', q: 'intensity', unit: 'W/m²', value: 0.8 }, A: { name: 'area of the Earth', q: 'area', unit: 'km²', value: 5.1e8 }, t: { name: 'time', q: 'time', unit: 'yr', value: 1 } },
      solveFor: 'Q', note: 'About 0.8 W/m² over the Earth\'s 5.1 × 10⁸ km² for a year is 1.3 × 10²² J (13 zettajoules).',
      stories: { Q: 'The Earth gains {F} averaged over its area of {A} for {t}. How much heat is that?' } },
    { name: 'Time constant of a mixed layer', expr: 'tau = rho*c*D/lam', tex: '\\tau = \\frac{\\rho\\,c\\,D}{\\lambda}',
      vars: { tau: { name: 'time constant', q: 'time', unit: 'yr', tex: '\\tau' }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, c: { name: 'specific heat of sea water', q: 'specificheat', unit: 'J/(kg·K)', value: 3990 }, D: { name: 'mixed-layer depth', q: 'length', unit: 'm', value: 50 }, lam: { name: 'heat lost per kelvin of warming', q: 'heattransfer', unit: 'W/(m²·K)', value: 8, tex: '\\lambda', hint: 'Radiation, evaporation and conduction together; 5–15 W/(m²·K) is typical.' } },
      solveFor: 'tau', note: 'How long the layer takes to relax most of the way (63 %) to a new balance. A time constant comparable to the year makes the seasonal peak lag by a few months.',
      stories: { tau: 'A mixed layer {D} deep loses {lam} per kelvin of warming. What is its time constant?' } },
    { name: 'Sea beneath a square metre against the air above it', expr: 'n = rho*c*D/(M*ca)', tex: 'n = \\frac{\\rho\\,c\\,D}{M\\,c_a}',
      vars: { n: { name: 'sea ÷ air heat capacity' }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, c: { name: 'specific heat of sea water', q: 'specificheat', unit: 'J/(kg·K)', value: 3990 }, D: { name: 'depth of sea', q: 'length', unit: 'm', value: 700 }, M: { name: 'mass of air above a square metre', q: 'arealdensity', unit: 'kg/m²', value: 10100, hint: 'The atmosphere weighs 10,100 kg per square metre of Earth; atmospheric pressure divided by $g$ gives about 10,300 at sea level.' }, ca: { name: 'specific heat of air', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_a' } },
      solveFor: 'n', note: 'For 3.5 m the ratio is 1; for the full 3,700 m mean depth about 1,000. Per square metre of open ocean the top 700 m hold about 280 times the heat capacity of the air above it.',
      stories: { n: 'A column of sea {D} deep sits beneath {M} of air. How many times its heat capacity is the air\'s?' } }
  ],
  examples: [
    { title: 'Where the 4 × 10²³ joules went', q: 'The oceans took up about $4\\times10^{23}$ J between 1971 and 2018. By how much would they have warmed if the heat were spread through (a) the whole ocean (1.37 × 10²¹ kg), (b) the top 700 m (2.6 × 10²⁰ kg), (c) the heat had gone into the atmosphere (5.15 × 10¹⁸ kg, 1,005 J/(kg·K))? Use 3,990 J/(kg·K) for the sea.',
      steps: [{ text: '(a) Whole ocean:', tex: '\\Delta T = \\frac{4\\times10^{23}}{1.37\\times10^{21} \\times 3990} = 0.073\\ \\mathrm{K}' }, { text: '(b) Top 700 m:', tex: '\\Delta T = \\frac{4\\times10^{23}}{2.6\\times10^{20}\\times 3990} = 0.39\\ \\mathrm{K}' }, { text: '(c) The air:', tex: '\\Delta T = \\frac{4\\times10^{23}}{5.15\\times10^{18}\\times1005} = 77\\ \\mathrm{K}' }, 'Real heat sits between (a) and (b) and mostly in the upper few hundred metres: the measured 0–700 m warming is a few tenths of a kelvin.'],
      a: '0.07 K for the whole ocean, 0.4 K for the top 700 m, 77 K had it all gone into the air.' },
    { title: 'Why the sea peaks late', q: 'A mixed layer 50 m deep loses 8 W/(m²·K). Its time constant is $\\tau = \\rho c D/\\lambda$. Estimate the delay of its yearly temperature peak behind the sun, using the phase lag $\\phi = \\arctan(\\omega\\tau)$ with $\\omega = 2\\pi$ per year.',
      steps: ['Time constant: $\\tau = 1025 \\times 3990 \\times 50 / 8 = 2.56\\times10^7$ s = 0.81 yr.', '$\\omega\\tau = 2\\pi \\times 0.81 = 5.1$, so $\\phi = \\arctan 5.1 = 79°$.', 'A phase of 79° out of 360° in a year is 0.22 yr, or 2.6 months.'],
      a: 'About 2.6 months after the solstice: late August or September.' }
  ],
  quiz: [
    { q: 'About how many times the atmosphere\'s heat capacity does the whole ocean have?', choices: ['3', '30', '1,000', '1,000,000'], a: 2, why: 'The top 3.5 m of sea equal the atmosphere; the mean depth is 3,700 m, so about 1,000 times. (The ocean covers 71 % of the Earth, hence "about".)' },
    { q: 'Although the oceans absorbed about 90 % of the extra heat, the average temperature of the whole ocean has risen by less than the surface air has.', a: true, why: 'The ocean\'s heat capacity is a thousand times the air\'s. A little warming of a huge mass stores a great deal of heat.' },
    { q: 'Spread through the whole ocean (1.37 × 10²¹ kg, 3,990 J/(kg·K)), 4 × 10²³ J warms it by about how many kelvin?', answer: 0.073, unit: 'K', tol: 0.04, why: '$4\\times10^{23}/(1.37\\times10^{21}\\times3990) = 0.073$ K.' },
    { q: 'Mid-latitude sea surface temperature peaks in late summer, long after the longest day, because', choices: ['the sun is strongest in August', 'the mixed layer\'s large heat capacity delays its warming by months', 'the sea reflects sunlight in June', 'heat only reaches the sea in August'], a: 1, why: 'The heat balance of a body with a large heat capacity lags its forcing: the time constant of the mixed layer is about a year.' },
    { q: 'A marine heatwave is defined as sea temperature above', choices: ['25 °C for a week', 'the local 90th percentile for at least five days', 'the global mean for a month', '30 °C anywhere'], a: 1, why: 'The definition is relative to the climate of that place and season, so that a heatwave can occur in a cold sea, not only in a tropical one.' }
  ],
  applications: ['Climate projections: the ocean\'s uptake of heat delays surface warming and sets the timing of the response.', 'Seasonal forecasting: the temperature of the sea in spring helps predict the summer\'s weather, from the Atlantic hurricane season to the Indian monsoon.', 'Fisheries and coral reefs: marine heatwaves bleach coral and move fish stocks, and are now tracked daily from satellites.', 'Argo and satellite altimetry: ocean heat content is the main sum of Earth\'s energy imbalance.', 'Coastal air conditioning: the stored summer heat is released over the following months, keeping coasts mild in winter.'],
  history: 'Temperature soundings of the deep sea began with the Challenger expedition of 1872–76. The floats of the Argo array, first deployed in 2000 and numbering some three thousand by 2007, made the heat content of the upper ocean measurable worldwide for the first time.',
  sources: ['IPCC, *Climate Change 2021: The Physical Science Basis*, ch. 7 (the Earth\'s energy budget) and ch. 9 (the ocean) — the 435 ZJ energy inventory and its partition.', 'Hobday et al., "A hierarchical approach to defining marine heatwaves", *Progress in Oceanography* 141 (2016) — the definition used here.', 'Argo Programme (argo.ucsd.edu) — the float array and its measurements of ocean heat content.', 'Henderson, *The Fitness of the Environment* (1913), ch. 3 — heat capacity and the oceans\' role in the planet\'s climate.'],
  sim: 'heat-column'
},

/* ================================================================ maritime and continental climates */
{
  id: 'maritime-and-continental-climates', parent: 'the-ocean-that-remembers-heat', title: 'Maritime and continental climates', level: 1,
  short: 'London and Moscow lie within five degrees of latitude, but January averages 5 °C in one and −7 °C in the other. The sea stores summer heat and returns it in winter, while the land does not, so a coast swings little and an interior swings enormously; the same logic runs the day and night in a desert.',
  keywords: ['maritime climate', 'continental climate', 'London and Moscow', 'sea breeze', 'diurnal range', 'annual range', 'desert nights', 'continentality', 'coastal climate', 'thermal lag'],
  prereq: ['specific-heat-of-water', 'oceans-as-a-heat-reservoir'],
  related: ['ocean-currents', 'the-water-cycle', 'thermal-conductivity-of-water', 'humidity-and-dew-point', 'physics:heat-transfer', 'biology:climate-ecosystems'],
  body: `
Moscow (55.8° N) and London (51.5° N) face nearly the same sunshine through the year. In July both average about 19 °C. In January London averages about 5 °C and Moscow about −7 °C: a **yearly range** of 14 K against 26 K. Go further into Siberia and Yakutsk (62° N) averages about −38 °C in January and about +19 °C in July, a range of nearly 60 K. Latitude is the same story; what differs is how much water is upwind.

### Why the sea moderates
Four things work together.
1. **Heat capacity.** A kilogram of water holds four to five times the heat of a kilogram of dry soil or rock, and the sea is far denser in heat per cubic metre than air.
2. **Depth of mixing.** Sunlight sinks into the sea and wind stirs the top 30 to 100 m into one body. On land the heat enters only the top centimetres at midday and conducts slowly downward: the penetration depth $\\sqrt{\\kappa P/\\pi}$ is about 0.1 to 0.2 m in a day and 3 to 4 m in a year for moist soil (see [[thermal-conductivity-of-water]]). The sea's effective heat capacity per square metre is therefore tens of times larger.
3. **Evaporation.** A wet surface sends away heat as latent heat ([[latent-heat-of-vaporisation]]), which holds down its warming.
4. **Transparency.** Water lets sunlight in; most of a rock's heating is a surface skin.

The result, from a simple energy balance, is a damped, delayed wave: the temperature swing falls as the heat capacity rises, and the peak lags the sun by up to a quarter of the cycle. The open ocean surface swings by only a few kelvin through the year (1 to 3 K in the tropics, 5 to 10 K in mid-latitudes) and peaks two to three months after the solstice; dry land swings by 20 K or more and peaks a few weeks after it.

### The day-night version
A desert at the height of summer can swing by 25 to 30 K between afternoon and dawn: sand has a low heat capacity, the heat stays in the top centimetres and the dry air holds little humidity to slow the night's radiation. A tropical island sits within 5 to 8 K of its mean all day and night. The same contrast creates the **sea breeze**: by early afternoon the land is warmer than the water, the air above it rises and cooler air flows in from the sea; at night the pattern reverses. A *monsoon* is the same circulation at the scale of a year.

### The Atlantic and Europe: a nuance
It is often said that the Gulf Stream is why north-west Europe is warm. Seager and colleagues (2002) showed that the picture is more subtle: the winter contrast between Atlantic and Pacific coasts at the same latitude depends mostly on the heat the Atlantic stores in summer and releases to the winter westerlies, and on the large-scale pattern of winds and mountains; ocean currents carrying heat north are a smaller part. For a place with the sea upwind the *heat capacity* matters most.

### Hemispheres
The northern hemisphere is 61 % ocean, the southern 81 %. The southern hemisphere's mid-latitudes therefore have much smaller seasonal swings than the north's: a southern "continental" climate hardly exists.

### Try the model
The simulation below treats a surface as a single heat store with a heat loss proportional to its warming. Move the "depth of water" slider (the heat capacity) from sand to ocean, and watch the swing shrink and the peak slip later.

> [!key] A body with large heat capacity needs a long time to warm and cool, so the sea moderates both seasons and nights: coastal climates are mild and late, continental ones extreme and prompt. Latitude gives the sunshine; the water upwind decides how much of it shows in the thermometer.`,
  ideas: ['A surface\'s temperature swing falls as its heat capacity rises; the peak also arrives later, up to a quarter of a cycle.', 'The sea has a large effective heat capacity because water is dense in heat, because wind mixes the top 30–100 m and because sunlight penetrates, while land absorbs heat in a thin skin.', 'London and Moscow have the same July average but a 14 K and a 26 K yearly range.', 'The sea breeze is the day-night, and the monsoon the yearly, consequence of land warming faster than sea.', 'The Gulf Stream alone does not explain Europe\'s mild winters; stored summer heat in the Atlantic and the westerly winds matter more.'],
  pitfalls: ['"It is warmer at the coast because the sea is warm" — In summer the coast is often cooler than the interior. The sea is not warm, it is slow: it is cooler in summer and warmer in winter than the land at the same latitude.', '"Water heats slowly because it is a poor conductor" — Water conducts about 25 times better than air. It heats slowly because of its heat capacity and the depth over which the sun\'s heat is shared.', '"The Gulf Stream is the only reason Europe is mild" — The ocean\'s stored heat released to the westerlies, and the winds themselves, explain more of the difference between Atlantic and Pacific coasts.'],
  terms: [
    { term: 'Maritime climate', also: ['oceanic climate', 'marine climate'], def: 'A climate dominated by the sea: mild winters, cool summers, small yearly range, and a seasonal peak that arrives late. Western Europe, the north-west Pacific coast of America and most islands have it.' },
    { term: 'Continental climate', also: ['continentality'], def: 'A climate far from the sea: hot summers, cold winters, a large yearly range and a peak close to the solstice. Moscow, Chicago and the interior of Siberia are examples.' },
    { term: 'Annual range', also: ['yearly temperature range', 'amplitude of the seasonal cycle'], def: 'The difference between the mean temperatures of the warmest and the coolest months. It is about 14 K for London, 26 K for Moscow and under 4 K near the equator.' },
    { term: 'Sea breeze', also: ['land and sea breeze'], def: 'A daytime wind blowing from the cooler sea onto the warmer land, caused by the land\'s lower heat capacity; it reverses at night as the land cools below the sea.' },
    { term: 'Thermal lag', also: ['phase lag', 'delay of the seasonal peak'], def: 'The delay between the maximum of the sun\'s heating and the maximum of a surface\'s temperature. It grows with heat capacity towards a quarter of the cycle: a few hours for desert sand over a day, two to three months for an ocean mixed layer over a year.' }
  ],
  formulas: [
    { name: 'Swing of a surface under a sinusoidal sun', expr: 'A = F/sqrt(lam^2 + (rho*c*d*2*pi/P)^2)', tex: 'A = \\frac{F_1}{\\sqrt{\\lambda^2 + \\left(\\rho_w\\,c_w\\,d\\,\\frac{2\\pi}{P}\\right)^2}}',
      vars: { A: { name: 'amplitude of the temperature wave', q: 'dtemp', unit: 'K' }, F: { name: 'amplitude of the sun\'s heating', q: 'intensity', unit: 'W/m²', value: 250, tex: 'F_1', hint: 'About 250 W/m² for the daily cycle, about 90 W/m² for the yearly cycle in mid-latitudes.' }, lam: { name: 'heat lost per kelvin', q: 'heattransfer', unit: 'W/(m²·K)', value: 8, tex: '\\lambda' }, rho: { const: 'rhoW' }, c: { const: 'cW' }, d: { name: 'heat capacity as a depth of water', q: 'length', unit: 'm', value: 0.05, hint: '0.05 m of water-equivalent for desert sand over a day; 10 m for a calm sea; 80 m for an open-ocean mixed layer over a year.' }, P: { name: 'period', q: 'time', unit: 'h', value: 24 } },
      solveFor: 'A', note: 'A one-box energy balance, $C\\,dT/dt = F_1\\cos\\omega t - \\lambda T$, schematic. The swing from warmest to coolest is $2A$. When the heat capacity term dominates, $A \\approx F_1/(\\rho c d \\omega)$, inversely proportional to $d$.',
      stories: { A: 'The sun\'s heating swings by {F} over a period of {P}; the surface loses {lam} and stores heat like {d} of water. By how much does its temperature oscillate?' } },
    { name: 'Lag of the peak behind the sun', expr: 'phi = atan(rho*c*d*2*pi/P/lam)', tex: '\\varphi = \\arctan\\frac{2\\pi\\,\\rho_w\\,c_w\\,d}{P\\,\\lambda}',
      vars: { phi: { name: 'phase lag', q: 'angle', unit: '°', tex: '\\varphi' }, rho: { const: 'rhoW' }, c: { const: 'cW' }, d: { name: 'heat capacity as a depth of water', q: 'length', unit: 'm', value: 80 }, P: { name: 'period', q: 'time', unit: 'yr', value: 1 }, lam: { name: 'heat lost per kelvin', q: 'heattransfer', unit: 'W/(m²·K)', value: 8, tex: '\\lambda' } },
      solveFor: 'phi', note: 'The lag in time is $\\varphi/360°$ of the period. It tends to 90° (a quarter period) for a very large heat capacity and to 0 for a very small one.',
      stories: { phi: 'A surface stores heat like {d} of water and loses {lam}. By what angle does its yearly temperature peak lag behind the sun?' } },
    { name: 'Depth reached by a temperature wave', expr: 'delta = sqrt(kappa*P/pi)', tex: '\\delta = \\sqrt{\\frac{\\kappa\\,P}{\\pi}}',
      vars: { delta: { name: 'penetration depth', q: 'length', unit: 'm' }, kappa: { name: 'thermal diffusivity', unit: 'm²/s', value: 5e-7, tex: '\\kappa', hint: 'Moist soil about 5 × 10⁻⁷ m²/s; still water 1.4 × 10⁻⁷ m²/s; dry sand about 2 × 10⁻⁷.' }, P: { name: 'period', q: 'time', unit: 'day', value: 1 } },
      solveFor: 'delta', note: 'Where the wave has fallen to $1/e$ of its surface value. A year goes $\\sqrt{365}$ = 19 times deeper than a day.',
      stories: { delta: 'A temperature wave of period {P} enters soil of diffusivity {kappa}. How deep does it reach?' } }
  ],
  examples: [
    { title: 'A desert and a calm sea, over a day', q: 'The sun\'s heating swings by 250 W/m² over 24 h; the surface loses 8 W/(m²·K). Compare a desert whose heat capacity equals 0.05 m of water with a calm sea acting as 10 m of water.',
      steps: [{ text: 'Angular frequency $\\omega = 2\\pi/86400 = 7.27\\times10^{-5}$ s⁻¹. Heat capacity term for the desert:', tex: '\\rho c d\\omega = 1000\\times4186\\times0.05\\times7.27\\times10^{-5} = 15.2\\ \\mathrm{W/(m^2\\,K)}' }, { text: 'Amplitude, desert:', tex: 'A = \\frac{250}{\\sqrt{8^2 + 15.2^2}} = 14.5\\ \\mathrm{K}' }, 'For the sea, $\\rho c d \\omega$ = 3,040, so $A = 250/3040 = 0.08$ K.', 'The desert\'s day-night range is $2A$ = 29 K, the sea\'s 0.16 K. The lag of the desert\'s peak is $\\arctan(15.2/8) = 62°$, four hours after noon.'],
      a: 'Desert: 29 K from warmest to coolest, peak at about 16:00. Sea: about 0.2 K.' },
    { title: 'How deep does the winter reach?', q: 'Moist soil has a diffusivity of about $5\\times10^{-7}$ m²/s. How deep do the daily and yearly temperature waves penetrate?',
      steps: [{ text: 'Day:', tex: '\\delta = \\sqrt{5\\times10^{-7}\\times86400/\\pi} = 0.12\\ \\mathrm{m}' }, { text: 'Year:', tex: '\\delta = \\sqrt{5\\times10^{-7}\\times3.156\\times10^{7}/\\pi} = 2.2\\ \\mathrm{m}' }, 'The sea\'s mixed layer, stirred by the wind rather than by conduction, reaches 30 to 100 m in a season: heat is shared with fifteen to fifty times as much material.'],
      a: 'About 12 cm in a day and 2 m in a year, against tens of metres in the sea.' }
  ],
  quiz: [
    { q: 'Which place will have the larger difference between its January and July mean temperatures?', choices: ['Lisbon, on the Atlantic coast', 'Moscow', 'Reykjavik, on an island', 'Dublin'], a: 1, why: 'Moscow is far from the sea and has the continental range of about 26 K, against 14 K for London and 10 K or less for Lisbon, Dublin and Reykjavik.' },
    { q: 'In the summer afternoon at a coast, the wind usually blows from the sea to the land.', a: true, why: 'The land has warmed faster than the sea; the air above it rises, and the cooler air over the sea flows in to replace it (the sea breeze).' },
    { q: 'Raising a surface\'s heat capacity (a deeper layer of water) will', choices: ['raise the swing and bring the peak earlier', 'lower the swing and delay the peak', 'lower the swing and bring the peak earlier', 'leave the swing unchanged'], a: 1, why: 'In $C\\,dT/dt = F - \\lambda T$ a large $C$ responds slowly, so the wave is smaller and arrives later: the amplitude $A$ falls and the lag $\\varphi$ rises towards 90°.' },
    { q: 'By what factor does a yearly temperature wave penetrate deeper into the ground than a daily one, for the same soil?', answer: 19.1, tol: 0.05, why: 'The depth goes as $\\sqrt{P}$, and $\\sqrt{365.25}$ = 19.1.' },
    { q: 'The southern hemisphere has smaller seasonal temperature swings than the northern at the same latitudes mainly because', choices: ['the sun is weaker there', 'it has much more ocean (81 % against 61 %)', 'it is colder overall', 'it has no mountains'], a: 1, why: 'Ocean covers about four-fifths of the southern hemisphere, so the heat capacity of the surface is larger, and fewer continents exist to create extreme interiors.' }
  ],
  applications: ['Agriculture: frost dates, growing seasons and the locations of vineyards follow the maritime–continental gradient.', 'Building design: thermal mass (concrete, water tanks) evens out the daily swing as the sea evens out the year.', 'Weather forecasting: the sea breeze, land-sea contrast and the monsoon are all predicted from the surface heat capacity.', 'Climate change: coasts warm more slowly than interiors, and the land surface has warmed about 1.8 times as fast as the ocean surface.', 'Ecology: species ranges are set by winter minima, which the sea keeps higher.'],
  sources: ['Seager et al., "Is the Gulf Stream responsible for Europe\'s mild winters?", *Quarterly Journal of the Royal Meteorological Society* 128 (2002) — stored heat and winds versus ocean currents.', 'Hartmann, *Global Physical Climatology* — the energy-balance model of the seasonal cycle and its lag.', 'Met Office and Roshydromet climate normals — the monthly means quoted here, rounded.', 'IPCC, *Climate Change 2021: The Physical Science Basis*, ch. 2 — land and ocean warming rates.'],
  sim: { id: 'heat-surface-cycle', params: { cycle: 'annual', surf: 'dry', data: true } }
}
);

Hyper.add(

/* ================================================================ thermal conductivity */
{
  id: 'thermal-conductivity-of-water', parent: 'the-ocean-that-remembers-heat', title: 'Thermal conductivity', level: 2,
  short: 'Water conducts heat at 0.61 W/(m·K): 23 times better than air, the best of the ordinary liquids, ice four times better again, and still only a six-hundredth of copper. Because its heat capacity is also huge, heat crosses still water very slowly, which is why water moves heat by moving, in convection.',
  keywords: ['thermal conductivity of water', '0.6 W/mK', 'Fourier law', 'thermal diffusivity', 'effusivity', 'conduction versus convection', 'heat in a pot', 'Rayleigh number', 'why water feels cold', 'lake ice growth', 'Stefan'],
  prereq: ['specific-heat-of-water', 'physics:conduction', 'the-structure-of-liquid-water'],
  related: ['physics:convection', 'physics:heat-transfer', 'the-density-maximum', 'lakes-freeze-from-the-top', 'viscosity-of-water', 'ice-ih-and-ice-ic', 'maritime-and-continental-climates', 'water-cools-machines', 'the-body-at-37-degrees'],
  body: `
Put a hand in 50 °C water and you snatch it out within seconds. Sit in a sauna at 90 °C and you stay for ten minutes. The air is hotter yet it does not scald. The difference is not temperature but how quickly each can *deliver* heat to the skin, and that is a story of two numbers, conductivity and heat capacity.

### The number
**Thermal conductivity** $k$ is the heat per second that crosses a slab one metre thick and one square metre in area when its faces differ by one kelvin. For water at 25 °C it is **0.607 W/(m·K)**.

| Material | $k$, W/(m·K) |
|---|---|
| air | 0.026 |
| pine wood | 0.12 |
| ethanol | 0.17 |
| **liquid water** | **0.61** |
| glass | 1.0 |
| concrete | 1.7 |
| ice (0 °C) | 2.2 |
| stainless steel | 15 |
| iron | 80 |
| aluminium | 237 |
| copper | 401 |

Among ordinary liquids water is the best conductor (ethanol 0.17, acetone 0.16, hexane 0.12; only liquid metals such as mercury at 8.3 do better). It is also unusual in that it conducts *better* when warm: 0.556 at 0 °C, 0.607 at 25 °C, 0.643 at 50 °C, 0.679 at 100 °C, with a maximum of about 0.69 near 130 °C. Most liquids do the opposite. Ice conducts almost four times better than the liquid, 2.2, because its rigid lattice passes vibrations along.

Heat in a liquid moves by collisions and by vibrations passed from molecule to molecule. A liquid of weakly attached molecules does it poorly; a hydrogen-bonded network, whose molecules are connected by stiff links, does it better. But a six-hundredth of copper means that water is still an insulator by the standards of metals.

### Slow because of the heat capacity
What decides how fast a temperature change spreads is the **thermal diffusivity** $\\alpha = k/(\\rho c)$, conductivity divided by the heat a cubic metre can store. For water it is 1.4 × 10⁻⁷ m²/s: not large, because the heat capacity in the denominator is. The time to diffuse across a length $L$ is about $L^2/\\alpha$:
- 1 cm: 12 minutes; 10 cm: 19 hours; 1 m: 81 days;
- the 100 m of a lake: **2,200 years**.

Heat does not cross still water by conduction at any speed we notice. That is why a lake's bottom stays cold in summer and why a stratified hot-water tank keeps its hot water on top for days.

### So water moves heat by moving
Warm water is lighter than cold (except near 4 °C: [[the-density-maximum]]). Heat a layer from below and it overturns by **natural convection** once the Rayleigh number $Ra = g\\beta\\Delta T L^3/(\\nu\\alpha)$ passes about 1,700. For 10 cm of water that needs a temperature difference of only about 0.1 mK. In a pot heated from below, $Ra$ reaches 10⁹ and the whole body of water circulates; conduction does its work only in boundary layers a fraction of a millimetre thick at the bottom and top. Try the pot simulation, which overturns the layers by the engine's densities.

Conduction matters where there is no flow: in the ice that grows on a lake (the thickness obeys Stefan's law $h = \\sqrt{2k\\Delta T t/\\rho L}$, because the ice sheet itself is the conductor of the heat to the cold air), in snow and soil, and in the layers of tissue between a body and cold water.

### Why water feels colder than air
At contact, two bodies settle at a temperature set by their **effusivities** $e = \\sqrt{k\\rho c}$: water about 1,600, human skin about 1,200, air only 5.6, pine 400, copper 37,000 W·s^½/(m²·K). Skin at 33 °C touching water at 50 °C takes (1,600·50 + 1,200·33)/2,800 = 43 °C and burns; skin touching 90 °C air takes 33.2 °C. The same logic is why a metal rail at 5 °C feels colder than a wooden one, and why the same temperature of water and air feel so different.

> [!key] Water conducts heat better than any common liquid and still slowly, since its huge heat capacity soaks up the heat it receives; it crosses 10 cm in a day. Real water therefore moves heat by flowing, and meets the skin with an effusivity three hundred times air's.`,
  ideas: ['Water\'s conductivity, 0.61 W/(m·K), is 23 times air\'s, the highest of ordinary liquids, four times lower than ice and about 650 times lower than copper.', 'Unlike most liquids it conducts better when warm (0.556 at 0 °C, 0.679 at 100 °C).', 'Diffusivity $k/\\rho c$ is small (1.4 × 10⁻⁷ m²/s), so heat needs 19 hours to cross 10 cm of still water and thousands of years to cross a lake.', 'Convection, driven by the density difference of warm and cold water, is the real carrier; a layer overturns at a temperature difference of microkelvins.', 'Contact temperature depends on the effusivity $\\sqrt{k\\rho c}$: this is why water scalds and air of the same temperature does not.'],
  pitfalls: ['"Water heats up slowly because it conducts heat badly" — Water conducts well for a liquid; its slow warming comes from its heat capacity. Conduction alone makes the top of a still pot wait a day, convection mixes it in minutes.', '"Heat in a pot of water spreads by conduction" — Almost all of it is carried by convection currents; conduction acts only in thin films at the walls.', '"A good conductor feels hotter" — At body temperature a good conductor feels cold, because it carries heat away from the skin quickly; a poor one feels warm. What matters at contact is the effusivity, not the conductivity alone.'],
  terms: [
    { term: 'Thermal conductivity', also: ['k', 'heat conductivity', 'λ'], def: 'The property that sets the heat flow through a material for a given temperature difference: $q = -k\\,dT/dx$ in W/(m·K). For water 0.607 at 25 °C, for air 0.026, for ice 2.2, for copper 401.' },
    { term: 'Fourier\'s law', also: ['law of heat conduction'], def: 'The statement that the heat flow per unit area is proportional to the temperature gradient and directed down it, $q = -k\\,dT/dx$. For a slab it gives a rate $Q = kA\\,\\Delta T/L$.' },
    { term: 'Thermal diffusivity', also: ['heat diffusivity', 'α'], def: 'The conductivity divided by the volumetric heat capacity, $\\alpha = k/(\\rho c)$, in m²/s: how fast a temperature disturbance spreads. A disturbance crosses a length $L$ in about $L^2/\\alpha$; for water α = 1.4 × 10⁻⁷ m²/s, for moist soil about 5 × 10⁻⁷.' },
    { term: 'Thermal effusivity', also: ['heat penetration coefficient', 'contact coefficient'], def: 'The quantity $e = \\sqrt{k\\rho c}$, in W·s^½/(m²·K), that decides the temperature two bodies reach when they touch: the contact temperature is the average of the two temperatures weighted by their effusivities.' },
    { term: 'Natural convection', also: ['free convection', 'thermal convection'], def: 'The flow set up in a fluid by differences of density from differences of temperature: warm fluid rises and cool fluid sinks. It carries heat far faster than conduction in a liquid or a gas.' },
    { term: 'Rayleigh number', also: ['Ra'], def: 'The dimensionless number $Ra = g\\beta\\Delta T L^3/(\\nu\\alpha)$ comparing the buoyancy that drives convection with the viscosity and diffusion that resist it. A layer heated from below starts to overturn when Ra exceeds about 1,700.' }
  ],
  formulas: [
    { name: 'Heat through a slab (Fourier)', expr: 'Q = k*A*dT/L', tex: 'Q = \\frac{k\\,A\\,\\Delta T}{L}',
      vars: { Q: { name: 'heat flow', q: 'power', unit: 'W' }, k: { name: 'thermal conductivity', q: 'thermcond', unit: 'W/(m·K)', value: 0.607 }, A: { name: 'area', q: 'area', unit: 'm²', value: 1 }, dT: { name: 'temperature difference across the slab', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T' }, L: { name: 'thickness', q: 'length', unit: 'cm', value: 1 } },
      solveFor: 'Q', note: 'Steady conduction only, with no flow. For a window pane of glass 4 mm thick (k = 1.0) and 20 K the same formula gives 5 kW per square metre, why a single pane is a poor wall.',
      stories: { Q: 'A layer of still water {L} thick has a temperature difference of {dT} across it. How much heat crosses {A} per second?' } },
    { name: 'Time for heat to diffuse across a layer', expr: 't = rho*c*L^2/k', tex: 't \\approx \\frac{\\rho_w\\,c_w\\,L^2}{k}',
      vars: { t: { name: 'time', q: 'time', unit: 'h' }, rho: { const: 'rhoW' }, c: { const: 'cW' }, L: { name: 'distance', q: 'length', unit: 'cm', value: 10 }, k: { name: 'thermal conductivity', q: 'thermcond', unit: 'W/(m·K)', value: 0.607 } },
      solveFor: 't', note: 'An order of magnitude, $L^2/\\alpha$: the temperature step at one side has reached about half-way after a time of this size. Valid for still water.',
      stories: { t: 'Heat spreads by conduction alone through {L} of still water. About how long does it take to cross?' } },
    { name: 'Contact temperature of two bodies', expr: 'Tc = (e1*T1 + e2*T2)/(e1 + e2)', tex: 'T_c = \\frac{e_1 T_1 + e_2 T_2}{e_1 + e_2}',
      vars: { Tc: { name: 'contact temperature', q: 'temperature', unit: '°C', tex: 'T_c' }, e1: { name: 'effusivity of the first body (water 1,600)', unit: 'W·s^0.5/(m²·K)', value: 1600, tex: 'e_1' }, T1: { name: 'temperature of the first body', q: 'temperature', unit: '°C', value: 50, tex: 'T_1' }, e2: { name: 'effusivity of the second body (skin 1,200)', unit: 'W·s^0.5/(m²·K)', value: 1200, tex: 'e_2' }, T2: { name: 'temperature of the second body', q: 'temperature', unit: '°C', value: 33, tex: 'T_2' } },
      solveFor: 'Tc', note: 'Two semi-infinite bodies suddenly put in contact. Real skin has a thin outer layer and blood flow, so the true contact temperature is a little different, but the ranking is right.',
      stories: { Tc: 'A hand at {T2} touches a body at {T1}. The effusivities are {e2} and {e1}. What temperature does the skin\'s surface reach?' } },
    { name: 'Growth of lake ice (Stefan)', expr: 'h = sqrt(2*k*dT*t/(rho*Lf))', tex: 'h = \\sqrt{\\frac{2\\,k\\,\\Delta T\\,t}{\\rho\\,L_f}}',
      vars: { h: { name: 'ice thickness', q: 'length', unit: 'cm' }, k: { name: 'conductivity of ice', q: 'thermcond', unit: 'W/(m·K)', value: 2.2 }, dT: { name: 'freezing point minus surface temperature', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T' }, t: { name: 'time', q: 'time', unit: 'day', value: 10 }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho' }, Lf: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55, tex: 'L_f' } },
      solveFor: 'h', note: 'An upper bound: it ignores snow cover (which insulates) and the heat from the water below. Ice growth slows as the square root of time since the sheet itself must conduct the latent heat to the surface.',
      stories: { h: 'The surface of a lake is held {dT} below freezing for {t}. How thick does the ice grow?' } }
  ],
  examples: [
    { title: 'Sauna and bath', q: 'Skin at 33 °C (effusivity about 1,200) touches (a) water at 50 °C (effusivity 1,600) and (b) air at 90 °C (effusivity 5.6). What contact temperature does the skin\'s surface reach?',
      steps: [{ text: '(a) Water:', tex: 'T_c = \\frac{1600\\times50 + 1200\\times33}{1600+1200} = 43\\ ^\\circ\\mathrm{C}' }, { text: '(b) Air:', tex: 'T_c = \\frac{5.6\\times90 + 1200\\times33}{1200+5.6} = 33.2\\ ^\\circ\\mathrm{C}' }, 'The effusivity of the skin is 200 times air\'s, so the skin forces its own temperature on the air. Against the water the two are about equal, so the surface rises most of the way to the water\'s temperature.'],
      a: '43 °C in the water (painful within a minute or so); 33.2 °C in the sauna air, almost no change.' },
    { title: 'A deep lake', q: 'How long would the summer\'s warmth take to reach the bottom of a 100 m lake by conduction alone, if the diffusivity of water is $1.4\\times10^{-7}$ m²/s?',
      steps: [{ text: 'Time $\\approx L^2/\\alpha$:', tex: 't = \\frac{(100\\ \\mathrm{m})^2}{1.4\\times10^{-7}\\ \\mathrm{m^2/s}} = 7\\times10^{10}\\ \\mathrm{s}' }, 'Dividing by $3.16\\times10^{7}$ s per year gives 2,200 years.'],
      a: 'About 2,200 years: the heat reaches the depths by mixing and currents or not at all.' }
  ],
  quiz: [
    { q: 'Water conducts heat better than air by a factor of about', choices: ['2', '23', '230', '2,300'], a: 1, why: '0.607 / 0.026 = 23. Per unit volume it also stores about 3,500 times more heat, which together makes it far more effective at removing heat from a hand.' },
    { q: 'Like most liquids, water conducts heat less well as it warms.', a: false, why: 'Water\'s conductivity rises with temperature, from 0.556 W/(m·K) at 0 °C to 0.679 at 100 °C, which is unusual among liquids.' },
    { q: 'How long does heat take to cross 10 cm of still water by conduction?', choices: ['a few seconds', 'a few minutes', 'about 19 hours', 'about 2 years'], a: 2, why: '$L^2/\\alpha = 0.01/1.4\\times10^{-7} = 7\\times10^4$ s = 19 h.' },
    { q: 'Lake ice grows by the Stefan formula. After 4 days with the surface 8 K below freezing, about how thick is the ice, in metres? (k = 2.2 W/(m·K), ρ = 917 kg/m³, latent heat 333.55 kJ/kg)', answer: 0.199, unit: 'm', tol: 0.04, why: '$h = \\sqrt{2\\times2.2\\times8\\times345{,}600/(917\\times333{,}550)} = \\sqrt{0.0398} = 0.20$ m.' },
    { q: 'You tolerate air at 90 °C in a sauna but not water at 90 °C because', choices: ['air is much drier', 'water has a far larger effusivity and delivers heat to the skin much faster', 'water conducts heat to your core', 'the sauna air is not really at 90 °C'], a: 1, why: 'Effusivity is $\\sqrt{k\\rho c}$: about 1,600 for water against 5.6 for air. The contact temperature is a weighted average, so air barely heats the skin while water almost reaches its own temperature.' }
  ],
  applications: ['Cooking and heating: the circulation in a pot or a hot-water tank is convection; thin pans conduct heat into the water, and the lid stops evaporation.', 'Insulation: still air (0.026) in foam, wool, down and double glazing; water conducts 23 times faster, which is why a wet sweater is cold.', 'Diving and cold water: the body loses heat to water about 25 times faster than to air at the same temperature, so wetsuits trap a layer of water or gas.', 'Lake and sea ice: growth follows the square root of time and slows under snow.', 'Stratified hot-water tanks and chilled-water storage depend on slow conduction to keep hot over cold.'],
  sources: ['Ramires, Nieto de Castro et al., "Standard reference data for the thermal conductivity of water", *Journal of Physical and Chemical Reference Data* 24 (1995) — the values against temperature, with the maximum near 130 °C.', 'CRC *Handbook of Chemistry and Physics* — thermal conductivities of liquids, solids and gases.', 'Incropera, DeWitt et al., *Fundamentals of Heat and Mass Transfer* — Fourier\'s law, diffusivity, the Rayleigh number and contact temperature.', 'Petrenko and Whitworth, *Physics of Ice*, ch. 4 — the thermal properties of ice.'],
  sim: 'heat-conduction-pot'
},

/* ================================================================ evaporative cooling */
{
  id: 'evaporative-cooling', parent: 'the-ocean-that-remembers-heat', title: 'Evaporative cooling', level: 2,
  short: 'Each kilogram of sweat that evaporates takes 2.4 MJ from the body, which is how a person sheds a kilowatt on a hot day. What limits it is the air\'s humidity, summed up by the wet-bulb temperature: where it reaches 35 °C, skin can no longer shed heat, and in practice trouble starts a few degrees sooner.',
  keywords: ['evaporative cooling', 'sweat', 'wet-bulb temperature', '35 C wet bulb', 'swamp cooler', 'panting', 'latent heat of vaporisation', 'psychrometer', 'heat stress', 'wet skin in wind'],
  prereq: ['latent-heat-of-vaporisation', 'vapour-pressure-and-evaporation', 'humidity-and-dew-point'],
  related: ['the-body-at-37-degrees', 'hurricanes-and-latent-heat', 'water-cools-machines', 'physics:latent-heat', 'medicine:thermoregulation', 'biology:thermoregulation-animals', 'aerodynamics:humidity-air'],
  body: `
Climb out of a swimming pool on a breezy day and you shiver, even in warm air. The film of water on your skin is leaving, and each molecule that goes takes more than its share of heat.

### Why evaporation cools
The molecules of a liquid have a spread of energies. Those that escape are the fastest and best aimed, so the liquid left behind has a lower average energy: it is cooler, unless something supplies the heat. The amount is the **latent heat of vaporisation**, 2,442 kJ/kg at 25 °C and 2,416 at skin temperature, higher than any common liquid (ethanol 841, acetone 518; see [[latent-heat-of-vaporisation]]). Evaporating a single gram removes the heat that would cool 580 g of water by a kelvin.

### What a body can do with it
A resting person makes 80 to 100 W of heat, a brisk walker 250 W, a hard worker or runner 600 to 1,000 W. In air cooler than the skin some of it leaves by radiation and convection; in air at or above skin temperature, or at high effort, only sweat can carry it. A litre of sweat evaporated removes 2.4 MJ, which is **670 W for an hour**. A person can sweat 1 to 2 litres an hour for a while, up to 3 in the very fit and acclimatised. Sweat that drips off without evaporating cools nothing.

### The wet bulb
How much water the air can take is limited by its humidity ([[humidity-and-dew-point]]). The **wet-bulb temperature** is what a thermometer wrapped in wet cloth settles at when air blows over it: evaporation cools it until the heat arriving from the air equals the heat leaving as vapour. In dry air it sits far below the air temperature; in saturated air it equals it.

| Air temperature | Relative humidity | Wet-bulb | Dew point |
|---|---|---|---|
| 25 °C | 50 % | 18.0 °C | 13.9 °C |
| 30 °C | 50 % | 22.3 °C | 18.4 °C |
| 40 °C | 15 % | 20.8 °C | 8.5 °C |
| 40 °C | 50 % | 30.9 °C | 27.6 °C |
| 35 °C | 75 % | 31.1 °C | 29.9 °C |
| 40 °C | 75 % | 35.8 °C | 34.7 °C |
| 45 °C | 50 % | 35.2 °C | 32.1 °C |

(Stull's 2011 formula at one atmosphere.) The wet bulb is the *lowest temperature that evaporation alone can reach*, so it also fixes the coldest a swamp cooler can deliver. It differs from the dew point: the dew point asks how far air must be cooled for dew to form, the wet bulb how far it can be cooled by evaporating water into it.

### The limit
Skin is at about 35 °C. If the air's wet-bulb temperature reaches that, the skin cannot lose heat by evaporation at all, and the body\u2019s own 80 W or more has nowhere to go. Sherwood and Huber (2010) argued that a wet-bulb temperature of 35 °C sustained for some hours is the limit of survival even for a healthy person at rest in the shade with unlimited water. Laboratory work with young, healthy volunteers (Vecellio and colleagues, 2022) found the core beginning to climb at wet-bulb temperatures of about 30 to 31 °C in warm humid conditions, so the true limit is lower, and lower again for the old or ill. Brief readings approaching or touching 35 °C have been recorded at a few places on the Persian Gulf and in South Asia (Raymond, Matthews and Horton, 2020), and models expect more as the world warms. Try it in the simulation: the red region of "sweat cannot keep up" starts well to the left of the 35 °C contour once the body is working.

### Everyday and animal uses
A **swamp (evaporative) cooler** blows air through a wet pad and works in a desert (40 °C at 15 % has a wet bulb of only 21 °C) but not in a rain forest. A porous clay pot, or a wet cloth round a bottle, keeps water cool. Dogs have sweat glands mainly on their pads and cool by panting, evaporating water from the tongue and airways. Elephants spray themselves and birds flutter their throats. Wind speeds the removal of the saturated air next to wet skin, which is why wet skin in a breeze feels so cold. Rubbing alcohol feels colder than water at first because it evaporates faster, but gram for gram it removes only a third as much heat.

> [!key] Evaporating a kilogram of water removes 2.4 MJ, so sweat can carry a kilowatt away from the body, but only into air that can still take up the vapour. The wet-bulb temperature measures how much of that is left, and when it approaches the temperature of the skin, the cooling stops.`,
  ideas: ['Evaporation cools because the fastest molecules leave; water\'s latent heat (2.4 MJ/kg) is the highest of common liquids, so a litre of sweat carries off 670 W for an hour.', 'The wet-bulb temperature is the lowest temperature evaporation alone can reach; it depends on both temperature and humidity.', 'When the wet-bulb temperature equals skin temperature (35 °C) sweating cannot cool, and lab studies find stress beginning at about 30–31 °C wet-bulb.', 'Dry heat is bearable and humid heat is not: 40 °C at 15 % humidity is a 21 °C wet-bulb, 40 °C at 75 % is 36 °C.', 'Swamp coolers, panting and wet cloth all rely on the same latent heat.'],
  pitfalls: ['"Sweat cools you by being wet" — It cools only when it *evaporates*. In saturated air, or when it drips off, it carries away almost nothing.', '"The dew point is the same as the wet-bulb temperature" — The dew point is the temperature at which air becomes saturated on cooling; the wet bulb is the temperature reached by evaporating water into it. The wet bulb always lies between the dew point and the air temperature.', '"A fan always cools you" — It cools when the air is cooler than the skin or dry enough for sweat to evaporate; in air hotter than the skin it adds heat by convection.'],
  terms: [
    { term: 'Evaporative cooling', also: ['cooling by evaporation', 'latent-heat cooling'], def: 'The cooling of a surface or a liquid as molecules leave it as vapour and carry the latent heat away. For water 2.4 MJ per kilogram evaporated.' },
    { term: 'Wet-bulb temperature', also: ['T_w', 'psychrometric wet bulb'], def: 'The temperature a thermometer covered with a wet cloth reaches in a stream of air: evaporation cooling balances the heat from the air. It is between the dew point and the air temperature, and equal to both in saturated air.' },
    { term: 'Dry-bulb temperature', also: ['air temperature'], def: 'The ordinary temperature of the air, read by a thermometer in the shade and not wetted.' },
    { term: 'Psychrometer', also: ['wet-and-dry-bulb hygrometer', 'sling psychrometer'], def: 'An instrument of two thermometers, one dry and one wet, that gives the humidity from their difference. The larger the difference, the drier the air.' },
    { term: 'Sweat rate', also: ['rate of sweating'], def: 'The mass of sweat the skin produces per hour, from about 0.1 L/h at rest to 1–2 L/h in hard work in the heat. Each litre that evaporates removes 2.4 MJ, 670 W for an hour.' }
  ],
  formulas: [
    { name: 'Sweat that must evaporate', expr: 'ms = P/Lv', tex: '\\dot m_s = \\frac{P}{L_v}',
      vars: { ms: { name: 'mass of sweat evaporated per hour', q: 'massflow', unit: 'kg/h', tex: '\\dot m_s' }, P: { name: 'heat to remove', q: 'power', unit: 'W', value: 600 }, Lv: { name: 'latent heat of vaporisation at the skin', q: 'latent', unit: 'MJ/kg', value: 2.42, tex: 'L_v' } },
      solveFor: 'ms', note: 'About a litre per kilogram of sweat (1 kg of water is 1 L). It assumes all of the sweat evaporates; dripping sweat counts for nothing.',
      stories: { ms: 'A runner must lose {P} by evaporation, at {Lv}. How much sweat must evaporate each hour?', P: 'Evaporating {ms} of sweat at {Lv}. How much heat does that remove?' } },
    { name: 'Most the skin can evaporate (Lewis relation)', expr: 'E = 0.0165*hc*A*(psk - pa)', tex: 'E_{\\max} = 16.5\\,h_c\\,A\\,(p_{sk} - p_a)',
      vars: { E: { name: 'maximum evaporative heat loss', q: 'power', unit: 'W', tex: 'E_{\\max}' }, hc: { name: 'convective heat transfer coefficient', q: 'heattransfer', unit: 'W/(m²·K)', value: 8, tex: 'h_c', hint: 'About 3 in still air, 8 in a 1 m/s breeze, 15 in a 4 m/s wind.' }, A: { name: 'wet skin area', q: 'area', unit: 'm²', value: 1.8 }, psk: { name: 'vapour pressure at the skin (saturated)', q: 'pressure', unit: 'kPa', value: 5.63, tex: 'p_{sk}', hint: 'The saturation vapour pressure of water at 35 °C.' }, pa: { name: 'vapour pressure in the air', q: 'pressure', unit: 'kPa', value: 3, tex: 'p_a', hint: 'Relative humidity times the saturation pressure at the air temperature.' } },
      solveFor: 'E', note: 'The Lewis relation between convection and evaporation, 16.5 K/kPa. The constant 0.0165 in the expression is that figure converted to pascals. An average adult; skin fully wet.',
      stories: { E: 'A person with {A} of wet skin stands in air of heat-transfer coefficient {hc}; the skin vapour pressure is {psk} and the air\'s {pa}. How much heat can evaporation remove at most?' } },
    { name: 'Swamp cooler', expr: 'Tout = T - eff*(T - Tw)', tex: 'T_{\\text{out}} = T - \\varepsilon\\,(T - T_w)',
      vars: { Tout: { name: 'temperature of the delivered air', q: 'temperature', unit: '°C', tex: 'T_{\\text{out}}' }, T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 40 }, eff: { name: 'effectiveness of the pad', q: 'ratio', unit: '%', value: 80, tex: '\\varepsilon' }, Tw: { name: 'wet-bulb temperature', q: 'temperature', unit: '°C', value: 20.8, tex: 'T_w' } },
      solveFor: 'Tout', note: 'Cannot go below the wet-bulb temperature. Effectiveness 70–90 % is typical for good pads; the supplied air is also humidified.',
      stories: { Tout: 'A swamp cooler of effectiveness {eff} takes air at {T} with a wet-bulb temperature of {Tw}. What temperature does it deliver?' } },
    { name: 'Cooling of the water that stays behind', expr: 'dT = f*Lv/(c*(1 - f))', tex: '\\Delta T = \\frac{f\\,L_v}{c_w\\,(1 - f)}',
      vars: { dT: { name: 'cooling of the remaining water', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, f: { name: 'fraction evaporated', q: 'ratio', unit: '%', value: 1, min: 0, max: 20 }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'MJ/kg', value: 2.44, tex: 'L_v' }, c: { const: 'cW' } },
      solveFor: 'dT', note: 'No heat is supplied from outside: the evaporated fraction takes its latent heat from the rest. Evaporating 1 % cools the rest by almost 6 K.',
      stories: { dT: 'In an insulated cup, {f} of the water evaporates, taking its heat from the rest. By how much does the remainder cool?' } }
  ],
  examples: [
    { title: 'A cyclist\'s sweat', q: 'A cyclist makes 600 W of heat above what the air carries away. How much sweat must evaporate per hour at 35 °C, and is that within what the body can do?',
      steps: [{ text: 'Latent heat at the skin is 2.42 MJ/kg:', tex: '\\dot m = \\frac{600}{2.42\\times10^{6}} = 2.48\\times10^{-4}\\ \\mathrm{kg/s}' }, 'In an hour that is $2.48\\times10^{-4}\\times3600 = 0.89$ kg, about 0.9 litres.', 'This is inside the 1–2 L/h that a fit person can produce, so the heat can be dissipated if the air allows the sweat to evaporate; in humid air, much of it drips.'],
      a: 'About 0.9 litres of evaporated sweat per hour.' },
    { title: 'Desert and jungle', q: 'A swamp cooler of 80 % effectiveness is used in two places, both at 40 °C: a desert with 15 % humidity (wet-bulb 20.8 °C) and a coast with 75 % (wet-bulb 35.8 °C). What air temperature does it deliver in each?',
      steps: [{ text: 'Desert:', tex: 'T_{\\text{out}} = 40 - 0.8\\,(40 - 20.8) = 24.6\\ ^\\circ\\mathrm{C}' }, { text: 'Humid coast:', tex: 'T_{\\text{out}} = 40 - 0.8\\,(40 - 35.8) = 36.6\\ ^\\circ\\mathrm{C}' }, 'In the desert the cooler drops the air by 15 K; at the humid coast, by 3 K, and the air it delivers is almost saturated.'],
      a: '24.6 °C in the desert, 36.6 °C at the humid coast: nearly useless there.' }
  ],
  quiz: [
    { q: 'Which is harder for a resting person to bear?', choices: ['40 °C, 15 % humidity', '35 °C, 75 % humidity', 'both the same', 'neither: both are below 41 °C'], a: 1, why: 'The wet-bulb temperatures are 20.8 °C and 31.1 °C. At the second, sweat can hardly evaporate; the first is hot but the body can still cool by a large margin.' },
    { q: 'In air saturated with water vapour at skin temperature, sweating can still cool the body.', a: false, why: 'Without a vapour-pressure difference between skin and air there is no net evaporation. Sweat still pours out, drips and cools nothing.' },
    { q: 'How much sweat must evaporate per hour to remove 800 W at a latent heat of 2.42 MJ/kg? (kg/h)', answer: 1.19, tol: 0.03, why: '$800/2.42\\times10^{6} = 3.31\\times10^{-4}$ kg/s = 1.19 kg/h.' },
    { q: 'A wet cloth round a bottle in a dry wind cools it toward the', choices: ['dew-point temperature', 'wet-bulb temperature', 'freezing point', 'skin temperature'], a: 1, why: 'The cloth behaves as the wet bulb of a psychrometer: it cools until evaporation removes heat as fast as the air supplies it.' },
    { q: 'Why does a dog pant instead of sweating?', choices: ['to breathe more oxygen', 'it has few sweat glands over its skin, and panting evaporates water from the tongue and airways, moving air over them', 'its blood is too thick', 'to lose salt'], a: 1, why: 'A dog\'s fur makes skin evaporation useless, so it evaporates from the wet surfaces of mouth and airways, helped by the rapid breathing.' }
  ],
  applications: ['Swamp coolers and cooling towers: air is cooled by passing over water, or water by passing through air.', 'Heat-stress standards for workers and athletes, which use wet-bulb temperature (as in the WBGT index) rather than air temperature.', 'Clay pots, desert water bags and wet towels as cheap cooling.', 'Climate impact assessment: how often the wet-bulb temperature will reach the limits of human tolerance in the Gulf, South Asia and the humid tropics.', 'Animal physiology: panting, wallowing and gular fluttering.'],
  history: 'The psychrometer was devised in the early nineteenth century, and the cooling of a wet thermometer was explained as evaporation by John Leslie and later by August (1825). William Cullen made ice by evaporating ether at Glasgow in 1755, one of the first demonstrations of mechanical refrigeration.',
  sources: ['Sherwood and Huber, "An adaptability limit to climate change due to heat stress", *Proceedings of the National Academy of Sciences* 107 (2010) — the 35 °C wet-bulb limit.', 'Vecellio et al., "Evaluating the 35 °C wet-bulb temperature adaptability threshold for young, healthy subjects (PSU HEAT Project)", *Journal of Applied Physiology* 132 (2022).', 'Raymond, Matthews and Horton, "The emergence of heat and humidity too severe for human tolerance", *Science Advances* 6 (2020).', 'Stull, "Wet-bulb temperature from relative humidity and air temperature", *Journal of Applied Meteorology and Climatology* 50 (2011) — the formula behind the table.'],
  sim: 'heat-wet-bulb'
},

/* ================================================================ hurricanes and latent heat */
{
  id: 'hurricanes-and-latent-heat', parent: 'the-ocean-that-remembers-heat', title: 'Hurricanes and latent heat', level: 2,
  short: 'A mature hurricane releases about 6 × 10¹⁴ W of heat as vapour condenses into rain: some two hundred times the world\'s electric power. Its fuel is the latent heat that warm sea, at least 26.5 °C, puts into the air; a small part of the release becomes wind.',
  keywords: ['hurricane', 'tropical cyclone', 'typhoon', 'latent heat release', 'eye wall', '26.5 C threshold', 'CAPE', 'moist adiabat', 'sea surface temperature', 'heat engine', 'rapid intensification'],
  prereq: ['latent-heat-of-vaporisation', 'oceans-as-a-heat-reservoir', 'humidity-and-dew-point'],
  related: ['the-water-cycle', 'clouds-rain-and-snow', 'ocean-currents', 'vapour-pressure-and-evaporation', 'water-vapour-greenhouse', 'evaporative-cooling', 'physics:latent-heat', 'aerodynamics:humidity-air'],
  body: `
A hurricane is a heat engine the size of a country, and its fuel is the vapour of the sea. Its power is easiest to read from the rain.

### The ledger
NOAA's hurricane research division puts the average rainfall inside a circle of radius 665 km around a mature storm at about 1.5 cm per day. That is $0.015\\ \\mathrm{m}\\times\\pi(665\\ \\mathrm{km})^2$ = 2.1 × 10¹⁰ m³, **21 cubic kilometres of water per day**, a hundred times the flow of the Rhine. Every kilogram that condenses gives up its latent heat, about 2.5 MJ ([[latent-heat-of-vaporisation]]):

$$E = 2.1\\times10^{13}\\ \\mathrm{kg}\\times2.5\\times10^{6}\\ \\mathrm{J/kg}\\approx 5\\times10^{19}\\ \\mathrm{J\\ per\\ day}\\ \\approx 6\\times10^{14}\\ \\mathrm{W}.$$

That is of the order of 200 times the world's electrical generating capacity. Only a sliver ends as wind: NOAA gives the kinetic energy generated as 1.5 × 10¹² W, about 1/400 of the heat, still half the world's electric power. The storm is a heat engine of low efficiency, whose output is a great deal of wind because its input is so large.

### How the engine runs
1. **Fuel.** Over a sea at 27 °C or more, strong wind evaporates water quickly; the heat taken from the sea goes into the air as latent heat in the vapour (see [[vapour-pressure-and-evaporation]]).
2. **Lift.** Air spirals inward along the surface, picking up vapour, and rises in towering clouds at the **eyewall**. Rising air expands and cools by 9.8 K/km until the vapour condenses at the cloud base; after that it cools more slowly, 4 to 6 K/km, because the condensing vapour gives back its latent heat (the **moist adiabat**).
3. **Buoyancy.** The parcel stays warmer than the surroundings, so it keeps rising, to 12 to 16 km. Condensing 20 g of vapour from each kilogram of air releases about 49 kJ, which if kept entirely by the air would warm it by 49 K. The energy available to lift it is the **CAPE**: 1,500 to 2,500 J/kg over a warm tropical sea, corresponding to an ideal updraft $\\sqrt{2\\,\\mathrm{CAPE}}$ of 55 to 70 m/s; real updrafts reach about a tenth of that because of mixing and the weight of the water.
4. **Feedback.** The warm column lowers the surface pressure, the winds increase, the evaporation increases, and so on: the wind-induced surface heat exchange feedback of Kerry Emanuel (1986). Air leaves at the top at −60 to −70 °C and radiates its heat to space. The temperature difference between the warm sea (300 K) and the cold top (about 200 K) allows at best an efficiency of $1 - 200/300$, one third.
5. **The eye.** In the centre a column of air sinks, warming as it falls, and clears the sky, with the strongest winds in the wall around it.

### Why 26.5 °C
Palmén (1948) noted that tropical cyclones form only over seas warmer than about 26 to 27 °C. In the parcel simulation the reason is visible: at 22 °C the parcel never becomes lighter than its surroundings, at 24 °C it barely does (a CAPE of a few hundred J/kg), at 26.5 °C it has about 1,700 J/kg and at 28 °C about 3,200. The warm layer must also be deep (some 50 m): a storm churns the sea, so a thin warm skin is soon replaced by cold water from below. Other ingredients are a distance of at least 5° from the equator (so the Coriolis force can spin it), little change of wind with height, a moist middle atmosphere and a starting disturbance. A hurricane that reaches land or cold water is cut off from its fuel and decays within days.

### Warmer seas
Warmer water raises the energy ceiling for storms and warm air holds about 6 % more vapour per kelvin at tropical temperatures (the Clausius–Clapeyron slope), so the rain becomes heavier. The IPCC's sixth assessment concludes that the proportion of the most intense storms and their rainfall are likely to increase in a warmer world, with low confidence in any change in the total number.

> [!key] A hurricane runs on latent heat: vapour taken from a sea warmer than 26.5 °C condenses in the eyewall and heats the air, which rises and draws in more. The heat released is some 200 times the world's electricity, and only about a four-hundredth of it becomes wind.`,
  ideas: ['A mature hurricane condenses about 21 km³ of water a day, releasing about 5 × 10¹⁹ J per day (6 × 10¹⁴ W), around two hundred times the world\'s electric power.', 'Only about 1/400 of that becomes the kinetic energy of the wind: the cycle is a heat engine with a Carnot limit of about one third.', 'The storm\'s fuel is the latent heat that evaporation from a warm sea (≥ 26.5 °C, over a warm layer some 50 m deep) puts into the air; cut it off, over land or cold water, and the storm dies.', 'Rising air cools at 9.8 K/km until it condenses and then at about half that rate; the difference from the environment is the CAPE.', 'A warmer atmosphere holds about 6 % more vapour per kelvin, so heavier rain, and a higher ceiling for the strongest storms.'],
  pitfalls: ['"A hurricane draws its energy from the heat of the sea water" — The sea is cooled by only a little: the energy is the *latent* heat of the vapour carried into the air; the sea\'s warmth matters because warm water evaporates far faster.', '"The wind is the biggest part of a hurricane\'s energy" — The heat released by condensation is hundreds of times larger than the kinetic energy of the wind; the wind is the small, destructive, residue.', '"Hurricanes need any warm ocean" — They need warm water at least 26.5 °C and some 50 m deep, an unstable atmosphere, small wind shear and an initial spin, so they do not form near the equator or in the South Atlantic as a rule.'],
  terms: [
    { term: 'Tropical cyclone', also: ['hurricane', 'typhoon', 'cyclone'], def: 'A rotating storm with a warm core that forms over tropical seas and is powered by the latent heat of condensation. It is called a hurricane in the Atlantic and north-east Pacific, a typhoon in the north-west Pacific and a cyclone in the Indian Ocean and South Pacific.' },
    { term: 'Eye and eyewall', also: ['eye wall', 'eyewall'], def: 'The eye is the calm, nearly cloud-free centre of a mature tropical cyclone, a few tens of kilometres across, where air sinks. The eyewall is the ring of towering clouds around it, where air rises most strongly, rain is heaviest and the winds strongest.' },
    { term: 'Moist adiabat', also: ['pseudoadiabat', 'saturated adiabatic lapse rate'], def: 'The curve of temperature against height followed by a saturated parcel of air that rises without exchanging heat with its surroundings. It cools at 4–6 K/km in the tropics, against 9.8 K/km for dry air, because condensation releases latent heat.' },
    { term: 'CAPE', also: ['convective available potential energy'], def: 'The energy per kilogram, in J/kg, that a parcel of air gains by rising from the surface while it is warmer than the surrounding air: the area between its temperature curve and the environment\'s. The ideal updraft speed is $\\sqrt{2\\,\\mathrm{CAPE}}$.' },
    { term: 'Wind-induced surface heat exchange (WISHE)', also: ['WISHE', 'air–sea interaction instability'], def: 'The feedback in which a stronger wind evaporates more water from the sea, giving the storm more latent heat, which strengthens the wind further. Proposed by Emanuel in 1986.' }
  ],
  formulas: [
    { name: 'Power from the rain', expr: 'P = h*A*rho*Lv/t', tex: 'P = \\frac{h\\,A\\,\\rho_w\\,L_v}{t}',
      vars: { P: { name: 'latent-heat power', q: 'power', unit: 'W' }, h: { name: 'rainfall in the time t', q: 'length', unit: 'cm', value: 1.5 }, A: { name: 'area of the rain', q: 'area', unit: 'km²', value: 1.39e6, hint: 'A circle of 665 km radius.' }, rho: { const: 'rhoW' }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'MJ/kg', value: 2.45, tex: 'L_v' }, t: { name: 'time', q: 'time', unit: 'day', value: 1 } },
      solveFor: 'P', note: 'Every kilogram of rain was once vapour: its condensation released its latent heat in the air above. Gives 6 × 10¹⁴ W for 1.5 cm a day over a radius of 665 km.',
      stories: { P: 'A storm drops {h} of rain over {A} in {t}. At {Lv}, what power does the condensation release?' } },
    { name: 'Warming of the air by condensation', expr: 'dT = Lv*dq/cp', tex: '\\Delta T = \\frac{L_v\\,\\Delta q}{c_p}',
      vars: { dT: { name: 'temperature rise if all the heat stays in the air', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'MJ/kg', value: 2.45, tex: 'L_v' }, dq: { name: 'water condensed per kilogram of air', q: 'ratio', unit: '‰', value: 10, tex: '\\Delta q', hint: 'A tropical updraft condenses 10–25 g/kg.' }, cp: { name: 'specific heat of air', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' } },
      solveFor: 'dT', note: 'An upper bound (the air also expands and carries the water up), but it shows how much more heat the condensation supplies than the air could ever hold: 10 g/kg warms it by 24 K.',
      stories: { dT: 'In an updraft {dq} of the air\'s mass condenses as water. By how much could it warm?' } },
    { name: 'Ideal updraft speed', expr: 'w = sqrt(2*CAPE)', tex: 'w = \\sqrt{2\\,\\mathrm{CAPE}}',
      vars: { w: { name: 'updraft speed', q: 'speed', unit: 'm/s' }, CAPE: { name: 'CAPE', q: 'specificenergy', unit: 'J/kg', value: 1700, tex: '\\mathrm{CAPE}' } },
      solveFor: 'w', note: 'All the available energy turned into vertical motion, without mixing or drag; real updrafts are about a tenth of this.',
      stories: { w: 'A parcel has a CAPE of {CAPE}. What is the greatest updraft speed it could reach?' } },
    { name: 'Carnot limit of the storm', expr: 'eta = 1 - Tc/Th', tex: '\\eta = 1 - \\frac{T_c}{T_h}',
      vars: { eta: { name: 'maximum efficiency', q: 'ratio', unit: '%', tex: '\\eta' }, Tc: { name: 'temperature at the cloud top', q: 'temperature', unit: '°C', value: -73, tex: 'T_c' }, Th: { name: 'temperature of the sea surface', q: 'temperature', unit: '°C', value: 27, tex: 'T_h' } },
      solveFor: 'eta', note: 'Temperatures are converted to kelvin for you. Real storms convert less than this because of friction in the boundary layer; only about 1/400 of the heat released ends as wind.',
      stories: { eta: 'A heat engine takes heat at {Th} and gives it up at {Tc}. What is its greatest efficiency?' } }
  ],
  examples: [
    { title: 'The daily ledger', q: 'Rain of 1.5 cm per day falls on a circle of radius 665 km. How much water is that, how much heat does its condensation release, and how does the power compare with the world\'s average electric power of about 3.4 × 10¹² W?',
      steps: [{ text: 'Area:', tex: 'A = \\pi\\,(6.65\\times10^{5})^2 = 1.39\\times10^{12}\\ \\mathrm{m^2}' }, 'Volume: $0.015 \\times 1.39\\times10^{12} = 2.1\\times10^{10}$ m³, which is $2.1\\times10^{13}$ kg.', { text: 'Energy at 2.45 MJ/kg:', tex: 'E = 2.1\\times10^{13}\\times2.45\\times10^{6} = 5.1\\times10^{19}\\ \\mathrm{J}' }, 'Power: $5.1\\times10^{19} / 86{,}400 = 5.9\\times10^{14}$ W, which is $5.9\\times10^{14}/3.4\\times10^{12} \\approx 170$ times the world\'s electricity.'],
      a: '21 km³ of water, 5 × 10¹⁹ J a day, 6 × 10¹⁴ W: about 170–200 times the world\'s electric power.' },
    { title: 'The updraft', q: 'A parcel lifted from a 28 °C sea at 85 % humidity has a CAPE of about 3,200 J/kg (the simulation). What is the ideal updraft speed, and how much water condenses if 20 g per kg of air does?',
      steps: [{ text: 'Speed:', tex: 'w = \\sqrt{2\\times3200} = 80\\ \\mathrm{m/s}' }, 'In practice mixing with the surroundings and the weight of the condensed water leave about a tenth of this, 8 to 10 m/s in strong eyewall towers.', 'Heat from 20 g/kg condensing: $0.020 \\times 2.45\\times10^{6} = 49$ kJ per kilogram of air.'],
      a: 'An ideal 80 m/s (about 8 m/s in practice), and 49 kJ released per kilogram of air.' }
  ],
  quiz: [
    { q: 'The main source of a hurricane\'s energy is', choices: ['heat conducted from the sea to the air', 'latent heat released when water vapour condenses', 'friction between wind and waves', 'the rotation of the Earth'], a: 1, why: 'Conduction and friction supply a small fraction. Condensation of about 21 km³ of water a day releases about 5 × 10¹⁹ J.' },
    { q: 'Hurricanes can form over any sea warmer than 15 °C.', a: false, why: 'The threshold is about 26.5 °C, over a warm layer some 50 m deep. In the parcel simulation the buoyancy vanishes below about 22 °C.' },
    { q: 'How many kilograms of water must condense per second to release 6 × 10¹⁴ W at 2.5 MJ/kg?', answer: 2.4e8, tol: 0.05, why: '$6\\times10^{14}/2.5\\times10^{6} = 2.4\\times10^{8}$ kg/s, a flow of 240,000 m³/s of water.' },
    { q: 'Why does a hurricane weaken quickly after it crosses a coast?', choices: ['The land is colder', 'It is cut off from the supply of vapour, its fuel, and friction increases', 'The Coriolis force vanishes', 'There is less sunlight'], a: 1, why: 'Without evaporation from the warm sea no latent heat is delivered to the storm; extra friction over land brakes the winds.' },
    { q: 'An engine taking heat at 27 °C and rejecting it at −73 °C has a greatest efficiency of about', choices: ['3 %', '10 %', '33 %', '67 %'], a: 2, why: '$1 - 200/300 = 0.33$. The storm\'s real conversion to wind, about 1/400 of the heat released, is far lower.' }
  ],
  applications: ['Forecasting: operational models start storms with the temperature and depth of the warm layer, observed by satellites, floats and aircraft.', 'Risk assessment: storm surge, wind and rainfall flooding, which the heavier rain of a warmer atmosphere intensifies.', 'The energy budget of the tropics: storms carry heat and moisture poleward and ventilate the warm seas.', 'Engineering: design wind speeds for buildings, power lines and offshore platforms.', 'Understanding all thunderstorms: the same condensation heats each updraft.'],
  history: 'Erik Palmén of Helsinki noticed in 1948 that tropical cyclones form only over seas warmer than about 26.5 °C. In 1986 Kerry Emanuel of MIT proposed that a hurricane is a Carnot-like heat engine kept going by the evaporation of the sea, and in 1987 derived the maximum intensity a storm can reach from the sea temperature and the cold of the upper air.',
  sources: ['NOAA Atlantic Oceanographic and Meteorological Laboratory, Hurricane Research Division, "Frequently asked questions" — the energy released by a hurricane and the wind it produces.', 'Emanuel, "An air–sea interaction theory for tropical cyclones. Part I", *Journal of the Atmospheric Sciences* 43 (1986), and *Divine Wind* (Oxford University Press, 2005).', 'Wallace and Hobbs, *Atmospheric Science: An Introductory Survey* — the moist adiabat and CAPE.', 'IPCC, *Climate Change 2021: The Physical Science Basis*, ch. 11 — tropical cyclones in a warming climate.'],
  sim: 'heat-parcel'
}
);

Hyper.add(

/* ================================================================ thermal expansion of the sea */
{
  id: 'thermal-expansion-of-the-sea', parent: 'the-ocean-that-remembers-heat', title: 'The thermal expansion of the sea', level: 2,
  short: 'Warm water takes more room: sea water expands by about 2.6 × 10⁻⁴ per kelvin at 20 °C and six times less near freezing. Spread over a warming ocean this accounts for a third to a half of sea-level rise, and a given amount of heat lifts a tropical sea several times as far as a polar one.',
  keywords: ['thermal expansion of sea water', 'thermosteric sea level', 'sea level rise', 'expansion coefficient', 'steric', 'barystatic', 'altimetry', 'warm water expands more'],
  prereq: ['the-density-maximum', 'oceans-as-a-heat-reservoir', 'physics:thermal-expansion'],
  related: ['density-and-expansion-anomalies', 'icebergs-and-sea-ice', 'the-salt-of-the-sea', 'ocean-currents', 'how-much-water-earth-has', 'sea-ice-and-albedo', 'physics:specific-heat'],
  body: `
Sea level at a tide gauge can go up for two reasons: there is more water in the ocean, or the same water takes up more room. The second is as simple as a thermometer, and the ocean has been behaving like one.

### The coefficient
The **volumetric thermal expansion coefficient** $\\alpha = -\\frac{1}{\\rho}\\frac{d\\rho}{dT}$ is the fraction by which a volume of liquid grows for each kelvin of warming. Water is unusual because it changes sign.

| Temperature | Fresh water, 10⁻⁴ /K | Sea water (35 g/kg), 10⁻⁴ /K |
|---|---|---|
| 0 °C | −0.68 | 0.53 |
| 4 °C | 0.00 | 1.02 |
| 10 °C | 0.88 | 1.67 |
| 20 °C | 2.07 | 2.57 |
| 30 °C | 3.03 | 3.34 |

Fresh water has its density maximum at 3.98 °C, so it expands when *cooled* below that ([[the-density-maximum]]). Salt shifts the maximum to lower temperature, and above a salinity of 24.7 g/kg it disappears altogether: the density of ocean water increases all the way to its freezing point, near −1.9 °C. The sea's α does not reach zero, but it is small when cold. The same heat expands a tropical sea at 28 °C about six times as much as a polar sea close to freezing. (Sea values follow the UNESCO 1980 equation of state; the fresh-water column is the engine's.)

The reason is the one behind the density maximum: in cold water the open, ice-like patches of the network are collapsing as it warms, which shrinks it and offsets the ordinary expansion; at higher temperature that structure is gone and water behaves like any liquid.

### The arithmetic
For small warmings the rise of a layer of depth $D$ warmed by $\\Delta T$ is $h = \\alpha\\,\\Delta T\\,D$. A layer 700 m deep warmed by 0.3 K at $\\alpha = 1.5\\times10^{-4}$ rises by 31 mm. There is a neater way to count. A layer that absorbs a heat $Q$ per square metre warms by $Q/(\\rho c D)$, so

$$h = \\frac{\\alpha\\,Q}{\\rho\\,c}$$

and **the depth drops out**: only the heat and the expansion coefficient of the water that holds it matter. For a heat flux of 1 W/m² over a year, $Q = 3.16\\times10^7$ J/m², and with $\\alpha = 2.2\\times10^{-4}$ and $\\rho c = 4.09\\times10^6$ J/(m³·K) the sea rises by 1.7 mm. The oceans have been taking in about 0.8 W/m², which gives about 1.4 mm a year, the rate of thermal expansion that is observed. The 4 × 10²³ J absorbed between 1971 and 2018 would raise the ocean by about 60 mm.

### What the measurements say
The IPCC's sixth assessment finds that global mean sea level rose by about 0.20 m between 1901 and 2018, at 1.3 mm/yr early in the twentieth century, 1.9 mm/yr in 1971–2006 and 3.7 mm/yr in 2006–2018. Thermal expansion supplied about half of the 1971–2018 rise and about 1.4 mm/yr (some 38 %) of the recent rate; the rest came from the loss of mass of glaciers and the ice sheets, with a smaller part from changes in water stored on land. The expansion part is measured from Argo temperature profiles, the total by tide gauges and, since 1993, by radar altimeters on satellites such as TOPEX/Poseidon and the Jason series.

### What does not count
Melting floating ice hardly changes sea level, since it already displaced its own weight ([[icebergs-and-sea-ice]]); ice on land, once melted, adds mass. The sea's response to heat also lasts: the deep ocean takes centuries to warm, so expansion goes on after the surface stops warming.

> [!key] Warming a column of water makes it taller by $\\alpha\\,\\Delta T\\,D$, and the amount of expansion per joule depends only on α, which is six times larger in a warm tropical sea than in a cold one. Thermal expansion supplied about half the sea-level rise since 1971 and about 1.4 mm a year now.`,
  ideas: ['The expansion coefficient of sea water is 0.5 × 10⁻⁴ /K near freezing, 2.6 × 10⁻⁴ at 20 °C and 3.3 × 10⁻⁴ at 30 °C: warm seas expand about six times as much per kelvin as cold ones.', 'The rise of a layer is $\\alpha\\,\\Delta T\\,D$, or $\\alpha Q/(\\rho c)$ for absorbed heat $Q$ per square metre: the depth drops out.', 'About 0.8 W/m² of ocean heat uptake gives about 1.4 mm/yr of expansion, matching the observed rate.', 'Thermal expansion supplied about half of the 1971–2018 sea-level rise and about 38 % of the 2006–2018 rate; melting land ice supplies most of the rest.', 'Melting sea ice and ice shelves do not raise sea level; melting land ice does.'],
  pitfalls: ['"Sea level rises only because ice melts" — Roughly a third to a half of the recent rise is warm water taking more room. Even with no melting at all the sea would keep rising.', '"Cold water expands when it warms, like everything else" — Fresh water below 3.98 °C does the opposite, and sea water\'s α, although positive, is tiny near freezing. That is why the polar seas expand so little.', '"Melting Arctic sea ice will raise sea level" — Floating ice displaces its own weight of water; its melting hardly changes the level, whereas ice on Greenland and Antarctica adds new water.'],
  terms: [
    { term: 'Thermal expansion coefficient', also: ['expansivity', 'α', 'volumetric expansion coefficient'], def: 'The fractional change in volume per kelvin, $\\alpha = -(1/\\rho)\\,d\\rho/dT$. For sea water 0.5 × 10⁻⁴ /K at 0 °C, 2.6 × 10⁻⁴ at 20 °C; for fresh water it is zero at 3.98 °C and negative below it.' },
    { term: 'Thermosteric sea level', also: ['thermal expansion contribution', 'steric height'], def: 'The change in sea level caused by the change in density of the water as its temperature changes, with no change in mass. A warming ocean raises it.' },
    { term: 'Barystatic sea level', also: ['mass contribution', 'eustatic change from added water'], def: 'The change in sea level caused by adding or removing water mass from the ocean, as when land ice melts or groundwater is pumped to the sea.' },
    { term: 'Global mean sea level', also: ['GMSL', 'mean sea level'], def: 'The height of the ocean surface averaged over the global ocean, relative to the sea floor. It rose by about 0.20 m from 1901 to 2018 and is now rising at over 3 mm/yr.' },
    { term: 'Satellite altimetry', also: ['radar altimetry', 'TOPEX/Poseidon', 'Jason'], def: 'Measurement of the height of the sea surface from orbit by timing radar pulses reflected from it, to millimetre precision after averaging. Continuous global records exist since 1993.' }
  ],
  formulas: [
    { name: 'Expansion of a warmed layer', expr: 'h = alpha*dT*D', tex: 'h = \\alpha\\,\\Delta T\\,D',
      vars: { h: { name: 'rise of the surface', q: 'length', unit: 'mm' }, alpha: { name: 'expansion coefficient', q: 'expansion', unit: '1/K', value: 1.5e-4, tex: '\\alpha', hint: 'About 2.6 × 10⁻⁴ /K for sea water at 20 °C, 0.5 × 10⁻⁴ near freezing.' }, dT: { name: 'warming of the layer', q: 'dtemp', unit: 'K', value: 0.3, tex: '\\Delta T' }, D: { name: 'depth of the layer', q: 'length', unit: 'm', value: 700 } },
      solveFor: 'h', note: 'Valid for small warming of a layer of fixed mass; the real rise is slightly larger because α grows with temperature.',
      stories: { h: 'A layer of sea {D} deep warms by {dT}, with an expansion coefficient of {alpha}. How far does the surface rise?', D: 'A layer of sea warms by {dT} and its surface rises {h}. How deep was it?' } },
    { name: 'Rise from the heat absorbed', expr: 'h = alpha*Q/(rho*c*A)', tex: 'h = \\frac{\\alpha\\,Q}{\\rho\\,c\\,A}',
      vars: { h: { name: 'rise of sea level', q: 'length', unit: 'mm' }, alpha: { name: 'mean expansion coefficient', q: 'expansion', unit: '1/K', value: 2.2e-4, tex: '\\alpha', hint: 'Weighted towards the warm upper ocean, where most of the heat sits.' }, Q: { name: 'heat absorbed by the ocean', q: 'energy', unit: 'J', value: 4e23 }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, c: { name: 'specific heat of sea water', q: 'specificheat', unit: 'J/(kg·K)', value: 3990 }, A: { name: 'area of the oceans', q: 'area', unit: 'km²', value: 3.61e8 } },
      solveFor: 'h', note: 'The depth over which the heat is spread has cancelled. Using 4 × 10²³ J, the heat taken up between 1971 and 2018, it gives about 60 mm, to be compared with the observed half of a rise of about 140 mm.',
      stories: { h: 'The oceans of area {A} absorb {Q} of heat; their water expands by {alpha} per kelvin. How much does the sea level rise?' } },
    { name: 'Rise from a heat flux over time', expr: 'h = alpha*F*t/(rho*c)', tex: 'h = \\frac{\\alpha\\,F\\,t}{\\rho\\,c}',
      vars: { h: { name: 'rise of sea level', q: 'length', unit: 'mm' }, alpha: { name: 'expansion coefficient', q: 'expansion', unit: '1/K', value: 2.2e-4, tex: '\\alpha' }, F: { name: 'heat flux into the sea', q: 'intensity', unit: 'W/m²', value: 0.8 }, t: { name: 'time', q: 'time', unit: 'yr', value: 1 }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, c: { name: 'specific heat of sea water', q: 'specificheat', unit: 'J/(kg·K)', value: 3990 } },
      solveFor: 'h', note: 'At 0.8 W/m² this gives 1.4 mm per year; with $\\alpha$ of a polar sea (0.5 × 10⁻⁴) it would be 0.3 mm per year.',
      stories: { h: 'A heat flux of {F} enters sea water of expansion coefficient {alpha} for {t}. How much does the surface rise?' } }
  ],
  examples: [
    { title: 'Warm sea against cold sea', q: 'The same heat, $Q = 4\\times10^{8}$ J per square metre, is added to a tropical sea at 28 °C ($\\alpha = 3.2\\times10^{-4}$ /K) and to a polar sea at 1 °C ($\\alpha = 0.5\\times10^{-4}$ /K). Compare how far the two surfaces rise. Take $\\rho c = 4.09\\times10^6$ J/(m³·K).',
      steps: [{ text: 'Tropical:', tex: 'h = \\frac{3.2\\times10^{-4}\\times4\\times10^{8}}{4.09\\times10^{6}} = 31\\ \\mathrm{mm}' }, { text: 'Polar:', tex: 'h = \\frac{0.5\\times10^{-4}\\times4\\times10^{8}}{4.09\\times10^{6}} = 4.9\\ \\mathrm{mm}' }, 'The ratio is the ratio of the coefficients, 6.4. Neither depends on how deep the heat went: a thin warm layer and a thick one give the same rise as long as the water stays at its temperature.'],
      a: 'About 31 mm in the tropics against 5 mm at the pole: six times as much.' },
    { title: 'The thermometer reading', q: 'About 4 × 10²³ J went into the oceans from 1971 to 2018 (area 3.61 × 10¹⁴ m², ρc = 4.09 × 10⁶ J/(m³·K)). Take α = 2.2 × 10⁻⁴ /K for the warm upper ocean. How much did the surface rise by expansion, and what is that as a share of the observed total of about 140 mm?',
      steps: [{ text: 'Heat per square metre of ocean:', tex: 'Q/A = \\frac{4\\times10^{23}}{3.61\\times10^{14}} = 1.1\\times10^{9}\\ \\mathrm{J/m^2}' }, { text: 'Rise:', tex: 'h = \\frac{2.2\\times10^{-4}\\times1.1\\times10^{9}}{4.09\\times10^{6}} = 0.059\\ \\mathrm{m}' }, 'That is about 60 mm, some 43 % of 140 mm: consistent with the assessed share of about a half.'],
      a: 'About 60 mm, around two-fifths to a half of the observed rise.' }
  ],
  quiz: [
    { q: 'At which temperature does fresh water not change its volume when slightly warmed?', choices: ['0 °C', '3.98 °C', '20 °C', '100 °C'], a: 1, why: 'At the density maximum, 3.98 °C, the expansion coefficient is zero; below it, fresh water expands on cooling and shrinks on warming.' },
    { q: 'The same heat per square metre raises the surface of a tropical sea several times as far as a polar sea.', a: true, why: 'The rise is $\\alpha Q/(\\rho c)$ and α of sea water is 3.3 × 10⁻⁴ at 30 °C against 0.5 × 10⁻⁴ near freezing, a ratio of about six.' },
    { q: 'A 700 m layer warms by 0.5 K with α = 2 × 10⁻⁴ /K. By how many millimetres does its surface rise?', answer: 70, unit: 'mm', tol: 0.03, why: '$h = 2\\times10^{-4}\\times0.5\\times700 = 0.07$ m = 70 mm.' },
    { q: 'What happens to sea level when the floating sea ice of the Arctic melts?', choices: ['It rises by the full volume of the ice', 'It hardly changes', 'It falls by the volume of the ice', 'It rises by one-tenth of the ice volume'], a: 1, why: 'Floating ice displaces its own weight of water, so when it melts the water takes the same room. (A small difference arises because sea ice is nearly fresh, a matter of a few percent of its volume.)' },
    { q: 'About what share of the sea-level rise from 1971 to 2018 was due to thermal expansion, according to the IPCC\'s sixth assessment?', choices: ['5 %', '15 %', 'about half', 'nearly all'], a: 2, why: 'Expansion about 50 %, glaciers about 22 %, the ice sheets about 20 %, land water about 8 %. In 2006–2018 expansion\'s share fell to about 38 % as ice loss grew.' }
  ],
  applications: ['Projecting sea-level rise: the expansion term is computed from ocean models and Argo temperature profiles, and ranks among the more certain parts of the projection.', 'Reading the ocean\'s heat uptake from the sea: altimetry and temperature profiles give two independent measures of the same quantity.', 'Coastal planning: it fixes the part of future flooding that continues for centuries after surface temperatures stop rising, since the deep ocean takes centuries to warm.', 'Oceanography: the dynamic topography of the sea (warm water stands higher) is used to infer currents.', 'Engineering: tide gauges, harbour design and the datum of national height systems.'],
  history: 'Vagn Walfrid Ekman published his tables of the compressibility of sea water in 1908; the equation of state used for decades afterwards, the UNESCO 1980 formula of Millero and Poisson, fixes the density of sea water to a few parts per million. Satellite altimetry made global mean sea level a measured quantity from 1993.',
  sources: ['IPCC, *Climate Change 2021: The Physical Science Basis*, ch. 9 (ocean, cryosphere and sea-level change) — the budget of sea-level rise and the share of expansion.', 'Millero and Poisson, "International one-atmosphere equation of state of seawater", *Deep-Sea Research* 28A (1981) — the equation of state used for the sea column.', 'IOC, SCOR and IAPSO, *The International Thermodynamic Equation of Seawater – 2010* (TEOS-10 manual).', 'Pugh and Woodworth, *Sea-Level Science* (Cambridge University Press, 2014) — tide gauges, altimetry and the budget.'],
  sim: { id: 'heat-column', params: { view: 'level', T0: 28, D: 700 } }
},

/* ================================================================ water cools machines */
{
  id: 'water-cools-machines', parent: 'the-ocean-that-remembers-heat', title: 'Water cools machines', level: 2,
  short: 'A litre of water per second carries away 4.2 kW for each kelvin it warms. That one number sizes the radiator of a car, the river beside a power station and the chilled-water loops of a data centre; evaporating the water instead carries away 2.4 MJ per kilogram.',
  keywords: ['water cooling', 'coolant', 'engine cooling', 'antifreeze', 'ethylene glycol', 'power station cooling', 'cooling tower', 'once-through cooling', 'data centre cooling', 'nuclear reactor coolant', 'Q = m c dT'],
  prereq: ['specific-heat-of-water', 'latent-heat-of-vaporisation'],
  related: ['evaporative-cooling', 'thermal-conductivity-of-water', 'the-boiling-point-anomaly', 'hard-water-and-limescale', 'pure-water-and-conductivity', 'gases-in-water', 'heavy-water-in-reactors', 'the-body-at-37-degrees', 'physics:heat-transfer'],
  body: `
A kilowatt of heat is hard to hide. A hotplate does it by glowing red. A cooling system does it by moving water.

### One relation
A coolant that enters at one temperature and leaves warmer carries off the heat
$$Q = \\dot m\\,c\\,\\Delta T.$$
For water, $c = 4.19$ kJ/(kg·K), so every litre per second warmed by one kelvin carries **4.2 kW**. The relation sizes everything from a chip to a power station:

| Heat load | Heat | Water flow for a 10 K rise |
|---|---|---|
| processor | 150 W | 3.6 mL/s |
| car engine at cruise | 40 kW | 0.96 L/s |
| server rack | 20 kW | 0.48 L/s |
| data-centre hall | 10 MW | 240 L/s |
| a 1 GW steam power station (2 GW of heat to lose) | 2 GW | 48 m³/s |

The engine's coolant would fill a bath in three minutes; the power station's river is a small river. Air does the same job at a cost: a cubic metre of air holds 1.2 kJ per kelvin, against 4,170 for water, so the 20 kW rack on a 10 K air rise would need 1.7 m³/s, 3,500 times the volume, which is why air-cooled machines are mostly fans and fins and why dense computing is going to liquid.

### Why water
- the highest heat capacity per kilogram and per litre of any cheap liquid ([[specific-heat-of-water]]);
- good conductivity for a liquid and low viscosity, so the heat moves quickly into and out of the stream ([[thermal-conductivity-of-water]]);
- cheap, non-toxic, abundant, liquid between 0 and 100 °C and far more under pressure.

Its faults shape the engineering: it freezes, it boils, it corrodes metals, it leaves limescale in hot passages ([[hard-water-and-limescale]]), it conducts electricity unless purified ([[pure-water-and-conductivity]]) and it grows slime in warm circuits.

### Engines
A mixture of water and ethylene glycol (antifreeze) has a specific heat of about 3.3 kJ/(kg·K), freezes near −37 °C at half-and-half and boils at about 107 °C. The radiator cap lets the system run at about 1 bar above atmospheric, raising the boiling point to about 130 °C, so the coolant can leave the engine at 90 to 105 °C without boiling. The price is that for the same load the mixture needs about 20 % more flow than plain water.

### Power stations
A steam plant at 33 to 40 % efficiency throws away about two joules of heat for each joule of electricity. *Once-through* cooling draws river or sea water, warms it by 5 to 10 K and returns it, using tens of cubic metres a second per gigawatt and warming the river (warm water also holds less oxygen: [[gases-in-water]]). A *wet cooling tower* instead evaporates about a quarter to three-quarters of the heat away: typical steam plants with towers consume 2 to 2.6 litres of water per kilowatt-hour (Macknick and colleagues, 2012). A pressurised-water reactor keeps its water liquid at about 155 bar and 325 °C, since pressure raises the boiling point, and the same water slows the neutrons; see [[heavy-water-in-reactors]] for the reactors that use heavy water.

### Computers and storage
Server racks produce 5 to 50 kW, more for artificial-intelligence hardware. Cold plates on the chips pass chilled water or glycol out to chillers or to evaporative towers, and the warm return can heat buildings. Water stores heat as well as moves it: hot-water tanks, district-heating networks at 80 to 120 °C and chilled-water or ice stores that shift a building's cooling to the night.

> [!key] A litre per second of water carries 4.2 kW per kelvin, so cooling any heat load is arithmetic: choose the flow and the warming. Water wins over air by a factor of 3,500 in volume, and evaporating it instead removes 2.4 MJ per kilogram at the price of losing the water.`,
  ideas: ['$Q = \\dot m\\,c\\,\\Delta T$: a litre per second of water warmed by one kelvin carries 4.2 kW.', 'Water carries about 3,500 times more heat per cubic metre than air, which is why liquid cooling takes over as heat density rises.', 'Antifreeze lowers the freezing point and raises the boiling point, but its lower specific heat needs about 20 % more flow than water.', 'Power stations cool by warming a river (large flow, little loss) or by evaporating water in a tower (little flow, 2–2.6 litres lost per kWh).', 'Pressure keeps water liquid far above 100 °C in engines and reactors.'],
  pitfalls: ['"Cooling by evaporation and cooling by warming are the same" — A kilogram of water warmed by 10 K removes 42 kJ; evaporated, it removes 2,400 kJ, fifty-seven times as much, but the water is lost to the air.', '"Water-cooled means the water is cold" — The water only needs to be cooler than the machine. Engines are cooled with water at 90 °C; condensers with water at 30 °C.', '"More flow always cools better" — The heat transferred depends on the heat-transfer coefficient and area as well as the flow; very high flow barely lowers the outlet temperature further and wastes pumping power.'],
  terms: [
    { term: 'Coolant', also: ['heat-transfer fluid', 'cooling water'], def: 'A fluid that carries heat from where it is made to where it is rejected, such as the water-glycol mixture of a car engine or the chilled water of a data centre.' },
    { term: 'Heat exchanger', also: ['radiator', 'condenser'], def: 'A device that passes heat from one fluid to another through a wall without mixing them: a car radiator, a power-station condenser, the cold plate on a processor.' },
    { term: 'Once-through cooling', also: ['open-loop cooling', 'direct cooling'], def: 'Cooling in which water is drawn from a river, lake or sea, warmed by the plant and returned, so that almost none is consumed but the water is warmed by 5–10 K.' },
    { term: 'Cooling tower', also: ['wet cooling tower', 'evaporative tower'], def: 'A structure in which warm water is sprayed into a stream of air so that part of it evaporates and cools the rest, rejecting heat to the air at the price of consuming water.' },
    { term: 'Antifreeze', also: ['ethylene glycol coolant', 'glycol mixture'], def: 'A liquid, usually ethylene or propylene glycol, mixed with water to lower its freezing point (to −37 °C at half-and-half) and raise its boiling point, with inhibitors against corrosion. Its specific heat is lower than water\'s (about 3.3 kJ/(kg·K) at half-and-half).' }
  ],
  formulas: [
    { name: 'Heat carried by a coolant', expr: 'Q = mdot*c*dT', tex: 'Q = \\dot m\\,c\\,\\Delta T',
      vars: { Q: { name: 'heat carried', q: 'power', unit: 'kW', value: 20 }, mdot: { name: 'mass flow of coolant', q: 'massflow', unit: 'kg/s', value: 0.48, tex: '\\dot m' }, c: { name: 'specific heat of the coolant', q: 'specificheat', unit: 'J/(kg·K)', value: 4182, hint: 'Water 4,182; water with 50 % ethylene glycol about 3,300; mineral oil about 1,900; air 1,005.' }, dT: { name: 'warming of the coolant', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T' } },
      solveFor: 'mdot', note: 'The same relation gives the flow for a load, the warming for a flow, or the heat a river can absorb. For water, 1 kg is 1 litre.',
      stories: { mdot: 'A machine makes {Q} of heat. The coolant, of specific heat {c}, may warm by {dT}. What mass flow does it need?', dT: 'A coolant of specific heat {c} flows at {mdot} and carries {Q}. By how much does it warm?', Q: 'A coolant of specific heat {c} flows at {mdot} and warms by {dT}. How much heat does it carry?' } },
    { name: 'Water evaporated to carry the same heat', expr: 'mdot = Q/Lv', tex: '\\dot m = \\frac{Q}{L_v}',
      vars: { mdot: { name: 'mass of water evaporated per second', q: 'massflow', unit: 'kg/s', tex: '\\dot m' }, Q: { name: 'heat to remove', q: 'power', unit: 'MW', value: 2000 }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'MJ/kg', value: 2.43, tex: 'L_v' } },
      solveFor: 'mdot', note: 'The ideal limit if every joule were removed by evaporation. A wet tower removes a quarter to three-quarters of the heat this way, the rest by warming the air.',
      stories: { mdot: 'A plant must reject {Q} by evaporation at {Lv}. How much water evaporates each second?' } },
    { name: 'Cooling water consumed per kilowatt-hour', expr: 'm = f*(1/eta - 1)*E/Lv', tex: 'm = \\frac{f\\,(1/\\eta - 1)\\,E}{L_v}',
      vars: { m: { name: 'water evaporated', q: 'mass', unit: 'kg' }, f: { name: 'share of the waste heat removed by evaporation', q: 'ratio', unit: '%', value: 75 }, eta: { name: 'efficiency of the plant', q: 'ratio', unit: '%', value: 33, tex: '\\eta' }, E: { name: 'electrical energy delivered', q: 'energy', unit: 'kWh', value: 1 }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'MJ/kg', value: 2.43, tex: 'L_v' } },
      solveFor: 'm', note: 'A plant of efficiency η sends $1/\\eta - 1$ joules to the cooling system for each joule of electricity. Typical consumption of steam plants with towers is 2–2.6 L/kWh.',
      stories: { m: 'A steam plant of efficiency {eta} delivers {E} of electricity; {f} of its waste heat leaves by evaporation at {Lv}. How much water evaporates?' } },
    { name: 'Pipe diameter for a flow', expr: 'D = sqrt(4*V/(pi*v))', tex: 'D = \\sqrt{\\frac{4\\,\\dot V}{\\pi\\,v}}',
      vars: { D: { name: 'pipe diameter', q: 'length', unit: 'mm' }, V: { name: 'volume flow', q: 'flowrate', unit: 'L/s', value: 0.96, tex: '\\dot V' }, v: { name: 'speed in the pipe', q: 'speed', unit: 'm/s', value: 2 } },
      solveFor: 'D', note: 'A speed of 1–3 m/s is typical of water circuits: slower wastes pipe, faster wastes pumping power and wears the walls.',
      stories: { D: 'A circuit carries {V} at {v}. What diameter of pipe is needed?' } }
  ],
  examples: [
    { title: 'An engine and its antifreeze', q: 'A car engine rejects 40 kW to its coolant, which may warm by 10 K between inlet and outlet. What flow does it need with (a) water and (b) a 50 % glycol mixture (3,300 J/(kg·K), 1,070 kg/m³)?',
      steps: [{ text: '(a) Water:', tex: '\\dot m = \\frac{40000}{4182\\times10} = 0.96\\ \\mathrm{kg/s} = 0.96\\ \\mathrm{L/s}' }, { text: '(b) Glycol mixture:', tex: '\\dot m = \\frac{40000}{3300\\times10} = 1.21\\ \\mathrm{kg/s},\\quad \\dot V = \\frac{1.21}{1070} = 1.13\\ \\mathrm{L/s}' }, 'The mixture needs 18 % more volume flow. The price buys protection down to −37 °C and a higher boiling point.'],
      a: '0.96 L/s of water, or 1.13 L/s of the glycol mixture.' },
    { title: 'A power station and its river', q: 'A 1 GW (electric) steam plant of 33 % efficiency must reject 2 GW of heat. How much water does it need (a) once-through, warming the river by 8 K, and (b) by a wet tower removing 75 % of the heat by evaporation at 2.43 MJ/kg?',
      steps: [{ text: '(a) Once-through:', tex: '\\dot m = \\frac{2\\times10^{9}}{4182\\times8} = 6.0\\times10^{4}\\ \\mathrm{kg/s} = 60\\ \\mathrm{m^3/s}' }, { text: '(b) Tower:', tex: '\\dot m = \\frac{0.75\\times2\\times10^{9}}{2.43\\times10^{6}} = 620\\ \\mathrm{kg/s}' }, 'The tower uses a hundredth of the flow but loses all of it to the air: 620 kg/s over the 10⁶ kWh produced each hour is 2.2 litres per kilowatt-hour. The once-through plant returns almost all of its 60 m³/s, 8 K warmer.'],
      a: '60 m³/s warmed by 8 K once-through, or 620 kg/s evaporated with a tower (2.2 L/kWh).' }
  ],
  quiz: [
    { q: 'A processor dissipates 100 W into a water loop that may warm by 5 K. What flow, in mL/s, is needed?', answer: 4.78, unit: 'mL/s', tol: 0.03, why: '$\\dot m = 100/(4182\\times5) = 4.78\\times10^{-3}$ kg/s = 4.78 mL/s.' },
    { q: 'For the same heat and temperature rise, air needs a volume flow roughly how many times that of water?', choices: ['10', '100', '3,500', '1,000,000'], a: 2, why: 'Volumetric heat capacity: water 4,170 kJ/(m³·K), air 1.2: a ratio of about 3,500.' },
    { q: 'Once-through cooling loses more water to the air than a wet cooling tower does.', a: false, why: 'Once-through cooling withdraws a great deal but returns nearly all of it, warmed. A wet tower withdraws less, but the water it evaporates is lost to the air.' },
    { q: 'Why does the radiator cap of a car engine matter for cooling?', choices: ['It keeps dirt out', 'The pressure it holds raises the boiling point of the coolant', 'It lowers the freezing point', 'It increases the flow'], a: 1, why: 'At about 1 bar above atmospheric, the boiling point of water-glycol rises from about 107 °C to about 130 °C, leaving room for a 100 °C outlet.' },
    { q: 'A river of 50 m³/s warms by 8 K as it cools a plant. About how much power does it absorb?', choices: ['170 MW', '1.7 GW', '17 GW', '170 kW'], a: 1, why: '$50{,}000\\ \\mathrm{kg/s}\\times4182\\times8 = 1.67\\times10^{9}$ W.' }
  ],
  applications: ['Car and truck engines, with water–glycol circuits and pressurised radiators.', 'Steam power stations, nuclear and fossil, with once-through or wet-tower cooling; the choice sets their water footprint.', 'Data centres: chilled-water loops, cold plates on chips and heat recovery for district heating.', 'Industrial processes: furnaces, injection moulding, welding, lasers and mills are water cooled.', 'Space suits: the Apollo lunar suits circulated cool water through a garment next to the wearer\'s skin and shed the heat by letting water ice sublimate into space.'],
  sources: ['Macknick et al., "Operational water consumption and withdrawal factors for electricity generating technologies: a review of existing literature", *Environmental Research Letters* 7 (2012) — litres per kilowatt-hour.', 'Lienhard and Lienhard, *A Heat Transfer Textbook* — coolant selection, heat exchangers and the relation $Q = \\dot m c\\,\\Delta T$.', 'World Nuclear Association, "Nuclear power reactors" — pressurised-water reactor conditions (about 155 bar, 325 °C).', 'CRC *Handbook of Chemistry and Physics* — specific heat and freezing points of ethylene glycol–water mixtures.'],
  sim: 'heat-cooling-loop'
},

/* ================================================================ the body at 37 degrees */
{
  id: 'the-body-at-37-degrees', parent: 'the-ocean-that-remembers-heat', title: 'The body at 37 °C', level: 2,
  short: 'A person is 60 % water, with the heat capacity of about 60 kg × 3.5 kJ/(kg·K) = 210 kJ per kelvin. At rest the body makes 80 W, in hard exercise ten times as much; without sweating, blood flow and shivering the core temperature would run away within minutes.',
  keywords: ['body temperature', '37 degrees', 'thermoregulation', 'sweating', 'shivering', 'heat stroke', 'hypothermia', 'core temperature', 'basal metabolic rate', 'blood flow to skin', 'heat capacity of the body'],
  prereq: ['specific-heat-of-water', 'evaporative-cooling', 'how-much-water-we-are'],
  related: ['blood-and-the-daily-budget', 'thermal-conductivity-of-water', 'the-matrix-of-life', 'maritime-and-continental-climates', 'medicine:thermoregulation', 'biology:thermoregulation-animals', 'physics:heat-transfer'],
  body: `
The human body is a furnace of about 80 W, a little more than an incandescent bulb, kept within about a degree of 37 °C in rooms and climates that range over 60 K. It manages with three assets: a large heat capacity that makes it slow to change, a blood supply that carries heat to where it can be lost, and evaporation. All three are water. (This page explains the physics and physiology; it is not medical advice.)

### The body as a bag of water
Water is about 60 % of an adult's mass (50 to 60 % in women, more in the lean), and the average specific heat of body tissue is about **3.5 kJ/(kg·K)**, 83 % of water's. A 60 kg person has a heat capacity of $60\\times3470 = 208$ kJ/K. That has two consequences.
- At rest the body makes 80 to 100 W. If none escaped, the core would warm by $80\\times3600/208{,}000 = 1.4$ K an hour. Warming is slow; there is time to react.
- In hard exercise the body makes 600 to 1,000 W of heat (muscle is only 20 to 25 % efficient, and the rest is heat). With no cooling the core would climb by up to **17 K an hour**, reaching a lethal 42 °C from 37 in under 20 minutes. Exercise would be impossible without removing most of that heat.

### Moving the heat: blood
The heat is made in the core (organs, muscle) and lost at the skin. Blood is the conveyor: $P = \\dot V\\rho c_b\\Delta T$. When the skin is warm and the body must lose heat, blood vessels in it open and skin blood flow rises from a fraction of a litre a minute to 6 to 8 litres. A flow of 6 L/min with the blood 3 K cooler on return carries $0.106\\ \\mathrm{kg/s}\\times3600\\times3$ = 1.1 kW from core to skin, the whole of a hard worker's output. When cold, the vessels constrict and the skin cools towards the air, so less heat is lost to it. A flush on the face in a hot room and pale blue fingers in the cold are the same system. (See [[blood-and-the-daily-budget]].)

### Losing it: the four exits
At rest in a comfortable room, most heat leaves by radiation and convection from the skin; evaporation of water from the skin and lungs takes about 25 W, about a litre of water a day. Above skin temperature those two reverse and heat flows *in*; the only exit left is **sweat**: an effective 670 W for each litre an hour that evaporates ([[evaporative-cooling]]). Water, a conductor 23 times better than air, drains heat so fast from a body in cool water (see [[thermal-conductivity-of-water]]) that the skin cannot protect the core by constricting its vessels alone.

### Making it: shivering and the rest
When the core drifts down, the hypothalamus drives involuntary muscle shivering, which raises heat production two to five times; infants and small mammals also burn brown fat. These responses can fail: shivering fades as the core cools below about 33 °C.

### The thresholds
- **Normal** core temperature is 36.5 to 37.5 °C, and about 38.5 °C in sustained exercise.
- **Fever** raises the hypothalamic set point (the body works to reach 39 °C); **heat stroke** is the opposite, the failure of heat loss, with the set point unchanged. Above about 40 °C with confusion and organ damage is heat stroke, and around 42 to 43 °C proteins and membranes start to fail.
- **Hypothermia** is a core temperature below 35 °C: mild 32 to 35 °C (shivering), moderate 28 to 32 °C (shivering stops, the mind clouds), severe below 28 °C. Surgeons exploit this by deliberately cooling patients for heart operations.

### Why 37 °C?
It is a trade: warm enough for reaction rates to keep a fast metabolism going and, above the ambient temperature in most places, so that heat always flows outwards; not so warm as to approach the point where proteins fail. Mammals run at 36 to 39 °C, birds at 40 to 42 °C.

> [!key] The body is a 60 kg tank of water that must lose what it makes: 80 W at rest, up to 1 kW working. Blood carries the heat to the skin and sweat evaporating at 2.4 MJ/kg removes it; the large heat capacity buys the time in which these systems respond.`,
  ideas: ['The body makes about 80 W at rest and up to 1 kW when working hard; its heat capacity is about 210 kJ/K, so without loss the core would warm 1.4 K/h at rest and 17 K/h at 1 kW.', 'Blood carries heat from the core to the skin: 6 L/min with a 3 K temperature drop carries about 1.1 kW.', 'Above skin temperature or at high effort the only exit is evaporation of sweat: 670 W per litre an hour.', 'The control is by the hypothalamus: sweating and skin blood flow when warm, constriction and shivering when cold.', 'Fever and heat stroke are different: a raised set point against a failure of heat loss.'],
  pitfalls: ['"The body keeps 37 °C because it is very good at insulating" — Insulation is the least of it. The control is active: blood flow, sweat and shivering change the heat flow by factors of ten.', '"Sweating is the body cooling itself" — The sweat only cools if it evaporates. In humid air a person can lose a litre an hour of sweat and still overheat.', '"Fever means the body is failing to stay cool" — A fever is a raised set point: the body works to be warmer. Heat stroke is the real failure of cooling.'],
  terms: [
    { term: 'Core temperature', also: ['deep body temperature', 'rectal temperature'], def: 'The temperature of the organs and deep tissue, kept near 37 °C and measured in the rectum, ear or oesophagus. The skin is cooler: 30 to 35 °C.' },
    { term: 'Basal metabolic rate', also: ['BMR', 'resting metabolism'], def: 'The energy the body uses at rest, awake and fasting, in a thermally comfortable room: about 80 W (1,700 kcal a day) for a 60 kg adult. Nearly all of it becomes heat.' },
    { term: 'Thermoregulation', also: ['temperature regulation', 'homeostasis of temperature'], def: 'The control of body temperature around a set point by the hypothalamus, using skin blood flow, sweating, shivering and behaviour.' },
    { term: 'Hyperthermia', also: ['heat stroke', 'heat exhaustion'], def: 'A core temperature above normal because heat is made or gained faster than it can be lost, as opposed to a fever. Heat stroke, above about 40 °C with failure of the nervous system, is an emergency.' },
    { term: 'Hypothermia', also: ['cold exposure'], def: 'A core temperature below 35 °C, because heat is lost faster than it is made. Mild, moderate and severe forms are divided at about 32 and 28 °C.' },
    { term: 'Shivering thermogenesis', also: ['shivering', 'non-shivering thermogenesis'], def: 'The production of heat by rapid involuntary contractions of muscle, which raise heat output two to five times; brown fat produces heat without contraction, mainly in infants.' }
  ],
  formulas: [
    { name: 'Core warming with no heat loss', expr: 'dT = P*t/(m*c)', tex: '\\Delta T = \\frac{P\\,t}{m\\,c}',
      vars: { dT: { name: 'rise of body temperature', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, P: { name: 'net heat gained', q: 'power', unit: 'W', value: 500, hint: 'Heat made plus heat gained from the surroundings, minus heat lost.' }, t: { name: 'time', q: 'time', unit: 'min', value: 20 }, m: { name: 'mass of the body', q: 'mass', unit: 'kg', value: 60 }, c: { name: 'specific heat of body tissue', q: 'specificheat', unit: 'J/(kg·K)', value: 3470 } },
      solveFor: 'dT', note: 'It treats the body as one block at a single temperature, an overestimate of the core\'s warming at first and an underestimate later. It shows how fast the margin disappears when loss is less than gain.',
      stories: { dT: 'A {m} person gains a net {P} for {t}. By how much does the body warm if nothing is lost to the outside?', t: 'A {m} person gains a net {P}. How long until the body has warmed by {dT}?' } },
    { name: 'Heat carried by blood', expr: 'P = V*rho*cb*dT', tex: 'P = \\dot V\\,\\rho\\,c_b\\,\\Delta T',
      vars: { P: { name: 'heat carried', q: 'power', unit: 'W' }, V: { name: 'blood flow', q: 'flowrate', unit: 'L/min', value: 6, tex: '\\dot V', hint: 'Skin blood flow is 0.25 L/min in the cold and up to 6–8 L/min in the heat.' }, rho: { name: 'density of blood', q: 'density', unit: 'kg/m³', value: 1060, tex: '\\rho' }, cb: { name: 'specific heat of blood', q: 'specificheat', unit: 'J/(kg·K)', value: 3600, tex: 'c_b' }, dT: { name: 'core minus skin-return temperature', q: 'dtemp', unit: 'K', value: 3, tex: '\\Delta T' } },
      solveFor: 'P', note: 'The same $Q = \\dot m c\\,\\Delta T$ as any cooling loop, with the blood as the coolant.',
      stories: { P: 'Blood flows through the skin at {V}, returning {dT} cooler. How much heat does it carry from the core?' } },
    { name: 'Sweat lost in an effort', expr: 'ms = P*t/Lv', tex: 'm_s = \\frac{P\\,t}{L_v}',
      vars: { ms: { name: 'sweat that must evaporate', q: 'mass', unit: 'kg' }, P: { name: 'heat to lose by evaporation', q: 'power', unit: 'W', value: 600 }, t: { name: 'time', q: 'time', unit: 'h', value: 2 }, Lv: { name: 'latent heat of vaporisation at the skin', q: 'latent', unit: 'MJ/kg', value: 2.42, tex: 'L_v' } },
      solveFor: 'ms', note: 'A kilogram of sweat is about a litre. Sweat that drips is not counted; the person makes more than this in humid air.',
      stories: { ms: 'A person loses {P} by evaporation for {t}. How much sweat evaporates?' } },
    { name: 'Resting power from daily food energy', expr: 'P = E/t', tex: 'P = \\frac{E}{t}',
      vars: { P: { name: 'average power', q: 'power', unit: 'W' }, E: { name: 'energy used in the time', q: 'energy', unit: 'kcal', value: 1700 }, t: { name: 'time', q: 'time', unit: 'day', value: 1 } },
      solveFor: 'P', note: 'About 1,700 kcal a day is a basal rate of 82 W, the output of a small incandescent bulb; an active day at 2,500 kcal averages 120 W.',
      stories: { P: 'A person uses {E} in {t}. What average power is that?' } }
  ],
  examples: [
    { title: 'A runner with no sweat', q: 'A 60 kg runner produces a net 800 W of heat. How fast would the body warm with no cooling at all, and how much sweat must evaporate per hour to hold the temperature?',
      steps: [{ text: 'Rate of warming, with $mc = 208$ kJ/K:', tex: '\\frac{dT}{dt} = \\frac{800}{208{,}000} = 3.8\\times10^{-3}\\ \\mathrm{K/s} = 13.8\\ \\mathrm{K/h}' }, 'From 37 to 40 °C takes $3/3.8\\times10^{-3} = 780$ s, 13 minutes.', { text: 'Sweat needed to remove 800 W at 2.42 MJ/kg:', tex: '\\dot m = \\frac{800}{2.42\\times10^{6}} = 3.3\\times10^{-4}\\ \\mathrm{kg/s} = 1.19\\ \\mathrm{kg/h}' }],
      a: '13.8 K/h without cooling (40 °C within 13 minutes); 1.2 L of evaporated sweat per hour holds it steady.' },
    { title: 'The conveyor belt', q: 'A person in the heat has a skin blood flow of 6 L/min, returning to the core 3 K cooler than it left. How much heat does the blood carry (blood: 1,060 kg/m³ and 3,600 J/(kg·K))? Compare with the 100 W the body makes at rest.',
      steps: [{ text: 'Mass flow: $6\\ \\mathrm{L/min} = 0.1\\ \\mathrm{L/s} = 0.106\\ \\mathrm{kg/s}$. Heat:', tex: 'P = 0.106\\times3600\\times3 = 1{,}150\\ \\mathrm{W}' }, 'That is ten times the resting production: the circulation can carry far more heat to the skin than the body normally makes, which is why exercise in the heat is possible at all.'],
      a: 'About 1.1 kW, eleven times the resting heat output.' }
  ],
  quiz: [
    { q: 'A 60 kg person makes 80 W with no heat loss. How many kelvin does the body warm in an hour? (c = 3,470 J/(kg·K))', answer: 1.38, unit: 'K', tol: 0.03, why: '$80\\times3600/(60\\times3470) = 1.38$ K.' },
    { q: 'What carries heat from the working muscles and organs to the skin?', choices: ['Sweat', 'Blood flowing to the skin', 'Conduction through the bones', 'Breathing alone'], a: 1, why: 'Blood is the conveyor; sweat is the exit once the heat has reached the skin.' },
    { q: 'A fever and heat stroke are two names for the same thing.', a: false, why: 'In fever the hypothalamic set point rises and the body works to be warmer; in heat stroke the set point is unchanged but heat loss has failed and the temperature climbs above it.' },
    { q: 'How much sweat must evaporate to remove 600 W for 2 hours at 2.42 MJ/kg? (kg)', answer: 1.79, unit: 'kg', tol: 0.03, why: '$600\\times7200/2.42\\times10^{6} = 1.79$ kg.' },
    { q: 'At 20 °C a person in air is comfortable but one in water becomes dangerously cold within hours because', choices: ['water is colder than air at the same reading', 'water\'s conductivity is 25 times air\'s and its effusivity far larger, so skin vessel constriction cannot stop the loss', 'water blocks the sweat glands', 'the body does not shiver in water'], a: 1, why: 'Conduction to water, whose effusivity is hundreds of times air\'s, extracts heat many times faster than air at the same temperature, and a layer of fat or clothing is the only defence.' }
  ],
  applications: ['Occupational safety standards for work in heat, set by wet-bulb globe temperature rather than air temperature.', 'Sports medicine: cooling by cold-water immersion for exertional heat stroke, and monitoring of core temperature.', 'Surgery and resuscitation: controlled hypothermia protects the brain and heart during operations and after cardiac arrest.', 'Clothing and shelter design: insulation, vapour permeability and wetsuits manage the heat flow.', 'Space suits: the Apollo suits used a water-cooled undergarment to carry the wearer\'s heat away to a sublimator.'],
  sources: ['Guyton and Hall, *Textbook of Medical Physiology* — the chapter on body temperature, temperature regulation and fever.', 'Gagge, Stolwijk and Nishi, "An effective temperature scale based on a simple model of human physiological regulatory response", *ASHRAE Transactions* 77 (1971) — the two-node model behind the simulation.', 'Parsons, *Human Thermal Environments* — heat balance of the body, sweating and the limits of tolerance.', 'Sherwood and Huber, *PNAS* 107 (2010), and Vecellio et al., *Journal of Applied Physiology* 132 (2022) — the limits of heat tolerance.'],
  sim: 'heat-body-37'
}
);
