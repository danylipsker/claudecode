/* HYPER-PHYSICS · content/kinematics.js — describing motion (the reference file:
 * other branches follow its layout and depth). */
Hyper.add(

{
  id: 'position-displacement', parent: 'kinematics', title: 'Position and displacement', level: 1,
  short: 'Where something is, measured from a chosen origin, and how far and in which direction it ended up from where it started.',
  keywords: ['position', 'displacement', 'distance', 'origin', 'reference frame', 'coordinate', 'vector'],
  prereq: ['math:coordinate-geometry', 'math:vectors'],
  related: ['speed-velocity'],
  body: `
To describe motion you first need to say **where** something is. Pick an origin and a direction, lay a number line (or axes) through it, and the **position** of an object is its coordinate: $x = 3\\ \\mathrm{m}$ means three metres from the origin in the positive direction, $x = -2\\ \\mathrm{m}$ means two metres the other way.

The choice of origin is yours and changes every position, but it never changes **how far something moved**. That is the **displacement**: the change in position,

$$\\Delta x = x_\\text{final} - x_\\text{initial}$$

Displacement has a sign (or, in two and three dimensions, a direction): it is a [[math:vectors|vector]]. Walk 5 m east and then 3 m west and your displacement is 2 m east, while the **distance** you covered is 8 m. Distance is always positive and counts every step; displacement only compares the end with the start.

### In two or three dimensions
A position becomes a vector $\\vec r = (x, y, z)$ from the origin, and the displacement is $\\Delta\\vec r = \\vec r_2 - \\vec r_1$. Its size follows from the [[math:pythagorean-theorem|Pythagorean theorem]]:

$$|\\Delta \\vec r| = \\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}$$

> [!key] Position depends on where you put the origin; displacement does not. Physics laws are written with displacements and their rates of change, so they come out the same whatever origin you choose.
`,
  ideas: [
    'Position is a coordinate measured from an origin you choose.',
    'Displacement is the change in position: final minus initial. It has a direction.',
    'Distance travelled is the length of the actual path and is never negative.',
    'For a round trip the displacement is zero, however far you went.'
  ],
  pitfalls: [
    'Displacement is the distance travelled — Only on a straight path with no turning back. Otherwise the distance is larger.',
    'A negative displacement means something went wrong — It only means the motion was towards the negative direction you chose.'
  ],
  formulas: [
    {
      name: 'Displacement along a line',
      expr: 'dx = x2 - x1', tex: '\\Delta x = x_2 - x_1',
      vars: {
        dx: { name: 'displacement', q: 'length', unit: 'm', tex: '\\Delta x', signed: true },
        x2: { name: 'final position', q: 'length', unit: 'm', value: 7, signed: true },
        x1: { name: 'initial position', q: 'length', unit: 'm', value: 2, signed: true }
      }
    },
    {
      name: 'Size of a displacement in a plane',
      expr: 'd = sqrt(dx^2 + dy^2)', tex: 'd = \\sqrt{\\Delta x^2 + \\Delta y^2}',
      vars: {
        d: { name: 'straight-line distance from the start', q: 'length', unit: 'm' },
        dx: { name: 'displacement along x', q: 'length', unit: 'm', value: 3, tex: '\\Delta x' },
        dy: { name: 'displacement along y', q: 'length', unit: 'm', value: 4, tex: '\\Delta y' }
      },
      stories: { d: 'A hiker walks {dx} east and then {dy} north. How far is she from where she started, in a straight line?' }
    }
  ],
  examples: [
    {
      title: 'A walk around the block',
      q: 'You walk 120 m east, 80 m north, 120 m west and 30 m south. What distance did you walk, and what is your displacement?',
      steps: [
        'Distance adds up every leg: $120 + 80 + 120 + 30 = 350\\ \\mathrm{m}$.',
        'Displacement compares start and end. East–west: $+120 - 120 = 0$. North–south: $+80 - 30 = +50\\ \\mathrm{m}$.',
        'So you end 50 m north of where you started.'
      ],
      a: 'Distance 350 m; displacement 50 m north.'
    }
  ],
  quiz: [
    { q: 'A runner completes exactly one lap of a 400 m track. What is her displacement?', choices: ['400 m', '200 m', '0 m', 'It depends on where the origin is'], a: 2,
      why: 'She ends where she started, so final minus initial position is zero. The distance, 400 m, is a different quantity.' },
    { q: 'Moving the origin 10 m to the left changes…', choices: ['every position and every displacement', 'every position but no displacement', 'no position but every displacement', 'nothing'], a: 1,
      why: 'All positions shift by the same 10 m, and a difference of two positions is unchanged.' },
    { q: 'Distance travelled can be smaller than the size of the displacement.', a: false,
      why: 'The straight line from start to end is the shortest possible path, so the distance is at least as large as the displacement.' }
  ]
},

{
  id: 'speed-velocity', parent: 'kinematics', title: 'Speed and velocity', level: 1,
  short: 'How fast position changes: speed is how fast, velocity is how fast and in which direction.',
  keywords: ['speed', 'velocity', 'average velocity', 'instantaneous velocity', 'rate', 'slope', 'm/s', 'km/h'],
  prereq: ['position-displacement', 'math:derivative'],
  related: ['motion-graphs', 'relative-velocity'],
  body: `
**Average velocity** is displacement divided by the time it took:

$$\\bar v = \\frac{\\Delta x}{\\Delta t}$$

**Average speed** is distance divided by time. For a trip that doubles back they differ: drive 60 km out and 60 km home in two hours and your average speed is 60 km/h while your average velocity is zero.

### Instantaneous velocity
A speedometer does not show an average over the whole trip; it shows the velocity *now*. Shrink the time interval towards zero and the average becomes the **instantaneous velocity**, the [[math:derivative|derivative]] of position:

$$v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt}$$

On a graph of position against time, that is the **slope of the tangent** at the moment you care about. A steep graph is fast motion, a flat one is rest, a downward slope is motion in the negative direction.

### Units
The SI unit is the metre per second. Handy conversions: $1\\ \\mathrm{m/s} = 3.6\\ \\mathrm{km/h} \\approx 2.24\\ \\mathrm{mph}$. Walking is about 1.4 m/s, a sprinter about 10 m/s, a jet airliner 250 m/s, sound in air 343 m/s.

> [!tip] Divide km/h by 3.6 to get m/s. 90 km/h is 25 m/s — about the length of a bus every half second.
`,
  ideas: [
    'Velocity is displacement per time and has a direction; speed is its size.',
    'Average velocity uses only the start and end; instantaneous velocity is the slope of x(t) at a moment.',
    'Speed is never negative. Velocity is negative when motion is towards the negative direction.',
    'Constant velocity means both constant speed and constant direction.'
  ],
  pitfalls: [
    'Average speed is the average of the speeds — Only if equal times are spent at each speed. Drive 60 km at 30 km/h and 60 km at 90 km/h: the average is 45 km/h, not 60.',
    'Constant speed means no acceleration — A car going round a bend at a steady 50 km/h is accelerating, because its direction changes.'
  ],
  formulas: [
    {
      name: 'Average velocity',
      expr: 'v = dx/t', tex: '\\bar v = \\frac{\\Delta x}{\\Delta t}',
      vars: {
        v: { name: 'average velocity', q: 'speed', unit: 'm/s', tex: '\\bar v', signed: true },
        dx: { name: 'displacement', q: 'length', unit: 'm', value: 100, tex: '\\Delta x', signed: true },
        t: { name: 'time taken', q: 'time', unit: 's', value: 12.5, tex: '\\Delta t' }
      },
      stories: {
        v: 'A sprinter covers {dx} in {t}. What is her average velocity?',
        t: 'How long does a car at {v} take to cover {dx}?',
        dx: 'A cyclist rides at an average {v} for {t}. How far does she get?'
      }
    }
  ],
  examples: [
    {
      title: 'The average-speed trap',
      q: 'A car drives 60 km at 30 km/h, then another 60 km at 90 km/h. What is its average speed for the whole trip?',
      steps: [
        'Time for the first half: $t_1 = 60/30 = 2\\ \\mathrm{h}$.',
        'Time for the second half: $t_2 = 60/90 = 0.667\\ \\mathrm{h}$.',
        'Average speed is total distance over total time: $\\bar v = \\dfrac{120\\ \\mathrm{km}}{2.667\\ \\mathrm{h}} = 45\\ \\mathrm{km/h}$.',
        'It is below the simple average of 60 km/h because the car spends more *time* at the slow speed.'
      ],
      a: '45 km/h'
    }
  ],
  quiz: [
    { q: 'A car goes round a roundabout at a steady 30 km/h. Which is true?', choices: ['Its velocity is constant', 'Its speed is constant but its velocity changes', 'Both speed and velocity change', 'Neither changes'], a: 1,
      why: 'Velocity includes direction. The direction changes all the way round, so the velocity does, even at constant speed.' },
    { q: 'On a position–time graph, a straight line sloping downwards means…', choices: ['slowing down', 'constant velocity in the negative direction', 'constant negative acceleration', 'the object is at rest'], a: 1,
      why: 'The slope of x(t) is the velocity. A straight line has constant slope; downward means negative.' },
    { q: 'Convert 72 km/h to m/s.', choices: ['7.2 m/s', '20 m/s', '26 m/s', '259 m/s'], a: 1, why: '72 ÷ 3.6 = 20 m/s.' }
  ],
  problems: [
    { q: 'Light from the Sun takes about 499 s to reach Earth, 1.496 × 10¹¹ m away. What speed does that give for light?', answer: 2.998e8, unit: 'm/s',
      steps: ['$v = \\dfrac{\\Delta x}{\\Delta t} = \\dfrac{1.496\\times10^{11}\\ \\mathrm{m}}{499\\ \\mathrm{s}}$', '$v \\approx 3.00\\times10^{8}\\ \\mathrm{m/s}$ — the speed of light.'] }
  ]
},

{
  id: 'acceleration', parent: 'kinematics', title: 'Acceleration', level: 1,
  short: 'How fast velocity changes: speeding up, slowing down or turning.',
  keywords: ['acceleration', 'deceleration', 'change of velocity', 'm/s²', 'g-force', 'rate of change'],
  prereq: ['speed-velocity'],
  related: ['newtons-second-law', 'uniform-circular-motion'],
  body: `
**Acceleration** is the rate at which velocity changes:

$$\\bar a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t}, \\qquad a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}$$

Its unit is metres per second **per second**, m/s²: an acceleration of 3 m/s² adds 3 m/s to the velocity every second.

Because velocity has a direction, a change of direction is an acceleration too. There are three ways to accelerate: speed up, slow down, or turn. The accelerator pedal, the brake and the steering wheel of a car are all "accelerators".

### Sign and direction
In one dimension acceleration has a sign. If it points the same way as the velocity the object speeds up; if it points against the velocity the object slows down. "Deceleration" just means acceleration opposite to the motion — a negative acceleration does **not** by itself mean slowing down: a ball falling downward (negative direction) with $a = -9.8\\ \\mathrm{m/s^2}$ is speeding up.

### Feeling it
You never feel velocity — a smooth airliner at 900 km/h feels like a parked one — but you do feel acceleration. It is often quoted in "g", multiples of $g = 9.81\\ \\mathrm{m/s^2}$: a sports car launch is about 1 g, a fighter pilot pulls 9 g, and a sneeze briefly shakes your head at a few g.
`,
  ideas: [
    'Acceleration is the rate of change of velocity, in m/s².',
    'Speeding up, slowing down and changing direction are all acceleration.',
    'An object slows down when its acceleration points against its velocity.',
    'Acceleration is the slope of a velocity–time graph.'
  ],
  pitfalls: [
    'Zero velocity means zero acceleration — A ball at the top of its flight has zero velocity but is accelerating at 9.8 m/s² downward.',
    'Negative acceleration always means slowing down — Only if the velocity is positive. With a negative velocity it means speeding up.',
    'A fast object must have a large acceleration — Speed and acceleration are independent: a cruising jet has huge speed and no acceleration.'
  ],
  formulas: [
    {
      name: 'Average acceleration',
      expr: 'a = (v - v0)/t', tex: '\\bar a = \\frac{v - v_0}{t}',
      vars: {
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', tex: '\\bar a', signed: true },
        v: { name: 'final velocity', q: 'speed', unit: 'm/s', value: 27, signed: true },
        v0: { name: 'initial velocity', q: 'speed', unit: 'm/s', value: 0, signed: true },
        t: { name: 'time taken', q: 'time', unit: 's', value: 6 }
      },
      stories: {
        a: 'A car goes from {v0} to {v} in {t}. What is its average acceleration?',
        t: 'A train accelerates at {a} from {v0}. How long until it reaches {v}?'
      }
    }
  ],
  examples: [
    {
      title: 'Zero to a hundred',
      q: 'A car reaches 100 km/h from rest in 7.5 s. What is its average acceleration, in m/s² and in g?',
      steps: ['Convert: $100\\ \\mathrm{km/h} = 100/3.6 = 27.8\\ \\mathrm{m/s}$.', '$\\bar a = \\dfrac{27.8 - 0}{7.5} = 3.70\\ \\mathrm{m/s^2}$.', 'In g: $3.70 / 9.81 = 0.38\\,g$.'],
      a: '3.7 m/s², about 0.38 g'
    }
  ],
  quiz: [
    { q: 'A ball is thrown straight up. At the highest point its acceleration is…', choices: ['zero', '9.8 m/s² upward', '9.8 m/s² downward', 'undefined'], a: 2,
      why: 'Gravity keeps pulling down the whole time. The velocity passes through zero, but it is still changing — from upward to downward.' },
    { q: 'A car moving in the negative x direction has a positive acceleration. It is…', choices: ['speeding up', 'slowing down', 'moving at constant speed', 'turning'], a: 1,
      why: 'Acceleration and velocity point in opposite directions, so the speed decreases.' },
    { q: 'An object can have zero velocity and non-zero acceleration at the same instant.', a: true, why: 'Exactly what happens at the top of a vertical throw, or when a car reverses direction.' }
  ]
},

{
  id: 'constant-acceleration', parent: 'kinematics', title: 'Equations of constant acceleration', level: 1,
  short: 'Four equations — often called SUVAT — that connect displacement, velocities, acceleration and time whenever acceleration is steady.',
  keywords: ['suvat', 'kinematic equations', 'uniformly accelerated motion', 'equations of motion', 'braking distance', 'stopping distance'],
  prereq: ['acceleration', 'math:linear-equations', 'math:quadratic-equations'],
  related: ['free-fall', 'motion-graphs'],
  body: `
When the acceleration $a$ does not change, velocity grows by the same amount every second and five quantities are tied together: displacement $\\Delta x$, initial velocity $v_0$, final velocity $v$, acceleration $a$ and time $t$. Any three give the other two, using the equation that leaves out the one you neither know nor want:

| Equation | Leaves out |
|---|---|
| $v = v_0 + at$ | $\\Delta x$ |
| $\\Delta x = v_0 t + \\tfrac12 a t^2$ | $v$ |
| $v^2 = v_0^2 + 2a\\,\\Delta x$ | $t$ |
| $\\Delta x = \\tfrac12 (v_0 + v)\\,t$ | $a$ |

### Where they come from
The first is just the definition of acceleration rearranged. With velocity rising linearly, the average velocity over the interval is halfway between start and end, $\\tfrac12(v_0 + v)$, which gives the fourth. Substituting one into the other gives the second and the third. On a velocity–time graph the displacement is the **area under the line**: a rectangle $v_0 t$ plus a triangle $\\tfrac12 a t^2$.

### Stopping distances
The third equation explains why speed is so dangerous on the road. Braking from $v_0$ to rest at a steady deceleration $a$ takes a distance $\\Delta x = v_0^2 / 2a$ — **proportional to the square of the speed**. Doubling your speed quadruples the braking distance. Open the calculator below, pick the third equation, and try it.

> [!warn] These equations hold only while the acceleration is constant. For a car whose acceleration fades as it gains speed, or a skydiver with air resistance, use them piece by piece or not at all.
`,
  ideas: [
    'Valid only when the acceleration is constant.',
    'Five quantities, four equations: each equation leaves out one quantity.',
    'Choose a positive direction and give every vector quantity its sign.',
    'Braking distance grows with the square of speed.'
  ],
  pitfalls: [
    'Using the equations with changing acceleration — Split the motion into stages where a is constant, and use the final velocity of one stage as the initial velocity of the next.',
    'Mixing signs: taking up as positive but g as +9.8 — If up is positive, the acceleration of a thrown ball is −9.8 m/s².'
  ],
  derivation: {
    title: 'Derive the four equations from a velocity–time graph',
    steps: [
      { text: 'Constant acceleration means velocity rises in a straight line, so by the definition of acceleration', tex: 'v = v_0 + a t' },
      { text: 'Displacement is the area under the v–t graph: a trapezium with parallel sides $v_0$ and $v$ and width $t$.', tex: '\\Delta x = \\tfrac12 (v_0 + v)\\, t' },
      { text: 'Replace $v$ using the first equation:', tex: '\\Delta x = \\tfrac12 (v_0 + v_0 + a t)\\, t = v_0 t + \\tfrac12 a t^2' },
      { text: 'Or remove $t = (v - v_0)/a$ instead:', tex: '\\Delta x = \\tfrac12 (v_0 + v)\\frac{v - v_0}{a} = \\frac{v^2 - v_0^2}{2a} \\;\\Rightarrow\\; v^2 = v_0^2 + 2a\\,\\Delta x' }
    ]
  },
  formulas: [
    {
      name: 'Velocity after a time',
      expr: 'v = v0 + a*t',
      vars: {
        v: { name: 'final velocity', q: 'speed', unit: 'm/s', signed: true },
        v0: { name: 'initial velocity', q: 'speed', unit: 'm/s', value: 5, signed: true },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 2, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 4 }
      },
      stories: { v: 'A cyclist at {v0} accelerates at {a} for {t}. How fast is she going then?', t: 'How long does a car take to go from {v0} to {v} at {a}?' }
    },
    {
      name: 'Displacement after a time',
      expr: 'dx = v0*t + 0.5*a*t^2', tex: '\\Delta x = v_0 t + \\tfrac12 a t^2',
      vars: {
        dx: { name: 'displacement', q: 'length', unit: 'm', tex: '\\Delta x', signed: true },
        v0: { name: 'initial velocity', q: 'speed', unit: 'm/s', value: 5, signed: true },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 2, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 4 }
      },
      stories: { dx: 'A skateboarder moving at {v0} speeds up at {a} for {t}. How far does she travel in that time?' }
    },
    {
      name: 'Velocity after a distance (no time)',
      expr: 'v^2 = v0^2 + 2*a*dx', tex: 'v^2 = v_0^2 + 2a\\,\\Delta x', solveFor: 'dx',
      vars: {
        v: { name: 'final velocity', q: 'speed', unit: 'm/s', value: 0 },
        v0: { name: 'initial velocity', q: 'speed', unit: 'km/h', value: 100 },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: -7, signed: true },
        dx: { name: 'displacement', q: 'length', unit: 'm', tex: '\\Delta x', signed: true }
      },
      note: 'Set $v = 0$ and a negative $a$ for braking: $\\Delta x$ is then the braking distance. About $-7\\ \\mathrm{m/s^2}$ is hard braking on dry asphalt.',
      practice: { unknowns: ['dx', 'v0'] },
      stories: { dx: 'A car at {v0} brakes to a stop, decelerating at {a} (so v = 0). How long is its braking distance?', v0: 'Skid marks {dx} long show a car braked to a stop at {a}. How fast was it going?' }
    },
    {
      name: 'Displacement from the average velocity',
      expr: 'dx = (v0 + v)/2*t', tex: '\\Delta x = \\tfrac12 (v_0 + v)\\, t',
      vars: {
        dx: { name: 'displacement', q: 'length', unit: 'm', tex: '\\Delta x', signed: true },
        v0: { name: 'initial velocity', q: 'speed', unit: 'm/s', value: 0, signed: true },
        v: { name: 'final velocity', q: 'speed', unit: 'm/s', value: 60, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 30 }
      },
      stories: { dx: 'An airliner accelerates steadily from {v0} to its take-off speed of {v} in {t}. How much runway does it use?' }
    }
  ],
  examples: [
    {
      title: 'Braking at twice the speed',
      q: 'A car braking at 7 m/s² needs how much distance to stop from 50 km/h? From 100 km/h?',
      steps: [
        'Use $v^2 = v_0^2 + 2a\\,\\Delta x$ with $v = 0$ and $a = -7\\ \\mathrm{m/s^2}$, so $\\Delta x = v_0^2 / (2 \\times 7)$.',
        '50 km/h is 13.9 m/s: $\\Delta x = 13.9^2 / 14 = 13.8\\ \\mathrm{m}$.',
        '100 km/h is 27.8 m/s: $\\Delta x = 27.8^2 / 14 = 55.1\\ \\mathrm{m}$ — four times as far.',
        'Add the reaction distance (about 1 s at the original speed: 14 m and 28 m) for the full stopping distance.'
      ],
      a: 'About 14 m from 50 km/h and 55 m from 100 km/h (braking only).'
    },
    {
      title: 'Two answers for one question',
      q: 'A ball is thrown upward at 15 m/s. When is it 10 m above the launch point? (Take up as positive, $a = -9.8\\ \\mathrm{m/s^2}$.)',
      steps: [
        'Use $\\Delta x = v_0 t + \\tfrac12 a t^2$: $\\;10 = 15t - 4.9t^2$.',
        'Rearranged: $4.9t^2 - 15t + 10 = 0$, a [[math:quadratic-equations|quadratic]].',
        '$t = \\dfrac{15 \\pm \\sqrt{225 - 196}}{9.8} = \\dfrac{15 \\pm 5.39}{9.8}$.',
        'Both roots are physical: the ball passes 10 m on the way up and again on the way down.'
      ],
      a: 't = 0.98 s (going up) and t = 2.08 s (coming down)'
    }
  ],
  quiz: [
    { q: 'You double your speed. Your braking distance (same deceleration) becomes…', choices: ['the same', 'twice as long', 'four times as long', 'half as long'], a: 2, why: 'From $v_0^2 = 2a\\Delta x$, the distance is proportional to $v_0^2$.' },
    { q: 'Which equation would you use to find the time, knowing $v_0$, $v$ and $\\Delta x$ but not $a$?', choices: ['$v = v_0 + at$', '$\\Delta x = v_0 t + \\tfrac12 at^2$', '$v^2 = v_0^2 + 2a\\Delta x$', '$\\Delta x = \\tfrac12(v_0 + v)t$'], a: 3,
      why: 'It is the one equation without $a$.' },
    { q: 'On a velocity–time graph, the displacement is…', choices: ['the slope', 'the area under the graph', 'the height of the graph', 'the intercept'], a: 1, why: 'Displacement is velocity × time summed up: the area between the graph and the time axis.' }
  ],
  sim: 'braking'
},

{
  id: 'free-fall', parent: 'kinematics', title: 'Free fall', level: 1,
  short: 'Near the ground, anything falling freely gains about 9.8 m/s of speed every second, whatever its mass.',
  keywords: ['free fall', 'gravity', 'g', '9.8', 'falling', 'drop', 'Galileo', 'vertical motion'],
  prereq: ['constant-acceleration', 'acceleration'],
  related: ['weight-mass', 'drag-force', 'projectile-motion', 'newtons-law-of-gravitation'],
  body: `
Drop a stone and a much heavier rock together and — as long as air resistance is negligible — they hit the ground together. Every freely falling object near the Earth's surface has the same acceleration, straight down:

$$g \\approx 9.81\\ \\mathrm{m/s^2}$$

That is [[constant-acceleration|constant acceleration]], so the familiar equations apply. For an object dropped from rest, with down taken as positive:

$$v = g t, \\qquad h = \\tfrac12 g t^2, \\qquad v = \\sqrt{2 g h}$$

After 1 s it has fallen 4.9 m and moves at 9.8 m/s; after 2 s it has fallen 19.6 m. The distance grows with the **square** of the time.

### Why the same for everything?
A heavier object is pulled harder, but it is also harder to accelerate — by exactly the same factor, because the gravitational pull is proportional to [[weight-mass|mass]]. In [[newtons-second-law|Newton's second law]] the mass cancels: $a = mg/m = g$. This equality of "heavy" and "inert" mass puzzled physicists for centuries until Einstein made it the foundation of [[equivalence-principle|general relativity]].

### Up and down
A ball thrown straight up is in free fall too, from the moment it leaves the hand: it slows at 9.8 m/s² on the way up, stops for an instant at the top, and speeds up at 9.8 m/s² on the way down, arriving back at the launch speed.

> [!note] $g$ is not quite the same everywhere: 9.78 m/s² at the equator, 9.83 m/s² at the poles, 1.62 m/s² on the Moon, 24.8 m/s² on Jupiter's cloud tops. The calculators let you change it.
`,
  ideas: [
    'Without air resistance all objects fall with the same acceleration g ≈ 9.8 m/s².',
    'From rest: v = gt and h = ½gt², so falling distance grows as t².',
    'A thrown-up object is in free fall on the way up too; its acceleration is g downward throughout.',
    'Time up equals time down, and it lands at the speed it was thrown.'
  ],
  pitfalls: [
    'Heavier objects fall faster — Only when air resistance matters (a feather and a hammer). In a vacuum, or for dense compact objects over short drops, they fall together.',
    'At the top of its flight a ball has no acceleration — Its velocity is zero there, its acceleration is still g downward.'
  ],
  formulas: [
    {
      name: 'Distance fallen from rest',
      expr: 'h = 0.5*g*t^2', tex: 'h = \\tfrac12 g t^2',
      vars: { h: { name: 'height fallen', q: 'length', unit: 'm' }, g: { const: 'g' }, t: { name: 'time of fall', q: 'time', unit: 's', value: 2 } },
      stories: { h: 'A stone is dropped down a well and hits the water {t} later. Ignoring the sound\'s travel time, how deep is the well?', t: 'How long does an apple take to fall {h} from a branch?' }
    },
    {
      name: 'Speed after falling a height',
      expr: 'v = sqrt(2*g*h)', tex: 'v = \\sqrt{2 g h}',
      vars: { v: { name: 'impact speed', q: 'speed', unit: 'm/s' }, g: { const: 'g' }, h: { name: 'height fallen', q: 'length', unit: 'm', value: 10 } },
      stories: { v: 'A diver steps off a {h} platform. How fast is she moving when she reaches the water?', h: 'From what height must you drop a phone for it to hit the floor at {v}?' }
    },
    {
      name: 'Speed after a time',
      expr: 'v = g*t',
      vars: { v: { name: 'speed', q: 'speed', unit: 'm/s' }, g: { const: 'g' }, t: { name: 'time of fall', q: 'time', unit: 's', value: 3 } }
    }
  ],
  examples: [
    {
      title: 'How deep is the well?',
      q: 'You drop a stone into a well and hear the splash 2.5 s later. Roughly how deep is the well? Then refine the answer using the speed of sound, 343 m/s.',
      steps: [
        'First guess, ignoring the sound\'s travel time: $h = \\tfrac12 (9.81)(2.5)^2 = 30.7\\ \\mathrm{m}$.',
        'The sound takes $30.7/343 \\approx 0.09\\ \\mathrm{s}$ to come back up, so the stone really fell for about $2.41\\ \\mathrm{s}$.',
        'Second estimate: $h = \\tfrac12 (9.81)(2.41)^2 = 28.5\\ \\mathrm{m}$. One more round changes it by only a few centimetres.'
      ],
      a: 'About 28.5 m (30.7 m if you ignore the sound).'
    }
  ],
  quiz: [
    { q: 'In a vacuum, a hammer and a feather are dropped together from the same height. Which lands first?', choices: ['The hammer', 'The feather', 'They land together', 'It depends on their shapes'], a: 2,
      why: 'Without air every object has the same acceleration g. Apollo 15 astronaut David Scott did exactly this on the Moon in 1971.' },
    { q: 'An object falls from rest for 3 s. How much farther does it fall in the 3rd second than in the 1st?', choices: ['The same', 'Twice as far', 'Three times as far', 'Five times as far'], a: 3,
      why: 'Distances in successive seconds go 1 : 3 : 5 : 7 … (4.9 m, 14.7 m, 24.5 m). The third second covers five times the first.' },
    { q: 'A ball thrown upward at 20 m/s returns to your hand at about…', choices: ['10 m/s', '20 m/s', '40 m/s', '0 m/s'], a: 1, why: 'Without air resistance the motion is symmetric: it lands at the speed it was thrown.' }
  ],
  applications: ['Timing a drop to estimate a cliff or well depth.', 'Drop towers and "zero-g" flights, where passengers fall freely and float.', 'Galileo\'s inclined-plane experiments, which slowed free fall down to measurable speeds.']
},

{
  id: 'projectile-motion', parent: 'kinematics', title: 'Projectile motion', level: 2,
  short: 'Anything thrown moves steadily sideways while it falls — two simple motions at once, which together trace a parabola.',
  keywords: ['projectile', 'trajectory', 'parabola', 'range', 'launch angle', 'time of flight', 'maximum height', 'ballistics', '45 degrees'],
  prereq: ['constant-acceleration', 'free-fall', 'math:vectors', 'math:right-triangle-trig'],
  related: ['drag-force', 'uniform-circular-motion', 'circular-orbits'],
  body: `
A thrown ball, a jet of water, a long jumper: once launched, each moves under gravity alone (if air resistance is small). The key idea, due to Galileo, is that the **horizontal and vertical motions are independent**:

- **Horizontally** nothing pushes, so the velocity stays constant: $v_x = v_0\\cos\\theta$.
- **Vertically** it is [[free-fall|free fall]]: $v_y = v_0\\sin\\theta - g t$.

Each part is simple on its own; together they make the curved path. Eliminating time between $x = v_0\\cos\\theta\\, t$ and $y = v_0 \\sin\\theta\\, t - \\tfrac12 g t^2$ gives the trajectory

$$y = x\\tan\\theta - \\frac{g\\,x^2}{2 v_0^2 \\cos^2\\theta}$$

— a downward [[math:conic-sections|parabola]].

### Range, height and time
Landing back at the launch height, the flight lasts $T = 2v_0\\sin\\theta / g$, reaches a highest point $H = (v_0 \\sin\\theta)^2 / 2g$ and lands a distance

$$R = \\frac{v_0^2 \\sin 2\\theta}{g}$$

away. Since $\\sin 2\\theta$ is largest when $2\\theta = 90°$, the **greatest range is at 45°**. Complementary angles — 30° and 60°, 20° and 70° — give the same range: the steeper one goes higher and takes longer.

> [!tip] Try it in the simulation: fire at 30° and then at 60° with the same speed. Then switch on air resistance and look for the new best angle — for a real ball it is well below 45°.

### Real projectiles
Air drag shortens every trajectory and makes it lopsided: steeper on the way down than on the way up. A golf drive or a baseball can lose more than half its vacuum range, and the best launch angle drops towards 30–40°. At very long range the Earth's curvature and rotation matter too — the realm of [[circular-orbits|orbits]].
`,
  ideas: [
    'Horizontal and vertical motions are independent; only gravity acts, vertically.',
    'The horizontal velocity stays constant; the vertical velocity changes by g every second.',
    'At the top the vertical velocity is zero but the horizontal velocity is not.',
    'On level ground, range is greatest at 45°, and complementary angles give equal ranges.'
  ],
  pitfalls: [
    'At the highest point the speed is zero — Only the vertical part is zero; the ball still moves sideways at v₀ cos θ.',
    'A bullet fired horizontally falls more slowly than one dropped — Both fall the same height in the same time; the fired one just travels sideways too.',
    'The range formula works for a cliff launch — It assumes landing at the launch height. From a height, solve y(t) for the landing time instead.'
  ],
  formulas: [
    {
      name: 'Range on level ground',
      expr: 'R = v0^2*sin(2*theta)/g', tex: 'R = \\frac{v_0^2 \\sin 2\\theta}{g}',
      vars: {
        R: { name: 'range', q: 'length', unit: 'm' },
        v0: { name: 'launch speed', q: 'speed', unit: 'm/s', value: 20 },
        theta: { name: 'launch angle', q: 'angle', unit: '°', value: 35, min: 0, max: 90 },
        g: { const: 'g' }
      },
      note: 'Lands at the launch height; no air resistance. Two angles give each range below the maximum.',
      stories: {
        R: 'A football is kicked at {v0}, {theta} above the level ground. How far away does it land?',
        v0: 'A shot put launched at {theta} lands {R} away (same height). What was its launch speed?',
        theta: 'A ball launched at {v0} lands {R} away on level ground. At what angle was it launched?'
      }
    },
    {
      name: 'Time of flight',
      expr: 'T = 2*v0*sin(theta)/g', tex: 'T = \\frac{2 v_0 \\sin\\theta}{g}',
      vars: {
        T: { name: 'time of flight', q: 'time', unit: 's' },
        v0: { name: 'launch speed', q: 'speed', unit: 'm/s', value: 20 },
        theta: { name: 'launch angle', q: 'angle', unit: '°', value: 35, min: 0, max: 90 },
        g: { const: 'g' }
      }
    },
    {
      name: 'Maximum height',
      expr: 'H = (v0*sin(theta))^2/(2*g)', tex: 'H = \\frac{(v_0 \\sin\\theta)^2}{2g}',
      vars: {
        H: { name: 'maximum height', q: 'length', unit: 'm' },
        v0: { name: 'launch speed', q: 'speed', unit: 'm/s', value: 20 },
        theta: { name: 'launch angle', q: 'angle', unit: '°', value: 35, min: 0, max: 90 },
        g: { const: 'g' }
      },
      stories: { H: 'A fountain throws water at {v0} at {theta} to the horizontal. How high does the jet rise?' }
    },
    {
      name: 'Height at a time (launch from any height)',
      expr: 'y = y0 + v0*sin(theta)*t - 0.5*g*t^2', tex: 'y = y_0 + v_0 \\sin\\theta\\, t - \\tfrac12 g t^2', solveFor: 't',
      vars: {
        y: { name: 'height', q: 'length', unit: 'm', value: 0, signed: true },
        y0: { name: 'launch height', q: 'length', unit: 'm', value: 20, signed: true },
        v0: { name: 'launch speed', q: 'speed', unit: 'm/s', value: 15 },
        theta: { name: 'launch angle', q: 'angle', unit: '°', value: 30, min: -90, max: 90 },
        t: { name: 'time', q: 'time', unit: 's' },
        g: { const: 'g' }
      },
      note: 'Solving for $t$ with $y = 0$ gives the landing time for a launch from a cliff of height $y_0$ — a quadratic, solved here for its positive root.',
      practice: { unknowns: ['t'] },
      stories: { t: 'A stone is thrown at {v0}, {theta} above the horizontal, from the top of a {y0} cliff. How long until it hits the ground below (y = 0)?' }
    }
  ],
  derivation: {
    title: 'Derive the range formula',
    steps: [
      { text: 'Split the launch velocity into components:', tex: 'v_x = v_0\\cos\\theta, \\qquad v_{y0} = v_0\\sin\\theta' },
      { text: 'Vertically it is free fall. It lands when $y = 0$ again:', tex: '0 = v_0\\sin\\theta\\,T - \\tfrac12 g T^2 \\;\\Rightarrow\\; T = \\frac{2v_0\\sin\\theta}{g}' },
      { text: 'Horizontally it moves at constant speed for that time:', tex: 'R = v_x T = v_0\\cos\\theta \\cdot \\frac{2v_0\\sin\\theta}{g}' },
      { text: 'Use the identity $2\\sin\\theta\\cos\\theta = \\sin 2\\theta$ (see [[math:trig-identities|trigonometric identities]]):', tex: 'R = \\frac{v_0^2 \\sin 2\\theta}{g}' }
    ]
  },
  examples: [
    {
      title: 'A long jump',
      q: 'A long jumper leaves the board at 9.5 m/s at 20° above the horizontal. How far does she jump, treating her as a point that lands at take-off height?',
      steps: [
        '$R = \\dfrac{v_0^2 \\sin 2\\theta}{g} = \\dfrac{9.5^2 \\sin 40°}{9.81}$.',
        '$9.5^2 = 90.25$ and $\\sin 40° = 0.643$, so $R = \\dfrac{90.25 \\times 0.643}{9.81} = 5.91\\ \\mathrm{m}$.',
        'Real jumpers do better than this: their centre of mass starts higher than it lands, and they reach forward with their legs.'
      ],
      a: 'About 5.9 m'
    },
    {
      title: 'Off a cliff',
      q: 'A ball is thrown horizontally at 12 m/s from a cliff 45 m high. Where does it land and how fast is it going?',
      steps: [
        'Vertically it simply falls 45 m from rest: $t = \\sqrt{2h/g} = \\sqrt{90/9.81} = 3.03\\ \\mathrm{s}$.',
        'Horizontally: $x = 12 \\times 3.03 = 36.3\\ \\mathrm{m}$ from the foot of the cliff.',
        'Velocity at impact: $v_x = 12\\ \\mathrm{m/s}$, $v_y = g t = 29.7\\ \\mathrm{m/s}$, so $v = \\sqrt{12^2 + 29.7^2} = 32.0\\ \\mathrm{m/s}$.',
        'Direction: $\\arctan(29.7/12) = 68°$ below the horizontal.'
      ],
      a: '36 m out, at 32 m/s, 68° below the horizontal'
    }
  ],
  quiz: [
    { q: 'A ball is launched at 60°. Which other angle gives the same range (same speed, level ground)?', choices: ['30°', '45°', '120°', '15°'], a: 0, why: 'sin 2θ is the same for θ and 90° − θ: sin 120° = sin 60°.' },
    { q: 'At the top of its path, a projectile\'s acceleration is…', choices: ['zero', 'horizontal', 'g, straight down', 'g, along the path'], a: 2, why: 'Gravity is the only force, all the way along the flight.' },
    { q: 'One bullet is dropped and another fired horizontally from the same height at the same moment. Which hits the (flat) ground first?', choices: ['The dropped one', 'The fired one', 'Both together', 'Depends on the speed'], a: 2,
      why: 'Vertical motion does not care about horizontal motion. Both start with zero vertical velocity and fall the same height.' },
    { q: 'With air resistance, the launch angle for maximum range is…', choices: ['exactly 45°', 'more than 45°', 'less than 45°', '90°'], a: 2,
      why: 'Drag punishes long, high flights most, so a flatter trajectory wins. Try it in the simulation.' }
  ],
  applications: ['Sports: the arc of a basketball shot, a javelin or a golf drive.', 'Firefighting hoses and garden sprinklers.', 'Ballistics and the historical science of gunnery, which drove much of early mechanics.'],
  sim: 'projectile'
}

);
