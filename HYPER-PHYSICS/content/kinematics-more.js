/* HYPER-PHYSICS · content/kinematics-more.js — describing motion, continued: motion graphs,
 * relative velocity and uniform circular motion (the rest of the topic is in kinematics.js). */
Hyper.add(

{
  id: 'motion-graphs', parent: 'kinematics', title: 'Motion graphs', level: 1,
  short: 'Position, velocity and acceleration plotted against time — three views of one motion, linked by slopes and areas.',
  keywords: ['motion graph', 'position-time graph', 'x-t graph', 'velocity-time graph', 'v-t graph', 'acceleration-time graph', 'slope', 'gradient', 'area under the graph', 'tangent'],
  prereq: ['speed-velocity', 'acceleration', 'math:linear-functions'],
  related: ['constant-acceleration', 'free-fall', 'math:derivative', 'math:definite-integral'],
  body: `
A graph of a motion tells its story without words. Put time along the bottom and plot **where** the object is, **how fast** it moves, or **how quickly its velocity changes**, and every shape has a meaning you can learn to read at a glance. The three graphs describe the same motion, and two ideas tie them together: slopes and areas.

### Three graphs, two rules
| Graph | Its slope is | The area under it is |
|---|---|---|
| position–time, $x(t)$ | the velocity $v$ | not used |
| velocity–time, $v(t)$ | the acceleration $a$ | the displacement $\\Delta x$ |
| acceleration–time, $a(t)$ | the jerk (rarely needed) | the change in velocity $\\Delta v$ |

Going down the table you take slopes ([[math:derivative|derivatives]]); going up you add up areas ([[math:definite-integral|integrals]]):

$$v = \\frac{dx}{dt}, \\quad a = \\frac{dv}{dt}, \\qquad \\Delta x = \\int_{t_1}^{t_2} v\\,dt, \\quad \\Delta v = \\int_{t_1}^{t_2} a\\,dt$$

### Reading an x–t graph
A straight line means constant velocity, and the steeper the line the faster the motion. A horizontal line means the object is at rest. A curve that keeps getting steeper is speeding up; one that flattens out is slowing down. **Curvature shows the acceleration**: a graph bending upwards, like a smile, has $a > 0$; one bending downwards has $a < 0$. With [[constant-acceleration|constant acceleration]] the x–t graph is a parabola. The slope between two points (a chord) is the *average* velocity; the slope of the tangent at one point is the velocity at that instant.

### Reading a v–t graph
This is the most useful of the three. Its height is the velocity, its slope the acceleration, and the area between it and the time axis is the displacement — counted **negative where the graph dips below the axis**. Where the line crosses the axis the object stops for an instant and turns round. The *distance* travelled is the total area with every part counted as positive.

### Reading an a–t graph
For most motions in an introductory course it is made of flat steps: a steady push, then none, then steady braking. The area under each step is how much the velocity changes during it.

> [!tip] To go from one graph to the next, ask two questions at each moment: what is the *height* here, and what is the *slope* here? A peak or a valley on the x–t graph is always a zero crossing on the v–t graph.

### A journey in three graphs
A train leaves a station, speeds up steadily, cruises, then brakes steadily into the next station. Its a–t graph is three flat steps: positive, zero, negative. Its v–t graph is a trapezium — up, flat, down — whose area is the distance between the stations. Its x–t graph is an S-shaped curve: bending up while the train speeds up, straight while it cruises, bending over to flat as it stops. Run the simulation with **Speed up, cruise, brake** to watch all three being drawn together.
`,
  ideas: [
    'The slope of the x–t graph is the velocity; the slope of the v–t graph is the acceleration.',
    'The area under the v–t graph is the displacement; the area under the a–t graph is the change in velocity.',
    'Where the v–t graph crosses the time axis, the object is momentarily at rest and turns round.',
    'The curvature of an x–t graph shows the sign of the acceleration: bending up means a > 0.'
  ],
  pitfalls: [
    'A motion graph is a picture of the path — An x–t graph that rises and falls does not show a hill. The object moved along a line; the graph shows where on that line it was, and when.',
    'Reading the height when you need the slope — A high point on an x–t graph means far from the origin, not fast. Speed is the steepness.',
    'Where two x–t graphs cross, the objects have the same speed — They are at the same place at that moment. Their velocities are the slopes, which usually differ: that is how one overtakes the other.'
  ],
  formulas: [
    {
      name: 'Average velocity from two points on an x–t graph',
      expr: 'v = (x2 - x1)/(t2 - t1)', tex: '\\bar v = \\frac{x_2 - x_1}{t_2 - t_1}',
      vars: {
        v: { name: 'average velocity (slope of the chord)', q: 'speed', unit: 'm/s', tex: '\\bar v', signed: true },
        x1: { name: 'position at the first time', q: 'length', unit: 'm', value: 5, signed: true },
        x2: { name: 'position at the second time', q: 'length', unit: 'm', value: 35, signed: true },
        t1: { name: 'first time', q: 'time', unit: 's', value: 4 },
        t2: { name: 'second time', q: 'time', unit: 's', value: 10 }
      },
      stories: {
        v: 'On a position–time graph a cyclist is at {x1} at {t1} and at {x2} at {t2}. What is her average velocity between those two times?',
        x2: 'A runner is at {x1} at {t1} and averages {v} until {t2}. Where is he at that time?'
      }
    },
    {
      name: 'Distance for a speed-up, cruise, brake trip (area of a trapezium)',
      expr: 'd = vmax*(T + tc)/2', tex: 'd = \\tfrac12\\, v_{\\text{max}}\\,(T + t_c)',
      vars: {
        d: { name: 'distance travelled (area under the v–t graph)', q: 'length', unit: 'm' },
        vmax: { name: 'cruising speed', q: 'speed', unit: 'm/s', value: 20, tex: 'v_{\\text{max}}' },
        T: { name: 'total time of the trip', q: 'time', unit: 's', value: 90 },
        tc: { name: 'time spent cruising', q: 'time', unit: 's', value: 50, tex: 't_c' }
      },
      note: 'Speeding up and braking at steady rates make the v–t graph a trapezium: parallel sides $T$ and $t_c$, height $v_{\\text{max}}$.',
      stories: {
        d: 'A metro train speeds up steadily to {vmax}, cruises for {tc} and brakes steadily, taking {T} from station to station. How far apart are the stations?',
        vmax: 'Two stations are {d} apart. The train takes {T} in all and cruises for {tc} of it. What is its cruising speed?'
      }
    }
  ],
  examples: [
    {
      title: 'A cyclist\'s velocity–time graph',
      q: 'A cyclist starts from rest and reaches 8 m/s in 4 s, rides at 8 m/s for 10 s, then brakes to a stop in 2 s, every change being steady. Sketch the v–t graph, find the acceleration in each stage and the total distance.',
      steps: [
        'The v–t graph rises in a straight line from 0 to 8 m/s over 4 s, stays flat for 10 s, then falls to zero in 2 s: a trapezium.',
        'The accelerations are the slopes: $8/4 = 2\\ \\mathrm{m/s^2}$, then $0$, then $-8/2 = -4\\ \\mathrm{m/s^2}$.',
        'The distance is the area: $\\tfrac12(4)(8) + (10)(8) + \\tfrac12(2)(8) = 16 + 80 + 8 = 104\\ \\mathrm{m}$.',
        'Check with the trapezium formula: $\\tfrac12 \\times 8 \\times (16 + 10) = 104\\ \\mathrm{m}$.'
      ],
      a: '2 m/s², 0 and −4 m/s²; 104 m in all.'
    },
    {
      title: 'Up and down, in three graphs',
      q: 'A ball is thrown straight up at 12 m/s. Taking up as positive and $g = 9.8\\ \\mathrm{m/s^2}$, describe its x–t, v–t and a–t graphs until it is caught again at the same height.',
      steps: [
        'a–t: a flat line at $-9.8\\ \\mathrm{m/s^2}$ for the whole flight. Gravity never switches off, not even at the top.',
        'v–t: a straight line of slope $-9.8\\ \\mathrm{m/s^2}$, starting at $+12\\ \\mathrm{m/s}$, crossing zero at $t = 12/9.8 = 1.22\\ \\mathrm{s}$ (the top) and ending at $-12\\ \\mathrm{m/s}$ at $t = 2.45\\ \\mathrm{s}$.',
        'x–t: a parabola bending downwards, steep at the start and end and flat at the top. The height of the top is the triangle under the v–t line up to 1.22 s: $\\tfrac12(1.22)(12) = 7.3\\ \\mathrm{m}$.',
        'The total area under the v–t graph is zero — a positive triangle and an equal negative one — because the ball ends where it began.'
      ],
      a: 'a–t flat at −9.8 m/s²; v–t a straight line from +12 to −12 m/s crossing zero at 1.22 s; x–t a downward parabola peaking at 7.3 m.'
    }
  ],
  quiz: [
    { q: 'A velocity–time graph crosses the time axis at $t = 3\\ \\mathrm{s}$. At that moment the object…', choices: ['is back where it started', 'has zero acceleration', 'is momentarily at rest and changing direction', 'has hit something'], a: 2,
      why: 'Zero velocity is an instant of rest; if the graph goes from positive to negative the motion reverses. The acceleration is the slope there, which is usually not zero.' },
    { q: 'On a position–time graph the curve rises to the right and keeps getting steeper. The object is…', choices: ['moving at constant velocity', 'speeding up in the positive direction', 'slowing down', 'moving in the negative direction'], a: 1,
      why: 'The slope is the velocity: rising means positive, steeper means faster. So it speeds up in the positive direction.' },
    { q: 'The x–t graphs of two cars cross at $t = 20\\ \\mathrm{s}$. What is true at that moment?', choices: ['They have the same velocity', 'They are at the same position', 'They have the same acceleration', 'Neither is moving'], a: 1,
      why: 'A crossing point means the same x at the same t: the cars are side by side. Their velocities are the slopes, which are generally different — that is why one overtakes the other.' },
    { q: 'The area under an acceleration–time graph from 0 to 5 s is 12 m/s. This means…', choices: ['the object travelled 12 m', 'its velocity increased by 12 m/s', 'its velocity at 5 s is 12 m/s', 'its average acceleration was 12 m/s²'], a: 1,
      why: 'The area under a–t is the change in velocity. The final velocity is 12 m/s only if the object started from rest; the average acceleration is 12/5 = 2.4 m/s².' },
    { q: 'A horizontal line above the time axis on a v–t graph means the object is at rest.', a: false,
      why: 'It means a constant, non-zero velocity: steady motion with zero acceleration. Rest is a line lying on the time axis of a v–t graph, or any horizontal line on an x–t graph.' }
  ],
  applications: [
    'GPS watches, phone accelerometers and data loggers record motion graphs that coaches and engineers read in exactly this way.',
    'Lift (elevator) and railway engineers shape the v–t and a–t graphs so that the changes in acceleration stay gentle for passengers.',
    'Accident investigators rebuild v–t graphs from skid marks, tachographs and camera footage.'
  ],
  sim: 'mech1-motion-graphs'
},

{
  id: 'relative-velocity', parent: 'kinematics', title: 'Relative velocity', level: 2,
  short: 'Every velocity is measured relative to something. Velocities seen from different viewpoints differ by the velocity of one viewpoint relative to the other.',
  keywords: ['relative velocity', 'reference frame', 'frame of reference', 'closing speed', 'river crossing', 'crosswind', 'boat and current', 'Galilean relativity', 'inertial frame'],
  prereq: ['speed-velocity', 'position-displacement', 'math:vector-addition'],
  related: ['projectile-motion', 'newtons-first-law', 'velocity-addition', 'relativity-postulates'],
  body: `
You walk towards the front of a train at 1.5 m/s while the train runs at 30 m/s. How fast are you going? To another passenger, 1.5 m/s. To someone on the platform, 31.5 m/s. Both are right: **a velocity is always measured relative to something**, and changing the reference changes the answer in a simple way.

### Adding velocities
Write $\\vec v_{AB}$ for the velocity of A as measured by B. Then

$$\\vec v_{AC} = \\vec v_{AB} + \\vec v_{BC}$$

Your velocity relative to the ground (A relative to C) is your velocity relative to the train (A relative to B) plus the train's velocity relative to the ground (B relative to C). The inner letters match up and "cancel", which makes the rule easy to chain through several frames. Swapping the letters reverses the direction: $\\vec v_{BA} = -\\vec v_{AB}$.

In one dimension these are signed numbers. Two cars approaching head-on at 90 km/h each close on each other at 180 km/h. A car at 100 km/h overtaking a lorry at 80 km/h gains on it at only 20 km/h — which is why overtaking needs such a long stretch of clear road.

### In two dimensions
When the velocities are not along one line you add them as [[math:vector-addition|vectors]], usually by components. A boat pointed straight across a river that flows at $u$ moves across at its own speed $v_b$ **and** drifts downstream at $u$, so it travels at a slant, at $\\sqrt{v_b^2 + u^2}$ over the ground.

- **Quickest crossing:** point straight across. The crossing time is $t = d/v_b$ whatever the current, because the current only moves the boat sideways. The boat lands $u\\,d/v_b$ downstream.
- **Landing directly opposite:** point upstream at an angle $\\alpha$ with $\\sin\\alpha = u/v_b$, so that the upstream part of the boat's velocity cancels the current. The crossing is slower, $t = d/\\sqrt{v_b^2 - u^2}$, and impossible if the current is faster than the boat.

Pilots do the same with the wind, navigators with ocean currents, and a cyclist in the rain sees the drops coming at a slant: the rain's velocity relative to her is the rain's velocity minus her own.

### The same physics in every steady frame
If a ball accelerates at $2\\ \\mathrm{m/s^2}$ for one observer, it accelerates at $2\\ \\mathrm{m/s^2}$ for any other observer moving at constant velocity relative to the first: adding a constant velocity does not change a rate of change. So [[newtons-second-law|Newton's laws]] hold unchanged in all such **inertial frames**. Galileo made the point with a ship: a ball dropped from the mast lands at its foot whether the ship is moored or sailing smoothly.

> [!warn] Simply adding velocities is excellent at everyday speeds but fails near the speed of light: no two speeds combine to more than $c$. See [[velocity-addition|relativistic velocity addition]].
`,
  ideas: [
    'Every velocity is measured relative to some reference; there is no absolute velocity.',
    'Relative velocities add like vectors: $\\vec v_{AC} = \\vec v_{AB} + \\vec v_{BC}$, and $\\vec v_{BA} = -\\vec v_{AB}$.',
    'Moving towards each other, the closing speed is the sum of the speeds; moving the same way, it is the difference.',
    'Heading straight across a river, the crossing time does not depend on the current; the current only adds drift.',
    'Accelerations, and so Newton\'s laws, are the same in all frames moving steadily relative to each other.'
  ],
  pitfalls: [
    'A current slows the crossing — Heading straight across, the time is width ÷ boat speed whatever the current. The current only carries you downstream.',
    'Aim at the landing point to reach it — The current pushes you downstream the whole way. To land opposite you must point upstream of the target.',
    '$v_{BA}$ is the same as $v_{AB}$ — Swapping the observer and the observed reverses the direction: $v_{BA} = -v_{AB}$.'
  ],
  formulas: [
    {
      name: 'Adding velocities along a line',
      expr: 'v_AC = v_AB + v_BC', tex: 'v_{AC} = v_{AB} + v_{BC}',
      vars: {
        v_AC: { name: 'velocity of A relative to C (you, relative to the ground)', q: 'speed', unit: 'm/s', tex: 'v_{AC}', signed: true },
        v_AB: { name: 'velocity of A relative to B (you, relative to the train)', q: 'speed', unit: 'm/s', value: 1.5, tex: 'v_{AB}', signed: true },
        v_BC: { name: 'velocity of B relative to C (the train, relative to the ground)', q: 'speed', unit: 'm/s', value: 30, tex: 'v_{BC}', signed: true }
      },
      note: 'Give each velocity a sign: positive one way along the line, negative the other.',
      stories: {
        v_AC: 'You walk towards the front of a train at {v_AB} relative to the train, which moves at {v_BC}. What is your velocity relative to the ground?',
        v_AB: 'A passenger moves at {v_AC} relative to the ground on a train doing {v_BC}. What is her velocity relative to the train?'
      }
    },
    {
      name: 'Heading straight across: drift downstream',
      expr: 's = u*d/vb', tex: 's = \\frac{u\\,d}{v_b}',
      vars: {
        s: { name: 'distance carried downstream', q: 'length', unit: 'm' },
        u: { name: 'speed of the current', q: 'speed', unit: 'm/s', value: 1.5 },
        d: { name: 'width of the river', q: 'length', unit: 'm', value: 80 },
        vb: { name: 'boat speed relative to the water', q: 'speed', unit: 'm/s', value: 4, tex: 'v_b' }
      },
      note: 'The crossing itself takes $t = d/v_b$, whatever the current.',
      stories: {
        s: 'A swimmer who manages {vb} heads straight across a river {d} wide that flows at {u}. How far downstream does she land?',
        u: 'A boat doing {vb} through the water heads straight across a river {d} wide and lands {s} downstream. How fast is the current?'
      }
    },
    {
      name: 'Landing directly opposite: crossing time',
      expr: 't = d/sqrt(vb^2 - u^2)', tex: 't = \\frac{d}{\\sqrt{v_b^2 - u^2}}',
      vars: {
        t: { name: 'crossing time', q: 'time', unit: 's' },
        d: { name: 'width of the river', q: 'length', unit: 'm', value: 80 },
        vb: { name: 'boat speed relative to the water', q: 'speed', unit: 'm/s', value: 4, tex: 'v_b' },
        u: { name: 'speed of the current', q: 'speed', unit: 'm/s', value: 1.5 }
      },
      note: 'Only possible when the boat is faster than the current, $v_b > u$.',
      stories: { t: 'A ferry that does {vb} in still water must cross a river {d} wide, flowing at {u}, and land directly opposite. How long does the crossing take?' }
    },
    {
      name: 'Landing directly opposite: heading upstream',
      expr: 'sin(alpha) = u/vb', tex: '\\sin\\alpha = \\frac{u}{v_b}', solveFor: 'alpha',
      vars: {
        alpha: { name: 'heading, measured upstream from straight across', q: 'angle', unit: '°', min: 0, max: 90 },
        u: { name: 'speed of the current', q: 'speed', unit: 'm/s', value: 1.5 },
        vb: { name: 'boat speed relative to the water', q: 'speed', unit: 'm/s', value: 4, tex: 'v_b' }
      },
      stories: { alpha: 'A boat that does {vb} in still water wants to cross a river flowing at {u} and land directly opposite. How far upstream of straight across must it point?' }
    }
  ],
  examples: [
    {
      title: 'Two ways across a river',
      q: 'A river 80 m wide flows at 1.5 m/s. A boat moves at 4 m/s relative to the water. (a) It heads straight across: how long does it take, and where does it land? (b) Which way must it head to land directly opposite, and how long does that take?',
      steps: [
        '(a) Across, the boat moves at 4 m/s, so $t = 80/4 = 20\\ \\mathrm{s}$.',
        'Meanwhile the current carries it $1.5 \\times 20 = 30\\ \\mathrm{m}$ downstream. Its speed over the ground is $\\sqrt{4^2 + 1.5^2} = 4.27\\ \\mathrm{m/s}$.',
        '(b) Point upstream at $\\alpha$ with $\\sin\\alpha = 1.5/4 = 0.375$, so $\\alpha = 22.0°$ from straight across.',
        'The across part of the velocity is now $\\sqrt{4^2 - 1.5^2} = 3.71\\ \\mathrm{m/s}$, so the crossing takes $80/3.71 = 21.6\\ \\mathrm{s}$ — slightly longer.'
      ],
      a: '(a) 20 s, landing 30 m downstream. (b) Head 22° upstream: 21.6 s, landing opposite.'
    },
    {
      title: 'Rain on a cyclist',
      q: 'Rain falls vertically at 8 m/s. A cyclist rides at 6 m/s. At what speed and angle does the rain meet her?',
      steps: [
        'The rain\'s velocity relative to her is its velocity relative to the ground minus hers: $\\vec v_{\\text{rain, her}} = \\vec v_{\\text{rain}} - \\vec v_{\\text{her}}$.',
        'Components: 8 m/s downwards, and 6 m/s horizontally towards her (opposite to her motion).',
        'Speed: $\\sqrt{8^2 + 6^2} = 10\\ \\mathrm{m/s}$. Angle from the vertical: $\\arctan(6/8) = 36.9°$, slanting in from the front.',
        'To keep dry she should tilt her umbrella forwards by about 37°.'
      ],
      a: '10 m/s, about 37° from the vertical, coming from in front.'
    },
    {
      title: 'Why overtaking takes so long',
      q: 'A car at 100 km/h overtakes a lorry 16.5 m long doing 80 km/h. The car is 4.5 m long and starts 20 m behind the lorry, finishing 20 m in front of it. How long does the manoeuvre take, and how far does the car travel over the road?',
      steps: [
        'Relative to the lorry the car moves at only $100 - 80 = 20\\ \\mathrm{km/h} = 5.56\\ \\mathrm{m/s}$.',
        'Relative to the lorry, the front of the car must move $20 + 16.5 + 20 + 4.5 = 61\\ \\mathrm{m}$.',
        'Time: $61/5.56 = 11.0\\ \\mathrm{s}$.',
        'Over the road the car covers $27.8 \\times 11.0 = 305\\ \\mathrm{m}$. An oncoming car at 100 km/h covers as much again, so about 600 m of clear road is needed.'
      ],
      a: 'About 11 s, while the car travels about 300 m.'
    }
  ],
  quiz: [
    { q: 'Two cars drive towards each other, each at 90 km/h. How fast does one approach the other, as measured from either car?', choices: ['0 km/h', '90 km/h', '127 km/h', '180 km/h'], a: 3,
      why: 'Relative to car B, car A moves at 90 − (−90) = 180 km/h. (127 km/h is what you would get by adding the speeds at right angles.)' },
    { q: 'A train moves at 30 m/s. A passenger throws a ball towards the back of the train at 30 m/s relative to the train. What does someone on the platform see?', choices: ['The ball flies backwards at 60 m/s', 'The ball flies forwards at 60 m/s', 'The ball falls straight down', 'The ball flies backwards at 30 m/s'], a: 2,
      why: 'Relative to the ground its horizontal velocity is +30 − 30 = 0, so it simply falls vertically.' },
    { q: 'You want to cross a river in the shortest possible time. Which way should you point the boat?', choices: ['Straight across', 'Upstream, so as to land opposite', 'Downstream, to go with the current', 'It depends on how fast the current is'], a: 0,
      why: 'Only the across part of the boat\'s own velocity takes you across, and it is largest when you point straight across. The current adds drift but no crossing speed.' },
    { q: 'A ball accelerates at 3 m/s² as seen from the ground. Seen from a car driving past at a steady 20 m/s, its acceleration is also 3 m/s².', a: true,
      why: 'The velocities seen from the two frames differ by a constant 20 m/s, so their rates of change are identical.' },
    { q: 'Rain is falling straight down. As you start to run, the rain seems to…', choices: ['still fall straight down', 'slant towards you from in front', 'slant in from behind you', 'fall more slowly'], a: 1,
      why: 'Relative to you, the rain has your velocity subtracted from its own: it gains a horizontal part pointing back at you, so it seems to come from in front.' }
  ],
  applications: [
    'Aircraft navigation: pilots point into a crosswind (the "crab angle") so that the track over the ground follows the route or the runway.',
    'Ferries, rowers and swimmers crossing rivers and tidal streams.',
    'Docking in orbit: only the relative velocity of the two spacecraft matters, although both move at about 7.7 km/s.',
    'Radar speed checks and Doppler weather radar measure velocity relative to the instrument.'
  ],
  history: 'In 1632 Galileo argued that no experiment inside the cabin of a smoothly sailing ship could reveal whether it was moving — butterflies, dripping water and thrown balls all behave as on land. This relativity of uniform motion underlies Newton\'s mechanics and, with the speed of light added, Einstein\'s.',
  sim: 'mech1-river'
},

{
  id: 'uniform-circular-motion', parent: 'kinematics', title: 'Uniform circular motion', level: 2,
  short: 'Moving round a circle at steady speed: the direction of the velocity keeps turning, so there is an acceleration v²/r pointing to the centre.',
  keywords: ['circular motion', 'centripetal acceleration', 'angular speed', 'angular velocity', 'period', 'frequency', 'radian', 'rpm', 'v^2/r', 'omega'],
  prereq: ['acceleration', 'speed-velocity', 'math:angle-measure'],
  related: ['centripetal-force', 'circular-orbits', 'angular-kinematics', 'simple-harmonic-motion', 'projectile-motion'],
  body: `
A car on a roundabout, a stone whirled on a string, a satellite in a circular orbit, a point on a spinning wheel: each goes round a circle at a steady speed. The **speed** is constant, but the **velocity** is not — its direction keeps turning. A changing velocity means an [[acceleration]], so an object in uniform circular motion accelerates all the time, although it never speeds up or slows down.

### Describing the motion
One trip round a circle of radius $r$ takes the **period** $T$. The speed is the circumference divided by the period, and the **angular speed** $\\omega$ is the angle swept out per second, in radians:

$$v = \\frac{2\\pi r}{T}, \\qquad \\omega = \\frac{2\\pi}{T} = 2\\pi f, \\qquad v = \\omega r$$

A point on the rim of a wheel moves faster than one near the hub, although both turn at the same $\\omega$ — that is what $v = \\omega r$ says. The [[math:angle-measure|radian]] is what keeps it so simple: an angle $\\theta$ in radians cuts off an arc of length $r\\theta$.

### Centripetal acceleration
The acceleration points **towards the centre** ("centripetal" means centre-seeking) and has the size

$$a_c = \\frac{v^2}{r} = \\omega^2 r$$

Why inwards? In a short time $\\Delta t$ the velocity turns through the angle $\\omega\\,\\Delta t$ without changing its length. The small change $\\Delta\\vec v$ then has size $v\\,\\omega\\,\\Delta t$ and points at right angles to $\\vec v$ — towards the centre. Dividing by $\\Delta t$ gives $a = v\\omega = v^2/r$. The simulation shows this: put the velocity arrows tail to tail and their tips run round a circle of their own, at speed $a$.

### Numbers
| Motion | Radius | Speed | Acceleration |
|---|---|---|---|
| Car on a tight bend | 50 m | 20 m/s | 8.0 m/s², 0.8 g |
| Washing-machine drum at 1200 rpm | 0.25 m | 31 m/s | 3900 m/s², 400 g |
| International Space Station | 6780 km | 7.66 km/s | 8.7 m/s² |
| Earth's equator, turning daily | 6378 km | 465 m/s | 0.034 m/s² |
| The Moon round the Earth | 384 000 km | 1.02 km/s | 0.0027 m/s² |

On the same circle, **doubling the speed quadruples the acceleration** — which is why a bend taken too fast is so much more dangerous than it feels.

### What provides it
By [[newtons-second-law|Newton's second law]] an acceleration needs a net force, here $F = m v^2/r$ pointing inwards. It is not a new kind of force but a job that some real force must do: friction on a car's tyres, the tension in a string, gravity for a satellite (see [[centripetal-force]]). If that force disappears, the object carries straight on along the tangent.

> [!note] Shine a light across a ball in uniform circular motion and watch its shadow on a wall: the shadow moves back and forth in [[simple-harmonic-motion|simple harmonic motion]]. The two motions share the same mathematics.
`,
  ideas: [
    'In uniform circular motion the speed is constant but the velocity changes continuously.',
    'The acceleration points to the centre and has size v²/r = ω²r.',
    'v = ωr: on a spinning object, points farther from the axis move faster.',
    'Some real force must supply the inward pull; remove it and the object leaves along the tangent.'
  ],
  pitfalls: [
    'Constant speed means no acceleration — Direction is part of velocity. Turning at a steady speed is accelerating, towards the centre.',
    'The acceleration points outwards, because you feel pushed out — What you feel is your body trying to carry straight on while the car turns in under you. The acceleration, and the force causing it, point inwards.',
    'Released from a circle, an object flies straight outwards — It leaves along the tangent, in the direction it was moving at that instant.'
  ],
  derivation: {
    title: 'Derive a = v²/r from the turning velocity',
    steps: [
      { text: 'In a short time $\\Delta t$ the object moves through a small angle $\\Delta\\theta$ round the circle, covering the arc $v\\,\\Delta t = r\\,\\Delta\\theta$:', tex: '\\Delta\\theta = \\frac{v\\,\\Delta t}{r}' },
      { text: 'Its velocity keeps its length $v$ but turns through the same angle. Drawn tail to tail, the two velocity arrows form a thin isosceles triangle whose short side is the change $\\Delta\\vec v$:', tex: '|\\Delta\\vec v| \\approx v\\,\\Delta\\theta' },
      { text: 'As $\\Delta t \\to 0$, $\\Delta\\vec v$ becomes perpendicular to $\\vec v$, pointing at the centre. Divide by $\\Delta t$:', tex: 'a = \\frac{|\\Delta\\vec v|}{\\Delta t} = v\\,\\frac{\\Delta\\theta}{\\Delta t} = v\\,\\omega' },
      { text: 'Finally use $\\omega = v/r$:', tex: 'a = \\frac{v^2}{r} = \\omega^2 r' }
    ]
  },
  formulas: [
    {
      name: 'Centripetal acceleration from the speed',
      expr: 'a = v^2/r', tex: 'a_c = \\frac{v^2}{r}',
      vars: {
        a: { name: 'centripetal acceleration', q: 'accel', unit: 'm/s²', tex: 'a_c' },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 20 },
        r: { name: 'radius of the circle', q: 'length', unit: 'm', value: 50 }
      },
      stories: {
        a: 'A car takes a bend of radius {r} at {v}. What is its acceleration?',
        v: 'Tyres can hold a car on a bend of radius {r} up to a sideways acceleration of {a}. What is the fastest safe speed?',
        r: 'A jet flying at {v} turns with an acceleration of {a}. What is the radius of its turn?'
      }
    },
    {
      name: 'Centripetal acceleration from the angular speed',
      expr: 'a = omega^2*r', tex: 'a_c = \\omega^2 r',
      vars: {
        a: { name: 'centripetal acceleration', q: 'accel', unit: 'm/s²', tex: 'a_c' },
        omega: { name: 'angular speed', q: 'angvel', unit: 'rpm', value: 1200 },
        r: { name: 'radius', q: 'length', unit: 'm', value: 0.25 }
      },
      stories: {
        a: 'A washing-machine drum of radius {r} spins at {omega}. What acceleration do the clothes against its wall have?',
        omega: 'A centrifuge must give an acceleration of {a} at a radius of {r}. How fast must it spin?'
      }
    },
    {
      name: 'Speed from the period',
      expr: 'v = 2*pi*r/T', tex: 'v = \\frac{2\\pi r}{T}',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'm/s' },
        r: { name: 'radius', q: 'length', unit: 'km', value: 384400 },
        T: { name: 'period (time for one turn)', q: 'time', unit: 'day', value: 27.32 }
      },
      stories: {
        v: 'The Moon circles the Earth at a distance of {r}, once every {T}. How fast does it move?',
        T: 'A runner keeps up {v} round a circular track of radius {r}. How long is one lap?'
      }
    },
    {
      name: 'Speed and angular speed',
      expr: 'v = omega*r', tex: 'v = \\omega r',
      vars: {
        v: { name: 'speed of the point', q: 'speed', unit: 'm/s' },
        omega: { name: 'angular speed', q: 'angvel', unit: 'rad/s', value: 25 },
        r: { name: 'distance from the axis', q: 'length', unit: 'm', value: 0.33 }
      },
      stories: { v: 'A bicycle wheel of radius {r} turns at {omega}. How fast does the tyre move relative to the axle?', omega: 'A car wheel of radius {r} rolls along at {v}. What is its angular speed?' }
    }
  ],
  examples: [
    {
      title: 'Too fast for the bend',
      q: 'A car takes a bend of radius 80 m. Find its centripetal acceleration at 20 m/s and at 30 m/s. Tyres on dry asphalt can supply at most about 0.8–1 g sideways. What happens at the higher speed?',
      steps: [
        'At 20 m/s: $a = v^2/r = 20^2/80 = 5.0\\ \\mathrm{m/s^2}$, about half of $g$.',
        'At 30 m/s: $a = 30^2/80 = 11.3\\ \\mathrm{m/s^2} = 1.15\\,g$. Half as fast again means $1.5^2 = 2.25$ times the acceleration.',
        'That is more than the tyres can provide, so the friction force falls short of $m v^2/r$ and the car cannot follow the curve: it slides towards the outside of the bend.'
      ],
      a: '5.0 m/s² at 20 m/s; 11.3 m/s² at 30 m/s — more than the tyres can grip.'
    },
    {
      title: 'Newton\'s Moon test',
      q: 'The Moon orbits $3.84\\times10^{8}\\ \\mathrm{m}$ from the Earth\'s centre, once every 27.3 days. Find its centripetal acceleration and compare it with $g$ divided by $60^2$ (the Moon is about 60 Earth radii away).',
      steps: [
        'Period in seconds: $T = 27.3 \\times 86\\,400 = 2.36\\times10^{6}\\ \\mathrm{s}$.',
        'With $v = 2\\pi r/T$, the acceleration is $a = \\dfrac{v^2}{r} = \\dfrac{4\\pi^2 r}{T^2} = \\dfrac{4\\pi^2 (3.84\\times10^{8})}{(2.36\\times10^{6})^2} = 2.72\\times10^{-3}\\ \\mathrm{m/s^2}$.',
        'Surface gravity weakened by the inverse square of the distance: $9.81/60^2 = 2.72\\times10^{-3}\\ \\mathrm{m/s^2}$.',
        'They agree. The pull that keeps the Moon on its circle is the same gravity that drops an apple, weakened with distance — the check Newton made in the 1660s.'
      ],
      a: 'About 2.7 × 10⁻³ m/s², exactly what inverse-square gravity predicts.'
    }
  ],
  quiz: [
    { q: 'A ball on a string moves in a horizontal circle at constant speed. Its acceleration points…', choices: ['along its velocity', 'outwards, away from the centre', 'towards the centre', 'nowhere: it is zero'], a: 2,
      why: 'The velocity keeps turning towards the centre, so the change of velocity — the acceleration — points inwards. The string pulls inwards to provide it.' },
    { q: 'A car takes the same bend at twice the speed. Its centripetal acceleration becomes…', choices: ['the same', 'twice as large', 'four times as large', 'half as large'], a: 2,
      why: '$a = v^2/r$, so doubling $v$ multiplies $a$ by four.' },
    { q: 'Two children sit on a merry-go-round, one at the edge and one halfway in. Compared with the inner child, the outer one has…', choices: ['the same speed and the same acceleration', 'twice the speed and twice the acceleration', 'twice the speed and four times the acceleration', 'the same speed and twice the acceleration'], a: 1,
      why: 'Both turn at the same $\\omega$. Then $v = \\omega r$ doubles with $r$, and so does $a = \\omega^2 r$. (Four times would be for double the speed on the same radius.)' },
    { q: 'A hammer thrower lets go when the hammer is at the front of its circle, moving to the left. The hammer flies off…', choices: ['to the left, along the tangent', 'straight away from the thrower', 'in a curve, spiralling outwards', 'back towards the thrower'], a: 0,
      why: 'Once released, no inward force acts (apart from gravity, downwards). The hammer keeps the velocity it had, which was along the tangent.' },
    { q: 'An object in uniform circular motion has a constant velocity.', a: false,
      why: 'Its speed is constant, but the direction changes continuously, so the velocity — speed and direction together — is not constant.' }
  ],
  applications: [
    'Road and railway curves are laid out using v²/r, with banking and speed limits that keep the sideways acceleration safe and comfortable.',
    'Centrifuges separate blood plasma from cells, or isotopes of uranium, by creating accelerations of thousands of g.',
    'For a satellite in a circular orbit, the centripetal acceleration is exactly the local strength of gravity.',
    'Pilots and astronauts train in human centrifuges at up to about 9 g.'
  ],
  history: 'Christiaan Huygens worked out the v²/r rule around 1659 while studying pendulum clocks, and Newton found it independently. Newton used it to show that the Moon\'s orbit and a falling apple obey one law of gravity.',
  sim: 'mech1-circular'
}

);
