/* HYPER-PNEUMATICS · content/electro.js — Electro-pneumatics:
 *   electrical-control  solenoids and relays, relay ladder diagrams, sensors, PLC control, fieldbus and IO-Link, safety functions
 *   proportional-pneu   proportional pressure regulators, servo-pneumatic positioning, digital pneumatics and condition monitoring
 * Simulations in sims/electro.js (prefix ep-). */
Hyper.add(

/* ================================================================ SOLENOIDS AND RELAYS */
{
  id: 'solenoids-relays', parent: 'electrical-control', title: 'Solenoids and relays', level: 1,
  short: 'The coil that turns an electrical signal into air: a solenoid pulls an armature to open a pilot valve, a relay pulls one to switch contacts. Typical coils run on 24 V DC and draw 0.5–5 W; they take a few milliseconds to pull in, hold on less power than they need to pull in, and kick back a voltage spike when switched off.',
  keywords: ['solenoid', 'coil', 'armature', 'plunger', 'pilot valve', '24 V DC', 'pull-in', 'holding power', 'PWM', 'inrush current', 'suppression diode', 'flyback diode', 'Zener', 'varistor', 'relay', 'contactor', 'normally open', 'normally closed', 'changeover', 'self-holding', 'force-guided contacts', 'switching time'],
  prereq: ['solenoid-valves', 'physics:solenoid', 'electronics:relays'],
  related: ['ladder-diagrams', 'valve-terminals', 'plc-control', 'safety-functions', 'electronics:flyback-diode', 'electronics:pwm', 'electronics:rl-transient', 'physics:inductance'],
  body: `
Between a controller and the air sits a coil of copper wire. Energise it and it magnetises an iron circuit and pulls a plunger — the **armature** — against a spring. In a small direct-acting valve the armature itself lifts the seal off its seat; in the far more common **pilot-operated** valve it only opens a pilot seat of 0.5–1 mm, and the supply air then shifts the main spool (see [[solenoid-valves]]). A **relay** is the same machine switching electrical contacts instead of air. Both are [[physics:solenoid|solenoids]]: their force comes from the current, their timing from the coil's [[physics:inductance|inductance]].

### The coil in numbers
Machine controls run on **24 V DC**, a protective extra-low voltage that suits the transistor outputs of controllers; 12 V DC and 24, 110 or 230 V AC coils also exist. A coil's resistance follows from its rating, $P = V^2/R$: a 2.5 W coil at 24 V has 230 Ω and draws 104 mA.

| Coil | Typical power | Current at 24 V |
|---|---|---|
| Pilot on a valve terminal (low power) | 0.3–1 W | 13–42 mA |
| Standard pilot solenoid (22 or 30 mm) | 1.5–4.5 W | 60–190 mA |
| Direct-acting process valve | 5–20 W | 0.2–0.8 A |
| Interface relay | 0.4–1 W | 17–42 mA |

Copper's resistance rises by about 0.4 % per kelvin, so a coil at 70 °C draws a sixth less current than a cold one; coils are rated for continuous duty (100 % ED) at their hottest.

### Pull-in and holding
The magnetic pull falls steeply with the air gap. With the armature out the gap is wide and the pull weak; once it has closed, the same current holds it with a large margin. Many coils are therefore driven at full voltage for 20–100 ms and then **held** by pulse-width modulation ([[electronics:pwm|PWM]]): at duty $D$ the average current is $D\\,V/R$ and the coil power $D^2V^2/R$ — at 50 % a quarter of the power, less heat and a quicker release. AC coils behave the other way round by nature: with the gap open their inductance is low, so they draw an **inrush** current several times their holding current, and an AC armature that jams open burns its coil out.

### Switching on — and the kick when switching off
The current rises with the time constant $\\tau = L/R$, typically 1–5 ms for a pilot coil, and the armature moves only when it passes the pull-in level; then the pilot air must shift the main spool. A pilot-operated 5/2 valve typically switches on in 10–20 ms and off in 15–40 ms.

Switching off is the dangerous half. The coil's current cannot stop at once (it stores $\\tfrac12 LI^2$, a few millijoules), so when the circuit opens the coil drives its own voltage up until something conducts — hundreds of volts that arc across relay contacts, destroy transistor outputs and radiate interference. A **suppressor** gives the current a path ([[electronics:flyback-diode]]). With a clamp voltage $V_c$ the current reaches zero after $t_{off} = (L/R)\\ln(1 + V/V_c)$:

| Suppressor | Voltage across the switch (24 V coil) | Release |
|---|---|---|
| None | hundreds of volts (arcing, breakdown) | fast, but destructive |
| Diode | about 25 V | slowest: $3.4\\tau$ |
| Diode + 36 V Zener, or a TVS diode | about 61 V | fast: $0.5\\tau$ |
| Varistor | 40–60 V | fast; works on AC too |

Most valve plugs and terminals have suppression and an LED built in; a plain diode must be fitted the right way round.

### Relays and contactors
A relay's contacts are **normally open** (NO, make), **normally closed** (NC, break) or **changeover**. An interface relay switches about 6 A at 250 V AC and lasts some ten million operations unloaded, about a hundred thousand at full load; a **contactor** is a heavy relay for motors. A relay's own NO contact wired across its start button keeps it energised: the **self-holding** circuit, the electrical memory of [[ladder-diagrams]]. Relays in safety circuits have **force-guided contacts** (IEC 61810-3:2015): an NO and an NC contact can never be closed together, so a welded contact is detected ([[safety-functions]]).

> [!warn] A manual override on a solenoid valve, or a coil energised while testing, moves the cylinder it drives. Before working on valves and wiring, switch off and lock out the electrical supply, shut off and exhaust the air, and support loads that could fall. Coils for 110 or 230 V AC are mains-powered: work on them is for qualified people.
`,
  ideas: [
    'A solenoid valve\'s coil only moves a small armature; in a pilot-operated valve the supply air does the heavy work of shifting the spool.',
    'Coil power is V²/R: a 2.5 W, 24 V coil has about 230 Ω and draws about 0.1 A.',
    'The pull needed to close the armature is far larger than the pull needed to hold it: PWM holding at duty D cuts the power to D².',
    'Current in a coil cannot stop instantly: without a suppressor, switching it off makes a spike of hundreds of volts.',
    'A plain diode protects the switch but slows the release; a Zener or TVS clamp at a higher voltage releases several times faster.'
  ],
  pitfalls: [
    'A flyback diode costs nothing but protection — It also keeps the current circulating for several time constants, so the valve switches off noticeably later. Where release time matters, clamp at a higher voltage with a Zener, TVS or varistor.',
    'An AC coil can sit on a valve whose armature is stuck, like a DC coil — With the gap open an AC coil\'s inductance is low and it draws several times its rated current: a jammed AC solenoid burns out, a DC one only fails to switch.',
    'A relay drops out the moment its coil is switched off — Its release is delayed by the decaying coil current (longer with a diode) and by the armature\'s travel: typically 3–15 ms, which matters in fast sequences.'
  ],
  formulas: [
    {
      name: 'Coil power',
      expr: 'P = V^2/R', tex: 'P = \\dfrac{V^2}{R}',
      vars: {
        P: { name: 'coil power', q: 'power', unit: 'W' },
        V: { name: 'coil voltage', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 230 }
      },
      note: 'At the rated (warm) resistance. A cold coil draws up to about 20 % more; the current is V/R.',
      practice: { unknowns: ['P', 'R'] },
      stories: { P: 'A valve coil of {R} runs on {V}. What power does it take?', R: 'A solenoid is rated {P} at {V}. What is its resistance?' }
    },
    {
      name: 'Holding power with PWM',
      expr: 'Ph = D^2*V^2/R', tex: 'P_h = D^2\\,\\dfrac{V^2}{R}',
      vars: {
        Ph: { name: 'holding power', q: 'power', unit: 'W', tex: 'P_h' },
        D: { name: 'PWM duty cycle', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 230 }
      },
      note: 'Switching at a few kHz, the coil\'s inductance smooths the current to about D·V/R; the power is that current squared times R. The armature must still be held: the duty must keep the current above the drop-out level.',
      practice: { unknowns: ['Ph', 'D'] },
      stories: { Ph: 'A {R} coil on {V} is held at a PWM duty of {D} after pulling in. What power does it take while holding?', D: 'A {R} coil on {V} should hold on {Ph}. What PWM duty is needed?' }
    },
    {
      name: 'Release time with a clamp',
      expr: 'toff = L/R*ln(1 + V/Vc)', tex: 't_{off} = \\dfrac{L}{R}\\,\\ln\\left(1 + \\dfrac{V}{V_c}\\right)',
      vars: {
        toff: { name: 'time for the coil current to reach zero', q: 'time', unit: 'ms', tex: 't_{off}' },
        L: { name: 'coil inductance', q: 'inductance', unit: 'H', value: 0.46 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 230 },
        V: { name: 'supply voltage (sets the starting current V/R)', q: 'voltage', unit: 'V', value: 24 },
        Vc: { name: 'clamp voltage of the suppressor', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_c' }
      },
      note: 'A constant clamp voltage: about 0.8 V for a diode, the Zener voltage plus 0.7 V for a diode and Zener. The switch sees V + V_c. The armature releases a little before the current reaches zero.',
      practice: { unknowns: ['toff', 'Vc'] },
      stories: { toff: 'A coil of {L} and {R} on {V} is switched off with a suppressor that clamps at {Vc}. How long until its current is zero?', Vc: 'A coil of {L} and {R} on {V} must be current-free {toff} after switch-off. What clamp voltage is needed?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the suppression',
      q: 'A 24 V, 2.5 W pilot coil has an inductance of 0.46 H. It is switched by a transistor output rated for 60 V. Compare a plain diode ($V_c$ ≈ 0.8 V) with a diode and 30 V Zener ($V_c$ ≈ 30.8 V).',
      steps: [
        '$R = V^2/P = 576/2.5 = 230$ Ω; the current is $24/230 = 0.104$ A and $\\tau = L/R = 0.46/230 = 2.0$ ms.',
        'Diode: $t_{off} = 2.0 \\times \\ln(1 + 24/0.8) = 2.0 \\times \\ln 31 = 6.9$ ms; the switch sees $24 + 0.8 ≈ 25$ V.',
        'Diode and Zener: $t_{off} = 2.0 \\times \\ln(1 + 24/30.8) = 2.0 \\times 0.576 = 1.2$ ms; the switch sees $24 + 30.8 = 54.8$ V, inside its 60 V rating.',
        'The energy to dissipate is the same either way: $\\tfrac12 LI^2 = 0.5 \\times 0.46 \\times 0.104^2 = 2.5$ mJ per switch-off.'
      ],
      a: 'Diode: 25 V across the switch, current gone after 6.9 ms. Diode + 30 V Zener: 55 V, 1.2 ms — about six times faster and still within the output\'s rating.'
    },
    {
      title: 'Holding on less power',
      q: 'A valve terminal has 16 coils of 4 W energised at once. After pulling in, each is held at 40 % PWM. What are the power and the 24 V supply current before and after?',
      steps: [
        'Full power: $16 \\times 4 = 64$ W, or $64/24 = 2.67$ A.',
        'Holding: $P_h = D^2 P = 0.4^2 \\times 4 = 0.64$ W per coil, $16 \\times 0.64 = 10.2$ W in all.',
        'Supply current while holding: $10.2/24 = 0.43$ A.'
      ],
      a: '64 W and 2.67 A during pull-in; 10.2 W and 0.43 A while holding — less heat in the terminal and a smaller power supply.'
    }
  ],
  quiz: [
    { q: 'A 24 V DC valve coil is rated 2 W. What current does it draw?', answer: 83.3, unit: 'mA',
      why: '$I = P/V = 2/24 = 0.0833$ A = 83.3 mA; its resistance is $V^2/P = 288$ Ω.' },
    { q: 'Fitting a plain diode across a valve coil makes the valve…', choices: ['switch off faster', 'switch off more slowly', 'switch on more slowly', 'draw more current'], a: 1,
      why: 'The diode lets the coil current circulate and decay slowly ($3$–$4\\,\\tau$), so the armature is held a few milliseconds longer. Switching on is unchanged, since the diode is reverse-biased then.' },
    { q: 'An AC solenoid whose armature is jammed open draws more current than when its armature is closed.', a: true,
      why: 'With the gap open the magnetic circuit has a low inductance and so a low impedance; the current, limited mostly by the small resistance, is several times the holding current and burns the coil.' },
    { q: 'A coil held at 50 % PWM duty takes, compared with full voltage…', choices: ['half the power', 'a quarter of the power', 'the same power, pulsed', 'twice the power'], a: 1,
      why: 'The average current halves, and power goes with current squared: $P_h = D^2V^2/R$.' },
    { q: 'Why do safety relays use force-guided contacts?', choices: ['They carry more current', 'They switch faster', 'A welded NO contact keeps the NC contact open, so the monitoring circuit notices the fault', 'They need no suppression'], a: 2,
      why: 'Mechanically linked NO and NC contacts cannot both be closed: checking the NC contact before each start proves the NO contacts opened.' }
  ],
  problems: [
    { q: 'A 24 V coil has a resistance of 144 Ω and an inductance of 0.3 H. It is suppressed by a diode and a 24 V Zener ($V_c$ = 24.8 V). How long after switch-off does its current reach zero?', answer: 1.41, unit: 'ms', tol: 0.03,
      steps: ['$\\tau = 0.3/144 = 2.08$ ms.', '$t_{off} = 2.08 \\times \\ln(1 + 24/24.8) = 2.08 \\times 0.677 = 1.41$ ms.'] },
    { q: 'Twelve 1 W, 24 V coils are held at 50 % PWM. What current does the 24 V supply deliver while they hold?', answer: 0.125, unit: 'A', tol: 0.03,
      steps: ['Each coil holds on $0.5^2 \\times 1 = 0.25$ W.', 'Twelve: 3 W; $I = 3/24 = 0.125$ A.'] }
  ],
  applications: ['Pilot solenoids on valves and valve terminals.', 'Interface relays between controller outputs and 230 V loads.', 'Contactors starting compressor motors (star–delta).', 'Safety relays with force-guided contacts in emergency-stop circuits.'],
  history: 'Joseph Henry\'s electromagnetic relay of 1835 was built to extend telegraph lines; a century later relays were the brains of machines, and rooms of them ran telephone exchanges. Solenoid valves spread with industrial automation after the Second World War, and low-power pilots with PWM holding came with valve terminals in the 1990s.',
  sim: 'ep-coil'
},

/* ================================================================ LADDER DIAGRAMS */
{
  id: 'ladder-diagrams', parent: 'electrical-control', title: 'Relay ladder diagrams', level: 2,
  short: 'Relay logic drawn as a ladder: two supply rails and rungs between them, each rung a chain of contacts that decides whether its coil is energised. A self-holding contact makes a memory; two reed switches and a few relays make a cylinder run back and forth.',
  keywords: ['ladder diagram', 'relay logic', 'rung', 'rail', 'contact', 'normally open', 'normally closed', 'coil', 'self-holding', 'seal-in', 'latching', 'stop dominant', 'start stop circuit', 'reed switch', 'reciprocating cylinder', 'single solenoid', 'double solenoid', 'IEC 81346', 'fail-safe'],
  prereq: ['solenoids-relays', 'logic-functions', 'memory-circuits'],
  related: ['plc-control', 'sensors-pneu', 'sequence-notation', 'displacement-step-diagram', 'safety-functions', 'electronics:boolean-algebra', 'electronics:latches', 'electronics:logic-gates'],
  body: `
Relay logic reads like a sentence. Draw the +24 V supply as a rail down the left side and 0 V down the right; every horizontal **rung** between them is one line of logic. Contacts in series mean AND, contacts side by side OR, and a normally closed contact NOT; at the right-hand end sits what the rung switches — a relay coil (K1), a valve solenoid (Y1) or a lamp (H1). The coil is energised when an unbroken path of closed contacts joins the rails. Everything is drawn at rest: buttons not pressed, relays off, cylinders in their start positions.

The drawings here use the style of PLC ladder programs: a normally open contact is two short bars, a normally closed one has a slash across them, a coil is a pair of brackets. European relay diagrams (IEC 60617 symbols) usually run their current paths vertically, but they read the same way. Letters follow IEC 81346-2:2019 and older practice: S for push-buttons, B for sensors, K for relays, Y (or MB) for solenoids, H for lamps; under each coil a list of rung numbers shows where its contacts are used.

| Function | Contacts | Logic |
|---|---|---|
| AND | S1 and S2 in series | $K = S_1 S_2$ |
| OR | S1 and S2 side by side | $K = S_1 + S_2$ |
| NOT | an NC contact of S1 | $K = \\overline{S_1}$ |
| Memory | K\'s own contact across S1, behind S0 (NC) | $K = \\overline{S_0}\\,(S_1 + K)$ |

### Start and stop: self-holding
The rung: S0 (NC), then S1 (NO) with K1 (NO) beside it, then the coil K1. Press S1 and K1 pulls in; its own contact bridges S1, so releasing the button changes nothing — the relay **holds itself**. Press S0 and the path breaks: K1 drops, its contact opens, and releasing S0 does not restart it. Press both and nothing starts, because S0 is in series with everything: the circuit is **stop-dominant**, as a machine's must be. The stop button is an NC contact on purpose: a broken wire or a loose terminal stops the machine instead of silently disabling the stop. And because a relay drops out when the power fails, the machine stays off when the power returns until someone presses start — protection against an unexpected start that a latching switch would not give.

### A cylinder running back and forth
A double-acting cylinder with a magnetic piston, a single-solenoid 5/2 valve with spring return (Y1), and two reed switches: B1 closed when retracted, B2 when extended ([[sensors-pneu]]).

| Rung | Contacts | Coil | Job |
|---|---|---|---|
| 1 | S0 (NC) · (S1 + K1) | K1 | run, self-holding |
| 2 | B2 | K3 | front end reached |
| 3 | [(K1 + S2) · B1 + K2] · K3 (NC) | K2 | extend, held until the front |
| 4 | K2 | Y1 | the valve solenoid |
| 5 | K1 | H1 | running lamp |

At rest B1 is closed. Press S1: K1 holds; rung 3 closes through K1 and B1, K2 pulls in and holds itself, Y1 switches the valve and the cylinder extends. As the piston leaves, B1 opens — K2's self-hold keeps Y1 on, because a single-solenoid valve forgets the moment its coil is off. At the front B2 closes, K3 pulls in and its NC contact breaks rung 3: K2 drops, Y1 goes off, the spring returns the valve and the cylinder retracts. B2 opens, K3 drops, and at the rear B1 starts the next stroke. Press S0 and K1 drops, but the cylinder finishes its stroke and stops at the rear: **stop at end of cycle**; S2 runs a single cycle. Reed switches have NO contacts, so relay K3 supplies the "not at the front" signal. With a **double-solenoid** valve the valve itself is the memory: Y1 = K1·B1, Y2 = B2, and K2 and K3 are not needed.

### From relays to programs
A machine with ten cylinders needs dozens of relays and hundreds of wires, and every change of sequence is rewiring. The [[plc-control|PLC]] replaced the relays but kept the ladder, still the most widely used PLC language. Hard-wired relays survive in simple machines and in safety circuits, where a few force-guided relays are easy to verify ([[safety-functions]]).

> [!warn] Check a new circuit with the air shut off and the cylinders unloaded. When the air is first turned on, cylinders can jump to their start positions: keep hands clear and use a soft-start valve ([[soft-start]]). Before working on the wiring or the pneumatics, switch off, lock out and exhaust.
`,
  ideas: [
    'Series contacts are AND, parallel contacts OR, a normally closed contact NOT; a rung energises its coil when a closed path joins the rails.',
    'A relay\'s own contact across its start button makes it hold itself: an electrical memory that forgets on a stop or a power failure.',
    'Stop buttons are normally closed and in series with everything, so a broken wire stops the machine and stop always wins.',
    'A single-solenoid valve needs a self-holding relay to keep its stroke going; a double-solenoid valve is itself the memory.',
    'Sensors report the end of each stroke, and the ladder turns those reports into the next command.'
  ],
  pitfalls: [
    'The stop button can be a normally open contact that breaks the circuit through a relay — Then a broken wire in the stop circuit goes unnoticed and the stop no longer works. Stop functions use NC contacts, so a fault stops the machine.',
    'A single-solenoid valve holds its position like a switch — It holds only while its coil is energised. Take away the signal when the piston leaves its start sensor and the spring returns the valve: the cylinder buzzes back and forth near the rear.',
    'A ladder is read like a program, rung by rung in order — Relays all act at once and in parallel; order matters only in a PLC, which scans the rungs one after the other.'
  ],
  formulas: [
    {
      name: 'Cycle rate of a reciprocating cylinder',
      expr: 'n = 1/(s/ve + s/vr + td)', tex: 'n = \\dfrac{1}{s/v_e + s/v_r + t_d}',
      vars: {
        n: { name: 'cycles per minute', q: 'frequency', unit: '1/min' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 150 },
        ve: { name: 'mean extending speed', q: 'speed', unit: 'm/s', value: 0.5, tex: 'v_e' },
        vr: { name: 'mean retracting speed', q: 'speed', unit: 'm/s', value: 0.6, tex: 'v_r' },
        td: { name: 'switching delays and dwells per cycle', q: 'time', unit: 'ms', value: 80, tex: 't_d' }
      },
      note: 'The delays add the relays\' operate and release times (5–15 ms each), the valve\'s switching times (10–40 ms each way) and any dwell at the ends.',
      practice: { unknowns: ['n', 'td'] },
      stories: { n: 'A cylinder with a stroke of {s} extends at {ve} and retracts at {vr}; relays and valve add {td} per cycle. How many cycles does it make per minute?' }
    }
  ],
  examples: [
    {
      title: 'Tracing the self-holding rung',
      q: 'In rung 1 (S0 NC, S1 NO with K1 NO beside it, coil K1), follow K1 through: press S1, release S1, press S0, release S0, then press S0 and S1 together.',
      steps: [
        'Press S1: S0 is closed (not pressed) and S1 closes, so K1 pulls in and its own NO contact closes.',
        'Release S1: the current now flows through S0 and the K1 contact; K1 stays on.',
        'Press S0: its NC contact opens, K1 drops and its contact opens.',
        'Release S0: S0 closes again, but neither S1 nor K1 is closed; K1 stays off.',
        'Press both: S0 is open, so no path exists whatever S1 does — stop dominates.'
      ],
      a: 'On, on, off, off, off: a memory set by S1 and reset by S0, with reset winning — $K_1 = \\overline{S_0}\\,(S_1 + K_1)$.'
    },
    {
      title: 'How fast can it cycle?',
      q: 'The reciprocating circuit drives a cylinder with a 150 mm stroke that extends at a mean 0.5 m/s and retracts at 0.6 m/s. Relay and valve delays total 80 ms per cycle. How many cycles a minute, and what share of the time is lost to switching?',
      steps: [
        'Extending: $0.15/0.5 = 0.30$ s; retracting: $0.15/0.6 = 0.25$ s.',
        'Cycle: $0.30 + 0.25 + 0.08 = 0.63$ s, so $n = 1/0.63 = 1.59$ per second = 95 per minute.',
        'Switching delays: $0.08/0.63 = 13$ % of the cycle.'
      ],
      a: 'About 95 cycles a minute, with 13 % of each cycle spent waiting for relays and the valve.'
    }
  ],
  quiz: [
    { q: 'In the start/stop rung, S0 and S1 are pressed at the same time. K1…', choices: ['pulls in', 'stays off: the circuit is stop-dominant', 'chatters on and off', 'blows the fuse'], a: 1,
      why: 'S0\'s NC contact is in series with both S1 and the self-holding contact, so pressing it breaks every path to the coil.' },
    { q: 'Why is a stop button wired as a normally closed contact?', choices: ['NC contacts are cheaper', 'A broken wire then stops the machine instead of disabling the stop', 'NC contacts switch faster', 'So that its lamp lights'], a: 1,
      why: 'The circuit fails safe: any break — wire, terminal, contact — has the same effect as pressing stop.' },
    { q: 'In the reciprocating circuit with a single-solenoid valve, removing K2\'s self-holding contact would still let the cylinder complete its strokes.', a: false,
      why: 'K2 would be on only while B1 is closed. A few millimetres after the piston leaves B1, K2 drops, Y1 goes off and the valve springs back: the cylinder returns to B1 and repeats, buzzing at the rear.' },
    { q: 'Which expression describes the start/stop rung?', choices: ['$K_1 = S_0\\,S_1$', '$K_1 = \\overline{S_0}\\,(S_1 + K_1)$', '$K_1 = S_0 + S_1 K_1$', '$K_1 = S_1 + K_1$'], a: 1,
      why: 'The NC stop contact conducts when S0 is not pressed ($\\overline{S_0}$), in series with S1 or K1\'s own contact in parallel.' },
    { q: 'Stop (S0) is pressed while the cylinder is extending. The cylinder…', choices: ['stops at once in mid-stroke', 'retracts at once', 'finishes its cycle and stops at the rear', 'keeps cycling'], a: 2,
      why: 'S0 drops K1, but K2 is held through its own contact until B2 is reached; the cylinder then retracts, and at the rear K1 is off, so no new stroke starts.' }
  ],
  problems: [
    { q: 'A cylinder with a 200 mm stroke extends at a mean 0.4 m/s and retracts at 0.8 m/s; relays and the valve add 0.1 s per cycle. How many cycles does it make per minute?', answer: 70.6, unit: '1/min', tol: 0.02,
      steps: ['Strokes: $0.2/0.4 = 0.5$ s and $0.2/0.8 = 0.25$ s.', 'Cycle: $0.5 + 0.25 + 0.1 = 0.85$ s; $60/0.85 = 70.6$ per minute.'] }
  ],
  applications: ['Simple machines — presses, clamps, feeders — controlled by a few relays.', 'Hard-wired emergency-stop and guard circuits with safety relays.', 'Ladder logic, the most common language of PLCs.', 'Fault finding on older machines, reading the circuit rung by rung.'],
  history: 'Ladder diagrams grew out of the wiring drawings of relay panels in the early twentieth century, when machines and lifts were controlled by banks of relays. When the first PLCs appeared in 1968–69 they were programmed in the same ladder form, so that electricians could read them without learning to code.',
  sim: 'ep-ladder'
},

/* ================================================================ SENSORS */
{
  id: 'sensors-pneu', parent: 'electrical-control', title: 'Sensors: reed switches, proximity and pressure', level: 2,
  short: 'How a pneumatic machine knows where its cylinders are and what its air is doing: reed and magneto-resistive switches read a magnet in the piston, inductive, capacitive and optical sensors see the parts, pressure switches and transducers watch the air — with PNP or NPN outputs to the controller.',
  keywords: ['reed switch', 'magnetic piston', 'cylinder switch', 'magnetoresistive', 'Hall sensor', 'inductive sensor', 'capacitive sensor', 'photoelectric', 'through-beam', 'retro-reflective', 'pressure switch', 'pressure transducer', '4–20 mA', '0–10 V', 'PNP', 'NPN', 'sourcing', 'sinking', 'three-wire', 'switching range', 'hysteresis', 'IEC 60947-5-2'],
  prereq: ['pneumatic-cylinder', 'solenoids-relays', 'electronics:hall-sensors'],
  related: ['pressure-switches', 'plc-control', 'ladder-diagrams', 'fieldbus-io-link', 'digital-pneumatics', 'electronics:sensors', 'electronics:pull-resistors', 'physics:hall-effect'],
  body: `
A pneumatic machine needs to know three things: where each piston is, whether the part and the tooling are there, and whether the air is doing its job. Each has its sensor family, and all of them end in a signal to a controller — a contact, a switched 24 V output or an analogue value.

### Cylinder switches: a magnet in the piston
Most cylinders can be ordered with a **ring magnet in the piston**; a sensor clamped into a slot in the barrel switches when the magnet passes beneath it — no cams, no levers, nothing outside the cylinder to adjust or break.

- **Reed switch**: two ferromagnetic blades sealed in a glass tube; the magnet's field magnetises them and they snap together. It is a real contact: two wires, no supply needed, but it bounces for a fraction of a millisecond as it closes, wears with switching, drops 2–3 V across its built-in LED and dislikes inductive loads and overcurrent.
- **Magneto-resistive or Hall-effect switch** ([[electronics:hall-sensors]]): electronic, three wires, no bounce and no wear, a smaller switching range and a sharper switching point. The usual choice today.

Every cylinder switch has a **switching range** — the length of piston travel over which it is on, typically 5–15 mm — and a **hysteresis** of 1–2 mm between switching on and off. At the end of the stroke the piston stops under the sensor, so the signal is long. A sensor in mid-stroke sees the magnet only in passing: the pulse lasts $t_p = w/v$, and at 1 m/s a 10 mm range gives 10 ms — easily shorter than a controller's input filter plus its scan time ([[plc-control]]).

### Proximity sensors: seeing the parts
| Type | Detects | Typical range | Notes |
|---|---|---|---|
| Inductive | metals | 1–40 mm | eddy currents; very robust; less range on non-ferrous metals |
| Capacitive | anything, even liquids through plastic | 1–25 mm | adjustable; sensitive to moisture and dirt |
| Diffuse optical | objects that reflect light | 0.05–2 m | background suppression for dark or distant objects |
| Retro-reflective | objects breaking a beam to a reflector | 0.1–10 m | polarised types ignore shiny parts |
| Through-beam | objects between emitter and receiver | up to 50 m | most reliable; two units to mount |

An inductive sensor's rated distance $s_n$ is for mild steel; stainless steel gives about 0.7 of it, brass 0.5, aluminium 0.4, copper 0.3, and the distance at which it is sure to switch in all conditions is $0.81\\,s_n$ (IEC 60947-5-2:2019).

### Pressure: switches and transducers
A **pressure switch** reports that a pressure has passed a set point — a clamp that is really pressurised, not just a valve that switched; a vacuum switch confirms that a suction cup holds its part ([[vacuum-circuits]], [[pressure-switches]]). Electronic ones have a display, adjustable set points and hysteresis. A **pressure transducer** gives the value: 0–10 V, IO-Link, or 4–20 mA, whose live zero shows a broken wire as 0 mA instead of a false "zero bar": $p = p_{fs}(I - 4\\,\\mathrm{mA})/16\\,\\mathrm{mA}$.

### PNP or NPN
A three-wire sensor has brown (+24 V), blue (0 V) and black (output) wires — pins 1, 3 and 4 of an M8 or M12 plug. A **PNP** (sourcing) output switches +24 V to the load and needs a *sinking* input, which is what most European and American controllers have; an **NPN** (sinking) output connects the load to 0 V, common in Asian practice. Mixed, they simply never switch. A two-wire electronic sensor sits in series with its load and passes a small leakage current even when off, which a low-power input may read as a signal ([[electronics:pull-resistors]]).

> [!warn] Setting a sensor means working beside the cylinder it watches. Exhaust the air or move the piston by hand; never adjust a sensor with the machine in automatic, and keep hands out of the stroke when using a manual override.
`,
  ideas: [
    'A ring magnet in the piston lets a sensor on the barrel report the piston\'s position through the cylinder wall.',
    'Reed switches are contacts (two wires, bounce, wear); magneto-resistive and Hall switches are electronic (three wires, clean switching).',
    'A mid-stroke sensor gives a pulse of only w/v: at high speed it can be too short for a controller to see.',
    'Inductive sensors see metal, capacitive ones almost anything, optical ones at a distance; pressure switches confirm that the air actually arrived.',
    'PNP outputs switch +24 V and need sinking inputs; NPN outputs switch 0 V. Mixing them does not work.'
  ],
  pitfalls: [
    'A valve that has switched means the cylinder has moved — Only a sensor at the end of the stroke, or a pressure switch, proves it. A jammed load, a closed shut-off valve or a burst tube leave the valve switched and the cylinder still.',
    'Any sensor will do in mid-stroke — The pulse there lasts only w/v; at 1–2 m/s it can be a few milliseconds and pass unseen between two PLC scans.',
    'An inductive sensor switches at its rated distance on any metal — The rating is for mild steel; aluminium or copper flags must come two to three times closer.'
  ],
  formulas: [
    {
      name: 'Pulse from a magnet passing a sensor',
      expr: 'tp = w/v', tex: 't_p = \\dfrac{w}{v}',
      vars: {
        tp: { name: 'pulse length', q: 'time', unit: 'ms', tex: 't_p' },
        w: { name: 'switching range (travel over which the sensor is on)', q: 'length', unit: 'mm', value: 10 },
        v: { name: 'piston speed', q: 'speed', unit: 'm/s', value: 1 }
      },
      note: 'The switching range includes the hysteresis. A controller is only sure to see the pulse if it lasts longer than its input filter plus one scan.',
      practice: { unknowns: ['tp', 'v'] },
      stories: { tp: 'A piston passes a mid-stroke sensor with a switching range of {w} at {v}. How long is the pulse?', v: 'A controller needs pulses of at least {tp}. How fast may a piston pass a sensor with a switching range of {w}?' }
    },
    {
      name: 'A 4–20 mA pressure transducer',
      expr: 'p = pfs*(I - I0)/Isp', tex: 'p_g = p_{fs}\\,\\dfrac{I - I_0}{I_{span}}',
      vars: {
        p: { name: 'measured pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_g' },
        pfs: { name: 'full-scale pressure (gauge)', q: 'pressure', unit: 'bar', value: 10, tex: 'p_{fs}' },
        I: { name: 'loop current', q: 'current', unit: 'mA', value: 12 },
        I0: { name: 'live zero', q: 'current', unit: 'mA', value: 4, fixed: true, tex: 'I_0' },
        Isp: { name: 'span', q: 'current', unit: 'mA', value: 16, fixed: true, tex: 'I_{span}' }
      },
      note: 'For a 0-based range. Currents below about 3.6 mA or above 21 mA mean a fault (NAMUR NE 43), not a pressure.',
      practice: { unknowns: ['p', 'I'] },
      stories: { p: 'A 0 to {pfs} transducer with a 4–20 mA output reads {I}. What is the pressure?', I: 'A 0 to {pfs} transducer with a 4–20 mA output sees {p}. What current does it send?' }
    },
    {
      name: 'Assured distance of an inductive sensor',
      expr: 'sa = 0.81*k*sn', tex: 's_a = 0.81\\,k\\,s_n',
      vars: {
        sa: { name: 'assured operating distance', q: 'length', unit: 'mm', tex: 's_a' },
        k: { name: 'material factor (steel 1, stainless 0.7, brass 0.5, aluminium 0.4, copper 0.3)', value: 0.4, min: 0.1, max: 1 },
        sn: { name: 'rated sensing distance (mild steel)', q: 'length', unit: 'mm', value: 8, tex: 's_n' }
      },
      note: 'The 0.81 covers manufacturing spread (±10 %) and temperature and voltage (±10 %) as in IEC 60947-5-2. The factors are typical; the maker\'s data sheet rules.',
      practice: { unknowns: ['sa', 'sn'] },
      stories: { sa: 'An inductive sensor rated {sn} must detect a flag with a material factor of {k}. How close must the flag come?' }
    }
  ],
  examples: [
    {
      title: 'Will the PLC see the mid-stroke sensor?',
      q: 'A piston passes a magneto-resistive switch with a 6 mm switching range at 0.8 m/s. The controller\'s input filter is 3 ms and its scan time 8 ms. Is the pulse sure to be seen?',
      steps: [
        'Pulse: $t_p = w/v = 6/0.8 = 7.5$ ms.',
        'To be sure of it, the pulse must outlast the filter plus one scan: $3 + 8 = 11$ ms.',
        '7.5 ms < 11 ms: sometimes it will be caught, sometimes not — the worst kind of fault.',
        'Remedies: a faster task or an interrupt input for this sensor, a shorter filter, or a lower speed there; $v_{max} = 6/11 = 0.55$ m/s.'
      ],
      a: 'No: a 7.5 ms pulse against 11 ms needed. Use a fast or interrupt input, or pass the sensor below about 0.55 m/s.'
    },
    {
      title: 'Reading a transducer',
      q: 'A 0–10 bar transducer with a 4–20 mA output reads 9.6 mA. What is the pressure? What does a reading of 2 mA mean?',
      steps: [
        '$p = 10 \\times (9.6 - 4)/16 = 10 \\times 0.35 = 3.5$ bar gauge.',
        '2 mA is below the live zero of 4 mA: no pressure can produce it. It means a broken wire, a failed sensor or no supply.'
      ],
      a: '3.5 bar; 2 mA is a fault, not a pressure — the advantage of a live zero.'
    }
  ],
  quiz: [
    { q: 'A PNP sensor is wired to a controller input designed for NPN sensors. What happens?', choices: ['It works normally', 'The input never sees a signal', 'The input is always on', 'The sensor is destroyed at once'], a: 1,
      why: 'An NPN (sourcing) input expects the sensor to pull it to 0 V; a PNP output only ever connects +24 V, so no current flows through the input.' },
    { q: 'A piston crosses a sensor with a 12 mm switching range at 2 m/s. How long is the pulse?', answer: 6, unit: 'ms',
      why: '$t_p = w/v = 0.012/2 = 0.006$ s = 6 ms.' },
    { q: 'A reed switch needs a supply of its own to work.', a: false,
      why: 'It is a pair of contacts closed by the magnet; it is wired in series with the load. Only its indicator LED takes a little of the current.' },
    { q: 'An inductive sensor rated $s_n$ = 8 mm (mild steel) must detect an aluminium flag. About how close must the flag be for reliable switching?', choices: ['8 mm', '6.5 mm', '2.6 mm', '0.8 mm'], a: 2,
      why: '$s_a = 0.81 \\times 0.4 \\times 8 = 2.6$ mm: aluminium lets the eddy-current field reach less far, and the 0.81 covers tolerances.' },
    { q: 'Why is 4–20 mA preferred to 0–20 mA for transducers?', choices: ['It is more accurate', 'A broken wire reads 0 mA, clearly a fault rather than a zero reading', 'It needs no supply', 'It is faster'], a: 1,
      why: 'With a live zero, every real reading carries at least 4 mA; 0 mA can only mean a fault.' }
  ],
  problems: [
    { q: 'A 0–16 bar transducer has a 4–20 mA output. What current does it send at 6 bar?', answer: 10, unit: 'mA', tol: 0.02,
      steps: ['$I = 4 + 16 \\times 6/16 = 10$ mA.'] },
    { q: 'A cylinder switch has an 8 mm switching range and the controller needs pulses of at least 15 ms. What is the highest piston speed at which the switch is reliably seen?', answer: 0.533, unit: 'm/s', tol: 0.02,
      steps: ['$v = w/t_p = 0.008/0.015 = 0.533$ m/s.'] }
  ],
  applications: ['End-position sensing on almost every automation cylinder.', 'Part-present checks with inductive and optical sensors on assembly lines.', 'Pressure switches confirming clamping before machining starts.', 'Vacuum switches confirming the grip of suction cups.'],
  history: 'The reed switch was invented at Bell Telephone Laboratories in the 1930s, by W. B. Ellwood, for telephone switching. Cylinders with magnetic pistons and slot-mounted reed switches became standard in automation in the 1970s; electronic magneto-resistive switches have largely replaced them since the 2000s.',
  sim: 'ep-reed'
},

/* ================================================================ PLC */
{
  id: 'plc-control', parent: 'electrical-control', title: 'PLC control', level: 2,
  short: 'A programmable logic controller replaces the relay panel with a program: it reads all its inputs, runs the program, writes all its outputs, and repeats every few milliseconds. The scan cycle explains both its power and the delays it adds between a sensor and the air.',
  keywords: ['PLC', 'programmable logic controller', 'scan cycle', 'process image', 'scan time', 'IEC 61131-3', 'ladder diagram', 'function block diagram', 'structured text', 'sequential function chart', 'SFC', 'GRAFCET', 'step sequence', 'timer', 'set reset', 'response time', 'input filter', 'transistor output', 'relay output', 'watchdog'],
  prereq: ['ladder-diagrams', 'sensors-pneu', 'electronics:microcontrollers'],
  related: ['fieldbus-io-link', 'shift-register', 'sequence-notation', 'signal-overlap', 'cascade-method', 'safety-functions', 'electronics:state-machines', 'electronics:flip-flops'],
  body: `
A programmable logic controller is a computer made for the factory floor: 24 V inputs for buttons and sensors, outputs strong enough for valve coils, a rugged case, and a program that runs the same way for years. What makes it a PLC rather than a microcontroller on a board ([[electronics:microcontrollers]]) is how it runs that program — the **scan cycle**.

### The scan cycle
1. **Read inputs**: copy every input terminal into a table in memory, the *process image*, all at once.
2. **Run the program** from top to bottom, using the image — never the terminals — so an input cannot change half-way through the logic.
3. **Write outputs**: copy the output image to the output terminals.
4. **Housekeeping**: communication, diagnostics, and the watchdog that stops the controller if a scan takes too long.

Then round again. A machine program typically scans in 1–20 ms; faster cyclic tasks and interrupt inputs exist for events that cannot wait.

### Where the time goes
A sensor that changes just after the inputs were read waits a whole scan to be seen, and the output follows at the end of the next scan. Add the input filter and the valve:

| Stage | Typical time |
|---|---|
| Input filter (debouncing) | 3 ms (0.1–20 ms adjustable) |
| Waiting for the next input read | 0 to one scan |
| Program and output write | one scan |
| Transistor output / relay output | 0.1 ms / 10 ms |
| Solenoid valve switching | 10–30 ms |

So from a sensor to moving air takes up to $t_f + 2t_s + t_v$, some 40 ms, and a cylinder at 0.5 m/s covers 20 mm in that time. That is why pneumatic cylinders stop against end caps and hard stops, not "when the PLC notices", and why a short pulse from a mid-stroke sensor can be missed altogether ([[sensors-pneu]]).

### The same sequence, programmed
The relay circuit of [[ladder-diagrams]] becomes a program with internal memory bits instead of relays K2 and K3; a sensor's NC contact is now just a NOT, with no extra relay. Sequences are best written as **steps**: one memory bit per step, set by the step before and its condition, reset by the next — the software form of the step sequencer ([[shift-register]]), which removes signal overlap ([[signal-overlap]]) by construction. For A+ B+ A− B− ([[sequence-notation]]) with double-solenoid valves:

| Step | Output | Next step when |
|---|---|---|
| 0 (initial) | — | start · a0 · b0 |
| 1 | Y1: A+ | a1 |
| 2 | Y3: B+ | b1 |
| 3 | Y2: A− | a0 |
| 4 | Y4: B− | b0, then back to 0 |

### IEC 61131-3 languages
IEC 61131-3:2013 defines the languages most PLCs speak: **LD** (ladder diagram), logic that reads like relays; **FBD** (function block diagram), signal flow between blocks; **ST** (structured text), a Pascal-like language for calculations; and **SFC** (sequential function chart), which draws a sequence as steps, actions and transitions, like the GRAFCET of IEC 60848. Instruction list (IL) is deprecated. The standard blocks — set/reset memories, on-delay timers (TON), counters, edge detectors — are the same in all of them. Inputs follow IEC 61131-2: a "1" is roughly 11–30 V, a "0" below 5 V.

> [!warn] A standard PLC is not a safety device: an output can fail switched on, and a program can be changed while the machine runs. Emergency stops and guard interlocks go through safety relays or safety controllers ([[safety-functions]]). Changing a program online can move cylinders at once — make sure nobody is inside the machine.
`,
  ideas: [
    'A PLC reads all inputs into an image, runs its program on the image, then writes all outputs — and repeats every few milliseconds.',
    'The worst-case reaction from sensor to air is the input filter, two scans and the valve\'s switching time: tens of milliseconds.',
    'A piston keeps moving during that reaction time, so precise stopping comes from mechanical stops, not from the controller.',
    'Sequences are programmed as steps with transitions (SFC, or step bits in ladder), which makes signal overlap impossible.',
    'IEC 61131-3 defines LD, FBD, ST and SFC; the same timers, counters and set/reset blocks exist in all of them.'
  ],
  pitfalls: [
    'A faster PLC makes the machine proportionally faster — Stroke times are set by air flow; a scan of a few milliseconds adds only a few per cent to a cycle of pneumatic strokes.',
    'The program sees an input the moment it changes — It sees only the process image, refreshed once per scan, and after the input filter; a pulse shorter than filter plus scan can be missed entirely.',
    'A PLC output switching off makes the machine safe — A transistor can fail short and a program can hold an output on; safety functions need safety-rated components and architectures.'
  ],
  formulas: [
    {
      name: 'Travel before the controller reacts',
      expr: 'ds = v*(tf + 2*ts + tv)', tex: 'd_s = v\\,(t_f + 2t_s + t_v)',
      vars: {
        ds: { name: 'distance travelled before the air responds', q: 'length', unit: 'mm', tex: 'd_s' },
        v: { name: 'piston speed', q: 'speed', unit: 'm/s', value: 0.5 },
        tf: { name: 'input filter time', q: 'time', unit: 'ms', value: 3, tex: 't_f' },
        ts: { name: 'scan time', q: 'time', unit: 'ms', value: 10, tex: 't_s' },
        tv: { name: 'output and valve switching time', q: 'time', unit: 'ms', value: 15, tex: 't_v' }
      },
      note: 'Worst case: the sensor changes just after an input read. On average the wait is half a scan less. After the valve has switched, the piston still needs time to stop.',
      practice: { unknowns: ['ds', 'ts'] },
      stories: { ds: 'A piston runs at {v} past a sensor. The input filter is {tf}, the scan time {ts} and the valve needs {tv} to switch. How far does the piston travel before the air responds?' }
    },
    {
      name: 'Fastest piston a controller is sure to see',
      expr: 'vmax = w/(tf + ts)', tex: 'v_{max} = \\dfrac{w}{t_f + t_s}',
      vars: {
        vmax: { name: 'highest speed past the sensor', q: 'speed', unit: 'm/s', tex: 'v_{max}' },
        w: { name: 'switching range of the sensor', q: 'length', unit: 'mm', value: 10 },
        tf: { name: 'input filter time', q: 'time', unit: 'ms', value: 3, tex: 't_f' },
        ts: { name: 'scan time', q: 'time', unit: 'ms', value: 10, tex: 't_s' }
      },
      note: 'The pulse w/v must outlast the filter plus one full scan to be caught whatever its timing.',
      practice: { unknowns: ['vmax', 'ts'] },
      stories: { vmax: 'A sensor with a switching range of {w} is read by a controller with a filter of {tf} and a scan time of {ts}. How fast may the piston pass it?' }
    }
  ],
  examples: [
    {
      title: 'How far does the cylinder go before the PLC reacts?',
      q: 'A cylinder moving at 0.8 m/s passes a sensor that should reverse it. The input filter is 3 ms, the scan time 12 ms and the valve switches in 20 ms. How far does the piston travel before the valve has switched?',
      steps: [
        '$t = t_f + 2t_s + t_v = 3 + 24 + 20 = 47$ ms at worst.',
        '$d_s = 0.8 \\times 0.047 = 0.038$ m = 38 mm — and the piston then still has to be braked by the air.'
      ],
      a: 'Up to about 38 mm: a controller cannot stop a pneumatic cylinder precisely at a sensor. Use an end stop, or servo-pneumatics for intermediate positions.'
    },
    {
      title: 'What the controller adds to a cycle',
      q: 'The sequence A+ B+ A− B− has four transitions per cycle; each stroke takes 0.3 s. The scan time is 10 ms, the input filter 3 ms and the valves switch in 15 ms. Estimate the time the controls add per cycle.',
      steps: [
        'Per transition, on average: filter 3 ms + half a scan waiting (5 ms) + one scan to the output (10 ms) + valve 15 ms = 33 ms.',
        'Four transitions: $4 \\times 33 = 132$ ms; the strokes take $4 \\times 0.3 = 1.2$ s.',
        'The controls add $0.13/1.33 ≈ 10$ % to the cycle; halving the scan time would save only about 30 ms of it.'
      ],
      a: 'About 0.13 s per cycle, some 10 % — mostly the valves\' switching times, not the scan.'
    }
  ],
  quiz: [
    { q: 'A sensor input changes while the PLC is running its program. When does the program first see the change?', choices: ['At once, in the same scan', 'In the next scan, after the next input read', 'Only after the outputs are written twice', 'Never, until the PLC is reset'], a: 1,
      why: 'The program works on the process image, which is refreshed only at the start of each scan.' },
    { q: 'Halving the scan time halves the time a pneumatic cylinder needs for its stroke.', a: false,
      why: 'The stroke time is set by the air flowing in and out; the scan adds a few milliseconds per transition at most.' },
    { q: 'Which IEC 61131-3 language draws a sequence as steps and transitions?', choices: ['LD', 'FBD', 'ST', 'SFC'], a: 3,
      why: 'The sequential function chart shows steps (with their actions) and the transition conditions between them, like GRAFCET.' },
    { q: 'A piston moves at 1 m/s; the total reaction from sensor to valve is 30 ms. How far does it travel meanwhile?', answer: 30, unit: 'mm',
      why: '$d = v t = 1 \\times 0.03 = 0.03$ m = 30 mm.' },
    { q: 'Why does a PLC copy all inputs into an image before running the program?', choices: ['To save power', 'So that every rung of one scan works with the same, consistent input values', 'To filter contact bounce', 'Because the inputs are too slow to read directly'], a: 1,
      why: 'If inputs were read live, a signal changing mid-scan could be true for one rung and false for the next, giving inconsistent logic.' }
  ],
  problems: [
    { q: 'A piston runs at 0.6 m/s. The input filter is 2 ms, the scan time 5 ms and the valve switches in 12 ms. How far can it travel, at worst, between the sensor switching and the valve switching?', answer: 14.4, unit: 'mm', tol: 0.02,
      steps: ['$t = 2 + 2 \\times 5 + 12 = 24$ ms.', '$d = 0.6 \\times 0.024 = 0.0144$ m = 14.4 mm.'] },
    { q: 'A sensor with an 8 mm switching range is read by a PLC with a 3 ms filter and a 5 ms scan. What is the highest speed at which the piston is sure to be seen?', answer: 1.0, unit: 'm/s', tol: 0.02,
      steps: ['$v_{max} = 8/(3 + 5) = 1.0$ mm/ms = 1.0 m/s.'] }
  ],
  applications: ['Machine control in assembly, packaging and process plants.', 'Step sequences for multi-cylinder machines, written as SFC or step bits.', 'Combining pneumatics with electric drives, vision and robots in one program.', 'Collecting cycle times and fault data for maintenance.'],
  history: 'In 1968 General Motors\' Hydra-Matic division asked for a programmable replacement for its relay panels; Richard Morley\'s team at Bedford Associates answered with the Modicon 084 in 1969. Programs were written as ladder diagrams so that plant electricians could read them. IEC 61131-3, first published in 1993, standardised the languages.',
  sim: 'ep-plc-scan'
},

/* ================================================================ FIELDBUS AND IO-LINK */
{
  id: 'fieldbus-io-link', parent: 'electrical-control', title: 'Fieldbus and IO-Link', level: 2,
  short: 'Instead of a pair of wires to every solenoid and sensor, a valve terminal hangs on one network cable, and IO-Link brings sensors and small actuators digitally to a master port: less wiring, parameters set from the controller, and diagnostics down to a single coil.',
  keywords: ['fieldbus', 'industrial Ethernet', 'PROFINET', 'EtherNet/IP', 'EtherCAT', 'Modbus', 'PROFIBUS', 'CANopen', 'AS-Interface', 'valve terminal', 'bus node', 'IO-Link', 'IEC 61131-9', 'IODD', 'master', 'port class B', 'COM3', 'process data', 'diagnostics', 'decentralised I/O', 'voltage drop'],
  prereq: ['plc-control', 'valve-terminals', 'electronics:serial-buses'],
  related: ['sensors-pneu', 'digital-pneumatics', 'safety-functions', 'solenoids-relays', 'proportional-pressure'],
  body: `
A machine with 24 double-acting cylinders has 24 to 48 valve coils and 48 cylinder switches: about a hundred signals. Wired in parallel, each needs its own wire from the cabinet, its own terminal and its own label — and each is a place for a mistake. Industrial networks replace the bundle with a cable.

### Three ways to wire a valve terminal
| | Parallel (multi-pin plug) | Fieldbus or industrial Ethernet | IO-Link |
|---|---|---|---|
| Cable | one core per coil | one network cable plus power | one standard 3- or 5-core sensor cable |
| Length | 10–30 m | 100 m per Ethernet segment | 20 m |
| Diagnostics | none | per coil, per module | per coil, with counters |
| Set-up | wiring lists | device file in the controller (GSDML, EDS, ESI) | device file (IODD) |

A [[valve-terminals|valve terminal]] with a **bus node** is a remote I/O station: the valves' coils are its outputs, and input modules on the same terminal collect the switches of nearby cylinders through short M8 or M12 cables. The networks are standardised in IEC 61158 and IEC 61784: PROFINET, EtherNet/IP, EtherCAT and Modbus TCP on 100 Mbit/s Ethernet with cycle times of 0.25–10 ms; older fieldbuses such as PROFIBUS, DeviceNet and CANopen; and AS-Interface, which carries data and power on one flat two-wire cable. One chooses whatever the controller speaks.

### Diagnostics
The bus node knows what plain wires never told: a short circuit or an open coil, a valve supply below its tolerance (24 V − 10 %), a missing module. Newer terminals count the switching cycles of every valve, so worn ones can be replaced on schedule ([[digital-pneumatics]]). "Valve 7, coil 14: open circuit" on a display replaces an hour with a multimeter.

### IO-Link
IO-Link (IEC 61131-9, first published 2013) is a digital point-to-point link, not a bus: one master port, one device, the ordinary unshielded sensor cable up to 20 m. The data line (pin 4) can also act as a plain switching output, so an IO-Link sensor works on any PLC input. It runs at 4.8, 38.4 or 230.4 kbit/s (COM1–COM3) in characters of 11 bits, so a short message takes a fraction of a millisecond, and a device's process data — a pressure with its switching bits, the states of 16 valves — is exchanged every few milliseconds. Alongside it travel parameters and events. The master stores each device's parameters, so a replacement is set up automatically. **Port class B** brings a second, separate 24 V supply on pins 2 and 5 for actuators such as small valve terminals and [[proportional-pressure|proportional regulators]].

### Power and the safe state
Valve terminals take their **logic** and **valve** supplies separately, so a safety relay can cut the valve supply while the bus keeps communicating and reporting ([[safety-functions]]). Remember what that does: single-solenoid valves spring back and their cylinders move; double-solenoid valves stay where they were. Long 24 V cables drop voltage, $\\Delta V = 2\\rho L I/A$ for the two conductors: size them so the valves stay within their tolerance.

> [!warn] Before unplugging a valve terminal or its bus cable, bring the machine to a safe state: a communication loss switches the outputs off, and single-solenoid valves then switch and move cylinders. Shut off and exhaust the air before working on the valves.
`,
  ideas: [
    'A valve terminal with a bus node replaces dozens of wires with one network cable and one power cable.',
    'The bus reports what wires never did: open or shorted coils, low supply voltage, switching counts.',
    'IO-Link is point-to-point over a standard sensor cable; it carries values, parameters and diagnostics, and falls back to a plain switching signal.',
    'Separate logic and valve supplies let a safety circuit remove the valves\' power while the network keeps reporting.',
    'Losing power or communication makes single-solenoid valves spring back: design the circuit so that this is safe.'
  ],
  pitfalls: [
    'IO-Link is a bus that strings many sensors on one cable — It is point-to-point: each device has its own port on a master; the master sits on the fieldbus.',
    'Cutting the valve supply stops every cylinder where it is — Only double-solenoid valves (and closed-centre 5/3 valves) hold; single-solenoid valves spring back and move their cylinders.',
    'A 24 V cable can be as thin as the current allows — Voltage drop decides first: 2 A over 20 m of 0.75 mm² cable loses almost 2 V, near the valves\' lower limit.'
  ],
  formulas: [
    {
      name: 'Supply current of a valve terminal',
      expr: 'I = n*P/V', tex: 'I = \\dfrac{n\\,P}{V}',
      vars: {
        I: { name: 'valve supply current', q: 'current', unit: 'A' },
        n: { name: 'coils energised at once', q: 'count', int: true, value: 16 },
        P: { name: 'power per coil', q: 'power', unit: 'W', value: 1 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 }
      },
      note: 'Size the supply for the most coils ever on together, at pull-in power if the terminal does not reduce it.',
      practice: { unknowns: ['I', 'n'] },
      stories: { I: 'A valve terminal has {n} coils of {P} energised on {V}. What current does it draw?' }
    },
    {
      name: 'Time for an IO-Link message',
      expr: 'tm = 11*N/r', tex: 't_m = \\dfrac{11\\,N}{r}',
      vars: {
        tm: { name: 'time on the wire', q: 'time', unit: 'ms', tex: 't_m' },
        N: { name: 'characters (bytes) exchanged', q: 'count', int: true, value: 6 },
        r: { name: 'transmission rate', q: 'datarate', unit: 'kbit/s', value: 230.4 }
      },
      note: 'Each character is 11 bits: start, 8 data, parity, stop. Gaps and the device\'s response time come on top; COM1 is 4.8, COM2 38.4, COM3 230.4 kbit/s.',
      practice: { unknowns: ['tm', 'N'] },
      stories: { tm: 'An IO-Link exchange of {N} characters runs at {r}. How long is it on the wire?' }
    },
    {
      name: 'Voltage drop on a supply cable',
      expr: 'dV = 2*rho*L*I/A', tex: '\\Delta V = \\dfrac{2\\rho L I}{A}',
      vars: {
        dV: { name: 'voltage drop (out and back)', q: 'voltage', unit: 'V', tex: '\\Delta V' },
        rho: { name: 'resistivity of copper', q: 'resistivity', unit: 'Ω·mm²/m', value: 0.0178, tex: '\\rho' },
        L: { name: 'cable length', q: 'length', unit: 'm', value: 20 },
        I: { name: 'current', q: 'current', unit: 'A', value: 2 },
        A: { name: 'conductor cross-section', q: 'area', unit: 'mm²', value: 0.75 }
      },
      note: 'Both conductors carry the current, hence the 2. Copper at 20 °C; warm cables drop more. Valves typically accept 24 V ± 10 %.',
      practice: { unknowns: ['dV', 'A'] },
      stories: { dV: 'A {L} cable with {A} conductors carries {I} to a valve terminal. What voltage does it lose?', A: 'A valve terminal {L} away draws {I}; the drop may be at most {dV}. What conductor cross-section is needed?' }
    }
  ],
  examples: [
    {
      title: 'Powering a valve terminal',
      q: 'A terminal on PROFINET has up to 16 coils of 1 W on at once and is fed through 20 m of cable with 0.75 mm² conductors from a 24 V supply. What current does it draw and what voltage reaches it?',
      steps: [
        '$I = nP/V = 16 \\times 1/24 = 0.67$ A.',
        '$\\Delta V = 2 \\times 0.0178 \\times 20 \\times 0.67/0.75 = 0.64$ V.',
        'The valves see about 23.4 V, well within 24 V − 10 % = 21.6 V.'
      ],
      a: '0.67 A and a drop of 0.64 V: 23.4 V at the terminal. At full pull-in power of 4 W per coil the drop would be four times larger.'
    },
    {
      title: 'How fast is IO-Link?',
      q: 'A pressure sensor exchanges a message of 6 characters with its master. How long does that take at COM3, COM2 and COM1?',
      steps: [
        '66 bits in all.',
        'COM3: $66/230\\,400 = 0.29$ ms; COM2: $66/38\\,400 = 1.7$ ms; COM1: $66/4800 = 13.8$ ms.'
      ],
      a: '0.29 ms at COM3 — quick compared with the 10–20 ms a valve takes to switch; 13.8 ms at COM1.'
    }
  ],
  quiz: [
    { q: 'An IO-Link sensor is wired to an ordinary PLC input without an IO-Link master. It…', choices: ['does not work', 'works as a plain switching sensor (SIO mode)', 'needs a converter', 'damages the input'], a: 1,
      why: 'Without a master the data line behaves as an ordinary switching output; the digital features are simply unused.' },
    { q: 'Why do valve terminals often take a separate supply for the valves?', choices: ['The valves need a higher voltage', 'So that a safety circuit can remove the valves\' power while the bus keeps communicating', 'To halve the current', 'Because the bus cannot carry power'], a: 1,
      why: 'Cutting only the valve supply puts the valves in their spring positions while the terminal still reports its diagnostics.' },
    { q: 'IO-Link connects many sensors along one cable, like a bus.', a: false,
      why: 'It is point-to-point: one device per master port; the master connects to the controller over a fieldbus.' },
    { q: 'A terminal has 24 coils of 0.5 W energised on 24 V. What current does it draw?', answer: 0.5, unit: 'A',
      why: '$I = 24 \\times 0.5/24 = 0.5$ A.' },
    { q: 'The power to a valve terminal fails. Cylinders driven by double-solenoid 5/2 valves…', choices: ['retract', 'extend', 'stay where they are', 'float freely'], a: 2,
      why: 'A double-solenoid valve keeps its last position without power, so its cylinder keeps its pressure and position (single-solenoid valves spring back).' }
  ],
  problems: [
    { q: 'A valve terminal 30 m from its 24 V supply draws 3 A through conductors of 1.5 mm² (copper, 0.0178 Ω·mm²/m). What is the voltage drop?', answer: 2.14, unit: 'V', tol: 0.02,
      steps: ['$\\Delta V = 2 \\times 0.0178 \\times 30 \\times 3/1.5 = 2.14$ V.', 'The terminal sees 21.9 V — only just within 24 V − 10 %.'] }
  ],
  applications: ['Valve terminals on PROFINET or EtherNet/IP beside the cylinders they drive.', 'IO-Link pressure and flow sensors reporting values and diagnostics.', 'Small IO-Link valve terminals and proportional regulators on port class B.', 'Replacing a failed sensor with automatic re-parameterisation from the master.'],
  history: 'Fieldbuses spread from the late 1980s — PROFIBUS was specified in Germany in 1989 — and valve terminals with built-in bus nodes followed in the early 1990s. Industrial Ethernet took over from the 2000s. IO-Link was specified in 2006–2007 by a group of sensor and automation makers and standardised as IEC 61131-9 in 2013.'
},

/* ================================================================ SAFETY FUNCTIONS */
{
  id: 'safety-functions', parent: 'electrical-control', title: 'Safety functions and performance levels', level: 3,
  short: 'A safety function is what a machine must do to keep people safe — exhaust the air, stop or hold a movement, prevent an unexpected start — and ISO 13849-1 grades how reliably it is done, from performance level a to e, through its architecture (category), reliability (MTTFd), self-checking (DC) and resistance to common-cause failures.',
  keywords: ['safety function', 'ISO 13849-1', 'ISO 13849-2', 'performance level', 'PL', 'PLr', 'category', 'MTTFd', 'B10d', 'T10d', 'diagnostic coverage', 'DC', 'common cause failure', 'CCF', 'PFHd', 'safe exhaust', 'two-channel', 'redundancy', 'spool monitoring', 'safety relay', 'safety PLC', 'unexpected start-up', 'ISO 14118', 'ISO 12100', 'risk assessment'],
  prereq: ['pneumatic-safety', 'emergency-stop-pneu', 'solenoids-relays'],
  related: ['two-hand-control', 'soft-start', 'iso-4414', 'plc-control', 'fieldbus-io-link', 'ladder-diagrams', 'hydraulics:hydraulic-safety'],
  body: `
Machine safety starts with a risk assessment (ISO 12100:2010): remove hazards by design, then guard what remains, then warn. Where a control system is part of the protection — a light curtain that must stop a press, a guard door that must exhaust a gripper — how reliably it does its job must be engineered and shown. For the safety-related parts of control systems that is ISO 13849-1:2023 (with part 2 for validation); IEC 62061 is the alternative for electrical systems. In pneumatics the energy to control is the air.

### Pneumatic safety functions
| Safety function | What it does | Typical means |
|---|---|---|
| Safe exhaust | removes pressure from the actuators | two exhaust valves with monitored spools |
| Prevention of unexpected start-up | stays exhausted until a deliberate reset | self-holding logic, lockable shut-off (ISO 14118:2017) |
| Stop and hold | stops a movement, keeps position | closed-centre valves, piloted non-return valves, rod locks |
| Reversing | moves away from a trap | reversing valve with limited force |
| Reduced pressure or speed | set-up mode | safe pressure reduction, flow limiting |
| Two-hand control | keeps both hands on the buttons | ISO 13851:2019 ([[two-hand-control]]) |

"Exhaust everything" is not always safe: a vertical cylinder drops its load, a gripper drops its part, a clamp releases the workpiece. The function must match the hazard. And blocking the air does not stop a moving mass dead — it bounces on the air spring ([[servo-pneumatics]]).

### Performance levels
From the risk — severity of injury (S1 slight, S2 serious), frequency of exposure (F1, F2) and possibility of avoiding it (P1, P2) — the risk graph gives the **required performance level** PLr, from a (lowest) to e. The PL achieved, which must reach PLr, depends on four things:

- **Category** (architecture): B and 1 single-channel (1 with well-tried components); 2 single-channel with periodic testing; 3 two channels, where one fault does not lose the function; 4 two channels, with faults detected and accumulations of faults considered.
- **MTTFd** of each channel: low 3–10, medium 10–30, high 30–100 years.
- **Diagnostic coverage** DCavg: none (below 60 %), low (60–90 %), medium (90–99 %), high (99 % and above).
- **Common-cause failures**: measures against one cause defeating both channels — separation, diversity, clean air.

| PL | Dangerous failures per hour (PFHd) |
|---|---|
| a | $10^{-5}$ to $10^{-4}$ |
| b | $3\\times10^{-6}$ to $10^{-5}$ |
| c | $10^{-6}$ to $3\\times10^{-6}$ |
| d | $10^{-7}$ to $10^{-6}$ |
| e | $10^{-8}$ to $10^{-7}$ |

PL d means, on average, fewer than one dangerous failure in about 110 years of continuous running.

### Valves wear by cycles: $B_{10D}$
A valve's reliability is quoted as $B_{10D}$ — the number of cycles after which 10 % of samples have failed dangerously; makers quote a few million to tens of millions. With $n_{op}$ operations a year, $\\mathrm{MTTF}_D = B_{10D}/(0.1\\,n_{op})$, and after $T_{10D} = B_{10D}/n_{op}$ years the valve should be replaced.

### Two channels, watched
One valve is one channel: a spool stuck by dirt or a broken spring means no exhaust. For category 3 or 4, two valves are arranged so that either alone exhausts the actuator, a sensor reports each spool's position, and a safety relay or safety PLC compares the sensors with the commands on every cycle; a mismatch blocks the restart. A pressure sensor downstream adds a plausibility check. Common causes — dirty or wet air sticking both spools — are countered by treated air (ISO 8573-1:2010) and by using two different valve types. The same principle runs on the electrical side, from the emergency-stop button through a safety relay to the valve supply ([[emergency-stop-pneu]], [[fieldbus-io-link]]).

> [!warn] This page explains principles only. Designing and validating a safety function needs the standards themselves (ISO 12100, ISO 13849-1 and -2, ISO 4414) and competent people. Never bypass an interlock; before working on a machine, stop it, exhaust the air, lock out all energy sources and support raised loads.
`,
  ideas: [
    'A safety function is a specific job — exhaust, hold, prevent restart, reverse, limit — chosen to match the hazard; exhausting is not always the safe state.',
    'ISO 13849-1 grades a safety function from PL a to e by architecture (category), component reliability (MTTFd), self-checking (DC) and common-cause measures.',
    'Pneumatic valves wear by cycles: B10d and the number of operations a year give their MTTFd and a replacement interval.',
    'Two channels with monitored spools, compared by a safety relay, keep the function when one valve sticks — and detect that it did.',
    'Clean, dry air is itself a safety measure: it prevents one cause from sticking both channels.'
  ],
  pitfalls: [
    'Exhausting all the air always makes a pneumatic machine safe — Vertical loads fall, grippers drop parts and clamps release workpieces; some hazards need the pressure held, or a controlled reversal.',
    'Two valves in series are automatically category 3 — Without monitoring, a stuck valve goes unnoticed until the second one sticks too; the faults must be detected, and common causes such as contaminated air controlled.',
    'A valve with a high B10d is reliable however much it is used — MTTFd falls in proportion to the number of operations a year: a valve cycling every second may reach only a medium MTTFd.'
  ],
  formulas: [
    {
      name: 'Operations a year',
      expr: 'nop = d*h/tc', tex: 'n_{op} = \\dfrac{d_{op}\\,h_{op}}{t_{cycle}}',
      vars: {
        nop: { name: 'operations per year', q: false, unit: 'cycles/yr', tex: 'n_{op}' },
        d: { name: 'operating days per year', q: false, unit: 'days/yr', value: 220, tex: 'd_{op}' },
        h: { name: 'operating hours per day', q: 'time', unit: 'h', value: 16, tex: 'h_{op}' },
        tc: { name: 'time between operations of the valve', q: 'time', unit: 's', value: 4, tex: 't_{cycle}' }
      },
      note: 'ISO 13849-1 writes it as d·h·3600/t with h in hours and t in seconds; here the calculator converts the hours for you.',
      practice: { unknowns: ['nop', 'tc'] },
      stories: { nop: 'A machine runs {h} a day on {d}; its safety valve operates every {tc}. How many operations a year?' }
    },
    {
      name: 'MTTFd from B10d',
      expr: 'MTTFd = B10d/(0.1*nop)', tex: '\\mathrm{MTTF}_D = \\dfrac{B_{10D}}{0.1\\,n_{op}}',
      vars: {
        MTTFd: { name: 'mean time to dangerous failure', q: false, unit: 'years', tex: '\\mathrm{MTTF}_D' },
        B10d: { name: 'cycles until 10 % fail dangerously', q: false, unit: 'cycles', value: 20000000, tex: 'B_{10D}' },
        nop: { name: 'operations per year', q: false, unit: 'cycles/yr', value: 3168000, tex: 'n_{op}' }
      },
      note: 'For components that wear by use. The valve should be replaced after T10d = B10d/n_op years, a tenth of the MTTFd. Channels are rated low (3–10 years), medium (10–30) or high (30–100).',
      practice: { unknowns: ['MTTFd', 'nop'] },
      stories: { MTTFd: 'A valve with a B10d of {B10d} operates {nop}. What is its MTTFd?', nop: 'A valve with a B10d of {B10d} must reach an MTTFd of {MTTFd}. How many operations a year may it make?' }
    }
  ],
  examples: [
    {
      title: 'Is this valve reliable enough?',
      q: 'A safe-exhaust valve with $B_{10D}$ = 20 million cycles operates every 4 s, 16 hours a day, 220 days a year. Find its MTTFd and when it should be replaced. What if the machine cycled every second?',
      steps: [
        '$n_{op} = 220 \\times 16 \\times 3600/4 = 3.17\\times10^6$ operations a year.',
        '$\\mathrm{MTTF}_D = 2\\times10^7/(0.1 \\times 3.17\\times10^6) = 63$ years: "high".',
        '$T_{10D} = 2\\times10^7/3.17\\times10^6 = 6.3$ years: replace it within about six years.',
        'Every second: $n_{op} = 1.27\\times10^7$, $\\mathrm{MTTF}_D = 15.8$ years (medium) and $T_{10D}$ = 1.6 years.'
      ],
      a: 'MTTFd 63 years (high), replacement after about 6 years; cycling four times as often cuts both by four.'
    },
    {
      title: 'Choosing the architecture',
      q: 'Operators reach into a machine several times an hour to load parts; a pneumatic press cylinder could crush a hand (serious injury), and avoiding it is possible only under favourable conditions. The guard door must exhaust the cylinder. Outline a solution.',
      steps: [
        'Risk graph: S2 (serious), F2 (frequent), P1 (avoidance possible under some conditions) gives PLr d.',
        'PL d in category 3: two exhaust valves so that either alone vents the cylinder, each with a spool-position sensor.',
        'A safety relay checks both spool sensors against the door switch every time the door opens; a mismatch prevents a restart. Two door switches of different types feed it.',
        'Valves with a high MTTFd, treated air and separate routing of the two channels complete it; the calculation and validation follow ISO 13849-1 and -2.'
      ],
      a: 'PLr d, met with a category 3 two-channel safe exhaust, monitored spools, a safety relay, and measures against common causes.'
    }
  ],
  quiz: [
    { q: 'Two identical exhaust valves in series, unmonitored, share the same wet, dirty air. What limits the safety most?', choices: ['The number of valves', 'A common-cause failure sticking both valves', 'The coil voltage', 'The exhaust silencer size'], a: 1,
      why: 'Redundancy helps only if the channels fail independently; the same contamination can stick both spools, and nothing detects the first failure.' },
    { q: 'Exhausting all the air is always the safe state of a pneumatic machine.', a: false,
      why: 'Vertical cylinders drop their loads, grippers drop parts, clamps release workpieces: the safe state depends on the hazard.' },
    { q: 'A valve has $B_{10D}$ = 10 million cycles and operates 2 million times a year. What is its MTTFd in years?', answer: 50,
      why: '$\\mathrm{MTTF}_D = 10^7/(0.1 \\times 2\\times10^6) = 50$ years.' },
    { q: 'Which performance level corresponds to a probability of dangerous failure between $10^{-7}$ and $10^{-6}$ per hour?', choices: ['PL b', 'PL c', 'PL d', 'PL e'], a: 2,
      why: 'PL d spans $10^{-7}$ to $10^{-6}$ per hour; PL e is ten times better.' },
    { q: 'What does category 3 require that category 1 does not?', choices: ['Well-tried components only', 'That a single fault does not lose the safety function, with faults detected where practicable', 'A PLC', 'Testing once a year'], a: 1,
      why: 'Category 1 is a single, well-tried channel; category 3 adds redundancy so one fault leaves the function working, and monitoring to find the fault.' }
  ],
  problems: [
    { q: 'A machine runs 8 hours a day, 250 days a year; its safety valve operates every 2 s and has a $B_{10D}$ of 5 million cycles. What is the valve\'s MTTFd in years?', answer: 13.9, tol: 0.02,
      steps: ['$n_{op} = 250 \\times 8 \\times 3600/2 = 3.6\\times10^6$ a year.', '$\\mathrm{MTTF}_D = 5\\times10^6/(0.1 \\times 3.6\\times10^6) = 13.9$ years — "medium".'] }
  ],
  applications: ['Guard doors that exhaust the air of a gripper or press before they open.', 'Safe-exhaust valve units with monitored spools at a machine\'s air inlet.', 'Two-hand controls on pneumatic presses.', 'Safe holding of vertical axes with rod locks and piloted non-return valves.'],
  history: 'EN 954-1 (1996) introduced the categories B and 1–4. ISO 13849-1:2006 added reliability and diagnostics to them to give performance levels, and EN 954-1 was withdrawn at the end of 2011; the standard was revised in 2015 and 2023.'
},

/* ================================================================ PROPORTIONAL PRESSURE */
{
  id: 'proportional-pressure', parent: 'proportional-pneu', title: 'Proportional pressure regulators', level: 2,
  short: 'An electrically set pressure regulator: a 0–10 V or 4–20 mA set-point becomes an outlet pressure, held by an internal loop of a pressure sensor, electronics and two small pilot valves. It turns a pneumatic cylinder into a force actuator that a controller can adjust on the fly.',
  keywords: ['proportional pressure regulator', 'electro-pneumatic regulator', 'E/P converter', 'I/P converter', 'set-point', '0–10 V', '4–20 mA', 'closed loop', 'pressure sensor', 'pilot valves', 'piezo valve', 'linearity', 'hysteresis', 'response time', 'force control', 'web tension', 'painting', 'spray gun', 'balancing', 'filling time'],
  prereq: ['pressure-regulators', 'solenoids-relays', 'electronics:negative-feedback'],
  related: ['servo-pneumatics', 'digital-pneumatics', 'cylinder-force', 'sensors-pneu', 'fieldbus-io-link', 'filling-emptying', 'sonic-conductance', 'hydraulics:proportional-valves'],
  body: `
A mechanical regulator is set by turning a screw: the screw loads a spring, and the regulator balances the outlet pressure against it ([[pressure-regulators]]). Replace the hand on the screw by electronics and you have a **proportional pressure regulator** — also called an electro-pneumatic regulator or E/P converter. A controller sends a set-point, typically 0–10 V, 4–20 mA or a value over a network, and the regulator produces the matching outlet pressure, for example 0–6 or 0–10 bar gauge, in a straight line: $p_g = p_{fs}\\,U/U_{fs}$.

### A closed loop inside
1. A **pressure sensor** measures the outlet pressure.
2. The **electronics** compare it with the set-point ([[electronics:negative-feedback]]).
3. Too low: a small 2/2 **fill valve** lets supply air in. Too high: a **vent valve** lets air out. Both are fast solenoid or piezo valves, pulsed.
4. In small units these two valves feed the outlet directly; in larger ones they set the pressure in a pilot chamber above a diaphragm, and a pilot-operated main stage passes the big flow — a mechanical regulator whose spring has become air.

Typical figures: linearity and hysteresis 0.5–1 % of full scale, repeatability about 0.5 %, a step response of 20–200 ms depending on the volume downstream, and flows from 100 to several thousand litres a minute (ANR). A good regulator also relieves: lower the set-point and the outlet pressure falls. It needs a supply at least 1 bar above its highest outlet pressure, and clean, dry air for its small pilots.

### Force as a set-point
A cylinder's force is pressure times area ([[cylinder-force]]), so a proportional regulator makes it an electrically adjustable **force actuator**:

- a press-fit whose force is programmed for each product;
- a spot-welding gun that squeezes with a force profile;
- a polishing or grinding head pressed on with constant force while a robot moves it;
- a gripper that holds eggs and castings with different forces;
- web tension on a film or paper line, set by a pneumatic brake or dancer;
- atomising air and paint pressure in a spray gun, set per colour and per part;
- a vertical axis balanced so that it floats.

Friction limits the accuracy: seals take 5–15 % of the force in a small cylinder, more at the start, so force control uses low-friction cylinders — or a load cell and an outer control loop around the regulator.

### How fast?
The outlet volume — tubes, cylinder chamber — must be filled through the main stage. While the flow is choked ([[sonic-conductance]]), a sonic conductance $C$ fed from $p_1$ absolute raises the pressure in a volume $V$ by $\\Delta p$ in about
$$t = \\frac{V\\,\\Delta p}{C\\,p_1\\,p_0}$$
with $p_0$ = 1 bar, the ANR reference. It is a best case: near the supply pressure the flow falls off, and filling heats the air, which then cools and sags a little ([[filling-emptying]]). Half a litre and $C$ = 1 dm³/(s·bar) from an 8 bar supply take about 0.17 s for a 3 bar step; ten litres take over three seconds. The internal loop's gain is set by the maker — some offer a "fast" and a "no overshoot" setting — and a gain too high for a small volume makes the pressure overshoot and ring.

> [!warn] If the power or the set-point fails, most proportional regulators vent their outlet to zero: clamps open, balanced axes fall. Protect vertical and balanced loads mechanically (rod lock, piloted non-return valve), and exhaust and lock out before working on the machine.
`,
  ideas: [
    'A proportional regulator is a pressure regulator whose spring is replaced by a set-point and a closed electronic loop.',
    'Inside, a sensor, a controller and two small valves (fill and vent) hold the outlet pressure; larger units use them to pilot a main stage.',
    'Pressure times piston area makes force: the regulator turns a cylinder into a programmable force actuator.',
    'The response time grows with the volume to be filled: t ≈ V·Δp/(C·p₁·p₀) while the flow is choked.',
    'On loss of power or set-point most regulators vent: loads that depend on the pressure must be secured mechanically.'
  ],
  pitfalls: [
    'The regulator\'s accuracy is the force accuracy — Seal friction, which varies with speed, temperature and wear, adds 5–15 % of uncertainty in small cylinders; precise force needs low-friction cylinders or force feedback.',
    'A regulator answers as fast whatever it feeds — It must fill the downstream volume: ten times the volume, ten times the response time.',
    'A proportional regulator holds its pressure when the power fails — Most vent to zero; some hold, briefly. Check what the machine does in either case.'
  ],
  formulas: [
    {
      name: 'Set-point to pressure',
      expr: 'p = pfs*U/Ufs', tex: 'p_g = p_{fs}\\,\\dfrac{U}{U_{fs}}',
      vars: {
        p: { name: 'outlet pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_g' },
        pfs: { name: 'full-scale pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_{fs}' },
        U: { name: 'set-point voltage', q: 'voltage', unit: 'V', value: 4 },
        Ufs: { name: 'full-scale set-point', q: 'voltage', unit: 'V', value: 10, fixed: true, tex: 'U_{fs}' }
      },
      note: 'For a 0–10 V input; for 4–20 mA use the live-zero scaling of a transducer. Real regulators have a small dead zone near zero.',
      practice: { unknowns: ['p', 'U'] },
      stories: { p: 'A 0 to {pfs} regulator receives {U} on its 0–10 V input. What pressure does it set?', U: 'A 0 to {pfs} regulator must deliver {p}. What set-point voltage is needed?' }
    },
    {
      name: 'Cylinder force from the set pressure',
      expr: 'F = p*pi*D^2/4 - Ff', tex: 'F = p_g\\,\\dfrac{\\pi D^2}{4} - F_f',
      vars: {
        F: { name: 'net force', q: 'force', unit: 'N' },
        p: { name: 'set pressure (gauge)', q: 'pressure', unit: 'bar', value: 2.4, tex: 'p_g' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 50 },
        Ff: { name: 'seal friction', q: 'force', unit: 'N', value: 30, tex: 'F_f' }
      },
      note: 'Pushing, with the other chamber exhausted. Friction depends on seals, speed and wear; for accurate force, measure it.',
      practice: { unknowns: ['F', 'p'] },
      stories: { F: 'A {D} bore cylinder with {Ff} of seal friction is fed at {p}. What force does it press with?', p: 'A {D} bore cylinder with {Ff} of friction must press with {F}. What pressure must the regulator set?' }
    },
    {
      name: 'Filling time while the flow is choked',
      expr: 't = V*dp/(C*p1*p0)', tex: 't = \\dfrac{V\\,\\Delta p}{C\\,p_1\\,p_0}',
      vars: {
        t: { name: 'filling time', q: 'time', unit: 's' },
        V: { name: 'volume filled', q: 'volume', unit: 'L', value: 0.5 },
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', value: 3, tex: '\\Delta p' },
        C: { name: 'sonic conductance of the path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1 },
        p1: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar', value: 9, tex: 'p_1' },
        p0: { name: 'reference pressure, ANR (absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' }
      },
      note: 'Isothermal filling with choked flow (outlet below about b·p₁). Adiabatic filling rises up to 1.4 times faster at first but then sags as the air cools; near the supply pressure the flow falls and the end takes longer.',
      practice: { unknowns: ['t', 'V'] },
      stories: { t: 'A regulator with a sonic conductance of {C}, fed at {p1}, must raise the pressure in {V} by {dp}. At best, how long does it take?' }
    }
  ],
  examples: [
    {
      title: 'Programming a press-fit force',
      q: 'A 50 mm cylinder must press a bearing in with 800 N; its seals take about 40 N. The regulator gives 0–10 bar for 0–10 V. What set-point is needed? And with a 0–6 bar regulator?',
      steps: [
        'Area: $\\pi \\times 0.05^2/4 = 1.963\\times10^{-3}$ m².',
        '$p = (800 + 40)/1.963\\times10^{-3} = 4.28\\times10^5$ Pa = 4.28 bar.',
        '0–10 bar: $U = 10 \\times 4.28/10 = 4.28$ V. 0–6 bar: $U = 10 \\times 4.28/6 = 7.13$ V.'
      ],
      a: '4.28 bar: a set-point of 4.28 V on a 0–10 bar regulator, 7.13 V on a 0–6 bar one.'
    },
    {
      title: 'How quickly can the force change?',
      q: 'The cylinder chamber and tube hold 0.5 L. The regulator\'s main stage has $C$ = 1 dm³/(s·bar) and is fed at 8 bar gauge (9 bar absolute). How long, at best, does a step from 2 to 5 bar take? And with a 10 L chamber?',
      steps: [
        '$t = V\\Delta p/(C p_1 p_0) = 5\\times10^{-4} \\times 3\\times10^5/(1\\times10^{-8} \\times 9\\times10^5 \\times 10^5) = 0.17$ s.',
        'Twenty times the volume: $0.17 \\times 20 = 3.3$ s.',
        'The outlet at 6 bar absolute is two-thirds of the supply, so the flow is no longer fully choked at the end: the real time is somewhat longer.'
      ],
      a: 'About 0.17 s for 0.5 L and 3.3 s for 10 L, as lower limits.'
    }
  ],
  quiz: [
    { q: 'The set-point wire of a 4–20 mA proportional regulator breaks. Typically the outlet pressure…', choices: ['stays where it was', 'rises to full scale', 'falls to zero as the regulator vents', 'oscillates'], a: 2,
      why: '0 mA is below the live zero and is treated as a zero (or fault) set-point: the regulator vents its outlet.' },
    { q: 'A proportional regulator reaches a new pressure just as fast whatever volume it feeds.', a: false,
      why: 'It must pass the air to fill the volume: the time grows in proportion to the volume.' },
    { q: 'A 0–10 bar regulator with a 0–10 V input receives 3.5 V. What pressure does it set, in bar?', answer: 3.5, unit: 'bar',
      why: '$p = 10 \\times 3.5/10 = 3.5$ bar gauge.' },
    { q: 'Why does the force of a pressure-controlled cylinder differ from $p\\,A$?', choices: ['The regulator is non-linear', 'Seal friction takes part of it, and more at the start of movement', 'Air is compressible', 'The rod area adds to it'], a: 1,
      why: 'Seal friction (5–15 % in small cylinders, higher at breakaway) is subtracted from the pressure force.' },
    { q: 'Inside a proportional regulator, the outlet pressure is above the set-point. What happens?', choices: ['The fill valve opens', 'The vent valve opens and air escapes until the pressures match', 'Nothing until the next set-point', 'The supply is shut off'], a: 1,
      why: 'The controller sees a negative error and opens the vent (relief) valve; the regulator actively lowers its outlet.' }
  ],
  problems: [
    { q: 'A 63 mm cylinder must press with 1200 N; friction is about 60 N. What set-point voltage does a 0–10 bar, 0–10 V regulator need?', answer: 4.04, unit: 'V', tol: 0.02,
      steps: ['$A = \\pi \\times 0.063^2/4 = 3.117\\times10^{-3}$ m².', '$p = 1260/3.117\\times10^{-3} = 4.04\\times10^5$ Pa = 4.04 bar.', '$U = 4.04$ V.'] }
  ],
  applications: ['Press-fit and joining forces programmed per product.', 'Spot-welding guns and polishing heads with controlled contact force.', 'Web tension on printing, film and paper lines.', 'Paint and atomising-air pressure on painting robots.'],
  history: 'Pneumatic transmitters and current-to-pressure (I/P) converters carried process-control signals as 0.2–1 bar air long before electronics took over. Electronic proportional pressure regulators with an internal sensor and pulsed pilot valves became common in factory automation in the 1990s; piezo pilot valves later cut their power and noise.',
  sim: 'ep-prop-reg'
},

/* ================================================================ SERVO-PNEUMATICS */
{
  id: 'servo-pneumatics', parent: 'proportional-pneu', title: 'Servo-pneumatic positioning', level: 3,
  short: 'Stopping springy air at any point: a proportional 5/3 valve, a position sensor on the cylinder and a fast controller together position a pneumatic axis to about ±0.2 mm. The difficulty is the air spring — a low, lightly damped natural frequency that the controller must tame with velocity and pressure feedback.',
  keywords: ['servo-pneumatics', 'servo pneumatic', 'positioning', 'proportional directional valve', 'proportional 5/3 valve', 'position sensor', 'magnetostrictive', 'state control', 'PID', 'natural frequency', 'air spring', 'pneumatic stiffness', 'damping', 'stick-slip', 'closed loop', 'overshoot', 'stability', 'soft stop'],
  prereq: ['pneumatic-spring', 'proportional-pressure', 'cylinder-motion', 'electronics:negative-feedback'],
  related: ['stick-slip', 'pneumatic-vs-electric', 'digital-pneumatics', 'safety-functions', 'hydraulics:servo-loop', 'hydraulics:hydraulic-stiffness', 'physics:mass-spring-system', 'physics:damped-oscillations', 'math:damped-oscillator-ode'],
  body: `
An ordinary pneumatic cylinder has two positions — its end stops. With a 5/3 closed-centre valve it can be stopped in between, but not precisely: the piston coasts on, bounces on the trapped air and creeps as the seals leak. **Servo-pneumatics** closes a loop: a position sensor reports where the piston is a thousand times a second, a controller compares that with the target, and a proportional directional valve opens in proportion to the command, in either direction. The result is any position along strokes of up to about 2 m, repeatable to about ±0.2 mm (±0.1 to ±0.5 mm), at speeds up to about 3 m/s, with electronic braking before the end positions (soft stop).

### The parts
- A **proportional 5/3 valve**: its spool, moved by a proportional solenoid with its own position loop, connects supply to one chamber and the other chamber to exhaust with an opening proportional to the signal; at zero signal the centre closes both chambers (the oil equivalent is the [[hydraulics:servo-valves|servo valve]]).
- A **position sensor**: magnetostrictive or potentiometric, often built into the cylinder.
- A **controller** measuring position, velocity and both chamber pressures.
- A **low-friction cylinder**: stick-slip is the enemy of accuracy ([[stick-slip]]).

### Why air is hard: a mass on a spring
The air in each chamber is a spring ([[pneumatic-spring]]). Its bulk modulus is $\\kappa p$ — for quick changes $\\kappa$ = 1.4, so about 0.7 MPa at 5 bar absolute, two thousand times softer than oil. A chamber of area $A$ and length $x$ has stiffness $\\kappa p A/x$; the two chambers act in parallel:
$$k = \\kappa\\,p\\,A\\left(\\frac{1}{x} + \\frac{1}{L - x}\\right)$$
lowest at mid-stroke. The moving mass on this spring has the natural frequency $f_0 = \\frac{1}{2\\pi}\\sqrt{k/m}$ ([[physics:mass-spring-system]]):

| Moving mass | $f_0$ with air | $f_0$ with oil instead |
|---|---|---|
| 1 kg | 13.8 Hz | 617 Hz |
| 5 kg | 6.2 Hz | 276 Hz |
| 20 kg | 3.1 Hz | 138 Hz |
| 50 kg | 1.9 Hz | 87 Hz |

*A 32 mm bore with a 300 mm stroke at mid-stroke, chambers at 5 bar absolute; the oil column with a bulk modulus of 1.4 GPa, before hoses soften it.*

The damping comes only from seal friction and flow losses — a damping ratio of 0.05–0.2 — so a pneumatic axis is a slow, lightly damped oscillator ([[physics:damped-oscillations]]).

### Taming it
With position feedback alone, the loop gain $K$ — piston speed per unit of position error — must stay below about $2\\zeta\\omega_0 = 4\\pi\\zeta f_0$, a few per second: the piston lags a moving target by tens of millimetres and creeps into position. Servo-pneumatic controllers therefore also feed back the **velocity** and the **pressure difference** across the piston — the force, and so the acceleration. This state control adds the damping the air lacks and lets the gain rise several times ([[hydraulics:servo-loop]]). Friction is compensated by a feed-forward term, and the controller must know the payload, because $f_0$ changes with $1/\\sqrt{m}$: gains tuned for 2 kg make a 20 kg load ring or oscillate.

### Where it pays
Many positions from one cylinder (format changes, sorting to several lanes, pressing depths), soft stops that cut cycle times and shocks, and high force for its size and weight. An electric servo axis is stiffer and more accurate (±0.01 mm) and often easier to commission; servo-pneumatics wins where force density, tolerance of overload and an existing air supply count ([[pneumatic-vs-electric]]).

> [!warn] A servo-pneumatic axis moves whenever its controller commands, and with a closed-centre valve it keeps its chambers pressurised when stopped. Exhaust both chambers, lock out and support the load before reaching in; a gain set too high makes the axis oscillate violently.
`,
  ideas: [
    'A servo-pneumatic axis combines a proportional 5/3 valve, a position sensor and a controller to stop anywhere within about ±0.2 mm.',
    'Trapped air is a soft spring, k = κpA(1/x + 1/(L − x)), weakest at mid-stroke — two thousand times softer than oil.',
    'The moving mass on that spring gives a low natural frequency, a few hertz, with very little damping.',
    'Position feedback alone must be slow to stay stable; velocity and pressure-difference feedback add damping and allow high gains.',
    'The natural frequency falls with the square root of the payload, so the controller must be tuned for the mass it moves.'
  ],
  pitfalls: [
    'A closed-centre valve holds a pneumatic piston as rigidly as a hydraulic one — Air is about two thousand times softer than oil: a force change moves the piston, and it bounces on the trapped air.',
    'A PID controller tuned on the position alone is enough — On a lightly damped air spring it must be so slow that the axis lags and creeps; state feedback of velocity and pressures is what makes servo-pneumatics work.',
    'Once tuned, the axis works with any payload — The natural frequency changes with 1/√m; a much heavier load with the same gains rings or oscillates.'
  ],
  formulas: [
    {
      name: 'Air-spring stiffness of a double-acting cylinder',
      expr: 'k = kappa*p*A*(1/x + 1/(L - x))', tex: 'k = \\kappa\\,p\\,A\\left(\\dfrac{1}{x} + \\dfrac{1}{L - x}\\right)',
      vars: {
        k: { name: 'stiffness', q: 'stiffness', unit: 'N/mm' },
        kappa: { name: 'polytropic exponent (1.4 quick, 1.0 slow changes)', value: 1.4, min: 1, max: 1.4, tex: '\\kappa' },
        p: { name: 'chamber pressure (absolute)', q: 'pressure', unit: 'bar', value: 5 },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 8.04 },
        x: { name: 'piston position from the cap end', q: 'length', unit: 'mm', value: 100 },
        L: { name: 'stroke (plus dead lengths)', q: 'length', unit: 'mm', value: 300 }
      },
      note: 'Equal areas and pressures on both sides, rod and dead volumes neglected (add the dead volume to each chamber as extra length). Two positions, symmetric about mid-stroke, give the same stiffness.',
      practice: { unknowns: ['k', 'p'] },
      stories: { k: 'A cylinder with a piston area of {A} and a stroke of {L} holds its piston at {x} with both chambers at {p}; take κ = {kappa}. How stiff is the air spring?' }
    },
    {
      name: 'Natural frequency of the load on the air',
      expr: 'f = sqrt(k/m)/(2*pi)', tex: 'f_0 = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{m}}',
      vars: {
        f: { name: 'natural frequency', q: 'frequency', unit: 'Hz', tex: 'f_0' },
        k: { name: 'air-spring stiffness', q: 'stiffness', unit: 'N/mm', value: 8.44 },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 5 }
      },
      note: 'Undamped natural frequency of the mass on the air spring; the real, lightly damped axis oscillates just below it.',
      practice: { unknowns: ['f', 'm'] },
      stories: { f: 'A pneumatic axis with an air-spring stiffness of {k} moves {m}. What is its natural frequency?', m: 'An air spring of {k} should give a natural frequency of {f}. What moving mass gives that?' }
    },
    {
      name: 'Gain limit with position feedback only',
      expr: 'K = 4*pi*zeta*f', tex: 'K_{max} = 2\\zeta\\,\\omega_0 = 4\\pi\\,\\zeta\\,f_0',
      vars: {
        K: { name: 'largest stable loop gain (speed per unit error)', q: 'rate', unit: '1/s', tex: 'K_{max}' },
        zeta: { name: 'damping ratio of the axis', value: 0.1, min: 0.01, max: 1, tex: '\\zeta' },
        f: { name: 'natural frequency', q: 'frequency', unit: 'Hz', value: 6.5, tex: 'f_0' }
      },
      note: 'From the linearised third-order model (integrator plus lightly damped air spring). The piston then lags a target moving at v by v/K.',
      practice: { unknowns: ['K', 'zeta'] },
      stories: { K: 'A pneumatic axis has a natural frequency of {f} and a damping ratio of {zeta}. What is the highest stable gain with position feedback only?' }
    }
  ],
  examples: [
    {
      title: 'How soft is the air?',
      q: 'A 50 mm cylinder (19.6 cm²) with a 400 mm stroke carries 20 kg; at rest both chambers are at 5 bar absolute. Find the stiffness and natural frequency at mid-stroke, and compare with oil (bulk modulus 1.4 GPa).',
      steps: [
        '$k = 1.4 \\times 5\\times10^5 \\times 1.963\\times10^{-3} \\times (1/0.2 + 1/0.2) = 1374 \\times 10 = 13\\,700$ N/m = 13.7 N/mm.',
        '$f_0 = \\sqrt{13\\,700/20}/(2\\pi) = 26.2/6.28 = 4.2$ Hz.',
        'With oil the stiffness is $1.4\\times10^9/(1.4 \\times 5\\times10^5) = 2000$ times higher and the frequency $\\sqrt{2000} = 45$ times: about 190 Hz.'
      ],
      a: 'About 13.7 N/mm and 4.2 Hz — against roughly 190 Hz for the same cylinder full of oil.'
    },
    {
      title: 'Why position feedback alone fails',
      q: 'The axis above has a damping ratio of 0.1. What loop gain can plain position control use, and how far does the piston lag behind a target moving at 0.5 m/s?',
      steps: [
        '$K_{max} = 4\\pi \\times 0.1 \\times 4.17 = 5.2$ per second.',
        'Following error: $e = v/K = 0.5/5.2 = 0.096$ m, nearly 100 mm.',
        'With velocity and pressure feedback the damping ratio can be raised towards 0.7, allowing gains of 30–50 per second and errors of 10–15 mm at that speed, which feed-forward of the target speed reduces further.'
      ],
      a: 'Only about 5 per second — a lag of some 96 mm at 0.5 m/s. State feedback is what makes the axis usable.'
    }
  ],
  quiz: [
    { q: 'The natural frequency of a pneumatic axis (equal areas) is lowest when the piston is…', choices: ['at either end', 'at mid-stroke', 'anywhere: it does not depend on position', 'at the end with the larger chamber'], a: 1,
      why: '$1/x + 1/(L - x)$ is smallest at $x = L/2$; near an end one chamber is short and very stiff.' },
    { q: 'Quadrupling the moving mass changes the natural frequency by a factor of…', choices: ['4', '2', '1/2', '1/4'], a: 2,
      why: '$f_0 \\propto 1/\\sqrt{m}$: four times the mass halves the frequency.' },
    { q: 'An air spring of 20 N/mm carries 8 kg. What is the natural frequency?', answer: 7.96, unit: 'Hz',
      why: '$f_0 = \\sqrt{20\\,000/8}/(2\\pi) = 50/6.28 = 7.96$ Hz.' },
    { q: 'With a closed-centre proportional valve at zero command, the piston is held as rigidly as by a hydraulic cylinder.', a: false,
      why: 'The trapped air is about two thousand times more compressible than oil; the piston yields to force changes and bounces.' },
    { q: 'Why do servo-pneumatic controllers measure both chamber pressures?', choices: ['To check the supply', 'Their difference gives the force on the piston, and feeding it back adds damping', 'To measure air consumption', 'To detect leaks only'], a: 1,
      why: 'The pressure difference times the area is the driving force, and so the acceleration; feeding it back damps the air spring.' }
  ],
  problems: [
    { q: 'A 40 mm cylinder (12.57 cm²) with a 250 mm stroke has both chambers at 7 bar absolute; κ = 1.4. What is the air-spring stiffness with the piston 50 mm from the cap end?', answer: 30.8, unit: 'N/mm', tol: 0.02,
      steps: ['$\\kappa p A = 1.4 \\times 7\\times10^5 \\times 1.257\\times10^{-3} = 1232$ N.', '$1/0.05 + 1/0.2 = 25$ per metre.', '$k = 1232 \\times 25 = 30\\,800$ N/m = 30.8 N/mm.'] }
  ],
  applications: ['Axes with many positions: format changes on packaging machines, sorting to several lanes.', 'Soft stop: fast strokes braked electronically, cutting cycle times and shocks.', 'Pressing to a programmed depth or force.', 'Positioning valves and dampers in process plants.'],
  history: 'Research on closed-loop pneumatic positioning grew through the 1980s as microcontrollers, fast proportional valves and absolute position sensors became affordable; the first commercial servo-pneumatic axes appeared in the early 1990s, and soft-stop systems for end-position braking followed.',
  sim: 'ep-servo'
},

/* ================================================================ DIGITAL PNEUMATICS */
{
  id: 'digital-pneumatics', parent: 'proportional-pneu', title: 'Digital pneumatics and condition monitoring', level: 2,
  short: 'Sensors, software and networks let a pneumatic system measure itself: flow and pressure sensors find leaks, stroke times reveal wear before a breakdown, and software-defined valves change their function by a download.',
  keywords: ['digital pneumatics', 'condition monitoring', 'predictive maintenance', 'flow sensor', 'leak detection', 'pressure decay test', 'standstill flow', 'stroke time', 'cycle time drift', 'energy monitoring', 'air consumption per part', 'piezo valve', 'software-defined valve', 'OPC UA', 'MQTT', 'Industry 4.0', 'ISO 11011', 'ISO 50001'],
  prereq: ['sensors-pneu', 'fieldbus-io-link', 'air-leaks'],
  related: ['leak-management', 'air-audits', 'cost-of-compressed-air', 'pressure-optimisation', 'maintenance-pneu', 'troubleshooting-pneu', 'proportional-pressure', 'servo-pneumatics'],
  body: `
For decades a pneumatic machine was blind: a cylinder either reached its sensor or the machine stopped with a fault. Cheap sensors, [[fieldbus-io-link|IO-Link]] and networks have changed that — the air system can report how much air it uses, where it leaks and which cylinder is getting slower, long before anything stops. **Digital pneumatics** also names valves whose function is set by software.

### Measuring the air
A **flow sensor** on each machine's supply — usually a thermal sensor that measures mass flow and reports it as free air ([[standard-air]]) — together with a pressure sensor gives the air used per machine, per shift and per part. Three readings matter most:

- **Standstill flow**. When the machine is stopped, all the flow is leakage; plants typically lose 20–30 % of their air this way ([[air-leaks]]).
- **Air per part**. A jump shows a valve stuck open, a lost suction cup, a burst tube.
- **Pressure at the machine** at peak demand: too low means undersized tubes or valves, too high means wasted energy ([[pressure-optimisation]]).

Without a flow sensor, a **pressure-decay test** measures the leakage of a section: close its supply valve and time the fall of pressure. At steady temperature, a volume $V$ that loses $\\Delta p$ in $\\Delta t$ leaks
$$Q = \\frac{V\\,\\Delta p}{p_0\\,\\Delta t}$$
of free air, with $p_0$ = 1 bar. The volume comes from the drawings or from a calibration with a known leak — and the test must wait until the air has cooled after filling, or the cooling is counted as leakage.

### Watching cylinders age
Two end-position sensors already give each cylinder's **stroke time**, from the valve command to the sensor at the far end. Stored as a baseline and watched, its drift tells a story:

| Symptom | Likely cause |
|---|---|
| Both strokes slowly slower | supply pressure falling, clogged filter or silencer |
| One stroke slower, air per cycle up | piston seal leaking across |
| Growing scatter in stroke time | friction rising, lubrication lost, stick-slip |
| Longer delay before movement starts | valve sticking, pilot air fault |
| Standstill flow creeping up | leaks in tubes, fittings, seals |

With limits — say an alarm at 15 % over the baseline — the repair is planned before the breakdown: **predictive maintenance**. Valve terminals add switching counters and coil diagnostics, and the data flows from the controller to maintenance systems by OPC UA or MQTT.

### Software-defined valves
Four fast piezo pilot valves per channel — supply to each chamber and each chamber to exhaust, a full bridge — can make any directional function: 5/2, the three 5/3 centres, proportional flow or pressure. Software chooses it and can change it from one cycle to the next: a return stroke at reduced pressure that saves air, soft stops, a leak test by closing both chambers and watching their pressures. One valve serves many functions, and fewer spares are stocked.

### Energy management
ISO 50001:2018 (energy management) and ISO 11011:2013 (assessing compressed-air systems) both start with measurement. What the data usually shows first: machines drawing air while idle — a shut-off valve switched by the controller often saves 10–30 % — and leaks, the cheapest energy to recover ([[leak-management]], [[air-audits]]).

> [!warn] A leak test keeps a stopped machine under pressure: operating a valve can still move its cylinders. Test only with the machine safe and guarded, and exhaust and lock out before any work on it.
`,
  ideas: [
    'A flow sensor on a stopped machine measures its leakage directly; plants commonly lose a fifth to a third of their air in leaks.',
    'A pressure-decay test gives the leak rate from the volume and the rate of pressure fall: Q = VΔp/(p₀Δt), once the temperature has settled.',
    'Stroke times from existing end-position sensors are a free wear indicator: drift and scatter point to seals, friction, valves or supply.',
    'Software-defined valves with four pilot valves per channel can take any directional or proportional function.',
    'Measuring comes first: idle shut-off and leak repair are usually the quickest savings.'
  ],
  pitfalls: [
    'A pressure-decay test can start as soon as the valve is closed — Freshly compressed air is warm; as it cools the pressure falls with no leak at all, so an early test overstates the leakage.',
    'Air consumption that looks normal on average means the machine is fine — Averages hide a stuck valve during pauses or a leak masked by production flow; the standstill flow and the air per part are the telling figures.',
    'Condition monitoring needs new sensors on every cylinder — The end-position sensors already fitted give stroke times; software and a baseline turn them into wear indicators.'
  ],
  formulas: [
    {
      name: 'Leak flow from a pressure-decay test',
      expr: 'Q = V*dp/(p0*dt)', tex: 'Q = \\dfrac{V\\,\\Delta p}{p_0\\,\\Delta t}',
      vars: {
        Q: { name: 'leak flow (free air)', q: 'airflow', unit: 'L/min ANR' },
        V: { name: 'volume under test', q: 'volume', unit: 'L', value: 50 },
        dp: { name: 'pressure drop during the test', q: 'pressure', unit: 'bar', value: 0.3, tex: '\\Delta p' },
        p0: { name: 'reference pressure, ANR (absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' },
        dt: { name: 'test time', q: 'time', unit: 's', value: 60, tex: '\\Delta t' }
      },
      note: 'Isothermal: start after the air has settled to room temperature (ANR is 20 °C, 100 kPa). Keep the drop small, since a leak shrinks as the pressure falls.',
      practice: { unknowns: ['Q', 'V'] },
      stories: { Q: 'A section of {V} loses {dp} in {dt} with its supply valve closed. How big is the leak?', V: 'A known leak of {Q} makes a closed section lose {dp} in {dt}. What is the section\'s volume?' }
    },
    {
      name: 'Yearly cost of an air flow',
      expr: 'Cy = Q*t*esp*c', tex: 'C_{yr} = Q\\,t\\,e_{sp}\\,c_e',
      vars: {
        Cy: { name: 'cost per year', q: 'money', unit: '$', tex: 'C_{yr}' },
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR', value: 15 },
        t: { name: 'hours a year it flows', q: 'time', unit: 'h', value: 8760 },
        esp: { name: 'specific energy of the compressed air', q: false, unit: 'kWh/m³', value: 0.11, tex: 'e_{sp}' },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15, tex: 'c_e' }
      },
      note: 'About 0.1–0.12 kWh per m³ of free air at 7 bar for a good compressor station; a leak flows all year, 8760 h, unless the air is shut off.',
      practice: { unknowns: ['Cy', 'Q'] },
      stories: { Cy: 'A leak of {Q} flows {t} a year; the air costs {esp} and electricity {c} per kWh. What does it cost a year?' }
    }
  ],
  examples: [
    {
      title: 'A weekend leak test',
      q: 'A machine section of 40 L (receiver and pipes) is closed off at 6 bar and left to settle. Its pressure then falls from 6.0 to 5.4 bar in 2 minutes. How large is the leak, and what does it cost a year around the clock (0.11 kWh/m³, 0.15 per kWh)?',
      steps: [
        '$Q = 40 \\times 0.6/(1.0 \\times 120) = 0.2$ L/s = 12 L/min of free air.',
        'A year: $0.2 \\times 8760 \\times 3600 = 6.3\\times10^6$ L = 6300 m³.',
        'Energy $6300 \\times 0.11 = 694$ kWh; cost $694 \\times 0.15 ≈ 104$.'
      ],
      a: 'About 12 L/min — some ¤104 a year for this one section.'
    },
    {
      title: 'Reading a stroke-time trend',
      q: 'A cylinder\'s extend time was 0.42 s when new; after some months it is 0.47 s, its retract time is unchanged, and its air per cycle has risen from 1.1 to 1.3 L. What is the likely cause?',
      steps: [
        'Only one stroke has slowed, so the supply pressure and the valve\'s supply side are not the cause — both strokes would suffer.',
        'More air per cycle with a slower stroke means air is going somewhere other than into useful work: across the piston seal into the exhausting chamber, which then pushes back.',
        'The rise of 12 % is below a typical 15 % alarm limit, but the trend lets the seal be replaced at the next planned stop.'
      ],
      a: 'A piston seal leaking across — found and planned for before the cylinder fails.'
    }
  ],
  quiz: [
    { q: 'A machine\'s flow sensor reads 35 L/min on a Sunday with everything stopped. This flow is…', choices: ['normal standby consumption of the valves', 'leakage', 'a sensor offset to be ignored', 'the air needed to hold the cylinders'], a: 1,
      why: 'With nothing moving, no air is being used for work: what flows is leaking out of tubes, fittings, valves or seals.' },
    { q: 'A closed section of 20 L loses 0.5 bar in 30 s. What is the leak, in L/min of free air?', answer: 20, unit: 'L/min',
      why: '$Q = 20 \\times 0.5/(1 \\times 30) = 0.333$ L/s = 20 L/min.' },
    { q: 'Starting a pressure-decay test immediately after filling gives a leak reading that is too high.', a: true,
      why: 'The air heated by filling cools towards room temperature, and its pressure falls with it even without a leak.' },
    { q: 'A cylinder\'s extend time slowly rises while its air per cycle rises too. The most likely cause is…', choices: ['falling supply pressure', 'a piston seal leaking across', 'a clogged silencer', 'a loose sensor'], a: 1,
      why: 'Falling pressure or a clogged silencer slow the strokes without raising air use; air passing the piston seal both slows the stroke and wastes air.' },
    { q: 'What lets a "digital" piezo valve act as a 5/2 or a 5/3 valve on demand?', choices: ['A spool with several shapes', 'Four independently controlled pilot valves per channel, opened by software in any pattern', 'Two solenoids', 'A mechanical detent'], a: 1,
      why: 'Supply-to-A, A-to-exhaust, supply-to-B and B-to-exhaust valves form a bridge; which ones open decides the function.' }
  ],
  problems: [
    { q: 'A leak of 50 L/min flows around the clock. The compressed air costs 0.11 kWh per m³ and electricity 0.15 per kWh. What does it cost a year (in currency units)?', answer: 434, tol: 0.02,
      steps: ['$50 \\times 60 \\times 8760 = 2.63\\times10^7$ L = 26\\,280 m³.', '$26\\,280 \\times 0.11 = 2891$ kWh; $2891 \\times 0.15 = 434$.'] }
  ],
  applications: ['Flow and pressure sensors at the air inlet of each machine.', 'Weekend leak tests by pressure decay.', 'Stroke-time monitoring for predictive maintenance on packaging and assembly lines.', 'Software-configured valve terminals with energy-saving functions.'],
  history: 'Compressed-air audits with portable flow meters date from the energy crises of the 1970s. Permanently installed sensors, networked valve terminals and the "Industry 4.0" programme presented at the Hannover fair in 2011 turned monitoring into a feature of the machine itself; software-defined piezo valve terminals appeared around 2017.',
  sim: 'ep-leak-test'
}

);
