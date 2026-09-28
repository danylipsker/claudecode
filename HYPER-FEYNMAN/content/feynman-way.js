/* HYPER-FEYNMAN · content/feynman-way.js — Feynman's way of thinking.
 * Topics: how-physics-works (atoms, the map of physics, physics and the other sciences, gravitation as a model law,
 * mathematics and physics, seeking new laws) and scientific-attitude (doubt, knowing versus naming, cargo cult science).
 * Simulations: sims/feynman-way.js (prefix way-). */
Hyper.add(

{
  id: 'atomic-hypothesis', parent: 'how-physics-works', title: 'The atomic hypothesis', level: 1,
  short: 'If only one sentence of science could be saved, Feynman would keep this one: everything is made of atoms — tiny particles in endless motion that attract at a little distance and resist being pressed together. Heat, pressure, the states of matter and evaporation all follow.',
  keywords: ['atoms', 'molecules', 'atomic hypothesis', 'atoms in motion', 'heat', 'jiggling', 'solid liquid gas', 'evaporation', 'evaporative cooling', 'ice', 'pressure', 'Avogadro', 'Lennard-Jones', 'water drop', 'states of matter'],
  prereq: ['physics:temperature', 'chemistry:atomic-theory', 'math:scientific-notation'],
  related: ['basic-physics', 'kinetic-theory-feyn', 'brownian-movement', 'probability-feyn', 'physics:kinetic-theory-gases', 'physics:latent-heat', 'chemistry:intermolecular-forces', 'chemistry:kinetic-molecular-theory'],
  body: `
Feynman opened his first lecture with a thought experiment. Imagine that some catastrophe wiped out all of science, and only a single statement could be handed on to whoever came next. Which statement would carry the most knowledge in the fewest words? His answer was the **atomic hypothesis**: matter is made of atoms. Three properties of those atoms turn the idea into a machine for explaining things:

1. they never stop moving;
2. at a small separation they attract one another;
3. forced closer still, they repel.

Much of physics, chemistry and biology can be read off from these three lines.

### A drop of water, magnified
A drop from a tap holds about 50 microlitres, or 0.05 g of water. Divide by the mass of one molecule and you find about $1.7\\times10^{21}$ molecules — a number with 22 digits, which is why [[?scientific-notation|powers of ten]] are the natural language here. Each molecule has a little cube of room about 0.31 nm on a side. To see them we would have to magnify the drop about a billion times ($10^9$). The 3 mm drop would then be 3000 km across, the size of a small continent, and each molecule about as big as a football.

What would we see? Molecules pressed against their neighbours, all jiggling, never still. That jiggling **is** heat: a warmer drop is simply one whose molecules move faster. At room temperature the [[?square-root|root]]-mean-square speed of a water molecule is about 640 m/s, nearly twice the speed of sound in air — yet in the liquid it cannot fly far: it rattles in a cage of neighbours, now and then slipping into a new place.

### Solid, liquid, gas
- **Solid.** Cool the drop and the jiggling slows until the attractions lock the molecules into a regular pattern, a crystal, where each still vibrates about its place. Ice is peculiar: its molecules link into an open hexagonal network full of holes, so ice (917 kg/m³) floats on water (1000 kg/m³).
- **Liquid.** Warmer, and the molecules still touch but slide past one another: the liquid flows and takes the shape of its container while keeping its volume.
- **Gas.** Hotter still, they fly apart. Each hit on a wall is a tiny push; in air about $3\\times10^{21}$ hits on each square millimetre every second add up to the steady **pressure**. Squeeze the gas into half the volume at the same temperature and the hits come twice as often: the pressure doubles.

### Evaporation cools
A molecule at the surface is held back by the pull of those beneath it. Only the fastest ones, in the tail of the speed distribution, break free. Each escaping molecule takes more than its share of energy, so those left behind are slower on average: the liquid **cools**. This is why wet skin feels cold in a breeze and an uncovered cup of tea cools quickly. Evaporating a kilogram of water at skin temperature takes about 2.4 MJ.

### Attraction and repulsion
Both halves of the force matter. Without the attraction nothing would hold together — no drops, no rocks, no people. Without the repulsion at close range everything would collapse. A standard model of the force between two simple molecules, used in the simulation, is the Lennard-Jones energy

$$U(r) = 4\\varepsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12} - \\left(\\frac{\\sigma}{r}\\right)^{6}\\right]$$

The first term, a steep [[?exponent|power]] of $1/r$, is the resistance to squeezing; the second is the gentle pull at a distance. The energy is lowest at $r = 2^{1/6}\\sigma \\approx 1.12\\,\\sigma$, the distance two molecules like to sit apart. (Water's hydrogen bonds add a preferred direction, but the picture is the same.)

> [!tip] In the simulation, cool the molecules into a crystal (six neighbours each), then warm them into a liquid and a gas. Open the lid with the heat bath off: the temperature falls as the fastest leave. Drag one molecule away — its neighbours cling; push it into the crowd — they push back.

| Evidence | When | What it showed |
|---|---|---|
| Fixed proportions in chemistry (Dalton) | 1808 | elements combine in whole-number ratios |
| Brownian motion (Einstein; Perrin) | 1905–1909 | the jiggling of specks is molecules hitting them; Avogadro's number measured |
| X-ray diffraction of crystals | 1912 | atoms sit in regular lattices about 0.1–0.3 nm apart |
| Scanning tunnelling microscope | 1981 | single atoms seen |

> [!key] Everything is made of atoms in perpetual motion. The motion is heat; attraction at a distance and repulsion up close decide whether matter is a solid, a liquid or a gas.
`,
  ideas: [
    'All matter is made of atoms (and molecules built from them) that are always moving.',
    'The random motion of the molecules is what we feel as heat; faster jiggling means a higher temperature.',
    'Molecules attract at a little distance and repel when pushed together; the balance of the two against the jiggling decides solid, liquid or gas.',
    'Gas pressure is the sum of countless molecular hits on the walls.',
    'Evaporation cools a liquid because the fastest molecules are the ones that escape.'
  ],
  pitfalls: [
    'In a solid the atoms stand still — They vibrate about fixed places; only at absolute zero would the motion reach its (quantum) minimum.',
    'Heat is a substance that flows into things — Heat is the energy of random molecular motion; nothing material flows in when an object warms up.',
    'In a liquid the molecules are far apart, as in a gas — A liquid is nearly as dense as its solid; the molecules touch but can slide past each other.'
  ],
  formulas: [
    {
      name: 'Number of molecules in a sample',
      expr: 'N = rho*V*NA/M', tex: 'N = \\dfrac{\\rho\\, V N_A}{M}',
      vars: {
        N: { name: 'number of molecules', q: 'count' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        V: { name: 'volume of the sample', q: 'volume', unit: 'µL', value: 50 },
        NA: { const: 'NA' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 }
      },
      note: 'Mass ρV divided by molar mass gives moles; times Avogadro\'s number gives molecules. For water, 18.015 g/mol.',
      stories: {
        N: 'How many water molecules are in a drop of {V}?',
        V: 'What volume of water holds {N} molecules?'
      }
    },
    {
      name: 'The room each molecule takes',
      expr: 'd = (M/(rho*NA))^(1/3)', tex: 'd = \\left(\\dfrac{M}{\\rho N_A}\\right)^{1/3}',
      vars: {
        d: { name: 'side of the cube each molecule occupies', q: 'length', unit: 'nm' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        NA: { const: 'NA' }
      },
      note: 'Volume per molecule M/(ρN_A), then the cube root. In a liquid or solid this is close to the size of a molecule; in a gas at room conditions it is about ten times larger.',
      stories: { d: 'Water has a density of {rho} and a molar mass of {M}. How much room does each molecule have?' }
    },
    {
      name: 'Speed of the thermal jiggling',
      expr: 'v = sqrt(3*kB*T/m)', tex: 'v_{\\mathrm{rms}} = \\sqrt{\\dfrac{3k_BT}{m}}',
      vars: {
        v: { name: 'root-mean-square speed', q: 'speed', unit: 'm/s', tex: 'v_{\\mathrm{rms}}' },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 },
        m: { name: 'mass of one molecule', q: 'mass', unit: 'u', value: 18.015 }
      },
      note: 'From ½mv² = (3/2)k_BT on average. It holds for the molecules of liquids and solids as well as gases — what differs is how far they get between collisions.',
      stories: {
        v: 'How fast, on average, do water molecules (mass {m}) jiggle at {T}?',
        T: 'At what temperature would water molecules (mass {m}) have an rms speed of {v}?'
      }
    }
  ],
  examples: [
    {
      title: 'Counting the molecules in a drop',
      q: 'A drop of water has a volume of 50 µL. How many molecules does it contain, and how much room does each one have?',
      steps: [
        'Mass: $50\\ \\mu\\mathrm{L} \\times 1\\ \\mathrm{g/mL} = 0.050$ g. Moles: $0.050/18.015 = 2.78\\times10^{-3}$ mol.',
        'Molecules: $N = 2.78\\times10^{-3} \\times 6.022\\times10^{23} = 1.67\\times10^{21}$.',
        'Room per molecule: $5.0\\times10^{-8}\\ \\mathrm{m^3} / 1.67\\times10^{21} = 3.0\\times10^{-29}\\ \\mathrm{m^3}$, a cube of side $(3.0\\times10^{-29})^{1/3} = 3.1\\times10^{-10}$ m.'
      ],
      a: 'About 1.7 × 10²¹ molecules, each in a cube about 0.31 nm across.'
    },
    {
      title: 'Magnified a billion times',
      q: 'Magnify a 3 mm drop of water, a 10 µm speck of dust and a 0.31 nm water molecule by $10^9$. How big does each become?',
      steps: [
        'Drop: $3\\times10^{-3}\\ \\mathrm{m} \\times 10^9 = 3\\times10^{6}$ m = 3000 km.',
        'Dust: $10^{-5} \\times 10^9 = 10^4$ m = 10 km — a mountain.',
        'Molecule: $3.1\\times10^{-10} \\times 10^9 = 0.31$ m — about a football.'
      ],
      a: 'A 3000 km drop, a 10 km speck of dust, and molecules the size of footballs.'
    },
    {
      title: 'How fast do the molecules move?',
      q: 'Find the rms speed of water molecules (18.0 u) and nitrogen molecules (28.0 u) at 300 K. What happens if the temperature is doubled?',
      steps: [
        'Water: $m = 18.0 \\times 1.661\\times10^{-27} = 2.99\\times10^{-26}$ kg; $v = \\sqrt{3 \\times 1.381\\times10^{-23} \\times 300 / 2.99\\times10^{-26}} = 644$ m/s.',
        'Nitrogen: heavier by 28/18, so slower by $\\sqrt{18/28}$: 517 m/s.',
        'Doubling $T$ multiplies $v$ by $\\sqrt{2} = 1.41$: 911 m/s for water at 600 K.'
      ],
      a: '644 m/s for water, 517 m/s for nitrogen; √2 times faster at twice the absolute temperature.'
    }
  ],
  quiz: [
    { q: 'A puddle evaporates on a still day. Compared with the air around it, the water left behind is…', choices: ['cooler, because the fastest molecules escaped', 'warmer, because the slow molecules escaped', 'the same temperature, because evaporation needs no energy', 'cooler, because air molecules dissolve into it'], a: 0, why: 'Only molecules fast enough to overcome the pull of their neighbours escape, taking more than the average energy with them.' },
    { q: 'The absolute temperature of a gas is multiplied by four. The rms speed of its molecules is multiplied by…', choices: ['2', '4', '16', '√2'], a: 0, why: 'v ∝ √T, so four times the temperature gives twice the speed.' },
    { q: 'In a crystal of ice the water molecules are at rest.', a: false, why: 'They vibrate about fixed positions; the jiggling is the heat energy of the ice.' },
    { q: 'Why does ice float on water?', choices: ['Its molecules form an open network with holes, so it is less dense', 'It contains trapped air bubbles', 'Its molecules are lighter than those of liquid water', 'Cold things always float'], a: 0, why: 'Hydrogen bonds hold the molecules of ice in an open hexagonal lattice: 917 kg/m³ against 1000 kg/m³ for the liquid.' },
    { q: 'A gas is slowly squeezed to half its volume at constant temperature. Its pressure…', choices: ['doubles, because the molecules hit each part of the wall twice as often', 'stays the same, because the molecules move no faster', 'quadruples', 'halves'], a: 0, why: 'Same speeds, twice the number per unit volume, so twice as many hits per second on each square metre.' }
  ],
  problems: [
    { q: 'How many molecules are in 1.00 g of water?', answer: 3.34e22, tol: 0.02, hint: 'Moles = mass / molar mass; then multiply by Avogadro\'s number.',
      steps: ['Moles: $1.00/18.015 = 0.0555$ mol.', '$N = 0.0555 \\times 6.022\\times10^{23} = 3.34\\times10^{22}$.'] },
    { q: 'Magnified a billion times, how large would a red blood cell 8 µm across appear?', answer: 8, unit: 'km', tol: 0.02, hint: 'Multiply by 10⁹.',
      steps: ['$8\\times10^{-6}\\ \\mathrm{m} \\times 10^9 = 8\\times10^3$ m = 8 km.'] }
  ],
  applications: [
    'Sweating, cooling towers and unglazed clay water jars all cool by evaporation: the fastest molecules leave.',
    'A tyre\'s pressure is the drumming of air molecules on the rubber; it rises on a hot day because they move faster.',
    'Scanning tunnelling and atomic force microscopes image and even move single atoms.',
    'Molecular dynamics — the method of the simulation on this page — designs drugs, alloys and lubricants on computers.'
  ],
  history: 'Leucippus and Democritus proposed indivisible atoms in the fifth century BC, without evidence. John Dalton gave the idea its chemical footing in 1808. Josef Loschmidt made the first estimate of the size of molecules in 1865. Robert Brown described the jiggling of tiny particles released from pollen grains in 1827; Albert Einstein explained it by molecular impacts in 1905, and Jean Perrin\'s measurements (1908–09) convinced the last sceptics and earned him the 1926 Nobel Prize. Gerd Binnig and Heinrich Rohrer made single atoms visible with the scanning tunnelling microscope in 1981.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 1 (Atoms in Motion) — the one sentence worth saving, a drop of water magnified, heat as jiggling, pressure, evaporation, dissolving and chemical reactions pictured atom by atom.',
    '*Six Easy Pieces* (1994), ch. 1 — the same lecture, reprinted.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 39 (The Kinetic Theory of Gases) — the pressure of a gas worked out from molecular hits.'
  ],
  sim: 'way-water-drop'
},

{
  id: 'basic-physics', parent: 'how-physics-works', title: 'A map of basic physics', level: 1,
  short: 'Nature is like a game whose rules we must learn by watching. The rules we know sort themselves by scale: the nuclear forces inside nuclei, the electric force from atoms to people, gravity from asteroids to galaxies — all within quantum mechanics.',
  keywords: ['basic physics', 'laws of nature', 'rules of the game', 'chess', 'conservation law', 'fundamental forces', 'powers of ten', 'scales', 'electromagnetic spectrum', 'gravity', 'electric force', 'nuclear force', 'understanding'],
  prereq: ['atomic-hypothesis', 'math:scientific-notation', 'physics:fundamental-forces'],
  related: ['physics-and-other-sciences', 'seeking-new-laws', 'gravity-vs-electricity', 'em-introduction', 'great-conservation-principles', 'physics:standard-model', 'physics:em-spectrum', 'math:logarithmic-scales'],
  body: `
What does it mean to understand nature? Feynman compared the world to an enormous game — he chose chess — whose rules nobody has told us. We can watch the moves, and from them we try to work the rules out. Two lessons come with the picture.

First, **knowing the rules is not the same as being able to play**. The rules of chess fit on a page, yet nobody can calculate the best move in every position. Physics is the same: the basic laws may be few, but turbulent water, the weather or a living cell are far too complicated to follow from them step by step.

Second, sometimes we cannot see a rule directly but notice that something **stays the same** whatever moves are made. In chess, a piece that only moves diagonally stays on squares of one colour all game long. That is the flavour of a conservation law. And sometimes, after watching for a long time, we see a rare move that breaks what we thought was a rule — and we must find a deeper rule that includes the exception. The first simulation lets you be the watcher of a game of our own invention: keep a notebook of laws, see which survive, and wait for the surprise.

### The map, from small to large
The rules known today sort themselves by scale. Each step of ten in size is a [[?scientific-notation|power of ten]]; from a proton to the observable universe is about 42 of them. The second simulation zooms through them.

| Scale | Things | Force that shapes them | Theory needed |
|---|---|---|---|
| $10^{-15}$ m | protons, neutrons, nuclei | strong force; the weak force turns one particle into another | quantum mechanics and relativity |
| $10^{-10}$ m | atoms, molecules | electric force | quantum mechanics |
| $10^{-9}$ to $10^{4}$ m | cells, people, buildings, mountains | electric force, in many disguises | classical physics is usually enough |
| $10^{5}$ m and up | moons, planets, stars, galaxies | gravity | Newton; Einstein for strong fields |

Friction, the stiffness of steel, the tension in a rope, the push of your hand on a door, every chemical reaction: at bottom all of these are the **electric force** between atoms. Compared with gravity it is monstrously strong. In a hydrogen atom the electric pull between the electron and the proton is $8.2\\times10^{-8}$ N; their gravitational pull is $3.6\\times10^{-47}$ N, about $2\\times10^{39}$ times weaker. Gravity rules the sky only because matter is almost perfectly neutral — the positive and negative charges cancel, while mass only ever adds up. A body larger than a few hundred kilometres is squeezed round by its own gravity; a smaller one can stay lumpy, like a potato-shaped asteroid.

### Fields and waves
In the nineteenth century electricity and magnetism were found to be one thing, and their disturbances were found to travel through empty space as waves. Radio, microwaves, light, X-rays and gamma rays are the same waves at different frequencies, with $f\\lambda = c$: a 100 MHz radio wave is 3 m long, green light 530 nm, a medical X-ray a few hundredths of a nanometre. The electric force between two charges falls off as the [[?inverse|inverse]] square of the distance, $F = kq_1q_2/r^2$, like gravity — but it can repel as well as attract.

### Quantum physics and the particles
In the twentieth century it turned out that neither light nor matter behaves the way the classical pictures said: both arrive in lumps, and where the lumps go is governed by [[?amplitude|probability amplitudes]]. Quantum mechanics is not an extra force but the framework in which all the forces act. Inside the nucleus two more forces appear — the strong force that binds protons and neutrons (and the quarks inside them), and the weak force behind some radioactivity and the burning of the Sun.

> [!key] A handful of rules at the bottom — gravity and electromagnetism with their long reach, two short-range nuclear forces, all inside quantum mechanics — and a ladder of scales built on them. Knowing the rules is the start of understanding, not the end of it.
`,
  ideas: [
    'Discovering the laws of nature is like learning the rules of a game by watching it being played.',
    'Knowing the fundamental rules does not mean being able to predict everything that follows from them.',
    'A quantity that never changes, whatever happens, is a conservation law — often easier to spot than the rules themselves.',
    'The electric force holds atoms, molecules, solids and people together; gravity dominates only at large scales, because matter is neutral.',
    'Radio, light and X-rays are one phenomenon — electromagnetic waves — at different frequencies.'
  ],
  pitfalls: [
    'Friction, contact forces and tension are separate fundamental forces — All of them are the electric force between atoms, seen in bulk.',
    'Gravity dominates astronomy because it is the strongest force — It is by far the weakest; it wins at large scales because mass never cancels while electric charges do.',
    'Once the basic laws are known, physics is finished — Working out what the laws imply (turbulence, materials, life) is most of the work, and the laws themselves are revised when experiments demand.'
  ],
  formulas: [
    {
      name: 'Frequency and wavelength of electromagnetic waves',
      expr: 'f = c/lambda', tex: 'f = \\dfrac{c}{\\lambda}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'THz' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 530, tex: '\\lambda' }
      },
      note: 'Every electromagnetic wave travels at c in vacuum; only the frequency (and so the wavelength) distinguishes radio from light from X-rays.',
      stories: {
        f: 'Green light has a wavelength of {lambda}. What is its frequency?',
        lambda: 'An FM radio station broadcasts at {f}. How long are its waves?'
      }
    },
    {
      name: 'The electric force between two charges (Coulomb)',
      expr: 'F = ke*q1*q2/r^2', tex: 'F = \\dfrac{k\\, q_1 q_2}{r^2}',
      vars: {
        F: { name: 'force', q: 'force', unit: 'N' },
        ke: { const: 'ke' },
        q1: { name: 'first charge (size)', q: 'charge', unit: 'e', value: 1, tex: 'q_1' },
        q2: { name: 'second charge (size)', q: 'charge', unit: 'e', value: 1, tex: 'q_2' },
        r: { name: 'distance between them', q: 'length', unit: 'nm', value: 0.0529 }
      },
      note: 'Sizes of the charges; like charges repel, unlike attract. With one electron and one proton 0.0529 nm apart (the hydrogen atom), about 8.2 × 10⁻⁸ N.',
      stories: {
        F: 'An electron and a proton are {r} apart. How strongly do they attract?',
        r: 'At what distance do two elementary charges push on each other with {F}?'
      }
    },
    {
      name: 'Powers of ten between two sizes',
      expr: 'n = log(L2/L1)', tex: 'n = \\log_{10}\\dfrac{L_2}{L_1}',
      vars: {
        n: { name: 'number of powers of ten', tex: 'n' },
        L2: { name: 'larger size', q: 'length', unit: 'm', value: 1.7, tex: 'L_2' },
        L1: { name: 'smaller size', q: 'length', unit: 'nm', value: 0.1, tex: 'L_1' }
      },
      note: 'Each step of 1 in n is a factor of ten in size. From an atom (0.1 nm) to a person (1.7 m) is about 10 steps.',
      stories: {
        n: 'How many powers of ten separate an atom of {L1} from a person {L2} tall?',
        L2: 'What is {n} powers of ten larger than {L1}?'
      }
    }
  ],
  examples: [
    {
      title: 'Electricity against gravity in a hydrogen atom',
      q: 'Compare the electric and the gravitational pull between the electron and the proton of a hydrogen atom, 0.0529 nm apart.',
      steps: [
        'Electric: $F_e = kq^2/r^2 = 8.99\\times10^{9} \\times (1.602\\times10^{-19})^2 / (5.29\\times10^{-11})^2 = 8.24\\times10^{-8}$ N.',
        'Gravitational: $F_g = Gm_em_p/r^2 = 6.674\\times10^{-11} \\times 9.109\\times10^{-31} \\times 1.673\\times10^{-27} / (5.29\\times10^{-11})^2 = 3.63\\times10^{-47}$ N.',
        'Ratio: $8.24\\times10^{-8}/3.63\\times10^{-47} = 2.3\\times10^{39}$.'
      ],
      a: 'The electric pull is about 2 × 10³⁹ times stronger; gravity plays no part in holding atoms together.'
    },
    {
      title: 'From a hair to the Earth',
      q: 'A human hair is about 80 µm thick; the Earth is 12 742 km across. How many powers of ten apart are they?',
      steps: [
        'Ratio: $1.2742\\times10^{7}/8\\times10^{-5} = 1.59\\times10^{11}$.',
        '$n = \\log_{10}(1.59\\times10^{11}) = 11.2$.'
      ],
      a: 'About eleven powers of ten.'
    },
    {
      title: 'One wave, many names',
      q: 'Find the wavelengths of a 100 MHz radio wave and of a 2.45 GHz microwave-oven wave.',
      steps: [
        '$\\lambda = c/f = 3.00\\times10^{8}/1.00\\times10^{8} = 3.00$ m.',
        '$\\lambda = 3.00\\times10^{8}/2.45\\times10^{9} = 0.122$ m = 12.2 cm.'
      ],
      a: '3.0 m and 12.2 cm — the same kind of wave as light, which is 5 to 6 million times shorter.'
    }
  ],
  quiz: [
    { q: 'At the level of atoms, the force with which a table holds up a book is…', choices: ['the electric force between the atoms of the book and of the table', 'gravity between the book and the table', 'the strong nuclear force', 'a separate contact force with no deeper origin'], a: 0, why: 'Contact forces arise when the electron clouds of the atoms are pushed together: electric repulsion (with quantum mechanics deciding how the electrons can arrange themselves).' },
    { q: 'Why does gravity, the weakest force, dominate the motion of planets and galaxies?', choices: ['Mass is always positive and adds up, while electric charges cancel', 'Gravity has a longer range than the electric force', 'The electric force switches off in space', 'Planets are made of neutrons'], a: 0, why: 'Both forces fall off as 1/r², but bulk matter is neutral, so large bodies exert almost no net electric force on each other.' },
    { q: 'Knowing all the fundamental laws of physics would let us predict the outcome of any experiment in practice.', a: false, why: 'Many systems — turbulence, weather, living cells — are far too complicated to work out from the laws, just as knowing the rules of chess does not make you a grandmaster.' },
    { q: 'While watching a game, you notice that some number never changes whatever moves are played. In physics this is called…', choices: ['a conservation law', 'a force', 'an initial condition', 'a coincidence'], a: 0, why: 'Energy, momentum, angular momentum and charge are such unchanging quantities; they constrain what can happen even when the detailed rules are unknown.' },
    { q: 'Radio waves, visible light and X-rays differ in…', choices: ['frequency (and so wavelength) only', 'their speed in vacuum', 'whether they are electric or magnetic', 'nothing at all'], a: 0, why: 'All travel at c in vacuum; they are electromagnetic waves of different frequency.' }
  ],
  problems: [
    { q: 'How many powers of ten separate a water molecule (0.3 nm) from the diameter of the Earth (12 742 km)?', answer: 16.6, tol: 0.02, hint: 'Take log₁₀ of the ratio.',
      steps: ['Ratio: $1.2742\\times10^{7}/3\\times10^{-10} = 4.25\\times10^{16}$.', '$\\log_{10}(4.25\\times10^{16}) = 16.6$.'] },
    { q: 'What is the wavelength of a 1.0 GHz mobile-phone signal?', answer: 0.30, unit: 'm', tol: 0.02, hint: 'λ = c/f.',
      steps: ['$\\lambda = 3.00\\times10^{8}/1.0\\times10^{9} = 0.30$ m.'] }
  ],
  applications: [
    'Engineers choose their physics by scale: continuum mechanics for bridges, quantum mechanics for chips, general relativity for GPS clocks.',
    'The whole electromagnetic spectrum is used as one resource — radio and radar, microwaves, infrared cameras, optical fibres, X-ray imaging.',
    'Conservation laws let us predict outcomes (collisions, rockets, reactions) without knowing the detailed forces.'
  ],
  history: 'Michael Faraday introduced the idea of lines of force in the 1830s–40s, and James Clerk Maxwell\'s equations (1865) unified electricity, magnetism and light. Ernest Rutherford found the atomic nucleus in 1911; quantum mechanics was built in 1925–27; the neutron was discovered in 1932. When Feynman gave his lectures in 1961 the particle "zoo" was still unexplained; the quark model came in 1964 and the Standard Model of the strong, weak and electromagnetic forces was complete in the 1970s.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 2 (Basic Physics) — nature as a game whose rules we try to learn by watching, physics before 1920, the electromagnetic spectrum, quantum physics, nuclei and particles.',
    '*Six Easy Pieces* (1994), ch. 2 — the same lecture, reprinted.',
    '*The Character of Physical Law*, lecture 3 (The Great Conservation Principles) — why quantities that never change are so useful.'
  ],
  sim: ['way-rules-game', 'way-powers-of-ten']
},

{
  id: 'physics-and-other-sciences', parent: 'how-physics-works', title: 'Physics and the other sciences', level: 1,
  short: 'Chemistry, biology, astronomy, geology and the rest stand on physics without being "only physics". What lets each science keep its own rules is a ladder of energies: thermal jiggling at kT ≈ 1/40 eV, chemical bonds at a few eV, nuclei at millions.',
  keywords: ['other sciences', 'chemistry', 'biology', 'astronomy', 'geology', 'psychology', 'energy scales', 'kT', 'Boltzmann factor', 'activation energy', 'reaction rate', 'hydrogen bond', 'covalent bond', 'fusion', 'Sun', 'stars', 'tunnelling'],
  prereq: ['basic-physics', 'atomic-hypothesis', 'math:exponential-functions'],
  related: ['boltzmann-law', 'tunnelling-feyn', 'kinetic-theory-feyn', 'flow-of-wet-water', 'physics:fusion', 'physics:the-sun', 'chemistry:arrhenius-equation', 'chemistry:hydrogen-bonding', 'biology:bioenergetics'],
  body: `
Physics is the most fundamental of the sciences, but that does not make the others "applied physics". In his third lecture Feynman toured the neighbours — chemistry, biology, astronomy, geology, psychology — to show what each owes to physics and what each has of its own. Every one of them studies things made of atoms obeying the same laws; every one also asks questions that physics alone would never think to ask, and has built concepts (valence, enzymes, stellar populations, plate tectonics, memory) that summarise the physics at its own level.

### The neighbours
- **Chemistry.** Quantum mechanics of electrons in the electric field of nuclei explains, in principle, all of chemical bonding and the periodic table. In practice only small molecules can be computed from scratch, so chemists keep their own rules — and those rules work because they are good summaries of the physics.
- **Biology.** Nothing found in a living cell breaks the laws of physics and chemistry, but the machinery is astonishing: proteins folded into precise shapes that speed up reactions a million-fold or more, DNA carrying the instructions to build them, nerves signalling with ions crossing membranes.
- **Astronomy.** Physics' oldest partner. The stars are made of the same atoms as the Earth — we read their composition in the lines of their spectra — and they shine by nuclear fusion. The carbon and oxygen in us were made inside earlier stars.
- **Geology and weather.** The slow convection of the Earth's mantle moves continents; the atmosphere and oceans are fluids stirred by sunshine. Turbulent flow is still one of the great unsolved problems of classical physics.
- **Psychology.** The brain works by chemistry and electricity, but how it produces thought is an open question.

There is also a question that runs through all of them: *how did things get that way?* — the history of the universe, the Earth and life. Physics gives the laws; the history has to be found.

### Why the sciences can be separate: a ladder of energies
Why can a chemist ignore the inside of a nucleus, and a biologist ignore most of quantum mechanics? Because the energies are wildly different. At temperature $T$ the typical energy of thermal jiggling is $k_BT$ — about 0.026 eV (1/40 eV) at room temperature. The chance that a random jostle brings in energy $E$ falls as the [[?boltzmann-factor|Boltzmann factor]] $e^{-E/k_BT}$, an [[?exponential]] that collapses very quickly. Molecules try about $10^{13}$ times a second, so the waiting time for a jostle big enough is roughly

$$t \\approx \\frac{e^{E/k_BT}}{\\nu}, \\qquad \\nu \\approx 10^{13}\\ \\mathrm{s^{-1}}$$

| Process | Energy | Waiting time at 300 K |
|---|---|---|
| a hydrogen bond in water breaks | 0.2 eV | about $2\\times10^{-10}$ s — all the time |
| a slow chemical reaction gets over its barrier | 1 eV | about 2 hours |
| a carbon–carbon bond breaks by heat alone | 3.6 eV | about $10^{47}$ s, $10^{30}$ times the age of the universe |
| two protons get over their electric repulsion | about 1 MeV | never |

So at room temperature hydrogen bonds flicker (liquid water, the soft and changeable machinery of life), while the backbones of the molecules of life last (DNA keeps its message for a lifetime), and nuclei are sealed boxes: to chemistry a nucleus is just a point with a charge and a mass. Warm a reaction with a 0.5 eV barrier by ten degrees and it roughly doubles its speed — the everyday rule of thumb of cooks and chemists.

Even the centre of the Sun, at about 15 million kelvin, has $k_BT$ of only 1.3 keV, a thousand times too little to push two protons together. Classically the Sun could not shine. Protons fuse because quantum mechanics lets them tunnel through the barrier — rarely: a given proton in the core waits billions of years on average, which is why the Sun lasts about ten billion years.

> [!tip] In the energy-ladder simulation, slide the temperature from a freezer to the core of the Sun and watch which rungs come alive. The powers-of-ten zoom shows where each science lives in size.

> [!key] All the sciences rest on the same physics, but each lives on its own rung of the ladder of energies and sizes. The rungs are so far apart that each science can keep its own rules — and that is why the others are not "only physics".
`,
  ideas: [
    'Every science studies things made of atoms obeying the same physical laws, yet each has its own questions and concepts.',
    'Thermal jiggling carries about k_BT of energy: 1/40 eV at room temperature.',
    'The chance of a jostle with energy E falls as e^(−E/k_BT), so energy scales separate sharply: hydrogen bonds flicker, covalent bonds last, nuclei are untouched.',
    'The Sun\'s core is far too cool for protons to fuse classically; quantum tunnelling makes it possible, slowly.',
    'Besides laws, the sciences ask a historical question: how did things come to be as they are?'
  ],
  pitfalls: [
    'Chemistry and biology are just applied physics — The laws are physics, but the concepts that make the subjects work (valence, enzymes, natural selection) are new ideas at their own level.',
    'Living things need some force beyond physics and chemistry — Nothing of the kind has ever been found; the machinery is complicated, not magical.',
    'A reaction happens once the temperature reaches its barrier energy — Reactions go at any temperature, at a rate set by e^(−E/k_BT); room temperature (k_BT ≈ 0.026 eV) drives reactions with barriers of about 1 eV slowly.'
  ],
  formulas: [
    {
      name: 'The energy of thermal jiggling',
      expr: 'E = kB*T', tex: 'E = k_B T',
      vars: {
        E: { name: 'typical thermal energy', q: 'energy', unit: 'eV' },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'k_BT sets the scale of random energy: 0.026 eV at room temperature, 1.3 keV in the core of the Sun.',
      stories: {
        E: 'What is k_BT at {T}?',
        T: 'At what temperature does thermal jiggling carry {E}?'
      }
    },
    {
      name: 'Waiting for a big enough jostle',
      expr: 't = exp(E/(kB*T))/nu', tex: 't = \\dfrac{e^{E/k_BT}}{\\nu}',
      vars: {
        t: { name: 'typical waiting time', q: 'time', unit: 'h' },
        E: { name: 'energy needed (barrier)', q: 'energy', unit: 'eV', value: 1 },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 },
        nu: { name: 'attempt frequency', q: 'frequency', unit: 'Hz', value: 1e13, tex: '\\nu' }
      },
      note: 'An order-of-magnitude rule: molecules "try" about 10¹³ times a second, and each try succeeds with probability e^(−E/k_BT). Rates of real reactions follow the same exponential (the Arrhenius law).',
      stories: {
        t: 'A reaction needs {E} to get going. Roughly how long does a molecule wait at {T}?',
        T: 'At what temperature does a molecule wait only {t} for a jostle of {E}?'
      }
    },
    {
      name: 'How long the Sun can shine',
      expr: 't = f*M*c^2/L', tex: 't = \\dfrac{f\\, M c^2}{L}',
      vars: {
        t: { name: 'lifetime', q: 'time', unit: 'Gyr' },
        f: { name: 'fraction of the mass turned into energy', q: 'ratio', unit: '%', value: 0.07 },
        M: { name: 'mass of the star', q: 'mass', unit: 'M☉', value: 1 },
        c: { const: 'c' },
        L: { name: 'luminosity (power radiated)', q: 'power', unit: 'L☉', value: 1 }
      },
      note: 'Fusing hydrogen into helium turns 0.7 % of the mass into energy, and only about a tenth of the Sun\'s hydrogen is burnt in its core during its main life: f ≈ 0.07 %.',
      stories: {
        t: 'A star of {M} radiates {L} and can turn {f} of its mass into energy. How long can it shine?',
        L: 'A star of {M} with f = {f} shines for {t}. What is its luminosity?'
      }
    }
  ],
  examples: [
    {
      title: 'k_BT from the kitchen to the Sun',
      q: 'Find $k_BT$ in electronvolts at 300 K and in the core of the Sun, 15.7 million kelvin.',
      steps: [
        '$k_B = 1.381\\times10^{-23}$ J/K $= 8.617\\times10^{-5}$ eV/K.',
        '300 K: $8.617\\times10^{-5} \\times 300 = 0.0259$ eV, about 1/40 eV.',
        '$1.57\\times10^{7}$ K: $8.617\\times10^{-5} \\times 1.57\\times10^{7} = 1350$ eV = 1.35 keV.'
      ],
      a: '0.026 eV in a room, 1.35 keV in the Sun\'s core — still a thousand times less than the ~1 MeV barrier between two protons.'
    },
    {
      title: 'Ten degrees doubles the rate',
      q: 'A reaction has an energy barrier of 0.5 eV. By what factor does its rate grow when the temperature rises from 20 °C to 30 °C?',
      steps: [
        'The rate is proportional to $e^{-E/k_BT}$, so the ratio is $\\exp\\left[\\dfrac{E}{k_B}\\left(\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right)\\right]$.',
        '$E/k_B = 0.5/8.617\\times10^{-5} = 5802$ K; $1/293.15 - 1/303.15 = 1.125\\times10^{-4}$ K⁻¹.',
        'Ratio: $e^{5802 \\times 1.125\\times10^{-4}} = e^{0.653} = 1.92$.'
      ],
      a: 'About twice as fast — why food keeps longer in a fridge and why lizards are sluggish on cold mornings.'
    },
    {
      title: 'The Sun\'s fuel',
      q: 'The Sun (mass $1.99\\times10^{30}$ kg) radiates $3.83\\times10^{26}$ W. If it can turn 0.07 % of its mass into energy, how long can it shine?',
      steps: [
        'Energy available: $0.0007 \\times 1.99\\times10^{30} \\times (3.00\\times10^{8})^2 = 1.25\\times10^{44}$ J.',
        'Time: $1.25\\times10^{44}/3.83\\times10^{26} = 3.27\\times10^{17}$ s.',
        'In years: $3.27\\times10^{17}/3.16\\times10^{7} = 1.0\\times10^{10}$.'
      ],
      a: 'About 10 billion years; the Sun, 4.6 billion years old, is roughly halfway.'
    }
  ],
  quiz: [
    { q: 'Hydrogen bonds in water hold with about 0.2 eV; k_BT at room temperature is 0.026 eV. The bonds…', choices: ['break and re-form billions of times a second', 'never break at room temperature', 'break only at 100 °C', 'break only when light falls on them'], a: 0, why: 'e^(−0.2/0.026) ≈ 4 × 10⁻⁴, times 10¹³ tries a second: a break every fraction of a nanosecond. That restlessness is why water is a liquid.' },
    { q: 'Why can chemists treat the atomic nucleus as a point with a charge and a mass?', choices: ['Nuclear energies are millions of times larger than chemical ones, so chemistry cannot disturb a nucleus', 'Nuclei are too small to matter', 'The strong force does not act inside atoms', 'Nuclei are always at rest'], a: 0, why: 'Chemical energies are a few eV, nuclear ones MeV; the Boltzmann factor for reaching a nucleus is effectively zero.' },
    { q: 'Something has been found in living cells that does not obey the laws of physics and chemistry.', a: false, why: 'No such thing has been found. Biology is complicated, and has its own concepts, but its machinery obeys the same laws.' },
    { q: 'At the centre of the Sun k_BT is about 1 keV, but two protons repel with a barrier of about 1 MeV. How do they manage to fuse?', choices: ['by quantum tunnelling through the barrier', 'gravity pulls them together', 'they are neutral in the core', 'they do not: the Sun shines by burning chemicals'], a: 0, why: 'Classically the fusion rate would be zero; the tunnelling probability is tiny but, with vast numbers of protons, enough to power the Sun for ten billion years.' },
    { q: 'What is k_BT at body temperature, 37 °C, in electronvolts?', answer: 0.0267, unit: 'eV', why: '8.617 × 10⁻⁵ eV/K × 310.15 K = 0.0267 eV.' }
  ],
  problems: [
    { q: 'At what temperature is $k_BT$ equal to 1 eV?', answer: 11600, unit: 'K', tol: 0.02, hint: 'T = E/k_B with k_B = 8.617 × 10⁻⁵ eV/K.',
      steps: ['$T = 1/8.617\\times10^{-5} = 1.16\\times10^{4}$ K.'] },
    { q: 'A reaction has a barrier of 0.8 eV. By what factor does its rate rise between 20 °C and 40 °C?', answer: 7.56, tol: 0.03, hint: 'Ratio = exp[(E/k_B)(1/T₁ − 1/T₂)].',
      steps: ['$E/k_B = 0.8/8.617\\times10^{-5} = 9284$ K.', '$1/293.15 - 1/313.15 = 2.179\\times10^{-4}$ K⁻¹.', 'Ratio $= e^{9284 \\times 2.179\\times10^{-4}} = e^{2.023} = 7.56$.'] }
  ],
  applications: [
    'Refrigeration, pasteurisation and the shelf lives of foods and medicines are all set by the Boltzmann factor.',
    'Enzymes speed up reactions by lowering the barrier E — a small change in E is a huge change in e^(−E/k_BT).',
    'Stellar models, made from the same nuclear and atomic physics as laboratories, predict how long stars live and which elements they make.',
    'Weather and climate models are fluid physics on a planetary scale.'
  ],
  history: 'Walter Heitler and Fritz London explained the chemical bond of the hydrogen molecule with quantum mechanics in 1927. George Gamow explained tunnelling out of nuclei in 1928, and Robert Atkinson and Fritz Houtermans applied it to the stars in 1929; Hans Bethe worked out how stars fuse hydrogen in 1938–39. Margaret and Geoffrey Burbidge, William Fowler and Fred Hoyle showed in 1957 how the elements are made in stars. Watson and Crick found the structure of DNA in 1953, a few years before Feynman\'s lectures.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 3 (The Relation of Physics to Other Sciences) — chemistry, biology, astronomy, geology, psychology, and the question of how things got that way.',
    '*Six Easy Pieces* (1994), ch. 3 — the same lecture, reprinted.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 40 (The Principles of Statistical Mechanics) — the exponential atmosphere and Boltzmann\'s law e^(−E/kT).',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 42 (Applications of Kinetic Theory) — evaporation and the rates of chemical reactions governed by an activation energy.'
  ],
  sim: ['way-energy-ladder', { id: 'way-powers-of-ten', params: { start: -5 } }]
},

{
  id: 'law-of-gravitation-example', parent: 'how-physics-works', title: 'The law of gravitation as an example of physical law', level: 2,
  short: 'To show what a law of physics is like, Feynman took one: gravitation. From Tycho\'s data and Kepler\'s rules to Newton\'s inverse square, the Moon test, the tides, the Cavendish balance and the galaxies — a simple mathematical law, universal, not quite exact, and silent about its mechanism.',
  keywords: ['law of gravitation', 'Newton', 'Kepler', 'inverse square', 'equal areas', 'Moon test', 'Cavendish', 'weighing the Earth', 'universal gravitation', 'Mercury perihelion', 'Rømer', 'Neptune', 'character of physical law', 'central force'],
  prereq: ['basic-physics', 'physics:newtons-second-law', 'physics:uniform-circular-motion'],
  related: ['theory-of-gravitation', 'keplers-laws-feyn', 'lost-lecture-ellipses', 'gravity-vs-electricity', 'math-and-physics', 'seeking-new-laws', 'physics:keplers-laws', 'physics:newtons-law-of-gravitation', 'physics:tides'],
  body: `
Asked in 1964 to lecture at Cornell on the character of physical law, Feynman did not begin with generalities. He began with one law, told fully — gravitation — so that the features that laws share could be seen in a single, well-tested case.

### From data to a law
Tycho Brahe measured the planets' positions by eye, to about one or two minutes of arc. Johannes Kepler, after years with those numbers, found three rules (1609 and 1619): each planet moves on an ellipse with the Sun at one focus; the line from the Sun to the planet sweeps out **equal areas in equal times**; and the square of the period is [[?proportional]] to the cube of the orbit's size, $T^2 \\propto a^3$.

Galileo had found that a body left alone keeps moving in a straight line. Newton saw what that means for a planet: its path bends, so something pulls it. The equal-area rule tells exactly which way — straight towards the Sun. (Any force aimed at the Sun, of any strength, gives equal areas; the simulation lets you check this with other force laws.) The third rule tells how the pull changes with distance: as the [[?inverse|inverse]] square. And the pull on the planet must be proportional to its mass, and by symmetry to the Sun's:

$$F = G\\,\\frac{m_1 m_2}{r^2}$$

### The Moon test
If the same pull that drops an apple also holds the Moon, it must be weaker at the Moon's distance, 60 Earth radii away, by $60^2 = 3600$. So the Moon should fall towards the Earth with $9.8/3600 = 0.0027$ m/s². The Moon's actual acceleration, from its 27.3-day circle of radius 384 400 km, is $4\\pi^2 r/T^2 = 0.0027$ m/s². One law for apples and moons.

### Everywhere
- Jupiter's moons obey Kepler's third rule around Jupiter; from them Jupiter can be weighed.
- The oceans rise in two bulges because the Moon pulls the near side of the Earth more than its centre, and the centre more than the far side: the tides.
- In 1798 Henry Cavendish measured the tiny pull between lead balls in a laboratory, found $G$, and so "weighed the Earth".
- Double stars orbit each other by the same law; star clusters and galaxies are held together by it.
- In 1676 Ole Rømer noticed Jupiter's moons running early when Jupiter was near and late when it was far — and deduced that light takes time to travel.
- In 1846 Neptune was found where Urbain Le Verrier had calculated a planet must be, from the tugs on Uranus.

### What the example teaches
The law is **mathematical** and **simple** to state, yet its consequences are endlessly rich. It is **universal**, from apples to galaxies. It is **not exact**: the orbit of Mercury turns by 43 seconds of arc per century more than Newton's law allows, which Einstein's general relativity (1915) explained. And it says nothing about **why**: Feynman examined a tempting mechanism — space full of particles flying every way, with bodies shading each other so that they are pushed together — and showed why it fails: a moving planet would meet more particles in front than behind and be slowed down, which is not seen. The law describes what happens without a machine underneath.

> [!tip] In the orbit simulation, change the force law away from $1/r^2$: the areas stay equal, but the ellipse no longer closes — it turns into a rosette. Add a second planet and compare $T^2/a^3$.

> [!key] One law, $F = Gm_1m_2/r^2$, found from planetary data, tested on the Moon, confirmed in the laboratory and across the galaxy — mathematical, universal, approximate, and silent about its machinery: the character of physical law in one example.
`,
  ideas: [
    'Kepler\'s rules summarised the data; Newton\'s law explained them — and then predicted much more.',
    'Equal areas in equal times means the force points towards the Sun; T² ∝ a³ means it falls off as 1/r².',
    'The Moon test: the apple\'s g, weakened by 60², gives the Moon\'s observed acceleration.',
    'The law is universal (tides, moons, double stars, galaxies) but not exact: general relativity corrects it.',
    'The law says what happens, not why; no mechanism for gravity has been found.'
  ],
  pitfalls: [
    'Equal areas in equal times is a special property of the inverse-square law — It holds for any force aimed at the Sun; it expresses conservation of angular momentum.',
    'The Moon is not falling — It falls towards the Earth all the time; its sideways speed makes it keep missing.',
    'Newton\'s law was proved wrong by Einstein — It is an excellent approximation where fields are weak and speeds are low; general relativity contains it as a limit.'
  ],
  formulas: [
    {
      name: 'Newton\'s law of gravitation',
      expr: 'F = G*m1*m2/r^2', tex: 'F = \\dfrac{G\\, m_1 m_2}{r^2}',
      vars: {
        F: { name: 'force of attraction', q: 'force', unit: 'N' },
        G: { const: 'G' },
        m1: { name: 'first mass', q: 'mass', unit: 'M⊕', value: 1, tex: 'm_1' },
        m2: { name: 'second mass', q: 'mass', unit: 'kg', value: 7.342e22, tex: 'm_2' },
        r: { name: 'distance between the centres', q: 'length', unit: 'km', value: 384400 }
      },
      note: 'For spheres, r is measured between centres. With the Earth and the Moon: about 2 × 10²⁰ N.',
      stories: {
        F: 'How hard do the Earth ({m1}) and the Moon ({m2}) pull on each other {r} apart?',
        r: 'At what distance would the Earth ({m1}) and a {m2} body attract with {F}?'
      }
    },
    {
      name: 'Kepler\'s third law, from Newton\'s',
      expr: 'T = 2*pi*sqrt(a^3/(G*M))', tex: 'T = 2\\pi\\sqrt{\\dfrac{a^3}{GM}}',
      vars: {
        T: { name: 'orbital period', q: 'time', unit: 'day' },
        a: { name: 'semi-major axis (radius of a circular orbit)', q: 'length', unit: 'AU', value: 1 },
        G: { const: 'G' },
        M: { name: 'mass of the central body', q: 'mass', unit: 'M☉', value: 1 }
      },
      note: 'For a small body around a much larger one. In years and astronomical units around the Sun, T² = a³.',
      stories: {
        T: 'A planet orbits a star of {M} at {a}. How long is its year?',
        M: 'A moon circles its planet at {a} every {T}. What is the planet\'s mass?'
      }
    },
    {
      name: 'The Moon test: the Moon\'s month from falling apples',
      expr: 'T = 2*pi*sqrt(r^3/(g*R^2))', tex: 'T = 2\\pi\\sqrt{\\dfrac{r^3}{g R^2}}',
      vars: {
        T: { name: 'period of the Moon', q: 'time', unit: 'day' },
        r: { name: 'radius of the Moon\'s orbit', q: 'length', unit: 'km', value: 384400 },
        g: { const: 'g' },
        R: { name: 'radius of the Earth', q: 'length', unit: 'km', value: 6371 }
      },
      note: 'Gravity at the Moon is g(R/r)²; setting it equal to the centripetal acceleration 4π²r/T² gives T. The prediction, 27.5 days, is within 1 % of the sidereal month (27.3 days); the rest comes mostly from the Earth also circling the common centre of mass.',
      stories: {
        T: 'Using only g at the surface of the Earth (radius {R}) and the Moon\'s distance {r}, predict the length of the month.',
        r: 'How far away would a moon have to be to go round the Earth (radius {R}) in {T}?'
      }
    }
  ],
  derivation: {
    title: 'From the inverse square to T² ∝ a³ (circular orbits)',
    steps: [
      { text: 'A planet of mass $m$ on a circle of radius $a$ at speed $v$ needs a force towards the centre of $mv^2/a$. Set it equal to the pull of gravity:', tex: '\\frac{mv^2}{a} = \\frac{GMm}{a^2}' },
      { text: 'The planet\'s mass cancels — every body at the same distance moves the same way. Solve for the speed:', tex: 'v^2 = \\frac{GM}{a}' },
      { text: 'One trip round is $2\\pi a$ at speed $v$, so the period is $T = 2\\pi a/v$. Square it and put in $v^2$:', tex: 'T^2 = \\frac{4\\pi^2 a^2}{v^2} = \\frac{4\\pi^2}{GM}\\,a^3' },
      { text: 'The factor in front is the same for every planet of the same Sun: that is Kepler\'s third rule, and it works only if the force goes as $1/r^2$. With a $1/r^3$ force, for example, $T^2$ would grow as $a^4$.' }
    ]
  },
  examples: [
    {
      title: 'Weighing the Earth',
      q: 'From $g = 9.81$ m/s², the Earth\'s radius 6371 km and $G = 6.674\\times10^{-11}$ N·m²/kg², find the mass of the Earth.',
      steps: [
        'At the surface $g = GM/R^2$, so $M = gR^2/G$.',
        '$M = 9.81 \\times (6.371\\times10^{6})^2 / 6.674\\times10^{-11} = 5.97\\times10^{24}$ kg.',
        'Average density: $M/(\\tfrac43\\pi R^3) = 5510$ kg/m³, twice that of surface rock — the core must be dense (iron).'
      ],
      a: '6.0 × 10²⁴ kg — which is why Cavendish\'s measurement of G was called weighing the Earth.'
    },
    {
      title: 'Weighing Jupiter with Io',
      q: 'Jupiter\'s moon Io circles at 421 700 km every 1.769 days. Find Jupiter\'s mass.',
      steps: [
        'From Kepler\'s third law, $M = 4\\pi^2 a^3/(GT^2)$.',
        '$a^3 = (4.217\\times10^{8})^3 = 7.50\\times10^{25}$ m³; $T = 1.769 \\times 86400 = 1.528\\times10^{5}$ s.',
        '$M = 39.48 \\times 7.50\\times10^{25} / (6.674\\times10^{-11} \\times 2.336\\times10^{10}) = 1.90\\times10^{27}$ kg.'
      ],
      a: '1.9 × 10²⁷ kg, about 318 Earths.'
    },
    {
      title: 'The Moon test in numbers',
      q: 'Compare $g(R/r)^2$ with the Moon\'s centripetal acceleration $4\\pi^2 r/T^2$, using $R = 6371$ km, $r = 384\\,400$ km and $T = 27.32$ days.',
      steps: [
        '$g(R/r)^2 = 9.81 \\times (6371/384400)^2 = 2.69\\times10^{-3}$ m/s².',
        '$T = 27.32 \\times 86400 = 2.361\\times10^{6}$ s; $4\\pi^2 r/T^2 = 39.48 \\times 3.844\\times10^{8} / 5.572\\times10^{12} = 2.72\\times10^{-3}$ m/s².',
        'They agree to about 1 %.'
      ],
      a: 'Both are 0.0027 m/s²: the apple and the Moon obey one law.'
    }
  ],
  quiz: [
    { q: 'Kepler\'s rule of equal areas in equal times shows that the force on a planet…', choices: ['points towards the Sun', 'falls off as 1/r²', 'is proportional to the planet\'s mass', 'points along the planet\'s motion'], a: 0, why: 'Any central force conserves angular momentum and gives equal areas; the 1/r² comes from the third rule (and the closed ellipse).' },
    { q: 'The Moon is about 60 Earth radii away. Its acceleration towards the Earth is about…', choices: ['g/3600', 'g/60', 'g', '60 g'], a: 0, why: 'Inverse square: (1/60)² = 1/3600, giving 0.0027 m/s².' },
    { q: 'Newton\'s law of gravitation agrees exactly with every planetary observation.', a: false, why: 'Mercury\'s orbit turns 43″ per century more than Newton allows; general relativity accounts for it.' },
    { q: 'A planet orbits the Sun at 4 AU. Its period is…', choices: ['8 years', '4 years', '16 years', '64 years'], a: 0, why: 'T² = a³ in years and AU: T = 4^(3/2) = 8 years.' },
    { q: 'What did Cavendish\'s experiment of 1798 measure?', choices: ['the gravitational constant G (and so the Earth\'s mass)', 'the acceleration g', 'the distance to the Sun', 'the speed of light'], a: 0, why: 'g was already known; measuring the pull between known masses in the laboratory gave G, and then M = gR²/G.' }
  ],
  problems: [
    { q: 'Mars orbits the Sun at 1.524 AU. How long is its year, in Earth years?', answer: 1.88, unit: 'yr', tol: 0.02, hint: 'T² = a³ with T in years and a in AU.',
      steps: ['$T = 1.524^{3/2} = \\sqrt{3.540} = 1.88$ years.'] },
    { q: 'At what height above the Earth\'s surface is the acceleration of gravity a quarter of g?', answer: 6371, unit: 'km', tol: 0.02, hint: 'g falls as 1/r² with r measured from the centre.',
      steps: ['A quarter of g needs twice the distance from the centre: $r = 2R$.', 'Height above the surface: $r - R = R = 6371$ km.'] }
  ],
  applications: [
    'Every spacecraft trajectory, from geostationary satellites (42 164 km from the Earth\'s centre) to probes slingshotting past planets, is computed with this law.',
    'Exoplanets are found and weighed from the tiny wobble they cause in their star.',
    'Measuring how fast galaxies rotate, with Kepler\'s law, revealed that they hold far more mass than their stars — dark matter.'
  ],
  history: 'Tycho Brahe\'s observations (1570s–1601) led to Kepler\'s laws (1609, 1619). Newton\'s *Principia* (1687) derived them from the laws of motion and universal gravitation. Rømer found the finite speed of light from Jupiter\'s moons in 1676, Cavendish measured G in 1798, and Neptune was discovered in 1846 from Le Verrier\'s predictions. Einstein\'s general relativity (1915) explained Mercury\'s extra precession.',
  sources: [
    '*The Character of Physical Law*, lecture 1 ("The Law of Gravitation, an Example of Physical Law"; Messenger Lectures, Cornell, 1964) — Kepler\'s rules, Newton\'s law, the Moon, the tides, Cavendish, clusters and galaxies, and the absence of a mechanism.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 7 (The Theory of Gravitation) — planetary motion, Kepler\'s laws, Newton\'s law, universal gravitation, Cavendish\'s experiment, and a section asking what gravity is.',
    '*Six Easy Pieces* (1994), ch. 5 — the same lecture on gravitation, reprinted.'
  ],
  sim: 'way-orbits'
},

{
  id: 'math-and-physics', parent: 'how-physics-works', title: 'The relation of mathematics to physics', level: 2,
  short: 'Mathematics is the language of physics and, above all, its engine of reasoning. One law can be written in forms that look nothing alike — a force acting at a distance, a local field, a path of least action — that predict exactly the same things yet point to different new ideas.',
  keywords: ['mathematics', 'mathematics and physics', 'Babylonian', 'Greek', 'axioms', 'three formulations', 'force', 'field', 'potential', 'least action', 'action at a distance', 'local law', 'gradient', 'Laplace', 'equivalent formulations'],
  prereq: ['law-of-gravitation-example', 'math:derivative', 'physics:gravitational-potential'],
  related: ['least-action-mechanics', 'why-least-action', 'work-and-potential-energy', 'em-introduction', 'seeking-new-laws', 'physics:gravitational-field', 'math:gradient', 'math:laplace-equation'],
  body: `
Why should nature follow mathematics at all? Feynman did not claim to know. In his second Messenger Lecture he described instead *how* the two fit together, and why a physicist uses mathematics differently from a mathematician.

### A language, and an engine
Mathematics is partly a language — a compact way to write a law such as $F = Gm_1m_2/r^2$ — but mostly it is a machine for reasoning. Put a law in, and it produces consequences nobody would have guessed from the law's appearance: that planets move on ellipses, that the tides come twice a day, that a sphere pulls as if all its mass sat at its centre. Newton showed with a neat geometric argument about triangles that any force aimed at the Sun makes the planet sweep equal areas in equal times; today we say the same thing as conservation of angular momentum. The reasoning is the mathematics; the law alone is just a line.

### Greek and Babylonian
Feynman contrasted two ways of holding knowledge. The *Greek* way, Euclid's, picks a few axioms and derives everything from them. The *Babylonian* way — his name for it — knows a great many connected results and how to get from any one to others, without insisting on which are fundamental. Physicists, he argued, must work the Babylonian way, because nature has not told us which of our statements are the axioms. A law that looks derived today may turn out to be the deeper one tomorrow; if you remember several routes between the facts, you can survive losing one.

### One law, three ways
Gravitation itself can be stated in three forms that look nothing alike:

1. **Force at a distance.** Every mass pulls every other with $Gm_1m_2/r^2$ along the line between them. To predict a motion, add the pulls and step forward in time: $\\vec F = m\\vec a$ is a [[?differential-equation]].
2. **The field, a local law.** Every point of space carries a number, the gravitational potential $\\phi$, and a body accelerates down its slope, $\\vec g = -\\nabla\\phi$ — the [[?gradient]]. In empty space the potential at each point equals the average of its values over any small sphere around it (its [[?laplacian|Laplacian]] is zero); mass makes it dip. Nothing reaches across space: each place is ruled only by its neighbours.
3. **The whole path at once.** Of all the paths a body could follow from here to there in a given time, it takes the one for which the [[?action]] — the [[?integral]] over time of kinetic minus potential energy — is [[?stationary|least]]. No step-by-step rule at all.

Mathematically they are equivalent: every prediction of one is a prediction of the others. Psychologically they are completely different, and when a law has to be changed they suggest different guesses. Historically, Einstein's general relativity grew from the field picture, and Feynman's own path-integral quantum mechanics from the least-action one. That, for Feynman, was reason enough to keep all three in mind.

> [!tip] The three-ways simulation computes one arc of an orbit three times — by adding the Sun's pull step by step, by rolling down the local slope of the potential, and by relaxing a whole trial path until its action is least. Overlay them: they coincide. Then wiggle the trial path and watch the action go up.

### The action in numbers
For a free body moving uniformly a distance $d$ in time $t$ the action is $S = md^2/2t$ — for a 100 g ball moving 2 m in 1 s, 0.2 J·s. Any other schedule for the same trip, fast then slow, gives more. In quantum mechanics the action is measured against $\\hbar = 1.05\\times10^{-34}$ J·s; the ball's $2\\times10^{33}\\,\\hbar$ is why it behaves classically.

> [!key] Mathematics is physics' engine of reasoning. A law can be stated as a force, a field or a least-action principle — identical in prediction, different in the ideas they suggest — so physicists keep many forms of each law, Babylonian style.
`,
  ideas: [
    'Mathematics is both the language of physical law and the reasoning that draws consequences from it.',
    'Physicists hold knowledge "Babylonian" style — many connected results — rather than from a fixed set of axioms.',
    'Gravitation can be stated as a force at a distance, as a local field (potential) law, or as a principle of least action.',
    'The three statements predict exactly the same motions but suggest different generalisations.',
    'The action of a path is the time integral of kinetic minus potential energy; the true path makes it stationary.'
  ],
  pitfalls: [
    'The three formulations of gravity are rival theories that experiments could tell apart — They are mathematically equivalent; no experiment on ordinary gravity can distinguish them.',
    'The least-action principle means the particle looks ahead and chooses — It is a way of stating the law, equivalent to Newton\'s step-by-step rule; nothing needs to "know" the future.',
    'Mathematics in physics is only bookkeeping for results found otherwise — Most consequences of a law — ellipses, tides, the shape of the Earth — are found by mathematical reasoning, not by separate experiment.'
  ],
  formulas: [
    {
      name: 'The gravitational field of a sphere',
      expr: 'g = G*M/r^2', tex: 'g = \\dfrac{GM}{r^2}',
      vars: {
        g: { name: 'field (acceleration of a free body)', q: 'accel', unit: 'm/s²' },
        G: { const: 'G' },
        M: { name: 'mass of the sphere', q: 'mass', unit: 'M⊕', value: 1 },
        r: { name: 'distance from its centre', q: 'length', unit: 'km', value: 6371 }
      },
      note: 'The force per kilogram: any body at that place, whatever its mass, accelerates at g.',
      stories: {
        g: 'What is the gravitational field at {r} from the centre of a body of mass {M}?',
        r: 'How far from the centre of a body of {M} has the field dropped to {g}?'
      }
    },
    {
      name: 'The gravitational potential of a sphere',
      expr: 'phi = -G*M/r', tex: '\\phi = -\\dfrac{GM}{r}',
      vars: {
        phi: { name: 'potential (energy per kilogram)', q: 'specificenergy', unit: 'MJ/kg', signed: true, tex: '\\phi' },
        G: { const: 'G' },
        M: { name: 'mass of the sphere', q: 'mass', unit: 'M⊕', value: 1 },
        r: { name: 'distance from its centre', q: 'length', unit: 'km', value: 6371 }
      },
      note: 'Zero far away and negative near the mass. The field is minus its slope: g = −dφ/dr.',
      stories: {
        phi: 'What is the gravitational potential at {r} from the centre of a mass {M}?',
        r: 'At what distance from the centre of {M} is the potential {phi}?'
      }
    },
    {
      name: 'Escape speed, from the potential',
      expr: 'v = sqrt(2*G*M/r)', tex: 'v_{\\mathrm{esc}} = \\sqrt{\\dfrac{2GM}{r}}',
      vars: {
        v: { name: 'escape speed', q: 'speed', unit: 'km/s', tex: 'v_{\\mathrm{esc}}' },
        G: { const: 'G' },
        M: { name: 'mass of the body', q: 'mass', unit: 'M⊕', value: 1 },
        r: { name: 'starting distance from its centre', q: 'length', unit: 'km', value: 6371 }
      },
      note: 'Kinetic energy per kilogram ½v² must fill the potential well −φ = GM/r. No forces need to be added along the way — the potential does the bookkeeping.',
      stories: {
        v: 'How fast must a probe leave the surface of a body of mass {M} and radius {r} to escape for ever?',
        M: 'The escape speed from a body of radius {r} is {v}. What is its mass?'
      }
    },
    {
      name: 'The action of uniform motion',
      expr: 'S = m*d^2/(2*t)', tex: 'S = \\dfrac{m\\,d^2}{2t}',
      vars: {
        S: { name: 'action', q: 'angmom', unit: 'J·s' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.1 },
        d: { name: 'distance travelled', q: 'length', unit: 'm', value: 2 },
        t: { name: 'time taken', q: 'time', unit: 's', value: 1 }
      },
      note: 'No forces: the action is the kinetic energy ½m(d/t)² times the time. Any non-uniform schedule for the same trip gives a larger action.',
      stories: {
        S: 'A {m} ball moves {d} in {t} at steady speed. What is the action of its path?',
        t: 'For what travel time would a {m} body moving {d} uniformly have an action of {S}?'
      }
    }
  ],
  derivation: {
    title: 'Why steady motion has the least action (free body)',
    steps: [
      { text: 'A free body must cover a distance $d$ in a time $t$. Try a schedule: speed $v_1$ for the first half of the time and $v_2$ for the second, with $(v_1 + v_2)\\,t/2 = d$. With no potential energy, the action is the kinetic energy added over time:', tex: 'S = \\tfrac12 m v_1^2\\,\\tfrac{t}{2} + \\tfrac12 m v_2^2\\,\\tfrac{t}{2} = \\tfrac{m t}{4}\\left(v_1^2 + v_2^2\\right)' },
      { text: 'Write the two speeds as the average $\\bar v = d/t$ plus and minus a difference $u$: $v_1 = \\bar v + u$, $v_2 = \\bar v - u$. The cross terms cancel when the squares are added:', tex: 'v_1^2 + v_2^2 = 2\\bar v^2 + 2u^2' },
      { text: 'So the action is the uniform value plus a penalty that grows as the square of the unevenness:', tex: 'S = \\frac{m d^2}{2t} + \\frac{m t}{2}\\,u^2' },
      { text: 'It is least when $u = 0$: steady motion in a straight line — Newton\'s first law, recovered from least action. With gravity added, the potential energy term bends the best path into a parabola or an orbit.' }
    ]
  },
  examples: [
    {
      title: 'Escaping from the Earth, with the potential',
      q: 'Find the potential at the Earth\'s surface and the speed needed to escape from it.',
      steps: [
        '$\\phi = -GM/R = -6.674\\times10^{-11} \\times 5.972\\times10^{24}/6.371\\times10^{6} = -6.26\\times10^{7}$ J/kg.',
        'To escape, $\\tfrac12 v^2 + \\phi \\ge 0$: $v = \\sqrt{2 \\times 6.26\\times10^{7}} = 1.12\\times10^{4}$ m/s.'
      ],
      a: '−62.6 MJ/kg and 11.2 km/s — found without following the motion at all.'
    },
    {
      title: 'The same number from field and force',
      q: 'Find the field of the Earth at the surface, and the force on a 70 kg person, both ways.',
      steps: [
        'Field: $g = GM/R^2 = 3.986\\times10^{14}/(6.371\\times10^{6})^2 = 9.82$ m/s².',
        'Force: $F = GMm/R^2 = 9.82 \\times 70 = 687$ N — the field view and the force view agree, as they must.',
        'The small difference from 9.81 m/s² at the equator is the Earth\'s spin and flattening.'
      ],
      a: '9.82 m/s² and 687 N.'
    },
    {
      title: 'Why a ball does not show quantum effects',
      q: 'Compare the action of a 100 g ball rolling 2 m in 1 s with $\\hbar = 1.055\\times10^{-34}$ J·s.',
      steps: [
        '$S = md^2/2t = 0.1 \\times 4/2 = 0.2$ J·s.',
        '$S/\\hbar = 0.2/1.055\\times10^{-34} = 1.9\\times10^{33}$.',
        'The quantum phase turns by $S/\\hbar$ radians; paths differing by the tiniest amount have wildly different phases and cancel, leaving only the path of least action.'
      ],
      a: 'About 2 × 10³³ ħ: deep in the classical world.'
    }
  ],
  quiz: [
    { q: 'Newton\'s force law, the field (potential) law and the principle of least action, applied to a planet, give…', choices: ['exactly the same orbit', 'slightly different orbits, which experiments can distinguish', 'the same orbit only for circles', 'different orbits for heavy planets'], a: 0, why: 'They are mathematically equivalent statements of the same law.' },
    { q: 'Which statement of the law of gravitation is local — each point affected only by its neighbours?', choices: ['the field (potential) law', 'Newton\'s force at a distance', 'the principle of least action', 'Kepler\'s third law'], a: 0, why: 'The potential obeys a rule relating its value at a point to its values nearby; the force law reaches across space, and least action looks at a whole path.' },
    { q: 'Physicists should keep several equivalent formulations of a law in mind because…', choices: ['each suggests different ways of guessing a new law', 'one of them is usually wrong', 'experiments prefer one of them', 'mathematicians require it'], a: 0, why: 'Equivalent now, they generalise differently: field ideas led to general relativity, least action to path integrals.' },
    { q: 'For a free body making a trip of fixed length and duration, a fast-then-slow schedule has less action than steady motion.', a: false, why: 'The action is the uniform value plus a positive term in the square of the unevenness; steady motion gives the least.' },
    { q: 'In Feynman\'s description, the "Babylonian" way of doing mathematics means…', choices: ['knowing many connected results and the routes between them, without fixing which are fundamental', 'deriving everything from a few axioms', 'doing arithmetic only', 'using only numerical tables'], a: 0, why: 'The Greek way starts from axioms; the Babylonian way, which suits physics, keeps a web of connections.' }
  ],
  problems: [
    { q: 'The Moon has mass $7.342\\times10^{22}$ kg and radius 1737 km. What is the escape speed from its surface?', answer: 2.38, unit: 'km/s', tol: 0.02, hint: 'v = √(2GM/R).',
      steps: ['$2GM/R = 2 \\times 6.674\\times10^{-11} \\times 7.342\\times10^{22}/1.737\\times10^{6} = 5.64\\times10^{6}$ m²/s².', '$v = \\sqrt{5.64\\times10^{6}} = 2375$ m/s ≈ 2.38 km/s.'] },
    { q: 'A 1.0 g bead moves 1.0 cm in 1.0 s at steady speed. How large is its action, in units of ħ?', answer: 4.74e26, tol: 0.02, hint: 'S = md²/2t, then divide by ħ = 1.0546 × 10⁻³⁴ J·s.',
      steps: ['$S = 10^{-3} \\times (10^{-2})^2/2 = 5.0\\times10^{-8}$ J·s.', '$S/\\hbar = 5.0\\times10^{-8}/1.0546\\times10^{-34} = 4.74\\times10^{26}$.'] }
  ],
  applications: [
    'Engineers switch between forms constantly: forces for a bridge, potentials for flow and electrostatics, energy and variational methods (finite elements) for structures.',
    'Spacecraft trajectories are planned with potentials and energy (escape speeds, transfer orbits) and then integrated step by step.',
    'Least-action and variational principles are the starting point of modern field theories and of Feynman\'s path integrals.'
  ],
  history: 'Newton\'s *Principia* (1687) stated gravitation as a force at a distance, which troubled Newton himself. Laplace and Poisson (1780s–1810s) gave it the local form of a potential obeying a differential equation. Maupertuis, Euler and Lagrange (1740s–1780s) and Hamilton (1834) developed the least-action form. Einstein\'s field theory of gravitation came in 1915; Feynman\'s path-integral quantum mechanics, built on least action, in 1948.',
  sources: [
    '*The Character of Physical Law*, lecture 2 ("The Relation of Mathematics to Physics"; Messenger Lectures, Cornell, 1964) — mathematics as reasoning, the Greek and Babylonian ways, and gravitation stated as a force, a field and a minimum principle.',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 19 (The Principle of Least Action) — the action, why the true path makes it stationary, and the quantum reason behind it.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 14 (Work and Potential Energy, conclusion) — conservative forces, potentials and fields.'
  ],
  sim: 'way-three-ways'
},

{
  id: 'seeking-new-laws', parent: 'how-physics-works', title: 'Seeking new laws: guess, compute, compare', level: 2,
  short: 'A new law is found by guessing it, computing what the guess implies, and comparing that with experiment. A disagreement proves the guess wrong; agreement never proves it right — it only survives, until a better experiment tests it again.',
  keywords: ['scientific method', 'guess', 'compute', 'compare', 'experiment', 'falsification', 'hypothesis', 'pendulum', 'power law', 'residual', 'standard deviation', 'z-score', 'vague theory', 'approximation', 'Mercury perihelion', 'data fitting'],
  prereq: ['math-and-physics', 'law-of-gravitation-example', 'math:linear-regression'],
  related: ['doubt-and-uncertainty', 'cargo-cult-science', 'basic-physics', 'physics:simple-pendulum', 'math:hypothesis-testing', 'math:power-functions', 'math:logarithms'],
  body: `
How is a new law found? Feynman's answer, in the last of his Messenger Lectures, was disarmingly plain. First you **guess** it. Then you **compute** the consequences of the guess — what it implies for things that can be measured. Then you **compare** those consequences with nature, by experiment or observation. If they disagree, the guess is wrong. Its beauty, the cleverness of its author and his fame make no difference at all.

### Guessing is allowed
The guess is not squeezed out of the data by a mechanical procedure; it is a leap. It may come from a feeling for simplicity or symmetry, from a mathematical form borrowed from another subject, or from one of the equivalent forms of an old law — which is one reason to know several ([[math-and-physics]]). Most guesses are wrong, and a working scientist makes many of them.

### Computing the consequences
A guess must say something definite. A theory vague enough to be adjusted to whatever happens can never be caught out — and for exactly that reason it tells us nothing. The computing step is where mathematics turns a law into numbers that an experiment can check.

### Comparing, and the one-way street
Agreement never proves a law right; it only means the law has not yet been shown wrong. A later experiment, more precise or in a new range, may find a disagreement. Newton's gravitation passed every test for two centuries before Mercury's orbit showed an excess turn of 43 seconds of arc per century — about a tenth of an arcsecond per orbit, yet measurable. A disagreement from a sound experiment is decisive.

To judge a comparison, measure the gap in units of the experiment's uncertainty, its [[?standard-deviation|standard deviation]] $\\sigma$:

$$z = \\frac{x_{\\text{measured}} - x_{\\text{predicted}}}{\\sigma}$$

A single point with $|z| \\approx 2$ turns up by chance about one time in twenty. Many points all on one side, or one at $|z| > 4$ that survives re-measurement, means the guess (or the experiment) is wrong.

### Try it: the laws of the pendulum
The simulation times pendulums of different lengths, with realistic errors, and lets you guess the law:

- *"The period does not depend on length"* — the long pendulums visibly take longer: wrong.
- *"The period is proportional to the length"* — a pendulum four times longer should take four times as long; it takes about twice: wrong.
- *"The period goes as the [[?square-root|square root]] of the length"* — passes, with a fitted constant.
- *"$T = 2\\pi\\sqrt{L/g}$"*, Newton's prediction with nothing adjustable — passes for small swings. Now release the pendulums from 40° and time them precisely: every point lies above the prediction by many $\\sigma$. The law was an approximation, valid for small angles.
- The refined guess, the same Newton's laws solved without the small-angle shortcut, $T \\approx 2\\pi\\sqrt{L/g}\\,(1 + \\theta_0^2/16)$, passes again.

From two measurements you can guess an exponent directly: if $T \\propto L^n$, then $n = \\ln(T_2/T_1)/\\ln(L_2/L_1)$ — a [[?logarithm]] turns a power law into a straight line.

> [!warn] A fitted constant can hide a failure. Guess "T ∝ √L" with an adjustable constant, and large swings still fit — but the constant then implies the wrong g. Ask what a fitted number means before celebrating the fit.

> [!key] Guess, compute, compare. One sound disagreement kills a guess; no amount of agreement proves it. A law can be right within a range and fail outside it — which is how better laws are found.
`,
  ideas: [
    'New laws are found by guessing, computing the consequences, and comparing with experiment.',
    'A disagreement with a sound experiment proves a guess wrong, however beautiful the guess or famous its author.',
    'Agreement never proves a law; it only survives until a better or different experiment tests it.',
    'A theory that can be adjusted to fit anything predicts nothing and cannot be tested.',
    'Measure disagreements in standard deviations; a law may hold in one range and fail in another.'
  ],
  pitfalls: [
    'Scientists deduce laws from the data by a fixed procedure — The law is guessed; the data only test the guess.',
    'Many agreeing experiments prove a law is true — They make it trustworthy in the range tested; one sound disagreement outweighs them.',
    'A good fit with adjustable constants confirms a theory — Enough adjustable constants fit anything; the test is a prediction made before the measurement, with nothing left to adjust.'
  ],
  formulas: [
    {
      name: 'Period of a pendulum (small swings)',
      expr: 'T = 2*pi*sqrt(L/g)', tex: 'T = 2\\pi\\sqrt{\\dfrac{L}{g}}',
      vars: {
        T: { name: 'period (one full swing, there and back)', q: 'time', unit: 's' },
        L: { name: 'length (pivot to centre of the bob)', q: 'length', unit: 'm', value: 1 },
        g: { const: 'g' }
      },
      note: 'For amplitudes up to about 10° the error is below 0.2 %; at 40° the true period is 3 % longer (multiply by about 1 + θ₀²/16).',
      stories: {
        T: 'What is the period of a pendulum {L} long?',
        L: 'How long must a pendulum be to swing with a period of {T}?'
      }
    },
    {
      name: 'An exponent from two measurements',
      expr: 'n = ln(T2/T1)/ln(L2/L1)', tex: 'n = \\dfrac{\\ln(T_2/T_1)}{\\ln(L_2/L_1)}',
      vars: {
        n: { name: 'exponent in T ∝ Lⁿ', tex: 'n', signed: true },
        T2: { name: 'second period', q: 'time', unit: 's', value: 2.006, tex: 'T_2' },
        T1: { name: 'first period', q: 'time', unit: 's', value: 1.003, tex: 'T_1' },
        L2: { name: 'second length', q: 'length', unit: 'm', value: 1, tex: 'L_2' },
        L1: { name: 'first length', q: 'length', unit: 'm', value: 0.25, tex: 'L_1' }
      },
      note: 'If T = C·Lⁿ, then ln T = ln C + n ln L: a straight line on log–log axes whose slope is n.',
      stories: {
        n: 'A pendulum {L1} long swings in {T1}; one {L2} long in {T2}. If T ∝ Lⁿ, what is n?',
        T2: 'If T ∝ Lⁿ with n = {n}, and a {L1} pendulum takes {T1}, how long does a {L2} one take?'
      }
    },
    {
      name: 'How far off, in standard deviations',
      expr: 'z = (xm - xp)/sigma', tex: 'z = \\dfrac{x_m - x_p}{\\sigma}',
      vars: {
        z: { name: 'discrepancy in standard deviations', tex: 'z', signed: true },
        xm: { name: 'measured value', q: 'time', unit: 's', value: 2.069, tex: 'x_m' },
        xp: { name: 'predicted value', q: 'time', unit: 's', value: 2.006, tex: 'x_p' },
        sigma: { name: 'uncertainty of the measurement', q: 'time', unit: 's', value: 0.005, tex: '\\sigma' }
      },
      note: 'Chance gives |z| > 1 about 32 % of the time, |z| > 2 about 5 %, |z| > 3 about 0.3 % (for Gaussian errors). The quantity can be anything; periods are used here.',
      stories: {
        z: 'A pendulum predicted to swing in {xp} is timed at {xm} with an uncertainty of {sigma}. How many standard deviations off is the prediction?',
        sigma: 'How precise must a timing be for a measured {xm} against a predicted {xp} to be {z} standard deviations off?'
      }
    }
  ],
  examples: [
    {
      title: 'Guessing the exponent',
      q: 'Pendulums of 0.25 m and 1.00 m are timed at 1.00 s and 2.01 s. Test the guesses T ∝ L and T ∝ √L.',
      steps: [
        'T ∝ L predicts that four times the length gives four times the period: 4.00 s. Measured: 2.01 s. Wrong.',
        'From the two points: $n = \\ln(2.01/1.00)/\\ln(1.00/0.25) = 0.698/1.386 = 0.504$.',
        'Close to ½: the guess T ∝ √L survives this test.'
      ],
      a: 'n ≈ 0.50: the period grows as the square root of the length.'
    },
    {
      title: 'A good law meets a better experiment',
      q: 'A 1.000 m pendulum released from 40° is timed at 2.069 s with an uncertainty of 0.005 s. Compare with $T = 2\\pi\\sqrt{L/g}$.',
      steps: [
        'Prediction: $2\\pi\\sqrt{1.000/9.807} = 2.006$ s.',
        '$z = (2.069 - 2.006)/0.005 = 12.6$: impossible as a fluke.',
        'The refined law: $2.006 \\times (1 + 0.698^2/16) = 2.006 \\times 1.0305 = 2.067$ s, within half a standard deviation of the measurement.'
      ],
      a: 'The small-swing law fails by 12.6σ at 40°; the large-swing correction restores agreement.'
    },
    {
      title: 'How small was Mercury\'s disagreement?',
      q: 'Mercury\'s orbit turns 43 arcseconds per century more than Newton\'s law predicts. Mercury\'s year is 88.0 days. How much extra turn is that per orbit?',
      steps: [
        'Orbits per century: $36\\,525/88.0 = 415$.',
        'Per orbit: $43/415 = 0.10$ arcseconds.'
      ],
      a: 'About 0.1″ per orbit — tiny, but real, and it was the crack through which general relativity came in.'
    }
  ],
  quiz: [
    { q: 'The predictions of a new theory disagree with a careful experiment that others have repeated. The theory was proposed by a famous physicist and is mathematically beautiful. Then…', choices: ['the theory is wrong', 'the experiment must be wrong', 'the theory should be kept because it is beautiful', 'both are equally right'], a: 0, why: 'Beauty and reputation do not count; a sound disagreement settles it.' },
    { q: 'A theory can be adjusted to explain any possible outcome of an experiment. This makes it…', choices: ['untestable, and so of no scientific use', 'very well confirmed', 'certainly true', 'a law of nature'], a: 0, why: 'A theory that forbids nothing makes no prediction that could fail — so it tells us nothing.' },
    { q: 'A law that has agreed with a thousand experiments is proven true.', a: false, why: 'It is well tested in the range explored; the next experiment, in a new range or with more precision, could still show a disagreement.' },
    { q: 'Making a pendulum four times longer doubles its period. This fits…', choices: ['T ∝ √L', 'T ∝ L', 'T ∝ L²', 'T independent of L'], a: 0, why: '√4 = 2.' },
    { q: 'By chance alone, how often does a measurement fall more than 2.5 standard deviations from the true value (Gaussian errors)?', choices: ['about 1 %', 'about 5 %', 'about 32 %', 'never'], a: 0, why: 'P(|z| > 2.5) = 1.2 %; for 2σ it is 4.6 %, for 1σ 32 %.' }
  ],
  problems: [
    { q: 'What is the period of a pendulum 0.80 m long (small swings)?', answer: 1.79, unit: 's', tol: 0.02, hint: 'T = 2π√(L/g).',
      steps: ['$T = 2\\pi\\sqrt{0.80/9.81} = 2\\pi \\times 0.2856 = 1.79$ s.'] },
    { q: 'Two pendulums, 0.50 m and 2.00 m long, take 1.42 s and 2.84 s. If T ∝ Lⁿ, what is n?', answer: 0.5, tol: 0.02, hint: 'n = ln(T₂/T₁)/ln(L₂/L₁).',
      steps: ['$n = \\ln(2.84/1.42)/\\ln(2.00/0.50) = \\ln 2/\\ln 4 = 0.5$.'] }
  ],
  applications: [
    'Engineering prototypes test design calculations the same way: predict, build, measure, and trust the measurement when they disagree.',
    'Particle physicists announce a discovery only when the disagreement with the no-new-particle prediction exceeds 5σ (the Higgs boson, 2012).',
    'Clinical trials fix their predictions and analysis in advance, so that the comparison with nature is honest.'
  ],
  history: 'Galileo noticed around 1602 that a pendulum\'s period hardly depends on the size of its swing; Christiaan Huygens derived T = 2π√(L/g) and built the first pendulum clock (1656; published in 1673), and found that the period does grow with the amplitude on an ordinary circular arc. Urbain Le Verrier reported Mercury\'s anomalous precession in 1859; Einstein explained it in 1915.',
  sources: [
    '*The Character of Physical Law*, lecture 7 ("Seeking New Laws"; Messenger Lectures, Cornell, 1964) — guess, compute the consequences, compare with experiment; why vague theories cannot be tested; why a law is never proved right; how equivalent formulations help the guessing.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 1 (Atoms in Motion), section 1-1 — the course begins by making experiment the test of all our knowledge.'
  ],
  sim: 'way-guess-compare'
},

{
  id: 'doubt-and-uncertainty', parent: 'scientific-attitude', title: 'Doubt, uncertainty and the pleasure of finding things out', level: 1,
  short: 'Scientific knowledge is a collection of statements held with different degrees of certainty — never absolute. Doubt is not a weakness but the engine of learning: evidence narrows uncertainty as the square root of its amount, and a mind that allows no doubt can never learn.',
  keywords: ['doubt', 'uncertainty', 'degrees of certainty', 'not knowing', 'pleasure of finding things out', 'Bayes', 'prior', 'evidence', 'square root of N', 'standard error', 'margin of error', 'confidence', 'value of science', 'curiosity'],
  prereq: ['seeking-new-laws', 'probability-feyn', 'math:standard-deviation'],
  related: ['cargo-cult-science', 'knowing-vs-naming', 'quantum-reality', 'feynman-life', 'math:bayes-theorem', 'math:error-propagation', 'math:binomial-distribution'],
  body: `
In the 1981 BBC interview that gave its name to *The Pleasure of Finding Things Out*, and in talks throughout his life, Feynman described doubt not as a weakness to be overcome but as the natural state of a scientist — and a comfortable one. He was happy to say he did not know, and he thought it far better to hold a question open than to settle it with an answer that might be false.

### Knowledge with degrees of certainty
In his view, scientific knowledge is a body of statements held with different degrees of confidence: some very nearly certain, some likely, some doubtful — and none absolutely certain. This is not a defect. To discover something new you have to allow that what you have might be wrong; otherwise there is nothing to look for. He also stressed that the freedom to doubt was won, historically, in a hard struggle against authority, and is worth defending.

### How much evidence makes you sure?
Degrees of certainty can be put into numbers. Suppose you want to know whether a coin is fair. After $N$ flips the fraction of heads $\\hat p$ is uncertain by about one [[?standard-deviation|standard deviation]]

$$\\sigma = \\sqrt{\\frac{p(1-p)}{N}}$$

| Flips $N$ | Uncertainty of the heads fraction (fair coin) |
|---|---|
| 10 | ±16 % |
| 100 | ±5 % |
| 1000 | ±1.6 % |
| 10 000 | ±0.5 % |
| 1 000 000 | ±0.05 % |

To halve the uncertainty you need four times the data — the [[?square-root|square-root]] law of averaging, the same $\\sqrt N$ that governs a [[?random-walk]]. A coin biased 51 : 49 needs about ten thousand flips before the bias stands two standard deviations clear of chance. Certainty grows, but never reaches 100 %.

### Changing your mind by the right amount
There is an exact rule for how a degree of belief should change with evidence: Bayes' rule. You start with a *prior* — how likely you think each possibility is — and each result multiplies it by how well each possibility predicted that result. With an open mind, belief homes in on the truth as the data come in. A strong prior needs more evidence to move, which is reasonable. But a mind that gives *zero* [[?probability]] to being wrong can never learn: zero multiplied by anything is still zero. That is the arithmetic behind Feynman's attitude. Doubt keeps the door open.

> [!tip] In the simulation, flip a coin whose bias is hidden and watch your belief — a curve over all possible biases — narrow as the flips come in. Then try the "certain it is fair" prior with a biased coin: a thousand flips move it not at all.

### The pleasure of finding out
Feynman loved finding out how things work for its own sake. In *Surely You're Joking, Mr. Feynman!* he tells how, feeling burnt out at Cornell after the war, he decided to play with physics only for fun — and how working out the wobble of a plate someone tossed in the cafeteria led, in his telling, to the work on quantum electrodynamics for which he later shared the Nobel Prize. In the BBC interview he explained that honours meant little to him; what he valued was the discovery itself, and knowing that other people found the work useful.

> [!key] Everything we know is known with some degree of uncertainty. Evidence reduces it — as one over the square root of the amount of data — but never to zero, and only for a mind that leaves room for doubt.
`,
  ideas: [
    'Scientific knowledge is a set of statements with different degrees of certainty, none absolutely certain.',
    'Doubt is what makes discovery possible: to find something new you must allow that what you know may be wrong.',
    'Uncertainty from random errors shrinks as 1/√N: four times the data halves it.',
    'Beliefs should change by Bayes\' rule; a prior of zero (no doubt at all) can never be changed by evidence.',
    'For Feynman the reward of science was the pleasure of finding things out.'
  ],
  pitfalls: [
    'Science deals in proven certainties — It deals in well-tested statements with degrees of confidence; even the best established can in principle be overturned.',
    'Saying "I don\'t know" is a failure — It is the honest starting point of every investigation.',
    'Ten times the data makes a result ten times more precise — Random uncertainty shrinks as the square root: ten times the data gives about three times the precision.'
  ],
  formulas: [
    {
      name: 'Uncertainty of a measured proportion',
      expr: 'sigma = sqrt(p*(1-p)/N)', tex: '\\sigma = \\sqrt{\\dfrac{p(1-p)}{N}}',
      vars: {
        sigma: { name: 'uncertainty (one standard deviation)', q: 'ratio', unit: '%', tex: '\\sigma' },
        p: { name: 'proportion (heads, yes votes, …)', q: 'ratio', unit: '%', value: 30, min: 0, max: 100 },
        N: { name: 'number of trials', q: 'count', int: true, value: 100 }
      },
      note: 'The binomial standard error. About 68 % of repeated experiments land within ±σ of the true proportion, 95 % within ±2σ.',
      stories: {
        sigma: 'In {N} trials a proportion of about {p} is found. How uncertain is it?',
        N: 'How many trials are needed to measure a proportion near {p} to ±{sigma}?'
      }
    },
    {
      name: 'Trials needed to see a small bias',
      expr: 'N = k^2*p*(1-p)/delta^2', tex: 'N = \\dfrac{k^2\\, p(1-p)}{\\delta^2}',
      vars: {
        N: { name: 'number of trials needed', q: 'count' },
        k: { name: 'confidence, in standard deviations', value: 2, tex: 'k' },
        p: { name: 'proportion', q: 'ratio', unit: '%', value: 40, min: 0, max: 100 },
        delta: { name: 'size of the effect to detect', q: 'ratio', unit: '%', value: 1, tex: '\\delta' }
      },
      note: 'Set the effect δ equal to k standard errors and solve for N. Halving the effect needs four times the trials.',
      stories: {
        N: 'A proportion is near {p}. How many trials are needed to see a shift of {delta} at {k} standard deviations?',
        delta: 'With {N} trials near {p}, what is the smallest shift visible at {k} standard deviations?'
      }
    },
    {
      name: 'Averaging repeated measurements',
      expr: 'sm = s/sqrt(N)', tex: '\\sigma_{\\bar x} = \\dfrac{\\sigma}{\\sqrt{N}}',
      vars: {
        sm: { name: 'uncertainty of the average', q: 'time', unit: 's', tex: '\\sigma_{\\bar x}' },
        s: { name: 'spread of single measurements', q: 'time', unit: 's', value: 0.1, tex: '\\sigma' },
        N: { name: 'number of measurements', q: 'count', int: true, value: 25 }
      },
      note: 'For independent random errors only. A systematic error (a stopwatch that runs fast) does not average away.',
      stories: {
        sm: 'Single stopwatch timings scatter by {s}. How uncertain is the average of {N} of them?',
        N: 'Timings scatter by {s}. How many must be averaged to get the uncertainty down to {sm}?'
      }
    }
  ],
  examples: [
    {
      title: 'Is the coin fair?',
      q: 'A coin gives 58 heads in 100 flips. Another trial gives 5800 heads in 10 000 flips. How sure can you be that the coin is biased?',
      steps: [
        '100 flips: $\\sigma = \\sqrt{0.25/100} = 0.05$. The excess $0.58 - 0.50 = 0.08$ is $1.6\\sigma$ — chance does that about one time in nine. Not convincing.',
        '10 000 flips: $\\sigma = \\sqrt{0.25/10\\,000} = 0.005$. The excess is $0.08/0.005 = 16\\sigma$ — no fair coin would ever do it.'
      ],
      a: 'The same 58 % means little after 100 flips and is overwhelming after 10 000: certainty grows with √N.'
    },
    {
      title: 'Detecting a 51 : 49 coin',
      q: 'How many flips are needed for a bias of 1 percentage point (51 % heads) to show at two standard deviations?',
      steps: [
        '$N = k^2 p(1-p)/\\delta^2 = 4 \\times 0.25/0.01^2$.',
        '$N = 1.0/10^{-4} = 10\\,000$.'
      ],
      a: 'About ten thousand flips.'
    },
    {
      title: 'Averaging away reaction time',
      q: 'Your stopwatch timings of a pendulum scatter by 0.1 s (reaction time). How precise is the average of 25 timings? Of 100?',
      steps: [
        '$\\sigma_{\\bar x} = 0.1/\\sqrt{25} = 0.02$ s.',
        '$0.1/\\sqrt{100} = 0.01$ s — four times the work for twice the precision.'
      ],
      a: '0.02 s and 0.01 s — as long as the errors are random and not systematic.'
    }
  ],
  quiz: [
    { q: 'To make an average twice as precise (half the random uncertainty), you need…', choices: ['four times as many measurements', 'twice as many measurements', '1.41 times as many measurements', 'a different instrument, since averaging cannot help'], a: 0, why: 'The uncertainty goes as 1/√N; halving it needs N four times larger.' },
    { q: 'A result confirmed by many independent experiments is absolutely certain.', a: false, why: 'It is very well established — often good enough to bet your life on — but not absolutely certain; a new range or precision may still show a crack.' },
    { q: 'Someone is 100 % certain a coin is fair. It then gives 700 heads in 1000 flips. If they update by Bayes\' rule, their belief that it is fair becomes…', choices: ['still 100 %', 'about 50 %', 'almost 0 %', 'exactly 70 %'], a: 0, why: 'A probability of 1 for "fair" means probability 0 for every alternative; multiplying 0 by any likelihood leaves 0. No evidence can move a mind with no doubt.' },
    { q: 'In Feynman\'s view, what makes it possible to discover something new?', choices: ['doubting what we already know', 'trusting the established authorities', 'memorising the known laws', 'avoiding questions without answers'], a: 0, why: 'If nothing could be wrong there would be nothing new to find; doubt is the opening.' },
    { q: 'A coin gives 220 heads in 400 flips. How many standard deviations is that from a fair coin?', answer: 2, why: 'σ = √(0.25/400) = 0.025; the excess 0.55 − 0.50 = 0.05 is 2σ — suggestive, not conclusive.' }
  ],
  problems: [
    { q: 'A survey of 1000 people finds 40 % in favour. What is the uncertainty (one standard deviation) of that 40 %, in percentage points?', answer: 1.55, unit: '%', tol: 0.02, hint: 'σ = √(p(1−p)/N).',
      steps: ['$\\sigma = \\sqrt{0.40 \\times 0.60/1000} = \\sqrt{2.4\\times10^{-4}} = 0.0155$ = 1.55 percentage points.', 'The usual "margin of error" of ±3 % is about 2σ.'] },
    { q: 'How many flips are needed to see a 55 : 45 coin at three standard deviations (use p = 0.5)?', answer: 900, tol: 0.02, hint: 'N = k²p(1−p)/δ² with δ = 0.05.',
      steps: ['$N = 9 \\times 0.25/0.05^2 = 2.25/0.0025 = 900$.'] }
  ],
  applications: [
    'The "margin of error" of an opinion poll is about 2σ = 2√(p(1−p)/N): roughly ±3 % for 1000 people.',
    'Clinical trials and A/B tests are sized in advance with the same formula, so that a real effect of a given size can be seen.',
    'Laboratory results are reported with their uncertainty — a number without one says nothing about how much to trust it.'
  ],
  history: 'Thomas Bayes\'s rule for updating probabilities was published after his death, in 1763; Pierre-Simon Laplace developed it into a general method (1774–1812). Feynman\'s address "The Value of Science" (1955) made the case that the scientist\'s experience of doubt and uncertainty is of value far beyond science; he returned to it in public lectures in 1963, published as *The Meaning of It All* (1998).',
  sources: [
    '*The Pleasure of Finding Things Out* (BBC Horizon interview, 1981; essay collection, 1999) — living with doubt and not knowing, and the pleasure of discovery as the real reward.',
    '*The Meaning of It All* (1998; three public lectures of 1963), lecture 1, "The Uncertainty of Science" — scientific knowledge as statements of varying degrees of certainty.',
    '*What Do You Care What Other People Think?* (1988), epilogue "The Value of Science" (an address of 1955) — the value of doubt and the freedom to doubt.',
    '*Surely You\'re Joking, Mr. Feynman!* (1985), "The Dignified Professor" — doing physics for fun again, and the wobbling plate at Cornell.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 6 (Probability) — fluctuations, the random walk and the √N rule.'
  ],
  sim: 'way-how-sure'
},

{
  id: 'knowing-vs-naming', parent: 'scientific-attitude', title: 'Knowing the name versus knowing something', level: 1,
  short: 'Knowing what a thing is called is not knowing anything about it. Feynman learned this from his father, who taught him to watch what a bird does rather than collect its names, and who told him that "inertia" names a rule nobody can explain. Understanding means being able to use an idea — to predict with it.',
  keywords: ['names', 'understanding', 'inertia', 'ball in the wagon', 'father', 'bird', 'memorising', 'energy makes it go', 'textbooks', 'Brazil', 'rolling', 'friction', 'moment of inertia', 'explanation', 'definition'],
  prereq: ['atomic-hypothesis', 'physics:newtons-first-law', 'physics:rolling-motion'],
  related: ['doubt-and-uncertainty', 'cargo-cult-science', 'conservation-of-energy', 'characteristics-of-force', 'feynman-life', 'physics:friction', 'physics:moment-of-inertia'],
  body: `
Feynman's father, Melville, sold uniforms for a living, but he had a scientist's way of looking at the world and passed it on to his son. Two of his lessons, which Feynman told in *What Do You Care What Other People Think?* and in the BBC interview *The Pleasure of Finding Things Out*, are about the difference between a name and an understanding.

### The bird
When another child teased young Richard for not knowing the name of a bird, his father's point was that a name is only a label people have agreed on. The same bird has a different name in every language; you can collect all of them and still know nothing about the bird itself. What is worth knowing is what it *does* — why it picks at its feathers, where it goes, what it eats — and that you find out by watching and asking why.

### The ball in the wagon
Richard noticed that when he pulled his toy wagon forward, a ball lying in it rolled to the back; when he stopped the wagon, the ball rolled to the front. He asked why. His father told him that nobody knows: there is a general rule that moving things tend to keep moving and things at rest tend to stay put, and people call that tendency *inertia* — but the name is not a reason. Then he added an observation: look from the side, and you will see that the ball does not really move backwards. It moves forwards a little; the wagon moves forwards faster, underneath it.

That observation is knowledge — and physics can make it exact. Friction at the bottom of the ball is the only horizontal force on it. If the wagon accelerates at $A$ and the ball rolls without slipping, the ball's acceleration relative to the ground comes out as

$$a = \\frac{k}{1+k}\\,A, \\qquad k = \\frac{I}{mR^2}$$

where $I$ is the ball's moment of inertia about its centre; $k = 2/5$ for a solid ball. So the ball moves forwards at $\\tfrac27 A$ over the ground, while relative to the wagon it slides back at $\\tfrac57 A$. A hollow ball ($k = 2/3$) is dragged along more; on a frictionless floor ($k$ irrelevant, no force) it would stay exactly where it was. These are [[?proportional|proportions]] you can check — the name "inertia" predicts none of them.

> [!tip] In the wagon simulation, pull and then stop the wagon, and watch the ball both from the ground (with the fence posts) and from the wagon. The trail of dots shows where the ball really goes. Change the ball, or make the floor icy.

### Words that sound like explanations
Feynman kept meeting the same confusion. Reviewing school textbooks in California in the 1960s, he objected to one that answered every "what makes it go?" with the word *energy* — which explains nothing until you know how energy is counted, how it changes form and that the total stays the same. Teaching in Brazil in the early 1950s, he met students who could recite definitions word-perfectly yet did not recognise the phenomena those words described when they were in front of them. (Both stories are in *Surely You're Joking, Mr. Feynman!*.) In the *Lectures* he was careful to say that physics does not know what energy *is* — only that a certain number, computed from many formulas, never changes — and that Newton's $F = ma$ would say nothing at all if it were merely the definition of force: its content lies in the separate laws that say what the forces are.

### Tests of knowing
- Can you say it without the special word?
- Can you predict something with it — a number, a direction, what happens if you change something?
- Would you recognise it in a situation you have never seen?

> [!key] A name is a label; knowledge is being able to use an idea — to predict, to calculate, to recognise it in a new place. "Inertia" is a name; "the ball moves forwards at 2/7 of the wagon's acceleration" is knowledge.
`,
  ideas: [
    'Knowing the name of something tells you nothing about how it behaves.',
    'Inertia is a name for the observed rule that things keep their motion; the name is not an explanation of the rule.',
    'On an accelerating wagon, a rolling ball moves forwards over the ground; it only seems to roll back because the wagon moves faster.',
    'Energy is not a thing we can picture; it is a number that stays the same — knowing that is knowing something, saying "energy makes it go" is not.',
    'Understanding shows in using an idea: predicting with it and recognising it in new situations.'
  ],
  pitfalls: [
    'The ball in a wagon that is pulled forwards moves backwards — Relative to the ground it moves slightly forwards (friction drags it); the wagon moves forwards faster under it.',
    'Once you know the technical term, you understand the phenomenon — The term is a label; understanding means you can predict and explain with it.',
    'F = ma is only the definition of force — As a mere definition it would say nothing; its power comes with the force laws (gravity, springs, friction) that say independently what F is.'
  ],
  formulas: [
    {
      name: 'A ball rolling on an accelerating wagon: its motion over the ground',
      expr: 'a = A*k/(1 + k)', tex: 'a = \\dfrac{k}{1+k}\\,A',
      vars: {
        a: { name: 'ball\'s acceleration relative to the ground', q: 'accel', unit: 'm/s²' },
        A: { name: 'wagon\'s acceleration', q: 'accel', unit: 'm/s²', value: 2 },
        k: { name: 'shape factor I/(mR²): 2/5 solid ball, 2/3 hollow ball, 1/2 cylinder', value: 0.4, min: 0, max: 1 }
      },
      note: 'Rolling without slipping. Forwards, in the same direction as the wagon, but slower. With no friction at all the ball would not accelerate.',
      stories: {
        a: 'A wagon accelerates at {A}. A ball with shape factor {k} rolls on it without slipping. How fast does the ball accelerate over the ground?',
        k: 'On a wagon accelerating at {A}, a rolling object accelerates at {a} over the ground. What is its shape factor I/(mR²)?'
      }
    },
    {
      name: 'The same ball seen from the wagon',
      expr: 'ar = A/(1 + k)', tex: 'a_{\\mathrm{rel}} = \\dfrac{A}{1+k}',
      vars: {
        ar: { name: 'ball\'s acceleration backwards, relative to the wagon', q: 'accel', unit: 'm/s²', tex: 'a_{\\mathrm{rel}}' },
        A: { name: 'wagon\'s acceleration', q: 'accel', unit: 'm/s²', value: 2 },
        k: { name: 'shape factor I/(mR²)', value: 0.4, min: 0, max: 1 }
      },
      note: 'The wagon\'s acceleration minus the ball\'s: A − kA/(1+k) = A/(1+k). This backwards motion is what the child sees.',
      stories: {
        ar: 'A wagon accelerates at {A}. How fast does a ball with shape factor {k} accelerate towards the back, as seen by someone riding the wagon?'
      }
    },
    {
      name: 'Friction needed for the ball to roll',
      expr: 'mu = A*k/((1 + k)*g)', tex: '\\mu = \\dfrac{k\\,A}{(1+k)\\,g}',
      vars: {
        mu: { name: 'smallest coefficient of static friction', tex: '\\mu' },
        A: { name: 'wagon\'s acceleration', q: 'accel', unit: 'm/s²', value: 2 },
        k: { name: 'shape factor I/(mR²)', value: 0.4, min: 0, max: 1 },
        g: { const: 'g' }
      },
      note: 'Friction must supply m·a = m·kA/(1+k) and can give at most μmg. Below this μ the ball slides and skids.',
      stories: {
        mu: 'What friction coefficient is needed for a ball with shape factor {k} to roll on a wagon accelerating at {A}?',
        A: 'With friction coefficient {mu}, how hard can the wagon accelerate before a ball with shape factor {k} starts to skid?'
      }
    }
  ],
  derivation: {
    title: 'Why the ball moves forwards at 2/7 of the wagon\'s acceleration',
    steps: [
      { text: 'Only one horizontal force acts on the ball: friction $f$ at its bottom, from the wagon floor. It speeds the ball\'s centre up:', tex: 'm a = f' },
      { text: 'The same force, acting at radius $R$ below the centre, changes the spin. With $\\omega$ counted positive when the ball rolls forwards (clockwise as drawn, wagon moving right), friction pointing forwards slows that spin:', tex: 'I\\,\\dot\\omega = -f R' },
      { text: 'Rolling without slipping: the bottom of the ball moves with the wagon floor, so centre speed minus $\\omega R$ equals the wagon\'s speed $V$. Differentiate once in time:', tex: 'a - \\dot\\omega R = A' },
      { text: 'Put in the first two lines: $f/m + fR^2/I = A$. Solve for $f$ and then for $a = f/m$, writing $I = k\\,mR^2$:', tex: 'a = \\frac{A}{1 + \\dfrac{mR^2}{I}} = \\frac{k}{1+k}\\,A' },
      { text: 'For a solid ball $k = 2/5$, so $a = (2/5)/(7/5)\\,A = \\tfrac27 A$ forwards over the ground, and $A - a = \\tfrac57 A$ backwards relative to the wagon.' }
    ]
  },
  examples: [
    {
      title: 'Pulling the wagon',
      q: 'A wagon accelerates at 1.5 m/s² for 1.0 s, starting from rest. A solid ball rolls on it without slipping. How far do the wagon and the ball move over the ground, and how far does the ball move relative to the wagon?',
      steps: [
        'Wagon: $\\tfrac12 A t^2 = \\tfrac12 \\times 1.5 \\times 1.0^2 = 0.75$ m.',
        'Ball: $a = \\tfrac27 \\times 1.5 = 0.43$ m/s², so $\\tfrac12 \\times 0.43 \\times 1.0^2 = 0.21$ m forwards.',
        'Relative to the wagon: $0.75 - 0.21 = 0.54$ m towards the back.'
      ],
      a: 'The wagon goes 0.75 m, the ball 0.21 m forwards; the child sees the ball roll 0.54 m back.'
    },
    {
      title: 'A hollow ball and a sliding block',
      q: 'On the same wagon (A = 1.5 m/s²), how fast does a hollow ball (k = 2/3) accelerate over the ground? And a small box that slides with friction coefficient 0.05?',
      steps: [
        'Hollow ball: $a = (2/3)/(5/3) \\times 1.5 = 0.4 \\times 1.5 = 0.60$ m/s².',
        'Box: it would need 1.5 m/s² to keep up but friction can give at most $\\mu g = 0.05 \\times 9.81 = 0.49$ m/s²; it slides back and accelerates at 0.49 m/s².'
      ],
      a: '0.60 m/s² for the hollow ball, 0.49 m/s² for the sliding box — both forwards over the ground.'
    },
    {
      title: 'How much friction does it take?',
      q: 'What friction coefficient keeps a solid ball rolling on a wagon accelerating at 2.0 m/s²?',
      steps: [
        '$\\mu = kA/((1+k)g) = \\tfrac27 \\times 2.0/9.81$.',
        '$\\mu = 0.571/9.81 = 0.058$.'
      ],
      a: 'Only 0.058 — almost any floor will do, which is why the ball rolls rather than slides.'
    }
  ],
  quiz: [
    { q: 'A child pulls a wagon forwards; a ball in it rolls towards the back. Relative to the ground, the ball…', choices: ['moves forwards, but more slowly than the wagon', 'moves backwards', 'stays exactly where it was', 'moves forwards faster than the wagon'], a: 0, why: 'Friction at its bottom drags it forwards (at 2/7 of the wagon\'s acceleration for a solid ball); it only seems to go back because the wagon goes faster.' },
    { q: 'Saying "the ball stays behind because of inertia" explains why moving things keep moving.', a: false, why: 'Inertia is the name of the observed rule. Nobody knows a deeper reason for it; the name only labels it.' },
    { q: 'Which shows that a student understands energy?', choices: ['predicting how high a ball will rise from its speed, and where the energy goes when it lands', 'reciting the definition word for word', 'knowing that the unit is the joule', 'answering "energy" to every "what makes it go?"'], a: 0, why: 'Understanding shows in using the idea — counting energy and predicting with it — not in the word.' },
    { q: 'A wagon accelerates at 7.0 m/s² and a solid ball rolls on it without slipping. What is the ball\'s acceleration over the ground?', answer: 2, unit: 'm/s²', why: 'a = (2/7) × 7.0 = 2.0 m/s², forwards.' },
    { q: 'A thin-walled pipe (k = 1) rolls on the accelerating wagon. Over the ground it accelerates at…', choices: ['half the wagon\'s acceleration', '2/7 of it', 'the same as the wagon', 'zero'], a: 0, why: 'k/(1+k) = 1/2: the more of its mass is far from the axis, the more of the wagon\'s motion the rolling object takes on.' }
  ],
  problems: [
    { q: 'A hollow ball (k = 2/3) rolls on a wagon accelerating at 3.0 m/s². What is its acceleration over the ground?', answer: 1.2, unit: 'm/s²', tol: 0.02, hint: 'a = A·k/(1 + k).',
      steps: ['$k/(1+k) = (2/3)/(5/3) = 0.4$.', '$a = 0.4 \\times 3.0 = 1.2$ m/s².'] },
    { q: 'What smallest friction coefficient lets a solid cylinder (k = 1/2) roll on a wagon accelerating at 3.0 m/s²?', answer: 0.102, tol: 0.02, hint: 'μ = kA/((1 + k)g).',
      steps: ['$\\mu = (0.5/1.5) \\times 3.0/9.81 = 1.0/9.81 = 0.102$.'] }
  ],
  applications: [
    'Unsecured loads in lorries and lifts behave like the ball in the wagon: they keep their motion while the vehicle changes speed.',
    'Rolling-versus-sliding calculations decide whether goods on conveyors and parts in feeders roll, slide or topple.',
    'Good teaching, and good engineering reviews, ask for predictions rather than definitions.'
  ],
  history: 'The principle of inertia was stated by Galileo (1630s) and made the first law of motion by Newton (1687). Feynman described the ball-in-the-wagon conversation with his father in the 1981 BBC interview and in *What Do You Care What Other People Think?* (1988). He taught in Brazil in 1951–52 and served on the California State Curriculum Commission reviewing mathematics textbooks in the 1960s.',
  sources: [
    '*What Do You Care What Other People Think?* (1988), "The Making of a Scientist" — his father, the names of a bird, and the ball in the wagon.',
    '*The Pleasure of Finding Things Out* (BBC Horizon interview, 1981) — the same stories told on film.',
    '*Surely You\'re Joking, Mr. Feynman!* (1985), "O Americano, Outra Vez!" (students in Brazil who had learned words without their meaning) and "Judging Books by Their Covers" (the school textbooks and "energy makes it go").',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 4 (Conservation of Energy), section 4-1 — energy as an abstract number that stays the same, not a thing we can picture.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 12 (Characteristics of Force) — why F = ma is more than a definition.'
  ],
  sim: 'way-wagon-ball'
},

{
  id: 'cargo-cult-science', parent: 'scientific-attitude', title: 'Cargo cult science and scientific integrity', level: 2,
  short: 'Research can copy every outward form of science and still miss its heart: an honesty that reports everything that could make a result wrong. The easiest person to fool is the one who wants the result — by stopping when the data look good, by showing only the best of many tries, by trusting numbers that agree with the last ones.',
  keywords: ['cargo cult science', 'integrity', 'honesty', 'fooling yourself', 'optional stopping', 'p-hacking', 'multiple comparisons', 'false positive', 'Millikan', 'oil drop', 'bandwagon', 'publication bias', 'replication', 'Challenger', 'preregistration', 'Bonferroni'],
  prereq: ['seeking-new-laws', 'doubt-and-uncertainty', 'math:hypothesis-testing'],
  related: ['challenger-o-ring', 'knowing-vs-naming', 'feynman-life', 'math:binomial-distribution', 'math:normal-distribution', 'medicine:clinical-trials', 'biology:experimental-design'],
  body: `
In June 1974 Feynman gave the commencement address at Caltech and called it "Cargo Cult Science". It took its title from an image. During the Second World War, people on some Pacific islands had watched aircraft land with wonderful goods. After the war, some of them built imitation airstrips, lit fires along them, and put a man in a wooden hut with carved pieces on his head like headphones — and waited for the planes. Everything had the right form. No planes came.

Feynman's point was that some research is like that. It has the outward forms of science — laboratories, measurements, statistics, journals — but lacks the one thing that makes science work.

### The missing ingredient
That thing is a special kind of integrity: honesty that goes further than not lying. When you report a result, report everything that could make it wrong — the other explanations you could not rule out, the checks that failed, the details someone else needs to repeat the work. When you propose a theory, give the facts that disagree with it as well as those that fit. And the first person to guard against is yourself: the one most easily fooled is the one who wants the result.

### How the numbers fool you
Two habits feel innocent and are not. Suppose there is **no real effect** — a perfectly fair coin — and you call a result a discovery when it is more than 1.96 [[?standard-deviation|standard deviations]] from chance (the usual 5 % threshold).

- **Stopping when it looks good.** Check the running result after every flip and stop the moment it crosses the line. A random walk wanders ([[?random-walk]]), and sooner or later it crosses: checking after each of 100 flips, about 37 % of fair coins get "discovered" to be biased.
- **Showing the best of many tries.** Run $k$ experiments, or $k$ analyses of one experiment, and report the best. The [[?probability]] that at least one crosses the line by chance is

$$P = 1 - (1-\\alpha)^k$$

| Protocol, with no real effect | Chance of a false discovery |
|---|---|
| number of trials fixed in advance, tested once | 5 % |
| stop as soon as it looks significant (checks after each of 100 trials) | about 37 % |
| best of 10 tries | 40 % |
| best of 20 tries | 64 % |

The honest protocol is simple to state: fix the number of measurements and the analysis before you look; report every trial, including the dull ones; and if you test $k$ things, demand $k$ times more of each (a threshold of $\\alpha/k$).

> [!tip] The fool-yourself simulation runs hundreds of experiments on a fair coin under each protocol and counts the "discoveries". The creep simulation replays a history of measurements of one constant, with honest experimenters and with experimenters who check harder when they disagree with the last published value.

### A wrong value that crept
Feynman's example was the charge of the electron. Robert Millikan's oil-drop measurement (1909–1913) came out slightly low — about 0.6 % — mainly because he used a wrong value for the viscosity of air. If you plot the later measurements against time, they climb towards the right value gradually instead of jumping to it. His explanation: when experimenters found a value well above Millikan's, they suspected their own apparatus and looked for faults until they found one; when they found a value close to his, they looked less hard. Each result was shaded towards the last, and a known error survived for years.

### Integrity outside the laboratory
The same honesty is owed to everyone who relies on the results. In 1986, investigating the loss of the Space Shuttle *Challenger*, Feynman found that working engineers put the chance of losing a shuttle on a flight at roughly 1 in 100, while management quoted about 1 in 100 000. At 1 in 100, the chance of at least one loss in 25 flights is $1 - 0.99^{25} = 22$ %; *Challenger* was lost on the twenty-fifth. His appendix to the commission's report argued that a technology can only succeed if its engineering numbers are honest, whatever they do to its image.

> [!key] Science works only with an honesty beyond not lying: report everything that could prove you wrong, fix your procedure before you see the data, count every try — and guard first against fooling yourself.
`,
  ideas: [
    'Cargo cult science copies the forms of research (apparatus, statistics, papers) without the integrity that makes it work.',
    'Scientific integrity means reporting everything that could make your result wrong, not only what supports it.',
    'Stopping when the data look good, or reporting the best of many tries, manufactures false discoveries.',
    'With k independent tries at level α, the chance of at least one false alarm is 1 − (1 − α)^k.',
    'Results shaded towards the previous value let a wrong number survive — as with the charge of the electron after Millikan.'
  ],
  pitfalls: [
    'Checking the data as they come in and stopping at significance is harmless if each test is done correctly — Repeated looks give the random walk many chances to cross the line; with checks after each of 100 trials, about 37 % of no-effect experiments "succeed".',
    'Leaving out the failed experiments is fine if the reported ones are done well — The reader then cannot know how many tries it took; the best of 20 no-effect tries looks significant 64 % of the time.',
    'Agreeing with the accepted value is a sign that an experiment is right — Agreement is exactly what an experimenter influenced by the accepted value would produce; each result must stand on its own checks.'
  ],
  formulas: [
    {
      name: 'At least one false alarm (or failure) in several tries',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1-p)^n',
      vars: {
        P: { name: 'chance of at least one', q: 'ratio', unit: '%' },
        p: { name: 'chance in a single try', q: 'ratio', unit: '%', value: 5, min: 0, max: 100 },
        n: { name: 'number of independent tries', q: 'count', int: true, value: 10 }
      },
      note: 'The chance that nothing happens in n independent tries is (1 − p)ⁿ; one minus that is the chance of at least one. The same rule gives false discoveries among many tests and accidents among many flights.',
      stories: {
        P: 'You test {n} unrelated hypotheses, each at a false-alarm rate of {p}, and none is true. What is the chance that at least one looks like a discovery?',
        n: 'Each flight has a {p} chance of disaster. After how many flights does the chance of at least one loss reach {P}?'
      }
    },
    {
      name: 'An honest threshold for many tests (Bonferroni)',
      expr: 'a = alpha/k', tex: '\\alpha_1 = \\dfrac{\\alpha}{k}',
      vars: {
        a: { name: 'threshold for each single test', q: 'ratio', unit: '%', tex: '\\alpha_1' },
        alpha: { name: 'acceptable overall false-alarm rate', q: 'ratio', unit: '%', value: 5, tex: '\\alpha' },
        k: { name: 'number of tests made', q: 'count', int: true, value: 20 }
      },
      note: 'Dividing the threshold by the number of tests keeps the overall chance of a false alarm at or below α (slightly conservative).',
      stories: {
        a: 'You will test {k} hypotheses and want at most a {alpha} chance of any false alarm. What threshold should each test use?'
      }
    }
  ],
  examples: [
    {
      title: 'Twenty colours of sweets',
      q: 'A study tests whether any of 20 colours of a sweet is linked to headaches, each test at the 5 % level. If none is, what is the chance of at least one "link"? What threshold would keep it at 5 %?',
      steps: [
        '$P = 1 - 0.95^{20} = 1 - 0.358 = 0.642$.',
        'Honest threshold: $\\alpha/k = 5\\ \\%/20 = 0.25$ % per test.',
        'Check: $1 - (1 - 0.0025)^{20} = 0.049$, just under 5 %.'
      ],
      a: 'A 64 % chance of a spurious link; a threshold of 0.25 % per colour brings it back to 4.9 %.'
    },
    {
      title: 'The Challenger estimates',
      q: 'Compare the chance of at least one loss in 25 shuttle flights if each flight has a risk of 1 in 100 (the engineers\' estimate) or 1 in 100 000 (management\'s).',
      steps: [
        '1 in 100: $1 - 0.99^{25} = 1 - 0.778 = 0.222$.',
        '1 in 100 000: $1 - (1 - 10^{-5})^{25} \\approx 25\\times10^{-5} = 0.025$ %.'
      ],
      a: '22 % against 0.025 % — a factor of nearly a thousand between the honest and the hopeful number.'
    },
    {
      title: 'How far did the electron\'s charge creep?',
      q: 'Millikan\'s 1913 value for the electron\'s charge was $4.774\\times10^{-10}$ esu; the modern value is $4.803\\times10^{-10}$ esu. By how much was he low, and how many of his own quoted uncertainties ($\\pm 0.009$) is that?',
      steps: [
        'Difference: $4.803 - 4.774 = 0.029$ in units of $10^{-10}$ esu, which is $0.029/4.803 = 0.6$ %.',
        'In his uncertainties: $0.029/0.009 = 3.2$ — well outside what he claimed, because the error was systematic (the viscosity of air), not random.'
      ],
      a: '0.6 % low, more than three of his quoted uncertainties: a systematic error that later experimenters were slow to leave behind.'
    }
  ],
  quiz: [
    { q: 'In Feynman\'s image, what did the islanders\' imitation airstrips lack?', choices: ['the essential thing — real aircraft and the system behind them — despite having every outward form', 'enough fires along the runway', 'a larger control tower', 'nothing: planes did come'], a: 0, why: 'Everything looked right, but the thing that makes planes land was missing — as honesty is missing from research that only imitates science.' },
    { q: 'You flip a fair coin, check after every flip whether heads are "significantly" ahead, and stop as soon as they are. Compared with deciding the number of flips in advance, your chance of a false discovery is…', choices: ['much higher', 'the same, 5 %', 'lower', 'zero, since the coin is fair'], a: 0, why: 'Every look is another chance for the wandering result to cross the line; with 100 looks about 37 % of fair coins are "found" biased.' },
    { q: 'Publishing only the experiments that "worked" is harmless as long as each one was carried out correctly.', a: false, why: 'The failures are part of the evidence; without them readers cannot tell a real effect from the best of many chance fluctuations.' },
    { q: 'Why did measurements of the electron\'s charge creep slowly towards the right value after Millikan?', choices: ['experimenters searched harder for errors when their results disagreed with the accepted value than when they agreed', 'the charge of the electron was changing', 'the apparatus kept improving by exactly the same amount each year', 'Millikan\'s value was correct'], a: 0, why: 'That was Feynman\'s explanation: results were shaded towards the previous one, so a systematic error lingered.' },
    { q: 'You try 5 independent analyses on data with no real effect, each at the 5 % level, and report the best. What is the chance (in %) that at least one looks significant?', answer: 22.6, unit: '%', why: '1 − 0.95⁵ = 1 − 0.774 = 0.226.' }
  ],
  problems: [
    { q: 'A laboratory tests 14 unrelated compounds, none of which works, each at the 5 % level. What is the chance (in %) that at least one appears to work?', answer: 51.2, unit: '%', tol: 0.02, hint: 'P = 1 − (1 − α)^k.',
      steps: ['$0.95^{14} = 0.488$.', '$P = 1 - 0.488 = 0.512$ = 51.2 %.'] },
    { q: 'If each flight had a 1-in-100 chance of disaster, after how many flights would the chance of at least one loss first exceed 50 %?', answer: 69, tol: 0.01, hint: 'Solve 1 − 0.99ⁿ > 0.5, i.e. n > ln 0.5 / ln 0.99.',
      steps: ['$n > \\ln 0.5/\\ln 0.99 = -0.6931/-0.01005 = 68.97$.', 'So on the 69th flight the chance first exceeds one half.'] }
  ],
  applications: [
    'Clinical trials must register their outcomes and analysis plans before they start, so that results cannot be chosen after the fact.',
    'Particle physicists use blind analyses — the region where a signal might be is hidden until the method is frozen.',
    'Safety engineering needs honest failure rates; optimistic numbers hide real risks, as the Challenger inquiry showed.',
    'Replication — repeating an experiment, ideally changing the conditions — catches what one laboratory\'s hopes may miss.'
  ],
  history: 'Robert Millikan measured the charge of the electron with oil drops in 1909–1913 (Nobel Prize 1923); X-ray measurements in the 1930s exposed the error in the viscosity of air he had used. Feynman\'s "Cargo Cult Science" was the 1974 Caltech commencement address. In 1986 he served on the Rogers Commission investigating the Challenger disaster and wrote its Appendix F on the reliability of the shuttle. Registration of clinical trials before they begin became a condition of publication in leading medical journals in 2005.',
  sources: [
    '"Cargo Cult Science" (Caltech commencement address, 1974), printed as the last chapter of *Surely You\'re Joking, Mr. Feynman!* (1985) — the imitation airstrips, scientific integrity, not fooling yourself, the history of the electron\'s charge after Millikan, and the rats in the maze.',
    '"Personal observations on the reliability of the Shuttle", Appendix F of the Rogers Commission report (1986) — the engineers\' and the managers\' estimates of the chance of failure.',
    '*What Do You Care What Other People Think?* (1988), part 2, "Mr. Feynman Goes to Washington" — the Challenger investigation from the inside.'
  ],
  sim: ['way-fool-yourself', 'way-creep']
}

);
