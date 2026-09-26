/* HYPER-PHYSICS · content/rotation.js — rotational motion: angular kinematics, torque,
 * moment of inertia, the rotational second law, energy, rolling, angular momentum and
 * static equilibrium. Simulations in sims/mechanics-2.js. */
Hyper.add(

{
  id: 'angular-kinematics', parent: 'rotation', title: 'Angular kinematics', level: 1,
  short: 'Describing rotation with an angle, an angular velocity and an angular acceleration — the same for every point of a rigid body.',
  keywords: ['angular velocity', 'angular acceleration', 'angular displacement', 'radian', 'rpm', 'omega', 'alpha', 'tangential speed', 'rotation'],
  prereq: ['uniform-circular-motion', 'constant-acceleration', 'math:angle-measure'],
  related: ['rotational-dynamics', 'rolling-motion', 'moment-of-inertia'],
  body: `
Watch a spinning bicycle wheel. A spot on the rim races round while a spot near the hub barely moves, yet both sweep through **the same angle** in the same time. That shared angle is what makes rotation simple to describe: one number tells you how far the whole rigid body has turned.

### Angle, angular velocity, angular acceleration
Measure the turned angle $\\theta$ in **radians**. The radian is defined so that an arc of length $s$ on a circle of radius $r$ subtends
$$\\theta = \\frac{s}{r}$$
so one revolution is $2\\pi$ rad, about 6.28 rad. Then, exactly as in straight-line [[speed-velocity|kinematics]],
$$\\omega = \\frac{d\\theta}{dt}, \\qquad \\alpha = \\frac{d\\omega}{dt}$$
The **angular velocity** $\\omega$ is in rad/s and the **angular acceleration** $\\alpha$ in rad/s². A rotation rate $f$ in revolutions per second gives $\\omega = 2\\pi f$, and $1\\ \\mathrm{rpm} = 2\\pi/60 \\approx 0.105\\ \\mathrm{rad/s}$.

### From the angle to the points
A point at distance $r$ from the axis moves along its circle with
$$v = \\omega r, \\qquad a_t = \\alpha r, \\qquad a_c = \\omega^2 r = \\frac{v^2}{r}$$
The tangential acceleration $a_t$ changes its speed; the centripetal part $a_c$ turns its direction, as in [[uniform-circular-motion|uniform circular motion]]. These links hold **only with radians** — that is the whole reason physicists use them.

Some numbers: the Earth turns once in 23 h 56 min, $\\omega = 7.29\\times10^{-5}\\ \\mathrm{rad/s}$, which carries a point on the equator at 465 m/s. A hard disk at 7200 rpm has $\\omega = 754\\ \\mathrm{rad/s}$ and a platter rim moving at 36 m/s. A washing machine drum of radius 0.25 m at 1400 rpm gives its clothes a centripetal acceleration of about 5400 m/s² — some 550 g, which is why the water flies out.

### Constant angular acceleration
When $\\alpha$ is steady, the [[constant-acceleration|equations of constant acceleration]] carry over symbol for symbol:

| Linear | Rotational |
|---|---|
| $v = v_0 + at$ | $\\omega = \\omega_0 + \\alpha t$ |
| $x = v_0 t + \\tfrac12 a t^2$ | $\\theta = \\omega_0 t + \\tfrac12 \\alpha t^2$ |
| $v^2 = v_0^2 + 2a x$ | $\\omega^2 = \\omega_0^2 + 2\\alpha\\theta$ |

> [!key] Every point of a rigid body shares the same $\\theta$, $\\omega$ and $\\alpha$. Only the linear quantities — arc length, speed, acceleration — grow with the distance from the axis.

### A direction for spin
Angular velocity is really a vector along the axis. Curl the fingers of your right hand the way the body turns and your thumb points along $\\vec\\omega$. For the Earth it points out of the North Pole. The vector picture pays off with [[torque]] and [[angular-momentum|angular momentum]].
`,
  ideas: [
    'All points of a rigid body turn through the same angle, with the same ω and α.',
    'Angles are measured in radians so that s = rθ, v = ωr and a_t = αr hold without extra factors.',
    'A point spinning at constant ω still accelerates towards the axis at ω²r.',
    'With constant α the rotational equations mirror the linear ones: θ ↔ x, ω ↔ v, α ↔ a.'
  ],
  pitfalls: [
    'Plugging rpm or degrees into v = ωr — The formula needs ω in rad/s. Convert first: multiply rpm by 2π/60.',
    'Every point on a wheel has the same speed — They share the angular velocity; the linear speed grows in proportion to the distance from the axis.',
    'Constant angular velocity means no acceleration — Each point still has a centripetal acceleration ω²r towards the axis.'
  ],
  formulas: [
    {
      name: 'Speed of a point on a rotating body',
      expr: 'v = omega*r', tex: 'v = \\omega r',
      vars: {
        v: { name: 'speed of the point', q: 'speed', unit: 'm/s' },
        omega: { name: 'angular velocity', q: 'angvel', unit: 'rpm', value: 7200 },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 47.5 }
      },
      stories: {
        v: 'A hard-disk platter spins at {omega}. How fast does its rim, {r} from the spindle, move?',
        omega: 'A car wheel of radius {r} rolls along at {v}. How fast does it spin?'
      }
    },
    {
      name: 'Centripetal acceleration from the spin rate',
      expr: 'a = omega^2*r', tex: 'a_c = \\omega^2 r',
      vars: {
        a: { name: 'centripetal acceleration', q: 'accel', unit: 'm/s²', tex: 'a_c' },
        omega: { name: 'angular velocity', q: 'angvel', unit: 'rpm', value: 1400 },
        r: { name: 'radius', q: 'length', unit: 'm', value: 0.25 }
      },
      stories: { a: 'A washing-machine drum of radius {r} spins at {omega}. What acceleration do the clothes feel?', omega: 'A centrifuge must give its samples {a} at a radius of {r}. How fast must it spin?' }
    },
    {
      name: 'Angular velocity after a time',
      expr: 'omega = omega0 + alpha*t', tex: '\\omega = \\omega_0 + \\alpha t',
      vars: {
        omega: { name: 'final angular velocity', q: 'angvel', unit: 'rad/s', signed: true },
        omega0: { name: 'initial angular velocity', q: 'angvel', unit: 'rad/s', value: 0, signed: true },
        alpha: { name: 'angular acceleration', q: 'angacc', unit: 'rad/s²', value: 15.7, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 8 }
      },
      stories: { omega: 'A drum starts at {omega0} and speeds up at {alpha} for {t}. How fast is it turning then?', t: 'A turbine accelerates at {alpha} from {omega0}. How long until it reaches {omega}?' }
    },
    {
      name: 'Angle turned under constant angular acceleration',
      expr: 'theta = omega0*t + 0.5*alpha*t^2', tex: '\\theta = \\omega_0 t + \\tfrac12 \\alpha t^2',
      vars: {
        theta: { name: 'angle turned', q: 'angle', unit: 'rev', signed: true },
        omega0: { name: 'initial angular velocity', q: 'angvel', unit: 'rad/s', value: 0, signed: true },
        alpha: { name: 'angular acceleration', q: 'angacc', unit: 'rad/s²', value: 15.7, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 8 }
      },
      stories: { theta: 'A drum starting at {omega0} accelerates at {alpha} for {t}. How many turns does it make?' }
    }
  ],
  examples: [
    {
      title: 'Spin-up of a washing machine',
      q: 'A drum goes from rest to 1200 rpm in 8.0 s at a steady rate. Find its angular acceleration and the number of turns it makes on the way.',
      steps: [
        'Convert: $\\omega = 1200 \\times \\dfrac{2\\pi}{60} = 125.7\\ \\mathrm{rad/s}$.',
        '$\\alpha = \\dfrac{\\omega - \\omega_0}{t} = \\dfrac{125.7}{8.0} = 15.7\\ \\mathrm{rad/s^2}$.',
        '$\\theta = \\tfrac12 \\alpha t^2 = \\tfrac12 (15.7)(8.0)^2 = 503\\ \\mathrm{rad}$.',
        'In turns: $503 / 2\\pi = 80$. Check: the average rate is 600 rpm, or 10 rev/s, for 8 s.'
      ],
      a: 'α ≈ 15.7 rad/s²; 80 revolutions.'
    },
    {
      title: 'How fast is London moving?',
      q: 'The Earth turns once every 86 164 s. How fast does the rotation carry a person in London (latitude 51.5°)? Take the Earth\'s radius as 6371 km.',
      steps: [
        '$\\omega = 2\\pi / 86\\,164\\ \\mathrm{s} = 7.29\\times10^{-5}\\ \\mathrm{rad/s}$.',
        'London moves on a circle round the axis of radius $r = R\\cos 51.5° = 6371 \\times 0.623 = 3966\\ \\mathrm{km}$.',
        '$v = \\omega r = 7.29\\times10^{-5} \\times 3.966\\times10^{6} = 289\\ \\mathrm{m/s}$ — over 1000 km/h, which nobody feels because it is almost perfectly steady.'
      ],
      a: 'About 290 m/s eastward.'
    }
  ],
  quiz: [
    { q: 'Two children ride a merry-go-round, one at the rim and one halfway to the centre. Compared with the inner child, the outer one has…', choices: ['the same ω and the same speed', 'the same ω and twice the speed', 'twice ω and twice the speed', 'half the ω and the same speed'], a: 1,
      why: 'The whole platform turns as one, so ω is shared. Speed is v = ωr, so doubling r doubles v.' },
    { q: 'A turntable spins at 60 rpm. Its angular velocity is about…', choices: ['1 rad/s', '6.3 rad/s', '60 rad/s', '377 rad/s'], a: 1,
      why: '60 rpm is 1 rev/s, and one revolution is 2π ≈ 6.28 rad. 377 rad/s would be 60 rev/s.' },
    { q: 'A point on the rim of a wheel turning at a perfectly steady rate has zero acceleration.', a: false,
      why: 'Its direction keeps changing, so it has a centripetal acceleration ω²r towards the axis, even though α = 0.' },
    { q: 'A fan slows steadily from 30 rad/s to rest in 10 s. How many radians does it turn while stopping?', choices: ['15 rad', '150 rad', '300 rad', '3 rad'], a: 1,
      why: 'The average angular velocity is (30 + 0)/2 = 15 rad/s, over 10 s: 150 rad (about 24 turns).' }
  ],
  applications: ['Rev counters, hard disks, turbines and drills are all rated in rpm — convert to rad/s before calculating.', 'Centrifuges separate blood and enrich uranium by making ω²r thousands of times larger than g.', 'Gear trains trade angular velocity between shafts while the rim speeds of meshing teeth match.']
},

{
  id: 'torque', parent: 'rotation', title: 'Torque', level: 1,
  short: 'The turning effect of a force: how hard it twists something about an axis. It grows with the force and with the lever arm.',
  keywords: ['torque', 'moment', 'moment of a force', 'lever arm', 'lever', 'spanner', 'wrench', 'turning effect', 'couple', 'N·m', 'cross product'],
  prereq: ['force', 'math:cross-product', 'math:right-triangle-trig'],
  related: ['static-equilibrium', 'rotational-dynamics', 'torque-on-loop'],
  body: `
Push a door right next to its hinges and it hardly moves; push the same amount at the handle and it swings open. Push the handle straight towards the hinges and nothing happens at all. The turning effect of a force depends on **how big** it is, **where** it acts and **in which direction**. That turning effect is the **torque** (engineers often call it the **moment** of the force).

### The formula
For a force $F$ applied at a distance $r$ from the axis, at an angle $\\phi$ between the arm $\\vec r$ and the force,
$$\\tau = r F \\sin\\phi$$
Two readings of it are useful:
- $F \\sin\\phi$ is the part of the force **perpendicular** to the arm — only that part turns things;
- $r \\sin\\phi$ is the **lever arm** $d$: the perpendicular distance from the axis to the line along which the force acts. Then simply $\\tau = F d$.

A force whose line passes through the axis has no lever arm and no torque, however large it is. The unit is the newton metre, N·m.

### Direction and sign
Torque is a [[math:cross-product|cross product]], $\\vec\\tau = \\vec r \\times \\vec F$, a vector along the axis given by the right-hand rule. In flat problems it is enough to give it a sign: anticlockwise positive, clockwise negative. The **net torque** is the signed sum of all of them, and it is net torque that changes rotation, just as net force changes motion — see [[rotational-dynamics|the second law for rotation]].

### Everyday torques
| Situation | Torque |
|---|---|
| Tightening a car wheel nut | about 110–130 N·m |
| Cyclist standing on a horizontal pedal (700 N, crank 0.175 m) | about 120 N·m |
| Family-car engine | 150–400 N·m |
| 5 kg dumbbell held at arm's length (0.6 m from the shoulder) | about 29 N·m |

The cyclist's torque falls to zero with the crank straight up or down (the "dead centre"): the push then points along the crank.

> [!tip] Longer spanners do not make you stronger — they give your force a longer lever arm. The same trick is a crowbar, a bottle opener, a wheelbarrow and the handle of every door.

### Couples
Two equal and opposite forces that do not act along the same line — two hands on a steering wheel — produce no net force but a pure turning effect $\\tau = F d$, where $d$ is the distance between their lines. A couple has the same torque about every point.

N·m has the same dimensions as the joule, but torque is not energy: a torque does work only when something turns, $W = \\tau\\,\\Delta\\theta$ (see [[rotational-kinetic-energy]]).
`,
  ideas: [
    'Torque is the turning effect of a force: τ = rF sin φ = F × lever arm.',
    'The lever arm is the perpendicular distance from the axis to the line of action of the force.',
    'A force pointing through the axis gives zero torque, however large.',
    'Torques are signed (or vectors): anticlockwise and clockwise turning effects can cancel.'
  ],
  pitfalls: [
    'Torque depends only on the size of the force — Where and in which direction it acts matter just as much: the same 100 N can give 50 N·m or nothing.',
    'Multiplying the force by the distance to where it acts, whatever its direction — Use the perpendicular part of the force, or the perpendicular lever arm, not the straight-line distance times the whole force.',
    'Writing torque in joules — Both are N·m in SI, but torque is a turning effect, not energy. Keep the unit N·m for torque.'
  ],
  formulas: [
    {
      name: 'Torque of a force',
      expr: 'tau = r*F*sin(phi)', tex: '\\tau = r F \\sin\\phi',
      vars: {
        tau: { name: 'torque', q: 'torque', unit: 'N·m' },
        r: { name: 'distance from the axis to where the force acts', q: 'length', unit: 'm', value: 0.45 },
        F: { name: 'force', q: 'force', unit: 'N', value: 270 },
        phi: { name: 'angle between the arm and the force', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      note: 'Two angles, $\\phi$ and $180° - \\phi$, give the same torque; the force is most effective at 90°.',
      stories: {
        tau: 'A mechanic pulls with {F} on the end of a {r} wrench, at {phi} to the handle. What torque does she apply to the nut?',
        F: 'A wheel nut needs {tau}. With a wrench of length {r} pulled at {phi}, what force is needed?',
        r: 'You can pull with {F} at {phi} to the handle. How long a wrench do you need to reach {tau}?'
      }
    },
    {
      name: 'Torque of a weight on a horizontal arm',
      expr: 'tau = m*g*d', tex: '\\tau = m g d',
      vars: {
        tau: { name: 'torque about the pivot', q: 'torque', unit: 'N·m' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' },
        d: { name: 'horizontal distance from the pivot', q: 'length', unit: 'm', value: 0.6 }
      },
      stories: { tau: 'You hold a {m} dumbbell with your arm straight out, {d} from your shoulder. What torque must your shoulder muscles supply?', d: 'A sign of mass {m} hangs from a bracket. How far out can it hang if the wall fixing can take {tau}?' }
    }
  ],
  examples: [
    {
      title: 'A stubborn wheel nut',
      q: 'A wheel nut must be tightened to 120 N·m with a wrench 0.45 m long. What force is needed at the end of the handle if you push perpendicular to it? And if you push at 60° to the handle?',
      steps: [
        'Perpendicular: $F = \\dfrac{\\tau}{r} = \\dfrac{120}{0.45} = 267\\ \\mathrm{N}$ — roughly the weight of 27 kg.',
        'At 60°: only $F\\sin 60°$ turns the nut, so $F = \\dfrac{120}{0.45 \\times 0.866} = 308\\ \\mathrm{N}$.',
        'A 0.9 m extension bar would halve both forces.'
      ],
      a: '267 N perpendicular; 308 N at 60°.'
    },
    {
      title: 'Round the pedals',
      q: 'A 70 kg cyclist stands on one pedal (force 687 N straight down). The crank is 0.175 m long. Find the torque with the crank horizontal, and 30° past the top.',
      steps: [
        'Horizontal crank: the force is perpendicular to it, $\\tau = rF = 0.175 \\times 687 = 120\\ \\mathrm{N\\,m}$.',
        '30° past the top, the angle between the crank and the vertical force is 150°, and $\\sin 150° = 0.5$.',
        '$\\tau = 0.175 \\times 687 \\times 0.5 = 60\\ \\mathrm{N\\,m}$ — half as much. At the very top it is zero.'
      ],
      a: '120 N·m horizontal; 60 N·m at 30° past the top.'
    }
  ],
  quiz: [
    { q: 'You want to open a heavy door with the smallest possible push. Where and how should you push?', choices: ['Near the hinges, perpendicular to the door', 'At the far edge, perpendicular to the door', 'At the far edge, towards the hinges', 'Anywhere — only the force matters'], a: 1,
      why: 'The largest lever arm (far from the hinges) and a perpendicular push give the most torque per newton.' },
    { q: 'A force of 50 N acts at 0.3 m from an axis, at 30° to the arm. A second force of 50 N acts at the same point at 150° to the arm. Their torques…', choices: ['are equal in size', 'differ by a factor of 5', 'are zero and maximal', 'cannot be compared'], a: 0,
      why: 'sin 30° = sin 150° = 0.5, so both give 50 × 0.3 × 0.5 = 7.5 N·m.' },
    { q: 'A huge force aimed straight at the hinge line of a door produces a huge torque.', a: false,
      why: 'Its line of action passes through the axis, so the lever arm is zero and so is the torque.' },
    { q: 'Two people push a roundabout from opposite sides, each with 100 N at 1.5 m, tangentially and both clockwise. The net torque is…', choices: ['0', '150 N·m', '300 N·m', '600 N·m'], a: 2,
      why: 'Both torques have the same sense, so they add: 2 × 100 × 1.5 = 300 N·m. The forces cancel, so this is a couple.' }
  ],
  applications: ['Torque wrenches let mechanics tighten bolts to a specified torque, not just "tight".', 'Engine and electric-motor data sheets quote torque against speed; power follows as P = τω.', 'Levers of every kind: crowbars, scissors, oars, wheelbarrows and your own bones and muscles.'],
  sim: 'mech2-seesaw'
},

{
  id: 'moment-of-inertia', parent: 'rotation', title: 'Moment of inertia', level: 2,
  short: 'Rotational inertia: how hard it is to change an object\'s spin. It depends on the mass and, even more, on how far that mass sits from the axis.',
  keywords: ['moment of inertia', 'rotational inertia', 'I', 'parallel axis theorem', 'radius of gyration', 'second moment of mass', 'flywheel', 'kg·m²'],
  prereq: ['angular-kinematics', 'center-of-mass', 'math:definite-integral'],
  related: ['rotational-dynamics', 'rotational-kinetic-energy', 'rolling-motion'],
  body: `
Mass tells you how hard it is to change an object's straight-line motion. For rotation the matching quantity is the **moment of inertia** $I$, and it has a twist: it depends not just on how much mass there is, but on **where the mass sits relative to the axis**. Mass far from the axis counts much more than mass close in.

Try it with a broom: twirl it about its long axis and it spins easily; swing it about an axis through the middle of the handle and it resists; swing it about the far end of the handle and it resists even more. Same mass, three moments of inertia.

### Definition
For a collection of small masses $m_i$ at distances $r_i$ from the axis,
$$I = \\sum_i m_i r_i^2 \\qquad\\text{or, for a continuous body,}\\qquad I = \\int r^2\\, dm$$
Units: kg·m². Because of the square, a mass twice as far out counts four times as much.

### Standard shapes
Each is mass $M$ times a length squared times a number that captures the shape:

| Object and axis | $I$ |
|---|---|
| Thin hoop or ring, about its centre | $MR^2$ |
| Solid disc or cylinder, about its axis | $\\tfrac12 MR^2$ |
| Thin spherical shell, about a diameter | $\\tfrac23 MR^2$ |
| Solid sphere, about a diameter | $\\tfrac25 MR^2$ |
| Thin rod of length $L$, about its centre | $\\tfrac{1}{12} ML^2$ |
| Thin rod of length $L$, about one end | $\\tfrac13 ML^2$ |

A hoop puts all its mass at $R$; a disc spreads it inwards and gets half; a solid sphere, with most of its mass near the axis, gets only 2/5. The Earth, with its dense iron core, has $I \\approx 0.33\\,MR^2$ — less than a uniform ball's 0.40 — one of the clues that its mass is concentrated towards the centre.

### Moving the axis
The **parallel-axis theorem** gives $I$ about any axis parallel to one through the [[center-of-mass|centre of mass]], a distance $d$ away:
$$I = I_\\text{cm} + M d^2$$
Check it on the rod: $\\tfrac1{12}ML^2 + M(L/2)^2 = \\tfrac13 ML^2$. It also shows that the axis through the centre of mass always has the smallest $I$ of its parallel family.

### Radius of gyration
Writing $I = Mk^2$ defines the **radius of gyration** $k$: the distance at which all the mass could be concentrated to give the same $I$. For a solid disc $k = R/\\sqrt2 \\approx 0.71R$.

> [!tip] Designers who want a lot of inertia for little mass — flywheels, tightrope walkers' poles — push the mass outwards. Designers who want quick turns — racing wheels, a sprinter's legs — keep it close to the axis.

The moment of inertia plays the role of mass in [[rotational-dynamics|τ = Iα]], in [[rotational-kinetic-energy|rotational kinetic energy]] $\\tfrac12 I\\omega^2$ and in [[angular-momentum|angular momentum]] $L = I\\omega$, and it decides the winner of the [[rolling-motion|rolling race]].
`,
  ideas: [
    'Moment of inertia is resistance to changes of rotation: I = Σ m r².',
    'Mass far from the axis counts with the square of its distance.',
    'The same object has different moments of inertia about different axes.',
    'Parallel-axis theorem: I = I_cm + Md², so the axis through the centre of mass gives the smallest I.'
  ],
  pitfalls: [
    'Moment of inertia is just another name for mass — Two objects of the same mass can have very different I; a hoop has twice the I of a disc of the same mass and radius.',
    'For an extended body, I = M × (distance of the centre of mass)² — That is only true for a point mass. A rod about its end has ⅓ML², not ¼ML².',
    'Using the parallel-axis theorem between two axes that are not through the centre of mass — It must start from I_cm; otherwise go back to the centre-of-mass axis first.'
  ],
  derivation: {
    title: 'I of a thin rod about its centre',
    steps: [
      { text: 'A uniform rod of mass $M$ and length $L$ has mass $\\lambda = M/L$ per metre. A slice of length $dx$ at position $x$ has mass $dm = \\lambda\\, dx$.', tex: 'dI = x^2\\, dm = \\frac{M}{L} x^2\\, dx' },
      { text: 'Add up the slices from one end to the other ([[math:definite-integral|a definite integral]]):', tex: 'I = \\frac{M}{L}\\int_{-L/2}^{L/2} x^2\\, dx = \\frac{M}{L}\\left[\\frac{x^3}{3}\\right]_{-L/2}^{L/2}' },
      { text: 'Evaluate:', tex: 'I = \\frac{M}{L}\\cdot\\frac{2}{3}\\left(\\frac{L}{2}\\right)^3 = \\frac{1}{12} M L^2' },
      { text: 'Integrating from 0 to $L$ instead (axis at one end) gives $\\tfrac13 ML^2$ — four times more, as the parallel-axis theorem predicts.' }
    ]
  },
  formulas: [
    {
      name: 'Moment of inertia of a round body',
      expr: 'I = c*M*R^2', tex: 'I = c\\, M R^2',
      vars: {
        I: { name: 'moment of inertia', q: 'inertia', unit: 'kg·m²' },
        c: { name: 'shape factor (1 hoop, ½ disc, ⅖ sphere, ⅔ shell)', value: 0.5 },
        M: { name: 'mass', q: 'mass', unit: 'kg', value: 100 },
        R: { name: 'radius', q: 'length', unit: 'm', value: 0.3 }
      },
      note: '$c = 1$ for a thin hoop, $\\tfrac12$ for a solid disc or cylinder, $\\tfrac23$ for a thin spherical shell and $\\tfrac25$ for a solid sphere.',
      practice: { unknowns: ['I', 'R'] },
      stories: { I: 'A flywheel is a solid disc (c = {c}) of mass {M} and radius {R}. What is its moment of inertia?', R: 'A hoop (c = {c}) of mass {M} must have a moment of inertia of {I}. What radius should it have?' }
    },
    {
      name: 'Thin rod about its centre',
      expr: 'I = M*L^2/12', tex: 'I = \\frac{1}{12} M L^2',
      vars: {
        I: { name: 'moment of inertia', q: 'inertia', unit: 'kg·m²' },
        M: { name: 'mass of the rod', q: 'mass', unit: 'kg', value: 2 },
        L: { name: 'length of the rod', q: 'length', unit: 'm', value: 1 }
      },
      stories: { I: 'A baton of mass {M} and length {L} is twirled about its middle. What is its moment of inertia?' }
    },
    {
      name: 'Parallel-axis theorem',
      expr: 'I = Icm + M*d^2', tex: 'I = I_{\\text{cm}} + M d^2',
      vars: {
        I: { name: 'moment of inertia about the new axis', q: 'inertia', unit: 'kg·m²' },
        Icm: { name: 'moment of inertia about the centre of mass', q: 'inertia', unit: 'kg·m²', value: 0.1667, tex: 'I_{\\text{cm}}' },
        M: { name: 'mass', q: 'mass', unit: 'kg', value: 2 },
        d: { name: 'distance between the axes', q: 'length', unit: 'm', value: 0.5 }
      },
      stories: { I: 'A body of mass {M} has I = {Icm} about its centre of mass. What is its moment of inertia about a parallel axis {d} away?' }
    }
  ],
  examples: [
    {
      title: 'A baton about two axes',
      q: 'A majorette\'s baton is a uniform rod of mass 0.40 kg and length 0.70 m. Find its moment of inertia about its centre and about one end.',
      steps: [
        'About the centre: $I = \\tfrac1{12} ML^2 = \\tfrac1{12}(0.40)(0.70)^2 = 0.0163\\ \\mathrm{kg\\,m^2}$.',
        'About an end, with the parallel-axis theorem: $I = 0.0163 + 0.40 \\times 0.35^2 = 0.0163 + 0.0490 = 0.0653\\ \\mathrm{kg\\,m^2}$.',
        'Four times as much — which is why a baton is twirled about its middle.'
      ],
      a: '0.016 kg·m² about the centre, 0.065 kg·m² about an end.'
    },
    {
      title: 'Sliding the weights in',
      q: 'A light bar carries two 2.0 kg weights, one on each side of the axis, 0.30 m from it. What is its moment of inertia? What if both are moved in to 0.15 m?',
      steps: [
        'Treat the weights as point masses: $I = 2 \\times (2.0)(0.30)^2 = 0.36\\ \\mathrm{kg\\,m^2}$.',
        'At 0.15 m: $I = 2 \\times (2.0)(0.15)^2 = 0.09\\ \\mathrm{kg\\,m^2}$.',
        'Halving the distance quarters the moment of inertia, though the mass is unchanged.'
      ],
      a: '0.36 kg·m², falling to 0.09 kg·m².'
    }
  ],
  quiz: [
    { q: 'A thin hoop and a solid disc have the same mass and radius. Which has the larger moment of inertia about its axis?', choices: ['The disc', 'The hoop', 'They are equal', 'It depends on how fast they spin'], a: 1,
      why: 'All of the hoop\'s mass is at the rim, distance R; the disc has much of its mass closer in. I_hoop = MR², I_disc = ½MR².' },
    { q: 'You keep the mass of a solid disc the same but double its radius. Its moment of inertia…', choices: ['stays the same', 'doubles', 'quadruples', 'halves'], a: 2,
      why: 'I = ½MR² grows with the square of the radius.' },
    { q: 'Of all axes parallel to a given direction, the one through the centre of mass gives the smallest moment of inertia.', a: true,
      why: 'Parallel-axis theorem: I = I_cm + Md², and Md² is never negative.' },
    { q: 'A rod of mass M and length L is swung about one end. Its moment of inertia is…', choices: ['ML²/12', 'ML²/4', 'ML²/3', 'ML²'], a: 2,
      why: 'ML²/12 + M(L/2)² = ML²/3. ML²/4 is the mistake of treating the whole rod as a point at its centre.' }
  ],
  applications: ['Flywheels in engines and energy stores put their mass in a heavy rim.', 'Figure skaters, divers and gymnasts change their moment of inertia by tucking and stretching.', 'Choking up on a bat or a golf club lowers its moment of inertia about the hands and speeds the swing.'],
  sim: 'mech2-rolling-race'
},

{
  id: 'rotational-dynamics', parent: 'rotation', title: 'Newton\'s second law for rotation', level: 2,
  short: 'Net torque causes angular acceleration, τ = Iα — the rotational twin of F = ma, with moment of inertia in place of mass.',
  keywords: ['second law for rotation', 'torque and angular acceleration', 'tau = I alpha', 'rotational dynamics', 'pulley with mass', 'windlass', 'Atwood machine'],
  prereq: ['torque', 'moment-of-inertia', 'newtons-second-law'],
  related: ['rotational-kinetic-energy', 'angular-momentum', 'tension-pulleys'],
  body: `
A net force makes a body accelerate; a net [[torque]] makes it spin faster or slower. The two laws have exactly the same shape:
$$\\sum F = m a \\qquad\\leftrightarrow\\qquad \\sum \\tau = I \\alpha$$
The bigger the [[moment-of-inertia|moment of inertia]] $I$, the smaller the angular acceleration $\\alpha$ that a given torque produces.

### Where it comes from
Take a small mass $m$ on a light arm of length $r$, pushed by a force whose tangential part is $F_t$. [[newtons-second-law|Newton's second law]] along the circle says $F_t = m a_t = m r \\alpha$. Multiply both sides by $r$: $\\tau = r F_t = m r^2 \\alpha$. A rigid body is many such masses sharing one $\\alpha$, and the internal forces between them come in equal and opposite pairs whose torques cancel. What is left is
$$\\tau_\\text{net} = \\Big(\\sum m_i r_i^2\\Big)\\alpha = I\\alpha$$

### The dictionary
Almost everything in linear mechanics has a rotational twin:

| Linear | Rotational |
|---|---|
| position $x$ | angle $\\theta$ |
| velocity $v$ | angular velocity $\\omega$ |
| acceleration $a$ | angular acceleration $\\alpha$ |
| mass $m$ | moment of inertia $I$ |
| force $F$ | torque $\\tau$ |
| $F = ma$ | $\\tau = I\\alpha$ |
| momentum $p = mv$ | angular momentum $L = I\\omega$ |
| kinetic energy $\\tfrac12 mv^2$ | $\\tfrac12 I\\omega^2$ |
| power $P = Fv$ | $P = \\tau\\omega$ |

### A pulley that has mass
Hang a bucket of mass $m$ on a rope wound round a drum (radius $R$, moment of inertia $I$) that turns freely. The rope tension $T$ both slows the bucket and spins the drum:
$$mg - T = ma, \\qquad TR = I\\alpha = I\\frac{a}{R}$$
Eliminate $T$:
$$a = \\frac{mg}{m + I/R^2}$$
A light drum ($I \\to 0$) lets the bucket fall freely; a heavy one holds it back, as if the drum added a mass $I/R^2$ to the system. For a solid drum, $I/R^2 = M/2$.

> [!warn] With a massive pulley the rope tension is **different** on the two sides. The difference is exactly what supplies the torque to spin it up. Only an ideal, massless pulley has one tension throughout.

### Choosing the axis
For a body turning about a fixed axle, take torques about that axle. For a body that also moves — a rolling ball, a falling yo-yo — $\\tau = I\\alpha$ holds about the **centre of mass**, together with $F = ma$ for the centre of mass itself; see [[rolling-motion]].
`,
  ideas: [
    'Net torque equals moment of inertia times angular acceleration: τ = Iα.',
    'Moment of inertia plays the part of mass: the larger I, the smaller α for a given torque.',
    'Every linear quantity has a rotational twin: x↔θ, v↔ω, a↔α, m↔I, F↔τ.',
    'A massive pulley needs different rope tensions on its two sides; the difference turns it.'
  ],
  pitfalls: [
    'The tension is the same on both sides of every pulley — Only for a massless (or non-accelerating) pulley. A real pulley needs a tension difference to spin up.',
    'Adding forces that pass through the axle into the torque sum — The force of the axle on a wheel acts at the axis and has no torque about it; leave it out of Στ (but not out of ΣF).',
    'Mixing a torque in N·m with an angular acceleration in rpm/s or °/s² — τ = Iα needs α in rad/s².'
  ],
  formulas: [
    {
      name: 'Second law for rotation',
      expr: 'tau = I*alpha', tex: '\\tau = I\\alpha',
      vars: {
        tau: { name: 'net torque', q: 'torque', unit: 'N·m', signed: true },
        I: { name: 'moment of inertia', q: 'inertia', unit: 'kg·m²', value: 0.5 },
        alpha: { name: 'angular acceleration', q: 'angacc', unit: 'rad/s²', value: 8, signed: true }
      },
      stories: { alpha: 'A torque of {tau} acts on a wheel with I = {I}. What is its angular acceleration?', tau: 'What torque gives a rotor with I = {I} an angular acceleration of {alpha}?' }
    },
    {
      name: 'Load hanging from a wheel that turns',
      expr: 'a = m*g/(m + I/R^2)', tex: 'a = \\frac{m g}{m + I/R^2}',
      vars: {
        a: { name: 'acceleration of the load', q: 'accel', unit: 'm/s²' },
        m: { name: 'hanging mass', q: 'mass', unit: 'kg', value: 2 },
        g: { const: 'g' },
        I: { name: 'moment of inertia of the wheel', q: 'inertia', unit: 'kg·m²', value: 0.02 },
        R: { name: 'radius where the rope leaves the wheel', q: 'length', unit: 'm', value: 0.1 }
      },
      note: 'The rope does not slip and the axle is frictionless. For a solid drum of mass $M$, $I/R^2 = M/2$.',
      stories: { a: 'A {m} bucket hangs on a rope wound round a windlass drum (I = {I}, radius {R}). With what acceleration does it fall when released?', I: 'A {m} load wound round a wheel of radius {R} falls with acceleration {a}. What is the moment of inertia of the wheel?' }
    },
    {
      name: 'Time to stop a spinning wheel',
      expr: 't = I*omega/tau', tex: 't = \\frac{I\\omega}{\\tau}',
      vars: {
        t: { name: 'stopping time', q: 'time', unit: 's' },
        I: { name: 'moment of inertia', q: 'inertia', unit: 'kg·m²', value: 0.02 },
        omega: { name: 'initial angular velocity', q: 'angvel', unit: 'rpm', value: 3000 },
        tau: { name: 'braking torque', q: 'torque', unit: 'N·m', value: 0.5 }
      },
      stories: { t: 'A grinding wheel (I = {I}) spinning at {omega} is switched off; friction in its bearings exerts {tau}. How long does it take to stop?', tau: 'A rotor with I = {I} at {omega} must stop within {t}. What braking torque is needed?' }
    }
  ],
  examples: [
    {
      title: 'The well bucket',
      q: 'A 2.0 kg bucket hangs on a rope wound round a solid cylindrical windlass of mass 4.0 kg and radius 0.10 m. The handle is let go. Find the bucket\'s acceleration and the rope tension.',
      steps: [
        'The drum: $I = \\tfrac12 MR^2 = \\tfrac12 (4.0)(0.10)^2 = 0.020\\ \\mathrm{kg\\,m^2}$, so $I/R^2 = 2.0\\ \\mathrm{kg}$.',
        '$a = \\dfrac{mg}{m + I/R^2} = \\dfrac{2.0 \\times 9.81}{2.0 + 2.0} = 4.9\\ \\mathrm{m/s^2}$ — half of free fall.',
        'Tension from the bucket\'s equation: $T = m(g - a) = 2.0 \\times (9.81 - 4.9) = 9.8\\ \\mathrm{N}$, only half the bucket\'s weight.',
        'Check on the drum: $TR = 0.98\\ \\mathrm{N\\,m}$ and $I\\alpha = 0.020 \\times 4.9/0.10 = 0.98\\ \\mathrm{N\\,m}$. ✓'
      ],
      a: 'a = 4.9 m/s², T = 9.8 N.'
    }
  ],
  quiz: [
    { q: 'The same torque is applied to a hoop and to a solid disc of equal mass and radius. Which spins up faster?', choices: ['The hoop', 'The disc', 'Both the same', 'Neither: torque cannot spin up a hoop'], a: 1,
      why: 'α = τ/I, and the disc has the smaller moment of inertia (½MR² against MR²).' },
    { q: 'When a heavy pulley accelerates, the rope tensions on its two sides are equal.', a: false,
      why: 'Their difference times the radius is the net torque that gives the pulley its angular acceleration. They are equal only for a massless pulley.' },
    { q: 'You double the torque on a flywheel and also double its moment of inertia. Its angular acceleration…', choices: ['doubles', 'halves', 'is unchanged', 'quadruples'], a: 2,
      why: 'α = τ/I: both double, so the ratio is the same.' },
    { q: 'A bucket hangs from a rope wound on a drum. As the drum is made heavier (same radius), the bucket\'s acceleration…', choices: ['approaches g', 'approaches zero', 'stays at g', 'becomes negative'], a: 1,
      why: 'a = mg/(m + I/R²): as I grows the denominator grows without limit and the acceleration falls towards zero.' }
  ],
  applications: ['Sizing electric motors: the torque needed to bring a machine up to speed in a given time.', 'Brakes and clutches: the torque they must supply to stop a rotating load.', 'Yo-yos, well windlasses and the reels of fishing rods and tape measures.']
},

{
  id: 'rotational-kinetic-energy', parent: 'rotation', title: 'Rotational kinetic energy', level: 2,
  short: 'A spinning body stores kinetic energy ½Iω² even when it goes nowhere; torque does work as it turns it, and power is torque times angular velocity.',
  keywords: ['rotational kinetic energy', 'flywheel', 'energy storage', 'half I omega squared', 'work done by a torque', 'power torque rpm', 'engine power'],
  prereq: ['kinetic-energy', 'moment-of-inertia', 'angular-kinematics'],
  related: ['rolling-motion', 'power', 'conservation-of-energy'],
  body: `
A spinning wheel on a fixed axle is not going anywhere, yet it clearly holds energy: grab it and it drags your hand along, press a brake on it and the brake gets hot. Every bit of the wheel is moving, so every bit has [[kinetic-energy|kinetic energy]].

### Adding up the pieces
A small mass $m_i$ at distance $r_i$ from the axis moves at $v_i = \\omega r_i$, so it carries $\\tfrac12 m_i \\omega^2 r_i^2$. Since every piece shares the same $\\omega$,
$$K = \\sum \\tfrac12 m_i r_i^2 \\omega^2 = \\tfrac12\\Big(\\sum m_i r_i^2\\Big)\\omega^2 = \\tfrac12 I\\omega^2$$
It is $\\tfrac12 mv^2$ again, with the [[moment-of-inertia|moment of inertia]] for the mass and the angular velocity for the speed. Because of the square, doubling the spin rate stores four times the energy.

### Work and power of a torque
A constant torque $\\tau$ turning something through an angle $\\Delta\\theta$ (in radians) does work
$$W = \\tau\\,\\Delta\\theta$$
and the **work–energy theorem** becomes $\\tau\\,\\Delta\\theta = \\Delta(\\tfrac12 I\\omega^2)$. Divide by the time and you get the power delivered through a rotating shaft:
$$P = \\tau\\,\\omega$$
This is how engines are rated. A car engine giving 300 N·m at 4000 rpm (419 rad/s) delivers $P = 300 \\times 419 \\approx 126\\ \\mathrm{kW}$. Gearboxes trade torque for speed while the product, the power, stays (almost) the same: low gear gives large torque at the wheels at low speed.

### Flywheels
A flywheel is a battery made of spinning metal. A solid steel disc of 100 kg and radius 0.30 m ($I = 4.5\\ \\mathrm{kg\\,m^2}$) spinning at 6000 rpm stores
$$K = \\tfrac12 (4.5)(628)^2 \\approx 0.89\\ \\mathrm{MJ} \\approx 0.25\\ \\mathrm{kWh}$$
with its rim moving at 190 m/s. The limit is strength: the rim stress grows with the square of the rim speed, so high-performance flywheels use carbon fibre, spin at tens of thousands of rpm in a vacuum, and sit in armoured pits in case they burst.

> [!fact] The Earth's spin holds about $2\\times10^{29}$ J. Tidal friction drains it slowly, lengthening the day by about 2 milliseconds per century — see [[tides]].

### Energy of a body that moves and spins
For a body whose centre of mass moves at $v$ while it turns at $\\omega$ about that centre, the total is simply the sum,
$$K = \\tfrac12 M v^2 + \\tfrac12 I_\\text{cm}\\omega^2$$
which is the key to [[rolling-motion|rolling]] — and to [[conservation-of-energy|energy conservation]] problems with wheels, pulleys and yo-yos.
`,
  ideas: [
    'A rotating body stores kinetic energy K = ½Iω², even if its centre does not move.',
    'Doubling ω quadruples the stored energy.',
    'A torque does work W = τΔθ and delivers power P = τω.',
    'For motion plus spin, K = ½Mv² + ½I_cm ω².'
  ],
  pitfalls: [
    'A wheel spinning in place has no kinetic energy because it goes nowhere — Every part of it moves; the energy is ½Iω².',
    'A big torque means a big power — Power is τω. A tractor makes large torque at low rpm; a racing engine makes less torque but at far higher rpm, and more power.',
    'Using ω in rpm in ½Iω² or P = τω — Convert to rad/s first (× 2π/60).'
  ],
  formulas: [
    {
      name: 'Rotational kinetic energy',
      expr: 'K = 0.5*I*omega^2', tex: 'K = \\tfrac12 I\\omega^2',
      vars: {
        K: { name: 'rotational kinetic energy', q: 'energy', unit: 'kJ' },
        I: { name: 'moment of inertia', q: 'inertia', unit: 'kg·m²', value: 4.5 },
        omega: { name: 'angular velocity', q: 'angvel', unit: 'rpm', value: 6000 }
      },
      stories: {
        K: 'A flywheel with I = {I} spins at {omega}. How much energy does it store?',
        omega: 'A flywheel with I = {I} must store {K}. How fast must it spin?'
      }
    },
    {
      name: 'Power delivered by a rotating shaft',
      expr: 'P = tau*omega', tex: 'P = \\tau\\omega',
      vars: {
        P: { name: 'power', q: 'power', unit: 'kW' },
        tau: { name: 'torque', q: 'torque', unit: 'N·m', value: 300 },
        omega: { name: 'angular velocity', q: 'angvel', unit: 'rpm', value: 4000 }
      },
      stories: { P: 'An engine delivers {tau} at {omega}. What power is that?', tau: 'An electric motor gives {P} at {omega}. What torque does it deliver?' }
    },
    {
      name: 'Work done by a constant torque',
      expr: 'W = tau*theta', tex: 'W = \\tau\\,\\Delta\\theta',
      vars: {
        W: { name: 'work done', q: 'energy', unit: 'J', signed: true },
        tau: { name: 'torque', q: 'torque', unit: 'N·m', value: 20, signed: true },
        theta: { name: 'angle turned', q: 'angle', unit: 'rev', value: 10, tex: '\\Delta\\theta' }
      },
      stories: { W: 'You wind a clock spring through {theta} against a steady {tau}. How much work do you do?' }
    }
  ],
  examples: [
    {
      title: 'Energy in a flywheel',
      q: 'A solid steel disc of mass 100 kg and radius 0.30 m spins at 6000 rpm. How much energy does it store, and how long could it supply 5 kW?',
      steps: [
        '$I = \\tfrac12 MR^2 = \\tfrac12(100)(0.30)^2 = 4.5\\ \\mathrm{kg\\,m^2}$.',
        '$\\omega = 6000 \\times 2\\pi/60 = 628\\ \\mathrm{rad/s}$.',
        '$K = \\tfrac12 I\\omega^2 = \\tfrac12(4.5)(628)^2 = 8.9\\times10^{5}\\ \\mathrm{J}$.',
        'At 5 kW: $t = 8.9\\times10^{5}/5000 = 178\\ \\mathrm{s}$, about three minutes — if it could be drained all the way to rest.'
      ],
      a: 'About 0.89 MJ (0.25 kWh); roughly 3 minutes at 5 kW.'
    },
    {
      title: 'Torque, speed and power',
      q: 'Engine A gives 300 N·m at 2000 rpm; engine B gives 150 N·m at 6000 rpm. Which delivers more power?',
      steps: [
        'A: $P = \\tau\\omega = 300 \\times (2000 \\times 2\\pi/60) = 300 \\times 209 = 62.8\\ \\mathrm{kW}$.',
        'B: $P = 150 \\times (6000 \\times 2\\pi/60) = 150 \\times 628 = 94.2\\ \\mathrm{kW}$.',
        'B has half the torque but three times the speed, so 1.5 times the power. With a lower gear it can match A\'s torque at the wheels.'
      ],
      a: 'Engine B: 94 kW against 63 kW.'
    }
  ],
  quiz: [
    { q: 'A flywheel\'s spin rate is doubled. Its stored energy…', choices: ['doubles', 'quadruples', 'stays the same', 'halves'], a: 1, why: 'K = ½Iω² goes with the square of ω.' },
    { q: 'A hoop and a solid disc of the same mass and radius spin at the same rate. Which has more kinetic energy?', choices: ['The disc', 'The hoop, twice as much', 'The hoop, four times as much', 'They are equal'], a: 1,
      why: 'Same ω, and the hoop has twice the moment of inertia (MR² against ½MR²), so twice the energy.' },
    { q: 'A wheel spinning on a fixed axle has kinetic energy even though its centre is at rest.', a: true,
      why: 'Every part of the rim and spokes is moving. The energy is ½Iω².' },
    { q: 'A motor delivers 10 N·m at 3000 rpm. Its power output is about…', choices: ['30 W', '3.1 kW', '30 kW', '300 W'], a: 1,
      why: '3000 rpm = 314 rad/s, and P = τω = 10 × 314 ≈ 3140 W.' }
  ],
  applications: ['Flywheel energy storage for grid frequency support and in some buses and race cars.', 'Engine and motor ratings: torque curves and P = τω.', 'Potter\'s wheels and old spinning machines keep turning between pushes thanks to their stored energy.']
},

{
  id: 'rolling-motion', parent: 'rotation', title: 'Rolling motion', level: 2,
  short: 'A wheel rolling without slipping both moves and spins, with v = ωR. Down a slope, the shape decides who wins: the energy that goes into spin cannot go into speed.',
  keywords: ['rolling', 'rolling without slipping', 'rolling race', 'incline', 'hoop', 'disc', 'sphere', 'v = omega R', 'static friction', 'rolling resistance'],
  prereq: ['rotational-kinetic-energy', 'rotational-dynamics', 'inclined-plane', 'conservation-of-energy'],
  related: ['moment-of-inertia', 'friction', 'angular-momentum'],
  body: `
A rolling wheel does two things at once: its centre moves forward and it spins about that centre. When it rolls **without slipping**, the two are locked together. In one turn the wheel lays down its whole circumference on the road, $2\\pi R$, so
$$v_\\text{cm} = \\omega R$$

### The contact point is at rest
Add the two motions for three points of the wheel. At the centre, just $v$ forward. At the top, the spin adds another $\\omega R = v$ forward: **the top moves at $2v$**. At the bottom, the spin gives $v$ backwards, cancelling the forward motion: **the contact point is momentarily at rest**. That is why a tyre can grip — and why the spokes at the top of a moving bicycle wheel look blurred while those at the bottom are sharp in photographs.

### Energy of a rolling body
The kinetic energy is the sum of the translational and the [[rotational-kinetic-energy|rotational]] parts. Write the moment of inertia as $I = cMR^2$ ($c = 1$ hoop, $\\tfrac12$ disc, $\\tfrac25$ sphere) and use $\\omega = v/R$:
$$K = \\tfrac12 Mv^2 + \\tfrac12 cMR^2\\left(\\frac{v}{R}\\right)^2 = \\tfrac12 Mv^2 (1 + c)$$
A fraction $c/(1+c)$ of the energy is tied up in spinning: half of it for a hoop, a third for a disc, 2/7 for a solid sphere.

### The race down the slope
Release several objects from height $h$ on the same incline. [[conservation-of-energy|Energy conservation]], $Mgh = \\tfrac12 Mv^2(1+c)$, gives
$$v = \\sqrt{\\frac{2gh}{1 + c}}, \\qquad a = \\frac{g\\sin\\theta}{1 + c}$$
Neither mass nor radius appears: **only the shape factor $c$ matters.** From a 1 m drop:

| Object | $c$ | Speed at the bottom |
|---|---|---|
| Frictionless sliding block | 0 | 4.43 m/s |
| Solid sphere | 2/5 | 3.74 m/s |
| Solid cylinder or disc | 1/2 | 3.62 m/s |
| Thin hoop or pipe | 1 | 3.13 m/s |

A marble beats a tin of soup, which beats a ring — every time, whatever their sizes. (A tin of thick soup rolls like a solid cylinder; a tin of thin broth, whose liquid hardly turns with the can, rolls faster than it.)

### The role of friction
Static friction at the contact point supplies the torque that spins the object up. Yet it does **no work**: the point where it acts is not moving. Energy is conserved even though friction is there. The friction needed grows with the slope; if $\\mu_s < \\tfrac{c}{1+c}\\tan\\theta$ the object skids — a car wheel locking on ice.

> [!note] Real rolling loses a little energy through **rolling resistance** — the tyre or ball deforms where it touches the ground. For a steel train wheel on a rail the effective coefficient is about 0.001, for a car tyre about 0.01, which is why rolling beats dragging by a wide margin.
`,
  ideas: [
    'Rolling without slipping: v = ωR, the contact point is at rest and the top moves at 2v.',
    'Total kinetic energy = ½Mv² + ½Iω² = ½Mv²(1 + c), with I = cMR².',
    'Down a slope the winner depends only on shape (c), not on mass or radius: sphere, then disc, then hoop.',
    'Static friction makes the object spin but does no work, because the contact point does not slip.'
  ],
  pitfalls: [
    'A heavier ball rolls down faster — Mass cancels, and so does radius. Only the distribution of mass (c) matters.',
    'Friction on a rolling ball wastes its energy — Static friction at a non-slipping contact does no work. Only rolling resistance and air drag take energy away.',
    'The whole wheel moves at the speed of the car — The contact patch is at rest and the top moves at twice the car\'s speed.'
  ],
  formulas: [
    {
      name: 'Speed after rolling down a height',
      expr: 'v = sqrt(2*g*h/(1 + c))', tex: 'v = \\sqrt{\\frac{2 g h}{1 + c}}',
      vars: {
        v: { name: 'speed at the bottom', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        h: { name: 'height descended', q: 'length', unit: 'm', value: 1 },
        c: { name: 'shape factor I/(MR²)', value: 0.5 }
      },
      note: '$c = 0$ for a frictionless sliding block, $\\tfrac25$ for a solid sphere, $\\tfrac12$ for a solid cylinder, $\\tfrac23$ for a hollow ball, 1 for a hoop.',
      practice: { unknowns: ['v', 'h'] },
      stories: { v: 'A solid cylinder (c = {c}) rolls without slipping down a ramp, dropping {h}. How fast is it moving at the bottom?', h: 'From what height must a body with c = {c} roll to reach {v}?' }
    },
    {
      name: 'Acceleration down an incline',
      expr: 'a = g*sin(theta)/(1 + c)', tex: 'a = \\frac{g\\sin\\theta}{1 + c}',
      vars: {
        a: { name: 'acceleration along the slope', q: 'accel', unit: 'm/s²' },
        g: { const: 'g' },
        theta: { name: 'slope angle', q: 'angle', unit: '°', value: 15, min: 0, max: 90 },
        c: { name: 'shape factor I/(MR²)', value: 0.4 }
      },
      practice: { unknowns: ['a', 'theta'] },
      stories: { a: 'A solid ball (c = {c}) rolls down a {theta} slope. What is its acceleration?', theta: 'A hoop (c = {c}) rolls down a slope with acceleration {a}. How steep is the slope?' }
    },
    {
      name: 'Kinetic energy of a rolling body',
      expr: 'K = 0.5*M*v^2*(1 + c)', tex: 'K = \\tfrac12 M v^2 (1 + c)',
      vars: {
        K: { name: 'total kinetic energy', q: 'energy', unit: 'J' },
        M: { name: 'mass', q: 'mass', unit: 'kg', value: 7.26 },
        v: { name: 'speed of the centre', q: 'speed', unit: 'm/s', value: 3 },
        c: { name: 'shape factor I/(MR²)', value: 0.4 }
      },
      practice: { unknowns: ['K', 'v'] },
      stories: { K: 'A {M} bowling ball (c = {c}) rolls at {v}. What is its total kinetic energy?' }
    },
    {
      name: 'Friction needed to roll without slipping',
      expr: 'mu = c*tan(theta)/(1 + c)', tex: '\\mu_s = \\frac{c\\,\\tan\\theta}{1 + c}',
      vars: {
        mu: { name: 'minimum coefficient of static friction', tex: '\\mu_s' },
        c: { name: 'shape factor I/(MR²)', value: 0.5 },
        theta: { name: 'slope angle', q: 'angle', unit: '°', value: 30, min: 0, max: 89 }
      },
      practice: { unknowns: ['mu', 'theta'] },
      stories: { mu: 'A solid cylinder (c = {c}) rolls down a {theta} slope. What is the least coefficient of static friction that stops it skidding?', theta: 'A disc (c = {c}) sits on a surface with μ = {mu}. How steep can the slope be before it starts to skid?' }
    }
  ],
  examples: [
    {
      title: 'The race',
      q: 'A solid ball, a solid cylinder and a hoop are released together at the top of a ramp 2.0 m long, inclined at 10°. In what order and at what times do they reach the bottom?',
      steps: [
        'Acceleration $a = g\\sin\\theta/(1 + c)$, with $g\\sin 10° = 9.81 \\times 0.174 = 1.70\\ \\mathrm{m/s^2}$.',
        'Ball: $a = 1.70/1.4 = 1.22$; cylinder: $1.70/1.5 = 1.14$; hoop: $1.70/2 = 0.85\\ \\mathrm{m/s^2}$.',
        'From rest over $L = 2.0\\ \\mathrm{m}$: $t = \\sqrt{2L/a}$, giving 1.81 s, 1.88 s and 2.17 s.',
        'Order: ball, cylinder, hoop — independent of their masses and sizes.'
      ],
      a: 'Ball 1.81 s, cylinder 1.88 s, hoop 2.17 s.'
    },
    {
      title: 'How fast is the top of the tyre?',
      q: 'A car drives at 30 m/s on tyres of radius 0.31 m. How fast does the tyre spin, and how fast is the top of the tyre moving relative to the road?',
      steps: [
        '$\\omega = v/R = 30/0.31 = 97\\ \\mathrm{rad/s}$, about 920 rpm.',
        'The top moves at $v + \\omega R = 2v = 60\\ \\mathrm{m/s}$; the bottom is momentarily at rest on the road.'
      ],
      a: '97 rad/s; the top moves at 60 m/s.'
    }
  ],
  quiz: [
    { q: 'A solid sphere, a solid cylinder and a thin hoop roll down the same slope from rest. Which order do they arrive in?', choices: ['Hoop, cylinder, sphere', 'Sphere, cylinder, hoop', 'All together', 'Heaviest first'], a: 1,
      why: 'The smaller c = I/MR², the less energy goes into spin and the faster it rolls: sphere (0.4), cylinder (0.5), hoop (1).' },
    { q: 'Two solid cylinders of the same size, one of steel and one of wood, roll down a ramp. Which wins?', choices: ['Steel', 'Wood', 'They tie', 'Whichever is released first, since they never catch up'], a: 2,
      why: 'Mass and radius cancel from v = √(2gh/(1 + c)). Same shape, same c, same speed.' },
    { q: 'A wheel rolls without slipping at speed v. The point at the top of the wheel moves at…', choices: ['0', 'v', '2v', 'v√2'], a: 2,
      why: 'The forward motion v and the spin ωR = v add at the top, and cancel at the bottom.' },
    { q: 'Static friction does work on a ball that rolls without slipping down a ramp.', a: false,
      why: 'The contact point is at rest at every instant, so the friction force moves through no distance and does no work. It only shares the energy between translation and spin.' }
  ],
  applications: ['Why bearing balls, wheels and rollers beat sliding surfaces: little energy is lost to rolling resistance.', 'Anti-lock brakes keep tyres rolling rather than skidding, because static grip is stronger than sliding friction.', 'Galileo used balls rolling down inclines to study acceleration; the rolling factor 1 + c changes the numbers but not the law.'],
  sim: 'mech2-rolling-race'
},

{
  id: 'angular-momentum', parent: 'rotation', title: 'Angular momentum', level: 2,
  short: 'The rotational version of momentum, L = Iω. With no outside torque it never changes — which is why a skater spins faster when she pulls her arms in.',
  keywords: ['angular momentum', 'conservation of angular momentum', 'L = I omega', 'figure skater', 'spin', 'gyroscope', 'precession', 'r cross p'],
  prereq: ['momentum', 'moment-of-inertia', 'rotational-dynamics'],
  related: ['keplers-laws', 'conservation-of-momentum', 'electron-spin'],
  body: `
Momentum measures how much motion a body carries in a straight line; **angular momentum** measures how much it carries round an axis. For a body spinning about a symmetry axis,
$$L = I\\omega$$
and for a single particle at position $\\vec r$ with [[momentum]] $\\vec p$,
$$\\vec L = \\vec r \\times \\vec p, \\qquad |\\vec L| = m v r_\\perp$$
where $r_\\perp$ is the perpendicular distance from the reference point to the particle's line of motion. Even something moving in a straight line has angular momentum about a point off that line. Units: kg·m²/s.

### Torque changes it
Newton's second law for rotation, written the way Newton wrote the linear one, is
$$\\tau_\\text{net} = \\frac{dL}{dt}$$
(for a rigid body turning about a fixed axis this is $\\tau = I\\alpha$). So when the net external torque is zero, **angular momentum is conserved**:
$$I_1\\omega_1 = I_2\\omega_2$$

### The spinning skater
A skater spinning with her arms out has a large $I$. Pulling her arms in cuts $I$ to perhaps a third; with no torque from the ice worth mentioning, $\\omega$ must triple. Her kinetic energy $\\tfrac12 I\\omega^2 = L^2/2I$ triples too — the extra energy is the work her arm muscles do pulling the arms inwards against their tendency to fly out. Divers and gymnasts use the same trick: a tight tuck to somersault fast, an open layout to slow down before entry.

### Across the sky
- A planet on an elliptical orbit is pulled towards the Sun, so the Sun exerts no torque about itself: the planet's angular momentum is constant. Near the Sun, where $r$ is small, it must move faster. That is [[keplers-laws|Kepler's second law]].
- When the core of a massive star collapses from thousands of kilometres across to a ball about 20 km wide, it keeps its angular momentum, so its spin rate soars: newborn neutron stars turn many times a second.
- A helicopter's main rotor would spin the body the other way — the tail rotor supplies the torque that stops it.

### Direction matters
Angular momentum is a vector along the spin axis. With no torque, its **direction** is fixed as well as its size. That is what keeps a spinning top upright, a rifle bullet flying point first, a thrown frisbee stable, and a gyroscope pointing the same way in space. A torque perpendicular to $\\vec L$ does not tip it over but swings it sideways: the axis **precesses** at
$$\\Omega = \\frac{\\tau}{L} = \\frac{m g r}{I\\omega}$$
The faster the spin, the slower the precession. The Earth's axis precesses once every 26 000 years under the torque of the Sun and Moon on its equatorial bulge.

> [!key] Linear momentum is conserved when there is no external force; angular momentum when there is no external torque. The two are separate laws: a system can have one without the other.
`,
  ideas: [
    'Angular momentum is L = Iω for a spinning body and L = r × p for a particle.',
    'Net external torque is the rate of change of angular momentum.',
    'With no external torque, L is conserved in size and direction: I₁ω₁ = I₂ω₂.',
    'Pulling mass inwards lowers I and raises ω; the kinetic energy rises because work is done pulling in.',
    'A torque at right angles to L makes the spin axis precess instead of falling.'
  ],
  pitfalls: [
    'When a skater pulls in her arms her kinetic energy stays the same — Angular momentum stays the same; kinetic energy L²/2I goes up, paid for by her muscles.',
    'Only spinning objects have angular momentum — A particle moving in a straight line has angular momentum mvr⊥ about any point not on its line.',
    'Conservation of angular momentum and of linear momentum are the same law — They are separate: a spinning wheel has angular momentum and zero linear momentum.'
  ],
  formulas: [
    {
      name: 'Angular momentum of a spinning body',
      expr: 'L = I*omega', tex: 'L = I\\omega',
      vars: {
        L: { name: 'angular momentum', q: 'angmom', unit: 'kg·m²/s' },
        I: { name: 'moment of inertia', q: 'inertia', unit: 'kg·m²', value: 1.8 },
        omega: { name: 'angular velocity', q: 'angvel', unit: 'rev/s', value: 1.5 }
      },
      stories: { L: 'A skater with I = {I} spins at {omega}. What is her angular momentum?' }
    },
    {
      name: 'Conservation of angular momentum',
      expr: 'I1*omega1 = I2*omega2', tex: 'I_1\\omega_1 = I_2\\omega_2', solveFor: 'omega2',
      vars: {
        I1: { name: 'moment of inertia before', q: 'inertia', unit: 'kg·m²', value: 1.8 },
        omega1: { name: 'angular velocity before', q: 'angvel', unit: 'rev/s', value: 1.5 },
        I2: { name: 'moment of inertia after', q: 'inertia', unit: 'kg·m²', value: 0.6 },
        omega2: { name: 'angular velocity after', q: 'angvel', unit: 'rev/s' }
      },
      note: 'Holds when no external torque acts about the axis.',
      stories: {
        omega2: 'A skater spinning at {omega1} with I = {I1} pulls her arms in, reducing I to {I2}. How fast does she spin now?',
        I2: 'A diver leaves the board rotating at {omega1} with I = {I1}. To rotate at {omega2}, what must her moment of inertia become?'
      }
    },
    {
      name: 'Angular momentum of a moving particle',
      expr: 'L = m*v*r', tex: 'L = m v r_\\perp',
      vars: {
        L: { name: 'angular momentum', q: 'angmom', unit: 'kg·m²/s' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 5.97e24 },
        v: { name: 'speed', q: 'speed', unit: 'km/s', value: 29.8 },
        r: { name: 'perpendicular distance from the point', q: 'length', unit: 'AU', value: 1, tex: 'r_\\perp' }
      },
      stories: { L: 'The Earth ({m}) orbits at {v} at {r} from the Sun. What is its orbital angular momentum?' }
    },
    {
      name: 'Precession rate of a gyroscope',
      expr: 'Omega = m*g*r/(I*omega)', tex: '\\Omega = \\frac{m g r}{I\\omega}',
      vars: {
        Omega: { name: 'precession angular velocity', q: 'angvel', unit: 'rad/s', tex: '\\Omega' },
        m: { name: 'mass of the gyroscope', q: 'mass', unit: 'kg', value: 2 },
        g: { const: 'g' },
        r: { name: 'distance from the pivot to the centre of mass', q: 'length', unit: 'm', value: 0.2 },
        I: { name: 'moment of inertia about the spin axis', q: 'inertia', unit: 'kg·m²', value: 0.2 },
        omega: { name: 'spin angular velocity', q: 'angvel', unit: 'rad/s', value: 30 }
      },
      note: 'For a fast spin ($\\Omega \\ll \\omega$) with the axle horizontal.',
      stories: { Omega: 'A bicycle wheel (mass {m}, I = {I}) spins at {omega} with one end of its axle on a pivot, its centre {r} out. How fast does it precess?' }
    }
  ],
  examples: [
    {
      title: 'The skater\'s spin',
      q: 'A skater spins at 1.5 rev/s with I = 1.8 kg·m². She pulls her arms in, reducing I to 0.60 kg·m². Find her new spin rate and her kinetic energy before and after.',
      steps: [
        'Conservation: $\\omega_2 = \\omega_1 I_1/I_2 = 1.5 \\times 1.8/0.60 = 4.5\\ \\mathrm{rev/s}$.',
        'Before: $\\omega_1 = 1.5 \\times 2\\pi = 9.42\\ \\mathrm{rad/s}$, $K_1 = \\tfrac12(1.8)(9.42)^2 = 80\\ \\mathrm{J}$.',
        'After: $\\omega_2 = 28.3\\ \\mathrm{rad/s}$, $K_2 = \\tfrac12(0.60)(28.3)^2 = 240\\ \\mathrm{J}$.',
        'Three times the energy: the 160 J difference is the work her arms did pulling inwards.'
      ],
      a: '4.5 rev/s; kinetic energy rises from 80 J to 240 J.'
    },
    {
      title: 'Jumping onto a roundabout',
      q: 'A playground roundabout (I = 180 kg·m²) turns freely at 1.0 rad/s. A 30 kg child runs straight towards its centre and jumps onto the rim, 1.5 m from the axis. What is the new rate?',
      steps: [
        'Running straight at the centre, the child has no angular momentum about the axis.',
        'The child on the rim adds $mr^2 = 30 \\times 1.5^2 = 67.5\\ \\mathrm{kg\\,m^2}$.',
        '$\\omega_2 = \\dfrac{180 \\times 1.0}{180 + 67.5} = 0.73\\ \\mathrm{rad/s}$.',
        'Kinetic energy falls from 90 J to 65 J: like an inelastic collision, the grab converts some to heat.'
      ],
      a: '0.73 rad/s'
    }
  ],
  quiz: [
    { q: 'A spinning skater pulls in her arms. What happens to her angular momentum and kinetic energy?', choices: ['Both stay the same', 'L stays the same, K increases', 'L increases, K stays the same', 'Both increase'], a: 1,
      why: 'No external torque, so L is conserved. K = L²/2I rises as I falls; her muscles supply the energy.' },
    { q: 'Why does a comet speed up as it nears the Sun?', choices: ['The Sun\'s pull does work on it, and its angular momentum about the Sun stays constant while r shrinks', 'Its mass decreases as it melts', 'Solar wind pushes it', 'Its angular momentum increases'], a: 0,
      why: 'Gravity points at the Sun, so it exerts no torque about it: mvr⊥ is constant, and a smaller distance means a larger speed. The same pull does positive work on the way in.' },
    { q: 'A ball moving in a straight line past a point has angular momentum about that point.', a: true,
      why: 'L = mvr⊥ where r⊥ is the distance from the point to the line of motion. It is constant as the ball passes, with no rotation needed.' },
    { q: 'A spinning bicycle wheel is held by one end of its horizontal axle. Instead of falling, it…', choices: ['falls anyway, just slower', 'swings round slowly in a horizontal circle', 'rises', 'spins faster'], a: 1,
      why: 'Gravity\'s torque is horizontal, at right angles to L, so it turns the direction of L sideways: the axle precesses horizontally.' },
    { q: 'A merry-go-round turns freely. A child walks from the rim towards the centre. The rotation…', choices: ['slows down', 'speeds up', 'is unchanged', 'stops'], a: 1,
      why: 'The total moment of inertia falls while L is fixed, so ω rises — the skater effect again.' }
  ],
  applications: ['Figure skating spins, diving somersaults and the cat that lands on its feet.', 'Gyroscopes and reaction wheels that point satellites and space telescopes.', 'Pulsars: collapsed stars spinning tens to hundreds of times a second.', 'The spin of a thrown American football, a rifle bullet or a frisbee keeps it pointing steadily.'],
  sim: 'mech2-skater'
},

{
  id: 'static-equilibrium', parent: 'rotation', title: 'Static equilibrium', level: 1,
  short: 'An object stays at rest only if the forces on it balance and the torques on it balance too.',
  keywords: ['static equilibrium', 'balance', 'seesaw', 'lever', 'centre of gravity', 'moments', 'principle of moments', 'ladder problem', 'stability', 'tipping'],
  prereq: ['torque', 'newtons-first-law', 'free-body-diagrams'],
  related: ['center-of-mass', 'friction', 'stress-strain'],
  body: `
Bridges, bookshelves, ladders and people standing still are all in **static equilibrium**: nothing moves and nothing starts to turn. Two conditions must hold together:
$$\\sum \\vec F = 0 \\qquad\\text{and}\\qquad \\sum \\tau = 0$$
The first stops the object from starting to move ([[newtons-first-law|Newton's first law]]); the second stops it from starting to rotate. Two equal and opposite forces that are not in line satisfy the first but not the second — they form a couple and spin the object.

### The seesaw and the principle of moments
A seesaw pivoted in the middle balances when the clockwise and anticlockwise [[torque|torques]] about the pivot are equal:
$$m_1 g\\, d_1 = m_2 g\\, d_2 \\quad\\Longrightarrow\\quad m_1 d_1 = m_2 d_2$$
A 30 kg child 2.0 m from the pivot balances a 40 kg child 1.5 m on the other side. Archimedes put it more dramatically: give me a place to stand and a long enough lever, and I will move the Earth.

### Choose the pivot cleverly
When a body is in equilibrium the torques balance about **every** point, not just the real hinge. So pick the point that removes the most unknowns: take torques about the point where an unknown force acts, and that force drops out. Then use the force balance for what is left.

### The weight acts at the centre of gravity
For torque purposes the whole weight of a body can be treated as acting at its **centre of gravity** — the [[center-of-mass|centre of mass]] in a uniform field. A uniform plank's weight acts at its middle.

### Your forearm is a poor lever
Holding a 3 kg ball in your hand, 35 cm from the elbow, with the biceps attached only 4 cm from the joint: taking torques about the elbow (and including the forearm's own 1.5 kg acting at 15 cm),
$$F_\\text{biceps} \\times 0.04 = (3 \\times 9.81)(0.35) + (1.5 \\times 9.81)(0.15) \\quad\\Rightarrow\\quad F_\\text{biceps} \\approx 310\\ \\mathrm{N}$$
more than ten times the ball's weight. The body trades force for speed and range of movement: a small contraction of the muscle swings the hand a long way.

### Ladders
A uniform ladder leaning against a smooth wall is held by friction at its foot. Taking torques about the foot shows the friction needed is $\\mu_\\text{min} = 1/(2\\tan\\theta)$, where $\\theta$ is the angle with the ground: 0.13 at 75°, 0.29 at 60°, 0.50 at 45°. Shallow ladders slip — the reason for the "one out for every four up" rule, which gives about 75°.

### Stable, unstable, tipping
A body resting on a base stays upright as long as the vertical line through its centre of gravity falls inside the base. Tilt it until that line passes the edge and gravity's torque changes sign: it topples. A low centre of gravity and a wide base — a racing car, a wrestler's stance — make tipping hard.

> [!tip] Recipe: draw the [[free-body-diagrams|free-body diagram]]; write $\\sum F_x = 0$, $\\sum F_y = 0$; choose a pivot through an unknown force and write $\\sum\\tau = 0$; solve.
`,
  ideas: [
    'Equilibrium needs both the forces and the torques to balance.',
    'Torques balance about every point, so choose the pivot that eliminates an unknown force.',
    'A body\'s weight acts at its centre of gravity.',
    'An object tips over when the line through its centre of gravity passes outside its base.'
  ],
  pitfalls: [
    'Zero net force means equilibrium — A couple has zero net force but still starts the body turning. The torques must balance too.',
    'Torques must be taken about the real hinge or pivot — In equilibrium the net torque is zero about any point; the smartest choice is where an unknown force acts.',
    'A heavier person always wins on a seesaw — What matters is mass × distance; a light child far out can lift a heavy adult close in.'
  ],
  formulas: [
    {
      name: 'Balance on a seesaw (principle of moments)',
      expr: 'm1*d1 = m2*d2', tex: 'm_1 d_1 = m_2 d_2', solveFor: 'd2',
      vars: {
        m1: { name: 'first mass', q: 'mass', unit: 'kg', value: 30 },
        d1: { name: 'its distance from the pivot', q: 'length', unit: 'm', value: 2 },
        m2: { name: 'second mass', q: 'mass', unit: 'kg', value: 40 },
        d2: { name: 'its distance from the pivot', q: 'length', unit: 'm' }
      },
      stories: {
        d2: 'A {m1} child sits {d1} from the pivot of a seesaw. Where must a {m2} child sit to balance?',
        m2: 'A {m1} child sits {d1} from the pivot. What mass placed {d2} from it on the other side balances the seesaw?'
      }
    },
    {
      name: 'Ladder against a smooth wall: friction needed',
      expr: 'mu = 1/(2*tan(theta))', tex: '\\mu_{\\text{min}} = \\frac{1}{2\\tan\\theta}',
      vars: {
        mu: { name: 'minimum coefficient of friction at the foot', tex: '\\mu_{\\text{min}}' },
        theta: { name: 'angle of the ladder with the ground', q: 'angle', unit: '°', value: 75, min: 1, max: 89 }
      },
      note: 'Uniform ladder, nobody on it, smooth wall. A person climbing near the top raises the friction needed.',
      stories: { mu: 'A uniform ladder leans against a smooth wall at {theta} to the ground. What coefficient of friction must the floor provide?', theta: 'The floor offers a coefficient of friction of {mu}. What is the shallowest angle the ladder can stand at?' }
    },
    {
      name: 'Support force under a loaded beam',
      expr: 'R = m*g*x/L', tex: 'R_B = \\frac{m g x}{L}',
      vars: {
        R: { name: 'force at support B', q: 'force', unit: 'kN', tex: 'R_B' },
        m: { name: 'load', q: 'mass', unit: 't', value: 12 },
        g: { const: 'g' },
        x: { name: 'distance of the load from support A', q: 'length', unit: 'm', value: 6 },
        L: { name: 'distance between the supports', q: 'length', unit: 'm', value: 20 }
      },
      note: 'Torques about support A, ignoring the weight of the beam itself (which adds half its weight to each support).',
      stories: { R: 'A {m} lorry stands {x} from one end of a bridge span {L} long. What extra force does the far support carry?' }
    }
  ],
  examples: [
    {
      title: 'The biceps',
      q: 'A forearm (1.5 kg, centre of gravity 15 cm from the elbow) holds a 3.0 kg ball 35 cm from the elbow, horizontal. The biceps pulls straight up 4.0 cm from the elbow. Find the biceps force and the force at the elbow joint.',
      steps: [
        'Torques about the elbow (the joint force drops out): $F_b (0.040) = (3.0)(9.81)(0.35) + (1.5)(9.81)(0.15) = 10.3 + 2.2 = 12.5\\ \\mathrm{N\\,m}$.',
        '$F_b = 12.5/0.040 = 313\\ \\mathrm{N}$ — over ten times the weight of the ball (29.4 N).',
        'Forces: up $313\\ \\mathrm{N}$; down $29.4 + 14.7 = 44.1\\ \\mathrm{N}$ of weights. The joint must push down on the forearm with $313 - 44 = 269\\ \\mathrm{N}$.'
      ],
      a: 'Biceps about 313 N up; joint force about 269 N down on the forearm.'
    },
    {
      title: 'A lorry on a bridge',
      q: 'A 12 t lorry stands 6 m from support A of a 20 m bridge span. Ignoring the bridge\'s own weight, how is the load shared between the supports?',
      steps: [
        'Torques about A: $R_B \\times 20 = (12\\,000 \\times 9.81) \\times 6$, so $R_B = 35.3\\ \\mathrm{kN}$.',
        'Forces: $R_A + R_B = 117.7\\ \\mathrm{kN}$, so $R_A = 82.4\\ \\mathrm{kN}$.',
        'The nearer support carries more: 70 % against 30 %, in the ratio of the distances 14 : 6.'
      ],
      a: 'A carries 82 kN, B carries 35 kN.'
    }
  ],
  quiz: [
    { q: 'A 30 kg child sits 2.0 m from the pivot of a seesaw. Where must a 40 kg child sit to balance?', choices: ['1.0 m', '1.5 m', '2.0 m', '2.7 m'], a: 1, why: '30 × 2.0 = 40 × d, so d = 1.5 m.' },
    { q: 'A body with zero net force on it is necessarily in equilibrium.', a: false,
      why: 'It also needs zero net torque. A couple — equal, opposite, parallel forces — has zero net force but makes the body rotate.' },
    { q: 'When solving a static-equilibrium problem, about which point should you take torques?', choices: ['Only the centre of gravity', 'Only the real pivot', 'Any point — ideally one where an unknown force acts', 'The point furthest from the forces'], a: 2,
      why: 'In equilibrium the net torque vanishes about every point; choosing one through an unknown force removes it from the equation.' },
    { q: 'Compared with a ladder at 75°, a ladder at 50° to the ground against a smooth wall…', choices: ['needs more friction at its foot', 'needs less friction', 'needs the same friction', 'needs no friction'], a: 0,
      why: 'μ_min = 1/(2 tan θ) grows as θ falls: 0.13 at 75°, 0.42 at 50°. Shallow ladders slip.' }
  ],
  applications: ['Structural engineering: finding the loads in beams, bridge supports and cranes.', 'Biomechanics: muscle and joint forces, which are often many times the loads being held.', 'Tower cranes use a counterweight so the torques about the tower balance whatever the load.'],
  sim: 'mech2-seesaw'
}

);
