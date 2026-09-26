/* HYPER-ELECTRONICS · content/dc-basics.js — voltage, current and resistance: the
 * quantities of a circuit, the parts that relate them, and the two ways of connecting
 * them. (The voltage divider of this topic lives in content/reference.js.) */
Hyper.add(

{
  id: 'charge-and-current', parent: 'dc-basics', title: 'Charge and current', level: 1,
  short: 'Current is charge flowing past a point each second. It is the same all the way round a loop, it sets how hot wires get, and battery capacity is simply stored charge.',
  keywords: ['current', 'charge', 'ampere', 'amp', 'coulomb', 'electron', 'conventional current', 'drift velocity', 'mAh', 'battery life', 'average current', 'duty cycle'],
  prereq: ['physics:electric-charge', 'physics:electric-current', 'math:scientific-notation'],
  related: ['voltage', 'kirchhoffs-laws', 'batteries', 'wire-sizing', 'multimeter'],
  body: `
Electric **current** is charge on the move: the amount of charge that passes a point in a wire each second,

$$I = \\frac{Q}{t}$$

measured in **amperes** — one ampere is one coulomb per second. An electron carries $e = 1.602 \\times 10^{-19}\\ \\mathrm{C}$, so 1 A is about $6.24 \\times 10^{18}$ electrons passing every second. In wires, resistors and PCB tracks the carriers are electrons; in a battery's electrolyte they are ions; in a semiconductor, electrons and holes.

### Which way does it flow?
Schematics use **conventional current**: out of the positive terminal of the supply, round the circuit, back into the negative. Electrons in a metal actually drift the other way — the convention was fixed long before the electron was discovered — but it makes no difference to any calculation: negative charge moving left is the same current as positive charge moving right. Every arrow on a symbol (a diode's triangle, a transistor's emitter) points the conventional way.

When you analyse a circuit you draw a **reference direction** for each current before you know which way it really goes. If the answer comes out negative, the current simply flows the other way ([[kirchhoffs-laws]]).

### The same all the way round
Charge does not pile up in a wire or a resistor, so in a single loop the current is **the same at every point** — before a lamp and after it, in the red lead and in the black. A lamp does not use up current; it uses up *energy*, which the charges carry by virtue of the [[voltage]] they have been pushed through. That is why an ammeter reads the same wherever you put it in a series loop, and why it must go **in series**: the current has to flow through it ([[multimeter]]).

### Slow electrons, fast signals
The electrons crawl. Their drift speed is $v = I/(n e A)$, with $n \\approx 8.5 \\times 10^{28}$ free electrons per cubic metre in copper: for 1 A in a 1 mm² wire, about 0.07 mm/s — a metre takes nearly four hours. Yet a lamp lights the instant the switch closes, because the wire is already full of electrons and the push (the electric field) travels along it at a large fraction of the speed of light, like water in a full hose.

### Currents you will meet
| Where | Typical current |
|---|---|
| CMOS logic input (leakage) | well under 1 µA |
| Microcontroller asleep | 1–10 µA |
| Indicator LED | 2–20 mA |
| Microcontroller pin, absolute limit | 20–40 mA |
| USB 2.0 port | 500 mA |
| Laptop charger | about 3 A |
| Car starter motor | 100–300 A |

Current, not voltage, decides how thick a wire or track must be: the heat generated is $I^2R$ ([[power-energy]], [[wire-sizing]]).

### Capacity: the milliamp-hour
Battery capacity is a charge, quoted in ampere-hours: $1\\ \\mathrm{mAh} = 10^{-3}\\ \\mathrm{A} \\times 3600\\ \\mathrm{s} = 3.6\\ \\mathrm{C}$. A 2000 mAh cell can supply 200 mA for about ten hours or 20 mA for about a hundred — roughly, since real [[batteries]] deliver less at high current and in the cold. For a device that sleeps most of the time, what counts is the **average current**: the time-weighted mix of its sleeping and working currents. Designing for years of battery life means attacking whichever term is larger — usually the time spent awake, and the sleep current when the device wakes only rarely.
`,
  ideas: [
    'Current is charge per second: 1 A = 1 C/s ≈ 6.24 × 10¹⁸ electrons per second.',
    'In a single loop the current is the same at every point; components use energy, not current.',
    'Conventional current flows from + to − outside the source; a negative answer only means the opposite direction.',
    'Electrons drift at fractions of a millimetre per second, but the signal travels at a large fraction of the speed of light.',
    'Battery capacity in mAh is stored charge; battery life is capacity divided by the average current.'
  ],
  pitfalls: [
    'A lamp or resistor uses up some of the current — The current out equals the current in. What is used is energy: the charge leaves at a lower voltage.',
    'Electrons race round the circuit at the speed of light — They drift at well under a millimetre per second; it is the field, the push, that travels fast.',
    'Battery life is capacity divided by the peak current, or by the sleep current — For a device that sleeps and wakes, use the time-weighted average of the two; either term can dominate.'
  ],
  formulas: [
    {
      name: 'Charge, current and time (battery life)',
      expr: 'I = Q/t', tex: 'I = \\frac{Q}{t}',
      vars: {
        I: { name: 'current', q: 'current', unit: 'mA', value: 50, tex: 'I' },
        Q: { name: 'charge (capacity)', q: 'charge', unit: 'mA·h', value: 2000, tex: 'Q' },
        t: { name: 'time', q: 'time', unit: 'h', tex: 't' }
      },
      solveFor: 't',
      note: 'Switch the units to C and s for the definition of the ampere; mAh and hours suit batteries.',
      stories: {
        t: 'A {Q} cell powers a gadget drawing a steady {I}. Roughly how long does it last?',
        I: 'A {Q} battery must last {t}. What average current may the circuit draw?',
        Q: 'A logger draws {I} on average and must run for {t}. What battery capacity is needed?'
      }
    },
    {
      name: 'Electrons passing per second',
      expr: 'N = I*t/qe', tex: 'N = \\frac{I t}{e}',
      vars: {
        N: { name: 'number of electrons', q: 'count', unit: '', tex: 'N' },
        I: { name: 'current', q: 'current', unit: 'mA', value: 20, tex: 'I' },
        t: { name: 'time', q: 'time', unit: 's', value: 1, tex: 't' },
        qe: { const: 'qe' }
      },
      stories: { N: 'An LED carries {I}. How many electrons pass through it in {t}?' }
    },
    {
      name: 'Drift velocity in a wire',
      expr: 'v = I/(n*qe*A)', tex: 'v = \\frac{I}{n e A}',
      vars: {
        v: { name: 'drift velocity', q: 'speed', unit: 'mm/s', tex: 'v' },
        I: { name: 'current', q: 'current', unit: 'A', value: 1, tex: 'I' },
        n: { name: 'free electrons per volume (copper 8.5 × 10²⁸ /m³)', q: 'numberdensity', unit: '1/m³', value: 8.5e28, tex: 'n' },
        A: { name: 'cross-section of the wire', q: 'area', unit: 'mm²', value: 1, tex: 'A' },
        qe: { const: 'qe' }
      },
      stories: { v: 'A copper wire of {A} cross-section carries {I}. How fast do the electrons drift?' }
    },
    {
      name: 'Average current of a load that sleeps and wakes',
      expr: 'Iavg = D*Ion + (1 - D)*Isleep', tex: 'I_{\\text{avg}} = D\\,I_{\\text{on}} + (1 - D)\\,I_{\\text{sleep}}',
      vars: {
        Iavg: { name: 'average current', q: 'current', unit: 'µA', tex: 'I_{\\text{avg}}' },
        D: { name: 'fraction of time awake (duty cycle)', q: 'ratio', unit: '%', value: 0.5, min: 0, max: 100, tex: 'D' },
        Ion: { name: 'current while awake', q: 'current', unit: 'mA', value: 15, tex: 'I_{\\text{on}}' },
        Isleep: { name: 'current while asleep', q: 'current', unit: 'µA', value: 5, tex: 'I_{\\text{sleep}}' }
      },
      note: 'The duty cycle is the time awake divided by the repetition period: 50 ms every 10 s is 0.5 %.',
      stories: { Iavg: 'A sensor draws {Ion} while awake, {D} of the time, and {Isleep} asleep. What is its average current?' }
    }
  ],
  examples: [
    {
      title: 'Three years on two AA cells?',
      q: 'A wireless sensor wakes every 10 s, draws 15 mA for 50 ms to measure and transmit, and sleeps at 5 µA the rest of the time. It runs from two AA alkaline cells in series (about 2500 mAh). How long will it last?',
      steps: [
        'Duty cycle: $D = 50\\ \\mathrm{ms} / 10\\ \\mathrm{s} = 0.005$ (0.5 %).',
        'Average current: $0.005 \\times 15\\ \\mathrm{mA} + 0.995 \\times 5\\ \\mu\\mathrm{A} = 75\\ \\mu\\mathrm{A} + 5\\ \\mu\\mathrm{A} = 80\\ \\mu\\mathrm{A}$.',
        'Cells in series share the same current, so the capacity is that of one cell: $t = 2500\\ \\mathrm{mAh} / 0.080\\ \\mathrm{mA} \\approx 31\\,000\\ \\mathrm{h}$, about 3.6 years.',
        'Notice where the charge goes: 94 % is spent awake. Halving the awake time buys far more than a better sleep current. Allow a margin for self-discharge and for the capacity lost in the cold.'
      ],
      a: 'About 80 µA on average: roughly 3½ years, less in practice.'
    },
    {
      title: 'Electrons through an LED',
      q: 'A red indicator LED carries 20 mA. How many electrons pass through it each second?',
      steps: [
        'Current is charge per second, so each second $Q = 0.020\\ \\mathrm{C}$ passes.',
        'Divide by the charge of one electron: $N = 0.020 / 1.602 \\times 10^{-19} = 1.25 \\times 10^{17}$.'
      ],
      a: '1.25 × 10¹⁷ electrons per second.'
    }
  ],
  quiz: [
    { q: 'A lamp in a single loop has 0.5 A flowing into it. The current flowing out of it is…', choices: ['less than 0.5 A, because the lamp uses some', '0.5 A', 'more than 0.5 A', 'zero'], a: 1,
      why: 'Charge cannot pile up in the lamp, so what flows in flows out. The lamp takes energy from the charges (they leave at a lower voltage), not the charges themselves.' },
    { q: 'In a copper wire carrying 1 A, the electrons drift at roughly…', choices: ['0.07 mm/s', '1 m/s', '300 km/s', 'the speed of light'], a: 0,
      why: 'With 8.5 × 10²⁸ free electrons per m³ in 1 mm² of copper, v = I/(neA) ≈ 7 × 10⁻⁵ m/s. The signal is fast because the field propagates, not because the electrons do.' },
    { q: 'Outside a battery, conventional current flows from the negative terminal to the positive terminal.', a: false,
      why: 'Conventional current leaves the + terminal and returns to the −. Electrons in the wire drift the opposite way, but schematics always use the conventional direction.' },
    { q: 'A phone battery is rated 3000 mAh. How much charge is that, in coulombs?', answer: 10800, unit: 'C',
      why: '1 mAh = 0.001 A × 3600 s = 3.6 C, so 3000 mAh = 10 800 C.' },
    { q: 'You draw a current arrow left to right, solve the circuit, and get I = −2 mA. What does it mean?', choices: ['A mistake has been made', '2 mA flows from right to left', 'The current is being destroyed', 'The resistor must be negative'], a: 1,
      why: 'Reference directions are guesses. A negative result means the real current flows against the arrow; the size, 2 mA, is correct.' }
  ],
  applications: ['Battery-life budgets for sensors, wearables and remote controls.', 'Choosing wire and track sizes from the current they carry.', 'Placing an ammeter or a current-sense resistor in series with a load.', 'Charge counting ("fuel gauge") chips that integrate a battery\'s current.'],
  history: 'Benjamin Franklin\'s choice of which charge to call positive (around 1747) fixed the direction of conventional current long before J. J. Thomson identified the electron in 1897. Since 2019 the ampere has been defined by fixing the elementary charge at exactly 1.602 176 634 × 10⁻¹⁹ C.',
  sim: { id: 'fund-lamps', params: { conn: 'series' } }
},

{
  id: 'voltage', parent: 'dc-basics', title: 'Voltage', level: 1,
  short: 'Voltage is energy per unit charge — the push that drives a current. It always exists between two points; "the voltage at a node" means relative to ground.',
  keywords: ['voltage', 'potential difference', 'volt', 'emf', 'ground', 'reference', 'node voltage', 'polarity', 'electronvolt', 'extra-low voltage', 'breakdown'],
  prereq: ['charge-and-current', 'physics:electric-potential', 'physics:electric-potential-energy'],
  related: ['resistance-ohms-law', 'kirchhoffs-laws', 'sources', 'multimeter'],
  body: `
A current needs a push. **Voltage** — potential difference — measures that push as energy per unit charge: if moving a charge $Q$ between two points transfers an energy $W$, the voltage between them is

$$V = \\frac{W}{Q}$$

One volt is one joule per coulomb. Every coulomb that a 12 V battery sends round a circuit hands over 12 J to the parts on its way — as heat in a resistor, light in an LED, motion in a motor.

### Always between two points
A voltage is a **difference**: it exists between two points, never at one. "The collector is at 5 V" is shorthand for "5 V above the reference node", which on almost every schematic is the one marked **ground**. Ground is a choice of reference, like sea level for heights. In many circuits — a torch, a phone — it is not connected to the earth at all. What never depends on that choice is the difference between two nodes:

$$V_{AB} = V_A - V_B$$

A voltmeter measures exactly this. It has two leads and goes **across** a part, in parallel with it; the reading is the red lead relative to the black ([[multimeter]]).

### Rises and drops
A battery or power supply raises the potential of the charge passing through it from − to +: that rise is its electromotive force ([[sources]]). Everywhere else the potential falls, in steps across each component, until it is back at the − terminal. Walk round any closed loop adding the rises and the drops and you get zero ([[kirchhoffs-laws]]) — for the same reason that a round walk in the hills ends at the height where it began. Parts in parallel share the same two nodes, so they have the same voltage; parts in series share out the source's voltage between them ([[series-parallel]]).

### A sense of scale
| Source | Voltage |
|---|---|
| Type K thermocouple, per °C | about 41 µV |
| Silicon diode, forward | 0.6–0.7 V |
| Alkaline cell (AA) | 1.5–1.6 V new, 1.0 V flat |
| Lithium-ion cell | 3.0–4.2 V |
| Logic supplies | 1.8 V, 3.3 V, 5 V |
| Car electrical system | 12.6 V resting, 13.8–14.4 V charging |
| Mains, UK and Europe | 230 V RMS (325 V peak) |
| Mains, North America | 120 V RMS (170 V peak) |

### Voltage and safety
Voltage is what drives current through a body. Dry skin has a resistance of many kilohms, so a 12 V battery is harmless to touch while the mains can drive a lethal current. Electrical standards treat below 50 V AC or 120 V ripple-free DC as **extra-low voltage**; above that, assume every node is live until you have measured it — and remember that capacitors in a switched-off supply can hold their charge for minutes.

### Voltage and field
Across a gap $d$ in a uniform field, $V = E d$ ([[physics:electric-field|electric field]]). Air breaks down at roughly 3 kV per millimetre, which is why mains and high-voltage boards specify **clearance** (through air) and **creepage** (along the board surface) distances between conductors. A static spark from a fingertip carries several kilovolts across a few millimetres — enough to punch through a MOSFET gate oxide rated for 20 V, which is why sensitive parts are handled with ESD precautions.
`,
  ideas: [
    'Voltage is energy per charge: 1 V = 1 J/C.',
    'A voltage is always between two points; node voltages are measured from a chosen reference, ground.',
    'Moving the ground changes every node voltage but no voltage difference.',
    'Sources raise the potential, loads drop it, and round any loop the rises and drops cancel.',
    'Parts in parallel have the same voltage; parts in series share the total.'
  ],
  pitfalls: [
    'A point in a circuit has a voltage of its own — Only relative to a reference. Change the ground and every node voltage changes, while every difference stays.',
    'Ground means a connection to the earth — On a schematic it is only the reference node; a battery gadget\'s ground touches no earth at all.',
    'High voltage is what kills — Current through the body does the harm, but voltage is what drives it through the skin\'s resistance, so a few hundred volts is far more dangerous than 12 V.'
  ],
  formulas: [
    {
      name: 'Voltage as energy per charge',
      expr: 'V = W/Q', tex: 'V = \\frac{W}{Q}',
      vars: {
        V: { name: 'voltage', q: 'voltage', unit: 'V', tex: 'V' },
        W: { name: 'energy transferred', q: 'energy', unit: 'J', value: 24, tex: 'W' },
        Q: { name: 'charge moved', q: 'charge', unit: 'C', value: 2, tex: 'Q' }
      },
      stories: {
        W: 'A {V} battery moves {Q} of charge round a circuit. How much energy does it deliver?',
        V: 'Moving {Q} between two points transfers {W}. What is the voltage between them?'
      }
    },
    {
      name: 'Voltage between two nodes',
      expr: 'Vab = Va - Vb', tex: 'V_{AB} = V_A - V_B',
      vars: {
        Vab: { name: 'voltage of A relative to B', q: 'voltage', unit: 'V', signed: true, tex: 'V_{AB}' },
        Va: { name: 'voltage of node A (from ground)', q: 'voltage', unit: 'V', value: 5, signed: true, tex: 'V_A' },
        Vb: { name: 'voltage of node B (from ground)', q: 'voltage', unit: 'V', value: 1.8, signed: true, tex: 'V_B' }
      },
      stories: { Vab: 'Node A is at {Va} and node B at {Vb}, both measured from ground. What does a voltmeter read with red on A and black on B?' }
    },
    {
      name: 'Field across a uniform gap',
      expr: 'E = V/d', tex: 'E = \\frac{V}{d}',
      vars: {
        E: { name: 'electric field', q: 'efield', unit: 'kV/cm', tex: 'E' },
        V: { name: 'voltage across the gap', q: 'voltage', unit: 'V', value: 1000, tex: 'V' },
        d: { name: 'gap', q: 'length', unit: 'mm', value: 0.5, tex: 'd' }
      },
      note: 'Dry air breaks down at about 30 kV/cm (3 kV/mm) across gaps of a millimetre or more; sharp points and dirt lower it.',
      stories: { E: 'Two tracks {d} apart differ by {V}. What field does the air between them see?' }
    }
  ],
  examples: [
    {
      title: 'How much energy is in a phone battery?',
      q: 'A phone cell is rated 3.7 V and 3000 mAh. How much energy does it store?',
      steps: [
        'Convert the capacity to charge: $3000\\ \\mathrm{mAh} = 3\\ \\mathrm{A} \\times 3600\\ \\mathrm{s} = 10\\,800\\ \\mathrm{C}$.',
        'Each coulomb carries 3.7 J: $W = V Q = 3.7 \\times 10\\,800 \\approx 40\\,000\\ \\mathrm{J}$.',
        'In the units on the label: $3.7\\ \\mathrm{V} \\times 3\\ \\mathrm{Ah} = 11.1\\ \\mathrm{Wh}$ (1 Wh = 3600 J).'
      ],
      a: 'About 40 kJ, or 11.1 Wh.'
    },
    {
      title: 'Moving the ground',
      q: 'Measured from a battery\'s negative terminal, three nodes read A = 9.0 V, B = 5.4 V and C = 2.1 V. What do they read if the black lead is moved to node B, and what is the voltage of A relative to C in each case?',
      steps: [
        'Subtract the new reference from every reading: A = 9.0 − 5.4 = 3.6 V, B = 0 V, C = 2.1 − 5.4 = −3.3 V.',
        'The difference A − C was 9.0 − 2.1 = 6.9 V; now it is 3.6 − (−3.3) = 6.9 V.',
        'Node voltages depend on the reference; differences do not. A negative node voltage just means the node is below the chosen ground.'
      ],
      a: 'A = 3.6 V, B = 0, C = −3.3 V; V_AC = 6.9 V either way.'
    }
  ],
  quiz: [
    { q: 'A bird stands on a single bare 11 kV power line and is unharmed. Why?', choices: ['Birds have very high resistance', 'Both its feet are at practically the same potential', 'The line carries alternating current', 'Its feet are insulated by its claws'], a: 1,
      why: 'Current needs a voltage difference. Between two points a few centimetres apart on the same conductor there is almost none. Touching the line and a pole at the same time would be another story.' },
    { q: 'To measure the voltage across a resistor, the voltmeter is connected in series with it.', a: false,
      why: 'A voltmeter goes across the part, in parallel, so that it sees the two nodes. In series it would interrupt the circuit with its 10 MΩ input.' },
    { q: 'You choose a different node as ground. What changes?', choices: ['Every voltage difference', 'Every node voltage, but no voltage difference', 'Nothing at all', 'The currents'], a: 1,
      why: 'Every node voltage is shifted by the same amount, so differences — and therefore the currents they drive — are unchanged.' },
    { q: 'How much energy, in joules, does one electron gain when it moves through a potential difference of 1 V?', answer: 1.602e-19, unit: 'J',
      why: 'W = QV = 1.602 × 10⁻¹⁹ C × 1 V. This amount of energy is called one electronvolt.' },
    { q: 'Four fresh 1.5 V AA cells are connected in series. The voltage across the chain is…', choices: ['1.5 V', '3 V', '6 V', '1.5 V, but with four times the current'], a: 2,
      why: 'In series the rises add: 4 × 1.5 = 6 V. In parallel they would stay at 1.5 V with more capacity.' }
  ],
  applications: ['Choosing logic levels and supply rails (1.8, 3.3, 5, 12 V).', 'Measuring node voltages against ground to find a fault.', 'Clearance and creepage distances on mains and high-voltage boards.', 'Safety: extra-low-voltage design so users can touch the circuit.'],
  history: 'Alessandro Volta\'s pile of 1800, the first battery, gave the unit its name. The volt was defined in 1881 so that the ohm and the ampere fitted it: one volt drives one ampere through one ohm.',
  sim: 'fund-kirchhoff'
},

{
  id: 'resistance-ohms-law', parent: 'dc-basics', title: 'Resistance and Ohm\'s law', level: 1,
  short: 'Resistance is voltage divided by current. For resistors and metals it is constant — Ohm\'s law, V = IR — while lamps, diodes and thermistors bend the rule.',
  keywords: ['resistance', 'Ohm\'s law', 'V = IR', 'ohm', 'conductance', 'siemens', 'I-V curve', 'ohmic', 'non-ohmic', 'resistivity', 'temperature coefficient', 'wire resistance', 'inrush', 'dynamic resistance'],
  prereq: ['charge-and-current', 'voltage', 'physics:ohms-law', 'physics:resistivity'],
  related: ['power-energy', 'resistors', 'series-parallel', 'wire-sizing', 'diode-models'],
  body: `
Put a voltage across a piece of material and a current flows. The ratio of the two is its **resistance**,

$$R = \\frac{V}{I}$$

in ohms (Ω): one ohm lets one ampere through for each volt. For metals and for the resistors in your parts drawer, $R$ stays the same whatever the voltage — double the voltage and the current doubles. That proportionality is **Ohm's law**,

$$V = I R$$

the most used equation in electronics. Its three forms answer the three everyday questions: what current will flow ($I = V/R$), what resistor do I need ($R = V/I$), and how much voltage will it drop ($V = IR$).

### Ohmic and non-ohmic parts
Plot current against voltage: an ohmic part gives a straight line through the origin with slope $1/R$. Many parts do not:
- A **filament lamp** bends over. Tungsten's resistance rises more than tenfold as it heats, so a 12 V 21 W car bulb that is 6.9 Ω when lit measures well under 1 Ω cold — and takes a switch-on surge ten or more times its running current.
- A **diode** passes almost nothing until about 0.6 V, then its current rises exponentially ([[diode-models]]).
- A **thermistor** changes its resistance with temperature by design ([[thermistors-rtd]]).

For such parts $V/I$ at a point (the **static** resistance) and the slope $\\Delta V/\\Delta I$ there (the **dynamic** or small-signal resistance) differ, and you have to say which you mean. A silicon diode at 1 mA has a static resistance of about 650 Ω but a dynamic resistance of only 26 Ω.

### What sets the resistance
A uniform conductor of length $L$ and cross-section $A$ has

$$R = \\rho \\frac{L}{A}$$

where $\\rho$ is the material's [[physics:resistivity|resistivity]]: $1.72 \\times 10^{-8}\\ \\Omega\\,\\mathrm{m}$ for copper, $2.8 \\times 10^{-8}$ for aluminium, about $1.1 \\times 10^{-6}$ for the nichrome in heating elements. Twice as long is twice the resistance; twice the diameter is four times the area and a quarter of the resistance. Resistance also rises with temperature, $R = R_0(1 + \\alpha\\,\\Delta T)$, with $\\alpha \\approx 0.0039$ per kelvin for copper — a motor winding at 100 °C has about 30 % more resistance than at 20 °C.

> [!tip] Numbers worth remembering: 1 m of 1 mm² copper is 17 mΩ; a PCB track of standard 35 µm copper, 0.25 mm wide, is about 2 mΩ per millimetre. Over a long cable run these milliohms become volts.

### Conductance
Sometimes it is easier to say how well a part conducts: the **conductance** $G = 1/R$, in siemens (S). Conductances in parallel simply add, which makes them the natural language of [[nodal-analysis]] and the [[current-divider]].

### On the bench
Resistance is measured with the circuit **unpowered**: an ohmmeter drives its own small current and divides. In circuit, other paths in parallel make the reading low. For resistors as parts — the E12 and E24 values, tolerance, power rating and temperature coefficient — see [[resistors]].
`,
  ideas: [
    'Resistance is V/I; Ohm\'s law says it is constant for metals and resistors.',
    'On an I–V graph an ohmic part is a straight line through the origin with slope 1/R.',
    'Lamps, diodes and thermistors are non-ohmic: their static V/I and dynamic ΔV/ΔI differ.',
    'R = ρL/A: resistance grows with length, falls with cross-section, and rises with temperature in metals.',
    'Conductance G = 1/R, in siemens; conductances in parallel add.'
  ],
  pitfalls: [
    'Ohm\'s law V = IR holds for every component — R = V/I can always be calculated, but it is only constant for ohmic parts. A lamp or a diode has a different V/I at every point.',
    'A cold lamp that measures 1 Ω on the meter is faulty — Tungsten\'s resistance is more than ten times lower cold than hot; the meter is right, and that is why lamps draw a surge at switch-on.',
    'Wire resistance is negligible — Over a few metres at a few amps it is not: 20 m of 1.5 mm² copper is 0.23 Ω, which drops almost 2 V at 8 A.'
  ],
  formulas: [
    {
      name: 'Ohm\'s law',
      expr: 'V = I*R', tex: 'V = I R',
      vars: {
        V: { name: 'voltage across the resistor', q: 'voltage', unit: 'V', tex: 'V' },
        I: { name: 'current through it', q: 'current', unit: 'mA', value: 20, tex: 'I' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 470, tex: 'R' }
      },
      stories: {
        V: 'A current of {I} flows through a {R} resistor. What voltage does it drop?',
        I: 'A {R} resistor has {V} across it. What current flows?',
        R: 'You need {I} to flow when {V} is applied. What resistance do you need?'
      }
    },
    {
      name: 'Resistance of a wire',
      expr: 'R = rho*L/A', tex: 'R = \\rho \\frac{L}{A}',
      vars: {
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', tex: 'R' },
        rho: { name: 'resistivity (copper 1.72 × 10⁻⁸ Ω·m)', q: 'resistivity', unit: 'Ω·m', value: 1.72e-8, tex: '\\rho' },
        L: { name: 'length of conductor', q: 'length', unit: 'm', value: 20, tex: 'L' },
        A: { name: 'cross-section', q: 'area', unit: 'mm²', value: 1.5, tex: 'A' }
      },
      note: 'For a cable run, L is the length there and back: a load 10 m away has 20 m of copper in its loop.',
      stories: {
        R: 'A load 10 m from the battery is wired with {A} copper cable, {L} of conductor in all. What is the loop resistance?',
        A: 'A loop of {L} of copper must have no more than {R}. What cross-section is needed?'
      }
    },
    {
      name: 'Resistance and temperature',
      expr: 'R = R0*(1 + alpha*dT)', tex: 'R = R_0 (1 + \\alpha\\,\\Delta T)',
      vars: {
        R: { name: 'resistance when warm', q: 'resistance', unit: 'Ω', tex: 'R' },
        R0: { name: 'resistance at the reference temperature', q: 'resistance', unit: 'Ω', value: 10, tex: 'R_0' },
        alpha: { name: 'temperature coefficient (copper 0.0039 /K)', q: 'expansion', unit: '1/K', value: 0.0039, signed: true, tex: '\\alpha' },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 80, signed: true, tex: '\\Delta T' }
      },
      note: 'Linear over a moderate range. Resistor datasheets quote α in ppm/K: 50 ppm/K for metal film, 100–250 for thick-film chips.',
      stories: { R: 'A copper motor winding measures {R0} at 20 °C. What is its resistance after warming by {dT}?' }
    }
  ],
  examples: [
    {
      title: 'Voltage drop in a van\'s wiring',
      q: 'A 12 V water pump drawing 8 A sits 10 m from the battery, wired with 1.5 mm² copper. How much voltage is lost in the cable, and what cross-section keeps the loss under 3 %?',
      steps: [
        'The loop is 20 m of copper: $R = 1.72 \\times 10^{-8} \\times 20 / 1.5 \\times 10^{-6} = 0.229\\ \\Omega$.',
        'Drop: $V = IR = 8 \\times 0.229 = 1.83\\ \\mathrm{V}$ — 15 % of 12 V. The pump runs slowly and the cable warms by $I^2R = 15\\ \\mathrm{W}$.',
        'For 3 % (0.36 V) the resistance must be $0.36/8 = 0.045\\ \\Omega$, so $A = \\rho L / R = 1.72 \\times 10^{-8} \\times 20 / 0.045 = 7.6\\ \\mathrm{mm^2}$.',
        'The next standard size up is 10 mm² (6 mm² would lose 3.8 %). Low-voltage DC systems are dominated by this problem — at 230 V the same power would need only 0.35 A.'
      ],
      a: '1.8 V lost (15 %); about 10 mm² cable keeps it under 3 %.'
    },
    {
      title: 'Switch-on surge of a lamp',
      q: 'A 12 V 21 W brake-lamp bulb measures 0.55 Ω at room temperature. Compare its running current with the current at the instant it is switched on.',
      steps: [
        'Hot resistance from the rating: $R = V^2/P = 144/21 = 6.86\\ \\Omega$, so the running current is $12/6.86 = 1.75\\ \\mathrm{A}$.',
        'Cold, the filament is 0.55 Ω: $I = 12/0.55 = 22\\ \\mathrm{A}$ for the first few milliseconds, until it heats.',
        'The surge is about 12 times the running current. A transistor or relay switching the lamp, and its fuse, must be chosen for it.'
      ],
      a: '1.75 A running, about 22 A at switch-on.'
    }
  ],
  quiz: [
    { q: 'A copper wire is replaced by one twice as long and twice the diameter. Its resistance…', choices: ['stays the same', 'doubles', 'halves', 'falls to a quarter'], a: 2,
      why: 'Length ×2 doubles R; diameter ×2 gives four times the area, dividing R by 4. Together: ×2/4 = ½.' },
    { q: 'On a graph of current (vertical) against voltage (horizontal), a steeper straight line through the origin means…', choices: ['a larger resistance', 'a smaller resistance', 'a non-ohmic part', 'more power'], a: 1,
      why: 'The slope is I/V = 1/R. More current for the same voltage means less resistance.' },
    { q: 'A 12 V 1 A lamp (12 Ω when lit) reads 1.1 Ω on an ohmmeter. What can you conclude?', choices: ['The filament is partly shorted', 'Nothing is wrong: cold tungsten has about a tenth of its hot resistance', 'The meter needs calibrating', 'The lamp is rated wrongly'], a: 1,
      why: 'Tungsten\'s resistance rises steeply with temperature. The ohmmeter barely warms the filament, so it sees the cold value.' },
    { q: 'What current flows through a 4.7 kΩ resistor with 9 V across it? (in mA)', answer: 1.915, unit: 'mA',
      why: 'I = V/R = 9 / 4700 = 1.915 × 10⁻³ A.' },
    { q: 'A silicon diode carrying 10 mA has 0.72 V across it. Its dynamic resistance at that point is 72 Ω.', a: false,
      why: '72 Ω is the static resistance V/I. The dynamic resistance, the slope ΔV/ΔI, is about n·26 mV/I ≈ 2.6 Ω — much smaller, because the exponential curve is steep there.' }
  ],
  applications: ['Choosing a resistor to set a current (LEDs, bias networks, pull-ups).', 'Sizing cables and tracks for an acceptable voltage drop.', 'Estimating a motor or coil temperature from its resistance rise.', 'Sensing: thermistors, strain gauges and RTDs are resistors that change on purpose.'],
  history: 'Georg Simon Ohm published the law in 1827, from careful measurements with thermocouples as steady sources. His work was dismissed at first; the unit of resistance was named after him in 1861.',
  sim: 'fund-ohm'
},

{
  id: 'power-energy', parent: 'dc-basics', title: 'Power and energy', level: 1,
  short: 'Electrical power is voltage times current. In a resistor it all becomes heat — which sets resistor ratings, cable sizes and battery life.',
  keywords: ['power', 'watt', 'P = VI', 'I squared R', 'energy', 'kilowatt-hour', 'watt-hour', 'power rating', 'derating', 'heat', 'efficiency', 'passive sign convention'],
  prereq: ['voltage', 'resistance-ohms-law', 'physics:electric-power'],
  related: ['heat-sinks', 'resistors', 'batteries', 'linear-regulators', 'converter-losses'],
  body: `
Each coulomb that passes through a part with voltage $V$ across it delivers $V$ joules. A current $I$ brings $I$ coulombs a second, so the **power** — energy per second, in watts — is

$$P = V I$$

For a resistor, Ohm's law gives two more forms:

$$P = I^2 R = \\frac{V^2}{R}$$

Use whichever fits what you know. $I^2R$ suits parts in series (same current) and $V^2/R$ parts in parallel (same voltage) — and together they explain a result that surprises people: in **series** the **larger** resistor gets hotter, in **parallel** the **smaller** one does.

### Where the power goes
In a resistor it all becomes heat, and the heat must escape. Every resistor has a **power rating**: 0.1 W for an 0603 chip, 0.25 W for the common through-hole part, 1–5 W for larger bodies, 25 W and more for aluminium-clad parts bolted to a heat sink. The rating holds up to an ambient of about 70 °C and falls to zero at around 155 °C. A good habit is to run resistors at **half their rating or less**: at full rating a small resistor's surface can exceed 150 °C, enough to discolour the board and shift its value. The same heat budget governs transistors and regulators ([[heat-sinks]]).

### Absorbing or delivering: the sign convention
Take any part and let the current flow **into its + terminal**. Then a positive $P = VI$ means the part **absorbs** power (a resistor, a battery being charged); a negative one means it **delivers** power (a battery discharging, a generator). With this **passive sign convention** the powers of all the parts in a circuit add to exactly zero: the sources deliver what the loads absorb.

### Energy, watt-hours and kilowatt-hours
Energy is power times time, $E = P t$. The joule is small for everyday use, so electricity is billed in **kilowatt-hours**, $1\\ \\mathrm{kWh} = 3.6\\ \\mathrm{MJ}$, and batteries are labelled in **watt-hours** — their voltage times their capacity: a 3.7 V, 3000 mAh cell stores $3.7 \\times 3 = 11.1\\ \\mathrm{Wh}$. A device drawing a single watt all year uses 8.8 kWh; multiply by the chargers left plugged in across a country and "only a watt" of standby becomes a power station.

### Efficiency
Converters lose some power as heat. The efficiency is $\\eta = P_\\text{out}/P_\\text{in}$, and the difference $P_\\text{in} - P_\\text{out}$ is what warms the board. A [[linear-regulators|linear regulator]] making 5 V from 12 V can be at most $5/12 = 42\\ \\%$ efficient, because the whole load current passes through a 7 V drop; a switching [[buck-converter]] reaches 90 % or more. At 1 A that is the difference between 7 W of heat, needing a heat sink, and about half a watt.

### Why transmission uses high voltage
To deliver a power $P$ at voltage $V$ takes a current $P/V$, and the cables waste $I^2 R_\\text{cable}$. Double the voltage and the current halves, and the loss falls fourfold. The same logic takes grids to hundreds of kilovolts, data centres to 48 V distribution, and cars towards 48 V for large loads — and it is why USB fast chargers raise the voltage rather than the current.
`,
  ideas: [
    'P = VI; for a resistor also I²R and V²/R.',
    'In series the larger resistor dissipates more (I²R); in parallel the smaller one does (V²/R).',
    'Run resistors at half their rated power or less.',
    'With the passive sign convention, the powers of all parts in a circuit add to zero.',
    'Energy = power × time; 1 kWh = 3.6 MJ, and battery watt-hours = volts × amp-hours.'
  ],
  pitfalls: [
    'A resistor is fine as long as its power is just under the rating — The rating is where the part reaches its maximum temperature, at 70 °C ambient. Close to it, the resistor runs very hot; derate by half.',
    'Doubling the voltage across a resistor doubles its power — It quadruples it: the current doubles too, so P = V²/R goes up by four.',
    'A higher-capacity battery in mAh always stores more energy — Only at the same voltage. Compare watt-hours: 3000 mAh at 3.7 V (11.1 Wh) beats 5000 mAh at 1.2 V (6 Wh).'
  ],
  formulas: [
    {
      name: 'Electrical power',
      expr: 'P = V*I', tex: 'P = V I',
      vars: {
        P: { name: 'power', q: 'power', unit: 'W', tex: 'P' },
        V: { name: 'voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V' },
        I: { name: 'current', q: 'current', unit: 'A', value: 2, tex: 'I' }
      },
      stories: {
        P: 'A {V} fan draws {I}. What power does it take?',
        I: 'A {P} lamp runs from {V}. What current does it draw?'
      }
    },
    {
      name: 'Power in a resistor from its current',
      expr: 'P = I^2*R', tex: 'P = I^2 R',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'W', tex: 'P' },
        I: { name: 'current', q: 'current', unit: 'mA', value: 100, tex: 'I' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 47, tex: 'R' }
      },
      stories: { P: 'A {R} resistor carries {I}. How much heat does it produce?', I: 'A {R}, 0.25 W resistor should run at no more than {P}. What is the largest current it may carry?' }
    },
    {
      name: 'Power in a resistor from its voltage',
      expr: 'P = V^2/R', tex: 'P = \\frac{V^2}{R}',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'W', tex: 'P' },
        V: { name: 'voltage across it', q: 'voltage', unit: 'V', value: 12, tex: 'V' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 100, tex: 'R' }
      },
      stories: { P: 'A {R} resistor is connected across {V}. What power does it dissipate?' }
    },
    {
      name: 'Energy used',
      expr: 'E = P*t', tex: 'E = P t',
      vars: {
        E: { name: 'energy', q: 'energy', unit: 'kWh', tex: 'E' },
        P: { name: 'power', q: 'power', unit: 'W', value: 10, tex: 'P' },
        t: { name: 'time', q: 'time', unit: 'yr', value: 1, tex: 't' }
      },
      stories: { E: 'A router draws {P} continuously. How much energy does it use in {t}?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the resistor\'s power rating',
      q: 'A red LED (2.0 V at 20 mA) is run from a 12 V rail through a series resistor. Choose the resistor and its power rating.',
      steps: [
        'The resistor drops $12 - 2 = 10\\ \\mathrm{V}$ at 20 mA: $R = 10/0.02 = 500\\ \\Omega$. The nearest E12 value is 470 Ω (21 mA) or 560 Ω (18 mA); take 560 Ω.',
        'Current: $I = 10/560 = 17.9\\ \\mathrm{mA}$. Power: $P = I^2R = 0.0179^2 \\times 560 = 0.18\\ \\mathrm{W}$.',
        'A 0.25 W resistor would run at 71 % of its rating — hot. Use a 0.5 W part, or two 1.2 kΩ 0.25 W resistors in parallel (600 Ω, 0.08 W each).',
        'The LED itself takes only $2 \\times 0.0179 = 0.036\\ \\mathrm{W}$: 83 % of the power drawn from the 12 V rail is wasted in the resistor.'
      ],
      a: '560 Ω, rated 0.5 W (0.18 W dissipated).'
    },
    {
      title: 'How long will the power bank last?',
      q: 'An 18650 cell (3.6 V nominal, 3000 mAh) feeds a 5 V, 400 mA load through a boost converter that is 90 % efficient. Estimate the running time.',
      steps: [
        'Stored energy: $3.6 \\times 3.0 = 10.8\\ \\mathrm{Wh}$.',
        'Load power: $5 \\times 0.4 = 2.0\\ \\mathrm{W}$; drawn from the cell: $2.0/0.9 = 2.22\\ \\mathrm{W}$.',
        'Time: $10.8/2.22 = 4.9\\ \\mathrm{h}$. Working in energy, not mAh, handles the change of voltage automatically.'
      ],
      a: 'About 4.9 hours.'
    }
  ],
  quiz: [
    { q: 'A 100 Ω and a 1 kΩ resistor are in series across 12 V. Which gets hotter?', choices: ['The 100 Ω', 'The 1 kΩ', 'Both the same', 'Neither: series resistors share power equally'], a: 1,
      why: 'Same current in both, so P = I²R is larger for the larger resistance — ten times larger here.' },
    { q: 'The same two resistors are connected in parallel across 12 V. Which gets hotter?', choices: ['The 100 Ω', 'The 1 kΩ', 'Both the same', 'It depends on the current'], a: 0,
      why: 'Same voltage across both, so P = V²/R is larger for the smaller resistance: 1.44 W against 0.144 W.' },
    { q: 'The voltage across a resistor is doubled. Its power…', choices: ['doubles', 'quadruples', 'stays the same', 'halves'], a: 1,
      why: 'P = V²/R: twice the voltage drives twice the current, giving four times the power.' },
    { q: 'What power, in watts, does a 47 Ω resistor dissipate when it carries 100 mA?', answer: 0.47, unit: 'W',
      why: 'P = I²R = 0.1² × 47 = 0.47 W — too much for a 0.25 W or even a 0.5 W part; use 1 W or larger.' },
    { q: 'A 0.25 W resistor dissipating 0.24 W will run cool enough to touch comfortably.', a: false,
      why: 'At its rating a resistor is at its maximum temperature — often well over 100 °C at the surface. Keep the dissipation to about half the rating.' }
  ],
  applications: ['Choosing resistor, transistor and regulator power ratings.', 'Battery sizing in watt-hours for portable devices.', 'Cable and track sizing from I²R losses.', 'Energy bills and standby-power budgets.'],
  history: 'James Prescott Joule showed in 1841 that the heat produced by a current is proportional to I²R, one of the steps towards the law of conservation of energy. The watt is named after James Watt, whose steam engines were rated in horsepower.',
  sim: 'fund-lamps'
},

{
  id: 'series-parallel', parent: 'dc-basics', title: 'Series and parallel circuits', level: 1,
  short: 'In series, parts share one current and the voltages add; in parallel, they share one voltage and the currents add. Most networks reduce step by step to one resistance.',
  keywords: ['series', 'parallel', 'equivalent resistance', 'product over sum', 'reduction', 'lamps', 'batteries in series', 'batteries in parallel', 'resistor combinations'],
  prereq: ['resistance-ohms-law', 'charge-and-current', 'voltage', 'physics:resistors-combinations'],
  related: ['voltage-divider', 'current-divider', 'kirchhoffs-laws', 'resistors'],
  body: `
Two parts can be connected in two basic ways, and nearly every circuit is built from them.

**In series** — one after the other, with nothing branching off between them — the parts carry **the same current**, and their voltages add up to the total. Resistances in series add:

$$R_\\text{s} = R_1 + R_2 + \\dots + R_n$$

**In parallel** — connected across the same two nodes — the parts have **the same voltage**, and their currents add up to the total. Their conductances add, so the resistances combine as reciprocals:

$$\\frac{1}{R_\\text{p}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots + \\frac{1}{R_n}$$

For two resistors that is "product over sum", $R_1 R_2/(R_1 + R_2)$, written $R_1 \\parallel R_2$. Worth knowing by heart: $n$ equal resistors in parallel give $R/n$; a parallel combination is always **smaller than its smallest** member; and a large resistor in parallel with a small one hardly changes it — $1\\ \\mathrm{k\\Omega} \\parallel 1\\ \\mathrm{M\\Omega} = 999\\ \\Omega$.

### Recognising them
Do not trust how a drawing looks. Two parts are in series only if the node between them goes nowhere else. They are in parallel if both their ends share the same two nodes, however the wires are drawn. Redraw the circuit with each node as a single dot and it usually becomes obvious.

Most networks are neither purely series nor purely parallel, but many **reduce** step by step: combine a parallel pair, then the result in series with the next resistor, and so on to a single equivalent resistance. Then work backwards, using Ohm's law at each step, to find every current and voltage. Networks that do not reduce — a bridge, or a circuit with sources in different branches — need [[kirchhoffs-laws]] and the methods built on them.

### Lamps and house wiring
Old Christmas-tree lights were wired in series: one failed filament broke the loop and the whole string went dark. The wiring in a house is parallel: every socket sees the full mains voltage, each appliance draws its own current independently of the others, and the supply carries the sum — which is why the fuse or breaker sits in the common feed. The simulation shows both, and one more surprise: two lamps of different wattage in series, where the **smaller** lamp glows brighter.

### Practical uses
- **Making a value you do not have.** 2 × 10 kΩ in series gives 20 kΩ; 10 kΩ ∥ 15 kΩ gives 6 kΩ.
- **Sharing power.** Eight 1.2 kΩ, 0.25 W resistors in parallel make a 150 Ω resistor good for 2 W.
- **Sharing voltage.** A small chip resistor is rated for only 150–200 V; high-voltage dividers use a string in series so that each sees a safe fraction.
- **Batteries.** Cells in series add their voltages (four 1.5 V cells give 6 V at the capacity of one); in parallel they add capacity at the same voltage — but only if matched, or the fuller cell pours current into the flatter one.

> [!key] Series: same current, voltages add, resistances add. Parallel: same voltage, currents add, conductances add.
`,
  ideas: [
    'Series parts carry the same current; their voltages add, and so do their resistances.',
    'Parallel parts have the same voltage; their currents add, and so do their conductances.',
    'A parallel combination is smaller than its smallest member; two in parallel: product over sum.',
    'Many networks reduce step by step; then work back to each current with Ohm\'s law.',
    'Series is decided by topology — a node between two parts that goes nowhere else — not by how the drawing looks.'
  ],
  pitfalls: [
    'Two parts drawn one after the other are in series — Only if nothing else connects to the node between them. A third branch at that node makes them neither series nor parallel.',
    'Adding a resistor in parallel raises the total resistance — Parallel paths always lower it: another path can only let more current through.',
    'Series lamps share the voltage, so a bigger lamp glows brighter — With the same current, the higher-resistance (lower-wattage) lamp takes more voltage and more power.'
  ],
  formulas: [
    {
      name: 'Three resistors in series',
      expr: 'Rs = R1 + R2 + R3', tex: 'R_{\\text{s}} = R_1 + R_2 + R_3',
      vars: {
        Rs: { name: 'total resistance', q: 'resistance', unit: 'kΩ', tex: 'R_{\\text{s}}' },
        R1: { name: 'first resistor', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' },
        R2: { name: 'second resistor', q: 'resistance', unit: 'kΩ', value: 2.2, tex: 'R_2' },
        R3: { name: 'third resistor', q: 'resistance', unit: 'kΩ', value: 4.7, tex: 'R_3' }
      },
      stories: { Rs: 'Resistors of {R1}, {R2} and {R3} are wired in series. What is the total?' }
    },
    {
      name: 'Two resistors in parallel',
      expr: 'Rp = R1*R2/(R1 + R2)', tex: 'R_{\\text{p}} = \\frac{R_1 R_2}{R_1 + R_2}',
      vars: {
        Rp: { name: 'parallel combination', q: 'resistance', unit: 'kΩ', tex: 'R_{\\text{p}}' },
        R1: { name: 'first resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        R2: { name: 'second resistor', q: 'resistance', unit: 'kΩ', value: 15, tex: 'R_2' }
      },
      note: 'Solve for R₂ to find what to put in parallel with an existing resistor to reach a target value.',
      stories: {
        Rp: 'A {R1} and a {R2} resistor are connected in parallel. What is the combination?',
        R2: 'A board has a {R1} pull-up; you want {Rp}. What do you solder in parallel with it?'
      }
    },
    {
      name: 'Three resistors in parallel',
      expr: 'Rp = 1/(1/R1 + 1/R2 + 1/R3)', tex: 'R_{\\text{p}} = \\frac{1}{1/R_1 + 1/R_2 + 1/R_3}',
      vars: {
        Rp: { name: 'parallel combination', q: 'resistance', unit: 'kΩ', tex: 'R_{\\text{p}}' },
        R1: { name: 'first resistor', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' },
        R2: { name: 'second resistor', q: 'resistance', unit: 'kΩ', value: 2.2, tex: 'R_2' },
        R3: { name: 'third resistor', q: 'resistance', unit: 'kΩ', value: 3.3, tex: 'R_3' }
      },
      stories: { Rp: 'Three resistors, {R1}, {R2} and {R3}, are connected in parallel. What is the combination?' }
    }
  ],
  examples: [
    {
      title: 'Reducing a network',
      q: 'A 9 V supply feeds a 1 kΩ resistor in series with a parallel pair of 2.2 kΩ and 3.3 kΩ. Find every current.',
      steps: [
        'The parallel pair: $2.2 \\parallel 3.3 = 7.26/5.5 = 1.32\\ \\mathrm{k\\Omega}$.',
        'In series with 1 kΩ: $R = 2.32\\ \\mathrm{k\\Omega}$, so the supply current is $9/2.32 = 3.88\\ \\mathrm{mA}$.',
        'The 1 kΩ drops $3.88\\ \\mathrm{V}$, leaving $9 - 3.88 = 5.12\\ \\mathrm{V}$ across the pair.',
        'Branch currents: $5.12/2.2 = 2.33\\ \\mathrm{mA}$ and $5.12/3.3 = 1.55\\ \\mathrm{mA}$. Check: $2.33 + 1.55 = 3.88\\ \\mathrm{mA}$.'
      ],
      a: '3.88 mA from the supply, splitting into 2.33 mA (2.2 kΩ) and 1.55 mA (3.3 kΩ).'
    },
    {
      title: 'Fixing a pull-up with a parallel resistor',
      q: 'An I²C bus has 4.7 kΩ pull-ups and its edges are too slow; you want about 2.2 kΩ, and can only add parts. What resistor goes in parallel?',
      steps: [
        'Work in conductances: $1/R_2 = 1/R_\\text{p} - 1/R_1 = 1/2.2 - 1/4.7 = 0.455 - 0.213 = 0.242\\ \\mathrm{mS}$.',
        'So $R_2 = 4.14\\ \\mathrm{k\\Omega}$. From E24: 4.3 kΩ gives $4.7 \\parallel 4.3 = 2.25\\ \\mathrm{k\\Omega}$; 3.9 kΩ gives 2.13 kΩ.',
        'Either is close enough: pull-up values are not critical to a few per cent.'
      ],
      a: 'About 4.1 kΩ; a standard 4.3 kΩ gives 2.25 kΩ.'
    }
  ],
  quiz: [
    { q: 'Adding a resistor in parallel can raise the total resistance, if the new resistor is large enough.', a: false,
      why: 'A parallel path adds conductance, however small. The total can only fall — by very little if the new resistor is large.' },
    { q: 'Three identical lamps are in parallel across a battery with negligible internal resistance. One is unscrewed. The other two…', choices: ['go out', 'get brighter', 'stay the same', 'get dimmer'], a: 2,
      why: 'Each still has the full battery voltage across it. Only the battery current falls.' },
    { q: 'The same three lamps are in series. One is unscrewed. The other two…', choices: ['go out', 'get brighter', 'stay the same', 'get dimmer'], a: 0,
      why: 'The loop is broken, so no current flows anywhere in it.' },
    { q: 'What is the resistance of three 330 Ω resistors in parallel, in ohms?', answer: 110, unit: 'Ω',
      why: 'n equal resistors in parallel give R/n = 330/3 = 110 Ω.' },
    { q: 'R₁ and R₂ meet at a node that also connects to R₃. Are R₁ and R₂ in series?', choices: ['Yes, they are drawn next to each other', 'No: current can leave the node through R₃, so they need not carry the same current', 'Yes, if R₃ is large', 'Only if R₁ = R₂'], a: 1,
      why: 'Series means the same current, which requires that the node between them has no other branch.' }
  ],
  applications: ['Combining standard resistors to reach a value or a power rating.', 'Battery packs: cells in series for voltage, in parallel for capacity.', 'House wiring (parallel) and old festoon lights (series).', 'High-voltage divider strings that share the voltage between resistors.'],
  sim: 'fund-lamps'
},

{
  id: 'current-divider', parent: 'dc-basics', title: 'The current divider', level: 1,
  short: 'A current reaching parallel branches splits in inverse proportion to their resistances: more takes the easier path. It is how ammeter shunts work, and why paralleled parts do not share evenly.',
  keywords: ['current divider', 'current splitting', 'shunt', 'ammeter shunt', 'conductance', 'current sharing', 'current hogging', 'parallel LEDs', 'current sense'],
  prereq: ['series-parallel', 'resistance-ohms-law', 'voltage-divider'],
  related: ['multimeter', 'leds', 'nodal-analysis', 'meter-loading'],
  body: `
When a current reaches a node with two parallel paths, it splits — and more of it takes the easier path. Both branches have the same voltage, $V = I_1 R_1 = I_2 R_2$, so the currents are in **inverse** proportion to the resistances. With a total current $I$ into the pair:

$$I_1 = I\\,\\frac{R_2}{R_1 + R_2}, \\qquad I_2 = I\\,\\frac{R_1}{R_1 + R_2}$$

Notice the **other** resistor on top: the branch with the larger resistance carries the smaller share. It is the mirror image of the [[voltage-divider]], where the resistor on top is the one you are looking at — one rule for series, one for parallel.

With more branches, conductances ($G = 1/R$) make it tidy: each branch takes a share **in proportion to its conductance**,

$$I_k = I\\,\\frac{G_k}{G_1 + G_2 + \\dots + G_n}$$

> [!tip] Quick check: the larger current is always in the smaller resistor, and the currents are in the inverse ratio of the resistances. 1 kΩ ∥ 4 kΩ splits a current 4 : 1.

### Shunts: big currents through a small meter
A moving-coil meter might reach full scale at 1 mA. To read 1 A with it, almost all the current is sent round the meter through a low-value **shunt** resistor in parallel, and the meter takes a fixed, small fraction. For a meter of resistance $R_m$ that reads full scale at $I_m$, a full-scale total of $I$ needs

$$R_\\text{sh} = \\frac{I_m R_m}{I - I_m}$$

The same principle sits inside every multimeter's current ranges ([[multimeter]]) and every current-sense resistor: a known low resistance, and a measurement of the small voltage across it. Shunts are made of manganin or similar alloys whose resistance hardly changes with temperature, and have separate sense terminals so that the heavy-current connections do not add to the reading ([[meter-loading]]).

### Paralleled parts do not share by themselves
Two paths split a current evenly only if they are identical, and real parts never quite are:
- **LEDs in parallel on one resistor.** LEDs have a steep, exponential I–V curve, so a 50 mV difference in forward voltage can let one take two or three times the current of its neighbour. It runs hotter, its forward voltage falls further, and it takes more still. Give each LED its own resistor ([[leds]]).
- **Batteries in parallel** share according to their voltages and internal resistances, and a weaker cell may even be charged by the others.
- **Bipolar transistors in parallel** hog current the same way, so each gets a small emitter resistor to force sharing. MOSFETs switched fully on share better, because their on-resistance *rises* as they heat.
- **Return currents** in ground planes and cables split between paths in inverse proportion to their impedance — which is why a return current does not always take the route you drew.

### Designing a divider on purpose
Sometimes you do want a fixed split: a precision current source that must feed two loads, or a bleeder that takes a known fraction. Because the split depends on the ratio of the branch resistances, the load's own resistance must be part of the calculation — the same loading problem as the voltage divider, seen from the other side.
`,
  ideas: [
    'Parallel branches share the same voltage, so their currents are in inverse ratio to their resistances.',
    'For two branches, I₁ = I·R₂/(R₁ + R₂): the other resistor is on top.',
    'For many branches each takes a share proportional to its conductance.',
    'A shunt carries most of a current around a sensitive meter: R_sh = I_m R_m/(I − I_m).',
    'Nominally equal parallel parts (LEDs, cells, BJTs) do not share equally without help.'
  ],
  pitfalls: [
    'The larger resistor takes the larger share of the current — It takes the smaller share: both branches have the same voltage, so I = V/R is smaller where R is larger.',
    'Identical LEDs in parallel share one resistor happily — Small differences in forward voltage, amplified by the exponential curve and by heating, make one LED hog the current.',
    'The current-divider formula looks like the voltage divider, with the same resistor on top — In the current divider the opposite branch\'s resistance is on top.'
  ],
  formulas: [
    {
      name: 'Two-branch current divider',
      expr: 'I1 = I*R2/(R1 + R2)', tex: 'I_1 = I\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        I1: { name: 'current in branch 1', q: 'current', unit: 'mA', tex: 'I_1' },
        I: { name: 'total current', q: 'current', unit: 'mA', value: 10, tex: 'I' },
        R1: { name: 'resistance of branch 1', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' },
        R2: { name: 'resistance of branch 2', q: 'resistance', unit: 'kΩ', value: 4, tex: 'R_2' }
      },
      stories: { I1: 'A current of {I} feeds {R1} in parallel with {R2}. How much flows through the {R1}?' }
    },
    {
      name: 'Share of one branch among three (conductances)',
      expr: 'I1 = I*G1/(G1 + G2 + G3)', tex: 'I_1 = I\\,\\frac{G_1}{G_1 + G_2 + G_3}',
      vars: {
        I1: { name: 'current in branch 1', q: 'current', unit: 'mA', tex: 'I_1' },
        I: { name: 'total current', q: 'current', unit: 'mA', value: 7, tex: 'I' },
        G1: { name: 'conductance of branch 1', q: 'conductance', unit: 'mS', value: 1, tex: 'G_1' },
        G2: { name: 'conductance of branch 2', q: 'conductance', unit: 'mS', value: 0.5, tex: 'G_2' },
        G3: { name: 'conductance of branch 3', q: 'conductance', unit: 'mS', value: 0.25, tex: 'G_3' }
      },
      note: 'A conductance of 1 mS is a resistance of 1 kΩ; 0.5 mS is 2 kΩ.'
    },
    {
      name: 'Shunt for extending a meter\'s range',
      expr: 'Rsh = Im*Rm/(I - Im)', tex: 'R_{\\text{sh}} = \\frac{I_m R_m}{I - I_m}',
      vars: {
        Rsh: { name: 'shunt resistance', q: 'resistance', unit: 'Ω', tex: 'R_{\\text{sh}}' },
        Im: { name: 'meter full-scale current', q: 'current', unit: 'µA', value: 50, tex: 'I_m' },
        Rm: { name: 'meter resistance', q: 'resistance', unit: 'Ω', value: 2000, tex: 'R_m' },
        I: { name: 'wanted full-scale current', q: 'current', unit: 'mA', value: 10, tex: 'I' }
      },
      stories: { Rsh: 'A {Im} movement of {Rm} must read {I} at full scale. What shunt does it need?' }
    }
  ],
  examples: [
    {
      title: 'A shunt for a panel meter',
      q: 'A 50 µA moving-coil movement has a resistance of 2 kΩ. What shunt makes it a 0–10 mA meter, and what voltage does the finished meter drop at full scale?',
      steps: [
        'At full scale the movement carries 50 µA with $50\\ \\mu\\mathrm{A} \\times 2\\ \\mathrm{k\\Omega} = 0.1\\ \\mathrm{V}$ across it.',
        'The shunt must carry the rest, $10 - 0.05 = 9.95\\ \\mathrm{mA}$, at the same 0.1 V: $R_\\text{sh} = 0.1/0.00995 = 10.05\\ \\Omega$.',
        'The finished meter drops 0.1 V at full scale — its burden voltage — and has a resistance of $2\\ \\mathrm{k\\Omega} \\parallel 10.05\\ \\Omega = 10.0\\ \\Omega$.'
      ],
      a: 'A 10.05 Ω shunt; the meter drops 0.1 V at full scale.'
    },
    {
      title: 'Three branches',
      q: 'A current of 12 mA divides between 1.5 kΩ, 3 kΩ and 6 kΩ in parallel. Find each branch current.',
      steps: [
        'Conductances: 0.667, 0.333 and 0.167 mS; total 1.167 mS.',
        'Shares: $12 \\times 0.667/1.167 = 6.86\\ \\mathrm{mA}$, $12 \\times 0.333/1.167 = 3.43\\ \\mathrm{mA}$, $12 \\times 0.167/1.167 = 1.71\\ \\mathrm{mA}$.',
        'Check the voltage: $6.86 \\times 1.5 = 3.43 \\times 3 = 1.71 \\times 6 = 10.3\\ \\mathrm{V}$ in every branch, as it must be.'
      ],
      a: '6.86 mA, 3.43 mA and 1.71 mA.'
    }
  ],
  quiz: [
    { q: 'A current of 10 mA splits between 1 kΩ and 9 kΩ in parallel. The 9 kΩ carries…', choices: ['9 mA', '1 mA', '5 mA', '0.9 mA'], a: 1,
      why: 'I = 10 × 1/(1 + 9) = 1 mA. The smaller resistor takes the larger share, 9 mA.' },
    { q: 'Two identical-looking white LEDs share one series resistor, connected in parallel. What is the risk?', choices: ['None: identical parts share equally', 'One LED hogs the current because of small forward-voltage differences and heating', 'Both LEDs get twice the current', 'The resistor sees half the current'], a: 1,
      why: 'The exponential I–V curve turns a few tens of millivolts of mismatch into a large current difference, and heating makes it worse. Use one resistor per LED.' },
    { q: 'In a current divider, the larger resistor carries the larger current.', a: false,
      why: 'Parallel branches share the same voltage, so the current I = V/R is smaller in the larger resistance.' },
    { q: 'A 100 µA meter with 1 kΩ resistance must read 1 mA at full scale. What shunt resistance is needed, in ohms?', answer: 111.1, unit: 'Ω',
      why: 'R_sh = I_m R_m/(I − I_m) = 0.1 V / 0.9 mA = 111 Ω.' },
    { q: 'With three or more parallel branches, each branch\'s share of the current is proportional to its…', choices: ['resistance', 'conductance', 'power rating', 'length'], a: 1,
      why: 'I_k = V G_k, and V is common, so the shares follow the conductances G = 1/R.' }
  ],
  applications: ['Ammeter shunts and current-sense resistors.', 'Current sharing between paralleled LEDs, cells and transistors.', 'Return currents in ground planes and cable shields.', 'Biasing: splitting a reference current between two loads.'],
  sim: { id: 'fund-lamps', params: { conn: 'parallel', mixed: true } }
},

{
  id: 'sources', parent: 'dc-basics', title: 'Voltage and current sources', level: 2,
  short: 'An ideal voltage source holds its voltage whatever the current; an ideal current source holds its current whatever the voltage. Real sources are either one with an internal resistance.',
  keywords: ['voltage source', 'current source', 'internal resistance', 'EMF', 'terminal voltage', 'short-circuit current', 'source transformation', 'compliance', '4-20 mA', 'bench power supply', 'constant current', 'constant voltage'],
  prereq: ['voltage', 'resistance-ohms-law', 'physics:emf-internal-resistance'],
  related: ['thevenin-norton', 'batteries', 'current-mirrors', 'max-power-transfer', 'linear-regulators'],
  body: `
Every circuit needs something to drive it, and circuit theory recognises two ideal kinds.

An **ideal voltage source** holds the voltage between its terminals fixed, whatever current the load demands. An **ideal current source** pushes a fixed current, whatever voltage that takes. Neither exists — short the first, or open-circuit the second, and it would need infinite current or infinite voltage — but both are excellent models of real things over their working range: a battery or a regulated supply behaves much like a voltage source, a transistor's collector or an LED driver like a current source.

### Real sources have internal resistance
A battery's voltage sags when you draw current. The simplest model that captures this is an ideal source $E$ — the open-circuit voltage, or EMF — in series with an **internal resistance** $r$:

$$V = E - I r$$

The terminal voltage falls in a straight line as the current rises, from $E$ with no load to zero at the **short-circuit current** $I_\\text{sc} = E/r$.

| Source | Open-circuit voltage | Internal resistance |
|---|---|---|
| Car battery (lead–acid, 60 Ah) | 12.7 V | 5–10 mΩ |
| AA alkaline cell, fresh | 1.6 V | 0.1–0.3 Ω |
| 9 V PP3 alkaline | 9.5 V | 1–2 Ω |
| CR2032 lithium coin cell | 3.0 V | 10–30 Ω |
| Signal generator output | as set | 50 Ω, by design |

The numbers explain everyday behaviour. A car battery can push 300 A into a starter motor. A coin cell cannot deliver a radio module's 20 mA transmit pulses without a large capacitor beside it: $20\\ \\mathrm{mA} \\times 20\\ \\Omega$ is a 0.4 V droop, enough to reset a microcontroller. And the internal resistance of every battery rises as it discharges and as it gets cold.

### The same thing in two forms
A voltage source $E$ with series resistance $r$ behaves, at its terminals, **exactly** like a current source $E/r$ in parallel with the same $r$: any load sees the same voltage and current. This **source transformation** is the heart of [[thevenin-norton|Thévenin and Norton equivalents]]. Which picture to use is a matter of convenience: when $r$ is small compared with the load, think of a voltage source; when it is large, a current source.

### Real current sources
- **LED drivers** regulate current, because an LED's brightness follows its current while its forward voltage wanders with temperature and from part to part ([[leds]]).
- **The 4–20 mA loop** of industrial sensors: the transmitter sets a current between 4 mA (bottom of range) and 20 mA (top). The current is the same all round the loop, so the resistance of hundreds of metres of cable does not affect the reading — provided the supply has enough voltage left over, the **compliance**, to push the current through everything. A reading of 0 mA means a broken wire, not a zero measurement.
- **Transistor current sources and mirrors** bias the stages inside every IC ([[current-mirrors]]).

### The bench supply: both at once
A laboratory supply has two knobs: voltage and current limit. With a light load it holds the voltage — constant-voltage (**CV**) mode. If the load tries to draw more than the limit, the supply lowers its voltage just enough to hold the current at the limit — it has become a current source (**CC** mode). Set the limit low when you first power a new board: a short circuit then costs nothing.

### Two rules
Never short an ideal voltage source, and never leave an ideal current source open — in a circuit model both are contradictions. In the real world the first blows fuses and melts wires; the second produces the high voltage of an inductor whose current is suddenly interrupted ([[flyback-diode]]).
`,
  ideas: [
    'An ideal voltage source fixes the voltage; an ideal current source fixes the current.',
    'A real source is an EMF behind an internal resistance: V = E − Ir, and I_sc = E/r.',
    'A voltage source E with series r is equivalent at its terminals to a current source E/r with parallel r.',
    'Current loops (4–20 mA) ignore wire resistance as long as the supply has enough compliance voltage.',
    'A bench supply is a voltage source until the current limit, then a current source.'
  ],
  pitfalls: [
    'A battery\'s voltage is fixed — It is fixed only with no load. Under load the terminal voltage falls by Ir, and r rises as the battery empties or gets cold.',
    'A current source delivers nothing when nothing is connected — An ideal one would drive its voltage towards infinity; a real one rises to its compliance limit, and an inductor interrupted suddenly can reach hundreds of volts.',
    'The bench supply shows 12 V, so the circuit gets 12 V — If the current limit is reached, the supply drops its voltage; always check whether it is in CV or CC mode.'
  ],
  formulas: [
    {
      name: 'Terminal voltage of a real source',
      expr: 'V = E - I*r', tex: 'V = E - I r',
      vars: {
        V: { name: 'terminal voltage', q: 'voltage', unit: 'V', tex: 'V' },
        E: { name: 'open-circuit voltage (EMF)', q: 'voltage', unit: 'V', value: 1.6, tex: 'E' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 0.5, tex: 'I' },
        r: { name: 'internal resistance', q: 'resistance', unit: 'Ω', value: 0.2, tex: 'r' }
      },
      note: 'Solve for r from one reading with no load (E) and one under a known current.',
      stories: {
        V: 'A cell with EMF {E} and internal resistance {r} supplies {I}. What is its terminal voltage?',
        r: 'A cell reads {E} with no load and {V} while supplying {I}. What is its internal resistance?'
      }
    },
    {
      name: 'Short-circuit current',
      expr: 'Isc = E/r', tex: 'I_{\\text{sc}} = \\frac{E}{r}',
      vars: {
        Isc: { name: 'short-circuit current', q: 'current', unit: 'A', tex: 'I_{\\text{sc}}' },
        E: { name: 'open-circuit voltage', q: 'voltage', unit: 'V', value: 12.7, tex: 'E' },
        r: { name: 'internal resistance', q: 'resistance', unit: 'mΩ', value: 8, tex: 'r' }
      },
      stories: { Isc: 'A spanner falls across the terminals of a car battery ({E}, {r} internal). How much current flows?' }
    },
    {
      name: 'Largest loop resistance of a current loop',
      expr: 'Rmax = (Vs - Vmin)/Imax', tex: 'R_{\\max} = \\frac{V_s - V_{\\min}}{I_{\\max}}',
      vars: {
        Rmax: { name: 'largest total loop resistance', q: 'resistance', unit: 'Ω', tex: 'R_{\\max}' },
        Vs: { name: 'loop supply voltage', q: 'voltage', unit: 'V', value: 24, tex: 'V_s' },
        Vmin: { name: 'minimum voltage the transmitter needs', q: 'voltage', unit: 'V', value: 10, tex: 'V_{\\min}' },
        Imax: { name: 'full-scale loop current', q: 'current', unit: 'mA', value: 20, tex: 'I_{\\max}' }
      },
      note: 'The loop resistance includes the sense resistor at the receiver and both cable cores.',
      stories: { Rmax: 'A 4–20 mA transmitter needs at least {Vmin} to work and the loop runs from {Vs}. What total resistance can the loop have at {Imax}?' }
    }
  ],
  examples: [
    {
      title: 'Measuring a cell\'s internal resistance',
      q: 'A partly used AA cell reads 1.58 V on a voltmeter with no load, and 1.52 V with a 10 Ω resistor connected. What is its internal resistance?',
      steps: [
        'Current with the load: $I = 1.52/10 = 0.152\\ \\mathrm{A}$.',
        'The internal drop is $1.58 - 1.52 = 0.06\\ \\mathrm{V}$, so $r = 0.06/0.152 = 0.39\\ \\Omega$.',
        'A fresh cell would show perhaps 0.15 Ω. The same two readings work for any source — it is the Thévenin measurement of [[thevenin-norton]].'
      ],
      a: 'About 0.39 Ω.'
    },
    {
      title: 'Will the 4–20 mA loop work?',
      q: 'A pressure transmitter needs at least 10 V across it. The loop is powered from 24 V, the controller reads the current across a 250 Ω resistor, and the cable is 100 m of two-core 0.5 mm² copper. Does it work at 20 mA?',
      steps: [
        'Cable: 200 m of conductor, $R = 1.72 \\times 10^{-8} \\times 200 / 0.5 \\times 10^{-6} = 6.9\\ \\Omega$.',
        'At 20 mA the sense resistor drops $0.02 \\times 250 = 5\\ \\mathrm{V}$ and the cable 0.14 V.',
        'The transmitter is left with $24 - 5 - 0.14 = 18.9\\ \\mathrm{V}$, well above its 10 V minimum. The loop could have up to $(24 - 10)/0.02 = 700\\ \\Omega$ in total.',
        'The sense resistor turns 4–20 mA into 1–5 V for the controller\'s input.'
      ],
      a: 'Yes: 18.9 V is left for the transmitter; the limit is 700 Ω of loop resistance.'
    }
  ],
  quiz: [
    { q: 'A bench supply is set to 12 V with a 0.5 A current limit, and connected to a 10 Ω resistor. It shows…', choices: ['12 V and 1.2 A', '12 V and 0.5 A', '5 V and 0.5 A', '0 V: the supply shuts down'], a: 2,
      why: 'At 12 V the resistor would take 1.2 A, above the limit, so the supply goes into constant-current mode: 0.5 A through 10 Ω needs only 5 V.' },
    { q: 'A 3.0 V coin cell with 20 Ω internal resistance supplies a 25 mA pulse. What is its terminal voltage during the pulse, in volts?', answer: 2.5, unit: 'V',
      why: 'V = E − Ir = 3.0 − 0.025 × 20 = 2.5 V. A capacitor across the cell supplies such pulses instead.' },
    { q: 'An ideal current source connected to nothing (open circuit) delivers zero current at zero volts.', a: false,
      why: 'An ideal current source insists on its current, so its voltage would rise without limit. A real one rises to its compliance limit.' },
    { q: 'Why does a 4–20 mA loop not care about the resistance of long cables?', choices: ['The cables are superconducting', 'The current is the same all round a series loop, and the transmitter adjusts its voltage to hold it', 'The current is too small to drop any voltage', 'The receiver corrects for the cable resistance'], a: 1,
      why: 'The transmitter is a current source. Cable resistance only uses up some of the compliance voltage; the current, which carries the reading, is unchanged.' },
    { q: 'For which load is a 9 V battery with 2 Ω internal resistance a good approximation to an ideal voltage source?', choices: ['A 1 kΩ load', 'A 4 Ω load', 'A 1 Ω load', 'A short circuit'], a: 0,
      why: 'With 1 kΩ the internal drop is 0.2 % of the voltage. With 4 Ω a third of the EMF is lost inside the battery.' }
  ],
  applications: ['Battery modelling and runtime under load.', 'Industrial 4–20 mA sensor loops.', 'Bench supplies with current limiting for bringing up new boards.', 'LED drivers and transistor current sources.'],
  sim: 'fund-thevenin'
}

);
