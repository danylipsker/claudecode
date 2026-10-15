/* HYPER-WATER · content/the-anomalies.js — the topic "The liquid no one can fully describe" (branch The Strange Liquid).
 * Eleven concepts: the list of anomalies, density and expansion, heat capacity and compressibility, viscosity and
 * diffusion under pressure, supercooled water and no man's land, two liquids in one, the polyamorphism of ice,
 * why simulations struggle, quantum effects, what remains unknown, and the strange reason — the closing page of the app.
 * Simulations: sims/the-anomalies.js (ids anom-*).
 */
Hyper.add(

/* ================================================================ the list */
{
  id: 'the-list-of-anomalies', parent: 'the-anomalies', title: 'The list of anomalies', level: 1,
  short: `Water departs from the pattern of ordinary liquids in more than seventy catalogued ways, from a density that peaks at 3.98 °C to a heat capacity that soars on supercooling. A dozen headline cases, grouped by what they measure, all point back at one bond.`,
  keywords: ['anomalies of water', 'water anomalies', 'Chaplin', 'seventy anomalies', 'unusual properties of water', 'why is water strange', 'normal liquid', 'density maximum', 'negative thermal expansion', 'response functions'],
  prereq: ['what-a-hydrogen-bond-is', 'why-ice-floats', 'specific-heat-of-water'],
  related: ['density-and-expansion-anomalies', 'heat-capacity-and-compressibility-anomalies', 'viscosity-and-diffusion-under-pressure', 'supercooled-water-and-no-mans-land', 'quantum-effects-in-water', 'the-mpemba-effect', 'the-boiling-point-anomaly', 'surface-tension', 'the-dielectric-constant', 'physics:thermal-expansion'],
  body: `
Cool a flask of an ordinary liquid — argon, benzene, ethanol, olive oil, liquid mercury — and the story is the same in every case. The liquid shrinks steadily, grows stiffer, stores a little less heat per degree, flows more slowly, and when it finally freezes the solid sinks. Physicists call such behaviour **normal**, and a large part of liquid-state theory is a description of it. Water does the opposite in a surprising number of ways, and the oddities are not rare corner cases: they lie within the range of temperatures of a kettle, a lake and a human body.

### What counts as an anomaly
Two different things get the name. A **reversal** is a trend that runs the wrong way: the density that rises on cooling and then falls, the compressibility that grows as the liquid gets colder, the viscosity that drops when the liquid is squeezed. An **extreme** is a value far outside what a molecule of this size and weight should give: the boiling point 180 K above the trend of its heavier cousins, the highest surface tension and heat capacity of the common liquids. Martin Chaplin's online catalogue, kept at London South Bank University, counts more than seventy; many of them are the same fact seen from two sides (a density maximum *is* a change of sign of the thermal expansion), and a few are contested, so the number is a guide to the size of the subject rather than a count of independent mysteries.

### The headline dozen
| Anomaly | A normal liquid | Water | The number | Why |
|---|---|---|---|---|
| *Volume* · maximum density | denser all the way to freezing | densest at 3.98 °C, lighter below | 999.97 kg/m³ at 3.98 °C; 999.84 at 0 °C | open, ice-like patches grow on cooling |
| *Volume* · the solid floats | solid sinks in its melt | ice is 8.3 % lighter | 916.7 against 999.84 kg/m³ | four straight bonds build an open lattice |
| *Volume* · melting under pressure | pressure raises the melting point | pressure lowers it | −0.0074 K/bar, down to −22 °C at 2,100 bar | squeezing favours the denser liquid |
| *Thermodynamic* · boiling point | the trend of H₂S, H₂Se, H₂Te predicts about −80 °C | 100 °C | 180 K above the trend | four bonds per molecule to loosen |
| *Thermodynamic* · heat capacity | about 2 kJ/(kg·K), falling on cooling | 4.18 kJ/(kg·K), a shallow minimum near 35 °C, then rising | 4,182 at 25 °C; about 5,000 at −30 °C | heat goes into bending bonds; two structures trade places |
| *Thermodynamic* · compressibility | stiffer on cooling | stiffest at 46 °C, softer below | 4.41 against 5.09 × 10⁻¹⁰ Pa⁻¹ (46 °C, 0 °C) | open patches collapse under pressure |
| *Thermodynamic* · speed of sound | faster the colder | peaks at 74 °C | 1,402 m/s at 0 °C; 1,555 at 74 °C | density and compressibility both turn |
| *Dynamic* · viscosity under pressure | flows more slowly when squeezed | below about 33 °C flows more easily | about −8 % at 1,000 bar and 0 °C | pressure breaks the network that holds molecules back |
| *Dynamic* · fast protons | mobility set by size | H⁺ moves 5–7 times faster than Na⁺ | 36.2 against 5.2 × 10⁻⁸ m²/(V·s) | the charge hops along bonds |
| *Structural* · deep supercooling | supercools a little | clean droplets stay liquid to about −41 °C | homogeneous nucleation near 235 K | ice needs a nucleus; responses grow on the way |
| *Structural* · two glasses | a glass has one density | two amorphous ices, 0.94 and 1.17 g/cm³ | sharp transition between them | glassy forms of two liquid structures |
| *Isotopic* · heavy water | isotopes barely matter | D₂O melts at 3.82 °C, densest at 11.2 °C, 23 % more viscous | boils at 101.42 °C | nuclear quantum effects |

Others in the catalogue — the highest surface tension of ordinary liquids (72.8 mN/m), the dielectric constant of 78, the high thermal conductivity — are covered on their own pages, and the whole set can be plotted at once in [the anomalies lab](#/tools/anomalies).

### The five families
- **Volume**: the density maximum, the floating solid and the falling melting line are all one geometric fact, the open ice lattice. [[density-and-expansion-anomalies]].
- **Thermodynamic**: heat capacity, compressibility and expansion are the *response functions*, and in water they all grow on cooling. [[heat-capacity-and-compressibility-anomalies]].
- **Dynamic**: pressure speeds water up and temperature slows it faster than an Arrhenius law allows. [[viscosity-and-diffusion-under-pressure]].
- **Structural**: supercooling and the two glasses of ice point at a hidden second liquid. [[supercooled-water-and-no-mans-land]], [[polyamorphism-of-ice]].
- **Isotopic**: the heavier hydrogen changes bulk properties that a molecule's mass alone cannot explain. [[quantum-effects-in-water]].

### One cause, or seventy?
The right answer is: one cause with many gauges. The "Why" column keeps saying the same thing in different words — a network of bonds that is strong enough to make an open structure and weak enough to be traded for a compact one with a small change of temperature or pressure ([[what-a-hydrogen-bond-is]]). Whether that trade is a smooth crossover or a hidden phase transition between two liquids is the open question of the rest of this branch. Not every anomaly is equally secure: the Mpemba effect, hot water sometimes freezing before cold, is still argued about ([[the-mpemba-effect]]).

> [!key] Water is a "normal liquid" at almost nothing: its density, heat capacity, compressibility and viscosity all turn the wrong way in the same band of temperatures. The seventy-odd anomalies are one fact seen through many instruments — a bond that lets the liquid shift between an open and a compact structure at an energy cost of a few kilojoules per mole.`,
  ideas: [`An anomaly is a reversal of an ordinary trend (a density maximum, a compressibility that rises on cooling) or an extreme value (the boiling point, the surface tension).`, `The catalogue has more than seventy entries, but many are the same fact seen through different instruments.`, `The thermodynamic response functions — heat capacity, compressibility, expansion — all grow on cooling in water, the opposite of a normal liquid.`, `Almost every entry in the "Why" column comes back to a hydrogen-bonded network that can trade an open structure for a compact one.`],
  pitfalls: [`"Water is anomalous because the molecule is small" — Methane and ammonia are as small and behave normally. The oddities come from the four-fold hydrogen-bond network, not from size.`, `"Anomalous means the laws of physics fail" — Every anomaly is consistent with ordinary thermodynamics; the surprise is the sign or size of a property, not a violation.`, `"Seventy anomalies means seventy mysteries" — Many entries are one fact in two guises, and the whole list reduces to a few causes.`],
  terms: [
    { term: `Water anomaly`, also: [`anomalous property`, `anomaly of water`], def: `A property of water whose trend with temperature or pressure runs opposite to that of ordinary liquids, or whose value lies far outside the range expected for a molecule of its size. More than seventy are catalogued.` },
    { term: `Normal liquid`, also: [`simple liquid`, `ordinary liquid`], def: `A liquid whose molecules attract each other without forming directional networks, such as argon or benzene: it contracts on cooling, stiffens, thickens and freezes into a denser solid.` },
    { term: `Response function`, also: [`thermodynamic susceptibility`, `thermodynamic response`], def: `A derivative that says how a system responds to a push: the heat capacity (to a change of temperature), the compressibility (to a change of pressure) and the expansion coefficient (volume to temperature). They measure fluctuations of the liquid.` },
    { term: `Reversal`, also: [`turning point`, `extremum`], def: `The place where a property that has been rising starts to fall, or the reverse: the density at 3.98 °C, the heat capacity at about 35 °C, the compressibility at about 46 °C, the speed of sound at about 74 °C.` }
  ],
  formulas: [
    { name: `Departure from the normal-liquid expectation`, expr: `d = (Pw - Pn)/Pn`, tex: `\\delta = \\frac{P_w - P_n}{P_n}`,
      vars: { d: { name: `departure`, q: `ratio`, unit: `%`, tex: `\\delta`, signed: true, hint: `Positive when water is above the normal-liquid expectation.` }, Pw: { name: `value for water`, value: 5.09, tex: `P_w`, hint: `Any property in any units; here the compressibility at 0 °C, 5.09 × 10⁻¹⁰ Pa⁻¹.` }, Pn: { name: `value a normal liquid would have`, value: 3.9, tex: `P_n`, hint: `The hot liquid's trend carried on in a straight line to this temperature; 3.9 for the compressibility at 0 °C.` } },
      solveFor: `d`, note: `A crude yardstick: the expectation is a straight-line extrapolation of the 60–100 °C behaviour, not a theory.`,
      stories: { d: `Water's compressibility at 0 °C is {Pw} (in units of 10⁻¹⁰ Pa⁻¹). A normal liquid following the hot trend would give {Pn}. By how much does water exceed it?`, Pn: `Water has {Pw} where the normal expectation is lower by {d}. What is the expected value?` } }
  ],
  examples: [
    { title: `How far off is the compressibility at 0 °C?`, q: `Between 60 and 100 °C the isothermal compressibility of water rises from 4.44 to 4.80 × 10⁻¹⁰ Pa⁻¹, as it does in most liquids. Carry that straight line down to 0 °C and compare with the measured 5.09.`,
      steps: [`Slope: $(4.80 - 4.44)/40 = 0.009$ per kelvin, in units of $10^{-10}$ Pa⁻¹.`, `At 0 °C the line gives $4.44 - 60 \\times 0.009 = 3.90$.`, { text: `Departure from that expectation:`, tex: `\\delta = \\frac{5.09 - 3.90}{3.90} \\approx +30\\,\\%` }],
      a: `Water is about 30 % more compressible at 0 °C than a normal liquid would be, and the gap widens below 0 °C.` },
    { title: `The boiling point anomaly in kelvin`, q: `The boiling points of H₂S, H₂Se and H₂Te are −60, −41 and −2 °C. Extrapolating the trend to the lightest member gives about −80 °C. How far above the trend is water's 100 °C?`,
      steps: [`The three points fall on a line that continues downwards with the lighter atom.`, `Predicted for H₂O: about −80 °C. Measured: +100 °C.`, `Difference: $100 - (-80) = 180$ K.`],
      a: `180 K — the largest "extreme" in the table, and the one that makes liquid water on Earth possible at all.` }
  ],
  quiz: [
    { q: `Which of these properties of water is perfectly ordinary?`, choices: [`its density maximum at 3.98 °C`, `its viscosity at room temperature, 0.89 mPa·s`, `its heat capacity on supercooling`, `its compressibility minimum at 46 °C`], a: 1, why: `The viscosity at 25 °C sits among those of acetone (0.31), benzene (0.60) and ethanol (1.07). It is only under pressure and on deep cooling that water's flow becomes odd.` },
    { q: `The catalogue of more than seventy anomalies lists seventy independent facts about water.`, a: false, why: `Many entries are one fact seen from two sides, and several are contested; a few causes explain most of the list.` },
    { q: `Below roughly 35–46 °C, which pair of water's properties both RISE on cooling, unlike a normal liquid?`, choices: [`density and viscosity`, `heat capacity and compressibility`, `surface tension and density`, `speed of sound and viscosity`], a: 1, why: `Both response functions have shallow minima (about 35 and 46 °C) and then grow as the liquid cools. The viscosity also rises on cooling, but so it does in every liquid.` },
    { q: `By how many kelvin is water's boiling point above the trend of its heavier hydrides?`, answer: 180, unit: `K`, why: `The trend predicts about −80 °C; water boils at +100 °C.` }
  ],
  applications: [`Reading any property table for water: when a number looks wrong at low temperatures, check whether it is one of the reversals before assuming an error.`, `Engineering: cooling loops, hydraulic systems and sonar all rely on one or more of these extremes (heat capacity, compressibility, speed of sound).`, `Climate and life: the floating ice, the high heat capacity and the liquid range are the anomalies that decide whether a planet has an ocean ([[the-strange-reason]]).`, `Research: the anomalies are the test set for every proposed model of water ([[why-simulations-struggle]]).`],
  history: `Eisenberg and Kauzmann gathered the then-known departures in 1969; Franks's multi-volume treatise (1972–82) widened the list; Martin Chaplin keeps an online catalogue at London South Bank University. The density maximum itself was measured by 1805, when Thomas Charles Hope showed in Edinburgh that water is densest near 4 °C.`,
  sources: [`Chaplin, M., "Water anomalies", in *Water Structure and Science* (online catalogue, London South Bank University).`, `Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 1 and 4.`, `Ball, *H₂O: A Biography of Water*, and "Water: an enduring mystery", *Nature* 452, 291 (2008).`, `Gallo et al., "Water: a tale of two liquids", *Chemical Reviews* 116, 7463 (2016).`],
  sim: `anom-property-vs-normal`
},

/* ================================================================ density and expansion */
{
  id: 'density-and-expansion-anomalies', parent: 'the-anomalies', title: 'Density and expansion anomalies', level: 2,
  short: `Water is densest at 3.98 °C and expands both above and below it; ice floats; squeezing ice melts it; heavy water peaks at 11.2 °C. One idea explains them all: the liquid is a mixture of open, ice-like patches and collapsed ones, and the mixture shifts with temperature.`,
  keywords: ['density maximum', 'negative thermal expansion', 'two-state model', 'mixture model', 'Röntgen', 'melting line', 'temperature of maximum density', 'TMD', 'D2O density', 'open structure', 'seawater density'],
  prereq: ['why-ice-floats', 'the-list-of-anomalies', 'the-tetrahedral-network'],
  related: ['the-density-maximum', 'lakes-freeze-from-the-top', 'isotopes-and-heavy-water', 'two-liquids-in-one', 'the-salt-of-the-sea', 'physics:thermal-expansion', 'chemistry:phase-diagrams'],
  body: `
Fill a thermometer-sized tube with water at 10 °C and put it in a cold bath. The column falls, as it should, until about 4 °C. Then it stops, turns, and rises as the water cools to 0 °C. Between 0 and 3.98 °C the liquid shrinks when warmed — a negative coefficient of thermal expansion — and at 3.98 °C the density passes through its maximum, 999.97 kg/m³.

### The numbers
| Temperature | Density, kg/m³ | Expansion coefficient |
|---|---|---|
| 0 °C | 999.84 | −68 × 10⁻⁶ /K |
| 2 °C | 999.94 | −33 × 10⁻⁶ /K |
| 3.98 °C | 999.97 | 0 |
| 10 °C | 999.70 | +88 × 10⁻⁶ /K |
| 20 °C | 998.20 | +207 × 10⁻⁶ /K |
| 100 °C | 958.36 | +750 × 10⁻⁶ /K |

The effect is tiny — a hundredth of one per cent between 0 and 4 °C — but it is what decides which part of a lake freezes first ([[lakes-freeze-from-the-top]]).

### Four faces of one fact
- **The solid floats.** Ice Ih is 8.3 % less dense than the liquid at 0 °C ([[why-ice-floats]]). The density maximum is the liquid's own, smaller version of the same open-lattice effect.
- **The melting line leans backwards.** Because the liquid is denser than ice, pressure favours melting: the Clausius–Clapeyron slope is −0.0074 K per bar, so the melting point of ice falls to −22 °C at 2,100 bar before ice III takes over. (To lower it by even one kelvin takes 135 bar.)
- **The maximum moves with pressure.** A thermodynamic identity links the way expansion changes with pressure to the way compressibility changes with temperature; fed with the tabulated values it gives about −0.2 K per megapascal, so the maximum reaches 0 °C at only about 20 MPa (200 atmospheres) and is at −16 °C near 100 MPa.
- **Heavy water peaks later.** D₂O is densest at 11.2 °C (1,105.3 kg/m³) and freezes at 3.82 °C. Its whole curve is, to within a tenth of one per cent, light water's shifted about 7 K warmer — heavy water behaves like cooler light water ([[quantum-effects-in-water]]).

Salt shifts the maximum the other way: it falls with salinity, and for sea water of salinity above about 24.7 g/kg it has gone below the freezing point. Open-ocean sea water therefore never shows a density maximum; it simply grows denser all the way to −1.9 °C ([[the-salt-of-the-sea]]).

### The two-structure picture
Wilhelm Röntgen proposed in 1892 that liquid water is a mixture of two kinds of molecule: some in **ice-like** arrangements (bulky, bonded in open tetrahedra) and some in compact ones. Raise the temperature and the open kind turns into the compact kind, which *shrinks* the liquid; at the same time every molecule vibrates harder and pushes its neighbours apart, which *expands* it. Below 3.98 °C the first effect wins; above it the second does. The simulation fits exactly this mixture to the tabulated density: four numbers reproduce the whole curve from −30 to 100 °C to better than 0.3 %, put the maximum at 3.98 °C, and say that about 18 % of the molecules are in the open state at 0 °C and 9 % at 20 °C. Refit to heavy water and the crossover temperature and the enthalpy both rise, as a stronger bond would demand.

That is a **model**. Nobody sees two species in a snapshot; local environments in water form a continuum, and the fitted shares are labels on its two ends. The same maximum appears in other liquids whose atoms bond into tetrahedral networks — molten silica, and simulations of supercooled silicon — which supports the idea that the open network, not the water molecule itself, is what matters. Whether the two ends are really two liquids is the subject of [[two-liquids-in-one]].

> [!key] Water is densest at 3.98 °C because the open, ice-like structure grows as the liquid cools, outpacing ordinary shrinkage. The same open lattice makes ice float, makes pressure melt it, and shifts the maximum to 11.2 °C in heavy water.`,
  ideas: [`Between 0 and 3.98 °C water shrinks on warming; the density peaks at 999.97 kg/m³.`, `The floating of ice, the backward-leaning melting line and the density maximum are consequences of the same open tetrahedral structure.`, `Pressure lowers the temperature of maximum density by about 0.2 K per MPa; salt lowers it too, until it vanishes above a salinity of about 24.7.`, `A mixture of open (ice-like) and compact molecules, with the open share falling on warming, reproduces the whole curve — as a model, not a measurement.`],
  pitfalls: [`"Water expands below 4 °C because its molecules move apart" — The molecules do not move apart; they rearrange into more open local patterns, and this arrangement change is what raises the volume.`, `"Ice floats because of the density maximum" — The two are related but separate: the maximum is a property of the liquid; floating compares liquid with solid.`, `"The maximum is always at 4 °C" — It is at 3.98 °C only at one atmosphere, falls with pressure and with salt, and is at 11.2 °C in D₂O.`],
  terms: [
    { term: `Temperature of maximum density`, also: [`TMD`, `density maximum`], def: `The temperature at which a liquid is densest at a given pressure: 3.98 °C for water at 1 atm (999.97 kg/m³), 11.2 °C for D₂O.` },
    { term: `Thermal expansion coefficient`, also: [`volumetric expansion coefficient`, `α`], def: `The fractional change of volume per kelvin, $\\alpha = \\frac{1}{V}\\left(\\frac{\\partial V}{\\partial T}\\right)_p$. Negative for water between 0 and 3.98 °C; +207 × 10⁻⁶ /K at 20 °C.` },
    { term: `Negative thermal expansion`, also: [`contraction on heating`], def: `The shrinking of a material when it is warmed. Rare in liquids; in water it occurs below 3.98 °C and for a few ceramics and tetrahedral liquids.` },
    { term: `Two-state model`, also: [`two-structure model`, `mixture model`, `Röntgen's model`], def: `A description of water as a mixture of an open, low-density arrangement and a compact, high-density one whose proportions shift with temperature and pressure. Useful as a fit and as an idea; not a claim that two species can be separated.` },
    { term: `Clapeyron slope`, also: [`slope of the melting line`, `dT/dp`], def: `The slope of a coexistence line in the temperature–pressure plane, $dT/dp = T\\,\\Delta v/L$. For ice melting it is negative because the liquid is denser: −0.0074 K per bar.` }
  ],
  formulas: [
    { name: `Average expansion coefficient between two temperatures`, expr: `alpha = -(rho2 - rho1)/(rhom*(T2 - T1))`, tex: `\\alpha = -\\frac{\\rho_2 - \\rho_1}{\\rho_m\\,(T_2 - T_1)}`,
      vars: { alpha: { name: `expansion coefficient`, q: `expansion`, unit: `ppm/K`, tex: `\\alpha`, signed: true, hint: `Negative when the liquid grows denser on warming.` }, rho1: { name: `density at T1`, q: `density`, unit: `kg/m³`, value: 999.84, tex: `\\rho_1` }, rho2: { name: `density at T2`, q: `density`, unit: `kg/m³`, value: 999.97, tex: `\\rho_2` }, rhom: { name: `mean density`, q: `density`, unit: `kg/m³`, value: 999.9, tex: `\\rho_m` }, T1: { name: `lower temperature`, q: `temperature`, unit: `°C`, value: 0, tex: `T_1`, min: -30, max: 120 }, T2: { name: `upper temperature`, q: `temperature`, unit: `°C`, value: 4, tex: `T_2`, min: -30, max: 120 } },
      solveFor: `alpha`, note: `Valid for small intervals. Between 0 and 4 °C the average is −32 ppm/K, passing through zero at 3.98 °C.`,
      stories: { alpha: `Water has a density of {rho1} at {T1} and {rho2} at {T2}. What is the average expansion coefficient?`, rho2: `At {T2} the average expansion coefficient since {T1} is {alpha}, where the density was {rho1}. What is the density at {T2}?` } },
    { name: `Density of the two-structure mixture`, expr: `rho = 1/(x/rhoO + (1 - x)/rhoD)`, tex: `\\rho = \\frac{1}{\\dfrac{x}{\\rho_O} + \\dfrac{1-x}{\\rho_D}}`,
      vars: { rho: { name: `density of the liquid`, q: `density`, unit: `kg/m³`, tex: `\\rho` }, x: { name: `open (ice-like) share`, q: `ratio`, unit: `%`, value: 18, min: 0, max: 100, hint: `About 18 % at 0 °C and 9 % at 20 °C in the fit made on this page; a model value.` }, rhoO: { name: `density of the open state`, q: `density`, unit: `kg/m³`, value: 916.7, tex: `\\rho_O`, hint: `Taken as that of ice Ih at 0 °C.` }, rhoD: { name: `density of the dense state`, q: `density`, unit: `kg/m³`, value: 1020, tex: `\\rho_D`, hint: `The fitted value at 0 °C: 0.980 cm³/g.` } },
      solveFor: `rho`, note: `Volumes add, not densities, so the mixture rule is for specific volume, 1/ρ.`,
      stories: { rho: `A liquid is {x} open-state molecules, of density {rhoO}, and the rest dense-state, of density {rhoD}. What is its density?`, x: `A water-like liquid has density {rho}; the open state has {rhoO} and the dense state {rhoD}. What share is open?` } },
    { name: `Slope of the melting line`, expr: `k = T*(1/rhoL - 1/rhoI)/L`, tex: `s_m = \\frac{T}{L}\\left(\\frac{1}{\\rho_L} - \\frac{1}{\\rho_I}\\right)`,
      vars: { k: { name: `slope of the melting line, dT/dp`, unit: `K/Pa`, tex: `s_m`, signed: true, hint: `Negative: pressure lowers the melting point. −7.4 × 10⁻⁸ K/Pa is −0.0074 K per bar.` }, T: { name: `melting temperature`, q: `temperature`, unit: `°C`, value: 0, min: -30, max: 10 }, rhoL: { name: `density of the liquid`, q: `density`, unit: `kg/m³`, value: 999.84, tex: `\\rho_L` }, rhoI: { name: `density of the ice`, q: `density`, unit: `kg/m³`, value: 916.7, tex: `\\rho_I` }, L: { name: `latent heat of fusion`, q: `latent`, unit: `kJ/kg`, value: 333.55 } },
      solveFor: `k`, note: `The Clausius–Clapeyron relation for melting; it gives the backwards slope of ice Ih, and a forward one for almost every other solid.`,
      stories: { k: `Ice at {T} has density {rhoI}, the liquid {rhoL}, and the latent heat is {L}. What is the slope of the melting line?` } }
  ],
  examples: [
    { title: `How open is water at 0 °C?`, q: `Use the two-structure mixture with an open state of density 916.7 kg/m³ and a dense state of 1,020 kg/m³. What open share gives the measured 999.84 kg/m³ at 0 °C?`,
      steps: [`Work with volumes per kilogram: open $1/916.7 = 1.09087$ L/kg, dense $1/1020 = 0.98039$ L/kg, liquid $1/999.84 = 1.00016$ L/kg.`, { text: `The liquid sits between the two in proportion to the open share:`, tex: `x = \\frac{1.00016 - 0.98039}{1.09087 - 0.98039} = \\frac{0.01977}{0.11048} \\approx 0.18` }],
      a: `About 18 % open — in this model. The share falls to roughly 9 % at 20 °C, which is why warm water is a little denser than a naive count of ice would suggest.` },
    { title: `Why skating is not simply pressure melting`, q: `A skater of 70 kg stands on a blade 3 mm wide and 20 cm long. How far does the pressure lower the melting point of ice, using the slope −0.0074 K per bar?`,
      steps: [`Area: $0.003 \\times 0.2 = 6 \\times 10^{-4}$ m². Weight: $70 \\times 9.81 = 687$ N.`, `Pressure: $687/6\\times10^{-4} = 1.1$ MPa, about 11 bar.`, `Lowering: $11 \\times 0.0074 \\approx 0.08$ K.`],
      a: `Only about 0.08 K. Pressure melting alone cannot make ice slippery at −5 °C; see [[why-ice-is-slippery]].` }
  ],
  quiz: [
    { q: `Water at 2 °C is warmed to 3 °C in a closed flask. Its volume`, choices: [`increases, as for any liquid`, `decreases`, `stays the same`, `first increases and then decreases`], a: 1, why: `Below 3.98 °C the expansion coefficient is negative: the liquid shrinks on warming, which is the whole content of the density maximum.` },
    { q: `Heavy water is densest at 11.2 °C. This suggests that, compared with H₂O, D₂O`, choices: [`has weaker hydrogen bonds`, `has effectively stronger or stiffer hydrogen bonds`, `has no hydrogen bonds`, `has a lower molecular mass`], a: 1, why: `The curve is light water's shifted warmer by about 7 K: D₂O's structure persists to a higher temperature, as it would with stronger bonds. Its molecular mass is, of course, higher.` },
    { q: `The temperature of maximum density is 3.98 °C at every pressure.`, a: false, why: `Pressure lowers it by about 0.2 K per MPa, so it reaches 0 °C near 20 MPa; salt lowers it as well.` },
    { q: `Sea water of salinity 35 cools from 20 °C towards its freezing point of −1.9 °C. Its density`, choices: [`peaks near 4 °C and then falls`, `increases all the way down`, `stays constant`, `peaks at 0 °C`], a: 1, why: `For salinities above about 24.7 the density maximum lies below the freezing point, so ocean water just keeps getting denser as it cools.` },
    { q: `By how many kelvin does a pressure of 100 bar lower the melting point of ice Ih?`, answer: 0.74, unit: `K`, why: `The slope is −0.0074 K per bar, so 100 bar lowers it by 0.74 K.` }
  ],
  applications: [`Lakes: the 4 °C layer sinks, so a frozen pond keeps a warm, dense layer on the bottom all winter, and fish survive ([[lakes-freeze-from-the-top]]).`, `Ocean circulation: because cold sea water does not turn lighter, polar surface water keeps sinking and drives the deep currents ([[ocean-currents]]).`, `Heating and cooling circuits: a closed water system near 4 °C has almost no thermal expansion, which complicates sizing of expansion vessels on cold-water lines.`, `Climate models: the thermal expansion of the sea is a main source of sea-level rise, and its pressure and temperature dependence is built on these coefficients ([[thermal-expansion-of-the-sea]]).`],
  history: `Jean-André De Luc noticed in 1772 that water stops contracting a few degrees above freezing; Thomas Charles Hope's Edinburgh trough experiment of 1805 pinned the maximum near 4 °C. Röntgen suggested the mixture idea in 1892. Kell's 1975 tables and the later IAPWS formulations fixed the maximum at 3.98 °C.`,
  sources: [`USGS Water Science School, "Water density" (the density table; source 3 of this app).`, `Kell, G. S., "Density, thermal expansivity, and compressibility of liquid water from 0° to 150°C", *J. Chem. Eng. Data* 20, 97 (1975).`, `Röntgen, W. C., "Über die Constitution des flüssigen Wassers", *Annalen der Physik* 45, 91 (1892).`, `Debenedetti, "Supercooled and glassy water", *J. Phys.: Condens. Matter* 15, R1669 (2003).`],
  sim: `anom-two-state-density`
},

/* ================================================================ heat capacity and compressibility */
{
  id: 'heat-capacity-and-compressibility-anomalies', parent: 'the-anomalies', title: 'Heat capacity and compressibility anomalies', level: 3,
  short: `Water's heat capacity has a shallow minimum near 35 °C and its compressibility one near 46 °C; below those points both grow, and on supercooling they seem to head for infinity near 228 K (−45 °C). They measure fluctuations, and in water the fluctuations of entropy and volume lock together.`,
  keywords: ['heat capacity minimum', 'compressibility minimum', 'Speedy Angell', 'singular temperature', '228 K', 'power law', 'divergence', 'fluctuations', 'structure factor', 'response functions', 'stability limit', 'supercooled water'],
  prereq: ['specific-heat-of-water', 'density-and-expansion-anomalies', 'the-list-of-anomalies'],
  related: ['why-the-heat-capacity-is-so-high', 'supercooled-water-and-no-mans-land', 'two-liquids-in-one', 'speed-of-sound-in-water', 'incompressibility-and-water-hammer', 'chemistry:entropy', 'physics:specific-heat'],
  body: `
Two numbers describe how a liquid responds to being pushed: its **heat capacity** (heat in, temperature up) and its **compressibility** (pressure up, volume down). In most liquids both are dull. In water they behave like this:

| Temperature | Heat capacity, J/(kg·K) | Compressibility, 10⁻¹⁰ Pa⁻¹ |
|---|---|---|
| −30 °C (supercooled) | about 5,050 | about 9.5 |
| −10 °C | 4,320 | 5.85 |
| 0 °C | 4,217 | 5.09 |
| 20 °C | 4,182 | 4.59 |
| 35 °C | **4,178** (minimum) | 4.45 |
| 46 °C | 4,180 | **4.41** (minimum) |
| 100 °C | 4,216 | 4.80 |

The minima are shallow — a tenth or two of one per cent. What matters is the shape: *in a normal liquid, cooling makes both functions smaller; in water, below about 40 °C, cooling makes them larger*, slowly at first and then steeply below 0 °C. The speed of sound, which depends on the stiffness, peaks at 74 °C for the same reason ([[speed-of-sound-in-water]]).

### Fluctuations behind the numbers
Statistical mechanics says that a response function is a fluctuation in disguise. The heat capacity is the size of the spontaneous fluctuations of *entropy*, the compressibility the size of the fluctuations of *volume*, and the expansion coefficient is the correlation between the two. In a normal liquid a region that happens to be big is also loose and disordered, so volume and entropy fluctuations go together and the expansion is positive. In water the big (open) regions are also the *ordered* ones: bulky and low in entropy. The correlation turns negative, and the expansion coefficient changes sign at 3.98 °C. As the liquid cools, the competing open and compact regions grow in size and number, and all three functions swell together.

The compressibility has a direct experimental meaning: the intensity of X-rays scattered at zero angle is $S(0) = n k_B T \\kappa_T$, the density times thermal energy times compressibility. With the tabulated values this is 0.062 at 25 °C, 0.064 at 0 °C and 0.105 at −30 °C. A rising $S(0)$ means growing density fluctuations, and it is what X-ray laser experiments on supercooled droplets measure.

### The apparent divergence
In 1976 Robin Speedy and Austen Angell fitted the compressibility of supercooled water, and other properties, to a power law
$$X(T) \\propto \\left(\\frac{T}{T_s} - 1\\right)^{-\\gamma}, \\qquad T_s \\approx 228\\ \\text{K} \\ (-45\\ ^\\circ\\text{C}),$$
which grows without limit as $T$ falls to $T_s$. Fitted to the tabulated values from −30 °C upward, the heat capacity gives an exponent near 1.7 and the compressibility near 1.2 (Speedy and Angell's own exponents depend on the property and the data used). Four things keep this from being a proof:
1. **Nobody has reached it.** Ice nucleates near 235 K, and the lowest temperature at which these functions have been measured in bulk liquid is a few kelvin above that.
2. **The data cannot tell a divergence from a peak.** The simulation fits the same points with a finite maximum at 229 K; they agree above 243 K and differ wildly below.
3. **Three scenarios** account for a power law: a true singularity at the limit of stability (Speedy, 1982), a liquid–liquid critical point whose ridge of maxima, the Widom line, would be crossed ([[two-liquids-in-one]]), or a smooth, singularity-free rise (Sastry, Debenedetti, Sciortino and Stanley, 1996).
4. **Newer experiments favour a maximum.** X-ray scattering from micrometre droplets cooled below −38 °C found $S(0)$ and the correlation length peaking near 229 K at atmospheric pressure (Kim and colleagues, 2017) — a maximum, not a divergence, and where the Widom line would lie.

One more consequence: the difference of the heat capacities at constant pressure and at constant volume is $c_p - c_v = T\\alpha^2/(\\rho\\kappa_T)$. It is 44 J/(kg·K) at 25 °C and vanishes at 3.98 °C, where $\\alpha = 0$: at the density maximum water has a single heat capacity.

> [!key] Cooling water makes its heat capacity and compressibility grow, the reverse of a normal liquid, because entropy and volume fluctuate together in an ordered-and-open versus disordered-and-compact competition. Extrapolations hint at a singularity near −45 °C, but ice forms before it can be reached, and the newest data show a peak instead.`,
  ideas: [`Heat capacity has a shallow minimum near 35 °C and compressibility near 46 °C; both rise on further cooling and sharply below 0 °C.`, `Response functions are fluctuations: heat capacity measures entropy fluctuations, compressibility volume fluctuations, expansion their correlation.`, `In water, open regions are bulky *and* ordered, so volume and entropy fluctuations anti-correlate below 3.98 °C and the expansion is negative.`, `Fits to a power law with Ts near 228 K describe the data, but the singularity itself has never been reached, and recent X-ray data show a peak rather than a divergence.`],
  pitfalls: [`"The heat capacity of water diverges at −45 °C" — It has never been measured to do so; the divergence is an extrapolation, and the best recent data show finite maxima near −44 °C.`, `"Water's heat capacity is high because it is so compressible" — Different functions: the heat capacity measures entropy fluctuations, the compressibility volume fluctuations; they grow together in water but are not each other's cause.`, `"The minimum means water is least responsive at 35 °C" — The shallow minimum is a tenth of one per cent below the 0 °C value; at 35 °C water is as dull as a normal liquid.`],
  terms: [
    { term: `Isothermal compressibility`, also: [`κT`, `compressibility`], def: `The fractional decrease of volume per unit rise of pressure at constant temperature, $\\kappa_T = -\\frac{1}{V}\\left(\\frac{\\partial V}{\\partial p}\\right)_T$: 4.52 × 10⁻¹⁰ Pa⁻¹ for water at 25 °C, with a minimum near 46 °C.` },
    { term: `Structure factor at zero angle`, also: [`S(0)`, `density fluctuations`], def: `The intensity of radiation scattered in the forward direction, which equals the density times thermal energy times compressibility, $S(0) = n k_B T \\kappa_T$. It measures how much the density fluctuates from place to place.` },
    { term: `Singular temperature`, also: [`Ts`, `Speedy–Angell temperature`], def: `The temperature, about 228 K (−45 °C) for water at 1 atm, at which a power-law fit to the supercooled response functions would diverge. It is an extrapolation, below the reach of experiments on the bulk liquid.` },
    { term: `Power-law divergence`, also: [`critical divergence`, `(T/Ts − 1)^−γ`], def: `Growth of a quantity as a negative power of the distance from a special temperature, $X \\propto (T/T_s - 1)^{-\\gamma}$, typical of a critical point. The exponent γ is about 1.2 for the compressibility of water in the fit made on this page.` },
    { term: `Stability-limit conjecture`, also: [`Speedy's conjecture`], def: `Speedy's 1982 proposal that the superheated-liquid limit and the supercooled anomalies are branches of one spinodal line; the divergence at 228 K would be the point where that line is met. Experiment and simulation have not supported it.` }
  ],
  formulas: [
    { name: `Power-law growth of the heat capacity`, expr: `cp = c0 + A*(T/Ts - 1)^(-g)`, tex: `c_p = c_0 + A\\left(\\frac{T}{T_s} - 1\\right)^{-\\gamma}`,
      vars: { cp: { name: `heat capacity`, q: `specificheat`, unit: `J/(kg·K)`, tex: `c_p` }, c0: { name: `regular part`, q: `specificheat`, unit: `J/(kg·K)`, value: 4089, tex: `c_0`, hint: `The part that does not diverge; 4,089 J/(kg·K) in a fit to the tabulated data from −30 to 40 °C.` }, A: { name: `amplitude`, q: `specificheat`, unit: `J/(kg·K)`, value: 10.7, hint: `Fitted to the same data.` }, T: { name: `temperature`, q: `temperature`, unit: `°C`, value: -30, min: -44, max: 100 }, Ts: { name: `singular temperature`, q: `temperature`, unit: `K`, value: 228, tex: `T_s`, min: 150, max: 235 }, g: { name: `exponent`, value: 1.69, tex: `\\gamma`, min: 0.1, max: 4, hint: `Fitted: about 1.7 for the heat capacity, about 1.2 for the compressibility.` } },
      solveFor: `cp`, note: `An extrapolation formula: valid only above Ts, and never confirmed by direct measurement at the temperatures where it becomes large.`,
      stories: { cp: `Water's heat capacity is c0 = {c0} plus a divergent part with amplitude {A}, exponent {g} and singular temperature {Ts}. What is it at {T}?`, T: `At what temperature does the model give a heat capacity of {cp}?` } },
    { name: `Zero-angle structure factor`, expr: `S0 = n*kB*T*kappa`, tex: `S_0 = n\\,k_B\\,T\\,\\kappa_T`,
      vars: { S0: { name: `S(0)`, tex: `S_0`, hint: `The dimensionless forward-scattering intensity per molecule; 0.062 for water at 25 °C.` }, n: { name: `number density`, q: `numberdensity`, unit: `1/cm³`, value: 3.33e22, hint: `3.33 × 10²² molecules per cm³ at 25 °C.` }, kB: { const: `kB` }, T: { name: `temperature`, q: `temperature`, unit: `°C`, value: 25, min: -40, max: 100 }, kappa: { name: `isothermal compressibility`, unit: `1/Pa`, value: 4.52e-10, tex: `\\kappa_T`, hint: `In SI: 4.52 × 10⁻¹⁰ Pa⁻¹ for water at 25 °C.` } },
      solveFor: `S0`, note: `The compressibility equation; it turns a compressibility into a scattering intensity, and back.`,
      stories: { S0: `Water at {T} has {n} and a compressibility of {kappa}. What is S(0)?`, kappa: `An X-ray experiment at {T} finds S(0) = {S0} in a liquid of {n}. What is its compressibility?` } },
    { name: `Heat capacities at constant pressure and constant volume`, expr: `dc = T*alpha^2/(rho*kappa)`, tex: `\\Delta c = \\frac{T\\,\\alpha^2}{\\rho\\,\\kappa_T}`,
      vars: { dc: { name: `difference cp − cv`, q: `specificheat`, unit: `J/(kg·K)`, tex: `\\Delta c` }, T: { name: `temperature`, q: `temperature`, unit: `°C`, value: 25, min: -30, max: 100 }, alpha: { name: `expansion coefficient`, q: `expansion`, unit: `ppm/K`, value: 257, tex: `\\alpha`, signed: true }, rho: { name: `density`, q: `density`, unit: `kg/m³`, value: 997, tex: `\\rho` }, kappa: { name: `isothermal compressibility`, unit: `1/Pa`, value: 4.52e-10, tex: `\\kappa_T` } },
      solveFor: `dc`, note: `A thermodynamic identity. It shows why water has one heat capacity at 3.98 °C, where the expansion vanishes.`,
      stories: { dc: `At {T} water has α = {alpha}, density {rho} and compressibility {kappa}. By how much does cp exceed cv?` } }
  ],
  examples: [
    { title: `How much does the power law say at −38 °C and at −44 °C?`, q: `Use c₀ = 4,089 J/(kg·K), A = 10.7 J/(kg·K), γ = 1.69 and Ts = 228 K to estimate the heat capacity of water at −30, −38 and −44 °C.`,
      steps: [`At −30 °C ($T = 243.15$ K): $x = 243.15/228 - 1 = 0.0664$ and $x^{-1.69} = 98$, so $c_p = 4089 + 10.7 \\times 98 \\approx 5{,}130$.`, `At −38 °C ($235.15$ K): $x = 0.0314$, $x^{-1.69} = 348$, so $c_p \\approx 7{,}800$.`, `At −44 °C ($229.15$ K): $x = 0.0050$, $x^{-1.69} = 7{,}630$, so $c_p \\approx 85{,}700$.`],
      a: `About 5,100, 7,800 and 85,700 J/(kg·K). The table says 5,050 at −30 °C; the other two are extrapolations below the data, and the last one is a prediction nobody can test because the water freezes first.` },
    { title: `Forward X-ray scattering from cold water`, q: `Compute $S(0)$ at 0 °C from the density 999.84 kg/m³ and the compressibility 5.09 × 10⁻¹⁰ Pa⁻¹.`,
      steps: [`Number density: $999.84 \\times 1000/18.015 \\times 6.022\\times10^{23} = 3.342\\times10^{28}$ m⁻³.`, { text: `Then`, tex: `S(0) = 3.342\\times10^{28} \\times 1.381\\times10^{-23} \\times 273.15 \\times 5.09\\times10^{-10} = 0.064` }],
      a: `$S(0) \\approx 0.064$ at 0 °C, rising to 0.105 at −30 °C on the tabulated compressibility: water becomes more and more "loose" in its density fluctuations as it is cooled.` }
  ],
  quiz: [
    { q: `Between 0 and 35 °C, as water warms, its specific heat capacity`, choices: [`rises steadily`, `falls slightly`, `is constant`, `falls to zero`], a: 1, why: `From 4,217 at 0 °C to a minimum of 4,178 at 35 °C: a decline of under 1 %, the opposite of the slow rise of a normal liquid.` },
    { q: `A direct measurement has shown the heat capacity of bulk liquid water diverging at 228 K.`, a: false, why: `Ice nucleates near 235 K, so the bulk liquid has never been held at 228 K long enough to measure; recent data on droplets show a maximum near 229 K instead.` },
    { q: `In a normal liquid the correlation between spontaneous fluctuations of volume and entropy is positive. In water below 3.98 °C it is`, choices: [`positive and larger`, `zero`, `negative`, `undefined`], a: 2, why: `The open (large-volume) regions are ordered (low entropy), so large volume goes with low entropy. That negative correlation is the negative expansion coefficient.` },
    { q: `At which temperature are cp and cv of water equal, at atmospheric pressure?`, answer: 3.98, unit: `°C`, why: `$c_p - c_v = T V\\alpha^2/\\kappa_T$ and α = 0 at the density maximum.` },
    { q: `Why can the divergence at 228 K not simply be measured?`, choices: [`The equipment is too expensive`, `Homogeneous ice nucleation occurs near 235 K, before the liquid gets there`, `Water becomes a gas`, `Water stops being polar`], a: 1, why: `Ice nucleates throughout a bulk sample faster than any instrument can read it, 7 K above Ts. That is why droplet and fast-X-ray experiments matter.` }
  ],
  applications: [`Thermal storage and cooling: the heat capacity's near-constancy above 0 °C is what lets a given volume of water be a reliable heat sink; the rise near freezing hardly matters in practice.`, `Sonar and acoustics: the speed of sound's maximum at 74 °C and its steady rise at ocean temperatures follow from the compressibility and density.`, `Cryo-biology: at −30 °C supercooled water holds a fifth more heat per kilogram than at 20 °C, a fact that enters models of ice formation in leaf cells.`, `Testing theories of water: every proposed model is required to reproduce these curves ([[why-simulations-struggle]]).`],
  history: `Angell and colleagues measured the heat capacity of supercooled water in emulsions through the 1970s and 1980s; Speedy and Angell's 1976 paper on the compressibility with a singular temperature of 228 K began the modern debate. Poole, Sciortino, Essmann and Stanley's 1992 simulations offered a critical point as the origin ([[two-liquids-in-one]]).`,
  sources: [`Speedy, R. J. and Angell, C. A., "Isothermal compressibility of supercooled water and evidence for a thermodynamic singularity at −45 °C", *J. Chem. Phys.* 65, 851 (1976).`, `Sastry, Debenedetti, Sciortino and Stanley, "Singularity-free interpretation of the thermodynamics of supercooled water", *Phys. Rev. E* 53, 6144 (1996).`, `Kim et al., "Maxima in the thermodynamic response and correlation functions of deeply supercooled water", *Science* 358, 1589 (2017).`, `Debenedetti, "Supercooled and glassy water", *J. Phys.: Condens. Matter* 15, R1669 (2003).`],
  sim: `anom-divergence`
},

/* ================================================================ viscosity and diffusion */
{
  id: 'viscosity-and-diffusion-under-pressure', parent: 'the-anomalies', title: 'Viscosity and diffusion under pressure', level: 2,
  short: `Squeeze a cold liquid and it should thicken. Water below about 33 °C does the opposite: moderate pressure makes it flow more easily and its molecules diffuse faster, because pressure breaks up the open bonded structure. And on cooling its viscosity climbs far faster than an Arrhenius law allows.`,
  keywords: ['viscosity under pressure', 'viscosity minimum', 'diffusion under pressure', 'Arrhenius', 'Vogel Fulcher Tammann', 'VFT', 'fragile liquid', 'Barus', 'Stokes-Einstein', 'self-diffusion', 'activation energy', 'deep sea water viscosity'],
  prereq: ['viscosity-of-water', 'density-and-expansion-anomalies', 'the-list-of-anomalies'],
  related: ['bonds-that-flicker', 'supercooled-water-and-no-mans-land', 'the-structure-of-liquid-water', 'physics:viscosity', 'hydraulics:viscosity-temperature', 'chemistry:arrhenius-equation', 'feynman:flow-of-wet-water'],
  body: `
Lubricating oil in a gear contact is squeezed to hundreds of megapascals and thickens enormously — a mineral oil at 1,000 atmospheres (100 MPa) is about seven times more viscous than at one. Almost every liquid behaves so: pressure pushes molecules closer, they get in each other's way, and flow slows. Cold water at 1,000 atmospheres flows 8 % *more* easily than at one. Two anomalies hide in the flow of water — its response to pressure and its response to cooling — and they have the same cause.

### Against temperature: not an Arrhenius liquid
In a simple liquid, viscosity follows an **Arrhenius law**, $\\eta = \\eta_0 e^{E_a/RT}$, with a fixed activation energy $E_a$. Water does not. Between 100 and 0 °C its viscosity rises from 0.284 to 1.78 mPa·s; a straight Arrhenius line through those two ends has $E_a = 15.5$ kJ/mol and misses the points between and beyond:

| Temperature | Viscosity, mPa·s | Arrhenius line through 0 and 100 °C | Effective activation energy |
|---|---|---|---|
| 100 °C | 0.284 | 0.284 | 11.7 kJ/mol |
| 25 °C | 0.891 | 1.00 | 16.9 kJ/mol |
| 0 °C | 1.78 | 1.78 | 20.5 kJ/mol |
| −30 °C | 6.6 | 4.1 | 28.3 kJ/mol |
| −40 °C | 12.6 | 5.7 | 32.6 kJ/mol |

The better description is a **Vogel–Fulcher–Tammann** curve, $\\eta = A\\,e^{B/(T - T_0)}$, with $A = 0.0294$ mPa·s, $B = 508$ K and $T_0 = 149$ K, which tracks the measurements from 100 °C down to about −30 °C. Differentiating gives the *effective* activation energy $E_a(T) = R B T^2/(T - T_0)^2$: 12 kJ/mol near boiling, about one hydrogen bond (17–20 kJ/mol) at room temperature, and 28 kJ/mol and rising at −30 °C. A liquid whose barrier to flow grows on cooling is called **fragile**: molecules must rearrange in larger and larger cooperative groups, which is what the growth of ordered, open regions would produce. The same curve, with the power-law form of Speedy and Angell, describes the diffusion of supercooled water.

### Against pressure: the dip
Pressure is an equal and opposite force on the same structure. Squeezing cold water pushes open, ice-like patches into compact ones ([[density-and-expansion-anomalies]]); in the two-structure fit the open share at 0 °C falls from 17 % at one atmosphere to 16 % at 1,000 bar. Fewer bonded cages means fewer places where a molecule is held, and the viscosity falls. Simulations point further: for a molecule to change hydrogen-bond partner it has to pass through a strained, five-coordinated arrangement, and squeezing makes that transition state easier to reach, so the rearrangements that set the flow come faster.

The pattern, as measured since Percy Bridgman's work in the 1920s, is:
- at **0 °C** the viscosity falls by about 8 % at 1,000 bar, reaches a minimum near that pressure, and crosses its one-atmosphere value near 2,000 bar before rising like any liquid;
- the dip becomes **shallower and moves to lower pressure** as the water warms: about 4 % at 10 °C and about 1 % at 20 °C in the local model of the simulation;
- by about **33 °C** it has gone: above that, viscosity only rises with pressure.

Self-diffusion follows: in supercooled water pressure first *raises* the diffusion coefficient before it falls at higher pressure (Prielmeier and colleagues' measurements to 300 MPa, 1987). Diffusion and viscosity are tied by the **Stokes–Einstein relation**, $D = k_B T/(6\\pi\\eta r)$, which works at room temperature in water with an effective radius of 1.07 Å (about 0.7 of a molecule's physical radius) and fails progressively on supercooling: diffusion drops less steeply than the viscosity rises, one more sign of the growing heterogeneity of the liquid.

At the bottom of the Mariana trench, 11 km down at about 1.1 kbar and 1–4 °C, sea water is roughly several per cent less viscous than at the surface — a small gift to the animals that live there.

> [!key] Cold water thins when squeezed and thickens faster than Arrhenius on cooling: pressure destroys, and cold builds, the open bonded structure that holds molecules back. The dip is 8 % at 1,000 bar and 0 °C and gone by about 33 °C.`,
  ideas: [`Viscosity of water is not Arrhenius: the effective activation energy rises from 12 kJ/mol at 100 °C to 28 kJ/mol at −30 °C.`, `Below about 33 °C a moderate pressure lowers the viscosity and raises diffusion; at 0 °C the viscosity is 8 % lower at 1,000 bar.`, `Pressure favours the compact structure, which has fewer cooperative bonded cages, and eases the five-coordinated transition state of partner exchange.`, `The Stokes–Einstein relation fails on supercooling: diffusion falls less than the viscosity rises.`],
  pitfalls: [`"Pressure always thickens a liquid" — That is Barus's law for ordinary liquids; cold water breaks it below about 33 °C.`, `"Water's viscosity at room temperature is anomalous" — At 0.89 mPa·s it is ordinary; the oddity is the steep climb in the cold and the response to pressure.`, `"A lower viscosity means weaker bonds" — The bond has not weakened; pressure rearranges the network and lowers the barrier for partner exchange.`],
  terms: [
    { term: `Arrhenius law`, also: [`Arrhenius behaviour`, `activation energy`], def: `A temperature law for rates and viscosities, $\\eta = \\eta_0 \\exp(E_a/RT)$, with a constant activation energy. A plot of ln η against 1/T is a straight line.` },
    { term: `Vogel–Fulcher–Tammann equation`, also: [`VFT`, `Vogel equation`], def: `An empirical law, $\\eta = A\\exp[B/(T - T_0)]$, for liquids whose barrier to flow grows on cooling. For water A = 0.0294 mPa·s, B = 508 K, T₀ = 149 K.` },
    { term: `Fragile liquid`, also: [`fragility`], def: `A liquid whose viscosity departs strongly from the Arrhenius law on cooling toward the glass transition, because the groups of molecules that have to move together grow. Water is fragile in the supercooled range.` },
    { term: `Barus law`, also: [`pressure–viscosity coefficient`], def: `The rule that viscosity grows exponentially with pressure, $\\eta = \\eta_0 \\exp(\\alpha p)$. Typical for mineral oils, about 2 × 10⁻⁸ Pa⁻¹. For water it fails below 33 °C, where α is negative.` },
    { term: `Stokes–Einstein relation`, also: [`Stokes–Einstein equation`], def: `$D = k_B T/(6\\pi\\eta r)$: the diffusion coefficient of a particle of radius r in a liquid of viscosity η. It ties diffusion and viscosity together and fails in supercooled water.` }
  ],
  formulas: [
    { name: `Arrhenius law for viscosity`, expr: `eta = eta0*exp(Ea/R*(1/T - 1/T0))`, tex: `\\eta = \\eta_0 \\exp\\left[\\frac{E_a}{R}\\left(\\frac{1}{T} - \\frac{1}{T_0}\\right)\\right]`,
      vars: { eta: { name: `viscosity`, q: `viscosity`, unit: `mPa·s`, tex: `\\eta` }, eta0: { name: `viscosity at the reference temperature`, q: `viscosity`, unit: `mPa·s`, value: 0.284, tex: `\\eta_0` }, Ea: { name: `activation energy`, q: `molarenergy`, unit: `kJ/mol`, value: 15.5, tex: `E_a`, hint: `15.5 kJ/mol fits water between 0 and 100 °C at the two ends only.` }, R: { const: `R` }, T: { name: `temperature`, q: `temperature`, unit: `°C`, value: 0, min: -40, max: 150 }, T0: { name: `reference temperature`, q: `temperature`, unit: `°C`, value: 100, tex: `T_0`, fixed: true } },
      solveFor: `eta`, note: `A straight line in ln η against 1/T. For water it fits two points and fails between and beyond them.`,
      stories: { eta: `A fluid has viscosity {eta0} at {T0}, and an activation energy of {Ea}. What is its Arrhenius viscosity at {T}?`, Ea: `Viscosity is {eta0} at {T0} and {eta} at {T}. What activation energy does a straight Arrhenius line give?` } },
    { name: `Vogel–Fulcher–Tammann viscosity of water`, expr: `eta = A*exp(B/(T - C))`, tex: `\\eta = A\\,\\exp\\left(\\frac{B}{T - T_0}\\right)`,
      vars: { eta: { name: `viscosity`, q: `viscosity`, unit: `mPa·s`, tex: `\\eta` }, A: { name: `pre-factor`, q: `viscosity`, unit: `mPa·s`, value: 0.02939 }, B: { name: `energy scale`, q: `dtemp`, unit: `K`, value: 507.88 }, T: { name: `temperature`, q: `temperature`, unit: `°C`, value: 0, min: -40, max: 150 }, C: { name: `Vogel temperature`, q: `temperature`, unit: `K`, value: 149.3, tex: `T_0`, hint: `The temperature at which the fitted viscosity would diverge; far below the glass transition of water in practice.` } },
      solveFor: `eta`, note: `Fits water from about −30 to 150 °C within a few per cent; the supercooled end is an extrapolation of measurements made in micro-droplets.`,
      stories: { eta: `With A = {A}, B = {B} and T0 = {C}, what is the viscosity of water at {T}?`, T: `At what temperature does the VFT curve give a viscosity of {eta}?` } },
    { name: `Effect of pressure on viscosity (Barus)`, expr: `eta = eta0*exp(alpha*p)`, tex: `\\eta = \\eta_0\\, e^{\\alpha p}`,
      vars: { eta: { name: `viscosity under pressure`, q: `viscosity`, unit: `mPa·s`, tex: `\\eta` }, eta0: { name: `viscosity at one atmosphere`, q: `viscosity`, unit: `mPa·s`, value: 30, tex: `\\eta_0` }, alpha: { name: `pressure–viscosity coefficient`, unit: `1/Pa`, value: 2.2e-8, tex: `\\alpha`, signed: true, hint: `About 2 × 10⁻⁸ Pa⁻¹ for a mineral oil; about +1 × 10⁻⁹ for water at 50 °C; negative for water below 33 °C.` }, p: { name: `pressure (gauge)`, q: `pressure`, unit: `MPa`, value: 100, min: 0, max: 400 } },
      solveFor: `eta`, note: `Good for ordinary liquids over a few hundred MPa. For cold water the coefficient is negative at first (−1.7 × 10⁻⁹ Pa⁻¹ at 0 °C in the local model of the simulation) and the law fails past the minimum.`,
      stories: { eta: `A mineral oil of {eta0} has a pressure–viscosity coefficient of {alpha}. What is its viscosity at {p}?`, alpha: `Squeezing a liquid of {eta0} to {p} raises its viscosity to {eta}. What is α?` } },
    { name: `Stokes–Einstein relation`, expr: `D = kB*T/(6*pi*eta*r)`, tex: `D = \\frac{k_B T}{6\\pi\\,\\eta\\, r}`,
      vars: { D: { name: `diffusion coefficient`, unit: `m²/s`, hint: `Self-diffusion of water: 2.3 × 10⁻⁹ m²/s at 25 °C.` }, kB: { const: `kB` }, T: { name: `temperature`, q: `temperature`, unit: `°C`, value: 25, min: -40, max: 150 }, eta: { name: `viscosity`, q: `viscosity`, unit: `mPa·s`, value: 0.891, tex: `\\eta` }, r: { name: `effective radius`, q: `length`, unit: `pm`, value: 107, hint: `107 pm reproduces the self-diffusion of water at 25 °C; a molecule's physical radius is about 140 pm.` } },
      solveFor: `D`, note: `Reasonable for water above room temperature, with an effective radius smaller than the molecule's; it fails in supercooled water.`,
      stories: { D: `In water of {eta} at {T}, a sphere of radius {r} diffuses by how much?`, r: `Water at {T} has viscosity {eta} and a self-diffusion coefficient of {D}. What effective radius does Stokes–Einstein give?` } }
  ],
  examples: [
    { title: `What does Arrhenius miss at −30 °C?`, q: `Compare the viscosity at −30 °C from the Arrhenius line through 0 and 100 °C (Ea = 15.5 kJ/mol, 0.284 mPa·s at 100 °C) with the VFT value.`,
      steps: [{ text: `Arrhenius, with $E_a/R = 1{,}865$ K:`, tex: `\\eta = 0.284\\, \\exp\\left[1865\\left(\\frac{1}{243.15} - \\frac{1}{373.15}\\right)\\right] = 0.284 \\times 14.5 = 4.1\\ \\mathrm{mPa\\,s}` }, { text: `VFT:`, tex: `\\eta = 0.02939\\, e^{507.88/(243.15 - 149.3)} = 0.02939 \\times 224 = 6.6\\ \\mathrm{mPa\\,s}` }],
      a: `Arrhenius gives 4.1 mPa·s, VFT gives 6.6 — and the measured viscosity of supercooled water at −30 °C is about 7: the Arrhenius line misses by 40 %.` },
    { title: `How thick does an oil get — and how thin does cold water get?`, q: `An oil of 30 mPa·s with α = 2.2 × 10⁻⁸ Pa⁻¹ is compressed to 100 MPa. Compare with water at 0 °C, which loses 8 % at 100 MPa.`,
      steps: [`Oil: $\\eta = 30 \\times \\exp(2.2\\times10^{-8} \\times 10^{8}) = 30 \\times e^{2.2} = 30 \\times 9.0 = 270$ mPa·s.`, `Water: $1.78 \\times 0.92 = 1.64$ mPa·s.`],
      a: `The oil becomes about nine times thicker (270 mPa·s); the cold water becomes 8 % thinner (1.64 mPa·s).` },
    { title: `The radius that Stokes–Einstein wants`, q: `Water at 25 °C has η = 0.891 mPa·s and D = 2.3 × 10⁻⁹ m²/s. What radius does the Stokes–Einstein relation give?`,
      steps: [{ text: `Rearrange for $r$:`, tex: `r = \\frac{k_B T}{6\\pi\\,\\eta\\, D} = \\frac{1.381\\times10^{-23} \\times 298.15}{6\\pi \\times 8.91\\times10^{-4} \\times 2.3\\times10^{-9}}` }, `The denominator is $3.86\\times10^{-11}$ and the numerator $4.12\\times10^{-21}$.`],
      a: `$r = 1.07\\times10^{-10}$ m, 107 pm — smaller than the molecule's 140 pm, which is itself a sign that water does not diffuse like a hard sphere in a continuum.` }
  ],
  quiz: [
    { q: `Water at 10 °C is compressed from 1 atmosphere to 500 bar. Its viscosity`, choices: [`rises by several per cent`, `falls by a few per cent`, `does not change`, `falls by half`], a: 1, why: `Below about 33 °C pressure thins water: the minimum of viscosity lies near 0.7 kbar at 10 °C and the fall is a few per cent.` },
    { q: `At 60 °C a pressure of 1,000 bar still lowers the viscosity of water.`, a: false, why: `The dip disappears near 33 °C; above that, water thickens under pressure like every liquid.` },
    { q: `The effective activation energy for the flow of water rises on cooling because`, choices: [`the hydrogen bond gets stronger`, `larger groups of molecules must rearrange together`, `the molecules get heavier`, `the dielectric constant falls`], a: 1, why: `The bond energy is almost unchanged; what grows is the number of molecules that must move in concert as the open network spreads — the mark of a fragile liquid.` },
    { q: `What is the effective activation energy of the flow of water at 0 °C, in kJ/mol, given by $E_a = R B T^2/(T - T_0)^2$ with B = 507.88 K and T₀ = 149.3 K?`, answer: 20.5, unit: `kJ/mol`, why: `$8.314 \\times 507.88 \\times 273.15^2/123.85^2 = 20{,}500$ J/mol: roughly one hydrogen bond.` },
    { q: `Why does squeezing cold water make it flow more easily?`, choices: [`it heats the water`, `pressure converts open, bonded structure into compact structure and eases partner exchange`, `it removes dissolved gas`, `it makes the molecules lighter`], a: 1, why: `The compact arrangement has fewer cooperatively bonded cages and lower barriers to exchanging neighbours; ordinary liquids have no open structure to destroy.` }
  ],
  applications: [`Deep-sea physics and biology: water at 1 kbar and 2 °C flows a little more easily than at the surface, a factor in the design of deep-sea instruments and the biochemistry of trench animals.`, `High-pressure food processing at 400–600 MPa: viscosities, diffusion and the structure of water change over the range, and the water-based chemistry has to be understood across it.`, `Water-based hydraulics and lubrication: where water replaces oil, the pressure–viscosity coefficient is small, so water films carry less load than oil films at the same speed ([[viscosity-of-water]]).`, `Geophysics: viscosities in subglacial and cold, deep fluid systems are corrected for pressure with these coefficients.`],
  history: `Percy Bridgman measured the viscosity of liquids under pressure in the 1920s, and water was the notable one whose viscosity fell at first. Bett and Cappi (1965) measured it carefully over a range of temperatures and showed the dip fading as the water warms. Prielmeier, Lang, Speedy and Lüdemann measured self-diffusion of supercooled water to 300 MPa in 1987, and the five-coordinated transition state came from Laage and Hynes's 2006 simulations of reorientation.`,
  sources: [`Bridgman, *The Physics of High Pressure* (1931), on the viscosity of liquids under pressure.`, `Prielmeier, Lang, Speedy and Lüdemann, "Diffusion in supercooled water to 300 MPa", *Phys. Rev. Lett.* 59, 1128 (1987).`, `Laage and Hynes, "A molecular jump mechanism of water reorientation", *Science* 311, 832 (2006).`, `Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4 (transport).`],
  sim: `anom-viscosity-pressure`
},

/* ================================================================ supercooled water and no man's land */
{
  id: 'supercooled-water-and-no-mans-land', parent: 'the-anomalies', title: 'Supercooled water and no man\'s land', level: 2,
  short: `Clean water droplets stay liquid far below 0 °C and freeze all at once near −38 °C (235 K). Between there and the glass transition near 136 K, ice nucleates in microseconds, and the liquid cannot normally be observed. Fast X-ray experiments now look inside this "no man's land".`,
  keywords: ['supercooled water', 'no man\'s land', 'homogeneous nucleation', '235 K', 'glass transition', 'hyperquenching', 'vitrification', 'X-ray laser', 'Sellberg', 'Kim 2020', 'cirrus clouds', 'critical nucleus'],
  prereq: ['supercooling-and-nucleation', 'heat-capacity-and-compressibility-anomalies', 'the-list-of-anomalies'],
  related: ['two-liquids-in-one', 'polyamorphism-of-ice', 'amorphous-ices', 'clouds-rain-and-snow', 'the-mpemba-effect', 'chemistry:phase-diagrams'],
  body: `
Take a bottle of very clean water, cool it slowly and untouched, and it will not freeze at 0 °C. It may reach −10 °C, then freeze all at once when jolted. This is **supercooling**: ice needs a seed, and without one the liquid stays liquid, below its melting point, in a state that is unstable but long-lived. Clean tap water in a freezer typically freezes a few to fifteen degrees below zero, on dust, bacteria or the container wall — **heterogeneous nucleation**. Remove those seeds, by splitting the water into micrometre-sized droplets so that most contain none, and the liquid survives to about **−38 °C (235 K)**. There, ice begins from the water itself: **homogeneous nucleation**.

### Why ice needs a seed
A crystal nucleus is a bargain between a gain and a cost. Turning a small ball of liquid into ice releases free energy in proportion to its *volume*, but creates an ice–water surface that costs energy in proportion to its *area*. Small nuclei lose; only beyond a **critical radius** $r^* = 2\\sigma T_m/(\\rho L\\,\\Delta T)$ does growth pay. With an ice–water surface tension of about 30 mN/m this radius is 5.4 nm at 10 K below zero (about 20,000 molecules, too many to assemble by chance), and 1.4 nm at 38 K below (about 360 molecules, few enough to be found by the thermal jostling of molecules ten thousand times a second). The probability that a droplet of volume $V$ freezes in a time $t$ is $P = 1 - e^{-JVt}$, where the nucleation rate $J$ rises extremely fast with supercooling — about ten orders of magnitude per cubic centimetre per second at 235 K, in the simulation model — so the freezing temperature depends only slowly on droplet size or cooling rate, and sits near −38 °C for droplets from a micrometre to a millimetre of ultrapure water. Cirrus clouds, the high wisps of ice, freeze from tiny liquid droplets at about this temperature, so it is a number meteorologists use.

### What lies beneath
| Temperature | What happens |
|---|---|
| 273 K (0 °C) | melting point; supercooling begins |
| 235 K (−38 °C) | homogeneous nucleation limit of micrometre droplets at 1 atm |
| 181 K (−92 °C) | the lowest nucleation limit, at about 200 MPa (Kanno, Speedy and Angell, 1975) |
| about 150 K | glassy water, warmed, crystallises |
| about 136 K | glass transition of low-density amorphous ice |

Between about 235 and 150 K is **no man's land**: the liquid exists in principle — thermodynamics allows it — but crystallises in microseconds to milliseconds however pure it is, before the glassy state can form. It matters because the anomalies of the previous pages grow towards it ([[heat-capacity-and-compressibility-anomalies]]) and the two-liquid picture puts a critical point inside it ([[two-liquids-in-one]]). Getting in is a race between cooling and nucleation. Crossing from 235 to 136 K takes $\\Delta T/q = 99/q$ seconds at a cooling rate $q$: 99 s at 1 K/s, 99 µs at 10⁶ K/s. At about 10⁶ K/s, micrometre droplets cool faster than ice can form and become glass — **hyperquenched glassy water** (Brüggeller and Mayer, 1980) — the physics behind the vitrified ice used in cryo-electron microscopy.

### Looking inside
- **Sellberg and colleagues (2014)**: micrometre droplets cooled by evaporation in vacuum, probed with X-ray laser pulses before they froze, reached 227 K (−46 °C) as a liquid and showed strongly growing density fluctuations.
- **Kim and colleagues (2017)**: similar droplets showed the scattering at zero angle and the correlation length peaking near 229 K — a maximum, not a divergence.
- **Kim and colleagues (2020)**, Nilsson's group in Stockholm: a thin film of high-density amorphous ice was heated by an infrared pulse into a high-density *liquid* above 2,500 atmospheres, and timed X-ray pulses followed it. Within tens of nanoseconds it was a high-density liquid; after a few microseconds a distinct low-density liquid; after tens of microseconds crystals. Seeing two liquid structures in the same water in turn is the strongest evidence yet for two liquids ([[two-liquids-in-one]]).

> [!key] Ultrapure micrometre droplets freeze near −38 °C because ice must nucleate from the liquid itself; below that, until the glass at 136 K, no man's land hides the liquid from all but the fastest experiments. Fast X-ray pulses now see inside it and find two structures.`,
  ideas: [`Heterogeneous nucleation on dust or surfaces freezes ordinary water within degrees of 0 °C; homogeneous nucleation in clean micrometre droplets sets in near −38 °C (235 K).`, `A critical nucleus must be large enough that growth pays: 1.4 nm and a few hundred molecules at −38 °C, but 5.4 nm and 20,000 molecules at −10 °C.`, `No man's land (about 150–235 K at 1 atm) is the range where the liquid exists in principle but ice nucleates in microseconds.`, `Cooling faster than about 10⁶ K/s skips the nucleation and gives glass; X-ray lasers and infrared heating with microsecond timing now probe the liquid inside no man's land.`],
  pitfalls: [`"Water freezes at 0 °C" — 0 °C is where ice and water coexist; liquid water can persist far below it, down to −38 °C and, in the fastest experiments, −46 °C.`, `"At −38 °C water has a different freezing law" — The same nucleation law applies throughout; −38 °C is simply where the rate in a micrometre droplet becomes large enough to freeze it within seconds.`, `"Supercooled water is slush" — It is a clear liquid; the slush forms after it begins to freeze.`],
  terms: [
    { term: `Supercooled water`, also: [`supercooled liquid`, `undercooled water`, `metastable liquid`], def: `Liquid water below its equilibrium freezing point. It persists because ice must first nucleate; clean water can be held at −20 °C for hours and, as micrometre droplets, down to about −38 °C.` },
    { term: `Homogeneous nucleation`, also: [`intrinsic nucleation`], def: `The appearance of an ice nucleus inside pure liquid water without any foreign surface. In droplets of a micrometre to a millimetre it sets in at about 235 K (−38 °C) at 1 atm.` },
    { term: `Heterogeneous nucleation`, also: [`nucleation on a surface`, `ice-nucleating particle`], def: `Ice nucleation on a foreign particle or wall that lowers the cost of the first crystal surface. It freezes ordinary water at a few to fifteen degrees below 0 °C.` },
    { term: `Critical nucleus`, also: [`critical radius`], def: `The smallest ice cluster that is more likely to grow than to melt back, $r^* = 2\\sigma T_m/(\\rho L\\Delta T)$: about 1.4 nm and 360 molecules at −38 °C.` },
    { term: `No man's land`, also: [`the nucleation gap`], def: `The range of temperature, roughly 150–235 K at atmospheric pressure, where supercooled water exists in principle but crystallises almost at once, so that it cannot be studied by ordinary methods.` },
    { term: `Glass transition`, also: [`T_g`, `vitrification`], def: `The temperature, about 136 K for water, below which a disordered solid (glass) no longer flows on laboratory timescales. Water can be made glassy only by cooling at about 10⁶ K/s or more, or by compressing ice.` }
  ],
  formulas: [
    { name: `Radius of the critical ice nucleus`, expr: `r = 2*sigma*Tm/(rho*L*dT)`, tex: `r^* = \\frac{2\\,\\sigma\\, T_m}{\\rho\\, L\\, \\Delta T}`,
      vars: { r: { name: `critical radius`, q: `length`, unit: `nm`, tex: `r^*` }, sigma: { name: `ice–water surface tension`, q: `surfacetension`, unit: `mN/m`, value: 30, tex: `\\sigma`, hint: `About 30 mN/m for the ice–water interface; estimates range from 25 to 33.` }, Tm: { const: `T0`, tex: `T_m` }, rho: { name: `density of ice`, q: `density`, unit: `kg/m³`, value: 916.7, tex: `\\rho` }, L: { name: `latent heat of fusion`, q: `latent`, unit: `kJ/kg`, value: 333.55 }, dT: { name: `supercooling`, q: `dtemp`, unit: `K`, value: 38, tex: `\\Delta T`, min: 1, max: 100 } },
      solveFor: `r`, note: `The Gibbs–Thomson estimate for a spherical nucleus; it neglects the temperature dependence of the surface tension and latent heat, so it is good to a factor of order one.`,
      stories: { r: `Water is supercooled by {dT}. With an ice–water surface tension of {sigma}, what is the radius of the smallest ice nucleus that can grow?`, dT: `The critical radius is {r}. How far must the water be supercooled?` } },
    { name: `Probability that a droplet has frozen`, expr: `P = 1 - exp(-J*V*t)`, tex: `P = 1 - e^{-J V t}`,
      vars: { P: { name: `probability of freezing`, q: `ratio`, unit: `%` }, J: { name: `nucleation rate per volume (per µm³ per second)`, value: 0.001, min: 0 }, V: { name: `droplet volume (µm³)`, value: 524, min: 0, hint: `524 µm³ is a droplet 10 µm across.` }, t: { name: `time spent at this temperature`, q: `time`, unit: `s`, value: 1, min: 0 } },
      solveFor: `P`, note: `Assumes the rate is constant during the time t; use a short step when the temperature is changing.`,
      stories: { P: `A 10 µm droplet (volume {V}) is held at a temperature where the nucleation rate is {J}, for {t}. What is the chance it has frozen?`, t: `At a nucleation rate of {J} in a droplet of {V}, how long until the chance of having frozen is {P}?` } },
    { name: `Time to cross no man's land`, expr: `t = (Th - Tg)/q`, tex: `t = \\frac{T_H - T_g}{q}`,
      vars: { t: { name: `time to cross`, q: `time`, unit: `µs` }, Th: { name: `nucleation limit`, q: `temperature`, unit: `K`, value: 235, tex: `T_H` }, Tg: { name: `glass transition`, q: `temperature`, unit: `K`, value: 136, tex: `T_g` }, q: { name: `cooling rate (K per second)`, value: 1000000, min: 0.001 } },
      solveFor: `t`, note: `The faster the cooling, the less time the liquid has to nucleate; about 10⁶ K/s or more gives glass from micrometre droplets.`,
      stories: { t: `Water is cooled from {Th} to {Tg} at {q}. How long does the passage through no man's land take?`, q: `The crossing takes {t}. At what rate is the water being cooled?` } }
  ],
  examples: [
    { title: `A nucleus at −10 °C and at −38 °C`, q: `Find the critical radius and the number of molecules in it at 10 K and 38 K of supercooling, with σ = 30 mN/m, ρ = 916.7 kg/m³ and L = 333.55 kJ/kg.`,
      steps: [{ text: `At $\\Delta T = 38$ K:`, tex: `r^* = \\frac{2 \\times 0.030 \\times 273.15}{916.7 \\times 333{,}550 \\times 38} = 1.41\\ \\mathrm{nm}` }, `Volume: $\\tfrac{4}{3}\\pi (1.41\\ \\mathrm{nm})^3 = 11.7$ nm³. Ice holds 30.6 molecules per nm³, so the nucleus contains $11.7 \\times 30.6 \\approx 360$ molecules.`, `At $\\Delta T = 10$ K the radius is 3.8 times larger, 5.4 nm, and the volume 55 times larger: about 20,000 molecules.`],
      a: `About 1.4 nm and a few hundred molecules at −38 °C; 5.4 nm and roughly 20,000 molecules at −10 °C. The first is reachable by chance, the second is not — hence pure water freezes at −38 °C and a speck of dust is needed at −10 °C.` },
    { title: `Racing the nucleation`, q: `How fast must a droplet be cooled to cross from 235 K to the glass transition at 136 K in 10 µs?`,
      steps: [`The temperature interval is $235 - 136 = 99$ K.`, `Rate: $q = 99/(10\\times10^{-6}) = 9.9\\times10^{6}$ K/s.`],
      a: `About 10⁷ K/s — achievable only for droplets a few micrometres across, which can shed heat to a cold surface or a vacuum in microseconds.` }
  ],
  quiz: [
    { q: `Why do very small droplets of ultrapure water supercool further than large ones?`, choices: [`They are colder to begin with`, `They contain less volume, so a nucleus is less likely to appear in a given time`, `Their surface tension is higher`, `They contain fewer hydrogen bonds`], a: 1, why: `The chance of freezing is $1 - e^{-JVt}$: a smaller V needs a larger J, so a lower temperature.` },
    { q: `Homogeneous nucleation sets the lowest temperature at which clean bulk water can be held liquid, at atmospheric pressure, at about`, choices: [`−5 °C`, `−15 °C`, `−38 °C`, `−137 °C`], a: 2, why: `About 235 K (−38 °C) for micrometre-scale droplets; −137 °C is the glass transition.` },
    { q: `A drop of tap water can be supercooled to −38 °C if cooled slowly enough.`, a: false, why: `Tap water contains particles that nucleate ice at a few to fifteen degrees below zero; −38 °C needs ultrapure micrometre droplets.` },
    { q: `How long, in microseconds, does cooling at 10⁶ K/s take to cross from 235 K to 136 K?`, answer: 99, unit: `µs`, why: `$99\\ \\mathrm{K}/10^6\\ \\mathrm{K/s} = 99\\ \\mu$s.` },
    { q: `In the 2020 experiment of Kim and colleagues, the high-density liquid in no man's land`, choices: [`froze at once`, `turned within microseconds into a distinct low-density liquid before crystallising`, `evaporated`, `turned into a gas`], a: 1, why: `Timed X-ray pulses saw a high-density liquid at tens of nanoseconds, a low-density liquid after a few microseconds, and crystalline ice after tens of microseconds.` }
  ],
  applications: [`Atmospheric science: cirrus clouds form by homogeneous freezing of tiny solution droplets near −38 °C, and supercooled liquid drops in clouds ice up aircraft wings.`, `Cryo-electron microscopy: plunging a thin film into liquid ethane vitrifies the water at about 10⁵–10⁶ K/s so that molecules are fixed in glass without ice crystals damaging them (Dubochet, Nobel Prize 2017).`, `Cryopreservation and frost resistance: tissues, cells and insects survive by controlling nucleation and by antifreeze compounds.`, `Fundamental physics: every theory of water must produce the observed nucleation limit and the anomalies that grow towards it ([[why-simulations-struggle]]).`],
  history: `Fahrenheit reported water liquid well below its freezing point in 1724. Kanno, Speedy and Angell reached −92 °C in emulsions under pressure in 1975. Brüggeller and Mayer produced glassy water by hyperquenching in 1980, and Dubochet's group vitrified thin films for microscopy the next year. Sellberg's 2014 X-ray experiments reached 227 K, and the 2020 experiment (source 6) saw the two liquids.`,
  sources: [`Physics Today, "Fast x-ray scattering reveals water's two liquid phases" (19 November 2020), on Kim et al., *Science* 370, 978 (2020).`, `Sellberg et al., "Ultrafast X-ray probing of water structure below the homogeneous ice nucleation temperature", *Nature* 510, 381 (2014).`, `Kanno, Speedy and Angell, "Supercooling of water to −92 °C under pressure", *Science* 189, 880 (1975).`, `Debenedetti, "Supercooled and glassy water", *J. Phys.: Condens. Matter* 15, R1669 (2003).`],
  sim: `anom-supercool-timeline`
},

/* ================================================================ two liquids in one */
{
  id: 'two-liquids-in-one', parent: 'the-anomalies', title: 'Two liquids in one', level: 3,
  short: `Simulations in 1992 suggested that supercooled water is two liquids, low-density and high-density, separated by a line that ends at a critical point hidden in no man's land. The idea explains the growing anomalies and the two glassy ices; in 2020 X-ray experiments saw the two liquids in turn. Rivals remain.`,
  keywords: ['liquid-liquid critical point', 'LLCP', 'two liquids', 'LDL', 'HDL', 'Widom line', 'Poole Sciortino Stanley', 'Mishima', 'singularity-free', 'critical-point-free', 'second critical point', 'Limmer Chandler', 'ST2'],
  prereq: ['supercooled-water-and-no-mans-land', 'heat-capacity-and-compressibility-anomalies', 'density-and-expansion-anomalies'],
  related: ['polyamorphism-of-ice', 'amorphous-ices', 'what-remains-unknown', 'why-simulations-struggle', 'the-structure-of-liquid-water', 'chemistry:phase-diagrams', 'physics:kinetic-theory'],
  body: `
Here is a thought experiment that turns the anomalies into one idea. Suppose water, deep in the cold, can exist as two different liquids: a **low-density liquid** (LDL), open and tetrahedral like ice, and a **high-density liquid** (HDL), compact and disordered. Suppose that below some temperature and above some pressure the two cannot mix, and a sharp line in the pressure–temperature plane separates them, as the line between liquid and vapour does. Then follow that line to higher temperatures and lower pressures. As with liquid and vapour, it ends: at a **liquid–liquid critical point** (LLCP), where the two liquids become identical. Beyond it there is just one liquid, but its ghost remains.

### The proposal
Peter Poole, Francesco Sciortino, Ulrich Essmann and H. Eugene Stanley found this in a 1992 simulation of a model called ST2: cooled under pressure, it separated into two liquids ending at a critical point. Osamu Mishima and Stanley later argued from experiments on the amorphous ices ([[polyamorphism-of-ice]]) and the melting of ice IV that real water has the same structure, with the critical point near **220 K and 100 MPa** (about 1,000 atmospheres). The figure is an estimate, not a measurement; other studies put it at other places.

### The ghost: the Widom line
Beyond the critical point, in the one-liquid region, the line continues as the **Widom line**: the locus where the fluctuations are largest, so that the heat capacity, compressibility and correlation length all peak. It is not a phase transition; it is a smeared crossover from LDL-like to HDL-like water, and it runs from the critical point to lower pressure and higher temperature. At atmospheric pressure it would be crossed on cooling at about 229 K (−44 °C). The anomalies of the earlier pages — the growth of the heat capacity and compressibility on cooling — are, in this picture, the approach to the Widom line, which is why the power law of Speedy and Angell looked like a divergence while the newest data show a maximum at 229 K ([[heat-capacity-and-compressibility-anomalies]]).

### The evidence
- **Two glasses.** The two amorphous ices transform into each other under pressure in a manner that looks first-order, and a glass is a frozen liquid; they would be the glasses of LDL and HDL.
- **Growing fluctuations.** The density fluctuations and correlation length of supercooled droplets rise towards a maximum near 229 K (2014 and 2017 X-ray experiments).
- **Two structures in time.** In 2020 a film of high-density amorphous ice was heated by an infrared pulse into a liquid at over 2,500 atmospheres; timed X-ray pulses saw first an HDL, then, after a few microseconds, a distinct LDL, before ice formed (source 6). This is the closest yet to watching the phase transition. The same experiments suggest the boundary between the two liquids ends at a critical point at a few hundred atmospheres.
- **Simulations.** The ST2 model, TIP4P/2005 and other models, and in 2020 a neural network trained on quantum-mechanical calculations, all show signatures of a transition ([[why-simulations-struggle]]).

### The rivals
| Scenario | Idea | Prediction below 235 K at 1 atm |
|---|---|---|
| Liquid–liquid critical point | two liquids, first-order line ending at a critical point | maxima along the Widom line, then a transition |
| Singularity-free (Sastry and colleagues, 1996) | anomalies from a density-maximum line of negative slope, with no transition | smooth, finite maxima |
| Stability-limit conjecture (Speedy, 1982) | the supercooled spinodal meets the superheated one | true divergence near 228 K |
| Liquid–solid (Limmer and Chandler, 2011, 2013) | the apparent transition in models is crystallisation | no second liquid in the equilibrium phase diagram |

The last was the strongest challenge: calculations in the mW and ST2 models argued that the "second liquid" was ice. Palmer, Debenedetti and colleagues answered in 2014 with free-energy calculations of ST2 that found a transition between two liquids at a state with no crystal, and in 2018 a comment in the *Journal of Chemical Physics* traced the difference to a coding error in the counter-calculation (a point noted in the report on the 2020 experiment, source 6). The state of play is that the critical-point picture is the most consistent with the data — not proved, since the critical point itself lies where ice nucleates in microseconds, and no experiment has yet looked at it directly.

> [!key] The two-liquid hypothesis says that supercooled water is a low-density and a high-density liquid separated by a line ending at a hidden critical point near 220 K and 100 MPa, whose shadow, the Widom line, makes the anomalies grow on cooling. X-rays now see the two liquids in turn; rivals say there is no transition.`,
  ideas: [`The hypothesis: two liquids, LDL (open, tetrahedral) and HDL (compact), separated by a first-order line ending at a critical point in no man's land.`, `Beyond the critical point the Widom line marks where the response functions peak; at 1 atm it would be crossed near 229 K.`, `Evidence: the LDA↔HDA transition, peaking fluctuations near 229 K, and the 2020 X-ray sequence HDL → LDL → ice.`, `Rivals (singularity-free, stability-limit, liquid–solid) exist; a coding error in the leading counter-model was found in 2018.`],
  pitfalls: [`"Water has been proved to be two liquids" — The 2020 experiment is strong evidence for two structures in succession, but the critical point has not been observed and the debate continues.`, `"Two liquids means two kinds of water molecule" — The molecules are identical; the two liquids are two arrangements of the same molecules, as ice and water are.`, `"The Widom line is a phase transition" — It is a crossover; it carries no latent heat and no sharp change, just maxima of the response functions.`],
  terms: [
    { term: `Liquid–liquid critical point`, also: [`LLCP`, `second critical point`], def: `The proposed end of the line of first-order coexistence between low-density and high-density liquid water, at which the two become identical. Estimated near 220 K and 100 MPa; never directly observed.` },
    { term: `Low-density liquid`, also: [`LDL`], def: `The proposed open, tetrahedral form of liquid water, favoured at low temperature and pressure; the liquid counterpart of low-density amorphous ice.` },
    { term: `High-density liquid`, also: [`HDL`], def: `The proposed compact, more disordered form of liquid water, favoured at high temperature and pressure; the liquid counterpart of high-density amorphous ice.` },
    { term: `Widom line`, also: [`line of maximum correlation length`], def: `The continuation of a first-order line beyond its critical point, along which the correlation length, the heat capacity and the compressibility reach their maxima. A crossover, not a phase transition.` },
    { term: `Correlation length`, also: [`ξ`], def: `The distance over which the fluctuations of density or structure at two points remain related. It grows toward a critical point as $\\xi \\propto (T/T_c - 1)^{-\\nu}$, with ν ≈ 0.63 for the three-dimensional Ising class.` },
    { term: `Singularity-free scenario`, also: [`no critical point`], def: `An alternative explanation in which the anomalies come from the density-maximum line having a negative slope and from the energetics of bonds, with no phase transition and only finite maxima in the response functions.` }
  ],
  formulas: [
    { name: `Widom line, a straight-line sketch`, expr: `Tw = Tc + s*(pc - p)`, tex: `T_W = T_c + s\\,(p_c - p)`,
      vars: { Tw: { name: `Widom temperature`, q: `temperature`, unit: `K`, tex: `T_W` }, Tc: { name: `critical temperature`, q: `temperature`, unit: `K`, value: 220, tex: `T_c`, hint: `About 220 K in the Mishima–Stanley estimate.` }, s: { name: `slope (kelvin per MPa)`, value: 0.09, hint: `Chosen so the line passes 229 K at atmospheric pressure; not a measured number.` }, pc: { name: `critical pressure (MPa)`, value: 100, tex: `p_c`, hint: `About 100 MPa in the same estimate.` }, p: { name: `pressure (MPa)`, value: 0.1, min: 0, max: 100 } },
      solveFor: `Tw`, note: `A schematic: the real Widom line is curved, and where it lies depends on where the critical point is.`,
      stories: { Tw: `Take the critical point at {Tc} and {pc}, and a Widom line of slope {s} (K per MPa). At what temperature is it crossed at {p} MPa?` } },
    { name: `Share of the high-density liquid in a two-state mixture`, expr: `x = 1/(1 + exp((dH - T*dS)/(R*T)))`, tex: `x_{HDL} = \\frac{1}{1 + \\exp\\left(\\dfrac{\\Delta H - T\\,\\Delta S}{R\\,T}\\right)}`,
      vars: { x: { name: `share of high-density liquid`, q: `ratio`, unit: `%`, tex: `x_{HDL}` }, dH: { name: `enthalpy LDL → HDL`, q: `molarenergy`, unit: `kJ/mol`, value: 13.74, tex: `\\Delta H`, hint: `An illustrative value; the real number is not known.` }, T: { name: `temperature`, q: `temperature`, unit: `K`, value: 229, min: 150, max: 330 }, dS: { name: `entropy LDL → HDL (J/(mol·K))`, value: 60, tex: `\\Delta S`, hint: `Illustrative: chosen so that the shares are equal near 229 K.` }, R: { const: `R` } },
      solveFor: `x`, note: `Illustrative numbers. The two shares are equal where ΔH = TΔS — the crossover (Widom) temperature.`,
      stories: { x: `A two-state model has ΔH = {dH} and ΔS = {dS} (in J/(mol·K)). What share of the liquid is the high-density one at {T}?` } },
    { name: `Growth of the correlation length`, expr: `xi = xi0*(T/Tc - 1)^(-nu)`, tex: `\\xi = \\xi_0\\left(\\frac{T}{T_c} - 1\\right)^{-\\nu}`,
      vars: { xi: { name: `correlation length`, q: `length`, unit: `nm`, tex: `\\xi` }, xi0: { name: `molecular length scale`, q: `length`, unit: `nm`, value: 0.25, tex: `\\xi_0`, hint: `About one molecular diameter, as a rough guide.` }, T: { name: `temperature`, q: `temperature`, unit: `K`, value: 229, min: 221, max: 330 }, Tc: { name: `critical temperature`, q: `temperature`, unit: `K`, value: 220, tex: `T_c`, min: 150, max: 240 }, nu: { name: `exponent`, value: 0.63, tex: `\\nu`, min: 0.3, max: 1, hint: `0.63 for the three-dimensional Ising class; 0.5 in mean-field theory.` } },
      solveFor: `xi`, note: `Valid at a critical point of the Ising class. The measured correlation length of the droplets reaches about 1 nm at 229 K, at 1 atm.`,
      stories: { xi: `Near a critical point at {Tc}, the correlation length is {xi0} times (T/Tc − 1) raised to −{nu}. What is it at {T}?` } }
  ],
  examples: [
    { title: `Where is the Widom line at one atmosphere?`, q: `Take the critical point at 220 K and 100 MPa and a Widom line of slope 0.09 K per MPa. Where does the line cross atmospheric pressure (0.1 MPa)?`,
      steps: [{ text: `Apply the straight-line formula:`, tex: `T_W = 220 + 0.09 \\times (100 - 0.1) = 229.0\\ \\mathrm{K}` }, `Convert: $229.0 - 273.15 = -44.2$ °C.`],
      a: `229 K, about −44 °C — 6 K below the homogeneous nucleation limit of 235 K, which is why only the fastest droplet experiments approach it.` },
    { title: `How much high-density liquid at 250 K and at 210 K?`, q: `In the illustrative two-state model with ΔH = 13.74 kJ/mol and ΔS = 60 J/(mol·K), what share of the liquid is high-density at 250 K and 210 K?`,
      steps: [`At 250 K: $\\Delta H - T\\Delta S = 13{,}740 - 15{,}000 = -1{,}260$ J/mol; divided by $RT = 2{,}079$ gives $-0.606$; $x = 1/(1 + e^{-0.606}) = 0.65$.`, `At 210 K: $13{,}740 - 12{,}600 = 1{,}140$; $RT = 1{,}746$; ratio $0.653$; $x = 1/(1 + e^{0.653}) = 0.34$.`],
      a: `65 % high-density at 250 K and 34 % at 210 K: a gentle crossover far from the critical point; near it, the same logistic would steepen into a jump.` }
  ],
  quiz: [
    { q: `At a liquid–liquid critical point the two liquids`, choices: [`have the same density and become indistinguishable`, `freeze`, `boil`, `separate permanently`], a: 0, why: `Like liquid and vapour at the critical point of ordinary fluids, the two phases differ less and less as the point is approached, and are identical at it.` },
    { q: `The liquid–liquid critical point of water has been directly observed.`, a: false, why: `It is hidden in no man's land, where ice forms in microseconds. The 2020 experiment saw the two liquids in sequence, not the critical point itself.` },
    { q: `The Widom line is`, choices: [`a first-order transition with latent heat`, `the locus of maxima of the response functions beyond the critical point`, `the melting line of ice`, `the boundary of the glass`], a: 1, why: `It continues the coexistence line past the critical point as a crossover along which the heat capacity, compressibility and correlation length peak.` },
    { q: `Take the critical point at 220 K and 100 MPa with a Widom line of 0.09 K/MPa. What is the Widom temperature at atmospheric pressure, in kelvin?`, answer: 229, unit: `K`, why: `$220 + 0.09 \\times 99.9 = 229$ K.` },
    { q: `Which scenario predicts finite maxima of the response functions without any phase transition?`, choices: [`the liquid–liquid critical point`, `the singularity-free scenario`, `the stability-limit conjecture`, `none of them`], a: 1, why: `Sastry and colleagues showed that a negative-sloped density-maximum line and bond energetics give rising but finite responses, so no critical point need exist.` }
  ],
  applications: [`Interpreting every experiment on supercooled water and the amorphous ices, and designing the next ones (fast X-ray scattering, ultrafast heating).`, `Water models: a model that cannot show the two-liquid behaviour is judged not to capture the competition between open and compact structures ([[why-simulations-struggle]]).`, `Planetary science: amorphous ices in comets and cold moons may carry a record of the transition between the two forms ([[ice-beyond-earth]]).`, `Other liquids: the same two-liquid ideas are being tested in silicon, silica, phosphorus and other tetrahedral materials.`],
  history: `Poole, Sciortino, Essmann and Stanley published the two-liquid simulations in *Nature* in 1992. Mishima and Stanley's 1998 papers linked them to experiments on amorphous ice and ice IV. Limmer and Chandler's 2011 challenge and Palmer and colleagues' 2014 *Nature* answer set the terms of the debate until 2018. Kim, Nilsson and colleagues' 2020 experiment is the one the film and source 6 describe.`,
  sources: [`Poole, Sciortino, Essmann and Stanley, "Phase behaviour of metastable water", *Nature* 360, 324 (1992).`, `Mishima and Stanley, "The relationship between liquid, supercooled and glassy water", *Nature* 396, 329 (1998).`, `Palmer et al., "Metastable liquid–liquid transition in a molecular model of water", *Nature* 510, 385 (2014).`, `Physics Today, "Fast x-ray scattering reveals water's two liquid phases" (19 November 2020), on Kim et al., *Science* 370, 978 (2020).`],
  sim: `anom-llcp-phase-diagram`
},

/* ================================================================ polyamorphism of ice */
{
  id: 'polyamorphism-of-ice', parent: 'the-anomalies', title: 'The polyamorphism of ice', level: 2,
  short: `Ice has glassy forms, and more than one: low-density amorphous ice (0.94 g/cm³), high-density (1.17) and very-high-density (1.25). Squeezing the first into the second near 135 K looks like a first-order transition between two glasses — the strongest hint that the liquid itself has two forms.`,
  keywords: ['amorphous ice', 'polyamorphism', 'LDA', 'HDA', 'VHDA', 'Mishima', 'high-density amorphous ice', 'low-density amorphous ice', 'glassy water', 'medium-density amorphous ice', 'first-order transition', 'vitreous ice'],
  prereq: ['amorphous-ices', 'two-liquids-in-one', 'supercooled-water-and-no-mans-land'],
  related: ['high-pressure-ices', 'ice-beyond-earth', 'what-remains-unknown', 'chemistry:crystal-structures', 'chemistry:phase-diagrams'],
  body: `
Most solids are crystals, but a solid can also be a **glass**: molecules frozen where they were in the liquid, with no long-range order. Ice makes glasses too, and the surprise is that it makes more than one kind — which is what **polyamorphism** means.

### Three glasses
| Form | Density at 1 bar, 77 K | Made by |
|---|---|---|
| ice Ih, for comparison | 0.92 g/cm³ | freezing |
| low-density amorphous ice, **LDA** | 0.94 | vapour deposited on a surface colder than about 130 K (Burton and Oliver, 1935); hyperquenched droplets |
| medium-density amorphous ice, MDA | 1.06 | ball-milling ice Ih at 77 K (2023) |
| high-density amorphous ice, **HDA** | 1.17 | crushing ice Ih at 77 K and about 1 GPa (Mishima, Calvert and Whalley, 1984) |
| very-high-density amorphous ice, **VHDA** | 1.25 | annealing HDA at about 1 GPa and 160 K (Loerting and colleagues, 2001) |
| liquid water, for comparison | 1.00 | — |

LDA is thought to be the commonest ice in the cold regions of space, on interstellar grains and in comets; the vitreous ice of cryo-electron microscopy is closely related to it.

### The jump
In 1984 Osamu Mishima, Leslie Calvert and Edgar Whalley put ordinary ice at 77 K under about 1 GPa (10,000 atmospheres) and, instead of the high-pressure crystal they expected, found it collapsed into an amorphous solid of density 1.17 g/cm³, 25 % denser than ice. A year later they showed that LDA, compressed at 77 K, transforms to HDA around 0.5 GPa, abruptly and with hysteresis. Near 135 K the change becomes reversible within a narrow window around **0.2 GPa**, as the transition between two phases at equilibrium would be. The simulation shows the pattern: the density jumps from about 1.0 to 1.2 g/cm³ on the way up and back again on the way down.

The picture in structure: in LDA each molecule has four neighbours at the corners of a tetrahedron and nothing nearer; in HDA the second shell has collapsed inwards, and a **fifth molecule** sits about 3.3 Å from the first, in what would be a gap in the tetrahedral net. VHDA pushes this further. Pressure does not break many bonds: the work done on a mole of LDA at 0.2 GPa is $p\\,\\Delta V = 0.2\\times10^9 \\times 3.77\\times10^{-6} = 0.75$ kJ/mol, a twenty-fifth of a hydrogen bond. The two forms differ in *arrangement*, not in the number of bonds.

### Why this matters for the liquid
A glass is a liquid whose clock has stopped, so a first-order transition between two glasses suggests a first-order transition between the liquids they were frozen from: LDA from LDL and HDA from HDL ([[two-liquids-in-one]]). Mishima and Stanley argued in 1998, from the LDA–HDA line and from the melting of ice IV on decompression, that the line continues into the liquid and ends at a critical point near 220 K and 100 MPa. It is not a proof. Glass transitions are kinetic, not equilibrium, events, and some researchers see HDA as a crystal crushed into disorder, or as one member of a continuous family of high-density glasses whose properties depend on how they were made ("annealed" and "unannealed" HDA are different materials). The 2020 observation of an HDL then an LDL in water at 2,500 atmospheres (source 6) is a liquid-state counterpart of the same sequence.

> [!key] Amorphous ice comes in at least three densities — 0.94, 1.17 and 1.25 g/cm³ — and the low- and high-density forms interconvert under pressure like two phases. A first-order transition between glasses is the best experimental hint that liquid water has two forms.`,
  ideas: [`Ice makes glasses of at least three densities: LDA 0.94, HDA 1.17 and VHDA 1.25 g/cm³, plus a medium-density form (1.06) made by milling.`, `LDA compressed at 77 K jumps to HDA near 0.5 GPa; at about 135 K the change is nearly reversible around 0.2 GPa.`, `The structural difference is a fifth neighbour squeezed into the gap in the second shell: the same open versus compact contrast as LDL and HDL.`, `Compression does little work (about 0.75 kJ/mol): the glasses differ by arrangement, not bond count.`],
  pitfalls: [`"Amorphous ice is just very cold water" — It is a solid with no flow on any practical time; water's glass transition is near 136 K.`, `"LDA and HDA are two crystals" — Both lack long-range order; their difference is density and local structure.`, `"The LDA–HDA transition proves two liquids" — It is a strong hint; glass transitions are kinetic and HDA may be a family of states, so the link is argued for, not proved.`],
  terms: [
    { term: `Amorphous ice`, also: [`glassy water`, `vitreous ice`], def: `Solid water without long-range order, made by condensing vapour on a very cold surface, by cooling droplets at 10⁶ K/s or more, or by compressing ice. It flows on no laboratory timescale below about 136 K.` },
    { term: `Polyamorphism`, also: [`multiple amorphous states`], def: `The existence of more than one distinct amorphous form of the same substance, separated by a transition. Water is the best-studied case.` },
    { term: `Low-density amorphous ice`, also: [`LDA`], def: `The amorphous ice of density 0.94 g/cm³ with a tetrahedral, ice-like local structure; made by vapour deposition, and the glassy counterpart of the proposed low-density liquid.` },
    { term: `High-density amorphous ice`, also: [`HDA`], def: `The amorphous ice of density 1.17 g/cm³ obtained by compressing ice or LDA at 77 K; its second shell of neighbours has collapsed inwards. The glassy counterpart of the proposed high-density liquid.` },
    { term: `Very-high-density amorphous ice`, also: [`VHDA`], def: `The amorphous ice of density 1.25 g/cm³ produced by annealing HDA at about 1 GPa; a third amorphous form, found in 2001.` }
  ],
  formulas: [
    { name: `Molar volume from density`, expr: `Vm = M/rho`, tex: `V_m = \\frac{M}{\\rho}`,
      vars: { Vm: { name: `molar volume`, q: `molarvolume`, unit: `cm³/mol`, tex: `V_m` }, M: { name: `molar mass`, q: `molarmass`, unit: `g/mol`, value: 18.015, fixed: true }, rho: { name: `density`, q: `density`, unit: `g/cm³`, value: 0.94, tex: `\\rho`, hint: `0.94 for LDA, 1.17 for HDA, 1.25 for VHDA, 1.00 for liquid water.` } },
      solveFor: `Vm`, note: `It converts the densities of the three glasses to the volumes a mole of water takes.`,
      stories: { Vm: `Low-density amorphous ice has a density of {rho}. What volume does one mole occupy?`, rho: `One mole of an ice occupies {Vm}. What is its density?` } },
    { name: `Density jump between two forms`, expr: `j = (rhoH - rhoL)/rhoL`, tex: `\\delta_\\rho = \\frac{\\rho_H - \\rho_L}{\\rho_L}`,
      vars: { j: { name: `density increase`, q: `ratio`, unit: `%`, tex: `\\delta_\\rho` }, rhoH: { name: `density of the dense form`, q: `density`, unit: `g/cm³`, value: 1.17, tex: `\\rho_H` }, rhoL: { name: `density of the light form`, q: `density`, unit: `g/cm³`, value: 0.94, tex: `\\rho_L` } },
      solveFor: `j`, note: `The jump from LDA to HDA is 24.5 %; from HDA to VHDA 7 %.`,
      stories: { j: `Amorphous ice of {rhoL} is compressed into a form of {rhoH}. By what fraction does the density rise?` } },
    { name: `Work of compression`, expr: `E = p*dV`, tex: `E = p\\,\\Delta V`,
      vars: { E: { name: `work per mole`, q: `molarenergy`, unit: `kJ/mol` }, p: { name: `pressure`, q: `pressure`, unit: `GPa`, value: 0.2 }, dV: { name: `volume decrease per mole`, q: `molarvolume`, unit: `cm³/mol`, value: 3.77, tex: `\\Delta V`, hint: `From 19.17 cm³/mol (LDA) to 15.40 (HDA): 3.77 cm³/mol.` } },
      solveFor: `E`, note: `Compare with the 20 kJ/mol of a hydrogen bond: compression pays only a twenty-fifth.`,
      stories: { E: `At {p} a mole of ice shrinks by {dV}. How much work does the pressure do?`, dV: `The work done at {p} is {E} per mole. By how much does the volume shrink?` } }
  ],
  examples: [
    { title: `Volumes and the jump`, q: `Find the molar volumes of LDA and HDA and the volume lost on conversion.`,
      steps: [`LDA: $18.015/0.94 = 19.16$ cm³/mol. HDA: $18.015/1.17 = 15.40$ cm³/mol.`, `Loss: $19.16 - 15.40 = 3.76$ cm³/mol, which is 20 % of the LDA volume.`, `Density rise: $(1.17 - 0.94)/0.94 = 24.5\\ \\%$.`],
      a: `A mole shrinks by 3.8 cm³ (20 % of its volume) and the density rises by 24.5 %.` },
    { title: `The cost of the squeeze`, q: `How much energy does a pressure of 0.2 GPa supply while compressing one mole of LDA into HDA, and how does it compare with one hydrogen bond (20 kJ/mol)?`,
      steps: [`$E = p\\,\\Delta V = 0.2\\times10^{9}\\ \\mathrm{Pa} \\times 3.77\\times10^{-6}\\ \\mathrm{m^3} = 754$ J.`, `Ratio to a bond: $0.754/20 = 0.038$.`],
      a: `About 0.75 kJ/mol — 4 % of one hydrogen bond. Pressure rearranges bonds rather than breaking them, so the two glasses are close in free energy.` }
  ],
  quiz: [
    { q: `Which amorphous ice is densest at 1 bar?`, choices: [`LDA`, `MDA`, `HDA`, `VHDA`], a: 3, why: `LDA 0.94 < MDA 1.06 < HDA 1.17 < VHDA 1.25 g/cm³.` },
    { q: `HDA made at 77 K and 1 GPa returns to LDA as soon as the pressure is released at 77 K.`, a: false, why: `At 77 K it is trapped: HDA survives decompression and only relaxes to LDA on warming to about 130 K. Near 135 K the transformation becomes reversible.` },
    { q: `Why does a first-order transition between two glasses suggest two liquids?`, choices: [`glasses are cold liquids`, `a glass is a liquid whose motion has been frozen, so two glass forms point to two liquid forms`, `glasses are crystals`, `because glass is transparent`], a: 1, why: `The argument of Mishima and Stanley: if the glasses are frozen versions of two liquids, the sharp line between them extends into the liquid as a first-order line.` },
    { q: `By what percentage does the density rise on compressing LDA (0.94 g/cm³) into HDA (1.17 g/cm³)?`, answer: 24.5, unit: `%`, why: `$(1.17 - 0.94)/0.94 = 0.245$.` },
    { q: `The key structural difference between HDA and LDA is`, choices: [`HDA has no hydrogen bonds`, `HDA has a fifth neighbour squeezed into the second shell`, `HDA is made of D₂O`, `HDA is cubic`], a: 1, why: `Compression collapses the second shell and pushes a non-bonded molecule into the gap — five near neighbours instead of four.` }
  ],
  applications: [`Astrophysics: the infrared spectra of interstellar clouds and comets show amorphous ice, which traps other gases and releases them as it warms and crystallises.`, `Cryo-electron microscopy: vitreous ice, LDA-like, holds biological samples without crystals ([[supercooled-water-and-no-mans-land]]).`, `Testing models: any model of water has to give an LDA–HDA density jump and the right pressures ([[why-simulations-struggle]]).`, `Materials: polyamorphism has since been found in silicon, silica and germanium, so water may teach general lessons about glasses.`],
  history: `Burton and Oliver made the first amorphous ice by vapour deposition in 1935. Mishima, Calvert and Whalley made HDA in 1984 and the 1985 *Nature* paper showed the apparently first-order change between the two. Loerting and colleagues found VHDA in 2001, and the medium-density form was made by ball-milling in 2023.`,
  sources: [`Mishima, Calvert and Whalley, "Melting ice I at 77 K and 10 kbar: a new method of making amorphous solids", *Nature* 310, 393 (1984), and "An apparently first-order transition between two amorphous phases of ice induced by pressure", *Nature* 314, 76 (1985).`, `Loerting et al., "How many amorphous ices are there?", *Phys. Chem. Chem. Phys.* 13, 8783 (2011).`, `Physics Today, "Fast x-ray scattering reveals water's two liquid phases" (19 November 2020; source 6).`, `Gallo et al., "Water: a tale of two liquids", *Chemical Reviews* 116, 7463 (2016).`],
  sim: `anom-lda-hda`
},

/* ================================================================ why simulations struggle */
{
  id: 'why-simulations-struggle', parent: 'the-anomalies', title: 'Why simulations struggle', level: 3,
  short: `No model of water gets everything right. TIP3P puts the density maximum at −91 °C; TIP4P/2005 gets the anomalies but melts ice about 20 K too cold; ab initio and neural-network potentials cost thousands of times more; and hydrogen's quantum nature matters too. Water is a many-body liquid in which small errors in a 20 kJ/mol bond move the anomalies by tens of kelvin.`,
  keywords: ['water models', 'TIP3P', 'TIP4P/2005', 'SPC/E', 'ST2', 'mW', 'polarisable', 'ab initio', 'neural network potential', 'molecular dynamics', 'many-body', 'path integral', 'Mercedes-Benz'],
  prereq: ['two-liquids-in-one', 'what-a-hydrogen-bond-is', 'density-and-expansion-anomalies'],
  related: ['quantum-effects-in-water', 'supercooled-water-and-no-mans-land', 'cooperativity', 'what-remains-unknown', 'polarity-and-the-dipole', 'chemistry:intermolecular-forces', 'physics:kinetic-theory'],
  body: `
To simulate water you give a computer the positions of some hundreds or thousands of molecules, a rule for the forces between them, and a time step of about a femtosecond, and let Newton's laws run for nanoseconds or microseconds. Everything lives in the rule. The honest physics is quantum mechanics of ten electrons per molecule, which cannot be afforded for large systems, so each choice of rule trades cost against what it gets wrong.

### The ladder of models
- **Rigid point-charge models** (SPC, 1981; TIP3P and TIP4P, 1983; SPC/E, 1987; TIP5P, 2000; TIP4P/2005, 2005): the molecule is a fixed triangle with charges on three to five sites and a Lennard–Jones sphere on the oxygen. A million times cheaper than quantum mechanics; they run on laptops.
- **Polarisable models** (AMOEBA and others): the charges respond to their surroundings. In the gas phase water's dipole moment is 1.85 D; in the liquid it is around 2.9 D, and a fixed-charge model has to guess an average (SPC/E uses 2.35 D).
- **Coarse-grained models** (mW, Molinero and Moore, 2009): one particle per molecule, with a three-body term that favours tetrahedral angles. Fast enough to see ice nucleate; it has density maximum and anomalies but no hydrogens.
- **Ab initio molecular dynamics**: the electrons are solved at every step, with density-functional theory. The result depends on the functional; some common ones make water too ordered, nearer to a glass than a liquid at room temperature.
- **Machine-learned potentials** (Behler and Parrinello, 2007 onward): a neural network is trained on thousands of quantum calculations and then runs at close to model speed. Models of this kind have reproduced the density maximum and shown signs of a liquid–liquid transition (Gartner and colleagues, 2020).
- **Path-integral methods** treat the nuclei as quantum: each atom becomes a ring of $P \\approx hc\\tilde\\nu/k_BT$ beads (17 for the O–H stretch at 300 K, in practice 32), multiplying the cost by that number.

### The scorecard
| Model | Temperature of maximum density | Melting point of ice Ih |
|---|---|---|
| experiment | 277 K (3.98 °C) | 273 K |
| TIP3P | about 182 K (−91 °C) | about 146 K |
| SPC/E | about 241 K | about 215 K |
| TIP4P | about 253 K | about 232 K |
| TIP4P/2005 | about 278 K | about 252 K (−21 °C) |
| TIP5P | about 285 K | about 274 K |

(Approximate values from the compilation of Vega and Abascal, 2011.) TIP3P, the model used in most protein simulations, puts the density maximum 95 K too low and the melting point of ice 127 K too low: its water is hopelessly under-structured at 0 °C. TIP4P/2005 has the best anomalies of the rigid models but still melts ice about 20 K too cold. No model reproduces all of: the density curve, the melting point, the dielectric constant, the surface tension, the phase diagram of ice, and the anomalies together.

### Why it is hard
1. **Small differences of large numbers.** The attraction holding a molecule in the liquid is about 41 kJ/mol; the free energy that separates the open from the compact structure, which decides the density maximum, is a few kJ/mol at most — 3.6 kJ/mol at 0 °C, and zero near −35 °C, in the two-structure fit of this app. A model that gets the first right to 5 % can get the second wrong by half.
2. **Many-body forces.** A hydrogen bond is stronger when its donor and acceptor are themselves bonded to others — cooperativity ([[cooperativity]]) — and no sum of pair forces can say that. Fixed-charge models fake it by over-polarising the molecule, which then fails for ice, vapour or surfaces.
3. **Quantum nuclei.** The proton's zero-point energy is as large as the hydrogen bond ([[quantum-effects-in-water]]).
4. **Time.** In a box of 1,000 molecules (a cube 3.1 nm on a side) a rate of $J = 10^{16}$ m⁻³ s⁻¹ at 235 K gives one nucleation in about $1/(JV) = 3\\times10^{9}$ s, a century. So a small box never freezes in simulated time: simulations enter no man's land as no experiment can, but they also cannot be checked against the freezing.

The same questions have been asked of cut-down models. The two-dimensional "Mercedes-Benz" model (Ben-Naim, 1971; Dill and colleagues) gives disks three arms at 120° that attract along the arms; the simulation here builds the idea into a toy and finds that a density maximum exists only when the arms' strength is in a window.

> [!key] Every model of water trades something away: TIP3P has the wrong density maximum, TIP4P/2005 the wrong melting point, quantum methods are thousands of times costlier, and the anomalies depend on free-energy differences of a few kJ/mol out of 41. Water is a many-body liquid, and it is a stringent test of any theory.`,
  ideas: [`Models range from three-site rigid molecules to ab initio and neural-network potentials, each trading cost for accuracy.`, `TIP3P puts the density maximum at about −91 °C and TIP4P/2005 melts ice about 20 K too low; no rigid model gets every property.`, `Water's anomalies hinge on free-energy differences of a few kJ/mol out of 41, so small force-field errors move them by tens of kelvin.`, `Many-body forces, quantum nuclei and sampling time are the three hard parts.`],
  pitfalls: [`"A better computer will fix it" — Faster hardware lets the same rules run longer, but the errors are in the rules (many-body effects, quantum nuclei) rather than in the speed.`, `"If a model gets the density at 25 °C right it is a good model" — TIP3P gets room-temperature density to a few per cent and still places the density maximum 95 K too low.`, `"A simulation that does not freeze shows water is stable at 235 K" — A small box would need a century to nucleate; it proves nothing about real droplets.`],
  terms: [
    { term: `Point-charge water model`, also: [`rigid water model`, `TIP3P`, `SPC/E`], def: `A water molecule represented by a fixed geometry with partial charges on three to five sites and a Lennard–Jones interaction on the oxygen. Cheap, widely used and each wrong in a different way.` },
    { term: `TIP4P/2005`, also: [`TIP4P/2005 model`], def: `A four-site rigid model (Abascal and Vega, 2005) whose parameters were fitted to the density maximum and the ice phase diagram. It has the best anomalies of the rigid models; it melts ice Ih at about 252 K.` },
    { term: `Polarisable model`, also: [`induced-dipole model`], def: `A water model whose charges or dipoles respond to the local electric field, so that the molecular dipole grows from 1.85 D in the gas to about 2.9 D in the liquid. More accurate and several times more expensive.` },
    { term: `Ab initio molecular dynamics`, also: [`AIMD`, `first-principles MD`], def: `Molecular dynamics in which the forces are recomputed from the electrons' quantum mechanics (usually density-functional theory) at every step. No fitted force field, but costly and sensitive to the functional.` },
    { term: `Machine-learned potential`, also: [`neural-network potential`, `Behler–Parrinello`], def: `A force field made by training a neural network on a library of quantum calculations; it reproduces the quantum energy surface at near-classical cost.` },
    { term: `Path-integral molecular dynamics`, also: [`ring-polymer MD`, `PIMD`], def: `A technique that treats nuclei as quantum by replacing each atom by a ring of coupled copies ("beads"); the number of beads needed grows with the stiffness of the vibration over the thermal energy.` }
  ],
  formulas: [
    { name: `Waiting time for one nucleation in a simulation box`, expr: `t = 1/(J*V)`, tex: `t = \\frac{1}{J\\,V}`,
      vars: { t: { name: `mean waiting time`, q: `time`, unit: `yr`, tex: `t` }, J: { name: `nucleation rate per volume (per nm³ per second)`, value: 1e-11, min: 0, hint: `10⁻¹¹ per nm³ per s is 10¹⁶ m⁻³ s⁻¹, about the rate at 235 K.` }, V: { name: `box volume (nm³)`, value: 30, min: 0, hint: `A cube of 1,000 molecules is about 30 nm³.` } },
      solveFor: `t`, note: `Derived from the freezing probability $1 - e^{-JVt}$; a simulation of nanoseconds to microseconds sees a nucleation only if JVt is of order one.`,
      stories: { t: `A box of {V} nm³ is simulated at a temperature where the nucleation rate is {J} per nm³ per second. How long, on average, until ice forms?` } },
    { name: `Path-integral beads needed`, expr: `P = h*c*nu/(kB*T)`, tex: `P \\approx \\frac{h\\,c\\,\\tilde\\nu}{k_B\\,T}`,
      vars: { P: { name: `beads (at least)`, hint: `In practice the number is taken somewhat higher, 16–64.` }, h: { const: `h` }, c: { const: `c` }, nu: { name: `wavenumber of the fastest vibration`, q: `wavenumber`, unit: `1/cm`, value: 3657, tex: `\\tilde\\nu`, hint: `3,657 cm⁻¹ for the O–H stretch of a water molecule.` }, kB: { const: `kB` }, T: { name: `temperature`, q: `temperature`, unit: `K`, value: 300, min: 50, max: 600 } },
      solveFor: `P`, note: `The rule of thumb: the number of beads must exceed the ratio of the vibrational quantum to the thermal energy; at 100 K the O–H stretch needs over 50.`,
      stories: { P: `The O–H stretch has a wavenumber of {nu}. How many path-integral beads does a simulation at {T} need at least?` } },
    { name: `Molecules in a cubic simulation box`, expr: `N = rho*NA*L^3/M`, tex: `N = \\frac{\\rho\\, N_A\\, L^3}{M}`,
      vars: { N: { name: `number of molecules`, hint: `A box 3.1 nm on a side holds about 1,000 molecules.` }, rho: { name: `density`, q: `density`, unit: `kg/m³`, value: 997, tex: `\\rho` }, NA: { const: `NA` }, L: { name: `side of the box`, q: `length`, unit: `nm`, value: 3.1, min: 0.5, max: 20 }, M: { name: `molar mass`, q: `molarmass`, unit: `g/mol`, value: 18.015, fixed: true } },
      solveFor: `N`, note: `Typical simulations use 200–10,000 molecules: a cube 2 to 6.7 nm across.`,
      stories: { N: `A cubic box of side {L} is filled with water of density {rho}. How many molecules does it hold?`, L: `A simulation needs {N} molecules at {rho}. What side of box does it need?` } }
  ],
  examples: [
    { title: `A century to freeze`, q: `A box of 1,000 molecules (V = 30 nm³) is held at a temperature where J = 10⁻¹¹ per nm³ per second. How long is the average wait for ice, and how does that compare with a 100 ns simulation?`,
      steps: [{ text: `Rate in the box:`, tex: `JV = 10^{-11} \\times 30 = 3\\times10^{-10}\\ \\mathrm{s^{-1}}` }, `Waiting time: $1/(3\\times10^{-10}) = 3.3\\times10^{9}$ s $= 106$ years.`, `A 100 ns run covers $10^{-7}/3.3\\times10^{9} = 3\\times10^{-17}$ of that.`],
      a: `About a century; the box would never freeze in a simulation, so it can follow the liquid deep into no man's land — and by the same token says nothing about how fast real droplets freeze.` },
    { title: `Beads for hydrogen`, q: `How many path-integral beads are needed for the O–H stretch (3,657 cm⁻¹) at 300 K and at 100 K?`,
      steps: [{ text: `Use $P \\approx hc\\tilde\\nu/k_BT$ with $hc/k_B = 1.4388$ cm·K:`, tex: `P = \\frac{1.4388 \\times 3657}{300} = 17.5` }, `At 100 K: $1.4388 \\times 3657/100 = 52.6$.`],
      a: `At least 18 beads at 300 K (32 in practice) and 53 at 100 K: quantum nuclei multiply the cost by tens.` }
  ],
  quiz: [
    { q: `Which of these is correct about the TIP3P model, the workhorse of protein simulation?`, choices: [`its density maximum is near 4 °C`, `its density maximum is near −91 °C`, `it has no hydrogen bonds`, `it is a polarisable model`], a: 1, why: `TIP3P puts the maximum about 95 K too low, and melts ice about 127 K too cold; its popularity comes from compatibility with protein force fields, not from accuracy for bulk water.` },
    { q: `If a model reproduces the density of water at 25 °C and 1 atm, it will also reproduce the temperature of maximum density.`, a: false, why: `The density at 25 °C is a large average; the maximum depends on a delicate balance of free energies of a few kJ/mol. TIP3P is a counter-example.` },
    { q: `A simulation of 1,000 water molecules at 235 K does not freeze in a microsecond mainly because`, choices: [`the model is wrong`, `the box is too small for a nucleus to appear in the time simulated`, `the temperature is too high`, `computers cannot model ice`], a: 1, why: `The nucleation time is $1/(JV)$; with the small V of a nanometre-scale box it is geological, not microseconds.` },
    { q: `How many path-integral beads does the 3,657 cm⁻¹ O–H stretch need at 300 K, at least?`, answer: 17.5, why: `$hc\\tilde\\nu/k_BT = 1.4388 \\times 3657/300 = 17.5$.` },
    { q: `Which type of model includes the electrons explicitly?`, choices: [`TIP4P/2005`, `mW`, `ab initio molecular dynamics`, `SPC/E`], a: 2, why: `Ab initio dynamics recomputes the electronic structure at each step; the others are force fields with fixed parameters.` }
  ],
  applications: [`Biomolecular simulation: protein and DNA force fields are paired with TIP3P or TIP4P/2005-like water, so the model's flaws shape the results for drug design.`, `Atmospheric science: simulations of ice nucleation (with mW and other models) feed cloud models.`, `Materials: desalination membranes, nanofluidics and electrolytes are designed with simulations whose water model must be chosen for the property that matters.`, `Fundamental physics: the liquid–liquid transition is investigated almost entirely by simulation ([[two-liquids-in-one]]).`],
  history: `Bernal and Fowler proposed a model of water in 1933. Rahman and Stillinger ran the first molecular dynamics of liquid water in 1971 and the ST2 model followed in 1974. SPC/E (1987), TIP4P/2005 (2005) and mW (2009) are landmarks, and Behler and Parrinello introduced neural-network potentials in 2007.`,
  sources: [`Vega and Abascal, "Simulating water with rigid non-polarizable models: a general perspective", *Phys. Chem. Chem. Phys.* 13, 19663 (2011).`, `Abascal and Vega, "A general purpose model for the condensed phases of water: TIP4P/2005", *J. Chem. Phys.* 123, 234505 (2005).`, `Gartner et al., "Signatures of a liquid–liquid transition in an ab initio deep neural network model for water", *PNAS* 117, 26040 (2020).`, `Gallo et al., "Water: a tale of two liquids", *Chemical Reviews* 116, 7463 (2016).`],
  sim: `anom-toy-liquid`
},

/* ================================================================ quantum effects */
{
  id: 'quantum-effects-in-water', parent: 'the-anomalies', title: 'Quantum effects in water', level: 3,
  short: `Hydrogen is light enough that quantum mechanics shows in the bulk liquid. The O–H bond carries a zero-point energy of about 22 kJ/mol, as large as a hydrogen bond; heavier deuterium has a lower one, which is why heavy water melts at 3.82 °C and peaks in density at 11.2 °C; protons tunnel and spread; and D₂O tastes sweet.`,
  keywords: ['zero-point energy', 'nuclear quantum effects', 'isotope effect', 'heavy water', 'D2O', 'tunnelling', 'proton delocalisation', 'competing quantum effects', 'Habershon', 'sweet taste', 'T1R2 T1R3', 'path integral'],
  prereq: ['isotopes-and-heavy-water', 'density-and-expansion-anomalies', 'what-a-hydrogen-bond-is'],
  related: ['why-simulations-struggle', 'the-proton-hops', 'vibrations-and-the-colour-of-water', 'heavy-water-in-reactors', 'the-deuterium-clock', 'chemistry:isotopes', 'physics:kinetic-theory'],
  body: `
A bead on a spring, in classical mechanics, can lie at rest at the bottom of its well with no energy. A real vibrating bond cannot: Heisenberg's uncertainty principle forbids it from being both at rest and in one place, so the lowest state keeps a **zero-point energy** of half a quantum, $\\tfrac{1}{2}h\\nu$. For the O–H stretch of water, which vibrates at about 3,657 cm⁻¹ (a frequency of 110 THz), that is $\\tfrac{1}{2}N_A h c\\tilde\\nu = 21.9$ kJ/mol per bond — as big as a hydrogen bond (20 kJ/mol) and a twentieth of the bond's whole 463 kJ/mol strength.

### Light enough to blur
The proton's position in its ground state is not a point but a cloud with a spread of about 0.07 Å, in a bond 0.96 Å long, in a liquid whose hydrogen-bonded partner is 1.8 Å away. This is why molecular simulations that treat nuclei as classical points miss a significant part of water's behaviour ([[why-simulations-struggle]]), and why isotopes matter.

Replace each H with deuterium and the zero-point energy changes, because the oscillator frequency scales with the inverse square root of the reduced mass, $\\nu_D = \\nu_H\\sqrt{\\mu_H/\\mu_D}$. The reduced masses (oxygen with H or D) are 0.948 and 1.789 u, so $\\nu_D = 0.728\\,\\nu_H \\approx 2{,}660$ cm⁻¹ (the measured value for D₂O vapour is 2,671) and the zero-point energy falls to 16.0 kJ/mol: **5.9 kJ/mol less per O–D bond**. That is a quarter of a hydrogen bond; it is not small.

### What the difference does
| Property | H₂O | D₂O |
|---|---|---|
| melting point | 0.00 °C | 3.82 °C |
| boiling point | 100.00 °C | 101.42 °C |
| temperature of maximum density | 3.98 °C | 11.2 °C |
| density at 25 °C | 997.05 kg/m³ | 1,104.4 kg/m³ (+10.8 %) |
| viscosity at 25 °C | 0.890 mPa·s | 1.095 mPa·s (+23 %) |
| heat of fusion | 6.01 kJ/mol | 6.315 kJ/mol |
| p$K_w$ at 25 °C | 13.995 | 14.87 |

The density rise is mostly mass (20.03 against 18.02 g/mol): a mole of D₂O occupies almost the same volume as a mole of H₂O. The melting point and the density maximum are what the quantum effects change, and they shift together: the whole density curve of D₂O is light water's moved up by about 7 K. Heavy water behaves like cooler light water — as if its network of bonds were stiffer, so that structure survives to a higher temperature. The melting point shift can be read from $T_m = \\Delta H_\\text{fus}/\\Delta S_\\text{fus}$: D₂O's heat of fusion is 5 % larger (6.315 against 6.01 kJ/mol) and its entropy 3.6 % larger, so $T_m$ rises from 273.15 to 276.97 K.

### Competing quantum effects
Why a net strengthening? In 2009 Scott Habershon, Thomas Markland and David Manolopoulos found with path-integral simulations that two quantum effects pull in opposite directions. The zero-point motion of the *intramolecular* vibrations (the stretching and bending of each molecule) tends to strengthen hydrogen bonds, by stretching the O–H bonds and increasing the molecule's dipole moment. The zero-point motion of the *intermolecular* degrees of freedom (the molecules' hindered rotations and translations against their neighbours) tends to weaken them. The two nearly cancel in the structure, and what remains is a small residue that differs between H and D — enough to separate the isotopes' melting points and density maxima. The dynamics feel it more strongly: the diffusion in their simulations is faster than a classical calculation gives.

### Tunnelling and a sweet surprise
A proton can pass through a barrier it does not have the energy to climb. Through a rectangular barrier 0.3 Å wide and 30 kJ/mol high, a rough estimate gives a transmission of $6\\times10^{-4}$ for a proton and $3\\times10^{-5}$ for a deuteron — a factor of 21 — so tunnelling is a major part of why reactions involving hydrogen are faster than those with deuterium (the *kinetic isotope effect*). In water it shows in proton transfer ([[the-proton-hops]]) and, at low temperature, in the collective tunnelling of molecules in small clusters.

Finally, the isotope shows up on the tongue. Ben Abu, Jungwirth, Niv and colleagues (2021) found that people taste pure D₂O as **sweet**, through the same receptor (T1R2/T1R3) that tastes sugar; lactisole, which blocks that receptor, removed the sweetness in people and in cell assays; mice did not respond to it (source 11). A change of one neutron in each hydrogen, acting through quantum effects on bonds and electrostatics, is enough for a protein to notice.

> [!key] The O–H bond's zero-point energy (22 kJ/mol) is as large as a hydrogen bond, so the hydrogen's mass matters. Deuterium's lower zero-point energy leaves D₂O's network effectively stiffer — a melting point 3.82 K higher, a density maximum 7 K higher, a viscosity 23 % higher — and the same effects make heavy water taste sweet.`,
  ideas: [`The O–H stretch has a zero-point energy of about 21.9 kJ/mol; the O–D stretch has about 16.0, a difference of 5.9 kJ/mol per bond.`, `The heavier hydrogen leaves heavy water behaving like light water about 7 K colder: melting 3.82 °C, density maximum 11.2 °C, viscosity 23 % higher.`, `Intramolecular and intermolecular quantum effects compete and nearly cancel; the remainder, larger for H than for D, changes structure and dynamics.`, `Tunnelling lets the proton pass barriers about twenty times more easily than a deuteron in a rough estimate; D₂O tastes sweet to people via the sweet receptor.`],
  pitfalls: [`"Heavy water is denser because its molecules are smaller" — Its molecules are slightly larger in effect; the density rise is the mass ratio of 1.11, and the molar volume is almost unchanged.`, `"Quantum effects only matter at low temperatures" — The zero-point energy of the O–H stretch is present at every temperature and is as large as a hydrogen bond at 25 °C.`, `"Isotopes differ only in mass, so only inertia changes" — Mass changes the zero-point motion, which changes bond lengths, polarity and effective strengths — and so melting, density and viscosity.`],
  terms: [
    { term: `Zero-point energy`, also: [`ZPE`, `zero-point motion`], def: `The minimum energy a quantum oscillator keeps in its ground state, $\\tfrac{1}{2}h\\nu$. For the O–H stretch of water about 21.9 kJ/mol; for O–D about 16.0.` },
    { term: `Nuclear quantum effect`, also: [`NQE`], def: `Any consequence of treating the nuclei, rather than just the electrons, quantum mechanically: zero-point energy, delocalisation and tunnelling. Important for hydrogen because of its small mass.` },
    { term: `Quantum tunnelling`, also: [`tunnelling`, `barrier penetration`], def: `Passage of a particle through a potential barrier higher than its energy. The probability falls steeply with mass and barrier width, so a proton tunnels far more readily than a deuteron.` },
    { term: `Competing quantum effects`, also: [`Habershon–Markland–Manolopoulos effect`], def: `The finding (2009) that intramolecular quantum motion strengthens hydrogen bonds and intermolecular quantum motion weakens them, so that the two largely cancel in the structure of water.` },
    { term: `Kinetic isotope effect`, also: [`KIE`], def: `The change in the rate of a reaction when an atom is replaced by a heavier isotope. For hydrogen to deuterium it is often a factor of 2–10, partly through tunnelling and zero-point energy.` }
  ],
  formulas: [
    { name: `Zero-point energy of a vibration`, expr: `E = NA*h*c*nu/2`, tex: `E_0 = \\tfrac{1}{2}\\,N_A\\, h\\, c\\, \\tilde\\nu`,
      vars: { E: { name: `zero-point energy per mole`, q: `molarenergy`, unit: `kJ/mol`, tex: `E_0` }, NA: { const: `NA` }, h: { const: `h` }, c: { const: `c` }, nu: { name: `wavenumber of the vibration`, q: `wavenumber`, unit: `1/cm`, value: 3657, tex: `\\tilde\\nu`, hint: `3,657 cm⁻¹ for the O–H stretch of gaseous H₂O; 2,671 for D₂O; about 3,400 for the hydrogen-bonded liquid.` } },
      solveFor: `E`, note: `Harmonic estimate. The anharmonic (Morse) value is about 3 % higher.`,
      stories: { E: `A bond vibrates at {nu}. What is its zero-point energy per mole?`, nu: `A bond has a zero-point energy of {E} per mole. What is its vibrational wavenumber?` } },
    { name: `Isotope shift of a vibration`, expr: `nuD = nuH*sqrt(muH/muD)`, tex: `\\tilde\\nu_D = \\tilde\\nu_H\\sqrt{\\frac{\\mu_H}{\\mu_D}}`,
      vars: { nuD: { name: `wavenumber with deuterium`, q: `wavenumber`, unit: `1/cm`, tex: `\\tilde\\nu_D` }, nuH: { name: `wavenumber with hydrogen`, q: `wavenumber`, unit: `1/cm`, value: 3657, tex: `\\tilde\\nu_H` }, muH: { name: `reduced mass of O–H (u)`, value: 0.948, tex: `\\mu_H`, min: 0 }, muD: { name: `reduced mass of O–D (u)`, value: 1.789, tex: `\\mu_D`, min: 0 } },
      solveFor: `nuD`, note: `A harmonic oscillator at fixed stiffness; the measured 2,671 cm⁻¹ differs by 0.4 %.`,
      stories: { nuD: `The O–H stretch is at {nuH}. With reduced masses {muH} u and {muD} u, where is the O–D stretch?` } },
    { name: `Melting temperature from enthalpy and entropy`, expr: `Tm = dH/dS`, tex: `T_m = \\frac{\\Delta H_\\mathrm{fus}}{\\Delta S_\\mathrm{fus}}`,
      vars: { Tm: { name: `melting temperature`, q: `temperature`, unit: `°C`, tex: `T_m` }, dH: { name: `heat of fusion`, q: `molarenergy`, unit: `kJ/mol`, value: 6.01, tex: `\\Delta H_\\mathrm{fus}`, hint: `6.01 kJ/mol for H₂O, 6.315 for D₂O.` }, dS: { name: `entropy of fusion (J/(mol·K))`, value: 22, tex: `\\Delta S_\\mathrm{fus}`, min: 1, hint: `22.0 for H₂O, 22.8 for D₂O.` } },
      solveFor: `Tm`, note: `At the melting point the free energies of solid and liquid are equal, so $\\Delta H = T_m \\Delta S$. The isotope shift appears as a change of both $\\Delta H$ and $\\Delta S$.`,
      stories: { Tm: `A substance has a heat of fusion of {dH} and an entropy of fusion of {dS} J/(mol·K). At what temperature does it melt?` } },
    { name: `Tunnelling through a rectangular barrier (WKB estimate)`, expr: `T = exp(-2*w*sqrt(2*M*V)/(hbar*NA))`, tex: `T_\\mathrm{tun} \\approx \\exp\\left(-\\frac{2w\\sqrt{2MV}}{\\hbar N_A}\\right)`,
      vars: { T: { name: `transmission probability`, tex: `T_\\mathrm{tun}` }, w: { name: `barrier width`, q: `length`, unit: `pm`, value: 30 }, M: { name: `molar mass of the particle`, q: `molarmass`, unit: `g/mol`, value: 1.008, hint: `1.008 g/mol for H, 2.014 for D.` }, V: { name: `barrier height`, q: `molarenergy`, unit: `kJ/mol`, value: 30 }, hbar: { const: `hbar` }, NA: { const: `NA` } },
      solveFor: `T`, note: `A rough estimate for a rectangular barrier; real proton-transfer barriers are curved and short, which usually raises the tunnelling rate.`,
      stories: { T: `A particle of molar mass {M} meets a barrier {w} wide and {V} high. What fraction tunnels through?` } }
  ],
  examples: [
    { title: `The zero-point energy of an O–D bond`, q: `Use ν̃(O–H) = 3,657 cm⁻¹ and reduced masses 0.948 u and 1.789 u to find ν̃(O–D) and the difference in zero-point energy per bond.`,
      steps: [{ text: `Isotope scaling:`, tex: `\\tilde\\nu_D = 3657\\sqrt{0.948/1.789} = 3657 \\times 0.728 = 2{,}662\\ \\mathrm{cm^{-1}}` }, `Zero-point energies: $\\tfrac{1}{2}N_A hc\\tilde\\nu$ gives 21.87 kJ/mol for O–H and 15.92 for O–D (15.98 at the measured 2,671).`, `Difference: about 5.9 kJ/mol.`],
      a: `O–D is at about 2,660 cm⁻¹ (observed 2,671) and has 5.9 kJ/mol less zero-point energy than O–H.` },
    { title: `Why heavy ice melts four degrees higher`, q: `Heavy water has ΔH_fus = 6.315 kJ/mol and ΔS_fus = 22.80 J/(mol·K); light water has 6.01 kJ/mol and 22.0 J/(mol·K). Find both melting points.`,
      steps: [`Light: $6010/22.0 = 273.2$ K ($0.0$ °C).`, `Heavy: $6315/22.80 = 277.0$ K ($3.8$ °C).`],
      a: `3.8 K higher for D₂O. Both enthalpy and entropy rise, enthalpy a little faster — the footprint of stiffer bonds.` }
  ],
  quiz: [
    { q: `Which bond has the larger zero-point energy?`, choices: [`O–H`, `O–D`, `they are equal`, `neither has any`], a: 0, why: `The frequency, and so the energy, scales with $1/\\sqrt{\\mu}$ and the O–H reduced mass is smaller: 21.9 against 16.0 kJ/mol.` },
    { q: `Heavy water is about 10 % denser than light water mainly because its molecules are more massive, not because they take less room.`, a: true, why: `D₂O weighs 20.03 against 18.02 g/mol (ratio 1.11) but a mole occupies nearly the same volume.` },
    { q: `Heavy water at a given temperature behaves, in its density curve, like light water at about`, choices: [`7 K higher`, `7 K lower`, `the same temperature`, `100 K lower`], a: 1, why: `Its curve is light water's shifted warmer by about 7 K: at 11.2 °C it is where H₂O is at 4 °C.` },
    { q: `Compute the zero-point energy, in kJ/mol, of a bond with a stretch at 3,657 cm⁻¹.`, answer: 21.9, unit: `kJ/mol`, why: `$\\tfrac{1}{2} N_A h c\\tilde\\nu = 0.5 \\times 6.022\\times10^{23} \\times 6.626\\times10^{-34} \\times 2.998\\times10^{8} \\times 3.657\\times10^{5} = 21.9$ kJ/mol.` },
    { q: `"Competing quantum effects" in water means`, choices: [`two isotopes compete for the oxygen`, `intramolecular quantum motion strengthens hydrogen bonds while intermolecular quantum motion weakens them`, `quantum and classical theories disagree on the density`, `tunnelling competes with convection`], a: 1, why: `The simulations of Habershon, Markland and Manolopoulos showed the two opposite effects nearly cancel in the structure.` }
  ],
  applications: [`Deuterated compounds: NMR solvents, heavy-water moderators in reactors ([[heavy-water-in-reactors]]), and deuterated drugs whose C–D bonds are metabolised more slowly.`, `Measuring the origin of water: the deuterium-to-hydrogen ratio of comets and oceans depends on the isotope effects of cold chemistry ([[the-deuterium-clock]]).`, `Biochemistry: replacing a quarter or more of the water of a mammal with D₂O slows enzymes and cell division enough to be toxic.`, `Computational chemistry: path-integral methods and isotope substitution are the experimental and numerical tests of nuclear quantum effects.`],
  history: `Harold Urey discovered deuterium in 1931 (Nobel Prize in Chemistry, 1934), and Gilbert Lewis prepared nearly pure heavy water in 1933. The physical effects of replacing H₂O by D₂O were tabulated by Kirshenbaum in 1951. Path-integral simulations of water began in the 1980s, Habershon, Markland and Manolopoulos published the competing-effects paper in 2009, and the sweet taste was reported in 2021.`,
  sources: [`Habershon, Markland and Manolopoulos, "Competing quantum effects in the dynamics of a flexible water model", *J. Chem. Phys.* 131, 024501 (2009).`, `Hebrew University of Jerusalem, "The sweet taste of heavy water" (6 May 2021), on Ben Abu et al., *Communications Biology* (source 11).`, `Fecko, Eaves, Loparo, Tokmakoff and Geissler, *Science* 301, 1698 (2003) (the O–H stretch dynamics; source 8).`, `Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4 (isotope effects).`],
  sim: `anom-zero-point`
},

/* ================================================================ what remains unknown */
{
  id: 'what-remains-unknown', parent: 'the-anomalies', title: 'What remains unknown', level: 3,
  short: `Water is the best-studied liquid and is still not fully understood. The existence of a second critical point, the true structure of the liquid, the negative charge of its surfaces, the Mpemba effect, water squeezed into nanometre channels and the water inside cells are all open — each with an experiment that would help to settle it.`,
  keywords: ['unsolved problems', 'open questions about water', 'structure of liquid water', 'rings and chains', 'Wernet', 'zeta potential', 'bubble charge', 'Mpemba', 'confined water', 'square ice', 'nanotubes', 'hydration water', 'Ball'],
  prereq: ['two-liquids-in-one', 'the-structure-of-liquid-water', 'supercooled-water-and-no-mans-land'],
  related: ['the-mpemba-effect', 'the-matrix-of-life', 'hydration-shells-and-proteins', 'why-simulations-struggle', 'aquaporins', 'surface-tension', 'feynman:dielectrics-feyn'],
  body: `
It is easy to suppose that a liquid so common, so cheap and so thoroughly measured must be understood. The 2017 review by Philip Ball (source 9) ends the opposite way: our understanding of water as a liquid and as a solvent is still incomplete, and that matters for biology as much as for physics. This page is the honest list. For each question: what is secure, where the disagreement lies, and what experiment would help.

| Question | What is secure | The disagreement | What would settle it |
|---|---|---|---|
| **Is there a liquid–liquid critical point?** | the anomalies grow towards about 229 K; two glassy ices; in 2020 a high- then a low-density liquid were seen in turn | critical point, or singularity-free, or a liquid–solid illusion ([[two-liquids-in-one]]) | holding liquid in no man's land at 50–150 MPa long enough to watch fluctuations grow at the critical point itself; ab initio simulations at the same conditions |
| **What is the structure of the liquid?** | on average 3.7 hydrogen bonds per molecule at 25 °C; lifetimes of about a picosecond | a distorted tetrahedral network, or mostly *rings and chains* with only about two strong bonds per molecule (X-ray absorption and Raman data of Wernet and colleagues, 2004; later analyses found the same spectra compatible with distorted tetrahedra) | combining scattering with spectroscopy and time-resolved X-rays, with the interpretation tested by the same simulations ([[the-structure-of-liquid-water]]) |
| **Why do water surfaces carry a negative charge?** | air bubbles, oil drops and ice in pure water move towards a positive electrode, with a zeta potential of tens of millivolts negative and an isoelectric point near pH 3–4 | adsorbed hydroxide, charge transfer between water molecules at the surface, orientation of the surface dipoles, or contamination | ultra-clean bubble electrophoresis against pH and salt, plus surface-specific vibrational spectroscopy and polarisable simulations |
| **Does hot water freeze faster than cold?** | claimed by Mpemba and Osborne (1969); sometimes seen, often not | evaporation, convection, dissolved gas, supercooling spread and the definition of "frozen" all enter ([[the-mpemba-effect]]) | many hundreds of identical runs with a fixed criterion, reporting the spread of freezing temperatures |
| **What is water in a nanometre channel?** | two layers between graphene sheets form square ice at room temperature (Algara-Siller and colleagues, 2015); water flows through carbon nanotubes far faster than continuum theory predicts | how much of the bulk structure survives, how much the flow depends on wall chemistry, whether the effects scale up | atomic-resolution imaging and neutron scattering in pores of controlled width, with flow measured on single channels |
| **Is the water in a cell like bulk water?** | the first one or two layers around a protein move more slowly, and water takes part in folding, enzyme action and proton transport ([[hydration-shells-and-proteins]]) | whether the influence reaches beyond a few layers; claims of micrometre-thick "structured" zones have not been reproduced | in-cell NMR and terahertz measurements of living cells; hyperpolarised hydration-shell spectroscopy |

### Two cases in more detail
**Charged surfaces.** An air bubble in very pure water swims towards the positive electrode. The speed per unit field, the electrophoretic mobility, gives the zeta potential through $\\zeta = \\eta\\mu/(\\varepsilon_0\\varepsilon_r)$: a mobility of −3.9 × 10⁻⁸ m²/(V·s) means −50 mV. Hydroxide ions sticking to the surface is the textbook answer; other work, including simulations and spectroscopy of oil droplets, argues instead for a transfer of charge from the water to the surface. How far the charge reaches is set by the Debye length, $\\lambda_D = \\sqrt{\\varepsilon_0\\varepsilon_r k_B T/(2 N_A e^2 I)}$: 0.96 µm in pure water (ionic strength $10^{-7}$ mol/L) and 0.96 nm in 0.1 mol/L salt — a thousand times shorter.

**Structure.** The old textbook picture of a distorted tetrahedral network and the 2004 "rings and chains" proposal predict different numbers of strong hydrogen bonds per molecule, and the data were consistent with both until the interpretation of the spectra was improved. It matters because every theory of water's anomalies starts from a structure ([[two-liquids-in-one]]).

### What is settled
The energy and lifetime of the hydrogen bond, the existence and structures of the ices, and the thermodynamic anomalies as facts. It is the *why* that is open. The simulation shows the central case: the same data below −30 °C are fitted equally well by a divergence and by a peak.

> [!key] What is open is mechanism rather than fact: whether water is two liquids, how its molecules are really bonded, why surfaces charge, whether hot water can freeze first, what happens in a nanometre of space, and how far the cell's water is changed by the molecules in it. For each there is an experiment — usually faster, colder, cleaner or smaller — that would help.`,
  ideas: [`The liquid–liquid critical point, the structure of the liquid, the charge of its surfaces, the Mpemba effect, confined water and the water in cells are all open.`, `The 2004 "rings and chains" proposal and the tetrahedral picture predict different numbers of strong bonds per molecule; the data were compatible with both for years.`, `Bubbles and oil drops in pure water are negatively charged (zeta potential of tens of millivolts); the origin is disputed.`, `Two layers of water between graphene sheets form square ice at room temperature; water flows through carbon nanotubes far faster than continuum theory predicts.`],
  pitfalls: [`"We do not understand water at all" — The hydrogen bond, the ices and the anomalies as facts are settled; it is the mechanism of some anomalies that is open.`, `"Water has a memory" or "structured water persists" — Bulk liquid water loses its structure in about a picosecond; claims of long-lived structure, including homeopathic memory, have not survived controlled tests.`, `"The Mpemba effect is a proven law" — In water it is sometimes seen and sometimes not, depending on conditions; in some other systems a version of it is firmly established.`],
  terms: [
    { term: `Zeta potential`, also: [`ζ-potential`, `electrokinetic potential`], def: `The electric potential at the slipping plane of a particle, bubble or drop moving in a liquid. For air bubbles and oil drops in pure water it is negative, of tens of millivolts.` },
    { term: `Debye length`, also: [`screening length`], def: `The distance over which the charge of a surface is screened by the ions in the liquid: $\\lambda_D = \\sqrt{\\varepsilon_0\\varepsilon_r k_B T/(2N_A e^2 I)}$; 0.96 µm in pure water and 0.96 nm in 0.1 mol/L salt.` },
    { term: `Rings-and-chains picture`, also: [`two-bond water`], def: `The 2004 proposal that most molecules in liquid water make only about two strong hydrogen bonds, forming chains and rings, in contrast to the tetrahedral network. Disputed.` },
    { term: `Confined water`, also: [`nanoconfined water`], def: `Water held in a space a few molecules wide — a nanotube, a graphene sandwich, a protein cavity, a membrane channel. Its structure, freezing and flow differ from the bulk's.` },
    { term: `Square ice`, also: [`two-dimensional ice`], def: `A layer of water molecules arranged in a square lattice, seen between graphene sheets about a nanometre apart at room temperature by Algara-Siller and colleagues (2015).` }
  ],
  formulas: [
    { name: `Zeta potential from electrophoretic mobility`, expr: `zeta = eta*mu/(eps0*epsr)`, tex: `\\zeta = \\frac{\\eta\\,\\mu}{\\varepsilon_0\\,\\varepsilon_r}`,
      vars: { zeta: { name: `zeta potential`, q: `voltage`, unit: `mV`, tex: `\\zeta`, signed: true }, eta: { name: `viscosity`, q: `viscosity`, unit: `mPa·s`, value: 0.89, tex: `\\eta` }, mu: { name: `electrophoretic mobility`, unit: `m²/(V·s)`, value: -3.9e-8, tex: `\\mu`, signed: true, hint: `About −3 to −5 × 10⁻⁸ m²/(V·s) for an air bubble in pure water; negative means it moves towards the positive electrode.` }, eps0: { const: `eps0` }, epsr: { name: `dielectric constant`, value: 78.4, tex: `\\varepsilon_r`, min: 1 } },
      solveFor: `zeta`, note: `The Smoluchowski limit, valid when the Debye length is much smaller than the particle — as in salty water; for bubbles in very pure water it is only approximate.`,
      stories: { zeta: `A bubble in water of {eta} and dielectric constant {epsr} has an electrophoretic mobility of {mu}. What is its zeta potential?` } },
    { name: `Debye length`, expr: `lam = sqrt(eps0*epsr*kB*T/(2*NA*qe^2*I))`, tex: `\\lambda_D = \\sqrt{\\frac{\\varepsilon_0\\,\\varepsilon_r\\, k_B\\, T}{2\\, N_A\\, e^2\\, I}}`,
      vars: { lam: { name: `Debye length`, q: `length`, unit: `nm`, tex: `\\lambda_D` }, eps0: { const: `eps0` }, epsr: { name: `dielectric constant`, value: 78.4, tex: `\\varepsilon_r`, min: 1 }, kB: { const: `kB` }, T: { name: `temperature`, q: `temperature`, unit: `°C`, value: 25, min: 0, max: 100 }, NA: { const: `NA` }, qe: { const: `qe` }, I: { name: `ionic strength`, q: `concentration`, unit: `mol/L`, value: 1e-7, tex: `I`, hint: `10⁻⁷ mol/L for pure water at 25 °C (from H⁺ and OH⁻ alone); 0.1 mol/L for dilute salt.` } },
      solveFor: `lam`, note: `For a monovalent salt; it falls with the square root of the ionic strength.`,
      stories: { lam: `Water of dielectric constant {epsr} at {T} has an ionic strength of {I}. How far does the charge of a surface reach (the Debye length)?`, I: `A surface's charge is screened over {lam} in water at {T}. What is the ionic strength?` } }
  ],
  examples: [
    { title: `The zeta potential of a bubble`, q: `A bubble in pure water drifts with a mobility of −3.9 × 10⁻⁸ m²/(V·s). With η = 0.89 mPa·s and ε_r = 78.4, find its zeta potential.`,
      steps: [{ text: `Apply the Smoluchowski relation:`, tex: `\\zeta = \\frac{0.89\\times10^{-3} \\times (-3.9\\times10^{-8})}{8.854\\times10^{-12} \\times 78.4} = \\frac{-3.47\\times10^{-11}}{6.94\\times10^{-10}}` }],
      a: `$\\zeta = -0.050$ V, that is −50 mV: strongly negative, though the bubble is only air and water.` },
    { title: `How far a surface charge reaches`, q: `Find the Debye length of pure water (ionic strength 10⁻⁷ mol/L) and of 0.1 mol/L salt solution at 25 °C.`,
      steps: [`In SI units the ionic strengths are $10^{-4}$ and $100$ mol/m³.`, `Pure water: $\\sqrt{8.854\\times10^{-12} \\times 78.4 \\times 1.381\\times10^{-23} \\times 298.15/(2 \\times 6.022\\times10^{23} \\times (1.602\\times10^{-19})^2 \\times 10^{-4})} = 9.6\\times10^{-7}$ m.`, `For 0.1 mol/L the ionic strength is $10^{6}$ times larger than $10^{-7}$ mol/L, and the length falls as the square root of the ionic strength: a factor $1/\\sqrt{10^{6}} = 1/1000$.`],
      a: `0.96 µm in pure water and 0.96 nm in 0.1 mol/L salt. A charge on a bubble in pure water is felt across a thousand molecule diameters; in salty water, across three.` }
  ],
  quiz: [
    { q: `An air bubble in pure water, in an electric field, moves towards`, choices: [`the positive electrode`, `the negative electrode`, `neither`, `the one with the lower voltage, whichever it is`], a: 0, why: `Its surface is negatively charged (a zeta potential of tens of millivolts negative), so it is attracted to the positive electrode. Why it charges is still disputed.` },
    { q: `Long-lived "structured water", over hours or in homeopathic dilutions, has been confirmed by controlled experiments.`, a: false, why: `Hydrogen-bond networks in the bulk liquid rearrange in about a picosecond. Claims of water memory have failed controlled tests, as discussed under [[polywater-and-water-memory]].` },
    { q: `Why can one experiment not settle whether hot water freezes faster than cold?`, choices: [`it is a law`, `the outcome depends on conditions (supercooling, evaporation, convection, dissolved gas) and on what counts as "frozen"`, `water cannot be heated`, `freezing cannot be measured`], a: 1, why: `Results differ between set-ups, so many controlled repeats with a fixed definition are needed.` },
    { q: `What is the Debye length of pure water at 25 °C (ionic strength 10⁻⁷ mol/L), in nanometres?`, answer: 961, unit: `nm`, why: `$\\sqrt{\\varepsilon_0\\varepsilon_r k_B T/(2N_A e^2 I)}$ with $I = 10^{-4}$ mol/m³ gives 0.96 µm.` },
    { q: `Which statement about water in cells is best supported?`, choices: [`all of it is structured for micrometres around each protein`, `the first one or two layers around a protein are slowed, while its influence beyond is debated`, `it behaves exactly like bulk water`, `it is frozen`], a: 1, why: `Hydration-shell water is slowed but whether the effect reaches farther is undecided; wide "exclusion zone" claims have not been reproduced.` }
  ],
  applications: [`Mineral processing: the charge of bubbles decides how they attach to particles in froth flotation.`, `Water treatment: coagulation and filtration depend on the zeta potential of colloids and the Debye length of the water.`, `Membranes and nanofluidics: desalination and energy-harvesting membranes exploit the fast flow and structure of water in nanometre pores.`, `Biology and medicine: hydration layers on proteins and drugs affect binding, and the interpretation of in-cell measurements depends on how different the water there is.`],
  history: `Wernet and colleagues' 2004 *Science* paper stirred the structure debate. Mpemba, a Tanzanian student, and Osborne, a physicist, published their observations in 1969. Holt and colleagues measured fast flow through carbon nanotubes in 2006, and Algara-Siller and colleagues imaged square ice in 2015. Philip Ball's 2017 review in *PNAS* is source 9 of this app.`,
  sources: [`Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) (source 9).`, `Wernet et al., "The structure of the first coordination shell in liquid water", *Science* 304, 995 (2004).`, `Algara-Siller et al., "Square ice in graphene nanocapillaries", *Nature* 519, 443 (2015).`, `Burridge and Linden, "Questioning the Mpemba effect: hot water does not cool more quickly than cold", *Scientific Reports* 6, 37665 (2016).`],
  sim: { id: `anom-divergence`, params: { peak: true } }
},

/* ================================================================ the strange reason */
{
  id: 'the-strange-reason', parent: 'the-anomalies', title: 'The strange reason', level: 3,
  short: `The whole argument in one chain: a bent molecule makes a bond strong enough to hold and weak enough to let go, and from it follow the liquid at Earth's temperatures, the floating ice, the heat reservoir, the solvent, the sculptor of proteins, the column in the tree and the oceans in the dark. The same weakness that makes water strange makes it fit for life.`,
  keywords: ['why water is strange', 'fitness of the environment', 'Henderson', 'anthropic', 'fine-tuning', 'life and water', 'summary', 'hydrogen bond', 'habitability', 'other solvents', 'water and life'],
  prereq: ['what-remains-unknown', 'the-list-of-anomalies', 'henderson-and-the-fitness-of-the-environment'],
  related: ['what-a-hydrogen-bond-is', 'why-ice-floats', 'specific-heat-of-water', 'the-matrix-of-life', 'could-life-use-another-liquid', 'the-search-follows-the-water', 'feynman:entropy-and-order', 'physics:thermal-expansion', 'chemistry:phase-diagrams'],
  body: `
Begin where the app began, with three molecules of nearly the same weight: methane, ammonia and water. Two are gases at every temperature a person has felt. The third is a liquid, floats when frozen, dissolves salt, carries the heat of the planet, lifts itself up a tree, and fills every living cell. The previous pages follow one idea through all of those consequences. Here it is, once, in order.

### The chain
| Link | The number | Where |
|---|---|---|
| A molecule bent at 104.45°, oxygen negative, hydrogens positive | dipole 1.855 D | [[the-bent-shape]], [[polarity-and-the-dipole]] |
| Two hydrogens to give, two lone pairs to receive: four bonds in a tetrahedron | 4 per molecule, 3.7 on average at 25 °C | [[two-donors-two-acceptors]], [[the-tetrahedral-network]] |
| A bond **strong enough to hold, weak enough to let go** | about 20 kJ/mol, 8 kT, a picosecond | [[what-a-hydrogen-bond-is]], [[bonds-that-flicker]] |
| So a liquid at Earth's temperatures | boils at 100 °C where the trend says −80 °C | [[the-boiling-point-anomaly]] |
| An open lattice, so floating ice, lakes frozen from the top | 8.3 % lighter | [[why-ice-floats]] |
| Heat taken up by bending bonds: the ocean as the planet's reservoir | 4.18 kJ/(kg·K) | [[specific-heat-of-water]], [[oceans-as-a-heat-reservoir]] |
| Strong dipoles that screen charge: the universal solvent | ε = 78 | [[the-dielectric-constant]], [[how-salt-dissolves]] |
| A skin of unsatisfied bonds | 72.8 mN/m | [[surface-tension]] |
| Oil pushed away, proteins folded, membranes assembled: the sculptor in the cell | the hydrophobic effect | [[the-hydrophobic-effect-folds-proteins]], [[the-matrix-of-life]] |
| Cohesion strong enough for a column under tension | 120 m or more in a tree | [[the-height-limit-of-trees]] |
| Older than the Sun, and under ice on Europa and Enceladus | 30–50 % of ocean water predates the Sun | [[water-older-than-the-sun]], [[europa]], [[enceladus]] |

Read down the right-hand column and no number is exotic. Each is a modest multiple of the thermal energy. That is the point: the hydrogen bond is worth eight thermal energies at the temperature of the Earth's surface.

### The anomalies are the same bond, seen at the edge
Every anomaly in this branch is the visible edge of one balance: an open, ordered, bonded structure and a compact, disordered one are almost equal in free energy — a few kilojoules per mole at most, in the fits made here. Cool the water and order wins; warm it and disorder wins; at the crossover the liquid can slip between them with tiny pushes, so its heat capacity, compressibility and density fluctuations are enormous ([[heat-capacity-and-compressibility-anomalies]]). Whether the two structures are really two liquids, with a hidden critical point, is the open question ([[two-liquids-in-one]], [[what-remains-unknown]]). The competition between energy (which prefers the order) and entropy (which prefers the mess) is the same one that governs all of statistical physics ([[feynman:entropy-and-order]]).

### Henderson's question
In 1913 the Harvard physiologist Lawrence Henderson published *The Fitness of the Environment* (source 13), arguing that the properties of water — heat capacity, latent heats, solvent power, surface tension, expansion on freezing — are each extreme and each matter for life, so that the environment is as fit for life as life is for the environment ([[henderson-and-the-fitness-of-the-environment]]). He had no cause to offer; the hydrogen bond was named seven years later. The cause is the thing this app adds: Henderson's list of coincidences is **one** coincidence — that the hydrogen bond is worth about eight thermal energies at the temperature of a planet near a star like the Sun.

How seriously to take it is argued. The **anthropic** reading says the match is a condition of our being here to notice it; its critics reply that this is a selection effect, not an explanation: we could only have evolved where something fit. Others point out that life is built for water, so of course it fits, and that other liquids exist — ammonia, formamide, hydrogen fluoride, sulfuric acid, the methane and ethane lakes of Titan at 94 K — which have not been shown unable to host some chemistry ([[could-life-use-another-liquid]]). A scaling argument sets the width of the target: multiply the strength of the bond by a factor and, with the planet held fixed, freezing and boiling scale with it. Weaken the bond by a quarter and Earth's 15 °C mean is steam; strengthen it by 6 % and it is ice.

### The same weakness
The thing that makes water strange is its poise: a bond that is only just stronger than thermal agitation. A stronger network would be a rigid solid, a weaker one a gas or a simple liquid with no hydrophobic effect and no anomalies. The poise is also what life needs. A folded protein is stable by only 20–60 kJ/mol — two to three hydrogen bonds' worth, out of thousands of interactions — so it folds and unfolds, binds and lets go, at the energy scale at which water rearranges. Membranes assemble and fall apart, protons hop along chains of water, an enzyme shuffles its substrate in and out, and each of those is possible because the medium is neither rigid nor loose. The strangeness and the fitness have one cause: a liquid held together by bonds that are strong enough to hold, and weak enough to let go.

> [!key] Water is strange because a bond worth about eight thermal energies holds an open structure and a compact one in near balance, so that everything responds. Life uses water because its own machinery works at that same scale: stable enough to be something, loose enough to change.`,
  ideas: [`One idea runs through every branch: the bent molecule makes a hydrogen bond worth about 20 kJ/mol — eight thermal energies at Earth's temperature — strong enough to hold and weak enough to let go.`, `The liquid range, floating ice, heat capacity, solvent power, surface tension, cohesion in trees and the anomalies all follow from that bond.`, `Henderson (1913) noticed the "fitness" of water for life as a list of coincidences; the hydrogen bond shows it is one coincidence — the bond energy relative to planetary temperatures.`, `The anthropic and fine-tuning readings are disputed: a selection effect may explain the match, and other liquids have not been ruled out.`],
  pitfalls: [`"Water is the only liquid that could support life" — That is not shown; the argument is that water is exceptionally well suited, not that it is unique ([[could-life-use-another-liquid]]).`, `"The fitness of water proves design" — The same facts support design, selection effects or neither; the physics only says the match is not a list of independent coincidences.`, `"Anomalous means harmful" — The anomalies are the opposite: signs of a balance that makes water responsive, which is what a solvent for chemistry needs.`],
  terms: [
    { term: `Fitness of the environment`, also: [`Henderson's fitness`, `fitness`], def: `L. J. Henderson's 1913 idea that the physical and chemical properties of water, carbon dioxide and carbon are uniquely suited to life, so that the environment is fit for life as life is fit for its environment.` },
    { term: `Anthropic reasoning`, also: [`anthropic principle`], def: `The argument that conditions we observe must be compatible with our existence, because we could not observe otherwise. It explains a selection effect; whether it explains more is disputed.` },
    { term: `Selection effect`, also: [`observer selection`], def: `A bias in what is observed because of how the observer comes to be there: we find ourselves on a planet with liquid water because we could not have evolved elsewhere.` },
    { term: `Marginal stability`, also: [`marginal stability of proteins`], def: `The fact that a folded protein is only 20–60 kJ/mol more stable than its unfolded state, a few hydrogen bonds' worth out of thousands of interactions, so that it can change shape at the energy scale of water's bonds.` },
    { term: `Universal solvent`, also: [`alkahest`], def: `The common description of water's ability to dissolve more substances than any other liquid, from the dielectric constant of 78 and the ability to hydrogen-bond with solutes. Not quite universal: oils and many gases barely dissolve.` }
  ],
  formulas: [
    { name: `Where a change of state moves when the bond is scaled`, expr: `Tx = s*Tref`, tex: `T_x = s\\,T_\\text{ref}`,
      vars: { Tx: { name: `new temperature of the change of state`, q: `temperature`, unit: `K`, tex: `T_x` }, s: { name: `bond strength relative to water's`, value: 1, min: 0.3, max: 3 }, Tref: { name: `water's temperature of the change`, q: `temperature`, unit: `K`, value: 373.15, tex: `T_\\text{ref}`, hint: `273.15 K for freezing, 373.15 K for boiling, 277.13 K for the density maximum.` } },
      solveFor: `Tx`, note: `A scaling argument: with the molecule and every other ratio held fixed, all such temperatures scale with the bond energy.`,
      stories: { Tx: `The hydrogen bond is {s} times water's. If water boils at {Tref}, where does this "water" boil?`, s: `A liquid boils at {Tx} where water boils at {Tref}. How strong is its bond relative to water's?` } },
    { name: `Bond energy against thermal energy`, expr: `r = Eb/(R*T)`, tex: `r = \\frac{E_b}{RT}`,
      vars: { r: { name: `bond energy in units of RT`, hint: `About 8 for the hydrogen bond at Earth's surface.` }, Eb: { name: `bond energy`, q: `molarenergy`, unit: `kJ/mol`, value: 20 }, R: { const: `R` }, T: { name: `temperature`, q: `temperature`, unit: `°C`, value: 15, min: -50, max: 200 } },
      solveFor: `r`, note: `The ratio that decides whether a bond holds and whether it lets go.`,
      stories: { r: `A bond is worth {Eb}. How many thermal units is that at {T}?` } },
    { name: `Stability of a protein in hydrogen-bond units`, expr: `n = dG/Eb`, tex: `n = \\frac{\\Delta G}{E_b}`,
      vars: { n: { name: `hydrogen-bond equivalents`, hint: `A folded protein is stable by only a few.` }, dG: { name: `free-energy gain on folding`, q: `molarenergy`, unit: `kJ/mol`, value: 40, tex: `\\Delta G`, hint: `20–60 kJ/mol for most globular proteins.` }, Eb: { name: `energy of one hydrogen bond`, q: `molarenergy`, unit: `kJ/mol`, value: 20 } },
      solveFor: `n`, note: `Proteins are marginally stable by design: their stability is a small difference between very large opposing terms.`,
      stories: { n: `A protein is stabilised by {dG} on folding. How many hydrogen bonds' worth is that, at {Eb} each?` } }
  ],
  examples: [
    { title: `Turn the bond down by a quarter`, q: `If the hydrogen bond were 0.75 of its real strength and nothing else changed, where would "water" boil and freeze, and what would a 15 °C planet be?`,
      steps: [`Boiling: $0.75 \\times 373.15 = 279.9$ K, or 6.7 °C.`, `Freezing: $0.75 \\times 273.15 = 204.9$ K, or −68 °C.`, `A planet at 15 °C (288 K) is above the boiling point.`],
      a: `The liquid would exist between −68 and +7 °C. At 15 °C the oceans would be vapour: the window is narrow, with the actual bond only slightly inside it.` },
    { title: `A protein is a few bonds`, q: `A protein is more stable folded than unfolded by 40 kJ/mol. How many hydrogen bonds is that?`,
      steps: [{ text: `Divide by the bond energy:`, tex: `n = \\frac{40}{20} = 2` }, `A medium protein makes several hundred hydrogen bonds in folding, and loses as many with the water it was bonded to.`],
      a: `Two hydrogen bonds' worth. The folded state wins by a hair out of a huge balance of large opposing terms — it is marginally stable, so a few degrees of temperature or one mutation can undo it.` }
  ],
  quiz: [
    { q: `If the hydrogen bond were 25 % weaker and nothing else changed, Earth's mean surface temperature of 15 °C would be`, choices: [`below the freezing point of the new "water"`, `above its boiling point`, `exactly at its melting point`, `unchanged`], a: 1, why: `With every state change scaled by 0.75 the new boiling point is 280 K (7 °C), below Earth's mean 288 K.` },
    { q: `Henderson explained the fitness of water in 1913 in terms of the hydrogen bond.`, a: false, why: `He catalogued the extreme properties and argued they fit life; the hydrogen bond was named by Latimer and Rodebush in 1920 and became the common cause.` },
    { q: `The main objection to treating the match between water and life as evidence of design is`, choices: [`water is not fit for life`, `a selection effect: observers can only arise where conditions allow, and life is built for the water it has`, `water has no properties`, `the hydrogen bond does not exist`], a: 1, why: `The match is what we should expect to see whatever the cause; the physics narrows the coincidence to a single one but does not by itself decide its meaning.` },
    { q: `In units of RT, how large is a 20 kJ/mol hydrogen bond at 15 °C (288.15 K)?`, answer: 8.3, why: `$20{,}000/(8.314 \\times 288.15) = 8.35$.` },
    { q: `Why are the anomalies of water and its fitness for life connected?`, choices: [`they are not`, `both arise from a bond just strong enough to hold, giving a poised, responsive liquid whose energy scale matches that of biomolecules`, `anomalies are caused by life`, `life made the hydrogen bond`], a: 1, why: `The same weakness of the bond leaves the liquid near a balance (large responses) and makes folding, binding and proton transport possible at the thermal scale.` }
  ],
  applications: [`Astrobiology: the search for life follows the water because a liquid with these properties is the best-known setting for chemistry ([[the-search-follows-the-water]]).`, `Habitable-zone estimates: the range of orbits where a planet can hold liquid water scales from the temperatures set here ([[the-habitable-zone]]).`, `Teaching: the chain of this page is a map of the whole subject, and each link is a page above.`, `Design of alternative solvents and biochemistries: understanding which parts of water's behaviour a replacement must reproduce ([[could-life-use-another-liquid]]).`],
  history: `Henderson (1878–1942), a physician, chemist and sociologist at Harvard, published *The Fitness of the Environment* in 1913 and *The Order of Nature* in 1917. Latimer and Rodebush named the hydrogen bond in 1920. The anthropic arguments grew from Brandon Carter's 1974 lecture, and the question of other solvents was treated by a United States National Research Council committee in 2007.`,
  sources: [`Henderson, *The Fitness of the Environment* (Macmillan, 1913), esp. ch. 3–6 (source 13).`, `Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) (source 9).`, `National Research Council, *The Limits of Organic Life in Planetary Systems* (National Academies Press, 2007).`, `Barrow and Tipler, *The Anthropic Cosmological Principle* (Oxford University Press, 1986).`],
  sim: `anom-bond-dial`
}
);
