/* HYPER-MOTORS · content/servos.js — Servo motors and drives: what makes a servo, AC and DC servo motors, RC servos,
 * servo drives and their control modes, command interfaces; PID and the cascaded loops, tuning, inertia matching,
 * following error and faults, holding brakes. Simulations in sims/servos.js (prefix sv-). */
Hyper.add(

/* ================================================================ SERVO SYSTEMS */
{
  id: 'servo-principle', parent: 'servo-basics', title: 'What makes a servo', level: 1,
  short: 'A servo is a motor, a sensor that measures what the motor really did, and a drive that compares the measurement with the command and corrects the difference thousands of times a second. The closed loop makes the motor go where it is told, hold there against a load, and raise an alarm when it cannot.',
  keywords: ['servo', 'servomotor', 'servo system', 'closed loop', 'open loop', 'feedback', 'error', 'encoder', 'servo drive', 'servo amplifier', 'bandwidth', 'stiffness', 'stepper versus servo', 'servomechanism'],
  prereq: ['torque-and-power', 'incremental-encoders', 'electronics:negative-feedback'],
  related: ['ac-servo-motors', 'servo-drives', 'pid-control', 'positioning-vs-speed', 'closed-loop-steppers', 'hydraulics:servo-loop', 'pneumatics:servo-pneumatics'],
  body: `
A **servo** is not a kind of motor but a way of using one. It has three parts: a motor, a sensor that measures what the motor actually did, and a drive that compares the measurement with the command and corrects the difference — continuously, thousands of times a second. The motor is the servant (Latin *servus*) of the command, and it keeps obeying when the load pushes back.

### Three parts and a loop
| Part | What it does | Typical examples |
|---|---|---|
| Motor | turns current into torque | AC servo motor (permanent-magnet synchronous) 50 W–15 kW; brushed DC servo; the tiny DC motor in an RC servo |
| Feedback | measures position, and from it speed | absolute encoder of 17–26 bits; incremental encoder of 1000–10 000 lines; resolver; potentiometer |
| Drive | compares, decides, delivers current | servo drive (servo amplifier) with current, velocity and position loops |
| Controller | says where to go and when | PLC, motion controller, CNC, microcontroller |

The drive computes the **error** $e = \\theta_{cmd} - \\theta$ and turns it into a torque that pushes the error towards zero. The loop is *closed* because the output is fed back and subtracted from the input — the same [[electronics:negative-feedback|negative feedback]] that makes an op-amp precise. A stepper motor, or an induction motor on a VFD, is usually run *open loop*: the controller sends a command and assumes it was obeyed.

### What the loop buys
- **It holds position against a load.** Push the shaft and the error grows; the drive answers with torque. With [[?proportional|proportional]] action alone the servo behaves like a stiff torsion spring; add integral action and the spring creeps back to exactly zero error.
- **It knows when it fails.** If the error exceeds a limit — a jam, a collision, a slipping coupling — the drive stops with an alarm instead of silently losing position as a stepper would (see [[following-error]]).
- **It uses the motor's full torque.** Current flows only as the load needs it, so a servo motor runs cool at light load and can give about three times its rated torque for short accelerations.
- **It is fast.** Typical bandwidths: current loop 1–3 kHz, velocity loop 100–500 Hz, position loop 20–100 Hz. A small, well-tuned axis finishes a short move and settles in 10–50 ms.

### What the loop costs
Feedback can also make things worse: with too much gain the correction overshoots, the axis rings or oscillates, and the machine hums or screams — which is what [[servo-tuning|tuning]] is about. Backlash in a gearbox, a stretchy belt or a long thin shaft sits *inside* the loop and limits the gain it will take. And the parts cost more: a motor with an encoder, a drive with a processor, two cables.

| | Stepper (open loop) | Servo (closed loop) |
|---|---|---|
| Position feedback | none (optional in closed-loop steppers) | always |
| Torque at speed | falls steeply above a few hundred rpm | roughly flat up to rated speed (1000–3000 rpm) |
| Overload | loses steps without knowing | stops with a following-error alarm |
| Peak torque | about the holding torque | 2.5–3.5 × rated, for seconds |
| Current at standstill | full current, the motor stays warm | only what the load needs |
| Setting up | current and microsteps | tuning (auto-tune helps) |

**In the simulation**, open the loop: the drive plays a torque pattern computed for the table with no friction, so with friction the table stops short, and a push moves it for good. Close the loop and push again — the error jumps, the torque answers, and the table returns to the mark.

> [!warn] A servo axis can move the moment it is enabled, with its full peak torque and without warning. Keep out of its working space while enabling and tuning, guard the machine, and rely on the drive's safe torque off and the machine's emergency stop as the machine's safety design requires (see [[emergency-stop]]).

> [!key] Servo = motor + feedback + drive in a closed loop. The loop turns an error into torque, so the motor goes where it is told, stays there — and says so when it cannot.
`,
  ideas: [
    'A servo is a closed loop: command, measurement, error, correction — repeated thousands of times a second.',
    'Feedback lets the motor hold position against a changing load and detect when it cannot (a following-error alarm).',
    'The same loop that corrects can also oscillate: gains must suit the mechanics — that is tuning.',
    'Inner loops are faster than outer ones: current (kHz), velocity (hundreds of Hz), position (tens of Hz).',
    'A servo motor runs cool at light load and can briefly give about three times its rated torque.'
  ],
  pitfalls: [
    'A servo is a special kind of motor — A servo is a system; the same PM synchronous motor, a DC motor, a linear motor or even a hydraulic cylinder becomes a servo when a drive closes a loop around it with a sensor.',
    'More gain always means more accuracy — Beyond a point more gain makes the axis overshoot, ring and finally oscillate; the mechanics (inertia ratio, stiffness, backlash) sets the useful limit.',
    'A 24-bit encoder makes the machine accurate to its resolution — The encoder sees tiny steps, but backlash, screw pitch errors, thermal growth and elasticity outside the motor are usually thousands of times larger.'
  ],
  formulas: [
    {
      name: 'Rise time and loop bandwidth',
      expr: 'tr = 0.35/fb', tex: 't_r = \\dfrac{0.35}{f_{bw}}',
      vars: {
        tr: { name: 'rise time (10 % to 90 %)', q: 'time', unit: 'ms', tex: 't_r' },
        fb: { name: 'closed-loop bandwidth', q: 'frequency', unit: 'Hz', value: 200, tex: 'f_{bw}' }
      },
      note: 'For a loop that behaves like a first-order lag. A useful rule for comparing loops: ten times the bandwidth, a tenth of the response time.',
      stories: { tr: 'A velocity loop has a bandwidth of {fb}. Roughly how long does it take to follow a small speed step?', fb: 'A position loop must answer a small step within {tr}. What bandwidth does it need?' }
    },
    {
      name: 'Encoder resolution',
      expr: 'dth = 2*pi/2^b', tex: '\\Delta\\theta = \\dfrac{360^\\circ}{2^{b}}',
      vars: {
        dth: { name: 'smallest angle the encoder resolves', q: 'angle', unit: '″', tex: '\\Delta\\theta' },
        b: { name: 'resolution in bits', value: 20, int: true, min: 8, max: 32 }
      },
      note: 'An absolute encoder of b bits divides a turn into 2^b counts: 17 bits = 131 072, 20 bits = 1 048 576, 23 bits = 8 388 608.',
      stories: { dth: 'A servo motor has a {b}-bit encoder. What is the smallest angle it can see?' }
    },
    {
      name: 'Position error of a proportional loop under load',
      expr: 'err = T/k', tex: '\\theta_e = \\dfrac{T}{k_\\theta}',
      vars: {
        err: { name: 'steady position error', q: 'angle', unit: '°', tex: '\\theta_e' },
        T: { name: 'load torque', q: 'torque', unit: 'N·m', value: 1 },
        k: { name: 'servo stiffness (proportional action only)', unit: 'N·m/rad', value: 100, tex: 'k_\\theta' }
      },
      note: 'With proportional action only, the loop acts as a torsion spring of stiffness k. Integral action removes this steady error.',
      stories: { err: 'A servo with a stiffness of {k} holds a load torque of {T}. How far does the shaft give?', k: 'A shaft may give no more than {err} under {T}. How stiff must the loop be?' }
    }
  ],
  examples: [
    {
      title: 'How fine is a 20-bit encoder?',
      q: 'A servo motor with a 20-bit absolute encoder drives a ball screw of 10 mm lead directly. What are the smallest angle and the smallest table movement the drive can see — and is that the accuracy of the machine?',
      steps: [
        '$2^{20} = 1\\,048\\,576$ counts a revolution: $360°/1\\,048\\,576 = 0.000343°$, about 1.24 arc-seconds.',
        'At the table: $10\\ \\text{mm}/1\\,048\\,576 = 0.0095\\ \\mu$m — less than a hundredth of a micrometre.',
        'But a 1 m steel screw grows about 12 µm for every 1 °C it warms, a typical ground screw has a pitch error of several micrometres per 300 mm, and a coupling or a nut can have micrometres of play.'
      ],
      a: '1.24″ and about 0.01 µm: the encoder is not the limit; the mechanics and temperature are.'
    },
    {
      title: 'How quickly do the loops answer?',
      q: 'A drive has a velocity-loop bandwidth of 200 Hz and a position-loop bandwidth of 40 Hz. Estimate the rise time of each.',
      steps: [
        'Velocity loop: $t_r \\approx 0.35/200 = 1.75$ ms.',
        'Position loop: $t_r \\approx 0.35/40 = 8.75$ ms — five times slower, as an outer loop must be.'
      ],
      a: 'About 1.8 ms and 9 ms.'
    }
  ],
  quiz: [
    { q: 'What turns a motor into a servo?', choices: ['A sensor and a drive that compare the measured position with the command and correct the difference', 'A permanent-magnet rotor', 'A gearbox with a high ratio', 'A three-phase winding'], a: 0, why: 'A servo is defined by its closed loop, not its construction. AC servo motors happen to be PM synchronous motors, but a DC motor or a hydraulic cylinder becomes a servo the same way.' },
    { q: 'A stepper and a servo are both overloaded by a sudden jam. What typically happens?', choices: ['The stepper loses steps without knowing; the servo stops with a following-error alarm', 'Both raise an alarm', 'Both lose position without knowing', 'The servo loses steps, the stepper stops'], a: 0, why: 'Without feedback a stepper cannot tell that it fell behind. The servo sees its error grow past the limit and stops.' },
    { q: 'Doubling a loop\'s bandwidth roughly…', choices: ['halves its response time', 'doubles its response time', 'does not change its response time', 'quarters its overshoot'], a: 0, why: 't_r ≈ 0.35/f_bw: response time is inversely proportional to bandwidth.' },
    { q: 'A servo drive holding a shaft at standstill with no load draws almost no current.', a: true, why: 'The current follows the torque the load needs. A stepper drive, by contrast, keeps full (or reduced idle) current in its windings.' },
    { q: 'How many counts per revolution does a 17-bit encoder give?', answer: 131072, why: '2¹⁷ = 131 072.' }
  ],
  problems: [
    { q: 'A 23-bit encoder: what is its resolution in arc-seconds?', answer: 0.1545, unit: '″', tol: 0.01, steps: ['$2^{23} = 8\\,388\\,608$ counts.', '$360 \\times 3600\\ ″ / 8\\,388\\,608 = 0.1545$″.'] },
    { q: 'A position loop with proportional action only has a stiffness of 80 N·m/rad. By how many degrees does the shaft give under a load torque of 2 N·m?', answer: 1.43, unit: '°', tol: 0.02, steps: ['$\\theta_e = T/k = 2/80 = 0.025$ rad.', '$0.025 \\times 57.3 = 1.43°$. Integral action would bring it back to zero.'] }
  ],
  choose: {
    good: [
      'Positioning under changing or unknown loads: robot joints, CNC axes, presses, winders, pick-and-place.',
      'Fast moves with high acceleration and torque at speed — a servo keeps its torque to 3000 rpm where a stepper has lost most of its own.',
      'Machines that must detect a jam or collision and stop, rather than carry on in the wrong place.'
    ],
    avoid: [
      'Constant-speed duty (fans, pumps, conveyors): an induction motor on a VFD is cheaper and simpler.',
      'Light, predictable, slow positioning on a tight budget: a stepper does it without tuning.',
      'Loose mechanics (large backlash, soft belts, long shafts) that nobody will stiffen: the loop cannot correct what it cannot hold.'
    ],
    check: [
      'The torque and speed of your worst move (peak) and of the whole cycle (RMS) — see [[motor-selection-method]].',
      'The inertia ratio of load to motor ([[inertia-matching]]).',
      'The feedback: resolution, absolute or incremental, single- or multi-turn.',
      'The command interface your controller offers ([[command-interfaces]]).',
      'Safety: safe torque off, emergency stop, a holding brake on vertical axes.'
    ]
  },
  applications: [
    'Industrial robots: six servo axes, each with a gearbox, absolute encoder and holding brake.',
    'CNC machine tools: servo feed axes on ball screws, following a path to a few micrometres.',
    'Packaging machines: dozens of servo axes synchronised to a virtual master shaft instead of line shafts and cams.',
    'Hobby robots and model aircraft: RC servos, the same loop in miniature.'
  ],
  history: 'The French engineer Joseph Farcot called his steam-powered steering engine for ships a *servo-moteur* in the 1860s–70s: the helmsman\'s wheel set the rudder\'s position and the engine supplied the effort. Harold Hazen\'s 1934 paper *Theory of Servo-Mechanisms* gave the field its mathematics, and wartime gun and radar control made it an engineering discipline. In 1952 the MIT Servomechanisms Laboratory demonstrated a numerically controlled milling machine — the ancestor of every CNC servo axis.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — closed-loop control of drives and permanent-magnet servo motors.',
    'Younkin, *Industrial Servo Control Systems: Fundamentals and Applications* — servo components, loops and machine applications.',
    'NEMA ICS 16, *Motion/Position Control Motors, Controls, and Feedback Devices* — terms and ratings of motion-control products.'
  ],
  sim: 'sv-loop'
},

{
  id: 'ac-servo-motors', parent: 'servo-basics', title: 'AC servo motors', level: 2,
  short: 'An AC servo motor is a permanent-magnet synchronous motor built for motion: a slim magnet rotor, a three-phase stator and a high-resolution encoder. It gives flat torque to its rated speed and about three times that torque for accelerations. Low-inertia types suit fast light loads; medium-inertia types heavier ones.',
  keywords: ['AC servo motor', 'PMSM', 'brushless servo', 'permanent magnet', 'rated torque', 'peak torque', 'low inertia', 'medium inertia', 'flange size', '200 V class', '400 V class', 'torque constant', 'back-EMF constant', 'speed–torque curve', 'power rate', 'absolute encoder'],
  prereq: ['servo-principle', 'pmsm-motor', 'foc-control'],
  related: ['servo-drives', 'inertia-matching', 'bldc-motor', 'absolute-encoders', 'resolvers', 'servo-brakes', 'rms-torque-sizing', 'motor-heating'],
  body: `
An AC servo motor is a **permanent-magnet synchronous motor** made for motion control: magnets on a slim rotor, a three-phase winding in the stator, and a high-resolution encoder on the back. The drive feeds it sinusoidal currents whose phase follows the rotor angle read from the encoder ([[foc-control|field-oriented control]]), so the stator field always leads the magnets by 90 electrical degrees and every ampere makes the most torque. "AC" refers to the [[?sine-cosine|sinusoidal]] phase currents; electrically it is the [[pmsm-motor]], and a close cousin of the [[bldc-motor]], which is fed with blocks of current instead.

### Construction
- **Rotor**: neodymium-iron-boron magnets, typically 8 or 10 poles. Long and thin for *low inertia*, larger in diameter for *medium inertia*. Skewed magnets or slots keep cogging and torque ripple to about 1–2 % of rated torque.
- **Stator**: a three-phase winding, insulation class B or F, with a temperature sensor.
- **Feedback**: an absolute encoder of 17–26 bits (131 072 to 67 million counts a revolution), single-turn or multi-turn (counting whole turns with a battery or a battery-free counter); rugged motors use a [[resolvers|resolver]]. Motor data are often stored in the encoder, so the drive recognises the motor.
- **Housing**: a square flange of 40, 60, 80, 100, 130 or 180 mm (and larger), IP65–IP67 with a shaft oil seal as an option, keyed or plain shaft, connectors for power and encoder, and an optional [[servo-brakes|holding brake]].
- **Cooling**: natural convection through the flange. Ratings assume the motor is bolted to a metal plate of stated size at 40 °C ambient.

### The speed–torque envelope
The datasheet curve has two regions. The **continuous zone** is flat at the rated torque up to the rated speed and sags a little above it (iron losses grow with frequency); the RMS torque of a whole cycle must sit inside it. The **intermittent zone** reaches about three times the rated torque — for accelerations of fractions of a second to a few seconds — until, at high speed, the back-EMF approaches the voltage the drive can supply and the available torque falls towards the maximum speed. A lower mains voltage moves that corner to lower speeds.

| Typical 200 V class motor | Rated / peak torque | Rated / max speed | Flange | Rotor inertia |
|---|---|---|---|---|
| 100 W, low inertia | 0.32 / 0.95 N·m | 3000 / 6000 rpm | 40 mm | 0.04–0.07 kg·cm² |
| 400 W, low inertia | 1.27 / 3.8 N·m | 3000 / 6000 rpm | 60 mm | 0.25–0.7 kg·cm² |
| 750 W, low inertia | 2.39 / 7.2 N·m | 3000 / 5000–6000 rpm | 80 mm | 0.9–1.6 kg·cm² |
| 1 kW, medium inertia | 4.77 / 14.3 N·m | 2000 / 3000 rpm | 130 mm | 4–9 kg·cm² |
| 2 kW, medium inertia | 9.55 / 28.6 N·m | 2000 / 3000 rpm | 130 mm | 8–15 kg·cm² |

**Low inertia** motors accelerate themselves fastest (a high *power rate*, $T^2/J$) — ideal for short, fast moves of light loads, often through a gearbox. **Medium inertia** motors turn slower, are fatter and heavier, but tolerate heavy or changing loads, settle more easily and run smoothly at low speed.

### Voltage classes
**200 V class** motors run on 200–240 V drives (a DC bus of about 280–340 V), single-phase up to roughly 0.75–1.5 kW, three-phase above. **400 V class** motors have windings with more turns for 380–480 V drives (bus 540–680 V): about half the current for the same power, so thinner cables. Low-voltage servos for 24–60 V DC suit mobile robots and battery vehicles. A motor must match its drive's class: a 200 V motor on a 400 V drive overstresses its insulation; a 400 V motor on a 200 V drive reaches only about half its speed.

**In the simulation**, pick a motor and a move, and watch where the move's points land on the envelope: acceleration near the peak line, constant speed low, and the RMS point against the continuous line.

> [!warn] A spinning permanent-magnet motor is a generator: its terminals carry a voltage proportional to speed even when the drive is off — hundreds of volts on a 400 V class motor turned by a falling load or a coasting machine. Never open or touch motor connections while the shaft can turn. And the phases U, V, W must go to the drive's U, V, W: swapping two does **not** reverse a synchronous motor as it does an induction motor — it gives vibration, an overcurrent alarm or a runaway. Reverse the direction by a drive parameter.

> [!key] An AC servo motor is a PM synchronous motor with an encoder: flat rated torque to its rated speed, about three times that for seconds, and an inertia (low or medium) that should suit the load.
`,
  ideas: [
    'An AC servo motor is a permanent-magnet synchronous motor with an encoder, driven with sinusoidal currents locked to the rotor angle.',
    'Its envelope has a continuous zone (rated torque to rated speed) and an intermittent zone (about 3 × rated) that shrinks at high speed.',
    'Low-inertia motors suit fast, light moves; medium-inertia motors suit heavy or changing loads.',
    'In SI units the torque constant per ampere rms is √3 times the line-to-line rms back-EMF constant.',
    'Voltage class, flange, shaft, brake, encoder and IP rating must all be chosen to suit the machine and the drive.'
  ],
  pitfalls: [
    'Swapping two phases reverses a servo motor, as it does an induction motor — The drive commutates from the encoder angle; with two phases swapped its current no longer leads the magnets and the motor vibrates, trips or runs away. Reverse it by a parameter.',
    'The peak torque can be used continuously if the motor is kept cool — At 3 × rated current the copper loss is 9 × rated; the winding reaches its limit in seconds. Only the RMS torque of the cycle may equal the rated torque.',
    'A motor rated 400 W gives its rated torque in any mounting — The rating assumes a metal heat-sink flange at 40 °C; on a plastic bracket or in a hot enclosure it must be derated.'
  ],
  formulas: [
    {
      name: 'Torque from current',
      expr: 'T = Kt*I', tex: 'T = K_t\\,I',
      vars: {
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m' },
        Kt: { name: 'torque constant (per ampere rms)', q: 'ktorque', unit: 'N·m/A', value: 0.47, tex: 'K_t' },
        I: { name: 'phase current (rms)', q: 'current', unit: 'A', value: 2.7 }
      },
      note: 'Linear up to about the peak current; beyond it the iron saturates and the torque per ampere falls.',
      stories: { T: 'A servo motor with Kt = {Kt} draws {I}. What torque does it give?', I: 'A servo motor with Kt = {Kt} must give {T}. What current does the drive supply?' }
    },
    {
      name: 'Torque constant and back-EMF constant',
      expr: 'Kt = sqrt(3)*Ke', tex: 'K_t = \\sqrt{3}\\,K_e',
      vars: {
        Kt: { name: 'torque constant (per ampere rms)', q: 'ktorque', unit: 'N·m/A', tex: 'K_t' },
        Ke: { name: 'back-EMF constant (line-to-line rms)', q: 'kemf', unit: 'V/krpm', value: 28.4, tex: 'K_e' }
      },
      note: 'For a sinusoidal three-phase PM motor, from the power balance: three phases each converting E·I into T·ω. Datasheets give both; they are one number seen twice.',
      stories: { Kt: 'A servo motor\'s datasheet gives a back-EMF constant of {Ke}. What is its torque constant?' }
    },
    {
      name: 'Top speed allowed by the supply',
      expr: 'n = V/Ke', tex: 'n_{\\max} \\approx \\dfrac{V}{K_e}',
      vars: {
        n: { name: 'speed at which the back-EMF uses all the voltage', q: 'angvel', unit: 'rpm', tex: 'n_{\\max}' },
        V: { name: 'line-to-line rms voltage the drive can apply', q: 'voltage', unit: 'V', value: 200 },
        Ke: { name: 'back-EMF constant (line-to-line rms)', q: 'kemf', unit: 'V/krpm', value: 28.4, tex: 'K_e' }
      },
      note: 'A no-load upper bound: under load the winding resistance and inductance take part of the voltage, so the peak torque starts to fall well before this speed.',
      stories: { n: 'A motor with {Ke} is fed by a drive that can apply {V}. What speed can it never exceed?', Ke: 'A motor must reach {n} on a drive that can apply {V}. What is the largest back-EMF constant it may have?' }
    },
    {
      name: 'Power rate',
      expr: 'Q = T^2/J', tex: 'Q = \\dfrac{T_R^2}{J_m}',
      vars: {
        Q: { name: 'power rate (how fast the motor can put power into itself)', unit: 'W/s' },
        T: { name: 'rated torque', q: 'torque', unit: 'N·m', value: 1.27, tex: 'T_R' },
        J: { name: 'rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 0.37, tex: 'J_m' }
      },
      note: 'A figure of merit for servo motors, quoted in kW/s: low-inertia motors reach tens to hundreds of kW/s. It says how quickly the motor alone could accelerate at rated torque; the load changes the picture (see inertia matching).',
      stories: { Q: 'A servo motor has a rated torque of {T} and a rotor inertia of {J}. What is its power rate (in W/s)?' }
    }
  ],
  examples: [
    {
      title: 'Reading a 400 W motor',
      q: 'A 200 V class servo motor is rated 400 W at 3000 rpm and 2.7 A rms. Find the rated torque, the torque constant, the back-EMF constant and the back-EMF at rated speed.',
      steps: [
        '$T_R = P/\\omega = 400/(3000 \\times 2\\pi/60) = 400/314.2 = 1.27$ N·m; the peak is about three times that, 3.8 N·m.',
        '$K_t = 1.27/2.7 = 0.47$ N·m/A.',
        '$K_e = K_t/\\sqrt{3} = 0.271$ V·s/rad $= 0.271 \\times 2\\pi \\times 1000/60 = 28.4$ V/krpm.',
        'At 3000 rpm the back-EMF is $28.4 \\times 3 = 85$ V line-to-line — well below the roughly 200 V a drive on 230 V mains can apply, which is why the peak torque lasts beyond the rated speed.'
      ],
      a: '1.27 N·m, 0.47 N·m/A, 28.4 V/krpm, 85 V at 3000 rpm.'
    },
    {
      title: 'Low or medium inertia for a 12 kg·cm² load?',
      q: 'A direct-driven rotary table has 12 kg·cm² of inertia and must reach 2000 rpm in 50 ms. Compare a 750 W low-inertia motor ($J_m$ = 1.3 kg·cm², peak 7.2 N·m) with a 1 kW medium-inertia motor ($J_m$ = 7 kg·cm², peak 14.3 N·m). Ignore friction.',
      steps: [
        '$\\alpha = (2000 \\times 2\\pi/60)/0.05 = 209.4/0.05 = 4189$ rad/s².',
        '750 W: $T = (1.3 + 12) \\times 10^{-4} \\times 4189 = 5.57$ N·m — 77 % of its peak; inertia ratio $12/1.3 = 9.2$.',
        '1 kW: $T = (7 + 12) \\times 10^{-4} \\times 4189 = 7.96$ N·m — 56 % of its peak; inertia ratio $12/7 = 1.7$.',
        'Both can make the move. The 750 W motor is smaller and cheaper but runs near its peak and needs careful tuning at a ratio of 9; the 1 kW motor settles easily and has reserve. The RMS torque of the whole cycle decides whether the smaller one stays cool.'
      ],
      a: '5.6 N·m (ratio 9.2) against 8.0 N·m (ratio 1.7): both fit; the choice rests on the duty cycle, the settling needed and cost.'
    }
  ],
  quiz: [
    { q: 'What does a low-inertia rotor buy you?', choices: ['The motor itself accelerates fastest: good for short, fast moves of light loads', 'More continuous torque', 'Better tolerance of heavy load inertia', 'A higher voltage rating'], a: 0, why: 'A slim rotor gives a high power rate T²/J. With a heavy load the load inertia dominates and the advantage fades; a medium-inertia motor then suits better.' },
    { q: 'You swap two motor phases of an AC servo to reverse it. What happens?', choices: ['It does not simply reverse: commutation is wrong, so it vibrates, trips on overcurrent or runs away', 'It reverses, as an induction motor does', 'It runs at half speed', 'Nothing: the drive corrects the phase order automatically in every case'], a: 0, why: 'The drive places the current by the encoder angle. With two phases swapped the field no longer leads the magnets by 90°; the torque has the wrong sign or wanders. Change direction with a parameter.' },
    { q: 'The rated torque of an AC servo motor assumes it is bolted to a metal plate of a stated size.', a: true, why: 'Servo motors are cooled mostly through their flange. Datasheets state the heat-sink plate and 40 °C ambient; without them the continuous torque must be reduced.' },
    { q: 'A motor has a torque constant of 0.6 N·m/A. What current gives 2.4 N·m?', answer: 4, unit: 'A', why: 'I = T/Kt = 2.4/0.6 = 4 A.' },
    { q: 'Why does the intermittent (peak) torque fall at high speed?', choices: ['The back-EMF approaches the voltage the drive can apply, so it can no longer push the peak current in', 'The magnets weaken with speed', 'The encoder cannot count fast enough', 'Friction rises with the square of speed'], a: 0, why: 'The back-EMF grows with speed; the voltage left over for driving current shrinks. A lower mains voltage moves the corner of the curve to lower speed.' }
  ],
  problems: [
    { q: 'What is the rated torque of a 750 W servo motor rated at 3000 rpm?', answer: 2.39, unit: 'N·m', tol: 0.01, steps: ['$\\omega = 3000 \\times 2\\pi/60 = 314.2$ rad/s.', '$T = 750/314.2 = 2.39$ N·m.'] },
    { q: 'A 400 V class motor has a back-EMF constant of 50 V/krpm and its drive can apply 380 V line-to-line. What speed can the back-EMF alone never let it exceed?', answer: 7600, unit: 'rpm', tol: 0.01, steps: ['$n = V/K_e = 380/50 = 7.6$ krpm = 7600 rpm (in practice the mechanical limit is lower).'] }
  ],
  choose: {
    good: [
      'Fast, precise axes from about 50 W to 15 kW: robots, CNC feed axes, packaging, printing, pick-and-place.',
      'Loads that change or must be held at standstill with full torque, and motion that needs 2.5–3.5 × rated torque for accelerations.',
      'Sealed, maintenance-free duty: no brushes, IP65–IP67, absolute position kept through power-off.'
    ],
    avoid: [
      'Continuous constant-speed duty (pumps, fans, conveyors): an IE3 induction motor on a VFD costs far less.',
      'Very low-cost, light, slow positioning: a stepper motor needs no tuning.',
      'Very high torque at low speed without a gearbox: consider a [[torque-motors|torque motor]] or a gearbox.',
      'Hot, unventilated mountings without a metal flange, unless the motor is derated.'
    ],
    check: [
      'Peak torque against your worst acceleration; RMS torque against the rated torque, both at the real speeds.',
      'Inertia ratio: low- or medium-inertia rotor, or a gearbox ([[inertia-matching]]).',
      'Voltage class (200 V or 400 V) and the matching drive; cable length and cable type for moving chains.',
      'Flange, shaft (keyed or plain), permitted radial load from belts, IP rating and shaft seal, brake.',
      'Encoder: resolution, absolute multi-turn (battery or battery-free), or resolver for heat and shock.'
    ]
  },
  applications: [
    'Six-axis robots: low-inertia motors of 50 W–5 kW with gearboxes, brakes and multi-turn absolute encoders.',
    'CNC machining centres: medium-inertia motors of 1–7 kW on ball screws, often direct-coupled.',
    'Electronic cam and flying-shear axes on packaging lines, synchronised over a real-time network.'
  ],
  history: 'Brushed DC motors were the servo motors of machine tools until the 1980s. Cheap power transistors, microprocessors for field-oriented control and rare-earth magnets (samarium-cobalt from the 1970s, neodymium-iron-boron from the 1980s) made the brushless AC servo motor the standard by the 1990s.',
  sources: [
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines* — sinusoidal PM machines, torque and EMF constants, cogging.',
    'Hughes and Drury, *Electric Motors and Drives* — permanent-magnet synchronous motors and their drives.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance* — continuous and short-time ratings.'
  ],
  sim: 'sv-ac-envelope'
},

{
  id: 'dc-servo-motors', parent: 'servo-basics', title: 'DC servo motors', level: 2,
  short: 'A DC servo motor is a brushed permanent-magnet DC motor built for closed-loop duty — a light armature, magnets that survive current pulses and a tachogenerator or encoder on the back. Torque follows current and speed follows voltage, so the control is simple; the brushes set its life. Today it serves small battery-powered axes and legacy machines.',
  keywords: ['DC servo motor', 'brushed servo', 'coreless motor', 'ironless armature', 'disc armature', 'printed armature', 'tachogenerator', 'tacho feedback', 'four-quadrant amplifier', 'current limit', 'commutation limit', 'brush life', 'PWM ripple', 'legacy CNC'],
  prereq: ['dc-torque-speed', 'servo-principle', 'brushes-commutator'],
  related: ['coreless-motors', 'pancake-motors', 'tachogenerators', 'h-bridge', 'pwm-speed-control', 'dc-motor-drivers', 'ac-servo-motors', 'electronics:h-bridge'],
  body: `
A DC servo motor is a brushed permanent-magnet DC motor built for closed-loop duty: a light armature that accelerates quickly, magnets that survive large current pulses, a commutator built for constant reversals, and a feedback device — a [[tachogenerators|tachogenerator]], an encoder or both — on the back shaft. Its torque is proportional to its current and its speed to its voltage (the [[dc-torque-speed|straight line]]), so it needs no commutation electronics: a four-quadrant amplifier ([[h-bridge]]) and a feedback loop make it a servo.

### Kinds of armature
| Type | Construction | Inertia and inductance | Typical use |
|---|---|---|---|
| Iron-core (slotted) | coils in a laminated, slotted armature | higher inertia; inductance of a few mH; some cogging, reduced by skewed slots | general servo duty, 20 W–5 kW |
| Coreless (ironless, bell armature) | a self-supporting basket winding turning in the air gap | very low inertia; 0.01–1 mH; no cogging | instruments, medical pumps, optics, small robots, 0.5–250 W |
| Disc (printed or stamped) | a flat armature disc between axial magnets | very low inertia and inductance; flat | legacy machine tools, fast indexers ([[pancake-motors]]) |

[[coreless-motors|Coreless]] motors accelerate in milliseconds and run without cogging, but their small thermal mass lets an overload heat the winding in seconds, and their tiny inductance makes PWM current ripple large — they need a high switching frequency (50–100 kHz) or a series choke.

### Voltages and ratings
Small DC servos run on 6–48 V, mostly 12, 24 and 48 V; the machine-tool DC servos of the 1970s and 1980s ran their armatures at roughly 100–200 V from thyristor or transistor amplifiers, at 0.5–10 kW. Datasheets give what any DC motor datasheet gives — nominal voltage, no-load speed, stall torque, torque constant, resistance, inductance, rotor inertia, mechanical time constant — plus a **peak (pulse) current**, typically 4–10 × the continuous current, above which the magnets risk demagnetisation or the commutator arcs.

### The loop
The classic arrangement puts the velocity loop in the amplifier: the controller sends a ±10 V speed command, the tachogenerator (a few volts to a few tens of volts per 1000 rpm) feeds back the actual speed, and a PI amplifier drives the armature current; the position loop closes in the controller from an encoder. An inner current loop limits the armature current, and so the torque and the acceleration, $\\alpha = K I_{max}/J$.

**In the simulation**, step the speed command: the current jumps to its limit, stays there while the speed climbs in a straight ramp of slope $K I_{max}/J$, and drops back as the speed arrives. Near the top the back-EMF leaves too little voltage to push the full current and the ramp bends. Tick *tacho ripple* and raise the loop bandwidth: the tachogenerator's ripple of a few per cent reappears, amplified, in the armature current.

### Brushes and commutation in service
| Problem | Cause | What to do |
|---|---|---|
| Brush wear, dust | sliding contact; worse at high current and speed | expect roughly 1000–3000 h with the precious-metal brushes of small coreless motors, several thousand to more than 10 000 h with graphite brushes; keep dust out of optics and clean rooms |
| Sparking, pitted commutator | reversing large currents fast at high speed | stay inside the datasheet's safe commutation zone: less peak current at high speed |
| Electrical noise (EMI) | brush arcing | suppression capacitors and chokes at the motor, shielded cables |
| Hot spot when holding | current through the same few segments at standstill | derate long holding against a load, or add a brake |

> [!warn] The stall current is $V/R$ — often 10–30 × the continuous current of a small motor. Set the amplifier's peak and continuous current limits for the motor, not for the power supply, and fuse the supply. Large legacy DC servo amplifiers run from rectified mains: treat them as mains equipment, isolate and lock them off, and let their capacitors discharge before work.

> [!key] A DC servo is a brushed DC motor with feedback and a four-quadrant amplifier: torque follows current, speed follows voltage, control is simple — and the brushes set its life.
`,
  ideas: [
    'A DC servo is a brushed PM DC motor with a tachogenerator or encoder and a four-quadrant amplifier.',
    'With the current held at its limit the motor accelerates in a straight ramp: α = K·I_max/J.',
    'Coreless and disc armatures have very low inertia and inductance: fast, smooth, but quick to overheat and needing high PWM frequencies.',
    'Brush wear and the commutation limit set life and high-speed peak torque.',
    'In new machines AC servos have replaced DC servos above about 100 W; DC servos remain in small, battery-powered and legacy equipment.'
  ],
  pitfalls: [
    'A coreless motor can be driven from any ordinary 20 kHz PWM driver — Its inductance is so small that the current ripple can exceed the rated current, heating the winding and the brushes; use a higher frequency or a series choke.',
    'The peak current on the datasheet is available at any speed — At high speed the commutation limit lowers the permissible current, and the back-EMF leaves less voltage to drive it.',
    'The tachogenerator\'s ripple is too small to matter — A velocity loop with a high gain amplifies it into current ripple, noise and heating; filter it or use an encoder.'
  ],
  formulas: [
    {
      name: 'Acceleration at the current limit',
      expr: 'alpha = K*I/J', tex: '\\alpha = \\dfrac{K\\,I_{max}}{J}',
      vars: {
        alpha: { name: 'angular acceleration', q: 'angacc', unit: 'rad/s²', tex: '\\alpha' },
        K: { name: 'torque constant', q: 'ktorque', unit: 'N·m/A', value: 0.055 },
        I: { name: 'current limit', q: 'current', unit: 'A', value: 9, tex: 'I_{max}' },
        J: { name: 'inertia of armature and load', q: 'inertia', unit: 'kg·cm²', value: 0.2 }
      },
      note: 'Neglects friction and the load torque, and holds only while the supply can still push the full current against the back-EMF.',
      stories: { alpha: 'A DC servo with K = {K} runs at its current limit of {I} with {J} of inertia. How fast does it accelerate?', I: 'A motor with K = {K} and {J} of inertia must accelerate at {alpha}. What current limit is needed?' }
    },
    {
      name: 'Tachogenerator voltage',
      expr: 'Vt = Kg*n', tex: 'V_t = K_g\\,n',
      vars: {
        Vt: { name: 'tacho output voltage', q: 'voltage', unit: 'V', tex: 'V_t' },
        Kg: { name: 'tacho constant', q: 'kemf', unit: 'V/krpm', value: 7, tex: 'K_g' },
        n: { name: 'speed', q: 'angvel', unit: 'rpm', value: 3000 }
      },
      stories: { Vt: 'A tachogenerator of {Kg} turns at {n}. What voltage does it give?', n: 'A tachogenerator of {Kg} reads {Vt}. How fast is the motor turning?' }
    },
    {
      name: 'Electrical time constant',
      expr: 'tau = L/R', tex: '\\tau_e = \\dfrac{L}{R}',
      vars: {
        tau: { name: 'electrical time constant', q: 'time', unit: 'ms', tex: '\\tau_e' },
        L: { name: 'armature inductance', q: 'inductance', unit: 'mH', value: 1.5 },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 0.9 }
      },
      note: 'How quickly the current follows a voltage step; the current loop is set well faster than the speed loop, which is set by the mechanical time constant.',
      stories: { tau: 'An armature has {L} and {R}. How quickly does its current follow a change of voltage?' }
    },
    {
      name: 'PWM current ripple',
      expr: 'dI = V*D*(1 - D)/(L*f)', tex: '\\Delta I = \\dfrac{V\\,D\\,(1 - D)}{L\\,f}',
      vars: {
        dI: { name: 'peak-to-peak current ripple', q: 'current', unit: 'A', tex: '\\Delta I' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        L: { name: 'armature inductance', q: 'inductance', unit: 'mH', value: 0.15 },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20 }
      },
      note: 'Largest at 50 % duty. The ripple adds heating without adding torque.',
      stories: { dI: 'A coreless motor of {L} is driven from {V} at {f} and {D} duty. How large is the current ripple?', f: 'The ripple of a {L} motor on {V} at {D} duty must stay below {dI}. What PWM frequency is needed?' }
    }
  ],
  examples: [
    {
      title: 'How fast can it reach speed?',
      q: 'A 24 V iron-core DC servo has K = 0.055 N·m/A and R = 0.9 Ω. With its load the inertia is 0.2 kg·cm², and the amplifier limits the current to 9 A. How long does it take to reach 2000 rpm, and could it keep 9 A flowing at 3000 rpm?',
      steps: [
        '$\\alpha = K I_{max}/J = 0.055 \\times 9/(0.2 \\times 10^{-4}) = 24\\,750$ rad/s².',
        '2000 rpm is 209.4 rad/s: $t = 209.4/24\\,750 = 8.5$ ms (plus the few milliseconds the loop takes to settle).',
        'At 3000 rpm (314 rad/s) the back-EMF is $0.055 \\times 314 = 17.3$ V and $RI = 0.9 \\times 9 = 8.1$ V: 25.4 V is more than the 24 V supply. The full current is only possible up to $\\omega = (24 - 8.1)/0.055 = 289$ rad/s = 2760 rpm; above that the current and the acceleration fall.'
      ],
      a: 'About 8.5 ms to 2000 rpm; the 9 A limit can be held only to about 2760 rpm on 24 V.'
    },
    {
      title: 'The ripple of a coreless motor',
      q: 'A coreless motor of 0.15 mH (rated 1.1 A) is driven from 24 V at 50 % duty. Compare the current ripple at 20 kHz and at 100 kHz.',
      steps: [
        'At 20 kHz: $\\Delta I = 24 \\times 0.5 \\times 0.5/(0.15 \\times 10^{-3} \\times 20\\,000) = 2.0$ A peak to peak — more than the rated current.',
        'At 100 kHz: $\\Delta I = 0.4$ A.',
        'A triangular ripple of 2 A has an rms value of $2/(2\\sqrt{3}) = 0.58$ A; on top of 1.1 A it raises the copper loss by $(1.1^2 + 0.58^2)/1.1^2 = 1.28$ — 28 % more heat for no torque.'
      ],
      a: '2.0 A at 20 kHz, 0.4 A at 100 kHz: drive coreless motors fast, or add a choke.'
    }
  ],
  quiz: [
    { q: 'Why does a coreless DC motor need a high PWM frequency or a series choke?', choices: ['Its inductance is tiny, so each PWM pulse makes a large current ripple', 'Its magnets demagnetise at low frequencies', 'Its brushes need a high frequency to commutate', 'Its tachogenerator needs it'], a: 0, why: 'Ripple ΔI = V·D(1−D)/(L·f): with L a hundred times smaller than an iron-core motor\'s, f or L must rise to keep the ripple down.' },
    { q: 'During a speed step the current sits at its limit. The speed then rises…', choices: ['in a straight ramp of slope K·I_max/J', 'exponentially with the electrical time constant', 'in a parabola', 'in steps'], a: 0, why: 'Constant current means constant torque, so constant acceleration: a straight ramp until the loop takes over near the target.' },
    { q: 'Reversing the armature voltage of a PM DC servo reverses its direction.', a: true, why: 'The magnets\' field is fixed, so reversing the current reverses the torque — which is why a four-quadrant amplifier (an H-bridge) is all it needs.' },
    { q: 'What most often limits the life of a DC servo motor?', choices: ['Brush and commutator wear', 'Magnet ageing', 'Bearing grease in the first month', 'The encoder'], a: 0, why: 'Brushes are consumables: from about a thousand hours in small precious-metal designs to over ten thousand in graphite designs, depending on current and speed.' },
    { q: 'A tachogenerator of 7 V/krpm turns at 1500 rpm. What voltage does it give?', answer: 10.5, unit: 'V', why: '7 × 1.5 = 10.5 V.' }
  ],
  problems: [
    { q: 'A DC servo with K = 0.1 N·m/A and 2 kg·cm² of total inertia runs at a current limit of 20 A. What is its acceleration (ignore friction)?', answer: 10000, unit: 'rad/s²', tol: 0.01, steps: ['$T = 0.1 \\times 20 = 2$ N·m.', '$\\alpha = 2/(2 \\times 10^{-4}) = 10\\,000$ rad/s².'] },
    { q: 'A tachogenerator of 7 V/krpm reads 14 V. What is the speed?', answer: 2000, unit: 'rpm', tol: 0.01, steps: ['$n = 14/7 = 2$ krpm = 2000 rpm.'] }
  ],
  choose: {
    good: [
      'Small battery-powered axes on 12–48 V: simple four-quadrant PWM amplifiers, no commutation electronics.',
      'Instruments, optics and medical pumps that need very low inertia and no cogging (coreless motors).',
      'Repair and retrofit of legacy machines built around DC servos and ±10 V amplifiers.'
    ],
    avoid: [
      'Long continuous duty at high speed: brush wear — an AC servo or a [[bldc-motor|brushless motor]] lasts far longer.',
      'Clean rooms, vacuum and explosive atmospheres: brush dust and sparks.',
      'New industrial axes above about 100 W: AC servo systems are the standard and cost no more.'
    ],
    check: [
      'Continuous and peak current against the amplifier\'s limits; the stall current against the fuse.',
      'Brush life at your current, speed and duty.',
      'Inductance against the PWM frequency (coreless motors).',
      'The safe commutation zone at your top speed.',
      'The feedback: tachogenerator constant and ripple, encoder resolution.'
    ]
  },
  applications: [
    'Infusion and dosing pumps, lab automation and camera optics: coreless DC motors with encoders and gearheads.',
    'Small mobile robots and educational robots: 12–24 V gearmotors with encoders on an H-bridge.',
    'Older CNC machines: DC servo motors with tachogenerators and ±10 V amplifiers, still repaired and kept running.'
  ],
  history: 'Brushed DC servo motors with tachogenerators and thyristor, then transistor, amplifiers drove machine-tool axes from the first numerically controlled machines until brushless AC servo systems replaced them in the 1980s and 1990s. Disc-armature and coreless designs brought very low inertia for fast indexing and instruments.',
  sources: [
    'Kenjo and Nagamori, *Permanent-Magnet and Brushless DC Motors* — permanent-magnet DC motors, coreless and disc armatures, servo use.',
    'Hughes and Drury, *Electric Motors and Drives* — DC motors and their controlled drives.',
    'NEMA ICS 16, *Motion/Position Control Motors, Controls, and Feedback Devices* — servo motor and tachogenerator terms and ratings.'
  ],
  sim: 'sv-dc-step'
},

{
  id: 'rc-servos', parent: 'servo-basics', title: 'RC servos and their pulses', level: 1,
  short: 'A radio-control (RC) servo is a complete position servo in a small box: a DC motor, a gear train, a potentiometer on the output and a control chip. A pulse of 1 to 2 ms, repeated about every 20 ms, sets the angle; the chip compares it with the potentiometer and drives the motor until they agree.',
  keywords: ['RC servo', 'hobby servo', 'servo pulse', '1–2 ms pulse', '50 Hz', 'pulse width', 'PWM servo', 'potentiometer feedback', 'deadband', 'analogue servo', 'digital servo', 'continuous rotation servo', 'kg·cm', 's/60°', 'servo jitter'],
  prereq: ['servo-principle', 'pwm-speed-control', 'electronics:potentiometers'],
  related: ['dc-gearmotors', 'h-bridge', 'command-interfaces', 'motors-robots-drones', 'electronics:pwm', 'electronics:microcontrollers'],
  body: `
A radio-control (RC) servo is a complete position servo in a plastic box the size of a matchbox: a small DC motor, a reduction gear train of roughly 100–500 : 1, a potentiometer on the output shaft and a control board. Three wires carry everything: supply (red, typically 4.8–6 V; "high-voltage" servos 7.4–8.4 V), ground (black or brown) and signal (white, yellow or orange).

### The pulse
The command is a positive pulse repeated about every 20 ms — a 50 Hz frame. Its **width** sets the position:

| Pulse width | Position (a typical servo) |
|---|---|
| 1.0 ms | one end of the normal travel, about −45° |
| 1.5 ms | centre |
| 2.0 ms | the other end, about +45° |
| 0.5–2.5 ms | the extended range many servos accept, up to about ±90° |

For an analogue servo the frame rate hardly matters as long as pulses keep coming (roughly 40–60 Hz is safe); **digital** servos accept faster frames, often 100–333 Hz. The pulse is at logic level (3.3 or 5 V) and carries no power — the motor current comes from the supply wire. The scale and end points differ between models; the data sheet gives them, and driving past them pushes the output against its internal stop.

### The loop inside
The control chip turns the potentiometer voltage into a reference pulse and compares it with the incoming pulse. The difference — the **error** — drives the motor through a small H-bridge: forwards if the command pulse is longer, backwards if shorter, harder for a bigger difference. It is a [[?proportional|proportional]] loop with a small **deadband** (typically 1–8 µs, about 0.1–0.7°) so the servo does not hunt around the target.

An **analogue** servo energises the motor once per frame, for a time that grows with the error: near the target it pushes weakly, so a load deflects it by a few degrees. A **digital** servo samples and drives at hundreds to thousands of times a second: it holds much more stiffly, answers faster, draws more current and buzzes audibly while holding. **In the simulation**, hang a load on the horn and compare them: the analogue servo sags until its error is large enough to push back.

### Ratings
| Size | Mass | Stall torque | Speed (no load) | Stall current |
|---|---|---|---|---|
| Micro | 8–15 g | 1–2.5 kg·cm (0.1–0.25 N·m) | 0.08–0.12 s/60° | 0.5–1 A |
| Standard (about 40 × 20 × 38 mm) | 40–70 g | 3–20 kg·cm (0.3–2 N·m) | 0.08–0.2 s/60° | 1–3 A |
| Large-scale | 150 g and up | 20–60 kg·cm and more | 0.1–0.25 s/60° | 3–8 A |

Torque is quoted in kg·cm (strictly kgf·cm; 1 kgf·cm = 0.098 N·m) at stall, and speed as the time to turn 60° without load, both at a stated voltage — more voltage gives more of both.

### In real projects
- **Supply**: servos stalling together draw amperes that a microcontroller board's 5 V regulator cannot give. Use a separate 5–6 V supply rated for the sum of the stall currents, a bulk capacitor near the servos, and a **common ground** with the controller.
- **Jitter** comes from pulses timed by software, a noisy supply, or a worn potentiometer. Generate the pulses with a hardware timer.
- **End stops**: a command past the mechanical limit stalls the motor — it heats and strips gears. Calibrate the pulse range of each servo.
- **Continuous-rotation servos** have the potentiometer replaced by fixed resistors: the pulse width then sets speed and direction, not position.
- **Gears**: plastic gears strip under shock loads; metal gears survive but wear the case. Backlash of about 0.5–2° sits between motor and output.

> [!tip] A 16-bit hardware timer clocked at 1 MHz gives 1 µs steps — about 0.09° on a 90°/ms servo, finer than the deadband.

> [!key] An RC servo is a miniature position servo: pulse width in, angle out, a potentiometer closing the loop — cheap and easy, with modest stiffness, resolution and life.
`,
  ideas: [
    'The pulse width, not the frequency, carries the command: 1.0 ms one end, 1.5 ms centre, 2.0 ms the other end.',
    'Inside, a potentiometer on the output shaft closes a proportional loop with a small deadband.',
    'Digital servos update the motor hundreds of times per frame and hold far more stiffly than analogue ones.',
    'Stall torque and speed are quoted at a supply voltage; the supply must deliver the stall currents of all servos at once.',
    'A continuous-rotation servo is a gearmotor with speed set by the pulse width — it has no position feedback.'
  ],
  pitfalls: [
    'A servo is driven by the PWM duty cycle, like a motor — It reads the pulse width; the frame rate may vary. A 1.5 ms pulse means centre at 50 Hz and at 100 Hz, although the duty cycles differ.',
    'The signal pin of a microcontroller powers the servo — The signal carries only a command; the motor current comes from the supply wire, and several amperes may be needed.',
    'The stall torque is what the servo can hold all day — At stall the motor draws its stall current and heats; a steady load should stay well below the stall rating.'
  ],
  formulas: [
    {
      name: 'Angle from pulse width',
      expr: 'theta = k*(tp - t0)', tex: '\\theta = k\\,(t_p - t_0)',
      vars: {
        theta: { name: 'horn angle from centre', q: false, unit: '°', signed: true, tex: '\\theta' },
        k: { name: 'scale of the servo', q: false, unit: '°/ms', value: 90 },
        tp: { name: 'pulse width', q: false, unit: 'ms', value: 1.75, tex: 't_p' },
        t0: { name: 'centre pulse width', q: false, unit: 'ms', value: 1.5, tex: 't_0' }
      },
      note: 'A typical servo turns about 90° per millisecond of pulse width (±45° for 1–2 ms); check the data sheet of yours.',
      stories: { theta: 'A servo turns {k}. Where does a pulse of {tp} put the horn?', tp: 'A servo of {k} must turn to {theta}. What pulse width do you send?' }
    },
    {
      name: 'Duty cycle of the command signal',
      expr: 'D = tp*f', tex: 'D = t_p\\,f',
      vars: {
        D: { name: 'duty cycle', q: 'ratio', unit: '%' },
        tp: { name: 'pulse width', q: 'time', unit: 'ms', value: 1.5, tex: 't_p' },
        f: { name: 'frame rate', q: 'frequency', unit: 'Hz', value: 50 }
      },
      note: 'Useful when a PWM timer is set by duty cycle: 1–2 ms at 50 Hz is 5–10 %.',
      stories: { D: 'A {tp} pulse is sent at {f}. What duty cycle must the PWM timer be set to?' }
    },
    {
      name: 'Speed from the 60° rating',
      expr: 'w = A/t', tex: '\\omega = \\dfrac{60^\\circ}{t_{60}}',
      vars: {
        w: { name: 'output speed', q: 'angvel', unit: 'rpm', tex: '\\omega' },
        A: { name: 'rated angle', q: 'angle', unit: '°', value: 60, fixed: true, tex: '60^\\circ' },
        t: { name: 'time for 60° without load', q: 'time', unit: 's', value: 0.12, tex: 't_{60}' }
      },
      stories: { w: 'A servo is rated {t} per 60°. How fast does its output turn?' }
    },
    {
      name: 'Force at the horn',
      expr: 'F = T/r', tex: 'F = \\dfrac{T}{r}',
      vars: {
        F: { name: 'force at the linkage hole', q: 'force', unit: 'N' },
        T: { name: 'servo torque', q: 'torque', unit: 'kgf·cm', value: 10 },
        r: { name: 'horn radius', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'A longer horn gives more travel but less force.',
      stories: { F: 'A {T} servo pushes a linkage at {r} from the shaft. What force can it give at stall?', r: 'A {T} servo must push with {F}. How far from the shaft can the linkage go?' }
    }
  ],
  examples: [
    {
      title: 'Commanding 30°',
      q: 'A servo turns 90° per millisecond with its centre at 1.5 ms. What pulse puts the horn at +30°, what duty cycle is that at 50 Hz, and how fine is a 1 µs timer step?',
      steps: [
        '$t_p = t_0 + \\theta/k = 1.5 + 30/90 = 1.833$ ms.',
        '$D = 1.833\\ \\text{ms} \\times 50\\ \\text{Hz} = 9.2$ %.',
        'One microsecond is $90 \\times 0.001 = 0.09°$ — finer than the servo\'s deadband of a few microseconds.'
      ],
      a: '1.83 ms, 9.2 % duty; 1 µs steps are 0.09°.'
    },
    {
      title: 'Can it lift the arm?',
      q: 'A standard servo rated 10 kg·cm at 6 V holds a horizontal arm 150 mm long of 0.1 kg (centre of mass at 75 mm) with a 0.3 kg gripper at its end. Is it a good choice?',
      steps: [
        'Torque: $0.3 \\times 9.81 \\times 0.15 + 0.1 \\times 9.81 \\times 0.075 = 0.441 + 0.074 = 0.515$ N·m.',
        '$0.515/0.0981 = 5.3$ kg·cm: half the stall torque.',
        'It will hold, but it draws about half its stall current continuously, runs warm, moves slowly and has no reserve for acceleration or shocks. A 20 kg·cm servo, a shorter arm or a counter-spring is the better design.'
      ],
      a: 'About 5.3 kg·cm, half the rating: it works, but marginally — choose a stronger servo or reduce the load.'
    }
  ],
  quiz: [
    { q: 'A servo receives a 1.5 ms pulse every 20 ms. Where does it go?', choices: ['To the centre of its travel', 'To one end', 'It spins continuously', 'Nowhere: the duty cycle is too low'], a: 0, why: '1.5 ms is the centre by convention; 1.0 and 2.0 ms are the ends of the normal travel.' },
    { q: 'Whenever several servos start moving, the microcontroller resets. The most likely cause is…', choices: ['The servos\' current pulls the shared supply down', 'The pulse frequency is too high', 'The servos are analogue', 'The signal wires are too long'], a: 0, why: 'Stalling or accelerating servos draw amperes; a shared 5 V rail sags and browns out the controller. Use a separate supply, a bulk capacitor and a common ground.' },
    { q: 'Why does a digital servo hold a load more stiffly than an analogue one?', choices: ['It updates the motor drive hundreds of times per frame, with more gain near the target', 'Its potentiometer is more accurate', 'Its motor is always brushless', 'It uses a higher pulse voltage'], a: 0, why: 'An analogue servo gives one drive pulse per 20 ms frame, weak near the target; a digital one drives continuously at a high rate, so small errors already produce strong torque.' },
    { q: 'The signal wire of an RC servo supplies the current for its motor.', a: false, why: 'The signal is a logic-level command. The motor current flows through the red and black supply wires.' },
    { q: 'What duty cycle does a 2.0 ms pulse at 50 Hz correspond to?', answer: 10, unit: '%', why: '2 ms × 50 Hz = 0.10 = 10 %.' }
  ],
  problems: [
    { q: 'A servo is rated 0.15 s/60°. What is its no-load output speed in rpm?', answer: 66.7, unit: 'rpm', tol: 0.02, steps: ['60° in 0.15 s is 400 °/s.', '$400/360 = 1.11$ rev/s $= 66.7$ rpm.'] },
    { q: 'A 20 kg·cm servo drives a linkage 30 mm from the shaft. What force can it give at stall?', answer: 65.4, unit: 'N', tol: 0.02, steps: ['$T = 20 \\times 0.0981 = 1.96$ N·m.', '$F = 1.96/0.030 = 65.4$ N.'] }
  ],
  choose: {
    good: [
      'Hobby robots, model aircraft and boats, animatronics, camera pan-and-tilt heads: an angle with three wires.',
      'Prototypes and light mechanisms: latches, flaps, valve levers, pointers — one timer pin per servo.',
      'Short, occasional moves with light loads well below the stall torque.'
    ],
    avoid: [
      'Continuous industrial duty and heavy loads: plastic gears, potentiometer wear and small motors limit life.',
      'Precision better than about half a degree, or smooth slow motion: deadband, backlash and step-like response.',
      'Loads that sit near the stall torque: the motor heats and the gears strip.'
    ],
    check: [
      'Stall torque and speed at your supply voltage, with a generous margin.',
      'The pulse range and travel of your particular servo; mechanical end stops.',
      'A supply that delivers all stall currents at once, a bulk capacitor and a common ground.',
      'Analogue or digital; plastic or metal gears; ball bearings; whether a feedback output is available.'
    ]
  },
  applications: [
    'Control surfaces and steering of radio-controlled models — the use that set the pulse convention.',
    'Walking and humanoid hobby robots with a dozen or more servos, fed from a separate high-current supply.',
    'Small lab and maker automation: sample changers, shutters, pointers and dispensers driven from a microcontroller.'
  ],
  sources: [
    'The 1–2 ms pulse repeated at about 50 Hz is a de facto convention of radio-control equipment, not a formal standard; each servo\'s data sheet gives its pulse range, travel, voltage, torque and speed.',
    'Franklin, Powell and Emami-Naeini, *Feedback Control of Dynamic Systems* — proportional feedback, loop gain and steady-state error.'
  ],
  sim: 'sv-rc-servo'
},

{
  id: 'servo-drives', parent: 'servo-basics', title: 'Servo drives and control modes', level: 2,
  short: 'A servo drive rectifies the mains onto a DC bus, rebuilds three-phase currents for the motor with an inverter, and closes the current, velocity and position loops from the encoder. It runs in position, velocity or torque mode; it must get rid of the energy the motor returns when braking; it has safe torque off, I/O, alarms — and a size, a heat loss and a power draw of its own.',
  keywords: ['servo drive', 'servo amplifier', 'control modes', 'position mode', 'velocity mode', 'torque mode', 'DC bus', 'regeneration', 'braking resistor', 'brake chopper', 'overvoltage', 'safe torque off', 'STO', 'SS1', 'alarm codes', 'drive size', 'control power', 'heat loss'],
  prereq: ['servo-principle', 'ac-servo-motors', 'vfd-principle'],
  related: ['command-interfaces', 'pid-control', 'vfd-braking', 'emergency-stop', 'following-error', 'servo-brakes', 'vfd-wiring-emc', 'electronics:three-phase'],
  body: `
A servo drive (servo amplifier) is a small variable-frequency drive with a brain for motion. Its power part is the same as a [[vfd-principle|VFD]]'s: a **rectifier** turns the mains into DC, **capacitors** hold it as a DC bus, and an **inverter** of six IGBTs or MOSFETs switched at 8–16 kHz rebuilds three-phase currents for the motor. Its control part reads the encoder, runs the current, velocity and position loops (see [[pid-control]]), generates or follows motion commands, and watches over everything.

### Control modes
| Mode | The drive controls… | Command comes as… | Typical use |
|---|---|---|---|
| Position | where the shaft is | pulses, network setpoints, or stored positions picked by inputs | point-to-point axes, CNC, robots |
| Velocity | how fast it turns | ±10 V analogue or network | spindles, conveyors synchronised by a controller that closes the position loop itself |
| Torque | how hard it pushes | ±10 V analogue or network | winders and tensioning, pressing to a force, master–slave gantries |

### Size, supply and power draw
| Rating | Supply | Typical size (W × H × D) | Heat loss at rated load |
|---|---|---|---|
| 100–400 W | single-phase 200–240 V | 40–55 × 150–170 × 130–180 mm | 15–35 W |
| 0.75–1.5 kW | single- or three-phase 200–240 V | 55–85 × 150–200 × 170–200 mm | 35–80 W |
| 2–5 kW | three-phase 200–240 V or 380–480 V | 85–130 × 170–250 × 180–220 mm | 70–250 W |
| 7.5–15 kW | three-phase 380–480 V | 130–220 × 250–350 × 200–250 mm | 250–700 W |

Drives are book-shaped, mounted side by side on the cabinet's back plate (low-voltage ones of 24–80 V DC often on a DIN rail). A separate **control supply** (24 V DC or 230 V on its own terminals, about 10–25 W) keeps the encoder and network alive when the main power is switched off, so the drive keeps its position. What a drive draws from the mains is the shaft power divided by the motor's and drive's efficiencies (together about 85–92 %), plus the control power. At standstill it draws only the copper losses of the holding current. A single-phase input has a poor true power factor (roughly 0.5–0.7) from the current pulses that charge the bus.

### Regeneration and the braking resistor
When the motor decelerates a load, or lowers one, it becomes a generator and pushes energy back into the DC bus. The rectifier cannot pass it to the mains, so the capacitors charge up: on a 230 V drive the bus rises from about 325 V towards the brake threshold (typically 370–390 V) and the overvoltage trip (about 400–420 V); on a 400 V drive from about 565 V towards roughly 750–800 V. A **brake chopper** then switches a **braking resistor** across the bus to burn the surplus. Small drives have a small internal resistor; heavy inertias, frequent stops and vertical axes need an external one sized for peak power $V^2/R$ and for average power. Drives on a common DC bus share energy between axes; large systems use regenerative supply units that return it to the mains. **In the simulation**, stop a heavy flywheel quickly and watch the bus climb, the resistor glow — and remove the resistor to see the overvoltage trip.

### Safe torque off and the other I/O
**STO (safe torque off)** removes the gate signals of the inverter through two independent channels, so the motor cannot make torque; it is defined in IEC 61800-5-2 and, in a suitable design, reaches the highest levels of ISO 13849-1 and IEC 62061. Removing torque at once is a stop of category 0 (IEC 60204-1); **SS1** first decelerates, then applies STO (category 1). Other I/O at 24 V: servo-on, alarm reset, limit switches, home sensor, torque limit; outputs for alarm, ready, in-position and the brake; an encoder output (A/B/Z).

| Alarm | Usual causes | First checks |
|---|---|---|
| Overcurrent | shorted or earthed motor cable, wrong U-V-W order, failed motor or power stage | motor cable and insulation (by an electrician), phase order |
| Overvoltage | deceleration too fast, no or broken braking resistor, high mains | deceleration time, resistor, its parameter |
| Undervoltage | mains dip, loose terminal, weak supply | supply voltage under load |
| Overload (I²t) | jam, brake not released, undersized motor, oscillation | brake, friction, torque monitor, tuning |
| Encoder error | damaged or badly shielded cable, noise, low battery | cable, shield and earthing, battery |
| Position deviation | collision, torque limit, too much acceleration | see [[following-error]] |

> [!warn] STO is not isolation: the motor terminals and the DC bus stay live. The bus capacitors hold a lethal charge for minutes after switch-off — wait for the time on the drive's label, then measure before touching. Isolate and lock off before work; wiring is for qualified electricians; the drive's manual and the machine's diagrams govern. On a vertical axis STO lets the load fall unless a brake holds it.

> [!key] A servo drive = rectifier, DC bus and inverter, plus the loops. Choose it for the motor, the supply, the mode and interface, the regeneration it must absorb, and the safety functions the machine needs.
`,
  ideas: [
    'A servo drive has the power stage of a VFD — rectifier, DC bus, inverter — and adds the current, velocity and position loops.',
    'Position, velocity and torque modes differ in what the drive controls and where the outer loop is closed.',
    'Braking energy returns to the DC bus; the capacitors absorb a little, the braking resistor or a common bus or regenerative supply the rest.',
    'STO removes torque through two channels; it is not isolation, and it does not hold a vertical load.',
    'A separate control supply keeps the encoder and the network alive when the main power is off.'
  ],
  pitfalls: [
    'The drive can always send braking energy back to the mains — An ordinary diode rectifier cannot; without a resistor, a common bus or a regenerative supply the bus rises until the drive trips on overvoltage.',
    'STO makes the machine safe to work on — It only stops the motor making torque; the terminals and the DC bus remain live. Isolate, lock off and wait for the capacitors before work.',
    'A drive draws its rated power all the time — It draws what the shaft delivers plus losses; at standstill only the holding current\'s copper losses and the control power.'
  ],
  formulas: [
    {
      name: 'DC bus voltage from the mains',
      expr: 'Vdc = sqrt(2)*V', tex: 'V_{dc} = \\sqrt{2}\\,V',
      vars: {
        Vdc: { name: 'DC bus voltage (no load)', q: 'voltage', unit: 'V', tex: 'V_{dc}' },
        V: { name: 'mains voltage (rms; line-to-line for three-phase)', q: 'voltage', unit: 'V', value: 230 }
      },
      note: 'The capacitors charge to the peak of the mains; under load the bus sags a few per cent.',
      stories: { Vdc: 'A drive runs from {V} mains. What is its DC bus voltage?' }
    },
    {
      name: 'Kinetic energy returned when stopping',
      expr: 'E = J*w^2/2', tex: 'E = \\tfrac{1}{2}\\,J\\,\\omega^2',
      vars: {
        E: { name: 'kinetic energy', q: 'energy', unit: 'J' },
        J: { name: 'inertia of motor and load', q: 'inertia', unit: 'kg·cm²', value: 5 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' }
      },
      note: 'Part of it is lost in the motor and the drive (typically 10–30 %); the rest charges the DC bus.',
      stories: { E: 'A motor and load of {J} turn at {w}. How much energy comes back when they stop?' }
    },
    {
      name: 'Energy the bus capacitors can absorb',
      expr: 'E = C*(V2^2 - V1^2)/2', tex: 'E = \\tfrac{1}{2}\\,C\\,(V_2^2 - V_1^2)',
      vars: {
        E: { name: 'energy absorbed', q: 'energy', unit: 'J' },
        C: { name: 'DC bus capacitance', q: 'capacitance', unit: 'µF', value: 1000 },
        V2: { name: 'brake chopper threshold', q: 'voltage', unit: 'V', value: 385, tex: 'V_2' },
        V1: { name: 'normal bus voltage', q: 'voltage', unit: 'V', value: 325, tex: 'V_1' }
      },
      stories: { E: 'A drive has {C} of bus capacitance, normally at {V1}, and its brake chopper starts at {V2}. How much braking energy can the capacitors take?' }
    },
    {
      name: 'Peak power of the braking resistor',
      expr: 'P = V^2/R', tex: 'P = \\dfrac{V^2}{R}',
      vars: {
        P: { name: 'peak power while the chopper conducts', q: 'power', unit: 'W' },
        V: { name: 'bus voltage at the brake threshold', q: 'voltage', unit: 'V', value: 390 },
        R: { name: 'braking resistance', q: 'resistance', unit: 'Ω', value: 50 }
      },
      note: 'The resistance must not be below the drive\'s minimum (the chopper transistor\'s limit). The resistor\'s rated (average) power is usually far lower than this peak.',
      stories: { P: 'A {R} braking resistor is switched across a {V} bus. What power does it take?', R: 'A resistor must be able to absorb {P} at {V}. What resistance is that?' }
    }
  ],
  examples: [
    {
      title: 'Does it need a braking resistor?',
      q: 'A 750 W drive on 230 V mains has 1000 µF of bus capacitance and a brake threshold of 385 V. Its motor and load (5 kg·cm²) stop from 3000 rpm once a second. About 80 % of the kinetic energy reaches the bus. What if the inertia doubles?',
      steps: [
        'Kinetic energy: $\\tfrac{1}{2} \\times 5 \\times 10^{-4} \\times 314.2^2 = 24.7$ J; to the bus $0.8 \\times 24.7 = 19.7$ J.',
        'The capacitors take $\\tfrac{1}{2} \\times 10^{-3} \\times (385^2 - 325^2) = 21.3$ J: just enough — but only if the bus has fallen back to 325 V before the next stop. The control circuits drain it at only 10–25 W, so with a stop every second it creeps up and the resistor starts to work.',
        'With 10 kg·cm², 39.5 J reach the bus: $39.5 - 21.3 = 18$ J go to the resistor on each stop — 18 W on average at one stop a second, with a peak of $385^2/50 = 3$ kW in a 50 Ω resistor.'
      ],
      a: 'Barely without; with double the inertia a resistor of about 20 W average (more with margin) is needed.'
    },
    {
      title: 'What does the axis draw from the mains?',
      q: 'A 400 W axis delivers 200 W of shaft power on average over its cycle. The motor is 88 % efficient, the drive 95 %, and the control circuits take 15 W. Estimate the average power from the mains.',
      steps: [
        'Power stage input: $200/(0.88 \\times 0.95) = 239$ W.',
        'Plus control power: $239 + 15 = 254$ W.',
        'At standstill, holding half the rated torque, it would draw about a quarter of the rated copper loss (current halved, loss ∝ I²) plus the 15 W.'
      ],
      a: 'About 250 W on average; the drive\'s rating is a limit, not a consumption.'
    }
  ],
  quiz: [
    { q: 'A servo drive stops a heavy flywheel quickly. What happens to the DC bus voltage?', choices: ['It rises, because the motor returns energy that the rectifier cannot pass back to the mains', 'It falls, because the motor draws more current', 'It stays exactly at the mains peak', 'It reverses polarity'], a: 0, why: 'Braking makes the motor a generator; the energy charges the capacitors until the brake chopper or the overvoltage trip steps in.' },
    { q: 'What does STO (safe torque off) do?', choices: ['Stops the motor producing torque by removing the inverter\'s gate signals through two channels — without isolating the motor', 'Disconnects the motor from the mains', 'Brakes the motor to a stop', 'Discharges the DC bus'], a: 0, why: 'STO prevents torque; the motor coasts (stop category 0). Controlled deceleration first is SS1. For work on the equipment, isolate and lock off.' },
    { q: 'A drive\'s DC bus can stay charged at a dangerous voltage for minutes after the mains is switched off.', a: true, why: 'Bus capacitors discharge slowly through bleed resistors; drives state a waiting time on the label. Measure before touching.' },
    { q: 'An axis trips with an overvoltage alarm every time it stops. Which is the least likely remedy?', choices: ['Raising the velocity-loop gain', 'Lengthening the deceleration', 'Fitting or checking a braking resistor and its parameter', 'Sharing a DC bus with other axes'], a: 0, why: 'Overvoltage on stopping is too much regenerated energy for the bus; gain changes do not remove energy.' },
    { q: 'What is the DC bus voltage of a drive on 400 V three-phase mains (no load)?', answer: 566, unit: 'V', why: '√2 × 400 = 566 V.' }
  ],
  problems: [
    { q: 'How much kinetic energy do 20 kg·cm² store at 2000 rpm?', answer: 43.9, unit: 'J', tol: 0.02, steps: ['$\\omega = 209.4$ rad/s.', '$E = \\tfrac{1}{2} \\times 2 \\times 10^{-3} \\times 209.4^2 = 43.9$ J.'] },
    { q: 'A 40 Ω braking resistor switches across a 390 V bus. What is its peak power?', answer: 3802, unit: 'W', tol: 0.01, steps: ['$P = 390^2/40 = 152\\,100/40 = 3802$ W.'] }
  ],
  choose: {
    good: [
      'Position mode with the drive\'s own position loop: the simplest wiring for point-to-point axes.',
      'Velocity mode when a CNC or motion controller closes the position loop itself.',
      'Torque mode for tension, pressing to a force, and two motors sharing one load.'
    ],
    avoid: [
      'Relying on the internal braking resistor for heavy flywheels, frequent fast stops or vertical axes — size an external one.',
      'Using STO as a maintenance isolator, or on a vertical axis without a brake.',
      'Mixing a motor and drive of different series or voltage classes.'
    ],
    check: [
      'Current (continuous and peak) and voltage class for the motor; single- or three-phase supply.',
      'The command interface and control modes your controller needs.',
      'Regeneration: braking energy and its peak, the resistor, or a common DC bus.',
      'Safety functions (STO, SS1, brake control) and the level the risk assessment demands.',
      'Size, heat loss and control power for the cabinet; EMC filter, earthing and cable lengths.'
    ]
  },
  applications: [
    'A packaging machine: a row of book-shaped drives on a common DC bus, braking energy of one axis feeding another.',
    'A press-fit station: position mode to approach, torque mode to press to a set force, then back.',
    'A vertical pick-and-place axis: STO for the guard door, a brake output, and an external braking resistor for the lowering strokes.'
  ],
  sources: [
    'IEC 61800-5-2, *Adjustable speed electrical power drive systems — Safety requirements — Functional* — STO, SS1, safe brake control and other safety functions.',
    'IEC 61800-5-1, *Adjustable speed electrical power drive systems — Safety requirements — Electrical, thermal and energy*.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines* — stop categories 0, 1 and 2.',
    'ISO 13849-1, *Safety of machinery — Safety-related parts of control systems* — performance levels.',
    'Mohan, *Electric Drives* — the power-electronic converter, the DC bus and regenerative braking.'
  ],
  sim: 'sv-drive-bus'
},

{
  id: 'command-interfaces', parent: 'servo-basics', title: 'Command interfaces: pulse/dir, analogue and fieldbus', level: 2,
  short: 'A controller tells a servo drive what to do in one of three ways: a train of pulses with a direction line (one pulse, one step), an analogue ±10 V voltage for speed or torque, or digital messages over a fieldbus or real-time Ethernet. They differ in resolution, speed, noise immunity, wiring and what the controller learns back.',
  keywords: ['pulse and direction', 'step/dir', 'CW/CCW pulses', 'A/B quadrature', 'line driver', 'open collector', 'electronic gear', '±10 V analogue', 'velocity command', 'analogue offset', 'fieldbus', 'real-time Ethernet', 'CANopen', 'CiA 402', 'cyclic synchronous position', 'cycle time', 'encoder output'],
  prereq: ['servo-drives', 'step-dir-signals', 'incremental-encoders'],
  related: ['servo-principle', 'following-error', 'rc-servos', 'electronics:serial-buses', 'electronics:optocouplers', 'electronics:dac', 'pneumatics:fieldbus-io-link'],
  body: `
Between the motion controller (a PLC, a CNC, a motion card or a microcontroller) and the servo drive runs a command. Three families dominate.

### Pulse and direction
Each pulse on the *pulse* line moves the command one increment; the *direction* line says which way. The pulse **frequency** is the speed. Variants are CW/CCW (one pulse line per direction) and A/B quadrature (two lines 90° apart, as an encoder gives). The drive closes the position loop itself. An **electronic gear** (a numerator and a denominator) scales pulses to encoder counts, so a controller sending 10 000 pulses a revolution can drive a motor with an 8 388 608-count encoder.

| Output of the controller | Typical top frequency | Cable |
|---|---|---|
| Line driver (differential, RS-422 levels) | 500 kHz – 4 MHz | twisted pairs, tens of metres |
| Open collector, 5 or 24 V | about 200 kHz | short, a few metres |

The limit is $f = n\\,N$: at 10 000 pulses a revolution, 3000 rpm needs 500 kHz. Pulses are simple, universal and cheap — the same signals drive [[step-dir-signals|steppers]] — but every pulse lost to noise or added by a spike moves the axis **silently**, the controller does not learn the real position unless the drive's encoder output is wired back, and each axis needs its own wires. The direction line must settle a few microseconds before the next pulse edge.

### Analogue ±10 V
A voltage sets speed (velocity mode) or torque (torque mode): for example +10 V = 3000 rpm forward, −10 V reverse. The controller closes the position loop from the drive's encoder output (A/B/Z). This was the standard of CNC machines for decades: continuous, fast and simple. Its weaknesses are **offset** and **noise**: 10 mV of offset at 300 rpm per volt is a creep of 3 rpm, which the outer loop must hold back with a standing error; ground loops and pickup make the axis hum. Use differential inputs, shielded twisted pairs, the drive's offset adjustment, and keep the command's zero clean.

### Fieldbus and real-time Ethernet
The command and the feedback travel as digital messages, repeated every cycle — typically 0.25–4 ms on real-time Ethernet networks, 1–10 ms on CAN-based fieldbuses (1 Mbit/s). The controller sends position (or velocity or torque) setpoints; the drive interpolates between them and returns actual position, torque, status and alarm codes. Common drive profiles define the modes: *cyclic synchronous position, velocity and torque*, where the controller plans the path, and *profile position*, where the drive plans the move (the CANopen drive profile CiA 402 is the best-known; the IEC 61800-7 series standardises such profiles). One cable daisy-chains many axes; clocks synchronise them to a microsecond; a corrupted message is detected by its checksum and counted, not obeyed. The price: configuration, software and a network to maintain. Simple systems also use RS-485 serial links, or I/O **indexing**: positions stored in the drive and selected by a few digital inputs.

**In the simulation**, run the same back-and-forth move through each interface, then add electrical noise: pulses gain counts and the axis drifts with nobody knowing; the analogue axis jitters but its outer loop keeps the position; the network counts bad frames and carries on. Push the speed past the pulse output's limit and watch the lost pulses.

| | Pulse/direction | Analogue ±10 V | Fieldbus / real-time Ethernet |
|---|---|---|---|
| Resolution | 1 pulse, set by the frequency limit | DAC (12–16 bits) and noise | as fine as the encoder |
| Noise effect | silent position error | jitter, drift at standstill | detected, counted |
| Wiring | 2–3 pairs per axis | 1 pair plus the encoder return | one cable for all axes |
| Feedback to controller | only if the encoder output is wired | encoder output needed | position, torque, alarms |
| Typical use | small machines, stepper replacements | legacy and retrofit CNC | new multi-axis machines |

> [!tip] Replacing steppers by servos on a controller that only speaks step/direction? Check its top pulse frequency and set the electronic gear so that the fastest move stays below it with margin.

> [!key] Pulses are simple but blind, analogue is fast but drifts, a network is precise and talks back. Choose by the controller, the number of axes, the speed × resolution you need, and the electrical environment.
`,
  ideas: [
    'Pulse/direction: one pulse is one increment, the pulse frequency is the speed, and the drive closes the position loop.',
    'The top pulse frequency limits speed × resolution: f = n·N.',
    'Analogue ±10 V commands speed or torque; the controller closes the position loop from the drive\'s encoder output.',
    'Fieldbuses carry setpoints and feedback every cycle, detect corrupted messages and connect many axes with one cable.',
    'Noise on pulse lines causes silent position errors; on analogue lines jitter and drift; on a network, counted and rejected frames.'
  ],
  pitfalls: [
    'More pulses per revolution always means a better axis — The pulse frequency limit then caps the speed; choose the resolution the mechanics can use and set the electronic gear.',
    'An analogue command of 0 V means the motor stands still — Any offset becomes a creep speed; the outer position loop must hold against it, leaving a small standing error unless the offset is trimmed.',
    'A fieldbus is always faster than wires — Its cycle time (often 1 ms) is a delay inside the outer loop; what it gives is precision, diagnostics and synchronisation.'
  ],
  formulas: [
    {
      name: 'Pulse frequency for a speed',
      expr: 'f = n*N', tex: 'f = n\\,N',
      vars: {
        f: { name: 'pulse frequency', q: 'frequency', unit: 'kHz' },
        n: { name: 'motor speed', q: 'frequency', unit: 'rpm', value: 3000 },
        N: { name: 'command pulses per revolution', q: 'count', value: 10000, int: true }
      },
      note: 'Must stay below the controller\'s and the drive\'s input limits (about 200 kHz open collector, 500 kHz – 4 MHz line driver).',
      stories: { f: 'A drive set to {N} pulses a revolution must turn at {n}. What pulse frequency is needed?', n: 'A controller can send at most {f}, with {N} pulses a revolution. What is the top speed?' }
    },
    {
      name: 'Distance per pulse on a screw',
      expr: 'dx = p/N', tex: '\\Delta x = \\dfrac{p}{N}',
      vars: {
        dx: { name: 'distance per command pulse', q: 'length', unit: 'µm', tex: '\\Delta x' },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 10 },
        N: { name: 'command pulses per revolution', q: 'count', value: 10000, int: true }
      },
      stories: { dx: 'A {p}-lead ball screw is driven with {N} pulses a revolution. How far does one pulse move the table?', N: 'One pulse must move a {p}-lead screw axis {dx}. How many pulses per revolution?' }
    },
    {
      name: 'Electronic gear',
      expr: 'G = Ne/Nc', tex: 'G = \\dfrac{N_{enc}}{N_{cmd}}',
      vars: {
        G: { name: 'electronic gear ratio (encoder counts per command pulse)' },
        Ne: { name: 'encoder counts per revolution', value: 8388608, int: true, tex: 'N_{enc}' },
        Nc: { name: 'command pulses per revolution', value: 10000, int: true, tex: 'N_{cmd}' }
      },
      note: 'Entered in the drive as a numerator and a denominator, often reduced to a fraction.'
    },
    {
      name: 'Creep from an analogue offset',
      expr: 'nc = nmax*Voff/Vfs', tex: 'n_c = n_{max}\\,\\dfrac{V_{off}}{V_{fs}}',
      vars: {
        nc: { name: 'creep speed', q: 'angvel', unit: 'rpm', tex: 'n_c' },
        nmax: { name: 'speed at full-scale command', q: 'angvel', unit: 'rpm', value: 3000, tex: 'n_{max}' },
        Voff: { name: 'offset voltage', q: 'voltage', unit: 'mV', value: 10, tex: 'V_{off}' },
        Vfs: { name: 'full-scale command', q: 'voltage', unit: 'V', value: 10, tex: 'V_{fs}' }
      },
      stories: { nc: 'A drive is scaled {nmax} at {Vfs}. The command has an offset of {Voff}. How fast does the motor creep at "zero"?' }
    }
  ],
  examples: [
    {
      title: 'Step/direction at the limit',
      q: 'A servo with a 23-bit encoder is commanded by pulse/direction at 10 000 pulses a revolution on a 10 mm-lead screw. What top speed do a 500 kHz line driver and a 200 kHz open-collector output allow? What resolution would let the open collector reach 3000 rpm?',
      steps: [
        'Line driver: $n = f/N = 500\\,000/10\\,000 = 50$ rev/s = 3000 rpm.',
        'Open collector: $200\\,000/10\\,000 = 20$ rev/s = 1200 rpm.',
        'For 3000 rpm (50 rev/s) at 200 kHz: $N = 200\\,000/50 = 4000$ pulses a revolution — $10\\ \\text{mm}/4000 = 2.5$ µm per pulse, still fine for most axes. Electronic gear $8\\,388\\,608/4000 = 2097.152$.'
      ],
      a: '3000 rpm and 1200 rpm; at 4000 pulses/rev (2.5 µm) the open collector reaches 3000 rpm.'
    },
    {
      title: 'An analogue offset',
      q: 'A drive in velocity mode is scaled 3000 rpm at 10 V. The command carries a 10 mV offset. The controller\'s position loop has a gain of 30 s⁻¹. How fast would the motor creep without the loop, and what standing error does the loop keep?',
      steps: [
        'Creep: $n_c = 3000 \\times 0.010/10 = 3$ rpm = 0.05 rev/s.',
        'The position loop must command −3 rpm to cancel it: error $= 0.05/30 = 0.00167$ rev $= 0.6°$.',
        'Trimming the offset in the drive, or integral action in the loop, removes it.'
      ],
      a: '3 rpm of creep; a standing error of about 0.6°.'
    }
  ],
  quiz: [
    { q: 'A drive is set to 10 000 pulses a revolution and the controller can send 500 kHz. What is the top speed?', choices: ['3000 rpm', '500 rpm', '30 000 rpm', '5000 rpm'], a: 0, why: '500 000/10 000 = 50 rev/s = 3000 rpm.' },
    { q: 'Electrical spikes add stray pulses on a step/direction line. What happens?', choices: ['The axis moves by those counts and nobody knows, unless the encoder is read back', 'The drive raises an alarm at once', 'Nothing: the drive filters every spike', 'The motor stops'], a: 0, why: 'A pulse is a command; the drive faithfully follows it. Line drivers, twisted pairs, shields and input filters reduce the risk; reading the position back reveals it.' },
    { q: 'In analogue velocity mode, where is the position loop closed?', choices: ['In the controller, from the drive\'s encoder output', 'In the drive, from the analogue input', 'Nowhere: analogue mode has no position loop', 'In the motor'], a: 0, why: 'The drive only controls speed; the controller compares the commanded position with the encoder counts it receives and adjusts the voltage.' },
    { q: 'Over a fieldbus the controller can read the drive\'s actual position, torque and alarm codes through the same cable that carries the commands.', a: true, why: 'Setpoints go one way, actual values and status the other, every cycle — one of the main reasons networks replaced pulses and analogue.' },
    { q: 'What pulse frequency (kHz) is needed for 1500 rpm at 4000 pulses a revolution?', answer: 100, unit: 'kHz', why: '1500/60 × 4000 = 100 000 Hz.' }
  ],
  problems: [
    { q: 'What pulse frequency does 2000 rpm need at 10 000 pulses a revolution?', answer: 333.3, unit: 'kHz', tol: 0.01, steps: ['$2000/60 = 33.33$ rev/s.', '$33.33 \\times 10\\,000 = 333\\,300$ Hz = 333 kHz.'] },
    { q: 'A drive is scaled 3000 rpm at 10 V and its command has a 25 mV offset. What is the creep speed?', answer: 7.5, unit: 'rpm', tol: 0.01, steps: ['$n_c = 3000 \\times 0.025/10 = 7.5$ rpm.'] }
  ],
  choose: {
    good: [
      'Pulse/direction: one to four axes on a PLC or microcontroller, and stepper replacements.',
      'Analogue ±10 V: CNC controllers that close their own position loops, and retrofits of legacy machines.',
      'Fieldbus or real-time Ethernet: many synchronised axes, diagnostics, absolute position read-back and less wiring.'
    ],
    avoid: [
      'Pulses at high speed with fine resolution on open-collector outputs and long cables.',
      'Analogue commands in electrically noisy cabinets without differential inputs and shielded twisted pairs.',
      'A network on a one-axis gadget where nobody will maintain its configuration.'
    ],
    check: [
      'Pulse frequency needed ($f = nN$) against the output and input limits; the electronic gear.',
      'Signal levels (5 V or 24 V), NPN or PNP, line driver or open collector, cable length and shielding.',
      'Analogue: resolution of the controller\'s DAC, offset trim, grounding.',
      'Network: supported profiles and modes, cycle time, number of axes, the controller\'s software.'
    ]
  },
  applications: [
    'A small XY table on a PLC: two servo drives on pulse/direction with 10 000 pulses a revolution.',
    'A 1980s machining centre kept running with modern AC servo drives in analogue velocity mode.',
    'A 30-axis packaging line on real-time Ethernet: cyclic synchronous position at 1 ms, one cable through all drives.'
  ],
  sources: [
    'IEC 61800-7 series, *Adjustable speed electrical power drive systems — Generic interface and use of profiles for power drive systems*.',
    'CiA 402, the CANopen device profile for drives and motion control: operating modes such as profile position and cyclic synchronous position.',
    'TIA/EIA-422 (RS-422), balanced voltage digital interface circuits — the line-driver signals used for pulses and encoder outputs.'
  ],
  sim: 'sv-command'
},

/* ================================================================ CONTROL AND TUNING */
{
  id: 'pid-control', parent: 'servo-tuning-topic', title: 'PID control', level: 2,
  short: 'A PID controller turns an error into a correction from three terms: proportional to the error now, to its integral over the past, and to its rate of change. In a servo drive the terms are spread over three nested loops — current, velocity and position — each several times faster than the one around it, with feed-forward doing most of the work on a known path.',
  keywords: ['PID', 'proportional', 'integral', 'derivative', 'PI controller', 'cascade control', 'current loop', 'velocity loop', 'position loop', 'feed-forward', 'integral windup', 'anti-windup', 'derivative kick', 'natural frequency', 'damping ratio', 'position gain'],
  prereq: ['servo-principle', 'physics:rotational-dynamics', 'physics:damped-oscillations'],
  related: ['servo-tuning', 'following-error', 'servo-drives', 'inertia-matching', 'electronics:negative-feedback', 'math:damped-oscillator-ode', 'math:laplace-transform', 'hydraulics:servo-loop'],
  body: `
Every servo loop turns an **error** into a correction. The PID controller does it with three terms:

$$u(t) = K_p\\,e(t) + K_i \\int_0^t e\\,dt + K_d\\,\\frac{de}{dt}$$

- **P, proportional**: a correction proportional to the error now. More P makes the loop stiffer and faster — and, beyond a point, makes it overshoot and oscillate. Alone it leaves a steady error under a steady load, because the error must exist to produce the holding torque: $e = T_L/K_p$.
- **I, integral**: the [[?integral|integral]] adds the error up over time, so a lasting error builds a correction until the error is gone. It removes steady errors from friction and gravity — but it reacts late, adds overshoot, and **winds up** while the output sits at its limit (the torque limit), then overshoots badly when released. Drives stop integrating while saturated: *anti-windup*.
- **D, derivative**: the [[?derivative|rate of change]] of the error says where it is heading and brakes the approach — damping. It amplifies noise (one count of encoder jitter, differentiated at 8 kHz, is a large spike), so it is always filtered, and it is taken from the measurement rather than the error so that a step in the command does not cause a "derivative kick".

For a motor the plant is an inertia: torque makes acceleration. With P and D alone the loop is a mass on a spring with a damper, with natural frequency $\\sqrt{K_p/J}$ and damping ratio $K_d/(2\\sqrt{K_p J})$ — the [[math:damped-oscillator-ode|damped oscillator]] in disguise.

### The cascade inside a servo drive
A servo drive does not run one big PID; it nests three simpler loops, each much faster than the one around it:

| Loop | Controller | Measures | Typical sample rate | Typical bandwidth |
|---|---|---|---|---|
| Current (torque) | PI | phase currents | 8–32 kHz | 1–3 kHz |
| Velocity | PI with filters | speed from the encoder | 4–16 kHz | 50–500 Hz |
| Position | P with feed-forward | encoder position | 1–8 kHz | 10–100 Hz |

The current loop makes the motor a clean torque source, hiding its inductance and back-EMF. The velocity loop's proportional gain acts on speed — the derivative of position — so *position P plus velocity PI* is a PID position controller with the D taken from the measurement. Neighbouring loops need a bandwidth ratio of about 3–10; if an inner loop is too slow, the outer one oscillates. Gains come in physical units: the position gain $K_{pp}$ in s⁻¹ (speed command per unit of error), the velocity gain in N·m per rad/s or as a bandwidth in Hz once the inertia is known, the integral as a time in milliseconds.

### Feed-forward
Feedback waits for an error to appear. **Feed-forward** does not: the controller knows the planned speed and acceleration, so it adds the speed command and the torque $J\\alpha$ directly, and the loops only correct what the plan missed. Velocity feed-forward can cut the [[following-error]] by 90 % or more without touching the gains.

**In the simulation**, give the heavy table a step with P only: it overshoots and rings, and a load leaves it short of the mark. Add D and the ringing dies; add I and the last error melts away. Make I large and press the table against the torque limit: the integral winds up and the release overshoots — then tick *anti-windup*.

| Symptom | Likely cause | Remedy |
|---|---|---|
| Sluggish, big error under load | P (or velocity gain) too low | raise it |
| Rings or oscillates quickly | P too high, too little damping | lower P, raise D or the velocity gain |
| Slow creep, low-frequency hunting | I too strong; friction, backlash | lower I, check the mechanics |
| Buzz, hot motor, noisy current | gain amplifying noise | filter, lower the gain, finer encoder |
| Big overshoot after a limit | integral windup | anti-windup, clamp the integral |

> [!key] P corrects the present, I the past, D the future. In a servo drive they are spread over nested current, velocity and position loops, each faster than the next — and feed-forward does most of the work on a known path.
`,
  ideas: [
    'P reacts to the error now, I to its accumulated past, D to its trend.',
    'With P alone a steady load leaves a steady error; integral action removes it.',
    'On an inertia, P and D make a spring and a damper: natural frequency √(Kp/J), damping ratio Kd/(2√(Kp·J)).',
    'Servo drives cascade current, velocity and position loops, each 3–10 times faster than the one outside it.',
    'Feed-forward supplies the planned speed and torque directly; feedback only corrects what is left.'
  ],
  pitfalls: [
    'More integral action makes a loop more accurate in every way — It removes steady error but slows the approach, adds overshoot, winds up at limits and causes hunting with friction and backlash.',
    'The derivative term should act on the error — Acting on a stepped command it gives a huge kick; taking it from the measurement (as a velocity loop does) gives the same damping without the kick.',
    'Following error is fixed by raising the gains — Gains are limited by stability; velocity and acceleration feed-forward remove most of the error of a planned move.'
  ],
  formulas: [
    {
      name: 'Natural frequency of a PD loop on an inertia',
      expr: 'fn = sqrt(Kp/J)/(2*pi)', tex: 'f_n = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{K_p}{J}}',
      vars: {
        fn: { name: 'natural frequency', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        Kp: { name: 'proportional gain (torque per radian of error)', unit: 'N·m/rad', value: 316, tex: 'K_p' },
        J: { name: 'inertia', q: 'inertia', unit: 'kg·m²', value: 2 }
      },
      stories: { fn: 'A table of {J} is held by a proportional gain of {Kp}. At what frequency does it swing?', Kp: 'A table of {J} should respond with a natural frequency of {fn}. What proportional gain is needed?' }
    },
    {
      name: 'Damping ratio',
      expr: 'zeta = Kd/(2*sqrt(Kp*J))', tex: '\\zeta = \\dfrac{K_d}{2\\sqrt{K_p\\,J}}',
      vars: {
        zeta: { name: 'damping ratio', tex: '\\zeta' },
        Kd: { name: 'derivative gain (torque per rad/s)', unit: 'N·m·s/rad', value: 35.2, tex: 'K_d' },
        Kp: { name: 'proportional gain', unit: 'N·m/rad', value: 316, tex: 'K_p' },
        J: { name: 'inertia', q: 'inertia', unit: 'kg·m²', value: 2 }
      },
      note: 'ζ = 1 is critical damping (no overshoot); 0.7 gives about 5 % overshoot; below 0.3 the loop rings.',
      stories: { zeta: 'A table of {J} has Kp = {Kp} and Kd = {Kd}. What is its damping ratio?', Kd: 'A table of {J} with Kp = {Kp} should have a damping ratio of {zeta}. What derivative gain is needed?' }
    },
    {
      name: 'Integral time',
      expr: 'Ti = Kp/Ki', tex: 'T_i = \\dfrac{K_p}{K_i}',
      vars: {
        Ti: { name: 'integral time', q: 'time', unit: 's', tex: 'T_i' },
        Kp: { name: 'proportional gain', unit: 'N·m/rad', value: 316, tex: 'K_p' },
        Ki: { name: 'integral gain', unit: 'N·m/(rad·s)', value: 600, tex: 'K_i' }
      },
      note: 'The time in which a constant error makes the integral term as large as the proportional term. Drives usually ask for this time, not for Ki.',
      stories: { Ti: 'A loop has Kp = {Kp} and Ki = {Ki}. What is its integral time?' }
    },
    {
      name: 'Speed command of the position loop',
      expr: 'w = Kpp*err', tex: '\\omega_{cmd} = K_{pp}\\,\\theta_e',
      vars: {
        w: { name: 'speed command', q: 'angvel', unit: 'rpm', tex: '\\omega_{cmd}' },
        Kpp: { name: 'position-loop gain', q: 'rate', unit: '1/s', value: 50, tex: 'K_{pp}' },
        err: { name: 'position error', q: 'angle', unit: '°', value: 10, signed: true, tex: '\\theta_e' }
      },
      note: 'In a cascade the position loop is proportional: it asks the velocity loop for a speed proportional to the error. Its bandwidth is about Kpp/2π.',
      stories: { w: 'A position loop has a gain of {Kpp}. What speed does it command for an error of {err}?' }
    }
  ],
  examples: [
    {
      title: 'Choosing P and D for a rotary table',
      q: 'A rotary table has an inertia of 2 kg·m² (with the motor reflected). Choose Kp and Kd for a natural frequency of 2 Hz and a damping ratio of 0.7. With P and D only, how far does a steady load of 50 N·m push it?',
      steps: [
        '$K_p = J\\,(2\\pi f_n)^2 = 2 \\times 12.57^2 = 316$ N·m/rad.',
        '$K_d = 2\\zeta\\sqrt{K_p J} = 1.4 \\times \\sqrt{632} = 35.2$ N·m·s/rad.',
        'Steady error: $50/316 = 0.158$ rad = 9.1°. An integral term with $T_i \\approx 0.5$ s ($K_i \\approx 600$) removes it within a second or two.'
      ],
      a: 'Kp ≈ 316 N·m/rad, Kd ≈ 35 N·m·s/rad; 9° of droop without integral action.'
    },
    {
      title: 'The position loop in a cascade',
      q: 'A drive\'s position gain is 50 s⁻¹. What speed does it command for a 10° error, and roughly what is the position loop\'s bandwidth?',
      steps: [
        '$\\omega = 50 \\times (10 \\times \\pi/180) = 8.73$ rad/s = 83 rpm.',
        'Bandwidth $\\approx K_{pp}/2\\pi = 8$ Hz — comfortably below a velocity loop of 100–200 Hz.'
      ],
      a: '83 rpm; about 8 Hz.'
    }
  ],
  quiz: [
    { q: 'Which term removes the steady error left by a constant load?', choices: ['Integral', 'Proportional', 'Derivative', 'Feed-forward of speed'], a: 0, why: 'The integral keeps growing while any error remains, so it builds exactly the torque the load needs and the error goes to zero.' },
    { q: 'Why is the D term usually computed from the measured position rather than from the error?', choices: ['A step in the command would otherwise give a huge spike ("derivative kick")', 'The measurement is always less noisy than the command', 'It makes the integral faster', 'It changes the sign of the damping'], a: 0, why: 'The derivative of a step is infinite. The measured position changes smoothly, so its derivative gives damping without the kick.' },
    { q: 'In a cascade of current, velocity and position loops, the inner loops must be faster than the outer ones.', a: true, why: 'Each outer loop treats the inner one as an ideal actuator. If the inner loop lags, the outer loop sees a delay and oscillates; ratios of 3–10 in bandwidth are usual.' },
    { q: 'A table is held against its torque limit for a while by an obstacle; when released it overshoots far. Why?', choices: ['Integral windup: the integral kept growing while the output was limited', 'Too much derivative gain', 'The encoder lost counts', 'The proportional gain fell'], a: 0, why: 'While saturated the extra correction did nothing, but the integral kept accumulating. Anti-windup stops integrating when the output is at its limit.' },
    { q: 'An inertia of 0.5 kg·m² is held by Kp = 200 N·m/rad. What is its natural frequency in Hz?', answer: 3.18, unit: 'Hz', why: '√(200/0.5) = 20 rad/s; 20/2π = 3.18 Hz.' }
  ],
  problems: [
    { q: 'An inertia of 0.8 kg·m² is controlled with Kp = 500 N·m/rad. What is the natural frequency?', answer: 3.98, unit: 'Hz', tol: 0.01, steps: ['$\\sqrt{500/0.8} = 25$ rad/s.', '$25/2\\pi = 3.98$ Hz.'] },
    { q: 'A position loop gain of 40 s⁻¹ sees an error of half a revolution. What speed does it command, in rpm?', answer: 1200, unit: 'rpm', tol: 0.01, steps: ['$\\omega = 40 \\times 0.5$ rev $= 20$ rev/s.', '20 rev/s = 1200 rpm.'] }
  ],
  choose: {
    good: [
      'The standard servo cascade: PI current, PI velocity, P position with velocity and acceleration feed-forward.',
      'A single PID with a filtered D on the measurement for slow single loops: a heated platen, a pressure, a simple position on a DC gearmotor.',
      'Feed-forward wherever the path is planned in advance.'
    ],
    avoid: [
      'A D term on a coarse or noisy sensor without filtering.',
      'Strong integral action with backlash or stiction: it hunts back and forth around the target.',
      'One big PID where a drive already offers cascaded loops tuned to the motor.'
    ],
    check: [
      'Sample rate at least 10–20 times the loop bandwidth.',
      'Output limits and anti-windup.',
      'The units your drive uses for each gain, and whether it scales them by the inertia ratio.',
      'Noise and filters; the encoder resolution the D and velocity terms need.'
    ]
  },
  applications: [
    'Every servo drive: PI current and velocity loops and a P position loop running at kilohertz rates.',
    'Temperature and pressure control of machines: single PID loops in PLCs and panel controllers.',
    'Hydraulic and pneumatic servo axes: the same loops around a proportional or servo valve (see [[hydraulics:servo-loop|closed-loop position control]]).'
  ],
  history: 'Nicolas Minorsky analysed three-term control for automatic ship steering in 1922, watching how helmsmen corrected for the present error, its growth and its persistence. In 1942 John Ziegler and Nathaniel Nichols published tuning rules that made PID the workhorse of process control; servo drives brought it to kilohertz rates with microprocessors in the 1980s.',
  sources: [
    'Åström and Hägglund, *PID Controllers: Theory, Design, and Tuning* — the three terms, windup, derivative filtering and tuning rules.',
    'Ellis, *Control System Design Guide* — cascaded current, velocity and position loops and feed-forward in motion control.',
    'Franklin, Powell and Emami-Naeini, *Feedback Control of Dynamic Systems* — second-order response, damping and steady-state error.'
  ],
  sim: 'sv-pid'
},

{
  id: 'servo-tuning', parent: 'servo-tuning-topic', title: 'Tuning a servo', level: 3,
  short: 'Tuning sets the gains and filters of a servo\'s loops so that the axis is as fast and stiff as its mechanics allow — without ringing, noise or instability. The usual limits are the inertia ratio and the resonance of couplings and belts; notch filters, the right inertia setting, auto-tune and feed-forward are the tools.',
  keywords: ['servo tuning', 'step response', 'overshoot', 'settling time', 'gain', 'velocity loop gain', 'integral time', 'notch filter', 'torque filter', 'resonance', 'anti-resonance', 'auto-tune', 'stiffness level', 'machine analyser', 'inertia ratio setting', 'two-mass system'],
  prereq: ['pid-control', 'inertia-matching', 'physics:driven-oscillations'],
  related: ['following-error', 'servo-drives', 'motor-vibration', 'motor-noise', 'couplings-alignment', 'belts-pulleys', 'electronics:bode-plots', 'electronics:rlc-transient'],
  body: `
Tuning sets the gains and filters of the loops so that the axis is as fast and stiff as its mechanics allow, without ringing, noise or instability. The limit is rarely the motor or the drive — it is the machine: its inertia, its stiffness, its resonances and its backlash.

### What a good response looks like
Command a small step and watch the response:

| Measure | Meaning | Typical target |
|---|---|---|
| Rise time | how quickly it moves | a few ms (velocity loop), 10–50 ms (position) |
| Overshoot | how far it passes the target | 0–10 % for positioning; none for machining |
| Settling time | until it stays inside the in-position band (say ±10 counts or ±0.01 mm) | as short as the process needs |
| Steady error | what remains | zero, with integral action |

For a loop that behaves like a second-order system the overshoot depends only on the damping ratio, through an [[?exponential|exponential]]: $M_p = e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}$ — 4.6 % at ζ = 0.7, 16 % at 0.5, 37 % at 0.3.

### A manual procedure
1. **Inertia first.** Enter or identify the load-to-motor inertia ratio; the drive scales its velocity gain by it. A wrong ratio gives a loop that is secretly too soft, or too hot.
2. **Velocity loop.** With little integral action, raise the gain until the axis starts to buzz or ring, then back off by 20–30 %. Set the integral time so that the integral acts several times slower than the proportional part.
3. **Filters.** A torque-command low-pass filter (typically a few hundred hertz to 2 kHz) quietens encoder noise; a **notch** filter placed on a mechanical resonance lets the gain rise past it.
4. **Position loop.** Raise the position gain to roughly a quarter to a fifth of the velocity bandwidth in rad/s; add velocity and acceleration feed-forward to shrink the following error.
5. **Check real moves**, not just steps: following error, settling, current peaks and noise, at the heaviest and the lightest load.

### Resonance: the usual limit
Motor and load are joined by a coupling, a shaft, a belt or a screw — springs. Two inertias on a spring of stiffness $k$ have a **resonance**

$$f_r = \\frac{1}{2\\pi}\\sqrt{k\\left(\\frac{1}{J_m}+\\frac{1}{J_L}\\right)}$$

and below it an **anti-resonance** $\\frac{1}{2\\pi}\\sqrt{k/J_L}$, where the load swings while the motor hardly moves. Belt axes resonate at tens to a few hundred hertz, ball-screw axes at a few hundred hertz to about a kilohertz. A gain that pushes the velocity loop towards the resonance makes the axis sing — a whine at a fixed pitch, whatever the speed. The cures: a notch filter, a stiffer coupling or belt, a lower [[inertia-matching|inertia ratio]], or less gain.

### Auto-tuning
Most drives tune themselves. A *one-shot* auto-tune moves the axis back and forth to measure inertia and friction, then sets the gains from a chosen **stiffness level** — low for belts and long arms, high for rigid screw axes. A *machine analyser* sweeps frequencies to find resonances and sets notch filters. *Adaptive* tuning keeps estimating the inertia and moving the notches while the machine runs. Auto-tune is an excellent start, but it cannot know how much overshoot your process tolerates, or that the load will change.

**In the simulation**, a motor drives a load through a belt. Raise the velocity bandwidth: the step gets faster, then rings at the belt's resonance and finally goes unstable. Turn the notch on and the gain can climb further. Set a wrong inertia ratio and watch the real response differ from what the setting promises. *Auto-tune* identifies the inertia, sets the notch and picks the highest gain that keeps the overshoot small.

> [!warn] Tuning moves the machine, sometimes violently. Start with low gains and small moves, keep the travel clear with the limit switches and emergency stop working, and stay out of the axis's reach: a loop driven unstable can hit an end stop at full torque.

> [!key] Tune from the inside out — current, velocity, position — with the right inertia ratio; filter the noise and notch the resonances; then use feed-forward, not brute gain, to follow the path.
`,
  ideas: [
    'Step responses are judged by rise time, overshoot, settling time and steady error.',
    'Overshoot depends only on the damping ratio: about 5 % at ζ = 0.7.',
    'The inertia ratio must be right before the gains mean anything.',
    'Compliance between motor and load creates a resonance that usually sets the highest usable gain; notch filters move that limit.',
    'Auto-tune measures inertia and resonances and picks gains for a stiffness level; the process decides the rest.'
  ],
  pitfalls: [
    'A whine that changes with gain but not with speed is a bearing or gear problem — A fixed-pitch whine that appears when the gain rises is the loop exciting a mechanical resonance; a notch filter or less gain cures it.',
    'Auto-tune gives the best possible tuning — It gives a safe, general one for a stiffness level; it cannot know the overshoot your process tolerates, the load changes, or the resonances it did not excite.',
    'If the step looks good the axis is tuned — Check real moves at the lightest and heaviest loads: following error, settling and current peaks often reveal what a small step hides.'
  ],
  formulas: [
    {
      name: 'Overshoot from the damping ratio',
      expr: 'Mp = exp(-pi*z/sqrt(1 - z^2))', tex: 'M_p = e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}',
      vars: {
        Mp: { name: 'overshoot', q: 'ratio', unit: '%', tex: 'M_p' },
        z: { name: 'damping ratio', value: 0.5, min: 0.01, max: 0.99, tex: '\\zeta' }
      },
      note: 'For a loop that behaves like a second-order system without zeros; real loops with integral action overshoot somewhat more.',
      stories: { Mp: 'A loop has a damping ratio of {z}. How far does a step overshoot?', z: 'A measured step overshoots by {Mp}. What damping ratio does that suggest?' }
    },
    {
      name: 'Settling time (2 %)',
      expr: 'ts = 4/(z*2*pi*fn)', tex: 't_s \\approx \\dfrac{4}{\\zeta\\,2\\pi f_n}',
      vars: {
        ts: { name: 'settling time to within 2 %', q: 'time', unit: 'ms', tex: 't_s' },
        z: { name: 'damping ratio', value: 0.7, min: 0.01, max: 1, tex: '\\zeta' },
        fn: { name: 'natural frequency of the loop', q: 'frequency', unit: 'Hz', value: 50, tex: 'f_n' }
      },
      stories: { ts: 'A position loop has a natural frequency of {fn} and a damping ratio of {z}. How long does it take to settle?', fn: 'An axis must settle within {ts} with a damping ratio of {z}. What natural frequency does its loop need?' }
    },
    {
      name: 'Two-mass resonance',
      expr: 'fr = sqrt(k*(1/Jm + 1/JL))/(2*pi)', tex: 'f_r = \\dfrac{1}{2\\pi}\\sqrt{k\\left(\\dfrac{1}{J_m}+\\dfrac{1}{J_L}\\right)}',
      vars: {
        fr: { name: 'resonance frequency', q: 'frequency', unit: 'Hz', tex: 'f_r' },
        k: { name: 'torsional stiffness between motor and load (at the motor)', unit: 'N·m/rad', value: 800 },
        Jm: { name: 'motor inertia', q: 'inertia', unit: 'kg·cm²', value: 1.3, tex: 'J_m' },
        JL: { name: 'load inertia (at the motor)', q: 'inertia', unit: 'kg·cm²', value: 10, tex: 'J_L' }
      },
      stories: { fr: 'A motor of {Jm} drives a load of {JL} through a coupling of {k}. At what frequency will the axis resonate?', k: 'A motor of {Jm} and a load of {JL} must not resonate below {fr}. How stiff must the connection be?' }
    },
    {
      name: 'Anti-resonance',
      expr: 'far = sqrt(k/JL)/(2*pi)', tex: 'f_{ar} = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{J_L}}',
      vars: {
        far: { name: 'anti-resonance frequency', q: 'frequency', unit: 'Hz', tex: 'f_{ar}' },
        k: { name: 'torsional stiffness (at the motor)', unit: 'N·m/rad', value: 800 },
        JL: { name: 'load inertia (at the motor)', q: 'inertia', unit: 'kg·cm²', value: 10, tex: 'J_L' }
      },
      note: 'The load swinging on the spring while the motor stands almost still: the loop barely sees it, which is why high inertia ratios are hard to tune.',
      stories: { far: 'A load of {JL} hangs on a connection of {k}. At what frequency does it swing against a motor that hardly moves?' }
    }
  ],
  examples: [
    {
      title: 'Where will a belt axis sing?',
      q: 'A 750 W motor ($J_m$ = 1.3 kg·cm²) drives, through a belt, a load of 10 kg·cm² (as seen at the motor). The belt\'s torsional stiffness at the motor is 800 N·m/rad. Find the resonance and anti-resonance.',
      steps: [
        '$1/J_m + 1/J_L = 1/(1.3 \\times 10^{-4}) + 1/(10^{-3}) = 7692 + 1000 = 8692$ kg⁻¹m⁻².',
        '$f_r = \\sqrt{800 \\times 8692}/2\\pi = 2637/2\\pi = 420$ Hz.',
        '$f_{ar} = \\sqrt{800/10^{-3}}/2\\pi = 894/2\\pi = 142$ Hz.',
        'Without a notch, keep the velocity bandwidth well below 140 Hz; with a notch at 420 Hz and a stiffer belt it can go higher.'
      ],
      a: 'Resonance about 420 Hz, anti-resonance about 142 Hz.'
    },
    {
      title: 'Reading a step response',
      q: 'A position step overshoots by 25 %. What damping ratio does that suggest, and what should you do?',
      steps: [
        'Invert $M_p = e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}$: $\\zeta = \\dfrac{-\\ln M_p}{\\sqrt{\\pi^2 + \\ln^2 M_p}} = \\dfrac{1.386}{\\sqrt{9.870 + 1.921}} = 0.40$.',
        'That is under-damped. Lower the position gain or the integral action, or raise the velocity gain (which damps the position loop); aim for ζ ≈ 0.7 (5 %).'
      ],
      a: 'ζ ≈ 0.4: too little damping.'
    }
  ],
  quiz: [
    { q: 'Raising the velocity gain makes the axis whine at a fixed pitch that does not change with speed. What is it?', choices: ['The loop exciting a mechanical resonance of the coupling, belt or frame', 'A worn bearing', 'The PWM frequency', 'Cogging torque'], a: 0, why: 'A resonance has a fixed frequency set by stiffness and inertia. A notch filter at that frequency, a stiffer drivetrain or less gain cures it.' },
    { q: 'The drive\'s inertia-ratio parameter is left at 1, but the real load is 10 times the motor inertia. The actual velocity-loop bandwidth is…', choices: ['much lower than the drive assumes: the axis is sluggish and overshoots in position', 'much higher: the axis oscillates', 'exactly as set', 'zero'], a: 0, why: 'The drive computes its gain for 2 × Jm of total inertia; the real total is 11 × Jm, so the loop is about five times slower than intended.' },
    { q: 'About how much does a second-order loop with ζ = 0.7 overshoot?', choices: ['About 5 %', 'About 16 %', 'About 37 %', 'Not at all'], a: 0, why: 'e^(−π·0.7/√0.51) = 0.046.' },
    { q: 'Auto-tune knows how much overshoot your process can tolerate.', a: false, why: 'It picks gains for a general stiffness level. Whether 3 % overshoot damages a part, or the load changes later, is for you to check.' },
    { q: 'What overshoot (in %) does a damping ratio of 0.5 give?', answer: 16.3, unit: '%', why: 'e^(−π·0.5/√0.75) = e^(−1.814) = 0.163.' }
  ],
  problems: [
    { q: 'A motor of 2 kg·cm² drives a load of 8 kg·cm² through a coupling of 2000 N·m/rad. What is the resonance frequency?', answer: 563, unit: 'Hz', tol: 0.02, steps: ['$1/(2 \\times 10^{-4}) + 1/(8 \\times 10^{-4}) = 5000 + 1250 = 6250$.', '$\\sqrt{2000 \\times 6250} = 3536$ rad/s.', '$3536/2\\pi = 563$ Hz.'] },
    { q: 'A loop has ζ = 0.7 and a natural frequency of 20 Hz. Estimate its 2 % settling time.', answer: 45.5, unit: 'ms', tol: 0.02, steps: ['$t_s = 4/(0.7 \\times 2\\pi \\times 20) = 4/87.96 = 0.0455$ s.'] }
  ],
  choose: {
    good: [
      'One-shot auto-tune as the starting point on standard mechanics (ball screws, rigid couplings).',
      'A machine analyser and notch filters on belt axes, long arms and light frames with resonances.',
      'Adaptive tuning or gain switching when the load changes a lot (a robot with and without its payload).'
    ],
    avoid: [
      'Tuning to the edge of stability: temperature, wear and load changes will push it over.',
      'Raising the gains to cure following error — use feed-forward.',
      'Tuning without the real load, or with the brake or guards not in their working state.'
    ],
    check: [
      'The inertia ratio setting against the real load.',
      'Resonances of the drivetrain and frame; the notch frequencies.',
      'The overshoot, settling time and in-position band your process needs.',
      'Motor noise, current ripple and temperature after tuning.',
      'Response at the heaviest and lightest loads, and after warm-up.'
    ]
  },
  applications: [
    'Commissioning a gantry: auto-tune each axis, find the belt resonance with the analyser, set a notch, then raise the stiffness level.',
    'A robot joint whose payload varies from 0 to 10 kg: adaptive inertia estimation keeps the response consistent.',
    'A machine tool axis tuned for zero overshoot, so that the tool never cuts past the programmed contour.'
  ],
  sources: [
    'Ellis, *Control System Design Guide* — tuning, filters, resonance and two-mass systems in servo control.',
    'Younkin, *Industrial Servo Control Systems: Fundamentals and Applications* — servo tuning and machine resonances.',
    'Franklin, Powell and Emami-Naeini, *Feedback Control of Dynamic Systems* — overshoot, settling time and damping of second-order systems.'
  ],
  sim: 'sv-tuning'
},

{
  id: 'inertia-matching', parent: 'servo-tuning-topic', title: 'Inertia matching', level: 2,
  short: 'The inertia ratio — the load\'s inertia as the motor feels it, divided by the rotor\'s — decides how much torque a move takes and how easily the axis can be tuned. A reduction divides the load\'s inertia by the square of its ratio; the torque for a given load acceleration is least when the reflected load equals the rotor.',
  keywords: ['inertia matching', 'inertia ratio', 'load inertia', 'rotor inertia', 'reflected inertia', 'gear ratio', 'optimum gear ratio', 'ball screw inertia', 'low-inertia motor', 'medium-inertia motor', 'resonance', 'tuning'],
  prereq: ['inertia-reflected', 'ac-servo-motors', 'physics:moment-of-inertia'],
  related: ['servo-tuning', 'gearboxes', 'lead-ball-screws', 'belts-pulleys', 'motor-selection-method', 'rms-torque-sizing', 'physics:rotational-dynamics'],
  body: `
The **inertia ratio** is the load's inertia as the motor feels it, divided by the motor's own rotor inertia:

$$R_J = \\frac{J_L/i^2}{J_m}$$

where $i$ is the ratio of any gearbox or belt reduction between them — the [[inertia-reflected|reflected inertia]] falls with the square of the ratio. It is the single number that most decides how easily a servo axis can be tuned.

### Why the ratio matters
- **Torque to accelerate.** The motor accelerates its own rotor as well as the load: $T = (J_m + J_L/i^2)\\,\\alpha_m$. For a given *load* acceleration the torque needed is least when $i = \\sqrt{J_L/J_m}$ — the reduction that makes the reflected load equal to the rotor, which is where "matching" got its name. There, half the torque accelerates the rotor.
- **Control.** The loop acts on the motor shaft; the load hangs on it through a coupling, belt, screw or gearbox — a spring. When the load is many times the rotor, it can swing on that spring while the motor hardly notices (the anti-resonance falls), so the loop must be slowed to stay stable: lower gains, more overshoot, longer settling, more trouble from backlash.
- **Load changes.** A robot picking a part or a roll unwinding changes the load inertia. With a small ratio the change hardly shows; with a large one the tuning no longer fits.

### How much is too much?
| Inertia ratio $R_J$ | What to expect |
|---|---|
| 1–3 | very responsive, easy to tune: the classic "matched" range for fast indexing |
| 3–10 | normal for machine axes with rigid couplings and screws |
| 10–30 | workable with stiff mechanics, lower gains, notch filters and good auto-tune |
| 30–100 and more | slow, gentle axes only (conveyors, turntables); soft tuning, long settling |

Guidance from motor makers varies — roughly 5–10 : 1 for highly dynamic low-inertia motors, up to 30 : 1 or more for medium-inertia motors on stiff mechanics. The stiffer the connection (a short bellows coupling rather than a long belt), the higher the ratio the loop tolerates.

### What to do about a high ratio
1. **Add a reduction.** A ratio $i$ divides the reflected inertia by $i^2$: a 5 : 1 gearbox turns 46 : 1 into 1.8 : 1. Check that the motor speed ($i$ times the load speed) stays within its rating, and the gearbox's backlash and stiffness.
2. **Choose a medium-inertia motor** of the same power ([[ac-servo-motors]]): its bigger rotor lowers the ratio at some cost in acceleration.
3. **Lighten the load**: aluminium instead of steel, pockets in pulleys and tables, a smaller screw — a solid screw's inertia grows with the fourth power of its diameter.
4. **Stiffen the connection**, and use notch filters and feed-forward ([[servo-tuning]]).

A ratio that is too *low* — a large motor on a tiny load — wastes money and power: most of the torque then accelerates the rotor.

**In the simulation**, a motor drives a disc through a reduction. The first graph is the motor torque the move needs against the gear ratio: a curve with its minimum at $i = \\sqrt{J_L/J_m}$, rising to the left because the load is felt in full, to the right because the rotor must spin ever faster. The second graph is a velocity step with the drive tuned as well as the mechanics allow: crisp at small ratios, soft and slow at large ones, where the achievable bandwidth collapses — and lower still with a belt. Push the ratio too far and the motor's top speed runs out.

> [!key] Keep the reflected load within about 10 times the rotor inertia for fast, stiff axes (less for very dynamic ones, more with very stiff mechanics); reach it with a reduction, a heavier rotor or a lighter load.
`,
  ideas: [
    'Inertia ratio = reflected load inertia ÷ rotor inertia; a reduction i divides the load\'s inertia by i².',
    'For a given load acceleration the motor torque is least at i = √(J_L/J_m), where the ratio is 1.',
    'High ratios lower the achievable bandwidth and make the axis ring on its coupling or belt.',
    'Typical targets: 1–3 for very dynamic axes, up to about 10 for most, 30 and more only with stiff mechanics and slow moves.',
    'Remedies: a reduction, a medium-inertia motor, a lighter load, a stiffer connection.'
  ],
  pitfalls: [
    'The inertia ratio must be exactly 1 : 1 — 1 : 1 minimises torque for a given load acceleration, but ratios of 3–10 are normal and fine; what matters is the stiffness of the connection and the response needed.',
    'A bigger motor always makes the axis better — A much bigger rotor lowers the ratio but spends most of its torque accelerating itself, and costs more.',
    'Only the table or disc counts as load inertia — Screws, couplings, pulleys and gearbox input stages add their own; a steel ball screw can reflect as much inertia as the table on it.'
  ],
  formulas: [
    {
      name: 'Inertia ratio',
      expr: 'RJ = JL/(i^2*Jm)', tex: 'R_J = \\dfrac{J_L}{i^2\\,J_m}',
      vars: {
        RJ: { name: 'inertia ratio (load at the motor ÷ rotor)', tex: 'R_J' },
        JL: { name: 'load inertia (at the load)', q: 'inertia', unit: 'kg·cm²', value: 60, tex: 'J_L' },
        i: { name: 'reduction ratio', value: 2, min: 0.05, max: 200 },
        Jm: { name: 'rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 1.3, tex: 'J_m' }
      },
      stories: { RJ: 'A load of {JL} is driven through a {i}:1 reduction by a motor of {Jm}. What is the inertia ratio?', i: 'A load of {JL} on a motor of {Jm} should give an inertia ratio of {RJ}. What reduction is needed?' }
    },
    {
      name: 'Motor torque for a load acceleration',
      expr: 'T = (Jm*i + JL/i)*aL', tex: 'T = \\left(J_m\\,i + \\dfrac{J_L}{i}\\right)\\alpha_L',
      vars: {
        T: { name: 'motor torque (friction and efficiency neglected)', q: 'torque', unit: 'N·m' },
        Jm: { name: 'rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 1.3, tex: 'J_m' },
        i: { name: 'reduction ratio', value: 3, min: 0.1, max: 100 },
        JL: { name: 'load inertia', q: 'inertia', unit: 'kg·cm²', value: 60, tex: 'J_L' },
        aL: { name: 'angular acceleration of the load', q: 'angacc', unit: 'rad/s²', value: 500, tex: '\\alpha_L' }
      },
      note: 'Two reductions give the same torque (one either side of the optimum); the calculator finds both.',
      stories: { T: 'A motor of {Jm} drives a load of {JL} through a {i}:1 reduction. What torque does it need to accelerate the load at {aL}?', i: 'A motor of {Jm} can spare {T} to accelerate a load of {JL} at {aL}. Which reductions will do?' }
    },
    {
      name: 'Optimum reduction',
      expr: 'i = sqrt(JL/Jm)', tex: 'i_{opt} = \\sqrt{\\dfrac{J_L}{J_m}}',
      vars: {
        i: { name: 'reduction for least accelerating torque', tex: 'i_{opt}' },
        JL: { name: 'load inertia', q: 'inertia', unit: 'kg·cm²', value: 60, tex: 'J_L' },
        Jm: { name: 'rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 1.3, tex: 'J_m' }
      },
      note: 'At this ratio the reflected load equals the rotor (ratio 1 : 1). The torque curve is flat near its minimum, so a standard ratio nearby does almost as well.',
      stories: { i: 'A load of {JL} is to be driven by a motor of {Jm}. Which reduction needs the least torque to accelerate it?' }
    },
    {
      name: 'Inertia of a load on a screw',
      expr: 'J = m*(p/(2*pi))^2', tex: 'J = m\\left(\\dfrac{p}{2\\pi}\\right)^2',
      vars: {
        J: { name: 'inertia of the moving mass at the screw', q: 'inertia', unit: 'kg·cm²' },
        m: { name: 'moving mass (table and workpiece)', q: 'mass', unit: 'kg', value: 50 },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'Add the screw\'s own inertia (a solid steel screw: π ρ L d⁴/32), the coupling and the motor pulley.',
      stories: { J: 'A {m} table rides on a screw of {p} lead. What inertia does the motor feel from it?' }
    }
  ],
  examples: [
    {
      title: 'A rotary table with and without a gearbox',
      q: 'A rotary table of 60 kg·cm² must reach 300 rpm in 0.1 s. The motor is a 750 W low-inertia servo ($J_m$ = 1.3 kg·cm²). Compare direct drive with a 5 : 1 gearbox (ignore friction and efficiency).',
      steps: [
        'Load acceleration: $\\alpha_L = 31.4/0.1 = 314$ rad/s².',
        'Direct: ratio $60/1.3 = 46$; torque $(1.3 + 60) \\times 10^{-4} \\times 314 = 1.93$ N·m.',
        '5 : 1: ratio $60/(25 \\times 1.3) = 1.8$; torque $(1.3 \\times 5 + 60/5) \\times 10^{-4} \\times 314 = 0.58$ N·m; motor speed 1500 rpm.',
        'The optimum, $i = \\sqrt{60/1.3} = 6.8$, would need $2\\sqrt{1.3 \\times 60} \\times 10^{-4} \\times 314 = 0.55$ N·m — hardly less than at 5 : 1.'
      ],
      a: 'Direct: 1.93 N·m at a ratio of 46 (hard to tune); with 5 : 1: 0.58 N·m at a ratio of 1.8.'
    },
    {
      title: 'A ball-screw axis',
      q: 'A 50 kg table on a 10 mm-lead steel screw of 20 mm diameter and 800 mm length, with a 0.2 kg·cm² coupling. What is the inertia ratio with a 400 W motor ($J_m$ = 0.37 kg·cm²) and with a 750 W motor ($J_m$ = 1.3 kg·cm²)?',
      steps: [
        'Table: $50 \\times (0.01/2\\pi)^2 = 1.27 \\times 10^{-4}$ kg·m² = 1.27 kg·cm².',
        'Screw: $\\pi \\times 7850 \\times 0.8 \\times 0.02^4/32 = 0.99 \\times 10^{-4}$ kg·m² = 0.99 kg·cm² — nearly as much as the table.',
        'Total $1.27 + 0.99 + 0.2 = 2.46$ kg·cm²: ratio 6.6 with the 400 W motor, 1.9 with the 750 W motor.'
      ],
      a: 'About 6.6 and 1.9; the screw itself is almost half the load.'
    }
  ],
  quiz: [
    { q: 'A 4 : 1 gearbox is put between a motor and its load. The load inertia the motor feels is divided by…', choices: ['16', '4', '2', '8'], a: 0, why: 'Reflected inertia falls with the square of the ratio: the load turns four times slower, so its kinetic energy at a given motor speed is 16 times smaller.' },
    { q: 'For a given load acceleration, which reduction needs the least motor torque?', choices: ['√(J_L/J_m)', 'J_L/J_m', '1', 'As high as possible'], a: 0, why: 'T = (J_m i + J_L/i) α_L is least where J_m = J_L/i², i.e. i = √(J_L/J_m).' },
    { q: 'What usually happens when a servo axis runs at a very high inertia ratio with a belt?', choices: ['The loop must be slowed down, and the load rings on the belt after moves', 'The motor overheats at standstill', 'The encoder resolution falls', 'Nothing, if the drive is modern'], a: 0, why: 'The load swings on the belt\'s compliance at a low anti-resonance the motor hardly sees; stability forces lower gains.' },
    { q: 'A servo axis only works if the inertia ratio is exactly 1 : 1.', a: false, why: '1 : 1 minimises accelerating torque; ratios up to about 10 are normal, and higher ones work with stiff mechanics and gentle moves.' },
    { q: 'A load of 40 kg·cm² and a motor of 2.5 kg·cm²: what is the optimum reduction?', answer: 4, why: '√(40/2.5) = √16 = 4.' }
  ],
  problems: [
    { q: 'A load of 90 kg·cm² is driven through a 3 : 1 belt by a motor of 2 kg·cm². What is the inertia ratio?', answer: 5, tol: 0.01, steps: ['Reflected load: $90/9 = 10$ kg·cm².', 'Ratio: $10/2 = 5$.'] },
    { q: 'A 20 kg carriage rides on a screw of 20 mm lead. What inertia does it present at the screw?', answer: 2.03, unit: 'kg·cm²', tol: 0.02, steps: ['$(0.02/2\\pi)^2 = 1.013 \\times 10^{-5}$ m².', '$20 \\times 1.013 \\times 10^{-5} = 2.03 \\times 10^{-4}$ kg·m² = 2.03 kg·cm².'] }
  ],
  choose: {
    good: [
      'A gearbox or belt reduction to bring a heavy load within about 10 times the rotor inertia.',
      'Medium-inertia motors for heavy direct-driven tables, rolls and rotary indexers.',
      'Low-inertia motors for light, fast axes where the reflected load is small.'
    ],
    avoid: [
      'Ratios above about 30 : 1 on dynamic axes with belts or long shafts.',
      'Oversizing the motor only to lower the ratio: it wastes torque and money.',
      'Gearboxes with large backlash on precise positioning axes.'
    ],
    check: [
      'Every inertia in the drivetrain: table, workpiece, screw, coupling, pulleys, gearbox.',
      'The motor speed after the reduction, against its maximum.',
      'The stiffness of couplings and belts, and the resulting resonance.',
      'How much the load inertia changes in service.'
    ]
  },
  applications: [
    'Rotary index tables: a planetary gearbox of 5–10 : 1 between a low-inertia motor and a heavy table.',
    'Robot joints: strain-wave or cycloidal reducers of 50–160 : 1 make even large arms small loads for small motors.',
    'Roll feeders and winders: medium-inertia motors, because the roll\'s inertia changes as it unwinds.'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — motor and drive selection, and the optimum gear ratio for accelerating an inertia.',
    'Younkin, *Industrial Servo Control Systems: Fundamentals and Applications* — load inertia, compliance and servo performance.',
    'Ellis, *Control System Design Guide* — two-mass systems, inertia ratio and resonance.'
  ],
  sim: ['sv-inertia', 'sv-ac-envelope']
},

{
  id: 'following-error', parent: 'servo-tuning-topic', title: 'Following error, overloads and faults', level: 2,
  short: 'While a servo axis moves, its actual position lags the command: the following error, about speed divided by the position gain. Feed-forward removes most of it. A limit on the error turns it into a jam and crash detector; an I²t overload guards the motor\'s heat; and the drive\'s alarms point to the cause.',
  keywords: ['following error', 'position deviation', 'lag', 'Kv factor', 'position loop gain', 'feed-forward', 'contour error', 'excess position deviation', 'following error limit', 'overload', 'I²t', 'alarm', 'jam', 'collision', 'fault finding'],
  prereq: ['pid-control', 'servo-drives', 'motion-profiles'],
  related: ['servo-tuning', 'command-interfaces', 'closed-loop-steppers', 'motor-heating', 'motors-machine-tools', 'lead-ball-screws', 'servo-brakes'],
  body: `
While an axis moves, its actual position lags behind the commanded one. The difference is the **following error** (position deviation, lag). It is not a fault but a property of feedback: a proportional position loop only asks for speed when there is an error, so at a constant speed $v$ it needs an error

$$e = \\frac{v}{K_{pp}}$$

— speed [[?proportional|proportional]] to error, with the position-loop gain $K_{pp}$ in s⁻¹. Machine-tool builders call $K_{pp}$ the **Kv factor** and quote it in (m/min)/mm, where 1 (m/min)/mm = 16.7 s⁻¹. At 10 m/min and a Kv of 2 (m/min)/mm the axis runs 5 mm behind its command.

### Removing most of it: feed-forward
If the controller adds the planned speed to the loop's output (**velocity feed-forward**), the loop no longer needs an error to keep moving: with 100 % feed-forward the constant-speed error vanishes and only the acceleration phases leave an error, which **acceleration feed-forward** (the torque $J\\alpha$) shrinks further. Too much feed-forward overshoots; 60–100 % is typical, less on soft mechanics.

### Why following error matters
- **Contouring.** Two axes drawing a circle both lag; with equal gains the circle keeps its shape but shrinks by $\\Delta r \\approx v^2/(2 r K_{pp}^2)$, and unequal gains distort it into an ellipse. Interpolating axes are therefore tuned to the same Kv.
- **Synchronisation.** A flying saw, an electronic cam or gear must follow a master exactly; lag becomes a position error in the product.
- **Protection.** The drive compares the error with a **limit** (excess position deviation), typically a few times the largest normal error. A collision, a jam, a broken belt, a torque limit reached, a brake not released or a wrong electronic gear all make the error run away, and the axis stops with an alarm before it does more damage. [[closed-loop-steppers|Closed-loop steppers]] use the same idea.

### Overloads
A servo motor can give about three times its rated torque, but only briefly: the drive integrates $I^2 t$ as a model of the winding's heating and trips on **overload** before the insulation suffers. Starting cold, a typical characteristic allows roughly 3 × rated current for several seconds, 2 × for tens of seconds and the rated current for ever. A jam at the torque limit therefore ends in a following-error alarm or an overload alarm — whichever limit comes first.

| Symptom or alarm | Usual causes | What to check |
|---|---|---|
| Deviation alarm during acceleration | acceleration beyond the torque available; torque limit too low; gains too low | peak torque of the move; torque-limit parameters; feed-forward |
| Deviation alarm at standstill or at enable | brake not released; axis blocked; encoder or wiring fault | brake voltage and timing; mechanics; encoder cable |
| Error slowly growing in service | rising friction: dry guides, failing bearing, a clamped axis | lubrication; the torque trend |
| Overload after minutes | RMS torque above rated; hot cabinet; oscillation | the duty cycle, cooling, tuning |
| Runaway or overspeed at enable | wrong motor phase order, encoder, direction or electronic gear | wiring and parameters |

**In the simulation**, a ball-screw axis runs back and forth. Watch the error grow with speed and shrink as $K_{pp}$ rises, then remove most of it with feed-forward. Press *Jam* to block the table: the torque saturates, the error climbs to the limit and the drive stops. Raise the limit and the overload alarm trips instead.

> [!warn] The following-error limit protects the machine, not people. Set it tight enough to catch a crash quickly and loose enough not to trip on normal moves; personnel protection comes from guards, the emergency stop and the drive's safety functions.

> [!key] Following error ≈ speed ÷ position gain. Feed-forward removes most of it; the error limit turns it into a crash detector; the I²t overload guards the motor's heat.
`,
  ideas: [
    'A proportional position loop needs an error to move: e = v/Kpp at constant speed.',
    'Velocity and acceleration feed-forward remove most of the following error without raising the gains.',
    'Equal gains on interpolating axes keep contours in shape; a circle still shrinks by about v²/(2rKpp²).',
    'An excess-deviation limit turns the following error into a jam and crash detector.',
    'The I²t overload lets the motor give about three times its rated torque briefly, then trips before it overheats.'
  ],
  pitfalls: [
    'Following error means the drive is badly tuned — Every proportional loop has it; its size is predictable (v/Kpp) and feed-forward removes most of it.',
    'The larger the error limit, the fewer the problems — A loose limit lets a crash push on at full torque for longer; set it a few times above the largest normal error.',
    'An overload alarm means the motor is too small — It may be a brake not released, rising friction, a jam or an oscillating loop; look at the torque trace before changing the motor.'
  ],
  formulas: [
    {
      name: 'Following error at constant speed',
      expr: 'err = (1 - F)*w/Kpp', tex: 'e = (1 - F)\\,\\dfrac{\\omega}{K_{pp}}',
      vars: {
        err: { name: 'following error', q: 'angle', unit: 'rev', tex: 'e' },
        F: { name: 'velocity feed-forward', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        w: { name: 'motor speed', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' },
        Kpp: { name: 'position-loop gain', q: 'rate', unit: '1/s', value: 50, tex: 'K_{pp}' }
      },
      note: 'Constant speed only; during acceleration the error is larger unless acceleration feed-forward is used.',
      stories: { err: 'A servo runs at {w} with a position gain of {Kpp} and {F} feed-forward. How far behind the command is it?', Kpp: 'An axis at {w} with {F} feed-forward may lag at most {err}. What position gain does it need?' }
    },
    {
      name: 'Following error of a machine-tool axis',
      expr: 'e1 = v/Kv', tex: 'e = \\dfrac{v}{K_v}',
      vars: {
        e1: { name: 'following error', q: false, unit: 'mm', tex: 'e' },
        v: { name: 'feed rate', q: false, unit: 'm/min', value: 10 },
        Kv: { name: 'Kv factor', q: false, unit: '(m/min)/mm', value: 2, tex: 'K_v' }
      },
      note: 'Without feed-forward. 1 (m/min)/mm = 16.7 s⁻¹.',
      stories: { e1: 'A CNC axis with a Kv factor of {Kv} traverses at {v}. How far does it lag?' }
    },
    {
      name: 'Radius error on a circle',
      expr: 'dr = v^2/(2*r*K^2)', tex: '\\Delta r \\approx \\dfrac{v^2}{2\\,r\\,K_{pp}^2}',
      vars: {
        dr: { name: 'radius reduction', q: 'length', unit: 'mm', tex: '\\Delta r' },
        v: { name: 'path speed', q: 'speed', unit: 'mm/s', value: 33.3 },
        r: { name: 'circle radius', q: 'length', unit: 'mm', value: 20 },
        K: { name: 'position-loop gain of both axes', q: 'rate', unit: '1/s', value: 33.3, tex: 'K_{pp}' }
      },
      note: 'Proportional position loops without feed-forward, equal gains on both axes.',
      stories: { dr: 'Two axes with a gain of {K} cut a circle of radius {r} at {v}. How much too small does it come out?', K: 'A circle of {r} at {v} must lose no more than {dr} of radius. What gain do the axes need?' }
    },
    {
      name: 'Time to an overload trip',
      expr: 't = tau*ln(k^2/(k^2 - 1))', tex: 't = \\tau\\,\\ln\\dfrac{k^2}{k^2 - 1}',
      vars: {
        t: { name: 'time to trip, starting cold', q: 'time', unit: 's' },
        tau: { name: 'thermal time constant of the overload model', q: 'time', unit: 's', value: 60, tex: '\\tau' },
        k: { name: 'current as a multiple of rated', value: 3, min: 1.001, max: 10 }
      },
      note: 'A first-order I²t model that trips when the modelled heating reaches the rated level. Real drives use their own curves: read the manual.',
      stories: { t: 'An overload model has a time constant of {tau}. How long may a cold motor run at {k} times its rated current?' }
    }
  ],
  examples: [
    {
      title: 'A CNC axis at rapid traverse and cutting a circle',
      q: 'An axis has a Kv of 2 (m/min)/mm (33.3 s⁻¹). How far does it lag at a rapid traverse of 10 m/min, and with 90 % feed-forward? How much does a circle of 20 mm radius at 2 m/min shrink without feed-forward?',
      steps: [
        'Lag: $10/2 = 5$ mm; with 90 % feed-forward $0.1 \\times 5 = 0.5$ mm.',
        'Circle: $v = 2000/60 = 33.3$ mm/s, so $v/K_{pp} = 1$ mm and $\\Delta r \\approx 1^2/(2 \\times 20) = 0.025$ mm.',
        'Twenty-five micrometres of radius error — visible on a precision part, which is why CNCs use feed-forward and equal Kv on all axes.'
      ],
      a: '5 mm (0.5 mm with feed-forward); the circle shrinks by about 25 µm.'
    },
    {
      title: 'How long can it push?',
      q: 'A drive models overload with a 60 s thermal time constant, starting cold. How long can the motor give 3 × and 2 × its rated current?',
      steps: [
        '3 ×: $t = 60 \\ln(9/8) = 60 \\times 0.118 = 7.1$ s.',
        '2 ×: $t = 60 \\ln(4/3) = 60 \\times 0.288 = 17.3$ s.',
        'A jam at the torque limit (3 ×) is caught by the following-error limit in a fraction of a second if it is set tight; otherwise the overload trips after about 7 s.'
      ],
      a: 'About 7 s at 3 × and 17 s at 2 × (from cold).'
    }
  ],
  quiz: [
    { q: 'An axis with no feed-forward doubles its speed. Its following error at constant speed…', choices: ['doubles', 'stays the same', 'halves', 'quadruples'], a: 0, why: 'e = v/Kpp: proportional to speed.' },
    { q: 'Why are the axes of a CNC machine tuned to the same Kv factor?', choices: ['So that their lags stay proportional and contours keep their shape', 'So that they can share one drive', 'To reduce motor heating', 'Because the encoders must match'], a: 0, why: 'With equal gains a circle only shrinks slightly; with unequal gains one axis lags more than the other and the circle becomes an ellipse.' },
    { q: 'With 100 % velocity feed-forward, the following error at constant speed is…', choices: ['about zero', 'doubled', 'unchanged', 'equal to the acceleration error'], a: 0, why: 'The planned speed is supplied directly; the loop needs no error to keep moving. Errors remain during acceleration.' },
    { q: 'The following-error limit is a safety function that protects people.', a: false, why: 'It protects the machine by stopping on jams and crashes. People are protected by guards, emergency stops and certified safety functions such as STO.' },
    { q: 'A servo runs at 1500 rpm with Kpp = 25 s⁻¹ and no feed-forward. What is the following error in revolutions?', answer: 1, unit: 'rev', why: '1500 rpm = 25 rev/s; 25/25 = 1 rev.' }
  ],
  problems: [
    { q: 'A CNC axis with a Kv factor of 1.5 (m/min)/mm moves at 6 m/min without feed-forward. What is the following error?', answer: 4, unit: 'mm', tol: 0.01, steps: ['$e = v/K_v = 6/1.5 = 4$ mm.'] },
    { q: 'Two axes with a gain of 40 s⁻¹ cut a circle of 5 mm radius at 50 mm/s. By how much does the radius shrink?', answer: 0.156, unit: 'mm', tol: 0.02, steps: ['$v/K = 50/40 = 1.25$ mm.', '$\\Delta r = 1.25^2/(2 \\times 5) = 0.156$ mm.'] }
  ],
  choose: {
    good: [
      'Velocity and acceleration feed-forward on every axis that follows a planned path.',
      'A tight following-error limit as a jam and crash detector on every servo axis.',
      'Equal position gains on interpolating axes; a torque trend to spot rising friction early.'
    ],
    avoid: [
      'Raising the position gain to the edge of stability to shrink the error.',
      'Opening the error limit wide to "get rid of" nuisance alarms without finding their cause.',
      'Counting on the error limit or the overload as personnel protection.'
    ],
    check: [
      'The largest normal error, measured with the drive\'s trace, before setting the limit.',
      'Torque limits and overload settings against the motor\'s data.',
      'Brake release, lubrication and mechanical freedom when deviation alarms appear.',
      'Encoder wiring, phase order and electronic gear when an axis runs away.'
    ]
  },
  applications: [
    'CNC machining: feed-forward and matched Kv keep circles round to a few micrometres.',
    'Pick-and-place: a tight following-error limit stops the head on a collision in milliseconds.',
    'Presses and clamps: a deliberate move into a hard stop, with the torque limit reduced and the error limit widened for that move only.'
  ],
  sources: [
    'Younkin, *Industrial Servo Control Systems: Fundamentals and Applications* — velocity constant, following error and contouring.',
    'Ellis, *Control System Design Guide* — feed-forward in motion control.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance* — duty and thermal ratings behind overload limits.'
  ],
  sim: ['sv-following', 'sv-command']
},

{
  id: 'servo-brakes', parent: 'servo-tuning-topic', title: 'Holding brakes', level: 2,
  short: 'A servo motor\'s holding brake is spring-applied and released by a 24 V coil, so it holds whenever power is lost. It holds a stopped axis — above all a vertical one — while the drive is off; it is not a service brake. It must be sized for gravity with margin and sequenced with the drive so the load never drops.',
  keywords: ['holding brake', 'servo brake', 'spring-applied brake', 'power-off brake', 'fail-safe brake', 'vertical axis', 'gravity load', 'brake release delay', 'brake engage delay', 'coil suppression', 'diode', 'varistor', 'safe brake control', 'SBC', 'brake test'],
  prereq: ['ac-servo-motors', 'servo-drives', 'lead-ball-screws'],
  related: ['motor-brakes', 'emergency-stop', 'following-error', 'servo-principle', 'hydraulics:hydraulic-safety', 'pneumatics:holding-force'],
  body: `
A servo motor's **holding brake** is a spring-applied, electromagnetically released brake built into the back of the motor. With no current in its coil, springs clamp a friction disc and the shaft is held; energising the coil (24 V DC) pulls the armature plate away and frees the shaft. It is therefore **fail-safe**: a power failure, a cut cable or an emergency stop applies it. (Larger spring-applied brakes for general motors are covered in [[motor-brakes]].)

### What it is for
A holding brake holds a **stationary** axis while the drive is not holding it — at power-off, in STO, during an alarm, while the machine idles — above all on **vertical and inclined axes**, which would otherwise fall, and on axes pushed by springs or process forces. It is *not* a service brake: the drive stops the axis electrically, and the brake closes at standstill. It can stop a moving axis in an emergency or a power failure, but each such dynamic stop wears the lining, and their number and energy are limited — check the brake's data.

| Motor size | Holding torque (typical) | Coil at 24 V DC | Release / engage time | Extra length |
|---|---|---|---|---|
| 100–400 W | 0.3–1.5 N·m | 6–8 W | 20–60 ms / 10–40 ms | +25–40 mm |
| 0.75–1 kW | 2.5–5 N·m | 8–12 W | 40–80 ms / 20–60 ms | +30–50 mm |
| 2–5 kW | 10–30 N·m | 12–25 W | 60–150 ms / 30–100 ms | +40–70 mm |

The holding torque is usually at least the motor's rated torque; the brake adds some rotor inertia and weight. The engage time depends strongly on how the coil is switched off: a plain **diode** across the coil lets the current decay slowly and can double or triple it; a **varistor** or a Zener diode in series with the diode makes it fast.

### The sequence
The drive (or the controller) must choreograph the brake:
1. **Servo on**: the motor is energised and holds position.
2. **Release**: only when torque is established is the brake released; motion waits for its mechanical release time.
3. **Move and stop** under control.
4. **Brake on**: the coil is switched off.
5. **Engage delay**: the drive keeps holding until the brake has really closed, then switches the torque off.

Get step 5 wrong — torque off before the brake bites — and a vertical axis drops during the gap. **In the simulation**, a carriage hangs on a ball screw. Make the servo-off delay shorter than the brake's engage time and the carriage drops a few millimetres every time it parks; switch the suppression from varistor to diode and watch the engage time stretch; cut the power and the load falls until the brake closes.

### Sizing for a vertical axis
The gravity torque at the motor of a mass $m$ on a screw of lead $p$ is $m g p/2\\pi$ (divided by any reduction). Allow a safety factor of about 2 for dynamic effects, wear and the screw's back-driving efficiency. A free screw axis does not fall at $g$: the rotor, screw and coupling must spin up too, so it accelerates at $m g/(m + J(2\\pi/p)^2)$ — the rotating parts behave like a large extra mass. Remember also that holding a vertical load costs the motor continuous current (and heat) whenever the brake is open.

### Faults
| Symptom | Likely cause |
|---|---|
| Overload or heat on every move, smell of hot lining | brake not released: no 24 V, failed relay or fuse, too little voltage at the end of a long cable |
| Axis drops when parking | engage delay too short; slow diode suppression; worn or oily lining |
| Axis creeps down with power off | holding torque too low for the load; worn brake; load increased |
| Deviation alarm at enable | the axis moves before the brake has released |

> [!warn] A holding brake alone does not protect anyone working under a suspended load. Support or lower the load mechanically before work and lock out the energy sources. The machine's risk assessment may call for a second brake, a mechanical lock or a counterbalance, and for periodic brake tests; IEC 61800-5-2 defines safe brake control (SBC).

> [!key] A servo brake holds a stopped axis when the drive does not: spring-applied, released by 24 V. Size it for gravity with margin, sequence it with the drive, and never use it as a service brake.
`,
  ideas: [
    'A holding brake is spring-applied and released by a 24 V coil: losing power applies it.',
    'It holds stationary axes; stopping is the drive\'s job, and dynamic stops wear it.',
    'The drive must keep torque until the brake has engaged, and release it only once torque is established.',
    'Diode suppression makes the brake engage slowly; a varistor or Zener makes it fast.',
    'On a screw, the rotating parts act like a large extra mass, so a released axis falls slower than g — but it still falls.'
  ],
  pitfalls: [
    'STO or a disabled drive holds a vertical axis — Without torque the load falls; only the brake (or a mechanical support) holds it.',
    'The holding brake can be used to stop the axis in every cycle — It is designed to hold at standstill; routine dynamic stops wear the lining quickly and lengthen the stopping distance.',
    'Brake timing does not matter because the brake is fast — Engage times of 20–150 ms are long for a falling load; with diode suppression they grow further.'
  ],
  formulas: [
    {
      name: 'Brake torque for a vertical screw axis',
      expr: 'T = S*m*g*p/(2*pi)', tex: 'T_B = S\\,\\dfrac{m\\,g\\,p}{2\\pi}',
      vars: {
        T: { name: 'holding torque needed at the motor', q: 'torque', unit: 'N·m', tex: 'T_B' },
        S: { name: 'safety factor', value: 2 },
        m: { name: 'hanging mass', q: 'mass', unit: 'kg', value: 40 },
        g: { const: 'g' },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'Divide by the ratio of any reduction between motor and screw.',
      stories: { T: 'A {m} carriage hangs on a screw of {p} lead. What brake torque is needed with a safety factor of {S}?', m: 'A brake of {T} on a screw of {p} lead, with a safety factor of {S}: what mass can it hold?' }
    },
    {
      name: 'How fast a released screw axis falls',
      expr: 'a = m*g/(m + J*(2*pi/p)^2)', tex: 'a = \\dfrac{m\\,g}{m + J\\left(\\dfrac{2\\pi}{p}\\right)^2}',
      vars: {
        a: { name: 'initial acceleration of the falling load', q: 'accel', unit: 'm/s²' },
        m: { name: 'hanging mass', q: 'mass', unit: 'kg', value: 40 },
        g: { const: 'g' },
        J: { name: 'rotating inertia (rotor, screw, coupling)', q: 'inertia', unit: 'kg·cm²', value: 2.5 },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'Friction and the screw\'s back-driving efficiency make it slower still; a steep lead or a light rotor makes it close to g.',
      stories: { a: 'A {m} load on a {p}-lead screw with {J} of rotating inertia loses its holding torque. How fast does it start to fall?' }
    },
    {
      name: 'Drop during a timing gap',
      expr: 'd = a*t^2/2', tex: 'd = \\tfrac{1}{2}\\,a\\,t^2',
      vars: {
        d: { name: 'drop', q: 'length', unit: 'mm' },
        a: { name: 'acceleration of the falling load', q: 'accel', unit: 'm/s²', value: 2.83 },
        t: { name: 'time without torque or brake', q: 'time', unit: 'ms', value: 50 }
      },
      stories: { d: 'A load falls at {a} for {t} before the brake closes. How far does it drop?', t: 'A load falling at {a} may drop no more than {d}. How long may the gap be?' }
    },
    {
      name: 'Brake coil power',
      expr: 'P = V^2/R', tex: 'P = \\dfrac{V^2}{R}',
      vars: {
        P: { name: 'coil power', q: 'power', unit: 'W' },
        V: { name: 'coil voltage', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 72 }
      },
      note: 'The 24 V supply must deliver the current of every brake released at once; check the voltage at the motor (typically 24 V ±10 %).',
      stories: { P: 'A brake coil of {R} is fed {V}. How much power does it take?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the brake for a Z axis',
      q: 'A 40 kg carriage hangs on a 10 mm-lead ball screw driven directly. What brake torque is needed with a safety factor of 2, and which motor\'s brake will do: a 400 W motor (brake 1.3 N·m) or a 750 W motor (2.5 N·m)?',
      steps: [
        'Gravity torque: $40 \\times 9.81 \\times 0.01/2\\pi = 0.62$ N·m.',
        'With a factor of 2: $T_B = 1.25$ N·m.',
        'The 400 W brake (1.3 N·m) is marginal; the 750 W motor\'s 2.5 N·m brake has margin. The motor itself must also hold 0.62 N·m continuously whenever the brake is open — half the 400 W motor\'s rated torque.'
      ],
      a: 'About 1.25 N·m: choose the 2.5 N·m brake.'
    },
    {
      title: 'The price of a 50 ms gap',
      q: 'The same axis has 2.5 kg·cm² of rotating inertia (rotor, screw, coupling). The drive switches its torque off 50 ms before the brake engages. How far does the carriage drop?',
      steps: [
        'Rotating parts as an equivalent mass: $J(2\\pi/p)^2 = 2.5 \\times 10^{-4} \\times 628.3^2 = 98.7$ kg.',
        '$a = 40 \\times 9.81/(40 + 98.7) = 2.83$ m/s².',
        '$d = \\tfrac{1}{2} \\times 2.83 \\times 0.05^2 = 3.5$ mm — and the carriage hits the closing brake at 0.14 m/s. In true free fall it would be 12 mm.'
      ],
      a: 'About 3.5 mm per parking — enough to crash a tool or a gripper.'
    }
  ],
  quiz: [
    { q: 'With no current in its coil, a servo holding brake is…', choices: ['engaged: springs clamp the shaft', 'released', 'half engaged', 'released until the drive commands it'], a: 0, why: 'It is spring-applied and released by the coil, so any loss of power applies it — the fail-safe arrangement.' },
    { q: 'Should the holding brake stop the axis at the end of every move?', choices: ['No: the drive stops the axis; the brake engages only at standstill', 'Yes: it saves the drive work', 'Only on horizontal axes', 'Only at low speed'], a: 0, why: 'Holding brakes are designed for holding; dynamic stops are for emergencies and wear the lining.' },
    { q: 'Replacing the varistor across a brake coil by a plain diode makes the brake…', choices: ['engage more slowly', 'engage faster', 'hold more torque', 'release more slowly'], a: 0, why: 'A diode lets the coil current circulate and decay slowly, so the armature is released later; a varistor or Zener absorbs the energy quickly.' },
    { q: 'Safe torque off (STO) holds a vertical axis in place.', a: false, why: 'STO removes torque: a vertical load falls unless a brake or a mechanical support holds it.' },
    { q: 'A 30 kg load hangs on a 5 mm-lead screw. What brake torque (N·m) is needed with a safety factor of 2?', answer: 0.468, unit: 'N·m', why: '2 × 30 × 9.81 × 0.005/2π = 0.468 N·m.' }
  ],
  problems: [
    { q: 'A 60 kg carriage hangs on a 20 mm-lead screw. What brake torque is needed with a safety factor of 2?', answer: 3.75, unit: 'N·m', tol: 0.02, steps: ['$60 \\times 9.81 \\times 0.02/2\\pi = 1.87$ N·m.', '$\\times 2 = 3.75$ N·m.'] },
    { q: 'A released load accelerates at 2 m/s² for 80 ms before the brake closes. How far does it drop?', answer: 6.4, unit: 'mm', tol: 0.01, steps: ['$d = \\tfrac{1}{2} \\times 2 \\times 0.08^2 = 0.0064$ m = 6.4 mm.'] }
  ],
  choose: {
    good: [
      'Vertical and inclined axes, and axes pushed by springs or process forces.',
      'Holding position through power-off, STO and alarms without drive current.',
      'Robot joints, lifting tables and Z axes of gantries and machine tools.'
    ],
    avoid: [
      'Using it as a service brake in every cycle.',
      'Fitting one where nothing can move the stopped axis: it adds cost, length, inertia and a failure mode.',
      'Relying on it alone to protect people under a suspended load.'
    ],
    check: [
      'Holding torque against the gravity torque with a factor of about 2, through any reduction.',
      'Release and engage times, coil suppression, and the drive\'s brake delay parameters.',
      'The 24 V supply: current for all brakes at once and voltage at the motor.',
      'Permitted emergency stops (number and energy) and a periodic brake test.'
    ]
  },
  applications: [
    'Z axes of gantries and machine tools: a 24 V brake in the motor, sequenced by the drive\'s brake output.',
    'Industrial robots: a brake on every joint so that the arm stays put at power-off, with a manual release for rescue.',
    'Lifting tables and vertical storage: a motor brake plus a second, independent brake or mechanical lock where people can be underneath.'
  ],
  sources: [
    'IEC 61800-5-2, *Adjustable speed electrical power drive systems — Safety requirements — Functional* — safe brake control (SBC) and STO.',
    'ISO 13849-1, *Safety of machinery — Safety-related parts of control systems* — design of safety functions such as holding a load.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines* — stop categories and the behaviour of brakes on loss of supply.'
  ],
  sim: ['sv-brake', 'sv-drive-bus']
}

);
