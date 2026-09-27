/* HYPER-BIOLOGY · content/ecology.js — the Ecology branch:
 *   ecosystems    ecosystems-intro, energy-flow, carbon-cycle, nitrogen-cycle, biomes
 *   populations   population-growth, predator-prey, competition-niches, community-succession, biodiversity
 *   conservation  conservation-biology, climate-ecosystems, invasive-species, ecosystem-services
 * Simulations in sims/ecology.js (ids eco-*). Figures that change with time are dated. */
Hyper.add(

/* ================================================================ ECOSYSTEMS */
{
  id: 'ecosystems-intro', parent: 'ecosystems', title: 'Ecosystems', level: 1,
  short: 'An ecosystem is a community of living things together with the non-living world they exchange energy and matter with. Energy flows through it once, from sunlight to heat; the atoms of life go round and round.',
  keywords: ['ecosystem', 'biotic', 'abiotic', 'producer', 'consumer', 'decomposer', 'detritivore', 'autotroph', 'heterotroph', 'primary productivity', 'GPP', 'NPP', 'net ecosystem production', 'turnover time', 'chemosynthesis', 'Tansley'],
  prereq: ['photosynthesis', 'metabolism-overview', 'physics:conservation-of-energy'],
  related: ['energy-flow', 'carbon-cycle', 'nitrogen-cycle', 'biomes', 'ecosystem-services', 'fungi', 'bacteria-archaea', 'physics:second-law-thermodynamics'],
  body: `
An **ecosystem** is everything living in a place together with the non-living world it depends on — light, water, air, rock and soil — treated as one working system. A pond is one; so is a beech wood, a coral reef, a rotting log or the rumen of a cow. The word was coined by the British ecologist Arthur Tansley in 1935 to insist that organisms cannot be understood apart from the physical processes around them. Ecologists nest their questions in levels: an **individual**, a **population** (all the individuals of one species in an area), a **community** (all the populations living together), the **ecosystem** (the community with its physical surroundings), the **biomes** — the great vegetation types of the world ([[biomes]]) — and the **biosphere**, the thin film of life around the planet.

### Producers, consumers and decomposers
Every ecosystem has the same three jobs to fill.
- **Producers** (autotrophs) make organic matter from carbon dioxide. Almost all use light — plants on land, algae and cyanobacteria in water — through [[photosynthesis]]. At deep-sea hydrothermal vents, chemosynthetic bacteria use the chemical energy of hydrogen sulfide instead, and whole communities of tube worms, clams and shrimps live on them.
- **Consumers** (heterotrophs) eat other organisms: herbivores eat producers, carnivores eat animals, omnivores both.
- **Decomposers and detritivores** — bacteria, [[fungi]], earthworms, woodlice — live on dead matter and return its nutrients to soil and water.

On land the decomposers get most of the food. Herbivores eat only about 5–10 % of the leaves a temperate forest grows each year (much more on grazed grassland); the rest falls as litter and, with the dead wood and roots, feeds a hidden food web in the soil.

### Energy flows, atoms cycle
Two rules organise the whole of ecology. **Energy flows through once**: sunlight is captured as chemical energy, passed along food chains, and every step ends as heat radiated to space — the [[physics:second-law-thermodynamics|second law of thermodynamics]] forbids using it twice. **Matter cycles**: the carbon, nitrogen and phosphorus atoms in your body have been in dinosaurs, bacteria and seawater, and will be again. Earth is open to energy but almost closed to matter, so every element life needs must be recycled — see [[carbon-cycle]] and [[nitrogen-cycle]].

### Primary productivity
The rate at which producers fix carbon is **gross primary production** (GPP). Plants burn part of it at once in their own respiration $R_a$ — typically about half. What remains, **net primary production** (NPP), is the new leaves, wood, roots and seeds: the food supply of everything else.

$$\\mathrm{NPP} = \\mathrm{GPP} - R_a$$

Land plants fix roughly 120–130 GtC a year as GPP and about 55–60 GtC as NPP; ocean phytoplankton add about 50 GtC of NPP, so the sea supplies nearly half the planet's primary production with well under 1 % of its plant biomass. Per square metre, productivity varies more than twentyfold:

| Ecosystem | NPP (g dry matter per m² per year) | Main limit |
|---|---|---|
| Coral reefs, kelp beds, estuaries | 1500–2500 | — |
| Tropical rainforest | about 2000 | nutrient-poor soils |
| Temperate forest | about 1200 | winter |
| Farmland | about 650 | varies with the crop |
| Temperate grassland | about 600 | water |
| Tundra | about 150 | cold, short summer |
| Open ocean | about 125 | nitrogen, phosphorus, iron |
| Desert | under 100 | water |

A gram of dry plant matter holds about 0.45 g of carbon and 18 kJ of energy. Over a year only about 1 % of the sunlight reaching a field ends up as NPP; the theoretical ceiling of photosynthesis is 4–6 %.

### Stocks and turnover
Dividing a stock by the flow through it gives its **turnover time**. A tropical forest holds about 45 kg of dry biomass per square metre and grows about 2 kg a year, so its carbon stays some twenty years. Ocean phytoplankton hold only a few grams per square metre but divide every day or two: the sea's plant biomass turns over in about a week. That is how the ocean feeds so much with so little standing crop — and why its biomass pyramid can stand on its head ([[energy-flow]]).

> [!fact] Biosphere 2, a sealed 1.3-hectare glasshouse in Arizona, tried to run a closed ecosystem with eight people inside from 1991 to 1993. Oxygen fell from 21 % to about 14.5 %, because microbes in the rich soil respired faster than the plants photosynthesised and much of the CO₂ reacted with the building's concrete. Oxygen had to be pumped in: running a biosphere is harder than it looks.
`,
  ideas: [
    'An ecosystem is a community of organisms plus its physical surroundings, working as one system.',
    'Producers fix carbon, consumers eat other organisms, decomposers recycle the dead — on land decomposers process most of the plant production.',
    'Energy flows through an ecosystem once and leaves as heat; chemical elements cycle.',
    'NPP = GPP − plant respiration is the food supply of every other organism; the oceans supply nearly half of the global total.',
    'Turnover time = stock ÷ flow: decades for forest wood, days for phytoplankton.'
  ],
  pitfalls: [
    'Plants get their mass from the soil — Almost all of a plant\'s dry mass is carbon, oxygen and hydrogen from CO₂ and water; the soil supplies only a few per cent as minerals.',
    'Energy is recycled in an ecosystem just like nutrients — Energy degrades to heat at every step and is radiated away; only matter goes round.',
    'A forest with a large biomass must be very productive — Biomass is a stock and productivity a flow. An old forest can hold enormous biomass while its net growth is close to zero; phytoplankton hold little biomass but grow fast.'
  ],
  formulas: [
    {
      name: 'Net primary production',
      expr: 'NPP = GPP - Ra', tex: '\\mathrm{NPP} = \\mathrm{GPP} - R_a',
      vars: {
        NPP: { name: 'net primary production (carbon)', q: false, unit: 'g/m²/yr', tex: '\\mathrm{NPP}' },
        GPP: { name: 'gross primary production (carbon)', q: false, unit: 'g/m²/yr', value: 1400, tex: '\\mathrm{GPP}' },
        Ra: { name: 'respiration by the plants themselves', q: false, unit: 'g/m²/yr', value: 750, tex: 'R_a' }
      },
      note: 'Carbon per square metre of ground per year. Plants typically respire 40–60 % of what they fix; the ratio NPP/GPP is the carbon use efficiency.',
      stories: {
        NPP: 'A temperate forest fixes {GPP} of carbon and its trees respire {Ra}. What is its net primary production?',
        Ra: 'A grassland has a GPP of {GPP} and an NPP of {NPP}. How much do the plants respire?'
      }
    },
    {
      name: 'Net ecosystem production: sink or source?',
      expr: 'NEP = NPP - Rh', tex: '\\mathrm{NEP} = \\mathrm{NPP} - R_h',
      vars: {
        NEP: { name: 'net ecosystem production (carbon)', q: false, unit: 'g/m²/yr', signed: true, tex: '\\mathrm{NEP}' },
        NPP: { name: 'net primary production (carbon)', q: false, unit: 'g/m²/yr', value: 650, tex: '\\mathrm{NPP}' },
        Rh: { name: 'respiration by animals, fungi and microbes', q: false, unit: 'g/m²/yr', value: 550, tex: 'R_h' }
      },
      note: 'Positive NEP means the ecosystem is storing carbon (a sink); negative, that it is losing it (a source), as a drained peatland or a forest after fire does. 100 g/m² per year is 1 tonne per hectare.',
      stories: { NEP: 'A forest\'s NPP is {NPP}; the consumers and decomposers respire {Rh}. How much carbon does the forest store each year?' }
    },
    {
      name: 'Turnover time of a stock',
      expr: 'tau = B/P', tex: '\\tau = \\dfrac{B}{P}',
      vars: {
        tau: { name: 'turnover (residence) time', q: false, unit: 'yr', tex: '\\tau' },
        B: { name: 'standing biomass', q: false, unit: 'kg/m²', value: 45 },
        P: { name: 'production (the flow through the stock)', q: false, unit: 'kg/m²/yr', value: 2.2 }
      },
      note: 'Valid for a stock in steady state, where what flows in equals what flows out. The same division gives the residence time of carbon in the air or of water in a lake.',
      stories: {
        tau: 'A tropical forest holds {B} of dry biomass and produces {P}. How long does its carbon stay, on average?',
        P: 'Phytoplankton hold {B} and turn over every {tau}. What is their production?'
      }
    }
  ],
  examples: [
    {
      title: 'Is this forest a carbon sink?',
      q: 'A temperate forest has GPP = 1400 g C per m² per year. The trees respire 750, and the animals, fungi and soil microbes respire 550. Find NPP and the net carbon stored per hectare.',
      steps: [
        'NPP = 1400 − 750 = 650 g C per m² per year (a carbon use efficiency of 650/1400 = 46 %).',
        'NEP = NPP − $R_h$ = 650 − 550 = 100 g C per m² per year.',
        'A hectare is 10 000 m², so the forest stores 100 × 10 000 = 10⁶ g = 1 tonne of carbon per hectare per year — 3.7 t of CO₂.'
      ],
      a: 'NPP = 650 g C/m²/yr; the forest is a sink of about 1 t C per hectare per year.'
    },
    {
      title: 'Wood and plankton',
      q: 'Compare the turnover times of a tropical forest (45 kg/m² of biomass, NPP 2.2 kg/m²/yr) and open-ocean phytoplankton (3 g/m² of biomass, NPP 125 g/m²/yr).',
      steps: [
        'Forest: $\\tau = 45/2.2 \\approx 20$ years.',
        'Phytoplankton: $\\tau = 3/125 = 0.024$ years ≈ 9 days.',
        'The ocean\'s producers are replaced about 800 times faster, so a tiny standing crop supports a large production.'
      ],
      a: 'About 20 years for the forest against about 9 days for the plankton.'
    }
  ],
  quiz: [
    { q: 'Which statement is true of energy and matter in an ecosystem?', choices: ['Both cycle endlessly', 'Energy cycles; matter flows through once', 'Energy flows through once; matter cycles', 'Neither is conserved'], a: 2, why: 'Energy ends as heat radiated to space and cannot be reused; carbon, nitrogen and the other elements are recycled by decomposers and chemistry.' },
    { q: 'A grassland has GPP = 2000 and NPP = 900 g C per m² per year. What percentage of GPP do the plants respire?', answer: 55, unit: '%', why: 'Respiration = 2000 − 900 = 1100, and 1100/2000 = 55 %.' },
    { q: 'What happens to most of the net primary production of a temperate forest?', choices: ['It is eaten by herbivores', 'It dies and is broken down by decomposers', 'It is stored permanently in wood', 'It is washed away by rivers'], a: 1, why: 'Herbivores take only 5–10 % of the leaves; most leaves, wood and roots die and feed the soil\'s decomposer food web.' },
    { q: 'Communities at deep-sea hydrothermal vents are fed by…', choices: ['faint sunlight filtering down', 'chemosynthetic bacteria using the chemical energy of hydrogen sulfide', 'the heat of the vent water directly', 'only dead plankton sinking from above'], a: 1, why: 'Bacteria oxidise sulfide to fix carbon, much as plants use light; tube worms carry them inside their bodies. (The oxygen they use still comes from photosynthesis far above.)' },
    { q: 'The oceans hold well under 1 % of the Earth\'s plant biomass but produce nearly half of its net primary production.', a: true, why: 'Phytoplankton are tiny and short-lived but divide every day or two; a small stock with a fast turnover gives a large flow.' }
  ],
  problems: [
    { q: 'Land NPP is about 56 GtC per year over 1.49 × 10⁸ km² of land. What is the average NPP, in g C per m² per year?', answer: 376, unit: 'g/m²/yr', tol: 0.03, steps: ['56 GtC = 56 × 10¹⁵ g; 1.49 × 10⁸ km² = 1.49 × 10¹⁴ m².', '56 × 10¹⁵ / 1.49 × 10¹⁴ ≈ 376 g C per m² per year — about 840 g of dry matter.'] },
    { q: 'A lake holds 8 g/m² of phytoplankton that produce 200 g/m² a year. What is their turnover time in days?', answer: 14.6, unit: 'day', tol: 0.03, steps: ['$\\tau = 8/200 = 0.04$ years.', '0.04 × 365 = 14.6 days.'] }
  ],
  applications: [
    'Carbon accounting for forests, peatlands and farms: whether a landscape is a sink or a source is its net ecosystem production.',
    'Satellites estimate productivity worldwide from leaf greenness on land and chlorophyll colour in the sea.',
    'The potential catch of the world\'s fisheries is ultimately set by ocean primary production.',
    'Designing closed life-support systems for spacecraft and bases, where every element must be recycled.'
  ],
  history: 'Arthur Tansley coined "ecosystem" in 1935. In 1942 Raymond Lindeman, a young American ecologist, published his study of Cedar Bog Lake in Minnesota, treating the lake as a flow of energy between trophic levels; he died of liver disease before it appeared, aged 27, and the paper became one of the founding texts of ecosystem ecology. The brothers Eugene and Howard Odum made energy budgets the core of the field in the 1950s.',
  sim: 'eco-pyramid'
},

{
  id: 'energy-flow', parent: 'ecosystems', title: 'Energy flow and trophic levels', level: 2,
  short: 'Energy passes up food chains from plants to herbivores to carnivores, and at each step roughly nine-tenths of it is lost as heat. That is why food chains are short, top predators are rare, and pyramids of energy always narrow upwards.',
  keywords: ['trophic level', 'food chain', 'food web', 'ten per cent rule', 'transfer efficiency', 'ecological efficiency', 'assimilation efficiency', 'production efficiency', 'pyramid of energy', 'pyramid of biomass', 'pyramid of numbers', 'biomagnification', 'Lindeman', 'Silver Springs'],
  prereq: ['ecosystems-intro', 'atp-energy', 'physics:second-law-thermodynamics'],
  related: ['predator-prey', 'carbon-cycle', 'thermoregulation-animals', 'scaling-allometry', 'foraging', 'medicine:nutrition', 'physics:entropy'],
  body: `
Follow the energy in a meadow. Grass captures sunlight; a grasshopper eats the grass; a shrew eats the grasshopper; an owl eats the shrew. Each feeding step is a **trophic level**: producers are level 1, herbivores (primary consumers) level 2, the carnivores that eat them level 3, and so on. Real feeding relations branch and cross — the shrew also eats beetles and worms, the owl also takes mice — so ecologists draw **food webs**, of which each food chain is one thread. Decomposers feed on every level at once.

### Where the energy goes
Of the energy in the plants, only a small part becomes new animal tissue at the next level. Three losses stack up:
1. **Not eaten.** Much plant matter is never consumed — wood, roots, leaves that fall and rot. The fraction eaten is the *consumption efficiency*.
2. **Not absorbed.** Part of what is eaten passes out as faeces. About 20–50 % of plant food is assimilated — it is tough and full of cellulose — but about 80 % of meat (*assimilation efficiency*).
3. **Burnt.** Most of what is absorbed is respired to power movement, repair and, in birds and mammals, body heat. The part turned into growth and offspring is the *production efficiency*: about 1–3 % in birds and mammals, around 10 % in fish and up to 40 % in insects and other ectotherms that do not heat themselves ([[thermoregulation-animals]]).

Multiplied together these give the **trophic transfer efficiency** $\\varepsilon$: the production at one level divided by the production at the level below. It ranges from under 1 % to about 30 % and averages close to **10 %** in aquatic food webs — the "ten per cent rule". Everything else leaves as heat. After $n - 1$ steps,

$$E_n = E_1\\,\\varepsilon^{\\,n-1}$$

so with $\\varepsilon$ = 10 % a predator at level 4 lives on a thousandth of the plants' production. That is why big fierce animals are rare — a tiger needs tens of square kilometres of forest — and why food chains are short: three to five links, seldom more even in the sea.

### A measured example
In the 1950s Howard Odum measured the whole energy budget of Silver Springs, a clear spring-fed river in Florida, in kcal per m² per year: the plants fixed 20 810 (gross); herbivores assimilated 3368, carnivores 383 and top carnivores 21, while decomposers processed 5060. Carnivores got 11 % of what the herbivores took in, the top carnivores under 6 % of what the carnivores took in.

### Pyramids
Stacking the levels as bars gives an ecological pyramid.
- **Energy** (production per year) always narrows upwards: no level can pass on more than it receives.
- **Biomass** (the standing crop at one moment) usually narrows too, but can be **inverted**. In the English Channel about 4 g of phytoplankton per square metre was found supporting about 21 g of zooplankton and bottom animals: the algae divide daily and are eaten as fast as they grow, so a small, fast-turning stock feeds a larger, slower one.
- **Numbers** can be inverted as well: one oak tree feeds thousands of caterpillars, and each caterpillar may carry several parasitic wasp larvae.

### Consequences
- **Diet and land.** Feeding crops to animals loses most of their energy: in food calories, beef returns about 3 % of the feed, pork and chicken 10–12 %, eggs and milk 20–40 %. The average human diet sits at trophic level 2.2 — about where an anchovy feeds.
- **Biomagnification.** Persistent fat-soluble poisons are not burnt with the food; they stay and concentrate up the chain. In a Long Island estuary in the 1960s DDT rose from 0.00005 ppm in the water to 0.04 ppm in plankton, 0.2–2 ppm in fish and 4–75 ppm in fish-eating birds, whose eggshells thinned until they broke under the brooding parent. Methylmercury in tuna and swordfish is today's example ([[medicine:environmental-health]]).
- **Top-down control.** Energy flows up, but control can run down: removing a top predator can reshape the whole web below it ([[predator-prey]]).

> [!key] Roughly 10 % of the energy at one trophic level becomes production at the next; the rest is respired and lost as heat. Three steps leave a thousandth — so there are always far fewer foxes than rabbits.
`,
  ideas: [
    'Trophic levels: producers (1), herbivores (2), carnivores (3), top carnivores (4); real communities form food webs.',
    'Transfer efficiency = consumption × assimilation × production efficiency, typically 5–20 %, about 10 % on average.',
    'Energy at level n is E₁εⁿ⁻¹, so food chains are short and top predators rare.',
    'Pyramids of energy never invert; pyramids of biomass and numbers can.',
    'Persistent poisons that are not burnt become more concentrated at each level (biomagnification).'
  ],
  pitfalls: [
    'Ten per cent of the energy is "used" and 90 % passed on — The reverse: about 90 % is respired, left uneaten or excreted, and only about 10 % becomes production at the next level.',
    'The ten per cent rule is a law of nature — It is an average. Transfer efficiencies range from under 1 % (warm-blooded grazers on land) to 20–30 % (some aquatic chains with ectothermic consumers).',
    'A biomass pyramid shows how much energy each level gets — Biomass is a stock at one moment; a small stock that turns over quickly (phytoplankton) can feed a larger one. Only an energy (production) pyramid shows the flow.'
  ],
  formulas: [
    {
      name: 'Trophic transfer efficiency',
      expr: 'TE = P2/P1', tex: '\\varepsilon = \\dfrac{P_{n+1}}{P_n}',
      vars: {
        TE: { name: 'transfer efficiency', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        P2: { name: 'production (or assimilation) of the upper level', q: false, unit: 'kcal/m²/yr', value: 383, tex: 'P_{n+1}' },
        P1: { name: 'production (or assimilation) of the lower level', q: false, unit: 'kcal/m²/yr', value: 3368, tex: 'P_n' }
      },
      note: 'Measured as production, or as assimilation where that is what was recorded (as at Silver Springs).',
      stories: {
        TE: 'At Silver Springs the herbivores assimilated {P1} and the carnivores {P2}. What was the transfer efficiency?',
        P2: 'Zooplankton produce {P1}; the fish that eat them convert them with an efficiency of {TE}. What is the fish production?'
      }
    },
    {
      name: 'Energy reaching trophic level n',
      expr: 'En = E1*TE^(n - 1)', tex: 'E_n = E_1\\,\\varepsilon^{\\,n-1}',
      vars: {
        En: { name: 'production at level n', q: false, unit: 'kJ/m²/yr', tex: 'E_n' },
        E1: { name: 'net primary production (level 1)', q: false, unit: 'kJ/m²/yr', value: 20000, tex: 'E_1' },
        TE: { name: 'transfer efficiency per step', q: 'ratio', unit: '%', value: 10, min: 0.1, max: 100, tex: '\\varepsilon' },
        n: { name: 'trophic level', int: true, value: 4, min: 1, max: 12 }
      },
      note: 'Assumes the same efficiency at every step. Solve for n to find the highest level that still receives a given energy flow.',
      practice: { unknowns: ['En', 'E1', 'n'] },
      stories: {
        En: 'Producers make {E1}. With {TE} passed on at each step, how much reaches trophic level {n}?',
        E1: 'A top predator population at level {n} needs {En}. With a transfer efficiency of {TE}, what primary production must support it?',
        n: 'Producers make {E1}, the efficiency is {TE} per step, and a viable top-predator population needs at least {En}. How many trophic levels can the ecosystem support?'
      }
    },
    {
      name: 'Transfer efficiency from its three parts',
      expr: 'TE = CE*AE*PE', tex: '\\varepsilon = \\varepsilon_C\\,\\varepsilon_A\\,\\varepsilon_P',
      vars: {
        TE: { name: 'trophic transfer efficiency', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        CE: { name: 'consumption efficiency (fraction of the prey production eaten)', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: '\\varepsilon_C' },
        AE: { name: 'assimilation efficiency (fraction of food absorbed)', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: '\\varepsilon_A' },
        PE: { name: 'production efficiency (fraction of absorbed energy turned into growth)', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: '\\varepsilon_P' }
      },
      note: 'The default numbers suit zooplankton grazing on phytoplankton (about 11 %). For mammals grazing on land, try 30 %, 50 % and 3 %: under half a per cent.',
      stories: {
        TE: 'Zooplankton eat {CE} of the phytoplankton production, absorb {AE} of what they eat and turn {PE} of that into growth. What is the transfer efficiency?',
        PE: 'Grazers eat {CE} of the grass and absorb {AE} of it, and the overall transfer efficiency is {TE}. What is their production efficiency?'
      }
    }
  ],
  examples: [
    {
      title: 'Efficiencies at Silver Springs',
      q: 'Odum measured (kcal per m² per year) herbivores 3368, carnivores 383, top carnivores 21. Find the two transfer efficiencies.',
      steps: [
        'Herbivores → carnivores: 383/3368 = 0.114, about 11 %.',
        'Carnivores → top carnivores: 21/383 = 0.055, about 5.5 %.',
        'Both lie in the usual 5–20 % range; the top step is lower, as top predators are often warm-blooded and range widely.'
      ],
      a: 'About 11 % and 5.5 %.'
    },
    {
      title: 'A hectare of wheat: bread or beef?',
      q: 'A hectare of wheat yields about 3.5 t of grain at 14 kJ per gram. A person needs about 10 000 kJ a day. How many people can the hectare feed as bread, and as beef if the grain is fed to cattle (3 % returned as food)?',
      steps: [
        'Grain energy: 3.5 × 10⁶ g × 14 kJ/g = 4.9 × 10⁷ kJ a year.',
        'A person needs 10 000 × 365 = 3.65 × 10⁶ kJ a year, so the grain feeds 4.9 × 10⁷ / 3.65 × 10⁶ ≈ 13 people.',
        'As beef: 3 % of 4.9 × 10⁷ = 1.5 × 10⁶ kJ, enough for about 0.4 of a person.'
      ],
      a: 'About 13 people on bread, under half a person on beef — one trophic step costs a factor of about 30 here.'
    },
    {
      title: 'A tonne of plankton for a kilogram of tuna',
      q: 'Tuna feed at about trophic level 4 (phytoplankton → zooplankton → small fish → tuna). With a transfer efficiency of 10 % per step, how much phytoplankton production does 1 kg of tuna growth require? Treat the energy per kilogram as similar at every level.',
      steps: [
        'Solve $E_n = E_1\\varepsilon^{\\,n-1}$ for the base: $E_1 = E_4/\\varepsilon^3$.',
        '$E_1 = 1\\ \\mathrm{kg}/0.1^3 = 1000$ kg.',
        'At 15 % per step it would be about 300 kg; at 5 %, 8 tonnes — the answer is very sensitive to the efficiency, which is why fisheries scientists measure it.'
      ],
      a: 'About a tonne of phytoplankton for each kilogram of tuna.'
    }
  ],
  quiz: [
    { q: 'With a 10 % transfer efficiency at every step, what percentage of the primary production becomes production at trophic level 4?', answer: 0.1, unit: '%', why: 'Three steps: 0.1 × 0.1 × 0.1 = 0.001 = 0.1 %.' },
    { q: 'Why are food chains rarely longer than four or five links?', choices: ['Predators would starve because prey are too large', 'So little energy reaches the top that it cannot support a viable population', 'Evolution has not had enough time to make longer chains', 'Decomposers eat the top predators'], a: 1, why: 'Each step loses about 90 % of the energy; after four or five steps too little is left to support enough individuals to persist.' },
    { q: 'A pyramid of energy (production per year) can be inverted, with more at a higher level than below it.', a: false, why: 'A level cannot pass on more energy than it receives. Biomass and number pyramids can invert; energy pyramids cannot.' },
    { q: 'In the open ocean the zooplankton can weigh more than the phytoplankton they eat. Why?', choices: ['Zooplankton photosynthesise too', 'Phytoplankton reproduce so fast that a small standing crop has a large production', 'The measurements must be wrong', 'Zooplankton live on dissolved sugars'], a: 1, why: 'Biomass is a stock; production is a flow. Algae dividing daily and grazed as fast as they grow can feed a larger, longer-lived stock of grazers.' },
    { q: 'Which converts its food into body growth more efficiently: a lizard or a mouse of the same mass?', choices: ['The mouse, because it eats more', 'The lizard, because it does not burn food to keep warm', 'They are the same', 'The mouse, because mammals digest better'], a: 1, why: 'Endotherms spend most of their assimilated energy on heat: production efficiency 1–3 % against 10–40 % for ectotherms.' }
  ],
  problems: [
    { q: 'Primary production is 20 000 kJ per m² per year and the transfer efficiency is 15 % at each step. How much energy reaches level 5?', answer: 10.1, unit: 'kJ/m²/yr', tol: 0.02, steps: ['$E_5 = 20\\,000 \\times 0.15^4$.', '$0.15^4 = 5.06 \\times 10^{-4}$, so $E_5 \\approx 10.1$ kJ per m² per year — about 0.05 % of the primary production.'] },
    { q: 'Herbivores eat 30 % of the grass, assimilate 50 % of what they eat and turn 3 % of that into growth. What is the transfer efficiency, in per cent?', answer: 0.45, unit: '%', tol: 0.02, steps: ['$0.30 \\times 0.50 \\times 0.03 = 0.0045$.', 'That is 0.45 % — warm-blooded grazers on land are far below the 10 % average.'] }
  ],
  applications: [
    'Estimating how many fish the sea can yield, from primary production and the trophic level of the catch.',
    'Comparing the land and water needed for plant-based and animal-based diets.',
    'Tracking persistent pollutants (DDT, PCBs, mercury) that biomagnify, and setting advice on eating large predatory fish.',
    'Understanding why large carnivores need huge reserves to survive.'
  ],
  history: 'Charles Elton described food chains and the "pyramid of numbers" in 1927. Raymond Lindeman\'s 1942 paper on Cedar Bog Lake turned them into flows of energy with measurable efficiencies. Rachel Carson\'s Silent Spring (1962) made biomagnification of DDT a public issue; DDT was banned for farm use in the United States in 1972, and bald eagles and peregrine falcons recovered.',
  sim: 'eco-pyramid'
},

{
  id: 'carbon-cycle', parent: 'ecosystems', title: 'The carbon cycle', level: 2,
  short: 'Carbon moves between the air, living things, soils, the oceans and rocks. The natural flows are huge but balanced; humans now add about 11 GtC a year, of which roughly half stays in the air — raising CO₂ from 280 ppm before industry to about 421 ppm in 2023.',
  keywords: ['carbon cycle', 'reservoir', 'flux', 'GtC', 'Keeling curve', 'Mauna Loa', 'ppm', 'airborne fraction', 'carbon sink', 'biological pump', 'solubility pump', 'ocean acidification', 'residence time', 'fossil fuels', 'Global Carbon Budget', 'weathering'],
  prereq: ['ecosystems-intro', 'photosynthesis', 'metabolism-overview'],
  related: ['climate-ecosystems', 'nitrogen-cycle', 'biomes', 'ecosystem-services', 'chemistry:henrys-law', 'chemistry:ph-scale', 'chemistry:weak-acids', 'physics:radiocarbon-dating'],
  body: `
Carbon is the backbone of every organic molecule, and it moves continually between the air, living things, soils, the oceans and rocks. The cycle is described as **reservoirs** (stocks, in gigatonnes of carbon, GtC; 1 Gt = 10¹⁵ g) linked by **fluxes** (GtC per year).

| Reservoir | Carbon (GtC) | How long carbon stays |
|---|---|---|
| Atmosphere, as CO₂ | about 590 before 1750; about 890 in 2023 | a few years per molecule |
| Land plants | 450–650 | about a decade on average |
| Soils (top metre) | 1500–2400 | decades to millennia |
| Permafrost | 1400–1700 | millennia — while it stays frozen |
| Surface ocean | about 900 | about a decade |
| Intermediate and deep ocean | about 37 000 | centuries to a millennium |
| Fossil fuel reserves | 1000–2000 | millions of years, until burnt |
| Limestone and other sedimentary rocks | tens of millions | hundreds of millions of years |

### The fast cycle
Each year land plants take up about 120–140 GtC by [[photosynthesis]], and plant respiration, decomposers and fire return almost exactly as much. The ocean surface swaps about 80 GtC each way with the air. CO₂ dissolves where the water is cold and comes out where it is warm (the **solubility pump**, see [[chemistry:henrys-law]]), and phytoplankton fix carbon that partly sinks into the deep as dead cells and faecal pellets (the **biological pump**, about 10 GtC a year out of the sunlit layer). Before industry these great flows balanced to within a fraction of a gigatonne a year.

The **Keeling curve** shows the fast cycle breathing. Measurements on Mauna Loa, Hawaii, begun by Charles David Keeling in 1958 at about 315 ppm, fall and rise by about 6 ppm each year: the forests of the Northern Hemisphere, where most land lies, draw CO₂ down each summer and release it each winter.

### The slow cycle
Over hundreds of thousands of years, CO₂ dissolved in rain weathers silicate rocks; the calcium and bicarbonate wash to the sea, where shell-building organisms lock the carbon into limestone. Volcanoes return it — about 0.1 GtC a year, under 1 % of today's human emissions. Weathering speeds up when the climate is warm and wet, so this loop is the planet's long-term thermostat.

### The human perturbation
By 2023, burning fossil fuels and making cement released about **10 GtC a year** (37 billion tonnes of CO₂), and clearing forests about 1 GtC more (Global Carbon Budget 2023). Of the 2013–2022 average of about 11 GtC a year:
- about 48 % stayed in the **atmosphere** — the **airborne fraction**;
- about 26 % dissolved in the **ocean**, making it more acidic: surface pH has fallen by about 0.1 since pre-industrial times, roughly 30 % more hydrogen ions ([[chemistry:ph-scale]]);
- about 30 % was taken up on **land**, as plants grow faster in richer CO₂ and cleared forests regrow.

(The shares add to slightly more than 100 %; each is uncertain by several tenths of a gigatonne a year.) Atmospheric CO₂ has risen from about 280 ppm before 1750 to about 421 ppm, the 2023 annual mean at Mauna Loa — higher than at any time in the 800 000 years recorded in ice cores. Each ppm is 2.12 GtC, so the air has gained about 300 GtC. The proof that the extra carbon is fossil is chemical: fossil carbon has no ¹⁴C and is poor in ¹³C, and both isotopes in the air are falling as predicted ([[physics:radiocarbon-dating]]), while atmospheric oxygen declines in step with the burning.

### Why it lingers
A CO₂ molecule stays in the air only about four years before it is swapped into a leaf or the sea — but each swap sends another molecule back, so exchange does not remove the *excess*. That needs a net flow into the deep ocean, soils and rocks. After an emission, about half the excess is gone within a few decades, but 15–40 % is still in the air after a thousand years, and the last part waits on rock weathering for tens of millennia. Residence time and adjustment time are different clocks.

> [!key] Humans add about 11 GtC a year; roughly half stays in the air, a quarter goes into the ocean and a quarter into land plants and soils. The natural flows are ten times larger but balance; the human flow does not.
`,
  ideas: [
    'Carbon cycles between reservoirs — air, plants, soils, ocean, rocks — linked by fluxes measured in GtC per year.',
    'Photosynthesis and respiration swap over 100 GtC a year with the air, and the ocean about 80, but these flows balanced before industry.',
    'Humans emit about 11 GtC a year (fossil fuels and land use); about 45–50 % stays in the atmosphere, the rest goes into the ocean and land.',
    'One ppm of CO₂ is 2.12 GtC: 280 ppm before 1750, about 421 ppm in 2023.',
    'A molecule\'s residence time is a few years, but removing an excess takes centuries to millennia.'
  ],
  pitfalls: [
    'Volcanoes emit more CO₂ than people — Volcanoes release about 0.1 GtC a year; human activities release about 100 times as much.',
    'The ocean and forests will soak up whatever we emit — They take about half, and the share depends on the rate of emission; a warmer, more acidic ocean absorbs less, and forests can turn from sinks into sources through drought and fire.',
    'If emissions stopped, CO₂ would fall back within a decade because each molecule lasts only four years — Exchange swaps molecules without removing the excess; a large part of the extra CO₂ stays for centuries.'
  ],
  formulas: [
    {
      name: 'Carbon in the atmosphere',
      expr: 'M = k*C', tex: 'M = k\\,\\mathrm{[\\ce{CO2}]}',
      vars: {
        M: { name: 'carbon in the atmosphere', q: false, unit: 'GtC' },
        k: { name: 'carbon per ppm of CO₂', q: false, unit: 'GtC/ppm', value: 2.124, fixed: true },
        C: { name: 'CO₂ concentration (mole fraction in dry air)', q: false, unit: 'ppm', value: 421, tex: '\\mathrm{[\\ce{CO2}]}' }
      },
      note: 'The atmosphere holds about 1.77 × 10²⁰ mol of air, so 1 ppm of CO₂ is 1.77 × 10¹⁴ mol of carbon, 2.12 × 10¹⁵ g.',
      stories: {
        M: 'How much carbon does the atmosphere hold at a CO₂ concentration of {C}?',
        C: 'Before industry the atmosphere held about {M}. What was the CO₂ concentration?'
      }
    },
    {
      name: 'Yearly rise of CO₂ from emissions',
      expr: 'G = AF*E/k', tex: 'g = \\dfrac{f_A\\,E}{k}',
      vars: {
        G: { name: 'rise in CO₂ per year', q: false, unit: 'ppm/yr', tex: 'g' },
        AF: { name: 'airborne fraction', q: 'ratio', unit: '%', value: 45, min: 0, max: 100, tex: 'f_A' },
        E: { name: 'emissions (fossil fuels, cement and land use)', q: false, unit: 'GtC/yr', value: 11 },
        k: { name: 'carbon per ppm of CO₂', q: false, unit: 'GtC/ppm', value: 2.124, fixed: true }
      },
      note: 'The airborne fraction has averaged about 45 % since 1960, varying from year to year with El Niño and volcanic eruptions.',
      practice: { unknowns: ['G', 'AF', 'E'] },
      stories: {
        G: 'The world emits {E} and {AF} of it stays in the air. How fast does CO₂ rise?',
        AF: 'Emissions are {E} and CO₂ rises by {G}. What is the airborne fraction?'
      }
    },
    {
      name: 'Residence time of carbon in a reservoir',
      expr: 'tau = M/F', tex: '\\tau = \\dfrac{M}{F}',
      vars: {
        tau: { name: 'residence time', q: false, unit: 'yr', tex: '\\tau' },
        M: { name: 'carbon in the reservoir', q: false, unit: 'GtC', value: 890 },
        F: { name: 'gross flow out of the reservoir', q: false, unit: 'GtC/yr', value: 210 }
      },
      note: 'For the air, the gross outflow is photosynthesis (about 130 GtC a year) plus dissolution into the ocean (about 80). This is how long an average molecule stays — not how long an excess takes to disappear.',
      stories: { tau: 'The atmosphere holds {M} and loses {F} to plants and the ocean, while receiving as much back. How long does a CO₂ molecule stay, on average?' }
    },
    {
      name: 'Carbon and carbon dioxide',
      expr: 'mCO2 = mC*44/12', tex: 'm_{\\ce{CO2}} = \\dfrac{44}{12}\\,m_{\\ce{C}}',
      vars: {
        mCO2: { name: 'mass of carbon dioxide', q: 'mass', unit: 'kg', tex: 'm_{\\ce{CO2}}' },
        mC: { name: 'mass of carbon', q: 'mass', unit: 'kg', value: 0.65, tex: 'm_{\\ce{C}}' }
      },
      note: 'Molar masses 44 g/mol for CO₂ and 12 g/mol for carbon: 1 GtC is 3.67 Gt of CO₂.',
      stories: {
        mCO2: 'A litre of petrol contains about {mC} of carbon. How much CO₂ does burning it make?',
        mC: 'A country reports {mCO2} of CO₂ emissions. How much carbon is that?'
      }
    }
  ],
  examples: [
    {
      title: 'How much carbon has the air gained?',
      q: 'CO₂ was 280 ppm before 1750 and 421 ppm in 2023. How much carbon did the atmosphere hold at each date, and how much has it gained?',
      steps: [
        '$M = 2.124 \\times 280 = 595$ GtC before industry.',
        '$M = 2.124 \\times 421 = 894$ GtC in 2023.',
        'The gain is about 300 GtC — less than half the roughly 700 GtC emitted since 1850; the ocean and land took the rest.'
      ],
      a: 'About 595 GtC then, 894 GtC now: a gain of about 300 GtC.'
    },
    {
      title: 'The airborne fraction from two measurements',
      q: 'In 2013–2022 emissions averaged 10.9 GtC a year and CO₂ at Mauna Loa rose by about 2.45 ppm a year. What fraction of the emissions stayed in the air?',
      steps: [
        'Carbon added to the air: 2.45 × 2.124 = 5.2 GtC a year.',
        'Airborne fraction: 5.2/10.9 = 0.48.',
        'The other 52 % — about 5.7 GtC a year — went into the ocean and land sinks.'
      ],
      a: 'About 48 %.'
    },
    {
      title: 'A litre of petrol',
      q: 'Petrol has a density of about 0.745 kg per litre and is about 87 % carbon by mass. How much CO₂ does one litre make when burnt?',
      steps: [
        'Carbon: 0.745 × 0.87 = 0.648 kg.',
        'CO₂: 0.648 × 44/12 = 2.38 kg — more than the petrol itself weighed, because each carbon atom picks up two oxygen atoms from the air.'
      ],
      a: 'About 2.4 kg of CO₂ per litre.'
    }
  ],
  quiz: [
    { q: 'Which of these reservoirs holds the most carbon?', choices: ['The atmosphere', 'Land plants', 'Soils', 'The intermediate and deep ocean'], a: 3, why: 'About 37 000 GtC, mostly as dissolved bicarbonate — some forty times the atmosphere. Only sedimentary rocks hold more, and they exchange very slowly.' },
    { q: 'If 10 GtC are emitted in a year and 45 % stays in the air, by how many ppm does CO₂ rise?', answer: 2.12, unit: 'ppm', why: '10 × 0.45 = 4.5 GtC; 4.5/2.124 = 2.1 ppm.' },
    { q: 'Because a CO₂ molecule stays in the air for only about four years, the extra CO₂ would disappear within a decade if emissions stopped.', a: false, why: 'Exchange with plants and the ocean swaps molecules both ways. Removing the excess needs a net flow into the deep ocean and rocks, which takes centuries to millennia.' },
    { q: 'Why does CO₂ at Mauna Loa fall every northern summer?', choices: ['Cold water in the Pacific dissolves more CO₂ in summer', 'Northern Hemisphere vegetation photosynthesises more than it respires during the growing season', 'People burn less fuel in summer', 'Volcanic emissions pause in summer'], a: 1, why: 'Most land — and so most plants — is in the Northern Hemisphere. Its summer uptake and winter release make the yearly sawtooth.' },
    { q: 'Which observation shows that the extra CO₂ comes from fossil fuels?', choices: ['CO₂ rises faster near volcanoes', 'Atmospheric ¹⁴C and ¹³C fractions are falling, and oxygen is declining in step', 'The ocean is becoming less acidic', 'CO₂ is higher in the Southern Hemisphere'], a: 1, why: 'Fossil carbon is millions of years old, so it has no ¹⁴C, and being plant-derived it is poor in ¹³C; burning it also consumes oxygen. (CO₂ is slightly higher in the north, where most emissions are.)' }
  ],
  problems: [
    { q: 'World fossil emissions in 2023 were about 37 Gt of CO₂. How many gigatonnes of carbon is that?', answer: 10.1, unit: 'GtC', tol: 0.02, steps: ['$m_C = 37 \\times 12/44 = 10.1$ GtC.'] },
    { q: 'At 11 GtC a year with an airborne fraction of 47 %, how many years would it take CO₂ to rise another 100 ppm?', answer: 41, unit: 'yr', tol: 0.03, steps: ['Yearly rise: $0.47 \\times 11/2.124 = 2.43$ ppm.', '100/2.43 ≈ 41 years.'] }
  ],
  applications: [
    'Carbon budgets: how much more CO₂ can be emitted for a given limit on warming.',
    'Forest, soil and blue-carbon (mangrove, seagrass) projects that aim to store carbon.',
    'Monitoring ocean acidification and its effect on corals and shellfish.',
    'Radiocarbon dating, which relies on the ¹⁴C made in the atmosphere and taken up by living things.'
  ],
  history: 'Svante Arrhenius calculated in 1896 how much a doubling of CO₂ would warm the Earth. In 1957 Roger Revelle and Hans Suess showed that ocean chemistry buffers CO₂ so strongly that the sea would absorb emissions far more slowly than was assumed, and in 1958 Charles David Keeling began the Mauna Loa record, the longest continuous measurement of atmospheric CO₂.',
  sim: 'eco-carbon'
},

{
  id: 'nitrogen-cycle', parent: 'ecosystems', title: 'The nitrogen cycle', level: 2,
  short: 'Nitrogen gas makes up 78 % of the air but its triple bond makes it useless to most life until bacteria — or industry — fix it into ammonia. Microbes then turn ammonium into nitrate and eventually back into nitrogen gas. Since the Haber–Bosch process, humans have roughly doubled the flow of reactive nitrogen.',
  keywords: ['nitrogen cycle', 'nitrogen fixation', 'nitrogenase', 'Rhizobium', 'root nodules', 'leghaemoglobin', 'nitrification', 'denitrification', 'ammonification', 'anammox', 'Haber–Bosch', 'fertiliser', 'eutrophication', 'dead zone', 'nitrous oxide', 'nitrogen use efficiency'],
  prereq: ['ecosystems-intro', 'microbial-metabolism', 'chemistry:redox-reactions'],
  related: ['plant-nutrition', 'carbon-cycle', 'bacteria-archaea', 'amino-acids', 'enzymes', 'ecosystem-services', 'chemistry:catalysis', 'chemistry:le-chatelier'],
  body: `
Nitrogen makes up 78 % of the air, yet it is the nutrient that most often limits the growth of plants on land and of plankton in the sea. The paradox lies in the triple bond of the N₂ molecule ($\\ce{N#N}$, 945 kJ/mol), one of the strongest in chemistry: almost no organism can use nitrogen gas. Every amino acid and nucleotide needs nitrogen, so it must first be **fixed** — turned into ammonia — before life can use it.

### The steps of the cycle
| Process | What happens | Who does it |
|---|---|---|
| **Fixation** | $\\ce{N2 -> NH3}$, costing 16 ATP per N₂ | bacteria and archaea with nitrogenase: *Rhizobium* in legume root nodules, *Azotobacter* in soil, cyanobacteria; lightning adds a little |
| **Ammonification** | organic nitrogen in dead matter → $\\ce{NH4+}$ | decomposers |
| **Nitrification** | $\\ce{NH4+ -> NO2- -> NO3-}$, an oxidation that yields energy | *Nitrosomonas*, ammonia-oxidising archaea, then *Nitrobacter* |
| **Assimilation** | $\\ce{NH4+}$ and $\\ce{NO3-}$ built into amino acids | plants, algae, microbes |
| **Denitrification** | $\\ce{NO3- -> NO2- -> NO -> N2O -> N2}$ | bacteria in waterlogged soils and sediments, breathing nitrate instead of oxygen |
| **Anammox** | $\\ce{NH4+ + NO2- -> N2 + 2H2O}$ | bacteria in oxygen-poor water; up to half of the ocean's nitrogen loss |

Nitrogenase is destroyed by oxygen, so fixers guard it. Legume nodules are pink with **leghaemoglobin**, which holds oxygen at a low, steady level; cyanobacteria such as *Anabaena* fix nitrogen in thick-walled cells called heterocysts that make no oxygen. Nitrification and denitrification are [[chemistry:redox-reactions|redox reactions]]: nitrifiers live by oxidising ammonia with oxygen, while denitrifiers use nitrate as the electron acceptor when oxygen runs out, closing the loop by returning N₂ to the air.

### Haber–Bosch: doubling the cycle
Natural fixation on land and in the sea adds roughly 200 Tg of nitrogen a year (1 Tg = 10¹² g), and lightning about 5. In 1909 Fritz Haber combined nitrogen and hydrogen over an iron catalyst at about 200 bar and 450 °C, and by 1913 Carl Bosch had scaled it into an industry:

$$\\ce{N2 + 3H2 <=> 2NH3}$$

Haber–Bosch plants now make about 150 Tg of nitrogen a year as ammonia, mostly for fertiliser, using 1–2 % of the world's energy. With the nitrogen fixed by cultivated legumes and released by burning fuels, human activity now fixes about as much reactive nitrogen as all natural processes together. Roughly half of the people alive are fed by synthetic fertiliser.

### Where the extra nitrogen goes
Worldwide, crops take up only about 40–50 % of the nitrogen put on fields. The rest escapes:
- **Nitrate leaches** into rivers and groundwater and feeds algal blooms. When the algae die, bacteria decomposing them use up the oxygen, leaving **dead zones** — typically 10 000–20 000 km² of the Gulf of Mexico each summer, fed by the Mississippi.
- **Nitrous oxide** ($\\ce{N2O}$) from nitrification and denitrification is a greenhouse gas about 270 times stronger than CO₂ per kilogram over a century, and today's largest ozone-depleting emission.
- **Ammonia and nitrogen oxides** in the air form fine particles and acid rain, and fall as unwanted fertiliser on heaths and bogs, where fast-growing grasses crowd out the plants of poor soils.

> [!key] Nitrogen gas is plentiful but locked away; only fixation — by microbes, lightning or industry — releases it to life. Nitrifiers turn ammonium into nitrate, denitrifiers return nitrate to the air, and human fixation now matches nature's.
`,
  ideas: [
    'N₂ is 78 % of the air but its triple bond makes it unavailable until it is fixed into ammonia.',
    'Biological fixation uses nitrogenase (16 ATP per N₂), which must be protected from oxygen — hence legume nodules and heterocysts.',
    'Nitrification oxidises ammonium to nitrate; denitrification and anammox return nitrogen to the air in oxygen-poor places.',
    'The Haber–Bosch process fixes about 150 Tg of nitrogen a year; human activity has roughly doubled global nitrogen fixation.',
    'Surplus nitrogen causes eutrophication and dead zones, nitrous oxide emissions and air pollution.'
  ],
  pitfalls: [
    'Plants can take nitrogen straight from the air — Apart from legumes and a few others that house nitrogen-fixing bacteria, plants depend on ammonium and nitrate in the soil.',
    'Denitrification is simply a loss that farmers should prevent — It is the process that keeps nitrate from building up everywhere and returns nitrogen to the atmosphere; the problem is its by-product nitrous oxide and wasted fertiliser, not the process itself.',
    'More fertiliser always means a bigger harvest — Yield levels off as another nutrient, water or light becomes limiting; beyond that, extra nitrogen mostly ends up in water and air.'
  ],
  formulas: [
    {
      name: 'Nitrogen use efficiency of a crop',
      expr: 'NUE = Nh/Na', tex: '\\mathrm{NUE} = \\dfrac{N_h}{N_a}',
      vars: {
        NUE: { name: 'nitrogen use efficiency', q: 'ratio', unit: '%', tex: '\\mathrm{NUE}' },
        Nh: { name: 'nitrogen removed in the harvest', q: false, unit: 'kg/ha', value: 90, tex: 'N_h' },
        Na: { name: 'nitrogen applied (fertiliser, manure, fixation)', q: false, unit: 'kg/ha', value: 180, tex: 'N_a' }
      },
      note: 'The world average for cropland is about 40–50 %; well-managed farms reach 70 % or more.',
      stories: {
        NUE: 'A farmer applies {Na} of nitrogen and the harvest removes {Nh}. What is the nitrogen use efficiency?',
        Na: 'A crop removes {Nh}. With a nitrogen use efficiency of {NUE}, how much nitrogen had to be applied?'
      }
    },
    {
      name: 'Nitrogen surplus',
      expr: 'S = Na*(1 - NUE)', tex: 'S = N_a\\,(1 - \\mathrm{NUE})',
      vars: {
        S: { name: 'nitrogen surplus (left in soil, water and air)', q: false, unit: 'kg/ha' },
        Na: { name: 'nitrogen applied', q: false, unit: 'kg/ha', value: 180, tex: 'N_a' },
        NUE: { name: 'nitrogen use efficiency', q: 'ratio', unit: '%', value: 50, min: 0, max: 100, tex: '\\mathrm{NUE}' }
      },
      note: 'Part of the surplus builds up in soil organic matter; the rest leaches as nitrate or escapes as ammonia, N₂O and N₂.',
      stories: { S: 'A field gets {Na} of nitrogen and the crop uses it with an efficiency of {NUE}. How much is left over?' }
    },
    {
      name: 'Nitrogen in a fertiliser',
      expr: 'mN = mF*w', tex: 'm_N = m_F\\,w_N',
      vars: {
        mN: { name: 'mass of nitrogen', q: 'mass', unit: 'kg', tex: 'm_N' },
        mF: { name: 'mass of fertiliser', q: 'mass', unit: 'kg', value: 50, tex: 'm_F' },
        w: { name: 'nitrogen content by mass', q: 'ratio', unit: '%', value: 46, min: 0, max: 100, tex: 'w_N' }
      },
      note: 'Urea, CO(NH₂)₂, is 46 % nitrogen; ammonium nitrate 35 %; ammonia itself 82 %.',
      stories: { mN: 'How much nitrogen is in a {mF} bag of fertiliser that is {w} nitrogen?', mF: 'A field needs {mN} of nitrogen. How much fertiliser with {w} nitrogen must be spread?' }
    }
  ],
  examples: [
    {
      title: 'A wheat field\'s nitrogen budget',
      q: 'A wheat field receives 180 kg of nitrogen per hectare and the grain and straw removed contain 100 kg. Find the nitrogen use efficiency and the surplus.',
      steps: [
        'NUE = 100/180 = 0.56 = 56 %.',
        'Surplus = 180 − 100 = 80 kg per hectare.',
        'If a quarter of the surplus leaches as nitrate, 20 kg of nitrogen per hectare reaches the groundwater — enough to push the water under a large field above drinking-water limits.'
      ],
      a: 'NUE ≈ 56 %, with a surplus of 80 kg of nitrogen per hectare.'
    },
    {
      title: 'Why urea is 46 % nitrogen',
      q: 'Find the nitrogen content of urea, CO(NH₂)₂, and the nitrogen in a 50 kg bag.',
      steps: [
        'Molar mass: C 12.01 + O 16.00 + 2 × N 14.01 + 4 × H 1.008 = 60.06 g/mol.',
        'Nitrogen: 28.02/60.06 = 0.466, so 46.6 %.',
        'A 50 kg bag holds 0.466 × 50 = 23.3 kg of nitrogen.'
      ],
      a: '46.6 % nitrogen; 23.3 kg in a 50 kg bag.'
    }
  ],
  quiz: [
    { q: 'Why can most organisms not use the nitrogen gas that surrounds them?', choices: ['It is too scarce', 'The N≡N triple bond is extremely strong and only nitrogenase (or industry) can break it', 'It is poisonous to cells', 'It does not dissolve in water at all'], a: 1, why: 'At 945 kJ/mol the triple bond makes N₂ almost inert. Nitrogenase breaks it at a cost of 16 ATP per molecule.' },
    { q: 'Which process returns nitrogen from the soil to the atmosphere?', choices: ['Nitrification', 'Ammonification', 'Denitrification', 'Assimilation'], a: 2, why: 'Denitrifying bacteria reduce nitrate to N₂ (with some N₂O) when oxygen is scarce.' },
    { q: 'The pink colour inside an active legume root nodule comes from…', choices: ['chlorophyll', 'leghaemoglobin, which keeps oxygen away from nitrogenase while supplying the bacteria\'s respiration', 'iron rust from the soil', 'nitrate crystals'], a: 1, why: 'Nitrogenase is destroyed by oxygen, yet the bacteria need oxygen to make ATP; leghaemoglobin buffers it at a low, steady level.' },
    { q: 'Nitrification needs oxygen, so it slows down in waterlogged soils.', a: true, why: 'Nitrifiers oxidise ammonium with O₂. In waterlogged soils ammonium accumulates and any nitrate is lost by denitrification.' },
    { q: 'How many kilograms of nitrogen are in 200 kg of urea (46 % N)?', answer: 92, unit: 'kg', why: '200 × 0.46 = 92 kg.' }
  ],
  problems: [
    { q: 'Ammonium nitrate is NH₄NO₃ (molar mass 80.04 g/mol). What percentage of it is nitrogen?', answer: 35, unit: '%', tol: 0.02, steps: ['Two nitrogen atoms: 2 × 14.01 = 28.02 g/mol.', '28.02/80.04 = 0.350 = 35 %.'] },
    { q: 'A crop removes 120 kg N/ha with a nitrogen use efficiency of 40 %. How much nitrogen was applied, in kg/ha?', answer: 300, unit: 'kg/ha', tol: 0.02, steps: ['$N_a = N_h/\\mathrm{NUE} = 120/0.40 = 300$ kg/ha — 180 kg of which is surplus.'] }
  ],
  applications: [
    'Crop rotations with clover, beans or peas that add nitrogen to the soil for the next crop.',
    'Precision fertiliser use (split doses, soil tests, slow-release forms) to raise nitrogen use efficiency.',
    'Sewage treatment, which removes nitrogen by nitrification followed by denitrification or anammox.',
    'Starting a new aquarium, whose filter must first grow nitrifying bacteria to turn toxic ammonia into nitrate.'
  ],
  history: 'Hermann Hellriegel and Hermann Wilfarth showed in 1886 that legumes fix nitrogen only when their roots carry nodules, and Martinus Beijerinck isolated the nodule bacteria in 1888. Sergei Winogradsky discovered the nitrifying bacteria around 1890 and with them a new way of life: bacteria that live on inorganic chemical energy. Fritz Haber (Nobel Prize 1918) and Carl Bosch (1931) made ammonia from air.'
},

{
  id: 'biomes', parent: 'ecosystems', title: 'Biomes', level: 1,
  short: 'Biomes are the great vegetation types of the world — rainforest, savanna, desert, grassland, temperate and boreal forest, tundra — each shaped mainly by temperature and rainfall. Unrelated plants in the same climate come to look alike, and climbing a mountain crosses the same zones as travelling towards a pole.',
  keywords: ['biome', 'Whittaker diagram', 'tropical rainforest', 'savanna', 'desert', 'temperate grassland', 'deciduous forest', 'boreal forest', 'taiga', 'tundra', 'Mediterranean', 'lapse rate', 'altitudinal zonation', 'Hadley cell', 'aridity index', 'convergent evolution', 'ecotone'],
  prereq: ['ecosystems-intro', 'plant-diversity', 'physics:solar-constant'],
  related: ['climate-ecosystems', 'c4-cam', 'transpiration', 'community-succession', 'biodiversity', 'carbon-cycle', 'evidence-evolution'],
  body: `
Travel from the equator to the pole, or from a valley floor to a mountain summit, and the vegetation changes in a predictable order: rainforest, savanna, desert, grassland, deciduous forest, conifer forest, tundra. These great vegetation types, each with the animals that go with it, are **biomes**. They are defined by the *form* of the plants — evergreen broad leaves, grasses, needles, succulents — not by particular species. The cacti of American deserts and the euphorbias of African ones look almost identical because the same climate has shaped unrelated plants in the same way: convergent evolution ([[evidence-evolution]]).

### Climate decides
Two numbers go a long way: mean annual **temperature** and annual **precipitation**. Robert Whittaker plotted the biomes on these two axes: temperature sorts them from tundra to tropical forest, rainfall from forest to grassland to desert. Seasonality refines the picture. A Mediterranean climate may have the rainfall of a temperate forest, but it falls in winter, and the summer drought favours tough, small-leaved evergreen shrubs. Fire and grazing tip the balance between savanna and forest where either could grow.

| Biome | Mean temperature | Precipitation (mm per year) | Character |
|---|---|---|---|
| Tropical rainforest | 25–28 °C, hardly seasonal | 2000–4000 or more | tall evergreen broadleaf forest; the richest biome in species |
| Tropical savanna | 20–30 °C | 500–1500, with a long dry season | grasses with scattered trees; fire and large grazers |
| Hot desert | 20–30 °C, cold nights | under 250 | succulents, deep-rooted shrubs, annuals that race through wet spells |
| Mediterranean shrubland | 10–20 °C | 300–900, in winter | hard-leaved evergreen shrubs; fire-adapted |
| Temperate grassland | 0–15 °C, hot summers, cold winters | 300–900 | prairie, steppe and pampas on deep fertile soils |
| Temperate deciduous forest | 5–15 °C | 600–1500 | trees shed their leaves for winter |
| Temperate rainforest | 5–15 °C | 1500–4000 | giant conifers, mosses; wet coasts |
| Boreal forest (taiga) | −5 to 5 °C | 300–900 | conifers; the largest forest biome, with vast carbon in its soils |
| Tundra | −15 to −5 °C | 150–300 | no trees; permafrost; mosses, lichens, dwarf shrubs |

Where it is warm and wet, plants often use the [[c4-cam|C₄ pathway]] in grasslands and CAM in deserts, both ways of saving water.

### Why the deserts are where they are
Rainfall follows the circulation of the air. At the equator the Sun heats the surface most strongly; moist air rises, cools and drops its water on the rainforests. The dried air spreads towards the poles and sinks again at about 30° north and south, warming as it descends — and there lie the great hot deserts: the Sahara, Arabia, the Kalahari, the Australian interior. Mountains add rain shadows: the Atacama is dry partly because the Andes block moist air from the east.

### Mountains are latitude compressed
Air cools by about 6.5 °C for each kilometre of height, the **lapse rate**, while mean temperature falls by only about 0.6 °C for every 100 km towards a pole. Climbing one kilometre therefore cools about as much as travelling a thousand kilometres poleward. Kilimanjaro, three degrees south of the equator, has farms and forest on its lower slopes, then heath, alpine desert and ice at 5895 m. Alexander von Humboldt drew this zonation for Chimborazo in the Andes after climbing it in 1802 — the first diagram of its kind.

### Aquatic biomes
In water the zones are set by depth, light, salinity and nutrients rather than rainfall: the open ocean, coral reefs, kelp forests, estuaries and salt marshes, lakes and rivers, and the dark deep sea. Sunlight enough for photosynthesis reaches only the top 200 m or so; below, life depends on organic matter drifting down as "marine snow" or on chemosynthesis at vents.

> [!note] Maps draw biomes as neat zones, but they grade into one another through wide transition belts (ecotones), and people have reshaped them: roughly a third of the ice-free land is now cropland or pasture, and in many regions the "natural" biome survives only in fragments.
`,
  ideas: [
    'A biome is a major vegetation type defined by plant form, found wherever the climate suits it.',
    'Mean temperature and precipitation — and their seasons — largely determine which biome grows where; fire and grazing decide the borderline cases.',
    'The hot deserts lie near 30° N and S, where dry air from the equator sinks.',
    'Temperature falls about 6.5 °C per kilometre of height, so mountains show the same zonation as a journey towards a pole.',
    'Unrelated plants in similar climates evolve similar forms (convergent evolution).'
  ],
  pitfalls: [
    'A biome is a place, like "the Amazon" — It is a type of vegetation; tropical rainforest occurs in South America, Africa, Asia and Australia, with different species in each.',
    'Deserts are defined by heat — They are defined by dryness. Antarctica\'s dry valleys and the Gobi are cold deserts.',
    'Tropical rainforest soils must be very fertile to support such growth — Most are old, leached and poor; the nutrients are held in the living plants and recycled within weeks, which is why cleared rainforest often makes poor farmland.'
  ],
  formulas: [
    {
      name: 'Temperature and altitude',
      expr: 'T = T0 - G*h', tex: 'T = T_0 - \\Gamma h',
      vars: {
        T: { name: 'temperature at height h', q: false, unit: '°C', signed: true },
        T0: { name: 'temperature at the base', q: false, unit: '°C', value: 24, signed: true, tex: 'T_0' },
        G: { name: 'lapse rate', q: false, unit: '°C/km', value: 6.5, min: 0, max: 10, tex: '\\Gamma' },
        h: { name: 'height above the base', q: false, unit: 'km', value: 3 }
      },
      note: 'A mean environmental lapse rate: dry rising air cools at 9.8 °C/km, cloudy moist air at about 5 °C/km.',
      stories: {
        T: 'The foot of a mountain has a mean temperature of {T0}. With a lapse rate of {G}, what is the mean temperature {h} higher up?',
        h: 'Trees stop where the mean temperature is about {T}. How far above a valley at {T0} is the treeline, with a lapse rate of {G}?'
      }
    },
    {
      name: 'Aridity index',
      expr: 'AI = P/PET', tex: '\\mathrm{AI} = \\dfrac{P}{\\mathrm{PET}}',
      vars: {
        AI: { name: 'aridity index', tex: '\\mathrm{AI}' },
        P: { name: 'annual precipitation', q: false, unit: 'mm/yr', value: 350 },
        PET: { name: 'potential evapotranspiration (the water the air could take up)', q: false, unit: 'mm/yr', value: 1400, tex: '\\mathrm{PET}' }
      },
      note: 'UN classes: hyper-arid below 0.05, arid 0.05–0.2, semi-arid 0.2–0.5, dry subhumid 0.5–0.65, humid above 0.65. Drylands (below 0.65) cover about 40 % of the land.',
      stories: {
        AI: 'A region gets {P} of rain but the air could evaporate {PET}. What is its aridity index?',
        P: 'Where the potential evapotranspiration is {PET}, how much rain gives an aridity index of {AI}?'
      }
    }
  ],
  examples: [
    {
      title: 'Up Kilimanjaro',
      q: 'The foot of Kilimanjaro, at about 1000 m, has a mean temperature near 24 °C. Estimate the mean temperature at the summit, 5895 m.',
      steps: [
        'Height gained: 5.9 − 1.0 = 4.9 km.',
        '$T = 24 - 6.5 \\times 4.9 = 24 - 31.9 \\approx -8$ °C.',
        'A mean well below freezing — which is why glaciers survive on the equator, though they have shrunk by more than 80 % since 1912.'
      ],
      a: 'About −8 °C at the summit.'
    },
    {
      title: 'Grassland or desert?',
      q: 'A plain receives 350 mm of rain a year; its potential evapotranspiration is 1400 mm. Classify it.',
      steps: [
        'AI = 350/1400 = 0.25.',
        'Between 0.2 and 0.5: semi-arid — steppe or dry savanna rather than desert or forest.'
      ],
      a: 'AI = 0.25, semi-arid.'
    }
  ],
  quiz: [
    { q: 'Which two climate variables best predict which biome grows in a place?', choices: ['Day length and wind speed', 'Mean temperature and precipitation', 'Altitude and latitude', 'Soil pH and cloud cover'], a: 1, why: 'Whittaker\'s diagram places biomes on temperature and precipitation; seasonality, fire and soils refine it.' },
    { q: 'Why do so many of the world\'s hot deserts lie near 30° north and south?', choices: ['They are furthest from the sea', 'Air that rose and rained out at the equator sinks there, warming and drying', 'The Sun is highest there', 'The winds there blow from the poles'], a: 1, why: 'The Hadley circulation lifts moist air at the equator and brings it down, dry, in the subtropics.' },
    { q: 'A valley at 20 °C lies below a peak 2 km higher. With a lapse rate of 6.5 °C/km, what is the mean temperature at the peak, in °C?', answer: 7, unit: '°C', why: '20 − 6.5 × 2 = 7 °C.' },
    { q: 'The cacti of the Americas and the look-alike euphorbias of Africa are closely related.', a: false, why: 'They belong to different families; similar dry climates have shaped them into similar forms — convergent evolution.' },
    { q: 'Which biome stores the most carbon in its soils?', choices: ['Tropical rainforest', 'Hot desert', 'Boreal forest and tundra', 'Tropical savanna'], a: 2, why: 'Cold, wet soils decompose litter very slowly, so peat and frozen organic matter accumulate — hundreds of gigatonnes of carbon, at risk as the north warms.' }
  ],
  problems: [
    { q: 'A town at 500 m has a mean temperature of 18 °C. With a lapse rate of 6.5 °C/km, how many kilometres above the town is the mean temperature 6 °C?', answer: 1.85, unit: 'km', tol: 0.02, steps: ['$h = (T_0 - T)/\\Gamma = (18 - 6)/6.5 = 1.85$ km — about 2350 m above sea level.'] },
    { q: 'A region has 180 mm of rain and a potential evapotranspiration of 2000 mm a year. What is its aridity index?', answer: 0.09, tol: 0.03, steps: ['AI = 180/2000 = 0.09: arid.'] }
  ],
  applications: [
    'Predicting where crops, forests and pests can grow as the climate shifts.',
    'Designing protected-area networks that sample every biome.',
    'Choosing plants for gardens and restoration that match the local climate.',
    'Understanding why deforestation and farming affect each biome differently.'
  ],
  history: 'Alexander von Humboldt\'s "Tableau physique" of Chimborazo (1807) showed plants arranged by altitude and began plant geography. Wladimir Köppen based his climate classification (1900, revised 1918 and 1936) on the vegetation each climate supports, and Robert Whittaker drew the biome diagram of temperature against rainfall in 1975.'
},

/* ================================================================ POPULATIONS AND COMMUNITIES */
{
  id: 'population-growth', parent: 'populations', title: 'Population growth', level: 2,
  short: 'A population with plenty of resources grows exponentially, doubling at a steady interval ln 2/r. As it becomes crowded its growth slows and levels off at the carrying capacity K — the S-shaped logistic curve, which grows fastest at K/2.',
  keywords: ['population growth', 'exponential growth', 'intrinsic rate of increase', 'r', 'doubling time', 'logistic growth', 'carrying capacity', 'K', 'Verhulst', 'density dependence', 'maximum sustainable yield', 'r-selection', 'K-selection', 'human population', 'demographic transition', 'Malthus'],
  prereq: ['math:exponential-models', 'math:logistic-equation', 'ecosystems-intro'],
  related: ['predator-prey', 'competition-niches', 'bacterial-growth', 'invasive-species', 'conservation-biology', 'ecosystem-services', 'natural-selection', 'medicine:epidemics', 'finance:compound-interest'],
  body: `
A population whose members reproduce grows in proportion to its size: twice as many rabbits make twice as many young. That single fact gives **exponential growth**. If each individual adds, on average, $r$ new individuals per unit time — births minus deaths per head, the **intrinsic rate of increase** —

$$\\frac{dN}{dt} = rN \\quad\\Longrightarrow\\quad N(t) = N_0\\,e^{rt}$$

and the population doubles every $t_d = \\ln 2/r \\approx 0.69/r$, whatever its size (the "rule of 70": the doubling time in years is about 70 divided by the growth in per cent a year). *Escherichia coli* dividing every 20 minutes has $r$ = 2.1 per hour; the St Matthew Island reindeer of the example below managed 0.28 per year; the human population, growing about 0.9 % a year in 2023, doubles in about 77 years at that rate.

No exponential lasts. Darwin worked out that a single pair of elephants — the slowest breeders he could think of — would leave about 19 million descendants after 750 years; a bacterium dividing every 20 minutes would outweigh the Earth in under two days. Something always runs out.

### The logistic curve
As a population grows, food, space and shelter run short: births per head fall and deaths per head rise. Pierre-François Verhulst (1838) wrote the simplest description — growth slows in proportion to how full the environment already is:

$$\\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right)$$

$K$ is the **carrying capacity**. When $N \\ll K$ growth is exponential; as $N$ approaches $K$ it stops; above $K$ the population shrinks. The solution is the S-shaped logistic curve,

$$N(t) = \\frac{K}{1 + \\dfrac{K - N_0}{N_0}\\,e^{-rt}}$$

and the population grows fastest — at $rK/4$ individuals per unit time — when it stands at **half** the carrying capacity. That is the basis of the fisheries idea of **maximum sustainable yield**: keep a stock near $K/2$ and harvest its surplus. It is also a trap: a fixed quota set at the maximum leaves no margin, and a stock pushed below $K/2$ by a bad year then collapses — the fate of the northern cod off Newfoundland, fished to a moratorium in 1992 and still far from recovery decades later.

Laboratory cultures of yeast and *Paramecium* follow the logistic curve closely. Wild populations seldom do: density dependence acts with delays, so they overshoot and crash. Twenty-nine reindeer released on St Matthew Island in the Bering Sea in 1944 had become about 6000 by 1963; having eaten the lichen they depended on, they crashed to 42 within three years.

### What limits populations
Factors whose effect per head grows with crowding — competition for food and territories, disease spreading faster in dense populations, predators turning to the commonest prey — are **density-dependent** and can regulate a population. Weather, fire and floods kill a fraction whatever the density; these **density-independent** factors cause fluctuations but cannot on their own hold numbers steady.

### r and K
Robert MacArthur and E. O. Wilson (1967) contrasted species selected for fast increase in empty or disturbed habitats — early breeding, many small young, short lives (**r-selected**: weeds, mice, mosquitoes) — with species selected to compete in crowded, stable habitats near $K$ — late breeding, few large, well-cared-for young, long lives (**K-selected**: elephants, albatrosses, oaks). It is a useful caricature; modern life-history theory explains the same trade-offs through the pattern of mortality at different ages, and most species mix the traits.

### Humans
| Population | Year reached |
|---|---|
| 1 billion | about 1804 |
| 2 billion | 1927 |
| 4 billion | 1974 |
| 6 billion | 1999 |
| 8 billion | November 2022 |

A little over 8.1 billion people were alive in mid-2024 (UN estimate). The growth rate peaked at a little over 2 % a year in the 1960s and has since fallen below 1 %, as falling child mortality, education — especially of girls — rising incomes and access to contraception brought birth rates down (the **demographic transition**). The UN's 2024 projection peaks at about 10.3 billion in the mid-2080s.

> [!key] Exponential growth has a constant rate per head and a constant doubling time, ln 2/r. Logistic growth has a rate per head that falls in a straight line with density, giving an S curve that levels off at K and grows fastest at K/2.
`,
  ideas: [
    'With unlimited resources, dN/dt = rN: exponential growth with a constant doubling time ln 2/r.',
    'The logistic model dN/dt = rN(1 − N/K) adds crowding: growth levels off at the carrying capacity K.',
    'Logistic growth is fastest at N = K/2, at rK/4 per unit time — the maximum sustainable yield.',
    'Density-dependent factors regulate populations; density-independent factors make them fluctuate.',
    'The human population passed 8 billion in 2022; its growth rate has halved since the 1960s.'
  ],
  pitfalls: [
    'A population growing at 2 % a year adds the same number every year — That is linear growth; exponential growth adds 2 % of an ever larger number, so the yearly increase itself keeps growing.',
    'Carrying capacity is a fixed property of a species — It depends on the environment (food, space, predators, climate) and can be lowered by overuse, as the reindeer of St Matthew Island found.',
    'The maximum sustainable yield is safe because it is sustainable — Only with a perfectly known, constant population. A fixed quota at the maximum turns any bad year into a collapse; managers aim well below it.'
  ],
  formulas: [
    {
      name: 'Exponential growth',
      expr: 'N = N0*exp(r*t)', tex: 'N = N_0\\,e^{rt}',
      vars: {
        N: { name: 'population size at time t' },
        N0: { name: 'starting population', value: 100, tex: 'N_0' },
        r: { name: 'intrinsic rate of increase', q: 'rate', unit: '1/yr', value: 0.5 },
        t: { name: 'time', q: 'time', unit: 'yr', value: 5 }
      },
      note: 'Constant birth and death rates per head, no crowding. r in per year gives N after t years; for bacteria use per hour.',
      stories: {
        N: 'A population of {N0} grows at r = {r}. How big is it after {t}?',
        r: 'A population grew from {N0} to {N} in {t}. What was its intrinsic rate of increase?',
        t: 'How long does a population of {N0} growing at r = {r} take to reach {N}?'
      }
    },
    {
      name: 'Doubling time',
      expr: 'td = ln(2)/r', tex: 't_d = \\dfrac{\\ln 2}{r}',
      vars: {
        td: { name: 'doubling time', q: 'time', unit: 'yr', tex: 't_d' },
        r: { name: 'intrinsic rate of increase', q: 'rate', unit: '1/yr', value: 0.009 }
      },
      note: 'Rule of 70: for growth of p per cent a year, the doubling time is about 70/p years.',
      stories: {
        td: 'The world population grows at r = {r}. How long would it take to double at that rate?',
        r: 'A pest population doubles every {td}. What is its intrinsic rate of increase?'
      }
    },
    {
      name: 'Logistic growth rate',
      expr: 'G = r*N*(1 - N/K)', tex: '\\dot{N} = rN\\left(1 - \\dfrac{N}{K}\\right)',
      vars: {
        G: { name: 'growth of the population, dN/dt (individuals per year)', q: false, unit: '1/yr', tex: '\\dot{N}' },
        r: { name: 'intrinsic rate of increase', q: false, unit: '1/yr', value: 0.5 },
        N: { name: 'population size', value: 400 },
        K: { name: 'carrying capacity', value: 1000 }
      },
      note: 'Ṅ is dN/dt. Solving for N gives two sizes with the same growth, one on each side of K/2.',
      practice: { unknowns: ['G', 'N', 'K'] },
      stories: {
        G: 'A population of {N} has r = {r} and a carrying capacity of {K}. How many individuals does it add per year?',
        N: 'A population with r = {r} and K = {K} is growing by {G}. How big is it?',
        K: 'A population of {N} with r = {r} grows by {G}. What is the carrying capacity?'
      }
    },
    {
      name: 'The logistic curve',
      expr: 'N = K/(1 + (K - N0)/N0*exp(-r*t))', tex: 'N = \\dfrac{K}{1 + \\dfrac{K - N_0}{N_0}\\,e^{-rt}}',
      vars: {
        N: { name: 'population size at time t' },
        K: { name: 'carrying capacity', value: 1000 },
        N0: { name: 'starting population', value: 10, tex: 'N_0' },
        r: { name: 'intrinsic rate of increase', q: 'rate', unit: '1/yr', value: 0.5 },
        t: { name: 'time', q: 'time', unit: 'yr', value: 10 }
      },
      stories: {
        N: 'A population of {N0} with r = {r} and K = {K} grows logistically. How big is it after {t}?',
        t: 'A population starting at {N0} with r = {r} and K = {K} grows logistically. When does it reach {N}?'
      }
    },
    {
      name: 'Maximum sustainable yield',
      expr: 'MSY = r*K/4', tex: '\\mathrm{MSY} = \\dfrac{rK}{4}',
      vars: {
        MSY: { name: 'maximum sustainable yield (individuals per unit time)', q: 'rate', unit: '1/yr', tex: '\\mathrm{MSY}' },
        r: { name: 'intrinsic rate of increase', q: 'rate', unit: '1/yr', value: 0.4 },
        K: { name: 'carrying capacity', value: 1e6 }
      },
      note: 'Taken from a logistic population held at K/2. Real stocks are uncertain and variable, so managers set catches well below it.',
      stories: {
        MSY: 'A fish stock has r = {r} and an unfished size of {K}. What is the most it could yield each year?',
        K: 'A stock with r = {r} yields at most {MSY}. What is its carrying capacity?'
      }
    }
  ],
  examples: [
    {
      title: 'A bacterium\'s day',
      q: '*E. coli* divides every 20 minutes in rich broth. Find r in per hour, and how many cells one cell gives in 10 hours if nothing runs out.',
      steps: [
        '$r = \\ln 2/t_d = 0.693/(1/3\\ \\mathrm{h}) = 2.08$ per hour.',
        '10 hours is 30 doublings: $2^{30} = 1.07 \\times 10^9$ cells — the same as $e^{2.08 \\times 10}$.',
        'In practice the broth runs out at around 10⁹ cells per millilitre and the curve bends over ([[bacterial-growth]]).'
      ],
      a: 'r ≈ 2.1 per hour; about 10⁹ cells after 10 hours.'
    },
    {
      title: 'The reindeer of St Matthew Island',
      q: '29 reindeer were released in 1944 and there were about 6000 in 1963. What were r and the doubling time?',
      steps: [
        '$r = \\ln(6000/29)/19 = \\ln(207)/19 = 5.33/19 = 0.28$ per year.',
        '$t_d = 0.693/0.28 = 2.5$ years — near the maximum for a large mammal, with no predators and untouched lichen.',
        'The lichen took decades to regrow, so the island\'s carrying capacity collapsed and so did the herd.'
      ],
      a: 'r ≈ 0.28 per year, doubling every 2.5 years.'
    },
    {
      title: 'Yield from a fish stock',
      q: 'A fish stock has r = 0.4 per year and an unfished size of one million fish. What is the maximum sustainable yield, and what stock size gives it?',
      steps: [
        '$\\mathrm{MSY} = rK/4 = 0.4 \\times 10^6/4 = 100\\,000$ fish a year.',
        'It is reached with the stock at $K/2$ = 500 000 fish.',
        'Check with the logistic rate: $0.4 \\times 500\\,000 \\times (1 - 0.5) = 100\\,000$ ✓.'
      ],
      a: '100 000 fish a year, with the stock held at 500 000.'
    }
  ],
  quiz: [
    { q: 'A population grows with r = 0.035 per year. What is its doubling time, in years?', answer: 19.8, unit: 'yr', why: 'ln 2/0.035 = 19.8 years (rule of 70: 70/3.5 = 20).' },
    { q: 'In logistic growth, the population grows fastest (in individuals per year) when N equals…', choices: ['almost zero', 'K/4', 'K/2', 'K'], a: 2, why: 'rN(1 − N/K) is a parabola in N with its peak at N = K/2, where it equals rK/4.' },
    { q: 'In logistic growth, the growth rate per individual stays constant.', a: false, why: 'The rate per head is r(1 − N/K): it falls in a straight line from r at low density to zero at K.' },
    { q: 'Which of these is a density-dependent factor?', choices: ['A late spring frost', 'A flood', 'Competition for nesting holes', 'A volcanic eruption'], a: 2, why: 'The shortage of nest holes bites harder the more birds there are; the others kill a share of the population whatever its density.' },
    { q: 'Which traits mark an r-selected species?', choices: ['Late maturity, few large offspring, long life', 'Early maturity, many small offspring, short life', 'Large body size and parental care', 'Slow growth near the carrying capacity'], a: 1, why: 'r-selected species are built to colonise and multiply fast in empty or disturbed habitats.' }
  ],
  problems: [
    { q: 'A population of 50 grows exponentially with r = 0.2 per year. How big is it after 15 years?', answer: 1004, tol: 0.02, steps: ['$N = 50\\,e^{0.2 \\times 15} = 50\\,e^{3} = 50 \\times 20.09 \\approx 1004$.'] },
    { q: 'A population with r = 0.3 per year and K = 5000 has 1000 individuals. How many does it add per year?', answer: 240, unit: '1/yr', tol: 0.02, steps: ['$0.3 \\times 1000 \\times (1 - 1000/5000) = 300 \\times 0.8 = 240$ per year.'] },
    { q: 'A country\'s population grows 2.5 % a year. In how many years does it double?', answer: 27.7, unit: 'yr', tol: 0.03, steps: ['$t_d = \\ln 2/0.025 = 27.7$ years (rule of 70: 28).'] }
  ],
  applications: [
    'Setting fishing quotas and hunting seasons from a stock\'s growth rate and carrying capacity.',
    'Predicting how fast pests, weeds and invasive species will spread once established.',
    'The early growth of an epidemic, which is exponential while almost everyone is susceptible ([[medicine:epidemics]]).',
    'Planning for human population change: schools, pensions, food and water.'
  ],
  history: 'Thomas Malthus argued in 1798 that populations grow geometrically while food grows only arithmetically, an idea that set both Darwin and Wallace thinking about natural selection. Pierre-François Verhulst proposed the logistic equation in 1838; it was forgotten until Raymond Pearl and Lowell Reed rediscovered it in 1920 by fitting the United States census, and Georgy Gause tested it with yeast and Paramecium in the 1930s.',
  sim: 'eco-growth'
},

{
  id: 'predator-prey', parent: 'populations', title: 'Predators and prey', level: 2,
  short: 'More prey feed more predators, more predators eat down the prey, and the hungry predators then decline: predator and prey populations can cycle, the predator peaks lagging behind. The Lotka–Volterra equations capture the idea; real cycles, like the snowshoe hare and lynx, also depend on food, other predators and space.',
  keywords: ['predator–prey', 'Lotka–Volterra', 'population cycles', 'snowshoe hare', 'lynx', 'Hudson\'s Bay Company', 'phase plane', 'equilibrium', 'functional response', 'Holling type II', 'paradox of enrichment', 'Volterra principle', 'trophic cascade', 'sea otter', 'Gause', 'Huffaker'],
  prereq: ['population-growth', 'energy-flow', 'math:differential-equations-intro'],
  related: ['competition-niches', 'coevolution', 'foraging', 'invasive-species', 'community-succession', 'math:eigenvalues', 'physics:oscillations', 'chemistry:rate-laws'],
  body: `
Predators eat prey, so more prey feed more predators; more predators eat the prey down; and the hungry predators then decline, letting the prey recover. Played out over time, this feedback makes populations **oscillate**, with the predator peak lagging behind the prey peak. The best-known record comes from the fur returns of the Hudson's Bay Company in Canada, about 1845–1935: snowshoe hares and the lynx that eat them rose and fell together in a cycle of about ten years, the lynx peaking a year or two after the hares.

### The Lotka–Volterra model
Alfred Lotka (1925) and Vito Volterra (1926) independently wrote the simplest equations for the interaction. With $x$ prey and $y$ predators,

$$\\frac{dx}{dt} = a x - b x y, \\qquad \\frac{dy}{dt} = c x y - d y$$

- $a$ is the prey's rate of increase with no predators (unlimited, exponential);
- $b$ is the capture rate: each predator kills $bx$ prey per unit time, in proportion to the prey it meets — mass action, like a second-order [[chemistry:rate-laws|rate law]];
- $c$ turns captures into new predators ($c = eb$, where $e$ is a conversion efficiency — the transfer efficiency of [[energy-flow]]);
- $d$ is the predators' death rate with no prey.

Setting both rates to zero gives the **equilibrium** $x^* = d/c$, $y^* = a/b$. Note the cross-over: the prey's equilibrium is set by the *predator's* parameters and the predator's by the *prey's*. Away from it the populations circle round it for ever — in the **phase plane** of predators against prey the trajectories are closed loops. Small loops have the period $T = 2\\pi/\\sqrt{ad}$; larger ones take longer and become spikier, with long spells of scarce prey.

**Volterra's principle** was the model's first success. Volterra's son-in-law, Umberto D'Ancona, had noticed that sharks, rays and other predatory fish made up a larger share of the catch in the upper Adriatic during the First World War, when fishing almost stopped. Fishing adds mortality $f$ to both species, so $x^* = (d + f)/c$ rises and $y^* = (a - f)/b$ falls: fishing favours the prey, and stopping it favours the predators. Insecticides that kill a pest and its natural enemies alike can backfire for the same reason — in California in the 1940s, DDT killed the ladybirds that controlled the cottony cushion scale, and the scale surged.

### What the simple model leaves out
The endless cycles of Lotka–Volterra are fragile: any small push moves the system onto another loop, and adding realism changes the behaviour.
- **Prey limited by their own food** (logistic prey): the oscillations damp down to a steady equilibrium.
- **Predators that get full** — a type II functional response (C. S. Holling, 1959): a predator can only catch and handle so many prey a day. This destabilises the system, and with a rich prey habitat the populations settle onto a **limit cycle**, the same loop whatever the start. Enriching the prey's habitat makes the cycles larger and can drive both populations close to zero — Michael Rosenzweig's **paradox of enrichment** (1971).
- **Refuges and space**: in a simple test tube Georgy Gause's predatory *Didinium* ate every *Paramecium* and then starved (1934). In Carl Huffaker's trays of oranges (1958), predatory and plant-eating mites persisted together only when the landscape was patchy, with barriers that slowed the predators' spread.

### The hare and the lynx, again
The famous cycle is not a two-species Lotka–Volterra system. Hares cycle on islands with no lynx; they are eaten by a whole guild of predators (lynx, coyotes, goshawks, great horned owls); and the fur records measure trappers' effort and fur prices as well as animals. In a ten-year experiment at Kluane Lake in the Yukon (1986–1996), Charles Krebs and colleagues found that adding food roughly tripled hare density, keeping out mammalian predators doubled it, and doing both raised it about elevenfold: food and predation together drive the cycle. The fear of predators also lowers the hares' breeding, with effects that last into the next generation.

### Top-down effects
Predators shape more than their prey's numbers. Sea otters eat sea urchins; where the otters were hunted out, urchins multiplied and grazed kelp forests down to bare rock, and where otters returned the kelp came back — a **trophic cascade**. Wolves were reintroduced to Yellowstone in 1995 and changed where and how elk feed; how much of the regrowth of streamside willows and aspens is due to them is still debated.

> [!key] Predator and prey populations cycle because each responds to the other with a delay. In the Lotka–Volterra model the prey settle round d/c and the predators round a/b, and small cycles have period 2π/√(ad). Real cycles also depend on food, refuges and other predators.
`,
  ideas: [
    'Predator–prey feedback with a time lag produces population cycles, the predator peak following the prey peak.',
    'Lotka–Volterra: dx/dt = ax − bxy, dy/dt = cxy − dy, with equilibrium x* = d/c, y* = a/b.',
    'Small Lotka–Volterra cycles have period 2π/√(ad); the model\'s neutral cycles are not robust to added realism.',
    'Prey self-limitation damps cycles; predator satiation and enrichment can create large limit cycles.',
    'Predators can control whole communities from the top down (trophic cascades).'
  ],
  pitfalls: [
    'The lynx cycle proves that lynx control hares — Hares also cycle without lynx, and food, many other predators and stress all play a part; experiments show food and predation acting together.',
    'Killing predators always increases their prey — Often, but prey without predators can overshoot their food and crash, and killing a predator may release a second prey or predator that does more damage.',
    'In the model, feeding the prey (more food) raises the prey population — At equilibrium the prey level d/c depends only on the predator; extra prey growth goes into more predators, and with satiating predators it can make the cycles wilder (the paradox of enrichment).'
  ],
  formulas: [
    {
      name: 'Prey at equilibrium',
      expr: 'xs = d/c', tex: 'x^* = \\dfrac{d}{c}',
      vars: {
        xs: { name: 'prey population at equilibrium', tex: 'x^*' },
        d: { name: 'predator death rate without prey', q: 'rate', unit: '1/yr', value: 0.5 },
        c: { name: 'predator gain per prey per predator', q: 'rate', unit: '1/yr', value: 0.005 }
      },
      note: 'c is per prey individual per predator per year; the prey level is set entirely by the predator\'s parameters.',
      stories: { xs: 'Lynx die at a rate of {d} without hares and gain {c} per hare per lynx. Around what hare number do the cycles centre?', d: 'The hare population cycles around {xs}, and the lynx gain {c} per hare per lynx. What is the lynx death rate?' }
    },
    {
      name: 'Predators at equilibrium',
      expr: 'ys = a/b', tex: 'y^* = \\dfrac{a}{b}',
      vars: {
        ys: { name: 'predator population at equilibrium', tex: 'y^*' },
        a: { name: 'prey rate of increase without predators', q: 'rate', unit: '1/yr', value: 0.8 },
        b: { name: 'capture rate per predator per prey', q: 'rate', unit: '1/yr', value: 0.04 }
      },
      stories: { ys: 'Hares increase at {a} without predators and each lynx catches hares at a rate of {b} per hare. Around what lynx number do the cycles centre?' }
    },
    {
      name: 'Period of small cycles',
      expr: 'T = 2*pi/sqrt(a*d)', tex: 'T = \\dfrac{2\\pi}{\\sqrt{a\\,d}}',
      vars: {
        T: { name: 'period of the cycle', q: 'time', unit: 'yr' },
        a: { name: 'prey rate of increase without predators', q: 'rate', unit: '1/yr', value: 0.8 },
        d: { name: 'predator death rate without prey', q: 'rate', unit: '1/yr', value: 0.5 }
      },
      note: 'Exact only for small oscillations near the equilibrium; larger loops of the Lotka–Volterra model take longer.',
      stories: { T: 'Prey increase at {a} and predators die at {d}. What is the period of small population cycles?', d: 'A predator–prey cycle lasts {T} and the prey grow at {a}. What predator death rate does the model imply?' }
    },
    {
      name: 'Volterra\'s principle: predators under harvesting',
      expr: 'ys = (a - f)/b', tex: 'y^* = \\dfrac{a - f}{b}',
      vars: {
        ys: { name: 'predator population at equilibrium', tex: 'y^*' },
        a: { name: 'prey rate of increase without predators', q: 'rate', unit: '1/yr', value: 0.8 },
        f: { name: 'extra mortality from fishing or spraying (both species)', q: 'rate', unit: '1/yr', value: 0.2 },
        b: { name: 'capture rate per predator per prey', q: 'rate', unit: '1/yr', value: 0.04 }
      },
      note: 'The prey equilibrium rises at the same time, to (d + f)/c: harvesting both species shifts the balance towards the prey.',
      stories: { ys: 'With a = {a}, b = {b} and fishing that removes {f} of both species, around what number do the predators settle?' }
    }
  ],
  examples: [
    {
      title: 'A ten-year cycle',
      q: 'Suppose hares increase at a = 0.8 per year without lynx, and lynx die at d = 0.5 per year without hares. What period do small cycles have?',
      steps: [
        '$\\sqrt{ad} = \\sqrt{0.8 \\times 0.5} = \\sqrt{0.4} = 0.632$ per year.',
        '$T = 2\\pi/0.632 = 9.9$ years.',
        'Close to the observed ten years — a pleasing match, though the real cycle involves more than two species.'
      ],
      a: 'About 10 years.'
    },
    {
      title: 'Where the cycles centre',
      q: 'With b = 0.04 (per lynx per year) and c = 0.005 (per hare per lynx per year), and a, d as above, find the equilibrium numbers.',
      steps: [
        'Prey: $x^* = d/c = 0.5/0.005 = 100$ hares.',
        'Predators: $y^* = a/b = 0.8/0.04 = 20$ lynx.',
        'Doubling the hares\' growth rate $a$ would double the lynx, not the hares.'
      ],
      a: '100 hares and 20 lynx (per unit area).'
    },
    {
      title: 'Volterra\'s fish',
      q: 'Fishing removes f = 0.2 per year from both species of the system above. Where do the equilibria move?',
      steps: [
        'Prey: $(d + f)/c = 0.7/0.005 = 140$ (up from 100).',
        'Predators: $(a - f)/b = 0.6/0.04 = 15$ (down from 20).',
        'Stopping the fishing reverses this — which is why predatory fish became commoner in the Adriatic catches during the war.'
      ],
      a: 'Prey rise to 140, predators fall to 15.'
    }
  ],
  quiz: [
    { q: 'In the Lotka–Volterra model, the prey\'s birth rate a is doubled. Which equilibrium changes?', choices: ['The prey equilibrium doubles', 'The predator equilibrium doubles', 'Both double', 'Neither changes'], a: 1, why: 'y* = a/b doubles; x* = d/c depends only on the predator. The extra prey production is turned into predators.' },
    { q: 'In predator–prey cycles, the predator peaks usually come after the prey peaks.', a: true, why: 'Predators need time to convert abundant prey into offspring, and they keep increasing until the prey have already declined.' },
    { q: 'For a = 1 per year and d = 1 per year, what is the period of small Lotka–Volterra cycles, in years?', answer: 6.28, unit: 'yr', why: 'T = 2π/√(1 × 1) = 2π ≈ 6.3 years.' },
    { q: 'Why did Gause\'s predator Didinium die out in a simple test tube of Paramecium?', choices: ['It was poisoned by its prey', 'It ate all the prey, which had no refuge, and then starved', 'The tube ran out of oxygen', 'The Paramecium outcompeted it for bacteria'], a: 1, why: 'With no refuge or immigration the predator exterminated its prey and then itself; adding sediment refuges or immigration let them persist.' },
    { q: 'According to the paradox of enrichment, giving the prey more food (a higher carrying capacity), when predators satiate, tends to…', choices: ['stabilise the populations at a higher level', 'make the oscillations larger and riskier', 'eliminate the predators at once', 'have no effect'], a: 1, why: 'With a type II functional response, raising the prey\'s carrying capacity pushes the system from a stable point into ever-larger limit cycles.' }
  ],
  problems: [
    { q: 'Predators die at 0.3 per year without prey and gain 0.002 per prey per predator per year. What is the equilibrium prey population?', answer: 150, tol: 0.02, steps: ['$x^* = d/c = 0.3/0.002 = 150$.'] },
    { q: 'With a = 0.6 per year and d = 0.4 per year, what is the period of small predator–prey cycles?', answer: 12.8, unit: 'yr', tol: 0.02, steps: ['$\\sqrt{0.6 \\times 0.4} = 0.490$ per year.', '$T = 2\\pi/0.490 = 12.8$ years.'] }
  ],
  applications: [
    'Change the four rates and watch the cycles in [the predator–prey model](#/tools/cell/predator).',
    'Biological control of pests with their natural enemies, and why broad-spectrum pesticides can cause pest outbreaks.',
    'Fisheries management, where harvesting both predators and prey shifts the balance of the community.',
    'Reintroducing or removing top predators (wolves, sea otters, dingoes) and predicting the cascades.',
    'The same mathematics describes immune cells and pathogens, and some chemical oscillators.'
  ],
  history: 'Charles Elton analysed the Hudson\'s Bay Company fur records in the 1920s and 1940s. Alfred Lotka derived the predator–prey equations in 1925 from ideas about chemical oscillations; Vito Volterra, a mathematician in Rome, reached them in 1926 to explain the Adriatic catch data of his son-in-law Umberto D\'Ancona.',
  sim: 'eco-predprey'
},

{
  id: 'competition-niches', parent: 'populations', title: 'Competition and niches', level: 2,
  short: 'Species that need the same limited resources compete. Gause found that two species with identical needs cannot coexist — one excludes the other — so species that do live together divide the resources: different foods, places or times. Competition can even drive evolution apart, as in character displacement.',
  keywords: ['competition', 'interspecific competition', 'competitive exclusion', 'Gause', 'Paramecium', 'niche', 'fundamental niche', 'realised niche', 'Hutchinson', 'resource partitioning', 'character displacement', 'Lotka–Volterra competition', 'competition coefficient', 'isocline', 'Connell', 'barnacles', 'Darwin\'s finches'],
  prereq: ['population-growth', 'natural-selection', 'math:systems-of-equations'],
  related: ['predator-prey', 'community-succession', 'biodiversity', 'speciation', 'coevolution', 'invasive-species', 'foraging'],
  body: `
When two species need the same limited resource — the same food, nest holes, light or water — each takes what the other could have used. This **interspecific competition** shapes which species live together, and how.

### Gause's experiments
In the 1930s Georgy Gause grew species of *Paramecium* on bacteria in test tubes. Alone, each grew logistically to its own carrying capacity ([[population-growth]]). Together, *P. aurelia* thrived and *P. caudatum* died out, time after time. But *P. caudatum* and *P. bursaria* coexisted: *bursaria*, which carries photosynthetic algae and tolerates low oxygen, fed on yeast cells settling at the bottom of the tube, while *caudatum* fed on bacteria in the water above. From results like these came the **competitive exclusion principle**: two species competing for exactly the same limiting resources cannot coexist indefinitely — one wins, unless they divide the resources.

### The Lotka–Volterra competition model
Add a competitor to each logistic equation:

$$\\frac{dN_1}{dt} = r_1N_1\\,\\frac{K_1 - N_1 - \\alpha_{12}N_2}{K_1}, \\qquad \\frac{dN_2}{dt} = r_2N_2\\,\\frac{K_2 - N_2 - \\alpha_{21}N_1}{K_2}$$

The **competition coefficient** $\\alpha_{12}$ says how many individuals of species 1 one individual of species 2 is worth in using up species 1's resources. Each species stops growing along a straight line in the ($N_1$, $N_2$) plane, its **zero-growth isocline**, and the way the two lines lie decides the outcome:

| Condition | Outcome |
|---|---|
| $\\alpha_{12} < K_1/K_2$ and $\\alpha_{21} > K_2/K_1$ | species 1 always wins |
| $\\alpha_{12} > K_1/K_2$ and $\\alpha_{21} < K_2/K_1$ | species 2 always wins |
| $\\alpha_{12} < K_1/K_2$ and $\\alpha_{21} < K_2/K_1$ | the two coexist, at a stable point |
| $\\alpha_{12} > K_1/K_2$ and $\\alpha_{21} > K_2/K_1$ | unstable: whichever gets ahead wins |

Coexistence needs each species to hold itself back more than it holds back the other. When $K_1 = K_2$, both coefficients must be below 1: **competition within each species must be stronger than competition between them** — which is exactly what dividing the resources achieves. The coexistence point is

$$N_1^* = \\frac{K_1 - \\alpha_{12}K_2}{1 - \\alpha_{12}\\alpha_{21}}, \\qquad N_2^* = \\frac{K_2 - \\alpha_{21}K_1}{1 - \\alpha_{12}\\alpha_{21}}$$

A useful test is **invasion**: can a species increase when it is rare and its rival sits at carrying capacity? Species 2 can invade a monoculture of species 1 if $K_2 > \\alpha_{21}K_1$. Stable coexistence is when each can invade the other.

### Niches
G. Evelyn Hutchinson (1957) defined a species' **niche** as the set of conditions and resources — temperature, humidity, food size, time of activity — in which it can persist: a volume in many dimensions. The **fundamental niche** is where it could live on its own; the **realised niche** is the part it actually holds among competitors and predators. Joseph Connell's barnacles on the Scottish coast (1961) showed the difference. *Chthamalus* lives high on the shore and *Semibalanus* lower down. When Connell removed *Semibalanus*, young *Chthamalus* survived lower down as well; normally *Semibalanus* smothered, undercut and crushed them there, while it could not itself survive the drying out high up.

**Resource partitioning** lets similar species live together. Robert MacArthur (1958) watched five species of warbler feeding in the same spruce trees in New England and found that each hunted insects in a different part of the tree. *Anolis* lizards on Caribbean islands divide the trees by perch height and branch thickness, and each island has evolved much the same set of types.

### Character displacement
Competition can drive evolution apart. Where two similar species live separately they often look alike; where they meet, they differ more — **character displacement**. On the Galápagos island of Daphne Major, Peter and Rosemary Grant watched it happen. The large ground finch *Geospiza magnirostris* settled there in 1982; in the drought of 2004–2005 it took most of the large seeds, and medium ground finches (*G. fortis*) with smaller beaks, able to live on small seeds, survived better. The average beak of *fortis* shrank measurably in a single generation.

> [!key] Species competing for the same limiting resources cannot coexist indefinitely unless each limits itself more than it limits the other — which they achieve by dividing the resources: different foods, places, times or seasons.
`,
  ideas: [
    'Competitive exclusion: two species with identical resource needs cannot coexist indefinitely.',
    'In the Lotka–Volterra competition model the positions of the two isoclines give four outcomes: either species wins, stable coexistence, or an unstable contest.',
    'Coexistence requires intraspecific competition to be stronger than interspecific competition.',
    'A species\' realised niche is usually smaller than its fundamental niche because of competitors and predators.',
    'Competition drives resource partitioning and character displacement.'
  ],
  pitfalls: [
    'Competition is always a visible fight — Most competition is exploitation: each species simply uses up resources the other needs, without meeting it.',
    'If two species live together, they cannot be competing — They may coexist precisely because they compete only partly, having divided the resources; removal experiments often reveal the competition.',
    'The better competitor always wins everywhere — Outcomes depend on conditions: temperature, disturbance, predators and fluctuating environments can reverse or stall competitive exclusion.'
  ],
  formulas: [
    {
      name: 'Coexistence point of two competitors',
      expr: 'N1 = (K1 - a12*K2)/(1 - a12*a21)', tex: 'N_1^* = \\dfrac{K_1 - \\alpha_{12}K_2}{1 - \\alpha_{12}\\alpha_{21}}',
      vars: {
        N1: { name: 'species 1 at the coexistence point', tex: 'N_1^*' },
        K1: { name: 'carrying capacity of species 1', value: 1000, tex: 'K_1' },
        K2: { name: 'carrying capacity of species 2', value: 800, tex: 'K_2' },
        a12: { name: 'effect of species 2 on species 1', value: 0.5, tex: '\\alpha_{12}' },
        a21: { name: 'effect of species 1 on species 2', value: 0.6, tex: '\\alpha_{21}' }
      },
      note: 'Stable only if α₁₂ < K₁/K₂ and α₂₁ < K₂/K₁. Swap the indices for species 2.',
      stories: {
        N1: 'Two competitors have K₁ = {K1}, K₂ = {K2}, α₁₂ = {a12} and α₂₁ = {a21}. How many of species 1 are there when they coexist?',
        a12: 'Species 1 (K = {K1}) settles at {N1} alongside species 2 (K = {K2}); α₂₁ = {a21}. What is α₁₂?'
      }
    },
    {
      name: 'Can a rare competitor invade?',
      expr: 'g2 = r2*(1 - a21*K1/K2)', tex: 'g_2 = r_2\\left(1 - \\dfrac{\\alpha_{21}K_1}{K_2}\\right)',
      vars: {
        g2: { name: 'growth rate per head of rare species 2', q: false, unit: '1/yr', signed: true, tex: 'g_2' },
        r2: { name: 'intrinsic rate of increase of species 2', q: false, unit: '1/yr', value: 0.6, tex: 'r_2' },
        a21: { name: 'effect of species 1 on species 2', value: 0.6, tex: '\\alpha_{21}' },
        K1: { name: 'carrying capacity of species 1 (the resident)', value: 1000, tex: 'K_1' },
        K2: { name: 'carrying capacity of species 2', value: 800, tex: 'K_2' }
      },
      note: 'Species 2 arrives in small numbers where species 1 is at K₁. A positive g₂ means it can invade; if each species can invade the other, they coexist.',
      stories: {
        g2: 'A new species (r = {r2}, K = {K2}) arrives where a resident sits at {K1}; each resident counts as {a21} of the newcomer. How fast does the newcomer grow per head?',
        a21: 'What competition coefficient would stop a newcomer with K = {K2} from invading a resident at {K1} (growth rate {g2})?'
      }
    },
    {
      name: 'Growth of a species with a competitor',
      expr: 'G1 = r1*N1*(K1 - N1 - a12*N2)/K1', tex: '\\dot{N}_1 = r_1N_1\\,\\dfrac{K_1 - N_1 - \\alpha_{12}N_2}{K_1}',
      vars: {
        G1: { name: 'growth of species 1, dN₁/dt (individuals per year)', q: false, unit: '1/yr', signed: true, tex: '\\dot{N}_1' },
        r1: { name: 'intrinsic rate of increase of species 1', q: false, unit: '1/yr', value: 0.5, tex: 'r_1' },
        N1: { name: 'population of species 1', value: 400, tex: 'N_1' },
        K1: { name: 'carrying capacity of species 1', value: 1000, tex: 'K_1' },
        a12: { name: 'effect of species 2 on species 1', value: 0.5, tex: '\\alpha_{12}' },
        N2: { name: 'population of species 2', value: 600, tex: 'N_2' }
      },
      practice: { unknowns: ['G1', 'N2', 'a12'] },
      stories: {
        G1: 'Species 1 (r = {r1}, K = {K1}) numbers {N1}; its competitor numbers {N2} with α₁₂ = {a12}. How fast does species 1 grow?',
        N2: 'Species 1 (r = {r1}, K = {K1}, N = {N1}) grows at {G1}. With α₁₂ = {a12}, how many competitors are there?'
      }
    }
  ],
  examples: [
    {
      title: 'Coexistence or exclusion?',
      q: 'K₁ = 1000, K₂ = 800, α₁₂ = 0.5, α₂₁ = 0.6. Which outcome does the model predict, and at what numbers?',
      steps: [
        'K₁/K₂ = 1.25 > α₁₂ = 0.5, and K₂/K₁ = 0.8 > α₂₁ = 0.6: each species limits itself more than the other — stable coexistence.',
        '$N_1^* = (1000 - 0.5 \\times 800)/(1 - 0.3) = 600/0.7 = 857$.',
        '$N_2^* = (800 - 0.6 \\times 1000)/0.7 = 200/0.7 = 286$.'
      ],
      a: 'They coexist at about 857 and 286.'
    },
    {
      title: 'A failed invasion',
      q: 'Species 1 is established at K₁ = 1000. Species 2 has K₂ = 800 and each individual of species 1 counts as α₂₁ = 0.9 of species 2. Can species 2 invade?',
      steps: [
        'Its growth per head when rare: $r_2(1 - 0.9 \\times 1000/800) = r_2(1 - 1.125) = -0.125\\,r_2$.',
        'Negative: the resident uses up so much of the newcomer\'s resources that the newcomer declines.'
      ],
      a: 'No — it cannot increase when rare (K₂ < α₂₁K₁).'
    }
  ],
  quiz: [
    { q: 'In the Lotka–Volterra competition model, what does stable coexistence require?', choices: ['Both species have the same r', 'Each species limits its own growth more than it limits the other\'s', 'The species have equal carrying capacities', 'One species is much larger than the other'], a: 1, why: 'Coexistence needs α₁₂ < K₁/K₂ and α₂₁ < K₂/K₁ — intraspecific competition outweighing interspecific.' },
    { q: 'A species\' realised niche is usually smaller than its fundamental niche.', a: true, why: 'Competitors, predators and disease keep it out of parts of the range of conditions it could tolerate on its own, as with Connell\'s barnacles.' },
    { q: 'Two competitors have K₁ = K₂ = 100 and α₁₂ = α₂₁ = 0.5. How many of species 1 are there at the coexistence point?', answer: 66.7, why: '(100 − 0.5 × 100)/(1 − 0.25) = 50/0.75 = 66.7.' },
    { q: 'Connell removed the barnacle Semibalanus from rocks low on the shore. What happened to Chthamalus?', choices: ['It died out, because it depends on Semibalanus', 'Its young survived lower down than before', 'Nothing changed', 'It moved higher up the shore'], a: 1, why: 'Chthamalus could live lower down; competition from Semibalanus normally confined it to the upper shore — its realised niche.' },
    { q: 'What is character displacement?', choices: ['Two species becoming more similar where they meet', 'Competing species evolving to differ more where they live together than where they live apart', 'A species moving to a new habitat', 'A mutation that changes a species\' appearance'], a: 1, why: 'Selection against overlap in resource use pushes competitors\' traits (such as beak size) apart where they coexist.' }
  ],
  problems: [
    { q: 'Two competitors have K₁ = 1200, K₂ = 900, α₁₂ = 0.4 and α₂₁ = 0.5. What is N₂ at the coexistence point?', answer: 375, tol: 0.02, steps: ['$N_2^* = (K_2 - \\alpha_{21}K_1)/(1 - \\alpha_{12}\\alpha_{21}) = (900 - 600)/(1 - 0.2) = 300/0.8 = 375$.'] },
    { q: 'Species 1 sits at K₁ = 500. A newcomer has r₂ = 0.8 per year, K₂ = 600 and α₂₁ = 0.6. What is its growth rate per head when rare, per year?', answer: 0.4, unit: '1/yr', tol: 0.02, steps: ['$g_2 = 0.8\\,(1 - 0.6 \\times 500/600) = 0.8 \\times 0.5 = 0.4$ per year — it can invade.'] }
  ],
  applications: [
    'Predict whether two species coexist in [the competition model](#/tools/cell/competition).',
    'Predicting whether an introduced species will displace a native one.',
    'Intercropping and crop mixtures that use light, water and nutrients differently and yield more together.',
    'Weed control, which is largely about tipping competition for light and nutrients towards the crop.',
    'Explaining the structure of communities, from warblers in spruces to microbes in the gut.'
  ],
  history: 'Darwin wrote that the struggle for existence is most severe between closely related forms, which share the same needs. Georgy Gause tested the idea experimentally and published The Struggle for Existence in 1934; G. Evelyn Hutchinson gave the niche its modern definition in 1957 and asked, in "Homage to Santa Rosalia" (1959), why there are so many kinds of animals.',
  sim: 'eco-competition'
},

{
  id: 'community-succession', parent: 'populations', title: 'Communities and succession', level: 2,
  short: 'After a disturbance a community changes in a partly predictable sequence: hardy colonists first, then species that tolerate crowding and shade. Primary succession starts on bare rock or ice, secondary succession where soil survives — as after the eruptions of Krakatau and Mount St Helens.',
  keywords: ['succession', 'primary succession', 'secondary succession', 'pioneer species', 'climax community', 'facilitation', 'tolerance', 'inhibition', 'Glacier Bay', 'Krakatau', 'Mount St Helens', 'biological legacies', 'intermediate disturbance hypothesis', 'Clements', 'Gleason', 'species turnover', 'Jaccard index'],
  prereq: ['ecosystems-intro', 'population-growth', 'competition-niches'],
  related: ['biodiversity', 'nitrogen-cycle', 'biomes', 'invasive-species', 'conservation-biology', 'plant-diversity', 'seeds-germination'],
  body: `
Bare ground does not stay bare. Lichens settle on new lava; weeds spring up in an abandoned field; within decades there is scrub, then woodland. This directional, partly predictable change in a community after a disturbance is **ecological succession**.

### Primary and secondary succession
**Primary succession** starts where there is no soil and no life: new volcanic rock, a sand dune, ground uncovered by a retreating glacier. The first colonists — lichens, mosses, cyanobacteria and a few hardy plants — must cope with almost no nutrients (above all, no nitrogen), little water and extremes of heat. They build soil slowly, trapping dust and adding organic matter as they die.

**Secondary succession** follows a disturbance that removes the plants but leaves the soil — a fire, a storm that flattens a forest, a field left fallow. With soil, seeds and roots already present it is much faster. On abandoned farmland in the south-eastern United States, annual weeds come first, then perennial grasses and asters, then pines within 5–15 years, and hardwoods take over after roughly 70–150 years.

### A glacier in retreat
At Glacier Bay in Alaska the ice has retreated about 100 km since the 1750s, and dated moraines lay the sequence out side by side. Mosses, fireweed and mountain avens (*Dryas*, whose roots hold nitrogen-fixing bacteria) come first; then alder, another nitrogen fixer; then Sitka spruce after about 80–100 years; and western hemlock forest after about 200. The soil changes with the plants: nitrogen accumulates and the pH falls from about 8 to about 5. Early species make the ground fit for later ones — and are then shaded out.

### Why succession happens
Joseph Connell and Ralph Slatyer (1977) described three mechanisms:
- **facilitation** — early species improve conditions for later ones (nitrogen fixers on bare moraine, the [[nitrogen-cycle]] at work);
- **tolerance** — later species endure shade and crowding better, and simply outlast the early ones;
- **inhibition** — early species hold the ground and keep newcomers out until they die or are disturbed.

All three act in real successions. Early species tend to be r-selected ([[population-growth]]): good dispersers, fast-growing, poor competitors. Late species are shade-tolerant, slow-growing and long-lived.

### Climax or mosaic?
Frederic Clements (1916) saw succession as the development of a "superorganism" towards a single stable **climax** set by the climate. Henry Gleason (1926) replied that each species responds individually to conditions and to chance, so communities are loose, shifting assemblies. The modern view is closer to Gleason's: most landscapes are mosaics of patches at different stages, reset by fire, storms, floods and grazing. Connell's **intermediate disturbance hypothesis** (1978) proposes that diversity peaks where disturbance is neither too rare (strong competitors take over) nor too frequent (only colonists survive).

### Two eruptions
- **Krakatau**, Indonesia, erupted in August 1883, burying its remaining islands under metres of hot ash and killing everything on them. Three years later a visiting botanist found a film of cyanobacteria and about two dozen species of ferns and flowering plants. By the 1930s there were young forests with more than 250 plant species, and the number of resident bird species had climbed to about 30 and then levelled off — while the species themselves kept changing, some arriving as others vanished. That balance of immigration and extinction is the heart of island biogeography ([[biodiversity]]).
- **Mount St Helens**, Washington, erupted on 18 May 1980 and flattened about 600 km² of forest. Recovery was faster than expected thanks to **biological legacies**: seedlings sheltered under late snow, pocket gophers that churned old soil up through the ash, buried roots, seeds and fungi. On the barren Pumice Plain the prairie lupine, a nitrogen fixer, was among the first colonists; its patches trapped seeds and insects and nursed other plants.

> [!key] Succession is the directional change of a community after a disturbance — primary on bare ground with no soil, secondary where soil survives. Early colonists disperse and grow fast; later species tolerate shade and competition. Facilitation, tolerance and inhibition all play a part.
`,
  ideas: [
    'Primary succession begins on bare substrate with no soil; secondary succession follows a disturbance that leaves soil behind and is much faster.',
    'Pioneer species are good dispersers that tolerate harsh conditions; late-successional species tolerate shade and competition.',
    'Facilitation, tolerance and inhibition are the three mechanisms of replacement.',
    'Many landscapes are mosaics of patches at different successional stages rather than a single climax.',
    'On islands, the number of species approaches an equilibrium while their identities keep turning over.'
  ],
  pitfalls: [
    'Succession always ends in one fixed climax community — Disturbance, chance and history mean that most landscapes are shifting mosaics; the same site can end up in different states.',
    'Early species help later ones by design — Facilitation is a side effect of how pioneers live; they are usually outcompeted by the very species they helped.',
    'A disturbance always reduces diversity — Moderate disturbance often increases it by opening space for colonists and stopping any one competitor from taking over.'
  ],
  formulas: [
    {
      name: 'Filling an empty island',
      expr: 'S = Seq*(1 - exp(-t/tau))', tex: 'S = S_{eq}\\left(1 - e^{-t/\\tau}\\right)',
      vars: {
        S: { name: 'number of species present at time t' },
        Seq: { name: 'equilibrium number of species', value: 40, tex: 'S_{eq}' },
        t: { name: 'time since the island was emptied', q: 'time', unit: 'yr', value: 25 },
        tau: { name: 'time constant of colonisation', q: 'time', unit: 'yr', value: 12, tex: '\\tau' }
      },
      note: 'Follows from MacArthur and Wilson\'s model with immigration and extinction rates that change in straight lines with the number of species.',
      stories: {
        S: 'A sterilised island will hold {Seq} species at equilibrium, with a time constant of {tau}. How many species are there {t} after the disaster?',
        t: 'An island heading for {Seq} species with a time constant of {tau} now has {S}. How long ago was it emptied?'
      }
    },
    {
      name: 'Jaccard similarity of two species lists',
      expr: 'J = Sc/(Sa + Sb - Sc)', tex: 'J = \\dfrac{S_c}{S_a + S_b - S_c}',
      vars: {
        J: { name: 'Jaccard similarity (0: nothing shared, 1: identical)' },
        Sc: { name: 'species found in both surveys', value: 26, int: true, tex: 'S_c' },
        Sa: { name: 'species in the first survey', value: 31, int: true, tex: 'S_a' },
        Sb: { name: 'species in the second survey', value: 30, int: true, tex: 'S_b' }
      },
      note: '1 − J measures turnover: how much the community has changed between two times or two places.',
      stories: { J: 'A first survey finds {Sa} species, a second {Sb}, with {Sc} in both. How similar are the two lists?' }
    }
  ],
  examples: [
    {
      title: 'Recolonising a sterilised island',
      q: 'An island emptied by an eruption will hold 40 bird species at equilibrium, and colonisation has a time constant of 12 years. How many species are there after 12 years and after 36 years?',
      steps: [
        'After 12 years: $40(1 - e^{-1}) = 40 \\times 0.632 = 25$ species.',
        'After 36 years: $40(1 - e^{-3}) = 40 \\times 0.950 = 38$ species.',
        'The number then stays near 40, while species keep arriving and disappearing.'
      ],
      a: 'About 25 species after 12 years and 38 after 36.'
    },
    {
      title: 'Turnover between two surveys',
      q: 'Suppose an island\'s resident birds are surveyed twice, fourteen years apart: 31 species, then 30, with 26 in both. How much has the community changed?',
      steps: [
        '$J = 26/(31 + 30 - 26) = 26/35 = 0.74$.',
        'Turnover $1 - J = 0.26$: five species were lost and four gained, though the total barely changed.'
      ],
      a: 'J = 0.74: about a quarter of the list has turned over.'
    }
  ],
  quiz: [
    { q: 'A farmer stops ploughing a field and it gradually becomes woodland. This is…', choices: ['primary succession', 'secondary succession', 'competitive exclusion', 'a trophic cascade'], a: 1, why: 'The soil, with its seeds and roots, remains: that is secondary succession, faster than primary succession on bare rock.' },
    { q: 'Alder growing on a new glacial moraine adds nitrogen to the soil, helping spruce to establish. Which mechanism is this?', choices: ['Inhibition', 'Tolerance', 'Facilitation', 'Character displacement'], a: 2, why: 'An early species changing conditions in a way that helps later ones is facilitation.' },
    { q: 'Every succession ends in the same single climax community determined by climate.', a: false, why: 'That was Clements\' view. In practice history, chance and repeated disturbance produce varied end points and shifting mosaics.' },
    { q: 'According to the intermediate disturbance hypothesis, species diversity is highest where disturbance is…', choices: ['absent', 'rare', 'moderate in frequency and size', 'very frequent'], a: 2, why: 'Too little disturbance lets strong competitors exclude others; too much leaves only colonists. In between, both kinds persist.' },
    { q: 'An emptied island heads for 50 species with a time constant τ. How many species does it hold after one time constant?', answer: 31.6, why: '50(1 − e⁻¹) = 50 × 0.632 = 31.6.' }
  ],
  problems: [
    { q: 'Two woods share 18 plant species; one has 40 species and the other 28. What is their Jaccard similarity?', answer: 0.36, tol: 0.02, steps: ['$J = 18/(40 + 28 - 18) = 18/50 = 0.36$.'] },
    { q: 'A new volcanic island heads for 60 species with a time constant of 20 years. How many years does it take to reach 45 species?', answer: 27.7, unit: 'yr', tol: 0.02, steps: ['$45 = 60(1 - e^{-t/20})$, so $e^{-t/20} = 0.25$.', '$t = 20 \\ln 4 = 27.7$ years.'] }
  ],
  applications: [
    'Restoring mines, quarries and degraded land by starting or speeding up succession (nitrogen-fixing nurse plants, topsoil transfer).',
    'Managing grasslands and heaths, which need grazing, mowing or fire to stop them turning into scrub.',
    'Forestry and fire management that mimics natural disturbance regimes.',
    'Predicting how invaders exploit disturbed, early-successional ground.'
  ],
  history: 'Henry Cowles described succession on the sand dunes of Lake Michigan in 1899, reading the sequence from dunes of different ages. Frederic Clements built the climax theory in 1916 and Henry Gleason challenged it in 1926 with his individualistic concept, largely ignored for decades and now the mainstream view.',
  sim: { id: 'eco-island', params: { empty: true } }
},

{
  id: 'biodiversity', parent: 'populations', title: 'Measuring biodiversity', level: 2,
  short: 'Biodiversity is the variety of life, from genes to ecosystems. A community\'s diversity depends on how many species it has (richness) and how evenly the individuals are shared (evenness): the Shannon and Simpson indices combine the two. Larger areas hold more species, roughly as S = cA^z.',
  keywords: ['biodiversity', 'species richness', 'evenness', 'Shannon index', 'Simpson index', 'Pielou evenness', 'effective number of species', 'Hill numbers', 'Chao1', 'species accumulation curve', 'quadrat', 'alpha diversity', 'beta diversity', 'gamma diversity', 'species–area relationship', 'island biogeography', 'hotspots'],
  prereq: ['ecosystems-intro', 'taxonomy', 'math:logarithms'],
  related: ['conservation-biology', 'community-succession', 'competition-niches', 'speciation', 'statistics-bio', 'physics:entropy', 'math:power-functions', 'math:logarithmic-scales'],
  body: `
**Biodiversity** is the variety of life at every level: genes within species, species within communities, and communities and ecosystems across landscapes. About two million species have been named, and estimates of the total run to around nine million eukaryotes — far more if bacteria and archaea are counted. Beetles alone account for some 400 000 described species.

### Richness is not the whole story
The simplest measure is **species richness** $S$, the number of species. But compare two woods, each with 100 trees of five species. In the first, each species has 20 trees; in the second, one species has 96 and the other four one each. Both have $S$ = 5, yet a walker in the second sees almost only one kind of tree. Diversity indices combine richness with **evenness**, how equally the individuals are shared among species.

### The Shannon index
Borrowed from Claude Shannon's theory of information (1948),

$$H' = -\\sum_{i=1}^{S} p_i \\ln p_i$$

where $p_i$ is the proportion of the individuals that belong to species $i$. It measures the uncertainty about the species of an individual picked at random — the same mathematics as [[physics:entropy|entropy]]. $H'$ is 0 for a single species and reaches its maximum, $\\ln S$, when all species are equally common, so **Pielou's evenness** $J' = H'/\\ln S$ runs from 0 to 1. Real communities usually have $H'$ between about 1.5 and 3.5.

### The Simpson index
Edward Simpson (1949) asked a different question: what is the chance that two individuals picked at random belong to the **same** species? That is $\\lambda = \\sum p_i^2$, a measure of dominance. Diversity is its complement $1 - \\lambda$ — the chance that they differ — or its inverse $1/\\lambda$. Simpson's index is governed by the commonest species; Shannon's gives more weight to rare ones.

| | Even wood (20 each) | Dominated wood (96, 1, 1, 1, 1) |
|---|---|---|
| Richness $S$ | 5 | 5 |
| Shannon $H'$ | 1.61 | 0.22 |
| Evenness $J'$ | 1.00 | 0.14 |
| Simpson $1 - \\lambda$ | 0.80 | 0.08 |
| Effective species $e^{H'}$ | 5.0 | 1.25 |
| Effective species $1/\\lambda$ | 5.0 | 1.08 |

### Effective numbers
Indices in different units are hard to compare or to average. Mark Hill (1973) turned them into **effective numbers of species**: the number of equally common species that would give the same value. $e^{H'}$ and $1/\\lambda$ are both effective numbers, and they behave as intuition expects — ten equally common species are exactly twice as diverse as five.

### Sampling: how many did we miss?
Nobody can count every organism, so ecologists sample with quadrats, traps and transects, and the number of species found keeps rising with effort — the **species accumulation curve**. Anne Chao's estimator uses the rarest species in a sample to guess how many were missed: with $F_1$ species seen exactly once and $F_2$ seen exactly twice,

$$\\hat{S} = S_{obs} + \\frac{F_1^2}{2F_2}$$

Many single records mean many species still to find ([[statistics-bio]]).

### Scale: species and area
Robert Whittaker distinguished **α diversity** (within one site), **β diversity** (the turnover between sites) and **γ diversity** (a whole region). Larger areas hold more species — more habitats, larger populations that resist extinction, room for rare species. The **species–area relationship** is a power law,

$$S = cA^z$$

a straight line of slope $z$ on a log–log plot ([[math:power-functions]]). $z$ is typically 0.15–0.25 for nested plots within a continent and 0.25–0.35 for islands, giving Philip Darlington's rule of thumb for West Indian reptiles and amphibians: **ten times the area, twice the species**. Robert MacArthur and E. O. Wilson (1967) explained the island version as a balance between immigration, which falls with distance from the mainland, and extinction, which falls with island size.

### Where diversity is
Diversity rises from the poles to the tropics: a single hectare of Amazonian forest can hold over 250 tree species, against about 35 native trees in the whole of Britain. Norman Myers identified biodiversity **hotspots**: 25 regions covering 1.4 % of the land held 44 % of the world's plant species as endemics, found nowhere else — and most were already badly damaged ([[conservation-biology]]).

> [!key] Diversity combines richness (how many species) and evenness (how equally common). Shannon's H′ = −Σ pᵢ ln pᵢ and Simpson's 1 − Σ pᵢ² both do this; as effective numbers, e^H′ and 1/Σ pᵢ², they read as "equivalent equally common species". Species number grows with area as S = cA^z.
`,
  ideas: [
    'Biodiversity spans genes, species and ecosystems; about two million species are named out of perhaps nine million eukaryotes.',
    'Species richness counts species; evenness measures how equally individuals are shared.',
    'Shannon H′ = −Σ pᵢ ln pᵢ (maximum ln S); Simpson λ = Σ pᵢ² is the chance two random individuals are the same species.',
    'Effective numbers of species (e^H′, 1/λ) make indices comparable and intuitive.',
    'Species number grows with area as S = cA^z, with z about 0.15–0.35.'
  ],
  pitfalls: [
    'The community with more species is always the more diverse — Not if its individuals are dominated by one species; indices weigh evenness as well as richness.',
    'A Shannon index of 3 is "twice as diverse" as 1.5 — H′ is a logarithm. Convert to effective numbers: e³ ≈ 20 species against e^1.5 ≈ 4.5.',
    'Counting the species in a sample gives the true richness — Samples miss rare species; richness rises with sampling effort, so compare equal efforts or estimate the missing species (Chao1).'
  ],
  formulas: [
    {
      name: 'Pielou\'s evenness',
      expr: 'J = H/ln(S)', tex: "J' = \\dfrac{H'}{\\ln S}",
      vars: {
        J: { name: 'evenness (0 to 1)', tex: "J'" },
        H: { name: 'Shannon index', value: 1.2, tex: "H'" },
        S: { name: 'number of species', value: 5, int: true, min: 2 }
      },
      stories: {
        J: 'A sample of {S} species has a Shannon index of {H}. How even is it?',
        H: 'A community of {S} species has an evenness of {J}. What is its Shannon index?'
      }
    },
    {
      name: 'Effective number of species',
      expr: 'D = exp(H)', tex: "D = e^{H'}",
      vars: {
        D: { name: 'effective number of species (equally common species giving the same H′)' },
        H: { name: 'Shannon index', value: 2.3, tex: "H'" }
      },
      note: 'The Simpson counterpart is 1/Σpᵢ². For perfectly even communities both equal S.',
      stories: { D: 'A bird community has a Shannon index of {H}. How many equally common species would give the same diversity?', H: 'What Shannon index corresponds to {D} equally common species?' }
    },
    {
      name: 'Chao1: estimating the species you missed',
      expr: 'Sest = Sobs + F1^2/(2*F2)', tex: '\\hat{S} = S_{obs} + \\dfrac{F_1^2}{2F_2}',
      vars: {
        Sest: { name: 'estimated total number of species', tex: '\\hat{S}' },
        Sobs: { name: 'species observed', value: 30, int: true, tex: 'S_{obs}' },
        F1: { name: 'species seen exactly once (singletons)', value: 8, int: true, tex: 'F_1' },
        F2: { name: 'species seen exactly twice (doubletons)', value: 4, int: true, tex: 'F_2' }
      },
      note: 'A lower bound for richness; if no species was seen twice, use F₁(F₁ − 1)/2 instead.',
      stories: { Sest: 'A trap sample contains {Sobs} species; {F1} were caught once and {F2} twice. How many species are probably present?' }
    },
    {
      name: 'Species–area relationship',
      expr: 'S = c*A^z', tex: 'S = c\\,A^z',
      vars: {
        S: { name: 'number of species' },
        c: { name: 'species on one unit of area', value: 10 },
        A: { name: 'area', q: false, unit: 'km²', value: 1000 },
        z: { name: 'slope on a log–log plot', value: 0.25, min: 0, max: 1 }
      },
      note: 'c depends on the taxon, region and the unit of area; z is typically 0.15–0.25 on continents and 0.25–0.35 for islands.',
      stories: {
        S: 'With c = {c} and z = {z}, how many species would an island of {A} hold?',
        A: 'With c = {c} and z = {z}, how large an area is needed to hold {S} species?',
        z: 'An island of {A} holds {S} species and c = {c}. What is z?'
      }
    }
  ],
  examples: [
    {
      title: 'Two woods compared',
      q: 'Wood 1 has 20 trees of each of five species; wood 2 has 96 of one species and 1 of each of four others. Compare their Shannon and Simpson indices.',
      steps: [
        'Wood 1: all $p_i = 0.2$. $H\' = -5 \\times 0.2 \\ln 0.2 = \\ln 5 = 1.61$; $\\lambda = 5 \\times 0.04 = 0.20$, so $1 - \\lambda = 0.80$.',
        'Wood 2: $H\' = -(0.96 \\ln 0.96 + 4 \\times 0.01 \\ln 0.01) = 0.039 + 0.184 = 0.22$.',
        '$\\lambda = 0.96^2 + 4 \\times 0.01^2 = 0.9216 + 0.0004 = 0.922$, so $1 - \\lambda = 0.078$.',
        'As effective numbers: wood 1 has 5.0 species by either measure; wood 2 has $e^{0.22} = 1.25$ and $1/0.922 = 1.08$.'
      ],
      a: 'Same richness, but wood 1 is about four to five times as diverse in effective species.'
    },
    {
      title: 'Ten times the area',
      q: 'An island of 100 km² holds 20 reptile species. With z = 0.3, how many would an island of 10 000 km² hold?',
      steps: [
        'The area ratio is 100, so the species ratio is $100^{0.3} = 10^{0.6} = 3.98$.',
        '$S = 20 \\times 3.98 \\approx 80$ species. Each tenfold step in area roughly doubles the species ($10^{0.3} = 2.0$).'
      ],
      a: 'About 80 species.'
    },
    {
      title: 'How many beetles did we miss?',
      q: 'Pitfall traps catch 45 beetle species; 12 were caught only once and 6 exactly twice. Estimate the total.',
      steps: [
        '$\\hat{S} = 45 + 12^2/(2 \\times 6) = 45 + 144/12 = 45 + 12 = 57$.',
        'At least a fifth of the species present were probably missed — more trapping would find them.'
      ],
      a: 'About 57 species.'
    }
  ],
  quiz: [
    { q: 'Two meadows each have 8 plant species. In meadow A the species are equally common; in meadow B one grass makes up 80 % of the plants. Which has the higher Shannon index?', choices: ['Meadow A', 'Meadow B', 'They are equal, since richness is equal', 'It cannot be known without the total count'], a: 0, why: 'With equal richness, the more even community has the higher H′; A reaches the maximum ln 8 = 2.08.' },
    { q: 'The Shannon index of a community of S species is largest when all species are equally common, where it equals ln S.', a: true, why: 'Uncertainty about a random individual\'s species is greatest when every species is equally likely.' },
    { q: 'A community has H′ = 2.3. What is its effective number of species?', answer: 10, why: 'e^2.3 ≈ 9.97: it is as diverse as ten equally common species.' },
    { q: 'Simpson\'s λ = Σpᵢ² is the probability that…', choices: ['a species is rare', 'two individuals picked at random belong to the same species', 'a sample contains every species', 'a species goes extinct'], a: 1, why: 'Picking twice (with replacement), the chance both are species i is pᵢ²; summing over species gives λ.' },
    { q: 'With z = 0.25, by what factor does the number of species rise when the area is multiplied by 16?', answer: 2, why: '16^0.25 = 2.' }
  ],
  problems: [
    { q: 'A sample has three species in proportions 0.5, 0.3 and 0.2. What is its Shannon index H′?', answer: 1.03, tol: 0.02, steps: ['$H\' = -(0.5 \\ln 0.5 + 0.3 \\ln 0.3 + 0.2 \\ln 0.2)$.', '$= 0.347 + 0.361 + 0.322 = 1.03$ (the maximum for three species is ln 3 = 1.10).'] },
    { q: 'For the same sample (0.5, 0.3, 0.2), what is the Gini–Simpson index 1 − Σpᵢ²?', answer: 0.62, tol: 0.02, steps: ['$\\sum p_i^2 = 0.25 + 0.09 + 0.04 = 0.38$.', '$1 - 0.38 = 0.62$.'] },
    { q: 'A forest plot of 25 km² holds 150 bird species. With z = 0.2, how many would a 1 km² fragment be expected to hold?', answer: 79, tol: 0.03, steps: ['$S_2 = S_1 (A_2/A_1)^z = 150 \\times (1/25)^{0.2}$.', '$(1/25)^{0.2} = 0.525$, so about 79 species — though a fragment loses species gradually, not at once.'] }
  ],
  applications: [
    'Compare the diversity of two communities, and estimate a population by mark and recapture, in [the diversity calculator](#/tools/cell/ecology).',
    'Monitoring the health of rivers, soils and reefs by changes in diversity indices over time.',
    'Choosing protected areas that capture the most species (hotspots, complementarity).',
    'Microbiome studies, which compare the diversity of gut or soil bacteria with the same indices.',
    'Estimating how many species will eventually be lost as habitat shrinks, from the species–area curve.'
  ],
  history: 'Claude Shannon published his measure of information in 1948 and Edward Simpson his index of concentration in 1949. Olof Arrhenius described the species–area power law in 1921 and Frank Preston analysed it in 1962; Robert MacArthur and E. O. Wilson\'s The Theory of Island Biogeography (1967) explained it, and Daniel Simberloff and Wilson tested it by fumigating tiny mangrove islands in Florida and watching the insects return.',
  sim: ['eco-quadrat', 'eco-island']
},

/* ================================================================ PEOPLE AND THE BIOSPHERE */
{
  id: 'conservation-biology', parent: 'conservation', title: 'Conservation biology', level: 2,
  short: 'Conservation biology is the science of keeping species and ecosystems alive. Species are now disappearing tens to hundreds of times faster than the fossil background, mainly through habitat loss and overexploitation. Small populations face chance, inbreeding and loss of genetic variation; protected areas, recovery programmes and working with people can turn declines around.',
  keywords: ['conservation biology', 'extinction rate', 'background extinction', 'E/MSY', 'sixth mass extinction', 'habitat loss', 'fragmentation', 'extinction debt', 'minimum viable population', 'effective population size', 'inbreeding depression', 'extinction vortex', 'genetic rescue', 'IUCN Red List', 'protected areas', '30 by 30', 'Living Planet Index'],
  prereq: ['biodiversity', 'population-growth', 'genetic-drift'],
  related: ['invasive-species', 'climate-ecosystems', 'ecosystem-services', 'community-succession', 'hardy-weinberg', 'gene-flow-mutation', 'speciation'],
  body: `
Conservation biology is the science of keeping species, populations and ecosystems alive. Michael Soulé called it a "crisis discipline" (1985), because it must often act before the evidence is complete.

### How fast are species disappearing?
Extinction is normal: a species typically lasts one to ten million years, and the fossil record gives a **background rate** of very roughly 0.1–2 extinctions per million species per year (E/MSY). Since 1500, about 85 mammal and 160 bird species are known to have gone extinct, and for the well-studied groups modern rates are estimated at tens to hundreds of times the background. The IPBES global assessment (2019) judged that around a million species are threatened with extinction. The **Living Planet Index** fell by an average of 73 % between 1970 and 2020 (WWF, 2024) — the average decline of tens of thousands of monitored vertebrate populations, not the loss of 73 % of all animals. Five mass extinctions in the last half-billion years each removed three-quarters or more of species; recorded extinctions so far are a small fraction of that, which is exactly why there is still time to act.

### What drives the losses
IPBES ranks the direct drivers, globally: **(1) changing use of land and sea** — above all habitat cleared for farming; **(2) direct exploitation** — hunting, fishing, logging and the wildlife trade; **(3) climate change** ([[climate-ecosystems]]); **(4) pollution**; and **(5) invasive species** ([[invasive-species]]), which top the list on islands.

Habitat loss acts with a delay. By the species–area relationship ([[biodiversity]]), losing 90 % of a habitat with $z$ = 0.25 eventually costs $1 - 0.1^{0.25}$ = 44 % of its species — but not at once. Small remnant populations linger for decades before they vanish: an **extinction debt**. Fragmentation makes matters worse, turning one large habitat into many small, isolated patches with long edges exposed to wind, predators, fire and people.

### The problems of being few
Small populations face dangers beyond whatever made them small:
- **Demographic chance** — a run of male births, a bad year for survival; a population of ten can die out from bad luck alone.
- **Environmental variation and catastrophes** — a hard winter, a fire, an epidemic.
- **Genetic erosion** — [[genetic-drift]] removes a fraction $1/(2N_e)$ of the heterozygosity every generation, and inbreeding exposes harmful recessive alleles (inbreeding depression).

Each makes the others worse, a downward spiral called the **extinction vortex**. What matters genetically is the **effective population size** $N_e$, often a small fraction of the census count, because few individuals breed, the sex ratio is skewed and numbers fluctuate. An old rule of thumb — $N_e$ of at least 50 to avoid inbreeding depression in the short term and 500 to keep evolving — has been revised to 100 and 1000. A **minimum viable population** is the size that gives, say, a 99 % chance of persisting for 40 generations; for vertebrates it is often a few thousand. Joel Berger (1990) found that every herd of desert bighorn sheep with fewer than 50 animals died out within 50 years, while herds of more than 100 persisted.

**Genetic rescue** can reverse the spiral. By the early 1990s about 20–30 Florida panthers survived, many with kinked tails, heart defects and poor sperm. Eight female pumas from Texas were released in 1995; the population has since grown to roughly 120–230 adults, with far fewer defects.

### The Red List
The IUCN Red List assesses species against numerical criteria — rate of decline, range size, population size, probability of extinction.

| Category | In short |
|---|---|
| Extinct (EX) | no reasonable doubt the last individual has died |
| Extinct in the Wild (EW) | survives only in captivity or cultivation |
| Critically Endangered (CR) | extremely high risk, e.g. under 250 mature individuals and declining |
| Endangered (EN) | very high risk, e.g. under 2500 mature individuals and declining |
| Vulnerable (VU) | high risk, e.g. under 10 000 mature individuals and declining |
| Near Threatened (NT) | close to qualifying |
| Least Concern (LC) | widespread and abundant |
| Data Deficient (DD) | too little known to judge |

CR, EN and VU together count as **threatened**. By 2024 more than 160 000 species had been assessed and over 45 000 of them were threatened — among them about 41 % of amphibians, over a quarter of mammals and one bird species in eight.

### What works
- **Protected areas** covered about 17.6 % of the land and 8.4 % of the ocean in 2024; the Kunming–Montreal Global Biodiversity Framework (2022) aims for 30 % of each by 2030. Size, connection by corridors and good management matter as much as area on a map.
- **Recovery programmes**: the California condor fell to 27 birds, all taken into captivity in 1987, and numbered more than 500 in the 2020s; rats have been removed from hundreds of islands, bringing back seabirds; trade in endangered species is controlled under CITES (1975).
- **Working with people**: conservation lasts where local people share its benefits and its decisions.

Conservation works when it is done: one study estimated that action since 1993 prevented 21–32 bird and 7–16 mammal extinctions.

> [!key] Extinctions are running far above the background rate, driven mainly by habitat loss and overexploitation. Small populations face chance, inbreeding and drift; the effective size, not the head count, sets the loss of genetic variation. Protecting and reconnecting habitat, recovering species and involving people turn declines around.
`,
  ideas: [
    'Modern extinction rates are tens to hundreds of times the fossil background of roughly 0.1–2 per million species per year.',
    'Land- and sea-use change and direct exploitation are the leading drivers, followed by climate change, pollution and invasive species.',
    'Habitat loss leaves an extinction debt: species–area curves predict losses that play out over decades.',
    'Small populations suffer demographic chance, catastrophes, drift and inbreeding — the extinction vortex; Nₑ is usually far below the census size.',
    'The IUCN Red List ranks extinction risk by quantitative criteria; protected areas, recovery programmes and community involvement work.'
  ],
  pitfalls: [
    'A population of 1000 animals has an effective size of 1000 — Only if all breed equally with an even sex ratio and a steady size. Skewed sex ratios, unequal breeding success and crashes make Nₑ often a tenth of the census size or less.',
    'The Living Planet Index shows that 73 % of the world\'s wild animals have disappeared since 1970 — It is the average trend of monitored populations; some populations grew, many shrank a great deal. It signals a steep average decline, not a head count.',
    'Once habitat is destroyed, the species it held are gone at once — Many linger in remnants for decades before disappearing (extinction debt), which means restoration can still save them.'
  ],
  formulas: [
    {
      name: 'Effective population size with an unequal sex ratio',
      expr: 'Ne = 4*Nm*Nf/(Nm + Nf)', tex: 'N_e = \\dfrac{4N_mN_f}{N_m + N_f}',
      vars: {
        Ne: { name: 'effective population size', tex: 'N_e' },
        Nm: { name: 'breeding males', value: 10, tex: 'N_m' },
        Nf: { name: 'breeding females', value: 90, tex: 'N_f' }
      },
      note: 'Equals the head count only when the sexes are equal in number; a few dominant males can make Nₑ tiny.',
      stories: {
        Ne: 'A herd has {Nm} breeding males and {Nf} breeding females. What is its effective size?',
        Nm: 'A herd has {Nf} breeding females. How many breeding males give an effective size of {Ne}?'
      }
    },
    {
      name: 'Loss of heterozygosity by drift',
      expr: 'Ht = H0*(1 - 1/(2*Ne))^t', tex: 'H_t = H_0\\left(1 - \\dfrac{1}{2N_e}\\right)^t',
      vars: {
        Ht: { name: 'heterozygosity after t generations', tex: 'H_t' },
        H0: { name: 'starting heterozygosity', value: 0.5, tex: 'H_0' },
        Ne: { name: 'effective population size', value: 50, tex: 'N_e' },
        t: { name: 'generations', value: 20 }
      },
      note: 'Ignores new mutations and immigration, which put variation back.',
      stories: {
        Ht: 'A population with Nₑ = {Ne} starts with heterozygosity {H0}. What is left after {t} generations?',
        Ne: 'A population must keep {Ht} of heterozygosity after {t} generations, starting from {H0}. What effective size does that need?'
      }
    },
    {
      name: 'Species eventually lost with habitat',
      expr: 'f = (1 - h)^z', tex: 'f = (1 - h)^z',
      vars: {
        f: { name: 'fraction of species remaining', q: 'ratio', unit: '%' },
        h: { name: 'fraction of habitat lost', q: 'ratio', unit: '%', value: 90, min: 0, max: 100 },
        z: { name: 'species–area exponent', value: 0.25, min: 0.05, max: 1 }
      },
      note: 'From S = cA^z. The losses play out over decades (extinction debt), and fragmentation or matrix quality can make them larger or smaller.',
      stories: {
        f: 'A region loses {h} of its forest. With z = {z}, what fraction of its forest species will eventually remain?',
        h: 'How much habitat can be lost before only {f} of the species remain, with z = {z}?'
      }
    },
    {
      name: 'Extinction rate in extinctions per million species-years',
      expr: 'E = 1e6*n/(S*t)', tex: 'E = \\dfrac{10^6\\,n}{S\\,t}',
      vars: {
        E: { name: 'extinction rate (E/MSY)' },
        n: { name: 'extinctions recorded', value: 85 },
        S: { name: 'species in the group', value: 5500 },
        t: { name: 'period', q: false, unit: 'yr', value: 524 }
      },
      note: 'Background rates from fossils are roughly 0.1–2 E/MSY. Recorded extinctions are a minimum: many species vanish unrecorded.',
      stories: { E: 'Since 1500 ({t}), {n} of about {S} mammal species are known to have gone extinct. What is the rate in E/MSY?' }
    }
  ],
  examples: [
    {
      title: 'A harem-breeding herd',
      q: 'A herd of 100 has 10 breeding males and 90 breeding females. What is its effective size, and how much heterozygosity does it lose per generation?',
      steps: [
        '$N_e = 4 \\times 10 \\times 90/(10 + 90) = 3600/100 = 36$.',
        'Loss per generation: $1/(2N_e) = 1/72 = 1.4$ % — as fast as in an ideal population of 36, not 100.'
      ],
      a: 'Nₑ = 36; about 1.4 % of heterozygosity lost per generation.'
    },
    {
      title: 'Nine-tenths of a forest',
      q: 'A region clears 90 % of its forest. With z = 0.25, what fraction of the forest species will eventually be lost?',
      steps: [
        'Remaining: $f = 0.1^{0.25} = 0.56$.',
        'So about 44 % will eventually be lost — though many will linger for decades, giving time for restoration and reconnection.'
      ],
      a: 'About 44 % in the long run.'
    },
    {
      title: 'Mammals against the background',
      q: 'About 85 of roughly 5500 mammal species are known to have gone extinct since 1500. Compare the rate with a background of about 2 E/MSY.',
      steps: [
        '$E = 10^6 \\times 85/(5500 \\times 524) = 29.5$ E/MSY.',
        'That is about 15 times the background — and most of those extinctions happened in the last two centuries, so the recent rate is higher still.'
      ],
      a: 'About 30 E/MSY, some 15 times the background.'
    }
  ],
  quiz: [
    { q: 'According to the IPBES global assessment, what is the leading direct driver of biodiversity loss worldwide?', choices: ['Climate change', 'Changes in land and sea use, above all habitat conversion', 'Invasive species', 'Pollution'], a: 1, why: 'Clearing and converting habitat for farming and other uses ranks first, with direct exploitation second; climate change is rising fast.' },
    { q: 'A population has 1 breeding male and 49 breeding females. What is its effective size?', answer: 3.92, why: '4 × 1 × 49/(1 + 49) = 196/50 = 3.9 — the whole herd behaves genetically like about four individuals.' },
    { q: 'The Living Planet Index fell by 73 % between 1970 and 2020, so 73 % of the world\'s wild animals have died out.', a: false, why: 'The index averages the trends of monitored populations; it signals a steep average decline, not the loss of a fixed share of all animals.' },
    { q: 'What is an extinction debt?', choices: ['The cost of saving a species', 'Future extinctions already set in motion by past habitat loss, not yet happened', 'Species that were never described', 'Money owed under conservation treaties'], a: 1, why: 'Populations in remnants may take decades to disappear after their habitat has shrunk below what can sustain them.' },
    { q: 'Why can adding a few individuals from another population rescue a small, inbred population?', choices: ['It changes the species', 'New alleles mask harmful recessives and restore genetic variation', 'The newcomers are always stronger', 'It lowers the effective population size'], a: 1, why: 'Genetic rescue restores heterozygosity; in Florida panthers, eight Texas pumas reduced heart defects and kinked tails and the population grew.' }
  ],
  problems: [
    { q: 'A population with Nₑ = 25 starts with heterozygosity 0.6. What is its heterozygosity after 30 generations?', answer: 0.327, tol: 0.02, steps: ['$H_{30} = 0.6\\,(1 - 1/50)^{30} = 0.6 \\times 0.98^{30}$.', '$0.98^{30} = 0.545$, so $H_{30} = 0.327$.'] },
    { q: 'A wetland loses 70 % of its area. With z = 0.3, what percentage of its species will eventually be lost?', answer: 30, unit: '%', tol: 0.03, steps: ['Remaining: $0.3^{0.3} = e^{0.3 \\ln 0.3} = e^{-0.361} = 0.697$.', 'Lost: about 30 %.'] }
  ],
  applications: [
    'Setting targets and priorities for protected areas and wildlife corridors.',
    'Captive breeding, reintroduction and genetic management of endangered species.',
    'Red List assessments that guide laws, trade controls and funding.',
    'Environmental impact assessment of roads, dams and new farmland.'
  ],
  history: 'The word "biodiversity" spread from a 1986 forum in Washington and E. O. Wilson\'s book of that name (1988). Michael Soulé\'s "What is conservation biology?" (1985) defined the new field; the 1970s debate over whether a single large reserve or several small ones would hold more species ("SLOSS") was one of its first applications of island biogeography.',
  sim: 'eco-island'
},

{
  id: 'climate-ecosystems', parent: 'conservation', title: 'Climate change and living things', level: 2,
  short: 'As the world warms, species move poleward and uphill, spring events come earlier and partners can fall out of step, while corals bleach and heat, drought and acidifying seas push others beyond their limits. The speed of today\'s change is what makes it dangerous.',
  keywords: ['climate change', 'global warming', 'range shift', 'velocity of climate change', 'phenology', 'phenological mismatch', 'coral bleaching', 'degree heating weeks', 'zooxanthellae', 'ocean acidification', 'Q10', 'temperature-dependent sex determination', 'escalator to extinction', 'great tit', 'pied flycatcher'],
  prereq: ['carbon-cycle', 'biomes', 'population-growth'],
  related: ['conservation-biology', 'photoperiodism', 'biological-rhythms', 'migration-navigation', 'thermoregulation-animals', 'invasive-species', 'chemistry:henrys-law', 'physics:thermal-radiation'],
  body: `
The climate has always changed, and species have always moved with it: at the end of the last ice age, trees spread north across Europe and North America at a few hundred metres a year. What is new is the speed. The world was about 1.1 °C warmer in 2011–2020 than in 1850–1900 (IPCC, 2021), and 2024 was the first calendar year more than 1.5 °C above that baseline (WMO), mainly because of the CO₂ and other greenhouse gases people have added ([[carbon-cycle]]). Living things are responding in three ways: moving, changing their timing, or failing.

### Moving: range shifts
As temperatures shift, so do species. A synthesis of studies across many groups (Chen and colleagues, 2011) found species moving to higher latitudes at a median of about 17 km per decade and to higher elevations at about 11 m per decade — fastest where warming was fastest. At sea, where temperature zones move faster and animals disperse more freely, the leading edges of ranges have moved about 70 km per decade.

The **velocity of climate change** — how fast a given temperature moves across the landscape — is the warming rate divided by the spatial temperature gradient, $v = (dT/dt)/(dT/dx)$. On a flat plain, where temperature changes by only about 0.6 °C per 100 km, a warming of 0.3 °C per decade moves the isotherms some 50 km per decade. On a steep mountainside the same temperature change is found a few hundred metres uphill. Mountains therefore offer refuges — until a species reaches the summit. On a mountain in the Peruvian Andes, birds shifted uphill so much between 1985 and 2017 that several of the highest species vanished from it: an "escalator to extinction".

### Changing timing: phenology and mismatch
Spring comes earlier: leaves open, flowers bloom, insects emerge and birds lay eggs earlier, by an average of about 2–3 days per decade in the Northern Hemisphere. Robert Marsham's "indications of spring", recorded in Norfolk from 1736, and the phenological records of amateur naturalists are now valuable data. But species respond to different cues — temperature, or day length, which warming does not change ([[photoperiodism]]) — so partners can drift apart: a **phenological mismatch**. In the Netherlands the peak of winter-moth caterpillars, food for the chicks of great tits and pied flycatchers, moved earlier by about two weeks after 1980. The flycatchers, wintering in Africa and timing their return by day length there, arrived too late in places with the earliest caterpillar peaks — and there their numbers fell by about 90 % in two decades.

### Failing: heat, drought and bleaching
- **Coral bleaching.** Reef-building corals live close to their upper temperature limit. When the water stays about 1 °C above the usual summer maximum for weeks, they expel the symbiotic algae (zooxanthellae) that supply most of their food and colour; if the heat lasts, they starve. Heat stress is measured in **degree heating weeks** (DHW), the excess heat above the summer maximum accumulated over 12 weeks: about 4 °C-weeks bring significant bleaching, 8 widespread bleaching and death. Mass bleaching was almost unknown before the 1980s. The fourth global bleaching event, which began in 2023, had exposed about 84 % of the world's reef area to bleaching-level heat by 2025 (NOAA).
- **Ocean acidification.** Surface pH has fallen by about 0.1, making it harder for corals, molluscs and some plankton to build carbonate skeletons.
- **Heat, drought and fire.** Drought kills trees outright, bark beetles survive milder winters and kill millions of hectares of conifers, and fire seasons lengthen.
- **Sex ratios.** In sea turtles the temperature of the nest decides the sex; on warm beaches of the northern Great Barrier Reef, over 99 % of young green turtles are now female.
- **Metabolism.** An ectotherm's metabolic rate rises by a factor $Q_{10}$ of about 2–3 for each 10 °C, while warm water holds less oxygen ([[chemistry:henrys-law]]); fish in warming water need more oxygen and get less.

### Adaptation and its limits
Some species adjust or evolve fast: in Finland, brown tawny owls have become commoner than grey ones as snowy winters have shrunk. But evolution is slowest in long-lived species with small populations, and range shifts are blocked by farmland, cities and the tops of mountains. The IPCC (2022) assessed that at 1.5 °C of warming 3–14 % of the land species studied are likely to face a very high risk of extinction, rising to 3–29 % at 3 °C.

> [!key] Species respond to warming by moving poleward and uphill, by shifting the timing of their life cycles, or by suffering where they cannot do either. Mismatches between partners and heat waves at sea are among the fastest-acting effects; the rate of change matters as much as its size.
`,
  ideas: [
    'Species are moving poleward (median about 17 km per decade on land) and uphill (about 11 m per decade).',
    'The velocity of climate change is the warming rate divided by the spatial temperature gradient: fast on plains, slow on mountains.',
    'Spring events are advancing by about 2–3 days per decade; different cues can cause mismatches between predators and prey.',
    'Corals bleach when heat stress accumulates (degree heating weeks); mass bleaching is now recurrent.',
    'The IPCC projects extinction risks that rise steeply with each increment of warming.'
  ],
  pitfalls: [
    'A bleached coral is dead — It has expelled its algae and is starving; if the heat ends soon enough it can regain them and recover, although repeated bleaching leaves too little time.',
    'Species can simply move to stay in their climate — Many cannot disperse fast enough, their habitats are blocked by farms and cities, and mountain-top species run out of mountain.',
    'Earlier springs are good for everything that lives there — Species that time their year by day length, or migrate from far away, can miss the food peak their young depend on.'
  ],
  formulas: [
    {
      name: 'Velocity of climate change',
      expr: 'v = w/g', tex: 'v = \\dfrac{\\dot{T}}{g}',
      vars: {
        v: { name: 'speed at which a temperature zone moves', q: false, unit: 'km/decade' },
        w: { name: 'warming rate, dT/dt', q: false, unit: '°C/decade', value: 0.3, tex: '\\dot{T}' },
        g: { name: 'spatial temperature gradient, dT/dx', q: false, unit: '°C/km', value: 0.006 }
      },
      note: 'About 0.006 °C/km on plains (0.6 °C per 100 km of latitude); on mountainsides a hundred times steeper, so velocities are small there.',
      stories: {
        v: 'The climate warms by {w} across a plain where temperature falls {g} towards the pole. How fast must a species move to keep the same temperature?',
        g: 'A species can spread only {v}. How steep a temperature gradient would let it keep up with warming of {w}?'
      }
    },
    {
      name: 'How far uphill a warming moves a species',
      expr: 'dh = dT/G', tex: '\\Delta h = \\dfrac{\\Delta T}{\\Gamma}',
      vars: {
        dh: { name: 'rise in elevation', q: false, unit: 'km', tex: '\\Delta h' },
        dT: { name: 'warming', q: false, unit: '°C', value: 1.2, tex: '\\Delta T' },
        G: { name: 'lapse rate', q: false, unit: '°C/km', value: 6.5, tex: '\\Gamma' }
      },
      stories: { dh: 'How far uphill must a mountain species move to keep its temperature after a warming of {dT}, with a lapse rate of {G}?' }
    },
    {
      name: 'The Q₁₀ rule',
      expr: 'R2 = R1*Q10^((T2 - T1)/10)', tex: 'R_2 = R_1\\,Q_{10}^{\\,(T_2 - T_1)/10}',
      vars: {
        R2: { name: 'metabolic rate at T₂', q: 'power', unit: 'mW', tex: 'R_2' },
        R1: { name: 'metabolic rate at T₁', q: 'power', unit: 'mW', value: 10, tex: 'R_1' },
        Q10: { name: 'factor per 10 °C', value: 2.5, tex: 'Q_{10}' },
        T2: { name: 'new body temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_2' },
        T1: { name: 'old body temperature', q: 'temperature', unit: '°C', value: 15, tex: 'T_1' }
      },
      note: 'For ectotherms, whose body temperature follows their surroundings. Q₁₀ is about 2–3 for most metabolic processes.',
      practice: { unknowns: ['R2', 'Q10', 'T2'] },
      stories: {
        R2: 'A fish uses {R1} at {T1}. With Q₁₀ = {Q10}, what does it use when the water warms to {T2}?',
        Q10: 'A beetle\'s metabolic rate rises from {R1} at {T1} to {R2} at {T2}. What is its Q₁₀?'
      }
    },
    {
      name: 'Degree heating weeks',
      expr: 'DHW = n*dT', tex: '\\mathrm{DHW} = n\\,\\Delta T',
      vars: {
        DHW: { name: 'accumulated heat stress (°C-weeks)', tex: '\\mathrm{DHW}' },
        n: { name: 'weeks of heat stress', value: 6 },
        dT: { name: 'excess over the usual summer maximum', q: false, unit: '°C', value: 1.2, tex: '\\Delta T' }
      },
      note: 'A simplification of NOAA\'s index, which sums weekly excesses of at least 1 °C over a 12-week window. About 4 means significant bleaching, 8 widespread bleaching and mortality.',
      stories: { DHW: 'A reef stays {dT} above its summer maximum for {n} weeks. How much heat stress has built up?', n: 'How many weeks at {dT} above the summer maximum give {DHW} °C-weeks?' }
    }
  ],
  examples: [
    {
      title: 'Plain and mountain',
      q: 'The climate warms by 0.3 °C per decade. How fast do temperature zones move on a plain (0.006 °C per km) and on a mountainside whose temperature falls by 2 °C per horizontal kilometre?',
      steps: [
        'Plain: $v = 0.3/0.006 = 50$ km per decade.',
        'Mountainside: $v = 0.3/2 = 0.15$ km = 150 m per decade.',
        'On the plain a plant must spread 50 km a decade to keep its climate; on the mountain, a short walk uphill — until it reaches the top.'
      ],
      a: '50 km per decade on the plain; 150 m per decade on the slope.'
    },
    {
      title: 'Moving uphill',
      q: 'After a warming of 1.2 °C, how far uphill must an alpine plant shift to keep the same temperature, with a lapse rate of 6.5 °C/km?',
      steps: ['$\\Delta h = 1.2/6.5 = 0.185$ km, about 185 m.', 'On a peak only 150 m above the plant\'s present upper limit, there is no room left.'],
      a: 'About 185 m.'
    },
    {
      title: 'A marine heatwave',
      q: 'A reef stays 1.5 °C above its usual summer maximum for 6 weeks. How severe is the heat stress?',
      steps: ['DHW = 6 × 1.5 = 9 °C-weeks.', 'Above 8: widespread bleaching and significant coral death are expected.'],
      a: '9 degree heating weeks — severe.'
    }
  ],
  quiz: [
    { q: 'In which directions are most species\' ranges shifting as the climate warms?', choices: ['Towards the equator and downhill', 'Towards the poles and uphill', 'East and west', 'They are not shifting'], a: 1, why: 'Both carry a species towards cooler conditions; the median rates are about 17 km per decade poleward and 11 m per decade uphill.' },
    { q: 'Why did Dutch pied flycatchers decline where the caterpillar peak had advanced most?', choices: ['The caterpillars became poisonous', 'The birds time their return from Africa by day length there, so they arrived too late for the food peak', 'Great tits drove them out', 'Warm springs killed the eggs'], a: 1, why: 'Their cue did not change while their food\'s timing did: a phenological mismatch.' },
    { q: 'A bleached coral is already dead.', a: false, why: 'Bleaching is the loss of the symbiotic algae. Corals can recover if the heat ends soon; prolonged or repeated heat kills them.' },
    { q: 'A reef stays 1.2 °C above its summer maximum for 5 weeks. How many degree heating weeks is that?', answer: 6, why: '5 × 1.2 = 6 °C-weeks: significant bleaching expected.' },
    { q: 'An insect has Q₁₀ = 2. By what factor does its metabolic rate rise if it warms by 5 °C?', answer: 1.41, why: '2^(5/10) = √2 ≈ 1.41.' }
  ],
  problems: [
    { q: 'How far uphill, in metres, must a species move to escape 2 °C of warming, with a lapse rate of 6 °C per km?', answer: 333, unit: 'm', tol: 0.02, steps: ['$\\Delta h = 2/6 = 0.333$ km = 333 m.'] },
    { q: 'A lizard\'s metabolic rate is 8 mW at 15 °C. With Q₁₀ = 2.3, what is it at 25 °C?', answer: 18.4, unit: 'mW', tol: 0.02, steps: ['$R_2 = 8 \\times 2.3^{(25 - 15)/10} = 8 \\times 2.3 = 18.4$ mW.'] }
  ],
  applications: [
    'Designing protected-area networks and corridors that let species move with the climate.',
    'Coral reef early-warning systems based on satellite sea temperatures and degree heating weeks.',
    'Assisted migration of trees and other species that cannot move fast enough by themselves.',
    'Using citizen-science records of flowering and bird arrival to track the changing seasons.'
  ],
  history: 'Robert Marsham began recording "indications of spring" on his Norfolk estate in 1736, and his family kept it up for over two centuries. Camille Parmesan showed in 1996 that Edith\'s checkerspot butterfly had shifted northwards and uphill in western North America, one of the first clear range shifts linked to warming.',
  sim: 'eco-carbon'
},

{
  id: 'invasive-species', parent: 'conservation', title: 'Invasive species', level: 2,
  short: 'People carry species around the world, deliberately and by accident. Most newcomers fail, but a few spread explosively where they have no enemies and harm native life, farming or health — like rabbits and cane toads in Australia. An invader spreads as a wave whose speed depends on its growth rate and how far it disperses.',
  keywords: ['invasive species', 'alien species', 'introduced species', 'tens rule', 'enemy release', 'propagule pressure', 'lag phase', 'rabbits in Australia', 'myxomatosis', 'cane toad', 'spatial sorting', 'brown tree snake', 'Fisher–Skellam', 'travelling wave', 'biological control', 'biosecurity', 'eradication'],
  prereq: ['population-growth', 'competition-niches', 'predator-prey'],
  related: ['conservation-biology', 'coevolution', 'community-succession', 'natural-selection', 'ecosystem-services', 'math:heat-equation', 'medicine:infection-spread'],
  body: `
Species have always spread, but people now carry them across oceans in hours — in ships' ballast water, on nursery plants and timber, as pets, crops and deliberate introductions. Most newcomers die out. A few establish, and a small fraction of those become **invasive**: spreading fast and harming native species, ecosystems, farming or health.

### The tens rule
Mark Williamson and Alastair Fitter (1996) found that, very roughly, one in ten imported species escapes into the wild, one in ten of those establishes a self-sustaining population, and one in ten of those becomes a pest — about one in a thousand overall. The rule is rough (for vertebrates the fractions are often much higher), but it explains why invasions seem unpredictable. Many successful invaders also sit quietly for years or decades before they spread — a **lag phase** — while they adapt or wait for the right conditions.

### Why some succeed
- **Enemy release.** An invader arrives without the predators, parasites and diseases that held it in check at home.
- **Naïve natives.** Prey that have never met that kind of predator do not recognise it. The brown tree snake, arriving on Guam with military cargo after the Second World War, wiped out 10 of the island's 12 native forest birds.
- **Disturbance.** Roadsides, farmland and burnt ground favour fast-growing colonists ([[community-succession]]).
- **Propagule pressure.** Many individuals, released many times, make establishment far more likely.

### Rabbits in Australia
In 1859 Thomas Austin released two dozen European rabbits near Geelong in Victoria, for hunting. With mild winters, pasture everywhere and few predators, they spread at up to about 100 km a year — the fastest colonisation by a mammal ever recorded — and by the 1920s may have numbered ten billion. They stripped the vegetation, caused erosion and pushed small native mammals towards extinction. Fences failed; the three rabbit-proof fences of Western Australia, built between 1901 and 1907, ran for more than 3000 km. In 1950 the myxoma virus was released and at first killed over 99 % of infected rabbits. Within a few years the virus had evolved to be less deadly and the rabbits more resistant — a textbook case of [[coevolution]]. A second virus, rabbit haemorrhagic disease, escaped from field trials in 1995, and rabbits are evolving resistance to it too.

### Cane toads
About a hundred cane toads were brought from Hawaii to Queensland in 1935 to eat beetles in the sugar cane, which they never controlled. Their descendants, estimated at over 200 million, now cover more than a million square kilometres of northern and eastern Australia. Glands in their skin hold toxins that kill the native predators that try to eat them — quolls, goannas, freshwater crocodiles and snakes. The invasion front has **accelerated**, from about 10 km a year in the 1940s–60s to 50–60 km a year in the tropical north by the 2000s. Toads at the front have longer legs and travel farther each night: the fastest dispersers keep ending up at the front together and breed with one another, so dispersal itself evolves — **spatial sorting**.

### Spreading as a wave
R. A. Fisher (1937) and J. G. Skellam (1951) showed that a population growing at rate $r$ and wandering at random with a diffusion coefficient $D$ ([[math:heat-equation]]) spreads as a travelling wave of constant speed

$$v = 2\\sqrt{rD}$$

so the radius of the invaded area — the square root of its area — grows in a straight line with time. Skellam checked it against muskrats spreading across central Europe from five animals released near Prague in 1905. When invaders spread faster than this, it is usually because a few individuals travel very far (seeds carried by birds, hitch-hikers on vehicles) or because dispersal evolves at the front, as with the toads.

### Costs and control
The IPBES assessment of invasive alien species (2023) counted over 37 000 established alien species worldwide, more than 3500 of them harmful. Invasives played a part in about 60 % of recorded extinctions, and their yearly cost passed 423 billion US dollars in 2019, having roughly quadrupled every decade since 1970. **Prevention** — biosecurity at borders, treating ballast water — is far cheaper than cure. **Eradication** works on islands (rats, goats, cats) and early in an invasion; later the aim becomes containment. **Biological control** brings in an invader's natural enemies after careful host-specificity testing: the moth *Cactoblastis cactorum* cleared prickly pear from some 25 million hectares of Queensland and New South Wales in the late 1920s and 1930s. The cane toad was a biological control agent too — released with no such testing.

> [!key] Of the species people move, only a small fraction become invasive, typically those freed from their enemies or meeting naïve natives in disturbed habitats. An invader spreads as a wave at speed 2√(rD), faster if some individuals jump far or dispersal evolves. Prevention is far cheaper than control.
`,
  ideas: [
    'Very roughly one in ten introduced species escapes, one in ten of those establishes and one in ten of those becomes a pest (the tens rule).',
    'Invaders succeed through enemy release, naïve native prey, disturbance and repeated introductions.',
    'Rabbits and cane toads in Australia show explosive spread, ecological damage and evolution in action.',
    'Random dispersal plus growth gives a travelling wave with speed v = 2√(rD); long-distance jumps and evolving dispersal make fronts faster.',
    'Prevention and early eradication are far cheaper than long-term control; biological control needs careful testing.'
  ],
  pitfalls: [
    'All non-native species are harmful — Most introduced species never establish, and many that do cause little harm; many crops are introduced species. "Invasive" means one that spreads and causes damage.',
    'An invader that has been quiet for years is safe — Many invasions have a long lag phase before explosive spread, while the species adapts or waits for the right conditions.',
    'Introducing a predator is a safe, natural fix — Without testing, the control agent can become an invader itself, as the cane toad did.'
  ],
  formulas: [
    {
      name: 'Speed of an invasion front (Fisher–Skellam)',
      expr: 'v = 2*sqrt(r*D)', tex: 'v = 2\\sqrt{rD}',
      vars: {
        v: { name: 'speed of the front', q: false, unit: 'km/yr' },
        r: { name: 'intrinsic rate of increase', q: false, unit: '1/yr', value: 0.5 },
        D: { name: 'diffusion coefficient (spread by random movement)', q: false, unit: 'km²/yr', value: 50 }
      },
      note: 'For random, short-range dispersal. Long-distance jumps make real fronts faster and accelerating.',
      stories: {
        v: 'An invader grows at r = {r} and disperses with D = {D}. How fast does its front advance?',
        D: 'A front advances at {v} for a species with r = {r}. What diffusion coefficient does that imply?'
      }
    },
    {
      name: 'Area invaded by a circular front',
      expr: 'A = pi*(v*t)^2', tex: 'A = \\pi\\,(v\\,t)^2',
      vars: {
        A: { name: 'area occupied', q: false, unit: 'km²' },
        v: { name: 'speed of the front', q: false, unit: 'km/yr', value: 10 },
        t: { name: 'years since the release', q: false, unit: 'yr', value: 50 }
      },
      note: 'From a single release point in open country, ignoring coasts and barriers. √(A/π) grows in a straight line with time — Skellam\'s test.',
      stories: { A: 'An invader\'s front advances at {v}. What area does it occupy {t} after its release?', t: 'An invader spreading at {v} has occupied {A}. How long ago was it released?' }
    },
    {
      name: 'The tens rule',
      expr: 'Np = Ni*p^3', tex: 'N_p = N_i\\,p^3',
      vars: {
        Np: { name: 'expected number that become pests', tex: 'N_p' },
        Ni: { name: 'species imported', value: 2000, tex: 'N_i' },
        p: { name: 'fraction passing each stage (escape, establish, spread)', q: 'ratio', unit: '%', value: 10, min: 0, max: 100 }
      },
      note: 'A rough statistical rule, not a law; vertebrates and species introduced deliberately and repeatedly do far "better".',
      stories: { Np: 'A country imports {Ni} ornamental plant species. If {p} pass each of three stages, how many become pests?' }
    }
  ],
  examples: [
    {
      title: 'Cane toads speed up',
      q: 'Suppose toads grow at r = 0.5 per year. The front advanced about 10 km a year in the 1950s and 55 km a year in the 2000s. What diffusion coefficients do these imply?',
      steps: [
        'Rearranged: $D = v^2/(4r)$.',
        '1950s: $D = 10^2/(4 \\times 0.5) = 50$ km² per year.',
        '2000s: $D = 55^2/2 = 1513$ km² per year — about 30 times more dispersive. Growth did not change much; the toads at the front had evolved to travel farther.'
      ],
      a: 'About 50 and 1500 km² per year.'
    },
    {
      title: 'An invading plant',
      q: 'A weed grows at r = 0.3 per year and spreads with D = 12 km² per year. How fast does its front move, and how much land does it cover 40 years after a single escape?',
      steps: [
        '$v = 2\\sqrt{0.3 \\times 12} = 2\\sqrt{3.6} = 3.8$ km per year.',
        'After 40 years the radius is $3.8 \\times 40 = 152$ km, so $A = \\pi \\times 152^2 \\approx 72\\,000$ km².',
        'Early detection matters: after 5 years the radius is only 19 km and the patch about 1100 km² — still possible to contain.'
      ],
      a: 'About 3.8 km a year; roughly 72 000 km² after 40 years.'
    }
  ],
  quiz: [
    { q: 'What is "enemy release"?', choices: ['Releasing predators to control a pest', 'An invader thriving because it left its predators, parasites and diseases behind', 'Natives attacking an invader', 'The end of a biological control programme'], a: 1, why: 'Freed from the enemies that limited it at home, an introduced species can reach far higher densities in its new range.' },
    { q: 'A species grows at r = 1 per year and disperses with D = 25 km² per year. How fast, in km per year, does its front advance?', answer: 10, unit: 'km/yr', why: 'v = 2√(1 × 25) = 2 × 5 = 10 km per year.' },
    { q: 'Most species introduced to a new region become invasive.', a: false, why: 'Most fail to establish; by the tens rule only about one in a thousand imported species becomes a pest.' },
    { q: 'Why did the cane toad front in Australia speed up over the decades?', choices: ['The climate warmed', 'Toads with longer legs that disperse farther accumulated at the front and bred together', 'People carried them in cars', 'Native predators were exterminated'], a: 1, why: 'Spatial sorting: the fastest dispersers are always at the leading edge, so dispersal ability evolves upwards there.' },
    { q: 'Why did the brown tree snake devastate Guam\'s birds so completely?', choices: ['It carried a disease', 'The island\'s birds had evolved without such snakes and had no defences against them', 'It ate all the fruit the birds needed', 'It was released deliberately to control rats'], a: 1, why: 'Naïve prey on islands without snakes neither recognised nor escaped the new predator.' }
  ],
  problems: [
    { q: 'A front advances at 55 km a year for a species with r = 0.5 per year. What is D, in km² per year?', answer: 1512.5, unit: 'km²/yr', tol: 0.02, steps: ['$D = v^2/(4r) = 3025/2 = 1512.5$ km² per year.'] },
    { q: 'An invader spreads at 5 km per year from one point. What area has it reached after 30 years, in km²?', answer: 70686, unit: 'km²', tol: 0.02, steps: ['Radius $5 \\times 30 = 150$ km.', '$A = \\pi \\times 150^2 = 70\\,686$ km².'] }
  ],
  applications: [
    'Biosecurity at borders and ports: inspection, quarantine and ballast-water rules.',
    'Eradicating rats, cats and goats from islands to save seabirds and native plants.',
    'Carefully tested biological control of weeds and insect pests.',
    'Predicting the spread of pests, weeds and diseases with growth-and-dispersal models.'
  ],
  history: 'Charles Elton\'s The Ecology of Invasions by Animals and Plants (1958) founded the study of invasions. R. A. Fisher derived the speed of an advancing wave in 1937 for a spreading advantageous gene, and J. G. Skellam applied it to animals in 1951.',
  sim: 'eco-spread'
},

{
  id: 'ecosystem-services', parent: 'conservation', title: 'Ecosystem services', level: 1,
  short: 'Ecosystems do work for people — pollinating crops, cleaning water, storing carbon, building soil, controlling floods and pests — mostly unpaid and unnoticed. Putting values on these services helps them count in decisions, but how to value nature, and the future, is hotly debated.',
  keywords: ['ecosystem services', 'provisioning services', 'regulating services', 'cultural services', 'supporting services', 'nature\'s contributions to people', 'pollination', 'dependence ratio', 'valuation', 'replacement cost', 'marginal value', 'discounting', 'natural capital', 'Catskills', 'Costanza', 'Millennium Ecosystem Assessment'],
  prereq: ['ecosystems-intro', 'biodiversity', 'flowering-reproduction'],
  related: ['conservation-biology', 'carbon-cycle', 'nitrogen-cycle', 'population-growth', 'energy-flow', 'finance:dcf-valuation', 'finance:compound-interest', 'medicine:environmental-health'],
  body: `
Nature does work for people, mostly unpaid and unnoticed. Bees pollinate crops; wetlands clean water and soak up floods; forests hold soil on slopes and store carbon; soil microbes recycle nutrients; birds and bats eat pests; and the plankton of the sea produce about half of the oxygen made by photosynthesis each year. These benefits are **ecosystem services**. The Millennium Ecosystem Assessment (2005) sorted them into four kinds:

| Kind | Examples |
|---|---|
| **Provisioning** | food, fish, timber, fibre, fresh water, genetic resources, medicines (aspirin from willow, morphine from poppies, the cancer drug paclitaxel from the Pacific yew) |
| **Regulating** | pollination, pest control, carbon storage and climate regulation, water purification, flood and erosion control, disease regulation |
| **Cultural** | recreation and tourism, spiritual and aesthetic value, inspiration, education |
| **Supporting** | soil formation, nutrient cycling, primary production — the processes all the others rest on |

The intergovernmental panel IPBES now speaks of **nature's contributions to people**, to recognise that cultures value nature in different ways, not only as a supplier of services.

### Pollination
About three-quarters of the leading food crops (87 of 115) benefit from animal pollination to some degree, although they make up only about 35 % of the world's crop production by volume — the great staples, wheat, rice and maize, are pollinated by wind or by themselves. IPBES (2016) put the yearly market value of crop output directly attributable to pollinators at 235–577 billion US dollars (2015 values). Almonds depend heavily on bees: each spring about two-thirds of the managed honeybee colonies in the United States are trucked into California's almond orchards. Wild bees and other insects matter too, and are often more efficient per flower visit than honeybees.

A standard way to value the service uses the **dependence ratio** $D$: the share of a crop's yield that would be lost without animal pollinators — above 0.9 for crops such as cocoa, kiwifruit and melons, 0.4–0.9 for almonds, apples and cherries, around 0.1–0.4 for oilseed rape and strawberries, and zero for cereals. The value attributable to pollinators is the crop's production value times $D$.

### Putting a value on nature
In 1997 Robert Costanza and colleagues estimated the world's ecosystem services at about 33 trillion US dollars a year — more than the global economic output of the time — and an update in 2014 gave about 125 trillion. Such totals made headlines but are debated: the total value of nature is in a sense infinite, since without it there is no economy. Decisions need **marginal** values — what is gained or lost with one more hectare of wetland, here. Methods include market prices, the cost of replacing a service with technology, damage avoided, the money people spend to visit a place, and surveys of what people would pay.

A celebrated case is New York City. In the 1990s, rather than build a filtration plant estimated at 6–8 billion US dollars plus several hundred million a year to run, the city spent roughly 1–1.5 billion over a decade protecting the Catskill Mountains watershed that feeds its reservoirs — buying land and paying farmers to keep manure and silt out of the streams.

### Benefits that last for centuries
A stable climate, fish stocks and soils pay out for generations, and economists compare future and present benefits by **discounting**: a benefit $B$ received $t$ years from now is worth $B/(1+r)^t$ today, and a steady yearly benefit $A$ for ever is worth $A/r$ ([[finance:dcf-valuation]]). The discount rate decides almost everything. At 1.4 % a year — close to the rate used by the Stern Review of climate change (2006) — a benefit a century away keeps a quarter of its value; at 5 %, less than 1 %. Choosing the rate is partly an ethical judgement about how much the lives of future generations count.

### Limits of the idea
Pricing nature helps it compete in decisions already made in money. Critics warn that it can make nature seem replaceable, that some values — a species' existence, a sacred place — cannot sensibly be priced, and that payments can crowd out other reasons to care. Most ecologists treat valuation as one tool among several, alongside rules, rights and protected areas. The Dasgupta Review for the UK Treasury (2021) argued that economies are embedded in nature and should account for it as an asset — natural capital — like any other.

> [!key] Ecosystems provide goods (provisioning), keep conditions livable (regulating), enrich lives (cultural) and run the underlying processes (supporting). Valuation, done at the margin and with an honest discount rate, helps these services count in decisions — but not every value is a price.
`,
  ideas: [
    'Ecosystem services are the benefits people get from nature: provisioning, regulating, cultural and supporting.',
    'About three-quarters of leading crop types benefit from animal pollination, worth hundreds of billions of US dollars a year.',
    'Useful valuations are marginal (one more hectare, here), not totals for the whole biosphere.',
    'Discounting makes distant benefits count for little; the choice of rate is partly ethical.',
    'Protecting a natural service can be far cheaper than replacing it with technology, as New York\'s watershed showed.'
  ],
  pitfalls: [
    'Most of the world\'s food calories depend on bees — The big staples (wheat, rice, maize) are wind- or self-pollinated; pollinators matter most for fruit, nuts, vegetables and oilseeds, and thus for a varied, healthy diet.',
    'If a service has a price, it can be traded away for anything of equal price — Many services have no substitutes, thresholds or irreversible losses; prices are estimates for small changes, not permission for large ones.',
    'Discounting is a neutral technical step — The rate expresses a judgement about how much future people count; it can swing the result of a decision completely.'
  ],
  formulas: [
    {
      name: 'Crop value attributable to pollinators',
      expr: 'V = P*D', tex: 'V = P\\,D',
      vars: {
        V: { name: 'value attributable to animal pollination', q: 'money', unit: '$M' },
        P: { name: 'production value of the crop', q: 'money', unit: '$M', value: 500 },
        D: { name: 'dependence ratio (yield lost without pollinators)', q: 'ratio', unit: '%', value: 65, min: 0, max: 100 }
      },
      note: 'Dependence ratios: essential (above 90 %), great (40–90 %), modest (10–40 %), little (under 10 %). Sum over crops for a region.',
      stories: {
        V: 'An orchard region\'s almond crop is worth {P} and depends on pollinators to {D}. What is the value of the pollination service?',
        D: 'Pollinators provide {V} of a crop worth {P}. What is its dependence ratio?'
      }
    },
    {
      name: 'Present value of a future benefit',
      expr: 'PV = B/(1 + r)^t', tex: '\\mathrm{PV} = \\dfrac{B}{(1 + r)^t}',
      vars: {
        PV: { name: 'value today', q: 'money', unit: '$', tex: '\\mathrm{PV}' },
        B: { name: 'benefit received in year t', q: 'money', unit: '$', value: 1000000 },
        r: { name: 'discount rate', q: 'ratio', unit: '%', value: 3, min: 0, max: 50 },
        t: { name: 'years until the benefit', q: 'years', unit: 'yr', value: 50 }
      },
      stories: {
        PV: 'A restored forest will give flood protection worth {B} in {t}. At a discount rate of {r}, what is that worth today?',
        r: 'A benefit of {B} in {t} is valued at {PV} today. What discount rate was used?'
      }
    },
    {
      name: 'Value today of a service that lasts for ever',
      expr: 'PV = A/r', tex: '\\mathrm{PV} = \\dfrac{A}{r}',
      vars: {
        PV: { name: 'value today', q: 'money', unit: '$', tex: '\\mathrm{PV}' },
        A: { name: 'yearly value of the service', q: 'money', unit: '$', value: 2000 },
        r: { name: 'discount rate', q: 'ratio', unit: '%', value: 3, min: 0.01, max: 50 }
      },
      note: 'A constant yearly benefit continuing indefinitely (a perpetuity).',
      stories: { PV: 'A hectare of wetland purifies water worth {A} a year, indefinitely. At {r}, what is it worth today?', A: 'A watershed is valued at {PV} with a discount rate of {r}. What yearly service does that imply?' }
    }
  ],
  examples: [
    {
      title: 'Pollinating almonds',
      q: 'A region\'s almond crop is worth ¤500 million a year and its dependence ratio is taken as 0.65. What is the pollination service worth?',
      steps: ['$V = 500 \\times 0.65 = 325$ million a year.', 'The rest of the crop value comes from the trees, soil, water, labour and self-pollination.'],
      a: 'About ¤325 million a year.'
    },
    {
      title: 'A century of discounting',
      q: 'What is a benefit of ¤1 million received in 100 years worth today at 1.4 % and at 5 % a year?',
      steps: [
        'At 1.4 %: $1.014^{100} = 4.01$, so PV = ¤249 000.',
        'At 5 %: $1.05^{100} = 131.5$, so PV = ¤7600.',
        'A thirty-fold difference from the discount rate alone.'
      ],
      a: 'About ¤249 000 at 1.4 %, but only ¤7600 at 5 %.'
    },
    {
      title: 'Filter plant or watershed?',
      q: 'A city can build a filtration plant for ¤7 billion plus ¤0.3 billion a year to run it, or protect its watershed for ¤1.5 billion. At a 3 % discount rate, compare.',
      steps: [
        'Running costs for ever: $A/r = 0.3/0.03 = ¤10$ billion today.',
        'Plant: 7 + 10 = ¤17 billion; watershed: ¤1.5 billion (plus some upkeep).',
        'Protecting the natural service is roughly ten times cheaper — the logic New York followed in the 1990s.'
      ],
      a: 'About ¤17 billion for the plant against ¤1.5 billion for the watershed.'
    }
  ],
  quiz: [
    { q: 'Pollination of crops by bees is which kind of ecosystem service?', choices: ['Provisioning', 'Regulating', 'Cultural', 'Supporting'], a: 1, why: 'It regulates a process — the production of fruit and seed — rather than being a product itself.' },
    { q: 'Most of the world\'s food calories come from crops that depend on animal pollinators.', a: false, why: 'The staples that supply most calories — wheat, rice, maize — are wind- or self-pollinated. Pollinators matter most for fruits, nuts, vegetables and oils.' },
    { q: 'What is ¤1000 received in 50 years worth today at a 3 % discount rate?', answer: 228, why: '1000/1.03⁵⁰ = 1000/4.38 = ¤228.' },
    { q: 'For a decision about draining one wetland, which value is most useful?', choices: ['The total value of all the world\'s wetlands', 'The marginal value: what is gained and lost by draining this wetland', 'The price of the land alone', 'The number of species in the wetland'], a: 1, why: 'Decisions change nature at the margin; totals for the whole biosphere are not what is being traded off.' },
    { q: 'Which of these is a supporting service?', choices: ['Timber', 'Ecotourism', 'Nutrient cycling in the soil', 'Flood control'], a: 2, why: 'Supporting services — soil formation, nutrient cycling, primary production — underpin all the others.' }
  ],
  problems: [
    { q: 'A wetland provides water purification worth ¤5000 a year for ever. What is it worth today at a 4 % discount rate?', answer: 125000, unit: '$', tol: 0.02, steps: ['$\\mathrm{PV} = A/r = 5000/0.04 = ¤125\\,000$.'] },
    { q: 'A coffee crop worth ¤800 million has a dependence ratio of 0.25. What value, in millions, is due to pollinators?', answer: 200, tol: 0.02, steps: ['$V = 800 \\times 0.25 = 200$ million.'] }
  ],
  applications: [
    'Payments for ecosystem services: paying landowners to keep forests, wetlands or hedgerows.',
    'Natural-capital accounts kept alongside national economic accounts.',
    'Planning flood defences with wetlands, mangroves and floodplains ("nature-based solutions").',
    'Farming that supports wild pollinators and natural pest control with flower strips and hedges.'
  ],
  history: 'Paul and Anne Ehrlich popularised the term "ecosystem services" in 1981, and Gretchen Daily\'s book Nature\'s Services (1997) and Robert Costanza\'s global valuation in the same year made the idea mainstream. The Millennium Ecosystem Assessment (2005) established the four categories.',
  sim: { id: 'eco-growth', params: { harvest: 'quota' } }
}

);
