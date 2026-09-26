/* HYPER-MATH · content/vector-algebra.js — vectors, components, addition, the dot and
 * cross products, projections. Simulations in sims/vectors-linalg-complex.js. */
Hyper.add(

{
  id: 'vectors', parent: 'vector-algebra', title: 'Vectors', level: 1,
  short: 'A quantity with both a size and a direction, drawn as an arrow: a displacement, a velocity, a force.',
  keywords: ['vector', 'scalar', 'magnitude', 'direction', 'arrow', 'length', 'norm', 'zero vector', 'position vector', 'free vector'],
  prereq: ['coordinate-geometry', 'pythagorean-theorem', 'angles'],
  related: ['vector-components', 'vector-addition', 'vector-spaces', 'physics:position-displacement', 'physics:speed-velocity', 'physics:force'],
  body: `
Some quantities are fully described by one number: a mass of 2 kg, a temperature of 20 °C, an energy of 5 J. These are **scalars**. Others need a direction as well. "Walk 3 km" will not get you to the station; "walk 3 km north-east" will. A displacement, a velocity, a force, an electric field — each has a **size**, called its *magnitude*, and a **direction**. These are **vectors**.

### Arrows
A vector is drawn as an arrow: its length shows the magnitude (to some scale) and it points in the direction. In print a vector is written in bold, $\\mathbf{v}$, or with an arrow, $\\vec v$; the displacement from a point $A$ to a point $B$ is $\\overrightarrow{AB}$. The magnitude is written $|\\vec v|$ or plain $v$, and it is never negative.

Two arrows with the same length and the same direction are the **same vector**, wherever they are drawn. A force of 10 N due east is the same vector whether it pushes a car in Paris or a boat in Lisbon. (Where a force acts still matters for its turning effect — see [[physics:torque|torque]] — but not for the vector itself.) A **position vector** is the special arrow drawn from a chosen origin to a point.

### Numbers for arrows
Put the tail at the origin of a set of axes and the tip lands on a point; the coordinates of that point are the vector's **components**. In the plane $\\vec v = (v_x, v_y)$, and by the [[pythagorean-theorem|Pythagorean theorem]]

$$|\\vec v| = \\sqrt{v_x^2 + v_y^2}, \\qquad \\text{in space} \\quad |\\vec v| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$$

The vector $(3, 4)$ has length 5; $(1, 2, 2)$ has length 3. The direction can be given as an angle — $(3, 4)$ points 53.1° above the $x$-axis — or by a **unit vector**, the vector divided by its own length, $\\hat v = \\vec v / |\\vec v|$, which keeps the direction and has length exactly 1. Both are developed in [[vector-components]].

Two special cases: the **zero vector** $\\vec 0$ has length 0 and no direction at all, and the **negative** $-\\vec v$ has the same length as $\\vec v$ but points the opposite way.

### What makes something a vector
Having a direction is not quite enough. A vector must also **combine like arrows**, tip to tail ([[vector-addition]]): forces of 3 N and 4 N at right angles act together like a single force of 5 N, not 7 N. The electric current in a wire has a direction along the wire, yet at a junction currents simply add as numbers — current is a scalar. A large rotation has an axis and an angle, but turning a book 90° about one axis and then 90° about another gives a different result from doing it in the opposite order, so rotations are not vectors either.

> [!key] A vector is an arrow — a magnitude and a direction — independent of where it is drawn. Its components are its coordinates in one particular set of axes.

### Why it matters
A law written with vectors holds whatever axes you choose. [[physics:newtons-second-law|Newton's second law]] $\\vec F = m\\vec a$ is one equation that stands for three, one per component, and it says at a glance that the acceleration points the way the net force does. Mathematicians later kept only the rules for adding and scaling, and arrived at the general idea of a [[vector-spaces|vector space]], which covers functions, signals and quantum states as well as arrows.
`,
  ideas: [
    'A vector has a magnitude and a direction; a scalar has only a size.',
    'Arrows with the same length and direction are the same vector, wherever they are drawn.',
    'In coordinates a vector is a list of components, and its length follows from Pythagoras.',
    'Dividing a vector by its length gives the unit vector in its direction.',
    'To be a vector a quantity must also add like arrows, tip to tail.'
  ],
  pitfalls: [
    'A vector is just a list of numbers — The numbers are its components in one choice of axes. Turn the axes and every component changes, while the arrow, its length and its direction do not.',
    'The length is the sum of the components — It is the square root of the sum of their squares: $(3, 4)$ has length 5, not 7.',
    'Anything with a direction is a vector — It must also add like arrows. Current in a wire has a direction but adds like a plain number at a junction; finite rotations depend on the order they are done in.'
  ],
  formulas: [
    {
      name: 'Length of a vector in the plane',
      expr: 'v = sqrt(vx^2 + vy^2)', tex: 'v = \\sqrt{v_x^2 + v_y^2}',
      vars: {
        v: { name: 'magnitude (length) of the vector' },
        vx: { tex: 'v_x', name: 'x-component', value: 3, signed: true },
        vy: { tex: 'v_y', name: 'y-component', value: 4, signed: true }
      },
      note: 'The components may be negative; the length never is. Solving for a component gives two answers of opposite sign.',
      stories: {
        v: 'A vector has components ({vx}, {vy}). How long is it?',
        vx: 'A vector of length {v} has y-component {vy}. What can its x-component be?'
      }
    },
    {
      name: 'Length of a vector in space',
      expr: 'v = sqrt(vx^2 + vy^2 + vz^2)', tex: 'v = \\sqrt{v_x^2 + v_y^2 + v_z^2}',
      vars: {
        v: { name: 'magnitude (length) of the vector' },
        vx: { tex: 'v_x', name: 'x-component', value: 1, signed: true },
        vy: { tex: 'v_y', name: 'y-component', value: 2, signed: true },
        vz: { tex: 'v_z', name: 'z-component', value: 2, signed: true }
      },
      stories: { v: 'A drone flies from the origin to the point ({vx}, {vy}, {vz}), in metres. How far is it from where it started?' }
    }
  ],
  examples: [
    {
      title: 'How far, and which way?',
      q: 'A drone climbs from its launch point to a position 120 m east, 50 m north and 90 m up. How far is it from the launch point, and in which direction?',
      steps: [
        'Take $x$ east, $y$ north, $z$ up: the displacement is $\\vec d = (120, 50, 90)$ m.',
        'Length: $|\\vec d| = \\sqrt{120^2 + 50^2 + 90^2} = \\sqrt{14400 + 2500 + 8100} = \\sqrt{25000} = 158.1$ m.',
        'Horizontally it is $\\sqrt{120^2 + 50^2} = 130$ m away, so it sits $\\arctan(90/130) = 34.7°$ above the horizontal.',
        'Its compass direction is $\\arctan(120/50) = 67.4°$ east of north.',
        'The unit vector $\\hat d = \\vec d / 158.1 = (0.759, 0.316, 0.569)$ carries the same direction in one package; its squares add to 1.'
      ],
      a: '158 m away, 34.7° above the horizontal on a bearing 67.4° east of north.'
    },
    {
      title: 'Same vector, different place',
      q: 'Points $A(1, 2)$, $B(4, 6)$, $C(-2, 0)$ and $D(1, 4)$. Is $\\overrightarrow{AB}$ the same vector as $\\overrightarrow{CD}$?',
      steps: [
        '$\\overrightarrow{AB} = B - A = (4 - 1, 6 - 2) = (3, 4)$.',
        '$\\overrightarrow{CD} = D - C = (1 - (-2), 4 - 0) = (3, 4)$.',
        'Same components, so same length (5) and same direction: they are equal vectors, drawn in different places.',
        'Equal and parallel opposite sides mean that $A, B, D, C$ are the corners of a parallelogram.'
      ],
      a: 'Yes: both are (3, 4).'
    }
  ],
  quiz: [
    { q: 'Which of these is a vector quantity?', choices: ['the mass of a car', 'the temperature of a room', 'the push of the wind on a sail', 'the energy stored in a battery'], a: 2,
      why: 'A push has a size and a direction and combines with other pushes tip to tail. Mass, temperature and energy are single numbers with no direction.' },
    { q: 'One arrow runs from $(0, 0)$ to $(2, 1)$, another from $(5, 5)$ to $(7, 6)$. They represent…', choices: ['the same vector', 'different vectors, because they start at different points', 'vectors of equal length but different directions', 'opposite vectors'], a: 0,
      why: 'Both have components $(2, 1)$: the same length and direction. Where an arrow is drawn does not change the vector.' },
    { q: 'A vector can have a negative magnitude.', a: false,
      why: 'The magnitude is a length, a square root of a sum of squares, so it is zero or positive. Components can be negative; the magnitude cannot. $-\\vec v$ has the same magnitude as $\\vec v$.' },
    { q: 'Write the length of the vector $(a, 1)$ as an expression in $a$.', answer: 'sqrt(a^2 + 1)', vars: ['a'],
      why: 'By Pythagoras, $\\sqrt{a^2 + 1^2} = \\sqrt{a^2 + 1}$. It is never less than 1, whatever $a$ is.' },
    { q: 'Electric current in a wire has a direction, so it is a vector.', a: false,
      why: 'A vector must add like arrows. Currents meeting at a junction simply add as numbers, whatever the angles between the wires. (Current *density*, the flow per area at a point, is a genuine vector.)' }
  ],
  problems: [
    { q: 'A vector has components $(-5, 12)$. What is its magnitude?', answer: 13, tol: 0.01,
      steps: ['$|\\vec v| = \\sqrt{(-5)^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$.', 'The minus sign disappears when squared: magnitudes are never negative.'] }
  ],
  applications: [
    'Navigation: a leg of a journey is a distance and a bearing, and legs add as vectors.',
    'Engineering statics: every force in a bridge or crane is a vector, and they must sum to zero.',
    'Weather maps show wind as arrows — a vector at every point, which is a vector field.',
    'Computer graphics stores positions, directions and surface normals as vectors.'
  ],
  history: 'William Rowan Hamilton coined the words *scalar* and *vector* (Latin *vehere*, to carry) in the 1840s, as parts of his quaternions. The vector algebra used today was set out independently in the 1880s by Josiah Willard Gibbs and Oliver Heaviside, who wanted a lighter tool for Maxwell\'s electromagnetism.',
  sim: 'vlc-vector-add'
},

{
  id: 'vector-components', parent: 'vector-algebra', title: 'Components and unit vectors', level: 1,
  short: 'Any vector splits into perpendicular parts along the axes, written with the unit vectors î, ĵ and k̂.',
  keywords: ['components', 'unit vector', 'i j k', 'resolving', 'direction angle', 'atan2', 'direction cosines', 'normalise', 'basis vectors'],
  prereq: ['vectors', 'right-triangle-trig'],
  related: ['vector-addition', 'vector-projection', 'polar-coordinates', 'vector-spaces', 'physics:inclined-plane', 'physics:projectile-motion'],
  body: `
### Shadows on the axes
Shine a light straight down onto an arrow lying in the plane and look at its shadow on the $x$-axis; shine it from the side and look at the shadow on the $y$-axis. Those two shadows, with signs, are the **components** $v_x$ and $v_y$. "Three blocks east, then four blocks north" is a description of a displacement by its components.

### Unit vectors
The **unit vectors** $\\hat\\imath$, $\\hat\\jmath$ and $\\hat k$ have length 1 and point along the $x$, $y$ and $z$ axes. Every vector is a sum of stretched copies of them:

$$\\vec v = v_x\\,\\hat\\imath + v_y\\,\\hat\\jmath + v_z\\,\\hat k = (v_x, v_y, v_z)$$

A component is a signed number: $v_x = -2$ means two units in the $-x$ direction.

### From length and angle, and back
If $\\vec v$ has length $v$ and makes an angle $\\theta$ with the $+x$ axis, measured anticlockwise, [[right-triangle-trig|right-triangle trigonometry]] gives

$$v_x = v\\cos\\theta, \\qquad v_y = v\\sin\\theta$$

and conversely $v = \\sqrt{v_x^2 + v_y^2}$ with $\\tan\\theta = v_y / v_x$. That inverse tangent needs care: $(3, 3)$ and $(-3, -3)$ have the same ratio but point in opposite directions. Look at the signs to choose the quadrant, or use the two-argument function $\\operatorname{atan2}(v_y, v_x)$ that calculators and programming languages provide. It is the same conversion as between Cartesian and [[polar-coordinates|polar coordinates]].

A force of 50 N at 30° above the horizontal, for instance, has components $50\\cos 30° = 43.3$ N across and $50\\sin 30° = 25$ N up.

### A unit vector in any direction
Divide a vector by its length and only its direction is left: $\\hat u = \\vec v / |\\vec v|$ (this is called *normalising*). The components of $\\hat u$ are the cosines of the angles $\\alpha, \\beta, \\gamma$ that $\\vec v$ makes with the three axes — its **direction cosines** — and because $\\hat u$ has length 1,

$$\\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1$$

For $\\vec v = (2, 3, 6)$, of length 7, the unit vector is $(2/7, 3/7, 6/7)$ and the angle with the $z$-axis is $\\arccos(6/7) = 31°$.

### Choose axes that suit the problem
Axes are a choice, and a good choice saves work. For a block on a ramp tilted at $\\theta$, take one axis along the slope: gravity then splits into $mg\\sin\\theta$ down the slope and $mg\\cos\\theta$ into it, and the motion involves a single component (see [[physics:inclined-plane|inclined plane]]). For a thrown ball, horizontal and vertical axes separate the steady sideways motion from the free fall ([[physics:projectile-motion|projectile motion]]). Rotating the axes changes every component but never the arrow itself, its length, or the angle between two arrows.

> [!tip] Components turn vector problems into ordinary arithmetic: add the $x$-parts, add the $y$-parts, and only at the end put the arrow back together with Pythagoras and an angle.
`,
  ideas: [
    'A component is the signed shadow of a vector on an axis.',
    'With length v and angle θ from the +x axis: vₓ = v cos θ and v_y = v sin θ.',
    'Going back from components to an angle, check the signs to pick the right quadrant.',
    'A unit vector has length 1; dividing any non-zero vector by its length gives one.',
    'Components depend on the axes you choose; the vector does not.'
  ],
  pitfalls: [
    'The angle is always arctan(v_y/vₓ) — That gives the right answer only when vₓ > 0. For (−4, −3) the calculator says 36.9°, but the vector points at 216.9° (or −143.1°).',
    'Components must be positive — A negative component simply points along the negative axis.',
    'Sine goes with x and cosine with y — It depends on where the angle is measured from. Measured from the x-axis, cosine gives the x-part; measured from the vertical, it is the other way round. Draw the triangle.'
  ],
  formulas: [
    {
      name: 'x-component from length and angle',
      expr: 'vx = v*cos(theta)', tex: 'v_x = v\\cos\\theta',
      vars: {
        vx: { tex: 'v_x', name: 'x-component', signed: true },
        v: { name: 'length of the vector', value: 50 },
        theta: { name: 'angle from the +x axis', q: 'angle', unit: '°', value: 30, min: -180, max: 180, signed: true }
      },
      stories: { vx: 'A rope pulls with {v} at {theta} above the horizontal. What is the horizontal part of the pull?' }
    },
    {
      name: 'y-component from length and angle',
      expr: 'vy = v*sin(theta)', tex: 'v_y = v\\sin\\theta',
      vars: {
        vy: { tex: 'v_y', name: 'y-component', signed: true },
        v: { name: 'length of the vector', value: 50 },
        theta: { name: 'angle from the +x axis', q: 'angle', unit: '°', value: 30, min: -180, max: 180, signed: true }
      },
      note: 'Solving for the angle gives two directions with the same y-component, one on each side of the y-axis.'
    },
    {
      name: 'Direction cosine: one component of the unit vector',
      expr: 'ux = vx/sqrt(vx^2 + vy^2 + vz^2)', tex: 'u_x = \\frac{v_x}{\\sqrt{v_x^2 + v_y^2 + v_z^2}}',
      vars: {
        ux: { tex: 'u_x', name: 'x-component of the unit vector (cos α)', signed: true },
        vx: { tex: 'v_x', name: 'x-component', value: 2, signed: true },
        vy: { tex: 'v_y', name: 'y-component', value: 3, signed: true },
        vz: { tex: 'v_z', name: 'z-component', value: 6, signed: true }
      },
      note: 'The same formula with $v_y$ or $v_z$ on top gives the other two components of $\\hat u$.'
    }
  ],
  examples: [
    {
      title: 'Pulling a sledge',
      q: 'A rope pulls a sledge with a tension of 120 N at 35° above the horizontal. Split the pull into horizontal and vertical parts, and write it with unit vectors.',
      steps: [
        'Horizontal: $120\\cos 35° = 120 \\times 0.819 = 98.3$ N.',
        'Vertical: $120\\sin 35° = 120 \\times 0.574 = 68.8$ N.',
        'So $\\vec T = 98.3\\,\\hat\\imath + 68.8\\,\\hat\\jmath$ N. Check: $\\sqrt{98.3^2 + 68.8^2} = 120$ N.',
        'Only the 98.3 N drags the sledge forward; the 68.8 N lifts it slightly and reduces the friction.'
      ],
      a: '98.3 N forward and 68.8 N upward.'
    },
    {
      title: 'Back to length and direction',
      q: 'Find the length, the direction and the unit vector of $\\vec v = (-4, -3)$.',
      steps: [
        'Length: $\\sqrt{(-4)^2 + (-3)^2} = 5$.',
        'A calculator gives $\\arctan(-3/-4) = \\arctan(0.75) = 36.9°$ — but both components are negative, so the vector is in the third quadrant.',
        'The true angle is $180° + 36.9° = 216.9°$, the same as $-143.1°$; $\\operatorname{atan2}(-3, -4)$ gives this directly.',
        'Unit vector: $\\hat v = (-4, -3)/5 = (-0.8, -0.6)$.'
      ],
      a: 'Length 5, direction 216.9° from the +x axis, unit vector (−0.8, −0.6).'
    }
  ],
  quiz: [
    { q: 'A vector of length 10 makes an angle of 120° with the $+x$ axis. Its $x$-component is…', choices: ['5', '−5', '8.66', '−8.66'], a: 1,
      why: '$10\\cos 120° = 10 \\times (-0.5) = -5$. The vector leans back past the $y$-axis, so its $x$-part is negative.' },
    { q: 'A calculator gives $\\tan^{-1}(v_y / v_x) = 45°$ for the vector $(-2, -2)$. The true direction is…', choices: ['45°', '135°', '225°', '−45°'], a: 2,
      why: 'Both components are negative, so the vector points into the third quadrant: $180° + 45° = 225°$.' },
    { q: 'Rotating the coordinate axes changes the components of a vector but not its length.', a: true,
      why: 'Components are shadows on the axes, so they change when the axes turn. The length is a property of the arrow alone.' },
    { q: 'A vector of length $r$ points at 60° to the $+x$ axis. Write its $y$-component in terms of $r$.', answer: 'sqrt(3)/2*r', vars: ['r'],
      why: '$r\\sin 60° = \\tfrac{\\sqrt 3}{2} r \\approx 0.866\\,r$.' },
    { q: 'A block of weight $W$ sits on a ramp tilted at 30°. The component of its weight along the slope is…', choices: ['$W$', '$W/2$', '$0.866\\,W$', '0'], a: 1,
      why: 'The angle between the weight (straight down) and the normal to the slope equals the tilt, so the part along the slope is $W\\sin 30° = W/2$.' }
  ],
  problems: [
    { q: 'An aircraft flies at 250 m/s on a heading 20° north of east. How fast is it moving northwards?', answer: 85.5, unit: 'm/s', tol: 0.01,
      steps: ['Measure the angle from east (the $x$-axis): the northward part is $v\\sin\\theta$.', '$250 \\sin 20° = 250 \\times 0.342 = 85.5$ m/s.'] }
  ],
  applications: [
    'Resolving forces on a ramp, a roof or a ladder into parts along and across a surface.',
    'Surveying and GPS: displacements are stored as east, north and up components.',
    'Game engines keep velocities as components and normalise direction vectors every frame.'
  ],
  sim: 'vlc-vector-add'
},

{
  id: 'vector-addition', parent: 'vector-algebra', title: 'Adding and scaling vectors', level: 1,
  short: 'Vectors add tip to tail, or by the parallelogram rule, and in components simply part by part; multiplying by a number stretches or reverses them.',
  keywords: ['vector addition', 'resultant', 'tip to tail', 'head to tail', 'parallelogram rule', 'subtraction', 'scalar multiplication', 'linear combination', 'triangle inequality', 'net force'],
  prereq: ['vectors', 'vector-components', 'law-of-cosines'],
  related: ['dot-product', 'vector-spaces', 'physics:static-equilibrium', 'physics:relative-velocity', 'physics:free-body-diagrams'],
  body: `
### Tip to tail
Walk 3 km east and then 4 km north: you end 5 km from the start, on a line 53° north of east. The overall displacement — the **resultant** — is the **sum** of the two legs, found by placing the arrows **tip to tail**, the second starting where the first ends, and drawing the arrow from the very first tail to the very last tip. Any number of vectors add the same way: follow the chain, then join the start to the finish.

Placing the two arrows tail to tail instead and completing the **parallelogram** gives the same answer: the sum is the diagonal. Going round either side of the parallelogram reaches the same far corner, which shows that the order does not matter, $\\vec a + \\vec b = \\vec b + \\vec a$.

### By components
Tip to tail becomes arithmetic in components: add the $x$-parts, and separately the $y$-parts (and $z$-parts),

$$\\vec a + \\vec b = (a_x + b_x,\\; a_y + b_y,\\; a_z + b_z)$$

so $(3, 1) + (1, 2.5) = (4, 3.5)$. The length of a sum is **not** the sum of the lengths. It always lies between $\\big| |\\vec a| - |\\vec b| \\big|$ and $|\\vec a| + |\\vec b|$ — the **triangle inequality**, which says that a straight line is the shortest route. The extremes occur only when the vectors are parallel (lengths add) or opposite (they subtract). For an angle $\\theta$ between them, drawn tail to tail, the [[law-of-cosines|law of cosines]] gives

$$|\\vec a + \\vec b|^2 = a^2 + b^2 + 2ab\\cos\\theta$$

### Scaling and subtracting
Multiplying a vector by a number $k$ — a **scalar**, hence the name — stretches it by the factor $|k|$ and reverses it if $k < 0$: $2\\vec a$ is twice as long, $-\\tfrac12\\vec a$ half as long and backwards. In components every entry is multiplied by $k$.

Subtraction is adding the negative, $\\vec a - \\vec b = \\vec a + (-\\vec b)$. Drawn from a common tail, $\\vec a - \\vec b$ is the arrow **from the tip of $\\vec b$ to the tip of $\\vec a$**. That is how every change is computed: a change of velocity is $\\Delta\\vec v = \\vec v_2 - \\vec v_1$, and the position of $B$ seen from $A$ is $\\vec r_B - \\vec r_A$.

### The rules
Addition and scaling obey the familiar laws of arithmetic: $\\vec a + \\vec b = \\vec b + \\vec a$, $(\\vec a + \\vec b) + \\vec c = \\vec a + (\\vec b + \\vec c)$, $k(\\vec a + \\vec b) = k\\vec a + k\\vec b$ and $\\vec a + \\vec 0 = \\vec a$. An expression such as $k_1\\vec a + k_2\\vec b$ is a **linear combination**. Anything that obeys these rules is, in the abstract, a [[vector-spaces|vector space]].

### In physics
Forces acting on one body add as vectors to the **net force**. When the arrows, drawn tip to tail, close into a loop, they sum to zero and the body is in [[physics:static-equilibrium|equilibrium]] — the idea behind every [[physics:free-body-diagrams|free-body diagram]]. Velocities add too: a boat heading straight across a river at 3 m/s in a current of 4 m/s moves at 5 m/s over the ground ([[physics:relative-velocity|relative velocity]]).
`,
  ideas: [
    'Add vectors tip to tail: the sum runs from the first tail to the last tip.',
    'In components, vectors add part by part: x with x, y with y.',
    'The length of a sum is at most the sum of the lengths (the triangle inequality).',
    'Multiplying by k scales the length by |k| and reverses the direction if k is negative.',
    'a − b, drawn from a common tail, points from the tip of b to the tip of a.'
  ],
  pitfalls: [
    'Magnitudes add — Only for parallel vectors. Forces of 3 N and 4 N at right angles give 5 N; opposed, they give 1 N.',
    'a − b points from a to b — It points from the tip of b to the tip of a, because b + (a − b) = a.',
    'Adding the angles of two vectors gives the angle of the sum — Angles do not add; convert to components, add, and convert back.'
  ],
  derivation: {
    title: 'Why components add separately',
    steps: [
      { text: 'Write each vector with the unit vectors:', tex: '\\vec a + \\vec b = (a_x\\hat\\imath + a_y\\hat\\jmath) + (b_x\\hat\\imath + b_y\\hat\\jmath)' },
      { text: 'Reorder the terms (addition is commutative and associative):', tex: '= a_x\\hat\\imath + b_x\\hat\\imath + a_y\\hat\\jmath + b_y\\hat\\jmath' },
      { text: 'Collect each unit vector (scaling distributes over addition of numbers):', tex: '= (a_x + b_x)\\,\\hat\\imath + (a_y + b_y)\\,\\hat\\jmath' },
      { text: 'Geometrically: the $x$-shadow of a chain of arrows is the chain of their $x$-shadows, and the same holds for $y$.' }
    ]
  },
  formulas: [
    {
      name: 'Length of the sum of two vectors',
      expr: 'R = sqrt(a^2 + b^2 + 2*a*b*cos(theta))', tex: 'R = \\sqrt{a^2 + b^2 + 2ab\\cos\\theta}',
      vars: {
        R: { name: 'length of the sum |a + b|' },
        a: { name: 'length of a', value: 4 },
        b: { name: 'length of b', value: 3 },
        theta: { name: 'angle between a and b (tails together)', q: 'angle', unit: '°', value: 60, min: 0, max: 180 }
      },
      note: 'At 0° the lengths add, at 180° they subtract, and at 90° this is Pythagoras.',
      stories: {
        R: 'Two ropes pull a post with forces of {a} and {b} units, at {theta} to each other. How large is their combined pull?',
        theta: 'Two forces of {a} and {b} units combine into a single force of {R} units. What is the angle between them?'
      }
    }
  ],
  examples: [
    {
      title: 'Crossing a river',
      q: 'A boat points straight across a 120 m wide river and moves through the water at 3 m/s. The current flows at 4 m/s. How fast does the boat move over the ground, in which direction, and where does it land?',
      steps: [
        'Across the river: $3$ m/s. Downstream: $4$ m/s. They are perpendicular, so the ground speed is $\\sqrt{3^2 + 4^2} = 5$ m/s.',
        'Direction: $\\arctan(4/3) = 53.1°$ downstream of straight across.',
        'Only the across-part gets it to the far bank: time $= 120 / 3 = 40$ s.',
        'Meanwhile the current carries it $4 \\times 40 = 160$ m downstream.'
      ],
      a: '5 m/s at 53° downstream; it lands 160 m downstream after 40 s.'
    },
    {
      title: 'Three forces on a ring',
      q: 'A ring is pulled by 40 N along $+x$, 30 N along $+y$ and 50 N at 210° from the $+x$ axis. Find the net force. What single extra force would hold the ring still?',
      steps: [
        'Components of the third force: $50(\\cos 210°, \\sin 210°) = (-43.3, -25.0)$ N.',
        'Add: $x$: $40 + 0 - 43.3 = -3.3$ N; $y$: $0 + 30 - 25.0 = 5.0$ N.',
        'Size: $\\sqrt{3.3^2 + 5.0^2} = 6.0$ N. Direction: second quadrant, $180° - \\arctan(5.0/3.3) = 123.4°$.',
        'The balancing force is the negative, $(3.3, -5.0)$ N: 6.0 N at $-56.6°$.'
      ],
      a: 'Net force about 6.0 N at 123°; add 6.0 N at −57° to balance it.'
    }
  ],
  quiz: [
    { q: 'Forces of 6 N and 8 N act on the same object. The size of their sum cannot be…', choices: ['2 N', '10 N', '14 N', '15 N'], a: 3,
      why: 'By the triangle inequality the sum lies between $8 - 6 = 2$ N (opposed) and $8 + 6 = 14$ N (together). 10 N is the perpendicular case.' },
    { q: 'Drawn from a common tail, the vector $\\vec a - \\vec b$ runs…', choices: ['from the tip of $\\vec a$ to the tip of $\\vec b$', 'from the tip of $\\vec b$ to the tip of $\\vec a$', 'along the long diagonal of the parallelogram', 'from the origin to the tip of $\\vec b$'], a: 1,
      why: 'Starting at the tip of $\\vec b$ and adding $\\vec a - \\vec b$ must land on the tip of $\\vec a$, since $\\vec b + (\\vec a - \\vec b) = \\vec a$.' },
    { q: 'For two non-zero vectors, $|\\vec a + \\vec b| = |\\vec a| + |\\vec b|$ only when they point the same way.', a: true,
      why: 'Equality in the triangle inequality needs the arrows to line up, tip to tail, in a straight line — parallel and in the same direction.' },
    { q: 'With $\\vec a = (x, 1)$ and $\\vec b = (2, x)$, write the $x$-component of $3\\vec a - \\vec b$.', answer: '3x - 2', vars: ['x'],
      why: 'Work component by component: $3 \\cdot x - 2 = 3x - 2$. (The $y$-component is $3 - x$.)' },
    { q: 'An aircraft heads north at 200 km/h through the air while the wind blows east at 50 km/h. Its speed over the ground is about…', choices: ['150 km/h', '200 km/h', '206 km/h', '250 km/h'], a: 2,
      why: 'The two velocities are perpendicular: $\\sqrt{200^2 + 50^2} = 206$ km/h, drifting 14° east of north.' }
  ],
  problems: [
    { q: 'Add $(2, -1, 4)$ and $(-5, 3, 0)$. How long is the sum?', answer: 5.385, tol: 0.01,
      steps: ['Add component by component: $(2 - 5, -1 + 3, 4 + 0) = (-3, 2, 4)$.', 'Length: $\\sqrt{9 + 4 + 16} = \\sqrt{29} = 5.385$.'] }
  ],
  applications: [
    'Net force on a structure, a vehicle or a body in a free-body diagram.',
    'Aircraft and ship navigation: heading plus wind or current gives the track over the ground.',
    'Robotics: the position of a gripper is the vector sum of the links of the arm.'
  ],
  sim: 'vlc-vector-add'
},

{
  id: 'dot-product', parent: 'vector-algebra', title: 'The dot product', level: 2,
  short: 'Multiplying two vectors to get a number: the product of their lengths and the cosine of the angle between them — large when they agree, zero when they are perpendicular.',
  keywords: ['dot product', 'scalar product', 'inner product', 'angle between vectors', 'perpendicular', 'orthogonal', 'cosine', 'work', 'cosine similarity'],
  prereq: ['vector-components', 'vector-addition', 'law-of-cosines'],
  related: ['vector-projection', 'cross-product', 'matrix-multiplication', 'physics:work', 'physics:power', 'physics:magnetic-flux'],
  body: `
### Two ways to say the same thing
The **dot product** (or scalar product) of two vectors is a single number. In components, multiply matching entries and add:

$$\\vec a \\cdot \\vec b = a_x b_x + a_y b_y + a_z b_z$$

Geometrically, it is the product of the two lengths and the cosine of the angle between the arrows, placed tail to tail:

$$\\vec a \\cdot \\vec b = |\\vec a|\\,|\\vec b|\\cos\\theta$$

That these two agree is a small theorem, proved below. For $\\vec a = (3, 1)$ and $\\vec b = (1, 2)$ the first formula gives $3 + 2 = 5$; the lengths are $\\sqrt{10}$ and $\\sqrt 5$, so $\\cos\\theta = 5/\\sqrt{50} = 0.707$ and the angle is 45°.

### What the number means
Read it as "how much the two vectors agree". Drop a perpendicular from the tip of $\\vec b$ onto the line of $\\vec a$: the signed length of that shadow is $|\\vec b|\\cos\\theta$, and the dot product is the shadow times $|\\vec a|$.

- Acute angle: positive. Pointing the same way: the largest possible value, $|\\vec a||\\vec b|$.
- **Right angle: zero.** Perpendicular vectors are called **orthogonal**, and $\\vec a\\cdot\\vec b = 0$ is the quickest test for it.
- Obtuse angle: negative. Pointing opposite ways: $-|\\vec a||\\vec b|$.

A vector dotted with itself gives its length squared, $\\vec a\\cdot\\vec a = |\\vec a|^2$, and the unit vectors satisfy $\\hat\\imath\\cdot\\hat\\imath = 1$ and $\\hat\\imath\\cdot\\hat\\jmath = 0$.

### Rules
The dot product is **commutative**, $\\vec a\\cdot\\vec b = \\vec b\\cdot\\vec a$, and **distributive**, $\\vec a\\cdot(\\vec b + \\vec c) = \\vec a\\cdot\\vec b + \\vec a\\cdot\\vec c$, and numbers pull out of it. But there is no cancelling: $\\vec a\\cdot\\vec b = \\vec a\\cdot\\vec c$ does **not** imply $\\vec b = \\vec c$, because $\\vec b$ and $\\vec c$ may differ by anything perpendicular to $\\vec a$. And a "product of three", $\\vec a\\cdot\\vec b\\cdot\\vec c$, makes no sense, since $\\vec a\\cdot\\vec b$ is already a number.

### Finding angles
Rearranged, the two forms give the angle between any two vectors, in any number of dimensions:

$$\\cos\\theta = \\frac{\\vec a\\cdot\\vec b}{|\\vec a|\\,|\\vec b|}$$

The angle between a cube's long diagonal $(1, 1, 1)$ and one of its edges $(1, 0, 0)$ is $\\arccos(1/\\sqrt 3) = 54.7°$ — something hard to see in a drawing and easy to compute.

### In physics and beyond
**Work** is the classic case. A force $\\vec F$ acting through a displacement $\\vec d$ does work $W = \\vec F\\cdot\\vec d = Fd\\cos\\theta$: only the part of the force along the motion counts, and a force at right angles to the motion — the string on a whirled stone, gravity on a satellite in a circular orbit — does none ([[physics:work|work]]). The same pattern gives power $P = \\vec F\\cdot\\vec v$ ([[physics:power|power]]) and magnetic flux $\\Phi = \\vec B\\cdot\\vec A$ ([[physics:magnetic-flux|magnetic flux]]). Outside physics the dot product measures similarity: search engines and recommender systems compare long lists of numbers by the cosine of the angle between them. And every entry of a [[matrix-multiplication|matrix product]] is a dot product of a row with a column.
`,
  ideas: [
    'a · b = aₓbₓ + a_y b_y + a_z b_z = |a||b| cos θ: a number, not a vector.',
    'Positive for an acute angle, zero for a right angle, negative for an obtuse one.',
    'Two non-zero vectors are perpendicular exactly when their dot product is zero.',
    'a · a is the length squared; cos θ = a · b / (|a||b|) gives the angle between two vectors.',
    'Work is a dot product: only the part of the force along the motion does work.'
  ],
  pitfalls: [
    'The dot product is a vector — It is a scalar. That is why it is also called the scalar product, and why a · b · c is meaningless.',
    'If a · b = a · c then b = c — Not necessarily: b − c only has to be perpendicular to a.',
    'A zero dot product means one of the vectors is zero — It usually means they are perpendicular.'
  ],
  derivation: {
    title: 'Why the component formula equals |a||b| cos θ',
    steps: [
      { text: 'The vectors $\\vec a$, $\\vec b$ and $\\vec a - \\vec b$ form a triangle, with angle $\\theta$ between the first two. The law of cosines says', tex: '|\\vec a - \\vec b|^2 = |\\vec a|^2 + |\\vec b|^2 - 2|\\vec a||\\vec b|\\cos\\theta' },
      { text: 'Now expand the left side in components:', tex: '|\\vec a - \\vec b|^2 = \\sum (a_i - b_i)^2 = \\sum a_i^2 + \\sum b_i^2 - 2\\sum a_i b_i' },
      { text: 'The sums of squares are $|\\vec a|^2$ and $|\\vec b|^2$, which cancel against the right side, leaving', tex: '\\sum a_i b_i = |\\vec a|\\,|\\vec b|\\cos\\theta' },
      { text: 'So the quick component recipe and the geometric definition are the same number. Because the right side does not mention any axes, the left side cannot depend on the choice of axes either.' }
    ]
  },
  formulas: [
    {
      name: 'Dot product from components',
      expr: 'D = ax*bx + ay*by + az*bz', tex: 'D = \\vec a\\cdot\\vec b = a_x b_x + a_y b_y + a_z b_z',
      vars: {
        D: { name: 'dot product a · b', signed: true },
        ax: { tex: 'a_x', name: 'x-component of a', value: 3, signed: true },
        ay: { tex: 'a_y', name: 'y-component of a', value: 1, signed: true },
        az: { tex: 'a_z', name: 'z-component of a', value: 2, signed: true },
        bx: { tex: 'b_x', name: 'x-component of b', value: 1, signed: true },
        by: { tex: 'b_y', name: 'y-component of b', value: 2, signed: true },
        bz: { tex: 'b_z', name: 'z-component of b', value: -1, signed: true }
      },
      note: 'Set the result to 0 and solve for one component to make the two vectors perpendicular.'
    },
    {
      name: 'Dot product from lengths and angle',
      expr: 'D = a*b*cos(theta)', tex: 'D = a\\,b\\cos\\theta',
      vars: {
        D: { name: 'dot product a · b', signed: true },
        a: { name: 'length of a', value: 5 },
        b: { name: 'length of b', value: 4 },
        theta: { name: 'angle between them', q: 'angle', unit: '°', value: 60, min: 0, max: 180 }
      },
      stories: { D: 'Vectors of lengths {a} and {b} meet at {theta}. What is their dot product?', theta: 'Two vectors of lengths {a} and {b} have dot product {D}. What angle is between them?' }
    },
    {
      name: 'Angle between two vectors in the plane',
      expr: 'cos(theta) = (ax*bx + ay*by)/(sqrt(ax^2 + ay^2)*sqrt(bx^2 + by^2))',
      tex: '\\cos\\theta = \\frac{a_x b_x + a_y b_y}{\\sqrt{a_x^2 + a_y^2}\\,\\sqrt{b_x^2 + b_y^2}}', solveFor: 'theta',
      vars: {
        theta: { name: 'angle between a and b', q: 'angle', unit: '°', min: 0, max: 180 },
        ax: { tex: 'a_x', name: 'x-component of a', value: 3, signed: true },
        ay: { tex: 'a_y', name: 'y-component of a', value: 1, signed: true },
        bx: { tex: 'b_x', name: 'x-component of b', value: 1, signed: true },
        by: { tex: 'b_y', name: 'y-component of b', value: 2, signed: true }
      },
      practice: { unknowns: ['theta'] }
    }
  ],
  examples: [
    {
      title: 'Work done pulling a suitcase',
      q: 'You pull a suitcase 25 m along a level platform with a force of 60 N, directed 40° above the horizontal. How much work do you do?',
      steps: [
        'Displacement $\\vec d = (25, 0)$ m; force $\\vec F = 60(\\cos 40°, \\sin 40°) = (46.0, 38.6)$ N.',
        '$W = \\vec F\\cdot\\vec d = 46.0 \\times 25 + 38.6 \\times 0 = 1149$ J.',
        'Or directly: $W = Fd\\cos\\theta = 60 \\times 25 \\times \\cos 40° = 1149$ J.',
        'The upward 38.6 N does no work: it is perpendicular to the motion.'
      ],
      a: 'About 1.15 kJ.'
    },
    {
      title: 'Is the triangle right-angled?',
      q: 'Show that the triangle with corners $A(1, 2, 0)$, $B(3, 3, 1)$ and $C(0, 3, 1)$ has a right angle, and find its angle at $B$.',
      steps: [
        'Edges from $A$: $\\overrightarrow{AB} = (2, 1, 1)$ and $\\overrightarrow{AC} = (-1, 1, 1)$.',
        '$\\overrightarrow{AB}\\cdot\\overrightarrow{AC} = -2 + 1 + 1 = 0$, so the angle at $A$ is 90°.',
        'At $B$: $\\overrightarrow{BA} = (-2, -1, -1)$ and $\\overrightarrow{BC} = (-3, 0, 0)$, with dot product 6 and lengths $\\sqrt 6$ and 3.',
        '$\\cos B = 6 / (3\\sqrt 6) = 0.816$, so $B = 35.3°$, and the third angle is $90° - 35.3° = 54.7°$.'
      ],
      a: 'Right angle at A; the angle at B is 35.3°.'
    }
  ],
  quiz: [
    { q: 'If $\\vec a\\cdot\\vec b < 0$, the angle between the two vectors is…', choices: ['acute', 'a right angle', 'obtuse', 'impossible to tell'], a: 2,
      why: 'The lengths are positive, so the sign comes from $\\cos\\theta$, which is negative between 90° and 180°.' },
    { q: 'Gravity pulls a satellite in a circular orbit towards the planet\'s centre, always at right angles to its velocity. Over one orbit, gravity does…', choices: ['positive work', 'no work', 'negative work', 'work equal to the kinetic energy'], a: 1,
      why: 'For every small step $\\vec F\\cdot d\\vec r = 0$ because the force is perpendicular to the motion. The speed, and the kinetic energy, stay constant.' },
    { q: 'Find $\\vec a\\cdot\\vec b$ for $\\vec a = (x, 2, -1)$ and $\\vec b = (3, x, 4)$.', answer: '5x - 4', vars: ['x'],
      why: '$x \\cdot 3 + 2 \\cdot x + (-1) \\cdot 4 = 3x + 2x - 4 = 5x - 4$. The vectors are perpendicular when $x = 0.8$.' },
    { q: 'If $\\vec a\\cdot\\vec b = \\vec a\\cdot\\vec c$ and $\\vec a \\ne \\vec 0$, then $\\vec b = \\vec c$.', a: false,
      why: 'The equation only says $\\vec a\\cdot(\\vec b - \\vec c) = 0$: the difference must be perpendicular to $\\vec a$, not zero. For example $\\hat\\imath\\cdot\\hat\\jmath = \\hat\\imath\\cdot\\hat k = 0$.' },
    { q: 'For which $k$ are $(2, k)$ and $(3, -6)$ perpendicular?', choices: ['$k = -1$', '$k = 1$', '$k = 4$', '$k = -4$'], a: 1,
      why: 'Perpendicular means a zero dot product: $6 - 6k = 0$, so $k = 1$.' }
  ],
  problems: [
    { q: 'Find the angle between a cube\'s long diagonal $(1, 1, 1)$ and one of its edges $(1, 0, 0)$, in degrees.', answer: 54.74, unit: '°', tol: 0.01,
      steps: ['Dot product: $1$. Lengths: $\\sqrt 3$ and 1.', '$\\cos\\theta = 1/\\sqrt 3 = 0.5774$, so $\\theta = 54.74°$.'] }
  ],
  applications: [
    'Work, power and flux in physics: each is a dot product.',
    'Computer graphics: the brightness of a matt surface is proportional to the dot product of its unit normal with the direction of the light.',
    'Search and machine learning: the cosine of the angle between two long vectors measures how similar two documents or users are.',
    'Checking that parts meet at right angles in CAD models.'
  ],
  sim: 'vlc-dot-product'
},

{
  id: 'cross-product', parent: 'vector-algebra', title: 'The cross product', level: 2,
  short: 'Multiplying two vectors in space to get a third, perpendicular to both, whose length is the area of the parallelogram they span.',
  keywords: ['cross product', 'vector product', 'right-hand rule', 'perpendicular', 'normal vector', 'parallelogram area', 'triple product', 'torque', 'angular momentum', 'determinant'],
  prereq: ['vector-components', 'dot-product'],
  related: ['determinants', 'curl', 'vector-projection', 'physics:torque', 'physics:angular-momentum', 'physics:lorentz-force', 'physics:force-on-current'],
  body: `
### A product that makes a new direction
Two vectors in space that are not parallel span a plane, and there is exactly one line through the origin perpendicular to that plane. The **cross product** $\\vec a\\times\\vec b$ is the vector along that line with length

$$|\\vec a\\times\\vec b| = |\\vec a|\\,|\\vec b|\\sin\\theta$$

which is exactly the **area of the parallelogram** with sides $\\vec a$ and $\\vec b$ (base $|\\vec a|$, height $|\\vec b|\\sin\\theta$). Parallel vectors span no area, so their cross product is the zero vector; perpendicular ones give the most, $|\\vec a||\\vec b|$.

### The right-hand rule
The line has two directions, and the cross product takes the one given by your **right hand**: point the fingers along $\\vec a$ and curl them towards $\\vec b$ through the smaller angle; the thumb points along $\\vec a\\times\\vec b$. For the unit vectors this gives $\\hat\\imath\\times\\hat\\jmath = \\hat k$, $\\hat\\jmath\\times\\hat k = \\hat\\imath$ and $\\hat k\\times\\hat\\imath = \\hat\\jmath$ — each in cyclic order — while the reverse order gives minus signs. Coordinate axes are always drawn so that this works: a **right-handed** system.

### In components
Multiplying out $(a_x\\hat\\imath + a_y\\hat\\jmath + a_z\\hat k)\\times(b_x\\hat\\imath + b_y\\hat\\jmath + b_z\\hat k)$ term by term (see the derivation) gives

$$\\vec a\\times\\vec b = (a_y b_z - a_z b_y,\\; a_z b_x - a_x b_z,\\; a_x b_y - a_y b_x)$$

which is easiest to remember as a [[determinants|determinant]] expanded along its top row:

$$\\vec a\\times\\vec b = \\begin{vmatrix} \\hat\\imath & \\hat\\jmath & \\hat k \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{vmatrix}$$

For $\\vec a = (1, 2, 0)$ and $\\vec b = (3, 1, 0)$: $\\vec a\\times\\vec b = (0, 0, 1 - 6) = (0, 0, -5)$. Both vectors lie in the $xy$-plane, so the product points along the $z$-axis — downwards, because turning from $\\vec a$ to $\\vec b$ is clockwise seen from above. A useful check: $\\vec a\\cdot(\\vec a\\times\\vec b)$ and $\\vec b\\cdot(\\vec a\\times\\vec b)$ are always zero.

### Unusual rules
- **Anticommutative**: $\\vec b\\times\\vec a = -\\,\\vec a\\times\\vec b$. The order matters.
- $\\vec a\\times\\vec a = \\vec 0$ for every vector.
- **Not associative**: $(\\hat\\imath\\times\\hat\\imath)\\times\\hat\\jmath = \\vec 0$, but $\\hat\\imath\\times(\\hat\\imath\\times\\hat\\jmath) = \\hat\\imath\\times\\hat k = -\\hat\\jmath$.
- It does distribute over addition, and numbers pull out.
- It belongs to three dimensions. In the plane its role is played by the number $a_x b_y - a_y b_x$, the **signed area**: positive when $\\vec b$ lies anticlockwise from $\\vec a$.

### The triple product and volume
Combining the two products, $\\vec a\\cdot(\\vec b\\times\\vec c)$ is the **volume** of the slanted box (the parallelepiped) with edges $\\vec a$, $\\vec b$ and $\\vec c$ — positive if they form a right-handed set — and it equals the $3\\times 3$ determinant of their components. It vanishes exactly when the three vectors lie in one plane.

### In physics
Wherever something turns, a cross product appears: [[physics:torque|torque]] $\\vec\\tau = \\vec r\\times\\vec F$, [[physics:angular-momentum|angular momentum]] $\\vec L = \\vec r\\times\\vec p$, and the velocity $\\vec v = \\vec\\omega\\times\\vec r$ of a point on a spinning body. The magnetic force on a moving charge, $\\vec F = q\\,\\vec v\\times\\vec B$ ([[physics:lorentz-force|Lorentz force]]), is always perpendicular to the velocity, so it can steer the charge but never speed it up. And the [[curl]] of a field is a cross product with the operator $\\nabla$.
`,
  ideas: [
    'a × b is a vector perpendicular to both a and b.',
    'Its length |a||b| sin θ is the area of the parallelogram they span.',
    'Its direction follows the right-hand rule; reversing the order reverses it.',
    'Parallel vectors have a zero cross product.',
    'Torque, angular momentum and the magnetic force are all cross products.'
  ],
  pitfalls: [
    'a × b = b × a — The cross product is anticommutative: b × a = −(a × b). Swapping the order flips the arrow.',
    'Using the left hand, or a left-handed set of axes — The formula assumes x, y, z are right-handed (î × ĵ = k̂). With mirrored axes every cross product comes out reversed.',
    'The cross product works in any dimension like the dot product — It is special to three dimensions; in the plane use the signed area aₓb_y − a_y bₓ instead.'
  ],
  derivation: {
    title: 'The component formula from the unit vectors',
    steps: [
      { text: 'The unit vectors multiply cyclically, with minus signs the other way round, and each gives zero with itself:', tex: '\\hat\\imath\\times\\hat\\jmath = \\hat k,\\quad \\hat\\jmath\\times\\hat k = \\hat\\imath,\\quad \\hat k\\times\\hat\\imath = \\hat\\jmath,\\quad \\hat\\imath\\times\\hat\\imath = \\vec 0' },
      { text: 'Expand $(a_x\\hat\\imath + a_y\\hat\\jmath + a_z\\hat k)\\times(b_x\\hat\\imath + b_y\\hat\\jmath + b_z\\hat k)$ into nine terms; three vanish and six remain:', tex: 'a_x b_y\\,\\hat k - a_x b_z\\,\\hat\\jmath - a_y b_x\\,\\hat k + a_y b_z\\,\\hat\\imath + a_z b_x\\,\\hat\\jmath - a_z b_y\\,\\hat\\imath' },
      { text: 'Collect the unit vectors:', tex: '\\vec a\\times\\vec b = (a_y b_z - a_z b_y)\\,\\hat\\imath + (a_z b_x - a_x b_z)\\,\\hat\\jmath + (a_x b_y - a_y b_x)\\,\\hat k' },
      { text: 'Squaring and adding the three components gives Lagrange\'s identity, which confirms the length:', tex: '|\\vec a\\times\\vec b|^2 = |\\vec a|^2|\\vec b|^2 - (\\vec a\\cdot\\vec b)^2 = |\\vec a|^2|\\vec b|^2\\sin^2\\theta' }
    ]
  },
  formulas: [
    {
      name: 'Length of the cross product (parallelogram area)',
      expr: 'C = a*b*sin(theta)', tex: 'C = a\\,b\\sin\\theta',
      vars: {
        C: { name: 'length of a × b (area of the parallelogram)' },
        a: { name: 'length of a', value: 3 },
        b: { name: 'length of b', value: 2 },
        theta: { name: 'angle between a and b', q: 'angle', unit: '°', value: 30, min: 0, max: 180 }
      },
      note: 'Solving for the angle gives two answers, θ and 180° − θ: both parallelograms have the same area.',
      stories: { C: 'Two sides of a parallelogram have lengths {a} and {b} and meet at {theta}. What is its area?' }
    },
    {
      name: 'z-component of a × b (signed area in the plane)',
      expr: 'cz = ax*by - ay*bx', tex: 'c_z = a_x b_y - a_y b_x',
      vars: {
        cz: { tex: 'c_z', name: 'z-component of a × b', signed: true },
        ax: { tex: 'a_x', name: 'x-component of a', value: 1, signed: true },
        ay: { tex: 'a_y', name: 'y-component of a', value: 2, signed: true },
        bx: { tex: 'b_x', name: 'x-component of b', value: 3, signed: true },
        by: { tex: 'b_y', name: 'y-component of b', value: 1, signed: true }
      },
      note: 'Cycle the letters $x \\to y \\to z \\to x$ to get the other two components: $c_x = a_y b_z - a_z b_y$, $c_y = a_z b_x - a_x b_z$.'
    }
  ],
  examples: [
    {
      title: 'Area of a triangle in space',
      q: 'Find the area of the triangle with corners $P(1, 0, 0)$, $Q(0, 2, 0)$ and $R(0, 0, 3)$, and the equation of the plane it lies in.',
      steps: [
        'Edges from $P$: $\\overrightarrow{PQ} = (-1, 2, 0)$ and $\\overrightarrow{PR} = (-1, 0, 3)$.',
        '$\\overrightarrow{PQ}\\times\\overrightarrow{PR} = (2\\cdot 3 - 0\\cdot 0,\\; 0\\cdot(-1) - (-1)\\cdot 3,\\; (-1)\\cdot 0 - 2\\cdot(-1)) = (6, 3, 2)$.',
        'Its length is $\\sqrt{36 + 9 + 4} = 7$: the parallelogram has area 7, so the triangle has area 3.5.',
        'The vector $(6, 3, 2)$ is normal to the plane, which is therefore $6x + 3y + 2z = 6$ (put in $P$ to find the 6; $Q$ and $R$ fit too).'
      ],
      a: 'Area 3.5; the plane is 6x + 3y + 2z = 6.'
    },
    {
      title: 'Turning a bolt',
      q: 'A spanner 0.25 m long lies along the $x$-axis from the bolt. You push its end with 80 N in the $xy$-plane, at 60° to the handle. Find the torque $\\vec\\tau = \\vec r\\times\\vec F$.',
      steps: [
        '$\\vec r = (0.25, 0, 0)$ m and $\\vec F = 80(\\cos 60°, \\sin 60°, 0) = (40, 69.3, 0)$ N.',
        'Only the $z$-component survives: $\\tau_z = r_x F_y - r_y F_x = 0.25 \\times 69.3 - 0 = 17.3$ N·m.',
        'Check with the lengths: $rF\\sin\\theta = 0.25 \\times 80 \\times \\sin 60° = 17.3$ N·m.',
        'The torque points along $+z$, the axis of the bolt; pushing at 90° instead would give the maximum, 20 N·m.'
      ],
      a: '17.3 N·m along the bolt\'s axis (+z).'
    }
  ],
  quiz: [
    { q: '$\\hat\\jmath\\times\\hat\\imath$ equals…', choices: ['$\\hat k$', '$-\\hat k$', '$\\vec 0$', '1'], a: 1,
      why: '$\\hat\\imath\\times\\hat\\jmath = \\hat k$, and reversing the order reverses the product.' },
    { q: 'The cross product of two parallel vectors is…', choices: ['the zero vector', 'a unit vector', 'the product of their lengths', 'undefined'], a: 0,
      why: 'They span a parallelogram of zero area ($\\sin 0° = 0$), so the product has length zero.' },
    { q: '$\\vec a\\times\\vec b$ is perpendicular to both $\\vec a$ and $\\vec b$.', a: true,
      why: 'That is how it is built; in components $\\vec a\\cdot(\\vec a\\times\\vec b) = 0$ expands to terms that cancel in pairs.' },
    { q: 'An electron moves along $+x$ through a magnetic field pointing along $+y$. The force $q\\,\\vec v\\times\\vec B$ on it points along…', choices: ['$+z$', '$-z$', '$+y$', '$-x$'], a: 1,
      why: '$\\hat\\imath\\times\\hat\\jmath = \\hat k$, but the electron\'s charge is negative, which reverses the force to $-z$.' },
    { q: 'Find the $z$-component of $(x, 1, 0)\\times(2, x, 0)$.', answer: 'x^2 - 2', vars: ['x'],
      why: '$a_x b_y - a_y b_x = x \\cdot x - 1 \\cdot 2 = x^2 - 2$. It vanishes at $x = \\pm\\sqrt 2$, where the two vectors are parallel.' }
  ],
  problems: [
    { q: 'Find the area of the parallelogram spanned by $(2, 0, 1)$ and $(1, 3, 0)$.', answer: 6.782, tol: 0.01,
      steps: ['$(2, 0, 1)\\times(1, 3, 0) = (0\\cdot 0 - 1\\cdot 3,\\; 1\\cdot 1 - 2\\cdot 0,\\; 2\\cdot 3 - 0\\cdot 1) = (-3, 1, 6)$.', 'Area $= \\sqrt{9 + 1 + 36} = \\sqrt{46} = 6.78$.'] }
  ],
  applications: [
    'Torque on a spanner, a door or a motor: τ = r × F.',
    'Computer graphics finds the normal of every triangle in a mesh with a cross product, for lighting and for deciding which side faces the viewer.',
    'Navigation and robotics: the axis of a rotation, and the angular velocity of a gyroscope.',
    'Electric motors and particle detectors rely on the force q v × B.'
  ],
  history: 'Hamilton\'s quaternions (1843) already contained both products: multiplying two "pure" quaternions gives minus their dot product plus their cross product. Gibbs and Heaviside split the two apart in the 1880s, and the cross product became the tool of choice for torque and electromagnetism.',
  sim: 'vlc-cross-product'
},

{
  id: 'vector-projection', parent: 'vector-algebra', title: 'Projection of one vector on another', level: 2,
  short: 'The shadow of one vector on the line of another: how much of b points along a, as a number (the scalar projection) or as a vector.',
  keywords: ['projection', 'scalar projection', 'vector projection', 'component along', 'resolving', 'orthogonal decomposition', 'perpendicular component', 'distance to a line', 'Gram–Schmidt'],
  prereq: ['dot-product', 'vector-components'],
  related: ['linear-transformations', 'vector-spaces', 'linear-regression', 'physics:inclined-plane', 'physics:work'],
  body: `
### The shadow
Hold a stick in sunlight at noon: its shadow on the ground shows how much of the stick lies along the ground. Projection does the same for vectors. The **scalar projection** of $\\vec b$ onto $\\vec a$ — the *component of $\\vec b$ along $\\vec a$* — is the signed length of the shadow of $\\vec b$ on the line of $\\vec a$:

$$\\operatorname{comp}_{\\vec a}\\vec b = |\\vec b|\\cos\\theta = \\frac{\\vec a\\cdot\\vec b}{|\\vec a|} = \\vec b\\cdot\\hat a$$

It is negative when the angle is obtuse, and the shadow then falls behind the origin. The **vector projection** is the shadow as an arrow, pointing along the line of $\\vec a$:

$$\\operatorname{proj}_{\\vec a}\\vec b = \\frac{\\vec a\\cdot\\vec b}{\\vec a\\cdot\\vec a}\\,\\vec a$$

Only the *direction* of $\\vec a$ matters, not its length: doubling $\\vec a$ leaves both projections unchanged.

### Splitting a vector in two
Every vector splits, in exactly one way, into a part along $\\vec a$ and a part perpendicular to it:

$$\\vec b = \\underbrace{\\operatorname{proj}_{\\vec a}\\vec b}_{\\parallel\\ \\vec a} + \\underbrace{\\left(\\vec b - \\operatorname{proj}_{\\vec a}\\vec b\\right)}_{\\perp\\ \\vec a}$$

(Dot the second part with $\\vec a$ to check that it gives zero.) Resolving a force along and across a slope, a rope or a rail is exactly this, and the familiar components $v_x = \\vec v\\cdot\\hat\\imath$ of [[vector-components]] are projections onto the axes. The two parts are perpendicular, so their lengths obey Pythagoras: $|\\vec b|^2 = (\\text{along})^2 + (\\text{across})^2$.

### Worked numbers
For $\\vec a = (4, 0)$ and $\\vec b = (3, 2)$: $\\vec a\\cdot\\vec b = 12$ and $|\\vec a| = 4$, so the scalar projection is 3 and the vector projection is $(3, 0)$ — just the $x$-part, as it must be for an $\\vec a$ along the $x$-axis. The perpendicular remainder is $(0, 2)$.

### The closest point
The foot of the perpendicular is the point on the line of $\\vec a$ **closest** to the tip of $\\vec b$, and the perpendicular part is the shortest distance from the tip to that line. So projections answer distance questions — from a point to a line or to a plane — and, more generally, find the best approximation of a vector inside a smaller space. Least-squares fitting ([[linear-regression|fitting a line to data]]) is this idea in many dimensions: the fitted values are the projection of the measured data onto the space of all possible straight-line predictions.

### Projection as a machine
The map that sends $\\vec b$ to $\\operatorname{proj}_{\\vec a}\\vec b$ is a [[linear-transformations|linear transformation]]. In the plane, projecting onto the unit vector $\\hat u = (u_x, u_y)$ is multiplication by the matrix

$$P = \\begin{pmatrix} u_x^2 & u_x u_y \\\\ u_x u_y & u_y^2 \\end{pmatrix}$$

Projecting twice gives nothing new, $P^2 = P$ — the defining property of a projection. Subtracting projections one after another to make a set of vectors mutually perpendicular is the **Gram–Schmidt process**, the standard way to build a perpendicular basis of unit vectors ([[vector-spaces]]).
`,
  ideas: [
    'The scalar projection of b on a is a · b / |a|: the signed length of b\'s shadow on the line of a.',
    'The vector projection is (a · b / a · a) a, an arrow along a.',
    'Any vector splits uniquely into a part along a and a part perpendicular to a.',
    'The perpendicular part gives the shortest distance from a point to a line.',
    'Only the direction of a matters: scaling a does not change the projection.'
  ],
  pitfalls: [
    'Dividing by |a| in the vector projection — The vector projection divides by |a|² (that is, a · a), because it multiplies by a itself, not by the unit vector.',
    'The projection of b onto a equals the projection of a onto b — They lie along different lines and have different lengths, unless |a| = |b|.',
    'A projection can be longer than the original — Never: its length is |b||cos θ| ≤ |b|.'
  ],
  formulas: [
    {
      name: 'Scalar projection of b onto a (plane)',
      expr: 's = (ax*bx + ay*by)/sqrt(ax^2 + ay^2)', tex: 's = \\frac{a_x b_x + a_y b_y}{\\sqrt{a_x^2 + a_y^2}}',
      vars: {
        s: { name: 'scalar projection (signed length of the shadow)', signed: true },
        ax: { tex: 'a_x', name: 'x-component of a', value: 4, signed: true },
        ay: { tex: 'a_y', name: 'y-component of a', value: 1, signed: true },
        bx: { tex: 'b_x', name: 'x-component of b', value: 3, signed: true },
        by: { tex: 'b_y', name: 'y-component of b', value: 2, signed: true }
      },
      practice: { unknowns: ['s', 'bx', 'by'] }
    },
    {
      name: 'Distance from the tip of b to the line of a (plane)',
      expr: 'd = abs(ax*by - ay*bx)/sqrt(ax^2 + ay^2)', tex: 'd = \\frac{\\left| a_x b_y - a_y b_x \\right|}{\\sqrt{a_x^2 + a_y^2}}',
      vars: {
        d: { name: 'perpendicular distance' },
        ax: { tex: 'a_x', name: 'x-component of a', value: 4, signed: true },
        ay: { tex: 'a_y', name: 'y-component of a', value: 1, signed: true },
        bx: { tex: 'b_x', name: 'x-component of b', value: 3, signed: true },
        by: { tex: 'b_y', name: 'y-component of b', value: 2, signed: true }
      },
      note: 'The numerator is the parallelogram area (the cross product in the plane); dividing by the base $|\\vec a|$ leaves the height. Along with the scalar projection $s$, $s^2 + d^2 = |\\vec b|^2$.',
      practice: { unknowns: ['d'] },
      stories: { d: 'A straight path runs from the origin in the direction ({ax}, {ay}). How far from the path is the point ({bx}, {by})?' }
    }
  ],
  examples: [
    {
      title: 'Along and across a hill',
      q: 'A car weighing 12 000 N stands on a road that slopes down at 25°. Use a projection to find the part of its weight pulling it down the road, and the part pressing into the road.',
      steps: [
        'Weight $\\vec W = (0, -12000)$ N. Unit vector down the road: $\\hat d = (\\cos 25°, -\\sin 25°) = (0.906, -0.423)$.',
        'Along the road: $\\vec W\\cdot\\hat d = 0 \\times 0.906 + (-12000)(-0.423) = 5071$ N — the familiar $W\\sin 25°$.',
        'Across the road: $\\sqrt{12000^2 - 5071^2} = 10876$ N, which is $W\\cos 25°$.',
        'The brakes (or friction) must supply 5.07 kN to hold the car.'
      ],
      a: '5.07 kN down the slope, 10.9 kN into the road.'
    },
    {
      title: 'Distance from a point to a line',
      q: 'How far is the point $P(5, 0)$ from the line through the origin in the direction $(3, 4)$, and which point of the line is closest?',
      steps: [
        'Take $\\vec a = (3, 4)$ and $\\vec b = (5, 0)$: $\\vec a\\cdot\\vec b = 15$, $\\vec a\\cdot\\vec a = 25$.',
        'Vector projection: $\\tfrac{15}{25}(3, 4) = (1.8, 2.4)$ — the closest point of the line.',
        'Perpendicular part: $(5, 0) - (1.8, 2.4) = (3.2, -2.4)$, of length $\\sqrt{10.24 + 5.76} = 4$.',
        'Check with the area formula: $|3 \\cdot 0 - 4 \\cdot 5| / 5 = 4$.'
      ],
      a: 'Distance 4; the nearest point is (1.8, 2.4).'
    }
  ],
  quiz: [
    { q: 'The scalar projection of $\\vec b$ onto $\\vec a$ is negative. This means…', choices: ['$\\vec b$ is shorter than $\\vec a$', 'the angle between them is obtuse', 'they are perpendicular', 'the shadow is longer than $\\vec b$'], a: 1,
      why: 'The scalar projection is $|\\vec b|\\cos\\theta$, negative only when $\\theta$ is between 90° and 180°.' },
    { q: 'Replacing $\\vec a$ by $3\\vec a$ changes $\\operatorname{proj}_{\\vec a}\\vec b$ how?', choices: ['it triples', 'it is divided by 3', 'it does not change', 'it is multiplied by 9'], a: 2,
      why: 'In $\\frac{\\vec a\\cdot\\vec b}{\\vec a\\cdot\\vec a}\\vec a$ the factor 3 appears once in the numerator, twice in the denominator and once more outside: it cancels. Only the line matters.' },
    { q: 'The projection of $\\vec b$ onto any line is never longer than $\\vec b$.', a: true,
      why: 'Its length is $|\\vec b||\\cos\\theta|$ and $|\\cos\\theta| \\le 1$. A shadow on the ground is never longer than the stick lying flat.' },
    { q: 'Write the scalar projection of $\\vec b = (x, 5)$ onto $\\vec a = (3, 4)$.', answer: '(3x + 20)/5', vars: ['x'],
      why: '$\\vec a\\cdot\\vec b = 3x + 20$ and $|\\vec a| = 5$, so the projection is $(3x + 20)/5 = 0.6x + 4$.' },
    { q: 'Which of these is always perpendicular to $\\vec a$: $\\vec b - \\operatorname{proj}_{\\vec a}\\vec b$, or $\\operatorname{proj}_{\\vec a}\\vec b$?', choices: ['the first', 'the second', 'both', 'neither'], a: 0,
      why: 'The projection lies along $\\vec a$; what is left of $\\vec b$ after removing it is the perpendicular part.' }
  ],
  problems: [
    { q: 'How far is the point $(2, 7)$ from the line through the origin in the direction $(1, 1)$?', answer: 3.536, tol: 0.01,
      steps: ['With $\\vec a = (1, 1)$ and $\\vec b = (2, 7)$: $d = |a_x b_y - a_y b_x| / |\\vec a| = |7 - 2| / \\sqrt 2$.', '$d = 5/\\sqrt 2 = 3.54$.'] }
  ],
  applications: [
    'Resolving forces along and across slopes, cables and rails.',
    'Shadows and orthographic views in technical drawing and computer graphics.',
    'Least-squares fitting and signal processing: the best approximation is a projection.',
    'Gram–Schmidt orthogonalisation in numerical linear algebra and quantum mechanics.'
  ],
  sim: 'vlc-dot-product'
}

);
