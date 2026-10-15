/* HYPER-WATER · content/older-than-the-sun.js — topic "Older than the Sun" (branch: Water in the Universe).
 *   how-water-forms-in-space · the-largest-reservoir · the-deuterium-clock · water-older-than-the-sun · the-snow-line ·
 *   comets-asteroids-and-earths-water · earth-may-always-have-been-wet · the-moon-and-mars · venus-lost-its-ocean · the-habitable-zone
 * Simulations: sims/older-than-the-sun.js (ids cos-…). Numbers come from the engine (kit.water) or from the named papers.
 */
Hyper.add(

/* ================================================================ 1 */
{
  id: 'how-water-forms-in-space', parent: 'older-than-the-sun', title: 'How water forms in space', level: 1,
  short: 'In a cold, dark cloud of gas and dust, oxygen atoms land on grains at 10 K, meet hydrogen and build water ice one molecule at a time; in warmer gas a short chain of ions does the same job. Water is among the most abundant molecules in space, and nearly all of it is ice.',
  keywords: ['interstellar water', 'dust grain', 'ice mantle', 'molecular cloud', 'grain surface chemistry', 'hydrogenation', 'H3+', 'H3O+', 'Herschel', 'amorphous ice', 'astrochemistry', 'star formation'],
  prereq: ['what-water-is', 'amorphous-ices'],
  related: ['the-largest-reservoir', 'the-deuterium-clock', 'water-older-than-the-sun', 'the-snow-line', 'chemistry:isotopes', 'physics:kinetic-theory'],
  body: `
A dense interstellar cloud holds about ten thousand hydrogen molecules in each cubic centimetre — as empty as the best vacuum a laboratory can pump, and some $10^{15}$ times thinner than the air in a room. It is also at 10 K, about $-263\\ ^\\circ$C, because the cloud's own dust shades its core from starlight. Nothing in that description sounds like a place to make water, and yet water is made there all the time, and in such quantity that it is the commonest ice in the galaxy.

### Smoke in the dark
The reason is that a cloud is not only gas. About one per cent of its mass is **dust**: specks of silicate and carbon around a tenth of a micrometre in radius. In the near-vacuum, two atoms that meet cannot form a molecule — the energy released has nowhere to go and flings them apart again. A grain solves that. It is a surface to land on, a place where atoms wander until they meet, and a heat sink that soaks up the energy of the reaction. At 10 K it is also sticky: an atom that touches it stays.

### Water on the grain
Hydrogen atoms are so light that they cross a cold surface by quantum tunnelling, so they find whatever else is there. The central chain is only two steps:

1. An oxygen atom lands and is joined by a hydrogen atom: O + H → OH.
2. Another hydrogen arrives: OH + H → $\\ce{H2O}$.

Neither step has to climb an energy barrier, which is why the cold does not matter. Other routes pass through $\\ce{O2}$, hydrogen peroxide or ozone and end in the same molecule. A small fraction of new molecules are kicked straight back into the gas by the energy of the reaction; most stay, and the next one lands on top. Layer by layer a **mantle** of ice grows. About a hundred layers, 30 nm thick, is typical: a coat a third as thick as the grain's radius.

### Water in the gas
Cosmic rays strip an electron from hydrogen and a few quick steps follow: $\\ce{H3+}$ plus an oxygen atom gives $\\ce{OH+}$, then $\\ce{H2O+}$, then $\\ce{H3O+}$, and when that meets an electron a share of the encounters ends in $\\ce{H2O}$ plus a hydrogen atom. Where gas is heated to a few hundred kelvin — in a shock, in the outflow of a young star — the neutral reactions O + $\\ce{H2}$ → OH + H and OH + $\\ce{H2}$ → $\\ce{H2O}$ + H switch on. They have barriers of thousands of kelvin, so they stay dead in the cold, but once running they can turn most of the free oxygen into vapour.

### Where the water ends up
Almost all of it freezes. The molecules arrive one at a time and stick where they land, with no time to find the hexagonal pattern of [[ice-ih-and-ice-ic|ordinary ice]], so the mantle is **amorphous**: a porous, disordered solid ([[amorphous-ices]]). Counting ice, water is generally ranked third among the molecules of a dense cloud, behind $\\ce{H2}$ and carbon monoxide. The ice evaporates only when something heats it to roughly 100 K — a newborn star, a shock — which is why vapour is found chiefly in the warm cores and jets around young stars, and in a thin skin of cloud where ultraviolet light chips molecules off the grains. ESA's Herschel Space Observatory (2009–2013) mapped that vapour in dozens of star-forming regions, and found it even in the disc of the young star TW Hydrae.

> [!key] Water in space is built atom by atom on cold dust grains, where oxygen and hydrogen meet and react without any barrier, and by a short chain of ions in the gas. It is stored as amorphous ice, which stays frozen until a star warms it — the raw material of every later page in this branch.`,
  ideas: ['In a cold dense cloud (10 K, about $10^4$ molecules/cm³) water is made mostly on the surface of dust grains: O + H → OH, then OH + H → H₂O.', 'The grain supplies a meeting place and a heat sink; hydrogen reaches its partners by tunnelling, so the cold does not stop the reaction.', 'Gas-phase routes (H₃⁺ → H₃O⁺ → H₂O in the cold, O + H₂ in shocks above a few hundred kelvin) add a smaller share.', 'Nearly all the water in a cloud is amorphous ice on grains; it turns to vapour only near a heat source.'],
  pitfalls: ['"Space is too cold and empty for chemistry" — The cold is what lets it work: atoms stay stuck on a grain long enough to meet. The emptiness is made up for by time: a layer of ice takes about ten thousand years, a mantle a million.', '"Water in space is a gas or a vapour" — In cold clouds it is almost entirely ice on dust. Vapour is the small, warm, easily detected fraction, which is why telescopes see so little of the whole.', '"Hydrogen and oxygen must burn to make water" — On a grain at 10 K no spark is needed; the two atoms simply bond, and the grain carries the energy away.'],
  terms: [
    { term: 'Dust grain', also: ['interstellar grain', 'cosmic dust', 'interstellar dust'], def: 'A speck of silicate or carbon about a tenth of a micrometre across, making up about 1 % of the mass of a cloud. It is where atoms stick, meet and react, and what carries the ice.' },
    { term: 'Ice mantle', also: ['icy mantle', 'interstellar ice', 'ice coating'], def: 'The layers of frozen molecules — mostly water, with carbon monoxide, carbon dioxide, methane and ammonia — that build up on a grain in a cold cloud. A typical mantle is some hundred molecular layers, around 30 nm, thick.' },
    { term: 'Molecular cloud', also: ['dark cloud', 'dense cloud', 'star-forming cloud', 'prestellar core'], def: 'A cold (10–20 K), dense clump of gas and dust, dark enough to shield itself from starlight, in which hydrogen is molecular and from which stars form.' },
    { term: 'Grain-surface chemistry', also: ['surface reaction', 'hydrogenation'], def: 'Reactions that take place on the surface of a dust grain rather than in the gas. Hydrogenation — adding hydrogen atoms one at a time to a landed atom or molecule — makes water from oxygen.' },
    { term: 'Ion–molecule chemistry', also: ['gas-phase route', 'H3+ chemistry'], def: 'Reactions in the gas between ions and neutral molecules, started by cosmic rays. They have no barrier and so run at 10 K; the chain H₃⁺ → OH⁺ → H₂O⁺ → H₃O⁺ ends in water when H₃O⁺ meets an electron.' }
  ],
  formulas: [
    { name: 'Mean speed of gas atoms', expr: 'v = sqrt(8*kB*T/(pi*m))', tex: 'v = \\sqrt{\\frac{8\\,k_B T}{\\pi\\,m}}',
      vars: { v: { name: 'mean speed', q: 'speed', unit: 'm/s' }, kB: { const: 'kB' }, T: { name: 'gas temperature', q: 'temperature', unit: 'K', value: 10, min: 1, max: 2000 }, m: { name: 'mass of the atom', q: 'mass', unit: 'u', value: 1.008, hint: '1.008 u for hydrogen, 15.999 u for oxygen.' } },
      solveFor: 'v', note: 'Kinetic theory of a gas in equilibrium at temperature T.',
      stories: { v: 'Atoms of mass {m} drift through a cloud at {T}. How fast do they move on average?', T: 'Atoms of mass {m} move at {v} on average. What is the gas temperature?' } },
    { name: 'Atoms landing on a grain', expr: 'G = n*pi*a^2*v', tex: '\\Gamma = n\\,\\pi a^2\\,v',
      vars: { G: { name: 'landings per second', q: 'rate', unit: '1/day', tex: '\\Gamma' }, n: { name: 'number density of the atoms', q: 'numberdensity', unit: '1/cm³', value: 1, hint: 'Of free atoms of one kind: about 1 per cm³ of atomic hydrogen or oxygen in a dense cloud of 10⁴ molecules per cm³.' }, a: { name: 'grain radius', q: 'length', unit: 'µm', value: 0.1 }, v: { name: 'mean speed', q: 'speed', unit: 'm/s', value: 458, hint: '458 m/s for hydrogen at 10 K; 115 m/s for oxygen.' } },
      solveFor: 'G', note: 'Every atom that reaches the grain sticks; the cross-section of a sphere is its shadow, $\\pi a^2$.',
      stories: { G: 'Atoms of density {n} move at {v} around a grain of radius {a}. How often does one land?' } },
    { name: 'Time to lay down one layer', expr: 't = 4/(n*v*d^2)', tex: 't = \\frac{4}{n\\,v\\,d^2}',
      vars: { t: { name: 'time per monolayer', q: 'time', unit: 'yr' }, n: { name: 'number density of the atoms', q: 'numberdensity', unit: '1/cm³', value: 1 }, v: { name: 'mean speed', q: 'speed', unit: 'm/s', value: 115, hint: 'Oxygen at 10 K, since each water molecule needs one oxygen atom.' }, d: { name: 'spacing of the sites on the grain', q: 'length', unit: 'Å', value: 3, hint: 'About 3 Å between molecules in ice.' } },
      solveFor: 't', note: 'The grain radius cancels: the sites on a grain grow as $a^2$ and so do the landings. Oxygen is the limiting supply here.',
      stories: { t: 'Oxygen atoms of density {n} move at {v}; the molecules in ice sit {d} apart. How long to lay down one layer?' } }
  ],
  examples: [
    { title: 'How often does an atom land?', q: 'A dense cloud at 10 K holds about 1 free hydrogen atom and 1 free oxygen atom per cm³. How often does one of each land on a grain of radius 0.1 µm?',
      steps: [{ text: 'Mean speeds at 10 K:', tex: 'v_H = \\sqrt{\\frac{8 k_B T}{\\pi m_H}} = 458\\ \\mathrm{m/s}, \\qquad v_O = 115\\ \\mathrm{m/s}' }, 'Cross-section: $\\pi a^2 = \\pi (10^{-7}\\ \\mathrm{m})^2 = 3.1\\times10^{-14}\\ \\mathrm{m^2}$; density $10^{6}\\ \\mathrm{m^{-3}}$.', { text: 'Landing rates:', tex: '\\Gamma_H = 10^6 \\times 3.1\\times10^{-14} \\times 458 = 1.4\\times10^{-5}\\ \\mathrm{s^{-1}}, \\quad \\Gamma_O = 3.6\\times10^{-6}\\ \\mathrm{s^{-1}}' }, 'Intervals: 19 hours for hydrogen, 3.2 days for oxygen.'],
      a: 'A hydrogen atom lands about every 19 hours and an oxygen atom every 3 days: a grain is a slow factory, but there are $10^{12}$ grains for every cubic parsec of gas to share the work.' },
    { title: 'A mantle in a million years', q: 'Using the oxygen supply above, how long does the grain take to lay one layer of ice, and a mantle of 100 layers? Compare with the life of a dense cloud (a few million years).',
      steps: [{ text: 'One layer needs one oxygen atom for each site, about 3 Å apart:', tex: 't = \\frac{4}{n\\,v\\,d^2} = \\frac{4}{10^6 \\times 115 \\times (3\\times10^{-10})^2} = 3.9\\times10^{11}\\ \\mathrm{s}' }, 'That is about 12,000 years per layer.', 'A hundred layers: about $1.2\\times10^6$ years.'],
      a: 'A mantle of a hundred layers takes about a million years — a dense cloud\'s lifetime, which is why mantles are thick in old dense clouds and absent in young diffuse ones. The estimate is an order of magnitude; real densities differ by factors of several.' }
  ],
  quiz: [
    { q: 'Most of the water in a cold, dense interstellar cloud is found', choices: ['as vapour between the grains', 'as ice on the surface of dust grains', 'as liquid droplets', 'as ions of $\\ce{H3O+}$ in the gas'], a: 1, why: 'At 10 K any water molecule that touches a grain freezes on it. The vapour that telescopes detect is the small warm fraction near young stars, in shocks and in thin cloud skins.' },
    { q: 'Hydrogen and oxygen atoms on a 10 K grain react only if they are given a lot of energy first.', a: false, why: 'O + H and OH + H have essentially no energy barrier, and hydrogen crosses the surface by tunnelling. The grain also takes up the energy released, so the product does not fly apart.' },
    { q: 'Why can two atoms in an empty cloud not simply collide and form a molecule in the gas?', choices: ['They repel each other too strongly', 'The energy released has nowhere to go, so the pair flies apart again', 'There is no hydrogen in space', 'The temperature is too high'], a: 1, why: 'Forming a bond releases energy that must be carried away by something; in a near-vacuum a third body almost never arrives in time. A dust grain is that third body, permanently present.' },
    { q: 'What is the mean speed of a hydrogen atom in a cloud at 10 K, in m/s?', answer: 458, unit: 'm/s', why: '$\\sqrt{8 k_B T/(\\pi m)} = \\sqrt{8\\times1.38\\times10^{-23}\\times10/(\\pi\\times1.67\\times10^{-27})} \\approx 458$ m/s — slow compared with a molecule of air at room temperature (about 450 m/s for nitrogen), but remember that the hydrogen is a thirtieth of the mass.' },
    { q: 'A grain twice as large (in radius) collects atoms four times as fast. How does the time to build one layer of ice on it compare with that on the smaller grain?', choices: ['four times shorter', 'two times shorter', 'the same', 'two times longer'], a: 2, why: 'The landings grow as $a^2$, but so does the number of sites that must be covered, so the thickness of ice grows at the same rate on grains of every size.' }
  ],
  applications: ['Reading the 3 µm absorption of ice against background stars and, since 2022, mapping it with the James Webb Space Telescope — a census of what the ice is made of before a star forms.', 'Laboratory astrochemistry: apparatus cooled to 10 K that fires hydrogen atoms at oxygen on a surface to measure how fast water forms.', 'Estimating how much water a young planetary system can inherit ([[water-older-than-the-sun]]).', 'Tracing star formation: water vapour in a jet or outflow marks where a young star is warming and shocking its cloud.'],
  history: 'Water ice in space was identified from its infrared absorption in the 1970s, in front of embedded young stars. Herschel, launched by ESA in May 2009, observed until its coolant ran out in April 2013, and its water-in-star-forming-regions survey made the first large maps of the vapour.',
  sources: ['NASA JPL, "Astronomers find largest, most distant reservoir of water" (22 July 2011) — the gas-phase water that this page explains how to make.', 'van Dishoeck, Kristensen, Benz and colleagues, "Water in star-forming regions with the Herschel Space Observatory", *Publications of the Astronomical Society of the Pacific* (2011).', 'Tielens, *The Physics and Chemistry of the Interstellar Medium* (Cambridge, 2005) — grain surface chemistry and ion–molecule chemistry.'],
  sim: 'cos-grain-ice'
},

/* ================================================================ 2 */
{
  id: 'the-largest-reservoir', parent: 'older-than-the-sun', title: 'The largest reservoir', level: 1,
  short: 'Around a black hole 12 billion light-years away lies water vapour equal to 140 trillion of Earth\'s oceans. The light left when the universe was 1.6 billion years old, so water was abundant almost as soon as stars had made oxygen.',
  keywords: ['APM 08279+5255', 'quasar', 'water vapour', '140 trillion oceans', 'largest reservoir', 'redshift', 'Z-Spec', 'CARMA', 'Plateau de Bure', 'distant water', 'black hole'],
  prereq: ['how-water-forms-in-space'],
  related: ['the-deuterium-clock', 'what-water-is', 'water-in-numbers', 'how-much-water-earth-has', 'physics:planets'],
  body: `
The largest known body of water is not an ocean and not a planet. In 2011 two teams, one led by Matt Bradford of NASA's Jet Propulsion Laboratory and Caltech, the other by Dariusz Lis, announced that they had found water vapour around a quasar called **APM 08279+5255**. The cloud holds **140 trillion times** the water of all Earth's oceans — and it is more than **12 billion light-years** away.

### What a quasar is
A quasar is a black hole feeding. This one has a mass of about 20 billion Suns, and the gas falling into it is heated until it outshines the galaxy around it. The glare warms dust and gas out to hundreds of light-years, and that warmed region is where the water was found: vapour at about $-53\\ ^\\circ$C, five times hotter and 10–100 times denser than the gas in our own galaxy — yet some 300 trillion times thinner than the air we breathe.

### How you weigh a cloud of water
Each water molecule, excited by the glare, emits radiation at certain wavelengths that depend only on its rotation. The space the light crossed has been stretching for 12 billion years, and the wavelengths with it: a line emitted at 0.30 mm arrives at about 1.5 mm, in the radio. Z-Spec, a spectrometer on the Caltech Submillimeter Observatory in Hawaii, and the Plateau de Bure interferometer in France caught the lines; CARMA in California confirmed them. How bright the lines are tells how many molecules there are.

### The number
One Earth ocean is $1.4\\times10^{21}$ kg. Multiply by $1.4\\times10^{14}$:

$$M \\approx 2\\times10^{35}\\ \\mathrm{kg} \\approx 10^5\\ \\text{solar masses}$$

That is about $6.6\\times10^{60}$ molecules — a hundred thousand Suns' worth of water. Our own galaxy holds roughly 4,000 times less water vapour, most of its water being frozen on grains.

### What it means, and what it does not
Because the light is old, the lesson is about time: the universe was only **1.6 billion years old** when this light set out. Stars had already made oxygen, and the oxygen had already met hydrogen. The vast mass of water is chiefly a matter of size — a whole galaxy's gas, around a black hole — not of unusual richness; per hydrogen atom the water is a few parts in ten thousand, the same order as a cloud in our own galaxy. And it is vapour, warmed by the quasar. The cloud is the largest reservoir of water *vapour* found; the ice in the galaxy's dust is another matter, and probably larger.

> [!key] A quasar 12 billion light-years away is surrounded by water vapour equal to 140 trillion oceans, seen as it was when the universe was 1.6 billion years old. It shows that water is not a local accident: it formed as soon as the first stars had made oxygen.`,
  ideas: ['The quasar APM 08279+5255 is wrapped in water vapour amounting to 140 trillion Earth oceans, about $2\\times10^{35}$ kg or $10^5$ Suns\' worth.', 'The light left when the universe was 1.6 billion years old, so water existed within about a billion years of the Big Bang.', 'The vapour is warmed by the quasar to about $-53\\ ^\\circ$C, and is far denser than interstellar gas yet far thinner than air.', 'The size of the reservoir reflects a huge amount of gas, not an unusually high water content.'],
  pitfalls: ['"A reservoir of 140 trillion oceans is a cloud of liquid water" — It is vapour, 300 trillion times thinner than air, spread over hundreds of light-years. Its mass is vast only because its volume is.', '"This is how much water the universe contains" — It is the largest *vapour* reservoir found; it says nothing about how common water is overall. Most water in galaxies is ice on dust, which is much harder to see.', '"The water is 12 billion years old today" — We see it as it was 12 billion years ago. What it is like now, nobody knows; the quasar has probably faded.'],
  terms: [
    { term: 'Quasar', also: ['quasi-stellar object', 'QSO', 'active galactic nucleus'], def: 'The extremely bright core of a distant galaxy, powered by gas falling into a supermassive black hole. Quasars outshine their host galaxies and can be seen across most of the observable universe.' },
    { term: 'Redshift', also: ['z', 'cosmological redshift'], def: 'The stretching of light\'s wavelength as the universe expands. A redshift $z$ multiplies every wavelength by $1+z$; APM 08279+5255 has $z \\approx 3.9$, a factor of about 4.9.' },
    { term: 'Lookback time', also: ['light travel time'], def: 'How long ago the light we now receive left its source. For APM 08279+5255 it is about 12 billion years, so we see the quasar as it was when the universe was 1.6 billion years old.' },
    { term: 'Submillimetre astronomy', also: ['millimetre-wave astronomy', 'far-infrared astronomy'], def: 'Observing at wavelengths of about 0.3 to 1 mm, where cold gas and dust radiate and where the stretched lines of distant water appear. It needs dry, high sites such as Mauna Kea.' }
  ],
  formulas: [
    { name: 'Mass of water in a reservoir', expr: 'M = N*Mo', tex: 'M = N\\,M_o',
      vars: { M: { name: 'mass of water', q: 'mass', unit: 'kg' }, N: { name: 'number of Earth oceans', q: 'count', unit: '', value: 1.4e14, hint: 'The NASA JPL release of 2011 gives 140 trillion.' }, Mo: { name: 'mass of one Earth ocean', q: 'mass', unit: 'kg', value: 1.4e21, tex: 'M_o', hint: 'The oceans hold 1.37–1.4 × 10²¹ kg (1.335 × 10⁹ km³).' } },
      solveFor: 'M', note: 'Convert to solar masses with the unit menu: divide by $1.99\\times10^{30}$ kg.',
      stories: { M: 'A cloud holds {N} Earth oceans, each of {Mo}. What is its mass of water?', N: 'A cloud holds {M} of water. How many Earth oceans is that, at {Mo} each?' } },
    { name: 'Number of molecules', expr: 'Nm = M/mw', tex: 'N_m = \\frac{M}{m_w}',
      vars: { Nm: { name: 'number of molecules', q: 'count', unit: '', tex: 'N_m' }, M: { name: 'mass of water', q: 'mass', unit: 'kg', value: 1.96e35 }, mw: { name: 'mass of one H₂O molecule', q: 'mass', unit: 'u', value: 18.015, fixed: true, tex: 'm_w' } },
      solveFor: 'Nm', note: 'About $3.3\\times10^{25}$ molecules in a litre of water.',
      stories: { Nm: 'A reservoir holds {M} of water. How many molecules is that?' } },
    { name: 'A line stretched by the expansion', expr: 'lo = le*(1 + z)', tex: '\\lambda_o = \\lambda_e\\,(1+z)',
      vars: { lo: { name: 'observed wavelength', q: 'length', unit: 'mm', tex: '\\lambda_o' }, le: { name: 'emitted wavelength', q: 'length', unit: 'mm', value: 0.303, tex: '\\lambda_e', hint: 'The 988 GHz rotational line of water has a wavelength of 0.303 mm.' }, z: { name: 'redshift', value: 3.91, min: 0 } },
      solveFor: 'lo', note: 'Redshift multiplies every wavelength by the same factor, whatever the line.',
      stories: { lo: 'A water line is emitted at {le} by gas at redshift {z}. At what wavelength is it observed?', z: 'A line emitted at {le} arrives at {lo}. What is the redshift?' } }
  ],
  examples: [
    { title: 'Weighing the reservoir', q: 'Take 140 trillion ocean masses of $1.4\\times10^{21}$ kg. What is the mass in kilograms and in Suns, and how many molecules?',
      steps: [{ text: 'Mass:', tex: 'M = 1.4\\times10^{14} \\times 1.4\\times10^{21} = 1.96\\times10^{35}\\ \\mathrm{kg}' }, 'In solar masses: $1.96\\times10^{35}/1.99\\times10^{30} = 9.9\\times10^4$.', { text: 'Molecules:', tex: 'N = \\frac{1.96\\times10^{35}}{18.015 \\times 1.66\\times10^{-27}} = 6.6\\times10^{60}' }],
      a: 'About $2\\times10^{35}$ kg, a hundred thousand solar masses, and $6.6\\times10^{60}$ molecules.' },
    { title: 'Where the line lands', q: 'Water has a rotational line at 988 GHz (0.303 mm). At redshift 3.91 where does it arrive, as a wavelength and a frequency?',
      steps: [{ text: 'The stretch factor is $1+z = 4.91$:', tex: '\\lambda_o = 0.303\\ \\mathrm{mm} \\times 4.91 = 1.49\\ \\mathrm{mm}' }, 'Frequency falls by the same factor: $988/4.91 = 201$ GHz, which is in the range of the Z-Spec and interferometer receivers.'],
      a: 'At 1.49 mm, 201 GHz — a far-infrared line turned into a millimetre-wave one, which is why mountain-top radio telescopes can see it.' }
  ],
  quiz: [
    { q: 'The reservoir around APM 08279+5255 holds about', choices: ['a thousand Earth oceans', 'a million Earth oceans', '140 trillion Earth oceans', '$10^{30}$ Earth oceans'], a: 2, why: 'The 2011 measurement gave 140 trillion times the water of Earth\'s oceans: some $2\\times10^{35}$ kg.' },
    { q: 'The vapour cloud is therefore a very dense place.', a: false, why: 'It is 10–100 times denser than gas in the Milky Way, but still some 300 trillion times thinner than Earth\'s air. The mass comes from the enormous volume.' },
    { q: 'Why does the discovery matter for the history of water?', choices: ['It proves that life exists far away', 'It shows water already existed when the universe was under two billion years old', 'It shows that water is liquid in space', 'It shows that Earth\'s water came from quasars'], a: 1, why: 'The light we see left 12 billion years ago, when the universe was 1.6 billion years old. Stars had already forged oxygen and chemistry had already joined it to hydrogen.' },
    { q: 'A water line emitted at 0.303 mm from gas at redshift 3.91 is observed at what wavelength, in mm?', answer: 1.49, unit: 'mm', why: '$0.303 \\times (1 + 3.91) = 1.49$ mm.' },
    { q: 'About how many solar masses is $2\\times10^{35}$ kg of water?', choices: ['10', '$10^3$', '$10^5$', '$10^{10}$'], a: 2, why: '$2\\times10^{35}/2\\times10^{30} = 10^5$ — about a hundred thousand Suns, in a cloud around a black hole of 20 billion Suns.' }
  ],
  applications: ['A reminder that cosmic chemistry is old: water, silicates and organic molecules were made in the first generations of stars.', 'A calibration of submillimetre telescopes: the lines of distant water test how well instruments work at the limit of what the atmosphere allows.', 'The basis of the argument that water is a universal ingredient, to be expected wherever planets form ([[water-worlds-around-other-stars]]).', 'A teaching example of lookback time and redshift: the clearest way to see that looking far is looking back.'],
  history: 'The detection was announced in July 2011 in *The Astrophysical Journal Letters*, by two teams working independently: Bradford and colleagues with Z-Spec and CARMA, Lis and colleagues with the Plateau de Bure Interferometer. The quasar had been found in 1998 in a survey with the Apache Point telescope, and its light is magnified by the gravity of a galaxy in front of it.',
  sources: ['NASA JPL, "Astronomers find largest, most distant reservoir of water" (22 July 2011) — the 140 trillion oceans, the 12 billion light-years, the temperature and density.', 'Bradford and colleagues, and Lis and colleagues, *The Astrophysical Journal Letters* (2011) — the two detections.', 'USGS Water Science School, for the mass and volume of Earth\'s oceans.'],
  sim: 'cos-reservoir'
},

/* ================================================================ 3 */
{
  id: 'the-deuterium-clock', parent: 'older-than-the-sun', title: 'The deuterium clock', level: 2,
  short: 'Heavy hydrogen is enriched in water that formed cold. The ratio of deuterium to hydrogen in a sample of water — 1.56 × 10⁻⁴ in Earth\'s oceans, 5.3 × 10⁻⁴ at comet 67P, 2.1 × 10⁻⁵ in the young Sun\'s gas — reads off where and how cold the water was born.',
  keywords: ['D/H', 'deuterium', 'VSMOW', 'delta D', 'δD', 'isotope ratio', 'fractionation', 'heavy water', 'comet 67P', 'Rosetta', 'ROSINA', 'zero-point energy', 'H2D+', 'cold chemistry'],
  prereq: ['isotopes-and-heavy-water', 'how-water-forms-in-space', 'chemistry:isotopes'],
  related: ['water-older-than-the-sun', 'comets-asteroids-and-earths-water', 'venus-lost-its-ocean', 'the-moon-and-mars', 'where-the-oceans-came-from'],
  body: `
Hydrogen has a heavy twin, **deuterium** (D), with a neutron added to its nucleus. A water molecule that holds one is $\\ce{HDO}$, and its chemistry is almost the same as ordinary water's — almost. That small difference turns the ratio of the two into a clock and a thermometer.

### The ratio
The **D/H ratio** is the number of deuterium atoms per hydrogen atom. The Big Bang made it about $2.5\\times10^{-5}$; the gas of the young Solar System had $2.1\\times10^{-5}$, as the Sun's wind and Jupiter's atmosphere still show. Earth's oceans have $1.56\\times10^{-4}$ — about seven times more. Chemists call that figure **VSMOW** (Vienna Standard Mean Ocean Water), the reference for all other samples, and quote differences as **δD**, parts per thousand:

$$\\delta D = \\left(\\frac{R}{R_{\\mathrm{VSMOW}}} - 1\\right) \\times 1000\\ ‰$$

Seawater is $0$ ‰; the young Sun's gas is $-865$ ‰; comet 67P, measured by Rosetta's ROSINA instrument in 2014, is $+2{,}400$ ‰ — a ratio of $5.3\\times10^{-4}$, more than three times Earth's. Venus's atmosphere stands at about 100 times.

### Why cold water is heavy
Deuterium bonds sit slightly lower in energy than hydrogen's, because the heavier atom vibrates with a smaller zero-point energy. For a reaction as simple as

$$\\ce{H3+ + HD -> H2D+ + H2}$$

the deuterated product is favoured by about 230 K of energy ($\\Delta E/k_B$). At 10 K that is worth a factor $e^{23}$ in the equilibrium, in practice reduced by other effects to enrichments of hundreds or thousands; at 100 K only $e^{2.3} \\approx 10$; at 300 K, 2. The enriched $\\ce{H2D+}$ passes its deuterium to oxygen-bearing molecules, so ice that formed in the 10 K dark carries a heavy fingerprint: protostellar envelopes show $10^{-3}$ or more: several times the oceans' value and up to a hundred times the Sun's gas. Warm, hot water, on the other hand, exchanges freely with hydrogen gas and sheds the excess.

### Reading the clock
So the D/H of water is a thermometer of its birth and a record of everything since:

- **Near the protosolar value** ($2\\times10^{-5}$): water made from, or equilibrated with, warm solar gas.
- **Around Earth's** ($1.4$–$1.6\\times10^{-4}$): the carbonaceous meteorites and the 2011 comet Hartley 2.
- **Higher** ($3$–$5\\times10^{-4}$): Halley, Hale–Bopp, and 67P — formed colder, further out, or inherited from the interstellar cloud.
- **Far higher** (the interstellar ice cores, Venus): either nearly unprocessed ice, or hydrogen lost to space ([[venus-lost-its-ocean]]).

The ocean's value sits in between: not as light as the Sun, not as heavy as the cold dark. That position is the clue the next pages follow.

> [!key] The ratio of deuterium to hydrogen in water is set by temperature at birth: cold chemistry enriches deuterium exponentially, warmth erases the enrichment. Earth\'s oceans, seven times the Sun\'s, are neither fresh-from-the-dark nor fully reset.`,
  ideas: ['D/H is the number of deuterium atoms per hydrogen atom: $2.1\\times10^{-5}$ in the protosolar gas, $1.56\\times10^{-4}$ in Earth\'s oceans (VSMOW), $5.3\\times10^{-4}$ in comet 67P.', 'δD expresses the difference from VSMOW in parts per thousand: Earth\'s oceans 0 ‰, comet 67P about +2,400 ‰, the young Sun\'s gas about −865 ‰.', 'Cold chemistry favours deuterium by a factor $e^{\\Delta E/T}$ with $\\Delta E \\approx 230$ K, so the D/H of ice is exponentially sensitive to the temperature at which it formed.', 'Warm exchange with hydrogen gas lowers the ratio again, so D/H records both where the water formed and how warm it later became.'],
  pitfalls: ['"A higher D/H means the water is older" — It means the water formed, or was last processed, colder (or lost hydrogen). Age needs a separate argument; a few-million-year-old protostar can have a ratio higher than Earth\'s.', '"Heavy water is the same as water with a high D/H" — Heavy water is $\\ce{D2O}$, in which both hydrogens are deuterium. Natural water has about one HDO molecule in 3,200, and D₂O is rarer still.', '"Matching D/H proves the source" — It rules sources out much better than it rules them in: two different sources can share a ratio. Comets, for example, differ widely from one another.'],
  terms: [
    { term: 'Deuterium', also: ['D', '²H', 'heavy hydrogen'], def: 'The isotope of hydrogen whose nucleus holds a proton and a neutron. It was made in the Big Bang and is destroyed in stars, so its abundance in water is a record of chemistry rather than of stellar processing.' },
    { term: 'D/H ratio', also: ['deuterium-to-hydrogen ratio', 'D/H'], def: 'The number of deuterium atoms per hydrogen atom in a sample. For water the usual quantity is the ratio in the water molecules, HDO/H₂O divided by two.' },
    { term: 'VSMOW', also: ['Vienna Standard Mean Ocean Water', 'SMOW'], def: 'The reference water kept by the International Atomic Energy Agency, whose D/H of $1.5576\\times10^{-4}$ defines zero on the δD scale. It stands for the average of the oceans.' },
    { term: 'δD', also: ['delta-D', 'delta deuterium', 'per mil'], def: 'The deviation of a sample\'s D/H from VSMOW in parts per thousand (‰): $(R/R_{\\mathrm{VSMOW}} - 1) \\times 1000$. It is negative for samples lighter than the oceans, positive for heavier.' },
    { term: 'Isotopic fractionation', also: ['isotope effect', 'enrichment'], def: 'The shift in an isotope ratio between two compounds or phases that exchange atoms, caused by the small differences in bond energy between isotopes. It grows as the temperature falls.' },
    { term: 'Zero-point energy', also: ['zero-point vibration'], def: 'The lowest vibrational energy a bond can have, never zero in quantum mechanics. A bond to a heavy isotope has less of it, which makes deuterated molecules slightly more stable and is the origin of the cold enrichment.' }
  ],
  formulas: [
    { name: 'D/H relative to the oceans', expr: 'q = R/Rs', tex: 'q = \\frac{R}{R_{\\mathrm{VSMOW}}}',
      vars: { q: { name: 'ratio to Earth\'s oceans', q: 'ratio', unit: '' }, R: { name: 'D/H of the sample', value: 5.3e-4 }, Rs: { name: 'D/H of VSMOW', value: 1.5576e-4, fixed: true, tex: 'R_{\\mathrm{VSMOW}}' } },
      solveFor: 'q', note: 'Comet 67P gives 3.4; Venus about 100; the young Sun\'s gas 0.13.',
      stories: { q: 'Water at a comet has a D/H of {R}. How many times Earth\'s ocean ratio is that?', R: 'Water is {q} times as heavy in deuterium as Earth\'s oceans. What is its D/H?' } },
    { name: 'δD in parts per thousand', expr: 'dD = R/Rs - 1', tex: '\\delta D = \\frac{R}{R_{\\mathrm{VSMOW}}} - 1',
      vars: { dD: { name: 'δD', q: 'ratio', unit: '‰', signed: true, tex: '\\delta D' }, R: { name: 'D/H of the sample', value: 5.3e-4 }, Rs: { name: 'D/H of VSMOW', value: 1.5576e-4, fixed: true, tex: 'R_{\\mathrm{VSMOW}}' } },
      solveFor: 'dD', note: 'The calculator shows δD in ‰ (parts per thousand). Negative is lighter than the oceans.',
      stories: { dD: 'A sample has D/H {R}. What is its δD relative to VSMOW?', R: 'A sample has δD of {dD}. What is its D/H?' } },
    { name: 'Cold enrichment of deuterium', expr: 'f = exp(dE/T)', tex: 'f = e^{\\Delta E / T}',
      vars: { f: { name: 'enrichment factor (equilibrium limit)' }, dE: { name: 'zero-point energy difference ÷ kB', q: 'dtemp', unit: 'K', value: 232, fixed: true, tex: '\\Delta E', hint: 'About 232 K for H₃⁺ + HD → H₂D⁺ + H₂.' }, T: { name: 'temperature', q: 'temperature', unit: 'K', value: 20, min: 5, max: 500 } },
      solveFor: 'f', note: 'An upper limit from the reaction\'s equilibrium; real clouds fall short because of ortho-H₂ and because ions are destroyed before they equilibrate. The exponential steepness is the point.',
      stories: { f: 'Gas at {T} comes to equilibrium in H₃⁺ + HD ⇌ H₂D⁺ + H₂. By what factor is deuterium favoured?', T: 'Deuterium is favoured by a factor {f} in the exchange. At what temperature did it come to equilibrium?' } }
  ],
  examples: [
    { title: 'Three bodies on one scale', q: 'Compare the young Sun\'s gas ($2.1\\times10^{-5}$), comet 67P ($5.3\\times10^{-4}$) and Venus\'s atmosphere ($1.6\\times10^{-2}$) with Earth\'s oceans. Give each as a multiple of VSMOW and as δD.',
      steps: ['Divide by $1.5576\\times10^{-4}$: the Sun\'s gas 0.135, 67P 3.40, Venus 103.', { text: 'δD is the ratio minus one, times 1000:', tex: '\\delta D = -865\\ ‰,\\quad +2{,}400\\ ‰,\\quad +1.0\\times10^{5}\\ ‰' }],
      a: 'The Sun\'s gas is 7.4 times lighter than the oceans; 67P is 3.4 times heavier; Venus 100 times heavier. On a logarithmic scale, Earth sits in the middle — the shape the simulation draws.' },
    { title: 'How cold does it get that heavy?', q: 'By the equilibrium formula, at what temperature does the exchange favour deuterium by a factor of 100? by a factor of 1,000?',
      steps: [{ text: 'Invert $f = e^{\\Delta E/T}$:', tex: 'T = \\frac{\\Delta E}{\\ln f} = \\frac{232\\ \\mathrm{K}}{\\ln 100} = 50\\ \\mathrm{K}' }, 'For 1,000: $232/\\ln 1000 = 34$ K. For Earth\'s seven-fold enrichment over the Sun\'s gas: $232/\\ln 7.4 = 116$ K.'],
      a: 'A factor of a hundred needs cold gas at 50 K, a thousand needs 34 K. The mild enrichment of Earth\'s oceans is compatible with water that formed near 100 K or with a mixture of colder and warmer parts — the puzzle the next pages take up.' }
  ],
  quiz: [
    { q: 'In which source is the D/H ratio *lowest*?', choices: ['Earth\'s oceans', 'Comet 67P', 'The gas of the young Sun', 'The atmosphere of Venus'], a: 2, why: 'The Sun\'s gas, whose deuterium is mostly the Big Bang\'s, has $2\\times10^{-5}$. Earth is seven times higher, 67P 25 times, Venus 750 times.' },
    { q: 'Cold chemistry enriches deuterium because', choices: ['deuterium is heavier and falls to the bottom of a cloud', 'bonds to deuterium have lower zero-point energy, which matters most when thermal energy is small', 'deuterium is made in cold clouds', 'cold gas is denser'], a: 1, why: 'The energy advantage of deuterium, about 230 K, is large against $k_BT$ when $T$ is 10 K and trivial when $T$ is 1,000 K.' },
    { q: 'Seawater has a δD of zero by definition.', a: true, why: 'δD measures the difference from VSMOW, the reference water standing for the oceans. A sample 10 % lighter in deuterium has δD = −100 ‰.' },
    { q: 'What is the δD of a sample with D/H $= 3.12\\times10^{-4}$ (twice VSMOW)?', answer: 1000, unit: '‰', why: '$\\delta D = (2 - 1) \\times 1000 = +1000$ ‰.' },
    { q: 'A water sample has a D/H ten times Earth\'s. Which conclusion is justified?', choices: ['It is ten times older than the oceans', 'It formed from, or was last processed in, much colder conditions than Earth\'s water, or has lost hydrogen', 'It is heavy water', 'It came from Venus'], a: 1, why: 'A high D/H says something about temperature or loss, not age and not a particular parent body. Interstellar ice, protostellar envelopes and Venus are three different ways to reach it.' }
  ],
  applications: ['Tracing where Earth\'s water came from by comparing the oceans with comets, meteorites and the Sun ([[comets-asteroids-and-earths-water]]).', 'Reading the cold history of the ice in a young planetary system, as in the [[water-older-than-the-sun|inheritance argument]].', 'Estimating how much water Venus and Mars lost from the enrichment of the deuterium that remained ([[venus-lost-its-ocean]], [[the-moon-and-mars]]).', 'On Earth: the δD of rain, ice cores and tree rings records temperature, because lighter water evaporates and falls first.'],
  history: 'Harold Urey discovered deuterium in 1931 and received the Nobel Prize in chemistry for it in 1934. The ocean standard was introduced by Harmon Craig in 1961 and replaced by the International Atomic Energy Agency\'s Vienna reference. Giotto flew through the coma of Halley\'s comet in 1986, and the analysis of its mass spectra, published in 1995, gave about 3 × 10⁻⁴, twice Earth\'s: the first comet found heavier than the oceans.',
  sources: ['ESA, "First measurements of comet\'s water ratio" (9 December 2014); Altwegg and colleagues, *Science* (2015) — the ROSINA measurement of $5.3\\times10^{-4}$ at 67P.', 'Hartogh and colleagues, *Nature* (2011) — Herschel\'s measurement of Hartley 2, Earth-like.', 'Cooke, Pettini and Steidel, *The Astrophysical Journal* (2018) — the primordial D/H.', 'Cleeves and colleagues, *Science* (2014) — D/H and the inheritance of water (see the next page).'],
  sim: 'cos-deuterium-clock'
},

/* ================================================================ 4 */
{
  id: 'water-older-than-the-sun', parent: 'older-than-the-sun', title: 'Water older than the Sun', level: 2,
  short: 'The young Sun\'s disc could not have made Earth\'s deuterium-rich water from scratch. Models by Cleeves and colleagues (2014) say that 30 to 50 per cent of the water in the oceans was already ice in the interstellar cloud, formed before the Sun, more than 4.6 billion years ago.',
  keywords: ['Cleeves', 'inheritance', 'interstellar ice', 'protoplanetary disc', 'disk', 'cosmic rays', 'ionisation', 'presolar water', 'older than the Sun', 'D/H', 'hot corino', 'V883 Orionis'],
  prereq: ['the-deuterium-clock', 'how-water-forms-in-space'],
  related: ['the-snow-line', 'comets-asteroids-and-earths-water', 'where-the-oceans-came-from', 'amorphous-ices', 'the-search-follows-the-water'],
  body: `
Take a glass of water from any tap. Some of its molecules may have been ice in a dark cloud of gas and dust before the Sun existed. That is the conclusion of a model by **Ilsedore Cleeves**, Edwin Bergin and colleagues, published in *Science* in September 2014: between **30 and 50 per cent** of the water in Earth's oceans, they calculated, is older than the Sun, which formed 4.6 billion years ago.

### The puzzle
Water holds a record of cold in its deuterium ([[the-deuterium-clock]]). Earth's oceans have a D/H of $1.56\\times10^{-4}$, seven times the gas of the early Solar System, and comets run higher. To make water so rich in deuterium takes either very cold chemistry, or a source of ionisation that keeps the deuterium-passing ion $\\ce{H2D+}$ at work. Two ways to get there suggest themselves:

1. **Made at home.** The disc of gas and dust around the infant Sun, being hot near the star, would have destroyed any ice that fell into it; water would have been made afresh in the disc. Ionisation by the Sun's own X-rays, by cosmic rays and by radioactive decay in the disc could then have driven the deuterium chemistry.
2. **Inherited.** Ice made in the 10 K parent cloud, already heavy, survived the collapse and came through intact.

### What the model found
Cleeves's group built a chemical model of the disc and computed how much ionisation the young Sun and its surroundings could really supply. The result was that the ionising radiation of the young Sun, and cosmic rays that its wind largely shut out, were not enough to raise the D/H to the observed value: the water made in the disc itself would be too light. Mixing in ice of the cloud's kind fixes it. A simple balance

$$R = f\\,R_{\\mathrm{ice}} + (1-f)\\,R_{\\mathrm{disc}}$$

with ice at $R_{\\mathrm{ice}} \\sim 3\\times10^{-4}$ and disc-made water at a few times the Sun's gas gives an inherited fraction $f$ around 0.3 to 0.5 for Earth's oceans — the quoted range. The balance is a sketch of the argument, not the paper's own numbers.

### How much older?
Older than the Sun does not mean billions of years older. A molecular cloud lives some ten million years, and its ice was laid down over a million or so of them. The water was made a few million to ten million years before the Sun was born, in the gas of earlier stars, whose oxygen it carries. The hydrogen is far older still — made in the Big Bang, 13.8 billion years ago.

### Supporting hints
Protostars such as IRAS 16293−2422 show deuterium-rich water in their warm inner envelopes, $10^{-3}$ or more; comets that formed beyond the snow line carry ratios consistent with the inheritance; and ALMA observations reported in 2023 of the disc of the young star V883 Orionis, which is being heated by an outburst, are said to show water with a D/H like that of comets and protostars, linking the stages. Inheritance is the favoured view, not a closed case: the fraction depends on the model, and the survival of ice through the accretion shock near the Sun is the weakest link.

> [!key] The Sun's disc could not make Earth's water from scratch; 30–50 per cent of the oceans' water is likely interstellar ice that formed in the parent cloud, millions of years before the Sun. If so, water is not a fluke of the Solar System but a standard ingredient of planet formation.`,
  ideas: ['Earth\'s oceans have a D/H of $1.56\\times10^{-4}$, too high for water made in the young Sun\'s disc by the ionisation available there, according to the 2014 model of Cleeves and colleagues.', 'Interstellar ice, formed at 10 K, is richer in deuterium; mixing it with water made in the disc matches the oceans for an inherited fraction of 30–50 %.', '"Older than the Sun" means formed some millions of years earlier in the parent cloud; the oxygen came from earlier stars and the hydrogen from the Big Bang.', 'If ice survives the formation of a star, then every planetary system inherits water from its cloud.'],
  pitfalls: ['"Part of the ocean is 4.6 billion years old, so it is the oldest thing on Earth" — Its molecules are older than the Sun, but they have been cycled through rain, rivers, ice and the mantle ever since; the age is of the formation of the ice, not of the drop in your glass.', '"The inheritance is proved" — It is a model result, supported by indirect evidence. The 30–50 % depends on the ionisation rates and on how much ice survives the accretion shock; other models give smaller shares.', '"Interstellar means from another star system" — The ice formed in the cloud that made the Sun and its siblings, not in a different system; the cloud was the Solar System\'s own parent.'],
  terms: [
    { term: 'Protoplanetary disc', also: ['protoplanetary disk', 'solar nebula', 'protosolar nebula', 'accretion disc'], def: 'The flattened rotating disc of gas and dust around a newborn star, from which its planets, moons, asteroids and comets form. The Sun\'s lasted a few million years.' },
    { term: 'Inherited ice', also: ['presolar ice', 'interstellar ice', 'cloud ice'], def: 'Water ice that formed in the parent molecular cloud, before the star, and survived the collapse and the disc to be built into comets and planets, as opposed to ice made later in the disc.' },
    { term: 'Chemical reset', also: ['reprocessing', 'reset'], def: 'The destruction of a molecule\'s original composition — for example by heating or radiation — and its rebuilding from simpler parts, which erases the isotope ratio it came with.' },
    { term: 'Hot corino', also: ['hot core', 'warm inner envelope'], def: 'The small region around a young low-mass star where the ice mantles have just evaporated at 100 K or more. Its water vapour shows the composition of the ice before the star began to change it.' },
    { term: 'Ionisation rate', also: ['cosmic-ray ionisation rate', 'ζ'], def: 'The number of ionisations per hydrogen molecule per second caused by cosmic rays, X-rays and radioactivity. It drives the ion chemistry that passes deuterium into water and other molecules.' }
  ],
  formulas: [
    { name: 'Mixture of two sources of water', expr: 'R = Rd + f*(Ri - Rd)', tex: 'R = R_d + f\\,(R_i - R_d)',
      vars: { R: { name: 'D/H of the mixture', value: 1.5576e-4 }, f: { name: 'fraction inherited', q: 'ratio', unit: '%', value: 40, min: 0, max: 100 }, Ri: { name: 'D/H of the inherited ice', value: 3.3e-4, tex: 'R_i', hint: 'Oort-cloud comets such as Hale–Bopp run at about 3 × 10⁻⁴; hot corinos at 10⁻³ or more.' }, Rd: { name: 'D/H of the water made in the disc', value: 3e-5, tex: 'R_d', hint: 'Illustrative: a few times the protosolar 2.1 × 10⁻⁵.' } },
      solveFor: 'f', note: 'The ratios are weighted by the amount of hydrogen in each source, which for water is the same as the amount of water. A sketch of the logic, not the values in the paper.',
      stories: { f: 'Inherited ice has D/H {Ri}, disc-made water {Rd}; the mixture matches {R}. What fraction was inherited?', R: 'A fraction {f} of the water is ice of D/H {Ri}, the rest has {Rd}. What is the mixture\'s D/H?' } },
    { name: 'The inherited water in the oceans', expr: 'M = f*Mo', tex: 'M = f\\,M_o',
      vars: { M: { name: 'inherited water', q: 'mass', unit: 'kg' }, f: { name: 'fraction inherited', q: 'ratio', unit: '%', value: 40, min: 0, max: 100 }, Mo: { name: 'mass of the oceans', q: 'mass', unit: 'kg', value: 1.37e21, tex: 'M_o' } },
      solveFor: 'M', note: 'For 30–50 % that is $4$–$7\\times10^{20}$ kg, or 0.4–0.7 oceans.',
      stories: { M: 'The oceans have {Mo} of water and a fraction {f} is inherited. How much is it?' } }
  ],
  examples: [
    { title: 'What fraction was inherited?', q: 'Suppose ice from the parent cloud had a D/H of $3.3\\times10^{-4}$ (the value of Hale–Bopp), and water made in the disc had $3\\times10^{-5}$. What inherited fraction gives the oceans\' $1.56\\times10^{-4}$?',
      steps: [{ text: 'Solve the balance for $f$:', tex: 'f = \\frac{R - R_d}{R_i - R_d} = \\frac{1.56\\times10^{-4} - 0.30\\times10^{-4}}{3.3\\times10^{-4} - 0.30\\times10^{-4}} = 0.42' }, 'Check: $0.42 \\times 3.3 + 0.58 \\times 0.30 = 1.56$ (in units of $10^{-4}$).'],
      a: 'About 42 % inherited, inside the 30–50 % range. Make the disc-made water lighter or the ice heavier and the inherited fraction falls; make the ice only $2\\times10^{-4}$ and nearly all of Earth\'s water would have to be inherited.' },
    { title: 'How many oceans are older than the Sun?', q: 'If 30 to 50 per cent of $1.37\\times10^{21}$ kg of ocean water is inherited, how much is that in kilograms and in oceans?',
      steps: [{ text: 'Multiply:', tex: 'M = 0.30 \\times 1.37\\times10^{21} = 4.1\\times10^{20}\\ \\mathrm{kg}, \\qquad 0.50 \\times 1.37\\times10^{21} = 6.9\\times10^{20}\\ \\mathrm{kg}' }, 'That is 0.3 to 0.5 of the oceans; the volume is $4$–$7\\times10^{8}$ km³.'],
      a: 'Between $4\\times10^{20}$ and $7\\times10^{20}$ kg: as much water as the whole Atlantic Ocean ($3.1\\times10^{8}$ km³) or somewhat more.' }
  ],
  quiz: [
    { q: 'According to the 2014 model of Cleeves and colleagues, how much of Earth\'s ocean water is older than the Sun?', choices: ['None', '1–5 %', '30–50 %', 'All of it'], a: 2, why: 'The ionisation available in the young Sun\'s disc could not produce the oceans\' deuterium; an inherited fraction of 30 to 50 per cent fits.' },
    { q: 'Interstellar ice formed in the cold cloud has a higher D/H than water made in a warm disc.', a: true, why: 'Cold ion chemistry passes deuterium into water with a bias that grows as the temperature falls; the disc is warm and the effect is weak.' },
    { q: 'What does "older than the Sun" mean for these water molecules?', choices: ['They are billions of years older than the Solar System', 'They formed as ice in the parent cloud some millions of years before the Sun formed', 'They arrived from another galaxy', 'They were made in the Sun\'s core'], a: 1, why: 'The cloud and its ice predate the Sun by some millions to ten million years. The hydrogen is older, from the Big Bang; the oxygen was made in earlier stars.' },
    { q: 'If the disc-made water had $R_d = 3\\times10^{-5}$ and the ice $R_i = 5\\times10^{-4}$, what inherited fraction (as a percentage) reproduces $1.56\\times10^{-4}$?', answer: 26.8, why: '$f = (1.56 - 0.30)/(5.0 - 0.30) = 0.268$. A heavier ice needs less of it.' },
    { q: 'Which finding would most weaken the inheritance hypothesis?', choices: ['Hot corinos with D/H above $10^{-3}$', 'Evidence that the accretion shock near the young Sun evaporated all interstellar ice at every distance', 'Water on comets', 'Protoplanetary discs with water'], a: 1, why: 'The argument needs ice to have survived. If every molecule had been vaporised and remade, the cloud\'s deuterium would have been reset, and the disc models would have to be re-examined.' }
  ],
  applications: ['A reason to expect water in the discs of other young stars, and so in the planets they make ([[water-worlds-around-other-stars]]).', 'A starting point for models of comet and asteroid composition: the amount and the isotopes of their water.', 'A guide for what to look for in samples returned from asteroids such as Ryugu and Bennu: the D/H of water-bearing minerals.', 'A link between astronomers\' cloud-and-disc observations and geochemists\' measurements of meteorites and of rocks from Earth\'s mantle.'],
  history: 'Cleeves, a graduate student at the University of Michigan when the paper was written, built the model with Edwin Bergin, Conel Alexander of the Carnegie Institution and colleagues. It appeared in *Science* on 25 September 2014 as "The ancient heritage of water ice in the Solar System", a few months before Rosetta\'s measurement of comet 67P made the question of heavy water topical.',
  sources: ['Scientific American / Nature News coverage of Cleeves and colleagues, "Earth has water older than the Sun", on the *Science* paper of 25 September 2014 — the 30–50 % figure.', 'Cleeves and colleagues, "The ancient heritage of water ice in the Solar System", *Science* 345 (2014).', 'Persson and colleagues on the water around IRAS 16293−2422 (2013), and Tobin and colleagues on V883 Orionis, *Nature* (2023), for the observational chain.'],
  sim: 'cos-inheritance'
},

/* ================================================================ 5 */
{
  id: 'the-snow-line', parent: 'older-than-the-sun', title: 'The snow line', level: 1,
  short: 'Around a young star there is a distance, about 2.7 AU for the early Sun, beyond which water stays frozen. Inside it, rock; outside it, rock plus ice. The line shaped which planets became gas giants, which became dry, and where comets formed.',
  keywords: ['snow line', 'frost line', 'ice line', '2.7 AU', 'equilibrium temperature', 'sublimation', 'asteroid belt', 'Ceres', 'Jupiter', 'Galilean moons', 'protoplanetary disc', 'volatile'],
  prereq: ['how-water-forms-in-space', 'physics:planets'],
  related: ['water-older-than-the-sun', 'comets-asteroids-and-earths-water', 'the-habitable-zone', 'europa', 'ceres-pluto-and-the-dwarfs', 'ganymede-and-callisto'],
  body: `
Look at the Solar System from outside and one boundary stands out: the planets inside it are small and rocky, the planets outside it big, light and icy. The boundary lies in the asteroid belt, near 2.7 AU. It is the **snow line**, and it is a line only of temperature.

### Where ice can live
Dust in a young disc is warmed by the star, and a bare grain settles where it radiates as much as it absorbs:

$$T = \\left[\\frac{L(1-A)}{16\\pi\\sigma d^2}\\right]^{1/4}$$

For a black grain ($A = 0$) around the Sun that gives 278 K at 1 AU and falls as $d^{-1/2}$: 170 K at 2.7 AU. At that temperature the vapour pressure above water ice is $7\\times10^{-4}$ Pa, close to the pressure of water vapour in a disc. Colder, the ice cannot evaporate faster than the gas redeposits it; warmer, it vanishes. The snow line is where those two meet, at about 150–170 K, depending on the pressure, and moves in or out as the luminosity changes.

### What it did
- **Beyond it, there was twice the solid material.** Water is the commonest ice, and the grains outside the line carry about as much ice as rock. The surplus raised the number of building blocks and helped Jupiter's core grow fast enough to capture hydrogen before the gas disc dissipated.
- **Rock inside, water-bearing outside.** In the asteroid belt the inner, dry rocks (2.2 AU) give way to dark carbon-rich bodies near 3 AU that hold water bound in minerals; Ceres, at 2.77 AU, is a quarter water; a few belt asteroids even grow comet-like tails.
- **The Galilean moons.** Io, nearest to Jupiter, has a density of 3.5 g/cm³ and no water; Europa is 3.0, Ganymede 1.9 and Callisto 1.8, because the disc around young Jupiter cooled with distance and the outer moons took up more ice ([[europa]], [[ganymede-and-callisto]]).
- **Comets.** The ice of comets formed beyond the line, mostly far beyond it.

### Not one line
Every ice has its own line. Carbon dioxide stays frozen below about 70–80 K, which for the Sun is some 12 AU; methane below about 30 K, at around 90 AU; carbon monoxide below 20–25 K, at more than 120 AU. Distances for the early Sun's disc as a blackbody. The water line matters most because water is the most abundant ice and the one a planet needs ([[the-habitable-zone]]).

### The line moved
A snow line is not fixed. A young star is first brighter, and the dense disc is heated by gas falling inward, so the line began far out and moved inward as the disc thinned and cooled over a few million years; later the Sun dimmed to 70 % of today's brightness and began to brighten again. The line scales as the square root of the luminosity: 0.1 AU for a faint red dwarf, 12 AU for a star twenty times as luminous as the Sun. A planet that forms inside the line is born dry; whether it ends dry is the subject of the next pages.

> [!key] The snow line is the distance at which a bare grain is cold enough (about 150–170 K) for water ice to survive: 2.7 AU for the young Sun, proportional to the square root of the star's luminosity. It divides dry inner worlds from ice-rich outer ones, and set where giant planets and comets grew.`,
  ideas: ['The snow line is where a grain\'s equilibrium temperature falls to about 150–170 K, so that water ice no longer evaporates; for the young Sun it is at about 2.7 AU.', 'The temperature of a bare grain falls as the inverse square root of distance and rises as the fourth root of luminosity, so the snow line moves as $\\sqrt{L}$.', 'Beyond the line, ice roughly doubled the solid material, favouring the cores of giant planets; inside it planets were born dry.', 'Each ice has its own line: CO₂ at around 12 AU, CO beyond 100 AU for the Sun.'],
  pitfalls: ['"The snow line is where it snows" — It is a temperature boundary in a gas-and-dust disc, where ice grains neither melt nor evaporate away. It has nothing to do with snowflakes.', '"Everything inside the line is bone dry" — Water can be bound in minerals or delivered by objects from beyond the line, which is how Earth, inside it, ended up with oceans ([[comets-asteroids-and-earths-water]]).', '"The line is a fixed distance for the Solar System" — It moved as the disc cooled and as the Sun\'s brightness changed, and it would sit at a different place for any other star.'],
  terms: [
    { term: 'Snow line', also: ['frost line', 'ice line', 'water ice line'], def: 'The distance from a star at which a disc is cold enough for water ice to survive, about 150–170 K. For the young Sun it lies near 2.7 AU. Beyond it, water is solid.' },
    { term: 'Equilibrium temperature', also: ['blackbody temperature', 'radiative equilibrium temperature'], def: 'The temperature at which a body radiates as much heat as it absorbs from its star. For a black grain at 1 AU from the Sun it is 278 K; for a planet with an albedo of 0.3 it is 255 K.' },
    { term: 'Sublimation', also: ['evaporation of ice', 'sublimation of ice'], def: 'The passage of a substance from solid to vapour without becoming liquid. Water ice sublimes in near-vacuum above about 100 K at the pressures of space.' },
    { term: 'Volatile', also: ['volatiles', 'refractory'], def: 'A compound — water, carbon dioxide, methane — that becomes vapour at low temperatures, as against a refractory, such as silicate rock, that stays solid. Where a disc is cooler than a volatile\'s line, that volatile is ice.' }
  ],
  formulas: [
    { name: 'Equilibrium temperature at a distance', expr: 'T = (L*(1 - A)/(16*pi*sigma*d^2))^(1/4)', tex: 'T = \\left[\\frac{L\\,(1-A)}{16\\pi\\sigma d^2}\\right]^{1/4}',
      vars: { T: { name: 'equilibrium temperature', q: 'temperature', unit: 'K' }, L: { name: 'luminosity of the star', q: 'power', unit: 'L☉', value: 1 }, A: { name: 'albedo', q: 'ratio', unit: '', value: 0, min: 0, max: 0.99, hint: '0 for a black grain; 0.3 for Earth.' }, sigma: { const: 'sigma' }, d: { name: 'distance from the star', q: 'length', unit: 'AU', value: 2.7, min: 0.01 } },
      solveFor: 'T', note: 'A fast-rotating body with uniform temperature. Set the albedo to 0 for dust and 0.3 for Earth; greenhouse warming is not included.',
      stories: { T: 'A black grain sits {d} from a star of luminosity {L}. What is its equilibrium temperature?', d: 'A grain must be at {T} for ice to survive around a star of {L}. How far away is that?' } },
    { name: 'The snow line for a star of any luminosity', expr: 'd = d0*sqrt(L/Lsun)', tex: 'd = d_0\\sqrt{L/L_\\odot}',
      vars: { d: { name: 'snow line distance', q: 'length', unit: 'AU' }, d0: { name: 'snow line of a Sun-like star', q: 'length', unit: 'AU', value: 2.7, fixed: true, tex: 'd_0' }, L: { name: 'luminosity of the star', q: 'power', unit: 'L☉', value: 1 }, Lsun: { const: 'Lsun', tex: 'L_\\odot' } },
      solveFor: 'd', note: 'Because the temperature at a fixed distance goes as $L^{1/4}$, the distance for a fixed temperature goes as $L^{1/2}$.',
      stories: { d: 'A star shines with {L}. Where is its snow line?', L: 'A star\'s snow line is at {d}. What is its luminosity?' } },
    { name: 'Vapour pressure above ice', expr: 'p = p0*exp(-(Ls/Rs)*(1/T - 1/T0))', tex: 'p = p_0\\,\\exp\\!\\left[-\\frac{L_s}{R_s}\\left(\\frac1T - \\frac1{T_0}\\right)\\right]',
      vars: { p: { name: 'vapour pressure over ice', q: 'pressure', unit: 'Pa' }, p0: { name: 'pressure at the triple point', q: 'pressure', unit: 'Pa', value: 611.657, fixed: true, tex: 'p_0' }, Ls: { name: 'latent heat of sublimation', q: 'latent', unit: 'kJ/kg', value: 2834, fixed: true, tex: 'L_s' }, Rs: { name: 'gas constant of water vapour', q: 'specificheat', unit: 'J/(kg·K)', value: 461.5, fixed: true, tex: 'R_s' }, T: { name: 'temperature of the ice', q: 'temperature', unit: 'K', value: 170, min: 60, max: 273 }, T0: { name: 'triple-point temperature', q: 'temperature', unit: 'K', value: 273.16, fixed: true, tex: 'T_0' } },
      solveFor: 'p', note: 'The Clausius–Clapeyron relation with a constant latent heat; it agrees with the IAPWS sublimation curve within a few per cent from 130 K to the triple point. At 170 K it gives $7.3\\times10^{-4}$ Pa.',
      stories: { p: 'Ice in a disc is at {T}. What is the pressure of the vapour in equilibrium with it?', T: 'The vapour pressure of water in a disc is {p}. Ice survives only below what temperature?' } }
  ],
  examples: [
    { title: 'A faint star and a bright one', q: 'Where is the snow line of Proxima Centauri (luminosity 0.0017 Suns) and of a star twenty times as luminous as the Sun? Proxima b orbits at 0.0485 AU.',
      steps: [{ text: 'The line scales with $\\sqrt{L}$:', tex: 'd = 2.7\\ \\mathrm{AU}\\times\\sqrt{0.0017} = 0.111\\ \\mathrm{AU}, \\qquad 2.7\\times\\sqrt{20} = 12.1\\ \\mathrm{AU}' }, 'Proxima b lies at 0.0485 AU, inside the line.'],
      a: 'Proxima\'s snow line is at 0.11 AU, 12 AU for the bright star. Proxima b orbits inside the line, so if it formed where it is it began dry; either it migrated inward from beyond the line, or water arrived later (see [[water-worlds-around-other-stars]]).' },
    { title: 'Where the ice survives', q: 'The pressure of water vapour in a disc is $10^{-4}$ Pa. Below what temperature can ice survive, and at what distance around the Sun does a black grain reach it?',
      steps: [{ text: 'Invert the vapour pressure formula:', tex: 'T = \\left[\\frac{1}{T_0} - \\frac{R_s}{L_s}\\ln\\frac{p}{p_0}\\right]^{-1} = \\left[0.003661 + 1.628\\times10^{-4}\\times15.63\\right]^{-1} = 161\\ \\mathrm{K}' }, 'Distance: a black grain is at 278.6 K at 1 AU, so $d = (278.6/161)^2 = 3.0$ AU.'],
      a: 'Ice survives below 161 K, which for the Sun lies at 3.0 AU. A lower disc pressure puts the line at a lower temperature and a larger distance, a higher one closer in; the quoted 2.7 AU corresponds to 170 K.' }
  ],
  quiz: [
    { q: 'The snow line for a star four times as luminous as the Sun is at', choices: ['1.35 AU', '2.7 AU', '5.4 AU', '10.8 AU'], a: 2, why: 'The line scales as $\\sqrt{L}$, and $\\sqrt{4} = 2$, so $2 \\times 2.7 = 5.4$ AU.' },
    { q: 'The snow line is the distance at which ice melts to water.', a: false, why: 'In the vacuum of a disc water has no liquid phase at those pressures; ice sublimates directly to vapour. The line is where evaporation outweighs deposition.' },
    { q: 'Why did giant planet cores grow more easily beyond the line?', choices: ['The disc was hotter there', 'Ice roughly doubled the amount of solid material available', 'There was no gas there', 'The star was brighter there'], a: 1, why: 'Water ice adds mass to the grains. With about twice as much solid material, cores grew massive enough to capture gas before the disc dispersed.' },
    { q: 'What is the equilibrium temperature of a black grain 5.2 AU (Jupiter\'s distance) from the Sun, in kelvin?', answer: 122, unit: 'K', why: '$278.6/\\sqrt{5.2} = 122$ K, well below the 170 K of the snow line, so ice is stable there.' },
    { q: 'Europa has a density of 3.0 g/cm³, Ganymede 1.9 and Callisto 1.8. This pattern is best explained by', choices: ['Callisto being older', 'the disc around young Jupiter being cooler with distance, so the outer moons accreted more ice', 'tidal heating melting Ganymede', 'Callisto having a larger core'], a: 1, why: 'The moons formed in a disc around Jupiter that was hot near the planet and cool away from it, a miniature snow line; the farther the moon, the more ice it took up.' }
  ],
  applications: ['Explaining why the Solar System has rocky planets inside and giant, ice-rich ones outside.', 'Predicting which exoplanets formed dry or wet from their star\'s luminosity.', 'Interpreting asteroid classes: the gradient from dry inner-belt rock to hydrated outer-belt material.', 'Planning where to look for ice on small bodies (Ceres, comets, main-belt comets), and where to expect it to be stable today.'],
  history: 'The 2.7 AU figure comes from Chushiro Hayashi\'s minimum-mass model of the solar nebula (1981), which put the temperature at 170 K there. Observing ices in the discs of other young stars became possible with the Spitzer and Herschel telescopes.',
  sources: ['Hayashi, "Structure of the solar nebula, growth and decay of magnetic fields and effects of magnetic and turbulent viscosities on the nebula", *Progress of Theoretical Physics Supplement* 70 (1981) — the 2.7 AU snow line.', 'IAPWS release on the sublimation pressure of ordinary water substance (2011), for the vapour pressure above ice.', 'NASA/JPL Galileo mission summaries of the densities of Io, Europa, Ganymede and Callisto.'],
  sim: 'cos-snow-line'
},

/* ================================================================ 6 */
{
  id: 'comets-asteroids-and-earths-water', parent: 'older-than-the-sun', title: 'Comets, asteroids and Earth\'s water', level: 2,
  short: 'Earth formed inside the snow line yet its oceans match carbonaceous meteorites in deuterium, not the comets that Halley and Rosetta measured. The balance of evidence puts asteroid-like material far ahead of comets as the main source — though when it arrived is argued.',
  keywords: ['late veneer', 'comets', 'asteroids', 'carbonaceous chondrite', 'D/H', 'Halley', 'Hartley 2', '67P', 'Rosetta', 'origin of the oceans', 'grand tack', 'delivery of water'],
  prereq: ['the-deuterium-clock', 'the-snow-line'],
  related: ['earth-may-always-have-been-wet', 'where-the-oceans-came-from', 'water-older-than-the-sun', 'the-mantles-hidden-oceans', 'how-much-water-earth-has'],
  body: `
Earth's oceans have a mass of $1.37\\times10^{21}$ kg, only 0.023 per cent of the planet's mass — about the proportion of a drop in a bucket. Yet the planet grew inside the snow line, where the disc was too hot for ice. Where did even that much come from?

### The suspects
- **The nebula itself:** gas around the forming Earth, adsorbed on dust grains. Cheap, but its hydrogen is light ($2\\times10^{-5}$), far from the oceans' $1.56\\times10^{-4}$.
- **Comets:** icy bodies from beyond the snow line, a natural source.
- **Asteroids:** rocky bodies, especially the dark carbonaceous kind of the outer belt, which hold water in clay-like minerals — in some meteorites 10 per cent or more by mass.

### The test is deuterium
| Source | D/H ($10^{-4}$) | Times Earth's oceans |
|---|---|---|
| Carbonaceous chondrites | 1.4 | 0.9 |
| Hartley 2 (Jupiter-family comet, 2011) | 1.6 | 1.0 |
| 46P/Wirtanen | 1.6 | 1.0 |
| Earth's oceans | 1.56 | 1 |
| Hyakutake (Oort-cloud comet) | 2.9 | 1.9 |
| Halley | 3.2 | 2.0 |
| Hale–Bopp | 3.3 | 2.1 |
| 67P/Churyumov–Gerasimenko (Rosetta, 2014) | 5.3 | 3.4 |

Carbonaceous chondrites — the meteorites of the outer belt — match. Comets mostly do not: Halley and Hale–Bopp are twice as heavy, and 67P, measured by Rosetta's ROSINA instrument in 2014, is three and a half times. In 2011 Herschel found Hartley 2 with an Earth-like ratio, which raised hopes for Jupiter-family comets; 67P, a Jupiter-family comet too, dashed them. Comets are a mixed bag and the average is heavier than the oceans.

### The late veneer
Earth's mantle holds gold, platinum and related metals in near-chondritic proportions, though their chemistry should have drawn nearly all of them into the core. The excess is read as a **late veneer**: 0.5 to 1 per cent of Earth's mass, added after the core formed. If it was carbonaceous material with 5–10 per cent water, it brought one to several oceans. An ocean needs only 230 kg of water per million kilograms of Earth. A comet like 67P ($10^{13}$ kg, perhaps 15 per cent water) would need nearly a billion visits to fill the oceans.

### Where the argument stands
Most researchers favour chondritic material — asteroid-like — as the main source, with comets a minor share: more than about a tenth of 67P-like water would put the oceans' ratio out of range ([[the-deuterium-clock]]). Beyond that, the story diverges. One model, the "Grand Tack", has Jupiter wandering inward and back, scattering carbonaceous asteroids onto Earth's path. Another says the carbonaceous late veneer cannot have been large, because ruthenium isotopes in the mantle suggest dry, enstatite-like material, and that Earth was already wet ([[earth-may-always-have-been-wet]]). Neither side has won. What is firm is the elimination: the oceans are not mostly cometary.

> [!key] Earth's oceans match carbonaceous meteorites in deuterium and match few comets, so asteroid-like material, not comets, is the best candidate for most of the water. When and in what form it arrived — in a late veneer or in Earth's own building blocks — is still debated.`,
  ideas: ['The oceans are 0.023 % of Earth\'s mass; they must have come from beyond the snow line or from hydrated minerals formed in the nebula.', 'Carbonaceous chondrites match Earth\'s D/H; most Oort-cloud comets (Halley, Hale–Bopp) are twice as heavy, and 67P is 3.4 times.', 'The late veneer, 0.5–1 % of Earth\'s mass added after the core formed, could have supplied one to several oceans if it was water-rich chondritic material.', 'Comets are now seen as a minor source; when the asteroid-like water arrived remains debated.'],
  pitfalls: ['"Comets are dirty snowballs that watered the Earth" — That was the textbook story into the 1990s. Halley\'s deuterium and later 67P\'s showed that most comets have the wrong ratio; at most a small share of the ocean could be cometary.', '"Hartley 2 matches, so comets can supply the water" — One match does not decide it: other comets differ widely, and nitrogen and noble-gas ratios at 67P also differ from Earth\'s.', '"Asteroids are dry rocks" — Carbonaceous asteroids hold water as hydrated minerals — up to 10–20 % of the mass of the richest meteorites — released when they are heated.'],
  terms: [
    { term: 'Late veneer', also: ['late accretion'], def: 'The last 0.5–1 % of Earth\'s mass, delivered by impacts after the core had formed. It left an excess of core-loving metals such as gold and platinum in the mantle and may have delivered volatiles, water among them.' },
    { term: 'Carbonaceous chondrite', also: ['CI chondrite', 'CM chondrite', 'C-type asteroid material'], def: 'A primitive stony meteorite rich in carbon and in water held in clay minerals (CI chondrites up to roughly 10–20 % by mass), thought to come from the outer asteroid belt. Their D/H of about $1.4\\times10^{-4}$ matches Earth\'s.' },
    { term: 'Jupiter-family comet', also: ['JFC', 'short-period comet'], def: 'A comet with an orbital period under 20 years, thought to originate in the Kuiper belt and to have been scattered inwards by the giant planets. 67P and Hartley 2 are examples.' },
    { term: 'Oort-cloud comet', also: ['long-period comet', 'Halley-type comet'], def: 'A comet with a long period, coming from the distant Oort cloud or, for Halley-type comets, from there via a shorter orbit. Halley, Hyakutake and Hale–Bopp are examples; their D/H is two or more times Earth\'s.' },
    { term: 'Chondrite', also: ['chondritic meteorite'], def: 'A stony meteorite that has never been melted, made of tiny spheres (chondrules) and dust stuck together in the early disc. They are the best record of the material that made the planets.' }
  ],
  formulas: [
    { name: 'D/H of a mixture of two sources', expr: 'R = Rc + f*(Rk - Rc)', tex: 'R = R_c + f\\,(R_k - R_c)',
      vars: { R: { name: 'D/H of the mixture', value: 1.5e-4 }, f: { name: 'share of the water from comets', q: 'ratio', unit: '%', value: 10, min: 0, max: 100 }, Rc: { name: 'D/H of chondritic water', value: 1.4e-4, tex: 'R_c' }, Rk: { name: 'D/H of cometary water', value: 5.3e-4, tex: 'R_k', hint: '5.3 × 10⁻⁴ is 67P; Hartley 2 is 1.6 × 10⁻⁴.' } },
      solveFor: 'f', note: 'The ratios are weighted by the mass of water from each source.',
      stories: { R: 'Chondritic water has D/H {Rc}, comet water {Rk}, and comets give a share {f}. What is the mixture\'s D/H?', f: 'The oceans have D/H {R}; chondritic water has {Rc} and comet water {Rk}. What share is cometary?' } },
    { name: 'Oceans delivered by a late veneer', expr: 'N = fv*Mearth*w/Mo', tex: 'N = \\frac{f_v\\,M_\\oplus\\,w}{M_o}',
      vars: { N: { name: 'oceans delivered', q: 'count', unit: '' }, fv: { name: 'veneer mass as a fraction of Earth', q: 'ratio', unit: '%', value: 0.5, min: 0, max: 2, tex: 'f_v' }, Mearth: { const: 'Mearth', tex: 'M_\\oplus' }, w: { name: 'water content of the veneer', q: 'ratio', unit: '%', value: 10, min: 0, max: 30 }, Mo: { name: 'mass of the oceans', q: 'mass', unit: 'kg', value: 1.37e21, tex: 'M_o' } },
      solveFor: 'N', note: 'A hydrated carbonaceous veneer of 0.5 % of Earth\'s mass with 10 % water would deliver about two oceans.',
      stories: { N: 'A veneer of {fv} of Earth\'s mass carries {w} water. How many oceans\' worth is that?', fv: 'To deliver {N} oceans with water content {w}, how large a veneer is needed?' } },
    { name: 'Comets needed to fill the oceans', expr: 'Nc = Mo/(mc*wc)', tex: 'N_c = \\frac{M_o}{m_c\\,w_c}',
      vars: { Nc: { name: 'number of comets', q: 'count', unit: '', tex: 'N_c' }, Mo: { name: 'mass of the oceans', q: 'mass', unit: 'kg', value: 1.37e21, tex: 'M_o' }, mc: { name: 'mass of one comet', q: 'mass', unit: 'kg', value: 1e13, tex: 'm_c', hint: 'Rosetta weighed 67P at 1.0 × 10¹³ kg.' }, wc: { name: 'water share of the comet', q: 'ratio', unit: '%', value: 15, min: 1, max: 100, tex: 'w_c', hint: 'Ice makes perhaps a tenth to a quarter of a comet by mass; estimates differ.' } },
      solveFor: 'Nc', note: 'About a billion 67P-sized comets; the upper limit on comets\' share is set by deuterium, not by supply.',
      stories: { Nc: 'Comets of mass {mc} are {wc} water. How many are needed to bring {Mo} of water?' } }
  ],
  examples: [
    { title: 'How many comets can the oceans stand?', q: 'Chondritic water has D/H $1.4\\times10^{-4}$ and 67P-like water $5.3\\times10^{-4}$. If the oceans must match $1.56\\times10^{-4}$ to within 10 per cent, what is the largest cometary share?',
      steps: [{ text: 'The upper limit is $1.1 \\times 1.56 = 1.71\\times10^{-4}$. Solve for $f$:', tex: 'f = \\frac{R - R_c}{R_k - R_c} = \\frac{1.71 - 1.40}{5.30 - 1.40} = 0.08' }, 'The chondrites alone ($1.40\\times10^{-4}$) fall a little short of $1.56\\times10^{-4}$, so some heavy water is welcome: to hit the oceans exactly needs $f = 0.16/3.9 = 4$ per cent.'],
      a: 'Between 4 per cent (an exact match) and 8 per cent (within 10 per cent). With 67P-like comets, more than a tenth of the ocean would put its deuterium out of range; with Hartley 2-like comets the limit disappears, which is why more than one comet is needed to settle the matter.' },
    { title: 'A veneer of two oceans', q: 'A late veneer is 0.5 per cent of Earth\'s mass and is 10 per cent water. How many oceans does it deliver?',
      steps: [{ text: 'Mass of water delivered:', tex: 'M = 0.005 \\times 5.97\\times10^{24} \\times 0.10 = 3.0\\times10^{21}\\ \\mathrm{kg}' }, 'Divide by an ocean: $3.0\\times10^{21}/1.37\\times10^{21} = 2.2$.'],
      a: 'About 2.2 oceans — enough, so a water-rich veneer would have to be somewhat dry or partly lost to space. That is why the veneer is a candidate, but not proof.' }
  ],
  quiz: [
    { q: 'Which type of body has a D/H closest to that of Earth\'s oceans?', choices: ['Halley\'s comet', 'Comet 67P', 'Carbonaceous chondrites', 'The young Sun\'s gas'], a: 2, why: 'Carbonaceous chondrites are at $1.4\\times10^{-4}$, 0.9 times the oceans. Halley is twice, 67P 3.4 times, and the Sun\'s gas 0.13 times.' },
    { q: 'Rosetta found that comet 67P has a deuterium-to-hydrogen ratio about three times Earth\'s.', a: true, why: 'ROSINA measured $5.3\\times10^{-4}$ in 2014 against $1.56\\times10^{-4}$: 3.4 times. That ruled out Jupiter-family comets as the main source of the oceans.' },
    { q: 'What is the "late veneer"?', choices: ['A layer of ice on the oceans', 'About 0.5–1 % of Earth\'s mass delivered by impacts after the core formed', 'The Moon', 'The atmosphere'], a: 1, why: 'The mantle\'s excess of metals that should have sunk into the core is read as a late addition of chondritic material. It might also have brought water.' },
    { q: 'If the late veneer is 0.8 % of Earth\'s mass and 8 % water, how many oceans (of $1.37\\times10^{21}$ kg) does it carry?', answer: 2.79, why: '$0.008 \\times 5.97\\times10^{24} \\times 0.08 = 3.82\\times10^{21}$ kg; divided by $1.37\\times10^{21}$ is 2.8 oceans.' },
    { q: 'Which statement describes the present state of the argument?', choices: ['Comets delivered most of Earth\'s water, settled', 'Most researchers think asteroid-like (chondritic) material was the main source, comets a minor one; the timing is debated', 'Earth\'s water was made in the Earth\'s core', 'Nobody has any idea'], a: 1, why: 'Deuterium rules comets out as the main source; whether the chondritic water came in a late veneer or with Earth\'s building blocks is still under discussion.' }
  ],
  applications: ['Choosing targets for sample-return missions (Hayabusa2 at Ryugu, OSIRIS-REx at Bennu): the D/H of the water in their minerals.', 'Constraining models of planet formation, which must reproduce a small, late, chondritic share of water for Earth.', 'Comparing Earth with Venus and Mars, which share the same suppliers but kept different amounts ([[venus-lost-its-ocean]], [[the-moon-and-mars]]).', 'Assessing which exoplanets in the habitable zone could have received water from belts of asteroids.'],
  history: 'Until the 1980s comets were the favoured suppliers, in an idea going back to Whipple\'s "dirty snowball" comet model of 1950. Giotto\'s mass spectra of Halley (1986, analysed 1995) gave the first heavy value; the Herschel result for Hartley 2 in 2011 gave an Earth-like one; Rosetta\'s 2014 value at 67P settled the case against Jupiter-family comets as a main source.',
  sources: ['ESA, "First measurements of comet\'s water ratio" (9 December 2014) and Altwegg and colleagues, *Science* (2015) — the D/H of 67P.', 'Hartogh and colleagues, *Nature* 478 (2011) — Hartley 2.', 'Alexander and colleagues, "The provenances of asteroids, and their contributions to the volatile inventories of the terrestrial planets", *Science* 337 (2012) — the case for chondritic water.', 'Fischer-Gödde and Kleine, *Nature* 541 (2017) — ruthenium isotopes and the composition of the late veneer.'],
  sim: 'cos-water-mix'
},

/* ================================================================ 7 */
{
  id: 'earth-may-always-have-been-wet', parent: 'older-than-the-sun', title: 'Earth may always have been wet', level: 2,
  short: 'Enstatite chondrites, the dry-looking meteorites closest in make-up to Earth\'s building blocks, hold enough hydrogen for at least three oceans and match Earth\'s isotopes. Piani and colleagues (2020) suggest the water was built into the planet from the start.',
  keywords: ['enstatite chondrite', 'Piani', 'built-in water', 'building blocks', 'hydrogen isotopes', 'magma ocean', 'steam atmosphere', 'Earth formed wet', 'CNRS', 'mantle water'],
  prereq: ['comets-asteroids-and-earths-water', 'the-snow-line'],
  related: ['where-the-oceans-came-from', 'the-mantles-hidden-oceans', 'water-older-than-the-sun', 'the-deep-time-of-water', 'how-much-water-earth-has'],
  body: `
The classical story has an awkward opening: a planet that formed inside the snow line, from rock that never saw ice, and so began bone dry, with water arriving later. In 2020 a team led by Laurette Piani of the CNRS (Nancy, France) published the opposite suggestion: the rock itself was wet.

### The dry-looking building blocks
Meteorites are sorted into families by their chemistry, and one family, the **enstatite chondrites**, is unusual. They formed in the inner Solar System and are made of minerals that grew in an atmosphere with little oxygen — so dry in appearance that they had been assumed to hold hardly any water. They are only about 2 per cent of known meteorites. But they are the closest in isotopic make-up (oxygen, titanium, calcium, nickel and other elements) to the rock of Earth itself: the nearest sample we have of what Earth was made of.

### What was measured
Piani's team analysed 13 enstatite chondrites, 11 of them pristine, heating them for days to drive off water absorbed on Earth, and measured the hydrogen they hold and its isotopes. Their finding: the hydrogen, bound in minerals and in organic matter, would have supplied **at least three times the water of Earth's oceans**, and its hydrogen and nitrogen isotopes match those of Earth's mantle. The oceans' own hydrogen isotopes fit a mixture in which about 95 per cent comes from such material; the remainder is a minor, deuterium-richer ingredient whose nature the data do not fix. Here "water" means hydrogen that turns into water when it meets oxygen during heating, not drops in the rock.

### Can water survive the making of a planet?
The young Earth was molten, and the Moon-forming impact melted it again. A magma ocean releases its water as steam: a whole ocean in the air would press on the surface at 260 bar, above the critical pressure, and such an atmosphere stays a single dense fluid until the surface cools below $374\\ ^\\circ$C (647 K). Then rain falls for a very long time. Much of the water would have dissolved in the magma, and hydrogen taken into minerals in the mantle ([[the-mantles-hidden-oceans]]) is protected from loss. So the built-in picture is plausible, but not proved.

### What is, and is not, settled
- A source rich in hydrogen, and isotopically right for Earth, existed in the inner Solar System. That much is measured.
- That Earth was mostly built from it is an inference, resting on the match between Earth and enstatite chondrites in other isotopes; the match is imperfect.
- Comets and carbonaceous asteroids may still have added water ([[comets-asteroids-and-earths-water]]); the question has shifted from "was Earth dry?" to "how much came with it, how much later?"

If the oceans were built in, water is not a lucky delivery but part of what rocky planets are made from, and the snow line matters less than it seemed.

> [!key] Enstatite chondrites, once thought dry, hold at least three oceans' worth of hydrogen with Earth-like isotopes, so Earth may have been wet from birth rather than watered later. It does not exclude late deliveries; it removes the need for them.`,
  ideas: ['Enstatite chondrites formed in the inner Solar System and match Earth\'s isotopes more closely than any other meteorites.', 'Piani and colleagues (2020) found in them hydrogen enough for at least three Earth oceans, with hydrogen and nitrogen isotopes like Earth\'s mantle.', 'About 95 % of the hydrogen isotope signature of the oceans fits such material.', 'Water can survive a molten planet because hydrogen dissolves in magma and in mantle minerals, but how much survived is uncertain.'],
  pitfalls: ['"The meteorites contain liquid water" — They hold hydrogen bound in minerals and organic matter, which forms water on heating or reaction with oxygen. "Water" is shorthand for that hydrogen.', '"This disproves comets and asteroids as sources" — It shows that Earth\'s own building blocks may have carried enough; late additions may still have contributed.', '"Earth formed from enstatite chondrites" — They are the closest analogue, not the parent: the match in some isotopes is excellent, in others imperfect.'],
  terms: [
    { term: 'Enstatite chondrite', also: ['EH chondrite', 'EL chondrite'], def: 'A rare (about 2 % of falls) meteorite made of enstatite, a magnesium silicate, formed in oxygen-poor conditions. It is isotopically very close to Earth and so the best guide to the planet\'s building blocks.' },
    { term: 'Magma ocean', also: ['molten mantle'], def: 'A deep layer of molten rock covering a young planet after the heat of accretion and giant impacts. It exchanges gases with the atmosphere and can hold dissolved water.' },
    { term: 'Steam atmosphere', also: ['water-vapour atmosphere'], def: 'An atmosphere made mostly of water vapour, which a magma ocean releases. Its surface pressure for one ocean is about 260 bar. It condenses to a liquid ocean only when the surface falls below 374 °C.' },
    { term: 'Critical point', also: ['critical temperature', 'critical pressure'], def: 'The temperature (647 K) and pressure (22.06 MPa) above which water has no distinction between liquid and vapour. Above it, no amount of pressure produces a liquid surface.' }
  ],
  formulas: [
    { name: 'Surface pressure of a steam atmosphere', expr: 'p = N*Mo*g/(4*pi*R^2)', tex: 'p = \\frac{N\\,M_o\\,g}{4\\pi R^2}',
      vars: { p: { name: 'surface pressure', q: 'pressure', unit: 'bar' }, N: { name: 'number of oceans in the air', q: 'count', unit: '', value: 1 }, Mo: { name: 'mass of one ocean', q: 'mass', unit: 'kg', value: 1.37e21, tex: 'M_o' }, g: { const: 'g' }, R: { name: 'radius of the Earth', q: 'length', unit: 'km', value: 6371 } },
      solveFor: 'p', note: 'The weight of the vapour spread over the globe; ignores the air and the planet\'s curvature in the layer. The critical pressure of water is 220.6 bar.',
      stories: { p: 'The whole of {N} ocean(s), each {Mo}, is in the air above a planet of radius {R}. What pressure does it exert at the surface?' } },
    { name: 'Oceans\' worth in a planet\'s bulk', expr: 'N = Mearth*w/Mo', tex: 'N = \\frac{M_\\oplus\\,w}{M_o}',
      vars: { N: { name: 'number of oceans', q: 'count', unit: '' }, Mearth: { const: 'Mearth', tex: 'M_\\oplus' }, w: { name: 'water content by mass', q: 'ratio', unit: 'ppm', value: 700, min: 0, max: 50000 }, Mo: { name: 'mass of the oceans', q: 'mass', unit: 'kg', value: 1.37e21, tex: 'M_o' } },
      solveFor: 'N', note: '690 parts per million of the Earth\'s mass is three oceans: a water content of 0.07 %.',
      stories: { N: 'A planet of Earth\'s mass has a water content of {w}. How many oceans of {Mo} is that?', w: 'To hold {N} oceans of {Mo}, an Earth-mass planet needs what water content?' } },
    { name: 'Oceans\' worth in the mantle', expr: 'N = Mm*w/Mo', tex: 'N = \\frac{M_m\\,w}{M_o}',
      vars: { N: { name: 'number of oceans', q: 'count', unit: '' }, Mm: { name: 'mass of the mantle', q: 'mass', unit: 'kg', value: 4.03e24, tex: 'M_m' }, w: { name: 'water content of the mantle', q: 'ratio', unit: 'ppm', value: 500, min: 0, max: 20000, hint: 'Estimates run from about 100 to 1,000 parts per million.' }, Mo: { name: 'mass of the oceans', q: 'mass', unit: 'kg', value: 1.37e21, tex: 'M_o' } },
      solveFor: 'N', note: 'The mantle contents are uncertain; most estimates lie between a quarter of an ocean and three oceans.',
      stories: { N: 'A mantle of {Mm} holds water at {w}. How many oceans of {Mo} is that?' } }
  ],
  examples: [
    { title: 'An ocean in the air', q: 'The young Earth\'s magma ocean releases one ocean ($1.37\\times10^{21}$ kg) as vapour. What surface pressure does that give, and how does it compare with the critical pressure of water (220.6 bar)?',
      steps: [{ text: 'Weight over the surface:', tex: 'p = \\frac{1.37\\times10^{21} \\times 9.81}{4\\pi(6.371\\times10^6)^2} = 2.63\\times10^{7}\\ \\mathrm{Pa} = 263\\ \\mathrm{bar}' }, 'That is above 220.6 bar: the atmosphere\'s base cannot form a liquid until the temperature falls below the critical 647 K (374 °C).'],
      a: '263 bar, 1.2 times the critical pressure. The ocean could only appear after the surface had cooled to 374 °C, and then rain would pour for a very long time as the vapour condensed.' },
    { title: 'Three oceans in the bulk', q: 'What bulk water content by mass gives three oceans for an Earth-mass planet?',
      steps: [{ text: 'Invert the formula:', tex: 'w = \\frac{N\\,M_o}{M_\\oplus} = \\frac{3 \\times 1.37\\times10^{21}}{5.97\\times10^{24}} = 6.9\\times10^{-4}' }, 'That is 690 parts per million, 0.069 %.'],
      a: 'Only 0.07 per cent water by mass — less than a hundredth of the water content of the wettest carbonaceous meteorites, and a small fraction of the hydrogen found in the enstatite chondrites. Three oceans fit easily in a dry-looking rock.' }
  ],
  quiz: [
    { q: 'Why are enstatite chondrites important for the origin of Earth\'s water?', choices: ['They contain liquid water', 'They are isotopically closest to Earth\'s building blocks and yet hold enough hydrogen for at least three oceans', 'They come from comets', 'They fell on the Moon'], a: 1, why: 'Because they match Earth\'s rock in several isotope systems, what they hold is a guide to what Earth was made of. Piani\'s team found at least three oceans\' worth of hydrogen in them.' },
    { q: 'A steam atmosphere containing a whole ocean would exert a pressure of about', choices: ['1 bar', '10 bar', '260 bar', '10,000 bar'], a: 2, why: '$p = M g/(4\\pi R^2) = 2.6\\times10^7$ Pa, 263 bar — above the critical pressure, so no liquid surface until the air cools below 374 °C.' },
    { q: 'If Earth was built wet, comets and asteroids can have contributed nothing to the oceans.', a: false, why: 'Built-in water removes the need for late delivery but does not forbid it. Isotopes limit the share of D-rich comets; carbonaceous material may have added some.' },
    { q: 'What bulk water content, in parts per million, makes three oceans in an Earth-mass planet?', answer: 688, why: '$3 \\times 1.37\\times10^{21}/5.972\\times10^{24} = 6.88\\times10^{-4}$, or 688 ppm.' },
    { q: 'Which result would most undermine the "built-in" hypothesis?', choices: ['Finding hydrogen in more enstatite chondrites', 'Showing that Earth\'s isotopes differ from enstatite chondrites in the systems that matter most for hydrogen', 'Finding water in the mantle', 'Finding comets with Earth-like D/H'], a: 1, why: 'The argument rests on Earth and enstatite chondrites being isotopic twins. A decisive mismatch, or evidence that their hydrogen is contamination, would weaken it.' }
  ],
  applications: ['Redrawing models of planet formation so that rocky planets inside the snow line can be wet from the start.', 'Changing how we judge exoplanets: a planet near its star may still hold oceans\' worth of water bound in its rock.', 'Guiding studies of deep-Earth water, which is stored in minerals such as ringwoodite ([[the-mantles-hidden-oceans]]).', 'Teaching how a measured result (hydrogen in a meteorite) is turned into a claim about a planet\'s birth.'],
  history: 'The idea that Earth formed dry and was later watered by comets dominated into the 2000s. The question of nominally dry meteorites came to a head in 2020 when Piani and colleagues published their measurements in *Science* on 28 August, with a press release from the CNRS under the headline that Earth may always have been wet.',
  sources: ['CNRS, "Earth may always have been wet" (28 August 2020); Piani and colleagues, *Science* 369 (2020).', 'Alexander and colleagues, *Science* 337 (2012) — the competing case for water from carbonaceous asteroids.', 'IAPWS formulation for the critical point of water, for the 647 K and 22.06 MPa used here.'],
  sim: { id: 'cos-water-mix', params: { preset: 'enstatite' } }
},

/* ================================================================ 8 */
{
  id: 'the-moon-and-mars', parent: 'older-than-the-sun', title: 'Water on the Moon and Mars', level: 2,
  short: 'The Moon keeps ice where the Sun never shines; Mars once had rivers and perhaps an ocean and lost most of it to space. The deuterium left behind, five or six times Earth\'s, is the evidence.',
  keywords: ['lunar ice', 'LCROSS', 'Cabeus', 'permanently shadowed craters', 'M3', 'Chandrayaan-1', 'SOFIA', 'Mars ocean', 'Deuteronilus', 'D/H Mars', 'MAVEN', 'Curiosity', 'Gale crater', 'recurring slope lineae', 'polar ice'],
  prereq: ['the-snow-line', 'the-deuterium-clock'],
  related: ['venus-lost-its-ocean', 'ice-beyond-earth', 'the-search-follows-the-water', 'comets-asteroids-and-earths-water', 'what-life-needs'],
  body: `
Two small worlds next door to Earth show what happens to water when a planet cannot hold on to it. The Moon never had much; Mars had more, and lost it.

### The Moon: ice in the dark
Apollo's samples looked bone dry, and for forty years the Moon was thought to be. Then came evidence of the opposite. In 2008, Alberto Saal's group found tens of parts per million of water in glass beads of volcanic origin; apatite in lunar rocks had a D/H like Earth's, so the Moon's water seems to share Earth's source. India's Chandrayaan-1 carried NASA's Moon Mineralogy Mapper, which in 2009 detected the absorption of hydroxyl or water across the surface, mostly hydrogen implanted by the solar wind and changing through the lunar day. In 2020 the airborne SOFIA telescope detected genuine molecular water, 100 to 400 parts per million, in sunlit soil near Clavius crater.

The ice is at the poles. The Moon's axis is nearly upright, so the floors of deep polar craters never see the Sun. They sit at 25–40 K, as cold as the surface of Pluto or colder. In October 2009 NASA's LCROSS probe crashed a spent rocket stage into Cabeus crater near the south pole and flew through the plume: about 5 per cent of the soil it threw up was water ice. The total is estimated at a cubic kilometre, a few hundred million tonnes or more.

### Why the ice survives
Ice in a vacuum sublimates at a rate set by its vapour pressure. The thickness lost is $z = (p/\\rho)\\sqrt{m/2\\pi k_BT}\\,t$ — and p rises steeply with temperature:

| Temperature | Vapour pressure over ice | Ice lost in a billion years |
|---|---|---|
| 90 K | $1.4\\times10^{-17}$ Pa | 1 µm |
| 100 K | $1.1\\times10^{-14}$ Pa | 0.7 mm |
| 110 K | $2.6\\times10^{-12}$ Pa | 16 cm |
| 120 K | $2.5\\times10^{-10}$ Pa | 14 m |
| 150 K | $6.1\\times10^{-6}$ Pa | 300 km |

Below 100 K ice is safe for the age of the Solar System; at 150 K a metre goes in a few thousand years. The dark craters are cold traps.

### Mars: a lost ocean
Mars today has a surface pressure of about 600 Pa, almost exactly water's triple-point pressure (611.657 Pa): there, ice sublimates and any liquid boils or freezes in minutes. Its ice caps and ground ice hold some 5 million km³, a layer 35 metres deep if spread over the globe. But rivers cut the valley networks, deltas fill craters such as Jezero, minerals made in water cover the plains, and Curiosity found in Gale crater in 2013 the mudstones of an ancient lake, of low salinity and near-neutral acidity — a habitable water. Shorelines traced round the northern plains have been read as an ocean 3.5–4 billion years ago; the interpretation is contested.

Where did it go? Mars's gravity is 38 per cent of Earth's, and it lost its magnetic field early. The solar wind and ultraviolet light split water and strip the hydrogen, as NASA's MAVEN orbiter measures today. The light hydrogen escapes more easily than deuterium, so the D/H of what remains rises: **5 to 6 times Earth's** in the atmosphere (the Curiosity and ground-based values), and about 7 times in the polar ice in a 2015 study that inferred an early ocean of at least 130 m averaged over the whole planet. The enrichment is the signature of a loss ([[venus-lost-its-ocean]] explains the mechanism).

### Water today
Streaks that darken and grow on warm slopes, the **recurring slope lineae**, first looked like seeping brine; later work found them to be dry grain flows. A bright radar patch under the south polar cap, read in 2018 as a lake, is contested. The consensus: ice abundant, liquid at most transient and salty.

> [!key] Ice on the Moon survives in craters colder than 100 K; Mars lost most of its early water to space, leaving a deuterium-rich remainder five to six times Earth's. Both worlds show that holding water depends on temperature, gravity and a magnetic shield as much as on distance from the Sun.`,
  ideas: ['The Moon\'s polar craters never see sunlight, sit at 25–40 K and keep water ice: LCROSS found about 5 % ice in the plume from Cabeus in 2009.', 'Ice in vacuum is safe below about 100 K: the loss by sublimation is under a millimetre per billion years there and rises steeply with temperature.', 'Mars has about 5 million km³ of ice (35 m over the globe) and shows rivers, deltas, lakebeds and perhaps an ocean from 3.5–4 billion years ago.', 'Its atmosphere\'s D/H is 5–6 times Earth\'s because light hydrogen escaped to space more readily than deuterium.'],
  pitfalls: ['"The Moon is a dry rock with water from comets only" — Its rocks hold tens of ppm of Earth-like water, and the polar ice is a separate, smaller deposit; the solar wind adds hydroxyl on the surface.', '"Streaks on Mars prove running water today" — The recurring slope lineae were first read as brine flows, but later studies favour dry grains moving; the question is not closed.', '"Mars lost its water because it is far from the Sun" — It is within the conservative habitable zone\'s outer edge. Mars is small and lost its magnetic field, so its atmosphere was stripped away.'],
  terms: [
    { term: 'Permanently shadowed region', also: ['PSR', 'cold trap'], def: 'The floor of a deep polar crater that never receives direct sunlight, kept at 25–40 K for billions of years. Water molecules that wander in cannot leave, so ice builds up.' },
    { term: 'Regolith', also: ['lunar soil', 'planetary soil'], def: 'The loose layer of broken rock and dust covering the surface of the Moon, Mars and other airless or thin-aired bodies, made by impacts and weathering.' },
    { term: 'Global equivalent layer', also: ['GEL', 'global equivalent depth'], def: 'The depth of water that would cover a planet evenly if all its water of a kind were spread over its surface. Mars\'s ice would make about 35 m; Earth\'s oceans, 2.7 km.' },
    { term: 'Recurring slope lineae', also: ['RSL'], def: 'Dark streaks, a few metres wide, that appear on warm Martian slopes, lengthen in the warm season and fade. Once read as seeps of salty water; later work points to dry flows of grains.' }
  ],
  formulas: [
    { name: 'Ice lost by sublimation into vacuum', expr: 'z = (p/rho)*sqrt(m/(2*pi*kB*T))*t', tex: 'z = \\frac{p}{\\rho}\\sqrt{\\frac{m}{2\\pi k_B T}}\\;t',
      vars: { z: { name: 'thickness of ice lost', q: 'length', unit: 'm' }, p: { name: 'vapour pressure over ice at T', q: 'pressure', unit: 'Pa', value: 1.09e-14, hint: 'Look up at the temperature: 1.1e-14 Pa at 100 K, 2.5e-10 Pa at 120 K, 6.1e-6 Pa at 150 K.' }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 917 }, m: { name: 'mass of an H₂O molecule', q: 'mass', unit: 'u', value: 18.015, fixed: true }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: 'K', value: 100, min: 60, max: 200 }, t: { name: 'time', q: 'time', unit: 'Gyr', value: 1 } },
      solveFor: 'z', note: 'The Hertz–Knudsen law for evaporation into a vacuum, with every molecule that leaves lost (none redeposited). The input pressure must be the vapour pressure at the same temperature.',
      stories: { z: 'Ice at {T}, whose vapour pressure is {p}, sits in a vacuum for {t}. How much of its thickness evaporates?', t: 'A layer of ice at {T} (vapour pressure {p}) loses {z}. How long does it take?' } },
    { name: 'Global equivalent layer of an ice deposit', expr: 'h = V/A', tex: 'h = \\frac{V}{A}',
      vars: { h: { name: 'global equivalent layer', q: 'length', unit: 'm' }, V: { name: 'volume of the ice', q: 'volume', unit: 'm³', value: 5e15, hint: '5 million km³ = 5 × 10¹⁵ m³.' }, A: { name: 'surface area of the planet', q: 'area', unit: 'km²', value: 1.448e8, hint: 'Mars: 1.448 × 10⁸ km².' } },
      solveFor: 'h', note: 'The depth of a uniform layer. Mars: 35 m; the early ocean would have been several times that.',
      stories: { h: 'A planet of area {A} holds {V} of ice. What depth does it make over the whole surface?' } },
    { name: 'Deuterium enrichment by escape (Rayleigh)', expr: 'E = x^(f - 1)', tex: 'E = x^{\\,f-1}',
      vars: { E: { name: 'D/H now ÷ D/H at the start' }, x: { name: 'fraction of hydrogen left', q: 'ratio', unit: '%', value: 10, min: 0.01, max: 100 }, f: { name: 'fractionation factor', value: 0.3, min: 0, max: 0.99, hint: 'How easily D escapes compared with H: 0 means never, 1 means equally. Models for Mars and Venus use 0.1–0.4.' } },
      solveFor: 'E', note: 'If deuterium escapes at a fraction $f$ the rate of hydrogen, the remainder is enriched as the reservoir shrinks. $f = 1$ gives no enrichment.',
      stories: { E: 'A planet loses all but {x} of its hydrogen, deuterium escaping at {f} of hydrogen\'s relative rate. By what factor is D/H enriched?', x: 'Mars\'s D/H is {E} times its starting value, with fractionation factor {f}. What fraction of the hydrogen remains?' } }
  ],
  examples: [
    { title: 'How long can ice last?', q: 'Ice in a crater floor at 100 K sits in vacuum. Using a vapour pressure of $1.09\\times10^{-14}$ Pa, how much is lost in a billion years? And at 120 K ($2.5\\times10^{-10}$ Pa)?',
      steps: [{ text: 'The rate is $(p/\\rho)\\sqrt{m/2\\pi k_BT}$ with $m = 2.99\\times10^{-26}$ kg:', tex: 'z(100\\ \\mathrm{K}) = \\frac{1.09\\times10^{-14}}{917}\\sqrt{\\frac{2.99\\times10^{-26}}{2\\pi\\times1.38\\times10^{-23}\\times100}} \\times 3.16\\times10^{16}\\ \\mathrm{s} = 6.9\\times10^{-4}\\ \\mathrm{m}' }, 'At 120 K the pressure is 23,000 times higher and the loss is 14 m per billion years.'],
      a: '0.7 mm at 100 K — negligible over the age of the Solar System — and 14 m at 120 K. That factor of twenty thousand in 20 K is why the craters at 40 K keep their ice and the sunlit poles do not.' },
    { title: 'How much hydrogen did Mars lose?', q: 'Mars\'s atmosphere has a D/H 5.5 times its starting value. If deuterium escapes at a fraction $f = 0.3$ of hydrogen\'s rate, what fraction of the hydrogen reservoir is left?',
      steps: [{ text: 'Invert $E = x^{f-1}$:', tex: 'x = E^{1/(f-1)} = 5.5^{1/(-0.7)} = e^{-1.705/0.7} = 0.088' }, 'With $f = 0.1$ it would be 0.15 and with $f = 0.5$ it would be 0.033.'],
      a: 'About 9 per cent of that reservoir remains — of the water able to exchange with the atmosphere. The choice of $f$ matters (3 to 15 per cent), and the interior had a lower D/H, so the real depth of the early ocean is debated.' }
  ],
  quiz: [
    { q: 'What did NASA\'s LCROSS mission find in the plume from Cabeus crater?', choices: ['No water', 'About 5 % water ice in the soil thrown up', 'Liquid water', 'Water vapour only'], a: 1, why: 'The spent rocket stage hit the crater floor on 9 October 2009, and the instruments of the following spacecraft measured water ice, about 5 % of the material.' },
    { q: 'At what temperature does the loss of ice in vacuum become significant over a billion years?', choices: ['10 K', '40 K', 'around 100 K', 'around 200 K'], a: 2, why: 'The loss is 0.7 mm per billion years at 100 K and 14 m at 120 K. At 40 K, nothing is lost; at 150 K, hundreds of kilometres would go.' },
    { q: 'The atmosphere of Mars has a lower D/H than Earth\'s oceans.', a: false, why: 'It is 5–6 times higher: light hydrogen escaped to space more readily than deuterium, leaving the remainder enriched.' },
    { q: 'If Mars\'s ice, 5 million km³, were spread over its surface (1.448 × 10⁸ km²), how deep would the layer be, in metres?', answer: 34.5, unit: 'm', why: '$5\\times10^{6}/1.448\\times10^{8} = 0.0345$ km, 34.5 m.' },
    { q: 'The surface pressure of Mars (about 600 Pa) is nearly equal to', choices: ['the critical pressure of water', 'the triple-point pressure of water (611.657 Pa)', '1 atmosphere', 'the vapour pressure of water at 100 °C'], a: 1, why: 'The coincidence puts ice, liquid and vapour on the edge of stability everywhere on Mars: water is stable as a liquid only for short times in the lowest, warmest places, and mostly in salty form.' }
  ],
  applications: ['Planning lunar bases and landing sites: polar ice as a source of drinking water, oxygen and rocket fuel, the aim of NASA\'s Artemis programme and of the Chandrayaan and Chinese Chang\'e missions.', 'Choosing where Mars rovers go: lakebeds and delta deposits in Gale and Jezero craters, where the water left minerals.', 'Calibrating models of climate loss on rocky planets, including the estimate of how much water a small planet loses.', 'Deciding where to look for traces of ancient microbes: the clays of Mars and the ice of the Moon.'],
  history: 'The Mariner and Viking probes of 1965–76 showed dry channels on Mars; the 1989 proposal of ancient northern shorelines, by Parker and colleagues, started the ocean debate. Mars Global Surveyor, Opportunity and Spirit (2004), Phoenix (2008, which dug up ice) and Curiosity (2012) added the evidence. The Moon\'s volatile deposits were suggested in 1961 by Watson, Murray and Brown.',
  sources: ['Colaprete and colleagues, "Detection of water in the LCROSS ejecta plume", *Science* 330 (2010).', 'Villanueva and colleagues, "Strong water isotopic anomalies in the martian atmosphere", *Science* 348 (2015).', 'Mahaffy and colleagues, *Science* 347 (2015) — Curiosity and the D/H of Hesperian clays.', 'Saal and colleagues, *Science* 340 (2013) — Earth-like D/H in lunar samples.', 'Grotzinger and colleagues, *Science* 343 (2014) — the habitable lake of Yellowknife Bay.'],
  sim: { id: 'cos-hydrogen-escape', params: { planet: 'mars' } }
},

/* ================================================================ 9 */
{
  id: 'venus-lost-its-ocean', parent: 'older-than-the-sun', title: 'Venus lost its ocean', level: 2,
  short: 'Venus has almost no water and an atmosphere a hundred times richer in deuterium than Earth\'s oceans. Hydrogen escaped to space in a runaway greenhouse, leaving the heavy isotope behind, and the ratio is the evidence that Venus once had a great deal more.',
  keywords: ['Venus', 'runaway greenhouse', 'moist greenhouse', 'Pioneer Venus', 'Donahue', 'D/H Venus', 'hydrogen escape', 'Jeans escape', 'hydrodynamic escape', 'photodissociation', 'Venus Express', 'ocean loss'],
  prereq: ['the-deuterium-clock', 'the-snow-line', 'physics:planets'],
  related: ['the-habitable-zone', 'the-moon-and-mars', 'water-vapour-greenhouse', 'water-made-the-air', 'comets-asteroids-and-earths-water'],
  body: `
Venus is Earth's twin in size: 95 per cent of its radius, 82 per cent of its mass, and it formed from the same material. Its surface is at $464\\ ^\\circ$C, under 92 bar of carbon dioxide. Its air holds about 30 parts per million of water vapour, which is 4 millionths of one of Earth's oceans, a puddle a centimetre deep if it were all condensed. Yet in December 1978 the mass spectrometer of NASA's Pioneer Venus probe found that the little hydrogen present was heavily loaded with deuterium: a D/H of about $1.6\\times10^{-2}$, roughly **a hundred times** Earth's.

### What the ratio says
Donahue and colleagues, in 1982, took it as a record of loss. Light hydrogen escapes from a planet more easily than heavy, so as the planet loses its water, the remaining hydrogen grows richer in deuterium. A simple model gives

$$\\frac{(D/H)_{\\mathrm{now}}}{(D/H)_{\\mathrm{start}}} = x^{\\,f-1}$$

where $x$ is the fraction of the hydrogen left and $f$ the fraction of hydrogen's rate at which deuterium escapes. For a factor of 100–150 and $f$ between 0.1 and 0.3, $x$ is a fraction of a per cent: Venus has kept something like 0.1 to 0.5 per cent of the hydrogen it once had. Starting from today's centimetre, that suggests an early layer of metres to tens of metres; the first interpreters said at least a few tenths of a per cent of Earth's ocean. How much more is a matter for climate models, not the ratio.

### How a planet loses an ocean
The sunlight at Venus is 1.9 times Earth's. When water evaporates, its vapour traps heat and more evaporates; there is a limit to how much infrared a wet atmosphere can radiate, near 280 W/m². A planet that absorbs more than this cannot cool by radiation, and the oceans boil away. This is the **runaway greenhouse**. A weaker version, the **moist greenhouse**, wets the stratosphere. There, ultraviolet light splits water into hydrogen and oxygen, and the hydrogen drifts to the top of the atmosphere and escapes.

At the top, the **exobase**, the escape of atoms is governed by the Jeans parameter

$$\\lambda = \\frac{G M m}{k_B T r}$$

— the energy needed to leave the planet, divided by the thermal energy. For hydrogen at Venus's exobase and 300 K, $\\lambda = 21$ and the escape flux is practically nil; for deuterium $\\lambda = 42$. When the early upper atmosphere was heated to thousands of kelvin by the young Sun's ultraviolet, $\\lambda$ fell to 1–2 and hydrogen poured away. In a violent outflow the heavier isotope is dragged along, but with the modest flows later on D lags; non-thermal processes (charge exchange, ion pickup by the solar wind) continue to lose both, as Europe's Venus Express measured, with hydrogen and oxygen leaving in a ratio of two to one, as for water.

### A wet Venus?
Whether Venus ever held a liquid ocean is argued. One class of models says Venus began so hot, with a magma ocean, that its water was never liquid on the surface; another, using three-dimensional climate models of a slowly rotating Venus with a cloud cover on the sunward side, lets it keep oceans for two billion years. A faint young Sun (70 per cent as bright as now) helps the second. Venus today absorbs less sunlight than Earth, about 150 W/m² against 240, because its clouds reflect three-quarters of it; the heat is in the greenhouse effect, not in the supply.

> [!key] Venus's D/H, about a hundred times Earth's, shows that most of its hydrogen escaped to space after the water was split high in the atmosphere. Light hydrogen leaves faster than heavy, so the deuterium remains: a lasting record of a lost ocean whose size and age are still disputed.`,
  ideas: ['Pioneer Venus measured a D/H of about $1.6\\times10^{-2}$ in 1978, about a hundred times the ocean value.', 'Light hydrogen escapes faster than deuterium, so the remaining hydrogen grows heavier as a reservoir shrinks: $E = x^{f-1}$.', 'A runaway or moist greenhouse puts water in the upper atmosphere, where ultraviolet light splits it and hydrogen escapes.', 'The Jeans parameter $\\lambda = GMm/(k_B T r)$ tells whether thermal escape is feasible: hydrogen leaves when $\\lambda$ is a few, not at 20.'],
  pitfalls: ['"Venus is hot because it is close to the Sun" — Its clouds reflect so much light that Venus absorbs less than Earth; it is hot because of a massive CO₂ greenhouse, to which the loss of the ocean contributed (water is no longer there to lock carbon in rock).', '"The D/H proves that Venus had an ocean" — It proves that a great deal of hydrogen was lost; the amount depends on the model, and the ratio alone allows a modest amount of surface water.', '"Heavier atoms never escape" — They do, more slowly; in a violent outflow they are swept along with the hydrogen, which is why the ratio depends on how hard the loss was.'],
  terms: [
    { term: 'Runaway greenhouse', also: ['runaway greenhouse effect'], def: 'A feedback in which warming evaporates more water, the vapour traps more heat, and the process continues until the oceans have boiled away. It occurs when absorbed sunlight exceeds the maximum a wet atmosphere can radiate, near 280 W/m².' },
    { term: 'Moist greenhouse', also: ['wet stratosphere', 'moist greenhouse limit'], def: 'A state in which a warm surface fills the stratosphere with water vapour, which ultraviolet light splits so that hydrogen escapes. It is the inner edge of the habitable zone for slow losses of water.' },
    { term: 'Jeans escape', also: ['thermal escape', 'Jeans parameter'], def: 'The loss of atoms from the fast tail of the thermal distribution at the top of an atmosphere. Its strength depends on $\\lambda = GMm/(k_BTr)$ through the factor $(1+\\lambda)e^{-\\lambda}$.' },
    { term: 'Exobase', also: ['exosphere base', 'escape level'], def: 'The height above which collisions between atoms are so rare that an atom with enough speed can leave the planet. For Venus it is some 200 km above the surface.' },
    { term: 'Rayleigh fractionation', also: ['Rayleigh distillation'], def: 'The enrichment of the heavy isotope in what remains as a reservoir is drained of the light one, with the ratio rising as $x^{f-1}$ when a fraction $x$ is left.' }
  ],
  formulas: [
    { name: 'The Jeans escape parameter', expr: 'lam = G*M*m/(kB*T*r)', tex: '\\lambda = \\frac{G\\,M\\,m}{k_B\\,T\\,r}',
      vars: { lam: { name: 'Jeans parameter', tex: '\\lambda' }, G: { const: 'G' }, M: { name: 'mass of the planet', q: 'mass', unit: 'kg', value: 4.867e24, hint: 'Venus: 4.87 × 10²⁴ kg; Earth 5.97 × 10²⁴ kg; Mars 6.42 × 10²³ kg.' }, m: { name: 'mass of the atom', q: 'mass', unit: 'u', value: 1.008, hint: '1.008 u for H and 2.014 u for D.' }, kB: { const: 'kB' }, T: { name: 'temperature of the exobase', q: 'temperature', unit: 'K', value: 300, min: 50, max: 20000 }, r: { name: 'distance from the centre (exobase)', q: 'length', unit: 'km', value: 6302, hint: 'Venus: 6,052 km radius plus about 250 km.' } },
      solveFor: 'lam', note: 'The ratio of gravitational binding energy to thermal energy. Escape is efficient for $\\lambda$ of 1–3, negligible above 15–20.',
      stories: { lam: 'An atom of mass {m} sits at {r} from the centre of a planet of mass {M} where the temperature is {T}. What is the Jeans parameter?', T: 'The Jeans parameter of hydrogen at {r} from a planet of mass {M} is {lam}. What temperature is that?' } },
    { name: 'Jeans escape flux', expr: 'F = n*sqrt(2*kB*T/m)*(1 + lam)*exp(-lam)/(2*sqrt(pi))', tex: 'F = \\frac{n\\,v_0}{2\\sqrt{\\pi}}(1+\\lambda)\\,e^{-\\lambda},\\quad v_0 = \\sqrt{\\frac{2k_BT}{m}}',
      vars: { F: { name: 'escape flux', unit: 'm⁻² s⁻¹' }, n: { name: 'number density at the exobase', q: 'numberdensity', unit: '1/cm³', value: 1e5 }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: 'K', value: 1000, min: 100, max: 20000 }, m: { name: 'mass of the atom', q: 'mass', unit: 'u', value: 1.008 }, lam: { name: 'Jeans parameter', min: 0, max: 60, value: 5, tex: '\\lambda' } },
      solveFor: 'F', note: 'The flux of atoms of one kind through the exobase, with $\\lambda$ from the formula above. The factor $(1+\\lambda)e^{-\\lambda}$ makes the flux fall by a factor of 1,000 from $\\lambda = 3$ to $\\lambda = 10$.',
      stories: { F: 'At the exobase of a planet there are {n} atoms of mass {m} at {T}, with Jeans parameter {lam}. What is the escape flux?' } },
    { name: 'Fraction of hydrogen left', expr: 'x = E^(1/(f - 1))', tex: 'x = E^{\\,1/(f-1)}',
      vars: { x: { name: 'fraction of hydrogen left', q: 'ratio', unit: '%' }, E: { name: 'D/H now ÷ D/H at the start', value: 120, min: 1 }, f: { name: 'fractionation factor', value: 0.2, min: 0, max: 0.99 } },
      solveFor: 'x', note: 'Venus: $E \\approx 100$–$150$; for $f = 0.1$ to $0.3$, $x$ lies between 0.1 and 0.5 per cent.',
      stories: { x: 'A planet\'s hydrogen is {E} times as deuterium-rich as at the start, the heavy isotope escaping at {f} of the light one\'s rate. What fraction of the hydrogen is left?' } }
  ],
  examples: [
    { title: 'Hydrogen and deuterium at the exobase', q: 'Compute the Jeans parameter for H and D at Venus (M = $4.87\\times10^{24}$ kg, r = 6,302 km) for exobase temperatures of 300 K and 5,000 K.',
      steps: [{ text: 'The gravitational energy per unit mass is $GM/r = 5.15\\times10^{7}$ J/kg. For hydrogen:', tex: '\\lambda_H = \\frac{5.15\\times10^{7} \\times 1.674\\times10^{-27}}{1.381\\times10^{-23}\\,T} = \\frac{6240\\ \\mathrm{K}}{T}' }, 'So $\\lambda_H = 20.8$ at 300 K and 1.25 at 5,000 K; deuterium has twice the mass and twice the value: 41.6 and 2.5.', 'The factor $(1+\\lambda)e^{-\\lambda}$: for H at 5,000 K it is 0.65, for D 0.29; at 300 K it is $10^{-8}$ for H and $10^{-17}$ for D.'],
      a: 'At 300 K nothing thermal escapes, and deuterium is a billion times less able than hydrogen; at 5,000 K both leave, deuterium at nearly a third of hydrogen\'s relative rate. Between the two, the early heating decided how much was lost.' },
    { title: 'How much water did Venus have?', q: 'Venus\'s air holds water equal to a global layer 1.3 cm deep. If its D/H is 120 times the starting value, with $f = 0.2$, how deep was the original layer, and how does it compare with Earth\'s 2.7 km?',
      steps: [{ text: 'Fraction left: $x = 120^{1/(0.2-1)} = 120^{-1.25} = 0.0025$.', tex: 'x = 120^{-1.25} = 2.5\\times10^{-3}' }, 'Original layer $= 1.3\\ \\mathrm{cm}/0.0025 = 5.2$ m.', 'Compared with Earth: $5.2\\ \\mathrm{m}/2{,}700\\ \\mathrm{m} = 0.19$ per cent.'],
      a: 'About 5 m of water, 0.2 per cent of an Earth ocean — consistent with the first interpreters\' lower limit of a few tenths of a per cent. A full ocean would need a smaller $f$ or loss of water from the interior; the ratio fixes only a lower bound.' }
  ],
  quiz: [
    { q: 'Venus\'s atmosphere has a D/H about', choices: ['the same as Earth\'s', 'ten times Earth\'s', 'a hundred times Earth\'s', 'a hundredth of Earth\'s'], a: 2, why: 'Pioneer Venus measured about $1.6\\times10^{-2}$ in 1978, a hundred times the oceans\' $1.56\\times10^{-4}$; later measurements aloft give higher values.' },
    { q: 'The heavy isotope is enriched in Venus\'s atmosphere because deuterium escapes to space more readily than hydrogen.', a: false, why: 'The reverse: the light isotope escapes more easily, so the heavy one stays and accumulates as the reservoir shrinks.' },
    { q: 'What does a Jeans parameter of 40 mean for an atom at the exobase?', choices: ['Easy thermal escape', 'The gravitational binding energy is about 40 times the thermal energy; thermal escape is negligible', 'The atom is ionised', 'The planet has no atmosphere'], a: 1, why: '$\\lambda = E_{bind}/k_BT$. With $(1+\\lambda)e^{-\\lambda}$ near $10^{-16}$, nothing escapes by the thermal route; other mechanisms must do the work.' },
    { q: 'If the D/H of a planet has risen by a factor of 50 and the fractionation factor is 0.1, what percentage of the hydrogen remains?', answer: 1.3, why: '$x = 50^{1/(0.1-1)} = 50^{-1.111} = 0.0129$, about 1.3 per cent.' },
    { q: 'Why does Venus, which is closer to the Sun, absorb less sunlight than Earth?', choices: ['It is further away', 'Its clouds reflect about three-quarters of the light', 'It spins backwards', 'The Sun is dimmer there'], a: 1, why: 'The solar constant at Venus is 1.9 times Earth\'s, but with an albedo near 0.77 Venus absorbs about 150 W/m² against 240 for Earth. Its heat comes from the greenhouse effect.' }
  ],
  applications: ['Estimating how much water a hot planet once held, from the deuterium left behind.', 'Defining the inner edge of the habitable zone: the moist-greenhouse limit sets how close a planet can orbit and keep its ocean ([[the-habitable-zone]]).', 'Testing climate models, which must reproduce a hot Venus and a temperate Earth from the same laws.', 'Planning exploration: NASA\'s DAVINCI and ESA\'s EnVision missions of the 2030s will measure noble gases and isotopes in the Venusian atmosphere.'],
  history: 'The measurement was made by the mass spectrometer on the Pioneer Venus Large Probe in December 1978 and interpreted by Thomas Donahue, Jack Hoffman, Richard Hodges and Arthur Watson in *Science* in 1982 ("Venus was wet"). Venus Express (ESA, 2006–2014) measured the escape of hydrogen and oxygen ions and higher D/H values aloft. Whether Venus once held liquid water is debated by climate modellers; Hamano and colleagues (2013) and Way and colleagues (2016) argue opposite cases.',
  sources: ['Donahue, Hoffman, Hodges and Watson, "Venus was wet: a measurement of the ratio of deuterium to hydrogen", *Science* 216 (1982).', 'Kopparapu and colleagues, *The Astrophysical Journal* 765 (2013) — the moist and runaway greenhouse limits.', 'Barabash and colleagues, *Nature* 450 (2007) — the Venus Express measurement of hydrogen and oxygen escaping from Venus.', 'Way and colleagues, *Geophysical Research Letters* 43 (2016); Hamano, Abe and Genda, *Nature* 497 (2013) — the opposing views on an early ocean.'],
  sim: { id: 'cos-hydrogen-escape', params: { planet: 'venus' } }
},

/* ================================================================ 10 */
{
  id: 'the-habitable-zone', parent: 'older-than-the-sun', title: 'The habitable zone', level: 2,
  short: 'The habitable zone is the band of orbits where a planet with an Earth-like atmosphere could keep liquid water on its surface: 0.95 to 1.67 AU for the Sun, a thin band close to a faint red dwarf, a wide one far from a hot star, and one that drifts outward as a star ages.',
  keywords: ['habitable zone', 'Goldilocks zone', 'Kopparapu', 'Kasting', 'faint young Sun', 'M dwarf', 'Proxima b', 'TRAPPIST-1', 'tidal locking', 'liquid water', 'exoplanet', 'CO2 greenhouse', 'maximum greenhouse'],
  prereq: ['the-snow-line', 'venus-lost-its-ocean', 'physics:planets'],
  related: ['water-worlds-around-other-stars', 'what-life-needs', 'the-search-follows-the-water', 'the-moon-and-mars', 'water-vapour-greenhouse', 'physics:specific-heat'],
  body: `
Liquid water needs a pressure above 611 Pa and a temperature between 0 and 100 °C (at sea-level pressure). For a planet, that comes down to one thing the planet cannot choose: how much starlight it receives. The **habitable zone** is the range of distances at which that is right.

### The two edges
Close to a star, the oceans evaporate, the water vapour traps heat, and the planet runs away to a Venus ([[venus-lost-its-ocean]]). Far from the star, the planet freezes. Carbon dioxide, which volcanoes keep supplying and weathering removes more slowly as the planet cools, can warm a cold world — up to a limit, when the gas itself condenses and scatters light back to space. Kasting, Whitmire and Reynolds (1993) and Kopparapu and colleagues (2013) built climate models of these limits for a planet with air of water, $\\ce{CO2}$ and nitrogen. For the Sun the conservative edges are near **0.95 AU** (inner, where a moist greenhouse begins) and **1.67 AU** (outer, the maximum greenhouse); the figures differ by a few hundredths of an AU between papers.

Because starlight spreads as $1/d^2$, the same flux sits at a distance that grows as $\\sqrt{L}$:

$$d = d_\\odot\\sqrt{L/L_\\odot}$$

A star a hundredth as luminous as the Sun has a zone at a tenth of the distance: 0.095–0.167 AU, closer than Mercury. A star 20 times as luminous has a zone from 4.2 to 7.5 AU.

### Earth, Venus and Mars
Venus (0.72 AU) lies inside the inner edge and Earth (1 AU) is well in; Mars (1.52 AU) is in the zone too, yet it is cold and dry, because it is small and lost its atmosphere. The zone says where starlight is right, not whether a planet kept its air. Earth's equilibrium temperature without an atmosphere would be 255 K ($-18\\ ^\\circ$C); the greenhouse effect of water vapour and carbon dioxide warms it by 33 K to the observed 288 K.

### The zone moves
A star brightens as it ages. The Sun was about 70 per cent as luminous at its birth (Gough's formula $L = L_0/[1 + 0.4(1 - t/t_0)]$) and gains about 1 per cent every hundred million years. Four billion years ago the zone ran from 0.82 to 1.44 AU; the Earth, at 1 AU, sat comfortably inside it, yet should have been frozen — the **faint young Sun** puzzle, which Sagan and Mullen posed in 1972 and which a strong greenhouse of carbon dioxide and methane is the usual answer to. In about a billion years the inner edge will pass Earth's orbit and the oceans will begin to go.

### Small, dim stars
Red dwarfs are the commonest stars, so their planets matter. Their zones are close in: Proxima Centauri's lies at 0.039–0.069 AU, and its planet Proxima b orbits at 0.0485 AU in 11.2 days. Close planets are probably **tidally locked**, one face always to the star; they are exposed to flares; and in the first billion years the star was brighter and could have boiled their oceans away before the star settled. TRAPPIST-1 has seven Earth-sized planets, of which e, f and g lie in the zone; JWST observations in 2023 found no thick atmosphere on the two innermost ones, a reminder that being in the zone is a start, not a verdict ([[water-worlds-around-other-stars]]).

> [!key] The habitable zone is the range of orbital distances, scaling as the square root of the star's luminosity, at which starlight could keep an ocean liquid under a suitable atmosphere: 0.95–1.67 AU for the Sun. It shifts outward with the star's age and is a necessary condition for surface oceans, not a sufficient one.`,
  ideas: ['The habitable zone is the range of distances at which a planet with an Earth-like atmosphere could keep liquid water at the surface: for the Sun about 0.95–1.67 AU.', 'Its edges scale as the square root of the star\'s luminosity, so the zone sits close to dim stars and far from bright ones.', 'It moves outward as a star brightens: the Sun was 70 % as luminous at its birth and adds 1 % every 100 million years.', 'It describes starlight only. Atmosphere, size, magnetic field, tidal locking and flares decide whether a planet in the zone is habitable.'],
  pitfalls: ['"A planet in the habitable zone has liquid water" — It is a necessary condition. Mars lies inside the outer edge and has none at the surface; the zone assumes an atmosphere that the planet may not have.', '"The habitable zone is the only place for liquid water" — Europa and Enceladus keep oceans far outside it, warmed by tides ([[europa]], [[enceladus]]). The zone concerns surface oceans heated by starlight.', '"The zone is fixed for each star" — It moves with the star\'s luminosity, and it depends on the planet\'s atmosphere and, to some degree, on the star\'s colour.'],
  terms: [
    { term: 'Habitable zone', also: ['HZ', 'Goldilocks zone', 'circumstellar habitable zone'], def: 'The range of orbital distances from a star at which an Earth-like planet could have liquid water on its surface, bounded by the runaway or moist greenhouse on the inner side and the maximum CO₂ greenhouse on the outer.' },
    { term: 'Faint young Sun', also: ['faint young Sun paradox'], def: 'The puzzle that the young Sun, 70 % as bright as today, should have left Earth frozen, though geology shows liquid water throughout. The usual resolution is a stronger greenhouse in the early atmosphere.' },
    { term: 'Tidal locking', also: ['synchronous rotation', 'spin–orbit resonance'], def: 'The state in which a planet turns once per orbit, keeping one face to its star. The locking time grows as the sixth power of the distance, so planets in the zones of red dwarfs lock quickly.' },
    { term: 'Luminosity', also: ['L', 'solar luminosity', 'L☉'], def: 'The total power a star radiates. The Sun\'s is $3.83\\times10^{26}$ W, which is 1 L☉; red dwarfs run at 0.0005 to 0.1 L☉, hot stars at tens to thousands.' },
    { term: 'Maximum greenhouse', also: ['outer edge of the habitable zone'], def: 'The point at which adding carbon dioxide stops warming a planet, because it scatters starlight back into space (Rayleigh scattering) and condenses. It sets the outer edge of the zone.' }
  ],
  formulas: [
    { name: 'Edges of the habitable zone', expr: 'd = k*sqrt(L/Lsun)', tex: 'd = k\\sqrt{L/L_\\odot}',
      vars: { d: { name: 'distance from the star', q: 'length', unit: 'AU' }, k: { name: 'edge factor (AU for a Sun-like star)', q: 'length', unit: 'AU', value: 0.95, min: 0.5, max: 2, hint: '0.95 AU for the inner conservative edge and 1.67 AU for the outer, for the Sun.' }, L: { name: 'luminosity of the star', q: 'power', unit: 'L☉', value: 1 }, Lsun: { const: 'Lsun', tex: 'L_\\odot' } },
      solveFor: 'd', note: 'The edges also shift by up to about 10 % with the star\'s colour; this is the Sun-calibrated scaling.',
      stories: { d: 'A star shines with {L}. Where is the edge of its habitable zone for the factor {k}?', L: 'The inner edge is at {d}, with factor {k}. What is the star\'s luminosity?' } },
    { name: 'The Sun\'s brightening', expr: 'L = L0/(1 + 0.4*(1 - t/t0))', tex: 'L = \\frac{L_0}{1 + \\tfrac25\\left(1 - t/t_0\\right)}',
      vars: { L: { name: 'luminosity then', q: 'ratio', unit: '' }, L0: { name: 'luminosity now', q: 'ratio', unit: '', value: 1, fixed: true, tex: 'L_0' }, t: { name: 'age of the Sun', q: 'time', unit: 'Gyr', value: 0.57, min: 0, max: 10 }, t0: { name: 'present age', q: 'time', unit: 'Gyr', value: 4.57, fixed: true, tex: 't_0' } },
      solveFor: 'L', note: 'Gough\'s approximation to the models of the Sun\'s main-sequence evolution, good from the zero-age Sun to the present; the fitted slope is 0.4 per age.',
      stories: { L: 'The Sun is {t} old. What is its luminosity compared with today?', t: 'The Sun has {L} of its present luminosity. What was its age?' } },
    { name: 'Orbital period (Kepler\'s third law)', expr: 'P = 2*pi*sqrt(a^3/(G*M))', tex: 'P = 2\\pi\\sqrt{\\frac{a^3}{G\\,M}}',
      vars: { P: { name: 'orbital period', q: 'time', unit: 'day' }, a: { name: 'orbital distance', q: 'length', unit: 'AU', value: 0.0485 }, G: { const: 'G' }, M: { name: 'mass of the star', q: 'mass', unit: 'M☉', value: 0.122, hint: 'Proxima Centauri: 0.122 M☉.' } },
      solveFor: 'P', note: 'A planet in the zone of a red dwarf has a year of days: Proxima b, 11.2 days.',
      stories: { P: 'A planet orbits a star of {M} at {a}. How long is its year?' } }
  ],
  examples: [
    { title: 'A red dwarf and a hot star', q: 'Find the habitable zone (0.95–1.67 AU for the Sun) of Proxima Centauri (0.0017 L☉) and of a star of 20 L☉. Is Proxima b at 0.0485 AU inside?',
      steps: [{ text: 'Scale by $\\sqrt{L}$:', tex: '0.95\\sqrt{0.0017} = 0.039,\\quad 1.67\\sqrt{0.0017} = 0.069\\ \\mathrm{AU}' }, { text: 'For the hot star:', tex: '0.95\\sqrt{20} = 4.2,\\quad 1.67\\sqrt{20} = 7.5\\ \\mathrm{AU}' }, 'Proxima b at 0.0485 AU lies between 0.039 and 0.069.'],
      a: 'Proxima\'s zone is 0.039–0.069 AU and Proxima b is inside it; the hot star\'s zone lies at 4.2–7.5 AU. The width in AU grows with $\\sqrt{L}$ too, so around a red dwarf the zone is narrow.' },
    { title: 'When does Earth leave the zone?', q: 'The Sun\'s luminosity (in today\'s units) is $L(t) = 1/[1 + 0.4(1 - t/4.57)]$ with $t$ in Gyr. When is the inner edge $0.95\\sqrt{L}$ equal to 1 AU?',
      steps: [{ text: 'The edge reaches 1 AU when $\\sqrt{L} = 1/0.95$, so $L = 1.108$.', tex: '1 + 0.4\\left(1 - \\tfrac{t}{4.57}\\right) = \\frac{1}{1.108} = 0.9025' }, 'Hence $0.4(1 - t/4.57) = -0.0975$, $1 - t/4.57 = -0.244$ and $t = 1.244 \\times 4.57 = 5.7$ Gyr.', 'That is 5.7 − 4.57 = 1.1 Gyr from now.'],
      a: 'About 1.1 billion years from now Earth crosses the conservative inner edge. Models vary, from half a billion to two billion years, because the edge itself depends on the model.' }
  ],
  quiz: [
    { q: 'The habitable zone of a star with a quarter of the Sun\'s luminosity is', choices: ['four times as far out as the Sun\'s', 'at half the distance of the Sun\'s', 'the same as the Sun\'s', 'a quarter of the distance of the Sun\'s'], a: 1, why: 'The distance scales as $\\sqrt{L}$, and $\\sqrt{0.25} = 0.5$.' },
    { q: 'A planet inside the habitable zone must have liquid water on its surface.', a: false, why: 'The zone concerns the stellar flux. Without a sufficient atmosphere, as on Mars, or with one that is too thick or too thin, the surface can be dry or frozen.' },
    { q: 'Why is it hard to say the young Earth should have been frozen yet was not?', choices: ['The Sun was brighter then', 'The Sun was about 70 % as bright as now, yet geology shows liquid water; a stronger greenhouse or lower albedo must have compensated', 'There was no Sun', 'Earth was closer'], a: 1, why: 'Without compensating greenhouse gases the oceans would have frozen. That the evidence says otherwise is the faint young Sun paradox.' },
    { q: 'A planet orbits a star of 0.122 solar masses at 0.0485 AU. What is its period, in days?', answer: 11.2, unit: 'day', why: '$P = 2\\pi\\sqrt{a^3/GM} = 11.2$ days (Proxima b). Its year is 11 days, which is why such planets are likely to be tidally locked.' },
    { q: 'What is the equilibrium temperature of a planet with albedo 0.3 at 1 AU from the Sun, in kelvin?', answer: 255, unit: 'K', why: '$[L(1-A)/(16\\pi\\sigma d^2)]^{1/4} = 254.6$ K, which is $-18\\ ^\\circ$C. The greenhouse effect adds about 33 K.' }
  ],
  applications: ['Choosing targets for exoplanet surveys: planets in the zone of nearby red dwarfs are easiest to detect (Proxima b, TRAPPIST-1).', 'Planning observations of atmospheres with JWST and future telescopes to look for water vapour and other gases.', 'Estimating the number of potentially habitable planets in the galaxy, as in the Drake equation\'s factor for planets with water.', 'Forecasting the habitable lifetime of the Earth and the choice of stars to search for life ([[the-search-follows-the-water]]).'],
  history: 'Su-Shu Huang proposed the idea of a habitable zone in 1959; James Kasting, Daniel Whitmire and Ray Reynolds made the first quantitative climate-model estimate in 1993; Ravi Kopparapu and colleagues revised it in 2013 with updated absorption data, which is the version used for exoplanet statistics. The discovery of Proxima b in 2016 and of the TRAPPIST-1 system in 2017 made the zones of red dwarfs the focus of the field.',
  sources: ['Kasting, Whitmire and Reynolds, "Habitable zones around main sequence stars", *Icarus* 101 (1993).', 'Kopparapu and colleagues, "Habitable zones around main-sequence stars: new estimates", *The Astrophysical Journal* 765 (2013).', 'Sagan and Mullen, "Earth and Mars: evolution of atmospheres and surface temperatures", *Science* 177 (1972) — the faint young Sun.', 'Anglada-Escudé and colleagues, *Nature* 536 (2016) — Proxima b; Gillon and colleagues, *Nature* 542 (2017) — TRAPPIST-1.'],
  sim: 'cos-habitable-zone'
}
);
