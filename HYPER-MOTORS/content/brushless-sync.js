/* HYPER-MOTORS · content/brushless-sync.js
 * Brushless motors (bldc-topic) and synchronous motors (sync-topic). Simulations in sims/brushless-sync.js (ids bl-…). */
Hyper.add(

{
  id: 'bldc-motor', parent: 'bldc-topic', title: 'The brushless DC motor', level: 1,
  short: 'A permanent-magnet motor turned inside out: magnets on the rotor, a three-phase winding on the stator, and transistors instead of brushes switching the current in step with the rotor. It behaves like a DC motor — speed follows voltage, torque follows current — but lasts far longer, runs faster, and cannot run without its controller.',
  keywords: ['BLDC', 'brushless DC motor', 'EC motor', 'electronic commutation', 'permanent magnet', 'three-phase', 'Kv', 'Kt', 'speed constant', 'back-EMF', 'trapezoidal', 'six-step', 'pole pairs', 'electrical frequency', 'inverter'],
  prereq: ['back-emf', 'pmdc-motor', 'torque-and-power'],
  related: ['hall-commutation', 'sensorless-control', 'foc-control', 'pmsm-motor', 'esc-drivers', 'bldc-selection', 'dc-torque-speed', 'electronics:h-bridge', 'electronics:three-phase'],
  body: `
In a brushed DC motor the magnets stand still and the coils turn; the commutator and brushes flip the current in each coil as it passes the poles. The **brushless DC motor** (BLDC, also sold as an *EC motor*, "electronically commutated") turns this inside out: permanent magnets ride on the rotor, the coils sit in the stator, and six transistors switch the current from coil to coil. Nothing rubs except the bearings.

### How it is built
- **Stator:** laminated steel with slots holding a three-phase winding, almost always in star with three leads (U, V, W or A, B, C). Common slot/pole combinations: 6 slots with 4 poles, 9/6, 12/8, and 12 slots with 14 magnet poles in outrunners.
- **Rotor:** neodymium–iron–boron magnets (remanence about 1.2–1.4 T) or cheaper ferrite (about 0.4 T), on the surface or buried in the iron — from 2 poles in fast blowers to 40 or more in hub and gimbal motors.
- **Position sensing:** three Hall sensors ([[hall-commutation]]), the back-EMF of the unpowered phase ([[sensorless-control]]), or an encoder for [[foc-control|field-oriented control]].
- **Controller:** three half-bridges of MOSFETs fed from a DC supply, which energise two phases at a time in six steps per electrical revolution and chop them with [[electronics:pwm|PWM]] to set the speed.

### It is still a DC motor
Seen from its DC supply, a six-step BLDC motor obeys the same two equations as the [[dc-torque-speed|brushed DC motor]]. Two phases in series carry the current, so with the line-to-line resistance $R$ and back-EMF constant $K_e$

$$V = R\\,I + K_e\\,\\omega, \\qquad T = K_t\\,(I - I_0)$$

and in SI units $K_t = K_e$. Model motors quote the **speed constant** $K_v$ in rpm per volt — the no-load speed per volt — and $K_t = 60/(2\\pi K_v) = 9.55/K_v$ N·m/A: speed and torque per ampere are [[?inverse|inversely]] tied. A 1000 rpm/V motor gives about 0.0095 N·m per ampere; a 100 rpm/V motor ten times as much. Speed is set by the average voltage (PWM), torque by the current.

Because the rotor carries $p$ poles, the currents alternate $p/2$ times per revolution: the **electrical frequency** is $f_e = (p/2)\\,n$. A 14-pole outrunner at 6000 rpm switches at 700 Hz; an 8-pole industrial motor at 3000 rpm at 200 Hz. Controllers, iron losses and sensor resolution all follow $f_e$, not the shaft speed.

### Typical numbers
| Kind | Supply | Power | Speed | Efficiency |
|---|---|---|---|---|
| Fans and small pumps | 5–24 V | 0.5–20 W | 1000–5000 rpm | 30–70 % |
| Industrial BLDC, 42–86 mm square flange | 24–48 V (mains types: 310 V DC bus) | 20–750 W | 1500–4000 rpm rated | 75–90 % |
| Drone and model outrunners | 2–12 lithium cells (7–50 V) | 50 W–5 kW | 3000–30 000 rpm | 80–92 % |
| E-bike hub motors | 36–48 V | 250–1000 W | 150–400 rpm | 80–88 % |
| High-speed inrunners (blowers, spindles) | 24–400 V | 0.1–5 kW | 20 000–100 000 rpm | 85–95 % |

### What you gain and what you pay
With no brushes the life is set by the bearings — commonly 20 000 hours and more, against a few thousand for small brushed motors — and there is no brush dust, arcing or brush voltage drop. The heat is made in the stator, against the housing, so it escapes easily. The price is the electronics: every BLDC motor needs a driver, motor and driver must match (voltage, current, sensors, pole count), and six-step switching gives a torque ripple of roughly 5–15 % and a hum at the commutation frequency; [[foc-control|sinusoidal drive]] removes most of it. Turn a BLDC motor by hand and you may feel **cogging**: the magnets pulling on the stator teeth.

In the simulation the six transistors light in pairs, the stator field jumps 60° at each step and the rotor chases it. Load the motor and the current climbs along the same straight line as a brushed motor's.

| Symptom | Likely cause | Remedy |
|---|---|---|
| Twitches or buzzes, high current, does not turn | phases or Hall sensors in the wrong order; a dead Hall sensor | check the wiring against the motor's table; test each Hall signal |
| Runs rough and hot, slower one way | Hall sensors misaligned or wrong 60°/120° setting | correct the setting; check the timing with an oscilloscope |
| Speed sags badly under load | driver current limit, weak supply | check the limit and the supply voltage under load |

> [!warn] A spinning permanent-magnet motor is a generator: its terminals are live whenever the shaft turns, even with the controller disconnected. Pushing a machine or an e-bike by hand can pump up the controller's DC bus; large motors at high speed make dangerous voltages. Stop the shaft before touching the leads.

> [!key] A BLDC motor is a DC motor whose commutator is a transistor bridge: speed [[?proportional|proportional]] to voltage, torque to current, $K_t = 9.55/K_v$ — and it cannot run without its controller.
`,
  ideas: [
    'A BLDC motor has magnets on the rotor and the winding on the stator; transistors, not brushes, commutate the current.',
    'Seen from the DC supply it follows the DC motor equations: V = RI + Keω and T = Kt(I − I₀), with Kt = Ke in SI units.',
    'Kt in N·m/A equals 9.55 divided by Kv in rpm/V: a high-Kv motor gives little torque per ampere.',
    'The electrical frequency is the pole-pair count times the revolutions per second; controllers and iron losses follow it.',
    'Life is set by the bearings, not brushes — but a controller is always needed.'
  ],
  pitfalls: [
    'Brushless means AC, so it cannot run from a battery — It runs from DC through its controller, which makes the three-phase currents; seen from the battery it behaves like a DC motor.',
    'A higher-Kv motor is a more powerful motor — Kv only says how fast it turns per volt. The same motor wound with fewer turns has a higher Kv and needs proportionally more current for the same torque; power is set by size and cooling.',
    'Swapping two motor wires is harmless — On a sensorless controller it just reverses the motor; on a Hall-sensored drive the commutation table no longer matches and the motor locks, shudders or overheats.'
  ],
  formulas: [
    {
      name: 'Torque constant from the speed constant',
      expr: 'Kt = 60/(2*pi*Kv)', tex: 'K_t = \\dfrac{60}{2\\pi\\,K_v}',
      vars: {
        Kt: { name: 'torque constant', q: 'ktorque', unit: 'N·m/A', tex: 'K_t' },
        Kv: { name: 'speed constant', q: false, unit: 'rpm/V', value: 147, tex: 'K_v' }
      },
      note: 'Kv in rpm per volt (the no-load speed per volt of average supply); Kt in N·m per ampere. The same relation links Kv to the back-EMF constant Ke in V·s/rad.',
      stories: { Kt: 'A BLDC motor is listed at {Kv}. How much torque does it give per ampere?', Kv: 'A motor gives {Kt}. What is its speed constant?' }
    },
    {
      name: 'Speed under load',
      expr: 'n = Kv*(V - R*I)', tex: 'n = K_v\\,(V - R\\,I)',
      vars: {
        n: { name: 'speed', q: false, unit: 'rpm', tex: 'n' },
        Kv: { name: 'speed constant', q: false, unit: 'rpm/V', value: 147, tex: 'K_v' },
        V: { name: 'average applied voltage (duty × supply)', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'line-to-line resistance', q: 'resistance', unit: 'Ω', value: 0.6 },
        I: { name: 'supply current', q: 'current', unit: 'A', value: 5.2 }
      },
      note: 'Six-step drive: two phases conduct in series, so R is the line-to-line (terminal) resistance. The controller\'s transistors add a little to it.',
      stories: { n: 'A {Kv} motor with {R} between its terminals draws {I} at {V}. How fast does it turn?', I: 'A {Kv} motor with {R} runs at {n} on {V}. What current does it draw?' }
    },
    {
      name: 'Electrical frequency',
      expr: 'fe = p/2*n', tex: 'f_e = \\dfrac{p}{2}\\,n',
      vars: {
        fe: { name: 'electrical frequency', q: 'frequency', unit: 'Hz', tex: 'f_e' },
        p: { name: 'number of magnet poles', int: true, value: 14, tex: 'p' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 6000 }
      },
      note: 'Each pole pair passing a coil is one electrical cycle. Six-step drive makes six commutations per electrical cycle.',
      stories: { fe: 'A {p}-pole motor turns at {n}. At what frequency must its controller switch the phases?', p: 'A controller switches at {fe} while the shaft turns at {n}. How many poles has the motor?' }
    }
  ],
  examples: [
    {
      title: 'From the datasheet to the operating point',
      q: 'A 24 V industrial BLDC motor is listed with $K_v$ = 147 rpm/V, a line-to-line resistance of 0.6 Ω and a no-load current of 0.3 A. Find $K_t$, the no-load speed, and the speed, current and efficiency at its rated torque of 0.32 N·m.',
      steps: [
        '$K_t = 9.549/147 = 0.0650$ N·m/A.',
        'No-load speed: $n_0 = K_v\\,(V - R I_0) = 147 \\times (24 - 0.18) = 3500$ rpm.',
        'Current at 0.32 N·m: $I = T/K_t + I_0 = 0.32/0.065 + 0.3 = 5.22$ A.',
        'Speed: $n = 147 \\times (24 - 0.6 \\times 5.22) = 147 \\times 20.87 = 3068$ rpm $= 321$ rad/s.',
        'Output $0.32 \\times 321 = 103$ W; input $24 \\times 5.22 = 125$ W; efficiency 82 %.'
      ],
      a: 'Kt = 0.065 N·m/A; about 3500 rpm at no load; about 3070 rpm, 5.2 A and 82 % at rated torque — a typical "24 V, 100 W, 3000 rpm" motor.'
    },
    {
      title: 'How fast does the controller switch?',
      q: 'A 14-pole outrunner spins a propeller at 9000 rpm. What is the electrical frequency, how many commutations happen per second in six-step drive, and how long does each step last?',
      steps: [
        '$f_e = (14/2) \\times 9000/60 = 7 \\times 150 = 1050$ Hz.',
        'Six steps per electrical cycle: $6 \\times 1050 = 6300$ commutations per second.',
        'Each step lasts $1/6300 = 159$ µs.'
      ],
      a: '1050 Hz; 6300 commutations a second, 159 µs each.'
    },
    {
      title: 'Same motor, half the turns',
      q: 'The motor of the first example is rewound with half the turns for a 12 V supply. Kv doubles to 294 rpm/V, the resistance falls to a quarter (0.15 Ω) and the no-load current doubles (0.6 A). Compare the current and copper loss at 0.32 N·m.',
      steps: [
        '$K_t = 9.549/294 = 0.0325$ N·m/A, so $I = 0.32/0.0325 + 0.6 = 10.45$ A — twice the current.',
        'Copper loss $I^2R = 10.45^2 \\times 0.15 = 16.4$ W, against $5.22^2 \\times 0.6 = 16.3$ W before.',
        'No-load speed $294 \\times 12 \\approx 3500$ rpm: the same speed at half the voltage.'
      ],
      a: 'Twice the current at half the voltage, the same speed and the same heat: the winding chooses voltage and current, not power.'
    }
  ],
  quiz: [
    { q: 'A motor has $K_v$ = 500 rpm/V. Its torque constant is about…', choices: ['0.019 N·m/A', '500 N·m/A', '0.5 N·m/A', '52 N·m/A'], a: 0, why: '9.55/500 = 0.0191 N·m/A. A motor wound to turn fast per volt gives little torque per ampere.' },
    { q: 'What usually wears out first in a well-applied BLDC motor?', choices: ['The bearings', 'The brushes', 'The commutator', 'The magnets'], a: 0, why: 'There are no brushes or commutator; the bearings (and their grease) set the life, often 20 000 h or more.' },
    { q: 'A BLDC motor connected straight to a battery, without its controller, runs slowly.', a: false, why: 'It does not run at all: DC through two phases makes a fixed field, the rotor swings to line up with it and stops — while the winding carries V/R and heats.' },
    { q: 'A 12-pole motor turns at 3000 rpm. The electrical frequency is…', choices: ['300 Hz', '50 Hz', '600 Hz', '3000 Hz'], a: 0, why: '(12/2) × 3000/60 = 6 × 50 = 300 Hz.' },
    { q: 'Why is heat easier to remove from a BLDC motor than from a brushed motor of the same size?', choices: ['Its copper losses are in the stator, which touches the housing', 'Magnets absorb heat', 'It has no iron losses', 'It draws less current for the same torque'], a: 0, why: 'The winding is in the stator, pressed into the case; in a brushed motor it spins inside, cooled only through the air gap.' }
  ],
  problems: [
    { q: 'A drone motor with $K_v$ = 920 rpm/V runs on a 14.8 V battery. Estimate its no-load speed, ignoring losses.', answer: 13616, unit: 'rpm', tol: 0.02, steps: ['$n_0 \\approx K_v V = 920 \\times 14.8 = 13\\,616$ rpm.'] },
    { q: 'A BLDC motor has $K_t$ = 0.08 N·m/A and a no-load current of 0.4 A. What current does it draw at 0.6 N·m?', answer: 7.9, unit: 'A', tol: 0.02, steps: ['$I = T/K_t + I_0 = 0.6/0.08 + 0.4 = 7.5 + 0.4 = 7.9$ A.'] }
  ],
  choose: {
    good: [
      'Long life and continuous duty: fans, pumps, blowers, conveyors and AGV wheels running thousands of hours without brush maintenance.',
      'High speed and power density: drones, power tools, spindles, compressors, e-bikes.',
      'Clean and quiet places: medical devices, office equipment, clean rooms — no brush dust or arcing.',
      'Battery equipment, where efficiency is run time.'
    ],
    avoid: [
      'The cheapest drives where life and efficiency do not matter: a brushed motor on a switch costs less.',
      'Holding a load at standstill or positioning with a plain six-step driver — use a servo with an encoder, or a stepper.',
      'Loaded starts with sensorless control (conveyors, hoists): choose Hall sensors or an encoder.'
    ],
    check: [
      'That motor and driver match: voltage, continuous and peak current, pole count, Hall type (120° or 60°) or sensorless.',
      'Rated (continuous) torque and speed at your voltage, not the peak figures.',
      'Cooling: winding temperature at your duty, and the driver\'s heat sink.',
      'Cogging and torque ripple if smooth low-speed motion matters; EMC of the PWM motor leads.'
    ]
  },
  applications: [
    'Computer and appliance fans, pumps and disk spindles: small BLDC motors with the driver built in.',
    'Cordless tools and e-bikes: high power from a battery with a long life.',
    'Industrial automation: 24/48 V BLDC gearmotors on conveyors and AGVs, set with a potentiometer or 0–10 V.',
    'Try the numbers in [the motor lab](#/tools/motorlab/dc): a six-step BLDC motor follows the same line as a DC motor.'
  ],
  history: 'Replacing the commutator with transistors was proposed soon after power transistors appeared, in the early 1960s. Brushless motors spread in disk drives and fans in the 1980s, and with neodymium–iron–boron magnets (from the mid-1980s) and cheap microcontrollers they took over tools, drones, e-bikes and appliances.',
  sources: [
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: construction, slot–pole choices, square-wave (six-step) and sine-wave drive.',
    'Hughes and Drury, *Electric Motors and Drives*: the chapter on permanent-magnet brushless motors and their drives.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: rated and continuous operation.'
  ],
  sim: 'bl-bldc-lab'
},

{
  id: 'hall-commutation', parent: 'bldc-topic', title: 'Six-step commutation with Hall sensors', level: 2,
  short: 'Three Hall sensors, 120 electrical degrees apart, divide each electrical revolution into six sectors with six codes. For each code the controller turns on one high-side and one low-side transistor, so current flows through two phases in the direction that pulls the rotor forward.',
  keywords: ['Hall sensor', 'six-step', 'trapezoidal commutation', 'block commutation', '120° commutation', 'commutation table', 'Hall code', 'inverter', 'half-bridge', 'high side', 'low side', 'phase advance', 'open collector', 'pull-up resistor', 'Hall wiring'],
  prereq: ['bldc-motor', 'hall-sensors', 'electronics:h-bridge'],
  related: ['sensorless-control', 'foc-control', 'esc-drivers', 'electronics:hall-sensors', 'physics:hall-effect', 'electronics:mosfet-switch'],
  body: `
To pull the rotor round, the stator must always magnetise the phases whose field lies about 90 electrical degrees ahead of the rotor's poles. A brushed motor gets this from its commutator. A BLDC motor gets it from three **Hall sensors** — tiny magnetic switches that read the polarity of the rotor magnets passing over them — and a table.

### Six sectors, six codes
Each Hall output is high for half an electrical revolution and low for the other half. With the sensors 120 electrical degrees apart the three outputs change one at a time, every 60°, giving six codes per electrical revolution; 000 and 111 never occur and signal a fault. In each sector the controller turns on one **high-side** switch (connecting a phase to +) and one **low-side** switch (connecting another to −); the third phase floats. The current path steps A→B, A→C, B→C, B→A, C→A, C→B, and the stator field jumps 60° at every change.

One common arrangement (the motor's datasheet gives its own — follow it):

| Hall A B C | High side on | Low side on | Current | Floating |
|---|---|---|---|---|
| 1 0 1 | A | B | A → B | C |
| 1 0 0 | A | C | A → C | B |
| 1 1 0 | B | C | B → C | A |
| 0 1 0 | B | A | B → A | C |
| 0 1 1 | C | A | C → A | B |
| 0 0 1 | C | B | C → B | A |

To reverse, keep the codes but swap high and low (101 then drives B → A). Each phase conducts 120° positive, rests 60°, conducts 120° negative and rests 60° — hence "120° block" or **trapezoidal** commutation. The Hall edges come every $60°/p_p$ of shaft rotation ($p_p$ pole pairs): 6 per revolution for a 2-pole motor, 24 for an 8-pole one. Speed is measured from the time between edges, so at low speed the reading is coarse and the torque pulses step by step.

### Wiring
A sensored motor has eight wires: three heavy phase leads and a five-wire harness — +5 V (many sensors accept 4.5–24 V), ground, $H_A$, $H_B$, $H_C$. The sensors are usually **open-collector**: they can only pull the line low, so the driver needs pull-up resistors of 1–10 kΩ to its logic supply (most have them built in). Keep the sensor cable away from the motor leads, or twisted and shielded: the phase wires swing tens of volts in tens of nanoseconds and inject spikes that read as false edges.

Unlabelled wires can be connected 36 ways (6 phase orders × 6 Hall orders). Turn the motor slowly by hand and look at a line-to-line back-EMF and the Hall signals on an oscilloscope: with the usual alignment each Hall edge falls on a zero crossing of one line-to-line back-EMF. Many drivers have an auto-learn routine that finds the table.

### PWM, current limit and timing
Speed is set by chopping the conducting pair with PWM, typically 16–25 kHz on small drives (above hearing) and 4–10 kHz on large ones; the chopping may use the high-side switch, the low-side one, or both. The current — and so the torque — is limited by switching off whenever the shunt current passes the set value. At high speed the current needs time to build through the winding [[physics:inductance|inductance]], so some drivers **advance** the commutation by a few electrical degrees.

Even with ideal currents a six-step drive ripples: with a sinusoidal back-EMF the torque dips to $\\cos 30° = 87\\,\\%$ of its peak at each step edge ([[?sine-cosine|cosine]] of half the step), and the handover between phases adds dips or spikes of its own. The ripple, at $6p_p$ times the rotation frequency, is heard as a whine and felt at low speed. In the simulation, watch the table row light with each Hall code; then swap two Hall wires or shift the sensors and see what the rotor does.

| Fault | What you see | Check |
|---|---|---|
| Two Hall wires swapped | locks, shudders, or crawls backwards with high current | reorder the Hall wires (or the phases) |
| One Hall sensor dead | stops at one position; "Hall fault" | each output must toggle as you turn the shaft |
| Wrong 60°/120° setting | invalid codes 000/111, erratic running | the driver's sensor-type switch |
| Noise on the Hall lines | jerks and current spikes, worse under load | separate or shield the cable; small RC filters |
| Sensors shifted | hotter, weaker, faster in one direction | realign, or adjust the timing |

> [!warn] Try a new wiring combination with a low current limit and the load uncoupled: a wrong table can make the motor jump or run backwards, and even a 24 V drive can push tens of amperes into a stalled winding.

> [!key] Three Hall sensors give six codes per electrical revolution; each code selects one high-side and one low-side switch, so two phases carry current and the field steps 60° at a time ahead of the rotor.
`,
  ideas: [
    'Three Hall sensors 120 electrical degrees apart give six valid codes per electrical revolution; 000 and 111 mean a fault.',
    'Each code turns on one high-side and one low-side switch: two phases carry current, the third floats.',
    'Reversing keeps the codes and swaps the high and low sides.',
    'Hall sensors are open-collector outputs that need pull-ups and a clean, separated cable.',
    'Six-step drive ripples: about 13 % with a sinusoidal back-EMF, plus the commutation dips.'
  ],
  pitfalls: [
    'The Hall sensors sit 120° apart around the motor — They sit 120 electrical degrees apart: 120°/p_p mechanically (30° on an 8-pole motor), or that plus whole multiples of 360°/p_p.',
    'Any Hall order works, the motor just picks a direction — Most wrong orders make the field point the wrong way in some sectors: the motor locks, shudders or crawls backwards drawing high current.',
    'The Hall signals are good enough for positioning — Six edges per electrical revolution (24 per turn on an 8-pole motor) is coarse; positioning needs an encoder.'
  ],
  formulas: [
    {
      name: 'Commutation frequency',
      expr: 'fc = 6*pp*n', tex: 'f_c = 6\\,p_p\\,n',
      vars: {
        fc: { name: 'commutations (Hall edges) per second', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        pp: { name: 'pole pairs', int: true, value: 4, tex: 'p_p' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 3000 }
      },
      note: 'Six steps per electrical revolution, p_p electrical revolutions per shaft revolution. The time between Hall edges is 1/f_c.',
      stories: { fc: 'A motor with {pp} pole pairs runs at {n}. How many commutations per second does its driver make?', n: 'Hall edges arrive at {fc} on a motor with {pp} pole pairs. How fast is it turning?' }
    },
    {
      name: 'Hall sensor spacing on the shaft',
      expr: 'thm = the/pp', tex: '\\theta_m = \\dfrac{\\theta_e}{p_p}',
      vars: {
        thm: { name: 'mechanical angle between sensors', q: 'angle', unit: '°', tex: '\\theta_m' },
        the: { name: 'electrical angle between sensors', q: 'angle', unit: '°', value: 120, tex: '\\theta_e' },
        pp: { name: 'pole pairs', int: true, value: 4, tex: 'p_p' }
      },
      note: 'Any position that differs by a whole number of pole-pair pitches (360°/p_p) is equivalent.',
      stories: { thm: 'Hall sensors must sit {the} apart on a motor with {pp} pole pairs. How far apart around the stator?' }
    },
    {
      name: 'Six-step torque ripple (sinusoidal back-EMF)',
      expr: 'r = 1 - cos(dth/2)', tex: 'r = 1 - \\cos\\dfrac{\\Delta\\theta}{2}',
      vars: {
        r: { name: 'ripple, peak-to-peak as a fraction of peak', q: 'ratio', unit: '%', tex: 'r' },
        dth: { name: 'electrical width of one step', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\Delta\\theta' }
      },
      note: 'Within a step the current vector is fixed while the rotor turns through Δθ, so the torque follows a cosine from −Δθ/2 to +Δθ/2. Six-step: 60°, 13.4 %; twelve steps: 30°, 3.4 %. Commutation dips come on top.',
      stories: { r: 'A drive holds the current fixed for {dth} of rotation at a time. How large is the torque ripple on a sinusoidal-EMF motor?' }
    }
  ],
  examples: [
    {
      title: 'Placing the sensors on an 8-pole motor',
      q: 'An 8-pole motor needs Hall sensors 120 electrical degrees apart. Where do they go, how many Hall edges are there per revolution, and how often do they come at 3000 rpm?',
      steps: [
        '$p_p = 4$, so $\\theta_m = 120°/4 = 30°$ between sensors (or 30° plus multiples of 90°).',
        'Edges per revolution: $6 \\times 4 = 24$, one every 15°.',
        'At 3000 rpm (50 rev/s): $f_c = 24 \\times 50 = 1200$ edges per second, one every 833 µs.'
      ],
      a: '30° apart; 24 edges per turn; one every 0.83 ms at 3000 rpm.'
    },
    {
      title: 'Reading the table',
      q: 'The Hall code is 110 (A = 1, B = 1, C = 0). With the table above, which switches are on for forward running, which phase floats, and what comes next?',
      steps: [
        'Code 110: B high side, C low side; current flows B → C, A floats.',
        'Forward, the next code is 010: B high, A low (B → A), C floats.',
        'For reverse, code 110 drives C → B instead.'
      ],
      a: 'B+ and C−, A floating; next 010 (B → A).'
    },
    {
      title: 'Speed from the Hall signals',
      q: 'On a 4-pole motor the time between successive Hall edges is 2.5 ms. How fast is it turning?',
      steps: [
        '$f_c = 1/0.0025 = 400$ edges per second.',
        '$n = f_c/(6 p_p) = 400/(6 \\times 2) = 33.3$ rev/s $= 2000$ rpm.'
      ],
      a: '2000 rpm.'
    }
  ],
  quiz: [
    { q: 'With 120°-spaced Hall sensors, which codes never occur in a healthy motor?', choices: ['000 and 111', '101 and 010', '100 and 011', 'None — all eight occur'], a: 0, why: 'Each sensor is high for 180° and they are 120° apart, so at least one is always high and at least one low.' },
    { q: 'How many phases carry current at any moment in six-step commutation?', choices: ['Two, in series; the third floats', 'All three', 'One', 'It alternates between one and three'], a: 0, why: 'One high-side and one low-side switch are on, so the current enters one phase and leaves through another.' },
    { q: 'The Hall wires of a new motor are connected in the wrong order. The most likely result is…', choices: ['It shudders, locks or crawls backwards drawing high current', 'It runs normally in reverse', 'Nothing — the Hall order does not matter', 'It runs at double speed'], a: 0, why: 'In some sectors the field now points behind the rotor or across it; the torque changes sign around the revolution and the rotor settles or oscillates.' },
    { q: 'Why do Hall sensor outputs need pull-up resistors?', choices: ['They are open-collector outputs that can only pull the line low', 'To limit the motor current', 'To filter the PWM', 'To set the speed'], a: 0, why: 'An open-collector output switches to ground; the pull-up provides the high level.' },
    { q: 'On a 10-pole motor the three Hall sensors sit 120° apart around the shaft.', a: false, why: '120 electrical degrees is 120/5 = 24° mechanically (or 24° plus multiples of 72°).' }
  ],
  problems: [
    { q: 'A 14-pole outrunner has Hall sensors. How many Hall edges (commutation steps) occur per shaft revolution?', answer: 42, tol: 0.001, steps: ['$p_p = 7$; six edges per electrical revolution: $6 \\times 7 = 42$.'] },
    { q: 'The time between Hall edges on an 8-pole motor is 0.5 ms. What is its speed?', answer: 5000, unit: 'rpm', tol: 0.02, steps: ['$f_c = 1/0.0005 = 2000$ Hz.', '$n = 2000/(6 \\times 4) = 83.3$ rev/s $= 5000$ rpm.'] }
  ],
  choose: {
    good: [
      'Full torque from standstill and under load: conveyors, AGV wheels, pumps with high breakaway torque, e-bikes.',
      'Low and medium speeds where a sensorless drive cannot see a back-EMF.',
      'Simple, robust drives: the commutation is a six-row table in a small driver.'
    ],
    avoid: [
      'Smooth, silent running at very low speed: the 60° steps ripple — use sinusoidal drive with an encoder.',
      'Positioning: six edges per electrical revolution is coarse feedback — add an encoder (a servo).',
      'Hot, wet or cramped motors where the sensor wiring is a liability — go sensorless if the load allows.'
    ],
    check: [
      'The Hall type (120° or 60° spacing) and supply voltage the driver expects.',
      'The motor\'s commutation table and direction convention against the driver\'s.',
      'Pull-ups, cable length and routing; shielded cable beyond a metre or two.',
      'The driver\'s pole-pair setting if it reports speed from the Hall signals.'
    ]
  },
  applications: [
    'Industrial 24/48 V BLDC gearmotors with Hall sensors: conveyors, packaging machines, AGVs.',
    'E-bike and scooter hub motors: Hall sensors for a smooth, strong start from rest.',
    'Sensor wiring and NPN/PNP logic are drawn in [the wiring diagrams](#/tools/wiring/sensors).'
  ],
  sources: [
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: square-wave drive, Hall-sensor commutation and its timing.',
    'Hughes and Drury, *Electric Motors and Drives*: brushless DC motor drives.',
    'Hall-sensor and driver datasheets describe open-collector outputs and pull-ups; each motor\'s datasheet gives its own commutation table.'
  ],
  sim: 'bl-hall'
},

{
  id: 'sensorless-control', parent: 'bldc-topic', title: 'Sensorless control from the back-EMF', level: 2,
  short: 'Drop the Hall sensors and read the rotor position from the back-EMF of the phase that is not switched on: its voltage crosses the midpoint 30 electrical degrees before the next commutation is due. Cheap and robust — but at standstill there is no back-EMF, so the motor has to be started blind.',
  keywords: ['sensorless', 'back-EMF', 'zero crossing', 'ZCD', 'virtual neutral', 'floating phase', 'blanking', 'open-loop start', 'align', 'ramp', 'switch-over', 'desync', 'observer', 'inductance sensing', 'flying start', 'timing advance'],
  prereq: ['hall-commutation', 'back-emf', 'bldc-motor'],
  related: ['foc-control', 'esc-drivers', 'electronics:comparators', 'electronics:rc-low-pass', 'stepper-principle', 'motors-pumps-fans'],
  body: `
In six-step commutation one phase always floats. Its terminal carries no current, so its voltage is simply the star point's voltage plus that phase's back-EMF — a free position sensor. As the rotor turns, the floating phase's voltage swings from one rail towards the other and **crosses the midpoint** (the star-point voltage, or half the DC bus) exactly halfway through its floating interval: 30 electrical degrees before the next commutation is due. The controller measures the time between crossings, waits half a step (30°) and commutates. No sensors, no extra wires, nothing to fail: this is how almost every drone ESC, most fans and pumps, disk spindles and many compressors run.

### Detecting the crossing
- **A comparator per phase** compares each terminal voltage, divided down by resistors, with a *virtual neutral* made of three equal resistors, or with half the bus ([[electronics:comparators]]). Many motor-control microcontrollers have the comparators built in.
- The terminal voltage is chopped by the PWM, so it is **sampled** at the right moment of each PWM period, or **filtered** by an RC network ([[electronics:rc-low-pass]]), whose delay grows with speed and must be compensated.
- Just after each commutation the outgoing phase's current freewheels through a diode and clamps its terminal to a rail; the controller **blanks** (ignores) that part.

With $p_p$ pole pairs at speed $n$ the 30° wait is $t_{30} = 1/(12\\,p_p\\,n)$: 71 µs for a 14-pole motor at 10 000 rpm, 1.25 ms for an 8-pole motor at 500 rpm. Shortening it gives **timing advance** (typically 0–30°), which helps the current build up at high speed.

### The start-up problem
At standstill the back-EMF $E = K_e\\,\\omega$ is zero, and at low speed it drowns in noise and switch voltage drops: 0.65 V at 100 rpm for a motor with $K_e$ = 0.065 V·s/rad. So a sensorless drive starts **blind**:

1. **Align (park):** energise one phase pair at a limited current for 0.1–1 s; the rotor swings to a known position — possibly backwards by up to 180 electrical degrees.
2. **Open-loop ramp:** step the commutation at a rising rate with a fixed current, like a [[stepper-principle|stepper]]. The rotor follows if the ramp is gentle enough for the load's torque and inertia.
3. **Switch over:** once the back-EMF is big enough — typically at 5–15 % of full speed — the zero-crossing loop takes over.

With a heavy load, a large inertia or a steep ramp the rotor falls behind the stepping field, **desynchronises**, and the drive stops and retries: the twitch-twitch-spin of a model motor under load, or a pump that will not start with debris in its impeller. A fan already windmilling is best caught on the fly: the drive listens to its back-EMF first and joins in (**flying start**).

Better methods exist. **Inductance sensing** injects short voltage pulses whose current rise depends on the rotor angle (through saliency or iron saturation) and finds the position without a twitch; **observers** estimate the flux from measured voltages and currents, and observer-based [[foc-control|sensorless FOC]] runs down to a few per cent of rated speed. True torque at zero speed needs high-frequency injection into a salient rotor, or a sensor.

| Symptom | Cause | Remedy |
|---|---|---|
| Twitches and restarts, never runs | ramp too fast, start current too low, load too high | slower ramp, more start current, unload the start |
| Starts, then stalls at switch-over | back-EMF still too small | switch over later; check the divider and leads |
| Loses sync on a throttle or load step | acceleration faster than the loop follows | limit the throttle slew rate; more timing advance |
| Rough and hot at low speed | back-EMF near the noise level | keep above the minimum speed or add sensors |

In the simulation, press *Start*: during the ramp the rotor lags the stepping field; make the ramp steep or the load heavy and it slips and restarts. After switch-over the scope shows the floating phase crossing the neutral and the commutation 30° later.

> [!warn] During alignment and failed starts the rotor may move backwards by up to half an electrical revolution and restart without warning. Do not use sensorless drives where reverse motion or an unexpected restart can harm people or product (lifting, clamping, cutting) without mechanical protection.

> [!key] The floating phase's back-EMF crosses the neutral 30° before the next commutation — a free position sensor above roughly a tenth of full speed. Below that the motor is started open-loop, so sensorless suits fans, pumps and propellers, not loaded starts.
`,
  ideas: [
    'The floating phase shows the back-EMF, which crosses the neutral 30 electrical degrees before the next commutation.',
    'The controller times the last step and waits half of it after each zero crossing; shortening the wait is timing advance.',
    'At standstill there is no back-EMF: the motor is aligned, ramped open-loop like a stepper, then switched to closed loop.',
    'Heavy load, large inertia or a steep ramp make the open-loop start fail (desync and retry).',
    'Observers and inductance sensing extend sensorless control towards zero speed.'
  ],
  pitfalls: [
    'Sensorless means less capable only in cost — It also means no torque control at standstill and an uncertain start: a sensorless drive cannot hold a load or start a jammed pump.',
    'More start current always fixes a failed start — Beyond the motor\'s and driver\'s limits it only heats the winding; a gentler ramp or a lighter start load often matters more.',
    'The zero crossing is the moment to commutate — It comes 30° early; commutating at the crossing gives 30° of advance, more current and less torque.'
  ],
  formulas: [
    {
      name: 'The 30° wait after a zero crossing',
      expr: 't = 1/(12*pp*n)', tex: 't_{30} = \\dfrac{1}{12\\,p_p\\,n}',
      vars: {
        t: { name: 'delay from zero crossing to commutation', q: 'time', unit: 'µs', tex: 't_{30}' },
        pp: { name: 'pole pairs', int: true, value: 7, tex: 'p_p' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 10000 }
      },
      note: 'One electrical revolution lasts 1/(p_p n); a step is a sixth of that and the wait half a step. Timing advance shortens the wait.',
      stories: { t: 'A motor with {pp} pole pairs runs at {n}. How long after a zero crossing is the next commutation due?' }
    },
    {
      name: 'Back-EMF available for detection',
      expr: 'E = Ke*w', tex: 'E = K_e\\,\\omega',
      vars: {
        E: { name: 'line-to-line back-EMF', q: 'voltage', unit: 'V' },
        Ke: { name: 'back-EMF constant', q: 'kemf', unit: 'V·s/rad', value: 0.065, tex: 'K_e' },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 300, tex: '\\omega' }
      },
      note: 'Solve for ω to find the lowest speed at which a detector with a given threshold can work.',
      stories: { E: 'A motor with {Ke} turns at {w}. How much back-EMF does the detector see?', w: 'The detector needs {E} to work reliably on a motor with {Ke}. What is the lowest closed-loop speed?' }
    },
    {
      name: 'Fastest open-loop ramp',
      expr: 'a = (Ts - TL)/J', tex: '\\alpha = \\dfrac{T_s - T_L}{J}',
      vars: {
        a: { name: 'largest ramp acceleration', q: 'angacc', unit: 'rpm/s', tex: '\\alpha' },
        Ts: { name: 'torque at the start current', q: 'torque', unit: 'N·m', value: 0.2, tex: 'T_s' },
        TL: { name: 'load torque (friction, breakaway)', q: 'torque', unit: 'N·m', value: 0.08, tex: 'T_L' },
        J: { name: 'inertia of rotor and load', q: 'inertia', unit: 'kg·cm²', value: 4 }
      },
      note: 'An upper bound: the rotor lags the stepping field and only part of the peak torque is available on average, so program the ramp at half of this or less.',
      stories: { a: 'The start current gives {Ts}; the load needs {TL}; the rotor and load have {J}. How fast may the open-loop ramp accelerate at most?' }
    }
  ],
  examples: [
    {
      title: 'How long to wait',
      q: 'A 14-pole drone motor spins at 12 000 rpm. How long is a commutation step, and how long does the ESC wait after a zero crossing — without advance and with 15° of advance?',
      steps: [
        '$f_e = 7 \\times 12\\,000/60 = 1400$ Hz; a step is $1/(6 \\times 1400) = 119$ µs.',
        'The 30° wait is half a step: 60 µs.',
        'With 15° of advance it waits only 15°: 30 µs.'
      ],
      a: 'Steps of 119 µs; wait 60 µs, or 30 µs with 15° advance.'
    },
    {
      title: 'The lowest closed-loop speed',
      q: 'A detector needs at least 1 V of line-to-line back-EMF. What is the lowest closed-loop speed for (a) an industrial motor with $K_e$ = 0.065 V·s/rad and no-load speed 3500 rpm, (b) a drone motor with $K_v$ = 2300 rpm/V on 16 V?',
      steps: [
        '(a) $\\omega = 1/0.065 = 15.4$ rad/s = 147 rpm — about 4 % of 3500 rpm.',
        '(b) $K_e = 60/(2\\pi \\times 2300) = 0.00415$ V·s/rad, so $\\omega = 241$ rad/s = 2300 rpm — about 6 % of the $2300 \\times 16 = 36\\,800$ rpm no-load speed.'
      ],
      a: '(a) about 150 rpm; (b) about 2300 rpm: fast, low-voltage-constant motors need more speed before the back-EMF is readable.'
    },
    {
      title: 'Can it start the conveyor?',
      q: 'A sensorless drive starts at 3 A on a motor with $K_t$ = 0.065 N·m/A. The conveyor needs 0.12 N·m to turn and the total inertia is 4 kg·cm². What is the fastest possible ramp, and how long must it take to reach a 350 rpm switch-over speed?',
      steps: [
        'Start torque $0.065 \\times 3 = 0.195$ N·m; spare torque $0.195 - 0.12 = 0.075$ N·m.',
        '$\\alpha = 0.075/(4 \\times 10^{-4}) = 187$ rad/s² $= 1790$ rpm/s — an upper bound.',
        'Reaching 350 rpm takes at least $350/1790 = 0.2$ s; programmed with margin, 0.4–0.5 s. A ramp set to 5000 rpm/s would fail every time.'
      ],
      a: 'At most about 1800 rpm/s: a ramp of 0.4–0.5 s to switch-over — and a loaded conveyor is better served by Hall sensors.'
    }
  ],
  quiz: [
    { q: 'Where does a sensorless six-step controller get the rotor position?', choices: ['From the back-EMF of the floating (unpowered) phase', 'From the current in the two conducting phases', 'From the PWM duty', 'From the supply voltage'], a: 0, why: 'The floating phase carries no current, so its terminal voltage shows its back-EMF directly.' },
    { q: 'The zero crossing of the floating phase comes how long before the next commutation?', choices: ['30 electrical degrees', '60 electrical degrees', '90 electrical degrees', 'At the same instant'], a: 0, why: 'The crossing is in the middle of the 60° floating interval, so half a step (30°) remains.' },
    { q: 'Why can a basic sensorless drive not hold a load at standstill?', choices: ['At zero speed there is no back-EMF to read the position from', 'The MOSFETs cannot carry DC', 'The magnets demagnetise', 'The PWM frequency is too low'], a: 0, why: 'The position information is the back-EMF, which is proportional to speed.' },
    { q: 'A sensorless ESC can start a motor whose propeller is blocked, provided its current limit is high enough.', a: false, why: 'A blocked rotor never follows the open-loop ramp; the drive desyncs and retries, heating the winding.' },
    { q: 'A sensorless pump will not start after standing for a week, but starts once the shaft is turned by hand. The likely cause?', choices: ['The breakaway torque of the dry seal exceeds what the open-loop start gives', 'A Hall sensor failed', 'The back-EMF constant changed', 'The PWM frequency drifted'], a: 0, why: 'Seals and bearings stick after standing; the blind start has a limited torque and gives up.' }
  ],
  problems: [
    { q: 'An 8-pole motor runs at 1500 rpm. How long is the 30° wait after a zero crossing?', answer: 0.833, unit: 'ms', tol: 0.02, steps: ['$p_p = 4$, $n = 25$ rev/s.', '$t_{30} = 1/(12 \\times 4 \\times 25) = 0.833$ ms.'] },
    { q: 'A motor has $K_e$ = 0.02 V·s/rad and its detector needs 0.5 V. What is the lowest closed-loop speed?', answer: 239, unit: 'rpm', tol: 0.02, steps: ['$\\omega = 0.5/0.02 = 25$ rad/s.', '$n = 25 \\times 60/(2\\pi) = 239$ rpm.'] }
  ],
  choose: {
    good: [
      'Fans, blowers, pumps and propellers: light starting load, continuous running at speed.',
      'Sealed, hot or cramped motors (compressors, submersible pumps) where sensors and their wires would fail.',
      'Lowest cost and fewest wires: three leads and nothing else.'
    ],
    avoid: [
      'Loaded starts and high breakaway torque: conveyors, hoists, vehicles starting on a slope.',
      'Holding position or running very slowly.',
      'Machines where a backwards twitch or an automatic restart is unacceptable.'
    ],
    check: [
      'The controller\'s minimum closed-loop speed against your lowest working speed.',
      'Start-up settings — align time, start current, ramp rate — against your load\'s inertia and friction.',
      'What happens on a failed start (retries, fault output) and with a windmilling load (flying start).',
      'The highest electrical frequency the controller can track (pole pairs × rpm).'
    ]
  },
  applications: [
    'Drone and model ESCs: sensorless six-step or observer-based FOC on every motor.',
    'Circulating pumps, fans and range hoods: sensorless BLDC with a soft start and a flying start.',
    'Disk spindles and compressors: sealed motors where sensors would not survive.'
  ],
  sources: [
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: back-EMF sensing and sensorless drive.',
    'Hughes and Drury, *Electric Motors and Drives*: brushless motor drives and position sensing.',
    'Microcontroller application notes on sensorless BLDC control describe zero-crossing detection, blanking and start-up ramps (generic practice).'
  ],
  sim: 'bl-sensorless'
},

{
  id: 'foc-control', parent: 'bldc-topic', title: 'Field-oriented control', level: 3,
  short: 'Measure the phase currents, turn them mathematically into two steady quantities seen from the rotor — the flux-making current id and the torque-making current iq — control each with its own loop, and turn the result back into three sinusoidal voltages. The motor runs smoothly, quietly and efficiently, with full torque at any speed.',
  keywords: ['FOC', 'field-oriented control', 'vector control', 'Clarke transform', 'Park transform', 'd-q axes', 'id', 'iq', 'space-vector PWM', 'SVPWM', 'current loop', 'PI controller', 'field weakening', 'MTPA', 'observer', 'encoder offset'],
  prereq: ['bldc-motor', 'hall-commutation', 'rotating-field'],
  related: ['pmsm-motor', 'sensorless-control', 'vector-control-vfd', 'servo-drives', 'pid-control', 'incremental-encoders', 'math:phasors', 'math:linear-transformations'],
  body: `
Six-step drive pushes current into two phases at a time and lets the field jump 60°. **Field-oriented control** (FOC, vector control) gives the motor what it really wants: a stator current vector held at exactly 90 electrical degrees to the rotor's magnet flux, all the time, made by sinusoidal currents in all three phases. Every ampere then makes torque, and the torque is as smooth as the current.

### Seen from the rotor
The three phase currents (which add up to zero) are the [[?components|components]] of one current [[?vector|vector]] turning at the electrical frequency. Two transformations make it easy to control:

- **Clarke:** project the currents on two fixed perpendicular axes: $i_\\alpha = i_a$, $i_\\beta = (i_a + 2\\,i_b)/\\sqrt 3$.
- **Park:** turn those axes with the rotor through its electrical angle $\\theta_e$ ([[math:linear-transformations|a rotation]]):

$$i_d = i_\\alpha\\cos\\theta_e + i_\\beta\\sin\\theta_e, \\qquad i_q = -i_\\alpha\\sin\\theta_e + i_\\beta\\cos\\theta_e$$

In steady running $i_d$ and $i_q$ are **constant** — DC values that two ordinary PI controllers regulate easily. $i_d$ lies along the magnet flux; in a surface-magnet motor it makes no torque and is held at zero (or made negative to weaken the field). $i_q$, at 90°, makes the torque:

$$T = \\tfrac{3}{2}\\,p_p\\left[\\psi_m\\,i_q + (L_d - L_q)\\,i_d\\,i_q\\right]$$

with $\\psi_m$ the magnet flux linkage. The controllers' outputs $v_d$, $v_q$ are turned back (inverse Park and Clarke) and made by the inverter with **space-vector PWM**, which gets a phase-voltage [[?amplitude|amplitude]] of up to $V_{dc}/\\sqrt 3$ from the DC bus — 15 % more than plain sine PWM ($V_{dc}/2$).

### Loops and what they need
| Loop | Typical rate | Typical bandwidth | Sets |
|---|---|---|---|
| Current ($i_d$, $i_q$) | 8–32 kHz, once per PWM period | 0.5–3 kHz | the voltages |
| Speed | 1–8 kHz | 20–300 Hz | the $i_q$ reference |
| Position (servos) | 1–4 kHz | 5–100 Hz | the speed reference |

FOC needs the **rotor angle** accurately: an encoder or resolver (servos, robots, traction), or a sensorless **observer** estimating the flux from voltages and currents (fans, pumps, compressors, washing machines, drone controllers running FOC firmware). It needs two or three **current sensors** — shunts in the low-side legs or isolated Hall-effect sensors — and a processor that runs the loop every PWM period. An **angle offset** is costly: with an error $\\varepsilon$ only $\\cos\\varepsilon$ of the current makes torque — 87 % at 30°, nothing at 90°, and beyond that the motor runs away or backwards. Drives therefore run an encoder-alignment routine at commissioning.

| | Six-step (Hall) | FOC |
|---|---|---|
| Phase currents | 120° blocks | sinusoidal |
| Torque ripple | 5–15 % | 1–3 % (cogging aside) |
| Acoustic noise | whine at the steps | quiet |
| Above base speed | little | field weakening with $i_d < 0$ |
| Needs | 3 Hall sensors, simple logic | current sensing, angle, a faster processor |

**Field weakening:** at high speed the back-EMF approaches the bus voltage and current can no longer be pushed in. A negative $i_d$ opposes the magnet flux and lowers the back-EMF, so the motor runs faster at reduced torque — used in traction and spindles. **Maximum torque per ampere (MTPA):** in interior-magnet motors a negative $i_d$ also adds reluctance torque ([[pmsm-motor]]).

The simulation shows the three sinusoidal currents, the current vector in the α–β plane turning with the rotor, and the same vector in the rotor's d–q frame — standing still. Add an angle error and the torque falls as its cosine; switch to six-step and the vector jumps.

> [!tip] When a new servo or FOC drive vibrates or runs away on its first start, suspect the angle offset or the phase order before the tuning: rerun the encoder alignment with the load uncoupled.

> [!key] FOC turns three AC currents into two DC ones seen from the rotor: $i_q$ makes torque, $i_d$ controls the flux. Hold $i_q$ at 90° to the magnets and every ampere does work.
`,
  ideas: [
    'Clarke and Park transforms turn the three phase currents into id and iq, which are constant in steady running.',
    'iq makes the torque; id controls the flux — zero in surface-magnet motors, negative for field weakening or MTPA.',
    'Two PI current loops, a speed loop and (in servos) a position loop are nested, fastest inside.',
    'FOC needs an accurate rotor angle: an angle error ε leaves only cos ε of the current making torque.',
    'Space-vector PWM gets up to Vdc/√3 per phase, 15 % more than sine PWM.'
  ],
  pitfalls: [
    'FOC makes a motor stronger — It makes the same torque per ampere as a perfectly timed drive, but smoother and at every angle; the peak torque is still set by the current limit and the magnets.',
    'A sensorless FOC drive works like a servo at standstill — Observers need back-EMF; most lose the angle below a few per cent of rated speed unless the rotor is salient and the drive injects a test signal.',
    'id should always be zero — Only for surface-magnet motors below base speed; interior-magnet motors use negative id for extra torque, and every PM motor for field weakening.'
  ],
  formulas: [
    {
      name: 'Torque of a surface-magnet motor',
      expr: 'T = 1.5*pp*psi*iq', tex: 'T = \\tfrac{3}{2}\\,p_p\\,\\psi_m\\,i_q',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        pp: { name: 'pole pairs', int: true, value: 4, tex: 'p_p' },
        psi: { name: 'magnet flux linkage (peak, per phase)', q: 'flux', unit: 'mWb', value: 10.8, tex: '\\psi_m' },
        iq: { name: 'q-axis current (peak phase amplitude)', q: 'current', unit: 'A', value: 5, tex: 'i_q' }
      },
      note: 'Amplitude-invariant transforms: iq equals the peak phase current when id = 0. Datasheets often give Kt per ampere rms, which is √2 times larger than per ampere peak.',
      stories: { T: 'A motor with {pp} pole pairs and a flux linkage of {psi} carries {iq} on the q-axis. What torque does it make?', iq: 'A motor with {pp} pole pairs and {psi} must give {T}. What q-axis current is needed?' }
    },
    {
      name: 'Park transform: the torque current',
      expr: 'iq = -ialpha*sin(th) + ibeta*cos(th)', tex: 'i_q = -i_\\alpha\\sin\\theta_e + i_\\beta\\cos\\theta_e',
      vars: {
        iq: { name: 'q-axis current', q: 'current', unit: 'A', signed: true, tex: 'i_q' },
        ialpha: { name: 'α current (= phase a current)', q: 'current', unit: 'A', value: 2.5, signed: true, tex: 'i_\\alpha' },
        ibeta: { name: 'β current', q: 'current', unit: 'A', value: 4.33, signed: true, tex: 'i_\\beta' },
        th: { name: 'rotor electrical angle', q: 'angle', unit: '°', value: 300, min: 0, max: 360, tex: '\\theta_e' }
      },
      note: 'Rotating the fixed α–β axes with the rotor. The companion is i_d = i_α cos θ_e + i_β sin θ_e.',
      stories: { iq: 'The Clarke transform gives {ialpha} and {ibeta} while the rotor is at {th}. How much of the current makes torque?' }
    },
    {
      name: 'Largest phase voltage with space-vector PWM',
      expr: 'Vph = Vdc/sqrt(3)', tex: '\\hat V_{ph} = \\dfrac{V_{dc}}{\\sqrt 3}',
      vars: {
        Vph: { name: 'peak phase voltage', q: 'voltage', unit: 'V', tex: '\\hat V_{ph}' },
        Vdc: { name: 'DC bus voltage', q: 'voltage', unit: 'V', value: 48, tex: 'V_{dc}' }
      },
      note: 'The line-to-line peak then equals the bus voltage. Sine-triangle PWM reaches only V_dc/2 per phase.',
      stories: { Vph: 'A drive runs from a {Vdc} bus. What peak phase voltage can space-vector PWM give?', Vdc: 'A motor needs {Vph} peak per phase at top speed. What bus voltage does the drive need?' }
    },
    {
      name: 'Torque lost to an angle error',
      expr: 'T = T0*cos(eps)', tex: 'T = T_0\\cos\\varepsilon',
      vars: {
        T: { name: 'torque with the error', q: 'torque', unit: 'N·m' },
        T0: { name: 'torque with the correct angle', q: 'torque', unit: 'N·m', value: 0.32, tex: 'T_0' },
        eps: { name: 'electrical angle error', q: 'angle', unit: '°', value: 30, min: 0, max: 180, tex: '\\varepsilon' }
      },
      note: 'For a surface-magnet motor at the same current. Mechanical offset × pole pairs = electrical error: 3° on a 10-pole motor is 15° electrical.',
      stories: { T: 'The encoder offset is wrong by {eps} electrical. The motor should give {T0}. What does it give at the same current?' }
    }
  ],
  examples: [
    {
      title: 'Torque from the q current',
      q: 'A servo motor has 5 pole pairs and a magnet flux linkage of 0.02 Wb. What torque does 8 A on the q-axis give, and what is its torque constant per ampere peak and per ampere rms?',
      steps: [
        '$T = 1.5 \\times 5 \\times 0.02 \\times 8 = 1.2$ N·m.',
        '$K_t = 1.5 \\times 5 \\times 0.02 = 0.15$ N·m per ampere peak.',
        'Per ampere rms: $0.15 \\times \\sqrt 2 = 0.21$ N·m/A$_{rms}$ — the figure servo datasheets usually print.'
      ],
      a: '1.2 N·m; 0.15 N·m/A peak = 0.21 N·m/A rms.'
    },
    {
      title: 'Clarke and Park by hand',
      q: 'At one instant $i_a$ = 2.5 A, $i_b$ = 2.5 A, $i_c$ = −5 A, and the rotor\'s electrical angle is 300°. Find $i_d$ and $i_q$.',
      steps: [
        'Clarke: $i_\\alpha = 2.5$ A, $i_\\beta = (2.5 + 2 \\times 2.5)/\\sqrt 3 = 4.33$ A — a 5 A vector at 60°.',
        'Park: $i_d = 2.5\\cos 300° + 4.33\\sin 300° = 1.25 - 3.75 = -2.5$ A.',
        '$i_q = -2.5\\sin 300° + 4.33\\cos 300° = 2.17 + 2.17 = 4.33$ A.'
      ],
      a: 'i_d = −2.5 A, i_q = 4.33 A: the 5 A vector sits 120° ahead of the d-axis — torque plus some field weakening.'
    },
    {
      title: 'How fast can it go on 48 V?',
      q: 'A motor with 4 pole pairs and $\\psi_m$ = 0.0108 Wb runs from a 48 V bus. Ignoring the resistance and inductance drops, at what speed does its back-EMF use up the available voltage?',
      steps: [
        'Available peak phase voltage: $48/\\sqrt 3 = 27.7$ V.',
        'Back-EMF peak per phase: $\\psi_m p_p \\omega = 0.0432\\,\\omega$.',
        '$\\omega = 27.7/0.0432 = 641$ rad/s $= 6120$ rpm; with the drops, the base speed is lower, and field weakening is needed beyond it.'
      ],
      a: 'About 6100 rpm at most without field weakening.'
    }
  ],
  quiz: [
    { q: 'In steady running, what do $i_d$ and $i_q$ look like?', choices: ['Constant (DC) values', 'Sine waves at the electrical frequency', 'Square waves', 'Sawtooth waves'], a: 0, why: 'The Park transform turns with the rotor, so a current vector locked to the rotor has fixed d and q components.' },
    { q: 'In a surface-magnet motor, which current makes the torque?', choices: ['i_q, at 90° to the magnet flux', 'i_d, along the flux', 'Both equally', 'Neither — the voltage does'], a: 0, why: 'With L_d = L_q the torque is (3/2) p_p ψ_m i_q; i_d only changes the flux.' },
    { q: 'The encoder offset is wrong by 60 electrical degrees. At the same current, the torque is…', choices: ['half', 'unchanged', 'zero', 'doubled'], a: 0, why: 'cos 60° = 0.5: half the current vector now lies along the flux.' },
    { q: 'Why can FOC run a PM motor above its base speed?', choices: ['A negative i_d weakens the effective flux, lowering the back-EMF', 'It raises the DC bus voltage', 'It turns off one phase', 'It strengthens the magnets'], a: 0, why: 'The back-EMF must stay below the voltage the inverter can make; opposing the magnet flux with i_d lowers it.' },
    { q: 'Space-vector PWM gets about 15 % more phase voltage out of the same DC bus than sine PWM.', a: true, why: 'V_dc/√3 against V_dc/2: a ratio of 1.155.' }
  ],
  problems: [
    { q: 'A PMSM with 4 pole pairs and $\\psi_m$ = 0.05 Wb must give 6 N·m with $i_d$ = 0. What $i_q$ is needed?', answer: 20, unit: 'A', tol: 0.02, steps: ['$i_q = T/(1.5 p_p \\psi_m) = 6/(1.5 \\times 4 \\times 0.05) = 20$ A.'] },
    { q: 'A drive has a 560 V DC bus. What is the largest peak phase voltage with space-vector PWM?', answer: 323, unit: 'V', tol: 0.02, steps: ['$560/\\sqrt 3 = 323$ V.'] }
  ],
  choose: {
    good: [
      'Smooth, quiet running at any speed: servos, robot joints, gimbals, e-bikes, washing machines, premium fans.',
      'Best torque per ampere and field weakening above base speed: traction, spindles.',
      'Full torque at standstill and precise torque control, together with an encoder or resolver.'
    ],
    avoid: [
      'The cheapest fan or pump where six-step or V/f control is good enough.',
      'Motors whose parameters are unknown and cannot be auto-tuned (sensorless observers need R, L and ψ).',
      'Controllers without current sensing or the processing speed for the loop rate.'
    ],
    check: [
      'Feedback: encoder or resolver resolution and the alignment routine — or the sensorless minimum speed.',
      'Motor parameters (R, L_d, L_q, ψ_m, pole pairs) entered or auto-tuned.',
      'Current, speed and position loop bandwidths against your mechanics.',
      'What the drive does on loss of feedback: fault and safe torque off.'
    ]
  },
  applications: [
    'Every modern AC servo drive and most electric-vehicle traction inverters.',
    'Direct-drive washing machines and quiet fans with sensorless FOC.',
    'Drone and e-bike controllers running FOC firmware for smoother, quieter motors.'
  ],
  history: 'Field orientation was worked out for induction motors around 1970 (by F. Blaschke and by K. Hasse in Germany); it became practical in the 1980s with microprocessors and transistor inverters, and cheap enough for fans and appliances when motor-control microcontrollers appeared in the 2000s.',
  sources: [
    'Mohan, *Electric Drives*: space vectors, d–q control and PM synchronous motor drives.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: the dq0 transformation and vector control.',
    'Hughes and Drury, *Electric Motors and Drives*: vector (field-oriented) control.',
    'IEC 61800 series, *Adjustable speed electrical power drive systems*.'
  ],
  sim: 'bl-foc'
},

{
  id: 'inrunner-outrunner', parent: 'bldc-topic', title: 'Inrunners and outrunners', level: 2,
  short: 'An inrunner has its magnets on a slim rotor inside the stator: fast, low inertia, usually geared. An outrunner spins its magnets in a bell around the stator: a bigger radius, more poles and more torque, so it turns a propeller or wheel directly at lower speed. Kv only picks the winding; size and cooling set the power.',
  keywords: ['inrunner', 'outrunner', 'outer rotor', 'inner rotor', 'bell', 'Kv', '12N14P', 'stator size', '2212', 'hub motor', 'gimbal motor', 'air-gap shear stress', 'torque per rotor volume', 'motor constant', 'Km'],
  prereq: ['bldc-motor', 'torque-and-power'],
  related: ['bldc-selection', 'pancake-motors', 'esc-drivers', 'torque-motors', 'motors-robots-drones', 'aerodynamics:propellers'],
  body: `
Every electric motor makes torque the same way: a magnetic **shear stress** $\\sigma$ acts on the surface of the air gap, and torque is that force times the radius. For a rotor of radius $r$ and active length $L$,

$$T = 2\\pi\\,r^2 L\\,\\sigma$$

The stress is limited by the magnets and by how much current the winding carries without overheating. Design texts quote torque per rotor volume, which is $2\\sigma$: roughly $\\sigma$ = 3–7 kPa for small enclosed motors, 4–15 kPa for industrial motors, 8–25 kPa for servomotors, 15–40 kPa for aerospace designs and much more with liquid cooling. Because torque grows with the **square of the radius**, where the air gap sits matters more than anything.

### Inrunner
The rotor — magnets on a shaft — turns inside the stator, which is pressed into the housing. The gap radius is small, so torque per kilogram is modest, but the rotor inertia is tiny and the magnets are held by the rotor itself (often under a sleeve), allowing 20 000–100 000 rpm. Inrunners usually have 2 or 4 poles to keep the electrical frequency down at such speeds; model inrunners run at 1000–6000 rpm/V. The winding touches the housing, so heat escapes well; the case can be finned or water-jacketed. Uses: RC cars and boats, ducted fans, power tools, spindles, blowers, pumps — often through a gearbox to trade speed for torque.

### Outrunner
The wound stator sits in the middle; the **magnets line the inside of a steel bell** that spins round it. In the same outside diameter the gap is at a larger radius, and there is room for many poles — the classic model layout has 12 stator teeth and 14 magnets ("12N14P"), large ones 24N28P or more. More poles mean thinner back iron, more torque at low speed and a lower Kv (roughly 100–3000 rpm/V, the tiniest drone motors more), so the propeller, wheel or fan sits directly on the bell. The price: higher rotor inertia, an exposed spinning case, bearings carried on one side, and cooling that depends on air drawn through the bell. Model outrunners are named by their stator: a "2212" has a stator 22 mm across and 12 mm tall.

| | Inrunner | Outrunner |
|---|---|---|
| Rotor | inside, small radius | outside bell, larger radius |
| Poles | 2–4 (up to 8–10) | 12–28 and more |
| Speed | 20 000–100 000 rpm | 1000–15 000 rpm |
| Torque per kg | lower — usually geared | higher — direct drive |
| Rotor inertia | low | higher |
| Cooling | stator against the case | air through the bell |
| Typical | spindles, blowers, RC cars, tools | propellers, drones, hub motors, fans |

Hub motors (e-bikes, scooters, robot wheels), ceiling fans, direct-drive washing machines and gimbal motors are all outrunners: many poles and a large radius make torque at low speed without a gearbox.

### Kv is the winding, not the size
The same stator can be wound with few turns of thick wire (high Kv, low resistance) or many turns of thin wire (low Kv, high resistance). Kv scales as $1/N$ and the resistance as $N^2$, so for a given torque the copper loss is **the same**: the winding decides only which voltage and current the motor wants. The figure of merit is the **motor constant** $K_m = K_t/\\sqrt R$, the torque per [[?square-root|square root]] of copper loss: compare motors by size and $K_m$, then pick the winding (Kv) for your voltage.

In the simulation, put an inrunner (through its gearbox) and an outrunner (direct) on the same propeller and compare speed, current, efficiency and heating; then give the outrunner too high a Kv for its battery and watch the current climb.

> [!warn] An outrunner's bell and a propeller are exposed rotating parts: guard them, and remove propellers when you set up or test on the bench — a motor can start as soon as its controller arms.

> [!key] Torque grows with the square of the gap radius: outrunners put the magnets outside for torque and direct drive; inrunners keep them inside for speed and low inertia. Kv only chooses the winding — compare motors by size and $K_m$.
`,
  ideas: [
    'Torque is air-gap shear stress × gap area × radius: T = 2πr²Lσ, so it grows with the square of the gap radius.',
    'Inrunners: small radius, low inertia, high speed, few poles, usually geared.',
    'Outrunners: magnets in an outer bell, larger radius, many poles, lower Kv, direct drive.',
    'Kv scales as 1/N and resistance as N², so the copper loss for a given torque does not depend on the winding.',
    'Compare motors by size and Km = Kt/√R; choose Kv to suit the voltage.'
  ],
  pitfalls: [
    'An outrunner is always better because it has more torque — It also has more inertia, an exposed rotor and weaker cooling in still air; at high speed or through a gearbox an inrunner may be the better machine.',
    'A higher Kv gives more power — With the same size, Kv changes the voltage and current, not the power; on a fixed battery and propeller a higher Kv makes the motor spin faster and draw far more current.',
    '"2212" means 22 mm long and 12 mm wide — It is the stator diameter (22 mm) and stator height (12 mm), a trade convention rather than a standard.'
  ],
  formulas: [
    {
      name: 'Torque from air-gap shear stress',
      expr: 'T = 2*pi*r^2*L*sigma', tex: 'T = 2\\pi\\,r^2 L\\,\\sigma',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        r: { name: 'air-gap radius', q: 'length', unit: 'mm', value: 17.5 },
        L: { name: 'active (stack) length', q: 'length', unit: 'mm', value: 20 },
        sigma: { name: 'air-gap shear stress', q: 'pressure', unit: 'kPa', value: 10, tex: '\\sigma' }
      },
      note: 'σ is the average tangential magnetic stress on the gap surface, limited by the magnets and by the winding\'s heating (a few kPa for small enclosed motors, tens of kPa for cooled high-performance ones).',
      stories: { T: 'A motor has an air gap of radius {r} and {L} long, working at {sigma}. What torque does it give?', r: 'A motor {L} long working at {sigma} must give {T}. What air-gap radius does it need?' }
    },
    {
      name: 'Motor constant',
      expr: 'Km = Kt/sqrt(R)', tex: 'K_m = \\dfrac{K_t}{\\sqrt{R}}',
      vars: {
        Km: { name: 'motor constant', q: false, unit: 'N·m/√W', tex: 'K_m' },
        Kt: { name: 'torque constant', q: 'ktorque', unit: 'N·m/A', value: 0.025, tex: 'K_t' },
        R: { name: 'line-to-line resistance', q: 'resistance', unit: 'Ω', value: 0.08 }
      },
      note: 'Independent of the number of turns: rewinding changes K_t and √R in proportion. Use the same resistance convention (line-to-line) for every motor you compare.',
      stories: { Km: 'A motor has {Kt} and {R} between its terminals. What is its motor constant?' }
    },
    {
      name: 'Copper loss at a torque',
      expr: 'P = (T/Km)^2', tex: 'P_{Cu} = \\left(\\dfrac{T}{K_m}\\right)^2',
      vars: {
        P: { name: 'copper loss', q: 'power', unit: 'W', tex: 'P_{Cu}' },
        T: { name: 'torque', q: 'torque', unit: 'N·m', value: 0.4 },
        Km: { name: 'motor constant', q: false, unit: 'N·m/√W', value: 0.0884, tex: 'K_m' }
      },
      note: 'The heat the winding must shed to make a torque (the no-load current\'s share is ignored): a quick way to compare motors for continuous duty.',
      stories: { P: 'A motor with Km = {Km} gives {T} continuously. How much heat does its winding make?', T: 'A motor with Km = {Km} can shed {P} of copper loss. What continuous torque can it give?' }
    }
  ],
  examples: [
    {
      title: 'Inside or outside?',
      q: 'Two motors both 50 mm across and 20 mm long work at the same shear stress of 8 kPa. The inrunner\'s gap is at 12 mm radius, the outrunner\'s at 20 mm. Compare their torques.',
      steps: [
        'Inrunner: $T = 2\\pi \\times 0.012^2 \\times 0.02 \\times 8000 = 0.145$ N·m.',
        'Outrunner: $T = 2\\pi \\times 0.020^2 \\times 0.02 \\times 8000 = 0.402$ N·m.',
        'Ratio $(20/12)^2 = 2.8$.'
      ],
      a: 'The outrunner gives about 2.8 times the torque in the same can — at the cost of more inertia.'
    },
    {
      title: 'Same stator, two windings',
      q: 'A stator is wound as 380 rpm/V with 0.08 Ω, or with half the turns as 760 rpm/V with 0.02 Ω. Compare the current and copper loss at 0.4 N·m.',
      steps: [
        '380 rpm/V: $K_t = 9.549/380 = 0.0251$ N·m/A; $I = 0.4/0.0251 = 15.9$ A; loss $15.9^2 \\times 0.08 = 20.3$ W.',
        '760 rpm/V: $K_t = 0.0126$ N·m/A; $I = 31.8$ A; loss $31.8^2 \\times 0.02 = 20.3$ W.',
        '$K_m = 0.0251/\\sqrt{0.08} = 0.0126/\\sqrt{0.02} = 0.089$ N·m/√W for both.'
      ],
      a: 'Twice the current, the same heat and the same Km: the 760 rpm/V winding suits half the battery voltage.'
    }
  ],
  quiz: [
    { q: 'Doubling the air-gap radius at the same length and shear stress multiplies the torque by…', choices: ['4', '2', '8', '√2'], a: 0, why: 'T = 2πr²Lσ: the gap area grows with r and the lever arm with r.' },
    { q: 'Why do outrunners usually have many poles?', choices: ['A large gap circumference has room for many poles, which give more torque at low speed and thinner, lighter iron', 'To raise Kv', 'To lower the electrical frequency', 'Because small magnets are cheaper'], a: 0, why: 'More poles shorten the flux path round the back iron and suit low-speed direct drive; they raise the electrical frequency.' },
    { q: 'A motor comes in 400 and 800 rpm/V windings. For the same torque, the 800 rpm/V version…', choices: ['draws twice the current with the same copper loss', 'draws half the current', 'is twice as powerful', 'has twice the resistance'], a: 0, why: 'Half the turns: half the Kt, twice the current, a quarter of the resistance — the same I²R.' },
    { q: 'Which suits a 60 000 rpm blower?', choices: ['A 2-pole inrunner', 'A 24-pole outrunner', 'A gimbal motor', 'A hub motor'], a: 0, why: 'At 60 000 rpm a 2-pole motor already switches at 1 kHz; the rotor must be small, strong and low-inertia.' },
    { q: 'For the same torque, a motor with a higher Km runs cooler.', a: true, why: 'Copper loss = (T/Km)².' }
  ],
  problems: [
    { q: 'A motor has $K_t$ = 0.05 N·m/A and a line-to-line resistance of 0.2 Ω. What is its motor constant?', answer: 0.1118, unit: 'N·m/√W', tol: 0.02, steps: ['$K_m = 0.05/\\sqrt{0.2} = 0.05/0.447 = 0.112$ N·m/√W.'] },
    { q: 'Estimate the torque of a motor with a 30 mm air-gap radius, a 40 mm stack and a shear stress of 12 kPa.', answer: 2.71, unit: 'N·m', tol: 0.02, steps: ['$T = 2\\pi \\times 0.03^2 \\times 0.04 \\times 12\\,000 = 2.71$ N·m.'] }
  ],
  choose: {
    good: [
      'Outrunner: propellers, fans, wheels and gimbals turned directly at 100–10 000 rpm, where torque per kilogram counts.',
      'Inrunner: high speed (20 000 rpm and up), a sealed or liquid-cooled housing, or a compact drive through a gearbox.',
      'Either: long life and efficiency compared with brushed motors.'
    ],
    avoid: [
      'Outrunners in dirty or wet places: the open bell draws in debris and water — choose an enclosed inrunner or a sealed hub motor.',
      'An inrunner directly on a large propeller or wheel: add a gearbox, or use an outrunner.',
      'Outrunners where the spinning case cannot be guarded.'
    ],
    check: [
      'Torque and speed at your voltage; choose Kv so the loaded speed is near 80 % of Kv × V.',
      'Km, or the copper loss at your torque, and the cooling air you really have.',
      'Pole count against the controller\'s maximum electrical frequency.',
      'Bearing loads: a propeller\'s thrust or a belt\'s pull on an overhung bell.'
    ]
  },
  applications: [
    'Multicopters and fixed-wing models: outrunners on the propellers ([[aerodynamics:multicopters]]).',
    'E-bikes and scooters: geared or direct-drive outer-rotor hub motors.',
    'Spindles, vacuum-cleaner blowers and dental tools: small high-speed inrunners.'
  ],
  sources: [
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: torque per rotor volume, sizing and the choice of slots and poles.',
    'Hughes and Drury, *Electric Motors and Drives*: specific magnetic and electric loading and what sets torque.',
    'Model-motor makers describe outrunners by stator diameter and height and by Kv — a trade convention, not a standard.'
  ],
  sim: 'bl-runner'
},

{
  id: 'esc-drivers', parent: 'bldc-topic', title: 'Electronic speed controllers (ESCs) and BLDC drivers', level: 2,
  short: 'The box between a battery or supply and a brushless motor: a microcontroller, gate drivers and six MOSFETs that commutate the motor and set its speed from a pulse, a voltage or a digital command. Model ESCs are tiny and cooled by the propeller wash; industrial BLDC drivers sit on DIN rails with terminals, DIP switches, ramps and alarm outputs.',
  keywords: ['ESC', 'electronic speed controller', 'BLDC driver', 'MOSFET', 'BEC', 'throttle', 'RC pulse', 'DShot', 'OneShot', '0–10 V', 'DIP switch', 'timing advance', 'low-voltage cut-off', 'active braking', 'heat', 'current rating', 'FG output'],
  prereq: ['hall-commutation', 'sensorless-control', 'electronics:mosfet-switch'],
  related: ['bldc-selection', 'foc-control', 'dc-motor-drivers', 'electronics:gate-drive', 'electronics:heat-sinks', 'electronics:energy-storage', 'step-dir-signals', 'emergency-stop'],
  body: `
### Inside
A BLDC controller is three half-bridges of MOSFETs (6 devices, often doubled or quadrupled in parallel for high current), their **gate drivers**, a microcontroller, a current-sense shunt, bulk capacitors across the supply and — in model ESCs — a **BEC** (battery eliminator circuit) giving 5–8 V to the receiver and servos. The microcontroller reads the command, commutates the motor ([[hall-commutation|Hall]], [[sensorless-control|sensorless]] or [[foc-control|FOC]]) and chops the switches with PWM at 8–48 kHz.

### Two worlds
| | Model / drone ESC | Industrial BLDC driver |
|---|---|---|
| Supply | 2–6 lithium cells (7.4–22.2 V nominal); large ones 12–14 cells (≈ 50 V) | 12–48 V DC (some 24–60 V); mains types 100–240 V AC, a 140–340 V DC bus |
| Current | 10–200 A continuous, more for a few seconds | 2–30 A continuous, 1.5–3 × for seconds |
| Size | 5–150 g; 20 × 20 mm boards to 100 × 50 mm cases; four-in-one boards | about 100 × 70 × 30 mm for 100–200 W; DIN-rail or panel mounting |
| Command | RC pulse 1000–2000 µs; OneShot, Multishot; DShot digital | potentiometer, 0–5 V or 0–10 V, PWM duty; RS-485 or CAN |
| Other I/O | telemetry | CW/CCW, RUN/STOP, BRAKE, ALARM, speed pulses (FG) |
| Cooling | propeller wash | heat sink, convection, sometimes a fan |

### Commands
- **RC pulse:** 1000–2000 µs repeated every 2–20 ms; 1000 µs is stop, 2000 µs full throttle. Pulse ESCs are **calibrated** to the transmitter's end points.
- **OneShot125 and Multishot** shorten the pulse (125–250 µs, 5–25 µs) for faster flight-controller updates.
- **DShot** sends a 16-bit digital word (11-bit throttle, a telemetry bit, a 4-bit checksum) at 150–600 kbit/s or more: no calibration, no drift, and commands such as reverse.
- **Industrial:** a speed pot or 0–10 V with an internal/external selector; RUN and CW/CCW as dry contacts or NPN inputs; BRAKE shorting the windings; an open-collector ALARM; an FG output of a fixed number of pulses per revolution (often one per Hall edge — check the manual).

Typical DIP switches and trimmers of a small driver (generic; the real layout is in its manual):

| Switch | Sets |
|---|---|
| SW1–SW2 | motor pole count (for the speed read-out and FG) |
| SW3 | Hall type: 120° or 60° |
| SW4 | speed input: internal pot or external 0–10 V |
| SW5 | open loop (duty) or closed loop (speed held from the Halls) |
| Trimmers | acceleration and deceleration (0.1–15 s), current limit |

Model ESCs are programmed by beeps and stick movements, a programming card or PC software: timing advance (low ≈ 0–8°, medium ≈ 15°, high ≈ 22–30° — higher for many-pole outrunners), brake, low-voltage cut-off (3.0–3.5 V per cell), direction, start power, PWM frequency, current limit.

### Heat
An ESC is typically 95–99 % efficient, but at high current the rest is real heat. Two switch positions conduct at a time, so the conduction loss is about $2\\,I^2 R_{DS(on)}$; each switching edge adds about $\\tfrac12 V I\\,t_{sw} f_{PWM}$; a linear BEC dropping 22 V to 5 V at 1 A wastes 17 W. Current ratings assume a propeller's airflow: inside a closed body derate by a third to a half, or add a heat sink. In the simulation, change the cooling and the PWM frequency and watch where the watts go.

| Problem | Cause | Remedy |
|---|---|---|
| Does not arm, keeps beeping | throttle not at minimum, not calibrated, no signal ground | calibrate; connect signal and ground |
| Cuts out under load | low-voltage cut-off, over-temperature, desync | check battery sag, cooling, timing |
| MOSFETs fail | overcurrent; spikes from long battery leads | shorter leads, a low-ESR capacitor at the ESC |

> [!warn] Lithium batteries can start fires: never short, puncture or charge them unattended. Remove propellers when programming or bench-testing. Mains-fed drivers carry 300 V or more on their DC bus, which stays charged after switch-off: only qualified people open them, after waiting and measuring. A driver's BRAKE or STOP input is not an emergency stop — safety stops follow ISO 13850 and IEC 60204-1.

> [!key] An ESC or BLDC driver is an inverter with a brain: match its voltage, continuous current at your cooling, sensor type and command signal to your motor and system.
`,
  ideas: [
    'A BLDC controller is a three-phase MOSFET bridge with gate drivers, a microcontroller, current sensing and capacitors.',
    'Model ESCs take RC pulses (1–2 ms) or digital DShot; industrial drivers take 0–10 V or a pot, with RUN, CW/CCW, BRAKE and ALARM.',
    'Conduction loss is about 2I²R_DS(on); switching loss grows with voltage, current and PWM frequency.',
    'Current ratings depend on cooling: propeller wash in models, a heat sink in machines.',
    'A driver\'s stop or brake input is a control function, not a safety function.'
  ],
  pitfalls: [
    'The ESC\'s current rating is what it can carry anywhere — It assumes the airflow and ambient of the maker\'s test; enclosed, it may need to be derated by a third to a half.',
    'A bigger ESC than needed is always safer — Oversize is fine for current, but check the voltage rating, the start-up behaviour and the minimum current it can regulate; a model ESC is not an industrial driver.',
    'Swapping two motor leads damages the ESC — On a sensorless ESC it simply reverses the motor.'
  ],
  formulas: [
    {
      name: 'Throttle from an RC pulse',
      expr: 'D = (tp - t0)/(t1 - t0)', tex: 'D = \\dfrac{t_p - t_0}{t_1 - t_0}',
      vars: {
        D: { name: 'throttle (duty)', q: 'ratio', unit: '%' },
        tp: { name: 'pulse width received', q: 'time', unit: 'µs', value: 1500, tex: 't_p' },
        t0: { name: 'pulse for zero throttle', q: 'time', unit: 'µs', value: 1000, tex: 't_0' },
        t1: { name: 'pulse for full throttle', q: 'time', unit: 'µs', value: 2000, tex: 't_1' }
      },
      note: 't₀ and t₁ are the calibrated end points; many ESCs add a dead band at the bottom.',
      stories: { D: 'An ESC calibrated to {t0}–{t1} receives {tp}. What throttle does it apply?', tp: 'An ESC calibrated to {t0}–{t1} must run at {D}. What pulse width is needed?' }
    },
    {
      name: 'MOSFET conduction loss',
      expr: 'P = 2*I^2*Rds', tex: 'P_c = 2\\,I^2 R_{DS}',
      vars: {
        P: { name: 'conduction loss', q: 'power', unit: 'W', tex: 'P_c' },
        I: { name: 'motor current', q: 'current', unit: 'A', value: 40 },
        Rds: { name: 'on-resistance of one switch position (hot)', q: 'resistance', unit: 'mΩ', value: 1, tex: 'R_{DS}' }
      },
      note: 'Two switch positions carry the current at a time in six-step drive (with synchronous freewheeling). R_DS(on) rises by about half from 25 to 100 °C.',
      stories: { P: 'An ESC with {Rds} per switch carries {I}. How much do its MOSFETs dissipate by conduction?', I: 'An ESC with {Rds} per switch may dissipate {P} by conduction. What current can it carry?' }
    },
    {
      name: 'Switching loss',
      expr: 'Psw = 0.5*V*I*tsw*f', tex: 'P_{sw} = \\tfrac12\\,V I\\,t_{sw} f',
      vars: {
        Psw: { name: 'switching loss', q: 'power', unit: 'W', tex: 'P_{sw}' },
        V: { name: 'bus voltage', q: 'voltage', unit: 'V', value: 22.2 },
        I: { name: 'motor current', q: 'current', unit: 'A', value: 40 },
        tsw: { name: 'rise + fall time', q: 'time', unit: 'ns', value: 50, tex: 't_{sw}' },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 24 }
      },
      note: 'For the one leg that chops; faster gate drive (shorter t_sw) and lower PWM frequency cut it, at the price of EMI and audible noise.',
      stories: { Psw: 'An ESC chops {I} from {V} at {f} with switching edges of {tsw}. What is its switching loss?' }
    },
    {
      name: 'Temperature rise',
      expr: 'dT = P*Rth', tex: '\\Delta T = P\\,R_{th}',
      vars: {
        dT: { name: 'temperature rise above the air', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        P: { name: 'power dissipated', q: 'power', unit: 'W', value: 4 },
        Rth: { name: 'thermal resistance to the air', q: 'thermalres', unit: 'K/W', value: 6, tex: 'R_{th}' }
      },
      note: 'Steady state. R_th depends on the airflow: a small ESC might be 5–8 K/W in propeller wash and 15–25 K/W in still air.',
      stories: { dT: 'An ESC dissipates {P} with {Rth} to the air. How much hotter than the air does it run?' }
    }
  ],
  examples: [
    {
      title: 'Reading a throttle pulse',
      q: 'An ESC was calibrated to 1100 µs (zero) and 1940 µs (full). What throttle does a 1350 µs pulse give?',
      steps: ['$D = (1350 - 1100)/(1940 - 1100) = 250/840 = 0.298$.'],
      a: 'About 30 % throttle.'
    },
    {
      title: 'How hot will it get?',
      q: 'A 6S ESC (22.2 V) carries 40 A continuously with 1 mΩ per switch position, edges of 50 ns and 24 kHz PWM; the logic takes 0.3 W. Estimate the heat and temperature rise in propeller wash (6 K/W) and in a closed box (20 K/W), assuming these thermal resistances.',
      steps: [
        'Conduction: $2 \\times 40^2 \\times 0.001 = 3.2$ W.',
        'Switching: $0.5 \\times 22.2 \\times 40 \\times 50\\times10^{-9} \\times 24\\,000 = 0.53$ W; total with logic about 4.0 W.',
        'Rise: $4.0 \\times 6 = 24$ K in the airflow; $4.0 \\times 20 = 80$ K in the box — about 115 °C at 35 °C ambient.'
      ],
      a: 'About 4 W: fine in the airflow, too hot in a closed box without a heat sink.'
    },
    {
      title: 'The linear BEC trap',
      q: 'A receiver and servos need 1.5 A at 5 V from a fully charged 6S pack (25.2 V). Compare a linear BEC with a switching BEC of 85 % efficiency.',
      steps: [
        'Linear: $(25.2 - 5) \\times 1.5 = 30.3$ W — impossible in a small ESC.',
        'Switching: $5 \\times 1.5 \\times (1/0.85 - 1) = 1.3$ W.'
      ],
      a: 'Above about 3 cells use a switching BEC (or a separate regulator).'
    }
  ],
  quiz: [
    { q: 'An ESC calibrated to 1000–2000 µs receives a 1500 µs pulse. The throttle is…', choices: ['50 %', '15 %', '75 %', '1.5 %'], a: 0, why: '(1500 − 1000)/(2000 − 1000) = 0.5.' },
    { q: 'Why do ESC current ratings often fail inside a closed fuselage or robot body?', choices: ['They assume the cooling airflow of a propeller', 'The battery voltage is lower there', 'DShot does not work in enclosures', 'The motor draws more current indoors'], a: 0, why: 'The heat must go somewhere; without airflow the thermal resistance to ambient may be three times larger.' },
    { q: 'Doubling the motor current multiplies the MOSFET conduction loss by about…', choices: ['4', '2', '1.4', '8'], a: 0, why: 'P = 2I²R: loss grows with the square of the current (and R_DS(on) rises as the MOSFETs warm, so a little more).' },
    { q: 'The BRAKE input of a BLDC driver is a suitable emergency stop.', a: false, why: 'It is a control function in the driver\'s software. Emergency stops are designed to the machinery-safety standards (ISO 13850, IEC 60204-1, ISO 13849), usually removing power or using safe torque off.' },
    { q: 'Long battery leads to an ESC cause…', choices: ['voltage spikes at each switching edge that can destroy the MOSFETs — add a low-ESR capacitor at the ESC', 'only a lower motor speed', 'better throttle resolution', 'nothing, if the wire is thick'], a: 0, why: 'The lead inductance fights each change of current; the spikes add to the bus voltage.' }
  ],
  problems: [
    { q: 'An ESC has 1.5 mΩ per switch position and carries 50 A. What is its conduction loss?', answer: 7.5, unit: 'W', tol: 0.02, steps: ['$P = 2 \\times 50^2 \\times 0.0015 = 7.5$ W.'] },
    { q: 'A driver dissipates 6 W through a heat sink of 4 K/W into 40 °C air. What temperature does the heat sink reach?', answer: 64, unit: '°C', tol: 0.02, steps: ['$\\Delta T = 6 \\times 4 = 24$ K.', '$40 + 24 = 64$ °C.'] }
  ],
  choose: {
    good: [
      'Model and drone ESCs: light, efficient, high current per gram, with a propeller\'s airflow.',
      'Industrial BLDC drivers: machines that need terminals, a speed pot or 0–10 V, direction and alarm signals, Hall-sensored starts and ramps.',
      'FOC-capable controllers where smoothness, low noise or low speed matter.'
    ],
    avoid: [
      'A model ESC in an enclosed machine or robot drivetrain without derating, a heat sink and proper protection.',
      'A sensorless ESC on a load that needs torque from standstill.',
      'Using an ESC\'s arming, brake or stop as a safety function.'
    ],
    check: [
      'Voltage range including the fully charged battery and braking peaks; continuous and peak current at your cooling.',
      'The command signal (pulse, DShot, 0–10 V, bus) and the input logic (NPN/PNP, 5 or 24 V).',
      'Sensor support (Hall type), maximum electrical rpm (pole pairs × rpm), braking and reversing.',
      'Protection: current limit, over-temperature, low voltage, stall detection — and what the alarm output does.'
    ]
  },
  applications: [
    'Multicopters: four-in-one ESC boards running DShot from the flight controller.',
    'Conveyors and AGVs: DIN-rail BLDC drivers with a speed pot, ramps and an alarm relay.',
    'Pumps and fans with integrated drivers taking 0–10 V or PWM speed signals from a building controller.',
    'Ramps and set-up are explored in [the drives tools](#/tools/drives/pwm).'
  ],
  sources: [
    'IEC 61800 series, *Adjustable speed electrical power drive systems*, including IEC 61800-5-1 on electrical, thermal and energy safety.',
    'IEC 60204-1 (electrical equipment of machines) and ISO 13850 (emergency stop) for stopping functions.',
    'Mohan, *Electric Drives*, and MOSFET datasheets: conduction and switching losses and their thermal design.'
  ],
  sim: 'bl-esc'
},

{
  id: 'pancake-motors', parent: 'bldc-topic', title: 'Pancake and axial-flux motors', level: 2,
  short: 'Motors made flat: the air gap is a disc face instead of a cylinder, and the flux crosses it along the shaft. Axial-flux motors give high torque in a short, wide package; printed-disc motors carry their winding on a thin ironless disc, giving tiny inertia, very fast response and no cogging.',
  keywords: ['pancake motor', 'axial flux', 'disc motor', 'printed circuit motor', 'printed armature', 'ironless', 'coreless', 'yokeless', 'double-sided', 'PCB stator', 'axial magnetic pull', 'flat motor', 'low inertia', 'high torque', 'direct drive'],
  prereq: ['inrunner-outrunner', 'bldc-motor', 'force-on-conductor'],
  related: ['torque-motors', 'coreless-motors', 'dc-servo-motors', 'motors-vehicles', 'motors-robots-drones', 'physics:force-on-current'],
  body: `
Most motors are cylinders: the air gap is a tube and the flux crosses it radially. Make the gap a flat ring and let the flux cross it **axially**, along the shaft, and you have an **axial-flux** or *pancake* motor: discs of magnets facing discs of windings. It is the oldest arrangement of all — Faraday's disc of 1831 turned a copper plate between the poles of a magnet — and one of the newest, in electric aircraft, motorcycles, cars and robot joints.

### Why flat can be strong
Torque is a shear stress on the gap surface times the radius. For an annulus from inner radius $R_i$ to outer radius $R_o$, [[?integral|adding up]] the force on each thin ring at radius $r$ ($dT = \\sigma \\cdot 2\\pi r\\,dr \\cdot r$) gives

$$T = \\frac{2\\pi}{3}\\,\\sigma\\,\\left(R_o^3 - R_i^3\\right)$$

per air gap. Torque grows with the **cube** of the diameter, whereas a radial motor's grows with the square of its rotor diameter times its length. So in a short, large-diameter package axial flux wins, and two gaps (a stator between two magnet rotors, or a rotor between two stators) double it. For a given current loading the best inner radius is about $R_o/\\sqrt 3 \\approx 0.58\\,R_o$. In the simulation, slide the diameter and the length and find where the axial motor overtakes a radial one of the same outside size.

### Kinds of flat motor
| Kind | Construction | Strengths | Typical use |
|---|---|---|---|
| Axial-flux PM, iron stator | wound iron teeth (tape-wound laminations or soft-magnetic composite) between magnet discs | torque density, short length | in-wheel and in-line vehicle drives, aircraft, generators |
| Yokeless segmented stator | separate wound teeth held between two rotors, no back iron | lighter still, lower iron loss | high-performance traction |
| Printed-disc DC (printed armature) | a thin ironless disc of stamped or etched copper conductors; brushes run on the disc | very low inertia and inductance, no cogging | fast servo axes, film and tape transport, robots, medical pumps |
| PCB-stator ironless BLDC | windings etched in a multilayer circuit board | no cogging, silent, thin | fans, small robots, instruments |
| Flat radial outrunners | short, many-pole outer rotors | simple and cheap | gimbals, turntables, ceiling fans |

### Printed-disc motors
With no iron in the armature there is no cogging and very little inductance — tens of microhenries — so current and torque respond in well under a millisecond. The disc is light, so the **mechanical time constant** $\\tau_m = J R/K^2$ is a few to about ten milliseconds: such a motor brings a light load to thousands of rpm in tens of milliseconds, and takes short current pulses several times its continuous rating. But the thin disc stores and sheds little heat, so its continuous torque is modest and an overload burns it quickly; and it is brushed, so the brushes need service.

### Practical problems
- **Axial pull.** A single-sided machine is a strong electromagnet: the magnets attract the stator with about $F = B^2 A/(2\\mu_0)$ — some 5 kN for a 200 mm disc at 0.8 T. Bearings and housing must carry it, and assembly needs fixtures. Double-sided designs cancel the pull, as long as the rotor stays centred.
- **A thin, even gap** of 0.5–2 mm must be held across the whole face, hot and loaded.
- **Cooling** a stator sandwiched between rotors, and the cost of special cores and magnets.
- **Inertia:** a large magnet disc is not light; only the ironless disc motors are truly low-inertia.

> [!warn] Magnet discs attract steel and each other with hundreds to thousands of newtons: they crush fingers and shatter. Handle them with non-magnetic tools and fixtures, and keep them away from pacemakers.

> [!key] Flat motors trade length for diameter: torque grows with the cube of the diameter, so axial flux gives high torque in a short package; ironless printed discs give tiny inertia and no cogging, at the price of limited continuous torque.
`,
  ideas: [
    'In an axial-flux motor the flux crosses a flat, ring-shaped gap along the shaft.',
    'Per gap, T = (2π/3) σ (Ro³ − Ri³): torque grows with the cube of the diameter.',
    'Axial flux wins in short, wide packages; radial wins when length is free.',
    'Printed-disc motors have ironless armatures: tiny inductance and inertia, no cogging, limited continuous torque.',
    'Single-sided designs carry a large axial magnetic pull; double-sided designs cancel it.'
  ],
  pitfalls: [
    'Axial-flux motors always beat radial ones — Only in short, wide shapes; a long, slim radial motor makes more torque in the same volume when length is available.',
    'Every pancake motor has low inertia — Only the ironless disc types; a large magnet rotor has a lot of inertia.',
    'A printed-disc motor can run at its peak torque all day — Its thin armature holds little heat; peak ratings are for milliseconds to seconds.'
  ],
  formulas: [
    {
      name: 'Torque of an axial-flux motor',
      expr: 'T = 2*pi/3*sigma*(Ro^3 - Ri^3)*ng', tex: 'T = \\dfrac{2\\pi}{3}\\,\\sigma\\,\\left(R_o^3 - R_i^3\\right) n_g',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        sigma: { name: 'air-gap shear stress', q: 'pressure', unit: 'kPa', value: 20, tex: '\\sigma' },
        Ro: { name: 'outer radius of the active ring', q: 'length', unit: 'mm', value: 100, tex: 'R_o' },
        Ri: { name: 'inner radius of the active ring', q: 'length', unit: 'mm', value: 60, tex: 'R_i' },
        ng: { name: 'number of air gaps', int: true, value: 2, tex: 'n_g' }
      },
      note: 'Integrating σ·r over the ring. Two gaps for a stator between two rotors (or a rotor between two stators).',
      stories: { T: 'An axial-flux motor has {ng} gaps from {Ri} to {Ro} working at {sigma}. What torque does it give?', Ro: 'A motor with {ng} gaps, an inner radius of {Ri} and a shear stress of {sigma} must give {T}. What outer radius is needed?' }
    },
    {
      name: 'Axial magnetic pull',
      expr: 'F = B^2*A/(2*mu0)', tex: 'F = \\dfrac{B^2 A}{2\\mu_0}',
      vars: {
        F: { name: 'attraction between rotor and stator', q: 'force', unit: 'kN' },
        B: { name: 'flux density in the gap', q: 'bfield', unit: 'T', value: 0.8 },
        A: { name: 'area of the pole faces', q: 'area', unit: 'cm²', value: 201 },
        mu0: { const: 'mu0' }
      },
      note: 'The magnetic pressure B²/2μ₀ on the gap faces, taking the flux density as uniform — an upper estimate, since the field varies from pole to pole.',
      stories: { F: 'A single-sided disc motor has {B} over {A} of pole faces. How hard do rotor and stator pull together?' }
    },
    {
      name: 'Mechanical time constant',
      expr: 'tau = J*R/K^2', tex: '\\tau_m = \\dfrac{J\\,R}{K^2}',
      vars: {
        tau: { name: 'mechanical time constant', q: 'time', unit: 'ms', tex: '\\tau_m' },
        J: { name: 'inertia of rotor and load', q: 'inertia', unit: 'kg·cm²', value: 0.4 },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 1 },
        K: { name: 'motor constant', q: 'kemf', unit: 'V·s/rad', value: 0.06 }
      },
      note: 'The time to reach 63 % of the final speed after a voltage step (the electrical time constant L/R of an ironless armature is much shorter).',
      stories: { tau: 'A printed-disc motor has {J}, {R} and K = {K}. What is its mechanical time constant?' }
    }
  ],
  examples: [
    {
      title: 'Axial against radial in the same can',
      q: 'A motor must fit a can 200 mm across and 60 mm long. Compare a double-sided axial-flux design (active ring from 58 to 100 mm radius) with a radial design (rotor radius 65 mm, stack 45 mm after the end windings), both at 20 kPa.',
      steps: [
        'Axial: $T = 2.094 \\times 20\\,000 \\times (0.1^3 - 0.058^3) \\times 2 = 2.094 \\times 20\\,000 \\times 0.000805 \\times 2 = 67$ N·m.',
        'Radial: $T = 2\\pi \\times 0.065^2 \\times 0.045 \\times 20\\,000 = 24$ N·m.',
        'Stretched to 300 mm long, the radial motor (stack 280 mm) would give $2\\pi \\times 0.065^2 \\times 0.28 \\times 20\\,000 = 149$ N·m.'
      ],
      a: 'About 67 against 24 N·m: in the short can the axial motor gives nearly three times the torque; in a long can the radial motor wins.'
    },
    {
      title: 'The pull on a single-sided disc',
      q: 'A single-sided axial-flux motor has an active ring from 60 to 100 mm radius and a gap flux density of 0.8 T. Estimate the axial pull.',
      steps: [
        '$A = \\pi(0.1^2 - 0.06^2) = 0.0201$ m².',
        '$F = 0.8^2 \\times 0.0201/(2 \\times 4\\pi\\times10^{-7}) = 5100$ N.'
      ],
      a: 'About 5 kN — half a tonne-force on the bearings.'
    },
    {
      title: 'A fast printed-disc axis',
      q: 'A printed-disc servo has K = 0.06 N·m/A, R = 1.0 Ω and a rotor of 0.4 kg·cm². It drives a load of equal inertia with a 10 A peak current. Find its time constants and how soon it reaches 3000 rpm.',
      steps: [
        'Motor alone: $\\tau_m = 4\\times10^{-5} \\times 1.0/0.06^2 = 11$ ms; with the load, 22 ms.',
        'At 10 A: $T = 0.6$ N·m; $\\alpha = 0.6/(8\\times10^{-5}) = 7500$ rad/s².',
        '3000 rpm = 314 rad/s is reached in $314/7500 = 42$ ms (if the supply voltage allows the current at speed).'
      ],
      a: 'τm ≈ 11 ms alone, 22 ms loaded; 3000 rpm in about 40 ms.'
    }
  ],
  quiz: [
    { q: 'At the same shear stress and radius ratio, doubling the outer diameter of an axial-flux motor multiplies its torque by about…', choices: ['8', '4', '2', '16'], a: 0, why: 'T ∝ Ro³ − Ri³; with Ri a fixed fraction of Ro, the torque goes as the cube.' },
    { q: 'Why are double-sided axial-flux motors preferred to single-sided ones?', choices: ['The pulls of the two gaps cancel and the torque doubles', 'They need no bearings', 'They have no iron losses', 'They run on AC directly'], a: 0, why: 'A centred rotor between two stators (or a stator between two rotors) feels equal and opposite attractions.' },
    { q: 'What gives a printed-disc motor its very fast response?', choices: ['A light, ironless armature with little inductance and inertia', 'Very strong magnets alone', 'A high supply voltage', 'A gearbox'], a: 0, why: 'Low L lets the current rise in microseconds; low J lets the torque accelerate the rotor quickly.' },
    { q: 'Axial-flux motors make more torque than radial motors of the same volume whatever the shape.', a: false, why: 'Only when short and wide; long and slim favours radial.' },
    { q: 'What limits a printed-disc motor\'s continuous torque most?', choices: ['The thin disc stores and sheds little heat', 'Demagnetisation at low speed', 'Cogging', 'Its high inductance'], a: 0, why: 'The copper disc has little mass and little contact with anything cool.' }
  ],
  problems: [
    { q: 'An axial-flux motor has one air gap with $R_o$ = 80 mm, $R_i$ = 46 mm and a shear stress of 15 kPa. What torque does it give?', answer: 13.0, unit: 'N·m', tol: 0.02, steps: ['$R_o^3 - R_i^3 = 5.12\\times10^{-4} - 9.73\\times10^{-5} = 4.15\\times10^{-4}$ m³.', '$T = 2.094 \\times 15\\,000 \\times 4.15\\times10^{-4} = 13.0$ N·m.'] },
    { q: 'A disc motor has a gap flux density of 1.0 T over 150 cm² of pole face. Estimate the axial pull.', answer: 5.97, unit: 'kN', tol: 0.02, steps: ['$F = 1.0^2 \\times 0.015/(2 \\times 4\\pi\\times10^{-7}) = 5970$ N.'] }
  ],
  choose: {
    good: [
      'Short, wide spaces: in-wheel and in-line vehicle drives, robot joints, gimbals, generators on an engine shaft.',
      'Highest torque per kilogram and per length (axial-flux PM), direct drive instead of a gearbox.',
      'Printed-disc and PCB-stator motors: fast response, no cogging, silent — servo, medical and instrument drives.'
    ],
    avoid: [
      'Long, slim spaces: a radial motor wins when length is free.',
      'Cost-sensitive standard drives: special cores, magnets and tight gaps cost more than a mass-produced radial motor.',
      'Printed-disc motors on long, heavy duty: little thermal mass, and brushes to maintain.'
    ],
    check: [
      'Bearing and housing design for the axial pull, and the gap under heat and load.',
      'Continuous torque and how heat leaves the stator.',
      'Rotor inertia against your acceleration (magnet discs are not light).',
      'The drive: most axial-flux PM motors need an FOC drive with an encoder or resolver.'
    ]
  },
  applications: [
    'Electric motorcycles, aircraft and some cars: axial-flux PM motors in short, high-torque packages.',
    'Robot joints and gimbals: flat many-pole motors, often with a hollow shaft for cables.',
    'Fans and instruments: silent PCB-stator motors.'
  ],
  history: 'Faraday\'s disc (1831), a copper disc turning between magnet poles, was the first axial-flux machine. Printed-circuit armature motors became the fast servo motors of tape drives, printers and machine tools from the 1960s; modern axial-flux PM motors grew with neodymium magnets and soft-magnetic composites.',
  sources: [
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: axial-flux configurations and sizing.',
    'Hughes and Drury, *Electric Motors and Drives*: torque, shear stress and electric loading.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*.'
  ],
  sim: 'bl-pancake'
},

{
  id: 'bldc-selection', parent: 'bldc-topic', title: 'Choosing a brushless motor: Kv, poles and size', level: 2,
  short: 'Start from the load: the torque and speed you need, continuously and at peak, and the voltage you have. Size the motor for the continuous torque and its heat, pick the winding (Kv) that puts the loaded speed near 80 % of Kv × V, choose the poles for your speed, then match a controller rated for the current at your cooling.',
  keywords: ['motor selection', 'sizing', 'Kv', 'pole count', 'continuous torque', 'peak torque', 'RMS torque', 'propeller', 'gearbox', 'Km', 'thermal', 'eRPM', 'controller matching', 'flange size', 'stator size'],
  prereq: ['bldc-motor', 'inrunner-outrunner', 'rms-torque-sizing'],
  related: ['esc-drivers', 'motor-selection-method', 'gearboxes', 'motor-heating', 'motors-robots-drones', 'aerodynamics:multicopters', 'hydraulics:affinity-laws'],
  body: `
A brushless motor is chosen in the same order as any motor ([[motor-selection-method]]): the load first, then the size that can carry it without overheating, then the winding that suits the voltage, and last the controller.

### 1 · The load: torque, speed, duty
List the torque and speed in each part of the cycle — accelerating, running, holding — and work out the **peak torque** and the **RMS (continuous) torque** ([[rms-torque-sizing]]). A propeller or fan needs torque rising with the square of speed; a conveyor or a wheel on a slope needs torque from standstill. A gearbox or belt can move the motor to a better speed: a 3000 rpm motor through 10:1 gives nearly ten times the torque at 300 rpm, less the gear losses (typically 90–97 % per spur or planetary stage).

### 2 · The size: continuous torque and heat
The **continuous torque** is the torque the winding carries without passing its temperature limit — a matter of size, magnets and cooling, not of winding. The copper loss at torque $T$ is $(T/K_m)^2$ ([[inrunner-outrunner]]); compare motors by $K_m$ and by their continuous torque at *your* cooling (datasheets often assume a heat-sink flange or an airflow). Peak torque (2–4 × continuous for seconds) is limited by the controller's current and by the magnets' resistance to demagnetisation. Leave 20–30 % margin on continuous torque in an industrial machine.

### 3 · The winding: Kv
With the size fixed, choose the winding so that the **loaded speed sits near 80 % of the no-load speed** $K_v V$:

$$K_v \\approx \\frac{n}{0.8\\,V}$$

Too low a Kv and the motor never reaches speed; too high and it reaches speed at a low duty and high current — a hotter controller and more ripple. On a propeller a Kv that is too high is worse: a propeller's power rises with the [[?exponent|cube]] of its speed, so 20 % more speed asks $1.2^3 = 1.7$ times the power. On batteries, use the voltage under load late in the discharge (about 3.5 V per lithium-ion cell) for the speed, and the full-charge voltage (4.2 V per cell) for the controller's rating.

### 4 · The poles
| Poles | Speeds | Typical |
|---|---|---|
| 2 | 10 000–100 000 rpm | blowers, spindles, turbo pumps |
| 4–8 | 1500–20 000 rpm | industrial BLDC (3000 rpm rated), tools, RC inrunners |
| 12–14 | 1000–30 000 rpm | propeller outrunners |
| 20–46 | 50–1500 rpm | gimbals, hub motors, direct-drive robots and washing machines |

More poles give more torque at low speed and thinner iron, but raise the electrical frequency $f_e = (p/2)\\,n$: iron losses grow and the controller must switch faster. Check its limit, often quoted in eRPM (rpm × pole pairs).

### 5 · Frame and form
Industrial BLDC motors come with square flanges of 42, 57, 60, 80 and 86 mm, at 24 or 48 V and 20–750 W, often with a gearhead and Hall sensors; model motors are named by stator size (a "2806" has a 28 mm stator, 6 mm tall). Check the shaft, mounting, IP rating, bearing loads, noise and cable.

### 6 · The controller
Its voltage (with the full battery and braking peaks), continuous and peak current, sensor type, command signal and cooling must match ([[esc-drivers]]). A 30 A motor needs a controller good for 30 A **at your cooling**.

| Mistake | What happens |
|---|---|
| Kv too high for the voltage and propeller | overcurrent, hot motor and ESC, short flights |
| Motor sized on peak power | runs hot at continuous load; magnets weaken |
| Sensorless drive for a loaded start | twitching, failed starts |
| Too many poles for the controller | desync at top speed |

In the simulation choose a battery, a propeller and a Kv, and find the combination that gives the thrust you need at a sensible current and temperature.

> [!tip] For propellers and fans: start from the thrust or flow, pick the propeller, find the speed it needs, take Kv from $n/(0.8V)$ — then check the full-throttle current with the real battery.

> [!key] Size for continuous torque and heat; pick Kv for your voltage (loaded speed ≈ 0.8 Kv V); pick poles for your speed; match a controller rated for the current at your cooling.
`,
  ideas: [
    'Start from the load: peak and RMS torque, speed, duty — a gearbox can move the motor to a better speed.',
    'Continuous torque is set by size and cooling; compare motors by Km and their continuous rating at your cooling.',
    'Choose Kv so the loaded speed is about 80 % of Kv × V at the lowest working voltage.',
    'On propellers and fans, power rises with the cube of speed: a Kv that is too high overloads everything.',
    'Match the controller: voltage at full charge, current at your cooling, sensors, signal, eRPM.'
  ],
  pitfalls: [
    'Choose the motor by its peak power — Peak power is reached at a current the winding and magnets tolerate for seconds; continuous duty must sit at the continuous torque.',
    'Pick the highest Kv for the most performance — On a fixed battery and propeller a higher Kv spins faster and draws much more current; it is a matching choice, not a quality.',
    'The battery\'s nominal voltage is the one that matters — Speed is set by the voltage under load late in the discharge; the controller must survive the fully charged voltage and braking peaks.'
  ],
  formulas: [
    {
      name: 'Kv for a loaded speed',
      expr: 'Kv = n/(k*V)', tex: 'K_v = \\dfrac{n}{k\\,V}',
      vars: {
        Kv: { name: 'speed constant', q: false, unit: 'rpm/V', tex: 'K_v' },
        n: { name: 'required loaded speed', q: false, unit: 'rpm', value: 6000 },
        k: { name: 'loaded speed as a fraction of no-load speed', q: 'ratio', unit: '%', value: 80 },
        V: { name: 'supply voltage under load', q: 'voltage', unit: 'V', value: 22.2 }
      },
      note: 'k ≈ 0.75–0.85 leaves room for the RI drop and for speed control; propellers at full throttle often sit near 0.8.',
      stories: { Kv: 'A propeller must turn at {n} under load from {V}. Aiming for a loaded speed of {k} of no-load, what Kv do you choose?' }
    },
    {
      name: 'Current for a torque',
      expr: 'I = T/Kt + I0', tex: 'I = \\dfrac{T}{K_t} + I_0',
      vars: {
        I: { name: 'motor current', q: 'current', unit: 'A' },
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m', value: 0.4 },
        Kt: { name: 'torque constant', q: 'ktorque', unit: 'N·m/A', value: 0.025, tex: 'K_t' },
        I0: { name: 'no-load current', q: 'current', unit: 'A', value: 0.7, tex: 'I_0' }
      },
      note: 'Kt = 9.55/Kv. Size the controller for the largest current, not the average.',
      stories: { I: 'A motor with {Kt} and a no-load current of {I0} must give {T}. What current does it draw?' }
    },
    {
      name: 'Motor torque through a gearbox',
      expr: 'Tm = TL/(i*eta)', tex: 'T_m = \\dfrac{T_L}{i\\,\\eta}',
      vars: {
        Tm: { name: 'torque at the motor', q: 'torque', unit: 'N·m', tex: 'T_m' },
        TL: { name: 'torque at the load', q: 'torque', unit: 'N·m', value: 3, tex: 'T_L' },
        i: { name: 'gear ratio (motor speed / load speed)', value: 10, tex: 'i' },
        eta: { name: 'gearbox efficiency', q: 'ratio', unit: '%', value: 95, tex: '\\eta' }
      },
      note: 'The motor turns i times faster than the load. Driving the load, the gearbox losses add to the motor torque.',
      stories: { Tm: 'A load needs {TL} through an {i}:1 gearbox of {eta} efficiency. What torque must the motor give?', i: 'A motor gives {Tm}; the load needs {TL} and the gearbox is {eta} efficient. What ratio is needed?' }
    }
  ],
  examples: [
    {
      title: 'A propeller drive',
      q: 'A 12-inch propeller needs about 150 W at 6000 rpm for the thrust you want. The battery is 6S (about 21 V under load). Choose Kv and estimate the current at that point for a motor with $I_0$ = 0.7 A and R = 0.08 Ω.',
      steps: [
        '$K_v \\approx 6000/(0.8 \\times 21) = 357$ rpm/V: choose 340–380 rpm/V.',
        'Torque: $T = 150/(6000 \\times 2\\pi/60) = 150/628 = 0.239$ N·m.',
        'With 380 rpm/V: $K_t = 9.549/380 = 0.0251$ N·m/A, so $I = 0.239/0.0251 + 0.7 = 10.2$ A.',
        'Copper loss $10.2^2 \\times 0.08 = 8.3$ W — comfortable for a 50 mm class outrunner; at full throttle it runs faster and draws more, so the controller needs a good margin.'
      ],
      a: 'About 360–380 rpm/V; roughly 10 A at the working point.'
    },
    {
      title: 'An AGV wheel',
      q: 'A 150 kg AGV drives two 150 mm wheels at 1.5 m/s, with a rolling resistance of 0.02 and accelerations of 0.5 m/s². Through a 10:1 gearhead of 90 % efficiency, what motor speed and torques are needed per wheel?',
      steps: [
        'Wheel speed: $1.5/(\\pi \\times 0.15) = 3.18$ rev/s = 191 rpm; motor 1910 rpm.',
        'Rolling: $0.02 \\times 150 \\times 9.81 = 29.4$ N; accelerating: $150 \\times 0.5 = 75$ N; per wheel 14.7 N and 52.2 N at peak.',
        'Wheel torques: $14.7 \\times 0.075 = 1.10$ N·m continuous, $52.2 \\times 0.075 = 3.92$ N·m peak.',
        'At the motor: $1.10/(10 \\times 0.9) = 0.12$ N·m continuous, $3.92/9 = 0.44$ N·m peak.'
      ],
      a: 'About 1900 rpm, 0.12 N·m continuous and 0.44 N·m peak — a 24 V, 100 W BLDC gearmotor (0.32 N·m rated, about 3 × peak) suits it with margin.'
    }
  ],
  quiz: [
    { q: 'A motor must turn 9000 rpm under load from 12 V. A good Kv is about…', choices: ['940 rpm/V', '750 rpm/V', '9000 rpm/V', '120 rpm/V'], a: 0, why: '9000/(0.8 × 12) = 938 rpm/V.' },
    { q: 'A 380 rpm/V motor on a propeller is replaced by a 460 rpm/V motor of the same size, same battery. At full throttle the power drawn rises by roughly…', choices: ['about 77 %', 'about 21 %', 'about 10 %', 'nothing — the throttle limits it'], a: 0, why: 'The speed rises by about 460/380 = 1.21 and the propeller\'s power by 1.21³ = 1.77.' },
    { q: 'What sets a brushless motor\'s continuous torque?', choices: ['Its size, magnets and cooling — how much copper loss it can shed', 'Its Kv', 'The controller\'s PWM frequency', 'Its pole count alone'], a: 0, why: 'Continuous torque is a thermal limit; the winding only changes the current and voltage.' },
    { q: 'A higher pole count always makes a better motor.', a: false, why: 'More poles help at low speed but raise the electrical frequency, iron losses and the demands on the controller.' },
    { q: 'For a battery drive, which voltage do you use to choose Kv?', choices: ['The voltage under load late in the discharge', 'The fully charged voltage', 'The storage voltage', 'Twice the nominal voltage'], a: 0, why: 'The motor must still reach speed at the end of the flight or shift; the full-charge voltage matters for the controller\'s rating.' }
  ],
  problems: [
    { q: 'A load needs 2.4 N·m at 250 rpm. Through a 12:1 gearbox of 94 % efficiency, what torque must the motor give?', answer: 0.213, unit: 'N·m', tol: 0.02, steps: ['$T_m = 2.4/(12 \\times 0.94) = 0.213$ N·m, at $250 \\times 12 = 3000$ rpm.'] },
    { q: 'What Kv gives a loaded speed of 4200 rpm from 24 V if the loaded speed is 80 % of the no-load speed?', answer: 219, unit: 'rpm/V', tol: 0.02, steps: ['$K_v = 4200/(0.8 \\times 24) = 219$ rpm/V.'] }
  ],
  choose: {
    good: [
      'Following this order for any brushless drive — load, size, winding, poles, controller — with the numbers written down.',
      'Direct drive with many-pole outrunners where it removes a gearbox (propellers, wheels, gimbals).',
      'A standard 24/48 V BLDC gearmotor with its matched driver for industrial speed control.'
    ],
    avoid: [
      'Choosing by Kv or peak power alone.',
      'Ratings measured in a propeller\'s airflow applied to an enclosed machine.',
      'Sensorless controllers for loads that must start under torque.'
    ],
    check: [
      'Continuous torque at your ambient and cooling with 20–30 % margin; peak torque for acceleration.',
      'Loaded speed ≈ 80 % of Kv × V at the lowest battery voltage.',
      'Controller voltage at full charge and during braking; current at your cooling; its eRPM limit.',
      'Mechanics: shaft, bearings, mounting, IP rating, noise; gearbox efficiency and backlash.'
    ]
  },
  applications: [
    'Drones: propeller, battery cell count and Kv chosen together for hover efficiency and full-throttle current.',
    'AGVs and conveyors: a 24/48 V BLDC gearmotor sized on RMS torque with a Hall-sensored driver.',
    'Work through a whole selection in [the sizing tools](#/tools/sizing/choose) and [the axis calculator](#/tools/sizing/axis).'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: motor and drive ratings and selection.',
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: sizing and the choice of pole number.',
    'IEC 60034-1: rated (continuous) versus short-time and intermittent duties.'
  ],
  sim: [{ id: 'bl-runner', params: { preset: 'hiKv' } }, 'bl-bldc-lab']
},

{
  id: 'synchronous-motor', parent: 'sync-topic', title: 'The wound-field synchronous motor', level: 2,
  short: 'A three-phase stator like an induction motor\'s and a rotor with DC-excited poles: the rotor locks to the rotating field and turns at exactly 120 f/p rpm. The load sets how far the rotor lags (the load angle); the field current sets the power factor — over-excited, the motor supplies reactive power to the plant. It cannot start by itself.',
  keywords: ['synchronous motor', 'wound field', 'excitation', 'field current', 'load angle', 'power angle', 'pull-out torque', 'V-curve', 'power factor correction', 'synchronous condenser', 'damper winding', 'amortisseur', 'brushless exciter', 'hunting', 'pole slip', 'salient pole'],
  prereq: ['rotating-field', 'power-factor', 'slip-and-speed'],
  related: ['pmsm-motor', 'line-start-pm', 'reluctance-motors', 'squirrel-cage', 'electronics:power-factor-correction', 'electronics:phasors-ac', 'physics:generators'],
  body: `
An induction motor always slips behind its rotating field, because its rotor currents come from the slip. A **synchronous motor** gives its rotor poles of its own — a DC **field winding** on the rotor, fed through slip rings or from a brushless exciter — so the rotor locks to the stator's rotating field like a magnet dragged by a magnet, and turns at exactly

$$n_s = \\frac{120\\,f}{p}$$

rpm ($f$ in Hz, $p$ poles): 1500 rpm for 4 poles at 50 Hz, 300 rpm for 20 poles, 3600 rpm for 2 poles at 60 Hz. Load it and it does not slow down: the rotor simply falls a little further behind the field, by the **load angle** $\\delta$.

### Load angle and pull-out
Neglecting the stator resistance, a cylindrical-rotor motor with phase voltage $V$, internal (excitation) voltage $E$ and synchronous reactance $X_s$ converts

$$P = \\frac{3\\,V E}{X_s}\\,\\sin\\delta$$

— a [[?sine-cosine|sine]] of the load angle ([[math:phasors|phasors]] V, E and $jX_sI$ form a triangle). Rated load typically sits at δ = 20–35°; the maximum, **pull-out**, comes at δ = 90° (a little less with salient poles, which add reluctance torque). Pull-out torques of 150–200 % of rated are usual, more in motors built for leading power factor. Beyond it the rotor **slips a pole**: the torque reverses every half slip cycle, the current surges, and protection must trip.

### Excitation and power factor: the V-curves
The field current sets $E$. At constant load:
- **under-excited** ($E\\cos\\delta < V$): the motor draws lagging reactive power, like an induction motor;
- **normal excitation**: power factor 1 and the smallest stator current;
- **over-excited** ($E\\cos\\delta > V$): the motor *supplies* reactive power — a leading power factor — correcting the plant's other, lagging loads.

Stator current plotted against field current gives the **V-curves**. A synchronous machine run with no mechanical load, only to supply reactive power, is a **synchronous condenser**.

### Starting
At standstill the rotating field sweeps past the rotor poles 25 or 30 times a second and the average torque is zero: a synchronous motor cannot start by itself. Large motors carry a **damper (amortisseur) cage** in the pole faces and start as induction motors, usually at reduced voltage. The field winding is closed through a **discharge resistor** during the run-up (left open it would see thousands of volts); near 95 % of synchronous speed the field is applied and the rotor **pulls into step**. The damper cage also damps **hunting** — swings of δ excited by pulsating loads such as reciprocating compressors. Very large or high-inertia machines are started by a frequency converter.

### Where and how big
| Rating | Typical drives | Why synchronous |
|---|---|---|
| 0.5–5 MW, 150–600 rpm | reciprocating compressors, refiners, mills, pumps | efficiency at low speed, power-factor correction |
| 5–50 MW and more | pipeline compressors, large pumps and fans, mills | efficiency 97–98.5 %, leading power factor |
| tens to hundreds of Mvar | synchronous condensers on grids | voltage support and inertia |

In the simulation the rotor poles trail the stator field by δ. Raise the load and δ climbs the sine; change the field current and follow the V-curve as the power factor swings from lagging through 1 to leading; push the load past pull-out and watch the rotor slip.

> [!warn] Synchronous motors are medium- or high-voltage machines with excitation systems, and an open field circuit can carry dangerous induced voltages during starting. Only qualified personnel work on them, under the plant's switching and lock-out procedures.

> [!key] A synchronous motor turns at exactly 120 f/p; the load sets the load angle, up to pull-out at 90°, and the field current sets the power factor — over-excited, it corrects the power factor of the whole plant.
`,
  ideas: [
    'The rotor carries DC-excited poles that lock to the rotating field: speed is exactly 120 f/p, with no slip.',
    'Load shows up as the load angle δ; power is 3VE sin δ / Xs, with pull-out at δ = 90°.',
    'The field current sets the power factor: under-excited lagging, normal unity, over-excited leading.',
    'It cannot start by itself: a damper cage starts it as an induction motor, then the field pulls it into step.',
    'Large, slow, constant-speed drives use it for efficiency and power-factor correction.'
  ],
  pitfalls: [
    'A synchronous motor slows down a little under load — Its speed is fixed by the frequency; only the load angle grows, until the motor pulls out of step.',
    'More field current gives more torque — It raises the pull-out torque, but at a given load it mainly changes the reactive power and the power factor.',
    'The damper winding is only for starting — It also damps hunting and carries current in unbalance and transients; its heating limits the number of starts per hour.'
  ],
  formulas: [
    {
      name: 'Synchronous speed',
      expr: 'n = 120*f/p', tex: 'n_s = \\dfrac{120\\,f}{p}',
      vars: {
        n: { name: 'synchronous speed', q: false, unit: 'rpm', tex: 'n_s' },
        f: { name: 'supply frequency', q: false, unit: 'Hz', value: 50 },
        p: { name: 'number of poles', int: true, value: 20 }
      },
      note: 'Also the speed of the rotating field of an induction motor with the same winding.',
      stories: { n: 'A {p}-pole synchronous motor runs on {f}. At what speed does it turn?', p: 'A compressor must turn at {n} on {f}. How many poles does its motor need?' }
    },
    {
      name: 'Power and load angle',
      expr: 'P = 3*V*E*sin(delta)/Xs', tex: 'P = \\dfrac{3\\,V E}{X_s}\\,\\sin\\delta',
      vars: {
        P: { name: 'power converted', q: 'power', unit: 'MW' },
        V: { name: 'phase voltage', q: 'voltage', unit: 'V', value: 3811 },
        E: { name: 'excitation (internal) voltage, per phase', q: 'voltage', unit: 'V', value: 6997 },
        delta: { name: 'load angle', q: 'angle', unit: '°', value: 30, min: 0, max: 180, tex: '\\delta' },
        Xs: { name: 'synchronous reactance per phase', q: 'resistance', unit: 'Ω', value: 20, tex: 'X_s' }
      },
      note: 'Cylindrical rotor, stator resistance neglected. The largest value, 3VE/Xs at δ = 90°, is the pull-out power.',
      stories: { P: 'A motor with {V} per phase, E = {E} and Xs = {Xs} runs at a load angle of {delta}. What power does it convert?', delta: 'A motor with {V} per phase, E = {E} and Xs = {Xs} carries {P}. What is its load angle?' }
    },
    {
      name: 'Reactive power and excitation',
      expr: 'Q = 3*V*(E*cos(delta) - V)/Xs', tex: 'Q = \\dfrac{3\\,V\\,(E\\cos\\delta - V)}{X_s}',
      vars: {
        Q: { name: 'reactive power supplied (+ leading, − lagging)', q: 'reactivepower', unit: 'Mvar', signed: true },
        V: { name: 'phase voltage', q: 'voltage', unit: 'V', value: 3811 },
        E: { name: 'excitation voltage, per phase', q: 'voltage', unit: 'V', value: 6997 },
        delta: { name: 'load angle', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\delta' },
        Xs: { name: 'synchronous reactance per phase', q: 'resistance', unit: 'Ω', value: 20, tex: 'X_s' }
      },
      note: 'Positive: over-excited, the motor supplies reactive power to the network (leading power factor). Negative: under-excited, it draws it.',
      stories: { Q: 'A motor with {V} per phase and Xs = {Xs} runs at {delta} with E = {E}. How much reactive power does it supply?', E: 'At a load angle of {delta}, what excitation voltage makes a motor with {V} and Xs = {Xs} supply {Q}?' }
    }
  ],
  examples: [
    {
      title: 'A 2 MW compressor motor',
      q: 'A 6.6 kV, 50 Hz, 20-pole synchronous motor has $X_s$ = 20 Ω per phase and is over-excited to E = 7.0 kV per phase. It drives a reciprocating compressor taking 2 MW. Find the speed, load angle, reactive power, power factor, current and pull-out power.',
      steps: [
        'Speed $120 \\times 50/20 = 300$ rpm. Phase voltage $6600/\\sqrt 3 = 3811$ V.',
        '$\\sin\\delta = P X_s/(3VE) = 2\\times10^6 \\times 20/(3 \\times 3811 \\times 7000) = 0.50$, so δ = 30°.',
        '$Q = 3 \\times 3811 \\times (7000\\cos 30° - 3811)/20 = +1.29$ Mvar (supplied).',
        '$S = \\sqrt{2^2 + 1.29^2} = 2.38$ MVA; power factor $2/2.38 = 0.84$ leading; $I = 2.38\\times10^6/(\\sqrt 3 \\times 6600) = 208$ A.',
        'Pull-out: $3VE/X_s = 4.0$ MW, twice the load.'
      ],
      a: '300 rpm; δ = 30°; 1.29 Mvar leading; pf 0.84 leading; 208 A; pull-out at 200 %.'
    },
    {
      title: 'Correcting a plant\'s power factor',
      q: 'A plant draws 3 MW at a power factor of 0.8 lagging. The motor of the previous example (2 MW, supplying 1.29 Mvar) is added. What is the plant\'s new power factor?',
      steps: [
        'Before: $Q = 3 \\times \\tan(\\arccos 0.8) = 3 \\times 0.75 = 2.25$ Mvar lagging.',
        'After: P = 5 MW, Q = 2.25 − 1.29 = 0.96 Mvar lagging.',
        'pf $= 5/\\sqrt{5^2 + 0.96^2} = 0.98$.'
      ],
      a: 'From 0.80 to about 0.98 lagging — while also driving the compressor.'
    }
  ],
  quiz: [
    { q: 'A 6-pole synchronous motor on 60 Hz runs at…', choices: ['1200 rpm exactly', 'about 1170 rpm', '1800 rpm', '3600 rpm'], a: 0, why: '120 × 60/6 = 1200 rpm, with no slip.' },
    { q: 'Raising the field current of a loaded synchronous motor beyond the unity-power-factor value makes it…', choices: ['supply reactive power (leading pf) and draw more current', 'run faster', 'draw less current and lag', 'lose synchronism'], a: 0, why: 'E cos δ exceeds V: the motor now sends reactive power to the network, and the current rises again — the right arm of the V.' },
    { q: 'At what load angle does a cylindrical-rotor synchronous motor pull out?', choices: ['90°', '30°', '180°', '45°'], a: 0, why: 'P ∝ sin δ is largest at 90°; beyond it more lag gives less torque.' },
    { q: 'A synchronous motor slows down slightly as its load increases.', a: false, why: 'Its speed is fixed at 120 f/p; the rotor only lags further in angle.' },
    { q: 'Why is the field winding closed through a resistor while the motor starts?', choices: ['The field sweeping past an open winding would induce a dangerous voltage', 'To make the rotor lighter', 'To cut the stator current to zero', 'To run it backwards'], a: 0, why: 'At standstill the field sweeps past at full frequency; the many-turn field winding would act as a step-up transformer.' }
  ],
  problems: [
    { q: 'What is the synchronous speed of a 40-pole motor on 50 Hz?', answer: 150, unit: 'rpm', tol: 0.01, steps: ['$n_s = 120 \\times 50/40 = 150$ rpm.'] },
    { q: 'A motor has V = 230 V and E = 260 V per phase and $X_s$ = 4 Ω. What is its pull-out power?', answer: 44.85, unit: 'kW', tol: 0.02, steps: ['$P_{max} = 3VE/X_s = 3 \\times 230 \\times 260/4 = 44\\,850$ W.'] }
  ],
  choose: {
    good: [
      'Large, constant-speed drives of roughly 0.5 MW and up: compressors, mills, pumps and fans running for years.',
      'Plants that need power-factor correction: an over-excited motor does the work of a capacitor bank.',
      'Low speeds with many poles, where an induction motor would have a poor power factor.'
    ],
    avoid: [
      'Small and medium drives: the exciter and starting equipment cost more than an induction motor with a VFD, or a PMSM.',
      'Frequent starts, heavy starting loads or very high inertia without a frequency converter.',
      'Loads with torque peaks beyond the pull-out torque.'
    ],
    check: [
      'Starting method, starting current and the damper cage\'s thermal limit (starts per hour).',
      'Pull-out margin against load peaks; pulsating loads, hunting and torsional analysis.',
      'Excitation system (brushless or slip rings), its control mode (power factor or reactive power) and protection (loss of field, pole slip).'
    ]
  },
  applications: [
    'Reciprocating compressors in refineries: slow, many-pole synchronous motors correcting the site\'s power factor.',
    'Mills and large pumps: multi-megawatt motors at 97–98 % efficiency.',
    'Grids: synchronous condensers giving reactive power and inertia.'
  ],
  history: 'Synchronous motors are as old as alternating current — any alternator runs as a synchronous motor when fed from the grid. In the 1880s the induction motor, which starts by itself, took over most drives; the synchronous motor kept the large, slow, constant-speed ones and the job of correcting power factor.',
  sources: [
    'Chapman, *Electric Machinery Fundamentals*: synchronous motors, V-curves and starting.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: synchronous machines and the power–angle characteristic.',
    'NEMA MG 1, *Motors and Generators*: ratings and performance of large synchronous motors; IEC 60034-1 for ratings.'
  ],
  sim: 'bl-sync'
},

{
  id: 'pmsm-motor', parent: 'sync-topic', title: 'The permanent-magnet synchronous motor', level: 2,
  short: 'A synchronous motor whose rotor poles are permanent magnets: sinusoidal back-EMF, no rotor losses, the highest efficiency of any common motor — and it needs a drive that knows where the rotor is. Surface magnets make smooth servos; buried (interior) magnets add reluctance torque and a wide speed range for vehicles.',
  keywords: ['PMSM', 'permanent-magnet synchronous motor', 'SPM', 'IPM', 'interior permanent magnet', 'surface permanent magnet', 'reluctance torque', 'saliency', 'MTPA', 'field weakening', 'NdFeB', 'demagnetisation', 'IE5', 'back-EMF', 'uncontrolled generator'],
  prereq: ['synchronous-motor', 'bldc-motor', 'rotating-field'],
  related: ['foc-control', 'ac-servo-motors', 'line-start-pm', 'motors-vehicles', 'efficiency-classes', 'motors-pumps-fans', 'physics:magnetic-materials'],
  body: `
Replace the DC field winding of a synchronous motor with permanent magnets and the exciter, the slip rings and the field's copper loss disappear. The **PMSM** has a three-phase stator, usually wound for a **sinusoidal back-EMF**, and a rotor of magnets. There is no slip and no current in the rotor, so the rotor runs cool and the efficiency is the best of any common motor — typically 93–97 % from a few kilowatts up, often IE5 — and, unlike an induction motor, nearly as good at half load. The price: the magnets, and a drive that must know the rotor angle, since the motor cannot start or run stably on the mains (except the [[line-start-pm|line-start]] kind).

**BLDC or PMSM?** The same family. "BLDC" usually means a trapezoidal back-EMF driven in six steps; "PMSM" a sinusoidal back-EMF driven with sine currents by [[foc-control|field-oriented control]]. Many motors are sold as either.

### Where the magnets go
| | Surface-mounted (SPM) | Interior (IPM) |
|---|---|---|
| Magnets | glued on the surface, often under a sleeve | buried in slots in the laminations, often in V shapes |
| Inductances | $L_d \\approx L_q$, small | $L_q > L_d$ (saliency about 2–4) |
| Torque | magnet torque only | magnet + reluctance torque |
| Speed range above base | small | wide: 3–5 × at roughly constant power |
| Typical | servo motors, drones, robot joints | EV traction, compressors, premium pumps and fans |

In the rotor's d–q frame the torque is

$$T = \\tfrac{3}{2}\\,p_p\\left[\\psi_m\\,i_q + (L_d - L_q)\\,i_d\\,i_q\\right]$$

In an IPM $L_d < L_q$, so a **negative** $i_d$ adds torque: the drive picks the current angle giving the **maximum torque per ampere** (MTPA), typically 10–40° beyond the q-axis.

### Voltage limits speed
The back-EMF grows with speed ($E = \\psi_m\\,p_p\\,\\omega$, peak per phase). At the **base speed** it uses up all the voltage the drive can make, $V_{dc}/\\sqrt3$ with space-vector PWM. Above it the drive injects negative $i_d$ to cancel part of the magnet flux — **field weakening** — and the power stays roughly constant while the torque falls. In the simulation the current limit is a circle in the $i_d$–$i_q$ plane and the voltage limit an ellipse that shrinks as speed rises; the motor can work only where they overlap. Drag the speed up and watch the best operating point slide round the circle.

### Magnets: strength, heat and risk
Sintered NdFeB magnets have a remanence of 1.2–1.45 T that falls by about 0.1–0.12 % per kelvin, and their resistance to demagnetisation falls faster. A hot motor is weaker, and a large negative $i_d$ or a short circuit on a hot rotor can **demagnetise** it for good; grades with dysprosium or terbium hold up to 150–200 °C. Ferrite magnets (about 0.4 T) are cheap and need more volume; they resist demagnetisation better hot and worse cold.

### Real-life issues
- **Cogging and ripple:** magnets pulling on the teeth; reduced by skewing, fractional-slot windings and magnet shaping — to 1–2 % of rated torque in servo motors.
- **Uncontrolled generator mode:** coasting above base speed with the drive off, the motor makes more than the bus voltage; the inverter's diodes rectify it into the bus — braking torque and overvoltage.
- **Short-circuit faults** keep making drag torque and current as long as the rotor turns.
- **Inverter effects:** bearing currents and insulation stress, as with any drive-fed motor.

> [!warn] A PMSM's terminals are live whenever its shaft turns — a pump spun by back-flowing water, a vehicle pushed or towed, a fan windmilling. Lock-out must include stopping and securing the shaft, and terminals are not opened while it can turn.

> [!key] A PMSM is a synchronous motor with magnet poles: no rotor losses and top efficiency, but it needs a position-aware drive. SPM for smooth servos; IPM for reluctance torque and a wide field-weakening range.
`,
  ideas: [
    'A PMSM is a synchronous motor with magnets on the rotor: no slip, no rotor current, top efficiency, also at part load.',
    'It needs a drive that knows the rotor angle; it cannot start on the mains unless it has a cage (line-start).',
    'Surface magnets: Ld ≈ Lq, smooth magnet torque for servos. Interior magnets: Lq > Ld adds reluctance torque with negative id.',
    'Back-EMF grows with speed; above base speed the drive weakens the field with negative id.',
    'NdFeB magnets weaken about 0.1 % per kelvin and can be demagnetised by heat plus a large negative current.'
  ],
  pitfalls: [
    'A PMSM can run straight off the mains like an induction motor — Without a cage it cannot start; the field sweeps past the magnets and the average torque is zero. It needs a drive (or a line-start rotor).',
    'The terminals are safe once the drive is off — The magnets make voltage whenever the shaft turns.',
    'Magnet torque is all there is — In interior-magnet motors the reluctance torque can supply a third or more of the torque; ignoring it wastes current.'
  ],
  formulas: [
    {
      name: 'Torque in the d–q frame',
      expr: 'T = 1.5*pp*(psi*iq + (Ld - Lq)*id*iq)', tex: 'T = \\tfrac{3}{2}\\,p_p\\left[\\psi_m\\,i_q + (L_d - L_q)\\,i_d\\,i_q\\right]',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        pp: { name: 'pole pairs', int: true, value: 4, tex: 'p_p' },
        psi: { name: 'magnet flux linkage', q: 'flux', unit: 'mWb', value: 80, tex: '\\psi_m' },
        iq: { name: 'q-axis current', q: 'current', unit: 'A', value: 100, tex: 'i_q' },
        Ld: { name: 'd-axis inductance', q: 'inductance', unit: 'mH', value: 0.4, tex: 'L_d' },
        Lq: { name: 'q-axis inductance', q: 'inductance', unit: 'mH', value: 1.0, tex: 'L_q' },
        id: { name: 'd-axis current', q: 'current', unit: 'A', value: -60, signed: true, tex: 'i_d' }
      },
      note: 'Amplitude-invariant d–q quantities (peak phase values). For a surface-magnet motor Ld = Lq and only the first term remains.',
      stories: { T: 'An IPM motor with {pp} pole pairs, ψ = {psi}, Ld = {Ld} and Lq = {Lq} carries id = {id} and iq = {iq}. What torque does it make?', id: 'What d-axis current makes the motor ({pp} pole pairs, ψ = {psi}, Ld = {Ld}, Lq = {Lq}) give {T} with iq = {iq}?' }
    },
    {
      name: 'Back-EMF',
      expr: 'E = psi*pp*w', tex: '\\hat E = \\psi_m\\,p_p\\,\\omega',
      vars: {
        E: { name: 'back-EMF, peak per phase', q: 'voltage', unit: 'V', tex: '\\hat E' },
        psi: { name: 'magnet flux linkage', q: 'flux', unit: 'mWb', value: 80, tex: '\\psi_m' },
        pp: { name: 'pole pairs', int: true, value: 4, tex: 'p_p' },
        w: { name: 'shaft speed', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' }
      },
      note: 'The electrical angular speed is p_p ω. The line-to-line peak is √3 times larger.',
      stories: { E: 'A motor with ψ = {psi} and {pp} pole pairs turns at {w}. What is its peak phase back-EMF?' }
    },
    {
      name: 'Speed at which the back-EMF meets the voltage limit',
      expr: 'w = Vdc/(sqrt(3)*pp*psi)', tex: '\\omega_b = \\dfrac{V_{dc}}{\\sqrt 3\\,p_p\\,\\psi_m}',
      vars: {
        w: { name: 'speed limit without field weakening', q: 'angvel', unit: 'rpm', tex: '\\omega_b' },
        Vdc: { name: 'DC bus voltage', q: 'voltage', unit: 'V', value: 350, tex: 'V_{dc}' },
        pp: { name: 'pole pairs', int: true, value: 4, tex: 'p_p' },
        psi: { name: 'magnet flux linkage', q: 'flux', unit: 'mWb', value: 80, tex: '\\psi_m' }
      },
      note: 'At no load, ignoring the resistance and inductance drops; under load the base speed is lower.',
      stories: { w: 'A motor with {pp} pole pairs and ψ = {psi} runs on a {Vdc} bus. Above what speed does it need field weakening, at most?' }
    },
    {
      name: 'Magnet remanence when hot',
      expr: 'Br = Br0*(1 + alpha/100*(Tm - T0))', tex: 'B_r = B_{r0}\\left[1 + \\alpha\\,(T_m - T_0)\\right]',
      vars: {
        Br: { name: 'remanence when hot', q: 'bfield', unit: 'T', tex: 'B_r' },
        Br0: { name: 'remanence at the reference temperature', q: 'bfield', unit: 'T', value: 1.3, tex: 'B_{r0}' },
        alpha: { name: 'temperature coefficient of remanence', q: false, unit: '%/K', value: -0.11, signed: true, tex: '\\alpha' },
        Tm: { name: 'magnet temperature', q: 'temperature', unit: '°C', value: 120, tex: 'T_m' },
        T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_0' }
      },
      note: 'Reversible loss for NdFeB (about −0.09 to −0.12 %/K); ferrite is about −0.2 %/K. The torque constant falls in proportion.',
      stories: { Br: 'An NdFeB magnet of {Br0} at {T0} warms to {Tm} (coefficient {alpha}). What is its remanence?' }
    }
  ],
  examples: [
    {
      title: 'Reluctance torque at work',
      q: 'An IPM motor has 4 pole pairs, $\\psi_m$ = 0.08 Wb, $L_d$ = 0.4 mH, $L_q$ = 1.0 mH. Compare the torque of (a) $i_d$ = −60 A, $i_q$ = 100 A with (b) the same current magnitude all on the q-axis.',
      steps: [
        '(a) Magnet part $1.5 \\times 4 \\times 0.08 \\times 100 = 48$ N·m; reluctance part $1.5 \\times 4 \\times (-0.0006)(-60)(100) = 21.6$ N·m; total 69.6 N·m.',
        '(b) $|i| = \\sqrt{60^2 + 100^2} = 116.6$ A on q: $T = 1.5 \\times 4 \\times 0.08 \\times 116.6 = 56.0$ N·m.'
      ],
      a: '69.6 against 56.0 N·m: advancing the current angle gives 24 % more torque from the same amperes.'
    },
    {
      title: 'Where field weakening begins',
      q: 'The same motor runs from a 350 V bus. Estimate the highest speed before field weakening, ignoring the voltage drops.',
      steps: [
        'Available peak phase voltage $350/\\sqrt 3 = 202$ V.',
        '$\\omega = 202/(4 \\times 0.08) = 632$ rad/s $= 6030$ rpm.',
        'With the resistance and inductance drops at full current the practical base speed is lower, perhaps 4500–5000 rpm.'
      ],
      a: 'About 6000 rpm at most; lower under load.'
    },
    {
      title: 'Hot magnets',
      q: 'A PMSM\'s magnets warm from 20 °C to 120 °C (coefficient −0.11 %/K). How do the torque constant and the copper loss for the same torque change?',
      steps: [
        '$B_r$ falls by $0.11 \\times 100 = 11$ %: the torque constant falls to 0.89 of its cold value.',
        'The same torque needs $1/0.89 = 1.12$ times the current and $1.12^2 = 1.26$ times the copper loss.'
      ],
      a: 'About 11 % weaker; 26 % more copper loss for the same torque — heat feeds on itself.'
    }
  ],
  quiz: [
    { q: 'Why is a PMSM more efficient than an induction motor of the same rating?', choices: ['No rotor current is needed: no rotor copper loss and no magnetising current', 'It runs at higher voltage', 'Its magnets add energy', 'It has no iron'], a: 0, why: 'The magnets provide the flux for free; an induction motor pays for its flux and its rotor current in copper loss.' },
    { q: 'In an interior-magnet motor, why does a negative $i_d$ raise the torque?', choices: ['Lq > Ld, so the reluctance term (Ld − Lq)·id·iq becomes positive', 'It strengthens the magnets', 'It lowers the resistance', 'It raises the DC bus'], a: 0, why: 'Both factors (Ld − Lq) and id are negative, so their product with iq adds torque.' },
    { q: 'A PMSM coasts at twice its base speed with the drive switched off. What happens?', choices: ['Its back-EMF exceeds the bus; the inverter diodes conduct, braking the motor and pumping up the bus', 'Nothing: without current there is no voltage', 'It speeds up', 'The magnets demagnetise at once'], a: 0, why: 'The diodes form a rectifier; the bus capacitors charge above their normal voltage unless something absorbs the energy.' },
    { q: 'A PMSM connected straight to the three-phase mains starts like an induction motor.', a: false, why: 'Without a cage the average starting torque is zero; only line-start PM motors have one.' },
    { q: 'The magnets warm from 20 °C to 100 °C (−0.11 %/K). The torque per ampere falls by about…', choices: ['9 %', '1 %', '30 %', 'nothing'], a: 0, why: '0.11 % × 80 K = 8.8 %.' }
  ],
  problems: [
    { q: 'A surface-magnet motor has 5 pole pairs and $\\psi_m$ = 0.04 Wb. What torque does $i_q$ = 12 A give?', answer: 3.6, unit: 'N·m', tol: 0.02, steps: ['$T = 1.5 \\times 5 \\times 0.04 \\times 12 = 3.6$ N·m.'] },
    { q: 'A motor with $\\psi_m$ = 0.1 Wb and 3 pole pairs turns at 2000 rpm. What is its peak phase back-EMF?', answer: 62.8, unit: 'V', tol: 0.02, steps: ['$\\omega = 2000 \\times 2\\pi/60 = 209.4$ rad/s.', '$\\hat E = 0.1 \\times 3 \\times 209.4 = 62.8$ V.'] }
  ],
  choose: {
    good: [
      'Highest efficiency, also at part load: pumps, fans and compressors running long hours (IE4–IE5).',
      'Compact, high-torque drives: EV traction (IPM), servo axes and robot joints (SPM).',
      'Exact speed without slip, several machines in step.'
    ],
    avoid: [
      'Fixed-speed drives on the mains without a drive — use an induction or a line-start PM motor.',
      'Very hot surroundings or fault-prone duty without magnets rated for it.',
      'Machines whose shaft may be driven with the drive off, unless the generated voltage is managed.'
    ],
    check: [
      'The drive: FOC with the motor\'s parameters, and an encoder, resolver or a sensorless mode down to your lowest speed.',
      'Magnet grade and the maximum rotor temperature; the drive\'s demagnetising-current limit.',
      'Base speed and field-weakening range at your bus voltage; cogging and ripple for smooth motion.',
      'Behaviour when back-driven: coasting, towing, windmilling.'
    ]
  },
  applications: [
    'Electric cars and buses: interior-magnet traction motors of 50–300 kW with field weakening to 10 000–20 000 rpm.',
    'AC servo motors: surface-magnet PMSMs with encoders, from 50 W to about 15 kW.',
    'Premium pumps, fans and compressors: PMSMs on drives reaching IE5.'
  ],
  history: 'PM synchronous motors became practical with rare-earth magnets — samarium–cobalt in the 1970s and neodymium–iron–boron from the mid-1980s — together with transistor inverters and microprocessor control. They now dominate servo drives and electric-vehicle traction.',
  sources: [
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: SPM and IPM rotors, saliency, field weakening and demagnetisation.',
    'Mohan, *Electric Drives*: PM synchronous motor drives.',
    'IEC 60034-30-1 (efficiency classes of line-operated AC motors) and IEC TS 60034-30-2 (efficiency classes of variable-speed AC motors, including IE5).'
  ],
  sim: 'bl-pmsm'
},

{
  id: 'reluctance-motors', parent: 'sync-topic', title: 'Synchronous and switched reluctance motors', level: 2,
  short: 'Motors with no magnets and no rotor winding: a shaped steel rotor turns to line up with the field, because the magnetic circuit seeks the least reluctance. The synchronous reluctance motor runs on a VFD with a sine-wave field; the switched reluctance motor pulses its phases one after another.',
  keywords: ['reluctance torque', 'synchronous reluctance', 'SynRM', 'switched reluctance', 'SRM', 'saliency ratio', 'flux barriers', 'asymmetric half-bridge', '6/4', '8/6', 'PM-assisted', 'no magnets', 'torque ripple', 'acoustic noise', 'stroke angle'],
  prereq: ['magnetic-circuits', 'rotating-field', 'pmsm-motor'],
  related: ['stepper-types', 'foc-control', 'vector-control-vfd', 'efficiency-classes', 'motors-vehicles', 'motors-pumps-fans'],
  body: `
Hold a piece of iron near a magnet and it swings into line with the field: the flux prefers the easy path, and the stored magnetic energy is least when the gap is smallest. That is **reluctance torque**. A rotor shaped to have an easy direction (the d-axis) and a hard one (the q-axis) is pulled round by a rotating field — no magnets, no rotor copper, nothing on the rotor but steel.

### The synchronous reluctance motor (SynRM)
The stator is an ordinary three-phase distributed winding, as in an induction motor. The rotor is a stack of laminations cut with **flux barriers** — curved slots that leave iron paths along the d-axis and block the q-axis. The torque is

$$T = \\tfrac{3}{2}\\,p_p\\,(L_d - L_q)\\,i_d\\,i_q = \\tfrac{3}{4}\\,p_p\\,(L_d - L_q)\\,I^2\\sin 2\\beta$$

largest (ignoring saturation) when the current vector sits 45° from the d-axis. The **saliency ratio** $L_d/L_q$ decides almost everything: 5–10 in good designs. With no rotor currents the rotor runs cool and its bearings last longer; industrial SynRMs reach IE4 (some IE5) in the standard IEC frames of induction motors and keep their efficiency at part load. The weaknesses: the stator must magnetise the rotor, so the **power factor is lower** (about 0.6–0.8) and the drive must be sized for more current; the rotor needs careful design against torque ripple; and it **must run on a VFD** with a suitable control mode. **PM-assisted** SynRMs put ferrite magnets in the barriers to raise the power factor and torque.

### The switched reluctance motor (SRM)
Here both stator and rotor have salient teeth — for example 6 stator poles and 4 rotor poles (6/4), 8/6 or 12/8. Each opposite pair of stator poles carries a concentrated coil; the rotor is plain laminated steel. Energise one phase and the nearest rotor pair swings into line; switch to the next phase before it arrives and it keeps turning. The torque of one phase is

$$T = \\tfrac12\\,i^2\\,\\frac{dL}{d\\theta}$$

— proportional to the current squared and to how fast the inductance rises as the teeth approach (a [[?derivative|derivative]]), whatever the current's direction. So the converter needs only one-way current: an **asymmetric half-bridge** per phase (two switches, two diodes). The rotor advances one **stroke** per phase pulse, $360°/(m\\,N_r)$: 30° for a three-phase 6/4 motor, 15° for a four-phase 8/6.

| | SynRM | SRM |
|---|---|---|
| Stator | distributed three-phase | concentrated coils on salient poles |
| Rotor | laminations with flux barriers | salient steel teeth |
| Current | sinusoidal, from a VFD | one-way pulses, special converter |
| Efficiency | IE4 class | good at high speed |
| Weak points | power factor 0.6–0.8 | torque ripple, acoustic noise |
| Strong points | standard drives and frames, cool rotor | rugged, heat-tolerant, very high speed, a failed phase leaves the others working |
| Uses | pumps, fans, compressors, conveyors | some appliances, mining and traction machines, high-speed and aerospace drives |

The SRM's plain rotor survives heat and speeds that would wreck magnets or a cage. But the teeth snapping into line also pull the stator inwards at every stroke: large **radial forces** make it noisy, and the pulsed torque ripples unless the current is carefully shaped.

The simulation shows a 6/4 motor: the phases fire in turn, each pulling the nearest rotor teeth into line; the graph shows the inductance rising as the teeth approach, the current pulse and its torque. Fire too late — after the teeth have lined up — and the torque turns negative.

> [!tip] Pure reluctance motors have no magnets, so there are no rare-earth costs and no voltage at the terminals when the load turns the shaft with the drive off (PM-assisted designs do make some).

> [!key] Reluctance torque comes from iron seeking the easy magnetic path: SynRMs use it with sine currents on a VFD (efficient and cool, with a lower power factor); SRMs pulse salient poles one after another (rugged and fast, but noisy).
`,
  ideas: [
    'Reluctance torque pulls a rotor with an easy magnetic direction into line with the field; the rotor needs no magnets or winding.',
    'SynRM torque is ¾ p_p (Ld − Lq) I² sin 2β: the saliency ratio Ld/Lq decides its performance.',
    'SynRMs reach IE4 with a cool rotor but have a lower power factor, so the drive must supply more current.',
    'SRM torque is ½ i² dL/dθ, independent of the current\'s sign: one-way pulses from an asymmetric half-bridge.',
    'SRMs are rugged and fast but noisy and rippling; firing too late makes negative torque.'
  ],
  pitfalls: [
    'A synchronous reluctance motor can be started on the mains — A plain SynRM needs a VFD; only line-start versions with a cage start direct on line.',
    'A reluctance motor is just a stepper — Variable-reluctance steppers use the same force, but SRMs and SynRMs are driven with position feedback for continuous rotation and power.',
    'A lower power factor means a lower efficiency — The magnetising current is reactive: it loads the drive and cables but adds only its copper loss; SynRMs are efficient, just current-hungry.'
  ],
  formulas: [
    {
      name: 'Torque of a synchronous reluctance motor',
      expr: 'T = 0.75*pp*(Ld - Lq)*I^2*sin(2*beta)', tex: 'T = \\tfrac{3}{4}\\,p_p\\,(L_d - L_q)\\,I^2\\sin 2\\beta',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        pp: { name: 'pole pairs', int: true, value: 2, tex: 'p_p' },
        Ld: { name: 'd-axis (easy) inductance', q: 'inductance', unit: 'mH', value: 85, tex: 'L_d' },
        Lq: { name: 'q-axis (hard) inductance', q: 'inductance', unit: 'mH', value: 12, tex: 'L_q' },
        I: { name: 'phase current (peak)', q: 'current', unit: 'A', value: 21 },
        beta: { name: 'current angle from the d-axis', q: 'angle', unit: '°', value: 55, min: 0, max: 90, tex: '\\beta' }
      },
      note: 'Linear (unsaturated) model: the best angle is 45°; with saturation real motors work at 55–65°.',
      stories: { T: 'A SynRM with {pp} pole pairs, Ld = {Ld} and Lq = {Lq} carries {I} at {beta} from the d-axis. What torque does it make?', I: 'What peak current makes the SynRM ({pp} pole pairs, Ld = {Ld}, Lq = {Lq}) give {T} at {beta}?' }
    },
    {
      name: 'Torque of one SRM phase',
      expr: 'T = 0.5*i^2*dL/dth', tex: 'T = \\tfrac12\\,i^2\\,\\dfrac{\\Delta L}{\\Delta\\theta}',
      vars: {
        T: { name: 'average torque over the stroke', q: 'torque', unit: 'N·m' },
        i: { name: 'phase current', q: 'current', unit: 'A', value: 10 },
        dL: { name: 'rise of inductance as the teeth align', q: 'inductance', unit: 'mH', value: 32, tex: '\\Delta L' },
        dth: { name: 'rotor angle over which it rises', q: 'angle', unit: '°', value: 30, tex: '\\Delta\\theta' }
      },
      note: 'Unsaturated average over the rising-inductance region; saturation lowers it, and current flowing while the inductance falls gives negative torque.',
      stories: { T: 'An SRM phase carries {i}; its inductance rises by {dL} over {dth} of rotation. What average torque does it make?' }
    },
    {
      name: 'SRM stroke angle',
      expr: 'eps = 2*pi/(m*Nr)', tex: '\\varepsilon = \\dfrac{360°}{m\\,N_r}',
      vars: {
        eps: { name: 'stroke angle', q: 'angle', unit: '°', tex: '\\varepsilon' },
        m: { name: 'number of phases', int: true, value: 3 },
        Nr: { name: 'number of rotor poles', int: true, value: 4, tex: 'N_r' }
      },
      note: 'The rotor turns one stroke per phase pulse; m·N_r strokes per revolution.',
      stories: { eps: 'A {m}-phase SRM has {Nr} rotor poles. How far does it turn per stroke?' }
    }
  ],
  examples: [
    {
      title: 'A 7.5 kW SynRM',
      q: 'A 4-pole SynRM has $L_d$ = 85 mH and $L_q$ = 12 mH and carries 21 A peak (14.8 A rms). What torque does it give at the ideal 45°, and how does that compare with 7.5 kW at 1500 rpm?',
      steps: [
        '$T = 0.75 \\times 2 \\times 0.073 \\times 21^2 \\times \\sin 90° = 48.3$ N·m.',
        '7.5 kW at 1500 rpm needs $7500/157.1 = 47.7$ N·m.'
      ],
      a: 'About 48 N·m — enough for 7.5 kW at 1500 rpm (saliency ratio 85/12 ≈ 7).'
    },
    {
      title: 'Strokes of an 8/6 SRM',
      q: 'A four-phase 8/6 SRM runs at 6000 rpm. Find its stroke angle, strokes per second and how often each phase pulses.',
      steps: [
        'Stroke $360°/(4 \\times 6) = 15°$; 24 strokes per revolution.',
        '6000 rpm = 100 rev/s: 2400 strokes per second.',
        'Each phase pulses once per rotor pole passing: $6 \\times 100 = 600$ times a second.'
      ],
      a: '15°; 2400 strokes/s; 600 pulses per second per phase.'
    },
    {
      title: 'What the power factor costs',
      q: 'A SynRM and an induction motor deliver the same power at the same efficiency; the SynRM\'s power factor is 0.70, the induction motor\'s 0.85. How much more current must the SynRM\'s drive supply?',
      steps: ['Current is proportional to 1/(η · pf): $0.85/0.70 = 1.21$.'],
      a: 'About 21 % more current: the drive may need to be one size larger.'
    }
  ],
  quiz: [
    { q: 'Ignoring saturation, at what current angle from the d-axis is a SynRM\'s torque per ampere largest?', choices: ['45°', '0°', '90°', '30°'], a: 0, why: 'T ∝ sin 2β, largest at β = 45°.' },
    { q: 'Why does an SRM need current in only one direction?', choices: ['Its torque depends on i², not on the current\'s sign', 'Its rotor has magnets', 'It runs on DC only', 'Its phases are in series'], a: 0, why: 'The attraction between iron teeth is the same whichever way the coil is magnetised.' },
    { q: 'The main drawback of an SRM in a household appliance is…', choices: ['acoustic noise and torque ripple', 'magnet cost', 'a low speed limit', 'rotor copper loss'], a: 0, why: 'Pulsed attraction of salient teeth excites the stator; smoothing it needs careful current shaping.' },
    { q: 'A plain synchronous reluctance motor can be started directly on the mains like an induction motor.', a: false, why: 'Without a cage there is no starting torque on average; it needs a VFD (or a line-start rotor with a cage).' },
    { q: 'Why does a SynRM draw more current than a PMSM of the same power?', choices: ['The stator also supplies the magnetising current for the rotor, lowering the power factor', 'Its rotor has copper losses', 'It runs faster', 'Its efficiency is 50 %'], a: 0, why: 'A PMSM\'s magnets provide the flux; a SynRM\'s must come from the stator current.' }
  ],
  problems: [
    { q: 'What is the stroke angle of a three-phase 12/8 SRM?', answer: 15, unit: '°', tol: 0.01, steps: ['$\\varepsilon = 360°/(3 \\times 8) = 15°$.'] },
    { q: 'A SynRM has 2 pole pairs, $L_d - L_q$ = 50 mH and carries 20 A peak at 45°. What torque does it give?', answer: 30, unit: 'N·m', tol: 0.02, steps: ['$T = 0.75 \\times 2 \\times 0.05 \\times 400 \\times 1 = 30$ N·m.'] }
  ],
  choose: {
    good: [
      'SynRM: pumps, fans, compressors and conveyors on a VFD, where IE4 without magnets and a cool rotor pay off.',
      'SRM: harsh, hot or very fast drives (mining machines, high-speed blowers, starter-generators), where a plain steel rotor is an asset.',
      'Magnet-free supply chains, and no generated voltage when the load back-drives the shaft.'
    ],
    avoid: [
      'Direct-on-line operation — use an induction or line-start motor.',
      'Quiet, smooth drives with an SRM, unless noise and ripple are designed out.',
      'Drives that lack a SynRM control mode, or small drives where the extra current costs a larger inverter.'
    ],
    check: [
      'That the drive supports the motor type (a SynRM mode, or an SRM converter).',
      'Power factor and current at your load: size the drive for current, not kilowatts.',
      'Noise and torque ripple (SRM); efficiency at your part-load points.'
    ]
  },
  applications: [
    'Water and HVAC pumps and fans: SynRM packages with matched drives at IE4.',
    'Mining and heavy vehicles, and some appliances: switched reluctance drives valued for their rugged rotor.',
    'Textile machines: many small reluctance motors kept in step on one inverter.'
  ],
  history: 'Reluctance is among the oldest motor principles: the electromagnetic engines of the 1830s and 1840s pulled iron bars with switched electromagnets. Modern switched reluctance drives came with power transistors in the 1970s–80s, and industrial synchronous reluctance motors with high-saliency rotors became catalogue products in the 2010s.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: synchronous, reluctance and switched reluctance motors.',
    'Miller, *Switched Reluctance Motors and Their Control*: SRM principles, converters and noise.',
    'IEC 60034-30-1 and IEC TS 60034-30-2: efficiency classes.'
  ],
  sim: 'bl-reluctance'
},

{
  id: 'hysteresis-motor', parent: 'sync-topic', title: 'The hysteresis motor', level: 2,
  short: 'A small synchronous motor whose rotor is a plain ring of semi-hard magnetic steel. The rotating field magnetises the ring, and hysteresis makes the ring\'s magnetisation lag the field by a fixed angle — so the torque is the same from standstill all the way to synchronous speed. Smooth and silent, but weak and inefficient.',
  keywords: ['hysteresis motor', 'hysteresis loop', 'lag angle', 'semi-hard magnetic material', 'constant torque', 'synchronous', 'self-starting', 'gyroscope', 'tape capstan', 'turntable', 'timing motor', 'overexcitation', 'loop area'],
  prereq: ['rotating-field', 'magnetic-circuits', 'synchronous-motor'],
  related: ['shaded-pole-motor', 'psc-motor', 'pmsm-motor', 'reluctance-motors', 'physics:magnetic-materials'],
  body: `
Magnetise a piece of steel back and forth and it follows its **hysteresis loop**: the magnetisation lags behind the field, and the area of the loop is energy turned into heat every cycle. In a transformer that is a nuisance; the **hysteresis motor** turns it into torque.

### How it works
The stator is an ordinary AC winding — three-phase, capacitor-run single-phase, or shaded-pole in the smallest — making a rotating field. The rotor is a **ring of semi-hard magnetic material** (cobalt steels and similar alloys, chosen for a fat loop) on a non-magnetic hub. As the field sweeps past, each bit of the ring is magnetised, but because of hysteresis its magnetisation lags the field by a **lag angle** $\\gamma$. The ring's poles therefore always trail the field's poles by the same angle, whatever the slip, and the field drags them round with a **constant torque**.

An energy balance gives the torque. The ring (volume $V_r$, loop area $W_h$ joules per cubic metre per cycle) is swept by the field at the slip frequency $s f$ and loses $W_h V_r\\,s f$ watts. That loss is the slip's share of the air-gap power $T\\omega_s$, so $T\\omega_s\\,s = W_h V_r\\,s f$ and, with $\\omega_s = 2\\pi f/p_p$,

$$T = \\frac{p_p\\,V_r\\,W_h}{2\\pi}$$

— independent of slip, from standstill to synchronism. A ring of 9 cm³ with an assumed loop area of 20 kJ/m³ in a 4-pole motor gives about 0.06 N·m.

At synchronous speed the ring sees a steady field and simply stays magnetised: the motor becomes a **permanent-magnet synchronous motor** whose magnet was made on the spot. It locks in at whatever angle it arrives — so it pulls into step smoothly, without a jerk, with any load up to its hysteresis torque and any inertia, given time.

### The character this gives
- **Smooth and silent:** a smooth ring with no cage bars, no teeth to cog and no pulsating torque — why hysteresis motors drove tape capstans, turntables and film transports, and still drive gyroscopes, instruments and timing drives.
- **Constant torque up to synchronism:** it brings a large inertia smoothly to speed — gyroscope rotors at 12 000–24 000 rpm on 400 Hz supplies.
- **Weak and wasteful:** the same loop that makes the torque turns all the slip power into heat in the rotor, and the large magnetising current gives a poor power factor; efficiency is well below an induction motor's of the same size. Ratings run from milliwatts to a few hundred watts.
- **Overexcitation:** a brief voltage boost after synchronising magnetises the ring harder, raising efficiency and power factor.
- **Hunting:** with no cage to damp it, the rotor can swing about its synchronous position; some designs add a light damper.

| Compared with | The hysteresis motor |
|---|---|
| Induction motor | exactly synchronous; constant torque from zero speed; smoother; weaker and less efficient |
| Reluctance motor | self-starting without a cage; locks at any angle; smooth pull-in |
| PMSM | no magnets to fit; starts on the mains without a drive; far less torque per kilogram |

In the simulation the ring's magnetisation (the arrows) lags the field, and one small piece of the ring traces its B–H loop — drawn as an idealised ellipse of the same area. As the rotor approaches synchronous speed the trace slows; at synchronism it stops at one point of the loop: the ring has become a magnet. The torque–speed curve is flat to the end.

> [!key] A hysteresis motor's torque comes from the lag of the rotor's magnetisation behind the field: the same from standstill to synchronism, smooth and silent, but small and inefficient.
`,
  ideas: [
    'The rotor is a ring of semi-hard magnetic material; its magnetisation lags the rotating field by the hysteresis lag angle.',
    'Torque = p_p V_r W_h / 2π: set by the loop area and ring volume, independent of slip.',
    'At synchronous speed the ring stays magnetised and the motor runs as a PM synchronous motor, locked at any angle.',
    'It is smooth, silent and self-starting, but weak, inefficient and of low power factor.',
    'During run-up all the slip power becomes heat in the ring.'
  ],
  pitfalls: [
    'A hysteresis motor has slip like an induction motor — It accelerates with constant torque and then runs exactly at synchronous speed.',
    'Hysteresis losses are always bad — Here the loop area is exactly what makes the torque; a fatter loop means more torque (and more heat while slipping).',
    'It is efficient because it is synchronous — Magnetising the ring costs a large reactive current and, while slipping, all the slip power is lost; efficiency is low.'
  ],
  formulas: [
    {
      name: 'Hysteresis torque',
      expr: 'T = pp*Vr*Wh/(2*pi)', tex: 'T = \\dfrac{p_p\\,V_r\\,W_h}{2\\pi}',
      vars: {
        T: { name: 'torque (standstill to synchronism)', q: 'torque', unit: 'mN·m' },
        pp: { name: 'pole pairs', int: true, value: 2, tex: 'p_p' },
        Vr: { name: 'volume of the hysteresis ring', q: 'volume', unit: 'cm³', value: 9, tex: 'V_r' },
        Wh: { name: 'hysteresis loop area (energy per cycle per volume)', q: 'energydensity', unit: 'kJ/m³', value: 20, tex: 'W_h' }
      },
      note: 'From the energy balance: the ring\'s hysteresis loss at slip frequency equals the slip power. W_h is the loop area at the flux density the stator actually drives through the ring.',
      stories: { T: 'A hysteresis motor with {pp} pole pairs has a ring of {Vr} with a loop area of {Wh}. What torque does it give?', Vr: 'A {pp}-pole-pair hysteresis motor with a loop area of {Wh} must give {T}. What ring volume does it need?' }
    },
    {
      name: 'Heat in the ring while slipping',
      expr: 'Ph = Wh*Vr*s*f', tex: 'P_h = W_h\\,V_r\\,s\\,f',
      vars: {
        Ph: { name: 'hysteresis loss in the rotor', q: 'power', unit: 'W', tex: 'P_h' },
        Wh: { name: 'loop area', q: 'energydensity', unit: 'kJ/m³', value: 20, tex: 'W_h' },
        Vr: { name: 'ring volume', q: 'volume', unit: 'cm³', value: 9, tex: 'V_r' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 100 },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 }
      },
      note: 'At standstill (s = 100 %) the whole air-gap power heats the ring; at synchronism the loss disappears.',
      stories: { Ph: 'A hysteresis ring of {Vr} with a loop area of {Wh} slips at {s} on {f}. How much heat does it make?' }
    }
  ],
  examples: [
    {
      title: 'The torque of a small hysteresis motor',
      q: 'A 4-pole, 50 Hz hysteresis motor has a ring 40 mm outside, 32 mm inside and 20 mm long; assume a loop area of 20 kJ/m³. Find its torque and its output at synchronous speed.',
      steps: [
        '$V_r = \\tfrac{\\pi}{4}(0.040^2 - 0.032^2) \\times 0.020 = 9.05$ cm³.',
        '$T = 2 \\times 9.05\\times10^{-6} \\times 20\\,000/(2\\pi) = 0.058$ N·m.',
        'At 1500 rpm (157 rad/s): $P = 0.058 \\times 157 = 9.1$ W.'
      ],
      a: 'About 58 mN·m and 9 W — a small instrument motor.'
    },
    {
      title: 'Heat during the run-up',
      q: 'The same motor is held at standstill (a stalled capstan). How much heat does its ring make, and how does that compare with its output at speed?',
      steps: ['$P_h = 20\\,000 \\times 9.05\\times10^{-6} \\times 1 \\times 50 = 9.1$ W — equal to the output at synchronism.', 'At half speed half of it; at synchronism none.'],
      a: 'About 9 W at standstill: a long stall or a very slow run-up heats the rotor.'
    }
  ],
  quiz: [
    { q: 'Why is a hysteresis motor\'s torque the same at every speed below synchronism?', choices: ['The magnetisation\'s lag angle, set by the loop, does not depend on slip', 'Its current is regulated', 'Its rotor has a cage', 'Friction balances it'], a: 0, why: 'The ring\'s poles trail the field by the same hysteresis angle whatever the slip frequency.' },
    { q: 'At synchronous speed a hysteresis rotor behaves like…', choices: ['a permanent magnet locked to the field', 'an induction rotor with slip', 'a toothed reluctance rotor', 'a DC armature'], a: 0, why: 'It sees a steady field and keeps the magnetisation it was given.' },
    { q: 'Why did tape recorders use hysteresis motors for the capstan?', choices: ['Smooth, cog-free torque at an exact, constant speed', 'High power density', 'High efficiency', 'Cheap magnets'], a: 0, why: 'Wow and flutter come from speed ripple; a hysteresis motor has none of the cage or tooth pulsations.' },
    { q: 'A hysteresis motor is more efficient than an induction motor of the same size.', a: false, why: 'It needs a large magnetising current and wastes all slip power in the ring; its virtues are smoothness and exact speed.' }
  ],
  problems: [
    { q: 'A hysteresis motor has 1 pole pair, a ring of 4 cm³ and a loop area of 30 kJ/m³. What torque does it give?', answer: 19.1, unit: 'mN·m', tol: 0.02, steps: ['$T = 1 \\times 4\\times10^{-6} \\times 30\\,000/(2\\pi) = 0.0191$ N·m.'] }
  ],
  choose: {
    good: [
      'Smooth, silent, exactly synchronous drives of small power: capstans, turntables, instruments, timing and chart drives.',
      'High-inertia rotors that must be brought smoothly to synchronous speed: gyroscopes, small centrifuges.',
      'Several shafts kept exactly in step from one supply.'
    ],
    avoid: [
      'Anything needing power or efficiency: above a few hundred watts use a PMSM or an induction motor with a drive.',
      'Battery equipment (poor efficiency, needs AC).',
      'Heavy or varying loads: the running and pull-in torque are small.'
    ],
    check: [
      'The hysteresis torque against load plus acceleration torque.',
      'Rotor heating in long run-ups or stalls: all slip power becomes heat.',
      'Supply frequency (speed = 120 f/p), power factor and hunting in precision drives.'
    ]
  },
  applications: [
    'Gyroscopes in instruments: hysteresis motors at 400 Hz, running rotors up smoothly to 12 000–24 000 rpm.',
    'Tape, film and turntable drives of the mid-twentieth century; timing and chart drives.',
    'Small centrifuges and laboratory stirrers needing smooth, exact speed.'
  ],
  history: 'Hysteresis motors were widely used in the mid-twentieth century in electric clocks and timers, gyroscopes and sound and film recording, where smoothness and exact speed mattered more than efficiency. Brushless DC motors with electronic speed control have replaced most of them.',
  sources: [
    'Chapman, *Electric Machinery Fundamentals*: the chapter on single-phase and special-purpose motors (reluctance and hysteresis motors).',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: magnetic materials, hysteresis loops and hysteresis loss.'
  ],
  sim: 'bl-hysteresis'
},

{
  id: 'line-start-pm', parent: 'sync-topic', title: 'Line-start permanent-magnet motors', level: 2,
  short: 'An induction-motor cage and a set of buried magnets in one rotor: it starts direct on line like an induction motor, then pulls into step and runs synchronously with no slip — IE4-class efficiency without a drive. It struggles with high-inertia loads, and its exact speed can make a fan or pump take more power.',
  keywords: ['line-start permanent magnet', 'LSPM', 'LSPMSM', 'direct on line', 'IE4', 'synchronisation', 'pull-in', 'magnet braking torque', 'cage', 'inertia limit', 'affinity laws', 'fixed speed', 'pulsating torque'],
  prereq: ['pmsm-motor', 'squirrel-cage', 'dol-starting'],
  related: ['synchronous-motor', 'efficiency-classes', 'motors-pumps-fans', 'vfd-energy-saving', 'hydraulics:affinity-laws', 'torque-slip-curve'],
  body: `
Most fans, pumps and compressors run at one speed, straight off the mains, and an induction motor is the cheap way to do it — with slip, rotor copper loss and a magnetising current. A **line-start PM motor** (LSPM) keeps the induction motor's squirrel cage for starting and adds permanent magnets buried in the rotor iron inside it. It starts like an induction motor, then locks into synchronism and runs like a [[pmsm-motor|PMSM]] — without a drive.

### Starting: three torques at once
While the rotor slips, three things act on it:
1. **The cage torque** — the induction motor's asynchronous torque, pulling the rotor towards synchronous speed.
2. **The magnet braking torque** — the moving magnets induce voltages in the stator, which the stiff supply short-circuits; like a generator into a short, they brake the rotor, most strongly at low speed.
3. **A pulsating torque** at the slip frequency, from the magnets passing the stator field — averaging zero, felt as vibration and heard as a growl during run-up.

So the starting torque is lower than a comparable induction motor's, the run-up rougher, and the starting current similar, 6–9 × rated. Near synchronous speed the pulsating torque becomes slow enough to **pull the rotor into step**: within one slow swing of the pulsation the rotor must gain the last few per cent of speed. A heavy inertia or a heavy load prevents it: the rotor keeps slipping, with large torque pulsations and heating — **failure to synchronise**. Makers therefore state the largest load inertia and load torque their motor can synchronise.

### Running
Once in step there is no rotor current and no slip, and much less magnetising current: efficiency reaches IE4 (sometimes IE5) in the frame of an IE2/IE3 induction motor, with a higher power factor. The speed is exact — 1500 rpm on 50 Hz with 4 poles, not 1450.

That extra speed is a trap on fans and centrifugal pumps. Their power rises with the [[?exponent|cube]] of speed ([[hydraulics:affinity-laws|the affinity laws]]):

$$\\frac{P_2}{P_1} = \\left(\\frac{n_2}{n_1}\\right)^3$$

A fan that took 7.0 kW at 1450 rpm takes $7.0 \\times (1500/1450)^3 = 7.75$ kW at 1500 rpm: 11 % more shaft power, which can more than eat the motor's efficiency gain — unless the impeller is trimmed or the pulley changed so the flow stays as it was. The flow also rises by 3.4 %, which may or may not be wanted.

### Limits and faults
| Issue | Why | What to do |
|---|---|---|
| Fails to synchronise, runs rough and hot | load inertia or torque too high at pull-in | check the maker's limits; unload the start |
| Falls out of step on a dip or overload | pull-out exceeded; the cage then runs it asynchronously | check the supply; keep a torque margin |
| Weaker after a fault | large currents on a hot rotor partly demagnetise the magnets | magnet grade, protection settings |
| Draws more power than the old motor | exact synchronous speed on a fan or pump | trim the impeller or change the pulley |

LSPMs suit constant-speed fans, pumps and compressors from fractional kilowatts to a few tens of kilowatts that start seldom and have modest inertia. On a VFD a PMSM with a proper drive is better; for frequent starts or heavy inertia, an induction motor.

In the simulation press *Start*: the speed rises on the cage torque, dips where the magnet braking bites, wobbles with the pulsating torque and — if load and inertia allow — locks at synchronous speed. Raise the inertia until it fails to synchronise.

> [!warn] Like every PM motor, an LSPM generates voltage whenever its shaft turns — a pump spun backwards by returning water, a fan windmilling in a draught — so its terminals can be live with the supply isolated. Stop and secure the shaft before work; mains wiring is for qualified electricians.

> [!key] A line-start PM motor starts on its cage and runs on its magnets: IE4 efficiency without a drive, if the load's inertia lets it pull into step — and exact synchronous speed makes fans and pumps work harder.
`,
  ideas: [
    'An LSPM has a squirrel cage for starting and buried magnets for synchronous running.',
    'During run-up the cage torque is reduced by magnet braking and overlaid with a pulsating torque at slip frequency.',
    'It pulls into step only if the load inertia and torque are small enough; otherwise it keeps slipping and overheats.',
    'Running synchronously it has no rotor loss: IE4-class efficiency direct on line.',
    'On fans and pumps the higher, exact speed raises the load power with the cube of speed.'
  ],
  pitfalls: [
    'An LSPM is a drop-in replacement for any induction motor — Not for high-inertia or loaded starts, frequent starting, or where the load\'s power rises with speed and nothing is adjusted.',
    'Higher efficiency always means lower energy use — On a fan or pump the 3–4 % higher speed can add 10 % or more to the shaft power.',
    'Once synchronised it stays synchronised — A voltage dip or overload can pull it out of step; it then runs roughly on the cage until it resynchronises or trips.'
  ],
  formulas: [
    {
      name: 'Affinity law for power',
      expr: 'P2 = P1*(n2/n1)^3', tex: 'P_2 = P_1\\left(\\dfrac{n_2}{n_1}\\right)^3',
      vars: {
        P2: { name: 'power at the new speed', q: 'power', unit: 'kW', tex: 'P_2' },
        P1: { name: 'power at the old speed', q: 'power', unit: 'kW', value: 7, tex: 'P_1' },
        n2: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 1500, tex: 'n_2' },
        n1: { name: 'old speed', q: 'angvel', unit: 'rpm', value: 1450, tex: 'n_1' }
      },
      note: 'Centrifugal fans and pumps on a system without static head; with static head the rise is different but still steep.',
      stories: { P2: 'A fan takes {P1} at {n1}. What does it take when an LSPM drives it at {n2}?' }
    },
    {
      name: 'Rotor copper loss of an induction motor (what the LSPM saves)',
      expr: 'Pr = s*Pag', tex: 'P_{r} = s\\,P_{ag}',
      vars: {
        Pr: { name: 'rotor copper loss', q: 'power', unit: 'W', tex: 'P_{r}' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 3.3 },
        Pag: { name: 'air-gap power', q: 'power', unit: 'kW', value: 7.75, tex: 'P_{ag}' }
      },
      note: 'Of the power crossing the air gap, the fraction s is lost in the cage. Running synchronously, the LSPM\'s cage carries no current.',
      stories: { Pr: 'An induction motor with {Pag} crossing its air gap runs at {s} slip. How much does its rotor lose?' }
    },
    {
      name: 'Energy of a start',
      expr: 'E = 0.5*J*w^2', tex: 'E = \\tfrac12\\,J\\,\\omega^2',
      vars: {
        E: { name: 'kinetic energy at synchronous speed', q: 'energy', unit: 'kJ' },
        J: { name: 'inertia of rotor and load', q: 'inertia', unit: 'kg·m²', value: 0.2 },
        w: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega' }
      },
      note: 'Accelerating a pure inertia, a cage dissipates about as much again as heat in the rotor — so large inertias heat the rotor as well as making synchronisation hard.',
      stories: { E: 'A fan and rotor of {J} are brought to {w}. How much kinetic energy do they store?' }
    }
  ],
  examples: [
    {
      title: 'The fan trap',
      q: 'A fan takes 7.5 kW at 1450 rpm from an IE3 induction motor (90.4 % efficient). An IE4 LSPM (92.6 %) replaces it and runs at 1500 rpm. Compare the electrical input with and without trimming the fan back to its old speed-equivalent duty.',
      steps: [
        'Before: $7.5/0.904 = 8.30$ kW.',
        'LSPM, untrimmed: the fan now takes $7.5 \\times (1500/1450)^3 = 8.30$ kW of shaft power; input $8.30/0.926 = 8.97$ kW — 0.67 kW more than before.',
        'LSPM with the fan trimmed to the old duty: $7.5/0.926 = 8.10$ kW — 0.20 kW less, about 1200 kWh saved in 6000 h a year.'
      ],
      a: 'Untrimmed it uses more energy; trimmed it saves about 0.2 kW (2.4 %).'
    },
    {
      title: 'What the slip costs an induction motor',
      q: 'An induction motor has 7.75 kW crossing its air gap at 3.3 % slip. How much is lost in the rotor, and what becomes of that loss in an LSPM?',
      steps: ['$P_r = 0.033 \\times 7750 = 256$ W.', 'Running synchronously the LSPM\'s cage carries no current: that loss disappears, and the magnets also cut the magnetising current and its stator copper loss.'],
      a: 'About 260 W saved in the rotor, plus some stator loss.'
    },
    {
      title: 'The heat of a start',
      q: 'A motor and fan of 0.2 kg·m² in total are started direct on line to 1500 rpm. How much energy is stored, and how much heats the rotor?',
      steps: ['$\\omega = 157$ rad/s; $E = 0.5 \\times 0.2 \\times 157^2 = 2.47$ kJ.', 'The cage dissipates roughly the same again, about 2.5 kJ, in a few seconds — plus the losses from the magnet braking.'],
      a: 'About 2.5 kJ stored and roughly as much again as rotor heat per start.'
    }
  ],
  quiz: [
    { q: 'Why is the starting torque of an LSPM lower than that of a similar induction motor?', choices: ['The magnets induce stator currents that brake the rotor during run-up', 'It has no cage', 'It starts on a VFD', 'Its magnets are weak at standstill'], a: 0, why: 'The moving magnets act as a generator short-circuited by the supply, producing a braking torque, strongest at low speed.' },
    { q: 'A 1450 rpm induction motor on a centrifugal pump is replaced by a 1500 rpm LSPM. The pump\'s power rises by about…', choices: ['11 %', '3.4 %', '0 %', '30 %'], a: 0, why: '(1500/1450)³ = 1.107.' },
    { q: 'What can stop an LSPM pulling into synchronism?', choices: ['Too much load inertia or load torque near synchronous speed', 'Too little load', 'A supply at exactly 50 Hz', 'A cold rotor'], a: 0, why: 'The rotor must gain the last few per cent of speed within one swing of the pulsating torque; a heavy inertia or load prevents it.' },
    { q: 'Once running, an LSPM has slip like an induction motor, only a little less.', a: false, why: 'Once synchronised it has no slip at all; its cage carries no current.' }
  ],
  problems: [
    { q: 'A pump takes 15 kW at 2900 rpm. What does it take at 3000 rpm?', answer: 16.6, unit: 'kW', tol: 0.02, steps: ['$P_2 = 15 \\times (3000/2900)^3 = 15 \\times 1.107 = 16.6$ kW.'] }
  ],
  choose: {
    good: [
      'Constant-speed fans, pumps and compressors run direct on line for many hours: IE4 efficiency without a VFD.',
      'Replacing induction motors where an efficiency class is required and speed control is not.',
      'Several machines that must run at exactly the same speed from one supply.'
    ],
    avoid: [
      'High-inertia loads (large fans, flywheels) and loaded starts beyond the maker\'s synchronisation limits.',
      'Frequent starting and stopping.',
      'Speed control — use a PMSM or an induction motor with a VFD.'
    ],
    check: [
      'The maker\'s maximum load inertia and synchronising torque against your load.',
      'The load\'s power at synchronous speed (fans and pumps: the cube law) — trim the impeller or change the pulley.',
      'Starting current and the voltage dip on your supply; protection settings and behaviour after a dip.'
    ]
  },
  applications: [
    'HVAC fans and circulating pumps run direct on line where IE4 is required.',
    'Textile and fibre machines needing many motors in exact step on one supply.',
    'Compressors running continuously at a fixed speed.'
  ],
  sources: [
    'IEC 60034-30-1, *Efficiency classes of line-operated AC motors (IE code)*, whose scope includes line-start PM motors.',
    'IEC 60034-12, *Starting performance of single-speed three-phase cage induction motors* — the comparison for starting current and torque.',
    'Hughes and Drury, *Electric Motors and Drives*: synchronous and PM motors.'
  ],
  sim: 'bl-line-start'
}
);
