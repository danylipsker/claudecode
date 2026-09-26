/* HYPER-PHYSICS · content/gravitation.js — Newton's law of gravitation, the field and
 * the potential, orbits, Kepler's laws, escape velocity and tides.
 * Simulation: mech2-orbits in sims/mechanics-2.js. */
Hyper.add(

{
  id: 'newtons-law-of-gravitation', parent: 'gravitation', title: 'Newton\'s law of gravitation', level: 1,
  short: 'Every mass attracts every other mass with a force proportional to both masses and inversely proportional to the square of their distance.',
  keywords: ['gravity', 'gravitation', 'universal gravitation', 'inverse square law', 'G', 'gravitational constant', 'Cavendish', 'Newton', 'attraction', 'weight of the Earth'],
  prereq: ['force', 'newtons-third-law', 'math:power-functions'],
  related: ['gravitational-field', 'weight-mass', 'coulombs-law', 'circular-orbits'],
  body: `
The force that makes an apple fall is the same force that holds the Moon in its orbit and the planets round the Sun. Newton's great step was to see this and to write one law for all of it: **every mass attracts every other mass**, with a force
$$F = \\frac{G\\, m_1 m_2}{r^2}$$
along the line joining them. $r$ is the distance between their centres and $G$ is the **gravitational constant**,
$$G = 6.674\\times10^{-11}\\ \\mathrm{N\\,m^2/kg^2}$$

### An inverse-square law
Double the distance and the force drops to a quarter; triple it and it drops to a ninth. The same fall-off appears for [[coulombs-law|electric forces]] and for the [[light-intensity|brightness of light]]: something spreading out evenly from a point is shared over a sphere whose area grows as $r^2$.

### Why you don't notice it between people
$G$ is tiny. Two 70 kg people standing 1 m apart attract each other with
$$F = \\frac{(6.674\\times10^{-11})(70)(70)}{1^2} \\approx 3\\times10^{-7}\\ \\mathrm{N}$$
— the weight of a speck of dust of about 30 micrograms. Gravity only becomes large when at least one of the masses is enormous. The Earth pulls a 70 kg person with 690 N; the Earth and the Moon pull on each other with about $2\\times10^{20}$ N.

### Equal and opposite
The force on each body is the same size ([[newtons-third-law|Newton's third law]]). The Earth pulls a falling apple with 1 N and the apple pulls the Earth with 1 N; the Earth's acceleration is just $10^{25}$ times smaller.

### Spheres act as if all their mass were at the centre
Newton proved (and it took him years) that a spherically symmetric body attracts anything outside it exactly as if its whole mass were concentrated at its centre. That is why $r$ is measured from the Earth's centre and why the weight of a mass $m$ on the surface is
$$mg = \\frac{G M_\\oplus m}{R_\\oplus^2} \\quad\\Rightarrow\\quad g = \\frac{G M_\\oplus}{R_\\oplus^2} \\approx 9.8\\ \\mathrm{m/s^2}$$
(see [[gravitational-field]]).

### Newton's Moon test
The Moon is about 60 Earth radii away, so the law predicts its acceleration towards the Earth to be $g/60^2 = 0.0027\\ \\mathrm{m/s^2}$. Its actual orbit — 384 000 km radius, 27.3 days — gives a centripetal acceleration $4\\pi^2 r/T^2 = 0.0027\\ \\mathrm{m/s^2}$. The two agree to about 1 %: the apple and the Moon fall for the same reason.

> [!history] Newton published the law in the *Principia* (1687). $G$ itself was first measured in 1798 by Henry Cavendish, who timed the tiny twist of a torsion balance as lead balls attracted each other. Knowing $G$, $g$ and $R_\\oplus$, he could compute the mass of the Earth — "weighing the world".
`,
  ideas: [
    'Every pair of masses attracts: F = G m₁m₂ / r², along the line between them.',
    'The force falls with the square of the distance.',
    'G is so small that gravity is noticeable only when a mass is astronomical.',
    'A spherical body attracts outside objects as if all its mass were at its centre.',
    'The forces on the two bodies are equal and opposite.'
  ],
  pitfalls: [
    'The Earth pulls the apple harder than the apple pulls the Earth — The forces are equal (third law). The apple accelerates more because its mass is so much smaller.',
    'There is no gravity in space, which is why astronauts float — At the height of the Space Station gravity is still about 89 % of its surface value. Astronauts float because they are in free fall along with their craft.',
    'Measuring r from the surfaces of the two bodies — r is the distance between their centres; for a person on the ground it is the radius of the Earth.'
  ],
  formulas: [
    {
      name: 'Newton\'s law of gravitation',
      expr: 'F = G*m1*m2/r^2', tex: 'F = \\frac{G\\, m_1 m_2}{r^2}',
      vars: {
        F: { name: 'gravitational force', q: 'force', unit: 'N' },
        G: { const: 'G' },
        m1: { name: 'first mass', q: 'mass', unit: 'kg', value: 5.972e24 },
        m2: { name: 'second mass', q: 'mass', unit: 'kg', value: 70 },
        r: { name: 'distance between the centres', q: 'length', unit: 'km', value: 6371 }
      },
      stories: {
        F: 'With what force does a body of mass {m1} attract a {m2} person whose centre is {r} away?',
        r: 'Two masses, {m1} and {m2}, attract each other with {F}. How far apart are their centres?',
        m1: 'A {m2} person standing {r} from a planet\'s centre weighs {F}. What is the planet\'s mass?'
      }
    },
    {
      name: 'Newton\'s Moon test: gravity at a distance',
      expr: 'a = g*(R/r)^2', tex: 'a = g\\left(\\frac{R}{r}\\right)^2',
      vars: {
        a: { name: 'acceleration due to the Earth\'s gravity at distance r', q: 'accel', unit: 'm/s²' },
        g: { const: 'g' },
        R: { name: 'radius of the Earth', q: 'length', unit: 'km', value: 6371 },
        r: { name: 'distance from the Earth\'s centre', q: 'length', unit: 'km', value: 384400 }
      },
      note: 'Compare with the Moon\'s centripetal acceleration $4\\pi^2 r/T^2 \\approx 0.0027\\ \\mathrm{m/s^2}$.',
      stories: { a: 'Gravity at the Earth\'s surface is g at a radius of {R}. What acceleration does it give the Moon, {r} from the Earth\'s centre?' }
    }
  ],
  examples: [
    {
      title: 'The Earth and the Moon',
      q: 'The Earth (5.97 × 10²⁴ kg) and the Moon (7.34 × 10²² kg) are 3.84 × 10⁸ m apart. What force do they exert on each other?',
      steps: [
        '$F = \\dfrac{G m_1 m_2}{r^2} = \\dfrac{(6.674\\times10^{-11})(5.97\\times10^{24})(7.34\\times10^{22})}{(3.84\\times10^{8})^2}$.',
        'Numerator: $2.92\\times10^{37}$; denominator: $1.47\\times10^{17}$.',
        '$F = 1.98\\times10^{20}\\ \\mathrm{N}$, on each body, towards the other.'
      ],
      a: 'About 2 × 10²⁰ N.'
    },
    {
      title: 'Weighing the Earth',
      q: 'Use $g = 9.81\\ \\mathrm{m/s^2}$, $R_\\oplus = 6.371\\times10^{6}\\ \\mathrm{m}$ and $G$ to find the mass of the Earth and its mean density.',
      steps: [
        'From $g = GM/R^2$: $M = \\dfrac{gR^2}{G} = \\dfrac{9.81 \\times (6.371\\times10^{6})^2}{6.674\\times10^{-11}} = 5.97\\times10^{24}\\ \\mathrm{kg}$.',
        'Volume $\\tfrac43\\pi R^3 = 1.083\\times10^{21}\\ \\mathrm{m^3}$, so the mean density is $5510\\ \\mathrm{kg/m^3}$.',
        'Surface rocks are only about 2700 kg/m³, so the inside of the Earth must be much denser — the first clue to its iron core.'
      ],
      a: '5.97 × 10²⁴ kg; about 5500 kg/m³.'
    }
  ],
  quiz: [
    { q: 'Two asteroids are moved to twice their distance apart. The gravitational force between them becomes…', choices: ['half', 'a quarter', 'twice as large', 'unchanged'], a: 1, why: 'F ∝ 1/r²: doubling r divides the force by 4.' },
    { q: 'The Earth pulls a falling apple with a force of 1 N. The apple pulls the Earth with…', choices: ['1 N', 'almost nothing', '1 N divided by the mass ratio', '9.8 N'], a: 0,
      why: 'Newton\'s third law: the forces are equal and opposite. Only the accelerations differ, by the ratio of the masses.' },
    { q: 'Both masses are doubled and their distance is doubled too. The force…', choices: ['doubles', 'quadruples', 'stays the same', 'halves'], a: 2, why: 'The numerator gains a factor 2 × 2 = 4 and the denominator gains 2² = 4.' },
    { q: 'Astronauts on the Space Station, 400 km up, float because gravity there is almost zero.', a: false,
      why: 'At 400 km gravity is still 89 % of its surface value. They float because they and the station fall together round the Earth.' }
  ],
  applications: ['Predicting the orbits of planets, moons, spacecraft and comets.', 'Measuring the masses of planets and stars from the motion of things orbiting them.', 'Gravimetry: tiny changes in g reveal dense ore bodies, salt domes and underground cavities.'],
  history: 'Newton linked the fall of an apple to the orbit of the Moon in the 1660s and published the universal law in 1687. Cavendish measured G with a torsion balance in 1798.'
},

{
  id: 'gravitational-field', parent: 'gravitation', title: 'Gravitational field', level: 2,
  short: 'The pull of gravity per kilogram at each point in space: g = GM/r² outside a planet, pointing towards its centre.',
  keywords: ['gravitational field', 'field strength', 'g', 'N/kg', 'field lines', 'surface gravity', 'gravity with altitude', 'shell theorem', 'gravity inside the Earth'],
  prereq: ['newtons-law-of-gravitation', 'weight-mass', 'math:scalar-vector-fields'],
  related: ['electric-field', 'gravitational-potential', 'tides', 'equivalence-principle'],
  body: `
Instead of asking what force one body exerts on another, we can ask what gravity is like at each point in space — whatever happens to be there. The **gravitational field** is the force per unit mass a test object would feel:
$$\\vec g = \\frac{\\vec F}{m}$$
Its unit is N/kg, which is the same as m/s²: the field strength is simply the acceleration of anything falling freely at that point. A mass $m$ placed in the field feels a force $m\\vec g$, its [[weight-mass|weight]].

### Around a planet
Outside a spherical body of mass $M$, the field points towards its centre and has strength
$$g = \\frac{GM}{r^2}$$
Field lines are drawn pointing inwards, crowding together where the field is strong. Near the surface the lines are almost parallel and $g$ is nearly constant, which is why "$g = 9.81\\ \\mathrm{m/s^2}$" works for everyday problems.

| Body | Surface gravity |
|---|---|
| Moon | 1.62 m/s² |
| Mars | 3.73 m/s² |
| Earth | 9.81 m/s² |
| Jupiter (cloud tops) | 24.8 m/s² |
| Sun (surface) | 274 m/s² |

For bodies of the same density, $M \\propto R^3$, so $g = \\tfrac43\\pi G\\rho R$ grows in proportion to the radius.

### Going up
With $r = R + h$, the field falls off with height:
$$g(h) = g_0\\left(\\frac{R}{R+h}\\right)^2$$
On Everest (8.8 km) it is only 0.3 % weaker. At the Space Station, 400 km up, it is still 8.7 m/s², 89 % of the surface value. At the Moon's distance it is 0.0027 m/s².

### Going down
Inside a uniform sphere only the mass closer to the centre than you pulls: a uniform spherical shell exerts **no net force** anywhere inside it (Newton's shell theorem). The field then falls linearly to zero at the centre, $g = GMr/R^3$. The real Earth is not uniform: because the core is so dense, $g$ actually rises slightly as you descend through the mantle, peaking near 10.7 m/s² at the core boundary, before falling to zero at the centre.

### Adding fields
Fields from several bodies add as vectors. Between the Earth and the Moon there is a point where their pulls cancel: since the Earth is 81 times more massive, it lies at $r/(d - r) = \\sqrt{81}$, about 346 000 km from the Earth, 90 % of the way to the Moon.

> [!note] On Earth $g$ ranges from 9.780 m/s² at the equator to 9.832 m/s² at the poles, because the Earth bulges and spins. Gravimeters can detect changes of one part in a hundred million — enough to spot a buried cavity or a change in groundwater.

The field is the slope of the [[gravitational-potential|gravitational potential]], $g = -dV/dr$, just as the [[electric-field|electric field]] is the slope of the electric potential.
`,
  ideas: [
    'The gravitational field is force per unit mass, g = F/m, measured in N/kg = m/s².',
    'Outside a spherical body, g = GM/r², pointing towards the centre.',
    'Near a planet\'s surface g is nearly uniform; it weakens with the square of the distance from the centre.',
    'Inside a uniform shell the field of the shell is zero; inside a uniform ball g grows linearly with r.',
    'Fields from several bodies add as vectors.'
  ],
  pitfalls: [
    'Gravity switches off a short way above the Earth — It fades gradually as 1/r²; 400 km up it has lost only 11 %.',
    'Gravity is strongest at the centre of the Earth — At the centre the pulls from all sides cancel and g = 0.',
    'Field strength and force are the same thing — The field is the force per kilogram; multiply by the mass to get the force on a particular body.'
  ],
  formulas: [
    {
      name: 'Field of a spherical body',
      expr: 'g = G*M/r^2', tex: 'g = \\frac{G M}{r^2}',
      vars: {
        g: { name: 'gravitational field strength', q: 'accel', unit: 'm/s²' },
        G: { const: 'G' },
        M: { name: 'mass of the body', q: 'mass', unit: 'kg', value: 6.417e23 },
        r: { name: 'distance from its centre', q: 'length', unit: 'km', value: 3389.5 }
      },
      stories: {
        g: 'Mars has a mass of {M} and a radius of {r}. What is the gravitational field at its surface?',
        M: 'A moon of radius {r} has surface gravity {g}. What is its mass?'
      }
    },
    {
      name: 'Field at a height above the surface',
      expr: 'g = g0*(R/(R + h))^2', tex: 'g = g_0\\left(\\frac{R}{R + h}\\right)^2',
      vars: {
        g: { name: 'field at height h', q: 'accel', unit: 'm/s²' },
        g0: { name: 'field at the surface', q: 'accel', unit: 'm/s²', value: 9.81 },
        R: { name: 'radius of the planet', q: 'length', unit: 'km', value: 6371 },
        h: { name: 'height above the surface', q: 'length', unit: 'km', value: 400 }
      },
      stories: { g: 'The Space Station orbits {h} above the Earth (radius {R}, surface gravity {g0}). How strong is gravity there?', h: 'At what height above the Earth (radius {R}, surface gravity {g0}) does gravity fall to {g}?' }
    },
    {
      name: 'Surface gravity from density and radius',
      expr: 'g = 4/3*pi*G*rho*R', tex: 'g = \\tfrac43 \\pi G \\rho R',
      vars: {
        g: { name: 'surface gravity', q: 'accel', unit: 'm/s²' },
        G: { const: 'G' },
        rho: { name: 'mean density', q: 'density', unit: 'kg/m³', value: 5514 },
        R: { name: 'radius', q: 'length', unit: 'km', value: 6371 }
      },
      stories: { g: 'A rocky planet has a mean density of {rho} and a radius of {R}. What is its surface gravity?', rho: 'A world of radius {R} has surface gravity {g}. What is its mean density?' }
    }
  ],
  examples: [
    {
      title: 'Gravity on the Space Station',
      q: 'How strong is the Earth\'s gravitational field at the Space Station, 400 km above the surface? ($R_\\oplus = 6371$ km, $g_0 = 9.81\\ \\mathrm{m/s^2}$.)',
      steps: [
        '$g = g_0\\left(\\dfrac{R}{R+h}\\right)^2 = 9.81 \\times \\left(\\dfrac{6371}{6771}\\right)^2$.',
        '$(6371/6771)^2 = 0.885$, so $g = 8.69\\ \\mathrm{m/s^2}$.',
        'Gravity is barely weaker. The crew float because the station and everything in it are in free fall — it all falls round the Earth together.'
      ],
      a: '8.7 m/s², 89 % of the surface value.'
    },
    {
      title: 'Where the pulls cancel',
      q: 'The Moon (mass $M_\\oplus/81$) is 384 000 km from the Earth. Where on the line between them do their gravitational fields cancel?',
      steps: [
        'At distance $r$ from the Earth: $\\dfrac{GM_\\oplus}{r^2} = \\dfrac{G M_\\oplus/81}{(d - r)^2}$.',
        'Take square roots: $\\dfrac{r}{d - r} = 9$, so $r = 0.9\\,d$.',
        '$r = 0.9 \\times 384\\,000 = 346\\,000\\ \\mathrm{km}$ from the Earth.'
      ],
      a: 'About 346 000 km from the Earth, 38 000 km from the Moon.'
    }
  ],
  quiz: [
    { q: 'The unit N/kg is the same as…', choices: ['J', 'm/s²', 'N·m', 'kg/m³'], a: 1, why: 'N = kg·m/s², so N/kg = m/s². The field strength is the free-fall acceleration.' },
    { q: 'You descend a very deep (imaginary) shaft towards the centre of a uniform planet. Gravity…', choices: ['grows as 1/r² all the way down', 'stays constant', 'falls steadily to zero at the centre', 'becomes infinite at the centre'], a: 2,
      why: 'Only the mass inside your radius pulls. For a uniform ball that gives g = GMr/R³, falling linearly to zero.' },
    { q: 'Planet X has the same density as the Earth but twice the radius. Its surface gravity is…', choices: ['the same', 'twice the Earth\'s', 'four times', 'eight times'], a: 1,
      why: 'g = (4/3)πGρR: at fixed density it is proportional to R. (Its mass is 8 times larger, but you are also 2 times farther from its centre.)' },
    { q: 'Inside a hollow, uniform spherical shell, the shell\'s gravitational field is zero everywhere.', a: true,
      why: 'Newton\'s shell theorem: the pulls of the near and far parts of the shell cancel exactly at every inside point.' }
  ],
  applications: ['Gravimetric surveys for oil, minerals and archaeology.', 'Satellite gravity missions map ice-sheet loss and groundwater from tiny changes in g.', 'Planning spacecraft trajectories through the combined fields of the Earth and the Moon.']
},

{
  id: 'gravitational-potential', parent: 'gravitation', title: 'Gravitational potential energy (general)', level: 2,
  short: 'Far from the ground mgh is not enough: the energy of two masses is U = −GMm/r, zero when they are infinitely far apart and negative when they are bound.',
  keywords: ['gravitational potential energy', 'gravitational potential', '-GMm/r', 'potential well', 'bound', 'equipotential', 'energy to reach orbit', 'J/kg'],
  prereq: ['gravitational-potential-energy', 'newtons-law-of-gravitation', 'math:improper-integrals'],
  related: ['escape-velocity', 'circular-orbits', 'electric-potential', 'conservative-forces'],
  body: `
Near the ground, lifting a mass $m$ by a height $h$ stores [[gravitational-potential-energy|potential energy]] $mgh$. That formula assumes $g$ is constant, which fails once the height is comparable to the Earth's radius. For rockets, satellites and planets we need the general form.

### Adding up the work
The force $GMm/r^2$ weakens with distance, so the work needed to move a mass outwards is an integral. Moving it from $r$ all the way to infinity takes
$$W = \\int_r^{\\infty} \\frac{GMm}{r'^2}\\, dr' = \\frac{GMm}{r}$$
— finite, even though the distance is infinite, because the force dies away fast enough ([[math:improper-integrals|an improper integral]]). Choosing the zero of energy at infinity then gives
$$U(r) = -\\frac{GMm}{r}$$

### Why negative?
Only differences of potential energy matter, so the zero can be put anywhere; infinity is the natural place because the force vanishes there. With that choice every nearby mass has **negative** energy: you must *add* energy to separate it. A negative total energy (kinetic plus potential) means a body is **bound** — it cannot escape; zero or positive means it can (see [[escape-velocity]]). Picture a funnel: the Earth sits at the bottom of a potential well, and climbing out takes energy.

### Recovering mgh
The energy needed to lift $m$ from the surface ($r = R$) to a height $h$ is
$$\\Delta U = GMm\\left(\\frac1R - \\frac1{R+h}\\right) = \\frac{GMm\\,h}{R(R+h)}$$
When $h \\ll R$ the denominator is nearly $R^2$, and since $GM/R^2 = g$, this becomes $mgh$. The old formula is the near-surface limit of the new one.

### Potential
Dividing by the mass gives the **gravitational potential**, energy per kilogram, in J/kg:
$$V = -\\frac{GM}{r}$$
At the Earth's surface $V = -62.6\\ \\mathrm{MJ/kg}$: freeing each kilogram from the Earth completely takes 62.6 MJ, the energy in about 1.4 kg of petrol. Surfaces of equal potential (equipotentials) are spheres round a planet; moving along one takes no work, and the field points straight down the steepest slope of $V$: $g = -dV/dr$.

### Getting to orbit is mostly about speed
Lifting 1 kg to the Space Station's height of 400 km takes 3.7 MJ ($mgh$ would say 3.9). But in orbit it must also move at 7.7 km/s, which is 29 MJ of kinetic energy — eight times more. That is why rockets turn sideways soon after launch: they need horizontal speed far more than height (see [[circular-orbits]]).
`,
  ideas: [
    'The general gravitational potential energy is U = −GMm/r, with zero at infinite separation.',
    'Negative energy means bound: energy must be supplied to pull the masses apart.',
    'For small heights, ΔU = GMm(1/R − 1/(R + h)) reduces to mgh.',
    'Potential V = −GM/r is energy per kilogram; the field is its downhill slope.'
  ],
  pitfalls: [
    'Negative potential energy is impossible or unphysical — Only differences matter; the sign just reflects the choice of zero at infinity.',
    'Using mgh for rockets and satellites — g shrinks with height, so mgh overestimates the energy: by 6 % at 400 km and by a factor of over 5 for a geostationary orbit.',
    'The energy of a body in orbit is mainly potential energy gained by climbing — For low orbits most of the launch energy goes into orbital speed, not height.'
  ],
  derivation: {
    title: 'From the force to U = −GMm/r',
    steps: [
      { text: 'The outward work you do against gravity moving a mass from $r$ to $r + dr$ is the force times the step:', tex: 'dW = \\frac{GMm}{r^2}\\, dr' },
      { text: 'Add up the steps from $r$ out to infinity:', tex: 'W = \\int_r^{\\infty} \\frac{GMm}{r\'^2}\\, dr\' = \\left[-\\frac{GMm}{r\'}\\right]_r^{\\infty} = \\frac{GMm}{r}' },
      { text: 'That work raises the potential energy from $U(r)$ to $U(\\infty) = 0$:', tex: '0 - U(r) = \\frac{GMm}{r} \\;\\Rightarrow\\; U(r) = -\\frac{GMm}{r}' },
      { text: 'For a small climb $h$ from the surface, use $\\frac1R - \\frac1{R+h} \\approx \\frac{h}{R^2}$ and $g = GM/R^2$:', tex: '\\Delta U \\approx \\frac{GMm}{R^2}\\,h = mgh' }
    ]
  },
  formulas: [
    {
      name: 'Gravitational potential energy',
      expr: 'U = -G*M*m/r', tex: 'U = -\\frac{G M m}{r}',
      vars: {
        U: { name: 'potential energy (zero at infinity)', q: 'energy', unit: 'GJ', signed: true },
        G: { const: 'G' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'kg', value: 5.972e24 },
        m: { name: 'mass of the object', q: 'mass', unit: 'kg', value: 1000 },
        r: { name: 'distance from the planet\'s centre', q: 'length', unit: 'km', value: 6771 }
      },
      stories: { U: 'What is the gravitational potential energy of a {m} satellite at {r} from the centre of a planet of mass {M}?' }
    },
    {
      name: 'Energy to raise a mass from the surface',
      expr: 'W = G*M*m*(1/R - 1/r)', tex: 'W = G M m\\left(\\frac{1}{R} - \\frac{1}{r}\\right)',
      vars: {
        W: { name: 'energy needed', q: 'energy', unit: 'MJ' },
        G: { const: 'G' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'kg', value: 5.972e24 },
        m: { name: 'mass lifted', q: 'mass', unit: 'kg', value: 1 },
        R: { name: 'radius of the planet', q: 'length', unit: 'km', value: 6371 },
        r: { name: 'final distance from the centre', q: 'length', unit: 'km', value: 6771 }
      },
      note: 'Lifting only; it ignores the kinetic energy an orbit also needs.',
      practice: { unknowns: ['W', 'r'] },
      stories: { W: 'How much energy does it take just to lift {m} from the surface of a planet (mass {M}, radius {R}) to {r} from its centre?' }
    },
    {
      name: 'Gravitational potential',
      expr: 'V = -G*M/r', tex: 'V = -\\frac{G M}{r}',
      vars: {
        V: { name: 'gravitational potential', q: 'specificenergy', unit: 'MJ/kg', signed: true },
        G: { const: 'G' },
        M: { name: 'mass of the body', q: 'mass', unit: 'kg', value: 5.972e24 },
        r: { name: 'distance from its centre', q: 'length', unit: 'km', value: 6371 }
      },
      stories: { V: 'What is the gravitational potential at the surface of a planet of mass {M} and radius {r}?' }
    }
  ],
  examples: [
    {
      title: 'Up to the Space Station',
      q: 'How much energy does it take to lift 1 kg from the Earth\'s surface to 400 km? Compare with $mgh$ and with the kinetic energy of orbiting at 7.67 km/s.',
      steps: [
        '$\\Delta U = GM\\left(\\dfrac1R - \\dfrac1{R+h}\\right) = 3.986\\times10^{14} \\times \\left(\\dfrac{1}{6.371\\times10^6} - \\dfrac{1}{6.771\\times10^6}\\right)$.',
        'The bracket is $9.27\\times10^{-9}\\ \\mathrm{m^{-1}}$, so $\\Delta U = 3.70\\ \\mathrm{MJ}$.',
        '$mgh = 1 \\times 9.81 \\times 4\\times10^5 = 3.92\\ \\mathrm{MJ}$, about 6 % too high because $g$ weakens with height.',
        'Orbital kinetic energy: $\\tfrac12 (7670)^2 = 29.4\\ \\mathrm{MJ}$ — eight times the lifting energy.'
      ],
      a: '3.7 MJ to lift (3.9 MJ by mgh); 29 MJ more for the orbital speed.'
    }
  ],
  quiz: [
    { q: 'Why is gravitational potential energy usually negative?', choices: ['Gravity is a repulsive force', 'Its zero is taken at infinite separation, and energy must be added to reach it', 'Mass can be negative', 'It is a mistake in the sign convention'], a: 1,
      why: 'With U = 0 at infinity, a body closer in has less energy; you must do positive work to separate the masses completely.' },
    { q: 'A spacecraft has negative total (kinetic + potential) energy relative to the Earth. It…', choices: ['will escape', 'is bound: it cannot escape without more energy', 'must be falling straight down', 'is at rest'], a: 1,
      why: 'Escaping to infinity with zero speed needs total energy of at least zero.' },
    { q: 'Lifting a satellite to geostationary height (35 800 km), the formula mgh gives…', choices: ['about the right answer', 'far too much energy', 'far too little energy', 'a negative energy'], a: 1,
      why: 'g falls from 9.8 m/s² to 0.22 m/s² along the way; using the surface value throughout overestimates the work by more than a factor of five.' },
    { q: 'Moving a mass along an equipotential surface requires no work against gravity.', a: true,
      why: 'The potential energy is the same at every point of the surface, so gravity does no net work — the field is perpendicular to it.' }
  ],
  applications: ['Planning the energy budget of launches and transfer orbits.', 'Potential-well diagrams for orbits, planets and, with the same maths, atoms (electric potential).', 'Hydropower and pumped storage use the near-surface limit, mgh.']
},

{
  id: 'circular-orbits', parent: 'gravitation', title: 'Circular orbits', level: 2,
  short: 'A satellite is always falling, but moves sideways so fast that it keeps missing the ground. Gravity supplies exactly the centripetal force a circle needs.',
  keywords: ['orbit', 'circular orbit', 'orbital speed', 'orbital period', 'satellite', 'geostationary', 'low Earth orbit', 'Newton\'s cannon', 'weightlessness', 'ISS'],
  prereq: ['newtons-law-of-gravitation', 'centripetal-force', 'uniform-circular-motion'],
  related: ['keplers-laws', 'escape-velocity', 'projectile-motion', 'gravitational-potential'],
  body: `
Newton imagined a cannon on a very high mountain firing horizontally. A slow ball curves down and hits the ground nearby. A faster one lands farther away. Fire it fast enough and the ground curves away beneath it as quickly as the ball falls: it never lands. It is **in orbit** — falling all the time, and always missing.

### Orbital speed
For a circle of radius $r$ round a body of mass $M$, gravity must provide exactly the [[centripetal-force|centripetal force]]:
$$\\frac{GMm}{r^2} = \\frac{m v^2}{r} \\qquad\\Rightarrow\\qquad v = \\sqrt{\\frac{GM}{r}}$$
The satellite's own mass cancels: a spanner and a space station share the same orbit at the same speed. The period is the circumference divided by the speed:
$$T = \\frac{2\\pi r}{v} = 2\\pi\\sqrt{\\frac{r^3}{GM}}$$
Higher orbits are **slower** and take much longer — a first glimpse of [[keplers-laws|Kepler's third law]].

| Orbit | Height | Speed | Period |
|---|---|---|---|
| Space Station | 400 km | 7.67 km/s | 92 min |
| GPS satellites | 20 200 km | 3.87 km/s | 12 h (half a sidereal day) |
| Geostationary | 35 786 km | 3.07 km/s | 23 h 56 min |
| The Moon | 384 000 km | 1.02 km/s | 27.3 days |

### Geostationary orbit
A satellite that takes exactly one sidereal day (23 h 56 min) to go round, above the equator and in the direction the Earth spins, stays over the same spot. Solving $T = 2\\pi\\sqrt{r^3/GM}$ for $r$ gives 42 164 km from the centre, 35 786 km up. Every TV dish points at one of them.

### Energy in orbit
The kinetic energy is $\\tfrac12 mv^2 = \\dfrac{GMm}{2r}$ and the [[gravitational-potential|potential energy]] is $-\\dfrac{GMm}{r}$, so the total is
$$E = -\\frac{GMm}{2r} = -K$$
This has a curious consequence. Air drag takes energy away from a low satellite, making $E$ more negative — so $r$ shrinks and the speed **increases**. Friction speeds satellites up as it brings them down.

### Why astronauts float
Inside an orbiting station everything — crew, water, pencils — follows the same orbit with the same acceleration. Nothing presses on anything else, so nothing feels weight: this is continuous [[free-fall|free fall]], not an absence of gravity.

> [!tip] Try it in the simulation: fire the cannon at increasing speeds. Below the circular speed the ball falls back; exactly at it, the path is a circle; faster still it becomes an ellipse, and at $\\sqrt2$ times the circular speed it escapes altogether.
`,
  ideas: [
    'An orbit is free fall with enough sideways speed to keep missing the ground.',
    'For a circular orbit gravity supplies the centripetal force: v = √(GM/r), independent of the satellite\'s mass.',
    'The period T = 2π√(r³/GM): higher orbits are slower and longer.',
    'In a circular orbit E = −GMm/2r = −K; losing energy lowers the orbit and speeds the satellite up.'
  ],
  pitfalls: [
    'Satellites stay up because they are beyond the reach of gravity — Gravity is what keeps them in orbit; without it they would fly off in a straight line.',
    'A heavier satellite needs to go faster to stay in the same orbit — The mass cancels: every object at a given radius orbits at the same speed.',
    'To catch up with a satellite ahead of you in the same orbit, just speed up — Firing forwards raises your orbit, which makes you slower on average and you fall behind. You catch up by dropping to a lower, faster orbit.'
  ],
  formulas: [
    {
      name: 'Orbital speed at a given height',
      expr: 'v = sqrt(G*M/(R + h))', tex: 'v = \\sqrt{\\frac{G M}{R + h}}',
      vars: {
        v: { name: 'orbital speed', q: 'speed', unit: 'km/s' },
        G: { const: 'G' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 1 },
        R: { name: 'radius of the planet', q: 'length', unit: 'km', value: 6371 },
        h: { name: 'height of the orbit', q: 'length', unit: 'km', value: 400 }
      },
      stories: {
        v: 'A satellite circles a planet of mass {M} and radius {R} at a height of {h}. How fast does it travel?',
        h: 'At what height above a planet of mass {M} and radius {R} does a circular orbit have speed {v}?'
      }
    },
    {
      name: 'Period of a circular orbit',
      expr: 'T = 2*pi*sqrt((R + h)^3/(G*M))', tex: 'T = 2\\pi\\sqrt{\\frac{(R + h)^3}{G M}}',
      vars: {
        T: { name: 'orbital period', q: 'time', unit: 'min' },
        G: { const: 'G' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 1 },
        R: { name: 'radius of the planet', q: 'length', unit: 'km', value: 6371 },
        h: { name: 'height of the orbit', q: 'length', unit: 'km', value: 400 }
      },
      stories: {
        T: 'How long does a satellite {h} above a planet (mass {M}, radius {R}) take to go once round?',
        h: 'A satellite should circle a planet of mass {M} and radius {R} once every {T}. How high must it orbit?'
      }
    },
    {
      name: 'Total energy of a circular orbit',
      expr: 'E = -G*M*m/(2*r)', tex: 'E = -\\frac{G M m}{2 r}',
      vars: {
        E: { name: 'total energy', q: 'energy', unit: 'GJ', signed: true },
        G: { const: 'G' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 1 },
        m: { name: 'mass of the satellite', q: 'mass', unit: 'kg', value: 1000 },
        r: { name: 'orbit radius (from the centre)', q: 'length', unit: 'km', value: 6771 }
      },
      stories: { E: 'What is the total energy of a {m} satellite in a circular orbit of radius {r} round a planet of mass {M}?' }
    }
  ],
  examples: [
    {
      title: 'The Space Station',
      q: 'The Space Station orbits 400 km above the Earth ($GM = 3.986\\times10^{14}\\ \\mathrm{m^3/s^2}$, $R = 6371$ km). Find its speed and period.',
      steps: [
        '$r = 6371 + 400 = 6771\\ \\mathrm{km}$.',
        '$v = \\sqrt{GM/r} = \\sqrt{3.986\\times10^{14}/6.771\\times10^{6}} = 7670\\ \\mathrm{m/s}$ — about 27 600 km/h.',
        '$T = 2\\pi r/v = 2\\pi(6.771\\times10^{6})/7670 = 5550\\ \\mathrm{s} = 92\\ \\mathrm{min}$: about 16 orbits a day.'
      ],
      a: '7.67 km/s, 92 minutes.'
    },
    {
      title: 'How high is geostationary?',
      q: 'Find the radius and height of an orbit with a period of one sidereal day, 86 164 s.',
      steps: [
        'From $T = 2\\pi\\sqrt{r^3/GM}$: $r^3 = \\dfrac{GM T^2}{4\\pi^2} = \\dfrac{(3.986\\times10^{14})(86\\,164)^2}{39.48} = 7.50\\times10^{22}\\ \\mathrm{m^3}$.',
        '$r = 4.216\\times10^{7}\\ \\mathrm{m} = 42\\,160\\ \\mathrm{km}$.',
        'Subtract the equatorial radius, 6378 km: height 35 790 km. Speed $2\\pi r/T = 3.07\\ \\mathrm{km/s}$.'
      ],
      a: 'r ≈ 42 160 km; height ≈ 35 800 km.'
    }
  ],
  quiz: [
    { q: 'Two satellites share a circular orbit; one has ten times the mass of the other. The heavier one moves…', choices: ['faster', 'slower', 'at the same speed', '√10 times faster'], a: 2, why: 'v = √(GM/r) contains only the planet\'s mass. The satellite\'s mass cancels.' },
    { q: 'Compared with a low orbit, a higher circular orbit has…', choices: ['higher speed and shorter period', 'lower speed and longer period', 'lower speed and shorter period', 'the same speed'], a: 1,
      why: 'v falls as 1/√r and T grows as r^1.5.' },
    { q: 'Air drag takes energy from a satellite in a low circular orbit. As it spirals down, its speed…', choices: ['decreases', 'increases', 'stays the same', 'drops to zero'], a: 1,
      why: 'E = −GMm/2r becomes more negative, so r shrinks, and v = √(GM/r) grows. The potential energy lost is twice the kinetic energy gained.' },
    { q: 'A geostationary satellite must orbit above the equator.', a: true,
      why: 'Its orbit must circle the Earth\'s centre and keep pace with the ground beneath it; only an equatorial orbit keeps it over one spot.' }
  ],
  applications: ['Communications and weather satellites in geostationary orbit.', 'Navigation constellations (GPS, Galileo) in 12-hour orbits.', 'Earth observation and the Space Station in low orbits of about 90 minutes.'],
  sim: 'mech2-orbits'
},

{
  id: 'keplers-laws', parent: 'gravitation', title: 'Kepler\'s laws', level: 2,
  short: 'Planets move on ellipses with the Sun at one focus, sweep out equal areas in equal times, and have periods whose squares grow as the cubes of their orbit sizes.',
  keywords: ['Kepler', 'ellipse', 'equal areas', 'third law', 'period', 'semi-major axis', 'eccentricity', 'perihelion', 'aphelion', 'vis-viva', 'planetary motion'],
  prereq: ['circular-orbits', 'angular-momentum', 'math:ellipse'],
  related: ['escape-velocity', 'planets', 'newtons-law-of-gravitation', 'gravitational-potential'],
  body: `
Working through Tycho Brahe's careful observations of Mars, Johannes Kepler found three rules that every planet obeys. Newton later showed that all three follow from an inverse-square force.

### 1. Ellipses
Each planet moves on an [[math:ellipse|ellipse]] with the Sun at one **focus** (not the centre). The size of the ellipse is set by its **semi-major axis** $a$, its shape by the **eccentricity** $e$: 0 is a circle, close to 1 a long thin cigar. The closest and farthest points are
$$r_\\text{peri} = a(1 - e), \\qquad r_\\text{ap} = a(1 + e)$$
Most planetary orbits are nearly circular — the Earth's $e$ is 0.017, Mars 0.093 — but comets can be extreme: Halley's has $e = 0.967$. A circle is simply the special case $e = 0$ of [[circular-orbits|the circular orbit]].

### 2. Equal areas in equal times
The line from the Sun to the planet sweeps out equal areas in equal times. Near the Sun the line is short, so the planet must move faster to cover the same area; far away it creeps. The Earth is fastest in early January (30.3 km/s) and slowest in early July (29.3 km/s). This law is [[angular-momentum|conservation of angular momentum]] in disguise: the Sun's pull points at the Sun, so it exerts no torque about it.

### 3. Periods and sizes
The square of the period is proportional to the cube of the semi-major axis. Newton's form, for a small body round a large mass $M$, is
$$T^2 = \\frac{4\\pi^2}{GM}\\, a^3$$
For the planets, measuring $T$ in years and $a$ in astronomical units makes the constant 1: $T^2 = a^3$. Mars, at 1.52 AU, takes $1.52^{1.5} = 1.88$ years; Jupiter at 5.2 AU takes 11.9 years.

### Weighing the heavens
Rearranged, the third law measures masses: $M = 4\\pi^2 a^3/(GT^2)$. The Moon's orbit weighs the Earth, Jupiter's moons weigh Jupiter, and the star S2, which circles the centre of our Galaxy every 16 years at about 1000 AU, reveals a dark mass of about four million Suns there — the black hole Sagittarius A*. For two stars orbiting each other, $M$ becomes their combined mass.

### Speed anywhere on the orbit
Energy conservation gives the speed at any distance $r$ on an ellipse of semi-major axis $a$ — the **vis-viva equation**:
$$v^2 = GM\\left(\\frac{2}{r} - \\frac{1}{a}\\right)$$
For a circle ($r = a$) it gives back $v^2 = GM/r$; for $a \\to \\infty$ it gives the [[escape-velocity|escape speed]].

> [!tip] In the simulation, tick **Equal areas** and launch an elliptical orbit: the coloured sectors, each swept in the same time, are long and thin far from the planet and short and fat close to it — with the same area.
`,
  ideas: [
    'Orbits are ellipses with the central body at one focus.',
    'The line to the planet sweeps equal areas in equal times, so planets move fastest at perihelion.',
    'T² ∝ a³; in years and AU for the Sun, T² = a³.',
    'The third law measures the mass of the central body: M = 4π²a³/GT².'
  ],
  pitfalls: [
    'The Sun sits at the centre of each orbit — It sits at a focus, off-centre; the centre of an ellipse is empty.',
    'Planets move at constant speed — Only on circular orbits. On an ellipse they speed up approaching the Sun and slow down leaving it.',
    'T² = a³ works for any orbit in years and AU — Only round a one-solar-mass body. For moons of Jupiter or satellites of the Earth, use T² = 4π²a³/GM with that body\'s mass.'
  ],
  derivation: {
    title: 'Equal areas from angular momentum',
    steps: [
      { text: 'In a short time $dt$ the planet turns through $d\\theta$ at distance $r$; the thin triangle swept has area', tex: 'dA = \\tfrac12 r \\cdot r\\,d\\theta = \\tfrac12 r^2\\, d\\theta' },
      { text: 'So the rate of sweeping is', tex: '\\frac{dA}{dt} = \\tfrac12 r^2 \\frac{d\\theta}{dt} = \\tfrac12 r^2\\omega' },
      { text: 'The planet\'s angular momentum about the Sun is $L = m r^2\\omega$, hence', tex: '\\frac{dA}{dt} = \\frac{L}{2m}' },
      { text: 'Gravity points at the Sun, so it exerts no torque about the Sun and $L$ is constant. Equal areas are swept in equal times — for any central force, not just the inverse square.' }
    ]
  },
  formulas: [
    {
      name: 'Kepler\'s third law',
      expr: 'T = 2*pi*sqrt(a^3/(G*M))', tex: 'T = 2\\pi\\sqrt{\\frac{a^3}{G M}}',
      vars: {
        T: { name: 'orbital period', q: 'time', unit: 'yr' },
        G: { const: 'G' },
        a: { name: 'semi-major axis', q: 'length', unit: 'AU', value: 1.524 },
        M: { name: 'mass of the central body', q: 'mass', unit: 'M☉', value: 1 }
      },
      stories: {
        T: 'Mars orbits the Sun ({M}) with a semi-major axis of {a}. How long is its year?',
        a: 'A comet takes {T} to orbit the Sun ({M}). What is its semi-major axis?',
        M: 'A star circles the centre of the Galaxy every {T} on an orbit with semi-major axis {a}. What mass lies at the centre?'
      }
    },
    {
      name: 'Third law in years and astronomical units (Sun only)',
      expr: 'T^2 = a^3', tex: 'T^2 = a^3',
      vars: {
        T: { name: 'period in years' },
        a: { name: 'semi-major axis in AU', value: 5.2 }
      },
      solveFor: 'T',
      stories: { T: 'Jupiter\'s orbit has a semi-major axis of {a} AU. How many years does it take to go round the Sun?', a: 'An asteroid orbits the Sun every {T} years. What is its semi-major axis in AU?' }
    },
    {
      name: 'Speed anywhere on an orbit (vis-viva)',
      expr: 'v = sqrt(G*M*(2/r - 1/a))', tex: 'v = \\sqrt{G M\\left(\\frac{2}{r} - \\frac{1}{a}\\right)}',
      vars: {
        v: { name: 'orbital speed', q: 'speed', unit: 'km/s' },
        G: { const: 'G' },
        M: { name: 'mass of the central body', q: 'mass', unit: 'M☉', value: 1 },
        r: { name: 'current distance', q: 'length', unit: 'AU', value: 0.9833 },
        a: { name: 'semi-major axis', q: 'length', unit: 'AU', value: 1 }
      },
      stories: { v: 'The Earth (a = {a}) is {r} from the Sun ({M}) at perihelion. How fast is it moving?' }
    },
    {
      name: 'Closest approach (perihelion)',
      expr: 'rp = a*(1 - ecc)', tex: 'r_p = a(1 - e)',
      vars: {
        rp: { name: 'closest distance', q: 'length', unit: 'AU', tex: 'r_p' },
        a: { name: 'semi-major axis', q: 'length', unit: 'AU', value: 17.8 },
        ecc: { name: 'eccentricity', tex: 'e', value: 0.967, min: 0, max: 0.9999 }
      },
      stories: { rp: 'Halley\'s comet has a semi-major axis of {a} and an eccentricity of {ecc}. How close does it come to the Sun?' }
    }
  ],
  examples: [
    {
      title: 'Halley\'s comet',
      q: 'Halley\'s comet returns every 75 years and passes 0.59 AU from the Sun. Find its semi-major axis and its farthest distance.',
      steps: [
        '$T^2 = a^3$ in years and AU: $a = 75^{2/3} = 17.8\\ \\mathrm{AU}$.',
        'The major axis is $r_p + r_a = 2a = 35.6\\ \\mathrm{AU}$, so $r_a = 35.6 - 0.59 = 35.0\\ \\mathrm{AU}$ — beyond Neptune.',
        'Eccentricity: $e = 1 - r_p/a = 1 - 0.59/17.8 = 0.967$.'
      ],
      a: 'a ≈ 17.8 AU; aphelion ≈ 35 AU.'
    },
    {
      title: 'The black hole at the centre of the Galaxy',
      q: 'The star S2 orbits the Galactic centre every 16.0 years on an orbit of semi-major axis about 1000 AU. What mass does it orbit?',
      steps: [
        'In solar masses, AU and years, Newton\'s form of the law reads $M = a^3/T^2$ (it gives 1 for the Earth).',
        '$M = \\dfrac{1000^3}{16.0^2} = \\dfrac{10^9}{256} \\approx 3.9\\times10^{6}$ solar masses.',
        'All of it within a region smaller than S2\'s closest approach, about 120 AU: only a black hole fits.'
      ],
      a: 'About 4 million solar masses.'
    }
  ],
  quiz: [
    { q: 'Where on its elliptical orbit does a planet move fastest?', choices: ['At aphelion (farthest)', 'At perihelion (closest)', 'At the ends of the minor axis', 'Everywhere the same'], a: 1,
      why: 'Equal areas in equal times: when the Sun–planet line is short, the planet must move farther along its path to sweep the same area.' },
    { q: 'An asteroid orbits the Sun with a semi-major axis of 4 AU. Its period is…', choices: ['4 years', '8 years', '16 years', '64 years'], a: 1, why: 'T² = a³ = 64, so T = 8 years.' },
    { q: 'Kepler\'s second law is a consequence of the conservation of…', choices: ['energy', 'linear momentum', 'angular momentum', 'mass'], a: 2,
      why: 'dA/dt = L/2m, and the Sun\'s central pull exerts no torque about the Sun, so L is constant.' },
    { q: 'For Jupiter\'s moons, T² = a³ holds with T in years and a in AU.', a: false,
      why: 'The constant 4π²/GM depends on the central mass. Jupiter is about 1000 times lighter than the Sun, so its moons take about √1000 ≈ 32 times longer than planets at the same distance would.' }
  ],
  applications: ['Planning spacecraft transfers: a Hohmann transfer is half an ellipse touching two circular orbits.', 'Finding exoplanet orbits and masses from the wobble of their stars.', 'Measuring the masses of planets, binary stars and black holes.'],
  history: 'Kepler published the first two laws in 1609 (Astronomia Nova), from Tycho Brahe\'s observations of Mars, and the third in 1619. Newton derived all three from his law of gravitation in 1687.',
  sim: { id: 'mech2-orbits', params: { v0: 8.8, areas: true } }
},

{
  id: 'escape-velocity', parent: 'gravitation', title: 'Escape velocity', level: 2,
  short: 'The launch speed needed to coast away from a planet for good: 11.2 km/s from the Earth, independent of the mass and the direction of what is launched.',
  keywords: ['escape velocity', 'escape speed', '11.2 km/s', 'Schwarzschild radius', 'black hole', 'atmosphere', 'unbound', 'second cosmic velocity'],
  prereq: ['gravitational-potential', 'conservation-of-energy', 'kinetic-energy'],
  related: ['circular-orbits', 'black-holes', 'kinetic-theory-gases', 'rocket-propulsion'],
  body: `
Throw a ball up and it comes back. Throw it harder and it goes higher before returning. Is there a speed at which it never comes back? Because gravity weakens with distance, yes: the total work gravity can do on the way out to infinity is finite, $GMm/R$. Give the ball more [[kinetic-energy|kinetic energy]] than that and it escapes.

### The condition
Using [[conservation-of-energy|energy conservation]] with the general [[gravitational-potential|potential energy]], a body launched from radius $R$ just escapes if it arrives at infinity with zero speed:
$$\\tfrac12 m v_\\text{esc}^2 - \\frac{GMm}{R} = 0 \\qquad\\Rightarrow\\qquad v_\\text{esc} = \\sqrt{\\frac{2GM}{R}}$$
Two things drop out. The **mass** of the projectile cancels: a pebble and a probe need the same speed. And the **direction** does not appear: energy is a scalar, so any launch direction works (ignoring air, and as long as the path does not hit the planet).

Compare with the [[circular-orbits|circular orbit]] speed at the same radius: $v_\\text{esc} = \\sqrt2\\, v_\\text{circ}$. In the simulation, a ball fired at just below $\\sqrt2$ times the circular speed follows a huge ellipse; at $\\sqrt2$ times it follows a parabola and never returns.

| Body | Escape speed from the surface |
|---|---|
| Moon | 2.38 km/s |
| Mars | 5.03 km/s |
| Earth | 11.2 km/s |
| Jupiter | 59.5 km/s |
| Sun | 618 km/s |

### Rockets do not need it at lift-off
Escape velocity is for a projectile that coasts after a single kick. A rocket that keeps firing can leave at any speed, provided it keeps supplying energy; what matters is the total energy it ends up with. Launching eastwards also borrows up to 0.46 km/s from the Earth's spin.

### Who keeps an atmosphere
Gas molecules move at random with typical speeds that depend on temperature and mass (see [[kinetic-theory-gases|kinetic theory]]). A few in the fast tail of the distribution exceed the escape speed and are lost from the top of an atmosphere. On the Moon, with its low escape speed, every gas leaks away quickly; on the Earth, hydrogen and helium leak slowly while nitrogen and oxygen stay; giant Jupiter keeps even hydrogen.

### Where light cannot escape
Set $v_\\text{esc}$ equal to the speed of light $c$ and solve for the radius:
$$R_s = \\frac{2GM}{c^2}$$
Squeeze a mass inside this radius and not even light gets out. John Michell reasoned this way in 1783; general relativity gives the same formula for the event horizon of a [[black-holes|black hole]], the **Schwarzschild radius**. For the Sun it is 2.95 km; for the Earth, 9 millimetres.
`,
  ideas: [
    'Escape speed is the launch speed whose kinetic energy equals the depth of the potential well: v = √(2GM/R).',
    'It does not depend on the mass of the object or on the launch direction.',
    'It is √2 times the circular orbit speed at the same radius.',
    'Setting v_esc = c gives the Schwarzschild radius of a black hole, 2GM/c².'
  ],
  pitfalls: [
    'A rocket must reach 11.2 km/s to leave the Earth — Only a coasting projectile must. A rocket under power can climb out at any speed as long as it keeps adding energy.',
    'Heavier probes need a higher escape speed — The mass cancels. They need more energy, not more speed.',
    'Escape velocity means escaping from gravity altogether — The body still feels gravity all the way; it simply never turns back, arriving at infinity with zero (or positive) speed.'
  ],
  formulas: [
    {
      name: 'Escape velocity',
      expr: 'v = sqrt(2*G*M/R)', tex: 'v_{\\text{esc}} = \\sqrt{\\frac{2 G M}{R}}',
      vars: {
        v: { name: 'escape speed', q: 'speed', unit: 'km/s', tex: 'v_{\\text{esc}}' },
        G: { const: 'G' },
        M: { name: 'mass of the planet or star', q: 'mass', unit: 'M⊕', value: 1 },
        R: { name: 'distance from its centre (the radius, at the surface)', q: 'length', unit: 'km', value: 6371 }
      },
      stories: {
        v: 'What is the escape speed from the surface of a planet of mass {M} and radius {R}?',
        R: 'A body of mass {M} has an escape speed of {v} at its surface. What is its radius?',
        M: 'An asteroid of radius {R} has an escape speed of {v}. What is its mass?'
      }
    },
    {
      name: 'Schwarzschild radius',
      expr: 'Rs = 2*G*M/c^2', tex: 'R_s = \\frac{2 G M}{c^2}',
      vars: {
        Rs: { name: 'Schwarzschild radius', q: 'length', unit: 'km', tex: 'R_s' },
        G: { const: 'G' },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 1 },
        c: { const: 'c' }
      },
      stories: { Rs: 'To what radius would a mass of {M} have to be squeezed to become a black hole?', M: 'A black hole has a Schwarzschild radius of {Rs}. What is its mass?' }
    }
  ],
  examples: [
    {
      title: 'Earth and Moon',
      q: 'Find the escape speeds from the Earth ($GM = 3.986\\times10^{14}$, $R = 6371$ km) and the Moon ($GM = 4.905\\times10^{12}$, $R = 1737$ km).',
      steps: [
        'Earth: $v = \\sqrt{2 \\times 3.986\\times10^{14}/6.371\\times10^{6}} = \\sqrt{1.251\\times10^{8}} = 11\\,190\\ \\mathrm{m/s}$.',
        'Moon: $v = \\sqrt{2 \\times 4.905\\times10^{12}/1.737\\times10^{6}} = \\sqrt{5.65\\times10^{6}} = 2380\\ \\mathrm{m/s}$.',
        'Leaving the Moon takes one-twentieth of the energy per kilogram, which is why the Apollo ascent stages could be so small.'
      ],
      a: 'Earth 11.2 km/s; Moon 2.38 km/s.'
    },
    {
      title: 'Energy to escape',
      q: 'How much energy does 1 kg need to escape from the Earth\'s surface, and how does that compare with the chemical energy of petrol (46 MJ/kg)?',
      steps: [
        '$\\tfrac12 v_\\text{esc}^2 = GM/R = 3.986\\times10^{14}/6.371\\times10^{6} = 6.26\\times10^{7}\\ \\mathrm{J}$.',
        'That is 62.6 MJ, the energy in about 1.4 kg of petrol — for every kilogram sent away, before counting the fuel that must itself be lifted.'
      ],
      a: '62.6 MJ per kilogram.'
    }
  ],
  quiz: [
    { q: 'Ignoring air, the escape speed depends on the direction of launch.', a: false,
      why: 'The energy condition ½mv² ≥ GMm/R involves only speed. Any direction works, as long as the path does not run into the planet.' },
    { q: 'A planet keeps its mass but shrinks to a quarter of its radius. Its surface escape speed becomes…', choices: ['a quarter', 'half', 'twice', 'four times'], a: 2, why: 'v ∝ 1/√R, so dividing R by 4 multiplies v by 2.' },
    { q: 'Why has the Moon no atmosphere while the Earth does?', choices: ['The Moon has no magnetic field', 'Its low escape speed lets gas molecules leak away', 'The Moon is too cold', 'The Sun blows it away because the Moon is closer'], a: 1,
      why: 'At 2.4 km/s the Moon\'s escape speed is within reach of the fast molecules of any warm gas, so over its history any atmosphere has leaked away.' },
    { q: 'A probe is launched at exactly escape speed. Far from the planet its speed…', choices: ['is 11.2 km/s', 'tends to zero', 'grows without limit', 'becomes the circular speed'], a: 1,
      why: 'At exactly escape speed the total energy is zero, so the kinetic energy tends to zero as the potential energy tends to zero at infinity.' }
  ],
  applications: ['Interplanetary missions and gravity-assist planning.', 'Explaining which planets and moons hold atmospheres.', 'The size of black holes and the idea of an event horizon.'],
  sim: { id: 'mech2-orbits', params: { v0: 10.9 } }
},

{
  id: 'tides', parent: 'gravitation', title: 'Tides', level: 3,
  short: 'The Moon pulls the near side of the Earth harder than the far side. That difference, not the pull itself, raises two tidal bulges and two high tides a day.',
  keywords: ['tides', 'tidal force', 'high tide', 'low tide', 'spring tide', 'neap tide', 'tidal bulge', 'tidal locking', 'Roche limit', 'differential gravity', 'tidal friction'],
  prereq: ['gravitational-field', 'newtons-law-of-gravitation', 'math:linear-approximation'],
  related: ['circular-orbits', 'angular-momentum', 'rotational-kinetic-energy'],
  body: `
Tides are gravity's way of showing that it changes with distance. The Moon pulls every part of the Earth, but not equally: the side facing it is about 6400 km closer than the centre, and the far side 6400 km farther away.

### Two bulges
The whole Earth falls towards the Moon (both circle their common centre of mass) with the acceleration the Moon gives its **centre**. What remains, relative to the centre, is the difference:
- on the near side the Moon pulls a little harder than on the centre — the water is drawn **towards** the Moon;
- on the far side it pulls a little less — the water is left **behind**, away from the Moon.

So the oceans bulge on both sides, and as the Earth turns beneath the two bulges most coasts get two high tides and two low tides a day. Because the Moon moves along its orbit meanwhile, the cycle repeats every 24 h 50 min, not 24 h: high tide comes about 50 minutes later each day.

### How big is the tidal pull?
For a body of mass $M$ at distance $d$, the difference in its [[gravitational-field|field]] across a radius $R$ is, to a good approximation,
$$a_\\text{tide} \\approx \\frac{2GMR}{d^3}$$
It falls as the **cube** of the distance, not the square. For the Moon it is $1.1\\times10^{-6}\\ \\mathrm{m/s^2}$, about one ten-millionth of $g$. The Sun pulls the Earth 180 times harder than the Moon does, but it is 390 times farther away, and its tidal effect is only 0.46 of the Moon's.

### Spring and neap
When the Sun, Earth and Moon line up — at new Moon and full Moon — the solar and lunar bulges add and the tidal range is largest: **spring tides** (nothing to do with the season). At first and last quarter they are at right angles and partly cancel: **neap tides**.

### Real tides
If the Earth were covered by a deep ocean, the bulges would stand about half a metre high. Real coasts see anything from a few centimetres (parts of the Mediterranean) to 16 m (the Bay of Fundy), because the ocean basins slosh with their own natural periods and the tide [[driven-oscillations|drives them near resonance]]; bays and estuaries funnel the water higher still.

### Tides change the orbits
Friction drags the bulges slightly ahead of the Earth–Moon line. The Moon's pull on the leading bulge acts as a brake on the Earth's spin — the day lengthens by about 2 milliseconds per century — while the bulge tugs the Moon forward, so it spirals outwards by 3.8 cm a year (measured with lasers bounced off mirrors left by Apollo astronauts). The [[angular-momentum|angular momentum]] lost by the spinning Earth goes into the Moon's orbit. The same process long ago braked the Moon's own spin until it kept one face towards us: **tidal locking**.

> [!fact] Tidal forces grow without limit as bodies get closer. Inside the Roche limit a moon held together only by gravity is torn apart — the likely origin of Saturn's rings. Comet Shoemaker–Levy 9 was broken into a string of fragments by Jupiter's tides before it struck the planet in 1994.
`,
  ideas: [
    'Tides come from the difference in gravitational pull across a body, not from the pull itself.',
    'The tidal acceleration ≈ 2GMR/d³ falls with the cube of the distance.',
    'Two bulges, facing towards and away from the Moon, give two high tides roughly every 24 h 50 min.',
    'The Sun\'s tide is about half the Moon\'s; aligned they give spring tides, at right angles neap tides.',
    'Tidal friction slows the Earth\'s spin and pushes the Moon outwards.'
  ],
  pitfalls: [
    'The far-side bulge is caused by centrifugal force from the Earth\'s spin — Both bulges come from the Moon\'s pull varying across the Earth; the spin only carries us through them.',
    'The Sun causes smaller tides because its pull on the Earth is weaker — Its pull is 180 times stronger than the Moon\'s. Its tidal effect is smaller because what matters is the change of pull across the Earth, which falls as 1/d³.',
    'Spring tides happen in spring — They happen twice a month, at new and full Moon, when the Sun and Moon line up.'
  ],
  derivation: {
    title: 'The tidal acceleration 2GMR/d³',
    steps: [
      { text: 'The Moon\'s field at the Earth\'s centre, distance $d$, and at the near surface, distance $d - R$:', tex: 'g_c = \\frac{GM}{d^2}, \\qquad g_n = \\frac{GM}{(d - R)^2}' },
      { text: 'Their difference is what the near-side water feels relative to the Earth as a whole:', tex: 'a_\\text{tide} = \\frac{GM}{d^2}\\left[\\left(1 - \\frac{R}{d}\\right)^{-2} - 1\\right]' },
      { text: 'Since $R/d \\approx 1/60$ is small, use the [[math:linear-approximation|linear approximation]] $(1 - x)^{-2} \\approx 1 + 2x$:', tex: 'a_\\text{tide} \\approx \\frac{GM}{d^2}\\cdot\\frac{2R}{d} = \\frac{2GMR}{d^3}' },
      { text: 'The far side gives the same size to first order, pointing away from the Moon: two bulges.' }
    ]
  },
  formulas: [
    {
      name: 'Tidal acceleration',
      expr: 'a = 2*G*M*R/d^3', tex: 'a_{\\text{tide}} = \\frac{2 G M R}{d^3}',
      vars: {
        a: { name: 'tidal acceleration', q: 'accel', unit: 'm/s²', tex: 'a_{\\text{tide}}' },
        G: { const: 'G' },
        M: { name: 'mass of the body raising the tide', q: 'mass', unit: 'kg', value: 7.342e22 },
        R: { name: 'radius of the body feeling it (or half its length)', q: 'length', unit: 'km', value: 6371 },
        d: { name: 'distance between the centres', q: 'length', unit: 'km', value: 384400 }
      },
      stories: {
        a: 'A moon of mass {M} is {d} from a planet of radius {R}. What tidal acceleration does it produce at the planet\'s surface?',
        d: 'At what distance does a body of mass {M} produce a tidal acceleration of {a} across a radius of {R}?'
      }
    },
    {
      name: 'Tidal effect of one body compared with another',
      expr: 'ratio = (M1/M2)*(d2/d1)^3', tex: 'k = \\frac{M_1}{M_2}\\left(\\frac{d_2}{d_1}\\right)^3',
      vars: {
        ratio: { name: 'ratio of the tidal effects, first body over second', tex: 'k' },
        M1: { name: 'mass of the first body (the Moon)', q: 'mass', unit: 'kg', value: 7.342e22 },
        M2: { name: 'mass of the second body (the Sun)', q: 'mass', unit: 'M☉', value: 1 },
        d1: { name: 'distance of the first body', q: 'length', unit: 'km', value: 384400 },
        d2: { name: 'distance of the second body', q: 'length', unit: 'AU', value: 1 }
      },
      practice: { unknowns: ['ratio', 'd1'] },
      stories: { ratio: 'Compare the tides raised by the Moon ({M1}, {d1} away) and by the Sun ({M2}, {d2} away). How many times stronger is the Moon\'s?' }
    }
  ],
  examples: [
    {
      title: 'Moon against Sun',
      q: 'Compare the tidal accelerations of the Moon ($7.34\\times10^{22}$ kg at $3.84\\times10^{8}$ m) and the Sun ($1.99\\times10^{30}$ kg at $1.50\\times10^{11}$ m) across the Earth\'s radius.',
      steps: [
        'Moon: $\\dfrac{2GMR}{d^3} = \\dfrac{2(6.674\\times10^{-11})(7.34\\times10^{22})(6.37\\times10^{6})}{(3.84\\times10^{8})^3} = 1.10\\times10^{-6}\\ \\mathrm{m/s^2}$.',
        'Sun: $\\dfrac{2(6.674\\times10^{-11})(1.99\\times10^{30})(6.37\\times10^{6})}{(1.50\\times10^{11})^3} = 5.0\\times10^{-7}\\ \\mathrm{m/s^2}$.',
        'Ratio 2.2: the Moon wins, although the Sun\'s total pull on the Earth is 180 times larger.'
      ],
      a: 'Moon 1.1 × 10⁻⁶ m/s², Sun 5 × 10⁻⁷ m/s²: the Moon\'s tide is about 2.2 times the Sun\'s.'
    },
    {
      title: 'Stretched by a black hole',
      q: 'An astronaut 2 m tall falls feet first towards a black hole of 10 solar masses. What is the difference in acceleration between her head and feet 1000 km from its centre? And on the Earth\'s surface?',
      steps: [
        'Use $\\Delta a = 2GML/r^3$ with $L = 2\\ \\mathrm{m}$ as the separation. For the black hole: $GM = 1.33\\times10^{21}\\ \\mathrm{m^3/s^2}$, $r = 10^{6}\\ \\mathrm{m}$.',
        '$\\Delta a = \\dfrac{2 \\times 1.33\\times10^{21} \\times 2}{(10^6)^3} = 5300\\ \\mathrm{m/s^2}$ — about 540 g pulling her apart.',
        'On the Earth: $\\Delta a = \\dfrac{2 \\times 3.99\\times10^{14} \\times 2}{(6.37\\times10^6)^3} = 6\\times10^{-6}\\ \\mathrm{m/s^2}$, utterly unnoticeable.'
      ],
      a: 'About 5000 m/s² (fatal) near the black hole; 6 × 10⁻⁶ m/s² on Earth.'
    }
  ],
  quiz: [
    { q: 'Why are there two high tides a day rather than one?', choices: ['The Sun makes one and the Moon the other', 'The Moon\'s pull varies across the Earth, raising a bulge on the near side and another on the far side', 'The oceans slosh back once a day', 'The Earth wobbles on its axis'], a: 1,
      why: 'The near side is pulled more than the centre and the far side less, so the oceans stretch into two bulges that the Earth turns through.' },
    { q: 'If the Moon were twice as far away, its tidal effect would be…', choices: ['half as big', 'a quarter as big', 'an eighth as big', 'unchanged'], a: 2, why: 'Tidal acceleration ∝ 1/d³, and 2³ = 8.' },
    { q: 'Spring tides (the largest tidal range) happen…', choices: ['in spring', 'at new and full Moon', 'at first and last quarter', 'when the Moon is farthest away'], a: 1,
      why: 'At new and full Moon the Sun, Earth and Moon are in line and the solar and lunar bulges add up.' },
    { q: 'The Moon slowly moves away from the Earth because of tides.', a: true,
      why: 'The Earth\'s spin carries the tidal bulge ahead of the Moon; its pull drags the Moon forwards, raising its orbit by about 3.8 cm a year while the Earth\'s day lengthens.' }
  ],
  applications: ['Tide tables for navigation and harbours.', 'Tidal power stations such as La Rance in France and Sihwa Lake in South Korea.', 'Tidal heating powers the volcanoes of Jupiter\'s moon Io and may keep oceans liquid under the ice of Europa and Enceladus.']
}

);
