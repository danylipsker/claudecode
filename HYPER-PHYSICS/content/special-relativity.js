/* HYPER-PHYSICS · content/special-relativity.js — uniform motion and the speed of light:
 * the postulates, time and length, simultaneity, the Lorentz transformation, momentum and
 * energy, the Doppler effect for light, spacetime and the twin paradox. */
Hyper.add(

{
  id: 'relativity-postulates', parent: 'special-relativity', title: 'The postulates of special relativity', level: 1,
  short: 'Two starting assumptions — physics is the same for every steadily moving observer, and all of them measure the same speed of light — from which the whole of special relativity follows.',
  keywords: ['special relativity', 'postulates', 'Einstein', 'inertial frame', 'speed of light', 'Michelson–Morley', 'aether', 'ether', 'principle of relativity', 'invariance of c', '1905'],
  prereq: ['relative-velocity', 'electromagnetic-waves', 'newtons-first-law'],
  related: ['maxwells-equations', 'time-dilation', 'simultaneity', 'lorentz-transformation'],
  body: `
Close the blinds on a smoothly running train and try to find out how fast you are going. Drop a coin, pour a coffee, swing a key on a string: everything behaves exactly as it does on the platform. Only *changes* of velocity show up — you lurch when the train brakes. Galileo noticed the same thing below decks on a ship, and it became the **principle of relativity**: the laws of motion are the same in every **inertial frame**, that is, every laboratory moving at constant velocity without accelerating or rotating. No experiment picks out one of them as "really at rest".

### The trouble with light
In the 1860s Maxwell's equations of electromagnetism predicted waves travelling at

$$c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = 299\\,792\\,458\\ \\mathrm{m/s}$$

and these [[electromagnetic-waves|electromagnetic waves]] turned out to be light. But a speed has to be *relative to something*. Physicists assumed an invisible medium, the "aether", and expected light to go faster or slower depending on how the Earth moves through it — just as the speed of sound you measure changes when you move through the air.

In 1887 Albert Michelson and Edward Morley split a beam of light, sent the two halves along perpendicular arms (folded by mirrors to an effective 11 m) and recombined them. Earth's orbital speed of 30 km/s should have shifted the interference fringes by about 0.4 of a fringe when the apparatus was turned through 90°. They saw almost nothing — at most a small fraction of that. Modern versions with lasers and optical cavities give the same answer to better than one part in $10^{17}$: the speed of light does not depend on the direction or the motion of the laboratory.

### Einstein's two postulates (1905)
Instead of patching the aether, Einstein took the experiments at their word:

1. **Relativity:** the laws of physics — mechanics, electromagnetism, everything — take the same form in every inertial frame.
2. **Constancy of the speed of light:** light in vacuum travels at $c$ in every inertial frame, whatever the motion of its source or of the observer.

Each sounds harmless. Together they are explosive. If you chase a light beam at half the speed of light, you still measure it passing you at $c$, not $c/2$. That is impossible with Newton's absolute space and time, so something about how we measure **time and distance** has to give. Following the postulates carefully leads to [[time-dilation|moving clocks running slow]], [[length-contraction|moving objects shortening]], [[simultaneity|disagreement about what happens "at the same time"]] and [[mass-energy|$E = mc^2$]].

> [!key] Special relativity does not say "everything is relative". It says the *laws* are the same for everyone, and it makes one thing absolute: the speed of light. What becomes relative are the time and the distance between two events.

### A speed limit
One consequence is that nothing that carries energy or information can be pushed past $c$: bringing a massive object towards $c$ takes more and more energy, without limit. Since 1983 the metre has been *defined* through light: $c$ is exactly 299 792 458 m/s, and a metre is the distance light covers in 1/299 792 458 of a second.
`,
  ideas: [
    'An inertial frame moves at constant velocity; no experiment inside it reveals that speed.',
    'Postulate 1: the laws of physics are the same in every inertial frame.',
    'Postulate 2: every inertial observer measures the same speed of light in vacuum, c = 299 792 458 m/s.',
    'Together the postulates force time intervals and lengths to depend on the observer.',
    'Nothing that carries energy or information travels faster than c.'
  ],
  pitfalls: [
    'Relativity means everything is relative — The laws of physics and the speed of light are the same for everyone; only time intervals, lengths and simultaneity differ between frames.',
    'Light slows down in glass, so c is not constant — The postulate is about light in vacuum. In glass the wave interacts with the material and moves at c/n, a property of the glass, not of the observer.',
    'Michelson and Morley simply failed to detect a small effect — Their apparatus could have seen a shift forty times smaller than the one predicted; the null result was clear, and has been confirmed ever more precisely since.'
  ],
  formulas: [
    {
      name: 'Fringe shift expected in the Michelson–Morley experiment',
      expr: 'N = 2*L*v^2/(lam*c^2)', tex: '\\Delta N = \\frac{2 L v^2}{\\lambda c^2}',
      vars: {
        N: { name: 'fringe shift on turning the apparatus through 90°', tex: '\\Delta N' },
        L: { name: 'effective arm length', q: 'length', unit: 'm', value: 11 },
        v: { name: 'speed of the Earth through the supposed aether', q: 'speed', unit: 'km/s', value: 30 },
        lam: { name: 'wavelength of the light', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        c: { const: 'c' }
      },
      note: 'The aether prediction, to lowest order in $v/c$. The observed shift was zero within the precision of the experiment.',
      stories: {
        N: 'An interferometer has arms of effective length {L} and uses light of wavelength {lam}. If the Earth moved through an aether at {v}, how many fringes should the pattern shift when the instrument is turned through 90°?',
        v: 'An interferometer with {L} arms and light of wavelength {lam} can detect a shift of {N} fringes. What is the smallest aether speed it could reveal?'
      }
    }
  ],
  examples: [
    {
      title: 'What Michelson and Morley expected',
      q: 'With arms of effective length 11 m, light of wavelength 550 nm and an aether wind of 30 km/s, what fringe shift should appear when the apparatus is rotated by 90°?',
      steps: [
        'On the aether picture, the round trip along the arm parallel to the wind takes longer than the one across it by about $L v^2/c^3$.',
        'Rotating by 90° swaps the arms, doubling the change: a path difference of $2Lv^2/c^2$.',
        '$\\Delta N = \\dfrac{2 L v^2}{\\lambda c^2} = \\dfrac{2 \\times 11 \\times (3\\times10^4)^2}{550\\times10^{-9} \\times (3.00\\times10^8)^2} = 0.40$ fringe.',
        'They could have seen about a hundredth of a fringe, and saw essentially nothing.'
      ],
      a: 'About 0.4 fringe expected; essentially none observed.'
    },
    {
      title: 'Chasing a light beam',
      q: 'A spaceship flies towards a distant beacon at $0.5c$, and the beacon sends a light pulse towards the ship. What speed does the crew measure for the pulse, according to Newton and according to the postulates?',
      steps: [
        'Newton adds speeds: the pulse approaches the crew at $c + 0.5c = 1.5c$.',
        'The second postulate says every inertial observer measures $c$ for light in vacuum, so the crew measures exactly $c$.',
        'Experiments side with the postulate. The Newtonian rule for adding speeds must therefore fail near $c$ — see [[velocity-addition|relativistic velocity addition]].'
      ],
      a: 'Newton: 1.5c. Reality: c.'
    }
  ],
  quiz: [
    { q: 'You are in a windowless carriage moving smoothly in a straight line. Which experiment could tell you its speed?', choices: ['Timing a dropped coin', 'Measuring the period of a pendulum', 'Measuring the speed of light across the carriage', 'None of them'], a: 3,
      why: 'That is the principle of relativity: all the laws of physics, including those of light, are the same in every inertial frame, so every experiment gives the same result as on the platform.' },
    { q: 'A spaceship moving towards you at $0.6c$ fires a laser pulse at you. At what speed does the pulse reach you?', choices: ['$0.4c$', '$c$', '$1.6c$', '$0.6c$'], a: 1,
      why: 'The speed of light does not depend on the motion of its source: you measure $c$.' },
    { q: 'Michelson and Morley found that light travels faster along the direction of the Earth\'s motion than across it.', a: false,
      why: 'They found no difference at all — the famous null result that the aether theory could not explain.' },
    { q: 'Which of these is NOT the same for all inertial observers?', choices: ['The speed of light in vacuum', 'The laws of electromagnetism', 'The time between two events at different places', 'The charge of an electron'], a: 2,
      why: 'Time intervals (and lengths) depend on the observer. The laws, c and the fundamental constants do not.' }
  ],
  applications: [
    'Satellite navigation, which turns signal travel times into distances using a fixed value of c.',
    'The SI definition of the metre (1983), built on an exact speed of light.',
    'Every particle accelerator, designed on the fact that nothing outruns light.'
  ],
  history: 'Lorentz, FitzGerald and Poincaré had found much of the mathematics by 1904, but treated it as an effect of the aether on matter. Einstein\'s 1905 paper "On the Electrodynamics of Moving Bodies" dropped the aether altogether and derived everything from the two postulates.'
},

{
  id: 'time-dilation', parent: 'special-relativity', title: 'Time dilation', level: 2,
  short: 'A clock moving past you ticks more slowly than your own, by the Lorentz factor γ — a direct consequence of everyone measuring the same speed of light.',
  keywords: ['time dilation', 'Lorentz factor', 'gamma', 'proper time', 'light clock', 'muon', 'moving clocks run slow', 'Hafele–Keating', 'GPS'],
  prereq: ['relativity-postulates', 'speed-velocity', 'math:pythagorean-theorem'],
  related: ['length-contraction', 'twin-paradox', 'gravitational-time-dilation', 'spacetime-interval'],
  body: `
Build the simplest possible clock: two mirrors facing each other a distance $L$ apart, with a pulse of light bouncing between them. Each round trip is one tick, lasting $\\Delta\\tau = 2L/c$ for someone travelling with the clock.

Now let the clock move sideways past you at speed $v$. You see the pulse follow a **longer, diagonal path**: while it climbs from the lower mirror to the upper one, the mirrors move on. By the [[relativity-postulates|second postulate]] the pulse still moves at $c$ for you, so a longer path takes a longer time. For half a tick, [[math:pythagorean-theorem|Pythagoras]] gives

$$\\left(\\frac{c\\,\\Delta t}{2}\\right)^2 = L^2 + \\left(\\frac{v\\,\\Delta t}{2}\\right)^2 \\quad\\Rightarrow\\quad \\Delta t = \\frac{\\Delta\\tau}{\\sqrt{1 - v^2/c^2}} = \\gamma\\,\\Delta\\tau$$

The factor

$$\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}$$

is the **Lorentz factor**. It is 1 at rest, grows very slowly at first and shoots up close to $c$:

| $v/c$ | 0.1 | 0.5 | 0.8 | 0.9 | 0.99 | 0.999 |
|---|---|---|---|---|---|---|
| $\\gamma$ | 1.005 | 1.155 | 1.667 | 2.294 | 7.09 | 22.4 |

Nothing about the light clock is special. If a wristwatch or a heartbeat ran at a different rate from a light clock carried beside it, the two would drift apart and the passengers could detect their motion — breaking the first postulate. So **every** process in the moving frame, mechanical, chemical or biological, runs slow by $\\gamma$ as judged from a frame in which it moves.

### Proper time
The time between two events measured by a single clock present at both of them is the **proper time** $\\Delta\\tau$. It is the shortest time any inertial observer assigns to the pair; everyone who sees that clock move measures the longer $\\Delta t = \\gamma\\,\\Delta\\tau$.

### It really happens
- **Muons** made by cosmic rays about 15 km up live only 2.2 µs on average. Even at nearly $c$ that is enough for about 660 m, yet they reach the ground in large numbers: at $0.998c$ their clocks run about 16 times slow.
- **Particle accelerators** routinely keep unstable particles alive for dozens of times their lifetime at rest.
- **Atomic clocks** flown round the world on airliners (Hafele and Keating, 1971) and the clocks on **GPS satellites** drift by the predicted nanoseconds to microseconds. Uncorrected, GPS positions would wander by kilometres a day.

> [!warn] The effect is symmetric. You see the passenger's clock run slow, and the passenger sees yours run slow. There is no contradiction, because comparing clocks at different places depends on [[simultaneity|what each observer calls "the same time"]]. The [[twin-paradox|twin paradox]] shows how the symmetry is broken when one clock turns round.
`,
  ideas: [
    'A clock moving at speed v ticks slow by the Lorentz factor γ = 1/√(1 − v²/c²).',
    'Proper time is measured by one clock present at both events; every other inertial observer measures a longer time.',
    'All processes slow together — clocks, chemistry, ageing — so nobody notices anything locally.',
    'The effect is minute at everyday speeds and enormous near c.',
    'Each of two observers in relative motion finds the other\'s clock running slow.'
  ],
  pitfalls: [
    'Time dilation is an optical illusion caused by light delays — The delays are subtracted out; what remains is real, as muons reaching the ground and returning atomic clocks show.',
    'The moving clock is damaged or slowed by its motion — Nothing acts on it. In its own frame it runs perfectly; the difference lies in how time compares between frames.',
    'Only one of two clocks in relative motion can really be slow — For steady relative motion the situation is symmetric. The question "whose clock is really slow?" has no answer until the clocks are brought back together.'
  ],
  derivation: {
    title: 'Derive time dilation from a light clock',
    steps: [
      { text: 'In the clock\'s own frame the light goes straight up and down between mirrors a distance $L$ apart. One tick (a round trip) lasts', tex: '\\Delta\\tau = \\frac{2L}{c}' },
      { text: 'In the lab the clock moves at $v$. During half a tick, $\\Delta t/2$, the light runs along the hypotenuse while the mirrors move $v\\,\\Delta t/2$ sideways. The height $L$ is the same in both frames, because lengths across the motion do not change:', tex: '\\left(\\frac{c\\,\\Delta t}{2}\\right)^2 = L^2 + \\left(\\frac{v\\,\\Delta t}{2}\\right)^2' },
      { text: 'Solve for $\\Delta t$:', tex: '\\Delta t^2\\,(c^2 - v^2) = 4L^2 \\;\\Rightarrow\\; \\Delta t = \\frac{2L}{\\sqrt{c^2 - v^2}}' },
      { text: 'Divide top and bottom by $c$ and use $\\Delta\\tau = 2L/c$:', tex: '\\Delta t = \\frac{2L/c}{\\sqrt{1 - v^2/c^2}} = \\gamma\\,\\Delta\\tau' }
    ]
  },
  formulas: [
    {
      name: 'Lorentz factor',
      expr: 'gam = 1/sqrt(1 - v^2/c^2)', tex: '\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}',
      vars: {
        gam: { name: 'Lorentz factor', tex: '\\gamma' },
        v: { name: 'relative speed', q: 'speed', unit: 'c', value: 0.8, min: 0, max: 0.9999 },
        c: { const: 'c' }
      },
      stories: {
        gam: 'A spacecraft passes Earth at {v}. What is its Lorentz factor?',
        v: 'How fast must a particle move for its clocks to run slow by a factor of {gam}?'
      }
    },
    {
      name: 'Time dilation',
      expr: 'dt = dtau/sqrt(1 - v^2/c^2)', tex: '\\Delta t = \\frac{\\Delta\\tau}{\\sqrt{1 - v^2/c^2}}',
      vars: {
        dt: { name: 'time measured by observers who see the clock move', q: 'time', unit: 'µs', tex: '\\Delta t' },
        dtau: { name: 'proper time, shown by the moving clock', q: 'time', unit: 'µs', value: 2.2, tex: '\\Delta\\tau' },
        v: { name: 'speed of the clock', q: 'speed', unit: 'c', value: 0.995, min: 0, max: 0.9999 },
        c: { const: 'c' }
      },
      stories: {
        dt: 'A muon lives {dtau} in its own frame and moves through the atmosphere at {v}. How long does it live, timed from the ground?',
        v: 'Unstable particles in a beam survive {dt} on the laboratory clocks, although at rest they live only {dtau}. How fast is the beam?',
        dtau: 'A clock moving at {v} is seen from the lab to take {dt} between two of its ticks. How much time passes on the moving clock between them?'
      }
    },
    {
      name: 'How far a moving clock falls behind (everyday speeds)',
      expr: 'dT = v^2/(2*c^2)*t', tex: '\\Delta T \\approx \\frac{v^2}{2c^2}\\, t',
      vars: {
        dT: { name: 'lag of the moving clock', q: 'time', unit: 'ns', tex: '\\Delta T' },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 250 },
        t: { name: 'duration of the trip', q: 'time', unit: 'h', value: 10 },
        c: { const: 'c' }
      },
      note: 'Valid for $v \\ll c$, using $\\gamma \\approx 1 + v^2/2c^2$ from the [[math:binomial-theorem|binomial expansion]]. Height changes clock rates too — see [[gravitational-time-dilation]].',
      stories: {
        dT: 'An airliner cruises at {v} for {t}. Ignoring gravity, by how much does a clock on board fall behind one on the ground?',
        v: 'After a {t} journey a travelling clock is {dT} behind. Ignoring gravity, what was its average speed?'
      }
    }
  ],
  examples: [
    {
      title: 'Muons reaching the ground',
      q: 'Muons are created 15 km above the ground and move straight down at $0.998c$. Their mean lifetime at rest is 2.2 µs, and the fraction surviving a time $t$ is $e^{-t/\\tau}$. What fraction would reach the ground without time dilation, and what fraction really does?',
      steps: [
        'Travel time in the Earth frame: $t = \\dfrac{15\\,000\\ \\mathrm{m}}{0.998 \\times 3.00\\times10^{8}\\ \\mathrm{m/s}} = 50.1\\ \\mu\\mathrm{s}$.',
        'Without time dilation: $e^{-50.1/2.2} = e^{-22.8} \\approx 1\\times10^{-10}$ — essentially none.',
        '$\\gamma = 1/\\sqrt{1 - 0.998^2} = 15.8$, so the muons\' own clocks record only $50.1/15.8 = 3.17\\ \\mu\\mathrm{s}$.',
        'Survivors: $e^{-3.17/2.2} = e^{-1.44} = 0.24$.'
      ],
      a: 'About 24% survive, instead of one in ten billion.'
    },
    {
      title: 'Half speed for clocks',
      q: 'At what speed does a moving clock tick at half the rate of yours?',
      steps: [
        'You need $\\gamma = 2$, so $1 - v^2/c^2 = 1/4$.',
        '$v = c\\sqrt{3/4} = 0.866c = 2.60\\times10^{8}\\ \\mathrm{m/s}$.'
      ],
      a: '0.866c'
    }
  ],
  quiz: [
    { q: 'A spaceship passes Earth at $0.6c$. By Earth\'s clocks, how long does one hour on the ship\'s clock take?', choices: ['0.8 h', '1 h', '1.25 h', '1.67 h'], a: 2,
      why: '$\\gamma = 1/\\sqrt{1 - 0.36} = 1.25$. The ship\'s clock shows proper time; Earth measures $\\gamma$ times longer.' },
    { q: 'The crew of that ship watches a clock on Earth. They find it running…', choices: ['fast, by a factor 1.25', 'slow, by a factor 1.25', 'at the same rate as theirs', 'slow only if Earth is "really" moving'], a: 1,
      why: 'The situation is symmetric: each observer finds the other\'s clock running slow by the same factor.' },
    { q: 'To make a moving clock run 10 times slow, it needs a speed of about…', choices: ['$0.9c$', '$0.95c$', '$0.995c$', '$0.99999c$'], a: 2,
      why: '$\\gamma = 10$ needs $1 - v^2/c^2 = 0.01$, so $v = \\sqrt{0.99}\\,c \\approx 0.995c$.' },
    { q: 'Time dilation is caused by the time light takes to travel from the moving clock to the observer.', a: false,
      why: 'Light-travel delays are real but are corrected for. The slowing that remains after correction is time dilation, and it is what lets muons reach the ground.' },
    { q: 'Which clock measures the proper time between the events "muon created" and "muon decays"?', choices: ['A clock on the ground', 'A clock carried along with the muon', 'A clock at the top of the atmosphere', 'Any clock: they all agree'], a: 1,
      why: 'Proper time is read on the one clock present at both events — the one travelling with the muon.' }
  ],
  applications: [
    'GPS satellite clocks are adjusted for their orbital speed (and for gravity) before launch.',
    'Unstable particles in accelerator beams and cosmic rays live far longer than at rest, which is why muons from space fill every detector on the ground.',
    'Atomic-clock comparisons now detect time dilation at the speed of a bicycle.'
  ],
  history: 'Joseph Larmor and Hendrik Lorentz met the factor γ in the equations of electromagnetism around 1900; Einstein showed in 1905 that it is a property of time itself. Bruno Rossi and David Hall first confirmed it with cosmic-ray muons in 1941.',
  sim: 'ra-light-clock'
},

{
  id: 'length-contraction', parent: 'special-relativity', title: 'Length contraction', level: 2,
  short: 'An object moving past you is shorter along its direction of motion, by the same factor γ that slows its clocks.',
  keywords: ['length contraction', 'Lorentz contraction', 'Lorentz–FitzGerald contraction', 'proper length', 'pole in the barn', 'ladder paradox', 'train in a tunnel', 'moving ruler'],
  prereq: ['time-dilation', 'relativity-postulates'],
  related: ['simultaneity', 'lorentz-transformation', 'spacetime-interval'],
  body: `
Go back to the muons of [[time-dilation|time dilation]], born 15 km up and racing to the ground at $0.998c$. From the ground we explain their survival by their slow clocks. But in the muon's own frame its clock is perfectly normal: it lives its 2.2 µs and still reaches the ground. The only consistent story is that, for the muon, the atmosphere rushing up at it is **not 15 km thick** but about 16 times thinner — under 1 km.

That is **length contraction**. An object whose length in its own rest frame is $L_0$ (its **proper length**) has, in a frame where it moves along its length at speed $v$, the length

$$L = \\frac{L_0}{\\gamma} = L_0\\sqrt{1 - v^2/c^2}$$

Only the dimension **along the motion** shrinks; heights and widths across the motion are unchanged. (If they shrank, two trains passing on parallel tracks could each claim to fit under the other's roof — a contradiction.)

| $v/c$ | 0.5 | 0.8 | 0.9 | 0.99 |
|---|---|---|---|---|
| $L/L_0$ | 0.87 | 0.60 | 0.44 | 0.14 |

### Measuring a moving length
To measure a moving rod you must mark the positions of its two ends **at the same moment**. But observers in relative motion disagree about what "the same moment" means ([[simultaneity|relativity of simultaneity]]). Each marks the ends simultaneously *by its own clocks*, so the two are really measuring different pairs of events, and they get different answers. Neither is an illusion.

### The train in the tunnel
A train 200 m long (proper length) races at $0.8c$ through a tunnel 150 m long. In the tunnel's frame the train is only $200 \\times 0.6 = 120$ m long and, for a moment, entirely inside — a guard could close both doors at once. In the train's frame the tunnel is only 90 m long, so the train can never fit. Both are right: the two door closings are simultaneous in the tunnel frame but not in the train frame, where the exit door closes (and opens again) *before* the entrance door closes. Watch both frames in the simulation.

### What it looks like
A photograph is not a measurement: light from the far side of a fast object set out earlier than light from the near side. Combining that with the contraction (worked out by James Terrell and Roger Penrose in 1959), a fast-moving sphere still *looks* round — it appears rotated rather than squashed. The contraction is real, but seeing it takes a measurement, not a snapshot.

> [!note] Gold nuclei in the Relativistic Heavy Ion Collider travel with $\\gamma \\approx 100$. In the laboratory they collide as discs a hundred times thinner than they are wide.
`,
  ideas: [
    'A moving object is shorter along its motion by the factor 1/γ; sizes across the motion are unchanged.',
    'Proper length is measured in the object\'s own rest frame and is the longest length any observer finds.',
    'Measuring a moving length means marking both ends at once — and "at once" depends on the frame.',
    'Length contraction and time dilation are two descriptions of the same muon: slow clock from the ground, thin atmosphere from the muon.'
  ],
  pitfalls: [
    'The object is squeezed by some force — No force acts. In its own frame nothing happens to it; the contraction is about how lengths compare between frames.',
    'A fast-moving ball would look flattened in a photograph — Light-travel delays distort the picture: a fast sphere appears rotated, not squashed. The contraction shows up in measurements.',
    'Everything about a moving object shrinks — Only its length along the direction of motion; a train at 0.9c is just as tall and wide as at rest.'
  ],
  formulas: [
    {
      name: 'Length contraction',
      expr: 'L = L0*sqrt(1 - v^2/c^2)', tex: 'L = L_0\\sqrt{1 - v^2/c^2}',
      vars: {
        L: { name: 'length measured while it moves past', q: 'length', unit: 'm' },
        L0: { name: 'proper length (in its own rest frame)', q: 'length', unit: 'm', value: 100 },
        v: { name: 'speed along its length', q: 'speed', unit: 'c', value: 0.8, min: 0, max: 0.9999 },
        c: { const: 'c' }
      },
      stories: {
        L: 'A spaceship {L0} long (as built) flies past a space station at {v}. How long is it according to the station\'s measurements?',
        v: 'A rod {L0} long at rest is measured to be {L} long as it flies past lengthways. How fast is it moving?',
        L0: 'A rocket moving at {v} is measured to be {L} long as it passes. How long is it at rest?'
      }
    },
    {
      name: 'Mean distance travelled before decaying (lab frame)',
      expr: 'd = v*tau/sqrt(1 - v^2/c^2)', tex: 'd = \\frac{v\\,\\tau}{\\sqrt{1 - v^2/c^2}}',
      vars: {
        d: { name: 'mean distance travelled in the lab', q: 'length', unit: 'km' },
        v: { name: 'speed of the particle', q: 'speed', unit: 'c', value: 0.998, min: 0, max: 0.9999 },
        tau: { name: 'mean lifetime at rest', q: 'time', unit: 'µs', value: 2.197, tex: '\\tau' },
        c: { const: 'c' }
      },
      note: 'Seen from the lab, the particle\'s clock runs slow ($\\gamma\\tau$); seen by the particle, the lab distance is contracted. Both give the same $d$.',
      stories: {
        d: 'A muon (mean lifetime {tau} at rest) moves at {v}. How far does it travel, on average, before decaying?',
        v: 'Particles with a mean lifetime of {tau} at rest travel {d} on average in the laboratory. How fast are they?'
      }
    }
  ],
  examples: [
    {
      title: 'The muon\'s point of view',
      q: 'A muon moving at $0.998c$ is created 15 km (ground measurement) above sea level. How thick is that layer of air in the muon\'s frame, and how long does the muon take to cross it by its own clock?',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.998^2} = 15.8$.',
        'Contracted thickness: $L = 15\\ \\mathrm{km}/15.8 = 0.949\\ \\mathrm{km}$.',
        'Time for the ground to arrive: $t = \\dfrac{949\\ \\mathrm{m}}{0.998 \\times 3.00\\times10^{8}\\ \\mathrm{m/s}} = 3.17\\ \\mu\\mathrm{s}$.',
        'This is exactly the proper time found from the ground using time dilation. The two frames tell different stories but agree on what the muon\'s clock reads when it lands.'
      ],
      a: '0.95 km, crossed in 3.17 µs of muon time.'
    },
    {
      title: 'Does the train fit?',
      q: 'A train of proper length 200 m moves at $0.8c$ through a tunnel of proper length 150 m. Does it fit inside the tunnel?',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.64} = 5/3$.',
        'Tunnel frame: the train is $200 \\times 3/5 = 120$ m long, shorter than the tunnel, so for a while it is completely inside.',
        'Train frame: the tunnel is $150 \\times 3/5 = 90$ m long, much shorter than the 200 m train.',
        '"Completely inside" means "the rear has entered *before* the front has left". Those two events happen in one order in the tunnel frame and in the opposite order in the train frame, so each conclusion is correct in its own frame.'
      ],
      a: 'Yes in the tunnel\'s frame (120 m < 150 m); no in the train\'s frame (200 m > 90 m). Both are right.'
    }
  ],
  quiz: [
    { q: 'A metre stick flies past you lengthways at $0.6c$. You measure its length as…', choices: ['0.6 m', '0.8 m', '1 m', '1.25 m'], a: 1,
      why: '$\\sqrt{1 - 0.36} = 0.8$, so the stick measures 0.8 m.' },
    { q: 'The same stick flies past sideways, moving perpendicular to its length. You measure…', choices: ['0.8 m', '1 m', '1.25 m', '0.6 m'], a: 1,
      why: 'Only lengths along the motion contract; this time the whole length is across the motion.' },
    { q: 'Astronauts on a ship moving at $0.9c$ relative to Earth measure their ship. Compared with its length before launch they find it…', choices: ['2.3 times shorter', 'the same', '2.3 times longer', 'shorter, but only while accelerating'], a: 1,
      why: 'In its own rest frame the ship has its proper length. Only observers who see it move measure it contracted.' },
    { q: 'From the muon\'s point of view, the atmosphere it crosses is much thinner than 15 km.', a: true,
      why: 'In the muon\'s frame the atmosphere moves at $0.998c$ and is contracted by $\\gamma \\approx 16$, to under 1 km.' }
  ],
  applications: [
    'Heavy-ion colliders, where nuclei arrive as flattened discs, which shapes how the collisions develop.',
    'Explaining cosmic-ray muon fluxes consistently in the muon\'s own frame.',
    'The magnetic force between currents can be understood as an electric force made unbalanced by length contraction of moving charges.'
  ],
  history: 'George FitzGerald (1889) and Hendrik Lorentz (1892) proposed that bodies moving through the aether are physically squeezed, to explain the Michelson–Morley result. Einstein reinterpreted the contraction in 1905 as a property of measurements of space and time, with no aether and no squeezing force.',
  sim: 'ra-tunnel'
},

{
  id: 'simultaneity', parent: 'special-relativity', title: 'Relativity of simultaneity', level: 2,
  short: 'Two events that happen at the same time for one observer can happen at different times for another observer moving relative to the first.',
  keywords: ['simultaneity', 'relativity of simultaneity', 'Einstein train', 'lightning', 'clock synchronisation', 'synchronization', 'leading clocks lag', 'causality', 'Andromeda paradox'],
  prereq: ['relativity-postulates', 'time-dilation'],
  related: ['lorentz-transformation', 'length-contraction', 'twin-paradox', 'spacetime-interval'],
  body: `
How do you know that two distant things happened "at the same time"? You cannot see them instantly, so you use light: if flashes from two events reach you together **and you stand midway between them**, they happened simultaneously. Einstein's thought experiment shows why the answer depends on who is asking.

### Lightning and a train
Lightning strikes both ends of a moving train, scorching the track and the train. Anna stands on the embankment exactly midway between the two marks on the track. The flashes reach her together, so for her the strikes were simultaneous.

Bruno sits at the middle of the train. While the light is on its way he moves towards the front flash and away from the rear one, so the front flash reaches him first — Anna agrees about that. But in his own frame Bruno is at rest, midway between the marks on the train, and by the [[relativity-postulates|second postulate]] light travels at $c$ in both directions for him too. He must conclude that **the front strike happened first**.

Neither is wrong. For events at different places, simultaneity is not absolute; it depends on the frame.

### How big is the effect?
If two events are simultaneous in one frame and a distance $\\Delta x$ apart, a frame moving at $v$ along the line joining them finds them separated in time by

$$\\Delta t = \\gamma\\,\\frac{v\\,\\Delta x}{c^2}$$

and for the moving observer the event lying **ahead** (in her direction of motion) happens **first**. The factor $v/c^2$ is tiny, which is why we never notice: two events 1 km apart, judged from a car at 30 m/s, are out of step by only $3\\times10^{-13}$ s.

### Leading clocks lag
A related rule solves most relativity puzzles. Clocks along a moving train, synchronised in the train's own frame, are **not** synchronised as seen from the ground: at any one ground instant the rear clock reads *ahead* of the front clock by

$$\\Delta t = \\frac{v\\, L_0}{c^2}$$

where $L_0$ is the train's proper length. This single fact dissolves the paradox of the train that does and does not fit in a [[length-contraction|tunnel]], and it is the heart of the [[twin-paradox|twin paradox]].

### Causality survives
Could a fast observer see an effect before its cause? No. The order of two events can be reversed only when they are so far apart that not even light could get from one to the other in the time between them ($\\Delta x > c\\,\\Delta t$). Such events cannot influence each other. For any pair that *could* be cause and effect, every observer agrees on the order — provided nothing travels faster than light. On a [[spacetime-interval|spacetime diagram]] a moving observer's lines of simultaneity tilt, but they never tilt past the 45° paths of light.
`,
  ideas: [
    'Events simultaneous in one frame are generally not simultaneous in another frame moving along the line joining them.',
    'For simultaneous events a distance Δx apart, a frame moving at v finds a time gap γvΔx/c², the event ahead of it happening first.',
    'Clocks synchronised in a moving frame look out of step from outside: the rear clock is ahead by vL₀/c².',
    'Only events too far apart for light to connect can change order; cause and effect never do.'
  ],
  pitfalls: [
    'The strikes are "really" simultaneous; Bruno only sees the front one first because he moves towards it — Bruno is equally entitled to consider himself at rest. In his frame light has speed c both ways and he is midway, so the front strike really is earlier for him.',
    'Relativity of simultaneity lets someone see an effect before its cause — Order can reverse only when Δx > cΔt, and then no signal can connect the events.',
    'Even events at the same place can be simultaneous for one observer and not another — Two events at the same place and the same time (a collision, say) are simultaneous for everyone.'
  ],
  formulas: [
    {
      name: 'Time gap seen from a moving frame',
      expr: 'dt = v*dx/(c^2*sqrt(1 - v^2/c^2))', tex: '\\Delta t = \\frac{v\\,\\Delta x}{c^2\\sqrt{1 - v^2/c^2}}',
      vars: {
        dt: { name: 'time between the events in the moving frame', q: 'time', unit: 'µs', tex: '\\Delta t' },
        v: { name: 'speed of the moving frame', q: 'speed', unit: 'c', value: 0.6, min: 0, max: 0.9999 },
        dx: { name: 'distance between the events (frame where they are simultaneous)', q: 'length', unit: 'm', value: 1000, tex: '\\Delta x' },
        c: { const: 'c' }
      },
      note: 'For two events that are simultaneous in one frame. In the moving frame the event lying ahead happens first.',
      stories: {
        dt: 'Two lightning bolts strike {dx} apart at the same moment in the ground frame. How far apart in time are they for a spaceship flying along the line between them at {v}?',
        v: 'Two events simultaneous on the ground, {dx} apart, are {dt} apart for a passing rocket. How fast is the rocket?'
      }
    },
    {
      name: 'Leading clocks lag',
      expr: 'dt = v*L0/c^2', tex: '\\Delta t = \\frac{v\\, L_0}{c^2}',
      vars: {
        dt: { name: 'how far the rear clock is ahead of the front clock, seen from the ground', q: 'time', unit: 'ns', tex: '\\Delta t' },
        v: { name: 'speed of the train', q: 'speed', unit: 'c', value: 0.8, min: 0, max: 0.9999 },
        L0: { name: 'proper length of the train', q: 'length', unit: 'm', value: 200 },
        c: { const: 'c' }
      },
      note: 'Clocks at the front and rear of a train, synchronised by the passengers, compared at one instant of ground time.',
      stories: {
        dt: 'A train of proper length {L0} passes at {v}. Its clocks are synchronised by the passengers. From the ground, by how much does the rear clock read ahead of the front clock?'
      }
    }
  ],
  examples: [
    {
      title: 'Lightning seen from a spaceship',
      q: 'Two lightning bolts strike the ground 1.0 km apart, simultaneously in the ground frame. A spaceship flies along the line from the first strike towards the second at $0.6c$. What time separation does the crew measure, and which strike comes first?',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.36} = 1.25$.',
        '$\\Delta t = \\gamma\\,\\dfrac{v\\,\\Delta x}{c^2} = 1.25 \\times \\dfrac{0.6 \\times 1000\\ \\mathrm{m}}{3.00\\times10^{8}\\ \\mathrm{m/s}} = 2.5\\ \\mu\\mathrm{s}$.',
        'The strike ahead of the ship — the second one — happens first for the crew.'
      ],
      a: '2.5 µs apart, the forward strike first.'
    },
    {
      title: 'A stroll and a distant galaxy',
      q: 'You walk at 1.4 m/s towards the Andromeda galaxy, 2.5 million light-years away. Compared with standing still, by how much does your "now" in Andromeda shift?',
      steps: [
        'At walking pace $\\gamma = 1$, so $\\Delta t = v\\,\\Delta x/c^2$.',
        '$\\Delta x = 2.5\\times10^{6} \\times 9.46\\times10^{15}\\ \\mathrm{m} = 2.37\\times10^{22}\\ \\mathrm{m}$.',
        '$\\Delta t = \\dfrac{1.4 \\times 2.37\\times10^{22}}{(3.00\\times10^{8})^2} = 3.7\\times10^{5}\\ \\mathrm{s}$, about four days.',
        'Nothing you could ever check depends on it — no signal can tell you what Andromeda is doing "now" — but it shows that "now" far away is a convention tied to your frame.'
      ],
      a: 'About four days.'
    }
  ],
  quiz: [
    { q: 'In the lightning thought experiment, which strike does Bruno, riding at the middle of the train, say happened first?', choices: ['The one at the rear', 'The one at the front', 'They were simultaneous', 'It cannot be decided'], a: 1,
      why: 'The front flash reaches him first; he is midway between the marks on the train and light moves at c both ways in his frame, so the front strike must have happened first.' },
    { q: 'Two events happen at the same place and the same time in one frame. In any other inertial frame they are…', choices: ['simultaneous', 'separated in time by $\\gamma v\\Delta x/c^2$', 'in reversed order', 'simultaneous but at different places'], a: 0,
      why: 'With $\\Delta x = 0$ and $\\Delta t = 0$ the Lorentz transformation gives $\\Delta t\' = 0$ and $\\Delta x\' = 0$: a single meeting point is a single event for everyone.' },
    { q: 'Event A causes event B (a signal travels from A to B). Can a fast observer find B happening before A?', choices: ['Yes, if moving fast enough', 'Only above $0.5c$', 'No, never — as long as nothing outruns light', 'Only if the events are more than a light-year apart'], a: 2,
      why: 'Events that a signal can connect have $\\Delta x \\le c\\Delta t$; for them every observer agrees on the order.' },
    { q: 'Clocks at the two ends of a moving train are synchronised by the passengers. Seen from the platform at one instant, they show the same time.', a: false,
      why: 'From the platform the rear clock reads ahead of the front one by $vL_0/c^2$: leading clocks lag.' }
  ],
  applications: [
    'Synchronising clocks over large distances — GPS, radio astronomy and time standards — requires a stated convention and frame.',
    'The frame dependence of simultaneity resolves the pole-in-the-barn and twin paradoxes.'
  ],
  history: 'Einstein put the synchronisation of distant clocks by light signals at the very start of his 1905 paper, and later popularised the lightning-and-train version of the argument in a book for general readers (1916).',
  sim: 'ra-spacetime'
},

{
  id: 'lorentz-transformation', parent: 'special-relativity', title: 'Lorentz transformation', level: 3,
  short: 'The rules that convert the position and time of an event from one inertial frame to another moving relative to it — the replacement for Galileo\'s rules at speeds near c.',
  keywords: ['Lorentz transformation', 'Lorentz boost', 'Galilean transformation', 'coordinates', 'rapidity', 'reference frame', 'event', 'boost', 'spacetime coordinates'],
  prereq: ['time-dilation', 'length-contraction', 'simultaneity', 'math:linear-transformations'],
  related: ['velocity-addition', 'spacetime-interval', 'math:hyperbolic-functions', 'math:matrices'],
  body: `
An **event** is something that happens at a definite place and time: a flash, a collision, a clock striking noon. Frame $S$ labels it $(x, t)$; frame $S'$, moving at velocity $v$ along the $x$ axis, labels the same event $(x', t')$. Take the origins to coincide at $t = t' = 0$.

### Galileo's answer, and why it fails
Newtonian physics says $x' = x - vt$ and $t' = t$: positions shift, time is universal. Then a light pulse with $x = ct$ has $x' = (c - v)\\,t'$ and moves at $c - v$ in $S'$, contradicting the [[relativity-postulates|postulates]].

### Lorentz's answer
The transformation that keeps the speed of light equal to $c$ in both frames, and keeps uniform motion uniform, is

$$x' = \\gamma\\,(x - v t), \\qquad t' = \\gamma\\left(t - \\frac{v x}{c^2}\\right), \\qquad y' = y, \\quad z' = z$$

with $\\gamma = 1/\\sqrt{1 - v^2/c^2}$. The inverse is the same with $v$ replaced by $-v$, as symmetry demands: $x = \\gamma(x' + v t')$, $t = \\gamma(t' + v x'/c^2)$.

At everyday speeds $\\gamma \\approx 1$ and $vx/c^2$ is negligible, and Galileo's rules come back. The surprise is the term $-vx/c^2$: **time in one frame depends on position in the other**. That single term carries the [[simultaneity|relativity of simultaneity]].

### Everything else follows
- A clock at rest in $S'$ sits at $x = vt$, so it reads $t' = \\gamma(t - v^2 t/c^2) = t/\\gamma$: [[time-dilation|time dilation]].
- A rod at rest in $S'$ from $x' = 0$ to $x' = L_0$, with both ends marked at the same $t$, spans $L_0/\\gamma$ in $S$: [[length-contraction|length contraction]].
- Events with $\\Delta t = 0$ in $S$ have $\\Delta t' = -\\gamma v\\,\\Delta x/c^2$: simultaneity is relative.
- Dividing small changes, $dx'/dt'$, gives the [[velocity-addition|relativistic addition of velocities]].

### A rotation in spacetime
Measure time in metres by using $ct$, and write $\\beta = v/c$. The transformation becomes symmetric in space and time:

$$ct' = \\gamma\\,(ct - \\beta x), \\qquad x' = \\gamma\\,(x - \\beta\\, ct)$$

This is a [[math:linear-transformations|linear transformation]] that mixes space and time the way a rotation mixes $x$ and $y$ — but with [[math:hyperbolic-functions|hyperbolic functions]] instead of sines and cosines. Writing $\\beta = \\tanh\\phi$ gives $\\gamma = \\cosh\\phi$ and $\\gamma\\beta = \\sinh\\phi$; the "angle" $\\phi$ is called the **rapidity**, and the rapidities of successive boosts along a line simply add. A rotation keeps $x^2 + y^2$ fixed; a Lorentz transformation keeps $(ct)^2 - x^2$ fixed — the [[spacetime-interval|spacetime interval]].

> [!tip] The simulation below draws both frames on one spacetime diagram. The moving frame's axes tilt towards the light lines as the speed grows; drag the events and compare their coordinates in the two frames.
`,
  ideas: [
    'x′ = γ(x − vt) and t′ = γ(t − vx/c²); coordinates across the motion are unchanged.',
    'The inverse transformation is the same with v replaced by −v.',
    'At low speed it reduces to Galileo\'s x′ = x − vt, t′ = t.',
    'Time dilation, length contraction and the relativity of simultaneity are all special cases.',
    'It is a hyperbolic "rotation" of spacetime that leaves (ct)² − x² unchanged.'
  ],
  pitfalls: [
    'Only x changes between frames — Time changes too, and in a way that depends on position: t′ = γ(t − vx/c²).',
    'The Lorentz transformation describes what observers see — It relates coordinates assigned after correcting for light-travel time, not the appearance of things in a photograph.',
    'You can combine two boosts by adding their speeds — Rapidities add, speeds do not; use the velocity-addition rule.'
  ],
  derivation: {
    title: 'Derive the Lorentz transformation from the postulates',
    steps: [
      { text: 'Assume the transformation is linear, so that uniform motion stays uniform, and that the origin of $S\'$ moves along $x = vt$. Then, with a factor $\\gamma$ still to be found,', tex: "x' = \\gamma\\,(x - v t)" },
      { text: 'By the first postulate the inverse has the same form with the velocity reversed:', tex: "x = \\gamma\\,(x' + v t')" },
      { text: 'A light pulse leaves the common origin at $t = t\' = 0$. By the second postulate $x = ct$ and $x\' = ct\'$. Substitute into both equations:', tex: "c\\,t' = \\gamma\\,(c - v)\\,t, \\qquad c\\,t = \\gamma\\,(c + v)\\,t'" },
      { text: 'Multiply the two equations and cancel $t\\,t\'$:', tex: 'c^2 = \\gamma^2\\,(c^2 - v^2) \\;\\Rightarrow\\; \\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}' },
      { text: 'Eliminate $x\'$ between the first two equations and simplify with $1/\\gamma - \\gamma = -\\gamma v^2/c^2$:', tex: "t' = \\gamma\\left(t - \\frac{v x}{c^2}\\right)" }
    ]
  },
  formulas: [
    {
      name: 'Position in the moving frame',
      expr: 'xp = (x - v*t)/sqrt(1 - v^2/c^2)',
      vars: {
        xp: { name: 'position in the moving frame S′', q: 'length', unit: 'm', signed: true, tex: "x'" },
        x: { name: 'position in frame S', q: 'length', unit: 'm', value: 450, signed: true },
        t: { name: 'time in frame S', q: 'time', unit: 'µs', value: 5, signed: true },
        v: { name: 'velocity of S′ relative to S', q: 'speed', unit: 'c', value: 0.8, min: -0.9999, max: 0.9999, signed: true },
        c: { const: 'c' }
      },
      note: 'Origins coincide at $t = t\' = 0$; $S\'$ moves along $+x$ when $v > 0$.',
      stories: {
        xp: 'In frame S an event happens at x = {x}, t = {t}. Where does it happen in a frame moving at {v} along x?'
      }
    },
    {
      name: 'Time in the moving frame',
      expr: 'tp = (t - v*x/c^2)/sqrt(1 - v^2/c^2)',
      vars: {
        tp: { name: 'time in the moving frame S′', q: 'time', unit: 'µs', signed: true, tex: "t'" },
        t: { name: 'time in frame S', q: 'time', unit: 'µs', value: 5, signed: true },
        x: { name: 'position in frame S', q: 'length', unit: 'm', value: 450, signed: true },
        v: { name: 'velocity of S′ relative to S', q: 'speed', unit: 'c', value: 0.8, min: -0.9999, max: 0.9999, signed: true },
        c: { const: 'c' }
      },
      note: 'Solving for $v$ can give two answers: two different frames can assign the same time to an event.',
      stories: {
        tp: 'In frame S an event happens at x = {x}, t = {t}. At what time does it happen in a frame moving at {v} along x?'
      }
    }
  ],
  examples: [
    {
      title: 'Where and when, for the ship',
      q: 'A spaceship passes Earth (at $x = 0$) at $t = 0$, moving at $0.8c$ along $+x$. In Earth\'s frame a beacon flashes at $x = 1200$ m, $t = 5.00\\ \\mu$s. Where and when does the flash happen in the ship\'s frame?',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.64} = 5/3$.',
        '$vt = 0.8 \\times 2.998\\times10^{8} \\times 5.00\\times10^{-6} = 1199\\ \\mathrm{m}$, so $x\' = \\tfrac53 (1200 - 1199) \\approx 1.4\\ \\mathrm{m}$ — the flash happens practically at the ship.',
        '$vx/c^2 = 0.8 \\times 1200/(2.998\\times10^{8}) = 3.20\\ \\mu\\mathrm{s}$, so $t\' = \\tfrac53 (5.00 - 3.20) = 3.00\\ \\mu\\mathrm{s}$.',
        'Check: the ship is present at both events (passing Earth, the flash), so its clock gives the proper time $5.00/\\gamma = 3.00\\ \\mu\\mathrm{s}$ — time dilation again.',
        'Check the interval: $(ct)^2 - x^2 = 1499^2 - 1200^2 \\approx 8.1\\times10^{5}\\ \\mathrm{m^2}$, and $(ct\')^2 - x\'^2 = 899^2 - 1.4^2 \\approx 8.1\\times10^{5}\\ \\mathrm{m^2}$.'
      ],
      a: 'x′ ≈ 1.4 m (at the ship), t′ = 3.00 µs.'
    }
  ],
  quiz: [
    { q: 'At speeds much smaller than c, the Lorentz transformation reduces to…', choices: ['$x\' = x$, $t\' = t$', '$x\' = x - vt$, $t\' = t$', '$x\' = \\gamma x$, $t\' = t/\\gamma$', 'nothing simpler'], a: 1,
      why: 'With $\\gamma \\to 1$ and $vx/c^2 \\to 0$ you recover the Galilean transformation.' },
    { q: 'Which part of the Lorentz transformation is responsible for the relativity of simultaneity?', choices: ['The factor $\\gamma$ in front of $x - vt$', 'The term $-vx/c^2$ in the time equation', 'The rule $y\' = y$', 'The minus sign in $x - vt$'], a: 1,
      why: 'Because of $-vx/c^2$, events with the same $t$ but different $x$ get different $t\'$.' },
    { q: 'Frame S′ moves at $+0.6c$ relative to S. What is the velocity of S relative to S′?', choices: ['$+0.6c$', '$-0.6c$', '$-0.8c$', '$-0.6c/\\gamma$'], a: 1,
      why: 'Relative velocity is reciprocal: each frame sees the other move at the same speed in the opposite direction, which is why the inverse transformation just flips the sign of $v$.' },
    { q: 'Coordinates perpendicular to the motion (y and z) are unchanged by a Lorentz transformation.', a: true,
      why: 'Only the direction of motion is affected; otherwise the two frames could disagree about whose object is taller, which would break the symmetry between them.' }
  ],
  history: 'Joseph Larmor (1897) and Hendrik Lorentz (1904) found the transformation as the one that leaves Maxwell\'s equations unchanged; Henri Poincaré named it after Lorentz and showed it forms a group. Einstein derived it in 1905 from the two postulates, and Minkowski (1908) read it as a rotation in four-dimensional spacetime.',
  sim: 'ra-spacetime'
},

{
  id: 'velocity-addition', parent: 'special-relativity', title: 'Relativistic velocity addition', level: 2,
  short: 'Velocities do not simply add: combining two speeds below c always gives a speed below c, and light has speed c in every frame.',
  keywords: ['velocity addition', 'relativistic velocity addition', 'adding speeds', 'Fizeau experiment', 'rapidity', 'speed limit', 'relative speed', 'closing speed'],
  prereq: ['lorentz-transformation', 'relative-velocity'],
  related: ['relativistic-doppler', 'relativistic-momentum', 'math:hyperbolic-functions'],
  body: `
A train moves at $v$ and a passenger walks forwards at $u'$ relative to the train. Newton says her speed relative to the ground is $u = u' + v$ ([[relative-velocity|relative velocity]]). Apply that to a lamp on the train, $u' = c$, and you get $c + v$, which the [[relativity-postulates|second postulate]] forbids.

The [[lorentz-transformation|Lorentz transformation]] gives the correct rule for velocities along the same line:

$$u = \\frac{u' + v}{1 + \\dfrac{u' v}{c^2}}$$

### Testing the rule
- **Everyday speeds:** a ball thrown forwards at 30 m/s from a car doing 30 m/s. The denominator is $1 + 10^{-14}$, so $u = 60$ m/s to fourteen decimal places. Newton is fine.
- **Two fast speeds:** a probe fired forwards at $0.6c$ from a ship doing $0.6c$ travels at $\\dfrac{1.2c}{1 + 0.36} = 0.88c$, not $1.2c$.
- **Light:** with $u' = c$, $u = \\dfrac{c + v}{1 + v/c} = c$. Whatever the source does, light has speed $c$.
- **Piling on:** $0.9c$ combined with $0.9c$ gives $0.994c$; combining again gives $0.9997c$. You can get as close to $c$ as you like, but never reach it.

The speeds must belong to the right observers: $u'$ measured in the moving frame, $v$ the speed of that frame, and $u$ measured in the ground frame. For motion backwards, give $u'$ a negative sign: a probe fired backwards at $0.6c$ from the $0.6c$ ship is at rest relative to the ground.

### Closing speeds and relative speeds
Two ships approach each other, each at $0.8c$ relative to Earth. Earth sees the gap between them shrink at $1.6c$. That is no violation: a closing speed is just the rate at which a distance measured in one frame changes, and no object or signal moves that fast. The speed of one ship **as measured by the other** follows the addition rule: $1.6c/1.64 = 0.976c$.

### A nineteenth-century confirmation
In 1851 Hippolyte Fizeau sent light through water flowing at a few metres per second. Light in still water moves at $c/n$; the flowing water dragged it along, but only by the fraction $1 - 1/n^2$ of the flow speed — about 44% for water. The fraction puzzled physicists for half a century. Expanding the addition rule for small $v$ gives it exactly: $u \\approx c/n + v\\,(1 - 1/n^2)$.

> [!tip] Rapidities add. Define $\\phi = \\tanh^{-1}(v/c)$. Combining velocities along a line just adds their rapidities, and $u = c\\tanh(\\phi_1 + \\phi_2)$ is the addition rule in disguise.
`,
  ideas: [
    'Velocities along a line combine as u = (u′ + v)/(1 + u′v/c²), not u′ + v.',
    'At everyday speeds the correction is negligible and Newton\'s rule works.',
    'Combining any speeds below c gives a speed below c; combining anything with c gives c.',
    'A closing speed measured in one frame may exceed c; the speed of one object relative to another cannot.'
  ],
  pitfalls: [
    'Two ships approaching at 0.8c each have a relative speed of 1.6c — 1.6c is the closing speed in Earth\'s frame. Measured by either ship, the other approaches at 0.976c.',
    'The rule only matters for light — It applies to everything; for slow objects the correction is simply tiny.',
    'Any three speeds can be put into the formula — u′ must be measured in the moving frame, and v is that frame\'s speed; mixing up frames gives nonsense.'
  ],
  formulas: [
    {
      name: 'Adding velocities along a line',
      expr: 'u = (up + v)/(1 + up*v/c^2)',
      vars: {
        u: { name: 'velocity relative to the ground', q: 'speed', unit: 'c', signed: true },
        up: { name: 'velocity relative to the moving frame', q: 'speed', unit: 'c', value: 0.6, min: -0.9999, max: 0.9999, signed: true, tex: "u'" },
        v: { name: 'velocity of the moving frame', q: 'speed', unit: 'c', value: 0.6, min: -0.9999, max: 0.9999, signed: true },
        c: { const: 'c' }
      },
      note: 'All velocities along the same line; a negative value means the opposite direction.',
      stories: {
        u: 'A spaceship moving at {v} relative to Earth fires a probe forwards at {up} relative to the ship. How fast does the probe move relative to Earth?',
        up: 'A probe moves at {u} relative to Earth after being launched forwards from a ship moving at {v}. How fast was it launched, relative to the ship?',
        v: 'A particle emitted at {up} relative to its parent nucleus is seen moving at {u} in the lab. How fast was the nucleus moving?'
      }
    },
    {
      name: 'Light dragged by moving water (Fizeau)',
      expr: 'du = v*(1 - 1/n^2)', tex: '\\Delta u = v\\left(1 - \\frac{1}{n^2}\\right)',
      vars: {
        du: { name: 'extra speed given to the light by the flow', q: 'speed', unit: 'm/s', tex: '\\Delta u' },
        v: { name: 'speed of the water', q: 'speed', unit: 'm/s', value: 7 },
        n: { name: 'refractive index', value: 1.333, min: 1, max: 3 }
      },
      note: 'The first-order result of the addition rule for light moving at $c/n$ in a medium flowing at $v \\ll c$.',
      stories: {
        du: 'Light travels through water (n = {n}) flowing at {v} in the same direction. By how much does the flow speed the light up?',
        n: 'Flowing at {v}, a liquid speeds light up by {du}. What is its refractive index?'
      }
    }
  ],
  examples: [
    {
      title: 'A probe from a fast ship',
      q: 'A ship moving at $0.6c$ relative to Earth launches a probe at $0.6c$ relative to the ship, first forwards and then backwards. How fast does each probe move relative to Earth?',
      steps: [
        'Forwards: $u = \\dfrac{0.6c + 0.6c}{1 + 0.36} = \\dfrac{1.2c}{1.36} = 0.882c$.',
        'Backwards: $u\' = -0.6c$, so $u = \\dfrac{-0.6c + 0.6c}{1 - 0.36} = 0$.',
        'The backward probe is at rest relative to Earth, just as Newton would say; only the forward case differs much from simple addition.'
      ],
      a: '0.882c forwards; at rest when fired backwards.'
    },
    {
      title: 'Ships on a collision course',
      q: 'Two ships approach each other, each at $0.8c$ relative to Earth. How fast does each see the other approaching?',
      steps: [
        'Let ship A move at $+0.8c$ and ship B at $-0.8c$ in Earth\'s frame. Go to A\'s frame: it moves at $v = +0.8c$ relative to Earth.',
        'Invert the addition rule: B\'s velocity relative to A is $u\' = \\dfrac{u - v}{1 - uv/c^2} = \\dfrac{-0.8c - 0.8c}{1 + 0.64} = -0.976c$.',
        'Earth sees the gap close at $1.6c$, but no object moves faster than light relative to any observer.'
      ],
      a: '0.976c'
    }
  ],
  quiz: [
    { q: 'A ship moving at $0.5c$ fires a laser beam forwards. Relative to the ship the light moves at $c$. Relative to Earth it moves at…', choices: ['$1.5c$', '$c$', '$0.5c$', '$0.75c$'], a: 1,
      why: 'Put $u\' = c$ into the rule: the result is exactly $c$, as the second postulate requires.' },
    { q: 'Relativistically, $0.5c$ "plus" $0.5c$ equals…', choices: ['$c$', '$0.8c$', '$0.75c$', '$0.5c$'], a: 1,
      why: '$u = c/(1 + 0.25) = 0.8c$.' },
    { q: 'Two electrons fly apart in opposite directions, each at $0.9c$ in the lab, so the lab sees the distance between them grow at $1.8c$. Is anything wrong?', choices: ['Yes: nothing can exceed $c$', 'No: $1.8c$ is the rate of change of a lab distance, not the speed of any object', 'Yes: the lab should see $0.994c$', 'No, because electrons have mass'], a: 1,
      why: 'Each electron moves at 0.9c in the lab, below c. Measured by one electron, the other recedes at $1.8c/1.81 = 0.994c$.' },
    { q: 'For two speeds of 30 m/s the relativistic correction is about one part in a hundred trillion.', a: true,
      why: '$u\'v/c^2 = 900/(9\\times10^{16}) = 10^{-14}$, one part in $10^{14}$.' }
  ],
  history: 'Fizeau measured the partial dragging of light by moving water in 1851, confirming a formula Augustin Fresnel had guessed in 1818. Max von Laue showed in 1907 that it follows directly from Einstein\'s velocity addition.'
},

{
  id: 'relativistic-momentum', parent: 'special-relativity', title: 'Relativistic momentum', level: 2,
  short: 'In relativity momentum is γmv: it grows without limit as the speed approaches c, which is why no push can bring a massive object to the speed of light.',
  keywords: ['relativistic momentum', 'gamma m v', 'momentum', 'relativistic mass', 'rest mass', 'magnetic rigidity', 'accelerator', 'MeV/c', 'conservation of momentum'],
  prereq: ['momentum', 'conservation-of-momentum', 'time-dilation'],
  related: ['relativistic-energy', 'particle-accelerators', 'charged-particle-motion', 'newtons-second-law'],
  body: `
[[conservation-of-momentum|Conservation of momentum]] is one of the most reliable rules in physics, and the [[relativity-postulates|first postulate]] demands that it hold in every inertial frame. With Newton's $p = mv$ it cannot: take a collision in which $mv$ balances in one frame, transform all the velocities with the [[velocity-addition|relativistic rule]], and the totals no longer balance in another.

The cure is to measure the rate of change of position with the object's own [[time-dilation|proper time]] $\\tau$, on which all observers agree, instead of the frame's time $t$. Since $dt = \\gamma\\,d\\tau$,

$$\\vec p = m\\frac{d\\vec r}{d\\tau} = \\gamma m \\vec v = \\frac{m \\vec v}{\\sqrt{1 - v^2/c^2}}$$

With this definition momentum is conserved in every collision in every frame — checked countless times a day in particle detectors, where the momenta of all the fragments of a collision always add up.

### Momentum without a speed limit
At low speed $\\gamma \\approx 1$ and $p = mv$ as before. But as $v \\to c$, $\\gamma \\to \\infty$: an electron at $0.99c$ has seven times its Newtonian momentum, at $0.9999c$ seventy times. Newton's second law survives as $\\vec F = d\\vec p/dt$ ([[newtons-second-law|Newton's second law]]), so a steady force makes the momentum grow steadily **forever**, while the speed creeps ever closer to $c$ without reaching it.

### Momentum in particle physics
Physicists quote momentum in MeV/$c$ or GeV/$c$ — an energy divided by $c$ ($1\\ \\mathrm{MeV}/c = 5.34\\times10^{-22}$ kg·m/s). A charged particle crossing a magnetic field moves on a circle of radius $r = p/(qB)$, and this is exact in relativity ([[charged-particle-motion|charged particles in a magnetic field]]). Detectors measure momentum from the curvature of tracks. It also sets the size of accelerators: protons of 7 TeV/$c$ need superconducting magnets of 8.3 T to bend them on a radius of 2.8 km, inside the 27 km ring of the Large Hadron Collider.

> [!note] Older books write $p = m_\\mathrm{rel} v$ with a "relativistic mass" $m_\\mathrm{rel} = \\gamma m$ that grows with speed. Modern usage keeps $m$ as the **rest mass**, the same in every frame, and puts all the speed dependence into $\\gamma$. The physics is identical; the modern way avoids confusion, since the extra inertia is not the same for pushes along and across the motion.
`,
  ideas: [
    'Relativistic momentum is p = γmv; at low speed it becomes mv.',
    'With this definition momentum is conserved in every inertial frame.',
    'As v approaches c, p grows without limit, so no finite force acting for a finite time brings a massive object to c.',
    'F = dp/dt still holds: a steady force gives steadily growing momentum but a speed that levels off below c.',
    'The radius of a charged particle\'s path in a magnetic field, r = p/qB, measures its relativistic momentum.'
  ],
  pitfalls: [
    'An object\'s mass grows with its speed — The rest mass m is the same in every frame. What grows is γ, and with it momentum and energy.',
    'Doubling the momentum of a fast particle doubles its speed — Near c it barely changes it: an electron at 0.99c given twice the momentum moves at 0.9975c.'
  ],
  formulas: [
    {
      name: 'Relativistic momentum',
      expr: 'p = m*v/sqrt(1 - v^2/c^2)', tex: 'p = \\frac{m v}{\\sqrt{1 - v^2/c^2}}',
      vars: {
        p: { name: 'momentum', q: 'momentum', unit: 'MeV/c' },
        m: { name: 'rest mass', q: 'mass', unit: 'MeV/c²', value: 0.511 },
        v: { name: 'speed', q: 'speed', unit: 'c', value: 0.99, min: 0, max: 0.9999 },
        c: { const: 'c' }
      },
      note: 'An electron has $m = 0.511$ MeV/$c^2$, a proton 938.3 MeV/$c^2$.',
      stories: {
        p: 'A particle of rest mass {m} moves at {v}. What is its momentum?',
        v: 'A particle of rest mass {m} has momentum {p}. How fast is it moving?',
        m: 'A particle moving at {v} has momentum {p}. What is its rest mass?'
      }
    },
    {
      name: 'Momentum from the bending radius in a magnetic field',
      expr: 'p = q*B*r', tex: 'p = q B r', solveFor: 'r',
      vars: {
        p: { name: 'momentum', q: 'momentum', unit: 'MeV/c', value: 7e6 },
        q: { name: 'charge', q: 'charge', unit: 'e', value: 1 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 8.33 },
        r: { name: 'radius of the path', q: 'length', unit: 'km' }
      },
      note: 'Exact at any speed, for motion perpendicular to the field. 7 TeV/$c$ = $7\\times10^{6}$ MeV/$c$.',
      stories: {
        r: 'Protons with momentum {p} are steered by magnets of {B}. What radius of curvature do they follow?',
        B: 'What magnetic field bends particles of charge {q} and momentum {p} into a circle of radius {r}?',
        p: 'A track in a {B} detector field curves with radius {r}. What is the momentum of the particle (charge {q})?'
      }
    }
  ],
  examples: [
    {
      title: 'An electron at 0.99c',
      q: 'What is the momentum of an electron moving at $0.99c$, and how does it compare with Newton\'s $mv$?',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.99^2} = 7.09$.',
        '$p = \\gamma m v = 7.09 \\times 0.511\\ \\mathrm{MeV}/c^2 \\times 0.99c = 3.59\\ \\mathrm{MeV}/c$.',
        'Newton: $mv = 0.511 \\times 0.99 = 0.506\\ \\mathrm{MeV}/c$ — seven times too small.',
        'In SI: $3.59 \\times 5.34\\times10^{-22} = 1.92\\times10^{-21}\\ \\mathrm{kg\\cdot m/s}$.'
      ],
      a: '3.59 MeV/c, about seven times the Newtonian value.'
    },
    {
      title: 'Bending protons in a collider',
      q: 'Protons with momentum 7 TeV/$c$ are steered by magnets of 8.33 T. What is the radius of their path?',
      steps: [
        '$p = 7\\times10^{6}\\ \\mathrm{MeV}/c \\times 5.34\\times10^{-22} = 3.74\\times10^{-15}\\ \\mathrm{kg\\cdot m/s}$.',
        '$r = \\dfrac{p}{qB} = \\dfrac{3.74\\times10^{-15}}{1.60\\times10^{-19} \\times 8.33} = 2.80\\times10^{3}\\ \\mathrm{m}$.',
        'With Newton\'s $p = mv$ and $v < c$ you would get $r$ under half a metre — the ring would be absurdly small.'
      ],
      a: 'About 2.8 km.'
    }
  ],
  quiz: [
    { q: 'A proton\'s speed rises from $0.9c$ to $0.99c$. Its momentum grows by a factor of about…', choices: ['1.1', '3.4', '7', '10'], a: 1,
      why: '$p \\propto \\gamma v$: $2.29 \\times 0.9 = 2.06$ and $7.09 \\times 0.99 = 7.02$; the ratio is 3.4, although the speed rose by only 10%.' },
    { q: 'A steady force pushes an electron for a very long time. Its speed…', choices: ['grows without limit', 'approaches $c$ but never reaches it', 'reaches $c$ and then stops increasing', 'falls once it passes $0.5c$'], a: 1,
      why: 'Momentum grows steadily with time, but because $p = \\gamma mv$ blows up at $c$, the speed only approaches $c$.' },
    { q: 'At 1% of the speed of light, $p = mv$ is accurate to about 0.005%.', a: true,
      why: '$\\gamma = 1/\\sqrt{1 - 10^{-4}} \\approx 1 + 5\\times10^{-5}$, a difference of 0.005%.' },
    { q: 'In the same magnetic field, an electron track and a proton track curve with the same radius. The two particles have the same…', choices: ['speed', 'momentum', 'kinetic energy', 'mass'], a: 1,
      why: 'With equal charges, $r = p/(qB)$ depends only on the momentum.' }
  ],
  applications: [
    'Momentum measurement in particle detectors, from the curvature of tracks in a magnetic field.',
    'The design of synchrotrons: the field strength needed rises with the momentum of the beam.',
    'Mass spectrometers and beam lines, which select particles by momentum.'
  ],
  sim: { id: 'ra-gamma', params: { show: 'p' } }
},

{
  id: 'mass-energy', parent: 'special-relativity', title: 'Mass–energy equivalence', level: 1,
  short: 'Mass is a form of energy: a body at rest holds the energy E = mc², and whenever a system gives out energy its mass goes down by E/c².',
  keywords: ['E=mc2', 'E = mc²', 'mass–energy equivalence', 'rest energy', 'Einstein', 'mass defect', 'annihilation', 'nuclear energy', 'pair production'],
  prereq: ['relativity-postulates', 'kinetic-energy', 'conservation-of-energy'],
  related: ['binding-energy', 'fission', 'fusion', 'antimatter', 'relativistic-energy'],
  body: `
In 1905, a few months after his first paper on relativity, Einstein showed that a body emitting an energy $E$ as light must lose mass $E/c^2$. Turned around: **every mass is a store of energy**,

$$E_0 = m c^2$$

its **rest energy**. Because $c^2 = 9\\times10^{16}\\ \\mathrm{m^2/s^2}$ is enormous, a little mass is a great deal of energy. One gram corresponds to $9\\times10^{13}$ J — what a large power station delivers in a day, or the yield of a 20-kiloton bomb.

### Mass changes whenever energy changes
Mass is not "turned into" energy as if they were different stuff: mass *is* energy, measured in different units. So any change in the energy of a system changes its mass:

- A kilogram of water heated by 80 K gains $3.3\\times10^{5}$ J, and so about $4\\times10^{-12}$ kg — far too little to weigh.
- In burning fuel, the products weigh less than the fuel and oxygen by about one part in ten billion.
- In [[fission|nuclear fission]] of uranium-235, about 200 MeV per nucleus is released, 0.09% of its rest energy.
- In [[fusion|fusion]] of hydrogen into helium in the [[the-sun|Sun]], 0.7% of the rest energy is released.
- In **annihilation** of matter with [[antimatter|antimatter]], all of it goes: an electron and a positron become two 511 keV gamma rays, the signal PET scanners detect.

Chemical and nuclear energy differ only in degree. In both, the bound system has less energy — and therefore less mass — than its separate parts. For nuclei the difference, the [[binding-energy|mass defect]], is big enough to measure: a helium-4 nucleus is 0.75% lighter than two free protons and two free neutrons.

### Energy into mass
The process runs the other way too. A gamma ray with more than $2 \\times 0.511 = 1.022$ MeV passing near a nucleus can create an electron–positron pair. In colliders the kinetic energy of the beams becomes the mass of new, heavy particles, such as the Higgs boson at 125 GeV/$c^2$ — more than 130 proton masses.

### Useful rest energies
| Particle | Rest energy $mc^2$ |
|---|---|
| electron | 0.511 MeV |
| proton | 938.3 MeV |
| neutron | 939.6 MeV |
| 1 atomic mass unit | 931.5 MeV |

The Sun shines by losing mass: its luminosity of $3.8\\times10^{26}$ W corresponds to $4.3\\times10^{9}$ kg — more than four million tonnes — every second.
`,
  ideas: [
    'A body at rest has rest energy E₀ = mc².',
    'Any change in a system\'s energy — heating, binding, emitting light — changes its mass by ΔE/c².',
    'Chemical reactions release about 10⁻¹⁰ of the rest energy, fission about 0.1%, fusion about 0.7%, annihilation all of it.',
    'Energy can also become mass: pair creation, and new particles in colliders.'
  ],
  pitfalls: [
    'E = mc² only applies to nuclear reactions — It applies to every change of energy; chemical and thermal mass changes are just too small to weigh.',
    'Fission and fusion destroy protons and neutrons to make energy — The numbers of protons and neutrons stay the same; the energy comes from the smaller mass of the more tightly bound products.',
    'Mass turning into energy means energy is created — Total energy, rest energy included, is conserved; rest energy is released as kinetic energy and radiation.'
  ],
  formulas: [
    {
      name: 'Rest energy',
      expr: 'E = m*c^2', tex: 'E = m c^2',
      vars: {
        E: { name: 'rest energy', q: 'energy', unit: 'J' },
        m: { name: 'mass', q: 'mass', unit: 'g', value: 1 },
        c: { const: 'c' }
      },
      stories: {
        E: 'How much energy is equivalent to a mass of {m}?',
        m: 'A power station delivers {E} of electrical energy. What mass does this energy correspond to?'
      }
    },
    {
      name: 'Mass carried away by radiated power',
      expr: 'mdot = P/c^2', tex: '\\dot m = \\frac{P}{c^2}',
      vars: {
        mdot: { name: 'rate of mass loss', q: 'massflow', unit: 'kg/s', tex: '\\dot m' },
        P: { name: 'power radiated', q: 'power', unit: 'L☉', value: 1 },
        c: { const: 'c' }
      },
      stories: {
        mdot: 'A star radiates {P}. How much mass does it lose each second?',
        P: 'A star loses {mdot} as radiation. What is its luminosity?'
      }
    },
    {
      name: 'Energy released from a fraction of the rest energy',
      expr: 'E = f*m*c^2', tex: 'E = f\\, m c^2',
      vars: {
        E: { name: 'energy released', q: 'energy', unit: 'J' },
        f: { name: 'fraction of the rest energy released', q: 'ratio', unit: '%', value: 0.7 },
        m: { name: 'mass of fuel', q: 'mass', unit: 'kg', value: 1 },
        c: { const: 'c' }
      },
      note: 'Typical fractions: chemical $10^{-8}$ %, fission 0.09%, hydrogen fusion 0.7%, annihilation 100%.',
      stories: {
        E: 'Fusing hydrogen into helium frees {f} of its rest energy. How much energy comes from {m} of hydrogen?',
        m: 'A reaction frees {f} of the rest energy of its fuel. How much fuel is needed to release {E}?'
      }
    }
  ],
  examples: [
    {
      title: 'A gram of anything',
      q: 'How much energy is one gram of mass, and how long would it run a household using 10 kWh a day?',
      steps: [
        '$E = mc^2 = 10^{-3}\\ \\mathrm{kg} \\times (3.00\\times10^{8}\\ \\mathrm{m/s})^2 = 9.0\\times10^{13}\\ \\mathrm{J}$.',
        'In kilowatt-hours: $9.0\\times10^{13}/3.6\\times10^{6} = 2.5\\times10^{7}$ kWh.',
        'At 10 kWh a day: $2.5\\times10^{6}$ days, about 6800 years.'
      ],
      a: '9 × 10¹³ J — nearly seven thousand years of household electricity.'
    },
    {
      title: 'The mass defect of helium',
      q: 'A proton has mass 1.007276 u, a neutron 1.008665 u and a helium-4 nucleus 4.001506 u. How much energy binds the helium nucleus? (1 u = 931.5 MeV/$c^2$.)',
      steps: [
        'Two protons and two neutrons: $2(1.007276) + 2(1.008665) = 4.031882$ u.',
        'Mass defect: $4.031882 - 4.001506 = 0.030376$ u.',
        'Energy: $0.030376 \\times 931.5 = 28.3$ MeV, 0.75% of the rest energy of the parts.'
      ],
      a: '28.3 MeV'
    }
  ],
  quiz: [
    { q: 'A cup of coffee has ___ mass when hot than when cold.', choices: ['slightly more', 'slightly less', 'exactly the same', 'no measurable'], a: 0,
      why: 'The hot coffee has more internal energy, and so more mass, by ΔE/c² — around 10⁻¹² kg, far too little to weigh.' },
    { q: 'Roughly what fraction of the rest energy of hydrogen is released when the Sun fuses it into helium?', choices: ['0.000 000 01%', '0.7%', '10%', '100%'], a: 1,
      why: 'The helium nucleus is about 0.7% lighter than the four protons that made it.' },
    { q: 'An electron and a positron at rest annihilate into two photons. Each photon carries…', choices: ['0.511 MeV', '1.022 MeV', '938 MeV', '0.256 MeV'], a: 0,
      why: 'The total rest energy, 2 × 0.511 MeV, is shared equally by two photons flying apart with equal and opposite momenta.' },
    { q: 'In nuclear fission some protons and neutrons are destroyed and turned into energy.', a: false,
      why: 'All the protons and neutrons survive. The fragments are more tightly bound, so their total mass is smaller; that mass difference is the energy released.' }
  ],
  applications: [
    'Nuclear power stations and the Sun, both powered by the mass defect of nuclei.',
    'PET medical scanners, which detect the pairs of 511 keV photons from positron annihilation.',
    'Particle colliders, which turn beam energy into the mass of new particles.'
  ],
  history: 'Einstein\'s short 1905 paper "Does the inertia of a body depend upon its energy content?" derived the relation. John Cockcroft and Ernest Walton checked it in 1932 by splitting lithium nuclei with protons: the alpha particles flew off with the energy of the lost mass. A comparison of gamma-ray energies with precise atomic masses in 2005 confirmed it to better than one part in a million.'
},

{
  id: 'relativistic-energy', parent: 'special-relativity', title: 'Relativistic energy', level: 3,
  short: 'A moving body has total energy γmc² and kinetic energy (γ − 1)mc²; energy, momentum and mass are tied together by E² = (pc)² + (mc²)².',
  keywords: ['relativistic energy', 'relativistic kinetic energy', 'total energy', 'energy–momentum relation', 'E² = (pc)² + (mc²)²', 'gamma', 'electronvolt', 'massless particle', 'invariant mass'],
  prereq: ['mass-energy', 'relativistic-momentum', 'kinetic-energy', 'math:binomial-theorem'],
  related: ['photon', 'particle-accelerators', 'work-energy-theorem'],
  body: `
A body at rest has its [[mass-energy|rest energy]] $mc^2$. Set it moving and its total energy becomes

$$E = \\gamma m c^2 = \\frac{m c^2}{\\sqrt{1 - v^2/c^2}}$$

so its **kinetic energy** — the extra energy due to the motion — is

$$K = E - mc^2 = (\\gamma - 1)\\,m c^2$$

### Newton inside Einstein
For small speeds the [[math:binomial-theorem|binomial expansion]] of $\\gamma$ gives

$$\\gamma = 1 + \\frac12\\frac{v^2}{c^2} + \\frac38\\frac{v^4}{c^4} + \\dots \\quad\\Rightarrow\\quad K = \\tfrac12 m v^2 + \\tfrac38 \\frac{m v^4}{c^2} + \\dots$$

The first term is the familiar [[kinetic-energy|kinetic energy]]; the rest are corrections that matter only near $c$. At $0.1c$ Newton's formula is off by less than 1%; at $0.5c$ it comes out 19% too low; at $0.9c$ the true kinetic energy is more than three times the Newtonian value, and as $v \\to c$ it grows without bound. That is the cosmic speed limit written in terms of energy.

### Energy and momentum together
Combining $E = \\gamma mc^2$ with [[relativistic-momentum|$p = \\gamma m v$]] eliminates the speed:

$$E^2 = (pc)^2 + (mc^2)^2, \\qquad \\frac{v}{c} = \\frac{pc}{E}$$

This is the master equation of particle physics. It holds at any speed, and it covers particles with **no mass**: set $m = 0$ and $E = pc$, $v = c$. A [[photon|photon]] carries momentum $E/c$ and always travels at $c$; a massless particle can never be slowed down or brought to rest.

### Units that make life easy
With energies in MeV, momenta in MeV/$c$ and masses in MeV/$c^2$, the factors of $c$ drop out of the numbers: an electron ($mc^2 = 0.511$ MeV) with $pc = 1$ MeV has $E = \\sqrt{1^2 + 0.511^2} = 1.12$ MeV. When $pc \\gg mc^2$ a particle is **ultra-relativistic** and $E \\approx pc$ — like the 6.8 TeV protons of the Large Hadron Collider, which move only about 3 m/s slower than light.

### Invariant mass
Energy and momentum both change from frame to frame, but $E^2 - (pc)^2$ does not: it always equals $(mc^2)^2$. For a *system* of particles, add all their energies and all their momenta; the same combination gives the system's invariant mass. Two photons flying apart have a mass as a pair even though each is massless — which is how the Higgs boson was recognised in 2012, from pairs of photons with a combined mass of 125 GeV/$c^2$.
`,
  ideas: [
    'Total energy E = γmc²; kinetic energy K = (γ − 1)mc².',
    'At low speed K reduces to ½mv²; near c it grows without limit.',
    'E² = (pc)² + (mc²)² links energy, momentum and mass at any speed.',
    'Massless particles have E = pc and always travel at c.',
    'E² − (pc)² is the same in every frame: the invariant mass.'
  ],
  pitfalls: [
    'Kinetic energy is ½γmv² — It is (γ − 1)mc², which is not the same thing; only at low speed do both approach ½mv².',
    'A photon has no mass, so it has no momentum — It carries momentum p = E/c, which is why light exerts radiation pressure.',
    'The energy of a system of particles is its mass times c² — Only in the frame where the total momentum is zero; in general E² = (pc)² + (Mc²)².'
  ],
  derivation: {
    title: 'Derive K = (γ − 1)mc² from the work done',
    steps: [
      { text: 'Kinetic energy is the work done accelerating the body from rest, with $F = dp/dt$:', tex: 'K = \\int F\\,dx = \\int \\frac{dp}{dt}\\,dx = \\int_0^{p} v\\, dp' },
      { text: '[[math:integration-by-parts|Integrate by parts]], with $p = \\gamma m v$:', tex: 'K = p v - \\int_0^{v} p\\, dv = \\gamma m v^2 - \\int_0^{v} \\frac{m v\\, dv}{\\sqrt{1 - v^2/c^2}}' },
      { text: 'The remaining integral is elementary (substitute $w = 1 - v^2/c^2$):', tex: '\\int_0^{v} \\frac{m v\\, dv}{\\sqrt{1 - v^2/c^2}} = m c^2\\left(1 - \\sqrt{1 - v^2/c^2}\\right) = m c^2 - \\frac{m c^2}{\\gamma}' },
      { text: 'Collect the terms, using $\\gamma v^2/c^2 + 1/\\gamma = \\gamma$:', tex: 'K = \\gamma m v^2 + \\frac{m c^2}{\\gamma} - m c^2 = (\\gamma - 1)\\, m c^2' }
    ]
  },
  formulas: [
    {
      name: 'Relativistic kinetic energy',
      expr: 'K = (1/sqrt(1 - v^2/c^2) - 1)*m*c^2', tex: 'K = \\left(\\frac{1}{\\sqrt{1 - v^2/c^2}} - 1\\right) m c^2',
      vars: {
        K: { name: 'kinetic energy', q: 'energy', unit: 'MeV' },
        v: { name: 'speed', q: 'speed', unit: 'c', value: 0.9, min: 0, max: 0.9999 },
        m: { name: 'rest mass', q: 'mass', unit: 'MeV/c²', value: 938.27 },
        c: { const: 'c' }
      },
      note: 'Proton 938.27 MeV/$c^2$; electron 0.511 MeV/$c^2$.',
      stories: {
        K: 'A particle of rest mass {m} moves at {v}. What is its kinetic energy?',
        v: 'A particle of rest mass {m} has kinetic energy {K}. How fast is it moving?'
      }
    },
    {
      name: 'Energy–momentum relation',
      expr: 'E^2 = (p*c)^2 + (m*c^2)^2', tex: 'E^2 = (p c)^2 + (m c^2)^2', solveFor: 'E',
      vars: {
        E: { name: 'total energy', q: 'energy', unit: 'MeV' },
        p: { name: 'momentum', q: 'momentum', unit: 'MeV/c', value: 1 },
        m: { name: 'rest mass', q: 'mass', unit: 'MeV/c²', value: 0.511 },
        c: { const: 'c' }
      },
      stories: {
        E: 'An electron (rest mass {m}) has momentum {p}. What is its total energy?',
        p: 'A particle of rest mass {m} has total energy {E}. What is its momentum?',
        m: 'A particle with total energy {E} has momentum {p}. What is its rest mass?'
      }
    },
    {
      name: 'Speed from energy and momentum',
      expr: 'v = p*c^2/E', tex: 'v = \\frac{p c^2}{E}',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'c' },
        p: { name: 'momentum', q: 'momentum', unit: 'MeV/c', value: 1 },
        E: { name: 'total energy (rest energy included)', q: 'energy', unit: 'MeV', value: 1.123 },
        c: { const: 'c' }
      },
      note: 'For a massless particle $E = pc$ and this gives $v = c$.',
      stories: {
        v: 'A particle has momentum {p} and total energy {E}. How fast is it moving?'
      }
    }
  ],
  examples: [
    {
      title: 'The price of 0.9c',
      q: 'How much kinetic energy does a proton need to reach $0.9c$? Compare with Newton\'s prediction.',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.81} = 2.294$.',
        '$K = (\\gamma - 1)mc^2 = 1.294 \\times 938.3\\ \\mathrm{MeV} = 1214\\ \\mathrm{MeV}$.',
        'Newton: $\\tfrac12 mv^2 = \\tfrac12 \\times 0.81 \\times 938.3 = 380\\ \\mathrm{MeV}$ — less than a third of the real cost.'
      ],
      a: 'About 1.21 GeV (Newton would say 0.38 GeV).'
    },
    {
      title: 'A 1 MeV electron',
      q: 'An electron has a kinetic energy of 1.00 MeV. Find its total energy, speed and momentum.',
      steps: [
        '$E = K + mc^2 = 1.00 + 0.511 = 1.511$ MeV, so $\\gamma = 1.511/0.511 = 2.957$.',
        '$v = c\\sqrt{1 - 1/\\gamma^2} = c\\sqrt{1 - 0.1144} = 0.941c$.',
        '$pc = \\sqrt{E^2 - (mc^2)^2} = \\sqrt{1.511^2 - 0.511^2} = 1.42$ MeV, so $p = 1.42$ MeV/$c$.',
        'Check: $v/c = pc/E = 1.42/1.511 = 0.941$.'
      ],
      a: 'E = 1.51 MeV, v = 0.941c, p = 1.42 MeV/c.'
    }
  ],
  quiz: [
    { q: 'A particle\'s kinetic energy equals its rest energy. Its speed is…', choices: ['$0.5c$', '$0.707c$', '$0.866c$', '$0.99c$'], a: 2,
      why: '$K = mc^2$ means $\\gamma = 2$, so $v = c\\sqrt{1 - 1/4} = 0.866c$.' },
    { q: 'Which is true of a photon?', choices: ['$E = mc^2$ with $m$ its moving mass', '$E = pc$, and it always moves at $c$', 'It has no momentum because it has no mass', 'It can be brought to rest by a strong enough field'], a: 1,
      why: 'With $m = 0$, $E^2 = (pc)^2$ gives $E = pc$ and $v/c = pc/E = 1$.' },
    { q: 'At $0.5c$, Newton\'s ½mv² for kinetic energy is…', choices: ['exact', 'about 19% too low', 'about 19% too high', 'twice too large'], a: 1,
      why: 'Newton gives $0.125\\,mc^2$; the true value is $(\\gamma - 1)mc^2 = 0.155\\,mc^2$.' },
    { q: 'The combination $E^2 - (pc)^2$ has the same value in every inertial frame.', a: true,
      why: 'It equals $(mc^2)^2$, the rest energy squared, which does not depend on the observer.' }
  ],
  applications: [
    'Designing accelerators and working out the energies of particles in detectors.',
    'Finding new particles from the invariant mass of their decay products.',
    'Radiation pressure and solar sails, which rely on the momentum of massless light.'
  ],
  sim: 'ra-gamma'
},

{
  id: 'relativistic-doppler', parent: 'special-relativity', title: 'Relativistic Doppler effect', level: 3,
  short: 'Light from a moving source is shifted in frequency with no medium involved: redshifted when source and observer separate, blueshifted when they approach, and redshifted even for sideways motion.',
  keywords: ['relativistic Doppler effect', 'redshift', 'blueshift', 'z', 'transverse Doppler effect', 'Ives–Stilwell', 'radial velocity', 'light', 'frequency shift'],
  prereq: ['doppler-effect', 'time-dilation', 'electromagnetic-waves'],
  related: ['hubbles-law', 'stellar-spectra', 'twin-paradox', 'velocity-addition'],
  body: `
Sound from an approaching siren is higher pitched, from a receding one lower: the [[doppler-effect|Doppler effect]]. For sound the answer depends on whether the source or the listener moves through the air. Light has no medium, so only the **relative velocity** of source and observer can matter — and [[time-dilation|time dilation]] has to be included.

### Along the line of sight
Let a source recede at speed $v$ ($\\beta = v/c$) and emit waves with period $T_0$ in its own frame. The observer sees the source's clock run slow, so the crests leave every $\\gamma T_0$. Between crests the source moves $v\\gamma T_0$ farther away, so each crest has further to go, arriving $\\beta\\gamma T_0$ later still. The observed period is $T = \\gamma T_0 (1 + \\beta)$, which simplifies to

$$f = f_0\\sqrt{\\frac{1 - \\beta}{1 + \\beta}} \\qquad \\text{(receding; for an approaching source use } -\\beta)$$

In wavelengths, $\\lambda = \\lambda_0\\sqrt{(1 + \\beta)/(1 - \\beta)}$. Astronomers describe the shift by the **redshift**

$$z = \\frac{\\lambda - \\lambda_0}{\\lambda_0}, \\qquad 1 + z = \\sqrt{\\frac{1 + \\beta}{1 - \\beta}}$$

For $\\beta \\ll 1$, $z \\approx \\beta$, the classical result. A negative $z$ is a blueshift.

### Sideways: the transverse Doppler effect
A source moving *across* the line of sight, at its closest approach, is neither approaching nor receding, so classically there is no shift. Relativity predicts a redshift anyway,

$$f = f_0\\sqrt{1 - \\beta^2} = \\frac{f_0}{\\gamma}$$

which is pure time dilation. Herbert Ives and G. R. Stilwell detected its effect in 1938 using fast hydrogen ions; modern versions with ions in storage rings confirm it to a few parts per billion.

### What it is used for
- Measuring how fast stars move towards or away from us from the shifts of their [[stellar-spectra|spectral lines]], and finding planets by the tiny wobble they cause — now measured below 1 m/s.
- Tracking spacecraft by the Doppler shift of their radio signals, where relativistic terms matter at the precision required.
- Understanding jets from black holes moving at over $0.99c$: blueshifted and brightened when aimed at us, faint when aimed away.

> [!warn] The large redshifts of distant galaxies ($z = 1$, 5, 10…) are not Doppler shifts from motion through space: they come from space itself stretching while the light is on its way ([[hubbles-law|Hubble's law]]). For $z \\ll 1$ the two descriptions agree.
`,
  ideas: [
    'For light only the relative velocity of source and observer matters.',
    'Receding: f = f₀√((1 − β)/(1 + β)); approaching: change the sign of β.',
    'Redshift z = (λ − λ₀)/λ₀; for small speeds z ≈ v/c.',
    'Even sideways motion causes a redshift, by the factor 1/γ — pure time dilation.'
  ],
  pitfalls: [
    'Light from a receding source reaches us slower than c — It arrives at exactly c; only its frequency and wavelength change.',
    'z = v/c works at any speed — At high speed it would give v > c for z > 1. The relativistic formula keeps v below c for any z.',
    'The redshifts of distant galaxies are Doppler shifts, so those galaxies move through space faster than light — Cosmological redshift comes from the expansion of space and follows a different formula at large z.'
  ],
  formulas: [
    {
      name: 'Frequency from a source moving along the line of sight',
      expr: 'f = f0*sqrt((1 - beta)/(1 + beta))', tex: 'f = f_0\\sqrt{\\frac{1 - \\beta}{1 + \\beta}}',
      vars: {
        f: { name: 'received frequency', q: 'frequency', unit: 'THz' },
        f0: { name: 'emitted frequency', q: 'frequency', unit: 'THz', value: 456.8 },
        beta: { name: 'speed of recession as a fraction of c (negative if approaching)', tex: '\\beta', value: 0.2, min: -0.9999, max: 0.9999, signed: true }
      },
      note: '456.8 THz is the red hydrogen-alpha line (656.3 nm).',
      stories: {
        f: 'A galaxy emits a spectral line at {f0} and recedes at β = {beta}. At what frequency do we receive it?',
        beta: 'A line emitted at {f0} is received at {f}. What is the source\'s velocity along the line of sight, as a fraction of c?'
      }
    },
    {
      name: 'Redshift from velocity',
      expr: 'z = sqrt((1 + beta)/(1 - beta)) - 1', tex: 'z = \\sqrt{\\frac{1 + \\beta}{1 - \\beta}} - 1',
      vars: {
        z: { name: 'redshift (negative: blueshift)', signed: true },
        beta: { name: 'speed of recession as a fraction of c', tex: '\\beta', value: 0.1, min: -0.9999, max: 0.9999, signed: true }
      },
      note: 'A pure Doppler shift in flat spacetime. Cosmological redshifts need [[hubbles-law|Hubble\'s law]] instead.',
      stories: {
        z: 'A star recedes at β = {beta}. What redshift do its spectral lines show?',
        beta: 'A source shows a redshift z = {z}. If this were a pure Doppler shift, what would its speed be as a fraction of c?'
      }
    },
    {
      name: 'Transverse Doppler shift',
      expr: 'f = f0*sqrt(1 - beta^2)', tex: 'f = f_0\\sqrt{1 - \\beta^2}',
      vars: {
        f: { name: 'received frequency', q: 'frequency', unit: 'THz' },
        f0: { name: 'emitted frequency', q: 'frequency', unit: 'THz', value: 456.8 },
        beta: { name: 'speed across the line of sight, as a fraction of c', tex: '\\beta', value: 0.5, min: 0, max: 0.9999 }
      },
      note: 'For light received when the source is at its closest approach, moving perpendicular to the line of sight.',
      stories: {
        f: 'A source emitting at {f0} flies past at β = {beta}. What frequency is received at the moment of closest approach?'
      }
    }
  ],
  examples: [
    {
      title: 'A hydrogen line from a galaxy',
      q: 'The hydrogen-alpha line, 656.3 nm in the laboratory, appears at 700.0 nm in a galaxy\'s spectrum. Treating the shift as a Doppler shift, how fast is the galaxy receding?',
      steps: [
        '$1 + z = 700.0/656.3 = 1.0666$, so $z = 0.0666$.',
        'From $(1 + z)^2 = (1 + \\beta)/(1 - \\beta)$: $\\beta = \\dfrac{(1 + z)^2 - 1}{(1 + z)^2 + 1} = \\dfrac{0.1376}{2.1376} = 0.0644$.',
        '$v = 0.0644 \\times 3.00\\times10^{5}\\ \\mathrm{km/s} = 19\\,300$ km/s.',
        'The classical $v = cz$ would give 20 000 km/s — already 3% off at this modest speed.'
      ],
      a: 'About 19 300 km/s, or 0.064c.'
    },
    {
      title: 'Red light turned ultraviolet',
      q: 'A source approaching at $0.6c$ emits red light of wavelength 700 nm. What wavelength arrives?',
      steps: [
        'Approaching, so use $-\\beta$: $\\lambda = \\lambda_0\\sqrt{(1 - 0.6)/(1 + 0.6)} = \\lambda_0\\sqrt{0.25} = \\lambda_0/2$.',
        '$\\lambda = 350$ nm, in the ultraviolet.'
      ],
      a: '350 nm'
    }
  ],
  quiz: [
    { q: 'A source moves directly away from you at $0.6c$. The frequency you receive is…', choices: ['$0.4 f_0$', '$0.5 f_0$', '$0.8 f_0$', '$2 f_0$'], a: 1,
      why: '$\\sqrt{(1 - 0.6)/(1 + 0.6)} = \\sqrt{0.25} = 0.5$.' },
    { q: 'Light from a source moving across your line of sight, received at its closest approach, is…', choices: ['unshifted', 'redshifted by the factor $1/\\gamma$', 'blueshifted by the factor $\\gamma$', 'shifted only if the source accelerates'], a: 1,
      why: 'No approach or recession, but the source\'s clock runs slow: the transverse Doppler effect.' },
    { q: 'Why does the Doppler effect for light differ from that for sound?', choices: ['Light is a transverse wave', 'There is no medium, so only relative velocity matters and time dilation enters', 'Light is always redshifted', 'Light is not shifted when only the observer moves'], a: 1,
      why: 'For sound, motion relative to the air matters; for light there is no preferred frame, and the time dilation of the source is part of the effect.' },
    { q: 'A redshift of z = 2 requires a speed of 2c in the relativistic Doppler formula.', a: false,
      why: '$1 + z = 3$ means $(1 + \\beta)/(1 - \\beta) = 9$, so $\\beta = 0.8$. The formula never needs $v > c$.' }
  ],
  applications: [
    'Radial velocities of stars and the discovery of exoplanets by the wobble method.',
    'Doppler tracking of spacecraft, and radar speed measurement.',
    'Measuring the speed of relativistic jets and of hot gas around black holes.'
  ]
},

{
  id: 'spacetime-interval', parent: 'special-relativity', title: 'Spacetime and the invariant interval', level: 3,
  short: 'Observers disagree about the time and the distance between two events, but they all agree on the interval s² = (cΔt)² − Δx² — the "distance" of spacetime.',
  keywords: ['spacetime', 'interval', 'invariant', 'Minkowski', 'light cone', 'timelike', 'spacelike', 'lightlike', 'proper time', 'worldline', 'spacetime diagram', 'four-dimensional'],
  prereq: ['lorentz-transformation', 'math:pythagorean-theorem', 'math:hyperbola'],
  related: ['twin-paradox', 'simultaneity', 'equivalence-principle', 'math:hyperbolic-functions'],
  body: `
Turn a map and the east–west and north–south distances between two towns change, but the straight-line distance $\\sqrt{\\Delta x^2 + \\Delta y^2}$ does not. In relativity, observers moving relative to each other are like maps turned in **spacetime**: they disagree about time differences and about distances, yet one combination of the two is the same for all of them. Hermann Minkowski recast Einstein's theory in this geometric form in 1908, and it has been the natural language of relativity ever since.

### The invariant interval
For two events separated by $\\Delta t$ in time and $\\Delta x, \\Delta y, \\Delta z$ in space,

$$s^2 = (c\\,\\Delta t)^2 - \\Delta x^2 - \\Delta y^2 - \\Delta z^2$$

has the same value in every inertial frame. You can check it with the [[lorentz-transformation|Lorentz transformation]]: the $\\gamma^2$ factors and the cross terms cancel exactly. It is [[math:pythagorean-theorem|Pythagoras]] with a minus sign — and the minus sign changes everything.

### Three kinds of separation
- **Timelike**, $s^2 > 0$: a light signal would have time to spare getting from one event to the other. Some observer can be present at both; for her they happen at the same place, and $\\tau = s/c$ is the **proper time** between them. Every observer agrees which came first, so one can cause the other.
- **Lightlike**, $s^2 = 0$: only a light signal can link them, and every observer agrees on that.
- **Spacelike**, $s^2 < 0$: they are too far apart for any signal to connect. Some observer finds them simultaneous, and $\\sqrt{-s^2}$ is the distance between them in that frame. Observers disagree about their order — harmlessly, since neither can affect the other.

### The spacetime diagram
Plot $ct$ upwards and $x$ across. A particle traces a **worldline**; light travels at 45°. The two 45° lines through an event form its **light cone**: the future cone holds everything the event can influence, the past cone everything that can influence it, and outside lies "elsewhere". A moving observer's time axis tilts towards the light line, and her line of simultaneity tilts by the same angle from the other side — the diagram's picture of [[simultaneity|relativity of simultaneity]]. Events at the same interval from the origin lie on [[math:hyperbola|hyperbolas]], which play the role that circles play on an ordinary map.

### Proper time and the longest path
Along any worldline, a clock carried on it records the sum of small intervals:

$$d\\tau = \\sqrt{dt^2 - \\frac{dx^2 + dy^2 + dz^2}{c^2}} = dt\\,\\sqrt{1 - v^2/c^2}$$

Because of the minus sign, the straight worldline between two events has the **longest** proper time of all possible paths — the opposite of ordinary geometry, where the straight line is the shortest. Any detour, like the journey of the travelling twin in the [[twin-paradox|twin paradox]], records less time.

> [!note] Some books use the opposite sign convention, $s^2 = \\Delta x^2 - (c\\,\\Delta t)^2$. The physics is identical; "positive" and "negative" simply swap.
`,
  ideas: [
    'Space and time together form four-dimensional spacetime, whose points are events.',
    'The interval s² = (cΔt)² − Δx² − Δy² − Δz² is the same for every inertial observer.',
    'Timelike separations can be causally connected and have a proper time; spacelike ones cannot, and their time order depends on the frame.',
    'Light moves along 45° lines on a spacetime diagram, forming light cones.',
    'Between two events, the straight (inertial) worldline records the most proper time.'
  ],
  pitfalls: [
    'A larger interval means events are farther apart in the everyday sense — Two events linked by light, however far apart in space, have s² = 0.',
    'The straight path between two events takes the least time — In spacetime it records the most proper time; detours record less.',
    'The interval depends on the observer, like Δt and Δx — It is precisely the quantity that does not.'
  ],
  formulas: [
    {
      name: 'Spacetime interval (one space dimension)',
      expr: 's2 = (c*dt)^2 - dx^2',
      vars: {
        s2: { name: 'interval squared (positive: timelike, negative: spacelike)', q: 'area', unit: 'm²', signed: true, tex: 's^2' },
        dt: { name: 'time between the events', q: 'time', unit: 'µs', value: 5, tex: '\\Delta t' },
        dx: { name: 'distance between the events', q: 'length', unit: 'm', value: 900, tex: '\\Delta x' },
        c: { const: 'c' }
      },
      stories: {
        s2: 'Two events are {dt} and {dx} apart in some frame. What is the interval between them, and what kind is it?'
      }
    },
    {
      name: 'Proper time between two events',
      expr: 'tau = sqrt(dt^2 - dx^2/c^2)', tex: '\\tau = \\sqrt{\\Delta t^2 - \\Delta x^2/c^2}',
      vars: {
        tau: { name: 'proper time', q: 'time', unit: 'µs', tex: '\\tau' },
        dt: { name: 'time between the events', q: 'time', unit: 'µs', value: 5, tex: '\\Delta t' },
        dx: { name: 'distance between the events', q: 'length', unit: 'm', value: 900, tex: '\\Delta x' },
        c: { const: 'c' }
      },
      note: 'Only for timelike separations ($c\\,\\Delta t > \\Delta x$): the time on a clock that moves uniformly from one event to the other.',
      stories: {
        tau: 'Two events are {dt} apart in time and {dx} apart in space. How much time passes on a clock that travels uniformly from one to the other?'
      }
    }
  ],
  examples: [
    {
      title: 'Same interval, different frames',
      q: 'In frame S two events are 5.00 µs and 900 m apart. Find the interval and the proper time. Then check that a frame moving at $0.6c$ gets the same interval.',
      steps: [
        '$c\\,\\Delta t = 2.998\\times10^{8} \\times 5.00\\times10^{-6} = 1499$ m, so $s^2 = 1499^2 - 900^2 = 1.437\\times10^{6}\\ \\mathrm{m^2}$: timelike.',
        'Proper time: $\\tau = s/c = 1199\\ \\mathrm{m}/c = 4.00\\ \\mu\\mathrm{s}$.',
        'In S′ ($\\gamma = 1.25$): $c\\,\\Delta t\' = 1.25(1499 - 0.6 \\times 900) = 1199$ m and $\\Delta x\' = 1.25(900 - 0.6 \\times 1499) = 0.8$ m.',
        '$s\'^2 = 1199^2 - 0.8^2 = 1.437\\times10^{6}\\ \\mathrm{m^2}$ — the same. (This frame happens to be almost the one in which both events occur at the same place.)'
      ],
      a: 's² = 1.44 × 10⁶ m² in both frames; proper time 4.00 µs.'
    }
  ],
  quiz: [
    { q: 'Two events have $c\\,\\Delta t = 3$ m and $\\Delta x = 5$ m. Their separation is…', choices: ['timelike', 'lightlike', 'spacelike', 'impossible to classify without a frame'], a: 2,
      why: '$s^2 = 9 - 25 = -16\\ \\mathrm{m^2} < 0$. No signal can link them, and some frame sees them as simultaneous, 4 m apart.' },
    { q: 'On a spacetime diagram with $ct$ up and $x$ across, light moves along lines at…', choices: ['0°', '45°', '60°', 'an angle that depends on the frame'], a: 1,
      why: 'Light covers one unit of $x$ per unit of $ct$ in every frame.' },
    { q: 'Of all the worldlines joining two timelike-separated events, which records the most proper time?', choices: ['The straight (unaccelerated) one', 'The one with the sharpest turn', 'The one that goes nearest to light speed', 'They all record the same'], a: 0,
      why: 'Every departure from straight motion introduces a speed, and $d\\tau = dt\\sqrt{1 - v^2/c^2}$ is then smaller.' },
    { q: 'If the separation of two events is spacelike, observers can disagree about which happened first.', a: true,
      why: 'Spacelike events cannot influence each other, so a frame-dependent order breaks no causal law.' }
  ],
  history: 'Hermann Minkowski, who had taught Einstein mathematics in Zürich, presented the spacetime view in a lecture in Cologne in 1908. Einstein was sceptical at first, but the geometric language became indispensable when he built general relativity.',
  sim: { id: 'ra-spacetime', params: { hyper: true } }
},

{
  id: 'twin-paradox', parent: 'special-relativity', title: 'The twin paradox', level: 2,
  short: 'A twin who travels to a star and back returns younger than the one who stayed home — and there is nothing contradictory about it.',
  keywords: ['twin paradox', 'clock paradox', 'space travel', 'ageing', 'aging', 'proper time', 'turnaround', 'Hafele–Keating', 'Doppler signals'],
  prereq: ['time-dilation', 'simultaneity', 'spacetime-interval'],
  related: ['relativistic-doppler', 'gravitational-time-dilation', 'length-contraction'],
  body: `
Ann stays on Earth. Her twin Bob flies to a star 4 light-years away at $0.8c$, turns round and comes straight back. By Earth's clocks the trip takes $2 \\times 4/0.8 = 10$ years. Bob's clock runs slow by $\\gamma = 1/\\sqrt{1 - 0.64} = 5/3$, so he ages only 6 years. When they meet, Ann is 4 years older than her twin.

### The "paradox"
From Bob's point of view Ann is the one moving, so shouldn't *her* clock run slow, and she be the younger? If [[time-dilation|time dilation]] were perfectly symmetric the story would contradict itself. It is not symmetric: Ann stays in one inertial frame the whole time, while Bob uses **two** — one going out, another coming back — and feels the jolt of turning round. Only Ann can apply the time-dilation formula to the whole trip.

### Bob's accounting
During each leg Bob does see Ann's clock running slow: in his 3 years going out, Ann ages $3/\\gamma = 1.8$ years; same on the way back. The missing years appear at the turnaround. Bob's line of simultaneity — his idea of what time it is "now" on Earth — swings when he changes frame. Using [[simultaneity|leading clocks lag]], each frame's "now" at Earth differs from Earth's own by $vL_0/c^2 = 0.8 \\times 4 = 3.2$ years, in opposite directions for the two legs: switching frames jumps Earth's clock forwards by 6.4 years. Total: $1.8 + 6.4 + 1.8 = 10$ years. Both accounts agree.

### Watching each other's birthdays
Suppose each twin sends a light signal every birthday. The [[relativistic-doppler|Doppler factor]] at $0.8c$ is 3: receding, the signals arrive every 3 years; approaching, every 1/3 year.

- **Bob** receives Ann's signals every 3 years during his 3-year outward leg (1 signal), then every 1/3 year for his 3-year return (9 signals): Ann aged 10 years.
- **Ann** receives Bob's signals every 3 years *until she sees him turn round* — which light from the star shows her only at year 9 — then every 1/3 year for the final year. That is $3 + 3 = 6$ signals: Bob aged 6 years.

The asymmetry is plain: Bob sees the switch from slow to fast signals halfway through his trip, Ann only near the very end.

### Geometry decides
On a [[spacetime-interval|spacetime diagram]], Ann's worldline is straight and Bob's is bent. In spacetime the straight worldline between two events has the **longest** proper time, so the stay-at-home always ages most. Acceleration is not the "cause" — it only tells you which worldline is bent.

> [!fact] The effect has been measured. Atomic clocks flown round the world in 1971 came back behind or ahead of clocks on the ground by the predicted tens of nanoseconds (gravity contributes too), and muons circling a storage ring at CERN in the 1970s lived 29 times longer than at rest, exactly as their speed predicts, despite their enormous centripetal acceleration.
`,
  ideas: [
    'The traveller returns younger: the stay-at-home measures T = 2D/v, the traveller T√(1 − v²/c²).',
    'The situation is not symmetric: the traveller changes inertial frame at the turnaround.',
    'Each twin sees the other\'s clock slow during the legs; the traveller\'s "now" on Earth jumps at the turnaround.',
    'Counting Doppler-shifted birthday signals gives both twins the same answer.',
    'In spacetime the straight worldline between two events has the longest proper time.'
  ],
  pitfalls: [
    'Acceleration makes the travelling clock run slow — The ageing difference comes from the length of the worldline; the brief acceleration only marks which twin changed frames. Longer cruising at the same speed gives a bigger difference with the same acceleration.',
    'By symmetry each twin must end up younger than the other — The twins are not symmetric: only one stays in a single inertial frame.',
    'The traveller "feels" time passing slowly — Bob\'s heart, watch and thoughts all run normally for him; he simply lives through fewer years between the two meetings.'
  ],
  formulas: [
    {
      name: 'Time for the twin who stays home',
      expr: 'T = 2*D/v', tex: 'T = \\frac{2D}{v}',
      vars: {
        T: { name: 'round-trip time on Earth', q: 'time', unit: 'yr' },
        D: { name: 'distance to the star (Earth frame)', q: 'length', unit: 'ly', value: 4 },
        v: { name: 'cruising speed', q: 'speed', unit: 'c', value: 0.8, min: 0, max: 0.9999 }
      },
      stories: {
        T: 'A traveller cruises at {v} to a star {D} away and straight back. How long does the trip take by Earth\'s clocks?'
      }
    },
    {
      name: 'Time for the travelling twin',
      expr: 'tau = 2*D/v*sqrt(1 - v^2/c^2)', tex: '\\tau = \\frac{2D}{v}\\sqrt{1 - v^2/c^2}',
      vars: {
        tau: { name: 'round-trip time on the traveller\'s clock', q: 'time', unit: 'yr', tex: '\\tau' },
        D: { name: 'distance to the star (Earth frame)', q: 'length', unit: 'ly', value: 4 },
        v: { name: 'cruising speed', q: 'speed', unit: 'c', value: 0.8, min: 0, max: 0.9999 },
        c: { const: 'c' }
      },
      note: 'Ignores the time spent accelerating; the turnaround is treated as instantaneous.',
      stories: {
        tau: 'An astronaut cruises at {v} to a star {D} away and straight back. How much does she age during the trip?',
        v: 'An astronaut wants to visit a star {D} away and return having aged only {tau}. How fast must she travel?',
        D: 'Travelling at {v}, an astronaut ages {tau} on a trip to a star and back. How far away is the star?'
      }
    }
  ],
  examples: [
    {
      title: 'Ann and Bob',
      q: 'Bob travels at $0.8c$ to a star 4 ly away and returns at once. How much do Ann (at home) and Bob age?',
      steps: [
        'Earth time: $T = 2 \\times 4\\ \\mathrm{ly}/0.8c = 10$ years.',
        '$\\gamma = 5/3$, so Bob ages $10 \\times 3/5 = 6$ years.',
        'Bob\'s view: in the star\'s direction the distance is contracted to $4 \\times 0.6 = 2.4$ ly, crossed at $0.8c$ in 3 years each way — again 6 years.'
      ],
      a: 'Ann ages 10 years, Bob 6.'
    },
    {
      title: 'To the galactic centre in a lifetime?',
      q: 'The centre of the Milky Way is about 26 000 light-years away. At what constant speed could an astronaut make the one-way trip in 20 years of her own time?',
      steps: [
        'Her time is $\\tau = (D/v)\\sqrt{1 - v^2/c^2}$. With $D$ in ly and $v$ in units of $c$: $\\tau = D\\sqrt{1 - \\beta^2}/\\beta$.',
        '$\\sqrt{1 - \\beta^2}/\\beta = 20/26\\,000 = 7.69\\times10^{-4}$, so $\\gamma\\beta \\approx 1300$ and $\\gamma \\approx 1300$.',
        '$\\beta = 1 - 1/(2\\gamma^2) \\approx 1 - 3\\times10^{-7}$: about 0.9999997$c$. On Earth, 26 000 years would pass.'
      ],
      a: 'About 0.9999997c — possible in principle, fantastically hard in practice.'
    }
  ],
  quiz: [
    { q: 'A twin travels at $0.6c$ to a star 3 ly away and back. How much does she age, compared with 10 years on Earth?', choices: ['6 years', '8 years', '10 years', '12.5 years'], a: 1,
      why: 'Earth time $2 \\times 3/0.6 = 10$ years; $\\gamma = 1.25$, so she ages $10/1.25 = 8$ years.' },
    { q: 'Why is the situation of the twins not symmetric?', choices: ['Only the traveller moves "really"', 'Only the traveller changes inertial frames', 'Earth\'s gravity slows the home twin', 'The traveller\'s clock is damaged by acceleration'], a: 1,
      why: 'Ann stays in one inertial frame; Bob switches frames at the turnaround, and that makes his worldline bent.' },
    { q: 'During the outward leg, Bob (on the ship) judges Ann\'s clock on Earth to be…', choices: ['running fast', 'running slow', 'stopped', 'running at his own rate'], a: 1,
      why: 'Time dilation is symmetric between inertial frames. Ann\'s extra ageing, in Bob\'s account, happens at the turnaround.' },
    { q: 'If Bob made the same trip at the same speed but with a longer, gentler turnaround, the age difference would disappear.', a: false,
      why: 'The difference comes from the long cruising legs. Changing how the turnaround is done changes the result only slightly.' }
  ],
  applications: [
    'Atomic-clock comparisons between aircraft, satellites and ground stations.',
    'Accelerator physics: particles circulating in storage rings age slowly according to their speed.',
    'Estimating what interstellar travel near light speed would mean for travellers and those left at home.'
  ],
  history: 'Paul Langevin posed the travelling-twin story in 1911. The CERN muon storage-ring measurement (Bailey and colleagues, 1977) and the Hafele–Keating flights (1971) are among its many confirmations.',
  sim: 'ra-twins'
}

);
