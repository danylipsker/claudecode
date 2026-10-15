/* HYPER-WATER · content/the-water-cycle-and-climate.js — the topic "The water cycle and climate" (branch Heat and Climate).
 *   how-much-water-earth-has  the inventory: 1.386 billion km³, where it sits, and how small the fresh liquid part is
 *   the-water-cycle           the fluxes, the residence times, and the Sun's work of lifting the sea into the sky
 *   humidity-and-dew-point    relative humidity, dew point, absolute humidity, wet bulb, and the 7 % per kelvin
 *   clouds-rain-and-snow      droplets, nuclei, the Kelvin effect, collision and the ice process, snow crystals
 *   water-vapour-greenhouse   the largest greenhouse gas, and why it is a feedback and not a forcing
 *   ocean-currents            gyres, the Gulf Stream, the overturning circulation and its monitoring
 *   sea-ice-and-albedo        the white of ice, the ice–albedo feedback, the Arctic's shrinking summer
 *   the-tides                 the Moon's differential pull, two bulges, spring and neap, resonance and power
 *   rivers-and-groundwater    the Amazon, aquifers, Darcy's law, depletion
 * Simulations: sims/the-water-cycle-and-climate.js (ids cyc-…).
 */
Hyper.add(

/* ================================================================ how much water */
{
  id: 'how-much-water-earth-has', parent: 'the-water-cycle-and-climate', title: 'How much water the Earth has', level: 1,
  short: 'There are 1.386 billion cubic kilometres of water on Earth, almost all of it salt, and almost all the rest frozen. The fresh liquid water that rivers, lakes and wells draw on is a ball about 270 km across: 0.8 % of the total. The oceans, as deep as they seem, are 0.023 % of the planet\'s mass.',
  keywords: ['water on earth', 'how much water', 'oceans', 'fresh water', 'groundwater', 'ice caps', 'USGS', 'Gleick', 'reservoirs', '96.5 percent', 'inventory', 'water budget', 'lakes', 'atmosphere water'],
  prereq: ['water-in-numbers', 'why-ice-floats'],
  related: ['the-water-cycle', 'the-salt-of-the-sea', 'icebergs-and-sea-ice', 'rivers-and-groundwater', 'where-the-oceans-came-from', 'hydraulics:water-resources', 'biology:water-in-life'],
  body: `
Picture the Earth from space: a blue planet, with oceans that look bottomless. Now picture all of its water — the seas, the ice sheets, the lakes, the water under your feet and in the air — gathered into one ball. The ball is **about 1,380 kilometres across**: roughly the distance from London to Rome. Set against the Earth, which is 12,742 km across, it is a pea next to a basketball. That image, first drawn by the US Geological Survey, is the right size for everything that follows.

### The inventory
The standard figures (USGS, after Igor Shiklomanov and Peter Gleick) put the total at **1.386 billion km³**.

| Reservoir | Volume, km³ | Share of all water | Share of fresh water |
|---|---|---|---|
| Oceans | 1,338,000,000 | 96.5 % | — |
| Ice caps, glaciers, ice sheets | 24,064,000 | 1.74 % | 68.7 % |
| Groundwater, fresh | 10,530,000 | 0.76 % | 30.1 % |
| Groundwater, saline | 12,870,000 | 0.93 % | — |
| Permafrost | 300,000 | 0.02 % | 0.9 % |
| Lakes (91,000 fresh, 85,000 saline) | 176,400 | 0.013 % | 0.26 % |
| Soil moisture | 16,500 | 0.001 % | 0.05 % |
| Atmosphere | 12,900 | 0.001 % | 0.04 % |
| Swamps | 11,470 | 0.001 % | 0.03 % |
| Rivers | 2,120 | 0.0002 % | 0.006 % |
| Living things | 1,120 | 0.0001 % | 0.003 % |

Three things stand out. **96.5 % is salt water**. Of the 2.5 % that is fresh, **two-thirds is locked in ice**, mostly Antarctica. And nearly all the rest is underground. The fresh liquid water on the surface — every lake and river together — is 93,000 km³: a ball **56 km across**, 0.007 % of the whole. The water in the air at any moment is 12,900 km³; spread evenly over the planet it would form a layer **2.5 cm deep**.

### How big is "big"
The oceans cover 71 % of the surface to a mean depth of 3.7 km, and their mass is 1.37 × 10²¹ kg — which is **0.023 % of the Earth's mass**. From the centre, the Earth's radius is 6,371 km, of which the water is a skin 3.7 km thick. The top 3.5 m of the sea has the heat capacity of the entire atmosphere above it (see [[specific-heat-of-water]] and [[oceans-as-a-heat-reservoir]]).

### The numbers are estimates
These are best estimates, not measurements. The ice volume is revised as radar maps the Antarctic bed (newer surveys put the Antarctic ice sheet at about 26.5 million km³, more than the USGS total for all ice); groundwater is the least certain, because nobody can see it. The shape of the argument does not change: water is abundant on this planet, but *usable* water is a sliver of a sliver, and almost all of it is on the move. How it moves — in 9 days through the sky, in 3,200 years through the sea — is the subject of [[the-water-cycle]].

> [!key] The Earth holds 1.386 billion km³ of water: 96.5 % in the oceans, 2.5 % fresh, of which two-thirds is ice. The fresh liquid water that lakes, rivers and wells supply is a ball 270 km across, about 0.8 % of the total, on a planet whose oceans are only 0.023 % of its mass.`,
  ideas: ['1.386 billion km³ in all, 96.5 % of it in the oceans; of the 2.5 % that is fresh, 68.7 % is ice, 30.1 % groundwater and 0.3 % surface water.', 'All of it in one ball would be about 1,380 km across — a pea beside the Earth.', 'The rivers hold 2,120 km³ and the air 12,900 km³: the parts that move fastest are the smallest.', 'The oceans, 3.7 km deep on average, make up 0.023 % of the Earth\'s mass; the water is a thin film on the planet.'],
  pitfalls: ['"The Earth is running out of water" — The amount is fixed (a few tens of kilograms a second are lost from the top of the atmosphere; the sea does not get used up). What runs out is fresh water in the right place at the right time.', '"Most fresh water is in rivers and lakes" — Rivers hold 0.006 % of the fresh water; 98.9 % is ice or groundwater.', '"The oceans are deep, so they hold most of the planet\'s water in the way a core holds most of its mass" — They are 0.023 % of the Earth\'s mass: the water is a surface film, a few kilometres on a 6,371 km radius.'],
  terms: [
    { term: 'Hydrosphere', also: ['the planet\'s water'], def: 'All the water of the Earth in every state: oceans, ice, groundwater, surface water, water vapour and the water in living things. About 1.386 billion km³.' },
    { term: 'Fresh water', also: ['freshwater', 'sweet water'], def: 'Water with a salt content below about 1 g/kg (0.1 %). It is 2.5 % of the Earth\'s water, about 35 million km³, and two-thirds of that is frozen.' },
    { term: 'Reservoir', also: ['store', 'stock', 'compartment'], def: 'Any place that holds water for a time: the ocean, an ice sheet, an aquifer, the atmosphere. Its size is a volume in km³; how long a molecule stays is the residence time.' },
    { term: 'Groundwater', also: ['subsurface water'], def: 'Water in the pores and cracks of soil and rock below the water table. 23.4 million km³, of which 10.5 million km³ is fresh: nearly all the liquid fresh water on Earth.' },
    { term: 'Cryosphere', also: ['ice sheets and glaciers'], def: 'The frozen part of the planet: ice sheets, glaciers, permafrost, sea ice and snow. Its ice caps and glaciers hold 24 million km³, 68.7 % of the fresh water.' }
  ],
  formulas: [
    { name: 'The ball a volume of water would make', expr: 'D = cbrt(6*V/pi)', tex: 'D = \\sqrt[3]{\\frac{6V}{\\pi}}',
      vars: { D: { name: 'diameter of the ball', unit: 'km', hint: 'The USGS picture: 1,385 km for all the water, 273 km for the fresh liquid water, 56 km for lakes and rivers.' }, V: { name: 'volume of water', unit: 'km³', value: 1.386e9, min: 1 } },
      solveFor: 'D', note: 'A sphere has V = πD³/6. The volume is a plain number in km³ because km³ is not a unit in the calculator.',
      stories: { D: 'A reservoir holds {V}. How wide is a ball with that volume?', V: 'A ball of water is {D} across. What is its volume?' } },
    { name: 'Depth if the water covered the planet evenly', expr: 'd = V/(4*pi*R^2)', tex: 'd = \\frac{V}{4\\pi R^2}',
      vars: { d: { name: 'depth of the layer', unit: 'km', hint: '2.7 km for all the water, 2.6 km for the oceans alone, 2.5 cm for the atmosphere\'s.' }, V: { name: 'volume of water', unit: 'km³', value: 1.386e9, min: 0 }, R: { name: 'radius of the Earth', unit: 'km', value: 6371, fixed: true } },
      solveFor: 'd', note: 'Treats the Earth as a sphere with no land standing out; the whole surface (510 million km²) is covered.',
      stories: { d: 'The atmosphere holds {V}. If it all fell as rain at once, how deep would the layer be?' } },
    { name: 'The oceans\' share of the planet\'s mass', expr: 'f = Mo/Me', tex: 'f = \\frac{M_o}{M_E}',
      vars: { f: { name: 'ocean mass as a share of the Earth\'s', q: 'ratio', unit: '%' }, Mo: { name: 'mass of the oceans', q: 'mass', unit: 'kg', value: 1.37e21, tex: 'M_o' }, Me: { const: 'Mearth', tex: 'M_E' } },
      solveFor: 'f', note: 'The oceans\' mass is their volume (1.338 × 10²¹ L) times 1,025 kg/m³.',
      stories: { f: 'The oceans have a mass of {Mo}. What fraction of the Earth\'s mass is that?' } }
  ],
  examples: [
    { title: 'The ball of fresh liquid water', q: 'Fresh liquid water — fresh groundwater, lakes, soil moisture, swamps and rivers — comes to about 10.6 million km³. How wide a ball is that, and how does it compare with the Earth?',
      steps: [{ text: 'Use $V = \\pi D^3 / 6$ and solve for $D$:', tex: 'D = \\sqrt[3]{\\frac{6 \\times 1.06\\times10^7}{\\pi}} = \\sqrt[3]{2.02\\times10^7}\\ \\mathrm{km}' }, 'The cube root of $2.02 \\times 10^7$ is about 272.', 'The Earth is 12,742 km across, so the ball is 2.1 % of its diameter.'],
      a: 'About 272 km across: the distance from Paris to Brussels. Every well, lake and river on the planet draws on it.' },
    { title: 'The planet\'s rain', q: 'If all the water in the atmosphere (12,900 km³) fell at once, how deep would the layer be? The Earth\'s surface is 510 million km².',
      steps: ['Depth = volume ÷ area = $12{,}900 / 5.1\\times10^8\\ \\mathrm{km} = 2.5\\times10^{-5}$ km.', 'That is 2.5 cm, a bit under an inch.', 'Yet the planet\'s mean annual rainfall is about 950 mm: the atmosphere\'s water is renewed some 38 times a year — the subject of [[the-water-cycle]].'],
      a: 'A layer 2.5 cm deep. A small store with a large flow through it.' }
  ],
  quiz: [
    { q: 'What fraction of the Earth\'s water is fresh?', choices: ['About 25 %', 'About 10 %', 'About 2.5 %', 'About 0.01 %'], a: 2, why: '97.5 % is salt water. Of the 2.5 % that is fresh, about two-thirds is in ice caps and glaciers and nearly all the rest is groundwater.' },
    { q: 'Most of the liquid fresh water on Earth is in rivers and lakes.', a: false, why: 'Fresh groundwater (10.5 million km³) is more than a hundred times the fresh water in lakes (91,000) and rivers (2,120) combined.' },
    { q: 'The oceans make up what share of the Earth\'s mass?', choices: ['About 23 %', 'About 2.3 %', 'About 0.23 %', 'About 0.023 %'], a: 3, why: 'The oceans\' 1.37 × 10²¹ kg against the Earth\'s 5.97 × 10²⁴ kg: 0.023 %. The planet is overwhelmingly rock and iron.' },
    { q: 'Which reservoir holds the most fresh water?', choices: ['Lakes', 'Rivers', 'Ice caps and glaciers', 'The atmosphere'], a: 2, why: '68.7 % of the fresh water is ice; groundwater is next with 30.1 %.' },
    { q: 'If the volume of water on Earth were spread as a layer over the whole planet, how deep (in km) would it be? (Use 1.386 × 10⁹ km³ and 5.1 × 10⁸ km².)', answer: 2.7, unit: 'km', why: '1.386 × 10⁹ ÷ 5.1 × 10⁸ = 2.7 km — thinner than the sea is deep (3.7 km), because the continents stand out of it.' }
  ],
  applications: ['Water-resource planning: a country\'s "renewable" water is the flow through its rivers and aquifers, not the stock in its ice.', 'Sea-level science: the Antarctic and Greenland ice sheets hold the equivalent of about 58 m and 7 m of sea level, which is why their small losses matter.', 'Astrobiology: comparing the Earth\'s ocean with the buried oceans of Europa and Enceladus uses exactly this kind of inventory ([[europa]]).', 'Desalination and reuse: the 97.5 % of salt water is the reserve behind [[desalination]].'],
  history: 'Early estimates by Nace (1967) and Lvovitch (1970) were refined by Igor Shiklomanov at the State Hydrological Institute in Leningrad, whose 1993 compilation is the base of most tables; Peter Gleick (1996) put them in the form the USGS uses. The pea-and-basketball picture of the planet\'s water was drawn by Howard Perlman and Jack Cook for the USGS.',
  sources: ['USGS Water Science School, "How much water is there on Earth?" and "The distribution of water on, in and above the Earth" — the inventory table and the spheres.', 'Gleick, P. H., "Water resources", in S. H. Schneider (ed.), *Encyclopedia of Climate and Weather* (Oxford University Press, 1996) — the volumes quoted here.', 'Shiklomanov, I. A., "World fresh water resources", in P. H. Gleick (ed.), *Water in Crisis* (Oxford University Press, 1993).'],
  sim: { id: 'cyc-reservoirs', params: { mode: 'stores' } }
},

/* ================================================================ the cycle */
{
  id: 'the-water-cycle', parent: 'the-water-cycle-and-climate', title: 'The water cycle', level: 1,
  short: 'Each year the Sun lifts 486,000 km³ of water from sea and land into the air; the same amount falls back. A molecule waits 9 days in the sky, about 3,200 years in the sea and many thousand years in an ice cap. The cycle uses a third of the sunlight the Earth absorbs.',
  keywords: ['water cycle', 'hydrological cycle', 'evaporation', 'precipitation', 'runoff', 'transpiration', 'residence time', 'turnover', 'flux', 'km3 per year', 'latent heat flux', 'evapotranspiration'],
  prereq: ['how-much-water-earth-has', 'latent-heat-of-vaporisation', 'vapour-pressure-and-evaporation'],
  related: ['humidity-and-dew-point', 'clouds-rain-and-snow', 'rivers-and-groundwater', 'ocean-currents', 'hurricanes-and-latent-heat', 'evaporative-cooling', 'physics:latent-heat', 'aerodynamics:humidity-air', 'hydraulics:water-resources', 'biology:transpiration'],
  body: `
The inventory of [[how-much-water-earth-has]] is a still photograph. The reality is a film in which almost every drop is on its way somewhere. Sunlight warms the sea; molecules at the surface leave as vapour; the vapour rises, cools, condenses into cloud and falls as rain or snow; on land it soaks in, runs off, is drunk by roots and breathed out by leaves, or is held as ice; and rivers, glaciers and slow groundwater carry it back to the sea. Round and round, powered by the Sun.

### The fluxes
The numbers are well known to about 10 %. Each year (km³, USGS, Trenberth and colleagues):

| Flux | km³ per year |
|---|---|
| Evaporation from the oceans | 413,000 |
| Evaporation and transpiration from land | 73,000 |
| **Total into the air** | **486,000** |
| Precipitation on the oceans | 373,000 |
| Precipitation on land | 113,000 |
| Runoff (land to sea, the difference) | 40,000 |

More water evaporates from the sea than falls on it; the difference, 40,000 km³, is carried over the land as vapour and returns to the sea as river flow. That is why a land receiving 113,000 km³ of rain loses only 73,000 to the air: the Amazon, the Yangtze, the Ganges, and every other river, together run at about 40,000 km³ a year — 1.3 million m³ every second.

### How long a molecule stays
The **residence time** of a reservoir is its volume divided by the flow through it. The air holds 12,900 km³ and 486,000 km³ passes through each year: 12,900 ÷ 486,000 = 0.027 years — **about 9 days**. The ocean, with 1.338 billion km³ and 413,000 km³ a year of evaporation, turns over in about **3,200 years**. Rivers take weeks; lakes 17 years on average; groundwater 1,400 years on average (days in a spring-fed shallow aquifer, hundreds of thousands of years in the deep ones); the ice caps 10,000 years or more. Span the whole range and it is a factor of a billion, from a fraction of a day in the clouds to 100,000 years in the oldest Antarctic ice — the tail of water's long memory.

### The engine behind it
Evaporating a kilogram of water takes 2.45 MJ (see [[latent-heat-of-vaporisation]]). Lifting 486,000 km³ — 4.9 × 10¹⁷ kg — takes **1.2 × 10²⁴ joules a year**, a power of 38 petawatts: about 74 W for every square metre of the Earth, near a third of the 240 W/m² the planet absorbs from the Sun (modern budgets put the figure near 80 W/m²). That heat is not lost: it is released again when the vapour condenses, often thousands of kilometres away and high in the air. The water cycle is therefore also a **heat pipe**, carrying energy from the oceans of the tropics into the sky above them and, by the winds, towards the poles. Hurricanes ([[hurricanes-and-latent-heat]]) are that engine at full power.

### A warmer planet
Warm air holds more vapour (about 7 % more per degree, see [[humidity-and-dew-point]]), but global precipitation is limited by the energy available to evaporate the water, so it rises more slowly, by roughly 2 % per degree. The air therefore holds more water, and each molecule waits a little longer. Rain falls in heavier bursts with longer dry gaps between them: the first measurable change in the cycle.

> [!key] Each year 486,000 km³ of water goes up and 486,000 km³ comes down; the difference between sea and land is the 40,000 km³ the rivers carry home. The cycle runs on a third of the absorbed sunlight, and the residence times it implies run from 9 days in the air to 3,200 years in the sea.`,
  ideas: ['Evaporation 413,000 km³/yr from the oceans and 73,000 from land; precipitation 373,000 on the sea and 113,000 on land; runoff 40,000.', 'Residence time = volume ÷ flow: about 9 days in the air, 3,200 years in the ocean, more than 10,000 years in the ice caps.', 'The Sun supplies 1.2 × 10²⁴ J a year to evaporate the water, about a third of the sunlight absorbed; condensation gives it back as heat in the air.', 'Warming raises the vapour in the air by about 7 % per kelvin but precipitation only by about 2 %: wetter air, longer in the sky.'],
  pitfalls: ['"Rain comes from the water that evaporated nearby" — Not necessarily: the average vapour molecule travels 1,000 km or more before it falls, and over a continent half the rain may come from the sea.', '"The water in a river is the water that fell on the basin that year" — Much of it is groundwater released over years to decades; the flow in a dry season is mostly old water.', '"Water vapour is the water in clouds" — Vapour is invisible gas; a cloud is liquid droplets and ice crystals that formed from it.'],
  terms: [
    { term: 'Hydrological cycle', also: ['water cycle', 'hydrologic cycle'], def: 'The continuous movement of water between the oceans, the atmosphere, the land surface, groundwater and ice, driven by the Sun and gravity. The same water is used over and over.' },
    { term: 'Evapotranspiration', also: ['ET'], def: 'The water that goes from the land to the air by evaporation from soil and water surfaces plus transpiration through the leaves of plants. About 73,000 km³ a year over land.' },
    { term: 'Residence time', also: ['turnover time', 'mean age', 'turnover'], def: 'The average time a water molecule stays in a reservoir at steady state: the volume of the reservoir divided by the flow into (or out of) it. 9 days for the atmosphere, 3,200 years for the ocean.' },
    { term: 'Runoff', also: ['river discharge'], def: 'The water that flows from land to the sea in rivers and as groundwater: about 40,000 km³ a year, equal to the precipitation on land minus the evapotranspiration.' },
    { term: 'Latent heat flux', also: ['evaporative heat flux'], def: 'The energy carried from the surface to the atmosphere by evaporating water: about 80 W/m² as a global average, a third of the sunlight the Earth absorbs.' }
  ],
  formulas: [
    { name: 'Residence time', expr: 'tau = V/Q', tex: '\\tau = \\frac{V}{Q}',
      vars: { tau: { name: 'residence time', unit: 'years', hint: 'About 0.027 years (9–10 days) for the air, 3,200 for the ocean.' }, V: { name: 'volume of the reservoir', unit: 'km³', value: 12900, min: 0 }, Q: { name: 'flow through it', unit: 'km³/yr', value: 486000, min: 0 } },
      solveFor: 'tau', note: 'Valid at steady state, when as much goes in as comes out. A "mean age" is the same number.',
      stories: { tau: 'A reservoir holds {V} and {Q} flow through it each year. How long, on average, does a molecule stay?', Q: 'A reservoir of {V} turns over every {tau} years. What is the flow through it?' } },
    { name: 'Energy to evaporate a volume of water', expr: 'E = m*L', tex: 'E = m\\,L',
      vars: { E: { name: 'energy', q: 'energy', unit: 'J' }, m: { name: 'mass evaporated', q: 'mass', unit: 'kg', value: 4.86e17, hint: '1 km³ of water is 10¹² kg. The 486,000 km³ of a year is 4.86 × 10¹⁷ kg.' }, L: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2465, hint: '2,501 kJ/kg at 0 °C, 2,465 at 15 °C, 2,442 at 25 °C, 2,257 at 100 °C.' } },
      solveFor: 'E', note: 'At the sea\'s mean temperature of about 15 °C. The sunlight absorbed by the Earth in a year is about 3.9 × 10²⁴ J.',
      stories: { E: 'Evaporating {m} of water takes how much energy, at {L}?' } },
    { name: 'Rainfall as a depth', expr: 'P = 1000000*Q/A', tex: 'P = \\frac{Q}{A}',
      vars: { P: { name: 'depth of water', unit: 'mm/yr', hint: '953 mm/yr averaged over the planet; about 760 mm/yr over land.' }, Q: { name: 'volume per year', unit: 'km³/yr', value: 486000, min: 0 }, A: { name: 'area', unit: 'km²', value: 5.1e8, min: 1, hint: 'The whole Earth, 5.1 × 10⁸ km²; its land 1.49 × 10⁸; its oceans 3.61 × 10⁸.' } },
      solveFor: 'P', note: 'One km³ spread over one km² is 1 km deep, 10⁶ mm: hence the factor.',
      stories: { P: 'A flow of {Q} falls on {A}. What is the mean depth, per year?' } }
  ],
  examples: [
    { title: 'How long does a molecule stay in the sea?', q: 'The oceans hold 1.338 billion km³ and 413,000 km³ evaporates from them each year. What is the residence time of ocean water against evaporation?',
      steps: [{ text: 'Divide the volume by the flow:', tex: '\\tau = \\frac{1.338\\times10^{9}}{4.13\\times10^{5}} = 3.2\\times10^{3}\\ \\text{years}' }, 'Water leaves the sea by evaporation and returns by rain and rivers, so this is also the time for the ocean to be "turned over" through the air.'],
      a: 'About 3,200 years, the mean time between a molecule\'s visits to the sky. The oldest deep water has not seen the surface for more than 1,000 years; salt, which cannot evaporate, stays millions of years.' },
    { title: 'The energy bill of the cycle', q: 'How much energy does the Sun spend each year evaporating 486,000 km³, and what is that per square metre of the Earth?',
      steps: ['Mass: $4.86\\times10^5\\ \\mathrm{km^3} \\times 10^{12}\\ \\mathrm{kg/km^3} = 4.86\\times10^{17}$ kg.', { text: 'Energy at 2.465 MJ/kg:', tex: 'E = 4.86\\times10^{17} \\times 2.465\\times10^{6} = 1.2\\times10^{24}\\ \\mathrm{J}' }, 'Per second: $1.2\\times10^{24} / 3.156\\times10^{7} = 3.8\\times10^{16}$ W; per m² over $5.1\\times10^{14}$ m²: 74 W/m².', 'The Earth absorbs about 240 W/m² on average.'],
      a: '1.2 × 10²⁴ J a year, 74 W/m²: about 31 % of the absorbed sunlight (modern estimates near 80 W/m² and 33 %).' }
  ],
  quiz: [
    { q: 'About how long does a water molecule stay in the atmosphere?', choices: ['9 hours', '9 days', '9 months', '9 years'], a: 1, why: '12,900 km³ in the air and 486,000 km³ a year through it gives 0.027 years. The air is renewed some 38 times a year.' },
    { q: 'More water evaporates from the oceans than falls on them. Where does the difference go?', choices: ['It stays as vapour in the air', 'It falls on land and returns to the sea as runoff', 'It escapes to space', 'It is stored in clouds for years'], a: 1, why: '413,000 − 373,000 = 40,000 km³ a year is carried over land as vapour, falls there, and returns to the sea in rivers — equal to the runoff.' },
    { q: 'The ice caps\' residence time is longer than the ocean\'s because ice caps are bigger.', a: false, why: 'The ocean is 55 times larger. Residence time is volume divided by flow, and the ice caps\' outflow (melting and calving) is tiny: about 10,000 years, against 3,200 for the sea.' },
    { q: 'Condensation releases the heat taken up in evaporation. Where does most of it end up?', choices: ['In the sea, where the water came from', 'In the atmosphere, where the cloud forms', 'On the ground, with the rain', 'In space'], a: 1, why: 'The latent heat is released where the vapour condenses, in the troposphere, often far from where it evaporated. This is a central way heat is moved from the tropical ocean into the atmosphere.' },
    { q: 'The mean precipitation of the planet is 486,000 km³ a year over 5.1 × 10⁸ km². How many millimetres is that? (Round to the nearest 10.)', answer: 950, unit: 'mm', why: '486,000 ÷ 5.1 × 10⁸ = 9.5 × 10⁻⁴ km = 0.95 m = 953 mm a year.' }
  ],
  applications: ['Water resources: the "renewable" water of a country is the runoff and recharge, a flux in km³ a year, not the stock in its lakes.', 'Weather and climate models: the model\'s evaporation and precipitation must close the budget, within a few percent.', 'Tracing pollution and age: the long residence times of the deep ocean and aquifers are why pollutants and fossil water last for centuries.', 'Isotope hydrology: heavier water evaporates less easily, so rain and ice remember the temperature at which they formed (see [[the-deuterium-clock]] for the same trick in space).'],
  history: 'The cycle was sketched in antiquity, but evaporation was thought too small to supply the rivers until Pierre Perrault (1674) and Edme Mariotte measured the Seine\'s rain and flow in France and showed that rainfall alone could feed it; Edmond Halley (1687) measured evaporation from a pan of heated water and estimated the Mediterranean\'s. The global budget in km³ a year was assembled by Soviet hydrologists in the 1960s–70s.',
  sources: ['USGS Water Science School, "The water cycle" and "Water cycle and residence times" — the fluxes and times.', 'Trenberth, K. E., Smith, L., Qian, T., Dai, A. and Fasullo, J., "Estimates of the global water budget and its annual cycle using observational and model data", *Journal of Hydrometeorology* 8, 758 (2007).', 'IPCC AR6 Working Group I, chapter 8 (Water cycle changes) — the sensitivity of precipitation to warming.'],
  sim: { id: 'cyc-reservoirs', params: { mode: 'flows' } }
},

/* ================================================================ humidity */
{
  id: 'humidity-and-dew-point', parent: 'the-water-cycle-and-climate', title: 'Humidity and dew point', level: 1,
  short: 'Air can hold only so much water vapour, and warm air holds much more: 23 g in each cubic metre at 25 °C, 5 g at 0 °C. Relative humidity is how full the air is; the dew point is the temperature at which it would be full; and a rise of 1 K in temperature lets it hold about 7 % more.',
  keywords: ['humidity', 'relative humidity', 'dew point', 'absolute humidity', 'saturation vapour pressure', 'mixing ratio', 'wet bulb', 'Clausius-Clapeyron', 'condensation', 'bathroom mirror', 'fog', 'psychrometric', 'dew', 'frost'],
  prereq: ['vapour-pressure-and-evaporation', 'the-water-cycle'],
  related: ['clouds-rain-and-snow', 'water-vapour-greenhouse', 'evaporative-cooling', 'the-body-at-37-degrees', 'hurricanes-and-latent-heat', 'aerodynamics:humidity-air', 'pneumatics:humidity-dew-point', 'chemistry:clausius-clapeyron', 'physics:latent-heat'],
  body: `
Why does a cold glass of water "sweat" on a summer day? Why does the bathroom mirror fog and the car windscreen mist? Why does the house feel dry in winter and a sauna fog up in an instant? The answers are the same: the air holds water vapour, the amount it can hold depends steeply on its temperature, and when air meets a surface colder than a certain temperature — the **dew point** — the surplus condenses.

### How full is the air?
Air always contains some water vapour, a few percent of the molecules in a warm, damp place and almost none in a cold desert. The vapour has a **partial pressure**, $e$, part of the total pressure. The most it can have at a given temperature is the **saturation vapour pressure** $e_s(T)$, the vapour pressure of liquid water (see [[vapour-pressure-and-evaporation]]): 0.61 kPa at 0 °C, 1.23 kPa at 10 °C, 2.34 kPa at 20 °C, 3.17 kPa at 25 °C, 7.39 kPa at 40 °C. **Relative humidity** is the ratio:

$$\\mathrm{RH} = \\frac{e}{e_s(T)}$$

At RH = 100 % the air is saturated: evaporation and condensation balance. Notice what relative humidity is *not*: it is not the amount of water in the air. Air at 10 °C and 100 % has less water than air at 30 °C and 40 %.

### The dew point
Cool a parcel of air without removing water and $e$ stays the same while $e_s$ falls. At some temperature $e_s$ comes down to $e$: that is the **dew point** $T_d$, where the relative humidity reaches 100 %. Cool further and the surplus condenses — dew on grass, mist on glass, fog in the valley, cloud in the sky. At 22 °C and 50 % the dew point is 11.1 °C: a glass colder than that gets wet. In a shower the air is near 40 °C and 90 % (dew point 38 °C) and any surface colder than 38 °C — a mirror — fogs. A useful rule: for RH above about 50 %, the dew point is lower than the temperature by roughly $(100 - \\mathrm{RH})/5$ degrees.

### Absolute humidity and the 7 % rule
The mass of water in a cubic metre of air is the **absolute humidity**: 4.8 g/m³ for saturated air at 0 °C, 9.4 at 10 °C, 17.3 at 20 °C, **23.0 at 25 °C**, 30.4 at 30 °C, 51 at 40 °C. The ratio between 25 °C and 15 °C is about 1.8, between 35 °C and 25 °C about 1.7. Each kelvin multiplies the capacity by 1.06–1.07: the **Clausius–Clapeyron rule**, a direct consequence of the large latent heat of vaporisation ([[latent-heat-of-vaporisation]]):

$$\\frac{1}{e_s}\\frac{\\mathrm{d}e_s}{\\mathrm{d}T} = \\frac{L\\,M}{R\\,T^2} \\approx 0.06 \\text{ to } 0.07\\ \\mathrm{K^{-1}}$$

That is why winter air is dry indoors: air at −5 °C and 80 % holds 2.7 g/m³; warmed to 21 °C it is still 2.7 g/m³ but the relative humidity has fallen to **14 %**. And it is why a warming planet holds more water vapour ([[water-vapour-greenhouse]]).

### Wet bulb
Wrap a wet cloth around a thermometer and blow air across it: water evaporates, the bulb cools, and the reading settles at the **wet-bulb temperature**, below the air temperature by an amount that tells how dry the air is. At 22 °C and 50 % it is 15.4 °C. In saturated air the wet and dry readings agree. Wet-bulb temperature sets the limit of cooling by evaporation — of a cooling tower, a swamp cooler or a sweating body ([[evaporative-cooling]]): a healthy person at rest cannot lose heat by sweating when the wet bulb exceeds about 35 °C.

> [!key] Relative humidity is the vapour pressure divided by the saturation pressure at the air's temperature; the dew point is the temperature at which that ratio would reach 100 %. Warm air holds about 7 % more water per kelvin, so the same water gives low relative humidity in a heated room and fog on a cold window.`,
  ideas: ['Relative humidity = e ÷ e_s(T): how full the air is, not how much water it holds.', 'The dew point is the temperature to which air must cool, at constant water content, to be saturated; any surface colder than it gets wet.', 'Saturated air holds 4.8 g/m³ at 0 °C and 23 g/m³ at 25 °C: roughly 7 % more for each kelvin (Clausius–Clapeyron).', 'The wet-bulb temperature, what a wet thermometer reads, is lower than the air temperature by an amount that measures dryness.'],
  pitfalls: ['"100 % humidity means the air is all water" — It means saturated: at 25 °C that is 23 g of vapour in 1,200 g of air, about 2 %.', '"Cold air can\'t hold water vapour, so winter air is dry" — It can hold some, and the outdoor relative humidity is often 80–90 %; it is the heated indoor air that is dry in the sense of low RH.', '"The air is full of water when it fogs" — Fog is liquid droplets; the air has crossed its saturation point and the surplus has condensed.'],
  terms: [
    { term: 'Relative humidity', also: ['RH', 'φ'], def: 'The ratio of the water-vapour pressure in the air to the saturation vapour pressure at the air\'s temperature, as a percentage. 100 % means saturated.' },
    { term: 'Dew point', also: ['dew-point temperature', 'T_d'], def: 'The temperature to which air must be cooled, at constant pressure and water content, for its relative humidity to reach 100 %. Below it dew, fog or frost forms.' },
    { term: 'Absolute humidity', also: ['vapour density', 'water-vapour density'], def: 'The mass of water vapour per cubic metre of air: 23 g/m³ for saturated air at 25 °C, 4.8 g/m³ at 0 °C.' },
    { term: 'Mixing ratio', also: ['humidity ratio', 'specific humidity (nearly)'], def: 'The mass of water vapour per kilogram of dry air, about 0.622 e/(p − e). A parcel of rising air keeps its mixing ratio until it condenses.' },
    { term: 'Wet-bulb temperature', also: ['T_w', 'psychrometer reading'], def: 'The lowest temperature reached by evaporating water into the air at constant pressure, read on a wet thermometer. Equal to the air temperature when RH is 100 %.' },
    { term: 'Saturation vapour pressure', also: ['equilibrium vapour pressure', 'e_s'], def: 'The partial pressure of water vapour in equilibrium with liquid (or ice) at a given temperature; 3.17 kPa at 25 °C. It rises about 7 % per kelvin.' }
  ],
  formulas: [
    { name: 'Relative humidity', expr: 'RH = ev/es', tex: '\\mathrm{RH} = \\frac{e}{e_s}',
      vars: { RH: { name: 'relative humidity', q: 'ratio', unit: '%', tex: '\\mathrm{RH}' }, ev: { name: 'vapour pressure in the air', q: 'pressure', unit: 'kPa', value: 1.58, tex: 'e', hint: 'The partial pressure of the water vapour, part of the 101.3 kPa of the air.' }, es: { name: 'saturation vapour pressure', q: 'pressure', unit: 'kPa', value: 3.17, tex: 'e_s', hint: '3.17 kPa at 25 °C; 2.34 at 20 °C; 1.23 at 10 °C.' } },
      solveFor: 'RH', note: 'Temperature enters through e_s only. At the dew point, e = e_s(T_d).',
      stories: { RH: 'The water-vapour pressure is {ev} and saturation at the air\'s temperature is {es}. What is the relative humidity?', ev: 'Air at {es} saturation has a relative humidity of {RH}. What is its vapour pressure?' } },
    { name: 'Absolute humidity from the vapour pressure', expr: 'rhov = ev*M/(R*T)', tex: '\\rho_v = \\frac{e\\,M}{R\\,T}',
      vars: { rhov: { name: 'water in each cubic metre', q: 'density', unit: 'kg/m³', tex: '\\rho_v', hint: '0.023 kg/m³ is 23 g/m³: the saturated value at 25 °C.' }, ev: { name: 'vapour pressure', q: 'pressure', unit: 'kPa', value: 3.17, tex: 'e' }, M: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, fixed: true }, R: { const: 'R' }, T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 25 } },
      solveFor: 'rhov', note: 'The ideal-gas law applied to the vapour alone.',
      stories: { rhov: 'The vapour pressure is {ev} at {T}. How much water is there in each cubic metre?' } },
    { name: 'Dew point, approximately', expr: 'Td = T - (100 - RHp)/5', tex: 'T_d \\approx T - \\frac{100-\\mathrm{RH}}{5}',
      vars: { Td: { name: 'dew point', q: 'temperature', unit: '°C', tex: 'T_d' }, T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 25 }, RHp: { name: 'relative humidity (%)', value: 60, min: 50, max: 100, tex: '\\mathrm{RH}', hint: 'Good to about 1 K for humidities above 50 %.' } },
      solveFor: 'Td', note: 'A rule of thumb of the weather forecasters, from the Magnus formula. At 25 °C and 60 % the rule gives 17 °C; the exact value is 16.7 °C.',
      stories: { Td: 'The air is at {T} with a relative humidity of {RHp} per cent. What is the dew point?' } },
    { name: 'How the capacity of air grows with temperature', expr: 'e2 = e1*exp(Lm/R*(1/T1 - 1/T2))', tex: 'e_2 = e_1\\exp\\left[\\frac{L_m}{R}\\left(\\frac{1}{T_1}-\\frac{1}{T_2}\\right)\\right]',
      vars: { e2: { name: 'saturation pressure at T₂', q: 'pressure', unit: 'kPa', tex: 'e_2' }, e1: { name: 'saturation pressure at T₁', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'e_1' }, Lm: { name: 'molar heat of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 44.0, tex: 'L_m', hint: '44.0 kJ/mol at 25 °C, 40.7 at 100 °C, 45.0 at 0 °C. Taken as constant over a few kelvin.' }, R: { const: 'R' }, T1: { name: 'first temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' }, T2: { name: 'second temperature', q: 'temperature', unit: '°C', value: 30, tex: 'T_2' } },
      solveFor: 'e2', note: 'The integrated Clausius–Clapeyron equation. Over 10 K near room temperature the capacity grows by a factor of about 1.8.',
      stories: { e2: 'Saturated air at {T1} has a vapour pressure of {e1}. What is it at {T2}?' } }
  ],
  examples: [
    { title: 'Why the bathroom mirror fogs', q: 'Shower air is at 40 °C and 90 % relative humidity. The mirror is at 25 °C. Will it fog, and how much water leaves each cubic metre of air that cools to the mirror\'s temperature?',
      steps: ['Saturation at 40 °C is 7.39 kPa, so $e = 0.90 \\times 7.39 = 6.65$ kPa. The dew point is the temperature where $e_s = 6.65$ kPa: 38.0 °C.', 'The mirror at 25 °C is 13 K colder than the dew point, so water condenses on it.', 'Air at 40 °C and 90 % holds 46.0 g/m³; saturated air at 25 °C holds 23.0 g/m³. The difference, 23 g, condenses out of each cubic metre that reaches the mirror\'s temperature.'],
      a: 'Yes; the dew point is 38 °C. Each cubic metre of shower air that cools to 25 °C leaves 23 g of water behind: half its vapour.' },
    { title: 'A dry winter house', q: 'Outdoors it is −5 °C and 80 % relative humidity. The air is brought in and heated to 21 °C without adding water. What is the relative humidity indoors?',
      steps: ['Saturation at −5 °C (over liquid water) is 0.42 kPa, so $e = 0.80 \\times 0.42 = 0.34$ kPa.', 'Saturation at 21 °C is 2.49 kPa.', { text: 'Relative humidity indoors:', tex: '\\mathrm{RH} = \\frac{0.34}{2.49} = 13.6\\ \\%' }, 'Comfort lies at 30–50 %: the occupants must humidify the air, with a kettle, plants or a humidifier, and the room needs about 6.5 g/m³ more water to reach 50 %.'],
      a: 'About 14 %. The vapour content has not changed (2.7 g/m³), but the air\'s capacity is almost five times larger.' }
  ],
  quiz: [
    { q: 'The air temperature is 30 °C and the dew point is 30 °C. The relative humidity is', choices: ['0 %', '50 %', '100 %', 'impossible to tell'], a: 2, why: 'By definition, relative humidity is 100 % when the air temperature equals the dew point: the air is saturated.' },
    { q: 'Air at 20 °C and 50 % relative humidity is heated to 30 °C with no water added. The relative humidity', choices: ['rises', 'falls', 'stays at 50 %', 'rises then falls'], a: 1, why: 'The vapour pressure is unchanged but the saturation pressure rises from 2.34 to 4.25 kPa: the humidity falls to about 28 %.' },
    { q: 'Saturated air at 0 °C holds about 5 g of water per m³; at 25 °C, it holds', choices: ['6 g', '11 g', '23 g', '120 g'], a: 2, why: 'The saturated absolute humidity rises 6–7 % per kelvin; compounded over 25 K that multiplies it by about 4.8, and 4.8 g/m³ × 4.8 ≈ 23 g/m³.' },
    { q: 'A cold drink in a glass at 12 °C "sweats" in a room at 25 °C if the relative humidity is above about', choices: ['20 %', '45 %', '75 %', '100 %'], a: 1, why: 'The glass sweats when its temperature is below the dew point. Saturation at 12 °C is 1.40 kPa, at 25 °C 3.17 kPa: 1.40/3.17 = 44 %.' },
    { q: 'The wet-bulb temperature is always lower than or equal to the air temperature.', a: true, why: 'Evaporation cools the wet bulb; it can only stop (at 100 % RH) when the air is saturated. In dry air the difference is large, as in desert coolers.' }
  ],
  applications: ['Weather forecasting: the gap between temperature and dew point predicts fog, frost and the base of the clouds (about 125 m of cloud base per kelvin of the gap).', 'Buildings and museums: condensation on cold bridges causes mould; the air must stay below the dew point of the coldest wall.', 'Compressed-air systems: air cooled in a compressor drops its vapour as water, and the dew point of the air at the point of use decides whether pipes corrode ([[pneumatics:humidity-dew-point|compressed-air dew point]]).', 'Heat stress and sport: the wet-bulb temperature limits the body\'s ability to cool, and is the basis of safety indices for outdoor work.'],
  history: 'Horace-Bénédict de Saussure built the hair hygrometer in 1783; John Dalton showed in 1801 that each gas in a mixture contributes its own partial pressure, so that the water vapour in the air obeys its own curve. The wet-and-dry-bulb psychrometer was developed in the 1800s; Willis Carrier\'s 1911 paper on the rational psychrometric formulae is the basis of air-conditioning design.',
  sources: ['IAPWS, vapour-pressure formulation, as used for the saturation values here; and Murphy and Koop, "Review of the vapour pressures of ice and supercooled water for atmospheric applications", *Quarterly Journal of the Royal Meteorological Society* 131, 1539 (2005).', 'Stull, R., "Wet-bulb temperature from relative humidity and air temperature", *Journal of Applied Meteorology and Climatology* 50, 2267 (2011).', 'Wallace and Hobbs, *Atmospheric Science: An Introductory Survey*, chapter 3.', 'IPCC AR6 Working Group I, chapter 8 — the Clausius–Clapeyron scaling of atmospheric water vapour.'],
  sim: 'cyc-psychrometer'
},

/* ================================================================ clouds, rain and snow */
{
  id: 'clouds-rain-and-snow', parent: 'the-water-cycle-and-climate', title: 'Clouds, rain and snow', level: 2,
  short: 'A cloud droplet is about 10 micrometres across; a raindrop about a millimetre, a million droplets in one. Condensation alone would need days to make the difference, so clouds use two shortcuts: big droplets that fall through small ones, and ice crystals that grow at the droplets\' expense. Either way the droplets start on a speck of dust or salt.',
  keywords: ['cloud', 'droplet', 'raindrop', 'condensation nuclei', 'CCN', 'Kelvin effect', 'Köhler curve', 'coalescence', 'Bergeron process', 'ice nuclei', 'snowflake', 'supercooled', 'terminal velocity', 'Stokes', 'fog', 'supersaturation', 'cloud seeding'],
  prereq: ['humidity-and-dew-point', 'surface-tension', 'supercooling-and-nucleation'],
  related: ['the-water-cycle', 'snowflakes', 'drops-and-bubbles', 'viscosity-of-water', 'water-vapour-greenhouse', 'why-ice-floats', 'physics:surface-tension', 'aerodynamics:humidity-air'],
  body: `
Look at a cumulus cloud on a summer afternoon: a white mountain, a kilometre across, hanging in the air. It is made of droplets of liquid water, about 10–20 micrometres (µm) across — a fifth to a third of the width of a human hair — a few hundred of them in every cubic centimetre, and together about half a gram of water in each cubic metre. A cloud that size holds some 500 tonnes of water, and it floats. Then, within the hour, some of that water falls as drops a hundred times wider. Two puzzles: why does the cloud float, and how does it make rain?

### Why a cloud floats
Water is 800 times denser than air, so the droplets must fall — but slowly. A small sphere in a viscous fluid reaches a terminal speed at which its weight is balanced by drag (Stokes):

$$v = \\frac{2\\,\\rho_w\\,g\\,r^2}{9\\,\\mu}$$

For a droplet 10 µm across (radius 5 µm) in air of viscosity $1.8\\times10^{-5}$ Pa·s that is **3 mm per second**. Falling the kilometre to the ground would take four days, and any updraft of a centimetre a second holds it up; long before, the air below the cloud is drier and the droplet evaporates. A raindrop 1 mm across falls at 4 m/s, and one of 4 mm at 9 m/s: speed rises with the *square* of the radius while the drag is small.

### The seed
Vapour does not condense easily on nothing: forming a droplet of a few molecules out of pure vapour would need the air to be several hundred percent supersaturated. The reason is the **Kelvin effect**. A tiny drop has a strongly curved surface, and molecules on a convex surface are less bound; the vapour pressure above a drop of radius $r$ is higher than above a flat surface by

$$\\frac{e(r)}{e_s} = \\exp\\left(\\frac{2\\sigma M}{\\rho R T r}\\right)$$

At 0.1 µm radius the excess is 1.1 %; at 10 nm, 12 %. In real air the droplet forms on a particle — sea salt, sulphate, dust, smoke — a **cloud condensation nucleus**, of which a cubic centimetre of air holds hundreds. The nucleus dissolves, lowering the vapour pressure (Raoult's law); together the curvature and the solute give the **Köhler curve**, which has a peak. A particle in air with less supersaturation than the peak settles as a haze droplet; in air above it, the droplet "activates" and grows freely. Clouds exist at supersaturations of 0.1–1 %.

### From droplet to drop
Once activated, a droplet grows by condensation, but its radius squared grows only in proportion to time, so it slows as it grows: from 10 µm to 100 µm takes about an hour and a half; to a millimetre, **about a week** — far longer than the lifetime of a cloud. Rain must therefore come from something quicker.

- **Collision and coalescence.** Droplets larger than about 40 µm fall fast enough to overtake smaller ones and sweep them up; each collision adds volume, and the larger the drop, the faster it falls and the more it collects. A chain reaction takes a few droplets to millimetre size in about an hour. This is the *warm rain* of the tropics and of shallow clouds above 0 °C.
- **The ice process.** At −10 °C the saturation vapour pressure over ice is 10 % lower than over supercooled water, so air that is just saturated for the droplets is 10 % supersaturated for an ice crystal. The crystal grows fast, the droplets evaporate to feed it, and it falls: this is the **Bergeron–Findeisen process**, proposed by Tor Bergeron (1935), and it makes most of the rain of the mid-latitudes, which starts as snow and melts on the way down.

### Snow
Ice crystals are hexagonal prisms (see [[snowflakes]]). Their shape depends on the temperature and humidity in which they grew: thin plates near −2 °C, needles near −5 °C, stellar dendrites near −15 °C, plates again below −20 °C. Because each crystal travels through a different series of conditions, no two have the same history.

> [!key] A cloud floats because its droplets, 10 µm across, fall at only 3 mm/s; it makes rain because large droplets collect small ones or because ice crystals steal vapour from droplets. Both need a seed: every cloud droplet condenses on a speck of salt, dust or smoke.`,
  ideas: ['A cloud droplet (about 10 µm across, 3 mm/s fall speed) has a millionth of the volume of a 1 mm raindrop (4 m/s).', 'Droplets form on condensation nuclei because a tiny curved surface raises the vapour pressure (the Kelvin effect: 1 % at 0.1 µm radius); dissolved salt lowers it again (the Köhler curve).', 'Condensation alone needs days to make rain; collision–coalescence needs about an hour; ice crystals in supercooled clouds are faster still.', 'At −10 °C air saturated for water is 10 % supersaturated for ice, so crystals grow while droplets evaporate (the Bergeron process).'],
  pitfalls: ['"Clouds are made of water vapour" — Vapour is invisible. A cloud is liquid droplets or ice crystals; the white you see is sunlight scattered by them.', '"Raindrops are teardrop-shaped" — Small ones are spherical; larger ones flatten into a hamburger-bun shape; above about 5 mm they break up.', '"Cold air cannot hold much water, so clouds make rain by cooling" — Cooling saturates the air and makes the droplets; making them *large* enough to fall needs a growth process on top.'],
  terms: [
    { term: 'Condensation nucleus', also: ['cloud condensation nucleus', 'CCN', 'aerosol'], def: 'A particle, typically 0.05–1 µm across, of salt, sulphate, dust or smoke on which cloud droplets form. Without it, clouds would need hundreds of percent supersaturation.' },
    { term: 'Supersaturation', also: ['supersaturated air'], def: 'A relative humidity above 100 %, expressed as the excess: 0.5 % supersaturation is RH = 100.5 %. Cloud updrafts reach 0.1–1 %.' },
    { term: 'Kelvin effect', also: ['curvature effect'], def: 'The higher vapour pressure above a curved drop surface than above a flat one: a factor exp(2σM/ρRTr), 1.1 % at a radius of 0.1 µm. It is why tiny drops evaporate.' },
    { term: 'Köhler curve', also: ['Köhler theory'], def: 'The equilibrium saturation ratio above a solution droplet as a function of its size: the Kelvin effect pushes it up, dissolved solute pushes it down. The peak is the critical supersaturation for activation.' },
    { term: 'Collision–coalescence', also: ['warm rain process'], def: 'Growth of raindrops by large droplets falling through, colliding with and merging with small ones. It takes over from condensation once droplets exceed about 40 µm and gives rain from clouds warmer than 0 °C.' },
    { term: 'Bergeron–Findeisen process', also: ['ice-crystal process', 'cold rain process'], def: 'Growth of ice crystals at the expense of supercooled droplets in a mixed cloud, because the vapour pressure over ice is lower than over liquid at the same temperature. The main source of rain outside the tropics.' }
  ],
  formulas: [
    { name: 'Kelvin effect: vapour over a curved drop', expr: 'S = exp(2*sigma*M/(rhoW*R*T*r))', tex: 'S = \\exp\\left(\\frac{2\\sigma M}{\\rho_w R T r}\\right)',
      vars: { S: { name: 'saturation ratio over the drop', q: 'ratio', unit: '%', hint: '101.1 % at a radius of 0.1 µm; 112 % at 10 nm.' }, sigma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 73.5, tex: '\\sigma', hint: '73.5 mN/m at 15 °C, 75.6 at 0 °C.' }, M: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, fixed: true }, rhoW: { const: 'rhoW', tex: '\\rho_w' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 15 }, r: { name: 'radius of the drop', q: 'length', unit: 'µm', value: 0.1, min: 0.001 } },
      solveFor: 'S', note: 'For a pure-water drop. Dissolved salt lowers the vapour pressure; the combined curve is the Köhler curve.',
      stories: { S: 'A water droplet has a radius of {r} at {T}. By what factor is the vapour pressure above it higher than above a flat surface?', r: 'The vapour pressure above a water droplet at {T} is {S} of the flat-surface value. What is its radius?' } },
    { name: 'Fall speed of a small droplet (Stokes)', expr: 'v = 2*rhoW*g*r^2/(9*mu)', tex: 'v = \\frac{2\\rho_w g r^2}{9\\mu}',
      vars: { v: { name: 'terminal speed', q: 'speed', unit: 'mm/s', hint: '3 mm/s for a cloud droplet 10 µm across (radius 5 µm), 48 mm/s at a radius of 20 µm; valid only for radii below about 40 µm.' }, rhoW: { const: 'rhoW', tex: '\\rho_w' }, g: { const: 'g' }, r: { name: 'radius of the droplet', q: 'length', unit: 'µm', value: 5, min: 0.1, max: 40 }, mu: { name: 'viscosity of air', q: 'viscosity', unit: 'mPa·s', value: 0.0182, tex: '\\mu', hint: '0.0182 mPa·s at 20 °C. The air\'s density is neglected next to water\'s.' } },
      solveFor: 'v', note: 'Valid for radii below about 40 µm, where the flow around the drop is smooth. Beyond that drag grows faster and the speed rises more slowly.',
      stories: { v: 'A cloud droplet of radius {r} falls through air. How fast does it fall?' } },
    { name: 'How many droplets in a raindrop', expr: 'n = (D/d)^3', tex: 'n = \\left(\\frac{D}{d}\\right)^3',
      vars: { n: { name: 'number of droplets', hint: 'A million for 1 mm and 10 µm; a billion if the droplets are 1 µm.' }, D: { name: 'diameter of the raindrop', q: 'length', unit: 'mm', value: 1 }, d: { name: 'diameter of a cloud droplet', q: 'length', unit: 'µm', value: 10 } },
      solveFor: 'n', note: 'Volume goes as the cube of the diameter. A real raindrop also collects from larger droplets and loses some on the way.',
      stories: { n: 'A raindrop {D} across forms from droplets {d} across. How many droplets merged?' } },
    { name: 'Supersaturation of air saturated for water, seen by ice', expr: 'si = ew/ei - 1', tex: 's_i = \\frac{e_w}{e_i} - 1',
      vars: { si: { name: 'supersaturation with respect to ice', q: 'ratio', unit: '%', tex: 's_i' }, ew: { name: 'saturation pressure over liquid', q: 'pressure', unit: 'Pa', value: 286.5, tex: 'e_w', hint: '286.5 Pa at −10 °C (supercooled water).' }, ei: { name: 'saturation pressure over ice', q: 'pressure', unit: 'Pa', value: 259.9, tex: 'e_i', hint: '259.9 Pa at −10 °C.' } },
      solveFor: 'si', note: 'About 5 % at −5 °C, 10 % at −10 °C, 16 % at −15 °C, 22 % at −20 °C: the crystal\'s advantage grows with the cold.',
      stories: { si: 'At −10 °C the saturation pressure is {ew} over supercooled water and {ei} over ice. By how much is air in equilibrium with water supersaturated for ice?' } }
  ],
  examples: [
    { title: 'Why a droplet takes four days to fall', q: 'A cloud droplet is 10 µm across. The cloud base is 1 km above the ground. How long would the droplet take to fall that far in still air?',
      steps: [{ text: 'Stokes\' law, with $r = 5\\ \\mu\\mathrm{m}$, $\\mu = 1.8\\times10^{-5}$ Pa·s:', tex: 'v = \\frac{2 \\times 1000 \\times 9.81 \\times (5\\times10^{-6})^2}{9 \\times 1.8\\times10^{-5}} = 3.0\\times10^{-3}\\ \\mathrm{m/s}' }, 'Time to fall 1,000 m: $1000/0.003 = 3.3\\times10^5$ s, or 3.9 days.', 'A rising current of 3 mm/s — a slow, gentle updraft — holds the droplet in place; and in air below the cloud, where it is sub-saturated, the droplet evaporates before it falls a metre.'],
      a: 'About four days: effectively never. Cloud droplets float; only a drop thousands of times bigger by volume reaches the ground.' },
    { title: 'How long does condensation take?', q: 'A droplet of radius 5 µm sits in air supersaturated by 0.3 %. Its radius obeys $r^2 = r_0^2 + 2Gst$ with $G = 8\\times10^{-11}\\ \\mathrm{m^2/s}$ near 5 °C. How long to reach a diameter of 100 µm, and of 1 mm?',
      steps: [{ text: 'Solve for the time:', tex: 't = \\frac{r^2 - r_0^2}{2Gs}' }, 'To 100 µm (r = 50 µm): $(2.5\\times10^{-9} - 2.5\\times10^{-11})/(2\\times8\\times10^{-11}\\times0.003) = 5.2\\times10^3$ s, 1.4 hours.', 'To 1 mm (r = 0.5 mm): $(2.5\\times10^{-7})/(4.8\\times10^{-13}) = 5.2\\times10^5$ s, 6 days.'],
      a: 'About 1.4 hours to 100 µm and 6 days to 1 mm: the slowing is built into the square-root law, and a cloud rarely lives that long. Collision and the ice process do the rest.' }
  ],
  quiz: [
    { q: 'A raindrop 1 mm across contains about how many cloud droplets, each 10 µm across?', choices: ['A hundred', 'A thousand', 'A million', 'A billion'], a: 2, why: 'The diameter ratio is 100; the volume ratio is 100³ = a million.' },
    { q: 'Why do cloud droplets form on dust and salt particles rather than from the vapour alone?', choices: ['The particles are colder', 'A tiny drop has a curved surface and a higher vapour pressure, so it evaporates unless a nucleus helps', 'The particles release heat', 'Water cannot condense in the free air'], a: 1, why: 'The Kelvin effect raises the vapour pressure above a very small drop. A nucleus gives the droplet a head start at a size where the curvature matters little, and its solute lowers the vapour pressure further.' },
    { q: 'The droplets of a cloud are all about the same size, and the cloud makes no rain at all. The most likely reason is', choices: ['It is too cold', 'The droplets are too uniform to collide and coalesce, and no ice is present', 'There is too much vapour', 'The Sun is shining on it'], a: 1, why: 'Collision–coalescence needs some droplets larger than their neighbours, so that they fall through them. A narrow size distribution (many nuclei, shared water) stalls rain; polluted clouds suppress it.' },
    { q: 'In a cloud at −10 °C containing both supercooled droplets and ice crystals, the crystals grow and the droplets shrink.', a: true, why: 'The air is saturated with respect to the droplets, so it is supersaturated by about 10 % for ice. Vapour deposits on the crystals and the droplets evaporate to supply it.' },
    { q: 'How fast does a cloud droplet of 5 µm radius fall, in mm/s? (Take the air\'s viscosity as 1.8 × 10⁻⁵ Pa·s.)', answer: 3, unit: 'mm/s', why: 'v = 2ρgr²/(9μ) = 2 × 1000 × 9.81 × 2.5 × 10⁻¹¹ / (1.62 × 10⁻⁴) = 3.0 × 10⁻³ m/s.' }
  ],
  applications: ['Weather forecasting and radar: the size of the drops decides what a radar sees and how much rain falls.', 'Cloud seeding: dry ice (Schaefer, 1946) or silver iodide (Vonnegut, 1947) supplies ice nuclei to supercooled clouds; the benefit is hard to prove.', 'Aerosols and climate: more nuclei make more, smaller droplets and brighter clouds that rain less, one of the largest uncertainties in climate forecasts.', 'Fog harvesting: nets in the Atacama and in Morocco collect fog droplets that are too small to fall.', 'Aircraft icing and de-icing: supercooled droplets freeze on contact with wings.'],
  history: 'John Aitken showed in 1880 that droplets need dust to form on. C. T. R. Wilson\'s cloud chamber (1911) used the same effect to make ion tracks visible. Hilding Köhler (1936) put the Kelvin and Raoult effects together. Alfred Wegener (1911), Tor Bergeron (1935) and Walter Findeisen (1938) described the ice process. Wilson Bentley photographed the first snow crystals in 1885.',
  sources: ['Pruppacher, H. R. and Klett, J. D., *Microphysics of Clouds and Precipitation* (Kluwer, 1997) — droplet growth and fall speeds.', 'Rogers, R. R. and Yau, M. K., *A Short Course in Cloud Physics* (3rd edn, Butterworth-Heinemann, 1989), chapters 6–8.', 'Petters, M. D. and Kreidenweis, S. M., "A single parameter representation of hygroscopic growth and cloud condensation nucleus activity", *Atmospheric Chemistry and Physics* 7, 1961 (2007) — the κ-Köhler curve.', 'Libbrecht, K. G., "The physics of snow crystals", *Reports on Progress in Physics* 68, 855 (2005).'],
  sim: 'cyc-droplet-growth'
},

/* ================================================================ the greenhouse gas */
{
  id: 'water-vapour-greenhouse', parent: 'the-water-cycle-and-climate', title: 'Water vapour, the greenhouse gas', level: 2,
  short: 'Water vapour supplies about half of the Earth\'s natural greenhouse effect, and clouds another quarter, yet it does not start climate change: it condenses out in days, and its amount is set by the temperature. It acts as a feedback that roughly doubles the warming that a rise in CO₂ would cause by itself.',
  keywords: ['greenhouse effect', 'water vapour', 'water vapor', 'feedback', 'forcing', 'climate sensitivity', 'Planck', 'lapse rate', 'infrared', 'Clausius-Clapeyron', 'IPCC', 'Schmidt', 'radiative forcing', '33 kelvin', 'control knob'],
  prereq: ['humidity-and-dew-point', 'the-water-cycle', 'vibrations-and-the-colour-of-water'],
  related: ['clouds-rain-and-snow', 'sea-ice-and-albedo', 'oceans-as-a-heat-reservoir', 'thermal-expansion-of-the-sea', 'venus-lost-its-ocean', 'the-habitable-zone', 'physics:heat-transfer', 'biology:climate-ecosystems'],
  body: `
Without an atmosphere the Earth would be a frozen ball at −18 °C: that is the temperature at which a planet at our distance, reflecting 30 % of the sunlight, radiates as much heat as it absorbs. The real average is +15 °C. The 33 degrees difference is the **greenhouse effect**: the air is nearly transparent to sunlight but opaque in many bands of the infrared in which the ground and sea radiate, so the heat escapes to space from a higher, colder layer, and the surface must be warmer to push the same power through. In numbers, the surface radiates about 390–398 W/m²; only 239 W/m² leaves the top of the atmosphere, and the difference, about 150–160 W/m², is the effect.

### Who does it?
Water is a bent molecule ([[the-bent-shape]]), and a bent molecule has three ways to vibrate and many ways to rotate, each absorbing a band of infrared ([[vibrations-and-the-colour-of-water]]). Its bending vibration at 6.3 µm and its rotation lines beyond 15 µm, together with a continuum in the "window" between 8 and 12 µm, make water vapour the most important absorber of terrestrial radiation. In a widely used attribution (Schmidt, Ruedy, Miller and Lacis, 2010), water vapour accounts for about **50 %** of the natural greenhouse effect, clouds for **25 %**, carbon dioxide for **20 %** and everything else — methane, ozone, nitrous oxide — for about 5 %. The shares depend on how the overlapping contributions are counted: other methods give vapour a third to a half. In every method water in its two atmospheric forms, vapour and cloud, is the larger part.

### Why it is a feedback, not a forcing
If water vapour does half the work, why do discussions of climate change focus on CO₂? Because of what *controls* each gas. The air cannot hold more vapour than saturation allows ([[humidity-and-dew-point]]); add vapour beyond that and it rains out within days, on average about 9 days. The amount of vapour is therefore set not by what is emitted but by **the temperature**, mostly through evaporation from the oceans. Carbon dioxide does not condense at any temperature on Earth, and what is added stays for centuries. CO₂, methane and ozone are the "non-condensing" gases that fix the temperature on which vapour then builds; model experiments (Lacis and colleagues, 2010) that remove them cause the vapour to freeze out and the planet to cool towards a snowball.

A **forcing** is a push applied from outside; a **feedback** is a response that changes with the temperature itself. Warm the planet by any cause and the oceans evaporate more: the humidity of the air stays close to constant in relative terms, so its absolute content rises about 6–7 % per kelvin, as the Clausius–Clapeyron relation predicts, and observations from satellites and radiosondes confirm it. More vapour traps more heat: warming begets warming.

### How big is the feedback
Climate scientists express feedbacks in W/m² of extra trapping per kelvin of warming. The basic response, the **Planck** feedback, is $-3.2$ W/m² per K (a warmer planet radiates more). With a forcing of 3.9 W/m² (a doubling of CO₂, IPCC AR6), the Planck response alone would give $3.9/3.2 \\approx 1.2$ K. Water vapour adds about **+1.8** W/m² per K; a warming upper troposphere takes back about 0.5 of that (the lapse-rate feedback); albedo and clouds add a few tenths more each. With vapour and lapse rate the warming is 2.0 K — "roughly double"; with all feedbacks, about 3 K, the best estimate of the equilibrium sensitivity (likely range 2.5–4 K, AR6). Without the vapour feedback it would be about 1.3 K.

### A feedback can be tested
When Mount Pinatubo erupted in 1991 and cooled the globe by about half a degree, the water vapour in the air fell by the amount predicted by the feedback (Soden and colleagues, 2002). The feedback is not a model assumption but a measured response.

> [!key] Water vapour is the biggest single contributor to the natural greenhouse effect, but its amount follows the temperature: it condenses in days and rises about 6–7 % per kelvin. That makes it a powerful feedback that roughly doubles the warming from a rise in CO₂ — an amplifier, not an originator.`,
  ideas: ['The greenhouse effect warms the Earth by 33 K: 15 °C instead of −18 °C. The surface radiates about 390 W/m² and 239 W/m² leaves the top of the atmosphere.', 'Water vapour accounts for about half of the natural effect, clouds a quarter, CO₂ a fifth, by one common attribution.', 'Vapour stays in the air about 9 days and its amount is set by temperature, so it is a feedback; CO₂ lasts centuries and is a forcing.', 'Warming raises the vapour by about 6–7 % per kelvin; that feedback (about +1.8 W/m² per K, less 0.5 from the lapse rate) roughly doubles the warming from a rise in CO₂.'],
  pitfalls: ['"Water vapour is the main greenhouse gas, so CO₂ doesn\'t matter" — Vapour is the larger contributor to the effect but cannot change independently: the climate\'s response to CO₂ is amplified by the vapour it brings.', '"Water vapour is not a greenhouse gas because it comes from natural sources" — It is a powerful absorber; what matters is that humans cannot change it directly.', '"Clouds are made of vapour and so work like it" — Clouds are liquid and ice, they both trap heat and reflect sunlight, and the net effect (warming or cooling) depends on type and height.'],
  terms: [
    { term: 'Greenhouse effect', also: ['natural greenhouse effect'], def: 'The warming of a planet\'s surface by an atmosphere that is transparent to sunlight but absorbs infrared. For the Earth, 33 K: 15 °C instead of −18 °C; about 150–160 W/m² of trapped radiation.' },
    { term: 'Radiative forcing', also: ['forcing', 'ΔF'], def: 'The change in the balance between absorbed sunlight and emitted heat caused by an external change, such as more CO₂, in W/m². A doubling of CO₂ is a forcing of about 3.9 W/m².' },
    { term: 'Climate feedback', also: ['feedback parameter', 'λ'], def: 'A change that the warming itself causes, which in turn changes the radiation balance: in W/m² per K. Positive feedbacks amplify the warming (water vapour, ice albedo); negative ones damp it (the Planck response).' },
    { term: 'Planck response', also: ['Planck feedback', 'blackbody response'], def: 'The extra heat a warmer Earth radiates to space, about 3.2 W/m² per kelvin. It alone would limit a doubling of CO₂ to about 1.2 K of warming.' },
    { term: 'Equilibrium climate sensitivity', also: ['ECS'], def: 'The warming, after the climate has settled, from a doubling of the CO₂ concentration. About 3 K (likely range 2.5–4 K, IPCC AR6), amplified from 1.2 K by feedbacks.' }
  ],
  formulas: [
    { name: 'The strength of the greenhouse effect', expr: 'G = sigma*Ts^4 - OLR', tex: 'G = \\sigma T_s^4 - F_{\\mathrm{out}}',
      vars: { G: { name: 'trapped radiation', q: 'intensity', unit: 'W/m²', hint: 'About 150–160 W/m² for the Earth.' }, sigma: { const: 'sigma', tex: '\\sigma' }, Ts: { name: 'mean surface temperature', q: 'temperature', unit: '°C', value: 15, tex: 'T_s' }, OLR: { name: 'outgoing radiation at the top of the atmosphere', q: 'intensity', unit: 'W/m²', value: 239, tex: 'F_{\\mathrm{out}}', hint: 'Equal to the absorbed sunlight in balance: 240 W/m².' } },
      solveFor: 'G', note: 'With the blackbody value of the surface radiation, 391 W/m² at 15 °C; including the surface\'s infrared emissivity and its patchy temperature gives 396–398.',
      stories: { G: 'The surface at {Ts} radiates as a blackbody while {OLR} leaves the atmosphere. How much is trapped?' } },
    { name: 'Warming with no feedback except the Planck response', expr: 'dT0 = dF/lamP', tex: '\\Delta T_0 = \\frac{\\Delta F}{\\lambda_P}',
      vars: { dT0: { name: 'warming without other feedbacks', q: 'dtemp', unit: 'K', tex: '\\Delta T_0' }, dF: { name: 'forcing', q: 'intensity', unit: 'W/m²', value: 3.9, tex: '\\Delta F', hint: '3.9 W/m² for a doubling of CO₂ (IPCC AR6: 3.93 ± 0.47).' }, lamP: { name: 'Planck response', unit: 'W/m²/K', value: 3.2, tex: '\\lambda_P', fixed: true } },
      solveFor: 'dT0', note: 'The warming needed to radiate away an extra 3.9 W/m², with nothing else changing.',
      stories: { dT0: 'A forcing of {dF} warms a planet that responds only by radiating more. By how much?' } },
    { name: 'Warming with feedbacks', expr: 'dT = dF/(lamP - fb)', tex: '\\Delta T = \\frac{\\Delta F}{\\lambda_P - f}',
      vars: { dT: { name: 'equilibrium warming', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, dF: { name: 'forcing', q: 'intensity', unit: 'W/m²', value: 3.9, tex: '\\Delta F' }, lamP: { name: 'Planck response', unit: 'W/m²/K', value: 3.2, tex: '\\lambda_P', fixed: true }, fb: { name: 'sum of the positive feedbacks', unit: 'W/m²/K', value: 1.3, min: 0, max: 3.19, tex: 'f', hint: 'Water vapour (1.8) plus lapse rate (−0.5) is 1.3; with albedo and clouds, about 2.1.' } },
      solveFor: 'dT', note: 'Valid while f is smaller than λ_P (gain below 1). The ratio ΔT/ΔT₀ = 1/(1 − f/λ_P) is the amplification.',
      stories: { dT: 'A forcing of {dF} meets a Planck response of {lamP} and feedbacks adding {fb}. What is the warming?', fb: 'A forcing of {dF} causes a warming of {dT}. How large are the feedbacks if the Planck response is {lamP}?' } },
    { name: 'More vapour in warmer air', expr: 'w = exp(k*dT)', tex: 'w = \\exp(k\\,\\Delta T)',
      vars: { w: { name: 'water vapour relative to before', q: 'ratio', unit: '%', hint: '1.07 per kelvin; at 3 K of warming, 124 %.' }, k: { name: 'rate of increase', q: 'expansion', unit: '1/K', value: 0.07, hint: 'About 0.064–0.073 per K, from Clausius–Clapeyron at constant relative humidity.' }, dT: { name: 'warming', q: 'dtemp', unit: 'K', value: 3, tex: '\\Delta T' } },
      solveFor: 'w', note: 'Assumes the relative humidity stays about constant, as it does in models and observations.',
      stories: { w: 'The air warms by {dT}. By what factor does its water vapour content grow, at {k}?' } }
  ],
  examples: [
    { title: 'What the vapour feedback is worth', q: 'A doubling of CO₂ is a forcing of 3.9 W/m². Find the warming with (a) the Planck response only, (b) the water-vapour and lapse-rate feedbacks (+1.8 and −0.5 W/m² per K), (c) all feedbacks, adding +0.35 for albedo and +0.42 for clouds.',
      steps: ['(a) $\\Delta T = 3.9/3.2 = 1.2$ K.', '(b) $f = 1.8 - 0.5 = 1.3$, so $\\Delta T = 3.9/(3.2 - 1.3) = 2.05$ K: the warming is multiplied by 1.7.', '(c) $f = 1.3 + 0.35 + 0.42 = 2.07$ and $\\Delta T = 3.9/(3.2 - 2.07) = 3.5$ K.', 'Remove the water-vapour term from (c): $f = 0.27$ and $\\Delta T = 3.9/2.93 = 1.3$ K.'],
      a: '1.2 K, 2.0 K, about 3.5 K (3 K in the full assessment). Take away the vapour feedback and the warming falls from about 3.5 K to 1.3 K.' },
    { title: 'Why vapour cannot be "added" like CO₂', q: 'Air at 15 °C holds at most 12.8 g of vapour per m³. Someone adds 5 g/m³ of vapour to air that already holds 10 g/m³ at 15 °C. What happens?',
      steps: ['The total would be 15 g/m³, more than the 12.8 g/m³ that saturated air at 15 °C can hold.', 'The excess 2.2 g/m³ condenses as fog or rain.', 'Added CO₂, by contrast, has no saturation limit at any Earth temperature: it accumulates.'],
      a: 'The air is saturated and 2.2 g/m³ rains out: whatever you add, the air returns to saturation within days. That is why the vapour follows the temperature rather than the emissions.' }
  ],
  quiz: [
    { q: 'Water vapour is a "feedback" rather than a "forcing" in climate science mainly because', choices: ['it is not a greenhouse gas', 'its amount is set by the temperature and it condenses out within days', 'it is produced only by humans', 'its absorption is weak'], a: 1, why: 'Vapour is a strong greenhouse gas. But how much the air holds follows the temperature (about 7 % per K) and any excess falls as rain in days. CO₂ does not condense, so what is added lasts centuries.' },
    { q: 'With a forcing of 3.9 W/m² and the Planck response of 3.2 W/m² per K alone, the warming would be about', choices: ['0.3 K', '1.2 K', '3 K', '12 K'], a: 1, why: '3.9 ÷ 3.2 = 1.2 K. Feedbacks then raise it to about 3 K.' },
    { q: 'About how much does the water vapour in the air rise per kelvin of warming, at constant relative humidity?', choices: ['0.7 %', '7 %', '30 %', '70 %'], a: 1, why: 'Saturation vapour pressure rises 6–7 % per kelvin near the Earth\'s mean temperature (Clausius–Clapeyron).' },
    { q: 'If the water-vapour feedback were removed from the climate system (all else equal), the warming from a doubling of CO₂ would be', choices: ['about the same', 'about 10 % smaller', 'about half to two-thirds smaller', 'slightly larger'], a: 2, why: 'With the vapour feedback the warming is about 3.5 K in the example above, without it about 1.3 K.' },
    { q: 'About what share of the natural greenhouse effect is due to carbon dioxide, in the attribution of Schmidt and colleagues (2010)?', answer: 20, unit: '%', why: 'Water vapour about 50 %, clouds about 25 %, CO₂ about 20 %, the rest about 5 %. The ranking is robust; the exact shares depend on the method.' }
  ],
  applications: ['Climate projection: the water-vapour feedback is built into every climate model and is among the best-constrained of the feedbacks.', 'Weather and heat extremes: warm air carries more vapour, so heat waves are more humid and the "feels-like" temperature rises faster than the thermometer ([[evaporative-cooling]]).', 'Planetary science: a world with an ocean that evaporates enough vapour can run away to a hot, dry state, as Venus probably did ([[venus-lost-its-ocean]]).', 'Satellites: humidity measured in the infrared and microwave bands is a primary climate record.'],
  history: 'John Tyndall measured in 1859 that water vapour and carbon dioxide absorb heat radiation while nitrogen and oxygen do not, and saw at once that the vapour is the more powerful. Svante Arrhenius (1896) computed that halving or doubling CO₂ would change the temperature by several degrees, and counted on the vapour to amplify it. Syukuro Manabe and Richard Wetherald (1967) found in a model that doubling CO₂ warms the globe by 2.3 K if relative humidity stays constant, against 1.3 K if the absolute humidity does.',
  sources: ['Schmidt, G. A., Ruedy, R. A., Miller, R. L. and Lacis, A. A., "Attribution of the present-day total greenhouse effect", *Journal of Geophysical Research* 115, D20106 (2010) — the 50 / 25 / 20 / 5 % attribution.', 'IPCC AR6 Working Group I (2021), chapter 7 (The Earth\'s energy budget, climate feedbacks and climate sensitivity) — the forcing of 3.93 W/m² and the feedback values.', 'Lacis, A. A., Schmidt, G. A., Rind, D. and Ruedy, R. A., "Atmospheric CO₂: principal control knob governing Earth\'s temperature", *Science* 330, 356 (2010).', 'Soden, B. J., Wetherald, R. T., Stenchikov, G. L. and Robock, A., "Global cooling after the eruption of Mount Pinatubo: a test of climate feedback by water vapor", *Science* 296, 727 (2002).'],
  sim: 'cyc-vapour-feedback'
},

/* ================================================================ ocean currents */
{
  id: 'ocean-currents', parent: 'the-water-cycle-and-climate', title: 'Ocean currents', level: 2,
  short: 'Winds drive great gyres in every ocean basin, and the Gulf Stream is the strongest of them: 30 million cubic metres a second off Florida, 150 times the Amazon. Below the surface a slower overturning circulation, powered by cold, salty water sinking in the North Atlantic and around Antarctica, takes about a thousand years to turn the deep ocean over.',
  keywords: ['ocean currents', 'Gulf Stream', 'gyre', 'thermohaline circulation', 'AMOC', 'meridional overturning', 'Sverdrup', 'brine rejection', 'deep water formation', 'conveyor belt', 'Ekman', 'Coriolis', 'RAPID array', 'Antarctic circumpolar current'],
  prereq: ['oceans-as-a-heat-reservoir', 'the-salt-of-the-sea', 'the-density-maximum'],
  related: ['sea-ice-and-albedo', 'the-water-cycle', 'maritime-and-continental-climates', 'thermal-expansion-of-the-sea', 'icebergs-and-sea-ice', 'water-vapour-greenhouse', 'physics:convection', 'biology:climate-ecosystems'],
  body: `
Throw a bottle into the sea off Florida and it may come ashore in Ireland a year or two later. It rode the **Gulf Stream**, a river in the ocean, 80 km wide and about 700 m deep, that carries 30 million cubic metres of water a second past Miami. By the time it reaches Cape Hatteras it has been joined by recirculating water to reach 150 million. The unit of ocean flow is the **sverdrup** (Sv), a million cubic metres per second. The Gulf Stream is 30 Sv; the Amazon, the largest river in the world, is 0.2 Sv; all the rivers of the world together are about 1.3 Sv; the largest current, the Antarctic Circumpolar Current, carries about 130–170 Sv.

### Currents driven by the wind
The top few hundred metres are pushed by the winds: the trade winds blow westward near the equator, the westerlies eastward in mid-latitudes. The Earth's rotation turns moving water to the right in the northern hemisphere (the Coriolis effect), and the net transport in the wind-stirred layer, the Ekman transport, goes at right angles to the wind. The result is that surface water piles up in the middle of every subtropical ocean — the Sargasso Sea stands about a metre higher than its surroundings — and flows slowly around the "hill" in a **gyre**, clockwise in the north, anticlockwise in the south. Because the rotation of the planet is stronger at higher latitudes, each gyre squeezes its return flow into a narrow, fast current on its western side (Stommel, 1948): the Gulf Stream, the Kuroshio, the Agulhas. The eastern edge of the gyre is a broad drift of a few centimetres a second.

### The overturning: density-driven flow
Under the wind-driven layer lies a second circulation, driven by differences in density. Water that is cold and salty is dense. In the North Atlantic, warm salty surface water arrives from the subtropics, loses heat to the cold wind and sinks; around Antarctica, where sea ice forms, the ice leaves its salt behind (**brine rejection**) and the cold, extra-salty water sinks. These dense waters spread along the bottom of the ocean, 2–4 °C, and rise slowly elsewhere, over much of the ocean, by mixing; the circuit takes **about 1,000 years** (the radiocarbon age of the deep North Pacific is about 1,500 years). The Atlantic part, the **Atlantic Meridional Overturning Circulation** (AMOC), has been measured since 2004 by the RAPID array of moorings at 26.5° N across the Atlantic; it averages about 17 Sv, and carries about 1.2 petawatts of heat northwards, some 65 times the world's total energy use.

This is sometimes called the "thermohaline" circulation (*thermo* for heat, *haline* for salt), but the name is incomplete. The sinking is driven by cooling and salt, but energy to lift the deep water back up comes from the winds over the Southern Ocean and from tides that stir the deep sea; without that mixing the overturning would stop. And the density of seawater at the cold end depends much more on salinity than on temperature, because seawater expands little when warmed near freezing.

### Does the Gulf Stream warm Europe?
Partly. The ocean carries heat north, and Europe is milder than Canada at the same latitude. But most of the difference comes from the prevailing westerlies carrying air that has been warmed over the sea (and from the Rocky Mountains forcing the cold air south over North America) rather than from the stream itself (Seager and colleagues, 2002).

### The future
In its Sixth Assessment Report (2021) the IPCC judged it very likely that the AMOC will weaken over the 21st century, and the evidence for an abrupt collapse before 2100 was weak (medium confidence that it will not happen). Fresh water from melting Greenland ice and heavier rain dilute the surface water and make it less ready to sink; the question of whether a tipping point lies ahead remains open.

> [!key] Winds drive gyres, with strong western currents like the Gulf Stream (30 Sv); cooling and brine rejection make dense water sink in the North Atlantic and around Antarctica, driving an overturning of about 17 Sv in the Atlantic that takes about a thousand years to renew the deep ocean. It moves heat and carbon around the planet, and the way it will respond to warming is still an open question.`,
  ideas: ['The Gulf Stream carries 30 Sv (million m³/s) off Florida and up to 150 Sv further north; the Amazon is 0.2 Sv and all the world\'s rivers 1.3 Sv.', 'Winds and the Earth\'s rotation make gyres, clockwise in the north, with fast, narrow currents on their western edges.', 'Cold, salty water sinks in the North Atlantic and around Antarctica; the overturning flow is about 17 Sv in the Atlantic and renews the deep ocean in about 1,000 years.', 'The Atlantic overturning carries about 1.2 PW of heat north; it is expected to weaken with warming, but abrupt collapse this century is judged unlikely (IPCC AR6).'],
  pitfalls: ['"The Gulf Stream is why Europe is warm" — It contributes, but westerly winds carrying marine air do most of the work; Europe would still be milder than Canada without a stream.', '"The ocean conveyor is a single belt that circles the globe" — A useful cartoon, but the real flow is a tangle of currents, eddies and mixing; no particle follows a single loop.', '"Salt makes seawater denser, so salt alone drives the circulation" — Salinity and temperature both matter; cold water is dense, and in polar seas salinity dominates because seawater expands little near freezing.'],
  terms: [
    { term: 'Sverdrup', also: ['Sv'], def: 'The unit of ocean volume flow: one million cubic metres per second (10⁶ m³/s). The Gulf Stream off Florida carries about 30 Sv; the Amazon 0.2 Sv.' },
    { term: 'Gyre', also: ['ocean gyre', 'subtropical gyre'], def: 'A large, closed ocean circulation driven by the winds and the Earth\'s rotation: clockwise in the northern hemisphere, anticlockwise in the southern. The Gulf Stream is the western edge of the North Atlantic gyre.' },
    { term: 'Thermohaline circulation', also: ['THC', 'ocean conveyor', 'deep circulation'], def: 'The part of the ocean circulation driven by differences in density, which depends on temperature (thermo) and salinity (haline). It sets the slow overturning of the deep ocean.' },
    { term: 'Atlantic Meridional Overturning Circulation', also: ['AMOC'], def: 'The north–south overturning of the Atlantic: warm surface water flows north, cools and sinks in the North Atlantic, and returns south at depth. About 17 Sv and 1.2 PW of heat at 26.5° N.' },
    { term: 'Brine rejection', also: ['salt rejection'], def: 'When seawater freezes, the ice excludes most of the salt, leaving a cold, extra-salty brine that is denser than the water around it and sinks. A main source of the ocean\'s deepest water around Antarctica.' }
  ],
  formulas: [
    { name: 'Volume transport of a current', expr: 'Q = v*A', tex: 'Q = v\\,A',
      vars: { Q: { name: 'volume transport', q: 'flowrate', unit: 'm³/s', hint: '1 Sv = 10⁶ m³/s. 31 Sv through the Florida Straits.' }, v: { name: 'mean speed through the section', q: 'speed', unit: 'm/s', value: 0.55, hint: 'The core of the Gulf Stream reaches 2 m/s; the mean over the whole cross-section is much less.' }, A: { name: 'area of the section', q: 'area', unit: 'm²', value: 5.6e7, hint: 'Florida Straits: about 80 km wide and 700 m deep on average.' } },
      solveFor: 'Q', note: 'The flow through any cross-section is the speed averaged over it times its area.',
      stories: { Q: 'A current of mean speed {v} flows through a section of {A}. What is the volume transport?', v: 'A section of {A} carries {Q}. What is the mean speed?' } },
    { name: 'Heat carried by a current', expr: 'P = rho*cp*Q*dT', tex: 'P = \\rho\\,c_p\\,Q\\,\\Delta T',
      vars: { P: { name: 'heat transport', q: 'power', unit: 'W', hint: '1 PW = 10¹⁵ W; 1.2 PW for the Atlantic overturning.' }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, cp: { name: 'specific heat of sea water', q: 'specificheat', unit: 'J/(kg·K)', value: 3990, tex: 'c_p' }, Q: { name: 'volume transport', q: 'flowrate', unit: 'm³/s', value: 1.7e7, hint: '17 Sv.' }, dT: { name: 'temperature difference, upper vs return flow', q: 'dtemp', unit: 'K', value: 17, tex: '\\Delta T', hint: 'About 17 K between the warm northward and cold southward flows at 26.5° N.' } },
      solveFor: 'P', note: 'The northward flow carries warm water, the return flow cold: the net heat is the flow times the temperature difference.',
      stories: { P: 'An overturning of {Q} carries water {dT} warmer north than it returns south. How much heat does it move?' } },
    { name: 'How long to renew a volume', expr: 'tr = Vol/Q', tex: 't = \\frac{V}{Q}',
      vars: { tr: { name: 'time to move the volume', q: 'time', unit: 'yr', tex: 't' }, Vol: { name: 'volume of water', q: 'volume', unit: 'm³', value: 3.1e17, tex: 'V', hint: 'The Atlantic is 3.1 × 10¹⁷ m³ (310 million km³); the whole ocean 1.34 × 10¹⁸ m³.' }, Q: { name: 'flow', q: 'flowrate', unit: 'm³/s', value: 1.7e7 } },
      solveFor: 'tr', note: 'A residence time as in [[the-water-cycle]]. Only part of the ocean takes part in the overturning, so the real deep-water age is a few hundred to 1,500 years.',
      stories: { tr: 'A flow of {Q} moves through a basin of {Vol}. How long does it take to move the whole volume?' } }
  ],
  examples: [
    { title: 'The Gulf Stream through the Florida Straits', q: 'The Straits are about 80 km wide and on average 700 m deep, and the mean speed across the section is 0.55 m/s. What is the transport, in sverdrups, and how many Amazons is that (0.209 Sv)?',
      steps: ['Area: $8\\times10^4 \\times 700 = 5.6\\times10^7\\ \\mathrm{m^2}$.', 'Transport: $0.55 \\times 5.6\\times10^7 = 3.1\\times10^7\\ \\mathrm{m^3/s}$ = 31 Sv.', 'Amazons: $31/0.209 = 148$.'],
      a: 'About 31 Sv: roughly 150 Amazons, or 25 times the flow of all the rivers of the Earth together. (Direct cable measurements across the Straits give 30–32 Sv.)' },
    { title: 'Heat carried by the Atlantic overturning', q: 'The AMOC carries 17 Sv of water that is 17 K warmer on its way north than on its way back. How much heat does it carry? Compare with the world\'s power use of 18 TW.',
      steps: [{ text: 'With $\\rho c_p = 1025 \\times 3990 = 4.09\\times10^6\\ \\mathrm{J/(m^3\\,K)}$:', tex: 'P = 4.09\\times10^{6} \\times 1.7\\times10^{7} \\times 17 = 1.18\\times10^{15}\\ \\mathrm{W}' }, 'That is 1.2 PW = 1,200 TW.', 'The ratio to the world\'s primary power use is 1,200/18 = 65.'],
      a: 'About 1.2 PW, some 65 times the world\'s total energy use: the ocean carries heat on a scale nothing human approaches.' }
  ],
  quiz: [
    { q: 'The Gulf Stream off Florida carries about 30 Sv. The Amazon carries about 0.2 Sv. The ratio is about', choices: ['3', '15', '150', '15,000'], a: 2, why: '30 ÷ 0.2 = 150. All rivers together are about 1.3 Sv, so the Gulf Stream carries 25 times as much.' },
    { q: 'Which statement about the overturning circulation is correct?', choices: ['Warm water sinks in the tropics and rises at the poles', 'Cold, salty water sinks in the North Atlantic and around Antarctica', 'It takes about a week to turn over', 'It is driven only by the winds'], a: 1, why: 'Cooling (and brine rejection where ice forms) makes the surface water dense enough to sink; the circuit takes centuries to a thousand years; winds and tides help to mix the water back up.' },
    { q: 'Melting ice from Greenland would affect the overturning mainly by', choices: ['making the water warmer', 'making the surface water fresher and less dense, so it sinks less readily', 'blocking the Gulf Stream with icebergs', 'raising the sea level in the north'], a: 1, why: 'Fresh water dilutes the surface layer. A fresher, less dense surface sinks less, which weakens the overturning.' },
    { q: 'Europe is warmer than Canada at the same latitude only because of the Gulf Stream.', a: false, why: 'The prevailing westerlies carrying marine air, and the shape of the Rockies, make a large part of the contrast. The stream contributes, but it is not the main cause.' },
    { q: 'A current 100 km wide and 1 km deep flows at a mean speed of 0.3 m/s. What is its transport, in sverdrups?', answer: 30, unit: 'Sv', why: 'Area = 10⁵ m × 10³ m = 10⁸ m²; Q = 0.3 × 10⁸ = 3 × 10⁷ m³/s = 30 Sv.' }
  ],
  applications: ['Shipping and fishing: currents move ships, larvae and nutrients; the Gulf Stream was charted by Benjamin Franklin in 1770 to speed the mail.', 'Climate prediction: the oceans\' heat transport and uptake of CO₂ depend on the overturning.', 'Plastic and oil: floating litter collects in the centres of the gyres, the "garbage patches".', 'Sea-level rise: the dynamic height of the sea changes with the strength of the Gulf Stream, so a weakening raises the sea along the US east coast.'],
  history: 'The Gulf Stream was known to Spanish pilots by 1513 and charted by Franklin and Timothy Folger in 1770. Henry Stommel explained the western intensification in 1948 and, in 1961, found with a two-box model that the overturning could have two stable states. Wallace Broecker\'s "great ocean conveyor" (1987) made the idea famous. The RAPID array has measured the Atlantic overturning continuously since April 2004.',
  sources: ['McCarthy, G. D. and colleagues, "Measuring the Atlantic Meridional Overturning Circulation at 26° N", *Progress in Oceanography* 130, 91 (2015) — the 17 Sv and the heat transport.', 'Stommel, H., "Thermohaline convection with two stable regimes of flow", *Tellus* 13, 224 (1961).', 'Seager, R. and colleagues, "Is the Gulf Stream responsible for Europe\'s mild winters?", *Quarterly Journal of the Royal Meteorological Society* 128, 2563 (2002).', 'IPCC AR6 Working Group I (2021), chapter 9 (Ocean, cryosphere and sea level) — the future of the AMOC.', 'Wunsch, C. and Ferrari, R., "Vertical mixing, energy, and the general circulation of the oceans", *Annual Review of Fluid Mechanics* 36, 281 (2004).'],
  sim: 'cyc-overturning'
},

/* ================================================================ sea ice and albedo */
{
  id: 'sea-ice-and-albedo', parent: 'the-water-cycle-and-climate', title: 'Sea ice and albedo', level: 2,
  short: 'Snow-covered ice reflects 80–90 % of sunlight, bare sea ice 50–70 %, open water about 6 %. Melt the ice and the dark sea soaks up the sunshine the ice sent back, which melts more ice: the ice–albedo feedback. The Arctic\'s September ice has shrunk from about 7 million km² in the early 1980s to 4–5 million in recent years.',
  keywords: ['albedo', 'sea ice', 'ice-albedo feedback', 'Arctic', 'September minimum', 'NSIDC', 'snowball earth', 'Arctic amplification', 'reflectivity', 'melt ponds', 'open water', 'white', 'Antarctic sea ice', 'Budyko'],
  prereq: ['icebergs-and-sea-ice', 'water-vapour-greenhouse'],
  related: ['ocean-currents', 'oceans-as-a-heat-reservoir', 'the-water-cycle', 'glaciers-flow', 'why-ice-floats', 'the-deep-time-of-water', 'ice-beyond-earth', 'physics:heat-transfer', 'biology:climate-ecosystems'],
  body: `
From an aeroplane over the Arctic in June the contrast is unmistakable: white ice, with blue-black lanes of open water between the floes. The white sends the sunshine back to space; the dark takes it in. How much each does is the **albedo** (Latin for whiteness): the fraction of incoming sunlight that a surface reflects.

### The numbers
| Surface | Albedo |
|---|---|
| Fresh snow | 0.80–0.90 |
| Old, wet snow | 0.60–0.75 |
| Bare sea ice | 0.50–0.70 |
| Sea ice with melt ponds | 0.20–0.40 |
| Open ocean (sun high in the sky) | about 0.06 |
| Forest | 0.10–0.20 |
| Desert sand | 0.30–0.40 |
| The Earth as a whole | about 0.30 |

Snow and ice scatter light strongly because they are full of tiny air-and-ice interfaces; dark water absorbs it, and at a low sun the ocean's albedo rises to 0.1–0.3 because it reflects at grazing angles. At 200 W/m² of summer sunshine, a patch of open water absorbs 188 W/m², bare ice 80 W/m², fresh snow 30 W/m²: **six times** as much for the water as for the snow.

### A feedback
Start with ice. A bit of warming thins and melts some of it; the exposed water, or the melt ponds on the ice, absorb more sunshine; the extra heat melts more ice. The process can run backwards: a cold spell grows ice, reflects more sunshine, and cools further. This is the **ice–albedo feedback**, a positive feedback that amplifies any change. Its global strength is a modest +0.35 W/m² per K (IPCC AR6), because ice covers a small part of the planet; in the Arctic, where it is concentrated, it adds to others and helps make the region warm two to four times faster than the global mean (Arctic amplification).

### The Arctic's shrinking summer
Satellites have measured the extent of sea ice since late 1978 (NSIDC): the area where ice covers at least 15 % of the sea. The Arctic ice peaks in March at about 15 million km² and falls to a minimum in September. The September minimum was about **7 million km²** in the early 1980s, fell to a record low of about **3.4 million km²** in 2012, and has been **4–5 million km²** in the 2010s and early 2020s: a loss of about 12 % per decade, with the ice also getting thinner and younger. The Antarctic, whose sea ice melts and re-freezes each year around a continent, grew slightly until the mid-2010s and since 2016 has had several record lows.

Melting sea ice does not raise the sea level, because it floats and already displaces its own weight ([[why-ice-floats]], [[icebergs-and-sea-ice]]). It matters for the climate through the albedo and through its effect on the ocean: open water in autumn gives off heat and moisture to the cold air, and ice in the freezing process rejects salt that drives the overturning circulation ([[ocean-currents]]).

### The planetary thermostat
For a planet, the balance of absorbed sunlight and radiated heat gives a temperature that depends on the albedo ($T \\propto (1-\\alpha)^{1/4}$): at the Earth's greenhouse strength an increase of 0.01 in the planetary albedo cools it by 1 K. If ice cover itself depends on the temperature, the balance can have two stable states, a warm one and a frozen one. In 1969 Mikhail Budyko and William Sellers showed in simple models that a small drop in the Sun's output could push the Earth into a world covered with ice from the poles to the equator, which could not melt again without a large rise in the Sun's output or greenhouse gases. Geologists have found evidence that this happened, perhaps twice, 720–635 million years ago ("Snowball Earth"; Kirschvink 1992, Hoffman and colleagues 1998), ended when volcanoes had put enough CO₂ into the air to melt the ice. The simulation lets you do it.

> [!key] White ice reflects most of the sunshine and dark water absorbs most of it, so melting ice warms the polar sea, which melts more ice: the ice–albedo feedback. It has already shrunk the Arctic's summer ice by almost half since the 1980s, and in simple planetary models it can switch the whole Earth between warm and frozen states.`,
  ideas: ['Albedo is the fraction of sunlight reflected: 0.8–0.9 for fresh snow, 0.5–0.7 for bare sea ice, about 0.06 for open ocean, 0.30 for the Earth.', 'Open water absorbs about six times as much sunshine as snow-covered ice, so melting the ice speeds the melting: a positive feedback.', 'The Arctic September ice extent fell from about 7 million km² in the early 1980s to 3.4 in 2012 and 4–5 million km² since: about 12 % per decade.', 'In a simple planetary model the ice–albedo feedback allows a warm and a frozen state, with hysteresis between them: the idea of Snowball Earth.'],
  pitfalls: ['"Melting sea ice raises the sea level" — Floating ice already displaces its weight of water; melting it changes the level by a negligible amount. Ice sheets and glaciers on land are what raise it.', '"The Antarctic and the Arctic are doing the same thing" — The Arctic is an ocean surrounded by land, and its ice has declined steadily; the Antarctic is a continent surrounded by ocean, and its sea ice varied and has fallen only in recent years.', '"Dark things warm the Earth, so dark water on the sea has little effect" — Over the Arctic Ocean in summer the sun shines for 24 hours; the absorbed energy melts more ice per day than the whole winter\'s cold can regrow.'],
  terms: [
    { term: 'Albedo', also: ['reflectivity', 'bond albedo'], def: 'The fraction of incoming sunlight that a surface or planet reflects back: 0 for a perfect absorber, 1 for a perfect mirror. The Earth\'s is about 0.30.' },
    { term: 'Ice–albedo feedback', also: ['snow-albedo feedback', 'albedo feedback'], def: 'The amplification of a temperature change by the change in ice cover it causes: warming melts ice, the darker surface absorbs more sunlight, and warms further.' },
    { term: 'Sea-ice extent', also: ['ice extent'], def: 'The area of ocean with at least 15 % ice cover, measured by passive-microwave satellites since 1978. The Arctic September minimum has fallen from about 7 million km² to 4–5 million km².' },
    { term: 'Arctic amplification', also: ['polar amplification'], def: 'The faster warming of the Arctic than of the globe, two to four times as fast, caused by the loss of reflective ice and snow and other feedbacks.' },
    { term: 'Snowball Earth', also: ['Cryogenian glaciations'], def: 'The hypothesis that the Earth was covered in ice, from the poles to the equator, twice some 720–635 million years ago. The ice–albedo feedback is the mechanism that could have locked it in.' }
  ],
  formulas: [
    { name: 'The albedo of a mixed surface', expr: 'alpha = f*ai + (1 - f)*aw', tex: '\\alpha = f\\,\\alpha_i + (1-f)\\,\\alpha_w',
      vars: { alpha: { name: 'albedo of the surface', tex: '\\alpha' }, f: { name: 'ice cover', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 }, ai: { name: 'albedo of the ice', value: 0.7, tex: '\\alpha_i', hint: '0.85 snow-covered; 0.6 bare; 0.3 melt-pond ice.' }, aw: { name: 'albedo of open water', value: 0.06, tex: '\\alpha_w' } },
      solveFor: 'alpha', note: 'The area-weighted mean: the reflected power is the sum of the parts.',
      stories: { alpha: 'A sea is {f} covered with ice of albedo {ai}, the rest water of albedo {aw}. What is its albedo?' } },
    { name: 'Absorbed sunshine', expr: 'F = I*(1 - alpha)', tex: 'F = I\\,(1-\\alpha)',
      vars: { F: { name: 'absorbed power', q: 'intensity', unit: 'W/m²' }, I: { name: 'sunshine on the surface', q: 'intensity', unit: 'W/m²', value: 200, hint: 'About 200 W/m² for the Arctic in June–July, a daily mean at the surface.' }, alpha: { name: 'albedo', value: 0.5, tex: '\\alpha', min: 0, max: 1 } },
      solveFor: 'F', note: 'What is not reflected is absorbed (a thin ice cover transmits some into the water below).',
      stories: { F: 'A surface of albedo {alpha} receives {I}. How much does it absorb?' } },
    { name: 'The temperature of a planet', expr: 'T = (S*(1 - alpha)/(4*eps*sigma))^0.25', tex: 'T = \\left[\\frac{S\\,(1-\\alpha)}{4\\,\\varepsilon\\,\\sigma}\\right]^{1/4}',
      vars: { T: { name: 'mean surface temperature', q: 'temperature', unit: '°C' }, S: { name: 'solar constant', q: 'intensity', unit: 'W/m²', value: 1361 }, alpha: { name: 'albedo', value: 0.3, tex: '\\alpha', min: 0, max: 0.95 }, eps: { name: 'effective emissivity (the greenhouse effect)', value: 0.612, tex: '\\varepsilon', min: 0.3, max: 1, hint: '1 for no greenhouse effect (255 K = −18 °C); 0.612 reproduces the Earth\'s 15 °C.' }, sigma: { const: 'sigma', tex: '\\sigma' } },
      solveFor: 'T', note: 'The factor 4 is the ratio of the sphere\'s surface to its cross-section. A one-box model: the whole planet at one temperature.',
      stories: { T: 'A planet receives {S}, reflects {alpha} of it and radiates with an effective emissivity of {eps}. What is its mean temperature?' } },
    { name: 'Melting a thickness of ice', expr: 'h = F*t/(rhoI*Lf)', tex: 'h = \\frac{F\\,t}{\\rho_i L_f}',
      vars: { h: { name: 'thickness of ice melted', q: 'length', unit: 'm' }, F: { name: 'absorbed power', q: 'intensity', unit: 'W/m²', value: 100 }, t: { name: 'time', q: 'time', unit: 'day', value: 30 }, rhoI: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917, tex: '\\rho_i', fixed: true }, Lf: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55, tex: 'L_f', fixed: true } },
      solveFor: 'h', note: 'If all the absorbed heat goes into melting ice already at 0 °C; the rest of the heat balance (air, water below, thin ice conduction) is neglected.',
      stories: { h: 'Ice at its melting point absorbs {F} for {t}. How thick a layer melts?' } }
  ],
  examples: [
    { title: 'Seven tenths of the floes, or none', q: 'The sunshine on a patch of Arctic sea is 200 W/m². Compare the heat absorbed (a) when ice with a snow cover (albedo 0.85) covers 60 % of the sea, and (b) when the ice has melted away. The open water has an albedo of 0.06.',
      steps: ['(a) $\\alpha = 0.6 \\times 0.85 + 0.4 \\times 0.06 = 0.534$; absorbed $= 200 \\times (1 - 0.534) = 93$ W/m².', '(b) $\\alpha = 0.06$; absorbed $= 200 \\times 0.94 = 188$ W/m².', 'The loss of ice doubles the absorbed power. Over a day of continuous sun (86,400 s) the extra 95 W/m² adds 8.2 MJ to each square metre, enough to melt 2.5 cm of ice.'],
      a: '93 W/m² against 188 W/m²: twice as much. This doubling is the ice–albedo feedback in a single number.' },
    { title: 'Why one hundredth of albedo is a degree', q: 'At the Earth\'s present greenhouse strength (effective emissivity 0.612), how much does the mean surface temperature fall if the planetary albedo rises from 0.30 to 0.31?',
      steps: [{ text: 'The equilibrium temperature is $T = [S(1-\\alpha)/(4\\varepsilon\\sigma)]^{1/4}$. At $\\alpha = 0.30$:', tex: 'T = \\left[\\frac{1361 \\times 0.70}{4 \\times 0.612 \\times 5.67\\times10^{-8}}\\right]^{1/4} = 287.8\\ \\mathrm{K}' }, 'At $\\alpha = 0.31$: $T = 286.8$ K.', 'The drop is $1.0$ K: since $T \\propto (1-\\alpha)^{1/4}$, $\\Delta T/T = -\\tfrac14\\,\\Delta\\alpha/(1-\\alpha) = -0.36\\ \\%$.'],
      a: 'About 1 K. Because the albedo of the Earth is the product of its ice, clouds, land and sea, small changes in any of them matter.' },
    { title: 'How fast does the sun melt the ice?', q: 'Open ice floes absorb 100 W/m² for 30 days. If all of it went into melting ice at 0 °C, how thick a layer would go?',
      steps: [{ text: 'Energy per square metre: $100 \\times 30 \\times 86{,}400 = 2.6\\times10^{8}$ J. Latent heat per cubic metre of ice: $917 \\times 333{,}550 = 3.06\\times10^{8}$ J.', tex: 'h = \\frac{2.6\\times10^{8}}{3.06\\times10^{8}} = 0.85\\ \\mathrm{m}' }, 'Real thinning is slower, because part of the heat warms the water and is conducted away; but in the Arctic summer 0.5–1 m of surface melt is typical.'],
      a: 'About 0.85 m in a month. Melting a metre of ice costs as much heat as warming the same metre of water by 80 K.' }
  ],
  quiz: [
    { q: 'Open ocean absorbs about how many times more sunlight than fresh snow, in the same sunshine?', choices: ['The same', 'About twice', 'About six times', 'About sixty times'], a: 2, why: 'The open sea absorbs 94 % (albedo 0.06), fresh snow 10–20 % (albedo 0.8–0.9): a factor of five to nine.' },
    { q: 'Melting of floating sea ice raises the global sea level by', choices: ['a lot, as much as an ice sheet', 'a small, nearly negligible amount', 'lowers it substantially', 'none, because it is frozen fresh water'], a: 1, why: 'The floating ice already displaces its own weight of sea water..' },
    { q: 'In the ice–albedo feedback, a warming of the polar sea leads to', choices: ['more ice, because the sea is warmer', 'less ice, more absorbed sunlight, and more warming', 'less ice, but a cooler sea', 'no change in the sunlight absorbed'], a: 1, why: 'Less ice means a darker surface, more absorbed sunlight and more warming. A positive feedback amplifies the change that started it.' },
    { q: 'A simple planetary energy-balance model with an ice line can have both a warm and a frozen stable state for the same sunshine.', a: true, why: 'Where the ice cover depends on the temperature, a frozen planet reflects so much sunlight that it stays frozen, and a warm planet stays warm: two stable states, with hysteresis between them.' },
    { q: 'A planet receives 1,361 W/m² and has an effective emissivity of 0.612. By how many kelvin does its temperature change if its albedo rises from 0.30 to 0.31? (Give the size of the change.)', answer: 1.0, unit: 'K', why: 'T ∝ (1 − α)^(1/4): 287.8 K falls to 286.8 K, a change of 1.0 K.' }
  ],
  applications: ['Climate projection: the albedo feedback is built into models and tested against the satellite record of sea ice and snow.', 'Shipping and resources: a seasonally ice-free Arctic opens the Northern Sea Route and drilling to ships, and puts the coasts at the mercy of storms.', 'Ecology: polar bears, seals and the algae that live under the ice depend on its extent and timing.', 'Geoengineering proposals: brightening clouds or the sea ice, and the possible risks, rest on albedo arithmetic.'],
  history: 'Mikhail Budyko (Leningrad) and William Sellers (Arizona) published the first energy-balance models with ice albedo in 1969 and found their runaway to a frozen Earth. Joseph Kirschvink coined "Snowball Earth" in 1992; Paul Hoffman and colleagues\' 1998 *Science* paper gave the geological case from the Namibian carbonates. Continuous satellite records of the sea-ice extent began with the Nimbus-7 sensor in October 1978.',
  sources: ['NSIDC (National Snow and Ice Data Center), "Arctic Sea Ice News and Analysis" and the Sea Ice Index — extent and trends.', 'IPCC AR6 Working Group I (2021), chapters 7 and 9 — the surface-albedo feedback and the observed decline of Arctic sea ice.', 'Budyko, M. I., "The effect of solar radiation variations on the climate of the Earth", *Tellus* 21, 611 (1969); Sellers, W. D., "A global climatic model based on the energy balance of the earth–atmosphere system", *Journal of Applied Meteorology* 8, 392 (1969).', 'Hoffman, P. F., Kaufman, A. J., Halverson, G. P. and Schrag, D. P., "A Neoproterozoic Snowball Earth", *Science* 281, 1342 (1998).'],
  sim: 'cyc-ice-albedo'
},

/* ================================================================ the tides */
{
  id: 'the-tides', parent: 'the-water-cycle-and-climate', title: 'The tides', level: 2,
  short: 'The Moon pulls the near side of the Earth harder than the middle and the middle harder than the far side, stretching the sea into two bulges; the Earth turns under them, so there are two high tides every 12 h 25 min. The Sun adds 46 % as much, giving spring and neap tides, and basins can amplify it to 16 m in the Bay of Fundy.',
  keywords: ['tides', 'tidal bulge', 'spring tide', 'neap tide', 'Moon', 'high tide', 'low tide', 'tidal range', 'Bay of Fundy', 'tidal power', 'resonance', 'amphidromic', 'tidal friction', 'lunar day', 'differential gravity'],
  prereq: ['how-much-water-earth-has', 'physics:tides'],
  related: ['ocean-currents', 'oceans-as-a-heat-reservoir', 'the-water-cycle', 'tidal-heating', 'rivers-carve', 'europa', 'physics:tides', 'physics:planets'],
  body: `
Stand on a harbour wall for six hours and the sea falls and rises by a few metres; come back the next day and the high tide is about 50 minutes later. The tides are the oldest ocean clock, and the cause is the Moon — but not in the way "the Moon pulls the water up" suggests.

### Why two bulges
The Moon's gravity falls with distance. On the side of the Earth facing the Moon the pull is a little stronger than at the centre; on the far side, a little weaker. Measured against the Earth as a whole, which falls freely toward the Moon, the near water is pulled *towards* the Moon and the far water is left *behind*, away from it: two bulges on the line between the Earth and the Moon. The difference is small: the **tide-generating acceleration** is

$$a = \\frac{2\\,G\\,M\\,R}{d^3} = 1.1 \\times 10^{-6}\\ \\mathrm{m/s^2},$$

about a ten-millionth of $g$. Because it depends on $1/d^3$, the Sun — 27 million times the Moon's mass but 389 times farther away — produces only $27\\times10^6/389^3 = $ **46 %** as much as the Moon.

If the sea were a static layer on a smooth Earth, the lunar bulge would stand 0.36 m above the undisturbed level, 0.18 m of depression at the sides, a 0.54 m range from trough to crest; the Sun's bulge is 0.16 m. That is the **equilibrium tide**, and it is small.

### Why twelve hours twenty-five minutes
The Earth turns once in 24 hours under two bulges, so a place passes through two highs per day. But the Moon moves on in its orbit by about 12° a day in the direction in which the Earth rotates, so a place must turn another 50 minutes to face it again: the lunar day is 24 h 50 min and the interval between high tides 12 h 25 min.

### Spring and neap
At new moon and full moon, the Sun, Earth and Moon are in line, and the two bulges add: a **spring tide** (nothing to do with the season) of $1.5\\,(0.36 + 0.16) = 0.78$ m range. At the quarter moons, the bulges cross at a right angle: a **neap tide** with $1.5\\,(0.36 - 0.16) = 0.29$ m. The cycle repeats every 14.8 days, and the spring tide is 2.7 times the neap.

### Real tides are bigger, and different
The real tide is not a bulge that sits under the Moon. The bulge would have to travel round the globe at 1,670 km/h at the equator, but a long wave in the ocean, 4 km deep, moves at only about $\\sqrt{g h} = 200$ m/s = 720 km/h. The ocean cannot keep up, so each basin responds as a rotating, sloshing wave pushed at 12.4 hours, with points (amphidromic points) where the tide does not rise at all. Where a shelf or a bay has a natural period close to 12.4 hours, it resonates: the Bay of Fundy and the Gulf of Maine have a period of about 13 hours, and the range at Burntcoat Head reaches **16 m**, the highest in the world; over 100 billion tonnes of water move in and out with each tide. The Mediterranean, nearly closed and short, has a range of 0.3 m.

### Energy
Tidal friction dissipates about 3.7 TW (the Moon's tide in the shallow seas and the deep-ocean mixing it supports), slowing the Earth's spin — the day lengthens by about 2 milliseconds a century — and pushing the Moon away by 3.8 cm a year. The same effect heats worlds that have no ocean to move: see [[tidal-heating]]. A barrage that traps the high tide behind a dam and releases it through turbines can use a fraction of the energy: La Rance in France (240 MW, 1966) and Sihwa in Korea (254 MW, 2011).

> [!key] The Moon's differential pull stretches the sea into two bulges; the Earth turns under them every 24 h 50 min, so there are two high tides each 12 h 25 min. The Sun adds 46 % as much, which makes spring tides (aligned) and neap tides (at right angles), and basin resonance can raise the open-ocean tide of half a metre to 16 m.`,
  ideas: ['The tide-generating force is the Moon\'s gravity at one place minus its value at the Earth\'s centre: 1.1 × 10⁻⁶ m/s², stretching the sea into two bulges.', 'The Sun\'s effect is 46 % of the Moon\'s: its mass is 27 million times greater but it is 389 times farther, and tides go as M/d³.', 'High tides come every 12 h 25 min because the Moon moves on 12° a day; spring tides (new and full moon) have 2.7 times the range of neap tides.', 'The open-ocean tide of half a metre is amplified by basins that resonate with the 12.4 h forcing: 16 m in the Bay of Fundy.'],
  pitfalls: ['"The Moon pulls the water up into a bulge on the side facing it" — That explains one bulge. The far-side bulge arises because the Earth\'s centre is pulled more than the far water, which is left behind.', '"Spring tides happen in spring" — They happen twice a month at new and full moon, in every season.', '"The tidal bulges stay under the Moon while the Earth turns beneath" — The deep oceans cannot respond that fast; the real tide is a set of rotating waves in each basin.'],
  terms: [
    { term: 'Tidal force', also: ['tide-generating force', 'differential gravity'], def: 'The difference between the gravity of the Moon (or Sun) at a point on the Earth and at its centre. 2GMR/d³ along the line to the body: about 1.1 × 10⁻⁶ m/s² for the Moon.' },
    { term: 'Spring tide', also: ['spring tides'], def: 'The tide of largest range, at new and full moon when the lunar and solar bulges line up. Nothing to do with the season.' },
    { term: 'Neap tide', also: ['neap tides'], def: 'The tide of smallest range, at first and last quarter when the Moon\'s and the Sun\'s bulges are at right angles and partly cancel.' },
    { term: 'Tidal range', also: ['tidal amplitude'], def: 'The difference in height between consecutive high and low water: 0.5–1 m in the open ocean, 16 m at the head of the Bay of Fundy.' },
    { term: 'Amphidromic point', also: ['tidal node'], def: 'A point in a basin around which the tide wave rotates and where the tidal range is zero. The North Sea has three.' },
    { term: 'Lunar day', also: ['tidal day'], def: 'The time between successive passages of the Moon over a given meridian: 24 h 50 min, 50 minutes longer than the solar day because the Moon moves on in its orbit.' }
  ],
  formulas: [
    { name: 'Tide-generating acceleration', expr: 'a = 2*G*M*R/d^3', tex: 'a = \\frac{2\\,G\\,M\\,R}{d^3}',
      vars: { a: { name: 'tidal acceleration', q: 'accel', unit: 'm/s²', hint: '1.1 × 10⁻⁶ m/s² for the Moon, 0.5 × 10⁻⁶ for the Sun.' }, G: { const: 'G' }, M: { name: 'mass of the Moon (or Sun)', q: 'mass', unit: 'kg', value: 7.342e22 }, R: { name: 'radius of the Earth', q: 'length', unit: 'm', value: 6.371e6, fixed: true }, d: { name: 'distance to the body', q: 'length', unit: 'm', value: 3.844e8, hint: '3.844 × 10⁸ m for the Moon; 1.496 × 10¹¹ m for the Sun.' } },
      solveFor: 'a', note: 'On the line to the body, at the Earth\'s surface. Half this value, and of opposite sign, at 90° to it.',
      stories: { a: 'A body of mass {M} lies {d} from the Earth. What is the tidal acceleration at the Earth\'s surface?' } },
    { name: 'The equilibrium tide', expr: 'h = M/Me*(R/d)^3*R', tex: 'h = \\frac{M}{M_E}\\left(\\frac{R}{d}\\right)^3 R',
      vars: { h: { name: 'height of the bulge', q: 'length', unit: 'm', hint: '0.36 m for the Moon, 0.16 m for the Sun.' }, M: { name: 'mass of the body', q: 'mass', unit: 'kg', value: 7.342e22 }, Me: { const: 'Mearth', tex: 'M_E' }, R: { name: 'radius of the Earth', q: 'length', unit: 'm', value: 6.371e6, fixed: true }, d: { name: 'distance', q: 'length', unit: 'm', value: 3.844e8 } },
      solveFor: 'h', note: 'The height by which the sea in a static bulge rises, on the line to the body, above the undisturbed level; the trough is half as deep.',
      stories: { h: 'A body of mass {M} at {d}. How high is the equilibrium bulge it raises on the Earth\'s sea?' } },
    { name: 'The Sun\'s tide compared with the Moon\'s', expr: 'r = (Ms/Mm)*(dm/ds)^3', tex: 'r = \\frac{M_S}{M_M}\\left(\\frac{d_M}{d_S}\\right)^3',
      vars: { r: { name: 'Sun\'s tide ÷ Moon\'s tide', q: 'ratio', unit: '%' }, Ms: { name: 'mass of the Sun', q: 'mass', unit: 'kg', value: 1.989e30, tex: 'M_S' }, Mm: { name: 'mass of the Moon', q: 'mass', unit: 'kg', value: 7.342e22, tex: 'M_M' }, dm: { name: 'distance to the Moon', q: 'length', unit: 'm', value: 3.844e8, tex: 'd_M' }, ds: { name: 'distance to the Sun', q: 'length', unit: 'm', value: 1.496e11, tex: 'd_S' } },
      solveFor: 'r', note: '46 %: the Sun is vastly more massive, but tides fall as the cube of the distance.',
      stories: { r: 'The Sun has {Ms} and is {ds} away; the Moon has {Mm} and is {dm} away. What is the ratio of the tides?' } },
    { name: 'Time between high tides', expr: 'P = 1/(2*(1/Td - 1/Ts))', tex: 'P = \\frac{1}{2\\left(1/T_d - 1/T_s\\right)}',
      vars: { P: { name: 'interval between high tides', q: 'time', unit: 'h' }, Td: { name: 'solar day', q: 'time', unit: 'day', value: 1, tex: 'T_d', fixed: true }, Ts: { name: 'synodic month (new moon to new moon)', q: 'time', unit: 'day', value: 29.53, tex: 'T_s', fixed: true } },
      solveFor: 'P', note: 'The Earth must turn through 360° relative to the Moon; there are two highs in a lunar day. Gives 12.42 h = 12 h 25 min.',
      stories: { P: 'A solar day is {Td} and the Moon returns to the same phase every {Ts}. How long between successive high tides?' } },
    { name: 'The energy of a tide trapped behind a barrage', expr: 'E = rho*g*A*Rg^2/2', tex: 'E = \\tfrac{1}{2}\\,\\rho\\,g\\,A\\,R^2',
      vars: { E: { name: 'energy per tide, at best', q: 'energy', unit: 'J' }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, g: { const: 'g' }, A: { name: 'area of the basin', q: 'area', unit: 'km²', value: 10 }, Rg: { name: 'tidal range', q: 'length', unit: 'm', value: 8, tex: 'R' } },
      solveFor: 'E', note: 'The centre of mass of the stored water drops by R/2 as the basin empties from high to low tide; in practice a quarter to a half of this is recovered.',
      stories: { E: 'A basin of {A} has a tidal range of {Rg}. How much energy can a barrage extract, at most, from one tide?' } }
  ],
  examples: [
    { title: 'Spring and neap in the open ocean', q: 'Using the equilibrium bulges of 0.36 m (Moon) and 0.16 m (Sun), find the range of the tide at springs and at neaps.',
      steps: ['The range from trough to crest of one body is $1.5\\times$ its bulge height (the crest is the bulge $h$, the trough is $-h/2$).', 'Springs (aligned): $1.5 \\times (0.36 + 0.16) = 0.78$ m.', 'Neaps (at right angles): $1.5 \\times (0.36 - 0.16) = 0.30$ m.'],
      a: 'Spring range 0.78 m, neap 0.30 m (the ratio 2.7). With a basin amplification of 20, springs would reach 15–16 m.' },
    { title: 'Why the tide comes 50 minutes later each day', q: 'The Moon orbits the Earth in the same direction as the Earth spins, once every 27.3 days (relative to the stars). By how much does the lunar day exceed the solar day?',
      steps: ['In 24 h the Moon moves on in its orbit by $360°/29.53 = 12.2°$ relative to the Sun\'s direction (the synodic month is 29.53 days).', 'The Earth turns 15° per hour, so to catch up 12.2° takes $12.2/15 = 0.81$ h, about 50 minutes.', { text: 'Equivalently:', tex: 'T_{\\text{lunar day}} = \\frac{1}{1/T_d - 1/T_s} = \\frac{1}{1 - 1/29.53}\\ \\text{days} = 1.035\\ \\text{days} = 24\\ \\mathrm{h}\\ 50\\ \\mathrm{min}' }],
      a: '50 minutes longer, so high tides come 12 h 25 min apart and about 50 minutes later each day.' },
    { title: 'A tidal barrage', q: 'A basin of 10 km² has a tidal range of 8 m. What is the most energy a barrage can extract from one tide, and what mean power is that over 12.4 hours?',
      steps: [{ text: 'The energy:', tex: 'E = \\tfrac12 \\times 1025 \\times 9.81 \\times 10^{7} \\times 8^2 = 3.2\\times10^{12}\\ \\mathrm{J}' }, 'That is 0.9 GWh per tide, or 1.8 GWh a day for two tides.', 'Over 12.4 h (44,700 s): $3.2\\times10^{12}/44{,}700 = 72$ MW.', 'A real barrage recovers a quarter to a half of this.'],
      a: 'Up to 3.2 TJ per tide: 72 MW averaged over the cycle, 20–35 MW in practice. La Rance, with a basin of 22 km² and a mean range of 8 m, is rated at 240 MW at the peak flow.' }
  ],
  quiz: [
    { q: 'There are two high tides a day because', choices: ['the Moon orbits twice a day', 'the water bulges both towards and away from the Moon', 'the Sun and Moon pull in turn', 'the Earth\'s rotation makes the water slosh'], a: 1, why: 'The near water is pulled more than the Earth\'s centre and the far water less, so there are bulges on both sides of the Earth along the line to the Moon; the Earth turns once a day under both.' },
    { q: 'The Sun is much more massive than the Moon but raises smaller tides because', choices: ['its gravity is weaker at the Earth', 'tides depend on the cube of the distance', 'its light cancels the pull', 'the tides are caused by the Moon\'s magnetism'], a: 1, why: 'The tide-generating effect goes as M/d³: the Sun\'s mass is 27 million times larger but its distance is 389 times larger, so the ratio is 27 × 10⁶ / 389³ = 0.46.' },
    { q: 'Spring tides occur', choices: ['in the spring', 'at new and full moon', 'at first and last quarter', 'when the Moon is nearest the Earth only'], a: 1, why: 'When the Sun, Earth and Moon are in line the two bulges add. At first and last quarter the Sun\'s and Moon\'s bulges are at right angles and the tide is a neap.' },
    { q: 'The tide at a port is observed to be about 50 minutes later each day because the Moon moves on in its orbit.', a: true, why: 'The Moon orbits eastwards at about 12–13° a day, so the Earth must turn that much extra, about 50 minutes, to bring a place back under it.' },
    { q: 'A tidal basin has an area of 4 km² and a tidal range of 6 m. The maximum energy per tide is ½ρgAR² (ρ = 1025 kg/m³). How many GJ is that?', answer: 724, unit: 'GJ', tol: 0.03, why: '½ × 1025 × 9.81 × 4 × 10⁶ × 36 = 7.24 × 10¹¹ J = 724 GJ, about 200 MWh.' }
  ],
  applications: ['Navigation and ports: tide tables, predicted from harmonic analysis of a place\'s past record, decide when a ship can enter a harbour.', 'Coastal flooding: a "king tide" or a storm surge on top of a spring tide causes the highest water levels.', 'Tidal power: barrages (La Rance, Sihwa) and stream turbines in tidal channels (MeyGen in Scotland) give predictable renewable power.', 'Intertidal ecology: the cycle of wetting and drying shapes the zones of seaweed, barnacles and shorebirds.'],
  history: 'Seleucus of Seleucia argued in the 2nd century BC that tides come from the Moon, and Bede (8th century) knew the 50-minute delay and the spring–neap cycle. Newton explained them in the *Principia* (1687) as the Moon\'s and Sun\'s attraction. Laplace (1775) first treated the oceans\' dynamic response, and Kelvin devised the tide-predicting machine (1872) that summed the harmonic constituents by cranks and pulleys.',
  sources: ['Pugh, D. and Woodworth, P., *Sea-Level Science: Understanding Tides, Surges, Tsunamis and Mean Sea-Level Changes* (Cambridge University Press, 2014).', 'Egbert, G. D. and Ray, R. D., "Significant dissipation of tidal energy in the deep ocean inferred from satellite altimeter data", *Nature* 405, 775 (2000) — the 3.7 TW.', 'Garrett, C., "Tidal resonance in the Bay of Fundy and Gulf of Maine", *Nature* 238, 441 (1972).', 'NOAA, "Tides and water levels" and the Fisheries and Oceans Canada tide tables — the ranges quoted.'],
  sim: 'cyc-tides'
},

/* ================================================================ rivers and groundwater */
{
  id: 'rivers-and-groundwater', parent: 'the-water-cycle-and-climate', title: 'Rivers and groundwater', level: 2,
  short: 'The Amazon discharges 209,000 cubic metres a second, about a sixth to a fifth of all the water the world\'s rivers deliver to the sea. Underground lies a hundred times more fresh liquid water, moving at centimetres a day by Darcy\'s law, and in many aquifers, such as the Ogallala, the wells now take out water faster than rain puts it back.',
  keywords: ['river', 'discharge', 'Amazon', 'groundwater', 'aquifer', 'Darcy', 'hydraulic conductivity', 'water table', 'Ogallala', 'Nubian', 'depletion', 'fossil water', 'recharge', 'base flow', 'subsidence', 'GRACE', 'wells'],
  prereq: ['the-water-cycle', 'how-much-water-earth-has', 'hydraulics:groundwater-darcy'],
  related: ['rivers-carve', 'weathering-and-caves', 'gases-in-water', 'the-salt-of-the-sea', 'glaciers-flow', 'viscosity-of-water', 'hydraulics:water-resources', 'hydraulics:water-supply', 'biology:climate-ecosystems'],
  body: `
Water that falls on land has two ways to the sea: over the surface and under it. The first is the **river**, the visible part of the cycle: the 40,000 km³ a year that land returns to the sea, 1.3 million cubic metres a second. At any moment the channels hold only 2,120 km³, so the water in a river turns over in about 19 days. The flow is very unevenly distributed.

| River | Mean discharge, m³/s |
|---|---|
| Amazon | 209,000 |
| Congo | 41,000 |
| Ganges–Brahmaputra | 38,000 |
| Yangtze | 31,000 |
| Mississippi | 17,000 |
| Nile (before the dams) | 2,800 |
| Thames | 66 |

The **Amazon** alone puts 6,600 km³ into the Atlantic each year — about a sixth of the world's total discharge by the figure above (a fifth by some counts) — and its fresh plume can be followed hundreds of kilometres out to sea. It drains 6.1 million km², and 1.07 m of water a year passes to the sea per square metre of its basin, about half the 2.2 m of rain that falls on it; the rest is returned to the air by the forest.

### The hidden water
Beneath the soil, fresh liquid water fills the pores of sand, gravel and fractured rock. The top of the saturated zone is the **water table**; a rock that holds usable water and yields it to wells is an **aquifer**. The volume is 10.5 million km³ of fresh groundwater, more than a hundred times the lakes and rivers, and it supplies about half of the world's drinking water and some two-fifths of its irrigation. A well taps it; a spring, or the "base flow" of a river in a dry spell, is it coming out.

Water moves through the pores slowly. In 1856 Henry Darcy, an engineer in Dijon building the town's fountains, passed water through sand columns and found that the flow is proportional to the **head difference** and inversely to the length:

$$Q = K\\,A\\,\\frac{\\Delta h}{L}$$

$K$ is the **hydraulic conductivity**, a property of the rock and the water: about $10^{-2}$ to $1$ m/s for clean gravel, $10^{-5}$ to $10^{-3}$ m/s for sand, $10^{-9}$ to $10^{-5}$ for silt and less than $10^{-9}$ m/s for clay. In a sand with $K = 10^{-4}$ m/s and a slope of the water table of 0.002, the Darcy flux is $2\\times10^{-7}$ m/s, 17 mm a day; the water itself, travelling in the pores only (30 % of the volume), moves at about 60 mm/day, 21 m a year. Groundwater moves at roughly the pace of a glacier: a drop that entered the water table 1 km away is 50 years from reaching the stream.

### Mining the aquifers
Recharge, the rain that soaks through, is slow, from a few mm a year in dry lands to a few hundred in wet ones. Wells can take out far more. In the **Ogallala** (High Plains) aquifer, under about 450,000 km² of the American plains from South Dakota to Texas, irrigation raised the yield of the land and the water table fell by more than 30 m in parts of Kansas and Texas; by 2015 the USGS estimated that about a tenth of the water (some 330 km³) had gone. Natural recharge in the south is a few millimetres a year, so refilling would take thousands of years. The Nubian aquifer under Libya, Egypt, Chad and Sudan holds enormous volumes (tens of thousands of km³) of *fossil* water that fell as rain when the Sahara was green, more than 10,000 years ago, and is hardly refilled at all.

Satellites now measure it. The GRACE mission sees the Earth's gravity change as water is lost; Rodell and colleagues (2009) found northwestern India losing groundwater at about 18 km³ a year, more than the rainfall could replace. Falling water tables also lower the ground (Mexico City has sunk some 10 m), pull salt water into coastal wells, and dry up the springs that feed rivers.

> [!key] Rivers carry 40,000 km³ a year to the sea (the Amazon, 209,000 m³/s, about a sixth of it), but the larger share of fresh liquid water is underground, where it creeps at centimetres a day by Darcy's law. Where pumping exceeds recharge, as in the Ogallala and Nubian aquifers, the water is being mined from a store that took thousands of years to fill.`,
  ideas: ['Rivers carry about 40,000 km³ a year (1.3 million m³/s) to the sea; the Amazon alone discharges 209,000 m³/s, about a sixth to a fifth of it.', 'Fresh groundwater, 10.5 million km³, is over a hundred times the water in lakes and rivers; it supplies about half the world\'s drinking water.', 'Darcy\'s law: the flux through a porous medium is the hydraulic conductivity times the head gradient, a few millimetres to metres a day in sand.', 'Where wells take out more than recharge supplies, the aquifer is mined: the Ogallala has lost about a tenth of its water; the Nubian aquifer holds fossil water.'],
  pitfalls: ['"Groundwater flows in underground rivers" — Except in limestone caves, water moves slowly through the pores of the rock, at millimetres to metres a day.', '"Aquifers are underground lakes" — Most are saturated sand, gravel or fractured rock: the water fills only the pores (10–30 % of the volume), and a well yields only the part that drains (the specific yield).', '"Groundwater is renewable, so pumping it is sustainable" — Only if the pumping stays below the recharge. In the Ogallala and in northwest India, the water is renewed on timescales of millennia and is taken in decades.'],
  terms: [
    { term: 'Aquifer', also: ['water-bearing formation'], def: 'A body of rock or sediment that holds water in its pores and can yield useful amounts to wells and springs: sand and gravel, sandstone, fractured limestone.' },
    { term: 'Water table', also: ['phreatic surface'], def: 'The upper surface of the saturated zone underground, where the water pressure equals the atmospheric pressure. Wells that go below it fill with water to that level.' },
    { term: 'Hydraulic conductivity', also: ['K', 'permeability (loosely)'], def: 'A measure of how easily water moves through a porous medium: the Darcy flux per unit head gradient, in m/s. About 10⁻⁴ m/s for sand and below 10⁻⁹ m/s for clay.' },
    { term: 'Darcy\'s law', also: ['Darcy flux'], def: 'The flow through a porous medium is proportional to its cross-sectional area, to the hydraulic conductivity and to the head gradient: Q = K A Δh/L. Found by Henry Darcy in 1856.' },
    { term: 'Recharge', also: ['groundwater recharge'], def: 'The water that passes down through the soil to join the water table, from rain, rivers and irrigation. The rate at which an aquifer is replenished, in mm a year.' },
    { term: 'Fossil water', also: ['paleowater'], def: 'Groundwater that entered an aquifer thousands to millions of years ago under a different climate and is hardly renewed today; it is mined, not harvested.' }
  ],
  formulas: [
    { name: 'The discharge of a river', expr: 'Q = w*d*v', tex: 'Q = w\\,d\\,v',
      vars: { Q: { name: 'discharge', q: 'flowrate', unit: 'm³/s' }, w: { name: 'width of the channel', q: 'length', unit: 'm', value: 1000, hint: 'The lower Amazon is several kilometres wide.' }, d: { name: 'mean depth', q: 'length', unit: 'm', value: 20 }, v: { name: 'mean speed', q: 'speed', unit: 'm/s', value: 1.5 } },
      solveFor: 'Q', note: 'Cross-section times mean velocity; the speed is slowest at the bed and banks and fastest near the surface in the middle.',
      stories: { Q: 'A river {w} wide and {d} deep flows at {v}. What is its discharge?' } },
    { name: 'Darcy\'s law', expr: 'Q = K*A*dh/L', tex: 'Q = K\\,A\\,\\frac{\\Delta h}{L}',
      vars: { Q: { name: 'flow through the medium', q: 'flowrate', unit: 'm³/s' }, K: { name: 'hydraulic conductivity', q: 'speed', unit: 'm/s', value: 1e-4, hint: '10⁻⁴ m/s for clean sand; 10⁻⁹ and below for clay; 10⁻² to 1 for gravel.' }, A: { name: 'cross-sectional area', q: 'area', unit: 'm²', value: 1e5, hint: 'An aquifer 100 m thick and 1 km wide has 10⁵ m².' }, dh: { name: 'drop in head', q: 'length', unit: 'm', value: 2, tex: '\\Delta h' }, L: { name: 'distance', q: 'length', unit: 'm', value: 1000 } },
      solveFor: 'Q', note: 'Valid for slow, laminar flow in a saturated medium. The ratio Δh/L is the hydraulic gradient (here 0.002).',
      stories: { Q: 'Water flows through {A} of sand of conductivity {K} with a head drop of {dh} over {L}. How much flows?' } },
    { name: 'How fast the water really moves', expr: 'vp = K*i/n', tex: 'v_p = \\frac{K\\,i}{n}',
      vars: { vp: { name: 'speed of the water in the pores', q: 'speed', unit: 'm/s', tex: 'v_p' }, K: { name: 'hydraulic conductivity', q: 'speed', unit: 'm/s', value: 1e-4 }, i: { name: 'hydraulic gradient', value: 0.002, min: 0, hint: 'The drop in head per unit distance: 2 m in 1 km is 0.002.' }, n: { name: 'porosity', q: 'ratio', unit: '%', value: 30, min: 1, max: 60, hint: 'The share of the volume that is pores: 25–40 % for sand and gravel.' } },
      solveFor: 'vp', note: 'The Darcy flux K·i is the flow per unit area of the whole medium; the water itself, confined to the pores, moves faster by a factor 1/n.',
      stories: { vp: 'A sand of conductivity {K} and porosity {n} has a head gradient of {i}. How fast does the water move through its pores?' } },
    { name: 'A river\'s runoff as a depth over its basin', expr: 'dr = Q*t/Ab', tex: 'd = \\frac{Q\\,t}{A_b}',
      vars: { dr: { name: 'depth of runoff', q: 'length', unit: 'mm', tex: 'd' }, Q: { name: 'mean discharge', q: 'flowrate', unit: 'm³/s', value: 209000 }, t: { name: 'time', q: 'time', unit: 'yr', value: 1 }, Ab: { name: 'area of the basin', q: 'area', unit: 'km²', value: 6.15e6, tex: 'A_b', hint: 'The Amazon basin: 6.15 million km².' } },
      solveFor: 'dr', note: 'The same as the "rainfall as a depth" of [[the-water-cycle]]. The Amazon returns about half the rain that falls on its basin.',
      stories: { dr: 'A river of mean discharge {Q} drains {Ab}. How deep a layer of runoff does that make in {t}?' } }
  ],
  examples: [
    { title: 'The Amazon in a year', q: 'The Amazon discharges 209,000 m³/s on average from a basin of 6.15 million km². How many km³ is that in a year, what share of the 40,000 km³ of all rivers, and what depth of runoff over the basin?',
      steps: ['One year is $3.156\\times10^7$ s, so the volume is $209{,}000 \\times 3.156\\times10^7 = 6.6\\times10^{12}\\ \\mathrm{m^3} = 6{,}600\\ \\mathrm{km^3}$.', 'Share: $6{,}600/40{,}000 = 16.5\\ \\%$.', { text: 'Depth over the basin:', tex: 'd = \\frac{6.6\\times10^{12}\\ \\mathrm{m^3}}{6.15\\times10^{12}\\ \\mathrm{m^2}} = 1.07\\ \\mathrm{m}' }],
      a: '6,600 km³ a year: 16.5 % of the world\'s river discharge, and 1.07 m of runoff, about half of the 2.2 m of rain falling on the basin.' },
    { title: 'Darcy in a sand aquifer', q: 'An aquifer of sand has K = 10⁻⁴ m/s, porosity 30 %, and the water table drops 2 m over 1 km. Find the Darcy flux, the speed of the water in the pores, and the time to travel 1 km.',
      steps: ['Gradient: $i = 2/1000 = 0.002$.', 'Darcy flux: $q = K i = 10^{-4} \\times 0.002 = 2\\times10^{-7}\\ \\mathrm{m/s} = 17\\ \\mathrm{mm/day}$.', 'Pore speed: $v_p = q/n = 2\\times10^{-7}/0.3 = 6.7\\times10^{-7}$ m/s = 58 mm/day = 21 m a year.', 'Time to travel 1 km: $1000/21 = 47$ years.'],
      a: '17 mm/day of flux, water moving at 21 m a year, 47 years per kilometre: a drop in a sand aquifer takes about half a century to go 1 km.' },
    { title: 'How fast a pumped aquifer falls', q: 'Wells take 500 mm a year from a plain whose recharge is 20 mm a year. The aquifer\'s specific yield (the share of the volume that drains) is 0.15. How quickly does the water table fall, and how long until 100 m of saturated thickness is gone?',
      steps: ['Net loss: $500 - 20 = 480$ mm of water per year.', 'The water table falls by the net loss divided by the specific yield: $0.48/0.15 = 3.2$ m a year.', 'Time to lose 100 m: $100/3.2 = 31$ years (in practice the wells fail or the pumping slows sooner).'],
      a: 'The table falls about 3.2 m a year and 100 m is gone in about 30 years. The rate of refilling is 25 times smaller than that of emptying.' }
  ],
  quiz: [
    { q: 'About what share of the fresh liquid water on Earth is groundwater?', choices: ['About 1 %', 'About 10 %', 'About 50 %', 'Nearly all of it'], a: 3, why: 'Fresh groundwater is 10.5 million km³, against 91,000 km³ in lakes and 2,120 km³ in rivers: more than 99 % of the fresh liquid water that is not frozen.' },
    { q: 'In Darcy\'s law, doubling the hydraulic gradient (with K and A fixed)', choices: ['halves the flow', 'leaves the flow unchanged', 'doubles the flow', 'quadruples the flow'], a: 2, why: 'The flow Q = K A Δh/L is proportional to the gradient. This holds for slow, laminar flow in porous media.' },
    { q: 'The Nubian aquifer\'s water was mostly deposited by rain when the Sahara was green, so pumping it is mining a store that is barely replenished.', a: true, why: 'This is fossil water, thousands to tens of thousands of years old. Today\'s recharge is negligible against the volumes pumped.' },
    { q: 'Which has the highest hydraulic conductivity?', choices: ['Clay', 'Silt', 'Fine sand', 'Clean gravel'], a: 3, why: 'K is about 10⁻² to 1 m/s for gravel, 10⁻⁵ to 10⁻³ for sand, less than 10⁻⁹ for clay: coarse, well-connected pores let water through easily.' },
    { q: 'The Amazon discharges 209,000 m³/s. How many cubic kilometres is that in a year?', answer: 6600, unit: 'km³', tol: 0.03, why: '209,000 × 3.156 × 10⁷ s = 6.6 × 10¹² m³ = 6,600 km³.' }
  ],
  applications: ['Water supply: over a third of humanity relies on aquifers, from the wells of Bangladesh to the Great Man-Made River of Libya, which carries Nubian water to the coast.', 'Flood and drought forecasting: river gauges and satellite estimates of soil water and groundwater feed flood warnings.', 'Contamination: the slow flow of groundwater means a spill may take decades to reach a well and decades to clear.', 'Dams and deltas: reducing sediment and flow at river mouths lets deltas sink; Nile and Colorado deltas have retreated.'],
  history: 'Henry Darcy published his law in *Les fontaines publiques de la ville de Dijon* (1856), after designing the town\'s water supply with pressure from the springs of Rosoir, an early case of an engineer\'s experiment giving a law of physics. The Dupuit approximation for flow to a well followed in 1863. The scale of groundwater depletion became visible in 2002 when GRACE satellites began measuring the Earth\'s gravity field month by month.',
  sources: ['USGS Water Science School, "Groundwater" and "Streamflow"; USGS Scientific Investigations Report 2017-5040 (McGuire) on High Plains aquifer storage — the Ogallala figures.', 'Rodell, M., Velicogna, I. and Famiglietti, J. S., "Satellite-based estimates of groundwater depletion in India", *Nature* 460, 999 (2009).', 'Freeze, R. A. and Cherry, J. A., *Groundwater* (Prentice Hall, 1979), chapters 2 and 6 — Darcy\'s law and hydraulic conductivity.', 'Gleick, P. H., "Water resources" (1996), for the global river flow; Dai, A. and Trenberth, K. E. (2002), *Journal of Hydrometeorology* 3, 660, for the river discharge of the world\'s largest rivers.'],
  sim: 'cyc-aquifer'
}
);
