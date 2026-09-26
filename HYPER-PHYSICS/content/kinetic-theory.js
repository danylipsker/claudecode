/* HYPER-PHYSICS · content/kinetic-theory.js — gases: the ideal gas law, and the molecular
 * motion behind it (pressure from collisions, the speed distribution, equipartition,
 * mean free path). */
Hyper.add(

{
  id: 'ideal-gas-law', parent: 'kinetic-theory', title: 'The ideal gas law', level: 1,
  short: 'Pressure, volume, temperature and amount of a gas are tied together by one simple equation, pV = nRT, which holds well for most gases at everyday conditions.',
  keywords: ['ideal gas law', 'pV = nRT', 'equation of state', 'Boyle\'s law', 'Charles\'s law', 'Gay-Lussac\'s law', 'Avogadro\'s law', 'gas constant', 'mole', 'molar volume', 'STP', 'combined gas law', 'gas density'],
  prereq: ['temperature', 'pressure', 'math:fractions-ratios'],
  related: ['kinetic-theory-gases', 'thermodynamic-processes', 'buoyancy', 'density'],
  body: `
Squeeze a sealed syringe and the air inside pushes back harder; warm a balloon and it swells; pump more air into a tyre and its pressure rises. Four quantities describe a sample of gas — its pressure $p$, volume $V$, absolute temperature $T$ and amount $n$ (in moles) — and remarkably, for almost any gas, they obey one equation:

$$pV = nRT, \\qquad R = 8.314\\ \\mathrm{J/(mol\\,K)}$$

$R$ is the **molar gas constant**. Counting molecules instead of moles, with $N = nN_A$,

$$pV = N k_B T$$

where $k_B = R/N_A = 1.381\\times10^{-23}$ J/K is the Boltzmann constant.

### The older laws inside it
The equation gathers up discoveries made over 150 years:
- **Boyle's law** (1662): at fixed $T$ and $n$, $pV$ is constant. Halve the volume, double the pressure.
- **Charles's law**: at fixed $p$, $V \\propto T$. A balloon taken into a freezer shrinks.
- **Gay-Lussac's law**: at fixed $V$, $p \\propto T$. Tyre pressure rises after a long drive.
- **Avogadro's law** (1811): at the same $p$ and $T$, equal volumes of any gases contain equal numbers of molecules.

For a fixed amount of gas the combination $pV/T$ stays constant, which gives the handy **combined gas law**, $p_1V_1/T_1 = p_2V_2/T_2$.

### Numbers worth knowing
One mole of any ideal gas at 0 °C and 1 atm fills 22.4 L; at 25 °C, 24.5 L. A room 5 m × 4 m × 2.5 m holds 50 m³ of air — about 2080 mol, or 60 kg. One cubic centimetre of air contains about $2.7\\times10^{19}$ molecules.

Since the mass of $n$ moles is $nM$ ($M$ the molar mass), the gas law also gives the **density** of a gas:

$$\\rho = \\frac{pM}{RT}$$

Air ($M = 29$ g/mol) at 20 °C has $\\rho = 1.20$ kg/m³; heated to 100 °C at the same pressure it drops to 0.95 kg/m³. That difference, 0.26 kg for every cubic metre, is what lifts a hot-air balloon ([[buoyancy]]).

### Why "ideal"?
The law treats molecules as points that do not attract each other. Real molecules take up a little room and attract weakly, so real gases deviate at high pressure or near the temperature at which they condense. At room conditions air obeys $pV = nRT$ to about 0.1 %; [[kinetic-theory-gases|kinetic theory]] explains why the law works at all.

> [!warn] Use **absolute** temperature (kelvin) and **absolute** pressure. A tyre gauge reads the pressure *above* atmospheric; add about 101 kPa (1.01 bar) before using the gas law.
`,
  ideas: [
    'pV = nRT links pressure, volume, absolute temperature and amount for an ideal gas.',
    'Boyle (pV constant), Charles (V ∝ T) and Gay-Lussac (p ∝ T) are special cases.',
    'Equal volumes of different gases at the same p and T hold equal numbers of molecules.',
    'One mole of gas at 0 °C and 1 atm fills 22.4 L.',
    'Temperatures must be in kelvin and pressures absolute.'
  ],
  pitfalls: [
    'Using °C in pV = nRT — The law needs absolute temperature. Heating from 10 °C to 20 °C raises the pressure by 3.5 %, not 100 %.',
    'Using gauge pressure — Tyre and cylinder gauges read the excess over atmospheric pressure; add about 101 kPa first.',
    'V is the volume of the molecules — It is the volume of the container they roam; at room conditions the molecules themselves fill less than a thousandth of it.'
  ],
  formulas: [
    {
      name: 'Ideal gas law (moles)',
      expr: 'p*V = n*R*T', tex: 'pV = nRT', solveFor: 'p',
      vars: {
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'kPa' },
        V: { name: 'volume', q: 'volume', unit: 'L', value: 24.5 },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        T: { name: 'absolute temperature', q: 'temperature', unit: '°C', value: 25 }
      },
      stories: {
        p: '{n} of gas is held in a {V} container at {T}. What is its pressure?',
        V: 'What volume does {n} of an ideal gas fill at {T} and {p}?',
        T: 'At what temperature does {n} of gas in {V} reach a pressure of {p}?',
        n: 'How many moles of air are there in a {V} room at {T} and {p}?'
      }
    },
    {
      name: 'Ideal gas law (molecules)',
      expr: 'p*V = N*kB*T', tex: 'pV = N k_B T', solveFor: 'N',
      vars: {
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'atm', value: 1 },
        V: { name: 'volume', q: 'volume', unit: 'cm³', value: 1 },
        N: { name: 'number of molecules', q: 'count' },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: '°C', value: 0 }
      },
      stories: {
        N: 'How many molecules are there in {V} of gas at {T} and {p}?',
        p: 'A vacuum chamber of {V} still contains {N} molecules at {T}. What is the pressure?'
      }
    },
    {
      name: 'Combined gas law (fixed amount)',
      expr: 'p1*V1/T1 = p2*V2/T2', tex: '\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}', solveFor: 'p2',
      vars: {
        p1: { name: 'starting pressure (absolute)', q: 'pressure', unit: 'kPa', value: 100 },
        V1: { name: 'starting volume', q: 'volume', unit: 'L', value: 1 },
        T1: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 20 },
        p2: { name: 'final pressure (absolute)', q: 'pressure', unit: 'kPa' },
        V2: { name: 'final volume', q: 'volume', unit: 'L', value: 0.5 },
        T2: { name: 'final temperature', q: 'temperature', unit: '°C', value: 60 }
      },
      practice: { unknowns: ['p2', 'V2', 'T2'] },
      stories: {
        p2: 'Air at {p1} and {T1} fills {V1}. It is squeezed to {V2} and warms to {T2}. What is its pressure now?',
        V2: 'A weather balloon holds {V1} of helium at {p1} and {T1}. What is its volume high up, at {p2} and {T2}?',
        T2: 'A gas at {p1}, {V1} and {T1} ends at {p2} and {V2}. What is its final temperature?'
      }
    },
    {
      name: 'Density of a gas',
      expr: 'rho = p*M/(R*T)', tex: '\\rho = \\frac{pM}{RT}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'kg/m³' },
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.96 },
        R: { const: 'R' },
        T: { name: 'absolute temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Dry air has M = 28.96 g/mol, helium 4.00, carbon dioxide 44.01.',
      stories: {
        rho: 'What is the density of a gas with molar mass {M} at {T} and {p}?',
        T: 'To what temperature must air ({M}) at {p} be heated to lower its density to {rho}?'
      }
    }
  ],
  examples: [
    {
      title: 'Tyre pressure after a drive',
      q: 'A tyre gauge reads 2.20 bar at 10 °C. After a motorway drive the air inside is at 40 °C. Assuming the volume barely changes, what does the gauge read now? (Atmospheric pressure is 1.013 bar.)',
      steps: [
        'Absolute pressure before: $p_1 = 2.20 + 1.013 = 3.213$ bar. Temperatures: 283.15 K and 313.15 K.',
        'Constant volume: $p_2 = p_1 \\dfrac{T_2}{T_1} = 3.213 \\times \\dfrac{313.15}{283.15} = 3.553$ bar.',
        'Gauge reading: $3.553 - 1.013 = 2.54$ bar. (Scaling the gauge value directly would give a wrong 2.43 bar.)'
      ],
      a: 'About 2.54 bar'
    },
    {
      title: 'Lift of a hot-air balloon',
      q: 'A hot-air balloon holds 2800 m³ of air at 100 °C; the outside air is at 20 °C and 101 kPa. What mass can it lift (envelope, basket and passengers together)?',
      steps: [
        'Outside air: $\\rho = \\dfrac{pM}{RT} = \\dfrac{101\\,325 \\times 0.02896}{8.314 \\times 293.15} = 1.204$ kg/m³.',
        'Inside, at the same pressure: $\\rho = 1.204 \\times 293.15/373.15 = 0.946$ kg/m³.',
        'Buoyancy supports the difference in the mass of air: $(1.204 - 0.946) \\times 2800 = 723$ kg.'
      ],
      a: 'About 720 kg in total'
    }
  ],
  quiz: [
    { q: 'A sealed can of gas is warmed from 20 °C to 40 °C. Its pressure…', choices: ['doubles', 'rises by about 7 %', 'rises by 20 %', 'stays the same'], a: 1,
      why: 'Pressure is proportional to absolute temperature: $313/293 = 1.068$.' },
    { q: 'At the same temperature and pressure, 1 L of helium and 1 L of carbon dioxide contain…', choices: ['the same mass', 'the same number of molecules', 'more helium molecules', 'more carbon dioxide molecules'], a: 1,
      why: 'Avogadro\'s law: $N = pV/k_BT$ depends only on $p$, $V$ and $T$, not on which gas it is. The masses differ elevenfold.' },
    { q: 'You halve the volume of a gas and double its absolute temperature. Its pressure becomes…', choices: ['the same', 'twice as large', 'four times as large', 'half as large'], a: 2,
      why: '$p = nRT/V$: doubling $T$ doubles $p$, halving $V$ doubles it again.' },
    { q: 'In $pV = nRT$ you may use the pressure shown on a tyre gauge.', a: false,
      why: 'Gauges show the pressure above atmospheric. The gas law needs absolute pressure, so add about 101 kPa.' },
    { q: 'A balloon is taken from a warm room (27 °C) into a freezer at −33 °C. Its volume (at constant pressure) becomes about…', choices: ['the same', '80 % of the original', 'a negative number', '−122 % of the original'], a: 1,
      why: 'Charles\'s law: $V \\propto T$, and $240/300 = 0.80$.' }
  ],
  applications: ['Tyre and diving-cylinder pressures, and why they change with temperature.', 'Weather balloons and hot-air balloons.', 'Airbags and chemical reactions that produce gas.', 'Every calculation of engines, compressors and refrigeration cycles.'],
  sim: 'heat-gas-box'
},

{
  id: 'kinetic-theory-gases', parent: 'kinetic-theory', title: 'Kinetic theory of gases', level: 2,
  short: 'A gas is a swarm of tiny molecules in random motion; their collisions with the walls make its pressure, and their average kinetic energy is its temperature.',
  keywords: ['kinetic theory', 'kinetic molecular theory', 'rms speed', 'root mean square speed', 'molecular speed', 'pressure from collisions', 'average kinetic energy', '3/2 kT', 'Boltzmann constant', 'Brownian motion', 'molecular motion'],
  prereq: ['ideal-gas-law', 'impulse', 'kinetic-energy'],
  related: ['maxwell-boltzmann', 'equipartition', 'mean-free-path', 'temperature', 'speed-of-sound'],
  body: `
Why should all gases, from hydrogen to xenon, obey the same simple law $pV = nRT$? Kinetic theory answers with a picture: a gas is a vast number of tiny molecules flying about at random, colliding with each other and with the walls of their container. Everything else follows from Newton's laws and some averaging.

### The model
1. The molecules are tiny compared with the distances between them.
2. They move randomly, obeying Newton's laws.
3. Their collisions with each other and with the walls are elastic.
4. They exert no forces on each other except during collisions.

### Pressure from collisions
A molecule of mass $m$ bouncing off a wall reverses the component of its velocity across the wall, $v_x$, handing the wall an [[impulse]] of $2mv_x$. Billions of such impacts every nanosecond add up to a steady push. Averaging over all the molecules (see the derivation) gives

$$p = \\tfrac13\\,\\frac{N}{V}\\, m\\,\\overline{v^2} = \\tfrac13\\,\\rho\\, v_{rms}^2$$

where $v_{rms} = \\sqrt{\\overline{v^2}}$ is the root-mean-square speed and $\\rho$ the gas density. Pressure grows as the *square* of the molecular speed, because a faster molecule both hits harder and hits more often.

### Temperature is molecular kinetic energy
Compare this with the ideal gas law $pV = Nk_BT$ and the two agree only if

$$\\tfrac12 m\\,\\overline{v^2} = \\tfrac32\\,k_B T$$

**Absolute temperature is a measure of the average translational kinetic energy of the molecules.** At room temperature that is $6.2\\times10^{-21}$ J per molecule, whatever the gas. It gives the rms speed

$$v_{rms} = \\sqrt{\\frac{3k_BT}{m}} = \\sqrt{\\frac{3RT}{M}}$$

| Gas, at 300 K | $M$ (g/mol) | $v_{rms}$ (m/s) |
|---|---|---|
| Hydrogen, H₂ | 2.0 | 1930 |
| Helium, He | 4.0 | 1370 |
| Nitrogen, N₂ | 28 | 517 |
| Oxygen, O₂ | 32 | 484 |
| Carbon dioxide, CO₂ | 44 | 412 |

At the same temperature, light molecules move fast and heavy ones slowly — four times faster for hydrogen than for oxygen, since the masses differ sixteenfold. The molecules of the air around you move at about 500 m/s, faster than sound (343 m/s), which is no coincidence: sound is carried by these same molecules, at $\\sqrt{\\gamma/3}\\,v_{rms}$ ([[speed-of-sound]]).

Not every molecule moves at $v_{rms}$: speeds are spread out in the [[maxwell-boltzmann|Maxwell–Boltzmann distribution]]. And although they are fast, they do not get far: in air each molecule collides billions of times a second ([[mean-free-path]]), which is why a smell takes a while to cross a room.

### Evidence you can see
In 1827 Robert Brown saw tiny particles inside pollen grains jiggling endlessly in water. In 1905 Einstein showed that this **Brownian motion** is the result of uneven bombardment by water molecules, and predicted how far the particles should wander. Jean Perrin's measurements in 1908 confirmed it and gave a value for Avogadro's number — convincing the last sceptics that atoms are real.
`,
  ideas: [
    'Gas pressure is the combined effect of countless molecular impacts on the walls.',
    'p = ⅓ρ v²rms: pressure grows with the square of molecular speed.',
    'Average translational kinetic energy per molecule is (3/2)k_BT: temperature measures molecular motion.',
    'v_rms = √(3RT/M): at the same temperature, lighter molecules move faster.',
    'Brownian motion is visible evidence of molecular bombardment.'
  ],
  pitfalls: [
    'Temperature is the speed of the molecules — It measures their average kinetic energy. At the same temperature heavy molecules move more slowly than light ones.',
    'Every molecule moves at the rms speed — Speeds are spread over a wide range; v_rms is one kind of average.',
    'Double the molecular speed, double the pressure — Each molecule would hit twice as hard and twice as often, so the pressure quadruples.'
  ],
  formulas: [
    {
      name: 'Average translational kinetic energy',
      expr: 'Ek = 3/2*kB*T', tex: '\\bar E_k = \\tfrac32\\, k_B T',
      vars: {
        Ek: { name: 'average kinetic energy per molecule', q: 'energy', unit: 'J', tex: '\\bar E_k' },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      stories: { Ek: 'What is the average translational kinetic energy of a molecule in a gas at {T}?', T: 'At what temperature is the average translational kinetic energy of a gas molecule {Ek}?' }
    },
    {
      name: 'Root-mean-square speed',
      expr: 'v = sqrt(3*R*T/M)', tex: 'v_{rms} = \\sqrt{\\frac{3RT}{M}}',
      vars: {
        v: { name: 'rms speed', q: 'speed', unit: 'm/s', tex: 'v_{rms}' },
        R: { const: 'R' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.01 }
      },
      stories: {
        v: 'What is the rms speed of gas molecules with molar mass {M} at {T}?',
        T: 'To what temperature must a gas with molar mass {M} be heated for its rms speed to reach {v}?',
        M: 'Molecules of an unknown gas at {T} have an rms speed of {v}. What is its molar mass?'
      }
    },
    {
      name: 'Pressure from molecular motion',
      expr: 'p = 1/3*rho*v^2', tex: 'p = \\tfrac13\\,\\rho\\, v_{rms}^2',
      vars: {
        p: { name: 'pressure', q: 'pressure', unit: 'kPa' },
        rho: { name: 'density of the gas', q: 'density', unit: 'kg/m³', value: 1.2 },
        v: { name: 'rms speed of the molecules', q: 'speed', unit: 'm/s', value: 500, tex: 'v_{rms}' }
      },
      stories: {
        p: 'A gas of density {rho} has molecules with an rms speed of {v}. What pressure does it exert?',
        v: 'Air of density {rho} is at a pressure of {p}. What is the rms speed of its molecules?'
      }
    }
  ],
  derivation: {
    title: 'Pressure from molecular impacts',
    steps: [
      { text: 'A molecule of mass $m$ in a box of length $L$ hits the end wall with velocity component $v_x$ and bounces back elastically. The wall receives an impulse:', tex: '\\Delta p_{wall} = 2 m v_x' },
      { text: 'It returns to the same wall after a round trip of $2L$, taking $2L/v_x$. So the average force it exerts is:', tex: 'F = \\frac{2 m v_x}{2L/v_x} = \\frac{m v_x^2}{L}' },
      { text: 'Add up all $N$ molecules and divide by the wall\'s area $A$; with $AL = V$:', tex: 'p = \\frac{N m\\, \\overline{v_x^2}}{AL} = \\frac{N m\\, \\overline{v_x^2}}{V}' },
      { text: 'Motion is random, so no direction is special: $\\overline{v_x^2} = \\overline{v_y^2} = \\overline{v_z^2} = \\overline{v^2}/3$.', tex: 'p = \\tfrac13\\,\\frac{N}{V}\\, m\\,\\overline{v^2}' },
      { text: 'Compare with $pV = Nk_BT$: the two agree when', tex: '\\tfrac12 m\\,\\overline{v^2} = \\tfrac32\\, k_B T' }
    ]
  },
  examples: [
    {
      title: 'How fast are air molecules?',
      q: 'Find the rms speeds of nitrogen (28.0 g/mol) and oxygen (32.0 g/mol) molecules at 20 °C.',
      steps: [
        '$T = 293.15$ K. Nitrogen: $v_{rms} = \\sqrt{3 \\times 8.314 \\times 293.15 / 0.0280} = 511$ m/s.',
        'Oxygen: $v_{rms} = \\sqrt{3 \\times 8.314 \\times 293.15 / 0.0320} = 478$ m/s.',
        'The ratio is $\\sqrt{32/28} = 1.07$: the lighter molecule is 7 % faster, while both have the same average kinetic energy.'
      ],
      a: 'About 511 m/s for N₂ and 478 m/s for O₂'
    },
    {
      title: 'Doubling the speed',
      q: 'A gas is at 27 °C. To what temperature must it be heated to double the rms speed of its molecules?',
      steps: [
        '$v_{rms} \\propto \\sqrt{T}$, so doubling the speed needs four times the absolute temperature.',
        '$T_2 = 4 \\times 300.15 = 1200.6$ K, which is about 927 °C.'
      ],
      a: 'About 1200 K (927 °C)'
    }
  ],
  quiz: [
    { q: 'At the same temperature, hydrogen (H₂) and oxygen (O₂) molecules have…', choices: ['the same rms speed', 'the same average kinetic energy, and hydrogen is 4 times faster', 'the same average kinetic energy, and hydrogen is 16 times faster', 'different average kinetic energies'], a: 1,
      why: 'Temperature fixes the average kinetic energy. With 16 times less mass, hydrogen needs $\\sqrt{16} = 4$ times the speed.' },
    { q: 'To double the rms speed of the molecules of a gas, its absolute temperature must be…', choices: ['doubled', 'multiplied by √2', 'multiplied by 4', 'halved'], a: 2,
      why: '$v_{rms} \\propto \\sqrt{T}$, so $T$ must rise fourfold.' },
    { q: 'If every molecule in a sealed box suddenly moved twice as fast, the pressure would…', choices: ['double', 'quadruple', 'stay the same', 'halve'], a: 1,
      why: 'Each molecule would hit twice as hard and twice as often: $p \\propto v^2$.' },
    { q: 'At the same temperature all the molecules of a gas move at the same speed.', a: false,
      why: 'Collisions constantly redistribute energy, so speeds are spread over a wide range (the Maxwell–Boltzmann distribution).' },
    { q: 'Which of these gases has the highest rms speed at 300 K?', choices: ['Nitrogen', 'Helium', 'Carbon dioxide', 'Argon'], a: 1,
      why: 'It has the smallest molar mass (4 g/mol), and $v_{rms} = \\sqrt{3RT/M}$.' }
  ],
  applications: ['Explaining gas pressure, diffusion and the speed of sound.', 'Separating isotopes by the different speeds of heavier and lighter molecules (gaseous diffusion and centrifuges).', 'Understanding why planets keep or lose their atmospheres.'],
  history: 'Daniel Bernoulli derived gas pressure from molecular impacts in 1738, a century before most physicists accepted atoms. Rudolf Clausius (1857), James Clerk Maxwell (1860) and Ludwig Boltzmann (from the 1870s) built kinetic theory into a quantitative science.',
  sim: 'heat-gas-box'
},

{
  id: 'maxwell-boltzmann', parent: 'kinetic-theory', title: 'Molecular speeds (Maxwell–Boltzmann)', level: 3,
  short: 'In a gas at temperature T the molecular speeds spread over a characteristic hump, with a long tail of fast molecules that drives evaporation, chemical reactions and the slow escape of atmospheres.',
  keywords: ['Maxwell-Boltzmann distribution', 'Maxwell–Boltzmann', 'speed distribution', 'most probable speed', 'mean speed', 'rms speed', 'Boltzmann factor', 'high-energy tail', 'Arrhenius', 'activation energy', 'atmospheric escape', 'Jeans escape'],
  prereq: ['kinetic-theory-gases', 'math:normal-distribution', 'math:exponential-functions'],
  related: ['equipartition', 'latent-heat', 'escape-velocity', 'mean-free-path', 'math:probability-basics'],
  body: `
Collisions never let the molecules of a gas share their energy evenly. Every collision hands energy from one molecule to another, and after a few collisions each the gas settles into a steady spread of speeds — the same spread every time for a given gas and temperature. James Clerk Maxwell found its shape in 1860; Ludwig Boltzmann put it on a general footing.

### From components to speeds
Each velocity component on its own is spread in a bell curve — a [[math:normal-distribution|normal distribution]] centred on zero, with variance $k_BT/m$:

$$f(v_x) = \\sqrt{\\frac{m}{2\\pi k_BT}}\\; e^{-m v_x^2/2k_BT}$$

The speed $v$ combines three such components. Two effects shape its distribution. The exponential, $e^{-mv^2/2k_BT}$, suppresses high kinetic energies. But the number of ways to have a speed $v$ grows like the surface of a sphere of radius $v$ in velocity space, $4\\pi v^2$, which suppresses very low speeds. Together:

$$f(v) = 4\\pi \\left(\\frac{m}{2\\pi k_BT}\\right)^{3/2} v^2\\, e^{-m v^2/2k_BT}$$

$f(v)\\,dv$ is the fraction of molecules with speeds between $v$ and $v + dv$; the area under the whole curve is 1. The curve rises from zero, peaks, and trails off in a long tail.

### Three typical speeds
$$v_p = \\sqrt{\\frac{2k_BT}{m}}, \\qquad \\bar v = \\sqrt{\\frac{8k_BT}{\\pi m}}, \\qquad v_{rms} = \\sqrt{\\frac{3k_BT}{m}}$$

The most probable speed (the peak), the mean, and the root-mean-square speed stand in the ratio 1 : 1.128 : 1.225. For nitrogen at 300 K they are 422, 476 and 517 m/s. Replace $k_B/m$ by $R/M$ to work with molar masses.

Heating the gas stretches the curve: the peak moves right as $\\sqrt T$ and drops (the area stays 1), and the high-speed tail swells enormously. A heavier gas has a narrower, slower curve.

### The tail matters
The fraction of molecules with energy well above $k_BT$ is governed by the **Boltzmann factor** $e^{-E/k_BT}$. More generally, in equilibrium the populations of two states differing in energy by $\\Delta E$ are in the ratio

$$\\frac{N_2}{N_1} = e^{-\\Delta E/k_BT}$$

This single factor explains a great deal:
- **Evaporation.** Only the fastest molecules escape a liquid, taking extra energy with them, so the liquid left behind cools ([[latent-heat]]).
- **Chemical reactions.** Molecules react only if they collide with more than an activation energy $E_a$. The fraction that do rises steeply with temperature: for $E_a \\approx 50$ kJ/mol, a 10 K rise near room temperature roughly doubles the rate — the cook's and the biologist's rule of thumb.
- **Leaking atmospheres.** A molecule in the thin upper atmosphere that is moving upwards faster than the [[escape-velocity|escape velocity]] (11.2 km/s for Earth) leaves for good. At about 1000 K up there, helium atoms have $v_{rms} \\approx 2.5$ km/s, so a small but steady fraction in the tail escapes; nitrogen, at under 1 km/s, is held for billions of years. A rough rule: a planet keeps a gas over the age of the Solar System if its escape velocity exceeds about six times the gas's rms speed. The Moon, with an escape velocity of only 2.4 km/s, has kept almost nothing.

Run the simulation: start every molecule at the same speed and watch collisions spread the spike into Maxwell's curve within a few collisions per molecule.
`,
  ideas: [
    'Collisions drive any gas to one characteristic speed distribution for its temperature.',
    'Each velocity component is normally distributed; the v² factor makes the speed distribution skewed, starting at zero.',
    'v_p : v̄ : v_rms = 1 : 1.128 : 1.225, all proportional to √(T/m).',
    'Higher temperature broadens the curve and shifts it to higher speeds; the area stays 1.',
    'The Boltzmann factor e^(−ΔE/kT) controls evaporation, reaction rates and atmospheric escape.'
  ],
  pitfalls: [
    'The peak of the curve is the average speed — The curve is lopsided with a long high-speed tail, so the mean lies above the most probable speed.',
    'Raising the temperature moves every molecule up by the same amount — The whole distribution stretches: it broadens as well as shifting, and the far tail grows by orders of magnitude.',
    'The speed distribution is a bell curve — Each velocity component is, but speed cannot be negative; the v² factor makes the speed distribution start at zero and lean to the left.'
  ],
  formulas: [
    {
      name: 'Most probable speed',
      expr: 'vp = sqrt(2*R*T/M)', tex: 'v_p = \\sqrt{\\frac{2RT}{M}}',
      vars: {
        vp: { name: 'most probable speed', q: 'speed', unit: 'm/s', tex: 'v_p' },
        R: { const: 'R' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.01 }
      },
      stories: { vp: 'At what speed is the peak of the speed distribution for a gas of molar mass {M} at {T}?' }
    },
    {
      name: 'Mean speed',
      expr: 'vm = sqrt(8*R*T/(pi*M))', tex: '\\bar v = \\sqrt{\\frac{8RT}{\\pi M}}',
      vars: {
        vm: { name: 'mean speed', q: 'speed', unit: 'm/s', tex: '\\bar v' },
        R: { const: 'R' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.01 }
      },
      stories: { vm: 'What is the mean speed of molecules of molar mass {M} at {T}?', T: 'At what temperature do helium atoms ({M}) have a mean speed of {vm}?' }
    },
    {
      name: 'Boltzmann factor',
      expr: 'f = exp(-dE/(kB*T))', tex: 'f = e^{-\\Delta E/k_B T}',
      vars: {
        f: { name: 'population ratio N₂/N₁ of a higher and a lower state' },
        dE: { name: 'energy difference between the states', q: 'energy', unit: 'eV', value: 0.1, tex: '\\Delta E' },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'For two single states in thermal equilibrium. At room temperature $k_BT \\approx 0.026$ eV.',
      stories: {
        f: 'Two molecular states differ in energy by {dE}. At {T}, what is the ratio of the number of molecules in the upper state to the number in the lower one?',
        T: 'At what temperature is a state {dE} above the ground state populated with a relative fraction of {f}?'
      }
    },
    {
      name: 'Speed-up of a reaction when the temperature rises',
      expr: 'S = exp(Ea/R*(1/T1 - 1/T2))', tex: 'S = \\frac{r_2}{r_1} = \\exp\\left[\\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)\\right]',
      vars: {
        S: { name: 'speed-up factor: ratio of reaction rates r₂/r₁' },
        Ea: { name: 'activation energy', unit: 'J/mol', value: 50000, tex: 'E_a' },
        R: { const: 'R' },
        T1: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 25 },
        T2: { name: 'higher temperature', q: 'temperature', unit: '°C', value: 35 }
      },
      note: 'The Arrhenius law: the fraction of collisions energetic enough to react follows the Boltzmann factor $e^{-E_a/RT}$.',
      practice: { unknowns: ['S', 'T2'] },
      stories: {
        S: 'A reaction has an activation energy of {Ea}. By what factor does it speed up when the temperature rises from {T1} to {T2}?',
        T2: 'A reaction with activation energy {Ea} runs at {T1}. To what temperature must it be heated to run {S} times faster?'
      }
    }
  ],
  derivation: {
    title: 'From three bell curves to Maxwell\'s distribution',
    steps: [
      { text: 'Each velocity component is independently normal with variance $k_BT/m$. The probability density for the velocity $(v_x, v_y, v_z)$ is their product, which depends only on the speed:', tex: 'g(\\vec v) = \\left(\\frac{m}{2\\pi k_BT}\\right)^{3/2} e^{-m(v_x^2+v_y^2+v_z^2)/2k_BT}' },
      { text: 'All velocities with speed between $v$ and $v + dv$ fill a thin spherical shell in velocity space, of volume $4\\pi v^2\\,dv$:', tex: 'f(v)\\,dv = g(v)\\, 4\\pi v^2\\, dv' },
      { text: 'So the speed distribution is', tex: 'f(v) = 4\\pi\\left(\\frac{m}{2\\pi k_BT}\\right)^{3/2} v^2\\, e^{-mv^2/2k_BT}' },
      { text: 'The peak is where $d(v^2 e^{-mv^2/2k_BT})/dv = 0$, i.e. $2v - v^3 m/k_BT = 0$:', tex: 'v_p = \\sqrt{\\frac{2k_BT}{m}}' },
      { text: 'Averages over $f(v)$ give $\\bar v = \\int_0^\\infty v f\\,dv = \\sqrt{8k_BT/\\pi m}$ and $\\overline{v^2} = 3k_BT/m$, consistent with $\\tfrac12 m\\overline{v^2} = \\tfrac32 k_BT$.' }
    ]
  },
  examples: [
    {
      title: 'Three speeds of nitrogen',
      q: 'Find the most probable, mean and rms speeds of nitrogen molecules (28.0 g/mol) at 300 K.',
      steps: [
        '$\\dfrac{RT}{M} = \\dfrac{8.314 \\times 300}{0.0280} = 89\\,080$ m²/s².',
        '$v_p = \\sqrt{2 \\times 89\\,080} = 422$ m/s.',
        '$\\bar v = \\sqrt{8 \\times 89\\,080/\\pi} = 476$ m/s.',
        '$v_{rms} = \\sqrt{3 \\times 89\\,080} = 517$ m/s.'
      ],
      a: '422, 476 and 517 m/s'
    },
    {
      title: 'Which gases can leave the Earth?',
      q: 'The upper atmosphere is at about 1000 K. Compare the rms speeds of helium (4.0 g/mol) and nitrogen (28 g/mol) there with Earth\'s escape velocity of 11.2 km/s.',
      steps: [
        'Helium: $v_{rms} = \\sqrt{3 \\times 8.314 \\times 1000/0.0040} = 2.50$ km/s, so $v_{esc}/v_{rms} = 4.5$.',
        'Nitrogen: $v_{rms} = \\sqrt{3 \\times 8.314 \\times 1000/0.028} = 0.94$ km/s, so $v_{esc}/v_{rms} = 11.9$.',
        'Escape needs the far tail of the distribution. For helium the tail reaching 11.2 km/s is small but real, and helium steadily leaks away; for nitrogen it is utterly negligible.'
      ],
      a: 'Helium leaks away slowly; nitrogen is held'
    }
  ],
  quiz: [
    { q: 'For a gas at a given temperature, which is largest?', choices: ['The most probable speed', 'The mean speed', 'The rms speed', 'They are all equal'], a: 2,
      why: 'The long high-speed tail pulls averages upwards, and squaring before averaging weights fast molecules even more: $v_p < \\bar v < v_{rms}$.' },
    { q: 'When a gas is heated, its speed-distribution curve…', choices: ['moves right and grows taller', 'moves right, broadens and becomes lower', 'moves left and narrows', 'keeps its shape but gets more area'], a: 1,
      why: 'All typical speeds grow as $\\sqrt T$. The area under the curve is always 1, so a wider curve must be lower.' },
    { q: 'Doubling the absolute temperature doubles the most probable speed.', a: false,
      why: '$v_p = \\sqrt{2k_BT/m}$, so it grows by a factor $\\sqrt 2 \\approx 1.41$.' },
    { q: 'Sweat cools you because evaporation removes…', choices: ['the slowest molecules', 'the fastest molecules, lowering the average kinetic energy of those left', 'salt from the skin', 'molecules at random, which has no effect on temperature'], a: 1,
      why: 'Only molecules in the high-speed tail can break free of the liquid surface. Losing them lowers the average energy of the remaining liquid.' },
    { q: 'At the same temperature, compared with helium, the speed distribution of xenon is…', choices: ['wider and centred at higher speed', 'narrower and centred at lower speed', 'identical', 'a different shape entirely'], a: 1,
      why: 'All speeds scale as $1/\\sqrt m$. Xenon is 33 times heavier, so its curve is about 5.7 times narrower and sits at lower speeds.' }
  ],
  applications: ['Reaction rates in chemistry and biology (the Arrhenius law).', 'Evaporative cooling, from sweat to cooling towers.', 'The loss of light gases from planetary atmospheres.', 'Doppler broadening of spectral lines, used to measure the temperatures of stars and plasmas.'],
  history: 'Maxwell derived the distribution in 1860 from symmetry arguments; Boltzmann (1868–1877) generalised it and showed why collisions drive any gas towards it. Direct measurements with molecular beams and rotating slotted discs confirmed it in the 1920s and 1950s.',
  sim: 'heat-maxwell'
},

{
  id: 'equipartition', parent: 'kinetic-theory', title: 'Equipartition of energy', level: 2,
  short: 'In thermal equilibrium every independent way a molecule can store energy quadratically gets, on average, the same ½k_BT — which predicts the heat capacities of gases and solids, and fails in revealing ways.',
  keywords: ['equipartition theorem', 'degrees of freedom', 'heat capacity of gases', 'Cv', 'Cp', 'gamma', 'adiabatic index', 'heat capacity ratio', 'monatomic', 'diatomic', 'Dulong-Petit', 'frozen degrees of freedom', '½kT'],
  prereq: ['kinetic-theory-gases', 'specific-heat'],
  related: ['heat-capacity-solids', 'thermodynamic-processes', 'maxwell-boltzmann', 'quantum-harmonic-oscillator', 'heat-internal-energy'],
  body: `
[[kinetic-theory-gases|Kinetic theory]] says the average translational kinetic energy of a molecule is $\\tfrac32 k_BT$. That is $\\tfrac12 k_BT$ for each of the three directions of motion, $\\tfrac12 m\\overline{v_x^2} = \\tfrac12 k_BT$ and so on. The **equipartition theorem** extends this: in thermal equilibrium, *every* independent term in a molecule's energy that is quadratic — proportional to the square of a velocity, an angular velocity or a displacement — holds on average the same share, $\\tfrac12 k_BT$. Collisions share energy out fairly among all the ways of storing it. Each such term is called a **degree of freedom**.

### Counting degrees of freedom
- **Monatomic gas** (helium, argon): three translations, $f = 3$. Internal energy $U = \\tfrac32 nRT$.
- **Diatomic gas** (nitrogen, oxygen) at room temperature: three translations plus two rotations about axes perpendicular to the bond, $f = 5$.
- **Vibration** of the bond adds two more (kinetic *and* potential energy of the spring), $f = 7$ — but only at high temperature.
- **Solid**: each atom vibrates in three directions, with kinetic and potential energy each, $f = 6$ per atom.

With $f$ degrees of freedom,

$$U = \\frac f2\\, nRT, \\qquad C_V = \\frac f2\\, R$$

and since heating at constant pressure also costs the work $nR\\,\\Delta T$ ([[thermodynamic-processes]]), $C_p = C_V + R$ and the heat capacity ratio is

$$\\gamma = \\frac{C_p}{C_V} = \\frac{f + 2}{f}$$

| | $f$ | $C_V$ predicted | measured | $\\gamma$ predicted | measured |
|---|---|---|---|---|---|
| Argon | 3 | 12.5 | 12.5 | 1.67 | 1.67 |
| Nitrogen | 5 | 20.8 | 20.8 | 1.40 | 1.40 |
| Copper (solid) | 6 | 24.9 | 24.4 | — | — |

(Heat capacities in J/(mol·K), at room temperature.) The solid result, $C \\approx 3R$ per mole of atoms, is the **Dulong–Petit law**, found by experiment in 1819. The value of $\\gamma$ for air, 1.40, sets the [[speed-of-sound|speed of sound]] and the heating in a diesel engine's compression stroke.

### Where it fails — and why that mattered
Equipartition has no temperature in it: it predicts heat capacities that never change. Yet as hydrogen is cooled below about 200 K its $C_V$ falls from $\\tfrac52 R$, reaching $\\tfrac32 R$ by about 50 K, as if its rotations had switched off; nitrogen's vibrations only join in above about a thousand kelvin; and the heat capacity of every solid drops towards zero near absolute zero. Maxwell called this the greatest difficulty facing the molecular theory.

The answer is quantum mechanics. Rotational and vibrational energies come in discrete steps ([[quantum-harmonic-oscillator]]). If the first step is much larger than $k_BT$, collisions almost never have enough energy to excite it, and that degree of freedom is **frozen out**. Rotation about the bond axis of a diatomic molecule is always frozen: the moment of inertia is so tiny that its levels are far apart. Einstein's 1907 explanation of the falling heat capacity of solids ([[heat-capacity-solids]]) was one of the first triumphs of quantum theory.

In the simulation, tick the helium–argon mixture and give all atoms one speed. The heavy argon atoms start with ten times the kinetic energy of the helium atoms; within a few collisions each both kinds carry the same average energy, and the light atoms move much faster.
`,
  ideas: [
    'In equilibrium each quadratic degree of freedom holds ½k_BT on average.',
    'Monatomic gases have f = 3, diatomic gases f = 5 at room temperature, solids f = 6 per atom.',
    'C_V = (f/2)R, C_p = C_V + R and γ = (f + 2)/f.',
    'A vibration counts twice: kinetic plus potential energy.',
    'Degrees of freedom whose quantum steps exceed k_BT are frozen out.'
  ],
  pitfalls: [
    'Every degree of freedom always counts — Only those whose quantum level spacing is small compared with k_BT. At room temperature molecular vibrations are mostly frozen out.',
    'A vibrating bond adds ½k_BT — It adds k_BT: its kinetic and potential energies are two separate quadratic terms.',
    'Heavier molecules get more energy — Each degree of freedom gets the same ½k_BT whatever the mass; heavier molecules simply move more slowly with it.'
  ],
  formulas: [
    {
      name: 'Internal energy from the degrees of freedom',
      expr: 'U = f/2*n*R*T', tex: 'U = \\frac f2\\, nRT',
      vars: {
        U: { name: 'internal energy', q: 'energy', unit: 'kJ' },
        f: { name: 'number of active degrees of freedom', q: 'count', int: true, value: 5 },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      practice: { unknowns: ['U', 'T'] },
      stories: { U: 'What is the internal energy of {n} of a gas with {f} active degrees of freedom at {T}?' }
    },
    {
      name: 'Molar heat capacity at constant volume',
      expr: 'Cv = f/2*R', tex: 'C_V = \\frac f2\\, R',
      vars: {
        Cv: { name: 'molar heat capacity at constant volume', q: 'molarheat', unit: 'J/(mol·K)', tex: 'C_V' },
        f: { name: 'number of active degrees of freedom', q: 'count', int: true, value: 5 },
        R: { const: 'R' }
      },
      practice: { unknowns: ['Cv'] }
    },
    {
      name: 'Heat capacity ratio',
      expr: 'gam = (f + 2)/f', tex: '\\gamma = \\frac{f + 2}{f}',
      vars: {
        gam: { name: 'heat capacity ratio C_p/C_V', tex: '\\gamma' },
        f: { name: 'number of active degrees of freedom', q: 'count', int: true, value: 5 }
      },
      note: 'Measured values that are not of this form (1.29 for CO₂) show degrees of freedom that are only partly active.',
      practice: { unknowns: ['gam'] }
    }
  ],
  examples: [
    {
      title: 'Warming the air in a room',
      q: 'A closed room holds 2080 mol of air (diatomic). How much energy does it take to warm the air from 10 °C to 20 °C at constant volume, and how long would a 2 kW heater take if it heated only the air?',
      steps: [
        'Diatomic: $C_V = \\tfrac52 R = 20.8$ J/(mol·K).',
        '$Q = nC_V\\Delta T = 2080 \\times 20.8 \\times 10 = 4.3\\times10^{5}$ J.',
        '$t = Q/P = 4.3\\times10^{5}/2000 \\approx 216$ s, under four minutes.',
        'Real rooms take far longer: the walls and furniture have much larger heat capacities, and warm air leaks out.'
      ],
      a: 'About 0.43 MJ, under 4 minutes for the air alone'
    },
    {
      title: 'What γ reveals about carbon dioxide',
      q: 'The measured heat capacity ratio of CO₂ at room temperature is 1.29. How many degrees of freedom are active?',
      steps: [
        'From $\\gamma = (f + 2)/f$: $f = \\dfrac{2}{\\gamma - 1} = \\dfrac{2}{0.29} = 6.9$.',
        'A linear molecule has 3 translations and 2 rotations, $f = 5$. The extra 1.9 comes from bending vibrations, whose quantum steps are low enough to be partly excited at room temperature.',
        'Equipartition does not give whole numbers here, a sign that quantum freezing is only partial.'
      ],
      a: 'About 7: five fully active plus partly excited vibrations'
    }
  ],
  quiz: [
    { q: 'What is the molar heat capacity at constant volume of argon, a monatomic gas?', choices: ['$\\tfrac12 R$', '$\\tfrac32 R$', '$\\tfrac52 R$', '$3R$'], a: 1,
      why: 'Three translational degrees of freedom, each contributing $\\tfrac12 R$ per mole: 12.5 J/(mol·K).' },
    { q: 'The heat capacity ratio of air is 1.40 because air molecules at room temperature have…', choices: ['3 active degrees of freedom', '5 active degrees of freedom', '7 active degrees of freedom', '6 active degrees of freedom'], a: 1,
      why: '$\\gamma = (f + 2)/f = 7/5$ for $f = 5$: three translations and two rotations; vibrations are frozen out.' },
    { q: 'A mixture of helium and xenon is in equilibrium. Compared with the xenon atoms, the helium atoms have…', choices: ['more average kinetic energy', 'the same average kinetic energy and higher speeds', 'the same speeds', 'less average kinetic energy and higher speeds'], a: 1,
      why: 'Equipartition gives both $\\tfrac32 k_BT$ of translational kinetic energy. Being much lighter, helium atoms move faster.' },
    { q: 'Equipartition correctly predicts that the heat capacity of hydrogen gas is the same at 50 K as at 300 K.', a: false,
      why: 'On cooling, hydrogen\'s rotations freeze out and by 50 K its $C_V$ has dropped from $\\tfrac52 R$ to $\\tfrac32 R$ — a quantum effect that classical equipartition cannot explain.' },
    { q: 'Most solid elements have molar heat capacities close to 25 J/(mol·K), yet lead\'s specific heat per kilogram is only a third of aluminium\'s. Why?', choices: ['Lead atoms store less energy each', 'Lead atoms are heavier, so a kilogram contains fewer of them', 'Lead has fewer degrees of freedom', 'Lead conducts heat better'], a: 1,
      why: 'Each atom stores about $3k_BT$ in either metal. Lead\'s atoms are 7.7 times heavier, so there are fewer per kilogram.' }
  ],
  applications: ['Predicting heat capacities and γ for engine and compressor calculations.', 'The speed of sound in gases, which depends on γ.', 'Diagnosing molecular structure from measured heat capacities.'],
  sim: { id: 'heat-maxwell', params: { mix: true }, title: 'Equipartition in a helium–argon mixture' }
},

{
  id: 'mean-free-path', parent: 'kinetic-theory', title: 'Mean free path', level: 2,
  short: 'The average distance a molecule travels between collisions — tens of nanometres in air, many metres in a good vacuum — which sets how fast gases diffuse, conduct heat and mix.',
  keywords: ['mean free path', 'collision frequency', 'collision rate', 'collision cross-section', 'molecular diameter', 'diffusion', 'random walk', 'vacuum', 'Knudsen number', 'number density'],
  prereq: ['kinetic-theory-gases', 'ideal-gas-law'],
  related: ['maxwell-boltzmann', 'viscosity', 'conduction', 'math:probability-basics'],
  body: `
Air molecules move at about 500 m/s, yet if someone opens a bottle of perfume across a room it takes many seconds before you smell it. The molecules do not fly straight across: they collide with other molecules billions of times a second, bouncing off in a new direction each time.

### How far between collisions?
Picture a molecule of diameter $d$ moving through a gas of other molecules. It hits any molecule whose centre comes within $d$ of its own path, so it sweeps out a cylinder of cross-section $\\sigma = \\pi d^2$. Travelling a distance $\\ell$, it sweeps a volume $\\pi d^2 \\ell$, which contains $n\\,\\pi d^2 \\ell$ molecules, where $n = N/V$ is the number density. On average it has travelled one **mean free path** $\\lambda$ when that number reaches one. Allowing for the motion of the other molecules adds a factor $\\sqrt 2$, and with $n = p/k_BT$ from the [[ideal-gas-law|gas law]]:

$$\\lambda = \\frac{1}{\\sqrt2\\,\\pi d^2 n} = \\frac{k_BT}{\\sqrt2\\,\\pi d^2 p}$$

For air at 20 °C and 1 atm, with an effective diameter of about 0.37 nm, $\\lambda \\approx 66$ nm. That is about 20 times the average spacing between molecules (3.4 nm) and nearly 200 times their size. Dividing the mean speed by $\\lambda$ gives the **collision frequency**: $470/(6.6\\times10^{-8}) \\approx 7\\times10^{9}$ collisions per second for each molecule.

### What changes λ
- Halve the pressure at fixed temperature and $\\lambda$ doubles: fewer molecules to hit.
- Heat a sealed container: the number density is unchanged, so $\\lambda$ stays the same (the molecules just meet more often because they move faster).
- Double the molecular diameter and $\\lambda$ falls to a quarter.

### Random walks and diffusion
Between collisions a molecule moves in a straight line; after each it heads off in a random new direction. After $N$ steps of length $\\lambda$ it is typically only $\\lambda\\sqrt N$ from where it began: a **random walk**. This makes diffusion in gases slow. The diffusion coefficient is roughly $D \\approx \\tfrac13 \\lambda \\bar v \\approx 10^{-5}$ m²/s for air, and spreading a distance $x$ takes a time of order $x^2/2D$: several seconds for a centimetre, most of a day for a metre. A smell crosses a room in seconds only because draughts and [[convection]] currents carry it.

The same collisions set a gas's viscosity and its thermal conductivity. Maxwell found a surprise: both are independent of pressure, because halving the pressure halves the number of molecules carrying momentum or heat but doubles the distance each carries it. This holds until $\\lambda$ becomes comparable to the container.

### Vacuum
At lower pressures the mean free path grows in proportion. In a good laboratory vacuum ($10^{-4}$ Pa) it is tens of metres, longer than the apparatus: molecules fly from wall to wall without meeting one another. That is what particle accelerators, electron microscopes, X-ray tubes and vacuum coating need — and why a vacuum flask insulates: across its evacuated gap there is too little gas to carry heat.
`,
  ideas: [
    'λ = 1/(√2 πd²n) = k_BT/(√2 πd²p): the average distance between collisions.',
    'In air at room conditions λ ≈ 66 nm, and each molecule collides about 7 billion times a second.',
    'λ is inversely proportional to pressure at fixed temperature.',
    'Collisions turn molecular motion into a slow random walk: diffusion distance grows as √t.',
    'In a high vacuum λ exceeds the size of the apparatus.'
  ],
  pitfalls: [
    'Molecules cross a room at hundreds of metres per second — They zig-zag, changing direction billions of times a second; their net progress is a slow random walk.',
    'Heating a sealed container lengthens the mean free path — At fixed number density λ does not change; it grows with T only at fixed pressure, where the gas expands.',
    'Doubling the molecular diameter halves the mean free path — The collision cross-section grows as d², so λ falls to a quarter.'
  ],
  formulas: [
    {
      name: 'Mean free path',
      expr: 'lam = kB*T/(sqrt(2)*pi*d^2*p)', tex: '\\lambda = \\frac{k_B T}{\\sqrt2\\,\\pi d^2 p}',
      vars: {
        lam: { name: 'mean free path', q: 'length', unit: 'nm', tex: '\\lambda' },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: '°C', value: 20 },
        d: { name: 'effective molecular diameter', q: 'length', unit: 'nm', value: 0.37 },
        p: { name: 'pressure', q: 'pressure', unit: 'kPa', value: 101.325 }
      },
      stories: {
        lam: 'What is the mean free path of molecules of diameter {d} in a gas at {T} and {p}?',
        p: 'Below what pressure does the mean free path of air molecules ({d}) at {T} exceed {lam}?'
      }
    },
    {
      name: 'Collision frequency',
      expr: 'z = v/lam', tex: 'z = \\frac{\\bar v}{\\lambda}',
      vars: {
        z: { name: 'collisions per second for one molecule', q: 'frequency', unit: 'Hz' },
        v: { name: 'mean speed', q: 'speed', unit: 'm/s', value: 470, tex: '\\bar v' },
        lam: { name: 'mean free path', q: 'length', unit: 'nm', value: 66, tex: '\\lambda' }
      },
      stories: { z: 'Air molecules have a mean speed of {v} and a mean free path of {lam}. How many collisions does each undergo per second?' }
    }
  ],
  examples: [
    {
      title: 'Collisions in the air you breathe',
      q: 'Estimate the mean free path and the collision frequency for nitrogen molecules ($d \\approx 0.37$ nm, mean speed 470 m/s) in air at 20 °C and 1 atm.',
      steps: [
        'Number density: $n = p/k_BT = 101\\,325/(1.381\\times10^{-23} \\times 293.15) = 2.50\\times10^{25}$ m⁻³.',
        '$\\lambda = \\dfrac{1}{\\sqrt2\\,\\pi d^2 n} = \\dfrac{1}{1.414 \\times \\pi \\times (3.7\\times10^{-10})^2 \\times 2.50\\times10^{25}} = 6.6\\times10^{-8}$ m.',
        'Collision frequency: $z = \\bar v/\\lambda = 470/6.6\\times10^{-8} = 7.1\\times10^{9}$ per second.'
      ],
      a: 'λ ≈ 66 nm; about 7 billion collisions per second'
    },
    {
      title: 'Vacuum for an electron beam',
      q: 'An electron microscope column is about 1 m long. Estimate the pressure below which the mean free path of the residual air (at 20 °C) exceeds 1 m.',
      steps: [
        'Rearrange: $p = \\dfrac{k_BT}{\\sqrt2\\,\\pi d^2 \\lambda}$.',
        '$p = \\dfrac{1.381\\times10^{-23} \\times 293}{1.414 \\times \\pi \\times (3.7\\times10^{-10})^2 \\times 1} = 6.7\\times10^{-3}$ Pa.',
        'That is about $7\\times10^{-8}$ atm; real columns are pumped a hundred times lower still so that very few electrons are scattered.'
      ],
      a: 'Below about 0.007 Pa'
    }
  ],
  quiz: [
    { q: 'The pressure of a gas is halved at constant temperature. Its mean free path…', choices: ['halves', 'doubles', 'quadruples', 'stays the same'], a: 1,
      why: '$\\lambda \\propto 1/n$ and at fixed temperature $n \\propto p$.' },
    { q: 'A sealed, rigid container of gas is heated. The mean free path…', choices: ['increases', 'decreases', 'stays the same', 'drops to zero'], a: 2,
      why: 'The number of molecules per unit volume does not change, so neither does the distance between collisions. They only meet more often, because they move faster.' },
    { q: 'In air at room conditions, compared with the average spacing between molecules, the mean free path is…', choices: ['much smaller', 'about the same', 'about 20 times larger', 'a million times larger'], a: 2,
      why: 'The spacing is about 3.4 nm and λ about 66 nm: molecules are small targets, so a molecule passes many neighbours before hitting one.' },
    { q: 'Doubling the diameter of the molecules halves the mean free path.', a: false,
      why: 'The collision cross-section $\\pi d^2$ quadruples, so λ falls to a quarter.' },
    { q: 'Perfume released in a still room takes a long time to spread, though its molecules move at hundreds of metres per second, because…', choices: ['the molecules are too heavy to move far', 'collisions make each molecule\'s path a random walk', 'perfume molecules stick to the air', 'the air pushes them back'], a: 1,
      why: 'Each molecule changes direction billions of times a second; its net distance grows only as the square root of time.' }
  ],
  applications: ['Designing vacuum systems for accelerators, microscopes and chip manufacturing.', 'Predicting diffusion and gas viscosity.', 'Vacuum insulation in flasks and cryogenic vessels.', 'Aerodynamics of the thin upper atmosphere, where λ approaches the size of a spacecraft.']
}

);
