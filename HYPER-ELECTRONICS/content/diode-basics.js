/* HYPER-ELECTRONICS · content/diode-basics.js — the diode: semiconductors for
 * electronics, the p–n junction, the models engineers use, Zener diodes and the
 * other members of the family. Simulations in sims/diodes.js. */
Hyper.add(

{
  id: 'semiconductor-basics', parent: 'diode-basics', title: 'Semiconductors for electronics', level: 1,
  short: 'Silicon conducts a little, and a trace of the right impurity decides whether its current is carried by electrons or by holes — the raw material of every diode and transistor.',
  keywords: ['semiconductor', 'silicon', 'doping', 'n-type', 'p-type', 'hole', 'electron', 'donor', 'acceptor', 'majority carrier', 'minority carrier', 'band gap', 'intrinsic', 'mobility', 'SiC', 'GaN', 'germanium'],
  prereq: ['physics:semiconductors', 'physics:band-theory', 'resistance-ohms-law'],
  related: ['pn-diode', 'diode-types', 'leds', 'mosfet-operation', 'bjt-operation'],
  body: `
A copper wire has about $10^{29}$ free electrons in every cubic metre; a good insulator has essentially none. **Silicon** sits in between. Each silicon atom shares its four outer electrons with four neighbours, and at room temperature only a very few of those bonds are shaken loose by heat: pure silicon has about $10^{10}$ free electrons per cubic centimetre — one for every five million million atoms. Its resistivity is enormous, around 2000 Ω·m.

When a bond breaks, it leaves two carriers, not one: the freed **electron**, and the gap it left behind. A neighbouring electron can hop into the gap, which moves the gap the other way. That wandering vacancy behaves exactly like a positive charge with its own speed, and it is called a **hole**. Electrons and holes both carry current.

### Doping: choosing the carrier
The trick that makes electronics possible is to add a tiny, controlled amount of impurity — typically $10^{15}$ to $10^{18}$ atoms per cm³, a few parts per million or less:
- **n-type:** a pentavalent atom such as **phosphorus** or arsenic has one electron too many for the bonds. It gives it up easily (a *donor*), so the silicon fills with free electrons.
- **p-type:** a trivalent atom such as **boron** is one electron short (an *acceptor*), so it creates holes.

The added carriers are the **majority carriers**; the other kind, still produced by heat, are the **minority carriers**. The two are tied together by the **mass-action law**, $np = n_i^2$: in n-type silicon with $10^{16}$ donors per cm³ there are $10^{16}$ electrons but only about $10^{4}$ holes. Doping one part in five million lowers the resistivity from 2000 Ω·m to about 0.005 Ω·m — a factor of four hundred thousand.

### How well they conduct
The conductivity counts the carriers and how easily each moves in a field, its **mobility** $\\mu$:

$$\\sigma = e\\,(n\\,\\mu_n + p\\,\\mu_p)$$

In lightly doped silicon electrons are about three times as mobile as holes (roughly 0.13 and 0.045 m²/(V·s)), which is why n-channel MOSFETs and NPN transistors are faster and smaller than their p-type twins for the same job.

### The band gap decides a lot
The energy needed to free an electron is the [[physics:band-theory|band gap]]. It sets how many carriers heat creates, how hot a device can run, the voltage a junction needs to conduct, and — in LEDs — the colour of the light.

| Material | Band gap | Where you meet it |
|---|---|---|
| Germanium | 0.66 eV | early transistors, crystal-set detectors |
| Silicon | 1.12 eV | almost everything |
| Gallium arsenide | 1.42 eV | infrared LEDs, microwave amplifiers |
| Silicon carbide (4H) | 3.26 eV | 650–1700 V MOSFETs and Schottky diodes |
| Gallium nitride | 3.4 eV | blue and white LEDs, fast power transistors |

Wide-gap materials hold off far higher fields, so a 1200 V SiC device can be thinner and far less resistive than its silicon equivalent, and they keep working at temperatures where silicon becomes intrinsic.

### Temperature: the engineer's worry
Heat breaks bonds, and the number of thermally generated carriers grows exponentially with temperature. For the circuit designer this shows up as **leakage current**, which in silicon diodes and transistors roughly **doubles for every 10 °C**. It is why junction temperatures are limited to about 150–175 °C: above that the thermally made carriers swamp the doping, and a transistor stops being controllable.

> [!key] Doping sets *which* carrier dominates and how many there are; the band gap sets how much heat disturbs that choice. Every diode and transistor is built by placing p- and n-type regions next to each other — see [[pn-diode]].
`,
  ideas: [
    'Silicon has few free carriers of its own; controlled impurities (doping) supply them.',
    'Phosphorus gives n-type silicon (free electrons); boron gives p-type (holes).',
    'Electrons and holes obey np = nᵢ²: making one plentiful makes the other scarce.',
    'Conductivity is charge × concentration × mobility; electrons move about three times more easily than holes.',
    'Thermally generated carriers — and leakage currents — grow steeply with temperature.'
  ],
  pitfalls: [
    'A hole is a positive particle, like a positron — It is a missing electron in a bond. Its motion is really the collective motion of many electrons, which is why it has its own, lower mobility.',
    'n-type silicon is negatively charged — Each donor that gives up an electron becomes a positive ion, so the material stays neutral. "n" names the carrier, not the net charge.',
    'More doping always means better — Heavy doping lowers mobility and breakdown voltage; power devices use lightly doped regions precisely to withstand high voltage.'
  ],
  formulas: [
    {
      name: 'Minority carriers (mass-action law)',
      expr: 'p = ni^2/Nd', tex: 'p = \\frac{n_i^2}{N_D}',
      vars: {
        p: { name: 'hole (minority carrier) concentration', q: 'numberdensity', unit: '1/cm³' },
        ni: { name: 'intrinsic carrier concentration (Si, 300 K)', q: 'numberdensity', unit: '1/cm³', value: 1e10, tex: 'n_i' },
        Nd: { name: 'donor concentration (≈ electron concentration)', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'N_D' }
      },
      note: 'Valid when the doping is much larger than $n_i$, so that $n \\approx N_D$.',
      stories: { p: 'Silicon doped with {Nd} of phosphorus has an intrinsic concentration of {ni}. How many holes per cubic centimetre remain?' }
    },
    {
      name: 'Resistivity of doped silicon',
      expr: 'rho = 1/(qe*Nd*mu)', tex: '\\rho = \\frac{1}{e\\,N_D\\,\\mu_n}',
      vars: {
        rho: { name: 'resistivity', q: 'resistivity', unit: 'Ω·cm', tex: '\\rho' },
        qe: { const: 'qe' },
        Nd: { name: 'donor concentration', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'N_D' },
        mu: { name: 'electron mobility', unit: 'm²/(V·s)', value: 0.12, tex: '\\mu_n' }
      },
      note: 'For n-type material, where electrons carry nearly all the current. Mobility falls at high doping: about 0.135 m²/(V·s) in pure silicon, 0.12 at $10^{16}$ cm⁻³, 0.08 at $10^{17}$ and roughly 0.01 at $10^{19}$ cm⁻³.',
      stories: { rho: 'n-type silicon with {Nd} donors has an electron mobility of {mu}. What is its resistivity?' }
    },
    {
      name: 'Leakage against temperature (rule of thumb)',
      expr: 'I = I0*2^(dT/Td)', tex: 'I = I_0 \\cdot 2^{\\Delta T / T_d}',
      vars: {
        I: { name: 'leakage at the higher temperature', q: 'current', unit: 'nA' },
        I0: { name: 'leakage at the reference temperature', q: 'current', unit: 'nA', value: 5, tex: 'I_0' },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 60, tex: '\\Delta T' },
        Td: { name: 'doubling interval', q: 'dtemp', unit: 'K', value: 10, tex: 'T_d' }
      },
      note: 'About 10 K for silicon junction leakage; treat it as an estimate, not a law.',
      stories: { I: 'A diode leaks {I0} at 25 °C. Estimate its leakage after a temperature rise of {dT}.' }
    }
  ],
  examples: [
    {
      title: 'How scarce are the minority carriers?',
      q: 'Silicon ($5\\times10^{22}$ atoms per cm³, $n_i = 10^{10}$ cm⁻³) is doped with $10^{16}$ phosphorus atoms per cm³. Find the electron and hole concentrations and the fraction of atoms that are dopant.',
      steps: [
        'Each phosphorus atom donates one electron: $n \\approx N_D = 10^{16}$ cm⁻³.',
        'Mass-action law: $p = n_i^2/n = 10^{20}/10^{16} = 10^{4}$ cm⁻³.',
        'Dopant fraction: $10^{16}/(5\\times10^{22}) = 2\\times10^{-7}$ — one atom in five million.',
        'There are $10^{12}$ times more electrons than holes. Yet the holes matter: in a [[pn-diode|p–n junction]] it is the minority carriers injected across the junction that carry the forward current.'
      ],
      a: 'n ≈ 10¹⁶ cm⁻³, p ≈ 10⁴ cm⁻³; one dopant atom per five million silicon atoms.'
    },
    {
      title: 'Leakage in a hot enclosure',
      q: 'A small-signal diode leaks 5 nA at 25 °C. Estimate the leakage inside an enclosure at 85 °C.',
      steps: [
        'The rise is $\\Delta T = 60$ K, six doubling intervals of 10 K.',
        '$I = 5\\ \\mathrm{nA} \\times 2^{6} = 5 \\times 64 = 320\\ \\mathrm{nA}$.',
        'Harmless on a 1 mA signal; not harmless across a 10 MΩ sensor divider or a sample-and-hold capacitor, where 0.3 µA is a large error.'
      ],
      a: 'About 0.3 µA — sixty-four times the room-temperature value.'
    }
  ],
  quiz: [
    { q: 'Adding a few parts per million of phosphorus to silicon makes it…', choices: ['p-type, with holes as majority carriers', 'n-type, with electrons as majority carriers', 'an insulator', 'negatively charged'], a: 1,
      why: 'Phosphorus has five outer electrons; four go into bonds and the fifth is easily freed. The material stays neutral: each donor left behind is a positive ion.' },
    { q: 'In n-type silicon, doubling the donor concentration makes the hole concentration…', choices: ['double', 'stay the same', 'halve', 'fall to a quarter'], a: 2,
      why: 'np = nᵢ² at a given temperature, so doubling n halves p.' },
    { q: 'Why can a silicon-carbide MOSFET block 1200 V in a thinner, less resistive layer than silicon?', choices: ['Its electrons are faster', 'Its wide band gap lets it withstand a much stronger electric field before breaking down', 'It has no holes', 'It is a better conductor of heat only'], a: 1,
      why: 'A wider band gap means a much higher critical field for avalanche, so the voltage can be held across a thinner, more heavily doped drift region with far lower resistance. (Its good thermal conductivity helps too, but it is not the reason.)' },
    { q: 'A transistor\'s leakage current is 10 nA at 25 °C. Roughly what is it at 105 °C?', choices: ['20 nA', '80 nA', '2.6 µA', '10 mA'], a: 2,
      why: '80 °C is eight doublings: 10 nA × 2⁸ = 2.56 µA. Leakage is exponential in temperature.' },
    { q: 'A hole in silicon is a missing electron in a bond, and it moves because neighbouring electrons fill it one after another.', a: true,
      why: 'That is exactly what it is; treating it as a positive particle with its own mobility is a bookkeeping device that works very well.' }
  ],
  applications: ['Every diode, transistor, LED, solar cell and integrated circuit.', 'Choosing between Si, SiC and GaN power devices for a converter.', 'Estimating leakage at high temperature for precision and battery-powered designs.'],
  history: 'The first semiconductor devices were crystal detectors in early radio receivers, around 1906. Controlled doping, and with it the junction transistor (1948–51), came from the wartime and post-war work on purified germanium and silicon.'
},

{
  id: 'pn-diode', parent: 'diode-basics', title: 'The p–n junction diode', level: 1,
  short: 'A junction of p- and n-type silicon passes current one way and blocks it the other; the forward current grows exponentially with voltage, which is why silicon diodes "turn on" at about 0.6–0.7 V.',
  keywords: ['diode', 'p-n junction', 'pn junction', 'depletion region', 'forward bias', 'reverse bias', 'Shockley equation', 'saturation current', 'thermal voltage', 'ideality factor', 'forward voltage', 'leakage', 'breakdown', '1N4148', '1N4007', 'anode', 'cathode'],
  prereq: ['semiconductor-basics', 'physics:pn-junction', 'math:exponential-functions'],
  related: ['diode-models', 'diode-types', 'zener-diodes', 'half-wave-rectifier', 'leds'],
  body: `
Put p-type and n-type silicon side by side in one crystal. Electrons from the n side diffuse into the p side and fill holes; holes diffuse the other way. Near the junction the free carriers wipe each other out, leaving a thin **depletion region** — a fraction of a micrometre — that contains only the fixed, charged dopant ions: positive on the n side, negative on the p side. Their field pushes back against further diffusion, and a balance is reached with a **built-in potential** of roughly 0.6–0.8 V across the junction in silicon.

That barrier is what makes a one-way valve.

### Forward and reverse
- **Forward bias** (anode, the p side, positive): the applied voltage lowers the barrier. The number of carriers energetic enough to cross grows exponentially as the barrier drops, and a large current flows.
- **Reverse bias:** the barrier rises and the depletion region widens. Only the handful of minority carriers made by heat drift across — the tiny **saturation current** $I_S$ — until, at a high enough voltage, the junction breaks down.

### The diode equation
Shockley's equation captures both directions:

$$I = I_S\\left(e^{V/(nV_T)} - 1\\right), \\qquad V_T = \\frac{k_B T}{e} \\approx 25.7\\ \\mathrm{mV\\ at\\ 25\\ °C}$$

$I_S$ is minute — about $10^{-14}$ A for a small silicon junction, a few nA in the models of real parts that fold in other effects — and the **ideality factor** $n$ lies between 1 and 2. Three consequences are worth memorising:
- **The "turn-on" voltage is not a threshold.** The current is exponential everywhere; it just becomes *useful* (milliamps) at 0.6–0.7 V for silicon. At 0.3 V a small silicon diode passes only nanoamps to microamps.
- **About 60 mV per decade.** Each tenfold increase in current adds $nV_T \\ln 10 \\approx 60n$ mV. A 1N4148 reads about 0.58 V at 1 mA and 0.69 V at 10 mA: a big change of current, a small change of voltage.
- **About −2 mV per °C.** At a constant current the forward voltage falls roughly 2 mV for every degree of warming — reliable enough that the temperature sensors in processors are diode junctions.

Reverse current is $-I_S$ in theory; in practice leakage is larger and roughly doubles every 10 °C. At the **reverse breakdown voltage** the current rises abruptly; ordinary diodes must never reach it, [[zener-diodes|Zener diodes]] are built to live there.

### Real diodes and their datasheets
The symbol's arrow points in the direction of conventional forward current; the **band** on the package marks the **cathode**. The numbers that matter:

| Parameter | Meaning | 1N4148 | 1N4007 |
|---|---|---|---|
| $V_{RRM}$ | repetitive peak reverse voltage | 100 V | 1000 V |
| $I_{F(AV)}$ | average forward current | about 150 mA | 1 A |
| $I_{FSM}$ | one-off surge current | a few A (µs) | 30 A (one half-cycle) |
| $V_F$ | forward voltage at a stated current | ≤ 1 V at 10 mA | ≤ 1.1 V at 1 A |
| $t_{rr}$ | reverse recovery time | 4 ns | microseconds |

Two parasitic effects limit speed: the **junction capacitance** of the depletion region (a few pF for a 1N4148), and the **stored charge** of a forward-biased junction, which must be swept out before it can block — see [[diode-types]].

> [!tip] A multimeter's diode range pushes about 1 mA and shows the forward voltage: 0.5–0.7 V for a good silicon diode, 0.15–0.4 V for a Schottky, "OL" in reverse. A reading near zero both ways is a shorted diode.
`,
  ideas: [
    'A p–n junction forms a depletion region whose built-in barrier blocks current until forward bias lowers it.',
    'The Shockley equation: current grows as e^(V/nV_T) forward and saturates at a tiny −I_S in reverse.',
    'Silicon diodes carry milliamps at 0.6–0.7 V; each tenfold current adds about 60n mV.',
    'At constant current the forward voltage falls about 2 mV/°C; leakage doubles about every 10 °C.',
    'Ratings to respect: peak reverse voltage, average and surge current, and recovery time.'
  ],
  pitfalls: [
    'A diode is off below 0.7 V and fully on above it — The current is exponential: there is no threshold, only a voltage at which the current becomes large enough to matter for your circuit.',
    'You can measure the built-in potential with a voltmeter — The contact potentials at the metal leads cancel it exactly; an unbiased diode delivers no voltage or power.',
    'Reverse current is exactly I_S — Real leakage is larger (generation in the depletion region, surface leakage) and grows steeply with temperature and voltage.'
  ],
  formulas: [
    {
      name: 'Shockley diode equation',
      expr: 'I = Is*(exp(V/(n*VT)) - 1)', tex: 'I = I_S\\left(e^{V/(n V_T)} - 1\\right)',
      vars: {
        I: { name: 'diode current', q: 'current', unit: 'mA', signed: true },
        Is: { name: 'saturation current', q: 'current', unit: 'nA', value: 2.52, tex: 'I_S' },
        V: { name: 'voltage across the diode', q: 'voltage', unit: 'V', value: 0.65, signed: true },
        n: { name: 'ideality (emission) factor', value: 1.75, min: 1, max: 3 },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.7, tex: 'V_T' }
      },
      note: 'The defaults are a model of the 1N4148 at 25 °C. Series resistance is ignored, so at high currents the real voltage is somewhat higher.',
      stories: { I: 'A diode with $I_S$ = {Is} and $n$ = {n} has {V} across it at room temperature ($V_T$ = {VT}). What current flows?', V: 'What voltage does a diode with $I_S$ = {Is} and $n$ = {n} need to pass {I} ($V_T$ = {VT})?' },
      practice: { unknowns: ['I', 'V'] }
    },
    {
      name: 'Thermal voltage',
      expr: 'VT = kB*T/qe', tex: 'V_T = \\frac{k_B T}{e}',
      vars: {
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', tex: 'V_T' },
        kB: { const: 'kB' },
        T: { name: 'junction temperature', q: 'temperature', unit: '°C', value: 25 },
        qe: { const: 'qe' }
      },
      stories: { VT: 'What is the thermal voltage of a junction at {T}?' }
    },
    {
      name: 'Voltage change for a current ratio',
      expr: 'dV = n*VT*ln(I2/I1)', tex: '\\Delta V = n V_T \\ln\\frac{I_2}{I_1}',
      vars: {
        dV: { name: 'increase in forward voltage', q: 'voltage', unit: 'mV', tex: '\\Delta V', signed: true },
        n: { name: 'ideality factor', value: 1.75, min: 1, max: 3 },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.7, tex: 'V_T' },
        I2: { name: 'new current', q: 'current', unit: 'mA', value: 10, tex: 'I_2' },
        I1: { name: 'old current', q: 'current', unit: 'mA', value: 1, tex: 'I_1' }
      },
      note: 'Follows from the Shockley equation once $I \\gg I_S$. For $n = 1$ a decade of current costs 59 mV at 25 °C.',
      stories: { dV: 'A diode ($n$ = {n}) passes {I1}. By how much does its voltage rise when the current becomes {I2}?' }
    },
    {
      name: 'Forward voltage at another temperature',
      expr: 'VF = VF0 + TC*(T - T0)', tex: 'V_F = V_{F0} + \\mathrm{TC}\\,(T - T_0)',
      vars: {
        VF: { name: 'forward voltage at T', q: 'voltage', unit: 'V', tex: 'V_F' },
        VF0: { name: 'forward voltage at T₀', q: 'voltage', unit: 'V', value: 0.62, tex: 'V_{F0}' },
        TC: { name: 'temperature coefficient', unit: 'V/K', value: -0.002, signed: true, tex: '\\mathrm{TC}' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 85 },
        T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_0' }
      },
      note: 'At a constant current. About −2 mV/K for silicon at small currents, less at high currents where series resistance takes over.',
      stories: { VF: 'A diode reads {VF0} at {T0} and 1 mA. What will it read at {T}, same current?', T: 'The diode, biased at 1 mA, now reads {VF}. How hot is it?' }
    }
  ],
  derivation: {
    title: 'Why a decade of current costs about 60 mV',
    steps: [
      { text: 'Well into forward conduction the exponential is huge, so drop the −1:', tex: 'I \\approx I_S\\, e^{V/(nV_T)} \\;\\Rightarrow\\; V = nV_T \\ln\\frac{I}{I_S}' },
      { text: 'Compare two currents through the same diode; $I_S$ cancels:', tex: 'V_2 - V_1 = nV_T\\left(\\ln\\frac{I_2}{I_S} - \\ln\\frac{I_1}{I_S}\\right) = nV_T \\ln\\frac{I_2}{I_1}' },
      { text: 'For a factor of ten at 25 °C, using [[math:logarithms|logarithms]]:', tex: '\\Delta V = n \\times 25.7\\ \\mathrm{mV} \\times \\ln 10 = n \\times 59.2\\ \\mathrm{mV}' }
    ]
  },
  examples: [
    {
      title: 'A 1N4148 at 1 mA and 10 mA',
      q: 'Model a 1N4148 with $I_S = 2.52$ nA, $n = 1.75$ and a series resistance of 0.57 Ω. Find its forward voltage at 1 mA and at 10 mA, at 25 °C.',
      steps: [
        '$nV_T = 1.75 \\times 25.7\\ \\mathrm{mV} = 45.0\\ \\mathrm{mV}$.',
        'At 1 mA: $V = 45.0\\ \\mathrm{mV} \\times \\ln(10^{-3}/2.52\\times10^{-9}) = 45.0 \\times 12.89 = 580\\ \\mathrm{mV}$; the resistance adds 0.6 mV.',
        'At 10 mA: add $45.0 \\times \\ln 10 = 104\\ \\mathrm{mV}$, and 5.7 mV across the series resistance: $580 + 104 + 6 = 690\\ \\mathrm{mV}$.',
        'Ten times the current for 110 mV more — typical of a small silicon diode, and within its datasheet limit of 1 V at 10 mA.'
      ],
      a: 'About 0.58 V at 1 mA and 0.69 V at 10 mA.'
    },
    {
      title: 'A diode as a thermometer',
      q: 'A 1N4148 fed with a constant 1 mA reads 0.620 V at 25 °C. Taking −2.0 mV/°C, what is the temperature when it reads 0.540 V?',
      steps: [
        'The voltage has fallen by $0.620 - 0.540 = 0.080\\ \\mathrm{V}$.',
        '$\\Delta T = -0.080\\ \\mathrm{V} / (-0.0020\\ \\mathrm{V/°C}) = +40\\ °C$.',
        '$T = 25 + 40 = 65\\ °C$. For better than a few degrees, calibrate each diode: the coefficient varies from part to part and with current.'
      ],
      a: 'About 65 °C.'
    }
  ],
  quiz: [
    { q: 'A silicon diode with n = 1 passes 1 mA at 0.60 V. Ignoring series resistance, about what voltage does it need for 100 mA?', choices: ['0.62 V', '0.72 V', '0.90 V', '60 V'], a: 1,
      why: 'Two decades at about 59 mV each: 0.60 + 0.12 ≈ 0.72 V. The exponential makes the voltage nearly constant over a huge range of current.' },
    { q: 'Connecting a sensitive voltmeter across a lone diode shows its built-in potential of about 0.7 V.', a: false,
      why: 'In equilibrium the built-in potential is exactly cancelled by the contact potentials where the metal leads meet the silicon. No current or energy can be drawn from it.' },
    { q: 'At a constant 1 mA, a silicon diode is warmed from 25 °C to 75 °C. Its forward voltage…', choices: ['rises by about 100 mV', 'falls by about 100 mV', 'does not change', 'falls to zero'], a: 1,
      why: 'About −2 mV/°C over 50 °C gives −100 mV. The saturation current grows so fast with temperature that less voltage is needed for the same current.' },
    { q: 'What current flows through a small silicon diode reverse-biased at 10 V, well below breakdown?', choices: ['About 10 mA', 'Nanoamps of leakage', 'Exactly zero', 'The same as forward, but negative'], a: 1,
      why: 'Only thermally generated minority carriers cross: nanoamps at room temperature (more when hot). It is small, not zero.' },
    { q: 'On a 1N4007, the silver band marks…', choices: ['the anode', 'the cathode', 'the maximum current', 'nothing electrical'], a: 1,
      why: 'The band corresponds to the bar in the symbol: the cathode. Conventional current flows into the anode and out of the banded end when the diode conducts.' }
  ],
  applications: ['Rectifiers in every mains-powered product.', 'Reverse-polarity protection and steering diodes.', 'On-chip temperature sensors (a junction at constant current).', 'Clamping inputs to the supply rails in logic and microcontroller pins.'],
  history: 'Russell Ohl found the p–n junction by accident at Bell Laboratories in 1940, noticing that a cracked silicon rod generated a voltage under light. William Shockley published the theory, and the equation that bears his name, in 1949.',
  sim: 'dio-iv'
},

{
  id: 'diode-models', parent: 'diode-basics', title: 'Diode models: ideal, 0.7 V and Shockley', level: 2,
  short: 'Engineers solve diode circuits with the simplest model that is accurate enough: an ideal switch, a fixed 0.7 V drop, a drop plus a resistance, or the full exponential.',
  keywords: ['diode model', 'ideal diode', 'constant voltage drop', '0.7 V', 'piecewise linear', 'load line', 'operating point', 'small-signal resistance', 'dynamic resistance', 'iteration', 'assumed states'],
  prereq: ['pn-diode', 'kirchhoffs-laws', 'math:logarithms'],
  related: ['diode-types', 'half-wave-rectifier', 'thevenin-norton', 'bjt-operation'],
  body: `
The Shockley equation is accurate, but put a diode in series with a resistor and it cannot be solved in closed form: the current depends on the voltage exponentially, the voltage on the current linearly. So engineers keep a ladder of models and use the lowest rung that answers the question.

### 1. The ideal switch
Forward: a short circuit. Reverse: an open circuit. It is the right model when the voltages are large compared with a volt — a 230 V mains rectifier, or a 24 V relay supply — and for working out *which* diodes conduct before worrying how much.

### 2. The constant drop
Forward: a fixed voltage source $V_{on}$ — **0.7 V** for silicon (0.6 V at small currents), **0.3–0.4 V** for a Schottky, 1.8–3.3 V for an LED. Reverse: open. This is the everyday hand model; it is typically within 0.1 V of the truth. With a supply $V_s$ and resistor $R$:

$$I = \\frac{V_s - V_{on}}{R}$$

### 3. Drop plus resistance
For power diodes carrying amps the bulk resistance matters: $V = V_0 + I r_D$. A 1N4007 fits $0.76\\ \\mathrm{V} + 0.16\\ \\Omega \\times I$ between 0.1 A and 1 A, which is how rectifier losses are usually estimated.

### 4. The exponential
The full model, $V = nV_T\\ln(1 + I/I_S) + IR_S$, is what a circuit simulator uses. By hand there are two ways in:
- **The load line.** Plot the diode's curve and the resistor's line $I = (V_s - V)/R$ on the same axes: the operating point is where they cross. Changing $V_s$ slides the line; changing $R$ tilts it.
- **Iteration.** Guess a current, get the diode voltage from the logarithm, get a better current from the resistor, repeat. Because the logarithm is so flat, two or three rounds give three significant figures.

### Small signals: the diode as a resistor
Around a steady bias current $I_D$ the curve is nearly straight over a few millivolts, and its slope is a resistance:

$$r_d = \\frac{nV_T}{I_D} \\approx \\frac{26\\ \\mathrm{mV}}{I_D}\\ (n = 1)$$

26 Ω at 1 mA, 2.6 Ω at 10 mA. The same $26\\ \\mathrm{mV}/I$ reappears as the emitter resistance $r_e$ of a [[bjt-operation|bipolar transistor]], and it lets a bias current control an attenuator or a mixer.

### Several diodes: assume, solve, check
With more than one diode, guess which are on, replace them by the constant-drop model, solve the now-linear circuit with [[kirchhoffs-laws|Kirchhoff's laws]], then check: every "on" diode must carry forward current and every "off" one must have less than $V_{on}$ across it. If a check fails, change that guess and solve again.

> [!warn] Diodes in parallel do not share. A silicon diode across a red LED clamps the node at 0.65 V and the LED never lights; two "identical" rectifiers in parallel hog current unequally because of the −2 mV/°C drift. Give each its own resistor, or use one larger part.
`,
  ideas: [
    'Choose the simplest model that is accurate enough for the question.',
    'Ideal switch for large voltages; 0.7 V drop for everyday design; drop + resistance for power diodes.',
    'The exact operating point is where the diode curve meets the resistor\'s load line.',
    'For small signals a biased diode is a resistance r_d = nV_T/I_D (26 Ω at 1 mA).',
    'With several diodes: assume states, solve the linear circuit, check the assumptions.'
  ],
  pitfalls: [
    'The 0.7 V model is always good enough — With a 1 V supply it is 34 % off, and it cannot tell you how a voltage shifts with current or temperature.',
    'The small-signal resistance is V/I at the operating point — V/I is 650 Ω at 1 mA; the slope nV_T/I is 26 Ω. They differ by a factor of about 25.',
    'Diodes in parallel share current equally — The one with the lowest drop takes most of it, gets hotter, and takes even more.'
  ],
  formulas: [
    {
      name: 'Constant-drop model with a series resistor',
      expr: 'I = (Vs - Von)/R', tex: 'I = \\frac{V_s - V_{on}}{R}',
      vars: {
        I: { name: 'diode current', q: 'current', unit: 'mA' },
        Vs: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        Von: { name: 'assumed forward drop', q: 'voltage', unit: 'V', value: 0.7, tex: 'V_{on}' },
        R: { name: 'series resistance', q: 'resistance', unit: 'kΩ', value: 1 }
      },
      stories: { I: 'A silicon diode is fed from {Vs} through {R}. With the {Von} model, what current flows?', R: 'What resistor sets a current of {I} through a diode ({Von}) from {Vs}?' }
    },
    {
      name: 'Exact operating point (Shockley diode and a resistor)',
      expr: 'Vs = I*R + n*VT*ln(I/Is + 1)', tex: 'V_s = I R + n V_T \\ln\\left(\\frac{I}{I_S} + 1\\right)',
      vars: {
        Vs: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        I: { name: 'current', q: 'current', unit: 'mA' },
        R: { name: 'series resistance', q: 'resistance', unit: 'kΩ', value: 1 },
        n: { name: 'ideality factor', value: 1.75, min: 1, max: 3 },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.7, tex: 'V_T' },
        Is: { name: 'saturation current', q: 'current', unit: 'nA', value: 2.52, tex: 'I_S' }
      },
      solveFor: 'I',
      note: 'Kirchhoff\'s voltage law around the loop. The current appears twice, so it is found numerically — the calculator does the iteration for you. Defaults: a 1N4148.',
      stories: { I: 'A 1N4148 ($I_S$ = {Is}, $n$ = {n}) is fed from {Vs} through {R}. What current flows, exactly?' },
      practice: { unknowns: ['I', 'R'] }
    },
    {
      name: 'Small-signal (dynamic) resistance',
      expr: 'rd = n*VT/ID', tex: 'r_d = \\frac{n V_T}{I_D}',
      vars: {
        rd: { name: 'small-signal resistance', q: 'resistance', unit: 'Ω', tex: 'r_d' },
        n: { name: 'ideality factor', value: 1, min: 1, max: 3 },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.7, tex: 'V_T' },
        ID: { name: 'bias current', q: 'current', unit: 'mA', value: 1, tex: 'I_D' }
      },
      stories: { rd: 'A diode ($n$ = {n}) is biased at {ID}. What resistance does it present to a small signal?' }
    },
    {
      name: 'Piecewise-linear power-diode model',
      expr: 'V = V0 + I*rD', tex: 'V = V_0 + I r_D',
      vars: {
        V: { name: 'forward voltage', q: 'voltage', unit: 'V' },
        V0: { name: 'intercept voltage', q: 'voltage', unit: 'V', value: 0.76, tex: 'V_0' },
        I: { name: 'forward current', q: 'current', unit: 'A', value: 1 },
        rD: { name: 'slope resistance', q: 'resistance', unit: 'Ω', value: 0.16, tex: 'r_D' }
      },
      note: 'Defaults: a 1N4007 between 0.1 A and 1 A. Fit $V_0$ and $r_D$ from two points on the datasheet curve.',
      stories: { V: 'A rectifier modelled as {V0} plus {rD} carries {I}. What is its forward voltage?' }
    }
  ],
  examples: [
    {
      title: 'Three models, one circuit',
      q: 'A 1N4148 ($I_S = 2.52$ nA, $n = 1.75$) is fed from 5 V through 1 kΩ at 25 °C. Find the current with the ideal, the 0.7 V and the exponential models.',
      steps: [
        'Ideal switch: $I = 5\\ \\mathrm{V}/1\\ \\mathrm{k\\Omega} = 5.0\\ \\mathrm{mA}$.',
        'Constant drop: $I = (5 - 0.7)/1\\ \\mathrm{k\\Omega} = 4.3\\ \\mathrm{mA}$.',
        'Exponential, by iteration ($nV_T = 45.0$ mV). Start from 4.3 mA: $V = 45.0\\ \\mathrm{mV} \\times \\ln(4.3\\ \\mathrm{mA}/2.52\\ \\mathrm{nA}) = 0.646\\ \\mathrm{V}$, so $I = (5 - 0.646)/1000 = 4.354\\ \\mathrm{mA}$.',
        'Once more: $V = 45.0\\ \\mathrm{mV} \\times \\ln(4.354\\ \\mathrm{mA}/2.52\\ \\mathrm{nA}) = 0.647\\ \\mathrm{V}$ (0.649 V with the series resistance), $I = 4.35\\ \\mathrm{mA}$. Converged.',
        'The 0.7 V model is within 1 %; the ideal model 15 % high. With a 5 V supply either would do for most purposes.'
      ],
      a: '5.0 mA (ideal), 4.3 mA (0.7 V), 4.35 mA at 0.649 V (exact).'
    },
    {
      title: 'When the simple models fail',
      q: 'Repeat with a 1.0 V supply and the same 1 kΩ.',
      steps: [
        'Ideal: 1.0 mA. Constant drop: $(1.0 - 0.7)/1\\ \\mathrm{k\\Omega} = 0.30\\ \\mathrm{mA}$.',
        'Iterate from 0.30 mA: $V = 45.0\\ \\mathrm{mV} \\times \\ln(0.30\\ \\mathrm{mA}/2.52\\ \\mathrm{nA}) = 0.526\\ \\mathrm{V} \\Rightarrow I = 0.474\\ \\mathrm{mA}$.',
        'Next: $V = 0.547\\ \\mathrm{V} \\Rightarrow I = 0.453\\ \\mathrm{mA}$; then $V = 0.545\\ \\mathrm{V} \\Rightarrow I = 0.455\\ \\mathrm{mA}$.',
        'The ideal model is 120 % high and the 0.7 V model 34 % low. With supplies of a volt or two, only the exponential (or a measured curve) will do.'
      ],
      a: 'About 0.455 mA at 0.545 V.'
    },
    {
      title: 'Which one lights?',
      q: 'A 5 V supply feeds a 330 Ω resistor into a node; from that node a 1N4148 and a red LED ($V_F$ ≈ 1.9 V) both go to ground. Which conducts, and what current flows?',
      steps: [
        'Assume both conduct: the node would have to be at 0.65 V and 1.9 V at once — impossible.',
        'Assume only the silicon diode conducts: the node sits at about 0.7 V, so $I \\approx (5 - 0.7)/330 = 13\\ \\mathrm{mA}$.',
        'Check the LED: 0.7 V across it is far below its 1.9 V, so at that voltage it passes essentially nothing. The assumption holds.',
        'The LED stays dark. A lower-drop path in parallel always wins.'
      ],
      a: 'Only the 1N4148 conducts (about 13 mA); the LED stays dark.'
    }
  ],
  quiz: [
    { q: 'A 24 V supply feeds a silicon diode through 2.2 kΩ. Which model gives the current within about 3 %?', choices: ['Only the full Shockley equation', 'The constant-drop model, or even the ideal switch', 'None; a simulator is needed', 'The small-signal model'], a: 1,
      why: 'Ideal: 24/2.2k = 10.9 mA. 0.7 V model: 23.3/2.2k = 10.6 mA. The exact answer is about 10.6 mA, so the 0.7 V model is essentially right and even the ideal switch is only 3 % high. With large voltages the drop hardly matters.' },
    { q: 'What small-signal resistance does a diode (n = 1) present when biased at 2 mA at 25 °C?', answer: 12.85, unit: 'Ω',
      why: 'r_d = nV_T/I_D = 25.7 mV / 2 mA ≈ 12.9 Ω.' },
    { q: 'Doubling the series resistor in a 5 V diode circuit roughly halves the current, while the diode voltage falls by only about nV_T ln 2 (some 20–35 mV).', a: true,
      why: 'The logarithm is flat: halving the current changes the voltage by nV_T ln 2 = 18 mV × n. That flatness is why the constant-drop model works.' },
    { q: 'A silicon diode and a red LED are connected in parallel, fed through one resistor from 5 V. What happens?', choices: ['Both light', 'The LED lights, the diode is off', 'The silicon diode conducts and the LED stays dark', 'The resistor overheats'], a: 2,
      why: 'The silicon diode clamps the node at about 0.7 V, far below the LED\'s forward voltage.' },
    { q: 'In the load-line picture, raising the supply voltage while keeping R fixed…', choices: ['tilts the line', 'slides the line parallel to itself to the right', 'changes the diode curve', 'has no effect on the operating point'], a: 1,
      why: 'The line I = (V_s − V)/R keeps its slope −1/R; its intercepts V_s and V_s/R both move outwards.' }
  ],
  applications: ['Hand design of rectifiers, clamps and LED drivers.', 'Estimating rectifier losses with the drop-plus-resistance model.', 'Diode-biased attenuators and the r_e of transistor amplifiers.', 'Sanity-checking simulator results.'],
  sim: 'dio-iv'
},

{
  id: 'zener-diodes', parent: 'diode-basics', title: 'Zener diodes', level: 2,
  short: 'A diode made to break down at a precise reverse voltage and survive it — a voltage reference, a clamp and a regulator in one small part.',
  keywords: ['Zener diode', 'breakdown', 'avalanche', 'Zener effect', 'reference voltage', 'BZX55', 'BZX79', '1N4733', 'dynamic resistance', 'knee current', 'temperature coefficient', 'TVS', 'transient voltage suppressor', 'TL431'],
  prereq: ['pn-diode', 'diode-models'],
  related: ['zener-regulator', 'clippers-clampers', 'linear-regulators', 'fuses-protection', 'flyback-diode'],
  body: `
Reverse-bias any diode far enough and it breaks down: the current, nanoamps a moment before, suddenly rises steeply. An ordinary rectifier is destroyed if that happens with much current. A **Zener diode** is doped so that breakdown happens at a well-defined voltage, from about 2.4 V to 200 V, and built so it can carry current there indefinitely — as long as the power stays within its rating. Used in reverse, it is a nearly constant voltage: a **reference** and a **clamp**.

In the forward direction it is just a diode (about 0.7 V). In the symbol the cathode bar has bent ends; the cathode goes to the more positive side when it is regulating.

### Two ways to break down
- **Zener (tunnelling) breakdown**, below about 5 V: the junction is so heavily doped and so thin that electrons tunnel straight through the barrier. Its voltage *falls* as the temperature rises.
- **Avalanche breakdown**, above about 6 V: carriers accelerated across a wider junction knock out more carriers, which knock out more. Its voltage *rises* with temperature.

Around **5–6 V** the two mechanisms overlap and the temperature coefficient passes through zero. Typical figures: about −2 mV/K for a 3.3 V part, near zero for 5.1–5.6 V, about +2 mV/K for 6.2 V and +8 mV/K for 12 V. The classic temperature-compensated reference puts a 6.2 V Zener in series with a forward-biased diode, whose −2 mV/K cancels the Zener's +2 mV/K.

### Reading the datasheet
Take the **BZX55C5V1**, a 500 mW glass part:
- $V_Z$ = 5.1 V at the test current $I_{ZT}$ = 5 mA. The **C** means ±5 % (4.8–5.4 V); **B** parts are ±2 %.
- **Dynamic resistance** $r_z$: the slope of the curve beyond the knee, tens of ohms at 5 mA. The voltage rises by $r_z \\Delta I$ as the current rises.
- **Knee current** $I_{ZK}$: below about 1 mA the voltage sags and is poorly defined. Keep at least 1–5 mA flowing.
- **Power** $P_{tot}$ = 500 mW (1 W for the 1N4728–1N4764 family, 5 W for the 1N53xx), with a maximum current $I_{ZM} = P/V_Z$ at 25 °C, less when hot.

Voltages come in the E24 steps: 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 10, 11, 12 V and so on.

### Where they are good, and where not
Zeners are cheap and robust for **coarse regulation** (a few percent), **over-voltage clamps**, **level shifting** (a Zener in series drops a fixed voltage) and **limiting** a signal. They are poor below about 4.7 V: the knee is soft, the slope resistance high and the leakage below $V_Z$ significant. For accurate references use a **shunt reference** such as the TL431 (2.495 V, adjustable up to 36 V, with a slope resistance of a fraction of an ohm) or an LM4040.

Their big cousins, **TVS diodes** (transient voltage suppressors such as the SMBJ and P6KE series), are avalanche diodes built to swallow hundreds of watts for a millisecond — the standard protection on data lines, 24 V industrial inputs and automotive supplies.

> [!warn] A Zener needs something to limit its current. Connected straight across a supply above $V_Z$ it conducts as hard as the supply allows and fails — normally short-circuit. Always put a resistor (or a current-limited source) in front: see [[zener-regulator]].
`,
  ideas: [
    'A Zener diode is designed to conduct safely in reverse breakdown at a specified voltage.',
    'Below ~5 V it breaks down by tunnelling (negative tempco); above ~6 V by avalanche (positive tempco).',
    'Near 5–6 V the temperature coefficient is close to zero; 6.2 V plus a forward diode makes a stable reference.',
    'Keep the current above the knee (1–5 mA) and the power below the rating: I_ZM = P/V_Z.',
    'Its voltage rises with current through the dynamic resistance r_z.'
  ],
  pitfalls: [
    'A Zener holds exactly its rated voltage — The rating is at the test current, within ±2–5 %; the voltage moves with current (r_z) and temperature.',
    'Low-voltage Zeners make good references — Below about 4.7 V the knee is soft and the slope resistance high; a TL431 or LM4040 is far better.',
    'A Zener can be connected directly across a supply to clip it — Without a series resistance it takes unlimited current and burns out.'
  ],
  formulas: [
    {
      name: 'Maximum Zener current',
      expr: 'Izm = P/Vz', tex: 'I_{ZM} = \\frac{P_{tot}}{V_Z}',
      vars: {
        Izm: { name: 'maximum Zener current', q: 'current', unit: 'mA', tex: 'I_{ZM}' },
        P: { name: 'power rating', q: 'power', unit: 'mW', value: 500, tex: 'P_{tot}' },
        Vz: { name: 'Zener voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_Z' }
      },
      stories: { Izm: 'What is the most current a {P}, {Vz} Zener can carry (at 25 °C)?', P: 'A {Vz} Zener must carry up to {Izm}. What power rating does it need, before derating?' }
    },
    {
      name: 'Zener voltage away from the test current',
      expr: 'Vz = Vzt + rz*(Iz - Izt)', tex: 'V_Z = V_{ZT} + r_z\\,(I_Z - I_{ZT})',
      vars: {
        Vz: { name: 'Zener voltage at I_Z', q: 'voltage', unit: 'V', tex: 'V_Z' },
        Vzt: { name: 'rated voltage at the test current', q: 'voltage', unit: 'V', value: 5.1, tex: 'V_{ZT}' },
        rz: { name: 'dynamic resistance', q: 'resistance', unit: 'Ω', value: 15, tex: 'r_z' },
        Iz: { name: 'actual Zener current', q: 'current', unit: 'mA', value: 20, tex: 'I_Z' },
        Izt: { name: 'test current', q: 'current', unit: 'mA', value: 5, tex: 'I_{ZT}' }
      },
      note: 'A straight-line approximation above the knee.',
      stories: { Vz: 'A {Vzt} Zener (rated at {Izt}, $r_z$ = {rz}) carries {Iz}. What voltage does it hold?' }
    },
    {
      name: 'Power rating at a higher temperature (linear derating)',
      expr: 'P = P0*(Tj - Ta)/(Tj - T0)', tex: 'P = P_0\\,\\frac{T_{j} - T_a}{T_{j} - T_0}',
      vars: {
        P: { name: 'allowed power at T_a', q: 'power', unit: 'mW' },
        P0: { name: 'rated power at T₀', q: 'power', unit: 'mW', value: 500, tex: 'P_0' },
        Tj: { name: 'maximum junction temperature', q: 'temperature', unit: '°C', value: 175, tex: 'T_{j}' },
        Ta: { name: 'ambient (or lead) temperature', q: 'temperature', unit: '°C', value: 70, tex: 'T_a' },
        T0: { name: 'temperature of the rating', q: 'temperature', unit: '°C', value: 25, tex: 'T_0' }
      },
      note: 'The allowed power falls linearly from the rating to zero at the maximum junction temperature. Check the datasheet\'s own curve; many ratings also assume short leads soldered to copper.',
      stories: { P: 'A {P0} Zener (rated at {T0}, $T_{j,max}$ = {Tj}) sits in an enclosure at {Ta}. What power may it dissipate?' }
    }
  ],
  examples: [
    {
      title: 'How hard can a 12 V Zener work?',
      q: 'A 500 mW, 12 V Zener is used at 70 °C ambient, maximum junction temperature 175 °C. What current may it carry, and what would you design for?',
      steps: [
        'At 25 °C: $I_{ZM} = 0.5\\ \\mathrm{W}/12\\ \\mathrm{V} = 41.7\\ \\mathrm{mA}$.',
        'Derated to 70 °C: $P = 500 \\times (175 - 70)/(175 - 25) = 350\\ \\mathrm{mW}$, so $I_{ZM} = 29\\ \\mathrm{mA}$.',
        'Design with a factor of two in hand: aim for no more than about 15 mA in the worst case (maximum input, no load).'
      ],
      a: '41.7 mA at 25 °C, 29 mA at 70 °C; design for about 15 mA.'
    },
    {
      title: 'A temperature-compensated reference',
      q: 'A 6.2 V Zener with a tempco of +2.2 mV/K at 7.5 mA is placed in series with a forward-biased 1N4148 (−2.0 mV/K at that current). How much does the pair drift between 0 °C and 50 °C, compared with the Zener alone?',
      steps: [
        'The pair: $V \\approx 6.2 + 0.65 = 6.85\\ \\mathrm{V}$, with a net coefficient $+2.2 - 2.0 = +0.2\\ \\mathrm{mV/K}$.',
        'Over 50 K: $0.2 \\times 50 = 10\\ \\mathrm{mV}$, about 0.15 %.',
        'The Zener alone: $2.2 \\times 50 = 110\\ \\mathrm{mV}$, about 1.8 %.',
        'Eleven times better — the principle of the 1N821-series reference diodes. The current must be held constant for it to work.'
      ],
      a: 'About 10 mV of drift instead of 110 mV.'
    }
  ],
  quiz: [
    { q: 'Which Zener voltage has the smallest temperature coefficient?', choices: ['2.4 V', 'about 5–6 V', '12 V', '47 V'], a: 1,
      why: 'Below about 5 V tunnelling dominates (negative tempco), above about 6 V avalanche (positive tempco). They balance around 5–6 V.' },
    { q: 'A Zener diode connected in the forward direction behaves like…', choices: ['an open circuit', 'an ordinary diode, about 0.7 V', 'a short circuit', 'a Zener at the same voltage'], a: 1,
      why: 'It is still a p–n junction; forward, it conducts at the usual silicon forward voltage.' },
    { q: 'A BZX55C5V1 carrying only 0.3 mA can be relied on to hold 5.1 V ± 5 %.', a: false,
      why: 'The tolerance is specified at 5 mA. At 0.3 mA the part is in or below the knee and the voltage is lower and poorly defined.' },
    { q: 'What is the maximum current of a 500 mW, 9.1 V Zener at 25 °C?', answer: 54.9, unit: 'mA',
      why: 'I_ZM = P/V_Z = 0.5 W / 9.1 V = 55 mA — before any derating for temperature.' },
    { q: 'You need a 2.5 V reference accurate to 1 %. The best choice is…', choices: ['a 2.4 V Zener', 'two 1.2 V Zeners in series', 'a shunt reference such as the TL431', 'a red LED'], a: 2,
      why: 'Low-voltage Zeners have soft knees and large slope resistance. A TL431 (2.495 V, 0.5–2 % grades) regulates far more tightly.' }
  ],
  applications: ['Simple shunt regulators and bias supplies.', 'Over-voltage clamps on inputs and gate drives (for example 15–18 V across a MOSFET gate).', 'Fast relay release: a Zener in series with the flyback diode.', 'TVS diodes protecting data lines and supply inputs from surges and ESD.'],
  history: 'The tunnelling breakdown mechanism was explained by Clarence Zener in 1934, in a paper on the breakdown of insulators; the name stuck to the diodes although most of them break down by avalanche.',
  sim: { id: 'dio-zener', params: { graph: 'line' } }
},

{
  id: 'diode-types', parent: 'diode-basics', title: 'Schottky, fast-recovery and other diodes', level: 2,
  short: 'The diode family: small-signal and rectifier diodes, fast-recovery and Schottky diodes for switching converters, varactors, PIN, TVS and bridge rectifiers — and how to choose.',
  keywords: ['Schottky diode', '1N5819', '1N5822', 'SS34', 'BAT54', 'fast recovery', 'ultrafast', 'UF4007', 'MUR160', 'reverse recovery', 'trr', 'Qrr', 'varactor', 'varicap', 'PIN diode', 'bridge rectifier', 'SiC Schottky', 'germanium', 'diode selection'],
  prereq: ['pn-diode', 'diode-models'],
  related: ['zener-diodes', 'buck-converter', 'flyback-diode', 'full-wave-rectifier', 'leds', 'photodiodes', 'converter-losses'],
  body: `
"A diode" on a schematic can mean a dozen quite different parts. They all conduct one way, but they trade forward voltage, blocking voltage, speed, leakage and capacitance differently.

### The family
| Kind | Examples | Used for | What sets it apart |
|---|---|---|---|
| Small-signal | 1N4148, 1N914, BAV99 | logic, clamps, small flyback | fast (4 ns), a few pF, ~150 mA |
| Rectifier | 1N4001–1N4007, 1N5408 | 50/60 Hz rectifiers | 1–3 A, up to 1000 V, slow (µs) |
| Fast / ultrafast recovery | FR107, UF4007, MUR160 | converters, snubbers | recovery 500 ns down to 25–75 ns |
| Schottky | BAT54, 1N5817–19, SS34, 1N5822 | low-voltage power, freewheeling, OR-ing | 0.3–0.5 V drop, no recovery, leaky |
| SiC Schottky | 650–1200 V parts | power-factor correction, inverters | no recovery at high voltage |
| Zener, TVS | BZX55, 1N47xx, SMBJ | references, clamps, surges | see [[zener-diodes]] |
| Varactor | tuning diodes | VCOs, PLLs, tuners | capacitance set by reverse voltage |
| PIN | RF PIN diodes | RF switches and attenuators | RF resistance set by DC current |
| Bridge | DB107, KBP206, GBU806 | mains rectification | four diodes in one package |
| Opto | LEDs, photodiodes | light | see [[leds]], [[photodiodes]] |

### Reverse recovery: why speed matters
A conducting p–n junction is full of stored minority carriers. When the circuit tries to reverse it, the diode first conducts *backwards* until that **stored charge** $Q_{rr}$ is swept out, taking the **reverse recovery time** $t_{rr}$. At 50 Hz nobody notices a few microseconds. In a converter switching at 100 kHz the reverse current flows through the transistor at full voltage every cycle — heating it, ringing, and radiating interference. The recovered charge costs roughly

$$P \\approx Q_{rr}\\, V_R\\, f$$

which is why a 1N4007 in a switching converter fails spectacularly, and why converter diodes are ultrafast or Schottky.

### Schottky diodes: low drop, no recovery, some leakage
A Schottky diode is a metal–semiconductor junction. Only majority carriers take part, so there is **no stored charge** — just its junction capacitance to charge — and the barrier is lower, giving a forward drop of **0.3–0.5 V** at rated current instead of 0.7–1 V. Two prices:
- **Leakage** is thousands of times larger than in a silicon p–n diode and rises steeply with temperature: a 1N5819 may leak milliamps at 100 °C near its rated voltage. In a hot converter that leakage heats the diode, which leaks more — thermal runaway is a real failure mode.
- **Blocking voltage** is modest: mostly 20–100 V (to about 200 V) in silicon. Above that, silicon-carbide Schottky diodes take over, at a drop of 1.3–1.7 V.

### Varactors
The depletion region is a capacitor whose plates move apart as the reverse voltage grows, so the capacitance falls:

$$C = \\frac{C_0}{(1 + V_R/V_{bi})^{m}}$$

with $m \\approx 0.5$ for an abrupt junction and larger for "hyperabrupt" tuning diodes. A voltage then tunes an LC circuit — the heart of every voltage-controlled oscillator in a [[pll|phase-locked loop]].

### Choosing a diode
1. **Reverse voltage:** $V_{RRM}$ at least 1.5–2 times the worst reverse voltage, transients included (for mains rectifiers a 1000 V 1N4007 costs nothing extra).
2. **Current:** the average current, with thermal margin, and the **surge** rating $I_{FSM}$ for capacitor inrush.
3. **Loss:** conduction loss $V_F \\times I_{avg}$ (plus $r_D I_{rms}^2$ at high current).
4. **Speed:** $t_{rr}$ and $Q_{rr}$ for anything switched faster than a few kHz.
5. **Leakage and temperature**, especially for Schottky diodes.
`,
  ideas: [
    'Diodes trade forward drop, blocking voltage, speed, leakage and capacitance differently.',
    'Stored charge makes p–n diodes conduct backwards briefly (t_rr); in fast converters that costs Q_rr·V·f.',
    'Schottky diodes: 0.3–0.5 V drop and no recovery, but high, temperature-sensitive leakage and limited voltage.',
    'A varactor\'s capacitance falls as its reverse voltage rises, which lets a voltage tune a circuit.',
    'Choose by voltage (with margin), average and surge current, loss, speed and leakage.'
  ],
  pitfalls: [
    'Any 1 A diode will do in a switching converter — A 1N4007\'s microsecond recovery at 100 kHz means large reverse current spikes, heat in the transistor and interference.',
    'Schottky diodes are better in every way — Their leakage can be milliamps when hot, and silicon types rarely block more than 100–200 V.',
    'The surge rating does not matter for a small power supply — The first charge of an empty reservoir capacitor can draw tens of amps for a few milliseconds.'
  ],
  formulas: [
    {
      name: 'Conduction loss',
      expr: 'P = VF*IF', tex: 'P = V_F\\, I_{F(AV)}',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'W' },
        VF: { name: 'forward voltage at that current', q: 'voltage', unit: 'V', value: 0.45, tex: 'V_F' },
        IF: { name: 'average forward current', q: 'current', unit: 'A', value: 1.75, tex: 'I_{F(AV)}' }
      },
      note: 'A good estimate when the current is steady while the diode conducts; with narrow, tall pulses use the drop-plus-resistance model and add $r_D I_{rms}^2$.',
      stories: { P: 'A diode with {VF} forward drop carries an average of {IF}. How much heat does it make?' }
    },
    {
      name: 'Reverse-recovery loss (estimate)',
      expr: 'P = Qrr*VR*f', tex: 'P \\approx Q_{rr}\\, V_R\\, f',
      vars: {
        P: { name: 'extra loss per second', q: 'power', unit: 'W' },
        Qrr: { name: 'reverse recovery charge', q: 'charge', unit: 'nC', value: 50, tex: 'Q_{rr}' },
        VR: { name: 'voltage the diode must block', q: 'voltage', unit: 'V', value: 400, tex: 'V_R' },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 100 }
      },
      note: 'Most of this energy is dissipated in the switching transistor, not in the diode. Schottky diodes have essentially no $Q_{rr}$.',
      stories: { P: 'A diode with {Qrr} of recovery charge switches {VR} at {f}. Roughly how much power is lost to recovery?' }
    },
    {
      name: 'Junction (varactor) capacitance',
      expr: 'C = C0/(1 + VR/Vbi)^m', tex: 'C = \\frac{C_0}{(1 + V_R/V_{bi})^{m}}',
      vars: {
        C: { name: 'capacitance at V_R', q: 'capacitance', unit: 'pF' },
        C0: { name: 'capacitance at zero bias', q: 'capacitance', unit: 'pF', value: 40, tex: 'C_0' },
        VR: { name: 'reverse voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_R' },
        Vbi: { name: 'built-in potential', q: 'voltage', unit: 'V', value: 0.7, tex: 'V_{bi}' },
        m: { name: 'grading exponent', value: 0.5, min: 0.2, max: 2 }
      },
      note: '$m = 0.5$ for an abrupt junction, about 0.33 for a graded one, 0.75–2 for hyperabrupt tuning diodes.',
      stories: { C: 'A varactor has {C0} at zero bias, a built-in potential of {Vbi} and a grading exponent of {m}. What is its capacitance at {VR} reverse?' }
    }
  ],
  examples: [
    {
      title: 'The freewheeling diode of a buck converter',
      q: 'A 12 V to 5 V, 3 A buck converter switches at 100 kHz. Compare the diode loss for an SS34 Schottky ($V_F$ ≈ 0.45 V at 3 A) and an ultrafast silicon diode ($V_F$ ≈ 0.9 V, $Q_{rr}$ ≈ 35 nC).',
      steps: [
        'The switch is on for a fraction $D = 5/12 = 0.42$ of each cycle; the diode carries the 3 A for the rest, 0.58. Average diode current: $3 \\times 0.58 = 1.75\\ \\mathrm{A}$.',
        'Schottky: $P = 0.45 \\times 1.75 = 0.79\\ \\mathrm{W}$, with no recovery loss.',
        'Ultrafast: conduction $0.9 \\times 1.75 = 1.58\\ \\mathrm{W}$, plus recovery $35\\ \\mathrm{nC} \\times 12\\ \\mathrm{V} \\times 100\\ \\mathrm{kHz} = 0.04\\ \\mathrm{W}$.',
        'On 15 W of output the Schottky costs about 5 %, the silicon diode about 11 %. At 12 V the Schottky\'s leakage is harmless; this is its home ground. (A synchronous MOSFET does better still.)'
      ],
      a: 'About 0.8 W (Schottky) against 1.6 W (ultrafast silicon).'
    },
    {
      title: 'Tuning an oscillator with a varactor',
      q: 'A varactor with $C_0$ = 40 pF, $V_{bi}$ = 0.7 V, $m$ = 0.5 resonates with a 1 µH inductor. What range does a tuning voltage of 1 V to 8 V cover?',
      steps: [
        'At 1 V: $C = 40/\\sqrt{1 + 1/0.7} = 40/1.558 = 25.7\\ \\mathrm{pF}$.',
        'At 8 V: $C = 40/\\sqrt{1 + 8/0.7} = 40/3.525 = 11.3\\ \\mathrm{pF}$.',
        '$f = 1/(2\\pi\\sqrt{LC})$: 31.4 MHz at 1 V and 47.3 MHz at 8 V.',
        'A 1.5 : 1 tuning range from a few volts — the stray capacitance of a real circuit, in parallel, will narrow it.'
      ],
      a: 'From about 31 MHz to 47 MHz.'
    }
  ],
  quiz: [
    { q: 'Why is a 1N4007 a poor freewheeling diode in a 100 kHz converter?', choices: ['Its forward voltage is too low', 'It recovers in microseconds, so it conducts backwards for a significant part of each cycle', 'It cannot carry 1 A', 'It is not rated for DC'], a: 1,
      why: 'Standard rectifiers store a lot of charge. At 100 kHz a few microseconds of reverse conduction per cycle means heavy losses in the transistor and strong interference.' },
    { q: 'At 125 °C a Schottky diode near its rated reverse voltage can leak…', choices: ['picoamps', 'nanoamps, like a silicon diode', 'milliamps', 'nothing: Schottky diodes do not leak'], a: 2,
      why: 'Schottky leakage is orders of magnitude above p–n diodes and rises steeply with temperature — the price of the low barrier.' },
    { q: 'What power does a 1N5819 (0.45 V at 1 A) dissipate as a reverse-polarity protection diode carrying 1 A?', answer: 0.45, unit: 'W',
      why: 'P = V_F × I = 0.45 × 1 = 0.45 W, against roughly 0.9 W for a silicon rectifier — and 0.45 V less lost from the supply.' },
    { q: 'Raising the reverse voltage on a varactor makes its capacitance fall.', a: true,
      why: 'The depletion region — the capacitor\'s dielectric — widens with reverse voltage, so the capacitance falls roughly as 1/√(1 + V_R/V_bi).' },
    { q: 'A 230 V mains bridge sees a peak reverse voltage of about 325 V, plus transients. A sensible diode rating is…', choices: ['200 V', '400 V', '1000 V, which costs no more', '50 V'], a: 2,
      why: 'Mains transients easily add hundreds of volts; 1000 V parts (1N4007, or 1000 V bridges) are the standard, cheap choice. 400 V would be marginal.' }
  ],
  applications: ['Schottky freewheeling and output rectifiers in low-voltage switching supplies.', 'Ultrafast and SiC diodes in power-factor correction stages.', 'Varactors in VCOs, PLL synthesisers and TV tuners.', 'PIN diodes as RF switches in radios and phased arrays.'],
  sim: { id: 'dio-iv', params: { dev: '1n5819' } }
}

);
