/* HYPER-ELECTRONICS · content/energy-storage.js — batteries, supercapacitors, and DC
 * motors with their speed control. */
Hyper.add(

{
  id: 'batteries', parent: 'energy-storage', title: 'Batteries: capacity, C-rate and internal resistance', level: 2,
  short: 'A battery is an electrochemical voltage source behind an internal resistance. Its capacity, C-rate, internal resistance and chemistry decide how long it runs, how much it sags under load and how it must be charged.',
  keywords: ['battery', 'capacity', 'mAh', 'Ah', 'Wh', 'C-rate', 'internal resistance', 'voltage sag', 'Li-ion', 'LiFePO4', 'NiMH', 'lead-acid', 'alkaline', 'Peukert', 'state of charge', 'CC/CV charging', 'BMS', 'series and parallel', 'thermal runaway'],
  prereq: ['physics:emf-internal-resistance', 'sources', 'power-energy'],
  related: ['supercapacitors', 'max-power-transfer', 'boost-converter', 'buck-boost', 'fuses-protection', 'wire-sizing'],
  body: `
A battery is a chemical reaction arranged so that its electrons must travel through your circuit. Electrically it behaves, to a good first approximation, like an ideal voltage source — its **open-circuit voltage**, set by the chemistry and by how charged it is — in series with an **internal resistance** $r$ ([[physics:emf-internal-resistance|EMF and internal resistance]]). Under a load current $I$ the terminal voltage sags,

$$V = E - I r$$

and the cell warms by $I^2 r$.

### Capacity, energy and C-rate
**Capacity** is the charge a cell delivers from full to its cut-off voltage, in ampere-hours: a 3000 mAh cell supplies 3 A for about an hour, or 300 mA for about ten. **Energy** is capacity times the average voltage, in watt-hours: 3.0 Ah × 3.6 V = 10.8 Wh. Compare batteries of different chemistries and voltages in Wh, not mAh — a "10 000 mAh" power bank counts its 3.7 V cells (37 Wh) and delivers about 6000 mAh at 5 V after conversion losses.

The **C-rate** gives current relative to capacity: 1C empties the cell in about an hour, 0.5C in two, 2C in half an hour; for a 3000 mAh cell, 1C is 3 A. Datasheets quote capacity at a stated rate (often 0.2C for lithium cells, C/20 for lead-acid), and the maximum continuous and pulse currents in C.

### What limits the capacity you actually get
Under load the terminal voltage is pulled down by $Ir$ and reaches the cut-off sooner, so **high currents deliver less** of the nominal capacity, and turn more of the energy into heat inside the cell. In lead-acid and alkaline cells the chemistry itself also slows down at high currents. **Peukert's law** captures the lead-acid case:

$$t = H\\left(\\frac{C}{I\\,H}\\right)^{k}$$

where $C$ is the capacity rated over $H$ hours and $k$ is typically 1.1–1.3. A 100 Ah (20-hour) battery at 25 A lasts not 4 hours but under 3. Cold makes everything worse: at 0 °C, internal resistance may double and capacity fall by 10–20 %; at −20 °C many cells give half their capacity or less.

### The chemistries
| Chemistry | Nominal | Full → empty | Energy | Notes |
|---|---|---|---|---|
| Li-ion (NMC, NCA) | 3.6–3.7 V | 4.2 → 2.5–3.0 V | 150–270 Wh/kg | the most energy; needs protection |
| LiFePO₄ | 3.2 V | 3.65 → 2.5 V | 90–160 Wh/kg | very flat curve, long life, safer |
| NiMH | 1.2 V | 1.4 → 1.0 V | 60–120 Wh/kg | robust; self-discharges (less for low-self-discharge types) |
| Lead-acid | 2.0 V per cell | 12.7 → 10.5 V for six cells | 30–40 Wh/kg | cheap, heavy; damaged by deep discharge |
| Alkaline (primary) | 1.5 V | 1.6 → 0.9 V | 100–150 Wh/kg | high resistance: poor at high current |

Internal resistance ranges from about 10–50 mΩ for an 18650 lithium cell, through a few tens of milliohms for NiMH, to 150–300 mΩ for a fresh alkaline AA — which is why an alkaline cell that runs a clock for two years is exhausted in minutes by a camera flash.

### Series and parallel
Cells in series add voltages (a "4S" lithium pack is 14.8 V nominal); cells in parallel add capacity ("2P"). A 4S2P pack of 3 Ah cells is 14.8 V, 6 Ah, 89 Wh. In series the weakest cell decides: without **balancing**, cells drift apart over many cycles, and one can be over-charged or over-discharged while the pack voltage looks normal. A **battery management system (BMS)** watches every cell, balances them, and disconnects the pack on over-voltage, under-voltage, over-current or over-temperature.

### Charging
- **Li-ion**: constant current (typically 0.5–1C) until the cell reaches 4.20 V, then constant voltage while the current tapers; stop at about C/10–C/20. Never above the rated voltage, and never below 0 °C.
- **Lead-acid**: bulk current, absorption at about 14.4 V, then float at about 13.6–13.8 V for a 12 V battery, adjusted for temperature.
- **NiMH**: constant current, stopping on a small voltage dip (−ΔV) or on the rate of temperature rise.

> [!warn] Lithium cells pack a great deal of energy into a small volume. A damaged, over-charged or short-circuited cell can go into **thermal runaway**: it vents flammable gas and burns fiercely. Use cells with protection circuits or a proper BMS, a charger made for the chemistry and a fuse close to the pack; never puncture, crush or charge a swollen cell. Even a small lead-acid battery can drive hundreds of amperes into a short — enough to melt a spanner.
`,
  ideas: [
    'A battery is an EMF behind an internal resistance: V = E − I·r, and it heats by I²r.',
    'Capacity (Ah) times voltage is energy (Wh); compare batteries in Wh.',
    'C-rate is current relative to capacity: 1C empties the cell in about an hour.',
    'High currents and low temperatures deliver less capacity — sag, heating, and (for lead-acid) Peukert\'s law.',
    'Series cells add voltage and need balancing; parallel cells add capacity.'
  ],
  pitfalls: [
    'A 10 000 mAh power bank gives 10 000 mAh at 5 V — Its rating is at the cells\' 3.7 V; after conversion it gives roughly 6000 mAh at 5 V.',
    'A battery delivers its rated capacity at any current — High currents and cold reduce it, sometimes by half.',
    'Cells in parallel add their voltages — They add capacity; only series connection adds voltage.'
  ],
  formulas: [
    {
      name: 'Terminal voltage under load',
      expr: 'V = E - I*r', tex: 'V = E - I\\,r',
      vars: {
        V: { name: 'terminal voltage', q: 'voltage', unit: 'V' },
        E: { name: 'open-circuit voltage (EMF)', q: 'voltage', unit: 'V', value: 3.7 },
        I: { name: 'load current', q: 'current', unit: 'A', value: 10 },
        r: { name: 'internal resistance', q: 'resistance', unit: 'mΩ', value: 40 }
      },
      practice: { unknowns: ['V', 'r'] },
      stories: {
        V: 'A cell with an EMF of {E} and {r} of internal resistance supplies {I}. What is its terminal voltage?',
        r: 'A cell reads {E} unloaded and {V} while supplying {I}. What is its internal resistance?'
      }
    },
    {
      name: 'Run time at constant current',
      expr: 't = Q/I', tex: 't = \\frac{Q}{I}',
      vars: {
        t: { name: 'run time', q: 'time', unit: 'h' },
        Q: { name: 'usable capacity', q: 'charge', unit: 'mA·h', value: 3000 },
        I: { name: 'average current', q: 'current', unit: 'mA', value: 500 }
      },
      note: 'An upper estimate: at high currents, or cold, the usable capacity is less than the rating.',
      stories: { t: 'A device draws {I} from a {Q} battery. How long does it run?' }
    },
    {
      name: 'Stored energy',
      expr: 'W = Q*V', tex: 'W = Q\\,V_{\\text{nom}}',
      vars: {
        W: { name: 'energy', q: 'energy', unit: 'Wh' },
        Q: { name: 'capacity', q: 'charge', unit: 'A·h', value: 3 },
        V: { name: 'nominal (average) voltage', q: 'voltage', unit: 'V', value: 3.6, tex: 'V_{\\text{nom}}' }
      },
      stories: { W: 'How much energy does a {Q}, {V} cell store?' }
    },
    {
      name: 'Peukert\'s law (lead-acid)',
      expr: 't = H*(C/(I*H))^k', tex: 't = H\\left(\\frac{C}{I\\,H}\\right)^{k}',
      vars: {
        t: { name: 'run time at current I', q: 'time', unit: 'h' },
        H: { name: 'rated discharge time', q: 'time', unit: 'h', value: 20 },
        C: { name: 'rated capacity (over H hours)', q: 'charge', unit: 'A·h', value: 100 },
        I: { name: 'discharge current', q: 'current', unit: 'A', value: 25 },
        k: { name: 'Peukert exponent', q: 'none', value: 1.2 }
      },
      note: 'k = 1 would be an ideal battery; lead-acid is typically 1.1–1.3, lithium-ion close to 1.05.',
      practice: { unknowns: ['t'] },
      stories: { t: 'A {C} battery rated over {H} (Peukert exponent {k}) supplies {I}. How long does it last?' }
    }
  ],
  examples: [
    {
      title: 'An 18650 cell in a power tool',
      q: 'A 3.0 Ah lithium cell with 40 mΩ of internal resistance and an EMF of 3.7 V supplies 10 A. Find the C-rate, the terminal voltage, the heat in the cell and a rough run time.',
      steps: [
        'C-rate: $10/3.0 = 3.3$C.',
        'Terminal voltage: $3.7 - 10 \\times 0.040 = 3.3$ V — a 0.4 V sag.',
        'Heat: $I^2 r = 100 \\times 0.040 = 4$ W, inside a 47 g cell: it warms quickly.',
        'Run time: at most $3.0/10 = 0.3$ h = 18 minutes, and less in practice because the sag reaches the cut-off early. Power-tool cells are low-resistance types (about 15 mΩ) rated for 20–30 A.'
      ],
      a: '3.3C; 3.3 V at the terminals; 4 W of heat; under 18 minutes.'
    },
    {
      title: 'A lead-acid battery at high current',
      q: 'A 100 Ah battery, rated over 20 hours, powers a 25 A load. With a Peukert exponent of 1.2, how long does it last, and what capacity does it effectively deliver?',
      steps: [
        'Naively: $100/25 = 4$ h.',
        {text: 'Peukert:', tex: 't = 20\\left(\\frac{100}{25 \\times 20}\\right)^{1.2} = 20 \\times 0.2^{1.2} = 20 \\times 0.145 = 2.9\\ \\mathrm{h}'},
        'Effective capacity: $2.9 \\times 25 = 72.5$ Ah — about 70 % of the label.'
      ],
      a: 'About 2.9 hours, delivering about 72 Ah.'
    },
    {
      title: 'Designing a 4S2P pack',
      q: 'Eight 3.0 Ah lithium cells are built into a 4S2P pack. What are its voltages, capacity and energy, and what does a 5 A load mean for it?',
      steps: [
        'Series: $4 \\times 3.7 = 14.8$ V nominal, 16.8 V full, 12.0 V empty at 3.0 V per cell.',
        'Parallel: $2 \\times 3.0 = 6.0$ Ah; energy $14.8 \\times 6.0 = 89$ Wh.',
        '5 A is $5/6 = 0.83$C — each cell carries 2.5 A, a comfortable load.',
        'It needs a four-cell BMS with balancing, a charger that stops at 16.8 V, and a fuse at the pack of about 10 A.'
      ],
      a: '14.8 V nominal (16.8–12 V), 6 Ah, 89 Wh; 5 A is 0.83C.'
    }
  ],
  quiz: [
    { q: 'A 2000 mAh cell discharged at 1 A runs at a C-rate of…', choices: ['2C', '1C', '0.5C', '0.2C'], a: 2,
      why: 'C-rate = current / capacity = 1 A / 2 Ah = 0.5C.' },
    { q: 'Why does an alkaline AA that runs a clock for two years die in minutes in a camera flash?', choices: ['The flash draws more voltage', 'Its high internal resistance makes it sag below the cut-off at high current, and its chemistry cannot keep up', 'Alkaline cells self-discharge fast', 'The flash wastes energy'], a: 1,
      why: 'An alkaline cell has 0.15–0.3 Ω; at an ampere or more it loses a large fraction of its voltage and heats, and delivers only part of its capacity.' },
    { q: 'A power bank says 10 000 mAh (its cells are 3.7 V). How much energy does it store?', choices: ['10 Wh', '37 Wh', '50 Wh', '10 000 Wh'], a: 1,
      why: '10 Ah × 3.7 V = 37 Wh. At 5 V, after about 85 % conversion efficiency, that is about 6300 mAh.' },
    { q: 'Two identical cells connected in parallel give twice the voltage.', a: false,
      why: 'Parallel cells share the same voltage and add capacity; series connection adds voltage.' },
    { q: 'A cell with an EMF of 3.7 V and 50 mΩ of internal resistance supplies 6 A. What is its terminal voltage?', answer: 3.4, unit: 'V',
      why: '3.7 − 6 × 0.05 = 3.4 V.' }
  ],
  applications: ['Phones, laptops and power tools (lithium-ion).', 'Vehicle starting, UPS and alarm backup (lead-acid).', 'Solar storage and electric vehicles (LiFePO₄ and NMC packs).', 'Remote sensors and consumer devices (primary cells).'],
  sim: 'cp-storage'
},

{
  id: 'supercapacitors', parent: 'energy-storage', title: 'Supercapacitors', level: 2,
  short: 'Capacitors of tens to thousands of farads, storing charge in an electrochemical double layer. They hold far less energy than a battery but deliver it far faster, for hundreds of thousands of cycles — and their voltage falls in proportion to the charge taken out.',
  keywords: ['supercapacitor', 'ultracapacitor', 'EDLC', 'double-layer capacitor', 'farad', 'energy density', 'power density', 'cell balancing', 'hold-up time', 'backup', 'ESR', 'cycle life', 'self-discharge'],
  prereq: ['capacitors', 'physics:energy-in-capacitor', 'batteries'],
  related: ['boost-converter', 'buck-boost', 'rc-transient', 'fuses-protection'],
  body: `
An ordinary capacitor stores charge on two plates separated by a dielectric. An **electric double-layer capacitor (EDLC)** — a supercapacitor — has no dielectric in the usual sense. Its two electrodes are activated carbon, with a surface area of 1000–2000 m² per gram, soaked in an electrolyte. Under a voltage, ions line up against each electrode's surface in a layer about a nanometre thick. A tiny separation and an enormous area give an enormous capacitance: 1 F in a coin-sized cell, 3000 F in a cell the size of a drinks can.

### The trade-offs
The double layer breaks down above about 2.5–3.0 V per cell (2.7 V is typical), so higher voltages need cells in series. Energy still follows $E = \\tfrac{1}{2} C V^2$: a 3000 F, 2.7 V cell holds 10.9 kJ, about 3 Wh — less than a third of one 18650 lithium cell, in a package ten times heavier. Supercapacitors store 3–10 Wh/kg against 150–250 Wh/kg for lithium-ion. But they deliver their energy in seconds rather than hours, through internal resistances of milliohms, and survive 500 000 to a million cycles over a wide temperature range. They fill the gap between capacitors and batteries: **power** rather than **energy**.

### The voltage falls with the charge
A battery holds a nearly flat voltage over most of its discharge; a capacitor's voltage is proportional to its remaining charge, $V = Q/C$. Discharged to half its voltage, it has delivered three-quarters of its energy:

$$E_\\text{usable} = \\tfrac{1}{2}\\,C\\left(V_1^2 - V_2^2\\right)$$

So a supercapacitor usually feeds its load through a [[boost-converter|boost]] or [[buck-boost|buck–boost]] converter that accepts a falling input. For a load taking a constant power $P$, the time it can be held up follows from the energy:

$$t = \\frac{C\\left(V_1^2 - V_2^2\\right)}{2P}$$

At a constant current the voltage instead falls in a straight line, after an initial step of $I \\cdot R_\\text{ESR}$ — the simulation shows it beside the curves of real batteries.

### In practice
- **Series stacks need balancing.** Cells in series share the voltage according to their capacitance and leakage, which vary by 10–20 % from cell to cell. Without balancing (a resistor across each cell, or an active circuit) one cell can exceed its rating and fail. A stack of $n$ cells has $C/n$ farads at $n$ times the voltage.
- **Inrush.** An empty supercapacitor is a short circuit. Connected straight to a supply, it draws whatever the supply and wiring allow; charge it through a current-limited supply or a resistor.
- **Life and derating.** Capacitance falls and ESR rises with age, faster at high voltage and temperature; running a 2.7 V cell at 2.5 V extends its life considerably.
- **Self-discharge**: days to weeks — fine for bridging an interruption, poor for long-term storage.

### Where they are used
Keeping a real-time clock or memory alive through a power cut (0.1–1 F coin cells); riding a controller through brief supply dropouts; buffering the current peaks of a radio transmitter or a motor so that a small battery need not supply them; regenerative braking in buses, cranes and trams; and start assist for engines in the cold.
`,
  ideas: [
    'A double layer of ions a nanometre thick on a huge carbon surface gives farads to kilofarads.',
    'Supercapacitors trade energy (a few Wh/kg) for power, speed and cycle life.',
    'Voltage is proportional to the remaining charge: half the voltage means three-quarters of the energy used.',
    'Cells are limited to about 2.7 V; series stacks need balancing.',
    'An empty supercapacitor is a short circuit: limit the charging current.'
  ],
  pitfalls: [
    'A supercapacitor can replace a battery of the same size — It stores 20–50 times less energy; it bridges seconds to minutes, not hours.',
    'A supercapacitor gives a steady voltage like a battery — Its voltage falls in proportion to the charge removed; most loads need a converter after it.',
    'Series cells share the voltage equally — Mismatched capacitance and leakage make them share it unequally; balancing is required.'
  ],
  formulas: [
    {
      name: 'Usable energy between two voltages',
      expr: 'E = 0.5*C*(V1^2 - V2^2)', tex: 'E = \\tfrac{1}{2}\\,C\\left(V_1^2 - V_2^2\\right)',
      vars: {
        E: { name: 'energy delivered', q: 'energy', unit: 'J' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'F', value: 10 },
        V1: { name: 'starting voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_1' },
        V2: { name: 'final voltage', q: 'voltage', unit: 'V', value: 2.5, tex: 'V_2' }
      },
      practice: { unknowns: ['E', 'C'] },
      stories: { E: 'A {C} supercapacitor is discharged from {V1} to {V2}. How much energy does it deliver?' }
    },
    {
      name: 'Hold-up time at constant power',
      expr: 't = C*(V1^2 - V2^2)/(2*P)', tex: 't = \\frac{C\\left(V_1^2 - V_2^2\\right)}{2P}',
      vars: {
        t: { name: 'hold-up time', q: 'time', unit: 's' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'F', value: 4.7 },
        V1: { name: 'starting voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_1' },
        V2: { name: 'lowest voltage the converter accepts', q: 'voltage', unit: 'V', value: 3, tex: 'V_2' },
        P: { name: 'power drawn from the capacitor', q: 'power', unit: 'W', value: 0.5 }
      },
      note: 'P is the power taken from the capacitor: the load\'s power divided by the converter\'s efficiency.',
      practice: { unknowns: ['t', 'C'] },
      stories: { C: 'A controller draws {P} (from the capacitor) and must be held up for {t} while the capacitor falls from {V1} to {V2}. What capacitance is needed?' }
    },
    {
      name: 'Discharge time at constant current',
      expr: 't = C*(V1 - V2 - I*ESR)/I', tex: 't = \\frac{C\\,(V_1 - V_2 - I R_{\\text{ESR}})}{I}',
      vars: {
        t: { name: 'time to reach V₂ at the terminals', q: 'time', unit: 's' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'F', value: 100 },
        V1: { name: 'starting voltage', q: 'voltage', unit: 'V', value: 2.7, tex: 'V_1' },
        V2: { name: 'cut-off voltage', q: 'voltage', unit: 'V', value: 1.35, tex: 'V_2' },
        I: { name: 'discharge current', q: 'current', unit: 'A', value: 1.5 },
        ESR: { name: 'equivalent series resistance', q: 'resistance', unit: 'mΩ', value: 15, tex: 'R_{\\text{ESR}}' }
      },
      note: 'The terminal voltage first steps down by I·R_ESR, then falls linearly at I/C volts per second.',
      practice: { unknowns: ['t'] }
    }
  ],
  examples: [
    {
      title: 'Riding through a power cut',
      q: 'A controller takes 0.5 W and must keep running for 60 s after its 5 V supply fails, through a boost converter that is 85 % efficient and works down to 3 V. What capacitance is needed?',
      steps: [
        'Energy taken from the capacitor: $0.5 \\times 60/0.85 = 35$ J.',
        {text: 'Capacitance:', tex: 'C = \\frac{2E}{V_1^2 - V_2^2} = \\frac{2 \\times 35}{25 - 9} = 4.4\\ \\mathrm{F}'},
        'A 5 F, 5.5 V module (two balanced 10 F, 2.7 V cells in series) does it with a little margin.',
        'Charge it through a current limit, or its inrush will pull the 5 V rail down at every power-up.'
      ],
      a: 'About 4.4 F: a 5 F, 5.5 V module.'
    },
    {
      title: 'Supercapacitor against a lithium cell',
      q: 'Compare the energy of a 5 F, 5.5 V supercapacitor module with that of an 18650 lithium cell (3.0 Ah, 3.6 V).',
      steps: [
        'Supercapacitor: $\\tfrac12 \\times 5 \\times 5.5^2 = 76$ J = 0.021 Wh.',
        'Lithium cell: $3.0 \\times 3.6 = 10.8$ Wh — about 500 times more.',
        'But the module can deliver tens of amperes for a second, over a million cycles, from −40 °C; the cell would age from that treatment in a few hundred cycles.'
      ],
      a: 'About 0.02 Wh against 10.8 Wh: 500 times less energy, but far more power and life.'
    }
  ],
  quiz: [
    { q: 'A supercapacitor is discharged from its full voltage to half of it. What fraction of its stored energy has it delivered?', choices: ['50 %', '25 %', '75 %', '100 %'], a: 2,
      why: 'Energy goes as V²: at half voltage a quarter remains, so three-quarters has been delivered.' },
    { q: 'Two 100 F, 2.7 V cells are connected in series. The result is…', choices: ['200 F at 2.7 V', '50 F at 5.4 V', '100 F at 5.4 V', '50 F at 2.7 V'], a: 1,
      why: 'Capacitors in series: C/2; voltages add. Energy doubles (½ × 50 × 5.4² = 2 × ½ × 100 × 2.7²).' },
    { q: 'Why do supercapacitor cells in series need balancing?', choices: ['To raise their capacitance', 'Mismatched capacitance and leakage divide the voltage unequally, so one cell can be over-voltaged', 'To reduce ESR', 'To speed up charging'], a: 1,
      why: 'Cells differ by 10–20 %. The smallest capacitance, or the lowest leakage, takes more than its share of the voltage.' },
    { q: 'A supercapacitor can replace a phone\'s battery of the same size.', a: false,
      why: 'Supercapacitors store tens of times less energy per kilogram or litre than lithium-ion.' },
    { q: 'How much energy does a 10 F supercapacitor hold at 2.7 V?', answer: 36.45, unit: 'J',
      why: '½ × 10 × 2.7² = 36.45 J — about 0.01 Wh.' }
  ],
  applications: ['Memory and real-time-clock backup through power cuts.', 'Hold-up of controllers and data loggers during brief supply dropouts.', 'Buffering current peaks of radios, motors and flashes.', 'Regenerative braking in buses, trams and cranes.'],
  sim: { id: 'cp-storage', params: { cell: 'sc' } }
},

{
  id: 'dc-motor-control', parent: 'energy-storage', title: 'DC motors and speed control', level: 2,
  short: 'A brushed DC motor is a resistance, an inductance and a back-EMF proportional to speed, and its torque is proportional to its current. Speed is set by the average voltage — usually by PWM — and the same equations explain its start-up current, its speed droop and its braking.',
  keywords: ['DC motor', 'brushed motor', 'back-EMF', 'motor constant', 'torque constant', 'Kv', 'Kt', 'stall current', 'no-load speed', 'speed-torque curve', 'PWM speed control', 'H-bridge', 'regenerative braking', 'mechanical time constant', 'encoder', 'PI control'],
  prereq: ['pwm', 'physics:torque-on-loop', 'physics:generators', 'inductors'],
  related: ['h-bridge', 'flyback-diode', 'mosfet-switch', 'hall-sensors', 'batteries', 'wire-sizing'],
  body: `
A brushed DC motor turns current into torque and speed into voltage, through one and the same constant. Current in the armature, sitting in the field of the magnets, makes a torque ([[physics:torque-on-loop|torque on a current loop]]); the spinning armature is also a generator ([[physics:generators|generators]]) and produces a **back-EMF** that opposes the supply:

$$T = k\\,I, \\qquad E = k\\,\\omega$$

In SI units the **motor constant** $k$ is the same number in both: newton-metres per ampere, and volts per radian per second. (Catalogues often quote $K_v$ in rpm per volt instead: $k = 60/(2\\pi K_v)$.)

### The motor as a circuit
Electrically the armature is a resistance $R$ and an inductance $L$ in series with the back-EMF. In steady state the inductance drops out:

$$V = I R + k\\,\\omega$$

Eliminate the current with $T = kI$ and you have the **speed–torque line** of the motor:

$$\\omega = \\frac{V}{k} - \\frac{R}{k^2}\\,T$$

- With no load, the motor speeds up until the back-EMF nearly equals the supply: the **no-load speed** is $\\omega_0 = V/k$.
- Held still, there is no back-EMF: the **stall current** is $V/R$ and the stall torque $kV/R$.
- In between, speed droops linearly with load. Mechanical output, $T\\omega$, peaks at half the stall torque, while efficiency is best at light load — typically 10–20 % of the stall torque.

A small 12 V motor with $R$ = 1.5 Ω and $k$ = 0.019 V·s/rad has a no-load speed of 632 rad/s (6000 rpm), a stall current of 8 A and a stall torque of 0.15 N·m. **The stall current flows at every start**, until the motor gathers speed — and the driver, the fuse and the wiring must survive it ([[fuses-protection]]).

### Speed control
Since the no-load speed is proportional to the voltage, speed is controlled by the **average voltage** — and the efficient way to vary it is [[pwm|PWM]]. A low-side MOSFET switches the motor, with a **flyback diode** across the motor: while the MOSFET is on, the current rises; while it is off, the winding's inductance keeps the current circulating through the diode ([[flyback-diode]]). The motor responds to the average voltage $D\\,V$, and its speed–torque line shifts down in proportion. The current ripples by about $V D(1 - D)/(fL)$, so the PWM period should be short compared with $L/R$ — and the frequency above hearing, 16–25 kHz, or the motor sings.

Reversing needs the motor voltage reversed: an [[h-bridge|H-bridge]] of four switches. The H-bridge also brakes. Shorting the motor's terminals turns it into a loaded generator (dynamic braking); driving it with less voltage than its back-EMF pushes energy back into the supply (regenerative braking) — which can lift the supply voltage dangerously if nothing absorbs it.

### Dynamics and control
The rotor and its load have inertia $J$, so the speed follows a change of voltage with a **mechanical time constant**

$$\\tau_m = \\frac{J R}{k^2}$$

typically tens of milliseconds for small motors — much longer than the electrical time constant $L/R$. For accurate speed or position, an encoder or a Hall sensor ([[hall-sensors]]) measures the shaft and a PI controller adjusts the duty cycle; for torque control the controller regulates the motor current, since torque is simply $kI$. A gearbox multiplies torque and divides speed by its ratio, and makes the load's inertia appear smaller by the square of the ratio.

Brushless (BLDC) motors obey the same equations but commutate electronically, and stepper motors move in fixed steps; both need dedicated drivers.
`,
  ideas: [
    'Torque is proportional to current (T = kI) and back-EMF to speed (E = kω), with the same k in SI units.',
    'Steady state: V = IR + kω, giving a straight speed–torque line from the no-load speed V/k to the stall torque kV/R.',
    'The stall current V/R flows at every start.',
    'PWM sets the average voltage; a flyback diode carries the current while the switch is off.',
    'The mechanical time constant JR/k² sets how fast the speed follows the voltage.'
  ],
  pitfalls: [
    'A motor draws its running current when switched on — It draws the stall current, V/R, until the back-EMF builds up.',
    'At a lower PWM duty the motor draws less current for the same load — The load torque sets the motor current (I = T/k); the supply current is smaller only by the factor D.',
    'A PWM-driven motor works without a flyback diode — Each turn-off drives the switch voltage up until something breaks down; the diode (or the other switches of an H-bridge) must carry the current.'
  ],
  derivation: {
    title: 'Derive the speed–torque line and the mechanical time constant',
    steps: [
      { text: 'In steady state the supply voltage is shared between the armature resistance and the back-EMF, and the torque is proportional to the current:', tex: 'V = I R + k\\,\\omega, \\qquad T = k\\,I' },
      { text: 'Eliminate the current with $I = T/k$:', tex: '\\omega = \\frac{V}{k} - \\frac{R}{k^2}\\,T' },
      { text: 'Now let the speed change. Newton\'s second law for rotation, with the load torque $T_L$ and the inertia $J$, and the current set by the resistance (the inductance is fast enough to ignore):', tex: 'J\\,\\frac{d\\omega}{dt} = k\\,I - T_L, \\qquad I = \\frac{V - k\\omega}{R}' },
      { text: 'Substitute and rearrange into the standard first-order form ([[math:first-order-linear|first-order linear equation]]):', tex: '\\frac{J R}{k^2}\\,\\frac{d\\omega}{dt} + \\omega = \\frac{V}{k} - \\frac{R}{k^2}\\,T_L' },
      { text: 'The speed approaches the speed–torque line exponentially, with the time constant', tex: '\\tau_m = \\frac{J R}{k^2}' }
    ]
  },
  formulas: [
    {
      name: 'Steady-state voltage equation',
      expr: 'V = I*R + k*w', tex: 'V = I R + k\\,\\omega',
      vars: {
        V: { name: 'motor voltage (average, under PWM)', q: 'voltage', unit: 'V', value: 12 },
        I: { name: 'motor current', q: 'current', unit: 'A', value: 2.63 },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 1.5 },
        k: { name: 'motor constant (V·s/rad = N·m/A)', unit: 'V·s/rad', value: 0.019 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', tex: '\\omega' }
      },
      solveFor: 'w',
      practice: { unknowns: ['w', 'I'] },
      stories: { w: 'A motor with {R} of armature resistance and k = {k} runs on {V}, drawing {I}. How fast does it turn?' }
    },
    {
      name: 'Torque from current',
      expr: 'T = k*I', tex: 'T = k\\,I',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        k: { name: 'motor constant', unit: 'V·s/rad', value: 0.019 },
        I: { name: 'motor current', q: 'current', unit: 'A', value: 2.63 }
      },
      note: 'The torque available at the shaft is less by the friction torque.',
      stories: { I: 'A motor with k = {k} must deliver {T}. What current does it draw?' }
    },
    {
      name: 'Speed–torque line',
      expr: 'w = V/k - R*T/k^2', tex: '\\omega = \\frac{V}{k} - \\frac{R}{k^2}\\,T',
      vars: {
        w: { name: 'speed', q: 'angvel', unit: 'rpm', tex: '\\omega' },
        V: { name: 'motor voltage', q: 'voltage', unit: 'V', value: 12 },
        k: { name: 'motor constant', unit: 'V·s/rad', value: 0.019 },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 1.5 },
        T: { name: 'load torque', q: 'torque', unit: 'N·m', value: 0.05 }
      },
      note: 'Negative results mean the motor stalls: the load exceeds the stall torque kV/R.',
      practice: { unknowns: ['w', 'T', 'V'] },
      stories: {
        w: 'A motor (k = {k}, R = {R}) on {V} carries a load of {T}. How fast does it run?',
        V: 'What voltage makes a motor (k = {k}, R = {R}) run at {w} with a load of {T}?'
      }
    },
    {
      name: 'Mechanical time constant',
      expr: 'tau = J*R/k^2', tex: '\\tau_m = \\frac{J R}{k^2}',
      vars: {
        tau: { name: 'mechanical time constant', q: 'time', unit: 'ms', tex: '\\tau_m' },
        J: { name: 'inertia of rotor and load', q: 'inertia', unit: 'kg·cm²', value: 0.2 },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 1.5 },
        k: { name: 'motor constant', unit: 'V·s/rad', value: 0.019 }
      },
      stories: { tau: 'A motor (k = {k}, R = {R}) drives a total inertia of {J}. What is its mechanical time constant?' }
    },
    {
      name: 'Current ripple under PWM',
      expr: 'dI = V*D*(1 - D)/(f*L)', tex: '\\Delta I = \\frac{V D (1 - D)}{f L}',
      vars: {
        dI: { name: 'peak-to-peak current ripple', q: 'current', unit: 'A', tex: '\\Delta I' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12 },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20 },
        L: { name: 'armature inductance', q: 'inductance', unit: 'mH', value: 0.5 }
      },
      note: 'Assumes the PWM period is short compared with L/R, so the current is a small triangle around its average.',
      practice: { unknowns: ['dI', 'f'] }
    }
  ],
  examples: [
    {
      title: 'A motor under load',
      q: 'A 12 V motor with R = 1.5 Ω and k = 0.019 V·s/rad drives a load of 0.05 N·m. Find the current, the speed, the power in and out, and the efficiency (ignoring friction).',
      steps: [
        'Current: $I = T/k = 0.05/0.019 = 2.63$ A.',
        'Speed: $\\omega = (12 - 2.63 \\times 1.5)/0.019 = 424$ rad/s, about 4050 rpm (no-load 6030 rpm).',
        'Power in: $12 \\times 2.63 = 31.6$ W. Power out: $T\\omega = 0.05 \\times 424 = 21.2$ W. The difference, 10.4 W, is $I^2R$ in the winding.',
        'Efficiency: $21.2/31.6 = 67$ %.'
      ],
      a: '2.63 A, about 4050 rpm, 21 W out of 32 W in: 67 %.'
    },
    {
      title: 'The same load at 50 % PWM',
      q: 'The same motor and load, now with PWM at 50 % duty. What are the speed and the currents?',
      steps: [
        'Average motor voltage: 6 V. The load still needs 0.05 N·m, so the motor current is still 2.63 A.',
        'Speed: $\\omega = (6 - 3.95)/0.019 = 108$ rad/s — about 1030 rpm, a quarter of the full-voltage speed, not a half: the droop of 208 rad/s is the same, but it is now most of the speed.',
        'The supply current averages only $D \\times 2.63 = 1.3$ A (the diode carries the motor current during the off-time), so the supply delivers 15.8 W for 5.4 W of shaft power.',
        'For a steady speed under varying load, measure the speed and close the loop.'
      ],
      a: 'About 1030 rpm; 2.63 A in the motor, 1.3 A from the supply.'
    }
  ],
  quiz: [
    { q: 'At the instant a DC motor is switched on, its current is about…', choices: ['its no-load current', 'its rated current', 'its stall current, V/R', 'zero'], a: 2,
      why: 'Standing still, there is no back-EMF; only the armature resistance limits the current.' },
    { q: 'Doubling the supply voltage of an unloaded DC motor roughly…', choices: ['doubles its speed', 'quadruples its speed', 'doubles its torque at the same speed only', 'leaves its speed unchanged'], a: 0,
      why: 'No-load speed ω₀ = V/k: the back-EMF must again nearly match the supply.' },
    { q: 'The torque of a DC motor is proportional to…', choices: ['its speed', 'its current', 'its voltage', 'its power'], a: 1,
      why: 'T = kI. Voltage sets speed (through the back-EMF); current sets torque.' },
    { q: 'A motor switched by a MOSFET with PWM works fine without a flyback diode, only a little less efficiently.', a: false,
      why: 'At each turn-off the winding\'s current has nowhere to go; the drain voltage shoots up until the MOSFET avalanches, which dissipates the inductor\'s energy in it every cycle — or destroys it.' },
    { q: 'A motor with k = 0.02 V·s/rad runs unloaded on 24 V. What is its no-load speed?', answer: 1200, unit: 'rad/s',
      why: 'ω₀ = V/k = 24/0.02 = 1200 rad/s, about 11 500 rpm.' }
  ],
  applications: ['Speed control of fans, pumps, conveyors and toys.', 'Robot and CNC axes with encoders and PI control.', 'Car windows, wipers, seats and cooling fans.', 'Cordless tools, with braking through the H-bridge or trigger switch.'],
  sim: 'cp-motor-pwm'
}

);
