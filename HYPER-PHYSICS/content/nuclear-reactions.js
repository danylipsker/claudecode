/* HYPER-PHYSICS · content/nuclear-reactions.js — rearranging nuclei: the energy
 * bookkeeping of reactions, fission and the reactors built on it, and fusion. */
Hyper.add(

{
  id: 'q-value', parent: 'nuclear-reactions', title: 'Nuclear reactions and Q-value', level: 2,
  short: 'When nuclei collide and rearrange, the change in total rest mass decides whether energy is released or must be supplied: that energy is the Q-value.',
  keywords: ['nuclear reaction', 'Q-value', 'transmutation', 'exothermic', 'endothermic', 'threshold energy', 'conservation laws', 'cross-section', 'barn', 'Rutherford', 'Cockcroft Walton'],
  prereq: ['binding-energy', 'mass-energy', 'radioactive-decay'],
  related: ['fission', 'fusion', 'particle-accelerators', 'conservation-of-momentum'],
  body: `
In 1919 Rutherford let alpha particles from a radioactive source pass through nitrogen and saw hydrogen nuclei — protons — come out. He had changed one element into another:

$$ {}^{4}_{2}\\mathrm{He} + {}^{14}_{7}\\mathrm{N} \\to {}^{17}_{8}\\mathrm{O} + {}^{1}_{1}\\mathrm{H}$$

Physicists write this compactly as $ {}^{14}\\mathrm{N}(\\alpha, p)\\,{}^{17}\\mathrm{O}$: target, (projectile, ejectile), product.

### What must balance
Every nuclear reaction conserves:

- the total number of nucleons (the mass number: $4 + 14 = 17 + 1$);
- electric charge ($2 + 7 = 8 + 1$);
- energy, momentum and angular momentum.

Rest mass alone is **not** conserved. The difference between the rest masses before and after is the energy released, the **Q-value**:

$$Q = \\left(\\sum m_\\mathrm{before} - \\sum m_\\mathrm{after}\\right) c^2$$

Because the nucleon number is conserved, the same Q follows from binding energies: $Q = \\sum B_\\mathrm{after} - \\sum B_\\mathrm{before}$ — energy is released when the products are more tightly bound (see [[binding-energy]]).

### Exothermic and endothermic
If $Q > 0$ the reaction is **exothermic**: the products fly off with more kinetic energy than the reactants brought in. Examples: the reaction $ {}^{9}\\mathrm{Be}(\\alpha, n)\\,{}^{12}\\mathrm{C}$, with $Q = +5.7$ MeV, by which Chadwick found the neutron in 1932; and the first reaction driven by an accelerator, Cockcroft and Walton's $p + {}^{7}\\mathrm{Li} \\to 2\\,{}^{4}\\mathrm{He}$ (also 1932), which releases 17.3 MeV from a proton of well under 1 MeV.

If $Q < 0$ the reaction is **endothermic** and kinetic energy must be supplied. Rutherford's reaction has $Q = -1.19$ MeV. The projectile must bring more than $|Q|$, because momentum is conserved: the products cannot be left at rest, so some kinetic energy is locked in their motion. For a target at rest, and speeds well below $c$, the **threshold** is

$$K_\\mathrm{th} = -Q \\left(1 + \\frac{m_a}{m_X}\\right)$$

For alphas on nitrogen, $1.19 \\times (1 + 4/14) = 1.53$ MeV.

### Getting in
Charged projectiles must overcome the electric repulsion of the target — a few MeV for protons on medium nuclei — or [[quantum-tunneling|tunnel]] through it. **Neutrons** feel no repulsion at all, so even very slow ones react: this is why neutrons drive [[fission]] and why reactors can breed tritium with $ {}^{6}\\mathrm{Li}(n, \\alpha)\\,{}^{3}\\mathrm{H}$ ($Q = +4.78$ MeV). How likely a reaction is, is expressed as a **cross-section**, an effective target area measured in **barns** ($10^{-28}\\ \\mathrm{m^2}$, roughly the geometric size of a nucleus). Slow neutrons on cadmium-113 see about 20 000 barns, which makes cadmium a good neutron absorber.

> [!tip] Q-values in MeV: take the mass difference in atomic mass units and multiply by 931.5. Use atomic masses throughout and the electrons cancel.
`,
  ideas: [
    'Nuclear reactions conserve nucleon number, charge, energy and momentum — but not rest mass.',
    'Q = (mass before − mass after) c² is the energy released; it also equals the gain in total binding energy.',
    'Q > 0: exothermic. Q < 0: endothermic, needing a threshold kinetic energy larger than |Q|.',
    'Neutrons need no energy to overcome electric repulsion, so they react easily even when slow.',
    'Reaction probability is measured as a cross-section, in barns (10⁻²⁸ m²).'
  ],
  pitfalls: [
    'An endothermic reaction needs exactly |Q| of kinetic energy — It needs more, because momentum must be conserved and the products must keep moving: $K_\\mathrm{th} = |Q|(1 + m_a/m_X)$.',
    'Mass is conserved in nuclear reactions — The nucleon number is; the rest mass changes by Q/c², a fraction of a per cent that is the whole source of nuclear energy.',
    'A cross-section is the physical size of the nucleus — It is an effective area for one particular reaction, and for slow neutrons it can be thousands of times the geometric size.'
  ],
  formulas: [
    {
      name: 'Q-value from masses',
      expr: 'Q = (ma + mX - mY - mb)*c^2', tex: 'Q = (m_a + m_X - m_Y - m_b)\\, c^2',
      vars: {
        Q: { name: 'energy released (Q-value)', q: 'energy', unit: 'MeV', signed: true },
        ma: { name: 'mass of the projectile', q: 'mass', unit: 'u', value: 4.002603, tex: 'm_a' },
        mX: { name: 'mass of the target', q: 'mass', unit: 'u', value: 14.003074, tex: 'm_X' },
        mY: { name: 'mass of the heavy product', q: 'mass', unit: 'u', value: 16.999132, tex: 'm_Y' },
        mb: { name: 'mass of the light product', q: 'mass', unit: 'u', value: 1.007825, tex: 'm_b' },
        c: { const: 'c' }
      },
      note: 'Defaults: Rutherford\'s $ {}^{14}\\mathrm{N}(\\alpha, p)\\,{}^{17}\\mathrm{O}$ with atomic masses. Negative Q: energy must be supplied.',
      practice: false
    },
    {
      name: 'Q-value from binding energies',
      expr: 'Q = Bf - Bi', tex: 'Q = B_\\mathrm{after} - B_\\mathrm{before}',
      vars: {
        Q: { name: 'energy released', q: 'energy', unit: 'MeV', signed: true },
        Bf: { name: 'total binding energy of the products', q: 'energy', unit: 'MeV', value: 28.30, tex: 'B_\\mathrm{after}' },
        Bi: { name: 'total binding energy of the reactants', q: 'energy', unit: 'MeV', value: 10.71, tex: 'B_\\mathrm{before}' }
      },
      note: 'Defaults: deuterium (2.22 MeV) + tritium (8.48 MeV) → helium-4 (28.30 MeV) + a free neutron (0). Valid when protons and neutrons are separately conserved.',
      stories: { Q: 'The reactants of a nuclear reaction have a total binding energy of {Bi} and the products {Bf}. How much energy is released?' }
    },
    {
      name: 'Threshold energy of an endothermic reaction',
      expr: 'K = -Q*(1 + ma/mX)', tex: 'K_\\mathrm{th} = -Q \\left(1 + \\frac{m_a}{m_X}\\right)',
      vars: {
        K: { name: 'threshold kinetic energy of the projectile', q: 'energy', unit: 'MeV', tex: 'K_\\mathrm{th}' },
        Q: { name: 'Q-value (negative)', q: 'energy', unit: 'MeV', value: -1.19, signed: true },
        ma: { name: 'mass of the projectile', q: 'mass', unit: 'u', value: 4.0026, tex: 'm_a' },
        mX: { name: 'mass of the target (at rest)', q: 'mass', unit: 'u', value: 14.0031, tex: 'm_X' }
      },
      note: 'Non-relativistic, target at rest. A heavy target makes the threshold close to $|Q|$; a projectile as heavy as the target doubles it.',
      practice: { unknowns: ['K'] },
      stories: { K: 'A reaction has Q = {Q}. What minimum kinetic energy must a projectile of mass {ma} have to trigger it on a target of mass {mX} at rest?' }
    }
  ],
  examples: [
    {
      title: 'Rutherford\'s transmutation',
      q: 'Find the Q-value of $ {}^{4}\\mathrm{He} + {}^{14}\\mathrm{N} \\to {}^{17}\\mathrm{O} + {}^{1}\\mathrm{H}$ and the threshold energy of the alpha particle. Atomic masses: He-4 4.002603 u, N-14 14.003074 u, O-17 16.999132 u, H-1 1.007825 u.',
      steps: [
        'Before: $4.002603 + 14.003074 = 18.005677\\ \\mathrm{u}$. After: $16.999132 + 1.007825 = 18.006957\\ \\mathrm{u}$.',
        'The products are heavier by $0.001280\\ \\mathrm{u}$: $Q = -0.001280 \\times 931.5 = -1.19\\ \\mathrm{MeV}$.',
        'Threshold: $K_\\mathrm{th} = 1.19 \\times (1 + 4.00/14.00) = 1.53\\ \\mathrm{MeV}$.',
        'Rutherford\'s alphas from radium decay products had about 7.7 MeV, comfortably above it.'
      ],
      a: 'Q = −1.19 MeV; the alpha needs at least 1.53 MeV.'
    },
    {
      title: 'Splitting lithium with protons',
      q: 'Cockcroft and Walton fired protons at lithium-7: $p + {}^{7}\\mathrm{Li} \\to 2\\,{}^{4}\\mathrm{He}$. Masses: H-1 1.007825 u, Li-7 7.016003 u, He-4 4.002603 u. Find Q.',
      steps: [
        'Before: $1.007825 + 7.016003 = 8.023828\\ \\mathrm{u}$. After: $2 \\times 4.002603 = 8.005206\\ \\mathrm{u}$.',
        '$\\Delta m = 0.018622\\ \\mathrm{u}$, so $Q = 0.018622 \\times 931.5 = 17.3\\ \\mathrm{MeV}$.',
        'The two alpha particles shared this energy and flew apart back to back; measuring their energies gave one of the first direct checks of $E = mc^2$.'
      ],
      a: 'Q = +17.3 MeV'
    }
  ],
  quiz: [
    { q: 'Complete the reaction: $ {}^{9}_{4}\\mathrm{Be} + {}^{4}_{2}\\mathrm{He} \\to {}^{12}_{6}\\mathrm{C} + \\;?$', choices: ['a proton', 'a neutron', 'an electron', 'a gamma ray only'], a: 1,
      why: 'Nucleons: $9 + 4 = 12 + 1$. Charge: $4 + 2 = 6 + 0$. The missing particle has $A = 1$ and no charge: a neutron — the reaction in which Chadwick discovered it.' },
    { q: 'A reaction has Q = −2 MeV. This means…', choices: ['it releases 2 MeV', 'the products are lighter than the reactants', 'the products are heavier, so at least 2 MeV of kinetic energy must be supplied', 'it cannot happen at all'], a: 2,
      why: 'Negative Q: kinetic energy is converted into rest mass. The reaction goes if the projectile brings enough energy — in fact more than 2 MeV, to conserve momentum.' },
    { q: 'Why does the threshold energy exceed |Q|?', choices: ['Some energy is lost as heat', 'Momentum conservation keeps the products moving, which takes kinetic energy', 'The electrons must also be removed', 'Because of the Coulomb barrier alone'], a: 1,
      why: 'The incoming particle carries momentum, so the products must carry the same momentum and cannot be at rest. That kinetic energy is not available for making mass.' },
    { q: 'In an exothermic nuclear reaction, the total rest mass of the products is less than that of the reactants.', a: true,
      why: 'The missing rest mass, times $c^2$, appears as extra kinetic energy (or gamma rays) of the products.' },
    { q: 'Slow neutrons trigger nuclear reactions far more easily than slow protons because…', choices: ['neutrons are heavier', 'neutrons feel no electric repulsion from the nucleus', 'neutrons are unstable', 'protons do not feel the strong force'], a: 1,
      why: 'A proton must climb the Coulomb barrier or tunnel through it; an uncharged neutron simply drifts in.' }
  ],
  applications: ['Producing medical isotopes: fluorine-18 by $ {}^{18}\\mathrm{O}(p, n)\\,{}^{18}\\mathrm{F}$ in hospital cyclotrons.', 'Neutron sources that mix an alpha emitter with beryllium.', 'Breeding tritium from lithium for fusion reactors.'],
  sim: { id: 'nc-binding-curve', params: { rx: 'he' } }
},

{
  id: 'fission', parent: 'nuclear-reactions', title: 'Nuclear fission', level: 2,
  short: 'A heavy nucleus such as uranium-235 absorbs a neutron, wobbles and splits into two medium nuclei, releasing about 200 MeV and two or three new neutrons that can split more nuclei.',
  keywords: ['fission', 'uranium-235', 'plutonium-239', 'chain reaction', 'critical mass', 'fissile', 'fertile', 'fission fragments', 'neutron multiplication', 'Meitner', 'Hahn'],
  prereq: ['binding-energy', 'q-value', 'strong-force'],
  related: ['nuclear-reactors', 'fusion', 'radioactive-decay', 'radiation-dose'],
  body: `
In December 1938 Otto Hahn and Fritz Strassmann bombarded uranium with neutrons and, to their astonishment, found barium — an element about half as heavy. Lise Meitner and her nephew Otto Frisch explained it within weeks: the uranium nucleus had **split in two**.

### How a nucleus splits
Picture the nucleus as a charged liquid drop. When uranium-235 absorbs a neutron it becomes uranium-236 with about 6.5 MeV of excitation energy, enough to set it wobbling violently. The drop stretches into a peanut shape; the surface tension of the [[strong-force|strong force]] pulls it back, but the electric repulsion between the two ends pushes them apart. Past a critical elongation repulsion wins and the drop snaps. One typical outcome is

$$ {}^{235}_{92}\\mathrm{U} + n \\to {}^{141}_{56}\\mathrm{Ba} + {}^{92}_{36}\\mathrm{Kr} + 3n$$

but there are hundreds of ways to split. The fragments are unequal, with mass numbers clustered near 95 and 140.

### The energy
The fragments are more tightly bound (about 8.5 MeV per nucleon, against 7.6 for uranium — see [[binding-energy]]), so roughly 0.9 MeV per nucleon is released, about **200 MeV per fission**:

| Where it goes | Energy |
|---|---|
| kinetic energy of the two fragments | about 170 MeV |
| prompt neutrons and gamma rays | about 12 MeV |
| later beta and gamma decay of the fragments | about 13 MeV |
| antineutrinos (escape, lost) | about 10 MeV |

The fragments slam into the surrounding fuel within micrometres, turning their energy into heat. Fission of one kilogram of uranium-235 releases $8 \\times 10^{13}$ J, as much as burning about 3000 tonnes of coal.

### Fissile and fertile
Uranium-235, plutonium-239 and uranium-233 split after absorbing even a slow neutron: they are **fissile**. Their odd neutron number means that capturing one more neutron releases extra pairing energy, enough to push the nucleus over its fission barrier. Uranium-238, 99.3 % of natural uranium, needs a neutron of more than about 1 MeV; but it can capture a neutron and, after two beta decays, become fissile plutonium-239, so it is called **fertile**.

### Chain reactions
Each fission releases on average about 2.4 neutrons (for uranium-235). If on average more than one of them causes another fission, the number of fissions grows generation after generation — a **chain reaction**. The average number of next-generation fissions per fission is the **multiplication factor** $k$:

- $k < 1$: **subcritical**, the chain dies out;
- $k = 1$: **critical**, a steady rate — a [[nuclear-reactors|reactor]];
- $k > 1$: **supercritical**, exponential growth.

Neutrons escape through the surface, so small lumps leak too many; the smallest mass that can sustain a chain is the **critical mass**, about 50 kg for a bare sphere of pure uranium-235 and 10 kg for plutonium-239.

### The price
The fragments carry too many neutrons for their size, so they are strongly radioactive: they beta-decay in chains lasting from seconds to decades. Iodine-131, caesium-137 and strontium-90 are all fission products, which is why spent fuel must be cooled and shielded for centuries.

> [!history] Meitner and Frisch named the process after cell division in biology. Frisch confirmed the energetic fragments in an ionization chamber in January 1939.
`,
  ideas: [
    'A heavy nucleus that absorbs a neutron can split into two medium nuclei plus 2–3 neutrons.',
    'About 200 MeV is released per fission, because the fragments are more tightly bound than uranium.',
    'Uranium-235 and plutonium-239 are fissile with slow neutrons; uranium-238 is not.',
    'The multiplication factor k decides whether a chain reaction dies (k < 1), holds steady (k = 1) or grows (k > 1).',
    'Fission fragments are neutron-rich and strongly radioactive.'
  ],
  pitfalls: [
    'Fission splits a nucleus into protons and neutrons — It splits it into two medium-sized nuclei, plus only two or three free neutrons.',
    'Any uranium can sustain a chain reaction — Natural uranium is 99.3 % uranium-238, which does not fission with slow neutrons; reactors need a moderator and usually enrichment, weapons need highly enriched uranium or plutonium.',
    'The energy comes from breaking the nucleus apart — It comes from the fragments being more tightly bound than the original nucleus; their total rest mass is lower.'
  ],
  formulas: [
    {
      name: 'Q-value of a fission channel',
      expr: 'Q = (MU + mn - m1 - m2 - nu*mn)*c^2', tex: 'Q = (M_\\mathrm{U} + m_n - m_1 - m_2 - \\nu\\, m_n)\\, c^2',
      vars: {
        Q: { name: 'energy released promptly', q: 'energy', unit: 'MeV', signed: true },
        MU: { name: 'atomic mass of the fissioning nucleus', q: 'mass', unit: 'u', value: 235.043928, tex: 'M_\\mathrm{U}' },
        m1: { name: 'atomic mass of fragment 1', q: 'mass', unit: 'u', value: 140.914403, tex: 'm_1' },
        m2: { name: 'atomic mass of fragment 2', q: 'mass', unit: 'u', value: 91.926173, tex: 'm_2' },
        nu: { name: 'neutrons released', q: 'count', value: 3, int: true, tex: '\\nu' },
        mn: { name: 'neutron mass', q: 'mass', unit: 'u', value: 1.00866492, fixed: true, tex: 'm_n' },
        c: { const: 'c' }
      },
      note: 'Defaults: uranium-235 + n → barium-141 + krypton-92 + 3n. The later decays of the fragments add another 20–25 MeV.',
      practice: false
    },
    {
      name: 'Energy from fissioning a mass of fuel',
      expr: 'E = m*NA*Ef/M', tex: 'E = \\frac{m N_A}{M}\\, E_f',
      vars: {
        E: { name: 'energy released', q: 'energy', unit: 'GJ' },
        m: { name: 'mass of fuel fissioned', q: 'mass', unit: 'kg', value: 1 },
        M: { name: 'molar mass of the fuel', q: 'molarmass', unit: 'g/mol', value: 235 },
        Ef: { name: 'energy per fission', q: 'energy', unit: 'MeV', value: 200, tex: 'E_f' },
        NA: { const: 'NA' }
      },
      stories: {
        E: 'How much energy is released when {m} of uranium-235 (molar mass {M}) fissions completely, at {Ef} per fission?',
        m: 'What mass of uranium-235 must fission to release {E}, at {Ef} per fission?'
      }
    },
    {
      name: 'Fission rate for a given power',
      expr: 'R = P/Ef', tex: 'R = \\frac{P}{E_f}',
      vars: {
        R: { name: 'fissions per second', q: 'decayconst', unit: '1/s' },
        P: { name: 'thermal power', q: 'power', unit: 'W', value: 1 },
        Ef: { name: 'energy per fission', q: 'energy', unit: 'MeV', value: 200, tex: 'E_f' }
      },
      note: 'One watt takes about $3 \\times 10^{10}$ fissions per second.',
      stories: { R: 'How many fissions per second produce a thermal power of {P}, at {Ef} each?', P: 'A reactor core has {R} fissions per second at {Ef} each. What is its thermal power?' }
    }
  ],
  examples: [
    {
      title: 'The energy of one fission',
      q: 'Find the energy released promptly in $ {}^{235}\\mathrm{U} + n \\to {}^{141}\\mathrm{Ba} + {}^{92}\\mathrm{Kr} + 3n$. Masses: U-235 235.043928 u, Ba-141 140.914403 u, Kr-92 91.926173 u, n 1.008665 u.',
      steps: [
        'Check the bookkeeping: $235 + 1 = 141 + 92 + 3$ nucleons; $92 = 56 + 36$ protons.',
        'Before: $235.043928 + 1.008665 = 236.052593\\ \\mathrm{u}$.',
        'After: $140.914403 + 91.926173 + 3(1.008665) = 235.866571\\ \\mathrm{u}$.',
        '$\\Delta m = 0.186022\\ \\mathrm{u}$, so $Q = 0.186022 \\times 931.5 = 173\\ \\mathrm{MeV}$, about 0.08 % of the mass. The fragments\' later decays bring the total to about 200 MeV.'
      ],
      a: 'About 173 MeV promptly, about 200 MeV in all.'
    },
    {
      title: 'Uranium against coal',
      q: 'Compare the energy from fissioning 1 kg of uranium-235 (200 MeV per fission) with burning 1 kg of coal (about 29 MJ).',
      steps: [
        'Nuclei in 1 kg: $N = \\dfrac{1000\\ \\mathrm{g}}{235\\ \\mathrm{g/mol}} \\times 6.022\\times10^{23} = 2.56\\times10^{24}$.',
        'Energy: $2.56\\times10^{24} \\times 200 \\times 1.602\\times10^{-13}\\ \\mathrm{J} = 8.2\\times10^{13}\\ \\mathrm{J}$.',
        'Ratio: $8.2\\times10^{13} / 2.9\\times10^{7} = 2.8\\times10^{6}$.',
        'Per atom the gap is even larger: 200 MeV per fission against about 4 eV per carbon atom burnt.'
      ],
      a: 'About 8 × 10¹³ J — nearly three million times more than coal.'
    }
  ],
  quiz: [
    { q: 'Why are neutrons, rather than protons, used to trigger fission?', choices: ['Neutrons are faster', 'Neutrons are not repelled by the nucleus, so even slow ones get in', 'Protons cannot be produced in large numbers', 'Neutrons carry more energy'], a: 1,
      why: 'A neutron has no charge and meets no Coulomb barrier. Slow neutrons are in fact the best at splitting uranium-235.' },
    { q: 'Which nucleus fissions readily after absorbing a slow neutron?', choices: ['uranium-238', 'uranium-235', 'iron-56', 'lead-208'], a: 1,
      why: 'Uranium-235 is fissile: the binding energy gained by absorbing the extra neutron exceeds its fission barrier. Uranium-238 needs a fast neutron.' },
    { q: 'Fission fragments are usually radioactive because…', choices: ['they are too heavy', 'they have too many neutrons for their size and beta-decay', 'they have too many protons', 'they are formed in excited states that never relax'], a: 1,
      why: 'Uranium has about 1.55 neutrons per proton; stable medium nuclei need only about 1.3. The fragments inherit the excess and shed it by beta-minus decay.' },
    { q: 'In a chain reaction with k = 1.1, the number of fissions after 50 generations has grown by about…', choices: ['5 times', '55 times', '117 times', '1.1 times'], a: 2,
      why: '$1.1^{50} = e^{50 \\ln 1.1} \\approx 117$. Exponential growth is why reactors must be kept at $k = 1$ so precisely.' },
    { q: 'The fragments and neutrons after fission weigh less than the uranium-235 nucleus plus the neutron that triggered it.', a: true,
      why: 'About 0.2 u lighter: that mass, times $c^2$, is the energy released.' }
  ],
  applications: ['Nuclear power stations supply about a tenth of the world\'s electricity.', 'Research reactors make medical isotopes such as molybdenum-99, the parent of technetium-99m.', 'Naval reactors run submarines and aircraft carriers for decades without refuelling.'],
  sim: ['nc-chain-reaction', { id: 'nc-binding-curve', params: { rx: 'fis' } }]
},

{
  id: 'nuclear-reactors', parent: 'nuclear-reactions', title: 'Nuclear reactors', level: 2,
  short: 'A reactor keeps a fission chain reaction exactly critical: a moderator slows the neutrons, control rods absorb the surplus, and the heat raises steam for a turbine.',
  keywords: ['nuclear reactor', 'moderator', 'control rods', 'critical', 'multiplication factor', 'delayed neutrons', 'enrichment', 'pressurized water reactor', 'PWR', 'breeder', 'decay heat', 'coolant', 'Chernobyl', 'Oklo'],
  prereq: ['fission', 'heat-engines', 'elastic-collisions'],
  related: ['radiation-dose', 'fusion', 'efficiency', 'thermodynamic-processes'],
  body: `
A reactor is a chain reaction held exactly at the edge: on average each fission must cause precisely one more, $k = 1$. The heat of the fragments is carried away by a coolant and used, like any other heat source, to drive a [[heat-engines|heat engine]].

### The parts of a reactor
- **Fuel**: uranium dioxide pellets, usually enriched from 0.7 % to 3–5 % uranium-235, stacked in metal tubes grouped into fuel assemblies.
- **Moderator**: fission neutrons are born fast (about 2 MeV), but uranium-235 splits most readily with slow, **thermal** neutrons (about 0.025 eV, the energy of room-temperature motion). The moderator slows them by [[elastic-collisions|elastic collisions]] with light nuclei. A neutron hitting a proton, of almost equal mass, can lose all its energy at once; hitting carbon, twelve times heavier, it loses at most 28 %. Water needs about 18 collisions to thermalize a neutron, heavy water about 25, graphite about 115. Ordinary water also absorbs neutrons, so water-moderated reactors need enriched fuel; heavy water absorbs very few, so CANDU reactors can burn natural uranium.
- **Control rods** of boron, cadmium or hafnium absorb neutrons. Pushing them in lowers $k$; pulling them out raises it. Boric acid dissolved in the coolant does the same job more evenly.
- **Coolant** — pressurized water in most reactors, also boiling water, heavy water, carbon dioxide, liquid sodium — carries the heat to steam generators.

In a pressurized-water reactor the water leaves the core at about 320 °C and 155 bar, and the plant converts roughly a third of the heat into electricity, as a [[carnot-cycle|Carnot]]-limited engine must.

### Why control is possible at all
In a thermal reactor a neutron generation lasts only about $10^{-4}$ s. With $k = 1.001$ the power would then grow by a factor $e^{10}$ — 20 000 — every second. What saves the day is that about 0.65 % of the neutrons are **delayed**: they come from fission products that decay seconds to a minute later. Kept below prompt criticality, the chain must wait for them, the effective generation time becomes about a tenth of a second, and the same $k = 1.001$ raises the power by only about 1 % per second — slow enough for control rods and for physics itself: in a well-designed reactor, rising temperature lowers $k$ (hotter fuel absorbs more neutrons in uranium-238; hotter, less dense water moderates less), so the reactor stabilizes itself.

### After shutdown
Stopping the chain reaction does not stop the heat. The fission products keep decaying: about 7 % of full power just after shutdown, 1 % after an hour, still a few tenths of a per cent after a day. Losing the cooling for this **decay heat** melted the cores at Fukushima in 2011. At Chernobyl in 1986 a graphite-moderated design whose power *rose* when its cooling water boiled ran away during a test.

### Other designs
**Breeder reactors** use fast neutrons and turn uranium-238 into plutonium-239 faster than they burn fuel. **Small modular reactors** aim at factory-built units of a few hundred megawatts. And nature got there first: about two billion years ago, when uranium-235 made up 3 % of natural uranium, groundwater moderated natural chain reactions in the ore deposits at Oklo in Gabon.

> [!fact] A 1000 MW power reactor fissions a little over a tonne of uranium-235 a year. A coal plant of the same output burns about three million tonnes of coal.
`,
  ideas: [
    'A reactor runs at k = 1 exactly: each fission causes, on average, one more.',
    'A moderator (water, heavy water or graphite) slows neutrons by elastic collisions so that uranium-235 absorbs them.',
    'Control rods absorb neutrons to adjust k.',
    'Delayed neutrons stretch the generation time from 10⁻⁴ s to about 0.1 s, which makes control possible.',
    'Decay heat continues after shutdown and must always be removed.'
  ],
  pitfalls: [
    'The moderator absorbs neutrons to control the reaction — It slows them down, which makes fission more likely. Absorbing them is the job of the control rods.',
    'A power reactor can explode like a nuclear bomb — Its fuel is far too weakly enriched and too spread out. Reactor accidents are steam or chemical explosions and meltdowns, serious as those are.',
    'Once the chain reaction stops, the reactor is cold — Decay heat of several per cent of full power continues for hours and must be removed.'
  ],
  formulas: [
    {
      name: 'Fuel fissioned by a power plant',
      expr: 'm = P*t*M/(eta*NA*Ef)', tex: 'm = \\frac{P\\, t\\, M}{\\eta\\, N_A\\, E_f}',
      vars: {
        m: { name: 'mass of uranium-235 fissioned', q: 'mass', unit: 'kg' },
        P: { name: 'electric power', q: 'power', unit: 'MW', value: 1000 },
        t: { name: 'operating time', q: 'time', unit: 'yr', value: 1 },
        M: { name: 'molar mass of the fuel', q: 'molarmass', unit: 'g/mol', value: 235 },
        eta: { name: 'plant efficiency', q: 'ratio', unit: '%', value: 33, tex: '\\eta' },
        Ef: { name: 'energy per fission', q: 'energy', unit: 'MeV', value: 200, tex: 'E_f' },
        NA: { const: 'NA' }
      },
      note: 'The thermal power is $P/\\eta$. In practice some uranium-235 is also lost to neutron capture without fission.',
      stories: {
        m: 'A {P} (electric) power station with {eta} efficiency runs for {t}. What mass of uranium-235 does it fission?',
        P: 'A reactor fissions {m} of uranium-235 in {t} at an efficiency of {eta}. What average electric power does it deliver?'
      }
    },
    {
      name: 'Power growth of a slightly supercritical reactor',
      expr: 'P = P0*exp((k - 1)*t/tg)', tex: 'P = P_0\\, e^{(k - 1)\\, t / t_g}',
      vars: {
        P: { name: 'power after the time', q: 'power', unit: 'MW' },
        P0: { name: 'starting power', q: 'power', unit: 'MW', value: 100 },
        k: { name: 'multiplication factor', q: 'none', value: 1.001 },
        t: { name: 'time', q: 'time', unit: 's', value: 60 },
        tg: { name: 'effective generation time', q: 'time', unit: 's', value: 0.1, tex: 't_g' }
      },
      note: 'With delayed neutrons $t_g \\approx 0.1$ s; with prompt neutrons alone it would be about $10^{-4}$ s. Try both.',
      stories: {
        P: 'A reactor at {P0} goes slightly supercritical, k = {k}, with an effective generation time of {tg}. What is its power after {t}?',
        t: 'How long does a reactor with k = {k} and generation time {tg} take to go from {P0} to {P}?'
      }
    },
    {
      name: 'Collisions needed to slow a neutron',
      expr: 'n = ln(E0/E)/xi', tex: 'n = \\frac{\\ln (E_0/E)}{\\xi}',
      vars: {
        n: { name: 'average number of collisions', q: 'count' },
        E0: { name: 'starting energy', q: 'energy', unit: 'MeV', value: 2 },
        E: { name: 'final energy', q: 'energy', unit: 'eV', value: 0.025 },
        xi: { name: 'average logarithmic energy loss per collision', q: 'none', value: 1, tex: '\\xi' }
      },
      note: '$\\xi = 1$ for hydrogen (water), 0.725 for deuterium, 0.158 for carbon (graphite).',
      stories: { n: 'A fission neutron of {E0} must slow to {E} in a moderator with ξ = {xi}. About how many collisions does it take?' }
    }
  ],
  examples: [
    {
      title: 'A year of fuel',
      q: 'A power station delivers 1000 MW of electricity at 33 % efficiency. How much uranium-235 does it fission in a year?',
      steps: [
        'Thermal power: $1000/0.33 = 3030\\ \\mathrm{MW}$; energy in a year: $3.03\\times10^{9} \\times 3.156\\times10^{7} = 9.6\\times10^{16}\\ \\mathrm{J}$.',
        'Fissions: $9.6\\times10^{16} / (200 \\times 1.602\\times10^{-13}) = 3.0\\times10^{27}$.',
        'Moles: $3.0\\times10^{27}/6.022\\times10^{23} = 4960\\ \\mathrm{mol}$, times 235 g/mol: $1.17\\times10^{6}\\ \\mathrm{g}$.'
      ],
      a: 'About 1.2 tonnes of uranium-235 a year.'
    },
    {
      title: 'What delayed neutrons buy',
      q: 'A reactor goes supercritical with $k = 1.001$. By what factor does its power rise in 1 s if the generation time is (a) $10^{-4}$ s, prompt neutrons only; (b) 0.1 s, with delayed neutrons?',
      steps: [
        'Each generation multiplies the power by $k$, so after $t/t_g$ generations $P/P_0 = k^{t/t_g} \\approx e^{(k-1)t/t_g}$.',
        '(a) $e^{0.001 \\times 1/10^{-4}} = e^{10} \\approx 22\\,000$ — uncontrollable.',
        '(b) $e^{0.001 \\times 1/0.1} = e^{0.01} = 1.01$ — a gentle 1 % per second.'
      ],
      a: 'A factor of about 22 000 without delayed neutrons, only 1 % with them.'
    }
  ],
  quiz: [
    { q: 'The job of the moderator is to…', choices: ['absorb excess neutrons', 'slow neutrons down so that uranium-235 captures them more readily', 'cool the fuel', 'reflect gamma rays'], a: 1,
      why: 'Slow (thermal) neutrons are hundreds of times more likely to cause fission in uranium-235 than fast ones. Absorbing surplus neutrons is the control rods\' job.' },
    { q: 'Why is hydrogen (in water) such an effective moderator?', choices: ['It absorbs no neutrons', 'Its nucleus has nearly the same mass as a neutron, so a collision can transfer most of the energy', 'It is a gas', 'It is cheap'], a: 1,
      why: 'In an elastic collision between equal masses the incoming body can stop dead. Heavier nuclei take only a fraction of the energy per collision.' },
    { q: 'Pushing the control rods further into the core…', choices: ['raises k', 'lowers k', 'leaves k unchanged', 'stops decay heat'], a: 1,
      why: 'The rods absorb neutrons that would otherwise cause fission, lowering the multiplication factor.' },
    { q: 'Reactors can be controlled mainly because…', choices: ['control rods move very fast', 'a small fraction of neutrons is emitted seconds after fission', 'uranium-235 splits slowly', 'the moderator is cold'], a: 1,
      why: 'Delayed neutrons stretch the effective generation time to about 0.1 s, so the power changes over seconds rather than milliseconds.' },
    { q: 'A shut-down reactor no longer needs cooling.', a: false,
      why: 'Fission products keep decaying and heating the fuel: several per cent of full power at first, still about 1 % after an hour.' }
  ],
  applications: ['Electricity generation in about 30 countries.', 'Naval propulsion, where a single core lasts the life of a submarine.', 'Research reactors for neutron scattering, isotope production and materials testing.'],
  sim: 'nc-chain-reaction'
},

{
  id: 'fusion', parent: 'nuclear-reactions', title: 'Nuclear fusion', level: 2,
  short: 'Light nuclei join into heavier ones and release energy. It powers the stars, but needs temperatures of millions of degrees to push the positive nuclei close enough to touch.',
  keywords: ['fusion', 'deuterium', 'tritium', 'D-T reaction', 'proton-proton chain', 'Coulomb barrier', 'tokamak', 'ITER', 'inertial confinement', 'NIF', 'Lawson criterion', 'triple product', 'plasma', 'thermonuclear'],
  prereq: ['binding-energy', 'q-value', 'quantum-tunneling', 'kinetic-theory-gases'],
  related: ['the-sun', 'stellar-evolution', 'fission', 'electric-potential-energy', 'maxwell-boltzmann'],
  body: `
On the steep left side of the [[binding-energy|binding-energy curve]], joining light nuclei gains a lot of binding per nucleon. Four hydrogen nuclei turned into one helium nucleus release 26.7 MeV — 0.7 % of their mass, several times more per kilogram than fission. This is how the Sun shines.

### The Coulomb barrier
The difficulty is getting there. Both nuclei are positive, and they must come within a few femtometres before the strong force can grab them. For two hydrogen nuclei the electric potential energy at contact is

$$U = \\frac{k Z_1 Z_2 e^2}{r} \\approx \\frac{1.44\\ \\mathrm{MeV\\,fm}}{3\\ \\mathrm{fm}} \\approx 0.5\\ \\mathrm{MeV}$$

In the Sun's core, at 15 million kelvin, the typical thermal energy $k_B T$ is only 1.3 keV — hundreds of times less. Fusion still happens because a few nuclei in the high-energy tail of the [[maxwell-boltzmann|Maxwell–Boltzmann distribution]] meet, and even they do not climb the barrier: they [[quantum-tunneling|tunnel]] through it. The chance per encounter is tiny, but the core holds so many protons that the Sun turns 600 million tonnes of hydrogen into helium every second.

### In the stars
The Sun runs the **proton–proton chain**: two protons fuse to deuterium (one turning into a neutron by the weak interaction, which is why it is so slow), deuterium and a proton make helium-3, and two helium-3 nuclei make helium-4:

$$4\\,{}^{1}\\mathrm{H} \\to {}^{4}\\mathrm{He} + 2e^+ + 2\\nu_e + 26.7\\ \\mathrm{MeV}$$

Heavier stars use carbon, nitrogen and oxygen as catalysts (the CNO cycle), and later burn helium into carbon and onwards up to iron (see [[stellar-evolution]]).

### On Earth
The easiest reaction is deuterium–tritium:

$$ {}^{2}\\mathrm{H} + {}^{3}\\mathrm{H} \\to {}^{4}\\mathrm{He}\\,(3.5\\ \\mathrm{MeV}) + n\\,(14.1\\ \\mathrm{MeV})$$

It has the largest cross-section at the lowest temperature, but still needs a plasma of about 100–150 million kelvin (10–15 keV). Deuterium is plentiful — one hydrogen atom in 6400 in seawater — but tritium decays with a half-life of 12.3 years and must be bred from lithium by the reaction's own neutrons.

A fusion plasma must be hot, dense and held together long enough. **Lawson's criterion** for D–T ignition asks for a triple product $n\\,T\\,\\tau_E \\gtrsim 3 \\times 10^{21}\\ \\mathrm{keV\\,s/m^3}$, where $\\tau_E$ is how long the plasma keeps its heat. Two routes compete:

- **Magnetic confinement** in a **tokamak**, a doughnut-shaped magnetic cage: modest density ($10^{20}$ ions per m³) held for seconds. The JET tokamak in England produced 69 MJ of fusion energy in about 5 seconds in 2023; ITER, being built in France, aims at ten times more fusion power than heating power.
- **Inertial confinement**: lasers crush a millimetre-sized capsule of fuel to enormous density for less than a nanosecond. In December 2022 the National Ignition Facility in California released 3.15 MJ from 2.05 MJ of laser light, the first time a fusion target gave out more energy than it received.

> [!fact] The deuterium in one litre of seawater could release about 12 GJ by fusion — roughly the energy in 300 litres of petrol.
`,
  ideas: [
    'Fusing light nuclei releases energy because the product is much more tightly bound per nucleon.',
    'The Coulomb barrier (about 0.5 MeV) far exceeds thermal energies, so fusion needs extreme temperatures and quantum tunnelling.',
    'Stars fuse hydrogen to helium, releasing 26.7 MeV per helium nucleus.',
    'On Earth the D–T reaction is easiest: 17.6 MeV per reaction at 100–150 million kelvin.',
    'Ignition requires a high enough product of density, temperature and confinement time (Lawson criterion).'
  ],
  pitfalls: [
    'Fusion needs the thermal energy to exceed the Coulomb barrier — It needs only a few nuclei in the high-energy tail plus quantum tunnelling; the Sun\'s core has a thousand times less thermal energy than the barrier.',
    'Fusion power produces no radioactivity — The fuel tritium is radioactive, and the 14 MeV neutrons make the reactor walls radioactive, though with far less long-lived waste than fission.',
    'A fusion reactor could run away like a chain reaction — The plasma is so hard to keep hot that any disturbance makes it cool and stop within seconds.'
  ],
  formulas: [
    {
      name: 'Coulomb barrier between two nuclei',
      expr: 'U = ke*Z1*Z2*qe^2/r', tex: 'U = \\frac{k Z_1 Z_2 e^2}{r}',
      vars: {
        U: { name: 'barrier height', q: 'energy', unit: 'MeV' },
        Z1: { name: 'charge number of nucleus 1', q: 'count', value: 1 },
        Z2: { name: 'charge number of nucleus 2', q: 'count', value: 1 },
        r: { name: 'separation at contact', q: 'length', unit: 'fm', value: 3.2 },
        ke: { const: 'ke' },
        qe: { const: 'qe' }
      },
      note: 'The contact distance is roughly the sum of the two radii, $1.2\\ \\mathrm{fm}\\,(A_1^{1/3} + A_2^{1/3})$: about 3.2 fm for deuterium and tritium.',
      stories: { U: 'How high is the electric barrier between two nuclei of charges Z = {Z1} and Z = {Z2} that touch at {r}?' }
    },
    {
      name: 'Temperature and thermal energy',
      expr: 'E = kB*T', tex: 'E = k_B T',
      vars: {
        E: { name: 'thermal energy scale', q: 'energy', unit: 'keV' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 15000000 },
        kB: { const: 'kB' }
      },
      note: 'Plasma physicists quote temperatures in keV: 1 keV corresponds to 11.6 million kelvin.',
      stories: { E: 'What is $k_B T$ in the Sun\'s core, at {T}?', T: 'A tokamak plasma has an ion temperature of {E}. What is that in kelvin?' }
    },
    {
      name: 'Energy per kilogram of fusion fuel',
      expr: 'E = m*Q/mr', tex: 'E = \\frac{m}{m_r}\\, Q',
      vars: {
        E: { name: 'energy released', q: 'energy', unit: 'GJ' },
        m: { name: 'mass of fuel burnt', q: 'mass', unit: 'kg', value: 1 },
        Q: { name: 'energy per reaction', q: 'energy', unit: 'MeV', value: 17.59 },
        mr: { name: 'mass of the reactants in one reaction', q: 'mass', unit: 'u', value: 5.030, tex: 'm_r' }
      },
      note: 'Defaults: deuterium + tritium (2.014 u + 3.016 u). Compare fission: about 82 000 GJ per kg of uranium-235.',
      stories: { E: 'How much energy does {m} of D–T fuel release, at {Q} per reaction and {mr} of fuel per reaction?' }
    },
    {
      name: 'Fusion triple product',
      expr: 'L = n*T*tau', tex: 'L = n\\, T\\, \\tau_E',
      vars: {
        L: { name: 'triple product', unit: 'keV·s/m³' },
        n: { name: 'ion density', q: 'numberdensity', unit: '1/m³', value: 1e20 },
        T: { name: 'ion temperature, in keV', q: 'none', value: 15 },
        tau: { name: 'energy confinement time', q: 'time', unit: 's', value: 3, tex: '\\tau_E' }
      },
      note: 'Temperature entered as a number of keV. D–T ignition needs about $3 \\times 10^{21}\\ \\mathrm{keV\\,s/m^3}$.',
      practice: { unknowns: ['L', 'tau'] },
      stories: { tau: 'A tokamak plasma has {n} ions at {T} keV. How long must it hold its heat to reach a triple product of {L}?' }
    }
  ],
  examples: [
    {
      title: 'The Sun\'s weight loss',
      q: 'The Sun radiates $3.83\\times10^{26}$ W. How much mass does it lose each second, and how much hydrogen does it burn (0.71 % of the hydrogen\'s mass is released as energy)?',
      steps: [
        'Mass converted: $\\Delta m = P/c^2 = 3.83\\times10^{26}/(3.00\\times10^{8})^2 = 4.3\\times10^{9}\\ \\mathrm{kg/s}$.',
        'Hydrogen consumed: $4.3\\times10^{9}/0.0071 = 6.0\\times10^{11}\\ \\mathrm{kg/s}$.',
        'That is 600 million tonnes of hydrogen a second — yet in 4.6 billion years the Sun has used only a few per cent of its hydrogen.'
      ],
      a: 'About 4 million tonnes of mass per second, from 600 million tonnes of hydrogen.'
    },
    {
      title: 'Hot enough?',
      q: 'Compare the Coulomb barrier for deuterium–tritium (contact at 3.2 fm) with the thermal energy $k_B T$ in a tokamak at 150 million kelvin.',
      steps: [
        'Barrier: $U = 1.44\\ \\mathrm{MeV\\,fm}/3.2\\ \\mathrm{fm} = 0.45\\ \\mathrm{MeV} = 450\\ \\mathrm{keV}$.',
        'Thermal: $k_B T = 1.381\\times10^{-23} \\times 1.5\\times10^{8} = 2.07\\times10^{-15}\\ \\mathrm{J} = 12.9\\ \\mathrm{keV}$.',
        'The barrier is 35 times larger; reactions come from fast nuclei in the tail of the distribution tunnelling through the barrier, most of them at 50–100 keV.'
      ],
      a: 'The barrier (450 keV) is about 35 times the thermal energy (13 keV).'
    }
  ],
  quiz: [
    { q: 'Why does fusion need such high temperatures?', choices: ['To melt the fuel', 'So that nuclei move fast enough to approach each other despite their electric repulsion', 'To ionize the atoms so the electrons can fuse', 'Because the strong force works only when hot'], a: 1,
      why: 'Nuclei must come within a few femtometres; only very fast ones (helped by tunnelling) get that close against the Coulomb repulsion.' },
    { q: 'Per kilogram of fuel, D–T fusion releases compared with uranium fission about…', choices: ['a thousandth as much', 'the same', 'four times as much', 'a million times as much'], a: 2,
      why: 'D–T: 17.6 MeV per 5 u, about 3.5 MeV per nucleon. Fission: 200 MeV per 236 u, about 0.85 MeV per nucleon.' },
    { q: 'Why is fusing iron nuclei no use as an energy source?', choices: ['Iron is too rare', 'Iron sits at the peak of the binding-energy curve, so fusing it costs energy', 'Iron is magnetic', 'Iron nuclei have no neutrons'], a: 1,
      why: 'Energy is released only by moving towards the peak of the binding energy per nucleon; beyond iron, fusion absorbs energy.' },
    { q: 'A D–T fusion power plant would produce no radioactive material at all.', a: false,
      why: 'Tritium is radioactive, and the 14 MeV neutrons activate the reactor structure. The waste is much shorter-lived than fission waste, but it exists.' },
    { q: 'In D–T fusion, which particle carries most of the 17.6 MeV?', choices: ['the helium-4 nucleus', 'the neutron', 'they share it equally', 'a gamma ray'], a: 1,
      why: 'Equal and opposite momenta: the lighter particle gets more kinetic energy, in the ratio 4 : 1, so the neutron takes 14.1 MeV and the alpha 3.5 MeV.' }
  ],
  applications: ['The energy source of the Sun and every star on the main sequence.', 'Experimental power: JET, ITER and the stellarator Wendelstein 7-X; laser-driven fusion at NIF.', 'Compact neutron generators that fuse deuterium in small accelerators for oil-well logging and security scanning.'],
  sim: { id: 'nc-binding-curve', params: { rx: 'dt' } }
}

);
