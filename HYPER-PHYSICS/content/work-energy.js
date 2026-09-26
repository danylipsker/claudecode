/* HYPER-PHYSICS · content/work-energy.js — work and energy: work, kinetic energy, the
 * work–energy theorem, gravitational and elastic potential energy, conservative forces,
 * conservation of energy, power and efficiency. */
Hyper.add(

{
  id: 'work', parent: 'work-energy', title: 'Work', level: 1,
  short: 'A force does work when the object it acts on moves: W = Fd cos θ. Work is the energy the force transfers.',
  keywords: ['work', 'joule', 'W = Fd', 'force times distance', 'dot product', 'negative work', 'area under force-distance graph', 'energy transfer'],
  prereq: ['force', 'position-displacement', 'math:dot-product'],
  related: ['work-energy-theorem', 'power', 'kinetic-energy', 'conservative-forces', 'math:line-integrals'],
  body: `
In everyday speech, holding a heavy suitcase for an hour is hard work. In physics it is no work at all: nothing moved. **Work** is what a force does when the object it acts on moves, and it measures the energy the force transfers:

$$W = F\\,d\\cos\\theta$$

Here $F$ is the size of the force, $d$ the displacement of the object and $\\theta$ the angle between them. Only the part of the force along the motion, $F\\cos\\theta$, does work. The unit is the **joule**: $1\\ \\mathrm{J} = 1\\ \\mathrm{N\\,m}$, the work done by a 1 N force pushing something 1 m along its own direction. Lifting an apple (about 1 N) onto a table (about 1 m) takes roughly a joule.

### The sign of work
- $\\theta < 90°$: **positive** work. The force helps the motion and gives the object energy — a hand pushing a trolley, gravity on a falling ball.
- $\\theta = 90°$: **zero** work. A force at right angles to the motion only turns it: the normal force on a car on a level road, the tension of a string whirling a ball in a circle, gravity on a satellite in a circular orbit.
- $\\theta > 90°$: **negative** work. The force opposes the motion and takes energy away — friction on a sliding box, brakes, gravity on a ball thrown upwards.

### Work as a dot product
Force and displacement are vectors, and "size times size times the cosine of the angle between them" is their [[math:dot-product|dot product]]: $W = \\vec F \\cdot \\vec d = F_x d_x + F_y d_y + F_z d_z$. Work itself is a scalar — it has a sign, but no direction.

### Forces that vary
If the force changes as the object moves, add up the work over small steps. On a graph of force against position, **the work is the area under the curve**:

$$W = \\int_{x_1}^{x_2} F(x)\\,dx$$

and along a curved path it becomes a [[math:line-integrals|line integral]]. For a spring, whose force grows in proportion to the stretch, the area is a triangle, $\\tfrac12 k x^2$ — the [[elastic-potential-energy|elastic potential energy]].

### Net work
When several forces act, each does its own work, and their sum is the **net work** — equal to the work done by the net force. It is the net work that changes an object's speed: the [[work-energy-theorem|work–energy theorem]].

> [!tip] Muscles tire even when they do no mechanical work. Holding a load still, muscle fibres keep contracting and relaxing, using chemical energy that ends up as heat. A table holds the same load for ever without effort.
`,
  ideas: [
    'A force does work when the object it acts on moves: W = Fd cos θ.',
    'Only the component of the force along the displacement does work.',
    'Work can be positive (energy given), zero (force at right angles to the motion) or negative (energy taken away).',
    'For a varying force, the work is the area under the force–position graph.',
    'The joule is the unit of work and of energy: 1 J = 1 N·m.'
  ],
  pitfalls: [
    'Holding a heavy load still is work — No displacement, no work, however tiring. The effort is spent inside your muscles, not on the load.',
    'Every force on a moving object does work — A force at right angles to the motion does none: the normal force on a level road, the tension on a whirled ball.',
    'Work is a vector — It is a scalar. It has a sign, set by whether the force helps or opposes the motion, but no direction.'
  ],
  formulas: [
    {
      name: 'Work done by a constant force',
      expr: 'W = F*d*cos(theta)', tex: 'W = F d\\cos\\theta',
      vars: {
        W: { name: 'work done', q: 'energy', unit: 'J', signed: true },
        F: { name: 'force', q: 'force', unit: 'N', value: 50 },
        d: { name: 'displacement', q: 'length', unit: 'm', value: 30 },
        theta: { name: 'angle between the force and the displacement', q: 'angle', unit: '°', value: 35, min: 0, max: 180 }
      },
      stories: {
        W: 'You pull a suitcase {d} through an airport with {F} along a handle at {theta} to the floor. How much work do you do?',
        F: 'A tow rope at {theta} to the road does {W} of work pulling a car {d}. What is the tension in the rope?',
        theta: 'A force of {F} does {W} of work while its object moves {d}. At what angle to the motion does it act?'
      }
    },
    {
      name: 'Work done by friction on a level floor',
      expr: 'W = -mu*m*g*d', tex: 'W_f = -\\mu_k m g d',
      vars: {
        W: { name: 'work done by friction', q: 'energy', unit: 'J', tex: 'W_f', signed: true },
        mu: { name: 'coefficient of kinetic friction', value: 0.3, tex: '\\mu_k' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 40 },
        g: { const: 'g' },
        d: { name: 'distance slid', q: 'length', unit: 'm', value: 5 }
      },
      note: 'Always negative: kinetic friction takes energy from the sliding object and turns it into heat.',
      stories: {
        W: 'A {m} crate slides {d} across a floor where the coefficient of kinetic friction is {mu}. How much work does friction do on it?',
        d: 'Friction does {W} of work on a {m} crate sliding on a floor with a coefficient of kinetic friction of {mu}. How far did it slide?'
      }
    }
  ],
  examples: [
    {
      title: 'Pulling a suitcase',
      q: 'You pull a suitcase 30 m at steady speed with 50 N along a handle at 35° to the floor. How much work do you do, and how much does friction do?',
      steps: [
        'Your work: $W = F d\\cos\\theta = 50 \\times 30 \\times \\cos 35° = 1229\\ \\mathrm{J}$.',
        'Only the horizontal part of your pull, $50\\cos 35° = 41.0\\ \\mathrm{N}$, does work. The vertical part, $28.7\\ \\mathrm{N}$, is at right angles to the motion and does none.',
        'Steady speed means zero net force along the floor, so friction on the wheels is 41.0 N backwards, and its work is $-41.0 \\times 30 = -1229\\ \\mathrm{J}$.',
        'Net work: zero — consistent with the unchanged speed.'
      ],
      a: 'You do +1229 J; friction does −1229 J.'
    },
    {
      title: 'Up, across and down',
      q: 'A 12 kg box is lifted 1.5 m onto a trolley at steady speed, wheeled 10 m across a level floor, then lowered back to the floor. Find the work done by gravity in each stage and in total.',
      steps: [
        'Lifting: gravity ($mg = 117.7\\ \\mathrm{N}$ down) opposes the 1.5 m rise: $W = -117.7 \\times 1.5 = -177\\ \\mathrm{J}$. The person does +177 J.',
        'Across: gravity is at right angles to the motion: $W = 0$.',
        'Lowering: gravity points along the 1.5 m drop: $W = +177\\ \\mathrm{J}$.',
        'Total: zero. Gravity\'s work depends only on the start and end heights — the mark of a [[conservative-forces|conservative force]].'
      ],
      a: '−177 J, 0 and +177 J: zero in total.'
    },
    {
      title: 'Stretching a spring',
      q: 'A spring with $k = 200\\ \\mathrm{N/m}$ is stretched from its natural length by 15 cm. How much work does this take?',
      steps: [
        'The force rises steadily from 0 to $k x = 200 \\times 0.15 = 30\\ \\mathrm{N}$.',
        'The work is the area under the force–extension line, a triangle: $\\tfrac12 \\times 0.15 \\times 30 = 2.25\\ \\mathrm{J}$.',
        'Using the final force for the whole distance, $30 \\times 0.15 = 4.5\\ \\mathrm{J}$, would double-count: the force was smaller for most of the stretch.'
      ],
      a: '2.25 J.'
    }
  ],
  quiz: [
    { q: 'A waiter carries a tray across a room at constant velocity and constant height. How much work does the upward push of his hand do on the tray?', choices: ['Positive work', 'Negative work', 'None', 'It depends on the tray\'s weight'], a: 2,
      why: 'The push is vertical and the displacement horizontal: θ = 90° and cos θ = 0.' },
    { q: 'A ball is thrown straight up. While it rises, gravity does…', choices: ['positive work', 'negative work', 'no work', 'positive work, then negative'], a: 1,
      why: 'Gravity points down and the ball moves up: θ = 180°. Gravity takes kinetic energy away, so the ball slows.' },
    { q: 'How much work does a 200 N force do pushing a crate 3 m, if it acts at 60° to the direction of motion?', choices: ['600 J', '520 J', '300 J', '0 J'], a: 2,
      why: 'W = Fd cos θ = 200 × 3 × 0.5 = 300 J.' },
    { q: 'On a force–position graph, the work done is…', choices: ['the slope of the graph', 'the area under the graph', 'the largest force times the distance', 'the force at the end'], a: 1,
      why: 'Work adds up force × small displacement over the whole motion: the area between the curve and the position axis.' },
    { q: 'The Earth\'s gravity does no work on a satellite in a circular orbit.', a: true,
      why: 'Gravity points to the Earth\'s centre, at right angles to the satellite\'s velocity at every moment, so the satellite\'s speed never changes.' }
  ],
  applications: [
    'Engines, motors and muscles are compared by the work they can do.',
    'Cranes and lifts: the work to raise a load is its weight times the height.',
    'Regenerative braking in electric cars recovers part of the energy that friction brakes would turn into heat.'
  ],
  history: 'The word "work" (travail) in its modern sense — force times distance — was introduced by the French engineer Gaspard-Gustave Coriolis in 1829, in a book on calculating the effect of machines.'
},

{
  id: 'kinetic-energy', parent: 'work-energy', title: 'Kinetic energy', level: 1,
  short: 'The energy an object has because it moves: ½mv². It grows with the square of the speed.',
  keywords: ['kinetic energy', 'KE', 'energy of motion', '1/2 mv^2', 'joule', 'vis viva', 'speed squared', 'momentum and energy'],
  prereq: ['work', 'speed-velocity'],
  related: ['work-energy-theorem', 'momentum', 'rotational-kinetic-energy', 'relativistic-energy', 'kinetic-theory-gases'],
  body: `
A moving object can do work: a hammer drives a nail, a flowing river turns a mill wheel, a bowling ball knocks down pins. The energy an object has because it moves is its **kinetic energy**:

$$E_k = \\tfrac12 m v^2$$

It is measured in joules and depends on the speed, not the direction: kinetic energy is a scalar, and never negative.

### The square of the speed
Because of the $v^2$, speed dominates. Twice the speed means four times the kinetic energy; three times the speed, nine times. Some numbers:

| Object | Mass | Speed | Kinetic energy |
|---|---|---|---|
| Walking person | 70 kg | 1.4 m/s | 69 J |
| Football, hard kick | 0.43 kg | 30 m/s | 190 J |
| Sprinter at full speed | 80 kg | 10 m/s | 4.0 kJ |
| Rifle bullet | 10 g | 800 m/s | 3.2 kJ |
| Car at 50 km/h | 1500 kg | 13.9 m/s | 145 kJ |
| Car at 100 km/h | 1500 kg | 27.8 m/s | 579 kJ |
| Airliner at cruising speed | 250 t | 250 m/s | 7.8 GJ |

Going from 50 to 100 km/h quadruples the energy that the brakes — or a crash — must get rid of, which is why [[constant-acceleration|braking distances]] grow with the square of the speed.

### Where the ½ comes from
Push a mass $m$ from rest with a steady net force $F$ over a distance $d$. The [[work]] done is $Fd$. With $F = ma$ and $v^2 = 2ad$ from the [[constant-acceleration|equations of motion]], $Fd = mad = \\tfrac12 m v^2$. So the kinetic energy is exactly the work needed to bring the object from rest to its speed — and the work it can do on whatever stops it. This is the [[work-energy-theorem|work–energy theorem]].

### Kinetic energy and momentum
Both depend on mass and velocity, but differently. With [[momentum]] $p = mv$,

$$E_k = \\frac{p^2}{2m}$$

So for the same momentum, the lighter object carries more energy. A rifle and its bullet receive equal and opposite momenta when it fires, but the bullet carries almost all the kinetic energy. Momentum is conserved in every collision; kinetic energy only in [[elastic-collisions|elastic]] ones.

### Limits
Kinetic energy depends on the frame of reference: a cup of coffee on a train has none for a passenger and plenty for someone on the platform. And $\\tfrac12 m v^2$ is the low-speed form of a more general expression; close to the speed of light, see [[relativistic-energy|relativistic energy]].
`,
  ideas: [
    'Kinetic energy is the energy of motion: $E_k = \\tfrac12 m v^2$.',
    'It grows with the square of the speed: double the speed, four times the energy.',
    'It is a scalar, never negative, and does not depend on the direction of motion.',
    'It equals the work needed to bring the object from rest to its speed.',
    'For the same momentum, a lighter object has more kinetic energy: $E_k = p^2/2m$.'
  ],
  pitfalls: [
    'Double the speed, double the energy — It quadruples, because of the v².',
    'Kinetic energy has a direction, like velocity — It is a scalar. A ball moving left and an identical one moving right at the same speed have the same kinetic energy.',
    'Kinetic energy and momentum are the same idea — Momentum is a vector, mv, conserved in every collision; kinetic energy is a scalar, ½mv², conserved only in elastic ones.'
  ],
  formulas: [
    {
      name: 'Kinetic energy',
      expr: 'E = 0.5*m*v^2', tex: 'E_k = \\tfrac12 m v^2',
      vars: {
        E: { name: 'kinetic energy', q: 'energy', unit: 'J', tex: 'E_k' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1500 },
        v: { name: 'speed', q: 'speed', unit: 'km/h', value: 100 }
      },
      stories: {
        E: 'What is the kinetic energy of a {m} car travelling at {v}?',
        v: 'How fast must a {m} object move to have {E} of kinetic energy?',
        m: 'An object moving at {v} has {E} of kinetic energy. What is its mass?'
      }
    },
    {
      name: 'Kinetic energy from momentum',
      expr: 'E = p^2/(2*m)', tex: 'E_k = \\frac{p^2}{2m}',
      vars: {
        E: { name: 'kinetic energy', q: 'energy', unit: 'J', tex: 'E_k' },
        p: { name: 'momentum', q: 'momentum', unit: 'kg·m/s', value: 8 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.01 }
      },
      stories: {
        E: 'A bullet of mass {m} leaves the barrel with a momentum of {p}. What is its kinetic energy?',
        p: 'A {m} object has {E} of kinetic energy. What is the size of its momentum?'
      }
    }
  ],
  examples: [
    {
      title: 'Braking from two speeds',
      q: 'A 1500 kg car brakes to rest, once from 50 km/h and once from 100 km/h. How much energy do the brakes absorb each time? If it all goes into 32 kg of cast-iron discs and pads (specific heat 460 J/(kg·K)), how much do they warm up?',
      steps: [
        '50 km/h = 13.9 m/s: $E_k = \\tfrac12 (1500)(13.9)^2 = 145\\ \\mathrm{kJ}$.',
        '100 km/h = 27.8 m/s: $E_k = \\tfrac12 (1500)(27.8)^2 = 579\\ \\mathrm{kJ}$ — four times as much.',
        'Temperature rise ([[specific-heat|specific heat]]): $\\Delta T = E/(m c) = 579\\,000/(32 \\times 460) = 39\\ \\mathrm{K}$ from 100 km/h, and about 10 K from 50 km/h.'
      ],
      a: '145 kJ and 579 kJ; the brakes warm by about 10 K and 39 K.'
    },
    {
      title: 'Rifle and bullet',
      q: 'A 4.0 kg rifle fires a 10 g bullet at 800 m/s. Compare the kinetic energies of the bullet and the recoiling rifle.',
      steps: [
        'Momentum is conserved: the rifle gets the same momentum as the bullet, $0.010 \\times 800 = 8.0\\ \\mathrm{kg\\,m/s}$, backwards. Its recoil speed is $8.0/4.0 = 2.0\\ \\mathrm{m/s}$.',
        'Bullet: $E_k = p^2/2m = 64/0.020 = 3200\\ \\mathrm{J}$.',
        'Rifle: $E_k = 64/8.0 = 8\\ \\mathrm{J}$.',
        'Equal momenta, but the energy divides in inverse proportion to the masses: the bullet takes 400 times as much.'
      ],
      a: 'Bullet 3200 J, rifle 8 J.'
    }
  ],
  quiz: [
    { q: 'A car speeds up from 30 km/h to 60 km/h. Its kinetic energy…', choices: ['doubles', 'triples', 'quadruples', 'rises by 30 J'], a: 2,
      why: '$E_k \\propto v^2$. Twice the speed gives four times the energy.' },
    { q: 'Which has more kinetic energy: a 1 kg ball at 4 m/s or a 4 kg ball at 1 m/s?', choices: ['The 1 kg ball', 'The 4 kg ball', 'They are equal', 'It depends on their directions'], a: 0,
      why: '½ × 1 × 16 = 8 J against ½ × 4 × 1 = 2 J. (Their momenta, 4 kg·m/s each, are equal.)' },
    { q: 'A lorry and a car have momenta of the same size. Which has more kinetic energy?', choices: ['The lorry', 'The car', 'They are equal', 'It cannot be decided'], a: 1,
      why: '$E_k = p^2/2m$: for equal $p$, the smaller mass has the larger energy.' },
    { q: 'An object moving in the negative direction has negative kinetic energy.', a: false,
      why: 'v² is positive whichever way the object moves, so ½mv² is never negative.' }
  ],
  applications: [
    'Road safety: crash energy and braking distance both grow with the square of the speed.',
    'Wind turbines and water wheels extract the kinetic energy of moving air and water.',
    'Flywheels store energy as kinetic energy of rotation in buses, trains and power grids.',
    'Ballistics and crash testing are specified in terms of kinetic energy.'
  ],
  history: 'Gottfried Leibniz called mv² the "living force" (vis viva) in 1686. Willem \'s Gravesande dropped brass balls into soft clay in the 1720s and found the dents grew with the square of the speed; Émilie du Châtelet championed the result. Coriolis added the factor ½ in 1829.'
},

{
  id: 'work-energy-theorem', parent: 'work-energy', title: 'Work–energy theorem', level: 2,
  short: 'The net work done on an object equals the change in its kinetic energy. It links forces to speeds over a distance, with no need to know the time.',
  keywords: ['work-energy theorem', 'work energy principle', 'net work', 'change in kinetic energy', 'stopping distance', 'average force', 'crumple zone'],
  prereq: ['work', 'kinetic-energy', 'newtons-second-law'],
  related: ['constant-acceleration', 'conservation-of-energy', 'impulse', 'math:definite-integral'],
  body: `
The [[work]] done by the net force on an object equals the change in its [[kinetic-energy|kinetic energy]]:

$$W_{\\text{net}} = \\Delta E_k = \\tfrac12 m v^2 - \\tfrac12 m v_0^2$$

This is the **work–energy theorem**. It is [[newtons-second-law|Newton's second law]] in another form: instead of following how the velocity changes moment by moment, it links the speeds at two places to the forces acting in between — no time needed.

### What it says
- Positive net work speeds an object up; negative net work slows it down; zero net work leaves its speed unchanged (though its direction may change, as in circular motion).
- It is the **net** work that counts. A crate pushed at steady speed across a rough floor has positive work done on it by you and equal negative work done by friction: net zero, speed constant.
- It explains stopping distances. A braking force $F$ stops a car from speed $v$ in a distance $d = \\tfrac12 m v^2/F$ — growing with the *square* of the speed.

### Average forces from distances
The theorem gives the average force when you know how far something takes to stop. A nail driven into wood, a bullet in a sandbag, a car hitting a crash barrier, a jumper landing: in each case $F_{\\text{avg}} = \\tfrac12 m v^2/d$. A longer stopping distance means a smaller force — the idea behind crumple zones, gravel traps and bent knees. (If you know the stopping *time* instead, use [[impulse]].)

When other forces act during the stop, include their work too. Landing from a jump of height $h$ and stopping over a distance $d$, the floor must remove the kinetic energy $mgh$ *and* the extra $mgd$ that gravity keeps adding while you sink, so it pushes with an average force $mg(1 + h/d)$.

### Beyond constant forces
The derivation below uses a constant force, but the theorem holds for any force, however it varies, because it can be built from tiny steps: $F\\,dx = m\\,\\frac{dv}{dt}\\,dx = m v\\,dv$, and adding up gives $\\int F\\,dx = \\tfrac12 m v^2 - \\tfrac12 m v_0^2$. When some of the forces are [[conservative-forces|conservative]] — gravity, springs — their work can be moved to the other side as potential energy, and the theorem becomes the law of [[conservation-of-energy|conservation of energy]].
`,
  ideas: [
    'The net work done on an object equals the change in its kinetic energy.',
    'Positive net work speeds it up; negative net work slows it down.',
    'For a given braking force, the stopping distance grows with the square of the speed.',
    'Average stopping force = kinetic energy ÷ stopping distance: longer stops mean gentler forces.'
  ],
  pitfalls: [
    'Any positive work makes an object speed up — Only positive net work does. Friction or gravity may take away what one force puts in.',
    'Zero net work means no forces act — It only means the speed is unchanged. A satellite in a circular orbit has a large force on it and zero work.',
    'The theorem gives the time to stop — It links forces with distances. For times, use impulse and momentum.'
  ],
  derivation: {
    title: 'Derive the theorem from Newton\'s second law',
    steps: [
      { text: 'A constant net force $F$ acts along the motion over a distance $d$. By the second law the acceleration is constant:', tex: 'a = \\frac{F}{m}' },
      { text: 'For constant acceleration, the speeds and the distance are linked by', tex: 'v^2 = v_0^2 + 2 a d' },
      { text: 'Multiply through by $\\tfrac12 m$ and use $m a = F$:', tex: '\\tfrac12 m v^2 = \\tfrac12 m v_0^2 + F d' },
      { text: 'So the net work equals the change in kinetic energy:', tex: 'W_{\\text{net}} = F d = \\tfrac12 m v^2 - \\tfrac12 m v_0^2' }
    ]
  },
  formulas: [
    {
      name: 'Work–energy theorem with a constant net force',
      expr: 'F*d = 0.5*m*(v^2 - v0^2)', tex: 'F_{\\text{net}}\\,d = \\tfrac12 m v^2 - \\tfrac12 m v_0^2', solveFor: 'v',
      vars: {
        F: { name: 'net force along the motion', q: 'force', unit: 'N', value: 450, tex: 'F_{\\text{net}}', signed: true },
        d: { name: 'distance over which it acts', q: 'length', unit: 'm', value: 20 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1200 },
        v: { name: 'final speed', q: 'speed', unit: 'm/s' },
        v0: { name: 'initial speed', q: 'speed', unit: 'm/s', value: 2 }
      },
      note: 'A negative net force (against the motion) gives a final speed lower than the initial one.',
      stories: {
        v: 'Two people push a {m} car rolling at {v0} with a net force of {F} over {d}. How fast is it going then?',
        d: 'Over what distance must a net force of {F} act on a {m} sledge to take it from {v0} to {v}?'
      }
    },
    {
      name: 'Average stopping force from the stopping distance',
      expr: 'F = m*v^2/(2*d)', tex: 'F_{\\text{avg}} = \\frac{m v^2}{2 d}',
      vars: {
        F: { name: 'average stopping force', q: 'force', unit: 'N', tex: 'F_{\\text{avg}}' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.01 },
        v: { name: 'speed before stopping', q: 'speed', unit: 'm/s', value: 400 },
        d: { name: 'stopping distance', q: 'length', unit: 'cm', value: 8 }
      },
      stories: {
        F: 'A {m} bullet at {v} is stopped by {d} of wood. What is the average force on it?',
        d: 'A {m} car at {v} must be stopped with an average force of no more than {F}. What is the shortest stopping distance?'
      }
    }
  ],
  examples: [
    {
      title: 'Braking distance and speed',
      q: 'A 1200 kg car stops from 20 m/s in 25 m. What is the average braking force? With the same force, how far would it take to stop from 30 m/s?',
      steps: [
        'Kinetic energy at 20 m/s: $\\tfrac12 (1200)(20)^2 = 240\\ \\mathrm{kJ}$. The brakes do $-240\\ \\mathrm{kJ}$ of work over 25 m.',
        '$F = 240\\,000/25 = 9600\\ \\mathrm{N}$.',
        'At 30 m/s the car has $\\tfrac12 (1200)(30)^2 = 540\\ \\mathrm{kJ}$, so $d = 540\\,000/9600 = 56\\ \\mathrm{m}$.',
        '50% more speed, 125% more distance: the distance grows as $v^2$.'
      ],
      a: '9.6 kN; about 56 m from 30 m/s.'
    },
    {
      title: 'Landing from a jump',
      q: 'A 70 kg person jumps down from a wall 1.0 m high. Find the average force of the floor on them if they land stiff-legged and stop in 1 cm, and if they bend their knees and stop over 50 cm.',
      steps: [
        'Between leaving the wall and stopping, gravity does work $mg(h + d)$ and the floor does $-N d$. The person starts and ends at rest, so the net work is zero: $mg(h + d) = N d$.',
        'So $N = mg\\,(1 + h/d)$, with $mg = 687\\ \\mathrm{N}$.',
        'Stiff legs, $d = 0.01\\ \\mathrm{m}$: $N = 687 \\times 101 = 69\\ \\mathrm{kN}$ — a hundred times body weight, enough to break bones.',
        'Bent knees, $d = 0.50\\ \\mathrm{m}$: $N = 687 \\times 3 = 2.1\\ \\mathrm{kN}$, three times body weight.'
      ],
      a: 'About 69 kN stiff-legged against 2.1 kN with bent knees.'
    }
  ],
  quiz: [
    { q: 'A car\'s brakes supply a constant force. At three times the speed, the braking distance is…', choices: ['the same', '3 times as long', '6 times as long', '9 times as long'], a: 3,
      why: 'd = ½mv²/F, and v² grows 9 times.' },
    { q: 'A crate is pushed across a rough floor at constant speed. The net work done on it is…', choices: ['positive', 'negative', 'zero', 'equal to the work you do'], a: 2,
      why: 'Its kinetic energy does not change. Your positive work is cancelled by the negative work of friction.' },
    { q: 'A 2 kg ball speeds up from 3 m/s to 5 m/s. The net work done on it is…', choices: ['2 J', '4 J', '16 J', '32 J'], a: 2,
      why: '$\\Delta E_k = \\tfrac12 \\times 2 \\times (25 - 9) = 16\\ \\mathrm{J}$. Using $(5 - 3)^2$ would give 4 J — the change of the square is not the square of the change.' },
    { q: 'Bending your knees when you land lowers the force on your legs because you stop over a longer distance.', a: true,
      why: 'The energy to be removed is fixed; spreading it over a longer distance lowers the average force.' }
  ],
  applications: [
    'Crumple zones, airbags and crash barriers lengthen the stopping distance to lower the force on the occupants.',
    'Gravel traps on racetracks and arrester beds beside steep roads stop vehicles over a long distance.',
    'Sports science: estimating impact forces on landing gymnasts, runners and footballers.'
  ]
},

{
  id: 'gravitational-potential-energy', parent: 'work-energy', title: 'Gravitational potential energy', level: 1,
  short: 'Energy stored by raising something against gravity: mgh near the Earth\'s surface, measured from a reference level of your choosing.',
  keywords: ['gravitational potential energy', 'GPE', 'potential energy', 'mgh', 'height', 'reference level', 'stored energy', 'hydroelectric'],
  prereq: ['work', 'weight-mass'],
  related: ['conservation-of-energy', 'conservative-forces', 'gravitational-potential', 'kinetic-energy', 'escape-velocity'],
  body: `
Lift a book onto a shelf and you do work against gravity. That work is not lost: let the book fall and it comes back as kinetic energy. While the book sits on the shelf, the energy is stored as **gravitational potential energy** — energy of position.

Near the Earth's surface, where $g$ is practically constant, raising a mass $m$ through a height $h$ needs a force $mg$ over a distance $h$, so

$$E_p = m g h$$

### Only differences matter
The height $h$ is measured from a **reference level** of your choosing: the floor, the table top, sea level. Changing the reference adds the same constant to every potential energy, so it never changes a *difference* — and only differences have physical effects. A 1 kg book on a shelf 2 m up has 19.6 J relative to the floor and −9.8 J relative to a ceiling 3 m up; either way it gains 19.6 J of kinetic energy by the time it reaches the floor. Choose whichever reference makes the arithmetic easiest, and stick to it.

### The work done by gravity
When an object moves from height $h_1$ to $h_2$, gravity does the work

$$W_g = -\\Delta E_p = m g\\,(h_1 - h_2)$$

positive when it falls, negative when it rises. Remarkably, this depends only on the change of height, not on the route: sliding down a winding slide, falling straight down or rolling down a ramp from the same height, gravity does the same work. That route-independence is what makes gravity a [[conservative-forces|conservative force]], and potential energy a useful idea.

### Numbers
| Situation | Energy |
|---|---|
| 1 kg lifted 1 m | 9.8 J |
| Climbing a flight of stairs: 70 kg, 3 m | 2.1 kJ |
| Climbing a 1000 m mountain: 70 kg | 690 kJ |
| 1 m³ of water falling 100 m through a dam's turbines | 981 kJ |

A chocolate bar holds about 1000 kJ — enough, in principle, to lift you up that mountain, although your muscles are only about 25% [[efficiency|efficient]], so you would need four.

### Far from the Earth
$mgh$ assumes $g$ is constant, which is fine for heights much smaller than the Earth's radius (6371 km). For rockets and satellites the full expression $-GMm/r$ is needed: see [[gravitational-potential|gravitational potential energy (general)]].
`,
  ideas: [
    'Gravitational potential energy is energy stored by position in a gravitational field: $E_p = m g h$ near the Earth.',
    'The zero level is arbitrary; only changes in potential energy matter.',
    'The work done by gravity equals minus the change in potential energy, whatever the route.',
    'mgh holds only where g is nearly constant — for heights small compared with the Earth\'s radius.'
  ],
  pitfalls: [
    'Potential energy has an absolute value — Only differences are meaningful; the zero is wherever you choose.',
    'A longer route means more work against gravity — Only the change in height matters: a ramp and a ladder to the same platform need the same mgh (friction aside).',
    'mgh works for satellites — At heights comparable with the Earth\'s radius g weakens, and the general form −GMm/r must be used.'
  ],
  formulas: [
    {
      name: 'Gravitational potential energy near the surface',
      expr: 'E = m*g*h', tex: 'E_p = m g h',
      vars: {
        E: { name: 'potential energy relative to the reference level', q: 'energy', unit: 'J', tex: 'E_p', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 70 },
        g: { const: 'g' },
        h: { name: 'height above the reference level', q: 'length', unit: 'm', value: 3, signed: true }
      },
      stories: {
        E: 'How much potential energy does a {m} person gain by climbing a staircase {h} high?',
        h: 'A {m} crate gains {E} of potential energy when a crane lifts it. How high was it lifted?'
      }
    },
    {
      name: 'Height reached from a launch speed',
      expr: 'h = v^2/(2*g)', tex: 'h = \\frac{v^2}{2g}',
      vars: {
        h: { name: 'rise in height', q: 'length', unit: 'm' },
        v: { name: 'initial speed', q: 'speed', unit: 'm/s', value: 9.5 },
        g: { const: 'g' }
      },
      note: 'All the kinetic energy becomes potential energy, $\\tfrac12 m v^2 = m g h$, so the mass cancels.',
      stories: {
        h: 'A pole vaulter runs in at {v}. If all her kinetic energy became potential energy, how far could her centre of mass rise?',
        v: 'How fast must a ball be thrown straight up to rise {h}?'
      }
    }
  ],
  examples: [
    {
      title: 'The pole vault',
      q: 'A pole vaulter sprints in at 9.5 m/s. If all her kinetic energy became gravitational potential energy, how high could her centre of mass rise? How does this compare with world-record heights?',
      steps: [
        '$\\tfrac12 m v^2 = m g h$, so $h = v^2/2g = 9.5^2/(2 \\times 9.81) = 4.6\\ \\mathrm{m}$ — the mass cancels.',
        'Her centre of mass starts about 1.0 m above the ground, so it could reach about 5.6 m.',
        'World records are above 6.2 m. The extra comes from the athlete pushing up on the pole at the top of the vault and from a centre of mass that passes just below the bar, while her body curls over it.'
      ],
      a: 'About 4.6 m of rise, so a centre of mass near 5.6 m.'
    },
    {
      title: 'A pumped-storage reservoir',
      q: 'An upper reservoir 300 m above its lower lake holds 5.0 million cubic metres of water. How much energy does it store, in joules and in kilowatt-hours?',
      steps: [
        'Mass of water: $5.0\\times10^{6}\\ \\mathrm{m^3} \\times 1000\\ \\mathrm{kg/m^3} = 5.0\\times10^{9}\\ \\mathrm{kg}$.',
        '$E_p = m g h = 5.0\\times10^{9} \\times 9.81 \\times 300 = 1.47\\times10^{13}\\ \\mathrm{J}$.',
        'In kilowatt-hours: $1.47\\times10^{13}/3.6\\times10^{6} = 4.1\\times10^{6}\\ \\mathrm{kWh}$ — 4.1 GWh, enough to run a 1 GW power station for about four hours.'
      ],
      a: '1.5 × 10¹³ J, about 4 GWh.'
    },
    {
      title: 'Choosing the zero',
      q: 'A 2.0 kg ball rolls off a table 1.2 m high. Find its potential energy on the table and on the floor, first with the floor as reference, then with the table top as reference. How fast does it hit the floor?',
      steps: [
        'Floor as reference: on the table $E_p = 2.0 \\times 9.81 \\times 1.2 = 23.5\\ \\mathrm{J}$; on the floor $0$.',
        'Table as reference: on the table $0$; on the floor $2.0 \\times 9.81 \\times (-1.2) = -23.5\\ \\mathrm{J}$.',
        'Either way the change is $-23.5\\ \\mathrm{J}$, which becomes kinetic energy: $v = \\sqrt{2 \\times 23.5/2.0} = 4.85\\ \\mathrm{m/s}$ (plus any speed it had rolling off).'
      ],
      a: 'The values depend on the reference; the change, −23.5 J, and the speed, about 4.9 m/s, do not.'
    }
  ],
  quiz: [
    { q: 'You carry a 10 kg box up a 3 m staircase; a friend pushes an identical box up a long, smooth ramp to the same landing. Who increases the box\'s potential energy more?', choices: ['You', 'Your friend', 'Both by the same amount', 'Whoever is faster'], a: 2,
      why: '$\\Delta E_p = m g h$ depends only on the change of height: about 290 J for each box.' },
    { q: 'A book\'s potential energy is −15 J. This means…', choices: ['something is wrong: energy cannot be negative', 'the book is below the chosen reference level', 'the book is falling', 'gravity pushes it upwards'], a: 1,
      why: 'Potential energy is measured from an arbitrary zero; below that level it is negative. Only differences matter.' },
    { q: 'Lifting a 2 kg bag from the floor onto a 1.5 m shelf increases its potential energy by about…', choices: ['3 J', '15 J', '29 J', '300 J'], a: 2,
      why: 'mgh = 2 × 9.8 × 1.5 ≈ 29 J.' },
    { q: 'The work gravity does on a skier going from the top of a hill to the bottom depends on the route she takes.', a: false,
      why: 'Gravity\'s work is mg × (drop in height), whatever the route. It is friction\'s work that depends on the route.' }
  ],
  applications: [
    'Hydroelectric and pumped-storage power stations store and release energy as the height of water.',
    'Roller coasters are hauled up once, then run on stored potential energy.',
    'Weight-driven clocks are powered by a slowly falling weight.',
    '"Gravity batteries" have been proposed that lift heavy blocks when power is cheap and lower them when it is needed.'
  ],
  sim: 'mech1-skate-park'
},

{
  id: 'elastic-potential-energy', parent: 'work-energy', title: 'Elastic potential energy', level: 2,
  short: 'Energy stored in a stretched, compressed or bent object. For a spring it is ½kx², the area under its force–extension graph.',
  keywords: ['elastic potential energy', 'spring energy', 'strain energy', '1/2 kx^2', 'spring constant', 'Hooke', 'bungee', 'bow', 'catapult'],
  prereq: ['hookes-law', 'work', 'kinetic-energy'],
  related: ['mass-spring-system', 'energy-in-shm', 'conservation-of-energy', 'stress-strain'],
  body: `
Stretch a rubber band, compress a spring, bend a bow: you do work, and the deformed object stores it, ready to give it back. This stored energy is **elastic potential energy**.

### The energy in a spring
A spring obeys [[hookes-law|Hooke's law]]: to stretch or compress it by $x$ from its natural length takes a force $F = kx$, where $k$ is the spring constant (its stiffness) in N/m. The force grows as you stretch, so the [[work]] is the area under the force–extension graph — a triangle of base $x$ and height $kx$:

$$E_e = \\tfrac12 k x^2$$

Two things follow. The energy grows with the **square** of the deformation: stretch twice as far, store four times as much. And it is the same whether the spring is stretched or compressed by the same amount.

### Giving it back
Release a compressed spring against a mass and the stored energy becomes [[kinetic-energy|kinetic energy]]: $\\tfrac12 k x^2 = \\tfrac12 m v^2$, so the launch speed is $v = x\\sqrt{k/m}$. Toy dart guns, pinball plungers, catapults, bows and jumping fleas all work this way. On a trampoline or in a bouncing ball, energy passes back and forth between kinetic, elastic and gravitational forms; in a [[mass-spring-system|mass on a spring]] it swaps continuously, which is the heart of [[energy-in-shm|oscillation]].

### Real materials
Any material deformed within its elastic limit stores energy this way: a diving board, a steel cable, a car's suspension, the tendons in your legs (the Achilles tendon returns part of the energy of each stride when you run). Beyond the elastic limit a material deforms permanently and the energy is not returned — it goes into heat and damage. Even rubber returns less than it takes: stretch and release a band quickly a few times and it warms up. Per unit volume the stored energy is $\\tfrac12 \\times \\text{stress} \\times \\text{strain}$ (see [[stress-strain]]).

### Numbers
A car suspension spring ($k \\approx 30\\ \\mathrm{kN/m}$) compressed 10 cm stores 150 J. A bow drawn back through about half a metre, reaching a pull of about 200 N, stores roughly 50 J. A bungee cord with $k = 100\\ \\mathrm{N/m}$ stretched 25 m holds about 31 kJ — the energy of a 70 kg jumper who has fallen some 45 m.
`,
  ideas: [
    'A stretched, compressed or bent elastic object stores elastic potential energy.',
    'For a spring $E_e = \\tfrac12 k x^2$, the area under the force–extension graph.',
    'Double the stretch and the stored energy quadruples.',
    'Stretching and compressing by the same amount store the same energy.',
    'Released, the energy becomes kinetic energy: v = x√(k/m) for a spring launcher.'
  ],
  pitfalls: [
    'The stored energy is F × x — The force rises from zero during the stretch, so the energy is the triangle ½Fx = ½kx², half the rectangle.',
    'A compressed spring stores negative energy — ½kx² is positive for either sign of x.',
    'All the stored energy always comes back — Only within the elastic limit, and even then not quite: real materials lose some as heat.'
  ],
  formulas: [
    {
      name: 'Energy stored in a spring',
      expr: 'E = 0.5*k*x^2', tex: 'E_e = \\tfrac12 k x^2',
      vars: {
        E: { name: 'elastic potential energy', q: 'energy', unit: 'J', tex: 'E_e' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 400 },
        x: { name: 'stretch or compression', q: 'length', unit: 'cm', value: 5, signed: true }
      },
      stories: {
        E: 'A spring of constant {k} is compressed by {x}. How much energy does it store?',
        k: 'Compressing a spring by {x} stores {E}. What is its spring constant?'
      }
    },
    {
      name: 'Launch speed from a spring',
      expr: 'v = x*sqrt(k/m)', tex: 'v = x\\sqrt{\\frac{k}{m}}',
      vars: {
        v: { name: 'launch speed', q: 'speed', unit: 'm/s' },
        x: { name: 'compression', q: 'length', unit: 'cm', value: 5 },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 400 },
        m: { name: 'mass launched', q: 'mass', unit: 'g', value: 10 }
      },
      note: 'All the stored energy becomes kinetic energy of the mass: a light spring, no friction.',
      stories: {
        v: 'A toy launcher has a spring of constant {k}, compressed by {x}. How fast does it fire a {m} ball?',
        x: 'How far must a spring of constant {k} be compressed to fire a {m} dart at {v}?'
      }
    },
    {
      name: 'Bungee jump: greatest stretch of the cord',
      expr: 'm*g*(L + x) = 0.5*k*x^2', tex: 'm g\\,(L + x) = \\tfrac12 k x^2', solveFor: 'x',
      vars: {
        m: { name: 'mass of the jumper', q: 'mass', unit: 'kg', value: 70 },
        g: { const: 'g' },
        L: { name: 'unstretched length of the cord', q: 'length', unit: 'm', value: 20 },
        x: { name: 'greatest stretch of the cord', q: 'length', unit: 'm' },
        k: { name: 'spring constant of the cord', q: 'stiffness', unit: 'N/m', value: 100 }
      },
      note: 'The jumper starts and (for an instant) ends at rest, having fallen $L + x$: all the lost potential energy is in the stretched cord. Air resistance is ignored.',
      stories: {
        x: 'A {m} jumper leaps from a bridge on a bungee cord of unstretched length {L} and spring constant {k}. How far does the cord stretch at the lowest point?',
        k: 'A {m} jumper on a cord of unstretched length {L} must not stretch it by more than {x}. What spring constant does the cord need?'
      }
    }
  ],
  examples: [
    {
      title: 'A spring-loaded toy',
      q: 'A toy launcher has a spring with $k = 400\\ \\mathrm{N/m}$ compressed by 5.0 cm. How much energy does it store, how fast does it fire a 10 g ball, and how high would the ball rise if fired straight up? What if the spring is compressed 10 cm?',
      steps: [
        '$E_e = \\tfrac12 (400)(0.050)^2 = 0.50\\ \\mathrm{J}$.',
        '$\\tfrac12 m v^2 = 0.50$: $v = \\sqrt{2 \\times 0.50/0.010} = 10\\ \\mathrm{m/s}$.',
        'Height: $h = E/(m g) = 0.50/(0.010 \\times 9.81) = 5.1\\ \\mathrm{m}$, ignoring air resistance.',
        'At 10 cm the energy is four times as large (2.0 J), the speed twice (20 m/s) and the height four times (20 m).'
      ],
      a: '0.50 J, 10 m/s and 5.1 m; four times the energy and height with twice the compression.'
    },
    {
      title: 'How far does the bungee stretch?',
      q: 'A 70 kg jumper uses a cord of unstretched length 20 m and spring constant 100 N/m. How far below the platform is the lowest point, and what is the greatest force of the cord?',
      steps: [
        'At the lowest point she is at rest again, having fallen $20 + x$: $m g (20 + x) = \\tfrac12 k x^2$.',
        'With numbers: $686.7(20 + x) = 50 x^2$, or $50x^2 - 686.7x - 13\\,734 = 0$.',
        '[[math:quadratic-equations|Quadratic formula]], positive root: $x = \\dfrac{686.7 + \\sqrt{686.7^2 + 4 \\times 50 \\times 13\\,734}}{100} = 24.8\\ \\mathrm{m}$.',
        'The lowest point is $44.8\\ \\mathrm{m}$ below the platform, and the cord then pulls with $k x = 2480\\ \\mathrm{N}$, about 3.6 times her weight.'
      ],
      a: 'About 45 m down, with a peak pull of about 2.5 kN.'
    }
  ],
  quiz: [
    { q: 'A spring is compressed twice as far. The energy it stores becomes…', choices: ['twice as large', 'four times as large', 'half as large', 'the same'], a: 1,
      why: 'E = ½kx²: doubling x multiplies the energy by four.' },
    { q: 'The same spring is stretched by 3 cm, and then compressed by 3 cm. The energy stored is…', choices: ['the same both times', 'positive, then negative', 'twice as much when stretched', 'zero when compressed'], a: 0,
      why: 'x² is the same for +3 cm and −3 cm.' },
    { q: 'Stretching a spring by 0.2 m takes a force that rises steadily to 50 N. How much energy is stored?', choices: ['10 J', '5 J', '2.5 J', '250 J'], a: 1,
      why: 'The area of the triangle: ½ × 50 N × 0.2 m = 5 J. (10 J assumes the full 50 N all the way.)' },
    { q: 'If a spring launcher fires a ball twice as heavy, the launch speed is halved.', a: false,
      why: 'The same energy goes into the ball, so ½mv² is fixed and v ∝ 1/√m: twice the mass gives about 0.71 of the speed.' }
  ],
  applications: [
    'Car and bicycle suspensions store and release energy over bumps.',
    'Bows, catapults, pinball plungers and spring-loaded toys.',
    'Mechanical watches and clockwork toys run on a wound spring.',
    'Running: tendons and the arch of the foot store and return part of each stride\'s energy.'
  ]
},

{
  id: 'conservative-forces', parent: 'work-energy', title: 'Conservative forces', level: 2,
  short: 'A force is conservative if its work between two points does not depend on the path. Only such forces have a potential energy, and the force is minus its slope.',
  keywords: ['conservative force', 'non-conservative force', 'dissipative force', 'path independence', 'closed path', 'potential energy', 'F = -dU/dx', 'equilibrium', 'energy diagram', 'turning point'],
  prereq: ['work', 'gravitational-potential-energy', 'math:derivative'],
  related: ['conservation-of-energy', 'elastic-potential-energy', 'electric-potential-energy', 'math:gradient', 'math:line-integrals'],
  body: `
Carry a box up a flight of stairs and back down again. Gravity does −300 J of work on the way up and +300 J on the way down: over the round trip, nothing. Now slide the same box across a rough floor to the far wall and back: friction takes energy on the way out *and* on the way back. Over the round trip it has taken energy away for good. That difference sorts forces into two kinds.

### Two equivalent definitions
A force is **conservative** if
- the work it does around **any closed path** is zero; or, equivalently,
- the work it does between two points is the same for **every path** joining them.

Gravity, the force of an ideal spring and the electric force between charges are conservative. [[friction|Friction]] and [[drag-force|air resistance]] are not: they always act against the motion, so they always do negative work, and the longer the path the more they take. They are called **dissipative**, because the mechanical energy they remove ends up as heat.

### Potential energy
Only for a conservative force can you define a **potential energy** $U$, a function of position alone, such that the work done by the force is

$$W = -\\Delta U = U_1 - U_2$$

If the work depended on the path, "the energy stored at a point" would make no sense. That is why there is [[gravitational-potential-energy|gravitational]], [[elastic-potential-energy|elastic]] and [[electric-potential-energy|electric]] potential energy, but no "friction potential energy".

### Force from potential energy
Turn the relation round and the force comes from the slope of the potential energy. In one dimension

$$F = -\\frac{dU}{dx}$$

The force points "downhill" on a graph of $U(x)$, and is stronger where the graph is steeper. Check: $U = mgy$ gives $F = -mg$ (downwards); $U = \\tfrac12 kx^2$ gives $F = -kx$ ([[hookes-law|Hooke's law]]). In three dimensions the slope becomes the [[math:gradient|gradient]], $\\vec F = -\\nabla U$.

### Reading an energy diagram
A graph of $U(x)$ is a map of the possible motions. Where it has a **minimum**, the force is zero and pushes back towards the bottom from either side: a **stable equilibrium**, like a marble in a bowl. At a **maximum** the force is also zero, but any nudge grows: an **unstable equilibrium**, like a pencil balanced on its tip. An object with total energy $E$ can only be where $U \\le E$, because its kinetic energy $E - U$ cannot be negative; the points where $U = E$ are its **turning points**. The bond between two atoms, a pendulum, a planet's orbit and a roller coaster can all be read this way.

> [!note] In the skate-park simulation, set the friction to zero: the skater always returns to the energy line, whatever the shape of the track. Add friction and the path starts to matter — every extra metre travelled costs energy.
`,
  ideas: [
    'A conservative force does zero work around any closed path; its work between two points does not depend on the path.',
    'Gravity, ideal springs and electric forces are conservative; friction and drag are dissipative.',
    'Only conservative forces have a potential energy: W = −ΔU.',
    'The force is minus the slope of the potential energy: F = −dU/dx.',
    'Minima of U(x) are stable equilibria and maxima unstable ones; turning points are where U = E.'
  ],
  pitfalls: [
    'Friction has a potential energy too — Its work depends on the path, so no function of position can store it. The energy friction removes becomes heat.',
    'The force points up the potential-energy slope — It points downhill: F = −dU/dx.',
    'Zero force means the object is at rest — At an equilibrium point the force is zero, but a moving object can pass through at full speed, like a pendulum at the bottom of its swing.'
  ],
  formulas: [
    {
      name: 'Force from the slope of the potential energy',
      expr: 'F = -dU/dx', tex: 'F = -\\frac{\\Delta U}{\\Delta x}',
      vars: {
        F: { name: 'force along x', q: 'force', unit: 'N', signed: true },
        dU: { name: 'change in potential energy', q: 'energy', unit: 'J', value: -0.6, tex: '\\Delta U', signed: true },
        dx: { name: 'small step along x', q: 'length', unit: 'cm', value: 5, tex: '\\Delta x', signed: true }
      },
      note: 'For a small step this approximates $F = -dU/dx$. The force points towards lower potential energy.',
      stories: {
        F: 'Moving a particle {dx} along x changes its potential energy by {dU}. What force acts on it along x?',
        dU: 'A force of {F} acts along x on a particle. By how much does its potential energy change over a small step of {dx}?'
      }
    },
    {
      name: 'Friction\'s work around a closed path',
      expr: 'W = -mu*m*g*L', tex: 'W_{\\text{loop}} = -\\mu_k m g L',
      vars: {
        W: { name: 'work done by friction over the round trip', q: 'energy', unit: 'J', tex: 'W_{\\text{loop}}', signed: true },
        mu: { name: 'coefficient of kinetic friction', value: 0.3, tex: '\\mu_k' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' },
        L: { name: 'total length of the closed path', q: 'length', unit: 'm', value: 40 }
      },
      note: 'On a level floor. For a conservative force the answer would be zero for every closed path.',
      stories: { W: 'A {m} box is slid all the way round a room and back to its start, a closed path {L} long, on a floor with a coefficient of kinetic friction of {mu}. How much work does friction do?' }
    }
  ],
  examples: [
    {
      title: 'Two round trips',
      q: 'A 5.0 kg box is (a) carried up a 3.0 m staircase and back down to its starting point, (b) slid right round a 10 m × 10 m room and back to its starting point on a floor with $\\mu_k = 0.30$. Find the total work done by gravity in (a) and by friction in (b).',
      steps: [
        '(a) Up: $-5.0 \\times 9.81 \\times 3.0 = -147\\ \\mathrm{J}$. Down: $+147\\ \\mathrm{J}$. Total: $0$.',
        '(b) Friction is $0.30 \\times 5.0 \\times 9.81 = 14.7\\ \\mathrm{N}$, always against the motion, over 40 m: $W = -14.7 \\times 40 = -589\\ \\mathrm{J}$.',
        'Gravity passes the closed-path test; friction fails it. Gravity has a potential energy; friction does not.'
      ],
      a: 'Gravity: 0 J. Friction: −589 J.'
    },
    {
      title: 'From a potential energy to a force',
      q: 'A particle moving along x has potential energy $U(x) = 3x^2 - 12x$ (U in joules, x in metres). Find the force on it at $x = 1\\ \\mathrm{m}$, the equilibrium point and its type, and the turning points if its total energy is 0 J.',
      steps: [
        '$F = -\\dfrac{dU}{dx} = -(6x - 12) = 12 - 6x$. At $x = 1$: $F = +6\\ \\mathrm{N}$, pushing towards larger x — downhill on the graph.',
        'Equilibrium where $F = 0$: $x = 2\\ \\mathrm{m}$, where $U = 12 - 24 = -12\\ \\mathrm{J}$. The graph is a parabola opening upwards, so this is a minimum: stable.',
        'With $E = 0$ the particle can be only where $U \\le 0$: $3x^2 - 12x \\le 0$, i.e. $0 \\le x \\le 4$. It turns round at $x = 0$ and $x = 4\\ \\mathrm{m}$, and moves fastest at $x = 2\\ \\mathrm{m}$ with 12 J of kinetic energy.'
      ],
      a: 'F = 6 N at x = 1 m; stable equilibrium at x = 2 m; turning points at 0 and 4 m.'
    },
    {
      title: 'Two ways down a hill',
      q: 'A 60 kg skier descends 100 m of height either by a gentle 2000 m run or by a steep 500 m run. Friction from the snow averages 20 N on both. Ignoring air resistance, compare her speeds at the bottom.',
      steps: [
        'Gravity does the same work on both routes: $mgh = 60 \\times 9.81 \\times 100 = 58\\,900\\ \\mathrm{J}$.',
        'Friction depends on the path: $-20 \\times 2000 = -40\\,000\\ \\mathrm{J}$ on the gentle run, $-20 \\times 500 = -10\\,000\\ \\mathrm{J}$ on the steep one.',
        'Gentle: $E_k = 18\\,900\\ \\mathrm{J}$, $v = \\sqrt{2 \\times 18\\,900/60} = 25\\ \\mathrm{m/s}$. Steep: $E_k = 48\\,900\\ \\mathrm{J}$, $v = 40\\ \\mathrm{m/s}$.'
      ],
      a: 'About 25 m/s on the gentle run and 40 m/s on the steep one.'
    }
  ],
  quiz: [
    { q: 'Which of these forces is NOT conservative?', choices: ['Gravity', 'The force of an ideal spring', 'The electric force between two charges', 'Kinetic friction'], a: 3,
      why: 'Friction always opposes the motion, so it does negative work on every part of a round trip; its total around a closed path is not zero.' },
    { q: 'At a point where a graph of potential energy U(x) slopes upwards to the right, the force on the particle points…', choices: ['to the right', 'to the left', 'upwards', 'nowhere'], a: 1,
      why: 'F = −dU/dx: a positive slope gives a negative force, downhill on the graph — to the left.' },
    { q: 'A particle rests at a maximum of its potential-energy curve. Its equilibrium is…', choices: ['stable', 'unstable', 'neutral', 'impossible'], a: 1,
      why: 'The force is zero there, but a small displacement puts it on a downward slope and the force pushes it farther away.' },
    { q: 'Gravity does the same work on a hiker who takes a long zig-zag path up a mountain as on one who climbs straight up.', a: true,
      why: 'Gravity is conservative: its work depends only on the start and end heights, −mgΔh.' }
  ],
  applications: [
    'Energy diagrams describe chemical bonds, the stability of nuclei and the orbits of planets and satellites.',
    'Engineers separate recoverable (conservative) energy from dissipative losses when designing springs, pendulums and vehicles.',
    'Regenerative braking tries to capture kinetic energy before friction turns it into unrecoverable heat.'
  ],
  sim: 'mech1-skate-park'
},

{
  id: 'conservation-of-energy', parent: 'work-energy', title: 'Conservation of energy', level: 1,
  short: 'Energy is never created or destroyed, only converted from one form to another. With only conservative forces working, kinetic plus potential energy stays constant.',
  keywords: ['conservation of energy', 'mechanical energy', 'energy transformation', 'roller coaster', 'pendulum', 'thermal energy', 'energy forms', 'energy bookkeeping'],
  prereq: ['kinetic-energy', 'gravitational-potential-energy', 'work'],
  related: ['work-energy-theorem', 'conservative-forces', 'first-law-thermodynamics', 'energy-in-shm', 'efficiency', 'mass-energy'],
  body: `
Energy cannot be created or destroyed, only changed from one form to another or passed from one object to another. In an isolated system the **total energy stays constant**. This is one of the most thoroughly tested laws in physics — no exception has ever been found — and it is often the quickest way to solve a problem, because it skips over the details of *how* things happen.

### Mechanical energy
When only [[conservative-forces|conservative forces]] such as gravity and springs do work, the sum of kinetic and potential energy — the **mechanical energy** — is constant:

$$\\tfrac12 m v_1^2 + m g h_1 = \\tfrac12 m v_2^2 + m g h_2$$

A roller coaster released from rest at height $h$ reaches the bottom at $v = \\sqrt{2gh}$ **whatever the shape of the track** — straight drop, gentle curve or corkscrew. It can climb back to its starting height but never above it. A pendulum swaps kinetic and potential energy twice in every swing; a trampoline cycles among kinetic, gravitational and elastic energy.

Energy methods give speeds, not times: they tell you how fast the coaster is going at the bottom of the dip, not when it gets there. For that you need forces and [[newtons-second-law|Newton's second law]].

### When friction acts
Friction and drag do negative work and remove mechanical energy — but it is not destroyed. It becomes **thermal energy** (internal energy) of the surfaces and the air: the brakes get hot, the skid marks are warm. Including it, the books still balance:

$$E_{k,1} + E_{p,1} = E_{k,2} + E_{p,2} + E_{\\text{thermal}}$$

For a friction force $f$ acting along a path of length $d$, the thermal energy produced is $f d$. Add the energy delivered by an engine or a person, and the energy carried away as sound or light, and the total is always accounted for. The general statement, including heat, is the [[first-law-thermodynamics|first law of thermodynamics]].

### Many forms, one quantity
| Form | Examples |
|---|---|
| Kinetic | a moving car, the wind, a river |
| Gravitational potential | water behind a dam |
| Elastic potential | a wound spring, a drawn bow |
| Thermal (internal) | hot coffee, warm brakes |
| Chemical | food, petrol, a charged battery |
| Electrical and radiant | current in a wire, sunlight |
| Nuclear, and mass itself | fuel in a reactor |

Einstein's [[mass-energy|mass–energy equivalence]] completes the list: in nuclear reactions a little mass disappears and reappears as energy, $E = mc^2$.

> [!tip] Energy problems in three steps: (1) choose the start and the end; (2) list every form of energy at each, with one reference level for heights; (3) set the total before equal to the total after, adding any work done from outside and any energy turned into heat.
`,
  ideas: [
    'The total energy of an isolated system never changes; it only changes form or moves between objects.',
    'With only conservative forces working, kinetic plus potential energy is constant.',
    'Friction and drag turn mechanical energy into thermal energy; the total is still conserved.',
    'Energy methods give speeds at given positions without needing the path or the forces along it.',
    'Starting from rest on a frictionless track, nothing can rise above its starting height.'
  ],
  pitfalls: [
    'Friction destroys energy — It turns mechanical energy into thermal energy, which is still there, just much harder to use.',
    'A steeper slope gives a faster speed at the bottom — Without friction the speed depends only on the drop in height, not on the shape.',
    'Conservation of energy tells you how long a motion takes — It links speeds and positions, not times.'
  ],
  formulas: [
    {
      name: 'Speed at a new height (no friction)',
      expr: 'v = sqrt(v0^2 + 2*g*(h0 - h))', tex: 'v = \\sqrt{v_0^2 + 2g\\,(h_0 - h)}',
      vars: {
        v: { name: 'speed at the new height', q: 'speed', unit: 'm/s' },
        v0: { name: 'speed at the start', q: 'speed', unit: 'm/s', value: 2 },
        g: { const: 'g' },
        h0: { name: 'starting height', q: 'length', unit: 'm', value: 40, signed: true },
        h: { name: 'new height', q: 'length', unit: 'm', value: 5, signed: true }
      },
      note: 'Along any path — straight, curved or looping — as long as only gravity does work.',
      stories: {
        v: 'A roller coaster passes the top of a {h0} hill at {v0}. How fast is it moving at the bottom of a dip {h} high?',
        h: 'A skateboarder moving at {v0} at a height of {h0} rolls up a ramp and slows to {v}. How high is she then?'
      }
    },
    {
      name: 'Speed at the bottom of a slope, with friction',
      expr: '0.5*m*v^2 = m*g*h - f*d', tex: '\\tfrac12 m v^2 = m g h - f d', solveFor: 'v',
      vars: {
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 20 },
        v: { name: 'speed at the bottom', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        h: { name: 'height of the slope', q: 'length', unit: 'm', value: 10 },
        f: { name: 'average friction force', q: 'force', unit: 'N', value: 30 },
        d: { name: 'length of the path', q: 'length', unit: 'm', value: 30 }
      },
      note: 'Starting from rest. The term $f d$ is the mechanical energy turned into heat.',
      stories: {
        v: 'A {m} sledge starts from rest at the top of a slope {h} high and {d} long. Friction averages {f}. How fast is it going at the bottom?',
        f: 'A {m} sledge slides from rest down a slope {h} high and {d} long, arriving at {v}. What was the average friction force?'
      }
    },
    {
      name: 'Speed of a pendulum at the bottom of its swing',
      expr: 'v = sqrt(2*g*L*(1 - cos(theta)))', tex: 'v = \\sqrt{2 g L\\,(1 - \\cos\\theta)}',
      vars: {
        v: { name: 'speed at the lowest point', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        L: { name: 'length of the pendulum', q: 'length', unit: 'm', value: 2 },
        theta: { name: 'angle it is released from', q: 'angle', unit: '°', value: 30, min: 0, max: 180 }
      },
      note: 'Released from rest; the bob drops $L(1 - \\cos\\theta)$.',
      stories: {
        v: 'A child on a swing with ropes {L} long is pulled back to {theta} and let go. How fast does she pass the lowest point?',
        theta: 'A pendulum of length {L} passes its lowest point at {v}. From what angle was it released?'
      }
    }
  ],
  examples: [
    {
      title: 'Over the hills',
      q: 'A roller coaster passes the top of a 40 m hill at 2.0 m/s. Ignoring friction, how fast is it at ground level? Can it get over a second hill 38 m high? And one 41 m high?',
      steps: [
        'Energy per kilogram at the top: $\\tfrac12 (2.0)^2 + 9.81 \\times 40 = 2.0 + 392.4 = 394.4\\ \\mathrm{J/kg}$.',
        'At ground level all of it is kinetic: $v = \\sqrt{2 \\times 394.4} = 28.1\\ \\mathrm{m/s}$.',
        'At 38 m it keeps $394.4 - 372.8 = 21.6\\ \\mathrm{J/kg}$ of kinetic energy, so it crosses at $v = \\sqrt{43.2} = 6.6\\ \\mathrm{m/s}$.',
        'It could climb at most to $394.4/9.81 = 40.2\\ \\mathrm{m}$, so a 41 m hill is out of reach: it would roll back.'
      ],
      a: '28 m/s at ground level; it crosses the 38 m hill at 6.6 m/s but cannot climb 41 m.'
    },
    {
      title: 'A sledge with friction',
      q: 'A 20 kg sledge starts from rest at the top of a slope 10 m high and 30 m long. Friction averages 30 N. How fast is it at the bottom, and how much heat is produced?',
      steps: [
        'Potential energy lost: $mgh = 20 \\times 9.81 \\times 10 = 1962\\ \\mathrm{J}$.',
        'Heat from friction: $f d = 30 \\times 30 = 900\\ \\mathrm{J}$.',
        'Kinetic energy at the bottom: $1962 - 900 = 1062\\ \\mathrm{J}$, so $v = \\sqrt{2 \\times 1062/20} = 10.3\\ \\mathrm{m/s}$.',
        'Without friction it would be $\\sqrt{2 \\times 9.81 \\times 10} = 14.0\\ \\mathrm{m/s}$.'
      ],
      a: '10.3 m/s, with 900 J turned into heat.'
    },
    {
      title: 'A swing',
      q: 'A child on a swing with 2.0 m ropes is pulled back to 30° from the vertical and let go. How fast does she pass through the lowest point?',
      steps: [
        'The seat drops by $L(1 - \\cos 30°) = 2.0 \\times (1 - 0.866) = 0.268\\ \\mathrm{m}$.',
        '$\\tfrac12 m v^2 = m g h$: $v = \\sqrt{2 \\times 9.81 \\times 0.268} = 2.29\\ \\mathrm{m/s}$.',
        'The tension in the ropes does no work — it is always at right angles to the motion — so only gravity changes her energy.'
      ],
      a: 'About 2.3 m/s.'
    }
  ],
  quiz: [
    { q: 'Three frictionless slides start at the same height and end at the same lower height: one straight, one curved, one with a bump in the middle (lower than the start). At the bottom the speeds are…', choices: ['greatest on the straight slide', 'greatest on the curved slide', 'all the same', 'smallest on the straight slide'], a: 2,
      why: 'Only the drop in height matters: ½mv² = mgΔh on every slide. (The times taken do differ.)' },
    { q: 'A pendulum bob swings from its highest point down to its lowest. Its…', choices: ['kinetic energy falls and potential energy rises', 'potential energy turns into kinetic energy', 'total energy increases', 'kinetic energy stays constant'], a: 1,
      why: 'Losing height, it gains speed: mgh becomes ½mv², with the total unchanged.' },
    { q: 'A car brakes to a stop. What happens to its kinetic energy?', choices: ['It is destroyed', 'It becomes thermal energy in the brakes, tyres and road', 'It becomes potential energy', 'It is stored in the brakes as kinetic energy'], a: 1,
      why: 'Friction turns it into internal (thermal) energy: brake discs can glow red after hard braking.' },
    { q: 'A ball dropped from 5 m bounces back to 3 m. Where did the missing energy go?', choices: ['Nowhere: energy is not conserved in bounces', 'Into heat and sound, mostly during the impact', 'Into gravitational potential energy', 'Into the ball\'s mass'], a: 1,
      why: 'About 40% of the mechanical energy became internal energy of the ball and the floor, plus a little sound.' },
    { q: 'A skater starts from rest at the top of a frictionless ramp 3 m high. She can reach a height of 3.5 m on the far side.', a: false,
      why: 'Starting at rest with only gravity doing work, she can at most return to 3 m, where all her energy is potential again.' }
  ],
  applications: [
    'Roller coasters, ski jumps and hydroelectric schemes are designed with energy budgets.',
    'Hybrid and electric vehicles recover braking energy into their batteries.',
    'Nutrition: the energy in food balances the body\'s work and heat output.',
    'Power stations are chains of conversions: chemical or nuclear to thermal to kinetic to electrical.'
  ],
  history: 'The law took shape in the 1840s. Julius Robert Mayer argued for it from physiology, James Prescott Joule measured how much mechanical work produces a given amount of heat, and Hermann von Helmholtz gave the general statement in 1847.',
  sim: 'mech1-skate-park'
},

{
  id: 'power', parent: 'work-energy', title: 'Power', level: 1,
  short: 'The rate at which work is done or energy is transferred: P = W/t, measured in watts. A force pushing at speed v delivers P = Fv.',
  keywords: ['power', 'watt', 'W', 'horsepower', 'kilowatt-hour', 'kWh', 'rate of doing work', 'P = Fv', 'energy per second'],
  prereq: ['work', 'force', 'speed-velocity'],
  related: ['efficiency', 'electric-power', 'drag-force', 'kinetic-energy'],
  body: `
Two people climb the same staircase, one walking and one running. They do the same [[work]] against gravity, but the runner does it faster. **Power** is the rate of doing work, or of transferring energy:

$$P = \\frac{W}{t} = \\frac{\\Delta E}{t}$$

Its unit is the **watt**: $1\\ \\mathrm{W} = 1\\ \\mathrm{J/s}$. Older units survive too: one horsepower is about 746 W.

### Power and speed
When a force $F$ pushes something along at speed $v$, it does work $F\\,\\Delta x$ in a time $\\Delta t$, so

$$P = F v$$

This explains a lot. A car at steady speed on a level road needs just enough power to overcome drag and rolling resistance, $P = F_{\\text{res}}\\, v$. Because air drag grows as $v^2$ ([[drag-force|air resistance]]), the power needed to beat it grows as $v^3$: doubling a cyclist's speed takes about eight times the power. And for a given engine power, a low gear gives a large force at a low speed (climbing a hill), a high gear a small force at a high speed.

### Numbers
| Machine or person | Power |
|---|---|
| Human body at rest | 100 W |
| Cyclist, steady effort | 200 W |
| Elite cyclist, for an hour | 400 W |
| Sprinter, brief peak | 2 kW |
| Electric kettle | 2–3 kW |
| Family car engine | 100 kW |
| Large wind turbine | 3–15 MW |
| Large power-station unit | 1 GW |

### Energy from power
Energy is power multiplied by time, and electricity bills use exactly that: the **kilowatt-hour** is the energy delivered by 1 kW for one hour, $1\\ \\mathrm{kWh} = 3.6\\ \\mathrm{MJ}$. A 2 kW heater running for 3 hours uses 6 kWh. Mind the difference: the kilowatt is a rate, the kilowatt-hour an amount.

### Average and instantaneous power
$W/t$ gives the average power over a time; $P = dW/dt = \\vec F \\cdot \\vec v$ gives it at an instant. An engine's rated power is its maximum; most of the time it delivers far less. And only part of the power going in comes out as useful power — the ratio is the [[efficiency]].
`,
  ideas: [
    'Power is the rate of doing work or transferring energy: P = W/t, in watts (J/s).',
    'A force pushing at speed v delivers power P = Fv.',
    'Against air drag, the power needed grows as the cube of the speed.',
    'The kilowatt-hour is an amount of energy (3.6 MJ); the kilowatt is a rate.'
  ],
  pitfalls: [
    'The kW and the kWh are the same — The kW measures a rate; the kWh measures energy, a rate multiplied by a time.',
    'More power always means more work — Only over the same time. A 1 kW motor running for an hour does more work than a 3 kW motor running for ten minutes.',
    'A car needs power only to accelerate — At steady speed it still needs power to push through the air and overcome rolling resistance; at motorway speeds that uses most of its fuel.'
  ],
  formulas: [
    {
      name: 'Average power',
      expr: 'P = W/t', tex: 'P = \\frac{W}{t}',
      vars: {
        P: { name: 'power', q: 'power', unit: 'W' },
        W: { name: 'work done (energy transferred)', q: 'energy', unit: 'J', value: 2750 },
        t: { name: 'time taken', q: 'time', unit: 's', value: 5 }
      },
      stories: {
        P: 'A climber does {W} of work in {t}. What is her average power?',
        t: 'How long does a {P} motor take to do {W} of work?'
      }
    },
    {
      name: 'Power from force and speed',
      expr: 'P = F*v', tex: 'P = F v',
      vars: {
        P: { name: 'power delivered', q: 'power', unit: 'kW' },
        F: { name: 'force along the motion', q: 'force', unit: 'N', value: 600 },
        v: { name: 'speed', q: 'speed', unit: 'km/h', value: 108 }
      },
      stories: {
        P: 'A car cruises at {v} against resistive forces totalling {F}. What power must its wheels deliver?',
        F: 'A {P} tractor pulls a plough at {v}. What pulling force does it provide?'
      }
    },
    {
      name: 'Power to climb',
      expr: 'P = m*g*h/t', tex: 'P = \\frac{m g h}{t}',
      vars: {
        P: { name: 'power against gravity', q: 'power', unit: 'W' },
        m: { name: 'mass lifted', q: 'mass', unit: 'kg', value: 70 },
        g: { const: 'g' },
        h: { name: 'height climbed', q: 'length', unit: 'm', value: 4 },
        t: { name: 'time taken', q: 'time', unit: 's', value: 5 }
      },
      stories: {
        P: 'A {m} student runs up stairs {h} high in {t}. What is her average power output against gravity?',
        t: 'A {P} crane motor lifts a {m} load through {h}. How long does it take, with no losses?'
      }
    }
  ],
  examples: [
    {
      title: 'Running up the stairs',
      q: 'A 70 kg student runs up a staircase 4.0 m high in 5.0 s. What is her power output against gravity? What if she walks up in 15 s?',
      steps: [
        'Work against gravity: $mgh = 70 \\times 9.81 \\times 4.0 = 2750\\ \\mathrm{J}$, the same either way.',
        'Running: $P = 2750/5.0 = 550\\ \\mathrm{W}$, about three quarters of a horsepower.',
        'Walking: $P = 2750/15 = 183\\ \\mathrm{W}$.'
      ],
      a: '550 W running, 183 W walking — the same work.'
    },
    {
      title: 'Cruising faster',
      q: 'At 30 m/s (108 km/h) a car meets 200 N of rolling resistance and 400 N of air drag. Find the power needed. At 40 m/s the rolling resistance is unchanged but the drag grows as $v^2$: what power is needed then?',
      steps: [
        'At 30 m/s: $P = (200 + 400) \\times 30 = 18\\ \\mathrm{kW}$.',
        'At 40 m/s the drag is $400 \\times (40/30)^2 = 711\\ \\mathrm{N}$, so the total is 911 N.',
        '$P = 911 \\times 40 = 36\\ \\mathrm{kW}$ — a third more speed needs twice the power.'
      ],
      a: '18 kW at 30 m/s; about 36 kW at 40 m/s.'
    },
    {
      title: 'Kilowatts and kilowatt-hours',
      q: 'A 2.0 kW heater runs for 3 hours a day. How much energy does it use each day, in kWh and in joules? If a kWh costs 30 cents, what does a day cost?',
      steps: [
        'Energy = power × time: $2.0\\ \\mathrm{kW} \\times 3\\ \\mathrm{h} = 6.0\\ \\mathrm{kWh}$.',
        'In joules: $6.0 \\times 3.6\\times10^{6} = 2.2\\times10^{7}\\ \\mathrm{J}$.',
        'Cost: $6.0 \\times 30 = 180$ cents a day.'
      ],
      a: '6.0 kWh (22 MJ) a day, costing 180 cents.'
    }
  ],
  quiz: [
    { q: 'Two students of equal mass climb the same stairs, one in 10 s and the other in 20 s. The faster one…', choices: ['does twice the work', 'develops twice the power', 'does half the work', 'develops the same power'], a: 1,
      why: 'The work mgh is the same; doing it in half the time takes twice the power.' },
    { q: 'A kilowatt-hour is a unit of…', choices: ['power', 'energy', 'force', 'time'], a: 1,
      why: 'Power × time = energy: 1 kWh = 1000 W × 3600 s = 3.6 MJ.' },
    { q: 'A cyclist doubles her speed on the flat, where air drag dominates. The power she needs rises about…', choices: ['2 times', '4 times', '8 times', '16 times'], a: 2,
      why: 'Drag grows as v², and P = Fv grows as v³: 2³ = 8.' },
    { q: 'At full engine power, a lorry climbs a steep hill slowly in a low gear, because a given power can deliver either a large force or a high speed, but not both.', a: true,
      why: 'P = Fv: at fixed power, a larger force means a lower speed.' }
  ],
  applications: [
    'Engine and motor ratings, from hair dryers to power stations.',
    'Cyclists and rowers train with power meters that read in watts.',
    'Electricity bills charge for energy in kilowatt-hours.',
    'Vehicle design balances engine power against aerodynamic drag, whose power demand grows as v³.'
  ],
  history: 'James Watt defined the horsepower around 1782 to market his steam engines, from the work a mill horse could do: 33 000 foot-pounds per minute, about 746 W. The SI unit of power is named after him.'
},

{
  id: 'efficiency', parent: 'work-energy', title: 'Efficiency', level: 1,
  short: 'The fraction of the energy put into a device that comes out in the useful form. It is always less than 100%; the rest usually becomes heat.',
  keywords: ['efficiency', 'useful energy', 'wasted energy', 'energy losses', 'Sankey diagram', 'percentage efficiency', 'heat engine', 'coefficient of performance'],
  prereq: ['power', 'conservation-of-energy'],
  related: ['heat-engines', 'carnot-cycle', 'second-law-thermodynamics', 'refrigerators-heat-pumps', 'electric-power'],
  body: `
No machine turns all the energy it takes in into the form you want. A car engine turns petrol into motion — and a lot of heat. A light bulb makes light — and heat. **Efficiency** is the fraction that ends up useful:

$$\\eta = \\frac{\\text{useful energy out}}{\\text{energy in}} = \\frac{P_{\\text{out}}}{P_{\\text{in}}}$$

It is a pure number between 0 and 1, often written as a percentage. Because energy is [[conservation-of-energy|conserved]], the rest is not destroyed; it is "wasted" into forms nobody wanted — nearly always thermal energy, sometimes sound or stray light.

### Typical efficiencies
| Device | Efficiency |
|---|---|
| Large electric motor | 90–97% |
| Large transformer | up to 99% |
| Electric kettle (energy into the water) | 80–90% |
| Commercial solar cell | 18–23% |
| Petrol car engine, at its best | 30–35% |
| Human muscle | about 20–25% |
| Large power station (heat to electricity) | 35–60% |

Heat engines — anything that turns heat into work, from car engines to power stations — meet a fundamental limit from the [[second-law-thermodynamics|second law of thermodynamics]]: even a perfect engine must reject some heat, and its efficiency cannot exceed the [[carnot-cycle|Carnot]] value $1 - T_{\\text{cold}}/T_{\\text{hot}}$. Electric motors are not heat engines and can come close to 100%.

### Chains multiply
When energy passes through several stages, the overall efficiency is the **product** of the stages. Electricity from a gas power station (50%), carried through the grid (93%), driving a motor (90%), gives $0.50 \\times 0.93 \\times 0.90 = 42\\%$ — less than any single stage. That is why cutting out conversion steps saves so much energy.

### Sankey diagrams
Engineers draw energy flows as arrows whose widths are proportional to the power: a wide arrow in, a narrower useful arrow out, and side arrows for each loss. They make it obvious where an improvement is worth making.

> [!note] A heat pump seems to beat 100%: 1 kWh of electricity can deliver 3–4 kWh of heat to a house. It breaks no rule — it *moves* heat in from outside rather than making it, and its figure of merit is a coefficient of performance, not an efficiency (see [[refrigerators-heat-pumps|heat pumps]]).
`,
  ideas: [
    'Efficiency is the fraction of the input energy (or power) that comes out in the useful form.',
    'It is always less than 100%; the rest usually ends up as thermal energy.',
    'In a chain of conversions, the efficiencies multiply.',
    'Heat engines are limited by the second law of thermodynamics; electric motors are not.'
  ],
  pitfalls: [
    'Wasted energy is destroyed — It still exists, usually as heat spread into the surroundings, where it is hard to use.',
    'Efficiencies in a chain add or average — They multiply, so each extra stage lowers the total.',
    'A heat pump is more than 100% efficient — It moves heat rather than creating it; its coefficient of performance is not an efficiency.'
  ],
  formulas: [
    {
      name: 'Efficiency',
      expr: 'eta = Pout/Pin', tex: '\\eta = \\frac{P_{\\text{out}}}{P_{\\text{in}}}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', min: 0, max: 100 },
        Pout: { name: 'useful power (or energy) out', q: 'power', unit: 'W', value: 294, tex: 'P_{\\text{out}}' },
        Pin: { name: 'power (or energy) in', q: 'power', unit: 'W', value: 400, tex: 'P_{\\text{in}}' }
      },
      note: 'Works just as well with energies: $\\eta = E_{\\text{out}}/E_{\\text{in}}$.',
      stories: {
        eta: 'A motor draws {Pin} and delivers {Pout} of mechanical power. What is its efficiency?',
        Pin: 'A motor with an efficiency of {eta} must deliver {Pout}. How much power does it draw?'
      }
    },
    {
      name: 'Efficiency of a chain of three stages',
      expr: 'eta = eta1*eta2*eta3', tex: '\\eta = \\eta_1\\,\\eta_2\\,\\eta_3',
      vars: {
        eta: { name: 'overall efficiency', q: 'ratio', unit: '%', min: 0, max: 100 },
        eta1: { name: 'efficiency of the first stage', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        eta2: { name: 'efficiency of the second stage', q: 'ratio', unit: '%', value: 93, min: 0, max: 100 },
        eta3: { name: 'efficiency of the third stage', q: 'ratio', unit: '%', value: 90, min: 0, max: 100 }
      },
      stories: { eta: 'Electricity is generated at {eta1} efficiency, transmitted at {eta2} and used in a motor of {eta3}. What is the overall efficiency?' }
    },
    {
      name: 'Efficiency of a lifting motor',
      expr: 'eta = m*g*h/(P*t)', tex: '\\eta = \\frac{m g h}{P\\,t}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', min: 0, max: 100 },
        m: { name: 'mass lifted', q: 'mass', unit: 'kg', value: 50 },
        g: { const: 'g' },
        h: { name: 'height lifted', q: 'length', unit: 'm', value: 12 },
        P: { name: 'electrical power drawn', q: 'power', unit: 'W', value: 400 },
        t: { name: 'time taken', q: 'time', unit: 's', value: 20 }
      },
      stories: {
        eta: 'A winch motor drawing {P} lifts a {m} load through {h} in {t}. What is its efficiency?',
        t: 'A winch with an efficiency of {eta}, drawing {P}, lifts {m} through {h}. How long does it take?'
      }
    }
  ],
  examples: [
    {
      title: 'A winch',
      q: 'A winch motor draws 400 W and lifts a 50 kg load 12 m in 20 s. What is its efficiency, and where does the rest go?',
      steps: [
        'Useful energy: $mgh = 50 \\times 9.81 \\times 12 = 5890\\ \\mathrm{J}$.',
        'Energy in: $P t = 400 \\times 20 = 8000\\ \\mathrm{J}$.',
        '$\\eta = 5890/8000 = 0.74$, or 74%.',
        'The other 2110 J heats the motor windings, the gearbox and the cable, with a little sound.'
      ],
      a: 'About 74%; the remaining 2.1 kJ becomes heat.'
    },
    {
      title: 'From power station to plug to motion',
      q: 'A gas power station converts fuel to electricity at 50%, the grid delivers 93% of it, and an electric motor converts 90% of that into mechanical work. What is the overall efficiency, and how much fuel energy is burned for each kilowatt-hour of mechanical work?',
      steps: [
        'Overall: $\\eta = 0.50 \\times 0.93 \\times 0.90 = 0.42$, or 42%.',
        'Fuel energy per kWh of work: $1/0.42 = 2.4\\ \\mathrm{kWh}$.'
      ],
      a: '42%; about 2.4 kWh of fuel for each kWh of work.'
    },
    {
      title: 'Fuel for the motorway',
      q: 'A car needs 18 kW at its wheels to cruise at 108 km/h. Its engine is 30% efficient, and petrol holds about 34 MJ per litre. Estimate its fuel use in litres per 100 km.',
      steps: [
        'Fuel power: $18/0.30 = 60\\ \\mathrm{kW}$, that is 60 kJ of petrol energy every second.',
        'One hour at 108 km/h uses $60\\,000 \\times 3600 = 2.16\\times10^{8}\\ \\mathrm{J}$, which is $2.16\\times10^{8}/3.4\\times10^{7} = 6.4$ litres.',
        'Per 100 km: $6.4 \\times 100/108 = 5.9$ litres.'
      ],
      a: 'About 6 litres per 100 km.'
    }
  ],
  quiz: [
    { q: 'A motor takes in 500 J of electrical energy and gives a load 350 J of potential energy. Its efficiency is…', choices: ['35%', '70%', '143%', '150 J'], a: 1,
      why: '350/500 = 0.70 = 70%. The other 150 J became heat and sound.' },
    { q: 'Three stages with efficiencies of 90%, 80% and 50% work in a chain. The overall efficiency is…', choices: ['220%', '73%', '50%', '36%'], a: 3,
      why: 'Efficiencies multiply: 0.9 × 0.8 × 0.5 = 0.36.' },
    { q: 'Where does most of the "wasted" energy of a car engine go?', choices: ['It is destroyed', 'Into heat, carried away by the exhaust and the cooling system', 'Into the car\'s kinetic energy', 'Back into the fuel tank'], a: 1,
      why: 'Roughly two thirds of the fuel\'s energy leaves as heat in the exhaust gases and through the radiator.' },
    { q: 'An electric motor can in principle be far more efficient than a petrol engine, because it is not a heat engine limited by the second law of thermodynamics.', a: true,
      why: 'Heat engines must reject heat to their surroundings; motors convert electrical to mechanical energy directly, losing only a little to resistance and friction.' }
  ],
  applications: [
    'Energy labels on appliances, cars and buildings.',
    'Power-station and grid design, where each percentage point is worth millions.',
    'LED lighting and heat pumps, the largest recent efficiency gains in homes.'
  ]
}

);
