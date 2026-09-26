/* HYPER-MATH · content/plane-geometry.js — angles, triangles, circles, polygons and area:
 * the flat geometry that everything else in the branch is built on. */
Hyper.add(

{
  id: 'angles', parent: 'plane-geometry', title: 'Angles', level: 1,
  short: 'An angle measures how far one direction is turned from another. A full turn is 360°, a straight line 180°, a right angle 90°.',
  keywords: ['angle', 'degree', 'right angle', 'acute', 'obtuse', 'reflex', 'straight angle', 'complementary', 'supplementary', 'vertically opposite', 'parallel lines', 'transversal', 'alternate angles', 'corresponding angles', 'bearing', 'minutes of arc', 'protractor'],
  prereq: ['number-systems', 'fractions-ratios'],
  related: ['angle-measure', 'triangles', 'polygons', 'physics:angular-kinematics'],
  body: `
Open a door, turn a key, sweep the minute hand of a clock round: each is a **turn**, and an **angle** measures how much of a turn separates one direction from another. Two rays leaving the same point — the **vertex** — form an angle. The lengths of the rays do not matter at all; only how far apart they point.

### Degrees
Divide a full turn into 360 equal parts and each part is a **degree**. The number comes from Babylonian astronomers, who counted in sixties, and it has survived because 360 divides evenly by 2, 3, 4, 5, 6, 8, 9, 10, 12 and more, so halves, thirds, quarters and sixths of a turn are all whole numbers of degrees. For finer work a degree is split into 60 **minutes of arc** (′) and a minute into 60 **seconds of arc** (″). The full Moon spans about 31′; a telescope that resolves 1″ could separate two car headlights 300 km away.

| Name | Size |
|---|---|
| acute | more than 0°, less than 90° |
| right | exactly 90°, a quarter turn (marked with a small square) |
| obtuse | between 90° and 180° |
| straight | exactly 180°, a half turn: the two rays form one line |
| reflex | between 180° and 360° |

### Angles that come in pairs
- Angles that sit together on a straight line add up to 180°; two such angles are **supplementary**.
- Two angles that together make a right angle are **complementary**: 90° in total.
- All the angles round a point add up to 360°.
- Where two lines cross, the angles facing each other — **vertically opposite** angles — are equal, because each is supplementary to the same neighbour.

### Parallel lines
A line crossing two parallel lines (a **transversal**) makes the same pattern of angles at both crossings. **Corresponding** angles, in matching positions, are equal; **alternate** angles, on opposite sides of the transversal between the parallels (a "Z" shape), are equal; and **co-interior** angles, on the same side between the parallels (a "C" shape), add up to 180°. These three facts are what make the angles of every [[triangles|triangle]] add up to exactly 180°.

### Where angles appear
Navigators give directions as **bearings**, measured clockwise from north and written with three figures: east is 090°, south-west 225°. In optics angles are measured from the **normal**, the line perpendicular to a surface, and a mirror sends light off at the angle it arrived ([[physics:reflection|law of reflection]]). A ramp is described by its angle to the horizontal ([[physics:inclined-plane|inclined plane]]), and anything that spins by the angle it has turned through ([[physics:angular-kinematics|angular kinematics]]) — there usually in [[angle-measure|radians]], the natural unit for calculus.

> [!tip] An angle is an amount of turn. Extend the arms of a 30° angle to the edge of the universe and it is still 30°.
`,
  ideas: [
    'An angle measures the amount of turn between two directions; the length of its arms is irrelevant.',
    'A full turn is 360°, a straight line 180°, a right angle 90°; a degree splits into 60 minutes and a minute into 60 seconds.',
    'Angles on a line add to 180°, angles round a point to 360°, and vertically opposite angles are equal.',
    'With parallel lines, corresponding and alternate angles are equal and co-interior angles add to 180°.'
  ],
  pitfalls: [
    'Longer arms make a bigger angle — The angle is the turn between the two directions. A slice cut at 30° from a small pizza and from a large one has the same angle.',
    '30.5° is 30 degrees 50 minutes — Minutes are sixtieths of a degree, so 0.5° is 30′ and 30.5° = 30°30′.',
    'Z-shaped angles are always equal — Only when the two lines the transversal crosses are parallel. If they converge, alternate angles differ.'
  ],
  formulas: [
    {
      name: 'Supplementary angles (angles on a straight line)',
      expr: 'alpha + beta = pi', tex: '\\alpha + \\beta = 180^\\circ',
      vars: {
        alpha: { name: 'one angle on the line', q: 'angle', unit: '°', value: 65, min: 0, max: 180 },
        beta: { name: 'the angle beside it', q: 'angle', unit: '°', min: 0, max: 180 }
      },
      solveFor: 'beta',
      stories: { beta: 'A ladder leans so that it makes {alpha} with the ground on one side. What angle does it make with the ground on the other side?' }
    },
    {
      name: 'Degrees, minutes and seconds to decimal degrees',
      expr: 'D = d + m/60 + s/3600', tex: '\\theta = d + \\frac{m}{60} + \\frac{s}{3600}',
      vars: {
        D: { name: 'angle in decimal degrees', tex: '\\theta' },
        d: { name: 'whole degrees', value: 48 },
        m: { name: 'minutes of arc', value: 51, min: 0, max: 60 },
        s: { name: 'seconds of arc', value: 24, min: 0, max: 60 }
      },
      note: 'Map coordinates are often written as 48°51′24″ (roughly the latitude of Paris) and entered into software as 48.8567°.',
      practice: { unknowns: ['D'] }
    }
  ],
  examples: [
    {
      title: 'The angle between the hands of a clock',
      q: 'What is the angle between the hour hand and the minute hand of a clock at 3:40?',
      steps: [
        'The minute hand goes round 360° in 60 minutes, 6° per minute. At 40 minutes past it points $40 \\times 6 = 240°$ clockwise from 12.',
        'The hour hand goes round 360° in 12 hours: 30° per hour and 0.5° per minute. At 3:40 it points $3 \\times 30 + 40 \\times 0.5 = 110°$ from 12.',
        'The angle between them is $240° - 110° = 130°$. Measured the long way round it is the reflex angle $360° - 130° = 230°$.'
      ],
      a: '130° (or 230° the long way round)'
    },
    {
      title: 'Chasing angles across parallel lines',
      q: 'A transversal crosses two parallel lines. At the upper crossing one of the four angles is 72°. Find all eight angles.',
      steps: [
        'At the upper crossing, the angle beside 72° on the straight line is $180° - 72° = 108°$.',
        'Vertically opposite angles are equal, so that crossing has two angles of 72° and two of 108°.',
        'Corresponding angles are equal, so the lower crossing repeats the same pattern.'
      ],
      a: 'Four angles of 72° and four of 108°.'
    }
  ],
  quiz: [
    { q: 'Two angles are supplementary and one is four times the other. What is the smaller one?', choices: ['18°', '36°', '45°', '144°'], a: 1,
      why: 'Supplementary angles add to 180°: $x + 4x = 180°$, so $x = 36°$ (and the other is 144°). 18° would be the answer for complementary angles.' },
    { q: 'Where two straight lines cross, vertically opposite angles are always equal.', a: true,
      why: 'Each of them is supplementary to the same angle between them, so both equal 180° minus that angle.' },
    { q: 'A transversal crosses two parallel lines. Two co-interior angles (same side, between the lines) are…', choices: ['equal', 'supplementary: they add to 180°', 'complementary: they add to 90°', 'unrelated'], a: 1,
      why: 'One co-interior angle is the neighbour, on a straight line, of an angle equal to the other one — so together they make 180°.' },
    { q: 'How many seconds of arc are there in one degree?', choices: ['60', '360', '3600', '100'], a: 2, why: '60 minutes per degree and 60 seconds per minute: $60 \\times 60 = 3600$.' },
    { q: 'A ship sails on a bearing of 135°. Which way is it heading?', choices: ['North-east', 'South-east', 'South-west', 'North-west'], a: 1,
      why: 'Bearings are measured clockwise from north: 90° is east and 180° is south, so 135° is halfway between them, south-east.' }
  ],
  applications: [
    'Navigation, where bearings are measured clockwise from north.',
    'Carpentry and machining: two 45° mitre cuts make a 90° corner.',
    'Optics, where the angles of incidence, reflection and refraction are measured from the normal.',
    'Astronomy, where sizes and separations on the sky are angles in degrees, minutes and seconds of arc.'
  ],
  history: 'Babylonian astronomers divided the circle into 360 parts and wrote fractions in base sixty; that is why a degree still has 60 minutes and a minute 60 seconds.'
},

{
  id: 'triangles', parent: 'plane-geometry', title: 'Triangles', level: 1,
  short: 'Three straight sides joined at three corners. The angles always add up to 180°, and fixing the three sides fixes the shape — which is why engineers build with triangles.',
  keywords: ['triangle', 'angle sum', '180 degrees', 'equilateral', 'isosceles', 'scalene', 'right triangle', 'acute', 'obtuse', 'triangle inequality', 'exterior angle', 'median', 'centroid', 'truss', 'rigidity'],
  prereq: ['angles', 'linear-equations'],
  related: ['pythagorean-theorem', 'similar-triangles', 'law-of-sines', 'law-of-cosines', 'area', 'physics:static-equilibrium'],
  body: `
Three points not on one line, joined by straight segments, make a **triangle** — the simplest polygon, and the piece every other polygon can be cut into. Label the corners $A$, $B$, $C$ and the sides opposite them $a$, $b$, $c$: side $a$ faces angle $A$, and so on. Every triangle formula uses that labelling.

### Kinds of triangle
By sides: **equilateral** (all three equal, every angle 60°), **isosceles** (two sides equal, and the two angles opposite them equal) and **scalene** (all different). By angles: **acute** (all under 90°), **right** (one exactly 90°) and **obtuse** (one over 90°).

### The angles add up to 180°
Draw a line through $C$ parallel to side $AB$. The two angles it makes with $CA$ and $CB$ are alternate angles to $A$ and $B$ (see [[angles]]), and together with $C$ they fill a straight line. Therefore, for every triangle however it is drawn,

$$A + B + C = 180°$$

Two consequences: an **exterior angle** (between one side and the extension of the next) equals the sum of the two interior angles opposite it, and no triangle can have more than one angle of 90° or more.

### Which lengths are possible?
Each side must be shorter than the other two together — the **triangle inequality**. Rods of 3, 4 and 8 cm cannot be joined into a triangle, since $3 + 4 < 8$. If two sides are 7 and 12, the third must be longer than $12 - 7 = 5$ and shorter than $12 + 7 = 19$. The longest side always faces the largest angle, and the shortest side the smallest.

### Special points
The three **medians** (each from a corner to the midpoint of the opposite side) meet at the **centroid**, two-thirds of the way along each. A cardboard triangle balances on it: it is the [[physics:center-of-mass|centre of mass]] of a uniform triangular plate. The perpendicular bisectors of the three sides meet at the **circumcentre**, the centre of the circle through all three corners, whose diameter turns up in the [[law-of-sines|law of sines]].

### Why engineers build with triangles
Fix the three side lengths and the angles are fixed too: three bars bolted at their ends cannot be pushed out of shape. A square frame, by contrast, folds flat into a rhombus under a sideways push. That rigidity is why cranes, roof trusses, bridges, electricity pylons and bicycle frames are made of triangles, and why a single diagonal brace stiffens a garden gate — the bars then carry only tension or compression ([[physics:static-equilibrium|static equilibrium]]).

Finding the unknown sides and angles of a triangle is called **solving** it. The tools are [[right-triangle-trig|right-triangle trigonometry]], the [[law-of-sines|law of sines]] and the [[law-of-cosines|law of cosines]].

> [!tip] In the simulation, drag the corners anywhere. The three angles change, but their sum never leaves 180°.
`,
  ideas: [
    'The angles of any triangle add up to 180°; an exterior angle equals the sum of the two opposite interior angles.',
    'Each side is shorter than the other two together (triangle inequality).',
    'The longest side is opposite the largest angle.',
    'Three side lengths fix a triangle completely, which makes triangular frames rigid.'
  ],
  pitfalls: [
    'Any three lengths make a triangle — Only if each is less than the sum of the other two. 2, 3 and 6 cannot close up.',
    'A triangle with a 100° angle could also have a right angle — The other two angles share only 80°, so both are acute.',
    'The height of a triangle is one of its sides — Only in a right triangle. In general the height is the perpendicular distance from a corner to the line of the opposite side, and for an obtuse triangle it can fall outside the triangle.'
  ],
  formulas: [
    {
      name: 'The third angle',
      expr: 'C = pi - A - B', tex: 'C = 180^\\circ - A - B',
      vars: {
        C: { name: 'third angle', q: 'angle', unit: '°', min: 0, max: 180 },
        A: { name: 'first angle', q: 'angle', unit: '°', value: 50, min: 0, max: 180 },
        B: { name: 'second angle', q: 'angle', unit: '°', value: 60, min: 0, max: 180 }
      },
      stories: { C: 'Two angles of a triangular sail are {A} and {B}. What is the third?' }
    },
    {
      name: 'Exterior angle',
      expr: 'D = A + B', tex: '\\delta = A + B',
      vars: {
        D: { name: 'exterior angle at C', q: 'angle', unit: '°', tex: '\\delta', min: 0, max: 180 },
        A: { name: 'interior angle at A', q: 'angle', unit: '°', value: 45, min: 0, max: 180 },
        B: { name: 'interior angle at B', q: 'angle', unit: '°', value: 70, min: 0, max: 180 }
      },
      note: 'The exterior angle at one corner equals the sum of the interior angles at the other two.'
    }
  ],
  examples: [
    {
      title: 'A roof truss',
      q: 'A roof truss is an isosceles triangle whose apex angle is 110°. What angle does each rafter make with the horizontal tie-beam?',
      steps: [
        'In an isosceles triangle the two base angles are equal; call each $x$.',
        'Angle sum: $x + x + 110° = 180°$, so $2x = 70°$.',
        '$x = 35°$.'
      ],
      a: '35°'
    },
    {
      title: 'Will it close?',
      q: 'Can you make a triangle from sticks 5 cm, 9 cm and 3 cm long? If two sticks are 7 cm and 12 cm, what lengths can the third have?',
      steps: [
        'Test the longest side against the other two: $5 + 3 = 8 < 9$. The two short sticks cannot reach each other: no triangle.',
        'For 7 and 12, the third side $x$ needs $x < 7 + 12 = 19$ and $x + 7 > 12$, that is $x > 5$.',
        'So $5 < x < 19$ cm; at exactly 5 or 19 the "triangle" is flattened into a line.'
      ],
      a: 'No triangle from 5, 9, 3; the third side must be between 5 cm and 19 cm.'
    }
  ],
  quiz: [
    { q: 'A triangle can have two obtuse angles.', a: false,
      why: 'Two angles over 90° already add up to more than 180°, leaving nothing for the third angle.' },
    { q: 'Two sides of a triangle are 4 cm and 10 cm. Which could be the third side?', choices: ['5 cm', '6 cm', '11 cm', '15 cm'], a: 2,
      why: 'The third side must be longer than $10 - 4 = 6$ cm and shorter than $10 + 4 = 14$ cm. Exactly 6 cm would flatten the triangle into a line.' },
    { q: 'The exterior angle at $C$ is 130° and angle $A$ is 55°. What is angle $B$?', choices: ['50°', '65°', '75°', '125°'], a: 2,
      why: 'The exterior angle equals $A + B$, so $B = 130° - 55° = 75°$. Check: $C = 180° - 130° = 50°$, and $55 + 75 + 50 = 180$.' },
    { q: 'Why are cranes and bridges built from triangles rather than rectangles?', choices: ['Triangles use less metal', 'Three fixed side lengths fix the angles, so a triangle cannot be pushed out of shape', 'Triangles enclose more area', 'Rectangles cannot carry tension'], a: 1,
      why: 'A rectangle of hinged bars can lean over into a parallelogram without any bar changing length. A triangle cannot change shape unless a bar stretches or buckles.' },
    { q: 'In triangle $ABC$, $a = 5$, $b = 7$ and $c = 9$. Which angle is the largest?', choices: ['$A$', '$B$', '$C$', 'They are equal'], a: 2,
      why: 'The largest angle is opposite the longest side, and $c$ is the longest.' }
  ],
  applications: [
    'Trusses in roofs, bridges, cranes and pylons, which stay rigid because triangles cannot deform without a member changing length.',
    'Triangulation in surveying and navigation: two angles and a known baseline locate a distant point.',
    'Computer graphics, where every curved surface on screen is drawn as a mesh of small triangles.'
  ],
  sim: 'gt-triangle'
},

{
  id: 'pythagorean-theorem', parent: 'plane-geometry', title: 'The Pythagorean theorem', level: 1,
  short: 'In a right triangle the square on the hypotenuse equals the sum of the squares on the other two sides: a² + b² = c².',
  keywords: ['Pythagoras', 'Pythagorean theorem', 'hypotenuse', 'right triangle', 'a^2 + b^2 = c^2', 'Pythagorean triple', '3-4-5', 'diagonal', 'distance', 'converse'],
  prereq: ['triangles', 'area', 'exponents'],
  related: ['coordinate-geometry', 'law-of-cosines', 'trig-identities', 'right-triangle-trig', 'vectors', 'physics:position-displacement'],
  body: `
Draw a right triangle and build a square outward on each of its sides. The two squares on the short sides (the **legs** $a$ and $b$) together have exactly the area of the square on the longest side, the **hypotenuse** $c$, which faces the right angle:

$$a^2 + b^2 = c^2$$

A right triangle with legs 3 and 4 has a hypotenuse of 5, since $9 + 16 = 25$. No theorem is used more often in science and engineering: whenever two quantities are at right angles — distances east and north, horizontal and vertical velocities, resistance and reactance — their combined size is the square root of the sum of their squares.

### Why it is true
Take a square of side $a + b$ and put four copies of the triangle in its corners, hypotenuses facing inward. The uncovered hole in the middle is a tilted square of side $c$ (each of its corners is 180° minus the two acute angles of the triangle, and those add to 90°), so the empty area is $c^2$. Now slide the same four triangles together into two $a \\times b$ rectangles in opposite corners. The uncovered area is now two squares, $a^2$ and $b^2$. Nothing was added or removed, so the empty areas are equal: $a^2 + b^2 = c^2$. The simulation performs this rearrangement for you.

### The converse: testing for a right angle
If three lengths satisfy $a^2 + b^2 = c^2$, then the angle between $a$ and $b$ is a right angle. Builders set out square corners with a tape: 3 m along one wall, 4 m along the other, and move the second wall until the diagonal is exactly 5 m. More generally, compare $c^2$ (the longest side squared) with $a^2 + b^2$: if it is bigger the triangle is **obtuse**, if smaller it is **acute** — the [[law-of-cosines|law of cosines]] makes this exact.

### Whole-number triples
Sets such as (3, 4, 5), (5, 12, 13), (8, 15, 17) and (7, 24, 25) are **Pythagorean triples**. Every whole number $m > n$ gives one: $(m^2 - n^2,\\ 2mn,\\ m^2 + n^2)$. For $m = 2$, $n = 1$ that is (3, 4, 5); for $m = 3$, $n = 2$ it is (5, 12, 13).

### Beyond the flat triangle
- **Distance between two points:** the legs are the differences in the coordinates, $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$ ([[coordinate-geometry]]).
- **Three dimensions:** the diagonal of a box is $\\sqrt{a^2 + b^2 + c^2}$ — the theorem used twice, first across the floor and then up to the far corner.
- **Vectors:** the length of $(x, y, z)$ is $\\sqrt{x^2 + y^2 + z^2}$ ([[vectors]]), which is how physicists find the size of a [[physics:position-displacement|displacement]] or a resultant velocity.
- **Trigonometry:** on the unit circle the theorem becomes $\\sin^2\\theta + \\cos^2\\theta = 1$ ([[trig-identities]]).

> [!fact] A "55-inch" television measures 55 inches along its diagonal. A 16 : 9 screen of that size is $55 \\times 16/\\sqrt{16^2 + 9^2} \\approx 47.9$ inches wide and $55 \\times 9/\\sqrt{337} \\approx 27.0$ inches tall.
`,
  ideas: [
    'In a right triangle, a² + b² = c², where c is the side opposite the right angle.',
    'The converse also holds: if a² + b² = c², the triangle has a right angle.',
    'Comparing c² with a² + b² tells whether the largest angle is acute, right or obtuse.',
    'Distances in coordinates, lengths of vectors and diagonals of boxes are all the theorem in disguise.'
  ],
  pitfalls: [
    'The hypotenuse is c whatever the letters — c in the formula is the side opposite the right angle, the longest side. Check which side that is before substituting.',
    'Adding the legs gives the hypotenuse — The legs 3 and 4 give 5, not 7: square, add, then take the square root.',
    'It works for every triangle — Only for right triangles. For others use the law of cosines, which adds a correction term.'
  ],
  derivation: {
    title: 'Prove it by counting areas',
    steps: [
      { text: 'Put four copies of the right triangle (legs $a$, $b$, hypotenuse $c$) into the corners of a square of side $a + b$. What is left uncovered is a square of side $c$, so the big square is that square plus four triangles:', tex: '(a + b)^2 = c^2 + 4 \\cdot \\tfrac12 ab' },
      { text: 'Expand the left side and simplify the right:', tex: 'a^2 + 2ab + b^2 = c^2 + 2ab' },
      { text: 'Take $2ab$ from both sides:', tex: 'a^2 + b^2 = c^2' }
    ]
  },
  formulas: [
    {
      name: 'Hypotenuse from the two legs',
      expr: 'c = sqrt(a^2 + b^2)', tex: 'c = \\sqrt{a^2 + b^2}',
      vars: {
        c: { name: 'hypotenuse', q: 'length', unit: 'm' },
        a: { name: 'one leg', q: 'length', unit: 'm', value: 3 },
        b: { name: 'the other leg', q: 'length', unit: 'm', value: 4 }
      },
      stories: {
        c: 'The foot of a ladder is {a} from a wall and its top touches the wall {b} up. How long is the ladder?',
        b: 'A {c} ladder leans against a wall with its foot {a} out from the wall. How high up the wall does it reach?'
      }
    },
    {
      name: 'Space diagonal of a box',
      expr: 'd = sqrt(a^2 + b^2 + c^2)', tex: 'd = \\sqrt{a^2 + b^2 + c^2}',
      vars: {
        d: { name: 'space diagonal', q: 'length', unit: 'cm' },
        a: { name: 'length', q: 'length', unit: 'cm', value: 3 },
        b: { name: 'width', q: 'length', unit: 'cm', value: 4 },
        c: { name: 'height', q: 'length', unit: 'cm', value: 12 }
      },
      stories: { d: 'What is the longest thin rod that fits inside a box {a} long, {b} wide and {c} high?' }
    }
  ],
  examples: [
    {
      title: 'Is it a right angle?',
      q: 'A triangle has sides 20 cm, 21 cm and 29 cm. Is it right-angled?',
      steps: [
        'The longest side is 29 cm; if there is a right angle, it is opposite that side.',
        '$20^2 + 21^2 = 400 + 441 = 841$, and $29^2 = 841$.',
        'The two agree, so by the converse the angle between the 20 cm and 21 cm sides is exactly 90°.'
      ],
      a: 'Yes — (20, 21, 29) is a Pythagorean triple.'
    },
    {
      title: 'Will the umbrella fit?',
      q: 'Will a 1.2 m umbrella fit (straight) inside a suitcase 80 cm × 60 cm × 30 cm?',
      steps: [
        'The diagonal of the base: $\\sqrt{80^2 + 60^2} = \\sqrt{10\\,000} = 100\\ \\mathrm{cm}$.',
        'Now a right triangle with legs 100 cm and 30 cm: $\\sqrt{100^2 + 30^2} = \\sqrt{10\\,900} \\approx 104.4\\ \\mathrm{cm}$.',
        'The longest straight line inside the case is 104 cm, less than 120 cm.'
      ],
      a: 'No: the longest diagonal is only about 104 cm.'
    }
  ],
  quiz: [
    { q: 'A right triangle has legs 6 and 8. Its hypotenuse is…', choices: ['10', '14', '48', '100'], a: 0,
      why: '$\\sqrt{36 + 64} = \\sqrt{100} = 10$. 14 is the mistake of adding the legs; 100 forgets the square root.' },
    { q: 'A triangle has sides 7, 8 and 11. It is…', choices: ['right-angled', 'acute', 'obtuse', 'impossible'], a: 2,
      why: '$7^2 + 8^2 = 113$ is less than $11^2 = 121$: the longest side is too long for a right angle, so the angle opposite it is obtuse.' },
    { q: 'A right triangle has legs $x$ and $x + 1$. Write $c^2$, the square of its hypotenuse, expanded as a polynomial in $x$.', answer: '2x^2 + 2x + 1', vars: ['x'],
      why: '$c^2 = x^2 + (x + 1)^2 = x^2 + x^2 + 2x + 1 = 2x^2 + 2x + 1$.' },
    { q: '$a^2 + b^2 = c^2$ holds for the three sides of every triangle.', a: false,
      why: 'Only when the angle between $a$ and $b$ is a right angle. In general $c^2 = a^2 + b^2 - 2ab\\cos C$.' },
    { q: 'The diagonal of a square of side $s$ is…', choices: ['$2s$', '$s\\sqrt2$', '$s^2$', '$\\sqrt{2s}$'], a: 1,
      why: '$d^2 = s^2 + s^2 = 2s^2$, so $d = s\\sqrt2 \\approx 1.414\\,s$.' }
  ],
  applications: [
    'Setting out square corners on building sites with the 3-4-5 rule.',
    'Distances on maps and screens, and the length of any vector.',
    'Combining quantities at right angles: a boat\'s velocity across a current, or the magnitude of an impedance from its resistance and reactance.'
  ],
  history: 'The relation was known long before Pythagoras (6th century BCE): the Babylonian tablet Plimpton 322, from about 1800 BCE, lists Pythagorean triples, and it appears independently in early Indian and Chinese texts. Euclid\'s proof is Proposition 47 of Book I of the Elements.',
  sim: 'gt-pythagoras'
},

{
  id: 'similar-triangles', parent: 'plane-geometry', title: 'Similar and congruent triangles', level: 1,
  short: 'Triangles with the same angles have the same shape, and their sides are in one fixed ratio. Congruent triangles are identical in shape and size.',
  keywords: ['similar', 'similarity', 'congruent', 'congruence', 'scale factor', 'ratio', 'proportion', 'SSS', 'SAS', 'ASA', 'RHS', 'AA', 'shadow', 'intercept theorem', 'enlargement'],
  prereq: ['triangles', 'fractions-ratios'],
  related: ['scaling-laws', 'right-triangle-trig', 'area', 'physics:magnification', 'physics:thin-lenses'],
  body: `
A photograph and its enlargement show the same scene: every angle is kept and every length is multiplied by the same factor. Two triangles related like that are **similar** — the same shape, perhaps a different size. If the factor is 1 they are **congruent**: identical in shape and size, so that one could be picked up (and turned over, if need be) and laid exactly on the other.

### Congruent triangles
A triangle is pinned down by fewer than all six of its sides and angles. Two triangles are congruent if they agree in
- **SSS** — all three sides;
- **SAS** — two sides and the angle *between* them;
- **ASA** or **AAS** — two angles and one side in matching positions;
- **RHS** — a right angle, the hypotenuse and one other side.

Two sides and an angle that is *not* between them (SSA) is not enough in general: two different triangles can fit that description, the "ambiguous case" of the [[law-of-sines|law of sines]].

### Similar triangles
Two triangles are similar when their angles are equal — and since the angles of a triangle add up to 180°, matching two angles is enough (**AA**). Then corresponding sides are all in the same ratio, the **scale factor** $k$:

$$\\frac{a'}{a} = \\frac{b'}{b} = \\frac{c'}{c} = k$$

Equally, triangles whose three sides are in proportion (SSS), or with two sides in proportion and the angle between them equal (SAS), are similar. A useful special case is the **intercept theorem**: a line parallel to one side of a triangle cuts off a smaller triangle similar to the whole one, and divides the other two sides in the same ratio.

### Lengths scale by k, areas by k²
Enlarge a triangle by 3 and it can be tiled by 9 copies of the original: areas grow by $k^2$, and in three dimensions volumes grow by $k^3$. That small fact has large consequences, explored in [[scaling-laws]].

### What similarity is good for
- **Measuring what you cannot reach.** Thales is said to have measured an Egyptian pyramid by its shadow. At any moment a vertical stick and a building cast shadows that make similar triangles with the sun's rays, so height : shadow is the same for both.
- **Trigonometry.** All right triangles with a 35° angle are similar, so the ratio opposite : hypotenuse is the same for every one of them. That shared ratio *is* $\\sin 35°$: similarity is the reason [[right-triangle-trig|trigonometric ratios]] exist.
- **Optics.** In a pinhole camera or through the centre of a lens, the rays make similar triangles on the two sides, so image height : object height = image distance : object distance ([[physics:magnification|magnification]]).
- **Maps and plans**, where a scale of 1 : 25 000 is a similarity ratio.
`,
  ideas: [
    'Similar triangles have equal angles; their corresponding sides are in one ratio, the scale factor.',
    'Two equal angles (AA) are enough to prove two triangles similar.',
    'Congruence needs SSS, SAS, ASA/AAS or RHS — but not SSA.',
    'Scaling lengths by k scales areas by k² and volumes by k³.'
  ],
  pitfalls: [
    'Matching sides in the wrong order — Corresponding sides are the ones opposite equal angles. Label the angles first, then pair the sides.',
    'Doubling the sides doubles the area — Area grows by the square of the scale factor: doubling the sides quadruples it.',
    'SSA proves congruence — Two sides and a non-included angle can fit two different triangles.'
  ],
  formulas: [
    {
      name: 'Height from a shadow',
      expr: 'H = h*S/s', tex: 'H = h\\,\\frac{S}{s}',
      vars: {
        H: { name: 'height of the tall object', q: 'length', unit: 'm' },
        h: { name: 'height of the stick', q: 'length', unit: 'm', value: 2 },
        S: { name: 'shadow of the tall object', q: 'length', unit: 'm', value: 45 },
        s: { name: 'shadow of the stick', q: 'length', unit: 'm', value: 3 }
      },
      note: 'Both shadows must be measured at the same moment on level ground, from the foot of each object.',
      stories: {
        H: 'A {h} pole casts a {s} shadow while a nearby building casts a {S} shadow. How tall is the building?',
        S: 'A {h} post casts a {s} shadow. How long is the shadow of a {H} tree at the same moment?'
      }
    },
    {
      name: 'Area of a scaled copy',
      expr: 'A2 = k^2*A1', tex: 'A_2 = k^2 A_1',
      vars: {
        A2: { name: 'area of the scaled copy', q: 'area', unit: 'cm²' },
        k: { name: 'scale factor (lengths)', value: 3 },
        A1: { name: 'original area', q: 'area', unit: 'cm²', value: 12 }
      },
      stories: { A2: 'A logo covering {A1} is enlarged so that every length is {k} times as long. What area does it cover now?' }
    }
  ],
  examples: [
    {
      title: 'A building from its shadow',
      q: 'A 2.0 m pole casts a 3.0 m shadow at the same moment as a building casts a 45 m shadow. How tall is the building?',
      steps: [
        'The sun\'s rays are parallel, so pole-and-shadow and building-and-shadow are similar right triangles.',
        'Height : shadow is the same for both: $\\dfrac{H}{45} = \\dfrac{2.0}{3.0}$.',
        '$H = 45 \\times \\dfrac{2.0}{3.0} = 30\\ \\mathrm{m}$.'
      ],
      a: '30 m'
    },
    {
      title: 'A pinhole camera',
      q: 'A person 1.8 m tall stands 6.0 m in front of a pinhole camera whose screen is 15 cm behind the hole. How tall is the image?',
      steps: [
        'Rays from the head and feet cross at the pinhole, making two similar triangles, one in front and one behind.',
        'Image height : object height = image distance : object distance, so $h_i = 1.8 \\times \\dfrac{0.15}{6.0}$.',
        '$h_i = 0.045\\ \\mathrm{m} = 4.5\\ \\mathrm{cm}$, upside down.'
      ],
      a: '4.5 cm, inverted'
    },
    {
      title: 'A line parallel to a side',
      q: 'In triangle $ABC$, point $D$ lies on $AB$ and $E$ on $AC$, with $DE$ parallel to $BC$. If $AD = 4$, $DB = 6$ and $BC = 15$, how long is $DE$?',
      steps: [
        'Triangle $ADE$ is similar to triangle $ABC$ (the parallel line makes equal corresponding angles).',
        'The scale factor is $AD/AB = 4/(4 + 6) = 0.4$.',
        '$DE = 0.4 \\times 15 = 6$.'
      ],
      a: 'DE = 6'
    }
  ],
  quiz: [
    { q: 'One triangle has angles of 40° and 60°; another has angles of 40° and 80°. The two triangles are similar.', a: true,
      why: 'The missing angles are 80° and 60°, so both triangles have angles 40°, 60° and 80°.' },
    { q: 'A triangle is enlarged by a scale factor of 3. Its area is multiplied by…', choices: ['3', '6', '9', '27'], a: 2,
      why: 'Both the base and the height are tripled, so the area is multiplied by $3 \\times 3 = 9$.' },
    { q: 'Which of these does **not** guarantee that two triangles are congruent?', choices: ['SSS', 'SAS', 'ASA', 'SSA'], a: 3,
      why: 'Two sides and an angle that is not between them can fit two different triangles.' },
    { q: 'On a map with a scale of 1 : 25 000, two villages are 4 cm apart. How far apart are they?', choices: ['100 m', '1 km', '10 km', '25 km'], a: 1,
      why: '$4\\ \\mathrm{cm} \\times 25\\,000 = 100\\,000\\ \\mathrm{cm} = 1\\ \\mathrm{km}$.' },
    { q: 'Two similar triangles have corresponding sides of 4 cm and 10 cm. The smaller one has an area of 8 cm². The larger has an area of…', choices: ['20 cm²', '50 cm²', '32 cm²', '125 cm²'], a: 1,
      why: 'The scale factor is 2.5, so areas scale by $2.5^2 = 6.25$: $8 \\times 6.25 = 50\\ \\mathrm{cm^2}$.' }
  ],
  applications: [
    'Surveying heights and distances from shadows or sightlines.',
    'Scale drawings, maps and architectural plans.',
    'Pinhole cameras, lenses and the eye, where similar triangles give the size of the image.'
  ],
  history: 'Thales of Miletus (6th century BCE) is credited with using similar triangles to find the height of a pyramid from its shadow and the distance of ships at sea.',
  sim: 'gt-scaling'
},

{
  id: 'circles', parent: 'plane-geometry', title: 'Circles', level: 1,
  short: 'All the points at one distance from a centre. Its circumference is 2πr, its area πr², and angles drawn in it obey a few elegant rules.',
  keywords: ['circle', 'radius', 'diameter', 'circumference', 'pi', 'area of a circle', 'arc', 'chord', 'sector', 'segment', 'tangent', 'inscribed angle', 'Thales theorem', 'cyclic quadrilateral'],
  prereq: ['angles', 'triangles', 'number-systems'],
  related: ['angle-measure', 'unit-circle', 'area', 'coordinate-geometry', 'physics:uniform-circular-motion'],
  body: `
Tie a goat to a post with a rope and it can graze a **circle**: every point at one fixed distance, the **radius** $r$, from a centre. Twice the radius is the **diameter** $d$. A straight line joining two points on the circle is a **chord** (a diameter is the longest chord); a piece of the circle itself is an **arc**; the slice between two radii is a **sector**, like a slice of pizza; the region between a chord and its arc is a **segment**; and a straight line that touches the circle at just one point is a **tangent**.

### π and the circumference
Every circle is a scaled copy of every other, so the ratio of the distance round (the **circumference**) to the diameter is the same for all of them. That ratio is $\\pi = 3.14159\\ldots$, a number whose decimals never end or repeat. Hence

$$C = \\pi d = 2\\pi r$$

A bicycle wheel 70 cm across rolls forward $\\pi \\times 0.70 \\approx 2.20\\ \\mathrm{m}$ with each turn. The Earth's circumference through the poles is almost exactly 40 000 km — the metre was first defined as one ten-millionth of the distance from pole to equator — so its radius is about $40\\,000/2\\pi \\approx 6370\\ \\mathrm{km}$.

### The area
Cut a disc into many thin sectors and lay them side by side, alternately pointing up and down. Together they form an almost-rectangle as tall as the radius and as long as half the circumference. So

$$A = \\pi r^2$$

The area grows with the **square** of the radius: a 40 cm pizza has $(40/28)^2 \\approx 2.04$ times the area of a 28 cm one — a little more than two of them.

### Arcs and sectors
An arc with angle $\\theta$ at the centre is the fraction $\\theta/360°$ of the circumference, and its sector the same fraction of the area. With $\\theta$ in [[angle-measure|radians]] these become simply $s = r\\theta$ and $A = \\tfrac12 r^2\\theta$ — one of the reasons mathematicians prefer radians.

### Angles in circles
- A tangent is perpendicular to the radius at the point where it touches.
- The angle an arc makes at the centre is **twice** the angle it makes at any point on the rest of the circle.
- So an angle standing on a diameter is always 90° (**Thales' theorem**): every triangle drawn in a semicircle, with the diameter as one side, is right-angled.
- Angles standing on the same arc are equal, and opposite angles of a quadrilateral drawn inside a circle add up to 180°.

### Circles everywhere
In coordinates the circle of radius $r$ about the point $(a, b)$ is $(x - a)^2 + (y - b)^2 = r^2$ ([[coordinate-geometry]]). The circle of radius one is the stage on which sine and cosine are defined ([[unit-circle]]). And in physics every wheel, gear, orbit and spinning part moves on circles ([[physics:uniform-circular-motion|uniform circular motion]]).
`,
  ideas: [
    'π is the ratio of circumference to diameter, the same for every circle: C = 2πr.',
    'The area of a disc is πr², so it grows with the square of the radius.',
    'Arcs and sectors are the fraction θ/360° of the circumference and the area.',
    'An angle standing on a diameter is a right angle (Thales), and a tangent meets its radius at 90°.'
  ],
  pitfalls: [
    'Using the diameter in πr² — The formula takes the radius. Using a diameter of 10 cm as r gives an area four times too big.',
    'π is 22/7 — 22/7 = 3.1429 is only an approximation, good to about 0.04 %. π is irrational and cannot be written as any fraction.',
    'Twice the radius means twice the area — Area goes as r², so doubling the radius multiplies the area by four.'
  ],
  formulas: [
    {
      name: 'Circumference',
      expr: 'C = 2*pi*r', tex: 'C = 2\\pi r',
      vars: {
        C: { name: 'circumference', q: 'length', unit: 'm' },
        r: { name: 'radius', q: 'length', unit: 'cm', value: 35 }
      },
      stories: {
        C: 'A bicycle wheel has a radius of {r}. How far does the bicycle move for each turn of the wheel?',
        r: 'A circular running track is {C} round. What is its radius?'
      }
    },
    {
      name: 'Area of a disc',
      expr: 'A = pi*r^2', tex: 'A = \\pi r^2',
      vars: {
        A: { name: 'area', q: 'area', unit: 'cm²' },
        r: { name: 'radius', q: 'length', unit: 'cm', value: 14 }
      },
      stories: {
        A: 'How much pizza is there in a round pizza of radius {r}?',
        r: 'A circular pond covers {A}. What is its radius?'
      }
    },
    {
      name: 'Area of a sector',
      expr: 'A = theta/(2*pi)*pi*r^2', tex: 'A = \\frac{\\theta}{360^\\circ}\\,\\pi r^2',
      vars: {
        A: { name: 'area of the sector', q: 'area', unit: 'cm²' },
        theta: { name: 'angle at the centre', q: 'angle', unit: '°', value: 45, min: 0, max: 360 },
        r: { name: 'radius', q: 'length', unit: 'cm', value: 20 }
      },
      stories: { A: 'A slice is cut from a pizza of radius {r} with an angle of {theta} at the centre. What is the area of the slice?' }
    },
    {
      name: 'Length of an arc',
      expr: 's = theta/(2*pi)*2*pi*r', tex: 's = \\frac{\\theta}{360^\\circ}\\,2\\pi r',
      vars: {
        s: { name: 'arc length', q: 'length', unit: 'm' },
        theta: { name: 'angle at the centre', q: 'angle', unit: '°', value: 60, min: 0, max: 360 },
        r: { name: 'radius', q: 'length', unit: 'm', value: 12 }
      },
      stories: { s: 'A car drives round a roundabout of radius {r}, turning through {theta}. How far does it travel?' }
    }
  ],
  examples: [
    {
      title: 'Turns of a wheel',
      q: 'A bicycle wheel is 700 mm in diameter. How many turns does it make in 1 km?',
      steps: [
        'Distance per turn = circumference $= \\pi d = \\pi \\times 0.700\\ \\mathrm{m} = 2.199\\ \\mathrm{m}$.',
        'Turns $= 1000\\ \\mathrm{m} / 2.199\\ \\mathrm{m} \\approx 455$.'
      ],
      a: 'About 455 turns'
    },
    {
      title: 'One big pizza or two small?',
      q: 'For the same price you can have one pizza 40 cm across or two pizzas 28 cm across. Which gives more pizza?',
      steps: [
        'One large: $\\pi \\times 20^2 = 1257\\ \\mathrm{cm^2}$.',
        'Two small: $2 \\times \\pi \\times 14^2 = 1232\\ \\mathrm{cm^2}$.',
        'Area goes as the square of the size, so the single large pizza wins, just — and it has less crust.'
      ],
      a: 'The single 40 cm pizza, 1257 cm² against 1232 cm².'
    },
    {
      title: 'A rectangle in a circle',
      q: 'A rectangle is drawn with all four corners on a circle of radius 5 cm. One side is 6 cm. How long is the other?',
      steps: [
        'Each angle of the rectangle is 90°, and by Thales\' theorem a right angle on a circle stands on a diameter. So the diagonal of the rectangle is a diameter, 10 cm.',
        'The diagonal and two sides form a right triangle: $x = \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8\\ \\mathrm{cm}$.'
      ],
      a: '8 cm'
    }
  ],
  quiz: [
    { q: 'Doubling the radius of a circle multiplies its area by…', choices: ['2', '4', '8', 'π'], a: 1, why: '$A = \\pi r^2$: $(2r)^2 = 4r^2$.' },
    { q: 'A triangle is drawn inside a circle with one side along a diameter and the third corner on the circle. The angle at that corner is…', choices: ['45°', '60°', '90°', 'it depends where the corner is'], a: 2,
      why: 'Thales\' theorem: the angle at the centre on a diameter is 180°, and the angle at the circle is half of it, wherever the corner is.' },
    { q: 'A rope is tied tightly round the Earth\'s equator (40 000 km). By how much must it be lengthened to stand 1 m above the ground all the way round?', choices: ['About 6.3 m', 'About 63 m', 'About 6.3 km', 'About 40 km'], a: 0,
      why: 'The circumference is $2\\pi r$, so adding 1 m to the radius adds $2\\pi \\times 1\\ \\mathrm{m} \\approx 6.3\\ \\mathrm{m}$ — whatever the size of the circle.' },
    { q: 'π is exactly equal to 22/7.', a: false, why: '22/7 = 3.142857…, while π = 3.141592…. π is irrational: no fraction equals it.' },
    { q: 'Write the area of a circle in terms of its circumference $x$.', answer: 'x^2/(4*pi)', vars: ['x'],
      why: 'From $x = 2\\pi r$, $r = x/(2\\pi)$, so $A = \\pi r^2 = \\pi x^2/(4\\pi^2) = x^2/(4\\pi)$.' }
  ],
  applications: [
    'Wheels and gears: distance travelled per turn is the circumference.',
    'Pipes and cables, whose carrying capacity depends on cross-sectional area πr².',
    'Orbits, rotating machinery and anything moving in a circle.'
  ],
  history: 'Archimedes (3rd century BCE) proved that a circle\'s area equals that of a triangle with the radius as height and the circumference as base, and bounded π between 3 10/71 and 3 1/7.'
},

{
  id: 'polygons', parent: 'plane-geometry', title: 'Polygons', level: 1,
  short: 'Closed shapes with straight sides. The interior angles of an n-sided polygon add up to (n − 2) × 180°, and regular polygons have all sides and angles equal.',
  keywords: ['polygon', 'quadrilateral', 'pentagon', 'hexagon', 'octagon', 'regular polygon', 'interior angle', 'exterior angle', 'diagonal', 'convex', 'concave', 'parallelogram', 'trapezium', 'rhombus', 'kite', 'tessellation', 'tiling'],
  prereq: ['triangles', 'angles'],
  related: ['area', 'circles', 'limits', 'physics:crystal-structure'],
  body: `
A **polygon** is a flat shape bounded by straight sides that close up: triangle (3 sides), quadrilateral (4), pentagon (5), hexagon (6), heptagon (7), octagon (8), and so on. It is **convex** if every interior angle is less than 180° — a rubber band stretched round it touches every corner — and **concave** if it has a dent. It is **regular** when all its sides and all its angles are equal, like the cells of a honeycomb or the octagon of a stop sign.

### The quadrilateral family
| Shape | What defines it |
|---|---|
| trapezium | one pair of parallel sides |
| parallelogram | two pairs of parallel sides; opposite sides and angles equal |
| rhombus | a parallelogram with four equal sides; its diagonals cross at right angles |
| rectangle | a parallelogram with four right angles; its diagonals are equal |
| square | both a rhombus and a rectangle |
| kite | two pairs of equal sides, each pair next to each other |

### Adding up the angles
From one corner of a convex $n$-sided polygon, diagonals to every corner except itself and its two neighbours cut it into $n - 2$ triangles. Each contributes 180°, so

$$\\text{sum of interior angles} = (n - 2) \\times 180°$$

A quadrilateral's angles add up to 360°, a pentagon's to 540°, a hexagon's to 720°. In a regular polygon each angle is that sum divided by $n$: 108° in a regular pentagon, 120° in a regular hexagon.

The **exterior** angles — how far you turn at each corner as you walk round the edge — always add up to 360°, however many sides there are: after one lap you face the way you started. So each exterior angle of a regular $n$-gon is $360°/n$, and interior and exterior angles at a corner are supplementary.

### Diagonals
Each of the $n$ corners can be joined by a diagonal to $n - 3$ others (not itself, not its two neighbours), and every diagonal gets counted from both ends. So there are $n(n - 3)/2$ of them: 2 in a quadrilateral, 5 in a pentagon, 9 in a hexagon, 170 in a 20-gon.

### Tiling the plane
Copies of a single regular polygon cover a floor without gaps only if its interior angle divides 360° exactly. That leaves three: equilateral triangles (six 60° corners meet at a point), squares (four of 90°) and hexagons (three of 120°). Pentagons, with 108°, leave gaps. Of the three, hexagons enclose the most area for a given length of wall, one reason bees build hexagonal cells; the same hexagonal pattern appears in graphite and graphene and in many [[physics:crystal-structure|crystals]].

### Closing in on the circle
A regular polygon with more and more sides hugs its circle more and more closely. Archimedes trapped a circle between 96-sided polygons inside and outside it and proved that $3\\tfrac{10}{71} < \\pi < 3\\tfrac17$. The perimeter of a regular $n$-gon drawn inside a circle of radius $r$ is $2nr\\sin(180°/n)$, which approaches $2\\pi r$ as $n$ grows — an early example of a [[limits|limit]].
`,
  ideas: [
    'An n-sided polygon splits into n − 2 triangles, so its interior angles add up to (n − 2) × 180°.',
    'The exterior angles of any convex polygon add up to 360°.',
    'A regular n-gon has interior angles (n − 2) × 180°/n and exterior angles 360°/n.',
    'Only triangles, squares and hexagons tile the plane on their own among the regular polygons.'
  ],
  pitfalls: [
    'Every polygon\'s angles add up to 360° — That is only the quadrilateral. The sum grows by 180° with every extra side.',
    'Equal sides make a polygon regular — A rhombus has four equal sides but its angles are unequal; regular needs equal sides and equal angles.',
    'A trapezium has two pairs of parallel sides — That is a parallelogram. A trapezium needs only one pair.'
  ],
  formulas: [
    {
      name: 'Sum of the interior angles',
      expr: 'S = (n - 2)*pi', tex: 'S = (n - 2)\\times 180^\\circ',
      vars: {
        S: { name: 'sum of the interior angles', q: 'angle', unit: '°' },
        n: { name: 'number of sides', value: 6, int: true }
      },
      stories: { S: 'What do the interior angles of a polygon with {n} sides add up to?', n: 'The interior angles of a polygon add up to {S}. How many sides does it have?' }
    },
    {
      name: 'Each angle of a regular polygon',
      expr: 'alpha = (n - 2)*pi/n', tex: '\\alpha = \\frac{(n - 2)\\times 180^\\circ}{n}',
      vars: {
        alpha: { name: 'interior angle', q: 'angle', unit: '°', min: 0, max: 180 },
        n: { name: 'number of sides', value: 8, int: true }
      },
      stories: { alpha: 'What is each interior angle of a regular polygon with {n} sides?', n: 'Each interior angle of a regular polygon is {alpha}. How many sides does it have?' }
    },
    {
      name: 'Number of diagonals',
      expr: 'D = n*(n - 3)/2', tex: 'D = \\frac{n(n - 3)}{2}',
      vars: {
        D: { name: 'number of diagonals' },
        n: { name: 'number of sides', value: 10, int: true }
      }
    }
  ],
  examples: [
    {
      title: 'Why pentagons do not tile',
      q: 'Find the interior angle of a regular pentagon and explain why regular pentagons cannot tile a floor.',
      steps: [
        'Angle sum: $(5 - 2) \\times 180° = 540°$; each of the five equal angles is $540°/5 = 108°$.',
        'To tile, a whole number of corners must meet at a point and fill 360°. $360°/108° = 3.33$: three pentagons leave a 36° gap, and four overlap.'
      ],
      a: '108°; 360° is not a whole multiple of 108°.'
    },
    {
      title: 'The missing angle',
      q: 'Four angles of a pentagon are 100°, 110°, 95° and 120°. Find the fifth.',
      steps: ['The angles add up to 540°.', 'Fifth angle $= 540° - (100 + 110 + 95 + 120)° = 540° - 425° = 115°$.'],
      a: '115°'
    },
    {
      title: 'Counting the sides',
      q: 'Each interior angle of a regular polygon is 150°. How many sides has it?',
      steps: ['Each exterior angle is $180° - 150° = 30°$.', 'The exterior angles add up to 360°, so $n = 360°/30° = 12$.'],
      a: '12 sides (a regular dodecagon)'
    }
  ],
  quiz: [
    { q: 'The interior angles of an octagon add up to…', choices: ['720°', '900°', '1080°', '1440°'], a: 2, why: '$(8 - 2) \\times 180° = 1080°$.' },
    { q: 'Each exterior angle of a regular polygon is 24°. How many sides does it have?', choices: ['12', '15', '18', '24'], a: 1, why: 'The exterior angles add up to 360°: $360/24 = 15$.' },
    { q: 'Which regular polygon cannot tile the plane on its own?', choices: ['Triangle', 'Square', 'Pentagon', 'Hexagon'], a: 2, why: 'Its 108° angle does not divide 360°. The others have 60°, 90° and 120°.' },
    { q: 'The exterior angles of any convex polygon add up to 360°.', a: true, why: 'Walking once round the boundary you turn through one full turn in total, whatever the number of corners.' },
    { q: 'Write the number of diagonals of a polygon with $n$ sides.', answer: 'n(n-3)/2', vars: ['n'],
      why: 'Each corner joins to $n - 3$ others, giving $n(n-3)$ ends of diagonals; each diagonal has two ends.' }
  ],
  applications: [
    'Floor tiling and paving patterns.',
    'Hexagonal bolt heads and nuts, which a spanner can grip every 60°.',
    'Crystal lattices and honeycomb panels in aircraft, which use hexagonal cells for stiffness with little material.'
  ]
},

{
  id: 'area', parent: 'plane-geometry', title: 'Area', level: 1,
  short: 'How much flat surface a shape covers, counted in unit squares. Rectangles, parallelograms, triangles, trapezia and circles all follow from cutting and rearranging.',
  keywords: ['area', 'square metre', 'rectangle', 'parallelogram', 'triangle area', 'trapezium', 'Heron\'s formula', 'shoelace formula', 'hectare', 'units of area', 'composite shape', 'base times height'],
  prereq: ['triangles', 'polygons'],
  related: ['circles', 'surface-area', 'definite-integral', 'determinants', 'physics:pressure'],
  body: `
**Area** measures how much flat surface a shape covers, counted in unit squares. A rectangle 5 m by 3 m holds 3 rows of 5 one-metre squares: 15 m². Almost every other area formula comes from cutting a shape into pieces and rearranging them into rectangles, because moving pieces around does not change the total area.

### The basic shapes
| Shape | Area |
|---|---|
| rectangle, sides $l$ and $w$ | $lw$ |
| parallelogram, base $b$, perpendicular height $h$ | $bh$ |
| triangle, base $b$, perpendicular height $h$ | $\\tfrac12 bh$ |
| trapezium, parallel sides $a$ and $b$, height $h$ | $\\tfrac12 (a + b)h$ |
| circle, radius $r$ | $\\pi r^2$ |

A **parallelogram** becomes a rectangle if you slice a right triangle off one end and slide it to the other: base times *perpendicular* height, not base times the slanted side. Two copies of any **triangle** make a parallelogram, hence the half. Two copies of a **trapezium**, one turned upside down, make a parallelogram with base $a + b$. A [[circles|circle]] rearranges into a near-rectangle $\\pi r$ long and $r$ high.

### Other ways to find a triangle's area
- From two sides and the angle between them: $\\tfrac12 ab\\sin C$, since the height onto side $a$ is $b\\sin C$ ([[right-triangle-trig]]).
- From the three sides alone, **Heron's formula**: with the half-perimeter $s = \\tfrac12(a + b + c)$, the area is $\\sqrt{s(s-a)(s-b)(s-c)}$.
- From the coordinates of the corners, the **shoelace formula**: for $(x_1, y_1)$, $(x_2, y_2)$, $(x_3, y_3)$ the area is $\\tfrac12\\left|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\\right|$. It extends to any polygon, and it is a [[determinants|determinant]] in disguise.

Shapes with curved edges need the [[definite-integral|definite integral]], which adds up the areas of many thin strips.

### Units: the square trap
A square metre is a square 100 cm on each side, so it contains $100 \\times 100 = 10\\,000\\ \\mathrm{cm^2}$, not 100. In the same way $1\\ \\mathrm{km^2} = 10^6\\ \\mathrm{m^2}$, and a **hectare** — a square 100 m on a side, a little bigger than a football pitch — is $10^4\\ \\mathrm{m^2}$. Whenever a length unit changes by some factor, the area unit changes by that factor squared.

### Area in physics
[[physics:pressure|Pressure]] is force per unit area, which is why a stiletto heel presses harder on a floor than an elephant's foot does. The strength of sunlight is power per unit area ([[physics:light-intensity|intensity]]), and on a velocity–time graph the area under the line is the distance travelled.

> [!tip] In the simulation, switch on the altitude and drag the top corner sideways, parallel to the base: the triangle changes shape but its area does not, because base and height stay the same.
`,
  ideas: [
    'Area counts unit squares; cutting and rearranging a shape does not change it.',
    'Parallelogram = base × perpendicular height; triangle = half of that; trapezium = average of the parallel sides × height.',
    'A triangle\'s area also follows from two sides and the included angle (½ab sin C), or from three sides (Heron).',
    'Area units convert by the square of the length factor: 1 m² = 10 000 cm².'
  ],
  pitfalls: [
    'Using the slanted side as the height — The height is always perpendicular to the base. A parallelogram 8 by 5 with a height of 4 has area 32, not 40.',
    '1 m² = 100 cm² — Both sides are 100 times longer, so 1 m² = 10 000 cm².',
    'Same perimeter, same area — A 1 × 9 rectangle and a 5 × 5 square both have perimeter 20, but areas 9 and 25.'
  ],
  formulas: [
    {
      name: 'Area of a triangle',
      expr: 'A = 0.5*b*h', tex: 'A = \\tfrac12 b h',
      vars: {
        A: { name: 'area', q: 'area', unit: 'cm²' },
        b: { name: 'base', q: 'length', unit: 'cm', value: 10 },
        h: { name: 'perpendicular height', q: 'length', unit: 'cm', value: 6 }
      },
      stories: { A: 'A triangular sail has a base of {b} and a height of {h}. How much cloth does it need?', h: 'A triangle of area {A} stands on a base of {b}. How tall is it?' }
    },
    {
      name: 'Area of a trapezium',
      expr: 'A = 0.5*(a + b)*h', tex: 'A = \\tfrac12 (a + b)\\,h',
      vars: {
        A: { name: 'area', q: 'area', unit: 'm²' },
        a: { name: 'one parallel side', q: 'length', unit: 'm', value: 6 },
        b: { name: 'the other parallel side', q: 'length', unit: 'm', value: 10 },
        h: { name: 'distance between them', q: 'length', unit: 'm', value: 4 }
      },
      stories: { A: 'A garden bed is a trapezium with parallel sides {a} and {b}, {h} apart. What is its area?' }
    },
    {
      name: 'Heron\'s formula: area from the three sides',
      expr: 'A = 0.25*sqrt((a + b + c)*(b + c - a)*(a + c - b)*(a + b - c))',
      tex: 'A = \\tfrac14\\sqrt{(a + b + c)(b + c - a)(a + c - b)(a + b - c)}',
      vars: {
        A: { name: 'area', q: 'area', unit: 'm²' },
        a: { name: 'first side', q: 'length', unit: 'm', value: 5 },
        b: { name: 'second side', q: 'length', unit: 'm', value: 6 },
        c: { name: 'third side', q: 'length', unit: 'm', value: 7 }
      },
      note: 'This is $\\sqrt{s(s-a)(s-b)(s-c)}$ with the half-perimeter $s = \\tfrac12(a + b + c)$ multiplied out. Solving for a side gives two answers: two different triangles, one with an acute and one with an obtuse angle, have the same area.',
      practice: { unknowns: ['A'] },
      stories: { A: 'A triangular plot of land has sides {a}, {b} and {c}. What is its area?' }
    }
  ],
  examples: [
    {
      title: 'Tiling a floor',
      q: 'A kitchen floor is 4.2 m by 3.5 m. How many 30 cm square tiles does it need (before allowing for waste)?',
      steps: [
        'Floor area: $4.2 \\times 3.5 = 14.7\\ \\mathrm{m^2}$.',
        'One tile: $0.30 \\times 0.30 = 0.09\\ \\mathrm{m^2}$ — work in one unit throughout.',
        '$14.7 / 0.09 = 163.3$, so 164 tiles; in practice about 10 % more for cuts.'
      ],
      a: '164 tiles (about 180 with waste)'
    },
    {
      title: 'A plot from its sides',
      q: 'A triangular plot has sides 5 m, 6 m and 7 m. Find its area.',
      steps: [
        'Half-perimeter: $s = (5 + 6 + 7)/2 = 9$.',
        '$A = \\sqrt{9 \\times (9-5) \\times (9-6) \\times (9-7)} = \\sqrt{9 \\times 4 \\times 3 \\times 2} = \\sqrt{216}$.',
        '$A \\approx 14.7\\ \\mathrm{m^2}$.'
      ],
      a: 'About 14.7 m²'
    },
    {
      title: 'Area from coordinates',
      q: 'Find the area of the triangle with corners (1, 1), (5, 2) and (2, 6).',
      steps: [
        'Shoelace: $\\tfrac12\\left|1(2 - 6) + 5(6 - 1) + 2(1 - 2)\\right|$.',
        '$= \\tfrac12\\left|-4 + 25 - 2\\right| = \\tfrac12 \\times 19 = 9.5$.'
      ],
      a: '9.5 square units'
    }
  ],
  quiz: [
    { q: 'How many square centimetres are there in one square metre?', choices: ['100', '1000', '10 000', '1 000 000'], a: 2, why: 'A square metre is 100 cm by 100 cm: $100 \\times 100 = 10\\,000$.' },
    { q: 'A parallelogram has sides 8 cm and 5 cm, and its height measured perpendicular to the 8 cm side is 4 cm. Its area is…', choices: ['20 cm²', '32 cm²', '40 cm²', '16 cm²'], a: 1,
      why: 'Base times perpendicular height: $8 \\times 4 = 32$. Multiplying the two sides (40) uses the slanted side as if it were the height.' },
    { q: 'Write the area of an equilateral triangle with side $x$.', answer: 'sqrt(3)/4*x^2', vars: ['x'],
      why: 'Its height is $\\sqrt{x^2 - (x/2)^2} = \\tfrac{\\sqrt3}{2}x$, so the area is $\\tfrac12 \\cdot x \\cdot \\tfrac{\\sqrt3}{2}x = \\tfrac{\\sqrt3}{4}x^2$.' },
    { q: 'Two shapes with the same perimeter always have the same area.', a: false,
      why: 'A 1 × 9 rectangle and a 5 × 5 square both have perimeter 20, but areas 9 and 25. For a given perimeter the circle encloses the most area.' },
    { q: 'You double the base of a triangle and halve its height. The area…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 2, why: '$\\tfrac12 (2b)(h/2) = \\tfrac12 bh$.' }
  ],
  applications: [
    'Materials estimates: paint, flooring, roofing, fabric.',
    'Land measurement, in hectares and square kilometres.',
    'Pressure, stress and intensity, which are all "per unit area".'
  ],
  sim: 'gt-triangle'
}

);
