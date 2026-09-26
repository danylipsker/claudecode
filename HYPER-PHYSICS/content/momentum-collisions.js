/* HYPER-PHYSICS · content/momentum-collisions.js — momentum and collisions: momentum,
 * impulse, conservation of momentum, elastic and inelastic collisions, the centre of mass
 * and rocket propulsion. */
Hyper.add(

{
  id: 'momentum', parent: 'momentum-collisions', title: 'Momentum', level: 1,
  short: 'Mass times velocity, p = mv: a vector that measures how hard a moving object is to stop, and that forces change at the rate F = dp/dt.',
  keywords: ['momentum', 'linear momentum', 'p = mv', 'kg m/s', 'newton second', 'quantity of motion', 'vector', 'rate of change of momentum'],
  prereq: ['newtons-second-law', 'speed-velocity'],
  related: ['kinetic-energy', 'impulse', 'conservation-of-momentum', 'relativistic-momentum', 'angular-momentum', 'de-broglie-wavelength'],
  body: `
A slow lorry and a fast tennis ball are both hard to stop, for different reasons: one has a great deal of mass, the other a great deal of speed. **Momentum** combines the two:

$$\\vec p = m\\,\\vec v$$

It is a vector, pointing the same way as the velocity, and its SI unit is the kilogram metre per second (kg·m/s), which is the same as the newton second (N·s).

| Object | Mass | Speed | Momentum |
|---|---|---|---|
| Rifle bullet | 10 g | 800 m/s | 8 kg·m/s |
| Baseball, fast pitch | 145 g | 40 m/s | 5.8 kg·m/s |
| Sprinter | 80 kg | 10 m/s | 800 kg·m/s |
| Car at 72 km/h | 1500 kg | 20 m/s | 30 000 kg·m/s |
| Loaded lorry at 90 km/h | 40 t | 25 m/s | 1 000 000 kg·m/s |

### Force changes momentum
Newton actually stated his second law in terms of momentum: the net force on an object equals the rate at which its momentum changes,

$$\\vec F_{\\text{net}} = \\frac{d\\vec p}{dt}$$

For a constant mass this is $m\\vec a$ again. Multiplied by a time, it says that a force acting for a while produces a definite change of momentum — the [[impulse]]. The same change can come from a large force for a short time or a small force for a long time, which is the secret of seat belts, airbags and catching an egg without breaking it.

### Momentum is a vector
Directions matter. A 0.5 kg ball hitting a wall at 6 m/s and bouncing straight back at 6 m/s changes its momentum from $+3$ to $-3\\ \\mathrm{kg\\,m/s}$: a change of 6, not zero. In two dimensions, handle momentum by components, exactly like velocity.

### Why momentum matters
In any collision or explosion the forces between the objects are equal and opposite ([[newtons-third-law|third law]]), so the momentum one gains the other loses: the total is **conserved** ([[conservation-of-momentum]]). That makes momentum the key to every collision problem. It also runs deeper than $m\\vec v$: light carries momentum without having mass, and in relativity and quantum mechanics momentum survives where the simple formula does not (see [[relativistic-momentum]] and [[de-broglie-wavelength|matter waves]]).

### Momentum and kinetic energy
Both grow with mass and speed, but $p = mv$ is a vector proportional to the speed, while $E_k = \\tfrac12 mv^2 = p^2/2m$ is a scalar that grows with its square. Two objects with equal momentum can have very different energies — see [[kinetic-energy]].
`,
  ideas: [
    'Momentum is mass times velocity, p = mv: a vector along the velocity.',
    'Its unit is the kg·m/s, the same as the newton second.',
    'The net force equals the rate of change of momentum, F = dp/dt.',
    'Reversing an object\'s direction changes its momentum by twice its size.',
    'The total momentum of a system is conserved whenever no net external force acts.'
  ],
  pitfalls: [
    'Momentum and kinetic energy are the same thing — Momentum is a vector proportional to v; kinetic energy is a scalar proportional to v². Collisions always conserve the first, not always the second.',
    'A bounce changes momentum less than a dead stop — Bouncing back reverses the momentum, a change of up to twice its size; stopping dead changes it only by its size.',
    'The heavier object always has more momentum — Speed counts just as much: a rifle bullet carries more momentum than a football rolling at walking pace.'
  ],
  formulas: [
    {
      name: 'Momentum',
      expr: 'p = m*v', tex: 'p = m v',
      vars: {
        p: { name: 'momentum', q: 'momentum', unit: 'kg·m/s', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1500 },
        v: { name: 'velocity', q: 'speed', unit: 'km/h', value: 72, signed: true }
      },
      stories: {
        p: 'What is the momentum of a {m} car travelling at {v}?',
        v: 'How fast must a {m} sprinter run to have a momentum of {p}?'
      }
    },
    {
      name: 'Change of momentum',
      expr: 'dp = m*(v2 - v1)', tex: '\\Delta p = m\\,(v_2 - v_1)',
      vars: {
        dp: { name: 'change of momentum', q: 'momentum', unit: 'kg·m/s', tex: '\\Delta p', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        v1: { name: 'velocity before', q: 'speed', unit: 'm/s', value: 6, signed: true },
        v2: { name: 'velocity after (negative if it bounced back)', q: 'speed', unit: 'm/s', value: -6, signed: true }
      },
      stories: {
        dp: 'A {m} ball hits a wall at {v1} and leaves it with a velocity of {v2}. What is its change of momentum?',
        v2: 'A {m} ball arriving at {v1} has its momentum changed by {dp} by a wall. What is its velocity afterwards?'
      }
    }
  ],
  examples: [
    {
      title: 'A fastball and a creeping car',
      q: 'A 145 g baseball is pitched at 40 m/s. How fast would a 1500 kg car have to creep to have the same momentum? Compare their kinetic energies.',
      steps: [
        'Baseball: $p = 0.145 \\times 40 = 5.8\\ \\mathrm{kg\\,m/s}$.',
        'Car: $v = p/m = 5.8/1500 = 0.0039\\ \\mathrm{m/s}$ — about 4 mm per second.',
        'Kinetic energies: ball $\\tfrac12 (0.145)(40)^2 = 116\\ \\mathrm{J}$; car $\\tfrac12 (1500)(0.0039)^2 = 0.011\\ \\mathrm{J}$.',
        'The same momentum can go with wildly different kinetic energies: $E_k = p^2/2m$ is small for a large mass.'
      ],
      a: 'About 4 mm/s; the ball has some ten thousand times more kinetic energy.'
    },
    {
      title: 'Momentum by components',
      q: 'A 0.40 kg football moving at 12 m/s due east is kicked so that it moves at 16 m/s due north. What change of momentum did the kick give it?',
      steps: [
        'Before: $\\vec p_1 = (0.40 \\times 12,\\ 0) = (4.8,\\ 0)\\ \\mathrm{kg\\,m/s}$ (east, north).',
        'After: $\\vec p_2 = (0,\\ 0.40 \\times 16) = (0,\\ 6.4)\\ \\mathrm{kg\\,m/s}$.',
        'Change: $\\Delta\\vec p = \\vec p_2 - \\vec p_1 = (-4.8,\\ 6.4)$, of size $\\sqrt{4.8^2 + 6.4^2} = 8.0\\ \\mathrm{kg\\,m/s}$.',
        'Direction: $\\arctan(4.8/6.4) = 37°$ west of north — neither east nor north, because the kick had to cancel the eastward motion as well as create the northward one.'
      ],
      a: '8.0 kg·m/s, pointing 37° west of north.'
    }
  ],
  quiz: [
    { q: 'Which has the greater momentum: a 60 kg runner at 5 m/s or a 1000 kg car rolling at 0.2 m/s?', choices: ['The runner', 'The car', 'They are equal', 'It cannot be told without directions'], a: 0,
      why: 'Runner: 300 kg·m/s. Car: 200 kg·m/s.' },
    { q: 'A 2 kg ball moving at 3 m/s hits a wall and bounces straight back at 3 m/s. The size of its change of momentum is…', choices: ['0', '6 kg·m/s', '12 kg·m/s', '18 kg·m/s'], a: 2,
      why: 'From +6 to −6 kg·m/s: a change of 12 kg·m/s. Momentum is a vector, so reversing it counts double.' },
    { q: 'The unit N·s is the same as…', choices: ['J', 'kg·m/s', 'kg·m/s²', 'W'], a: 1,
      why: '1 N·s = 1 (kg·m/s²)·s = 1 kg·m/s.' },
    { q: 'Two objects with the same momentum always have the same kinetic energy.', a: false,
      why: '$E_k = p^2/2m$: with equal momentum, the lighter object has more kinetic energy.' }
  ],
  applications: [
    'Accident investigators use momentum to work out vehicle speeds before a crash.',
    'Sport: bats, clubs, rackets and boots pass momentum to a ball.',
    'Spacecraft steer with small thrusters that change their momentum a little at a time.'
  ],
  history: 'René Descartes made "quantity of motion" — mass times speed — the central quantity of his physics in 1644, but ignored direction and so got collisions wrong. Answering a challenge from the Royal Society in 1668, John Wallis, Christopher Wren and Christiaan Huygens showed that the conserved quantity is mass times velocity, with its sign.',
  sim: 'mech1-collisions'
},

{
  id: 'impulse', parent: 'momentum-collisions', title: 'Impulse', level: 1,
  short: 'A force acting for a time gives an impulse, FΔt, equal to the change of momentum it produces. Spreading a stop over a longer time lowers the force.',
  keywords: ['impulse', 'impulse-momentum theorem', 'force-time graph', 'average force', 'contact time', 'airbag', 'crumple zone', 'follow through', 'N s'],
  prereq: ['momentum', 'newtons-second-law'],
  related: ['work-energy-theorem', 'conservation-of-momentum', 'newtons-third-law', 'rocket-propulsion', 'math:definite-integral'],
  body: `
Catch a raw egg by letting your hands swing back with it and it survives; hold your hands rigid and it breaks. Either way the egg's momentum goes from its falling value to zero. What differs is how long that takes. The link between force, time and momentum is **impulse**.

### The impulse–momentum theorem
A force $F$ acting for a time $\\Delta t$ delivers an **impulse** $J = F\\,\\Delta t$, and by [[newtons-second-law|Newton's second law]] ($F = \\Delta p/\\Delta t$) this equals the change of momentum:

$$J = F\\,\\Delta t = \\Delta p = m v - m v_0$$

The unit is the newton second, the same as the kg·m/s. If the force varies — as it nearly always does in an impact — the impulse is the **area under the force–time graph**, $J = \\int F\\,dt$ (a [[math:definite-integral|definite integral]]), and $F$ above means the average force over the contact.

### Soft landings
For a given change of momentum, the average force is inversely proportional to the time it takes:

$$F_{\\text{avg}} = \\frac{\\Delta p}{\\Delta t}$$

Stretch the time and the force falls. That single idea explains
- **crumple zones, airbags and seat belts**, which make a crash last a tenth of a second instead of a hundredth;
- **bending your knees** when you land, and rolling as you fall;
- **padded gloves, cycle helmets, gym mats and running shoes**;
- catching a ball by drawing your hands back with it.

A 70 kg occupant brought to rest from 15 m/s (54 km/h) in 0.10 s by a belt and airbag feels an average force of about 10 kN; stopped in 0.010 s by a rigid dashboard, ten times as much.

### Big impulses in short times
Sport runs the idea the other way. A racket, club or boot touches the ball for only a few milliseconds, so to give it a large change of momentum the force must be enormous: a 46 g golf ball leaving the tee at 70 m/s after half a millisecond of contact has felt an average force of about 6 kN — more than ten thousand times its own weight. And bouncing takes more impulse than stopping: a ball that rebounds has its momentum reversed, not merely cancelled, so the wall must supply up to twice the impulse.

### Impulse or work?
Force × *time* gives the change of momentum; force × *distance* gives the change of kinetic energy ([[work-energy-theorem]]). Use impulse when you know or want a duration, work when you know or want a distance.
`,
  ideas: [
    'Impulse is force multiplied by the time it acts: J = FΔt.',
    'Impulse equals the change of momentum: FΔt = mv − mv₀.',
    'For a varying force, the impulse is the area under the force–time graph.',
    'The same change of momentum spread over a longer time needs a smaller force.',
    'A bounce needs more impulse than a stop, because the momentum is reversed.'
  ],
  pitfalls: [
    'Airbags reduce your change of momentum — The change is the same, since you still stop; they reduce the force by making the stop last longer.',
    'A large force always gives a large change of momentum — Only if it lasts. A huge force for a microsecond can give a small impulse.',
    'Stopping and bouncing need the same impulse — Bouncing reverses the momentum, so it needs up to twice as much.'
  ],
  formulas: [
    {
      name: 'Impulse of a force',
      expr: 'J = F*t', tex: 'J = F\\,\\Delta t',
      vars: {
        J: { name: 'impulse', q: 'momentum', unit: 'N·s', signed: true },
        F: { name: 'average force', q: 'force', unit: 'N', value: 600, signed: true },
        t: { name: 'duration of the force', q: 'time', unit: 'ms', value: 5, tex: '\\Delta t' }
      },
      stories: {
        J: 'A racket pushes on a tennis ball with an average force of {F} for {t}. What impulse does it give?',
        F: 'A kick gives a ball an impulse of {J} during a contact lasting {t}. What is the average force?'
      }
    },
    {
      name: 'Impulse–momentum theorem',
      expr: 'F*t = m*(v - v0)', tex: 'F\\,\\Delta t = m v - m v_0', solveFor: 'F',
      vars: {
        F: { name: 'average force', q: 'force', unit: 'N', signed: true },
        t: { name: 'contact time', q: 'time', unit: 'ms', value: 10, tex: '\\Delta t' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.43 },
        v: { name: 'velocity afterwards', q: 'speed', unit: 'm/s', value: 25, signed: true },
        v0: { name: 'velocity before', q: 'speed', unit: 'm/s', value: -5, signed: true }
      },
      note: 'Give the velocities signs: a ball arriving towards the kicker and leaving away from him has velocities of opposite sign.',
      stories: {
        F: 'A {m} football arriving with a velocity of {v0} is kicked back with a velocity of {v}; the boot touches it for {t}. What is the average force?',
        v: 'A {m} ball moving at {v0} is pushed by an average force of {F} for {t}. What is its velocity afterwards?'
      }
    }
  ],
  examples: [
    {
      title: 'Seat belt, airbag — or dashboard',
      q: 'A 70 kg car occupant moving at 54 km/h is brought to rest. Find the average force if the stop takes 0.10 s (belt and airbag) and if it takes 0.010 s (a rigid dashboard).',
      steps: [
        '$54\\ \\mathrm{km/h} = 15\\ \\mathrm{m/s}$, so $\\Delta p = 0 - 70 \\times 15 = -1050\\ \\mathrm{kg\\,m/s}$ in either case.',
        'Belt and airbag: $F = 1050/0.10 = 10.5\\ \\mathrm{kN}$, about 15 times body weight — survivable.',
        'Dashboard: $F = 1050/0.010 = 105\\ \\mathrm{kN}$, ten times more, concentrated on a small area of the body.'
      ],
      a: '10.5 kN with belt and airbag; 105 kN against the dashboard.'
    },
    {
      title: 'A tennis ball against a wall',
      q: 'A 57 g tennis ball hits a wall at 30 m/s and rebounds at 25 m/s; the contact lasts 5.0 ms. Find the impulse and the average force. What would the force have been if the ball had stopped dead in the same time?',
      steps: [
        'Towards the wall positive: $u = +30$, $v = -25\\ \\mathrm{m/s}$.',
        '$J = m(v - u) = 0.057 \\times (-25 - 30) = -3.1\\ \\mathrm{N\\,s}$ — pointing away from the wall.',
        '$F = J/\\Delta t = 3.1/0.0050 = 630\\ \\mathrm{N}$, more than a thousand times the ball\'s weight.',
        'Stopping dead: $J = -0.057 \\times 30 = -1.7\\ \\mathrm{N\\,s}$, $F = 340\\ \\mathrm{N}$. The bounce needs almost twice the impulse.'
      ],
      a: 'An impulse of 3.1 N·s and an average force of about 630 N (340 N if it had stopped dead).'
    },
    {
      title: 'Reading a force–time graph',
      q: 'A bat strikes a 0.16 kg ball at rest. The force rises steadily from 0 to 800 N in 2.0 ms, then falls steadily back to 0 in another 2.0 ms. How fast does the ball leave?',
      steps: [
        'The impulse is the area of the triangle under the force–time graph: $\\tfrac12 \\times 0.0040\\ \\mathrm{s} \\times 800\\ \\mathrm{N} = 1.6\\ \\mathrm{N\\,s}$.',
        'It equals the ball\'s change of momentum: $v = 1.6/0.16 = 10\\ \\mathrm{m/s}$.',
        'The average force over the 4.0 ms contact is 400 N, half the peak.'
      ],
      a: '10 m/s.'
    }
  ],
  quiz: [
    { q: 'Why does an airbag reduce injuries in a crash?', choices: ['It reduces the occupant\'s change of momentum', 'It makes the stop last longer, so the average force is smaller', 'It makes the occupant lighter', 'It absorbs all the momentum so that none is left'], a: 1,
      why: 'The occupant\'s momentum still goes to zero — the same impulse — but spread over a longer time the average force is smaller.' },
    { q: 'A force of 200 N acts on a ball for 0.05 s. The impulse is…', choices: ['10 N·s', '4000 N·s', '0.00025 N·s', '200 N·s'], a: 0,
      why: 'J = FΔt = 200 × 0.05 = 10 N·s.' },
    { q: 'Two identical balls hit a wall at the same speed. One bounces back, the other sticks. Which receives the larger impulse from the wall?', choices: ['The one that sticks', 'The one that bounces', 'Both the same', 'Neither: walls give no impulse'], a: 1,
      why: 'Sticking changes the momentum from mv to 0; bouncing changes it from mv to about −mv — nearly twice as much.' },
    { q: 'A 0.40 kg ball at rest is kicked with an average force of 800 N for 8.0 ms. Its speed afterwards is…', choices: ['16 m/s', '6.4 m/s', '2.6 m/s', '100 m/s'], a: 0,
      why: 'J = 800 × 0.0080 = 6.4 N·s = Δp, so v = 6.4/0.40 = 16 m/s.' },
    { q: 'On a force–time graph of an impact, the impulse is the area under the curve.', a: true,
      why: 'Impulse adds up force × small time intervals over the whole contact: the area.' }
  ],
  applications: [
    'Crumple zones, airbags and seat belts lengthen a crash to lower the forces on the occupants.',
    'Helmets, gym mats and running shoes spread impacts over a longer time.',
    'Force plates and crash-test sensors record force–time curves and integrate them to find impulses.',
    'Spacecraft thrusters are rated by the total impulse they can deliver.'
  ]
},

{
  id: 'conservation-of-momentum', parent: 'momentum-collisions', title: 'Conservation of momentum', level: 1,
  short: 'With no net external force, the total momentum of a system never changes — in collisions, explosions and recoil, however complicated the forces inside.',
  keywords: ['conservation of momentum', 'law of conservation of momentum', 'isolated system', 'recoil', 'explosion', 'closed system', 'internal forces', 'collision'],
  prereq: ['momentum', 'newtons-third-law', 'impulse'],
  related: ['elastic-collisions', 'inelastic-collisions', 'rocket-propulsion', 'center-of-mass', 'angular-momentum'],
  body: `
Two skaters push off from each other; a rifle kicks back as it fires; a firework shell bursts into fragments; two cars collide. In each case the objects push on each other with forces that are enormous, complicated and hard to measure. Yet one thing is simple: **the total momentum before equals the total momentum after**.

> [!key] **Conservation of momentum.** If no net external force acts on a system, its total momentum stays constant: $\\sum m\\vec v = \\text{constant}$.

### Why it holds
When two objects interact, [[newtons-third-law|Newton's third law]] says the forces they exert on each other are equal and opposite, and they last for exactly the same time. So their [[impulse|impulses]] are equal and opposite, and the momentum one gains is exactly what the other loses. Internal forces can move momentum around inside a system but never change the total. Only an outside force can.

### Using it
1. Define the system so that the forces you do not know are *internal* — for a collision, include both objects.
2. Check that external forces are absent, balanced, or negligible over the short time of the event. Friction and gravity do act during a car crash, but over a tenth of a second their impulse is tiny compared with that of the huge impact forces.
3. Choose a positive direction, give every velocity its sign, and write total before = total after. In two or three dimensions, do this **separately for each component**.

For two objects on a line:

$$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$$

### Recoil and explosions
If a system starts at rest, its total momentum is zero and stays zero. A rifle of mass $M$ firing a bullet of mass $m$ at speed $v$ recoils at $V = mv/M$ the other way; a person stepping off a small boat pushes it away from the jetty. A firework shell that bursts at the top of its flight throws its fragments out so that their momenta still add up to the shell's. [[rocket-propulsion|Rockets]] are recoil made continuous.

### Collisions
Momentum is conserved in **every** collision, whatever happens to the kinetic energy. Kinetic energy is also conserved only in [[elastic-collisions|elastic collisions]]; in [[inelastic-collisions|inelastic]] ones some of it becomes heat, sound and deformation. That is why momentum, not energy, is the first tool for any collision.

### How deep it goes
Momentum conservation holds for atoms, nuclei, light and galaxies, and it survives into relativity and quantum mechanics. At the deepest level it follows from a symmetry: the laws of physics are the same everywhere in space. (In the same way, energy conservation follows from their being the same at all times.)
`,
  ideas: [
    'With no net external force, the total momentum of a system stays constant.',
    'It follows from the third law: internal forces give equal and opposite impulses.',
    'Momentum is conserved in every collision and explosion, elastic or not.',
    'In two or three dimensions each component of momentum is conserved separately.',
    'A system starting at rest keeps zero total momentum: recoil.'
  ],
  pitfalls: [
    'Momentum is conserved only in elastic collisions — It is conserved in all collisions; it is kinetic energy that is conserved only in elastic ones.',
    'The momentum of each object is conserved — Only the total is. Individual momenta change; what one gains, the other loses.',
    'Forgetting the signs — Velocities in opposite directions have opposite signs. Two equal carts moving towards each other at equal speeds have zero total momentum.'
  ],
  derivation: {
    title: 'Derive momentum conservation from the third law',
    steps: [
      { text: 'During a collision object 1 pushes on object 2 with $\\vec F_{12}$ and object 2 pushes on object 1 with $\\vec F_{21}$. By the third law, at every instant', tex: '\\vec F_{21} = -\\vec F_{12}' },
      { text: 'By the second law in momentum form, each force changes the momentum of the object it acts on:', tex: '\\frac{d\\vec p_1}{dt} = \\vec F_{21}, \\qquad \\frac{d\\vec p_2}{dt} = \\vec F_{12}' },
      { text: 'Add the two:', tex: '\\frac{d}{dt}\\left(\\vec p_1 + \\vec p_2\\right) = \\vec F_{21} + \\vec F_{12} = 0' },
      { text: 'So the total momentum does not change, however large or complicated the forces are:', tex: '\\vec p_1 + \\vec p_2 = \\text{constant}' }
    ]
  },
  formulas: [
    {
      name: 'Momentum before = momentum after (two objects on a line)',
      expr: 'm1*u1 + m2*u2 = m1*v1 + m2*v2', tex: 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2', solveFor: 'v2',
      vars: {
        m1: { name: 'mass of object 1', q: 'mass', unit: 'kg', value: 1 },
        u1: { name: 'velocity of object 1 before', q: 'speed', unit: 'm/s', value: 3, signed: true },
        m2: { name: 'mass of object 2', q: 'mass', unit: 'kg', value: 2 },
        u2: { name: 'velocity of object 2 before', q: 'speed', unit: 'm/s', value: 0, signed: true },
        v1: { name: 'velocity of object 1 after', q: 'speed', unit: 'm/s', value: -1, signed: true },
        v2: { name: 'velocity of object 2 after', q: 'speed', unit: 'm/s', signed: true }
      },
      note: 'Give each velocity a sign. External forces must be negligible during the interaction.',
      stories: {
        v2: 'A {m1} trolley moving at {u1} collides with a {m2} trolley moving at {u2}. Afterwards the first trolley moves at {v1}. What is the velocity of the second?',
        v1: 'A {m1} puck at {u1} hits a {m2} puck moving at {u2}; the second puck leaves at {v2}. What is the velocity of the first puck afterwards?'
      }
    },
    {
      name: 'Recoil speed',
      expr: 'V = m*v/M', tex: 'V = \\frac{m v}{M}',
      vars: {
        V: { name: 'recoil speed of the launcher', q: 'speed', unit: 'm/s' },
        m: { name: 'mass of the projectile', q: 'mass', unit: 'g', value: 10 },
        v: { name: 'speed of the projectile', q: 'speed', unit: 'm/s', value: 800 },
        M: { name: 'mass of the launcher', q: 'mass', unit: 'kg', value: 4 }
      },
      note: 'Both start at rest, so the total momentum stays zero and they move off in opposite directions.',
      stories: {
        V: 'A {M} rifle fires a {m} bullet at {v}. How fast does the rifle recoil?',
        v: 'A {M} cannon recoils at {V} when it fires a {m} ball. How fast does the ball leave?'
      }
    }
  ],
  examples: [
    {
      title: 'Stepping off a boat',
      q: 'A 70 kg person steps from a 150 kg rowing boat, at rest, onto a jetty with a horizontal speed of 2.0 m/s. How fast does the boat move away?',
      steps: [
        'System: person + boat. Horizontally, no external force of any size acts (the water\'s drag is small over the short push).',
        'Total momentum before: 0. After: $70 \\times 2.0 + 150\\,V = 0$.',
        '$V = -140/150 = -0.93\\ \\mathrm{m/s}$: the boat moves away from the jetty — which is why people fall in.'
      ],
      a: '0.93 m/s, away from the jetty.'
    },
    {
      title: 'Reconstructing a collision',
      q: 'A 1500 kg car moving at 20 m/s runs into the back of a 1000 kg car moving at 10 m/s in the same direction. Just after the impact the front car moves at 18 m/s. How fast is the rear car moving? How much kinetic energy was lost?',
      steps: [
        'Momentum before: $1500 \\times 20 + 1000 \\times 10 = 40\\,000\\ \\mathrm{kg\\,m/s}$.',
        'After: $1500\\,v_1 + 1000 \\times 18 = 40\\,000$, so $v_1 = 22\\,000/1500 = 14.7\\ \\mathrm{m/s}$.',
        'Kinetic energy before: $\\tfrac12(1500)(20)^2 + \\tfrac12(1000)(10)^2 = 350\\ \\mathrm{kJ}$. After: $\\tfrac12(1500)(14.7)^2 + \\tfrac12(1000)(18)^2 = 323\\ \\mathrm{kJ}$.',
        'About 27 kJ went into crumpled metal, heat and sound — momentum was conserved, kinetic energy was not.'
      ],
      a: 'The rear car moves at 14.7 m/s; about 27 kJ of kinetic energy was lost.'
    },
    {
      title: 'An explosion in two dimensions',
      q: 'A 3.0 kg package at rest bursts into three 1.0 kg pieces. One flies east at 12 m/s, another north at 9.0 m/s. Find the velocity of the third.',
      steps: [
        'Total momentum stays zero, component by component.',
        'East–west: $1.0 \\times 12 + 0 + 1.0\\,v_x = 0$, so $v_x = -12\\ \\mathrm{m/s}$.',
        'North–south: $0 + 1.0 \\times 9.0 + 1.0\\,v_y = 0$, so $v_y = -9.0\\ \\mathrm{m/s}$.',
        'Speed: $\\sqrt{12^2 + 9^2} = 15\\ \\mathrm{m/s}$, directed $\\arctan(9/12) = 37°$ south of west.'
      ],
      a: '15 m/s, 37° south of west.'
    }
  ],
  quiz: [
    { q: 'A 50 kg skater at rest throws a 5 kg ball forwards at 4 m/s. She recoils at…', choices: ['4 m/s', '0.4 m/s', '0.04 m/s', '0 m/s'], a: 1,
      why: 'The total momentum stays zero: 50V = 5 × 4, so V = 0.4 m/s backwards.' },
    { q: 'Two carts of equal mass approach each other at equal speeds and stick together. Afterwards they…', choices: ['move in the direction of the first cart', 'are at rest', 'move at half the speed', 'bounce apart'], a: 1,
      why: 'Their momenta were equal and opposite: zero in total before, so zero after.' },
    { q: 'In which collisions is the total momentum of the two objects conserved?', choices: ['Only elastic ones', 'Only those where the objects stick together', 'Every collision in which outside forces are negligible', 'Only collisions in space'], a: 2,
      why: 'Internal forces cannot change the total momentum, whatever they do to the kinetic energy.' },
    { q: 'A ball falls towards the Earth, speeding up. The momentum of the ball alone is not conserved, but the momentum of the ball and the Earth together is.', a: true,
      why: 'Gravity is an outside force on the ball, but an internal force of the ball–Earth system: the Earth gains an equal and opposite, undetectably small, velocity.' }
  ],
  applications: [
    'Accident reconstruction from the masses, skid marks and final positions of vehicles.',
    'Rocket and jet propulsion, and the recoil of guns.',
    'Particle physics: missing energy and momentum in radioactive beta decay led Wolfgang Pauli to predict the neutrino in 1930.',
    'Snooker, bowls and curling, where momentum passes from one ball or stone to another.'
  ],
  sim: 'mech1-collisions'
},

{
  id: 'elastic-collisions', parent: 'momentum-collisions', title: 'Elastic collisions', level: 2,
  short: 'Collisions in which kinetic energy as well as momentum is conserved. Head-on, the two objects separate as fast as they approached.',
  keywords: ['elastic collision', 'head-on collision', 'kinetic energy conserved', 'exchange of velocities', 'Newton\'s cradle', 'snooker', 'neutron moderator', 'relative velocity', 'glancing collision'],
  prereq: ['conservation-of-momentum', 'kinetic-energy'],
  related: ['inelastic-collisions', 'nuclear-reactors', 'kinetic-theory-gases', 'compton-scattering'],
  body: `
In an **elastic collision** the colliding objects bounce apart with no loss of kinetic energy: none goes into heat, sound or permanent dents. Collisions between gas molecules and between subatomic particles are truly elastic; snooker balls, steel ball bearings and air-track gliders with spring bumpers come close.

### Two conservation laws
Both momentum and kinetic energy are conserved:

$$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2, \\qquad \\tfrac12 m_1 u_1^2 + \\tfrac12 m_2 u_2^2 = \\tfrac12 m_1 v_1^2 + \\tfrac12 m_2 v_2^2$$

For a head-on (one-dimensional) collision these two equations fix the two unknown final velocities:

$$v_1 = \\frac{(m_1 - m_2)\\,u_1 + 2 m_2 u_2}{m_1 + m_2}, \\qquad v_2 = \\frac{(m_2 - m_1)\\,u_2 + 2 m_1 u_1}{m_1 + m_2}$$

A neat consequence, derived below, is that the objects separate at the same speed as they approached: $v_2 - v_1 = -(u_2 - u_1)$.

### Three special cases, target at rest ($u_2 = 0$)
- **Equal masses:** $v_1 = 0$ and $v_2 = u_1$. The moving ball stops dead and the target takes all its velocity — the snooker "stun" shot, and Newton's cradle.
- **Heavy hits light** ($m_1 \\gg m_2$): the heavy object hardly slows and the light one flies off at nearly $2u_1$ — a golf club on a ball, a bowling ball on a pin.
- **Light hits heavy** ($m_1 \\ll m_2$): the light object bounces straight back at almost its original speed and the heavy one barely moves — a ball bouncing off a wall, a gas molecule off the side of its container.

### Sharing the energy
When $m_1$ hits $m_2$ at rest head-on, the fraction of its kinetic energy handed to the target is

$$f = \\frac{4 m_1 m_2}{(m_1 + m_2)^2}$$

It is 100% for equal masses and falls away when the masses are very different. That is why a nuclear reactor slows its fast neutrons with light atoms — hydrogen in water, or carbon in graphite — rather than heavy ones: a neutron hitting a hydrogen nucleus, of almost the same mass, can give up all its energy in one collision (see [[nuclear-reactors]]).

### In two dimensions
In a glancing elastic collision between equal masses, one of them initially at rest, the two move off **at right angles** to each other (as long as the balls do not spin). Every snooker player uses this rule to predict where the cue ball will go after a cut shot.
`,
  ideas: [
    'In an elastic collision both momentum and kinetic energy are conserved.',
    'Head-on, the relative velocity simply reverses: they separate as fast as they approached.',
    'Equal masses, target at rest: the objects exchange velocities.',
    'The energy passed to a target at rest, 4m₁m₂/(m₁ + m₂)², is greatest for equal masses.',
    'Equal masses in a glancing elastic collision move off at 90° to each other.'
  ],
  pitfalls: [
    'In an elastic collision each object keeps its kinetic energy — Only the total is conserved; energy usually passes from one object to the other.',
    '"Elastic" means the objects stretch — It means no kinetic energy is lost. Bouncy objects deform briefly, but give all the energy back.',
    'Kinetic-energy conservation alone solves the collision — It gives one equation for two unknowns. Momentum conservation is needed as well.'
  ],
  derivation: {
    title: 'Derive the final velocities of a head-on elastic collision',
    steps: [
      { text: 'Collect the terms for each object in the two conservation laws:', tex: 'm_1 (u_1 - v_1) = m_2 (v_2 - u_2), \\qquad m_1 (u_1^2 - v_1^2) = m_2 (v_2^2 - u_2^2)' },
      { text: 'Factor the squares, $a^2 - b^2 = (a - b)(a + b)$, and divide the second equation by the first (a collision really happens, so $u_1 \\ne v_1$):', tex: 'u_1 + v_1 = v_2 + u_2 \\;\\Rightarrow\\; v_2 - v_1 = -(u_2 - u_1)' },
      { text: 'The relative velocity reverses. Put $v_2 = u_1 + v_1 - u_2$ into the momentum equation:', tex: 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 (u_1 + v_1 - u_2)' },
      { text: 'Solve for $v_1$; $v_2$ follows in the same way:', tex: 'v_1 = \\frac{(m_1 - m_2)\\,u_1 + 2 m_2 u_2}{m_1 + m_2}' }
    ]
  },
  formulas: [
    {
      name: 'Elastic collision on a line: velocity of object 1 afterwards',
      expr: 'v1 = ((m1 - m2)*u1 + 2*m2*u2)/(m1 + m2)', tex: 'v_1 = \\frac{(m_1 - m_2)\\,u_1 + 2 m_2 u_2}{m_1 + m_2}',
      vars: {
        v1: { name: 'velocity of object 1 after', q: 'speed', unit: 'm/s', signed: true },
        m1: { name: 'mass of object 1', q: 'mass', unit: 'kg', value: 1 },
        m2: { name: 'mass of object 2', q: 'mass', unit: 'kg', value: 2 },
        u1: { name: 'velocity of object 1 before', q: 'speed', unit: 'm/s', value: 3, signed: true },
        u2: { name: 'velocity of object 2 before', q: 'speed', unit: 'm/s', value: 0, signed: true }
      },
      stories: { v1: 'A {m1} glider moving at {u1} collides elastically, head-on, with a {m2} glider moving at {u2}. What is the first glider\'s velocity afterwards?' }
    },
    {
      name: 'Elastic collision on a line: velocity of object 2 afterwards',
      expr: 'v2 = ((m2 - m1)*u2 + 2*m1*u1)/(m1 + m2)', tex: 'v_2 = \\frac{(m_2 - m_1)\\,u_2 + 2 m_1 u_1}{m_1 + m_2}',
      vars: {
        v2: { name: 'velocity of object 2 after', q: 'speed', unit: 'm/s', signed: true },
        m1: { name: 'mass of object 1', q: 'mass', unit: 'kg', value: 1 },
        m2: { name: 'mass of object 2', q: 'mass', unit: 'kg', value: 2 },
        u1: { name: 'velocity of object 1 before', q: 'speed', unit: 'm/s', value: 3, signed: true },
        u2: { name: 'velocity of object 2 before', q: 'speed', unit: 'm/s', value: 0, signed: true }
      },
      stories: { v2: 'A {m1} ball moving at {u1} hits a {m2} ball moving at {u2}, head-on and elastically. How fast does the second ball move afterwards?' }
    },
    {
      name: 'Fraction of kinetic energy given to a target at rest',
      expr: 'f = 4*m1*m2/(m1 + m2)^2', tex: 'f = \\frac{4 m_1 m_2}{(m_1 + m_2)^2}',
      vars: {
        f: { name: 'fraction of the kinetic energy transferred', q: 'ratio', unit: '%', min: 0, max: 100 },
        m1: { name: 'mass of the moving object', q: 'mass', unit: 'u', value: 1 },
        m2: { name: 'mass of the target', q: 'mass', unit: 'u', value: 12 }
      },
      note: 'Head-on elastic collision. Glancing collisions pass on less.',
      stories: { f: 'A neutron (mass {m1}) hits a nucleus of mass {m2} head-on and elastically. What fraction of its kinetic energy does it give up?' }
    }
  ],
  examples: [
    {
      title: 'Gliders on an air track',
      q: 'A 1.0 kg glider moving at 3.0 m/s hits a 2.0 kg glider at rest, elastically. Find both velocities afterwards and check both conservation laws.',
      steps: [
        '$v_1 = \\dfrac{(1 - 2)(3.0)}{3} = -1.0\\ \\mathrm{m/s}$: the lighter glider bounces back.',
        '$v_2 = \\dfrac{2(1)(3.0)}{3} = 2.0\\ \\mathrm{m/s}$.',
        'Momentum: $1.0 \\times 3.0 = 3.0$ before; $1.0(-1.0) + 2.0(2.0) = 3.0$ after.',
        'Kinetic energy: $4.5\\ \\mathrm{J}$ before; $0.5 + 4.0 = 4.5\\ \\mathrm{J}$ after. And they separate at $2.0 - (-1.0) = 3.0\\ \\mathrm{m/s}$, the speed at which they approached.'
      ],
      a: '−1.0 m/s and +2.0 m/s.'
    },
    {
      title: 'Slowing neutrons in a reactor',
      q: 'Fission neutrons start with about 2 MeV and must be slowed to about 0.025 eV. What fraction of its energy does a neutron lose in a head-on collision with a carbon-12 nucleus? At least how many such collisions are needed?',
      steps: [
        '$f = \\dfrac{4(1)(12)}{(1 + 12)^2} = \\dfrac{48}{169} = 0.284$: it loses 28.4% and keeps 71.6% each time.',
        'The energy must fall by a factor $2\\times10^{6}/0.025 = 8\\times10^{7}$.',
        'After $n$ head-on hits it keeps $0.716^n$: $n = \\ln(8\\times10^{7})/\\ln(1/0.716) = 18.2/0.334 \\approx 55$.',
        'Most real collisions are glancing, so in graphite it takes about 115 on average; in the hydrogen of water, whose nuclei match the neutron\'s mass, about 18.'
      ],
      a: '28% per head-on collision; at least about 55 collisions in carbon.'
    },
    {
      title: 'Why Newton\'s cradle sends out one ball',
      q: 'In a Newton\'s cradle one steel ball of mass $m$ swings in at speed $v$. Why does exactly one ball leave the other end at $v$, rather than two balls at $v/2$?',
      steps: [
        'Two balls at $v/2$ would conserve momentum: $m v = 2m \\times v/2$.',
        'But their kinetic energy would be $2 \\times \\tfrac12 m (v/2)^2 = \\tfrac14 m v^2$ — only half of the $\\tfrac12 m v^2$ that came in.',
        'Only one ball leaving at $v$ satisfies both conservation laws. With nearly elastic steel balls, that is what happens.'
      ],
      a: 'Momentum and kinetic energy must both be conserved, and only "one in, one out at the same speed" does that.'
    }
  ],
  quiz: [
    { q: 'A snooker ball hits an identical ball at rest head-on, elastically and without spin. Afterwards…', choices: ['both move at half the speed', 'the first stops and the second moves off at the first one\'s speed', 'the first bounces back', 'both stop'], a: 1,
      why: 'For equal masses in an elastic head-on collision, the velocities are exchanged.' },
    { q: 'A table-tennis ball hits a bowling ball at rest, head-on and elastically. The table-tennis ball…', choices: ['stops', 'carries on at half speed', 'bounces back at almost its original speed', 'sticks to the bowling ball'], a: 2,
      why: 'Light hits heavy: v₁ = (m₁ − m₂)u₁/(m₁ + m₂) ≈ −u₁.' },
    { q: 'In a head-on elastic collision, two carts approach each other at a relative speed of 5 m/s. Afterwards they separate at a relative speed of…', choices: ['0 m/s', '2.5 m/s', '5 m/s', '10 m/s'], a: 2,
      why: 'In an elastic collision the relative velocity simply reverses.' },
    { q: 'Which moderator slows fast neutrons in the fewest collisions?', choices: ['Lead (mass 207 u)', 'Carbon (12 u)', 'Hydrogen in water (1 u)', 'All need the same number'], a: 2,
      why: 'The energy passed on, 4m₁m₂/(m₁ + m₂)², is greatest when the masses are equal, and a proton has almost the neutron\'s mass.' },
    { q: 'In an elastic collision, each object\'s kinetic energy is unchanged.', a: false,
      why: 'Only the total kinetic energy is unchanged; energy usually passes from one object to the other.' }
  ],
  applications: [
    'Snooker, pool and billiards: the "stun" shot and the 90° rule.',
    'Neutron moderators in nuclear reactors.',
    'Gravitational slingshots: a spacecraft swinging round a moving planet gains speed, like a light ball bouncing off an approaching heavy one.',
    'Kinetic theory: the pressure of a gas comes from elastic collisions of its molecules with the walls.'
  ],
  sim: 'mech1-collisions'
},

{
  id: 'inelastic-collisions', parent: 'momentum-collisions', title: 'Inelastic collisions', level: 2,
  short: 'Collisions that lose kinetic energy to heat, sound and deformation — while still conserving momentum. Objects that stick together lose the most.',
  keywords: ['inelastic collision', 'perfectly inelastic', 'totally inelastic', 'sticking together', 'coefficient of restitution', 'bounce height', 'ballistic pendulum', 'energy loss', 'crash'],
  prereq: ['conservation-of-momentum', 'kinetic-energy'],
  related: ['elastic-collisions', 'center-of-mass', 'conservation-of-energy', 'impulse'],
  body: `
Most real collisions lose kinetic energy. Cars crumple, clay squashes, a dropped ball bounces a little lower each time. In an **inelastic collision** some of the kinetic energy becomes heat, sound and permanent deformation — but momentum is still conserved exactly ([[conservation-of-momentum]]).

### Perfectly inelastic: sticking together
The extreme case is when the objects stick and move off as one. Momentum conservation alone then gives the answer:

$$v = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}$$

This loses **the most kinetic energy that momentum conservation allows** — but not all of it: the combined object must still carry the total momentum, so it keeps the kinetic energy of the motion of the [[center-of-mass|centre of mass]]. When a moving object hits one at rest and sticks, the fraction of the kinetic energy lost is

$$\\frac{\\Delta E_k}{E_k} = \\frac{m_2}{m_1 + m_2}$$

A small car running into a parked lorry loses nearly all its kinetic energy; a lorry running into a parked car loses very little.

### Coefficient of restitution
Between the elastic and the sticky extremes, collisions are described by the **coefficient of restitution** $e$, the ratio of the speed at which the objects separate to the speed at which they approached:

$$e = \\frac{v_2 - v_1}{u_1 - u_2}$$

$e = 1$ is elastic, $e = 0$ perfectly inelastic. For a ball dropped onto a hard floor, $e = \\sqrt{h_{\\text{bounce}}/h_{\\text{drop}}}$, because the height reached goes as the square of the speed; each bounce keeps a fraction $e^2$ of the energy. Rough values: a superball 0.9, a basketball 0.8, a tennis ball 0.75, a cricket ball 0.5, a lump of clay 0. Sports rules often fix $e$: basketball rules, for instance, require a ball dropped from 1.8 m to bounce back to roughly 1.2–1.4 m.

### The ballistic pendulum
Before electronic timers, the speed of a bullet was measured by firing it into a heavy block hanging as a pendulum. The bullet sticks (perfectly inelastic: momentum conserved), then the block swings up (energy conserved: no collision any more). The height $h$ of the swing gives

$$u = \\frac{m + M}{m}\\sqrt{2 g h}$$

The two stages must be kept apart. Kinetic energy is *not* conserved in the impact — typically over 99% of it becomes heat — and using energy conservation there gives a hopelessly wrong answer.

> [!tip] In the collisions simulation, slide $e$ from 1 down to 0: the dashed total-momentum line stays flat every time, while the kinetic energy lost grows to its maximum when the gliders stick.
`,
  ideas: [
    'In an inelastic collision momentum is conserved but kinetic energy is not.',
    'Objects that stick together lose the most kinetic energy that momentum conservation allows.',
    'The coefficient of restitution e compares separation speed with approach speed: 1 elastic, 0 sticky.',
    'A ball bouncing on a hard floor reaches e² of its drop height.',
    'In two-stage problems such as the ballistic pendulum, use momentum for the impact and energy for the swing.'
  ],
  pitfalls: [
    'In a perfectly inelastic collision all the kinetic energy is lost — Only what momentum conservation allows; the combined object must still carry the total momentum.',
    'Momentum is lost along with the kinetic energy — Momentum is conserved in every collision in which outside forces are negligible.',
    'Using conservation of kinetic energy across a sticky impact — The ballistic pendulum gives absurd answers that way; use momentum for the impact itself.'
  ],
  formulas: [
    {
      name: 'Perfectly inelastic collision: common velocity',
      expr: 'v = (m1*u1 + m2*u2)/(m1 + m2)', tex: 'v = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}',
      vars: {
        v: { name: 'velocity after sticking together', q: 'speed', unit: 'm/s', signed: true },
        m1: { name: 'mass of object 1', q: 'mass', unit: 'kg', value: 1500 },
        u1: { name: 'velocity of object 1 before', q: 'speed', unit: 'm/s', value: 20, signed: true },
        m2: { name: 'mass of object 2', q: 'mass', unit: 'kg', value: 1000 },
        u2: { name: 'velocity of object 2 before', q: 'speed', unit: 'm/s', value: 0, signed: true }
      },
      stories: {
        v: 'A {m1} car moving at {u1} runs into a {m2} car moving at {u2}, and they lock together. How fast do they move just after the impact?',
        u1: 'After a {m1} car hits a {m2} car moving at {u2}, the locked wreckage moves at {v}. How fast was the first car going?'
      }
    },
    {
      name: 'Fraction of kinetic energy lost when sticking to a target at rest',
      expr: 'f = m2/(m1 + m2)', tex: 'f = \\frac{m_2}{m_1 + m_2}',
      vars: {
        f: { name: 'fraction of the kinetic energy lost', q: 'ratio', unit: '%', min: 0, max: 100 },
        m1: { name: 'mass of the moving object', q: 'mass', unit: 'kg', value: 1500 },
        m2: { name: 'mass of the target at rest', q: 'mass', unit: 'kg', value: 1000 }
      },
      stories: {
        f: 'A {m1} car runs into a parked {m2} car and they lock together. What fraction of the kinetic energy is lost in the crash?',
        m2: 'A {m1} trolley hits a trolley at rest and sticks to it, losing {f} of its kinetic energy. What is the mass of the second trolley?'
      }
    },
    {
      name: 'Coefficient of restitution from a bounce',
      expr: 'cr = sqrt(h2/h1)', tex: 'e = \\sqrt{\\frac{h_2}{h_1}}',
      vars: {
        cr: { name: 'coefficient of restitution', tex: 'e', min: 0, max: 1 },
        h2: { name: 'height of the bounce', q: 'length', unit: 'm', value: 1.3 },
        h1: { name: 'height of the drop', q: 'length', unit: 'm', value: 1.8 }
      },
      note: 'A ball dropped from rest onto a hard, heavy floor; air resistance ignored.',
      stories: {
        cr: 'A basketball dropped from {h1} bounces back to {h2}. What is its coefficient of restitution?',
        h2: 'A ball with a coefficient of restitution of {cr} is dropped from {h1}. How high does it bounce?'
      }
    },
    {
      name: 'Ballistic pendulum',
      expr: 'u = (m + M)/m*sqrt(2*g*h)', tex: 'u = \\frac{m + M}{m}\\sqrt{2 g h}',
      vars: {
        u: { name: 'speed of the bullet', q: 'speed', unit: 'm/s' },
        m: { name: 'mass of the bullet', q: 'mass', unit: 'g', value: 10 },
        M: { name: 'mass of the block', q: 'mass', unit: 'kg', value: 2 },
        g: { const: 'g' },
        h: { name: 'height the block swings up', q: 'length', unit: 'cm', value: 12 }
      },
      stories: {
        u: 'A {m} bullet is fired into a {M} wooden block hanging on strings, and the block swings up {h}. How fast was the bullet?',
        h: 'A {m} bullet at {u} lodges in a {M} hanging block. How high does the block swing?'
      }
    }
  ],
  examples: [
    {
      title: 'A rear-end crash',
      q: 'A 1500 kg car at 20 m/s runs into a parked 1000 kg car and the two lock together. Find their speed just after the impact and the kinetic energy lost.',
      steps: [
        'Momentum: $1500 \\times 20 = 2500\\,v$, so $v = 12\\ \\mathrm{m/s}$.',
        'Kinetic energy before: $\\tfrac12(1500)(20)^2 = 300\\ \\mathrm{kJ}$. After: $\\tfrac12(2500)(12)^2 = 180\\ \\mathrm{kJ}$.',
        '$120\\ \\mathrm{kJ}$, or 40%, went into crushing metal, heat and sound — exactly $m_2/(m_1 + m_2) = 1000/2500$.'
      ],
      a: '12 m/s; 120 kJ (40%) lost.'
    },
    {
      title: 'The ballistic pendulum',
      q: 'A 10 g bullet is fired into a 2.0 kg block hanging on long strings. The block, with the bullet inside, swings up 12 cm. How fast was the bullet, and what fraction of its kinetic energy survived the impact?',
      steps: [
        'The swing (energy conserved): the block starts at $V = \\sqrt{2 g h} = \\sqrt{2 \\times 9.81 \\times 0.12} = 1.53\\ \\mathrm{m/s}$.',
        'The impact (momentum conserved): $0.010\\,u = 2.010 \\times 1.53$, so $u = 308\\ \\mathrm{m/s}$.',
        'Kinetic energy: bullet $\\tfrac12(0.010)(308)^2 = 474\\ \\mathrm{J}$; block and bullet just after, $\\tfrac12(2.010)(1.53)^2 = 2.4\\ \\mathrm{J}$.',
        'Only 0.5% of the kinetic energy survived; the rest heated the wood and the bullet.'
      ],
      a: 'About 308 m/s; only 0.5% of the kinetic energy remained.'
    },
    {
      title: 'A bouncing ball',
      q: 'A tennis ball with $e = 0.75$ is dropped from 2.0 m onto a hard floor. How high are its first two bounces, and what fraction of its energy is lost at each bounce?',
      steps: [
        'Each bounce multiplies the speed by $e$ and the height by $e^2 = 0.5625$.',
        'First bounce: $2.0 \\times 0.5625 = 1.13\\ \\mathrm{m}$. Second: $1.13 \\times 0.5625 = 0.63\\ \\mathrm{m}$.',
        'Each bounce keeps 56% of the energy and loses 44%, mostly as heat in the ball.'
      ],
      a: '1.13 m, then 0.63 m; 44% of the energy is lost at each bounce.'
    }
  ],
  quiz: [
    { q: 'A 2 kg ball of clay moving at 6 m/s hits and sticks to a 1 kg ball of clay at rest. Their common velocity is…', choices: ['2 m/s', '3 m/s', '4 m/s', '6 m/s'], a: 2,
      why: 'Momentum: 2 × 6 = 3v, so v = 4 m/s.' },
    { q: 'In that collision, what fraction of the kinetic energy is lost?', choices: ['one third', 'one half', 'two thirds', 'all of it'], a: 0,
      why: 'm₂/(m₁ + m₂) = 1/3: 36 J before, 24 J after.' },
    { q: 'A ball dropped from 1.0 m bounces to 0.64 m. Its coefficient of restitution is…', choices: ['0.64', '0.80', '0.36', '0.41'], a: 1,
      why: 'e = √(0.64/1.0) = 0.80: the height goes as the square of the speed.' },
    { q: 'When two objects stick together in a collision, their total momentum is less afterwards than before.', a: false,
      why: 'Momentum is conserved in every collision in which outside forces are negligible. It is kinetic energy that is lost.' }
  ],
  applications: [
    'Car safety: crumple zones turn kinetic energy into deformation away from the passenger cell.',
    'Sports equipment — golf drivers, baseballs, tennis balls — is tested and regulated by its coefficient of restitution.',
    'The ballistic pendulum and its modern successors measure projectile speeds.',
    'Coupling railway wagons and docking spacecraft are sticky collisions.'
  ],
  history: 'The English mathematician Benjamin Robins invented the ballistic pendulum in 1742, giving the first reliable measurements of the speed of musket balls and founding the science of ballistics.',
  sim: 'mech1-collisions'
},

{
  id: 'center-of-mass', parent: 'momentum-collisions', title: 'Centre of mass', level: 2,
  short: 'The mass-weighted average position of an object or system. It moves as if all the mass were there and all the external forces acted on it.',
  keywords: ['centre of mass', 'center of mass', 'centre of gravity', 'barycentre', 'balance point', 'weighted average', 'stability', 'Fosbury flop', 'system of particles'],
  prereq: ['newtons-second-law', 'conservation-of-momentum', 'math:vectors'],
  related: ['static-equilibrium', 'torque', 'moment-of-inertia', 'projectile-motion', 'keplers-laws', 'math:multiple-integrals'],
  body: `
Throw a spanner spinning across a room. Its handle and head wheel about in a complicated way, but one point in it — the **centre of mass** — follows a smooth parabola, just as a thrown ball would ([[projectile-motion]]). The centre of mass is the average position of the mass of an object or a system, and it lets you treat any collection of matter as if it were a single particle.

### Where it is
For point masses along a line,

$$x_{\\text{cm}} = \\frac{m_1 x_1 + m_2 x_2 + \\dots}{m_1 + m_2 + \\dots} = \\frac{\\sum m_i x_i}{M}$$

— a weighted average, pulled towards the heavier masses. The same formula holds for $y$ and $z$. For a continuous body the sums become integrals, $x_{\\text{cm}} = \\frac{1}{M}\\int x\\,dm$ (see [[math:multiple-integrals|multiple integrals]]). For a uniform object with a centre of symmetry — a sphere, a cube, a ring — it lies at that centre, even if no material is there: the centre of mass of a ring, a horseshoe or a boomerang is in empty space. In a uniform gravitational field the centre of mass is also the **centre of gravity**, the balance point: hang an object from any point and its centre of mass settles directly below the support.

### How it moves
Add up Newton's second law for every part of a system. The internal forces cancel in [[newtons-third-law|third-law]] pairs, leaving

$$\\vec F_{\\text{ext}} = M\\,\\vec a_{\\text{cm}}, \\qquad \\vec p_{\\text{total}} = M\\,\\vec v_{\\text{cm}}$$

The centre of mass moves as if all the mass were concentrated there and all the external forces acted on it. So:
- With no external force, the centre of mass moves at **constant velocity** — straight through any collision or explosion. This is [[conservation-of-momentum|conservation of momentum]] seen another way.
- A firework shell that bursts in mid-air scatters its fragments, but their centre of mass carries on along the original parabola until the first piece lands.
- On perfectly smooth ice you cannot move your centre of mass at all: you can only move some parts of yourself one way and other parts the other way.

### Everyday and astronomical
- **Stability.** An object stays upright as long as its centre of mass is above its base. A lorry with a high load tips over more easily; a racing car sits low.
- **The high jump.** In the Fosbury flop the athlete arches over the bar so that her body wraps round it; her centre of mass can pass just below the bar while every part of her goes over.
- **Orbits.** The Earth and the Moon both orbit their common centre of mass, the barycentre, 4670 km from the Earth's centre — inside the Earth, whose radius is 6371 km. The Sun wobbles round the centre of mass of the Solar System, which often lies outside the Sun; the same wobble in other stars reveals their unseen planets.
`,
  ideas: [
    'The centre of mass is the mass-weighted average position: $x_{\\text{cm}} = \\sum m_i x_i / M$.',
    'It moves as if all the mass were there and all the external forces acted on it: $\\vec F_{\\text{ext}} = M\\,\\vec a_{\\text{cm}}$.',
    'With no external force, the centre of mass moves at constant velocity, whatever the parts do.',
    'The total momentum equals the total mass times the velocity of the centre of mass.',
    'An object is stable while its centre of mass lies above its base of support.'
  ],
  pitfalls: [
    'The centre of mass must be inside the material — A ring, a horseshoe or a high jumper arched over the bar has it in empty space.',
    'Internal forces can move the centre of mass — They cancel in pairs. Someone on frictionless ice cannot shift their centre of mass by wriggling.',
    'The centre of mass is always at the geometric centre — Only for uniform, symmetric objects. It shifts towards the heavier parts.'
  ],
  formulas: [
    {
      name: 'Centre of mass of two objects on a line',
      expr: 'xcm = (m1*x1 + m2*x2)/(m1 + m2)', tex: 'x_{\\text{cm}} = \\frac{m_1 x_1 + m_2 x_2}{m_1 + m_2}',
      vars: {
        xcm: { name: 'position of the centre of mass', q: 'length', unit: 'm', tex: 'x_{\\text{cm}}', signed: true },
        m1: { name: 'first mass', q: 'mass', unit: 'kg', value: 70 },
        x1: { name: 'position of the first mass', q: 'length', unit: 'm', value: 1, signed: true },
        m2: { name: 'second mass', q: 'mass', unit: 'kg', value: 30 },
        x2: { name: 'position of the second mass', q: 'length', unit: 'm', value: 4, signed: true }
      },
      stories: {
        xcm: 'A {m1} adult sits at x = {x1} on a long plank and a {m2} child at x = {x2}. Where is their centre of mass?',
        m2: 'A {m1} mass sits at x = {x1}. What mass placed at x = {x2} puts the centre of mass at {xcm}?'
      }
    },
    {
      name: 'Velocity of the centre of mass',
      expr: 'vcm = (m1*v1 + m2*v2)/(m1 + m2)', tex: 'v_{\\text{cm}} = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}',
      vars: {
        vcm: { name: 'velocity of the centre of mass', q: 'speed', unit: 'm/s', tex: 'v_{\\text{cm}}', signed: true },
        m1: { name: 'first mass', q: 'mass', unit: 'kg', value: 1 },
        v1: { name: 'velocity of the first mass', q: 'speed', unit: 'm/s', value: 1.5, signed: true },
        m2: { name: 'second mass', q: 'mass', unit: 'kg', value: 2 },
        v2: { name: 'velocity of the second mass', q: 'speed', unit: 'm/s', value: -0.5, signed: true }
      },
      note: 'Unchanged by any collision between the two, as long as no outside force acts.',
      stories: { vcm: 'A {m1} glider moving at {v1} and a {m2} glider moving at {v2} are about to collide. How fast does their centre of mass move — before and after?' }
    }
  ],
  examples: [
    {
      title: 'The Earth–Moon barycentre',
      q: 'The Earth ($5.97\\times10^{24}$ kg) and the Moon ($7.34\\times10^{22}$ kg) are $3.84\\times10^{5}$ km apart, centre to centre. Where is their centre of mass?',
      steps: [
        'Put the Earth\'s centre at $x = 0$ and the Moon at $x = 384\\,400\\ \\mathrm{km}$.',
        '$x_{\\text{cm}} = \\dfrac{7.34\\times10^{22} \\times 384\\,400}{5.97\\times10^{24} + 7.34\\times10^{22}} = \\dfrac{2.82\\times10^{28}}{6.04\\times10^{24}} = 4670\\ \\mathrm{km}$.',
        'That is inside the Earth, about 1700 km below the surface. Both bodies circle this point once a month, so the Earth wobbles slightly as the Moon goes round.'
      ],
      a: 'About 4670 km from the Earth\'s centre, inside the Earth.'
    },
    {
      title: 'Walking in a canoe',
      q: 'A 70 kg person stands at one end of a 30 kg canoe floating at rest, and walks 3.0 m towards the other end. Ignoring the water\'s drag, how far does the canoe move, and how far does the person move relative to the water?',
      steps: [
        'No horizontal external force, and everything starts at rest, so the centre of mass stays put: $70\\,\\Delta x_p + 30\\,\\Delta x_c = 0$.',
        'Relative to the canoe the person moves 3.0 m: $\\Delta x_p - \\Delta x_c = 3.0\\ \\mathrm{m}$.',
        'Substitute $\\Delta x_p = 3.0 + \\Delta x_c$: $70(3.0 + \\Delta x_c) + 30\\,\\Delta x_c = 0$, so $\\Delta x_c = -2.1\\ \\mathrm{m}$ and $\\Delta x_p = +0.9\\ \\mathrm{m}$.'
      ],
      a: 'The canoe slides 2.1 m backwards; the person moves only 0.9 m forwards relative to the water.'
    },
    {
      title: 'A shell that splits',
      q: 'A shell is fired over level ground and would land 800 m away. At the top of its flight, 400 m out, it splits into two equal halves. One half drops straight down from rest. Ignoring air resistance, where does the other half land?',
      steps: [
        'The split is internal, so the centre of mass carries on along the original parabola and would land at 800 m.',
        'Both halves start from the top with no vertical velocity, so they fall for the same time and land together.',
        'The first half lands at 400 m. For their centre of mass to be at 800 m: $(400 + x)/2 = 800$, so $x = 1200\\ \\mathrm{m}$.'
      ],
      a: '1200 m from the gun.'
    }
  ],
  quiz: [
    { q: 'A 2 kg mass is at x = 0 and a 6 kg mass at x = 4 m. The centre of mass is at…', choices: ['x = 1 m', 'x = 2 m', 'x = 3 m', 'x = 4 m'], a: 2,
      why: '(2 × 0 + 6 × 4)/8 = 3 m, nearer the heavier mass.' },
    { q: 'A firework rocket explodes at the top of its flight. Ignoring air resistance, the centre of mass of the fragments…', choices: ['stops and falls straight down', 'carries on along the original parabola', 'moves off with the largest fragment', 'jumps upwards'], a: 1,
      why: 'The explosion forces are internal. Only gravity acts from outside, so the centre of mass keeps to the same path.' },
    { q: 'Where is the centre of mass of a uniform ring?', choices: ['Anywhere on the ring', 'At its centre, where there is no material', 'Nowhere: a ring has none', 'At its heaviest point'], a: 1,
      why: 'By symmetry it is at the centre, even though no mass is there.' },
    { q: 'The Earth and the Moon both orbit a point that lies inside the Earth.', a: true,
      why: 'Their centre of mass is about 4670 km from the Earth\'s centre, well inside its 6371 km radius.' }
  ],
  applications: [
    'Vehicle and crane design: a low centre of mass kept inside the base prevents tipping.',
    'The Fosbury flop in the high jump, and tucks in diving and gymnastics.',
    'Exoplanets are found from the wobble of their star round the common centre of mass.',
    'Aircraft must be loaded so that the centre of mass stays within set limits for stable flight.'
  ],
  history: 'Archimedes worked out the centres of gravity of triangles, parabolic segments and other shapes around 250 BC, and used them to explain levers and floating bodies.',
  sim: 'mech1-collisions'
},

{
  id: 'rocket-propulsion', parent: 'momentum-collisions', title: 'Rocket propulsion', level: 3,
  short: 'A rocket accelerates by throwing mass backwards. Its thrust is the rate of mass ejection times the exhaust speed, and the speed it can gain grows only with the logarithm of its mass ratio — the Tsiolkovsky rocket equation.',
  keywords: ['rocket', 'thrust', 'rocket equation', 'Tsiolkovsky', 'exhaust velocity', 'mass ratio', 'delta-v', 'staging', 'specific impulse', 'ion thruster', 'variable mass'],
  prereq: ['conservation-of-momentum', 'impulse', 'math:logarithms'],
  related: ['newtons-third-law', 'escape-velocity', 'circular-orbits', 'math:separable-equations'],
  body: `
A rocket has nothing to push against. It moves by throwing mass — hot exhaust gas — backwards at high speed, and by [[conservation-of-momentum|conservation of momentum]] the rest of the rocket must gain the same momentum forwards. It is recoil made continuous: a gun firing a steady stream of very light, very fast bullets.

### Thrust
If the engine ejects gas at a rate $\\dot m$ (kilograms per second) with a speed $v_e$ relative to the rocket, it gives the gas momentum at the rate $\\dot m\\,v_e$, and by [[newtons-third-law|the third law]] the gas pushes the rocket forwards with the **thrust**

$$F = \\dot m\\, v_e$$

A large launch vehicle burning about 2.5 tonnes of propellant per second with an exhaust speed of 3 km/s produces 7.5 MN — and that thrust must beat the rocket's weight before it leaves the pad at all.

### The rocket equation
As fuel burns, the rocket gets lighter, so the same thrust gives more and more acceleration. Adding up the small velocity gains as the mass falls from $m_0$ (fuelled) to $m_f$ (empty) gives the **Tsiolkovsky rocket equation** (derived below):

$$\\Delta v = v_e \\ln\\frac{m_0}{m_f}$$

This is the velocity gained in empty space, with no gravity or drag. Its lessons are sobering:
- $\\Delta v$ grows only with the [[math:logarithms|logarithm]] of the mass ratio. Doubling the mass ratio adds just $v_e\\ln 2 = 0.69\\,v_e$.
- A rocket *can* go faster than its own exhaust — once $m_0/m_f > e \\approx 2.72$.
- Reaching low Earth orbit needs about 9.4 km/s of $\\Delta v$, including the losses to gravity and drag on the way up. With $v_e = 4.4$ km/s (the best chemical engines, burning hydrogen and oxygen), the mass ratio must be $e^{9.4/4.4} \\approx 8.5$: nearly 90% of the rocket on the pad is propellant.

### Staging
Carrying empty tanks all the way to orbit wastes $\\Delta v$. Rockets are therefore built in **stages**: when a stage's fuel is spent, its tanks and engines are dropped and the next stage starts with a much better mass ratio. The $\\Delta v$ of the stages simply add.

### Beyond chemistry
The exhaust speed is everything. Ion thrusters, which accelerate charged atoms with electric fields, reach 20–50 km/s — about ten times a chemical rocket — but with a thrust of only a fraction of a newton, so they are used for months-long pushes in space, never for launch. Compare the numbers with [[escape-velocity|escape velocity]] (11.2 km/s from the Earth's surface) and the speed of a [[circular-orbits|low circular orbit]] (7.8 km/s).
`,
  ideas: [
    'A rocket moves by throwing mass backwards: conservation of momentum, with no air needed.',
    'Thrust = rate of mass ejection × exhaust speed: $F = \\dot m\\, v_e$.',
    'The rocket equation: $\\Delta v = v_e \\ln(m_0/m_f)$.',
    'Δv grows only with the logarithm of the mass ratio, so most of a rocket must be propellant.',
    'Staging discards dead mass so that each stage starts with a good mass ratio.'
  ],
  pitfalls: [
    'Rockets push against the air — They push against their own exhaust, and work best in a vacuum.',
    'Doubling the fuel doubles the final speed — Δv depends on the logarithm of the mass ratio, and extra fuel is also extra mass to accelerate.',
    'A rocket can never go faster than its exhaust — It can, once the mass ratio exceeds e ≈ 2.72.'
  ],
  derivation: {
    title: 'Derive the rocket equation',
    steps: [
      { text: 'At some moment the rocket has mass $m$. In a short time it ejects a small mass $dm_e$ of gas backwards at speed $v_e$ relative to itself, and its own velocity rises by $dv$. In the frame moving with the rocket at that moment, the total momentum is zero before and after (to first order):', tex: '0 = m\\,dv - dm_e\\, v_e' },
      { text: 'The rocket loses the mass it ejects, $dm = -dm_e$, so', tex: 'dv = -v_e\\,\\frac{dm}{m}' },
      { text: 'Add up the small steps as the mass falls from $m_0$ to $m_f$ — a [[math:separable-equations|separable equation]]:', tex: '\\Delta v = -v_e \\int_{m_0}^{m_f} \\frac{dm}{m} = -v_e \\ln\\frac{m_f}{m_0}' },
      { text: 'Which is the rocket equation:', tex: '\\Delta v = v_e \\ln\\frac{m_0}{m_f}' }
    ]
  },
  formulas: [
    {
      name: 'Thrust',
      expr: 'F = mdot*ve', tex: 'F = \\dot m\\, v_e',
      vars: {
        F: { name: 'thrust', q: 'force', unit: 'MN' },
        mdot: { name: 'rate at which propellant is ejected', q: 'massflow', unit: 'kg/s', value: 2500, tex: '\\dot m' },
        ve: { name: 'exhaust speed relative to the rocket', q: 'speed', unit: 'km/s', value: 3, tex: 'v_e' }
      },
      stories: {
        F: 'A rocket engine ejects {mdot} of exhaust at {ve}. What thrust does it produce?',
        mdot: 'An engine with an exhaust speed of {ve} must give {F} of thrust. How much propellant must it burn each second?'
      }
    },
    {
      name: 'Tsiolkovsky rocket equation',
      expr: 'dv = ve*ln(m0/mf)', tex: '\\Delta v = v_e \\ln\\frac{m_0}{m_f}',
      vars: {
        dv: { name: 'change of velocity (no gravity or drag)', q: 'speed', unit: 'km/s', tex: '\\Delta v' },
        ve: { name: 'exhaust speed relative to the rocket', q: 'speed', unit: 'km/s', value: 3, tex: 'v_e' },
        m0: { name: 'initial (fuelled) mass', q: 'mass', unit: 't', value: 500 },
        mf: { name: 'final (empty) mass', q: 'mass', unit: 't', value: 150 }
      },
      stories: {
        dv: 'A rocket stage of {m0} burns down to {mf} with an exhaust speed of {ve}. What velocity does it gain in empty space?',
        m0: 'A probe with a dry mass of {mf} and an engine of exhaust speed {ve} needs a change of velocity of {dv}. What must its fuelled mass be?'
      }
    },
    {
      name: 'Acceleration at lift-off',
      expr: 'a = mdot*ve/m0 - g', tex: 'a = \\frac{\\dot m\\, v_e}{m_0} - g',
      vars: {
        a: { name: 'upward acceleration', q: 'accel', unit: 'm/s²', signed: true },
        mdot: { name: 'rate at which propellant is ejected', q: 'massflow', unit: 'kg/s', value: 2500, tex: '\\dot m' },
        ve: { name: 'exhaust speed relative to the rocket', q: 'speed', unit: 'km/s', value: 3, tex: 'v_e' },
        m0: { name: 'mass at lift-off', q: 'mass', unit: 't', value: 500 },
        g: { const: 'g' }
      },
      note: 'Vertical launch. A negative result means the thrust cannot lift the rocket off the pad.',
      stories: {
        a: 'A {m0} rocket burns {mdot} of propellant with an exhaust speed of {ve}. What is its acceleration as it leaves the pad?',
        mdot: 'A {m0} rocket with an exhaust speed of {ve} must leave the pad with an acceleration of {a}. How much propellant must it burn each second?'
      }
    }
  ],
  examples: [
    {
      title: 'A launch stage',
      q: 'A 500 t rocket burns 2.5 t of propellant per second with an exhaust speed of 3.0 km/s, until it is down to 150 t. Find the thrust, the acceleration at lift-off, the burn time and the Δv in empty space.',
      steps: [
        'Thrust: $F = \\dot m\\,v_e = 2500 \\times 3000 = 7.5\\ \\mathrm{MN}$.',
        'At lift-off: $a = 7.5\\times10^{6}/5.0\\times10^{5} - 9.81 = 15.0 - 9.8 = 5.2\\ \\mathrm{m/s^2}$. With 2.0 t/s instead, the thrust (6.0 MN) would only just exceed the weight (4.9 MN).',
        'Burn time: $350\\ \\mathrm{t}/(2.5\\ \\mathrm{t/s}) = 140\\ \\mathrm{s}$.',
        '$\\Delta v = 3.0 \\ln(500/150) = 3.0 \\times 1.20 = 3.6\\ \\mathrm{km/s}$. On a real climb, gravity takes back up to $g \\times 140\\ \\mathrm{s} \\approx 1.4\\ \\mathrm{km/s}$ of it.'
      ],
      a: '7.5 MN, 5.2 m/s² at lift-off, 140 s, and 3.6 km/s in empty space.'
    },
    {
      title: 'Why rockets have stages',
      q: 'A 100 t rocket carries a 1 t payload and 90 t of propellant; the tanks and engines weigh 10% of the propellant they hold. Its exhaust speed is 3.0 km/s. Compare one stage (90 t of propellant, 9 t of structure) with two stages holding 72 t and 18 t of propellant.',
      steps: [
        'One stage: $m_0 = 100$ t, $m_f = 9 + 1 = 10$ t. $\\Delta v = 3.0 \\ln 10 = 6.9\\ \\mathrm{km/s}$ — not enough for orbit.',
        'Two stages. First: 72 t of propellant, 7.2 t of structure; the rest (the upper stage, 18 + 1.8 + 1 = 20.8 t) rides along. $m_0 = 100$, $m_f = 28$ t: $\\Delta v_1 = 3.0 \\ln(100/28) = 3.8\\ \\mathrm{km/s}$.',
        'Drop the empty 7.2 t first stage. Second: $m_0 = 20.8$ t, $m_f = 2.8$ t: $\\Delta v_2 = 3.0 \\ln(20.8/2.8) = 6.0\\ \\mathrm{km/s}$.',
        'Total $9.8\\ \\mathrm{km/s}$ with the same propellant and structure — enough for orbit, because the second stage no longer drags the empty first-stage tanks.'
      ],
      a: 'One stage: 6.9 km/s. Two stages: about 9.8 km/s.'
    }
  ],
  quiz: [
    { q: 'How does a rocket accelerate in the vacuum of space?', choices: ['Its exhaust pushes against the surrounding air', 'It pushes exhaust gas backwards, and the gas pushes it forwards', 'Gravity pulls it forwards', 'It cannot: rockets only work in air'], a: 1,
      why: 'Momentum conservation and the third law: the rocket and its exhaust push on each other. No air is needed.' },
    { q: 'A rocket\'s mass ratio $m_0/m_f$ is raised from 4 to 8 with the same exhaust speed. Its Δv…', choices: ['doubles', 'rises by $v_e \\ln 2 \\approx 0.69\\,v_e$', 'quadruples', 'does not change'], a: 1,
      why: '$\\Delta v = v_e \\ln(m_0/m_f)$, and $\\ln 8 - \\ln 4 = \\ln 2$. The logarithm makes extra fuel pay back less and less.' },
    { q: 'An engine ejects 200 kg/s of exhaust at 2.5 km/s. Its thrust is…', choices: ['80 N', '500 kN', '500 N', '50 MN'], a: 1,
      why: '$F = \\dot m\\, v_e = 200 \\times 2500 = 500\\,000\\ \\mathrm{N}$ = 500 kN.' },
    { q: 'A rocket can end up moving faster than the speed of its own exhaust.', a: true,
      why: '$\\Delta v$ exceeds $v_e$ whenever $\\ln(m_0/m_f) > 1$, that is when the mass ratio is larger than $e \\approx 2.72$.' }
  ],
  applications: [
    'Launch vehicles, satellites\' station-keeping thrusters and interplanetary probes.',
    'Ion and Hall-effect thrusters on communication satellites and deep-space missions.',
    'Jet engines are close cousins: they also throw gas backwards, but take their oxygen from the air.',
    'Squid, octopuses and some jellyfish swim by jet propulsion.'
  ],
  history: 'Konstantin Tsiolkovsky published the rocket equation in 1903 and argued that liquid-fuelled, multi-stage rockets could reach space; the British mathematician William Moore had derived the same relation for military rockets in 1813. Robert Goddard flew the first liquid-fuelled rocket in 1926.'
}

);
