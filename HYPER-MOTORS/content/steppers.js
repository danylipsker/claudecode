/* HYPER-MOTORS · content/steppers.js — the stepper motor and its drivers:
 *   stepper-basics         stepper-principle, stepper-types, bipolar-unipolar, step-modes, stepper-torque-speed, stepper-resonance
 *   stepper-drivers-topic  stepper-drivers, dip-switch-settings, step-dir-signals, closed-loop-steppers, stepper-sizing
 * Simulations in sims/steppers.js (prefix st-). */
Hyper.add(

{
  id: 'stepper-principle', parent: 'stepper-basics', title: 'How a stepper motor steps', level: 1,
  short: 'A stepper motor turns a fixed angle — usually 1.8°, 200 steps a revolution — each time its driver moves the current from one winding pattern to the next. The rotor follows the magnetic field like a spring pulled from one notch to the next, and holds there when the pulses stop. Counting pulses gives the position without any sensor.',
  keywords: ['stepper motor', 'stepping motor', 'step angle', '1.8°', '200 steps', 'holding torque', 'static torque curve', 'detent torque', 'wave drive', 'two-phase on', 'open loop', 'lost steps', 'rotor teeth', 'electrical angle'],
  prereq: ['force-on-conductor', 'magnetic-circuits', 'torque-and-power'],
  related: ['stepper-types', 'step-modes', 'stepper-torque-speed', 'stepper-resonance', 'stepper-drivers', 'closed-loop-steppers', 'positioning-vs-speed', 'physics:torque-on-loop'],
  body: `
A stepper motor is a synchronous motor with many poles, fed not with a smooth AC supply but with current patterns that a **driver** switches one after another. Each change of pattern moves the magnetic field by a fixed angle; the rotor, which is magnetised (or made of toothed iron), follows it and stops. One pulse in, one step out. That is the whole trick — and the reason a stepper can position a printer head or a 3-D printer nozzle with no sensor at all.

### One step at a time
The common motor has **two phases**, A and B, each a winding on several stator poles. Energise A with current in one direction and the rotor lines up with A's field. Switch A off and B on: the field turns a quarter of a cycle and the rotor follows. Then A reversed, then B reversed, and back to the start — four steps per electrical cycle.

| Step | Wave drive (one phase on) | Full step (two phases on) | Field direction (electrical) |
|---|---|---|---|
| 0 | A+ | A+ B+ | 0° (45° for two phases on) |
| 1 | B+ | A− B+ | 90° (135°) |
| 2 | A− | A− B− | 180° (225°) |
| 3 | B− | A+ B− | 270° (315°) |

In the simulation's simple motor the rotor is a two-pole magnet, so an electrical cycle is one revolution and a step is 90°. A real **hybrid** stepper has 50 teeth on its rotor and matching teeth on its stator poles: one electrical cycle moves the rotor by one tooth pitch, 360°/50 = 7.2°, and each of the four steps is a quarter of it — **1.8°, 200 steps a revolution**. The general rule for a motor with $m$ phases and $N_r$ rotor teeth (or pole pairs) is

$$\\theta_s = \\frac{360^\\circ}{2\\,m\\,N_r}$$

### Why it holds: the static torque curve
Displace the energised rotor by a small angle $\\delta$ and it pulls back with a torque that follows a [[?sine-cosine|sine]] of the electrical angle:

$$T = T_H \\sin(N_r\\,\\delta)$$

The peak $T_H$ is the **holding torque** on the datasheet (measured with two phases on at rated current). Near its rest position the rotor behaves like a torsion spring. A load that needs half the holding torque pulls it back by 30° electrical — 0.6° on a 1.8° motor, a third of a step. A load above $T_H$ drags it over the crest: it slips to the next stable point, a whole tooth (four full steps) away, and the count is lost. With the power off, a hybrid still has a small **detent torque** — a few per cent of $T_H$ — from its magnet; that is the notchy feel when you turn the shaft by hand.

### Counting instead of measuring
Because every pulse is one step, the controller knows the position by counting: $n = f/S$ turns a pulse rate into speed. At 200 steps a revolution, 1000 pulses a second is 5 rev/s, 300 rpm. A typical hybrid lands within about ±5 % of a step of its ideal position, and the error does not accumulate. That is **open-loop** positioning: cheap, simple, stiff at standstill. The catch is equally simple — if the load ever exceeds what the motor can give, it loses steps and nothing tells the controller (see [[closed-loop-steppers]]).

### What it is like in a real machine
- **Heat at standstill.** A stepper takes its full current while holding still; motor cases at 60–80 °C are normal. Drivers reduce the current when idle ([[dip-switch-settings]]).
- **Ringing and noise.** Each full step is a jolt: the rotor overshoots and rings for a few milliseconds, which is audible and can build up into [[stepper-resonance|resonance]] at low speed. [[step-modes|Microstepping]] smooths it.
- **Torque falls with speed**, because the winding inductance stops the current rising in time ([[stepper-torque-speed]]).

In the simulation, step slowly and watch the phase currents, the field and the rotor; add a load and see the rotor lag behind the field, then slip when the load passes the holding torque.

> [!warn] A stepper holds its load only while powered. On a vertical axis a power failure, an emergency stop or a driver *disable* lets the load fall — use a spring-applied brake or a counterweight. Never plug or unplug motor leads while the driver is powered: the inductive spike can destroy the driver.

> [!key] A stepper follows its current pattern: one pattern change, one step (1.8° on a standard hybrid). It holds like a spring up to its holding torque; beyond it, it slips by whole teeth and the count is lost.
`,
  ideas: [
    'Each change of the phase-current pattern moves the field one step, and the rotor follows it.',
    'A hybrid stepper has 50 rotor teeth: four steps per tooth pitch of 7.2° gives 1.8° and 200 steps a revolution.',
    'The static torque is a sine of the electrical angle; its peak is the holding torque.',
    'Under load the rotor lags behind the field; beyond the holding torque it slips by whole teeth and loses the count.',
    'Speed is the pulse rate divided by the steps per revolution: 1000 pulses/s at 200 steps/rev is 300 rpm.'
  ],
  pitfalls: [
    'A stepper always knows where it is — It only counts pulses. If the load exceeds the available torque the rotor slips and the controller never finds out, unless an encoder checks it.',
    'Holding torque is the torque the motor can drive at speed — Holding torque is measured at standstill; at speed the torque available is much lower and falls further as the speed rises.',
    'Wave drive and two-phase-on drive give the same torque — With only one phase on, the field is 1/√2 as strong: about 71 % of the two-phase-on holding torque, for half the copper loss.'
  ],
  formulas: [
    {
      name: 'Step angle',
      expr: 'theta = 2*pi/(2*m*Nr)', tex: '\\theta_s = \\dfrac{360^\\circ}{2\\,m\\,N_r}',
      vars: {
        theta: { name: 'full-step angle', q: 'angle', unit: '°', tex: '\\theta_s' },
        m: { name: 'number of phases', int: true, value: 2, tex: 'm' },
        Nr: { name: 'rotor teeth (hybrid) or rotor pole pairs (PM)', int: true, value: 50, tex: 'N_r' }
      },
      note: 'Hybrid and permanent-magnet steppers. A two-phase hybrid with 50 teeth gives 1.8°, with 100 teeth 0.9°; a five-phase hybrid with 50 teeth 0.72°.',
      stories: { theta: 'A {m}-phase hybrid stepper has {Nr} rotor teeth. What is its full-step angle?', Nr: 'A {m}-phase stepper steps {theta}. How many rotor teeth (pole pairs) does it have?' }
    },
    {
      name: 'Speed from the pulse rate',
      expr: 'n = f/S', tex: 'n = \\dfrac{f}{S}',
      vars: {
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm' },
        f: { name: 'pulse (step) rate', q: 'frequency', unit: 'Hz', value: 1000 },
        S: { name: 'steps per revolution (full steps × microsteps)', int: true, value: 200 }
      },
      note: 'Each pulse is one step (or microstep): in rpm, n = 60 f / S.',
      stories: { n: 'A controller sends {f} to a motor set to {S} steps a revolution. How fast does it turn?', f: 'A motor set to {S} steps a revolution must turn at {n}. What pulse rate is needed?' }
    },
    {
      name: 'Static torque against displacement',
      expr: 'T = Th*sin(Nr*delta)', tex: 'T = T_H \\sin(N_r\\,\\delta)',
      vars: {
        T: { name: 'restoring torque (equal to the load torque at rest)', q: 'torque', unit: 'N·m' },
        Th: { name: 'holding torque', q: 'torque', unit: 'N·m', value: 1.26, tex: 'T_H' },
        Nr: { name: 'rotor teeth', int: true, value: 50, fixed: true, tex: 'N_r' },
        delta: { name: 'rotor displacement from its rest position', q: 'angle', unit: '°', value: 0.6, min: 0, max: 1.8, tex: '\\delta' }
      },
      note: 'Valid up to a quarter of a tooth pitch (one full step, 1.8° on a 50-tooth motor), where the torque peaks; beyond that the rotor slips.',
      stories: { delta: 'A stepper with a holding torque of {Th} carries a steady load of {T}. How far does the rotor lag behind its commanded position?', T: 'A stepper with a holding torque of {Th} is pushed {delta} off its rest position. What torque pulls it back?' }
    }
  ],
  examples: [
    {
      title: 'Pulses to millimetres',
      q: 'A 1.8° stepper drives a ball screw with a 5 mm lead through a direct coupling, at full step. How many pulses move the nut 100 mm, and what pulse rate gives 25 mm/s?',
      steps: [
        'One revolution is 200 steps and moves the nut 5 mm: 40 steps per millimetre, 0.025 mm a step.',
        '100 mm needs $100 \\times 40 = 4000$ pulses.',
        '25 mm/s is 5 rev/s = 300 rpm, so the pulse rate is $25 \\times 40 = 1000$ pulses/s.'
      ],
      a: '4000 pulses; 1000 pulses per second (300 rpm).'
    },
    {
      title: 'How far does a load pull it back?',
      q: 'A NEMA 23 hybrid with a holding torque of 1.26 N·m holds an arm that needs 0.9 N·m. How far behind its commanded position does it sit?',
      steps: [
        '$\\sin(N_r\\delta) = 0.9/1.26 = 0.714$, so $N_r\\delta = 45.6°$ electrical.',
        'With $N_r = 50$: $\\delta = 45.6/50 = 0.91°$ — half a full step.',
        'The margin is thin: 0.36 N·m more (a bump, a vibration) and the rotor slips to the next stable point, 7.2° away.'
      ],
      a: 'About 0.9° behind — half a step — with little margin left.'
    }
  ],
  quiz: [
    { q: 'A 1.8° stepper receives 400 pulses at full step. How far does it turn?', choices: ['Two revolutions (720°)', 'One revolution', '400°', 'Four revolutions'], a: 0, why: '200 steps make a revolution, so 400 steps make two.' },
    { q: 'A stepper holds position with only one phase energised at rated current. Compared with two phases on, its holding torque is about…', choices: ['71 %', '50 %', '100 %', '141 %'], a: 0, why: 'Two equal phase currents at 90° add to a field √2 times stronger than one; one phase alone gives 1/√2 ≈ 71 %.' },
    { q: 'A load 1.5 times the holding torque is applied to a stopped, energised stepper. What happens?', choices: ['The rotor slips over the crest of the torque curve and turns until it finds a point it can hold — the position is lost', 'It holds, 1.5 steps behind', 'The driver raises the current to hold it', 'It holds, because holding torque is a minimum value'], a: 0, why: 'The restoring torque can never exceed T_H; beyond it the rotor slips by whole teeth (7.2° on a hybrid) and an open-loop controller does not know.' },
    { q: 'An open-loop stepper system detects missed steps by itself.', a: false, why: 'It only counts the pulses it sends. Detecting lost steps needs an encoder or a stall-detection feature in the driver.' },
    { q: 'Why does a hybrid stepper feel notchy when turned by hand with the power off?', choices: ['Its permanent magnet pulls the rotor teeth towards the stator teeth: detent torque', 'The bearings are preloaded', 'The windings act as a brake through the driver', 'Grease in the gearbox'], a: 0, why: 'The magnet flux prefers the aligned tooth positions even without current — a few per cent of the holding torque.' }
  ],
  problems: [
    { q: 'A 0.9° stepper is run at full step. How many pulses per second make it turn at 450 rpm?', answer: 3000, unit: 'Hz', tol: 0.01, steps: ['A 0.9° motor has 400 steps a revolution.', '450 rpm = 7.5 rev/s; $f = 7.5 \\times 400 = 3000$ pulses/s.'] },
    { q: 'A 1.8° stepper (50 rotor teeth) with 0.5 N·m holding torque carries a steady 0.25 N·m. How many degrees does the rotor lag behind the commanded position?', answer: 0.6, unit: '°', tol: 0.02, steps: ['$\\sin(50\\,\\delta) = 0.25/0.5 = 0.5$, so $50\\,\\delta = 30°$.', '$\\delta = 0.6°$.'] }
  ],
  choose: {
    good: [
      'Positioning without a sensor at low and moderate speeds (typically below 600–1000 rpm): 3-D printers, plotters, laser cutters, camera sliders, labelling and dosing machines.',
      'Holding a position firmly at standstill, with no hunting or dither.',
      'Many cheap axes from one controller: step and direction signals are simple.'
    ],
    avoid: [
      'High speeds and high power: torque falls steeply with speed, and above a few hundred watts a servo or VFD motor is smaller and more efficient.',
      'Loads that change unpredictably (crashes, jams, heavy cutting) without an encoder: lost steps go unnoticed.',
      'Battery or efficiency-critical equipment: a stepper draws current even when doing nothing.'
    ],
    check: [
      'The torque available at your top speed and supply voltage, with a 30–50 % margin — not the holding torque.',
      'What happens on a power failure or a stop: does the load fall or coast?',
      'Low-speed vibration and noise at your speeds, and whether microstepping cures it.',
      'Heat: the motor case runs hot at standstill; mount it on metal and keep it away from plastics.'
    ]
  },
  applications: [
    'Desktop 3-D printers and laser engravers: NEMA 17 hybrids on belts and lead screws, one per axis.',
    'Office printers, scanners and ATMs: paper feed and carriage steppers, often permanent-magnet can-stack types.',
    'Dosing and peristaltic pumps: each step moves a fixed volume, so the pulse count sets the dose.',
    'Try your own motor in [the motor lab](#/tools/motorlab/stepper).'
  ],
  history: 'Stepping motors spread with digital electronics in the 1960s and 1970s, when computer peripherals — paper-tape readers, printers, plotters and later floppy-disk drives — needed cheap, accurate positioning that a digital circuit could command directly. The hybrid construction, combining a permanent magnet with the toothed iron of the variable-reluctance motor, became the standard industrial stepper.',
  sources: [
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* (Oxford) — the chapters on the principles of stepping motors and on static characteristics.',
    'P. P. Acarnley, *Stepping Motors: A Guide to Theory and Practice* (IET) — the static torque–displacement curve and step sequences.',
    'A. Hughes and B. Drury, *Electric Motors and Drives* — the chapter on stepping motors.'
  ],
  sim: 'st-principle'
},

{
  id: 'stepper-types', parent: 'stepper-basics', title: 'Permanent-magnet, variable-reluctance and hybrid steppers', level: 1,
  short: 'Three ways to build a stepper: the cheap permanent-magnet can-stack (7.5° or 15°), the magnet-free variable-reluctance motor, and the hybrid — a magnet between two toothed iron cups — that gives 1.8° or 0.9° steps and most of the torque in industry. Hybrids come in standard NEMA frames from 20 to 86 mm and beyond.',
  keywords: ['permanent-magnet stepper', 'can-stack', 'tin-can stepper', 'claw pole', 'variable reluctance', 'hybrid stepper', '0.9°', '1.8°', 'five-phase', 'NEMA 17', 'NEMA 23', 'NEMA 34', 'NEMA 8', 'NEMA 11', 'NEMA 14', 'frame size', 'flange', 'detent torque'],
  prereq: ['stepper-principle', 'magnetic-circuits'],
  related: ['bipolar-unipolar', 'stepper-sizing', 'reluctance-motors', 'linear-motors', 'motor-standards', 'physics:magnetic-materials'],
  body: `
Every stepper moves by pulling a rotor into line with an energised field, but there are three ways to give the rotor something to pull on — and they differ enormously in step size, torque and price.

### Permanent-magnet (can-stack) steppers
The rotor is a ring magnet with many poles around its circumference (24 poles for a 7.5° motor). Each phase is a single ring coil inside a pressed-steel cup whose edges are bent into interleaved **claw poles**; two cups stacked on the shaft, turned a quarter of a pole pitch from each other, make the two phases. With $p$ pole pairs and two phases there are $4p$ steps: 12 pole pairs give 48 steps, 7.5°; 6 pairs give 24 steps, 15°.

They are cheap, made in huge numbers (15–55 mm in diameter), run on 5–24 V, and give tens of millinewton-metres at most — up to roughly 0.1 N·m for the largest. Sleeve bearings, a moderate step accuracy and a low top speed are the price. You find them in printers, air-conditioning flap actuators, valves, cameras and instrument drives.

### Variable-reluctance (VR) steppers
No magnet at all: a soft-iron rotor with teeth, fewer than the stator has poles. The energised stator poles pull the nearest rotor teeth into line (the position of least [[magnetic-circuits|reluctance]]); switching the phases in turn walks the rotor round. A three-phase motor with 12 stator poles and 8 rotor teeth steps 15°. Current direction does not matter, so the drive is simple — but with no magnet there is **no detent torque** (the shaft spins freely when unpowered) and less torque per ampere. VR steppers are rare today; the same principle grew into the [[reluctance-motors|switched-reluctance motor]].

### Hybrid steppers
The industrial standard. An axially magnetised magnet sits between two toothed iron cups, so one cup is all north teeth and the other all south, offset by half a tooth. The stator has 8 poles (two phases), each with small teeth at nearly the rotor's pitch. The magnet gives a strong bias field; the windings steer it. With 50 rotor teeth a two-phase hybrid steps **1.8°** (200 steps/rev); with 100 teeth, **0.9°** (400 steps/rev). Three-phase (1.2°) and five-phase (0.72°) hybrids exist too, smoother but needing matching drivers.

| Type | Typical step | Torque range | Detent | Cost | Typical uses |
|---|---|---|---|---|---|
| PM can-stack | 7.5°, 15° | 5–100 mN·m | yes | lowest | printers, flaps, valves, gauges |
| Variable reluctance | 15°, 7.5° | small | none | low | historic, special |
| Hybrid 2-phase | 1.8°, 0.9° | 0.02–30 N·m | a few % of $T_H$ | moderate | CNC, 3-D printers, automation |
| Hybrid 5-phase | 0.72° | 0.1–10 N·m | small | higher | smooth, precise positioning |

**1.8° or 0.9°?** A 0.9° motor has twice the resolution and usually better accuracy (about ±3 % of a step against ±5 %), and runs more smoothly at low speed. But at the same rpm its electrical frequency is twice as high, so the inductance chokes its current at half the speed: it suits slow, fine motion, not fast traverses.

### NEMA frame sizes
Hybrids are sold in standard frames. The NEMA number is the flange size in tenths of an inch — NEMA 17 is nominally 1.7 in (real flanges are a little smaller, 42.3 mm) — and fixes the mounting face: flange, bolt pattern, pilot and shaft. Length, winding and torque are the maker's choice, so each frame comes in one to three (or more) stack lengths, and torque grows roughly with length. Typical values:

| Frame | Flange | Holes (spacing) | Pilot Ø | Shaft Ø | Holding torque | Current per phase | Inductance | Rotor inertia |
|---|---|---|---|---|---|---|---|---|
| NEMA 8 | 20 mm | M2 (16 mm) | 15 mm | 4 mm | 0.015–0.04 N·m | 0.4–0.8 A | 1–5 mH | 2–5 g·cm² |
| NEMA 11 | 28 mm | M2.5 (23 mm) | 22 mm | 5 mm | 0.04–0.15 N·m | 0.5–1.2 A | 1.5–6 mH | 9–20 g·cm² |
| NEMA 14 | 35 mm | M3 (26 mm) | 22 mm | 5 mm | 0.1–0.45 N·m | 0.4–1.5 A | 2–10 mH | 10–40 g·cm² |
| NEMA 17 | 42 mm | M3 (31 mm) | 22 mm | 5 mm | 0.2–0.65 N·m | 0.4–2.5 A | 1.5–10 mH | 30–120 g·cm² |
| NEMA 23 | 57 mm | Ø 5 mm (47.1 mm) | 38.1 mm | 6.35 or 8 mm | 0.4–3 N·m | 1–5.6 A | 1–6 mH | 100–800 g·cm² |
| NEMA 34 | 86 mm | Ø 5.5–6.5 mm (69.6 mm) | 73 mm | 12.7 or 14 mm | 2.5–12 N·m | 3–7 A | 2–10 mH | 900–4000 g·cm² |

Beyond these come NEMA 42 (110 mm, roughly 10–30 N·m). Many makers name frames by the flange in millimetres (a "42 mm" motor is a NEMA 17). Low-current windings of the same frame have more turns: higher resistance and inductance, the same torque, less speed. The frame sim draws the faces to scale.

> [!tip] Choose the frame from the torque you need **at your top speed** and the space you have; then choose the winding (current and inductance) to suit your driver and supply voltage.

> [!key] Permanent-magnet can-stacks are cheap and coarse, variable-reluctance motors have no magnet and no detent, and hybrids — 1.8° or 0.9°, NEMA 8 to 42 — do the precise, heavy work.
`,
  ideas: [
    'Can-stack PM steppers: a multipole ring magnet and claw-pole cups, 7.5° or 15°, cheap and small.',
    'Variable-reluctance steppers use a toothed iron rotor with no magnet: no detent torque, less torque.',
    'Hybrids put a magnet between two toothed cups: 50 teeth give 1.8°, 100 teeth 0.9°.',
    'A NEMA frame number is the nominal flange size in tenths of an inch; it fixes the mounting, not the torque.',
    'A 0.9° motor gives finer steps but loses torque at half the speed of a 1.8° motor with the same winding.'
  ],
  pitfalls: [
    'A NEMA 23 motor has a definite torque — The frame fixes only the mounting face: a NEMA 23 can hold anything from about 0.4 to 3 N·m depending on its length and winding.',
    'A 0.9° motor is simply a better 1.8° motor — It doubles the resolution but also the electrical frequency at a given speed, so its torque falls off at a lower rpm and it needs twice the pulse rate.'
  ],
  formulas: [
    {
      name: 'Full steps per revolution',
      expr: 'S = 2*m*Nr', tex: 'S = 2\\,m\\,N_r',
      vars: {
        S: { name: 'full steps per revolution', int: true },
        m: { name: 'number of phases', int: true, value: 2 },
        Nr: { name: 'rotor teeth (hybrid) or rotor pole pairs (PM)', int: true, value: 50, tex: 'N_r' }
      },
      note: 'Hybrid and PM steppers. A variable-reluctance motor makes m·N_r steps instead (3 phases, 8 teeth: 24 steps of 15°).',
      stories: { S: 'A {m}-phase hybrid has {Nr} teeth on each rotor cup. How many full steps does it make per revolution?', m: 'A hybrid with {Nr} rotor teeth makes {S} full steps a revolution. How many phases does it have?' }
    },
    {
      name: 'Nominal flange size from the NEMA number',
      expr: 'a = N*0.00254', tex: 'a \\approx \\dfrac{N}{10}\\ \\text{in}',
      vars: {
        a: { name: 'nominal flange width', q: 'length', unit: 'mm' },
        N: { name: 'NEMA frame number', int: true, value: 23 }
      },
      note: 'Nominal only: real flanges are a little smaller (NEMA 17: 42.3 mm, NEMA 23: about 56.4–57 mm, NEMA 34: about 86 mm).',
      stories: { a: 'Roughly how wide is the flange of a NEMA {N} motor?', N: 'A stepper has a flange about {a} wide. Which NEMA frame is it?' }
    }
  ],
  examples: [
    {
      title: 'Identify a motor on the bench',
      q: 'An unmarked stepper has a square flange 57 mm across, holes 47 mm apart, an 8 mm shaft and a body 76 mm long. Its label says 1.8°, 2.8 A. What is it, and what torque should you expect?',
      steps: [
        '57 mm flange and 47.1 mm hole spacing: a NEMA 23 frame ($23/10$ in = 58 mm nominal).',
        '76 mm is a long NEMA 23 stack; such motors typically hold about 1.8–2 N·m.',
        '1.8° means a two-phase hybrid with 50 rotor teeth, 200 steps a revolution.'
      ],
      a: 'A long two-phase NEMA 23 hybrid, roughly 1.9 N·m holding, 200 steps/rev.'
    },
    {
      title: 'Same motor, 0.9° version',
      q: 'A job needs 2 µm resolution on a 4 mm lead screw at full step. Will a 1.8° or a 0.9° motor do it without microstepping?',
      steps: [
        '1.8°: $4\\,\\text{mm}/200 = 20$ µm a step. 0.9°: $4/400 = 10$ µm a step.',
        'Neither reaches 2 µm by full steps; that needs microstepping (a 1.8° motor at 1/10 gives 2 µm), with the accuracy limits of [[step-modes|microsteps]].',
        'A 0.9° motor at 1/5 also gives 2 µm, with better step accuracy — if the speeds are low.'
      ],
      a: 'Neither at full step: 20 µm or 10 µm. Microstepping is needed; a 0.9° motor gives the better accuracy at low speed.'
    }
  ],
  quiz: [
    { q: 'Which type has no detent torque when unpowered?', choices: ['Variable reluctance', 'Permanent-magnet can-stack', 'Two-phase hybrid', 'Five-phase hybrid'], a: 0, why: 'Only a magnet can pull the rotor teeth into line without current; a VR rotor is plain soft iron.' },
    { q: 'What does "NEMA 17" fix?', choices: ['The mounting face: flange, bolt pattern, pilot and shaft', 'The holding torque', 'The rated current', 'The step angle'], a: 0, why: 'The frame number is about mounting (a nominal 1.7 in flange). Torque, current and step angle vary between models.' },
    { q: 'A three-phase hybrid has 50 rotor teeth. Its step angle is…', choices: ['1.2°', '1.8°', '2.4°', '0.72°'], a: 0, why: '$360/(2 \\times 3 \\times 50) = 1.2°$.' },
    { q: 'Why is a 0.9° motor weaker than a 1.8° motor at high speed, for the same winding?', choices: ['At the same rpm its electrical frequency is doubled, so the winding inductance limits the current sooner', 'Its magnet is weaker', 'Its bearings have more friction', 'It has fewer rotor teeth'], a: 0, why: 'With 100 teeth the current must reverse twice as often per revolution; the inductance chokes it at half the speed.' }
  ],
  problems: [
    { q: 'A two-phase permanent-magnet can-stack motor steps 7.5°. How many pole pairs does its rotor magnet have?', answer: 12, tol: 0.01, steps: ['Steps per revolution $= 360/7.5 = 48 = 2 m p = 4p$.', '$p = 12$ pole pairs (24 poles).'] }
  ],
  choose: {
    good: [
      'PM can-stack: low-cost, low-torque, coarse positioning — flaps, valves, small pumps, gauges.',
      'Hybrid 1.8°: the general-purpose positioning motor for machines, NEMA 17 to 34.',
      'Hybrid 0.9° or five-phase: fine resolution, smooth slow motion, microscopes and optics stages.'
    ],
    avoid: [
      'PM can-stacks where accuracy, stiffness or a long life at high duty matter: sleeve bearings and coarse steps.',
      '0.9° motors for fast traverses: their torque fades at half the speed.',
      'Choosing a frame by holding torque alone.'
    ],
    check: [
      'The mounting (flange, pilot, shaft diameter and flat or key) against your machine.',
      'The torque at speed on the maker\'s pull-out curve, at your supply voltage and driver.',
      'Winding current and inductance against your driver\'s current range and supply voltage.',
      'Shaft load limits (radial and axial) if a pulley or pinion sits on the shaft.'
    ]
  },
  applications: [
    'NEMA 8 and 11: camera focus, small syringe pumps and lab automation.',
    'NEMA 17: 3-D printers, small CNC and pick-and-place heads.',
    'NEMA 23 and 34: CNC routers, plasma tables, packaging and conveyor indexing.',
    'Compare frames to scale in the simulation, and pick one in [the selection guide](#/tools/sizing/choose).'
  ],
  sources: [
    'NEMA ICS 16, *Motion/Position Control Motors, Controls, and Feedback Devices* — the frame designations and mounting dimensions of step motors.',
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — the chapters on the structures of VR, PM and hybrid motors.',
    'P. P. Acarnley, *Stepping Motors: A Guide to Theory and Practice* — variable-reluctance and hybrid construction.',
    'Manufacturers\' catalogues of hybrid steppers list, per frame, the flange, length, holding torque, current, resistance, inductance and rotor inertia summarised here as typical ranges.'
  ],
  sim: ['st-types', 'st-frames']
},

{
  id: 'bipolar-unipolar', parent: 'stepper-basics', title: 'Bipolar and unipolar wiring: 4, 6 and 8 leads', level: 2,
  short: 'A two-phase stepper comes out with 4, 6 or 8 leads. Four leads mean two coils for a bipolar driver; six add centre taps for unipolar drive or a choice of full or half coils; eight give four coils that can be wired in series (low current, torque at low speed) or in parallel (more current, torque kept to higher speed). A meter and a few minutes identify the coils.',
  keywords: ['bipolar', 'unipolar', '4-wire', '6-wire', '8-wire', 'four lead', 'six lead', 'eight lead', 'centre tap', 'series connection', 'parallel connection', 'half coil', 'coil identification', 'multimeter', 'stepper wiring', 'phase pairs'],
  prereq: ['stepper-principle', 'h-bridge'],
  related: ['stepper-drivers', 'stepper-torque-speed', 'dip-switch-settings', 'stepper-types', 'electronics:h-bridge', 'electronics:flyback-diode'],
  body: `
Inside a two-phase stepper there are two phases, A and B. How their windings are brought out decides which drivers can run the motor — and, for the same motor, how much torque it gives at low and high speed.

### Unipolar and bipolar drive
A **unipolar** driver connects the centre tap of each phase to the positive supply and switches one end or the other to ground, so current flows in only one direction in each half-winding. Four transistors and no H-bridge: simple and cheap, which is why unipolar drives were common in the early days. But only half of each winding carries current at a time.

A **bipolar** driver reverses the current through the whole winding with an [[h-bridge|H-bridge]] per phase. Every modern chopper driver is bipolar. For the same copper loss, a bipolar winding gives about **1.4 times** the ampere-turns of a unipolar one, so about 40 % more low-speed torque.

### Four, six and eight leads
- **4 leads:** two coils, A and B. Bipolar only.
- **6 leads:** each coil has a centre tap. Unipolar; or bipolar using the whole coil (**series**, taps left unconnected) or half of it (**half coil**, one end and the tap).
- **8 leads:** each phase is two separate coils. Unipolar, **bipolar series** or **bipolar parallel**.

Taking one coil (a half-phase) with resistance $R_c$, inductance $L_c$ and unipolar current $I_u$ as the reference:

| Connection | Leads used | Phase resistance | Phase inductance | Current per phase | Holding torque | Torque at speed |
|---|---|---|---|---|---|---|
| Unipolar | all | $R_c$ | $L_c$ | $I_u$ | 1 (≈ 71 % of bipolar) | good |
| Bipolar, half coil (6-lead) | 4 of 6 | $R_c$ | $L_c$ | $I_u$ | ≈ 1 | good |
| Bipolar series (6 or 8) | 4 of 6, or 8 with 2 links | $2R_c$ | ≈ $4L_c$ | $I_u/\\sqrt2$ | ≈ 1.4 | falls early |
| Bipolar parallel (8) | 8 in 4 pairs | $R_c/2$ | $L_c$ | $\\sqrt2\\,I_u$ | ≈ 1.4 | best |

In series the two coils add their turns, so the inductance goes up with the *square* of the turns — four times, a little less in practice because the coupling between the coils is not perfect. In parallel the turns stay the same and the currents add. The copper loss at rated current is the same in every line of the table; what changes is the voltage the driver must find to push current in at speed. Series needs half the driver current but, at the same supply voltage, loses its torque at about half the speed of parallel — see the curves in the simulation and [[stepper-torque-speed]].

### Identifying the coils with a meter
Wire colours differ between makers, and unmarked motors turn up in every workshop. With the motor disconnected:

1. **Four leads:** measure pairs. Two pairs read a few ohms (typically 0.5–5 Ω for NEMA 17 to 34); every other pair is open. Each low-reading pair is a coil.
2. **Six leads:** you find two groups of three connected leads. In each group, the lead that reads the same value to both others is the **centre tap**; the two ends read twice that value.
3. **Eight leads:** four pairs of a few ohms each. Resistance cannot tell which pairs share a phase or their polarity. Turn the shaft steadily (a slow drill works) and read the AC voltage of two coils joined in series: coils of the same phase in the right polarity give about double a single coil's voltage, the same phase reversed gives almost nothing, coils of different phases give about 1.4 times. The maker's diagram, when you have it, is quicker.

A second check: short a pair and turn the shaft by hand. If it suddenly feels stiffer, the pair is a coil — the current generated in it brakes the rotor.

### Getting it wrong
- One coil reversed: the motor runs the other way — harmless, and the usual way to change direction.
- A and B swapped: also reversal.
- Leads from two different phases taken as one coil: the motor buzzes, jerks back and forth or barely turns.
- An 8-lead motor with one coil of a series pair reversed: the two coils cancel, the phase has almost no inductance and no torque, and the driver may trip on overcurrent.

> [!warn] Connect and disconnect motor leads only with the driver switched off: breaking an energised winding makes a voltage spike that can destroy the driver's transistors. Insulate unused centre taps separately — never join them to each other or to anything else in a bipolar connection.

> [!key] Four leads: bipolar. Six: unipolar, or bipolar on the whole coil or half. Eight: series for low current and low speed, parallel for torque at speed. Set the driver current for the connection, not for the unipolar rating printed on the label.
`,
  ideas: [
    'Unipolar drive uses half of each winding at a time; bipolar drive reverses the current through the whole winding with an H-bridge.',
    'Bipolar gives about 1.4 times the ampere-turns — about 40 % more low-speed torque — for the same copper loss.',
    'Series doubles the resistance and about quadruples the inductance, at 1/√2 of the unipolar current; parallel halves the resistance at √2 times it.',
    'Series keeps torque only at low speed; parallel keeps it to about twice the speed on the same supply.',
    'A meter finds coils by resistance; the pairing and polarity of 8-lead coils needs the voltage generated when the shaft turns.'
  ],
  pitfalls: [
    'The current on the label is the current to set on any driver — For 6- and 8-lead motors it is usually the unipolar rating; in bipolar series set about 0.7 times it, in parallel about 1.4 times.',
    'Series gives more torque because the inductance is higher — The holding torque of series and parallel is the same at their rated currents; the higher inductance only makes the torque fall off sooner.',
    'The six wires of a 6-lead motor can be joined to four driver terminals in any order that works — Mixing leads from the two phases makes the motor buzz and jerk; identify each phase and its centre tap first.'
  ],
  formulas: [
    {
      name: 'Bipolar series current from the unipolar rating',
      expr: 'Is = Iu/sqrt(2)', tex: 'I_s = \\dfrac{I_u}{\\sqrt2}',
      vars: {
        Is: { name: 'rated current per phase, bipolar series', q: 'current', unit: 'A', tex: 'I_s' },
        Iu: { name: 'rated current per coil, unipolar', q: 'current', unit: 'A', value: 2, tex: 'I_u' }
      },
      note: 'The same copper loss: I_s² · 2R_c = I_u² · R_c with both coils of the phase in series.',
      stories: { Is: 'A 6-lead motor is rated {Iu} unipolar. What current should a bipolar driver be set to with the whole coils in series?' }
    },
    {
      name: 'Bipolar parallel current from the unipolar rating',
      expr: 'Ip = sqrt(2)*Iu', tex: 'I_p = \\sqrt2\\,I_u',
      vars: {
        Ip: { name: 'rated current per phase, bipolar parallel', q: 'current', unit: 'A', tex: 'I_p' },
        Iu: { name: 'rated current per coil, unipolar', q: 'current', unit: 'A', value: 2, tex: 'I_u' }
      },
      note: 'Each coil carries I_p/2 but both coils of each phase are always on, where a unipolar drive uses one.',
      stories: { Ip: 'An 8-lead motor is rated {Iu} unipolar. What current per phase should the driver give with the coils in parallel?', Iu: 'A driver can give {Ip} per phase. What is the largest unipolar rating of an 8-lead motor it can run in parallel?' }
    },
    {
      name: 'Inductance of two coils in series',
      expr: 'Ls = 2*Lc*(1 + k)', tex: 'L_s = 2\\,L_c\\,(1 + k)',
      vars: {
        Ls: { name: 'phase inductance, series', q: 'inductance', unit: 'mH', tex: 'L_s' },
        Lc: { name: 'inductance of one coil', q: 'inductance', unit: 'mH', value: 1.2, tex: 'L_c' },
        k: { name: 'coupling between the two coils (1 = perfect)', value: 0.95, min: 0, max: 1 }
      },
      note: 'Self-inductances plus twice the mutual inductance k·L_c; with perfect coupling, four times one coil. In parallel the inductance stays about L_c.',
      stories: { Ls: 'Two coils of {Lc} with a coupling of {k} are joined in series. What is the phase inductance?', k: 'Each coil measures {Lc}; in series the phase measures {Ls}. How well coupled are they?' }
    },
    {
      name: 'Copper loss with two phases on',
      expr: 'P = 2*I^2*R', tex: 'P = 2\\,I^2 R',
      vars: {
        P: { name: 'copper loss in the motor', q: 'power', unit: 'W' },
        I: { name: 'current per phase', q: 'current', unit: 'A', value: 2.83 },
        R: { name: 'resistance per phase', q: 'resistance', unit: 'Ω', value: 0.45 }
      },
      note: 'At standstill in full step, both phases carry the set current. The same loss for every connection at its rated current.',
      stories: { P: 'Both phases of a stepper with {R} per phase carry {I}. How much heat do the windings make?', I: 'A motor with {R} per phase may dissipate {P} in its windings. What current per phase is allowed?' }
    }
  ],
  examples: [
    {
      title: 'Series or parallel for an 8-lead NEMA 23',
      q: 'An 8-lead NEMA 23 is rated 2.0 A per coil (unipolar), 0.9 Ω and 1.2 mH per coil. Your driver gives up to 4.2 A and runs on 48 V. Work out the series and parallel connections.',
      steps: [
        'Series: $I_s = 2.0/\\sqrt2 = 1.41$ A, $R = 1.8$ Ω, $L \\approx 2 \\times 1.2 \\times 1.95 = 4.7$ mH.',
        'Parallel: $I_p = 2.0\\sqrt2 = 2.83$ A, $R = 0.45$ Ω, $L \\approx 1.2$ mH.',
        'Copper loss is the same: $2 \\times 1.41^2 \\times 1.8 = 7.2$ W and $2 \\times 2.83^2 \\times 0.45 = 7.2$ W.',
        'The driver can supply 2.83 A, so parallel is possible and keeps torque to roughly twice the speed; series would do for slow indexing with a smaller driver.'
      ],
      a: 'Series: 1.41 A, 1.8 Ω, ≈ 4.7 mH. Parallel: 2.83 A, 0.45 Ω, 1.2 mH. Choose parallel on this driver for speed.'
    },
    {
      title: 'Metering a six-lead motor',
      q: 'On an unmarked 6-lead motor you read 3.2 Ω between black and green, 3.2 Ω between yellow and green, 6.4 Ω between black and yellow; red, white and blue behave the same way with white in the middle. Nothing reads between the two groups. Wire it bipolar series.',
      steps: [
        'Green reads half the end-to-end value to both others: it is the centre tap of one phase, black and yellow its ends.',
        'Likewise white is the other centre tap, red and blue the ends.',
        'Bipolar series: black and yellow to A+ and A−, red and blue to B+ and B−; insulate green and white separately. If the motor turns the wrong way, swap red and blue.'
      ],
      a: 'Phase A = black–yellow (tap green), phase B = red–blue (tap white); taps insulated.'
    }
  ],
  quiz: [
    { q: 'A 4-lead stepper can be driven by…', choices: ['a bipolar driver only', 'a unipolar driver only', 'either', 'neither without rewinding'], a: 0, why: 'There are no centre taps to feed a unipolar driver; the current must be reversed through the whole coil.' },
    { q: 'An 8-lead motor is changed from bipolar series to bipolar parallel on the same driver and supply. What happens?', choices: ['Holding torque about the same (with the current doubled); torque kept to about twice the speed', 'Holding torque doubles', 'Torque at speed falls', 'Nothing: the motor cannot tell'], a: 0, why: 'Parallel has a quarter of the inductance at twice the current, so L·I halves and the current can be pushed in at twice the frequency; the ampere-turns at rated current are the same.' },
    { q: 'On a 6-lead motor, how do you recognise a centre tap with a meter?', choices: ['It reads the same (half) resistance to the two ends of its group', 'It reads open to everything', 'It reads the highest resistance', 'It reads zero to the case'], a: 0, why: 'The tap is in the middle of the coil, so it reads R to each end, while the ends read 2R to each other.' },
    { q: 'Reversing the two leads of one coil of a 4-lead bipolar motor makes it run backwards.', a: true, why: 'Reversing one phase reverses the direction of the rotating field sequence.' },
    { q: 'Why does a bipolar driver give more low-speed torque than a unipolar one for the same motor heating?', choices: ['It uses the whole winding, so the same copper loss makes √2 times the ampere-turns', 'It uses a higher voltage', 'Its chopper frequency is higher', 'It magnetises the rotor more'], a: 0, why: 'Unipolar drive leaves half the copper idle; bipolar series uses all of it at 1/√2 of the current: √2 × the ampere-turns for the same I²R.' }
  ],
  problems: [
    { q: 'An 8-lead motor rated 3.0 A unipolar is wired in bipolar parallel. What current should the driver be set to?', answer: 4.24, unit: 'A', tol: 0.02, steps: ['$I_p = \\sqrt2 \\times 3.0 = 4.24$ A.'] },
    { q: 'Each coil of an 8-lead motor measures 2.0 mH; the coupling between the two coils of a phase is 0.93. What is the series phase inductance?', answer: 7.72, unit: 'mH', tol: 0.02, steps: ['$L_s = 2 \\times 2.0 \\times (1 + 0.93) = 7.72$ mH — a little under four times one coil.'] }
  ],
  choose: {
    good: [
      'Bipolar parallel (8-lead): the best torque at speed, when the driver can supply the higher current.',
      'Bipolar series: slow, heavy indexing with a smaller driver, or long cables where a lower current helps.',
      'Unipolar: legacy drivers and very simple transistor or relay drives on small motors.'
    ],
    avoid: [
      'Series on a low supply voltage when you need speed: the torque falls off early.',
      'Guessing the pairing of an unmarked 6- or 8-lead motor: meter it first.',
      'Unipolar drives for new designs: bipolar choppers give more torque for the same heat.'
    ],
    check: [
      'Which rating the label gives (unipolar or bipolar) and the current for your connection.',
      'That your driver\'s current range covers the parallel current, and its supply voltage the series speed.',
      'The pairing and polarity of every coil before power is applied.',
      'Cable: shielded, sized for the phase current, with the shield earthed at the driver end.'
    ]
  },
  applications: [
    '3-D printers: 4-lead NEMA 17 motors on bipolar chopper drivers.',
    'CNC routers: 8-lead NEMA 23 and 34 motors wired in parallel for rapid traverses.',
    'Retro and hobby electronics: 6-lead motors from old printers on unipolar transistor-array drivers.',
    'See every connection drawn in [the stepper wiring diagrams](#/tools/wiring/stepper).'
  ],
  sources: [
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — unipolar and bipolar drive circuits.',
    'P. P. Acarnley, *Stepping Motors: A Guide to Theory and Practice* — drive circuits and winding connections.',
    'Manufacturers\' datasheets of 6- and 8-lead hybrid steppers give unipolar, bipolar-series and bipolar-parallel ratings in the √2 ratios used here.'
  ],
  sim: 'st-wiring'
},

{
  id: 'step-modes', parent: 'stepper-basics', title: 'Full, half and microstepping', level: 2,
  short: 'A driver can switch whole phases (full step), alternate one and two phases (half step), or set the two phase currents to sine and cosine values so the field turns in small increments (microstepping). Microstepping makes the motor smooth, quiet and finer in commanded resolution — but each microstep has little torque behind it, so resolution is not accuracy.',
  keywords: ['full step', 'half step', 'microstepping', 'microstep', '1/16', '1/256', 'sine cosine currents', 'current vector', 'incremental torque', 'resolution', 'accuracy', 'torque ripple', 'interpolation', 'smoothing', 'steps per revolution'],
  prereq: ['stepper-principle', 'bipolar-unipolar'],
  related: ['dip-switch-settings', 'stepper-resonance', 'stepper-drivers', 'step-dir-signals', 'lead-ball-screws', 'electronics:pwm'],
  body: `
The rotor of a stepper lines up with the field made by its two phase currents. The field points along the **current vector** $(i_A, i_B)$ — so the driver can put it anywhere, not just at the four full-step positions, by choosing the two currents.

### Full step and half step
In **full step** both phases carry full current and the pattern changes every step: the current vector jumps 90° electrical and its tip moves round the corners of a square. **Wave drive** (one phase at a time) gives the same number of steps with 71 % of the torque. **Half step** alternates between one and two phases on: eight positions per electrical cycle, 400 steps a revolution on a 1.8° motor — but the torque alternates between 71 % and 100 %, a ripple you can hear. Better drivers raise the current by √2 in the one-phase positions ("compensated" half step) to even it out.

### Microstepping
A microstepping driver sets the phase currents to

$$i_A = I_{pk}\\cos\\theta_e, \\qquad i_B = I_{pk}\\sin\\theta_e$$

and advances the electrical angle $\\theta_e$ by $90^\\circ/\\mu$ per pulse, where $\\mu$ is the number of microsteps per full step. The tip of the current vector walks round a circle, the field turns smoothly, and the rotor follows it. Typical settings on a 1.8° motor:

| Microsteps per full step | 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 |
|---|---|---|---|---|---|---|---|---|---|
| Steps per revolution | 200 | 400 | 800 | 1600 | 3200 | 6400 | 12 800 | 25 600 | 51 200 |

and decimal ones — 5, 10, 25, 50, 125 microsteps (1000, 2000, 5000, 10 000, 25 000 steps a revolution) — which give round numbers of steps per millimetre on metric screws.

### Resolution is not accuracy
Near its rest point the rotor is held by a torque that grows with the [[?sine-cosine|sine]] of the angle between the field and the rotor. Moving the field by one microstep adds only

$$\\Delta T = T_H \\sin\\frac{90^\\circ}{\\mu}$$

— 38 % of the holding torque at 1/4, 9.8 % at 1/16, 0.6 % at 1/256. If friction or a load is larger than that, a single microstep does not move the rotor at all: it waits until enough microsteps have accumulated and then jumps. On top of this, real motors are not perfectly sinusoidal magnetically, so the microstep positions are unevenly spaced; the overall accuracy stays about ±5 % of a *full* step whatever the setting. Beyond about 1/8 to 1/16, microstepping buys **smoothness**, not position.

### What microstepping really buys
- **Smooth, quiet motion at low speed.** Each jolt is small, so the rotor rings far less, and the low-speed [[stepper-resonance|resonance]] almost disappears.
- **Finer commanded resolution** for smooth velocity and for interpolation between axes.
- **Even torque:** the current vector has the same length at every angle, so the torque does not ripple. With the peak current set to the rated current the torque is 71 % of the two-phase-on holding torque; a peak of 1.41 times the rated current gives the same heating as full step and the full holding torque ([[dip-switch-settings]]).

### The price: pulse rate
Every microstep is a pulse. At 600 rpm, a 1.8° motor needs 2 kHz at full step, 32 kHz at 1/16 and 512 kHz at 1/256 — beyond many controllers' pulse outputs (often 100–500 kHz) and some drivers' inputs. Choose the finest setting your controller can feed at your top speed. Many drivers also **interpolate**: they take coarse steps (say 1/16) and smooth them internally to 1/256 — silky motion from a slow pulse train, at the cost of a small lag.

In the simulation, watch the tip of the current vector trace a square, an octagon or a circle, and add friction to see microsteps that do not move the rotor.

> [!tip] For most machines 1/8 to 1/16 is the sweet spot: smooth enough, and easy on the pulse rate. Choose finer only when the controller can deliver it, and never expect microsteps to be accurate positions under load.

> [!key] Microstepping sets the phase currents to sine and cosine values so the field turns in small increments: smoother, quieter, finer commanded resolution — but each microstep carries only $T_H\\sin(90^\\circ/\\mu)$, and the accuracy remains that of the full step.
`,
  ideas: [
    'The field points along the current vector (i_A, i_B); the driver can put it anywhere by choosing the two currents.',
    'Half step alternates one and two phases on: 400 steps a revolution, with a torque ripple unless compensated.',
    'Microstepping sets sine and cosine currents; the tip of the current vector moves round a circle in 90°/μ increments.',
    'The torque behind one microstep is T_H sin(90°/μ): under 10 % at 1/16, so friction can stop a microstep.',
    'Finer microstepping multiplies the pulse rate: 1/256 at 600 rpm needs 512 kHz.'
  ],
  pitfalls: [
    'At 1/256 the motor positions to 1/51 200 of a revolution — It is commanded to; under friction or load it lags and jumps, and magnetic non-linearity misplaces microsteps. Accuracy stays about ±5 % of a full step.',
    'Microstepping reduces the holding torque by a large factor — The holding torque depends on the length of the current vector, not on the step size; only the incremental torque per microstep is small.',
    'Finer is always better — Past 1/16 the gain is mostly smoothness, while the controller must deliver many times the pulse rate.'
  ],
  formulas: [
    {
      name: 'Incremental torque of one microstep',
      expr: 'dT = Th*sin(pi/(2*u))', tex: '\\Delta T = T_H \\sin\\dfrac{90^\\circ}{\\mu}',
      vars: {
        dT: { name: 'torque behind one microstep', q: 'torque', unit: 'N·m', tex: '\\Delta T' },
        Th: { name: 'holding torque', q: 'torque', unit: 'N·m', value: 1.26, tex: 'T_H' },
        u: { name: 'microsteps per full step', int: true, value: 16, min: 1, max: 256, tex: '\\mu' }
      },
      note: 'From the rest position; a friction or load torque larger than ΔT stops a single microstep from moving the rotor.',
      stories: { dT: 'A motor with a holding torque of {Th} is set to {u} microsteps per full step. How much torque moves the rotor by one microstep?', u: 'Friction is {dT} on a motor with {Th} holding torque. At what microstep setting does a single microstep just move the rotor?' }
    },
    {
      name: 'Pulse rate needed for a speed',
      expr: 'f = n*S*u', tex: 'f = n\\,S\\,\\mu',
      vars: {
        f: { name: 'pulse rate', q: 'frequency', unit: 'kHz' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 600 },
        S: { name: 'full steps per revolution', int: true, value: 200 },
        u: { name: 'microsteps per full step', int: true, value: 16, tex: '\\mu' }
      },
      note: 'n in revolutions per second (the calculator converts rpm).',
      stories: { f: 'A {S}-step motor set to {u} microsteps must turn at {n}. What pulse rate must the controller send?', n: 'A controller can send {f} to a {S}-step motor set to {u} microsteps. What is the top speed?' }
    },
    {
      name: 'Linear resolution on a screw',
      expr: 'dx = p/(S*u)', tex: '\\Delta x = \\dfrac{p}{S\\,\\mu}',
      vars: {
        dx: { name: 'travel per (micro)step', q: 'length', unit: 'µm', tex: '\\Delta x' },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 5 },
        S: { name: 'full steps per revolution', int: true, value: 200 },
        u: { name: 'microsteps per full step', int: true, value: 16, tex: '\\mu' }
      },
      note: 'Commanded resolution; the real position error is set by the full-step accuracy, backlash and the screw.',
      stories: { dx: 'A {S}-step motor set to {u} microsteps turns a screw with a {p} lead. How far does the nut move per pulse?' }
    }
  ],
  examples: [
    {
      title: 'Does the microstep move?',
      q: 'A NEMA 17 with 0.42 N·m holding torque drives an axis whose friction, seen at the motor, is 0.05 N·m. At 1/16 and at 1/4, does one microstep move the rotor?',
      steps: [
        '1/16: $\\Delta T = 0.42 \\sin 5.63° = 0.041$ N·m — less than 0.05 N·m: a single microstep does not move it; it moves after two.',
        '1/4: $\\Delta T = 0.42 \\sin 22.5° = 0.16$ N·m — every microstep moves the rotor (lagging a little).',
        'So the axis does not truly resolve 1/16 steps — though it runs more smoothly at 1/16.'
      ],
      a: 'At 1/16 single microsteps stick; at 1/4 each one moves.'
    },
    {
      title: 'Choosing a setting for the controller',
      q: 'A controller outputs at most 100 kHz. A 1.8° motor must reach 900 rpm. What is the finest microstep setting you can use?',
      steps: [
        '900 rpm is 15 rev/s; in full steps $15 \\times 200 = 3000$ per second.',
        '$\\mu \\le 100\\,000/3000 = 33$: 1/32 would need 96 kHz — just inside; 1/16 (48 kHz) leaves margin.',
        'Choose 1/16, or 1/32 only if the controller\'s 100 kHz is reliable with clean edges.'
      ],
      a: '1/16 comfortably (48 kHz); 1/32 at the limit (96 kHz).'
    }
  ],
  quiz: [
    { q: 'In microstepping, what shape does the tip of the current vector (i_A, i_B) trace?', choices: ['A circle', 'A square', 'A straight line', 'A figure of eight'], a: 0, why: 'i_A = I cos θ and i_B = I sin θ: the vector keeps its length and turns, so its tip moves round a circle. In full step it jumps between the corners of a square.' },
    { q: 'A motor at 1/32 microstepping has a holding torque of 2 N·m. About how much torque is behind a single microstep?', choices: ['0.1 N·m', '1 N·m', '2 N·m', '0.02 N·m'], a: 0, why: '$2 \\sin(90°/32) = 2 \\sin 2.8° \\approx 0.098$ N·m.' },
    { q: 'Setting 1/256 microstepping makes the machine 16 times more accurate than 1/16.', a: false, why: 'Accuracy is limited by the motor\'s full-step accuracy, friction and load; finer settings add commanded resolution and smoothness, not accuracy.' },
    { q: 'Why does uncompensated half stepping make the motor rougher than full step?', choices: ['The torque alternates between 71 % (one phase) and 100 % (two phases)', 'It doubles the current', 'It halves the step rate', 'It reverses the motor every other step'], a: 0, why: 'The current vector is √2 longer in the two-phase positions than in the one-phase positions, so the torque ripples each step.' },
    { q: 'What limits the finest microstep setting you can use at top speed?', choices: ['The pulse rate the controller (and the driver input) can deliver', 'The motor\'s inductance only', 'The holding torque', 'The number of rotor teeth'], a: 0, why: 'Pulse rate = speed × steps per revolution × microsteps; the controller must deliver it.' }
  ],
  problems: [
    { q: 'At what pulse rate must a controller run to turn a 1.8° motor at 450 rpm on 1/8 microstepping?', answer: 12000, unit: 'Hz', tol: 0.01, steps: ['450 rpm = 7.5 rev/s.', '$f = 7.5 \\times 200 \\times 8 = 12\\,000$ pulses/s.'] },
    { q: 'A 1.8° motor at 1/10 microstepping drives a belt pulley that moves the belt 40 mm per revolution. What is the travel per pulse?', answer: 20, unit: 'µm', tol: 0.01, steps: ['Steps per revolution $= 200 \\times 10 = 2000$.', '$40/2000 = 0.02$ mm = 20 µm.'] }
  ],
  choose: {
    good: [
      'Microstepping at 1/8–1/16: almost every modern machine — smooth, quiet, less resonance.',
      'Full step: the least pulse rate and the simplest drives; fine at medium speeds where the motor runs smoothly anyway.',
      'Driver interpolation: slow controllers that must still give smooth motion.'
    ],
    avoid: [
      'Relying on microsteps for accuracy under load or friction.',
      'Settings so fine that the controller cannot reach the top speed.',
      'Uncompensated half step where noise and vibration matter.'
    ],
    check: [
      'The pulse rate at top speed against the controller\'s output and the driver\'s input limit.',
      'Steps per millimetre (or per degree) of the axis — choose a setting that makes them round numbers.',
      'Whether the driver sets the peak or the RMS current, and what torque that gives.'
    ]
  },
  applications: [
    '3-D printers: 1/16 with 1/256 interpolation, so NEMA 17 motors run near-silently.',
    'Microscope and camera stages: fine microstepping on 0.9° motors for smooth slow motion.',
    'Engraving and cutting: 1/8–1/10 microstepping gives round steps per millimetre on belts and screws.',
    'Try the settings in [the step and direction tool](#/tools/drives/stepdir).'
  ],
  sources: [
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — the chapters on microstepping and drive circuits.',
    'P. P. Acarnley, *Stepping Motors: A Guide to Theory and Practice* — half-step and ministep operation, static torque curves.',
    'Microstepping driver datasheets list the step-resolution settings and interpolation features summarised here.'
  ],
  sim: 'st-microstep'
},

{
  id: 'stepper-torque-speed', parent: 'stepper-basics', title: 'Holding, pull-in and pull-out torque', level: 2,
  short: 'A stepper gives its full holding torque only at standstill. As speed rises, the winding inductance and the back-EMF stop the driver pushing the full current in, and the torque falls — early on a low supply voltage, much later on a high one. The pull-out curve is what the motor can run at with a ramp; the lower pull-in curve is what it can start and stop at instantly.',
  keywords: ['torque–speed curve', 'pull-out torque', 'pull-in torque', 'holding torque', 'detent torque', 'start-stop region', 'slew region', 'corner speed', 'supply voltage', 'inductance', 'back-EMF', 'acceleration ramp', 'stall', 'lost steps', '32√L'],
  prereq: ['step-modes', 'back-emf', 'torque-and-power'],
  related: ['stepper-resonance', 'stepper-drivers', 'stepper-sizing', 'bipolar-unipolar', 'dc-torque-speed', 'motion-profiles', 'electronics:rl-transient'],
  body: `
The datasheet of a stepper gives one torque in bold — the **holding torque**, measured at standstill with rated current in both phases. It is the most the motor will ever give, and it is not available at speed. Three curves tell the real story.

### The three torques
- **Holding torque** $T_H$: the peak of the static torque curve, energised, at rest.
- **Pull-out torque** (the upper curve): the most torque the motor can give while running at a steady speed that it was brought to with a ramp. Exceed it and the rotor falls out of step — it stalls, buzzing, and every step after that is lost.
- **Pull-in torque** (the lower curve): the most torque against which the motor can **start, stop or reverse instantly** at a given pulse rate, with no ramp. Between the two curves lies the *slew* region, reachable only by accelerating along a ramp.

The pull-in curve depends on the load inertia: the rotor must reach the step speed within about a step, so more inertia means a lower start–stop rate — roughly as $1/\\sqrt{1 + J_L/J_r}$.

### Why the torque falls: the current cannot get in
Torque follows current, and the driver can push current into a winding only as fast as $L\\,di/dt = V - Ri - e$ allows. At standstill the chopper has all the time it needs. At speed, the current must reverse every two full steps, while the winding's back-EMF $e$, [[?proportional|proportional]] to speed, eats the supply voltage. Above a **corner speed** the current never reaches its set value, and the torque falls — roughly as the [[?inverse|inverse]] of speed, so the mechanical power $P = T\\omega$ levels off.

A first estimate of the corner, ignoring resistance and back-EMF, is where the inductive voltage at full current equals the supply:

$$\\omega_c \\approx \\frac{V}{N_r\\,L\\,I}$$

The **supply voltage** moves the corner: double it and the torque holds to about twice the speed. The chopper still limits the current, so a higher voltage does not raise the standstill current or the holding torque — it buys speed. That is why steppers run on 24–80 V, far above the 2–5 V their winding resistance alone would need.

| A 56 mm NEMA 23 (1.26 N·m, 2.8 A, 0.9 Ω, 2.5 mH), sine microstepping | 24 V supply | 48 V supply | 80 V supply |
|---|---|---|---|
| Torque holds to about | 300–400 rpm | 600–800 rpm | 1000–1200 rpm |
| Torque at 1000 rpm | about half | about 85 % | nearly full |
| Mechanical power near the top | 50–60 W | 110–120 W | about 200 W |

(Figures from the simulation's model, an upper bound: real curves sag a little lower at speed through iron losses, and show dips at resonances.)

### How much voltage?
- **The driver's rating** comes first, with a margin: a decelerating load pumps energy back and lifts the supply, so run a 50 V driver on 36–48 V, an 80 V driver on 60–70 V.
- **The motor.** A widely quoted rule of thumb puts the useful maximum near $32\\sqrt{L}$ volts, with $L$ in mH: about 50 V for a 2.5 mH NEMA 23. Above it iron losses and heat at speed rise faster than the gain.
- **Low-inductance windings** (parallel connection, high-current motors) need less voltage for the same speed, but more current.

### Using the curves
Size from the pull-out curve at **your** supply voltage and driver, with a safety margin of 30–50 % at the highest speed — the curve is measured on a test bench, often at a particular microstep setting, and friction, a worn screw or a cold, stiff grease will eat into it. Get there with a ramp: accelerate within the pull-out curve, and use the start–stop rate only for small, light moves. Remember resonance: at some speeds the real curve has holes ([[stepper-resonance]]).

In the simulation, move the supply voltage and watch the curves; set a speed and a load and see whether the motor runs, needs a ramp, or stalls.

> [!warn] A stalled stepper does not overheat like a DC motor — the driver still limits the current — but the machine loses its position without knowing. Treat a stall as a crash: stop, and home the axis again before continuing.

> [!key] Holding torque at rest, pull-out torque when ramped, pull-in torque for instant starts. Torque falls above a corner speed that rises with the supply voltage and falls with the winding inductance: choose voltage for speed, current for torque.
`,
  ideas: [
    'Holding torque is only available at standstill; the pull-out curve gives what the motor can run at, the pull-in curve what it can start at instantly.',
    'Above a corner speed the current cannot reach its set value, because of the inductance and the back-EMF, and the torque falls roughly as 1/speed.',
    'Doubling the supply voltage roughly doubles the corner speed; it does not raise the holding torque.',
    'The start–stop (pull-in) rate falls with load inertia, roughly as 1/√(1 + J_L/J_r); faster speeds need a ramp.',
    'Size from the pull-out curve at your voltage with a 30–50 % margin.'
  ],
  pitfalls: [
    'A 1.26 N·m motor gives 1.26 N·m at 1000 rpm — That is the holding torque; at 1000 rpm on 24 V the same motor gives about half.',
    'A higher supply voltage overheats the motor at standstill — The chopper limits the current to its set value at any supply voltage; the extra voltage only helps the current get in at speed (with somewhat more iron and switching loss).',
    'The motor can start directly at any speed on its pull-out curve — Only below the pull-in curve; above it the rotor cannot catch the pulses and stalls. Ramp up to the slew speeds.'
  ],
  formulas: [
    {
      name: 'Corner speed (first estimate)',
      expr: 'w = V/(Nr*L*I)', tex: '\\omega_c \\approx \\dfrac{V}{N_r\\,L\\,I}',
      vars: {
        w: { name: 'corner speed', q: 'angvel', unit: 'rpm', tex: '\\omega_c' },
        V: { name: 'driver supply voltage', q: 'voltage', unit: 'V', value: 48 },
        Nr: { name: 'rotor teeth', int: true, value: 50, tex: 'N_r' },
        L: { name: 'phase inductance', q: 'inductance', unit: 'mH', value: 2.5 },
        I: { name: 'peak phase current', q: 'current', unit: 'A', value: 4 }
      },
      note: 'Where the inductive voltage N_r ω L I at full current equals the supply; resistance and back-EMF bring the real corner lower (roughly 20–40 % lower).',
      stories: { w: 'A 1.8° motor with {L} per phase runs at a peak current of {I} from {V}. Roughly where does its torque start to fall?', V: 'A motor with {L} per phase at {I} peak must hold its torque up to {w}. About what supply voltage does it need?' }
    },
    {
      name: 'Current rise time',
      expr: 't = L*I/V', tex: 't \\approx \\dfrac{L\\,I}{V}',
      vars: {
        t: { name: 'time for the current to rise from zero to I', q: 'time', unit: 'µs' },
        L: { name: 'phase inductance', q: 'inductance', unit: 'mH', value: 2.5 },
        I: { name: 'phase current', q: 'current', unit: 'A', value: 4 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 48 }
      },
      note: 'While R·i and the back-EMF are small compared with V. At 900 rpm a 1.8° motor has 333 µs per full step.',
      stories: { t: 'How long does a driver on {V} take to push {I} into a winding of {L}?' }
    },
    {
      name: 'Rule-of-thumb supply voltage',
      expr: 'V = 32*sqrt(L)', tex: 'V \\approx 32\\sqrt{L}',
      vars: {
        V: { name: 'useful maximum supply voltage', q: false, unit: 'V' },
        L: { name: 'phase inductance', q: false, unit: 'mH', value: 2.5 }
      },
      note: 'A widely quoted rule of thumb, not a law: with L in millihenries. The driver\'s own voltage rating, with a margin, comes first.',
      stories: { V: 'A stepper has {L} per phase. What supply voltage does the rule of thumb suggest?' }
    },
    {
      name: 'Start–stop rate with a load inertia',
      expr: 'f = f0/sqrt(1 + JL/Jr)', tex: 'f_{s} = \\dfrac{f_0}{\\sqrt{1 + J_L/J_r}}',
      vars: {
        f: { name: 'start–stop pulse rate with the load', q: 'frequency', unit: 'Hz', tex: 'f_{s}' },
        f0: { name: 'start–stop rate of the motor alone', q: 'frequency', unit: 'Hz', value: 1600, tex: 'f_0' },
        JL: { name: 'load inertia at the motor', q: 'inertia', unit: 'g·cm²', value: 300, tex: 'J_L' },
        Jr: { name: 'rotor inertia', q: 'inertia', unit: 'g·cm²', value: 300, tex: 'J_r' }
      },
      note: 'An approximation for a light friction load: the rotor must reach the step speed within about a step, so the rate falls as the square root of the total inertia.',
      stories: { f: 'A motor that can start unloaded at {f0} is coupled to a load of {JL} (rotor {Jr}). What is its start–stop rate now?' }
    }
  ],
  examples: [
    {
      title: 'Why 24 V is not enough',
      q: 'A NEMA 23 (2.5 mH, driven at 4 A peak) must traverse at 900 rpm. Estimate the corner speed on 24 V and on 48 V.',
      steps: [
        '24 V: $\\omega_c \\approx 24/(50 \\times 0.0025 \\times 4) = 48$ rad/s = 458 rpm.',
        '48 V: twice that, about 917 rpm.',
        'At 900 rpm on 24 V the motor is far past its corner (roughly half torque); on 48 V it is just at it. Resistance and back-EMF bring both a little lower, so 48 V with a margin — or a lower-inductance winding — is the sensible choice.'
      ],
      a: 'About 460 rpm on 24 V and 920 rpm on 48 V: use 48 V.'
    },
    {
      title: 'Starting without a ramp',
      q: 'A motor starts unloaded at up to 1600 full steps per second. It drives a disc whose inertia is 3 times the rotor\'s. At what rate can it start instantly, and what is that in rpm?',
      steps: [
        '$f_s = 1600/\\sqrt{1 + 3} = 800$ steps/s.',
        'At 200 steps a revolution: 4 rev/s = 240 rpm.',
        'Faster moves need a ramp: the pull-out curve allows much more once the motor is up to speed.'
      ],
      a: '800 steps/s (240 rpm); ramp for anything faster.'
    }
  ],
  quiz: [
    { q: 'Doubling a stepper driver\'s supply voltage (same current setting) mainly…', choices: ['keeps the torque up to about twice the speed', 'doubles the holding torque', 'doubles the standstill heating', 'halves the step angle'], a: 0, why: 'The chopper still sets the current; the extra voltage forces it into the winding faster, so the corner speed rises.' },
    { q: 'What separates the pull-in and pull-out curves?', choices: ['The slew region: speeds and torques reachable only by ramping up', 'The holding torque', 'The detent torque', 'The resonance band'], a: 0, why: 'Below pull-in the motor can start and stop instantly; between the curves it can run but must be accelerated there.' },
    { q: 'Adding load inertia lowers the pull-out curve as much as the pull-in curve.', a: false, why: 'Inertia matters when accelerating: it lowers the start–stop (pull-in) rate strongly, while the steady-speed pull-out torque is set by the motor, driver and voltage.' },
    { q: 'Beyond the corner speed a stepper\'s torque falls roughly as…', choices: ['1/speed — about constant power', 'linearly to zero like a DC motor', 'as 1/speed²', 'not at all'], a: 0, why: 'The current falls with the rising impedance and back-EMF, so the torque drops roughly inversely and the mechanical power levels off.' },
    { q: 'A 2.5 mH winding must reach 4 A from zero on a 48 V supply. About how long does it take?', choices: ['About 0.2 ms', 'About 2 ms', 'About 20 µs', 'About 20 ms'], a: 0, why: '$t \\approx LI/V = 0.0025 \\times 4/48 \\approx 208$ µs.' }
  ],
  problems: [
    { q: 'A motor with 3.6 mH per phase is run at 3.0 A peak. Estimate its corner speed on a 60 V supply (1.8°, 50 teeth).', answer: 1061, unit: 'rpm', tol: 0.03, steps: ['$\\omega_c \\approx 60/(50 \\times 0.0036 \\times 3.0) = 111$ rad/s.', '$111 \\times 60/(2\\pi) = 1061$ rpm.'] },
    { q: 'At 1500 rpm a stepper still gives 0.74 N·m. What mechanical power is that?', answer: 116, unit: 'W', tol: 0.02, steps: ['$\\omega = 1500 \\times 2\\pi/60 = 157$ rad/s.', '$P = T\\omega = 0.74 \\times 157 = 116$ W.'] }
  ],
  choose: {
    good: [
      'High supply voltages (48–80 V) with a chopper driver when you need speed from a stepper.',
      'Low-inductance (parallel or high-current) windings for fast traverses.',
      'Moves that use a ramp, so the slew region above the pull-in curve is available.'
    ],
    avoid: [
      'Sizing from holding torque: at speed the torque may be half or less.',
      'Instant starts at high pulse rates, especially with heavy inertia.',
      'Running a driver at the top of its voltage rating: regeneration during deceleration can push it over.'
    ],
    check: [
      'The maker\'s pull-out curve at your voltage, current and microstep setting — and the curve\'s test conditions.',
      'A 30–50 % torque margin at your highest speed.',
      'The acceleration you need against the torque left after friction and gravity.',
      'Resonance dips at your running speeds.'
    ]
  },
  applications: [
    'CNC routers: NEMA 23 and 34 motors on 48–80 V drivers for traverses of 1000–1500 rpm.',
    '3-D printers moving from 12 V to 24 V supplies: the same NEMA 17 motors run faster before skipping.',
    'Explore the curves for your motor in [the stepper motor lab](#/tools/motorlab/stepper).'
  ],
  sources: [
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — dynamic characteristics: pull-in and pull-out torque, the effect of the drive circuit and supply voltage.',
    'P. P. Acarnley, *Stepping Motors: A Guide to Theory and Practice* — steady-state and starting characteristics.',
    'NEMA ICS 16, *Motion/Position Control Motors, Controls, and Feedback Devices* — definitions of holding, pull-in and pull-out torque for step motors.'
  ],
  sim: 'st-torque-speed'
},

{
  id: 'stepper-resonance', parent: 'stepper-basics', title: 'Resonance and how to beat it', level: 3,
  short: 'Held by its magnetic field, a stepper rotor is a mass on a spring: it rings at a natural frequency of one to a few hundred hertz after every step. When the step rate matches that frequency the ringing builds up, the motor growls, loses torque and may stall. Microstepping, damping, the driver\'s anti-resonance and quick acceleration through the band are the cures.',
  keywords: ['resonance', 'low-speed resonance', 'mid-band instability', 'natural frequency', 'ringing', 'overshoot', 'damping', 'anti-resonance', 'viscous damper', 'inertia damper', 'stall', 'vibration', 'noise', 'torsional stiffness'],
  prereq: ['stepper-torque-speed', 'physics:driven-oscillations', 'physics:damped-oscillations'],
  related: ['step-modes', 'stepper-drivers', 'closed-loop-steppers', 'motor-vibration', 'motor-noise', 'math:forced-oscillator-ode'],
  body: `
Near its rest position an energised stepper rotor is held by a torque that grows in proportion to its displacement: it is a torsion spring with stiffness

$$k = N_r\\,T_H$$

(newton-metres per radian). With the rotor and load inertia $J$ it forms a mass–spring system with a natural frequency

$$f_n = \\frac{1}{2\\pi}\\sqrt{\\frac{N_r T_H}{J}}$$

A 56 mm NEMA 23 (1.26 N·m, 300 g·cm²) alone rings at about 230 Hz; with an equal load inertia, at about 163 Hz; a NEMA 17 (0.42 N·m, 57 g·cm²) at about 305 Hz. Every full step is a kick: the rotor overshoots, swings back and settles over a few milliseconds, with very little damping — the only damping is friction and the currents the motion induces.

### Low-speed resonance
Step at a rate near $f_n$ and each new kick arrives just as the rotor swings forward again: the swings grow, as in any [[physics:driven-oscillations|driven oscillator]]. The motor growls, vibrates the machine, loses torque and may stall — typically at 1–3 revolutions per second (60–180 rpm) in full step. Weaker resonances appear at fractions of the natural frequency ($f_n/2$, $f_n/3$) because each kick is not a pure sine. The real pull-out curve has a notch there.

| Remedy | How it helps | Cost or catch |
|---|---|---|
| Microstepping | smaller kicks, nearly sinusoidal drive | pulse rate |
| Accelerate through the band | not enough time to build up | needs a ramp that passes the band quickly |
| Driver anti-resonance / damping | the driver senses the oscillation and adjusts the current angle | a driver feature, sometimes tuned to the load |
| Viscous inertia damper on the rear shaft | adds damping | extra inertia, needs a double-shaft motor |
| Change the load inertia or current | moves $f_n$ away from the working speed | may cost torque |
| Rubber mounts | isolate the frame from the vibration | less stiffness, the motor moves |
| Closed loop | corrects the rotor angle every cycle | cost |

### Mid-band instability
A second, nastier problem appears at medium speeds — often somewhere between a few and fifteen revolutions per second. Here the interaction between the rotor's swing, the back-EMF and the driver's current regulation can pump energy *into* the oscillation instead of taking it out: the motor runs fine, then suddenly stalls at a speed where the pull-out curve says it should have plenty of torque. Drivers fight it with **mid-band compensation**, adjusting the phase of the currents; some make it a switch or a tuning parameter. Adding inertia or damping, or changing the supply voltage, also moves or removes it.

### What you notice in a machine
- A growl or buzz at one speed and quiet at others: resonance.
- Worse with a light load and a stiff, low-friction mechanism — nothing takes the energy out.
- Belts and long couplings add their own springs, making new, lower resonances of the whole axis.
- Surface finish on a CNC part shows ripples at the resonant step rate.

In the simulation, the rotor is stepped at the rate you choose: watch the error between the rotor and the command ring after each step, grow near $f_n$, and vanish with microstepping or damping. Press *Sweep* for the whole resonance curve.

> [!tip] If an axis growls at a particular speed, first try finer microstepping and the driver's anti-resonance setting; then check that the acceleration takes the motor through that speed quickly rather than cruising in it.

> [!key] A stepper rotor is a mass on a magnetic spring with $f_n = \\frac{1}{2\\pi}\\sqrt{N_r T_H/J}$, a few hundred hertz. Stepping near that rate builds up ringing and can stall the motor; microstepping, damping and anti-resonance in the driver take it away.
`,
  ideas: [
    'Near rest the rotor is a torsion spring of stiffness N_r·T_H; with the inertia it rings at f_n = √(N_r T_H/J)/2π.',
    'Full-step rates near f_n (typically 1–3 rev/s) build up the ringing: noise, vibration, lost torque and stalls.',
    'More inertia lowers f_n; more holding torque raises it.',
    'Mid-band instability is an electromechanical effect at medium speeds, cured by the driver\'s compensation.',
    'Microstepping, damping and accelerating through the band are the practical cures.'
  ],
  pitfalls: [
    'A stall at medium speed means the motor is too small — It may be mid-band instability, with plenty of torque on the curve; driver compensation, damping or a different voltage can cure it.',
    'More load always makes resonance worse — Friction damps the ringing; a light, stiff, low-friction load is often the worst case.',
    'Resonance only matters in full step — Microstepping greatly reduces low-speed resonance but does not remove the mid-band instability or the resonances of belts and couplings.'
  ],
  formulas: [
    {
      name: 'Natural frequency of the rotor',
      expr: 'f = sqrt(Nr*Th/J)/(2*pi)', tex: 'f_n = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{N_r\\,T_H}{J}}',
      vars: {
        f: { name: 'natural frequency', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        Nr: { name: 'rotor teeth', int: true, value: 50, tex: 'N_r' },
        Th: { name: 'holding torque', q: 'torque', unit: 'N·m', value: 1.26, tex: 'T_H' },
        J: { name: 'rotor plus load inertia', q: 'inertia', unit: 'g·cm²', value: 300 }
      },
      note: 'Small oscillations about a rest position, energised at the holding current. Full-step rates near f_n resonate.',
      stories: { f: 'A 1.8° motor with {Th} holding torque drives a total inertia of {J}. At what frequency does it ring after each step?', J: 'A motor with {Th} holding torque rings at {f}. What total inertia is it moving?' }
    },
    {
      name: 'Torsional stiffness near rest',
      expr: 'k = Nr*Th', tex: 'k = N_r\\,T_H',
      vars: {
        k: { name: 'torsional stiffness', unit: 'N·m/rad' },
        Nr: { name: 'rotor teeth', int: true, value: 50, tex: 'N_r' },
        Th: { name: 'holding torque', q: 'torque', unit: 'N·m', value: 1.26, tex: 'T_H' }
      },
      note: 'The slope of T_H sin(N_r δ) at δ = 0. A disturbance torque ΔT twists the rotor by about ΔT/k radians.',
      stories: { k: 'How stiff, near its rest position, is a {Nr}-tooth stepper with {Th} holding torque?' }
    }
  ],
  examples: [
    {
      title: 'Where will it resonate?',
      q: 'A NEMA 23 (1.26 N·m, rotor 300 g·cm²) drives a pulley and belt that add 450 g·cm² at the motor. At what full-step rate and speed does it resonate?',
      steps: [
        'Total $J = 750$ g·cm² $= 7.5\\times10^{-5}$ kg·m².',
        '$f_n = \\frac{1}{2\\pi}\\sqrt{50 \\times 1.26/7.5\\times10^{-5}} = \\frac{1}{2\\pi}\\sqrt{840\\,000} = 146$ Hz.',
        'At 200 steps a revolution: 0.73 rev/s = 44 rpm. Cruising near 44 rpm in full step will growl; microstep, or pass through quickly.'
      ],
      a: 'About 146 full steps per second, 44 rpm.'
    },
    {
      title: 'How stiff is the holding?',
      q: 'The same motor holds an axis at rest. A cutting force puts a 0.2 N·m disturbance on the shaft. How far does the rotor twist?',
      steps: [
        '$k = 50 \\times 1.26 = 63$ N·m/rad.',
        '$\\delta \\approx 0.2/63 = 3.2$ mrad = 0.18° — a tenth of a full step.'
      ],
      a: 'About 0.18°, a tenth of a step.'
    }
  ],
  quiz: [
    { q: 'Doubling the inertia on a stepper shaft changes its natural frequency by a factor of…', choices: ['1/√2 (about 0.71)', '1/2', '2', '√2'], a: 0, why: '$f_n \\propto 1/\\sqrt{J}$.' },
    { q: 'A machine growls at 60 rpm in full step and runs quietly at 300 rpm. The most likely cause is…', choices: ['low-speed resonance near the rotor\'s natural frequency', 'too little supply voltage', 'a loose coupling', 'the wrong wiring'], a: 0, why: '60 rpm is 200 full steps per second — right in the typical natural-frequency range of a loaded rotor.' },
    { q: 'Which change usually reduces low-speed resonance the most, at no hardware cost?', choices: ['Finer microstepping', 'A higher supply voltage', 'Full step instead of half step', 'A longer motor cable'], a: 0, why: 'Microstepping replaces the full-step kicks by small increments, so little energy goes into the oscillation.' },
    { q: 'A low-friction, light load is the safest against resonance.', a: false, why: 'Friction takes energy out of the oscillation; a light, stiff, low-friction mechanism leaves the rotor almost undamped.' }
  ],
  problems: [
    { q: 'A NEMA 17 with 0.42 N·m holding torque and 57 g·cm² rotor inertia runs unloaded. What is its natural frequency?', answer: 305, unit: 'Hz', tol: 0.02, steps: ['$J = 5.7\\times10^{-6}$ kg·m².', '$f_n = \\frac{1}{2\\pi}\\sqrt{50 \\times 0.42/5.7\\times10^{-6}} = \\frac{1}{2\\pi}\\sqrt{3.68\\times10^6} = 305$ Hz.'] }
  ],
  choose: {
    good: [
      'Microstepping drivers with anti-resonance for smooth running at all speeds.',
      'Viscous inertia dampers on double-shaft motors where the drive cannot be changed.',
      'Closed-loop steppers where resonance-induced stalls are unacceptable.'
    ],
    avoid: [
      'Cruising in full step at the natural-frequency speed.',
      'Very light, stiff, undamped loads on large motors without driver damping.',
      'Long, springy couplings and belts that add low axis resonances.'
    ],
    check: [
      'The natural frequency with your load inertia, and your working speeds against it.',
      'Whether the driver has mid-band compensation and how it is set.',
      'The machine\'s noise and vibration across the whole speed range, not only at the top speed.'
    ]
  },
  applications: [
    'CNC and engraving machines: anti-resonance drivers keep surface finish free of ripples at low feed rates.',
    'Camera sliders and telescopes: fine microstepping at very low speeds, well away from resonance kicks.',
    'Retrofits: a viscous damper on the rear shaft cures a growling axis without changing the drive.'
  ],
  sources: [
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — oscillation, resonance and instability of stepping motors, and damping methods.',
    'P. P. Acarnley, *Stepping Motors: A Guide to Theory and Practice* — single-step response, resonance and mid-frequency instability, damping.',
    'A. Hughes and B. Drury, *Electric Motors and Drives* — the chapter on stepping motors: resonance and instability.'
  ],
  sim: 'st-resonance'
},

{
  id: 'stepper-drivers', parent: 'stepper-drivers-topic', title: 'Stepper drivers: choppers and current control', level: 2,
  short: 'A stepper driver turns step and direction pulses into two phase currents. Each phase has an H-bridge that switches the full supply across the winding and chops it tens of thousands of times a second to hold the current at its set value; the decay mode decides how fast the current can fall. Drivers range from a chip on a stamp-sized board to AC-powered boxes for NEMA 42 motors.',
  keywords: ['stepper driver', 'chopper', 'constant current', 'current control', 'H-bridge', 'sense resistor', 'Vref', 'slow decay', 'fast decay', 'mixed decay', 'off-time', 'chopping frequency', 'supply voltage', 'power supply', 'regeneration', 'driver heat', 'L/R drive', 'indexer'],
  prereq: ['bipolar-unipolar', 'pwm-speed-control', 'electronics:h-bridge'],
  related: ['dip-switch-settings', 'step-dir-signals', 'stepper-torque-speed', 'closed-loop-steppers', 'h-bridge', 'electronics:pwm', 'electronics:heat-sinks', 'electronics:flyback-diode'],
  body: `
A stepper driver does three jobs. An **indexer** counts the step pulses and keeps an electrical angle; a **sine table** turns that angle into two target currents, $I\\cos\\theta_e$ and $I\\sin\\theta_e$; and two **current regulators** — one [[h-bridge|H-bridge]] per phase — force the winding currents to follow the targets.

### Why a chopper
A winding of 0.9 Ω needs only 2.5 V to carry 2.8 A at standstill, but at speed it needs tens of volts to force the current in against its inductance and back-EMF ([[stepper-torque-speed]]). The old answer was an **L/R drive**: a supply several times the rated voltage with series resistors to limit the current — it speeds the current rise, but the resistors burn most of the power. The modern answer is the **chopper**: connect the full supply (24–80 V) across the winding, let the current rise quickly, and switch off the moment it reaches the target; let it decay a little, switch on again. The current is held at the set value by switching 20–40 kHz — above hearing, though small drivers at lower chopping frequencies whine.

The current is measured with a small **sense resistor** (0.05–0.3 Ω) in each bridge, compared with a reference: on driver chips the set current is $I = V_{ref}/(G R_s)$, with a gain $G$ fixed by the chip (the setting you adjust with the little potentiometer on a carrier board). Boxed drivers set it with DIP switches or software ([[dip-switch-settings]]).

### Decay modes
While the bridge is "off", the winding current must go somewhere:

| Decay | What the bridge does | Current falls | Good for | Catch |
|---|---|---|---|---|
| Slow | shorts the winding through two low-side (or high-side) switches | slowly (only $R$ and the back-EMF) | low ripple, quiet, standstill | cannot follow a falling target at speed: distorted current, noise, lost torque |
| Fast | reverses the bridge, pushing the current back into the supply | quickly (the whole supply) | following the sine at speed | large ripple, more loss and heat |
| Mixed | fast for part of the off-time, then slow | in between | the usual default | may need tuning to the motor |

Many drivers pick the mix automatically, or measure the motor at power-up and tune themselves.

### Sizes and classes
| Class | Typical size | Supply | Phase current | Inputs and settings | Motors |
|---|---|---|---|---|---|
| Driver chip on a carrier board | 15 × 20 mm, plus a heat sink | 8–35 V (some to 45–50 V) | 0.5–2 A | logic-level step/dir; a trimmer, some with a serial interface | NEMA 14–17 |
| Compact DIN-rail or panel driver | about 100–120 × 60–80 × 25–35 mm | 20–50 V DC | 1–4.2 A peak | opto-isolated step/dir/enable, DIP switches | NEMA 17–23 |
| Mid-size driver | about 120–150 × 90–100 × 35–50 mm | 24–80 V DC | up to 6–7 A peak | as above, often anti-resonance | NEMA 23–34 |
| AC-input driver | about 150–180 × 100 × 60 mm, with a fan or large heat sink | 80–230 V AC | 6–8 A peak | as above, alarm output | NEMA 34–42 |

### Power, heat and the supply
Because a chopper is a switching regulator, the **supply current is much smaller than the phase current**. At standstill a NEMA 23 at 3.96 A peak (2.8 A RMS) dissipates about $I_{pk}^2R$ = 14 W in its windings; the driver adds 3–5 W; from a 48 V supply that is under 0.4 A. Running, the supply delivers the mechanical output plus the motor and driver losses. A common rule of thumb for a first supply size allows about two-thirds of the motor's phase current per motor, at the driver's supply voltage — then check the real draw.

- **Regeneration:** a decelerating inertia drives the motor as a generator and pumps energy back, raising the supply voltage. Leave 10–20 % between the supply and the driver's maximum, and add a clamp (regen) module on big, fast axes.
- **Driver heat:** mount it on metal with the fins vertical, keep the cabinet air below about 40–50 °C, and derate the current above that.
- **Motor heat:** case temperatures of 60–90 °C are common and within the typical class B (130 °C) insulation — but hot enough to burn skin and to soften plastic mounts.
- **Protection:** drivers trip on overcurrent (a short between phases or to earth), over- and undervoltage and overtemperature, and report it through an LED code and an alarm output.

In the simulation, watch one phase's bridge switch and its current ripple around the target; change the decay mode at speed and see why fast or mixed decay is needed when the current must fall.

> [!warn] AC-input drivers and the power supplies of DC drivers are mains equipment: installation belongs to a qualified person, with the supply isolated and locked off. Their capacitors stay charged after switch-off — wait, then measure. Never connect or disconnect a motor while the driver is powered.

> [!key] A chopper driver holds each phase current at its set value by switching a high supply across the winding: high voltage for speed, current for torque. The decay mode decides how quickly the current can fall; the supply current is far smaller than the phase current.
`,
  ideas: [
    'The indexer counts pulses, a sine table sets two target currents, and a chopper H-bridge per phase regulates each one.',
    'A chopper uses a supply many times the winding\'s I·R so the current rises fast, and switches to hold it at the set value.',
    'Slow decay gives low ripple but cannot pull the current down quickly; fast decay can, with more ripple; mixed decay is the usual compromise.',
    'The supply current is far below the phase current: a chopper is a switching regulator.',
    'Leave voltage headroom for regeneration, and cool both the driver and the motor.'
  ],
  pitfalls: [
    'A 3 V motor must run from 3 V — The rated voltage (I·R) only says what drives rated current at standstill; a chopper runs it from 24–80 V and limits the current.',
    'The power supply must deliver the phase current times the number of phases — The chopper converts voltage down; the supply delivers roughly the power used, often well under the phase current.',
    'Fast decay is always better because it follows the sine — At low speed and standstill it adds ripple, loss and noise; slow or mixed decay is better there.'
  ],
  formulas: [
    {
      name: 'Current set by the sense resistor',
      expr: 'I = Vref/(G*Rs)', tex: 'I = \\dfrac{V_{ref}}{G\\,R_s}',
      vars: {
        I: { name: 'set (peak) phase current', q: 'current', unit: 'A' },
        Vref: { name: 'reference voltage', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_{ref}' },
        G: { name: 'current-sense gain of the chip (from its datasheet)', value: 8, tex: 'G' },
        Rs: { name: 'sense resistor', q: 'resistance', unit: 'Ω', value: 0.1, tex: 'R_s' }
      },
      note: 'For driver chips on carrier boards; G differs between chips (5 and 8 are common) — read it in the chip\'s datasheet.',
      stories: { Vref: 'A driver board has {Rs} sense resistors and a chip gain of {G}. What reference voltage sets {I}?', I: 'With {Rs} sense resistors, a gain of {G} and a reference of {Vref}, what current does the driver set?' }
    },
    {
      name: 'Current ripple during the off-time',
      expr: 'dI = (Vd + R*I)*toff/L', tex: '\\Delta I = \\dfrac{(V_d + R\\,I)\\,t_{off}}{L}',
      vars: {
        dI: { name: 'fall of the current in one off-time', q: 'current', unit: 'A', tex: '\\Delta I' },
        Vd: { name: 'voltage driving the decay (≈ 0 slow, the supply for fast)', q: 'voltage', unit: 'V', value: 48, tex: 'V_d' },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 0.9 },
        I: { name: 'phase current', q: 'current', unit: 'A', value: 4 },
        toff: { name: 'off-time', q: 'time', unit: 'µs', value: 20, tex: 't_{off}' },
        L: { name: 'winding inductance', q: 'inductance', unit: 'mH', value: 2.5 }
      },
      note: 'At standstill, ignoring the back-EMF. Slow decay (V_d ≈ 0) gives a few tens of mA; fast decay (V_d = supply) ten times more.',
      stories: { dI: 'A winding of {L} and {R} carries {I}; the driver decays it with {Vd} for {toff}. How far does the current fall?' }
    },
    {
      name: 'Supply current at standstill',
      expr: 'Is = (Ipk^2*R + Pd)/V', tex: 'I_s = \\dfrac{I_{pk}^2 R + P_d}{V}',
      vars: {
        Is: { name: 'average supply current', q: 'current', unit: 'A', tex: 'I_s' },
        Ipk: { name: 'peak phase current (sine microstepping)', q: 'current', unit: 'A', value: 3.96, tex: 'I_{pk}' },
        R: { name: 'winding resistance per phase', q: 'resistance', unit: 'Ω', value: 0.9 },
        Pd: { name: 'driver\'s own loss', q: 'power', unit: 'W', value: 4, tex: 'P_d' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 48 }
      },
      note: 'With sine currents the two phases together dissipate I_pk² R at every position. Running, add the mechanical output and the iron losses.',
      stories: { Is: 'A motor with {R} per phase holds at {Ipk} peak from a {V} supply; the driver loses {Pd}. What current does the supply deliver?' }
    }
  ],
  examples: [
    {
      title: 'Setting a carrier-board driver',
      q: 'A driver board has 0.1 Ω sense resistors and a chip gain of 8. The NEMA 17 is rated 1.5 A. What reference voltage sets a peak of 1.5 A, and what if you want 70 % for a cooler motor?',
      steps: [
        '$V_{ref} = I\\,G\\,R_s = 1.5 \\times 8 \\times 0.1 = 1.2$ V.',
        '70 %: $1.05 \\times 0.8 = 0.84$ V.',
        'Measure between the trimmer\'s wiper and ground with the motor connected and the board powered — and check the motor\'s temperature after half an hour.'
      ],
      a: '1.2 V for 1.5 A; 0.84 V for 1.05 A.'
    },
    {
      title: 'Sizing a supply for a three-axis router',
      q: 'Three NEMA 23 motors (2.8 A, 0.9 Ω) run on 48 V drivers. While cutting, each gives about 50 W of mechanical power. Estimate the supply current.',
      steps: [
        'Losses per motor: copper $I_{pk}^2R \\approx 14$ W plus the driver\'s 4 W: 18 W.',
        'Per axis while cutting: $50 + 18 \\approx 68$ W; three axes: about 205 W, or $205/48 = 4.3$ A.',
        'The two-thirds rule gives $3 \\times \\tfrac{2}{3} \\times 2.8 = 5.6$ A. A 48 V supply of 350 W (7.3 A) covers both with a margin.'
      ],
      a: 'About 4–6 A at 48 V: a 350 W supply is comfortable.'
    }
  ],
  quiz: [
    { q: 'Why does a chopper driver use a supply of 48 V for a winding that needs only 2.5 V at rated current?', choices: ['To force the current into the inductance quickly at speed, while the chopper limits it', 'To raise the holding torque', 'Because the motor is rated 48 V', 'To reduce the chopping frequency'], a: 0, why: 'At standstill the chopper holds the current at the set value; the high voltage matters only when the current must change fast.' },
    { q: 'At high speed with slow decay only, the phase current…', choices: ['cannot fall fast enough, so it distorts and the torque falls', 'rises above the set value', 'falls to zero', 'becomes a perfect sine'], a: 0, why: 'Slow decay lets the current fall only through R and the back-EMF; a falling sine target at speed needs fast or mixed decay.' },
    { q: 'The supply current of a stepper driver at standstill is roughly equal to the phase current.', a: false, why: 'The chopper works like a buck converter: the supply delivers only the losses (about 14–20 W for a NEMA 23), far less than the phase current at 48 V.' },
    { q: 'What does regeneration during deceleration do to a stepper system?', choices: ['Pumps energy back and raises the supply voltage', 'Lowers the supply voltage', 'Overheats the motor windings', 'Reverses the motor'], a: 0, why: 'The decelerating inertia drives the motor as a generator; the energy flows back through the bridges into the supply capacitors.' }
  ],
  problems: [
    { q: 'A driver chip with a gain of 5 uses 0.22 Ω sense resistors. What reference voltage sets a peak current of 1.2 A?', answer: 1.32, unit: 'V', tol: 0.02, steps: ['$V_{ref} = I\\,G\\,R_s = 1.2 \\times 5 \\times 0.22 = 1.32$ V.'] },
    { q: 'A NEMA 34 with 0.6 Ω per phase holds at 5.9 A peak from a 70 V supply; the driver loses 6 W. What is the supply current?', answer: 0.384, unit: 'A', tol: 0.03, steps: ['Copper: $5.9^2 \\times 0.6 = 20.9$ W; plus 6 W = 26.9 W.', '$26.9/70 = 0.384$ A.'] }
  ],
  choose: {
    good: [
      'Chip drivers on carrier boards: 3-D printers and small machines with NEMA 14–17 motors under 2 A.',
      'Boxed opto-isolated drivers with DIP switches: industrial machines, long cables, PLC control.',
      'AC-input drivers: NEMA 34–42 motors where a high bus voltage is needed for speed.'
    ],
    avoid: [
      'L/R (resistor) drives: they waste power and heat the cabinet.',
      'Running a driver at its maximum voltage or current with no cooling margin.',
      'Tiny chip drivers without a heat sink at their nominal current.'
    ],
    check: [
      'Supply voltage range (with regeneration headroom) and peak/RMS current range against the motor.',
      'Input type (logic, opto 5/24 V, differential) and the maximum pulse rate.',
      'Decay modes, anti-resonance and idle current reduction.',
      'Size, mounting (DIN rail or panel), cooling and the ambient temperature.',
      'Protection features and an alarm output your controller can read.'
    ]
  },
  applications: [
    '3-D printers: chip drivers with automatic decay tuning and near-silent low-speed modes.',
    'CNC routers: 48–80 V boxed drivers for NEMA 23 and 34 motors, on a shared supply.',
    'Packaging machines: DIN-rail drivers with alarm outputs wired to the PLC.',
    'Watch the chopper in [the drives tools](#/tools/drives/stepdir).'
  ],
  sources: [
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — drive circuits: L/R, bilevel and chopper drives, current control.',
    'N. Mohan, *Electric Drives* — switch-mode converters and current-controlled drives.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines* — supply isolation, protection and wiring of machine drives.',
    'Stepper driver chip datasheets define the current-sense relation I = V_ref/(G R_s) and the decay modes described here.'
  ],
  sim: 'st-chopper'
},

{
  id: 'dip-switch-settings', parent: 'stepper-drivers-topic', title: 'DIP switches: microsteps, current and idle reduction', level: 1,
  short: 'Most boxed stepper drivers are set with a row of small DIP switches: typically three for the phase current, one for the current at standstill, and four for the microstep resolution — sometimes more for decay, pulse mode or self-test. Set them for your motor\'s rated current and connection, your controller\'s pulse rate and the holding torque you need.',
  keywords: ['DIP switch', 'dip switches', 'driver settings', 'current setting', 'peak current', 'RMS current', 'idle current', 'standstill current reduction', 'microstep setting', 'steps per revolution', 'pulse mode', 'self-test', 'decay setting', 'SW1', 'SW8'],
  prereq: ['stepper-drivers', 'step-modes'],
  related: ['step-dir-signals', 'bipolar-unipolar', 'stepper-sizing', 'motor-heating'],
  body: `
Open the front of a typical boxed two-phase driver and you find a row of eight tiny switches. They set everything a machine builder normally needs; the pattern below is **generic and typical** — every maker has its own table, printed on the driver's side and in its manual, and that table governs.

### A typical switch layout
| Switches | Sets | Typical choices |
|---|---|---|
| SW1–SW3 | phase current | 8 steps, e.g. 1.0–4.2 A peak |
| SW4 | current at standstill | OFF: half (reduced), ON: full |
| SW5–SW8 | microsteps per revolution | 16 settings, 400–51 200 and 1000–25 000 |

Other switches seen on some drivers: pulse mode (step/direction or CW/CCW pulses), the active pulse edge, decay or smoothing, motor type, self-test (the driver runs the motor by itself) and automatic tuning at power-up. Some drivers read the switches only at power-up — change them with the power off.

### Current (SW1–SW3)
| SW1 | SW2 | SW3 | Peak | RMS |
|---|---|---|---|---|
| ON | ON | ON | 1.0 A | 0.71 A |
| OFF | ON | ON | 1.5 A | 1.06 A |
| ON | OFF | ON | 2.0 A | 1.41 A |
| OFF | OFF | ON | 2.5 A | 1.77 A |
| ON | ON | OFF | 2.9 A | 2.05 A |
| OFF | ON | OFF | 3.3 A | 2.33 A |
| ON | OFF | OFF | 3.8 A | 2.69 A |
| OFF | OFF | OFF | 4.2 A | 2.97 A |

The RMS column is the peak divided by √2. **Which to match to the motor?** A motor's rated current is quoted with both phases on (full step). With sine microstepping the two phases together dissipate $I_{pk}^2R$, which equals the full-step heating $2I_r^2R$ when $I_{pk} = \\sqrt2\\,I_r$ — so setting the **RMS equal to the rated current** gives the rated heating and the full holding torque. Setting the peak equal to the rated current runs the motor cooler (half the copper loss) with about 71 % of the torque — a common choice when the torque is not needed. For a 2.8 A motor the nearest rows are 2.69 A RMS (3.8 A peak) or 2.97 A RMS (4.2 A peak, a little hot); take the lower. For 6- and 8-lead motors, use the current for your connection ([[bipolar-unipolar]]).

### Idle current (SW4)
With reduction on, the driver drops the current to about 50 % (some 60 %) after roughly half a second without pulses. Holding torque falls to the same fraction, and the heat to a quarter ($0.5^2$). Leave it on for most machines — the motor runs far cooler — but check that half the holding torque still holds a vertical axis, a spring or a belt tension, and that the small jump when full current returns does not mark the work.

### Microsteps (SW5–SW8)
| SW5 SW6 SW7 SW8 | steps/rev | SW5 SW6 SW7 SW8 | steps/rev |
|---|---|---|---|
| ON ON ON ON | 400 | ON ON ON OFF | 1000 |
| OFF ON ON ON | 800 | OFF ON ON OFF | 2000 |
| ON OFF ON ON | 1600 | ON OFF ON OFF | 4000 |
| OFF OFF ON ON | 3200 | OFF OFF ON OFF | 5000 |
| ON ON OFF ON | 6400 | ON ON OFF OFF | 8000 |
| OFF ON OFF ON | 12 800 | OFF ON OFF OFF | 10 000 |
| ON OFF OFF ON | 25 600 | ON OFF OFF OFF | 20 000 |
| OFF OFF OFF ON | 51 200 | OFF OFF OFF OFF | 25 000 |

Choose the finest setting your controller can feed at top speed ([[step-modes]]): at 1000 rpm, 3200 steps/rev needs 53 kHz and 25 600 needs 427 kHz. Decimal settings give round steps per millimetre: 2000 steps/rev on a 5 mm screw is 400 steps/mm. Whatever you choose, the **controller must be told the same number**, or every move comes out the wrong length.

### A setting-up routine
1. Read the motor's rated current and connection; pick the current row (RMS ≤ rated).
2. Pick the microsteps from the controller's pulse limit and the resolution you need; enter the same steps per unit in the controller.
3. Idle reduction on, unless the axis must hold full torque at rest.
4. Power up, run the machine for half an hour and feel the motor case (carefully): 60–80 °C is normal, over 90 °C means less current or more cooling.

In the simulation, flip the switches and watch the tables, the current, the heat and the speed the pulse rate allows.

> [!warn] Setting the current well above the motor's rating overheats the winding and can partly demagnetise the rotor; setting it far below leaves the motor too weak and it will lose steps. Change switches with the power off, and follow the actual driver's table.

> [!key] Three switches for current (match the RMS to the rated current), one for idle reduction (half current at rest), four for microsteps (the finest your controller can feed) — and tell the controller the same steps per revolution.
`,
  ideas: [
    'A typical driver uses SW1–SW3 for current, SW4 for idle reduction and SW5–SW8 for microsteps; the actual driver\'s table governs.',
    'RMS = peak/√2; setting the RMS to the motor\'s rated current gives the rated heating and full holding torque.',
    'Idle reduction halves the current at rest: half the holding torque, a quarter of the heat.',
    'The microstep setting and the controller\'s steps per unit must match.',
    'Change DIP switches with the power off; some drivers read them only at power-up.'
  ],
  pitfalls: [
    'Set the peak current to the motor\'s rated current for full torque — That gives about 71 % of the rated torque (and half the heat); the RMS matches the rated current for full torque.',
    'Idle reduction weakens the motor while it moves — It acts only after the pulses stop; but at rest the holding torque is halved, which matters on vertical axes.',
    'Changing the microstep switches only changes smoothness — It changes the steps per revolution: unless the controller is changed to match, every move is the wrong length.'
  ],
  formulas: [
    {
      name: 'RMS and peak current',
      expr: 'Irms = Ipk/sqrt(2)', tex: 'I_{rms} = \\dfrac{I_{pk}}{\\sqrt2}',
      vars: {
        Irms: { name: 'RMS phase current', q: 'current', unit: 'A', tex: 'I_{rms}' },
        Ipk: { name: 'peak phase current', q: 'current', unit: 'A', value: 3.8, tex: 'I_{pk}' }
      },
      note: 'For sine microstepping currents. Match I_rms to the motor\'s rated current for the rated heating.',
      stories: { Ipk: 'A motor is rated {Irms} per phase. What peak current gives the same heating with sine microstepping?' }
    },
    {
      name: 'Heat at idle current',
      expr: 'Pi = P0*r^2', tex: 'P_i = P_0\\,r^2',
      vars: {
        Pi: { name: 'copper loss at the reduced current', q: 'power', unit: 'W', tex: 'P_i' },
        P0: { name: 'copper loss at full current', q: 'power', unit: 'W', value: 14, tex: 'P_0' },
        r: { name: 'idle current as a fraction of full', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 }
      },
      note: 'Copper loss goes with the square of the current; the holding torque with the current itself.',
      stories: { Pi: 'A motor dissipates {P0} at full current. How much at an idle current of {r}?' }
    },
    {
      name: 'Top speed the pulse rate allows',
      expr: 'n = fmax/N', tex: 'n_{max} = \\dfrac{f_{max}}{N}',
      vars: {
        n: { name: 'highest speed', q: 'frequency', unit: 'rpm', tex: 'n_{max}' },
        fmax: { name: 'highest pulse rate of the controller or driver input', q: 'frequency', unit: 'kHz', value: 200, tex: 'f_{max}' },
        N: { name: 'steps per revolution (the DIP setting)', int: true, value: 25600 }
      },
      stories: { n: 'A controller outputs up to {fmax}; the driver is set to {N} steps a revolution. What is the top speed?', N: 'A controller outputs up to {fmax}; the motor must reach {n}. What is the finest setting (steps per revolution) you can use?' }
    }
  ],
  examples: [
    {
      title: 'Setting a driver for a NEMA 23',
      q: 'A NEMA 23 rated 2.8 A (4-lead) on the generic driver above; the controller outputs up to 100 kHz; the axis needs 900 rpm on a 5 mm ball screw. Choose the switches.',
      steps: [
        'Current: RMS ≤ 2.8 A — the 3.8 A peak / 2.69 A RMS row (SW1 ON, SW2 OFF, SW3 OFF).',
        'Pulse limit: $100\\,000/(900/60) = 6667$ steps/rev at most. 4000 steps/rev needs 60 kHz and gives 800 steps/mm: SW5 ON, SW6 OFF, SW7 ON, SW8 OFF.',
        'Idle reduction on (SW4 OFF on this layout) if the axis is horizontal.',
        'Enter 800 steps/mm in the controller.'
      ],
      a: 'SW1–3: ON OFF OFF (2.69 A RMS); SW4 reduced; SW5–8: ON OFF ON OFF (4000 steps/rev); 800 steps/mm in the controller.'
    }
  ],
  quiz: [
    { q: 'A motor is rated 2.0 A per phase. To get its full rated holding torque on a sine-microstepping driver, set…', choices: ['about 2.0 A RMS (2.8 A peak)', '2.0 A peak', '4.0 A peak', '1.4 A RMS'], a: 0, why: 'I_pk = √2 × rated gives the same copper loss as the full-step rating and the full torque.' },
    { q: 'Idle current reduction to 50 % cuts the motor\'s standstill heat to about…', choices: ['25 %', '50 %', '71 %', '10 %'], a: 0, why: 'Copper loss ∝ I²: 0.5² = 0.25.' },
    { q: 'You change the microstep switches from 1600 to 3200 steps/rev and change nothing else. Every move now travels…', choices: ['half as far', 'twice as far', 'the same distance, more smoothly', 'the same distance, twice as fast'], a: 0, why: 'Each pulse is now half as large, and the controller still sends the same number of pulses.' },
    { q: 'DIP switch settings are the same on all stepper drivers.', a: false, why: 'Every maker has its own table (even ON may mean logic 0). The tables here are generic; always follow the actual driver\'s manual.' }
  ],
  problems: [
    { q: 'A controller outputs at most 250 kHz. The driver is set to 12 800 steps a revolution. What is the top speed in rpm?', answer: 1172, unit: 'rpm', tol: 0.01, steps: ['$250\\,000/12\\,800 = 19.53$ rev/s.', '$\\times 60 = 1172$ rpm.'] }
  ],
  choose: {
    good: [
      'DIP-switch drivers: simple machines set up once, where no software is wanted in the field.',
      'Idle reduction on horizontal axes and anything that does not need full holding torque at rest.',
      'Decimal microstep settings for round steps per millimetre.'
    ],
    avoid: [
      'Full current at rest when it is not needed: a hot motor and wasted energy.',
      'Microstep settings the controller cannot feed at top speed.',
      'Guessing the table: ON and OFF conventions and values differ between drivers.'
    ],
    check: [
      'Whether the table gives peak or RMS current, and the motor\'s rating for your connection.',
      'The holding torque at the reduced current on vertical or spring-loaded axes.',
      'That the controller\'s steps per unit match the switch setting.',
      'Whether switches are read only at power-up.'
    ]
  },
  applications: [
    'CNC retrofits: one driver per axis, set by DIP switches to the motor and the screw pitch.',
    'Conveyor indexing: coarse microstepping, idle reduction on, simple PLC pulses.',
    'Try the switches in the simulation, or in [the step and direction tool](#/tools/drives/stepdir).'
  ],
  sources: [
    'Stepper driver manuals of many makers use DIP-switch tables of this general form (current, standstill reduction, microstep resolution); the tables here are generic, not any one product\'s.',
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — microstepping and current setting.',
    'NEMA ICS 16, *Motion/Position Control Motors, Controls, and Feedback Devices* — step motor ratings (rated current, holding torque).'
  ],
  sim: 'st-dip'
},

{
  id: 'step-dir-signals', parent: 'stepper-drivers-topic', title: 'Step, direction and enable signals', level: 2,
  short: 'A controller commands a stepper driver with three signals: a pulse for every step, a level for the direction and an enable. In industrial drivers they drive optocouplers made for 5 V (series resistors or a jumper for 12 and 24 V) and must respect minimum pulse widths and set-up times; an alarm output reports faults back.',
  keywords: ['step direction', 'step/dir', 'pulse direction', 'PUL', 'DIR', 'ENA', 'enable', 'optocoupler input', 'opto-isolated', '5 V', '24 V', 'series resistor', 'common anode', 'common cathode', 'NPN', 'PNP', 'differential line driver', 'pulse width', 'set-up time', 'maximum pulse frequency', 'alarm output', 'CW/CCW'],
  prereq: ['stepper-drivers', 'electronics:optocouplers'],
  related: ['dip-switch-settings', 'command-interfaces', 'closed-loop-steppers', 'emergency-stop', 'electronics:logic-families', 'electronics:schmitt-trigger'],
  body: `
Step and direction is the simplest motion interface there is: every pulse on **PUL** (step) moves the motor one (micro)step; the level on **DIR** says which way; **ENA** (enable) energises or frees the motor. The pulse *rate* is the speed, the pulse *count* the distance — so a microcontroller, a PLC's pulse output or a motion card can drive any number of axes.

### The inputs: optocouplers
Boxed drivers isolate their inputs with **optocouplers**: each signal is a pair of terminals (PUL+ and PUL−) across an LED in series with a resistor inside the driver. Light the LED with about 7–16 mA and the driver sees the signal. The internal resistor is usually chosen for **5 V**; for 12 V or 24 V signals, add an external series resistor — typically about 1 kΩ for 12 V and 2 kΩ for 24 V — or use the driver's 24 V terminals or jumper, where it has them:

$$R_{ext} = \\frac{V - V_F}{I_F} - R_{\\mathrm{int}}$$

Too little current and pulses are missed, above all short ones at high rates; too much and the LED is destroyed.

**Wiring the common.** With a controller whose outputs sink current (NPN, open-collector), join PUL+, DIR+ and ENA+ to the positive signal supply and switch the − terminals: *common anode*. With sourcing (PNP) outputs, join the − terminals to 0 V and drive the + terminals: *common cathode*. Best of all for long cables and high rates is a **differential line driver** (RS-422 style): each signal and its inverse on a twisted pair, into both terminals.

### Timing
| Requirement | Typical opto input | Typical differential input |
|---|---|---|
| Pulse width, high and low | ≥ 2.5 µs (some ≥ 1 µs) | ≥ 0.25–1 µs |
| Maximum pulse rate | 200–500 kHz | 1–4 MHz |
| DIR set-up before the active edge | ≥ 5 µs | ≥ 1–5 µs |
| DIR hold after the edge | ≥ 5 µs | similar |
| ENA before the first pulse | ≥ 5 µs to a few hundred ms after power-up | similar |

The **direction set-up time** is the classic trap: if DIR changes too close to a pulse edge, that pulse may be counted the wrong way. An optocoupler switches off more slowly than it switches on, so the fault often strikes in one direction only and does not cancel out — two steps lost per back-and-forth cycle, which on a machine that reverses thousands of times a day becomes millimetres of drift. Many drivers let you choose the active edge (rising or falling) and a pulse mode (step/direction, or separate CW and CCW pulse inputs).

### Enable and alarm
On many drivers, energising the ENA optocoupler **disables** the output (the motor goes limp) and leaving it unconnected means enabled — read the manual. The **alarm output** is usually an open-collector optotransistor (typically rated about 30 V, 50 mA) that switches on — or off — when the driver trips on overcurrent, over- or undervoltage, overtemperature or, on closed-loop drivers, position error. Wire it back to the controller and stop the machine on it.

### Noise and faults
The motor leads carry 48–80 V chopped at 20–40 kHz: route signal cables separately, in shielded twisted pairs with the shield earthed at one end, and prefer 24 V or differential signals on runs of more than a few metres. Some drivers have a selectable input filter.

| Symptom | Likely cause | Remedy |
|---|---|---|
| Motor holds but never moves | pulses too short or too weak; wrong common | check pulse width and opto current, the common wiring |
| Moves one way only | DIR not wired, or its common wrong | check DIR+ and DIR− |
| Position drifts after many reversals | DIR set-up time too short | delay the first pulse after a DIR change |
| Distances wrong by 2×, 4× … | microstep setting ≠ controller setting | match steps per unit |
| Erratic at high speed only | pulse rate above the input limit, or noise | lower the microstep setting, use differential signals |
| Motor free when it should hold | ENA logic inverted | check the enable polarity |

In the simulation, choose the signal voltage and resistor, the pulse width and the direction set-up time, and watch the timing diagram and the pulse counter.

> [!warn] The enable input is not a safety function. Removing enable, or stopping the pulses, does not meet the requirements for an emergency stop or safe torque off; use drives or contactor circuits designed and validated for that under ISO 13849-1 and IEC 60204-1, and remember that a stepper axis that is disabled cannot hold a vertical load.

> [!key] One pulse per step on PUL, the direction on DIR (set up a few microseconds before the edge), enable on ENA; opto inputs want 7–16 mA — add about 1 kΩ at 12 V and 2 kΩ at 24 V — and the alarm output belongs in the controller's stop chain.
`,
  ideas: [
    'Pulse rate sets the speed, pulse count the distance, DIR the direction, ENA whether the motor is energised.',
    'Opto inputs need about 7–16 mA: add a series resistor (about 1 kΩ at 12 V, 2 kΩ at 24 V) on a 5 V input.',
    'Respect the minimum pulse width and the DIR set-up time, or pulses are missed or counted the wrong way.',
    'Differential line drivers carry high pulse rates over long cables; opto inputs typically top out at 200–500 kHz.',
    'Enable is not a safety function; wire the alarm output to stop the machine.'
  ],
  pitfalls: [
    'A 24 V PLC output can drive a 5 V opto input directly — Without a series resistor the LED current is several times its rating and the input fails; use the 24 V terminals or add about 2 kΩ.',
    'Direction can change at the same moment as the pulse — The driver needs the new DIR level a few microseconds before the active edge; otherwise a step goes the wrong way on each reversal.',
    'Disabling the driver is a safe way to stop the machine — Enable is not a certified safety function, and a disabled stepper cannot hold its load.'
  ],
  formulas: [
    {
      name: 'Series resistor for an opto input',
      expr: 'R = (V - Vf)/If - Ri', tex: 'R_{ext} = \\dfrac{V - V_F}{I_F} - R_{\\mathrm{int}}',
      vars: {
        R: { name: 'external series resistor', q: 'resistance', unit: 'Ω', tex: 'R_{ext}' },
        V: { name: 'signal voltage', q: 'voltage', unit: 'V', value: 24 },
        Vf: { name: 'LED forward voltage', q: 'voltage', unit: 'V', value: 1.2, tex: 'V_F' },
        If: { name: 'LED current wanted', q: 'current', unit: 'mA', value: 10, tex: 'I_F' },
        Ri: { name: 'resistor inside the driver', q: 'resistance', unit: 'Ω', value: 270, tex: 'R_{\\mathrm{int}}' }
      },
      note: 'For a driver input designed for 5 V. Aim for the middle of the driver\'s specified current range.',
      stories: { R: 'A driver input has {Ri} inside and an LED dropping {Vf}. What resistor gives {If} from a {V} signal?', If: 'A {V} signal drives an opto input ({Ri} inside, LED {Vf}) through {R}. What current flows?' }
    },
    {
      name: 'Highest pulse rate from the pulse widths',
      expr: 'f = 1/(th + tl)', tex: 'f_{max} = \\dfrac{1}{t_H + t_L}',
      vars: {
        f: { name: 'highest pulse rate', q: 'frequency', unit: 'kHz', tex: 'f_{max}' },
        th: { name: 'minimum high time', q: 'time', unit: 'µs', value: 2.5, tex: 't_H' },
        tl: { name: 'minimum low time', q: 'time', unit: 'µs', value: 2.5, tex: 't_L' }
      },
      stories: { f: 'A driver needs pulses at least {th} high and {tl} low. What is the highest pulse rate it can accept?' }
    },
    {
      name: 'Pulse rate for a linear speed',
      expr: 'f = v*N/p', tex: 'f = \\dfrac{v\\,N}{p}',
      vars: {
        f: { name: 'pulse rate', q: 'frequency', unit: 'kHz' },
        v: { name: 'axis speed', q: 'speed', unit: 'mm/s', value: 100 },
        N: { name: 'steps per revolution (driver setting)', int: true, value: 1600 },
        p: { name: 'travel per revolution (screw lead or belt)', q: 'length', unit: 'mm', value: 5 }
      },
      stories: { f: 'An axis with {p} per revolution and {N} steps a revolution must move at {v}. What pulse rate is needed?', v: 'A controller sends {f} to an axis with {N} steps a revolution and {p} per revolution. How fast does it move?' }
    }
  ],
  examples: [
    {
      title: 'A 24 V PLC on a 5 V input',
      q: 'A PLC with 24 V sourcing (PNP) outputs must drive a driver whose inputs have 270 Ω inside and an LED of 1.2 V, specified for 7–16 mA. What resistors, and how is the common wired?',
      steps: [
        'For 10 mA: $R = (24 - 1.2)/0.010 - 270 = 2010$ Ω: use 2.0 kΩ (or 2.2 kΩ: 9.2 mA).',
        'Power in the resistor: $0.010^2 \\times 2000 = 0.2$ W — use a 0.5 W part.',
        'PNP outputs source current: wire PUL−, DIR− and ENA− to the PLC\'s 0 V (common cathode) and the outputs through the resistors to PUL+, DIR+ and ENA+.'
      ],
      a: '2.0–2.2 kΩ, 0.5 W, in each line; common cathode to 0 V.'
    },
    {
      title: 'Is the input fast enough?',
      q: 'An axis with a 5 mm lead must run at 200 mm/s with the driver set to 6400 steps a revolution. The driver\'s opto inputs accept 200 kHz. Will it work?',
      steps: [
        '$f = 200 \\times 6400/5 = 256\\,000$ pulses/s = 256 kHz — above the input limit.',
        'At 3200 steps a revolution: 128 kHz — inside, with margin.',
        'Or keep 6400 and use a driver with differential inputs.'
      ],
      a: 'No: 256 kHz. Halve the microstep setting (128 kHz) or use differential inputs.'
    }
  ],
  quiz: [
    { q: 'A driver\'s opto input is designed for 5 V. How do you drive it from a 24 V output?', choices: ['Add a series resistor of about 2 kΩ (or use its 24 V terminals)', 'Connect it directly', 'Add a diode', 'Use a 24 V zener across it'], a: 0, why: 'The LED current must stay in its range: (24 − 1.2)/I_F − R_int ≈ 2 kΩ for 10 mA.' },
    { q: 'An axis reverses often and slowly drifts out of position. The step and direction lines are clean. The most likely cause is…', choices: ['DIR changing too close to a step edge (set-up time)', 'too low a supply voltage', 'the idle current reduction', 'a loose motor coupling only'], a: 0, why: 'A pulse arriving before the new DIR level is recognised is counted the wrong way; because the opto turns off more slowly than on, it usually happens in one direction only, so the error accumulates.' },
    { q: 'Energising the ENA input always enables the motor.', a: false, why: 'On many drivers an energised ENA opto disables the output; the logic differs between drivers — check the manual.' },
    { q: 'Which interface suits a 15 m cable and 1 MHz pulses?', choices: ['Differential line driver (RS-422 style) inputs', '5 V single-ended opto inputs', '24 V single-ended inputs with 2 kΩ', 'Any of them'], a: 0, why: 'Differential signals reject common-mode noise and keep sharp edges over long cables; single-ended opto inputs typically stop at 200–500 kHz.' }
  ],
  problems: [
    { q: 'An opto input has 330 Ω inside and an LED of 1.2 V. What external resistor gives 12 mA from a 12 V signal?', answer: 570, unit: 'Ω', tol: 0.02, steps: ['$R = (12 - 1.2)/0.012 - 330 = 900 - 330 = 570$ Ω (use 560 Ω).'] },
    { q: 'A driver needs pulses at least 1 µs high and 1 µs low. What is its highest pulse rate?', answer: 500, unit: 'kHz', tol: 0.01, steps: ['$f = 1/(1 + 1)$ µs = 500 kHz.'] }
  ],
  choose: {
    good: [
      'Step/direction: simple, universal, any number of axes from a microcontroller, PLC or motion card.',
      'Differential inputs: long cables, high pulse rates, electrically noisy machines.',
      '24 V inputs: direct connection to PLC outputs without resistors.'
    ],
    avoid: [
      'Single-ended 5 V signals over long cables next to motor leads.',
      'Pulse rates near the input limit: noise and short pulses cause missed steps.',
      'Using enable or pulse stopping as a safety stop.'
    ],
    check: [
      'Input voltage and current (5, 12, 24 V; 7–16 mA typical) and whether resistors are needed.',
      'Sinking (NPN) or sourcing (PNP) outputs, and the common wiring.',
      'Minimum pulse width, DIR set-up time and the maximum pulse rate.',
      'Enable polarity, the alarm output\'s type and rating, and how the controller will react to it.'
    ]
  },
  applications: [
    'PLC-controlled indexing tables: 24 V pulse outputs into drivers with 24 V inputs.',
    'Hobby CNC: a parallel-port or USB motion board driving 5 V opto inputs in common-anode wiring.',
    'Long gantries: differential signals over 10–20 m cables in drag chains.',
    'See the signals in [the step and direction tool](#/tools/drives/stepdir).'
  ],
  sources: [
    'NEMA ICS 16, *Motion/Position Control Motors, Controls, and Feedback Devices* — step motor controls and their interfaces.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines* — control circuits, emergency stop and wiring practice.',
    'ISO 13849-1, *Safety of machinery — Safety-related parts of control systems* — why a plain enable input is not a safety function.',
    'Stepper driver manuals commonly specify opto input currents, pulse widths, direction set-up times and alarm outputs in the ranges given here.'
  ],
  sim: 'st-stepdir'
},

{
  id: 'closed-loop-steppers', parent: 'stepper-drivers-topic', title: 'Closed-loop steppers', level: 2,
  short: 'A closed-loop stepper adds an encoder to a hybrid stepper so the driver knows where the rotor really is. It can then correct or report lost steps, and — in true closed loop — set the current by the load like a servo: no lost steps within the torque available, a cooler and quieter motor. It is still a stepper: the torque falls with speed.',
  keywords: ['closed-loop stepper', 'hybrid servo', 'stepper with encoder', 'stall detection', 'position error', 'following error', 'field-oriented control', 'integrated stepper', 'encoder', 'lost steps', 'current by load', 'sensorless stall detection'],
  prereq: ['stepper-torque-speed', 'incremental-encoders', 'servo-principle'],
  related: ['foc-control', 'following-error', 'positioning-vs-speed', 'ac-servo-motors', 'stepper-resonance', 'step-dir-signals'],
  body: `
An open-loop stepper trusts that every pulse became a step. A **closed-loop stepper** checks: an encoder on the rear shaft — typically 1000–2500 lines (4000–10 000 counts a revolution), or a 14–16-bit magnetic encoder in integrated units — tells the driver where the rotor really is.

### Three levels of closing the loop
1. **Stall detection.** The driver (or controller) compares the encoder with the commanded position and raises an alarm when the error passes a limit. The motor still runs open loop; you only learn that it lost steps.
2. **Position correction.** After a slip the driver adds steps until the rotor catches up. Better, but the motor still runs at full current all the time.
3. **True closed loop** (sometimes sold as a *hybrid servo*). The driver treats the hybrid stepper as what it is — a 50-pole-pair permanent-magnet synchronous motor — and uses [[foc-control|field-oriented control]]: it places the current vector 90° electrical ahead of the rotor, where every ampere gives the most torque, and sets its size from the torque needed to follow the command.

### What true closed loop changes
- **No lost steps** as long as the load is within the motor's torque: a disturbance becomes a brief position error that the loop removes.
- **Current follows the load.** An open-loop driver must feed full current all the time, because it cannot know the load; a closed-loop one feeds what is needed. Heating goes with the square of the current: an axis that needs 30 % of the holding torque makes about 9 % of the heat.
- **Quieter, less resonance**: the loop damps the rotor's oscillation.
- **More usable torque near the top speed**: an open-loop design must keep a 30–50 % margin below the pull-out curve; a closed-loop one can work much closer to it, because a momentary shortfall is corrected instead of becoming a stall.

### What it does not change
The motor's torque–speed curve is the same: at 1500 rpm a NEMA 23 has what its winding and supply voltage allow ([[stepper-torque-speed]]). If the load exceeds it, the position error grows until the driver trips on its error limit. And compared with an AC servo, a hybrid stepper has a far higher rotor inertia per unit of torque and many more poles: it is superb at low and medium speeds, while a servo wins at high speed and for fast, dynamic moves.

| | Open-loop stepper | Closed-loop stepper | AC servo |
|---|---|---|---|
| Feedback | none | encoder on the motor | encoder (often 17–24 bit) |
| Lost steps | possible, undetected | detected and corrected | — |
| Current at rest or light load | full (or idle-reduced) | as needed | as needed |
| Torque at low speed | high | high | rated torque, 3× peak briefly |
| Useful top speed | about 600–1500 rpm | about the same, more of it usable | 3000–6000 rpm |
| At standstill | holds firmly | holds firmly | holds, may dither by a count |
| Tuning | none | little or automatic | usually needed |
| Cost | lowest | moderate | highest |

**Integrated** closed-loop steppers put the motor, driver and encoder in one NEMA 17–34 housing, with step/direction or fieldbus inputs — neat wiring for multi-axis machines. Some chip drivers also offer **sensorless stall detection** from the back-EMF, good enough for homing against a hard stop but not for guarding a process.

In the simulation, apply a growing load: the open-loop motor lags, then slips whole teeth and loses its count; the closed-loop motor raises its current, holds its position and alarms only when the load really exceeds the motor.

> [!tip] Choose closed loop when a lost step would scrap a part or crash a machine, when the motor must run cool, or when you want stepper cost with fewer surprises. Wire the encoder and the phases exactly as the manual says: a swapped phase or encoder channel makes the loop push the wrong way and trip at once.

> [!key] A closed-loop stepper measures the rotor with an encoder and sets the current from the load: no lost steps within the torque, far less heat and noise. The motor's torque–speed curve is unchanged.
`,
  ideas: [
    'An encoder on the rear shaft tells the driver where the rotor is.',
    'Levels: stall detection, position correction, and true closed loop with field-oriented control.',
    'True closed loop sets the current by the load: heat falls with the square of the load.',
    'Within the motor\'s torque there are no lost steps; beyond it, the driver trips on position error.',
    'The torque–speed curve is still a stepper\'s: servos remain better at high speed and for dynamic moves.'
  ],
  pitfalls: [
    'A closed-loop stepper is as fast as a servo — It has a stepper\'s torque–speed curve and a high rotor inertia; its advantage is reliability at low and medium speeds.',
    'With an encoder the motor can never lose position — If the load exceeds the available torque the error grows until the driver alarms; the loop needs torque to correct with.',
    'Stall detection alone makes the motor run cooler — Only a driver that sets the current by the load cuts the heat; stall detection or correction still runs at full current.'
  ],
  formulas: [
    {
      name: 'Encoder resolution',
      expr: 'r = 2*pi/(4*ppr)', tex: '\\Delta\\theta = \\dfrac{360^\\circ}{4\\,N_{ppr}}',
      vars: {
        r: { name: 'angle per encoder count', q: 'angle', unit: '°', tex: '\\Delta\\theta' },
        ppr: { name: 'encoder lines per revolution', int: true, value: 1000, tex: 'N_{ppr}' }
      },
      note: 'Quadrature decoding counts four edges per line.',
      stories: { r: 'A {ppr}-line encoder is read in quadrature. What angle is one count?' }
    },
    {
      name: 'Encoder counts per full step',
      expr: 'c = 4*ppr/S', tex: 'c = \\dfrac{4\\,N_{ppr}}{S}',
      vars: {
        c: { name: 'counts per full step' },
        ppr: { name: 'encoder lines per revolution', int: true, value: 1000, tex: 'N_{ppr}' },
        S: { name: 'full steps per revolution', int: true, value: 200 }
      },
      stories: { c: 'A {S}-step motor carries a {ppr}-line encoder. How many counts does one full step give?' }
    },
    {
      name: 'Heat when the current follows the load',
      expr: 'P = P0*(TL/Th)^2', tex: 'P = P_0 \\left(\\dfrac{T_L}{T_H}\\right)^2',
      vars: {
        P: { name: 'copper loss at the load', q: 'power', unit: 'W' },
        P0: { name: 'copper loss at full current', q: 'power', unit: 'W', value: 14, tex: 'P_0' },
        TL: { name: 'load torque', q: 'torque', unit: 'N·m', value: 0.4, tex: 'T_L' },
        Th: { name: 'holding torque at full current', q: 'torque', unit: 'N·m', value: 1.26, tex: 'T_H' }
      },
      note: 'Torque ∝ current and copper loss ∝ current², below saturation. Open loop pays P₀ all the time.',
      stories: { P: 'A motor loses {P0} at full current ({Th}). How much does it lose in closed loop carrying {TL}?' }
    }
  ],
  examples: [
    {
      title: 'Open or closed loop for a cool-running axis',
      q: 'A NEMA 23 (1.26 N·m, 14 W copper loss at full current) spends most of its time holding against 0.25 N·m. Compare the heat open loop, open loop with idle reduction, and closed loop.',
      steps: [
        'Open loop, full current: 14 W.',
        'Idle reduction to 50 %: $14 \\times 0.25 = 3.5$ W, with only 0.63 N·m of holding torque left — still enough here.',
        'Closed loop: $14 \\times (0.25/1.26)^2 = 0.55$ W.'
      ],
      a: '14 W, 3.5 W and about 0.6 W.'
    }
  ],
  quiz: [
    { q: 'What does a true closed-loop stepper driver do that stall detection does not?', choices: ['Sets the current vector ahead of the rotor and its size by the load', 'Counts the pulses', 'Raises the supply voltage', 'Changes the step angle'], a: 0, why: 'Field-oriented control uses the encoder to place and size the current; stall detection only compares positions and alarms.' },
    { q: 'A closed-loop stepper is overloaded beyond its torque at 1200 rpm. What happens?', choices: ['The position error grows and the driver trips on its error limit', 'It keeps position by drawing more current than rated', 'It slips silently like an open-loop motor', 'It speeds up'], a: 0, why: 'The loop can only use the torque the motor has; when that is not enough the error grows and the driver alarms.' },
    { q: 'An axis needs half the holding torque. In true closed loop, the copper loss is about… of the open-loop loss.', choices: ['25 %', '50 %', '71 %', '100 %'], a: 0, why: 'Current ∝ torque, loss ∝ current²: 0.5² = 0.25.' },
    { q: 'A closed-loop stepper has the same torque–speed curve as the same motor run open loop, but more of it is usable.', a: true, why: 'The winding and supply set the curve; the loop removes the need for a large margin below it.' }
  ],
  problems: [
    { q: 'A 2500-line encoder is read in quadrature on a 1.8° stepper. How many counts per full step?', answer: 50, tol: 0.01, steps: ['$4 \\times 2500 = 10\\,000$ counts per revolution.', '$10\\,000/200 = 50$ counts per full step.'] }
  ],
  choose: {
    good: [
      'Machines where a lost step scraps a part or causes a crash, at speeds up to about 1000–1500 rpm.',
      'Axes that hold or move lightly most of the time: far less heat.',
      'Upgrading an open-loop stepper machine without re-engineering it for servos.'
    ],
    avoid: [
      'High-speed, highly dynamic axes: a servo has more speed and less inertia.',
      'Very cost-sensitive products where open loop with a margin is reliable enough.',
      'Treating the position-error alarm as a safety function.'
    ],
    check: [
      'Encoder resolution and cable, and the driver\'s error limit and alarm behaviour.',
      'The torque curve at your speed: closed loop does not add torque the motor lacks.',
      'Whether the driver needs tuning, and how it behaves at power-up (some move to align).'
    ]
  },
  applications: [
    'Pick-and-place and labelling machines: no lost steps at moderate speed without servo cost.',
    'CNC routers upgraded from open loop: fewer lost-position crashes, cooler motors.',
    'Integrated NEMA 23 closed-loop steppers on conveyors and packaging machines with fieldbus control.'
  ],
  sources: [
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — closed-loop control of stepping motors.',
    'A. Hughes and B. Drury, *Electric Motors and Drives* — stepping motors and servo drives compared.',
    'N. Mohan, *Electric Drives* — vector (field-oriented) control of permanent-magnet synchronous machines, the principle behind true closed-loop steppers.'
  ],
  sim: 'st-closed-loop'
},

{
  id: 'stepper-sizing', parent: 'stepper-drivers-topic', title: 'Sizing a stepper motor', level: 2,
  short: 'Sizing a stepper means finding the torque the axis needs at its highest speed — load plus acceleration — and checking it against the motor\'s pull-out curve at your supply voltage with a 30–50 % margin; then checking the inertia ratio, the pulse rate, the resolution, the heat and what holds the load when the power is off.',
  keywords: ['stepper sizing', 'motor selection', 'torque margin', 'safety factor', 'inertia ratio', 'reflected inertia', 'ball screw', 'lead screw', 'belt drive', 'acceleration torque', 'load torque', 'pull-out curve', 'vertical axis', 'brake'],
  prereq: ['stepper-torque-speed', 'inertia-reflected', 'motion-profiles', 'lead-ball-screws'],
  related: ['motor-selection-method', 'rms-torque-sizing', 'belts-pulleys', 'inertia-matching', 'closed-loop-steppers', 'motor-brakes', 'physics:moment-of-inertia'],
  body: `
A stepper that is too small loses steps; one that is too big is slow to accelerate its own rotor, runs hot and costs more. Sizing is a short, disciplined calculation — the same for a 3-D printer axis and a packaging machine — done **at the highest speed**, where the stepper is weakest.

### The method
| Step | What to find | How |
|---|---|---|
| 1 | The move | distance, time, top speed; a first profile of ⅓ accelerate, ⅓ cruise, ⅓ decelerate ([[motion-profiles]]) |
| 2 | The transmission | screw lead, pulley diameter or gear ratio, chosen so the top speed is about 300–1000 rpm at the motor |
| 3 | Load torque at the motor | friction, gravity and process forces through the transmission: $T = F\\,p/(2\\pi\\eta)$ on a screw, $T = F\\,r/\\eta$ on a belt pulley |
| 4 | Load inertia at the motor | mass on a screw $m\\,(p/2\\pi)^2$, on a belt $m\\,r^2$; plus the screw, pulleys and coupling ([[inertia-reflected]]) |
| 5 | Acceleration torque | $(J_r + J_L)\\,\\omega/t_a$ — using a candidate motor's rotor inertia $J_r$ |
| 6 | Required torque at top speed | load + acceleration, at the end of the ramp where speed is highest |
| 7 | Compare | with the pull-out curve **at your supply voltage and driver**, keeping 30–50 % margin (a safety factor of 1.5–2) |
| 8 | Check the rest | inertia ratio, pulse rate, resolution, heat, holding at power-off |

### The checks that catch people
- **Inertia ratio** $J_L/J_r$: keep it below about 10 for open-loop steppers, better below 5. A high ratio makes the axis ring and overshoot, and the start–stop rate collapses. A finer screw lead or a belt reduction brings it down with the square of the ratio.
- **The curve's test conditions.** Catalogue curves are for a particular driver, voltage and microstep setting. On a lower voltage, the torque at speed is lower ([[stepper-torque-speed]]).
- **Resonance** at low speed and the mid-band: pass through quickly, microstep, or use a driver with compensation ([[stepper-resonance]]).
- **Heat:** a stepper at full current makes the same heat whether it works or not. Check the case temperature in your enclosure, and use idle reduction or closed loop where the duty allows.
- **Power-off.** A ball screw is back-drivable: on a vertical axis the load falls when the driver is disabled or the power fails. Fit a spring-applied [[motor-brakes|brake]] or a counterweight, and check that idle-reduced holding torque still exceeds the gravity torque.
- **Resolution and pulse rate:** travel per microstep and pulse rate at top speed within the controller's limit ([[step-modes]]).

### Typical outcomes
| Axis | Typical motor |
|---|---|
| Desktop 3-D printer, laser engraver (belts, 1–3 kg moving) | NEMA 17, 0.4–0.5 N·m, 24 V |
| Small CNC router axis (ball screw, 10–30 kg) | NEMA 23, 1.2–2 N·m, 36–48 V |
| Large gantry or heavy table (50–150 kg) | NEMA 34, 4–8 N·m, 60–80 V, or a servo |
| Rotary index table with a worm or planetary gearbox | NEMA 23 or 34 with a 5:1–10:1 gearhead |

If the numbers need more than about 1000–1500 rpm at the motor, a large inertia ratio, or a torque at speed that needs a NEMA 34 on a small machine, compare with a servo ([[positioning-vs-speed]]). The simulation runs the whole calculation for a screw axis; try [the axis sizing tool](#/tools/sizing/axis) for belts and racks too.

> [!warn] A vertical axis driven by a stepper falls when the driver is disabled, the power fails or the motor stalls. Support the load mechanically before working under it, fit a brake that engages on power loss, and never rely on the driver's enable to hold it.

> [!key] Size at the highest speed: load plus acceleration torque, against the pull-out curve at your own supply voltage, with 30–50 % margin; keep the inertia ratio under about 10; and decide what holds the load when the power is off.
`,
  ideas: [
    'Size at the top speed, where the stepper is weakest, not from the holding torque.',
    'Required torque = load torque + (J_r + J_L)·ω/t_a, reflected through the transmission.',
    'Keep 30–50 % margin below the pull-out curve at your supply voltage.',
    'Keep the load-to-rotor inertia ratio under about 10 (better 5) for open-loop steppers.',
    'Vertical axes need a brake or counterweight: a stepper holds only while powered.'
  ],
  pitfalls: [
    'A motor with twice the needed holding torque is safe — At the top speed it may have less than half its holding torque; compare with the pull-out curve at your voltage.',
    'A bigger motor always accelerates faster — Its rotor inertia is larger too; with a light load a smaller motor, or a better transmission ratio, can be quicker.',
    'The acceleration torque can be ignored because the load is light — Reflected screw, pulley and rotor inertia often need more torque than the load itself.'
  ],
  formulas: [
    {
      name: 'Inertia of a mass driven by a screw',
      expr: 'J = m*(p/(2*pi))^2', tex: 'J = m\\left(\\dfrac{p}{2\\pi}\\right)^2',
      vars: {
        J: { name: 'inertia seen at the screw', q: 'inertia', unit: 'kg·cm²' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 20 },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 10 }
      },
      stories: { J: 'A {m} carriage rides on a screw with a {p} lead. What inertia does the motor see from it?' }
    },
    {
      name: 'Inertia of a steel screw',
      expr: 'J = pi*rho*Ls*d^4/32', tex: 'J = \\dfrac{\\pi\\,\\rho\\,L_s\\,d^4}{32}',
      vars: {
        J: { name: 'screw inertia', q: 'inertia', unit: 'kg·cm²' },
        rho: { name: 'density (steel)', q: 'density', unit: 'kg/m³', value: 7850, tex: '\\rho' },
        Ls: { name: 'screw length', q: 'length', unit: 'mm', value: 500, tex: 'L_s' },
        d: { name: 'screw diameter', q: 'length', unit: 'mm', value: 16 }
      },
      note: 'A solid cylinder; use the root diameter for an exact figure.',
      stories: { J: 'What is the inertia of a steel screw {d} in diameter and {Ls} long?' }
    },
    {
      name: 'Torque to accelerate',
      expr: 'T = J*w/ta', tex: 'T_a = \\dfrac{J\\,\\omega}{t_a}',
      vars: {
        T: { name: 'acceleration torque', q: 'torque', unit: 'N·m', tex: 'T_a' },
        J: { name: 'rotor plus load inertia at the motor', q: 'inertia', unit: 'kg·cm²', value: 1.11 },
        w: { name: 'top speed', q: 'angvel', unit: 'rpm', value: 900, tex: '\\omega' },
        ta: { name: 'acceleration time', q: 'time', unit: 'ms', value: 50, tex: 't_a' }
      },
      stories: { T: 'A total inertia of {J} must reach {w} in {ta}. What torque does the acceleration need?', ta: 'A motor has {T} to spare for accelerating {J}. How quickly can it reach {w}?' }
    },
    {
      name: 'Torque to push a force with a screw',
      expr: 'T = F*p/(2*pi*eta)', tex: 'T = \\dfrac{F\\,p}{2\\pi\\,\\eta}',
      vars: {
        T: { name: 'motor torque', q: 'torque', unit: 'N·m' },
        F: { name: 'axial force (friction, gravity, process)', q: 'force', unit: 'N', value: 196 },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 10 },
        eta: { name: 'screw efficiency (ball 0.9, lead 0.3–0.6)', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\eta' }
      },
      stories: { T: 'A screw with a {p} lead and {eta} efficiency must push {F}. What torque does the motor need?', F: 'A motor gives {T} to a screw with a {p} lead and {eta} efficiency. What force can it push?' }
    }
  ],
  examples: [
    {
      title: 'A ball-screw axis: NEMA 17 or NEMA 23?',
      q: 'A 20 kg horizontal carriage on linear guides is driven by a 16 mm × 500 mm ball screw with a 10 mm lead (η = 0.9). It must reach 150 mm/s (900 rpm) in 50 ms. Friction in the guides and the preloaded nut adds up to 0.05 N·m at the motor. Candidates: NEMA 17 (0.42 N·m, 57 g·cm², 24 V) and NEMA 23 (1.26 N·m, 300 g·cm², 48 V).',
      steps: [
        'Load inertia: carriage $20 \\times (0.01/2\\pi)^2 = 0.51$ kg·cm²; screw $\\pi \\times 7850 \\times 0.5 \\times 0.016^4/32 = 0.25$ kg·cm²; coupling about 0.05 kg·cm²: $J_L \\approx 0.81$ kg·cm².',
        'NEMA 17: ratio $0.81/0.057 = 14$ — too high. Acceleration torque $(0.057 + 0.81)\\times10^{-4} \\times 94.2/0.05 = 0.16$ N·m; with friction 0.21 N·m. At 900 rpm on 24 V a typical curve gives about 0.3 N·m: margin 1.4 — thin, with a poor inertia ratio.',
        'NEMA 23: ratio $0.81/0.30 = 2.7$ — good. Acceleration $(0.30 + 0.81)\\times10^{-4} \\times 94.2/0.05 = 0.21$ N·m; with friction 0.26 N·m. At 900 rpm on 48 V it has well over 1 N·m: margin above 4.',
        'Pulse rate at 1/8 microstepping (1600 steps/rev): $15 \\times 1600 = 24$ kHz — easy.'
      ],
      a: 'The NEMA 23: inertia ratio 2.7 and a large margin. The NEMA 17 would work only marginally, with a 14:1 inertia ratio.'
    },
    {
      title: 'The same screw, vertical',
      q: 'The 20 kg carriage now moves vertically. What torque does gravity need, and does the NEMA 23 hold it with idle reduction to 50 %?',
      steps: [
        '$T = F p/(2\\pi\\eta) = 196 \\times 0.01/(2\\pi \\times 0.9) = 0.35$ N·m.',
        'Idle-reduced holding torque: $0.5 \\times 1.26 = 0.63$ N·m — it holds, with a margin of 1.8.',
        'But a ball screw back-drives: on a power failure or a disable the carriage falls. Fit a spring-applied brake or a counterweight.'
      ],
      a: '0.35 N·m; held at idle current, but a brake is needed for power-off.'
    }
  ],
  quiz: [
    { q: 'At which point of a move is a stepper usually closest to its limit?', choices: ['At the end of acceleration, at top speed', 'At standstill', 'In the middle of the cruise', 'During deceleration at low speed'], a: 0, why: 'The torque needed (load + acceleration) is largest while the available pull-out torque is lowest — at the highest speed.' },
    { q: 'Halving the screw lead (same speed of the carriage) changes the carriage\'s reflected inertia by a factor of…', choices: ['1/4', '1/2', '2', '4'], a: 0, why: 'J = m(p/2π)²: half the lead, a quarter of the inertia — but the motor must turn twice as fast.' },
    { q: 'Which inertia ratio (load to rotor) is a comfortable target for an open-loop stepper?', choices: ['Below about 5–10', 'Above 50', 'Exactly 1', 'It does not matter'], a: 0, why: 'High ratios make the axis ring and collapse the start–stop rate; below about 5–10 steppers behave well.' },
    { q: 'A stepper on a vertical ball-screw axis holds the load safely when the driver is disabled.', a: false, why: 'Without current there is only the small detent torque; a ball screw back-drives and the load falls. Use a brake or counterweight.' }
  ],
  problems: [
    { q: 'A 5 kg carriage on a belt drive with a 30 mm pulley diameter (radius 15 mm). What inertia does the motor see from the carriage?', answer: 11.25, unit: 'kg·cm²', tol: 0.02, steps: ['$J = m r^2 = 5 \\times 0.015^2 = 1.125\\times10^{-3}$ kg·m².', '= 11.25 kg·cm² — far more than a NEMA 23 rotor: consider a reduction.'] },
    { q: 'A total inertia of 2.0 kg·cm² must reach 600 rpm in 0.1 s. What acceleration torque is needed?', answer: 0.126, unit: 'N·m', tol: 0.02, steps: ['$\\omega = 600 \\times 2\\pi/60 = 62.8$ rad/s.', '$T = 2.0\\times10^{-4} \\times 62.8/0.1 = 0.126$ N·m.'] }
  ],
  choose: {
    good: [
      'Steppers for axes with a top speed of up to about 600–1000 rpm at the motor and moderate inertia.',
      'A reduction (belt or gearhead) to bring a large inertia ratio down and multiply torque.',
      'A safety factor of 1.5–2 at the top speed, on the curve for your voltage.'
    ],
    avoid: [
      'Sizing from holding torque or from the catalogue curve at a voltage you do not use.',
      'Inertia ratios above about 10 in open loop.',
      'Vertical axes without a brake or counterweight.'
    ],
    check: [
      'Torque at the end of the fastest acceleration, at top speed, against the pull-out curve.',
      'Inertia ratio, pulse rate, resolution and resonance in the working speed range.',
      'Motor temperature in the enclosure at the real duty.',
      'What happens on an emergency stop, a power failure and a stall.'
    ]
  },
  applications: [
    'CNC routers: NEMA 23 on 10 mm lead screws or NEMA 34 on long gantries.',
    '3-D printers: NEMA 17 on GT2 belts with 20-tooth pulleys (40 mm per revolution).',
    'Index tables: steppers with planetary gearheads to cut the inertia ratio.',
    'Run your own axis in [the axis sizing tool](#/tools/sizing/axis).'
  ],
  sources: [
    'A. Hughes and B. Drury, *Electric Motors and Drives* — motor and load matching, inertia and acceleration.',
    'T. Kenjo and A. Sugawara, *Stepping Motors and Their Microprocessor Controls* — selecting a stepping motor for a load.',
    'NEMA ICS 16, *Motion/Position Control Motors, Controls, and Feedback Devices* — step motor ratings used in selection.'
  ],
  sim: 'st-sizing'
}

);
