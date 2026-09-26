/* HYPER-PHYSICS · content/dc-circuits.js — steady currents: charge flow, resistance,
 * power, networks, real batteries and capacitor charging. */
Hyper.add(

{
  id: 'electric-current', parent: 'dc-circuits', title: 'Electric current', level: 1,
  short: 'The rate at which charge flows past a point, measured in amperes (coulombs per second).',
  keywords: ['current', 'ampere', 'amp', 'charge flow', 'drift velocity', 'conventional current', 'electron flow', 'mAh', 'circuit'],
  prereq: ['electric-charge', 'math:derivative'],
  related: ['ohms-law', 'free-electron-model', 'magnetic-field', 'kirchhoffs-laws'],
  body: `
An **electric current** is charge on the move. Its size is the charge that passes a point each second:

$$I = \\frac{\\Delta Q}{\\Delta t}, \\qquad I = \\frac{dQ}{dt}$$

The unit is the **ampere** (A), one coulomb per second — about $6.24 \\times 10^{18}$ electrons every second. A phone charger delivers 1–3 A, a kettle about 10 A, a car's starter motor a couple of hundred amperes, and a lightning stroke tens of thousands; a nerve signal is carried by currents of nanoamperes.

### A complete circuit
Current flows steadily only round a closed loop. A battery or power supply acts like a pump: it does not supply charge — the wires are already full of mobile electrons — but pushes the charge round. Charge is conserved and does not pile up anywhere in a steady circuit, so the **same current** flows through every part of a single loop, into and out of every component. That is also why a current can be measured by breaking the circuit and inserting an ammeter anywhere in the loop.

### Which way does it flow?
By a convention fixed long before electrons were discovered, **conventional current** flows from the positive terminal round the circuit to the negative one — the direction positive charges would move. In metal wires the moving charges are actually electrons, which drift the opposite way. For almost every calculation the difference does not matter; a positive charge moving one way is equivalent to a negative charge moving the other. In salt solutions, plasmas and semiconductors both signs of carrier move.

### Slow electrons, fast signals
The electrons in a wire move surprisingly slowly. Their random zig-zag motion is fast (around $10^{6}$ m/s), but it goes every which way and averages to nothing; the net **drift velocity** along the wire is tiny. With $n$ mobile charges per cubic metre, each of charge $q$, drifting at $v_d$ through a cross-section $A$,

$$I = n A v_d q$$

Copper has about $8.5 \\times 10^{28}$ free electrons per cubic metre, so 10 A in a 1.5 mm² cable needs a drift of only half a millimetre per second — an electron would take more than half an hour to travel a metre. Yet a lamp lights the instant you flip the switch, because the electric field that pushes the electrons is set up along the whole wire at close to the speed of light, and electrons everywhere in the circuit start drifting at once, like water in a full hose.

> [!warn] Current, not voltage, is what harms the body. About 1 mA through the skin is just felt, 10–20 mA makes muscles clamp so you cannot let go, and roughly 100 mA across the chest can stop the heart.

### Battery capacity
Battery capacity is often quoted in **ampere-hours** — a charge. A 3000 mAh phone battery holds $3\\ \\mathrm{A} \\times 3600\\ \\mathrm{s} = 10\\,800$ C, enough for 0.3 A for ten hours.
`,
  ideas: [
    'Current is the rate of flow of charge: $I = dQ/dt$, in amperes (C/s).',
    'A steady current needs a closed circuit; the same current flows all round a single loop.',
    'Conventional current points the way positive charge would move — opposite to the electrons in a wire.',
    'Electrons drift at fractions of a millimetre per second, but the signal travels at nearly the speed of light.'
  ],
  pitfalls: [
    'Current is used up by a lamp or resistor — The same current leaves as enters; what the component takes is energy, not charge.',
    'The battery supplies the electrons that flow — The electrons were already in the wires. The battery gives them energy.',
    'Electrons race round the circuit at the speed of light — Their drift is very slow; only the field (the signal) travels near the speed of light.'
  ],
  formulas: [
    {
      name: 'Current as a rate of charge flow',
      expr: 'I = Q/t', tex: 'I = \\frac{Q}{t}',
      vars: {
        I: { name: 'current', q: 'current', unit: 'A' },
        Q: { name: 'charge passed', q: 'charge', unit: 'C', value: 600 },
        t: { name: 'time', q: 'time', unit: 'min', value: 5 }
      },
      stories: {
        I: 'A charge of {Q} flows through a heater in {t}. What is the current?',
        Q: 'A current of {I} flows for {t}. How much charge passes?',
        t: 'A phone battery holds {Q}. How long does it last at an average current of {I}?'
      }
    },
    {
      name: 'Drift velocity',
      expr: 'I = n*A*vd*qe', tex: 'I = n A v_d e',
      vars: {
        I: { name: 'current', q: 'current', unit: 'A', value: 10 },
        n: { name: 'mobile electrons per unit volume', q: 'numberdensity', unit: '1/m³', value: 8.5e28 },
        A: { name: 'cross-sectional area', q: 'area', unit: 'mm²', value: 1.5 },
        vd: { name: 'drift velocity', q: 'speed', unit: 'cm/s', tex: 'v_d' },
        qe: { const: 'qe' }
      },
      solveFor: 'vd',
      note: 'The default $n$ is for copper (one free electron per atom).',
      stories: { vd: 'A copper cable of cross-section {A} carries {I}. How fast do its electrons drift?' }
    }
  ],
  examples: [
    {
      title: 'How slow is the drift?',
      q: 'A 1.5 mm² copper cable carries 10 A. Copper has $8.5 \\times 10^{28}$ free electrons per m³. Find the drift velocity and the time for an electron to drift 1 m.',
      steps: [
        '$v_d = \\dfrac{I}{nAe} = \\dfrac{10}{8.5 \\times 10^{28} \\times 1.5 \\times 10^{-6} \\times 1.602 \\times 10^{-19}}$.',
        'The denominator is $2.04 \\times 10^{4}$, so $v_d = 4.9 \\times 10^{-4}$ m/s — about half a millimetre per second.',
        'Time to drift 1 m: $1 / 4.9 \\times 10^{-4} = 2040$ s, about 34 minutes.'
      ],
      a: 'About 0.5 mm/s; over half an hour per metre.'
    },
    {
      title: 'Counting electrons',
      q: 'How many electrons pass through a 0.5 A LED torch bulb each second?',
      steps: ['Charge per second is 0.5 C.', '$N = \\dfrac{0.5}{1.602 \\times 10^{-19}} = 3.1 \\times 10^{18}$ electrons per second.'],
      a: '$3.1 \\times 10^{18}$ per second.'
    }
  ],
  quiz: [
    { q: 'A current of 2 A flows for 5 minutes. How much charge passes?', choices: ['10 C', '120 C', '600 C', '2.5 C'], a: 2, why: '$Q = It = 2 \\times 300 = 600$ C. Remember to convert minutes to seconds.' },
    { q: 'In a single loop with a battery and two lamps, the current through the second lamp compared with the first is…', choices: ['smaller, because the first lamp used some up', 'the same', 'larger', 'zero'], a: 1,
      why: 'Charge is conserved and cannot pile up, so the same current flows everywhere in a single loop. Energy, not charge, is transferred to the lamps.' },
    { q: 'Electrons drift along a wire at well under a millimetre per second, yet a lamp lights at once when switched on. Why?', choices: ['Electrons are very light', 'The field that pushes the electrons spreads along the wire almost at light speed, so all of them start moving together', 'The switch fires electrons at high speed', 'The lamp is heated by radiation from the switch'], a: 1,
      why: 'The wire is already full of mobile electrons; once the field is established everywhere, current flows everywhere at once.' },
    { q: 'In a copper wire, conventional current and the motion of the electrons are in the same direction.', a: false,
      why: 'Conventional current is defined as the direction positive charge would flow; electrons, being negative, drift the other way.' }
  ],
  applications: [
    'Fuses and circuit breakers cut the circuit when the current exceeds a safe value.',
    'Residual-current devices compare the current in the live and neutral wires and trip at a difference of about 30 mA.',
    'Electroplating and electrolysis: the charge passed fixes how much metal is deposited.'
  ],
  history: 'André-Marie Ampère studied the forces between currents in the 1820s, and the unit is named after him. Since 2019 the ampere is defined by fixing the elementary charge at exactly $1.602176634 \\times 10^{-19}$ C.'
},

{
  id: 'ohms-law', parent: 'dc-circuits', title: 'Ohm\'s law and resistance', level: 1,
  short: 'For many conductors the current is proportional to the voltage: V = IR, where the resistance R measures how hard it is to push current through.',
  keywords: ['Ohm', 'resistance', 'V = IR', 'ohmic', 'non-ohmic', 'I-V characteristic', 'conductance', 'siemens', 'resistor', 'diode', 'filament lamp'],
  prereq: ['electric-current', 'electric-potential', 'math:linear-functions'],
  related: ['resistivity', 'electric-power', 'resistors-combinations', 'pn-junction'],
  body: `
Put a voltage across a piece of wire and a current flows. For metals at a steady temperature, double the voltage and the current doubles: the current is **proportional** to the voltage. The ratio is the **resistance**:

$$R = \\frac{V}{I} \\qquad\\Leftrightarrow\\qquad V = IR$$

measured in **ohms** (Ω = V/A). A resistor of 100 Ω lets 1 mA flow for every 0.1 V across it. The reciprocal, $G = 1/R$, is the **conductance**, in siemens (S).

### What resistance means
Inside a conductor the free electrons are accelerated by the field but keep colliding with the vibrating ions and impurities of the lattice, so they settle at a steady average drift — like a ball rolling down a slope through a forest of pegs. The voltage is the push; the resistance measures how much the collisions hold the flow back. The energy the charges gain from the field is handed to the lattice at each collision, which is why current heats a resistor ([[electric-power|electric power]]). How resistance depends on the material and shape is the subject of [[resistivity]].

### Ohmic and non-ohmic
**Ohm's law** is not a law of nature like conservation of charge; it is a description of how many materials behave. A component whose current–voltage graph is a straight line through the origin is **ohmic**. Many are not:

- A **filament lamp** gets hotter as the current rises, and hot tungsten resists more, so its I–V graph bends over. Cold, its resistance is more than ten times lower than when glowing.
- A **diode** barely conducts one way and conducts easily the other, once a threshold of about 0.6 V (silicon) is passed — see [[pn-junction|the p–n junction]].
- A **thermistor**'s resistance falls steeply as it warms; a light-dependent resistor's falls in the light.

For these, $R = V/I$ still defines a resistance at each operating point, but it is not constant.

### Real numbers
| Object | Resistance |
|---|---|
| 1 m of 1.5 mm² copper cable | 0.011 Ω |
| Kettle element (2.2 kW, 230 V) | 24 Ω |
| Human body, hand to hand, wet skin | about 1 kΩ |
| Human body, dry skin | 100 kΩ or more |
| Typical signal resistors in electronics | 100 Ω – 1 MΩ |

> [!tip] In the simulation, keep one resistor fixed and change the battery voltage: the current through it changes in exact proportion.
`,
  ideas: [
    'Resistance is voltage per unit current: $R = V/I$, in ohms.',
    'Ohmic conductors have constant $R$: current is proportional to voltage.',
    'Lamps, diodes and thermistors are non-ohmic; their $V/I$ changes with conditions.',
    'Resistance arises from collisions of the drifting charges with the lattice, which also heats the conductor.'
  ],
  pitfalls: [
    'Ohm\'s law says $V = IR$ for everything — $V = IR$ defines $R$; Ohm\'s law is the observation that $R$ stays constant for some materials.',
    'A bigger resistance means a bigger current — For the same voltage, the current is smaller: $I = V/R$.',
    'Resistance depends on the voltage applied — For an ohmic conductor it does not; if $V$ doubles, $I$ doubles and $R$ is unchanged.'
  ],
  formulas: [
    {
      name: 'Ohm\'s law',
      expr: 'V = I*R', tex: 'V = IR',
      vars: {
        V: { name: 'voltage across the component', q: 'voltage', unit: 'V', value: 7 },
        I: { name: 'current through it', q: 'current', unit: 'mA', value: 20 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω' }
      },
      solveFor: 'R',
      stories: {
        R: 'A component carries {I} when {V} is across it. What is its resistance?',
        I: 'What current flows through a {R} resistor with {V} across it?',
        V: 'What voltage drives {I} through {R}?'
      }
    },
    {
      name: 'Conductance',
      expr: 'G = 1/R', tex: 'G = \\frac{1}{R}',
      vars: {
        G: { name: 'conductance', q: 'conductance', unit: 'mS' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 100 }
      }
    }
  ],
  examples: [
    {
      title: 'A resistor for an LED',
      q: 'A red LED needs about 20 mA and drops 2.0 V when lit. What series resistor lets it run from a 9 V battery? What current flows if you use the standard value 390 Ω instead?',
      steps: [
        'The resistor must take the rest of the voltage: $9.0 - 2.0 = 7.0$ V.',
        '$R = V/I = 7.0 / 0.020 = 350\\ \\Omega$.',
        'With 390 Ω: $I = 7.0/390 = 18$ mA — a little dimmer, and a little safer for the LED.'
      ],
      a: '350 Ω (18 mA with 390 Ω).'
    },
    {
      title: 'Why wet hands are dangerous',
      q: 'Estimate the current through a person touching 230 V mains with (a) dry skin, 100 kΩ, (b) wet skin, 1 kΩ.',
      steps: ['(a) $I = 230/100\\,000 = 2.3$ mA — a painful tingle.', '(b) $I = 230/1000 = 0.23$ A — enough to stop the heart.'],
      a: 'About 2 mA dry, about 230 mA wet.'
    }
  ],
  quiz: [
    { q: 'The voltage across an ohmic resistor is tripled. The current…', choices: ['stays the same', 'triples', 'falls to a third', 'rises ninefold'], a: 1, why: '$I = V/R$ with constant $R$: current is proportional to voltage.' },
    { q: 'A filament lamp\'s I–V graph curves over at high voltage because…', choices: ['the glass warms', 'the hot filament has a higher resistance', 'the battery runs down', 'current is lost as light'], a: 1,
      why: 'The metal\'s resistance rises with temperature, so each extra volt adds less current.' },
    { q: 'What is the resistance of a component that carries 50 mA at 5 V?', choices: ['0.25 Ω', '10 Ω', '100 Ω', '250 Ω'], a: 2, why: '$R = V/I = 5 / 0.050 = 100\\ \\Omega$.' },
    { q: 'A silicon diode obeys Ohm\'s law.', a: false,
      why: 'Its current is almost zero one way and rises steeply after about 0.6 V the other way: the I–V graph is far from a straight line through the origin.' }
  ],
  applications: [
    'Current-limiting resistors protect LEDs and transistors.',
    'Multimeters measure resistance by driving a known current and reading the voltage.',
    'Strain gauges and thermistors turn force or temperature into a change of resistance.'
  ],
  history: 'Georg Simon Ohm published the proportionality in 1827, using thermocouples as steady voltage sources. The work was coolly received at first; the ohm was adopted as the international unit of resistance in 1881.',
  sim: { id: 'em1-circuits', params: { topo: 'series' } }
},

{
  id: 'resistivity', parent: 'dc-circuits', title: 'Resistivity', level: 2,
  short: 'The resistance of a wire grows with its length and shrinks with its cross-section: R = ρL/A, where the resistivity ρ is a property of the material.',
  keywords: ['resistivity', 'conductivity', 'R = rho L/A', 'wire gauge', 'temperature coefficient', 'copper', 'nichrome', 'semiconductor', 'superconductor'],
  prereq: ['ohms-law', 'math:area'],
  related: ['free-electron-model', 'band-theory', 'superconductivity', 'electric-power'],
  body: `
A long wire resists more than a short one, and a thin wire more than a thick one. For a uniform conductor of length $L$ and cross-sectional area $A$,

$$R = \\rho\\,\\frac{L}{A}$$

The **resistivity** $\\rho$ (in ohm-metres, Ω·m) belongs to the material alone, not to the particular piece. Its reciprocal $\\sigma = 1/\\rho$ is the **conductivity**, in siemens per metre.

Why $L/A$? Two equal lengths of wire end to end are two resistors in series: double the length, double the resistance. Two wires side by side offer two paths: double the area, half the resistance. Doubling a wire's **diameter** quadruples its area and so divides its resistance by four.

### An enormous range
| Material | ρ at 20 °C (Ω·m) |
|---|---|
| Silver | $1.6 \\times 10^{-8}$ |
| Copper | $1.7 \\times 10^{-8}$ |
| Aluminium | $2.7 \\times 10^{-8}$ |
| Tungsten | $5.6 \\times 10^{-8}$ |
| Nichrome (heater wire) | $1.1 \\times 10^{-6}$ |
| Seawater | about 0.2 |
| Pure silicon | about $2 \\times 10^{3}$ |
| Pure water | about $2 \\times 10^{5}$ |
| Glass | $10^{10}$ – $10^{14}$ |
| PTFE (Teflon) | about $10^{23}$ |

From silver to PTFE the resistivity spans some 30 powers of ten — a wider range than almost any other physical property. The reasons lie in how many electrons are free to move, which [[band-theory|band theory]] explains. Copper wins for wiring on cost; aluminium, lighter per unit of conductance, carries overhead power lines; nichrome's high resistivity (and resistance to oxidation) makes it the heating element in toasters.

### Temperature
In a metal, hotter ions vibrate more and scatter the electrons more, so resistivity rises roughly linearly:

$$\\rho = \\rho_0\\,(1 + \\alpha\\,\\Delta T)$$

with $\\alpha \\approx 0.0039\\ \\mathrm{K^{-1}}$ for copper — about 0.4 % per degree. Platinum resistance thermometers use exactly this. Semiconductors go the other way: warming frees more charge carriers and their resistance **falls**. And some materials, cooled far enough, lose their resistance entirely — [[superconductivity]].
`,
  ideas: [
    'Resistance grows with length and falls with cross-section: $R = \\rho L/A$.',
    'Resistivity is a property of the material; resistance is a property of the object.',
    'Resistivities span about 30 orders of magnitude from metals to insulators.',
    'Metals resist more when hot; semiconductors resist less.'
  ],
  pitfalls: [
    'Resistivity and resistance are the same thing — A thick and a thin copper wire have the same resistivity but different resistances.',
    'Doubling the diameter halves the resistance — The area goes as diameter squared, so the resistance falls to a quarter.',
    'All materials resist more when heated — Semiconductors and many insulators conduct better when hot.'
  ],
  formulas: [
    {
      name: 'Resistance of a uniform wire',
      expr: 'R = rho*L/A', tex: 'R = \\rho\\frac{L}{A}',
      vars: {
        R: { name: 'resistance', q: 'resistance', unit: 'Ω' },
        rho: { name: 'resistivity', q: 'resistivity', unit: 'Ω·m', value: 1.68e-8 },
        L: { name: 'length', q: 'length', unit: 'm', value: 40 },
        A: { name: 'cross-sectional area', q: 'area', unit: 'mm²', value: 1.5 }
      },
      note: 'The default resistivity is copper\'s. Nichrome: $1.1 \\times 10^{-6}$ Ω·m; aluminium: $2.65 \\times 10^{-8}$ Ω·m.',
      stories: {
        R: 'What is the resistance of {L} of wire with cross-section {A} and resistivity {rho}?',
        L: 'How long must a wire of cross-section {A} and resistivity {rho} be to have a resistance of {R}?',
        A: 'A {L} cable of resistivity {rho} must have a resistance of no more than {R}. What cross-section does it need?'
      }
    },
    {
      name: 'Resistance and temperature',
      expr: 'R = R0*(1 + alpha*dT)', tex: 'R = R_0\\,(1 + \\alpha\\,\\Delta T)',
      vars: {
        R: { name: 'resistance when warmer', q: 'resistance', unit: 'Ω' },
        R0: { name: 'resistance at the reference temperature', q: 'resistance', unit: 'Ω', value: 100 },
        alpha: { name: 'temperature coefficient', q: 'expansion', unit: '1/K', value: 0.00385 },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 100, tex: '\\Delta T', signed: true }
      },
      note: 'Linear approximation, good for metals over a few hundred kelvin. The defaults are a Pt100 platinum sensor ($R_0 = 100\\ \\Omega$ at 0 °C).',
      stories: {
        R: 'A platinum sensor reads {R0} at 0 °C and has α = {alpha}. What does it read after a rise of {dT}?',
        dT: 'A sensor with {R0} at 0 °C and α = {alpha} reads {R}. How much has the temperature risen?'
      }
    }
  ],
  examples: [
    {
      title: 'An extension lead',
      q: 'A 20 m extension lead has two 1.5 mm² copper conductors (out and back). What is its resistance, and how much voltage and power does it lose carrying 10 A?',
      steps: [
        'The current goes 20 m out and 20 m back: $L = 40$ m.',
        '$R = \\rho L/A = 1.68 \\times 10^{-8} \\times 40 / 1.5 \\times 10^{-6} = 0.45\\ \\Omega$.',
        'Voltage lost: $IR = 10 \\times 0.45 = 4.5$ V; power lost: $I^2R = 100 \\times 0.45 = 45$ W, as heat along the cable.',
        'That is why a cable reel must be unwound fully for heavy loads: coiled up, 45 W cannot escape and the drum can overheat.'
      ],
      a: '0.45 Ω; 4.5 V and 45 W lost.'
    },
    {
      title: 'A platinum thermometer',
      q: 'A Pt100 sensor has 100.0 Ω at 0 °C and $\\alpha = 0.00385\\ \\mathrm{K^{-1}}$. It reads 119.4 Ω. What is the temperature?',
      steps: ['$\\Delta T = \\dfrac{R/R_0 - 1}{\\alpha} = \\dfrac{1.194 - 1}{0.00385} = 50.4$ K.', 'So the temperature is about 50 °C.'],
      a: 'About 50 °C.'
    }
  ],
  quiz: [
    { q: 'A wire is replaced by one of the same material, twice as long and twice the diameter. Its resistance becomes…', choices: ['the same', 'half', 'twice', 'a quarter'], a: 1,
      why: 'Length ×2 doubles $R$; diameter ×2 quadruples the area and divides $R$ by 4. Net: ×2/4 = ½.' },
    { q: 'Which has the larger resistivity?', choices: ['A thick copper bar', 'A thin copper wire', 'They are the same', 'It depends on the length'], a: 2,
      why: 'Resistivity is a property of copper itself. The thin wire has more resistance, not more resistivity.' },
    { q: 'As a copper wire warms from 20 °C to 70 °C, its resistance…', choices: ['rises by about 20 %', 'falls by about 20 %', 'doubles', 'is unchanged'], a: 0,
      why: '$\\alpha\\Delta T = 0.0039 \\times 50 \\approx 0.2$.' },
    { q: 'Warming a piece of pure silicon lowers its resistance.', a: true,
      why: 'In a semiconductor, heat frees more electrons into the conduction band, which outweighs the extra scattering.' }
  ],
  applications: [
    'Choosing cable sizes so that voltage drop and heating stay small.',
    'Heating elements, fuses and incandescent filaments use high-resistivity or low-melting metals.',
    'Resistance thermometers and strain gauges.',
    'Geophysical surveys map buried water and ore by the ground\'s resistivity.'
  ]
},

{
  id: 'electric-power', parent: 'dc-circuits', title: 'Electric power', level: 1,
  short: 'The rate at which a circuit transfers energy: P = IV, which for a resistor is also I²R and V²/R.',
  keywords: ['electric power', 'watt', 'P = IV', 'I squared R', 'Joule heating', 'kilowatt-hour', 'energy bill', 'power transmission'],
  prereq: ['ohms-law', 'power'],
  related: ['emf-internal-resistance', 'transformers', 'ac-power', 'efficiency'],
  body: `
Every coulomb that falls through a potential difference $V$ gives up energy $V$ joules. If $I$ coulombs flow each second, energy is delivered at the rate

$$P = IV$$

in watts (W = J/s). This holds for any component: a motor turning energy into work, a battery being charged, a lamp making light and heat. For a **resistor**, $V = IR$ gives two more forms:

$$P = I^2R = \\frac{V^2}{R}$$

The energy is turned into heat — **Joule heating** — as the drifting electrons hand their energy to the lattice in collisions. It is what makes toasters, kettles and fuses work, and what wastes energy in every wire.

### Which form to use?
They are all the same law, but each hides a different variable. With the **current** fixed (resistors in series), $P = I^2R$: the bigger resistor gets hotter. With the **voltage** fixed (appliances in parallel on the mains), $P = V^2/R$: the *smaller* resistance draws more power. A 2 kW heater has less resistance than a 60 W lamp on the same supply.

### Paying for energy
Energy is power times time. Electricity is sold by the **kilowatt-hour**, the energy of 1 kW for one hour:

$$1\\ \\mathrm{kWh} = 1000\\ \\mathrm{W} \\times 3600\\ \\mathrm{s} = 3.6\\ \\mathrm{MJ}$$

A 2.2 kW kettle running for 4 minutes uses 0.15 kWh; a 10 W LED bulb can run for 100 hours on 1 kWh.

### Why power lines run at high voltage
A power station must deliver power $P = IV$ down lines with some resistance $R$, and the lines waste $I^2R$. For the same power, raising the voltage tenfold cuts the current tenfold and the loss **a hundredfold**. That is why electricity is transmitted at hundreds of kilovolts and stepped down near homes with [[transformers]].

| Device | Power |
|---|---|
| Phone on standby | about 0.05 W |
| LED bulb | 5–10 W |
| Laptop | 30–90 W |
| Kettle | 2–3 kW |
| Electric car, motorway speed | about 20 kW |
| Large power station | 1–2 GW |
`,
  ideas: [
    'Electrical power is $P = IV$ for any component.',
    'For a resistor, $P = I^2R = V^2/R$: all the energy becomes heat.',
    'The kilowatt-hour is an energy: 3.6 MJ.',
    'Transmission losses go as $I^2R$, so high voltage and low current save energy.'
  ],
  pitfalls: [
    '$P = I^2R$ shows that bigger resistors always get hotter — Only at fixed current. At fixed voltage $P = V^2/R$, and the smaller resistance takes more power.',
    'A kilowatt-hour is a unit of power — It is energy: a power multiplied by a time.',
    'High-voltage lines lose more energy because the voltage is high — The loss is $I^2R$ in the wire; high voltage means low current and less loss.'
  ],
  formulas: [
    {
      name: 'Power from current and voltage',
      expr: 'P = I*V', tex: 'P = IV',
      vars: {
        P: { name: 'power', q: 'power', unit: 'W' },
        I: { name: 'current', q: 'current', unit: 'A', value: 9.57 },
        V: { name: 'voltage', q: 'voltage', unit: 'V', value: 230 }
      },
      stories: {
        I: 'A {P} kettle runs on {V}. What current does it draw?',
        P: 'A motor draws {I} from a {V} supply. How much power does it take?'
      }
    },
    {
      name: 'Power in a resistor from its current',
      expr: 'P = I^2*R', tex: 'P = I^2 R',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'W' },
        I: { name: 'current', q: 'current', unit: 'A', value: 10 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 0.45 }
      },
      stories: { P: 'A cable of resistance {R} carries {I}. How much power does it turn into heat?' }
    },
    {
      name: 'Power in a resistor from its voltage',
      expr: 'P = V^2/R', tex: 'P = \\frac{V^2}{R}',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'W' },
        V: { name: 'voltage across it', q: 'voltage', unit: 'V', value: 230 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 24 }
      },
      stories: {
        P: 'A heating element of {R} is connected to {V}. What is its power?',
        R: 'What resistance must an element have to give {P} on a {V} supply?'
      }
    },
    {
      name: 'Energy used',
      expr: 'W = P*t', tex: 'W = Pt',
      vars: {
        W: { name: 'energy', q: 'energy', unit: 'kWh' },
        P: { name: 'power', q: 'power', unit: 'kW', value: 2.2 },
        t: { name: 'time', q: 'time', unit: 'min', value: 4 }
      },
      stories: { W: 'A {P} kettle boils for {t}. How much energy does it use?', t: 'How long can a {P} appliance run on {W}?' }
    }
  ],
  examples: [
    {
      title: 'Boiling a kettle',
      q: 'A 2.2 kW kettle on 230 V heats 1.5 L of water from 15 °C to 100 °C. Find the current, the element\'s resistance, and the time needed (ignoring losses).',
      steps: [
        '$I = P/V = 2200/230 = 9.6$ A.',
        '$R = V^2/P = 230^2/2200 = 24\\ \\Omega$.',
        'Heat needed: $Q = mc\\Delta T = 1.5 \\times 4186 \\times 85 = 5.3 \\times 10^{5}$ J (see [[specific-heat]]).',
        '$t = Q/P = 5.3 \\times 10^{5} / 2200 = 243$ s, about 4 minutes.'
      ],
      a: '9.6 A, 24 Ω, about 4 minutes.'
    },
    {
      title: 'Transmitting a megawatt',
      q: 'A village needs 1.0 MW, supplied through lines with a total resistance of 2.0 Ω. Compare the losses at 10 kV and at 100 kV.',
      steps: [
        'At 10 kV: $I = P/V = 10^{6}/10^{4} = 100$ A; loss $I^2R = 100^2 \\times 2 = 20$ kW, 2 % of the power.',
        'At 100 kV: $I = 10$ A; loss $= 10^2 \\times 2 = 200$ W, 0.02 %.',
        'Ten times the voltage, a hundred times less loss.'
      ],
      a: '20 kW at 10 kV; 200 W at 100 kV.'
    }
  ],
  quiz: [
    { q: 'Two resistors, 10 Ω and 20 Ω, are in series. Which gets hotter?', choices: ['10 Ω', '20 Ω', 'the same', 'it depends on the battery'], a: 1, why: 'The same current flows through both, so $P = I^2R$ is larger for the larger resistance.' },
    { q: 'The same two resistors are connected in parallel across a battery. Which gets hotter now?', choices: ['10 Ω', '20 Ω', 'the same', 'neither'], a: 0, why: 'Both have the same voltage, so $P = V^2/R$ is larger for the smaller resistance.' },
    { q: 'The current in a power line is halved while its resistance stays the same. The power lost in the line…', choices: ['halves', 'falls to a quarter', 'is unchanged', 'doubles'], a: 1, why: 'Loss $= I^2R$, so halving $I$ quarters it.' },
    { q: 'How much energy does a 100 W lamp use in 10 hours?', choices: ['1 kWh', '10 kWh', '0.1 kWh', '1000 kWh'], a: 0, why: '$0.1\\ \\mathrm{kW} \\times 10\\ \\mathrm{h} = 1$ kWh = 3.6 MJ.' }
  ],
  applications: [
    'Electric heaters, kettles, hair dryers and toasters.',
    'Fuses melt when $I^2R$ heating in a thin wire gets too large.',
    'Sizing cables and choosing transmission voltages to keep losses low.'
  ],
  history: 'James Prescott Joule showed in 1841 that the heat produced by a current is proportional to $I^2R$, part of the work that established the conservation of energy.',
  sim: 'em1-battery'
},

{
  id: 'resistors-combinations', parent: 'dc-circuits', title: 'Resistors in series and parallel', level: 1,
  short: 'Resistances in series add; in parallel their reciprocals add, so the combination is smaller than any branch.',
  keywords: ['series', 'parallel', 'equivalent resistance', 'voltage divider', 'current divider', 'potentiometer', 'product over sum', 'network'],
  prereq: ['ohms-law', 'electric-potential', 'math:fractions-ratios'],
  related: ['kirchhoffs-laws', 'capacitors-combinations', 'electric-power'],
  body: `
Most circuits contain several resistors. A group can always be replaced by a single **equivalent resistance** that draws the same current from the same voltage — which makes the rest of the circuit easy to work out.

### Series: one path
Resistors end to end carry the **same current** $I$, and the voltages across them add up to the total: $V = IR_1 + IR_2 + \\cdots$. So

$$R_\\text{eq} = R_1 + R_2 + R_3 + \\cdots$$

The equivalent is larger than the largest. The voltage divides in **proportion** to resistance: the biggest resistor takes the biggest share. Adding a resistor in series always reduces the current.

### Parallel: several paths
Resistors side by side all have the **same voltage** $V$. Each takes $I_k = V/R_k$, and the currents add up at the junction:

$$\\frac{1}{R_\\text{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3} + \\cdots$$

The equivalent is **smaller than the smallest** branch: each new path gives the current another way through. Two in parallel: $R_\\text{eq} = R_1R_2/(R_1 + R_2)$, "product over sum". $n$ equal resistors: $R/n$. The current divides in **inverse** proportion to resistance — most of it takes the easiest path.

### The voltage divider
Two resistors in series across a voltage $V_\\text{in}$ give an output across the second one of

$$V_\\text{out} = V_\\text{in}\\,\\frac{R_2}{R_1 + R_2}$$

Replace them by a sliding contact on one resistor — a **potentiometer** — and you have a volume knob. Make $R_2$ a thermistor or light-dependent resistor and $V_\\text{out}$ becomes a temperature or light sensor.

### Series or parallel in the house?
Household sockets and lamps are wired in **parallel**: each gets the full mains voltage, and each can be switched on and off on its own. Old strings of fairy lights were wired in series: each bulb took a small share of the voltage, and when one failed, they all went out.

> [!tip] The simulation's mixed circuit is $R_1$ in series with the parallel pair $R_2 \\parallel R_3$. Reduce it step by step, then check your answer against the meters.
`,
  ideas: [
    'Series: same current, voltages add, $R_\\text{eq} = R_1 + R_2 + \\cdots$.',
    'Parallel: same voltage, currents add, $1/R_\\text{eq} = 1/R_1 + 1/R_2 + \\cdots$.',
    'The parallel equivalent is smaller than the smallest resistor.',
    'A voltage divider gives $V_\\text{out} = V_\\text{in} R_2/(R_1 + R_2)$.'
  ],
  pitfalls: [
    'Adding a resistor always raises the total resistance — In parallel it lowers it, and the battery current goes up.',
    'The current splits equally at a junction — It splits in inverse proportion to the branch resistances.',
    'Forgetting to invert: $1/R_\\text{eq} = 0.05\\ \\Omega^{-1}$ means $R_\\text{eq} = 20\\ \\Omega$ — Always finish by taking the reciprocal.'
  ],
  formulas: [
    {
      name: 'Three resistors in series',
      expr: 'R = R1 + R2 + R3', tex: 'R_{\\text{eq}} = R_1 + R_2 + R_3',
      vars: {
        R: { name: 'equivalent resistance', q: 'resistance', unit: 'Ω', tex: 'R_{\\text{eq}}' },
        R1: { name: 'first resistance', q: 'resistance', unit: 'Ω', value: 100 },
        R2: { name: 'second resistance', q: 'resistance', unit: 'Ω', value: 220 },
        R3: { name: 'third resistance', q: 'resistance', unit: 'Ω', value: 470 }
      },
      stories: { R: 'Resistors of {R1}, {R2} and {R3} are connected in series. What is the total resistance?' }
    },
    {
      name: 'Two resistors in parallel',
      expr: '1/R = 1/R1 + 1/R2', tex: '\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2}', solveFor: 'R',
      vars: {
        R: { name: 'equivalent resistance', q: 'resistance', unit: 'Ω', tex: 'R_{\\text{eq}}' },
        R1: { name: 'first resistance', q: 'resistance', unit: 'Ω', value: 220 },
        R2: { name: 'second resistance', q: 'resistance', unit: 'Ω', value: 470 }
      },
      stories: {
        R: 'A {R1} and a {R2} resistor are connected in parallel. What is their combined resistance?',
        R2: 'What resistor in parallel with {R1} gives a combined resistance of {R}?'
      }
    },
    {
      name: 'Voltage divider',
      expr: 'Vout = Vin*R2/(R1 + R2)', tex: 'V_{\\text{out}} = V_{\\text{in}}\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vout: { name: 'output voltage (across R₂)', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 10 },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 4.7 }
      },
      note: 'Assumes nothing draws significant current from the output.',
      stories: {
        Vout: 'A {R1} and a {R2} resistor are in series across {Vin}. What voltage appears across the {R2}?',
        R2: 'With {R1} on top and {Vin} in, what lower resistor gives an output of {Vout}?'
      }
    }
  ],
  examples: [
    {
      title: 'Reducing a network',
      q: 'A 12 V battery drives $R_1 = 100\\ \\Omega$ in series with a parallel pair $R_2 = 220\\ \\Omega$ and $R_3 = 470\\ \\Omega$. Find the battery current and the current in each branch.',
      steps: [
        'Parallel pair: $R_p = \\dfrac{220 \\times 470}{220 + 470} = 149.9\\ \\Omega$.',
        'Total: $R_\\text{eq} = 100 + 149.9 = 249.9\\ \\Omega$, so $I = 12/249.9 = 48.0$ mA.',
        'Across $R_1$: $0.0480 \\times 100 = 4.80$ V, leaving $12 - 4.80 = 7.20$ V across the pair.',
        '$I_2 = 7.20/220 = 32.7$ mA and $I_3 = 7.20/470 = 15.3$ mA. Check: $32.7 + 15.3 = 48.0$ mA.'
      ],
      a: '48.0 mA from the battery; 32.7 mA through 220 Ω, 15.3 mA through 470 Ω.'
    },
    {
      title: 'Two equal resistors',
      q: 'Two 1 kΩ resistors are connected (a) in series, (b) in parallel, across 10 V. Find the total current each way.',
      steps: ['(a) $R = 2$ kΩ, $I = 10/2000 = 5$ mA.', '(b) $R = 500\\ \\Omega$, $I = 10/500 = 20$ mA — four times as much.'],
      a: '5 mA in series, 20 mA in parallel.'
    }
  ],
  quiz: [
    { q: 'Three 30 Ω resistors in parallel have an equivalent resistance of…', choices: ['90 Ω', '30 Ω', '10 Ω', '3 Ω'], a: 2, why: '$n$ equal resistors in parallel give $R/n = 30/3 = 10\\ \\Omega$.' },
    { q: 'A second lamp is connected in parallel with a lamp already lit from a battery (no internal resistance). The first lamp…', choices: ['dims', 'stays equally bright', 'gets brighter', 'goes out'], a: 1,
      why: 'It still has the full battery voltage across it, so its current and power are unchanged. The battery simply supplies more total current.' },
    { q: 'A 1 kΩ and a 1 Ω resistor are in parallel. The combination is…', choices: ['just over 1 kΩ', 'about 500 Ω', 'just under 1 Ω', 'exactly 1 kΩ'], a: 2,
      why: 'The parallel equivalent is below the smallest branch: $1000/1001\\ \\Omega$. Nearly all the current takes the 1 Ω path.' },
    { q: 'In a series circuit the largest resistor has the largest voltage across it.', a: true, why: 'The same current flows through each, so $V = IR$ is largest for the largest $R$.' },
    { q: 'A voltage divider has $R_1 = R_2$. The output is…', choices: ['the full input', 'half the input', 'a quarter of the input', 'zero'], a: 1, why: '$V_\\text{out} = V_\\text{in} R_2/(R_1 + R_2) = V_\\text{in}/2$.' }
  ],
  applications: [
    'Potentiometers for volume controls and position sensors.',
    'Sensor circuits: a thermistor or photoresistor in a voltage divider.',
    'House wiring in parallel so each appliance gets the full mains voltage.'
  ],
  sim: { id: 'em1-circuits', params: { topo: 'parallel' } }
},

{
  id: 'kirchhoffs-laws', parent: 'dc-circuits', title: 'Kirchhoff\'s laws', level: 2,
  short: 'Two rules solve any circuit: currents into a junction equal currents out, and the voltages round any closed loop add to zero.',
  keywords: ['Kirchhoff', 'junction rule', 'loop rule', 'current law', 'voltage law', 'KCL', 'KVL', 'network analysis', 'Wheatstone bridge', 'mesh'],
  prereq: ['resistors-combinations', 'emf-internal-resistance', 'math:systems-of-equations'],
  related: ['conservation-of-energy', 'rc-circuits', 'rlc-impedance', 'math:gaussian-elimination'],
  body: `
Series and parallel rules handle many circuits, but not all: two batteries in different branches, or a bridge of five resistors, cannot be reduced that way. Gustav Kirchhoff's two rules can solve **any** circuit, because they are just conservation laws in circuit form.

### The junction rule (conservation of charge)
At any junction, the total current flowing in equals the total current flowing out:

$$\\sum I_\\text{in} = \\sum I_\\text{out}$$

Charge cannot pile up at a point in a steady circuit, so whatever arrives must leave.

### The loop rule (conservation of energy)
Round any closed loop, the changes in potential add up to zero:

$$\\sum \\Delta V = 0$$

A charge that goes round a loop and returns to its starting point is back at the same potential, like a walker returning to the same height after a round trip in the hills. The rises (across sources) must balance the drops (across resistors).

### Signs, and a method
1. Label a current in every branch with an arrow. Guess the directions — a wrong guess just gives a negative answer.
2. Write the junction rule at all junctions but one (the last one adds nothing new).
3. Choose enough independent loops and go round each one:
   - crossing a resistor **with** your current arrow, the potential drops by $IR$; against it, it rises by $IR$;
   - crossing a source from $-$ to $+$, the potential rises by its EMF $\\mathcal{E}$; from $+$ to $-$, it falls.
4. Solve the [[math:systems-of-equations|simultaneous equations]]. For big networks this is linear algebra, and circuit simulators do exactly this.

### A loop with two sources
The simplest case with competing sources is one loop: a charger of EMF $\\mathcal{E}_1$ connected to a battery of EMF $\\mathcal{E}_2$ through a total resistance $R$. The loop rule gives $\\mathcal{E}_1 - IR - \\mathcal{E}_2 = 0$, so

$$I = \\frac{\\mathcal{E}_1 - \\mathcal{E}_2}{R}$$

If $\\mathcal{E}_1 > \\mathcal{E}_2$, current is driven backwards through the battery and charges it.

### The Wheatstone bridge
Four resistors in a diamond with a sensitive meter across the middle. When no current flows through the meter, the loop rule shows that the ratios on the two sides match, $R_1/R_2 = R_3/R_x$, so an unknown $R_x$ follows from three known ones. Bridges are still used in strain gauges and precise resistance measurements.
`,
  ideas: [
    'Junction rule: current in = current out, from conservation of charge.',
    'Loop rule: potential changes round a closed loop sum to zero, from conservation of energy.',
    'Guess current directions freely; a negative answer means the current flows the other way.',
    'With the two rules, any network of resistors and sources can be solved as simultaneous equations.'
  ],
  pitfalls: [
    'Sign errors round a loop — Decide the direction of travel first; a drop $IR$ when moving with the current, a rise when moving against it.',
    'Writing too many junction equations — With $n$ junctions only $n - 1$ are independent.',
    'A negative current means a mistake — It only means the true current flows opposite to the arrow you drew.'
  ],
  formulas: [
    {
      name: 'One loop with two opposing sources',
      expr: 'I = (E1 - E2)/R', tex: 'I = \\frac{\\mathcal{E}_1 - \\mathcal{E}_2}{R}',
      vars: {
        I: { name: 'current (positive: driven by the first source)', q: 'current', unit: 'A', signed: true },
        E1: { name: 'EMF of the first source', q: 'voltage', unit: 'V', value: 14.4, tex: '\\mathcal{E}_1' },
        E2: { name: 'EMF of the second source', q: 'voltage', unit: 'V', value: 12.6, tex: '\\mathcal{E}_2' },
        R: { name: 'total resistance in the loop', q: 'resistance', unit: 'Ω', value: 0.15 }
      },
      note: 'For example a charger (source 1) charging a battery (source 2). $R$ includes the internal resistances and the leads.',
      stories: {
        I: 'A {E1} charger is connected to a battery of EMF {E2}; the total resistance in the loop is {R}. What charging current flows?',
        R: 'A {E1} charger pushes {I} into a {E2} battery. What is the total resistance of the loop?'
      }
    },
    {
      name: 'Balanced Wheatstone bridge',
      expr: 'Rx = R2*R3/R1', tex: 'R_x = \\frac{R_2 R_3}{R_1}',
      vars: {
        Rx: { name: 'unknown resistance', q: 'resistance', unit: 'Ω', tex: 'R_x' },
        R1: { name: 'ratio arm, top left', q: 'resistance', unit: 'Ω', value: 1000 },
        R2: { name: 'ratio arm, bottom left', q: 'resistance', unit: 'Ω', value: 1000 },
        R3: { name: 'adjustable arm, top right', q: 'resistance', unit: 'Ω', value: 352 }
      },
      note: 'Valid when the meter across the middle of the bridge reads zero.',
      stories: { Rx: 'A bridge balances with {R1} and {R2} in the ratio arms and the adjustable arm at {R3}. What is the unknown resistance?' }
    }
  ],
  examples: [
    {
      title: 'Two batteries, three branches',
      q: 'Two junctions, A (top) and B (bottom), are joined by three branches: a 12 V battery with 4 Ω, a 6 V battery with 2 Ω, and a 6 Ω resistor alone. Both batteries have their + terminal towards A. Find the three currents.',
      steps: [
        'Let $I_1$ and $I_2$ flow up through the 12 V and 6 V branches into A, and $I_3$ flow down through the 6 Ω. Junction A: $I_1 + I_2 = I_3$.',
        'Loop through the 12 V branch and the 6 Ω: $12 - 4I_1 - 6I_3 = 0$.',
        'Loop through the 6 V branch and the 6 Ω: $6 - 2I_2 - 6I_3 = 0$.',
        'So $I_1 = 3 - 1.5I_3$ and $I_2 = 3 - 3I_3$. Substituting in the junction rule: $6 - 4.5I_3 = I_3$, so $I_3 = 12/11 = 1.09$ A.',
        'Then $I_1 = 15/11 = 1.36$ A and $I_2 = -3/11 = -0.27$ A. The minus sign means 0.27 A flows **down** through the 6 V battery: the 12 V battery is charging it.'
      ],
      a: '1.36 A up through the 12 V battery, 0.27 A down through the 6 V battery, 1.09 A through the 6 Ω.'
    }
  ],
  quiz: [
    { q: 'Currents of 3 A and 2 A flow into a junction and one wire carries 4 A out. What does the fourth wire carry?', choices: ['1 A in', '1 A out', '9 A out', 'nothing'], a: 1, why: 'In: 5 A. Out so far: 4 A. The remaining 1 A must flow out.' },
    { q: 'Kirchhoff\'s loop rule expresses conservation of…', choices: ['charge', 'energy', 'momentum', 'current'], a: 1,
      why: 'A charge returning to its starting point must return to the same potential energy; the rises and drops round the loop cancel.' },
    { q: 'Solving a circuit you get $I_2 = -0.4$ A. This means…', choices: ['you made an error', 'the current is 0.4 A opposite to your arrow', 'the resistor produces energy', 'the circuit cannot work'], a: 1,
      why: 'Directions are guessed at the start; the sign of the answer corrects the guess.' },
    { q: 'Going round a loop you cross a resistor in the same direction as its current $I$. The potential…', choices: ['rises by $IR$', 'falls by $IR$', 'is unchanged', 'rises by $I/R$'], a: 1,
      why: 'Current flows from high to low potential through a resistor, so moving with it you go downhill by $IR$.' }
  ],
  applications: [
    'Circuit simulators (SPICE and its descendants) solve Kirchhoff\'s equations for thousands of components.',
    'Battery chargers, solar panels charging batteries, and parallel battery packs.',
    'Wheatstone bridges in strain gauges, scales and gas sensors.'
  ],
  history: 'Gustav Kirchhoff formulated the rules in 1845 while still a student in Königsberg; he later co-founded spectroscopy with Robert Bunsen.',
  sim: { id: 'em1-circuits', params: { topo: 'mixed' } }
},

{
  id: 'emf-internal-resistance', parent: 'dc-circuits', title: 'EMF and internal resistance', level: 2,
  short: 'A real battery acts like an ideal voltage source ℰ in series with a small internal resistance r, so its terminal voltage sags as it delivers current.',
  keywords: ['EMF', 'electromotive force', 'internal resistance', 'terminal voltage', 'lost volts', 'maximum power transfer', 'battery', 'short circuit', 'efficiency'],
  prereq: ['ohms-law', 'electric-power'],
  related: ['kirchhoffs-laws', 'electric-potential', 'efficiency'],
  body: `
A battery converts chemical energy into electrical energy. The energy it gives each coulomb passing through it is its **electromotive force**, or EMF, written $\\mathcal{E}$ and measured in volts. Despite the old name it is not a force at all: it is energy per unit charge, the "pump pressure" of the source. A fresh alkaline cell has $\\mathcal{E} = 1.5$ V, a lead–acid car battery about 12.6 V.

### Internal resistance
Current has to flow through the battery too — through its electrolyte and electrodes — and they have some resistance $r$. A real battery behaves like an ideal EMF in series with this **internal resistance**. Connected to a load $R$, the whole loop has resistance $R + r$, so

$$I = \\frac{\\mathcal{E}}{R + r}$$

and the voltage actually available at the terminals is the EMF minus the "lost volts" inside:

$$V = \\mathcal{E} - Ir$$

With no current (a good voltmeter across an idle battery) $V = \\mathcal{E}$. The more current you draw, the more the terminal voltage sags. That is why a car's headlights dim while the starter motor turns: 200 A through 0.015 Ω loses 3 V inside the battery. A short circuit ($R \\to 0$) draws the largest possible current, $\\mathcal{E}/r$, and dumps all the power inside the battery — which is why shorted batteries get hot, and can burst or catch fire.

Plot the terminal voltage against the current drawn and you get a straight line: it starts at $\\mathcal{E}$ and falls with slope $-r$. Two readings are enough to measure both.

### Power to the load
The load receives $P = I^2 R = \\dfrac{\\mathcal{E}^2 R}{(R + r)^2}$. It is small for a tiny $R$ (big current, but almost no voltage across the load) and for a huge $R$ (full voltage but little current). In between it peaks exactly when

$$R = r, \\qquad P_\\text{max} = \\frac{\\mathcal{E}^2}{4r}$$

This is the **maximum power transfer theorem**. At the peak, as much power is wasted inside the source as reaches the load: the efficiency is only 50 %. Antennas and the first stages of radio receivers are matched this way, because squeezing the most out of a faint signal matters more than efficiency; power stations, batteries and audio amplifiers are run with $R \\gg r$, because there efficiency (or a steady voltage) is what counts.

> [!tip] In the simulation, press **Set R = r** and watch the load power reach its peak on the graph — then check the efficiency readout.
`,
  ideas: [
    'EMF is the energy supplied per unit charge by a source, in volts.',
    'A real source is an ideal EMF with an internal resistance $r$ in series.',
    'Terminal voltage $V = \\mathcal{E} - Ir$ falls as the current grows.',
    'Load power is greatest when $R = r$, at 50 % efficiency.'
  ],
  pitfalls: [
    'EMF is a force — It is an energy per unit charge, measured in volts.',
    'A battery always gives its rated voltage — Only when no current flows. Under load the terminal voltage is lower by $Ir$.',
    'Maximum power transfer means maximum efficiency — At $R = r$ the efficiency is only 50 %; efficiency keeps rising as $R$ grows beyond $r$.'
  ],
  derivation: {
    title: 'Why the load power peaks at R = r',
    steps: [
      { text: 'The power delivered to the load is', tex: 'P(R) = I^2R = \\frac{\\mathcal{E}^2 R}{(R + r)^2}' },
      { text: 'Differentiate with respect to $R$ using the quotient rule ([[math:extrema|maxima and minima]]):', tex: '\\frac{dP}{dR} = \\mathcal{E}^2\\,\\frac{(R + r)^2 - 2R(R + r)}{(R + r)^4} = \\mathcal{E}^2\\,\\frac{r - R}{(R + r)^3}' },
      { text: 'This is zero only at $R = r$, positive below it and negative above it, so it is a maximum:', tex: 'P_\\text{max} = \\frac{\\mathcal{E}^2 r}{(2r)^2} = \\frac{\\mathcal{E}^2}{4r}' }
    ]
  },
  formulas: [
    {
      name: 'Terminal voltage',
      expr: 'V = E - I*r', tex: 'V = \\mathcal{E} - Ir',
      vars: {
        V: { name: 'terminal voltage', q: 'voltage', unit: 'V' },
        E: { name: 'EMF', q: 'voltage', unit: 'V', value: 12.6, tex: '\\mathcal{E}' },
        I: { name: 'current drawn', q: 'current', unit: 'A', value: 200 },
        r: { name: 'internal resistance', q: 'resistance', unit: 'mΩ', value: 15 }
      },
      stories: {
        V: 'A car battery with EMF {E} and internal resistance {r} supplies {I} to the starter motor. What is its terminal voltage?',
        r: 'A battery of EMF {E} reads {V} at its terminals while supplying {I}. What is its internal resistance?'
      }
    },
    {
      name: 'Current from a real source',
      expr: 'I = E/(R + r)', tex: 'I = \\frac{\\mathcal{E}}{R + r}',
      vars: {
        I: { name: 'current', q: 'current', unit: 'A' },
        E: { name: 'EMF', q: 'voltage', unit: 'V', value: 1.5, tex: '\\mathcal{E}' },
        R: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 4.7 },
        r: { name: 'internal resistance', q: 'resistance', unit: 'Ω', value: 0.3 }
      },
      stories: { I: 'A cell of EMF {E} and internal resistance {r} is connected to a {R} resistor. What current flows?' }
    },
    {
      name: 'Power delivered to the load',
      expr: 'P = E^2*R/(R + r)^2', tex: 'P = \\frac{\\mathcal{E}^2 R}{(R + r)^2}', solveFor: 'P',
      vars: {
        P: { name: 'power to the load', q: 'power', unit: 'W' },
        E: { name: 'EMF', q: 'voltage', unit: 'V', value: 12, tex: '\\mathcal{E}' },
        R: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 4, min: 0, max: 1000 },
        r: { name: 'internal resistance', q: 'resistance', unit: 'Ω', value: 0.5 }
      },
      note: 'Any power below $\\mathcal{E}^2/4r$ can be reached with two loads, one on each side of $R = r$ — solving for $R$ finds both.',
      practice: { unknowns: ['P', 'R'] },
      stories: {
        P: 'A {E} source with internal resistance {r} feeds a {R} load. How much power does the load receive?',
        R: 'A {E} source with internal resistance {r} must deliver {P} to a load. What load resistance does that?'
      }
    }
  ],
  examples: [
    {
      title: 'Starting a car',
      q: 'A car battery has EMF 12.6 V and internal resistance 15 mΩ. The starter motor draws 200 A. Find the terminal voltage and the power wasted inside the battery.',
      steps: [
        'Lost volts: $Ir = 200 \\times 0.015 = 3.0$ V, so $V = 12.6 - 3.0 = 9.6$ V — the headlights dim.',
        'Power wasted: $I^2 r = 200^2 \\times 0.015 = 600$ W, heating the battery. The motor receives $IV = 200 \\times 9.6 = 1.9$ kW.'
      ],
      a: '9.6 V at the terminals; 600 W lost inside.'
    },
    {
      title: 'Measuring EMF and internal resistance',
      q: 'A voltmeter across an idle cell reads 1.50 V. With a load drawing 0.50 A, it reads 1.35 V. Find $\\mathcal{E}$ and $r$.',
      steps: [
        'With (almost) no current, the terminal voltage equals the EMF: $\\mathcal{E} = 1.50$ V.',
        'Under load: $1.35 = 1.50 - 0.50\\,r$, so $r = 0.15/0.50 = 0.30\\ \\Omega$.'
      ],
      a: '$\\mathcal{E} = 1.50$ V, $r = 0.30\\ \\Omega$.'
    }
  ],
  quiz: [
    { q: 'A battery\'s terminal voltage is 11.2 V while it delivers 5.0 A, and 12.0 V when no current flows. Its internal resistance is…', choices: ['0.16 Ω', '2.2 Ω', '2.4 Ω', '0.8 Ω'], a: 0, why: 'Lost volts $= 0.8$ V at 5.0 A: $r = 0.8/5.0 = 0.16\\ \\Omega$.' },
    { q: 'For a source with internal resistance 2 Ω, which load receives the most power?', choices: ['0.5 Ω', '2 Ω', '8 Ω', 'the largest possible'], a: 1, why: 'Maximum power transfer happens when the load matches the internal resistance.' },
    { q: 'A battery is short-circuited with a thick wire. Where does most of the power go?', choices: ['into the wire', 'into the battery\'s internal resistance', 'nowhere — no power flows', 'back into the chemicals'], a: 1,
      why: 'With $R \\approx 0$ the current is $\\mathcal{E}/r$ and almost all the voltage, and so the power, is lost across $r$ inside the battery.' },
    { q: 'At maximum power transfer, the efficiency of delivering power to the load is 100 %.', a: false, why: 'At $R = r$ the load and the internal resistance take equal power: 50 % efficiency.' }
  ],
  applications: [
    'Battery testers measure the terminal voltage under load, not the idle voltage.',
    'Impedance matching of antennas, cables and radio-frequency amplifiers.',
    'Fire safety: shorted lithium cells overheat because their tiny internal resistance allows enormous currents.'
  ],
  sim: 'em1-battery'
},

{
  id: 'rc-circuits', parent: 'dc-circuits', title: 'RC circuits', level: 2,
  short: 'A capacitor charging or discharging through a resistor changes exponentially, with a time constant τ = RC.',
  keywords: ['RC circuit', 'time constant', 'tau = RC', 'charging', 'discharging', 'exponential', '63 percent', 'timer', 'filter', 'half-life'],
  prereq: ['capacitance', 'kirchhoffs-laws', 'math:exponential-growth-decay', 'math:separable-equations'],
  related: ['energy-in-capacitor', 'rl-circuits', 'reactance', 'half-life'],
  body: `
Connect an uncharged capacitor to a battery through a resistor. At first the capacitor has no voltage across it, so the whole battery voltage sits across the resistor and a large current $\\mathcal{E}/R$ rushes in. As charge builds up, the capacitor's voltage rises and opposes the battery, the current falls, and the charging slows down. It never quite stops: the approach is **exponential**.

### Charging
With the capacitor at voltage $V_C = q/C$, the loop rule gives $\\mathcal{E} - IR - q/C = 0$ with $I = dq/dt$. The solution (derived below) is

$$V_C = \\mathcal{E}\\left(1 - e^{-t/RC}\\right), \\qquad I = \\frac{\\mathcal{E}}{R}\\,e^{-t/RC}$$

### Discharging
Disconnect the battery and let the capacitor drain through the resistor. Starting from $V_0$,

$$V_C = V_0\\,e^{-t/RC}$$

and the current is $V_C/R$, flowing the other way.

### The time constant
Everything is set by one quantity, the **time constant**

$$\\tau = RC$$

(ohms times farads is seconds). After one $\\tau$ a charging capacitor has reached $1 - e^{-1} = 63\\ \\%$ of the final voltage, or a discharging one has fallen to $e^{-1} = 37\\ \\%$. After $2\\tau$: 86 % (or 14 %); after $5\\tau$: more than 99 % — for practical purposes, done. The voltage halves every $\\tau\\ln 2 = 0.69\\,\\tau$, exactly like [[half-life|radioactive decay]].

A 100 kΩ resistor and a 10 µF capacitor give $\\tau = 1$ s; 1 kΩ and 1 nF give 1 µs. Double either $R$ or $C$ and the whole process takes twice as long — a larger capacitor holds more charge, and a larger resistor lets it in more slowly.

### Energy
While charging, the battery supplies $Q\\mathcal{E}$, the capacitor stores $\\tfrac12 Q\\mathcal{E}$, and the rest is lost as heat in the resistor — exactly half, whatever $R$ is (see [[energy-in-capacitor]]).

### Where RC circuits work
Time delays (the classic 555 timer chip, the pause of an intermittent windscreen wiper), smoothing ripple in power supplies, "debouncing" push-buttons, simple low-pass and high-pass filters with a corner frequency $1/2\\pi RC$ ([[reactance]]), and the membrane of every nerve cell, which behaves like a leaky capacitor with a time constant of milliseconds.
`,
  ideas: [
    'Charging and discharging through a resistor are exponential.',
    'The time constant $\\tau = RC$ sets the speed: 63 % charged after $\\tau$, over 99 % after $5\\tau$.',
    'The current is largest at the moment of switching and decays with the same $\\tau$.',
    'Charging through a resistor always wastes half the energy the battery supplies.'
  ],
  pitfalls: [
    'A capacitor is fully charged after one time constant — Only 63 %. It takes about five time constants to get within 1 %.',
    'The current is zero at the start of charging because the capacitor is empty — It is largest then: an empty capacitor has no voltage to oppose the battery.',
    'A bigger resistor stores more charge — The final charge $C\\mathcal{E}$ does not depend on $R$; the resistor only sets how fast it gets there.'
  ],
  derivation: {
    title: 'Solving the charging equation',
    steps: [
      { text: 'Loop rule, with $I = dq/dt$ and the capacitor voltage $q/C$:', tex: '\\mathcal{E} - R\\frac{dq}{dt} - \\frac{q}{C} = 0 \\;\\Rightarrow\\; \\frac{dq}{dt} = \\frac{C\\mathcal{E} - q}{RC}' },
      { text: 'Separate the variables ([[math:separable-equations|separable equations]]) and integrate from $q = 0$ at $t = 0$:', tex: '\\int_0^{q} \\frac{dq\'}{C\\mathcal{E} - q\'} = \\int_0^{t} \\frac{dt\'}{RC} \\;\\Rightarrow\\; -\\ln\\frac{C\\mathcal{E} - q}{C\\mathcal{E}} = \\frac{t}{RC}' },
      { text: 'Exponentiate and rearrange:', tex: 'q = C\\mathcal{E}\\left(1 - e^{-t/RC}\\right), \\qquad V_C = \\frac{q}{C} = \\mathcal{E}\\left(1 - e^{-t/RC}\\right)' },
      { text: 'Differentiate to get the current:', tex: 'I = \\frac{dq}{dt} = \\frac{\\mathcal{E}}{R}\\,e^{-t/RC}' }
    ]
  },
  formulas: [
    {
      name: 'Time constant',
      expr: 'tau = R*C', tex: '\\tau = RC',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 's' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 100 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'uF', value: 10 }
      },
      stories: {
        tau: 'What is the time constant of a {R} resistor with a {C} capacitor?',
        C: 'A timer needs a time constant of {tau} using a {R} resistor. What capacitor does it need?'
      }
    },
    {
      name: 'Charging: capacitor voltage',
      expr: 'Vc = E*(1 - exp(-t/(R*C)))', tex: 'V_C = \\mathcal{E}\\left(1 - e^{-t/RC}\\right)', solveFor: 'Vc',
      vars: {
        Vc: { name: 'capacitor voltage', q: 'voltage', unit: 'V', tex: 'V_C' },
        E: { name: 'battery EMF', q: 'voltage', unit: 'V', value: 9, tex: '\\mathcal{E}' },
        t: { name: 'time since switching on', q: 'time', unit: 's', value: 0.8 },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 100 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'uF', value: 10 }
      },
      practice: { unknowns: ['Vc', 't'] },
      stories: {
        Vc: 'A {C} capacitor charges from a {E} battery through {R}. What is its voltage {t} after switching on?',
        t: 'A {C} capacitor charges through {R} from a {E} battery. How long until its voltage reaches {Vc}?'
      }
    },
    {
      name: 'Discharging: capacitor voltage',
      expr: 'V = V0*exp(-t/(R*C))', tex: 'V = V_0\\, e^{-t/RC}', solveFor: 'V',
      vars: {
        V: { name: 'capacitor voltage', q: 'voltage', unit: 'V' },
        V0: { name: 'starting voltage', q: 'voltage', unit: 'V', value: 12 },
        t: { name: 'time since discharge began', q: 'time', unit: 's', value: 5 },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 2.2 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'uF', value: 1000 }
      },
      practice: { unknowns: ['V', 't'] },
      stories: {
        V: 'A {C} capacitor charged to {V0} discharges through {R}. What is its voltage after {t}?',
        t: 'A {C} capacitor at {V0} discharges through {R}. How long until it is down to {V}?'
      }
    },
    {
      name: 'Charging: current',
      expr: 'I = E/R*exp(-t/(R*C))', tex: 'I = \\frac{\\mathcal{E}}{R}\\, e^{-t/RC}', solveFor: 'I',
      vars: {
        I: { name: 'current', q: 'current', unit: 'mA' },
        E: { name: 'battery EMF', q: 'voltage', unit: 'V', value: 9, tex: '\\mathcal{E}' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 1 },
        t: { name: 'time since switching on', q: 'time', unit: 'ms', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'uF', value: 10 }
      },
      practice: { unknowns: ['I', 't'] },
      stories: { I: 'A {C} capacitor is charged from {E} through {R}. What current flows {t} after the switch closes?' }
    }
  ],
  examples: [
    {
      title: 'How long to reach 5 V?',
      q: 'A 10 µF capacitor charges through 100 kΩ from a 9.0 V battery. When does its voltage reach 5.0 V?',
      steps: [
        '$\\tau = RC = 10^{5} \\times 10^{-5} = 1.0$ s.',
        '$5.0 = 9.0\\,(1 - e^{-t/\\tau})$, so $e^{-t/\\tau} = 1 - 5/9 = 0.444$.',
        '$t = -\\tau \\ln 0.444 = 0.81$ s.'
      ],
      a: 'After 0.81 s.'
    },
    {
      title: 'A smoothing capacitor runs down',
      q: 'A 1000 µF capacitor charged to 12 V discharges through a 2.2 kΩ load. How long until it falls to 1.0 V?',
      steps: [
        '$\\tau = 2200 \\times 10^{-3} = 2.2$ s.',
        '$1.0 = 12\\,e^{-t/2.2}$, so $t = 2.2 \\ln 12 = 5.5$ s — two and a half time constants.'
      ],
      a: 'About 5.5 s.'
    }
  ],
  quiz: [
    { q: 'After one time constant, a charging capacitor has reached what fraction of its final voltage?', choices: ['37 %', '50 %', '63 %', '100 %'], a: 2, why: '$1 - e^{-1} = 0.632$.' },
    { q: 'The resistance in an RC circuit is doubled. The time to charge to 90 %…', choices: ['halves', 'doubles', 'is unchanged', 'quadruples'], a: 1, why: 'All times scale with $\\tau = RC$.' },
    { q: 'At the instant the switch closes on an uncharged capacitor, the current is…', choices: ['zero', '$\\mathcal{E}/R$, its largest value', '$\\mathcal{E}/2R$', 'infinite'], a: 1,
      why: 'The empty capacitor has no voltage, so the full EMF is across the resistor.' },
    { q: 'A discharging capacitor falls from 10 V to 5 V in 2 s. How long does it take to fall from 5 V to 2.5 V?', choices: ['1 s', '2 s', '4 s', 'it never gets there'], a: 1,
      why: 'Exponential decay has a constant halving time: $0.69\\,\\tau$ every time.' },
    { q: 'Making the resistor larger lets a capacitor store more charge from the same battery.', a: false,
      why: 'The final charge is $C\\mathcal{E}$; the resistor only controls how quickly it is reached.' }
  ],
  applications: [
    'Timers and delays: 555 timer chips, wiper intervals, flashing lights.',
    'Camera flashes and defibrillators charge a capacitor through a resistor, then dump it quickly.',
    'Low-pass and high-pass filters in audio and signal processing.',
    'Nerve membranes, modelled as leaky RC circuits.'
  ],
  sim: 'em1-rc'
}

);
