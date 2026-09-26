/* HYPER-PHYSICS · content/general-relativity.js — gravity as curved spacetime: the
 * equivalence principle, clocks in gravity, bending of light, black holes and waves. */
Hyper.add(

{
  id: 'equivalence-principle', parent: 'general-relativity', title: 'The equivalence principle', level: 2,
  short: 'In a small laboratory, the effects of gravity cannot be told apart from those of acceleration — the insight that led Einstein to describe gravity as curved spacetime.',
  keywords: ['equivalence principle', 'Einstein elevator', 'free fall', 'weightlessness', 'inertial mass', 'gravitational mass', 'Eötvös', 'MICROSCOPE', 'geodesic', 'curved spacetime'],
  prereq: ['free-fall', 'weight-mass', 'newtons-law-of-gravitation'],
  related: ['gravitational-time-dilation', 'tides', 'circular-orbits', 'gravitational-lensing'],
  body: `
Einstein later called it the happiest thought of his life. In 1907, working at the patent office in Bern, he realised that a person falling freely from a roof would not feel their own weight. Everything around them — a dropped key, their hat — would fall with them and float beside them. In a small enough falling laboratory, gravity simply disappears.

### Two ways to say it
**Falling cancels gravity.** Astronauts on the International Space Station float not because gravity is absent — 400 km up it is still about 90% as strong as on the ground — but because they and the station are falling together round the Earth ([[circular-orbits|in orbit]]).

**Acceleration imitates gravity.** Put a windowless laboratory in deep space and fire its rockets to give it an acceleration of 9.8 m/s². A dropped ball "falls" to the floor at 9.8 m/s² (really the floor rushes up to meet it), a pendulum swings with its usual period, and you stand on the floor with your usual weight. No experiment inside can tell this rocket from a lab resting on the Earth.

The **equivalence principle** says these statements are exact, locally: the effects of a uniform gravitational field cannot be distinguished from those of acceleration.

### Why it works: two kinds of mass are one
Mass plays two roles in Newton's physics. It measures resistance to acceleration, the **inertial mass** in $F = m_i a$ ([[newtons-second-law|Newton's second law]]), and it sets the strength of the gravitational pull, the **gravitational mass** in $F = m_g g$ ([[newtons-law-of-gravitation|Newton's law of gravitation]]). In [[free-fall|free fall]] $a = (m_g/m_i)\\,g$, so if the two were not exactly proportional, a ball of gold and one of aluminium would fall at different rates. Nobody has found any difference: Loránd Eötvös's torsion-balance experiments of 1906–1908 reached a few parts in $10^9$, modern torsion balances $10^{-13}$, and the MICROSCOPE satellite (2022) about $10^{-15}$. For Newton this was a coincidence; for Einstein it was the key.

### Light falls too
Let a beam of light cross the cabin of a rocket that is accelerating upwards. By the time the light reaches the far wall the floor has risen, so the beam strikes lower than it started: inside, its path curves downwards. By the equivalence principle, **gravity must bend light** in the same way ([[gravitational-lensing|gravitational lensing]]). In the same rocket, light sent up from the floor reaches a ceiling that has meanwhile picked up speed, so it arrives redshifted — so light climbing out of gravity must be redshifted too, and clocks lower down must run slow ([[gravitational-time-dilation|gravitational time dilation]]).

### From principle to theory
If every body falls in exactly the same way whatever it is made of, then the fall tells you nothing about the body and everything about the space it moves through. In general relativity (1915) Einstein made that literal: gravity is not a force but the **curvature of spacetime**. A freely falling body follows the straightest possible path through curved spacetime, a *geodesic*. The apple does not accelerate; the ground, held up by the Earth beneath it, accelerates upwards into the apple.

> [!warn] The equivalence holds only **locally**. Over a large region, real gravity gives itself away by [[tides|tidal effects]]: two balls dropped side by side above the Earth drift towards each other, because each falls towards the Earth's centre, while in an accelerating rocket they stay parallel. Tidal effects are the true signature of curved spacetime.
`,
  ideas: [
    'A freely falling observer feels no gravity; an accelerating one feels an imitation of it.',
    'Locally, no experiment can distinguish a uniform gravitational field from acceleration.',
    'Inertial and gravitational mass are equal, tested to about one part in 10¹⁵.',
    'The principle predicts that gravity bends light and slows clocks.',
    'Only tidal effects — differences of gravity from place to place — reveal real curvature.'
  ],
  pitfalls: [
    'Astronauts in orbit are weightless because there is no gravity in space — Gravity at the ISS is about 90% of its surface value; they float because they fall freely along with the station.',
    'Gravity and acceleration are the same thing everywhere — Only locally. Over large distances tidal effects distinguish a real gravitational field from an accelerating frame.',
    'Light bends in gravity because photons have a small mass — Photons are massless; light bends because it follows the curved geometry of spacetime, like everything else in free fall.'
  ],
  formulas: [
    {
      name: 'How far a light beam falls crossing a laboratory',
      expr: 'd = g*L^2/(2*c^2)', tex: 'd = \\frac{g L^2}{2 c^2}',
      vars: {
        d: { name: 'drop of the beam', q: 'length', unit: 'fm' },
        g: { const: 'g' },
        L: { name: 'width of the laboratory', q: 'length', unit: 'm', value: 10 },
        c: { const: 'c' }
      },
      note: 'Light crossing in time $L/c$ falls like anything else, $\\tfrac12 g t^2$. (Full general relativity doubles the bending of light that passes a star; see [[gravitational-lensing]].)',
      stories: {
        d: 'A beam of light crosses a laboratory {L} wide on the Earth\'s surface. How far does it fall on the way?',
        L: 'How wide would a laboratory on Earth need to be for a light beam crossing it to fall {d}?'
      }
    },
    {
      name: 'Tidal convergence of two falling bodies',
      expr: 'da = G*M*s/r^3', tex: '\\Delta a = \\frac{G M s}{r^3}',
      vars: {
        da: { name: 'relative acceleration towards each other', q: 'accel', unit: 'm/s²', tex: '\\Delta a' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 1 },
        s: { name: 'horizontal separation', q: 'length', unit: 'm', value: 1 },
        r: { name: 'distance from the planet\'s centre', q: 'length', unit: 'km', value: 6371 },
        G: { const: 'G' }
      },
      note: 'Two bodies side by side fall along slightly converging lines towards the centre. An accelerating rocket shows no such effect: this is what gives real gravity away.',
      stories: {
        da: 'Two balls are dropped side by side, {s} apart, {r} from the centre of a planet of mass {M}. How fast do they accelerate towards each other?'
      }
    }
  ],
  examples: [
    {
      title: 'Light falling across a room',
      q: 'A beam of light crosses a 10 m laboratory horizontally on the Earth. By how much does it fall?',
      steps: [
        'The crossing takes $t = L/c = 10/(3.00\\times10^{8}) = 3.3\\times10^{-8}$ s.',
        'In that time anything falls $\\tfrac12 g t^2 = \\tfrac12 \\times 9.81 \\times (3.3\\times10^{-8})^2 = 5.5\\times10^{-15}$ m.',
        'That is a few times the diameter of a proton — hopeless to see in a lab, but over the vast distances of space the same effect bends starlight measurably.'
      ],
      a: 'About 5.5 × 10⁻¹⁵ m.'
    },
    {
      title: 'How strong is gravity on the Space Station?',
      q: 'The ISS orbits 420 km above the Earth\'s surface (radius 6371 km). What fraction of surface gravity acts on it, and why do the astronauts float?',
      steps: [
        'Gravity falls off as $1/r^2$: $g_\\mathrm{ISS} = 9.81 \\times \\left(\\dfrac{6371}{6791}\\right)^2 = 8.63\\ \\mathrm{m/s^2}$, 88% of the surface value.',
        'The station and everything in it are in free fall with that acceleration, moving sideways fast enough to keep missing the Earth.',
        'Since everything falls together, nothing presses on anything else: the astronauts feel weightless.'
      ],
      a: 'About 88% of surface gravity; they float because they fall freely with the station.'
    }
  ],
  quiz: [
    { q: 'Astronauts float inside the International Space Station because…', choices: ['there is no gravity in space', 'gravity there is much weaker than on Earth', 'they and the station are falling freely together', 'the station\'s engines cancel gravity'], a: 2,
      why: 'Gravity at 400 km is still about 90% of its surface value. Everything in the station falls with the same acceleration, so nothing pushes on anything else.' },
    { q: 'In a rocket accelerating at 9.8 m/s² in deep space you drop a hammer and a feather (the cabin has no air). They…', choices: ['float where you let go', 'hit the floor together', 'hit the floor hammer first', 'hit the floor feather first'], a: 1,
      why: 'Once released, neither is pushed; the floor accelerates up to meet both at once — exactly like free fall in a vacuum on Earth.' },
    { q: 'A beam of light crosses an upward-accelerating rocket from one wall to the other. Seen from inside, its path…', choices: ['is perfectly straight', 'curves towards the floor', 'curves towards the ceiling', 'is straight but slower than c'], a: 1,
      why: 'The floor rises while the light crosses, so the light hits the far wall lower down: inside, its path curves down, as it would in gravity.' },
    { q: 'A large freely falling laboratory near a planet can, without looking outside, detect that it is near a planet.', a: true,
      why: 'Tidal effects: objects at different places in the lab fall along slightly different directions and with slightly different accelerations, which no uniform acceleration can imitate.' }
  ],
  applications: [
    'Parabolic "zero-g" flights and drop towers, which create weightlessness by free fall.',
    'Satellite tests of the universality of free fall, the most precise tests of any principle in physics.',
    'The foundations of general relativity, from GPS corrections to black holes.'
  ],
  history: 'Einstein formulated the principle in 1907 and spent eight years turning it into general relativity, completed in November 1915. The equality of inertial and gravitational mass had been tested by Newton himself with pendulums of different materials, and by Eötvös\'s torsion balances from 1885 onwards.'
},

{
  id: 'gravitational-time-dilation', parent: 'general-relativity', title: 'Gravitational time dilation', level: 3,
  short: 'Clocks run more slowly deeper in a gravitational field: a clock on the ground loses time against one on a mountain, and light climbing out of gravity is redshifted.',
  keywords: ['gravitational time dilation', 'gravitational redshift', 'Pound–Rebka', 'GPS', 'Schwarzschild', 'clocks and gravity', 'Einstein shift', 'atomic clock', 'gravitational potential'],
  prereq: ['equivalence-principle', 'time-dilation', 'gravitational-potential'],
  related: ['black-holes', 'compact-stars', 'doppler-effect', 'twin-paradox'],
  body: `
Clocks run slower deeper in a gravitational field. A clock on the ground floor loses time against one on the top floor; a clock on the Sun's surface would lose about a minute a year against one far away; and as seen from far away, a clock at the horizon of a [[black-holes|black hole]] would stop altogether.

### From the equivalence principle
Put two clocks in a rocket accelerating at $g$, one on the floor and one on the ceiling a height $h$ above. A light signal sent up from the floor takes a time $h/c$ to arrive, and meanwhile the ceiling has gained a speed $\\Delta v = gh/c$ away from the point of emission. So the ceiling receives the light [[doppler-effect|Doppler-shifted]] to a lower frequency, by the fraction

$$\\frac{\\Delta f}{f} = \\frac{\\Delta v}{c} = \\frac{g h}{c^2}$$

If the floor clock sends one pulse per tick, the ceiling receives them further apart than its own ticks: the floor clock runs slow. By the [[equivalence-principle|equivalence principle]] the same must be true in a gravitational field: a clock a height $h$ lower runs slow by the fraction $gh/c^2$. In general the fractional rate difference is the difference in [[gravitational-potential|gravitational potential]] divided by $c^2$.

### Strong gravity
Outside a spherical mass $M$, a clock at rest at radius $r$ ticks, compared with a clock far away, at the rate

$$\\frac{d\\tau}{dt} = \\sqrt{1 - \\frac{2GM}{r c^2}}$$

a result of Schwarzschild's 1916 solution of Einstein's equations. At the Earth's surface the slowing is $7\\times10^{-10}$; at the Sun's surface $2\\times10^{-6}$; at the surface of a white dwarf around $10^{-4}$; on a neutron star about 20%; and at $r = 2GM/c^2$, the horizon of a black hole, the rate falls to zero.

### Tested from towers to satellites
- **Pound and Rebka (1959)** sent gamma rays up and down a 22.5 m tower at Harvard and measured the predicted shift of $2.5\\times10^{-15}$.
- **Atomic clocks** now resolve the difference between two tables: in 2010 aluminium-ion clocks detected the slowing of one lowered by just 33 cm.
- **GPS satellites**, 20 200 km up, gain about 45.7 µs a day from their weaker gravity and lose about 7.2 µs a day from their orbital speed ([[time-dilation|time dilation]]): a net gain of 38.5 µs a day. Uncorrected, positions would drift by more than 10 km a day, so the satellite clocks are set to tick slightly slow before launch.
- **Light from white dwarfs** such as Sirius B arrives redshifted as if the star were receding at about 80 km/s.

> [!key] Gravitational time dilation is not a delay of signals or a fault in the clocks: every process near the mass, ageing included, runs slower when compared with a distant clock. A clock never notices anything odd about itself.
`,
  ideas: [
    'Clocks lower in a gravitational field run slower than clocks higher up.',
    'Near the ground the fractional difference is gh/c²; in general it is the potential difference over c².',
    'Outside a mass M a static clock runs at √(1 − 2GM/rc²) of the far-away rate.',
    'Light climbing out of a gravitational field is redshifted by the same fraction.',
    'GPS must correct for both gravitational (+45.7 µs/day) and speed (−7.2 µs/day) effects.'
  ],
  pitfalls: [
    'Clocks run slow in gravity because gravity pulls on their parts — Every kind of clock, from pendulum-free atomic clocks to biological ones, is affected equally; it is time itself that runs differently.',
    'Satellite clocks run slow because they move fast — Their speed does slow them, but for GPS the weaker gravity speeds them up by more, so overall they run fast.',
    'Gravitational redshift means light slows down as it climbs — Light always travels locally at c; it loses frequency, not speed.'
  ],
  formulas: [
    {
      name: 'Clock rate near a spherical mass',
      expr: 'tau = t*sqrt(1 - 2*G*M/(r*c^2))', tex: '\\tau = t\\sqrt{1 - \\frac{2GM}{r c^2}}',
      vars: {
        tau: { name: 'time on the clock near the mass', q: 'time', unit: 'h', tex: '\\tau' },
        t: { name: 'time on a distant clock', q: 'time', unit: 'h', value: 1 },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 1.4 },
        r: { name: 'distance from the centre', q: 'length', unit: 'km', value: 12 },
        G: { const: 'G' },
        c: { const: 'c' }
      },
      note: 'For a clock at rest outside the mass ($r > 2GM/c^2$). The defaults describe the surface of a typical neutron star.',
      stories: {
        tau: 'A clock rests {r} from the centre of a star of mass {M}. How much time does it record while {t} passes on a clock far away?',
        r: 'At what distance from a mass {M} does a resting clock record only {tau} while {t} passes far away?'
      }
    },
    {
      name: 'Time gained by a raised clock (weak field)',
      expr: 'dt = g*h*T/c^2', tex: '\\Delta t = \\frac{g h}{c^2}\\, T',
      vars: {
        dt: { name: 'time gained by the higher clock', q: 'time', unit: 'ns', tex: '\\Delta t' },
        g: { const: 'g' },
        h: { name: 'height difference', q: 'length', unit: 'm', value: 1000 },
        T: { name: 'duration', q: 'time', unit: 'day', value: 1 },
        c: { const: 'c' }
      },
      note: 'Valid when $gh \\ll c^2$ and $g$ is nearly constant over the height.',
      stories: {
        dt: 'One clock sits {h} higher than another. How much time does it gain in {T}?',
        h: 'An atomic clock gains {dt} in {T} over an identical clock below it. How much higher is it?'
      }
    },
    {
      name: 'Daily drift of a clock in a circular orbit',
      expr: 'dt = G*M*T/c^2*(1/R - 3/(2*r))', tex: '\\Delta t = \\frac{G M T}{c^2}\\left(\\frac{1}{R} - \\frac{3}{2r}\\right)',
      vars: {
        dt: { name: 'time gained by the orbiting clock (negative: lost)', q: 'time', unit: 'µs', signed: true, tex: '\\Delta t' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 1 },
        T: { name: 'duration', q: 'time', unit: 'day', value: 1 },
        R: { name: 'radius of the planet (ground clock)', q: 'length', unit: 'km', value: 6371 },
        r: { name: 'orbital radius', q: 'length', unit: 'km', value: 26560 },
        G: { const: 'G' },
        c: { const: 'c' }
      },
      note: 'Gravity term $\\frac{GM}{c^2}\\left(\\frac1R - \\frac1r\\right)$ minus the speed term $\\frac{v^2}{2c^2}$ with $v^2 = GM/r$; ignores the Earth\'s rotation. Below $r = 1.5R$ (like the Space Station) the speed wins and the orbiting clock loses time.',
      stories: {
        dt: 'A satellite circles a planet of mass {M} and radius {R} at orbital radius {r}. Compared with a clock on the ground, how much time does its clock gain in {T}?',
        r: 'At what orbital radius around a planet of mass {M} and radius {R} would a clock gain {dt} in {T}?'
      }
    }
  ],
  examples: [
    {
      title: 'GPS clocks',
      q: 'GPS satellites orbit at radius 26 560 km. Find the daily gain from weaker gravity, the daily loss from speed, and the net effect. ($GM_\\oplus = 3.986\\times10^{14}\\ \\mathrm{m^3/s^2}$, $R_\\oplus = 6371$ km.)',
      steps: [
        '$GM/c^2 = 3.986\\times10^{14}/(8.988\\times10^{16}) = 4.435\\times10^{-3}$ m.',
        'Gravity: $4.435\\times10^{-3} \\left(\\dfrac{1}{6.371\\times10^{6}} - \\dfrac{1}{2.656\\times10^{7}}\\right) = 5.29\\times10^{-10}$; times 86 400 s gives $+45.7\\ \\mu$s per day.',
        'Speed: $v^2 = GM/r = 1.50\\times10^{7}\\ \\mathrm{m^2/s^2}$ ($v = 3.87$ km/s), so $v^2/2c^2 = 8.35\\times10^{-11}$, or $-7.2\\ \\mu$s per day.',
        'Net: $+38.5\\ \\mu$s per day. Light travels 11.5 km in that time.'
      ],
      a: '+45.7 µs from gravity, −7.2 µs from speed: +38.5 µs per day.'
    },
    {
      title: 'The Harvard tower',
      q: 'Pound and Rebka sent gamma rays 22.5 m up a tower. What fractional frequency shift did they have to detect?',
      steps: [
        '$\\dfrac{\\Delta f}{f} = \\dfrac{g h}{c^2} = \\dfrac{9.81 \\times 22.5}{(3.00\\times10^{8})^2} = 2.45\\times10^{-15}$.',
        'They used the very sharp gamma-ray line of iron-57 (the Mössbauer effect) and reversed the direction of travel to cancel errors.'
      ],
      a: '2.5 × 10⁻¹⁵'
    }
  ],
  quiz: [
    { q: 'Identical clocks are placed in a deep mine, at sea level and on a mountain top. Which runs fastest?', choices: ['The one in the mine', 'The one at sea level', 'The one on the mountain', 'All run at the same rate'], a: 2,
      why: 'The higher the clock in the gravitational field (the less negative the potential), the faster it runs.' },
    { q: 'Compared with clocks on the ground, the clocks on GPS satellites run…', choices: ['slow, because they move fast', 'fast, because the weaker gravity outweighs the effect of their speed', 'at exactly the same rate', 'fast, because they move fast'], a: 1,
      why: '+45.7 µs/day from gravity against −7.2 µs/day from speed gives a net +38.5 µs/day.' },
    { q: 'Light climbing out of a gravitational field is…', choices: ['blueshifted', 'redshifted', 'slowed below c', 'unaffected'], a: 1,
      why: 'Its frequency, compared with clocks higher up, is lower by the fraction $\\Delta\\Phi/c^2$. Its local speed is still c.' },
    { q: 'An astronaut hovering close to a black hole notices her heart beating slowly.', a: false,
      why: 'All her processes, including her watch and her perception, slow together. Only when she compares with distant clocks does the difference show.' }
  ],
  applications: [
    'GPS, Galileo and other navigation systems, whose clocks are corrected for gravity and speed.',
    'Relativistic geodesy: optical clocks that measure height differences of centimetres through their rate.',
    'Measuring masses and radii of white dwarfs and neutron stars from the redshift of their light.'
  ],
  history: 'Einstein predicted the gravitational redshift in 1907 and again in 1911. It was first confirmed convincingly on Earth by Robert Pound and Glen Rebka in 1959, and with a hydrogen maser flown on a rocket (Gravity Probe A) in 1976.'
},

{
  id: 'gravitational-lensing', parent: 'general-relativity', title: 'Gravitational lensing', level: 3,
  short: 'Mass bends the paths of light, so a star, galaxy or cluster can act as a lens: shifting, magnifying, multiplying and smearing the images of things behind it.',
  keywords: ['gravitational lensing', 'bending of light', 'deflection of starlight', 'Eddington', '1919 eclipse', 'Einstein ring', 'microlensing', 'weak lensing', 'strong lensing', 'arcs'],
  prereq: ['equivalence-principle', 'newtons-law-of-gravitation', 'math:angle-measure'],
  related: ['dark-matter-energy', 'black-holes', 'thin-lenses', 'hubbles-law'],
  body: `
If gravity is the curvature of spacetime, light must follow that curvature too. A ray passing a mass $M$ at closest distance $b$ is bent towards it through the small angle

$$\\alpha = \\frac{4 G M}{c^2\\, b}$$

For light grazing the Sun this is 1.75 arcseconds — the width of a coin seen from 2.5 km. A Newtonian calculation that treats light as fast particles gives exactly half this value; the other half comes from the curvature of space itself, which Newton's theory knows nothing about.

### The eclipse of 1919
Stars close to the Sun can only be seen during a total eclipse. In May 1919 expeditions organised by Arthur Eddington and Frank Dyson photographed the stars around the eclipsed Sun from Sobral in Brazil and the island of Príncipe, and compared their positions with photographs of the same field taken at night months earlier. The stars appeared pushed outwards by about Einstein's amount rather than Newton's, and the news made Einstein world-famous overnight. Those measurements were rough; modern radio interferometry, timing quasars as the Sun passes in front of them, confirms Einstein's value to a few parts in ten thousand.

### A lens made of mass
A galaxy or cluster between us and a more distant source acts as a **gravitational lens**. Unlike a glass lens it bends rays passing *closer* to it *more* ($\\alpha \\propto 1/b$), so it has no single focal point, and it bends all colours equally. The results:

- **Einstein rings.** When source, lens and observer line up exactly, the source is smeared into a ring of angular radius
$$\\theta_E = \\sqrt{\\frac{4GM}{c^2}\\,\\frac{D_{ls}}{D_l\\, D_s}}$$
where $D_l$ and $D_s$ are the distances to the lens and to the source and $D_{ls}$ is the distance between them. A galaxy acting as a lens gives rings about an arcsecond across.
- **Multiple images.** Slightly off the line, one quasar can appear twice or four times. The first "twin quasar" was found in 1979.
- **Arcs.** Massive galaxy clusters stretch background galaxies into long glowing arcs.
- **Weak lensing.** Tiny, systematic distortions in the shapes of millions of faint galaxies map where mass lies — including the [[dark-matter-energy|dark matter]] that emits no light.
- **Microlensing.** A star passing in front of a more distant star brightens it for days or weeks. A planet around the lensing star adds a brief extra blip; more than two hundred exoplanets have been found this way.

### A natural telescope
Lensing magnifies. The Hubble and James Webb telescopes use galaxy clusters as zoom lenses to see galaxies far too faint to find otherwise, and the time delays between the images of a flickering quasar give an independent measurement of the expansion rate of the universe ([[hubbles-law|Hubble's law]]).
`,
  ideas: [
    'Light passing a mass M at distance b is deflected by α = 4GM/(c²b): 1.75″ at the edge of the Sun.',
    'Newton\'s particle theory of light gives only half this angle; the 1919 eclipse favoured Einstein.',
    'A gravitational lens bends rays nearer its centre more, has no single focus, and treats all colours alike.',
    'Lensing produces rings, multiple images, arcs, weak distortions and microlensing brightenings.',
    'Because lensing responds to all mass, it maps dark matter.'
  ],
  pitfalls: [
    'A gravitational lens separates colours like a prism — Gravity bends every wavelength by exactly the same angle.',
    'Light bends near the Sun because it has a tiny mass — Light is massless; it follows the curved geometry of spacetime.',
    'A gravitational lens focuses light to a point like a magnifying glass — Rays farther out are bent less, not more, so there is a line of foci instead of a single focal point.'
  ],
  formulas: [
    {
      name: 'Deflection of light by a mass',
      expr: 'alpha = 4*G*M/(c^2*b)', tex: '\\alpha = \\frac{4 G M}{c^2\\, b}',
      vars: {
        alpha: { name: 'deflection angle', q: 'angle', unit: '″', tex: '\\alpha' },
        M: { name: 'mass of the lens', q: 'mass', unit: 'M☉', value: 1 },
        b: { name: 'closest distance of the ray (impact parameter)', q: 'length', unit: 'R☉', value: 1 },
        G: { const: 'G' },
        c: { const: 'c' }
      },
      note: 'Valid for small angles, with the ray passing outside the mass.',
      stories: {
        alpha: 'Starlight passes a star of mass {M} at a distance of {b} from its centre. Through what angle is it bent?',
        b: 'At what distance from a mass {M} must a ray pass to be deflected by {alpha}?',
        M: 'Light passing {b} from the centre of an object is bent by {alpha}. What is the object\'s mass?'
      }
    },
    {
      name: 'Einstein ring radius',
      expr: 'thetaE = sqrt(4*G*M/c^2*Dls/(Dl*Ds))', tex: '\\theta_E = \\sqrt{\\frac{4GM}{c^2}\\,\\frac{D_{ls}}{D_l\\, D_s}}',
      vars: {
        thetaE: { name: 'angular radius of the ring', q: 'angle', unit: '″', tex: '\\theta_E' },
        M: { name: 'mass of the lens', q: 'mass', unit: 'M☉', value: 1e12 },
        Dls: { name: 'distance from lens to source', q: 'length', unit: 'pc', value: 1e9, tex: 'D_{ls}' },
        Dl: { name: 'distance to the lens', q: 'length', unit: 'pc', value: 1e9, tex: 'D_l' },
        Ds: { name: 'distance to the source', q: 'length', unit: 'pc', value: 2e9, tex: 'D_s' },
        G: { const: 'G' },
        c: { const: 'c' }
      },
      note: 'The defaults are a galaxy of $10^{12}$ solar masses at 1 Gpc lensing a source at 2 Gpc. Over cosmological distances $D_{ls}$ is not simply $D_s - D_l$, which is why it is a separate input.',
      stories: {
        thetaE: 'A galaxy of mass {M}, {Dl} away, lies exactly in front of a quasar {Ds} away ({Dls} beyond the galaxy). What is the angular radius of the Einstein ring?',
        M: 'An Einstein ring of radius {thetaE} forms around a galaxy {Dl} away, lensing a source {Ds} away ({Dls} behind the lens). What is the mass of the lens?'
      }
    }
  ],
  examples: [
    {
      title: 'Starlight grazing the Sun',
      q: 'By how much is starlight bent passing the edge of the Sun ($M = 1.99\\times10^{30}$ kg, $R = 6.96\\times10^{8}$ m)? What would Newton predict?',
      steps: [
        '$\\alpha = \\dfrac{4GM}{c^2 R} = \\dfrac{4 \\times 6.67\\times10^{-11} \\times 1.99\\times10^{30}}{(3.00\\times10^{8})^2 \\times 6.96\\times10^{8}} = 8.48\\times10^{-6}$ rad.',
        'In arcseconds: $8.48\\times10^{-6} \\times 206\\,265 = 1.75″$.',
        'Newton\'s particle picture gives half: $0.87″$. The 1919 eclipse measurements came out near 1.6″ and 2.0″ at the two sites, closer to Einstein.'
      ],
      a: '1.75″ (Newton: 0.87″)'
    },
    {
      title: 'A galaxy as a lens',
      q: 'A galaxy of $10^{12}$ solar masses lies 1 Gpc away, exactly in front of a quasar 2 Gpc away (1 Gpc behind the galaxy). How big is the Einstein ring?',
      steps: [
        '$4GM/c^2 = 4 \\times 1477\\ \\mathrm{m} \\times 10^{12} = 5.91\\times10^{15}$ m (a solar mass gives $GM/c^2 = 1477$ m).',
        '$\\dfrac{D_{ls}}{D_l D_s} = \\dfrac{1}{2\\ \\mathrm{Gpc}} = \\dfrac{1}{6.17\\times10^{25}\\ \\mathrm{m}} = 1.62\\times10^{-26}\\ \\mathrm{m^{-1}}$.',
        '$\\theta_E = \\sqrt{5.91\\times10^{15} \\times 1.62\\times10^{-26}} = 9.8\\times10^{-6}$ rad $= 2.0″$.'
      ],
      a: 'About 2 arcseconds in radius.'
    }
  ],
  quiz: [
    { q: 'A ray passes the Sun at twice the solar radius from its centre. Its deflection is…', choices: ['3.5″', '1.75″', '0.87″', '0.44″'], a: 2,
      why: 'The deflection is proportional to $1/b$: doubling $b$ halves 1.75″.' },
    { q: 'Treating light as fast particles, Newton\'s gravity predicts a deflection at the Sun\'s edge of…', choices: ['zero', '0.87″, half of Einstein\'s value', '1.75″, the same as Einstein\'s', '3.5″, twice Einstein\'s'], a: 1,
      why: 'General relativity doubles it, because space as well as time is curved.' },
    { q: 'A gravitational lens bends blue light more than red light, like a glass prism.', a: false,
      why: 'The deflection $4GM/c^2 b$ contains no wavelength: gravitational lensing is achromatic.' },
    { q: 'Weak gravitational lensing is especially valuable in cosmology because it…', choices: ['works only for nearby stars', 'measures mass whether or not that mass shines', 'measures the temperature of galaxies', 'needs a total eclipse'], a: 1,
      why: 'The distortions depend on all the mass along the line of sight, dark matter included.' }
  ],
  applications: [
    'Mapping dark matter in galaxy clusters and across the sky.',
    'Finding exoplanets and dim stars by microlensing.',
    'Using clusters as natural telescopes to study the most distant galaxies, and lensed quasars to measure the Hubble constant.'
  ],
  history: 'Johann von Soldner computed a Newtonian deflection of starlight at the Sun\'s edge in 1801 — about half the true value. Einstein got the same half-value in 1911 from the equivalence principle alone, then doubled it with the full theory in 1915. The 1919 eclipse expeditions confirmed the larger value; Fritz Zwicky suggested in 1937 that whole galaxies could act as lenses, which was confirmed in 1979.'
},

{
  id: 'black-holes', parent: 'general-relativity', title: 'Black holes', level: 2,
  short: 'A region where gravity is so strong that nothing, not even light, can get out — bounded by the event horizon at the Schwarzschild radius 2GM/c².',
  keywords: ['black hole', 'event horizon', 'Schwarzschild radius', 'singularity', 'photon sphere', 'accretion disc', 'Sagittarius A*', 'M87', 'Event Horizon Telescope', 'Hawking radiation', 'spaghettification'],
  prereq: ['escape-velocity', 'gravitational-time-dilation', 'equivalence-principle'],
  related: ['compact-stars', 'gravitational-waves', 'gravitational-lensing', 'stellar-evolution'],
  body: `
Throw a ball up hard enough and it escapes a planet for good: the [[escape-velocity|escape velocity]] is $\\sqrt{2GM/r}$. Squeeze the same mass into a smaller radius and the escape velocity rises. In 1783 John Michell noticed that a star compact enough would need an escape velocity above the speed of light, and would be dark. That happens at the radius

$$r_s = \\frac{2GM}{c^2}$$

Michell's Newtonian reasoning was not quite right, but general relativity gives exactly the same radius. It is called the **Schwarzschild radius**, after Karl Schwarzschild, who found the solution of Einstein's equations around a spherical mass in 1916, while serving on the Russian front.

### The event horizon
The sphere of radius $r_s$ is the black hole's **event horizon**: a one-way surface. Inside it, every path — even light aimed "outwards" — leads to smaller radius. Nothing that crosses can come back or send a signal out. The horizon is not a material surface; an astronaut falling through a large one would notice nothing special at the moment of crossing.

| Object | Mass | $r_s$ |
|---|---|---|
| Earth | $6.0\\times10^{24}$ kg | 8.9 mm |
| Sun | 1 $M_\\odot$ | 2.95 km |
| Cygnus X-1 | 21 $M_\\odot$ | 62 km |
| Sagittarius A* (centre of the Milky Way) | $4.3\\times10^{6}\\ M_\\odot$ | $1.3\\times10^{7}$ km (0.08 AU) |
| M87* | $6.5\\times10^{9}\\ M_\\odot$ | $1.9\\times10^{10}$ km (130 AU) |

Outside the horizon there are two landmarks. At $1.5\\,r_s$ light can travel in a circle (the **photon sphere**). Inside $3\\,r_s$ no stable circular orbit exists, which sets the inner edge of the disc of hot gas that often surrounds a black hole. Gas spiralling in through such a disc can radiate from 6% to over 30% of its rest energy — far more than [[fusion|fusion]]'s 0.7% — which is why the most luminous objects in the universe, quasars, are powered by black holes.

### Near the horizon
- **Time.** A clock hovering just outside the horizon runs extremely slowly compared with a distant one ([[gravitational-time-dilation|gravitational time dilation]]). A distant observer watching someone fall in sees her slow down, redden and fade at the horizon, never quite crossing; by her own clock she crosses in a finite time.
- **Tides.** The difference in gravity between head and feet stretches a falling body. Near a black hole of a few solar masses this "spaghettification" is lethal well outside the horizon; at the horizon of a supermassive one the stretching across a human body is less than a thousandth of $g$.

### How we know they exist
Black holes of 5 to 100 solar masses form when massive stars collapse ([[stellar-evolution|stellar evolution]]); we see them pulling gas from companion stars in X-ray binaries, and we hear them merge in [[gravitational-waves|gravitational waves]]. At the centre of our galaxy, stars have been tracked for three decades orbiting an invisible object of 4.3 million solar masses (Nobel Prize 2020). The Event Horizon Telescope imaged the "shadow" of M87* in 2019 and of Sagittarius A* in 2022: dark discs about $2.6\\,r_s$ in radius inside rings of light, as predicted.

> [!note] Black holes are not perfectly black. Stephen Hawking showed in 1974 that quantum effects make them glow with a temperature $T = \\hbar c^3/(8\\pi G M k_B)$. For a black hole of one solar mass that is 60 billionths of a kelvin — far colder than the cosmic background — so real black holes absorb more than they emit and grow.
`,
  ideas: [
    'The event horizon of a non-rotating black hole lies at the Schwarzschild radius r_s = 2GM/c², about 3 km per solar mass.',
    'Nothing that crosses the horizon, not even light, can escape.',
    'Outside, a black hole attracts like any other mass of the same size.',
    'Stellar-mass black holes come from collapsed stars; supermassive ones sit at the centres of galaxies.',
    'Hawking radiation gives a black hole a tiny temperature, inversely proportional to its mass.'
  ],
  pitfalls: [
    'Black holes suck in everything around them — Far from the horizon a black hole pulls exactly like a star of the same mass. If the Sun became a black hole, the Earth\'s orbit would not change.',
    'The event horizon is a solid surface — It is a boundary in spacetime; nothing special happens locally when you cross it.',
    'A black hole\'s density is always enormous — The mean density inside the horizon falls as 1/M²: for a black hole of a hundred million suns it is about that of water.'
  ],
  formulas: [
    {
      name: 'Schwarzschild radius',
      expr: 'rs = 2*G*M/c^2', tex: 'r_s = \\frac{2GM}{c^2}',
      vars: {
        rs: { name: 'Schwarzschild radius', q: 'length', unit: 'km', tex: 'r_s' },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 10 },
        G: { const: 'G' },
        c: { const: 'c' }
      },
      stories: {
        rs: 'A black hole has a mass of {M}. What is the radius of its event horizon?',
        M: 'A black hole has an event horizon of radius {rs}. What is its mass?'
      }
    },
    {
      name: 'Hawking temperature',
      expr: 'T = hbar*c^3/(8*pi*G*M*kB)', tex: 'T = \\frac{\\hbar c^3}{8\\pi G M k_B}',
      vars: {
        T: { name: 'temperature of the Hawking radiation', q: 'temperature', unit: 'K' },
        M: { name: 'mass of the black hole', q: 'mass', unit: 'M☉', value: 1 },
        hbar: { const: 'hbar' },
        c: { const: 'c' },
        G: { const: 'G' },
        kB: { const: 'kB' }
      },
      note: 'A black hole is hotter than the 2.7 K cosmic background only if its mass is below about $4.5\\times10^{22}$ kg, less than the Moon\'s.',
      stories: {
        T: 'What is the Hawking temperature of a black hole of mass {M}?',
        M: 'What mass must a black hole have for its Hawking temperature to be {T}?'
      }
    },
    {
      name: 'Mean density inside the horizon',
      expr: 'rho = 3*c^6/(32*pi*G^3*M^2)', tex: '\\rho = \\frac{3 c^6}{32 \\pi G^3 M^2}',
      vars: {
        rho: { name: 'mass divided by the volume inside the horizon', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 1e8 },
        G: { const: 'G' },
        c: { const: 'c' }
      },
      note: 'Simply $M$ divided by $\\tfrac43\\pi r_s^3$. It is a way to compare sizes, not the density of any material inside.',
      stories: {
        rho: 'What is the mean density within the event horizon of a black hole of mass {M}?',
        M: 'How massive must a black hole be for the mean density inside its horizon to be {rho}?'
      }
    }
  ],
  examples: [
    {
      title: 'Squeezing the Earth',
      q: 'To what radius would the Earth ($M = 5.97\\times10^{24}$ kg) have to be compressed to become a black hole?',
      steps: [
        '$r_s = \\dfrac{2GM}{c^2} = \\dfrac{2 \\times 6.674\\times10^{-11} \\times 5.97\\times10^{24}}{(2.998\\times10^{8})^2}$.',
        '$r_s = 8.87\\times10^{-3}$ m — the size of a marble.'
      ],
      a: 'About 9 mm.'
    },
    {
      title: 'The shadow of Sagittarius A*',
      q: 'The black hole at the centre of the Milky Way has $4.3\\times10^{6}$ solar masses and is 8.2 kpc away. Its shadow has a radius of about $2.6\\,r_s$. What angular diameter should the Event Horizon Telescope see?',
      steps: [
        '$r_s = 4.3\\times10^{6} \\times 2.95\\ \\mathrm{km} = 1.27\\times10^{7}$ km $= 1.27\\times10^{10}$ m.',
        'Shadow diameter: $2 \\times 2.6 \\times 1.27\\times10^{10} = 6.6\\times10^{10}$ m.',
        'Distance: $8.2\\ \\mathrm{kpc} = 8.2\\times10^{3} \\times 3.086\\times10^{16} = 2.53\\times10^{20}$ m.',
        'Angle: $6.6\\times10^{10}/2.53\\times10^{20} = 2.6\\times10^{-10}$ rad $= 54$ microarcseconds — like a doughnut on the Moon seen from Earth.'
      ],
      a: 'About 50 microarcseconds (the measured ring is 52 µas).'
    }
  ],
  quiz: [
    { q: 'If the Sun were replaced by a black hole of the same mass, the Earth\'s orbit would…', choices: ['spiral inwards', 'stay the same', 'fly off into space', 'become a perfect circle'], a: 1,
      why: 'Outside the original radius of the Sun, the gravitational field depends only on the mass, which is unchanged.' },
    { q: 'The Schwarzschild radius is proportional to…', choices: ['$M$', '$M^2$', '$\\sqrt{M}$', '$1/M$'], a: 0,
      why: '$r_s = 2GM/c^2$: ten times the mass, ten times the radius.' },
    { q: 'A distant observer watches a probe fall towards a black hole. She sees it…', choices: ['cross the horizon quickly', 'slow down, redden and fade near the horizon', 'bounce back from the horizon', 'accelerate past the speed of light'], a: 1,
      why: 'Gravitational time dilation and redshift grow without limit at the horizon, as seen from far away.' },
    { q: 'At the event horizon, tidal forces are weaker for a supermassive black hole than for a stellar-mass one.', a: true,
      why: 'The tidal acceleration at the horizon scales as $GM/r_s^3 \\propto 1/M^2$: the bigger the black hole, the gentler its horizon.' }
  ],
  applications: [
    'Quasars and active galaxies, powered by gas falling into supermassive black holes.',
    'X-ray binaries, laboratories for matter in extreme gravity.',
    'Gravitational-wave astronomy, which hears black holes merge.'
  ],
  history: 'John Michell (1783) and Pierre-Simon Laplace (1796) imagined "dark stars". Karl Schwarzschild found the exact solution in 1916; Oppenheimer and Snyder showed in 1939 that a collapsing star could form one; John Wheeler popularised the name "black hole" in 1967. Cygnus X-1 (1971) was the first strong candidate.'
},

{
  id: 'gravitational-waves', parent: 'general-relativity', title: 'Gravitational waves', level: 3,
  short: 'Ripples in spacetime, sent out at the speed of light by accelerating masses — first detected in 2015 from two merging black holes.',
  keywords: ['gravitational waves', 'LIGO', 'Virgo', 'strain', 'chirp', 'binary black hole', 'GW150914', 'GW170817', 'Hulse–Taylor', 'binary pulsar', 'interferometer', 'LISA', 'chirp mass'],
  prereq: ['equivalence-principle', 'wave-properties', 'keplers-laws'],
  related: ['black-holes', 'compact-stars', 'electromagnetic-waves', 'relativity-postulates'],
  body: `
In Newton's theory, if the Sun suddenly moved, the Earth would feel the change instantly. In general relativity nothing travels faster than light, not even changes in gravity: when masses accelerate, the curvature of spacetime around them changes, and the change spreads outwards as a wave travelling at $c$ — a **gravitational wave**. Einstein predicted them in 1916 and doubted they could ever be detected.

### What a wave does
A gravitational wave passing through you stretches space in one direction across its path while squeezing it in the perpendicular direction, then the other way round half a cycle later. The effect is measured by the **strain** $h$, the fractional change of length:

$$\\Delta L = h\\,L$$

Even the most violent events in the universe produce strains of only about $10^{-21}$ by the time they reach the Earth. Over the 4 km arm of a detector that is $4\\times10^{-18}$ m — a few thousandths of the width of a proton.

Spherically symmetric motion makes no waves; the source needs a changing lopsidedness (a changing *quadrupole moment*), such as two masses orbiting each other. The wave then has **twice** the orbital frequency, because the pair looks the same after half an orbit.

### The first evidence
In 1974 Russell Hulse and Joseph Taylor found a pulsar orbiting another neutron star every 7.75 hours. Timing its pulses over the following years showed the orbit shrinking — the stars spiralling together by about 3.5 m a year — exactly as the energy carried off by gravitational waves predicted (Nobel Prize 1993).

### Hearing black holes collide
The LIGO detectors in Hanford and Livingston are giant [[relativity-postulates|Michelson]] interferometers: laser light runs back and forth along two 4 km arms at right angles, and a passing wave changes their lengths in opposite senses. On 14 September 2015 both detectors recorded GW150914, a signal lasting a fifth of a second: a **chirp** rising in frequency and loudness, then abruptly stopping. It came from two black holes of about 36 and 29 solar masses, 1.3 billion light-years away, spiralling together into one of 62 solar masses. The missing 3 solar masses — about $5\\times10^{47}$ J — left as gravitational waves, at a peak power greater than that of all the stars in the observable universe combined (Nobel Prize 2017).

LIGO, Virgo and KAGRA have since recorded hundreds of mergers. On 17 August 2017 two neutron stars merged (GW170817), and telescopes caught the light that followed: gamma rays arrived 1.7 s after the gravitational waves, after a journey of 130 million years — so the two travel at the same speed to better than one part in $10^{15}$. The glowing debris showed freshly made heavy elements such as gold and platinum.

### Still to come
Different sources sing at different frequencies. Ground-based detectors hear 10 Hz to a few kHz. The space mission LISA, planned for the 2030s, will listen at millihertz to merging supermassive black holes; and pulsar timing arrays, which use the Milky Way's pulsars as a galaxy-sized detector, reported evidence in 2023 of a background hum at nanohertz frequencies.

> [!tip] The frequency tells you how tight the orbit is: for two masses a distance $a$ apart, [[keplers-laws|Kepler's third law]] gives the orbital angular frequency $\\sqrt{G(M_1 + M_2)/a^3}$, and the wave frequency is twice the orbital frequency.
`,
  ideas: [
    'Accelerating masses send out ripples of spacetime curvature that travel at c.',
    'A wave stretches space in one direction and squeezes it in the perpendicular one; its size is the strain h = ΔL/L.',
    'Strains reaching Earth are around 10⁻²¹, detected with kilometre-scale laser interferometers.',
    'A binary emits at twice its orbital frequency, and the signal chirps upwards as the orbit shrinks.',
    'Merging black holes and neutron stars have been heard since 2015.'
  ],
  pitfalls: [
    'Gravitational waves are the same as gravity waves on water — Those are ordinary waves in a fluid, where gravity is the restoring force; gravitational waves are ripples of spacetime itself.',
    'A gravitational wave moves the detector mirrors along its direction of travel — It is transverse: it changes distances across its direction of travel.',
    'Anything that moves emits noticeable gravitational waves — Only massive, compact, fast-accelerating and lopsided systems, like merging black holes, produce detectable waves.'
  ],
  formulas: [
    {
      name: 'Length change from a strain',
      expr: 'dL = h*L', tex: '\\Delta L = h L',
      vars: {
        dL: { name: 'change in arm length', q: 'length', unit: 'fm', tex: '\\Delta L' },
        h: { name: 'strain', value: 1e-21 },
        L: { name: 'arm length', q: 'length', unit: 'km', value: 4 }
      },
      stories: {
        dL: 'A gravitational wave of strain {h} passes a detector with arms {L} long. By how much does an arm change length?',
        h: 'A detector with {L} arms registers a length change of {dL}. What is the strain?'
      }
    },
    {
      name: 'Frequency of the waves from a binary',
      expr: 'f = sqrt(G*M/a^3)/pi', tex: 'f = \\frac{1}{\\pi}\\sqrt{\\frac{G M}{a^3}}',
      vars: {
        f: { name: 'gravitational-wave frequency', q: 'frequency', unit: 'Hz' },
        M: { name: 'total mass of the pair', q: 'mass', unit: 'M☉', value: 65 },
        a: { name: 'separation', q: 'length', unit: 'km', value: 350 },
        G: { const: 'G' }
      },
      note: 'Twice the orbital frequency from Kepler\'s third law, for a circular orbit.',
      stories: {
        f: 'Two black holes with a total mass of {M} orbit {a} apart. At what frequency do they emit gravitational waves?',
        a: 'A binary of total mass {M} emits gravitational waves at {f}. How far apart are the two bodies?'
      }
    },
    {
      name: 'Chirp mass',
      expr: 'Mc = (m1*m2)^(3/5)/(m1 + m2)^(1/5)', tex: '\\mathcal{M} = \\frac{(m_1 m_2)^{3/5}}{(m_1 + m_2)^{1/5}}',
      vars: {
        Mc: { name: 'chirp mass', q: 'mass', unit: 'M☉', tex: '\\mathcal{M}' },
        m1: { name: 'mass of the first body', q: 'mass', unit: 'M☉', value: 36 },
        m2: { name: 'mass of the second body', q: 'mass', unit: 'M☉', value: 29 }
      },
      note: 'The combination of the masses that sets how fast the frequency sweeps upwards; it is the mass measured most precisely from a signal.',
      stories: {
        Mc: 'Two black holes of {m1} and {m2} spiral together. What is the chirp mass of the pair?',
        m1: 'A merger signal has chirp mass {Mc}, and one of the bodies has mass {m2}. What is the mass of the other?'
      }
    }
  ],
  examples: [
    {
      title: 'How small is small?',
      q: 'A wave with strain $1.0\\times10^{-21}$ passes through a detector with 4.0 km arms. How much does an arm change length?',
      steps: [
        '$\\Delta L = hL = 1.0\\times10^{-21} \\times 4.0\\times10^{3}\\ \\mathrm{m} = 4.0\\times10^{-18}$ m.',
        'A proton is about $1.7\\times10^{-15}$ m across, so this is about 1/400 of a proton.',
        'LIGO reaches this sensitivity by bouncing the light hundreds of times along each arm and using very high laser power.'
      ],
      a: '4 × 10⁻¹⁸ m'
    },
    {
      title: 'The energy of GW150914',
      q: 'Black holes of 36 and 29 solar masses merged into one of 62. How much energy was radiated, and how does it compare with the Sun\'s total output over its 10-billion-year life ($L_\\odot = 3.8\\times10^{26}$ W)?',
      steps: [
        'Mass lost: $36 + 29 - 62 = 3\\ M_\\odot = 3 \\times 1.99\\times10^{30} = 6.0\\times10^{30}$ kg.',
        '$E = mc^2 = 6.0\\times10^{30} \\times (3.00\\times10^{8})^2 = 5.4\\times10^{47}$ J.',
        'Sun\'s lifetime output: $3.8\\times10^{26} \\times 3.2\\times10^{17}\\ \\mathrm{s} = 1.2\\times10^{44}$ J.',
        'Ratio: about 4500 solar lifetimes, released in a fraction of a second.'
      ],
      a: '5 × 10⁴⁷ J, thousands of times what the Sun radiates in its whole life.'
    }
  ],
  quiz: [
    { q: 'A gravitational wave travelling straight up passes through a ring of free particles lying flat on the ground. The ring…', choices: ['moves up and down', 'is squeezed into an ellipse one way, then the other', 'expands and shrinks uniformly', 'rotates'], a: 1,
      why: 'The wave is transverse and has a stretch-and-squeeze pattern: it elongates the ring along one direction while compressing it along the perpendicular one, alternating each half cycle.' },
    { q: 'Two neutron stars orbit each other 50 times a second. Their gravitational waves have a frequency of…', choices: ['25 Hz', '50 Hz', '100 Hz', '200 Hz'], a: 2,
      why: 'After half an orbit the pair looks the same again, so the wave repeats twice per orbit.' },
    { q: 'Which of these would NOT emit gravitational waves?', choices: ['Two neutron stars in orbit', 'A spinning, lumpy bar', 'A perfectly spherical star pulsating in and out symmetrically', 'Two merging black holes'], a: 2,
      why: 'Spherically symmetric motion produces no gravitational waves; a changing lopsidedness is needed.' },
    { q: 'The neutron-star merger GW170817 showed that gravitational waves travel at the speed of light.', a: true,
      why: 'Gamma rays arrived only 1.7 s after the waves, after 130 million years of travel.' }
  ],
  applications: [
    'Gravitational-wave astronomy: weighing black holes and neutron stars and counting how often they merge.',
    'Measuring the expansion rate of the universe with "standard sirens", whose distance follows from the signal itself.',
    'Finding where gold and other heavy elements are made.'
  ],
  history: 'Einstein predicted gravitational waves in 1916. Joseph Weber claimed detections with metal bars in the late 1960s that could not be confirmed. The Hulse–Taylor pulsar (1974) gave indirect proof; LIGO, conceived by Rainer Weiss, Kip Thorne and Ronald Drever and led to completion by Barry Barish, made the first direct detection in 2015.'
}

);
