/* HYPER-MOTORS · content/mechanics.js — Mechanics: loads, gears and motion.
 *   transmission:  gearboxes, belts-pulleys, lead-ball-screws, rack-pinion-linear, couplings-alignment, bearings-motors
 *   motion-sizing: load-torque-types, inertia-reflected, motion-profiles, rms-torque-sizing, motor-selection-method
 * Simulations in sims/mechanics.js (ids mx-…). */
Hyper.add(

{
  id: 'gearboxes', parent: 'transmission', title: 'Gearboxes', level: 2,
  short: 'A gearbox trades speed for torque: with a ratio i the output turns i times slower and gives i times the torque, less its losses. Spur, helical, planetary, bevel, worm, cycloidal and strain-wave gearboxes differ in ratio per stage, efficiency, backlash, noise, stiffness and price — and a self-locking worm is never a brake.',
  keywords: ['gearbox', 'gear ratio', 'reducer', 'gearmotor', 'spur gear', 'helical gear', 'planetary gearbox', 'worm gear', 'bevel gear', 'cycloidal drive', 'strain-wave gear', 'harmonic drive', 'backlash', 'arcmin', 'self-locking', 'service factor', 'efficiency', 'mesh frequency', 'gear whine'],
  prereq: ['torque-and-power', 'efficiency-losses', 'physics:torque'],
  related: ['dc-gearmotors', 'inertia-reflected', 'motor-brakes', 'belts-pulleys', 'couplings-alignment', 'motor-noise', 'servo-tuning', 'physics:efficiency'],
  body: `
Motors like to run fast: a 4-pole induction motor turns at about 1450 rpm, a servo at 3000 rpm, a small DC motor at several thousand. Most loads want to turn slowly with a lot of torque — a conveyor drum at 40 rpm, a mixer at 60 rpm, a robot joint at 20 rpm. A gearbox makes the trade. With a ratio $i$ the output turns $i$ times slower and, apart from its losses, gives $i$ times the torque:

$$n_2 = \\frac{n_1}{i}, \\qquad T_2 = T_1\\, i\\, \\eta$$

The efficiency $\\eta$ says how much of the power arrives as torque; the rest heats the oil. A small fast motor with a gearbox is usually lighter and cheaper than a big slow motor — and the ratio also divides the load's inertia by $i^2$ ([[inertia-reflected]]).

### The families
| Type | Ratio per stage | Efficiency (typical) | Backlash (typical) | Strong points | Weak points |
|---|---|---|---|---|---|
| Spur (parallel shafts) | 1–6 | 97–99 % per stage | 10–30 arcmin | simple, cheap | noisy at speed |
| Helical | 1–8 | 96–98 % per stage | 5–20 arcmin | quiet, strong; the usual industrial gearmotor | axial thrust on the bearings |
| Planetary | 3–10 | 95–98 % per stage | 1–5 arcmin (servo grade), 10–30 standard | compact, coaxial, high torque for its size | more parts, price |
| Bevel (spiral) | 1–5 | 95–98 % | 5–15 arcmin | right angle, efficient | needs careful setting of the mesh |
| Worm | 5–100 | 40–90 %, falling with ratio | 10–30 arcmin, growing with wear | quiet, right angle, a high ratio in one stage | hot and inefficient at high ratios; wears |
| Cycloidal | 10–120 | 80–93 % | under 1 arcmin | stiff, tolerates shock loads | price; the eccentric needs balancing |
| Strain-wave | 30–160 | 60–85 % | about 0 (lost motion ≈ 1 arcmin) | no backlash, small, light, huge ratio | torsionally soft, efficiency falls when cold and at light load |

Industrial gearmotors stack two or three helical stages for ratios up to a few hundred, or put a bevel or worm stage in front for a right-angle output. Servo axes use precision planetaries; robot joints use strain-wave and cycloidal reducers.

### Reading a gearbox rating
- **Rated output torque**: carried continuously for the rated life under a uniform load. The **acceleration** torque is typically 1.5–2 × higher, and an **emergency-stop** torque, allowed a limited number of times, higher still.
- **Efficiency** is quoted warm and at rated load; it drops at light load (oil churning is a fixed loss) and in the cold.
- **Backlash**: the free play at the output with the input held, in arcmin (1′ = 1/60°). On a 200 mm arm, 10′ is 0.58 mm at the tip. **Torsional stiffness** (N·m/arcmin) says how far the output winds up under load — it sets the resonance of a servo axis.
- **Thermal rating**: many worm and bevel boxes in continuous duty are limited by heat, not by the strength of their teeth.

### Service factor
Catalogue ratings assume a uniform load, about 8–10 hours a day and few starts. For harsher duty choose the gearbox for the load torque times a **service factor**, $T_{\\mathrm{G}} \\ge T_L\\,\\mathrm{SF}$: typically about 1.0 for a uniform load, 1.25–1.5 for moderate shock or round-the-clock running, 1.75–2 or more for heavy shock (crushers, reversing under load), more for many starts per hour. Use the table of the maker whose gearbox you buy.

### Self-locking is not a brake
A worm is a screw: its efficiency depends on its lead angle $\\lambda$ and the friction angle $\\varphi = \\arctan\\mu$ ([[?inverse-trig|arctangent]]):

$$\\eta = \\frac{\\tan\\lambda}{\\tan(\\lambda + \\varphi)}$$

Driven backwards, from the wheel, the efficiency is $\\tan(\\lambda - \\varphi)/\\tan\\lambda$, which reaches zero when $\\lambda \\le \\varphi$: the load cannot turn the worm. A single-start worm at 40:1 has $\\lambda \\approx 4$–5° and is usually self-locking at rest, but friction falls while running and under vibration, so it can creep or run down.

> [!warn] Never trust a self-locking worm gear to hold a suspended or overhauling load (a hoist, a lift, a vertical axis, a gate). Fit a rated spring-applied brake ([[motor-brakes]]) designed to the machine's safety requirements, and lower or support the load before working on the drive.

### Heat, noise and wear
- **Heat** is $(1 - \\eta)P$: a 0.75 kW motor through a 30:1 worm at 72 % puts 210 W into a small housing; a helical-bevel box at 95 % only 37 W. Mineral oil is usually kept below about 80–90 °C; synthetic oils run hotter and last longer.
- **Noise**: the teeth meet at the **mesh frequency** $z\\,n$ — a 20-tooth pinion at 1500 rpm whines at 500 Hz. Helical and ground gears are quieter than spur gears; a worm is quietest. Rising noise means wear, pitting, a failing bearing or low oil (see [[motor-noise]]).
- **Oil** level depends on the mounting position: a box filled for one position and mounted in another runs its top bearings dry or churns and overheats.
- **Backlash grows** with wear, and loads that reverse hammer the teeth.

In the simulation, pick each type and slide the ratio: watch the efficiency, the heat and the backlash; choose the worm and raise the ratio until it becomes self-locking.

> [!key] Choose a gearbox for its ratio, then check torque × service factor, efficiency and heat, backlash and stiffness, noise and life. A self-locking worm is a feature, not a safety brake.
`,
  ideas: [
    'A ratio i divides the speed by i and multiplies the torque by i·η; power passes through, less the losses.',
    'Spur and helical stages are efficient (97–99 %); worm gears lose far more, and more at high ratios.',
    'Backlash (arcmin) is play at the output; precision planetary, cycloidal and strain-wave reducers keep it near zero.',
    'Choose the gearbox for the load torque times a service factor that covers shock, hours per day and starts.',
    'A statically self-locking worm can still creep under vibration: holding a load needs a brake.'
  ],
  pitfalls: [
    'A gearbox multiplies power — It multiplies torque and divides speed; the power out is the power in times the efficiency.',
    'A self-locking worm gearbox makes a brake unnecessary — Friction falls when the gear runs or vibrates; a load that must be held needs a rated brake.',
    'The catalogue torque is what the gearbox can take in my machine — It holds for a uniform load and a stated duty; shock, long hours and frequent starts need a service factor.'
  ],
  formulas: [
    {
      name: 'Output speed of a gearbox',
      expr: 'n2 = n1/i', tex: 'n_2 = \\dfrac{n_1}{i}',
      vars: {
        n2: { name: 'output speed', q: 'angvel', unit: 'rpm', tex: 'n_2' },
        n1: { name: 'input (motor) speed', q: 'angvel', unit: 'rpm', value: 1400, tex: 'n_1' },
        i: { name: 'gear ratio', value: 30 }
      },
      stories: { n2: 'A motor at {n1} drives a gearbox of ratio {i}. How fast does the output turn?', i: 'A {n1} motor must turn a drum at {n2}. What ratio is needed?' }
    },
    {
      name: 'Output torque of a gearbox',
      expr: 'T2 = T1*i*eta', tex: 'T_2 = T_1\\, i\\, \\eta',
      vars: {
        T2: { name: 'output torque', q: 'torque', unit: 'N·m', tex: 'T_2' },
        T1: { name: 'input (motor) torque', q: 'torque', unit: 'N·m', value: 5.12, tex: 'T_1' },
        i: { name: 'gear ratio', value: 30 },
        eta: { name: 'gearbox efficiency', q: 'ratio', unit: '%', value: 72, tex: '\\eta' }
      },
      note: 'Efficiency at the operating load; a worm gear\'s is lower when starting from rest.',
      stories: { T2: 'A motor gives {T1} into a gearbox of ratio {i} and efficiency {eta}. What torque comes out?', T1: 'The load needs {T2} after a gearbox of ratio {i} and efficiency {eta}. What must the motor give?' }
    },
    {
      name: 'Efficiency of a worm (or any screw) drive',
      expr: 'eta = tan(lam)/tan(lam + atan(mu))', tex: '\\eta = \\dfrac{\\tan\\lambda}{\\tan(\\lambda + \\arctan\\mu)}',
      vars: {
        eta: { name: 'efficiency, worm driving', q: 'ratio', unit: '%', tex: '\\eta' },
        lam: { name: 'lead angle of the worm', q: 'angle', unit: '°', value: 5, min: 0.5, max: 45, tex: '\\lambda' },
        mu: { name: 'coefficient of friction', value: 0.05, min: 0.001, max: 0.5, tex: '\\mu' }
      },
      note: 'Driven backwards the efficiency is tan(λ − φ)/tan λ with φ = arctan μ: zero or less (self-locking) when λ ≤ φ.',
      stories: { eta: 'A worm has a lead angle of {lam} and runs with μ = {mu}. How efficient is it?', lam: 'What lead angle gives an efficiency of {eta} with μ = {mu}?' }
    },
    {
      name: 'Gearbox rating with a service factor',
      expr: 'TG = TL*SF', tex: 'T_{\\mathrm{G}} = T_L\\,\\mathrm{SF}',
      vars: {
        TG: { name: 'required gearbox rated torque', q: 'torque', unit: 'N·m', tex: 'T_{\\mathrm{G}}' },
        TL: { name: 'load torque at the output', q: 'torque', unit: 'N·m', value: 300, tex: 'T_L' },
        SF: { name: 'service factor', value: 1.4, min: 0.8, max: 3, tex: '\\mathrm{SF}' }
      },
      stories: { TG: 'A conveyor needs {TL} at the gearbox output, with a service factor of {SF}. What rated torque must the gearbox have?' }
    },
    {
      name: 'Lost motion from backlash',
      expr: 'x = r*theta', tex: 'x = r\\,\\theta_b',
      vars: {
        x: { name: 'play at the load', q: 'length', unit: 'mm' },
        r: { name: 'radius of the arm or pinion', q: 'length', unit: 'mm', value: 200 },
        theta: { name: 'backlash at the output', q: 'angle', unit: '′', value: 10, tex: '\\theta_b' }
      },
      stories: { x: 'A gearbox with {theta} of backlash turns an arm {r} long. How much can the tip move freely?', theta: 'The tip of a {r} arm may not move more than {x}. What backlash is acceptable?' }
    }
  ],
  examples: [
    {
      title: 'Worm or helical-bevel?',
      q: 'A 0.75 kW, 1400 rpm motor needs a right-angle 30:1 reduction. Compare a worm gearbox (η = 72 %) with a helical-bevel gearbox (η = 95 %).',
      steps: [
        'Motor torque: $T_1 = P/\\omega = 750/(1400 \\times 2\\pi/60) = 5.12$ N·m. Output speed $1400/30 = 46.7$ rpm for both.',
        'Worm: $T_2 = 5.12 \\times 30 \\times 0.72 = 110$ N·m; heat $0.28 \\times 750 = 210$ W.',
        'Helical-bevel: $T_2 = 5.12 \\times 30 \\times 0.95 = 146$ N·m; heat $0.05 \\times 750 = 37.5$ W.',
        'For the same output torque the helical-bevel drive could use a smaller motor, and over years of running it saves the difference in energy; the worm is cheaper, quieter and may be statically self-locking.'
      ],
      a: 'Worm: 110 N·m and 210 W of heat; helical-bevel: 146 N·m and 38 W, both at 46.7 rpm.'
    },
    {
      title: 'A service factor at work',
      q: 'A belt conveyor with moderate shock loads runs 16 hours a day and needs 300 N·m at the gearbox output. The maker\'s table gives a service factor of 1.4. Is a gearbox rated 400 N·m enough?',
      steps: [
        'Required rating: $T_{\\mathrm{G}} = 300 \\times 1.4 = 420$ N·m.',
        '400 N·m is below 420 N·m: it would wear out early (pitting, bearing fatigue).',
        'Choose the next size up, and check the thermal rating and the overhung load on the output shaft as well.'
      ],
      a: 'No: 420 N·m is needed, so choose the next size up.'
    },
    {
      title: 'Backlash at the tip of an arm',
      q: 'A pick-and-place arm 200 mm long is driven through a standard planetary gearbox with 10 arcmin of backlash. How much can the tip wander? What about a precision planetary with 3 arcmin?',
      steps: [
        '$10\\prime = 10/60 = 0.1667° = 0.00291$ rad; $x = 200 \\times 0.00291 = 0.58$ mm.',
        'With 3 arcmin: $x = 200 \\times 0.000873 = 0.17$ mm.',
        'Add the torsional wind-up under load: the play is only the part you get at zero torque.'
      ],
      a: '0.58 mm with 10′; 0.17 mm with 3′.'
    }
  ],
  quiz: [
    { q: 'A gearbox of ratio 20 and efficiency 95 % is driven with 2 N·m at 1500 rpm. What comes out?', choices: ['38 N·m at 75 rpm', '40 N·m at 75 rpm', '38 N·m at 30 000 rpm', '1.9 N·m at 75 rpm'], a: 0, why: 'Speed is divided by 20 (75 rpm); torque is multiplied by 20 × 0.95 = 19 (38 N·m). 40 N·m forgets the losses.' },
    { q: 'A robot wrist needs a small, light reducer with no backlash and a ratio of 100. Which fits best?', choices: ['A strain-wave gear', 'A worm gear', 'A two-stage spur gearbox', 'A V-belt'], a: 0, why: 'Strain-wave gears give 30–160 in one stage with essentially zero backlash in a light package; their softness and lower efficiency are acceptable in a wrist.' },
    { q: 'A statically self-locking worm gearbox is a safe way to hold a lift platform when the motor stops.', a: false, why: 'Vibration and running lower the friction, so the load can creep or run down; holding loads needs a rated brake designed to the safety requirements.' },
    { q: 'Why does a 60:1 worm gearbox run much hotter than a 60:1 helical gearbox driven by the same motor?', choices: ['Its teeth slide rather than roll, so its efficiency is much lower and the lost power becomes heat', 'It has more oil', 'Its output turns faster', 'Worm gears have more backlash'], a: 0, why: 'The worm slides across the wheel teeth; at 60:1 the efficiency may be 55–60 %, so 40 % or more of the input becomes heat, against 3–5 % in a helical box.' },
    { q: 'A 23-tooth pinion turns at 3000 rpm. At what frequency do you expect gear whine?', answer: 1150, unit: 'Hz', why: 'Mesh frequency = teeth × revolutions per second = 23 × 50 = 1150 Hz (and its harmonics).' }
  ],
  problems: [
    { q: 'A 1.1 kW, 1420 rpm motor drives a 12:1 helical gearbox with an efficiency of 96 %. What torque is available at the output?', answer: 88.8, unit: 'N·m', tol: 0.01, steps: ['Motor torque $T_1 = 1100/(1420 \\times 2\\pi/60) = 1100/148.7 = 7.40$ N·m.', '$T_2 = 7.40 \\times 12 \\times 0.96 = 88.8$ N·m.'] },
    { q: 'A mixer needs 250 N·m at the gearbox output, and the service factor for its duty is 1.5. What is the smallest gearbox rating that will do?', answer: 375, unit: 'N·m', tol: 0.01, steps: ['$T_{\\mathrm{G}} = 250 \\times 1.5 = 375$ N·m.'] }
  ],
  choose: {
    good: [
      'Any load that is slower than the motor: a small fast motor plus a gearbox is lighter and cheaper than a big slow motor.',
      'Servo axes with high inertia: the ratio divides the reflected inertia by i² (precision planetary).',
      'Robot joints and indexers: strain-wave and cycloidal reducers give large ratios with almost no backlash.',
      'Right-angle drives: bevel (efficient) or worm (quiet, cheap, high ratio in one stage).'
    ],
    avoid: [
      'Worm gears at high ratios in continuous duty where energy and heat matter — a helical-bevel box wastes far less.',
      'Standard gearboxes with 10–30 arcmin of backlash on axes that reverse under load and need accuracy.',
      'Relying on self-locking to hold a load: fit a brake.'
    ],
    check: [
      'Output torque × service factor against the rated torque; peak and emergency-stop torque.',
      'Efficiency at your load and temperature, and the thermal rating in continuous duty.',
      'Backlash and torsional stiffness for positioning; the maximum input speed.',
      'Overhung and axial loads on the shafts, mounting position (oil level) and lubrication intervals.',
      'Noise (mesh frequency) and the gearbox inertia added to the motor.'
    ]
  },
  applications: [
    'Industrial helical and helical-bevel gearmotors on conveyors, mixers, agitators and cranes.',
    'Precision planetary gearboxes on servo axes of packaging and machine tools; strain-wave and cycloidal reducers in the joints of industrial and collaborative robots.',
    'Worm gearboxes on gate openers, small conveyors and turntables; the sizing tool [axis sizing](#/tools/sizing/axis) shows the effect of a ratio on a servo axis.'
  ],
  history: 'Leonhard Euler worked out the involute tooth profile in the eighteenth century; it became the standard because involute gears keep an exact ratio even when their centre distance is slightly off. The strain-wave gear was invented by C. Walton Musser in the late 1950s, and the cycloidal reducer goes back to the German engineer Lorenz Braren in the 1920s.',
  sources: [
    'ISO 6336 (series), *Calculation of load capacity of spur and helical gears*: tooth bending and pitting strength, the basis of gearbox ratings.',
    'ISO 1328-1, *Cylindrical gears — ISO system of flank tolerance classification*: gear accuracy grades.',
    'Budynas and Nisbett, *Shigley\'s Mechanical Engineering Design*: the chapters on spur and helical gears and on bevel and worm gears (worm efficiency and self-locking).',
    'Dudley\'s *Handbook of Practical Gear Design and Manufacture*: gear types, lubrication, noise and failure modes.'
  ],
  sim: 'mx-gearbox'
},

{
  id: 'belts-pulleys', parent: 'transmission', title: 'Belts and pulleys', level: 2,
  short: 'Belts carry power between shafts some distance apart, quietly and cheaply. V-belts and flat belts grip by friction — the tight side may pull only about e^{μθ} times the slack side before they slip; timing belts mesh with teeth and never slip until a tooth jumps. Tension is the whole art: too slack slips, too tight wrecks bearings.',
  keywords: ['belt drive', 'V-belt', 'timing belt', 'synchronous belt', 'toothed belt', 'poly-V', 'flat belt', 'pulley', 'sheave', 'belt tension', 'capstan equation', 'Euler–Eytelwein', 'slip', 'creep', 'ratcheting', 'tooth jump', 'belt speed', 'overhung load'],
  prereq: ['torque-and-power', 'physics:friction', 'physics:tension-pulleys'],
  related: ['gearboxes', 'bearings-motors', 'rack-pinion-linear', 'inertia-reflected', 'couplings-alignment', 'motors-pumps-fans'],
  body: `
A belt carries power between shafts that may be a metre or more apart. It is cheap, quiet, forgiving of small misalignment, it absorbs shocks, isolates vibration, and a new ratio needs only a new pulley. Belts work in one of two ways: **by friction** (flat, V and poly-V belts) or **by teeth** (timing or synchronous belts).

### Ratio and speed
The belt runs at the same speed over both pulleys, so

$$\\frac{n_2}{n_1} = \\frac{d_1}{d_2}, \\qquad v = \\pi\\, d\\, n$$

with pitch diameters $d$. A 100 mm pulley on a 1450 rpm motor driving a 250 mm pulley gives 580 rpm, with the belt at 7.6 m/s. For a timing belt the ratio is exactly the ratio of tooth counts; a friction belt loses 1–2 % to **creep** (the belt stretches more on the tight side than the slack side, so it slides a little over each pulley).

### Tension carries the torque
The two runs of the belt pull with different tensions: the **tight side** $T_1$ and the **slack side** $T_2$. Their difference, the effective pull, makes the torque and the power:

$$T = (T_1 - T_2)\\,\\frac{d}{2}, \\qquad P = (T_1 - T_2)\\, v$$

A friction belt can hold that difference only while the ratio stays below the capstan limit ([[?exponential|exponential]] in the wrap angle $\\theta$ in [[?radian|radians]]):

$$\\frac{T_1}{T_2} \\le e^{\\mu\\theta}$$

A V-belt wedges into its groove, which multiplies the effective friction by about 3 ($\\mu/\\sin(\\beta/2)$ for a groove angle $\\beta$ near 38°). Designers keep the working ratio near 5 for V-belts and 2–3 for flat belts, to leave a margin before slip. The wrap on the *small* pulley limits the grip — keep it above about 120°.

| Belt | Grips by | Efficiency | Ratio accuracy | Typical use |
|---|---|---|---|---|
| Flat | friction | 97–98 % | creeps 1–2 % | historic line shafts, high-speed spindles, conveyors |
| V-belt (classical, narrow) | wedge friction | 93–97 % | creeps 1–3 %, slips when overloaded | fans, pumps, compressors, machine tools |
| Poly-V (ribbed) | friction | 95–97 % | creeps about 1 % | compact drives, appliances, engine auxiliaries |
| Timing (synchronous) | teeth | 97–99 % | exact — until a tooth jumps | positioning axes, printers, camshafts, servo drives |

V-belts work best at about 5–30 m/s; above that, centrifugal force pulls the belt away from the grooves and eats the grip. Timing belts in linear axes typically run at 1–5 m/s.

### Getting the tension right
- **Too slack**: a V-belt squeals at every start, glazes, heats and burns; a timing belt **ratchets** — a tooth jumps and the axis loses its position without any alarm.
- **Too tight**: the shaft load (about $T_1 + T_2$ for a half-wrap, often 1.5–2.5 × the effective pull) overloads the motor bearings and can bend or break the shaft; belt life falls too (see [[bearings-motors]]).
- **Measure it**: by the force to deflect the span a set distance, or by plucking the span and measuring its frequency: $T = 4\\,m\\,L^2 f^2$ for a span of length $L$ and belt mass $m$ per metre.
- New V-belts stretch and bed in during the first hours of running: re-tension them then. Replace belts of a multi-belt drive as a matched set.
- **Alignment**: keep the pulleys parallel and in line — typically within about ½° for V-belts and less for timing belts — or the belt wears on its edges, runs off, or climbs its flanges.

> [!warn] Belts and pulleys trap fingers and clothing where the belt runs onto a pulley. Keep the guards on, and lock out and tag out the drive before checking or adjusting tension — never check a running belt.

### Real-life notes
- A timing-belt axis is springy: its stiffness falls as the free length grows, so long belt axes resonate at a few hertz to a few tens of hertz and overshoot when stopped hard. Keep spans short, use wider or steel-cord belts.
- **Noise**: a squeal is slip; a whine at the tooth-mesh frequency is a timing belt that is too tight or misaligned.
- **Heat, oil and ozone** age rubber belts; antistatic belts are needed where sparks are dangerous.
- A pulley far out on the motor shaft multiplies the bearing load — mount it close to the bearing.

In the simulation, raise the load torque until the V-belt slips (or the timing belt ratchets), then raise the installation tension; watch the shaft load that the motor bearings must carry.

> [!key] A friction belt transmits only while $T_1/T_2 < e^{\\mu\\theta}$; a timing belt only while its teeth stay in mesh. Tension it by measurement, not by feel.
`,
  ideas: [
    'The speed ratio is the inverse ratio of the pitch diameters; the belt speed is π d n.',
    'Torque comes from the difference between tight-side and slack-side tension; power is that pull times the belt speed.',
    'Friction belts slip when T₁/T₂ reaches e^{μθ}; the V-groove wedge roughly triples the grip.',
    'Timing belts do not creep or slip, but they ratchet when too slack and the axis loses position silently.',
    'Belt tension loads the motor bearings: over-tensioning shortens bearing life.'
  ],
  pitfalls: [
    'Tighter is always safer — Excess tension overloads the motor and pulley bearings and the shaft, and shortens belt life; set the tension to the maker\'s value by measurement.',
    'A timing belt cannot lose position — It can ratchet over the pulley teeth under a shock or when too slack, and nothing tells the controller unless the load has its own encoder.',
    'A squealing V-belt needs belt dressing — The squeal is slip: the belt is too slack, worn, glazed or overloaded; fix the cause.'
  ],
  formulas: [
    {
      name: 'Speed ratio of a belt drive',
      expr: 'n2 = n1*d1/d2', tex: 'n_2 = n_1\\,\\dfrac{d_1}{d_2}',
      vars: {
        n2: { name: 'driven pulley speed', q: 'angvel', unit: 'rpm', tex: 'n_2' },
        n1: { name: 'driving pulley speed', q: 'angvel', unit: 'rpm', value: 1450, tex: 'n_1' },
        d1: { name: 'driving pulley pitch diameter', q: 'length', unit: 'mm', value: 100, tex: 'd_1' },
        d2: { name: 'driven pulley pitch diameter', q: 'length', unit: 'mm', value: 250, tex: 'd_2' }
      },
      note: 'Friction belts run 1–2 % slower than this because of creep.',
      stories: { n2: 'A {d1} pulley on a {n1} motor drives a {d2} pulley. How fast does the driven shaft turn?', d2: 'A {d1} pulley on a {n1} motor must drive a fan at {n2}. What driven pulley diameter is needed?' }
    },
    {
      name: 'Belt speed',
      expr: 'v = pi*d*n', tex: 'v = \\pi\\, d\\, n',
      vars: {
        v: { name: 'belt speed', q: 'speed', unit: 'm/s' },
        d: { name: 'pulley pitch diameter', q: 'length', unit: 'mm', value: 100 },
        n: { name: 'pulley speed', q: 'frequency', unit: 'rpm', value: 1450 }
      },
      stories: { v: 'A {d} pulley turns at {n}. How fast does the belt run?', n: 'A {d} timing pulley must move a belt at {v}. How fast must it turn?' }
    },
    {
      name: 'The capstan (Euler–Eytelwein) limit',
      expr: 'T1 = T2*exp(mu*theta)', tex: 'T_1 = T_2\\, e^{\\mu\\theta}',
      vars: {
        T1: { name: 'tight-side tension at the point of slip', q: 'force', unit: 'N', tex: 'T_1' },
        T2: { name: 'slack-side tension', q: 'force', unit: 'N', value: 100, tex: 'T_2' },
        mu: { name: 'effective friction coefficient (V-groove: μ/sin(β/2))', value: 0.51, min: 0.05, max: 2, tex: '\\mu' },
        theta: { name: 'wrap angle on the small pulley', q: 'angle', unit: '°', value: 180, min: 30, max: 360, tex: '\\theta' }
      },
      note: 'With μ = 0.51 and a half wrap the limit is T₁/T₂ ≈ 5, the usual working ratio for V-belts.',
      stories: { T1: 'A belt with {T2} on its slack side wraps {theta} round a pulley with an effective friction coefficient of {mu}. How much tension can the tight side reach before it slips?', theta: 'What wrap angle lets a belt hold {T1} against {T2} with μ = {mu}?' }
    },
    {
      name: 'Power carried by a belt',
      expr: 'P = (T1 - T2)*v', tex: 'P = (T_1 - T_2)\\, v',
      vars: {
        P: { name: 'power transmitted', q: 'power', unit: 'kW' },
        T1: { name: 'tight-side tension', q: 'force', unit: 'N', value: 494, tex: 'T_1' },
        T2: { name: 'slack-side tension', q: 'force', unit: 'N', value: 99, tex: 'T_2' },
        v: { name: 'belt speed', q: 'speed', unit: 'm/s', value: 7.59 }
      },
      stories: { P: 'A belt runs at {v} with {T1} on its tight side and {T2} on its slack side. What power does it carry?', T1: 'A belt at {v} must carry {P}; its slack side has {T2}. What is the tight-side tension?' }
    },
    {
      name: 'Belt tension from the span frequency',
      expr: 'T = 4*m*L^2*f^2', tex: 'T = 4\\, m\\, L^2 f^2',
      vars: {
        T: { name: 'static span tension', q: 'force', unit: 'N' },
        m: { name: 'belt mass per metre', q: 'lindensity', unit: 'kg/m', value: 0.1 },
        L: { name: 'free span length', q: 'length', unit: 'mm', value: 400 },
        f: { name: 'span frequency when plucked', q: 'frequency', unit: 'Hz', value: 80 }
      },
      note: 'A plucked span vibrates like a string: f = (1/2L)·√(T/m). This is how sonic tension meters work.',
      stories: { T: 'A span {L} long of a belt weighing {m} vibrates at {f} when plucked. What is its tension?', f: 'The maker asks for {T} in a span {L} long of a belt of {m}. What frequency should a tension meter read?' }
    }
  ],
  derivation: {
    title: 'Why the grip grows exponentially with the wrap',
    steps: [
      { text: 'Take a short piece of belt wrapped through a small angle $d\\theta$. The tensions at its ends, $T$ and $T + dT$, press it onto the pulley with a force $T\\,d\\theta$.', tex: 'dN = T\\, d\\theta' },
      { text: 'Friction can hold a difference in tension of at most $\\mu$ times that pressing force.', tex: 'dT = \\mu\\, T\\, d\\theta' },
      { text: 'The change in tension is proportional to the tension itself — the signature of the exponential. Integrate over the whole wrap from the slack side to the tight side:', tex: '\\int_{T_2}^{T_1} \\frac{dT}{T} = \\mu \\int_0^{\\theta} d\\theta \\;\\Rightarrow\\; \\ln\\frac{T_1}{T_2} = \\mu\\theta' },
      { text: 'So each extra radian of wrap multiplies the tension the belt can hold by $e^{\\mu}$ — the same reason a rope wound a few turns round a bollard holds a ship.', tex: 'T_1 = T_2\\, e^{\\mu\\theta}' }
    ]
  },
  examples: [
    {
      title: 'A fan drive',
      q: 'A 3 kW, 1450 rpm motor drives a fan through a V-belt: 100 mm motor pulley, 250 mm fan pulley, working ratio $T_1/T_2 = 5$. Find the fan speed, belt speed, tensions and the load on the motor shaft.',
      steps: [
        'Fan speed $1450 \\times 100/250 = 580$ rpm; belt speed $v = \\pi \\times 0.1 \\times 1450/60 = 7.59$ m/s.',
        'Effective pull $T_1 - T_2 = P/v = 3000/7.59 = 395$ N.',
        'With $T_1 = 5T_2$: $4T_2 = 395$, so $T_2 = 98.8$ N and $T_1 = 494$ N.',
        'The shaft load for nearly half a wrap is about $T_1 + T_2 = 593$ N — acting on the motor\'s drive-end bearing, as an overhung load.'
      ],
      a: '580 rpm, 7.6 m/s, T₁ ≈ 494 N, T₂ ≈ 99 N, about 590 N on the motor shaft.'
    },
    {
      title: 'Setting tension with a frequency meter',
      q: 'A belt of 0.1 kg/m has a free span of 400 mm and should carry 400 N of static tension. What frequency should the meter show?',
      steps: [
        'From $T = 4mL^2f^2$: $f = \\sqrt{T/(4mL^2)} = \\sqrt{400/(4 \\times 0.1 \\times 0.16)} = \\sqrt{6250}$.',
        '$f = 79$ Hz. Tighten if the reading is lower, slacken if it is higher.'
      ],
      a: 'About 79 Hz.'
    },
    {
      title: 'Resolution of a belt axis',
      q: 'A linear axis uses a 30-tooth pulley on a 5 mm pitch timing belt, driven directly by a servo with 10 000 counts per revolution. What is the travel per revolution, the speed at 3000 rpm and the resolution?',
      steps: [
        'Travel per revolution: $30 \\times 5 = 150$ mm.',
        'At 3000 rpm = 50 rev/s: $v = 50 \\times 0.15 = 7.5$ m/s.',
        'Resolution: $150/10\\,000 = 0.015$ mm = 15 µm per count — but the belt\'s stretch under acceleration is usually larger than that.'
      ],
      a: '150 mm per revolution, 7.5 m/s at 3000 rpm, 15 µm per count.'
    }
  ],
  quiz: [
    { q: 'A V-belt squeals for a second at every start, then runs quietly. The most likely cause?', choices: ['The belt is too slack and slips under the starting torque', 'The belt is too tight', 'The pulleys are too large', 'The motor runs too slowly'], a: 0, why: 'Starting torque is the highest the belt sees; a slack or glazed belt slips then, and the slip is the squeal.' },
    { q: 'Why is a timing belt, not a V-belt, used on a positioning axis?', choices: ['Its teeth give an exact ratio with no creep or slip', 'It is always cheaper', 'It needs no tension', 'It damps vibration better'], a: 0, why: 'Friction belts creep 1–2 % and slip under overload, so the position drifts; teeth keep the ratio exact.' },
    { q: 'Tightening a V-belt as much as possible is the safe choice.', a: false, why: 'The extra tension goes straight into the motor and pulley bearings and the shaft; it shortens their life and the belt\'s.' },
    { q: 'An 80 mm pulley turns at 2900 rpm. How fast does the belt run?', answer: 12.15, unit: 'm/s', why: 'v = π d n = π × 0.08 m × 48.33 rev/s = 12.15 m/s.' },
    { q: 'One belt of a three-belt V drive is worn. What should you do?', choices: ['Replace all three as a matched set', 'Replace only the worn belt', 'Remove the worn belt and run on two', 'Tighten the other two harder'], a: 0, why: 'A new belt is shorter than the stretched old ones, so it would carry most of the load and fail early; matched sets share the load.' }
  ],
  problems: [
    { q: 'A 125 mm pulley on a 1460 rpm motor drives a 315 mm pulley. How fast does the driven shaft turn (ignore creep)?', answer: 579.4, unit: 'rpm', tol: 0.01, steps: ['$n_2 = 1460 \\times 125/315 = 579.4$ rpm.'] },
    { q: 'A belt carries 2.2 kW at 10 m/s. What is the effective pull $T_1 - T_2$?', answer: 220, unit: 'N', tol: 0.01, steps: ['$T_1 - T_2 = P/v = 2200/10 = 220$ N.'] }
  ],
  choose: {
    good: [
      'Shafts some distance apart, with a ratio you may want to change later (fans, pumps, compressors).',
      'Drives that must absorb shock and isolate vibration from the motor.',
      'Timing belts for long, fast, low-cost positioning axes and for synchronising shafts.',
      'Folding a motor back alongside the load to save length.'
    ],
    avoid: [
      'V-belts where the ratio or position must be exact.',
      'Very high torque at low speed — a gearbox or chain is more compact.',
      'Hot, oily or chemically aggressive places that attack rubber, unless the belt is made for them.',
      'Drives whose belt pull exceeds the motor\'s permitted overhung load.'
    ],
    check: [
      'Belt section and number of belts from the maker\'s power ratings, with its service factor.',
      'Belt speed, the minimum pulley diameter and the wrap on the small pulley.',
      'The shaft load against the motor\'s overhung-load rating and bearing life.',
      'A way to set and re-check tension, pulley alignment, guards, and antistatic belts where needed.'
    ]
  },
  applications: [
    'Fans, blowers, pumps and compressors driven through V-belts, with the speed set by the pulley ratio.',
    'Timing belts in 3-D printers, plotters, pick-and-place gantries and the camshaft drives of engines.',
    'Poly-V belts in washing machines and on the auxiliaries of car engines.'
  ],
  history: 'Flat leather belts carried power from a factory\'s line shaft to every machine through the nineteenth century, until individual electric motors replaced line shafts early in the twentieth. The capstan relation behind every friction belt is associated with Leonhard Euler and Johann Albert Eytelwein.',
  sources: [
    'Budynas and Nisbett, *Shigley\'s Mechanical Engineering Design*: the chapter on flexible mechanical elements (flat, V and timing belts): tensions, the capstan relation and power ratings.',
    'Belt makers\' design manuals: power ratings per belt section, service factors, minimum pulley diameters and tensioning by deflection force or span frequency.',
    'ISO 14120, *Safety of machinery — Guards — General requirements for the design and construction of fixed and movable guards*.'
  ],
  sim: 'mx-belt'
},

{
  id: 'lead-ball-screws', parent: 'transmission', title: 'Lead screws and ball screws', level: 2,
  short: 'A screw turns rotation into straight-line motion: one turn moves the nut by the lead, and a small torque gives a large force. Sliding lead screws are cheap, quiet and may hold a load by friction; ball screws are 90 % efficient, stiff and precise, but always back-drive — and every screw has a critical speed at which it whips.',
  keywords: ['lead screw', 'ball screw', 'trapezoidal thread', 'ACME thread', 'lead', 'pitch', 'lead angle', 'back-driving', 'self-locking', 'ball nut', 'preload', 'critical speed', 'screw whip', 'DN value', 'buckling', 'anti-backlash nut', 'screw torque'],
  prereq: ['torque-and-power', 'gearboxes', 'physics:friction', 'physics:inclined-plane'],
  related: ['rack-pinion-linear', 'inertia-reflected', 'bearings-motors', 'couplings-alignment', 'motor-brakes', 'motor-selection-method', 'hydraulics:rod-buckling'],
  body: `
A screw is an inclined plane wrapped round a shaft. Each turn moves the nut by the **lead** $p$ (the pitch times the number of starts), so the linear speed and the torque needed to push a force $F$ are

$$v = p\\, n, \\qquad T = \\frac{F\\, p}{2\\pi\\, \\eta}$$

A 10 mm-lead screw at 1500 rpm moves at 250 mm/s; lifting a 20 kg carriage (196 N) through it at 90 % efficiency takes only 0.35 N·m. That enormous mechanical advantage — and fine resolution, 1 µm per count with a 10 000-count encoder — is why screws drive machine tools, presses, lifts and precision stages. The same torque relation drives the [axis sizing tool](#/tools/sizing/axis).

### Sliding or rolling
| | Lead screw (trapezoidal or ACME thread) | Ball screw |
|---|---|---|
| Contact | the nut slides on the thread (bronze, cast iron or polymer) | balls roll between screw and nut and recirculate |
| Friction μ | 0.1–0.2 (bronze, oiled); 0.08–0.25 (polymer) | 0.003–0.01 |
| Efficiency | 20–70 %, rising with the lead angle | 85–95 % |
| Back-driving | small leads hold a load at rest (self-locking) | always back-drives |
| Backlash | 0.05–0.2 mm; spring-loaded anti-backlash nuts | none with a preloaded nut; 0.01–0.05 mm without |
| Lead accuracy | modest | rolled: tens of µm up to about 0.2 mm per 300 mm; ground: under about 20 µm per 300 mm |
| Life | wear: limited by heat and the nut's pressure × velocity | rolling fatigue, like a bearing |
| Speed and duty | slow, intermittent | fast (1–2 m/s with long leads), continuous |
| Price and noise | cheap and quiet | dearer; balls rattle at speed |

### Efficiency and back-driving
The lead angle $\\lambda = \\arctan(p/\\pi d)$ and the friction angle $\\varphi = \\arctan\\mu$ set both directions, exactly as in a worm gear ([[gearboxes]]):

$$\\eta = \\frac{\\tan\\lambda}{\\tan(\\lambda + \\varphi)}, \\qquad \\eta_b = \\frac{\\tan(\\lambda - \\varphi)}{\\tan\\lambda}$$

A ball screw 16 mm × 5 mm has $\\lambda = 5.7°$ and $\\varphi = 0.3°$: 95 % forward, 95 % backward — the load drives the screw as easily as the screw drives the load. A trapezoidal Tr16 × 4 lead screw has $\\lambda = 5.2°$ and (with μ = 0.15 on its 30° thread) $\\varphi \\approx 8.8°$: 36 % forward and self-locking at rest. Its low efficiency is the price: pushing 1000 N at 50 mm/s takes 137 W, of which 87 W heat the nut.

> [!warn] A vertical ball-screw axis falls when the motor loses power or torque is switched off. Fit a holding brake ([[servo-brakes]]) or a counterbalance, design the stopping and holding function to the machine-safety requirements, and support the carriage mechanically before working under it. Even a self-locking lead screw can creep down under vibration.

### Speed limits: whip, balls and buckling
- **Critical speed.** A long, thin screw spinning fast bows out and whips when its speed reaches its first bending [[?proportional|natural frequency]]:
$$n_c = \\frac{k\\, d_r}{8\\pi L^2}\\sqrt{\\frac{E}{\\rho}}$$
with the root diameter $d_r$, the free length $L$, and $k = (\\beta L)^2$ set by the end supports: 3.5 (fixed–free), 9.9 (supported–supported), 15.4 (fixed–supported), 22.4 (fixed–fixed). Double the length and the critical speed falls four times. Makers use about 80 % of it. A 16 mm screw (13.5 mm root) 1 m long, fixed–supported: 2540 rpm, so about 2000 rpm in service — 0.34 m/s with a 10 mm lead. Long, fast axes turn the nut instead, or use a belt, rack or linear motor.
- **Ball speed.** The ball return limits the product of diameter and speed, typically $d\\cdot n$ = 50 000–150 000 mm·rpm (check the maker's value).
- **Buckling.** A long screw pushing a load is a column in compression: check it like a cylinder rod ([[hydraulics:rod-buckling|rod buckling]]), with the same end-fixity factors.

### In real machines
- **Heat growth**: steel grows 11.5 µm per metre per kelvin, so a 1 m screw warming by 5 K lengthens by 0.06 mm — more than a ground screw's whole accuracy. Precision axes read position from a linear scale, or pre-stretch the screw.
- **Preload** removes backlash and stiffens the nut, at the cost of a drag torque (often a few hundredths to a tenth of a newton-metre on small screws) and some heat.
- **Alignment**: a nut forced sideways by a misaligned guide or support bearing binds, heats and wears; use a fixed end with an angular-contact bearing pair, a floating support at the other end, and a torsionally stiff coupling ([[couplings-alignment]]).
- **Lubrication and dirt**: grease or oil at intervals of travel; wipers, bellows or covers against chips. Never run a ball nut off its screw — the balls fall out.
- **Life**: a ball screw's rated life follows $L = (C_a/F_m)^3 \\times 10^6$ revolutions, the same law as a ball bearing ([[bearings-motors]]).

In the simulation, compare the nut types on a vertical axis: switch the motor off and see which ones hold; raise the speed until the screw whips.

> [!key] Ball screws: efficient, stiff, precise — but they back-drive and have a critical speed. Lead screws: cheap, quiet, often self-locking — but inefficient, slower and wear-limited.
`,
  ideas: [
    'One turn moves the nut by the lead: v = p n, and T = F p/(2π η).',
    'Efficiency depends on lead angle and friction; ball screws reach 85–95 %, lead screws 20–70 %.',
    'When the lead angle is below the friction angle the screw is self-locking; ball screws never are.',
    'Critical speed falls with the square of the free length: long fast screws whip.',
    'Preload removes backlash but adds drag torque and heat; thermal growth can exceed the screw\'s accuracy.'
  ],
  pitfalls: [
    'A ball screw holds a vertical load when the motor stops — At 90 % back-driving efficiency the load spins the screw down; a brake or counterbalance is required.',
    'A longer lead always means a faster axis — The motor must then give more torque for the same force, the resolution coarsens, and the critical speed still limits the screw rpm.',
    'Accuracy is set by the screw class alone — Heat growth, preload, support alignment and the coupling often add more error than the lead tolerance.'
  ],
  formulas: [
    {
      name: 'Linear speed of a screw',
      expr: 'v = p*n', tex: 'v = p\\, n',
      vars: {
        v: { name: 'linear speed of the nut', q: 'speed', unit: 'mm/s' },
        p: { name: 'lead (travel per turn)', q: 'length', unit: 'mm', value: 10 },
        n: { name: 'screw speed', q: 'frequency', unit: 'rpm', value: 1500 }
      },
      stories: { v: 'A screw with a {p} lead turns at {n}. How fast does the nut move?', n: 'A nut on a {p} lead must move at {v}. How fast must the screw turn?' }
    },
    {
      name: 'Torque to drive a screw',
      expr: 'T = F*p/(2*pi*eta)', tex: 'T = \\dfrac{F\\, p}{2\\pi\\, \\eta}',
      vars: {
        T: { name: 'screw torque', q: 'torque', unit: 'N·m' },
        F: { name: 'axial force on the nut', q: 'force', unit: 'N', value: 196 },
        p: { name: 'lead', q: 'length', unit: 'mm', value: 10 },
        eta: { name: 'screw efficiency', q: 'ratio', unit: '%', value: 90, tex: '\\eta' }
      },
      note: 'Add the nut\'s preload drag torque and the torque to accelerate the screw\'s own inertia.',
      stories: { T: 'A screw with a {p} lead and efficiency {eta} must push {F}. What torque does it need?', F: 'A motor gives {T} to a screw with a {p} lead and efficiency {eta}. What force does the nut push?' }
    },
    {
      name: 'Efficiency of a screw from its lead and diameter',
      expr: 'eta = (p/(pi*d))/tan(atan(p/(pi*d)) + atan(mu))', tex: '\\eta = \\dfrac{p/\\pi d}{\\tan\\left(\\arctan\\dfrac{p}{\\pi d} + \\arctan\\mu\\right)}',
      vars: {
        eta: { name: 'forward efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        p: { name: 'lead', q: 'length', unit: 'mm', value: 5 },
        d: { name: 'mean (pitch) diameter', q: 'length', unit: 'mm', value: 16 },
        mu: { name: 'friction coefficient (for a trapezoidal thread μ/cos 15°)', value: 0.005, min: 0.001, max: 0.5, tex: '\\mu' }
      },
      note: 'Ball screws μ ≈ 0.003–0.01; bronze nuts, oiled, 0.1–0.2; polymer nuts 0.08–0.25.',
      stories: { eta: 'A screw of {d} mean diameter with a {p} lead runs with μ = {mu}. How efficient is it?' }
    },
    {
      name: 'Back-driving efficiency',
      expr: 'etab = tan(lam - atan(mu))/tan(lam)', tex: '\\eta_b = \\dfrac{\\tan(\\lambda - \\arctan\\mu)}{\\tan\\lambda}',
      vars: {
        etab: { name: 'efficiency with the load driving the screw (≤ 0: self-locking)', q: 'ratio', unit: '%', signed: true, tex: '\\eta_b' },
        lam: { name: 'lead angle', q: 'angle', unit: '°', value: 5.68, min: 0.1, max: 45, tex: '\\lambda' },
        mu: { name: 'friction coefficient', value: 0.005, min: 0.001, max: 0.5, tex: '\\mu' }
      },
      stories: { etab: 'A screw with a lead angle of {lam} runs with μ = {mu}. How well does the load drive it backwards?' }
    },
    {
      name: 'Critical (whirling) speed of a screw',
      expr: 'nc = k*d/(8*pi*L^2)*sqrt(E/rho)', tex: 'n_c = \\dfrac{k\\, d_r}{8\\pi L^2}\\sqrt{\\dfrac{E}{\\rho}}',
      vars: {
        nc: { name: 'critical speed', q: 'frequency', unit: 'rpm', tex: 'n_c' },
        k: { name: 'end-fixity factor (βL)²: 3.5 fixed–free, 9.9 supported–supported, 15.4 fixed–supported, 22.4 fixed–fixed', value: 15.4, min: 1, max: 30 },
        d: { name: 'root diameter', q: 'length', unit: 'mm', value: 13.5, tex: 'd_r' },
        L: { name: 'free length between supports', q: 'length', unit: 'mm', value: 1000 },
        E: { name: 'Young\'s modulus (steel)', q: 'pressure', unit: 'GPa', value: 206 },
        rho: { name: 'density (steel)', q: 'density', unit: 'kg/m³', value: 7850, tex: '\\rho' }
      },
      note: 'The first bending frequency of a solid round shaft. Run at no more than about 80 % of it.',
      stories: { nc: 'A steel screw of {d} root diameter has {L} between supports (factor {k}). At what speed does it whip?', L: 'A screw of {d} root diameter (factor {k}) must reach {nc}. How long may its free length be?' }
    }
  ],
  examples: [
    {
      title: 'A vertical axis on a ball screw',
      q: 'A 20 kg carriage rides on a vertical ball screw with a 10 mm lead, 90 % efficient forwards and about 88 % backwards. What steady torque lifts it, and what torque does the load exert on the motor when it is standing still?',
      steps: [
        'Weight $F = 20 \\times 9.81 = 196$ N.',
        'Lifting: $T = F p/(2\\pi\\eta) = 196 \\times 0.01/(2\\pi \\times 0.9) = 0.347$ N·m.',
        'The load back-drives the screw with $T_b = F p\\,\\eta_b/(2\\pi) = 196 \\times 0.01 \\times 0.88/(2\\pi) = 0.275$ N·m, which the motor must hold continuously — and which spins the screw down if the torque disappears.'
      ],
      a: 'About 0.35 N·m to lift; 0.27 N·m of back-driving torque to hold — so a brake is needed.'
    },
    {
      title: 'Lead screw or ball screw for a 1000 N push?',
      q: 'Compare a Tr16 × 4 lead screw (η = 36 %) with a 16 × 5 ball screw (η = 95 %) pushing 1000 N at 50 mm/s.',
      steps: [
        'Lead screw: $T = 1000 \\times 0.004/(2\\pi \\times 0.364) = 1.75$ N·m at $50/4 = 12.5$ rev/s: input $1.75 \\times 2\\pi \\times 12.5 = 137$ W for 50 W of useful work — 87 W heat the nut.',
        'Ball screw: $T = 1000 \\times 0.005/(2\\pi \\times 0.952) = 0.84$ N·m at 10 rev/s: input 53 W, 2.5 W of heat.',
        'For occasional short moves the lead screw is fine (and self-locking); for continuous duty the ball screw wins on motor size, heat and wear.'
      ],
      a: 'Lead screw 1.75 N·m and 137 W; ball screw 0.84 N·m and 53 W.'
    },
    {
      title: 'How fast may this screw turn?',
      q: 'A 16 mm ball screw (root 13.5 mm) has 1000 mm between a fixed end and a supported end. Find its critical speed, a safe working speed, and the axis speed with a 10 mm lead.',
      steps: [
        '$\\sqrt{E/\\rho} = \\sqrt{206 \\times 10^9/7850} = 5123$ m/s.',
        '$n_c = 15.4 \\times 0.0135/(8\\pi \\times 1^2) \\times 5123 = 42.4$ rev/s = 2540 rpm.',
        'Working limit $0.8 \\times 2540 \\approx 2030$ rpm, which with a 10 mm lead is $2030/60 \\times 10 = 340$ mm/s.'
      ],
      a: 'About 2540 rpm critical; use ≤ 2030 rpm, i.e. about 0.34 m/s.'
    }
  ],
  quiz: [
    { q: 'A vertical axis driven by a ball screw loses motor power. What happens without a brake?', choices: ['The carriage runs down, spinning the screw and motor', 'It stays put: screws are self-locking', 'It stays put because the nut is preloaded', 'It moves up'], a: 0, why: 'A ball screw\'s lead angle is far above its tiny friction angle; its back-driving efficiency is about 90 %.' },
    { q: 'A trapezoidal lead screw with a 5° lead angle and a friction angle of 9° will hold a vertical load at rest.', a: true, why: 'λ < φ makes the back-driving efficiency negative: it is self-locking at rest. But vibration can still make it creep, so it is not a safety brake.' },
    { q: 'A ball-screw axis is lengthened from 1 m to 2 m with the same screw diameter and supports. Its critical speed…', choices: ['falls to a quarter', 'halves', 'stays the same', 'doubles'], a: 0, why: 'n_c ∝ d/L²: twice the length gives a quarter of the critical speed.' },
    { q: 'A screw with a 5 mm lead turns at 3000 rpm. How fast does the nut move?', answer: 250, unit: 'mm/s', why: 'v = p n = 5 mm × 50 rev/s = 250 mm/s.' },
    { q: 'What does preloading a ball nut do?', choices: ['Removes backlash and stiffens the nut, adding some drag torque and heat', 'Raises the efficiency to 100 %', 'Makes the screw self-locking', 'Raises the critical speed'], a: 0, why: 'Two ball tracks are pushed against each other so there is no play; the price is extra friction.' }
  ],
  problems: [
    { q: 'A screw with a 10 mm lead and 90 % efficiency must push 2000 N. What torque does it need?', answer: 3.54, unit: 'N·m', tol: 0.01, steps: ['$T = F p/(2\\pi\\eta) = 2000 \\times 0.01/(2\\pi \\times 0.9) = 3.54$ N·m.'] },
    { q: 'A steel screw of 20 mm root diameter is fixed at both ends (factor 22.4) with 1500 mm between them. What is its critical speed?', answer: 2435, unit: 'rpm', tol: 0.02, steps: ['$\\sqrt{E/\\rho} = 5123$ m/s.', '$n_c = 22.4 \\times 0.02/(8\\pi \\times 1.5^2) \\times 5123 = 40.6$ rev/s = 2435 rpm.'] }
  ],
  choose: {
    good: [
      'Ball screws: precise, stiff, efficient axes with high force over travels up to a few metres — machine tools, presses, injection units, precision stages.',
      'Lead screws: cheap, quiet, light-duty adjusters, lifts and valves, where holding by friction at rest is welcome.',
      'Polymer-nut lead screws where grease is unwelcome (food, medical, clean equipment).'
    ],
    avoid: [
      'Long, fast axes: whip limits the screw speed — use a belt, rack and pinion or linear motor, or a rotating nut.',
      'Lead screws in continuous or high-duty service: heat and wear.',
      'Counting on a ball screw (or a lead screw under vibration) to hold a vertical load.'
    ],
    check: [
      'Critical speed at your free length and end supports, the ball-speed (d·n) limit and buckling in compression.',
      'Drive torque F·p/(2π η) plus the nut\'s preload drag and the torque to accelerate the screw\'s own inertia.',
      'Nut life (ball screws) or wear and heat (lead screws) for your duty cycle.',
      'Lead accuracy class, backlash or preload, thermal growth, lubrication and covers.',
      'A brake or counterbalance on vertical axes.'
    ]
  },
  applications: [
    'CNC machine tools and precision stages: preloaded ground ball screws with angular-contact support bearings.',
    'Electric actuators replacing hydraulic and pneumatic cylinders: a motor, a belt or gearbox and a ball screw in one tube.',
    'Lead screws in 3-D printer Z axes, medical beds, hand-cranked vices and valve stems.'
  ],
  history: 'Recirculating ball screws were adopted in car steering gears in the first half of the twentieth century and spread to machine tools with numerical control from the 1950s, where their efficiency and freedom from backlash made accurate servo positioning practical.',
  sources: [
    'ISO 3408 (series), *Ball screws*: vocabulary, acceptance conditions and tests, axial rigidity, and static and dynamic axial load ratings and life.',
    'Budynas and Nisbett, *Shigley\'s Mechanical Engineering Design*: the chapter on power screws (torque, efficiency and self-locking) and on the critical speeds of shafts.',
    'Ball-screw makers\' technical sections: critical speed with end-fixity factors, d·n limits, buckling, preload and lubrication.'
  ],
  sim: 'mx-screw'
},

{
  id: 'rack-pinion-linear', parent: 'transmission', title: 'Rack and pinion and linear axes', level: 2,
  short: 'A pinion rolling on a toothed rack moves a carriage π·m·z per turn over any length, with the same stiffness everywhere — the drive of long gantries. It is one of four ways to build a linear axis: ball screw, timing belt, rack and pinion or linear motor, each with its own speed, stroke, stiffness, accuracy and cost.',
  keywords: ['rack and pinion', 'linear axis', 'module', 'pinion', 'gantry', 'linear guide', 'profile rail', 'linear motor', 'belt axis', 'ball screw axis', 'repeatability', 'resolution', 'dual drive', 'anti-backlash', 'stiffness'],
  prereq: ['gearboxes', 'lead-ball-screws', 'belts-pulleys'],
  related: ['inertia-reflected', 'motion-profiles', 'motor-selection-method', 'linear-motors', 'homing-routines', 'limit-switches', 'physics:friction'],
  body: `
A **rack** is a gear unrolled into a straight bar; a **pinion** rolling along it moves one circumference per turn. With module $m$ (the tooth size in millimetres) and $z$ teeth, the pinion's pitch diameter is $d = m z$ and

$$s = \\pi\\, m\\, z, \\qquad v = \\pi\\, m\\, z\\, n, \\qquad T = \\frac{F\\, m\\, z}{2\\,\\eta}$$

A module-3, 20-tooth pinion ($d$ = 60 mm) moves 188 mm per turn: for 1.5 m/s it turns at 477 rpm, so it is nearly always driven through a gearbox (here 5:1, putting the motor at 2390 rpm). Racks are joined end to end, so the stroke is unlimited, and — unlike a screw or a belt — the stiffness does not fall with length. That is why long gantries, laser and plasma cutters, and transfer lines run on racks.

### Rack and pinion in practice
- **Backlash** in the mesh is typically a few hundredths to a tenth of a millimetre. Precision axes remove it with a split, spring-preloaded pinion, or with **two motors on one rack** that the drive biases against each other.
- **Helical racks** run quieter and carry more force than straight ones; the pinion then also pushes sideways and upwards.
- The mesh must be **set** (centre distance) along the whole length; joins are aligned with a gauge rack, or the cumulative pitch error jumps at each joint.
- **Lubrication**: a felt pinion or an automatic lubricator keeps grease on the teeth; dry racks wear and howl.
- **Gantries** with a rack on each side use a motor per side, electronically geared, so the beam does not twist (racking).

### Four ways to build a linear axis
| Drive | Stroke | Speed (typical) | Repeatability (typical) | Strong points | Weak points |
|---|---|---|---|---|---|
| Ball screw | up to about 3–4 m | 0.5–2 m/s | ±1–10 µm | stiff, high force, fine resolution | critical speed; cost and whip on long axes |
| Timing belt | long (many metres) | up to about 5 m/s, some faster | ±0.05–0.1 mm | fast, light, cheap | springy; stretch; resonance |
| Rack and pinion | unlimited | 1–5 m/s | ±0.01–0.05 mm with precision racks and preload | long, stiff, strong | backlash, lubrication, noise |
| Linear motor | long (modular magnet track) | up to 5 m/s and more | ±1 µm or better (set by the scale) | no backlash or wear, very dynamic | price; heat into the machine; magnets collect chips; needs a brake or counterbalance vertically |

### What else makes an axis
- **Guides** carry the load; the drive only pushes. Rolling profile rails have a friction coefficient of about 0.002–0.005 (plus seal drag); plain slides 0.05–0.2 and suffer stick-slip. The friction force $F = \\mu M g$ is small on rails — 7 N for 150 kg — but twenty times larger on a plain slide.
- **Resolution** is the travel per motor revolution divided by the encoder counts: 10 mm/10 000 = 1 µm on a screw, 150 mm/10 000 = 15 µm on a direct belt. Accuracy is another matter — pitch errors, stretch and heat — and needs a linear scale when it must be better than the mechanics.
- **Stiffness** decides how fast the axis settles: a screw is stiff, a belt soft, a rack stiff at any length.
- **Limit switches and homing** at both ends of travel ([[limit-switches]], [[homing-routines]]), mechanical end stops that can absorb a crash, and a brake on vertical axes.
- **Reflected inertia** of the carriage, $M r^2$ at the pinion, divided by $i^2$ through a gearbox ([[inertia-reflected]]).

> [!warn] Linear axes crush and shear: the carriage stops against end stops with great force, and gantries move fast and silently. Guard the working area, use safe speeds and enabling devices for setting up (to the machinery-safety standards, such as ISO 13849-1 and IEC 60204-1), and lock out the drives before reaching in.

In the simulation, run the same move on each drive and compare the motor speed, torque, reflected inertia and resolution in the table.

> [!key] Choose a linear drive by stroke, speed, force, stiffness and accuracy: screws for precise force, belts for fast light loads, racks for long strong axes, linear motors for the highest dynamics.
`,
  ideas: [
    'A pinion of module m and z teeth moves π m z per turn; torque at the pinion is F·m·z/(2η).',
    'Rack stiffness and accuracy do not depend on length, so stroke is unlimited.',
    'Backlash in a rack drive is removed with split preloaded pinions or two motors biased against each other.',
    'Ball screws, belts, racks and linear motors trade stroke, speed, stiffness, accuracy and price.',
    'Resolution is travel per revolution divided by encoder counts; accuracy needs more than resolution.'
  ],
  pitfalls: [
    'More encoder counts make the axis more accurate — They refine resolution; accuracy is limited by pitch error, backlash, stretch and heat.',
    'The drive carries the weight of the carriage — The guides do; the drive only overcomes friction, gravity on inclined or vertical axes, process forces and inertia.',
    'A linear motor needs no brake on a vertical axis — It holds only while powered and controlled; power loss drops the load.'
  ],
  formulas: [
    {
      name: 'Pinion pitch diameter',
      expr: 'd = m*z', tex: 'd = m\\, z',
      vars: {
        d: { name: 'pitch diameter', q: 'length', unit: 'mm' },
        m: { name: 'module', q: 'length', unit: 'mm', value: 3 },
        z: { name: 'number of teeth', int: true, value: 20 }
      },
      stories: { d: 'A pinion of module {m} has {z} teeth. What is its pitch diameter?' }
    },
    {
      name: 'Linear speed of a rack drive',
      expr: 'v = pi*m*z*n', tex: 'v = \\pi\\, m\\, z\\, n',
      vars: {
        v: { name: 'carriage speed', q: 'speed', unit: 'm/s' },
        m: { name: 'module', q: 'length', unit: 'mm', value: 3 },
        z: { name: 'number of pinion teeth', int: true, value: 20 },
        n: { name: 'pinion speed', q: 'frequency', unit: 'rpm', value: 477.5 }
      },
      stories: { v: 'A module {m} pinion with {z} teeth turns at {n}. How fast does the carriage move?', n: 'A module {m} pinion with {z} teeth must move a gantry at {v}. How fast must it turn?' }
    },
    {
      name: 'Pinion torque',
      expr: 'T = F*m*z/(2*eta)', tex: 'T = \\dfrac{F\\, m\\, z}{2\\,\\eta}',
      vars: {
        T: { name: 'torque at the pinion', q: 'torque', unit: 'N·m' },
        F: { name: 'force on the rack', q: 'force', unit: 'N', value: 457 },
        m: { name: 'module', q: 'length', unit: 'mm', value: 3 },
        z: { name: 'number of pinion teeth', int: true, value: 20 },
        eta: { name: 'mesh efficiency', q: 'ratio', unit: '%', value: 97, tex: '\\eta' }
      },
      stories: { T: 'A gantry needs {F} at the rack, driven by a module {m} pinion with {z} teeth ({eta} efficient). What torque must the pinion give?' }
    },
    {
      name: 'Resolution of an axis',
      expr: 'dx = s/N', tex: '\\Delta x = \\dfrac{s}{N}',
      vars: {
        dx: { name: 'travel per encoder count', q: 'length', unit: 'µm', tex: '\\Delta x' },
        s: { name: 'travel per motor revolution', q: 'length', unit: 'mm', value: 37.7 },
        N: { name: 'encoder counts per revolution', int: true, value: 10000 }
      },
      stories: { dx: 'An axis moves {s} per motor revolution and the encoder gives {N} counts per turn. What is the smallest step it can measure?' }
    },
    {
      name: 'Friction force of a guide',
      expr: 'F = mu*M*g', tex: 'F = \\mu\\, M\\, g',
      vars: {
        F: { name: 'friction force', q: 'force', unit: 'N' },
        mu: { name: 'friction coefficient (rolling rails 0.002–0.005; plain slides 0.05–0.2)', value: 0.005, min: 0.0005, max: 1, tex: '\\mu' },
        M: { name: 'moving mass', q: 'mass', unit: 'kg', value: 150 },
        g: { const: 'g' }
      },
      stories: { F: 'A {M} carriage runs on guides with μ = {mu}. What force does friction take?' }
    }
  ],
  examples: [
    {
      title: 'A gantry on a rack',
      q: 'A 150 kg gantry must reach 1.5 m/s with 3 m/s² of acceleration. It rides on rolling rails (μ = 0.005) and is driven by a module-3, 20-tooth pinion (97 %) through a 5:1 gearbox (97 %). Find the pinion and motor speeds and the motor torque while accelerating (ignore the motor\'s own inertia).',
      steps: [
        '$d = 3 \\times 20 = 60$ mm. Pinion speed $n = v/(\\pi d) = 1.5/(\\pi \\times 0.06) = 7.96$ rev/s = 477 rpm; motor $5 \\times 477 = 2387$ rpm.',
        'Force: $F = M a + \\mu M g = 150 \\times 3 + 0.005 \\times 150 \\times 9.81 = 450 + 7.4 = 457$ N.',
        'Pinion torque: $T = F d/(2\\eta) = 457 \\times 0.06/(2 \\times 0.97) = 14.1$ N·m.',
        'Motor torque: $14.1/(5 \\times 0.97) = 2.92$ N·m. The gantry\'s inertia at the motor is $M (d/2)^2/i^2 = 150 \\times 0.03^2/25 = 54$ kg·cm² — compare it with the motor\'s rotor inertia before choosing ([[inertia-reflected]]).'
      ],
      a: 'Pinion 477 rpm, motor about 2390 rpm, about 2.9 N·m at the motor while accelerating.'
    },
    {
      title: 'Same encoder, three drives',
      q: 'A servo with 10 000 counts per revolution drives (a) a 10 mm-lead ball screw directly, (b) a timing-belt pulley moving 150 mm per turn, (c) the rack drive above (188.5 mm per pinion turn, 5:1 gearbox). What is the resolution of each?',
      steps: [
        '(a) $10/10\\,000$ mm = 1 µm.',
        '(b) $150/10\\,000$ mm = 15 µm.',
        '(c) $188.5/5 = 37.7$ mm per motor turn: $37.7/10\\,000$ mm = 3.8 µm.'
      ],
      a: '1 µm, 15 µm and 3.8 µm per count.'
    },
    {
      title: 'Rails or a plain slide?',
      q: 'The 150 kg carriage could run on rolling rails (μ = 0.005) or on a plain slide (μ = 0.1). Compare the friction forces.',
      steps: [
        'Rails: $0.005 \\times 150 \\times 9.81 = 7.4$ N.',
        'Plain slide: $0.1 \\times 150 \\times 9.81 = 147$ N — twenty times more, and static friction above sliding friction causes stick-slip at low speeds.'
      ],
      a: '7.4 N against 147 N.'
    }
  ],
  quiz: [
    { q: 'A 12 m gantry must move a heavy beam at 2 m/s. Which drive suits best?', choices: ['Rack and pinion', 'A single ball screw', 'A lead screw', 'A V-belt'], a: 0, why: 'A 12 m screw would whip far below the needed speed; a rack gives unlimited stroke with constant stiffness.' },
    { q: 'Why do some rack axes use two motors on the same rack, biased against each other?', choices: ['To remove backlash from the mesh', 'To double the speed', 'To save energy', 'To avoid needing a gearbox'], a: 0, why: 'One motor always pushes one tooth flank and the other the opposite flank, so there is no free play when the force reverses.' },
    { q: 'A vertical axis driven by a linear motor needs no brake, because it has no mechanical transmission.', a: false, why: 'A linear motor produces force only while powered and controlled; without it the load falls. Vertical linear-motor axes need a brake or counterbalance.' },
    { q: 'A module-2 pinion with 25 teeth: how far does the rack move per pinion revolution?', answer: 157.1, unit: 'mm', why: 's = π m z = π × 2 × 25 = 157.1 mm.' },
    { q: 'Why does a long belt axis usually settle more slowly after a fast stop than a screw axis of similar size?', choices: ['The belt is much less stiff, so the load rings at a low frequency', 'Belts have more friction', 'The motor of a belt axis is smaller', 'Belts have backlash'], a: 0, why: 'Belt stiffness falls with free length; low stiffness means a low natural frequency, which the servo cannot damp quickly.' }
  ],
  problems: [
    { q: 'A module-4 pinion with 18 teeth (97 % efficient) must push 1200 N. What torque does it need?', answer: 44.5, unit: 'N·m', tol: 0.01, steps: ['$d = 4 \\times 18 = 72$ mm.', '$T = F d/(2\\eta) = 1200 \\times 0.072/(2 \\times 0.97) = 44.5$ N·m.'] },
    { q: 'The same pinion ($d$ = 72 mm) must move the carriage at 2 m/s. How fast must it turn?', answer: 530.5, unit: 'rpm', tol: 0.01, steps: ['$n = v/(\\pi d) = 2/(\\pi \\times 0.072) = 8.84$ rev/s = 530.5 rpm.'] }
  ],
  choose: {
    good: [
      'Rack and pinion: long gantries, cutting tables and transfer lines with unlimited stroke and high force.',
      'Timing belts: fast, light pick-and-place and handling axes.',
      'Ball screws: precise, stiff, high-force axes up to a few metres.',
      'Linear motors: the highest speed, acceleration and accuracy with no wear.'
    ],
    avoid: [
      'Rack drives without backlash compensation where the force reverses and accuracy matters.',
      'Belt axes carrying heavy loads that must stop precisely and quickly.',
      'Linear motors near iron chips without covers, or where their heat would distort the machine.'
    ],
    check: [
      'Stroke, speed, acceleration and force, and the required accuracy and repeatability.',
      'Stiffness and settling time; backlash and how it is removed.',
      'Guides: load ratings, friction and life; lubrication.',
      'Limit switches, homing, end stops, brakes on vertical axes and guarding.'
    ]
  },
  applications: [
    'Laser, plasma and waterjet cutting tables with a rack on each side of the gantry.',
    'Pick-and-place and palletising gantries on belt or rack axes; semiconductor and inspection stages on linear motors.',
    'Rack-and-pinion drives in lift doors, sliding gates and car steering.'
  ],
  sources: [
    'ISO 1328-1, *Cylindrical gears — ISO system of flank tolerance classification*: accuracy grades that also apply to racks and pinions.',
    'Budynas and Nisbett, *Shigley\'s Mechanical Engineering Design*: spur and helical gears (module, pitch diameter and tooth forces).',
    'NEMA ICS 16, motion and position control motors, controls and feedback devices.',
    'IEC 60204-1 and ISO 13849-1: electrical equipment and safety-related control of machines with moving axes.'
  ],
  sim: 'mx-axes'
},

{
  id: 'couplings-alignment', parent: 'transmission', title: 'Couplings and alignment', level: 2,
  short: 'A coupling joins the motor shaft to the load: it carries the torque and forgives a little misalignment — offset, angle and end float. It cannot forgive much: misaligned shafts load the bearings, heat the coupling and shake the machine at twice running speed. Servo axes also need couplings that are torsionally stiff and free of backlash.',
  keywords: ['coupling', 'shaft alignment', 'misalignment', 'parallel offset', 'angular misalignment', 'jaw coupling', 'spider', 'bellows coupling', 'disc coupling', 'gear coupling', 'Oldham coupling', 'tyre coupling', 'dial indicator', 'laser alignment', 'soft foot', 'thermal growth', 'torsional stiffness', '2× vibration'],
  prereq: ['torque-and-power', 'bearings-motors', 'physics:rotational-dynamics'],
  related: ['gearboxes', 'lead-ball-screws', 'inertia-reflected', 'motor-vibration', 'bearing-failures', 'servo-tuning', 'maintenance-diagnostics', 'physics:driven-oscillations'],
  body: `
Two machines bolted to a base are never perfectly in line. Their shafts are offset sideways or up and down (**parallel offset** $\\delta$), tilted to each other (**angular misalignment** $\\alpha$), and they grow and shrink along their length as they warm up (**axial float**). A coupling must carry the full torque — peaks included — while bending just enough to accept that misalignment. Some couplings also damp shocks, insulate the shafts electrically, or slip or break at an overload to protect the machine.

### Kinds of coupling
| Coupling | Parallel offset (typical) | Angular (typical) | Torsionally | Where it fits |
|---|---|---|---|---|
| Rigid (sleeve, clamp, flange) | practically none | practically none | stiff, no backlash | only where the machine itself aligns the shafts (a motor spigoted onto a gearbox) |
| Jaw with elastomer spider | 0.1–0.4 mm | about 1° | damped; a preloaded hard spider has no backlash | general machines; servo axes with a hard spider |
| Tyre (rubber element) | 1–4 mm | 3–5° | soft, strongly damping | pumps, fans, shock loads, poor foundations |
| Gear coupling | large with two meshes and a spacer | 0.5–1.5° per mesh | stiff, small backlash | very high torque; needs grease |
| Disc pack | only with two packs and a spacer | about 0.5–1° per pack | stiff, no backlash | process pumps, compressors, servo drives; no lubrication |
| Bellows | 0.1–0.3 mm | 1–2° | very stiff, no backlash | servo axes, ball screws, encoders |
| Oldham | 1–3 mm | about 0.5° | small backlash as it wears | large offsets; insulates electrically |

The figures depend on size; the catalogue of the coupling you buy gives the real ones. **The permitted misalignment is what the coupling survives, not what your bearings enjoy**: align to a small fraction of it.

### What misalignment does
A flexible element bent every revolution pushes back on both shafts with a force roughly its radial stiffness times the offset, $F = k_r\\,\\delta$, and a moment from the angle. That force lands on the motor's and the load's bearings: 0.3 mm on a jaw coupling with $k_r$ = 800 N/mm adds 240 N, and since ball-bearing life falls with the cube of the load ([[bearings-motors]]), a bearing that carried 800 N loses more than half its life. Other consequences:
- **Vibration at twice running speed** (radially for offset, axially for angular misalignment) — the classic signature on a vibration spectrum ([[motor-vibration]]).
- **Heat and wear** in elastomer elements (a crumbling spider, rubber dust under the guard), fretting of gear teeth, fatigue cracks in bellows and discs.
- **Bent shafts, leaking seals, broken feet** in bad cases. Many "bearing failures" are alignment failures ([[bearing-failures]]).

### Aligning shafts
- **Rules of thumb** for flexible couplings at about 1500 rpm: offset within about 0.05 mm (excellent) to 0.1 mm (acceptable), angularity within about 0.05–0.08 mm per 100 mm of coupling diameter. Tighter at 3000 rpm; looser for slow machines.
- **Soft foot first**: a foot that does not sit flat distorts the frame when bolted down (check each foot with a dial; fix gaps above about 0.05 mm with shims).
- **Measure** with dial indicators (rim and face, or reverse dial) or a laser system. A rim dial swings by *twice* the offset over a turn; a face dial gives the gap difference $\\Delta g$ across a diameter $D$, so $\\alpha = \\arctan(\\Delta g/D)$.
- **Move the motor**, not the pump: shims under the feet, jacking screws sideways.
- **Thermal growth**: machines grow as they warm, $\\Delta h = \\alpha_T\\, h\\, \\Delta T$ — a pump whose feet warm by 40 K lifts a 300 mm-high shaft by 0.14 mm. Set cold offsets so the shafts meet when hot.
- **Pipe strain** pulls a pump out of line — support the pipes independently.

### Couplings on servo axes
A servo needs a coupling that is **free of backlash and torsionally stiff**, because the coupling is a spring between two inertias. They resonate at
$$f = \\frac{1}{2\\pi}\\sqrt{\\frac{k\\,(J_1 + J_2)}{J_1 J_2}}$$
A bellows coupling of 3000 N·m/rad between a 0.6 kg·cm² motor and a 3 kg·cm² screw resonates near 1230 Hz; a soft elastomer of 300 N·m/rad near 390 Hz, low enough to limit the servo gain ([[servo-tuning]]).

> [!warn] Couplings catch clothing and hair: keep their guards on. Lock out, tag out and prove both machines dead before alignment work — including pumps that can be turned by flow in the pipes.

In the simulation, choose a coupling and add offset and angle: watch the dial indicator, the extra load on the bearings, their life and the 2× line in the vibration spectrum.

> [!key] Choose the coupling for torque, misalignment, stiffness and backlash; then align the shafts to a small fraction of what the coupling allows. Misalignment is paid for by the bearings.
`,
  ideas: [
    'Shafts are misaligned by offset, angle and axial float; the coupling must accept all three while carrying the torque.',
    'A misaligned flexible coupling pushes on the bearings with about its radial stiffness times the offset.',
    'Misalignment shows as vibration at twice running speed and as heat, wear and early bearing failure.',
    'Align to a small fraction of the coupling\'s allowance; check soft foot first and allow for thermal growth.',
    'Servo couplings must be free of backlash and torsionally stiff: the coupling is the spring of a resonance.'
  ],
  pitfalls: [
    'A flexible coupling makes alignment unnecessary — It survives misalignment, but the reaction forces shorten bearing life; align well anyway.',
    'A rigid coupling is the most accurate choice for a servo motor on a separate bearing block — Any misalignment then bends the shafts and overloads the bearings; use a stiff but flexible bellows or disc coupling.',
    'Machines aligned cold stay aligned — They grow as they warm; hot machines need planned cold offsets.'
  ],
  formulas: [
    {
      name: 'Angular misalignment from a face reading',
      expr: 'alpha = atan(dg/D)', tex: '\\alpha = \\arctan\\dfrac{\\Delta g}{D}',
      vars: {
        alpha: { name: 'angular misalignment', q: 'angle', unit: '°', tex: '\\alpha' },
        dg: { name: 'gap difference across the face', q: 'length', unit: 'mm', value: 0.05, tex: '\\Delta g' },
        D: { name: 'measuring diameter', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'Alignment people usually quote Δg per 100 mm of diameter (mm/100 mm) rather than degrees.',
      stories: { alpha: 'A face dial reads a gap difference of {dg} across a diameter of {D}. What is the angular misalignment?' }
    },
    {
      name: 'Bearing force from a misaligned coupling',
      expr: 'F = kr*delta', tex: 'F = k_r\\, \\delta',
      vars: {
        F: { name: 'extra radial force on the bearings', q: 'force', unit: 'N' },
        kr: { name: 'radial stiffness of the coupling', q: 'stiffness', unit: 'N/mm', value: 800, tex: 'k_r' },
        delta: { name: 'parallel offset', q: 'length', unit: 'mm', value: 0.3, tex: '\\delta' }
      },
      stories: { F: 'A coupling with a radial stiffness of {kr} runs with {delta} of offset. What force does it put on the bearings?', delta: 'The bearings may take no more than {F} extra from a coupling of stiffness {kr}. What offset is allowed?' }
    },
    {
      name: 'Torsional resonance of motor, coupling and load',
      expr: 'f = sqrt(k*(J1 + J2)/(J1*J2))/(2*pi)', tex: 'f = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k\\,(J_1 + J_2)}{J_1 J_2}}',
      vars: {
        f: { name: 'resonant frequency', q: 'frequency', unit: 'Hz' },
        k: { name: 'torsional stiffness of the coupling', unit: 'N·m/rad', value: 3000 },
        J1: { name: 'motor rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 0.6, tex: 'J_1' },
        J2: { name: 'load inertia (screw, pulley…)', q: 'inertia', unit: 'kg·cm²', value: 3, tex: 'J_2' }
      },
      stories: { f: 'A coupling of {k} joins a {J1} motor to a {J2} ball screw. At what frequency do they resonate?', k: 'The resonance must stay above {f} with a {J1} motor and a {J2} load. How stiff must the coupling be?' }
    },
    {
      name: 'Thermal growth of a shaft height',
      expr: 'dh = a*h*dT', tex: '\\Delta h = \\alpha_T\\, h\\, \\Delta T',
      vars: {
        dh: { name: 'rise of the shaft centre', q: 'length', unit: 'mm', tex: '\\Delta h' },
        a: { name: 'expansion coefficient (steel ≈ 11.5, cast iron ≈ 10.5)', q: 'expansion', unit: 'ppm/K', value: 11.5, tex: '\\alpha_T' },
        h: { name: 'shaft height above the feet', q: 'length', unit: 'mm', value: 300 },
        dT: { name: 'temperature rise of the feet and casing', q: 'dtemp', unit: 'K', value: 40, tex: '\\Delta T' }
      },
      stories: { dh: 'A pump casing warms by {dT} and its shaft sits {h} above its feet ({a}). How far does the shaft rise?' }
    }
  ],
  examples: [
    {
      title: 'What 0.3 mm costs the bearings',
      q: 'A jaw coupling (radial stiffness 800 N/mm) runs with 0.3 mm of parallel offset. The motor\'s drive-end ball bearing otherwise carries 800 N. How much of its life is lost?',
      steps: [
        'Extra force $F = k_r\\delta = 800 \\times 0.3 = 240$ N, so the bearing now carries about 1040 N.',
        'Ball-bearing life goes as $(1/P)^3$: $(800/1040)^3 = 0.46$.',
        'The bearing now lasts under half as long — from 0.3 mm that is within the coupling\'s catalogue limit.'
      ],
      a: 'About 54 % of the bearing life is lost.'
    },
    {
      title: 'Cold offset for a hot pump',
      q: 'A pump\'s casing and feet run 40 K above ambient and its motor\'s 20 K; both shafts are 300 mm above their feet (steel, 11.5 µm/(m·K)). How should the motor be set when cold?',
      steps: [
        'Pump rise: $11.5 \\times 10^{-6} \\times 300 \\times 40 = 0.138$ mm.',
        'Motor rise: $11.5 \\times 10^{-6} \\times 300 \\times 20 = 0.069$ mm.',
        'The pump shaft rises 0.069 mm more, so set the motor about 0.07 mm high when cold; they meet in line when hot.'
      ],
      a: 'Set the motor about 0.07 mm higher than the pump, cold.'
    },
    {
      title: 'A stiff or a soft coupling on a servo axis?',
      q: 'A servo motor (0.6 kg·cm²) drives a ball screw (3 kg·cm²). Compare the resonance with a bellows coupling (3000 N·m/rad) and a soft elastomer coupling (300 N·m/rad).',
      steps: [
        'Bellows: $f = \\frac{1}{2\\pi}\\sqrt{3000 \\times 3.6 \\times 10^{-4}/(0.6 \\times 10^{-4} \\times 3 \\times 10^{-4})} = 1233$ Hz.',
        'Elastomer: ten times softer, so $\\sqrt{10}$ times lower: 390 Hz.',
        'A servo tuned for a few hundred hertz of bandwidth would excite the 390 Hz resonance; the bellows coupling keeps it far above.'
      ],
      a: 'About 1230 Hz against 390 Hz: the bellows coupling allows a much stiffer servo.'
    }
  ],
  quiz: [
    { q: 'A vibration analyser on a pump motor shows a strong peak at twice running speed, radially and axially. The most likely cause?', choices: ['Shaft misalignment at the coupling', 'Rotor unbalance', 'A broken rotor bar', 'Loose electrical connections'], a: 0, why: 'Misalignment classically shows at 2× running speed (axial for angular misalignment); unbalance shows at 1×.' },
    { q: 'The coupling catalogue allows 0.5 mm of offset, so aligning to 0.4 mm is good practice.', a: false, why: 'The allowance is what the coupling survives; the reaction force at 0.4 mm still loads the bearings. Align to a small fraction of it — typically 0.05–0.1 mm at 1500 rpm.' },
    { q: 'Which coupling suits a servo motor driving a ball screw on its own bearing block?', choices: ['A bellows or disc coupling', 'A rigid sleeve', 'A soft tyre coupling', 'A worn Oldham coupling'], a: 0, why: 'They are backlash-free and torsionally stiff yet accept small misalignment; a rigid sleeve would load the bearings, a tyre is too soft.' },
    { q: 'A rim dial indicator swings through 0.24 mm in one turn of the shafts. What is the parallel offset?', answer: 0.12, unit: 'mm', why: 'The rim dial sees the offset on both sides of the circle: the total swing is twice the offset.' },
    { q: 'Why check for soft foot before aligning?', choices: ['A rocking foot distorts the frame when it is bolted, so the alignment changes as bolts are tightened', 'It makes the motor run faster', 'It is required by the nameplate', 'It lowers the coupling\'s torque'], a: 0, why: 'You cannot align a machine whose shape changes with the bolt torque; shim the soft foot first.' }
  ],
  problems: [
    { q: 'A coupling of 5000 N·m/rad joins a 1 kg·cm² motor to a 4 kg·cm² load. What is the resonant frequency?', answer: 1258, unit: 'Hz', tol: 0.01, steps: ['$k(J_1+J_2)/(J_1J_2) = 5000 \\times 5 \\times 10^{-4}/(10^{-4} \\times 4 \\times 10^{-4}) = 6.25 \\times 10^7$ s⁻².', '$f = \\sqrt{6.25 \\times 10^7}/(2\\pi) = 7906/6.283 = 1258$ Hz.'] },
    { q: 'A face dial shows a gap difference of 0.12 mm across a 150 mm diameter. What is the angular misalignment in degrees?', answer: 0.0458, unit: '°', tol: 0.02, steps: ['$\\alpha = \\arctan(0.12/150) = 0.0458°$ — that is 0.08 mm per 100 mm.'] }
  ],
  choose: {
    good: [
      'Jaw and tyre couplings between separately mounted motors, pumps, fans and gearboxes.',
      'Bellows and disc couplings on servo axes and encoders: stiff and backlash-free.',
      'Disc-pack and gear couplings for high power; tyre couplings where shocks must be damped.',
      'Oldham couplings where the offset is large or the shafts must be insulated.'
    ],
    avoid: [
      'Rigid couplings between machines that are not aligned by a common housing or spigot.',
      'Soft elastomer couplings on stiff, fast servo axes.',
      'Treating the catalogue misalignment as the alignment tolerance.'
    ],
    check: [
      'Nominal and peak torque with the service factor; maximum speed and balance.',
      'Offset, angle and axial float you must accept; the reaction forces on your bearings.',
      'Torsional stiffness and backlash for servo axes; damping for shock loads.',
      'Bores, keys or clamp hubs; temperature, oil and chemicals; electrical insulation; guards.'
    ]
  },
  applications: [
    'Pump and fan sets aligned with dial indicators or lasers and fitted with tyre, jaw or disc couplings.',
    'Servo axes with bellows couplings between motor and ball screw; encoders on small beam or bellows couplings.',
    'Torque-limiting couplings that slip or disengage to protect a gearbox from a jam.'
  ],
  sources: [
    'Piotrowski, *Shaft Alignment Handbook*: misalignment, soft foot, dial-indicator and laser methods, thermal growth and tolerances.',
    'ISO 20816 (series, formerly ISO 10816), *Mechanical vibration — Measurement and evaluation of machine vibration*.',
    'Budynas and Nisbett, *Shigley\'s Mechanical Engineering Design*: shafts and shaft components, couplings and critical speeds.',
    'ISO 14120, *Safety of machinery — Guards*: fixed and movable guards over rotating parts.'
  ],
  sim: 'mx-coupling'
},

{
  id: 'bearings-motors', parent: 'transmission', title: 'Bearings and bearing life', level: 2,
  short: 'A motor spins on two rolling bearings that carry the rotor, the belt or coupling loads and any thrust. Their fatigue life falls with the cube of the load — double the belt pull and a ball bearing lasts an eighth as long — but most die earlier, of old grease, dirt, misalignment or current from a drive.',
  keywords: ['bearing', 'ball bearing', 'deep-groove ball bearing', 'cylindrical roller bearing', 'L10 life', 'dynamic load rating', 'equivalent load', 'overhung load', 'grease life', 'relubrication', 'bearing currents', 'insulated bearing', 'fluting', 'false brinelling', 'locating bearing', 'wave spring'],
  prereq: ['torque-and-power', 'physics:friction', 'belts-pulleys'],
  related: ['couplings-alignment', 'bearing-failures', 'motor-vibration', 'motor-noise', 'vfd-wiring-emc', 'maintenance-diagnostics', 'motor-failures', 'lead-ball-screws'],
  body: `
Almost every motor turns on two rolling bearings, one at the drive end (DE) and one at the non-drive end (NDE). They carry the rotor's weight and magnetic pull, the belt or coupling loads and any axial thrust, and they set much of the motor's noise and life. Surveys of industrial motor failures put bearings at the top of the list, often around 40 % or more of all failures.

### How motors use bearings
- **Small and medium motors**: two deep-groove ball bearings, shielded or sealed and greased for life. One is **located** (fixed axially); the other **floats** with a wave spring that preloads it lightly — quieter, and it stops the balls skidding.
- **Larger motors** (roughly from frame 160–225 upwards): open bearings with grease nipples and a grease outlet, relubricated in service.
- **Heavy belt drives**: a cylindrical roller bearing at the DE carries roughly twice the radial load of a ball bearing of the same size — but a roller bearing needs a **minimum load**. On a direct coupling it can skid, run noisy and smear its tracks.
- **Vertical and thrust loads**: angular-contact bearings.
- **Inverter-fed motors**, especially large ones, get an insulated bearing (ceramic-coated ring or ceramic balls) at the NDE and often a shaft-grounding brush, against bearing currents ([[vfd-wiring-emc]]).

### Rating life
A bearing under load fails in the end by fatigue of its tracks. The **basic rating life** $L_{10}$ is the life that 90 % of a large group of identical bearings reach:

$$L_{10} = \\left(\\frac{C}{P}\\right)^{p} \\times 10^6 \\text{ revolutions}, \\qquad L_{10h} = \\frac{10^6}{60\\, n}\\left(\\frac{C}{P}\\right)^{p}\\ \\text{hours}$$

$C$ is the bearing's dynamic load rating (the load that gives a million revolutions), $P$ the equivalent load $X F_r + Y F_a$, $n$ the speed in rpm, and the [[?exponent|exponent]] $p$ = 3 for ball bearings and 10/3 for roller bearings. The cube is merciless: **double the load and a ball bearing lasts an eighth as long**. A 25 mm-bore light-series ball bearing ($C \\approx$ 14.8 kN) at 1.2 kN and 1450 rpm has $L_{10h} \\approx$ 21 600 h; at 2.4 kN only 2700 h.

| Duty | Typical required $L_{10h}$ |
|---|---|
| Occasional use (hand tools, appliances) | a few hundred to a few thousand hours |
| 8 h a day, not always fully loaded | 10 000–25 000 h |
| 8 h a day, fully loaded (machine tools, conveyors) | 20 000–30 000 h |
| Continuous, 24 h a day (pumps, fans, compressors) | 40 000–50 000 h or more |

### Belt pull and overhang
A pulley on the shaft end is an overhung load. By the lever rule the DE bearing carries $R = F\\,(L + a)/L$ — more than the belt pull itself — where $L$ is the bearing span and $a$ the overhang; the NDE bearing is pulled the other way. A 600 N belt pull at 60 mm overhang on a 250 mm span puts 744 N on the DE bearing. **Mount the pulley close to the bearing**, keep belt tension right ([[belts-pulleys]]), and check the motor maker's permitted radial load at your overhang.

### Grease, heat and friction
- Most bearings die of their **grease**, not fatigue. As a rule of thumb grease life roughly halves for every 15 °C above about 70 °C. A sealed-for-life bearing lasts as long as its grease.
- **Relubricate** at the interval and quantity on the nameplate or in the manual; too much grease churns and overheats. Do not mix incompatible greases.
- Friction torque is small: about $M = \\mu P d/2$ with $\\mu \\approx$ 0.001–0.0015 for deep-groove ball bearings, plus seal drag — noticeable only in tiny motors.

### How bearings fail — and how you notice
- **Noise**: a growl or rumble (damaged tracks), a squeal (dry), a whine that rises with speed.
- **Heat**: a housing much hotter than usual (above about 80–90 °C on most motors deserves attention).
- **Vibration** at the bearing's defect frequencies, found by envelope analysis ([[motor-vibration]], [[maintenance-diagnostics]]).
- **Electrical fluting**: a washboard pattern from currents through the bearing on VFD-fed motors.
- **False brinelling**: dents from vibration while standing still — in transport or on a vibrating standby machine.
- **Dents** from hammering a pulley or coupling onto the shaft: use a puller, a press or a heater.

> [!warn] Lock out, tag out and prove dead before changing bearings or greasing through open covers. Bearing housings can be hot enough to burn; induction heaters make bearings too hot to hold.

In the simulation, raise the belt pull and move the pulley outwards: watch the bearing reactions and the lives drop, and compare a ball with a roller bearing at the drive end.

> [!key] Bearing life goes as the cube of the load (ball) — keep belt pull and overhang down and alignment good — and in practice as the life of the grease: keep it cool, clean and renewed.
`,
  ideas: [
    'L10 is the life 90 % of bearings reach: (C/P)^p million revolutions, p = 3 for balls and 10/3 for rollers.',
    'Double the load and a ball bearing\'s fatigue life falls to an eighth.',
    'A pulley overhang loads the drive-end bearing more than the belt pull itself; mount it close to the bearing.',
    'Grease life, not fatigue, ends most bearings: it roughly halves for every 15 °C above about 70 °C.',
    'Roller bearings need a minimum load; VFD-fed motors may need insulated bearings against fluting.'
  ],
  pitfalls: [
    'A roller bearing at the drive end is always the stronger choice — Without enough radial load (a direct coupling) its rollers skid and smear; it suits heavy belt drives.',
    'More grease is better — Overfilling churns the grease, raises the temperature and shortens its life; follow the stated quantity.',
    'L10 is how long every bearing lasts — It is the life 90 % reach under stated conditions; lubrication, dirt and misalignment decide the real life.'
  ],
  formulas: [
    {
      name: 'Basic rating life in hours',
      expr: 'L = 1e6*(C/P)^pe/n', tex: 'L_{10h} = \\dfrac{10^6}{n}\\left(\\dfrac{C}{P}\\right)^{p}',
      vars: {
        L: { name: 'basic rating life (L10)', q: 'time', unit: 'h', tex: 'L_{10h}' },
        C: { name: 'dynamic load rating', q: 'force', unit: 'kN', value: 14.8 },
        P: { name: 'equivalent dynamic load', q: 'force', unit: 'kN', value: 1.2 },
        pe: { name: 'life exponent (3 ball, 10/3 roller)', value: 3, min: 2.5, max: 4, tex: 'p' },
        n: { name: 'speed', q: 'frequency', unit: 'rpm', value: 1450 }
      },
      note: 'ISO 281. 10⁶ revolutions divided by the speed gives the time; modified life multiplies by factors for reliability and lubrication.',
      stories: { L: 'A ball bearing rated {C} carries {P} at {n}. What is its L10 life?', P: 'A ball bearing rated {C} at {n} must reach {L}. What load may it carry?' }
    },
    {
      name: 'Equivalent dynamic load',
      expr: 'P = X*Fr + Y*Fa', tex: 'P = X F_r + Y F_a',
      vars: {
        P: { name: 'equivalent load', q: 'force', unit: 'kN' },
        X: { name: 'radial factor', value: 0.56 },
        Fr: { name: 'radial load', q: 'force', unit: 'kN', value: 1.2, tex: 'F_r' },
        Y: { name: 'axial factor', value: 1.6 },
        Fa: { name: 'axial load', q: 'force', unit: 'kN', value: 0.5, tex: 'F_a' }
      },
      note: 'For a deep-groove ball bearing X = 1, Y = 0 while the axial load is small; X and Y from the bearing tables apply above the ratio e.',
      stories: { P: 'A bearing carries {Fr} radially and {Fa} axially, with X = {X} and Y = {Y}. What is the equivalent load?' }
    },
    {
      name: 'Drive-end bearing load from an overhung pulley',
      expr: 'R = F*(L + a)/L', tex: 'R = F\\,\\dfrac{L + a}{L}',
      vars: {
        R: { name: 'reaction at the drive-end bearing', q: 'force', unit: 'N' },
        F: { name: 'belt pull at the pulley', q: 'force', unit: 'N', value: 600 },
        L: { name: 'bearing span', q: 'length', unit: 'mm', value: 250 },
        a: { name: 'overhang from the DE bearing to the pulley centre', q: 'length', unit: 'mm', value: 60 }
      },
      note: 'The NDE bearing is pulled the other way with F·a/L. Add the rotor weight shared by both.',
      stories: { R: 'A {F} belt pull acts {a} beyond the drive-end bearing of a motor whose bearings are {L} apart. What does the DE bearing carry?', a: 'The DE bearing may take {R} from a {F} belt pull with a {L} span. How far out may the pulley sit?' }
    },
    {
      name: 'Friction torque of a bearing',
      expr: 'M = mu*P*d/2', tex: 'M = \\dfrac{\\mu\\, P\\, d}{2}',
      vars: {
        M: { name: 'friction torque', q: 'torque', unit: 'N·m' },
        mu: { name: 'friction coefficient (deep-groove ball ≈ 0.0015)', value: 0.0015, min: 0.0005, max: 0.01, tex: '\\mu' },
        P: { name: 'bearing load', q: 'force', unit: 'N', value: 1200 },
        d: { name: 'bore diameter', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'A rough estimate without seals; contact seals add their own drag.',
      stories: { M: 'A {d} bore ball bearing carries {P} with μ = {mu}. What friction torque does it add?' }
    }
  ],
  examples: [
    {
      title: 'The cube law',
      q: 'A ball bearing with C = 14.8 kN carries 1.2 kN at 1450 rpm. Find its L10 life, then the life if the belt is over-tensioned so the load doubles.',
      steps: [
        '$(C/P)^3 = (14.8/1.2)^3 = 12.33^3 = 1876$ million revolutions.',
        '$L_{10h} = 1876 \\times 10^6/(1450 \\times 60) = 21\\,600$ h — about five years at 12 hours a day.',
        'At 2.4 kN: $(6.17)^3 = 235$ million revolutions, 2700 h — an eighth.'
      ],
      a: 'About 21 600 h; only about 2700 h with double the load.'
    },
    {
      title: 'Moving the pulley in',
      q: 'A 593 N belt pull acts 60 mm beyond the DE bearing of a motor with a 250 mm bearing span. What does the DE bearing carry, and what is gained by moving the pulley to 30 mm?',
      steps: [
        'At 60 mm: $R = 593 \\times 310/250 = 735$ N.',
        'At 30 mm: $R = 593 \\times 280/250 = 664$ N.',
        'Life ratio $(735/664)^3 = 1.36$: 36 % more bearing life from sliding the pulley 30 mm along the shaft.'
      ],
      a: '735 N at 60 mm, 664 N at 30 mm: about 36 % longer life.'
    },
    {
      title: 'A hot bearing',
      q: 'A motor bearing\'s grease is expected to last 20 000 h at 70 °C. The motor is moved into a hot enclosure and the bearing runs at 85 °C. Estimate the new grease life with the rule of thumb.',
      steps: [
        '85 °C is 15 °C above 70 °C: one halving.',
        'About 10 000 h — relubricate twice as often, or cool the enclosure.'
      ],
      a: 'About 10 000 h.'
    }
  ],
  quiz: [
    { q: 'The radial load on a ball bearing doubles. Its fatigue life becomes…', choices: ['one eighth', 'one half', 'one quarter', 'unchanged'], a: 0, why: 'L10 ∝ (C/P)³ for ball bearings: (1/2)³ = 1/8.' },
    { q: 'A cylindrical roller bearing at the drive end is the better choice for any motor.', a: false, why: 'Roller bearings need a minimum load; on a direct coupling they skid, run noisy and smear. They suit heavy belt and pinion loads.' },
    { q: 'A bearing from a VFD-fed motor shows an even washboard pattern across its outer track. The likely cause?', choices: ['Electric current through the bearing (fluting)', 'Too much grease', 'Overloading by the belt', 'Vibration during transport'], a: 0, why: 'Common-mode voltage from the inverter discharges through the bearing film, etching regular flutes; insulated bearings and grounding brushes prevent it.' },
    { q: 'A ball bearing runs at C/P = 10 and 1500 rpm. What is its L10 life in hours?', answer: 11111, unit: 'h', why: '10³ × 10⁶ revolutions / (1500 × 60 revolutions per hour) = 11 111 h.' },
    { q: 'Why do most motor bearings fail long before their L10 fatigue life?', choices: ['Lubrication: aged, contaminated, too much or too little grease', 'L10 is always too optimistic by a factor of 10', 'Magnetic pull', 'The rotor is too heavy'], a: 0, why: 'Fatigue life assumes clean, adequate lubrication; in service the grease usually gives out first, followed by dirt, misalignment and currents.' }
  ],
  problems: [
    { q: 'A ball bearing with C = 30 kN carries 2 kN at 1000 rpm. What is its L10 life?', answer: 56250, unit: 'h', tol: 0.01, steps: ['$(30/2)^3 = 3375$ million revolutions.', '$L_{10h} = 3375 \\times 10^6/(1000 \\times 60) = 56\\,250$ h.'] },
    { q: 'A cylindrical roller bearing with C = 60 kN carries 6 kN at 1500 rpm. What is its L10 life?', answer: 23938, unit: 'h', tol: 0.02, steps: ['$(60/6)^{10/3} = 10^{3.333} = 2154$ million revolutions.', '$L_{10h} = 2154 \\times 10^6/(1500 \\times 60) = 23\\,900$ h.'] }
  ],
  choose: {
    good: [
      'Deep-groove ball bearings: the default for motors — quiet, cheap, take some thrust.',
      'A cylindrical roller bearing at the drive end for heavy belt or pinion loads.',
      'Insulated or hybrid (ceramic-ball) bearings on larger inverter-fed motors.',
      'Regreasable bearings where the motor runs hot, fast or for many years.'
    ],
    avoid: [
      'Roller bearings with light loads (direct couplings): skidding and smearing.',
      'Sealed-for-life bearings in hot, continuous service where the grease will not last.',
      'Pulleys far out on the shaft, over-tensioned belts and hammer-fitted couplings.'
    ],
    check: [
      'The permitted radial load at your overhang and the axial load, against your belt pull or thrust.',
      'L10h at your load and speed against the duty (20 000–50 000 h for most machines).',
      'Grease type, life at your temperature, relubrication interval and quantity.',
      'Bearing currents on VFD drives; storage and transport vibration.'
    ]
  },
  applications: [
    'Belt-driven fans and compressors: roller bearings at the drive end, sized for the belt pull.',
    'Condition monitoring: vibration envelopes and temperature trends predict bearing failure weeks ahead.',
    'Large inverter-fed motors with an insulated NDE bearing and a shaft-grounding brush.'
  ],
  history: 'Ball bearings were patented as early as the 1790s, but reliable ones came with hardened steel balls ground to precision at the end of the nineteenth century. In 1947 Gustaf Lundberg and Arvid Palmgren published the fatigue-life theory behind the L10 life that bearing catalogues still use.',
  sources: [
    'ISO 281, *Rolling bearings — Dynamic load ratings and rating life*: L10, equivalent load and the modified life.',
    'ISO 15243, *Rolling bearings — Damage and failures — Terms, characteristics and causes*.',
    'Harris and Kotzalas, *Rolling Bearing Analysis*: load distribution, fatigue life, lubrication and friction.',
    'IEC TS 60034-25: guidance for AC motors designed for converter supply, including bearing currents.'
  ],
  sim: 'mx-bearing'
},

{
  id: 'load-torque-types', parent: 'motion-sizing', title: 'Constant-torque, variable-torque and constant-power loads', level: 1,
  short: 'Loads come in families by how their torque changes with speed: constant torque (conveyors, hoists), torque rising with the square of speed (fans and centrifugal pumps), constant power (winders, spindles), friction and pure inertia. The family decides the motor, the drive rating, the starting method, braking and the energy you can save.',
  keywords: ['load torque', 'constant torque', 'variable torque', 'quadratic torque', 'constant power', 'fan law', 'affinity laws', 'winder', 'breakaway torque', 'Coulomb friction', 'viscous friction', 'overhauling load', 'four quadrants', 'regeneration', 'heavy duty', 'normal duty'],
  prereq: ['torque-and-power', 'physics:power', 'physics:friction'],
  related: ['inertia-reflected', 'motor-selection-method', 'vfd-energy-saving', 'motors-pumps-fans', 'motors-conveyors-hoists', 'vfd-braking', 'torque-slip-curve', 'hydraulics:pump-head-power'],
  body: `
A motor must give its load, at every speed, the torque the load asks for — plus whatever it takes to accelerate. Loads fall into a few families according to how that torque changes with speed, and knowing the family answers most sizing questions before any calculation. Power and torque are tied by

$$P = T\\,\\omega$$

so the family fixes how the power changes with speed too.

| Family | Torque against speed | Power against speed | Examples | What it means for the drive |
|---|---|---|---|---|
| Constant torque | $T$ = constant | $P \\propto n$ | conveyors, hoists, positive-displacement pumps and compressors, extruders, many mixers | full torque from standstill; a drive with a heavy-duty (constant-torque) rating; cooling at low speed |
| Quadratic (variable) torque | $T \\propto n^2$ | $P \\propto n^3$ | centrifugal fans, pumps and blowers | little torque at low speed; a normal-duty drive rating; big energy savings at reduced speed |
| Constant power | $T \\propto 1/n$ | $P$ = constant | centre winders, machine-tool spindles, traction above base speed | the largest torque at the lowest speed; field weakening helps |
| Friction | $T_c$ + $b\\,\\omega$, breakaway above running | $P \\propto n$ roughly | guides, seals, bearings, sliding tables | extra torque to start; stick-slip at crawl speeds |
| Inertia | $J\\alpha$ | only while the speed changes | flywheels, indexing tables, point-to-point axes | peak torque set by the acceleration ([[inertia-reflected]]) |
| Overhauling (gravity) | constant, same sign in both directions | negative when lowering | hoists, cranes, lifts, downhill conveyors | four-quadrant: braking resistor or regeneration, and a brake |

### Quadratic loads and the fan laws
A centrifugal fan or pump is a variable-torque load: its torque grows with the [[?proportional|square]] of speed and its power with the cube. At 80 % speed a fan needs 64 % of its torque and 51 % of its power; at half speed, an eighth of the power. That is why a VFD on a fan or pump that is usually throttled saves so much energy ([[vfd-energy-saving]], [[hydraulics:pump-head-power|pump power and the affinity laws]]). Drive makers rate their inverters higher for such loads — typically a "normal-duty" rating with about 110 % overload for 60 s against a "heavy-duty" rating of about 150 % for 60 s for constant-torque loads — so a fan drive can often be one size smaller.

### Constant-power loads
A centre winder pulls the web at constant speed $v$ and tension $F$. As the roll grows from diameter $D_1$ to $D_2$, its speed $n = v/\\pi D$ falls and its torque $T = F D/2$ rises, while the power $F v$ stays the same. Winding 200 N at 2 m/s from 0.1 m to 0.5 m needs 10 N·m at 382 rpm at the start and 50 N·m at 76 rpm at the end — 400 W throughout. A motor rated only for constant torque would have to give 50 N·m *and* 382 rpm: 2 kW for a 400 W job. A motor and drive with a field-weakening (constant-power) range, or a gearbox change, cut that waste; spindles of machine tools use the same trick.

### Starting and friction
Static friction is higher than sliding friction, and grease is stiff when cold: loaded conveyors, mixers and crushers often need 1.5–2 times their running torque just to break away. Positive-displacement pumps and compressors start against pressure unless unloaded. Check the motor's starting and breakdown torques (for an induction motor on the mains, see [[torque-slip-curve]]) or the drive's overload against the breakaway torque, not the running torque.

### The four quadrants
Plot torque against speed with signs: a motor that drives forwards works in quadrant I; braking while still moving forwards, it works in quadrant II and **generates**. A hoist lowering its load turns backwards while its motor holds the load up — also generating: 500 kg lowered at 0.5 m/s returns about 2.5 kW, which a drive must burn in a braking resistor or feed back to the supply ([[vfd-braking]]). A crane, a lift or a downhill conveyor is a four-quadrant load; a fan is a one-quadrant load.

> [!warn] Overhauling loads — hoists, lifts, vertical axes, inclined conveyors — run away if the motor or drive loses control. They need a mechanical brake that holds when power is lost, a drive able to absorb the regenerated energy, and a stopping and holding function designed to the machinery-safety requirements.

In the simulation, choose each load family and sweep the speed: the load's torque and power follow their law, the motor–drive envelope shows what is available, and negative power marks the quadrants where the motor generates.

> [!key] First name the load's family: constant torque, quadratic, constant power, friction, inertia or overhauling. It tells you where the torque is needed, which drive rating applies, whether braking energy must be handled, and where the energy savings are.
`,
  ideas: [
    'Constant-torque loads need full torque from standstill; their power rises in proportion to speed.',
    'Fans and centrifugal pumps need torque ∝ n² and power ∝ n³: slowing them saves energy dramatically.',
    'Constant-power loads (winders, spindles) need the most torque at the lowest speed.',
    'Breakaway torque from static friction can be far above the running torque.',
    'Overhauling loads make the motor generate: plan for braking energy and a holding brake.'
  ],
  pitfalls: [
    'A fan motor must be sized for full torque at every speed like a conveyor — Its torque falls with the square of speed; a variable-torque (normal-duty) drive rating is enough.',
    'Lowering a load costs the motor energy — A hoist lowering at constant speed returns energy: the motor works as a generator, and the drive must dissipate or return it.',
    'If the motor can hold the running torque it will start the load — Breakaway torque, cold grease and starting against pressure may need far more.'
  ],
  formulas: [
    {
      name: 'Power from torque and speed',
      expr: 'P = T*w', tex: 'P = T\\,\\omega',
      vars: {
        P: { name: 'mechanical power', q: 'power', unit: 'kW' },
        T: { name: 'torque', q: 'torque', unit: 'N·m', value: 49.4 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 1450, tex: '\\omega' }
      },
      stories: { P: 'A load needs {T} at {w}. What power is that?', T: 'A {P} motor runs at {w}. What torque does it give?' }
    },
    {
      name: 'Torque of a fan or centrifugal pump',
      expr: 'T = Tn*(n/nn)^2', tex: 'T = T_n \\left(\\dfrac{n}{n_n}\\right)^2',
      vars: {
        T: { name: 'torque at the new speed', q: 'torque', unit: 'N·m' },
        Tn: { name: 'torque at the rated speed', q: 'torque', unit: 'N·m', value: 49.4, tex: 'T_n' },
        n: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 1160 },
        nn: { name: 'rated speed', q: 'angvel', unit: 'rpm', value: 1450, tex: 'n_n' }
      },
      stories: { T: 'A fan needs {Tn} at {nn}. What torque does it need at {n}?' }
    },
    {
      name: 'Power of a fan or centrifugal pump',
      expr: 'P = Pn*(n/nn)^3', tex: 'P = P_n \\left(\\dfrac{n}{n_n}\\right)^3',
      vars: {
        P: { name: 'power at the new speed', q: 'power', unit: 'kW' },
        Pn: { name: 'power at the rated speed', q: 'power', unit: 'kW', value: 7.5, tex: 'P_n' },
        n: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 1160 },
        nn: { name: 'rated speed', q: 'angvel', unit: 'rpm', value: 1450, tex: 'n_n' }
      },
      note: 'The affinity law for the same fan or pump in the same system; static head (a pump lifting water) makes the real saving smaller.',
      stories: { P: 'A fan takes {Pn} at {nn}. What does it take at {n}?', n: 'A {Pn} fan at {nn} must be slowed to take only {P}. To what speed?' }
    },
    {
      name: 'Torque of a centre winder',
      expr: 'T = F*D/2', tex: 'T = \\dfrac{F\\,D}{2}',
      vars: {
        T: { name: 'winder torque', q: 'torque', unit: 'N·m' },
        F: { name: 'web tension', q: 'force', unit: 'N', value: 200 },
        D: { name: 'roll diameter', q: 'length', unit: 'mm', value: 500 }
      },
      note: 'At constant web speed the roll speed falls as 1/D, so torque × speed (the power) stays constant.',
      stories: { T: 'A winder holds {F} of web tension on a roll {D} across. What torque does it need?' }
    },
    {
      name: 'Friction torque: Coulomb plus viscous',
      expr: 'T = Tc + b*w', tex: 'T = T_c + b\\,\\omega',
      vars: {
        T: { name: 'friction torque', q: 'torque', unit: 'N·m' },
        Tc: { name: 'Coulomb (dry) friction torque', q: 'torque', unit: 'N·m', value: 2, tex: 'T_c' },
        b: { name: 'viscous friction coefficient', unit: 'N·m·s/rad', value: 0.01 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 1000, tex: '\\omega' }
      },
      note: 'For positive speed; the dry part changes sign with direction, and breakaway (static) friction is higher still.',
      stories: { T: 'A machine has {Tc} of dry friction and a viscous coefficient of {b}. What friction torque does it have at {w}?' }
    }
  ],
  examples: [
    {
      title: 'Slowing a fan',
      q: 'A fan takes 7.5 kW and 49.4 N·m at 1450 rpm. A VFD slows it to 80 % speed (1160 rpm). What torque and power does it need now?',
      steps: [
        'Torque: $49.4 \\times 0.8^2 = 31.6$ N·m.',
        'Power: $7.5 \\times 0.8^3 = 3.84$ kW — about half, for 80 % of the airflow.'
      ],
      a: '31.6 N·m and 3.84 kW.'
    },
    {
      title: 'A winder is a constant-power load',
      q: 'A winder pulls a web at 2 m/s with 200 N of tension; the roll grows from 100 mm to 500 mm. Find the speed, torque and power at both ends.',
      steps: [
        'Empty: $n = v/(\\pi D) = 2/(\\pi \\times 0.1) = 6.37$ rev/s = 382 rpm; $T = 200 \\times 0.05 = 10$ N·m.',
        'Full: $n = 2/(\\pi \\times 0.5) = 76$ rpm; $T = 200 \\times 0.25 = 50$ N·m.',
        'Power $F v = 400$ W at both ends. A constant-torque motor would have to be rated for 50 N·m at 382 rpm = 2 kW.'
      ],
      a: '382 rpm and 10 N·m empty; 76 rpm and 50 N·m full; 400 W throughout.'
    },
    {
      title: 'Energy returned by a hoist',
      q: 'A hoist lowers 500 kg at a steady 0.5 m/s. How much power does it return to the drive (before losses)?',
      steps: [
        '$P = m g v = 500 \\times 9.81 \\times 0.5 = 2450$ W.',
        'After gearbox and motor losses perhaps 2 kW reaches the drive\'s DC bus — a braking resistor must burn it, or a regenerative drive must return it to the mains.'
      ],
      a: 'About 2.5 kW.'
    }
  ],
  quiz: [
    { q: 'A centrifugal pump is slowed to half speed. Roughly what fraction of its full-speed power does it need?', choices: ['An eighth', 'A half', 'A quarter', 'The same'], a: 0, why: 'Power goes as the cube of speed for fans and centrifugal pumps: (1/2)³ = 1/8 (less saving if there is static head).' },
    { q: 'Which of these is a constant-power load?', choices: ['A centre winder at constant web speed and tension', 'A belt conveyor', 'A centrifugal fan', 'A flywheel at constant speed'], a: 0, why: 'Torque grows with the roll diameter while speed falls in proportion, so their product stays constant.' },
    { q: 'A hoist lowering its load at constant speed takes power from its motor.', a: false, why: 'Gravity drives the load down; the motor holds it back and works as a generator, returning energy.' },
    { q: 'Which load needs full torque right from standstill?', choices: ['A loaded conveyor', 'A centrifugal fan', 'A centrifugal pump with an open valve', 'A spindle cutting at high speed'], a: 0, why: 'A conveyor\'s torque is roughly constant at every speed, and breakaway friction adds to it at start.' },
    { q: 'A motor gives 11 kW at 1470 rpm. What is its torque?', answer: 71.5, unit: 'N·m', why: 'T = P/ω = 11 000/(1470 × 2π/60) = 11 000/153.9 = 71.5 N·m.' }
  ],
  problems: [
    { q: 'A 15 kW fan at 1470 rpm is slowed to 1100 rpm. What power does it need now (fan laws)?', answer: 6.29, unit: 'kW', tol: 0.01, steps: ['$P = 15 \\times (1100/1470)^3 = 15 \\times 0.419 = 6.29$ kW.'] },
    { q: 'A winder holds 150 N of tension on a roll 800 mm across. What torque does it need?', answer: 60, unit: 'N·m', tol: 0.01, steps: ['$T = F D/2 = 150 \\times 0.8/2 = 60$ N·m.'] }
  ],
  choose: {
    good: [
      'Classify every load before sizing: it tells you where the torque is needed.',
      'Variable-torque (normal-duty) drive ratings for fans and centrifugal pumps; speed control instead of throttling.',
      'Motors and drives with a constant-power range for winders and spindles.'
    ],
    avoid: [
      'Sizing a winder at its power alone — the torque at the smallest speed sets the motor.',
      'Normal-duty drive ratings on conveyors, hoists and positive-displacement pumps.',
      'Forgetting the regenerated energy of overhauling loads and fast stops.'
    ],
    check: [
      'Breakaway and starting torque, in the cold and under full load.',
      'Torque at the lowest speed (and motor cooling there) and at the highest speed.',
      'Which quadrants the load uses; braking energy, braking resistor or regeneration; the holding brake.',
      'Peak torques and the duty cycle for the RMS check.'
    ]
  },
  applications: [
    'Fans, pumps and blowers on VFDs saving energy through the cube law.',
    'Winders, unwinders and machine-tool spindles using the constant-power range of their drives.',
    'Cranes, lifts and hoists with four-quadrant drives, braking resistors or regeneration and holding brakes; see the [hoist](#/tools/sizing/hoist), [conveyor](#/tools/sizing/conveyor) and [pump and fan](#/tools/sizing/pumpfan) sizing tools.'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: the chapter on motor and drive selection — load characteristics, constant-torque and constant-power operation.',
    'Mohan, *Electric Drives: An Integrative Approach*: the mechanical requirements of drives — load torques and four-quadrant operation.',
    'IEC 61800-2, *Adjustable speed electrical power drive systems — General requirements — Rating specifications for low voltage adjustable speed a.c. power drive systems*.'
  ],
  sim: 'mx-loads'
},

{
  id: 'inertia-reflected', parent: 'motion-sizing', title: 'Reflected inertia', level: 2,
  short: 'A load\'s inertia, seen from the motor through a ratio i, is divided by i²; a mass moving on a screw of lead p looks like m(p/2π)². The ratio of that reflected inertia to the motor\'s own rotor inertia decides how much torque an acceleration takes and how well a servo can control the load.',
  keywords: ['reflected inertia', 'moment of inertia', 'inertia ratio', 'inertia mismatch', 'load inertia', 'rotor inertia', 'optimum gear ratio', 'acceleration torque', 'equivalent inertia', 'kg·cm²', 'screw inertia', 'pulley inertia'],
  prereq: ['gearboxes', 'physics:moment-of-inertia', 'physics:rotational-dynamics'],
  related: ['lead-ball-screws', 'rack-pinion-linear', 'motion-profiles', 'inertia-matching', 'servo-tuning', 'motor-selection-method', 'couplings-alignment', 'physics:rotational-kinetic-energy'],
  body: `
To accelerate a load the motor must accelerate everything that turns or slides: its own rotor, the coupling, the gearbox, the screw or pulley, and the load itself. Seen from the motor shaft, each of these looks like an inertia — and the transmission changes how big it looks.

### Through a ratio: divide by i²
Through a gearbox of ratio $i$ the motor turns $i$ times faster than the load. The load's kinetic energy is the same whichever shaft you count it on, $\\tfrac12 J_L\\omega_L^2 = \\tfrac12 J_{\\text{ref}}\\,\\omega_m^2$, so

$$J_{\\text{ref}} = \\frac{J_L}{i^2}$$

(divided further by the efficiency when the motor accelerates the load). A 2 kg·m² turntable is 20 000 kg·cm² on its own shaft, 50 kg·cm² through 20:1 and 8 kg·cm² through 50:1. The [[?exponent|square]] makes the ratio the most powerful tool in sizing.

### Linear masses
A mass $m$ moving in a straight line looks like a rotating inertia:
- **on a screw** of lead $p$: $J = m\\,(p/2\\pi)^2$ — 20 kg on a 10 mm lead is only 0.51 kg·cm²;
- **on a belt pulley, pinion or drum** of radius $r$: $J = m\\,r^2$ — the same 20 kg on a 30 mm pulley radius is 180 kg·cm², 350 times more.

Screws are tiny "gear ratios" (a 10 mm lead is like a pulley of 1.6 mm radius), which is why they suit heavy precise loads, and why belt and rack axes usually need a gearbox.

### The parts people forget
Inertia of a solid cylinder is $J = m r^2/2 = \\pi\\rho L d^4/32$ — the diameter to the **fourth power**. A steel ball screw 16 mm × 1 m is 0.5 kg·cm², the same as a 400 W servo rotor; a 32 mm screw is 16 times more. An aluminium pulley 60 mm across and 30 mm wide is about 1 kg·cm²; couplings and gearbox input stages add tenths of kg·cm² to several kg·cm². Add them all.

| Motor | Rotor inertia (typical) |
|---|---|
| 100 W low-inertia AC servo | 0.03–0.1 kg·cm² |
| 400 W low-inertia AC servo | 0.3–0.7 kg·cm² |
| 750 W low-inertia AC servo | 1–1.5 kg·cm² |
| 2 kW medium-inertia AC servo | 5–30 kg·cm² |
| NEMA 23 hybrid stepper, 56 mm long | 0.2–0.5 kg·cm² |
| 1.5 kW 4-pole induction motor | 30–50 kg·cm² |

### Torque to accelerate
The motor's torque while accelerating at $\\alpha_m$ is
$$T = (J_m + J_{\\text{ref}})\\,\\alpha_m + \\frac{T_L}{i\\,\\eta}$$
— often the inertial part is far larger than the load torque.

### The inertia ratio
$\\lambda = J_{\\text{ref}}/J_m$ says how much the motor is "outweighed". Rough guidance for servo axes: up to about 5–10 settles quickly and tunes easily; 10–30 needs stiff couplings, gearboxes without backlash and careful tuning; far beyond that the load oscillates against the motor through every spring in the drive train, and settling suffers ([[inertia-matching]], [[servo-tuning]]). Stiff direct drives tolerate more; springy belts and elastomer couplings less. Steppers lose steps and resonate with large ratios too.

### The best ratio
For a purely inertial load accelerated at $\\alpha_L$, the motor torque is $(J_m i + J_L/i)\\,\\alpha_L$, least when
$$i^* = \\sqrt{J_L/J_m}$$
— the ratio at which the reflected inertia equals the rotor's. The minimum is flat, and the motor's top speed usually caps the ratio below $i^*$: choose the highest ratio the speed allows, and check the inertia ratio.

In the simulation, change the gear ratio and load: watch the torque curve's minimum at $i^*$, the speed limit, and how the load rings after each index when the inertia ratio is large.

> [!key] Refer every inertia to the motor: divide by i² through gears, use m(p/2π)² on a screw and m r² on a pulley. Then check two numbers: the torque to accelerate, and the inertia ratio.
`,
  ideas: [
    'Through a ratio i, the load\'s inertia at the motor is J_L/i² (and /η while accelerating).',
    'A linear mass looks like m(p/2π)² on a screw and m r² on a pulley or pinion.',
    'Inertia grows with the fourth power of diameter: screws, pulleys and couplings are not negligible.',
    'The inertia ratio J_ref/J_m governs servo stability and settling; about 5–10 is comfortable.',
    'The torque-optimal ratio is √(J_L/J_m); the motor\'s maximum speed usually sets the ratio lower.'
  ],
  pitfalls: [
    'The load inertia at the motor is J_L/i — Energy is conserved and speeds scale by i, so inertia scales by i².',
    'An inertia ratio of 1 is required — It minimises torque for pure inertia, but larger ratios work well with stiff mechanics and good tuning; the limit depends on stiffness.',
    'Only the load\'s mass counts — Screws, pulleys, couplings and gearbox stages often add as much inertia as the load.'
  ],
  formulas: [
    {
      name: 'Inertia reflected through a ratio',
      expr: 'Jr = JL/(i^2*eta)', tex: 'J_{\\mathrm{ref}} = \\dfrac{J_L}{i^2\\,\\eta}',
      vars: {
        Jr: { name: 'inertia seen by the motor', q: 'inertia', unit: 'kg·cm²', tex: 'J_{\\mathrm{ref}}' },
        JL: { name: 'load inertia on its own shaft', q: 'inertia', unit: 'kg·m²', value: 2, tex: 'J_L' },
        i: { name: 'gear ratio', value: 50 },
        eta: { name: 'transmission efficiency (100 % for the energy view)', q: 'ratio', unit: '%', value: 95, tex: '\\eta' }
      },
      stories: { Jr: 'A {JL} turntable is driven through a {i}:1 gearbox of efficiency {eta}. What inertia does the motor see?', i: 'A {JL} load must look like {Jr} at the motor (efficiency {eta}). What ratio is needed?' }
    },
    {
      name: 'A mass on a screw',
      expr: 'J = m*(p/(2*pi))^2', tex: 'J = m \\left(\\dfrac{p}{2\\pi}\\right)^2',
      vars: {
        J: { name: 'equivalent inertia at the screw', q: 'inertia', unit: 'kg·cm²' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 20 },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 10 }
      },
      stories: { J: 'A {m} carriage rides on a screw with a {p} lead. What inertia does it add at the screw?' }
    },
    {
      name: 'A mass on a pulley, pinion or drum',
      expr: 'J = m*r^2', tex: 'J = m\\, r^2',
      vars: {
        J: { name: 'equivalent inertia at the pulley', q: 'inertia', unit: 'kg·cm²' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 20 },
        r: { name: 'pitch radius', q: 'length', unit: 'mm', value: 30 }
      },
      stories: { J: 'A {m} carriage is pulled by a belt on a pulley of radius {r}. What inertia does it add at the pulley?' }
    },
    {
      name: 'Torque-optimal gear ratio',
      expr: 'i = sqrt(JL/Jm)', tex: 'i^* = \\sqrt{\\dfrac{J_L}{J_m}}',
      vars: {
        i: { name: 'optimal ratio', tex: 'i^*' },
        JL: { name: 'load inertia', q: 'inertia', unit: 'kg·m²', value: 2, tex: 'J_L' },
        Jm: { name: 'motor rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 1.2, tex: 'J_m' }
      },
      note: 'For a pure inertia load; the minimum is flat, and the motor\'s speed limit often sets a lower ratio.',
      stories: { i: 'A {JL} load is driven by a motor of rotor inertia {Jm}. Which gear ratio needs the least torque to accelerate it?' }
    },
    {
      name: 'Inertia of a solid cylinder (shaft, screw, roller)',
      expr: 'J = pi*rho*L*d^4/32', tex: 'J = \\dfrac{\\pi\\,\\rho\\, L\\, d^4}{32}',
      vars: {
        J: { name: 'moment of inertia', q: 'inertia', unit: 'kg·cm²' },
        rho: { name: 'density (steel 7850, aluminium 2700)', q: 'density', unit: 'kg/m³', value: 7850, tex: '\\rho' },
        L: { name: 'length', q: 'length', unit: 'mm', value: 1000 },
        d: { name: 'diameter', q: 'length', unit: 'mm', value: 16 }
      },
      stories: { J: 'What is the inertia of a {d} steel screw {L} long?', d: 'A steel roller {L} long may have at most {J} of inertia. How thick may it be?' }
    }
  ],
  derivation: {
    title: 'The optimal gear ratio',
    steps: [
      { text: 'The load must turn with angular acceleration $\\alpha_L$; the motor then accelerates at $i\\,\\alpha_L$. Its torque accelerates its own rotor and the reflected load:', tex: 'T = \\left(J_m + \\frac{J_L}{i^2}\\right) i\\,\\alpha_L = \\left(J_m\\, i + \\frac{J_L}{i}\\right)\\alpha_L' },
      { text: 'A small ratio makes the load term large; a large ratio makes the motor spin its own rotor ever faster. Set the [[?derivative|derivative]] with respect to $i$ to zero:', tex: '\\frac{dT}{di} = \\left(J_m - \\frac{J_L}{i^2}\\right)\\alpha_L = 0' },
      { text: 'So the best ratio makes the reflected load inertia equal to the rotor inertia — "matched inertia":', tex: 'i^* = \\sqrt{\\frac{J_L}{J_m}}, \\qquad \\frac{J_L}{i^{*2}} = J_m' },
      { text: 'At the optimum the torque is $2\\alpha_L\\sqrt{J_m J_L}$. Halving or doubling the ratio raises it by only 25 %, so the speed limit and the price usually choose the ratio in the end.' }
    ]
  },
  examples: [
    {
      title: 'Everything on a ball-screw axis',
      q: 'A 20 kg carriage rides on a 16 mm × 1 m steel ball screw with a 10 mm lead, through a coupling of 0.1 kg·cm², driven by a motor of 0.3 kg·cm². What is the inertia ratio?',
      steps: [
        'Carriage: $20 \\times (0.01/2\\pi)^2 = 5.07 \\times 10^{-5}$ kg·m² = 0.51 kg·cm².',
        'Screw: $\\pi \\times 7850 \\times 1 \\times 0.016^4/32 = 5.05 \\times 10^{-5}$ kg·m² = 0.51 kg·cm².',
        'Load total $0.51 + 0.51 + 0.1 = 1.1$ kg·cm²; ratio $1.1/0.3 = 3.7$ — comfortable. Note that the screw weighs as much, in inertia, as the carriage.'
      ],
      a: 'About 1.1 kg·cm² of load against 0.3 kg·cm²: an inertia ratio of about 3.7.'
    },
    {
      title: 'Choosing a ratio for a turntable',
      q: 'A 2 kg·m² turntable must turn at up to 60 rpm. The servo has 1.2 kg·cm² of rotor inertia and a maximum speed of 3000 rpm. Compare ratios of 20 and 50, and the optimum.',
      steps: [
        '20:1 — $2/400 = 0.005$ kg·m² = 50 kg·cm²: inertia ratio 42, too high for crisp settling.',
        '50:1 — $2/2500 = 8$ kg·cm²: ratio 6.7. Motor speed $60 \\times 50 = 3000$ rpm — just within the limit.',
        'Optimum $\\sqrt{2/1.2 \\times 10^{-4}} = 129$ would need 7740 rpm: not possible. Choose 50:1.',
        'To accelerate the table at 10 rad/s²: $\\alpha_m = 500$ rad/s², $T = (1.2 + 8) \\times 10^{-4} \\times 500 = 0.46$ N·m (plus losses).'
      ],
      a: '50:1 — inertia ratio about 6.7 at 3000 rpm; 0.46 N·m to accelerate at 10 rad/s².'
    }
  ],
  quiz: [
    { q: 'Through a 10:1 gearbox, the load inertia seen by the motor is…', choices: ['1/100 of the load inertia', '1/10 of it', '10 times it', 'unchanged'], a: 0, why: 'Speeds scale by i, kinetic energy is shared, so inertia scales by 1/i² = 1/100.' },
    { q: 'You double the diameter of a steel roller of the same length. Its inertia becomes…', choices: ['16 times larger', '4 times larger', '8 times larger', '2 times larger'], a: 0, why: 'J = πρLd⁴/32: the mass grows as d² and the radius squared as d² again.' },
    { q: 'A servo will not work unless the inertia ratio is exactly 1.', a: false, why: 'Ratio 1 minimises accelerating torque for a pure inertia; servos work well at ratios of 5–10 and more with stiff mechanics and good tuning.' },
    { q: 'A 50 kg carriage rides on a ball screw with a 20 mm lead. What inertia does it add at the screw?', answer: 5.07, unit: 'kg·cm²', why: 'J = m (p/2π)² = 50 × (0.02/2π)² = 5.07 × 10⁻⁴ kg·m² = 5.07 kg·cm².' },
    { q: 'A load of 0.01 kg·m² and a motor of 1 kg·cm²: which gear ratio needs the least torque to accelerate the load?', choices: ['10', '100', '1', '√10'], a: 0, why: 'i* = √(J_L/J_m) = √(0.01/0.0001) = √100 = 10.' }
  ],
  problems: [
    { q: 'A 0.5 kg·m² load is driven through a 25:1 gearbox (take η = 1). What inertia does the motor see, in kg·cm²?', answer: 8, unit: 'kg·cm²', tol: 0.01, steps: ['$J = 0.5/25^2 = 8 \\times 10^{-4}$ kg·m² = 8 kg·cm².'] },
    { q: 'A 12 kg carriage is pulled by a belt on a pulley of 25 mm pitch radius. What inertia does it add at the pulley?', answer: 75, unit: 'kg·cm²', tol: 0.01, steps: ['$J = m r^2 = 12 \\times 0.025^2 = 7.5 \\times 10^{-3}$ kg·m² = 75 kg·cm².', 'With a 1 kg·cm² motor that is a ratio of 75 — a 5:1 gearbox would bring it to 3.'] }
  ],
  choose: {
    good: [
      'Use a gear ratio to bring a heavy load\'s reflected inertia within about 5–10 times the rotor inertia.',
      'Screws for heavy, precise linear loads: their small effective radius keeps the reflected inertia low.',
      'Direct drive (torque motors) where the mechanics are very stiff and backlash is unacceptable.'
    ],
    avoid: [
      'Belt or rack axes with heavy carriages driven directly by a small low-inertia motor.',
      'Forgetting screws, pulleys, couplings and gearbox input inertias.',
      'Ratios so high that the motor\'s speed limit is exceeded at the load\'s top speed.'
    ],
    check: [
      'The inertia of every rotating and moving part, referred to the motor.',
      'The accelerating torque at your acceleration against the motor\'s peak torque.',
      'The inertia ratio against the drive maker\'s guidance and the stiffness of your mechanics.',
      'The motor speed at the chosen ratio.'
    ]
  },
  applications: [
    'Servo sizing for indexing tables, robot joints and conveyor axes: [the axis sizing tool](#/tools/sizing/axis) refers every inertia to the motor.',
    'Choosing a ball-screw lead or a pulley diameter for a linear axis.',
    'Explaining why a lightly geared heavy table rings after every move and a higher ratio cures it.'
  ],
  sources: [
    'Mohan, *Electric Drives: An Integrative Approach*: the mechanical requirements of drives — coupling mechanisms, reflected inertia and the optimum gear ratio.',
    'Hughes and Drury, *Electric Motors and Drives*: the chapter on motor and drive selection — inertia matching and gearing.',
    'NEMA ICS 16, motion and position control motors, controls and feedback devices.'
  ],
  sim: 'mx-inertia'
},

{
  id: 'motion-profiles', parent: 'motion-sizing', title: 'Motion profiles: trapezoidal and S-curve', level: 2,
  short: 'A point-to-point move is planned as a velocity profile: accelerate, cruise, decelerate. The trapezoid is the standard, the triangle what remains of it on short moves, and the S-curve limits the jerk so the machine does not ring. The profile sets the peak speed, the peak and RMS torque, and how much everything shakes.',
  keywords: ['motion profile', 'trapezoidal profile', 'triangular profile', 'S-curve', 'jerk', 'acceleration', 'deceleration', 'ramp', 'point-to-point move', 'move time', 'one-third rule', 'residual vibration', 'settling', 'input shaping', 'cycloidal motion'],
  prereq: ['physics:constant-acceleration', 'inertia-reflected', 'math:derivative'],
  related: ['rms-torque-sizing', 'motor-selection-method', 'servo-tuning', 'following-error', 'vfd-parameters', 'homing-routines', 'rack-pinion-linear', 'physics:damped-oscillations'],
  body: `
A machine axis rarely just "runs": it moves a distance $d$ in a time $t$ and stops. How the velocity rises and falls on the way — the **motion profile** — decides the peak speed the motor must reach, the acceleration (and so the torque, $T = J\\alpha + T_L$), the heat (the RMS torque, [[rms-torque-sizing]]) and how much the machine and its load shake. Position, velocity, acceleration and jerk are each the [[?derivative|derivative]] of the one before.

### Trapezoid and triangle
The standard profile accelerates at a constant $a$ to the speed $v$, cruises, and decelerates at the same rate: its velocity graph is a trapezoid. Accelerating takes $v/a$ and covers $v^2/2a$, so the whole move takes

$$t = \\frac{d}{v} + \\frac{v}{a}$$

If the move is too short to reach $v$ (when $d < v^2/a$), the cruise vanishes and the profile becomes a **triangle** peaking at $v_p = \\sqrt{d\\,a}$ after $\\sqrt{d/a}$. A 300 mm move at 0.5 m/s and 5 m/s² takes 0.7 s (0.1 s accelerating over 25 mm, 0.5 s cruising, 0.1 s braking); a 20 mm move with the same settings is a triangle peaking at 0.32 m/s after 63 ms.

Doubling the acceleration does *not* halve the move time: it only shortens the ramps. On long moves the speed limit dominates; on short ones the acceleration does.

### The one-third rule
When the time is fixed (a machine cycle), which trapezoid is best? Split the move into equal thirds — accelerate, cruise, decelerate — and

$$v = \\frac{3}{2}\\frac{d}{t}, \\qquad a = \\frac{9}{2}\\frac{d}{t^2}$$

This trapezoid needs the **least RMS acceleration**, so it heats the motor least for a given inertia (derivation below). A triangle needs a lower acceleration ($4d/t^2$) but a 33 % higher speed ($2d/t$) and slightly more RMS torque.

| Profile (move $d$ in $t$) | Peak speed | Peak acceleration | Smoothness | Typical use |
|---|---|---|---|---|
| Triangle | $2d/t$ | $4d/t^2$ | acceleration flips at mid-move | short moves |
| Trapezoid, ⅓–⅓–⅓ | $1.5\\,d/t$ | $4.5\\,d/t^2$ | acceleration steps at 4 corners | the default point-to-point move |
| S-curve (jerk-limited) | a little above $1.5\\,d/t$ | a little higher for the same time | no steps in acceleration | tall or flexible machines, liquids, belts, fragile parts, lifts |
| Cycloidal (sine acceleration) | $2d/t$ | $2\\pi d/t^2$ | smooth everywhere | cams and mechanical indexers |

### Jerk and the S-curve
Every machine is masses on springs: a belt, a tall column, a gripper on a long arm, liquid in a cup. A trapezoid changes its acceleration instantly — infinite **jerk** — which hits those springs like a hammer, and the load rings at its natural frequency after the axis has stopped. The **S-curve** ramps the acceleration up and down at a limited jerk $j$ (m/s³), rounding every corner of the velocity graph. The price is time: with both the speed and the acceleration reached,

$$t = \\frac{d}{v} + \\frac{v}{a} + \\frac{a}{j}$$

so 300 mm at 0.5 m/s, 5 m/s² and 100 m/s³ takes 0.75 s instead of 0.7 s. The reward: much less residual vibration, quieter gears and belts, less wear. When the jerk time $a/j$ equals one period of the main resonance (or a multiple of it), the ringing largely cancels — the idea behind the "input shaping" some drives offer.

### In drives and controllers
Servo and stepper controllers take the profile as maximum speed, acceleration, deceleration and a jerk or S-ramp setting (acceleration may be given in rpm/s, in m/s², or as milliseconds per 1000 rpm). VFDs set ramps as the time from zero to base frequency, with an optional S-ramp ([[vfd-parameters]]). Deceleration may need to be gentler than acceleration where the drive cannot absorb the braking energy.

> [!warn] Fast profiles make axes move quickly and silently. Tune and test moves at reduced speed first, with guards, limit switches and emergency stops working, and keep people out of the working range.

In the simulation, compare the trapezoid and the S-curve on a carriage carrying a springy payload: watch the velocity and acceleration graphs and how much the payload keeps swinging after the stop.

> [!key] The profile is part of the design: the trapezoid (⅓–⅓–⅓) minimises heating, the triangle takes over on short moves, and an S-curve trades a little time for a machine that stops quietly.
`,
  ideas: [
    'A trapezoidal move takes d/v + v/a; short moves become triangles peaking at √(d·a).',
    'For a fixed move time, equal thirds (accelerate, cruise, decelerate) give the least RMS torque.',
    'Jerk — the rate of change of acceleration — excites the springs of the machine; S-curves limit it.',
    'An S-curve adds about a/j to the move time and removes most of the residual vibration.',
    'Doubling the acceleration shortens only the ramps, not the whole move.'
  ],
  pitfalls: [
    'Doubling the acceleration halves the move time — Only the ramp time shrinks; a move limited by speed barely changes.',
    'The fastest profile is always a triangle — For a fixed time the triangle needs a higher peak speed and more RMS torque than the one-third trapezoid.',
    'S-curves are only for comfort — They reduce residual vibration and settling time, so the total cycle can be shorter despite the longer move.'
  ],
  formulas: [
    {
      name: 'Time of a trapezoidal move',
      expr: 't = d/v + v/a', tex: 't = \\dfrac{d}{v} + \\dfrac{v}{a}',
      vars: {
        t: { name: 'move time', q: 'time', unit: 's' },
        d: { name: 'distance', q: 'length', unit: 'mm', value: 300 },
        v: { name: 'cruise speed', q: 'speed', unit: 'm/s', value: 0.5 },
        a: { name: 'acceleration (= deceleration)', q: 'accel', unit: 'm/s²', value: 5 }
      },
      note: 'Valid while d ≥ v²/a; shorter moves are triangles.',
      stories: { t: 'An axis moves {d} with a speed limit of {v} and an acceleration of {a}. How long does the move take?', a: 'A move of {d} at {v} must take {t}. What acceleration is needed?' }
    },
    {
      name: 'Peak speed of a triangular move',
      expr: 'v = sqrt(d*a)', tex: 'v_p = \\sqrt{d\\, a}',
      vars: {
        v: { name: 'peak speed', q: 'speed', unit: 'm/s', tex: 'v_p' },
        d: { name: 'distance', q: 'length', unit: 'mm', value: 20 },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 5 }
      },
      stories: { v: 'A short move of {d} accelerates at {a} and never reaches its speed limit. What peak speed does it reach?' }
    },
    {
      name: 'The one-third trapezoid',
      expr: 'a = 4.5*d/t^2', tex: 'a = \\dfrac{9}{2}\\,\\dfrac{d}{t^2}',
      vars: {
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²' },
        d: { name: 'distance', q: 'length', unit: 'mm', value: 400 },
        t: { name: 'move time', q: 'time', unit: 's', value: 0.8 }
      },
      note: 'Accelerate, cruise and decelerate for a third of the time each; the cruise speed is 1.5 d/t.',
      stories: { a: 'An axis must move {d} in {t} with equal thirds of accelerating, cruising and braking. What acceleration does it need?' }
    },
    {
      name: 'Time of an S-curve move',
      expr: 't = d/v + v/a + a/j', tex: 't = \\dfrac{d}{v} + \\dfrac{v}{a} + \\dfrac{a}{j}',
      vars: {
        t: { name: 'move time', q: 'time', unit: 's' },
        d: { name: 'distance', q: 'length', unit: 'mm', value: 300 },
        v: { name: 'cruise speed', q: 'speed', unit: 'm/s', value: 0.5 },
        a: { name: 'maximum acceleration', q: 'accel', unit: 'm/s²', value: 5 },
        j: { name: 'jerk limit', unit: 'm/s³', value: 100 }
      },
      note: 'When the move reaches both its speed and its acceleration limits; the jerk ramps add a/j.',
      stories: { t: 'A move of {d} is limited to {v}, {a} and a jerk of {j}. How long does it take?', j: 'A move of {d} at {v} and {a} may take at most {t}. What jerk limit allows that?' }
    }
  ],
  derivation: {
    title: 'Why equal thirds heat the motor least',
    steps: [
      { text: 'Let the ramps take a fraction $f$ of the move time $t$ each. The cruise speed must then cover the distance: $d = v\\,(1 - f)\\,t$, and the acceleration is $a = v/(f t)$.', tex: 'a = \\frac{d}{f(1-f)\\,t^2}' },
      { text: 'For a pure inertia the torque is proportional to the acceleration, and the heating to the mean of its square. The acceleration acts during $2ft$ of the time $t$:', tex: 'a_{\\mathrm{rms}}^2 = a^2 \\cdot 2f = \\frac{2\\,d^2}{f(1-f)^2\\, t^4}' },
      { text: 'Minimise by making $f(1-f)^2$ as large as possible: its derivative $(1-f)(1-3f)$ is zero at $f = 1/3$.', tex: 'f = \\tfrac13 \\;\\Rightarrow\\; v = \\frac{3d}{2t},\\quad a = \\frac{9d}{2t^2}' },
      { text: 'Its RMS acceleration is $4.5\\sqrt{2/3} = 3.67\\,d/t^2$ against $4\\,d/t^2$ for the triangle — about 8 % less torque-heating for the same move.' }
    ]
  },
  examples: [
    {
      title: 'A trapezoid, then an S-curve',
      q: 'An axis moves 300 mm with a 0.5 m/s speed limit and 5 m/s² of acceleration. How long does it take as a trapezoid, and as an S-curve with a jerk of 100 m/s³?',
      steps: [
        'Ramp time $0.5/5 = 0.1$ s; ramp distance $0.5^2/(2 \\times 5) = 25$ mm each, leaving 250 mm to cruise in 0.5 s.',
        'Trapezoid: $t = 0.3/0.5 + 0.5/5 = 0.7$ s.',
        'S-curve: $t = 0.7 + 5/100 = 0.75$ s — 50 ms longer, but with no steps in acceleration.'
      ],
      a: '0.70 s as a trapezoid; 0.75 s as an S-curve.'
    },
    {
      title: 'A short move',
      q: 'The same axis moves only 20 mm. What profile results, and how long does it take?',
      steps: [
        'To reach 0.5 m/s it would need $0.5^2/5 = 50$ mm: more than 20 mm, so it is a triangle.',
        '$v_p = \\sqrt{0.02 \\times 5} = 0.316$ m/s, reached after $0.316/5 = 63$ ms; the whole move takes 126 ms.'
      ],
      a: 'A triangle peaking at 0.32 m/s, 0.13 s in all.'
    },
    {
      title: 'Planning a move in a fixed time',
      q: 'A transfer must move 400 mm in 0.8 s. Find the speed and acceleration with the one-third rule, and compare with a triangle.',
      steps: [
        'One-third: $v = 1.5 \\times 0.4/0.8 = 0.75$ m/s; $a = 4.5 \\times 0.4/0.8^2 = 2.81$ m/s², for 0.267 s at each end.',
        'Triangle: $v = 2 \\times 0.4/0.8 = 1.0$ m/s, $a = 4 \\times 0.4/0.64 = 2.5$ m/s² — less acceleration, but 33 % more speed (a faster motor or a longer lead) and slightly more heat.'
      ],
      a: '0.75 m/s and 2.81 m/s² (triangle: 1.0 m/s and 2.5 m/s²).'
    }
  ],
  quiz: [
    { q: 'An axis never reaches its programmed speed on a short move. Its velocity profile is…', choices: ['a triangle', 'a trapezoid', 'an S-curve', 'constant'], a: 0, why: 'The ramps meet before the speed limit: accelerate, then immediately decelerate.' },
    { q: 'What is the main benefit of an S-curve over a trapezoid?', choices: ['It limits jerk, so the machine and load vibrate much less after the move', 'It always shortens the move', 'It lowers the peak speed to half', 'It needs no acceleration setting'], a: 0, why: 'Rounded acceleration corners excite the machine\'s resonances far less; the move itself gets slightly longer.' },
    { q: 'Doubling the acceleration of a long, speed-limited move halves its duration.', a: false, why: 't = d/v + v/a: only the second term halves. For 300 mm at 0.5 m/s, going from 5 to 10 m/s² saves just 50 ms of 0.7 s.' },
    { q: 'A move of 200 mm at a 0.4 m/s limit and 4 m/s²: how long does it take?', answer: 0.6, unit: 's', why: 't = 0.2/0.4 + 0.4/4 = 0.5 + 0.1 = 0.6 s (it reaches its speed: 200 mm > 0.4²/4 = 40 mm).' },
    { q: 'For a move of fixed distance and time, which trapezoid needs the least RMS torque (pure inertia)?', choices: ['Equal thirds: accelerate, cruise, decelerate', 'A triangle', 'Very short ramps and a long cruise', 'Very long ramps and a short cruise'], a: 0, why: 'Minimising f(1 − f)² gives f = 1/3; short ramps need huge accelerations, long ramps a high speed and long accelerations.' }
  ],
  problems: [
    { q: 'A pick-and-place must move 600 mm in 1.2 s using the one-third rule. What acceleration does it need?', answer: 1.875, unit: 'm/s²', tol: 0.01, steps: ['$a = 4.5\\,d/t^2 = 4.5 \\times 0.6/1.44 = 1.875$ m/s² (cruise speed $1.5 \\times 0.6/1.2 = 0.75$ m/s).'] },
    { q: 'An S-curve move of 0.5 m is limited to 1 m/s, 10 m/s² and a jerk of 200 m/s³. How long does it take?', answer: 0.65, unit: 's', tol: 0.01, steps: ['$t = d/v + v/a + a/j = 0.5 + 0.1 + 0.05 = 0.65$ s.'] }
  ],
  choose: {
    good: [
      'Trapezoids (equal thirds) for most point-to-point axes: simple and the least heating.',
      'S-curves for belts, tall or flexible structures, liquids, fragile parts and passengers.',
      'Triangles automatically on short moves; cycloidal motion for cams and indexers.'
    ],
    avoid: [
      'Instant acceleration steps on flexible machines: they ring after every move.',
      'Accelerations the motor can reach only at its peak torque for the whole ramp, with no margin.',
      'Decelerations the drive cannot absorb without a braking resistor.'
    ],
    check: [
      'Peak speed against the motor, screw critical speed and belt limits.',
      'Peak torque at the acceleration, and the RMS torque over the cycle.',
      'The machine\'s lowest resonances, and the jerk or S-ramp setting of the controller.',
      'Settling time and following error at the end of the move.'
    ]
  },
  applications: [
    'Pick-and-place, packaging and labelling machines with trapezoidal and S-curve moves.',
    'Lifts, whose acceleration and jerk are limited for passenger comfort.',
    'VFD ramps with S-shaped corners on conveyors carrying bottles or loose goods; plan your own move in [the axis sizing tool](#/tools/sizing/axis).'
  ],
  sources: [
    'Biagiotti and Melchiorri, *Trajectory Planning for Automatic Machines and Robots*: trapezoidal, double-S (jerk-limited) and cycloidal profiles, and their effect on vibration.',
    'NEMA ICS 16, motion and position control motors, controls and feedback devices.',
    'Mohan, *Electric Drives: An Integrative Approach*: motion profiles and the torque they demand.'
  ],
  sim: 'mx-profile'
},

{
  id: 'rms-torque-sizing', parent: 'motion-sizing', title: 'RMS torque and duty', level: 2,
  short: 'A motor in a machine cycle accelerates, cruises, brakes and waits. Two limits apply: the peak torque must stay inside the motor and drive\'s short-time rating, and the heat — which grows with torque squared — must average out below the continuous rating. The root-mean-square torque over the cycle is the steady torque that heats the motor the same.',
  keywords: ['RMS torque', 'root mean square', 'duty cycle', 'continuous torque', 'peak torque', 'thermal time constant', 'equivalent torque', 'dwell', 'overload', 'I²t', 'duty type', 'motor heating', 'average speed'],
  prereq: ['motion-profiles', 'inertia-reflected', 'duty-cycles'],
  related: ['motor-heating', 'motor-selection-method', 'insulation-classes', 'ac-servo-motors', 'servo-drives', 'stepper-sizing', 'electronics:rms-values'],
  body: `
A motor on a machine cycle does not give one torque: it accelerates the load, cruises against friction, brakes, then waits. Two separate limits apply.

1. **The peak**: the highest torque in the cycle must be within the motor's and the drive's short-time capability at that speed.
2. **The heat**: the winding losses are $I^2R$, and in a permanent-magnet motor the current is proportional to the torque, so the heating is proportional to $T^2$. Averaged over the cycle, the motor heats as if it gave a steady torque equal to the **root-mean-square** value ([[electronics:rms-values|RMS]]: the [[?square-root|square root]] of the [[?mean|mean]] of the squares):

$$T_{\\mathrm{rms}} = \\sqrt{\\frac{\\sum T_k^2\\, t_k}{\\sum t_k}}$$

including the dwell, at zero torque or at the holding torque. $T_{\\mathrm{rms}}$ must stay below the rated **continuous** torque, with a margin (often 10–30 %).

### A cycle worked through
A servo axis accelerates at 2.4 N·m for 0.2 s, cruises at 0.3 N·m for 0.6 s, brakes at −1.8 N·m for 0.2 s and dwells at 0.1 N·m for 1.0 s. $\\sum T^2 t = 1.152 + 0.054 + 0.648 + 0.010 = 1.864$ over 2.0 s, so $T_{\\mathrm{rms}} = 0.97$ N·m. A 400 W servo (typically 1.27 N·m continuous, 3.8 N·m peak) is at 76 % thermally and 63 % of its peak: a good fit. Remove the dwell and the RMS rises to 1.36 N·m — above the rating. **Dwell is cooling time**: every cycle with less rest runs hotter.

| Motor and drive | Continuous | Short-time peak (typical) |
|---|---|---|
| AC servo motor and servo drive | rated torque | about 3 × rated, for a second or a few |
| Induction motor on a VFD, heavy-duty rating | rated torque | about 150 % for 60 s (typically once in 10 minutes) |
| Induction motor direct on line | rated torque | breakdown torque 2–3 × rated, but only transiently |
| Brushed DC motor | rated torque | 2–5 ×, limited by commutation and the magnets |
| Stepper motor | not limited by RMS: the driver sets the current | the pull-out curve at each speed |

### When the RMS rule holds — and when not
The RMS rule assumes the cycle is **short compared with the motor's thermal time constant** — tens of minutes for the frame of an industrial motor, seconds to a minute for the winding itself. Cycles of a few seconds average perfectly. A 10-minute overload does not: the winding reaches its temperature long before the average says it should. For long cycles use a thermal model ([[motor-heating]]) or the duty types of IEC 60034-1 ([[duty-cycles]]); the drive has its own overload timer (I²t) and may trip first.

### Other checks in the same breath
- **Speed**: continuous torque falls at high speed (iron and friction losses). Check $T_{\\mathrm{rms}}$ at the cycle's mean speed, and the peak torque against the intermittent zone of the torque–speed curve at the speed where it occurs.
- **Short on-off cycles**: a motor loaded with $T$ for a fraction $D$ of a short cycle and idle the rest may carry $T = T_n/\\sqrt{D}$ thermally — twice its rating at 25 % duty — if its peak allows.
- **Induction motors**: the magnetising current heats too, so use the RMS of the *current*; starts count heavily (duty types S4 and S5).
- **Steppers**: the driver pushes its set current whatever the load, so a stepper heats the same at any torque; check the torque margin under the pull-out curve instead ([[stepper-sizing]]).
- **Braking energy** per cycle: $\\tfrac12 J\\omega^2$ from every stop goes to the drive's DC bus.
- **Environment**: above about 40 °C ambient or 1000 m altitude motors are derated.

> [!warn] A motor that runs too hot loses insulation life fast — roughly half for every 10 °C over its rating — and its surface can burn. Rely on the thermal protection (sensors, drive I²t), not on touch, and never bypass it to keep a machine running.

In the simulation, edit the cycle and watch the RMS line against the ratings; then stretch the cycle to minutes and see the winding overshoot what the RMS predicts.

> [!key] Two numbers size a motor for a cycle: the peak torque (against the short-time limit at that speed) and the RMS torque (against the continuous rating at the mean speed). Dwell time is part of the design.
`,
  ideas: [
    'Winding heat grows with torque squared, so a cycle heats the motor like a steady torque equal to its RMS value.',
    'Include the dwell in the RMS: rest time is cooling time.',
    'Peak torque and RMS torque are separate limits; both must be met.',
    'The RMS rule holds only when the cycle is short compared with the motor\'s thermal time constant.',
    'Steppers are not sized by RMS torque: their driver sets the current regardless of load.'
  ],
  pitfalls: [
    'Size by the average torque — Heating goes as T², so the average understates it; a cycle of 3 N·m for 1 s and zero for 3 s averages 0.75 N·m but heats like 1.5 N·m.',
    'If the RMS torque is below the rating, any cycle is fine — Long overloads heat the winding before averaging applies, and the peak must also fit the short-time limits of motor and drive.',
    'Braking torque does not count because it is negative — It is squared: braking heats the motor as much as accelerating.'
  ],
  formulas: [
    {
      name: 'RMS torque of a four-part cycle',
      expr: 'Trms = sqrt((Ta^2*ta + Tc^2*tc + Td^2*td + Th^2*t0)/(ta + tc + td + t0))',
      tex: 'T_{\\mathrm{rms}} = \\sqrt{\\dfrac{T_a^2 t_a + T_c^2 t_c + T_d^2 t_d + T_h^2 t_0}{t_a + t_c + t_d + t_0}}',
      vars: {
        Trms: { name: 'RMS torque', q: 'torque', unit: 'N·m', tex: 'T_{\\mathrm{rms}}' },
        Ta: { name: 'torque while accelerating', q: 'torque', unit: 'N·m', value: 2.4, tex: 'T_a' },
        ta: { name: 'acceleration time', q: 'time', unit: 's', value: 0.2, tex: 't_a' },
        Tc: { name: 'torque while cruising', q: 'torque', unit: 'N·m', value: 0.3, tex: 'T_c' },
        tc: { name: 'cruise time', q: 'time', unit: 's', value: 0.6, tex: 't_c' },
        Td: { name: 'torque while decelerating', q: 'torque', unit: 'N·m', value: -1.8, signed: true, tex: 'T_d' },
        td: { name: 'deceleration time', q: 'time', unit: 's', value: 0.2, tex: 't_d' },
        Th: { name: 'holding torque during the dwell', q: 'torque', unit: 'N·m', value: 0.1, signed: true, tex: 'T_h' },
        t0: { name: 'dwell time', q: 'time', unit: 's', value: 1.0, tex: 't_0' }
      },
      stories: { Trms: 'A servo gives {Ta} for {ta}, {Tc} for {tc}, {Td} for {td}, then {Th} for {t0}. What is the RMS torque?', t0: 'With the same moves, how long a dwell keeps the RMS torque at {Trms}?' }
    },
    {
      name: 'Thermal overload in short on–off cycles',
      expr: 'T = Tn/sqrt(D)', tex: 'T = \\dfrac{T_n}{\\sqrt{D}}',
      vars: {
        T: { name: 'torque allowed while on', q: 'torque', unit: 'N·m' },
        Tn: { name: 'continuous rated torque', q: 'torque', unit: 'N·m', value: 1.27, tex: 'T_n' },
        D: { name: 'fraction of the cycle under load', q: 'ratio', unit: '%', value: 25, min: 1, max: 100 }
      },
      note: 'Thermally only, for cycles much shorter than the thermal time constant; the peak rating still applies.',
      stories: { T: 'A motor rated {Tn} continuously works {D} of a short cycle and rests the remainder. What torque may it give while working?' }
    },
    {
      name: 'Mean speed of a trapezoidal cycle',
      expr: 'nm = n*(ta/2 + tc + td/2)/(ta + tc + td + t0)', tex: 'n_m = n\\,\\dfrac{t_a/2 + t_c + t_d/2}{t_a + t_c + t_d + t_0}',
      vars: {
        nm: { name: 'mean speed over the cycle', q: 'angvel', unit: 'rpm', tex: 'n_m' },
        n: { name: 'cruise (peak) speed', q: 'angvel', unit: 'rpm', value: 3000 },
        ta: { name: 'acceleration time', q: 'time', unit: 's', value: 0.2, tex: 't_a' },
        tc: { name: 'cruise time', q: 'time', unit: 's', value: 0.6, tex: 't_c' },
        td: { name: 'deceleration time', q: 'time', unit: 's', value: 0.2, tex: 't_d' },
        t0: { name: 'dwell time', q: 'time', unit: 's', value: 1.0, tex: 't_0' }
      },
      note: 'Check the RMS torque against the continuous torque at this speed.',
      stories: { nm: 'A cycle ramps to {n} in {ta}, cruises for {tc}, stops in {td} and waits {t0}. What is its mean speed?' }
    },
    {
      name: 'Winding loss at a torque',
      expr: 'P = Pn*(T/Tn)^2', tex: 'P = P_n \\left(\\dfrac{T}{T_n}\\right)^2',
      vars: {
        P: { name: 'copper loss', q: 'power', unit: 'W' },
        Pn: { name: 'copper loss at rated torque', q: 'power', unit: 'W', value: 40, tex: 'P_n' },
        T: { name: 'torque (steady or RMS)', q: 'torque', unit: 'N·m', value: 0.965 },
        Tn: { name: 'rated torque', q: 'torque', unit: 'N·m', value: 1.27, tex: 'T_n' }
      },
      stories: { P: 'A motor loses {Pn} in its winding at its rated {Tn}. What does it lose at an RMS torque of {T}?' }
    }
  ],
  examples: [
    {
      title: 'Is a 400 W servo enough?',
      q: 'A cycle: 2.4 N·m for 0.2 s, 0.3 N·m for 0.6 s, −1.8 N·m for 0.2 s, 0.1 N·m for 1.0 s. The servo is rated 1.27 N·m continuous and 3.8 N·m peak.',
      steps: [
        '$\\sum T^2 t = 2.4^2(0.2) + 0.3^2(0.6) + 1.8^2(0.2) + 0.1^2(1.0) = 1.152 + 0.054 + 0.648 + 0.010 = 1.864$.',
        '$T_{\\mathrm{rms}} = \\sqrt{1.864/2.0} = 0.97$ N·m — 76 % of the continuous rating.',
        'Peak 2.4 N·m — 63 % of the peak rating (check it at the speed where it occurs).'
      ],
      a: 'Yes: 0.97 N·m RMS (76 %) and 2.4 N·m peak (63 %).'
    },
    {
      title: 'How much dwell does it need?',
      q: 'The same moves without the holding torque (ΣT²t = 1.854 over 1.0 s of motion). How long must it dwell to stay under 1.27 N·m, and to keep a 20 % margin (1.06 N·m)?',
      steps: [
        'With no dwell: $\\sqrt{1.854/1.0} = 1.36$ N·m — too hot.',
        'For 1.27 N·m: $1.854/(1 + t_0) \\le 1.613$, so $t_0 \\ge 0.15$ s.',
        'For 1.06 N·m: $1.854/(1 + t_0) \\le 1.124$, so $t_0 \\ge 0.65$ s.'
      ],
      a: 'At least 0.15 s of dwell; 0.65 s for a 20 % margin.'
    },
    {
      title: 'A short on-off cycle',
      q: 'A motor rated 1.27 N·m continuously presses for a quarter of each 4 s cycle and rests the remainder. What torque may it give while pressing, thermally?',
      steps: [
        '$T = T_n/\\sqrt{D} = 1.27/\\sqrt{0.25} = 2.54$ N·m.',
        'That is below the 3.8 N·m peak, and the 1 s bursts are short compared with the thermal time constant, so the estimate holds.'
      ],
      a: 'About 2.5 N·m.'
    }
  ],
  quiz: [
    { q: 'Why is a motor sized by RMS torque rather than average torque?', choices: ['Winding losses grow with the square of the current, and so of the torque', 'Because torque is sometimes negative', 'Because the supply is AC', 'Because peak torque does not matter'], a: 0, why: 'Heat is I²R and I ∝ T in a PM motor; the RMS gives the steady torque with the same heating.' },
    { q: 'Adding dwell time at zero torque to a cycle lowers its RMS torque.', a: true, why: 'The sum of T²t stays the same while the total time grows, so the mean of the squares falls: rest is cooling.' },
    { q: 'A motor gives 3 N·m for 1 s, then nothing for 3 s, repeatedly. What is the RMS torque?', answer: 1.5, unit: 'N·m', why: '√(3² × 1/4) = 3 × 0.5 = 1.5 N·m — twice the 0.75 N·m average.' },
    { q: 'When can the RMS rule badly underestimate the winding temperature?', choices: ['When the cycle is long compared with the thermal time constant', 'When the cycle is a few seconds long', 'When the motor has an encoder', 'When the dwell torque is zero'], a: 0, why: 'A long overload heats the winding to its steady temperature before any averaging over the cycle can help.' },
    { q: 'How is the heating of a stepper motor judged?', choices: ['The driver pushes its set current whatever the load, so it heats the same; check the torque margin under the pull-out curve instead', 'By its RMS torque, like a servo', 'By its peak torque only', 'Steppers do not heat'], a: 0, why: 'A stepper\'s current is set by the driver (less idle reduction), not by the load torque.' }
  ],
  problems: [
    { q: 'A cycle: 4 N·m for 0.1 s, 1 N·m for 0.5 s, −3 N·m for 0.1 s, then 0 for 0.3 s. What is the RMS torque?', answer: 1.732, unit: 'N·m', tol: 0.01, steps: ['$\\sum T^2 t = 1.6 + 0.5 + 0.9 = 3.0$ over 1.0 s.', '$T_{\\mathrm{rms}} = \\sqrt{3.0} = 1.73$ N·m.'] },
    { q: 'A motor rated 2.4 N·m continuously works 40 % of a short cycle. What torque may it give while working, thermally?', answer: 3.79, unit: 'N·m', tol: 0.01, steps: ['$T = 2.4/\\sqrt{0.4} = 3.79$ N·m.'] }
  ],
  choose: {
    good: [
      'Servo, brushless and brushed DC motors on repetitive cycles: the RMS check often allows a smaller motor.',
      'Induction motors on VFDs with cyclic loads, using the RMS of the current.',
      'Deciding how much dwell a cycle needs, or whether a faster cycle will overheat.'
    ],
    avoid: [
      'Using the RMS rule for overloads lasting minutes: use a thermal model or the duty types.',
      'Applying it to steppers.',
      'Ignoring the peak: RMS says nothing about the short-time limit.'
    ],
    check: [
      'RMS torque against the continuous torque at the mean speed, with a margin.',
      'Peak torque against the intermittent zone at the speed where it occurs, and the drive\'s peak current and time.',
      'Ambient temperature, altitude and mounting (heat sinking) derating.',
      'Braking energy per cycle and the braking resistor.'
    ]
  },
  applications: [
    'Servo sizing for packaging, indexing and pick-and-place cycles.',
    'Checking whether a machine can run faster: shorter dwell raises the RMS torque.',
    'Presses and punching axes with short, high-torque strokes: the thermal overload formula.'
  ],
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: duty types S1 to S10 and thermal ratings.',
    'Hughes and Drury, *Electric Motors and Drives*: the chapter on motor and drive selection — ratings, duty and thermal limits.',
    'NEMA ICS 16, motion and position control motors, controls and feedback devices: continuous and peak torque of servo systems.'
  ],
  sim: 'mx-rms'
},

{
  id: 'motor-selection-method', parent: 'motion-sizing', title: 'Sizing a motor step by step', level: 3,
  short: 'A method that works for every motor type: define the task, choose the mechanism and ratio, plan the profile, refer every force and inertia to the motor, compute the torque in each part of the cycle, then check peak torque, RMS torque, speed and inertia ratio — with margins — and finally the drive, braking, brake and environment. Worked through for a ball-screw axis.',
  keywords: ['motor sizing', 'motor selection', 'servo sizing', 'sizing procedure', 'worked example', 'peak torque', 'RMS torque', 'inertia ratio', 'safety margin', 'ball-screw axis', 'lead selection', 'torque–speed curve', 'intermittent zone'],
  prereq: ['load-torque-types', 'inertia-reflected', 'motion-profiles', 'rms-torque-sizing'],
  related: ['lead-ball-screws', 'rack-pinion-linear', 'gearboxes', 'positioning-vs-speed', 'stepper-sizing', 'inertia-matching', 'servo-brakes', 'hydraulic-motor-sizing', 'motor-comparison'],
  body: `
Choosing a motor is an iteration, but always the same one. The steps below apply to a servo, a stepper, a brushless or DC motor or an induction motor on a VFD; only the final checks differ. The [sizing tools](#/tools/sizing/axis) and the [selection guide](#/tools/sizing/choose) follow the same order.

### The method
1. **Define the task.** Masses and forces (friction, gravity, process forces), distances and times, dwell and cycle, accuracy and stiffness, orientation, environment (temperature, dust, water, explosive atmosphere), supply and budget.
2. **Choose the mechanism and ratio** — screw lead, pulley, rack, gearbox — so that the motor's top speed lands near its rated speed ([[lead-ball-screws]], [[rack-pinion-linear]], [[gearboxes]]).
3. **Plan the profile**: the one-third trapezoid gives speed $1.5\\,d/t$ and acceleration $4.5\\,d/t^2$ ([[motion-profiles]]). Convert both to the motor: $n = v/p$ and $\\alpha_m = 2\\pi a/p$ on a screw.
4. **Refer loads to the motor.** Forces become torques through the transmission's efficiency; inertias become $J_{\\text{ref}}$ ([[inertia-reflected]]). Do not forget the screw, pulleys, coupling and the gearbox input.
5. **Torque in each segment**: $T = (J_m + J_{\\text{ref}})\\,\\alpha_m + T_L$, with the load torque's sign right for braking and lowering.
6. **Peak, RMS and speeds**: the largest torque and the speed where it occurs; $T_{\\mathrm{rms}}$ over the whole cycle including dwell; the top and mean speeds ([[rms-torque-sizing]]).
7. **Pick a motor and check it**: peak torque inside the intermittent zone of its torque–speed curve at that speed; RMS torque below the continuous torque at the mean speed; top speed below its maximum; inertia ratio within about 5–10 for a crisp servo; then **repeat step 5** with the chosen motor's own rotor inertia.
8. **Check everything else**: the drive's continuous and peak current, braking energy (resistor), a holding brake on vertical axes, encoder resolution, cable length, IP rating and cooling, ambient and altitude derating.

**Margins**: friction and process forces are rarely known well — take 1.5–2 on them; keep RMS and peak torques some 20–30 % below the ratings; for steppers use no more than about 50–70 % of the pull-out torque at the highest speed ([[stepper-sizing]]).

### A worked axis
A horizontal ball-screw axis moves a 30 kg carriage 400 mm in 0.8 s, then dwells 0.4 s (a 1.2 s cycle). Rolling rails with seals: μ = 0.01. Screw Ø16 × 800 mm, 90 % efficient, preload drag 0.05 N·m, coupling 0.1 kg·cm².

| Step | Result |
|---|---|
| Profile (⅓ rule) | $v$ = 0.75 m/s, $a$ = 2.81 m/s², 0.267 s per third |
| Lead | 10 mm would need 4500 rpm — too fast; **20 mm** gives 2250 rpm (critical speed of a 700 mm free length, fixed–supported, ≈ 5190 rpm: fine) |
| Motor acceleration | $\\alpha_m = 2\\pi \\times 2.81/0.02 = 884$ rad/s² |
| Inertias at the motor | carriage $30 (0.02/2\\pi)^2$ = 3.04 kg·cm²; screw 0.40; coupling 0.10: **3.54 kg·cm²** |
| Friction torque | $0.01 \\times 30 \\times 9.81 \\times 0.02/(2\\pi \\times 0.9)$ + 0.05 = **0.060 N·m** |
| Carriage force torque | $30 \\times 2.81 \\times 0.02/(2\\pi \\times 0.9)$ = 0.298 N·m accelerating; braking it passes back through the screw: −0.242 N·m |

With a 400 W servo (0.5 kg·cm², 1.27 N·m continuous, 3.8 N·m peak, 3000 rpm rated): the rotating parts need $(0.5 + 0.40 + 0.10) \\times 10^{-4} \\times 884 = 0.089$ N·m, so

- accelerating: $0.298 + 0.089 + 0.060 = 0.45$ N·m;
- cruising: 0.06 N·m; braking: $-0.242 - 0.089 + 0.060 = -0.27$ N·m; dwell: 0;
- $T_{\\mathrm{rms}} = \\sqrt{(0.448^2 + 0.060^2 + 0.270^2) \\times 0.267/1.2} = 0.25$ N·m; mean speed 1000 rpm; inertia ratio $3.54/0.5 = 7.1$.

The 400 W motor is at 12 % of its peak and 20 % of its continuous torque — thermally generous — with a good inertia ratio of 7. A **200 W** low-inertia motor (0.2 kg·cm², 0.64/1.9 N·m) passes on torque (0.42 N·m peak, 0.23 N·m RMS) but its inertia ratio of 18 would make this axis slow to settle; a 200 W motor from a medium-inertia series is the alternative. Here **inertia, not torque, chooses the motor** — typical of fast, light axes. A vertical version would add about 1.0 N·m to lift and 0.84 N·m to hold the 30 kg — even during the dwell — so the RMS would decide instead, and a brake would be mandatory.

### The same method for other motors
- **Induction motor on a VFD** (conveyor, pump, fan): the load family ([[load-torque-types]]) gives torque over the speed range; check starting or breakaway torque, cooling at low speed, field weakening above base speed, the drive's heavy- or normal-duty rating and the braking energy.
- **Stepper**: the pull-out curve with the driver's supply voltage and current, a generous margin, the inertia ratio and resonance; consider a closed-loop stepper or a servo if the margin is thin ([[positioning-vs-speed]]).
- **Hydraulic motor**: torque from displacement and pressure, speed from flow ([[hydraulic-motor-sizing]]).

> [!warn] The sizing is only half of a safe axis. Vertical and overhauling axes need a holding brake and a stopping function designed to ISO 13849-1 and IEC 60204-1; mains wiring, drives and motors are installed by qualified electricians following the motor's nameplate and the drive's manual.

In the simulation, change the mass, the lead or pulley, the move time and the orientation: the table checks every generic servo size, and the plot places your operating points on the chosen motor's torque–speed zones.

> [!key] Speed from the mechanism, torque from inertia plus load, heat from the RMS, stability from the inertia ratio — each with a margin. Then check drive, braking, brake and environment.
`,
  ideas: [
    'Start from the task (loads, moves, cycle, environment), not from a motor catalogue.',
    'Choose the lead or ratio so the motor\'s top speed is near its rated speed.',
    'Compute the torque in every segment with the motor\'s own inertia included, then the peak and RMS.',
    'On fast light axes the inertia ratio often chooses the motor; on heavy or vertical axes the RMS torque does.',
    'Finish with the drive current, braking energy, holding brake, encoder and environment.'
  ],
  pitfalls: [
    'Pick the motor by power (watts) — Torque at speed, RMS torque and inertia decide; two 400 W motors can differ several times in rotor inertia.',
    'The smallest motor that passes the torque checks is the best — A large inertia ratio can make it slow to settle; speed limits and margins matter too.',
    'Sizing ends at the motor — The drive, braking resistor, brake, cable and cooling are part of the same decision.'
  ],
  formulas: [
    {
      name: 'Top motor speed of a one-third move on a screw',
      expr: 'n = 1.5*d/(t*p)', tex: 'n = \\dfrac{3}{2}\\,\\dfrac{d}{t\\, p}',
      vars: {
        n: { name: 'top motor speed', q: 'frequency', unit: 'rpm' },
        d: { name: 'move distance', q: 'length', unit: 'mm', value: 400 },
        t: { name: 'move time', q: 'time', unit: 's', value: 0.8 },
        p: { name: 'screw lead (travel per motor turn)', q: 'length', unit: 'mm', value: 20 }
      },
      stories: { n: 'An axis must move {d} in {t} on a screw with a {p} lead, using the one-third rule. How fast must the motor turn?', p: 'A {d} move in {t} (one-third rule) must not need more than {n}. What lead is needed?' }
    },
    {
      name: 'Motor acceleration from the load\'s linear acceleration',
      expr: 'alpha = 2*pi*a/p', tex: '\\alpha_m = \\dfrac{2\\pi\\, a}{p}',
      vars: {
        alpha: { name: 'motor angular acceleration', q: 'angacc', unit: 'rad/s²', tex: '\\alpha_m' },
        a: { name: 'linear acceleration', q: 'accel', unit: 'm/s²', value: 2.8125 },
        p: { name: 'travel per motor revolution', q: 'length', unit: 'mm', value: 20 }
      },
      stories: { alpha: 'A carriage accelerates at {a} on a screw with a {p} lead. How fast does the motor accelerate?' }
    },
    {
      name: 'Motor torque in a segment',
      expr: 'T = (Jm + JL)*alpha + TL', tex: 'T = (J_m + J_L)\\,\\alpha_m + T_L',
      vars: {
        T: { name: 'motor torque', q: 'torque', unit: 'N·m' },
        Jm: { name: 'motor rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 0.5, tex: 'J_m' },
        JL: { name: 'rotating load inertia at the motor (screw, coupling…)', q: 'inertia', unit: 'kg·cm²', value: 0.5, tex: 'J_L' },
        alpha: { name: 'motor angular acceleration', q: 'angacc', unit: 'rad/s²', value: 883.6, signed: true, tex: '\\alpha_m' },
        TL: { name: 'load torque at the motor (friction, gravity, carriage force through the screw)', q: 'torque', unit: 'N·m', value: 0.359, signed: true, tex: 'T_L' }
      },
      stories: { T: 'A motor of {Jm} drives {JL} of rotating parts at {alpha} against {TL}. What torque must it give?' }
    },
    {
      name: 'Inertia ratio',
      expr: 'lam = JL/Jm', tex: '\\lambda = \\dfrac{J_{\\mathrm{ref}}}{J_m}',
      vars: {
        lam: { name: 'inertia ratio', tex: '\\lambda' },
        JL: { name: 'total load inertia referred to the motor', q: 'inertia', unit: 'kg·cm²', value: 3.54, tex: 'J_{\\mathrm{ref}}' },
        Jm: { name: 'motor rotor inertia', q: 'inertia', unit: 'kg·cm²', value: 0.5, tex: 'J_m' }
      },
      note: 'About 5–10 is comfortable for a servo; more needs stiff mechanics and careful tuning.',
      stories: { lam: 'A load of {JL} at the motor is driven by a rotor of {Jm}. What is the inertia ratio?', Jm: 'A load of {JL} should see an inertia ratio of at most {lam}. How much rotor inertia is needed?' }
    }
  ],
  examples: [
    {
      title: 'Step 2: choosing the lead',
      q: 'The worked axis moves 400 mm in 0.8 s with the one-third rule. Which lead keeps a 3000 rpm servo within its rating: 10 mm or 20 mm?',
      steps: [
        'Top speed $v = 1.5 \\times 0.4/0.8 = 0.75$ m/s.',
        '10 mm lead: $0.75/0.01 = 75$ rev/s = 4500 rpm — above 3000 rpm rated, and the torque available up there falls.',
        '20 mm lead: 2250 rpm — within the rating, with the screw\'s critical speed (≈ 5190 rpm for a 700 mm free length, fixed–supported) far away.'
      ],
      a: 'The 20 mm lead (2250 rpm).'
    },
    {
      title: 'Steps 4–6: torques, RMS and ratio',
      q: 'With a 400 W servo (rotor 0.5 kg·cm²), find the torque in each segment, the RMS torque and the inertia ratio of the worked axis.',
      steps: [
        'Rotating parts: $(0.5 + 0.40 + 0.10) \\times 10^{-4} \\times 884 = 0.089$ N·m.',
        'Accelerating: carriage $0.298$ + rotating $0.089$ + friction $0.060$ = 0.448 N·m. Cruising 0.060 N·m. Braking $-0.242 - 0.089 + 0.060 = -0.270$ N·m. Dwell 0.',
        '$T_{\\mathrm{rms}} = \\sqrt{(0.448^2 + 0.060^2 + 0.270^2) \\times 0.267/1.2} = \\sqrt{0.0615} = 0.248$ N·m.',
        'Inertia ratio $3.54/0.5 = 7.1$.'
      ],
      a: 'Peak 0.45 N·m, RMS 0.25 N·m, inertia ratio 7.1.'
    },
    {
      title: 'Step 7: 200 W or 400 W?',
      q: 'A 200 W low-inertia servo (0.2 kg·cm², 0.64 N·m continuous, 1.9 N·m peak) would also fit the space. Does it do the job?',
      steps: [
        'Torque: peak $0.298 + (0.2 + 0.5) \\times 10^{-4} \\times 884 + 0.060 = 0.42$ N·m (22 % of peak); RMS about 0.23 N·m (36 %). Both pass.',
        'Inertia ratio $3.54/0.2 = 18$: the axis would settle slowly and ring unless the mechanics are very stiff and the servo carefully tuned.',
        'Choose the 400 W motor, or a 200 W motor with a higher-inertia rotor.'
      ],
      a: 'It passes on torque but not on inertia ratio (about 18).'
    }
  ],
  quiz: [
    { q: 'What is the first step in sizing a motor?', choices: ['Define the task: loads, moves, cycle, accuracy and environment', 'Open a motor catalogue at the right power', 'Choose the drive', 'Pick the encoder'], a: 0, why: 'Everything else — mechanism, profile, torques — follows from the task; a catalogue first leads to guessing.' },
    { q: 'The smallest motor that meets the peak and RMS torque is always the right choice.', a: false, why: 'The inertia ratio, the speed at the chosen ratio, margins for unknown friction and the drive all matter too.' },
    { q: 'A servo axis passes every torque check but rings and settles slowly after each move. The first suspect?', choices: ['A large inertia ratio with springy mechanics', 'Too much RMS margin', 'A too-short dwell', 'A too-high encoder resolution'], a: 0, why: 'When the load outweighs the rotor many times, it oscillates against the motor through couplings and belts; a higher ratio, a bigger rotor or stiffer parts help.' },
    { q: 'A load of 2.8 kg·cm² at the motor and a rotor of 0.35 kg·cm²: what is the inertia ratio?', answer: 8, why: '2.8/0.35 = 8 — within the usual 5–10 guidance for a servo.' },
    { q: 'How much of a stepper\'s pull-out torque at the top speed should a design use?', choices: ['No more than about 50–70 %', 'All of it', 'Exactly 100 % at stall', 'At least 120 %'], a: 0, why: 'Pull-out curves are measured under ideal conditions; resonance, supply sag and friction variation eat the rest, and a stepper that stalls loses position silently.' }
  ],
  problems: [
    { q: 'An axis must move 300 mm in 0.6 s with the one-third rule on a 10 mm-lead screw. How fast must the motor turn at the top of the move?', answer: 4500, unit: 'rpm', tol: 0.01, steps: ['$v = 1.5 \\times 0.3/0.6 = 0.75$ m/s.', '$n = 0.75/0.01 = 75$ rev/s = 4500 rpm — choose a longer lead or a faster motor.'] },
    { q: 'A carriage accelerates at 3 m/s² on a 5 mm-lead screw. What is the motor\'s angular acceleration?', answer: 3770, unit: 'rad/s²', tol: 0.01, steps: ['$\\alpha_m = 2\\pi a/p = 2\\pi \\times 3/0.005 = 3770$ rad/s².'] }
  ],
  choose: {
    good: [
      'Every new axis or drive: the steps catch the forgotten inertias, dwell times and margins.',
      'Comparing mechanisms (lead, pulley, gearbox) before buying anything.',
      'Deciding between a servo, a stepper and a VFD-fed induction motor for one task.'
    ],
    avoid: [
      'Sizing by power alone, or by the torque of a similar old machine.',
      'Skipping the iteration with the chosen motor\'s own rotor inertia.',
      'Margins so large that the motor is far too big, slow to respond and expensive — or none at all.'
    ],
    check: [
      'Peak torque in the intermittent zone at its speed; RMS torque below the continuous torque at the mean speed.',
      'Top speed, inertia ratio and the stiffness of the mechanics.',
      'Drive current, braking energy and resistor, holding brake, encoder resolution.',
      'Ambient temperature, altitude, IP rating, cable length and the safety functions.'
    ]
  },
  applications: [
    'Servo axes of packaging, assembly and machine-tool builders, sized with the [axis sizing tool](#/tools/sizing/axis).',
    'Conveyor, hoist and pump drives sized with the [conveyor](#/tools/sizing/conveyor), [hoist](#/tools/sizing/hoist) and [pump and fan](#/tools/sizing/pumpfan) tools.',
    'Choosing the family first with the [selection guide](#/tools/sizing/choose).'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives*: the chapter on motor and drive selection.',
    'Mohan, *Electric Drives: An Integrative Approach*: mechanical system requirements and the choice of motor and ratio.',
    'NEMA ICS 16, motion and position control motors, controls and feedback devices.',
    'IEC 60034-1 (rating and duty) and ISO 13849-1 / IEC 60204-1 (safety-related control and electrical equipment of machines).'
  ],
  sim: 'mx-sizing'
}

);
