/* HYPER-PHYSICS · content/dynamics.js — forces and Newton's laws: force, the three laws,
 * weight, free-body diagrams, the normal force, friction, tension and pulleys, the inclined
 * plane, centripetal force and air resistance. */
Hyper.add(

{
  id: 'force', parent: 'dynamics', title: 'Force', level: 1,
  short: 'A push or a pull of one object on another. Forces have size and direction, are measured in newtons, and add as vectors.',
  keywords: ['force', 'newton', 'N', 'push', 'pull', 'net force', 'resultant', 'vector', 'contact force', 'non-contact force', 'interaction'],
  prereq: ['acceleration', 'math:vector-addition'],
  related: ['newtons-first-law', 'newtons-second-law', 'free-body-diagrams', 'fundamental-forces', 'hookes-law'],
  body: `
A **force** is a push or a pull that one object exerts on another. A hand pushing a trolley, the Earth pulling an apple, a magnet tugging a paper clip, the wind pressing on a sail: each is an interaction between two objects, and each can change how something moves or bend it out of shape.

### Size and direction
A force has a size and a direction, so it is a [[math:vectors|vector]]. Its SI unit is the **newton** (N): the force that gives a 1 kg mass an acceleration of 1 m/s², so $1\\ \\mathrm{N} = 1\\ \\mathrm{kg\\,m/s^2}$. Some feel for the scale:

| Force | Roughly |
|---|---|
| Weight of a small apple | 1 N |
| Grip of a strong hand | 500 N |
| Weight of an adult | 700 N |
| Push of the road on a car's tyres, accelerating hard | 5 kN |
| Thrust of a large airliner's engines at take-off | 1 MN |

### Kinds of force
**Contact forces** act where surfaces touch: the [[normal-force|normal force]] of a floor, [[friction]], the [[tension-pulleys|tension]] in a rope, air resistance ([[drag-force|drag]]), the push of a spring. **Non-contact forces** act across empty space: gravity, and the electric and magnetic forces. Look closely and every contact force turns out to be electric — the atoms of one surface repelling those of the other — so in the end there are only [[fundamental-forces|four fundamental forces]].

### Adding forces
When several forces act on one object, what decides its motion is their vector sum, the **net** or **resultant** force $\\vec F_{\\text{net}} = \\sum \\vec F$. Along one line, forces add with signs: 50 N to the right and 30 N to the left make 20 N to the right. At an angle, add them by [[math:vector-components|components]] or with the [[math:law-of-cosines|law of cosines]]:

$$F_{\\text{net}} = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos\\theta}$$

where $\\theta$ is the angle between the two forces. Forces of 3 N and 4 N can combine to anything from 1 N (opposite) to 7 N (together) — and exactly 5 N at right angles.

### What forces do
Balanced forces (net force zero) leave the motion unchanged: an object at rest stays at rest, a moving one keeps its velocity — [[newtons-first-law|Newton's first law]]. An unbalanced force produces an acceleration $\\vec a = \\vec F_{\\text{net}}/m$ — [[newtons-second-law|the second law]]. And forces always come in pairs, one on each of two interacting objects — [[newtons-third-law|the third law]].

> [!key] A force is not something an object *has*; it is something one object does *to another*. Every force should be nameable as "the push (or pull) of A on B".

### Measuring a force
A spring stretches in proportion to the force on it ([[hookes-law|Hooke's law]]), so a calibrated spring — a newton meter, a luggage scale — measures force directly. Electronic scales use a load cell, a metal block whose tiny strain is read by a strain gauge.
`,
  ideas: [
    'A force is a push or pull by one object on another; it has a size and a direction.',
    'The newton: 1 N gives 1 kg an acceleration of 1 m/s².',
    'Only the net force — the vector sum of all the forces on an object — decides how its motion changes.',
    'Contact forces (normal force, friction, tension, drag) are electric at the atomic scale; gravity acts at a distance.'
  ],
  pitfalls: [
    'A moving object needs a force to keep it moving — Motion needs no force; changes of motion do. A puck on smooth ice glides on with no forward force at all.',
    'Forces add like ordinary numbers — Only along one line. 3 N and 4 N at right angles make 5 N, not 7 N.',
    'A thrown ball carries "the force of the throw" with it — The push ended when the hand let go. In flight only gravity and the air act on the ball.'
  ],
  formulas: [
    {
      name: 'Resultant of two forces at an angle',
      expr: 'F = sqrt(F1^2 + F2^2 + 2*F1*F2*cos(theta))', tex: 'F = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos\\theta}',
      vars: {
        F: { name: 'size of the resultant force', q: 'force', unit: 'N' },
        F1: { name: 'first force', q: 'force', unit: 'N', value: 3000 },
        F2: { name: 'second force', q: 'force', unit: 'N', value: 3000 },
        theta: { name: 'angle between the two forces', q: 'angle', unit: '°', value: 40, min: 0, max: 180 }
      },
      note: '$\\theta = 0$ when the forces point the same way, $90°$ at right angles, $180°$ when they are opposite.',
      stories: {
        F: 'Two tugs pull a ship with {F1} and {F2}, their ropes {theta} apart. What is their combined pull?',
        theta: 'Two ropes pulling with {F1} and {F2} give a combined pull of {F}. What is the angle between them?'
      }
    },
    {
      name: 'Component of a force along a direction',
      expr: 'Fx = F*cos(theta)', tex: 'F_x = F\\cos\\theta',
      vars: {
        Fx: { name: 'component along the chosen direction', q: 'force', unit: 'N', tex: 'F_x', signed: true },
        F: { name: 'size of the force', q: 'force', unit: 'N', value: 60 },
        theta: { name: 'angle between the force and that direction', q: 'angle', unit: '°', value: 50, min: 0, max: 180 }
      },
      stories: {
        Fx: 'You pull a suitcase with {F} along a handle at {theta} to the ground. How much of the pull is horizontal?',
        F: 'A sledge rope at {theta} to the snow must give a horizontal pull of {Fx}. How hard must you pull along the rope?'
      }
    }
  ],
  examples: [
    {
      title: 'Two tugs and a ship',
      q: 'Two tugs each pull a ship with 3000 N. Their ropes are 40° apart. What is the combined force?',
      steps: [
        'By symmetry the resultant points along the line halfway between the ropes; the sideways parts, $\\pm 3000\\sin 20°$, cancel.',
        'Along that line each rope contributes $3000\\cos 20° = 2819\\ \\mathrm{N}$, so the total is $5638\\ \\mathrm{N}$.',
        'The formula agrees: $F = \\sqrt{3000^2 + 3000^2 + 2(3000)(3000)\\cos 40°} = 5.64\\ \\mathrm{kN}$.',
        'The angle costs 6% compared with parallel ropes (6000 N). At 120° apart the two tugs would give only 3000 N — no more than one tug pulling straight.'
      ],
      a: 'About 5.6 kN, straight ahead along the bisector.'
    },
    {
      title: 'Pulling a suitcase',
      q: 'You pull a wheeled suitcase with 60 N along its handle, which makes 50° with the ground. Find the horizontal and vertical parts of the pull.',
      steps: [
        'Horizontal component: $60\\cos 50° = 38.6\\ \\mathrm{N}$ — this is what moves the case forwards.',
        'Vertical component: $60\\sin 50° = 46.0\\ \\mathrm{N}$ upwards — this lifts part of the case\'s weight off its wheels.',
        'Check: $\\sqrt{38.6^2 + 46.0^2} = 60\\ \\mathrm{N}$.'
      ],
      a: '38.6 N forwards and 46.0 N upwards.'
    }
  ],
  quiz: [
    { q: 'Forces of 6 N and 8 N act on the same object. Which of these can NOT be the size of their resultant?', choices: ['2 N', '10 N', '14 N', '16 N'], a: 3,
      why: 'The resultant lies between the difference (2 N, forces opposite) and the sum (14 N, forces together). 10 N is the right-angle case. 16 N is impossible.' },
    { q: 'A hockey puck slides across smooth ice at constant velocity. What horizontal forces act on it?', choices: ['A forward force that keeps it moving', 'None, or almost none', 'A forward force balanced by friction', 'The force of the stick, stored in the puck'], a: 1,
      why: 'Constant velocity needs no net force, and on nearly frictionless ice there is essentially no horizontal force at all. The stick\'s push ended when contact ended.' },
    { q: 'One newton is the same as…', choices: ['1 kg·m/s', '1 kg·m/s²', '1 kg·m²/s²', '1 kg/s²'], a: 1,
      why: 'From F = ma: kilograms times metres per second squared. (kg·m²/s² is a joule; kg·m/s is a unit of momentum.)' },
    { q: 'The push of a table on a book and the friction on a sliding book are, at the atomic scale, electric forces.', a: true,
      why: 'Contact forces come from the electric repulsion and attraction between the atoms and electrons of the two surfaces.' }
  ],
  applications: [
    'Structural engineering: every beam, cable and bolt is sized from the forces it must carry.',
    'Load cells and strain gauges measure forces in bathroom scales, crane hooks and crash-test dummies.',
    'Sport science: force plates under a sprinter\'s blocks or a jumper\'s take-off show how speed is generated.'
  ],
  history: 'Newton set out the modern idea of force in his Principia (1687): a force is whatever changes an object\'s state of rest or uniform motion. The SI unit of force was given his name in 1948.'
},

{
  id: 'newtons-first-law', parent: 'dynamics', title: 'Newton\'s first law', level: 1,
  short: 'With no net force, an object at rest stays at rest and a moving object keeps moving in a straight line at constant speed.',
  keywords: ['first law', 'law of inertia', 'inertia', 'balanced forces', 'constant velocity', 'inertial frame', 'Galileo'],
  prereq: ['force', 'speed-velocity'],
  related: ['newtons-second-law', 'relative-velocity', 'momentum', 'relativity-postulates'],
  body: `
Slide a book across a table and it stops within a metre. Slide a puck across ice and it glides much farther. Imagine a surface with no friction at all, and nothing would stop it. That thought, pursued by Galileo, overturned two thousand years of belief that moving things naturally come to rest.

> [!key] **Newton's first law.** An object stays at rest, or keeps moving at constant velocity in a straight line, unless a net external force acts on it.

The tendency to keep doing what it is doing is an object's **inertia**, and mass is its measure: a loaded shopping trolley is harder to start *and* harder to stop than an empty one.

### What the law says — and what it does not
- **Motion needs no force; a change of motion does.** A space probe coasting between planets with its engines off keeps going for years.
- "Constant velocity" means constant speed **and** constant direction. Going round a bend at steady speed requires a force (see [[centripetal-force]]).
- Several forces can act and still cancel. A car cruising at a steady speed on a straight motorway has its engine's drive force exactly balanced by air resistance and rolling resistance: net force zero, velocity constant.
- In everyday life things do slow down — because friction and drag are real forces, not because motion wears out.

### Inertia in daily life
When a bus brakes suddenly, standing passengers lurch forwards. Nothing pushes them forwards: the bus slows down beneath them while their bodies carry on. Seat belts and headrests exist because of the first law. A tablecloth whipped away fast enough leaves the dishes behind, and a coin resting on a card over a glass drops into the glass when the card is flicked away.

### Inertial frames
The law also tells us *where* Newton's laws can be used. In a frame of reference moving at constant velocity — a smoothly cruising train, or (very nearly) the ground — a ball resting on a table stays put. In an accelerating frame, such as a braking bus, the ball rolls away with no force pushing it. Frames in which the first law holds are called **inertial frames**, and they are all equally good for doing physics (see [[relative-velocity]]). The Earth's rotation makes the ground very slightly non-inertial — the reason hurricanes swirl and a Foucault pendulum slowly turns its plane of swing.
`,
  ideas: [
    'Without a net force, an object at rest stays at rest and a moving object keeps a constant velocity.',
    'Inertia is the tendency to resist changes of motion; mass measures it.',
    'Forces change motion; they are not needed to keep motion going.',
    'Balanced forces (zero net force) have the same effect as no force at all.',
    'The first law picks out the inertial frames, in which Newton\'s laws hold.'
  ],
  pitfalls: [
    'Moving things naturally slow down and stop — They stop because friction or drag acts on them. Without those forces they would keep going for ever.',
    'If something moves, the forces on it cannot be balanced — Constant velocity is exactly the case of balanced forces: a cruising car, a skydiver at terminal velocity.',
    'Passengers are thrown forwards by a force when the bus brakes — No forward force acts on them. They keep moving while the bus decelerates underneath them.'
  ],
  examples: [
    {
      title: 'The suitcase in the braking bus',
      q: 'A bus travelling at 12 m/s brakes steadily to a stop in 3.0 s. A wheeled suitcase stands in the aisle, free to roll. Describe its motion as seen from the road and as seen from inside the bus.',
      steps: [
        'Seen from the road: no horizontal force acts on the freely rolling case, so by the first law it keeps moving at 12 m/s.',
        'The bus decelerates at $12/3.0 = 4.0\\ \\mathrm{m/s^2}$. After 1 s the bus does 8 m/s, while the case still does 12 m/s.',
        'Seen from inside the bus, the case seems to accelerate forwards at $4.0\\ \\mathrm{m/s^2}$ with nothing pushing it. The braking bus is not an inertial frame, so the first law does not hold there.',
        'In the first second the case rolls $\\tfrac12 (4.0)(1.0)^2 = 2.0\\ \\mathrm{m}$ forwards along the aisle — which is why luggage is stowed and passengers hold on.'
      ],
      a: 'It carries on at 12 m/s; relative to the braking bus it rolls 2 m forwards in the first second.'
    },
    {
      title: 'Cruising at constant speed',
      q: 'A car cruises at a steady 100 km/h along a straight, level road. The road pushes its driven wheels forwards with 600 N. How large are the resistive forces?',
      steps: [
        'Steady speed in a straight line means constant velocity, so by the first law the net force is zero.',
        'The resistive forces — air drag and rolling resistance — must therefore add up to exactly 600 N, backwards.',
        'If the driver presses harder so that the drive force rises to 900 N, there is a net 300 N forwards and the car speeds up, until the growing drag balances the drive again at a higher speed.'
      ],
      a: '600 N in total, opposing the motion.'
    }
  ],
  quiz: [
    { q: 'A space probe far from any star or planet shuts down its engines while moving at 10 km/s. Afterwards it…', choices: ['slows down gradually and stops', 'keeps moving at 10 km/s in a straight line', 'stops at once', 'drifts back the way it came'], a: 1,
      why: 'With no net force its velocity cannot change.' },
    { q: 'A lift moves upwards at a constant 2 m/s. Compared with the lift\'s weight, the tension in its cable is…', choices: ['larger', 'equal', 'smaller', 'zero'], a: 1,
      why: 'Constant velocity means zero net force, so the tension balances the weight exactly (ignoring friction), even though the lift is moving.' },
    { q: 'Which of these needs a net force?', choices: ['A car cruising at 90 km/h on a straight road', 'A book resting on a shelf', 'A cyclist rounding a bend at a steady 20 km/h', 'A skydiver falling at a steady 55 m/s'], a: 2,
      why: 'Turning changes the direction of the velocity, which needs a net sideways force. The other three have constant velocity.' },
    { q: 'An object moving at constant velocity can have several forces acting on it.', a: true,
      why: 'Constant velocity only requires the forces to cancel. A cruising airliner has thrust, drag, lift and weight acting — all balanced.' }
  ],
  applications: [
    'Seat belts, airbags and headrests protect bodies that keep moving — or stay still — when a car suddenly changes speed.',
    'Space probes coast for years between planets with their engines off.',
    'Loads on lorries and roof racks must be strapped down: when the vehicle brakes, they carry on.'
  ],
  history: 'Aristotle taught that a moving body needs a mover to keep it going. Galileo, rolling balls down one ramp and up another, argued that on a perfectly smooth level plane a ball would roll on for ever. Newton made this the first of his three laws in 1687.'
},

{
  id: 'newtons-second-law', parent: 'dynamics', title: 'Newton\'s second law', level: 1,
  short: 'The net force on an object equals its mass times its acceleration: F = ma. The acceleration points along the net force.',
  keywords: ['second law', 'F = ma', 'net force', 'mass', 'acceleration', 'inertia', 'rate of change of momentum', 'dynamics'],
  prereq: ['newtons-first-law', 'force', 'acceleration'],
  related: ['free-body-diagrams', 'weight-mass', 'momentum', 'rotational-dynamics', 'constant-acceleration'],
  body: `
The first law says a net force changes motion; the second says by how much. Push a trolley twice as hard and it speeds up twice as quickly. Load it with twice the mass and the same push gives half the acceleration:

$$\\vec F_{\\text{net}} = m\\,\\vec a$$

The acceleration points the same way as the **net** force — the vector sum of every force on the object — and its size is the net force divided by the mass. This one equation, applied to the right object with the right forces, solves most of mechanics.

### Reading the law
- **The net force, not any single force.** The road may push a car forwards with 4000 N, but if air and rolling resistance push back with 1000 N, only 3000 N is left to accelerate it.
- **Mass as inertia.** $m$ measures how hard it is to change an object's velocity. It is the same on the Moon as on Earth, even though the weight is not (see [[weight-mass]]).
- **Direction.** Force and acceleration always point the same way; force and velocity need not. A ball thrown upwards has its velocity up and the force on it (its weight) down: so it slows down.
- **Components.** The law holds along each axis separately, $F_x = m a_x$ and $F_y = m a_y$. That is why a [[free-body-diagrams|free-body diagram]] with well-chosen axes makes problems easy.

### Numbers
The newton is defined by this law: 1 N gives 1 kg an acceleration of 1 m/s². A 1500 kg car accelerating at 3 m/s² needs a net forward force of 4500 N. A 57 g tennis ball driven from rest to 50 m/s in 5 ms has an average acceleration of 10 000 m/s², so the racket pushes it with about 570 N — the weight of a person, applied to a ball.

### A deeper form
Newton actually wrote his law in terms of [[momentum]], $\\vec p = m\\vec v$: the net force equals the rate of change of momentum,

$$\\vec F_{\\text{net}} = \\frac{d\\vec p}{dt}$$

For a constant mass this is the same as $m\\vec a$, but it also covers objects whose mass changes, such as a [[rocket-propulsion|rocket]] burning fuel, and it is the form that carries over into [[relativistic-momentum|relativity]].

### Limits
$F = ma$ holds in [[newtons-first-law|inertial frames]], at speeds far below that of light and for objects much bigger than atoms. Beyond those limits relativity and quantum mechanics take over — but for bridges, cars, planets and spacecraft it is extraordinarily accurate.

> [!tip] A reliable recipe: (1) choose the object; (2) draw every force on it; (3) choose axes, one along the acceleration if you know its direction; (4) write $\\sum F = ma$ for each axis; (5) solve, and check the units and the signs.
`,
  ideas: [
    'The net force on an object equals its mass times its acceleration: $F_{\\text{net}} = m a$.',
    'The acceleration points in the direction of the net force, not necessarily of the velocity.',
    'For the same force, a larger mass gives a smaller acceleration: mass measures inertia.',
    'The law holds separately along each axis.',
    'In its general form, the net force is the rate of change of momentum.'
  ],
  pitfalls: [
    'Using one force instead of the net force — F in F = ma is the vector sum of every force on the object. Friction, drag and weight all count.',
    'The force points the way the object moves — The net force sets the direction of the acceleration. A braking car moves forwards while the net force on it points backwards.',
    'Drawing "ma" as an extra force — ma is what the real forces produce, not one of them. Only forces exerted by something belong on the diagram.'
  ],
  formulas: [
    {
      name: 'Newton\'s second law',
      expr: 'F = m*a', tex: 'F_{\\text{net}} = m a',
      vars: {
        F: { name: 'net force', q: 'force', unit: 'N', tex: 'F_{\\text{net}}', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1500 },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 3, signed: true }
      },
      stories: {
        F: 'A car of mass {m} accelerates at {a}. What net force acts on it?',
        a: 'A net force of {F} acts on a {m} crate. What is its acceleration?',
        m: 'A net force of {F} gives a trolley an acceleration of {a}. What is its mass?'
      }
    },
    {
      name: 'Accelerating against resistance',
      expr: 'Fd - Fr = m*a', tex: 'F_d - F_r = m a', solveFor: 'a',
      vars: {
        Fd: { name: 'driving force', q: 'force', unit: 'N', value: 4000, tex: 'F_d' },
        Fr: { name: 'total resistive force (drag, rolling resistance)', q: 'force', unit: 'N', value: 1000, tex: 'F_r' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1500 },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', signed: true }
      },
      stories: {
        a: 'A car of mass {m} has a driving force of {Fd} and meets {Fr} of resistance. What is its acceleration?',
        Fd: 'A {m} van accelerates at {a} against resistances totalling {Fr}. What driving force do its wheels provide?'
      }
    },
    {
      name: 'Speed after a steady net force',
      expr: 'v = v0 + F*t/m', tex: 'v = v_0 + \\frac{F_{\\text{net}}\\,t}{m}',
      vars: {
        v: { name: 'final velocity', q: 'speed', unit: 'm/s', signed: true },
        v0: { name: 'initial velocity', q: 'speed', unit: 'm/s', value: 0, signed: true },
        F: { name: 'net force', q: 'force', unit: 'N', value: 100, tex: 'F_{\\text{net}}', signed: true },
        t: { name: 'time the force acts', q: 'time', unit: 's', value: 5 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 80 }
      },
      stories: {
        v: 'A {m} cyclist starting at {v0} has a net forward force of {F} for {t}. How fast is she going then?',
        t: 'For how long must a net force of {F} act on a {m} sledge to take it from {v0} to {v}?'
      }
    }
  ],
  examples: [
    {
      title: 'Pushing a stalled car',
      q: 'Two people push a stalled 1200 kg car, each with 300 N. Rolling resistance is 150 N. What is the car\'s acceleration, and how long does it take to reach walking pace, 1.5 m/s?',
      steps: [
        'Net force: $2 \\times 300 - 150 = 450\\ \\mathrm{N}$ forwards.',
        '$a = F_{\\text{net}}/m = 450/1200 = 0.375\\ \\mathrm{m/s^2}$.',
        'Time to reach 1.5 m/s from rest: $t = v/a = 1.5/0.375 = 4.0\\ \\mathrm{s}$.'
      ],
      a: '0.375 m/s²; 4 s to walking pace.'
    },
    {
      title: 'The lift cable',
      q: 'A lift and its passengers have a mass of 800 kg. Find the tension in the cable when the lift (a) speeds up while going up at 1.2 m/s², (b) moves at constant speed, (c) speeds up while going down at 1.2 m/s².',
      steps: [
        'Two forces act: the tension $T$ up and the weight $mg = 800 \\times 9.81 = 7848\\ \\mathrm{N}$ down. Take up as positive: $T - mg = ma$.',
        '(a) $a = +1.2$: $T = 800(9.81 + 1.2) = 8808\\ \\mathrm{N}$.',
        '(b) $a = 0$: $T = 7848\\ \\mathrm{N}$, equal to the weight.',
        '(c) $a = -1.2$: $T = 800(9.81 - 1.2) = 6888\\ \\mathrm{N}$.',
        'What matters is the direction of the acceleration, not of the motion: slowing down on the way *down* gives the same tension as (a).'
      ],
      a: '(a) 8.8 kN, (b) 7.8 kN, (c) 6.9 kN.'
    },
    {
      title: 'Towing a trailer',
      q: 'A 1200 kg car tows a 400 kg trailer. After resistances, the net forward force on the pair is 2400 N. Find the acceleration and the force in the tow bar.',
      steps: [
        'Treat car and trailer as one object of 1600 kg: $a = 2400/1600 = 1.5\\ \\mathrm{m/s^2}$. The tow-bar forces are internal to this object and cancel.',
        'Now take the trailer alone. The only horizontal force on it (after resistances) is the tow bar\'s pull: $F = m a = 400 \\times 1.5 = 600\\ \\mathrm{N}$.',
        'Check with the car alone: $2400 - 600 = 1800 = 1200 \\times 1.5$. By the third law the trailer pulls back on the car with those 600 N.'
      ],
      a: '1.5 m/s², with 600 N in the tow bar.'
    }
  ],
  quiz: [
    { q: 'The same net force acts on two carts; cart B has three times the mass of cart A. B\'s acceleration is…', choices: ['three times A\'s', 'the same as A\'s', 'one third of A\'s', 'one ninth of A\'s'], a: 2,
      why: 'a = F/m: three times the mass gives one third of the acceleration.' },
    { q: 'A ball is thrown straight up. While it rises, the net force on it points…', choices: ['up, the way it moves', 'down', 'up at first, then down', 'nowhere: it is zero until the top'], a: 1,
      why: 'Ignoring air, the only force is its weight, downwards, all the time. That is why it slows down on the way up.' },
    { q: 'A 2 kg box is pushed with 10 N across a floor where friction is 4 N. Its acceleration is…', choices: ['5 m/s²', '3 m/s²', '2 m/s²', '7 m/s²'], a: 1,
      why: 'Net force 10 − 4 = 6 N, so a = 6/2 = 3 m/s². Using the push alone (5 m/s²) forgets friction.' },
    { q: 'A lift moving downwards is slowing down. The tension in its cable is greater than its weight.', a: true,
      why: 'Slowing while moving down means the acceleration points up, so the net force must point up: tension greater than weight.' },
    { q: 'If the net force on a moving object suddenly drops to zero, the object…', choices: ['stops at once', 'slows down and stops', 'carries on at the velocity it had', 'speeds up'], a: 2,
      why: 'Zero net force means zero acceleration: the velocity stays whatever it was at that moment.' }
  ],
  applications: [
    'Vehicle design: acceleration times, braking distances and towing limits all follow from F = ma.',
    'Rockets and aircraft: the thrust must exceed the weight and drag by enough to give the acceleration required.',
    'Accelerometers in phones and airbags measure the force on a tiny test mass and divide by its mass.',
    'Crash safety: stretching out the stopping time lowers the acceleration, and with it the force on the body.'
  ],
  history: 'Newton\'s Principia (1687) states that the change of motion is proportional to the force impressed — in modern words, force equals rate of change of momentum. The compact form F = ma for each component was written down by Leonhard Euler around 1750.',
  sim: 'mech1-atwood'
},

{
  id: 'newtons-third-law', parent: 'dynamics', title: 'Newton\'s third law', level: 1,
  short: 'Forces come in pairs: when A pushes or pulls on B, B pushes or pulls on A with a force of the same size in the opposite direction.',
  keywords: ['third law', 'action and reaction', 'action-reaction pair', 'interaction', 'recoil', 'propulsion', 'equal and opposite'],
  prereq: ['force', 'newtons-second-law'],
  related: ['conservation-of-momentum', 'rocket-propulsion', 'normal-force', 'free-body-diagrams'],
  body: `
Push against a wall and the wall pushes back on you — that is how you can lean on it. Row a boat: the oars push water backwards and the water pushes the boat forwards. Forces never come alone.

> [!key] **Newton's third law.** When object A exerts a force on object B, B exerts a force on A that is equal in size and opposite in direction: $\\vec F_{\\text{A on B}} = -\\vec F_{\\text{B on A}}$.

The two forces are called an **action–reaction pair**, although neither comes first: they appear and vanish together. Every pair has four properties:
1. The same size.
2. Opposite directions.
3. The same kind of force — both gravitational, both contact, both magnetic.
4. **They act on different objects.**

### Why they do not cancel
The fourth point answers the classic puzzle: if every force has an equal and opposite partner, how does anything move? Because the partners act on *different* objects, and each object moves according to the forces on *itself* alone. When a horse pulls a cart, the cart pulls back on the horse just as hard. The cart accelerates because the horse's pull on it beats the friction on its wheels; the horse accelerates because the ground pushes it forwards (its hooves push the ground backwards) harder than the cart holds it back.

### Equal forces, unequal effects
A lorry hits a fly on the motorway. During the impact, the force of the fly on the lorry is exactly as large as the force of the lorry on the fly. The results differ enormously because the masses do: by [[newtons-second-law|the second law]], the same force gives the fly a huge acceleration and the lorry an imperceptible one. The same happens when you jump: you push the Earth down as hard as it pushes you up, but $6\\times10^{24}$ kg barely notices.

### Where it shows up
- **Walking and driving.** Your foot pushes backwards on the ground, and friction from the ground pushes you forwards. On ice, with little friction, you cannot push, so you cannot go.
- **Swimming, rowing, propellers, jet engines.** Push fluid backwards and it pushes you forwards.
- **Rockets.** The engine pushes exhaust gas backwards; the gas pushes the rocket forwards. No air is needed to push against, which is why rockets work in space (see [[rocket-propulsion]]).
- **Recoil.** A rifle kicks back as it pushes the bullet forwards.

Because the two forces of a pair are equal, opposite and act for exactly the same time, they give the two objects equal and opposite changes of momentum. That is the root of [[conservation-of-momentum|conservation of momentum]].

> [!warn] A book resting on a table has its weight (the Earth pulling it down) and the normal force (the table pushing it up). They are equal and opposite, but they are **not** a third-law pair: both act on the book, and they are different kinds of force. The partner of the book's weight is the book pulling the *Earth* upwards; the partner of the normal force is the book pressing down on the table.
`,
  ideas: [
    'Forces come in pairs: if A pushes on B, B pushes back on A just as hard in the opposite direction.',
    'The two forces of a pair act on different objects, so they never cancel each other.',
    'Both forces of a pair are of the same kind and last exactly as long.',
    'Equal forces can have very unequal effects when the masses are very different.'
  ],
  pitfalls: [
    'Action and reaction cancel, so nothing can move — They act on different objects. To find how one object moves, add only the forces on that object.',
    'Weight and the normal force are an action–reaction pair — Both act on the same object and are different kinds of force. They are equal only when nothing accelerates vertically.',
    'In a collision the bigger or faster object pushes harder — The two forces are always equal. The lighter object simply changes its velocity more.'
  ],
  formulas: [
    {
      name: 'Equal forces, different accelerations',
      expr: 'm1*a1 = m2*a2', tex: 'm_1 a_1 = m_2 a_2', solveFor: 'a2',
      vars: {
        m1: { name: 'mass of the first object', q: 'mass', unit: 'kg', value: 60 },
        a1: { name: 'size of its acceleration', q: 'accel', unit: 'm/s²', value: 2 },
        m2: { name: 'mass of the second object', q: 'mass', unit: 'kg', value: 90 },
        a2: { name: 'size of its acceleration', q: 'accel', unit: 'm/s²' }
      },
      note: 'While two objects push or pull only on each other, the forces are equal, so the accelerations are in inverse proportion to the masses (and opposite in direction).',
      stories: {
        a2: 'Two skaters of {m1} and {m2} push off from each other. The first accelerates at {a1}. What is the acceleration of the second?',
        m2: 'An astronaut of {m1} pushes on a satellite and accelerates at {a1}, while the satellite accelerates at {a2}. What is its mass?'
      }
    }
  ],
  examples: [
    {
      title: 'Skaters pushing apart',
      q: 'Two skaters, of 60 kg and 90 kg, stand face to face on smooth ice and push each other with 120 N for 0.50 s. How fast is each moving afterwards?',
      steps: [
        'By the third law each feels 120 N, in opposite directions.',
        'Accelerations: $a_1 = 120/60 = 2.0\\ \\mathrm{m/s^2}$ and $a_2 = 120/90 = 1.33\\ \\mathrm{m/s^2}$.',
        'After 0.50 s: $v_1 = 2.0 \\times 0.50 = 1.0\\ \\mathrm{m/s}$ one way, $v_2 = 1.33 \\times 0.50 = 0.67\\ \\mathrm{m/s}$ the other way.',
        'Their momenta are $60 \\times 1.0 = 60$ and $90 \\times 0.67 = 60\\ \\mathrm{kg\\,m/s}$, opposite: the total stays zero, as it was before the push.'
      ],
      a: '1.0 m/s and 0.67 m/s, in opposite directions.'
    },
    {
      title: 'The lorry and the fly',
      q: 'A 1.0 g fly is hit by the windscreen of a 20 t lorry doing 25 m/s. The fly is brought up to the lorry\'s speed in about 1 ms. Estimate the force on each, and the lorry\'s loss of speed.',
      steps: [
        'Fly: its velocity changes by 25 m/s in 0.001 s, so $a = 25\\,000\\ \\mathrm{m/s^2}$ and $F = 0.001 \\times 25\\,000 = 25\\ \\mathrm{N}$.',
        'Lorry: by the third law it feels the same 25 N, backwards. Its deceleration is $25/20\\,000 = 1.25\\times10^{-3}\\ \\mathrm{m/s^2}$.',
        'Over 1 ms that slows the lorry by $1.25\\times10^{-6}\\ \\mathrm{m/s}$ — about a micrometre per second.'
      ],
      a: 'About 25 N on each; the lorry loses roughly a millionth of a metre per second.'
    }
  ],
  quiz: [
    { q: 'A lorry collides head-on with a small car. During the collision, the force of the lorry on the car is…', choices: ['larger than the force of the car on the lorry', 'equal in size to the force of the car on the lorry', 'smaller than the force of the car on the lorry', 'zero, because the lorry is heavier'], a: 1,
      why: 'Third law: always equal and opposite. The car suffers more because its smaller mass receives the larger acceleration.' },
    { q: 'A book rests on a table. What is the third-law partner of the book\'s weight?', choices: ['The table pushing up on the book', 'The book pulling up on the Earth', 'The book pushing down on the table', 'The floor pushing up on the table'], a: 1,
      why: 'The weight is the Earth pulling the book. Its partner must be the same kind of force on the other object: the book pulling the Earth.' },
    { q: 'How does a swimmer move forwards?', choices: ['Her hands push water backwards, and the water pushes her forwards', 'She pushes on herself', 'The water in front of her pulls her along', 'Buoyancy pushes her forwards'], a: 0,
      why: 'She pushes water backwards; by the third law the water pushes her forwards with an equal force.' },
    { q: 'A rocket needs air to push against, so it cannot accelerate in the vacuum of space.', a: false,
      why: 'The rocket pushes on its own exhaust gas, and the gas pushes back on the rocket. It works even better in a vacuum, where there is no air resistance.' }
  ],
  applications: [
    'Jet engines, propellers and rockets all push a fluid backwards in order to be pushed forwards.',
    'The recoil of guns and cannon, and the kick of a fire hose.',
    'Walking, running and driving depend on the ground pushing back on feet and tyres — which is why ice is treacherous.'
  ],
  history: 'Newton gave the third law in 1687 with homely examples: a finger pressing a stone is pressed by the stone in return, and a horse towing a stone on a rope is pulled back towards the stone just as hard.'
},

{
  id: 'weight-mass', parent: 'dynamics', title: 'Weight and mass', level: 1,
  short: 'Mass (kg) is the amount of matter and its inertia, the same everywhere. Weight (N) is the pull of gravity on it, W = mg, which depends on where you are.',
  keywords: ['weight', 'mass', 'W = mg', 'gravitational field strength', 'g', 'apparent weight', 'weightlessness', 'scale reading', 'kilogram', 'newton'],
  prereq: ['force', 'newtons-second-law', 'free-fall'],
  related: ['normal-force', 'newtons-law-of-gravitation', 'gravitational-field', 'equivalence-principle', 'circular-orbits'],
  body: `
In everyday speech "weight" is measured in kilograms. In physics, mass and weight are different quantities, and mixing them up causes real confusion.

- **Mass** $m$, in kilograms, measures how much matter an object contains and how strongly it resists changes of motion — its inertia. It is the same everywhere.
- **Weight** $W$, in newtons, is the gravitational force on the object: the pull of the Earth, or of whatever world it is on. It depends on where you are.

Near a planet's surface the two are linked by the local gravitational field strength $g$:

$$W = m g$$

On Earth $g \\approx 9.81\\ \\mathrm{N/kg}$, which is the same thing as $9.81\\ \\mathrm{m/s^2}$ — the acceleration of [[free-fall|free fall]]. A 70 kg person weighs about 690 N on Earth, 113 N on the Moon ($g = 1.62$), 260 N on Mars ($g = 3.71$) and about 1740 N at the cloud tops of Jupiter ($g = 24.8$). Their mass is 70 kg in every one of those places.

### Why g is both a field and an acceleration
Weight is proportional to mass, and so is inertia. In [[newtons-second-law|Newton's second law]] the two cancel: $a = W/m = g$. That is why all objects fall with the same acceleration in a vacuum. Einstein turned this "coincidence" — the equality of gravitational and inertial mass — into the [[equivalence-principle|equivalence principle]] of general relativity.

### What a scale really measures
A bathroom scale does not measure mass, or even weight directly: it measures how hard it must push up on you — the [[normal-force|normal force]]. Standing still, that equals your weight, and the scale divides by 9.81 to show kilograms. In a lift accelerating upwards it must push harder, $N = m(g + a)$, and you seem heavier; accelerating downwards you seem lighter; and in free fall it reads zero. This reading is your **apparent weight**.

### Weightlessness
Astronauts in the International Space Station float, yet gravity up there is still about 90% as strong as on the ground. They float because the station and everything in it are in free fall together, for ever falling around the Earth ([[circular-orbits]]). Nothing presses on anything, so every scale reads zero — a state better called *apparent* weightlessness.

> [!tip] A beam balance, which compares an object with standard masses, measures mass: it gives the same answer on the Moon. A spring scale measures force: on the Moon it reads about one sixth as much.
`,
  ideas: [
    'Mass (kg) measures the amount of matter and its inertia; it is the same everywhere.',
    'Weight (N) is the gravitational force on an object, W = mg; it changes from place to place.',
    'g ≈ 9.81 N/kg on Earth is both the field strength and the free-fall acceleration.',
    'Scales measure the supporting force — the apparent weight — which changes when you accelerate.',
    'Orbiting astronauts only seem weightless: they are in free fall along with their spacecraft.'
  ],
  pitfalls: [
    'Mass and weight are the same thing — Mass is in kilograms and never changes; weight is a force in newtons that depends on the local gravity.',
    'There is no gravity in orbit — At the height of the ISS gravity is about 90% of its surface value. Astronauts float because they fall freely together with their spacecraft.',
    'A scale always shows your weight — It shows how hard it pushes up on you. In an accelerating lift, or on a slope, that differs from mg.'
  ],
  formulas: [
    {
      name: 'Weight',
      expr: 'W = m*g', tex: 'W = m g',
      vars: {
        W: { name: 'weight', q: 'force', unit: 'N' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 70 },
        g: { const: 'g' }
      },
      note: 'Change $g$ for another world: Moon 1.62, Mars 3.71, Jupiter 24.8 m/s².',
      stories: {
        W: 'What does a {m} astronaut weigh on Earth?',
        m: 'A crate weighs {W} on Earth. What is its mass?'
      }
    },
    {
      name: 'Apparent weight in an accelerating lift',
      expr: 'N = m*(g + a)', tex: 'N = m (g + a)',
      vars: {
        N: { name: 'scale reading (normal force)', q: 'force', unit: 'N' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 70 },
        g: { const: 'g' },
        a: { name: 'acceleration of the lift, upwards positive', q: 'accel', unit: 'm/s²', value: 1.5, signed: true }
      },
      note: 'Accelerating upwards (starting up, or stopping on the way down) makes you feel heavier; downwards makes you lighter; $a = -g$ is free fall, with $N = 0$.',
      stories: {
        N: 'A {m} passenger stands on a scale in a lift whose acceleration is {a} (upwards positive). What does the scale read, in newtons?',
        a: 'A {m} person\'s scale reads {N} in a moving lift. What is the lift\'s acceleration (upwards positive)?'
      }
    }
  ],
  examples: [
    {
      title: 'One astronaut, three worlds',
      q: 'An astronaut has a mass of 80 kg. Find her weight on Earth, the Moon and Mars. On Earth she can jump 0.50 m high; roughly how high on the Moon, launching at the same speed?',
      steps: [
        'Earth: $80 \\times 9.81 = 785\\ \\mathrm{N}$. Moon: $80 \\times 1.62 = 130\\ \\mathrm{N}$. Mars: $80 \\times 3.71 = 297\\ \\mathrm{N}$.',
        'Her mass is 80 kg on all three, so her legs give her the same launch speed (ignoring her bulky suit).',
        'Jump height for a launch speed $v$ is $v^2/2g$, inversely proportional to $g$: $0.50 \\times 9.81/1.62 = 3.0\\ \\mathrm{m}$ on the Moon.'
      ],
      a: '785 N, 130 N and 297 N; about 3 m on the Moon.'
    },
    {
      title: 'Weighing yourself in a lift',
      q: 'A 70 kg person stands on bathroom scales (which divide the force by 9.81 to show "kg") in a lift. What do they show while the lift (a) speeds up upwards at 1.5 m/s², (b) moves steadily, (c) slows to a stop at the top at 1.5 m/s², (d) falls freely?',
      steps: [
        '(a) $N = 70(9.81 + 1.5) = 792\\ \\mathrm{N}$, shown as $792/9.81 = 80.7$ "kg".',
        '(b) $N = 70 \\times 9.81 = 687\\ \\mathrm{N}$: 70.0 "kg".',
        '(c) Slowing on the way up is an acceleration downwards, $a = -1.5$: $N = 70(9.81 - 1.5) = 582\\ \\mathrm{N}$, 59.3 "kg".',
        '(d) $a = -9.81$: $N = 0$, the scales read zero.'
      ],
      a: '80.7, 70.0, 59.3 and 0 "kg" — while the person\'s mass stays 70 kg throughout.'
    }
  ],
  quiz: [
    { q: 'An astronaut has a mass of 80 kg on Earth. On the Moon her mass is…', choices: ['about 13 kg', '80 kg', '130 kg', 'zero'], a: 1,
      why: 'Mass does not depend on location. Her weight drops to about 130 N, one sixth of its value on Earth.' },
    { q: 'You stand on a bathroom scale in a lift. When does it read more than your weight?', choices: ['Moving up at constant speed', 'Moving down at constant speed', 'Starting to move up from rest', 'Starting to move down from rest'], a: 2,
      why: 'The scale reads m(g + a), which exceeds mg when the acceleration points up: starting upwards, or stopping on the way down.' },
    { q: 'Why do astronauts float inside the International Space Station?', choices: ['There is no gravity in space', 'Gravity is only about 10% as strong up there', 'They and the station fall freely together', 'The air in the station holds them up'], a: 2,
      why: 'Gravity at the ISS is about 90% of its surface value. Everything falls together around the Earth, so nothing presses on anything.' },
    { q: 'A beam balance comparing a bag of flour with standard masses would give the same reading on the Moon.', a: true,
      why: 'Both pans are pulled by the same weaker g, so the comparison — which measures mass — is unchanged. A spring scale would read one sixth as much.' }
  ],
  applications: [
    'Load ratings of cranes, lifts and bridges are forces — often quoted as the mass they can hold at standard g.',
    'Planning Moon and Mars missions: suits, rovers and landers weigh far less there, while their inertia is unchanged.',
    'Parabolic "zero-g" flights give passengers about 20–25 s of apparent weightlessness per arc by flying the aircraft on a free-fall path.'
  ]
},

{
  id: 'free-body-diagrams', parent: 'dynamics', title: 'Free-body diagrams', level: 1,
  short: 'A sketch of one object with an arrow for every force acting on it — the first step in solving almost any problem with forces.',
  keywords: ['free-body diagram', 'force diagram', 'FBD', 'net force', 'components', 'axes', 'system', 'internal forces', 'problem solving'],
  prereq: ['force', 'newtons-second-law', 'math:vector-components'],
  related: ['normal-force', 'friction', 'tension-pulleys', 'inclined-plane', 'newtons-third-law', 'static-equilibrium'],
  body: `
Most mistakes in mechanics happen before any algebra: a force is forgotten, one is invented, or a force on the wrong object sneaks in. A **free-body diagram** prevents this. It shows one object, cut free from its surroundings, with an arrow for every force that acts **on it** — and nothing else.

### How to draw one
1. **Choose the object** — or a group of objects moving together, treated as one. Draw it as a box or a dot.
2. **Find every force on it.** Its weight $m\\vec g$ acts straight down. Then go round everything it touches: a surface gives a [[normal-force|normal force]] (perpendicular to the surface) and perhaps [[friction]] (along it); a rope or string gives a [[tension-pulleys|tension]] (along the rope, pulling); a fluid gives [[drag-force|drag]] and buoyancy. Electric and magnetic forces are added if the object is charged or magnetic.
3. **Draw each force as an arrow** starting on the object, pointing the way the force acts, roughly to scale, and **label** it with what exerts it: "tension of rope", "normal force of floor".
4. **Choose axes.** Put one axis along the acceleration if you know its direction — along an [[inclined-plane|incline]], or towards the centre of a circle.
5. **Apply Newton's second law along each axis**: $\\sum F_x = m a_x$ and $\\sum F_y = m a_y$.

> [!key] Ask of every arrow: *what exerts this force?* If you cannot name the object, the force does not exist. There is no "force of motion", no "force of inertia", and $m\\vec a$ is never drawn as a force.

### An example worked through
A 20 kg box is pulled across a floor by a rope at 30° above the horizontal with tension $T = 100\\ \\mathrm{N}$. The coefficient of kinetic friction is 0.30. Four forces act on the box: its weight $mg$ down, the normal force $N$ up, the tension $T$ along the rope, and kinetic friction $f = \\mu_k N$ backwards. Vertically there is no acceleration:

$$N + T\\sin 30° - mg = 0 \\;\\Rightarrow\\; N = 196.2 - 50 = 146.2\\ \\mathrm{N}$$

The rope lifts part of the weight, so the normal force — and the friction with it — are smaller than $mg$ and $\\mu_k mg$. Horizontally:

$$T\\cos 30° - \\mu_k N = m a \\;\\Rightarrow\\; a = \\frac{86.6 - 43.9}{20} = 2.14\\ \\mathrm{m/s^2}$$

### Several objects
For connected objects — a car towing a trailer, blocks joined by a string — draw a separate diagram for each. The forces between them (the tow bar, the string) appear on both diagrams as a [[newtons-third-law|third-law pair]], equal and opposite. Treating the whole group as one object makes those internal forces drop out, which is a quick way to find the shared acceleration; the separate diagrams then give the internal forces.

When the net force is zero in every direction, the diagram describes an object in equilibrium — the starting point of [[static-equilibrium|statics]], where bridges and cranes are designed.
`,
  ideas: [
    'Draw only the forces acting on the chosen object, each exerted by something you can name.',
    'Weight acts on everything; every contact adds a force; nothing else belongs on the diagram.',
    'Choose axes along and across the acceleration, then apply ΣF = ma along each axis.',
    'Internal forces cancel when a group of objects is treated as one.'
  ],
  pitfalls: [
    'Drawing ma, a "force of motion" or the centripetal force as extra arrows — None of these is exerted by anything. ma is what the real forces produce; the centripetal force is the net inward part of the real forces.',
    'Including forces the object exerts on other things — The diagram of a book shows the table pushing up on the book, not the book pressing down on the table.',
    'Assuming the normal force always equals mg — Only when no other forces have vertical parts and nothing accelerates vertically. A pull at an angle, a slope or a lift all change it.'
  ],
  formulas: [
    {
      name: 'Box pulled at an angle, with friction',
      expr: 'a = (F*cos(theta) - mu*(m*g - F*sin(theta)))/m', tex: 'a = \\frac{F\\cos\\theta - \\mu_k\\,(m g - F\\sin\\theta)}{m}',
      vars: {
        a: { name: 'acceleration along the floor', q: 'accel', unit: 'm/s²' },
        F: { name: 'pull along the rope', q: 'force', unit: 'N', value: 100 },
        theta: { name: 'angle of the rope above the horizontal', q: 'angle', unit: '°', value: 30, min: 0, max: 80 },
        mu: { name: 'coefficient of kinetic friction', value: 0.3, tex: '\\mu_k' },
        m: { name: 'mass of the box', q: 'mass', unit: 'kg', value: 20 },
        g: { const: 'g' }
      },
      note: 'Valid while the box slides and stays on the floor ($F\\sin\\theta < mg$). The normal force is $N = mg - F\\sin\\theta$.',
      stories: {
        a: 'A {m} box is pulled across a floor with {F} along a rope at {theta} above the horizontal. The coefficient of kinetic friction is {mu}. What is its acceleration?',
        F: 'What pull along a rope at {theta} gives a {m} box an acceleration of {a}, if the coefficient of kinetic friction is {mu}?'
      }
    }
  ],
  examples: [
    {
      title: 'Pulling beats pushing',
      q: 'The 20 kg box above ($\\mu_k = 0.30$) is now *pushed* with 100 N along a handle angled 30° *below* the horizontal. Compare its acceleration with the 2.14 m/s² it gets when pulled at 30° above.',
      steps: [
        'The push now has a downward component $100\\sin 30° = 50\\ \\mathrm{N}$, which adds to the weight: $N = 196.2 + 50 = 246.2\\ \\mathrm{N}$.',
        'Friction: $0.30 \\times 246.2 = 73.9\\ \\mathrm{N}$.',
        'The forward component is still $100\\cos 30° = 86.6\\ \\mathrm{N}$, so $a = (86.6 - 73.9)/20 = 0.64\\ \\mathrm{m/s^2}$.',
        'Pushing downwards at an angle presses the box into the floor: friction rises from 43.9 N to 73.9 N and the acceleration falls to less than a third. Pull a sledge; do not push it.'
      ],
      a: '0.64 m/s² pushing, against 2.14 m/s² pulling.'
    },
    {
      title: 'Two blocks and a string',
      q: 'Blocks of 3 kg and 2 kg lie on a frictionless floor, joined by a light string. A 20 N horizontal pull is applied to the 3 kg block, away from the 2 kg one. Find the acceleration and the tension in the string.',
      steps: [
        'Both blocks as one object of 5 kg: the only horizontal force is the 20 N pull, so $a = 20/5 = 4.0\\ \\mathrm{m/s^2}$.',
        'Diagram of the 2 kg block: the only horizontal force is the string\'s tension, so $T = 2 \\times 4.0 = 8.0\\ \\mathrm{N}$.',
        'Check with the 3 kg block: $20 - 8.0 = 12 = 3 \\times 4.0$. The string pulls it backwards with the same 8 N.'
      ],
      a: '4.0 m/s², with 8.0 N of tension in the string.'
    }
  ],
  quiz: [
    { q: 'A ball flies through the air after being kicked (ignore air resistance). What belongs on its free-body diagram?', choices: ['Its weight only', 'Its weight and the force of the kick', 'The force of the kick only', 'Its weight and a forward "force of motion"'], a: 0,
      why: 'The kick ended when the foot lost contact. In flight only gravity acts (and the air, which we are ignoring).' },
    { q: 'A block slides down a rough slope. How many forces act on it?', choices: ['Two: weight and friction', 'Three: weight, normal force and friction', 'Four: weight, normal force, friction and the force down the slope', 'One: the net force'], a: 1,
      why: '"The force down the slope" is just a component of the weight; drawing it as well would count gravity twice.' },
    { q: 'You push down and forwards on the handle of a lawnmower. Compared with the mower\'s weight, the normal force from the ground is…', choices: ['smaller', 'equal', 'larger', 'zero'], a: 2,
      why: 'Your push has a downward component, which adds to the weight, so the ground must push up harder.' },
    { q: 'On the free-body diagram of a car going round a bend at constant speed, you should add an arrow labelled "centripetal force".', a: false,
      why: 'The centripetal force is not an extra force: it is the net inward part of the real forces — here, the sideways friction on the tyres.' }
  ],
  applications: [
    'Every structural calculation — a bridge truss, a crane jib, a bicycle frame — starts from free-body diagrams of its parts.',
    'Biomechanics: diagrams of a forearm or a knee show why muscles and joints carry forces several times the body\'s weight.',
    'Vehicle dynamics: the forces on each tyre decide the grip available for braking and cornering.'
  ],
  sim: 'mech1-incline'
},

{
  id: 'normal-force', parent: 'dynamics', title: 'Normal force', level: 1,
  short: 'The push of a surface on an object, at right angles to the surface. It adjusts itself to stop the object sinking in — and is often not equal to mg.',
  keywords: ['normal force', 'support force', 'reaction force', 'contact force', 'perpendicular', 'apparent weight', 'humpback bridge', 'loop'],
  prereq: ['force', 'weight-mass', 'newtons-second-law'],
  related: ['free-body-diagrams', 'friction', 'inclined-plane', 'centripetal-force', 'newtons-third-law'],
  body: `
Put a book on a table and it does not sink through. The table pushes up on it with exactly the force needed to stop that happening. This support force from a surface is the **normal force** $N$ — "normal" meaning perpendicular, because it always acts at right angles to the surface.

### A force that adjusts itself
The normal force has no formula of its own. A loaded surface deforms very slightly — the table sags by a tiny fraction of a millimetre, the atoms at its surface are squeezed together — and pushes back as hard as it has to. Put down a heavier book and it pushes harder, until the load is so large that the table breaks. So you find $N$ from [[newtons-second-law|Newton's second law]] applied perpendicular to the surface, taking into account whatever else is going on.

### When N is not mg
Only in the simplest case — a horizontal surface, no other vertical forces, no vertical acceleration — is $N = mg$. In general:

| Situation | Normal force |
|---|---|
| Resting on level ground | $N = mg$ |
| Pressed down with an extra force $F$ | $N = mg + F$ |
| Pulled upwards at an angle $\\theta$ by a force $F$ | $N = mg - F\\sin\\theta$ |
| On a slope of angle $\\theta$ | $N = mg\\cos\\theta$ |
| In a lift accelerating upwards at $a$ | $N = m(g + a)$ |
| Car over a hump of radius $r$ at speed $v$ | $N = m(g - v^2/r)$ |
| At the top of a loop, upside down | $N = m(v^2/r - g)$ |

The hump is striking. Going over the crest the car moves on a circle, so part of its weight is needed to provide the downward [[centripetal-force|centripetal force]], and the road pushes up less. At the speed $v = \\sqrt{g r}$ the normal force reaches zero and the wheels leave the road — the stomach-lifting moment on a humpback bridge or a roller-coaster crest.

### Normal force and friction
[[friction|Friction]] is proportional to the normal force, not to the weight. That is why a slope gives less grip than level ground, why a sledge pulled by a rope angled upwards drags more easily, and why racing cars use wings that press them down onto the track: more $N$, more grip in the bends.

> [!note] The normal force and the weight of a resting book are equal and opposite, but they are **not** a third-law pair: both act on the book. The table's push on the book is paired with the book's push on the table (see [[newtons-third-law]]).
`,
  ideas: [
    'The normal force is the push of a surface, perpendicular to it.',
    'It adjusts itself to whatever is needed to stop the object moving into the surface — up to breaking point.',
    'Find it from Newton\'s second law perpendicular to the surface; it equals mg only in the simplest case.',
    'Friction is proportional to the normal force, not to the weight.'
  ],
  pitfalls: [
    'The normal force always equals the weight — Slopes, extra pushes or pulls, vertical acceleration and curved paths all change it.',
    'The normal force is the reaction to the weight — Its third-law partner is the object pushing on the surface. The weight\'s partner is the object pulling the Earth.',
    '"Normal" means ordinary — Here it means perpendicular to the surface.'
  ],
  formulas: [
    {
      name: 'Normal force on a slope',
      expr: 'N = m*g*cos(theta)', tex: 'N = m g\\cos\\theta',
      vars: {
        N: { name: 'normal force', q: 'force', unit: 'N' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1200 },
        g: { const: 'g' },
        theta: { name: 'angle of the slope', q: 'angle', unit: '°', value: 15, min: 0, max: 90 }
      },
      stories: {
        N: 'A {m} car is parked on a road sloping at {theta}. How hard does the road push on it, perpendicular to the surface?',
        theta: 'The road pushes on a parked {m} car with a normal force of {N}. How steep is the road?'
      }
    },
    {
      name: 'Normal force at the top of a hump',
      expr: 'N = m*(g - v^2/r)', tex: 'N = m\\left(g - \\frac{v^2}{r}\\right)',
      vars: {
        N: { name: 'normal force from the road', q: 'force', unit: 'N' },
        m: { name: 'mass of the car', q: 'mass', unit: 'kg', value: 1000 },
        g: { const: 'g' },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 10 },
        r: { name: 'radius of curvature of the hump', q: 'length', unit: 'm', value: 20 }
      },
      note: '$N$ falls to zero at $v = \\sqrt{g r}$; any faster and the car leaves the road.',
      stories: {
        N: 'A {m} car crosses a hump of radius {r} at {v}. How hard does the road push up on it at the top?',
        v: 'At what speed does the road push on a {m} car with only {N} at the top of a hump of radius {r}?'
      }
    }
  ],
  examples: [
    {
      title: 'Over the humpback bridge',
      q: 'A 1000 kg car crosses a humpback bridge whose top has a radius of curvature of 20 m. Find the normal force at the top at 10 m/s, and the speed at which the car would just leave the road.',
      steps: [
        'At the top, weight down and normal force up; the net force must point down to the centre: $mg - N = m v^2/r$.',
        '$N = m(g - v^2/r) = 1000(9.81 - 100/20) = 1000 \\times 4.81 = 4810\\ \\mathrm{N}$ — less than half the car\'s weight of 9810 N.',
        'The wheels lose contact when $N = 0$: $v = \\sqrt{g r} = \\sqrt{9.81 \\times 20} = 14.0\\ \\mathrm{m/s}$, about 50 km/h.'
      ],
      a: '4.8 kN at 10 m/s; the car leaves the road above 14 m/s.'
    },
    {
      title: 'Upside down in a loop',
      q: 'A 60 kg rider passes the top of a roller-coaster loop of radius 8.0 m at 12 m/s. How hard does the seat push on her, and how does it feel?',
      steps: [
        'At the top both her weight and the seat\'s push point down, towards the centre: $N + mg = m v^2/r$.',
        '$v^2/r = 144/8.0 = 18.0\\ \\mathrm{m/s^2}$, so $N = 60(18.0 - 9.81) = 491\\ \\mathrm{N}$.',
        'That is $491/(60 \\times 9.81) = 0.83$ of her weight: upside down, she is pressed into her seat almost as firmly as when sitting at rest.'
      ],
      a: '491 N, about 0.83 of her weight, pressing her into the seat.'
    }
  ],
  quiz: [
    { q: 'A 5 kg box rests on a table and you press down on it with 20 N. The normal force from the table is about…', choices: ['29 N', '49 N', '69 N', '20 N'], a: 2,
      why: 'The table must balance both the weight (49 N) and your push (20 N): 69 N in all.' },
    { q: 'A car drives fast over the crest of a hill. Compared with its weight, the normal force at the crest is…', choices: ['larger', 'the same', 'smaller', 'always zero'], a: 2,
      why: 'Moving on a curve over the crest needs a net downward force, so the road pushes up less than mg: N = m(g − v²/r).' },
    { q: 'On a 30° slope, the normal force on a resting block is what fraction of its weight?', choices: ['0.50', '0.87', '1.00', '0.58'], a: 1,
      why: 'N = mg cos 30° = 0.87 mg. The rest of the weight\'s effect is its component along the slope, balanced by friction.' },
    { q: 'The normal force on a person standing in a lift moving downwards at constant speed is less than their weight.', a: false,
      why: 'Constant velocity means no acceleration and no net force, so N = mg. Only accelerating downwards (or slowing on the way up) makes N smaller.' }
  ],
  applications: [
    'Racing-car wings and diffusers add downforce, raising the normal force and with it the grip in corners.',
    'Roller-coaster designers shape crests and loops so the normal force on riders stays within comfortable limits — and sometimes briefly lets them float for "airtime".',
    'Bathroom scales, force plates and pressure mats all measure a normal force.'
  ],
  sim: 'mech1-incline'
},

{
  id: 'friction', parent: 'dynamics', title: 'Friction', level: 1,
  short: 'The force that resists surfaces sliding over each other: static friction up to μs N holds things still, kinetic friction μk N acts while they slide.',
  keywords: ['friction', 'static friction', 'kinetic friction', 'sliding friction', 'coefficient of friction', 'mu', 'grip', 'skid', 'traction', 'ABS brakes', 'Amontons'],
  prereq: ['normal-force', 'force', 'newtons-second-law'],
  related: ['inclined-plane', 'drag-force', 'rolling-motion', 'free-body-diagrams', 'work'],
  body: `
Friction is the force that resists two surfaces sliding over each other. It is why a book slid across a table stops, why you can walk without slipping, why brakes work and why engines wear out. It acts **along** the surfaces, against their relative sliding — or, if they are not yet sliding, against the sliding that would otherwise begin.

### Static and kinetic friction
Push gently on a heavy box and it does not move: **static friction** matches your push exactly. Push harder and it matches that too — up to a limit. Beyond it the box breaks free and slides, and a (usually smaller) **kinetic friction** acts:

$$f_s \\le \\mu_s N, \\qquad f_k = \\mu_k N$$

Here $N$ is the [[normal-force|normal force]] pressing the surfaces together, and $\\mu_s$ and $\\mu_k$ are the coefficients of static and kinetic friction, pure numbers that depend on the two materials. Note the "$\\le$": static friction is only as large as it needs to be. A box that nobody pushes feels no friction at all.

Because $\\mu_k < \\mu_s$, it takes more force to start something sliding than to keep it sliding — the jolt you feel when a sticking drawer suddenly gives.

| Surfaces | $\\mu_s$ | $\\mu_k$ |
|---|---|---|
| Rubber tyre on dry asphalt | 0.9 | 0.7 |
| Rubber tyre on wet asphalt | 0.6 | 0.45 |
| Wood on wood | 0.4 | 0.3 |
| Steel on steel, dry | 0.7 | 0.5 |
| Ice on ice, near 0 °C | 0.1 | 0.03 |
| PTFE (Teflon) on PTFE | 0.04 | 0.04 |

These are typical values; real surfaces vary a lot with finish, dirt, moisture and temperature.

### Rules of thumb — and why they hold
To a good approximation, friction
- is proportional to the normal force;
- does **not** depend on the apparent area of contact — a brick slides as easily on its side as on its end;
- hardly depends on the sliding speed.

The reason is microscopic. Even polished surfaces are rough on the scale of micrometres and touch only at the tips of their bumps. Press harder and the tips flatten, so the *real* contact area grows in proportion to the load. Friction comes from the bonds and interlocking at those tiny junctions, so it scales with the load, not with the size of the block.

### Friction you need
Walking, running and driving *depend* on friction: your foot pushes backwards on the ground, and static friction pushes you forwards. A rolling tyre's contact patch is momentarily at rest on the road, so it grips with *static* friction — which is why anti-lock brakes, by keeping the wheels turning, usually stop a car sooner than a skid does. A skidding car relies on kinetic friction alone, and on a level road it stops in

$$d = \\frac{v^2}{2\\mu_k g}$$

whatever its mass: a heavier car has more to stop, but it is pressed down harder in exactly the same proportion.

> [!tip] In the simulation, tilt the incline slowly: the block starts to slip when $\\tan\\theta = \\mu_s$, whatever its mass — a simple way to measure $\\mu_s$.
`,
  ideas: [
    'Friction acts along the surfaces in contact and opposes their sliding, or the sliding that would otherwise start.',
    'Static friction adjusts itself up to μs N; kinetic friction is μk N, usually somewhat less.',
    'Friction is roughly proportional to the normal force and independent of the apparent contact area and of speed.',
    'Walking, driving and braking rely on static friction.',
    'A skidding object on level ground stops in d = v²/(2μk g), whatever its mass.'
  ],
  pitfalls: [
    'Static friction is always μs N — That is its maximum. It is only as large as needed to prevent sliding: zero if nothing pushes.',
    'Friction always opposes motion — It opposes relative sliding of the surfaces. On a walking foot or a car\'s driven wheels it points forwards, the way the body moves.',
    'A bigger contact area means more friction — To a first approximation area does not matter, the load does. (Wide tyres help for other reasons: heat, wear and softer rubber.)'
  ],
  formulas: [
    {
      name: 'Kinetic friction',
      expr: 'f = mu*N', tex: 'f_k = \\mu_k N',
      vars: {
        f: { name: 'kinetic friction force', q: 'force', unit: 'N', tex: 'f_k' },
        mu: { name: 'coefficient of kinetic friction', value: 0.35, tex: '\\mu_k' },
        N: { name: 'normal force', q: 'force', unit: 'N', value: 490 }
      },
      note: 'For the largest possible static friction use $\\mu_s$ instead: $f_s \\le \\mu_s N$.',
      stories: {
        f: 'A crate pressing on the floor with a normal force of {N} slides with a coefficient of kinetic friction of {mu}. What is the friction force?',
        mu: 'A block with a normal force of {N} needs a push of {f} to keep it sliding at steady speed. What is the coefficient of kinetic friction?'
      }
    },
    {
      name: 'Skidding distance on a level road',
      expr: 'd = v^2/(2*mu*g)', tex: 'd = \\frac{v^2}{2\\mu_k g}',
      vars: {
        d: { name: 'skidding distance', q: 'length', unit: 'm' },
        v: { name: 'speed when the skid starts', q: 'speed', unit: 'km/h', value: 90 },
        mu: { name: 'coefficient of kinetic friction', value: 0.7, tex: '\\mu_k' },
        g: { const: 'g' }
      },
      note: 'Wheels locked on a level road; the mass cancels.',
      stories: {
        d: 'A car skids to a stop from {v} on a road where the coefficient of kinetic friction is {mu}. How long are the skid marks?',
        v: 'Skid marks {d} long are found on a road where the coefficient of kinetic friction is {mu}. How fast was the car going?'
      }
    }
  ],
  examples: [
    {
      title: 'Getting a crate moving',
      q: 'A 50 kg crate rests on a floor with $\\mu_s = 0.50$ and $\\mu_k = 0.35$. What horizontal push starts it moving? What push keeps it sliding at steady speed? If you keep pushing with 250 N once it moves, what is its acceleration?',
      steps: [
        'Normal force: $N = mg = 50 \\times 9.81 = 490.5\\ \\mathrm{N}$.',
        'To start it you must exceed the most static friction can give: $\\mu_s N = 0.50 \\times 490.5 = 245\\ \\mathrm{N}$.',
        'Sliding at steady speed needs a push equal to kinetic friction: $\\mu_k N = 0.35 \\times 490.5 = 172\\ \\mathrm{N}$.',
        'With 250 N while sliding: $a = (250 - 172)/50 = 1.57\\ \\mathrm{m/s^2}$ — the crate lurches forwards once it breaks free.'
      ],
      a: 'Just over 245 N to start, 172 N to keep it going, and 1.57 m/s² with a steady 250 N.'
    },
    {
      title: 'Reading skid marks',
      q: 'After an accident, skid marks 32 m long are measured on a dry road ($\\mu_k = 0.70$) in a 50 km/h zone. How fast was the car going when it started to skid?',
      steps: [
        'Friction is the only horizontal force: $a = \\mu_k g = 0.70 \\times 9.81 = 6.87\\ \\mathrm{m/s^2}$.',
        'From $v^2 = 2 a d$: $v = \\sqrt{2 \\times 6.87 \\times 32} = 21.0\\ \\mathrm{m/s}$.',
        'That is $21.0 \\times 3.6 = 75\\ \\mathrm{km/h}$ — well over the limit, even before counting any speed lost in the impact at the end of the skid.'
      ],
      a: 'At least 21 m/s, about 75 km/h.'
    }
  ],
  quiz: [
    { q: 'A 10 kg box sits on a floor with μs = 0.4. You push it horizontally with 20 N and it does not move. The friction force is…', choices: ['0 N', '20 N', '39 N', '98 N'], a: 1,
      why: 'Static friction matches the push exactly: 20 N. Its maximum, μs N = 0.4 × 98 = 39 N, would only be reached if you pushed with 39 N.' },
    { q: 'Two identical cars, one heavily loaded, skid to a stop from the same speed on the same road. The loaded car\'s skid is…', choices: ['longer', 'shorter', 'the same length', 'impossible to predict'], a: 2,
      why: 'Friction and inertia both grow with mass, so the deceleration μk g — and the distance v²/(2μk g) — do not change.' },
    { q: 'When you walk forwards, the friction force from the ground on your foot points…', choices: ['backwards', 'forwards', 'upwards', 'nowhere: walking needs no friction'], a: 1,
      why: 'Your foot pushes backwards on the ground; static friction on the foot points forwards and drives you along.' },
    { q: 'Why do anti-lock brakes usually stop a car in a shorter distance than locked, skidding wheels?', choices: ['They make the car lighter', 'Rolling tyres grip with static friction, which is larger than kinetic', 'They increase the normal force', 'They reduce air resistance'], a: 1,
      why: 'A rolling tyre\'s contact patch does not slide, so it can use static friction, and μs > μk.' },
    { q: 'Turning a sliding brick from its large face onto its small end roughly halves the friction on it.', a: false,
      why: 'The load is the same, so to a good approximation the friction is the same: the real area of contact depends on the load, not on the apparent area.' }
  ],
  applications: [
    'Brakes, clutches and drive belts transmit force by friction.',
    'Tyre tread patterns clear water away to keep μ high on wet roads.',
    'Lubricating oil and grease lower friction and wear in engines and bearings.',
    'Climbing shoes, grip tape and gymnasts\' chalk are all designed to raise μ.'
  ],
  history: 'Leonardo da Vinci noted around 1500 that friction does not depend on the area of contact. Guillaume Amontons rediscovered the rules in 1699, and Charles-Augustin de Coulomb separated static from kinetic friction in 1781.',
  sim: 'mech1-incline'
},

{
  id: 'tension-pulleys', parent: 'dynamics', title: 'Tension and pulleys', level: 2,
  short: 'A taut string pulls along its length with a tension that, for a light string, is the same all the way along. Pulleys redirect it, and systems of pulleys trade force for distance.',
  keywords: ['tension', 'string', 'rope', 'cable', 'pulley', 'Atwood machine', 'block and tackle', 'mechanical advantage', 'connected objects', 'sagging cable'],
  prereq: ['newtons-second-law', 'free-body-diagrams', 'weight-mass'],
  related: ['newtons-third-law', 'work', 'static-equilibrium', 'moment-of-inertia', 'friction'],
  body: `
Pull on a rope and it pulls back: every short piece of a taut rope is stretched a tiny bit and pulls on its neighbours. The size of that pull is the **tension** $T$. At each end the rope pulls on whatever it is tied to, along its own direction and always **towards the rope** — ropes, strings and chains can pull but never push.

### The ideal string
In most problems the string is taken to be
- **massless** — then the tension is the same all along it (a massless piece with different pulls at its two ends would have an infinite acceleration);
- **inextensible** — so the objects tied to it move with the same speed and the same acceleration.

An ideal **pulley** — massless and frictionless — just changes the direction of a string without changing its tension. A real pulley with mass needs a turning force to spin it up, so the tension differs on its two sides (see [[moment-of-inertia]]).

### The Atwood machine
Two masses $m_1 < m_2$ hang on either side of a pulley. Treat each as a separate object with its own [[free-body-diagrams|free-body diagram]]. The heavier one accelerates down, the lighter one up, at the same rate $a$:

$$m_2 g - T = m_2 a, \\qquad T - m_1 g = m_1 a$$

Adding the two equations eliminates $T$:

$$a = \\frac{m_2 - m_1}{m_1 + m_2}\\, g, \\qquad T = \\frac{2 m_1 m_2}{m_1 + m_2}\\, g$$

Only the *difference* of the weights drives the motion, but the *total* mass has to be accelerated — so nearly equal masses give a small, easily timed acceleration. The tension lies between the two weights: less than $m_2 g$ (so $m_2$ can fall) and more than $m_1 g$ (so $m_1$ rises).

### A cart pulled by a hanging mass
A cart $m_1$ on a level table, tied over a pulley at the edge to a hanging mass $m_2$, accelerates at

$$a = \\frac{m_2 - \\mu_k m_1}{m_1 + m_2}\\, g$$

where $\\mu_k$ is the coefficient of kinetic friction under the cart — provided the hanging weight can overcome the friction at all.

### Pulleys that multiply force
In a block and tackle the load hangs from $n$ strands of one rope. Each strand carries the same tension, so holding (or slowly lifting) a weight $W$ needs only $T = W/n$. The price: to raise the load by 1 m you must pull $n$ metres of rope, so the [[work]] done is the same. Less force over more distance is the whole secret of every simple machine.

### Tension in a sagging rope
Hang a lamp of weight $W$ from the middle of a cable whose two halves each slope at an angle $\\theta$ below the horizontal. Vertically, $2T\\sin\\theta = W$, so

$$T = \\frac{W}{2\\sin\\theta}$$

The flatter the cable, the larger the tension: at $5°$ it is almost six times the weight. No real cable with a load on it can ever be pulled perfectly straight.
`,
  ideas: [
    'A string pulls along its own length, towards itself; it can never push.',
    'In a massless string the tension is the same everywhere; an ideal pulley only changes its direction.',
    'Connected objects share one acceleration: write F = ma for each, then eliminate the tension.',
    'In an Atwood machine a = (m₂ − m₁)g/(m₁ + m₂), and the tension lies between the two weights.',
    'Pulleys can trade force for distance, but never reduce the work done.'
  ],
  pitfalls: [
    'The tension equals the weight of the hanging mass — Only when nothing accelerates. If the mass accelerates downwards the tension is less than its weight; upwards, more.',
    'In a tug-of-war with each team pulling 500 N, the tension is 1000 N — The rope is pulled with 500 N at each end and its tension is 500 N, just as if one end were tied to a wall.',
    'A rope can hold a load while perfectly straight and horizontal — It must sag so that its tension has an upward part; the flatter the rope, the larger the tension needed.'
  ],
  formulas: [
    {
      name: 'Atwood machine: acceleration',
      expr: 'a = (m2 - m1)*g/(m1 + m2)', tex: 'a = \\frac{m_2 - m_1}{m_1 + m_2}\\, g',
      vars: {
        a: { name: 'acceleration (m₂ downwards positive)', q: 'accel', unit: 'm/s²', signed: true },
        m1: { name: 'mass on one side', q: 'mass', unit: 'kg', value: 3 },
        m2: { name: 'mass on the other side', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' }
      },
      stories: {
        a: 'An Atwood machine carries {m1} on one side and {m2} on the other. What is the acceleration of the masses?',
        m2: 'One side of an Atwood machine carries {m1}. What mass on the other side gives an acceleration of {a}?'
      }
    },
    {
      name: 'Atwood machine: tension',
      expr: 'T = 2*m1*m2*g/(m1 + m2)', tex: 'T = \\frac{2 m_1 m_2}{m_1 + m_2}\\, g',
      vars: {
        T: { name: 'tension in the string', q: 'force', unit: 'N' },
        m1: { name: 'mass on one side', q: 'mass', unit: 'kg', value: 3 },
        m2: { name: 'mass on the other side', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' }
      },
      stories: { T: 'Masses of {m1} and {m2} hang on either side of a light, frictionless pulley. What is the tension in the string while they move?' }
    },
    {
      name: 'Block and tackle: effort',
      expr: 'F = m*g/n', tex: 'F = \\frac{m g}{n}',
      vars: {
        F: { name: 'pull needed to hold or slowly lift the load', q: 'force', unit: 'N' },
        m: { name: 'mass of the load', q: 'mass', unit: 'kg', value: 120 },
        g: { const: 'g' },
        n: { name: 'number of rope strands supporting the load', q: 'count', value: 4, int: true }
      },
      note: 'Ideal, frictionless pulleys. To lift the load by $h$ you must pull $n h$ of rope.',
      stories: {
        F: 'A {m} engine is lifted with a block and tackle in which {n} strands of rope support the load. What pull is needed?',
        m: 'With a block and tackle of {n} supporting strands, a mechanic pulls with {F}. What is the heaviest load she can raise?'
      }
    },
    {
      name: 'Tension in a sagging cable',
      expr: 'T = m*g/(2*sin(theta))', tex: 'T = \\frac{m g}{2\\sin\\theta}',
      vars: {
        T: { name: 'tension in each half of the cable', q: 'force', unit: 'N' },
        m: { name: 'mass hung at the middle', q: 'mass', unit: 'kg', value: 15 },
        g: { const: 'g' },
        theta: { name: 'angle of each half below the horizontal', q: 'angle', unit: '°', value: 10, min: 0.5, max: 90 }
      },
      stories: {
        T: 'A {m} street lamp hangs from the middle of a cable whose two halves slope at {theta} below the horizontal. What is the tension in the cable?',
        theta: 'A cable that can safely carry {T} is to hold a {m} sign at its middle. How far below the horizontal must its halves slope, at least?'
      }
    }
  ],
  examples: [
    {
      title: 'An Atwood machine',
      q: 'Masses of 3.0 kg and 5.0 kg hang over a light, frictionless pulley and are released from rest. Find the acceleration, the tension, and the speed after the masses have moved 1.0 m.',
      steps: [
        '$a = \\dfrac{5.0 - 3.0}{8.0} \\times 9.81 = 2.45\\ \\mathrm{m/s^2}$.',
        '$T = \\dfrac{2 \\times 3.0 \\times 5.0}{8.0} \\times 9.81 = 36.8\\ \\mathrm{N}$ — between the weights, 29.4 N and 49.1 N.',
        'Check on the 5 kg mass: $49.1 - 36.8 = 12.3\\ \\mathrm{N} = 5.0 \\times 2.45$.',
        'After 1.0 m: $v = \\sqrt{2 a d} = \\sqrt{2 \\times 2.45 \\times 1.0} = 2.21\\ \\mathrm{m/s}$.'
      ],
      a: '2.45 m/s², 36.8 N, and 2.2 m/s after 1 m.'
    },
    {
      title: 'A cart pulled over the edge',
      q: 'A 3.0 kg cart on a table ($\\mu_k = 0.20$) is tied over a pulley at the edge to a hanging 1.0 kg mass. Find the acceleration and the tension.',
      steps: [
        'Driving force: the hanging weight, $1.0 \\times 9.81 = 9.81\\ \\mathrm{N}$. Friction on the cart: $0.20 \\times 3.0 \\times 9.81 = 5.89\\ \\mathrm{N}$.',
        'Whole system (4.0 kg): $a = (9.81 - 5.89)/4.0 = 0.98\\ \\mathrm{m/s^2}$.',
        'Hanging mass alone: $m_2 g - T = m_2 a$, so $T = 1.0(9.81 - 0.98) = 8.83\\ \\mathrm{N}$ — less than its weight, because it accelerates downwards.'
      ],
      a: '0.98 m/s², with 8.8 N of tension.'
    },
    {
      title: 'The street lamp',
      q: 'A 15 kg lamp hangs at the middle of a cable whose halves slope at 10° below the horizontal. Find the tension. What if the cable were tightened until the angle is 3°?',
      steps: [
        'Weight: $15 \\times 9.81 = 147\\ \\mathrm{N}$. Vertically, $2T\\sin\\theta = W$.',
        'At 10°: $T = 147/(2 \\times 0.174) = 424\\ \\mathrm{N}$, almost three times the lamp\'s weight.',
        'At 3°: $T = 147/(2 \\times 0.0523) = 1410\\ \\mathrm{N}$, nearly ten times the weight. Tightening the cable to reduce the sag multiplies the load on it.'
      ],
      a: '424 N at 10°; about 1.4 kN at 3°.'
    }
  ],
  quiz: [
    { q: 'In a tug-of-war, each team pulls on the rope with 800 N and nobody moves. The tension in the rope is…', choices: ['0 N', '800 N', '1600 N', '400 N'], a: 1,
      why: 'Each end is pulled with 800 N. A rope tied to a wall and pulled with 800 N has the same tension: 800 N.' },
    { q: 'A 2.0 kg mass hanging from a string is being accelerated upwards at 1.0 m/s². The tension is about…', choices: ['2.0 N', '17.6 N', '19.6 N', '21.6 N'], a: 3,
      why: 'T − mg = ma, so T = 2.0(9.8 + 1.0) = 21.6 N: more than the weight, because the net force must point up.' },
    { q: 'An Atwood machine carries 1.0 kg on one side and 1.1 kg on the other. The acceleration is roughly…', choices: ['9.8 m/s²', '4.9 m/s²', '0.47 m/s²', '0.098 m/s²'], a: 2,
      why: 'a = (1.1 − 1.0)(9.8)/2.1 = 0.47 m/s²: a small difference in weight drives a large total mass.' },
    { q: 'With a block and tackle that has four supporting strands, you can lift a 400 N load with 100 N — but you must pull four times as much rope as the load rises.', a: true,
      why: 'The force is divided by four and the distance multiplied by four: the work, force times distance, is unchanged.' }
  ],
  applications: [
    'Lifts hang the car and a counterweight on either side of a pulley — an Atwood machine in which the motor supplies only the difference.',
    'Cranes, sailing rigs and rescue systems use blocks and tackle to multiply force.',
    'Power lines and suspension bridges: the sag of a cable is chosen to keep its tension within the strength of the steel.'
  ],
  history: 'George Atwood described his machine in 1784 as a way to "dilute" gravity: with nearly equal masses the motion is slow enough to time with a pendulum clock, which let him test the laws of uniformly accelerated motion in the lecture room.',
  sim: 'mech1-atwood'
},

{
  id: 'inclined-plane', parent: 'dynamics', title: 'Inclined plane', level: 2,
  short: 'On a slope, the weight splits into mg sin θ down the slope and mg cos θ into it. That decides whether an object stays put, how fast it slides, and how hard it is to push up.',
  keywords: ['inclined plane', 'slope', 'ramp', 'incline', 'components of weight', 'angle of repose', 'critical angle', 'mg sin theta', 'simple machine'],
  prereq: ['free-body-diagrams', 'friction', 'math:right-triangle-trig'],
  related: ['normal-force', 'work', 'rolling-motion', 'constant-acceleration'],
  body: `
A slope is the simplest place to see forces act at an angle, and it has a long history: Galileo used gently inclined planes to "dilute" gravity, slowing falling motion down enough to time it with a water clock.

### Splitting the weight
On a slope of angle $\\theta$, tilt your axes to match: one along the slope, one perpendicular to it. The weight $mg$ points straight down, so it has two components ([[math:right-triangle-trig|right-triangle trigonometry]]):

$$\\text{along the slope: } mg\\sin\\theta, \\qquad \\text{into the slope: } mg\\cos\\theta$$

The angle between the weight and the perpendicular to the slope equals the slope angle $\\theta$ — a quick sketch of the two right angles shows why. Perpendicular to the slope nothing accelerates, so the [[normal-force|normal force]] balances the second component: $N = mg\\cos\\theta$. Along the slope, the first component pulls the object downhill. Check with the limits: on the level ($\\theta = 0$) nothing pulls along the surface, and on a vertical wall the whole weight does.

### Without friction
A frictionless block, a cart on good bearings or a skier on fast snow accelerates down the slope at

$$a = g\\sin\\theta$$

independent of its mass: zero on the level, $g$ on a vertical drop, $4.9\\ \\mathrm{m/s^2}$ on a 30° slope.

### With friction
If the block slides, kinetic [[friction]] $\\mu_k N = \\mu_k mg\\cos\\theta$ acts up the slope:

$$a = g(\\sin\\theta - \\mu_k\\cos\\theta)$$

If it is at rest, static friction holds it — as long as $mg\\sin\\theta \\le \\mu_s mg\\cos\\theta$, that is,

$$\\tan\\theta \\le \\mu_s$$

The steepest angle at which something stays put, $\\theta_c = \\arctan\\mu_s$, is the **angle of repose**. It is how engineers measure friction (tilt until it slips) and why piles of sand, gravel or grain all have a characteristic steepness — roughly 30–35° for dry sand.

### Pushing uphill
To push a crate up a slope at steady speed you must overcome both the component of the weight and friction, which now acts downhill:

$$F = mg(\\sin\\theta + \\mu_k\\cos\\theta)$$

With little friction this is much less than lifting it straight up. But you push over a longer distance: the ramp is a simple machine that trades force for distance, and the [[work]] you do is at least $mgh$ — more if there is friction.

> [!warn] Do not draw "the force down the slope" as a separate arrow. It *is* the component $mg\\sin\\theta$ of the weight; drawing both counts gravity twice.
`,
  ideas: [
    'Resolve the weight along and perpendicular to the slope: mg sin θ and mg cos θ.',
    'The normal force on a slope is mg cos θ, less than the weight.',
    'Without friction a slope gives a = g sin θ, whatever the mass.',
    'An object stays at rest as long as tan θ ≤ μs: the angle of repose is arctan μs.',
    'Sliding down with friction: a = g(sin θ − μk cos θ).'
  ],
  pitfalls: [
    'Using mg for the normal force on a slope — The surface only has to balance the perpendicular component, mg cos θ.',
    'Mixing up sin and cos — Check the limits: on the level (θ = 0) the component along the slope must vanish, so it is mg sin θ.',
    'Heavier objects slide down faster — The pull down the slope and the friction are both proportional to the mass, so the acceleration does not depend on it.'
  ],
  derivation: {
    title: 'Derive the acceleration down a rough slope',
    steps: [
      { text: 'Take x down the slope and y perpendicular to it, away from the surface. The weight has components', tex: 'W_x = mg\\sin\\theta, \\qquad W_y = -mg\\cos\\theta' },
      { text: 'Nothing accelerates perpendicular to the slope, so the normal force balances $W_y$:', tex: 'N - mg\\cos\\theta = 0 \\;\\Rightarrow\\; N = mg\\cos\\theta' },
      { text: 'While the block slides, kinetic friction $\\mu_k N$ acts up the slope. Newton\'s second law along x:', tex: 'mg\\sin\\theta - \\mu_k\\, mg\\cos\\theta = m a' },
      { text: 'The mass cancels:', tex: 'a = g\\,(\\sin\\theta - \\mu_k\\cos\\theta)' }
    ]
  },
  formulas: [
    {
      name: 'Sliding down a slope with friction',
      expr: 'a = g*(sin(theta) - mu*cos(theta))', tex: 'a = g\\,(\\sin\\theta - \\mu_k\\cos\\theta)',
      vars: {
        a: { name: 'acceleration down the slope', q: 'accel', unit: 'm/s²', signed: true },
        g: { const: 'g' },
        theta: { name: 'angle of the slope', q: 'angle', unit: '°', value: 25, min: 0, max: 90 },
        mu: { name: 'coefficient of kinetic friction', value: 0.08, tex: '\\mu_k' }
      },
      note: 'Set $\\mu_k = 0$ for a frictionless slope, $a = g\\sin\\theta$. A negative result means an object already sliding down slows down.',
      stories: {
        a: 'A skier glides down a {theta} slope; the coefficient of kinetic friction between skis and snow is {mu}. What is her acceleration?',
        theta: 'On what slope does a sledge with a coefficient of kinetic friction of {mu} accelerate at {a}?'
      }
    },
    {
      name: 'Angle at which a resting object starts to slip',
      expr: 'tan(theta) = mu', tex: '\\tan\\theta_c = \\mu_s', solveFor: 'theta',
      vars: {
        theta: { name: 'critical angle (angle of repose)', q: 'angle', unit: '°', min: 0, max: 89.9, tex: '\\theta_c' },
        mu: { name: 'coefficient of static friction', value: 0.6, tex: '\\mu_s' }
      },
      stories: {
        theta: 'A box lies on a plank that is slowly tilted. The coefficient of static friction is {mu}. At what angle does the box start to slide?',
        mu: 'A coin on a book starts to slide when the book is tilted to {theta}. What is the coefficient of static friction?'
      }
    },
    {
      name: 'Pushing up a slope at steady speed',
      expr: 'F = m*g*(sin(theta) + mu*cos(theta))', tex: 'F = m g\\,(\\sin\\theta + \\mu_k\\cos\\theta)',
      vars: {
        F: { name: 'push along the slope', q: 'force', unit: 'N' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 80 },
        g: { const: 'g' },
        theta: { name: 'angle of the slope', q: 'angle', unit: '°', value: 15, min: 0, max: 90 },
        mu: { name: 'coefficient of kinetic friction', value: 0.3, tex: '\\mu_k' }
      },
      stories: {
        F: 'What push, parallel to a {theta} ramp, moves a {m} crate up it at steady speed if the coefficient of kinetic friction is {mu}?',
        m: 'Pushing with {F} along a {theta} ramp (coefficient of kinetic friction {mu}) keeps a crate moving up at steady speed. What is its mass?'
      }
    }
  ],
  examples: [
    {
      title: 'A skier on a slope',
      q: 'A skier starts from rest on a 25° slope with $\\mu_k = 0.08$. Find her acceleration and her speed after 100 m, ignoring air resistance.',
      steps: [
        '$a = g(\\sin 25° - \\mu_k\\cos 25°) = 9.81(0.423 - 0.08 \\times 0.906) = 9.81 \\times 0.350 = 3.43\\ \\mathrm{m/s^2}$.',
        'From $v^2 = 2 a d$: $v = \\sqrt{2 \\times 3.43 \\times 100} = 26.2\\ \\mathrm{m/s}$, about 94 km/h.',
        'In reality air drag, growing as $v^2$, would hold her well below this — see [[drag-force|air resistance]].'
      ],
      a: '3.43 m/s², and about 26 m/s after 100 m (without air resistance).'
    },
    {
      title: 'Measuring friction by tilting',
      q: 'A book on a board starts to slide when the board is tilted to 22°. Find $\\mu_s$. If $\\mu_k = 0.30$, what is the book\'s acceleration once it slides at that angle?',
      steps: [
        'At the point of slipping $\\tan\\theta_c = \\mu_s$, so $\\mu_s = \\tan 22° = 0.40$.',
        'Sliding: $a = 9.81(\\sin 22° - 0.30\\cos 22°) = 9.81(0.375 - 0.278) = 0.95\\ \\mathrm{m/s^2}$.',
        'The acceleration is small but not zero: once static friction gives way, the smaller kinetic friction cannot hold the book.'
      ],
      a: 'μs = 0.40; then about 0.95 m/s².'
    },
    {
      title: 'The ramp as a machine',
      q: 'An 80 kg crate is pushed at steady speed up a ramp 4.0 m long, inclined at 15°, with $\\mu_k = 0.30$. Compare the push and the work with lifting the crate straight up.',
      steps: [
        'Push: $F = 80 \\times 9.81(\\sin 15° + 0.30\\cos 15°) = 785 \\times 0.549 = 431\\ \\mathrm{N}$ — about 55% of the 785 N needed to lift it.',
        'Work pushing: $431 \\times 4.0 = 1720\\ \\mathrm{J}$.',
        'The crate rises $4.0\\sin 15° = 1.04\\ \\mathrm{m}$, gaining $mgh = 785 \\times 1.04 = 813\\ \\mathrm{J}$ of potential energy.',
        'The other $910\\ \\mathrm{J}$ went into friction, as heat. The ramp halved the force, but with this much friction it roughly doubled the work.'
      ],
      a: '431 N instead of 785 N, but 1720 J of work instead of 813 J.'
    }
  ],
  quiz: [
    { q: 'A frictionless ramp is made steeper. The acceleration of a cart rolling freely down it…', choices: ['stays the same', 'increases, up to g for a vertical drop', 'decreases', 'depends on the cart\'s mass'], a: 1,
      why: 'a = g sin θ grows with the angle, reaching g at 90°.' },
    { q: 'A box rests without slipping on a 20° slope. The friction force on it is…', choices: ['zero', 'μs mg cos 20°', 'mg sin 20°, up the slope', 'mg, up the slope'], a: 2,
      why: 'Static friction balances the component of the weight along the slope, and no more: mg sin 20°.' },
    { q: 'A heavy block and a light block of the same material slide down the same rough slope. The heavy one…', choices: ['accelerates faster', 'accelerates more slowly', 'accelerates at the same rate', 'does not move'], a: 2,
      why: 'a = g(sin θ − μk cos θ) contains no mass: friction and the pull down the slope both scale with m.' },
    { q: 'Dry sand heaps up to a slope of about 34°. Roughly what is the coefficient of static friction between the grains?', choices: ['0.34', '0.56', '0.67', '1.5'], a: 2,
      why: 'At the angle of repose tan θ = μs, and tan 34° ≈ 0.67.' },
    { q: 'On a slope, the normal force on an object is smaller than its weight.', a: true,
      why: 'N = mg cos θ, which is less than mg for any angle above zero.' }
  ],
  applications: [
    'Wheelchair ramps, loading ramps and road gradients are limited so that the push needed — and the risk of running away — stays small.',
    'Tilt tests measure the slip resistance of shoe soles, floor tiles and tyres.',
    'Landslides and avalanches start when rain or fresh snow pushes a slope beyond its angle of repose.',
    'Wedges, screws and ramps are all inclined planes that trade force for distance.'
  ],
  sim: 'mech1-incline'
},

{
  id: 'centripetal-force', parent: 'dynamics', title: 'Centripetal force', level: 2,
  short: 'The net inward force, mv²/r, that any object needs to move in a circle. It is not a new force but a job done by tension, friction, gravity or the normal force.',
  keywords: ['centripetal force', 'mv^2/r', 'circular motion', 'banked curve', 'banking angle', 'vertical loop', 'cornering', 'centrifugal force', 'fictitious force'],
  prereq: ['uniform-circular-motion', 'newtons-second-law', 'free-body-diagrams'],
  related: ['circular-orbits', 'friction', 'normal-force', 'charged-particle-motion', 'relative-velocity'],
  body: `
An object moving round a circle at speed $v$ is accelerating towards the centre at $v^2/r$ ([[uniform-circular-motion|uniform circular motion]]). By [[newtons-second-law|Newton's second law]], something must supply a net inward force

$$F_c = \\frac{m v^2}{r} = m\\omega^2 r$$

This **centripetal force** is not a new kind of force. It is the name of a *job* — the inward net force that circular motion requires — and some real force, or combination of forces, has to do it:

| Motion | What provides the inward force |
|---|---|
| Stone whirled on a string | tension in the string |
| Car on a flat bend | sideways static friction on the tyres |
| Moon, satellites, planets | gravity |
| Electron in a magnetic field | the magnetic force |
| Rider at the bottom of a loop | normal force minus weight |
| Cyclist or aircraft leaning into a turn | the tilted push of the road, or the tilted lift |

When the available force falls short, the object cannot follow the circle and moves outwards relative to the curve, on a straighter path: the car slides off the bend, the mud flies off the tyre.

### Cornering on a flat road
Only friction can push a car sideways. The most it can give is $\\mu_s mg$, so the fastest speed round a flat bend of radius $r$ is

$$v_{\\max} = \\sqrt{\\mu_s g r}$$

— independent of the car's mass. On dry asphalt ($\\mu_s \\approx 0.9$) a 50 m bend allows about 21 m/s (76 km/h); on ice ($\\mu_s \\approx 0.1$) only 7 m/s.

### Banked curves
Tilt the road inwards at an angle $\\theta$ and the normal force leans towards the centre. At the **design speed**, the horizontal part of the normal force alone provides the centripetal force and no sideways friction is needed:

$$\\tan\\theta = \\frac{v^2}{r g}$$

Velodromes, racing ovals and motorway slip roads are banked this way, and aircraft bank to turn for the same reason, tilting their lift.

### Vertical circles
At the top of a roller-coaster loop both the weight and the push of the track point down, towards the centre: $N + mg = mv^2/r$. The slowest speed at which the car still presses on the track makes $N = 0$:

$$v_{\\min} = \\sqrt{g r}$$

Any slower, and gravity alone would pull the car inwards more than the circle needs — without wheels locked under the rail it would fall away. The same condition keeps the water in a bucket swung over your head.

### "Centrifugal force"
In a turning car you feel pushed outwards. Seen from the road — an inertial frame — there is no outward force: your body tends to carry straight on, and the door pushes you inwards to make you turn. In the rotating frame of the car it is convenient to *pretend* that an outward centrifugal force $mv^2/r$ acts. It is a fictitious force, created by using an accelerating frame, and it never appears on a free-body diagram drawn in an inertial frame.
`,
  ideas: [
    'Circular motion needs a net inward force, F = mv²/r = mω²r.',
    'The centripetal force is a role played by real forces: tension, friction, gravity, the normal force or a magnetic force.',
    'On a flat bend $v_{\\max} = \\sqrt{\\mu_s g r}$, independent of the mass.',
    'A banked curve lets the normal force supply the inward push: tan θ = v²/(rg) at the design speed.',
    'The outward "centrifugal force" exists only in a rotating frame; in an inertial frame there is none.'
  ],
  pitfalls: [
    'Adding a centripetal force to the free-body diagram — It is the net inward part of the forces already drawn, not an extra one.',
    'Objects moving in a circle are pulled outwards — In an inertial frame the net force points inwards. The outward feeling is your inertia resisting the turn.',
    'When the string breaks, the object flies straight outwards — It leaves along the tangent, in the direction it was moving at that instant.'
  ],
  formulas: [
    {
      name: 'Centripetal force',
      expr: 'F = m*v^2/r', tex: 'F_c = \\frac{m v^2}{r}',
      vars: {
        F: { name: 'inward net force needed', q: 'force', unit: 'N', tex: 'F_c' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1200 },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 20 },
        r: { name: 'radius of the circle', q: 'length', unit: 'm', value: 50 }
      },
      stories: {
        F: 'A {m} car rounds a bend of radius {r} at {v}. How large a sideways friction force must its tyres provide?',
        v: 'A string can hold at most {F}. How fast can it whirl a {m} ball in a circle of radius {r}?'
      }
    },
    {
      name: 'Fastest speed round a flat bend',
      expr: 'v = sqrt(mu*g*r)', tex: 'v_{\\max} = \\sqrt{\\mu_s g r}',
      vars: {
        v: { name: 'greatest speed without skidding', q: 'speed', unit: 'km/h', tex: 'v_{\\max}' },
        mu: { name: 'coefficient of static friction', value: 0.9, tex: '\\mu_s' },
        g: { const: 'g' },
        r: { name: 'radius of the bend', q: 'length', unit: 'm', value: 50 }
      },
      stories: {
        v: 'How fast can a car take a flat bend of radius {r} if the coefficient of static friction is {mu}?',
        r: 'On an icy road with a coefficient of static friction of {mu}, what is the tightest bend a car can take at {v}?'
      }
    },
    {
      name: 'Banking angle for a design speed',
      expr: 'tan(theta) = v^2/(r*g)', tex: '\\tan\\theta = \\frac{v^2}{r g}', solveFor: 'theta',
      vars: {
        theta: { name: 'banking angle', q: 'angle', unit: '°', min: 0, max: 89 },
        v: { name: 'design speed', q: 'speed', unit: 'km/h', value: 90 },
        r: { name: 'radius of the curve', q: 'length', unit: 'm', value: 200 },
        g: { const: 'g' }
      },
      note: 'At exactly this speed no sideways friction is needed.',
      stories: {
        theta: 'A motorway slip road of radius {r} is designed for {v}. At what angle should it be banked?',
        v: 'A velodrome bend of radius {r} is banked at {theta}. At what speed does a cyclist need no sideways grip at all?'
      }
    },
    {
      name: 'Slowest speed over the top of a vertical loop',
      expr: 'v = sqrt(g*r)', tex: 'v_{\\min} = \\sqrt{g r}',
      vars: {
        v: { name: 'minimum speed at the top', q: 'speed', unit: 'm/s', tex: 'v_{\\min}' },
        g: { const: 'g' },
        r: { name: 'radius of the loop', q: 'length', unit: 'm', value: 10 }
      },
      stories: {
        v: 'What is the slowest a roller-coaster car can pass the top of a loop of radius {r} and still press on the track?',
        r: 'A bucket of water passes the top of a vertical circle at {v}. What is the largest radius for which the water stays in?'
      }
    }
  ],
  examples: [
    {
      title: 'Grip on a bend',
      q: 'A 1200 kg car takes a flat bend of radius 50 m at 20 m/s. What sideways force must the tyres supply, and what coefficient of friction does that need? What is the safe speed on a wet road with $\\mu_s = 0.6$?',
      steps: [
        '$F = m v^2/r = 1200 \\times 400/50 = 9600\\ \\mathrm{N}$.',
        'This must come from friction, at most $\\mu_s mg$: $\\mu_s \\ge 9600/(1200 \\times 9.81) = 0.82$. Fine on dry asphalt (about 0.9), not on a wet road.',
        'Wet: $v_{\\max} = \\sqrt{0.6 \\times 9.81 \\times 50} = 17.2\\ \\mathrm{m/s}$, about 62 km/h.'
      ],
      a: '9.6 kN, needing μs ≥ 0.82; on the wet road no more than about 62 km/h.'
    },
    {
      title: 'Banking a velodrome',
      q: 'A velodrome bend has a radius of 25 m and is designed for 60 km/h. What banking angle lets riders round it with no sideways friction?',
      steps: [
        '$60\\ \\mathrm{km/h} = 16.7\\ \\mathrm{m/s}$.',
        '$\\tan\\theta = v^2/(r g) = 16.7^2/(25 \\times 9.81) = 278/245 = 1.13$.',
        '$\\theta = 48.6°$ — which is why velodrome bends look like walls.'
      ],
      a: 'About 49°.'
    },
    {
      title: 'Over the top of the loop',
      q: 'A roller-coaster loop has a radius of 10 m. What is the slowest speed at the top? If a 500 kg car passes the top at 14 m/s, how hard does the track push on it?',
      steps: [
        '$v_{\\min} = \\sqrt{g r} = \\sqrt{9.81 \\times 10} = 9.9\\ \\mathrm{m/s}$.',
        'At 14 m/s the car needs an inward force $m v^2/r = 500 \\times 196/10 = 9800\\ \\mathrm{N}$.',
        'Gravity supplies $mg = 4905\\ \\mathrm{N}$ of it; the track pushes down (inwards) with the rest, $N = 9800 - 4905 = 4895\\ \\mathrm{N}$ — about one car\'s weight.'
      ],
      a: 'At least 9.9 m/s; at 14 m/s the track pushes with about 4.9 kN.'
    }
  ],
  quiz: [
    { q: 'What provides the centripetal force for a car turning on a flat road?', choices: ['The engine', 'Sideways friction between the tyres and the road', 'The car\'s weight', 'Centrifugal force'], a: 1,
      why: 'Only the road can push the car sideways, through static friction on the tyres.' },
    { q: 'A stone on a string is whirled in a horizontal circle. The string breaks. The stone moves off…', choices: ['along the tangent to the circle', 'straight away from the centre', 'along a spiral', 'towards the centre'], a: 0,
      why: 'With the tension gone, the stone keeps the velocity it had at that instant, which was along the tangent.' },
    { q: 'On the same flat bend and road, a heavily loaded van\'s maximum cornering speed compared with the empty van\'s is…', choices: ['higher', 'lower', 'the same', 'zero'], a: 2,
      why: 'The friction available (μmg) and the force needed (mv²/r) both scale with m, so $v_{\\max} = \\sqrt{\\mu_s g r}$ does not depend on the mass. (A high load does make a van more likely to roll over.)' },
    { q: 'At the top of a vertical loop, a roller-coaster car moving faster than √(gr) needs the track to push down on it.', a: true,
      why: 'Gravity alone gives mg of inward force; a faster car needs more, mv²/r, and the track supplies the rest by pushing down — towards the centre.' },
    { q: 'The Moon stays in its orbit because the centripetal force balances the Earth\'s gravity on it.', a: false,
      why: 'Gravity *is* the centripetal force; nothing balances it. Its unbalanced inward pull is exactly what keeps bending the Moon\'s path into a circle.' }
  ],
  applications: [
    'Road design: bend radii, banking and speed limits are set from mv²/r and the grip of wet tyres.',
    'Spin dryers and salad spinners: the drum cannot pull the water inwards, so it escapes through the holes.',
    'Particle accelerators and mass spectrometers bend charged particles into circles with magnetic forces.',
    'Satellites and planets: gravity supplies exactly mv²/r for a circular orbit.'
  ],
  sim: 'mech1-circular'
},

{
  id: 'drag-force', parent: 'dynamics', title: 'Air resistance and terminal velocity', level: 2,
  short: 'Moving through air or water costs a drag force that grows roughly as the square of the speed. A falling object speeds up until drag equals its weight, then falls at its terminal velocity.',
  keywords: ['air resistance', 'drag', 'drag coefficient', 'terminal velocity', 'terminal speed', 'skydiver', 'parachute', 'Stokes law', 'viscous drag', 'streamlining', 'Reynolds number'],
  prereq: ['newtons-second-law', 'free-fall', 'weight-mass'],
  related: ['viscosity', 'projectile-motion', 'friction', 'power', 'density'],
  body: `
Anything moving through air or water has to shove the fluid out of its way, and the fluid pushes back. This **drag** points against the velocity relative to the fluid and grows quickly with speed. It is why a feather drifts, why cyclists crouch, and why raindrops do not arrive at the speed of bullets.

### Quadratic drag
For everyday objects at everyday speeds — balls, cars, people, raindrops — the drag is close to

$$F_D = \\tfrac12\\,\\rho\\,C_d\\,A\\,v^2$$

where $\\rho$ is the [[density]] of the fluid (about 1.2 kg/m³ for air at sea level, 1000 kg/m³ for water), $A$ the frontal area, $v$ the speed through the fluid, and $C_d$ the **drag coefficient**, a number that captures the shape: about 0.05 for a teardrop, 0.3 for a modern car, 0.47 for a ball, about 1 for an upright cyclist or a flat plate, and around 1.3 for an open parachute. Double the speed and the drag quadruples; the [[power]] needed to push through the air, $F_D v$, rises eightfold — which is why fuel use climbs so steeply above motorway speeds.

### Terminal velocity
Drop something. At first it is slow, the drag is tiny, and it falls with acceleration $g$. As it speeds up the drag grows, the net force $mg - F_D$ shrinks, and so does the acceleration. When the drag equals the weight, the net force is zero and the speed stops changing: the object has reached its **terminal velocity**

$$v_t = \\sqrt{\\frac{2 m g}{\\rho\\, C_d\\, A}}$$

| Falling object | Terminal velocity |
|---|---|
| Raindrop, 4 mm across | about 9 m/s |
| Table-tennis ball | about 8 m/s |
| Skydiver, spread flat | about 55 m/s (200 km/h) |
| Skydiver, diving head down | about 75 m/s (270 km/h) |
| Skydiver under an open parachute | about 5–6 m/s |

Starting from rest, the speed under quadratic drag follows $v(t) = v_t\\tanh(g t/v_t)$: it reaches 76% of $v_t$ after one "time constant" $v_t/g$ and 96% after two.

### Why big things fall faster
For objects of the same shape and material, the mass grows as the cube of the size but the area only as the square. So $m/A$, and with it $v_t \\propto \\sqrt{m/A}$, grows with size. J. B. S. Haldane pointed out in 1926 that a mouse dropped down a deep mine shaft lands at a gentle speed and walks away, while a larger animal is killed. A steel ball outruns a wooden one of the same size for the same reason.

### Small and slow: viscous drag
For very small or very slow objects — dust, pollen, bacteria, cloud droplets, a bead sinking in honey — the fluid's [[viscosity]] dominates and the drag is proportional to the speed itself. For a sphere of radius $r$ this is **Stokes' law**, $F = 6\\pi\\eta r v$, where $\\eta$ is the viscosity. Terminal velocities are then tiny — about a centimetre per second for a cloud droplet — which is why clouds float and fine dust hangs in the air for hours. Which kind of drag applies is decided by a dimensionless ratio, the Reynolds number $\\rho v L/\\eta$: well below 1 for Stokes drag, above about 1000 for quadratic drag.
`,
  ideas: [
    'Drag opposes motion through a fluid and grows with speed, roughly as v² for everyday objects.',
    '$F_D = \\tfrac12 \\rho C_d A v^2$: the density of the fluid, the shape, the frontal area and the speed all matter.',
    'A falling object speeds up until drag equals its weight, then falls at a constant terminal velocity.',
    'Terminal velocity grows as √(m/A), so large, dense objects fall faster than small, light ones.',
    'Very small or slow objects feel viscous drag proportional to v (Stokes\' law).'
  ],
  pitfalls: [
    'At terminal velocity gravity has stopped acting — Gravity is unchanged; the drag has grown to balance it, so the net force is zero.',
    'Heavier objects always fall faster — Only when air resistance matters, and then because of the ratio of weight to drag. In a vacuum everything falls together.',
    'Drag doubles when the speed doubles — For quadratic drag it quadruples. Only in the slow, viscous regime is drag proportional to speed.'
  ],
  formulas: [
    {
      name: 'Quadratic drag',
      expr: 'F = 0.5*rho*Cd*A*v^2', tex: 'F_D = \\tfrac12\\,\\rho\\,C_d\\,A\\,v^2',
      vars: {
        F: { name: 'drag force', q: 'force', unit: 'N', tex: 'F_D' },
        rho: { name: 'density of the fluid', q: 'density', unit: 'kg/m³', value: 1.2 },
        Cd: { name: 'drag coefficient', value: 0.3, tex: 'C_d' },
        A: { name: 'frontal area', q: 'area', unit: 'm²', value: 2.2 },
        v: { name: 'speed through the fluid', q: 'speed', unit: 'km/h', value: 120 }
      },
      stories: {
        F: 'A car with a drag coefficient of {Cd} and a frontal area of {A} drives at {v} through air of density {rho}. What is the drag force?',
        v: 'At what speed does a car with a drag coefficient of {Cd} and a frontal area of {A} meet {F} of drag (air density {rho})?'
      }
    },
    {
      name: 'Terminal velocity',
      expr: 'vt = sqrt(2*m*g/(rho*Cd*A))', tex: 'v_t = \\sqrt{\\frac{2 m g}{\\rho\\, C_d\\, A}}',
      vars: {
        vt: { name: 'terminal velocity', q: 'speed', unit: 'm/s', tex: 'v_t' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 80 },
        g: { const: 'g' },
        rho: { name: 'density of the air', q: 'density', unit: 'kg/m³', value: 1.2 },
        Cd: { name: 'drag coefficient', value: 0.8, tex: 'C_d' },
        A: { name: 'frontal area', q: 'area', unit: 'm²', value: 0.55 }
      },
      stories: {
        vt: 'A {m} skydiver falls spread-eagled with a frontal area of {A} and a drag coefficient of {Cd}. What is her terminal velocity in air of density {rho}?',
        A: 'What area must a parachute with a drag coefficient of {Cd} have to bring a {m} load down at only {vt} (air density {rho})?'
      }
    },
    {
      name: 'Speed while falling from rest (quadratic drag)',
      expr: 'v = vt*tanh(g*t/vt)', tex: 'v = v_t\\tanh\\frac{g\\,t}{v_t}',
      vars: {
        v: { name: 'speed after a time t', q: 'speed', unit: 'm/s' },
        vt: { name: 'terminal velocity', q: 'speed', unit: 'm/s', value: 54.5, tex: 'v_t' },
        g: { const: 'g' },
        t: { name: 'time since release', q: 'time', unit: 's', value: 5 }
      },
      note: 'Time to reach 90% of $v_t$: $t = 1.47\\,v_t/g$.',
      stories: {
        v: 'A skydiver with a terminal velocity of {vt} steps out of a hovering helicopter. How fast is she falling after {t}?',
        t: 'A skydiver\'s terminal velocity is {vt}. How long after jumping does she reach {v}?'
      }
    },
    {
      name: 'Stokes\' law for small, slow spheres',
      expr: 'F = 6*pi*eta*r*v', tex: 'F = 6\\pi\\eta r v',
      vars: {
        F: { name: 'viscous drag force', q: 'force', unit: 'N' },
        eta: { name: 'viscosity of the fluid', q: 'viscosity', unit: 'Pa·s', value: 1.8e-5 },
        r: { name: 'radius of the sphere', q: 'length', unit: 'µm', value: 10 },
        v: { name: 'speed', q: 'speed', unit: 'cm/s', value: 1.2 }
      },
      note: 'Valid when the Reynolds number is well below 1. Viscosity of air $1.8\\times10^{-5}\\ \\mathrm{Pa\\,s}$, of water $1.0\\times10^{-3}\\ \\mathrm{Pa\\,s}$.',
      stories: {
        F: 'A cloud droplet of radius {r} falls at {v} through air of viscosity {eta}. What is the drag on it?',
        v: 'A drag of {F} acts on a sphere of radius {r} moving through a fluid of viscosity {eta}. How fast is it going?'
      }
    }
  ],
  examples: [
    {
      title: 'Skydiver and parachute',
      q: 'An 80 kg skydiver falls spread-eagled ($C_d = 0.8$, $A = 0.55\\ \\mathrm{m^2}$) in air of density 1.2 kg/m³. Find her terminal velocity. She then opens a canopy with $C_d = 1.3$ and $A = 30\\ \\mathrm{m^2}$: what is the new terminal velocity?',
      steps: [
        'Free fall: $v_t = \\sqrt{\\dfrac{2 \\times 80 \\times 9.81}{1.2 \\times 0.8 \\times 0.55}} = \\sqrt{\\dfrac{1570}{0.528}} = 54.5\\ \\mathrm{m/s}$, about 196 km/h.',
        'Under the canopy: $v_t = \\sqrt{\\dfrac{1570}{1.2 \\times 1.3 \\times 30}} = \\sqrt{33.5} = 5.8\\ \\mathrm{m/s}$.',
        'Landing at 5.8 m/s is like jumping off a wall $v^2/2g = 1.7\\ \\mathrm{m}$ high — hence the rolling landing skydivers are taught.'
      ],
      a: '54.5 m/s in free fall; 5.8 m/s under the parachute.'
    },
    {
      title: 'How long to reach terminal velocity?',
      q: 'For the skydiver above ($v_t = 54.5\\ \\mathrm{m/s}$), how long does it take to reach 90% of terminal velocity, and how far has she fallen by then?',
      steps: [
        'From $v = v_t\\tanh(g t/v_t)$ with $v/v_t = 0.9$: $g t/v_t = \\operatorname{artanh} 0.9 = 1.47$.',
        '$t = 1.47 \\times 54.5/9.81 = 8.2\\ \\mathrm{s}$.',
        'Integrating the speed gives the distance $y = \\dfrac{v_t^2}{g}\\ln\\cosh\\dfrac{g t}{v_t} = \\dfrac{54.5^2}{9.81}\\ln\\cosh 1.47 = 303 \\times 0.83 = 250\\ \\mathrm{m}$.',
        'Without air she would have fallen $\\tfrac12 g t^2 = 330\\ \\mathrm{m}$ in that time and be doing 80 m/s.'
      ],
      a: 'About 8 s and 250 m.'
    },
    {
      title: 'Why fuel use climbs at speed',
      q: 'A car has $C_d = 0.30$ and a frontal area of 2.2 m². Compare the air drag and the power needed to overcome it at 90 km/h and at 130 km/h (air density 1.2 kg/m³).',
      steps: [
        '$\\tfrac12\\rho C_d A = 0.5 \\times 1.2 \\times 0.30 \\times 2.2 = 0.396\\ \\mathrm{kg/m}$.',
        '90 km/h = 25.0 m/s: $F = 0.396 \\times 25.0^2 = 248\\ \\mathrm{N}$, power $F v = 6.2\\ \\mathrm{kW}$.',
        '130 km/h = 36.1 m/s: $F = 0.396 \\times 36.1^2 = 516\\ \\mathrm{N}$, power $18.6\\ \\mathrm{kW}$.',
        'Going 44% faster doubles the drag and triples the power needed to push through the air.'
      ],
      a: '248 N and 6.2 kW at 90 km/h; 516 N and 18.6 kW at 130 km/h.'
    }
  ],
  quiz: [
    { q: 'A skydiver falls at a steady terminal velocity. The net force on her is…', choices: ['equal to her weight, downwards', 'zero', 'equal to the drag, upwards', 'slightly upwards'], a: 1,
      why: 'Constant velocity means zero acceleration and zero net force: the drag has grown to equal her weight.' },
    { q: 'A car doubles its speed. The air drag on it becomes about…', choices: ['the same', 'twice as large', 'four times as large', 'eight times as large'], a: 2,
      why: 'Quadratic drag grows as v². (The power needed to overcome it, F·v, grows eight times.)' },
    { q: 'Two balls of the same size, one steel and one wood, are dropped together from a tall tower. Which lands first?', choices: ['The wooden ball', 'The steel ball', 'They land together', 'It depends on their colour'], a: 1,
      why: 'Same size and shape give the same drag at a given speed, but the steel ball is much heavier, so drag holds it back proportionally less: its terminal velocity is higher.' },
    { q: 'If a falling object had four times the mass with the same size and shape, its terminal velocity would be…', choices: ['the same', 'twice as large', 'four times as large', 'sixteen times as large'], a: 1,
      why: '$v_t$ grows as $\\sqrt{m}$, and $\\sqrt{4} = 2$.' },
    { q: 'Just after a skydiver opens her parachute, her acceleration points upwards.', a: true,
      why: 'The drag suddenly exceeds her weight, so the net force — and the acceleration — point up while she slows to the new, lower terminal velocity.' }
  ],
  applications: [
    'Vehicle design: streamlining lowers $C_d$ and saves fuel, above all at motorway speeds.',
    'Parachutes slow skydivers, cargo drops, drag-racing cars and landing spacecraft.',
    'Sport: cyclists crouch and ride in each other\'s slipstream, skiers tuck, swimmers wear smooth suits.',
    'Stokes drag governs sedimentation, cloud and fog droplets, and Millikan\'s oil-drop measurement of the electron\'s charge.'
  ],
  history: 'Newton worked out that the resistance of air grows with the square of the speed, and in 1710 glass globes were dropped from the dome of St Paul\'s Cathedral in London to test his theory. George Gabriel Stokes derived his law for slow, viscous flow past a sphere in 1851.',
  sim: 'mech1-terminal-velocity'
}

);
