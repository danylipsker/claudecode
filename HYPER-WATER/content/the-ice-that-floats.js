/* HYPER-WATER · content/the-ice-that-floats.js — the topic "The ice that floats". The first concept of the topic,
 * why-ice-floats, is written in reference.js; this file holds the other nine:
 *   the-density-maximum  lakes-freeze-from-the-top  icebergs-and-sea-ice  frost-wedging-and-burst-pipes  snowflakes
 *   why-ice-is-slippery  supercooling-and-nucleation  glaciers-flow  the-mpemba-effect
 * The simulations are in sims/the-ice-that-floats.js (ids ice-…).
 */
Hyper.add(

/* ================================================================ the density maximum */
{
  id: 'the-density-maximum', parent: 'the-ice-that-floats', title: 'The density maximum at 4 °C', level: 2,
  short: 'Cool water from room temperature and it grows denser, as any liquid does — until 3.98 °C. Below that it grows lighter again, so water at 0 °C floats on water at 4 °C. The effect is a part in ten thousand, and it decides which way a lake turns over.',
  keywords: ['density maximum', 'maximum density', '4 degrees', '3.98', 'temperature of maximum density', 'negative thermal expansion', 'anomalous expansion', 'water expands on cooling', 'heavy water', 'D2O', 'salt', 'sea water'],
  prereq: ['why-ice-floats', 'the-structure-of-liquid-water', 'physics:thermal-expansion'],
  related: ['lakes-freeze-from-the-top', 'icebergs-and-sea-ice', 'density-and-expansion-anomalies', 'the-list-of-anomalies', 'isotopes-and-heavy-water', 'thermal-expansion-of-the-sea', 'hydraulics:density-specific-weight'],
  body: `
Take a glass of water from the tap at 20 °C and put it in a refrigerator. At first it does what every liquid does: it contracts, so each litre weighs a little more. At 4 °C it stops. Cool it further, to 3, to 2, to 1, and the water *expands* again; at 0 °C a litre weighs 130 milligrams less than at 4 °C. Warm it from 0 °C and the first four degrees make it **shrink**. Water is the only common liquid that behaves like this, and the turning point, at **3.98 °C**, is the temperature of maximum density.

### The numbers
| Temperature | Density (kg/m³) | Expansion coefficient (ppm/K) |
|---|---|---|
| 0 °C | 999.84 | −68 |
| 2 °C | 999.94 | −33 |
| **3.98 °C** | **999.97** | **0** |
| 6 °C | 999.94 | +31 |
| 10 °C | 999.70 | +88 |
| 20 °C | 998.21 | +207 |
| 100 °C | 958.36 | +750 |

The USGS Water Science School tabulates the same curve in grams per cubic centimetre: 0.99987 at 0 °C, 1.00000 at 4 °C, 0.99802 at 21 °C, 0.99318 at 37.8 °C and 0.95865 at 100 °C. The hump is a mere 0.013 % tall, yet in nature it is enormous, because it is *where the water stops sinking*.

### Two effects pulling in opposite directions
Ordinary thermal expansion is a vibration effect: warmer molecules swing wider in their wells and take more room. Water has a second effect on top of it. Liquid water is a flickering network ([[the-structure-of-liquid-water]]) in which small patches hold the open, tetrahedral arrangement of ice ([[why-ice-floats]]). The colder the water, the more of those open patches it contains and the more room they take. Warm water from 0 °C upwards and the open patches collapse, which *raises* the density, while ordinary expansion *lowers* it. Below 3.98 °C the collapse wins; above, the vibrations do. Near the top of the hump the density follows a parabola, $\\rho \\approx \\rho_\\text{max}\\,[1 - k (T - 3.98)^2]$ with $k \\approx 8\\times10^{-6}\\ \\mathrm{K^{-2}}$, which is good to a few hundredths of a kg/m³ between 0 and 10 °C.

### What moves the maximum
- **Salt** pulls it down, by about 0.22 K for every gram of salt per kilogram, while the freezing point falls only 0.054 K per g/kg. At about **25 g/kg** the two lines cross: sea water at 35 g/kg would have its maximum at about −3.6 °C, but it freezes at −1.9 °C first. *Sea water has no density maximum on this side of freezing.*
- **Pressure** lowers it too; at the bottom of a deep lake the maximum is a little below 4 °C.
- **Heavy water** ([[isotopes-and-heavy-water]]) has its maximum at 11.2 °C, where it is 1105.3 kg/m³, but freezes at 3.82 °C. It reaches freezing before the hump, which is why $\\ce{D2O}$ is a "normal" liquid in the cold.

### A footnote in the history of units
The French Revolutionary gram was first defined as the mass of a cubic centimetre of water at the temperature of melting ice, but the standard of 1799 was based on water at its maximum density, 4 °C, where small errors in the thermometer hardly matter. From 1901 to 1964 the litre was defined as the volume of a kilogram of water at maximum density — which made it 1.000028 cubic decimetres and caused a generation of small confusions.

> [!key] Water contracts on cooling until 3.98 °C and expands below it, because the open, ice-like patches in the liquid win over ordinary thermal contraction. The effect is only 0.013 % in density, but it makes the coldest water float — the reason lakes freeze from the top — and salt moves the maximum below the freezing point.`,
  ideas: ['Water is densest at 3.98 °C (999.97 kg/m³); at 0 °C it is 0.013 % lighter, and between 0 and 4 °C it shrinks when warmed.', 'Two effects compete: ordinary thermal expansion, and the collapse of open, ice-like patches on warming.', 'Salt lowers the maximum by 0.22 K per g/kg and the freezing point by only 0.054 K per g/kg: above about 25 g/kg the maximum is never reached.', 'Heavy water\'s maximum is at 11.2 °C and it freezes at 3.8 °C, so it freezes before reaching it.'],
  pitfalls: ['"Water is densest when it freezes" — The liquid is densest at 3.98 °C. At 0 °C it is lighter, and the solid is lighter still: freezing is a second, separate expansion of 9 %.', '"The density maximum is why ice floats" — Related, not the same. Ice floats because the solid is 8 % less dense than the liquid; the maximum sits at 4 °C inside the liquid, and the two share a cause only in the sense that both come from the open tetrahedral structure.', '"Sea water also turns over at 4 °C" — Above about 25 g/kg salt, there is no maximum before freezing; the surface keeps sinking as it cools until it reaches −1.9 °C.'],
  terms: [
    { term: 'Temperature of maximum density', also: ['density maximum', 'TMD', 'T_max'], def: 'The temperature at which a liquid\'s density is highest at a given pressure. For pure water at 1 atm it is 3.98 °C (999.97 kg/m³); a normal liquid has none, becoming denser all the way down to freezing.' },
    { term: 'Negative thermal expansion', also: ['anomalous expansion'], def: 'Shrinking, rather than growing, when warmed. Water does so between 0 and 3.98 °C, with an expansion coefficient of −68 ppm/K at 0 °C.' },
    { term: 'Volumetric expansion coefficient', also: ['thermal expansion coefficient', 'beta', 'α_V'], def: 'The fractional change in volume per kelvin, $\\beta = (1/V)\\,\\mathrm{d}V/\\mathrm{d}T$. Water: +207 ppm/K at 20 °C, zero at 3.98 °C, −68 ppm/K at 0 °C.' },
    { term: 'Open patch', also: ['low-density structure', 'ice-like patch'], def: 'A small region of liquid water in which the molecules hold the four-neighbour tetrahedral arrangement of ice and so take more room. Cooling makes them more numerous; warming breaks them up.' },
    { term: 'Salinity', also: ['practical salinity', 'g/kg'], def: 'The mass of dissolved salts per kilogram of water: about 35 g/kg in the open ocean. It lowers both the freezing point and the temperature of maximum density.' }
  ],
  formulas: [
    { name: 'Density near the maximum', expr: 'rho = rhoMax*(1 - k*(T - Tm)^2)', tex: '\\rho = \\rho_\\mathrm{max}\\left[1 - k\\,(T - T_m)^2\\right]',
      vars: { rho: { name: 'density', q: 'density', unit: 'kg/m³', tex: '\\rho' }, rhoMax: { name: 'maximum density', q: 'density', unit: 'kg/m³', value: 999.97, tex: '\\rho_\\mathrm{max}', hint: '999.97 kg/m³ for pure water at 1 atm; 1105.3 for heavy water.' }, k: { name: 'curvature of the hump', unit: '1/K²', value: 8e-6, fixed: true, hint: 'About 8 × 10⁻⁶ per kelvin squared for water, fitted between 0 and 10 °C.' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 10, min: -2, max: 12 }, Tm: { name: 'temperature of maximum density', q: 'temperature', unit: '°C', value: 3.98, hint: '3.98 °C for pure water; about −3.6 °C for sea water, which freezes first.' } },
      solveFor: 'rho', note: 'A parabola, accurate to a few hundredths of a kg/m³ within about 6 K of the maximum; farther out use the full density table.',
      stories: { rho: 'Pure water is at {T}. Using the parabola about its maximum at {Tm}, what is its density?', T: 'Water has a density of {rho}. At what temperature is it, between the maximum at {Tm} and the warm side?' } },
    { name: 'Volume change when warmed', expr: 'dV = beta*V*dT', tex: '\\Delta V = \\beta\\,V\\,\\Delta T',
      vars: { dV: { name: 'change in volume', q: 'volume', unit: 'mL', signed: true, tex: '\\Delta V' }, beta: { name: 'expansion coefficient', q: 'expansion', unit: 'ppm/K', value: -68, signed: true, tex: '\\beta', hint: '−68 ppm/K at 0 °C, 0 at 3.98 °C, +207 ppm/K at 20 °C.' }, V: { name: 'volume of water', q: 'volume', unit: 'L', value: 10 }, dT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 2, signed: true, tex: '\\Delta T' } },
      solveFor: 'dV', note: 'For small changes with β taken at the middle of the range. Between 0 and 4 °C the sign of β is negative, so warming makes water shrink.',
      stories: { dV: 'A bucket holds {V} of water at 0 °C. It is warmed by {dT}. What is the change in its volume?' } },
    { name: 'Temperature of maximum density of salt water', expr: 'Tmd = T4 - c*S', tex: 'T_\\mathrm{md} = T_4 - c\\,S',
      vars: { Tmd: { name: 'temperature of maximum density', q: 'temperature', unit: '°C', signed: true, tex: 'T_\\mathrm{md}' }, T4: { name: 'maximum for pure water', q: 'temperature', unit: '°C', value: 3.98, fixed: true, tex: 'T_4' }, c: { name: 'shift for a whole mass fraction of salt', unit: 'K', value: 216.9, fixed: true, hint: 'About 0.22 K of lowering for every gram of salt per kilogram of water, i.e. 217 K per unit mass fraction (a fit to measurements, valid up to sea-water salinity).' }, S: { name: 'salinity (grams of salt per kilogram, shown in ‰)', q: 'ratio', unit: '‰', value: 35, min: 0, max: 40, hint: '35 ‰ (35 g/kg) for the open ocean, about 8 in the Baltic, 0 in a lake.' } },
      solveFor: 'Tmd', note: 'Compare with the freezing point, about $-0.0543\\,S$ °C: when Tmd falls below it the water never reaches its maximum.',
      stories: { Tmd: 'Water holds {S} of salt. What is its temperature of maximum density?', S: 'The maximum density of some water lies at {Tmd}. How much salt does it contain?' } }
  ],
  examples: [
    { title: 'Does the sea have a density maximum?', q: 'Sea water has 35 g/kg of salt and freezes at −1.9 °C. Find its temperature of maximum density and say what the sea does as it cools.',
      steps: [{ text: 'The maximum:', tex: 'T_\\mathrm{md} = 3.98 - 0.2169 \\times 35 = -3.6\\ ^\\circ\\mathrm{C}' }, 'That is below the freezing point, so the water freezes while it is still getting denser.', 'A cooled surface layer therefore keeps sinking all the way to −1.9 °C; the whole mixed layer must reach freezing before ice can form.', 'The crossing salinity: $3.98 - 0.2169\\,S = -0.0543\\,S$ gives $S = 24.5$ g/kg. Brackish water below that, like the Baltic at about 8 g/kg, behaves like a lake.'],
      a: 'Tmd ≈ −3.6 °C, below freezing: sea water has no density maximum on its liquid side, so it overturns until it freezes.' },
    { title: 'How much does a bucket shrink?', q: 'A 10 L bucket of water at 0 °C is warmed to 4 °C. By how much does its volume change?',
      steps: ['Use the densities: 999.840 kg/m³ at 0 °C and 999.972 at 3.98 °C.', { text: 'The volume of the same mass falls by the ratio:', tex: '\\frac{\\Delta V}{V} = \\frac{999.840}{999.972} - 1 = -1.3\\times10^{-4}' }, 'So the 10 L shrinks by $10 \\times 1.3\\times10^{-4}$ L = 1.3 mL.'],
      a: 'About 1.3 mL — a thimbleful out of a bucket — yet enough to make the 4 °C water the heaviest in a lake.' }
  ],
  quiz: [
    { q: 'A glass of water at 1 °C is warmed gently to 3 °C. Its volume', choices: ['grows slightly', 'shrinks slightly', 'stays exactly the same', 'depends on the glass'], a: 1, why: 'Below 3.98 °C the collapse of ice-like patches dominates, so warming makes the water denser and the volume smaller. Above 4 °C the usual expansion takes over.' },
    { q: 'Which sample of water would be at the bottom of a still pond?', choices: ['0 °C', '2 °C', '3.98 °C', '10 °C'], a: 2, why: 'The densest water sinks and stays. At 3.98 °C water is at its maximum density, 999.97 kg/m³, heavier than the 10 °C water above it and the 0 °C water.' },
    { q: 'Sea water at 35 g/kg has its density maximum at about −3.6 °C. What follows?', choices: ['It must freeze at −3.6 °C', 'It freezes at −1.9 °C before reaching it, so it never has the "cold and light" layer of a lake', 'It cannot be cooled below 4 °C', 'Its ice sinks'], a: 1, why: 'Freezing at −1.9 °C comes first, so cooling always makes the surface water denser and it keeps sinking until the ice forms. The inverse stratification of a freshwater lake does not occur.' },
    { q: 'Heavy water (D₂O) freezes at 3.82 °C and has its density maximum at 11.2 °C. In a cold D₂O lake, the coldest water would be found', choices: ['at the top', 'at the bottom', 'evenly mixed', 'there is no lake'], a: 1, why: 'Heavy water freezes before reaching its maximum, so it behaves like an ordinary liquid in the cold: colder means denser, and the coldest water, and the ice, sit at the bottom.' },
    { q: 'The hump in water\'s density between 0 and 4 °C is only about 0.013 %, so it can safely be ignored in understanding lakes.', a: false, why: 'The size of the effect does not matter; its sign does. A denser layer sinks however slightly, so it fixes which water goes to the bottom and the whole winter structure of a lake.' }
  ],
  applications: ['Lakes: winter water is arranged with 0 °C at the top and 4 °C at the bottom, a cold lid on a warmer lake ([[lakes-freeze-from-the-top]]).', 'Oceanography: because sea water has no density maximum, surface cooling drives deep convection; it is one of the engines of the great ocean circulation ([[ocean-currents]]).', 'Metrology: the old definitions of the litre and kilogram, and today\'s practice of tabulating density against temperature in the laboratory.', 'Water engineering: reservoirs and district-cooling storage tanks hold the dense 4 °C water at the bottom and a thermocline above.'],
  history: 'Thomas Charles Hope, in Edinburgh in 1805, showed that fresh water is densest at about 4 °C and that salt water has no maximum above its freezing point; Despretz in 1837 found that salt lowers the maximum in proportion to its concentration.',
  sources: ['USGS Water Science School, "Water density" — the density table and the statement that lakes freeze from the top.', 'Kell, G. S., "Density, thermal expansivity, and compressibility of liquid water from 0° to 150 °C", *Journal of Chemical & Engineering Data* 20, 97 (1975) — the density curve.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4 (the density maximum and the mixture models).', 'Franks (ed.), *Water: A Comprehensive Treatise*, vol. 1 — thermodynamic anomalies and the effects of salt and pressure.'],
  sim: 'ice-density-curve'
},

/* ================================================================ lakes freeze from the top */
{
  id: 'lakes-freeze-from-the-top', parent: 'the-ice-that-floats', title: 'Lakes freeze from the top', level: 1,
  short: 'Because the coldest water floats and then freezes into a floating lid, a lake in winter is stratified upside down: ice on top, 0 °C beneath it, and water at 4 °C at the bottom, where the fish are. Twice a year the whole lake turns over.',
  keywords: ['lake', 'turnover', 'stratification', 'thermocline', 'inverse stratification', 'ice cover', 'fish survive winter', 'epilimnion', 'hypolimnion', 'dimictic', 'frozen pond', 'oxygen', 'if ice sank'],
  prereq: ['the-density-maximum', 'why-ice-floats'],
  related: ['icebergs-and-sea-ice', 'ocean-currents', 'sea-ice-and-albedo', 'thermal-conductivity-of-water', 'gases-in-water', 'physics:convection', 'hydraulics:density-specific-weight'],
  body: `
In January a pond in a cold country is a lid of ice with fish living under it. That is not obvious. The air is at −10 °C and the pond has been losing heat for weeks, yet only the top has frozen, and the water beneath the ice is liquid and at 4 °C near the bottom. The reason is the pair of facts of the last two pages: ice floats, and the densest water is at 3.98 °C.

### The four seasons of a lake
1. **Summer stratification.** Sun and warm air heat the surface. The warm top layer (the *epilimnion*) is lighter and floats on the cold bottom layer (the *hypolimnion*), with a steep temperature change between them, the *thermocline*. Wind stirs the top few metres; the bottom is cut off and its oxygen is slowly used up.
2. **Autumn turnover.** The surface cools. Cooler water is denser, sinks, and is replaced by water from below, so the layers mix, deeper each night, until the whole lake is at one temperature near 4 °C and wind can stir it end to end. The bottom gets oxygen again.
3. **Winter inverse stratification.** The surface cools below 4 °C. Now colder water is *lighter*, so it stays on top and cools without sinking until it reaches 0 °C and freezes. The lid of ice insulates, the lake below stays at 0 °C under the ice and near 4 °C at the bottom: warmest at the bottom, the reverse of summer.
4. **Spring turnover.** The ice melts, the surface warms to 4 °C and sinks, and the lake mixes top to bottom a second time before summer's stratification builds.

Lakes that do this are called *dimictic* ("mixing twice"). Tropical lakes never reach 4 °C and may stratify for years; very deep temperate lakes stay unfrozen until their whole depth has cooled to 4 °C, which can take a winter or more.

### The numbers
- **Ice as a lid.** Ice conducts heat at 2.2 W/(m·K), four times better than still water (0.56) but far worse than rock, and snow on top (0.1–0.3 W/(m·K)) insulates much better still. The lid thickens by Stefan's law, as the square root of the number of degree-days of frost: ten days at −10 °C builds about 35 cm in theory, 25 cm with snow.
- **Oxygen.** Cold water holds more: 14.6 mg/L at 0 °C against 9.4 at 20 °C. Under clear ice the water stays well supplied; under thick snow-covered ice, photosynthesis stops, decay continues, and fish can suffocate in a "winter kill".
- **Heat before ice.** A 10 m deep lake at 20 °C must lose about 700 MJ per square metre to reach 4 °C throughout; at a typical 100 W/m² that takes more than two months before the surface can freeze at all.

### The world without it
The USGS puts the thought experiment plainly: if ice were denser than water, lakes would freeze from the bottom up. The ice would settle in the cold deep water, where summer sun does not reach it; the surface would melt in summer and freeze again in winter while the pile on the bottom grew; and a lake in a cold climate might become solid and never thaw. The simulation lets you tick *If ice sank* and watch a lake in this alternative world lose its water to a growing pile over successive winters.

> [!key] Cold water below 4 °C is lighter and floats, and then freezes into a floating, insulating lid; so lakes freeze from the top, keep 4 °C water at the bottom through the winter and mix completely in spring and autumn. If ice sank, a lake would freeze from the bottom up and might never thaw.`,
  ideas: ['In winter the lake is stratified upside down: ice at 0 °C on top, 4 °C water at the bottom — the densest water sinks and stays.', 'In autumn and spring the whole lake passes through 4 °C and mixes top to bottom (turnover); in summer a warm top layer floats on a cold bottom layer.', 'The ice lid insulates: it thickens as the square root of the degree-days of frost, and snow on it slows the growth.', 'If ice sank, lakes would freeze from the bottom up and polar and temperate lakes might freeze solid for good.'],
  pitfalls: ['"Lakes freeze from the top because cold rises" — Cold water rises only below 4 °C. Above 4 °C, colder water sinks, and that is why a lake must first cool to 4 °C all through before its surface can fall below.', '"The bottom of a frozen lake is at 0 °C" — It is at about 4 °C: the densest water of all lies there, warmed very slowly by the ground.', '"Fish live because the ice keeps the cold out" — Part of the reason; the other part is that the water beneath cannot cool below 4 °C at the bottom without the surface freezing first, and under clear ice the oxygen holds out.'],
  terms: [
    { term: 'Turnover', also: ['lake overturn', 'spring and autumn mixing'], def: 'The complete mixing of a lake from top to bottom, which happens when the surface water is as dense as the water below: in autumn as the surface cools to 4 °C, and in spring as it warms to 4 °C after the ice goes.' },
    { term: 'Thermocline', also: ['metalimnion'], def: 'The depth range of a stratified lake in which temperature falls fastest with depth, separating the warm, mixed epilimnion from the cold hypolimnion.' },
    { term: 'Inverse stratification', also: ['winter stratification'], def: 'A layering in which the water is coldest at the top and warmest at the bottom (up to 4 °C), possible only because water is densest at 3.98 °C and not at its freezing point.' },
    { term: 'Dimictic lake', also: ['mixing twice a year'], def: 'A lake that mixes twice a year, in autumn and in spring, and is covered with ice and stratified in winter and stratified in summer; the usual type in cold-temperate regions.' },
    { term: 'Degree-days of frost', also: ['freezing degree-days'], def: 'The sum, over the days, of how many degrees the air is below freezing; ice thickness grows as the square root of it.' }
  ],
  formulas: [
    { name: 'Ice thickness by Stefan\'s law', expr: 'h = sqrt(2*k*dT*t/(rho*L))', tex: 'h = \\sqrt{\\frac{2\\,k\\,\\Delta T\\,t}{\\rho_i L}}',
      vars: { h: { name: 'ice thickness', q: 'length', unit: 'cm' }, k: { name: 'thermal conductivity of ice', q: 'thermcond', unit: 'W/(m·K)', value: 2.2, hint: '2.2 W/(m·K) for ice; snow is 0.1–0.3 and cuts the growth.' }, dT: { name: 'frost: freezing point minus air temperature', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T', hint: 'Taken constant; in practice sum the degree-days.' }, t: { name: 'time', q: 'time', unit: 'day', value: 10 }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho_i' }, L: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55 } },
      solveFor: 'h', note: 'The ideal case: the whole top of the ice at the air temperature, no snow, no wind, the water at 0 °C. Real lids are usually thinner.',
      stories: { h: 'The air stays {dT} below freezing for {t}. How thick would the ice be, by Stefan\'s law?', t: 'How long does it take {dT} of frost to build {h} of ice?' } },
    { name: 'Heat flow through the ice lid', expr: 'q = k*dT/h', tex: 'q = \\frac{k\\,\\Delta T}{h}',
      vars: { q: { name: 'heat flux up through the ice', q: 'intensity', unit: 'W/m²' }, k: { name: 'thermal conductivity of ice', q: 'thermcond', unit: 'W/(m·K)', value: 2.2 }, dT: { name: 'temperature difference across the ice', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T' }, h: { name: 'thickness of the ice', q: 'length', unit: 'cm', value: 30 } },
      solveFor: 'q', note: 'Thicker ice carries less heat, so growth slows: that is where the square root comes from.',
      stories: { q: 'A lid of ice {h} thick has {dT} between its bottom and its top. What heat flows through each square metre?' } },
    { name: 'Time to cool a lake to 4 °C', expr: 't = rho*cw*D*dT/q', tex: 't = \\frac{\\rho_w\\, c_w\\, D\\,\\Delta T}{q}',
      vars: { t: { name: 'time', q: 'time', unit: 'day' }, rho: { const: 'rhoW' }, cw: { const: 'cW' }, D: { name: 'depth of the lake', q: 'length', unit: 'm', value: 10 }, dT: { name: 'cooling needed', q: 'dtemp', unit: 'K', value: 16, tex: '\\Delta T', hint: 'From a late-summer 20 °C to 4 °C.' }, q: { name: 'mean heat loss to the air', q: 'intensity', unit: 'W/m²', value: 100, hint: 'Typical autumn losses are 50–150 W/m².' } },
      solveFor: 't', note: 'Before the surface can drop below 4 °C and freeze, the whole depth must come down to 4 °C; deep lakes take the longest.',
      stories: { t: 'A lake {D} deep must cool by {dT} before ice can form, losing {q} to the air. How long does it take?' } }
  ],
  examples: [
    { title: 'A cold fortnight', q: 'The air is at −12 °C for 14 days on a pond whose water is at 0 °C. What thickness of clear, snow-free ice does Stefan\'s law give, and what heat flows through it at the end?',
      steps: [{ text: 'With $\\Delta T = 12$ K and $t = 14\\times86400$ s:', tex: 'h = \\sqrt{\\frac{2\\times2.2\\times12\\times1.21\\times10^6}{917\\times3.3355\\times10^5}} = \\sqrt{0.209}\\ \\text{m} = 0.46\\ \\text{m}' }, { text: 'The flux through that ice is:', tex: 'q = \\frac{2.2\\times12}{0.46} \\approx 57\\ \\mathrm{W/m^2}' }],
      a: 'About 46 cm in theory (rather less with snow or wind), with 57 W/m² flowing out at the end; ten times more heat would pass through a lid a tenth as thick.' },
    { title: 'Why a deep lake freezes late', q: 'A lake 40 m deep is at 15 °C in November and loses 100 W/m². How long before the surface can start to freeze, and what is the equivalent for a 4 m pond?',
      steps: [{ text: 'The 40 m lake must lose $\\rho c_w D \\Delta T$ per square metre before its top can fall below 4 °C:', tex: 't = \\frac{1000\\times4186\\times40\\times11}{100} = 1.84\\times10^7\\ \\mathrm{s} \\approx 213\\ \\text{days}' }, 'The 4 m pond needs a tenth of it: about 21 days, and will freeze well before.'],
      a: 'About 7 months for the deep lake (so it may never freeze in a mild winter) against three weeks for the pond.' }
  ],
  quiz: [
    { q: 'In mid-winter, under a clear ice cover, a lake\'s bottom water is most likely at', choices: ['0 °C', 'about 4 °C', 'the air temperature', 'the same as the top'], a: 1, why: 'The densest water, at 3.98 °C, sinks to the bottom and stays there; the 0 °C water floats just under the ice. Winter bottom temperature is therefore about 4 °C, the reverse of summer\'s order.' },
    { q: 'In autumn, a lake surface cooling from 15 °C to 5 °C causes', choices: ['nothing: the lake is stable', 'the cooled water to sink, mixing the lake deeper each night', 'ice to form at the bottom', 'warm water to rise through the ice'], a: 1, why: 'Down to 4 °C, cooler surface water is denser than the water below and sinks, driving a convective turnover that deepens until the whole lake is at one temperature.' },
    { q: 'Ice in a lake is a good insulator because it is a very poor conductor of heat.', a: false, why: 'Ice conducts at 2.2 W/(m·K), four times better than still water. Its use as a lid is that it *stays on top*, stopping water-to-air contact and wind-driven mixing; snow, a far poorer conductor, adds the insulation.' },
    { q: 'Doubling the number of freezing degree-days multiplies the ice thickness by', choices: ['2', '$\\sqrt 2 \\approx 1.4$', '4', '1.1'], a: 1, why: 'Stefan\'s law: $h \\propto \\sqrt{\\Delta T\\,t}$. Thicker ice carries less heat, so growth slows; doubling the frost gives 41 % more ice.' },
    { q: 'If ice were denser than water, a lake in a cold climate would', choices: ['freeze at the same rate', 'freeze from the bottom up and might not thaw in summer', 'never freeze', 'stay mixed all winter'], a: 1, why: 'Ice would sink as it forms, collect in the cold deep water where the summer sun cannot reach it, and build up year after year; the surface would melt and refreeze while the pile grew.' }
  ],
  applications: ['Ice fishing, skating and ice roads: safe thickness is judged from Stefan-type growth, with 10 cm of clear ice a common minimum for walking.', 'Fish and lake ecology: the winter refuge at the bottom, winter kill under snowy ice, and the autumn and spring turnover that carries oxygen down and nutrients up.', 'Reservoir and drinking-water management: stratification traps manganese and low-oxygen water at the bottom until turnover mixes it through.', 'Climate records: the date a lake freezes and thaws is among the longest-running measurements, and it is moving later and earlier with warming (the Lake Suwa record in Japan goes back to the fifteenth century).'],
  history: 'The turnover of lakes was described by the Swiss limnologist François-Alphonse Forel at Lake Geneva in the 1870s–1890s, and the classification into dimictic, monomictic and other types was set out by G. E. Hutchinson in his four-volume *A Treatise on Limnology* (1957 onwards).',
  sources: ['USGS Water Science School, "Water density" — water at 4 °C sinks beneath colder water, so lakes freeze from the top; if ice sank, lakes would freeze from the bottom up and might never thaw.', 'Hutchinson, *A Treatise on Limnology*, vol. 1 (1957), chapters on thermal stratification and circulation.', 'Petrenko and Whitworth, *Physics of Ice*, ch. 11 (ice on lakes and the sea) — growth by Stefan\'s law.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4.'],
  sim: 'ice-lake-seasons'
},

/* ================================================================ icebergs and sea ice */
{
  id: 'icebergs-and-sea-ice', parent: 'the-ice-that-floats', title: 'Icebergs and sea ice', level: 2,
  short: 'An iceberg shows 11 % of itself above a sea that is denser than a lake. Sea ice is a different material: it forms at −1.9 °C as nearly fresh ice and throws its salt down into the water below, which becomes saltier, denser and sinks — one of the engines of the deep ocean.',
  keywords: ['iceberg', 'sea ice', 'Titanic', 'brine rejection', 'freezing point of sea water', 'brinicle', 'thermohaline circulation', 'bottom water', 'floating ice', 'freeboard', 'tip of the iceberg', 'pancake ice'],
  prereq: ['why-ice-floats', 'the-salt-of-the-sea', 'colligative-properties'],
  related: ['sea-ice-and-albedo', 'ocean-currents', 'lakes-freeze-from-the-top', 'glaciers-flow', 'how-much-water-earth-has', 'physics:buoyancy', 'hydraulics:buoyancy-archimedes'],
  body: `
Icebergs and sea ice are both ice floating in the sea, and they could hardly be more different. An iceberg is a piece of a glacier, fresh water that fell as snow centuries ago. Sea ice is frozen sea water. One is a few hundred metres across and weighs millions of tonnes; the other is a skin one or two metres thick that covers 15 million square kilometres of the Arctic in March. The first teaches Archimedes; the second teaches how freezing sorts the salt from the water.

### Icebergs: the nine-tenths
A floating body displaces its own weight of the liquid. Pure ice is 916.7 kg/m³ and sea water 1025 kg/m³, so $\\rho_\\text{ice}/\\rho_\\text{sea} = 0.894$: **89.4 % of an iceberg is submerged and 10.6 % shows.** Glacier ice carries air bubbles and is a little lighter (850–900 kg/m³), so more shows; a berg that has lost its snowy top shows less. In fresh water the submerged fraction would be 92 %: the sea lifts ice a little higher.

| Ice | Density (kg/m³) | Submerged in sea water (1025) |
|---|---|---|
| Pure ice Ih at 0 °C | 916.7 | 89.4 % |
| Glacier ice with bubbles | about 880 | 86 % |
| Packed snow, firn | 400–830 | 40–81 % |
| Sea ice with brine (young) | 900–920 | 88–90 % |

Because the freeboard (the part above water) is 10.6 % of the *thickness*, a berg 100 m high at the waterline rises 10.6 m and sinks 89.4 m below it — the "tip of the iceberg" of the idiom. The hidden part is why the *Titanic* could not turn aside in time on the night of 14–15 April 1912: the submerged ice extends beyond what can be seen, and lookouts saw the dark shape for less than a minute. Heat and waves melt and break a berg unevenly, so it rolls when its centre of mass rises above its centre of buoyancy.

### Sea ice: ice that rejects its salt
Sea water at 35 g/kg freezes at **−1.9 °C**, not 0 °C, because dissolved salt lowers the freezing point ([[colligative-properties]]; about 1.86 K per mole of particles per kilogram, and sea water holds about 1.1). The ice lattice has no room for sodium and chloride ions. As crystals form they push salt out, concentrating it in a *brine* that is trapped in pockets and channels (young sea ice holds 5–10 g/kg, multi-year ice 1–3) and in the layer of water just below the ice.

That brine is cold, very salty and dense. It drains down out of the ice as fast streams. In extreme cases, where it meets still-warmer sea water below, it freezes a hollow tube of ice around itself: a **brinicle**, an ice stalactite growing downwards. On a large scale the sinking brine thickens the water beneath: growing 1 m of ice from a 50 m mixed layer raises its salinity by about 0.55 g/kg. Around Antarctica, around the polynyas where winds keep making new ice, the salty cold water that results is the densest in the ocean and sinks to the bottom as Antarctic Bottom Water, spreading north across the floor of every ocean ([[ocean-currents]]).

### Floating ice and sea level
Melting floating ice does not raise the sea much. The ice displaced its own weight of sea water, and melts to a volume of fresh water a little *larger* than that, because sea water is denser: the net rise from melting a floating berg is only about 2.5 % of the berg's submerged volume. Land ice is another matter: an ice sheet that melts adds water the ocean did not displace before ([[glaciers-flow]]).

> [!key] A floating iceberg shows 10.6 % of itself above the sea, because ice (917 kg/m³) is 89.4 % as dense as sea water (1025). Sea ice, forming at −1.9 °C, rejects its salt downwards as dense brine that sinks and drives the deep ocean circulation.`,
  ideas: ['An iceberg floats with 89.4 % submerged in the sea, 92 % in fresh water: the freeboard is the fraction $1 - \\rho_\\text{ice}/\\rho_\\text{liquid}$ of the thickness.', 'Sea water freezes at about −1.9 °C, since dissolved salt lowers the freezing point.', 'Sea ice is nearly fresh: the lattice rejects salt, which collects as brine in pockets and in the water beneath.', 'The sinking, cold, salty brine feeds the deep ocean (Antarctic Bottom Water) and links ice formation to the great circulation.'],
  pitfalls: ['"Sea ice is frozen sea water, so it is salty" — It holds only 5–10 g/kg when young and 1–3 when old, a fifth or less of the sea\'s 35: most of the salt has been rejected, which is why melted sea ice can be drunk after a year.', '"An iceberg is nine-tenths underwater because ice is very heavy" — Ice is only 11 % lighter than sea water; a cork, 75 % lighter, shows three-quarters of itself.', '"Melting Arctic sea ice raises sea level" — Floating ice displaces its own weight, so the effect is a rise of only about 2.5 % of the submerged volume; sea level is raised by land ice (Greenland, Antarctica, glaciers).'],
  terms: [
    { term: 'Freeboard', also: ['height above the waterline'], def: 'The height of a floating body above the surface. For an ice slab it is the thickness times $(1 - \\rho_\\text{ice}/\\rho_\\text{liquid})$: about 10.6 % of the thickness in the sea.' },
    { term: 'Brine rejection', also: ['salt rejection', 'brine expulsion'], def: 'The exclusion of dissolved salt from the ice crystal lattice as sea water freezes, leaving a cold, salty brine in pockets of the ice and in the water below it.' },
    { term: 'Brinicle', also: ['ice stalactite'], def: 'A hollow tube of ice that grows downwards around a descending stream of very cold, dense brine from sea ice, sometimes reaching the sea floor and freezing the animals on it.' },
    { term: 'Antarctic Bottom Water', also: ['AABW'], def: 'The densest water mass of the ocean, formed around Antarctica from cold, salty shelf water made by freezing; it flows along the sea floor into every ocean basin.' },
    { term: 'Sea ice', also: ['pack ice', 'floes'], def: 'Ice formed by freezing sea water, as distinct from icebergs and ice shelves, which are glacial; first-year ice is 1–2 m thick, multi-year ice a little more.' },
    { term: 'Iceberg', also: ['calved ice'], def: 'A large piece of freshwater glacial or ice-shelf ice that has broken off ("calved") and floats free. The International Ice Patrol sizes them by height above the water: growlers under 1 m, bergy bits 1–5 m, small bergs 5–15 m, medium 16–45 m, large 46–75 m, very large above 75 m.' }
  ],
  formulas: [
    { name: 'How high a floating slab shows', expr: 'fb = H*(1 - rhoI/rhoL)', tex: 'f_b = H\\left(1 - \\frac{\\rho_\\mathrm{ice}}{\\rho_\\mathrm{liq}}\\right)',
      vars: { fb: { name: 'freeboard', q: 'length', unit: 'm', tex: 'f_b' }, H: { name: 'thickness of the ice', q: 'length', unit: 'm', value: 100 }, rhoI: { name: 'density of the ice', q: 'density', unit: 'kg/m³', value: 916.7, tex: '\\rho_\\mathrm{ice}' }, rhoL: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho_\\mathrm{liq}', hint: '1025 for the open sea, 999.8 for fresh water at 0 °C.' } },
      solveFor: 'fb', note: 'For a slab or a berg that floats upright; a tilted berg has the same fraction of its volume but not of its height above water.',
      stories: { fb: 'A tabular iceberg is {H} thick, ice {rhoI} in water of {rhoL}. How high does it stand above the surface?', H: 'An iceberg stands {fb} above sea water of {rhoL}, its ice being {rhoI}. How thick is the slab?' } },
    { name: 'Freezing point of salt water', expr: 'dT = Kf*b', tex: '\\Delta T_f = K_f\\, b',
      vars: { dT: { name: 'lowering of the freezing point', q: 'dtemp', unit: 'K', tex: '\\Delta T_f' }, Kf: { name: 'cryoscopic constant of water', unit: 'K·kg/mol', value: 1.86, fixed: true, tex: 'K_f' }, b: { name: 'particles dissolved (ions counted separately)', q: 'molality', unit: 'mol/kg', value: 1.1, hint: 'Sea water: about 1.1 mol of ions per kg of water at 35 g/kg.' } },
      solveFor: 'dT', note: 'An ideal-solution estimate: it gives 2.0 K for the sea, against the measured 1.9 K.',
      stories: { dT: 'Water holds {b} of dissolved particles. By how many kelvin does its freezing point fall?', b: 'A brine freezes {dT} below 0 °C. How much dissolved matter does it hold?' } },
    { name: 'Salt left in the water by growing ice', expr: 'dS = (rhoI/rhoW)*h*(S0 - Si)/Hm', tex: '\\Delta S = \\frac{\\rho_i}{\\rho_w}\\,\\frac{h\\,(S_0 - S_i)}{H_m}',
      vars: { dS: { name: 'rise in salinity of the mixed layer (‰ = g/kg)', q: 'ratio', unit: '‰', tex: '\\Delta S' }, rhoI: { name: 'density of the ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho_i' }, rhoW: { name: 'density of the sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho_w' }, h: { name: 'thickness of ice grown', q: 'length', unit: 'm', value: 1 }, S0: { name: 'salinity of the sea water (‰ = g/kg)', q: 'ratio', unit: '‰', value: 35, tex: 'S_0' }, Si: { name: 'salinity of the ice (‰ = g/kg)', q: 'ratio', unit: '‰', value: 5, tex: 'S_i', hint: '5–10 g/kg for young ice, 1–3 for old.' }, Hm: { name: 'depth of the mixed layer', q: 'length', unit: 'm', value: 50 } },
      solveFor: 'dS', note: 'The salt taken out of the ice-forming water goes into the layer beneath. A winter of 1–2 m of ice raises the salinity of the upper ocean by half a gram or more per kilogram.',
      stories: { dS: 'A winter grows {h} of ice from sea water at {S0}; the ice keeps {Si}. By how much does the salinity of the {Hm} deep mixed layer rise?' } }
  ],
  examples: [
    { title: 'Tip of the iceberg', q: 'A tabular iceberg is 250 m thick and weighs 2 × 10⁹ tonnes. How high does it stand above the sea, and what area does it cover?',
      steps: [{ text: 'Freeboard:', tex: 'f_b = 250\\left(1 - \\frac{916.7}{1025}\\right) = 26.4\\ \\mathrm{m}' }, 'The 223.6 m below the surface is what the ship meets.', 'Volume: $2\\times10^{12}$ kg / 916.7 kg/m³ = $2.18\\times10^9$ m³; divided by 250 m gives an area of $8.7\\times10^6$ m², about 3 km by 3 km.'],
      a: 'It stands about 26 m out of the water and covers roughly 9 km², its keel 224 m beneath the surface.' },
    { title: 'How much saltier does a polynya make the water?', q: 'In a polynya the wind keeps making new ice: 1.5 m of ice (5 g/kg) forms in a winter on 34.5 g/kg water, over a 100 m mixed layer. How much does its salinity rise?',
      steps: [{ text: '', tex: '\\Delta S = \\frac{917}{1025}\\times\\frac{1.5\\,(34.5 - 5)}{100} = 0.396\\ \\mathrm{g/kg}' }, 'About 0.4 g/kg — small in itself, but repeated over a continental shelf, with the water already at −1.9 °C, it is enough to make the densest water in the ocean.'],
      a: 'About 0.4 g/kg more salt, which at −1.9 °C raises the density by about 0.3 kg/m³ and sends the water to the bottom.' }
  ],
  quiz: [
    { q: 'What fraction of the volume of a floating iceberg is above the sea surface?', choices: ['about 1 %', 'about 10 %', 'about 50 %', 'about 90 %'], a: 1, why: 'The submerged fraction is 916.7/1025 = 89.4 %, so 10.6 % shows: the "tip of the iceberg" is a tenth.' },
    { q: 'Compared with an iceberg in a lake of fresh water, one in the sea sits', choices: ['lower', 'at the same height', 'higher', 'on its side'], a: 2, why: 'Sea water is denser, so less of the ice has to be submerged to displace its weight: 89 % rather than 92 %.' },
    { q: 'When sea water freezes, the ice is much less salty than the water because', choices: ['the salt evaporates', 'the ice lattice has no room for the ions, so they are pushed into the remaining liquid', 'salt melts at a lower temperature', 'salt sinks through the ice'], a: 1, why: 'The hydrogen-bonded hexagonal lattice of ice cannot hold sodium and chloride ions, so as crystals form they expel them; the salt collects in brine pockets and the water below.' },
    { q: 'A floating iceberg melts completely. Sea level, because of the berg alone,', choices: ['rises a lot', 'falls', 'is almost unchanged (a rise of a few per cent of its submerged volume)', 'rises exactly by the berg\'s volume'], a: 2, why: 'The berg already displaced its own weight of sea water. The meltwater is fresh and slightly less dense, so it occupies a little more volume: a rise of about 2.5 % of the submerged volume.' },
    { q: 'The freezing point of sea water at 35 g/kg is −1.9 °C. About how many moles of dissolved particles per kilogram of water does the cryoscopic constant (1.86 K·kg/mol) imply?', choices: ['0.1 mol/kg', '0.5 mol/kg', '1 mol/kg', '5 mol/kg'], a: 2, why: '$b = \\Delta T/K_f = 1.9/1.86 \\approx 1.0$ mol of particles per kilogram — the sodium, chloride, sulfate, magnesium and the rest, each counted as one.' }
  ],
  applications: ['Ship routing and the International Ice Patrol, formed after the *Titanic*, which tracks icebergs in the North Atlantic from the sea ice and glacier outlets of Greenland.', 'Polar oceanography: bottom-water formation, the heat and carbon the deep ocean stores, and the albedo of sea ice ([[sea-ice-and-albedo]]).', 'Offshore and Arctic engineering: platform and pipeline design against ice loads that depend on whether the ice is first-year, multi-year or berg.', 'Iceberg towing and "iceberg water": drinking water from glacial ice has been harvested from bergs off Newfoundland, with a density of 880–900 kg/m³ because of its bubbles.'],
  history: 'The *Titanic* struck an iceberg at 23:40 on 14 April 1912 about 600 km south-east of Newfoundland and sank two hours forty minutes later with the loss of about 1,500 lives. The International Ice Patrol was founded by the Safety of Life at Sea conference in 1914 and has watched the North Atlantic since.',
  sources: ['USGS Water Science School, "Water density" — ice is about 90 % as dense as water and about 10 % of an iceberg shows; salt raises density.', 'Petrenko and Whitworth, *Physics of Ice*, ch. 11 and 13 — the structure and brine content of sea ice.', 'Untersteiner (ed.), *The Geophysics of Sea Ice* (1986) — brine drainage, salinity of first-year and multi-year ice.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water* — colligative effects on freezing.'],
  sim: [{ id: 'ice-lake-seasons', params: { salinity: 35, season: 'winter' } }, 'ref-ice-floats']
},

/* ================================================================ frost wedging and burst pipes */
{
  id: 'frost-wedging-and-burst-pipes', parent: 'the-ice-that-floats', title: 'Frost wedging and burst pipes', level: 2,
  short: 'Water that freezes in a space that cannot grow has nowhere to go: the 9 % expansion becomes a pressure of hundreds of atmospheres, limited only by the melting curve at about 200 MPa. It splits pipes, lifts roads, makes potholes and shatters mountains.',
  keywords: ['burst pipes', 'frost wedging', 'frost shattering', 'frost heave', 'potholes', 'freeze-thaw', 'expansion on freezing', 'ice pressure', 'ice lens', 'critical saturation', 'concrete', 'antifreeze', 'cracked rock'],
  prereq: ['why-ice-floats', 'the-phase-diagram'],
  related: ['frost-shatters-rock', 'melting-and-the-latent-heat-of-fusion', 'incompressibility-and-water-hammer', 'why-ice-is-slippery', 'glaciers-flow', 'physics:shear-bulk-modulus', 'hydraulics:bulk-modulus'],
  body: `
On a cold morning the plumber's first question is where the ice plug is. The pipe usually did not burst because ice swelled inside it: copper stretches enough to take the 9 % increase in volume of a long freeze. It burst because ice sealed a section of pipe at both ends — a plug at one side, a closed tap at the other — and then the water *between* them, which had nowhere to go, was squeezed by the ice still growing. Water is almost incompressible, so a very small squeeze makes a very large pressure.

### How hard can ice push?
Squeezing water by 1 % takes a pressure of about 22 MPa, 220 atmospheres (water's bulk modulus is 2.2 GPa). Confined freezing needs far more than 1 %, so the limit is not set by the water: it is set by **the ice itself**. Ice under pressure melts — its melting point falls by 0.0074 K per bar, since the liquid is the denser phase ([[the-phase-diagram]], [[why-ice-floats]]). A trapped mixture of ice and water at a temperature $T$ below freezing therefore cannot hold a pressure higher than the one at which ice melts at $T$:

| Temperature | Ceiling pressure on the melting curve |
|---|---|
| −1 °C | 13 MPa (130 bar) |
| −2.4 °C | 30 MPa |
| −5 °C | 60 MPa |
| −10 °C | 110 MPa |
| −22 °C | 209 MPa (ice III takes over) |

Against these, a wall is weak: glass bottle 3 MPa, a PVC pipe 8, granite 10–15, copper pipe 20, cast iron 30, steel 100. A 15 mm copper pipe, 0.7 mm wall and 220 MPa tensile strength fails at $p = \\sigma t/r = 220\\times0.7/7.2 = 21$ MPa — a pressure reached at −1.6 °C. So *everything breakable breaks* in an ordinary frost, unless the water has room: about 9 % of the volume left as air, a flexible hose or a drip that lets water out keeps the pressure low. That is also why a bottle filled to the brim shatters in a freezer, and one two-thirds full does not.

### Rock, concrete and road
- **Potholes.** Water seeps into cracks in asphalt; each night it freezes and the ice wedges the crack open; thaw lets in more water and traffic breaks the weakened surface. Dozens of freeze–thaw cycles in a winter are ordinary in a maritime climate.
- **Concrete** is damaged when its pores are more than **91.7 %** full of water: the freezing expansion of 9 % cannot then fit. The remedy is *air entrainment* — microscopic bubbles, spaced a fraction of a millimetre apart, are the empty room the ice needs.
- **Frost heave.** Roads and fields lift by tens of centimetres in winter — more than the 9 % that expansion could account for. In frost-susceptible soils (silts) the freezing front draws water up through thin films of liquid that cover the soil grains even below 0 °C — the same premelting that makes ice slippery ([[why-ice-is-slippery]]) — and it feeds *ice lenses* that grow like layers, pushing the ground upward. The effect is segregation, not expansion.
- **Frost shattering** of mountain rock ([[frost-shatters-rock]]) works by the same two mechanisms. Field measurements show that rock cracks most where it sits for a long time between about −3 and −8 °C and has water to draw in: the "frost-cracking window". Many cracks come from growing ice lenses, not from the 9 % expansion, which is why dry rock and rock that is quickly frozen suffer least.

### Making it stop
Lag pipes and keep them above freezing, drain outdoor lines, leave a tap dribbling (moving water does not freeze as easily), and use antifreeze in closed systems: 50 % ethylene glycol in water freezes only at about −37 °C, and as a slush it does not form a hard plug.

> [!key] Ice pushes as hard as the wall resists, up to the pressure at which squeezed ice melts: 13 MPa at −1 °C, 110 MPa at −10 °C, 209 MPa at −22 °C. Any unyielding container filled with freezing water fails; one with free room does not.`,
  ideas: ['Water expands by 9 % on freezing; with no room it is squeezed, and because water is nearly incompressible a tiny squeeze means hundreds of bar.', 'The pressure cannot exceed the melting curve: 13 MPa at −1 °C, 110 MPa at −10 °C, 209 MPa at −22 °C — far above the strength of pipes, bottles and most rock.', 'Pipes burst between an ice plug and a closed tap, not where the ice is; free room (air, a flexible wall, a dripping tap) removes the pressure.', 'Frost heave and much frost shattering come from ice lenses drawing water through premelted films, not from the 9 % expansion.'],
  pitfalls: ['"A burst pipe leaks when it freezes" — It usually bursts when the ice melts: the crack is hidden by the ice and the leak starts only at the thaw.', '"The pressure of freezing is a fixed number" — It depends on the temperature (13 MPa at −1 °C, 110 at −10) and on the room available; it can be almost nothing in a container with a small air bubble.', '"Frost heave is the 9 % expansion of the soil water" — Heave of tens of centimetres cannot come from 9 % of a thin wet layer; it comes from ice lenses fed by water that flows to the freezing front.'],
  terms: [
    { term: 'Frost wedging', also: ['frost shattering', 'cryofracture', 'ice wedging'], def: 'The breaking of rock or concrete by ice growing in its cracks and pores, by the 9 % expansion of freezing water or, more often, by the growth of ice lenses that draw in water.' },
    { term: 'Frost heave', also: ['ground heave'], def: 'The upward movement of the ground surface as ice lenses grow beneath it; tens of centimetres in a winter in silty soils, and the cause of cracked roads and patterned ground.' },
    { term: 'Ice lens', also: ['segregated ice'], def: 'A layer of ice, often millimetres to tens of centimetres thick, formed in soil or rock where water flows to the freezing front through unfrozen films and freezes there, pushing the material apart.' },
    { term: 'Critical saturation', also: ['91.7 %'], def: 'The fraction of the pore volume of a material that can be filled with water without freeze damage: 91.7 %, the inverse of the 9 % expansion of water on freezing, above which the ice has no room.' },
    { term: 'Hoop stress', also: ['circumferential stress'], def: 'The tension around the wall of a pressurised pipe, $\\sigma = p\\,r/t$ for a thin wall of thickness $t$ and radius $r$; a pipe bursts when it reaches the material\'s tensile strength.' }
  ],
  formulas: [
    { name: 'Stress in the wall of a pipe', expr: 'sigma = p*r/t', tex: '\\sigma = \\frac{p\\,r}{t}',
      vars: { sigma: { name: 'hoop stress in the wall', q: 'stress', unit: 'MPa', tex: '\\sigma' }, p: { name: 'pressure inside', q: 'pressure', unit: 'MPa', value: 20 }, r: { name: 'radius of the pipe', q: 'length', unit: 'mm', value: 7.2 }, t: { name: 'wall thickness', q: 'length', unit: 'mm', value: 0.7 } },
      solveFor: 'sigma', note: 'A thin-walled cylinder (wall much thinner than radius). The pipe fails when the stress reaches its tensile strength: about 220 MPa for annealed copper, 50 for PVC.',
      stories: { sigma: 'A pipe of radius {r} and wall {t} holds ice at {p}. What tension runs round the wall?', p: 'A pipe of radius {r} and wall {t} bursts at a wall stress of {sigma}. At what pressure?' } },
    { name: 'The slope of the melting curve', expr: 'mp = L/(T0*(1/rhoL - 1/rhoS))', tex: 'm_p =\\frac{L}{T_0\\left(1/\\rho_\\ell - 1/\\rho_s\\right)}',
      vars: { mp: { name: 'slope dp/dT of the melting curve', unit: 'Pa/K', signed: true, tex: 'm_p', hint: 'Negative: pressure must rise as the temperature falls to keep ice and water in equilibrium.' }, L: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55 }, T0: { name: 'melting temperature', q: 'temperature', unit: '°C', value: 0, tex: 'T_0' }, rhoL: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 999.84, tex: '\\rho_\\ell' }, rhoS: { name: 'density of the ice', q: 'density', unit: 'kg/m³', value: 916.7, tex: '\\rho_s' } },
      solveFor: 'mp', note: 'The Clausius–Clapeyron relation applied to melting: −13.5 MPa per kelvin at 0 °C, i.e. 0.0074 K per bar. The curve bends, so pressure rises a little less than linearly as it gets colder: the real ceiling at −10 °C is 110 MPa, not 135.',
      stories: { mp: 'Ice of density {rhoS} melts to water of density {rhoL} absorbing {L}. How steep is its melting curve at {T0}?' } },
    { name: 'Pressure from squeezing a liquid', expr: 'p = K*eps', tex: 'p = K\\,\\varepsilon',
      vars: { p: { name: 'pressure', q: 'pressure', unit: 'MPa' }, K: { name: 'bulk modulus', q: 'pressure', unit: 'GPa', value: 2.2, hint: 'About 2.2 GPa for liquid water near 0 °C; ice is about 9 GPa.' }, eps: { name: 'fractional compression', q: 'ratio', unit: '%', value: 1, tex: '\\varepsilon' } },
      solveFor: 'p', note: 'Small compressions of a nearly incompressible liquid mean very large pressures: 1 % of squeeze, 22 MPa.',
      stories: { p: 'Water with bulk modulus {K} is compressed by {eps}. What pressure results?', eps: 'Water with bulk modulus {K} is held at {p}. By what fraction has it been squeezed?' } }
  ],
  examples: [
    { title: 'When does the copper pipe burst?', q: 'A 15 mm copper pipe (radius 7.2 mm, wall 0.7 mm, tensile strength 220 MPa) is full of water and blocked at both ends. At what temperature does it burst?',
      steps: [{ text: 'The wall holds until the pressure reaches', tex: 'p = \\frac{\\sigma\\,t}{r} = \\frac{220\\times0.7}{7.2} = 21\\ \\mathrm{MPa}' }, 'The melting curve gives that pressure at −1.6 °C (13 MPa at −1 °C, 30 MPa at −2.4 °C).', 'So the pipe bursts as soon as the ice plug has chilled the trapped water about 1.6 K below zero — an ordinary frost.'],
      a: 'At about −1.6 °C: it takes hardly any frost; the ice need not push anywhere near its 200 MPa limit.' },
    { title: 'How much room saves a bottle?', q: 'A sealed 1 L bottle is filled with water and then frozen. How much empty space does it need so that the ice never presses on the glass?',
      steps: ['The water wants to become ice of $1.0907$ times the volume: 90.7 mL extra for each litre.', 'So the water may fill at most $1/1.0907 = 91.7$ % of the bottle; any more and the glass takes the squeeze.', 'The empty 8.3 % is 83 mL: a bottle two-thirds full, with 330 mL of air, is very safe.'],
      a: 'At least 8.3 % of its volume as air — the same 91.7 % "critical saturation" that governs frost damage in concrete.' }
  ],
  quiz: [
    { q: 'Why does a water pipe typically burst in a freeze?', choices: ['The ice expands outwards on a long pipe', 'Ice blocks the pipe at two points and the trapped water between them is squeezed', 'Cold makes copper brittle', 'Water contracts and the pipe collapses'], a: 1, why: 'A pipe full of water can accommodate a long ice front because water can be pushed back towards the supply. Trapped between a plug and a closed tap, it cannot move, so the expansion of freezing makes a pressure of tens of MPa.' },
    { q: 'The greatest pressure confined ice can reach at −10 °C is limited by', choices: ['the strength of the container', 'the melting curve: ice melts under more than about 110 MPa at that temperature', 'the 9 % expansion', 'atmospheric pressure'], a: 1, why: 'If the pressure rose above the melting-curve value for −10 °C the ice would melt, relieving it. The ceiling is a property of water, whatever the container is made of.' },
    { q: 'A drinks bottle is filled to the brim and frozen; another is filled two-thirds. Which breaks?', choices: ['the full one only', 'the two-thirds one only', 'both', 'neither'], a: 0, why: 'The full one has no room for the 9 % expansion, while the second has a third of its volume as air, more than the 8.3 % needed.' },
    { q: 'Frost heave of a road by 20 cm in a winter can be explained by the 9 % expansion of the water in the soil.', a: false, why: 'Nine per cent of a thin wet layer is a few centimetres at most. The 20 cm come from ice lenses: water flows to the freezing front through unfrozen films around the grains and freezes there, adding ice well beyond what was originally in the pores.' },
    { q: 'A wall that withstands 20 MPa survives confined ice at −1 °C (ceiling 13 MPa) and fails by −2.4 °C (ceiling 30 MPa). At about what temperature does it first fail?', choices: ['−0.3 °C', '−1.6 °C', '−5 °C', '−10 °C'], a: 1, why: 'The melting-curve ceiling reaches 20 MPa at about −1.6 °C, since the pressure rises by about 130 bar for each kelvin below freezing. Failure needs only a mild frost, nowhere near −10 °C.' }
  ],
  applications: ['Plumbing practice: lagging, draining outdoor taps, a trickle of water, and antifreeze solutions of 30–50 % glycol in solar and heating loops.', 'Road and airfield engineering: base courses that drain, and specifications of frost-susceptible soils to prevent heave and potholes.', 'Concrete technology: air-entrained concrete for winter exposure, with bubbles of 0.05–0.3 mm spaced at less than 0.2 mm.', 'Geomorphology and mountain hazards: rockfall in the "frost-cracking window", scree slopes and patterned ground in the Arctic ([[frost-shatters-rock]]).'],
  history: 'The Florentine academicians of the Accademia del Cimento burst a sealed brass sphere filled with water by freezing it, in the 1660s, an experiment repeated many times with iron shells to measure the force of freezing. The explanation of frost heave by ice lenses was given by Stephen Taber in 1929–30, who showed with liquids other than water that it is the growth of segregated ice, not the volume expansion, that heaves the ground.',
  sources: ['Petrenko and Whitworth, *Physics of Ice*, ch. 11 (freezing, frost heave) and the melting curve.', 'Taber, S., "Frost heaving", *Journal of Geology* 37, 428 (1929) — ice segregation, not volume expansion.', 'Hallet, B., Walder, J. S. and Stubbs, C. W., "Weathering by segregation ice growth in microcracks at sustained subzero temperatures", *Permafrost and Periglacial Processes* 2, 283 (1991).', 'IAPWS, *Revised Release on the Pressure along the Melting and Sublimation Curves of Ordinary Water Substance* (2011) — the melting curve of ice Ih and the higher ices.'],
  sim: 'ice-burst-pipe'
},

/* ================================================================ snowflakes */
{
  id: 'snowflakes', parent: 'the-ice-that-floats', title: 'Snowflakes', level: 2,
  short: 'A snow crystal is ice Ih grown from vapour, and its six-fold shape is the hexagonal lattice made visible. The kind of crystal — plate, column, needle, branched star — depends on the temperature and on how much vapour there is, and the six arms are alike because they all feel the same air.',
  keywords: ['snowflake', 'snow crystal', 'six-fold symmetry', 'hexagonal', 'Kepler', 'Bentley', 'Nakaya', 'dendrite', 'plate', 'column', 'needle', 'supersaturation', 'no two alike', 'habit'],
  prereq: ['why-ice-floats', 'the-tetrahedral-network'],
  related: ['ice-ih-and-ice-ic', 'the-ice-rules', 'clouds-rain-and-snow', 'supercooling-and-nucleation', 'humidity-and-dew-point', 'the-phase-diagram'],
  body: `
Under a lens a snowflake is a small, elaborate, six-sided machine for being beautiful, and it has been admired for as long as it has been looked at. In 1611 Johannes Kepler, a flake having settled on his coat as he crossed the Charles Bridge in Prague, wrote the little book *Strena seu de nive sexangula* ("A New Year's Gift, or On the Six-Cornered Snowflake") as a present for his patron and asked why snow has six corners. He compared it with honeycomb and the seeds of a pomegranate, thought about stacked spheres, and concluded that he had not found the answer. He was asking the right question. The answer needed the atoms.

### Why six
Ice Ih is a hexagonal crystal ([[why-ice-floats]]): looking down its axis each oxygen sits at the corner of a puckered hexagon, with 120° between the bonds. When a crystal a few micrometres across grows from vapour, each face grows at a speed that depends on its orientation to the lattice. A crystal shaped by those speeds is a hexagonal prism, a plate or a column. The arms of a snowflake grow out of its six corners.

The *same shape on all six arms* is the second puzzle, and the answer is less mysterious than it looks. A flake a millimetre across has no way of making its arms agree; it needs none. As it falls, drifting and tumbling for ten minutes through air of changing temperature and humidity, all six tips are in the same air at the same moment, so they grow in the same way. If conditions change, they change on every arm together. A flake is a record of its fall.

### What decides the shape: Nakaya's diagram
In 1936 the Japanese physicist Ukichiro Nakaya at Hokkaido grew the first artificial snow crystals in his cold laboratory, hanging them on rabbit hair, and found that the type of crystal depends on two things:

| Temperature | Crystal (habit) |
|---|---|
| 0 to −4 °C | thin plates and stellar plates |
| −4 to −10 °C | columns and needles (needles near −5 °C) |
| −10 to −22 °C | plates; branched dendrites around −15 °C |
| below −22 °C | columns and thick plates |

and the **supersaturation** — the excess of the vapour pressure over the pressure that ice would be happy with at that temperature — decides how elaborate it is. Low excess: simple solid prisms and plates. High excess: hollow columns, needles, ferns and stars. The largest supersaturation in a cloud is limited by the saturation of liquid water: at −15 °C the vapour pressure of water is 191 Pa against 165 Pa over ice, so droplets keep the air 16 % supersaturated for ice; at −5 °C, 5 %; at −30 °C, 34 %.

Why the habit flips back and forth with temperature (plate, column, plate, column) is still not completely understood; the cause lies in how water molecules attach to the two kinds of face, and the way those attachment rates change with temperature seems to depend on the state of the surface layer ([[why-ice-is-slippery]]).

### Branching: the tip effect
A growing plate is no longer a plate once it has any size: its corners, sticking out into the air, are bombarded by more vapour than the middle of an edge, and they grow faster, so they run ahead. This is the Mullins–Sekerka instability. Tips grow into arms, the arms into side branches, and in the supersaturated air of about −15 °C a *stellar dendrite* of several millimetres forms in minutes. The model in the simulation is a hexagonal cellular automaton that has only the three ingredients of vapour diffusion, deposition on the edge and a hexagonal grid; it grows stars at high supersaturation and plates at low.

### Every flake different?
Wilson Bentley, a farmer in Jericho, Vermont, made the first photomicrograph of a snow crystal on 15 January 1885 and photographed more than five thousand, and was sure that no two were alike. A flake of 0.5 mg holds some $1.7\\times10^{19}$ water molecules and its path is unrepeatable, so real dendrites are never the same. Simple hexagonal plates, however, can be indistinguishable: Nancy Knight found two look-alike crystals in a 1988 field collection.

> [!key] Snow crystals are ice Ih grown from vapour: the hexagonal lattice makes the six-fold shape, the temperature and supersaturation (Nakaya's diagram) choose plate, column or dendrite, and the six arms match because they grew together in the same air.`,
  ideas: ['A snow crystal is a single crystal of ice Ih; its six-fold shape reflects the hexagonal lattice.', 'The six arms match because they each grew in the same air as the flake fell, not because they communicate.', 'Temperature chooses the habit (plates, columns, plates, columns as it falls from 0 to −40 °C); supersaturation chooses how elaborate it is.', 'Tips protrude into more vapour and grow faster, so a plate sprouts arms, and arms branch: a diffusion instability.'],
  pitfalls: ['"Snowflakes are frozen raindrops" — Frozen raindrops are sleet or hail, small lumps of clear ice. A snowflake grows from vapour, directly onto a tiny nucleus, without ever being liquid.', '"The arms of a snowflake coordinate to stay identical" — They cannot: a plate is thousands of times wider than its molecules and no signal passes between arms that matters. They match because they feel the same temperature and humidity at the same time.', '"All snowflakes have six arms" — Needles, columns, capped columns and irregular crystals are common; the flat six-armed stars come from a narrow band of conditions around −15 °C.'],
  terms: [
    { term: 'Snow crystal', also: ['ice crystal', 'single crystal of ice'], def: 'A single crystal of ice Ih grown from water vapour in a cloud; a snowflake is a snow crystal or a clump of them stuck together.' },
    { term: 'Habit', also: ['crystal habit', 'morphology'], def: 'The overall shape a crystal takes while growing — plate, column, needle, dendrite — as distinct from its internal lattice; for snow it depends on temperature.' },
    { term: 'Supersaturation', also: ['excess vapour pressure', 'ice supersaturation'], def: 'The amount by which the water-vapour pressure exceeds the equilibrium (saturation) value over ice, as a fraction of it; what drives crystal growth.' },
    { term: 'Dendrite', also: ['stellar dendrite', 'fern-like crystal'], def: 'A branched snow crystal with a main arm and side branches, grown at about −15 °C in strongly supersaturated air; the classic snowflake shape.' },
    { term: 'Nakaya diagram', also: ['morphology diagram', 'snow crystal habit diagram'], def: 'A chart of snow-crystal type against temperature and supersaturation, first drawn from laboratory-grown crystals by Ukichiro Nakaya in the 1950s.' },
    { term: 'Mullins–Sekerka instability', also: ['diffusion instability', 'tip effect'], def: 'The tendency of a growing crystal edge limited by diffusion to break into branches, because any bump reaches more of the supply and grows faster than its surroundings.' }
  ],
  formulas: [
    { name: 'Supersaturation over ice', expr: 's = pv/pice - 1', tex: 's = \\frac{p_v}{p_i} - 1',
      vars: { s: { name: 'supersaturation with respect to ice', q: 'ratio', unit: '%' }, pv: { name: 'water-vapour pressure of the air', tex: 'p_v', q: 'pressure', unit: 'Pa', value: 191.4, hint: 'In a cloud of liquid droplets the air is at the saturation pressure over water: 191 Pa at −15 °C.' }, pice: { name: 'saturation pressure over ice', q: 'pressure', unit: 'Pa', value: 165.3, tex: 'p_i', hint: '165 Pa at −15 °C, 611.7 Pa at 0.01 °C.' } },
      solveFor: 's', note: 'At the temperature of a mixed cloud, droplets hold the air at water saturation, which is 5 % above ice saturation at −5 °C, 10 % at −10, 16 % at −15 and 22 % at −20.',
      stories: { s: 'Air at −15 °C holds vapour at {pv}; ice would be in equilibrium with {pice}. By how much is it supersaturated for ice?', pv: 'Air is {s} supersaturated over ice, for which saturation is {pice}. What is the vapour pressure?' } },
    { name: 'Mass of a hexagonal plate', expr: 'm = rho*(3*sqrt(3)/2)*a^2*d', tex: 'm = \\rho\\,\\frac{3\\sqrt3}{2}\\,a^2\\,d',
      vars: { m: { name: 'mass of the plate', q: 'mass', unit: 'mg' }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho' }, a: { name: 'side of the hexagon', q: 'length', unit: 'mm', value: 1 }, d: { name: 'thickness of the plate', q: 'length', unit: 'µm', value: 10 } },
      solveFor: 'm', note: 'A regular hexagon of side $a$ has area $\\tfrac{3\\sqrt3}{2}a^2$. Snow plates are thin: 10–50 µm for a millimetre across.',
      stories: { m: 'A hexagonal plate of ice has side {a} and thickness {d}. What is its mass?' } },
    { name: 'Molecules in a flake', expr: 'N = m*NA/M', tex: 'N = \\frac{m\\,N_A}{M}',
      vars: { N: { name: 'number of molecules', q: 'count' }, m: { name: 'mass of the flake', q: 'mass', unit: 'mg', value: 0.5 }, NA: { const: 'NA' }, M: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015 } },
      solveFor: 'N', note: 'Half a milligram of ice, a large dendrite, is about $1.7\\times10^{19}$ molecules, each one placed by the vapour that reached it.',
      stories: { N: 'A snow crystal has a mass of {m}. How many water molecules does it contain?' } }
  ],
  examples: [
    { title: 'How much ice in a plate?', q: 'A hexagonal plate has sides of 1 mm and is 10 µm thick. What is its mass and how many molecules make it?',
      steps: [{ text: 'Area of the hexagon:', tex: 'A = \\tfrac{3\\sqrt3}{2}(1\\ \\mathrm{mm})^2 = 2.6\\ \\mathrm{mm^2}' }, 'Volume: $2.6\\times10^{-6}\\ \\mathrm{m^2} \\times 10^{-5}\\ \\mathrm{m} = 2.6\\times10^{-11}\\ \\mathrm{m^3}$; mass $917 \\times 2.6\\times10^{-11} = 2.4\\times10^{-8}$ kg = 24 µg.', 'Molecules: $2.4\\times10^{-8}\\ \\mathrm{kg}/(2.99\\times10^{-26}\\ \\mathrm{kg}) = 8\\times10^{17}$.'],
      a: 'About 24 micrograms, or $8\\times10^{17}$ molecules — about a twentieth of the molecules in a large 0.5 mg flake, arranged in a crystal 2 mm across and 10 µm thick.' },
    { title: 'How supersaturated is a cloud for ice?', q: 'In a cloud at −15 °C the vapour pressure over liquid water is 191.4 Pa and over ice 165.3 Pa. How supersaturated is the air for ice crystals?',
      steps: [{ text: 'Droplets hold the air at the water-saturation value, so', tex: 's = \\frac{191.4}{165.3} - 1 = 0.158' }, 'A crystal in this cloud sees 16 % more vapour than it would need to stay in equilibrium, and it grows fast — into the branched dendrite of the Nakaya diagram.'],
      a: '15.8 %: the most a crystal can see in a liquid-water cloud at −15 °C, which is the temperature of the best dendrites.' }
  ],
  quiz: [
    { q: 'Why do the six arms of a snowflake look alike?', choices: ['They pass signals to each other to stay equal', 'They grow in the same temperature and humidity at the same time', 'The crystal was cut by wind to be symmetrical', 'Water molecules are hexagonal'], a: 1, why: 'The lattice fixes the six-fold directions of growth; the identical development of the arms comes from each experiencing the same conditions as the flake falls, not from any communication.' },
    { q: 'A snow crystal that grows at about −5 °C is most likely a', choices: ['thin flat plate', 'column or needle', 'fern-like dendrite', 'frozen raindrop'], a: 1, why: 'On Nakaya\'s diagram the columns and needles come between about −4 and −10 °C; plates come at 0 to −4 and again from −10 to −22, the dendrites near −15.' },
    { q: 'Compared with a flake grown at −15 °C and 2 % supersaturation, one grown at −15 °C and 16 % supersaturation is', choices: ['simpler, a plain hexagon', 'more elaborate, branched', 'a column', 'the same'], a: 1, why: 'The temperature fixes the habit (plates and dendrites); the supersaturation fixes the elaboration. Low excess gives a plain hexagon, high excess a branched star.' },
    { q: 'Snowflakes are frozen raindrops.', a: false, why: 'Raindrops that freeze become sleet or hail. Snow crystals grow directly from vapour on tiny nuclei at below 0 °C.' },
    { q: 'About how many water molecules are in a 0.5 mg snowflake?', choices: ['$10^{9}$', '$10^{14}$', '$10^{19}$', '$10^{26}$'], a: 2, why: '$N = mN_A/M = 5\\times10^{-7}\\ \\mathrm{kg}\\times6.02\\times10^{23}/0.018\\ \\mathrm{kg/mol} = 1.7\\times10^{19}$.' }
  ],
  applications: ['Weather radar and remote sensing: the shape and fall speed of crystals (a dendrite drifts down at about 0.5 m/s, a graupel pellet at several) change how a radar sees snow and how it is melted into rain.', 'Snow cover and avalanches: the habit of crystals that fall and then sinter decides the strength of the layers in a snowpack.', 'Skiing and snowmaking: crystals from a snow gun are tiny frozen droplets, not dendrites; the nucleating bacterium *Pseudomonas syringae* is used to make them freeze at warmer temperatures ([[supercooling-and-nucleation]]).', 'Crystal growth in industry: the same diffusion instability makes dendrites in metal castings, frost on windows and electro-deposits.'],
  history: 'Kepler wrote his essay in 1611; René Descartes drew flakes in *Les Météores* (1637); Robert Hooke in *Micrographia* (1665); the whaler and scientist William Scoresby drew ninety-six types in 1820. Wilson Bentley\'s photographs began in 1885, and the book *Snow Crystals* (Bentley and Humphreys, 1931) showed more than 2,400 of them. Nakaya\'s *Snow Crystals: Natural and Artificial* (Harvard, 1954) gave the first diagram, and Magono and Lee classified 80 types in 1966. Kenneth Libbrecht\'s 2005 review remains the standard account.',
  sources: ['Libbrecht, K. G., "The physics of snow crystals", *Reports on Progress in Physics* 68, 855 (2005) — habit diagram, attachment kinetics, the branching instability.', 'Nakaya, U., *Snow Crystals: Natural and Artificial* (Harvard University Press, 1954).', 'Bentley, W. A. and Humphreys, W. J., *Snow Crystals* (McGraw-Hill, 1931); Kepler, J., *Strena seu de nive sexangula* (1611).', 'Reiter, C. A., "A local cellular model for snow crystal growth", *Chaos, Solitons & Fractals* 23, 1111 (2005) — the model used in the simulation.'],
  sim: 'ice-snowflake'
},

/* ================================================================ why ice is slippery */
{
  id: 'why-ice-is-slippery', parent: 'the-ice-that-floats', title: 'Why ice is slippery', level: 2,
  short: 'The surface of ice is not solid: its outermost molecules cannot hold four neighbours and form a liquid-like film, a few nanometres thick near 0 °C, that thins to nothing by about −40 °C. Pressure from a skate lowers the melting point by well under a kelvin, and cannot be the reason; friction heating and the film are.',
  keywords: ['slippery ice', 'quasi-liquid layer', 'premelting', 'skating', 'Faraday', 'pressure melting', 'regelation', 'friction', 'ice skate', 'surface melting', 'disordered layer', 'ice friction'],
  prereq: ['why-ice-floats', 'the-phase-diagram', 'melting-and-the-latent-heat-of-fusion'],
  related: ['frost-wedging-and-burst-pipes', 'glaciers-flow', 'snowflakes', 'supercooling-and-nucleation', 'surface-tension', 'physics:friction'],
  body: `
Walk onto a frozen pond and your foot goes from under you. Put a block of wet steel onto a block of dry steel and nothing happens. Ice is among the slipperiest of solids, and for almost two hundred years the standard explanation was wrong. It said: the skater's weight, on a narrow blade, makes so great a pressure that the ice beneath melts, and the skate glides on a film of water. That is true — ice does melt under pressure — but the amount is far too small.

### Pressure melting does not do it
Because water is denser than ice, squeezing ice lowers its melting point, by 0.0074 K per bar ([[frost-wedging-and-burst-pipes]]). A 75 kg skater on one blade with 1 cm² touching the ice presses at 7.4 MPa, 74 bar; the melting point falls to −0.55 °C. At −5 °C the ice is nine times too cold for that to matter, and at −10 °C eighteen times. To melt ice at −10 °C by pressure alone needs 110 MPa — a blade touching over about 7 mm², which would be cutting into the ice. People skate at −20 °C; they could not if pressure were the cause. The argument is simple arithmetic, and it was made repeatedly from the 1930s on (the pressure-melting idea goes back to Osborne Reynolds, 1899, and James Thomson's prediction of the lowering of the melting point in 1849).

### Friction heats it
Bowden and Hughes, in 1939, measured the friction of ice and showed that heat made in sliding melts a thin film. A skater of 75 kg gliding at 6 m/s with a friction coefficient of 0.02 dissipates $\\mu m g v$ = 88 W, which melts about a quarter of a gram of ice a second. This lubricates, and explains why ice gets *slipperier* as the skater speeds up; but a standing person on ice — or a stone resting on it — also finds it slippery, and a slow-moving boot has little frictional heat.

### The skin on the ice
In 1850 Michael Faraday proposed the idea that has survived: the surface of ice is not like its interior. A water molecule inside ice holds four neighbours; one at the surface has only two or three, so it is less tightly held and can wander, and the top layers behave like a liquid at a temperature where the bulk is solid. This **premelting**, or quasi-liquid layer, has been seen since by X-ray scattering, ellipsometry, atomic-force microscopy and sum-frequency spectroscopy. It thickens as the temperature approaches 0 °C — from one or two molecular layers at −30 °C to a few nanometres at −1 °C, and more very near melting, though techniques disagree by an order of magnitude — and it is why ice sticks to itself in a snowball (the films join) and why soil grains stay wet and draw water up to ice lenses ([[frost-wedging-and-burst-pipes]]).

The thinning layer explains why ice is much less slippery at very low temperatures: at about −40 °C, in the dry cold of a high mountain or a polar winter, the film is down to a single bilayer or less; skis drag and skate blades grip, and the coefficient of friction can rise severalfold. For typical skates and speeds friction on ice is lowest at moderately cold temperatures, around −5 to −10 °C: warmer, a deep wet film drags; colder, too little film remains.

### What is the verdict?
The surface film and friction heat together lubricate; pressure plays a bit part at best. Why the film's thickness is what it is — and whether it is really a "liquid" or a special disordered state — is still discussed; it matters for the growth of snow crystals, for the movement of glaciers over their beds, and for the chemistry of ozone on polar ice.

> [!key] Ice is slippery because its surface molecules, missing neighbours, form a thin liquid-like film that thickens towards 0 °C, helped by the heat of friction. Pressure melting is real but tiny: a skater's weight lowers the melting point by about half a kelvin and cannot account for skating at −10 °C.`,
  ideas: ['A surface molecule of ice has only two or three neighbours, so the top layers act like a liquid below 0 °C: the quasi-liquid layer, a few nanometres thick near −1 °C.', 'Pressure lowers the melting point by only 0.0074 K per bar: a 75 kg skater on 1 cm² of blade manages 0.55 K, far too little for ice at −10 °C.', 'Friction in sliding adds heat ($\\mu m g v$) that melts a little ice and lubricates faster glides.', 'At about −40 °C the film is gone and ice grips: skates drag, and friction coefficients rise.'],
  pitfalls: ['"A skate melts the ice under it by pressure" — It does lower the melting point, but by about half a kelvin for a skater, not the ten or twenty degrees it would need. The effect is real and useless for explaining skating.', '"Ice is slippery because it is smooth" — A polished steel surface is as smooth and far less slippery. The slipperiness comes from the liquid-like skin and heat of sliding.', '"The film is ordinary water" — It is liquid-like and disordered but not the same as the bulk liquid, and its thickness and structure depend on the temperature and the substance touching it.'],
  terms: [
    { term: 'Quasi-liquid layer', also: ['premelted layer', 'surface melting', 'liquid-like layer'], def: 'A thin, disordered, liquid-like film on the surface of ice below its melting point, a molecular layer or two thick at −30 °C and several nanometres at −1 °C.' },
    { term: 'Premelting', also: ['interfacial melting'], def: 'Melting that begins at a surface or interface below the bulk melting temperature, because the molecules there have fewer neighbours and a lower cost of disorder.' },
    { term: 'Pressure melting', also: ['regelation', 'pressure-induced melting'], def: 'The lowering of the melting point of ice under pressure, by 0.0074 K per bar, because ice is less dense than water; it lets a wire pass slowly through a block of ice, which re-freezes behind it (regelation).' },
    { term: 'Friction heating', also: ['frictional melting'], def: 'Melting of a thin layer by the heat generated in sliding, with power $\\mu m g v$; the main lubricant at higher speeds.' },
    { term: 'Coefficient of friction', also: ['μ'], def: 'The ratio of the friction force to the load pressing the surfaces together; for steel on ice about 0.005–0.05 near −5 °C, rising at lower temperatures.' }
  ],
  formulas: [
    { name: 'Pressure under a blade', expr: 'p = m*g/A', tex: 'p = \\frac{m\\,g}{A}',
      vars: { p: { name: 'pressure on the ice', q: 'pressure', unit: 'MPa' }, m: { name: 'mass of the skater', q: 'mass', unit: 'kg', value: 75 }, g: { const: 'g' }, A: { name: 'contact area', q: 'area', unit: 'cm²', value: 1, hint: 'A hockey skate on hard ice touches over a few cm²; real contact on a rough blade is smaller.' } },
      solveFor: 'p', note: 'The average pressure on the contact, not the peak at asperities.',
      stories: { p: 'A skater of {m} stands on a blade that touches the ice over {A}. What is the pressure?', A: 'A {m} skater presses with {p}. What contact area does that need?' } },
    { name: 'Lowering of the melting point by pressure', expr: 'dT = T0*dp*(1/rhoL - 1/rhoS)/L', tex: '\\Delta T_m = \\frac{T_0\\,\\Delta p\\,\\left(1/\\rho_\\ell - 1/\\rho_s\\right)}{L}',
      vars: { dT: { name: 'change in melting point', q: 'dtemp', unit: 'K', signed: true, tex: '\\Delta T_m' }, T0: { name: 'melting temperature', q: 'temperature', unit: '°C', value: 0, tex: 'T_0' }, dp: { name: 'extra pressure', q: 'pressure', unit: 'MPa', value: 7.35, tex: '\\Delta p' }, rhoL: { name: 'density of water', q: 'density', unit: 'kg/m³', value: 999.84, tex: '\\rho_\\ell' }, rhoS: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 916.7, tex: '\\rho_s' }, L: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55 } },
      solveFor: 'dT', note: 'Negative: ice melts at a lower temperature when squeezed. Good to about 2,000 bar, where ice III takes over.',
      stories: { dT: 'A blade presses ice at {dp} above atmospheric. By how many kelvin does the melting point change?', dp: 'What extra pressure lowers the melting point of ice by {dT}?' } },
    { name: 'Heat made by sliding', expr: 'P = mu*m*g*v', tex: 'P = \\mu\\, m\\, g\\, v',
      vars: { P: { name: 'frictional heating power', q: 'power', unit: 'W' }, mu: { name: 'friction coefficient', value: 0.02, tex: '\\mu', hint: '0.005–0.05 for steel on ice near −5 °C.' }, m: { name: 'mass of the skater', q: 'mass', unit: 'kg', value: 75 }, g: { const: 'g' }, v: { name: 'sliding speed', q: 'speed', unit: 'm/s', value: 6 } },
      solveFor: 'P', note: 'All of this heat goes to the ice and blade at their interface; dividing by the latent heat gives the ice melted per second.',
      stories: { P: 'A skater of {m} glides at {v} with friction coefficient {mu}. How much heat is made each second?' } }
  ],
  examples: [
    { title: 'How cold can pressure melting reach?', q: 'A 75 kg skater stands on one blade with a contact area of 1 cm². By how much does the pressure lower the melting point, and is it enough on ice at −8 °C?',
      steps: [{ text: 'Pressure:', tex: 'p = \\frac{75\\times9.81}{10^{-4}} = 7.4\\ \\mathrm{MPa}' }, { text: 'Melting-point change:', tex: '\\Delta T_m = \\frac{273.15\\times7.4\\times10^6\\times(1.00016\\times10^{-3} - 1.0909\\times10^{-3})}{3.3355\\times10^5} = -0.55\\ \\mathrm{K}' }, 'The ice at −8 °C is 8 K below its normal melting point, 15 times more than the blade can reach.'],
      a: 'The melting point drops by 0.55 K — to 7 % of what is needed. Another mechanism lubricates ice at −8 °C.' },
    { title: 'The heat of a glide', q: 'The same skater glides at 6 m/s; the friction coefficient is 0.02. How much ice melts per second?',
      steps: [{ text: 'Power:', tex: 'P = 0.02\\times75\\times9.81\\times6 = 88\\ \\mathrm{W}' }, { text: 'Ice melted per second:', tex: '\\frac{88}{3.3355\\times10^{5}} = 2.6\\times10^{-4}\\ \\mathrm{kg} = 0.26\\ \\mathrm{g}' }],
      a: 'About a quarter of a gram of ice every second — a film that is renewed continuously under the blade (some of the heat warms the blade and ice, so the real figure is smaller).' }
  ],
  quiz: [
    { q: 'A 75 kg skater on a blade of 1 cm² contact area presses on the ice at about 7 MPa. By how much does this lower the melting point?', choices: ['about 0.01 K', 'about 0.5 K', 'about 5 K', 'about 50 K'], a: 1, why: 'Ice melts 0.0074 K lower per bar, and 7.4 MPa is 74 bar: a drop of 0.55 K. Skating at −10 °C needs eighteen times that, so pressure is not what lubricates the blade.' },
    { q: 'Which statement about the quasi-liquid layer is correct?', choices: ['It is a layer of ordinary water trapped under the skate', 'It forms only under pressure', 'It exists on the surface of ice even without a skate, and thickens towards 0 °C', 'It is thickest at −40 °C'], a: 2, why: 'Surface molecules have fewer neighbours, so the surface is disordered below the melting point whether or not it is pressed; the film thickens towards 0 °C and thins to about a bilayer by −40 °C.' },
    { q: 'Ice gets very sticky at about −40 °C. The best explanation is that', choices: ['the liquid-like surface film has all but disappeared', 'the ice becomes denser than water', 'skates freeze to it', 'the friction heating becomes too small to measure'], a: 0, why: 'With the film gone and the molecules at the surface held in the ordered lattice, there is nothing to lubricate the contact; very cold ice has friction coefficients far above those near −5 °C.' },
    { q: 'Because ice is slippery at −20 °C, it is the pressure of the blade that melts it.', a: false, why: 'To melt ice at −20 °C needs nearly 200 MPa. A blade cannot make that, so the film must come from the surface itself and from sliding heat.' },
    { q: 'A 60 kg skater at 8 m/s with a friction coefficient of 0.015 makes how much frictional heat each second, in joules?', answer: 70.6, unit: 'W', why: '$P = \\mu m g v = 0.015\\times60\\times9.81\\times8 \\approx 71$ W.' }
  ],
  applications: ['Skates, skis and sleds: wax and edge design choose a film thickness for the snow temperature; cold, dry snow wants hard waxes, wet snow grooves to carry the water away.', 'Curling: the sweepers warm the pebbled ice in front of the stone, which lets it travel farther.', 'Glaciers and the ground: the same films let ice slide on its bed and let water flow to growing ice lenses in frozen soil ([[glaciers-flow]]).', 'Ice-core and snow chemistry: trace gases and acids stored in the surface layer take part in chemistry that would not occur on a true solid.'],
  history: 'James Thomson predicted the lowering of the melting point of ice under pressure in 1849 and his brother William (Lord Kelvin) confirmed it; Faraday proposed the surface film in 1850, and the two ideas competed for explaining why wet ice blocks freeze together. Osborne Reynolds applied pressure melting to skating in 1899. Bowden and Hughes\'s *The mechanism of sliding on ice and snow* (1939) put friction heating on a measured footing, and the modern revival of the surface-film idea began with ellipsometry and ion-scattering experiments from the 1980s.',
  sources: ['Dash, J. G., Fu, H. and Wettlaufer, J. S., "The premelting of ice and its environmental consequences", *Reports on Progress in Physics* 58, 115 (1995).', 'Bowden, F. P. and Hughes, T. P., "The mechanism of sliding on ice and snow", *Proceedings of the Royal Society A* 172, 280 (1939).', 'Rosenberg, R., "Why is ice slippery?", *Physics Today* 58 (12), 50 (2005) — the accessible modern review.', 'Petrenko and Whitworth, *Physics of Ice*, ch. 9 (surface of ice) and 10 (friction).'],
  sim: 'ice-slippery'
},

/* ================================================================ supercooling and nucleation */
{
  id: 'supercooling-and-nucleation', parent: 'the-ice-that-floats', title: 'Supercooling and nucleation', level: 3,
  short: 'Water has no wish to stay liquid below 0 °C, but freezing has to start somewhere: a cluster of molecules in the ice pattern large enough to keep growing. Clean droplets wait until −38 °C or so; a particle, or the protein of a bacterium, can start it at −2 °C. Most of the sky\'s clouds are supercooled liquid.',
  keywords: ['supercooling', 'supercooled water', 'nucleation', 'homogeneous nucleation', 'heterogeneous', 'ice-nucleating particle', 'Pseudomonas syringae', 'freezing rain', 'critical nucleus', 'classical nucleation theory', 'silver iodide', 'cloud seeding', 'instant freezing', 'recalescence'],
  prereq: ['melting-and-the-latent-heat-of-fusion', 'why-ice-floats', 'the-structure-of-liquid-water'],
  related: ['supercooled-water-and-no-mans-land', 'two-liquids-in-one', 'clouds-rain-and-snow', 'snowflakes', 'the-mpemba-effect', 'the-phase-diagram', 'chemistry:phase-diagrams', 'chemistry:entropy'],
  body: `
Put a sealed bottle of purified water in a freezer for a couple of hours, take it out carefully, and it is still liquid at −8 °C. Tap it on the counter, or pour it onto a piece of ice, and within a second it turns to a white slush of ice crystals, warming back to 0 °C as it goes. The water was **supercooled**: below its freezing point but still liquid. The same thing happens, on a vast scale and for the same reason, in most of the world's clouds, where droplets at −10 or −20 °C hang in the air as liquid.

### Why freezing has to start
At 0 °C ice and water have the same free energy; below it, ice has the lower. But a tiny crystal of ice in the liquid pays a **surface cost**: the interface between ice and water has an energy $\\sigma \\approx 0.028$ J/m² (estimates range from 0.02 to 0.035), proportional to the area $r^2$, while the gain from turning liquid to ice is proportional to the volume $r^3$. For small clusters the surface wins and the cluster dissolves; beyond a **critical radius** the volume wins and it grows. Balancing the two gives the **classical nucleation theory** results

$$r^* = \\frac{2\\sigma T_m}{\\rho_i L\\,\\Delta T}, \\qquad \\Delta G^* = \\frac{16\\pi\\sigma^3 T_m^2}{3\\,(\\rho_i L\\,\\Delta T)^2}$$

with $\\Delta T = T_m - T$ the supercooling. The barrier $\\Delta G^*$ must be climbed by a chance thermal fluctuation, and the rate at which that happens is proportional to $\\exp(-\\Delta G^*/k_BT)$.

| Temperature | Critical radius | Molecules in the nucleus | Barrier ÷ $k_BT$ |
|---|---|---|---|
| −10 °C | 4.9 nm | 15,000 | 770 |
| −20 °C | 2.5 nm | 1,900 | 200 |
| −30 °C | 1.6 nm | 560 | 92 |
| −38 °C | 1.3 nm | 280 | 59 |

At −10 °C a nucleus has to be 15,000 molecules in the ice arrangement at once, and the barrier is hundreds of thermal energies: it essentially never happens. At −38 °C it is 280 molecules and sixty thermal energies, and a droplet 10 µm across, which contains $10^{13}$ molecules and gets $10^{12}$ tries a second each, freezes within a second or two. This **homogeneous nucleation** sets the floor: no pure droplet of the size found in clouds stays liquid below about −38 to −41 °C. (Experiments with micrometre droplets cooled very fast have gone to −46 °C before freezing, and water below that in "no man's land" freezes within microseconds however pure — [[supercooled-water-and-no-mans-land]].) Larger volumes freeze warmer: simply more chances.

### What starts it sooner
A particle that already looks something like ice cuts the barrier by a factor $f(\\theta) = (2 + \\cos\\theta)(1 - \\cos\\theta)^2/4$, where $\\theta$ is the contact angle of the ice embryo on the particle: 1 for no help, near 0 for a perfect match. This **heterogeneous nucleation** is how nearly all water freezes in the world:

- **Silver iodide** has a hexagonal lattice with spacings within 2 % of ice; Vonnegut found in 1947 that it works at about −4 °C, which is why it is used in cloud seeding.
- **Mineral dust**, especially potassium feldspar, is the main ice-nucleating particle in the atmosphere, active below about −15 °C.
- **Bacteria**, notably *Pseudomonas syringae*, carry a protein on their outer surface whose regularly spaced groups arrange water into an ice-like template; it works at −2 °C and is used to make snow in ski resorts. The same bacteria on leaves cause frost damage to crops.

### Consequences
- **Freezing rain** falls as rain from a warm layer aloft, supercools in a shallow layer of sub-zero air at the ground, and freezes on contact with a road, wire or branch, making glaze ice. It is dangerous because the impact itself is the nucleation.
- **Aircraft icing** is the freezing of supercooled droplets on the wing: the same droplets, which only needed something to hit.
- **Recalescence.** When supercooled water finally freezes, the latent heat warms the mixture back to 0 °C, so only a fraction freezes at once: $x = c_w\\Delta T/L$, about 1.25 % per kelvin of supercooling, 10 % from −8 °C, nearly 50 % from −38 °C. The rest freezes as the heat leaves.

> [!key] Ice needs a nucleus beyond a critical size (1.3 nm, some 280 molecules, at −38 °C; 5 nm at −10 °C), and the chance of one forming spontaneously is vanishingly small until about −38 °C. Particles and bacterial proteins start freezing at −2 to −15 °C, and the sky is full of liquid water below zero for that reason.`,
  ideas: ['Water can be supercooled because a seed of ice must exceed a critical radius to grow: small clusters dissolve, since their surface costs more than their volume gains.', 'The critical nucleus shrinks from about 5 nm (15,000 molecules) at −10 °C to 1.3 nm (280 molecules) at −38 °C, where the barrier is some sixty thermal energies.', 'Pure droplets of cloud size freeze at about −38 °C (homogeneous nucleation); particles such as silver iodide (−4 °C), dust (−15 °C) and bacterial proteins (−2 °C) lower the barrier (heterogeneous nucleation).', 'On freezing, the latent heat warms the water back to 0 °C, so only about 1.25 % per kelvin of supercooling freezes at once.'],
  pitfalls: ['"Water always freezes at 0 °C" — 0 °C is where ice *can* coexist with water, not where freezing has to start; pure water can wait to −38 °C and below.', '"Supercooled water is unstable and freezes instantly" — It is metastable: it may last hours in a clean bottle, or in a cloud, until something provides a nucleus.', '"Cloud seeding makes it rain from nothing" — Seeding with silver iodide only starts freezing in clouds that are already supercooled; it cannot make a cloud.'],
  terms: [
    { term: 'Supercooling', also: ['undercooling', 'supercooled liquid'], def: 'Cooling a liquid below its freezing point without it freezing. The supercooling is the number of kelvin between the freezing point and the actual temperature.' },
    { term: 'Nucleation', also: ['ice nucleation', 'nucleus formation'], def: 'The first step of freezing: the chance appearance, in the liquid or on a surface, of a cluster of ice large enough to keep growing.' },
    { term: 'Critical nucleus', also: ['critical radius', 'critical embryo'], def: 'The ice cluster of the size at which growth and dissolution are equally likely: $r^* = 2\\sigma T_m/(\\rho_i L\\Delta T)$, 1.3 nm at −38 °C.' },
    { term: 'Homogeneous nucleation', also: ['spontaneous freezing'], def: 'Nucleation within pure liquid with no foreign surface, occurring in clean droplets at about −38 °C.' },
    { term: 'Heterogeneous nucleation', also: ['ice-nucleating particle', 'INP'], def: 'Nucleation helped by a foreign surface — dust, a crystal, a protein — which lowers the barrier by a factor $f(\\theta)$ and so starts freezing at a much warmer temperature.' },
    { term: 'Recalescence', also: ['freezing flash'], def: 'The sudden rise in temperature of a supercooled liquid back to its freezing point when it begins to freeze and releases its latent heat.' }
  ],
  formulas: [
    { name: 'Radius of the critical nucleus', expr: 'r = 2*sigma*T0/(rho*L*(T0 - T))', tex: 'r^* = \\frac{2\\,\\sigma\\,T_m}{\\rho_i\\,L\\,(T_m - T)}',
      vars: { r: { name: 'critical radius', q: 'length', unit: 'nm', tex: 'r^*' }, sigma: { name: 'ice–water interfacial energy', q: 'surfacetension', unit: 'mN/m', value: 27.5, tex: '\\sigma', hint: 'About 27.5 mN/m; estimates run from 20 to 35.' }, T0: { const: 'T0', tex: 'T_m' }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho_i' }, L: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55, hint: 'Taken at 0 °C; it is smaller at −38 °C, which would make the nucleus larger.' }, T: { name: 'temperature of the liquid', q: 'temperature', unit: '°C', value: -38, min: -60, max: -0.5 } },
      solveFor: 'r', note: 'Gibbs–Thomson: the colder the water, the smaller the cluster that can survive.',
      stories: { r: 'A droplet is supercooled to {T}. How large is the smallest ice cluster that will grow?', T: 'The critical nucleus in a droplet has a radius of {r}. How cold is the droplet?' } },
    { name: 'Nucleation barrier in thermal energies', expr: 'b = 16*pi*sigma^3*T0^2/(3*(rho*L*(T0 - T))^2*kB*T)', tex: 'b = \\frac{\\Delta G^*}{k_B T} = \\frac{16\\pi\\,\\sigma^3\\,T_m^2}{3\\,(\\rho_i L\\,(T_m - T))^2\\,k_B T}',
      vars: { b: { name: 'barrier ÷ kT', hint: 'Freezing is likely within seconds in a micrometre droplet when this falls to about 60.' }, sigma: { name: 'ice–water interfacial energy', q: 'surfacetension', unit: 'mN/m', value: 27.5, tex: '\\sigma' }, T0: { const: 'T0', tex: 'T_m' }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho_i' }, L: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55 }, T: { name: 'temperature of the liquid', q: 'temperature', unit: '°C', value: -38, min: -60, max: -0.5 }, kB: { const: 'kB', tex: 'k_B' } },
      solveFor: 'b', note: 'The rate of nucleation per unit volume goes as $\\exp(-b)$, so a drop in $b$ from 770 at −10 °C to 59 at −38 °C is a change of the rate by some 300 powers of ten.',
      stories: { b: 'Water is supercooled to {T}. What is the nucleation barrier, in units of kT?' } },
    { name: 'How much a particle helps', expr: 'f = (2 + cos(theta))*(1 - cos(theta))^2/4', tex: 'f(\\theta) = \\frac{(2 + \\cos\\theta)(1 - \\cos\\theta)^2}{4}',
      vars: { f: { name: 'barrier reduction factor', hint: '1 means no help; 0.04 at 40°; 0.0002 at 10°.' }, theta: { name: 'contact angle of ice on the particle', q: 'angle', unit: '°', value: 40, min: 0, max: 180, tex: '\\theta', hint: 'Small for a particle that matches the ice lattice, 180° for none.' } },
      solveFor: 'f', note: 'The factor multiplies the barrier of the formula above: a particle with a contact angle of 40° cuts it to a twenty-fifth.',
      stories: { f: 'Ice sits on a nucleating particle with a contact angle of {theta}. By what factor is the nucleation barrier reduced?' } },
    { name: 'Fraction that freezes at once', expr: 'x = cw*dT/L', tex: 'x = \\frac{c_w\\,\\Delta T}{L}',
      vars: { x: { name: 'fraction frozen at once', q: 'ratio', unit: '%' }, cw: { const: 'cW', tex: 'c_w' }, dT: { name: 'supercooling', q: 'dtemp', unit: 'K', value: 8, tex: '\\Delta T' }, L: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55 } },
      solveFor: 'x', note: 'The heat of the part that freezes warms the whole sample back to 0 °C; the rest freezes only as heat is taken away. Uses $c_w$ at 0 °C; at −38 °C real supercooled water has a larger heat capacity and a smaller latent heat, so a little more freezes.',
      stories: { x: 'Water supercooled by {dT} begins to freeze. What fraction becomes ice at once?', dT: 'When a supercooled sample starts to freeze, {x} turns to ice at once. How supercooled was it?' } }
  ],
  examples: [
    { title: 'The nucleus at −38 °C', q: 'Water is supercooled to −38 °C ($\\Delta T = 38$ K). With $\\sigma = 27.5$ mN/m, $L = 333.55$ kJ/kg and $\\rho_i = 917$ kg/m³, find the critical radius, the number of molecules in the nucleus and the barrier in units of $k_BT$.',
      steps: [{ text: 'Radius:', tex: 'r^* = \\frac{2\\times0.0275\\times273.15}{917\\times3.3355\\times10^5\\times38} = 1.29\\ \\mathrm{nm}' }, 'Volume of the sphere $= \\tfrac43\\pi r^3 = 9.0\\times10^{-27}$ m³; its mass $917\\times9.0\\times10^{-27} = 8.2\\times10^{-24}$ kg; molecules $= 8.2\\times10^{-24}/2.99\\times10^{-26} = 277$.', { text: 'Barrier:', tex: '\\Delta G^* = \\frac{16\\pi\\sigma^3T_m^2}{3(\\rho_iL\\Delta T)^2} = 1.9\\times10^{-19}\\ \\mathrm{J} = 59\\ k_BT\\quad(k_BT = 3.2\\times10^{-21}\\ \\mathrm{J}\\ \\text{at}\\ 235\\ \\mathrm{K})' }],
      a: 'A nucleus of about 1.3 nm, 280 molecules, over a barrier of about 59 thermal energies: reachable in a micrometre droplet within seconds, and essentially never at −10 °C (5 nm, 770 $k_BT$).' },
    { title: 'The bottle in the freezer', q: 'A sealed bottle of 500 g of pure water is supercooled to −8 °C. When it is tapped and starts to freeze, how much ice forms at once, and what is its temperature just after?',
      steps: [{ text: 'Fraction frozen at once:', tex: 'x = \\frac{4186\\times8}{3.3355\\times10^5} = 0.10' }, 'So 50 g of the 500 g turns to ice immediately, releasing $0.05\\times333.55 = 16.7$ kJ, which warms the other 450 g by exactly 8 K — back to 0 °C.', 'The slush then freezes slowly as the freezer removes heat.'],
      a: '10 % — about 50 g of ice at once — and the bottle returns to 0 °C, a mix of ice and water, as the temperature jumps up in the instant of freezing.' }
  ],
  quiz: [
    { q: 'A sealed bottle of very clean water has been cooled to −6 °C and is still liquid. This is best described as', choices: ['impossible: water freezes at 0 °C', 'supercooling: the water is metastable, waiting for a nucleus', 'the effect of dissolved gases lowering the freezing point to −6 °C', 'a sign that the thermometer is wrong'], a: 1, why: 'Freezing needs a nucleus larger than the critical size. With none (no particles, no scratches, no shock) the liquid can stay below 0 °C for hours.' },
    { q: 'Why does the temperature of a supercooled sample jump up to 0 °C when it starts freezing?', choices: ['the ice is warmer than the water', 'the latent heat of the ice that forms warms the remaining liquid', 'friction between crystals', 'the freezer door opened'], a: 1, why: 'Freezing releases 333 kJ/kg; the part that freezes first (about 1.25 % per kelvin of supercooling) gives enough heat to warm the rest of the sample to 0 °C.' },
    { q: 'A droplet of pure water is cooled slowly in a clean laboratory. Roughly where does it freeze?', choices: ['−2 °C', '−10 °C', '−38 °C', '−100 °C'], a: 2, why: 'Homogeneous nucleation, with no help from any surface, sets in near −38 °C for micrometre-size droplets, where the critical nucleus has shrunk to a few hundred molecules and the barrier to about sixty thermal energies.' },
    { q: 'Bacteria such as *Pseudomonas syringae* start freezing at about −2 °C because', choices: ['they are very cold themselves', 'a protein in their outer membrane arranges water molecules like ice, lowering the barrier', 'they emit heat', 'they contain silver'], a: 1, why: 'The ice-nucleation protein repeats a pattern that matches the ice lattice, so ice embryos form on it at very small supercooling — a very small contact angle.' },
    { q: 'Larger droplets of pure water freeze at slightly warmer temperatures than small ones.', a: true, why: 'Nucleation is a matter of chance per unit volume per second; more volume means more opportunities in the time available, so the typical freezing temperature rises with droplet size.' }
  ],
  applications: ['Weather and climate: most clouds between 0 and −38 °C hold supercooled liquid; ice-nucleating particles decide how much of a cloud becomes snow, and so its brightness and lifetime in climate models ([[clouds-rain-and-snow]]).', 'Aviation and power lines: freezing rain and in-flight icing on supercooled large droplets, which freeze on impact.', 'Snowmaking and food freezing: killed *P. syringae* protein is added to snow-gun water, and ice-nucleating proteins are used in ice cream and in cryopreservation to control crystal size.', 'Cryobiology, "antifreeze" proteins in fish and insects, and wintering insects that supercool their body fluids to −20 °C or below to survive.'],
  history: 'Fahrenheit reported in 1724 that sealed, undisturbed water could be cooled well below its freezing point and froze when shaken; Gay-Lussac found in 1819 that it could be kept liquid to −12 °C in narrow tubes. Vincent Schaefer and Bernard Vonnegut showed in 1946–47 that a pellet of dry ice, and then silver iodide smoke, could freeze a supercooled cloud, founding cloud seeding. Maki, Galyan, Chang-Chien and Caldwell showed in 1974 that the bacterium *Pseudomonas syringae* nucleates ice.',
  sources: ['Kim, K. H. and colleagues, *Science* 370, 978 (2020), as reported by *Physics Today* (19 November 2020) — liquid water under pressure in "no man\'s land" freezes within microseconds however pure.', 'Pruppacher, H. R. and Klett, J. D., *Microphysics of Clouds and Precipitation* (2nd ed., 1997), ch. 9 — classical nucleation theory for the freezing of cloud droplets.', 'Atkinson, J. D. and colleagues, "The importance of feldspar for ice nucleation by mineral dust in mixed-phase clouds", *Nature* 498, 355 (2013).', 'Maki, L. R., Galyan, E. L., Chang-Chien, M.-M. and Caldwell, D. R., "Ice nucleation induced by *Pseudomonas syringae*", *Applied Microbiology* 28, 456 (1974).'],
  sim: 'ice-droplets'
},

/* ================================================================ glaciers flow */
{
  id: 'glaciers-flow', parent: 'the-ice-that-floats', title: 'Glaciers flow', level: 2,
  short: 'Ice, a hard and brittle solid in the hand, creeps like a very stiff fluid under the weight of a few hundred metres of itself: the strain rate goes as the cube of the stress, so thick ice flows fast. Glaciers move from metres to kilometres a year, and the ice sheets of Greenland and Antarctica hold 68.7 % of Earth\'s fresh water.',
  keywords: ['glacier', 'glacier flow', 'Glen\'s law', 'creep', 'ice sheet', 'basal sliding', 'pressure melting', 'ice stream', 'Greenland', 'Antarctica', 'ice velocity', 'ice deformation', 'subglacial lake', 'U-shaped valley'],
  prereq: ['why-ice-floats', 'the-phase-diagram', 'frost-wedging-and-burst-pipes'],
  related: ['glaciers-sculpt', 'how-much-water-earth-has', 'sea-ice-and-albedo', 'icebergs-and-sea-ice', 'ice-beyond-earth', 'why-ice-is-slippery', 'physics:viscosity'],
  body: `
A glacier is a river of ice that you cannot see move. Plant a line of stakes across the Mer de Glace and after a year the line has bowed downhill: the middle has moved on by something like a hundred metres and the sides by very little. In 1842 James Forbes, who measured exactly this, decided that a glacier flows like a very viscous fluid, and the argument has continued since over what kind, but the observation is not in doubt. Ice flows.

### Why a solid flows
Ice at −10 °C is at 96 % of its melting temperature on the kelvin scale, which for a crystalline solid is hot: its crystal planes slip over each other, dislocations glide in the basal planes of the hexagonal lattice, grain boundaries slide, and ice that is stressed for months or years deforms steadily — it **creeps**. Under a small stress it flows slowly. Under a large one it flows fast, much faster than in proportion: the law John Glen measured in the laboratory in 1955 is

$$\\dot\\varepsilon = A\\,\\tau^{\\,n}, \\qquad n \\approx 3$$

where $\\dot\\varepsilon$ is the strain rate, $\\tau$ the shear stress and $A$ a "rate factor" that depends strongly on temperature: $2.4\\times10^{-24}$ Pa⁻³ s⁻¹ at 0 °C, $3.5\\times10^{-25}$ at −10 °C, $3.7\\times10^{-26}$ at −30 °C — warm ice is 65 times softer than ice at −30 °C. Because the exponent is 3, doubling the stress multiplies the strain rate by 8.

### Putting a glacier together
In a slab of thickness $H$ on a slope $\\alpha$, the shear stress at the bed is $\\tau_b = \\rho g H \\sin\\alpha$ (157 kPa for 200 m of ice on 5°), and it falls to zero at the surface. Integrating Glen's law upwards from a bed that sticks gives a velocity that rises from zero at the bed to a maximum at the surface:

$$u_s = \\frac{A}{2}\\,(\\rho g \\sin\\alpha)^3\\,H^4.$$

*The surface speed goes as the fourth power of the thickness*: doubling the thickness makes the glacier 16 times faster. That is how 200 m of temperate ice on a 5° slope moves at 29 m a year and 400 m would move at 470.

### Sliding on a wet bed
Often the glacier is not frozen to its bed. Ice under pressure melts at a lower temperature (0.0074 K per bar); at the base of 1,000 m of ice it is about −0.7 °C, of 3,750 m about −2.7 °C, and the bed is at that temperature as long as geothermal heat and friction keep it there. Meltwater at the bed lets the whole glacier **slide** over the rock; sliding can supply most of the motion, and makes the difference between a glacier crawling at 10 m a year and one running at metres a day. Pressure melting, geothermal heat and the insulation of the ice above together keep liquid lakes under Antarctica, such as Lake Vostok beneath 3.7 km of ice.

| Ice | Typical speed |
|---|---|
| Interior of an ice sheet | a few m/yr |
| Alpine valley glacier | 10–200 m/yr |
| Antarctic ice stream (e.g. Pine Island Glacier) | about 4,000 m/yr |
| Jakobshavn Isbræ, Greenland (summer 2012) | 17,000 m/yr, 46 m/day |
| Surging glacier | up to about 100 m/day for months |

### The size of it
Ice sheets cover about a tenth of Earth's land. Antarctica's ice is up to 4.8 km thick; Greenland's more than 3 km. Together the ice caps hold 24 million km³ of ice, 1.7 % of all the water on Earth and 68.7 % of its fresh water; if all of it melted, the sea would rise by about 65 m (58 m from Antarctica, 7 from Greenland). The water stays an average of about 10,000 years in the ice before flowing out as meltwater or icebergs. Moving ice also carves: the U-shaped valleys of the Alps, the fjords of Norway and the polished rock of the Sierra Nevada are the work of ice flowing at its bed ([[glaciers-sculpt]]).

> [!key] Ice creeps: its strain rate goes as the cube of the stress, so a glacier's speed goes as the fourth power of its thickness and rises steeply as the ice warms to 0 °C. Pressure melting at the bed lets glaciers slide, and Greenland and Antarctica hold 68.7 % of Earth's fresh water.`,
  ideas: ['Ice creeps under sustained stress: Glen\'s law, strain rate $= A\\tau^3$, with $A$ rising about 65-fold from −30 to 0 °C.', 'The basal shear stress is $\\rho g H \\sin\\alpha$ and the surface speed goes as $H^4$: doubling the thickness makes a glacier 16 times faster.', 'The melting point falls by 0.0074 K per bar, so the bed of thick ice can be wet below 0 °C, and meltwater lets glaciers slide, producing speeds of metres a day.', 'Greenland and Antarctica hold 68.7 % of Earth\'s fresh water — about 65 m of sea-level rise if melted.'],
  pitfalls: ['"A glacier flows because it melts at the bottom" — Even a glacier frozen to its bed flows, by internal deformation; melting at the bed adds sliding on top.', '"Ice flows like a liquid with a fixed viscosity" — Its effective viscosity falls as the stress rises (stress cubed in the strain rate), so a thick glacier is far more fluid than a thin one.', '"Glaciers move because slopes are steep" — The slope enters through $\\sin\\alpha$ cubed, but the thickness to the fourth power matters more: ice sheets flow outward on nearly flat beds.'],
  terms: [
    { term: 'Glen\'s flow law', also: ['power-law creep of ice', 'Glen\'s law'], def: 'The empirical relation between the strain rate of ice and the shear stress, $\\dot\\varepsilon = A\\tau^n$ with $n \\approx 3$, from John Glen\'s 1955 laboratory experiments.' },
    { term: 'Rate factor', also: ['flow parameter', 'A'], def: 'The temperature-dependent coefficient $A$ of Glen\'s law: $2.4\\times10^{-24}$ Pa⁻³ s⁻¹ for ice at 0 °C, falling by a factor of 20 between 0 and −20 °C.' },
    { term: 'Basal sliding', also: ['sliding at the bed'], def: 'The motion of a glacier over its bed lubricated by meltwater, which adds to the internal deformation and can account for most of a fast glacier\'s speed.' },
    { term: 'Ice stream', also: ['fast-flowing outlet glacier'], def: 'A channel of fast-moving ice, at hundreds to thousands of metres a year, within a slower ice sheet; it carries most of the ice out to the sea.' },
    { term: 'Calving', also: ['iceberg calving'], def: 'The breaking off of pieces of ice from the front of a glacier or ice shelf into the sea or a lake, forming icebergs.' },
    { term: 'Subglacial lake', also: ['Lake Vostok'], def: 'A body of liquid water beneath an ice sheet, kept liquid by pressure-melting, geothermal heat and the insulation of the ice above; Antarctica has hundreds.' }
  ],
  formulas: [
    { name: 'Shear stress at the bed of a glacier', expr: 'tau = rho*g*H*sin(alpha)', tex: '\\tau_b = \\rho\\,g\\,H\\,\\sin\\alpha',
      vars: { tau: { name: 'basal shear stress', q: 'stress', unit: 'kPa', tex: '\\tau_b' }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho' }, g: { const: 'g' }, H: { name: 'thickness of the ice', q: 'length', unit: 'm', value: 200 }, alpha: { name: 'slope of the surface', q: 'angle', unit: '°', value: 5, min: 0.1, max: 40, tex: '\\alpha' } },
      solveFor: 'tau', note: 'Glaciers adjust their thickness and slope until $\\tau_b$ is about 50–150 kPa, whatever their size.',
      stories: { tau: 'A glacier {H} thick lies on a slope of {alpha}. What is the shear stress at its base?', H: 'The bed of a glacier on a slope of {alpha} is under a shear stress of {tau}. How thick is the ice?' } },
    { name: 'Glen\'s law', expr: 'eps = A*tau^3', tex: '\\dot\\varepsilon = A\\,\\tau^{3}',
      vars: { eps: { name: 'strain rate', q: 'rate', unit: '1/yr', tex: '\\dot\\varepsilon' }, A: { name: 'rate factor', unit: 'Pa⁻³·s⁻¹', value: 2.4e-24, hint: '2.4e-24 at 0 °C, 3.5e-25 at −10 °C, 3.7e-26 at −30 °C (Cuffey and Paterson).' }, tau: { name: 'shear stress', q: 'stress', unit: 'kPa', value: 100, tex: '\\tau' } },
      solveFor: 'eps', note: 'The exponent 3 means a doubled stress gives eight times the strain rate. The rate factor A is in pascals to the power −3 per second.',
      stories: { eps: 'Temperate ice with rate factor {A} is sheared by {tau}. How fast does it deform?', tau: 'Ice with rate factor {A} deforms at {eps}. What shear stress is it under?' } },
    { name: 'Surface speed of a glacier by deformation', expr: 'u = A/2*(rho*g*sin(alpha))^3*H^4*3.15576e7', tex: 'u_s = \\frac{A}{2}\\,(\\rho g\\sin\\alpha)^3\\,H^4',
      vars: { u: { name: 'surface speed from deformation', unit: 'm/yr', tex: 'u_s' }, A: { name: 'rate factor', unit: 'Pa⁻³·s⁻¹', value: 2.4e-24 }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho' }, g: { const: 'g' }, alpha: { name: 'slope', q: 'angle', unit: '°', value: 5, min: 0.1, max: 40, tex: '\\alpha' }, H: { name: 'thickness of the ice', q: 'length', unit: 'm', value: 200 } },
      solveFor: 'u', note: 'For a parallel-sided slab frozen to its bed, with $n = 3$. The factor 3.15576e7 converts metres per second into metres per year. Add the sliding speed, if the bed is wet.',
      stories: { u: 'A temperate glacier {H} thick on a slope of {alpha}, with rate factor {A}. How fast does its surface move by deformation alone?' } },
    { name: 'Melting point at the base of the ice', expr: 'Tm = T0 - k*rho*g*H', tex: 'T_m = T_0 - k\\,\\rho\\,g\\,H',
      vars: { Tm: { name: 'melting temperature at the bed', q: 'temperature', unit: '°C', signed: true, tex: 'T_m' }, T0: { const: 'T0' }, k: { name: 'slope of the melting curve', unit: 'K/Pa', value: 7.4e-8, fixed: true, hint: '0.0074 K per bar.' }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho' }, g: { const: 'g' }, H: { name: 'thickness of the ice', q: 'length', unit: 'm', value: 2000 } },
      solveFor: 'Tm', note: 'A linear approximation (−1.3 °C at 2,000 m); the full melting curve gives −1.4 °C there and −2.1 °C at 3,000 m. A bed colder than this is frozen; at it, the bed is wet.',
      stories: { Tm: 'The bed of an ice sheet lies under {H} of ice. At what temperature does the ice at the bed melt?' } }
  ],
  examples: [
    { title: 'How fast is a thick glacier?', q: 'A temperate glacier is 200 m thick on a 5° slope, with rate factor $2.4\\times10^{-24}$ Pa⁻³ s⁻¹. Find the basal stress and the surface speed by deformation; then find the speed if the thickness doubles.',
      steps: [{ text: 'Basal stress:', tex: '\\tau_b = 917\\times9.81\\times200\\times\\sin5^\\circ = 157\\ \\mathrm{kPa}' }, { text: 'Surface speed:', tex: 'u_s = \\tfrac{A}{2}(\\rho g \\sin\\alpha)^3 H^4 = 1.2\\times10^{-24}\\times(784)^3\\times200^4 = 9.3\\times10^{-7}\\ \\mathrm{m/s} = 29\\ \\mathrm{m/yr}' }, 'Doubling $H$ multiplies $u_s$ by $2^4 = 16$: 466 m/yr (and the stress by 2, to 314 kPa — a stress that real glaciers rarely carry, because a glacier that thick would be on a flatter bed).'],
      a: 'The glacier carries 157 kPa and moves at 29 m a year; at twice the thickness it would run at about 470 m a year.' },
    { title: 'Why Lake Vostok is liquid', q: 'Lake Vostok lies under about 3,750 m of ice. What is the melting temperature of ice at its base?',
      steps: [{ text: 'Pressure:', tex: 'p = \\rho g H = 917\\times9.81\\times3750 = 33.7\\ \\mathrm{MPa}' }, 'The melting point falls by about 0.0074 K per bar at first and a little more slowly at high pressure: the melting curve gives −2.7 °C at 33.7 MPa.', 'The base of the ice only has to be warmer than −2.7 °C, which the geothermal heat from below and the insulation of the ice above arrange, so the ice at the bottom melts and the water collects in a hollow of the bed.'],
      a: 'About −2.7 °C: at 3.75 km depth the ice melts about 2.7 K below its surface melting point, so Vostok is a lake under the ice, not in spite of it.' }
  ],
  quiz: [
    { q: 'Glen\'s law says the strain rate of ice goes as the cube of the stress. If a glacier\'s basal stress doubles, its internal deformation rate', choices: ['doubles', 'quadruples', 'multiplies by 8', 'multiplies by 16'], a: 2, why: '$\\dot\\varepsilon \\propto \\tau^3$: $2^3 = 8$. Ice is "shear-thinning": the harder you push, the more fluid it gets.' },
    { q: 'Two glaciers are identical but one is twice as thick. The thicker one moves at about', choices: ['twice the speed', 'four times the speed', 'eight times', 'sixteen times'], a: 3, why: 'The surface speed by deformation goes as $H^4$ (stress goes as $H$, strain rate as stress cubed, and the integral over thickness adds one more power).' },
    { q: 'Ice at the bed of a 2 km thick ice sheet at −1 °C may be wet because', choices: ['the ice is made of salt water', 'pressure lowers the melting point of ice to about −1.4 °C there', 'geothermal heat has no effect at that depth', 'ice cannot be colder than 0 °C'], a: 1, why: 'The pressure of 18 MPa lowers the melting point by about 1.4 K; ice at −1 °C is above this local melting point, so the bed is at the melting point and wet.' },
    { q: 'Because ice creeps even when frozen to its bed, melting at the bed is not needed for a glacier to move.', a: true, why: 'Internal deformation alone carries the surface along; melting adds sliding, which can be the larger part in fast glaciers.' },
    { q: 'Greenland and Antarctica hold what fraction of the fresh water on Earth?', choices: ['about 7 %', 'about 30 %', 'about 69 %', 'about 99 %'], a: 2, why: 'The ice caps (24 million km³) are 1.7 % of all water and 68.7 % of the fresh water of 35 million km³ (USGS estimate).' }
  ],
  applications: ['Sea-level forecasting: the speed of outlet glaciers and ice streams (Pine Island, Thwaites, Jakobshavn) decides how fast the ice sheets lose ice to the ocean, and Glen\'s law is at the heart of the ice-sheet models used in IPCC reports.', 'Water supply and hazards: meltwater from valley glaciers feeds rivers (Indus, Ganges, Rhine), and surges and outburst floods threaten valleys below.', 'Climate archives: the slow flow carries old ice to the margins in blue-ice areas, and thinning at the bottom of ice cores is calculated from the flow law.', 'Planetary science: the same flow law is used for the ice shells of Europa and Enceladus ([[ice-beyond-earth]]).'],
  history: 'Louis Agassiz\'s *Études sur les glaciers* (1840) made the case that Switzerland had been covered with ice; James Forbes in 1842–43 showed that glaciers flow as viscous fluids and mapped velocity across the Mer de Glace. Max Perutz, later a Nobel laureate in chemistry, studied the crystal structure of Alpine glacier ice in 1938–39. John Nye (1952) and John Glen (1955) gave the flow law, and Hans Weertman (1957) the theory of sliding.',
  sources: ['Cuffey, K. M. and Paterson, W. S. B., *The Physics of Glaciers* (4th ed., 2010) — Glen\'s law, the rate factor and the velocity profile.', 'Glen, J. W., "The creep of polycrystalline ice", *Proceedings of the Royal Society A* 228, 519 (1955).', 'USGS Water Science School, "Where is Earth\'s water?" — the distribution of Earth\'s water and fresh water (after Gleick).', 'Fretwell, P. and colleagues, "Bedmap2", *The Cryosphere* 7, 375 (2013) — Antarctic ice thickness and the 58 m sea-level equivalent.'],
  sim: 'ice-glacier'
},

/* ================================================================ the Mpemba effect */
{
  id: 'the-mpemba-effect', parent: 'the-ice-that-floats', title: 'The Mpemba effect', level: 2,
  short: 'Can hot water freeze faster than cold? It has been said since Aristotle and named for a Tanzanian schoolboy in 1969, but it is not an established fact: careful modern experiments have found no reliable effect, and where it appears the causes are probably supercooling, evaporation and how "frozen" is judged.',
  keywords: ['Mpemba', 'Mpemba effect', 'hot water freezes faster', 'Aristotle', 'Osborne', 'Burridge and Linden', 'evaporation', 'supercooling', 'convection', 'dissolved gas', 'Newton cooling', 'contested', 'ice cream'],
  prereq: ['supercooling-and-nucleation', 'evaporative-cooling', 'melting-and-the-latent-heat-of-fusion'],
  related: ['the-list-of-anomalies', 'what-remains-unknown', 'supercooled-water-and-no-mans-land', 'thermal-conductivity-of-water', 'specific-heat-of-water', 'physics:heat-transfer'],
  body: `
Put two identical containers of water in a freezer, one hot, one cold. Which freezes first? Common sense, and Newton's law of cooling, say the cold one: the hot water has to cool through the temperature the cold one starts at, so it must be behind. Many people claim to have seen the opposite. This page is about that claim, and it is the one page of this topic where the honest answer is *we do not know that the effect exists*.

### A claim older than physics
Aristotle wrote in his *Meteorologica* that water which has been warmed freezes faster, and that fishermen at Pontus, who set up their reed screens on the ice, poured warm water round them so that it would freeze and hold them fast. Francis Bacon (1620) and René Descartes (1637) repeated it. In 1963 a thirteen-year-old boy, Erasto Mpemba, at Magamba Secondary School in Tanzania, was making ice cream, and found that his hot mixture froze before his classmates' cold one. Teased by teachers and pupils, he asked a visiting professor, Denis Osborne of University College, Dar es Salaam, who had it tested and published with him a paper in *Physics Education* in 1969 under the title "Cool?". The effect has carried the boy's name since.

### What the candidates are
| Suggested cause | How it would work | State of the evidence |
|---|---|---|
| **Evaporation** | The hot sample loses a few per cent of its mass, and each gram carries away 2.3 kJ, a quarter of the extra heat to be removed | Real, but in simple models and in experiments it narrows the gap and does not close it |
| **Supercooling** | Samples freeze at random temperatures below 0 °C; if the hot one supercools less, it can finish first | Real and probably the commonest cause where the effect is seen; but it is chance unless hot and cold really differ |
| **Convection** | Hot water sets up stronger convection, and keeps its surface warmer, which cools the whole faster | Plausible; modelling suggests it cannot do it alone |
| **Dissolved gas and solutes** | Boiling drives off gas and precipitates salts of hard water, which may change nucleation | Possible; poorly established |
| **The container and frost** | A hot container melts frost under it, giving better thermal contact | Real for sample dishes on a freezer shelf; an artefact |
| **What "frozen" means** | Beginning of freezing, a skin of ice, solid all through, or a given temperature below zero | Different definitions give different winners |

### The state of the argument
In 2016 Henry Burridge and Paul Linden at Cambridge carried out careful experiments in which they controlled the container, the position of the thermometers and the volumes; they found **no Mpemba effect**, and showed that earlier reports can arise from small differences in how and where the temperature is measured, and from the random timing of freezing. Others, such as David Auerbach (1995), James Brownridge (2011) and Monwhea Jeng (2006, a review), reported hot samples freezing first in some set-ups, which they attributed to supercooling; some theorists (Vynnycky and Kimura, 2015) concluded that natural convection alone cannot account for it. Explanations in terms of hydrogen bonds have been offered but not confirmed, and "memory" in water is a different matter (see [[polywater-and-water-memory]]). Katz (2009) lists the plausible causes in one table and says that in any one experiment several may operate.

So the "effect" is best described as *a possibility in particular circumstances*, which probably depends on chance and on measurement, and not as a law of water. A confusing wrinkle: in 2020 Kumar and Bechhoefer made a colloidal particle in a potential relax faster from a hotter start (a real Mpemba effect in a different system, whose theory is well understood), showing that the idea itself — a hotter system reaching equilibrium sooner — is not paradoxical, even if it has not been established for water in a freezer.

### What the simulation shows
The model uses only Newton's law of cooling and the heat that has to be taken out: for 200 g, 142 kJ from the 90 °C sample and 96 kJ from the 35 °C one. Evaporation closes about a quarter of that gap. Supercooling alone favours neither sample. Let the hot sample nucleate warmer by a few kelvin, for whatever reason, and it can win — which tells you where to look, not that it happens.

> [!key] Hot water freezing before cold is not an established property of water: careful 2016 experiments found no reliable effect, and where it is seen the likely causes are evaporation, supercooling and how "frozen" is defined. It is a good puzzle because the physics behind each candidate cause is real.`,
  ideas: ['Newton\'s law of cooling predicts that the warm sample always freezes first: the hot one must pass through the warm one\'s starting temperature.', 'Candidate causes — evaporation, supercooling, convection, dissolved gas, container effects, the definition of frozen — are each real physics, but none is shown to explain a robust effect.', 'Careful modern experiments (Burridge and Linden, 2016) found no reliable Mpemba effect in water; earlier reports likely reflected measurement differences and random supercooling.', 'A real Mpemba effect has been shown in other systems (a colloidal particle, 2020): a hotter system can equilibrate faster there, but that is a different question.'],
  pitfalls: ['"The Mpemba effect is a proven property of water" — It is contested, and the best controlled experiments do not find it. It may occur in specific set-ups, where its cause is likely supercooling or evaporation.', '"Hot water freezes faster because it has more energy" — It has more heat to lose, and the extra must be removed before it can freeze. Only side effects such as evaporation and supercooling could reverse the order.', '"The effect is explained by hydrogen bonds" — Proposals exist, but none is established, and arguments from "memory" in water have been tested and found wanting.'],
  terms: [
    { term: 'Mpemba effect', also: ['Aristotle–Mpemba effect', 'hot water freezes faster'], def: 'The claim that, under some conditions, hot water freezes sooner than cold water; named for Erasto Mpemba, whose 1969 paper with Denis Osborne revived it. Its existence in water is disputed.' },
    { term: 'Newton\'s law of cooling', also: ['exponential cooling'], def: 'The rate of loss of heat is proportional to the temperature difference with the surroundings, so a body relaxes as $T = T_\\text{env} + (T_0 - T_\\text{env})e^{-t/\\tau}$.' },
    { term: 'Evaporative cooling', also: ['mass loss'], def: 'The cooling of a liquid by the heat carried off by the molecules that evaporate: 2.3 MJ/kg for water near 90 °C, and increasing with temperature as the vapour pressure rises.' },
    { term: 'Time constant', also: ['tau', 'cooling time'], def: 'The time $\\tau = mc/hA$ in which a body cooling by Newton\'s law closes 63 % of the gap with its surroundings: about 35 minutes for 200 g of water in a still freezer.' }
  ],
  formulas: [
    { name: 'Newton\'s law of cooling', expr: 'T = Tenv + (T0 - Tenv)*exp(-t/tau)', tex: 'T = T_\\mathrm{env} + (T_0 - T_\\mathrm{env})\\,e^{-t/\\tau}',
      vars: { T: { name: 'temperature at time t', q: 'temperature', unit: '°C', signed: true }, Tenv: { name: 'freezer temperature', q: 'temperature', unit: '°C', value: -18, tex: 'T_\\mathrm{env}' }, T0: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 90, tex: 'T_0' }, t: { name: 'time', q: 'time', unit: 'min', value: 30 }, tau: { name: 'time constant', q: 'time', unit: 'min', value: 35, tex: '\\tau', hint: 'About 35 min for 200 g of water in a still freezer.' } },
      solveFor: 'T', note: 'Valid while the sample stays liquid and the loss is proportional to the temperature difference; below 0 °C it does not apply until freezing is over.',
      stories: { T: 'A sample at {T0} is put into a freezer at {Tenv}, with time constant {tau}. What is its temperature after {t}?', t: 'A sample at {T0} cools in a freezer at {Tenv} with time constant {tau}. How long until it reaches {T}?' } },
    { name: 'Heat to take out before it is frozen', expr: 'Q = m*(cw*dT + L)', tex: 'Q = m\\,(c_w\\,\\Delta T + L)',
      vars: { Q: { name: 'heat to remove', q: 'energy', unit: 'kJ' }, m: { name: 'mass of water', q: 'mass', unit: 'kg', value: 0.2 }, cw: { const: 'cW', tex: 'c_w' }, dT: { name: 'cooling to 0 °C', q: 'dtemp', unit: 'K', value: 90, tex: '\\Delta T' }, L: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55 } },
      solveFor: 'Q', note: 'The latent heat dominates: 67 of the 142 kJ for 200 g from 90 °C is the heat of freezing. The hot sample has 48 % more to lose than one starting at 35 °C.',
      stories: { Q: 'A mass of {m} of water at {dT} above freezing is frozen solid. How much heat must be removed?' } },
    { name: 'Heat carried off by evaporation', expr: 'Q = m*Lv', tex: 'Q = m\\,L_v',
      vars: { Q: { name: 'heat removed by evaporation', q: 'energy', unit: 'kJ' }, m: { name: 'mass evaporated', q: 'mass', unit: 'g', value: 5 }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2283, tex: 'L_v', hint: '2,283 kJ/kg at 90 °C; 2,257 at 100 °C; 2,442 at 25 °C.' } },
      solveFor: 'Q', note: 'Even 5 g, 2.5 % of a 200 g sample, takes away 11 kJ: a quarter of the extra heat the hot sample must lose.',
      stories: { Q: 'A mass of {m} evaporates from a hot sample, at latent heat {Lv}. How much heat does it carry away?' } }
  ],
  examples: [
    { title: 'Hot against warm, by Newton alone', q: 'Two 200 g samples, at 90 °C and 35 °C, go into a freezer at −18 °C with a time constant of 35 min. How long does each take to reach 0 °C, and how much heat must each lose to be solid?',
      steps: [{ text: 'Time to reach 0 °C:', tex: 't = \\tau\\ln\\frac{T_0 - T_\\mathrm{env}}{0 - T_\\mathrm{env}} = 35\\ln\\frac{108}{18} = 63\\ \\text{min (hot)},\\qquad 35\\ln\\frac{53}{18} = 38\\ \\text{min (warm)}' }, { text: 'Heat to freeze solid:', tex: 'Q = 0.2\\,(4.186\\,\\Delta T + 333.55) = 142\\ \\text{kJ (hot)},\\quad 96\\ \\text{kJ (warm)}' }, 'The hot sample is 25 minutes behind at 0 °C and has 46 kJ more to lose. Evaporating 5 g removes 11 kJ: it closes a quarter of the heat gap and part of the time lag, and no more.'],
      a: 'The warm sample reaches 0 °C 25 minutes earlier and is solid well ahead (the simulation: about 3 h 12 min against 3 h 37 min). Evaporation helps the hot one but does not reverse the order.' },
    { title: 'When the order can flip', q: 'Both samples supercool before they freeze, the warm one to −8 °C and the hot one only to −2 °C. In the same freezer, which starts freezing first?',
      steps: [{ text: 'Time to reach the nucleation temperature $T_n$:', tex: 't = 35\\ln\\frac{T_0 + 18}{T_n + 18}' }, { text: 'Warm sample:', tex: '35\\ln\\frac{53}{10} = 58\\ \\text{min}' }, { text: 'Hot sample:', tex: '35\\ln\\frac{108}{16} = 67\\ \\text{min}' }, 'The hot sample is still behind, now by 9 minutes. The warm one has to supercool a good deal further for the order to flip: if it waits until −12 °C it starts freezing only at $35\\ln(53/6) = 76$ min, while the hot one, at −2 °C, starts at 67 min.'],
      a: 'With supercoolings of 8 K and 2 K the warm sample starts first, by 9 minutes; with 12 K and 2 K the hot one starts first, by 9 minutes. Chance in nucleation, not the cooling curve, is what could do it.' }
  ],
  quiz: [
    { q: 'Newton\'s law of cooling alone (no evaporation, no supercooling) predicts that of two samples, one hot and one warm, put in a freezer', choices: ['the hot one freezes first', 'the warm one freezes first', 'they freeze together', 'it depends on the volume only'], a: 1, why: 'The hot sample must first cool through the warm sample\'s starting temperature, and heat flow is proportional to the temperature difference, so it is always behind.' },
    { q: 'Which pair of ingredients can plausibly, in the right set-up, let a hot sample win?', choices: ['evaporation and supercooling', 'magnetism and gravity', 'higher density and larger surface tension', 'none of them can'], a: 0, why: 'Evaporation removes mass and heat from the hot sample; supercooling that is smaller in the hot sample means it starts freezing at a warmer temperature. Neither is guaranteed.' },
    { q: 'What did Burridge and Linden\'s 2016 experiments find?', choices: ['A large Mpemba effect in every set-up', 'No reliable Mpemba effect once the measurement was done carefully', 'That heavy water shows it but ordinary water does not', 'That only salt water shows it'], a: 1, why: 'They controlled volumes, containers and thermometer positions and found hot water did not freeze or cool faster; they traced earlier claims to measurement variation, including where the temperature was taken.' },
    { q: 'Whether "hot water freezes first" is judged by the time the first ice appears or by the time the sample is solid through can change which sample wins.', a: true, why: 'The two times depend on different things: the first is controlled by nucleation and the cooling curve, the second by the latent heat removed, so the order may differ.' },
    { q: 'A 200 g hot sample loses 5 g to evaporation. About how much heat does that take away (at 2,283 kJ/kg)?', choices: ['0.1 kJ', '1.1 kJ', '11 kJ', '110 kJ'], a: 2, why: '$Q = 0.005\\times2283 = 11.4$ kJ — about a quarter of the 46 kJ extra heat the hot sample has to lose.' }
  ],
  applications: ['A model for how to argue a scientific claim: define "frozen", control the thermometers, run many trials, and separate chance from effect.', 'Cooling and freezing in the kitchen and the lab: why a covered sample cools slower, and why supercooling makes freezing times scatter.', 'Non-equilibrium physics: the colloidal and spin-system Mpemba effects of 2017–2020 are now studied as a general property of relaxation, whatever the status in water.', 'Teaching: it is an experiment a class can do, if it runs many trials and writes down what it counts as "frozen".'],
  history: 'Aristotle\'s *Meteorologica* (about 350 BC), Bacon\'s *Novum Organum* (1620) and Descartes\' *Les Météores* (1637) all mention that heated water freezes quicker. Mpemba and Osborne\'s "Cool?" appeared in *Physics Education* 4, 172 (1969); Jeng reviewed the effect in 2006; Burridge and Linden\'s "Questioning the Mpemba effect" was published in *Scientific Reports* in 2016, and Kumar and Bechhoefer reported a controlled colloidal Mpemba effect in *Nature* in 2020. In 2012 the Royal Society of Chemistry ran a public competition for an explanation of it.',
  sources: ['Mpemba, E. B. and Osborne, D. G., "Cool?", *Physics Education* 4, 172 (1969).', 'Burridge, H. C. and Linden, P. F., "Questioning the Mpemba effect: hot water does not cool more quickly than cold", *Scientific Reports* 6, 37665 (2016).', 'Katz, J. I., "When hot water freezes before cold", *American Journal of Physics* 77, 27 (2009); Brownridge, J. D., "When does hot water freeze faster than cold water? A search for the Mpemba effect", *American Journal of Physics* 79, 78 (2011).', 'Kumar, A. and Bechhoefer, J., "Exponentially faster cooling in a colloidal system", *Nature* 584, 64 (2020).'],
  sim: 'ice-mpemba'
}

);
