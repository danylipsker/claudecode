/* HYPER-MOTORS · content/single-phase.js — single-phase induction motors: why one phase cannot start a motor,
 * split-phase, capacitor-start, capacitor-start-run, PSC and shaded-pole motors, start and run capacitors, the
 * Steinmetz connection; and from the comparisons topic: motors in explosive atmospheres and the life-cycle cost of a
 * motor. Numbers for "the 0.75 kW motor" come from the model in sims/single-phase.js (230 V, 50 Hz, 4 poles). */
Hyper.add(

{
  id: 'single-phase-problem', parent: 'single-phase-motors', title: 'Why a single-phase motor cannot start itself', level: 2,
  short: 'One winding on alternating current makes a field that pulses back and forth along one axis but never turns. It is the same as two half-size fields turning in opposite directions: at standstill they pull equally and the rotor only hums; once it turns, the field moving with it wins. So a single-phase motor needs a starting aid — and it keeps a 100 Hz torque ripple while running.',
  keywords: ['single-phase motor', 'pulsating field', 'double revolving field', 'forward field', 'backward field', 'no starting torque', 'hum', 'single phasing', 'phase loss', '2f torque ripple', 'starting winding'],
  prereq: ['rotating-field', 'slip-and-speed', 'torque-slip-curve'],
  related: ['split-phase-motor', 'capacitor-start-motor', 'psc-motor', 'shaded-pole-motor', 'steinmetz-connection', 'motor-protection', 'motor-vibration', 'physics:faradays-law', 'electronics:phasors-ac'],
  body: `
A three-phase motor gets a turning field for free: three windings 120° apart carrying currents 120° apart in time (see [[rotating-field]]). A house or a small workshop usually has only one phase. Put one winding on it and the field it makes lies along one axis: it grows to a maximum, falls to zero, grows the other way, fifty times a second at 50 Hz. It **pulses**; it does not **turn**.

### Two fields in one
A pulsating field can be split exactly into two fields of half the size, turning in opposite directions at the synchronous speed $n_s = 120f/p$ — 1500 rpm for a 4-pole motor at 50 Hz, 1800 rpm at 60 Hz. It is a [[?sine-cosine|trigonometric identity]]:

$$B\\cos\\theta\\cos\\omega t = \\tfrac{1}{2}B\\cos(\\theta - \\omega t) + \\tfrac{1}{2}B\\cos(\\theta + \\omega t)$$

The first term is a wave moving forwards, the second one moving backwards — two [[?rotating-arrow|rotating arrows]] whose sum always lies on the winding's axis. Each half acts on the cage rotor like the field of a three-phase motor, with its own [[slip-and-speed|slip]]: $s$ against the forward field and $2 - s$ against the backward one.

**At standstill** both slips are 1: the two halves pull equally and oppositely and the net torque is exactly zero. The rotor sits in the field like the secondary of a short-circuited transformer: it draws a large current, heats up and hums at twice the supply frequency — but it does not move.

**Once it turns** the balance tips. The forward field now has a small slip and behaves like the field of a normal induction motor. The backward field sweeps past the bars at almost twice the supply frequency ($(2-s)f$, about 98 Hz); at that frequency the rotor's leakage reactance dominates, its currents are nearly reactive, and they largely cancel the backward flux. Its torque shrinks. The motor runs up — in whichever direction it was pushed.

For the 0.75 kW, 230 V motor of the simulations, with its main winding alone:

| Speed | Slip, forward · backward | Forward torque | Backward torque | Net |
|---|---|---|---|---|
| 0 | 100 % · 100 % | 7.6 N·m | 7.6 N·m | 0 |
| 375 rpm | 75 % · 125 % | 9.7 N·m | 5.8 N·m | 3.9 N·m |
| 750 rpm | 50 % · 150 % | 12.1 N·m | 4.1 N·m | 8.1 N·m |
| 1125 rpm | 25 % · 175 % | 13.4 N·m | 2.0 N·m | 11.4 N·m |
| 1430 rpm (rated) | 4.7 % · 195 % | 5.4 N·m | 0.3 N·m | 5.1 N·m |

At rest it draws 25 A — nearly four times its 6.9 A running current — for no torque at all.

### What it means in practice
- **A starting aid is needed.** A second winding 90° away in space, carrying a current shifted in time, turns the pulsation into a rotating (elliptical) field: through extra resistance ([[split-phase-motor]]), a capacitor ([[capacitor-start-motor]], [[psc-motor]]) or copper shading rings ([[shaded-pole-motor]]). It also fixes the direction.
- **Single-phase motors vibrate more.** Even running, the backward field interacts with the forward one and makes a torque that pulses at $2f$ (100 Hz at 50 Hz). Fan and pump motors sit on rubber-cushioned (resilient) mounts for this reason; a run capacitor that makes the field nearly circular removes most of it.
- **They are less efficient and larger per kW.** The backward field adds rotor loss and reactive current. Single-phase induction motors are common up to about 2–3 kW and rare above about 7.5 kW; beyond that, three-phase — or a drive that makes three phases — wins.
- **A three-phase motor that loses a phase** (a blown fuse, a burnt contact) becomes a single-phase motor. Running, it carries on, but the remaining lines carry roughly $\\sqrt{3}$ times the current for the same output and the motor overheats; stopped, it cannot restart and hums at locked-rotor current. Overload relays with phase-loss sensitivity, motor-protection breakers and thermistors exist for this ([[motor-protection]]).

In the simulation, switch on at rest and watch the two half-arrows cancel; push the rotor and see the forward half win.

> [!warn] A single-phase motor that hums but does not turn is drawing locked-rotor current and heating quickly. Switch it off. Never spin a live motor by hand to "help it start": isolate it, lock it off, and find the fault (usually the start capacitor or switch).

> [!key] One winding makes a pulsating field — two equal fields turning opposite ways. At rest they cancel: no starting torque. Turning, the forward one wins. Every single-phase motor is a trick for making the field turn at the start.
`,
  ideas: [
    'A single winding on AC makes a field that pulses along one axis; it does not rotate.',
    'A pulsating field equals two half-size fields turning in opposite directions at synchronous speed.',
    'At standstill the two torques cancel exactly; the rotor hums and draws several times its running current.',
    'Once the rotor turns, the field moving with it has the smaller slip and the larger torque, so the motor runs in either direction.',
    'The backward field stays while running: extra loss, lower efficiency and a torque ripple at twice the supply frequency.'
  ],
  pitfalls: [
    'A single-phase motor that will not start has a burnt main winding — Usually the main winding is fine: the starting aid (capacitor, centrifugal switch, relay or auxiliary winding) has failed, so the motor hums without starting torque.',
    'A single-phase motor always runs in one direction — The main winding alone runs equally well either way; the direction is set only by the starting winding or shading rings at the start.',
    'A three-phase motor that loses a phase stops — A loaded running motor usually keeps turning on two lines, drawing much more current, and burns out unless its protection detects the phase loss.'
  ],
  derivation: {
    title: 'A pulsating field is two rotating fields',
    steps: [
      { text: 'One winding with current $i = I\\cos\\omega t$ makes a field around the air gap that varies as the cosine of the angle θ from the winding axis:', tex: 'B(\\theta, t) = B_m \\cos\\theta\\,\\cos\\omega t' },
      { text: 'Use the product-to-sum identity $\\cos A\\cos B = \\tfrac{1}{2}[\\cos(A-B) + \\cos(A+B)]$:', tex: 'B(\\theta, t) = \\tfrac{1}{2}B_m\\cos(\\theta - \\omega t) + \\tfrac{1}{2}B_m\\cos(\\theta + \\omega t)' },
      { text: 'The peak of the first term sits where θ = ωt: it moves forwards at angular speed ω. The peak of the second sits where θ = −ωt: it moves backwards. Each has half the amplitude.' },
      { text: 'A rotor turning forwards at a slip s against the forward field turns at speed (1 − s) of synchronous, so against the backward field its slip is', tex: 's_b = \\dfrac{n_s + n}{n_s} = 2 - s' }
    ]
  },
  formulas: [
    {
      name: 'Synchronous speed of the two fields',
      expr: 'ns = 120*f/p', tex: 'n_s = \\dfrac{120\\,f}{p}',
      vars: {
        ns: { name: 'synchronous speed', q: false, unit: 'rpm', tex: 'n_s' },
        f: { name: 'supply frequency', q: false, unit: 'Hz', value: 50 },
        p: { name: 'number of poles', int: true, value: 4 }
      },
      note: 'Both halves of the pulsating field turn at this speed, in opposite directions.',
      stories: { ns: 'A {p}-pole single-phase motor runs on {f}. At what speed do its forward and backward fields turn?', p: 'A single-phase fan motor runs at a little under {ns} on {f}. How many poles has it?' }
    },
    {
      name: 'Slip against the backward field',
      expr: 'sb = 2 - s', tex: 's_b = 2 - s',
      vars: {
        sb: { name: 'slip against the backward field', q: 'ratio', unit: '%', tex: 's_b' },
        s: { name: 'slip against the forward field', q: 'ratio', unit: '%', value: 4.7, min: 0, max: 200 }
      },
      stories: { sb: 'A single-phase motor runs with a slip of {s}. What is its slip against the backward field?' }
    },
    {
      name: 'Frequency of the rotor currents from the backward field',
      expr: 'fb = (2 - s)*f', tex: 'f_b = (2 - s)\\,f',
      vars: {
        fb: { name: 'rotor current frequency from the backward field', q: 'frequency', unit: 'Hz', tex: 'f_b' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 4.7, min: 0, max: 200 },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 }
      },
      note: 'At nearly twice the supply frequency the rotor looks inductive, so the backward field makes little torque once the motor runs.',
      stories: { fb: 'A 50 Hz single-phase motor runs at a slip of {s}. At what frequency do the backward field\'s currents flow in its rotor bars?' }
    },
    {
      name: 'Line current of a three-phase motor that has lost a phase',
      expr: 'I1 = sqrt(3)*I3', tex: 'I_{1} = \\sqrt{3}\\,I_{3}',
      vars: {
        I1: { name: 'line current running on two lines', q: 'current', unit: 'A', tex: 'I_{1}' },
        I3: { name: 'line current on three phases', q: 'current', unit: 'A', value: 15, tex: 'I_{3}' }
      },
      note: 'Same output, and (optimistically) the same efficiency and power factor: P = √3 V I₃ cos φ becomes V I₁ cos φ. In practice the rise is larger.',
      stories: { I1: 'A motor drawing {I3} per line loses one phase but keeps driving the same load. Roughly what current flows in the two remaining lines?' }
    }
  ],
  examples: [
    {
      title: 'Two slips and two rotor frequencies',
      q: 'A 4-pole, 50 Hz single-phase motor runs at 1430 rpm. Find its slip against each field and the frequency of the rotor currents each field induces.',
      steps: [
        '$n_s = 120 \\times 50/4 = 1500$ rpm.',
        'Forward: $s = (1500 - 1430)/1500 = 0.047$ (4.7 %); rotor frequency $0.047 \\times 50 = 2.3$ Hz.',
        'Backward: $s_b = 2 - 0.047 = 1.953$; rotor frequency $1.953 \\times 50 = 97.7$ Hz.',
        'At 97.7 Hz the rotor bars\' reactance is about 40 times larger than at 2.3 Hz, so the backward currents are mostly reactive and give little torque.'
      ],
      a: 'Slips 4.7 % and 195.3 %; rotor currents at 2.3 Hz and 97.7 Hz.'
    },
    {
      title: 'A pump motor loses a phase',
      q: 'A 7.5 kW, 400 V three-phase pump motor draws 15 A per line at full load. A fuse blows while it runs, and the pump keeps turning. Estimate the current in the two remaining lines.',
      steps: [
        'With the same output, efficiency and power factor, the power that three lines carried at $\\sqrt{3}\\,V I_3\\cos\\varphi$ now comes through one line pair at $V I_1 \\cos\\varphi$.',
        '$I_1 = \\sqrt{3} \\times 15 = 26$ A.',
        'In reality the backward field lowers the efficiency and power factor, so expect more — and the winding carrying the most current heats fastest. A thermal overload set to 15 A trips after some tens of seconds to a few minutes at this level; a relay with phase-loss sensitivity trips sooner.'
      ],
      a: 'At least about 26 A — some 1.7 times the normal current.'
    }
  ],
  quiz: [
    { q: 'A single-phase motor is switched on at rest with its starting capacitor disconnected. What happens?', choices: ['It hums, draws several times its running current, and does not turn', 'It starts slowly in the forward direction', 'It starts in a random direction', 'Nothing: no current flows until it turns'], a: 0, why: 'At standstill the forward and backward fields give equal and opposite torques. The winding is still connected, so it draws locked-rotor current and heats.' },
    { q: 'The same motor is given a push backwards while switched on. It will…', choices: ['run up to nearly full speed backwards', 'stop, because it is wound for the forward direction', 'oscillate around standstill', 'run forwards after a moment'], a: 0, why: 'With only the main winding, the torque curve is symmetrical: once the rotor turns either way, the field turning with it has the smaller slip and wins.' },
    { q: 'Why does the backward field give little torque once the motor is running?', choices: ['Its rotor currents flow at nearly twice the supply frequency, where the rotor is mostly reactive', 'It disappears as soon as the rotor turns', 'The main winding stops producing it', 'It is cancelled by the centrifugal switch'], a: 0, why: 'At slip 2 − s the rotor frequency is about 2f; the leakage reactance then dominates the rotor impedance, the backward rotor currents are nearly 90° out of phase, and they suppress the backward flux instead of making torque.' },
    { q: 'A running single-phase motor still has a backward field. What does it cause?', choices: ['A torque ripple at twice the supply frequency, extra losses and noise', 'Reverse rotation at light load', 'A DC component in the current', 'No effect at all at rated load'], a: 0, why: 'The forward and backward fields together make a torque that pulses at 2f (100 Hz at 50 Hz), and the backward rotor currents are pure loss.' },
    { q: 'True or false: a three-phase motor that loses one phase while running at full load will stop at once.', a: false, why: 'It usually keeps running as a single-phase motor, drawing roughly √3 times the current or more in the remaining lines, and overheats unless protected.' }
  ],
  problems: [
    { q: 'A 2-pole single-phase motor runs at 2880 rpm on 50 Hz. At what frequency do the backward field\'s currents flow in its rotor?', answer: 98, unit: 'Hz', tol: 0.01, steps: ['$n_s = 120 \\times 50/2 = 3000$ rpm; $s = 120/3000 = 0.04$.', '$f_b = (2 - 0.04) \\times 50 = 98$ Hz.'] },
    { q: 'A three-phase motor draws 8.2 A per line. It loses a phase but keeps its load. Estimate the new line current (same efficiency and power factor).', answer: 14.2, unit: 'A', tol: 0.02, steps: ['$I_1 = \\sqrt{3} \\times 8.2 = 14.2$ A.'] }
  ],
  choose: {
    good: [
      'Homes, farms and small shops with only a single-phase supply, for loads up to about 2–3 kW: fans, pumps, compressors, small machine tools.',
      'Constant-speed duty where a few per cent less efficiency and some 100 Hz hum are acceptable.'
    ],
    avoid: [
      'Loads above a few kW, or where low vibration matters: use three-phase, or a single-phase-input VFD with a three-phase motor (common up to about 2.2 kW at 230 V).',
      'Frequent starting and stopping: starting circuits (switches, electrolytic capacitors) have limited starts per hour.'
    ],
    check: [
      'That the motor has a starting method matched to the load\'s starting torque (see the comparison on [[capacitor-start-run]]).',
      'The supply\'s ability to deliver the starting current (often 4–8 × rated) without a large voltage dip.',
      'That three-phase motors have phase-loss protection, so a lost phase trips them instead of burning them.'
    ]
  },
  applications: [
    'Domestic appliances, garden pumps, air compressors and workshop machines on a single-phase supply.',
    'Diagnosing a "hummer": a motor that hums and turns freely by hand when isolated almost always has a failed starting circuit.',
    'Phase-loss protection of three-phase motors, which exists because a motor running on two lines behaves as a single-phase motor.'
  ],
  history: 'The idea of treating a pulsating field as two counter-rotating fields goes back to Galileo Ferraris, who described rotating magnetic fields in 1885–1888, and it became the standard way to analyse single-phase motors in the early twentieth century. Split-phase and capacitor motors spread with household electrification in the 1920s and 1930s.',
  sources: [
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: the chapter on single-phase induction motors and the double-revolving-field theory.',
    'Chapman, *Electric Machinery Fundamentals*: the chapter on single-phase and special-purpose motors (the double-revolving-field and cross-field theories, starting methods).',
    'Veinott, *Fractional and Subfractional Horsepower Electric Motors*: single-phase motor types, performance and testing.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*.'
  ],
  sim: 'sp-pulsating'
},

{
  id: 'split-phase-motor', parent: 'single-phase-motors', title: 'The split-phase motor', level: 2,
  short: 'A single-phase motor with a second, thin-wire auxiliary winding 90° away. Its higher resistance puts its current some 25–30° ahead of the main current, which gives an elliptical rotating field and a modest starting torque. A centrifugal switch cuts it out at about 75 % speed. Cheap, but with a high starting current.',
  keywords: ['split-phase motor', 'resistance-start', 'auxiliary winding', 'start winding', 'centrifugal switch', 'phase split', 'starting torque', 'starting current', 'T5 T8', 'Z1 Z2'],
  prereq: ['single-phase-problem', 'electronics:phasors-ac', 'torque-slip-curve'],
  related: ['capacitor-start-motor', 'capacitor-start-run', 'capacitor-sizing', 'motor-protection', 'motors-pumps-fans', 'electronics:impedance'],
  body: `
The simplest cure for a single-phase motor's lack of starting torque is a second winding. The **auxiliary** (start) winding sits in the stator 90° electrical from the **main** (run) winding. If its current were in step with the main current, the two would just make one bigger pulsating field. The trick is to make the two currents reach their peaks at different times — to **split the phase**.

### Splitting the phase with resistance
The main winding is wound with many turns of thick wire: low resistance, high reactance, so at standstill its current lags the voltage by about 40–45°. The auxiliary winding has fewer turns of thin wire: high resistance, low reactance, so its current lags by only 15–20°. The [[?phase|phase]] difference between the two currents — the **phase split** α — is about 25–30°. The angle of each branch is its [[?inverse-trig|arctangent]] of X/R:

$$\\alpha = \\arctan\\frac{X_m}{R_m} - \\arctan\\frac{X_a}{R_a}$$

Two windings in quadrature with currents α apart make an elliptical rotating field, and the starting torque is proportional to the product of the currents and $\\sin\\alpha$:

$$T_{st} = k\\,I_m I_a \\sin\\alpha$$

With α near 25°, $\\sin\\alpha$ is only about 0.43: the currents must be large to give torque. That is the split-phase motor's weakness — plenty of amperes, modest torque.

For the 0.75 kW motor of the simulations with a resistance-split winding: $I_m$ = 25.4 A lagging 42°, $I_a$ = 22.4 A lagging 16.5°, α = 25.6°, a starting torque of 8.2 N·m (about 1.6 × rated) — and a line current of 46.8 A, nearly seven times the running current. Real split-phase motors fall in the ranges below.

| Property | Typical split-phase motor |
|---|---|
| Output | 40–370 W (1/20–1/2 hp); rarely larger |
| Speeds (4-pole / 2-pole) | 1420–1440 / 2850–2880 rpm at 50 Hz; 1725 / 3450 rpm at 60 Hz |
| Starting torque | 100–175 % of rated |
| Starting current | 6–9 × rated |
| Breakdown torque | about 180–250 % of rated |
| Efficiency, power factor | about 55–70 %; 0.55–0.7 (main winding alone at full load) |
| Uses | clothes-dryer drums, oil burners, small fans and blowers, bench grinders, small pumps, older washing machines |

### The centrifugal switch
The auxiliary winding's thin wire runs at a high current density; it is rated for seconds, not minutes. A **centrifugal switch** on the shaft — flyweights that push a collar against a spring — opens its contacts at about 70–80 % of synchronous speed (about 1100–1200 rpm on a 4-pole 50 Hz motor), and the motor runs on its main winding alone. It recloses when the motor slows to roughly 40–60 % of speed. The switch must open: in the simulation, a split-phase winding left in circuit at full speed actually brakes the motor, because its current then lags the main current and drives the backward field.

### Wiring and reversing
| Terminal marking | IEC 60034-8 | NEMA (US) |
|---|---|---|
| Main winding | U1–U2 | T1–T4 (two halves T1–T2, T3–T4 on dual-voltage motors) |
| Auxiliary winding | Z1–Z2 | T5–T8 |

The direction is set by which way the auxiliary current's field leads the main one. **To reverse, swap the two ends of the auxiliary winding** (Z1 with Z2, or T5 with T8) — with the motor stopped: a running motor on its main winding alone ignores the swap until it has slowed below the switch's reclosing speed. Swapping the supply leads reverses both windings at once and changes nothing. The motor's own terminal diagram governs.

### What goes wrong
| Symptom | Likely cause | Check |
|---|---|---|
| Hums, will not start; spins freely by hand when isolated | switch contacts dirty or open, auxiliary winding open | continuity of the auxiliary circuit at rest |
| Starts, then trips or smells hot | switch not opening (welded contacts, broken spring, worn flyweights) — auxiliary winding cooking | listen for the click at run-up; auxiliary winding resistance |
| Slow to accelerate, clicks repeatedly | overload or low voltage near the switch speed: the switch opens, speed drops, it recloses | voltage at the terminals during start; load |
| Burnt auxiliary winding | too many starts per hour, long run-up with a heavy load | duty; consider a capacitor-start motor |

> [!warn] Test windings and switches only with the supply isolated, locked off and proven dead. Many small motors have an automatic-reset thermal protector: an "unexpected restart" after it cools is a real hazard on tools and machines.

> [!tip] Hearing the centrifugal switch click a second or two after start (and again as the motor runs down) is the quickest check that it works.

> [!key] A split-phase motor makes a small phase shift with resistance: cheap and simple, but its starting torque costs a lot of current, and its thin start winding must be switched out within seconds.
`,
  ideas: [
    'The auxiliary winding has a higher R/X ratio than the main winding, so its current lags less: a phase split of about 25–30°.',
    'Starting torque is proportional to Im · Ia · sin α; with a small α it takes large currents.',
    'A centrifugal switch opens at about 70–80 % of synchronous speed; the auxiliary winding is rated for seconds only.',
    'Reverse by swapping the ends of the auxiliary winding, with the motor stopped.',
    'Split-phase motors suit small, easy-to-start loads; their starting current is 6–9 times rated.'
  ],
  pitfalls: [
    'Leaving the start winding connected would make the motor stronger — The thin winding overheats within seconds, and at speed a resistance-split winding actually opposes the motor.',
    'Swapping L and N reverses a single-phase motor — It reverses the current in both windings at once, so their relative phase and the direction stay the same; swap the auxiliary winding\'s ends instead.',
    'A bigger split-phase motor is the answer to a load that will not start — A capacitor-start motor of the same size gives about twice the starting torque at about half the starting current.'
  ],
  formulas: [
    {
      name: 'Phase split between the two windings',
      expr: 'alpha = atan(Xm/Rm) - atan(Xa/Ra)', tex: '\\alpha = \\arctan\\dfrac{X_m}{R_m} - \\arctan\\dfrac{X_a}{R_a}',
      vars: {
        alpha: { name: 'phase split (auxiliary current ahead of main)', q: 'angle', unit: '°', tex: '\\alpha', signed: true },
        Xm: { name: 'reactance of the main winding at standstill', q: 'resistance', unit: 'Ω', value: 6.1, tex: 'X_m' },
        Rm: { name: 'resistance of the main winding at standstill', q: 'resistance', unit: 'Ω', value: 6.7, tex: 'R_m' },
        Xa: { name: 'reactance of the auxiliary winding at standstill', q: 'resistance', unit: 'Ω', value: 2.9, tex: 'X_a' },
        Ra: { name: 'resistance of the auxiliary winding at standstill', q: 'resistance', unit: 'Ω', value: 9.8, tex: 'R_a' }
      },
      note: 'Standstill (locked-rotor) values of each winding branch, including the rotor as seen from that winding.',
      stories: { alpha: 'At standstill the main winding branch measures {Rm} + j{Xm} and the auxiliary branch {Ra} + j{Xa}. What is the phase split?', Ra: 'The main branch is {Rm} + j{Xm}; the auxiliary winding has a reactance of {Xa}. What resistance gives a split of {alpha}?' }
    },
    {
      name: 'Starting torque of two windings in quadrature',
      expr: 'T = k*Im*Ia*sin(alpha)', tex: 'T_{st} = k\\,I_m I_a \\sin\\alpha',
      vars: {
        T: { name: 'starting torque', q: 'torque', unit: 'N·m', tex: 'T_{st}' },
        k: { name: 'starting-torque coefficient of the motor', unit: 'N·m/A²', value: 0.0332 },
        Im: { name: 'main-winding current at standstill', q: 'current', unit: 'A', value: 25.4, tex: 'I_m' },
        Ia: { name: 'auxiliary-winding current at standstill', q: 'current', unit: 'A', value: 22.4, tex: 'I_a' },
        alpha: { name: 'phase split', q: 'angle', unit: '°', value: 25.6, min: 0, max: 180, tex: '\\alpha' }
      },
      note: 'k grows with the turns ratio of the auxiliary winding and the rotor resistance; for a given motor it is a constant.',
      stories: { T: 'At standstill the main winding draws {Im}, the auxiliary {Ia}, {alpha} apart; k = {k}. What is the starting torque?', alpha: 'With currents {Im} and {Ia} and k = {k}, what phase split gives a starting torque of {T}?' }
    },
    {
      name: 'Line current at start',
      expr: 'I = sqrt(Im^2 + Ia^2 + 2*Im*Ia*cos(alpha))', tex: 'I = \\sqrt{I_m^2 + I_a^2 + 2 I_m I_a \\cos\\alpha}',
      vars: {
        I: { name: 'line current', q: 'current', unit: 'A' },
        Im: { name: 'main-winding current', q: 'current', unit: 'A', value: 25.4, tex: 'I_m' },
        Ia: { name: 'auxiliary-winding current', q: 'current', unit: 'A', value: 22.4, tex: 'I_a' },
        alpha: { name: 'phase split', q: 'angle', unit: '°', value: 25.6, min: 0, max: 180, tex: '\\alpha' }
      },
      note: 'The two currents add as phasors; with a small split they add almost arithmetically.',
      stories: { I: 'A split-phase motor starts with {Im} in the main winding and {Ia} in the auxiliary, {alpha} apart. What current does the supply see?' }
    }
  ],
  examples: [
    {
      title: 'The phase split and starting torque of a split-phase motor',
      q: 'At standstill the main winding branch of a 0.75 kW motor is 6.7 + j6.1 Ω and its resistance-split auxiliary branch 9.8 + j2.9 Ω, on 230 V. Find the currents, the phase split, the starting torque (k = 0.0332 N·m/A²) and the line current.',
      steps: [
        '$|Z_m| = \\sqrt{6.7^2 + 6.1^2} = 9.06$ Ω, so $I_m = 230/9.06 = 25.4$ A, lagging $\\arctan(6.1/6.7) = 42.3°$.',
        '$|Z_a| = \\sqrt{9.8^2 + 2.9^2} = 10.2$ Ω, so $I_a = 22.5$ A, lagging $\\arctan(2.9/9.8) = 16.5°$.',
        '$\\alpha = 42.3 - 16.5 = 25.8°$.',
        '$T_{st} = 0.0332 \\times 25.4 \\times 22.5 \\times \\sin 25.8° = 8.2$ N·m — about 1.6 times the 5.2 N·m rated torque.',
        '$I = \\sqrt{25.4^2 + 22.5^2 + 2 \\times 25.4 \\times 22.5 \\cos 25.8°} = 46.7$ A.'
      ],
      a: 'α ≈ 26°, starting torque ≈ 8.2 N·m (1.6 × rated) at a line current of about 47 A.'
    },
    {
      title: 'What the same currents could do at 90°',
      q: 'If the same 25.4 A and 22.5 A were 90° apart instead of 25.8°, how much starting torque would the motor give?',
      steps: [
        '$\\sin 90° = 1$ against $\\sin 25.8° = 0.435$: the torque would rise by $1/0.435 = 2.3$ times.',
        '$0.0332 \\times 25.4 \\times 22.5 = 19$ N·m.',
        'A capacitor can bring the auxiliary current ahead of the voltage and the split near 90° — the idea of the [[capacitor-start-motor]].'
      ],
      a: 'About 19 N·m, 2.3 times as much: the phase split, not the current, is what the split-phase motor lacks.'
    }
  ],
  quiz: [
    { q: 'Why is the auxiliary winding of a split-phase motor wound with thin wire?', choices: ['To give it a high resistance-to-reactance ratio, so its current lags less than the main current', 'To save copper, since it carries little current', 'To make it run cooler', 'To raise its voltage rating'], a: 0, why: 'The higher R/X makes the auxiliary current lag the voltage by less than the main current does — that difference is the phase split.' },
    { q: 'A split-phase motor starts, but after a minute smells hot and trips. The most likely cause is…', choices: ['the centrifugal switch is not opening, so the start winding stays in circuit', 'the main winding is open', 'the rotor bars are broken', 'the supply frequency is too low'], a: 0, why: 'The start winding is rated for seconds; if the switch contacts weld or the mechanism sticks, it overheats within a minute and the protector trips.' },
    { q: 'How do you reverse a split-phase motor?', choices: ['Swap the two ends of the auxiliary winding, with the motor stopped', 'Swap L and N at the supply', 'Swap the main winding\'s ends while it runs', 'It cannot be reversed'], a: 0, why: 'Direction comes from the relative phase of the two windings; reversing one of them reverses the field. Swapping the supply reverses both and changes nothing.' },
    { q: 'With currents of 20 A and 18 A at a split of 30°, a motor gives 6 N·m at start. If a capacitor raised the split to 90° with the same currents, the torque would be about…', choices: ['12 N·m', '6 N·m', '18 N·m', '3 N·m'], a: 0, why: 'Torque ∝ sin α: sin 90°/sin 30° = 2, so 12 N·m.' },
    { q: 'True or false: a split-phase motor has a lower starting current than a capacitor-start motor of the same size.', a: false, why: 'The opposite: the split-phase motor needs large currents (6–9 × rated) because its small phase split makes each ampere less effective.' }
  ],
  problems: [
    { q: 'At standstill a main winding branch is 5 + j6 Ω and the auxiliary branch 10 + j3 Ω. What is the phase split?', answer: 33.5, unit: '°', tol: 0.02, steps: ['$\\arctan(6/5) = 50.2°$, $\\arctan(3/10) = 16.7°$.', '$\\alpha = 50.2 - 16.7 = 33.5°$.'] },
    { q: 'A 4-pole, 60 Hz split-phase motor\'s switch opens at 75 % of synchronous speed. At what speed is that?', answer: 1350, unit: 'rpm', tol: 0.01, steps: ['$n_s = 120 \\times 60/4 = 1800$ rpm.', '$0.75 \\times 1800 = 1350$ rpm.'] }
  ],
  choose: {
    good: [
      'Small, easy-starting loads under about 0.37 kW that start a few times an hour: fans, blowers, dryer drums, oil burners, grinders.',
      'The lowest cost: no capacitor at all.'
    ],
    avoid: [
      'Hard-starting loads (compressors against pressure, loaded conveyors, pumps against a head): the starting torque is modest — use a capacitor-start motor.',
      'Weak supplies and long cables: 6–9 × rated starting current dims lights and may fail to start the motor.',
      'Frequent starts: the thin start winding heats with every start.'
    ],
    check: [
      'The load\'s breakaway torque against the motor\'s starting torque (100–175 % of rated).',
      'The supply\'s voltage dip at 6–9 × rated current.',
      'The allowed starts per hour (from the maker) and a working centrifugal switch.'
    ]
  },
  applications: [
    'Tumble-dryer drum motors and oil-burner motors, where the load starts easily.',
    'Bench grinders and small blowers built for the lowest cost.',
    'Replacing a failed split-phase motor on a heavier load with a capacitor-start motor of the same frame.'
  ],
  history: 'Nikola Tesla\'s early AC motor patents (1888) already used windings with different phase angles to make a turning field from a single supply. The resistance split with a centrifugal switch became a standard fractional-horsepower design in the early twentieth century, when household appliances first needed small motors.',
  sources: [
    'Veinott, *Fractional and Subfractional Horsepower Electric Motors*: split-phase motors, centrifugal switches and starting performance.',
    'Chapman, *Electric Machinery Fundamentals*: the chapter on single-phase motors — split-phase windings and their phasor diagrams.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation* (U1–U2 main, Z1–Z2 auxiliary windings).',
    'NEMA MG 1, *Motors and Generators*: definitions and performance of general-purpose single-phase motors.'
  ],
  sim: [{ id: 'sp-lab', params: { type: 'split' } }, { id: 'sp-phasors', params: { mode: 'split' } }]
},

{
  id: 'capacitor-start-motor', parent: 'single-phase-motors', title: 'The capacitor-start motor', level: 2,
  short: 'A capacitor in series with the auxiliary winding makes its current lead the voltage, so the two winding currents are nearly 90° apart at standstill. The result is two to three times rated starting torque at a moderate current. An electrolytic start capacitor, rated for a few seconds per start, is switched out by a centrifugal switch or a relay.',
  keywords: ['capacitor-start motor', 'CSIR', 'start capacitor', 'electrolytic capacitor', 'centrifugal switch', 'current relay', 'potential relay', 'PTC starter', 'bleeder resistor', 'starting torque', 'dual voltage', 'reversing', 'T5 T8', 'U1 U2 Z1 Z2'],
  prereq: ['split-phase-motor', 'single-phase-problem', 'electronics:capacitors'],
  related: ['capacitor-start-run', 'capacitor-sizing', 'psc-motor', 'motor-protection', 'motors-conveyors-hoists', 'electronics:impedance', 'physics:reactance'],
  body: `
The [[split-phase-motor]] fails because resistance can shift the auxiliary current only a little. A capacitor can shift it a lot. In series with the auxiliary winding, its negative reactance $-1/(2\\pi fC)$ outweighs the winding's inductive reactance, so the auxiliary current **leads** the voltage while the main current lags it. The phase split α approaches 90°, the field becomes nearly circular at standstill, and — since starting torque goes as $I_m I_a \\sin\\alpha$ — each ampere now works almost fully.

### What it gives
For the 0.75 kW motor of the simulations with a 120 µF start capacitor: main current 25.4 A lagging 42°, auxiliary current 11.1 A leading 61.5°, α = 104°, a starting torque of 15.6 N·m (**3.0 × rated**) at a line current of 25.4 A (**3.7 × rated**), and 295 V across the capacitor. Its split-phase brother gave 1.6 × rated torque at 47 A. The leading auxiliary current also cancels much of the main winding's lagging current, which is why the line current is hardly larger than the main current alone.

| Property | Typical capacitor-start motor |
|---|---|
| Output | 0.12–2.2 kW (1/6–3 hp); up to about 3.7 kW (5 hp) in farm-duty designs |
| Starting torque | 200–350 % of rated (250–300 % is common) |
| Starting current | about 3.5–6 × rated |
| Running (main winding alone) | efficiency about 60–72 %, power factor 0.6–0.75, 100 Hz hum like any single-phase motor |
| Start capacitor | AC electrolytic, roughly 100–250 µF per kW at 230 V (four times that at 115 V) |
| Uses | compressors, pumps, conveyors, farm machinery, table saws and other workshop machines |

### The start capacitor
Start capacitors are **non-polarised AC electrolytic** capacitors (two anodes back to back): a lot of µF in a small, cheap can — but lossy, so they may be in circuit only briefly. Typical ratings are "intermittent duty", often stated as a few seconds per start and about 20 starts an hour; voltage ratings are 110–125 V or 165 V for 115 V motors and 250 V or 330 V for 230 V motors. The value is printed as a range (for example 124–149 µF) because their tolerance is wide. A **bleeder resistor** (commonly about 15–20 kΩ, 2 W) across the terminals drains the charge after each start, protecting relay contacts from a charged capacitor being reconnected. See [[capacitor-sizing]] for values and failures.

### What takes the capacitor out
| Device | Senses | How it acts | Where |
|---|---|---|---|
| Centrifugal switch | shaft speed | flyweights open the contacts at about 70–80 % speed | open motors: pumps, compressors, machines |
| Current relay | main-winding current | its coil in series with the main winding pulls a normally open contact closed on the large starting current and drops out as the current falls with speed | small hermetic compressors (refrigeration) |
| Potential (voltage) relay | voltage across the auxiliary winding | a normally closed contact opens when the voltage induced in the auxiliary winding rises with speed, well above the line voltage | larger hermetic compressors (air conditioning), "hard-start kits" |
| PTC starter | its own temperature | a ceramic PTC thermistor in the auxiliary circuit heats in under a second and becomes a high resistance; it needs minutes to cool before a restart | household refrigerators |
| Electronic start switch | time, current or speed | a triac switches the capacitor for a set time or until the current drops | replacements for worn centrifugal switches |

Hermetic compressors cannot use a centrifugal switch — nothing mechanical may spark inside the refrigerant — so they use relays outside the shell.

### Wiring, dual voltage and reversing
A common arrangement for a dual-voltage 115/230 V motor has the main winding in two halves (T1–T2 and T3–T4), connected in parallel for 115 V and in series for 230 V, with the auxiliary circuit (T5–T8, including capacitor and switch) across one half, so that it always sees about 115 V. On IEC motors the main winding is U1–U2 and the auxiliary Z1–Z2. **To reverse, swap the ends of the auxiliary circuit** — T5 with T8, or Z1 with Z2 — with the motor stopped. Reversing switches for single-phase motors do exactly this; the motor must come almost to rest (below the switch's reclosing speed) before it will start the other way. The nameplate and terminal-box diagram govern — follow them, not a generic table.

In the simulations, compare the capacitor-start and split-phase motors on the same load, and watch the start switch or relay act.

> [!warn] A start capacitor can hold a dangerous charge after a start, especially if its bleeder resistor is missing or open. Isolate and lock off the motor, then discharge the capacitor through a resistor and check with a meter before touching it. A failing electrolytic can vent or burst: keep its cover on.

> [!tip] A capacitor-start motor that hums and will not start, but runs when given a push (with care, isolated first — or by checking the parts), almost always has an open start capacitor, a switch or relay that no longer closes, or an open auxiliary winding.

> [!key] A capacitor turns the auxiliary current ahead of the voltage, bringing the split near 90°: about three times rated starting torque at a moderate current. The electrolytic start capacitor is for seconds only — a switch or relay must take it out.
`,
  ideas: [
    'A capacitor in series with the auxiliary winding makes its current lead, bringing the phase split close to 90°.',
    'Starting torque of 200–350 % of rated at 3.5–6 × rated current — about twice the torque of a split-phase motor at half the current.',
    'The start capacitor is an AC electrolytic, rated for a few seconds per start and a limited number of starts per hour.',
    'Centrifugal switches, current relays, potential relays, PTC thermistors or electronic switches remove it as the motor comes up to speed.',
    'Reverse by swapping the auxiliary circuit\'s ends at standstill; the motor then runs on its main winding alone.'
  ],
  pitfalls: [
    'A bigger start capacitor always gives more starting torque — Beyond the design value the auxiliary current and the capacitor voltage grow while the phase split shrinks; the winding and capacitor overheat and the torque gain is small.',
    'A start capacitor can replace a failed run capacitor of the same µF — An electrolytic start capacitor left in circuit continuously overheats and bursts within minutes; run capacitors must be film types rated for continuous duty.',
    'The start capacitor improves the running power factor — It is out of circuit once the motor runs; the running motor is a plain single-phase motor with a power factor of about 0.6–0.75 (a run capacitor is what improves it).'
  ],
  formulas: [
    {
      name: 'Angle of the auxiliary current with a series capacitor',
      expr: 'theta = atan((1/(2*pi*f*C) - Xa)/Ra)', tex: '\\theta_a = \\arctan\\dfrac{\\dfrac{1}{2\\pi f C} - X_a}{R_a}',
      vars: {
        theta: { name: 'lead of the auxiliary current on the voltage', q: 'angle', unit: '°', tex: '\\theta_a', signed: true, min: -90, max: 90 },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'start capacitance', q: 'capacitance', unit: 'µF', value: 120 },
        Xa: { name: 'reactance of the auxiliary branch at standstill', q: 'resistance', unit: 'Ω', value: 8.35, tex: 'X_a' },
        Ra: { name: 'resistance of the auxiliary branch at standstill', q: 'resistance', unit: 'Ω', value: 9.86, tex: 'R_a' }
      },
      note: 'The phase split is α = θa + φm, with φm the lag of the main current (about 40–45° at standstill). For α = 90° choose θa = 90° − φm.',
      stories: { theta: 'An auxiliary branch of {Ra} + j{Xa} has {C} in series at {f}. By how much does its current lead the voltage?', C: 'An auxiliary branch of {Ra} + j{Xa} at {f}: what start capacitor makes its current lead by {theta}?' }
    },
    {
      name: 'Run-up time with the start capacitor in',
      expr: 't = J*w/(T - TL)', tex: 't = \\dfrac{J\\,\\omega}{T - T_L}',
      vars: {
        t: { name: 'time to reach the switch speed', q: 'time', unit: 's' },
        J: { name: 'inertia of rotor and load', q: 'inertia', unit: 'kg·m²', value: 0.03 },
        w: { name: 'speed at which the switch opens', q: 'angvel', unit: 'rpm', value: 1125, tex: '\\omega' },
        T: { name: 'average motor torque during run-up', q: 'torque', unit: 'N·m', value: 21.4 },
        TL: { name: 'load torque (plus friction)', q: 'torque', unit: 'N·m', value: 5.4, tex: 'T_L' }
      },
      note: 'A constant accelerating torque; use the average of the motor\'s start curve. Compare the result with the capacitor\'s rating of a few seconds.',
      stories: { t: 'A capacitor-start motor averages {T} of torque while starting a load of {TL} with a total inertia of {J}. How long is the start capacitor in circuit before the switch opens at {w}?', J: 'How much inertia can a motor averaging {T} against {TL} bring to {w} in {t}?' }
    },
    {
      name: 'Duty of a start capacitor',
      expr: 'D = N*ts/3600', tex: 'D = \\dfrac{N\\,t_s}{3600}',
      vars: {
        D: { name: 'fraction of time the capacitor is energised', q: 'ratio', unit: '%' },
        N: { name: 'starts per hour', q: false, unit: 'starts/h', value: 20 },
        ts: { name: 'time in circuit per start', q: false, unit: 's', value: 3, tex: 't_s' }
      },
      note: 'Start capacitors are built for a few per cent of duty; long run-ups and frequent starts overheat them.',
      stories: { D: 'A compressor starts {N} and its start capacitor stays in for {ts} each time. For what fraction of the time is the capacitor energised?', N: 'A start capacitor may be energised for {D} of the time. With {ts} per start, how many starts an hour is that?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the start capacitor for a 90° split',
      q: 'At standstill a motor\'s main current lags the 230 V, 50 Hz supply by 42°. Its auxiliary branch is 9.86 + j8.35 Ω. What capacitance puts the auxiliary current exactly 90° ahead of the main current, and what does the design value of 120 µF give?',
      steps: [
        'For α = 90° the auxiliary current must lead the voltage by $90 - 42 = 48°$.',
        'Then $X_C - X_a = R_a \\tan 48° = 9.86 \\times 1.111 = 10.95$ Ω, so $X_C = 19.3$ Ω.',
        '$C = 1/(2\\pi \\times 50 \\times 19.3) = 165$ µF.',
        'With 120 µF: $X_C = 26.5$ Ω, $\\theta_a = \\arctan((26.5 - 8.35)/9.86) = 61.5°$, α = 103.5° — past 90°, with a smaller auxiliary current (and a lower line current) than 165 µF would draw. Designers trade a little torque per ampere for current and capacitor size.'
      ],
      a: 'About 165 µF for a 90° split; 120 µF gives α ≈ 104°, still close to the best torque per ampere.'
    },
    {
      title: 'How long is the capacitor in?',
      q: 'The 0.75 kW capacitor-start motor averages 21.4 N·m from rest to its 1125 rpm switch speed, against a 5.2 N·m load plus 0.2 N·m friction, with rotor and flywheel totalling 0.03 kg·m². How long is the start capacitor energised? With 20 starts an hour, what is its duty?',
      steps: [
        '$\\omega = 1125 \\times 2\\pi/60 = 117.8$ rad/s.',
        '$t = 0.03 \\times 117.8/(21.4 - 5.4) = 0.22$ s.',
        'Duty: $20 \\times 0.22/3600 = 0.12$ %. Comfortably inside a rating of a few seconds per start.'
      ],
      a: 'About 0.22 s per start; 0.12 % duty at 20 starts an hour.'
    }
  ],
  quiz: [
    { q: 'Why does a capacitor-start motor draw less starting current than a split-phase motor for more torque?', choices: ['Its phase split is near 90°, so every ampere makes torque, and the leading auxiliary current cancels much of the main winding\'s lagging current', 'The capacitor stores energy for the start', 'It has a higher voltage rating', 'Its rotor has more bars'], a: 0, why: 'Torque goes as Im·Ia·sin α; with α near 90° less current is needed, and the leading and lagging currents partly cancel in the line.' },
    { q: 'A refrigerator compressor starts through a current relay. What makes the relay open the start circuit?', choices: ['The main-winding current falls as the motor speeds up, so the relay coil drops out', 'A centrifugal switch inside the compressor', 'The voltage across the start winding falls', 'A timer after exactly 3 s'], a: 0, why: 'The current relay\'s coil is in series with the main winding: the locked-rotor current pulls it in, and the falling running current lets it drop out.' },
    { q: 'An electrolytic start capacitor was fitted as a run capacitor. What will happen?', choices: ['It overheats and may vent or burst within minutes', 'The motor will run more efficiently', 'Nothing: µF is µF', 'The motor will run backwards'], a: 0, why: 'Electrolytic start capacitors have high losses and are rated for seconds of duty; continuous current destroys them.' },
    { q: 'A capacitor-start motor is reversed by…', choices: ['swapping the ends of the auxiliary circuit with the motor at rest', 'swapping L and N', 'using a larger capacitor', 'swapping the capacitor\'s terminals'], a: 0, why: 'Reversing the auxiliary winding relative to the main one reverses the field. A non-polarised capacitor has no preferred direction, and swapping the supply reverses both windings.' },
    { q: 'True or false: on a potential-relay start circuit the relay contacts are normally closed and open when the voltage across the start winding rises.', a: true, why: 'As the motor accelerates, the voltage induced in the auxiliary winding rises well above the line voltage; the relay coil across it then pulls its normally closed contacts open.' }
  ],
  problems: [
    { q: 'An auxiliary branch of 10 + j8 Ω at 50 Hz is to have its current lead the voltage by 50°. What start capacitance does it need?', answer: 160, unit: 'µF', tol: 0.02, steps: ['$X_C = X_a + R_a \\tan 50° = 8 + 10 \\times 1.192 = 19.9$ Ω.', '$C = 1/(2\\pi \\times 50 \\times 19.9) = 160$ µF.'] },
    { q: 'A motor with rotor and load inertia 0.12 kg·m² averages 18 N·m against a 6 N·m load while starting. How long until its switch opens at 1350 rpm?', answer: 1.41, unit: 's', tol: 0.02, steps: ['$\\omega = 1350 \\times 2\\pi/60 = 141.4$ rad/s.', '$t = 0.12 \\times 141.4/(18 - 6) = 1.41$ s.'] }
  ],
  choose: {
    good: [
      'Hard-starting single-phase loads: reciprocating compressors, loaded conveyors, pumps against a head, mixers, woodworking machines.',
      'Supplies that cannot take the 6–9 × current of a split-phase start.',
      'Up to about 2.2 kW where a three-phase supply is not available.'
    ],
    avoid: [
      'Frequent starting (more than about 20 starts an hour) or very high inertia: the start capacitor and auxiliary winding overheat.',
      'Long running hours where efficiency matters: a capacitor-start-run motor saves about 10–15 % of the input power.',
      'Quiet applications: running on the main winding alone it keeps the 100 Hz hum of a single-phase motor.'
    ],
    check: [
      'Starting torque against the load\'s breakaway torque, and the run-up time against the capacitor\'s rating.',
      'The start switch type: a centrifugal switch for open motors, a relay for hermetic compressors.',
      'Starts per hour, and the replacement capacitor\'s µF range and voltage rating (same or higher).'
    ]
  },
  applications: [
    'Single-phase air compressors, borehole and booster pumps, and workshop machines up to about 2.2 kW.',
    'Hermetic refrigeration compressors started by a current relay or a PTC thermistor.',
    'Air-conditioning compressors given a "hard-start kit" — a start capacitor with a potential relay — to start against pressure.'
  ],
  history: 'Practical capacitor motors had to wait for compact, cheap capacitors; the AC electrolytic start capacitor, developed around 1930, made the capacitor-start motor the standard answer for hard-starting single-phase loads such as the domestic refrigerator compressor.',
  sources: [
    'Veinott, *Fractional and Subfractional Horsepower Electric Motors*: capacitor-start motors, starting switches and relays.',
    'IEC 60252-2, *AC motor capacitors — Part 2: Motor start capacitors*.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation*.',
    'NEMA MG 1, *Motors and Generators*: single-phase motor classifications, terminal markings and connections.'
  ],
  sim: [{ id: 'sp-lab', params: { type: 'cs' } }, { id: 'sp-wiring', params: { type: 'cs', relay: 'centrifugal' } }, { id: 'sp-phasors', params: { mode: 'cap' } }]
},

{
  id: 'capacitor-start-run', parent: 'single-phase-motors', title: 'Capacitor-start, capacitor-run motors', level: 2,
  short: 'Two capacitors: a large electrolytic one for starting, switched out at speed, and a small film run capacitor that stays in with an auxiliary winding built for continuous duty. It starts like a capacitor-start motor and runs with a nearly circular field — power factor above 0.9, several points more efficiency, less current and less hum.',
  keywords: ['capacitor-start capacitor-run', 'CSCR', 'CSR', 'two-value capacitor motor', 'run capacitor', 'start capacitor', 'power factor', 'efficiency', 'hard-start kit', 'dual run capacitor', 'C HERM FAN'],
  prereq: ['capacitor-start-motor', 'power-factor', 'efficiency-losses'],
  related: ['psc-motor', 'capacitor-sizing', 'split-phase-motor', 'shaded-pole-motor', 'motor-life-cost', 'motors-pumps-fans', 'electronics:power-factor-correction'],
  body: `
A [[capacitor-start-motor]] starts well but then runs as a plain single-phase motor, with its backward field, its 100 Hz hum and a power factor around 0.7. Keep a second, smaller capacitor in the auxiliary circuit permanently and give the auxiliary winding enough copper to carry current all the time, and the motor becomes a **two-phase motor while running**. That is the **capacitor-start, capacitor-run** (CSCR, or CSR in air-conditioning) motor, also called a two-value capacitor motor.

### Two capacitors, two jobs
- The **start capacitor** (electrolytic, large — typically 3–6 times the run value) sits in parallel with the run capacitor during the start. Together they give the large leading auxiliary current that starting needs.
- At about 75 % speed a centrifugal switch or a potential relay removes it. The **run capacitor** (metallised polypropylene film, rated for continuous duty) stays. Its value is chosen so that at the rated load the auxiliary current is about 90° ahead of the main current and of the right size: the forward field is then nearly pure and the backward field nearly gone.

For the 0.75 kW motor of the simulations (auxiliary turns ratio $a$ = 1.4, 100 µF start + 20 µF run):

| At rated load, 750 W | Capacitor-start (main winding alone) | Capacitor-start-run |
|---|---|---|
| Speed | 1428 rpm | 1449 rpm |
| Line current | 6.9 A | 4.3 A |
| Power factor | 0.70 | 0.96 |
| Efficiency | 68 % | 80 % |
| Backward field / forward field | 1 (pulsating) | 0.05 |
| 100 Hz torque ripple | about ±4 N·m | about ±0.25 N·m |
| Breakdown torque | 2.2 × rated | 2.8 × rated |
| Starting torque, current | 3.0 ×, 25 A | 3.6 ×, 28 A |

### The run capacitor sees more than the line voltage
In the balanced condition the auxiliary winding, with $a$ times the turns of the main one, carries an induced voltage $a$ times as large and 90° ahead. The capacitor holds the difference between that and the supply:

$$V_C = V\\sqrt{1 + a^2}$$

With $a$ = 1.4 on 230 V that is about 395 V — which is why run capacitors on 230 V motors are rated 400–450 V AC, and those on US 230 V equipment 370 or 440 V. Replace one only with the same µF and the same or a higher voltage rating.

### The motor types side by side
| Type | Starting torque | Starting current | Full-load power factor | Efficiency (about 0.75 kW) | Noise |
|---|---|---|---|---|---|
| [[split-phase-motor|Split-phase]] | 100–175 % | 6–9 × | 0.55–0.7 | 55–70 % | 100 Hz hum |
| [[capacitor-start-motor|Capacitor-start]] | 200–350 % | 3.5–6 × | 0.6–0.75 | 60–72 % | 100 Hz hum |
| Capacitor-start-run | 200–350 % | 3.5–6 × | 0.85–0.98 | 72–82 % | quiet |
| [[psc-motor|PSC]] | 30–70 % | 3–6 × | 0.85–0.98 | 70–80 % | quiet |
| [[shaded-pole-motor|Shaded-pole]] | 25–60 % | 1.2–1.5 × | 0.5–0.7 | 10–35 % (small sizes) | hum |

CSCR motors are made from about 0.37 kW to 7.5 kW (1/2–10 hp); they power single-phase air compressors, pumps, farm machinery, grain mills, larger workshop machines and air-conditioning compressors.

### In air conditioning: C, R, S and the dual capacitor
Hermetic compressors have three terminals: **C** (common), **R** (run, the main winding) and **S** (start, the auxiliary winding). A PSC compressor has a run capacitor between R and S; outdoor units often use one **dual run capacitor** with terminals C, HERM (compressor) and FAN, for example 45/5 µF 440 V. A compressor that struggles to start against pressure after a short power cut is often given a **hard-start kit** — a start capacitor with a potential relay — which turns it into a capacitor-start-run motor.

### Real life
A run capacitor ages: film capacitors slowly lose capacitance (a few per cent over their life, then faster near the end), and a weak one gives a hotter, noisier, weaker motor that draws more current (see [[capacitor-sizing]]). A capacitor-start-run motor that trips on overload after years of good service is a reason to measure the run capacitor before replacing the motor.

> [!warn] Run capacitors on 230 V motors hold several hundred volts. They are usually discharged through the windings when the motor stops, but not always (a capacitor removed from its circuit, or behind an open relay, keeps its charge). Isolate, lock off, discharge through a resistor and measure before touching.

> [!key] The start capacitor gives torque for a second; the run capacitor gives a round field for years. The pair costs more but runs cooler, quieter and with 10–15 % less input power than a capacitor-start motor.
`,
  ideas: [
    'A small film run capacitor stays in circuit with a continuously rated auxiliary winding; a large electrolytic start capacitor is added only for starting.',
    'At the design load the run capacitor makes the field nearly circular: power factor 0.9–0.98 and much less 100 Hz vibration.',
    'Running current falls by about a third and efficiency rises several points compared with a capacitor-start motor.',
    'The run capacitor sees about V·√(1 + a²) — well above the line voltage — so it is rated 400–450 V on 230 V motors.',
    'A hard-start kit (start capacitor plus potential relay) turns a PSC compressor into a capacitor-start-run motor.'
  ],
  pitfalls: [
    'A run capacitor rated 250 V is fine on a 230 V motor — It may see 350–400 V; an under-rated capacitor overheats and fails early.',
    'More run capacitance means a stronger motor — The run capacitor is matched to the design load; too much overloads the auxiliary winding and unbalances the field at light load.',
    'The run capacitor is only for starting — It stays in circuit and shapes the running field; the start capacitor is the one that drops out.'
  ],
  formulas: [
    {
      name: 'Line current of a single-phase motor',
      expr: 'I = P/(V*eta*pf)', tex: 'I = \\dfrac{P}{V\\,\\eta\\,\\mathrm{PF}}',
      vars: {
        I: { name: 'line current', q: 'current', unit: 'A' },
        P: { name: 'shaft output', q: 'power', unit: 'W', value: 750 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 230 },
        eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 80, tex: '\\eta' },
        pf: { name: 'power factor (cos φ)', value: 0.96, min: 0.05, max: 1, tex: '\\mathrm{PF}' }
      },
      stories: { I: 'A {P} single-phase motor on {V} runs at {eta} efficiency and a power factor of {pf}. What current does it draw?', pf: 'A {P} motor on {V} draws {I} at {eta} efficiency. What is its power factor?' }
    },
    {
      name: 'Voltage across the run capacitor at balance',
      expr: 'Vc = V*sqrt(1 + a^2)', tex: 'V_C = V\\sqrt{1 + a^2}',
      vars: {
        Vc: { name: 'capacitor voltage', q: 'voltage', unit: 'V', tex: 'V_C' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 230 },
        a: { name: 'turns ratio, auxiliary to main winding', value: 1.4 }
      },
      note: 'With the field circular the auxiliary winding\'s voltage is a·V, 90° ahead of the supply; stator voltage drops are neglected.',
      stories: { Vc: 'A capacitor-run motor on {V} has an auxiliary winding with {a} times the turns of the main one. What voltage does its run capacitor see?', a: 'The run capacitor of a {V} motor measures {Vc} at full load. What is the turns ratio of its auxiliary winding?' }
    },
    {
      name: 'Run capacitance for a given auxiliary current',
      expr: 'C = Ia/(2*pi*f*Vc)', tex: 'C = \\dfrac{I_a}{2\\pi f\\,V_C}',
      vars: {
        C: { name: 'run capacitance', q: 'capacitance', unit: 'µF' },
        Ia: { name: 'auxiliary current at the design load', q: 'current', unit: 'A', value: 2.5, tex: 'I_a' },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 },
        Vc: { name: 'capacitor voltage', q: 'voltage', unit: 'V', value: 396, tex: 'V_C' }
      },
      stories: { C: 'At full load the auxiliary winding should carry {Ia} with {Vc} across its capacitor at {f}. What run capacitance is needed?' }
    },
    {
      name: 'Input power saved by a better efficiency',
      expr: 'dP = P*(1/eta1 - 1/eta2)', tex: '\\Delta P = P\\left(\\dfrac{1}{\\eta_1} - \\dfrac{1}{\\eta_2}\\right)',
      vars: {
        dP: { name: 'input power saved', q: 'power', unit: 'W', tex: '\\Delta P' },
        P: { name: 'shaft output', q: 'power', unit: 'W', value: 750 },
        eta1: { name: 'efficiency of the less efficient motor', q: 'ratio', unit: '%', value: 68.4, tex: '\\eta_1' },
        eta2: { name: 'efficiency of the better motor', q: 'ratio', unit: '%', value: 79.8, tex: '\\eta_2' }
      },
      stories: { dP: 'A {P} load is driven by a motor of {eta1} efficiency, or by one of {eta2}. How much input power does the better one save?' }
    }
  ],
  examples: [
    {
      title: 'What the run capacitor buys',
      q: 'A 0.75 kW load runs 3000 hours a year. A capacitor-start motor does it at 68.4 % efficiency and a power factor of 0.70; a capacitor-start-run motor at 79.8 % and 0.96, on 230 V. Compare the currents and the yearly energy.',
      steps: [
        'Capacitor-start: $I = 750/(230 \\times 0.684 \\times 0.70) = 6.8$ A; input $750/0.684 = 1096$ W.',
        'Capacitor-start-run: $I = 750/(230 \\times 0.798 \\times 0.96) = 4.3$ A; input $750/0.798 = 940$ W.',
        'Saving $1096 - 940 = 157$ W, or $0.157 \\times 3000 = 470$ kWh a year.',
        'The lower current also means less voltage drop in the supply cable and cooler windings.'
      ],
      a: '4.3 A instead of 6.8 A, and about 470 kWh a year less energy.'
    },
    {
      title: 'Rating a replacement run capacitor',
      q: 'A 230 V motor\'s auxiliary winding has 1.5 times the turns of its main winding. At full load it draws 2.2 A. What run capacitor does it need, and what voltage rating?',
      steps: [
        '$V_C = 230\\sqrt{1 + 1.5^2} = 230 \\times 1.80 = 415$ V.',
        '$C = 2.2/(2\\pi \\times 50 \\times 415) = 16.9$ µF — a standard 16 µF or 18 µF part, whichever the nameplate names.',
        'Rating: at least 450 V AC; a 500 V part is fine.'
      ],
      a: 'About 17 µF, rated 450 V AC or more (use the nameplate value when there is one).'
    }
  ],
  quiz: [
    { q: 'Which capacitor stays in circuit while a CSCR motor runs?', choices: ['The film run capacitor', 'The electrolytic start capacitor', 'Both', 'Neither'], a: 0, why: 'The start switch or relay removes the start capacitor; the run capacitor stays and keeps the field nearly circular.' },
    { q: 'Compared with a capacitor-start motor of the same rating, a CSCR motor at full load has…', choices: ['a lower current, a higher power factor and a higher efficiency', 'a higher starting torque but a worse power factor', 'the same current but less noise', 'a higher speed and a higher current'], a: 0, why: 'The run capacitor supplies the magnetising reactive current and cancels the backward field: about 4.3 A at 0.96 against 6.9 A at 0.70 for the 0.75 kW motor.' },
    { q: 'Why is the run capacitor of a 230 V motor rated 400–450 V?', choices: ['It sees the difference between the supply and the auxiliary winding\'s voltage, about V·√(1 + a²)', 'For a safety margin against lightning only', 'Because it charges to the peak of the supply', 'Because electrolytic capacitors need double the voltage'], a: 0, why: 'At balance the auxiliary winding\'s voltage is a·V and 90° ahead; the capacitor holds the phasor difference, V√(1 + a²) ≈ 395 V for a = 1.4.' },
    { q: 'An air-conditioner compressor with a PSC motor fails to restart after a brief power cut. A common fix is…', choices: ['a hard-start kit: a start capacitor with a potential relay', 'a larger run capacitor', 'swapping C and R', 'a lower-voltage run capacitor'], a: 0, why: 'A PSC motor has little starting torque against the pressure left in the system; a hard-start kit adds a start capacitor for the first second, as in a CSCR motor.' },
    { q: 'True or false: the run capacitor makes the field circular at every load.', a: false, why: 'Only near the design load; at light load the auxiliary current is too large for balance and some backward field returns.' }
  ],
  problems: [
    { q: 'A 1.5 kW single-phase motor on 230 V has an efficiency of 78 % and a power factor of 0.95. What current does it draw?', answer: 8.8, unit: 'A', tol: 0.02, steps: ['$I = 1500/(230 \\times 0.78 \\times 0.95) = 8.8$ A.'] },
    { q: 'What voltage does the run capacitor of a 230 V motor with an auxiliary-to-main turns ratio of 1.3 see at balance?', answer: 377, unit: 'V', tol: 0.02, steps: ['$V_C = 230\\sqrt{1 + 1.69} = 230 \\times 1.640 = 377$ V.'] }
  ],
  choose: {
    good: [
      'Hard-starting single-phase loads that also run many hours: compressors, pumps, farm machinery, mills.',
      'Where the supply current matters (long cables, small generators) — about a third less current at full load.',
      'Quieter single-phase drives: far less 100 Hz vibration than a capacitor-start motor.'
    ],
    avoid: [
      'Easy-starting fans and blowers: a PSC motor does the job without the start circuit.',
      'Frequent starts or very high inertia: the start capacitor still limits the starts per hour.',
      'Above about 3 kW where three-phase or a single-phase-input VFD with a three-phase motor is available — better efficiency and speed control.'
    ],
    check: [
      'Both capacitors\' µF and voltage ratings (run: film, continuous duty, 400–450 V on 230 V; start: electrolytic).',
      'The start switch or relay type and its condition.',
      'Efficiency and power factor at your actual load, not only at rated load.'
    ]
  },
  applications: [
    'Single-phase piston air compressors of 1.5–3 kW and borehole pumps.',
    'Residential air-conditioning and heat-pump compressors with hard-start kits.',
    'Farm machinery (grain augers, mills, milking vacuum pumps) on rural single-phase lines.'
  ],
  sources: [
    'Veinott, *Fractional and Subfractional Horsepower Electric Motors*: capacitor-run and two-value capacitor motors.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: unsymmetrical two-phase analysis of capacitor motors.',
    'IEC 60252-1, *AC motor capacitors — Part 1: General — Performance, testing and rating — Safety requirements*.',
    'NEMA MG 1, *Motors and Generators*: single-phase motor classifications.'
  ],
  sim: [{ id: 'sp-lab', params: { type: 'cscr' } }, { id: 'sp-wiring', params: { type: 'cscr', relay: 'potential' } }]
},

{
  id: 'psc-motor', parent: 'single-phase-motors', title: 'The permanent split-capacitor (PSC) motor', level: 2,
  short: 'A single-phase motor with one film capacitor permanently in series with its auxiliary winding and no switch at all. Quiet, reliable, efficient near its design load and easy to reverse or to slow down by lowering the voltage — but with a low starting torque, so it suits fans, blowers and pumps rather than hard-starting loads.',
  keywords: ['PSC motor', 'permanent split capacitor', 'capacitor-run motor', 'run capacitor', 'fan motor', 'blower motor', 'speed taps', 'multi-speed', 'triac speed control', 'reversible motor', 'rotor loss', 'EC motor'],
  prereq: ['capacitor-start-run', 'single-phase-problem', 'load-torque-types'],
  related: ['capacitor-sizing', 'shaded-pole-motor', 'motors-pumps-fans', 'vfd-energy-saving', 'bldc-motor', 'motor-life-cost', 'motor-noise'],
  body: `
Take a [[capacitor-start-run]] motor and remove the start capacitor and its switch: what is left is the **permanent split-capacitor** motor. One capacitor, typically 1.5–10 µF in fan motors and 20–80 µF in compressors, stays in series with the auxiliary winding all the time. Nothing moves except the rotor, so there is nothing to wear, stick or spark.

### What it gives, and what it lacks
The run capacitor is sized for the running point, where it makes the field nearly circular: power factor 0.9–0.98, little 100 Hz vibration and a quiet motor. At standstill the same small capacitor passes only a small auxiliary current, so the **starting torque is low** — typically 30–70 % of rated (about 40 % for the 0.75 kW motor of the simulations, 75 % for the high-slip blower in the fan simulation). That is enough for a fan or a centrifugal pump, whose torque grows with the square of speed and is tiny at standstill, but not for a compressor starting against pressure or a loaded conveyor.

| Where you find PSC motors | Typical size | Run capacitor |
|---|---|---|
| Furnace and air-handler blowers (multi-speed) | 90–750 W (1/8–1 hp) | 5–15 µF, 370/440 V |
| Condenser and cooling fans | 30–370 W | 2–7.5 µF |
| Ceiling and pedestal fans | 30–80 W | 1.5–4 µF |
| Hermetic A/C and heat-pump compressors | 1–5 kW | 25–80 µF, 370/440 V |
| Gate and awning operators, actuators (reversible) | 50–400 W | 5–20 µF |

### Speed control by voltage
A PSC motor's torque at a given slip rises with the square of the voltage. Lower the voltage and the torque curve shrinks; against a fan whose torque falls steeply with speed, the operating point slides down to a lower speed. Blowers do this with **tapped main windings** (high, medium and low speed leads), ceiling fans with a capacitor-dropper switch, and simple controllers with a triac chopping the voltage. It works because PSC fan motors are built with a high-resistance rotor, which makes their torque curve fall gently.

The price is the **rotor loss**: the rotor always dissipates the slip fraction of the power crossing the air gap,

$$P_{r} = s\\,P_{ag}$$

so at 30 % slip at least 30 % of that power becomes heat in the rotor. In the fan simulation the blower gives 150 W at 1290 rpm with 69 % efficiency on the high tap, but only 86 W at 1070 rpm and 53 % efficiency on the low tap (160 V). This is why HVAC blowers are moving to electronically commutated (EC, [[bldc-motor|brushless]]) motors, which slow down without slip loss.

### Reversing: move the capacitor
In a **reversible PSC motor** the two windings are identical. An SPDT switch connects the capacitor in series with one winding or the other: whichever has the capacitor becomes the auxiliary winding, and the field turns the other way. That makes PSC motors the standard for gate operators, awnings, valve actuators and washing-machine drums of the older kind. Reversing a running motor this way plugs it (brakes it hard) — let it stop first unless the design allows plugging.

| Leads (reversible PSC) | Connection |
|---|---|
| Common | to N |
| Winding 1 end | to L for one direction; capacitor to winding 2 end |
| Winding 2 end | to L for the other direction; capacitor to winding 1 end |

### Real life
- A **weak run capacitor** (lost 20–30 % of its µF) makes the motor start slowly or not at all, run slower and hotter, and draw more current — the most common PSC fault. A dead one leaves it humming at standstill; a push will start it in either direction.
- PSC motors are **impedance-limited**: the locked-rotor current of a small fan motor is often only 2–3 times its running current, so many survive a stall for minutes; most still carry a thermal protector.
- Sleeve-bearing fan motors that start slowly after a cold night usually have dry bearings, not a bad capacitor — check both.

In the fan simulation, switch taps and watch the operating point, the rotor loss and the capacitor's effect.

> [!warn] Run capacitors hold charge. Before touching the terminals of a fan or compressor capacitor: isolate, lock off, discharge through a resistor and measure. Replace a capacitor with the same µF and at least the same voltage rating.

> [!key] One permanent film capacitor: no switch, quiet, efficient at its design load — but low starting torque. Ideal for fans and pumps, slowed by lowering the voltage at the cost of rotor heat, reversed by moving the capacitor.
`,
  ideas: [
    'A PSC motor keeps one film capacitor in series with its auxiliary winding permanently; there is no start switch.',
    'The capacitor is sized for running, so the starting torque is low (30–70 % of rated) — right for fans and pumps.',
    'Torque scales with the square of the voltage, so taps or a triac slow a fan down; the slip power becomes rotor heat.',
    'Reversible PSC motors have identical windings; moving the capacitor from one to the other reverses them.',
    'A weak run capacitor is the commonest fault: slow start, low speed, high current, hot motor.'
  ],
  pitfalls: [
    'Slowing a PSC fan with a triac saves as much energy as a VFD — The rotor turns the slip fraction of the air-gap power into heat; efficiency falls steeply at low speed, unlike an EC motor or an induction motor on a VFD.',
    'A PSC motor that will not start needs a bigger capacitor — The load may simply need more starting torque than any run capacitor can give; a hard-start kit or a capacitor-start motor is the fix. An over-sized run capacitor overheats the auxiliary winding.',
    'A PSC motor can drive any load a capacitor-start motor of the same kW can — Its starting torque is several times lower.'
  ],
  formulas: [
    {
      name: 'Torque falls with the square of the voltage',
      expr: 'T = Tn*(V/Vn)^2', tex: 'T = T_n\\left(\\dfrac{V}{V_n}\\right)^2',
      vars: {
        T: { name: 'torque at the same slip, reduced voltage', q: 'torque', unit: 'N·m' },
        Tn: { name: 'torque at that slip at rated voltage', q: 'torque', unit: 'N·m', value: 1.11, tex: 'T_n' },
        V: { name: 'applied voltage', q: 'voltage', unit: 'V', value: 160 },
        Vn: { name: 'rated voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_n' }
      },
      note: 'At a given slip the currents and the flux both scale with the voltage, so the torque scales with its square.',
      stories: { T: 'A PSC fan motor makes {Tn} at a certain speed on {Vn}. What torque does it make at the same speed on {V}?', V: 'What voltage cuts a motor\'s torque at a given speed from {Tn} to {T}, if it is rated {Vn}?' }
    },
    {
      name: 'Rotor copper loss',
      expr: 'Pr = s*Pag', tex: 'P_r = s\\,P_{ag}',
      vars: {
        Pr: { name: 'power lost in the rotor', q: 'power', unit: 'W', tex: 'P_r' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 30, min: 0, max: 100 },
        Pag: { name: 'power crossing the air gap', q: 'power', unit: 'W', value: 125, tex: 'P_{ag}' }
      },
      note: 'For the forward field; the backward field adds more. The mechanical power is (1 − s) Pag.',
      stories: { Pr: 'A fan motor slowed to a slip of {s} passes {Pag} across its air gap. How much heat does its rotor make?' }
    },
    {
      name: 'Fan power with speed (affinity law)',
      expr: 'P = Pn*(n/nn)^3', tex: 'P = P_n\\left(\\dfrac{n}{n_n}\\right)^3',
      vars: {
        P: { name: 'fan shaft power', q: 'power', unit: 'W' },
        Pn: { name: 'fan power at the reference speed', q: 'power', unit: 'W', value: 150, tex: 'P_n' },
        n: { name: 'speed', q: 'angvel', unit: 'rpm', value: 1070 },
        nn: { name: 'reference speed', q: 'angvel', unit: 'rpm', value: 1286, tex: 'n_n' }
      },
      stories: { P: 'A blower takes {Pn} at {nn}. What does it take at {n}?', n: 'A blower takes {Pn} at {nn}. At what speed does it take {P}?' }
    }
  ],
  examples: [
    {
      title: 'A blower on its low tap',
      q: 'A PSC blower gives 150 W at 1286 rpm on its high tap (synchronous speed 1500 rpm). On the low tap it runs at 1070 rpm. Estimate the fan power there, and the rotor loss from the forward field.',
      steps: [
        'Fan power: $P = 150 \\times (1070/1286)^3 = 150 \\times 0.576 = 86$ W.',
        'Slip: $s = (1500 - 1070)/1500 = 0.287$.',
        'Adding about 4 W of friction, the mechanical power is 90 W $= (1 - s)P_{ag}$, so $P_{ag} = 90/0.713 = 126$ W.',
        'Rotor loss $= s P_{ag} = 0.287 \\times 126 = 36$ W — some 40 % of the useful output; on the high tap (slip 14 %) it is about 26 W, 17 % of it.'
      ],
      a: 'About 86 W of fan power, with some 36 W of heat in the rotor.'
    },
    {
      title: 'Why the compressor would not start',
      q: 'A PSC compressor motor has a starting torque of 45 % of rated. After a 30-second power cut the refrigerant pressures have not equalised and the compressor needs 80 % of rated torque to turn. What happens, and what is the usual remedy?',
      steps: [
        '45 % < 80 %: the motor stays at standstill, humming at locked-rotor current, until its overload protector trips.',
        'The protector resets, the motor tries again — "short cycling on the overload" — until the pressures equalise.',
        'Remedies: a restart delay (time-delay relay) that waits for the pressures to equalise, or a hard-start kit that adds a start capacitor with a relay for the first second.'
      ],
      a: 'It stalls and trips; a restart delay or a hard-start kit fixes it.'
    }
  ],
  quiz: [
    { q: 'Why does a PSC motor have a low starting torque?', choices: ['Its single capacitor is sized for running, so at standstill it passes only a small auxiliary current', 'It has no auxiliary winding', 'Its rotor has no bars', 'The capacitor is disconnected at standstill'], a: 0, why: 'A run capacitor of a few µF gives the right current at speed, but far too little at locked rotor for a good phase split and a strong field.' },
    { q: 'A three-speed PSC blower runs on its low tap. Compared with the high tap, its efficiency is…', choices: ['lower, because more of the air-gap power is lost as rotor heat at the higher slip', 'higher, because it runs slower', 'the same', 'higher, because the voltage is lower'], a: 0, why: 'Rotor loss is s × Pag; slowing by slip rather than by frequency wastes the slip power.' },
    { q: 'How is a reversible PSC motor reversed?', choices: ['By connecting the capacitor in series with the other winding', 'By swapping L and N', 'By a centrifugal switch', 'By reversing the capacitor\'s terminals'], a: 0, why: 'Its windings are identical; the one with the capacitor becomes the auxiliary winding, and the field direction follows.' },
    { q: 'A condenser fan starts slowly and runs hot; its 5 µF run capacitor measures 3.2 µF. The fan…', choices: ['needs a new capacitor of 5 µF and at least the same voltage rating', 'is fine: capacitors always read low', 'needs a 10 µF capacitor to compensate', 'needs a start capacitor'], a: 0, why: '3.2 µF is 36 % low, far outside a ±5–10 % tolerance: the auxiliary current and starting torque are too small. Replace with the nameplate value.' },
    { q: 'True or false: a PSC motor has a centrifugal switch that removes its capacitor at speed.', a: false, why: 'The capacitor is permanent — that is what the "P" means. There is no switch to wear.' }
  ],
  problems: [
    { q: 'A PSC motor gives 2.0 N·m at a certain speed on 230 V. What does it give at the same speed on 180 V?', answer: 1.22, unit: 'N·m', tol: 0.02, steps: ['$T = 2.0 \\times (180/230)^2 = 2.0 \\times 0.612 = 1.22$ N·m.'] },
    { q: 'A fan motor at a slip of 25 % passes 200 W across its air gap. How much power is lost in its rotor?', answer: 50, unit: 'W', tol: 0.01, steps: ['$P_r = 0.25 \\times 200 = 50$ W.'] }
  ],
  choose: {
    good: [
      'Fans, blowers and centrifugal pumps from about 20 W to 750 W, and hermetic compressors with equalised pressures at start.',
      'Quiet, long-life drives with no switch to wear: HVAC, ventilation, office equipment.',
      'Reversing duty: gate and awning operators, valve actuators.'
    ],
    avoid: [
      'Hard-starting loads: compressors against pressure, conveyors, mixers — use capacitor-start or capacitor-start-run motors.',
      'Wide speed ranges with good efficiency: use an EC (brushless) motor or a three-phase motor on a VFD.',
      'Frequent plugging (instant reversal while running) unless the motor is rated for it.'
    ],
    check: [
      'Starting torque against the load at standstill, including pressure left in a compressor.',
      'The run capacitor\'s µF (tolerance ±5–10 %) and voltage rating (370/440 V or 400/450 V).',
      'Efficiency and winding temperature at the lowest speed you will use.'
    ]
  },
  applications: [
    'Furnace and air-handler blowers with three to five speed taps.',
    'Condenser fans and residential A/C compressors sharing a dual run capacitor (C, HERM, FAN).',
    'Ceiling fans, pedestal fans and range hoods with capacitor or triac speed controls.'
  ],
  sources: [
    'Veinott, *Fractional and Subfractional Horsepower Electric Motors*: permanent-split capacitor motors, speed control by voltage and tapped windings.',
    'Hughes and Drury, *Electric Motors and Drives*: single-phase induction motors and the rotor loss in slip control.',
    'IEC 60252-1, *AC motor capacitors — Part 1: General — Performance, testing and rating — Safety requirements*.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*.'
  ],
  sim: ['sp-psc-fan', { id: 'sp-lab', params: { type: 'psc' } }]
},

{
  id: 'shaded-pole-motor', parent: 'single-phase-motors', title: 'The shaded-pole motor', level: 1,
  short: 'The simplest AC motor: salient poles with a copper ring around part of each pole face. The current induced in the ring delays the flux under it, so the flux sweeps across the pole and drags a cage rotor along. No capacitor, no switch, almost indestructible — and very inefficient (typically 10–35 %), so it is used only for small fans and pumps of a few watts to about 100 W.',
  keywords: ['shaded-pole motor', 'shading ring', 'shading coil', 'C-frame motor', 'small fan motor', 'impedance protected', 'low efficiency', 'sleeve bearing', 'thermal fuse', 'EC fan'],
  prereq: ['single-phase-problem', 'physics:lenzs-law', 'physics:faradays-law'],
  related: ['psc-motor', 'split-phase-motor', 'motors-pumps-fans', 'bearing-failures', 'motor-life-cost', 'efficiency-losses'],
  body: `
The shaded-pole motor makes a moving field with nothing but copper and iron. Its stator has **salient poles** (on the smallest motors a single coil on a C-shaped core) and around roughly a third of each pole face sits a short-circuited copper ring or strap — the **shading ring**.

### How the ring moves the field
When the main flux through the pole starts to rise, it induces a current in the ring, and by [[physics:lenzs-law|Lenz's law]] that current opposes the change. So the flux in the **shaded** part lags behind the flux in the unshaded part — by several tens of degrees. At any moment the flux peak sits in the unshaded part first and then in the shaded part: the field **sweeps from the unshaded edge to the shaded edge** of every pole, fifty times a second. A cage rotor follows that sweep. It is a crude, strongly elliptical rotating field — a large backward component remains — but it starts the motor.

The direction is fixed by the construction: always from the unshaded towards the shaded side. To reverse a simple shaded-pole motor you turn the stator over (or the whole motor end for end); a few designs have two sets of shading coils that are switched.

### What it gives
For the small fan motor of the simulation (4 poles, 230 V, 50 Hz): 12 W on the shaft at 1380 rpm for 54 W in, **about 23 % efficiency**, 0.34 A at a power factor of 0.68, a starting torque of about 36 % of rated (31 of 86 mN·m), and a locked-rotor current of only 0.45 A — 1.3 times the running current.

| Property | Typical shaded-pole motor |
|---|---|
| Output | about 1–100 W (a few up to about 250 W) |
| Speed (4-pole / 2-pole, 50 Hz) | about 1250–1400 / 2400–2800 rpm: high slip |
| Efficiency | 5–35 % (the smallest are worst) |
| Power factor | 0.5–0.7 |
| Starting torque | 25–60 % of rated |
| Locked-rotor current | 1.2–1.5 × running: "impedance protected" |
| Uses | small fans (refrigerator evaporator and condenser fans, heater and oven fans, extractor fans, display cases), small pumps, humidifiers, older timers and clocks |

### Why it survives and why it wastes
Its large leakage reactance keeps the stalled current barely above the running current, so a jammed fan motor heats but often survives for a long time; most carry a one-shot thermal fuse or an auto-reset protector in the winding anyway. The same design choices — a partial field, a large backward field, high rotor resistance and the loss in the shading ring itself — make it wasteful. Most of the input becomes heat.

### Real-life faults
| Symptom | Likely cause | What to do |
|---|---|---|
| Starts slowly or not at all when cold, runs when pushed | dry or gummed sleeve bearings (sintered bronze soaked in oil) | replace the motor or its bearings; oil only as the maker allows |
| Will not start, hums | seized bearings, jammed blade, cracked shading ring | isolate, free the rotor, check the ring |
| Dead, winding reads open | thermal fuse blown after a stall | find why it stalled; replace the motor (the fuse is usually buried in the winding) |
| Runs slower than it used to, hot | bearing drag, fan fouled with dust or grease | clean, check bearings |

### Speed control and the alternatives
Speed can be lowered by a lower voltage (taps, a series resistor or a triac), which moves the operating point down the fan curve — at the cost of efficiency. For fans running thousands of hours a year, **EC fans** (brushless motors with built-in electronics) reach 60–80 % efficiency at similar sizes; the energy saved usually pays for the difference in price within a year or two where the fan runs continuously (see [[motor-life-cost]]).

> [!warn] Even small appliance motors run on mains voltage. Unplug or isolate before touching; fans can start without warning when a thermostat or a thermal protector closes.

> [!tip] If a small fan is slow to start after standing overnight but fine once warm, suspect the bearings first — not the winding.

> [!key] A copper ring delays the flux in part of each pole, so the field sweeps across it: a motor with no capacitor and no switch, hard to kill, cheap to make — and only 10–35 % efficient.
`,
  ideas: [
    'A short-circuited copper ring around part of each pole delays the flux there, so the flux sweeps from the unshaded to the shaded part.',
    'The direction is fixed by where the rings are; reversing means turning the stator over.',
    'Efficiency is only about 10–35 %, power factor 0.5–0.7 and starting torque 25–60 % of rated.',
    'The locked-rotor current is barely above the running current, so a stalled shaded-pole motor heats but often survives.',
    'Dry sleeve bearings are the commonest reason a shaded-pole fan starts slowly or not at all.'
  ],
  pitfalls: [
    'A shaded-pole motor can be reversed by swapping its two leads — Swapping the supply leads changes nothing; the direction is set by the physical position of the shading rings.',
    'A small motor wastes little, so its efficiency does not matter — A 12 W fan motor using 54 W for 8760 hours a year wastes about 370 kWh, several times what an EC fan would.',
    'A shaded-pole motor that will not start has a burnt winding — Much more often its bearings are dry or the rotor is jammed; the winding is checked last (or found open after a thermal fuse has blown).'
  ],
  formulas: [
    {
      name: 'Efficiency from electrical measurements',
      expr: 'eta = P/(V*I*pf)', tex: '\\eta = \\dfrac{P}{V\\,I\\,\\mathrm{PF}}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        P: { name: 'shaft output', q: 'power', unit: 'W', value: 12 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 230 },
        I: { name: 'current', q: 'current', unit: 'A', value: 0.34 },
        pf: { name: 'power factor (cos φ)', value: 0.68, min: 0.05, max: 1, tex: '\\mathrm{PF}' }
      },
      note: 'V·I·PF is the input power a wattmeter reads (here 53 W).',
      stories: { eta: 'A {P} shaded-pole fan motor on {V} draws {I} at a power factor of {pf}. How efficient is it?' }
    },
    {
      name: 'Energy lost in a year',
      expr: 'E = (Pin - P)*h', tex: 'E = (P_{in} - P)\\,h',
      vars: {
        E: { name: 'energy lost as heat', q: false, unit: 'kWh', tex: 'E' },
        Pin: { name: 'input power', q: false, unit: 'kW', value: 0.054, tex: 'P_{in}' },
        P: { name: 'shaft output', q: false, unit: 'kW', value: 0.012 },
        h: { name: 'running hours', q: false, unit: 'h', value: 8760 }
      },
      stories: { E: 'A fan motor takes {Pin} to give {P} and runs {h} a year. How much energy does it turn into heat?' }
    },
    {
      name: 'Speed from slip',
      expr: 'n = ns*(1 - s)', tex: 'n = n_s\\,(1 - s)',
      vars: {
        n: { name: 'rotor speed', q: 'angvel', unit: 'rpm' },
        ns: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: 'n_s' },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 8, min: 0, max: 100 }
      },
      stories: { n: 'A 4-pole shaded-pole motor runs at a slip of {s} on 50 Hz (synchronous {ns}). How fast does it turn?', s: 'A fan motor with a synchronous speed of {ns} runs at {n}. What is its slip?' }
    }
  ],
  examples: [
    {
      title: 'A refrigerator fan motor',
      q: 'A shaded-pole fan motor on 230 V draws 0.34 A at a power factor of 0.68 and delivers 12 W. It runs 60 % of the time all year. Find its efficiency and its yearly losses, and compare an EC fan giving the same 12 W at 70 % efficiency.',
      steps: [
        'Input: $230 \\times 0.34 \\times 0.68 = 53$ W; efficiency $12/53 = 23$ %.',
        'Hours: $0.6 \\times 8760 = 5256$ h. Losses: $(0.053 - 0.012) \\times 5256 = 215$ kWh a year.',
        'EC fan: input $12/0.70 = 17.1$ W; losses $(0.0171 - 0.012) \\times 5256 = 27$ kWh.',
        'The EC fan saves about 190 kWh a year — and the heat no longer has to be pumped out of the refrigerator.'
      ],
      a: 'About 23 % efficient, losing about 215 kWh a year against about 27 kWh for an EC fan.'
    }
  ],
  quiz: [
    { q: 'What does the shading ring do?', choices: ['Its induced current delays the flux in part of the pole, so the flux sweeps across the pole face', 'It stores energy like a capacitor', 'It limits the starting current', 'It reverses the motor at standstill'], a: 0, why: 'By Lenz\'s law the ring\'s current opposes changes of the flux through it, so the shaded part\'s flux lags: the field moves from the unshaded to the shaded side.' },
    { q: 'Which way does a shaded-pole motor turn?', choices: ['From the unshaded towards the shaded part of each pole', 'From the shaded towards the unshaded part', 'Either way, depending on how it is connected', 'The way it was last pushed'], a: 0, why: 'The flux peak moves from the unshaded part (leading) to the shaded part (lagging); the rotor follows.' },
    { q: 'A shaded-pole fan is stalled by a jammed blade. Typically…', choices: ['its current rises only slightly, it heats, and a thermal fuse or protector may eventually open', 'its current rises to 6–8 times and trips the breaker at once', 'it reverses', 'nothing happens: stalled motors draw no current'], a: 0, why: 'Its high leakage reactance limits the locked-rotor current to about 1.2–1.5 × the running current: "impedance protected".' },
    { q: 'Typical efficiency of a 10–20 W shaded-pole motor is closest to…', choices: ['20 %', '50 %', '75 %', '90 %'], a: 0, why: 'Shaded-pole motors of this size are roughly 10–30 % efficient; most of the input becomes heat.' }
  ],
  problems: [
    { q: 'A shaded-pole motor takes 40 W and delivers 9 W, running 4000 hours a year. How much energy does it waste in a year?', answer: 124, unit: 'kWh', tol: 0.01, steps: ['$(0.040 - 0.009) \\times 4000 = 124$ kWh.'] },
    { q: 'A 2-pole shaded-pole motor runs at 2640 rpm on 50 Hz. What is its slip?', answer: 12, unit: '%', tol: 0.01, steps: ['$n_s = 3000$ rpm; $s = (3000 - 2640)/3000 = 0.12$.'] }
  ],
  choose: {
    good: [
      'Tiny fans and pumps (a few to about 100 W) where the lowest price and a stall-proof motor matter more than efficiency.',
      'Appliances with short or occasional running times.'
    ],
    avoid: [
      'Anything running many hours a year: EC (brushless) fans use a third to a quarter of the power.',
      'Loads needing starting torque or speed regulation; reversing duty.',
      'Heat-sensitive enclosures: most of the input becomes heat inside.'
    ],
    check: [
      'Rotation direction when ordering (it cannot be changed by wiring).',
      'Bearing type (sleeve or ball) against the running hours and mounting position.',
      'Thermal protection (fuse or auto-reset) and the input power, not just the output.'
    ]
  },
  applications: [
    'Refrigerator evaporator and condenser fans, oven and heater fans, bathroom extractors.',
    'Small drain and circulation pumps in older appliances, humidifiers, display-case fans.',
    'Replacement by EC fans in refrigeration and ventilation to cut energy use.'
  ],
  history: 'Shading rings were used in AC meters and relays in the late nineteenth century to make a moving or lagging flux; shaded-pole motors became the standard drive for small fans and electric clocks in the early twentieth century because they needed no switch or capacitor.',
  sources: [
    'Veinott, *Fractional and Subfractional Horsepower Electric Motors*: shaded-pole motors, their design and performance.',
    'Chapman, *Electric Machinery Fundamentals*: the chapter on single-phase motors — shaded-pole motors.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*.'
  ],
  sim: 'sp-shaded'
},

{
  id: 'capacitor-sizing', parent: 'single-phase-motors', title: 'Start and run capacitors: values, ratings, failures', level: 2,
  short: 'Run capacitors are metallised polypropylene film, a few to about 80 µF, rated 370–500 V AC for continuous duty; start capacitors are AC electrolytics of about 50–800 µF rated for seconds per start. How to size, rate and test them, what a failing one does to the motor, and how to discharge one safely.',
  keywords: ['run capacitor', 'start capacitor', 'motor capacitor', 'µF per kW', 'capacitor voltage rating', 'film capacitor', 'electrolytic capacitor', 'capacitor tolerance', 'class of operation', 'bleeder resistor', 'discharge capacitor', 'capacitor test', 'bulged capacitor', 'IEC 60252'],
  prereq: ['capacitor-start-motor', 'capacitor-start-run', 'electronics:capacitors', 'physics:energy-in-capacitor'],
  related: ['psc-motor', 'steinmetz-connection', 'split-phase-motor', 'maintenance-diagnostics', 'motor-failures', 'electronics:rc-transient', 'physics:reactance'],
  body: `
A single-phase motor's capacitor is part of its design: its µF were chosen with the auxiliary winding's turns and resistance to give the right current at the right [[?phase|phase]]. When the label is readable, **replace like with like** — same µF, same or higher voltage, same type. This page explains what the numbers mean, what to do when the label is gone, and what a failing capacitor does.

### Two different components
| | Run capacitor | Start capacitor |
|---|---|---|
| Construction | metallised polypropylene film, dry or oil-filled, in a plastic or aluminium can; self-healing | non-polarised AC electrolytic (two anodes back to back), black plastic can, vent in the top |
| Values | about 1.5–80 µF (fans 1.5–10, motors 12–50, compressors 25–80) | about 50–800 µF |
| Tolerance | ±5 % (±10 % on cheap parts) | wide, printed as a range, e.g. 124–149 µF |
| Voltage ratings | 370 or 440 V (US); 400, 450 or 500 V AC (Europe) | 110–125, 165, 220–250, 330 V AC |
| Duty | continuous; life class A–D under IEC 60252-1 (A, B, C, D stand for 30 000, 10 000, 3000 and 1000 hours) | intermittent: typically a few seconds per start, about 20 starts an hour |
| Losses | tiny (dissipation factor about 0.1 %) | large: overheats if left in circuit |
| Protection | many have a safety class with an internal overpressure disconnector or segmented film, so they fail open instead of bursting | a bleeder resistor (about 15–20 kΩ, 2 W) across the terminals |

### Sizing when there is no label
The value scales with power and with $1/V^2$ (and roughly with $1/f$). Typical values at **230 V, 50 Hz** — rules of thumb for estimating, not a substitute for the maker's figure:

| Use | Typical value at 230 V, 50 Hz | at 115 V | at 60 Hz |
|---|---|---|---|
| Run capacitor, capacitor-run and CSCR motors 0.25–2.2 kW | 20–40 µF per kW | × 4 | about × 0.83 |
| Run capacitor, small PSC fan motors | 30–60 µF per kW (a few µF each) | × 4 | about × 0.83 |
| Start capacitor | 100–250 µF per kW (3–6 × the run value) | × 4 | about × 0.83 |
| Steinmetz three-phase on one phase ([[steinmetz-connection]]) | 50–70 µF per kW run, about twice that to start | × 4 | about × 0.83 |

The 0.75 kW motor of the simulations uses a 20 µF run capacitor (27 µF/kW) and a 100–120 µF start capacitor (130–160 µF/kW).

### The voltage rating
A run capacitor sees more than the supply: in a balanced capacitor motor about $V\\sqrt{1 + a^2}$, with $a$ the auxiliary-to-main turns ratio — typically 1.3–1.8 times the line voltage (see [[capacitor-start-run]]). The 20 µF capacitor of the 0.75 kW motor runs at 398 V on a 230 V supply. So: 400–450 V AC ratings on 230 V motors, 370–440 V on US 208/230 V equipment. A higher voltage rating is always acceptable; a lower one is not. A DC rating on a capacitor is not an AC rating.

### What a wrong value does
For the 0.75 kW capacitor-start-run motor at full load (see the capacitor bench simulation):

| Run capacitor | Line current | Auxiliary current | Efficiency | 100 Hz ripple | What you notice |
|---|---|---|---|---|---|
| 20 µF (nameplate) | 4.3 A | 2.5 A | 80 % | ±0.2 N·m | quiet |
| 14 µF (lost 30 %) | 4.8 A | 1.7 A | 79 % | ±1.3 N·m | hum, main winding 35 % more current, weaker start |
| 8 µF (lost 60 %) | 5.6 A | 0.9 A | 75 % | ±2.6 N·m | noisy, hot, may not start (PSC) |
| 30 µF (50 % too big) | 4.6 A | 4.1 A | 74 % | ±3.3 N·m | auxiliary winding over-heats, hum |

### Symptoms, causes and checks
| Symptom | Likely capacitor fault | Check |
|---|---|---|
| Hums at standstill, runs if pushed | start or run capacitor open (or its switch/relay) | measure µF; look for an overpressure disconnector (domed top) |
| Trips the breaker at switch-on | capacitor shorted | resistance across the terminals near zero |
| Starts slowly, runs slow and hot, draws high current | run capacitor lost µF | measure; more than 5–10 % below the label: replace |
| Start capacitor bulged, split or leaking, burnt smell | left in circuit (switch or relay stuck), too many starts | fix the switch or relay too, not only the capacitor |
| Buzzing capacitor, blackened terminals | loose connection, over-voltage | tighten, check the voltage rating |

**Testing.** With the supply isolated and the capacitor discharged, disconnect at least one lead and measure with a meter's capacitance range. In service, HVAC technicians also measure it running: the capacitor current and the voltage across it give $C = I/(2\\pi f V)$ — at 50 Hz that is 3183 × amperes ÷ volts in µF (2652 at 60 Hz).

### Discharging safely
A capacitor disconnected at the crest of the wave keeps up to the peak voltage — √2 × 400 V = 566 V for a run capacitor in service — and its energy $\\tfrac{1}{2}CV^2$: 6.4 J in 40 µF at 566 V, 10 J in a 120 µF start capacitor at 417 V. That is a painful, potentially dangerous shock and a violent spark. Run capacitors are usually discharged by the motor windings when the motor stops, but not always.

1. Isolate the supply, lock it off and prove it dead.
2. Discharge through a resistor (for example 10–20 kΩ, 5 W or more, on insulated leads), holding it on for at least five time constants $RC$ — 20 kΩ × 120 µF = 2.4 s, so about 12 s.
3. Measure the voltage across the terminals before touching.
4. Never short a capacitor with a screwdriver: the arc pits the terminals, can damage the capacitor and throws molten metal.

> [!warn] Capacitors store energy after the supply is off. Isolate and lock off, discharge through a resistor, and measure before touching. Machinery standards such as IEC 60204-1 ask that stored charge fall to 60 V or less within 5 s of disconnection (or that a warning label be fitted) — a motor capacitor on its own does not do that.

> [!tip] When replacing a failed start capacitor, find out why it failed: a centrifugal switch or relay that no longer opens will destroy the new one within minutes.

> [!key] Run capacitors: film, continuous duty, ±5 %, 400–450 V on 230 V. Start capacitors: electrolytic, seconds only. Replace with the nameplate µF and the same or higher voltage; a weak run capacitor makes a hot, noisy, weak motor. Always discharge through a resistor and measure before touching.
`,
  ideas: [
    'Run capacitors are film types for continuous duty; start capacitors are AC electrolytics for a few seconds per start.',
    'Capacitance scales with power and with 1/V²: four times the µF at 115 V as at 230 V for the same motor power.',
    'A run capacitor sees about V√(1 + a²), often 1.3–1.8 times the line voltage: rate it 400–450 V on 230 V.',
    'Too little or too much run capacitance unbalances the field: more current, heat, noise and less torque.',
    'Discharge through a resistor for five time constants and measure before touching; never short a capacitor.'
  ],
  pitfalls: [
    'A 250 V capacitor is fine on a 230 V motor — The run capacitor may see 350–450 V; use the nameplate rating or higher.',
    'A higher µF gives a stronger motor — Beyond the design value the auxiliary winding is overloaded and the field becomes unbalanced again; the motor runs hotter and noisier.',
    'A motor capacitor is always discharged once the motor stops — Usually the windings discharge it, but a capacitor behind an open switch or relay, or removed from its circuit, keeps its charge.'
  ],
  formulas: [
    {
      name: 'Reactance of a capacitor',
      expr: 'Xc = 1/(2*pi*f*C)', tex: 'X_C = \\dfrac{1}{2\\pi f C}',
      vars: {
        Xc: { name: 'capacitive reactance', q: 'resistance', unit: 'Ω', tex: 'X_C' },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 20 }
      },
      stories: { Xc: 'What is the reactance of a {C} run capacitor at {f}?', C: 'What capacitance has a reactance of {Xc} at {f}?' }
    },
    {
      name: 'Capacitor current (and µF measured in service)',
      expr: 'I = 2*pi*f*C*V', tex: 'I = 2\\pi f\\,C\\,V',
      vars: {
        I: { name: 'capacitor current', q: 'current', unit: 'A' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 20 },
        V: { name: 'voltage across the capacitor', q: 'voltage', unit: 'V', value: 398 }
      },
      note: 'Solved for C this is the running test: C = I/(2πfV), or 3183 × A ÷ V in µF at 50 Hz.',
      stories: { I: 'A {C} run capacitor has {V} across it at {f}. What current flows through it?', C: 'A clamp meter reads {I} in a run capacitor lead, with {V} across the capacitor at {f}. What is its real capacitance?' }
    },
    {
      name: 'Energy stored in a charged capacitor',
      expr: 'E = C*V^2/2', tex: 'E = \\tfrac{1}{2} C V^2',
      vars: {
        E: { name: 'stored energy', q: 'energy', unit: 'J' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 120 },
        V: { name: 'voltage it holds (up to the peak, √2 × rms)', q: 'voltage', unit: 'V', value: 417 }
      },
      stories: { E: 'A {C} start capacitor is disconnected holding {V}. How much energy does it store?' }
    },
    {
      name: 'Time to discharge through a resistor',
      expr: 't = R*C*ln(V0/V1)', tex: 't = R\\,C\\,\\ln\\dfrac{V_0}{V_1}',
      vars: {
        t: { name: 'time', q: 'time', unit: 's' },
        R: { name: 'discharge resistance', q: 'resistance', unit: 'kΩ', value: 20 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 120 },
        V0: { name: 'starting voltage', q: 'voltage', unit: 'V', value: 417, tex: 'V_0' },
        V1: { name: 'voltage to reach', q: 'voltage', unit: 'V', value: 60, tex: 'V_1' }
      },
      note: 'The voltage falls [[?exponential|exponentially]] with time constant RC; after five time constants less than 1 % is left.',
      stories: { t: 'A {C} capacitor holding {V0} is discharged through {R}. How long until it is below {V1}?', R: 'What resistor brings a {C} capacitor from {V0} to {V1} in {t}?' }
    }
  ],
  examples: [
    {
      title: 'Checking a run capacitor while it works',
      q: 'On a 50 Hz motor with a 20 µF ±5 % run capacitor, a clamp meter reads 2.10 A in the capacitor lead and a voltmeter 398 V across it. Is the capacitor good?',
      steps: [
        '$C = I/(2\\pi f V) = 2.10/(2\\pi \\times 50 \\times 398) = 16.8$ µF.',
        'The tolerance allows 19–21 µF; 16.8 µF is 16 % low.',
        'Replace it with 20 µF of the same or higher voltage rating (450 V AC).'
      ],
      a: 'About 16.8 µF — 16 % low: replace it.'
    },
    {
      title: 'Discharging a start capacitor',
      q: 'A 120 µF start capacitor may hold 417 V. How much energy is that, and how long does a 20 kΩ resistor take to bring it below 60 V? What power does the resistor see at first?',
      steps: [
        '$E = \\tfrac{1}{2} \\times 120\\times10^{-6} \\times 417^2 = 10.4$ J.',
        '$RC = 20\\,000 \\times 120\\times10^{-6} = 2.4$ s; $t = 2.4\\ln(417/60) = 2.4 \\times 1.94 = 4.7$ s.',
        'Initial power $V^2/R = 417^2/20\\,000 = 8.7$ W — for a moment only, so a 5 W resistor copes; the energy it absorbs is the 10.4 J.'
      ],
      a: 'About 10 J; below 60 V after about 5 s (hold it about 12 s, five time constants, then measure).'
    },
    {
      title: 'Estimating a missing label',
      q: 'The label of a 1.1 kW, 230 V, 50 Hz capacitor-start-run motor is unreadable and the maker is unknown. Estimate the run and start capacitors.',
      steps: [
        'Run: 20–40 µF per kW gives 22–44 µF; the middle, about 30 µF, is a reasonable first try.',
        'Start: 100–250 µF per kW gives 110–275 µF; about 150–200 µF.',
        'Voltage ratings: run 450 V AC, start 250–330 V AC.',
        'Then check at full load: a quiet motor and a line current near the nameplate current; adjust in steps and watch the winding temperature.'
      ],
      a: 'A 30 µF / 450 V run capacitor and a 150–200 µF / 250–330 V start capacitor as a first estimate.'
    }
  ],
  quiz: [
    { q: 'Which capacitor may stay in a motor circuit continuously?', choices: ['A metallised polypropylene film run capacitor', 'An AC electrolytic start capacitor', 'Either, if the µF is right', 'A DC electrolytic'], a: 0, why: 'Film capacitors have tiny losses and are rated for continuous duty; electrolytic start capacitors overheat within minutes.' },
    { q: 'A 230 V motor\'s run capacitor is marked 25 µF 450 V. Which replacement is acceptable?', choices: ['25 µF 500 V', '25 µF 250 V', '30 µF 450 V', '25 µF 450 V DC electrolytic'], a: 0, why: 'Same µF, same or higher AC voltage. A lower voltage fails early, a different µF changes the motor\'s balance, and a DC electrolytic is not an AC motor capacitor.' },
    { q: 'A 50 Hz motor\'s run capacitor carries 1.5 A with 300 V across it. Its capacitance is about…', choices: ['16 µF', '5 µF', '50 µF', '160 µF'], a: 0, why: 'C = I/(2πfV) = 1.5/(314 × 300) = 15.9 µF.' },
    { q: 'How should a start capacitor be discharged before work?', choices: ['Through a resistor on insulated leads, then checked with a meter', 'By shorting its terminals with a screwdriver', 'By waiting a few seconds', 'It cannot hold charge, so no need'], a: 0, why: 'A resistor limits the current and the spark; a meter confirms the voltage is gone. Shorting it damages terminals and capacitor and can throw molten metal.' },
    { q: 'True or false: the same motor on 115 V needs about four times the capacitance it needs on 230 V.', a: true, why: 'For the same reactive power Q = 2πfCV², halving V needs four times C.' }
  ],
  problems: [
    { q: 'What is the reactance of a 30 µF capacitor at 60 Hz?', answer: 88.4, unit: 'Ω', tol: 0.01, steps: ['$X_C = 1/(2\\pi \\times 60 \\times 30\\times10^{-6}) = 88.4$ Ω.'] },
    { q: 'How much energy does a 40 µF run capacitor hold at 566 V?', answer: 6.4, unit: 'J', tol: 0.02, steps: ['$E = \\tfrac{1}{2} \\times 40\\times10^{-6} \\times 566^2 = 6.4$ J.'] },
    { q: 'A 50 µF capacitor at 400 V is discharged through 10 kΩ. How long until it is below 50 V?', answer: 1.04, unit: 's', tol: 0.02, steps: ['$RC = 10\\,000 \\times 50\\times10^{-6} = 0.5$ s.', '$t = 0.5 \\ln(400/50) = 0.5 \\times 2.079 = 1.04$ s.'] }
  ],
  choose: {
    good: [
      'Film run capacitors with an internal overpressure disconnector (a higher safety class): they fail open rather than bursting.',
      'The nameplate µF and the same or higher voltage rating; a higher life class (A or B) for motors that run all year.'
    ],
    avoid: [
      'Electrolytic capacitors as run capacitors, DC-rated capacitors on AC, and voltage ratings below the original.',
      'Changing the µF to "strengthen" a motor: the design value balances the field at rated load.',
      'Replacing a burst start capacitor without checking the switch or relay that should have removed it.'
    ],
    check: [
      'Capacitance against the label and tolerance (film ±5 %, electrolytic within its printed range).',
      'Signs of distress: domed top, leaks, cracked can, burnt terminals.',
      'That it has been discharged and measured before you touch it.'
    ]
  },
  applications: [
    'Troubleshooting air-conditioning units: dual run capacitors (C, HERM, FAN) are the most frequently replaced part.',
    'Keeping a stock of standard values (5, 10, 16, 20, 25, 30, 40 µF film; common start capacitor ranges) for workshop machines and pumps.',
    'Measuring run capacitors in service with a clamp meter and a voltmeter.'
  ],
  sources: [
    'IEC 60252-1, *AC motor capacitors — Part 1: General — Performance, testing and rating — Safety requirements — Guidance for installation and operation* (classes of operation and safety protection).',
    'IEC 60252-2, *AC motor capacitors — Part 2: Motor start capacitors*.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines — Part 1: General requirements* (discharge of stored energy).',
    'Veinott, *Fractional and Subfractional Horsepower Electric Motors*: selecting capacitors for capacitor motors.'
  ],
  sim: ['sp-captest', { id: 'sp-phasors', params: { mode: 'cap' } }]
},

{
  id: 'steinmetz-connection', parent: 'single-phase-motors', title: 'Running a three-phase motor on one phase', level: 3,
  short: 'The Steinmetz connection feeds a delta-connected 230/400 V three-phase motor from a 230 V single-phase supply, with a capacitor making a rough third phase. Cheap and simple for small fans, pumps and workshop machines up to about 1.5–2.2 kW — but it gives only about 70–80 % of the rated output, low starting torque without a start capacitor, and balanced winding currents at one load only. A single-phase-input VFD does it properly.',
  keywords: ['Steinmetz connection', 'three-phase motor on single phase', 'phase converter', 'capacitor', 'delta connection', 'unbalance', 'negative sequence', 'rotary phase converter', 'single-phase input VFD', 'µF per kW'],
  prereq: ['star-delta-connection', 'capacitor-sizing', 'single-phase-problem'],
  related: ['dual-voltage-motors', 'reversing-three-phase', 'vfd-principle', 'capacitor-start-run', 'motor-protection', 'electronics:three-phase'],
  body: `
A three-phase motor has three windings but only needs a turning field. On a single-phase supply, connect it in **delta** so that each winding would normally see 230 V — that requires a motor marked **230/400 V** (Δ/Y) — then feed two corners of the delta from the supply and the third corner through a **capacitor** from one supply line. The capacitor's leading current makes the voltage at the third corner swing round, so the three winding voltages are spread out in time as well as in space. This trick carries the name of Charles Proteus Steinmetz, the great analyst of AC circuits.

### The connection
| Motor terminal (delta links U1–W2, V1–U2, W1–V2) | Connect to |
|---|---|
| U1 | L (230 V line) |
| V1 | N |
| W1 | capacitor, whose other end goes to U1 for one direction or to V1 for the other |

**Reversing** is done by moving the capacitor's second lead from U1 to V1 (a changeover switch does it). A 400/690 V motor cannot be used this way on 230 V: its windings would get only 230 V instead of 400 V and give about a third of their torque.

### How well it works
For a 1.1 kW, 4-pole, 230/400 V motor (winding current 2.5 A at rated load, power factor 0.77), from the simulation:

| Condition | Result |
|---|---|
| Run capacitor from the 70 µF/kW rule: 77 µF | starting torque only about 20 % of rated |
| Plus a start capacitor of about twice that (150 µF) for the first second | starting torque about 120 % of rated |
| Best capacitor at 75 % load | about 45–50 µF: voltage unbalance about 5 %, winding currents 1.6–2.5 A, none above rated |
| Best capacitor at 100 % load | about 60 µF, but one winding still carries about 3.2 A: it runs hot |
| 77 µF at 75 % load | one winding carries about 3.8 A — half as much again as its rated 2.5 A |
| 77 µF at no load | one winding carries about 4.5 A although the motor does no work |
| Practical continuous output | about 70–80 % of the nameplate power |

The reason is visible in the phasor diagram: a capacitor can balance a motor perfectly only if the motor's power factor angle is 60° (cos φ = 0.5). A real motor at load has cos φ of 0.7–0.85, so the three winding voltages can only be made roughly equal, and only at one load. Split the winding voltages into a balanced forward set and a backward set ([[?rotating-arrow|rotating arrows]] again, as on [[single-phase-problem]]): the backward set is the unbalance, and it heats the rotor and the most loaded winding.

### Choosing the capacitor
Rules of thumb in circulation range from about **50 to 70 µF per kW at 230 V, 50 Hz** (the calculator below uses 70; four times as much at 115 V, about 17 % less at 60 Hz). A short analysis (below) gives the capacitor that balances the windings best at a given load:

$$C = \\frac{\\sqrt{3}\\, I_w \\cos(60^\\circ - \\varphi)}{2\\pi f V}$$

with $I_w$ the winding current and φ the motor's power-factor angle at that load. For the 1.1 kW motor at full load (2.51 A, cos φ = 0.77, φ = 39.6°) it gives 56 µF — about 51 µF/kW. **Too large a capacitor overloads one winding at light load**; too small a one leaves little starting torque. The practical way: start near the rule, then measure the three motor-lead currents (downstream of the capacitor junction) at the real load and choose the capacitor that makes them most equal and all below the rated current. Use a film run capacitor rated at least 400–450 V AC; the start capacitor (electrolytic) needs a centrifugal switch, a current or voltage relay, or a timer to take it out after about a second.

### When not to
- Above about 1.5–2.2 kW the capacitors become large and the unbalance costly.
- Loads that need full torque or frequent starts: hoists, compressors starting against pressure, loaded conveyors.
- Where speed control is wanted: a **VFD with a single-phase 230 V input and a three-phase 230 V output** (common up to 2.2 kW, larger with derating) gives full torque, soft starts, braking and speed control, from the same motor in delta. Rotary phase converters (an idling three-phase motor generating the third phase) serve workshops with several machines.

In the simulation, change the capacitor and the load and watch the three winding currents and the phasor triangle.

> [!warn] This is mains wiring inside a motor terminal box: work only with the supply isolated and locked off, by a qualified electrician, to local rules. Capacitors hold a dangerous charge; discharge and measure them. Protect the motor with an overload set for the highest winding current, or better with winding thermistors, because the line currents do not show which winding is overloaded.

> [!key] A capacitor on the third corner of a delta makes a lopsided three-phase supply: it works for small, lightly loaded motors, balances at one load only, and gives about three-quarters of the rated power. Measure the winding currents; for anything more demanding use a single-phase-input VFD.
`,
  ideas: [
    'A 230/400 V motor in delta can run on 230 V single phase with a capacitor from the third terminal to one line.',
    'A capacitor alone balances the windings exactly only for a motor power factor of 0.5; real motors are balanced roughly, at one load.',
    'Rules of thumb give 50–70 µF per kW at 230 V; the best value depends on the load — too much overloads a winding at light load.',
    'Starting torque is low (about 20 % of rated) unless a start capacitor of about twice the run value is switched in for the start.',
    'Expect 70–80 % of the rated output; reverse by moving the capacitor to the other supply terminal.'
  ],
  pitfalls: [
    'Any three-phase motor can be run this way — Only one whose windings are rated for the single-phase voltage in the connection used (a 230/400 V motor in delta on 230 V).',
    'More capacitance gives more power — It gives more starting torque, but at light load it overloads one winding; the right run capacitor depends on the load.',
    'Equal line currents at the supply mean the motor is balanced — The supply leads carry combinations of winding and capacitor currents; measure the three motor leads after the capacitor junction.'
  ],
  derivation: {
    title: 'The capacitor that balances a delta motor',
    intro: 'Treat the motor as three equal impedances $Z\\angle\\varphi$ in delta, with the supply $V$ across U–V and the capacitor from U to W. Ask what the capacitor must carry for the winding voltages to be a balanced set.',
    steps: [
      { text: 'For a balanced set $V_{VW} = V\\angle{-120°}$, so the third corner sits at $W = V\\angle 60°$ and the capacitor (from U to W) has $U - W = V\\angle{-60°}$ across it, of magnitude V. Its current leads that voltage by 90°:', tex: 'I_C = 2\\pi f C\\,V\\angle 30^\\circ' },
      { text: 'Kirchhoff\'s current law at W: the capacitor must supply the difference of the two winding currents that meet there:', tex: 'I_{WU} - I_{VW} = \\frac{V\\angle 120^\\circ - V\\angle{-120^\\circ}}{Z\\angle\\varphi} = \\sqrt{3}\\, I_w\\angle(90^\\circ - \\varphi)' },
      { text: 'The capacitor current is at 30°; the needed current is at 90° − φ. They line up only when φ = 60°. Otherwise the best the capacitor can do is match the [[?components|component]] of the needed current along its own direction:', tex: '2\\pi f C V = \\sqrt{3}\\, I_w \\cos(60^\\circ - \\varphi)' },
      { text: 'which gives the balancing capacitor. The part of the needed current at right angles to the capacitor current remains as unbalance.', tex: 'C = \\frac{\\sqrt{3}\\, I_w \\cos(60^\\circ - \\varphi)}{2\\pi f V}' }
    ]
  },
  formulas: [
    {
      name: 'Rule-of-thumb run capacitor (70 µF per kW)',
      expr: 'C = k*P*(V0/V)^2*(f0/f)', tex: 'C = k\\,P\\left(\\dfrac{V_0}{V}\\right)^2\\dfrac{f_0}{f}',
      vars: {
        C: { name: 'run capacitance', q: false, unit: 'µF' },
        k: { name: 'capacitance per kW at 230 V, 50 Hz', q: false, unit: 'µF/kW', value: 70, fixed: true },
        P: { name: 'motor rated power', q: false, unit: 'kW', value: 1.1 },
        V0: { name: 'reference voltage', q: false, unit: 'V', value: 230, fixed: true, tex: 'V_0' },
        V: { name: 'single-phase supply voltage', q: false, unit: 'V', value: 230 },
        f0: { name: 'reference frequency', q: false, unit: 'Hz', value: 50, fixed: true, tex: 'f_0' },
        f: { name: 'supply frequency', q: false, unit: 'Hz', value: 50 }
      },
      note: 'A starting value on the generous side; check the winding currents at the real load.',
      stories: { C: 'By the 70 µF/kW rule, what run capacitor would a {P} three-phase motor need on {V}, {f}?' }
    },
    {
      name: 'Capacitor that balances the windings at a given load',
      expr: 'C = sqrt(3)*Iw*cos(pi/3 - phi)/(2*pi*f*V)', tex: 'C = \\dfrac{\\sqrt{3}\\, I_w \\cos(60^\\circ - \\varphi)}{2\\pi f V}',
      vars: {
        C: { name: 'balancing capacitance', q: 'capacitance', unit: 'µF' },
        Iw: { name: 'winding current at that load', q: 'current', unit: 'A', value: 2.51, tex: 'I_w' },
        phi: { name: 'power-factor angle of the motor at that load', q: 'angle', unit: '°', value: 39.6, min: 0, max: 90, tex: '\\varphi' },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 },
        V: { name: 'supply voltage (= winding voltage)', q: 'voltage', unit: 'V', value: 230 }
      },
      note: 'Motor taken as a balanced load; exact balance only when φ = 60°. cos φ = 0.77 is φ = 39.6°.',
      stories: { C: 'A delta motor on {V}, {f} draws {Iw} per winding at a power-factor angle of {phi}. What capacitor balances it best?', Iw: 'A {C} capacitor on {V}, {f}: for what winding current is it the balancing value, at a power-factor angle of {phi}?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the capacitor for a workshop fan',
      q: 'A 0.75 kW, 230/400 V, 4-pole extraction fan motor will run on 230 V, 50 Hz by the Steinmetz connection. At the fan\'s load it draws about 1.8 A per winding at cos φ = 0.75. Compare the rule of thumb with the balancing capacitor.',
      steps: [
        'Rule: $70 \\times 0.75 = 52.5$ µF.',
        'Balance: φ = arccos 0.75 = 41.4°; $C = \\sqrt{3} \\times 1.8 \\times \\cos(18.6°)/(2\\pi \\times 50 \\times 230) = 2.954/72\\,257 = 40.9$ µF.',
        'A fan starts easily (its torque rises with the square of speed), so no start capacitor is needed: choose 40 µF, 450 V AC, and check the three motor-lead currents with a clamp meter.'
      ],
      a: 'About 40 µF at the fan\'s load, against 52 µF by the rule; a fan needs no start capacitor.'
    },
    {
      title: 'Why the rule can overload a winding',
      q: 'The 1.1 kW motor above runs at 75 % load with the rule-of-thumb 77 µF, where the best value is about 50 µF. The simulation shows winding currents of about 1.1, 3.8 and 2.8 A. What does that mean for the motor?',
      steps: [
        'Rated winding current is 2.5 A; one winding carries 3.8 A, 1.53 times rated.',
        'Copper loss goes as the square: $1.53^2 = 2.3$ times the rated loss in that winding.',
        'It will overheat even though the motor delivers only 75 % of its power. With 50 µF the currents are about 2.2, 2.5 and 1.6 A — none above rated.'
      ],
      a: 'One winding runs at about 1.5 × its rated current: choose the capacitor for the load, not the rule.'
    }
  ],
  quiz: [
    { q: 'Which motor can be run on 230 V single phase with the Steinmetz connection?', choices: ['A 230/400 V motor connected in delta', 'A 400/690 V motor connected in delta', 'A 230/400 V motor connected in star', 'Any three-phase motor'], a: 0, why: 'Each winding must see its rated 230 V; in delta on 230 V a 230/400 V motor does. A 400/690 V motor would be at 58 % voltage (about a third of its torque).' },
    { q: 'How is a Steinmetz-connected motor reversed?', choices: ['Move the capacitor\'s free end from one supply terminal to the other', 'Swap L and N', 'Change from delta to star', 'Reverse the capacitor'], a: 0, why: 'Which corner the capacitor leads from sets the phase sequence and hence the direction. Swapping L and N reverses all voltages together and changes nothing.' },
    { q: 'Why can a run capacitor alone not balance a typical motor perfectly?', choices: ['Perfect balance needs the motor\'s power-factor angle to be 60°, and real motors run at about 30–45°', 'Capacitors cannot carry enough current', 'The supply frequency is wrong', 'The delta links prevent it'], a: 0, why: 'The capacitor current is fixed at 30° to the supply; the current it must supply is at 90° − φ. They align only for φ = 60°.' },
    { q: 'A motor on the Steinmetz connection hums at switch-on and will not start a loaded conveyor. The first thing to add is…', choices: ['a start capacitor (about twice the run value) switched out after about a second', 'a larger run capacitor left permanently', 'a star connection', 'a lower-voltage capacitor'], a: 0, why: 'The run capacitor gives only about 20 % of rated starting torque; a temporary start capacitor raises it to around rated torque without overloading a winding while running.' },
    { q: 'True or false: with the Steinmetz connection a motor can deliver its full nameplate power continuously.', a: false, why: 'Unbalance heats one winding and the rotor; about 70–80 % of rated power is the practical limit.' }
  ],
  problems: [
    { q: 'By the 70 µF/kW rule, what run capacitor does a 1.5 kW motor need on 230 V, 50 Hz?', answer: 105, unit: 'µF', tol: 0.01, steps: ['$70 \\times 1.5 = 105$ µF.'] },
    { q: 'A delta motor on 230 V, 50 Hz draws 3.4 A per winding at cos φ = 0.8 (φ = 36.9°). What capacitor balances it best?', answer: 75, unit: 'µF', tol: 0.02, steps: ['$\\cos(60° - 36.9°) = \\cos 23.1° = 0.920$.', '$C = \\sqrt{3} \\times 3.4 \\times 0.920/(2\\pi \\times 50 \\times 230) = 5.418/72\\,257 = 75$ µF.'] }
  ],
  choose: {
    good: [
      'Small fans, pumps, grinders and workshop machines up to about 1.5 kW (2.2 kW at most) on a single-phase supply.',
      'Easy starts and steady loads at up to about three-quarters of the motor\'s rating.',
      'Keeping an existing three-phase motor when no three-phase supply exists and speed control is not needed.'
    ],
    avoid: [
      'Motors above about 2.2 kW, hard starts, hoists and frequent starting.',
      'Motors not rated for the single-phase voltage in delta (400/690 V motors on 230 V).',
      'Applications needing speed control or full power: use a single-phase-input VFD (full torque, soft start, braking) or a rotary phase converter.'
    ],
    check: [
      'The nameplate: 230/400 V, connected in delta.',
      'The three motor-lead currents at the real load, all below the rated current; choose the capacitor that makes them most equal.',
      'Capacitor ratings (film, at least 400–450 V AC), a start capacitor with its switch or relay if the load needs torque, and overload or thermistor protection.'
    ]
  },
  applications: [
    'Farm and workshop machines bought second-hand with three-phase motors, used on a house supply.',
    'Small circulation pumps and extraction fans with three-phase motors in single-phase buildings.',
    'Replacing the Steinmetz connection with a single-phase-input VFD when a machine needs its full power or variable speed.'
  ],
  history: 'Charles Proteus Steinmetz (1865–1923), engineer at General Electric, developed the use of complex numbers (phasors) for AC circuit calculations in the 1890s; the capacitor connection that bears his name follows directly from that phasor thinking.',
  sources: [
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: symmetrical components and unbalanced operation of induction motors.',
    'Chapman, *Electric Machinery Fundamentals*: induction motors, unbalanced supply and single-phase operation.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation* (U1, V1, W1, U2, V2, W2 and the delta links).',
    'IEC 60252-1, *AC motor capacitors — Part 1* (run capacitors).'
  ],
  sim: 'sp-steinmetz'
},

{
  id: 'hazardous-areas', parent: 'comparisons', title: 'Motors in explosive atmospheres', level: 2,
  short: 'Where flammable gas, vapour or dust can form an explosive atmosphere, a motor must not ignite it — by a spark, a hot surface or an internal explosion. Areas are divided into zones by how often the atmosphere is present; motors are certified to protection types (Ex d, Ex e, Ex p, Ex ec, Ex tb …), gas or dust groups and temperature classes, under schemes such as ATEX and IECEx. A descriptive overview, not a certification guide.',
  keywords: ['explosive atmosphere', 'hazardous area', 'ATEX', 'IECEx', 'zone 0', 'zone 1', 'zone 2', 'zone 21', 'Ex d', 'flameproof', 'Ex e', 'increased safety', 'Ex ec', 'Ex p', 'Ex tb', 'temperature class', 'T4', 'gas group IIC', 'EPL', 'tE time', 'Class I Division 1'],
  prereq: ['ip-cooling', 'motor-heating', 'motor-standards'],
  related: ['motor-protection', 'vfd-wiring-emc', 'air-motor-applications', 'bearing-failures', 'motor-comparison', 'pneumatics:air-motors', 'insulation-classes'],
  body: `
An explosion needs a fuel mixed with air in the right proportion and an ignition source. In refineries, chemical and paint plants, fuel depots, sewage works, grain silos and flour mills the fuel can be present, so ignition sources must be kept out. A motor offers several: **sparks** (contacts, brushes, a rotor rubbing the stator after a bearing fails, broken rotor bars arcing) and **hot surfaces** (frame, bearings, a stalled rotor). Dust adds a trap: a layer on a motor insulates it and can smoulder far below the dust cloud's ignition temperature.

### Zones: how often the atmosphere is there
The plant owner classifies the areas (IEC 60079-10-1 for gas, IEC 60079-10-2 for dust); the equipment then has to suit the zone.

| Gas / vapour | Dust | Explosive atmosphere present… | Typical place |
|---|---|---|---|
| Zone 0 | Zone 20 | continuously, for long periods or frequently | inside a tank above the liquid; inside a silo or dust collector |
| Zone 1 | Zone 21 | likely occasionally in normal operation | round a tank vent, a filling point, a sampling point |
| Zone 2 | Zone 22 | not likely in normal operation, and then only briefly | round pump seals, flanges and valves; beyond zone 1 |

A common rule of thumb in industry guidance links them to hours a year — more than about 1000 h for zone 0, 10–1000 h for zone 1, under 10 h for zone 2 — but the classification is an engineering assessment of each source of release and its ventilation. North America also uses the older Class/Division system (NEC Article 500: Class I gases, Class II dusts, Division 1 and 2) alongside zones (Article 505).

### Protection levels, categories and the protection types for motors
| Zone | Equipment protection level (IEC) | ATEX category | Motor protection types used |
|---|---|---|---|
| 0 | Ga | 1G | none in practice — motors are kept out of zone 0 |
| 1 | Gb | 2G | Ex db (flameproof), Ex eb (increased safety), Ex pxb (pressurised) |
| 2 | Gc | 3G | Ex ec (non-sparking; formerly Ex nA), or any Gb motor |
| 21 | Db | 2D | Ex tb (protection by enclosure, IP6X) |
| 22 | Dc | 3D | Ex tc (IP5X for non-conductive dust, IP6X for conductive), or any Db motor |

- **Ex d, flameproof enclosure**: the gas may get in; if it ignites, the enclosure contains the explosion and its joints (flame paths) are long and tight enough to cool the escaping gas. Heavy cast frames; flame paths must not be damaged, painted or gasketed unless the certificate allows; covers need all their bolts.
- **Ex e, increased safety**: no sparks or hot spots in normal service, extra creepage and clearance distances, secure terminals — and a limit on how hot the rotor or winding may get when stalled, the **time tE** (see below).
- **Ex p, pressurised**: the enclosure is purged, then kept above the surrounding pressure with clean air or inert gas; common on very large motors.
- **Ex ec, non-sparking**: for zone 2, a good industrial motor with checked clearances and temperatures.
- **Ex tb / tc**: tight enclosures that keep dust out, and a marked maximum surface temperature in °C.
- **Ex i, intrinsic safety**: energy too low to ignite anything — for encoders, sensors and switches, not for motors.

### Gas groups and temperature classes
| Group | Typical gases (for illustration) | Covers |
|---|---|---|
| IIA | propane, methane (surface industry), petrol vapour | IIA |
| IIB | ethylene, diethyl ether | IIA, IIB |
| IIC | hydrogen, acetylene | IIA, IIB, IIC |
| IIIA / IIIB / IIIC | combustible fibres / non-conductive dust / conductive dust | IIIC covers all three |

| Temperature class | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| Hottest surface at most | 450 °C | 300 °C | 200 °C | 135 °C | 100 °C | 85 °C |

The equipment's temperature class must be below the gas's auto-ignition temperature: hydrogen (about 560 °C) allows T1, petrol (about 250–280 °C) needs T3, diethyl ether (about 160–180 °C) T4. For dust the marked surface temperature must stay below two-thirds of the cloud's ignition temperature and 75 K below the ignition temperature of a 5 mm layer (thicker layers need more margin). Standard Ex equipment is assessed for ambients of −20 to +40 °C; other ranges are marked.

A typical marking reads **Ex db eb IIC T4 Gb**: a flameproof motor with an increased-safety terminal box, for all gas groups, surfaces below 135 °C, suitable for zone 1. Under ATEX the same motor also carries the Ex hexagon with **II 2 G**.

### The tE time of an Ex e motor
If an Ex e motor stalls, its rotor and winding heat quickly. The certificate states **tE**, the time from the rated running temperature to the limiting temperature at locked-rotor current, and the ratio $I_A/I_N$. The overload protection must trip, at that current ratio, **within tE**; the simulation's stall test shows it. That is why Ex e motors come with relays and settings stated on the certificate, and why their protection is part of the certification.

### Drives, maintenance and repair
- On a VFD, surface temperatures, bearing currents and voltage peaks change: the motor must be certified for converter supply (often with PTC thermistors and conditions on the drive), and the drive sits outside the zone or in an Ex enclosure.
- Inspection (IEC 60079-17), repair by competent workshops (IEC 60079-19), certified glands, earthing, no modifications. A failed bearing is both a spark and a hot spot.
- Where electricity is unwelcome, [[air-motor-applications|air motors]] and hydraulic motors often serve zone 1.

In the simulation, drag the motor round the plant and see which markings are acceptable where; then stall an Ex e motor and time its protection.

> [!warn] This page explains concepts only. Area classification, equipment selection, installation, inspection and repair in hazardous areas are regulated and must be done by competent persons to the applicable standards (IEC 60079 series), directives (ATEX 2014/34/EU and 1999/92/EC) or codes (NEC) and the equipment's certificate. Never open, modify or repair Ex equipment in a hazardous area unless the area is made safe and the work is permitted.

> [!key] Zones say how often the atmosphere is there; EPL, group and temperature class say what the equipment can safely meet. A motor is suitable only if all three fit: zone → protection level, gas or dust → group, ignition temperature → temperature class.
`,
  ideas: [
    'Areas are zoned by how often an explosive atmosphere is present: zones 0/1/2 for gas, 20/21/22 for dust.',
    'Each zone needs an equipment protection level (Ga/Gb/Gc, Da/Db/Dc) — for motors usually Gb in zone 1, Gc in zone 2.',
    'Motor protection types: flameproof (Ex d), increased safety (Ex e), pressurised (Ex p), non-sparking (Ex ec), dust enclosure (Ex t).',
    'The temperature class (T1 450 °C … T6 85 °C) must be below the gas\'s auto-ignition temperature; IIC equipment covers IIB and IIA.',
    'Ex e motors have a stall time tE; their overload protection must trip within it.'
  ],
  pitfalls: [
    'An IP66 motor is fine in a dust or gas zone — Ingress protection keeps dust and water out but is not an Ex certification: no temperature class, no spark assessment.',
    'Any Ex motor can run on any VFD — Converter supply changes surface temperatures and bearing currents; it must be covered by the certificate (often with specific protection).',
    'A higher temperature class number means a hotter motor — The reverse: T6 (85 °C) is the coolest, T1 (450 °C) the hottest allowed surface.'
  ],
  formulas: [
    {
      name: 'Surface temperature in a hot ambient',
      expr: 'Ts = Ta + dT', tex: 'T_s = T_a + \\Delta T',
      vars: {
        Ts: { name: 'hottest surface temperature', q: false, unit: '°C', tex: 'T_s' },
        Ta: { name: 'ambient temperature', q: false, unit: '°C', value: 40, tex: 'T_a' },
        dT: { name: 'temperature rise of that surface at full load', q: false, unit: 'K', value: 80, tex: '\\Delta T' }
      },
      note: 'Certificates assume −20 to +40 °C unless another range is marked: a hotter ambient raises every surface temperature.',
      stories: { Ts: 'A motor surface rises {dT} above an ambient of {Ta}. How hot does it get?', Ta: 'A surface rises {dT} at full load and may not exceed {Ts}. What is the highest ambient allowed?' }
    },
    {
      name: 'Surface limit for a dust cloud',
      expr: 'Tmax = 2/3*Tcl', tex: 'T_{\\max} = \\tfrac{2}{3}\\,T_{cl}',
      vars: {
        Tmax: { name: 'highest allowed surface temperature', q: false, unit: '°C', tex: 'T_{\\max}' },
        Tcl: { name: 'minimum ignition temperature of the dust cloud', q: false, unit: '°C', value: 420, tex: 'T_{cl}' }
      },
      stories: { Tmax: 'A dust cloud ignites at {Tcl}. How hot may a motor surface in it get?' }
    },
    {
      name: 'Surface limit for a 5 mm dust layer',
      expr: 'Tmax = Tl - 75', tex: 'T_{\\max} = T_{l} - 75',
      vars: {
        Tmax: { name: 'highest allowed surface temperature', q: false, unit: '°C', tex: 'T_{\\max}' },
        Tl: { name: 'ignition temperature of a 5 mm dust layer', q: false, unit: '°C', value: 300, tex: 'T_{l}' }
      },
      note: 'For layers up to 5 mm; the lower of the cloud and layer limits applies, and thicker layers need a larger margin.',
      stories: { Tmax: 'A 5 mm layer of a dust smoulders at {Tl}. How hot may a motor surface under it get?' }
    },
    {
      name: 'The tE time of a stalled Ex e motor',
      expr: 'tE = (Tlim - Tr)/r', tex: 't_E = \\dfrac{T_{\\max} - T_r}{r}',
      vars: {
        tE: { name: 'time to reach the limiting temperature', q: 'time', unit: 's', tex: 't_E' },
        Tlim: { name: 'limiting temperature (lower of temperature class and insulation limit)', q: false, unit: '°C', value: 200, tex: 'T_{\\max}' },
        Tr: { name: 'temperature at rated load', q: false, unit: '°C', value: 140, tex: 'T_r' },
        r: { name: 'heating rate with the rotor locked', q: false, unit: 'K/s', value: 7 }
      },
      note: 'A constant heating rate, as the adiabatic locked-rotor heating nearly is for the first seconds. The overload must trip within tE at the locked-rotor current.',
      stories: { tE: 'A stalled rotor heats at {r} from {Tr} towards a limit of {Tlim}. How long is tE?', r: 'A motor with tE = {tE} runs at {Tr} with a limit of {Tlim}. How fast does it heat when stalled?' }
    }
  ],
  examples: [
    {
      title: 'Which motor for a solvent pump?',
      q: 'A pump transferring a solvent with an auto-ignition temperature of about 180 °C (gas group IIB) stands in zone 1. Which of these markings is acceptable: Ex ec IIC T3 Gc; Ex eb IIC T3 Gb; Ex db IIB T4 Gb?',
      steps: [
        'Zone 1 needs EPL Gb (or Ga): Ex ec … Gc is only for zone 2 — rejected.',
        'The temperature class must be below 180 °C: T3 (200 °C) is too hot — Ex eb IIC T3 Gb rejected despite its protection level and group.',
        'Ex db IIB T4 Gb: Gb suits zone 1, IIB covers the gas, T4 (135 °C) is below 180 °C — acceptable.'
      ],
      a: 'Only the Ex db IIB T4 Gb motor.'
    },
    {
      title: 'A motor in a flour mill',
      q: 'A flour dust has a cloud ignition temperature of about 420 °C and a 5 mm layer ignition temperature of about 300 °C. What is the highest surface temperature allowed for a motor in zone 21, and is an Ex tb IIIC T135 °C Db motor suitable?',
      steps: [
        'Cloud: $\\tfrac{2}{3} \\times 420 = 280$ °C.',
        'Layer (up to 5 mm): $300 - 75 = 225$ °C.',
        'The lower value, 225 °C, applies. The motor\'s 135 °C is below it; Db suits zone 21 and IIIC covers non-conductive flour dust (IIIB).',
        'Keep layers thin by cleaning: thicker layers insulate the motor and reduce the allowed temperature.'
      ],
      a: 'At most 225 °C; the T135 °C Db motor is suitable (with good housekeeping).'
    }
  ],
  quiz: [
    { q: 'A zone 1 area is one where an explosive gas atmosphere…', choices: ['is likely to occur occasionally in normal operation', 'is present continuously', 'is not likely in normal operation and brief if it occurs', 'never occurs'], a: 0, why: 'Zone 0: continuously or often; zone 1: occasionally in normal operation; zone 2: not in normal operation, and briefly.' },
    { q: 'Hydrogen is in gas group IIC. Which equipment group is acceptable?', choices: ['IIC only', 'IIA, IIB or IIC', 'IIB or IIC', 'Any group'], a: 0, why: 'IIC is the most demanding group; IIC equipment covers IIB and IIA, but not the other way round.' },
    { q: 'A gas has an auto-ignition temperature of 240 °C. The hottest temperature class you may not use is…', choices: ['T2 (300 °C)', 'T3 (200 °C)', 'T4 (135 °C)', 'T6 (85 °C)'], a: 0, why: 'The equipment\'s maximum surface temperature must be below 240 °C: T3 and cooler are fine, T2 (up to 300 °C) is not.' },
    { q: 'What does the tE time of an Ex e motor tell you?', choices: ['How long the stalled motor takes to reach its limiting temperature — the protection must trip sooner', 'How long the motor takes to start', 'How long an internal explosion lasts', 'The time between inspections'], a: 0, why: 'tE is from rated temperature to the limiting temperature at locked-rotor current; the relay\'s trip time at IA/IN must be shorter.' },
    { q: 'True or false: an Ex db (flameproof) motor keeps gas out of its enclosure.', a: false, why: 'Gas may enter; the enclosure withstands an internal explosion and its flame paths stop the flame reaching the outside.' }
  ],
  problems: [
    { q: 'A dust cloud ignites at 450 °C and a 5 mm layer of it at 290 °C. What is the highest allowed motor surface temperature?', answer: 215, unit: '°C', tol: 0.01, steps: ['Cloud: $\\tfrac{2}{3} \\times 450 = 300$ °C.', 'Layer: $290 - 75 = 215$ °C.', 'The lower applies: 215 °C.'] },
    { q: 'A stalled Ex e motor heats at 8 K/s from 130 °C with a limiting temperature of 200 °C. What is tE?', answer: 8.75, unit: 's', tol: 0.02, steps: ['$t_E = (200 - 130)/8 = 8.75$ s.'] }
  ],
  choose: {
    good: [
      'Zone 2 pumps and fans: Ex ec motors — close to standard motors in size and price.',
      'Zone 1: Ex db (flameproof) motors for the widest range of gases and drives; Ex eb for lighter, cheaper motors where their protection conditions can be met.',
      'Very large motors: pressurised (Ex p). Zone 21/22 dust: Ex tb/tc with the right surface temperature.',
      'Where no electrical equipment is wanted at all: air or hydraulic motors.'
    ],
    avoid: [
      'Any motor in zone 0 (relocate it, or drive through a wall with a sealed shaft).',
      'Non-certified motors, however well sealed (IP ratings are not Ex ratings).',
      'VFD operation not covered by the motor\'s certificate.'
    ],
    check: [
      'Zone → EPL (and ATEX category); gas or dust group; temperature class against the auto-ignition or dust limits; ambient range.',
      'The certificate\'s special conditions ("X" after the certificate number): protection relays, tE and IA/IN, thermistors, drive.',
      'Cable glands, earthing, inspection regime and who may repair it.'
    ]
  },
  applications: [
    'Pumps and agitators in refineries, chemical and paint plants (zones 1 and 2, groups IIA–IIC).',
    'Fans and conveyors in grain handling, flour and sugar mills (zones 21 and 22).',
    'Offshore and mining equipment (group I is reserved for mines susceptible to firedamp).'
  ],
  sources: [
    'IEC 60079-0, *Explosive atmospheres — Part 0: Equipment — General requirements*; IEC 60079-1 (flameproof "d"), IEC 60079-7 (increased safety "e"), IEC 60079-2 (pressurised "p"), IEC 60079-31 (dust protection by enclosure "t").',
    'IEC 60079-10-1 and IEC 60079-10-2, classification of areas for gas and for combustible dust; IEC 60079-14 (design, selection and erection of electrical installations), IEC 60079-17 (inspection and maintenance), IEC 60079-19 (repair).',
    'Directive 2014/34/EU (ATEX equipment) and Directive 1999/92/EC (safety of workers in explosive atmospheres); the IECEx certification scheme.',
    'NFPA 70, *National Electrical Code*, Articles 500 and 505 (Class/Division and Zone systems in North America).'
  ],
  sim: 'sp-exzones'
},

{
  id: 'motor-life-cost', parent: 'comparisons', title: 'The life-cycle cost of a motor', level: 2,
  short: 'For a motor that runs thousands of hours a year, the electricity it uses over its life costs tens of times its purchase price. A more efficient motor, or a VFD on a variable-flow fan or pump, usually pays back in a few years; for a motor that runs rarely, the purchase price matters more. How to work out annual energy cost, payback and a discounted life-cycle cost.',
  keywords: ['life-cycle cost', 'LCC', 'total cost of ownership', 'energy cost', 'payback', 'IE3', 'IE4', 'IE5', 'premium efficiency', 'VFD savings', 'present value', 'discount rate', 'oversizing', 'rewind', 'Ecodesign'],
  prereq: ['efficiency-classes', 'efficiency-losses', 'vfd-energy-saving'],
  related: ['motors-pumps-fans', 'motor-selection-method', 'capacitor-start-run', 'shaded-pole-motor', 'finance:npv', 'finance:present-value', 'motor-comparison'],
  body: `
A motor's price is paid once; its electricity is paid every hour it runs. For an 11 kW motor running 6000 hours a year at three-quarters load, at an illustrative ¤0.15 per kWh, the energy costs about ¤8,000 **a year** — while the motor itself may cost around ¤1,000. Over 15 years the energy is more than 95 % of everything spent on it. That changes how a motor should be chosen.

### Where the money goes
| Over the motor's life | Motor running a few hundred hours a year | Motor running 4000–8000 hours a year |
|---|---|---|
| Purchase and installation | a large share | typically 1–5 % |
| Maintenance (bearings, inspection, occasional rewind) | a few per cent | 1–5 % |
| Energy | the rest | typically 90–98 % |

### Annual energy cost
$$C_E = \\frac{P\\,h\\,c}{\\eta}$$

with $P$ the shaft power actually delivered (not the nameplate power), $h$ hours a year, $c$ the price per kWh and $\\eta$ the efficiency at that load. For the 11 kW motor at 8.25 kW, 6000 h and ¤0.15/kWh: IE2 (89.8 %) ¤8,270 a year; IE3 (91.4 %) ¤8,120; IE4 (93.3 %) ¤7,960 — typical minimum efficiencies of 4-pole 50 Hz motors.

### Payback of a better motor
The saving of the better motor is $P h c(1/\\eta_1 - 1/\\eta_2)$ a year; its extra price divided by that is the simple **payback**:

$$t_p = \\frac{\\Delta C}{P\\,h\\,c\\left(\\frac{1}{\\eta_1} - \\frac{1}{\\eta_2}\\right)}$$

IE3 → IE4 on the 11 kW motor saves about ¤165 a year; a price premium of ¤300 pays back in 1.8 years, and the motor lives 15–20 years. At 1000 hours a year the payback is six times longer — for rarely used motors a cheaper class can be the right choice where regulations allow. Many countries now set minimum classes: in the EU, the Ecodesign regulation (EU) 2019/1781 has required IE3 for most 0.75–1000 kW motors since July 2021 and IE4 for 75–200 kW since July 2023; in the US, federal rules have required NEMA Premium (about IE3) for most general-purpose motors since 2016.

### Money now against money later
Spread over many years, future savings are worth less than money today. With a discount rate $r$, a steady yearly cost $C_E$ for $N$ years is worth today $C_E\\,[1 - (1+r)^{-N}]/r$ — the sum of a [[?geometric-series|geometric series]] (see [[finance:present-value]] and [[finance:npv]]). The life-cycle cost is then

$$\\mathrm{LCC} = C_p + C_E\\,\\frac{1 - (1+r)^{-N}}{r}$$

At 5 % over 15 years the factor is 10.4, so the 11 kW IE3 motor's LCC is about ¤1,000 + 10.4 × ¤8,120 ≈ ¤85,000.

### The biggest savings are not in the motor
- **Speed control on variable-flow fans and pumps.** A fan or pump throttled by a valve or damper still draws most of its full power; on a VFD its power falls roughly with the cube of the flow: at 80 % flow, about half the power. The drive costs more than the motor but often pays back within one to three years. See [[vfd-energy-saving]].
- **Right-sizing.** Motors are often chosen one or two sizes too big "to be safe" and run at 30–50 % load, where both efficiency and power factor are lower. Size from the real load ([[motor-selection-method]]).
- **The whole system.** Belt drives (V-belts lose a few per cent more than synchronous belts), gearboxes, oversized pumps, leaking compressed air: the driven machine often wastes more than the motor.
- **Small motors.** A shaded-pole fan motor at 20 % efficiency against an EC fan at 70 % pays back quickly when it runs all year ([[shaded-pole-motor]]); a capacitor-start-run motor saves 10–15 % over a capacitor-start motor ([[capacitor-start-run]]).
- **Rewind or replace?** A careful rewind keeps close to the original efficiency; a poor one (overheating the core when stripping the old winding) can cost a point or two. For long-running motors below some tens of kW, replacing a failed old motor with a higher class often beats rewinding.

In the simulation, choose a motor size, hours and price, and watch the cumulative cost lines cross — the crossing is the payback.

> [!tip] Measure before you decide: a clamp-on power meter (or the VFD's own power read-out) over a typical week gives the real load and hours, and usually shows that the motor runs far from its nameplate power.

> [!key] For long-running motors, energy is almost the whole cost. Choose the efficiency class by hours × kW × price, put VFDs on variable-flow fans and pumps, size motors to their real load — and use payback and discounted life-cycle cost to compare.
`,
  ideas: [
    'For a motor running thousands of hours a year, energy is typically 90–98 % of its life-cycle cost.',
    'Annual energy cost = shaft power × hours × price ÷ efficiency, at the real load.',
    'The payback of a higher efficiency class is the price premium divided by P·h·c·(1/η₁ − 1/η₂); usually one to three years for long-running motors.',
    'A discounted life-cycle cost weighs future energy with the factor [1 − (1 + r)^−N]/r.',
    'The largest savings often come from speed control on fans and pumps and from right-sizing, not from the motor class alone.'
  ],
  pitfalls: [
    'The cheapest motor is the most economical — For long running hours a few points of efficiency are worth many times the price difference.',
    'Efficiency classes are compared at nameplate power — Use the efficiency and power at the real load; an oversized motor at 40 % load is less efficient than its class suggests.',
    'A more efficient motor always saves a lot — At a few hundred hours a year the saving may take decades to repay the premium; hours matter most.'
  ],
  formulas: [
    {
      name: 'Annual energy cost',
      expr: 'Ce = P*h*c/eta', tex: 'C_E = \\dfrac{P\\,h\\,c}{\\eta}',
      vars: {
        Ce: { name: 'energy cost per year', q: 'money', unit: '$', tex: 'C_E' },
        P: { name: 'shaft power delivered', q: false, unit: 'kW', value: 8.25 },
        h: { name: 'running hours per year', q: false, unit: 'h/yr', value: 6000 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15 },
        eta: { name: 'motor efficiency at that load', q: 'ratio', unit: '%', value: 91.4, tex: '\\eta' }
      },
      stories: { Ce: 'A motor delivers {P} for {h} at {eta} efficiency, with electricity at {c} per kWh. What does its energy cost a year?', h: 'A motor delivering {P} at {eta} costs {Ce} a year at {c} per kWh. How many hours does it run?' }
    },
    {
      name: 'Simple payback of a more efficient motor',
      expr: 'tp = dC/(P*h*c*(1/eta1 - 1/eta2))', tex: 't_p = \\dfrac{\\Delta C}{P\\,h\\,c\\left(\\dfrac{1}{\\eta_1} - \\dfrac{1}{\\eta_2}\\right)}',
      vars: {
        tp: { name: 'payback time', q: 'years', unit: 'yr', tex: 't_p' },
        dC: { name: 'extra purchase price', q: 'money', unit: '$', value: 300, tex: '\\Delta C' },
        P: { name: 'shaft power delivered', q: false, unit: 'kW', value: 8.25 },
        h: { name: 'running hours per year', q: false, unit: 'h/yr', value: 6000 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15 },
        eta1: { name: 'efficiency of the cheaper motor', q: 'ratio', unit: '%', value: 91.4, tex: '\\eta_1' },
        eta2: { name: 'efficiency of the better motor', q: 'ratio', unit: '%', value: 93.3, tex: '\\eta_2' }
      },
      stories: { tp: 'An IE4 motor at {eta2} costs {dC} more than an IE3 at {eta1}. It delivers {P} for {h} at {c} per kWh. How soon does it pay back?', dC: 'What extra price for a {eta2} motor instead of a {eta1} one pays back in {tp}, at {P}, {h} and {c} per kWh?' }
    },
    {
      name: 'Life-cycle cost with discounting',
      expr: 'L = Cp + Ce*(1 - (1 + r)^(-N))/r', tex: '\\mathrm{LCC} = C_p + C_E\\,\\dfrac{1 - (1 + r)^{-N}}{r}',
      vars: {
        L: { name: 'life-cycle cost (present value)', q: 'money', unit: '$', tex: '\\mathrm{LCC}' },
        Cp: { name: 'purchase and installation', q: 'money', unit: '$', value: 1000, tex: 'C_p' },
        Ce: { name: 'energy (and running) cost per year', q: 'money', unit: '$', value: 8124, tex: 'C_E' },
        r: { name: 'discount rate', q: 'ratio', unit: '%', value: 5, min: 0.1, max: 30 },
        N: { name: 'years of service', q: 'years', unit: 'yr', value: 15 }
      },
      stories: { L: 'A motor costs {Cp} to buy and install and {Ce} a year to run, for {N}. At a discount rate of {r}, what is its life-cycle cost?' }
    },
    {
      name: 'Fan or pump power on a VFD at reduced flow',
      expr: 'P = Pn*x^3/etad', tex: 'P = \\dfrac{P_n\\,x^3}{\\eta_d}',
      vars: {
        P: { name: 'electrical input at reduced flow', q: 'power', unit: 'kW' },
        Pn: { name: 'input at full flow (on the mains)', q: 'power', unit: 'kW', value: 11 },
        x: { name: 'flow as a fraction of full flow', q: 'ratio', unit: '%', value: 80, min: 1, max: 100 },
        etad: { name: 'drive efficiency', q: 'ratio', unit: '%', value: 97, tex: '\\eta_d' }
      },
      note: 'The cube law holds for fans and pumps without static head; with a static head (lifting water, overcoming back-pressure) the saving is smaller.',
      stories: { P: 'A fan takes {Pn} at full flow. On a VFD at {x} flow, with a drive efficiency of {etad}, what does it take?' }
    }
  ],
  examples: [
    {
      title: 'IE3 or IE4 for a pump that runs all year?',
      q: 'An 11 kW pump motor delivers 8.25 kW for 6000 h a year at ¤0.15/kWh. IE3 is 91.4 % efficient, IE4 93.3 %, and the IE4 motor costs ¤300 more. Find the yearly saving, the payback and the 15-year saving at a 5 % discount rate.',
      steps: [
        'Energy cost, IE3: $8.25 \\times 6000 \\times 0.15/0.914 = ¤8{,}124$; IE4: $¤7{,}958$.',
        'Saving: ¤166 a year; payback $300/166 = 1.8$ years.',
        'Present value of 15 years of savings: $166 \\times [1 - 1.05^{-15}]/0.05 = 166 \\times 10.38 = ¤1{,}720$ — for a ¤300 premium.'
      ],
      a: 'About ¤166 a year, 1.8-year payback, and a net present gain of about ¤1,400.'
    },
    {
      title: 'Throttle or VFD?',
      q: 'The same 11 kW pump runs 6000 h a year at 80 % flow on average. Throttled by a valve it takes about 9.9 kW (90 % of its 11 kW full-flow input). On a VFD (97 % efficient) with no static head, estimate the input and the yearly saving at ¤0.15/kWh.',
      steps: [
        'VFD: $P = 11 \\times 0.8^3/0.97 = 5.8$ kW.',
        'Saving: $(9.9 - 5.8) \\times 6000 = 24{,}600$ kWh a year, about ¤3,700.',
        'A drive of this size typically costs well under a year of that saving; with a large static head the saving would be much smaller — calculate it with the real system curve.'
      ],
      a: 'About 5.8 kW instead of 9.9 kW — some ¤3,700 a year.'
    }
  ],
  quiz: [
    { q: 'For a 15 kW motor running 7000 hours a year, which is usually the largest part of its life-cycle cost?', choices: ['Energy', 'Purchase price', 'Installation', 'Maintenance'], a: 0, why: 'At thousands of hours a year the energy costs tens of times the purchase price over the motor\'s life.' },
    { q: 'An IE4 motor pays back in 2 years at 6000 h a year. At 1500 h a year it pays back in about…', choices: ['8 years', '2 years', '0.5 years', '4 years'], a: 0, why: 'The saving is proportional to the hours: a quarter of the hours, four times the payback.' },
    { q: 'Why can a VFD on a pump save more than a better motor class?', choices: ['Pump power falls roughly with the cube of the flow, so reducing speed instead of throttling saves a large fraction of the input', 'VFDs make motors more efficient at full load', 'VFDs improve the power factor to 1', 'VFDs remove all losses'], a: 0, why: 'A better class saves a few per cent of the input; reducing speed at 80 % flow can save around 40 %.' },
    { q: 'A motor is oversized and runs at 35 % of its rating. What happens to its efficiency and power factor?', choices: ['Both are lower than at rated load', 'Both are higher', 'Efficiency higher, power factor lower', 'No change'], a: 0, why: 'Fixed losses (iron, friction) weigh more at light load, and the magnetising current stays while the working current shrinks.' },
    { q: 'True or false: with a discount rate of 0 %, the life-cycle cost is the purchase price plus the yearly energy cost times the number of years.', a: true, why: 'As r → 0 the factor [1 − (1 + r)^−N]/r tends to N.' }
  ],
  problems: [
    { q: 'A 7.5 kW motor delivers 6 kW for 4000 h a year at 90.4 % efficiency, with electricity at ¤0.20/kWh. What does its energy cost a year (in your currency units)?', answer: 5310, tol: 0.01, steps: ['$6 \\times 4000 \\times 0.20/0.904 = 5310$.'] },
    { q: 'A motor saving ¤240 a year costs ¤420 more than the alternative. What is its simple payback in years?', answer: 1.75, unit: 'yr', tol: 0.01, steps: ['$420/240 = 1.75$ years.'] }
  ],
  choose: {
    good: [
      'IE3 or better (IE4, IE5) for motors running more than about 2000–3000 hours a year.',
      'VFDs on fans, pumps and compressors whose flow varies.',
      'EC (brushless) fans instead of shaded-pole or PSC fans that run all year.'
    ],
    avoid: [
      'Oversized motors "for safety" that run at 30–50 % load.',
      'Choosing on purchase price alone for continuous duty.',
      'Throttling valves and dampers as permanent flow control.'
    ],
    check: [
      'Real load and running hours (measure them).',
      'Efficiency at the real load, price premium, electricity price and its trend, discount rate and service life.',
      'Local minimum efficiency rules and any energy-efficiency incentives.'
    ]
  },
  applications: [
    'Replacing old, long-running pump and fan motors at failure with IE3/IE4 motors.',
    'Retrofitting VFDs to HVAC fans, cooling-tower fans and circulation pumps.',
    'Specifying motors on a life-cycle-cost basis in industrial purchasing.'
  ],
  sources: [
    'IEC 60034-30-1, *Rotating electrical machines — Efficiency classes of line operated AC motors (IE code)*; IEC 60034-2-1 (determining losses and efficiency).',
    'IEC TS 60034-31, *Selection of energy-efficient motors including variable speed applications — Application guide*.',
    'Commission Regulation (EU) 2019/1781 on ecodesign requirements for electric motors and variable speed drives.',
    'IEC 61800-9-2, *Adjustable speed electrical power drive systems — Ecodesign for power drive systems, motor starters, power electronics and their driven applications* (energy efficiency indicators).'
  ],
  sim: 'sp-lifecost'
}

);
