/* HYPER-MOTORS · content/basics.js — How Motors Work: electromagnetic principles and ratings.
 * Topics: electromagnetic-principles (force, torque and power, back-EMF, magnetic circuits, motor–generator duality)
 *         motor-ratings (power units, efficiency and losses, power factor, duty cycles, the nameplate, insulation
 *         classes, IP and cooling, IE efficiency classes, standards and frames).
 * Simulations: sims/basics.js (ids mb-…). */
Hyper.add(

{
  id: 'force-on-conductor', parent: 'electromagnetic-principles', title: 'Force on a current in a magnetic field', level: 1,
  short: 'A wire carrying current across a magnetic field is pushed sideways with a force F = BIL. Every electric motor is an arrangement of many such wires around a shaft; its torque is set by the flux density in the air gap, the current the winding can carry without overheating, and the size of the rotor.',
  keywords: ['F = BIL', 'Lorentz force', 'Fleming left-hand rule', 'flux density', 'air gap', 'shear stress', 'electric loading', 'torque per rotor volume', 'TRV', 'coil torque', 'commutation'],
  prereq: ['physics:force-on-current', 'physics:magnetic-field'],
  related: ['torque-and-power', 'magnetic-circuits', 'back-emf', 'brushes-commutator', 'voice-coil-actuators', 'physics:torque-on-loop', 'physics:lorentz-force'],
  body: `
Put a wire carrying a current across a magnetic field and it is pushed sideways — at right angles to both the wire and the field. The push is

$$F = B\\,I\\,L\\,\\sin\\theta$$

with $B$ the flux density in tesla, $I$ the current in amperes, $L$ the length of wire inside the field and $\\theta$ the angle between wire and field. As a [[?vector]] statement it reads $\\vec F = I\\,\\vec L \\times \\vec B$ — a [[?cross-product|cross product]], which is why the force is perpendicular to both. A wire lying along the field feels nothing; a wire straight across it feels the full $BIL$. One metre of wire carrying 10 A across a field of 1 T is pushed with 10 N, about the weight of a 1 kg bag of sugar.

### Which way?
Fleming's **left-hand rule** for motors: hold the thumb, first and second fingers at right angles; the **f**irst finger points along the **f**ield (north to south), the se**c**ond finger along the **c**urrent, and the thu**m**b gives the **m**otion. Reverse either the current or the field and the force reverses; reverse both and it does not — which is why a series-wound [[universal-motor|universal motor]] runs on AC.

In the simulation, look at the field lines around the wire: its own circular field adds to the magnets' field on one side and cancels it on the other. The lines crowd together on the strong side like a stretched catapult and push the wire towards the weak side.

### One coil on a shaft
Bend the wire into a coil of $N$ turns with sides of length $L$ a distance $D$ apart, mount it on a shaft, and the two sides are pushed in opposite directions: a couple. In a uniform field the torque varies as the [[?sine-cosine|sine]] of the coil's angle and reverses every half turn, so the coil only rocks. Motors fix this twice over: curved poles make the field in the gap **radial**, so each side is pushed tangentially with the full $NBIL$ while it is under a pole, giving $T = NBILD$; and a **commutator** (or transistors) reverses the coil current as it passes between poles. Many coils spaced round the rotor fill in the gaps, and the torque becomes almost smooth — switch on *three coils* in the sim and watch the ripple shrink.

### From one wire to a motor
A motor packs hundreds of conductors into slots around its rotor, in an air gap where the flux density peaks at roughly **0.6–1.0 T**. It cannot go much higher because the steel teeth that carry the flux saturate near 1.6–2 T (see [[magnetic-circuits]]). Averaged over the rotor surface, the push of all the conductors is a **shear stress** $\\sigma$ — force per square metre of gap surface — acting at radius $D/2$ on an area $\\pi D L$:

$$T = \\sigma \\cdot \\pi D L \\cdot \\frac{D}{2} = \\frac{\\pi}{2}\\,\\sigma\\,D^2 L$$

The shear stress is roughly the product of the air-gap flux density and the current per metre of gap circumference (the *electric loading*); for sinusoidal distributions lined up with each other it is half the product of their peaks. The flux is limited by saturation, the current by heat, so the shear stress of a given kind of machine varies surprisingly little with size:

| Machine | Typical air-gap shear stress | What limits it |
|---|---|---|
| Small fan-cooled motor, under 1 kW | a few kPa | copper heating in a small frame |
| Industrial induction motor, 1–100 kW | very roughly 5–20 kPa | winding temperature, magnetising current |
| Servo motor with rare-earth magnets | similar or somewhat higher | winding and magnet temperature |
| Liquid-cooled traction motor, large generator | several times higher | the cooling system |

### What this means when you choose a motor
- **Torque sets the size.** Torque grows with the rotor volume $D^2L$; power is torque times speed (see [[torque-and-power]]). A slow motor is big and heavy for its power; a fast motor with a gearbox is usually smaller and cheaper.
- **Heat sets the current.** Doubling the current doubles the force but quadruples the copper loss $I^2R$. Continuous torque is a thermal limit; peak torque is limited by saturation, by magnet demagnetisation and by the drive's current limit.
- **The gap costs current.** Driving flux across the air gap takes magnetising current, so gaps are made as small as the bearings and manufacturing allow — a few tenths of a millimetre in small motors.

> [!key] F = BIL: the force on a conductor is field × current × length. Motor torque is that force times the radius, added up over every conductor — so torque grows with rotor volume, and a motor's size is set by the torque it must give, not by its power.
`,
  ideas: [
    'A current-carrying conductor across a field feels F = BIL sin θ, perpendicular to both the wire and the field.',
    'Reversing the current or the field reverses the force; reversing both leaves it unchanged.',
    'Motors shape a radial field and switch coil currents (commutation) so that the torque keeps one sign as the rotor turns.',
    'Air-gap flux density is capped near 1 T by iron saturation, and current by heating, so torque grows with rotor volume: T = (π/2) σ D² L.'
  ],
  pitfalls: [
    'A stronger magnet or more current always gives proportionally more torque — The iron saturates, so extra field brings little; extra current brings heat as its square, and very high currents can demagnetise permanent magnets.',
    'Motor size follows power — It follows torque. Two motors of the same power at 750 and 3000 rpm differ in torque by four times, and the slow one is far bigger.',
    'A single coil in a magnet makes a motor — In a uniform field a coil only rocks to its rest position; the current must be reversed every half turn by a commutator or electronics.'
  ],
  formulas: [
    {
      name: 'Force on a straight conductor',
      expr: 'F = B*I*L*sin(theta)', tex: 'F = B\\,I\\,L\\,\\sin\\theta',
      vars: {
        F: { name: 'force on the conductor', q: 'force', unit: 'N' },
        B: { name: 'flux density', q: 'bfield', unit: 'T', value: 0.8 },
        I: { name: 'current', q: 'current', unit: 'A', value: 10 },
        L: { name: 'length of conductor in the field', q: 'length', unit: 'm', value: 0.2 },
        theta: { name: 'angle between conductor and field', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'Largest when the conductor crosses the field at right angles (θ = 90°); zero when it lies along the field.',
      stories: { F: 'A conductor {L} long carries {I} across a field of {B} at {theta} to the field lines. How hard is it pushed?', I: 'What current must a conductor {L} long carry at {theta} across a {B} field to feel {F}?' }
    },
    {
      name: 'Torque of a coil in a radial field',
      expr: 'T = N*B*I*L*D', tex: 'T = N\\,B\\,I\\,L\\,D',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        N: { name: 'turns in the coil', q: 'count', value: 50, int: true },
        B: { name: 'flux density in the gap', q: 'bfield', unit: 'T', value: 0.8 },
        I: { name: 'coil current', q: 'current', unit: 'A', value: 5 },
        L: { name: 'active length of each side', q: 'length', unit: 'm', value: 0.1 },
        D: { name: 'coil width (twice the radius)', q: 'length', unit: 'm', value: 0.05 }
      },
      note: 'Each of the two sides is pushed with N·B·I·L at radius D/2. It holds while both sides sit under the poles of a radial field; in a uniform field multiply by the sine of the coil angle.',
      stories: { T: 'A coil of {N} turns, sides {L} long and {D} apart, carries {I} in a radial gap field of {B}. What torque does it give?', I: 'What current gives {T} from a coil of {N} turns, sides {L} long and {D} apart, in {B}?' }
    },
    {
      name: 'Torque from air-gap shear stress',
      expr: 'T = pi/2*sigma*D^2*L', tex: 'T = \\tfrac{\\pi}{2}\\,\\sigma\\,D^2 L',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        sigma: { name: 'average air-gap shear stress', q: 'stress', unit: 'kPa', value: 10, tex: '\\sigma' },
        D: { name: 'rotor diameter', q: 'length', unit: 'mm', value: 140 },
        L: { name: 'rotor (stack) length', q: 'length', unit: 'mm', value: 160 }
      },
      note: 'The design rule behind every motor catalogue: torque grows with rotor volume. Industrial air-cooled motors work at very roughly 5–20 kPa.',
      stories: { T: 'A rotor {D} across and {L} long works at a shear stress of {sigma}. What torque can it give?', L: 'A motor must give {T} with a rotor {D} across at {sigma}. How long must the stack be?' }
    }
  ],
  examples: [
    {
      title: 'The force on one rotor bar',
      q: 'A rotor bar 0.16 m long sits in a gap field of peak 0.7 T and carries a peak current of 300 A. What is the peak force on it? If a rotor of 28 such bars at radius 70 mm has field and current distributed sinusoidally and lined up, what torque does it give?',
      steps: [
        'Peak force on one bar: $F = BIL = 0.7 \\times 300 \\times 0.16 = 33.6$ N.',
        'With both field and current varying as a [[?sine-cosine|sine]] round the rotor and in step, each bar gives on average half the peak force: 16.8 N.',
        'Torque: $28 \\times 16.8 \\times 0.070 = 32.9$ N·m — the right order for a 5.5 kW 4-pole motor, whose rated torque is about 36 N·m.'
      ],
      a: 'About 34 N peak per bar; about 33 N·m for the whole rotor.'
    },
    {
      title: 'How big must the rotor be?',
      q: 'A 7.5 kW, 4-pole motor turns at 1455 rpm. Assuming an air-gap shear stress of 10 kPa and a stack 1.2 times as long as the rotor diameter, estimate the rotor size.',
      steps: [
        'Rated torque: $T = P/\\omega = 7500/(1455 \\times 2\\pi/60) = 7500/152.4 = 49.2$ N·m.',
        '$D^2 L = T/(\\tfrac{\\pi}{2}\\sigma) = 49.2/(1.571 \\times 10^4) = 3.13 \\times 10^{-3}$ m³.',
        'With $L = 1.2D$: $D^3 = 3.13 \\times 10^{-3}/1.2 = 2.61 \\times 10^{-3}$ m³, so $D = 0.138$ m and $L = 0.165$ m.'
      ],
      a: 'A rotor about 138 mm across and 165 mm long — about what fits inside the 132-frame housing such a motor comes in.'
    },
    {
      title: 'A coil on a shaft',
      q: 'A 50-turn coil with sides 0.1 m long and 0.05 m apart carries 5 A in a radial gap field of 0.8 T. What torque does it give, and what if it sat in a uniform field at 30° from its best position?',
      steps: [
        'Radial field: $T = NBILD = 50 \\times 0.8 \\times 5 \\times 0.1 \\times 0.05 = 1.0$ N·m.',
        'Uniform field, 30° away from the best position: $T = 1.0 \\times \\cos 30° = 0.87$ N·m, and it falls to zero when the coil faces the poles.'
      ],
      a: '1.0 N·m in the radial field; 0.87 N·m at 30° in a uniform field.'
    }
  ],
  quiz: [
    { q: 'In a motor you reverse both the current and the magnetic field. The force on each conductor…', choices: ['keeps its direction', 'reverses', 'becomes zero', 'doubles'], a: 0, why: 'F = I L × B: two sign changes cancel. That is why a series-wound universal motor, whose field and armature currents reverse together, runs on AC.' },
    { q: 'A wire lying along the magnetic field lines feels the largest force.', a: false, why: 'The force goes as sin θ; along the field θ = 0 and the force is zero. It is largest straight across the field.' },
    { q: 'A designer doubles a rotor\'s diameter and keeps its length and shear stress. The torque becomes…', choices: ['4 times larger', '2 times larger', '8 times larger', 'unchanged'], a: 0, why: 'T = (π/2) σ D² L: torque grows with the square of the diameter (force grows with the circumference and the lever arm with the radius).' },
    { q: 'Why do motor designers not simply use 3 T in the air gap?', choices: ['The steel teeth carrying the flux saturate near 1.6–2 T, so the gap field cannot usefully exceed about 1 T', 'Copper cannot carry current in a strong field', 'The Lorentz force reverses above 2 T', 'It would make the motor too fast'], a: 0, why: 'The flux must pass through the teeth between the slots, which are narrower than the gap; once the steel saturates, more magnetising current or magnet brings almost no more flux.' },
    { q: 'What force acts on 0.2 m of wire carrying 20 A straight across a 0.5 T field?', answer: 2, unit: 'N', why: 'F = BIL = 0.5 × 20 × 0.2 = 2 N.' }
  ],
  problems: [
    { q: 'A conductor 0.25 m long lies across a 0.9 T field. What current must it carry to be pushed with 45 N?', answer: 200, unit: 'A', tol: 0.01, steps: ['$I = F/(BL) = 45/(0.9 \\times 0.25) = 200$ A.'] },
    { q: 'A rotor 0.2 m in diameter and 0.25 m long works at an average air-gap shear stress of 15 kPa. What torque does it give?', answer: 235.6, unit: 'N·m', tol: 0.02, steps: ['$T = \\tfrac{\\pi}{2}\\sigma D^2 L = 1.571 \\times 15000 \\times 0.04 \\times 0.25$.', '$T = 235.6$ N·m.'] }
  ],
  applications: [
    'Loudspeakers and [[voice-coil-actuators|voice-coil actuators]]: a coil in a radial magnet gap, pushed directly with F = BIL.',
    'Moving-coil meters and galvanometers: a coil turning against a hair spring, its angle proportional to the current.',
    'Motor sizing: catalogues and design texts compare machines by torque per rotor volume, which is twice the air-gap shear stress.'
  ],
  history: 'Hans Christian Ørsted found in 1820 that a current deflects a compass needle; within a year Michael Faraday made a wire carrying current rotate continuously around a magnet dipped in mercury (1821) — the first electromagnetic rotation. Peter Barlow\'s wheel (1822) turned a star-shaped disc the same way. Practical motors had to wait for the commutator and good iron circuits later in the century.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — chapter 1 (the basics: force on a conductor, magnetic circuits, specific loadings, torque and motor volume).',
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines* — sizing by torque per rotor volume and air-gap shear stress.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery* — electromechanical energy conversion and the forces on currents in magnetic fields.'
  ],
  sim: 'mb-force'
},

{
  id: 'torque-and-power', parent: 'electromagnetic-principles', title: 'Torque, speed and power', level: 1,
  short: 'Power is torque times angular speed: P = Tω. A motor is sized by its torque; the same power can come as high torque at low speed or low torque at high speed, and a gearbox trades one for the other (losing a little on the way).',
  keywords: ['torque', 'speed', 'power', 'P = Tω', 'rpm', 'rad/s', '9549', '5252', 'gearbox', 'gear ratio', 'rated torque', 'N·m', 'lbf·ft', 'kgf·cm', 'oz·in', 'poles'],
  prereq: ['physics:torque', 'physics:power', 'force-on-conductor'],
  related: ['power-units', 'gearboxes', 'load-torque-types', 'motor-selection-method', 'slip-and-speed', 'hydraulics:pressure-flow-power'],
  body: `
Torque is the turning effort on a shaft — a force times the radius at which it acts, in newton-metres. Speed is how fast the shaft turns. Power, the rate at which work is done, is their product:

$$P = T\\,\\omega, \\qquad \\omega = \\frac{2\\pi n}{60}$$

with $\\omega$ in [[?radian|radians]] per second and $n$ in revolutions per minute. In workshop units this becomes $P\\,[\\mathrm{kW}] = T\\,[\\mathrm{N\\,m}] \\times n\\,[\\mathrm{rpm}]/9549$, and in American units $P\\,[\\mathrm{hp}] = T\\,[\\mathrm{lbf\\,ft}] \\times n\\,[\\mathrm{rpm}]/5252$. The two constants are nothing but $60/2\\pi$ with the unit conversions folded in.

### The same power, very different torques
An induction motor's speed is fixed by its number of poles (see [[slip-and-speed]]), so every power rating is made at several speeds. Here is 7.5 kW on a 50 Hz supply:

| Poles | Typical rated speed | Rated torque | Typical IEC frame |
|---|---|---|---|
| 2 | 2900 rpm | 24.7 N·m | 132S |
| 4 | 1455 rpm | 49.2 N·m | 132M |
| 6 | 970 rpm | 73.8 N·m | 160M |
| 8 | 720 rpm | 99.5 N·m | 160L |

Each time the speed halves, the torque doubles — and because torque grows with rotor volume ([[force-on-conductor]]), the motor grows too. That is why most machines use a 4-pole or 2-pole motor with a gearbox or belt rather than a slow, heavy motor; why a 750 rpm motor costs much more than a 3000 rpm one of the same power; and why small, fast motors (drones, power tools, electric cars at 10,000–20,000 rpm) give so much power for their weight.

### Gearboxes trade speed for torque
A reduction of ratio $i$ divides the speed and multiplies the torque, less its losses:

$$n_2 = \\frac{n_1}{i}, \\qquad T_2 = T_1\\,i\\,\\eta$$

The power passes through (reduced by the efficiency $\\eta$) — a gearbox never adds power. Typical efficiencies: helical and spur stages about 97–99 % each, planetary stages 95–98 %, worm gears 50–90 % (the higher the ratio, the lower), bevel stages about 95–98 %. See [[gearboxes]].

| Unit you will meet | Where | In N·m |
|---|---|---|
| N·m | IEC catalogues, drives | 1 |
| lbf·ft | US catalogues and plates | 1.356 |
| lbf·in | small US motors | 0.113 |
| kgf·cm | hobby servos, small gearmotors | 0.0981 |
| oz·in | steppers | 0.00706 |

### Torque is what the load asks for
A motor does not "give" its rated torque; it gives whatever torque the load demands, and draws the current that torque needs. The load may need a constant torque at every speed (a conveyor, a hoist, a positive-displacement pump), a torque growing as the square of speed (fans and centrifugal pumps) or a torque falling as speed rises at constant power (winders, spindles) — see [[load-torque-types]]. Three torques matter:

- **Rated torque** — what the motor can give continuously without overheating.
- **Starting and peak torque** — a standard cage induction motor gives about 1.5–2.5 times rated torque at start and 2–3 times at breakdown; servo motors typically 3 times or more for short peaks; the drive's current limit usually decides.
- **The load's breakaway torque** — static friction, a settled conveyor belt or a full mixer may need more to start than to run.

In the simulation, change the power and the motor speed and watch the torque arrows and shaft diameters: on the log–log graph a constant power is a straight line, and the gearbox slides the operating point along it.

> [!warn] A gearbox multiplies torque as well as dividing speed: a small motor through a high ratio can crush a hand or break the machine it drives before its current looks alarming. Fit guards, and a torque limiter or a current limit sized to the gearbox and the machine, not to the motor.

> [!key] P = Tω. Power tells you how much energy per second; torque tells you how big the motor, shafts, keys and couplings must be. Choose the speed to suit a standard motor and let a gearbox or belt give the torque.
`,
  ideas: [
    'Power equals torque times angular speed; in practical units P [kW] = T [N·m] × n [rpm] / 9549.',
    'For a given power, halving the speed doubles the torque — and roughly the size and cost of the motor.',
    'A gearbox divides speed by its ratio and multiplies torque by the ratio times its efficiency; it never adds power.',
    'The load sets the torque and the motor current follows; rated torque is a thermal limit, starting and peak torques are short-time limits.'
  ],
  pitfalls: [
    'A gearbox increases power — It trades speed for torque and loses a little power as heat on the way (a lot, with a high-ratio worm gear).',
    'Two motors of equal power are interchangeable — Only at the same speed. A 7.5 kW 2-pole motor gives half the torque of a 7.5 kW 4-pole motor.',
    'A motor always delivers its rated torque — It delivers what the load demands, up to its limits; the rated torque is the most it can give continuously without overheating.'
  ],
  derivation: {
    title: 'Why power is torque times angular speed',
    steps: [
      { text: 'A force $F$ at the rim of a wheel of radius $r$ moves a distance $r\\,\\Delta\\theta$ when the wheel turns by $\\Delta\\theta$, so the work done is:', tex: 'W = F\\,r\\,\\Delta\\theta = T\\,\\Delta\\theta' },
      { text: 'Power is work per unit time; dividing by $\\Delta t$ turns the angle into the angular speed:', tex: 'P = \\frac{W}{\\Delta t} = T\\,\\frac{\\Delta\\theta}{\\Delta t} = T\\,\\omega' },
      { text: 'With the speed in rpm, $\\omega = 2\\pi n/60$; for kW and N·m divide by 1000 as well:', tex: 'P\\,[\\mathrm{kW}] = \\frac{2\\pi}{60\\,000}\\,T\\,n = \\frac{T\\,n}{9549}' }
    ]
  },
  formulas: [
    {
      name: 'Power from torque and speed',
      expr: 'P = T*w', tex: 'P = T\\,\\omega',
      vars: {
        P: { name: 'mechanical power', q: 'power', unit: 'kW' },
        T: { name: 'shaft torque', q: 'torque', unit: 'N·m', value: 49.2 },
        w: { name: 'shaft speed', q: 'angvel', unit: 'rpm', value: 1455, tex: '\\omega' }
      },
      note: 'Pick any units: the calculator converts rpm to rad/s and N·m or lbf·ft to SI for you.',
      stories: { P: 'A shaft carries {T} at {w}. How much power is it transmitting?', T: 'A {P} motor turns at {w}. What is its rated torque?', w: 'At what speed does a shaft carrying {T} transmit {P}?' }
    },
    {
      name: 'Output torque of a gearbox',
      expr: 'T2 = T1*i*eta', tex: 'T_2 = T_1\\,i\\,\\eta',
      vars: {
        T2: { name: 'output torque', q: 'torque', unit: 'N·m', tex: 'T_2' },
        T1: { name: 'input (motor) torque', q: 'torque', unit: 'N·m', value: 49.2, tex: 'T_1' },
        i: { name: 'reduction ratio', value: 20 },
        eta: { name: 'gearbox efficiency', q: 'ratio', unit: '%', value: 95, min: 1, max: 100, tex: '\\eta' }
      },
      stories: { T2: 'A motor giving {T1} drives a {i}:1 gearbox of efficiency {eta}. What torque comes out?', i: 'What ratio turns {T1} into {T2} through a gearbox of efficiency {eta}?' }
    },
    {
      name: 'Output speed of a gearbox',
      expr: 'n2 = n1/i', tex: 'n_2 = \\frac{n_1}{i}',
      vars: {
        n2: { name: 'output speed', q: 'angvel', unit: 'rpm', tex: 'n_2' },
        n1: { name: 'input (motor) speed', q: 'angvel', unit: 'rpm', value: 1455, tex: 'n_1' },
        i: { name: 'reduction ratio', value: 20 }
      },
      stories: { n2: 'A {n1} motor drives a {i}:1 reduction. How fast is the output?', i: 'What ratio brings a {n1} motor down to {n2}?' }
    },
    {
      name: 'Horsepower from lbf·ft and rpm',
      expr: 'P = T*n/5252', tex: 'P = \\frac{T\\,n}{5252}',
      vars: {
        P: { name: 'power', q: false, unit: 'hp' },
        T: { name: 'torque', q: false, unit: 'lbf·ft', value: 29.8 },
        n: { name: 'speed', q: false, unit: 'rpm', value: 1765 }
      },
      note: 'The US workshop form, in fixed units: 5252 = 33,000/(2π), from Watt\'s 33,000 ft·lbf per minute.',
      stories: { T: 'A {P} motor turns at {n}. What is its full-load torque in lbf·ft?' }
    }
  ],
  examples: [
    {
      title: 'Rated torque from the nameplate',
      q: 'Find the rated torque of a 7.5 kW motor at 1455 rpm (4-pole) and at 2900 rpm (2-pole).',
      steps: [
        '$\\omega = 1455 \\times 2\\pi/60 = 152.4$ rad/s, so $T = 7500/152.4 = 49.2$ N·m.',
        '$\\omega = 2900 \\times 2\\pi/60 = 303.7$ rad/s, so $T = 7500/303.7 = 24.7$ N·m.'
      ],
      a: '49.2 N·m for the 4-pole motor, 24.7 N·m for the 2-pole — half, at twice the speed.'
    },
    {
      title: 'Choosing a conveyor drive',
      q: 'A conveyor drum needs 600 N·m at 70 rpm. A 4-pole motor (1455 rpm) drives it through a helical gearbox of 94 % efficiency. What ratio, what motor power, and is a 5.5 kW motor enough?',
      steps: [
        'Ratio: $i = 1455/70 = 20.8$.',
        'Power at the drum: $600 \\times 70 \\times 2\\pi/60 = 600 \\times 7.33 = 4.40$ kW; at the motor $4.40/0.94 = 4.68$ kW.',
        'Motor torque needed: $600/(20.8 \\times 0.94) = 30.7$ N·m, against a 5.5 kW 4-pole motor\'s rated torque of $5500/152.4 = 36.1$ N·m.',
        'It runs at 85 % of its rating in steady state; still check the starting torque against a loaded belt\'s breakaway torque.'
      ],
      a: 'A ratio of about 21, 4.7 kW at the motor: a 5.5 kW 4-pole motor fits with some margin.'
    },
    {
      title: 'An American nameplate',
      q: 'A 10 hp motor runs at 1765 rpm. What is its full-load torque in lbf·ft and N·m?',
      steps: [
        '$T = 5252 \\times 10/1765 = 29.8$ lbf·ft.',
        '$29.8 \\times 1.356 = 40.4$ N·m. (Check: $7457\\ \\mathrm{W}/(1765 \\times 2\\pi/60) = 40.3$ N·m.)'
      ],
      a: 'About 29.8 lbf·ft, or 40.4 N·m.'
    }
  ],
  quiz: [
    { q: 'Two 7.5 kW motors: one 2-pole (2900 rpm), one 4-pole (1455 rpm). Which gives more rated torque?', choices: ['The 4-pole motor, about twice as much', 'The 2-pole motor, about twice as much', 'They are equal, having equal power', 'It depends only on the voltage'], a: 0, why: 'T = P/ω: at half the speed the same power needs twice the torque, and the 4-pole motor is built bigger to give it.' },
    { q: 'A motor giving 20 N·m drives a 10:1 gearbox of 95 % efficiency. The output torque is…', choices: ['190 N·m', '200 N·m', '2 N·m', '210 N·m'], a: 0, why: 'T₂ = T₁ i η = 20 × 10 × 0.95 = 190 N·m; the speed falls tenfold.' },
    { q: 'A gearbox can increase the power available at the load.', a: false, why: 'Power passes through a gearbox and some is lost as heat; only the balance of torque and speed changes.' },
    { q: 'What is the torque of a 1 kW motor at 1000 rpm?', answer: 9.55, unit: 'N·m', why: 'T = P/ω = 1000/(1000 × 2π/60) = 1000/104.7 = 9.55 N·m.' },
    { q: 'Why is a 750 rpm motor much larger than a 3000 rpm motor of the same power?', choices: ['It must give four times the torque, and torque grows with rotor volume', 'It needs more poles, and each pole adds weight regardless of torque', 'Slow motors need thicker insulation', 'It is not larger; only the shaft differs'], a: 0, why: 'T = P/ω is four times larger, and T = (π/2)σD²L means roughly four times the rotor volume at the same shear stress.' }
  ],
  problems: [
    { q: 'What is the rated torque of a 22 kW motor at 1470 rpm?', answer: 142.9, unit: 'N·m', tol: 0.01, steps: ['$\\omega = 1470 \\times 2\\pi/60 = 153.9$ rad/s.', '$T = 22000/153.9 = 142.9$ N·m.'] },
    { q: 'A hoist drum 0.3 m in diameter lifts 500 kg at 0.2 m/s. What mechanical power does the drum deliver (ignore losses)?', answer: 0.981, unit: 'kW', tol: 0.01, steps: ['Drum torque: $T = mg\\,r = 500 \\times 9.81 \\times 0.15 = 736$ N·m.', 'Drum speed: $\\omega = v/r = 0.2/0.15 = 1.33$ rad/s (12.7 rpm).', '$P = T\\omega = 736 \\times 1.333 = 981$ W — the same as $mgv$.'] }
  ],
  choose: {
    good: [
      'Direct drive when the load runs near a standard motor speed: fans, pumps and compressors at about 1500 or 3000 rpm (1800 or 3600 rpm at 60 Hz).',
      'A 4-pole motor with a gearbox or belt for slow, high-torque loads: smaller, cheaper and more efficient than a multi-pole motor.',
      'Direct-drive [[torque-motors|torque motors]] where backlash or gear wear cannot be accepted, even though they are big for their power.'
    ],
    avoid: [
      'Sizing by power alone for loads that need high torque at low speed or at start: loaded conveyors, crushers, mixers, hoists.',
      'High-ratio worm gears where efficiency matters in continuous duty: half the power can go into heat.',
      'Slow, lightly loaded oversized motors: poor efficiency and power factor for nothing.'
    ],
    check: [
      'The torque needed at every stage: breakaway, acceleration, running and peaks — not just the running power.',
      'That the motor\'s rated speed and the gear ratio put the load at the right speed.',
      'The gearbox rating and service factor, and the shafts, keys and couplings on the slow, high-torque side.',
      'The starting and breakdown torque of the motor against the load at its lowest supply voltage.'
    ]
  },
  applications: [
    'Conveyor, mixer and hoist drives: a 4-pole motor with a helical or bevel-helical gearbox is the usual combination.',
    'Electric vehicles: motors of 10,000–20,000 rpm with a single reduction gear give high power from a small, light motor.',
    'Try your own numbers in [the axis and hoist sizing tools](#/tools/sizing/hoist).'
  ],
  history: 'James Watt defined the horsepower in the 1780s as 33,000 foot-pounds of work per minute, to sell his steam engines against the horses they replaced; the unit of power, the watt, was named after him in 1882.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — the basics chapter (torque, power and motor volume) and the chapter on load requirements and motor selection.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: rated output is the mechanical power at the shaft.',
    'IEC 60072-1: dimensions and output series of rotating electrical machines (the frame and power pairings in the table are typical catalogue assignments).'
  ],
  sim: 'mb-torque-power'
},

{
  id: 'back-emf', parent: 'electromagnetic-principles', title: 'Back-EMF: the motor as a generator', level: 2,
  short: 'The conductors of a turning motor cut the magnetic field and generate a voltage that opposes the supply — the back-EMF, proportional to speed. It sets the no-load speed, limits the running current, measures the power converted, and makes every motor a generator.',
  keywords: ['back-EMF', 'counter-EMF', 'motional EMF', 'Ke', 'Kv', 'V/krpm', 'starting current', 'stall current', 'Lenz', 'E = Kω', '4.44 f N Φ', 'regeneration', 'sensorless'],
  prereq: ['force-on-conductor', 'torque-and-power', 'physics:faradays-law'],
  related: ['motor-generator-duality', 'dc-torque-speed', 'sensorless-control', 'dol-starting', 'bldc-selection', 'physics:motional-emf', 'physics:lenzs-law'],
  body: `
A conductor moving through a magnetic field has a voltage induced along it — the same physics as a generator, $e = B\\,L\\,v$. In a motor the conductors that feel the force $F = BIL$ are moving, so each of them also generates a voltage, and by Lenz's law it **opposes** the current that is driving the motor. This is the back-EMF (or counter-EMF). For a DC or brushless motor it is simply proportional to speed:

$$E = K\\,\\omega$$

and the supply must provide it plus the resistive drop in the winding:

$$V = E + I\\,R \\qquad\\Rightarrow\\qquad I = \\frac{V - E}{R}$$

In an AC machine the flux alternates or rotates, and the RMS EMF per phase is $E = 4.44\\,f\\,N\\,\\Phi\\,k_w$, with $N$ turns in series per phase, $\\Phi$ the flux per pole and $k_w$ a winding factor of about 0.9–0.96. The number 4.44 is $2\\pi/\\sqrt 2$: the [[?angular-frequency|angular frequency]] times the peak flux linkage, converted to RMS.

### What the back-EMF does
1. **It sets the speed.** An unloaded DC motor speeds up until its back-EMF almost equals the supply; the no-load speed is about $V/K$. A motor with a speed constant $K_v$ of 1000 rpm/V reaches roughly 12,000 rpm on 12 V.
2. **It limits the running current.** Only the small difference $V - E$ drives current through the resistance. At standstill $E = 0$ and the current is $V/R$ — the starting or stall current. In the sim, press *Switch on* and watch the current leap and then fall as the speed, and with it the back-EMF, builds up.
3. **It measures the power converted.** The electrical power turned into mechanical power is exactly $E\\,I$; the rest of $V I$ is $I^2R$, heat. That is why the torque constant and the back-EMF constant are the same number in SI units: $EI = K\\omega I = T\\omega$ with $T = KI$.
4. **It makes the motor a generator.** Drive the shaft faster than the no-load speed and $E > V$: the current reverses and power flows back to the supply — regenerative braking (see [[motor-generator-duality]]).

| Motor | Motor constant $K$ | Speed constant $K_v$ | Back-EMF |
|---|---|---|---|
| Drone outrunner, 920 rpm/V | 0.0104 V·s/rad | 920 rpm/V | 1.09 V per 1000 rpm |
| 24 V, 100 W brushed DC motor | 0.055 V·s/rad | 174 rpm/V | 5.8 V per 1000 rpm |
| 48 V, 400 W brushed DC motor | 0.11 V·s/rad | 87 rpm/V | 11.5 V per 1000 rpm |

($K = 60/(2\\pi K_v) = 9.549/K_v$; servo datasheets often give the back-EMF in volts per 1000 rpm, sometimes RMS line-to-line, sometimes peak — read the footnote.)

### Starting current in real machines
A small permanent-magnet motor has a winding resistance of a few per cent to a few tens of per cent of its "rated" $V/I$, so its stall current is typically 5–20 times the rated current: brushed tools and toys survive because the battery and wiring limit it. A 100 kW DC motor, with an armature resistance of a few hundredths of an ohm, would draw twenty or more times its rated current if switched straight on; classic DC starters add resistance and cut it out in steps as the back-EMF grows, and modern drives simply limit the current. In a cage induction motor the same story explains the 5–8 times starting current of [[dol-starting|direct-on-line starting]].

### Using the back-EMF
- **Measuring a motor:** spin it with a drill, read the open-circuit voltage and the speed — the ratio is $K$, and hence the torque constant.
- **Sensorless drives** of brushless motors watch the back-EMF of the phase that is not conducting to know where the rotor is ([[sensorless-control]]).
- **Maximum speed:** a drive runs out of voltage when the back-EMF approaches its supply; above that, AC drives weaken the field.

> [!warn] A permanent-magnet motor turned by its load is a live generator even when its drive is switched off: a hoist letting a load down, a fan windmilling in a draught, a vehicle being towed. The terminals carry a voltage proportional to speed, and at overspeed it can exceed the drive's rating and destroy it. Secure the shaft before working on the wiring; the machine's manual governs.

> [!key] The back-EMF is the motor's speed signal written in volts. Speed rises until back-EMF plus resistive drop equal the supply; the current is only what the small difference drives; and E·I is the power actually converted.
`,
  ideas: [
    'A turning motor generates a back-EMF E = Kω that opposes the supply; the current is (V − E)/R.',
    'At standstill there is no back-EMF, so the starting current V/R is many times the running current.',
    'E·I is exactly the electrical power converted into mechanical power; the rest of V·I is heat in the winding.',
    'If the shaft is driven so that E exceeds V, the current reverses and the motor becomes a generator.'
  ],
  pitfalls: [
    'The back-EMF is a loss that wastes power — It is the converted power itself: E·I becomes Tω. The loss is I²R.',
    'A switched-off permanent-magnet motor is electrically dead — Turned by its load it generates a voltage proportional to speed at its terminals.',
    'The current a motor draws is set by the supply voltage — In the steady state it is set by the load torque (I = T/K); the voltage sets the speed.'
  ],
  formulas: [
    {
      name: 'Back-EMF of a DC or brushless motor',
      expr: 'E = K*w', tex: 'E = K\\,\\omega',
      vars: {
        E: { name: 'back-EMF', q: 'voltage', unit: 'V' },
        K: { name: 'back-EMF constant', q: 'kemf', unit: 'V·s/rad', value: 0.055 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 3750, tex: '\\omega' }
      },
      note: 'K in V·s/rad equals the torque constant in N·m/A. Pick V/krpm or mV/rpm in the unit menu to match a datasheet.',
      stories: { E: 'A motor with K = {K} turns at {w}. What back-EMF does it generate?', K: 'Spun at {w} by a drill, a motor shows {E} on open circuit. What is its motor constant?' }
    },
    {
      name: 'Current from the voltage balance',
      expr: 'I = (V - E)/R', tex: 'I = \\frac{V - E}{R}',
      vars: {
        I: { name: 'winding current', q: 'current', unit: 'A', signed: true },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        E: { name: 'back-EMF', q: 'voltage', unit: 'V', value: 21.6 },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 0.5 }
      },
      note: 'Negative current means E > V: the machine is generating. At standstill E = 0 and I = V/R.',
      stories: { I: 'A {V} motor of resistance {R} is running with a back-EMF of {E}. What current does it draw?', E: 'A {V} motor with R = {R} draws {I}. What is its back-EMF?' }
    },
    {
      name: 'EMF of an AC winding',
      expr: 'E = 4.44*f*N*Phi*kw', tex: 'E = 4.44\\,f\\,N\\,\\Phi\\,k_w',
      vars: {
        E: { name: 'RMS EMF per phase', q: 'voltage', unit: 'V' },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 },
        N: { name: 'turns in series per phase', q: 'count', value: 105, int: true },
        Phi: { name: 'flux per pole (peak)', q: 'flux', unit: 'mWb', value: 10, tex: '\\Phi' },
        kw: { name: 'winding factor', value: 0.93, min: 0.5, max: 1, tex: 'k_w' }
      },
      note: '4.44 = 2π/√2. The same equation sets the flux from the voltage: for a given winding, flux ∝ V/f.',
      stories: { E: 'A winding of {N} turns per phase (winding factor {kw}) carries a flux of {Phi} per pole at {f}. What EMF does it generate?', Phi: 'A winding of {N} turns, winding factor {kw}, must generate {E} at {f}. What flux per pole does it need?' }
    }
  ],
  examples: [
    {
      title: 'Switching on a 24 V motor',
      q: 'A 24 V motor has R = 0.5 Ω and K = 0.055 V·s/rad. What current flows at the moment of switch-on, and at 3750 rpm?',
      steps: [
        'At standstill $E = 0$: $I = 24/0.5 = 48$ A.',
        'At 3750 rpm, $\\omega = 392.7$ rad/s and $E = 0.055 \\times 392.7 = 21.6$ V.',
        '$I = (24 - 21.6)/0.5 = 4.8$ A — ten times less.'
      ],
      a: '48 A at switch-on, falling to 4.8 A at 3750 rpm.'
    },
    {
      title: 'Starting a large DC motor',
      q: 'A 440 V DC motor rated 250 A has an armature resistance of 0.08 Ω. What would it draw if switched straight on, and what series resistance limits the start to twice the rated current?',
      steps: [
        'Direct: $I = 440/0.08 = 5500$ A — 22 times the rated current.',
        'For 500 A the total resistance must be $440/500 = 0.88$ Ω, so add $0.88 - 0.08 = 0.80$ Ω.',
        'As the motor speeds up, the back-EMF lowers the current, and the resistance is cut out in steps (or a drive ramps the voltage).'
      ],
      a: 'About 5500 A direct; a starting resistance of 0.80 Ω limits it to 500 A.'
    },
    {
      title: 'The EMF of an induction motor winding',
      q: 'A 400 V, 50 Hz star-connected motor has 105 turns in series per phase, a winding factor of 0.93 and a flux of 10 mWb per pole. Compare its EMF with the phase voltage.',
      steps: [
        '$E = 4.44 \\times 50 \\times 105 \\times 0.010 \\times 0.93 = 217$ V.',
        'The phase voltage is $400/\\sqrt 3 = 231$ V; the remaining 14 V or so drives the current through the stator\'s resistance and leakage reactance.'
      ],
      a: 'About 217 V against 231 V per phase: the EMF takes almost all of the supply.'
    }
  ],
  quiz: [
    { q: 'A DC motor is held stalled. Its back-EMF is…', choices: ['zero, so the current is V/R', 'equal to the supply voltage', 'at its maximum', 'negative'], a: 0, why: 'Back-EMF is proportional to speed. With no speed there is nothing to oppose the supply, and only the winding resistance limits the current.' },
    { q: 'The load is removed from a running DC motor. What happens?', choices: ['It speeds up until E almost equals V, and the current falls to the no-load current', 'It keeps its speed and the current stays the same', 'It slows down because there is less current', 'The current rises because the back-EMF falls'], a: 0, why: 'Less torque means less current, less I·R drop, so more of the supply is left for back-EMF: the speed rises to about V/K.' },
    { q: 'The back-EMF is a loss mechanism that wastes part of the input power.', a: false, why: 'E·I is precisely the electrical power converted into mechanical power. The loss is the I²R in the winding (plus friction and iron losses).' },
    { q: 'Roughly what no-load speed does a 1000 rpm/V motor reach on 12 V?', answer: 12000, unit: 'rpm', why: 'No-load speed ≈ Kv × V = 1000 × 12 = 12,000 rpm (a little less because of friction and the no-load current).' },
    { q: 'A permanent-magnet hoist motor lets its load down while its drive is switched off and the brake slips. Its terminals are…', choices: ['live, with a voltage proportional to the speed', 'dead, because the drive is off', 'at exactly the supply voltage', 'short-circuited by the drive'], a: 0, why: 'A turning permanent-magnet motor always generates E = Kω; overspeed can give more than the drive can withstand.' }
  ],
  problems: [
    { q: 'Spun by a drill at 3000 rpm, a small motor shows 15.7 V at its open terminals. What is its motor constant K in V·s/rad?', answer: 0.05, unit: 'V·s/rad', tol: 0.02, steps: ['$\\omega = 3000 \\times 2\\pi/60 = 314.2$ rad/s.', '$K = E/\\omega = 15.7/314.2 = 0.050$ V·s/rad — also its torque constant in N·m/A.'] },
    { q: 'A 440 V DC motor has an armature resistance of 0.08 Ω. What series resistance limits its starting current to 500 A?', answer: 0.8, unit: 'Ω', tol: 0.01, steps: ['Total $R = 440/500 = 0.88$ Ω.', 'Added resistance $= 0.88 - 0.08 = 0.80$ Ω.'] }
  ],
  choose: {
    good: [
      'Choosing a winding for your supply: pick K (or Kv) so that the no-load speed V/K is 10–30 % above the speed you need at full load.',
      'Regenerative braking and energy recovery in machines that lower loads or stop large inertias often.',
      'Sensorless brushless drives for fans, pumps and propellers, which start easily and run above a few per cent of full speed.'
    ],
    avoid: [
      'Switching a large motor straight onto a stiff supply without a current limit, starter or drive.',
      'Permanent-magnet motors that the load can drive to overspeed without a drive, brake or protection able to take the generated voltage.'
    ],
    check: [
      'The back-EMF constant and its units on the datasheet (V/krpm RMS or peak, line-to-line or phase).',
      'The back-EMF at the highest speed the load can reach, against the drive\'s voltage rating.',
      'The stall current V/R against the driver\'s current limit, fuses and wiring.'
    ]
  },
  applications: [
    'Hobby and drone motors are specified by Kv (rpm per volt): the back-EMF constant turned upside down.',
    'Motor testing: the open-circuit voltage of a spun permanent-magnet motor tells whether its magnets have weakened.',
    'Electric vehicles and lifts recover braking energy by letting the back-EMF drive current back into the battery or supply.'
  ],
  history: 'Moritz Jacobi built one of the first practical rotating electric motors in 1834 and in 1839 drove a boat on the river Neva with battery-powered motors. Working in St Petersburg alongside Heinrich Lenz — whose rule of 1834 gives the direction of the back-EMF — he showed that a motor fed from a battery gives its greatest power when its back-EMF is half the battery voltage, a result still called Jacobi\'s law of maximum power.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — the chapters on conventional DC motors (motional EMF, the voltage equation, starting) and on induction motors.',
    'Chapman, *Electric Machinery Fundamentals* — the induced voltage of AC windings and the DC machine equations.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery* — the generated voltage of AC and DC machines.'
  ],
  sim: ['mb-back-emf', 'mb-four-quadrant']
},

{
  id: 'magnetic-circuits', parent: 'electromagnetic-principles', title: 'Magnetic circuits, iron and saturation', level: 2,
  short: 'Flux follows iron as current follows copper: ampere-turns drive it through the reluctance of the path, and the thin air gap needs most of them. Iron saturates near 1.5–2 T, loses energy each cycle (hysteresis and eddy currents), and the supply voltage and frequency set the flux — the reason for V/f.',
  keywords: ['magnetic circuit', 'reluctance', 'MMF', 'ampere-turns', 'permeability', 'air gap', 'saturation', 'B–H curve', 'magnetising current', 'iron loss', 'hysteresis', 'eddy currents', 'laminations', 'electrical steel', 'V/f', 'flux'],
  prereq: ['force-on-conductor', 'physics:magnetic-flux', 'physics:magnetic-materials'],
  related: ['back-emf', 'efficiency-losses', 'power-factor', 'v-over-f-control', 'pmsm-motor', 'motor-noise', 'physics:inductance', 'physics:solenoid'],
  body: `
A motor needs a strong magnetic field across its air gap, and it gets it from a **magnetic circuit**: a loop of steel — stator yoke, stator teeth, air gap, rotor teeth, rotor core, air gap again — around which a winding pushes flux. The analogy with an electric circuit is close enough to calculate with:

| Electric circuit | Magnetic circuit |
|---|---|
| EMF (V) | magnetomotive force $\\Theta = N I$ (ampere-turns) |
| current $I$ (A) | flux $\\Phi$ (Wb) |
| resistance $R = l/(\\sigma A)$ | reluctance $\\mathcal{R} = l/(\\mu_0 \\mu_r A)$ |
| $V = IR$ | $\\Theta = \\Phi\\,\\mathcal{R}$ |

### The air gap takes almost everything
Electrical steel has a relative permeability of a few thousand below saturation; air has 1. So half a millimetre of air has as much reluctance as a metre or more of unsaturated steel. For a flux density $B$ in the gap $g$ and a steel path $l_{\\mathrm{Fe}}$:

$$\\Theta = \\frac{B}{\\mu_0}\\left(g + \\frac{l_{\\mathrm{Fe}}}{\\mu_r}\\right)$$

At 0.8 T a 0.5 mm gap needs 318 ampere-turns while 300 mm of steel at $\\mu_r$ = 3000 needs 64. That is why air gaps are as small as bearings and manufacturing allow: roughly 0.25–0.4 mm in small induction motors, about 0.4–0.6 mm around 10 kW, 1–3 mm in large machines. A worn bearing or a bent shaft that lets the rotor touch the stator (a *rotor rub*) is a serious fault precisely because the gap is so thin.

In a permanent-magnet motor the magnets themselves sit in the gap and have a permeability close to that of air, so the effective gap is several millimetres: the magnets supply the flux, the winding needs no magnetising current, and the inductance is low. That is one reason PM motors have a higher power factor and efficiency than induction motors.

### Saturation
Steel is nearly linear only up to a knee around 1.4–1.6 T; beyond it each extra tenth of a tesla costs far more ampere-turns, and near 2 T the steel adds little more than air would (cobalt–iron alloys reach about 2.3 T but are costly and used mainly in aerospace). Designers run the teeth at about 1.5–1.8 T and the yokes a little lower, so the flux in the gap is capped near 1 T whatever the current. In the sim, raise the current or shrink the gap and watch the operating point climb the B–H curve and bend over.

In an induction motor the magnetising current is large — typically 25–60 % of the rated current, higher in small and slow motors — and it is almost purely reactive. It is why an induction motor's [[power-factor]] is well below 1, and why its no-load current is far from zero.

### Voltage and frequency set the flux
For an AC winding $V \\approx E = 4.44\\,f\\,N\\,\\hat\\Phi$: the flux is fixed by the voltage divided by the frequency. Consequences:
- **10 % overvoltage** means 10 % more flux, which near the knee can mean 20–50 % more magnetising current and extra iron loss.
- **A 60 Hz motor on 50 Hz at the same voltage** gets 20 % more flux: it saturates, draws a large magnetising current and runs hot — reduce the voltage by the same ratio.
- **A variable-frequency drive** keeps the flux constant by keeping $V/f$ constant ([[v-over-f-control]]). Switch the sim to AC and lower the frequency at full voltage: the magnetising current turns into sharp peaks — saturation you would see on a current probe.

### Iron losses
Each magnetic cycle costs energy in the steel. **Hysteresis** loss grows in [[?proportional|proportion]] to the frequency and roughly as the square of the peak flux density; **eddy-current** loss grows as the square of frequency, flux density and lamination thickness. So cores are stacks of insulated laminations, typically 0.5 mm in industrial motors (0.35–0.65 mm), 0.1–0.35 mm in high-speed motors. Steel grades are named by their loss: in the European naming a grade like M400-50A loses at most 4.00 W/kg at 1.5 T and 50 Hz and is 0.50 mm thick. At a fixed voltage and frequency the iron loss is roughly constant from no load to full load (see [[efficiency-losses]]).

> [!tip] Real-life clues: a motor that hums loudly and runs warm at no load may be over-fluxed (voltage too high, or a V/f setting too steep). A core overheated by a badly controlled burn-off during rewinding keeps higher iron losses for the rest of its life — good rewind shops measure the core loss before and after.

> [!key] Ampere-turns drive flux through reluctance, and the air gap takes most of them. Iron saturates near 1.5–2 T, so the gap field is capped near 1 T; the supply's V/f sets the flux; and every cycle costs hysteresis and eddy losses in the laminations.
`,
  ideas: [
    'A magnetic circuit obeys Θ = Φℛ: ampere-turns drive flux through reluctance, as a voltage drives current through resistance.',
    'The air gap has far more reluctance than the steel, so it takes most of the magnetising ampere-turns.',
    'Steel saturates from about 1.5 T; the gap flux of a motor is therefore limited to roughly 1 T.',
    'For AC windings the flux is set by V/f: overvoltage or low frequency saturates the iron and the magnetising current soars.',
    'Iron losses (hysteresis and eddy currents) rise with frequency and flux density; laminations keep the eddy part small.'
  ],
  pitfalls: [
    'More current always gives proportionally more flux — Only below the knee of the B–H curve. In saturation extra current brings little flux but a lot of heat.',
    'The steel needs most of the magnetising current — The half-millimetre air gap usually needs several times more ampere-turns than the whole steel path.',
    'A 60 Hz motor runs happily on 50 Hz, just slower — At the same voltage it carries 20 % more flux and may saturate and overheat; the voltage must be reduced in proportion.'
  ],
  formulas: [
    {
      name: 'Ampere-turns for an air gap and a steel path',
      expr: 'Theta = B/mu0*(g + l/mur)', tex: '\\Theta = \\frac{B}{\\mu_0}\\left(g + \\frac{l_{\\mathrm{Fe}}}{\\mu_r}\\right)',
      vars: {
        Theta: { name: 'magnetomotive force (ampere-turns)', q: 'current', unit: 'A', tex: '\\Theta' },
        B: { name: 'flux density', q: 'bfield', unit: 'T', value: 0.8 },
        mu0: { const: 'mu0' },
        g: { name: 'air-gap length', q: 'length', unit: 'mm', value: 0.5 },
        l: { name: 'steel path length', q: 'length', unit: 'mm', value: 300, tex: 'l_{\\mathrm{Fe}}' },
        mur: { name: 'relative permeability of the steel', value: 3000, tex: '\\mu_r' }
      },
      note: 'Linear steel (below the knee of its B–H curve) and the same cross-section all round. The gap term usually dominates.',
      stories: { Theta: 'How many ampere-turns drive {B} across a {g} gap and {l} of steel with μr = {mur}?', B: 'A coil gives {Theta} to a circuit with a {g} gap and {l} of steel (μr = {mur}). What flux density results?' }
    },
    {
      name: 'Reluctance of a path',
      expr: 'Rm = l/(mu0*mur*A)', tex: '\\mathcal{R} = \\frac{l}{\\mu_0\\,\\mu_r\\,A}',
      vars: {
        Rm: { name: 'reluctance', unit: 'A/Wb', tex: '\\mathcal{R}' },
        l: { name: 'path length', q: 'length', unit: 'mm', value: 0.5 },
        mu0: { const: 'mu0' },
        mur: { name: 'relative permeability', value: 1, tex: '\\mu_r' },
        A: { name: 'cross-section', q: 'area', unit: 'cm²', value: 100 }
      },
      note: 'For air μr = 1; for unsaturated electrical steel a few thousand. Reluctances in series add, like resistances.',
      stories: { Rm: 'What is the reluctance of a path {l} long with cross-section {A} and μr = {mur}?' }
    },
    {
      name: 'Flux set by voltage and frequency',
      expr: 'Phi = V/(4.44*f*N)', tex: '\\hat\\Phi = \\frac{V}{4.44\\,f\\,N}',
      vars: {
        Phi: { name: 'peak flux', q: 'flux', unit: 'mWb', tex: '\\hat\\Phi' },
        V: { name: 'RMS voltage across the winding', q: 'voltage', unit: 'V', value: 230 },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        N: { name: 'turns', q: 'count', value: 105, int: true }
      },
      note: 'The voltage drop in the winding and the winding factor are neglected. Constant V/f means constant flux.',
      stories: { Phi: 'A winding of {N} turns sits across {V} at {f}. What peak flux does it force through its core?', V: 'What voltage keeps the flux at {Phi} in a winding of {N} turns at {f}?' }
    }
  ],
  examples: [
    {
      title: 'Where the ampere-turns go',
      q: 'A magnetic circuit has a 0.5 mm air gap and 300 mm of steel with μr = 3000. How many ampere-turns give 0.8 T, and how are they shared?',
      steps: [
        '$B/\\mu_0 = 0.8/(4\\pi \\times 10^{-7}) = 636{,}600$ A/m.',
        'Gap: $636{,}600 \\times 0.0005 = 318$ A; steel: $636{,}600 \\times 0.3/3000 = 64$ A.',
        'Total 382 ampere-turns, 83 % of them for half a millimetre of air.'
      ],
      a: 'About 382 ampere-turns, of which the gap takes 318.'
    },
    {
      title: 'A 60 Hz motor on a 50 Hz supply',
      q: 'A motor wound for 460 V, 60 Hz is connected to 460 V at 50 Hz. By how much does its flux change, and what voltage would keep the flux as designed?',
      steps: [
        'Flux ∝ V/f: $(460/50)/(460/60) = 60/50 = 1.2$ — 20 % more flux, well into saturation.',
        'To keep the flux: $V = 460 \\times 50/60 = 383$ V.'
      ],
      a: '20 % more flux at 460 V; about 383 V at 50 Hz keeps it as designed.'
    }
  ],
  quiz: [
    { q: 'In a motor\'s magnetic circuit, which part needs the most ampere-turns?', choices: ['The air gap, although it is under a millimetre long', 'The stator yoke, because it is the longest', 'The rotor core', 'The shaft'], a: 0, why: 'Steel has a permeability of thousands, air of one: the gap\'s reluctance dominates unless the steel is saturated.' },
    { q: 'A VFD drives a 400 V, 50 Hz motor at 25 Hz. To keep the flux constant the voltage should be about…', choices: ['200 V', '400 V', '100 V', '566 V'], a: 0, why: 'Flux ∝ V/f, so halving the frequency calls for half the voltage (plus a little boost at low speed for the winding resistance).' },
    { q: 'Why are motor cores made of thin insulated laminations rather than solid steel?', choices: ['To keep eddy-current losses small', 'To make the core lighter', 'To reduce hysteresis to zero', 'To increase the air gap'], a: 0, why: 'Eddy-current loss grows with the square of the lamination thickness; hysteresis loss depends on the steel grade, not the thickness.' },
    { q: 'A permanent-magnet motor has a higher power factor than an induction motor mainly because…', choices: ['its magnets supply the flux, so it needs no magnetising current', 'its air gap is smaller', 'it runs at synchronous speed', 'its laminations are thinner'], a: 0, why: 'An induction motor takes its magnetising current from the supply, 90° out of phase with the voltage; the magnets make that unnecessary.' },
    { q: 'A motor at 10 % overvoltage draws a magnetising current only 10 % higher.', a: false, why: 'Near the knee of the B–H curve 10 % more flux can take 20–50 % more magnetising current, and the iron losses rise too.' }
  ],
  problems: [
    { q: 'Neglecting the steel, how many ampere-turns drive 1.0 T across a 0.6 mm air gap?', answer: 477, unit: 'A', tol: 0.01, steps: ['$\\Theta = B g/\\mu_0 = 1.0 \\times 0.0006/(4\\pi \\times 10^{-7})$.', '$\\Theta = 477$ ampere-turns.'] },
    { q: 'A 50 Hz motor is run from a 60 Hz supply at the same voltage. What percentage of its design flux does it carry?', answer: 83.3, unit: '%', tol: 0.01, steps: ['Flux ∝ V/f: $50/60 = 0.833$.', 'It carries 83 % of its design flux (and so gives less torque per ampere at full load).'] }
  ],
  choose: {
    good: [
      'Running a 400 V, 50 Hz motor on 460 V, 60 Hz: nearly the same V/f and about 20 % faster; many IEC motors carry such a rating on the plate.',
      'Keeping V/f constant on a variable-frequency drive below base speed, with a little voltage boost at low frequency.'
    ],
    avoid: [
      'A 60 Hz motor on 50 Hz at full voltage: 20 % extra flux, saturation and overheating.',
      'Supply voltages persistently above the rated value: magnetising current and iron losses rise faster than the voltage.',
      'Rewinding with a burn-off at uncontrolled temperature: damaged interlaminar insulation raises the core losses for good.'
    ],
    check: [
      'The supply against the motor\'s rating: IEC 60034-1 zone A allows ±5 % voltage and ±2 % frequency in continuous duty (zone B ±10 % and +3/−5 %, with more heating).',
      'The no-load current and noise of a motor after rewinding or on a new supply.',
      'The drive\'s V/f or motor-data settings, so that the flux is right at every speed.'
    ]
  },
  applications: [
    'Electromagnets, relays, contactors and solenoids use the same circuit: a big gap when open needs many ampere-turns, a closed gap needs few — hence the high pull-in and low holding current.',
    'Transformers and motors are designed near the knee of the steel\'s B–H curve: the cheapest core that does not saturate at the highest expected voltage.',
    'High-speed spindles and aerospace motors use thin laminations and low-loss steels because iron loss rises steeply with frequency.'
  ],
  history: 'John and Edward Hopkinson treated the magnetic circuit of a dynamo with an "Ohm\'s law" of reluctance in their 1886 paper on dynamo design, turning dynamo design from trial and error into calculation; Charles Proteus Steinmetz published his empirical law of hysteresis loss in 1892.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — chapter 1 on magnetic circuits, reluctance, the air gap and saturation.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery* — magnetic circuits and magnetic materials, core losses.',
    'EN 10106: cold-rolled non-oriented electrical steel strip delivered in the fully processed state — the grade naming by loss and thickness.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: voltage and frequency variations (zones A and B).'
  ],
  sim: 'mb-magnetic-circuit'
},

{
  id: 'motor-generator-duality', parent: 'electromagnetic-principles', title: 'Motors and generators: one machine, two directions', level: 2,
  short: 'The same machine turns electrical power into mechanical power or back again; only the direction of the energy flow differs. Driving, braking and regenerating are the four quadrants of torque and speed — and the braking energy has to go somewhere: back to the supply, into a resistor, or into the motor as heat.',
  keywords: ['generator', 'regeneration', 'regenerative braking', 'four quadrants', 'motoring', 'braking', 'negative slip', 'induction generator', 'plugging', 'DC injection', 'brake chopper', 'braking resistor', 'active front end', 'DC-bus overvoltage', 'hoist lowering'],
  prereq: ['back-emf', 'torque-and-power', 'physics:generators'],
  related: ['vfd-braking', 'dc-braking', 'h-bridge', 'slip-and-speed', 'motors-conveyors-hoists', 'motors-vehicles', 'motor-brakes', 'physics:rotational-kinetic-energy'],
  body: `
Nothing inside a motor knows whether it is a motor. Drive current through it against a load and it motors; turn its shaft from outside and it generates. What changes is only the sign of the power: electrical in and mechanical out, or mechanical in and electrical out.

- **DC and brushless machines:** motoring while the supply voltage exceeds the back-EMF ($V > E$); generating when the shaft is driven fast enough that $E > V$ and the current reverses (see [[back-emf]]).
- **Induction machines:** motoring below synchronous speed (positive slip); generating above it (negative slip, typically 1–3 % above synchronous speed at full power); braking hard when turned against the field (slip above 1).
- **Synchronous and PM machines:** motoring when the rotor lags the rotating field, generating when it leads.

### The four quadrants
Plot torque across and speed up the page. Where torque and speed have the same sign the machine drives its load; where they have opposite signs it brakes it — and the energy of braking flows back towards the supply.

| Quadrant | Torque | Speed | What happens | Everyday example |
|---|---|---|---|---|
| I | + | + | forward motoring | a conveyor carrying goods uphill |
| II | − | + | forward braking (generating) | a car slowing with regenerative braking |
| III | − | − | reverse motoring | a crane hoisting in reverse, a vehicle reversing |
| IV | + | − | reverse braking (generating) | a hoist lowering a load, holding it up while turning backwards |

In the simulation a DC motor holds a load on a hoist. Lower the voltage below the drop $IR$ and the load sinks: the operating point crosses into quadrant IV, the machine is still pushing up but turning backwards, and the falling load's power flows back into the supply (minus the heat in the winding).

### Where does the braking energy go?
Stopping a machine means taking its kinetic energy $\\tfrac12 J\\omega^2$ out, and lowering a load means taking its potential energy $mgh$ out. The choices:

| Method | Where the energy goes | Typical use |
|---|---|---|
| Regeneration to the supply | battery, DC bus shared with other drives, or the mains via a regenerative (active-front-end) drive | electric vehicles, lifts, cranes, test benches, downhill conveyors |
| Brake chopper and resistor | a resistor on the drive's DC bus | frequent stops of large inertias on standard VFDs |
| DC injection braking | the rotor and stator, as heat | occasional stops of small induction motors |
| Plugging (reversing the phase sequence) | the rotor, as heat — three times the stored kinetic energy | rarely justified today |
| Mechanical brake | brake linings, as heat | holding, emergency stops, parking |

A standard VFD has a diode rectifier that cannot send power back to the mains. When the motor regenerates, the power charges the drive's DC-bus capacitors; on a 400 V drive the bus normally sits near 540–560 V, and when regeneration pushes it towards the trip level (commonly around 750–800 V) the drive stops with an overvoltage fault. Too short a deceleration ramp on a big fan or flywheel is the classic cause: lengthen the ramp, add a brake chopper and resistor, or use a regenerative unit (see [[vfd-braking]]).

### Induction generators
An induction machine pushed above synchronous speed feeds power into the grid, but it still takes its magnetising (reactive) current from the grid; on its own it needs capacitors to self-excite. Small hydro plants and older fixed-speed wind turbines used exactly such cage machines, turning a percent or two above synchronous speed.

> [!warn] Regeneration is not a holding brake. When a drive trips, loses power or is switched off, the braking torque disappears and a load can run away. Lifting and inclined machines need a spring-applied holding brake and safety functions designed to the machinery standards (ISO 13849-1, IEC 60204-1), and a load must be lowered or secured before anyone works under it.

> [!key] A motor and a generator are the same machine; the signs of torque and speed decide which. Every time a machine brakes, its energy goes somewhere — plan where, before a drive trips or a motor overheats.
`,
  ideas: [
    'The same machine motors or generates; only the direction of the energy flow changes.',
    'In the four quadrants of torque and speed, same signs mean driving, opposite signs mean braking (generating).',
    'An induction machine generates above synchronous speed (negative slip) and needs reactive power from the grid or capacitors.',
    'Braking energy must go to the supply, a resistor, the motor itself or a mechanical brake; a standard VFD trips on DC-bus overvoltage if nothing takes it.'
  ],
  pitfalls: [
    'A motor lowering a load is motoring because it is turning — It is braking: its torque holds the load up while it turns backwards, and the load drives it as a generator (quadrant IV).',
    'Regenerative braking can replace a mechanical holding brake — It vanishes with the power or the drive; loads must be held by a brake designed for it.',
    'Plugging is a free way to stop a cage motor quickly — It dumps three times the stored kinetic energy into the rotor as heat.'
  ],
  formulas: [
    {
      name: 'Current of a DC machine, motoring or generating',
      expr: 'I = (V - K*w)/R', tex: 'I = \\frac{V - K\\,\\omega}{R}',
      vars: {
        I: { name: 'armature current (negative: generating)', q: 'current', unit: 'A', signed: true },
        V: { name: 'terminal voltage', q: 'voltage', unit: 'V', value: 24, signed: true },
        K: { name: 'motor constant', q: 'kemf', unit: 'V·s/rad', value: 0.055 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 4500, signed: true, tex: '\\omega' },
        R: { name: 'armature resistance', q: 'resistance', unit: 'Ω', value: 0.5 }
      },
      note: 'Above the no-load speed V/K the current is negative: power flows back to the supply.',
      stories: { I: 'A {V} machine with K = {K} and R = {R} is driven by its load at {w}. What current flows, and which way?', w: 'At what speed does a {V} machine with K = {K} and R = {R} carry {I}?' }
    },
    {
      name: 'Slip of an induction machine',
      expr: 's = (ns - n)/ns', tex: 's = \\frac{n_s - n}{n_s}',
      vars: {
        s: { name: 'slip (negative: generating)', q: 'ratio', unit: '%', signed: true },
        ns: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: 'n_s' },
        n: { name: 'rotor speed', q: 'angvel', unit: 'rpm', value: 1530, signed: true }
      },
      note: 'Motoring for 0 < s < 1, generating for s < 0, braking against the field for s > 1.',
      stories: { s: 'A 4-pole induction machine on 50 Hz (synchronous {ns}) is driven at {n}. What is its slip?' }
    },
    {
      name: 'Energy recovered when slowing a machine',
      expr: 'E = 0.5*J*(w1^2 - w2^2)*eta', tex: 'E = \\tfrac12\\,J\\left(\\omega_1^2 - \\omega_2^2\\right)\\eta',
      vars: {
        E: { name: 'energy returned', q: 'energy', unit: 'kJ' },
        J: { name: 'moment of inertia of the whole drive train', q: 'inertia', unit: 'kg·m²', value: 2 },
        w1: { name: 'speed before', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega_1' },
        w2: { name: 'speed after', q: 'angvel', unit: 'rpm', value: 300, tex: '\\omega_2' },
        eta: { name: 'efficiency of motor and drive while generating', q: 'ratio', unit: '%', value: 85, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'Friction and the load\'s own drag take part of the energy before it reaches the motor; this is the most that can come back.',
      stories: { E: 'A drive train of {J} slows from {w1} to {w2} with a regenerative efficiency of {eta}. How much energy comes back?' }
    },
    {
      name: 'Rotor heat during a speed change of an induction motor',
      expr: 'Q = 0.5*J*ws^2*(s1^2 - s2^2)', tex: 'Q = \\tfrac12\\,J\\,\\omega_s^2\\left(s_1^2 - s_2^2\\right)',
      vars: {
        Q: { name: 'heat in the rotor', q: 'energy', unit: 'kJ' },
        J: { name: 'inertia of rotor and load', q: 'inertia', unit: 'kg·m²', value: 0.1 },
        ws: { name: 'synchronous speed', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega_s' },
        s1: { name: 'slip at the start of the change', value: 2, min: 0, max: 2, tex: 's_1' },
        s2: { name: 'slip at the end', value: 1, min: 0, max: 2, tex: 's_2' }
      },
      note: 'No load torque. A start from rest is s = 1 → 0 (heat equal to the kinetic energy gained); plugging to standstill is s = 2 → 1 (three times the kinetic energy lost).',
      stories: { Q: 'An induction motor with {J} on its shaft is plugged from full speed (slip {s1}) to standstill (slip {s2}); synchronous speed {ws}. How much heat goes into the rotor?' }
    }
  ],
  examples: [
    {
      title: 'Lowering a load with a DC hoist',
      q: 'A 48 V hoist motor (R = 0.12 Ω, K = 0.11 V·s/rad) holds a load that needs 1.5 N·m at the motor shaft. What armature voltage lowers the load with the motor turning at 1000 rpm backwards, and where does the power go?',
      steps: [
        'The torque holds the load up, so the current is $I = T/K = 1.5/0.11 = 13.6$ A, positive.',
        'Speed $-1000$ rpm $= -104.7$ rad/s, so $E = 0.11 \\times (-104.7) = -11.5$ V.',
        '$V = E + IR = -11.5 + 13.6 \\times 0.12 = -9.9$ V.',
        'Power: the falling load gives $1.5 \\times 104.7 = 157$ W; the winding heats with $13.6^2 \\times 0.12 = 22$ W; the supply receives $9.9 \\times 13.6 = 135$ W.'
      ],
      a: 'About −9.9 V: quadrant IV, with 135 W flowing back to the supply and 22 W lost in the winding.'
    },
    {
      title: 'Stopping a big fan on a VFD',
      q: 'A 7.5 kW fan drive has a total inertia of 1.5 kg·m² and runs at 1470 rpm. It is ramped to rest in 5 s. How much energy must the drive absorb, and at what peak power, if the fan\'s own drag is ignored?',
      steps: [
        '$\\omega = 1470 \\times 2\\pi/60 = 153.9$ rad/s; kinetic energy $\\tfrac12 \\times 1.5 \\times 153.9^2 = 17.8$ kJ.',
        'A linear ramp needs a constant braking torque, $J\\omega/t = 1.5 \\times 153.9/5 = 46$ N·m, so the braking power $T\\omega$ is largest at the start: $46 \\times 153.9 = 7.1$ kW, averaging 3.6 kW.',
        'Without a brake chopper the DC bus would rise and trip the drive; the fan\'s drag helps, but safely you lengthen the ramp or fit a resistor rated for 7 kW peaks and 18 kJ per stop.'
      ],
      a: 'About 18 kJ per stop, with a peak near 7 kW.'
    },
    {
      title: 'The price of plugging',
      q: 'A motor and load with 0.1 kg·m² run at close to 1500 rpm (4-pole, 50 Hz). How much heat goes into the rotor when the motor is plugged to a stop, compared with the kinetic energy?',
      steps: [
        '$\\omega_s = 157.1$ rad/s; kinetic energy $\\tfrac12 \\times 0.1 \\times 157.1^2 = 1.23$ kJ.',
        'Plugging takes the slip from 2 to 1: $Q = \\tfrac12 \\times 0.1 \\times 157.1^2 \\times (4 - 1) = 3.70$ kJ.'
      ],
      a: '3.7 kJ of rotor heat — three times the 1.23 kJ of kinetic energy removed.'
    }
  ],
  quiz: [
    { q: 'A hoist motor holds its load and turns backwards to lower it. Which quadrant is it in?', choices: ['IV: positive torque, negative speed — braking, generating', 'I: forward motoring', 'III: reverse motoring', 'II: forward braking'], a: 0, why: 'The torque still acts upwards (holding the load) while the shaft turns in the lowering direction: opposite signs mean braking, and the load drives the machine as a generator.' },
    { q: 'An induction motor on the mains is driven above its synchronous speed. It…', choices: ['generates, feeding power into the supply', 'stops producing any torque', 'motors harder', 'burns out immediately'], a: 0, why: 'Negative slip reverses the rotor currents and the torque: the machine now brakes the shaft and delivers power, though it still takes its magnetising current from the grid.' },
    { q: 'A standard VFD trips with "DC-bus overvoltage" when it stops a large fan quickly. Why?', choices: ['The regenerated energy charges the DC-bus capacitors and the diode rectifier cannot return it to the mains', 'The mains voltage rose', 'The motor draws too much current when stopping', 'The fan speeds up as it stops'], a: 0, why: 'While decelerating, the motor generates. Without a brake chopper or regenerative front end the only place for the energy is the bus capacitors, so their voltage rises to the trip level.' },
    { q: 'Plugging a cage motor to a stop puts about how much heat into its rotor?', choices: ['Three times the kinetic energy removed', 'Exactly the kinetic energy removed', 'Nothing: it returns to the mains', 'Half the kinetic energy'], a: 0, why: 'Rotor heat is ½Jω_s²(s₁² − s₂²); plugging goes from s = 2 to s = 1, giving 3 × ½Jω_s².' },
    { q: 'Regenerative braking in a drive can be relied on to hold a suspended load safely.', a: false, why: 'It disappears on a trip, power loss or fault; lifting machines need a mechanical holding brake and properly designed safety functions.' }
  ],
  problems: [
    { q: 'A 24 V machine with K = 0.055 V·s/rad and R = 0.5 Ω is driven by its load at 4500 rpm. What current flows? (Negative means into the supply.)', answer: -3.84, unit: 'A', tol: 0.02, steps: ['$E = 0.055 \\times 471.2 = 25.9$ V.', '$I = (24 - 25.9)/0.5 = -3.84$ A: the machine is generating.'] },
    { q: 'A flywheel drive of 2 kg·m² slows from 1500 to 300 rpm with a regenerative efficiency of 85 %. How much energy comes back?', answer: 20.1, unit: 'kJ', tol: 0.02, steps: ['$\\omega_1 = 157.1$, $\\omega_2 = 31.4$ rad/s.', '$\\tfrac12 \\times 2 \\times (157.1^2 - 31.4^2) = 23.7$ kJ; × 0.85 = 20.1 kJ.'] }
  ],
  choose: {
    good: [
      'Regenerative drives (active front end, or a shared DC bus) where braking is large and frequent: cranes, lifts, downhill conveyors, winders, test benches.',
      'A brake chopper and resistor on a standard VFD for occasional hard stops of large inertias.',
      'DC injection braking for occasional stops of small induction motors where no resistor is fitted.'
    ],
    avoid: [
      'Plugging for frequent stops: rotor heating of three times the kinetic energy each time.',
      'Relying on the drive to hold or stop a load where a failure would be dangerous — use a holding brake and designed safety functions.',
      'Very short deceleration ramps on high-inertia loads with a drive that has no braking resistor.'
    ],
    check: [
      'The energy per stop and stops per hour, to size a braking resistor for both its peak power and its average heating.',
      'Whether the supply can accept power: a full battery, a generator set or a weak supply may not.',
      'The motor\'s thermal capacity for DC injection or frequent braking.'
    ]
  },
  applications: [
    'Electric and hybrid vehicles recover part of their braking energy through the traction motor running as a generator.',
    'Cranes and lifts lower loads in quadrant IV; regenerative drives return the energy instead of burning it in resistors.',
    'Dynamometers and motor test benches use one machine as a load for another, feeding the power back to the grid.'
  ],
  history: 'At the 1873 Vienna exhibition, according to the well-known account, a Gramme dynamo connected by mistake to another running machine started to turn as a motor — a public demonstration that the dynamo and the motor are the same machine, credited to Hippolyte Fontaine.',
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — four-quadrant operation, regenerative braking and plugging in the DC and induction motor chapters.',
    'Mohan, *Electric Drives: An Integrative Approach* — the four quadrants of a drive, regenerative braking and the drive\'s DC bus.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines*, and ISO 13849-1 for stopping and holding functions.'
  ],
  sim: 'mb-four-quadrant'
},

{
  id: 'power-units', parent: 'motor-ratings', title: 'Power: kW, hp and what they measure', level: 1,
  short: 'A motor\'s rated power is the mechanical power at its shaft, in kW (IEC) or horsepower (NEMA: 1 hp = 745.7 W; the metric PS = 735.5 W). The power it draws from the supply is larger by the losses, and the current follows from the voltage, efficiency and power factor.',
  keywords: ['kW', 'horsepower', 'hp', 'PS', 'CV', 'metric horsepower', 'rated output', 'input power', 'apparent power', 'kVA', 'current per kW', 'IEC power ratings', 'NEMA hp', 'kWh', 'energy'],
  prereq: ['torque-and-power', 'physics:power'],
  related: ['efficiency-losses', 'power-factor', 'nameplate-reading', 'motor-standards', 'motor-life-cost', 'electronics:three-phase', 'hydraulics:pressure-flow-power'],
  body: `
Power is energy per second, measured in watts. On a motor, three different powers are easy to confuse:

- **Rated output** — the mechanical power the shaft can deliver continuously. This is the number on the nameplate, in kW or hp, for every IEC and NEMA motor.
- **Electrical input** — the output plus the losses: $P_{\\mathrm{in}} = P_{\\mathrm{out}}/\\eta$. A 7.5 kW motor of 90.4 % efficiency draws 8.3 kW.
- **Apparent power** — volts times amperes (times $\\sqrt3$ for three-phase), in kVA. It is larger still, because an induction motor also draws reactive current to magnetise itself (see [[power-factor]]). Cables, fuses, transformers and generator sets must carry the kVA, not just the kW.

### Horsepower, and which one
| Unit | Watts | Where you meet it |
|---|---|---|
| kilowatt (kW) | 1000 | IEC motors, drives, electricity bills |
| horsepower (hp, "mechanical") | 745.7 | NEMA motors, US catalogues, pumps |
| metric horsepower (PS, CV, ch, pk) | 735.5 | engines and cars in Europe, older plates |
| electrical horsepower | 746 | older US electrical practice |

The mechanical horsepower is James Watt's 550 foot-pounds per second; the metric one is 75 kilogram-force metres per second — 1.4 % smaller. For motors, 1 hp ≈ 0.75 kW is close enough to translate ratings: IEC and NEMA series were built to match each other.

| IEC kW | 0.37 | 0.55 | 0.75 | 1.1 | 1.5 | 2.2 | 4 | 5.5 | 7.5 | 11 | 15 | 18.5 | 22 | 30 | 37 | 45 | 55 | 75 | 90 | 110 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| NEMA hp | ½ | ¾ | 1 | 1½ | 2 | 3 | 5 | 7½ | 10 | 15 | 20 | 25 | 30 | 40 | 50 | 60 | 75 | 100 | 125 | 150 |

(4 kW is 5.4 hp; some markets also build 3.7 kW motors as the "5 hp" size.)

### From power to current
For a three-phase motor the line current at rated output is

$$I = \\frac{P_{\\mathrm{out}}}{\\sqrt3\\,V\\,\\eta\\,\\mathrm{PF}}$$

with $\\mathrm{PF}$ the power factor, the $\\cos\\varphi$ of the nameplate. Useful rules of thumb for 4-pole motors, *to be checked against the plate*: about 2 A per kW at 400 V for mid sizes (7.5 kW: 14.6 A), more for small motors (0.75 kW: about 1.75 A, 2.3 A/kW) and a little less for large ones (75 kW: about 132 A); about 1.4 A per hp at 460 V. A single-phase 0.75 kW capacitor motor on 230 V draws roughly 5 A.

### Rated, peak and "sales" power
- An industrial motor's rating is **continuous** (duty S1 — see [[duty-cycles]]). It can give more for a short time, until it gets hot.
- Engines and many consumer products quote **peak** power. A vacuum cleaner's "2000 W" is its electrical input; an electric vehicle's traction motor may be quoted at a peak power two or three times its continuous rating.
- **Energy** is power times time: a 7.5 kW motor running at 75 % load for 4000 hours a year uses about $5.6/0.91 \\times 4000 \\approx 25{,}000$ kWh. Over a motor's life the electricity usually costs many times its purchase price ([[motor-life-cost]]).

In the simulation, switch the units between kW, hp and PS: the energy flow from the supply to the shaft is the same arrow, measured three ways.

> [!key] The nameplate power is mechanical output at the shaft. Input power adds the losses; apparent power (kVA) adds the reactive current too; and the current follows from $P/(\\sqrt3\\,V\\,\\eta\\,\\mathrm{PF})$. 1 hp = 745.7 W, 1 PS = 735.5 W.
`,
  ideas: [
    'Nameplate power is the continuous mechanical output at the shaft.',
    'Input power = output/efficiency; apparent power (kVA) is larger again because of the reactive magnetising current.',
    'One horsepower is 745.7 W; the metric horsepower (PS, CV) is 735.5 W; for motor sizes 1 hp ≈ 0.75 kW.',
    'Line current at full load is P/(√3 V η PF): about 2 A per kW at 400 V for mid-size 4-pole motors.'
  ],
  pitfalls: [
    'A 7.5 kW motor draws 7.5 kW — It delivers 7.5 kW at the shaft and draws about 8.3 kW (at 90 % efficiency), and more kVA still.',
    'Horsepower is horsepower — The mechanical hp (745.7 W) and the metric PS (735.5 W) differ by 1.4 %, and peak "sales" power is not continuous rated power.',
    'Current is proportional to kW, so a 0.37 kW motor draws a tenth of a 3.7 kW one — Small motors have lower efficiency and power factor, so they draw noticeably more current per kW.'
  ],
  formulas: [
    {
      name: 'Input power from output and efficiency',
      expr: 'Pin = Pout/eta', tex: 'P_{\\mathrm{in}} = \\frac{P_{\\mathrm{out}}}{\\eta}',
      vars: {
        Pin: { name: 'electrical input power', q: 'power', unit: 'kW', tex: 'P_{\\mathrm{in}}' },
        Pout: { name: 'shaft output power', q: 'power', unit: 'kW', value: 7.5, tex: 'P_{\\mathrm{out}}' },
        eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 90.4, min: 1, max: 100, tex: '\\eta' }
      },
      stories: { Pin: 'A {Pout} motor of efficiency {eta} runs at full load. How much power does it draw?', eta: 'A motor delivering {Pout} draws {Pin}. How efficient is it?' }
    },
    {
      name: 'Line current of a three-phase motor',
      expr: 'I = P/(sqrt(3)*V*eta*PF)', tex: 'I = \\frac{P_{\\mathrm{out}}}{\\sqrt{3}\\,V\\,\\eta\\,\\mathrm{PF}}',
      vars: {
        I: { name: 'line current', q: 'current', unit: 'A' },
        P: { name: 'shaft output power', q: 'power', unit: 'kW', value: 7.5, tex: 'P_{\\mathrm{out}}' },
        V: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', value: 400 },
        eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 90.4, min: 1, max: 100, tex: '\\eta' },
        PF: { name: 'power factor cos φ', value: 0.82, min: 0.05, max: 1, tex: '\\mathrm{PF}' }
      },
      note: 'At the rated point; at part load efficiency and especially power factor fall (see the power factor page).',
      stories: { I: 'A {P} motor on {V} has an efficiency of {eta} and a power factor of {PF}. What current does it draw at full load?', PF: 'A {P} motor on {V}, efficiency {eta}, draws {I}. What is its power factor?' }
    },
    {
      name: 'Current of a single-phase motor',
      expr: 'I = P/(V*eta*PF)', tex: 'I = \\frac{P_{\\mathrm{out}}}{V\\,\\eta\\,\\mathrm{PF}}',
      vars: {
        I: { name: 'current', q: 'current', unit: 'A' },
        P: { name: 'shaft output power', q: 'power', unit: 'kW', value: 0.75, tex: 'P_{\\mathrm{out}}' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 230 },
        eta: { name: 'efficiency', q: 'ratio', unit: '%', value: 72, min: 1, max: 100, tex: '\\eta' },
        PF: { name: 'power factor', value: 0.92, min: 0.05, max: 1, tex: '\\mathrm{PF}' }
      },
      stories: { I: 'A {P} single-phase motor on {V} has an efficiency of {eta} and a power factor of {PF}. What current does it draw?' }
    },
    {
      name: 'Energy used in a year',
      expr: 'E = P/eta*t', tex: 'E = \\frac{P}{\\eta}\\,t',
      vars: {
        E: { name: 'electrical energy used', q: 'energy', unit: 'kWh' },
        P: { name: 'average shaft power', q: 'power', unit: 'kW', value: 5.6 },
        eta: { name: 'efficiency at that load', q: 'ratio', unit: '%', value: 91, min: 1, max: 100, tex: '\\eta' },
        t: { name: 'running hours', q: 'time', unit: 'h', value: 4000 }
      },
      stories: { E: 'A motor gives an average {P} at {eta} efficiency for {t} a year. How much energy does it use?' }
    }
  ],
  examples: [
    {
      title: 'Translating a US rating',
      q: 'A machine designed in the US has a 10 hp motor. What IEC motor replaces it, and what is its power in PS?',
      steps: [
        '$10 \\times 745.7 = 7457$ W = 7.46 kW, so the IEC 7.5 kW size.',
        'In metric horsepower: $7457/735.5 = 10.1$ PS.'
      ],
      a: 'A 7.5 kW IEC motor (10.1 PS); check the speed, voltage, frequency and frame as well.'
    },
    {
      title: 'The current of a 7.5 kW motor',
      q: 'A 7.5 kW motor has an efficiency of 90.4 % and a power factor of 0.82. What does it draw at full load on 400 V (delta) and on 230 V (delta, the same motor re-connected for a 230 V supply)?',
      steps: [
        'Input: $7.5/0.904 = 8.30$ kW; apparent power $8.30/0.82 = 10.1$ kVA.',
        'At 400 V: $I = 10{,}120/(\\sqrt3 \\times 400) = 14.6$ A.',
        'At 230 V: $14.6 \\times 400/230 = 25.4$ A — the same power at a lower voltage needs more current.'
      ],
      a: '14.6 A at 400 V, 25.4 A at 230 V.'
    },
    {
      title: 'A car engine in kW and hp',
      q: 'A car brochure gives 150 PS. What is that in kW and mechanical hp?',
      steps: ['$150 \\times 735.5 = 110.3$ kW.', '$110{,}300/745.7 = 148$ hp.'],
      a: '110 kW, or 148 hp — a peak power, not a continuous rating.'
    }
  ],
  quiz: [
    { q: 'The "7.5 kW" on an IEC motor nameplate is…', choices: ['the mechanical output at the shaft, continuously', 'the electrical power drawn from the supply', 'the apparent power in kVA', 'the peak power for a few seconds'], a: 0, why: 'IEC 60034-1 defines rated output of a motor as mechanical power at the shaft; the input is larger by the losses.' },
    { q: 'Which is larger: 1 hp (mechanical) or 1 PS (metric)?', choices: ['1 hp, 745.7 W against 735.5 W', '1 PS', 'They are identical', 'It depends on the country'], a: 0, why: 'Watt\'s horsepower is 550 ft·lbf/s = 745.7 W; the metric horsepower is 75 kgf·m/s = 735.5 W.' },
    { q: 'Roughly what full-load current does an 11 kW, 4-pole, 400 V motor draw?', choices: ['About 21 A', 'About 11 A', 'About 48 A', 'About 5 A'], a: 0, why: 'About 2 A per kW at 400 V for mid-size 4-pole motors: 11/(√3 × 0.4 × 0.91 × 0.83) ≈ 21 A. Always check the plate.' },
    { q: 'A motor rated 7.5 kW draws 7.5 kW from the supply at full load.', a: false, why: 'It delivers 7.5 kW; it draws 7.5/η — about 8.3 kW for an IE3 motor — and even more apparent power.' },
    { q: 'How many hp is 30 kW?', answer: 40.2, unit: 'hp', why: '30,000/745.7 = 40.2 hp; the matching NEMA size is 40 hp.' }
  ],
  problems: [
    { q: 'What is 55 kW in mechanical horsepower?', answer: 73.8, unit: 'hp', tol: 0.01, steps: ['$55{,}000/745.7 = 73.8$ hp (the NEMA 75 hp size).'] },
    { q: 'A 22 kW, 400 V motor has an efficiency of 93 % and a power factor of 0.85. What is its full-load current?', answer: 40.2, unit: 'A', tol: 0.02, steps: ['$I = 22{,}000/(\\sqrt3 \\times 400 \\times 0.93 \\times 0.85)$.', '$= 22{,}000/547.7 = 40.2$ A.'] }
  ],
  choose: {
    good: [
      'A rated output 10–25 % above the load\'s continuous shaft power, with the starting and peak torques checked separately.',
      'The standard power steps (IEC kW or NEMA hp): cheapest, in stock, and interchangeable.'
    ],
    avoid: [
      'Heavy oversizing "to be safe": below about 50 % load efficiency and especially power factor fall, and the current and cables are bigger than needed.',
      'Comparing a peak or input power (tools, appliances, engines) with a motor\'s continuous output rating.'
    ],
    check: [
      'Whether the plate is in kW or hp, and for which voltage and frequency (a 60 Hz rating may be higher than the 50 Hz one).',
      'The full-load current on the plate for cables, fuses, overload settings and the drive — not a rule of thumb.',
      'The kVA a generator set or transformer must supply, including starting.'
    ]
  },
  applications: [
    'Sizing cables, fuses and overload relays from the nameplate current (see [the cable calculator](#/tools/sizing/cable)).',
    'Energy audits: running hours × average load / efficiency gives the kWh a motor uses each year.',
    'Replacing US-built machines\' motors with IEC ones and back: match power, speed, voltage, frequency and frame.'
  ],
  history: 'Watt rated his engines in horsepower from the 1780s; the metric horsepower (Pferdestärke) of 75 kgf·m/s came into use in continental Europe in the 19th century. The kilowatt became the IEC unit for motor ratings, while NEMA kept horsepower, which is why the two series of standard ratings sit side by side today.',
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: rated output of motors as mechanical power at the shaft, and the standard ratings.',
    'NEMA MG 1, *Motors and Generators*: horsepower ratings of integral-horsepower motors.',
    'Hughes and Drury, *Electric Motors and Drives* — motor ratings and power supplies.'
  ],
  sim: ['mb-loss-flow', 'mb-torque-power']
},

{
  id: 'efficiency-losses', parent: 'motor-ratings', title: 'Efficiency and where the losses go', level: 1,
  short: 'Efficiency is output over input; everything else becomes heat inside the motor. The losses are copper losses in stator and rotor, iron losses, friction and windage, and stray load losses. Some are constant, some grow with the square of the load, so efficiency is flat from about half to full load and falls away at light load.',
  keywords: ['efficiency', 'losses', 'copper loss', 'I²R', 'iron loss', 'core loss', 'friction and windage', 'stray load loss', 'additional load loss', 'part-load efficiency', 'loss budget', 'IEC 60034-2-1', 'voltage unbalance', 'oversizing'],
  prereq: ['power-units', 'magnetic-circuits', 'physics:efficiency'],
  related: ['efficiency-classes', 'power-factor', 'insulation-classes', 'motor-heating', 'motor-life-cost', 'vfd-energy-saving', 'friction-in-motors'],
  body: `
Efficiency is the fraction of the input that comes out at the shaft:

$$\\eta = \\frac{P_{\\mathrm{out}}}{P_{\\mathrm{in}}} = \\frac{P_{\\mathrm{out}}}{P_{\\mathrm{out}} + P_{\\mathrm{loss}}}$$

Every watt of loss becomes heat inside the motor, and that heat — not the magnetism — is what limits how much a motor can give. A 7.5 kW IE3 motor at 90.4 % efficiency turns about 796 W into heat at full load; its fan and fins must carry that away at a winding temperature the insulation can live with ([[insulation-classes]]).

### Five losses
| Loss | Where | How it varies | Typical share at rated load (mid-size 4-pole induction motor) |
|---|---|---|---|
| Stator copper loss $I^2R$ | stator winding | with current squared (and with temperature) | 30–40 % |
| Rotor copper loss | rotor bars and end rings | slip × air-gap power, ≈ load squared | 15–25 % |
| Iron (core) loss | laminations: hysteresis and eddy currents | constant at fixed voltage and frequency | 15–25 % |
| Friction and windage | bearings, seals, cooling fan | constant at fixed speed (more in 2-pole motors) | 5–15 % |
| Additional (stray) load loss | leakage fields, harmonics, surface losses | roughly load squared | 10–20 % |

For the 7.5 kW motor that is roughly 300 W in the stator winding, 145 W in the rotor, 160 W in the iron, 70 W of friction and windage and 120 W of stray load loss. The sim draws exactly this as a flow of power from the supply to the shaft, with each loss peeling off as heat.

### Efficiency at part load
Split the losses into a constant part $P_0$ (iron, friction and windage) and a part $P_c x^2$ that grows as the square of the load fraction $x$:

$$\\eta(x) = \\frac{x\\,P_n}{x\\,P_n + P_0 + P_c\\,x^2}$$

Efficiency is highest where the two parts are equal, at $x^* = \\sqrt{P_0/P_c}$ — usually somewhere between 60 and 100 % of rated load. The curve is flat from about half load to full load, then falls away steeply below a quarter load, where the constant losses become large compared with the output. (The model is a little optimistic at very light load, because the magnetising current keeps some stator copper loss even at no load.)

| Motor | Typical full-load efficiency |
|---|---|
| 0.75 kW IE3 4-pole induction motor | about 82–83 % |
| 7.5 kW IE3 4-pole | about 90–91 % |
| 75 kW IE3 4-pole | about 95 % |
| 1 MW induction motor | about 96–97 % |
| Small brushed PM DC motor (10–100 W) | about 50–85 % |
| Small brushless PM motor | about 80–92 % |
| Shaded-pole fan motor | often below 30 % |
| Variable-frequency drive itself | about 95–98 % |

Bigger motors are more efficient because losses grow more slowly than size: the output goes roughly with volume, the surface that sheds heat with area, and bearing and fan losses shrink relatively.

### What spoils efficiency in real machines
- **Voltage unbalance.** A few per cent unbalance between phases drives large negative-sequence currents: as a rule of thumb from NEMA MG 1, the temperature rise goes up by about twice the square of the percentage unbalance (3 % unbalance → roughly 18 % more rise).
- **Wrong voltage.** Overvoltage raises iron loss and magnetising current; undervoltage raises current and copper loss under load.
- **Heat.** Copper's resistance rises about 0.39 % per kelvin; a hot winding loses more.
- **Drives.** A VFD's switching adds a few per cent to the motor's losses and has its own; at part speed on fans and pumps the drive still saves far more than it costs ([[vfd-energy-saving]]).
- **Mechanics.** Misalignment, over-greased bearings, tight belts and dirty fans add friction; a poor rewind (overheated core, thinner wire) can lower efficiency, a careful one keeps it.
- **Oversizing.** Mainly a power-factor and cost problem — a modern motor loses only a point or two of efficiency down to about a third of its load — but below a quarter load efficiency falls fast.

> [!tip] Catalogues give efficiency at 100, 75 and 50 % load (IEC 60034-2-1 test methods). Compare motors at the load they will really run at, and remember that half a per cent on a motor running 6000 hours a year is worth real money.

> [!key] Efficiency is output ÷ input; every lost watt is heat in the motor. Constant losses (iron, friction) and load-squared losses (copper, stray) make the efficiency curve flat from half to full load, peaking where the two are equal.
`,
  ideas: [
    'All losses become heat inside the motor, and heat is what limits its output.',
    'The losses are stator and rotor copper loss, iron loss, friction and windage, and stray load loss.',
    'Iron and friction losses are roughly constant; copper and stray losses grow with the square of the load.',
    'Efficiency peaks where constant and load-dependent losses are equal, and is flat from about 50 to 100 % load.',
    'Larger motors are more efficient: about 82 % at 0.75 kW, 90 % at 7.5 kW and 95 % at 75 kW for IE3 4-pole motors.'
  ],
  pitfalls: [
    'A motor is most efficient at full load — The peak is usually below full load (often around 75 %), where constant and load losses balance.',
    'An oversized motor wastes a lot of energy through low efficiency — Down to about a third of rated load a modern motor loses only a little efficiency; the real costs are poor power factor, price and space. Below a quarter load it does get inefficient.',
    'The losses leave with the electricity — They are heat in the motor, carried away by its fan and frame; blocked fins or a hot room turn them into a hotter winding.'
  ],
  formulas: [
    {
      name: 'Efficiency from the losses',
      expr: 'eta = Pout/(Pout + Ploss)', tex: '\\eta = \\frac{P_{\\mathrm{out}}}{P_{\\mathrm{out}} + P_{\\mathrm{loss}}}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Pout: { name: 'shaft output', q: 'power', unit: 'kW', value: 7.5, tex: 'P_{\\mathrm{out}}' },
        Ploss: { name: 'total losses', q: 'power', unit: 'W', value: 796, tex: 'P_{\\mathrm{loss}}' }
      },
      stories: { eta: 'A motor gives {Pout} and loses {Ploss} as heat. How efficient is it?', Ploss: 'A {Pout} motor has an efficiency of {eta}. How much heat must its cooling remove?' }
    },
    {
      name: 'Efficiency at part load',
      expr: 'eta = x*Pn/(x*Pn + P0 + Pc*x^2)', tex: '\\eta = \\frac{x\\,P_n}{x\\,P_n + P_0 + P_c\\,x^2}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        x: { name: 'load as a fraction of rated', q: 'ratio', unit: '%', value: 50, min: 1, max: 200 },
        Pn: { name: 'rated output', q: 'power', unit: 'kW', value: 7.5, tex: 'P_n' },
        P0: { name: 'constant losses (iron, friction and windage)', q: 'power', unit: 'W', value: 231, tex: 'P_0' },
        Pc: { name: 'load losses at rated load (copper, stray)', q: 'power', unit: 'W', value: 565, tex: 'P_c' }
      },
      note: 'A two-part loss model; at very light load the real efficiency is a little lower because of the magnetising current.',
      stories: { eta: 'A {Pn} motor has constant losses of {P0} and load losses of {Pc} at rated load. How efficient is it at {x} load?' }
    },
    {
      name: 'Load for the best efficiency',
      expr: 'x = sqrt(P0/Pc)', tex: 'x^{*} = \\sqrt{\\frac{P_0}{P_c}}',
      vars: {
        x: { name: 'load fraction for maximum efficiency', q: 'ratio', unit: '%', tex: 'x^{*}' },
        P0: { name: 'constant losses', q: 'power', unit: 'W', value: 231, tex: 'P_0' },
        Pc: { name: 'load losses at rated load', q: 'power', unit: 'W', value: 565, tex: 'P_c' }
      },
      note: 'Where the load-dependent losses Pc x² equal the constant losses P0.',
      stories: { x: 'A motor has {P0} of constant losses and {Pc} of load losses at rated load. At what load is it most efficient?' }
    }
  ],
  examples: [
    {
      title: 'The loss budget of a 7.5 kW motor',
      q: 'A 7.5 kW IE3 motor is 90.4 % efficient at full load. How much heat does it make, and roughly how is it split?',
      steps: [
        'Input $7.5/0.904 = 8.296$ kW, so the losses are $8.296 - 7.5 = 0.796$ kW.',
        'With typical shares: stator copper ≈ 38 % (300 W), rotor copper ≈ 18 % (145 W), iron ≈ 20 % (160 W), friction and windage ≈ 9 % (70 W), stray load ≈ 15 % (120 W).',
        'Constant part $P_0$ ≈ 160 + 70 = 230 W; load part $P_c$ ≈ 565 W; best efficiency at $\\sqrt{231/565} = 64$ % load.'
      ],
      a: 'About 800 W of heat, a little over half of it in the copper.'
    },
    {
      title: 'A 15 kW motor on a 5 kW load',
      q: 'A 15 kW IE3 motor (92.1 % at full load) drives a 5 kW load. Using the two-part loss model with 29 % constant losses, compare its efficiency with a 5.5 kW IE3 motor (89.6 %) on the same load.',
      steps: [
        '15 kW motor: losses at rated load $15{,}000 \\times (1/0.921 - 1) = 1287$ W; $P_0 = 373$ W, $P_c = 914$ W. At $x = 1/3$: losses $373 + 914/9 = 475$ W, $\\eta = 5000/5475 = 91.3$ %.',
        '5.5 kW motor: losses $5500 \\times (1/0.896 - 1) = 638$ W; $P_0 = 185$ W, $P_c = 453$ W. At $x = 0.91$: losses $185 + 453 \\times 0.83 = 560$ W, $\\eta = 89.9$ %.',
        'The big motor is not less efficient here — but its power factor at a third load is only about 0.5, it costs about twice as much and it needs bigger switchgear.'
      ],
      a: 'About 91 % against 90 %: oversizing costs power factor and money more than efficiency, until the load falls below about a quarter.'
    },
    {
      title: 'The yearly cost of losses',
      q: 'The 7.5 kW motor (P₀ = 231 W, P_c = 565 W) runs 6000 h a year at 75 % load. How much energy do its losses waste?',
      steps: [
        'Losses at 75 %: $231 + 565 \\times 0.75^2 = 231 + 318 = 549$ W.',
        'Per year: $0.549 \\times 6000 = 3290$ kWh — at 0.15 per kWh in any currency, about 490 a year, every year of the motor\'s life.'
      ],
      a: 'About 3300 kWh a year.'
    }
  ],
  quiz: [
    { q: 'Which losses stay roughly constant from no load to full load?', choices: ['Iron loss and friction and windage', 'Stator and rotor copper loss', 'Stray load loss', 'All of them'], a: 0, why: 'Iron loss depends on voltage and frequency, friction and windage on speed — all nearly fixed on the mains. Copper and stray losses grow with the square of the load.' },
    { q: 'At what load is a typical induction motor most efficient?', choices: ['Somewhere around 60–100 % of rated, often near 75 %', 'Exactly at 100 %', 'At no load', 'At 150 %'], a: 0, why: 'The peak is where the load-squared losses equal the constant losses; for most motors that is a little below full load, and the curve is flat from half load up.' },
    { q: 'All the losses of a motor end up as heat inside or around it.', a: true, why: 'Copper, iron, friction, windage and stray losses are all dissipated in the motor and its cooling air; that heat sets the winding temperature and so the rating.' },
    { q: 'Which motor is likely to be the most efficient at its rated load?', choices: ['A 75 kW IE3 motor', 'A 7.5 kW IE3 motor', 'A 0.75 kW IE3 motor', 'A 50 W shaded-pole fan motor'], a: 0, why: 'Efficiency rises with size: about 95 % at 75 kW, 90 % at 7.5 kW, 82 % at 0.75 kW; shaded-pole motors are far lower.' },
    { q: 'An 11 kW motor is 91.4 % efficient. How many watts of heat does it make at full load?', answer: 1035, unit: 'W', why: 'P_loss = P_out(1/η − 1) = 11,000 × (1/0.914 − 1) = 1035 W.' }
  ],
  problems: [
    { q: 'A 7.5 kW motor has constant losses of 231 W and load losses of 565 W at rated load. What is its efficiency at 25 % load?', answer: 87.6, unit: '%', tol: 0.01, steps: ['Output $0.25 \\times 7500 = 1875$ W; losses $231 + 565 \\times 0.0625 = 266$ W.', '$\\eta = 1875/(1875 + 266) = 87.6$ %.'] },
    { q: 'A motor has 300 W of constant losses and 900 W of load losses at rated load. At what percentage of rated load is it most efficient?', answer: 57.7, unit: '%', tol: 0.01, steps: ['$x^* = \\sqrt{300/900} = 0.577$.'] }
  ],
  choose: {
    good: [
      'Premium-efficiency motors (IE3, IE4) on anything that runs thousands of hours a year: the losses cost far more than the motor.',
      'Sizing so the usual load sits between about 60 and 100 % of the rating.',
      'A VFD on fans and pumps that throttle or bypass flow: the saving at part speed dwarfs the drive\'s own few per cent of losses.'
    ],
    avoid: [
      'Motors idling unloaded for long periods: switch them off or let the drive sleep.',
      'Repeated rewinding of small, cheap motors when a new premium-efficiency motor costs little more.',
      'Unbalanced or persistently high supply voltages.'
    ],
    check: [
      'Efficiency at the load you will actually run (100 / 75 / 50 % values in the catalogue).',
      'The phase voltages: every per cent of unbalance adds disproportionate heating.',
      'Cooling: clean fins, a free air inlet, the fan intact.'
    ]
  },
  applications: [
    'Energy audits: measuring the input power and estimating the load tells whether a motor is oversized or worth replacing.',
    'Thermal design: the losses are the heat the motor\'s fan, a panel cooler or a water jacket must remove.',
    'Explore the power flow of a motor in [the motor lab](#/tools/motorlab/induction).'
  ],
  sources: [
    'IEC 60034-2-1, *Rotating electrical machines — Standard methods for determining losses and efficiency from tests*: the direct and summation-of-losses methods and the loss components.',
    'IEEE Std 112, *Test procedure for polyphase induction motors and generators*.',
    'NEMA MG 1, *Motors and Generators* — the effect of voltage unbalance on motor performance.',
    'Hughes and Drury, *Electric Motors and Drives* — induction motor losses and efficiency.'
  ],
  sim: 'mb-loss-flow'
},

{
  id: 'power-factor', parent: 'motor-ratings', title: 'Power factor (cos φ)', level: 2,
  short: 'Power factor is real power divided by apparent power; for sine waves it is cos φ, the cosine of the angle by which the current lags the voltage. An induction motor needs reactive current to magnetise itself, so its cos φ is 0.8–0.9 at full load and falls steeply at light load. It is not "COP" — that is a heat-pump number.',
  keywords: ['power factor', 'cos φ', 'cos phi', 'PF', 'apparent power', 'kVA', 'reactive power', 'kvar', 'magnetising current', 'power factor correction', 'capacitor', 'self-excitation', 'displacement power factor', 'true power factor', 'harmonics', 'COP', 'coefficient of performance'],
  prereq: ['power-units', 'magnetic-circuits', 'electronics:ac-power'],
  related: ['efficiency-losses', 'nameplate-reading', 'equivalent-circuit', 'capacitor-sizing', 'vfd-wiring-emc', 'electronics:power-factor-correction', 'electronics:three-phase', 'physics:refrigerators-heat-pumps'],
  body: `
An induction motor draws two kinds of current at once. One part is in step with the voltage and carries real power to the shaft; the other lags the voltage by a quarter cycle and does nothing but build the magnetic field, handing its energy back to the supply twice every cycle. Their sum lags the voltage by an angle $\\varphi$, and the **power factor** is

$$\\mathrm{PF} = \\frac{P}{S} = \\cos\\varphi$$

where $P$ is the real power in kW and $S$ the apparent power in kVA ($S = \\sqrt3\\,V I$ for three phases). The equality with $\\cos\\varphi$ holds for sine waves; with distorted currents the true power factor is lower. The remaining **reactive power** $Q = S\\sin\\varphi$, in kvar, completes a right-angled triangle: $S^2 = P^2 + Q^2$. In the simulation the current [[?rotating-arrow|phasor]] swings between its active and reactive parts as the load changes; watch the instantaneous power $v\\,i$ dip below zero when the current lags a lot.

### Why a motor's cos φ falls at light load
The magnetising current is nearly constant — set by the voltage and the air gap ([[magnetic-circuits]]) — while the working current follows the load. At full load the working current dominates; at no load the magnetising current is almost all there is.

| Typical 4-pole IE3 motor | Full load | 75 % | 50 % | 25 % | No load |
|---|---|---|---|---|---|
| 7.5 kW (a model motor, as in the sim) | 0.82 | 0.76 | 0.65 | 0.42 | about 0.05–0.1 |
| Small, 0.37–0.75 kW | 0.65–0.78 | lower | lower | lower | very low |
| Large, 75 kW | 0.85–0.88 | slightly lower | lower | lower | very low |

Two-pole motors have higher power factors and 6- and 8-pole motors lower ones, because more poles mean more magnetising current for the same flux. Permanent-magnet motors need no magnetising current and do better; on a drive, though, what the supply sees is the drive's input, not the motor.

### Why it matters
- **Current.** At 0.82 the supply carries 22 % more current than the real power needs ($1/0.82 = 1.22$); at 0.42 it carries 2.4 times as much. Cables, transformers, generator sets and fuses are sized for the current, and their $I^2R$ losses rise with its square.
- **Tariffs.** Many utilities charge industrial customers for reactive energy (kvarh) or penalise a power factor below a threshold, commonly somewhere around 0.9–0.95; rules differ by country and tariff.
- **Not the motor's efficiency.** Reactive current does not heat the motor's output away — but it does add copper loss in the stator and in everything upstream.

### Correcting it
Capacitors draw a leading current that cancels the motor's lagging one, supplying the reactive power locally. To raise the power factor from $\\mathrm{PF}_1$ to $\\mathrm{PF}_2$ at real power $P$:

$$Q_C = P\\left(\\tan\\varphi_1 - \\tan\\varphi_2\\right)$$

Correction can be *individual* (a capacitor switched with each large motor) or *central* (an automatic bank with steps at the main switchboard).

> [!warn] Power-factor capacitors store charge and must have discharge resistors; wait and measure before touching them. Never connect capacitors to the output of a VFD or a soft starter. An individually corrected motor must not get more kvar than its no-load reactive power (keep it below roughly 90 %), or after switch-off the motor and capacitor can self-excite and hold a dangerous voltage — and a fast reclose can damage the motor. On sites with many drives, plain capacitors can resonate with the harmonics: use detuned (reactor) banks designed for it. This is work for qualified electricians.

### VFDs and "true" power factor
A drive with a diode rectifier draws current almost in phase with the voltage — a displacement factor of 0.95 or better — but in pulses, rich in harmonics. The true power factor is then about 0.9–0.95 with a DC or line choke and roughly 0.6–0.75 without one on small drives. Active-front-end drives reach close to 1.

### cos φ, η — and why not COP
A motor nameplate carries two dimensionless numbers: **cos φ**, the power factor at rated load, and **η** (or "Eff."), the efficiency, often at 100, 75 and 50 % load. People sometimes call one of them "COP". The **coefficient of performance** belongs to heat pumps, air-conditioners and refrigerators: heat moved divided by electrical energy used, typically 2.5–5 ([[physics:refrigerators-heat-pumps|heat pumps]]). It can exceed 1 because a heat pump moves heat rather than making it. A motor's efficiency is always below 1, and its cos φ is about the phase of the current, not about energy lost at all.

> [!key] cos φ = kW ÷ kVA. An induction motor's magnetising current keeps it at 0.8–0.9 at full load and drives it down at light load. Correct it with capacitors carefully sized and never on a drive's output; and read "cos φ" and "η" on the plate — there is no COP on a motor.
`,
  ideas: [
    'Power factor is real power over apparent power, P/S; for sinusoidal currents it equals cos φ.',
    'An induction motor draws a nearly constant magnetising current, so its power factor is 0.8–0.9 at full load and falls steeply at light load.',
    'A low power factor means more current for the same real power: bigger cables, more losses upstream, and often a tariff penalty.',
    'Capacitors supply the reactive power locally: Q_C = P(tan φ₁ − tan φ₂); never on a VFD output, and not more than the motor\'s no-load kvar.',
    'COP is a heat-pump figure; a motor plate gives cos φ (power factor) and η (efficiency).'
  ],
  pitfalls: [
    'Power factor and efficiency are the same thing — Efficiency is how much of the real input reaches the shaft; power factor is how much of the current carries real power at all.',
    'A motor nameplate\'s "COP" is its efficiency — Motors have no COP; the coefficient of performance is a heat-pump and refrigeration figure, and can exceed 1.',
    'More correction is always better — Over-correcting a motor makes it self-excite when switched off and can make the site\'s power factor leading; capacitors near many drives can resonate with harmonics.'
  ],
  formulas: [
    {
      name: 'Real power of a three-phase motor',
      expr: 'P = sqrt(3)*V*I*PF', tex: 'P = \\sqrt{3}\\,V\\,I\\,\\mathrm{PF}',
      vars: {
        P: { name: 'real input power', q: 'power', unit: 'kW' },
        V: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', value: 400 },
        I: { name: 'line current', q: 'current', unit: 'A', value: 14.6 },
        PF: { name: 'power factor cos φ', value: 0.82, min: 0.01, max: 1, tex: '\\mathrm{PF}' }
      },
      stories: { P: 'A motor on {V} draws {I} at a power factor of {PF}. What real power does it take?', PF: 'A motor on {V} draws {I} and {P}. What is its power factor?' }
    },
    {
      name: 'Power factor from the phase angle',
      expr: 'PF = cos(phi)', tex: '\\mathrm{PF} = \\cos\\varphi',
      vars: {
        PF: { name: 'power factor', tex: '\\mathrm{PF}' },
        phi: { name: 'angle by which the current lags the voltage', q: 'angle', unit: '°', value: 34.9, min: 0, max: 90, tex: '\\varphi' }
      },
      stories: { PF: 'The current lags the voltage by {phi}. What is the power factor?', phi: 'A motor has a power factor of {PF}. By what angle does its current lag?' }
    },
    {
      name: 'Apparent power',
      expr: 'S = sqrt(3)*V*I', tex: 'S = \\sqrt{3}\\,V\\,I',
      vars: {
        S: { name: 'apparent power', q: 'apparentpower', unit: 'kVA' },
        V: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', value: 400 },
        I: { name: 'line current', q: 'current', unit: 'A', value: 14.6 }
      },
      stories: { S: 'A three-phase motor draws {I} at {V}. What apparent power must the supply provide?' }
    },
    {
      name: 'Capacitor kvar to raise the power factor',
      expr: 'Qc = P*(sqrt(1/PF1^2 - 1) - sqrt(1/PF2^2 - 1))', tex: 'Q_C = P\\left(\\sqrt{\\tfrac{1}{\\mathrm{PF}_1^2}-1}-\\sqrt{\\tfrac{1}{\\mathrm{PF}_2^2}-1}\\right)',
      vars: {
        Qc: { name: 'capacitor reactive power', q: 'reactivepower', unit: 'kvar', tex: 'Q_C' },
        P: { name: 'real power', q: 'power', unit: 'kW', value: 8.3 },
        PF1: { name: 'power factor before', value: 0.82, min: 0.05, max: 1, tex: '\\mathrm{PF}_1' },
        PF2: { name: 'power factor wanted', value: 0.95, min: 0.05, max: 1, tex: '\\mathrm{PF}_2' }
      },
      note: 'The square roots are tan φ₁ and tan φ₂. For one motor, keep Q_C below about 90 % of its no-load reactive power.',
      stories: { Qc: 'A load of {P} runs at a power factor of {PF1}. How many kvar of capacitors raise it to {PF2}?', PF2: 'A load of {P} at {PF1} gets {Qc} of capacitors. What power factor results?' }
    },
    {
      name: 'Capacitance per phase of a delta-connected bank',
      expr: 'C = Qc/(3*2*pi*f*V^2)', tex: 'C = \\frac{Q_C}{3\\cdot 2\\pi f\\,V^2}',
      vars: {
        C: { name: 'capacitance of each capacitor', q: 'capacitance', unit: 'µF' },
        Qc: { name: 'total reactive power of the bank', q: 'reactivepower', unit: 'kvar', value: 3.07, tex: 'Q_C' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        V: { name: 'line-to-line voltage', q: 'voltage', unit: 'V', value: 400 }
      },
      note: 'Each capacitor sits across the line voltage. A star-connected bank needs three times the capacitance for the same kvar.',
      stories: { C: 'A delta bank must supply {Qc} at {V}, {f}. What capacitance per phase?' }
    }
  ],
  examples: [
    {
      title: 'The power triangle of a 7.5 kW motor',
      q: 'A 7.5 kW motor at full load draws 14.6 A at 400 V with cos φ = 0.82. Find P, S and Q.',
      steps: [
        '$S = \\sqrt3 \\times 400 \\times 14.6 = 10.1$ kVA.',
        '$P = 0.82 \\times 10.1 = 8.30$ kW (the 7.5 kW output plus 0.8 kW of losses).',
        '$Q = \\sqrt{10.1^2 - 8.30^2} = 5.8$ kvar.'
      ],
      a: 'P = 8.3 kW, S = 10.1 kVA, Q = 5.8 kvar.'
    },
    {
      title: 'Correcting it to 0.95',
      q: 'How many kvar raise that motor to 0.95, what does the line current become, and what capacitance per phase in delta? Its no-load reactive power is about 4.8 kvar.',
      steps: [
        '$\\tan\\varphi_1 = 0.698$, $\\tan\\varphi_2 = 0.329$: $Q_C = 8.30 \\times 0.369 = 3.06$ kvar — below 90 % of 4.8 kvar, so safe against self-excitation.',
        'New apparent power $8.30/0.95 = 8.74$ kVA, so $I = 8740/(\\sqrt3 \\times 400) = 12.6$ A instead of 14.6 A. The motor\'s own current is unchanged; the line current falls.',
        'Delta: $C = 3060/(3 \\times 2\\pi \\times 50 \\times 400^2) = 20.3$ µF per phase.'
      ],
      a: 'About 3.1 kvar (3 × 20 µF in delta); the line current drops from 14.6 to 12.6 A.'
    },
    {
      title: 'A lightly loaded motor',
      q: 'The same motor runs at a quarter load: cos φ 0.42, efficiency 86 %. Compare the current with full load.',
      steps: [
        'Input $1.875/0.86 = 2.18$ kW; apparent power $2.18/0.42 = 5.2$ kVA.',
        '$I = 5200/(\\sqrt3 \\times 400) = 7.5$ A — half the full-load current for a quarter of the power.'
      ],
      a: 'About 7.5 A: the magnetising current dominates at light load.'
    }
  ],
  quiz: [
    { q: 'An induction motor runs with no load on its shaft. Its power factor is…', choices: ['very low, about 0.05–0.2: the current is almost all magnetising current', 'about 1, because it does no work', 'the same as at full load', 'leading'], a: 0, why: 'At no load the working current is tiny while the magnetising current stays; the current lags the voltage by nearly 90°.' },
    { q: 'A motor nameplate shows "cos φ 0.82" and "η 90.4 %". Which is its COP?', choices: ['Neither: COP is a heat-pump figure; these are the power factor and the efficiency', 'cos φ', 'η', 'Their product'], a: 0, why: 'The coefficient of performance is heat moved per unit of electrical energy in heat pumps and refrigerators. A motor has a power factor and an efficiency.' },
    { q: 'Adding a correction capacitor at a motor reduces the current in the supply cable but not the current in the motor windings.', a: true, why: 'The capacitor supplies the reactive current locally, so the supply carries less; the motor still needs its own magnetising current.' },
    { q: 'Where must power-factor capacitors never be connected?', choices: ['On the output of a VFD', 'At the main switchboard', 'Across the motor terminals of a direct-on-line motor, correctly sized', 'In an automatic bank with steps'], a: 0, why: 'The drive\'s fast-switching output would drive huge charging currents into the capacitors, damaging them and tripping or destroying the drive.' },
    { q: 'What apparent power does a 10 kW load at a power factor of 0.8 need?', answer: 12.5, unit: 'kVA', why: 'S = P/PF = 10/0.8 = 12.5 kVA.' }
  ],
  problems: [
    { q: 'A 20 kW load runs at a power factor of 0.78. How many kvar of capacitors raise it to 0.95?', answer: 9.47, unit: 'kvar', tol: 0.02, steps: ['$\\tan\\varphi_1 = \\sqrt{1/0.78^2 - 1} = 0.802$; $\\tan\\varphi_2 = 0.329$.', '$Q_C = 20 \\times (0.802 - 0.329) = 9.47$ kvar.'] },
    { q: 'After that correction, what line current does the 20 kW load draw at 400 V?', answer: 30.4, unit: 'A', tol: 0.02, steps: ['$S = 20/0.95 = 21.05$ kVA.', '$I = 21{,}050/(\\sqrt3 \\times 400) = 30.4$ A (it was 37.0 A at 0.78).'] }
  ],
  choose: {
    good: [
      'Individual correction for large motors that run long hours at fixed speed, direct on line — sized below their no-load kvar.',
      'Central automatic capacitor banks for sites with many small motors and a reactive-energy charge.',
      'Drives with chokes or active front ends where the load is mostly VFDs.'
    ],
    avoid: [
      'Capacitors on the output of a VFD or soft starter.',
      'Over-correcting a motor (self-excitation) or a whole site (leading power factor, overvoltage at light load).',
      'Plain capacitor banks on networks with many drives: harmonic resonance — use detuned banks.'
    ],
    check: [
      'The tariff\'s power-factor threshold and charges before investing.',
      'The motor\'s no-load current (for its no-load kvar) before individual correction.',
      'Harmonics on the network: measure before adding capacitors.'
    ]
  },
  applications: [
    'Industrial sites with many direct-on-line motors fit automatic capacitor banks to avoid reactive-energy charges and free transformer capacity.',
    'Generator sets are rated in kVA at a stated power factor (commonly 0.8): a low-PF motor load uses up their capacity.',
    'Large synchronous motors can run over-excited to supply reactive power to a whole plant.'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — the induction motor\'s magnetising current and power factor.',
    'Chapman, *Electric Machinery Fundamentals* — power factor and the induction motor equivalent circuit; power-factor correction.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: the rated power factor on the nameplate.',
    'IEC 60831-1: shunt power capacitors of the self-healing type for AC systems up to 1000 V — the capacitors used for correction.'
  ],
  sim: 'mb-power-factor'
},

{
  id: 'duty-cycles', parent: 'motor-ratings', title: 'Duty cycles S1 to S10', level: 2,
  short: 'A motor\'s rating depends on how it is used: continuously (S1), for a short time (S2), in on–off cycles with or without starts and braking (S3–S5), or continuously with varying load (S6–S10). Because the winding heats with a time constant of tens of minutes, a motor can give more than its S1 rating when it works only part of the time — within limits.',
  keywords: ['duty type', 'duty cycle', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'cyclic duration factor', 'intermittent duty', 'short-time duty', 'thermal time constant', 'starts per hour', 'factor of inertia', 'FI', 'RMS torque'],
  prereq: ['efficiency-losses', 'insulation-classes'],
  related: ['rms-torque-sizing', 'motor-heating', 'motor-protection', 'nameplate-reading', 'motors-conveyors-hoists', 'motor-selection-method'],
  body: `
A motor is rated by the heat it can shed. Its winding warms with a thermal [[?exponential|exponential]] curve whose time constant is tens of minutes for a mid-size motor (roughly 15–60 min; minutes for a small one, hours for a big one). So what a motor can give depends on *how* it works: an hour of heavy load and then a long rest is not the same as the same load all day. IEC 60034-1 names ten **duty types**, and the nameplate states the one the rating is for — usually S1.

| Duty | Name | What it means | Typical use |
|---|---|---|---|
| S1 | Continuous running | constant load long enough to reach thermal equilibrium | pumps, fans, compressors, conveyors |
| S2 | Short-time | constant load for a stated time (10, 30, 60 or 90 min), then rest until cold (within 2 K of the coolant) | sluice gates, valve actuators, occasional lifts |
| S3 | Intermittent periodic | identical cycles of load and rest; starting not significant; stated as a cyclic duration factor (15, 25, 40, 60 %) | hoist travel, doors, positioning axes |
| S4 | Intermittent periodic with starting | like S3, but each cycle starts the motor and the starts heat it | cranes, lifts, presses |
| S5 | Intermittent periodic with electric braking | like S4 plus electric braking in each cycle | reversing and indexing drives |
| S6 | Continuous operation periodic | load, then no-load running — no rest | saws, machine tools, punching |
| S7 | Continuous with electric braking | start, load, electric brake, repeat, no rest | reversing mill tables |
| S8 | Continuous with related load and speed changes | runs at several speeds and loads in turn | pole-changing motors |
| S9 | Non-periodic load and speed variations | load and speed vary irregularly, with frequent overloads | most VFD and servo drives |
| S10 | Discrete constant loads | a few distinct load levels; rated for thermal life | variable-duty equipment |

Unless stated otherwise an S3 or S6 cycle lasts 10 minutes; S4, S5, S7 and S8 are stated with their cycles or starts per hour. A duty is written in full on the plate: "S2 30 min", "S3 25 %", "S4 40 % 120 starts/h FI 2", where FI, the *factor of inertia*, is the total inertia divided by the motor's own.

### The physics behind the ratings
Under a steady loss $P$ the winding temperature rise approaches $\\Delta T_\\infty = P R_{th}$ as $\\Delta T = \\Delta T_\\infty (1 - e^{-t/\\tau})$. So:
- **S2:** in 30 minutes, with $\\tau$ = 30 min, the winding reaches only 63 % of its final rise — the motor can carry losses about 1.6 times the S1 losses for that half hour. With copper losses growing as the square of load, that is roughly 1.3 times rated load.
- **S3:** cycles much shorter than $\\tau$ heat the motor by their *average* loss. If all losses were copper and cooling stayed the same, the allowed current would grow as $1/\\sqrt D$ with the duty factor $D$. Real motors give less: iron and friction losses do not rest, and a self-ventilated motor cools two to four times more slowly at standstill because its fan stops. For a model 7.5 kW motor that means about 1.3× rated load at S3 40 %, not the ideal 1.58×.
- **S6:** the motor never stops, so the fan keeps cooling during the no-load part — better than S3 at the same duty factor.
- **S4 and S5:** every direct-on-line start puts into the rotor as heat about the kinetic energy the load gains, and about as much again into the stator; catalogues give the permitted starts per hour for a given FI.
- **S9:** drives with varying load are sized by their [[rms-torque-sizing|RMS torque]] over the cycle, with the peaks checked separately.

In the sim, choose a duty and a load and watch the winding temperature ride up and down each cycle towards its limit.

### The limits that heating does not cover
Short duty does not lift the other ceilings. The breakdown torque of an induction motor, the peak current of a drive, magnet demagnetisation in a PM motor and the gearbox rating limit the overload whatever the temperature. IEC 60034-1 asks general-purpose induction motors to withstand an occasional 1.5 times rated current for 2 minutes and 1.6 times rated torque for 15 seconds — tests of robustness, not ratings for repeated use.

> [!warn] Thermal protection must follow the real duty. An overload relay set for S1 may trip a motor that is fine in S3, or let a motor with many starts overheat. Winding thermistors (PTC) or a drive's thermal model that follows the actual cycle protect intermittent duties properly.

> [!key] The S-number says how the rating was earned. Short or intermittent duty lets a motor give more than its S1 rating because the winding heats slowly — but only as the maker's data allows, and never beyond the torque, current and gearbox limits.
`,
  ideas: [
    'IEC 60034-1 defines ten duty types: S1 continuous, S2 short-time, S3–S5 intermittent (with starts and braking), S6–S10 continuous with varying load.',
    'The winding heats exponentially with a time constant of tens of minutes, so short or intermittent loads can exceed the S1 rating.',
    'The ideal intermittent overload is 1/√D in current; real motors allow less because constant losses remain and a stopped fan cools poorly.',
    'Each start of a motor heats its rotor by about the kinetic energy given to the load; starts per hour are a rating of their own.',
    'Varying loads (S9) are sized by RMS torque, with peaks checked against breakdown torque and drive limits.'
  ],
  pitfalls: [
    'An S1 rating is the most a motor can ever give — For short or intermittent duty it can give more, up to the maker\'s S2–S6 figures and the torque limits.',
    'A motor rated "S3 25 %" can run continuously at that power — It would overheat: the rating assumes three-quarters of each 10-minute cycle at rest.',
    'Intermittent duty only matters for heating — Frequent starts, braking and the inertia they move add heat of their own and wear contactors and brakes.'
  ],
  formulas: [
    {
      name: 'Temperature rise while heating',
      expr: 'dT = dTinf*(1 - exp(-t/tau))', tex: '\\Delta T = \\Delta T_\\infty\\left(1 - e^{-t/\\tau}\\right)',
      vars: {
        dT: { name: 'winding temperature rise after time t', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        dTinf: { name: 'final (steady) rise at this load', q: 'dtemp', unit: 'K', value: 119, tex: '\\Delta T_\\infty' },
        t: { name: 'time under load', q: 'time', unit: 'min', value: 30 },
        tau: { name: 'thermal time constant', q: 'time', unit: 'min', value: 30, tex: '\\tau' }
      },
      note: 'A one-body model starting cold. Real windings heat a little faster at first than the frame.',
      stories: { dT: 'A motor overloaded to a final rise of {dTinf} (time constant {tau}) runs for {t}. What rise does it reach?', t: 'How long can a motor with time constant {tau}, heading for {dTinf}, run before its rise reaches {dT}?' }
    },
    {
      name: 'Ideal intermittent current (all losses in copper, cooling unchanged)',
      expr: 'I = In/sqrt(D)', tex: 'I = \\frac{I_n}{\\sqrt{D}}',
      vars: {
        I: { name: 'current allowed while on', q: 'current', unit: 'A' },
        In: { name: 'continuous (S1) rated current', q: 'current', unit: 'A', value: 14.6, tex: 'I_n' },
        D: { name: 'cyclic duration factor', q: 'ratio', unit: '%', value: 40, min: 1, max: 100 }
      },
      note: 'An upper bound for cycles much shorter than the thermal time constant. Use the maker\'s S3 data for real ratings.',
      stories: { I: 'A motor rated {In} continuously works in short cycles, on {D} of the time. What current could it carry at best while on?' }
    },
    {
      name: 'RMS torque of a two-part cycle',
      expr: 'Trms = sqrt((T1^2*t1 + T2^2*t2)/(t1 + t2))', tex: 'T_{\\mathrm{rms}} = \\sqrt{\\frac{T_1^2\\,t_1 + T_2^2\\,t_2}{t_1 + t_2}}',
      vars: {
        Trms: { name: 'RMS (thermally equivalent) torque', q: 'torque', unit: 'N·m', tex: 'T_{\\mathrm{rms}}' },
        T1: { name: 'torque in the first part', q: 'torque', unit: 'N·m', value: 70, tex: 'T_1' },
        t1: { name: 'duration of the first part', q: 'time', unit: 's', value: 4, tex: 't_1' },
        T2: { name: 'torque in the second part', q: 'torque', unit: 'N·m', value: 20, tex: 'T_2' },
        t2: { name: 'duration of the second part', q: 'time', unit: 's', value: 6, tex: 't_2' }
      },
      note: 'For S6 and S9 duties with cycles short compared with the thermal time constant; compare with the rated torque.',
      stories: { Trms: 'A motor gives {T1} for {t1}, then {T2} for {t2}, over and over. What continuous torque heats it the same?' }
    }
  ],
  examples: [
    {
      title: 'Half an hour at 130 %',
      q: 'A 7.5 kW motor has 231 W of constant losses and 565 W of load losses at rated load, a rated rise of 80 K and a thermal time constant of 30 min. Can it carry 130 % load for 30 minutes from cold (S2 30 min)?',
      steps: [
        'Losses at 130 %: $231 + 565 \\times 1.3^2 = 1186$ W. The thermal resistance is $80/796 = 0.1005$ K/W, so the final rise would be $1186 \\times 0.1005 = 119$ K.',
        'After 30 min: $\\Delta T = 119 \\times (1 - e^{-1}) = 75$ K — below the 80 K the insulation is rated for.',
        'Then the motor must rest until cold before the next run.'
      ],
      a: 'Yes: about 75 K after 30 minutes, within the 80 K rise.'
    },
    {
      title: 'S3 40 % with a slow-cooling motor',
      q: 'The same motor works in 10-minute cycles, on 40 % of the time. At rest its fan stops and it cools three times more slowly. What load can it carry while on?',
      steps: [
        'For short cycles the mean rise is set by the mean loss against the mean cooling: $0.4\\,P = G\\,\\Delta T\\,(0.4 + 0.6/3)$, with $G = 1/R_{th}$.',
        'For 80 K: $P = 796 \\times 0.6/0.4 = 1194$ W.',
        '$231 + 565\\,x^2 = 1194$ gives $x = 1.31$: about 130 % load while on (the ideal $1/\\sqrt{0.4}$ would say 158 %).'
      ],
      a: 'About 1.3 times rated load — less than the ideal 1/√D because of the constant losses and the stopped fan.'
    },
    {
      title: 'RMS torque of a saw',
      q: 'A saw motor gives 70 N·m for 4 s while cutting, then 20 N·m for 6 s while returning, continuously (S6). Its rated torque is 49 N·m. Is it thermally suitable?',
      steps: [
        '$T_{\\mathrm{rms}} = \\sqrt{(70^2 \\times 4 + 20^2 \\times 6)/10} = \\sqrt{2200} = 46.9$ N·m.',
        'That is below the rated 49 N·m, so it runs within its temperature rating; the 70 N·m peak is well under its breakdown torque (about 2.5–3 times rated).'
      ],
      a: 'Yes: 46.9 N·m RMS against 49 N·m rated.'
    }
  ],
  quiz: [
    { q: 'A motor plate reads "S3 25 %". What does that mean?', choices: ['Cycles of 10 minutes: 2.5 minutes at the rated load, 7.5 minutes at rest, starts not significant', 'It may be loaded to 125 % continuously', '25 % of the time at no load', 'It must run 25 minutes, then rest'], a: 0, why: 'S3 is intermittent periodic duty; the cyclic duration factor is the on-time fraction, in a 10-minute cycle unless stated.' },
    { q: 'Why does a motor allow more load in S6 40 % than in S3 40 %?', choices: ['In S6 it keeps running between loads, so its fan keeps cooling it', 'S6 cycles are shorter', 'S6 motors have better insulation', 'It does not: they are the same'], a: 0, why: 'In S3 the motor stops and a self-ventilated motor cools slowly at rest; in S6 it runs unloaded, with only its constant losses, and the fan keeps working.' },
    { q: 'A motor rated S2 60 min can safely run the same load all day.', a: false, why: 'Its rating relies on stopping after an hour and cooling down. Run continuously it heads for a higher final temperature than its insulation is rated for.' },
    { q: 'Why is the real intermittent overload of a motor less than the ideal 1/√D?', choices: ['Iron and friction losses do not rest with the load, and a stopped fan cools poorly', 'The copper resistance falls when hot', 'Short cycles cool the motor too much', 'The duty factor is measured wrongly'], a: 0, why: 'The 1/√D rule assumes all losses are copper losses and the cooling is the same at rest; neither is true for a fan-cooled induction motor.' },
    { q: 'What is the RMS torque of 60 N·m for 2 s followed by 10 N·m for 8 s, repeated?', answer: 28.3, unit: 'N·m', why: '√((3600 × 2 + 100 × 8)/10) = √800 = 28.3 N·m.' }
  ],
  problems: [
    { q: 'A winding heading for a final rise of 100 K has a thermal time constant of 40 min. How long until its rise reaches 50 K?', answer: 27.7, unit: 'min', tol: 0.01, steps: ['$50 = 100(1 - e^{-t/40})$, so $e^{-t/40} = 0.5$.', '$t = 40 \\ln 2 = 27.7$ min.'] },
    { q: 'Ideally (all losses in copper, cooling unchanged), what current can a motor rated 20 A continuously carry in short cycles with a 25 % duty factor?', answer: 40, unit: 'A', tol: 0.01, steps: ['$I = 20/\\sqrt{0.25} = 40$ A — an upper bound; real motors allow less.'] }
  ],
  choose: {
    good: [
      'An S1 rating for anything that runs longer than two or three thermal time constants at a time: pumps, fans, compressors, conveyors.',
      'The maker\'s S3/S4 ratings for cranes, hoists, doors and indexing drives, where the on-time is short and the starts are many.',
      'RMS-torque sizing for servo and VFD axes with repeating move cycles (S9).'
    ],
    avoid: [
      'Running a short-time or intermittently rated motor (S2, S3 — common in actuators and small hoists) continuously.',
      'Frequent direct-on-line starts of high-inertia loads without checking the permitted starts per hour.',
      'Relying on the ideal 1/√D overload without the maker\'s data.'
    ],
    check: [
      'The real cycle: on-time, rest, starts per hour, braking, the factor of inertia and the ambient temperature.',
      'The peak torque against breakdown torque, drive current limit and gearbox rating.',
      'That the protection (thermistors, drive thermal model, overload relay) matches the duty.'
    ]
  },
  applications: [
    'Crane and hoist motors are specified by S3/S4 duty classes with starts per hour and cyclic duration factors.',
    'Valve actuators and gate drives are often short-time rated (S2) motors: small and cheap for their torque.',
    'Servo axes on packaging and pick-and-place machines are sized by RMS torque over the move cycle.'
  ],
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: the duty types S1 to S10, their designations, occasional excess current and momentary excess torque.',
    'IEC 60034-11, *Rotating electrical machines — Thermal protection*.',
    'Hughes and Drury, *Electric Motors and Drives* — motor ratings, cooling and intermittent duty.'
  ],
  sim: 'mb-duty'
},

{
  id: 'nameplate-reading', parent: 'motor-ratings', title: 'Reading a motor nameplate', level: 1,
  short: 'The nameplate is the motor\'s identity card: power, voltages and connections, currents, speed, frequency, power factor, efficiency class, duty, insulation class, protection and cooling, frame and mounting — and on NEMA plates the service factor, code letter and design letter. Read it field by field before wiring, protecting or replacing a motor.',
  keywords: ['nameplate', 'rating plate', 'rated voltage', 'rated current', 'star delta', 'Δ/Y', 'rated speed', 'cos φ', 'efficiency', 'IE class', 'duty type', 'insulation class', 'IP', 'IC', 'IM', 'frame', 'service factor', 'SF', 'code letter', 'design letter', 'FLA', 'NEMA nominal efficiency'],
  prereq: ['power-units', 'power-factor', 'efficiency-losses', 'duty-cycles'],
  related: ['motor-standards', 'insulation-classes', 'ip-cooling', 'efficiency-classes', 'star-delta-connection', 'dual-voltage-motors', 'vfd-parameters', 'motor-protection'],
  body: `
Everything you need to wire, protect, drive and replace a motor is on its rating plate — if you read it carefully. Layouts differ from maker to maker, but the contents are set by IEC 60034-1 (and NEMA MG 1 in North America). In the simulation, click any field of the plate to see what it means and what it lets you calculate.

### An IEC plate, field by field (a typical 7.5 kW motor)
| Field | Example | What it tells you |
|---|---|---|
| 3~ Mot. | three-phase motor | the supply it needs |
| Standard | IEC 60034-1 | the rules the ratings follow |
| Frame | 132M | shaft height 132 mm, length code M ([[motor-standards]]) |
| IM | B3 | foot mounting |
| IP / IC | IP55 / IC411 | protection and cooling ([[ip-cooling]]) |
| Th.Cl. | 155 (F), ΔT 80 K | insulation class F used at class B temperature rise ([[insulation-classes]]) |
| Duty | S1 | continuous ([[duty-cycles]]) |
| V | 400 Δ / 690 Y | connect in delta on 400 V, in star on 690 V |
| A | 14.6 / 8.4 | full-load line current for each connection |
| kW | 7.5 | mechanical output at the shaft |
| rpm | 1455 | speed at full load: 4 poles on 50 Hz, 3 % slip |
| Hz | 50 | frequency of the rating |
| cos φ | 0.82 | power factor at full load ([[power-factor]]) |
| IE / η | IE3 — 90.4 % (and 75 %, 50 % values) | efficiency class and efficiency ([[efficiency-classes]]) |
| Ambient, altitude | −20…+40 °C, ≤ 1000 m | the conditions of the rating |
| Bearings, grease | e.g. a 6308 size at the drive end | for maintenance |
| Weight, serial number | | for handling and spares |

Many plates add a second voltage line for 60 Hz (often 460 V, with a higher power and speed), a speed range and torque data for drive operation, and the thermistor type if fitted.

### What you can work out from it
- **Poles and slip:** the synchronous speed is the standard value just above the rated speed ($120f/p$: 3000, 1500, 1000, 750 rpm at 50 Hz). 1455 rpm means 4 poles and $(1500 - 1455)/1500$ = 3 % slip.
- **Rated torque:** $7500/(1455 \\times 2\\pi/60)$ = 49.2 N·m.
- **Input and losses:** $\\sqrt3 \\times 400 \\times 14.6 \\times 0.82$ = 8.29 kW in, so 790 W of losses and an efficiency of 90.4 % — the plate checks itself.
- **The connection:** the lower voltage is always the delta connection. A "230 Δ / 400 Y" motor on a 400 V supply goes in **star**; connected in delta each winding would see 400 V instead of 230 V — 73 % too much flux — and it would burn out within minutes.

### A NEMA plate
| Field | Example | Meaning |
|---|---|---|
| HP | 10 | output, in horsepower |
| Volts / FLA | 230/460 V, 24.8/12.4 A | full-load amps at each voltage (dual-voltage winding) |
| RPM, Hz, Phase | 1765, 60, 3 | 4 poles, 1.9 % slip |
| Frame | 215T | shaft height 5¼ in (21/4) |
| SF | 1.15 | may carry 115 % load continuously at rated voltage and frequency, hotter and with shorter insulation life |
| Code | H | locked-rotor kVA per hp: H is 6.3–7.1 |
| Design | B | normal starting torque and starting current (A, C, D differ) |
| NEMA Nom. Eff. | 91.7 % | nominal efficiency (the NEMA Premium level for this size) |
| Ins. class, Amb., Duty, Encl. | F, 40 °C, Cont., TEFC | as on IEC plates |

> [!warn] The plate and the terminal-box diagram govern the wiring — not a rule of thumb or a drawing from another motor. Connections at the terminal box are for qualified electricians, with the supply isolated, locked off and proven dead.

> [!tip] When a motor is on a VFD, enter the plate data — voltage, current, frequency, speed, power and cos φ — into the drive before auto-tuning ([[vfd-parameters]]). Set an overload relay to the plate current for the connection used; in a star–delta starter with the relay in the winding circuit, that is about 0.58 times the plate current.

> [!key] Read the plate before you connect, protect or replace a motor: voltage and connection, current, speed (and so poles), power, cos φ and efficiency, duty, insulation, IP and IC, frame and mounting. Its numbers check each other: $P = \\sqrt3\\,V I\\,\\cos\\varphi\\,\\eta$.
`,
  ideas: [
    'The plate gives the rated output (shaft power), the voltage for each connection and the matching full-load currents.',
    'The rated speed reveals the number of poles and the slip: 1455 rpm on 50 Hz means 4 poles and 3 % slip.',
    'On a dual-voltage motor the lower voltage is the delta connection; connecting for the wrong voltage burns the winding.',
    'Duty, insulation class, IP and IC codes and the ambient conditions say under what conditions the rating holds.',
    'NEMA plates add the service factor, the code letter (starting kVA per hp) and the design letter (torque characteristics).'
  ],
  pitfalls: [
    'A 230 Δ / 400 Y motor goes in delta because delta is "normal" — On a 400 V supply it must be star; delta would put 400 V on windings made for 230 V.',
    'The service factor is spare capacity to size into — It is a margin for occasional overload; running on it shortens insulation life and leaves no reserve.',
    'The plate current is what the motor always draws — It is the full-load current at rated voltage; at part load the current is lower (but not proportionally, because of the magnetising current).'
  ],
  formulas: [
    {
      name: 'Synchronous speed from poles and frequency',
      expr: 'ns = 120*f/p', tex: 'n_s = \\frac{120\\,f}{p}',
      vars: {
        ns: { name: 'synchronous speed', q: false, unit: 'rpm', tex: 'n_s' },
        f: { name: 'supply frequency', q: false, unit: 'Hz', value: 50 },
        p: { name: 'number of poles', q: false, value: 4, int: true, min: 2, max: 48 }
      },
      note: 'Rated speed sits a few per cent below: pick the synchronous speed just above the plate speed to find the poles.',
      stories: { ns: 'A {p}-pole motor runs on {f}. What is its synchronous speed?', p: 'A motor\'s field turns at {ns} on {f}. How many poles has it?' }
    },
    {
      name: 'Checking the plate: efficiency from V, I and cos φ',
      expr: 'eta = P/(sqrt(3)*V*I*PF)', tex: '\\eta = \\frac{P}{\\sqrt{3}\\,V\\,I\\,\\mathrm{PF}}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        P: { name: 'rated output', q: 'power', unit: 'kW', value: 7.5 },
        V: { name: 'rated voltage (line-to-line)', q: 'voltage', unit: 'V', value: 400 },
        I: { name: 'rated current', q: 'current', unit: 'A', value: 14.6 },
        PF: { name: 'rated power factor cos φ', value: 0.82, min: 0.05, max: 1, tex: '\\mathrm{PF}' }
      },
      stories: { eta: 'A plate reads {P}, {V}, {I}, cos φ {PF}. What efficiency do these imply?', I: 'A {P} motor on {V} with cos φ {PF} and efficiency {eta}: what current should the plate show?' }
    },
    {
      name: 'Locked-rotor current from the NEMA code letter',
      expr: 'ILR = k*HP*1000/(sqrt(3)*V)', tex: 'I_{\\mathrm{LR}} = \\frac{1000\\,k\\,\\mathrm{HP}}{\\sqrt{3}\\,V}',
      vars: {
        ILR: { name: 'locked-rotor (starting) current', q: false, unit: 'A', tex: 'I_{\\mathrm{LR}}' },
        k: { name: 'locked-rotor kVA per hp (from the code letter)', q: false, unit: 'kVA/hp', value: 6.7 },
        HP: { name: 'rated horsepower', q: false, unit: 'hp', value: 10, tex: '\\mathrm{HP}' },
        V: { name: 'line voltage', q: false, unit: 'V', value: 460 }
      },
      note: 'Code letters give ranges: G 5.6–6.3, H 6.3–7.1, J 7.1–8.0, K 8.0–9.0 kVA/hp.',
      stories: { ILR: 'A {HP} motor on {V} has a code letter meaning {k}. What current does it draw at the moment of starting?' }
    }
  ],
  examples: [
    {
      title: 'Everything from one plate',
      q: 'A plate reads: 7.5 kW, 400 Δ/690 Y V, 14.6/8.4 A, 1455 rpm, 50 Hz, cos φ 0.82. Find the poles, slip, rated torque, input power, losses, and the connection for a 400 V supply.',
      steps: [
        'Synchronous speed just above 1455 rpm at 50 Hz is 1500 rpm: 4 poles; slip $(1500 - 1455)/1500 = 3.0$ %.',
        'Torque $7500/152.4 = 49.2$ N·m.',
        'Input $\\sqrt3 \\times 400 \\times 14.6 \\times 0.82 = 8.29$ kW; losses $\\approx 0.79$ kW; efficiency 90.4 %.',
        'On 400 V: delta (400 V is the lower of the two voltages). On a 690 V supply: star, 8.4 A.'
      ],
      a: '4 poles, 3 % slip, 49.2 N·m, 8.3 kW in, about 0.8 kW of losses; delta on 400 V.'
    },
    {
      title: 'The wrong connection',
      q: 'A small motor marked 230 Δ / 400 Y V is connected in delta to a 400 V supply. What does each winding see, and what happens?',
      steps: [
        'In delta each winding sits across the line voltage: 400 V instead of the 230 V it was designed for.',
        'Flux ∝ V/f rises by $400/230 = 1.74$ — deep saturation; the magnetising current becomes many times normal.',
        'The motor hums, draws a huge current and trips its protection or burns out. Correct: star on 400 V (each winding then sees $400/\\sqrt3 = 231$ V); delta only on a 230 V three-phase supply, still found in some countries.'
      ],
      a: '400 V per winding, 74 % over its design: it must be star-connected on 400 V.'
    },
    {
      title: 'Starting current from a NEMA code letter',
      q: 'A 10 hp, 460 V motor with FLA 12.4 A has code letter H (6.3–7.1 kVA/hp). Estimate its starting current.',
      steps: [
        'Locked-rotor kVA: $6.3 \\times 10 = 63$ to $7.1 \\times 10 = 71$ kVA.',
        '$I = 63{,}000/(\\sqrt3 \\times 460) = 79$ A to $71{,}000/(\\sqrt3 \\times 460) = 89$ A.',
        'That is 6.4 to 7.2 times the full-load current — size the supply, fuses and any generator set for it.'
      ],
      a: 'About 79–89 A, 6–7 times FLA.'
    }
  ],
  quiz: [
    { q: 'A motor runs at 970 rpm on 50 Hz. How many poles has it?', choices: ['6', '4', '8', '2'], a: 0, why: 'The synchronous speed just above 970 rpm is 1000 rpm = 120 × 50/6.' },
    { q: 'A plate reads "400 Δ / 690 Y V". Your supply is 400 V three-phase. How do you connect it?', choices: ['Delta', 'Star', 'Either works', 'Star for starting only, never delta'], a: 0, why: 'The lower voltage belongs to the delta connection: in delta each winding sees the full 400 V it is designed for.' },
    { q: 'A NEMA service factor of 1.15 means the motor should normally be sized to run at 115 % load.', a: false, why: 'The service factor is a margin for occasional overload at rated voltage and frequency; running on it raises the temperature and shortens insulation life.' },
    { q: 'What does "Th.Cl. 155 (F), ΔT 80 K" tell you?', choices: ['Class F insulation (155 °C), operated at the smaller class B temperature rise — a thermal margin', 'The motor runs at 155 °C', 'It is rated for 80 °C ambient', 'The winding must be kept below 80 °C'], a: 0, why: 'Class F insulation is rated for 155 °C hot spot; limiting the rise to 80 K (class B) leaves about 25 K of margin, which roughly multiplies insulation life several times.' },
    { q: 'Using the plate values 4 kW, 400 V, 8.2 A, cos φ 0.80, what efficiency do they imply?', answer: 88, unit: '%', why: 'η = 4000/(√3 × 400 × 8.2 × 0.80) = 4000/4545 = 88 %.' }
  ],
  problems: [
    { q: 'A 60 Hz motor runs at 1170 rpm at full load. How many poles has it?', answer: 6, tol: 0.001, steps: ['Synchronous speeds at 60 Hz: 3600, 1800, 1200, 900 rpm.', 'Just above 1170 rpm is 1200 rpm $= 120 \\times 60/6$: six poles, 2.5 % slip.'] },
    { q: 'A plate reads 15 kW, 400 V, 28.5 A, cos φ 0.84. What efficiency does it imply?', answer: 90.4, unit: '%', tol: 0.01, steps: ['Input $\\sqrt3 \\times 400 \\times 28.5 \\times 0.84 = 16.59$ kW.', '$\\eta = 15/16.59 = 90.4$ % — a little low for a 15 kW IE3 motor (about 92 %): check the plate or the model.'] }
  ],
  choose: {
    good: [
      'Replacing like for like: the same power, speed, voltage and connection, frame and mounting, shaft, IP, IC, duty and insulation class.',
      'Motors whose plates give 50 Hz and 60 Hz data, or a speed range for drive operation, when a machine may be exported or run on a VFD.'
    ],
    avoid: [
      'Choosing a replacement by kW alone: a different speed, frame or connection may not fit or may not run.',
      'Guessing the connection of an unmarked or painted-over motor: find the data or have it tested.'
    ],
    check: [
      'That one of the plate\'s voltage lines matches your supply and the connection in the terminal box.',
      'The plate current for cables, fuses, overload relays and the drive\'s motor data.',
      'Ambient, altitude, duty and IP against the real installation.'
    ]
  },
  applications: [
    'Commissioning a VFD: the plate data go into the drive\'s motor parameters before auto-tuning.',
    'Protection settings: overload relays and motor-protective circuit breakers are set from the plate current.',
    'Spares and maintenance: frame, mounting, bearings and grease on the plate let you order the right parts.'
  ],
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: the rating plate and the quantities it must show.',
    'NEMA MG 1, *Motors and Generators*: nameplate markings, service factor, locked-rotor code letters and design letters.',
    'IEC 60034-8: terminal markings and direction of rotation.'
  ],
  sim: ['mb-nameplate', 'mb-frames']
},

{
  id: 'insulation-classes', parent: 'motor-ratings', title: 'Insulation classes and temperature rise', level: 2,
  short: 'A winding\'s insulation ages with heat: roughly every 10 K hotter halves its life. Thermal classes (B 130 °C, F 155 °C, H 180 °C) say how hot it may get; IEC 60034-1 limits the temperature rise above a 40 °C ambient accordingly. Most motors use class F insulation at the smaller class B rise, for a margin of about 25 K.',
  keywords: ['insulation class', 'thermal class', 'class B', 'class F', 'class H', 'temperature rise', 'hot spot', 'IEC 60085', '10 K rule', 'Arrhenius', 'insulation life', 'resistance method', 'thermistor', 'PTC', 'PT100', 'ambient derating', 'altitude derating', 'insulation resistance', 'polarization index'],
  prereq: ['efficiency-losses', 'physics:heat-transfer'],
  related: ['duty-cycles', 'ip-cooling', 'motor-heating', 'motor-protection', 'motor-failures', 'vfd-wiring-emc', 'maintenance-diagnostics'],
  body: `
The insulation of a winding — the enamel on each wire, the slot liners, the phase separators, the varnish or resin that bonds them — is organic chemistry, and heat slowly degrades it. It becomes brittle, cracks with vibration and thermal cycling, lets moisture and dirt in, and one day two turns touch: a turn-to-turn short, then a burnt winding. Heat is the most common enemy of windings, so motors are rated by how hot their insulation may run.

### Thermal classes
| Thermal class (IEC 60085) | Letter | Allowed rise by resistance at 40 °C ambient (IEC 60034-1) | Hot-spot allowance |
|---|---|---|---|
| 105 °C | A | — (rarely used in modern motors) | |
| 120 °C | E | — (rarely used in modern motors) | |
| 130 °C | B | 80 K | about 10 K |
| 155 °C | F | 105 K | about 10 K |
| 180 °C | H | 125 K | about 15 K |
| 200 / 220 / 250 °C | N / R / – | special machines | |

The rise is the *average* winding temperature above the cooling air, measured by the change of resistance; the hottest spot, deep in a slot or at an end winding, is some 5–15 K hotter, and the class temperature is the limit for that hot spot. Nearly all modern industrial motors are built with **class F insulation but designed for a class B rise** — about 120 °C average and 130 °C hot spot in a 40 °C room — leaving some 25 K of margin for hot days, voltage variations, a VFD's extra losses or a little overload.

### Ten kelvin, half the life
Insulation ageing is a chemical reaction, and like most such reactions it follows the Arrhenius law: its rate roughly doubles for every 8–12 K. The usual rule of thumb is **10 K hotter, half the life**:

$$L = L_0 \\cdot 2^{(T_c - T)/\\Delta T_h}$$

A common reference is about 20,000 hours at the class temperature — the order used in thermal-endurance testing. With the 25 K margin of a class F motor at class B rise that becomes about 113,000 hours, some 13 years of continuous running; 10 K over the class limit, only about 10,000 hours. In the sim, raise the ambient or the load and watch the life on the logarithmic scale fall by half for every 10 K.

### Heat from outside the motor
The rating assumes an ambient of at most 40 °C and an altitude of at most 1000 m. Hotter air or thinner air (which cools less) means less load: catalogues give derating factors, typically a few per cent for every 5 K above 40 °C and for every 500 m above 1000 m. If all losses grew with the square of the load, the allowed load at ambient $T_a$ would be about $\\sqrt{(\\Delta T_r + 40 - T_a)/\\Delta T_r}$ of rated.

### Measuring and protecting
- **By resistance:** a copper winding's resistance rises 0.39 % per kelvin; comparing hot and cold resistance gives the average temperature: $T_{\\mathrm{hot}} = \\frac{R_{\\mathrm{hot}}}{R_{\\mathrm{cold}}}(235 + T_{\\mathrm{cold}}) - 235$.
- **PTC thermistors**, one in each phase of the winding and chosen for the insulation class, jump in resistance at their rated temperature and trip a relay — they see blocked cooling, high ambient and frequent starts that an overload relay cannot.
- **PT100 sensors** in the windings and bearings of large motors give a continuous reading; servo motors often carry a KTY or PT1000 sensor; small motors a bimetal thermal protector that opens its contacts.
- **Insulation resistance** measured with a DC insulation tester (500 V or 1000 V for low-voltage motors) finds moisture and contamination. IEEE Std 43 suggests at least 5 MΩ, corrected to 40 °C, for random-wound windings below 1 kV, and a polarization index of about 2 for class F and H insulation. Dry a damp motor before energising it; anti-condensation heaters keep idle motors dry.

> [!warn] Motors fed from a VFD see steep voltage edges which, with long cables, can reach up to about twice the DC-bus voltage at the terminals and cause partial discharges that erode standard enamel. Use motors rated for inverter duty, keep cables short or fit dV/dt or sine filters as the drive maker specifies (see [[vfd-wiring-emc]]).

> [!key] Heat ages insulation: about half the life for every 10 K. Class F insulation at class B rise is the norm; watch ambient, altitude, cooling and load, and protect the winding with sensors that measure its real temperature.
`,
  ideas: [
    'Thermal classes set the hot-spot limit: B 130 °C, F 155 °C, H 180 °C; IEC 60034-1 limits the average rise at 40 °C ambient (B 80 K, F 105 K, H 125 K).',
    'Insulation life roughly halves for every 10 K of extra temperature (Arrhenius ageing).',
    'Most motors use class F insulation at class B rise, leaving about 25 K of margin — several times the life.',
    'Ratings assume ≤ 40 °C ambient and ≤ 1000 m altitude; hotter or higher sites need derating.',
    'Thermistors and RTDs protect against what current-based relays cannot see: blocked cooling, hot ambient, many starts.'
  ],
  pitfalls: [
    'A class F motor can run at 155 °C for a normal life — 155 °C is the hot-spot limit for a reference life of the order of 20,000 hours; long life needs a good margin below it.',
    'The temperature on the frame is the winding temperature — The frame is typically tens of kelvin cooler than the winding hot spot; 70–90 °C on the housing of a fully loaded TEFC motor can be quite normal.',
    'An overload relay protects the winding against any overheating — It infers heating from current; a clogged fan, hot ambient or failed cooling overheats the winding at normal current.'
  ],
  formulas: [
    {
      name: 'Insulation life: the 10 K rule',
      expr: 'L = L0*2^((Tc - T)/dTh)', tex: 'L = L_0 \\cdot 2^{(T_c - T)/\\Delta T_h}',
      vars: {
        L: { name: 'expected insulation life', q: false, unit: 'h' },
        L0: { name: 'life at the class temperature', q: false, unit: 'h', value: 20000, tex: 'L_0' },
        Tc: { name: 'thermal class temperature', q: false, unit: '°C', value: 155, tex: 'T_c' },
        T: { name: 'hot-spot temperature in service', q: false, unit: '°C', value: 130 },
        dTh: { name: 'halving interval', q: false, unit: 'K', value: 10, min: 5, max: 20, tex: '\\Delta T_h' }
      },
      note: 'A rule of thumb from Arrhenius ageing; the halving interval is 8–12 K depending on the materials.',
      stories: { L: 'A class F winding (class temperature {Tc}) runs with its hot spot at {T}. With {L0} at the class temperature, how long should it last?', T: 'How hot may the hot spot run for a life of {L}, if the insulation gives {L0} at {Tc}?' }
    },
    {
      name: 'Winding temperature from its resistance',
      expr: 'T2 = R2/R1*(235 + T1) - 235', tex: 'T_{\\mathrm{hot}} = \\frac{R_{\\mathrm{hot}}}{R_{\\mathrm{cold}}}\\left(235 + T_{\\mathrm{cold}}\\right) - 235',
      vars: {
        T2: { name: 'hot winding temperature', q: false, unit: '°C', tex: 'T_{\\mathrm{hot}}' },
        R2: { name: 'hot resistance', q: false, unit: 'Ω', value: 1.35, tex: 'R_{\\mathrm{hot}}' },
        R1: { name: 'cold resistance', q: false, unit: 'Ω', value: 1.0, tex: 'R_{\\mathrm{cold}}' },
        T1: { name: 'temperature when cold', q: false, unit: '°C', value: 20, tex: 'T_{\\mathrm{cold}}' }
      },
      note: 'For copper (235 is the reciprocal of its temperature coefficient at 0 °C, in kelvin). Measure the hot resistance quickly after stopping.',
      stories: { T2: 'A winding measures {R1} at {T1} and {R2} straight after a heat run. What is its average temperature?' }
    },
    {
      name: 'Load allowed at a higher ambient',
      expr: 'x = sqrt((dTr + 40 - Ta)/dTr)', tex: 'x = \\sqrt{\\frac{\\Delta T_r + 40 - T_a}{\\Delta T_r}}',
      vars: {
        x: { name: 'allowed load as a fraction of rated' },
        dTr: { name: 'rated temperature rise', q: false, unit: 'K', value: 80, tex: '\\Delta T_r' },
        Ta: { name: 'ambient temperature', q: false, unit: '°C', value: 50, tex: 'T_a' }
      },
      note: 'Assumes all losses grow as load squared — a rough estimate; use the maker\'s derating tables.',
      stories: { x: 'A motor designed for a {dTr} rise at 40 °C must work in {Ta}. What fraction of its rated load can it carry?' }
    }
  ],
  examples: [
    {
      title: 'What margin buys',
      q: 'Using 20,000 h at the class temperature and the 10 K rule, estimate the insulation life of a class F winding with its hot spot at 130 °C, at 155 °C and at 165 °C.',
      steps: [
        '130 °C: $20{,}000 \\times 2^{25/10} = 20{,}000 \\times 5.66 = 113{,}000$ h — about 13 years continuous.',
        '155 °C: 20,000 h — about 2.3 years continuous.',
        '165 °C: $20{,}000 \\times 2^{-1} = 10{,}000$ h.'
      ],
      a: 'About 113,000 h, 20,000 h and 10,000 h: the 25 K margin multiplies life by more than five.'
    },
    {
      title: 'A heat run by resistance',
      q: 'A winding measures 1.00 Ω at 20 °C cold and 1.35 Ω right after a full-load run in a 25 °C room. What is its average temperature and rise? The motor is class F, designed for a class B rise.',
      steps: [
        '$T_{\\mathrm{hot}} = 1.35 \\times (235 + 20) - 235 = 109$ °C.',
        'Rise $109 - 25 = 84$ K: above the 80 K it was designed for but within class F\'s 105 K.',
        'Look for the reason: dirty fins, a high supply voltage, unbalance or a heavier load than assumed.'
      ],
      a: '109 °C, a rise of 84 K — hotter than designed; investigate.'
    },
    {
      title: 'A hot boiler house',
      q: 'A 7.5 kW motor designed for an 80 K rise must work in 50 °C air. Roughly what load can it carry?',
      steps: [
        '$x = \\sqrt{(80 + 40 - 50)/80} = \\sqrt{0.875} = 0.935$.',
        'About 94 % of rated, 7.0 kW — the maker\'s derating table may say a little less, because the constant losses do not fall with the load.'
      ],
      a: 'About 7 kW.'
    }
  ],
  quiz: [
    { q: 'What is the thermal class temperature of class F insulation?', choices: ['155 °C', '130 °C', '180 °C', '105 °C'], a: 0, why: 'IEC 60085: class B 130 °C, F 155 °C, H 180 °C.' },
    { q: 'A motor\'s winding hot spot runs 10 K hotter than before. By the usual rule, its insulation life…', choices: ['roughly halves', 'falls by 10 %', 'is unchanged as long as it stays below the class limit', 'doubles'], a: 0, why: 'Chemical ageing follows the Arrhenius law; for winding insulation the rate roughly doubles per 8–12 K.' },
    { q: 'Why are class F motors usually designed for only a class B temperature rise?', choices: ['The 25 K margin multiplies insulation life and absorbs hot days, voltage variations and drive losses', 'Class F insulation cannot reach 155 °C', 'Standards forbid class F rise', 'To make the motor smaller'], a: 0, why: 'Running 25 K below the class limit gives about 2^2.5 ≈ 5.7 times the life and room for real-world extra heating.' },
    { q: 'A motor with a clogged cooling fan but normal current is protected by its overload relay.', a: false, why: 'The relay infers heating from current. Blocked cooling raises the winding temperature at the same current; only winding sensors (PTC, PT100) see it.' },
    { q: 'By the 10 K rule, how long does a winding with 20,000 h at 155 °C last at a hot spot of 145 °C?', answer: 40000, unit: 'h', why: '20,000 × 2^(10/10) = 40,000 h.' }
  ],
  problems: [
    { q: 'A winding measures 2.00 Ω at 22 °C and 2.62 Ω hot. What is its average hot temperature?', answer: 101.7, unit: '°C', tol: 0.01, steps: ['$T = (2.62/2.00)(235 + 22) - 235 = 1.31 \\times 257 - 235$.', '$T = 101.7$ °C.'] },
    { q: 'With 20,000 h at the class temperature of 180 °C (class H) and the 10 K rule, what life does a hot spot of 150 °C give?', answer: 160000, unit: 'h', tol: 0.01, steps: ['$20{,}000 \\times 2^{(180 - 150)/10} = 20{,}000 \\times 8 = 160{,}000$ h.'] }
  ],
  choose: {
    good: [
      'Class F insulation at class B rise for general industrial duty — the standard, with a useful margin.',
      'Class H insulation for hot places: furnace and kiln fans, smoke-extraction fans, motors in hot process air.',
      'PTC thermistors on motors fed from VFDs, started often, or hard to cool.'
    ],
    avoid: [
      'Running continuously close to the class limit: each 10 K costs half the life.',
      'Standard-insulation motors on long cables from fast-switching drives without the filters the drive maker specifies.',
      'Energising a motor that has stood damp without an insulation-resistance check.'
    ],
    check: [
      'Ambient temperature and altitude against the rating (40 °C, 1000 m) and the maker\'s derating.',
      'Insulation resistance after storage, flooding or long idle periods.',
      'That the thermistor relay is wired and tested, not just the thermistors fitted.'
    ]
  },
  applications: [
    'Smoke-extract fans are specified for a stated temperature and time in a fire; their motors use high-class insulation and special cooling.',
    'Predictive maintenance: periodic insulation-resistance and polarization-index tests show a winding drying out or getting contaminated.',
    'Heat-run tests on repaired motors check the rise by resistance against the plate class.'
  ],
  history: 'Letters for insulation classes (A, B, C…) came from the early electrical standards of the 20th century, when insulation meant cotton, paper, mica and varnish. The numerical thermal classes of IEC 60085 replaced the letters\' materials with tested temperature ratings; the rule that each 8–10 °C halves life is associated with V. M. Montsinger\'s work on transformer insulation in the 1930s.',
  sources: [
    'IEC 60085, *Electrical insulation — Thermal evaluation and designation*: the thermal classes.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: limits of temperature rise, the resistance method, ambient and altitude.',
    'IEC 60034-11, *Rotating electrical machines — Thermal protection*.',
    'IEEE Std 43, *Recommended practice for testing insulation resistance of electric machinery*.'
  ],
  sim: 'mb-insulation-life'
},

{
  id: 'ip-cooling', parent: 'motor-ratings', title: 'IP protection and cooling methods', level: 1,
  short: 'The IP code says how well the enclosure keeps out solids (first digit) and water (second digit): IP55 is the industrial standard, IP23 an open motor, IP66–IP69 for washdown. The IC code says how the motor is cooled: IC411 is the familiar fan-cooled motor, IC416 has a separately powered fan, IC418 sits in someone else\'s air stream.',
  keywords: ['IP code', 'IP55', 'IP54', 'IP23', 'IP65', 'IP66', 'IP67', 'IP68', 'IP69', 'degree of protection', 'IC code', 'IC411', 'IC410', 'IC416', 'IC418', 'IC01', 'TEFC', 'TENV', 'ODP', 'TEAO', 'forced ventilation', 'cooling', 'drain holes', 'condensation'],
  prereq: ['insulation-classes', 'efficiency-losses'],
  related: ['motor-standards', 'nameplate-reading', 'hazardous-areas', 'motor-heating', 'motor-noise', 'v-over-f-control', 'physics:convection'],
  body: `
Two short codes on the nameplate say how a motor copes with its surroundings: what it keeps out (**IP**, *ingress protection*, IEC 60034-5 based on IEC 60529) and how it gets rid of its heat (**IC**, *international cooling*, IEC 60034-6).

### The IP code
| First digit | Protection against solids | Second digit | Protection against water |
|---|---|---|---|
| 0 | none | 0 | none |
| 1 | objects over 50 mm (a hand) | 1 | vertically dripping water |
| 2 | over 12.5 mm (a finger) | 2 | dripping, tilted up to 15° |
| 3 | over 2.5 mm (tools) | 3 | spraying water, up to 60° from vertical |
| 4 | over 1 mm (wires) | 4 | splashing from any direction |
| 5 | dust-protected: some dust may enter, not enough to harm | 5 | water jets from any direction |
| 6 | dust-tight | 6 | powerful water jets |
| | | 7 | temporary immersion (to 1 m) |
| | | 8 | continuous immersion, as agreed with the maker |

Motors you will meet:

| IP | Typical motor | Where |
|---|---|---|
| IP23 | open, drip-proof, self-ventilated through the windings | clean, dry indoor plant rooms; large motors |
| IP54 / IP55 | totally enclosed, fan-cooled (TEFC) — the industrial standard | workshops, factories, sheltered outdoors |
| IP56 | TEFC with better seals | decks, heavy rain, hose-down areas |
| IP65 / IP66 | dust-tight, jet-proof | food and beverage, mining, outdoors |
| IP67 / IP68 | immersion | submersible pumps (IP68), flood-prone pits |
| IP69 (IP69K) | high-pressure, high-temperature washdown | meat, dairy and pharmaceutical plants |

What IP does **not** say: resistance to corrosion, UV, chemicals or ice, and nothing about explosive atmospheres ([[hazardous-areas]] need Ex certification). It is also only as good as its seals: worn shaft seals, a missing cable-gland seal or an open terminal box turn IP55 into IP00. Condensation is the other enemy — a motor that cools down breathes in moist air: drain holes at the lowest point of the actual mounting position (opened or with breathers), and anti-condensation heaters for motors that stand idle in damp places.

### The IC code
The code is IC plus a digit for the circuit arrangement and one for each coolant's method of circulation:

| Code | Description | Common name |
|---|---|---|
| IC411 | frame-surface cooled; internal air stirred by the rotor; external air blown over the fins by a fan on the shaft | TEFC — the standard |
| IC410 | as IC411 but no external fan: free convection | TENV — small or slow motors, dusty places |
| IC416 | as IC411 with a separately powered fan on the motor | forced ventilation — VFD at low speed |
| IC418 | cooled by the air stream of the machine it drives | air-over (TEAO), fan motors |
| IC01 | open, air drawn through the machine by its own fan | drip-proof (ODP), IP23 |
| IC06 | open, with a separately powered fan | large open motors on drives |
| IC611 | closed internal circuit with an air-to-air heat exchanger | large motors |
| IC71W | internal heat exchanger cooled by water | water-cooled motors |

### Cooling in real life
The shaft-mounted fan of an IC411 motor moves air in proportion to speed. On a VFD at low speed its cooling falls, so for long running at low speed with full torque the motor must be derated or fitted with a separately powered fan (IC416) — check the maker's loadability curve for drive operation. Above rated speed the fan's noise and power climb steeply; on 2-pole motors the fan is often the loudest source of noise ([[motor-noise]]).

The heat goes out through the fins. Dirt, paint, a blocked fan cover, a motor boxed into a tight enclosure or mounted too close to a wall all raise the thermal resistance; in the sim, clog the fins and watch the winding temperature — 30 % more thermal resistance can cost most of a class F motor's life margin.

> [!key] IP = what it keeps out (solids, water); IC = how it cools. IP55 and IC411 describe most industrial motors; choose higher IP for washdown, dust and weather, forced cooling (IC416) for long low-speed running on a drive, and keep the fins clean.
`,
  ideas: [
    'IP codes rate protection against solids (first digit, 0–6) and water (second digit, 0–8).',
    'IP55 totally enclosed fan-cooled motors are the industrial standard; IP23 open motors need clean, dry air; IP66–IP69 suit washdown.',
    'IC codes describe cooling: IC411 fan on the shaft, IC410 no fan, IC416 separately powered fan, IC418 air-over.',
    'A shaft-mounted fan cools less at low speed, so VFD-driven motors running slowly at full torque need derating or forced ventilation.',
    'IP says nothing about corrosion or explosive atmospheres, and depends on intact seals and correct drain holes.'
  ],
  pitfalls: [
    'A higher IP number is always better — A tighter enclosure can cool worse and trap condensation; the right IP is the one that matches the place.',
    'IP68 or IP66 means the motor may be used in explosive atmospheres — Hazardous areas need Ex-certified equipment; IP is about solids and water only.',
    'A fan-cooled motor on a VFD can give full torque at any speed — Its fan slows down with it; below some speed it needs derating or a separately powered fan.'
  ],
  formulas: [
    {
      name: 'Temperature rise from losses and thermal resistance',
      expr: 'dT = P*Rth', tex: '\\Delta T = P\\,R_{th}',
      vars: {
        dT: { name: 'steady temperature rise', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        P: { name: 'losses (heat to remove)', q: 'power', unit: 'W', value: 796 },
        Rth: { name: 'thermal resistance winding–air', q: 'thermalres', unit: 'K/W', value: 0.1, tex: 'R_{th}' }
      },
      note: 'R_th is what the cooling method sets: a bigger fan, cleaner fins or water cooling lower it.',
      stories: { dT: 'A motor loses {P} as heat through a thermal resistance of {Rth}. What is its temperature rise?', Rth: 'A motor making {P} of heat must stay within a rise of {dT}. What thermal resistance must its cooling achieve?' }
    },
    {
      name: 'Thermal time constant (one-body model)',
      expr: 'tau = m*c*Rth', tex: '\\tau = m\\,c\\,R_{th}',
      vars: {
        tau: { name: 'thermal time constant', q: 'time', unit: 'min', tex: '\\tau' },
        m: { name: 'mass of the motor', q: 'mass', unit: 'kg', value: 60 },
        c: { name: 'average specific heat (iron and copper)', q: 'specificheat', unit: 'J/(kg·K)', value: 480 },
        Rth: { name: 'thermal resistance to the air', q: 'thermalres', unit: 'K/W', value: 0.1, tex: 'R_{th}' }
      },
      note: 'A rough upper estimate: the winding heats faster than the whole mass, so real winding time constants are shorter.',
      stories: { tau: 'A {m} motor (specific heat {c}) sheds heat through {Rth}. What is its thermal time constant?' }
    },
    {
      name: 'Air flow needed to carry the heat away',
      expr: 'Q = P/(rho*cp*dT)', tex: 'Q = \\frac{P}{\\rho\\,c_p\\,\\Delta T}',
      vars: {
        Q: { name: 'cooling air flow', q: 'flowrate', unit: 'm³/h' },
        P: { name: 'heat to remove', q: 'power', unit: 'W', value: 796 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.2, tex: '\\rho' },
        cp: { name: 'specific heat of air', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' },
        dT: { name: 'temperature rise of the air', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T' }
      },
      note: 'Useful for forced-ventilation fans and for ventilating a panel or a motor room.',
      stories: { Q: 'How much air must flow to carry away {P} with the air warming by {dT}?' }
    }
  ],
  examples: [
    {
      title: 'Clogged fins',
      q: 'A class F motor normally runs at an 80 K rise (hot spot 130 °C in 40 °C air). Dust on its fins raises its thermal resistance by 30 %. What happens to the hot spot and the insulation life (10 K rule, 20,000 h at 155 °C)?',
      steps: [
        'The rise grows in proportion: $80 \\times 1.3 = 104$ K; hot spot about $40 + 104 + 10 = 154$ °C.',
        'Life: from $20{,}000 \\times 2^{2.5} = 113{,}000$ h to $20{,}000 \\times 2^{0.1} \\approx 21{,}000$ h.'
      ],
      a: 'The hot spot climbs to about 154 °C and the expected life falls about fivefold: clean fins are part of maintenance.'
    },
    {
      title: 'Sizing a forced-ventilation fan',
      q: 'A motor on a VFD runs at low speed with 796 W of losses. How much air must a separate fan move if the air may warm by 10 K?',
      steps: ['$Q = 796/(1.2 \\times 1005 \\times 10) = 0.066$ m³/s.', 'That is about 240 m³/h, over the fins.'],
      a: 'About 240 m³/h.'
    },
    {
      title: 'Choosing an IP rating',
      q: 'Suggest IP ratings for: a pump in a clean plant room; a conveyor motor in a meat plant hosed down daily with hot water; a sawmill fan; a borehole pump.',
      steps: [
        'Plant room: IP55 (IP23 would do if it is really clean and dry).',
        'Meat plant: IP66 or IP69 with a smooth, cleanable (often stainless) housing and no fan to trap dirt.',
        'Sawmill: IP55 or IP65, with fins cleaned on a schedule — wood dust insulates.',
        'Borehole: IP68, a submersible motor built for it.'
      ],
      a: 'IP55, IP66/IP69, IP55/IP65 and IP68.'
    }
  ],
  quiz: [
    { q: 'A motor is marked IP55. What does it resist?', choices: ['Dust (dust-protected) and water jets from any direction', 'Complete immersion and fine dust', 'Only dripping water', 'Explosive gases'], a: 0, why: 'First digit 5: dust-protected; second digit 5: water jets.' },
    { q: 'Which cooling code describes a totally enclosed motor with no fan?', choices: ['IC410', 'IC411', 'IC416', 'IC01'], a: 0, why: 'The last digit is the method for the external coolant: 0 is free convection, 1 a fan on the shaft, 6 a separately powered fan.' },
    { q: 'An IP68 motor is suitable for an explosive atmosphere.', a: false, why: 'IP rates solids and water only; hazardous areas require Ex-certified equipment of the right group and temperature class.' },
    { q: 'An IC411 motor on a VFD runs for hours at 10 Hz at full torque. What is the risk?', choices: ['Overheating: its shaft fan turns slowly and cools poorly', 'Overspeed', 'Low power factor only', 'None: torque, not speed, sets the heating'], a: 0, why: 'Copper losses stay at full-torque level while the fan cooling falls with speed; derate or add a separately powered fan (IC416).' },
    { q: 'What air flow in m³/h removes 3 kW with a 15 K air temperature rise (ρ = 1.2 kg/m³, cp = 1005 J/(kg·K))?', answer: 597, unit: 'm³/h', why: 'Q = 3000/(1.2 × 1005 × 15) = 0.166 m³/s ≈ 597 m³/h.' }
  ],
  problems: [
    { q: 'A motor loses 1.2 kW through a thermal resistance of 0.05 K/W. What is its temperature rise?', answer: 60, unit: 'K', tol: 0.01, steps: ['$\\Delta T = 1200 \\times 0.05 = 60$ K.'] },
    { q: 'A 25 kg motor (average specific heat 480 J/(kg·K)) has a thermal resistance of 0.25 K/W. Estimate its thermal time constant in minutes.', answer: 50, unit: 'min', tol: 0.01, steps: ['$\\tau = 25 \\times 480 \\times 0.25 = 3000$ s = 50 min — an upper estimate.'] }
  ],
  choose: {
    good: [
      'IP55, IC411 (TEFC) for most indoor and sheltered industrial duty.',
      'IP56, IP65 or IP66 for weather, dust and hose-down; IP69 and smooth housings for hygienic washdown.',
      'IC416 forced ventilation for drives that run long at low speed with high torque; IC418 motors inside fans that cool them.'
    ],
    avoid: [
      'Open IP23 (IC01) motors in dusty, wet or dirty places.',
      'Boxing a fan-cooled motor into a tight enclosure or against a wall that starves its air inlet.',
      'Mounting a motor shaft-up outdoors without a rain canopy, or with its drain holes at the top.'
    ],
    check: [
      'The mounting position against the drain holes and the maker\'s instructions.',
      'The loadability curve for drive operation at your speed range.',
      'Seals, cable glands and terminal-box gaskets after maintenance — the IP depends on them.',
      'Ex certification, not IP, if the atmosphere can be explosive.'
    ]
  },
  applications: [
    'Food plants specify stainless, fanless, IP66–IP69 motors that can be hosed down and leave nowhere for bacteria.',
    'Axial fans use air-over motors (IC418) that sit in the air stream and would overheat if run without it.',
    'Test the effect of cooling on a motor on a drive in [the VFD tool](#/tools/drives/vfd).'
  ],
  sources: [
    'IEC 60034-5, *Rotating electrical machines — Degrees of protection provided by the integral design (IP code)*.',
    'IEC 60529, *Degrees of protection provided by enclosures (IP Code)*.',
    'IEC 60034-6, *Rotating electrical machines — Methods of cooling (IC code)*.',
    'NEMA MG 1, *Motors and Generators*: enclosure types (ODP, TEFC, TENV, TEAO).'
  ],
  sim: 'mb-ip-cooling'
},

{
  id: 'efficiency-classes', parent: 'motor-ratings', title: 'Efficiency classes IE1 to IE5', level: 1,
  short: 'IEC 60034-30-1 sorts motors into efficiency classes: IE1 standard, IE2 high, IE3 premium, IE4 super premium, with IE5 ultra premium about 20 % lower in losses than IE4. Each step cuts the losses by roughly a fifth; laws in many countries now require IE3 or better, and on a motor that runs thousands of hours a year the better class pays for itself quickly.',
  keywords: ['IE1', 'IE2', 'IE3', 'IE4', 'IE5', 'efficiency class', 'premium efficiency', 'super premium', 'ultra premium', 'NEMA Premium', 'IEC 60034-30-1', 'EU 2019/1781', 'ecodesign', 'payback', 'energy saving', 'IES classes'],
  prereq: ['efficiency-losses', 'power-units'],
  related: ['motor-life-cost', 'vfd-energy-saving', 'pmsm-motor', 'reluctance-motors', 'line-start-pm', 'motors-pumps-fans', 'nameplate-reading'],
  body: `
Two motors of the same power can differ by several points of efficiency, and on a motor that runs all year those points are worth far more than the price difference. IEC 60034-30-1 (2014) sets minimum efficiencies, by power and number of poles, for line-operated three-phase motors from 0.12 to 1000 kW at 50 and 60 Hz, measured by the methods of IEC 60034-2-1:

| Class | Name | 0.75 kW | 7.5 kW | 75 kW | Losses at 7.5 kW |
|---|---|---|---|---|---|
| IE1 | standard efficiency | 72.1 % | 86.0 % | 92.7 % | 1221 W |
| IE2 | high efficiency | 79.6 % | 88.7 % | 94.0 % | 955 W |
| IE3 | premium efficiency | 82.5 % | 90.4 % | 95.0 % | 796 W |
| IE4 | super premium efficiency | 85.7 % | 92.6 % | 96.0 % | 599 W |
| IE5 | ultra premium efficiency | ≈ 88.6 % | ≈ 94.1 % | ≈ 96.8 % | ≈ 470 W |

(4-pole, 50 Hz minimum values; IE5 is shown by its definition as about 20 % lower losses than IE4.) The steps look small in per cent but large in losses: IE3 loses about 17 % less than IE2, IE4 about 25 % less than IE3. Above about 200 kW the minimum values level off (around 96 % for IE3 4-pole). IEC 60034-30-1 names IE5 for the future; IEC TS 60034-30-2 applies the IE classes, up to IE5, to motors made for variable-speed drives.

### How the classes are reached
More active material and better material: longer stacks and fuller slots (less copper loss), copper instead of aluminium rotor cages, thinner laminations of lower-loss steel, smaller and better fans, tighter manufacturing. IE4 and IE5 often mean a different machine — permanent-magnet or synchronous-reluctance motors ([[pmsm-motor]], [[reluctance-motors]]) that need a drive, or line-start PM motors ([[line-start-pm]]) that do not.

The North American names line up roughly: IE2 ≈ "NEMA Energy Efficient", IE3 ≈ "NEMA Premium", IE4 ≈ "NEMA Super Premium" (at 60 Hz). A motor and drive together are classed by IEC 61800-9-2: IE0–IE2 for the drive, IES0–IES2 for the whole system.

### The law (check the current local rules)
- **European Union**, Regulation (EU) 2019/1781: from 1 July 2021 three-phase motors of 0.75–1000 kW with 2 to 8 poles must be at least IE3, and 0.12–0.75 kW at least IE2; from 1 July 2023 motors of 75–200 kW with 2, 4 or 6 poles must be IE4. There are exceptions (some special and integrated motors) and dated details.
- **United States**: Department of Energy rules (10 CFR 431) require NEMA Premium levels for most general-purpose motors of roughly 1–500 hp.
- Many other countries have similar minimum-efficiency rules.

### Real life: what a better class changes
- **Energy:** a 7.5 kW motor running 6000 h a year at 75 % load saves about 700 kWh a year going from IE2 to IE3, and about 880 kWh from IE3 to IE4.
- **Speed:** a more efficient induction motor usually has less slip, so it turns a little faster — 1460 instead of 1440 rpm, say. A centrifugal pump or fan takes power as the *cube* of speed: $(1460/1440)^3$ = 1.042, 4 % more shaft power, which can eat most of the saving unless the flow is really needed or the speed or impeller is adjusted.
- **Starting current:** lower rotor resistance often means a higher starting current (7–9 times rated is not unusual for IE3/IE4), which can trip breakers set for the old motor.
- **Size and price:** higher classes can be longer or one frame larger, and cost more — typically paid back in months to a few years at high running hours.

In the sim, set your motor's power, hours and electricity price: the classes' curves show where your motor sits, and the bars show the yearly cost of its losses.

> [!key] IE classes measure losses: IE1 → IE5, each step roughly 15–25 % fewer. IE3 is now the legal minimum in many places; IE4/IE5 pay where motors run long hours. On pumps and fans, check the new motor's speed — the cube law can cancel the saving.
`,
  ideas: [
    'IEC 60034-30-1 defines IE1 (standard), IE2 (high), IE3 (premium) and IE4 (super premium); IE5 (ultra premium) has about 20 % lower losses than IE4.',
    'Each class step cuts losses by roughly 15–25 %, though the efficiency figures differ by only a few points.',
    'EU rules require IE3 for most 0.75–1000 kW motors since 2021 and IE4 for 75–200 kW since 2023; the US requires NEMA Premium levels.',
    'The saving is (1/η₁ − 1/η₂) × shaft power × hours: large for motors that run long, negligible for motors that rarely run.',
    'Higher-efficiency induction motors often run a little faster and draw more starting current — check pumps, fans and protection.'
  ],
  pitfalls: [
    'IE4 is always worth it — On a motor that runs a few hundred hours a year the saving is tiny; the payback may exceed the motor\'s life.',
    'A 2 % efficiency gain saves 2 % of the energy — It removes a much larger share of the losses; the energy saved is P·t·(1/η₁ − 1/η₂), about 2 % of the input for a 2-point gain near 90 %.',
    'Swapping in a more efficient motor always saves energy — On a centrifugal pump or fan its slightly higher speed raises the load power with the cube of speed.'
  ],
  formulas: [
    {
      name: 'Yearly energy saved by a better motor',
      expr: 'dE = P*t*(1/eta1 - 1/eta2)', tex: '\\Delta E = P\\,t\\left(\\frac{1}{\\eta_1} - \\frac{1}{\\eta_2}\\right)',
      vars: {
        dE: { name: 'energy saved', q: 'energy', unit: 'kWh', tex: '\\Delta E' },
        P: { name: 'average shaft power', q: 'power', unit: 'kW', value: 5.6 },
        t: { name: 'running hours a year', q: 'time', unit: 'h', value: 6000 },
        eta1: { name: 'efficiency of the old motor', q: 'ratio', unit: '%', value: 88.7, min: 1, max: 100, tex: '\\eta_1' },
        eta2: { name: 'efficiency of the new motor', q: 'ratio', unit: '%', value: 90.4, min: 1, max: 100, tex: '\\eta_2' }
      },
      note: 'Use the efficiencies at the real load (catalogues give 100, 75 and 50 % values).',
      stories: { dE: 'A motor giving {P} for {t} a year is replaced: efficiency {eta1} → {eta2}. How much energy is saved?' }
    },
    {
      name: 'Payback time',
      expr: 'tpb = dC/(dE*c)', tex: 't_{\\mathrm{pb}} = \\frac{\\Delta C}{\\Delta E\\,c}',
      vars: {
        tpb: { name: 'simple payback time', q: false, unit: 'yr', tex: 't_{\\mathrm{pb}}' },
        dC: { name: 'extra purchase price (any currency)', q: false, value: 150, tex: '\\Delta C' },
        dE: { name: 'energy saved per year', q: false, unit: 'kWh/yr', value: 712, tex: '\\Delta E' },
        c: { name: 'electricity price per kWh (same currency)', q: false, value: 0.15 }
      },
      stories: { tpb: 'A better motor costs {dC} more and saves {dE} at {c} per kWh. How long until it pays back?' }
    },
    {
      name: 'Power of a centrifugal pump or fan at a new speed',
      expr: 'P2 = P1*(n2/n1)^3', tex: 'P_2 = P_1\\left(\\frac{n_2}{n_1}\\right)^3',
      vars: {
        P2: { name: 'shaft power at the new speed', q: 'power', unit: 'kW', tex: 'P_2' },
        P1: { name: 'shaft power at the old speed', q: 'power', unit: 'kW', value: 7, tex: 'P_1' },
        n1: { name: 'old speed', q: 'angvel', unit: 'rpm', value: 1440, tex: 'n_1' },
        n2: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 1460, tex: 'n_2' }
      },
      note: 'The affinity law for the same pump or fan in the same system.',
      stories: { P2: 'A pump taking {P1} at {n1} gets a new motor that turns at {n2}. What power does it take now?' }
    }
  ],
  examples: [
    {
      title: 'IE2 to IE3 on a 7.5 kW motor',
      q: 'A 7.5 kW motor runs 6000 h a year at 75 % load (5.6 kW). Going from IE2 (88.7 %) to IE3 (90.4 %), how much energy is saved, and how fast does an extra purchase price of 150 pay back at 0.15 per kWh (any currency)?',
      steps: [
        '$\\Delta E = 5.6 \\times 6000 \\times (1/0.887 - 1/0.904) = 33{,}600 \\times 0.0212 = 712$ kWh a year.',
        'Worth $712 \\times 0.15 = 107$ a year; payback $150/107 = 1.4$ years.'
      ],
      a: 'About 710 kWh a year; payback about 1.4 years.'
    },
    {
      title: 'IE3 to IE4',
      q: 'The same motor goes from IE3 (90.4 %) to IE4 (92.6 %). How much is saved?',
      steps: ['$\\Delta E = 33{,}600 \\times (1/0.904 - 1/0.926) = 33{,}600 \\times 0.0263 = 883$ kWh a year.', 'The losses fall from about 800 W to 600 W at full load — a quarter less heat, a cooler motor and longer insulation and bearing life.'],
      a: 'About 880 kWh a year.'
    },
    {
      title: 'The pump speed trap',
      q: 'An old motor drives a centrifugal pump at 1440 rpm, taking 7.0 kW. The new IE3 motor, with less slip, runs at 1460 rpm. What happens to the pump\'s power?',
      steps: [
        '$P_2 = 7.0 \\times (1460/1440)^3 = 7.0 \\times 1.042 = 7.29$ kW — 0.29 kW more at the shaft.',
        'Going from IE1 (86.0 %) to IE3 (90.4 %) saved about $7.0/0.860 - 7.0/0.904 = 0.40$ kW of input; the extra 0.29 kW of shaft power costs about 0.33 kW of input. The net saving is small unless the extra flow is useful or the speed or impeller is adjusted.'
      ],
      a: 'The pump takes about 4 % more power, eating most of the saving.'
    }
  ],
  quiz: [
    { q: 'Which name belongs to IE3?', choices: ['Premium efficiency', 'Standard efficiency', 'High efficiency', 'Super premium efficiency'], a: 0, why: 'IE1 standard, IE2 high, IE3 premium, IE4 super premium, IE5 ultra premium.' },
    { q: 'Where does upgrading from IE3 to IE4 pay back fastest?', choices: ['A pump motor running 8000 h a year', 'A gate motor running 50 h a year', 'A standby fire pump', 'A motor that is always at no load'], a: 0, why: 'The saving is proportional to running hours (and load); rarely used motors never pay back the extra price.' },
    { q: 'Replacing an old induction motor with a higher-efficiency one can raise its starting current.', a: true, why: 'Lower rotor resistance improves efficiency but raises the locked-rotor current; protection set for the old motor may trip.' },
    { q: 'IE4 has roughly how much lower losses than IE3 at 7.5 kW (90.4 % against 92.6 %)?', choices: ['About 25 %', 'About 2 %', 'About 50 %', 'About 5 %'], a: 0, why: 'Losses 7500(1/0.904 − 1) ≈ 796 W against 7500(1/0.926 − 1) ≈ 599 W: 25 % less.' },
    { q: 'By the cube law, how much more power does a pump take when its speed rises from 1440 to 1460 rpm? (in per cent)', answer: 4.2, unit: '%', why: '(1460/1440)³ = 1.042: about 4.2 % more.' }
  ],
  problems: [
    { q: 'An 11 kW motor runs at full load 5000 h a year. How much energy does going from 89.8 % (IE2) to 91.4 % (IE3) save?', answer: 1072, unit: 'kWh', tol: 0.02, steps: ['$\\Delta E = 11 \\times 5000 \\times (1/0.898 - 1/0.914)$.', '$= 55{,}000 \\times 0.01949 = 1072$ kWh.'] },
    { q: 'A fan takes 10 kW at 1450 rpm. Its new motor runs at 1475 rpm. What power does the fan take now?', answer: 10.53, unit: 'kW', tol: 0.01, steps: ['$P_2 = 10 \\times (1475/1450)^3 = 10 \\times 1.0526 = 10.53$ kW.'] }
  ],
  choose: {
    good: [
      'IE3 as the minimum for general use — and usually the legal minimum anyway.',
      'IE4 or IE5 (PM, synchronous-reluctance or line-start PM) for pumps, fans and compressors that run thousands of hours a year.',
      'A VFD with a high-efficiency motor where the flow or speed varies: the drive saves more than any class step.'
    ],
    avoid: [
      'Paying for IE4/IE5 on motors that run a few hundred hours a year.',
      'Swapping motors on centrifugal pumps and fans without checking the new speed.',
      'Assuming an old motor meets today\'s rules when it is re-sold or re-used in a new machine.'
    ],
    check: [
      'The efficiency at your real load and the hours it runs.',
      'Starting current against breakers and motor-protective devices; the frame length and fit.',
      'The regulation in the country where the machine is put into service, and its exemptions.'
    ]
  },
  applications: [
    'Energy audits replace old IE1 motors running long hours first: they give the fastest payback.',
    'Machine builders exporting to several countries fit IE3 motors (or better) to meet the strictest market.',
    'Pump and fan retrofits combine an IE4/IE5 motor with a VFD, sizing the speed to the real duty.'
  ],
  sources: [
    'IEC 60034-30-1:2014, *Rotating electrical machines — Efficiency classes of line operated AC motors (IE code)*.',
    'IEC TS 60034-30-2, *Efficiency classes of variable speed AC motors (IE code)*.',
    'IEC 60034-2-1, *Standard methods for determining losses and efficiency from tests*.',
    'Commission Regulation (EU) 2019/1781, ecodesign requirements for electric motors and variable speed drives.',
    'US Code of Federal Regulations, 10 CFR Part 431: energy conservation standards for electric motors.',
    'IEC 61800-9-2: energy-efficiency indicators (IE and IES classes) for power drive systems and motor starters.'
  ],
  sim: 'mb-ie-classes'
},

{
  id: 'motor-standards', parent: 'motor-ratings', title: 'Standards, frame sizes and mounting', level: 2,
  short: 'Two families of standards shape motors: IEC (kW, 50 Hz, metric frames named by shaft height in millimetres) and NEMA (hp, 60 Hz, inch frames such as 215T). The frame fixes the shaft height, shaft, feet and flange dimensions, so motors from different makers fit the same machine; the IM code says how the motor is mounted.',
  keywords: ['IEC 60034', 'IEC 60072', 'NEMA MG 1', 'frame size', 'shaft height', 'T-frame', 'U-frame', '132M', '215T', 'IM B3', 'B5', 'B14', 'B35', 'V1', 'flange FF', 'flange FT', 'C-face', 'D-flange', 'terminal markings', 'U1 V1 W1', 'direction of rotation', 'tolerances', 'design letter'],
  prereq: ['nameplate-reading', 'power-units'],
  related: ['efficiency-classes', 'ip-cooling', 'dual-voltage-motors', 'couplings-alignment', 'gearboxes', 'reversing-three-phase', 'motor-selection-method'],
  body: `
A machine designer can order a 7.5 kW 4-pole foot-mounted motor from any of dozens of makers and bolt it onto the same base with the same coupling. That works because the **frame** — shaft height, shaft diameter and length, foot-hole pattern, flange — is standardised: in the IEC world by IEC 60072-1 and in North America by NEMA MG 1. Ratings and tests follow IEC 60034 or NEMA MG 1.

### IEC frames
The frame number **is the shaft height in millimetres** (centre of the shaft above the bottom of the feet); letters S, M, L give the length. The power that fits a given frame is not fixed by the standard, but European makers use common assignments:

| IEC frame | Shaft D × E (mm) | Typical 4-pole kW | B5 flange | Feet A × B (mm) | Nearest NEMA shaft height |
|---|---|---|---|---|---|
| 71 | 14 × 30 | 0.25–0.37 | FF130 | 112 × 90 | — |
| 80 | 19 × 40 | 0.55–0.75 | FF165 | 125 × 100 | — |
| 90S / 90L | 24 × 50 | 1.1 / 1.5 | FF165 | 140 × 100 / 125 | 143T/145T (3.5 in) |
| 100L | 28 × 60 | 2.2–3 | FF215 | 160 × 140 | — |
| 112M | 28 × 60 | 4 | FF215 | 190 × 140 | 182T/184T (4.5 in) |
| 132S / 132M | 38 × 80 | 5.5 / 7.5 | FF265 | 216 × 140 / 178 | 213T/215T (5.25 in) |
| 160M / 160L | 42 × 110 | 11 / 15 | FF300 | 254 × 210 / 254 | 254T/256T (6.25 in) |
| 180M / 180L | 48 × 110 | 18.5 / 22 | FF300 | 279 × 241 / 279 | 284T/286T (7 in) |
| 200L | 55 × 110 | 30 | FF350 | 318 × 305 | 324T/326T (8 in) |
| 225S / 225M | 60 × 140 | 37 / 45 | FF400 | 356 × 286 / 311 | 364T/365T (9 in) |
| 250M | 65 × 140 | 55 | FF500 | 406 × 349 | 404T/405T (10 in) |
| 280S / 280M | 75 × 140 | 75 / 90 | FF500 | 457 × 368 / 419 | 444T/445T (11 in) |

The flange code gives the bolt-circle diameter: FF265 has its through-holes on a 265 mm circle.

### NEMA frames
For T-frames from 143T up, the **first two digits divided by four give the shaft height in inches** (215T: 21/4 = 5.25 in), and the third digit codes the foot spacing. T-frames (introduced in 1964) replaced the larger U-frames of the 1950s, so an old U-frame motor is often replaced by a T-frame one size different. Suffixes add features: C (C-face, tapped holes — like IEC B14), D (D-flange, through holes — like B5), TS (short shaft for direct coupling). Fractional-horsepower motors use frames such as 42, 48 and 56. NEMA also sets design letters (A, B, C, D for starting torque and current), code letters and the service factor ([[nameplate-reading]]).

### Mounting: the IM code
| IM (IEC 60034-7) | Also written | Mounting |
|---|---|---|
| B3 | IM 1001 | feet, shaft horizontal |
| B5 | IM 3001 | large flange with through-holes (FF) |
| B14 | IM 3601 | face flange with tapped holes (FT) |
| B35 | IM 2001 | feet and B5 flange |
| V1 | IM 3011 | flange, shaft vertical pointing down |
| V3, V5, V6 | | shaft up with flange; feet with shaft down or up |

Vertical mountings need the right bearings (axial loads), drain holes at the new lowest point and, shaft up outdoors, a canopy.

### Terminals, rotation and tolerances
IEC 60034-8 marks the winding ends U1–U2, V1–V2, W1–W2; with L1, L2, L3 on U1, V1, W1 the shaft turns clockwise seen from the drive end. NEMA uses T1–T9 or T1–T12 leads. IEC 60034-1 allows tolerances on the plate values: for example ±20 % on slip (for motors of 1 kW and more), so a "1455 rpm" motor may really run at 1446–1464 rpm; and a shortfall in efficiency of up to 15 % of the losses for motors up to 150 kW.

> [!warn] Look-alike frames are not interchangeable: an IEC 132M and a NEMA 215T share a foot pattern and nearly a shaft height (132 against 133.4 mm) but their shafts are 38 mm and 1⅜ in (34.9 mm), their keys metric and inch, and their voltages and frequencies usually differ. Adapting one to the other needs new coupling hubs, shims and a check of the electrical data — and qualified wiring.

> [!key] IEC frames are named by shaft height in mm, NEMA T-frames by digits whose first two over four give inches. The frame fixes the mechanical fit; the IM code the mounting; the plate the electrical data. Check all three when you choose or replace a motor.
`,
  ideas: [
    'IEC frame numbers are the shaft height in millimetres; S, M and L give the length.',
    'NEMA T-frame numbers: the first two digits divided by four give the shaft height in inches.',
    'Standard frames fix shaft height, shaft diameter and length, foot holes and flanges, so motors from different makers are interchangeable.',
    'IM codes describe mounting: B3 feet, B5 flange with through-holes, B14 face flange with tapped holes, B35 both, V1 vertical shaft down.',
    'IEC and NEMA motors of similar size are not directly interchangeable: shafts, keys, voltages and frequencies differ.'
  ],
  pitfalls: [
    'The IEC frame number is the power class — It is the shaft height in millimetres; several powers and pole numbers share a frame.',
    'A B5 and a B14 flange are the same thing — B5 is a large flange with through-holes (FF); B14 a smaller face with tapped holes (FT).',
    'A NEMA and an IEC motor of the same height are interchangeable — Shafts, keys, feet in many sizes, voltages and frequencies differ.'
  ],
  formulas: [
    {
      name: 'NEMA T-frame shaft height',
      expr: 'D = N/4', tex: 'D = \\frac{N}{4}',
      vars: {
        D: { name: 'shaft height', q: false, unit: 'in' },
        N: { name: 'first two digits of the frame number', q: false, value: 21, int: true, min: 14, max: 58 }
      },
      note: 'For integral-horsepower T-frames (143T and up). Multiply by 25.4 for millimetres.',
      stories: { D: 'What is the shaft height of a NEMA frame whose first two digits are {N}?' }
    },
    {
      name: 'Slowest speed allowed by the slip tolerance',
      expr: 'nmin = ns - 1.2*(ns - n)', tex: 'n_{\\min} = n_s - 1.2\\,(n_s - n)',
      vars: {
        nmin: { name: 'lowest full-load speed within tolerance', q: false, unit: 'rpm', tex: 'n_{\\min}' },
        ns: { name: 'synchronous speed', q: false, unit: 'rpm', value: 1500, tex: 'n_s' },
        n: { name: 'rated speed on the plate', q: false, unit: 'rpm', value: 1455 }
      },
      note: 'IEC 60034-1 allows ±20 % on slip for motors of 1 kW and above (±30 % below 1 kW).',
      stories: { nmin: 'A motor plate says {n} (synchronous {ns}). How slow may it really run at full load?' }
    },
    {
      name: 'Lowest efficiency within the IEC tolerance',
      expr: 'etamin = eta - 0.15*(1 - eta)', tex: '\\eta_{\\min} = \\eta - 0.15\\,(1 - \\eta)',
      vars: {
        etamin: { name: 'lowest tested efficiency within tolerance', q: 'ratio', unit: '%', tex: '\\eta_{\\min}' },
        eta: { name: 'efficiency on the plate', q: 'ratio', unit: '%', value: 90.4, min: 1, max: 99.9, tex: '\\eta' }
      },
      note: 'For motors up to 150 kW; above that the tolerance is 10 % of the losses.',
      stories: { etamin: 'A plate claims {eta}. What is the lowest tested efficiency that still meets the IEC tolerance?' }
    }
  ],
  examples: [
    {
      title: 'Reading a frame',
      q: 'A motor is an IEC 160L, B35, 4-pole. What do you know about it without a catalogue?',
      steps: [
        'Shaft height 160 mm, long version; typically 15 kW at 4 poles.',
        'Shaft 42 × 110 mm; feet 254 × 254 mm; B35 means feet plus a B5 flange, FF300.',
        'The NEMA frames of about the same height are 254T/256T (6.25 in = 158.75 mm).'
      ],
      a: 'H = 160 mm, 42 × 110 mm shaft, feet 254 × 254 mm, FF300 flange, about 15 kW at 4 poles.'
    },
    {
      title: 'Replacing an American motor in Europe',
      q: 'A machine has a 10 hp, 460 V, 60 Hz, 215T motor. Can a 7.5 kW 400 V 50 Hz IEC 132M motor replace it?',
      steps: [
        'Mechanically: the feet match (both 216 × 178 mm, 8½ × 7 in), the shaft height differs by 1.4 mm (shim), the shaft does not (38 mm against 34.9 mm): a new coupling hub with a metric bore and key.',
        'Electrically: on a 50 Hz supply the machine\'s speed falls by about 17 % unless it is regeared or run from a VFD; the power at 50 Hz (7.5 kW against 7.46 kW) matches.',
        'The IEC motor must be wired for 400 V (delta for a 400 Δ/690 Y winding).'
      ],
      a: 'Yes, with shims, a new coupling hub and a check of the speed — not as a drop-in.'
    },
    {
      title: 'How far may the speed be from the plate?',
      q: 'A plate says 1455 rpm at 50 Hz (4 poles). What full-load speeds are within the IEC slip tolerance?',
      steps: ['Slip $1500 - 1455 = 45$ rpm; ±20 % gives 36–54 rpm.', 'Speed between $1500 - 54 = 1446$ and $1500 - 36 = 1464$ rpm.'],
      a: '1446 to 1464 rpm.'
    }
  ],
  quiz: [
    { q: 'What does the "132" in an IEC 132M frame mean?', choices: ['Shaft height of 132 mm', '132 kW', 'Frame length of 132 mm', 'Flange diameter of 132 mm'], a: 0, why: 'IEC frame numbers are the distance from the foot base to the shaft centre in millimetres; M is the medium length.' },
    { q: 'What distinguishes a B14 from a B5 mounting?', choices: ['B14 is a smaller face flange with tapped holes; B5 a larger flange with through-holes', 'B14 has feet; B5 does not', 'B14 is vertical', 'They are the same'], a: 0, why: 'IEC FT (face) flanges are tapped (B14), FF flanges have clearance holes (B5); NEMA calls them C-face and D-flange.' },
    { q: 'What is the shaft height of a NEMA 256T motor?', answer: 6.25, unit: 'in', why: 'The first two digits over four: 25/4 = 6.25 in (158.75 mm).' },
    { q: 'An IEC 132M motor is a drop-in replacement for a NEMA 215T motor.', a: false, why: 'The feet match but the shaft height differs slightly and the shaft diameter and key do not; voltage and frequency usually differ too.' },
    { q: 'An IEC motor has L1, L2, L3 connected to U1, V1, W1. Which way does it turn, seen from the drive end?', choices: ['Clockwise', 'Anticlockwise', 'It depends on the frame', 'It will not start'], a: 0, why: 'IEC 60034-8: alphabetical terminal order with the phase sequence L1–L2–L3 gives clockwise rotation viewed at the drive-end shaft. Swap any two lines to reverse.' }
  ],
  problems: [
    { q: 'What is the shaft height of a NEMA 364T motor in millimetres?', answer: 228.6, unit: 'mm', tol: 0.01, steps: ['$36/4 = 9$ in.', '$9 \\times 25.4 = 228.6$ mm (close to IEC 225).'] },
    { q: 'A 60 Hz 4-pole motor\'s plate says 1765 rpm. With ±20 % tolerance on slip, what is the lowest full-load speed allowed?', answer: 1758, unit: 'rpm', tol: 0.001, steps: ['Slip $1800 - 1765 = 35$ rpm; +20 % is 42 rpm.', '$1800 - 42 = 1758$ rpm.'] }
  ],
  choose: {
    good: [
      'IEC motors for machines sold into 50 Hz markets and most of the world; NEMA motors for North America, where codes and service expect them.',
      'B5 or B14 flange motors for gearboxes, pumps and fans that carry the motor; B35 for heavy motors that need both feet and flange.',
      'Standard frames and mountings, so replacements are easy to find.'
    ],
    avoid: [
      'Mixing IEC and NEMA parts (couplings, flanges, gearbox adaptors) without checking every dimension.',
      'Vertical mounting of a motor built for horizontal use without checking bearings, drains and the maker\'s approval.'
    ],
    check: [
      'Frame, shaft diameter and length, key, flange code (FF/FT) or feet pattern, and the terminal-box position.',
      'Voltage, frequency and connection against the local supply; the certification the market requires.',
      'The IM code and drain holes for the real mounting position.'
    ]
  },
  applications: [
    'Gearmotor catalogues list IEC input flanges (for example 132 B5) so any standard motor fits.',
    'Pump makers use NEMA JM/JP or IEC close-coupled frames with special shafts carrying the impeller.',
    'Compare IEC and NEMA frames side by side in the simulation, and try sizes in [the selection guide](#/tools/sizing/choose).'
  ],
  history: 'NEMA was formed in 1926 and standardised North American frame sizes; the U-frames of 1952 gave way to smaller T-frames in 1964 as better insulation allowed more power in the same size. The IEC, founded in 1906, published the metric frame series that European makers standardised on in the second half of the century.',
  sources: [
    'IEC 60072-1, *Dimensions and output series for rotating electrical machines — Frame numbers 56 to 400 and flange numbers 55 to 1080*.',
    'IEC 60034-7, *Rotating electrical machines — Classification of types of construction, mounting arrangements and terminal box position (IM code)*.',
    'IEC 60034-8, *Rotating electrical machines — Terminal markings and direction of rotation*.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: tolerances.',
    'NEMA MG 1, *Motors and Generators*: frame dimensions, T-frames, C-face and D-flange, design and code letters.'
  ],
  sim: 'mb-frames'
}

);
