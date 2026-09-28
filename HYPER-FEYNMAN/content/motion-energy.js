/* HYPER-FEYNMAN · content/motion-energy.js — Motion, Energy and Gravitation:
 *   energy-and-motion   conservation of energy, time and distance, motion and the calculus, Newton's laws step by step,
 *                       momentum, vectors, force, work and potential energy (FLP I-4, I-5, I-8 to I-14)
 *   gravitation-topic   the theory of gravitation, Kepler's laws, the lost lecture, gravity against electricity
 *                       (FLP I-7; Feynman's Lost Lecture; FLP II-1)
 * Simulations in sims/motion-energy.js (prefix mot-). */
Hyper.add(

{
  id: 'conservation-of-energy', parent: 'energy-and-motion', title: 'Conservation of energy', level: 1,
  short: 'There is a number — computed from speeds, heights, stretches, temperatures and more — that stays exactly the same whatever happens in a closed system. Energy is not a substance; it is a total you calculate, and it never changes.',
  keywords: ['energy', 'conservation of energy', 'kinetic energy', 'potential energy', 'heat', 'perpetual motion', 'reversible machine', 'weight lifting', 'bookkeeping', 'Joule', 'neutrino', 'first law'],
  prereq: ['atomic-hypothesis', 'basic-physics', 'physics:work-energy'],
  related: ['work-and-potential-energy', 'great-conservation-principles', 'conservation-from-symmetry', 'laws-of-thermodynamics-feyn', 'relativistic-mass-energy', 'physics:conservation-of-energy', 'physics:kinetic-energy'],
  body: `
Feynman began his account of mechanics not with forces but with energy, and he was careful about what kind of statement its conservation is. It does not describe a mechanism or a substance. It says that there is a certain number — computed from the speeds, heights, stretches, temperatures, chemical make-up and so on of everything in a closed system — and that however the system changes, the number comes out the same. Physics has formulas for every form of energy; it has no picture of what energy *is* underneath them.

### Counting what you cannot see
He made the idea concrete with a child's set of toy blocks that always comes to the same count, even on days when some blocks are hidden and have to be counted indirectly. The simulation on this page is our own version. A weight bounces on a spring; its energy is drawn as 60 blocks. The blocks in the *motion* are in plain sight. The others are stored in forms you cannot see directly and must work out from a gauge: a **height** read off a ruler, a **stretch** of the spring, a **rise in temperature** of the air and the damper. Each gauge reading is turned into a number of blocks by a formula, and the total is always 60.

### The bookkeeping
For a mass $m$ moving at speed $v$, at height $h$, on a spring of stiffness $k$ stretched by $x$, with heat $Q$ given to its surroundings:

$$E = \\underbrace{\\tfrac12 m v^2}_{\\text{motion}} + \\underbrace{m g h}_{\\text{height}} + \\underbrace{\\tfrac12 k x^2}_{\\text{spring}} + \\underbrace{Q}_{\\text{heat}} = \\text{constant}$$

The [[?sum]] runs over every form present; each term alone may rise and fall, but the total does not. Only *changes* matter: you may measure heights from the floor or from the table, and the constant simply shifts.

| Form | Formula | A real number |
|---|---|---|
| Kinetic | $\\tfrac12 mv^2$ | a 1200 kg car at 100 km/h: 0.46 MJ |
| Gravitational | $mgh$ | 70 kg climbing 3 m of stairs: 2.1 kJ |
| Elastic | $\\tfrac12 kx^2$ | a bow drawn 0.5 m to 300 N: about 75 J |
| Heat | $mc\\,\\Delta T$ | 1 L of water warmed by 1 °C: 4.2 kJ |
| Chemical | from reactions | a 50 g chocolate bar: about 1 MJ |
| Mass | $mc^2$ | 1 g of matter: $9\\times10^{13}$ J |

### Why weight times height?
Feynman showed that the formula for gravitational energy follows from one assumption: there is no perpetual motion — no machine can lift weights, return to where it started, and have something left over. Call a machine *reversible* if it can run backwards as easily as forwards. Suppose a reversible machine lowers 4 kg by 0.5 m and in doing so lifts 1 kg by a height $X$. Could another machine lift the 1 kg *higher* than $X$ with the same 4 kg drop? Then let it do so, and use the reversible machine backwards to lower the 1 kg by $X$ and bring the 4 kg back up. Everything is back where it began, except that the 1 kg sits a little higher than before — lifted for nothing. So no machine beats a reversible one, all reversible machines agree, and a simple lever shows $X = 2$ m. The thing that cannot be created is **weight × height**: $4 \\times 0.5 = 1 \\times 2$. Energy of motion follows by letting a weight fall: a drop $h$ gives the speed $v = \\sqrt{2gh}$, so $\\tfrac12 mv^2$ is the energy that the height became.

### Hidden forms, and a famous rescue
When friction stops a sliding block, energy seems to vanish; it has gone into the random jiggling of atoms, which is heat ([[kinetic-theory-feyn]]). James Joule measured the exchange rate in the 1840s: 4.18 J warms a gram of water by 1 °C. In the 1920s energy seemed to go missing in beta decay; Wolfgang Pauli proposed (1930) an unseen particle to carry it off, and the neutrino was found in 1956. Why energy is conserved at all is answered on [[conservation-from-symmetry]]: it goes hand in hand with the laws not changing with time.

> [!key] Energy is a number, not a thing. Add up every form — motion, height, stretch, heat, chemical, mass — and the total for a closed system never changes. When some seems to vanish, look for where it is hidden.

**In the simulation:** watch the total stay at 60 while blocks fly between the bins; hide the stored forms and count them from the gauges; switch off *Count the heat* and the total seems to leak away, exactly as it did for the physicists before Joule; press *Push* and blocks arrive from outside — the work done by your hand.
`,
  ideas: [
    'Energy is a number computed from the state of a system; for a closed system the total never changes.',
    'Each form has its own formula: ½mv², mgh, ½kx², mcΔT, mc² …; none of them alone is conserved, only the sum.',
    'The absence of perpetual motion forces the gravitational energy to be weight × height.',
    'Energy that seems to disappear has been hidden — as heat, as chemical energy, or carried off by something unseen (the neutrino).',
    'Only changes of energy are measurable, so the zero of potential energy may be chosen freely.'
  ],
  pitfalls: [
    'Friction destroys energy — It turns ordered motion into the disordered motion of atoms (heat); the total is unchanged, only harder to use.',
    'Energy is a kind of fluid or substance inside things — It is a calculated total; physics gives formulas for each form but no picture of energy itself.',
    'Potential energy has an absolute value — Only differences matter; moving the zero of height changes every mgh by the same amount and changes no prediction.'
  ],
  formulas: [
    {
      name: 'Kinetic energy', expr: 'K = 1/2*m*v^2', tex: 'K = \\tfrac12 m v^2',
      vars: {
        K: { name: 'kinetic energy', q: 'energy', unit: 'kJ' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1200 },
        v: { name: 'speed', q: 'speed', unit: 'km/h', value: 100 }
      },
      note: 'Doubling the speed quadruples the energy — which is why braking distances grow so fast.',
      stories: { K: 'A car of {m} travels at {v}. How much energy must the brakes turn into heat to stop it?', v: 'A body of {m} carries {K} of kinetic energy. How fast is it moving?' }
    },
    {
      name: 'Gravitational energy near the ground', expr: 'U = m*g*h', tex: 'U = m g h',
      vars: {
        U: { name: 'gravitational potential energy', q: 'energy', unit: 'J' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 70 },
        g: { const: 'g' },
        h: { name: 'height lifted', q: 'length', unit: 'm', value: 3, signed: true }
      },
      note: 'Measured from any level you choose; only differences matter. Valid while h is small compared with the Earth\'s radius.',
      stories: { U: 'A person of {m} climbs a flight of stairs {h} high. How much energy is stored in the height?', h: 'Lifting a {m} load stores {U}. How high was it lifted?' }
    },
    {
      name: 'Speed after a fall (height becomes motion)', expr: 'v = sqrt(2*g*h)', tex: 'v = \\sqrt{2 g h}',
      vars: {
        v: { name: 'speed at the bottom', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        h: { name: 'height fallen', q: 'length', unit: 'm', value: 10 }
      },
      note: 'From mgh = ½mv²: the mass cancels. No air resistance; the path does not matter, only the drop.',
      stories: { v: 'A stone falls {h}. How fast is it going at the bottom?', h: 'A diver enters the water at {v}. From what height did she drop?' }
    },
    {
      name: 'Heat warming a body', expr: 'Q = m*cp*dT', tex: 'Q = m c\\,\\Delta T',
      vars: {
        Q: { name: 'heat added', q: 'energy', unit: 'kJ' },
        m: { name: 'mass warmed', q: 'mass', unit: 'kg', value: 20 },
        cp: { name: 'specific heat', q: 'specificheat', unit: 'J/(kg·K)', value: 450, tex: 'c' },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 51, tex: '\\Delta T' }
      },
      note: 'Steel about 450 J/(kg·K), aluminium 900, water 4186.',
      stories: { dT: 'Brake discs of {m} (specific heat {cp}) absorb {Q}. How much do they warm up?', Q: 'How much heat warms {m} of steel ({cp}) by {dT}?' }
    }
  ],
  examples: [
    {
      title: 'Where does a car\'s motion go?',
      q: 'A 1200 kg car at 100 km/h brakes to a stop. Its four steel brake discs have a total mass of 20 kg (specific heat 450 J/(kg·K)). If all the energy went into the discs, how much would they warm?',
      steps: [
        '$v = 100/3.6 = 27.8$ m/s, so $K = \\tfrac12 \\times 1200 \\times 27.8^2 = 4.63\\times10^5$ J.',
        'The motion becomes heat: $Q = K$, and $\\Delta T = Q/(mc) = 4.63\\times10^5/(20 \\times 450) = 51$ K.',
        'In practice some heat goes to the pads and the air, so the discs warm a little less — but a hard stop from motorway speed really does heat them by tens of degrees.'
      ],
      a: 'About 51 °C warmer: 0.46 MJ of motion becomes heat.'
    },
    {
      title: 'A lever that cannot cheat',
      q: 'A lever lowers 4 kg by 0.5 m and lifts 1 kg. How high can it lift it, at most? What would happen if some cleverer machine lifted the 1 kg by 2.1 m instead?',
      steps: [
        'Weight × height cannot be created: $4 \\times 0.5 = 1 \\times X$, so $X = 2$ m for a perfect (reversible) lever.',
        'If a machine lifted it 2.1 m, run the perfect lever backwards: lower the 1 kg by 2 m and raise the 4 kg by 0.5 m. Everything is restored, and the 1 kg is still 0.1 m higher.',
        'Repeat, and you lift weights for ever at no cost — perpetual motion, which never happens. So 2 m is the limit.'
      ],
      a: 'At most 2 m; anything more would be a perpetual-motion machine.'
    },
    {
      title: 'Climbing a mountain on a sandwich',
      q: 'A 70 kg walker climbs 1000 m. How much energy goes into height? Muscles turn about a quarter of food energy into work. How many kilocalories does the climb cost?',
      steps: [
        '$U = mgh = 70 \\times 9.81 \\times 1000 = 6.87\\times10^5$ J $= 164$ kcal (1 kcal = 4184 J).',
        'At 25 % efficiency the body burns $164/0.25 \\approx 660$ kcal; the other three quarters become heat, which is why climbers sweat.'
      ],
      a: '0.69 MJ (164 kcal) into height, about 660 kcal of food.'
    }
  ],
  quiz: [
    { q: 'A pendulum swings with slowly shrinking swings and stops. The energy it had…', choices: ['is now heat in the air and the pivot', 'has been destroyed by friction', 'is stored in the string', 'went into the Earth\'s gravity'], a: 0, why: 'Friction turns ordered motion into the random motion of molecules. The total is unchanged; it is only spread out.' },
    { q: 'You double the speed of a car. Its kinetic energy becomes…', choices: ['4 times larger', '2 times larger', '√2 times larger', 'unchanged'], a: 0, why: 'K = ½mv²: the energy goes as the square of the speed.' },
    { q: 'Two balls are released from the same height, one dropped straight down and one rolled down a smooth curved ramp (no friction, ignore rolling). At the bottom…', choices: ['they have the same speed', 'the dropped ball is faster', 'the ramp ball is faster', 'it depends on the shape of the ramp'], a: 0, why: 'Only the drop in height matters: mgh = ½mv² gives v = √(2gh) whatever the path. The ramp takes longer, but ends at the same speed.' },
    { q: 'Measuring heights from the table instead of the floor changes the predicted speed of a falling cup.', a: false, why: 'Every potential energy shifts by the same constant; only differences enter the predictions.' },
    { q: 'How fast (in m/s) does a stone hit the ground after falling 20 m, ignoring air?', answer: 19.8, unit: 'm/s', why: 'v = √(2gh) = √(2 × 9.81 × 20) ≈ 19.8 m/s.' }
  ],
  problems: [
    { q: 'A 0.2 kg ball is thrown straight up at 15 m/s. Ignoring air, how high does it rise?', answer: 11.5, unit: 'm', tol: 0.02, hint: 'All the kinetic energy becomes height.',
      steps: ['$\\tfrac12 mv^2 = mgh$, so $h = v^2/(2g)$ — the mass cancels.', '$h = 15^2/(2 \\times 9.81) = 11.5$ m.'] },
    { q: 'A 2 kg block slides 3 m down a slope that drops 1.5 m and reaches the bottom at 4.5 m/s. How much energy went into heat?', answer: 9.18, unit: 'J', tol: 0.03, hint: 'Compare the height energy lost with the motion gained.',
      steps: ['Height energy lost: $mgh = 2 \\times 9.81 \\times 1.5 = 29.4$ J.', 'Motion gained: $\\tfrac12 \\times 2 \\times 4.5^2 = 20.25$ J.', 'Heat: $29.4 - 20.25 = 9.2$ J.'] }
  ],
  applications: [
    'Engineers check every design of a machine against the energy books: a gearbox, a pump or a hydroelectric dam can only redistribute energy, never make it.',
    'Food labels, electricity bills and fuel ratings are all energy counted in different units: kcal, kWh and MJ/kg.',
    'Particle physicists find unseen particles — the neutrino, dark-matter candidates — by looking for energy that is missing from the visible pieces.'
  ],
  history: 'The idea grew slowly. Gottfried Leibniz argued for the conservation of "living force" (mv²) in the 1680s. In the 1840s Julius Robert Mayer, James Prescott Joule and Hermann von Helmholtz established the general law, Joule by measuring the heat made by falling weights stirring water (about 4.18 J per calorie). Emmy Noether showed in 1918 that the conservation of energy follows from the laws being the same at all times. Pauli\'s neutrino (1930) saved the law in beta decay; Frederick Reines and Clyde Cowan detected it in 1956.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 4 (Conservation of Energy) — energy as an abstract number, the counting analogy, weight-lifting machines and the impossibility of perpetual motion, kinetic energy and the other forms.',
    '*The Character of Physical Law*, lecture 3 (The Great Conservation Principles) — energy among the conserved quantities, and what conservation means.',
    '*Six Easy Pieces* (1994) — reprints the conservation-of-energy lecture as its fourth piece.'
  ],
  sim: 'mot-energy-blocks'
},

{
  id: 'time-and-distance', parent: 'energy-and-motion', title: 'Time and distance: the scales of nature', level: 1,
  short: 'Time is measured by counting something that repeats, distance by rulers, triangles and echoes. Between the lifetime of the shortest-lived particles and the age of the universe lie more than forty powers of ten — and light links the two scales.',
  keywords: ['time', 'distance', 'clock', 'second', 'metre', 'caesium', 'parallax', 'triangulation', 'radar', 'light-year', 'parsec', 'radioactive dating', 'half-life', 'orders of magnitude', 'powers of ten', 'scales'],
  prereq: ['atomic-hypothesis', 'basic-physics', 'math:scientific-notation'],
  related: ['motion-and-calculus', 'principle-of-relativity', 'spacetime-geometry', 'math:logarithmic-scales', 'physics:solar-system'],
  body: `
Before we can talk about motion we need to measure where and when. Feynman devoted a whole lecture to this, and his message was that both measurements are ultimately a matter of *counting* — and that nature uses a staggering range of scales.

### Time: counting repeats
Every clock counts something that repeats in the same way each time: the turning Earth, a swinging pendulum, a quartz crystal vibrating 32 768 times a second, and since 1967 the caesium atom — the second is *defined* as 9 192 631 770 oscillations of the radiation from a particular transition of caesium-133. To be sure a repeating thing is a good clock, compare it with others: if two different clocks keep in step, we trust both.

Shorter times need other tricks. Electronics resolve nanoseconds; laser pulses reach attoseconds ($10^{-18}$ s). The lifetimes of the shortest-lived particles — around $10^{-23}$ s for those that decay through the strong force, less still for the W and Z — are not timed at all but inferred — from the spread of their energies, or from how far a fast particle travels before it decays. Long times are read from **radioactive clocks**: a fraction $f$ of a radioactive substance remains after a time

$$t = T_{1/2}\\log_2\\frac{1}{f}$$

where $T_{1/2}$ is the half-life — the time for half of it to decay (an [[?exponential]] decay; the [[?logarithm]] undoes it). Carbon-14 ($T_{1/2}$ = 5730 years) dates wood and bone; uranium-238 (4.47 billion years) dates rocks. Meteorites give the Earth's age, 4.54 billion years; the expansion of the universe gives about 13.8 billion years for the time since the Big Bang.

### Distance: rulers, triangles, echoes
Rulers work from millimetres to kilometres. Beyond that we use **triangulation**: from the two ends of a known baseline $b$, sight the object; the small angle $\\theta$ between the two sight lines gives $d \\approx b/\\theta$ (with $\\theta$ in [[?radian|radians]] — a [[?small-approximation|small-angle approximation]]). The Earth's orbit makes the biggest practical baseline: a star 1 parsec away shifts by 1 arcsecond as we go round the Sun. Proxima Centauri, the nearest star, has a parallax of 0.768″: 1.30 pc, or 4.24 light-years. Radar and laser echoes time the trip there and back — the distance to the Moon is known to millimetres from laser pulses bounced off reflectors left by the Apollo astronauts. Beyond the reach of parallax, astronomers use "standard candles" of known brightness.

Small distances are measured with waves: light microscopes resolve about 0.2 µm; X-rays and electrons, with wavelengths near 0.1 nm, reveal the spacing of atoms; the sizes of nuclei, a few femtometres, come from scattering very fast particles off them.

| Scale | Distance | Time |
|---|---|---|
| smallest measured | proton, $0.8\\times10^{-15}$ m | strongly decaying particles, $\\sim10^{-23}$ s |
| atoms | $10^{-10}$ m | one period of light, $2\\times10^{-15}$ s |
| human | 1.7 m | a heartbeat, 1 s |
| Earth and Moon | $3.8\\times10^{8}$ m | a month, $2.6\\times10^{6}$ s |
| stars | 4.24 ly $= 4\\times10^{16}$ m | age of the Earth, $1.4\\times10^{17}$ s |
| universe | $\\sim4\\times10^{26}$ m | age of the universe, $4.4\\times10^{17}$ s |

### Light ties the two together
Since 1983 the metre has been defined through the speed of light, fixed at exactly 299 792 458 m/s: a distance is the time light takes to cross it. A light-second is 300 000 km, a light-year $9.46\\times10^{15}$ m. In the simulation the two rulers are joined this way: each time sits above the distance light covers in it. Notice how nicely the two spans match — both cover about forty-two [[?scientific-notation|powers of ten]]. On a [[?logarithm|logarithmic]] ruler each equal step multiplies by ten; it is the only way to fit a proton and a galaxy on one page.

> [!key] Time is measured by counting repeats, distance by rulers, triangles and light-echoes. Nature spans more than forty powers of ten in each — and the speed of light converts one into the other.

Feynman closed his lecture with a warning worth keeping in mind for [[principle-of-relativity|relativity]]: our ideas of distance and time are not as simple as they look, because observers moving relative to each other do not agree on them.
`,
  ideas: [
    'Every clock counts a repeating process; clocks are trusted when different kinds keep in step.',
    'Very short times are inferred (from energy spreads or decay lengths); very long ones are read from radioactive decay.',
    'Distances beyond rulers come from triangulation (d ≈ b/θ), parallax, and the time of flight of light and radar.',
    'Nature spans about 42 powers of ten in both distance and time, which is why logarithmic scales are needed.',
    'Since 1983 the metre is defined by the speed of light: distance is measured with time.'
  ],
  pitfalls: [
    'A logarithmic ruler is just a squashed ordinary ruler — Equal steps on it multiply rather than add: the step from 1 m to 10 m is the same length as from 10¹⁶ m to 10¹⁷ m.',
    'Half-lives mean everything has decayed after two half-lives — Each half-life halves what is left: after two, a quarter remains; after ten, about a thousandth.',
    'The lifetimes of the shortest-lived particles are timed with fast clocks — No clock is that fast; they are inferred from the spread of the particles\' energies or from their decay lengths.'
  ],
  formulas: [
    {
      name: 'Triangulation (small angles)', expr: 'd = b/theta', tex: 'd = \\dfrac{b}{\\theta}',
      vars: {
        d: { name: 'distance to the object', q: 'length', unit: 'km' },
        b: { name: 'baseline between the two sightings', q: 'length', unit: 'm', value: 100 },
        theta: { name: 'angle between the sight lines', q: 'angle', unit: '°', value: 2, min: 0, max: 20, tex: '\\theta' }
      },
      note: 'Valid for small angles (θ ≲ 10°); θ is used in radians inside the formula.',
      stories: { d: 'Two surveyors {b} apart see a summit, their sight lines meeting at {theta}. How far is it?', b: 'To see a peak {d} away with sight lines {theta} apart, how long a baseline is needed?' }
    },
    {
      name: 'Distance from stellar parallax', expr: 'd = AU/p', tex: 'd = \\dfrac{\\mathrm{AU}}{p}',
      vars: {
        d: { name: 'distance to the star', q: 'length', unit: 'pc' },
        AU: { const: 'AU' },
        p: { name: 'parallax angle', q: 'angle', unit: '″', value: 0.768 }
      },
      note: 'A star 1 parsec away shows a parallax of 1 arcsecond; 1 pc = 3.26 light-years.',
      stories: { d: 'Proxima Centauri has a parallax of {p}. How far away is it?', p: 'A star is {d} away. What parallax does it show?' }
    },
    {
      name: 'Light-travel time', expr: 't = d/c', tex: 't = \\dfrac{d}{c}',
      vars: {
        t: { name: 'time for light to cross', q: 'time', unit: 'min' },
        d: { name: 'distance', q: 'length', unit: 'AU', value: 1 },
        c: { const: 'c' }
      },
      stories: { t: 'How long does sunlight take to reach a planet {d} from the Sun?', d: 'A radio signal from a probe takes {t} to arrive. How far away is the probe?' }
    },
    {
      name: 'Age from a radioactive clock', expr: 't = Th*log2(1/f)', tex: 't = T_{1/2}\\log_2\\dfrac{1}{f}',
      vars: {
        t: { name: 'age', q: 'time', unit: 'yr' },
        Th: { name: 'half-life', q: 'time', unit: 'yr', value: 5730, tex: 'T_{1/2}' },
        f: { name: 'fraction still undecayed', q: 'ratio', unit: '%', value: 25, min: 0.001, max: 100 }
      },
      note: 'Carbon-14: 5730 years; potassium-40: 1.25 billion years; uranium-238: 4.47 billion years.',
      stories: { t: 'A piece of charcoal has {f} of the carbon-14 of living wood (half-life {Th}). How old is it?', f: 'What fraction of the carbon-14 is left in a bone {t} old (half-life {Th})?' }
    }
  ],
  examples: [
    {
      title: 'Timing an echo from Venus',
      q: 'A radar pulse sent to Venus when it is closest returns after 276 s. How far away is Venus, and how does that compare with the Sun (1 AU = $1.496\\times10^{11}$ m)?',
      steps: [
        'The pulse goes there and back, so the one-way time is 138 s.',
        '$d = ct = 2.998\\times10^8 \\times 138 = 4.14\\times10^{10}$ m.',
        'That is $4.14\\times10^{10}/1.496\\times10^{11} = 0.28$ AU. Radar ranging like this fixed the size of the astronomical unit in the 1960s.'
      ],
      a: 'About 4.1 × 10¹⁰ m, 0.28 AU.'
    },
    {
      title: 'The nearest star',
      q: 'Proxima Centauri shows a parallax of 0.768″. Find its distance in parsecs, metres and light-years, and how long its light takes to reach us.',
      steps: [
        '$d = 1/0.768 = 1.30$ pc.',
        '0.768″ is $0.768 \\times 4.848\\times10^{-6} = 3.72\\times10^{-6}$ rad, so $d = 1.496\\times10^{11}/3.72\\times10^{-6} = 4.02\\times10^{16}$ m.',
        'In light-years: $4.02\\times10^{16}/9.46\\times10^{15} = 4.25$ ly — so the light we see left it 4.25 years ago.'
      ],
      a: '1.30 pc = 4.0 × 10¹⁶ m ≈ 4.2 light-years.'
    }
  ],
  quiz: [
    { q: 'On a logarithmic ruler, which gap is longest?', choices: ['they are all equal', '1 m to 10 m', '10¹⁶ m to 10¹⁷ m', '1 fm to 10 fm'], a: 0, why: 'Each is a factor of ten, and on a log scale every factor of ten is the same length.' },
    { q: 'A sample has 1/8 of its original carbon-14. Its age is…', choices: ['3 half-lives', '8 half-lives', '1/8 of a half-life', '4 half-lives'], a: 0, why: '½ × ½ × ½ = 1/8: three halvings.' },
    { q: 'If a star were twice as far away, its parallax would be…', choices: ['half as large', 'twice as large', 'a quarter as large', 'the same'], a: 0, why: 'd = 1 AU/p: the angle is inversely proportional to the distance.' },
    { q: 'Since 1983 the metre has been defined using…', choices: ['the speed of light and the second', 'a platinum bar in Paris', 'the size of the Earth', 'the wavelength of a krypton line'], a: 0, why: 'The speed of light is fixed at exactly 299 792 458 m/s, so a metre is the distance light travels in 1/299 792 458 s.' },
    { q: 'How many seconds does sunlight take to reach the Earth (1 AU)?', answer: 499, unit: 's', why: 't = 1.496 × 10¹¹ m / 2.998 × 10⁸ m/s ≈ 499 s, a little over 8 minutes.' }
  ],
  problems: [
    { q: 'Surveyors 50 m apart sight a radio mast; their lines of sight meet at an angle of 0.8°. How far away is the mast, in km?', answer: 3.58, unit: 'km', tol: 0.02, hint: 'Convert the angle to radians.',
      steps: ['$\\theta = 0.8 \\times \\pi/180 = 0.01396$ rad.', '$d = b/\\theta = 50/0.01396 = 3580$ m = 3.58 km.'] },
    { q: 'Rock contains uranium-238 (half-life 4.47 billion years) of which 70 % remains undecayed. How old is the rock, in billions of years?', answer: 2.30, unit: 'Gyr', tol: 0.02, hint: 't = T½ log₂(1/f).',
      steps: ['$\\log_2(1/0.70) = \\ln(1.4286)/\\ln 2 = 0.5146$.', '$t = 4.47 \\times 0.5146 = 2.30$ billion years.'] }
  ],
  applications: [
    'GPS receivers find their position by timing signals from satellites: an error of one nanosecond is 30 cm of distance.',
    'Radiocarbon dating reaches back about 50 000 years; uranium–lead dating of zircon crystals reaches the oldest rocks on Earth.',
    'The ESA Gaia spacecraft measures parallaxes of about a billion stars, to millionths of an arcsecond for the brightest.'
  ],
  history: 'Friedrich Bessel measured the first stellar parallax, of 61 Cygni, in 1838. Willard Libby developed radiocarbon dating around 1949. The second was redefined by the caesium atom in 1967 and the metre by the speed of light in 1983. Radar echoes from Venus, first obtained in 1961, fixed the astronomical unit far more precisely than before.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 5 (Time and Distance) — clocks as repeating motions, short and long times, radioactive clocks, units, triangulation and the measurement of large and small distances.',
    'Vol. I, ch. 17 (Space-Time) — how moving observers disagree about distances and times.'
  ],
  sim: 'mot-scales'
},

{
  id: 'motion-and-calculus', parent: 'energy-and-motion', title: 'Motion, speed and the calculus', level: 1,
  short: 'Speed at an instant is the limit of distance over time as the interval shrinks to nothing: the derivative. Distance travelled is the area under the speed graph: the integral. Newton invented the calculus to describe exactly this.',
  keywords: ['speed', 'velocity', 'instantaneous speed', 'average speed', 'derivative', 'limit', 'slope', 'tangent', 'integral', 'area under the curve', 'acceleration', 'Zeno', 'Achilles and the tortoise', 'calculus'],
  prereq: ['time-and-distance', 'math:derivative', 'physics:speed-velocity'],
  related: ['newtons-laws-numerically', 'vectors-and-symmetry', 'math:limits', 'math:definite-integral', 'physics:acceleration', 'physics:constant-acceleration'],
  body: `
A speedometer reads 100 km/h. What does that mean, if the car only drives for twenty seconds? Not that it will cover 100 km — only that *if it kept on going as it is going now*, it would cover 100 km in an hour. Speed at an instant is a subtle idea, and Feynman took the time to make it precise, because the whole of dynamics rests on it. (He also recalled Zeno's paradox of Achilles and the tortoise, whose puzzle — an infinite number of ever-shorter stages adding up to a finite time — is the same subtlety seen from the other side.)

### Shrinking the interval
To measure a speed, take a short time interval $\\Delta t$ ([[?delta-change|Δ means "change in"]]), see how far the object goes, $\\Delta x$, and divide. For a ball dropped from rest, $x = 4.9\\,t^2$ metres. Its average speed over intervals starting at $t = 1$ s:

| $\\Delta t$ (s) | $\\Delta x$ (m) | $\\Delta x/\\Delta t$ (m/s) |
|---|---|---|
| 1 | 14.7 | 14.7 |
| 0.1 | 1.029 | 10.29 |
| 0.01 | 0.09849 | 9.849 |
| 0.001 | 0.0098049 | 9.8049 |
| → 0 | → 0 | → 9.8 |

Both $\\Delta x$ and $\\Delta t$ shrink towards zero, but their ratio settles on a definite number, 9.8 m/s. That number is the **speed at the instant** $t = 1$ s. The algebra shows why: $\\Delta x = 4.9(1 + \\Delta t)^2 - 4.9 = 9.8\\,\\Delta t + 4.9\\,\\Delta t^2$, so $\\Delta x/\\Delta t = 9.8 + 4.9\\,\\Delta t$, and the second part fades away as $\\Delta t$ does. The value approached is called a [[?limit]], and the result is the [[?derivative]]:

$$v = \\frac{dx}{dt} = \\lim_{\\Delta t \\to 0}\\frac{\\Delta x}{\\Delta t}$$

Geometrically it is the slope of the position–time graph. The simulation has a **magnifier**: zoom into any smooth curve and it looks straight; the slope of that straight piece is the speed. Watch the chord through the two points swing round onto the tangent as $\\Delta t$ shrinks.

### Going back: distance is an area
If you know the speed at every moment, you can find the distance: chop the time into small pieces, multiply each speed by its $\\Delta t$ and add up — the area of thin strips under the speed–time graph. In the limit of thin strips this is the [[?integral]]:

$$x(t) - x(0) = \\int_0^t v\\,dt$$

For the falling ball, $v = 9.8\\,t$ is a straight line, and the area under it is a triangle of base $t$ and height $9.8t$: $\\tfrac12 \\times t \\times 9.8t = 4.9\\,t^2$ — the distance we started with. Differentiating and integrating undo each other.

### Acceleration, and a short table
Acceleration is the rate of change of velocity: $a = dv/dt$, the [[?second-derivative]] of position, $d^2x/dt^2$ (Newton wrote $\\ddot x$, with dots for time derivatives — [[?dot-notation]]). For the ball it is 9.8 m/s² at every instant.

| Motion $x(t)$ | Speed $v = dx/dt$ | Acceleration $a$ |
|---|---|---|
| $x_0$ (at rest) | 0 | 0 |
| $x_0 + v_0 t$ | $v_0$ | 0 |
| $x_0 + v_0t + \\tfrac12 a t^2$ | $v_0 + at$ | $a$ |
| $A\\cos\\omega t$ (a spring) | $-A\\omega\\sin\\omega t$ | $-\\omega^2 x$ |

The last line is worth a look: for a mass on a spring the acceleration is always proportional to the displacement and opposite to it — which is exactly what Hooke's law and Newton's law demand. The calculus turns the laws of motion into equations that can be solved, by hand as here or step by step on a computer ([[newtons-laws-numerically]]). In three dimensions the same is done for each [[?components|component]] separately ([[vectors-and-symmetry]]).

> [!key] Speed at an instant is the limit of Δx/Δt as Δt shrinks: the slope of the x–t graph, the derivative dx/dt. Distance is the area under the v–t graph, the integral. Each undoes the other.
`,
  ideas: [
    'Speed at an instant is the limit of Δx/Δt as the interval Δt shrinks to zero: the derivative dx/dt.',
    'Geometrically, it is the slope of the tangent to the position–time graph; any smooth curve looks straight when magnified.',
    'Distance is the area under the speed–time graph: the integral of v dt.',
    'Acceleration is the derivative of velocity, the second derivative of position.',
    'Differentiation and integration undo each other.'
  ],
  pitfalls: [
    'Speed at an instant is zero distance over zero time, so it is meaningless — The ratio Δx/Δt approaches a definite number as both shrink; that limit is the instantaneous speed.',
    'The average speed over any interval equals the speed at its start — Only if the speed is constant; for a speeding-up ball the average over [1 s, 1.1 s] is 10.29 m/s, not 9.8.',
    'Zero speed means zero acceleration — A ball thrown up has zero speed at the top but is accelerating downwards at 9.8 m/s² all the while.'
  ],
  formulas: [
    {
      name: 'Average speed over an interval', expr: 'v = dx/dt', tex: 'v = \\dfrac{\\Delta x}{\\Delta t}',
      vars: {
        v: { name: 'average speed', q: 'speed', unit: 'm/s', signed: true },
        dx: { name: 'distance moved', q: 'length', unit: 'm', value: 1.029, signed: true, tex: '\\Delta x' },
        dt: { name: 'time interval', q: 'time', unit: 's', value: 0.1, tex: '\\Delta t' }
      },
      note: 'In the limit Δt → 0 this becomes the speed at an instant, dx/dt.',
      stories: { v: 'A ball moves {dx} in {dt}. What is its average speed over that interval?' }
    },
    {
      name: 'How far a chord\'s slope is from the true speed (steady acceleration)', expr: 'vavg = a*(t + dt/2)', tex: 'v_{\\text{avg}} = a\\left(t + \\tfrac12\\Delta t\\right)',
      vars: {
        vavg: { name: 'average speed over [t, t + Δt]', q: 'speed', unit: 'm/s', tex: 'v_{\\text{avg}}' },
        a: { name: 'acceleration (from rest)', q: 'accel', unit: 'm/s²', value: 9.8 },
        t: { name: 'start of the interval', q: 'time', unit: 's', value: 1 },
        dt: { name: 'length of the interval', q: 'time', unit: 's', value: 0.1, tex: '\\Delta t' }
      },
      note: 'The true speed at t is at; the chord overshoots by aΔt/2, which vanishes as Δt → 0. For steady acceleration the chord\'s slope equals the speed at the middle of the interval.',
      stories: { vavg: 'A body accelerates from rest at {a}. What is its average speed between {t} and a moment {dt} later?' }
    },
    {
      name: 'Position with steady acceleration', expr: 'x = x0 + v0*t + 1/2*a*t^2', tex: 'x = x_0 + v_0 t + \\tfrac12 a t^2',
      vars: {
        x: { name: 'position', q: 'length', unit: 'm', signed: true },
        x0: { name: 'starting position', q: 'length', unit: 'm', value: 2, signed: true },
        v0: { name: 'starting velocity', q: 'speed', unit: 'm/s', value: 3, signed: true },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 2, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 4 }
      },
      note: 'The integral of v = v₀ + at; its derivative gives back v.',
      stories: { x: 'A cart starts at {x0} moving at {v0} and accelerates at {a}. Where is it after {t}?', t: 'Starting at {x0} with {v0} and accelerating at {a}, when does a cart reach {x}?' }
    },
    {
      name: 'Velocity with steady acceleration', expr: 'v = v0 + a*t', tex: 'v = v_0 + a t',
      vars: {
        v: { name: 'velocity', q: 'speed', unit: 'm/s', signed: true },
        v0: { name: 'starting velocity', q: 'speed', unit: 'm/s', value: 3, signed: true },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 2, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 4 }
      },
      stories: { v: 'A cart moving at {v0} accelerates at {a} for {t}. How fast is it then?', a: 'A cart goes from {v0} to {v} in {t}. What is its acceleration?' }
    }
  ],
  derivation: {
    title: 'The derivative of t², step by step',
    steps: [
      { text: 'Write the position a moment $\\Delta t$ later by expanding the square:', tex: '(t + \\Delta t)^2 = t^2 + 2t\\,\\Delta t + \\Delta t^2' },
      { text: 'Subtract the position now to get the distance moved in the interval:', tex: '\\Delta(t^2) = 2t\\,\\Delta t + \\Delta t^2' },
      { text: 'Divide by the interval — this is the slope of the chord:', tex: '\\frac{\\Delta(t^2)}{\\Delta t} = 2t + \\Delta t' },
      { text: 'Let the interval shrink to nothing: the term $\\Delta t$ disappears and what remains is the derivative.', tex: '\\frac{d(t^2)}{dt} = 2t' },
      { text: 'So for $x = 4.9t^2$ the speed is $v = 9.8\\,t$, and differentiating again gives the acceleration.', tex: 'v = 9.8\\,t,\\qquad a = \\frac{dv}{dt} = 9.8\\ \\mathrm{m/s^2}' }
    ]
  },
  examples: [
    {
      title: 'Speed of a falling ball at 2 s',
      q: 'A ball falls with $x = 4.9t^2$. Find its average speed between 2.00 s and 2.01 s, and its speed at the instant 2 s.',
      steps: [
        '$x(2.01) = 4.9 \\times 4.0401 = 19.79649$ m and $x(2) = 19.6$ m, so $\\Delta x = 0.19649$ m.',
        'Average speed: $0.19649/0.01 = 19.649$ m/s.',
        'At the instant: $v = 9.8t = 19.6$ m/s. The chord overshoots by $4.9\\Delta t = 0.049$ m/s.'
      ],
      a: '19.65 m/s on average over the 10 ms; 19.6 m/s at the instant.'
    },
    {
      title: 'Distance from a speed graph',
      q: 'A car accelerates steadily from rest to 20 m/s in 8 s, cruises for 10 s, then brakes steadily to rest in 5 s. How far does it go?',
      steps: [
        'The distance is the area under the v–t graph, a trapezium made of three pieces.',
        'Speeding up: triangle $\\tfrac12 \\times 8 \\times 20 = 80$ m. Cruising: rectangle $10 \\times 20 = 200$ m. Braking: triangle $\\tfrac12 \\times 5 \\times 20 = 50$ m.',
        'Total $80 + 200 + 50 = 330$ m.'
      ],
      a: '330 m.'
    }
  ],
  quiz: [
    { q: 'The slope of a position–time graph at a point gives…', choices: ['the speed at that instant', 'the acceleration', 'the distance travelled', 'the average speed since the start'], a: 0, why: 'The slope of the tangent is the limit of Δx/Δt: the instantaneous speed.' },
    { q: 'The area under a speed–time graph between two times gives…', choices: ['the distance travelled', 'the acceleration', 'the average speed', 'the final speed'], a: 0, why: 'Each thin strip has area v·Δt, the distance covered in Δt; adding them up gives the whole distance — the integral.' },
    { q: 'A ball thrown straight up is at the top of its flight. At that instant…', choices: ['its speed is zero but its acceleration is 9.8 m/s² downwards', 'its speed and acceleration are both zero', 'its acceleration is zero but it still moves', 'its acceleration points upwards'], a: 0, why: 'The speed passes through zero, but the velocity is still changing — from upwards to downwards — at 9.8 m/s² every second.' },
    { q: 'If $x = 5t^3$, what is the speed $dx/dt$?', answer: '15*t^2', vars: ['t'], why: 'For $t^n$ the derivative is $n t^{n-1}$; the constant 5 comes along: 15t².' },
    { q: 'For $x = 4.9t^2$, what is the average speed (m/s) over the interval from 1 s to 1.5 s?', answer: 12.25, unit: 'm/s', why: 'Δx = 4.9(2.25 − 1) = 6.125 m in 0.5 s: 12.25 m/s — equal to the speed at the middle of the interval, 9.8 × 1.25.' }
  ],
  problems: [
    { q: 'A body moves with $x = 3t^2 + 2t$ (metres, seconds). What is its speed at $t = 4$ s?', answer: 26, unit: 'm/s', tol: 0.01, hint: 'Differentiate each term.',
      steps: ['$v = dx/dt = 6t + 2$.', 'At $t = 4$ s: $v = 26$ m/s.'] },
    { q: 'A sprinter\'s speed rises steadily from 0 to 10 m/s in the first 4 s and then stays at 10 m/s. How far has she run after 10 s?', answer: 80, unit: 'm', tol: 0.01, hint: 'Area under the speed graph.',
      steps: ['First 4 s: triangle $\\tfrac12 \\times 4 \\times 10 = 20$ m.', 'Next 6 s at 10 m/s: 60 m.', 'Total 80 m.'] }
  ],
  applications: [
    'A car\'s speedometer, a GPS speed read-out and a radar gun all estimate a derivative, from rotations, positions or a Doppler shift over a short time.',
    'Accelerometers in phones measure acceleration; integrating it twice gives position — which is why errors grow so quickly in inertial navigation.',
    'Tachographs and flight recorders store speed against time; the distance travelled is the area under that record.'
  ],
  history: 'Isaac Newton developed his "method of fluxions" in 1665–66 to describe motion, and Gottfried Leibniz independently published the calculus, with the dx/dt notation still used today, in 1684. The rigorous definition of the limit came in the 19th century from Augustin-Louis Cauchy and Karl Weierstrass. Zeno of Elea posed his paradoxes of motion in the 5th century BC.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 8 (Motion) — describing motion, speed as the limit of a ratio and the derivative, distance as an integral, acceleration.',
    'Vol. I, ch. 9 (Newton\'s Laws of Dynamics) — how the derivative turns Newton\'s law into a rule for predicting motion.'
  ],
  sim: 'mot-zoom'
},

{
  id: 'newtons-laws-numerically', parent: 'energy-and-motion', title: 'Newton\'s laws, solved step by step', level: 2,
  short: 'Newton\'s law says how the velocity changes, the velocity says how the position changes: repeat that in small steps and you can predict any motion — a spring, a planet — with nothing but arithmetic. Taking the velocity at half-steps makes it astonishingly accurate.',
  keywords: ['Newton\'s second law', 'F = ma', 'numerical integration', 'step by step', 'Euler method', 'leapfrog', 'half step', 'Verlet', 'time step', 'spring', 'planetary orbit', 'simulation', 'differential equation'],
  prereq: ['motion-and-calculus', 'physics:newtons-second-law', 'math:euler-method'],
  related: ['conservation-of-momentum', 'keplers-laws-feyn', 'harmonic-oscillator-feyn', 'theory-of-gravitation', 'math:differential-equations-intro', 'physics:mass-spring-system'],
  body: `
Newton's second law, $F = ma$, is a statement about *changes*: the force now fixes how fast the velocity is changing now. The velocity, in turn, fixes how fast the position is changing. Put the two together and the present determines the next moment, the next moment the one after — and so on for ever. Feynman made this concrete in a way few textbooks do: he solved the motion of a spring and of a planet with nothing but a table of numbers, to show that the law really does contain the whole future.

### The recipe
The law is a [[?differential-equation]]: $a = F(x)/m$, with $a = d^2x/dt^2$. To solve it [[?step-by-step]], pick a small time step $\\Delta t$ and, knowing the position $x$ and velocity $v$ now, estimate them a step later:

$$x(t + \\Delta t) \\approx x(t) + v\\,\\Delta t,\\qquad v(t + \\Delta t) \\approx v(t) + a(t)\\,\\Delta t$$

Then compute the new force from the new position, and repeat. This simplest version (Euler's method) has a flaw: it uses the velocity at the *start* of each step, although the velocity changes during the step. The errors pile up; for a spring, each swing grows a little bigger than the last.

### The half-step trick
Feynman's improvement is to keep the velocities at the *middle* of the steps, where they are the best estimate of the average velocity over the step:

$$v\\!\\left(t + \\tfrac12\\Delta t\\right) = v\\!\\left(t - \\tfrac12\\Delta t\\right) + a(t)\\,\\Delta t,\\qquad x(t + \\Delta t) = x(t) + v\\!\\left(t + \\tfrac12\\Delta t\\right)\\Delta t$$

Positions and velocities leapfrog over each other — this is the **leapfrog** or Verlet method, still used today for planets, molecules and galaxies. To start, take half a step: $v(\\tfrac12\\Delta t) = v(0) + a(0)\\,\\tfrac12\\Delta t$.

### A spring by hand
A 0.5 kg mass on a spring of stiffness $k = 20$ N/m is pulled out to $x = 0.1$ m and let go, so $a = -(k/m)\\,x = -40x$. With $\\Delta t = 0.05$ s:

| $t$ (s) | $x$ (m) | $a = -40x$ (m/s²) | $v$ at the next half-step (m/s) | exact $x$ (m) |
|---|---|---|---|---|
| 0 | 0.1000 | −4.000 | −0.100 | 0.1000 |
| 0.05 | 0.0950 | −3.800 | −0.290 | 0.0950 |
| 0.10 | 0.0805 | −3.220 | −0.451 | 0.0807 |
| 0.15 | 0.0580 | −2.318 | −0.567 | 0.0583 |
| 0.20 | 0.0296 | −1.184 | −0.626 | 0.0301 |

Twenty steps make a whole period, and the numbers track the exact answer $0.1\\cos(6.32\\,t)$ to within a fraction of a millimetre. Try the simple method with the same step in the simulation: the swings grow by a factor of about 2.6 every period. Halve the step and the leapfrog's error drops about fourfold — its error goes as $\\Delta t^2$.

### A planet by the same recipe
For a planet the force points at the Sun and falls off as $1/r^2$. In [[?components]]:

$$a_x = -\\frac{GM\\,x}{r^3},\\qquad a_y = -\\frac{GM\\,y}{r^3},\\qquad r = \\sqrt{x^2 + y^2}$$

In astronomical units and years, $GM_\\odot = 4\\pi^2$ AU³/yr² (so that a circular orbit at 1 AU has speed $2\\pi$ AU a year). Two columns instead of one, the same arithmetic — and out comes an ellipse, with the Sun at a focus, the planet speeding up near the Sun: [[keplers-laws-feyn|Kepler's laws]], computed rather than assumed.

> [!key] F = ma turns the present into the next moment. Step forward in small intervals — velocities at the half-steps — and the arithmetic reproduces springs and planets. The smaller the step, the better; the leapfrog error shrinks as Δt².

**In the simulation:** step one row at a time and compare the table with the drawing; switch methods and watch the simple one spiral outwards; make the steps coarse to see the orbit fail, fine to see it close on itself.
`,
  ideas: [
    'Newton\'s law gives the acceleration from the position; the acceleration updates the velocity, the velocity updates the position.',
    'Repeating small steps predicts the whole motion: a differential equation solved by arithmetic.',
    'Using velocities at the middle of each step (leapfrog) is far more accurate than using them at the start (Euler).',
    'The error of the leapfrog method falls as the square of the step: halve Δt, quarter the error.',
    'A planet needs only two components of the same recipe; the ellipse comes out of the arithmetic.'
  ],
  pitfalls: [
    'A computer simulation is exact because computers do not make mistakes — Each step approximates the smooth change by a straight one; the error depends on the step size and on the method.',
    'Any small step is small enough — Small means small compared with the time in which things change: a hundredth of a period for a spring, and much finer near the Sun for an eccentric orbit.',
    'Using the velocity at the start of each step is the natural choice, so it must be the best — It systematically lags behind; for a spring it pumps energy in every swing. The midpoint velocity is the better estimate.'
  ],
  formulas: [
    {
      name: 'The spring\'s acceleration (Hooke + Newton)', expr: 'a = -k*x/m', tex: 'a = -\\dfrac{k}{m}\\,x',
      vars: {
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', signed: true },
        k: { name: 'spring stiffness', q: 'stiffness', unit: 'N/m', value: 20 },
        x: { name: 'displacement from rest', q: 'length', unit: 'm', value: 0.1, signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 }
      },
      stories: { a: 'A {m} mass on a spring of {k} is pulled out {x}. What is its acceleration when released?', k: 'A {m} mass displaced {x} accelerates at {a}. How stiff is the spring?' }
    },
    {
      name: 'One step forward (velocity at the half-step)', expr: 'x1 = x0 + v*dt', tex: 'x_{n+1} = x_n + v_{n+1/2}\\,\\Delta t',
      vars: {
        x1: { name: 'position after the step', q: 'length', unit: 'm', signed: true, tex: 'x_{n+1}' },
        x0: { name: 'position now', q: 'length', unit: 'm', value: 0.095, signed: true, tex: 'x_n' },
        v: { name: 'velocity at the middle of the step', q: 'speed', unit: 'm/s', value: -0.29, signed: true, tex: 'v_{n+1/2}' },
        dt: { name: 'time step', q: 'time', unit: 's', value: 0.05, tex: '\\Delta t' }
      },
      stories: { x1: 'The mass is at {x0} and its half-step velocity is {v}. Where is it one step of {dt} later?' }
    },
    {
      name: 'Period of the spring (to check the steps against)', expr: 'T = 2*pi*sqrt(m/k)', tex: 'T = 2\\pi\\sqrt{\\dfrac{m}{k}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        k: { name: 'spring stiffness', q: 'stiffness', unit: 'N/m', value: 20 }
      },
      stories: { T: 'How long is one swing of {m} on a spring of {k}?', k: 'A {m} mass bounces with a period of {T}. How stiff is its spring?' }
    },
    {
      name: 'Pull of the Sun on a planet', expr: 'a = G*M/r^2', tex: 'a = \\dfrac{G M}{r^2}',
      vars: {
        a: { name: 'acceleration towards the Sun', q: 'accel', unit: 'm/s²' },
        G: { const: 'G' },
        M: { name: 'mass of the Sun', q: 'mass', unit: 'M☉', value: 1 },
        r: { name: 'distance from the Sun', q: 'length', unit: 'AU', value: 1 }
      },
      note: 'At 1 AU this is 5.9 mm/s² — tiny, yet it bends the Earth\'s path into a circle 940 million km round.',
      stories: { a: 'How strongly does the Sun ({M}) accelerate a planet {r} away?', r: 'At what distance from the Sun ({M}) is the pull {a}?' }
    }
  ],
  examples: [
    {
      title: 'The first steps of the spring',
      q: 'A 0.5 kg mass on a 20 N/m spring starts at rest at $x = 0.1$ m. With $\\Delta t = 0.05$ s and half-step velocities, find $x$ after one and two steps.',
      steps: [
        '$a(0) = -40 \\times 0.1 = -4$ m/s². Half a step to start: $v(0.025) = 0 + (-4)(0.025) = -0.1$ m/s.',
        '$x(0.05) = 0.1 + (-0.1)(0.05) = 0.095$ m. Then $a = -3.8$ m/s² and $v(0.075) = -0.1 + (-3.8)(0.05) = -0.29$ m/s.',
        '$x(0.10) = 0.095 + (-0.29)(0.05) = 0.0805$ m. The exact value is $0.1\\cos(6.325 \\times 0.1) = 0.0807$ m.'
      ],
      a: '0.0950 m and 0.0805 m (exact: 0.0950 and 0.0807).'
    },
    {
      title: 'Why the simple method gains energy',
      q: 'For a spring with $\\omega = \\sqrt{k/m}$, the simple (Euler) step multiplies the amplitude by $\\sqrt{1 + \\omega^2\\Delta t^2}$. With $\\omega = 6.32$ rad/s and $\\Delta t = 0.05$ s, by how much does the amplitude grow in one period?',
      steps: [
        '$\\omega\\Delta t = 0.316$, so each step multiplies by $\\sqrt{1 + 0.1} = 1.049$.',
        'One period is $2\\pi/\\omega = 0.99$ s, about 20 steps: $1.049^{20} = 2.6$.',
        'The leapfrog with the same step keeps the amplitude within a few per cent for ever.'
      ],
      a: 'By a factor of about 2.6 each period.'
    }
  ],
  quiz: [
    { q: 'In the half-step (leapfrog) method, the velocity used to move the position from $t$ to $t + \\Delta t$ is the velocity at…', choices: ['t + Δt/2', 't', 't + Δt', 't − Δt'], a: 0, why: 'The midpoint velocity is the best single estimate of the average velocity over the step.' },
    { q: 'You halve the time step of a leapfrog calculation. The error at a fixed later time becomes roughly…', choices: ['a quarter as big', 'half as big', 'the same', 'twice as big'], a: 0, why: 'The leapfrog is a second-order method: its error goes as Δt².' },
    { q: 'A spring is simulated with the simple (Euler) method and a large step. What happens over many periods?', choices: ['the swings grow larger and larger', 'the swings die away', 'nothing: it is exact', 'the period becomes zero'], a: 0, why: 'Each Euler step multiplies the amplitude by √(1 + ω²Δt²) > 1, so energy is pumped in steadily.' },
    { q: 'Feynman\'s step-by-step solution needs to know, at the start, …', choices: ['the position and the velocity', 'only the position', 'only the force', 'the whole path in advance'], a: 0, why: 'Newton\'s law is second order: position and velocity now fix the future. The force is computed from the position at each step.' }
  ],
  problems: [
    { q: 'A mass on a spring has $a = -40x$ (SI). At $t = 0.2$ s it is at $x = 0.0296$ m, and its velocity at $t = 0.175$ s is $-0.567$ m/s. With $\\Delta t = 0.05$ s, find the velocity at $t = 0.225$ s.', answer: -0.626, unit: 'm/s', tol: 0.01, hint: 'v(t + Δt/2) = v(t − Δt/2) + a(t)Δt.',
      steps: ['$a(0.2) = -40 \\times 0.0296 = -1.184$ m/s².', '$v(0.225) = -0.567 + (-1.184)(0.05) = -0.626$ m/s.'] },
    { q: 'A planet is at $x = 1$ AU, $y = 0$, moving at $v_y = 5$ AU/yr. With $GM = 4\\pi^2$ AU³/yr² and a step of 0.02 yr, what is $v_x$ (AU/yr) at the first half-step, $t = 0.01$ yr?', answer: -0.395, unit: 'AU/yr', tol: 0.02, hint: 'a_x = −GM x/r³ at the start.',
      steps: ['$a_x = -4\\pi^2 \\times 1/1^3 = -39.48$ AU/yr².', '$v_x(0.01) = 0 + (-39.48)(0.01) = -0.395$ AU/yr.'] }
  ],
  applications: [
    'Spacecraft trajectories, weather forecasts and crash simulations all advance Newton\'s laws (or their cousins for fluids) one small step at a time.',
    'Molecular dynamics uses the leapfrog (Verlet) method to follow millions of atoms, to fold proteins and design materials.',
    'Game physics engines step bodies forward every frame; the choice of method decides whether a simulated pendulum keeps swinging or blows up.'
  ],
  history: 'Leonhard Euler described the simplest step method in the 1760s. The half-step scheme was used by Carl Størmer (1907) to follow charged particles in the Earth\'s magnetic field, and popularised by Loup Verlet (1967) for molecular dynamics. During the war at Los Alamos Feynman organised large calculations done with IBM punched-card machines, a story he tells in *Surely You\'re Joking, Mr. Feynman!*.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 9 (Newton\'s Laws of Dynamics) — momentum and force, the meaning of the dynamical equations, and the numerical solution for a spring and for a planet, with velocities taken at the half-steps.',
    '*Surely You\'re Joking, Mr. Feynman!* (1985), "Los Alamos from Below" — organising hand and punched-card computation at Los Alamos.'
  ],
  sim: 'mot-stepper'
},

{
  id: 'conservation-of-momentum', parent: 'energy-and-motion', title: 'Conservation of momentum', level: 1,
  short: 'Because every push comes with an equal and opposite push, the total momentum — mass times velocity, added up for every body — never changes. Feynman showed how symmetry and a moving observer predict collisions without knowing the forces at all.',
  keywords: ['momentum', 'conservation of momentum', 'collision', 'elastic', 'inelastic', 'sticky collision', 'recoil', 'Newton\'s third law', 'centre of mass', 'Galilean relativity', 'moving frame', 'rocket'],
  prereq: ['newtons-laws-numerically', 'conservation-of-energy', 'physics:momentum'],
  related: ['vectors-and-symmetry', 'principle-of-relativity', 'relativistic-mass-energy', 'conservation-from-symmetry', 'great-conservation-principles', 'physics:elastic-collisions', 'physics:inelastic-collisions', 'physics:center-of-mass'],
  body: `
Newton's third law says that forces come in pairs: when one body pushes another, the other pushes back just as hard in the opposite direction. Feynman drew from it one of the great conservation laws, and then showed that it can be reached another way, from symmetry alone.

### From the third law
Call the product of mass and velocity the **momentum**, $p = mv$. Newton's second law in its original form says that force is the rate of change of momentum, $F = dp/dt$. If body 1 pushes body 2 with force $F$ during a short time $\\Delta t$, body 2's momentum changes by $F\\Delta t$; body 2 pushes back with $-F$, so body 1's momentum changes by $-F\\Delta t$. The changes cancel. However complicated the forces between the bodies — a spring, a collision, a chemical explosion — the **total** momentum stays the same, provided nothing outside pushes. Momentum is a [[?vector]], so this holds for each [[?components|component]] separately.

### From symmetry and a moving observer
Feynman's second argument needs no knowledge of forces. Take two identical carts on a straight track with a compressed spring between them, and release it. Nothing distinguishes left from right, so they must fly apart with equal speeds. Now a collision: identical carts, one at rest, the other arriving at speed $v$; they hit and stick. How fast do they move afterwards? Watch the same event from a platform gliding along at $v/2$. From there the carts approach each other at equal speeds, $+v/2$ and $-v/2$ — a perfectly symmetric situation — so the stuck pair must end at rest *on the platform*. Back on the ground, it moves at $v/2$. The laws of physics are the same for observers in uniform motion (Galileo's principle of relativity, [[principle-of-relativity]]); that plus symmetry fixes the answer. Gluing unit carts together to make heavier ones extends the argument to any masses, and the rule that comes out is exactly

$$m_1v_1 + m_2v_2 = \\text{constant}.$$

### Collisions: elastic, sticky, and in between
Momentum is always conserved in a collision; kinetic energy is not. In a perfectly **elastic** collision (hard steel balls, air-track carts with magnets) the kinetic energy is kept too. In a **sticky** one the bodies move off together and some energy becomes heat and sound. The simulation shows both from two frames. In the **centre-of-mass frame**, the one in which the total momentum is zero, the picture is simplest: an elastic collision just reverses both velocities; a sticky one brings both to rest. The kinetic energy lost in a sticky collision is precisely what the bodies had in that frame:

$$\\Delta K = \\tfrac12\\,\\frac{m_1m_2}{m_1 + m_2}\\,(v_1 - v_2)^2$$

| Equal masses, one at rest, the other at $v$ | Afterwards (ground frame) | Kinetic energy kept |
|---|---|---|
| elastic | the first stops, the second leaves at $v$ | 100 % |
| sticky | both move at $v/2$ | 50 % |

### Real numbers
A 10 g bullet leaves a 4 kg rifle at 900 m/s: the rifle recoils at 2.25 m/s, and the bullet carries 4050 J against the rifle's 10 J — equal momenta, very unequal energies. A rocket works the same way: it throws exhaust backwards and gains the opposite momentum, with nothing to push against.

### Deeper roots
The law survives relativity if momentum is written $mv/\\sqrt{1 - v^2/c^2}$ ([[relativistic-mass-energy]]). Light carries momentum, and so do electromagnetic fields ([[field-energy-momentum]]). And the deepest reason for the law is a symmetry: the laws of physics are the same here as there — [[conservation-from-symmetry]].

> [!key] Total momentum, the sum of mv over all bodies, never changes unless an outside force acts. Symmetry and a moving observer predict collisions without any force law; energy is conserved too, but may hide as heat.
`,
  ideas: [
    'Momentum p = mv; force is its rate of change, F = dp/dt.',
    'Action and reaction are equal and opposite, so internal forces cannot change the total momentum.',
    'Symmetry plus Galilean relativity (a moving observer) predicts collisions without knowing the forces.',
    'Momentum is conserved in every collision; kinetic energy only in elastic ones.',
    'In the centre-of-mass frame an elastic collision reverses the velocities and a sticky one stops both bodies.'
  ],
  pitfalls: [
    'In a sticky collision momentum is lost along with the energy — Momentum is always conserved; only kinetic energy turns into heat and sound.',
    'A heavy and a light body in a collision feel different forces — The forces are equal and opposite at every instant; the light body simply changes its velocity more.',
    'Momentum and kinetic energy are two names for the same thing — Momentum is a vector, mv; kinetic energy a scalar, ½mv². A bullet and its rifle share equal momenta but very different energies.'
  ],
  formulas: [
    {
      name: 'Momentum', expr: 'p = m*v', tex: 'p = m v',
      vars: {
        p: { name: 'momentum', q: 'momentum', unit: 'kg·m/s', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'g', value: 10 },
        v: { name: 'velocity', q: 'speed', unit: 'm/s', value: 900, signed: true }
      },
      stories: { p: 'A {m} bullet leaves the barrel at {v}. What momentum does it carry?', v: 'A body of {m} carries {p} of momentum. How fast is it moving?' }
    },
    {
      name: 'A sticky collision: moving off together', expr: 'V = (m1*v1 + m2*v2)/(m1 + m2)', tex: 'V = \\dfrac{m_1v_1 + m_2v_2}{m_1 + m_2}',
      vars: {
        V: { name: 'common velocity afterwards', q: 'speed', unit: 'm/s', signed: true },
        m1: { name: 'mass of body 1', q: 'mass', unit: 'kg', value: 1200 },
        v1: { name: 'velocity of body 1 before', q: 'speed', unit: 'm/s', value: 20, signed: true },
        m2: { name: 'mass of body 2', q: 'mass', unit: 'kg', value: 1800 },
        v2: { name: 'velocity of body 2 before', q: 'speed', unit: 'm/s', value: 0, signed: true }
      },
      note: 'This is also the velocity of the centre of mass, which no internal force can change.',
      stories: { V: 'A car of {m1} at {v1} runs into a car of {m2} moving at {v2}; they lock together. How fast do they move?', v1: 'After a car of {m1} hits a car of {m2} moving at {v2}, the wreck slides at {V}. How fast was the first car going?' }
    },
    {
      name: 'An elastic collision in a line: velocity of body 1 afterwards', expr: 'u1 = ((m1 - m2)*v1 + 2*m2*v2)/(m1 + m2)', tex: 'u_1 = \\dfrac{(m_1 - m_2)v_1 + 2m_2v_2}{m_1 + m_2}',
      vars: {
        u1: { name: 'velocity of body 1 after', q: 'speed', unit: 'm/s', signed: true, tex: 'u_1' },
        m1: { name: 'mass of body 1', q: 'mass', unit: 'kg', value: 2 },
        v1: { name: 'velocity of body 1 before', q: 'speed', unit: 'm/s', value: 3, signed: true },
        m2: { name: 'mass of body 2', q: 'mass', unit: 'kg', value: 1 },
        v2: { name: 'velocity of body 2 before', q: 'speed', unit: 'm/s', value: -1, signed: true }
      },
      note: 'From conserving both momentum and kinetic energy. Swap the labels 1 and 2 for body 2. Equal masses simply exchange velocities.',
      stories: { u1: 'A {m1} cart at {v1} meets a {m2} cart at {v2} head-on in an elastic collision. What is the first cart\'s velocity afterwards?' }
    },
    {
      name: 'Kinetic energy lost when bodies stick', expr: 'dK = 1/2*m1*m2/(m1 + m2)*(v1 - v2)^2', tex: '\\Delta K = \\tfrac12\\dfrac{m_1m_2}{m_1 + m_2}\\,(v_1 - v_2)^2',
      vars: {
        dK: { name: 'kinetic energy turned into heat, sound, deformation', q: 'energy', unit: 'kJ', tex: '\\Delta K' },
        m1: { name: 'mass of body 1', q: 'mass', unit: 'kg', value: 1200 },
        m2: { name: 'mass of body 2', q: 'mass', unit: 'kg', value: 1800 },
        v1: { name: 'velocity of body 1', q: 'speed', unit: 'm/s', value: 20, signed: true },
        v2: { name: 'velocity of body 2', q: 'speed', unit: 'm/s', value: 0, signed: true }
      },
      note: 'Depends only on the relative speed: it is the kinetic energy in the centre-of-mass frame.',
      stories: { dK: 'A car of {m1} at {v1} hits a car of {m2} at {v2} and they lock together. How much energy goes into crumpling?' }
    }
  ],
  examples: [
    {
      title: 'Recoil of a rifle',
      q: 'A 4.0 kg rifle fires a 10 g bullet at 900 m/s. How fast does the rifle recoil, and how do the kinetic energies compare?',
      steps: [
        'Before firing the total momentum is zero, so afterwards $m_bv_b + m_rv_r = 0$.',
        '$v_r = -0.010 \\times 900/4.0 = -2.25$ m/s.',
        'Kinetic energies: bullet $\\tfrac12 \\times 0.010 \\times 900^2 = 4050$ J; rifle $\\tfrac12 \\times 4.0 \\times 2.25^2 = 10.1$ J.'
      ],
      a: '2.25 m/s backwards; the bullet takes 400 times more energy.'
    },
    {
      title: 'A rear-end collision',
      q: 'A 1200 kg car at 20 m/s runs into a stationary 1800 kg car and the two lock together. How fast do they move off, and how much kinetic energy is lost?',
      steps: [
        '$V = 1200 \\times 20/3000 = 8$ m/s.',
        'Before: $\\tfrac12 \\times 1200 \\times 20^2 = 240$ kJ. After: $\\tfrac12 \\times 3000 \\times 8^2 = 96$ kJ.',
        'Lost: 144 kJ — check with $\\tfrac12 \\times (1200 \\times 1800/3000) \\times 20^2 = \\tfrac12 \\times 720 \\times 400 = 144$ kJ.'
      ],
      a: '8 m/s; 144 kJ (60 %) goes into crumpling metal, heat and sound.'
    },
    {
      title: 'The moving-platform argument with numbers',
      q: 'Two 1 kg carts: one at rest, one arriving at 4 m/s; they stick. Predict the result by looking from a platform moving at 2 m/s.',
      steps: [
        'On the platform the carts move at $+2$ and $-2$ m/s: a mirror-symmetric collision, so the stuck pair ends at rest on the platform.',
        'On the ground: $0 + 2 = 2$ m/s. Check: $1 \\times 4 + 1 \\times 0 = 2 \\times 2$.'
      ],
      a: '2 m/s — half the incoming speed, found without any force law.'
    }
  ],
  quiz: [
    { q: 'A moving cart hits an identical cart at rest and they stick together. Afterwards they move at…', choices: ['half the original speed', 'the original speed', 'a quarter of the original speed', 'zero speed'], a: 0, why: 'Momentum mv is shared by 2m: V = v/2. Half the kinetic energy is lost.' },
    { q: 'In a head-on collision between a truck and a small car, the force on the car is…', choices: ['equal in size to the force on the truck', 'much larger than the force on the truck', 'much smaller than the force on the truck', 'zero, if the truck is much heavier'], a: 0, why: 'Newton\'s third law: equal and opposite forces. The car suffers more because the same force changes its velocity much more.' },
    { q: 'Kinetic energy is conserved in every collision.', a: false, why: 'Only in elastic collisions. Momentum is conserved in all of them.' },
    { q: 'In the centre-of-mass frame, two bodies collide elastically. Afterwards…', choices: ['each moves back with its original speed reversed', 'both stop', 'they exchange speeds', 'the heavier one stops'], a: 0, why: 'Total momentum is zero before and after, and kinetic energy is unchanged: the only way is to reverse both velocities.' },
    { q: 'An astronaut of 80 kg at rest in space throws a 2 kg tool at 10 m/s. How fast (m/s) does she drift the other way?', answer: 0.25, unit: 'm/s', why: '80 v = 2 × 10, so v = 0.25 m/s.' }
  ],
  problems: [
    { q: 'A 3 kg ball moving at 4 m/s hits a 1 kg ball at rest, head-on and elastically. What is the velocity of the 1 kg ball afterwards?', answer: 6, unit: 'm/s', tol: 0.01, hint: 'For body 2: u₂ = [(m₂ − m₁)v₂ + 2m₁v₁]/(m₁ + m₂).',
      steps: ['$u_2 = (0 + 2 \\times 3 \\times 4)/(3 + 1) = 6$ m/s.', 'And $u_1 = (3 - 1) \\times 4/4 = 2$ m/s. Check momentum: $3 \\times 2 + 1 \\times 6 = 12 = 3 \\times 4$.'] },
    { q: 'A 60 kg skater at rest catches a 5 kg medicine ball thrown at 6 m/s. How fast does she glide afterwards?', answer: 0.462, unit: 'm/s', tol: 0.02, hint: 'A sticky collision.',
      steps: ['$V = 5 \\times 6/(60 + 5) = 30/65 = 0.462$ m/s.'] }
  ],
  applications: [
    'Rockets and jet engines move by throwing mass backwards; in space there is nothing else to push against.',
    'Crash investigators work backwards from the wreckage — masses, final directions and skid marks — to the speeds before impact using momentum conservation.',
    'Particle physicists found the neutrino\'s momentum, like its energy, missing from beta decays, and billiard and snooker players use equal-mass elastic collisions every shot.'
  ],
  history: 'René Descartes (1644) proposed that the "quantity of motion" of the world is conserved, but used speed without direction. Christiaan Huygens, John Wallis and Christopher Wren worked out the laws of collisions for the Royal Society in 1668–69, and Newton put momentum at the centre of his laws of motion in the *Principia* (1687).',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 10 (Conservation of Momentum) — Newton\'s third law, conservation of momentum, the symmetry argument for carts pushed apart and stuck together, collisions seen from a moving frame, momentum and energy, relativistic momentum.',
    '*The Character of Physical Law*, lecture 4 (Symmetry in Physical Law) — the laws unchanged for observers moving uniformly.'
  ],
  sim: 'mot-collide'
},

{
  id: 'vectors-and-symmetry', parent: 'energy-and-motion', title: 'Vectors: laws that do not care which way you face', level: 2,
  short: 'Move your laboratory or turn it round, and the laws of physics come out the same. That symmetry forces the laws to be written with vectors — arrows whose components change when you turn your axes, in exactly such a way that the equations keep their form.',
  keywords: ['vector', 'symmetry', 'rotation', 'translation', 'components', 'coordinates', 'rotated axes', 'dot product', 'scalar product', 'scalar', 'invariance', 'magnitude'],
  prereq: ['motion-and-calculus', 'newtons-laws-numerically', 'math:vectors', 'math:vector-components'],
  related: ['symmetry-in-physical-law', 'conservation-from-symmetry', 'work-and-potential-energy', 'four-vectors-feyn', 'math:dot-product', 'math:cross-product'],
  body: `
Feynman opened his lecture on vectors with symmetry. Build a machine here and an identical one over there, or build the second one turned through some angle, and — if nothing else is different — they behave identically. The laws of physics do not care where you stand or which way you face. That simple fact dictates the form the laws must take.

### Two observers, two sets of axes
Suppose one observer measures positions along axes $x$ and $y$, and a second uses axes $x'$ and $y'$ turned through an angle $\\theta$. The same point has different coordinates for the two of them:

$$x' = x\\cos\\theta + y\\sin\\theta,\\qquad y' = -x\\sin\\theta + y\\cos\\theta$$

([[?sine-cosine|sines and cosines]] of the angle mix the old coordinates). Now Newton's law in the first set of axes: $F_x = ma_x$ and $F_y = ma_y$. Velocity and acceleration are rates of change of position, so their components mix in exactly the same way when the axes turn; so do the components of force, because a force is measured by the acceleration it gives. Combine the two equations with $\\cos\\theta$ and $\\sin\\theta$ and you get $F_{x'} = ma_{x'}$ and $F_{y'} = ma_{y'}$: **the same law, in the same form**, for the second observer. That is what it means for a law to be symmetric under rotation.

### What a vector is
A **[[?vector]]** is a quantity with three [[?components]] that change, when the axes turn, in the same way as the coordinates of a step from one point to another. Displacement, velocity, acceleration, force and momentum are vectors: arrows, with a length (the [[?magnitude]]) and a direction. A **[[?scalar]]** — mass, time, energy, temperature — is a single number that every observer agrees on. Writing the law as one vector equation,

$$\\mathbf{F} = m\\mathbf{a},$$

says in five symbols that it holds in every set of axes at once. Vectors add head to tail, which is the same as adding their components one by one.

| Vector (arrow) | Scalar (one number) |
|---|---|
| displacement $\\Delta\\mathbf{r}$, velocity $\\mathbf{v}$ | time $t$, mass $m$ |
| acceleration $\\mathbf{a}$, force $\\mathbf{F}$ | energy $E$, work $W$ |
| momentum $\\mathbf{p}$ | temperature $T$, charge $q$ |

### What every observer agrees on: the dot product
The components differ between observers, but some combinations do not. The length $\\sqrt{x^2 + y^2 + z^2}$ is the same in all axes. More generally the **[[?dot-product]]**

$$\\mathbf{a}\\cdot\\mathbf{b} = a_xb_x + a_yb_y + a_zb_z = |\\mathbf{a}||\\mathbf{b}|\\cos\\alpha$$

is a scalar: it depends only on the lengths and the angle $\\alpha$ between the arrows. That is why the work done by a force, $W = \\mathbf{F}\\cdot\\Delta\\mathbf{r}$, and the kinetic energy $\\tfrac12 m\\,\\mathbf{v}\\cdot\\mathbf{v}$, are scalars that everyone agrees on ([[work-and-potential-energy]]).

### A law written badly
"Things fall with $a_y = -9.8$ m/s² and $a_x = 0$" works in axes with $y$ pointing up — and in the simulation you can watch it fail in tilted axes. Is nature then not symmetric? It is: the special direction comes from the Earth underneath. Include the Earth, write gravity as a vector pointing to its centre, and the law is the same for every orientation. Feynman made this point often: when a law seems to pick out a direction, look for the object that supplies it.

> [!key] Laws of physics are the same in every set of axes. Written with vectors, $\\mathbf{F} = m\\mathbf{a}$, they hold for all orientations at once; the components change, the relation between them does not. Lengths and dot products are the scalars every observer agrees on.

**In the simulation:** turn the second observer's axes and watch the components change while $F_{x'} = ma_{x'}$ still holds; the length of the velocity and the power $\\mathbf{F}\\cdot\\mathbf{v}$ are the same in both columns.
`,
  ideas: [
    'The laws of physics are unchanged by moving (translating) or turning (rotating) the apparatus.',
    'A vector has components that change with the axes exactly as the coordinates of a displacement do.',
    'A law written as a vector equation, F = ma, holds in every set of axes at once.',
    'Scalars — lengths, dot products, energies — are the same for every orientation of the axes.',
    'When a law seems to prefer a direction, some object (like the Earth) is supplying it.'
  ],
  pitfalls: [
    'Components are the vector — Components are its shadows on a particular set of axes; turn the axes and they change, while the arrow itself does not.',
    'Gravity breaks rotation symmetry because things always fall down — "Down" is towards the Earth; with the Earth included, gravity is a vector law and every orientation is equivalent.',
    'Any three numbers make a vector — Only if they change under rotation like a displacement. (Mass, charge and temperature listed together are not a vector.)'
  ],
  formulas: [
    {
      name: 'A component in turned axes', expr: 'xp = x*cos(theta) + y*sin(theta)', tex: "x' = x\\cos\\theta + y\\sin\\theta",
      vars: {
        xp: { name: 'component along the turned x′ axis', q: 'length', unit: 'm', signed: true, tex: "x'" },
        x: { name: 'x component in the original axes', q: 'length', unit: 'm', value: 3, signed: true },
        y: { name: 'y component in the original axes', q: 'length', unit: 'm', value: 4, signed: true },
        theta: { name: 'angle the axes are turned through', q: 'angle', unit: '°', value: 30, min: -90, max: 90, tex: '\\theta' }
      },
      note: 'And y′ = −x sin θ + y cos θ. The same rule turns the components of velocity, acceleration and force.',
      stories: { xp: 'A step of {x} along x and {y} along y is seen in axes turned by {theta}. What is its component along the new x′ axis?' }
    },
    {
      name: 'Length of a vector (the same in every set of axes)', expr: 'r = sqrt(x^2 + y^2)', tex: 'r = \\sqrt{x^2 + y^2}',
      vars: {
        r: { name: 'length (magnitude)', q: 'length', unit: 'm' },
        x: { name: 'x component', q: 'length', unit: 'm', value: 3, signed: true },
        y: { name: 'y component', q: 'length', unit: 'm', value: 4, signed: true }
      },
      stories: { r: 'A displacement has components {x} and {y}. How long is it?', y: 'A displacement {r} long has an x component of {x}. What is its y component?' }
    },
    {
      name: 'Work as a dot product', expr: 'W = F*s*cos(alpha)', tex: 'W = F s\\cos\\alpha',
      vars: {
        W: { name: 'work done', q: 'energy', unit: 'J', signed: true },
        F: { name: 'size of the force', q: 'force', unit: 'N', value: 50 },
        s: { name: 'distance moved', q: 'length', unit: 'm', value: 10 },
        alpha: { name: 'angle between force and motion', q: 'angle', unit: '°', value: 30, min: 0, max: 180, tex: '\\alpha' }
      },
      note: 'W = F·s = Fₓsₓ + F_ys_y: the same number in every set of axes.',
      stories: { W: 'A sledge is pulled {s} by a rope with tension {F} at {alpha} to the ground. How much work does the rope do?', alpha: 'A force of {F} moves a load {s} and does {W} of work. At what angle to the motion does it act?' }
    }
  ],
  examples: [
    {
      title: 'One step, two descriptions',
      q: 'A displacement is 3 m along $x$ and 4 m along $y$. Find its components in axes turned by 30°, and check its length in both.',
      steps: [
        '$x\' = 3\\cos 30° + 4\\sin 30° = 2.598 + 2.000 = 4.598$ m.',
        '$y\' = -3\\sin 30° + 4\\cos 30° = -1.500 + 3.464 = 1.964$ m.',
        'Length: $\\sqrt{3^2 + 4^2} = 5$ m and $\\sqrt{4.598^2 + 1.964^2} = \\sqrt{25.00} = 5$ m. Same arrow, different shadows.'
      ],
      a: '(4.60 m, 1.96 m); length 5 m in both.'
    },
    {
      title: 'Choosing convenient axes',
      q: 'A 2 kg box slides without friction down a 25° slope. Use axes along and across the slope to find its acceleration.',
      steps: [
        'The law holds in any axes, so pick $x\'$ down the slope and $y\'$ perpendicular to it.',
        'Gravity\'s components: $mg\\sin 25° = 8.29$ N along the slope, $mg\\cos 25° = 17.8$ N into it (balanced by the surface).',
        '$a_{x\'} = 8.29/2 = 4.14$ m/s² — the same answer as in horizontal–vertical axes, with far less work.'
      ],
      a: '4.14 m/s² down the slope.'
    }
  ],
  quiz: [
    { q: 'Two observers use axes turned relative to each other. They agree on…', choices: ['the length of a velocity vector', 'its x component', 'its y component', 'the angle it makes with their x axis'], a: 0, why: 'Components and angles to the axes change with the axes; the length (a scalar) does not.' },
    { q: 'Which of these is a scalar?', choices: ['kinetic energy', 'momentum', 'acceleration', 'displacement'], a: 0, why: 'Kinetic energy ½m v·v is built from a dot product: one number for all observers.' },
    { q: 'A force of 10 N acts at right angles to a body\'s motion. The work it does is…', choices: ['zero', '10 J per metre', '−10 J per metre', 'impossible to tell without axes'], a: 0, why: 'W = F s cos 90° = 0: the dot product of perpendicular vectors vanishes, in every set of axes.' },
    { q: 'Because objects fall "down", gravity shows that the laws of physics are not symmetric under rotation.', a: false, why: 'The direction is supplied by the Earth. Turn the Earth and the apparatus together and nothing changes.' },
    { q: 'A velocity has components 6 m/s and 8 m/s. In axes turned by 40°, what is its magnitude (m/s)?', answer: 10, unit: 'm/s', why: 'The length is the same in every set of axes: √(36 + 64) = 10 m/s.' }
  ],
  problems: [
    { q: 'A force has components $F_x = 30$ N and $F_y = 40$ N. What is its component along axes turned by 60° (the $x\'$ axis)?', answer: 49.6, unit: 'N', tol: 0.02, hint: "Fₓ′ = Fₓ cos θ + F_y sin θ.",
      steps: ['$F_{x\'} = 30\\cos 60° + 40\\sin 60° = 15 + 34.64 = 49.6$ N.'] },
    { q: 'A trolley moves 12 m while a 25 N force pulls it at 40° to the direction of motion. How much work does the force do?', answer: 229.8, unit: 'J', tol: 0.02, hint: 'W = F s cos α.',
      steps: ['$W = 25 \\times 12 \\times \\cos 40° = 300 \\times 0.766 = 229.8$ J.'] }
  ],
  applications: [
    'Engineers choose axes to suit the problem — along a beam, a slope or a flight path — knowing the physics is the same in any of them.',
    'Computer graphics and robotics turn vectors between coordinate frames with exactly these rotation formulas, millions of times a second.',
    'Navigation adds velocity vectors: an aircraft\'s ground speed is its air velocity plus the wind, head to tail.'
  ],
  history: 'Vector algebra in its modern form was created independently by Josiah Willard Gibbs and Oliver Heaviside in the 1880s, simplifying William Rowan Hamilton\'s quaternions (1843). The link between symmetries and conservation laws was made general by Emmy Noether in 1918.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 11 (Vectors) — symmetry in physics, translations and rotations of axes, vectors and vector algebra, Newton\'s laws in vector notation, the scalar product.',
    'Vol. I, ch. 52 (Symmetry in Physical Laws) — the catalogue of symmetries and their consequences.',
    '*The Character of Physical Law*, lecture 4 (Symmetry in Physical Law).'
  ],
  sim: 'mot-rotated-axes'
},

{
  id: 'characteristics-of-force', parent: 'energy-and-motion', title: 'What a force is', level: 2,
  short: 'F = ma would be empty if it only defined force. It has content because forces have laws of their own, come in action–reaction pairs and have material sources. Friction is a rough rule, not a law; pseudo forces in accelerating frames have no source — and act on everything in proportion to its mass, just like gravity.',
  keywords: ['force', 'F = ma', 'definition of force', 'friction', 'coefficient of friction', 'molecular forces', 'fundamental forces', 'field', 'pseudo force', 'fictitious force', 'centrifugal force', 'accelerating frame', 'equivalence principle'],
  prereq: ['newtons-laws-numerically', 'conservation-of-momentum', 'physics:force'],
  related: ['work-and-potential-energy', 'theory-of-gravitation', 'curved-space', 'em-introduction', 'gravity-vs-electricity', 'physics:newtons-third-law', 'physics:centripetal-force', 'physics:fundamental-forces'],
  body: `
Newton's second law, $F = ma$, invites an awkward question, and Feynman faced it squarely: if force is *defined* as mass times acceleration, the law says nothing at all. What gives it content?

### Why F = ma is more than a definition
Three things. First, **forces have laws of their own**, which tell us the force *without* watching the acceleration: gravity $GMm/r^2$, a spring $-kx$, the electric force between charges. Measure the stretch of a spring and you know the force it will exert on anything. Second, **forces come in pairs** — Newton's third law — which already gave us conservation of momentum ([[conservation-of-momentum]]). Third, **forces have sources**: when a body accelerates, look around and you will find another body responsible — the Earth, a hand, a magnet, a floor. The law is valuable because the forces turn out to be simple: a few laws cover them all.

### Friction: a rough rule
Push a crate across a floor. It does not budge until the push exceeds a certain value; once it slides, a somewhat smaller push keeps it moving at a steady speed. To a fair approximation the friction is proportional to the force pressing the surfaces together, $F = \\mu N$, and roughly independent of the area of contact and the speed:

| Surfaces (dry, approximate) | $\\mu$ (sliding) |
|---|---|
| rubber on dry concrete | 0.6–0.85 |
| steel on steel | 0.4–0.6 |
| wood on wood | 0.2–0.4 |
| ice on ice | 0.02–0.1 |
| PTFE on steel | about 0.04 |

Feynman stressed that this is not a law of nature like gravitation but a rule of thumb that summarises an extremely complicated process. Surfaces touch only at the tips of microscopic bumps; atoms there stick to each other and are torn apart. Very clean metal surfaces in vacuum stick so well that they weld.

### The forces behind all the others
Push two atoms together and they repel strongly; pull them a little apart and they attract; the balance point is the spacing of atoms in a solid. These **molecular forces** are electrical, and so are tension, friction, elasticity, the normal force of a floor and every chemical bond. Underneath there are only a few **fundamental forces**: gravitation, electromagnetism and the nuclear forces. Each can be described by a **[[?field]]**: at every point of space, the force a test mass or a test charge would feel there, per unit of its mass or charge ([[em-introduction]]).

### Pseudo forces
Sit in a carriage that is speeding up. A weight hanging from the ceiling swings back and stays tilted; a box on a slippery floor slides to the rear. From inside it looks as if a force $-m\\mathbf{a}$ pushes everything backwards. There is no body that exerts it — it appears only because the carriage is accelerating. Seen from the ground, nothing pushes backwards at all: the string and the floor simply provide the forward force $m\\mathbf{a}$ needed to accelerate the weight and the box. In the simulation you can switch between the two descriptions; they agree about every measurement.

The bob hangs at the angle where the string's pull balances gravity and the pseudo force:

$$\\tan\\theta = \\frac{a}{g}$$

A rotating frame has its own pseudo forces: the centrifugal force $m\\omega^2 r$ and the Coriolis force, which steers winds and ocean currents on the turning Earth.

### A clue to gravity
Pseudo forces have a curious property: they are exactly **[[?proportional]] to mass**, so they give every object the same acceleration. Gravity does the same. Feynman pointed out that this suggests gravity itself might be a kind of pseudo force — Einstein's equivalence principle, the doorway to [[curved-space]].

> [!key] F = ma has content because forces obey their own laws, come in equal and opposite pairs and have material sources. Friction is only an approximate rule. Pseudo forces appear in accelerating frames, have no source, and — like gravity — are proportional to mass.
`,
  ideas: [
    'F = ma has content because forces have independent laws (gravity, springs, electricity), obey action–reaction, and have material sources.',
    'Friction is roughly μN, independent of area and speed — an empirical rule summarising complicated atomic processes, not a fundamental law.',
    'Nearly every everyday force (contact, tension, friction, elasticity, chemistry) is electrical at bottom.',
    'In an accelerating frame a pseudo force −ma acts on every body; it has no source, and it is proportional to mass.',
    'Because gravity is also proportional to mass, it resembles a pseudo force — the seed of the equivalence principle.'
  ],
  pitfalls: [
    'Centrifugal force pushes things outwards in a turning car — Seen from the road, nothing pushes you out; the door pushes you in, providing the centripetal force needed to turn you. The outward push exists only in the car\'s rotating frame.',
    'Friction always opposes motion — It opposes sliding between the surfaces. Friction from the road is what pushes a car forwards and what makes a box in an accelerating lorry speed up with it.',
    'Friction is a fundamental force of nature — It is the combined effect of countless electrical forces between atoms at the contact points; its "law" F = μN is only approximate.'
  ],
  formulas: [
    {
      name: 'Friction (approximate)', expr: 'F = mu*N', tex: 'F = \\mu N',
      vars: {
        F: { name: 'friction force', q: 'force', unit: 'N' },
        mu: { name: 'coefficient of friction', value: 0.4, tex: '\\mu' },
        N: { name: 'force pressing the surfaces together', q: 'force', unit: 'N', value: 490 }
      },
      note: 'Static friction can be anything up to μₛN; sliding friction is about μₖN, usually a little less.',
      stories: { F: 'A crate presses on the floor with {N}; the coefficient of friction is {mu}. What force keeps it sliding at a steady speed?', mu: 'Sliding a box that presses down with {N} takes a steady {F}. What is the coefficient of friction?' }
    },
    {
      name: 'Tilt of a hanging weight in an accelerating vehicle', expr: 'tan(theta) = a/g', tex: '\\tan\\theta = \\dfrac{a}{g}',
      vars: {
        theta: { name: 'tilt from the vertical', q: 'angle', unit: '°', min: 0, max: 89, tex: '\\theta' },
        a: { name: 'acceleration of the vehicle', q: 'accel', unit: 'm/s²', value: 3.47 },
        g: { const: 'g' }
      },
      solveFor: 'theta',
      note: 'A simple accelerometer: the bob hangs along the combined pull of gravity and the pseudo force.',
      stories: { theta: 'A car accelerates at {a}. At what angle does a key ring hang from the mirror?', a: 'A plumb line in a train hangs {theta} from the vertical. How fast is the train accelerating?' }
    },
    {
      name: 'Largest acceleration a box on the floor can follow', expr: 'a = mu*g', tex: 'a_{\\max} = \\mu_s g',
      vars: {
        a: { name: 'largest acceleration without slipping', q: 'accel', unit: 'm/s²', tex: 'a_{\\max}' },
        mu: { name: 'coefficient of static friction', value: 0.3, tex: '\\mu_s' },
        g: { const: 'g' }
      },
      note: 'The mass cancels: static friction up to μₛmg must supply the force ma.',
      stories: { a: 'A box sits on a lorry bed with static friction coefficient {mu}. What is the largest acceleration it can follow without sliding?' }
    },
    {
      name: 'Centrifugal force in a rotating frame', expr: 'F = m*omega^2*r', tex: 'F = m\\omega^2 r',
      vars: {
        F: { name: 'centrifugal (pseudo) force', q: 'force', unit: 'N' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 70 },
        omega: { name: 'rate of rotation', q: 'angvel', unit: 'rpm', value: 3, tex: '\\omega' },
        r: { name: 'distance from the axis', q: 'length', unit: 'm', value: 100 }
      },
      note: 'Seen from outside it is the centripetal force the floor must supply to carry you round.',
      stories: { F: 'A {m} astronaut stands {r} from the axis of a station turning at {omega}. How hard does the floor press on her feet?', omega: 'How fast must a station of radius {r} turn so that a {m} person feels {F}?' }
    }
  ],
  examples: [
    {
      title: 'Starting and keeping a crate moving',
      q: 'A 50 kg crate stands on a floor with $\\mu_s = 0.5$ and $\\mu_k = 0.4$. What horizontal push starts it, and what push keeps it sliding at a steady speed?',
      steps: [
        'The floor presses up with $N = mg = 50 \\times 9.81 = 490.5$ N.',
        'To start: exceed $\\mu_sN = 0.5 \\times 490.5 = 245$ N.',
        'To keep sliding at constant speed (no net force): $\\mu_kN = 0.4 \\times 490.5 = 196$ N.'
      ],
      a: 'About 245 N to start, 196 N to keep going.'
    },
    {
      title: 'A key ring as an accelerometer',
      q: 'A car goes from 0 to 100 km/h in 8.0 s at steady acceleration. At what angle does a key ring hang from the mirror?',
      steps: [
        '$a = (100/3.6)/8.0 = 3.47$ m/s².',
        '$\\tan\\theta = 3.47/9.81 = 0.354$, so $\\theta = 19.5°$, leaning towards the back.',
        'From the road: the string\'s tension has a forward component $m a$ and an upward component $m g$. From inside: the string balances gravity plus a pseudo force $ma$ backwards. Same angle either way.'
      ],
      a: 'About 19.5° from the vertical.'
    },
    {
      title: 'Artificial gravity',
      q: 'A space station is a wheel of radius 100 m. How fast must it turn so that people on the rim feel 1 g?',
      steps: [
        'We need $\\omega^2 r = g$: $\\omega = \\sqrt{9.81/100} = 0.313$ rad/s.',
        'In turns per minute: $0.313 \\times 60/(2\\pi) = 2.99$ rpm.'
      ],
      a: 'About 3 turns a minute.'
    }
  ],
  quiz: [
    { q: 'What gives Newton\'s law F = ma physical content, rather than being a mere definition of force?', choices: ['forces obey laws of their own and come from identifiable sources', 'the value of the mass', 'the fact that acceleration can be measured', 'nothing: it is only a definition'], a: 0, why: 'Gravity, springs and electric forces have independent laws; with the third law and the search for sources, F = ma predicts.' },
    { q: 'A bus brakes hard. Standing passengers lurch forwards. Seen from the pavement, what is happening?', choices: ['the passengers keep moving while the bus slows under them', 'a forward force pushes the passengers', 'the passengers speed up', 'the floor pushes the passengers forwards'], a: 0, why: 'No forward force acts; their feet are slowed by friction but their bodies tend to keep going. The "forward push" exists only in the bus\'s decelerating frame.' },
    { q: 'Doubling the contact area of a sliding block, with the same weight, changes the sliding friction roughly by…', choices: ['nothing', 'a factor of 2', 'a factor of ½', 'a factor of 4'], a: 0, why: 'To a good approximation friction depends on the normal force, not on the apparent area: the real contact area is set by the load.' },
    { q: 'Pseudo forces and gravity share a property. Which?', choices: ['both are proportional to the mass of the body they act on', 'both come from a nearby body', 'both vanish in a rotating frame', 'both are always perpendicular to the motion'], a: 0, why: 'Every body gets the same acceleration from either, which is the root of Einstein\'s equivalence principle.' },
    { q: 'A train accelerates at 1.5 m/s². At what angle (degrees) from the vertical does a hanging strap tilt?', answer: 8.7, unit: '°', why: 'tan θ = 1.5/9.81 = 0.153, θ ≈ 8.7°.' }
  ],
  problems: [
    { q: 'A crate on a lorry bed has a coefficient of static friction 0.35. What is the largest acceleration the lorry can have without the crate sliding?', answer: 3.43, unit: 'm/s²', tol: 0.02, hint: 'Static friction must supply ma.',
      steps: ['Friction up to $\\mu_s mg$ must give the crate the force $ma$.', '$a_{\\max} = \\mu_s g = 0.35 \\times 9.81 = 3.43$ m/s².'] },
    { q: 'A 60 kg rider sits 5 m from the centre of a carousel turning once every 8 s. What sideways force must the seat provide?', answer: 185, unit: 'N', tol: 0.02, hint: 'ω = 2π/T.',
      steps: ['$\\omega = 2\\pi/8 = 0.785$ rad/s.', '$F = m\\omega^2 r = 60 \\times 0.617 \\times 5 = 185$ N, towards the centre (in the carousel\'s frame, balancing an outward centrifugal force).'] }
  ],
  applications: [
    'Accelerometers in phones and cars are, at heart, small masses on springs: the pseudo force stretches the spring in proportion to the acceleration.',
    'Tyres, brakes, clutches and belt drives are designed around friction coefficients; anti-lock brakes keep the tyre near its peak static friction.',
    'Centrifuges separate blood and enrich uranium using the large pseudo forces of a rotating frame — thousands of g.'
  ],
  history: 'Guillaume Amontons (1699) and Charles-Augustin de Coulomb (1785) formulated the empirical laws of friction. Gaspard-Gustave de Coriolis analysed the pseudo forces of rotating frames in 1835. Albert Einstein made the equivalence of gravity and acceleration the foundation of general relativity (1907–1915).',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 12 (Characteristics of Force) — what a force is, friction, molecular forces, fundamental forces and fields, pseudo forces, nuclear forces.',
    'Vol. II, ch. 42 (Curved Space) — the equivalence of acceleration and gravity.'
  ],
  sim: 'mot-pseudo'
},

{
  id: 'work-and-potential-energy', parent: 'energy-and-motion', title: 'Work, potential energy and fields', level: 2,
  short: 'The work a force does is its push added up along the path. For gravity (and every fundamental force) the total depends only on where you start and finish, not on the route — which is what lets us define a potential energy. The force is then the downhill slope of that energy.',
  keywords: ['work', 'potential energy', 'conservative force', 'path independence', 'line integral', 'gradient', 'contour map', 'kinetic energy theorem', 'friction', 'field', 'potential', 'gravitational potential', 'curl'],
  prereq: ['conservation-of-energy', 'vectors-and-symmetry', 'math:line-integrals'],
  related: ['characteristics-of-force', 'theory-of-gravitation', 'vector-calculus-fields', 'electrostatic-energy-feyn', 'least-action-mechanics', 'math:gradient', 'physics:conservative-forces', 'physics:work-energy-theorem', 'physics:gravitational-potential'],
  body: `
In the lecture on energy, gravitational energy came from a clever argument about weight-lifting machines. Feynman then put the idea on a firmer footing with two new tools: **work**, which measures how a force changes kinetic energy, and **potential energy**, which exists only for forces whose work does not depend on the path.

### Work, and what it does
If a force $\\mathbf{F}$ acts on a body that moves through a small step $d\\mathbf{s}$, the force does work $\\mathbf{F}\\cdot d\\mathbf{s}$ — only the component of the force along the motion counts ([[?dot-product]]). Along a whole path, add up the steps: the **[[?line-integral]]**

$$W = \\int_A^B \\mathbf{F}\\cdot d\\mathbf{s}.$$

Newton's law turns this into a statement about motion: the work done by the total force equals the change in kinetic energy, $W = \\tfrac12 mv_B^2 - \\tfrac12 mv_A^2$. (The step: $\\mathbf{F}\\cdot\\mathbf{v} = m\\,\\mathbf{v}\\cdot d\\mathbf{v}/dt = \\tfrac{d}{dt}(\\tfrac12 mv^2)$ — the rate of doing work is the rate of gaining kinetic energy.)

### Gravity does not care about the route
Near the ground gravity is $-mg$ straight down. Walk from A to B by any route: horizontal bits do no work, and the vertical bits add up to $-mg\\,(h_B - h_A)$, whatever the zigzags. Far from the Earth the force is $GMm/r^2$ towards the centre; split any path into steps along a radius and steps along a circle — the circular steps do no work, the radial ones add up to

$$W = GMm\\left(\\frac{1}{r_B} - \\frac{1}{r_A}\\right),$$

again independent of the route. Feynman's argument for why it *must* be so: if one route up and another route down gave different totals, you could go round the loop again and again and gain energy every time — perpetual motion. A force whose work is the same for every path between two points — equivalently, zero around every closed loop, $\\oint \\mathbf{F}\\cdot d\\mathbf{s} = 0$ ([[?closed-integral]]) — is called **conservative**.

### Potential energy, and force as a slope
For a conservative force we can label every point with a number $U$, the **potential energy**, such that the work from A to B is the drop $U_A - U_B$. Then $\\tfrac12 mv^2 + U$ never changes. Near the ground $U = mgh$; around a planet $U = -GMm/r$ (zero far away); for a spring $\\tfrac12 kx^2$.

Going the other way, the force is how steeply $U$ falls: $F_x = -\\partial U/\\partial x$ ([[?partial-derivative]]), and in three dimensions $\\mathbf{F} = -\\nabla U$, the [[?gradient]]. Think of $U$ as the height of a landscape on a contour map: the force points straight downhill, across the contour lines, and is strongest where they crowd together. That is the picture in the simulation: two routes between the same points, the work along each added up step by step — and always the same total.

### When the route matters
Friction is different: drag a box along a longer path and more heat is made. Yet at the level of atoms friction is not a new kind of force — the "lost" work goes into atomic jiggling, and the fundamental forces are all conservative. A force that swirls round a point, like the one you can add in the simulation, has a [[?curl]]: going round the swirl with it gains energy every lap. No static force of nature is like that, but the electric field made by a changing magnetic field is — which is how a transformer works ([[induction-laws]]).

| Force | Conservative? | Potential energy |
|---|---|---|
| gravity near the ground | yes | $mgh$ |
| gravity of a sphere | yes | $-GMm/r$ |
| spring | yes | $\\tfrac12 kx^2$ |
| electrostatic | yes | $qV$ |
| friction, drag | no — depends on the path | none |

### Fields
Divide the force by the mass (or charge) of the test body and you get a property of space alone: the gravitational **[[?field]]** $\\mathbf{g} = \\mathbf{F}/m$ and the potential $\\phi = U/m$. Feynman used them to show that a spherical shell pulls on things outside as if all its mass were at the centre, and not at all on things inside — the result Newton needed for planets ([[theory-of-gravitation]]).

> [!key] Work is force along the path, added up. For conservative forces it depends only on the end points; that defines a potential energy U, and the force is its downhill slope, F = −∇U. Friction's work depends on the path because it feeds energy into atomic motion.
`,
  ideas: [
    'Work W = ∫F·ds adds up the component of force along each step; the total work of the net force equals the change in kinetic energy.',
    'For gravity (and every fundamental static force) the work between two points is independent of the path — otherwise perpetual motion would be possible.',
    'Path independence defines a potential energy U; ½mv² + U is then conserved.',
    'The force is the downhill slope of the potential energy, F = −∇U, perpendicular to the contour lines.',
    'Friction and swirling (curl) forces are not conservative: the work depends on the route.'
  ],
  pitfalls: [
    'Carrying a heavy suitcase along a level corridor does a lot of work on it — Your upward force is perpendicular to the motion: it does no work on the suitcase (your muscles use energy, but that is heat in your body).',
    'A longer route up a hill needs more energy against gravity — Gravity\'s work depends only on the height gained; a longer route only adds work against friction.',
    'The potential energy at a point has a definite absolute value — Only differences matter; −GMm/r puts the zero at infinity by convention, mgh at whatever level you choose.'
  ],
  formulas: [
    {
      name: 'Work changes the kinetic energy', expr: 'W = 1/2*m*v^2 - 1/2*m*v0^2', tex: 'W = \\tfrac12 m v^2 - \\tfrac12 m v_0^2',
      vars: {
        W: { name: 'work done by the total force', q: 'energy', unit: 'J', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1000 },
        v: { name: 'final speed', q: 'speed', unit: 'm/s', value: 20 },
        v0: { name: 'initial speed', q: 'speed', unit: 'm/s', value: 10 }
      },
      stories: { W: 'How much work does the engine (net) do to take a {m} car from {v0} to {v}?', v: 'A {m} car moving at {v0} has {W} of net work done on it. How fast does it go?' }
    },
    {
      name: 'Gravitational potential energy of a sphere', expr: 'U = -G*M*m/r', tex: 'U = -\\dfrac{G M m}{r}',
      vars: {
        U: { name: 'potential energy (zero far away)', q: 'energy', unit: 'GJ', signed: true },
        G: { const: 'G' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 1 },
        m: { name: 'mass of the body', q: 'mass', unit: 'kg', value: 1000 },
        r: { name: 'distance from the centre', q: 'length', unit: 'km', value: 6771 }
      },
      note: 'Always negative: the body is bound. Near the surface, a small change in r gives back mg Δh.',
      stories: { U: 'What is the potential energy of a {m} satellite {r} from the centre of the Earth ({M})?' }
    },
    {
      name: 'Work to climb out of a gravity well', expr: 'W = G*M*m*(1/r1 - 1/r2)', tex: 'W = G M m\\left(\\dfrac{1}{r_1} - \\dfrac{1}{r_2}\\right)',
      vars: {
        W: { name: 'work done against gravity', q: 'energy', unit: 'GJ' },
        G: { const: 'G' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 1 },
        m: { name: 'mass lifted', q: 'mass', unit: 'kg', value: 1000 },
        r1: { name: 'starting distance from the centre', q: 'length', unit: 'km', value: 6371 },
        r2: { name: 'final distance from the centre', q: 'length', unit: 'km', value: 6771 }
      },
      note: 'Independent of the path taken. For r₂ − r₁ much smaller than r₁ it becomes mgh.',
      stories: { W: 'How much work lifts a {m} satellite from the surface ({r1} from the centre) to {r2} from the centre of a planet of {M}?' }
    },
    {
      name: 'Force as the slope of the potential energy', expr: 'F = -dU/dx', tex: 'F_x = -\\dfrac{\\Delta U}{\\Delta x}',
      vars: {
        F: { name: 'force component along x', q: 'force', unit: 'N', signed: true, tex: 'F_x' },
        dU: { name: 'change of potential energy', q: 'energy', unit: 'J', value: 24.5, signed: true, tex: '\\Delta U' },
        dx: { name: 'small step along x', q: 'length', unit: 'm', value: 0.5, signed: true, tex: '\\Delta x' }
      },
      note: 'In the limit of small steps F_x = −∂U/∂x; in three dimensions F = −∇U, pointing straight downhill.',
      stories: { F: 'Moving a body {dx} along x raises its potential energy by {dU}. What force component acts on it?' }
    }
  ],
  derivation: {
    title: 'Why the work of the net force is the change of kinetic energy',
    steps: [
      { text: 'Newton\'s law, dotted with the velocity on both sides (take the component of each side along the motion):', tex: '\\mathbf{F}\\cdot\\mathbf{v} = m\\,\\frac{d\\mathbf{v}}{dt}\\cdot\\mathbf{v}' },
      { text: 'The right side is the rate of change of $\\tfrac12 m\\,\\mathbf{v}\\cdot\\mathbf{v}$ (differentiate the square: the factor 2 cancels the ½):', tex: 'm\\,\\frac{d\\mathbf{v}}{dt}\\cdot\\mathbf{v} = \\frac{d}{dt}\\left(\\tfrac12 m v^2\\right)' },
      { text: 'The left side is the power: force times the step taken per unit time, $\\mathbf{F}\\cdot d\\mathbf{s}/dt$.', tex: '\\mathbf{F}\\cdot\\frac{d\\mathbf{s}}{dt} = \\frac{d}{dt}\\left(\\tfrac12 m v^2\\right)' },
      { text: 'Add up (integrate) over the whole trip from A to B:', tex: '\\int_A^B \\mathbf{F}\\cdot d\\mathbf{s} = \\tfrac12 m v_B^2 - \\tfrac12 m v_A^2' }
    ]
  },
  examples: [
    {
      title: 'Lifting a satellite',
      q: 'How much work lifts a 1000 kg satellite from the Earth\'s surface (6371 km from the centre) to a height of 400 km? Compare with $mgh$.',
      steps: [
        '$GM_\\oplus = 3.986\\times10^{14}$ m³/s², so $W = 3.986\\times10^{17}\\,(1/6.371\\times10^6 - 1/6.771\\times10^6)$.',
        '$1/6.371\\times10^6 - 1/6.771\\times10^6 = 9.27\\times10^{-9}$ m⁻¹, so $W = 3.70\\times10^9$ J.',
        '$mgh = 1000 \\times 9.81 \\times 4\\times10^5 = 3.92\\times10^9$ J — 6 % too much, because $g$ weakens with height.'
      ],
      a: '3.7 GJ (mgh overestimates it slightly). Reaching orbital speed then needs about 30 GJ more.'
    },
    {
      title: 'Two sledges, two slopes',
      q: 'Two children sledge down from the same 12 m high hilltop, one down a steep straight slope, one down a long winding track. Ignoring friction, how fast is each at the bottom?',
      steps: [
        'Gravity\'s work depends only on the drop: $W = mgh$ for both.',
        '$\\tfrac12 mv^2 = mgh$ gives $v = \\sqrt{2 \\times 9.81 \\times 12} = 15.3$ m/s for both.',
        'With friction the winding track would be slower: friction\'s work grows with the length of the path.'
      ],
      a: 'Both reach 15.3 m/s; only friction would tell the routes apart.'
    }
  ],
  quiz: [
    { q: 'You carry a box up a staircase, then along a corridor, then down a ramp to the height where you started. The total work done by gravity on the box is…', choices: ['zero', 'negative', 'positive', 'it depends on how long the corridor is'], a: 0, why: 'Gravity is conservative: the work depends only on the change in height, which is zero.' },
    { q: 'On a contour map of potential energy, the force on a body points…', choices: ['downhill, perpendicular to the contour lines', 'along the contour lines', 'uphill', 'towards the lowest point on the map'], a: 0, why: 'F = −∇U: the steepest descent, across the contours, strongest where they are close together.' },
    { q: 'Which force is not conservative?', choices: ['sliding friction', 'gravity', 'the force of a spring', 'the electrostatic force'], a: 0, why: 'Friction\'s work grows with the length of the path; around a closed loop it is always negative.' },
    { q: 'A force does work W on a body. If W is positive, the body\'s kinetic energy…', choices: ['increases, if it is the only force', 'decreases', 'is unchanged', 'depends on the potential energy'], a: 0, why: 'The work of the total force equals the change in ½mv².' },
    { q: 'A 2 kg stone falls from 5 m. How much work (J) does gravity do on it?', answer: 98.1, unit: 'J', why: 'W = mgh = 2 × 9.81 × 5 = 98.1 J, whatever path it takes.' }
  ],
  problems: [
    { q: 'A 1200 kg car speeds up from 15 m/s to 25 m/s. How much net work was done on it?', answer: 240000, unit: 'J', tol: 0.01, hint: 'W = ΔK.',
      steps: ['$W = \\tfrac12 \\times 1200 \\times (25^2 - 15^2) = 600 \\times 400 = 240\\,000$ J.'] },
    { q: 'Along a line, the potential energy of a body drops from 80 J to 50 J over 0.2 m. What average force acts along the line?', answer: 150, unit: 'N', tol: 0.01, hint: 'F = −ΔU/Δx.',
      steps: ['$\\Delta U = 50 - 80 = -30$ J over $\\Delta x = 0.2$ m.', '$F = -(-30)/0.2 = +150$ N, in the direction of decreasing U.'] }
  ],
  applications: [
    'Rocket engineers budget missions in energy per kilogram: climbing out of the Earth\'s well to escape takes 62.6 MJ/kg, whatever the trajectory.',
    'Pumped-storage hydroelectric plants store energy as the potential energy of water raised uphill and recover about three quarters of it.',
    'Contour maps of potential — of gravity, of electric fields, of chemical reaction energies — are read exactly as hikers read a map: force downhill, steepest where contours crowd.'
  ],
  history: 'Gaspard-Gustave de Coriolis gave "work" its modern meaning in 1829, and William Rankine coined "potential energy" in 1853. The potential function for gravity was developed by Joseph-Louis Lagrange (1773) and Pierre-Simon Laplace; George Green gave "potential" its name in 1828.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 13 (Work and Potential Energy (A)) — the energy of a falling body, work done by gravity, why it must be independent of the path, the gravitational field of large objects.',
    'Vol. I, ch. 14 (Work and Potential Energy (conclusion)) — work, constrained motion, conservative forces, nonconservative forces, potentials and fields.',
    'Vol. II, ch. 4 (Electrostatics) — the same ideas for electric forces: potential and field.'
  ],
  sim: 'mot-contour'
},

{
  id: 'theory-of-gravitation', parent: 'gravitation-topic', title: 'The theory of gravitation', level: 1,
  short: 'One law — every mass attracts every other with a force proportional to both masses and falling as the square of the distance — explains the falling apple, the Moon\'s orbit, the tides, the planets, double stars and galaxies. Feynman used it as the model of what a physical law is.',
  keywords: ['gravitation', 'universal gravitation', 'inverse square law', 'Newton', 'apple and Moon', 'Newton\'s cannon', 'orbit', 'Cavendish', 'weighing the Earth', 'G', 'tides', 'free fall', 'weightlessness'],
  prereq: ['newtons-laws-numerically', 'characteristics-of-force', 'physics:newtons-law-of-gravitation'],
  related: ['keplers-laws-feyn', 'lost-lecture-ellipses', 'gravity-vs-electricity', 'law-of-gravitation-example', 'work-and-potential-energy', 'curved-space', 'physics:tides', 'physics:circular-orbits', 'physics:escape-velocity'],
  body: `
Feynman ranked Newton's law of gravitation among the highest achievements of human thought, and he used it — in the Lectures and again in the first of his Messenger Lectures at Cornell — as the example of what a physical law is: simple to state, exact in its predictions, reaching far beyond the facts it was invented to explain, and mysterious in its origin.

### The law
Every object in the universe attracts every other with a force along the line joining them, [[?proportional]] to each mass and falling as the square of the distance:

$$F = \\frac{G\\,m_1m_2}{r^2},\\qquad G = 6.674\\times10^{-11}\\ \\mathrm{N\\,m^2/kg^2}.$$

Double the distance and the pull falls to a quarter. (Why the square? Kepler's third law, $T^2 \\propto r^3$, for circular orbits needs an acceleration $4\\pi^2 r/T^2 \\propto 1/r^2$ — see [[keplers-laws-feyn]].)

### The Moon falls too
Newton's great test compared an apple with the Moon. The Moon is 60.3 Earth radii away, so if gravity weakens as $1/r^2$ its pull there should be $60.3^2 \\approx 3600$ times weaker than at the ground: $9.81/3600 = 2.72\\times10^{-3}$ m/s². The Moon goes round in 27.32 days on a circle of radius 384 400 km, which requires a centripetal acceleration $4\\pi^2 r/T^2 = 2.72\\times10^{-3}$ m/s² — the same number. In one second an apple falls 4.9 m; in one second the Moon falls 1.36 mm below the straight line it would otherwise follow. That is all an orbit is: falling, while moving sideways fast enough to keep missing.

### Newton's cannon
Newton imagined a cannon on a very high mountain firing horizontally. The faster the shot, the farther it lands — until the curve of its fall matches the curve of the Earth. Near the surface a body falls 4.9 m in the first second, and the ground curves away from a straight line by $d^2/(2R)$ over a distance $d$ — also 4.9 m when $d$ = 7.9 km. So at 7.9 km/s the shot falls all the way round: it is in orbit, circling the Earth every 84 minutes. The simulation fires this cannon; slower shots land, faster ones go into ellipses, and above 11.2 km/s they escape. Astronauts float in the space station not because gravity is absent up there (at 400 km it is still 89 % of its surface value) but because they and the station are falling together.

### Weighing the Earth, and the rest of the universe
Henry Cavendish measured the tiny attraction between lead spheres in 1798. Knowing $G$, the surface gravity gives the Earth's mass: $M = gR^2/G = 5.97\\times10^{24}$ kg. The same law then weighs everything that has something in orbit around it:

| System | What gravity explains |
|---|---|
| apple and Moon | the same force, weakened by $60^2$ |
| tides | the Moon pulls the near ocean more than the Earth's centre, the far ocean less |
| planets and comets | ellipses, and the return of Halley's comet in 1758, as predicted |
| Jupiter's moons | orbits obey the same law around another centre |
| double stars | orbits around each other, giving stellar masses |
| globular clusters, galaxies | swarms of stars held together by mutual attraction |

In 1846 the law even found a planet: irregularities in the orbit of Uranus led Urbain Le Verrier to predict where Neptune should be, and it was found there within a degree.

### What is gravity?
Newton's law says *how* bodies attract, not *why*. Feynman discussed proposed mechanisms — for instance, that space is full of particles bombarding us from all sides, so that two bodies shield each other and are pushed together — and showed how they fail: such a bombardment would also act as a drag and slow the planets in their orbits. His view was that nobody has found a machinery behind the law; we have the mathematics, and it works. Einstein's general relativity (1915) changed the description into the geometry of [[curved-space|curved space-time]], and corrected Newton by tiny amounts — the 43 arcseconds per century by which Mercury's orbit swings round.

> [!key] F = Gm₁m₂/r²: one law for apples, the Moon, tides, planets and galaxies. An orbit is a fall that keeps missing the ground; at 7.9 km/s the curve of the fall matches the curve of the Earth.
`,
  ideas: [
    'Every mass attracts every other with F = Gm₁m₂/r², along the line joining them.',
    'The Moon, 60 Earth radii away, falls towards the Earth 3600 times more slowly than an apple — exactly the inverse square.',
    'An orbit is free fall with enough sideways speed: at 7.9 km/s near the ground the fall follows the curve of the Earth.',
    'Measuring G (Cavendish) weighs the Earth; orbits weigh the Sun, planets, stars and galaxies.',
    'The law says how, not why; general relativity later recast it as the geometry of space-time.'
  ],
  pitfalls: [
    'Astronauts in orbit are weightless because there is no gravity in space — At the space station\'s height gravity is 89 % as strong as on the ground; astronauts float because they and the station fall together.',
    'The Moon does not fall because it is in orbit — It falls towards the Earth continuously (1.36 mm every second below a straight line); its sideways motion makes it keep missing.',
    'Heavier objects are pulled harder, so they fall faster — The pull is proportional to the mass, and so is the inertia; the acceleration GM/r² is the same for all.'
  ],
  formulas: [
    {
      name: 'Newton\'s law of gravitation', expr: 'F = G*m1*m2/r^2', tex: 'F = \\dfrac{G\\,m_1 m_2}{r^2}',
      vars: {
        F: { name: 'force of attraction', q: 'force', unit: 'N' },
        G: { const: 'G' },
        m1: { name: 'first mass', q: 'mass', unit: 'M⊕', value: 1 },
        m2: { name: 'second mass', q: 'mass', unit: 'kg', value: 7.342e22 },
        r: { name: 'distance between the centres', q: 'length', unit: 'km', value: 384400 }
      },
      stories: { F: 'How hard does the Earth ({m1}) pull on the Moon ({m2}) at a distance of {r}?', r: 'At what distance do the Earth ({m1}) and a mass of {m2} attract each other with {F}?' }
    },
    {
      name: 'Acceleration needed to go round a circle', expr: 'a = 4*pi^2*r/T^2', tex: 'a = \\dfrac{4\\pi^2 r}{T^2}',
      vars: {
        a: { name: 'centripetal acceleration', q: 'accel', unit: 'm/s²' },
        r: { name: 'radius of the orbit', q: 'length', unit: 'km', value: 384400 },
        T: { name: 'time for one orbit', q: 'time', unit: 'day', value: 27.32 }
      },
      note: 'For the Moon: 2.72 × 10⁻³ m/s², which is g/3600.',
      stories: { a: 'The Moon circles the Earth at {r} every {T}. What acceleration does its orbit require?', T: 'A body circling at {r} has a centripetal acceleration of {a}. How long is its orbit?' }
    },
    {
      name: 'Speed of a circular orbit', expr: 'v = sqrt(G*M/r)', tex: 'v = \\sqrt{\\dfrac{G M}{r}}',
      vars: {
        v: { name: 'orbital speed', q: 'speed', unit: 'km/s' },
        G: { const: 'G' },
        M: { name: 'mass of the central body', q: 'mass', unit: 'M⊕', value: 1 },
        r: { name: 'radius of the orbit (from the centre)', q: 'length', unit: 'km', value: 6371 }
      },
      note: 'Just above the ground: 7.9 km/s, Newton\'s cannon. The space station at 6771 km: 7.67 km/s.',
      stories: { v: 'How fast must a cannonball fly to orbit a body of {M} at {r} from its centre?', r: 'A satellite circles the Earth ({M}) at {v}. How far from the centre is its orbit?' }
    },
    {
      name: 'Weighing the Earth', expr: 'M = g0*R^2/G', tex: 'M = \\dfrac{g R^2}{G}',
      vars: {
        M: { name: 'mass of the planet', q: 'mass', unit: 'kg' },
        g0: { name: 'acceleration of gravity at the surface', q: 'accel', unit: 'm/s²', value: 9.81, tex: 'g' },
        R: { name: 'radius of the planet', q: 'length', unit: 'km', value: 6371 },
        G: { const: 'G' }
      },
      note: 'From g = GM/R². With the Moon\'s g of 1.62 m/s² and radius 1737 km it gives 7.3 × 10²² kg.',
      stories: { M: 'Things fall at {g0} on a planet of radius {R}. What is its mass?', g0: 'How strong is gravity at the surface of a planet of mass {M} and radius {R}?' }
    }
  ],
  examples: [
    {
      title: 'How far does the Moon fall in a second?',
      q: 'The Moon orbits at 384 400 km every 27.32 days. Find its acceleration, how far it falls below a straight line in one second, and compare with an apple.',
      steps: [
        '$T = 27.32 \\times 86\\,400 = 2.360\\times10^6$ s, so $a = 4\\pi^2 \\times 3.844\\times10^8/(2.360\\times10^6)^2 = 2.72\\times10^{-3}$ m/s².',
        'In one second: $\\tfrac12 at^2 = 1.36\\times10^{-3}$ m = 1.36 mm. The apple: $\\tfrac12 \\times 9.81 \\times 1 = 4.9$ m.',
        'Ratio $9.81/2.72\\times10^{-3} = 3600$, and $(384\\,400/6371)^2 = 60.3^2 = 3640$: the inverse square, confirmed to 1 %.'
      ],
      a: '2.72 mm/s²; 1.36 mm in a second, 3600 times less than the apple.'
    },
    {
      title: 'Newton\'s cannon',
      q: 'How fast must a shot be fired horizontally, just above the ground (ignoring air), to circle the Earth? How long does one lap take?',
      steps: [
        '$v = \\sqrt{GM/R} = \\sqrt{3.986\\times10^{14}/6.371\\times10^6} = 7910$ m/s.',
        'In one second it travels 7.9 km and falls 4.9 m; over 7.9 km the ground curves away by $7910^2/(2 \\times 6.371\\times10^6) = 4.9$ m.',
        'Period: $2\\pi R/v = 2\\pi \\times 6.371\\times10^6/7910 = 5060$ s = 84 min.'
      ],
      a: '7.9 km/s; one lap every 84 minutes.'
    },
    {
      title: 'Weighing the Earth',
      q: 'Using $G = 6.674\\times10^{-11}$ N m²/kg², $g = 9.81$ m/s² and $R = 6371$ km, find the Earth\'s mass and mean density.',
      steps: [
        '$M = gR^2/G = 9.81 \\times (6.371\\times10^6)^2/6.674\\times10^{-11} = 5.97\\times10^{24}$ kg.',
        'Volume $\\tfrac43\\pi R^3 = 1.083\\times10^{21}$ m³, so the density is 5510 kg/m³.',
        'Surface rocks are about 2700 kg/m³: the Earth\'s interior must be much denser — its iron core.'
      ],
      a: '5.97 × 10²⁴ kg, average density 5.5 times that of water.'
    }
  ],
  quiz: [
    { q: 'If the distance between two bodies is tripled, the gravitational force between them becomes…', choices: ['1/9 as large', '1/3 as large', '3 times larger', '1/27 as large'], a: 0, why: 'Inverse square: (1/3)² = 1/9.' },
    { q: 'Astronauts float inside the space station, 400 km up, because…', choices: ['they and the station are falling freely together', 'there is no gravity at that height', 'the station\'s engines cancel gravity', 'air pressure holds them up'], a: 0, why: 'Gravity there is about 8.7 m/s²; everything falls at the same rate, so nothing presses on anything.' },
    { q: 'Newton compared the Moon\'s acceleration with an apple\'s. Their ratio, about 1/3600, confirms that gravity…', choices: ['falls as the inverse square of the distance', 'is proportional to the mass', 'travels at the speed of light', 'is stronger on the Moon'], a: 0, why: 'The Moon is 60 Earth radii away and 60² = 3600.' },
    { q: 'A planet has the Earth\'s mass but twice its radius. Surface gravity there is…', choices: ['a quarter of the Earth\'s', 'half the Earth\'s', 'the same', 'twice the Earth\'s'], a: 0, why: 'g = GM/R²: doubling R divides g by 4.' },
    { q: 'What is the acceleration due to gravity (m/s²) at two Earth radii from the Earth\'s centre?', answer: 2.45, unit: 'm/s²', why: '9.81/2² = 2.45 m/s².' }
  ],
  problems: [
    { q: 'A satellite orbits 35 786 km above the equator (42 164 km from the centre). What is its period, in hours?', answer: 23.93, unit: 'h', tol: 0.01, hint: 'T = 2π√(r³/GM), GM = 3.986 × 10¹⁴ m³/s².',
      steps: ['$T = 2\\pi\\sqrt{(4.2164\\times10^7)^3/3.986\\times10^{14}} = 86\\,164$ s.', 'That is 23.93 h — one sidereal day, so the satellite hangs over the same spot: a geostationary orbit.'] },
    { q: 'Two 1000 kg lead spheres have their centres 2 m apart. With what force do they attract?', answer: 1.67e-5, unit: 'N', tol: 0.02, hint: 'F = Gm₁m₂/r².',
      steps: ['$F = 6.674\\times10^{-11} \\times 10^6/4 = 1.67\\times10^{-5}$ N — about the weight of a small grain of sand, which is why Cavendish needed such a delicate balance.'] }
  ],
  applications: [
    'Every satellite — GPS, weather, communications — is placed with Newton\'s law; geostationary orbits sit 42 164 km from the Earth\'s centre.',
    'Gravity surveys map dense ore bodies and oil-bearing rock from tiny variations of g, a few parts in ten million.',
    'Astronomers weigh stars, black holes and galaxies by the orbits of things around them — which is how dark matter was inferred.'
  ],
  history: 'Newton published the law in the *Principia* (1687); the story that a falling apple set him thinking comes from his own recollections as told to William Stukeley. Edmond Halley predicted the 1758 return of his comet. Henry Cavendish measured the attraction of lead spheres in 1798. Urbain Le Verrier predicted Neptune from the wobbles of Uranus, and Johann Galle found it on 23 September 1846.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 7 (The Theory of Gravitation) — planetary motions, Kepler\'s laws, Newton\'s law, the Moon\'s fall compared with an apple\'s, universal gravitation, Cavendish\'s experiment, what gravity is, gravity and relativity.',
    '*The Character of Physical Law*, lecture 1 (The Law of Gravitation, an Example of Physical Law) — the law as the model of a physical law, told for a general audience.',
    '*Six Easy Pieces* (1994) — reprints the gravitation lecture.'
  ],
  sim: 'mot-cannon'
},

{
  id: 'keplers-laws-feyn', parent: 'gravitation-topic', title: 'Kepler\'s laws and Newton\'s explanation', level: 2,
  short: 'Kepler found three rules in Tycho Brahe\'s observations: ellipses with the Sun at a focus, equal areas in equal times, and period squared proportional to distance cubed. Newton showed that the second follows from any force aimed at the Sun, and the other two from the inverse square.',
  keywords: ['Kepler', 'Kepler\'s laws', 'ellipse', 'focus', 'equal areas', 'areal velocity', 'angular momentum', 'third law', 'period', 'semi-major axis', 'Tycho Brahe', 'Mars', 'central force', 'perihelion', 'aphelion'],
  prereq: ['theory-of-gravitation', 'newtons-laws-numerically', 'math:ellipse'],
  related: ['lost-lecture-ellipses', 'conservation-of-momentum', 'rotation-feyn', 'physics:keplers-laws', 'physics:angular-momentum', 'physics:planets'],
  body: `
Feynman told the story of planetary motion as the first great triumph of the method of physics: patient measurement, a guess at a rule, and then an explanation of the rule by something deeper.

### Three rules from Tycho's numbers
Tycho Brahe measured the positions of the planets for twenty years at his observatory on the island of Hven, to about one or two arcminutes. Johannes Kepler, working through them, found that no combination of circles would fit Mars: the best circular model missed Tycho's positions by 8 arcminutes, and Kepler trusted the observations. The rules he found instead:

1. Each planet moves on an **ellipse**, with the Sun at one **focus**.
2. The line from the Sun to the planet sweeps out **equal areas in equal times**.
3. The **square of the period** is proportional to the **cube of the semi-major axis**: $T^2 \\propto a^3$.

| Planet | $a$ (AU) | $T$ (years) | $T^2/a^3$ | eccentricity |
|---|---|---|---|---|
| Mercury | 0.387 | 0.241 | 1.00 | 0.206 |
| Venus | 0.723 | 0.615 | 1.00 | 0.007 |
| Earth | 1.000 | 1.000 | 1.00 | 0.017 |
| Mars | 1.524 | 1.881 | 1.00 | 0.093 |
| Jupiter | 5.203 | 11.86 | 1.00 | 0.049 |
| Saturn | 9.537 | 29.46 | 1.00 | 0.057 |

### Equal areas: Newton's triangles
Newton's explanation of the second law is simple enough to draw, and Feynman drew it. Chop time into equal intervals. With no force, the planet moves in a straight line, covering equal distances in equal times; the triangles formed with the Sun then have equal bases on the same line and the same height, so **equal areas**. Now at the end of each interval give the planet a kick directed at the Sun. The kick changes the velocity, but the new triangle has the same area as the one the planet would have swept without the kick, because the kick is parallel to the line to the Sun (same base, same height again). Let the intervals shrink and the kicks become a continuous pull: the areas stay equal. So **any force directed at the Sun gives equal areas** — the inverse square is not needed. In modern language, the rate of sweeping area is half the angular momentum per unit mass, $\\tfrac12 r v_\\perp$, and a force aimed at the centre exerts no twist, so it cannot change it ([[rotation-feyn]]). The simulation lets you watch Newton's kicks and the equal triangles.

A consequence you can check: the planet moves fastest at perihelion and slowest at aphelion, with $r_pv_p = r_av_a$. The Earth moves at 30.3 km/s in early January and 29.3 km/s in early July.

### The third law: the inverse square
For a circular orbit the pull must supply the centripetal acceleration: $GM/r^2 = 4\\pi^2 r/T^2$, so

$$T^2 = \\frac{4\\pi^2}{GM}\\,r^3.$$

The inverse square is exactly what turns "the cube of the distance" into "the square of the time", and the same holds for ellipses with $r$ replaced by the semi-major axis $a$. The constant depends only on the mass at the centre: the moons of Jupiter follow their own $T^2 \\propto a^3$ with Jupiter's mass in place of the Sun's. Plotted on [[?logarithm|logarithmic]] axes, $\\log T$ against $\\log a$ is a straight line of slope 3/2 — the [[?exponent]] of $a$.

### The first law
That an inverse-square force gives ellipses is harder. Newton proved it with the geometry of conic sections; Feynman, unable to follow Newton's proof, found his own, which you can see on [[lost-lecture-ellipses]]. Or let a computer solve Newton's law step by step ([[newtons-laws-numerically]]) — ellipses come out.

> [!key] Equal areas come from any force aimed at the Sun (angular momentum is conserved); T² ∝ a³ and elliptical orbits come from the inverse square. Kepler found the rules, Newton the reason.
`,
  ideas: [
    'Kepler\'s rules came from Tycho\'s measurements: ellipses, equal areas, T² ∝ a³.',
    'Equal areas in equal times follow from any force directed at the Sun: a central kick cannot change the area swept.',
    'The rate of sweeping area is half the angular momentum per unit mass; it is conserved for central forces.',
    'For an inverse-square force, T² = 4π²a³/GM: the third law, with a constant set by the central mass.',
    'Planets move fastest at perihelion and slowest at aphelion, with r·v the same at both.'
  ],
  pitfalls: [
    'Equal areas means the planet moves at constant speed — It means the opposite: close to the Sun it must move faster to sweep the same area.',
    'The Sun sits at the centre of the ellipse — It sits at a focus; for Mercury the offset is 0.2 of the semi-major axis, for the Earth only 0.017.',
    'The third law\'s constant is the same for every system — It depends on the central mass: T² = 4π²a³/GM. Jupiter\'s moons have their own constant.'
  ],
  formulas: [
    {
      name: 'Kepler\'s third law, from Newton', expr: 'T = 2*pi*sqrt(a^3/(G*M))', tex: 'T = 2\\pi\\sqrt{\\dfrac{a^3}{G M}}',
      vars: {
        T: { name: 'period of the orbit', q: 'time', unit: 'yr' },
        a: { name: 'semi-major axis', q: 'length', unit: 'AU', value: 1.524 },
        G: { const: 'G' },
        M: { name: 'mass of the central body', q: 'mass', unit: 'M☉', value: 1 }
      },
      stories: { T: 'Mars orbits the Sun ({M}) with a semi-major axis of {a}. How long is its year?', a: 'A comet takes {T} to go round the Sun ({M}). What is its semi-major axis?', M: 'A moon circles its planet every {T} at a distance of {a}. What is the planet\'s mass?' }
    },
    {
      name: 'Equal areas: speed at the nearest and farthest points', expr: 'vp*rp = va*ra', tex: 'v_p r_p = v_a r_a',
      vars: {
        vp: { name: 'speed at perihelion', q: 'speed', unit: 'km/s', tex: 'v_p' },
        rp: { name: 'distance at perihelion', q: 'length', unit: 'AU', value: 0.9833, tex: 'r_p' },
        va: { name: 'speed at aphelion', q: 'speed', unit: 'km/s', value: 29.29, tex: 'v_a' },
        ra: { name: 'distance at aphelion', q: 'length', unit: 'AU', value: 1.0167, tex: 'r_a' }
      },
      solveFor: 'vp',
      note: 'At the two ends of the ellipse the velocity is perpendicular to the radius, so r·v is twice the rate of sweeping area.',
      stories: { vp: 'The Earth moves at {va} at aphelion ({ra}). How fast does it move at perihelion ({rp})?' }
    },
    {
      name: 'Nearest distance from the ellipse', expr: 'rp = a*(1 - ecc)', tex: 'r_p = a(1 - e)',
      vars: {
        rp: { name: 'perihelion distance', q: 'length', unit: 'AU', tex: 'r_p' },
        a: { name: 'semi-major axis', q: 'length', unit: 'AU', value: 1.524 },
        ecc: { name: 'eccentricity', value: 0.093, min: 0, max: 0.9999, tex: 'e' }
      },
      note: 'And the farthest distance is a(1 + e).',
      stories: { rp: 'Mars has a semi-major axis of {a} and an eccentricity of {ecc}. How close does it come to the Sun?' }
    },
    {
      name: 'Speed anywhere on the orbit (vis-viva)', expr: 'v = sqrt(G*M*(2/r - 1/a))', tex: 'v = \\sqrt{G M\\left(\\dfrac{2}{r} - \\dfrac{1}{a}\\right)}',
      vars: {
        v: { name: 'orbital speed', q: 'speed', unit: 'km/s' },
        G: { const: 'G' },
        M: { name: 'mass of the central body', q: 'mass', unit: 'M☉', value: 1 },
        r: { name: 'present distance', q: 'length', unit: 'AU', value: 0.586 },
        a: { name: 'semi-major axis', q: 'length', unit: 'AU', value: 17.8 }
      },
      note: 'From conservation of energy; for a circle (r = a) it gives √(GM/r).',
      stories: { v: 'Halley\'s comet (a = {a}) passes {r} from the Sun ({M}). How fast is it moving?' }
    }
  ],
  derivation: {
    title: 'Newton\'s triangles: why a central force gives equal areas',
    steps: [
      { text: 'In a time $\\Delta t$ with no force, the planet goes from $B$ to $C$ with $BC = AB$ (equal steps on a straight line). The triangles $SAB$ and $SBC$ with the Sun $S$ have equal bases on one line and the same height:', tex: '\\text{area}(SAB) = \\text{area}(SBC)' },
      { text: 'Now a kick towards $S$ at $B$ sends the planet to $C\'$ instead of $C$. The displacement $CC\'$ is parallel to $SB$, so $C$ and $C\'$ are at the same distance from the line $SB$ — triangles $SBC$ and $SBC\'$ share the base $SB$ and have equal heights:', tex: '\\text{area}(SBC\') = \\text{area}(SBC) = \\text{area}(SAB)' },
      { text: 'Repeat for every interval, and let $\\Delta t \\to 0$: the kicks become a continuous central pull, and equal areas are swept in equal times. In symbols, the swept rate is half the size of $\\mathbf{r}\\times\\mathbf{v}$ ([[?cross-product]]), which a central force cannot change:', tex: '\\frac{dA}{dt} = \\tfrac12\\,|\\mathbf{r}\\times\\mathbf{v}| = \\text{constant}' }
    ]
  },
  examples: [
    {
      title: 'The Earth\'s changing speed',
      q: 'The Earth\'s distance from the Sun ranges from 0.9833 AU (early January) to 1.0167 AU (early July). Its speed at aphelion is 29.29 km/s. What is it at perihelion?',
      steps: [
        'Equal areas: $v_pr_p = v_ar_a$.',
        '$v_p = 29.29 \\times 1.0167/0.9833 = 30.29$ km/s.',
        'So the Earth is about 3 % faster in January — which is one reason the northern winter half-year is about a week shorter than the summer half.'
      ],
      a: '30.3 km/s.'
    },
    {
      title: 'A year on Jupiter, a moon of Jupiter',
      q: 'Jupiter\'s semi-major axis is 5.203 AU. How long is its year? Its moon Io orbits every 1.769 days at 421 700 km: what is Jupiter\'s mass?',
      steps: [
        'Around the Sun, in years and AU: $T = a^{3/2} = 5.203^{1.5} = 11.87$ years.',
        'For Io: $M = 4\\pi^2a^3/(GT^2) = 4\\pi^2 (4.217\\times10^8)^3/(6.674\\times10^{-11} \\times (1.528\\times10^5)^2)$.',
        '$= 1.90\\times10^{27}$ kg, about 318 Earth masses.'
      ],
      a: '11.9 years; 1.9 × 10²⁷ kg.'
    }
  ],
  quiz: [
    { q: 'Newton\'s argument shows that equal areas in equal times follow from…', choices: ['any force directed towards the Sun', 'only an inverse-square force', 'the ellipse shape of the orbit', 'the planet\'s constant speed'], a: 0, why: 'A kick parallel to the line to the Sun leaves the swept area unchanged; the law of force does not matter.' },
    { q: 'A comet is 10 times farther from the Sun at aphelion than at perihelion. Its speed at aphelion compared with perihelion is…', choices: ['10 times smaller', '100 times smaller', '√10 times smaller', 'the same'], a: 0, why: 'r·v is the same at the two ends: ten times the distance, a tenth of the speed.' },
    { q: 'A planet has a semi-major axis of 4 AU. Its period is…', choices: ['8 years', '16 years', '4 years', '64 years'], a: 0, why: 'T = a^{3/2} = 4^{1.5} = 8 years.' },
    { q: 'The Sun is at the centre of each planet\'s elliptical orbit.', a: false, why: 'It is at one focus. The centre of the ellipse is empty space.' },
    { q: 'A planet takes 27 years to go round the Sun. What is its semi-major axis, in AU?', answer: 9, unit: 'AU', why: 'a = T^{2/3} = 27^{2/3} = 9 AU.' }
  ],
  problems: [
    { q: 'Halley\'s comet has a semi-major axis of 17.8 AU and an eccentricity of 0.967. How far from the Sun is it at aphelion?', answer: 35.0, unit: 'AU', tol: 0.02, hint: 'r_a = a(1 + e).',
      steps: ['$r_a = 17.8 \\times 1.967 = 35.0$ AU — beyond Neptune\'s orbit.'] },
    { q: 'A satellite orbits the Earth with a perigee (nearest) distance of 7000 km at 8.0 km/s. At apogee it is 14 000 km from the centre. How fast is it there?', answer: 4.0, unit: 'km/s', tol: 0.01, hint: 'r·v is the same at both ends.',
      steps: ['$v_a = v_pr_p/r_a = 8.0 \\times 7000/14\\,000 = 4.0$ km/s.'] }
  ],
  applications: [
    'Mission planners use Kepler\'s laws for transfer orbits: a spacecraft to Mars rides half an ellipse touching both orbits, taking about 8.5 months.',
    'Exoplanet hunters get planets\' distances from their periods via the third law, once the star\'s mass is known.',
    'The masses of binary stars, of Jupiter from its moons, and of the black hole at the centre of our Galaxy from stars orbiting it all come from T² = 4π²a³/GM.'
  ],
  history: 'Tycho Brahe made his observations at Hven between 1576 and 1597. Kepler published the first two laws in *Astronomia Nova* (1609) and the third in *Harmonices Mundi* (1619). Newton derived all three from his laws of motion and gravitation in the *Principia* (1687), starting with the geometric argument for equal areas.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 7 (The Theory of Gravitation) — Kepler\'s laws, the development of dynamics, and Newton\'s explanation of equal areas by a force towards the Sun.',
    '*The Character of Physical Law*, lecture 1 (The Law of Gravitation, an Example of Physical Law) — Kepler\'s rules and Newton\'s argument for equal areas, told for a general audience.',
    '*Feynman\'s Lost Lecture: The Motion of Planets Around the Sun* (David and Judith Goodstein, 1996) — the lecture begins with Newton\'s proof of the law of equal areas.'
  ],
  sim: 'mot-kepler'
},

{
  id: 'lost-lecture-ellipses', parent: 'gravitation-topic', title: 'The lost lecture: why orbits are ellipses', level: 3,
  short: 'Feynman\'s own proof, using nothing but plane geometry, that an inverse-square force gives elliptical orbits: cut the orbit into equal angles, notice that the velocity then changes by equal steps, so the velocity diagram is a circle — and a circle, turned and folded, gives back an ellipse.',
  keywords: ['lost lecture', 'Feynman\'s Lost Lecture', 'Goodstein', 'ellipse', 'inverse square', 'hodograph', 'velocity diagram', 'velocity circle', 'equal angles', 'geometric proof', 'Kepler\'s first law', 'perpendicular bisector', 'focus', 'Hamilton'],
  prereq: ['keplers-laws-feyn', 'vectors-and-symmetry', 'math:ellipse'],
  related: ['theory-of-gravitation', 'newtons-laws-numerically', 'math:conic-sections', 'math:polar-coordinates', 'physics:keplers-laws'],
  body: `
In March 1964 Feynman gave a special lecture to Caltech's first-year students on the motion of planets. His aim was to prove Kepler's first law — that an inverse-square force makes a planet move on an ellipse — using only the plane geometry a good school student knows. He explained that he had tried to follow Newton's own geometric proof in the *Principia* and had got lost in properties of conic sections that nobody learns any more, so he made up a proof of his own. The lecture was left out of the published *Lectures*; decades later its notes were rediscovered, and David and Judith Goodstein reconstructed it and published it, with commentary, as *Feynman's Lost Lecture* (1996). Here is the argument, in four steps. The simulation plays each step.

### Step 1: equal angles instead of equal times
Newton cut the orbit into pieces of equal *time*, which gives Kepler's equal areas ([[keplers-laws-feyn]]). Feynman cut it into pieces of equal *angle* as seen from the Sun, $\\Delta\\theta$. A thin slice of angle $\\Delta\\theta$ at distance $r$ has area about $\\tfrac12 r^2\\Delta\\theta$, and since area is swept at a steady rate, the **time** spent in the slice is [[?proportional]] to $r^2$:

$$\\Delta t = \\frac{r^2\\,\\Delta\\theta}{r\\,v_\\perp} \\propto r^2.$$

### Step 2: equal changes of velocity
During that time the Sun pulls with a force proportional to $1/r^2$, so the change of velocity, force × time ÷ mass, is proportional to $\\frac{1}{r^2}\\times r^2$ — **the same for every slice**. The two factors of $r^2$ cancel; this is exactly where the inverse square is used. And each change points towards the Sun, so from one slice to the next its direction turns by the same angle $\\Delta\\theta$.

### Step 3: the velocity diagram is a circle
Now draw all the velocity [[?vector|vectors]] from a single point, a *velocity diagram* (the hodograph). Successive tips differ by steps of equal length, each turned by the same angle: they form a regular polygon, and in the limit of thin slices a **circle**. Its radius $u$ is set by the strength of the pull and the angular momentum, $u = GM/(r_pv_p)$. The point from which the velocities are drawn is *not* at the centre of the circle unless the orbit is itself a circle; its offset from the centre, as a fraction of the radius, is the eccentricity. The fastest and slowest speeds are the farthest and nearest points of the circle:

$$v_{\\max} = u(1 + e),\\qquad v_{\\min} = u(1 - e).$$

### Step 4: from the circle back to the orbit
Turn the velocity diagram through 90°. Now the radius of the circle to the point $P$ belonging to a slice is parallel to the line from the Sun to the planet in that slice, and the velocity — the line from the origin $O$ to $P$ — is perpendicular to the direction of the orbit there. Draw the **perpendicular bisector** of $OP$ and let it meet the radius $CP$ at $Q$. Since $Q$ is on the bisector, $QO = QP$, so

$$CQ + QO = CQ + QP = CP = u \\quad (\\text{the same for every } P).$$

A point whose distances from two fixed points $C$ and $O$ add up to a constant lies on an **ellipse** with foci $C$ and $O$. The bisector is also tangent to that ellipse at $Q$ (the reflecting property of the ellipse). So as $P$ goes round the circle, $Q$ traces an ellipse which, at every angle seen from $C$, runs in the same direction as the orbit at the same angle seen from the Sun. Two curves that have the same direction at every angle around their centres have the same shape: **the orbit is an ellipse, with the Sun at a focus.**

| Orbit | Earth | Halley's comet |
|---|---|---|
| fastest speed | 30.29 km/s | 54.5 km/s |
| slowest speed | 29.29 km/s | 0.91 km/s |
| radius of the velocity circle | 29.79 km/s | 27.7 km/s |
| eccentricity | 0.017 | 0.967 |

For the Earth the origin of the velocity diagram is only 0.5 km/s off-centre; for Halley's comet it lies almost on the circle. If the origin were exactly on the circle the orbit would be a parabola; outside it, a hyperbola.

> [!key] With equal angles instead of equal times, an inverse-square pull gives equal velocity changes, so the velocity diagram is a circle. Turn it by 90° and fold it with perpendicular bisectors: an ellipse appears, with the Sun at a focus.
`,
  ideas: [
    'Cut the orbit into equal angles seen from the Sun: the time in each slice is proportional to r² (equal areas).',
    'The inverse-square force times that time is the same for every slice: equal changes of velocity, turning by equal angles.',
    'Drawn from one point, the velocity vectors end on a circle — the hodograph of a Kepler orbit.',
    'The offset of the origin from the circle\'s centre, divided by the radius, is the eccentricity; v_max = u(1 + e), v_min = u(1 − e).',
    'Turning the circle by 90° and folding it with perpendicular bisectors produces an ellipse with the Sun at a focus.'
  ],
  pitfalls: [
    'The proof needs equal times, as in Kepler\'s second law — Feynman\'s trick is equal angles; equal areas enter only to say that the time in a slice grows as r².',
    'The velocity vectors of an elliptical orbit trace an ellipse — Their tips trace a circle; only its centre is displaced from the origin.',
    'Any attractive force would give an ellipse by the same argument — The cancellation of r² in step 2 works only for the inverse square; another law gives unequal velocity steps and orbits that do not close.'
  ],
  formulas: [
    {
      name: 'Radius of the velocity circle', expr: 'u = G*M/(rp*vp)', tex: 'u = \\dfrac{G M}{r_p v_p}',
      vars: {
        u: { name: 'radius of the velocity circle', q: 'speed', unit: 'km/s' },
        G: { const: 'G' },
        M: { name: 'mass of the Sun', q: 'mass', unit: 'M☉', value: 1 },
        rp: { name: 'distance at perihelion', q: 'length', unit: 'AU', value: 0.9833, tex: 'r_p' },
        vp: { name: 'speed at perihelion', q: 'speed', unit: 'km/s', value: 30.29, tex: 'v_p' }
      },
      note: 'r_p v_p is the angular momentum per unit mass (twice the rate of sweeping area), the same at every point of the orbit.',
      stories: { u: 'The Earth passes perihelion at {rp} moving at {vp}. What is the radius of its velocity circle?' }
    },
    {
      name: 'Eccentricity from the fastest and slowest speeds', expr: 'ecc = (vmax - vmin)/(vmax + vmin)', tex: 'e = \\dfrac{v_{\\max} - v_{\\min}}{v_{\\max} + v_{\\min}}',
      vars: {
        ecc: { name: 'eccentricity of the orbit', tex: 'e' },
        vmax: { name: 'fastest speed (perihelion)', q: 'speed', unit: 'km/s', value: 30.29, tex: 'v_{\\max}' },
        vmin: { name: 'slowest speed (aphelion)', q: 'speed', unit: 'km/s', value: 29.29, tex: 'v_{\\min}' }
      },
      note: 'The fastest and slowest speeds are the farthest and nearest points of the velocity circle from its origin.',
      stories: { ecc: 'A comet moves at {vmax} at its nearest point and {vmin} at its farthest. What is the eccentricity of its orbit?' }
    },
    {
      name: 'Radius of the velocity circle from the extreme speeds', expr: 'u = (vmax + vmin)/2', tex: 'u = \\dfrac{v_{\\max} + v_{\\min}}{2}',
      vars: {
        u: { name: 'radius of the velocity circle', q: 'speed', unit: 'km/s' },
        vmax: { name: 'fastest speed', q: 'speed', unit: 'km/s', value: 30.29, tex: 'v_{\\max}' },
        vmin: { name: 'slowest speed', q: 'speed', unit: 'km/s', value: 29.29, tex: 'v_{\\min}' }
      },
      stories: { u: 'A planet\'s speed ranges from {vmin} to {vmax}. What is the radius of its velocity circle?' }
    },
    {
      name: 'Time to sweep an equal angle', expr: 'dt = r^2*dth/(rp*vp)', tex: '\\Delta t = \\dfrac{r^2\\,\\Delta\\theta}{r_p v_p}',
      vars: {
        dt: { name: 'time to sweep the angle', q: 'time', unit: 'day', tex: '\\Delta t' },
        r: { name: 'distance from the Sun', q: 'length', unit: 'AU', value: 1.0167 },
        dth: { name: 'angle swept (seen from the Sun)', q: 'angle', unit: '°', value: 1, tex: '\\Delta\\theta' },
        rp: { name: 'distance at perihelion', q: 'length', unit: 'AU', value: 0.9833, tex: 'r_p' },
        vp: { name: 'speed at perihelion', q: 'speed', unit: 'km/s', value: 30.29, tex: 'v_p' }
      },
      note: 'The time grows as r²; multiplied by a pull that falls as 1/r², it gives the same velocity change for every equal angle.',
      stories: { dt: 'How long does the Earth take to move {dth} round the Sun when it is {r} away (perihelion {rp} at {vp})?' }
    }
  ],
  examples: [
    {
      title: 'The Earth\'s velocity circle',
      q: 'The Earth\'s speed ranges from 29.29 km/s (July) to 30.29 km/s (January). Find the radius of its velocity circle, the eccentricity, and how far the origin of the velocity diagram is from the centre.',
      steps: [
        '$u = (30.29 + 29.29)/2 = 29.79$ km/s.',
        '$e = (30.29 - 29.29)/(30.29 + 29.29) = 1.00/59.58 = 0.0168$.',
        'Offset $= eu = 0.50$ km/s: the velocity diagram is a circle almost centred on its origin, because the orbit is nearly circular. Check: $u = GM/(r_pv_p) = 1.327\\times10^{20}/(1.471\\times10^{11} \\times 30\\,290) = 29.8$ km/s.'
      ],
      a: 'u = 29.8 km/s, e = 0.017, offset 0.5 km/s.'
    },
    {
      title: 'Halley\'s comet',
      q: 'Halley\'s comet moves at 54.5 km/s at perihelion and 0.91 km/s at aphelion. Draw its velocity circle in words.',
      steps: [
        '$u = (54.5 + 0.91)/2 = 27.7$ km/s and $e = (54.5 - 0.91)/(54.5 + 0.91) = 0.967$.',
        'The origin sits $eu = 26.8$ km/s from the centre — just 0.9 km/s inside the circle.',
        'Most velocity vectors are short and nearly all point one way; only near perihelion, which the comet passes in a few weeks, does the velocity swing quickly round the whole circle.'
      ],
      a: 'A circle of radius 27.7 km/s with its origin almost on the rim: e = 0.967.'
    },
    {
      title: 'Equal angles, unequal times',
      q: 'How long does the Earth take to move 1° round the Sun at perihelion (0.9833 AU) and at aphelion (1.0167 AU)?',
      steps: [
        '$\\Delta t = r^2\\Delta\\theta/(r_pv_p)$ with $\\Delta\\theta = 0.017453$ rad and $r_pv_p = 1.471\\times10^{11} \\times 30\\,290 = 4.456\\times10^{15}$ m²/s.',
        'Perihelion: $(1.471\\times10^{11})^2 \\times 0.017453/4.456\\times10^{15} = 84\\,760$ s = 0.981 day.',
        'Aphelion: $(1.521\\times10^{11})^2 \\times 0.017453/4.456\\times10^{15} = 90\\,620$ s = 1.049 days. Times in the ratio $(1.0167/0.9833)^2 = 1.069$, and the Sun\'s pull in the inverse ratio: the velocity change per degree is the same.'
      ],
      a: '0.98 day at perihelion, 1.05 days at aphelion.'
    }
  ],
  quiz: [
    { q: 'In Feynman\'s proof, the orbit is divided into pieces that are equal in…', choices: ['the angle seen from the Sun', 'time', 'length along the orbit', 'area'], a: 0, why: 'Equal angles make the velocity changes equal; equal times (Newton\'s choice) give equal areas instead.' },
    { q: 'Why is the change of velocity the same for each equal-angle piece?', choices: ['the time spent grows as r² while the force falls as 1/r²', 'the force is the same everywhere', 'the speed is constant', 'the pieces have equal areas'], a: 0, why: 'Change of velocity = force × time / mass ∝ (1/r²)(r²): the inverse square is used exactly here.' },
    { q: 'Drawn from a common origin, the velocity vectors of a planet on an ellipse end on…', choices: ['a circle', 'an ellipse of the same shape', 'a straight line', 'a parabola'], a: 0, why: 'Equal steps turning by equal angles make a regular polygon, a circle in the limit: the hodograph.' },
    { q: 'For an elliptical orbit, the origin of the velocity diagram is at the centre of the velocity circle.', a: false, why: 'Only for a circular orbit. For an ellipse it is displaced by e times the radius; the displacement sets the fastest and slowest speeds.' },
    { q: 'A comet\'s speed ranges from 10 km/s to 40 km/s. What is the eccentricity of its orbit?', answer: 0.6, unit: '', why: 'e = (40 − 10)/(40 + 10) = 0.6.' }
  ],
  problems: [
    { q: 'A planet 2 AU from its star takes how many times longer to sweep 1° than when it is 1 AU away (on the same orbit)?', answer: 4, unit: '', tol: 0.01, hint: 'Δt ∝ r².',
      steps: ['$\\Delta t \\propto r^2$: $(2/1)^2 = 4$.', 'The pull is 4 times weaker there, so the change of velocity per degree is the same — the heart of the proof.'] },
    { q: 'An asteroid\'s speed is 25 km/s at perihelion and 15 km/s at aphelion. What is the radius of its velocity circle, and by how much (km/s) is the origin of the velocity diagram displaced from the centre?', answer: 5, unit: 'km/s', tol: 0.01, hint: 'u = (v_max + v_min)/2; offset = (v_max − v_min)/2.',
      steps: ['$u = (25 + 15)/2 = 20$ km/s.', 'Offset $= eu = (25 - 15)/2 = 5$ km/s (so $e = 0.25$).'] }
  ],
  applications: [
    'The velocity-circle picture gives quick answers in orbital mechanics: the speed change needed to go from one orbit to another is the distance between points on two circles.',
    'The same equal-angle reasoning, with a different force law, shows why orbits in non-inverse-square fields (inside a galaxy, near a black hole) do not close and slowly precess.',
    'Feynman\'s proof is a favourite in teaching because it uses only similar triangles, circles and the definition of an ellipse.'
  ],
  history: 'Newton gave the first proof that an inverse-square force produces conic-section orbits in the *Principia* (1687). William Rowan Hamilton introduced the velocity diagram, which he called the hodograph, in the 1840s and showed that for such orbits it is a circle. Feynman devised his own elementary proof for a lecture at Caltech in March 1964; David and Judith Goodstein reconstructed it from his notes and published *Feynman\'s Lost Lecture: The Motion of Planets Around the Sun* in 1996.',
  sources: [
    '*Feynman\'s Lost Lecture: The Motion of Planets Around the Sun* (David L. Goodstein and Judith R. Goodstein, 1996) — the lecture of March 1964, reconstructed: equal areas, equal angles, the velocity circle and the construction of the ellipse.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 7 (The Theory of Gravitation) — Kepler\'s laws and Newton\'s explanation.'
  ],
  sim: 'mot-hodograph'
},

{
  id: 'gravity-vs-electricity', parent: 'gravitation-topic', title: 'Gravity and electricity: a factor of 10⁴²', level: 1,
  short: 'Between two electrons, the electrical repulsion is 4 × 10⁴² times the gravitational attraction — at any distance. Gravity rules the heavens only because electric charges come in two kinds that cancel, while mass only adds.',
  keywords: ['gravity', 'electric force', 'Coulomb', 'ratio of forces', '10^42', 'protons', 'electrons', 'neutral matter', 'charge cancellation', 'weakness of gravity', 'Dirac', 'large numbers'],
  prereq: ['theory-of-gravitation', 'physics:coulombs-law', 'math:scientific-notation'],
  related: ['em-introduction', 'characteristics-of-force', 'atomic-hypothesis', 'curved-space', 'physics:fundamental-forces', 'physics:newtons-law-of-gravitation'],
  body: `
Gravity holds planets in their orbits and galaxies together, so it is tempting to think of it as a strong force. Feynman liked to turn that impression upside down with a single number.

### Two electrons, two protons
Two electrons repel electrically with $F_e = ke^2/r^2$ and attract gravitationally with $F_g = Gm_e^2/r^2$. Both fall as the inverse square of the distance, so their ratio does not depend on how far apart the electrons are:

$$\\frac{F_e}{F_g} = \\frac{ke^2}{Gm_e^2} = \\frac{8.99\\times10^{9} \\times (1.602\\times10^{-19})^2}{6.674\\times10^{-11} \\times (9.109\\times10^{-31})^2} = 4.17\\times10^{42}.$$

A one followed by forty-two zeros ([[?scientific-notation|a power of ten]] beyond imagining). For two protons, which are 1836 times heavier, the ratio is "only" $1.24\\times10^{36}$; inside a hydrogen atom, the electric pull of the proton on the electron beats their gravity by $2.3\\times10^{39}$. In the simulation, both forces are marked on one [[?logarithm|logarithmic]] scale: slide the distance and both marks move together, 36 or 42 powers of ten apart. Try magnifying the gravity arrow until it matches the electric one — it takes 36 steps of ×10 for protons.

### Then why does gravity rule the sky?
Because electricity cancels itself. Charges come in two kinds, positive and negative; like charges repel and unlike attract, so matter pulls in exactly as many of each as it can and ends up neutral to a fantastic precision. The huge forces are all there — they hold atoms, molecules and your body together — but from outside they balance. Mass has only one sign, and gravity only attracts, so it adds up relentlessly: a planet's gravity grows with its mass, while any net charge it picked up would be neutralised at once by attracting the opposite kind.

### Two people at arm's length
Feynman opened the second volume of his lectures with an estimate that makes the point vivid. Suppose two people stand at arm's length and each has 1 % more electrons than protons. A 70 kg person contains about $2\\times10^{28}$ protons, so 1 % extra electrons is a charge of about $4\\times10^{7}$ coulombs. At half a metre the repulsion is about $5\\times10^{25}$ N — comparable to the *weight of the entire Earth* ($M_\\oplus g = 5.9\\times10^{25}$ N). Their gravitational attraction at that distance, meanwhile, is about one micronewton. It would take an excess of only about one electron in $10^{18}$ to cancel it.

| Force between… | Electric | Gravitational | Ratio |
|---|---|---|---|
| two electrons | $ke^2/r^2$ | $Gm_e^2/r^2$ | $4.17\\times10^{42}$ |
| two protons | $ke^2/r^2$ | $Gm_p^2/r^2$ | $1.24\\times10^{36}$ |
| proton and electron (hydrogen) | $8.2\\times10^{-8}$ N | $3.6\\times10^{-47}$ N | $2.3\\times10^{39}$ |
| two 70 kg people, 1 % extra electrons, 0.5 m | $\\approx 5\\times10^{25}$ N | $\\approx 1.3\\times10^{-6}$ N | $\\sim 10^{31}$ |

### How heavy would a charged particle have to be?
Gravity would match the electric repulsion between two particles each carrying one elementary charge if each had a mass of $e/\\sqrt{G/k} = 1.86\\times10^{-9}$ kg — about two micrograms, or $10^{18}$ proton masses. Particles are nowhere near that heavy, which is another way of saying that gravity is negligible in atomic physics.

### A number that begs for an explanation
Physicists distrust unexplained huge numbers. Paul Dirac noticed in 1937 that the age of the universe, measured in the time light takes to cross a proton, is also an enormous number of roughly the same size, and wondered whether $G$ might be weakening as the universe ages. Feynman discussed this kind of speculation in his lecture on gravitation. Measurements — for example, laser ranging to the Moon over decades — have found no change in $G$ to high precision. Why gravity is so weak remains one of the open questions of physics.

> [!key] At every distance, electricity between two electrons is 4 × 10⁴² times stronger than gravity. Gravity dominates the large-scale universe only because positive and negative charges cancel almost perfectly, while mass only adds.
`,
  ideas: [
    'For two electrons the electric force is 4.17 × 10⁴² times the gravitational force; for two protons 1.24 × 10³⁶.',
    'Both forces fall as 1/r², so the ratio is the same at every distance.',
    'Charges come in two kinds that cancel; matter is almost perfectly neutral, so electric forces balance from outside.',
    'Mass has one sign and gravity only attracts, so it adds up — and dominates planets, stars and galaxies.',
    'A 1 % imbalance of charge between two people at arm\'s length would give a force comparable to the weight of the Earth.'
  ],
  pitfalls: [
    'Gravity is the strongest force because it holds planets and stars together — Particle for particle it is the weakest by far; it wins on large scales only because it never cancels.',
    'At large distances gravity becomes stronger than electricity — Both fall as 1/r²; the ratio never changes with distance. What changes is that large bodies are electrically neutral.',
    'Everyday objects contain little electric charge — They contain enormous amounts of both signs (about 4 × 10⁹ C of each in a person); what is small is the imbalance.'
  ],
  formulas: [
    {
      name: 'Electric over gravitational force for two particles', expr: 'rat = ke*q1*q2/(G*m1*m2)', tex: '\\mathcal{R} = \\dfrac{k\\,q_1 q_2}{G\\,m_1 m_2}',
      vars: {
        rat: { name: 'electric force ÷ gravitational force', tex: '\\mathcal{R}' },
        ke: { const: 'ke' },
        q1: { name: 'charge of particle 1', q: 'charge', unit: 'e', value: 1 },
        q2: { name: 'charge of particle 2', q: 'charge', unit: 'e', value: 1 },
        G: { const: 'G' },
        m1: { name: 'mass of particle 1', q: 'mass', unit: 'u', value: 1.00728 },
        m2: { name: 'mass of particle 2', q: 'mass', unit: 'u', value: 1.00728 }
      },
      note: 'Independent of the distance, since both forces fall as 1/r². Two protons: 1.24 × 10³⁶; two electrons (5.486 × 10⁻⁴ u): 4.17 × 10⁴².',
      stories: { rat: 'Two particles with charges {q1} and {q2} and masses {m1} and {m2} sit some distance apart. How many times stronger is their electric force than their gravity?' }
    },
    {
      name: 'Coulomb\'s law', expr: 'F = ke*q1*q2/r^2', tex: 'F = \\dfrac{k\\,q_1 q_2}{r^2}',
      vars: {
        F: { name: 'electric force', q: 'force', unit: 'N' },
        ke: { const: 'ke' },
        q1: { name: 'first charge', q: 'charge', unit: 'C', value: 3.7e7 },
        q2: { name: 'second charge', q: 'charge', unit: 'C', value: 3.7e7 },
        r: { name: 'distance', q: 'length', unit: 'm', value: 0.5 }
      },
      stories: { F: 'Two people each carry an excess charge of {q1} and stand {r} apart. How hard do they push each other apart?', q1: 'What equal charges, {r} apart, repel each other with {F}?' }
    },
    {
      name: 'Charge that would cancel the gravity between two equal bodies', expr: 'q = m*sqrt(G/ke)', tex: 'q = m\\sqrt{\\dfrac{G}{k}}',
      vars: {
        q: { name: 'excess charge on each body', q: 'charge', unit: 'nC' },
        m: { name: 'mass of each body', q: 'mass', unit: 'kg', value: 70 },
        G: { const: 'G' },
        ke: { const: 'ke' }
      },
      note: '8.6 × 10⁻¹¹ C per kilogram. For a 70 kg person that is 6 nC — about 4 × 10¹⁰ extra electrons among some 2 × 10²⁸.',
      stories: { q: 'Two bodies of {m} each: what equal charge on each would make their electric repulsion cancel their gravity?', m: 'Two equal bodies each carry {q}. How massive must they be for gravity to balance the repulsion?' }
    }
  ],
  examples: [
    {
      title: 'Two protons',
      q: 'Compare the electric and gravitational forces between two protons.',
      steps: [
        '$ke^2 = 8.988\\times10^9 \\times (1.602\\times10^{-19})^2 = 2.307\\times10^{-28}$ N m².',
        '$Gm_p^2 = 6.674\\times10^{-11} \\times (1.673\\times10^{-27})^2 = 1.867\\times10^{-64}$ N m².',
        'Ratio $= 2.307\\times10^{-28}/1.867\\times10^{-64} = 1.24\\times10^{36}$, whatever the distance.'
      ],
      a: 'The repulsion is 1.24 × 10³⁶ times stronger than the attraction.'
    },
    {
      title: 'Two people with a 1 % charge imbalance',
      q: 'Two 70 kg people stand 0.5 m apart, each with 1 % more electrons than protons. Estimate the repulsion and compare it with the weight of the Earth, $M_\\oplus g$.',
      steps: [
        'A body is mostly water, in which 10 of every 18 nucleons are protons: about 55 % of the mass is protons, $0.55 \\times 70/1.673\\times10^{-27} = 2.3\\times10^{28}$ protons.',
        '1 % extra electrons: $2.3\\times10^{26} \\times 1.602\\times10^{-19} = 3.7\\times10^{7}$ C.',
        '$F = 8.99\\times10^9 \\times (3.7\\times10^7)^2/0.5^2 = 4.9\\times10^{25}$ N, against $M_\\oplus g = 5.97\\times10^{24} \\times 9.81 = 5.9\\times10^{25}$ N.'
      ],
      a: 'About 5 × 10²⁵ N — comparable to the weight of the whole Earth.'
    },
    {
      title: 'The hydrogen atom',
      q: 'In a hydrogen atom the electron is about $a_0 = 5.29\\times10^{-11}$ m from the proton. Find both forces.',
      steps: [
        '$F_e = ke^2/a_0^2 = 2.307\\times10^{-28}/(5.29\\times10^{-11})^2 = 8.24\\times10^{-8}$ N.',
        '$F_g = Gm_pm_e/a_0^2 = 6.674\\times10^{-11} \\times 1.673\\times10^{-27} \\times 9.109\\times10^{-31}/2.80\\times10^{-21} = 3.63\\times10^{-47}$ N.',
        'Ratio $2.3\\times10^{39}$: atomic physics can ignore gravity completely.'
      ],
      a: '8.2 × 10⁻⁸ N against 3.6 × 10⁻⁴⁷ N.'
    }
  ],
  quiz: [
    { q: 'Two protons are moved ten times farther apart. The ratio of their electric repulsion to their gravitational attraction…', choices: ['stays the same', 'grows 100 times', 'falls 100 times', 'grows 10 times'], a: 0, why: 'Both forces fall as 1/r², so their ratio does not depend on distance.' },
    { q: 'Gravity dominates the motion of planets and stars because…', choices: ['positive and negative charges cancel, while mass only adds', 'gravity is stronger than electricity at large distances', 'planets carry no electrons', 'electric forces do not reach that far'], a: 0, why: 'Electric forces are enormous but balanced in neutral matter; gravity has one sign and accumulates.' },
    { q: 'For which pair is the ratio of electric to gravitational force largest?', choices: ['two electrons', 'two protons', 'a proton and an electron', 'it is the same for all'], a: 0, why: 'The electrons are the lightest, so their gravity is weakest: 4.17 × 10⁴².' },
    { q: 'Everyday objects contain very little electric charge of either sign.', a: false, why: 'A person contains some 4 × 10⁹ C of positive charge and as much negative; what is tiny is the difference.' },
    { q: 'Two 1 kg masses are 1 m apart. What equal charge (in picocoulombs) on each would make their electric repulsion equal to their gravitational attraction?', answer: 86, unit: 'pC', why: 'q = m√(G/k) = √(6.674 × 10⁻¹¹/8.988 × 10⁹) = 8.6 × 10⁻¹¹ C = 86 pC.' }
  ],
  problems: [
    { q: 'Find the ratio of electric to gravitational force between an electron and a proton.', answer: 2.27e39, unit: '', tol: 0.02, hint: 'ke²/(G m_p m_e).',
      steps: ['$ke^2 = 2.307\\times10^{-28}$; $Gm_pm_e = 6.674\\times10^{-11} \\times 1.673\\times10^{-27} \\times 9.109\\times10^{-31} = 1.017\\times10^{-67}$.', 'Ratio $= 2.27\\times10^{39}$.'] },
    { q: 'Two 1000 kg spheres are 1 m apart. How much equal charge (in µC) on each would cancel their gravitational attraction?', answer: 0.0862, unit: 'µC', tol: 0.02, hint: 'q = m√(G/k).',
      steps: ['$\\sqrt{G/k} = 8.62\\times10^{-11}$ C/kg.', '$q = 1000 \\times 8.62\\times10^{-11} = 8.62\\times10^{-8}$ C = 0.0862 µC — a charge a rubbed balloon easily carries.'] }
  ],
  applications: [
    'Laboratory measurements of G are notoriously hard: stray electric charges and magnetic effects must be removed from the test masses, since the tiniest imbalance swamps gravity.',
    'Chemistry, biology and materials science are electrical through and through; gravity only matters for them through the weight of large objects.',
    'The weakness of gravity is one of the puzzles that theories beyond the Standard Model (extra dimensions, quantum gravity) try to explain.'
  ],
  history: 'Charles-Augustin de Coulomb established the inverse-square law of electric force with a torsion balance in 1785; Henry Cavendish used a similar balance for gravity in 1798. Paul Dirac proposed his "large numbers hypothesis", linking such huge ratios to the age of the universe, in 1937.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 7 (The Theory of Gravitation) — the ratio of electrical to gravitational forces between two electrons, 4.17 × 10⁴², and speculation about where such a number might come from.',
    'Vol. II, ch. 1 (Electromagnetism) — the estimate for two people at arm\'s length with a one per cent excess of electrons, whose repulsion would be comparable to the weight of the whole Earth.'
  ],
  sim: 'mot-grav-elec'
}

);
