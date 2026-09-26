/* HYPER-MATH · content/trig-functions.js — measuring angles, the sine, cosine and tangent
 * from right triangles and from the unit circle, their graphs, and running them backwards. */
Hyper.add(

{
  id: 'angle-measure', parent: 'trig-functions', title: 'Degrees and radians', level: 1,
  short: 'Degrees split a turn into 360 parts; radians measure an angle by the arc it cuts from a circle, in radii, so a full turn is 2π. Calculus and physics need radians.',
  keywords: ['radian', 'degree', 'conversion', '2 pi', 'pi radians', 'arc length', 's = r theta', 'sector area', 'angular velocity', 'rpm', 'small-angle approximation', 'arcsecond', 'DEG RAD'],
  prereq: ['angles', 'circles'],
  related: ['unit-circle', 'derivatives-of-functions', 'physics:angular-kinematics', 'physics:uniform-circular-motion', 'physics:simple-pendulum'],
  body: `
Degrees are a human convention — 360 parts to a turn, inherited from Babylon. Mathematics has a natural unit of angle that needs no convention at all: measure an angle by the **arc** it cuts from a circle, counted in radii. That is the **radian**:

$$\\theta = \\frac{s}{r}$$

An angle of one radian cuts off an arc exactly as long as the radius. Because it is a length divided by a length, the radian is a pure number; "rad" is a reminder of what the number means, not a physical unit.

### Converting
A full turn cuts off the whole circumference, $2\\pi r$, so a full turn is $2\\pi$ radians:

$$360° = 2\\pi\\ \\text{rad}, \\qquad 180° = \\pi\\ \\text{rad}, \\qquad 1\\ \\text{rad} = \\frac{180°}{\\pi} \\approx 57.3°$$

To turn degrees into radians multiply by $\\pi/180$; to go back, multiply by $180/\\pi$.

| Degrees | 0° | 30° | 45° | 60° | 90° | 180° | 270° | 360° |
|---|---|---|---|---|---|---|---|---|
| Radians | 0 | π/6 | π/4 | π/3 | π/2 | π | 3π/2 | 2π |

### Why radians are the natural unit
With $\\theta$ in radians, the circle formulas lose their clutter:

$$s = r\\theta, \\qquad A = \\tfrac12 r^2\\theta, \\qquad v = r\\omega$$

— the arc length, the area of a sector, and the speed of a point turning at angular speed $\\omega$. In degrees each would carry a stray factor of $\\pi/180$.

The deeper reason is calculus. For a small angle, the arc and the half-chord are almost the same length, so $\\sin\\theta \\approx \\theta$ — *but only with $\\theta$ in radians*: $\\sin 0.1 = 0.0998$. From that fact follow the [[derivatives-of-functions|derivatives]] $\\frac{d}{dx}\\sin x = \\cos x$ and $\\frac{d}{dx}\\cos x = -\\sin x$; in degrees they would read $\\frac{\\pi}{180}\\cos x$. That is why every formula of calculus and of physics — the small-angle approximation for a [[physics:simple-pendulum|pendulum]], the phase $\\omega t$ of an oscillation, $e^{i\\theta}$ — assumes radians.

### Angular speed
Anything that spins is described by an angle per unit time, the angular velocity $\\omega$ in rad/s ([[physics:angular-kinematics|angular kinematics]]). One revolution per second is $2\\pi$ rad/s, so 3000 rpm is $3000 \\times 2\\pi/60 \\approx 314$ rad/s. The Earth turns through $2\\pi$ radians in a sidereal day of 23.93 h, $7.29 \\times 10^{-5}$ rad/s; at the equator, 6378 km from the axis, that is a speed of 465 m/s.

### Very small angles
Astronomers give positions on the sky in degrees, arcminutes and arcseconds, but convert to radians to calculate: one arcsecond is $4.85 \\times 10^{-6}$ rad. A star whose [[physics:stellar-parallax|parallax]] is one arcsecond is $1/(4.85 \\times 10^{-6}) = 206\\,265$ times as far away as the Sun — one parsec.

> [!warn] Calculators have a DEG/RAD switch. In radian mode, $\\sin 30$ is $-0.988$, not $0.5$. Check the mode before trusting any answer.
`,
  ideas: [
    'An angle in radians is arc length divided by radius: θ = s/r.',
    'A full turn is 2π rad = 360°, so 1 rad ≈ 57.3° and π rad = 180°.',
    'In radians, s = rθ, A = ½r²θ and v = rω, with no stray factors.',
    'sin θ ≈ θ for small θ and d(sin x)/dx = cos x only when angles are in radians.'
  ],
  pitfalls: [
    'A radian is a physical unit like the metre — It is a ratio of two lengths, a pure number. That is why rad/s can simplify to 1/s.',
    'Using degrees in s = rθ — The formula assumes radians. A 90° arc of radius 2 m is 2 × π/2 = 3.14 m long, not 180 m.',
    'Leaving the calculator in the wrong mode — sin 30 means 30 radians in RAD mode. Switch modes, or convert first.'
  ],
  formulas: [
    {
      name: 'Arc length',
      expr: 's = r*theta', tex: 's = r\\theta',
      vars: {
        s: { name: 'arc length', q: 'length', unit: 'm' },
        r: { name: 'radius', q: 'length', unit: 'm', value: 12 },
        theta: { name: 'angle at the centre', q: 'angle', unit: 'rad', value: 2 }
      },
      stories: {
        s: 'A car drives round a roundabout of radius {r}, turning through {theta}. How far does it travel?',
        theta: 'A runner covers {s} of a circular track of radius {r}. Through what angle has she turned?'
      }
    },
    {
      name: 'Area of a sector',
      expr: 'A = 0.5*r^2*theta', tex: 'A = \\tfrac12 r^2\\theta',
      vars: {
        A: { name: 'area of the sector', q: 'area', unit: 'm²' },
        r: { name: 'radius', q: 'length', unit: 'm', value: 12 },
        theta: { name: 'angle at the centre', q: 'angle', unit: 'rad', value: 0.5 }
      },
      stories: { A: 'A lawn sprinkler throws water {r} and sweeps through {theta}. What area does it water?' }
    },
    {
      name: 'Degrees to radians',
      expr: 't = D*pi/180', tex: '\\theta_{\\mathrm{rad}} = \\theta_{\\mathrm{deg}} \\times \\frac{\\pi}{180}',
      vars: {
        t: { name: 'angle in radians', tex: '\\theta_{\\mathrm{rad}}', signed: true },
        D: { name: 'angle in degrees', tex: '\\theta_{\\mathrm{deg}}', value: 150, signed: true }
      }
    },
    {
      name: 'Speed of a point on a turning wheel',
      expr: 'v = r*omega', tex: 'v = r\\omega',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'km/h' },
        r: { name: 'radius', q: 'length', unit: 'm', value: 0.31 },
        omega: { name: 'angular speed', q: 'angvel', unit: 'rpm', value: 800 }
      },
      note: 'For a rolling wheel this is also the speed of the vehicle. The calculator converts rpm to rad/s for you.',
      stories: { v: 'A car wheel of radius {r} turns at {omega}. How fast is the car going?', omega: 'A car with wheels of radius {r} drives at {v}. How fast do its wheels turn?' }
    }
  ],
  examples: [
    {
      title: 'Converting both ways',
      q: 'Convert 150° to radians and 2.5 rad to degrees.',
      steps: [
        '$150 \\times \\dfrac{\\pi}{180} = \\dfrac{5\\pi}{6} \\approx 2.618$ rad.',
        '$2.5 \\times \\dfrac{180}{\\pi} \\approx 143.2°$.'
      ],
      a: '5π/6 ≈ 2.618 rad; 143.2°'
    },
    {
      title: 'Round the roundabout',
      q: 'A cyclist rides 24 m round the edge of a roundabout of radius 12 m. Through what angle has she turned?',
      steps: [
        '$\\theta = s/r = 24/12 = 2$ rad.',
        'In degrees: $2 \\times 57.3° \\approx 115°$ — a little more than a right angle and a quarter.'
      ],
      a: '2 rad, about 115°'
    },
    {
      title: 'How good is sin θ ≈ θ?',
      q: 'Compare $\\sin\\theta$ with $\\theta$ (in radians) for $\\theta = 10°$.',
      steps: [
        '$10° = 10 \\times \\pi/180 = 0.1745$ rad.',
        '$\\sin 10° = 0.1736$.',
        'The difference is 0.5 %: the small-angle approximation is excellent up to about 10°, which is why a pendulum\'s period hardly depends on the size of small swings.'
      ],
      a: '0.1736 against 0.1745: within 0.5 %'
    }
  ],
  quiz: [
    { q: '$\\pi/4$ radians is…', choices: ['4°', '45°', '90°', '180°/π'], a: 1, why: '$\\pi$ rad = 180°, so $\\pi/4$ rad = 45°.' },
    { q: 'One radian is about…', choices: ['1°', '3.14°', '57°', '90°'], a: 2, why: '$180°/\\pi \\approx 57.3°$: the angle whose arc equals the radius.' },
    { q: 'An arc 10 cm long on a circle of radius 5 cm subtends an angle of…', choices: ['0.5 rad', '2 rad', '50 rad', '2°'], a: 1, why: '$\\theta = s/r = 10/5 = 2$ rad.' },
    { q: 'Write $x$ degrees in radians.', answer: 'pi*x/180', vars: ['x'], why: 'Multiply by $\\pi/180$, since $180° = \\pi$ rad.' },
    { q: 'The rule $\\frac{d}{dx}\\sin x = \\cos x$ holds whether $x$ is measured in degrees or in radians.', a: false,
      why: 'It needs radians. With $x$ in degrees, $\\frac{d}{dx}\\sin x = \\frac{\\pi}{180}\\cos x$, because the angle in radians is $\\pi x/180$.' }
  ],
  applications: [
    'Rotating machinery: shafts, wheels, turbines and hard discs, specified in rpm or rad/s.',
    'Surveying and astronomy, where tiny angles in arcseconds are converted to radians.',
    'Every formula of calculus and of oscillations and waves.'
  ],
  sim: { id: 'gt-unit-circle', params: { radMarks: true, units: 'rad' } }
},

{
  id: 'right-triangle-trig', parent: 'trig-functions', title: 'Right-triangle trigonometry', level: 1,
  short: 'In a right triangle the ratios of the sides depend only on the angle: sine is opposite over hypotenuse, cosine adjacent over hypotenuse, tangent opposite over adjacent.',
  keywords: ['SOHCAHTOA', 'sine', 'cosine', 'tangent', 'opposite', 'adjacent', 'hypotenuse', 'angle of elevation', 'angle of depression', 'special angles', '30-60-90', '45-45-90', 'secant', 'cosecant', 'cotangent', 'components'],
  prereq: ['similar-triangles', 'pythagorean-theorem', 'angles'],
  related: ['unit-circle', 'inverse-trig', 'law-of-sines', 'vector-components', 'physics:inclined-plane', 'physics:projectile-motion'],
  body: `
Stand 50 m from the foot of a tree and look up at its top: the line of sight makes 35° with the ground. How tall is the tree? Every right triangle with a 35° angle has the same shape — they are all [[similar-triangles|similar]] — so the ratio height : distance is the same for all of them. Someone only has to work that ratio out once. It is $\\tan 35° = 0.700$, so the tree rises $50 \\times 0.700 = 35$ m above your eyes.

### The three ratios
Name the sides of a right triangle relative to one of its acute angles $\\theta$: the **hypotenuse** faces the right angle, the **opposite** side faces $\\theta$, and the **adjacent** side is the other side touching $\\theta$. Then

$$\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}, \\qquad \\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}, \\qquad \\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{\\sin\\theta}{\\cos\\theta}$$

— "SOH CAH TOA". Their reciprocals have names too: $\\csc\\theta = 1/\\sin\\theta$, $\\sec\\theta = 1/\\cos\\theta$ and $\\cot\\theta = 1/\\tan\\theta$. The hypotenuse is the longest side, so for an acute angle the sine and cosine lie between 0 and 1, while the tangent can be any positive number.

### Special angles worth knowing
Half of a square is a 45° triangle with sides $1, 1, \\sqrt2$; half of an equilateral triangle is a 30°–60° triangle with sides $1, \\sqrt3, 2$. From them:

| θ | sin θ | cos θ | tan θ |
|---|---|---|---|
| 30° | 1/2 | √3/2 ≈ 0.866 | 1/√3 ≈ 0.577 |
| 45° | √2/2 ≈ 0.707 | √2/2 ≈ 0.707 | 1 |
| 60° | √3/2 ≈ 0.866 | 1/2 | √3 ≈ 1.732 |

Notice that $\\sin 30° = \\cos 60°$. In general $\\cos\\theta = \\sin(90° - \\theta)$: the cosine of an angle is the sine of its **co**mplement, which is where the name comes from — the side adjacent to one acute angle is opposite the other.

### Solving right triangles
Given one side and one acute angle, or any two sides, you can find everything else: the ratios give the missing sides, the [[inverse-trig|inverse functions]] give the angles, and the [[pythagorean-theorem|Pythagorean theorem]] checks the result.

### Components: the physics connection
The most common use in physics is splitting a quantity into perpendicular parts. A force $F$ at angle $\\theta$ above the horizontal has a horizontal part $F\\cos\\theta$ and a vertical part $F\\sin\\theta$ ([[vector-components]]). On a slope at angle $\\theta$, the weight $mg$ splits into $mg\\sin\\theta$ down the slope and $mg\\cos\\theta$ into it ([[physics:inclined-plane|inclined plane]]); a launch velocity splits into $v_0\\cos\\theta$ across and $v_0\\sin\\theta$ up ([[physics:projectile-motion|projectile motion]]).

These definitions only cover angles between 0° and 90°. The [[unit-circle]] extends them to every angle.
`,
  ideas: [
    'sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent.',
    'The ratios depend only on the angle, because right triangles with equal angles are similar.',
    'Exact values for 30°, 45° and 60° come from half a square and half an equilateral triangle.',
    'sin θ = cos(90° − θ); components of a vector are its size times cos θ and sin θ.'
  ],
  pitfalls: [
    'Opposite and adjacent are fixed sides — They depend on which angle you are using. The side opposite one acute angle is adjacent to the other.',
    'sin 60° = 2 sin 30° — sin 60° ≈ 0.866 but 2 sin 30° = 1. The ratios are not proportional to the angle.',
    'The horizontal component always uses cosine — Only if θ is measured from the horizontal. Measure from the vertical and the roles swap.'
  ],
  formulas: [
    {
      name: 'Opposite side from the hypotenuse (sine)',
      expr: 'opp = hyp*sin(theta)', tex: '\\mathrm{opp} = \\mathrm{hyp}\\,\\sin\\theta',
      vars: {
        opp: { name: 'side opposite the angle', q: 'length', unit: 'm' },
        hyp: { name: 'hypotenuse', q: 'length', unit: 'm', value: 6 },
        theta: { name: 'angle', q: 'angle', unit: '°', value: 75, min: 0, max: 90 }
      },
      stories: {
        opp: 'A {hyp} ladder leans against a wall, making {theta} with the ground. How high up the wall does it reach?',
        theta: 'A {hyp} ladder reaches {opp} up a wall. What angle does it make with the ground?'
      }
    },
    {
      name: 'Adjacent side from the hypotenuse (cosine)',
      expr: 'adj = hyp*cos(theta)', tex: '\\mathrm{adj} = \\mathrm{hyp}\\,\\cos\\theta',
      vars: {
        adj: { name: 'side adjacent to the angle', q: 'length', unit: 'm' },
        hyp: { name: 'hypotenuse', q: 'length', unit: 'm', value: 6 },
        theta: { name: 'angle', q: 'angle', unit: '°', value: 75, min: 0, max: 90 }
      },
      stories: { adj: 'A {hyp} ladder makes {theta} with the ground. How far is its foot from the wall?' }
    },
    {
      name: 'Opposite side from the adjacent side (tangent)',
      expr: 'opp = adj*tan(theta)', tex: '\\mathrm{opp} = \\mathrm{adj}\\,\\tan\\theta',
      vars: {
        opp: { name: 'side opposite the angle', q: 'length', unit: 'm' },
        adj: { name: 'side adjacent to the angle', q: 'length', unit: 'm', value: 50 },
        theta: { name: 'angle', q: 'angle', unit: '°', value: 35, min: 0, max: 89.9 }
      },
      stories: {
        opp: 'From {adj} away across level ground, the top of a tree is {theta} above the horizontal. How far is the treetop above your eyes?',
        theta: 'A ramp rises {opp} over a horizontal run of {adj}. At what angle is it inclined?',
        adj: 'A lighthouse lamp {opp} above the sea sees a boat {theta} below the horizontal. How far away is the boat?'
      }
    }
  ],
  examples: [
    {
      title: 'A ladder against a wall',
      q: 'A 6.0 m ladder makes 75° with level ground. How high does it reach, and how far is its foot from the wall?',
      steps: [
        'Height (opposite the 75° angle): $6.0\\sin 75° = 6.0 \\times 0.966 = 5.80$ m.',
        'Foot (adjacent): $6.0\\cos 75° = 6.0 \\times 0.259 = 1.55$ m.',
        'Check: $5.80^2 + 1.55^2 = 33.6 + 2.4 = 36.0 = 6.0^2$.'
      ],
      a: '5.80 m up the wall, foot 1.55 m out'
    },
    {
      title: 'An angle of depression',
      q: 'The lamp of a lighthouse is 40 m above the sea. The keeper sees a boat 12° below the horizontal. How far is the boat from the foot of the lighthouse?',
      steps: [
        'The angle of depression from the lamp equals the angle of elevation from the boat (alternate angles), 12°.',
        'In the right triangle, the height 40 m is opposite 12° and the distance $d$ adjacent: $\\tan 12° = 40/d$.',
        '$d = 40/\\tan 12° = 40/0.2126 = 188$ m.'
      ],
      a: 'About 188 m'
    },
    {
      title: 'Exact values',
      q: 'A right triangle has a 30° angle and a hypotenuse of 10 cm. Find the other two sides exactly.',
      steps: [
        'Opposite 30°: $10\\sin 30° = 10 \\times \\tfrac12 = 5$ cm.',
        'Adjacent: $10\\cos 30° = 10 \\times \\tfrac{\\sqrt3}{2} = 5\\sqrt3 \\approx 8.66$ cm.'
      ],
      a: '5 cm and 5√3 ≈ 8.66 cm'
    }
  ],
  quiz: [
    { q: 'In a right triangle $\\sin\\theta = 3/5$. What is $\\cos\\theta$?', choices: ['3/4', '4/5', '5/3', '2/5'], a: 1,
      why: 'Opposite 3, hypotenuse 5, so the adjacent side is $\\sqrt{25 - 9} = 4$ and $\\cos\\theta = 4/5$.' },
    { q: '$\\tan 45°$ equals…', choices: ['0', '0.707', '1', '√2'], a: 2, why: 'A 45° right triangle has equal legs, so opposite ÷ adjacent = 1.' },
    { q: 'A wheelchair ramp rises 1 m over 12 m of horizontal run. Its angle is about…', choices: ['4.8°', '8.3°', '12°', '85°'], a: 0, why: '$\\tan\\theta = 1/12$, so $\\theta = \\arctan(0.0833) \\approx 4.8°$.' },
    { q: '$\\sin 60° = 2\\sin 30°$.', a: false, why: '$\\sin 60° = \\sqrt3/2 \\approx 0.866$ while $2\\sin 30° = 1$. Doubling an angle does not double its sine.' },
    { q: 'Which of these equals $\\cos 20°$?', choices: ['$\\sin 20°$', '$\\sin 70°$', '$\\cos 70°$', '$\\tan 70°$'], a: 1, why: '$\\cos\\theta = \\sin(90° - \\theta)$: the side adjacent to 20° is opposite the 70° angle.' }
  ],
  applications: [
    'Heights and distances in surveying, navigation and astronomy.',
    'Resolving forces, velocities and fields into components.',
    'Roof pitches, stair and ramp angles, and road gradients.'
  ],
  sim: 'gt-unit-circle'
},

{
  id: 'unit-circle', parent: 'trig-functions', title: 'The unit circle', level: 1,
  short: 'Put the angle at the centre of a circle of radius one: the point where its arm lands is (cos θ, sin θ). That definition works for every angle, not only those inside a right triangle.',
  keywords: ['unit circle', 'cosine', 'sine', 'tangent', 'quadrants', 'ASTC', 'reference angle', 'periodic', 'negative angle', 'even odd', 'tangent line', 'sin^2 + cos^2 = 1'],
  prereq: ['right-triangle-trig', 'angle-measure', 'coordinate-geometry'],
  related: ['trig-graphs', 'trig-identities', 'polar-coordinates', 'eulers-formula', 'physics:uniform-circular-motion', 'physics:simple-harmonic-motion'],
  body: `
The triangle definitions of sine and cosine stop at 90°: a right triangle cannot contain an obtuse angle. Yet a wheel turns through 200°, a pendulum swings to −15°, and an alternating current goes round fifty times a second. To give every angle a sine and a cosine, put the angle at the centre of a circle of radius 1 — the **unit circle** — measured anticlockwise from the positive x-axis. The arm at angle $\\theta$ meets the circle at a point $P$, and by definition

$$P = (\\cos\\theta, \\sin\\theta)$$

For angles between 0° and 90° nothing changes: drop a perpendicular from $P$ to the x-axis and you have a right triangle with hypotenuse 1, adjacent side $\\cos\\theta$ and opposite side $\\sin\\theta$. But now the definition works for any angle, and it gives signs as well as sizes. The cosine is how far $P$ is *across*; the sine is how far it is *up*.

### Signs in the four quadrants
| Quadrant | Angles | sin | cos | tan |
|---|---|---|---|---|
| I | 0° to 90° | + | + | + |
| II | 90° to 180° | + | − | − |
| III | 180° to 270° | − | − | + |
| IV | 270° to 360° | − | + | − |

A mnemonic reads the positive functions anticlockwise from the first quadrant: **A**ll, **S**ine, **T**angent, **C**osine.

### Reference angles
Every angle behaves like an acute **reference angle** — its distance from the nearest part of the x-axis — with a sign fixed by its quadrant. So $\\sin 150° = +\\sin 30° = \\tfrac12$, $\\cos 150° = -\\cos 30° = -\\tfrac{\\sqrt3}{2}$, and $\\cos 240° = -\\cos 60° = -\\tfrac12$.

### Symmetry and repetition
- One more full turn changes nothing: $\\sin(\\theta + 2\\pi) = \\sin\\theta$ and $\\cos(\\theta + 2\\pi) = \\cos\\theta$. The functions are **periodic**, with period $2\\pi$.
- A negative angle turns clockwise, reflecting $P$ in the x-axis: $\\cos(-\\theta) = \\cos\\theta$ (cosine is **even**) and $\\sin(-\\theta) = -\\sin\\theta$ (sine is **odd**).
- $P$ lies on a circle of radius 1, so $x^2 + y^2 = 1$:

$$\\sin^2\\theta + \\cos^2\\theta = 1$$

the most used of all the [[trig-identities|trigonometric identities]].

### The tangent
$\\tan\\theta = \\sin\\theta/\\cos\\theta$ is the slope of the arm $OP$. Extend the arm until it meets the vertical line $x = 1$, which touches the circle at $(1, 0)$: it meets that line at height $\\tan\\theta$. The touching line is a *tangent* line, which is how the function got its name. At 90° and 270° the arm is vertical and never meets the line: there the tangent is undefined.

### Circles and waves
Let the angle grow steadily, $\\theta = \\omega t$, and $P$ moves round the circle at constant speed ([[physics:uniform-circular-motion|uniform circular motion]]). Its height, $\\sin\\omega t$, rises and falls smoothly; plotted against time it is the sine wave of [[trig-graphs]]. The shadow of a steadily turning crank moves in [[physics:simple-harmonic-motion|simple harmonic motion]], and in the complex plane $P$ is the number $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$ ([[eulers-formula]]).

> [!tip] In the simulation, drag the point round the circle and watch the sine and cosine graphs being drawn beside it. Tick **Tangent line** to see why tan θ blows up near 90°.
`,
  ideas: [
    'The point at angle θ on the unit circle is (cos θ, sin θ): cosine is the x-coordinate, sine the y-coordinate.',
    'Signs follow the quadrant (All, Sine, Tangent, Cosine); the size comes from the reference angle.',
    'sin and cos repeat every 2π; cos is even and sin is odd.',
    'sin²θ + cos²θ = 1, and tan θ is the height where the arm meets the tangent line x = 1.'
  ],
  pitfalls: [
    'Sine is always positive — On the unit circle it is the y-coordinate, negative below the x-axis (180° to 360°).',
    'sin(−θ) = sin θ — Reflecting in the x-axis flips the height: sin(−θ) = −sin θ. It is cosine that is unchanged.',
    'tan 90° is very large — It is undefined: cos 90° = 0 and the arm never meets the tangent line.'
  ],
  formulas: [
    {
      name: 'x-coordinate: cosine',
      expr: 'x = cos(theta)', tex: 'x = \\cos\\theta',
      vars: {
        x: { name: 'x-coordinate of P (cosine)', signed: true },
        theta: { name: 'angle from the positive x-axis', q: 'angle', unit: '°', value: 240, min: 0, max: 360 }
      },
      note: 'Solving for θ gives every angle between 0° and 360° with that cosine — usually two.'
    },
    {
      name: 'y-coordinate: sine',
      expr: 'y = sin(theta)', tex: 'y = \\sin\\theta',
      vars: {
        y: { name: 'y-coordinate of P (sine)', signed: true },
        theta: { name: 'angle from the positive x-axis', q: 'angle', unit: '°', value: 240, min: 0, max: 360 }
      }
    },
    {
      name: 'Tangent',
      expr: 'm = tan(theta)', tex: 'm = \\tan\\theta',
      vars: {
        m: { name: 'tan θ (slope of the arm)', signed: true },
        theta: { name: 'angle from the positive x-axis', q: 'angle', unit: '°', value: 240, min: 0, max: 360 }
      }
    }
  ],
  examples: [
    {
      title: 'Every angle with a given sine',
      q: 'Find all angles from 0° to 360° with $\\sin\\theta = -\\tfrac12$.',
      steps: [
        'The reference angle with sine $\\tfrac12$ is 30°.',
        'Sine is negative in quadrants III and IV.',
        'Quadrant III: $180° + 30° = 210°$. Quadrant IV: $360° - 30° = 330°$.'
      ],
      a: '210° and 330°'
    },
    {
      title: 'An angle in the third quadrant',
      q: 'Find $\\cos 240°$, $\\sin 240°$ and $\\tan 240°$ exactly.',
      steps: [
        '240° is in quadrant III, 60° past 180°: the reference angle is 60°.',
        'In quadrant III both coordinates are negative: $\\cos 240° = -\\tfrac12$, $\\sin 240° = -\\tfrac{\\sqrt3}{2}$.',
        '$\\tan 240° = \\dfrac{-\\sqrt3/2}{-1/2} = \\sqrt3$ — positive, as ASTC predicts.'
      ],
      a: '−1/2, −√3/2, √3'
    },
    {
      title: 'A Ferris wheel',
      q: 'A Ferris wheel of radius 20 m has its centre 22 m above the ground and turns once every 10 minutes. A car starts level with the centre, going up. How high is it after 4 minutes?',
      steps: [
        'In 4 minutes the wheel turns $\\tfrac{4}{10} \\times 360° = 144°$.',
        'Height $= 22 + 20\\sin 144° = 22 + 20 \\times 0.588 = 33.8$ m.',
        'In general $h(t) = 22 + 20\\sin(2\\pi t/10)$ — a sinusoid in time.'
      ],
      a: 'About 33.8 m'
    }
  ],
  quiz: [
    { q: '$\\cos 180°$ equals…', choices: ['1', '0', '−1', 'undefined'], a: 2, why: 'At 180° the point is at $(-1, 0)$; its x-coordinate is −1.' },
    { q: 'In which quadrant is the sine positive but the cosine negative?', choices: ['I', 'II', 'III', 'IV'], a: 1, why: 'Up (y > 0) and to the left (x < 0): quadrant II, angles between 90° and 180°.' },
    { q: '$\\sin(-30°)$ equals…', choices: ['$\\tfrac12$', '$-\\tfrac12$', '$\\tfrac{\\sqrt3}{2}$', '$-\\tfrac{\\sqrt3}{2}$'], a: 1, why: 'Sine is odd: $\\sin(-30°) = -\\sin 30° = -\\tfrac12$.' },
    { q: '$\\tan\\theta$ is undefined at $\\theta = 90°$.', a: true, why: '$\\cos 90° = 0$, so $\\sin/\\cos$ has no value; the arm is vertical and never meets the tangent line.' },
    { q: 'Simplify $\\sin^2 x + \\cos^2 x + \\tan x\\cos x$.', answer: '1 + sin(x)', vars: ['x'], why: '$\\sin^2 x + \\cos^2 x = 1$ and $\\tan x\\cos x = \\sin x$.' }
  ],
  applications: [
    'Rotation and circular motion: the position of any point on a wheel, crank or planet.',
    'Waves and alternating currents, which are the height of a point going round a circle.',
    'Computer graphics and robotics, where rotations are written with cos θ and sin θ.'
  ],
  sim: 'gt-unit-circle'
},

{
  id: 'trig-graphs', parent: 'trig-functions', title: 'Graphs of sine and cosine', level: 1,
  short: 'Unrolled from the unit circle, sine and cosine are smooth waves repeating every 2π. Stretching and shifting them — A sin(ωx + φ) + k — describes every steady oscillation.',
  keywords: ['sine wave', 'cosine graph', 'sinusoid', 'amplitude', 'period', 'frequency', 'angular frequency', 'phase', 'phase shift', 'midline', 'tangent graph', 'asymptote', 'oscillation'],
  prereq: ['unit-circle', 'function-transformations', 'angle-measure'],
  related: ['inverse-trig', 'sum-and-difference', 'fourier-series', 'harmonic-oscillator-ode', 'phasors', 'physics:wave-properties', 'physics:alternating-current', 'physics:simple-harmonic-motion'],
  body: `
Let the angle run on and plot the height of the unit-circle point against it: the result is the **sine wave**, the most important curve in science. It starts at 0, climbs to 1 at $\\pi/2$, returns to 0 at $\\pi$, falls to −1 at $3\\pi/2$ and is back at 0 at $2\\pi$ — and then does it all again, forever. The cosine, the across-coordinate, gives the same wave moved a quarter of a cycle to the left:

$$\\cos x = \\sin\\left(x + \\frac{\\pi}{2}\\right)$$

Both are smooth, both stay between −1 and 1, and both repeat every $2\\pi$ — their **period**. The tangent is different: it repeats every $\\pi$, runs from $-\\infty$ to $+\\infty$ within each period, and has vertical asymptotes wherever the cosine is zero, at $x = \\pm\\pi/2, \\pm 3\\pi/2, \\ldots$

### The general sinusoid
Every smooth, steady oscillation is a stretched and shifted sine ([[function-transformations|transforming graphs]]):

$$y = A\\sin(\\omega x + \\varphi) + k$$

| Parameter | What it does |
|---|---|
| amplitude $\\lvert A\\rvert$ | height of the peaks above the midline; a negative $A$ flips the wave |
| angular frequency $\\omega$ | squeezes the wave: the period is $T = 2\\pi/\\omega$ |
| phase $\\varphi$ | slides the wave sideways, by $-\\varphi/\\omega$ |
| offset $k$ | raises or lowers the midline |

The wave swings between $k - |A|$ and $k + |A|$. Its **frequency** $f = 1/T = \\omega/2\\pi$ counts cycles per unit of $x$; in physics $x$ is usually time, $\\omega$ is in rad/s and $f$ in hertz.

### Reading a sinusoid
Take $y = 3\\sin(2x - \\pi/2) + 1$. The amplitude is 3, the period is $2\\pi/2 = \\pi$, and the wave swings between −2 and 4. For the shift, factor $\\omega$ out of the bracket first: $\\sin(2x - \\pi/2) = \\sin 2(x - \\pi/4)$, so the wave is moved $\\pi/4$ to the right — not $\\pi/2$.

### Sinusoids everywhere
- **Oscillations.** A mass on a spring moves as $x = A\\cos(\\omega t + \\varphi)$ ([[physics:simple-harmonic-motion|simple harmonic motion]]), the solution of the [[harmonic-oscillator-ode|harmonic oscillator equation]].
- **Waves.** A wave on a string is $y = A\\sin(kx - \\omega t)$, a sinusoid in space and in time at once ([[physics:wave-properties|wave properties]]).
- **Electricity.** European mains voltage is a 50 Hz sinusoid with a peak of 325 V, $v = 325\\sin(100\\pi t)$ volts; its root-mean-square value is the familiar 230 V ([[physics:alternating-current|alternating current]]).
- **Nature's cycles.** Tides, the length of the day through the year and seasonal temperatures are all roughly sinusoidal.

Add two sinusoids of the same frequency and the result is another sinusoid ([[phasors]]); add different frequencies and you get beats and richer shapes. Conversely, almost any repeating signal can be built from sinusoids — the idea of the [[fourier-series|Fourier series]].
`,
  ideas: [
    'sin x and cos x are waves of period 2π between −1 and 1; cos x is sin x shifted left by π/2.',
    'y = A sin(ωx + φ) + k: amplitude |A|, period 2π/ω, shift −φ/ω, midline k.',
    'Frequency f = 1/T = ω/2π counts cycles per unit time.',
    'tan x has period π and vertical asymptotes where cos x = 0.'
  ],
  pitfalls: [
    'The shift of sin(2x − π/2) is π/2 — Factor out ω first: sin 2(x − π/4) is shifted by π/4.',
    'A bigger ω means a longer wave — ω squeezes the graph: the period 2π/ω gets shorter as ω grows.',
    'Amplitude is the distance from peak to trough — That is twice the amplitude; the amplitude is measured from the midline.'
  ],
  formulas: [
    {
      name: 'A sinusoid in time',
      expr: 'y = A*sin(omega*t + phi) + k', tex: 'y = A\\sin(\\omega t + \\varphi) + k', solveFor: 'y',
      vars: {
        y: { name: 'value at time t', signed: true },
        A: { name: 'amplitude', value: 2 },
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 3 },
        t: { name: 'time', q: 'time', unit: 's', value: 0.2 },
        phi: { name: 'phase', q: 'angle', unit: 'rad', value: 0.3, min: -3.14159, max: 3.14159, signed: true, tex: '\\varphi' },
        k: { name: 'midline (offset)', value: 1, signed: true }
      },
      note: 'Solving for $t$ gives the first time the wave reaches a value (the principal one); the wave passes it again every period.',
      practice: { unknowns: ['y', 'A'] }
    },
    {
      name: 'Period from angular frequency',
      expr: 'T = 2*pi/omega', tex: 'T = \\frac{2\\pi}{\\omega}',
      vars: {
        T: { name: 'period', q: 'time', unit: 'ms' },
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 314.159 }
      },
      stories: { T: 'A signal is $\\sin(\\omega t)$ with ω = {omega}. How long is one cycle?' }
    },
    {
      name: 'Frequency from angular frequency',
      expr: 'f = omega/(2*pi)', tex: 'f = \\frac{\\omega}{2\\pi}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'Hz' },
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 314.159 }
      }
    }
  ],
  examples: [
    {
      title: 'Reading the parameters',
      q: 'Describe the graph of $y = 3\\sin(2x - \\pi/2) + 1$.',
      steps: [
        'Amplitude $|A| = 3$; midline $y = 1$; so it swings between $-2$ and $4$.',
        'Period $2\\pi/2 = \\pi$.',
        'Shift: $2x - \\pi/2 = 2(x - \\pi/4)$, so the graph of $\\sin 2x$ is moved $\\pi/4$ to the right. It crosses its midline going up at $x = \\pi/4$.'
      ],
      a: 'Amplitude 3, period π, shifted π/4 right, range from −2 to 4'
    },
    {
      title: 'Mains voltage',
      q: 'The mains voltage is $v = 325\\sin(100\\pi t)$ volts. What are its frequency and period, and what is the voltage 2.5 ms after a zero crossing?',
      steps: [
        '$\\omega = 100\\pi$ rad/s, so $f = \\omega/2\\pi = 50$ Hz and $T = 1/f = 20$ ms.',
        'At $t = 0.0025$ s the phase is $100\\pi \\times 0.0025 = \\pi/4$.',
        '$v = 325\\sin(\\pi/4) = 325 \\times 0.707 = 230$ V.'
      ],
      a: '50 Hz, 20 ms; 230 V after 2.5 ms'
    },
    {
      title: 'A tide model',
      q: 'High water is 5.2 m and low water 1.0 m, 6.2 h later. Model the depth as a cosine starting at high water, and estimate the depth 3 hours after high water.',
      steps: [
        'Midline $(5.2 + 1.0)/2 = 3.1$ m; amplitude $(5.2 - 1.0)/2 = 2.1$ m; period $2 \\times 6.2 = 12.4$ h.',
        '$d(t) = 3.1 + 2.1\\cos(2\\pi t/12.4)$.',
        '$d(3) = 3.1 + 2.1\\cos(1.520) = 3.1 + 2.1 \\times 0.051 = 3.2$ m — close to the midline, since 3 h is almost a quarter period.'
      ],
      a: 'd(t) = 3.1 + 2.1 cos(2πt/12.4); about 3.2 m after 3 h'
    }
  ],
  quiz: [
    { q: 'The period of $\\sin 3x$ is…', choices: ['$3\\pi$', '$2\\pi/3$', '$6\\pi$', '$\\pi/3$'], a: 1, why: '$T = 2\\pi/\\omega = 2\\pi/3$: the wave repeats three times as often as $\\sin x$.' },
    { q: 'The amplitude of $y = -4\\cos x + 1$ is…', choices: ['−4', '4', '5', '3'], a: 1, why: 'Amplitude is $|A| = 4$. The minus sign flips the wave; the $+1$ moves its midline.' },
    { q: 'The graph of $\\cos x$ is the graph of $\\sin x$…', choices: ['shifted left by $\\pi/2$', 'shifted right by $\\pi/2$', 'shifted by $\\pi$', 'reflected in the x-axis'], a: 0,
      why: '$\\cos x = \\sin(x + \\pi/2)$: the cosine reaches each value a quarter period earlier.' },
    { q: 'The range of $y = 2\\sin x - 1$ is…', choices: ['from −1 to 1', 'from −2 to 2', 'from −3 to 1', 'from −1 to 3'], a: 2, why: 'The midline is −1 and the amplitude 2: from $-1 - 2 = -3$ to $-1 + 2 = 1$.' },
    { q: 'Write a sine wave of amplitude 5 and period $\\pi$ that passes through the origin going up.', answer: '5*sin(2x)', vars: ['x'], why: 'Period $\\pi$ needs $\\omega = 2\\pi/\\pi = 2$; amplitude 5, no shift: $y = 5\\sin 2x$.' }
  ],
  applications: [
    'Alternating current and voltage, and radio signals.',
    'Sound, light and water waves.',
    'Vibrations of structures and machines, and any periodic process such as tides and seasons.'
  ],
  sim: 'gt-sinusoid'
},

{
  id: 'inverse-trig', parent: 'trig-functions', title: 'Inverse trigonometric functions', level: 2,
  short: 'arcsin, arccos and arctan run the trigonometric functions backwards: given a ratio, find an angle. Because sine and cosine repeat, each inverse returns one principal angle and you must find the others yourself.',
  keywords: ['arcsin', 'arccos', 'arctan', 'inverse sine', 'sin^-1', 'principal value', 'range', 'atan2', 'solving trigonometric equations', 'general solution', 'critical angle', 'Mach cone'],
  prereq: ['inverse-functions', 'unit-circle', 'trig-graphs'],
  related: ['right-triangle-trig', 'derivatives-of-functions', 'polar-coordinates', 'physics:refraction', 'physics:total-internal-reflection', 'physics:shock-waves'],
  body: `
The trigonometric functions turn an angle into a ratio. Often the question runs the other way: a ramp rises 1 m in 12 m — what is its angle? Light is bent until $\\sin\\theta = 0.42$ — what is $\\theta$? The **inverse trigonometric functions** answer it:

$$\\theta = \\arcsin x \\iff \\sin\\theta = x, \\qquad \\theta = \\arccos x \\iff \\cos\\theta = x, \\qquad \\theta = \\arctan x \\iff \\tan\\theta = x$$

On calculators they are written $\\sin^{-1}$, $\\cos^{-1}$ and $\\tan^{-1}$. That $-1$ means "inverse function", *not* a power: $\\sin^{-1}x$ is not $1/\\sin x$ (which is $\\csc x$).

### One answer out of infinitely many
A function can only be run backwards if it never takes the same value twice ([[inverse-functions]]), and the sine takes every value between −1 and 1 infinitely often: $\\sin 30° = \\sin 150° = \\sin 390° = \\tfrac12$. So each inverse picks one **principal value**, from a fixed range on which the function climbs or falls without repeating:

| Function | Accepts | Returns |
|---|---|---|
| arcsin | −1 to 1 | −90° to 90° |
| arccos | −1 to 1 | 0° to 180° |
| arctan | any number | between −90° and 90° |

The calculator's answer is correct, but it may not be the one you want. The others come from the [[unit-circle]]:
- $\\sin\\theta = s$: $\\;\\theta = \\arcsin s$ or $180° - \\arcsin s$, plus any multiple of 360°.
- $\\cos\\theta = c$: $\\;\\theta = \\pm\\arccos c$, plus any multiple of 360°.
- $\\tan\\theta = t$: $\\;\\theta = \\arctan t$ plus any multiple of 180°.

For a direction in the plane, $\\operatorname{atan2}(y, x)$ looks at the signs of both coordinates and returns the angle in the right quadrant, between −180° and 180° ([[polar-coordinates]]).

### Undoing and redoing
$\\sin(\\arcsin x) = x$ for every $x$ from −1 to 1. But $\\arcsin(\\sin\\theta) = \\theta$ only when $\\theta$ is already in the principal range: $\\arcsin(\\sin 150°) = \\arcsin\\tfrac12 = 30°$. Compositions like $\\cos(\\arcsin x)$ are found by drawing the triangle: the angle whose sine is $x$ sits in a right triangle with opposite side $x$ and hypotenuse 1, so its cosine is $\\sqrt{1 - x^2}$.

### In calculus
The inverse functions have strikingly simple [[derivatives-of-functions|derivatives]]:

$$\\frac{d}{dx}\\arcsin x = \\frac{1}{\\sqrt{1 - x^2}}, \\qquad \\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^2}$$

which is why $\\pi$ turns up in integrals that seem to have nothing to do with circles: $\\int_{-\\infty}^{\\infty} \\frac{dx}{1 + x^2} = \\pi$.

### In physics
- Light entering water ($n = 1.33$) at 50° to the normal is bent to $\\arcsin(\\sin 50°/1.33) = 35.2°$ ([[physics:refraction|Snell's law]]); the critical angle for total internal reflection is $\\arcsin(n_2/n_1)$ ([[physics:total-internal-reflection|total internal reflection]]).
- The cone of a sonic boom has a half-angle of $\\arcsin(1/M)$ at Mach number $M$ ([[physics:shock-waves|shock waves]]).
- The phase angle of an AC circuit is $\\arctan(X/R)$ ([[physics:rlc-impedance|impedance]]).
`,
  ideas: [
    'arcsin, arccos and arctan return an angle from a ratio; sin⁻¹ means the inverse function, not 1/sin.',
    'Each returns a principal value: arcsin and arctan between −90° and 90°, arccos between 0° and 180°.',
    'Other solutions: 180° − arcsin s for sine, −arccos c for cosine, plus whole turns (half turns for tangent).',
    'arcsin(sin θ) = θ only for θ in the principal range.'
  ],
  pitfalls: [
    'sin⁻¹ x = 1/sin x — The −1 denotes the inverse function. 1/sin x is the cosecant, csc x.',
    'The calculator gives every solution — It gives one. sin θ = 0.5 also holds at 150°, 390°, −210° and so on.',
    'arctan(y/x) gives the direction of (x, y) — Only for x > 0. For points on the left add 180°, or use atan2(y, x).'
  ],
  formulas: [
    {
      name: 'Angle of a slope from rise and run',
      expr: 'theta = atan(rise/run)', tex: '\\theta = \\arctan\\frac{\\mathrm{rise}}{\\mathrm{run}}',
      vars: {
        theta: { name: 'angle to the horizontal', q: 'angle', unit: '°', min: 0, max: 90 },
        rise: { name: 'vertical rise', q: 'length', unit: 'm', value: 1 },
        run: { name: 'horizontal run', q: 'length', unit: 'm', value: 12 }
      },
      stories: { theta: 'A ramp rises {rise} over a horizontal distance of {run}. At what angle is it inclined?' }
    },
    {
      name: 'Critical angle for total internal reflection',
      expr: 'thc = asin(n2/n1)', tex: '\\theta_c = \\arcsin\\frac{n_2}{n_1}',
      vars: {
        thc: { name: 'critical angle', q: 'angle', unit: '°', tex: '\\theta_c', min: 0, max: 90 },
        n2: { name: 'refractive index outside (smaller)', value: 1.00 },
        n1: { name: 'refractive index inside (larger)', value: 1.50 }
      },
      note: 'Light inside the denser medium hitting the surface at more than $\\theta_c$ from the normal is totally reflected.',
      stories: { thc: 'What is the critical angle for light inside glass of index {n1} meeting air of index {n2}?' }
    },
    {
      name: 'Half-angle of a Mach cone',
      expr: 'mu = asin(1/M)', tex: '\\mu = \\arcsin\\frac{1}{M}',
      vars: {
        mu: { name: 'half-angle of the cone', q: 'angle', unit: '°', min: 0, max: 90 },
        M: { name: 'Mach number (speed ÷ speed of sound)', value: 2 }
      },
      stories: { mu: 'A jet flies at Mach {M}. What is the half-angle of the cone of its sonic boom?', M: 'The shock cone behind a bullet has a half-angle of {mu}. What is its Mach number?' }
    }
  ],
  examples: [
    {
      title: 'Both solutions',
      q: 'Solve $\\sin\\theta = 0.6$ for $0° \\le \\theta < 360°$.',
      steps: [
        'Calculator: $\\arcsin 0.6 = 36.87°$.',
        'Sine is also positive in quadrant II: $180° - 36.87° = 143.13°$.',
        'Adding 360° takes both out of range, so there are exactly two.'
      ],
      a: '36.87° and 143.13°'
    },
    {
      title: 'A cosine equation',
      q: 'Solve $2\\cos\\theta + 1 = 0$ for $0° \\le \\theta < 360°$.',
      steps: [
        '$\\cos\\theta = -\\tfrac12$, so $\\arccos(-\\tfrac12) = 120°$.',
        'The other solution is $-120°$, which is $360° - 120° = 240°$ in the range.'
      ],
      a: '120° and 240°'
    },
    {
      title: 'Undoing a cosine',
      q: 'Evaluate $\\arccos(\\cos(-50°))$.',
      steps: [
        '$\\cos(-50°) = \\cos 50° = 0.643$, because cosine is even.',
        'arccos returns an angle between 0° and 180°: $\\arccos 0.643 = 50°$, not −50°.'
      ],
      a: '50°'
    }
  ],
  quiz: [
    { q: '$\\arcsin\\tfrac12$ equals…', choices: ['30°', '60°', '150°', '0.5°'], a: 0, why: 'The principal angle between −90° and 90° whose sine is ½.' },
    { q: 'The principal value of $\\arctan(-1)$ is…', choices: ['135°', '−45°', '315°', '45°'], a: 1, why: 'arctan returns angles between −90° and 90°; tan(−45°) = −1. 135° and 315° also have tangent −1 but are outside the range.' },
    { q: 'How many solutions does $\\sin\\theta = 0.3$ have with $0° \\le \\theta < 360°$?', choices: ['1', '2', '3', '4'], a: 1, why: 'One in quadrant I (17.5°) and one in quadrant II (162.5°).' },
    { q: '$\\sin^{-1}x$ means $1/\\sin x$.', a: false, why: 'It is the inverse function arcsin x. The reciprocal $1/\\sin x$ is $\\csc x$.' },
    { q: 'Simplify $\\cos(\\arcsin x)$ for $-1 \\le x \\le 1$.', answer: 'sqrt(1 - x^2)', vars: ['x'],
      why: 'The angle has sine $x$ and lies between −90° and 90°, where cosine is not negative: $\\cos = \\sqrt{1 - \\sin^2} = \\sqrt{1 - x^2}$.' }
  ],
  applications: [
    'Angles from measured lengths: slopes, ramps, roof pitches, the elevation of a satellite dish.',
    'Optics: refraction angles and critical angles in fibres and prisms.',
    'Robotics and graphics, where atan2 converts a direction into an angle.'
  ],
  sim: { id: 'gt-unit-circle', params: { partners: true } }
}

);
