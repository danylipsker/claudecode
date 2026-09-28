/* HYPER-FEYNMAN · content/least-action.js — the principle of least action.
 *   least-time-action: least-time, least-action-mechanics, lagrangian-mechanics, calculus-of-variations, least-action-fields
 *   sum-over-paths:    why-least-action, path-integral, classical-limit
 * Simulations: sims/least-action.js (prefix act-). */
Hyper.add(

{
  id: 'least-time', parent: 'least-time-action', title: 'The principle of least time', level: 2,
  short: 'Of all the paths light could take between two points, it takes the one that needs the least time — or, more precisely, one whose time does not change when the path is altered slightly. Reflection and refraction both follow from it.',
  keywords: ['Fermat', 'least time', 'Fermat\'s principle', 'lifeguard', 'refraction', 'Snell\'s law', 'reflection', 'refractive index', 'optical path', 'mirage', 'stationary time', 'elliptical mirror'],
  prereq: ['physics:reflection', 'physics:refraction', 'math:extrema'],
  related: ['least-action-mechanics', 'why-least-action', 'lens-and-least-time', 'every-path-counts', 'geometrical-optics-feyn', 'origin-of-refractive-index', 'physics:thin-lenses', 'physics:total-internal-reflection'],
  body: `
Light going from one point to another does not always travel in a straight line: it bounces off mirrors at equal angles and bends where it enters water or glass. Both rules — and all of geometrical optics — can be packed into one sentence, found by Pierre de Fermat in the seventeenth century: **of all the paths light could take between two points, it takes the one that needs the least time.** Feynman opened the optics part of his course with it; it is the first of the "whole path" laws of this branch.

### The lifeguard
A lifeguard stands on the beach 20 m back from the water's edge. A swimmer is in trouble 20 m out and 40 m further along the shore. She runs at 6 m/s on sand but swims at only 1.5 m/s. Which way should she go?

- **The straight line** is the shortest path, but it puts 28 m of it in the slow water: **23.6 s**.
- **Running until she is opposite the swimmer** makes the swim as short as possible (20 m), but the run grows to 45 m: **20.8 s**.
- **The quickest route** lies in between: enter the water 35.5 m along the shore, after 40.8 m of running and before 20.5 m of swimming: **20.5 s**.

At the best entry point the angles to the normal (the line perpendicular to the shore) satisfy

$$\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2}$$

Here θ₁ = 60.6° on the sand and θ₂ = 12.6° in the water, and both sides equal 0.145 s/m (the [[?sine-cosine|sine]] of each angle is the sideways share of that leg). The reason is a balance. Shift the entry point a small distance $dx$ further along. The run gets longer by $dx\\sin\\theta_1$, which costs $dx\\sin\\theta_1/v_1$ of time; the swim gets shorter by $dx\\sin\\theta_2$, which saves $dx\\sin\\theta_2/v_2$. At the best point cost and saving cancel: the [[?derivative]] of the total time with respect to the entry point is zero.

### Light does the same
Light travels at $v = c/n$ in a material of refractive index $n$. Put $v = c/n$ into the lifeguard's rule and it becomes Snell's law of refraction, $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$: going into a slower material, light bends towards the normal, so that less of its path lies in the slow part. For a mirror, the quickest path from A to B that touches the mirror is the one with equal angles: reflect B in the mirror, and the straight line from A to the image is the shortest of all.

| Material | $n$ | speed of light |
|---|---|---|
| vacuum | 1 | 299 792 km/s |
| air | 1.0003 | 299 700 km/s |
| water | 1.333 | 224 900 km/s |
| ordinary glass | about 1.5 | about 200 000 km/s |
| diamond | 2.42 | 123 900 km/s |

The time along a path is the sum of $nL/c$ over its pieces; $nL$ is called the *optical path length*, and least time means least optical path.

### Least, or stationary?
The precise statement is that the time is [[?stationary]]: a small change of the path changes the time only to second order in the change. In the lifeguard example, missing the best point by 1 m costs just 0.016 s, and by 5 m, 0.41 s — twenty-five times as much for five times the error. That is the signature of the flat bottom of a valley, where the change grows as the square of the step.

Sometimes the time is not a minimum. An elliptical mirror sends light from one focus to the other along paths that all take exactly the same time; a mirror curved more strongly than the ellipse makes the actual reflection the *longest* of the nearby paths. What matters is that all the neighbouring paths take nearly the same time. Why that matters — light in a sense tries every path, and only the neighbours of the stationary one reinforce — is the subject of [[why-least-action]] and of QED's [[lens-and-least-time]].

### What it explains
- **Lenses** make every path from a point to its image take the same time: the longer paths through the edge get less glass.
- **Mirages**: light is slightly faster in the thin hot air over a road, so light from the sky dips down, skims the hot layer and curves up into your eye.
- **Late sunsets**: the air bends light from a Sun just below the horizon over the curve of the Earth.

> [!key] Light between two points takes the path whose travel time is stationary — usually the least. At a surface this means $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$; for a mirror, equal angles.

**In the simulation**, drag the entry point along the shore: the graph of the total time is flat at its minimum. Race the three runners, then switch to light. The second simulation shows a lens making every path to its focus take the same time.
`,
  ideas: [
    'Light between two points takes the path that needs the least time (Fermat).',
    'The lifeguard\'s best path balances time on sand against time in water: sin θ₁/v₁ = sin θ₂/v₂.',
    'With v = c/n this is Snell\'s law n₁ sin θ₁ = n₂ sin θ₂; for a mirror it gives equal angles.',
    'Strictly, the time is stationary: nearby paths take almost the same time, which may be a minimum, a maximum or neither.',
    'A lens works by making every path from object to image take the same time.'
  ],
  pitfalls: [
    'Light takes the shortest path — Only in one material. Across a boundary the shortest path puts too much length in the slow material; light takes the quickest path, which bends.',
    'Light must somehow calculate the best path in advance — The principle describes the result, not a mechanism. The differential law (bending at each surface) gives the same path; the deeper explanation, that every path contributes and the neighbours of the stationary one reinforce, comes from quantum mechanics.',
    'The time is always a minimum — It is stationary. Inside an elliptical mirror all paths between the foci take equal times, and for a mirror curved more strongly the real path takes the longest time of its neighbours.'
  ],
  formulas: [
    {
      name: 'The lifeguard\'s rule (least time at a boundary)',
      expr: 'sin(theta1)/v1 = sin(theta2)/v2', tex: '\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2}',
      vars: {
        theta1: { name: 'angle to the normal in the first medium', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\theta_1' },
        v1: { name: 'speed in the first medium', q: 'speed', unit: 'm/s', value: 6, tex: 'v_1' },
        theta2: { name: 'angle to the normal in the second medium', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_2' },
        v2: { name: 'speed in the second medium', q: 'speed', unit: 'm/s', value: 1.5, tex: 'v_2' }
      },
      solveFor: 'theta2',
      note: 'The condition for the quickest path across a straight boundary between two regions of different speed. It holds for lifeguards and for light.',
      stories: {
        theta2: 'A lifeguard runs at {v1} and swims at {v2}. Her quickest path meets the water at {theta1} from the normal. At what angle to the normal does she swim?',
        v2: 'A lifeguard runs at {v1}; her best path crosses the shore at {theta1} on the sand and {theta2} in the water. How fast does she swim?'
      }
    },
    {
      name: 'Snell\'s law',
      expr: 'n1*sin(theta1) = n2*sin(theta2)', tex: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2',
      vars: {
        n1: { name: 'refractive index of the first medium', value: 1.000, tex: 'n_1' },
        theta1: { name: 'angle of incidence (from the normal)', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta_1' },
        n2: { name: 'refractive index of the second medium', value: 1.333, tex: 'n_2' },
        theta2: { name: 'angle of refraction (from the normal)', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_2' }
      },
      solveFor: 'theta2',
      note: 'The lifeguard\'s rule with v = c/n. From a slow medium into a fast one there is no solution beyond the critical angle: total internal reflection.',
      stories: {
        theta2: 'Light in a medium of index {n1} meets a surface at {theta1} and enters a medium of index {n2}. At what angle to the normal does it travel?',
        n2: 'Light arriving from index {n1} at {theta1} is refracted to {theta2}. What is the refractive index of the second medium?'
      }
    },
    {
      name: 'Refractive index: how much slower light is',
      expr: 'n = c/v', tex: 'n = \\frac{c}{v}',
      vars: {
        n: { name: 'refractive index' },
        c: { const: 'c' },
        v: { name: 'speed of light in the material', q: 'speed', unit: 'km/s', value: 225000 }
      },
      stories: { v: 'How fast does light travel in a material of refractive index {n}?', n: 'Light travels at {v} in a liquid. What is its refractive index?' }
    },
    {
      name: 'Travel time through a material (optical path)',
      expr: 't = n*L/c', tex: 't = \\frac{nL}{c}',
      vars: {
        t: { name: 'travel time', q: 'time', unit: 'ns' },
        n: { name: 'refractive index', value: 1.5 },
        L: { name: 'distance travelled in the material', q: 'length', unit: 'm', value: 0.1 },
        c: { const: 'c' }
      },
      note: 'nL is the optical path length. Least time = least total optical path, Σ nL.',
      stories: { t: 'How long does light take to cross {L} of material with refractive index {n}?' }
    }
  ],
  examples: [
    {
      title: 'The lifeguard\'s quickest path',
      q: 'A lifeguard is 20 m from the water\'s edge; a swimmer is 20 m out and 40 m further along the shore. She runs at 6 m/s and swims at 1.5 m/s. Compare the straight line, the path that minimises swimming, and the quickest path.',
      steps: [
        'Let the entry point be $x$ metres along the shore. The time is $T(x) = \\sqrt{20^2 + x^2}/6 + \\sqrt{20^2 + (40 - x)^2}/1.5$.',
        'Straight line ($x = 20$ m): $28.28/6 + 28.28/1.5 = 4.71 + 18.86 = 23.57$ s.',
        'Opposite the swimmer ($x = 40$ m): $44.72/6 + 20/1.5 = 7.45 + 13.33 = 20.79$ s.',
        'Setting $dT/dx = 0$ (or trying values) gives $x = 35.5$ m: $40.78/6 + 20.49/1.5 = 6.80 + 13.66 = 20.46$ s.',
        'Check the rule: $\\sin\\theta_1 = 35.5/40.78 = 0.871$ and $\\sin\\theta_2 = 4.46/20.49 = 0.218$; $0.871/6 = 0.145 = 0.218/1.5$.'
      ],
      a: 'Enter 35.5 m along: 20.5 s, against 20.8 s (least swimming) and 23.6 s (straight line).'
    },
    {
      title: 'Into the water',
      q: 'A ray of light in air strikes a calm pond at 45° from the vertical. Which way does it travel in the water (n = 1.333), and why is that the quickest path?',
      steps: [
        'Snell\'s law: $\\sin\\theta_2 = (1.000/1.333)\\sin 45^\\circ = 0.7071/1.333 = 0.530$.',
        '$\\theta_2 = 32.0^\\circ$: the ray bends towards the vertical.',
        'Light is 1.333 times slower in water, so it pays to cut through the water more steeply and spend a little more of the journey in the fast air — just like the lifeguard running further on sand.'
      ],
      a: '32.0° from the vertical, bent towards the normal.'
    }
  ],
  quiz: [
    { q: 'A lifeguard runs four times faster than she swims. Her quickest path to a swimmer further along the shore…', choices: ['enters the water closer to the swimmer than the straight line does', 'is the straight line', 'enters the water at the point nearest to where she stands', 'follows the shore until she is level with the swimmer, then swims at 45°'], a: 0, why: 'She saves time by doing more of the distance on the fast sand and less in the slow water, so she enters further along than the straight line — but not quite opposite the swimmer.' },
    { q: 'Light passing from air into glass bends towards the normal because it travels more slowly in glass.', a: true, why: 'Bending towards the normal shortens the part of the path in the slow medium; with v = c/n the least-time rule is exactly Snell\'s law.' },
    { q: 'Near the best entry point the graph of time against entry point is flat. If missing it by 1 m costs 0.016 s, missing it by 3 m costs about…', choices: ['0.14 s', '0.048 s', '0.016 s', '0.5 s'], a: 0, why: 'At a stationary point the change grows as the square of the error: 3² × 0.016 ≈ 0.14 s.' },
    { q: 'An elliptical mirror reflects light from one focus to the other. Which statement is true?', choices: ['Every point of the mirror gives a path of the same time', 'Only the shortest of the paths carries light', 'The light takes the path of greatest time', 'No light reaches the second focus'], a: 0, why: 'Every path from focus to mirror to focus has the same length (that is what an ellipse is), so all of them are paths of stationary time and all reflect to the focus.' },
    { q: 'How fast does light travel in water (n = 1.333)?', answer: 224900, unit: 'km/s', why: 'v = c/n = 299 792 km/s ÷ 1.333 ≈ 224 900 km/s.' }
  ],
  problems: [
    { q: 'Light in air strikes a glass surface (n = 1.50) at 60° from the normal. At what angle to the normal does it travel inside the glass?', answer: 35.26, unit: '°', tol: 0.01, hint: 'n₁ sin θ₁ = n₂ sin θ₂ with n₁ = 1.',
      steps: ['$\\sin\\theta_2 = \\sin 60^\\circ/1.50 = 0.8660/1.50 = 0.5774$.', '$\\theta_2 = \\arcsin 0.5774 = 35.26^\\circ$.'] },
    { q: 'How much longer does light take to cross a glass plate 1.0 cm thick (n = 1.50) than to cross 1.0 cm of vacuum?', answer: 16.7, unit: 'ps', tol: 0.02, hint: 'The extra time is (n − 1)L/c.',
      steps: ['Extra time $= (n - 1)L/c = 0.50 \\times 0.010/2.998\\times10^8$.', '$= 1.67\\times10^{-11}$ s $= 16.7$ ps.'] }
  ],
  applications: [
    'Lens and mirror designers use equal optical paths: in a perfect imaging system every path from a point of the object to its image takes the same time, and ray-tracing programs are built on that.',
    'Mirages on hot roads and in deserts: light curves through air whose temperature, and so refractive index, changes with height.',
    'Atmospheric refraction lifts the image of the Sun near the horizon by about half a degree — about its own width — so sunset is seen a couple of minutes late.',
    'Graded-index optical fibres guide light along curved paths through glass whose index falls away from the axis, so that all the paths take nearly the same time and pulses stay sharp.'
  ],
  history: 'Hero of Alexandria (first century AD) showed that a flat mirror reflects light along the shortest path from object to eye. Willebrord Snellius found the law of refraction in 1621 but did not publish it; René Descartes published it in 1637. Pierre de Fermat derived it in 1662 from the principle that light takes the quickest path — which requires light to be slower in water and glass than in air, the opposite of what Descartes\'s model implied. The question was settled in 1850, when Léon Foucault measured light to be slower in water.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 26 (Optics: The Principle of Least Time) — reflection and refraction from least time, the rescuer who runs faster than she swims, and why the time is really stationary.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 27 (Geometrical Optics) — lenses and mirrors worked out from the same idea.',
    '*QED: The Strange Theory of Light and Matter*, ch. 2 — why light seems to take the path of least time, told with arrows.'
  ],
  sim: ['act-lifeguard', { id: 'act-lens-paths', params: { mode: 'lens' } }]
},

{
  id: 'least-action-mechanics', parent: 'least-time-action', title: 'The principle of least action', level: 2,
  short: 'For a ball, a planet or a pendulum, add up kinetic minus potential energy over the whole trip: the path actually taken is the one that makes this total — the action — as small as possible (more precisely, stationary). It says the same as Newton\'s laws, all at once.',
  keywords: ['least action', 'action', 'Hamilton\'s principle', 'Lagrangian', 'kinetic minus potential', 'Mr Bader', 'whole path', 'Maupertuis', 'Lagrange', 'Hamilton', 'stationary action', 'thrown ball', 'parabola'],
  prereq: ['least-time', 'physics:projectile-motion', 'physics:gravitational-potential-energy'],
  related: ['lagrangian-mechanics', 'calculus-of-variations', 'why-least-action', 'path-integral', 'newtons-laws-numerically', 'conservation-of-energy', 'math-and-physics'],
  body: `
Newton's law tells a particle what to do from one instant to the next: feel the force, change the velocity a little, move a little, repeat. In the lecture on least action in volume II, Feynman recalled that his high-school physics teacher, Mr Bader, once showed him a completely different way of stating the same law — one about the whole path at once — and that it made a deep impression on him. It later became the root of his own version of quantum mechanics.

### The statement
Throw a ball straight up and catch it at the same height 2 s later. Plot its height against time: a parabola. Now imagine other motions that start and end at the same places at the same times — staying on the ground, rising along a straight line and falling back, going much higher, wiggling. For each of them, compute the kinetic energy minus the potential energy at every instant and add it up over the trip:

$$S = \\int_{t_1}^{t_2}\\left(\\tfrac12 m v^2 - m g y\\right) dt$$

This number is the [[?action]], in joule-seconds; the quantity inside the [[?integral]], KE − PE, is the [[?lagrangian|Lagrangian]]. The **principle of least action** says that the path the ball really takes is the one for which $S$ is smallest — strictly, [[?stationary]], like the time in [[least-time]].

### A compromise
The action is a contest between two wishes. To keep the kinetic part small, the ball would like to move slowly and evenly — a straight line in the height–time diagram. To make the −PE part as negative as possible, it would like to get high and stay high. Rising quickly costs kinetic energy; lingering low wastes the chance to gain potential energy. The best compromise is to rise fast at first, slow down near the top where it spends the most time, and come down fast: exactly Newton's parabola.

For m = 1 kg and a 2 s trip on Earth, try the family of parabolas $y = A\\,t(T - t)$ of different heights:

| path | highest point | action $S$ |
|---|---|---|
| stays on the ground | 0 | 0 |
| half as high as Newton's | 2.45 m | −24.1 J·s |
| **Newton's parabola** | **4.91 m** | **−32.1 J·s** |
| twice as high | 9.81 m | 0 |

For this family $S(A) = mT^3A(A - g)/6$, a parabola in $A$ whose lowest point is at $A = g/2$ — the free-fall path $y = \\tfrac12 g\\,t(T - t)$.

### Exactly how much worse
For uniform gravity there is a tidy exact result. If $\\eta(t)$ is any deviation from Newton's path that is zero at the start and the end, the action of the deviated path is

$$S = S_{\\text{Newton}} + \\tfrac12 m\\int \\dot\\eta^2\\,dt$$

The extra is never negative, so Newton's path is a true minimum. The term that is first order in $\\eta$ has vanished — the hallmark of a stationary path, worked out in general in [[calculus-of-variations]].

### Nothing new, and yet new
If the whole path makes $S$ stationary, so must every little piece of it; and for a tiny piece, the condition turns out to be $F = ma$ at that moment ([[lagrangian-mechanics]]). The principle therefore contains exactly Newton's laws — for forces that come from a potential — but it states them globally. Feynman valued such equivalent forms: they suggest different guesses when a new law is sought ([[math-and-physics]]). The action form reaches further than Newton's: it carries over unchanged to relativity, to fields, and — as Feynman showed — to quantum mechanics, where it finally explains itself ([[why-least-action]]).

For short trips the true path gives a minimum. For long trips it may not: for a mass on a spring over more than half a period the true path is a saddle, with some deviations raising the action and others lowering it. So the honest name is *stationary* action.

> [!key] Of all the paths between two points in a given time, the real one makes the action $S = \\int (\\mathrm{KE} - \\mathrm{PE})\\,dt$ stationary — for short trips, a minimum.

**In the simulation**, drag the ball's path with the pointer and watch $S$: every bend you add raises it. The graph shows KE, PE and KE − PE along your path. Press *Relax* and watch the path slide down to Newton's parabola while the action falls to its least value.
`,
  ideas: [
    'The action S = ∫(KE − PE) dt is one number for a whole path.',
    'Of all paths with the same ends and the same travel time, the real one makes S stationary — for short trips, a minimum.',
    'For a thrown ball, the balance of "move slowly" (small KE) against "get high" (large PE) gives Newton\'s parabola.',
    'For uniform gravity any deviation η raises S by exactly ½m∫η̇² dt: no first-order change.',
    'The principle is equivalent to F = ma, but it carries over to relativity, fields and quantum mechanics.'
  ],
  pitfalls: [
    'The action is the energy, or the total energy is minimised — It is the time integral of the difference KE − PE, not of the sum; the total energy is constant along the path and plays no role in choosing it.',
    'The ball chooses the path that takes the least time, or the shortest path — The travel time is fixed in advance (the path must go from A at t₁ to B at t₂); among such paths the action decides.',
    'Least action is always a minimum — It is stationary: for long enough trips (a spring over more than half a period) the true path can be a saddle.'
  ],
  formulas: [
    {
      name: 'The Lagrangian of a ball in uniform gravity',
      expr: 'L = m*v^2/2 - m*g*h', tex: 'L = \\tfrac12 m v^2 - m g h',
      vars: {
        L: { name: 'Lagrangian (KE − PE)', q: 'energy', unit: 'J', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 5 },
        g: { const: 'g' },
        h: { name: 'height', q: 'length', unit: 'm', value: 1 }
      },
      solveFor: 'L',
      note: 'The action is the time integral of this quantity along the path.',
      stories: { L: 'A {m} ball moves at {v} at a height of {h}. What is its Lagrangian, KE − PE?', h: 'A {m} ball moving at {v} has a Lagrangian of {L}. How high is it?' }
    },
    {
      name: 'The action of a ball thrown up and caught (Newton\'s path)',
      expr: 'S = -m*g^2*T^3/24', tex: 'S = -\\frac{m g^2 T^3}{24}',
      vars: {
        S: { name: 'action of the true path', q: 'angmom', unit: 'J·s', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        g: { const: 'g' },
        T: { name: 'time in the air', q: 'time', unit: 's', value: 2 }
      },
      note: 'Thrown from and caught at the same height. The action has the units of energy × time, J·s — the same as Planck\'s constant.',
      stories: { S: 'A {m} ball is thrown straight up and caught at the same height {T} later. What is the action of its path?', T: 'The action of a {m} ball\'s up-and-down flight is {S}. How long was it in the air?' }
    },
    {
      name: 'The action of a parabola of any height',
      expr: 'S = m*T^3*A*(A - g)/6', tex: 'S = \\frac{m T^3 A\\,(A - g)}{6}',
      vars: {
        S: { name: 'action of the trial path', q: 'angmom', unit: 'J·s', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        T: { name: 'time from launch to catch', q: 'time', unit: 's', value: 2 },
        A: { name: 'shape constant of the trial path y = A t(T − t)', q: 'accel', unit: 'm/s²', value: 2.4525, min: 0, max: 30 },
        g: { const: 'g' }
      },
      note: 'Smallest at A = g/2, which is free fall. A = 0 (staying on the ground) and A = g (twice as high) both give S = 0.',
      stories: { S: 'A {m} ball flies for {T} along the trial path y = A t(T − t) with A = {A}. What is its action?' }
    }
  ],
  examples: [
    {
      title: 'Which parabola has the least action?',
      q: 'A 1 kg ball leaves the ground and is back 2 s later. Compare the action of the trial paths $y = A\\,t(T - t)$ for $A = 0$, $g/4$, $g/2$ and $g$.',
      steps: [
        'Along $y = A\\,t(T - t)$ the velocity is $v = A(T - 2t)$, so $\\int_0^T \\tfrac12 m v^2\\,dt = \\tfrac12 m A^2 \\cdot T^3/3$.',
        'The potential part is $\\int_0^T m g y\\,dt = m g A \\cdot T^3/6$.',
        { text: 'So the action is', tex: 'S(A) = \\frac{mA^2T^3}{6} - \\frac{mgAT^3}{6} = \\frac{mT^3A(A - g)}{6}' },
        'With $m = 1$ kg, $T = 2$ s: $A = 0$ gives 0; $A = g/4 = 2.45$ m/s² gives −24.1 J·s; $A = g/2$ gives −32.1 J·s; $A = g$ gives 0.',
        'Setting $dS/dA = 0$: $2A - g = 0$, so $A = g/2$ — the free-fall parabola, peak $gT^2/8 = 4.91$ m.'
      ],
      a: 'Newton\'s parabola (A = g/2, peak 4.91 m) has the least action, −32.1 J·s.'
    },
    {
      title: 'A bump costs action',
      q: 'The same ball follows Newton\'s path plus a deviation $\\eta = \\varepsilon\\sin(\\pi t/T)$ with $\\varepsilon = 0.5$ m. By how much does the action rise?',
      steps: [
        'For uniform gravity the extra action is exactly $\\tfrac12 m\\int_0^T \\dot\\eta^2\\,dt$.',
        '$\\dot\\eta = \\varepsilon(\\pi/T)\\cos(\\pi t/T)$, and the average of $\\cos^2$ over the trip is ½, so $\\int\\dot\\eta^2\\,dt = \\varepsilon^2\\pi^2/(2T)$.',
        'Extra action $= m\\varepsilon^2\\pi^2/(4T) = 1 \\times 0.25 \\times 9.87/8 = 0.31$ J·s.'
      ],
      a: 'The action rises by 0.31 J·s, from −32.08 to −31.77 J·s.'
    }
  ],
  quiz: [
    { q: 'The action of a path is…', choices: ['the time integral of kinetic minus potential energy', 'the total energy', 'the time integral of kinetic plus potential energy', 'the length of the path divided by the time'], a: 0, why: 'S = ∫(KE − PE) dt. The sum KE + PE is the energy, which is constant and does not pick out a path.' },
    { q: 'A ball is to go from the ground back to the ground in 2 s. Why doesn\'t the path of least action simply stay on the ground (S = 0)?', choices: ['Rising lets −PE make S negative, and a moderate rise gains more than it costs in KE', 'Because the ball must move', 'Because staying on the ground takes zero time', 'It does: staying on the ground has the least action'], a: 0, why: 'Going up makes the −PE term negative; up to a point that gain beats the extra kinetic term. The best balance is Newton\'s parabola with S = −32.1 J·s.' },
    { q: 'For motion in uniform gravity, every small deviation from Newton\'s path increases the action.', a: true, why: 'The extra action is exactly ½m∫η̇² dt, which is positive for any non-zero deviation that vanishes at the ends.' },
    { q: 'A 1 kg ball is thrown up and caught 4 s later instead of 2 s. By what factor does the magnitude of the action of its path change?', choices: ['8', '2', '4', '16'], a: 0, why: 'S = −mg²T³/24 grows as T³: doubling T multiplies it by 8.' },
    { q: 'What are the SI units of action?', choices: ['J·s', 'J', 'J/s', 'kg·m/s'], a: 0, why: 'Energy integrated over time: joule-seconds, the same units as Planck\'s constant h.' }
  ],
  problems: [
    { q: 'A 0.20 kg ball is thrown straight up and caught at the same height 3.0 s later. What is the action of its path (Newton\'s path)?', answer: -21.65, unit: 'J·s', tol: 0.02, hint: 'S = −mg²T³/24.',
      steps: ['$S = -0.20 \\times 9.81^2 \\times 3.0^3/24$.', '$= -0.20 \\times 96.24 \\times 27/24 = -21.65$ J·s.'] },
    { q: 'For the 1 kg ball flying for 2 s, a trial parabola reaches 7.36 m (A = 3g/4). How much larger is its action than that of Newton\'s path (−32.08 J·s)?', answer: 8.02, unit: 'J·s', tol: 0.02, hint: 'S(A) = mT³A(A − g)/6.',
      steps: ['$S = 1 \\times 8 \\times 7.3575 \\times (7.3575 - 9.81)/6 = -24.06$ J·s.', 'Difference: $-24.06 - (-32.08) = 8.02$ J·s.'] }
  ],
  applications: [
    'Engineers and physicists write the equations of motion of complicated machines — robot arms, satellites, vehicle suspensions — from the action (the Lagrangian method), which avoids working out the internal forces.',
    'Computer simulations of orbits and molecules use "variational integrators", built on a discretised action, which keep energy errors from growing over millions of steps.',
    'Every modern theory of fundamental physics — electromagnetism, general relativity, the Standard Model — is written as an action.'
  ],
  history: 'Pierre-Louis Moreau de Maupertuis proposed a principle of least action in 1744–46; Leonhard Euler put it on a firmer footing at about the same time, and Joseph-Louis Lagrange built his Mécanique analytique (1788) on it. William Rowan Hamilton gave the form used here, with the time integral of the Lagrangian, in 1834–35. Feynman\'s PhD thesis at Princeton (1942, adviser John Wheeler) was titled "The Principle of Least Action in Quantum Mechanics".',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 19 (The Principle of Least Action) — a special lecture, printed almost as it was spoken: the high-school teacher who showed him the idea, the action of a thrown ball, and why a stationary path obeys Newton\'s law.',
    '*The Character of Physical Law*, lecture 2 (The Relation of Mathematics to Physics) — the same law stated in several very different but equivalent ways, one of them a minimum principle.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 26 (Optics: The Principle of Least Time) — the principle of least time, the optical model for least action.'
  ],
  sim: 'act-ball-path'
},

{
  id: 'lagrangian-mechanics', parent: 'least-time-action', title: 'The Lagrangian and the Euler–Lagrange equation', level: 3,
  short: 'Write the kinetic minus the potential energy in any coordinates you like — a distance, an angle, a length of rope — and one equation, d/dt(∂L/∂v) = ∂L/∂x, turns it into the equations of motion, with no forces of constraint to work out.',
  keywords: ['Lagrangian', 'Euler–Lagrange equation', 'generalised coordinates', 'generalised momentum', 'pendulum', 'Atwood machine', 'constraint', 'cyclic coordinate', 'conservation', 'relativistic Lagrangian', 'vector potential', 'analytical mechanics'],
  prereq: ['least-action-mechanics', 'newtons-laws-numerically', 'math:partial-derivatives'],
  related: ['calculus-of-variations', 'conservation-from-symmetry', 'harmonic-oscillator-feyn', 'charges-in-fields', 'vector-potential', 'physics:simple-pendulum', 'physics:conservative-forces'],
  body: `
The principle of least action speaks about whole paths. To calculate with it we need the local rule it implies — a condition that holds at each instant. That rule is the **Euler–Lagrange equation**, and it turns a Lagrangian into equations of motion almost mechanically.

### From L to the motion
Write the [[?lagrangian|Lagrangian]] $L = \\mathrm{KE} - \\mathrm{PE}$ as a [[?function]] of a position coordinate $x$ and its velocity $v = \\dot x$ (the [[?dot-notation|dot]] means the rate of change in time). A path makes the action stationary exactly when, at every moment,

$$\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial v}\\right) = \\frac{\\partial L}{\\partial x}$$

Each side has a meaning. The [[?partial-derivative|partial derivative]] $\\partial L/\\partial v$ — differentiate with respect to $v$, holding $x$ fixed — is the **momentum**: for $L = \\tfrac12 mv^2 - V(x)$ it is $mv$. The other side, $\\partial L/\\partial x = -dV/dx$, is the **force**. So the equation says: the rate of change of momentum equals the force. It is Newton's second law, derived in [[calculus-of-variations]] from $\\delta S = 0$.

### The recipe
1. Choose coordinates that fix the configuration — any you like: a distance, an angle, the length of rope that has run over a pulley.
2. Write the kinetic and potential energies in terms of those coordinates and their rates.
3. Form $L = \\mathrm{KE} - \\mathrm{PE}$.
4. Apply the Euler–Lagrange equation once for each coordinate.

| System | coordinate | Lagrangian | equation of motion |
|---|---|---|---|
| falling ball | height $y$ | $\\tfrac12 m\\dot y^2 - mgy$ | $\\ddot y = -g$ |
| mass on a spring | stretch $x$ | $\\tfrac12 m\\dot x^2 - \\tfrac12 kx^2$ | $m\\ddot x = -kx$ |
| pendulum | angle $\\theta$ | $\\tfrac12 m\\ell^2\\dot\\theta^2 + mg\\ell\\cos\\theta$ | $\\ddot\\theta = -(g/\\ell)\\sin\\theta$ |
| Atwood machine | rope run $x$ | $\\tfrac12(m_1 + m_2)\\dot x^2 + (m_1 - m_2)gx$ | $\\ddot x = (m_1 - m_2)g/(m_1 + m_2)$ |

The pendulum shows the power of the method. With Newton you must resolve the weight and the unknown tension of the string; with the angle as the coordinate, the string is built in and its tension never appears. In the Atwood machine — two masses hanging over a pulley — the tension of the rope drops out in the same way. For a machine with many joints, a robot arm say, this saving is enormous.

### Conservation laws for free
If $L$ does not contain a coordinate at all, $\\partial L/\\partial x = 0$, and the Euler–Lagrange equation says that $\\partial L/\\partial v$ never changes: that momentum is conserved. If $L$ does not depend on time, the quantity $v\\,\\partial L/\\partial v - L$ — the energy — is conserved. These are the simplest cases of the deep link between symmetry and conservation ([[conservation-from-symmetry]]): a law that does not care where you are conserves momentum; one that does not care when conserves energy.

### Beyond Newton
The same machinery works where Newton's form is awkward. For a particle moving near the speed of light, the free Lagrangian is $-mc^2\\sqrt{1 - v^2/c^2}$; for a charge in electric and magnetic fields one adds $-q\\phi + q\\,\\vec v\\cdot\\vec A$, with the scalar potential φ and the [[vector-potential]] $\\vec A$. The Euler–Lagrange equations then give the relativistic motion under the Lorentz force, and the "momentum" $\\partial L/\\partial \\vec v$ becomes $\\gamma m\\vec v + q\\vec A$ — which is why the vector potential turns up in quantum mechanics.

### Why kinetic *minus* potential?
Only the difference gives the right physics. With $L = \\mathrm{KE} + \\mathrm{PE}$ the equation becomes $m\\ddot x = +dV/dx$: a ball would fall upwards and a spring would fling its mass away. No principle chooses the sign in advance; it is fixed by agreement with nature.

> [!key] The Euler–Lagrange equation $\\frac{d}{dt}\\frac{\\partial L}{\\partial v} = \\frac{\\partial L}{\\partial x}$ is "rate of change of momentum = force", written for any coordinates. Choose coordinates, write $L = \\mathrm{KE} - \\mathrm{PE}$, and the motion follows.

**In the simulation**, pick a system and watch the two sides of the Euler–Lagrange equation — the momentum's rate of change and the force — as arrows; the graph follows KE, PE and $L$ in time. Then switch to the wrong sign, KE + PE, and watch the motion run away.
`,
  ideas: [
    'The Euler–Lagrange equation d/dt(∂L/∂v) = ∂L/∂x is the local form of the principle of least action.',
    '∂L/∂v is the momentum and ∂L/∂x the force: for L = ½mv² − V it is Newton\'s second law.',
    'Any coordinates can be used — angles, lengths of rope — and forces of constraint never appear.',
    'A coordinate missing from L means its momentum is conserved; a Lagrangian that does not depend on time conserves energy.',
    'The same recipe covers relativity and charges in fields: L = −mc²√(1 − v²/c²) − qφ + q v·A.'
  ],
  pitfalls: [
    'The Lagrangian is the total energy — It is kinetic minus potential energy. The sum gives the wrong equations: m ẍ = +dV/dx, motion away from equilibrium.',
    'Lagrange\'s method is a different physics from Newton\'s — For forces derived from a potential it gives exactly Newton\'s equations; its advantage is convenience (any coordinates, no constraint forces) and reach (relativity, fields, quantum mechanics).',
    '∂L/∂x means the total change of L along the path — A partial derivative holds the other variables fixed: ∂L/∂x keeps v constant, and ∂L/∂v keeps x constant. The total rate of change along the path comes in only through d/dt on the left.'
  ],
  formulas: [
    {
      name: 'The pendulum, from its Lagrangian',
      expr: 'alpha = -(g/l)*sin(theta)', tex: '\\ddot{\\theta} = -\\frac{g}{\\ell}\\sin\\theta',
      vars: {
        alpha: { name: 'angular acceleration', q: 'angacc', unit: 'rad/s²', signed: true, tex: '\\ddot{\\theta}' },
        g: { const: 'g' },
        l: { name: 'length of the pendulum', q: 'length', unit: 'm', value: 1, tex: '\\ell' },
        theta: { name: 'angle from the vertical', q: 'angle', unit: '°', value: 20, min: -90, max: 90, signed: true, tex: '\\theta' }
      },
      solveFor: 'alpha',
      note: 'From L = ½mℓ²θ̇² + mgℓ cos θ. The mass drops out; for small angles sin θ ≈ θ and the pendulum is a harmonic oscillator.',
      stories: { alpha: 'A pendulum {l} long is released at {theta} from the vertical. What is its angular acceleration at that moment?', theta: 'A pendulum {l} long has an angular acceleration of {alpha}. How far from the vertical is it?' }
    },
    {
      name: 'The Atwood machine, from its Lagrangian',
      expr: 'a = (m1 - m2)*g/(m1 + m2)', tex: 'a = \\frac{(m_1 - m_2)\\,g}{m_1 + m_2}',
      vars: {
        a: { name: 'acceleration of the masses', q: 'accel', unit: 'm/s²', signed: true },
        m1: { name: 'heavier mass', q: 'mass', unit: 'kg', value: 3, tex: 'm_1' },
        m2: { name: 'lighter mass', q: 'mass', unit: 'kg', value: 2, tex: 'm_2' },
        g: { const: 'g' }
      },
      solveFor: 'a',
      note: 'Two masses on a light rope over a frictionless pulley; L = ½(m₁ + m₂)ẋ² + (m₁ − m₂)gx. The tension never appears.',
      stories: { a: 'Masses of {m1} and {m2} hang over a pulley. How fast do they accelerate?', m2: 'A {m1} mass hangs over a pulley against a lighter one, and they accelerate at {a}. What is the lighter mass?' }
    },
    {
      name: 'The spring, from its Lagrangian',
      expr: 'omega = sqrt(k/m)', tex: '\\omega = \\sqrt{\\frac{k}{m}}',
      vars: {
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 40 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 }
      },
      note: 'L = ½mẋ² − ½kx² gives mẍ = −kx, whose solutions swing as cos ωt with this ω.',
      stories: { omega: 'A {m} mass on a spring of stiffness {k}: what angular frequency does the Euler–Lagrange equation give?', k: 'A {m} mass oscillates at {omega}. How stiff is the spring?' }
    }
  ],
  derivation: {
    title: 'The pendulum without the tension',
    steps: [
      { text: 'Use the angle θ from the vertical as the coordinate. The bob moves on a circle of radius ℓ, so its speed is ℓθ̇ and its kinetic energy is:', tex: '\\mathrm{KE} = \\tfrac12 m\\ell^2\\dot\\theta^2' },
      { text: 'Its height above the pivot is −ℓ cos θ, so the potential energy is:', tex: '\\mathrm{PE} = -mg\\ell\\cos\\theta' },
      { text: 'The Lagrangian is the difference:', tex: 'L = \\tfrac12 m\\ell^2\\dot\\theta^2 + mg\\ell\\cos\\theta' },
      { text: 'Differentiate with respect to the rate θ̇, holding θ fixed — this is the angular momentum:', tex: '\\frac{\\partial L}{\\partial\\dot\\theta} = m\\ell^2\\dot\\theta' },
      { text: 'Differentiate with respect to θ, holding θ̇ fixed — this is the torque of gravity:', tex: '\\frac{\\partial L}{\\partial\\theta} = -mg\\ell\\sin\\theta' },
      { text: 'Set the rate of change of the first equal to the second, and divide by mℓ²:', tex: 'm\\ell^2\\ddot\\theta = -mg\\ell\\sin\\theta \\;\\Rightarrow\\; \\ddot\\theta = -\\frac{g}{\\ell}\\sin\\theta' }
    ]
  },
  examples: [
    {
      title: 'The Atwood machine',
      q: 'Masses of 3 kg and 2 kg hang on a light rope over a frictionless pulley. Find their acceleration from the Lagrangian, then the tension.',
      steps: [
        'Let $x$ be the distance the 3 kg mass has gone down (the 2 kg mass has gone up by the same). Both move at $\\dot x$: $\\mathrm{KE} = \\tfrac12(3 + 2)\\dot x^2$.',
        'The potential energy changes by $-3gx + 2gx = -gx$, so $L = \\tfrac52\\dot x^2 + gx$ (in SI units).',
        '$\\partial L/\\partial\\dot x = 5\\dot x$ and $\\partial L/\\partial x = g$, so $5\\ddot x = g$ and $\\ddot x = 9.81/5 = 1.96$ m/s².',
        'The tension was never needed. If you want it, apply Newton to the 2 kg mass alone: $T = 2(g + a) = 2 \\times 11.77 = 23.5$ N.'
      ],
      a: 'a = 1.96 m/s² (and, if wanted, T = 23.5 N).'
    },
    {
      title: 'A conserved momentum for free',
      q: 'A bead slides without friction along a straight horizontal wire, with no forces along the wire. What does the Euler–Lagrange equation say?',
      steps: [
        'Along the wire the potential energy is constant, so $L = \\tfrac12 m\\dot x^2 - V_0$: the coordinate $x$ does not appear.',
        '$\\partial L/\\partial x = 0$, so $\\frac{d}{dt}(m\\dot x) = 0$.',
        'The momentum $m\\dot x$ is constant: the bead coasts. The law does not care where along the wire the bead is, and that is exactly why its momentum is conserved.'
      ],
      a: 'The momentum m ẋ is conserved because x is absent from L.'
    }
  ],
  quiz: [
    { q: 'For L = ½mv² − V(x), what is ∂L/∂v?', choices: ['the momentum mv', 'the kinetic energy', 'the force −dV/dx', 'the acceleration'], a: 0, why: 'Differentiating ½mv² with respect to v gives mv; V does not depend on v.' },
    { q: 'For a spring, L = ½mv² − ½kx². Type ∂L/∂x.', answer: '-k*x', vars: ['k', 'x'], why: 'Hold v fixed: only −½kx² depends on x, and its derivative is −kx — the spring force.' },
    { q: 'If the Lagrangian does not contain a coordinate at all, the momentum belonging to that coordinate is conserved.', a: true, why: 'Then ∂L/∂x = 0, so d/dt(∂L/∂v) = 0.' },
    { q: 'Using L = KE + PE instead of KE − PE for a ball in uniform gravity would predict…', choices: ['a ball accelerating upwards at g', 'exactly the same motion', 'a ball at rest', 'motion at constant speed'], a: 0, why: 'With L = ½mv² + mgy the equation reads mÿ = +mg: the wrong sign of the force.' },
    { q: 'In the Lagrangian treatment of a simple pendulum, the tension in the string…', choices: ['never appears, because the angle already keeps the bob on its circle', 'must be found first', 'is the generalised momentum', 'always equals mg'], a: 0, why: 'Choosing θ as the coordinate builds the constraint in; forces that do no work along the allowed motion drop out.' }
  ],
  problems: [
    { q: 'Masses of 5.0 kg and 3.0 kg hang over a light frictionless pulley. What is their acceleration?', answer: 2.45, unit: 'm/s²', tol: 0.02, hint: 'a = (m₁ − m₂)g/(m₁ + m₂).',
      steps: ['$a = (5.0 - 3.0) \\times 9.81/(5.0 + 3.0)$.', '$= 19.62/8.0 = 2.45$ m/s².'] },
    { q: 'A pendulum 0.80 m long is held at 30° from the vertical and released. What is its angular acceleration at that instant? (Give the sign: positive is away from the vertical.)', answer: -6.13, unit: 'rad/s²', tol: 0.02, hint: 'θ̈ = −(g/ℓ) sin θ.',
      steps: ['$\\ddot\\theta = -(9.81/0.80)\\sin 30^\\circ$.', '$= -12.26 \\times 0.5 = -6.13$ rad/s², back towards the vertical.'] }
  ],
  applications: [
    'Robot arms, cranes and walking machines are modelled with Lagrange\'s equations, one per joint angle; the constraint forces in the joints never have to be computed.',
    'Spacecraft attitude and satellite dynamics, vehicle suspensions and the swaying of tall buildings are all written as Lagrangians.',
    'In particle physics a theory is specified by its Lagrangian; the Standard Model is written as one.'
  ],
  history: 'Leonhard Euler and Joseph-Louis Lagrange found the equation in the 1740s and 1750s while developing the calculus of variations. Lagrange made it the basis of his Mécanique analytique (1788), a treatise that proudly contains no diagrams — only analysis. William Rowan Hamilton\'s reformulation (1834–35) led, a century later, to quantum mechanics, and Feynman\'s path integral returned to the Lagrangian as the natural starting point.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 19 (The Principle of Least Action) — from the stationary action to Newton\'s law, and the action of a relativistic charge in electromagnetic fields.',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 15 (The Vector Potential) — why the combination with the vector potential matters in quantum mechanics.',
    '*Quantum Mechanics and Path Integrals* (Feynman and Hibbs, 1965), ch. 2 — the classical action and the Lagrangian as the starting point of the quantum law of motion.'
  ],
  sim: 'act-euler-lagrange'
},

{
  id: 'calculus-of-variations', parent: 'least-time-action', title: 'The calculus of variations', level: 3,
  short: 'How to find the best path rather than the best number: wiggle the path by a small amount η(t) that vanishes at the ends, and demand that the action does not change to first order. The result is a differential equation — for mechanics, Newton\'s law.',
  keywords: ['calculus of variations', 'variation', 'functional', 'first-order change', 'integration by parts', 'Euler–Lagrange', 'stationary', 'saddle', 'brachistochrone', 'cycloid', 'catenary', 'minimal surface', 'eta', 'bump'],
  prereq: ['least-action-mechanics', 'math:derivative', 'math:extrema'],
  related: ['lagrangian-mechanics', 'least-time', 'least-action-fields', 'classical-limit', 'math:taylor-series', 'math:definite-integral'],
  body: `
Ordinary calculus finds the lowest point of a curve: where the [[?derivative]] is zero, a small step changes the height only to second order. The **calculus of variations** finds the best *function* — the best path, curve or shape — when the quantity to be made least depends on the whole function. Feynman taught its central trick in his lecture on least action: shift the path a little and demand that, to first order, nothing happens.

### A number from a whole path
The action $S[x]$ takes an entire path $x(t)$ and returns one number; such a thing is called a *functional*. To test whether a path $x(t)$ is the stationary one, replace it by

$$x(t) + \\eta(t)$$

where the deviation $\\eta$ is small and is **zero at both ends** — the trial path must still leave and arrive at the given places and times. Expand $S[x + \\eta]$ in powers of $\\eta$, like a [[?taylor-series|Taylor series]]: a constant, then a part proportional to $\\eta$, then parts in $\\eta^2$. The first-order part is the [[?variation]] $\\delta S$. The path is [[?stationary]] when $\\delta S = 0$ for every allowed $\\eta$.

### What the condition says
Carried out for $L = \\tfrac12 m\\dot x^2 - V(x)$ (see the derivation below), the first-order change is

$$\\delta S = \\int_{t_1}^{t_2}\\left(-m\\ddot x - V'(x)\\right)\\eta(t)\\,dt$$

This [[?integral]] must vanish for **every** η. If the bracket were not zero at some moment — positive, say — we could choose η to be a narrow bump just there, and δS would come out positive. So the bracket must be zero everywhere: $m\\ddot x = -V'(x)$ at each instant. A condition on the whole path has become a [[?differential-equation|differential equation]] — Newton's law, or in general the Euler–Lagrange equation of [[lagrangian-mechanics]].

### Seeing it in numbers
Take the thrown ball (1 kg, 2 s) and a bump $\\eta = \\varepsilon\\sin(\\pi t/T)$:

| starting path | $\\varepsilon$ = 0.1 m | $\\varepsilon$ = 0.5 m | $\\varepsilon$ = 1 m |
|---|---|---|---|
| Newton's parabola: change of $S$ | +0.012 J·s | +0.31 J·s | +1.23 J·s |
| staying on the ground: change of $S$ | −1.24 J·s | −5.94 J·s | −11.26 J·s |

From Newton's path the change grows as $\\varepsilon^2$: five times the bump, twenty-five times the change, and the same sign either way. From the wrong path it grows in proportion to $\\varepsilon$, and a bump one way lowers the action: a path that is not stationary can always be improved by nudging it.

### Stationary is not always least
For a mass on a spring (1 kg, 1 N/m, period 6.28 s) followed for 4.5 s — more than half a period — the bump $\\sin(\\pi t/T)$ *lowers* the action by $0.58\\,\\varepsilon^2$ J·s, while $\\sin(2\\pi t/T)$ raises it by $1.07\\,\\varepsilon^2$. The true path is a saddle, a minimum in some directions and a maximum in others. The first-order change is still zero in every direction, and that is all the principle asks.

### Other best curves
- **Shortest path** on a plane: a straight line; on a sphere: an arc of a great circle.
- **Quickest slide** under gravity between two points (the brachistochrone): a cycloid, the curve traced by a point on a rolling wheel — faster than the straight ramp.
- **A hanging chain** takes the shape of least potential energy: the catenary.
- **Soap films** stretch into surfaces of least area.
- **Light**: least time, [[least-time]] — the oldest variational principle of all.

> [!key] To find the stationary path, add a small deviation η(t) that vanishes at the ends and demand that the first-order change of S be zero for every η. Because η can be a bump anywhere, the condition must hold at every instant: a differential equation.

**In the simulation**, choose where the bump sits and how wide it is, then sweep its size ε. The graph of $S(\\varepsilon)$ is flat at ε = 0 when you start from Newton's path and tilted when you start from a wrong path; the strip under the path shows the bracket $m\\ddot x + V'$ that multiplies η. Try the spring over a long time to find a saddle.
`,
  ideas: [
    'A functional gives one number for a whole function, like the action for a path.',
    'Vary the path by η(t), zero at the ends; the first-order change δS must vanish for every η.',
    'Integration by parts moves the derivative off η; because η can be a bump anywhere, the bracket must vanish at each instant — a differential equation.',
    'At a stationary path the change grows as ε²; at any other path it grows as ε and can be made negative.',
    'Stationary may mean a minimum, a maximum or a saddle: a spring followed for more than half a period gives a saddle.'
  ],
  pitfalls: [
    'The deviation η can be anything — It must vanish at the start and the end: the endpoints and the times are fixed. That is what kills the boundary term in the integration by parts.',
    'δS = 0 means the action does not change at all — Only the first-order part vanishes; the second-order part is generally non-zero and decides between minimum, maximum and saddle.',
    'The calculus of variations only works for mechanics — The same method finds shortest paths, quickest slides, hanging chains, soap films, light rays, electrostatic potentials and quantum ground states.'
  ],
  formulas: [
    {
      name: 'Second-order change for a sine bump on Newton\'s path (uniform gravity)',
      expr: 'dS = m*eps^2*pi^2/(4*T)', tex: '\\Delta S = \\frac{m\\,\\varepsilon^2\\pi^2}{4T}',
      vars: {
        dS: { name: 'rise in the action', q: 'angmom', unit: 'J·s', tex: '\\Delta S' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        eps: { name: 'size of the bump', q: 'length', unit: 'm', value: 0.5, tex: '\\varepsilon' },
        T: { name: 'duration of the trip', q: 'time', unit: 's', value: 2 }
      },
      note: 'η = ε sin(πt/T). For uniform gravity this is exact: S rises by ½m∫η̇² dt. No term in ε alone.',
      stories: { dS: 'A {m} ball follows Newton\'s path for {T}, plus a sine-shaped bump of size {eps}. How much does its action rise?', eps: 'A sine bump raises the action of a {m} ball\'s {T} flight by {dS}. How big is the bump?' }
    },
    {
      name: 'First-order change from a path that is not Newton\'s',
      expr: 'dS1 = -2*m*g*eps*T/pi', tex: '\\delta S = -\\frac{2 m g\\,\\varepsilon T}{\\pi}',
      vars: {
        dS1: { name: 'first-order change of the action', q: 'angmom', unit: 'J·s', signed: true, tex: '\\delta S' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        g: { const: 'g' },
        eps: { name: 'size of the bump (upwards)', q: 'length', unit: 'm', value: 0.5, tex: '\\varepsilon' },
        T: { name: 'duration of the trip', q: 'time', unit: 's', value: 2 }
      },
      note: 'Starting from the path that stays on the ground, with η = ε sin(πt/T). The bracket −mẍ − V′ = −mg is not zero, so δS = ∫(−mg)η dt.',
      stories: { dS1: 'A {m} ball "stays on the ground" for {T}; the path is lifted by a sine bump of {eps}. What is the first-order change of the action?' }
    },
    {
      name: 'Second-order change for a spring: minimum or saddle',
      expr: 'dS = (T/4)*(m*pi^2*n^2/T^2 - k)*eps^2', tex: '\\Delta S = \\frac{T}{4}\\left(\\frac{m\\pi^2 n^2}{T^2} - k\\right)\\varepsilon^2',
      vars: {
        dS: { name: 'change of the action', q: 'angmom', unit: 'J·s', signed: true, tex: '\\Delta S' },
        T: { name: 'duration of the trip', q: 'time', unit: 's', value: 4.5 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        n: { name: 'number of half-waves in the bump', int: true, value: 1, min: 1, max: 20 },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 1 },
        eps: { name: 'size of the bump', q: 'length', unit: 'm', value: 0.5, tex: '\\varepsilon' }
      },
      solveFor: 'dS',
      note: 'η = ε sin(nπt/T) added to the true path of a mass on a spring. Negative for n = 1 once T exceeds half a period (π√(m/k)): the true path is then a saddle.',
      stories: { dS: 'A {m} mass on a spring of {k} is followed for {T}. By how much does a bump of {eps} with {n} half-wave(s) change the action?' }
    }
  ],
  derivation: {
    title: 'From δS = 0 to Newton\'s law',
    steps: [
      { text: 'Write the action of the varied path x + η, with L = ½mẋ² − V(x):', tex: 'S[x + \\eta] = \\int_{t_1}^{t_2}\\left[\\tfrac12 m(\\dot x + \\dot\\eta)^2 - V(x + \\eta)\\right]dt' },
      { text: 'Expand the square, and V to first order in η (a Taylor series):', tex: '\\tfrac12 m\\dot x^2 + m\\dot x\\dot\\eta + \\tfrac12 m\\dot\\eta^2 - V(x) - V\'(x)\\,\\eta - \\ldots' },
      { text: 'The terms without η give back S[x]. Keep only the terms of first order in η — they form the variation:', tex: '\\delta S = \\int_{t_1}^{t_2}\\left(m\\dot x\\,\\dot\\eta - V\'(x)\\,\\eta\\right)dt' },
      { text: 'The first term contains the rate of change of η. Integrate it by parts to move the time derivative onto m ẋ:', tex: '\\int m\\dot x\\,\\dot\\eta\\,dt = \\Big[m\\dot x\\,\\eta\\Big]_{t_1}^{t_2} - \\int m\\ddot x\\,\\eta\\,dt' },
      { text: 'The bracket is zero because η vanishes at both ends. What is left multiplies η everywhere:', tex: '\\delta S = \\int_{t_1}^{t_2}\\left(-m\\ddot x - V\'(x)\\right)\\eta(t)\\,dt' },
      { text: 'This must be zero for every η, including a narrow bump at any chosen moment. So the bracket itself vanishes at every instant:', tex: 'm\\ddot x = -\\frac{dV}{dx}' }
    ]
  },
  examples: [
    {
      title: 'First order and second order',
      q: 'A 1 kg ball flies for 2 s. Add the bump $\\eta = \\varepsilon\\sin(\\pi t/T)$ with ε = 0.5 m, first to Newton\'s parabola, then to the path that stays on the ground. How does the action change?',
      steps: [
        'Newton\'s path: only the second-order term survives, $\\Delta S = m\\varepsilon^2\\pi^2/(4T) = 1 \\times 0.25 \\times 9.87/8 = +0.31$ J·s.',
        'Ground path: the bracket $-m\\ddot x - V\' = -mg$ is not zero, so there is a first-order term $\\delta S = \\int(-mg)\\,\\varepsilon\\sin(\\pi t/T)\\,dt = -2mg\\varepsilon T/\\pi = -2 \\times 9.81 \\times 0.5 \\times 2/3.1416 = -6.25$ J·s.',
        'Adding the same second-order term: $-6.25 + 0.31 = -5.94$ J·s. Lifting the ground path lowers its action a lot — it was not stationary.'
      ],
      a: '+0.31 J·s from Newton\'s path; −5.94 J·s from the ground path.'
    },
    {
      title: 'A saddle',
      q: 'A 1 kg mass on a 1 N/m spring is followed for 4.5 s along its true path. Compare bumps with one and with two half-waves, ε = 0.5 m.',
      steps: [
        'For $\\eta = \\varepsilon\\sin(n\\pi t/T)$ the change is $\\Delta S = (T/4)(m\\pi^2n^2/T^2 - k)\\varepsilon^2$.',
        '$n = 1$: $(4.5/4)(9.87/20.25 - 1) \\times 0.25 = 1.125 \\times (-0.513) \\times 0.25 = -0.144$ J·s.',
        '$n = 2$: $1.125 \\times (39.48/20.25 - 1) \\times 0.25 = 1.125 \\times 0.950 \\times 0.25 = +0.267$ J·s.',
        'One direction lowers the action and another raises it: the path is a saddle. For $T$ shorter than half a period ($\\pi$ s here) every bump raises it.'
      ],
      a: '−0.144 J·s for one half-wave, +0.267 J·s for two: a saddle, still stationary.'
    }
  ],
  quiz: [
    { q: 'What must the deviation η(t) do at the start and the end of the trip?', choices: ['be zero', 'be as large as possible', 'equal the velocity', 'nothing in particular'], a: 0, why: 'The trial paths must start and end at the given places and times; that also makes the boundary term of the integration by parts vanish.' },
    { q: 'Starting from Newton\'s path, doubling the size ε of a bump changes the action by…', choices: ['four times as much', 'twice as much', 'the same amount', 'nothing, ever'], a: 0, why: 'There is no first-order term at a stationary path; the change is of second order, ∝ ε².' },
    { q: 'If δS = 0 for every deviation η, then the path obeys mẍ = −dV/dx at every instant.', a: true, why: 'δS = ∫(−mẍ − V′)η dt; since η can be a narrow bump anywhere, the bracket must vanish everywhere.' },
    { q: 'Starting from a path that is not Newton\'s, a small bump in the right direction…', choices: ['lowers the action, in proportion to its size', 'always raises the action', 'leaves the action unchanged to first order', 'changes the endpoints'], a: 0, why: 'At a non-stationary path the first-order term is not zero; its sign follows the sign of ε, so one direction lowers S.' },
    { q: 'The curve of quickest descent between two points (the brachistochrone) is…', choices: ['a cycloid', 'a straight line', 'an arc of a circle', 'a parabola'], a: 0, why: 'Johann Bernoulli\'s problem of 1696; the answer, found by several mathematicians, is the cycloid.' }
  ],
  problems: [
    { q: 'A 0.50 kg ball flies for 1.0 s along Newton\'s path. A sine bump of 0.20 m (η = ε sin(πt/T)) is added. By how much does the action rise?', answer: 0.0493, unit: 'J·s', tol: 0.02, hint: 'ΔS = mε²π²/(4T).',
      steps: ['$\\Delta S = 0.50 \\times 0.20^2 \\times 9.870/(4 \\times 1.0)$.', '$= 0.50 \\times 0.040 \\times 9.870/4 = 0.0493$ J·s.'] },
    { q: 'A 1.0 kg ball "stays on the ground" for 2.0 s. What is the first-order change of the action if the path is lifted by a sine bump of 0.30 m?', answer: -3.75, unit: 'J·s', tol: 0.02, hint: 'δS = −2mgεT/π.',
      steps: ['$\\delta S = -2 \\times 1.0 \\times 9.81 \\times 0.30 \\times 2.0/\\pi$.', '$= -11.77/3.1416 = -3.75$ J·s.'] }
  ],
  applications: [
    'Optimal control — the best trajectory for a rocket, a robot or a chemical reactor — is a calculus-of-variations problem.',
    'Engineers find the buckling loads of columns and the shapes of beams from energy methods: the equilibrium makes the potential energy stationary.',
    'The finite element method, used to compute stresses, heat flow and fields in almost every engineering design, is built on a variational principle.',
    'Computer graphics and image processing use variational methods to smooth surfaces and fill in missing parts of pictures.'
  ],
  history: 'In June 1696 Johann Bernoulli challenged the mathematicians of Europe to find the curve of quickest descent; solutions came from Newton, Leibniz, Jakob Bernoulli and others. Leonhard Euler turned such problems into a general method in 1744. In 1755 the nineteen-year-old Joseph-Louis Lagrange wrote to Euler with a cleaner approach — varying the whole curve — and Euler adopted it and named the subject the calculus of variations.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 19 (The Principle of Least Action) — the calculus of variations shown by shifting a path by a small η, integrating by parts, and arguing with a bump that the bracket must vanish everywhere.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 26 (Optics: The Principle of Least Time) — the first-order change of the time of light, and why the time is stationary.'
  ],
  sim: 'act-variation'
},

{
  id: 'least-action-fields', parent: 'least-time-action', title: 'Least action for fields', level: 3,
  short: 'Fields obey minimum principles too: between conductors the electric potential arranges itself to make the field energy as small as possible. That is Laplace\'s equation in disguise — and any guess gives an energy, and so a capacitance, that is too large.',
  keywords: ['least action for fields', 'electrostatic energy', 'minimum energy', 'Laplace equation', 'Poisson equation', 'relaxation', 'trial function', 'variational method', 'capacitance', 'coaxial cable', 'finite element', 'upper bound', 'Lagrangian density'],
  prereq: ['calculus-of-variations', 'electrostatic-energy-feyn', 'physics:electric-potential'],
  related: ['electrostatic-analogs', 'gauss-law-feyn', 'vector-calculus-fields', 'maxwell-equations-feyn', 'physics:energy-in-capacitor', 'math:laplace-equation'],
  body: `
The principle of least action is not only about particles. Fields — the electric potential in the space between conductors, the temperature through a wall, the sag of a stretched membrane — also arrange themselves so that a total taken over all of space is as small as it can be. In his least-action lecture Feynman took electrostatics as the example, and showed how the principle becomes a practical way of calculating.

### The energy of a potential
Between conductors held at fixed voltages, with no charge in the space between them, the [[?field]] stores energy with density $\\tfrac12\\varepsilon_0E^2$, where $\\vec E = -\\nabla\\phi$ is minus the [[?gradient]] of the potential φ. The total is

$$U^* = \\frac{\\varepsilon_0}{2}\\int (\\nabla\\phi)^2\\,dV$$

(where charges of density ρ are present, $\\int\\rho\\phi\\,dV$ is subtracted). The principle: **of all the ways the potential could vary between the conductors, the real one makes $U^*$ least.** A potential with an unnecessary bump has extra slope, hence extra energy.

### Why this is Laplace's equation
Vary φ by a small $\\eta(x, y, z)$ that is zero on the conductors — their potentials are fixed — exactly as a path was varied in [[calculus-of-variations]]. The first-order change is $\\varepsilon_0\\int\\nabla\\phi\\cdot\\nabla\\eta\\,dV$, and an integration by parts (Gauss's theorem, with η = 0 on the boundary) turns it into $-\\varepsilon_0\\int(\\nabla^2\\phi)\\,\\eta\\,dV$. For this to vanish for every η, the [[?laplacian|Laplacian]] must vanish everywhere:

$$\\nabla^2\\phi = 0 \\qquad \\left(\\text{or } \\nabla^2\\phi = -\\rho/\\varepsilon_0 \\text{ with charges}\\right)$$

The minimum principle and the differential equation are two statements of one law, just as for particles.

### Relaxation: every point the average of its neighbours
On a grid of points, $\\nabla^2\\phi = 0$ says that the potential at each point equals the average of its four neighbours. That suggests how to *find* the minimum: start from any guess and keep replacing each value by the average of its neighbours. Each replacement is exactly the value that minimises the energy of the links around that point, so the total energy can only fall, and the potential settles into the least-energy arrangement. That is what the simulation does — watch the energy graph fall and level off.

### A guess gives an upper bound
Since the true potential has the least energy, **any** trial potential gives an energy that is too large, never too small. For two conductors at a voltage difference $V$ the energy is $U = \\tfrac12 CV^2$, so a trial potential overestimates the capacitance, and a better guess always brings it down. Errors in the trial potential show up in the energy only at second order, so even a crude guess does well.

| coaxial cable, outer radius 3 × inner | capacitance per metre |
|---|---|
| trial: φ falls in a straight line from inner to outer conductor | 55.6 pF (10 % high) |
| exact: φ proportional to $\\ln(b/r)$ | 50.6 pF |

The simulation works on a coarse grid of squares, whose staircase circles make its final answer about 6 % low (47.6 pF); but it too approaches its own minimum from above. Engineers' finite element programs are built on this very idea.

### One principle, many fields
The same minimum describes steady heat flow, the shape of a stretched membrane, slow seepage through soil and the magnetic field of steady currents — the reason why the same equations have the same solutions ([[electrostatic-analogs]]). In quantum mechanics the energy of any trial wave function is at least the true ground-state energy. And all of electrodynamics follows from a single action, $S = \\int\\left[\\tfrac12\\varepsilon_0(E^2 - c^2B^2) - \\rho\\phi + \\vec j\\cdot\\vec A\\right]dV\\,dt$, whose stationary points are Maxwell's equations.

> [!key] Between conductors, the potential minimises the field energy $\\tfrac12\\varepsilon_0\\int(\\nabla\\phi)^2\\,dV$; the condition is Laplace's equation $\\nabla^2\\phi = 0$. Any trial potential gives too much energy, so the capacitance it predicts is too large.

**In the simulation**, watch the potential between the conductors relax, each point towards the average of its neighbours, while the energy — and the capacitance computed from it — falls to its least value. Start from a straight-line guess, from zero or from a scrambled mess; drag across the space to poke the potential and watch the extra energy drain away.
`,
  ideas: [
    'Between conductors at fixed potentials, the potential makes the field energy ½ε₀∫(∇φ)² dV least.',
    'Varying φ by η (zero on the conductors) and demanding no first-order change gives Laplace\'s equation ∇²φ = 0.',
    'On a grid, ∇²φ = 0 means each value is the average of its neighbours; replacing values by averages lowers the energy until the minimum is reached.',
    'Any trial potential gives too much energy, so U = ½CV² makes it overestimate the capacitance; errors enter only at second order.',
    'The same principle covers heat flow, membranes, magnetostatics, quantum ground states — and Maxwell\'s equations come from one field action.'
  ],
  pitfalls: [
    'A trial potential can give a capacitance that is too small or too large — For fixed conductor voltages the true potential has the least energy, so a trial potential always gives an energy — and a capacitance — at or above the true value.',
    'Relaxation is only a numerical trick unrelated to physics — Each step lowers the field energy; the method works precisely because the true potential is the minimum.',
    'Least action for fields needs time and motion — In electrostatics nothing moves, and the principle becomes least energy; the full field action of electrodynamics includes time and gives Maxwell\'s equations.'
  ],
  formulas: [
    {
      name: 'Capacitance of a coaxial cable (exact)',
      expr: 'C = 2*pi*eps0*l/ln(b/a)', tex: 'C = \\frac{2\\pi\\varepsilon_0\\,l}{\\ln(b/a)}',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'pF' },
        eps0: { const: 'eps0' },
        l: { name: 'length of the cable', q: 'length', unit: 'm', value: 1 },
        b: { name: 'inner radius of the outer conductor', q: 'length', unit: 'mm', value: 3 },
        a: { name: 'radius of the inner conductor', q: 'length', unit: 'mm', value: 1 }
      },
      solveFor: 'C',
      note: 'Vacuum (or air) between the conductors; multiply by the relative permittivity for a filled cable. The potential between them falls as ln(b/r).',
      stories: { C: 'An air-filled coaxial line {l} long has conductors of radii {a} and {b}. What is its capacitance?', b: 'A coaxial line {l} long with an inner conductor of radius {a} has a capacitance of {C}. What is the radius of the outer conductor?' }
    },
    {
      name: 'Capacitance from a straight-line trial potential (an upper bound)',
      expr: 'Ct = pi*eps0*l*(b + a)/(b - a)', tex: 'C_t = \\frac{\\pi\\varepsilon_0\\,l\\,(b + a)}{b - a}',
      vars: {
        Ct: { name: 'capacitance estimated from the trial potential', q: 'capacitance', unit: 'pF', tex: 'C_t' },
        eps0: { const: 'eps0' },
        l: { name: 'length of the cable', q: 'length', unit: 'm', value: 1 },
        b: { name: 'inner radius of the outer conductor', q: 'length', unit: 'mm', value: 3 },
        a: { name: 'radius of the inner conductor', q: 'length', unit: 'mm', value: 1 }
      },
      solveFor: 'Ct',
      note: 'Trial potential φ = V(b − r)/(b − a); its energy ½ε₀∫E²dV = ½C_tV². Always at or above the exact 2πε₀l/ln(b/a); close when the gap is thin.',
      stories: { Ct: 'Guess that the potential in a coaxial line ({a} and {b}, {l} long) falls linearly with radius. What capacitance does the guess give?' }
    },
    {
      name: 'Energy stored by a capacitor',
      expr: 'U = C*V^2/2', tex: 'U = \\tfrac12 C V^2',
      vars: {
        U: { name: 'field energy', q: 'energy', unit: 'mJ' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'pF', value: 50.6 },
        V: { name: 'voltage between the conductors', q: 'voltage', unit: 'kV', value: 10 }
      },
      note: 'The link between the minimum-energy field and the capacitance: C = 2U/V².',
      stories: { U: 'A {C} cable is charged to {V}. How much energy is stored in its field?', C: 'A field energy of {U} is stored at {V}. What is the capacitance?' }
    }
  ],
  examples: [
    {
      title: 'A crude guess, a good answer',
      q: 'A coaxial cable has an inner conductor of radius 1 mm and an outer conductor of radius 3 mm, with air between. Estimate its capacitance per metre with a straight-line trial potential, and compare with the exact result.',
      steps: [
        'Trial: $\\phi = V(b - r)/(b - a)$, so the field is uniform, $E = V/(b - a)$, between $r = a$ and $r = b$.',
        'Energy per metre: $\\tfrac12\\varepsilon_0 E^2 \\times \\pi(b^2 - a^2) = \\tfrac12\\varepsilon_0\\pi V^2 (b + a)/(b - a)$.',
        'Setting this equal to $\\tfrac12 C V^2$: $C_t = \\pi\\varepsilon_0(b + a)/(b - a) = \\pi \\times 8.854\\times10^{-12} \\times 4/2 = 55.6$ pF per metre.',
        'Exact: $2\\pi\\varepsilon_0/\\ln 3 = 55.63/1.0986 = 50.6$ pF per metre. The guess is 10 % high — high, as it must be.'
      ],
      a: 'Trial 55.6 pF/m; exact 50.6 pF/m — the trial overestimates by 10 %.'
    },
    {
      title: 'Relaxing a line of points',
      q: 'Three points lie evenly spaced between a plate at 0 V and a plate at 12 V: 0, φ₁, φ₂, φ₃, 12. Start from φ = 0 everywhere and replace each value by the average of its neighbours, left to right, twice. Where is it heading?',
      steps: [
        'Sweep 1: $\\phi_1 = (0 + 0)/2 = 0$; $\\phi_2 = (0 + 0)/2 = 0$; $\\phi_3 = (0 + 12)/2 = 6$.',
        'Sweep 2: $\\phi_1 = (0 + 0)/2 = 0$; $\\phi_2 = (0 + 6)/2 = 3$; $\\phi_3 = (3 + 12)/2 = 7.5$.',
        'The energy (sum of the squared steps) falls from $12^2 = 144$ to $0 + 0 + 36 + 36 = 72$, then to $0 + 9 + 20.25 + 20.25 = 49.5$.',
        'It is heading for the straight line 3, 6, 9 V, with energy $4 \\times 3^2 = 36$ — the least possible, and the solution of $\\nabla^2\\phi = 0$ in one dimension.'
      ],
      a: 'Towards 3, 6, 9 V: a uniform field, the least-energy arrangement.'
    }
  ],
  quiz: [
    { q: 'Between two conductors at fixed voltages, the actual potential…', choices: ['has less field energy than any other potential with the same conductor voltages', 'has more field energy than any other', 'has the same energy as every other', 'is the one with the largest gradient'], a: 0, why: 'The energy ½ε₀∫(∇φ)² dV is least for the true potential; that is equivalent to ∇²φ = 0.' },
    { q: 'A trial potential gives a capacitance of 60 pF. The true capacitance is…', choices: ['at most 60 pF', 'at least 60 pF', 'exactly 60 pF', 'impossible to bound'], a: 0, why: 'The trial energy is at least the true energy, and U = ½CV² at fixed V, so the trial capacitance is an upper bound.' },
    { q: 'On a grid, Laplace\'s equation means each value equals the average of its neighbours.', a: true, why: 'The discrete Laplacian is (sum of the four neighbours − 4φ)/h²; setting it to zero makes φ the average.' },
    { q: 'If the trial potential is wrong by a small amount δ, the energy is wrong by an amount of order…', choices: ['δ²', 'δ', '√δ', 'δ³ always'], a: 0, why: 'At a minimum there is no first-order change; the error enters at second order. That is why crude guesses give good capacitances.' }
  ],
  problems: [
    { q: 'Find the capacitance per metre of an air-filled coaxial line with conductor radii 0.5 mm and 2.0 mm.', answer: 40.1, unit: 'pF', tol: 0.02, hint: 'C = 2πε₀l/ln(b/a).',
      steps: ['$\\ln(2.0/0.5) = \\ln 4 = 1.386$.', '$C = 2\\pi \\times 8.854\\times10^{-12} \\times 1/1.386 = 55.63/1.386 = 40.1$ pF.'] },
    { q: 'For the same line, what does the straight-line trial potential give? (It should be larger.)', answer: 46.4, unit: 'pF', tol: 0.02, hint: 'C_t = πε₀l(b + a)/(b − a).',
      steps: ['$(b + a)/(b - a) = 2.5/1.5 = 1.667$.', '$C_t = \\pi \\times 8.854\\times10^{-12} \\times 1.667 = 46.4$ pF — 16 % high; the wider the gap, the worse a straight line fits the true logarithm.'] }
  ],
  applications: [
    'The finite element method, used to compute electric fields in insulators and machines, heat flow, stresses and vibration modes, is a systematic way of choosing trial functions and minimising an energy.',
    'Designers of cables, connectors and circuit boards compute capacitances and characteristic impedances with field solvers that relax the potential.',
    'In quantum chemistry the variational method finds approximate ground-state energies of atoms and molecules from trial wave functions — always from above.'
  ],
  history: 'Carl Friedrich Gauss (1839–40), William Thomson (Lord Kelvin, 1847) and Peter Gustav Lejeune Dirichlet argued that the potential problem has a solution because the field energy must have a minimum — "Dirichlet\'s principle", which Bernhard Riemann used and Karl Weierstrass showed needed care; David Hilbert put it on a firm footing around 1900. Lewis Fry Richardson computed stresses in a masonry dam by relaxation in 1910, and Richard Southwell developed relaxation methods in the 1930s and 40s.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 19 (The Principle of Least Action) — least action in electrostatics, and the capacitance of a coaxial cable estimated from trial potentials.',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 8 (Electrostatic Energy) — the energy of the electrostatic field, ½ε₀E² per unit volume.',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 12 (Electrostatic Analogs) — why heat flow, membranes, diffusion and other problems share the same equations.'
  ],
  sim: 'act-field-relax'
},

{
  id: 'why-least-action', parent: 'sum-over-paths', title: 'Why nature seems to know the best path', level: 2,
  short: 'A ball does not look ahead, and light does not know where it is going. In quantum mechanics every path is tried: each contributes an arrow turned by its action (or its time). Far from the stationary path neighbouring arrows cancel; near it they agree — so that is the path we see.',
  keywords: ['why least action', 'stationary phase', 'every path', 'arrows', 'phase', 'S/ħ', 'cancellation', 'mirror', 'grating', 'QED', 'local and global', 'Dirac', 'stopwatch'],
  prereq: ['least-action-mechanics', 'least-time', 'bullets-waves-electrons'],
  related: ['path-integral', 'classical-limit', 'arrow-rule', 'every-path-counts', 'lens-and-least-time', 'physics:diffraction-grating', 'math:eulers-formula'],
  body: `
Least time and least action have a puzzling air. A ball does not look ahead and compare paths; light does not know in advance where it will end up. How can a law about the *whole* path be obeyed by something that only feels what is happening here and now? Feynman gave two answers — one classical, one quantum — and the second is the real one.

### Answer one: every piece is also best
If a whole path has stationary action, so does every little piece of it; otherwise we could improve that piece alone. For a very short piece the condition becomes local: it is Newton's law at that moment. So no foresight is needed — obeying $F = ma$ from instant to instant *is* taking the path of stationary action. The global and the local forms are the same mathematics. But this does not say why nature's laws should have such a tidy global form at all.

### Answer two: every path is tried
In quantum mechanics a particle does not have one path. Every conceivable path from A to B contributes an [[?amplitude|arrow]] of the same length, whose direction is set by the path's action: the arrow is turned by the angle $S/\\hbar$, where [[?hbar|ħ]] $= h/2\\pi = 1.055\\times10^{-34}$ J·s. All the arrows are added head to tail, and the chance of arriving is the square of the total — the rule of [[bullets-waves-electrons]], extended to infinitely many ways.

For everyday objects the actions are enormous compared with ħ:

| motion | action $S$ | angle $S/\\hbar$ |
|---|---|---|
| a 1 kg ball in the air for 2 s | 32 J·s | $3.0\\times10^{35}$ rad |
| an electron crossing 1 µm in 1 ns | $4.6\\times10^{-34}$ J·s | 4.3 rad |

Shift the ball's path by a nanometre and its action changes by about $10^{-18}$ J·s — $10^{16}$ radians of turning. Paths away from the classical one therefore have arrows pointing every which way, and neighbours cancel. But near the path of **[[?stationary]]** action, the action does not change to first order: a whole bundle of neighbouring paths has nearly the same action, their arrows point the same way, and they add up. The particle is found along the stationary path because that is the only place where the arrows do not cancel. For light the arrow turns once per period of travel time, so the same argument picks out the path of stationary *time*: [[least-time]] is explained too.

### The mirror, once more
In *QED* Feynman told this with a mirror. Every point of a mirror reflects: light from the source can bounce off any part of it on the way to the detector. Plot the travel time for each path: a curve with a flat bottom where the angles are equal. Near the bottom neighbouring paths take almost the same time and their arrows line up; near the ends the time changes fast and the arrows curl into tight spirals that add to almost nothing. Cover the ends and the reflection hardly changes; cover the middle and it almost vanishes. Scrape the mirror into a grating that keeps only the strips whose arrows point one way, and light is reflected in directions that break the "equal angles" rule — as the colours on a compact disc show.

### What "least" really meant
The principle is then no longer mysterious: "least" should have been "stationary", and it is a consequence of adding arrows. Where it fails — where the actions involved are only a few ħ, as for an electron in an atom — no single path stands out, and the whole sum must be done ([[path-integral]]). How the sharp classical path grows out of the quantum sum as ħ becomes relatively small is the subject of [[classical-limit]].

> [!key] Every path contributes an arrow turned by $S/\\hbar$ (for light: by the travel time, one turn per period). Far from the stationary path neighbouring arrows point in different directions and cancel; near it they agree and add. That is why nature seems to choose the path of stationary action.

**In the simulations**, first send many trial paths from A to B, each with its arrow; add them head to tail and see the ones near the classical path line up while the others curl away. Then go to the mirror: cover its middle, then its ends, then scrape it into a grating.
`,
  ideas: [
    'Classically, a stationary whole path means every small piece obeys Newton\'s law — no foresight is needed.',
    'Quantum mechanically, every path contributes an arrow turned by S/ħ; the probability is the square of the sum.',
    'Away from the stationary path, S changes fast, neighbouring arrows point differently and cancel.',
    'Near the stationary path, S changes only at second order, so the arrows agree and add: that is the classical path.',
    'For light the arrow turns once per period of travel time, so the same argument gives least time; a mirror\'s ends and a grating show it.'
  ],
  pitfalls: [
    'The particle calculates the best path in advance — Nothing is calculated: either it obeys the local law from moment to moment, or (quantum mechanically) all paths contribute and only the bundle near the stationary one survives the adding of arrows.',
    'Paths far from the classical one are forbidden — They contribute arrows just as long as the others; they are cancelled by their neighbours. Block some of the neighbours, as a grating does, and they reveal themselves.',
    'Only the single stationary path contributes — A bundle of neighbouring paths contributes, of width set by where their action differs by about πħ. For large objects the bundle is fantastically narrow; for electrons in atoms it is atom-sized.'
  ],
  formulas: [
    {
      name: 'The angle of a path\'s arrow',
      expr: 'phi = S/hbar', tex: '\\varphi = \\frac{S}{\\hbar}',
      vars: {
        phi: { name: 'angle turned by the arrow', q: 'angle', unit: 'rad', signed: true, tex: '\\varphi' },
        S: { name: 'action of the path', q: 'angmom', unit: 'J·s', value: 4.555e-34, signed: true },
        hbar: { const: 'hbar' }
      },
      note: 'Only differences of angle between paths matter. A difference of πħ in action turns one arrow opposite to another.',
      stories: { phi: 'A path has an action of {S}. Through what angle is its arrow turned?', S: 'The arrow of a path is turned by {phi}. What is the action of the path?' }
    },
    {
      name: 'The angle of a light path\'s arrow',
      expr: 'phi = 2*pi*f*t', tex: '\\varphi = 2\\pi f t',
      vars: {
        phi: { name: 'angle turned by the arrow', q: 'angle', unit: 'rad', tex: '\\varphi' },
        f: { name: 'frequency of the light', q: 'frequency', unit: 'THz', value: 500 },
        t: { name: 'travel time along the path', q: 'time', unit: 'ps', value: 0.1 }
      },
      note: 'QED\'s stopwatch: one turn per period 1/f. Two paths whose times differ by half a period have opposite arrows.',
      stories: { phi: 'Light of {f} takes {t} along a path. How far has its arrow turned?', t: 'How much longer must a path of {f} light take for its arrow to turn by {phi} more?' }
    }
  ],
  examples: [
    {
      title: 'How narrow is the ball\'s bundle of paths?',
      q: 'A 1 kg ball flies for 2 s. Its path is shifted by a sine-shaped bump of size ε. For what ε does the action change by πħ — enough to turn the arrow round?',
      steps: [
        'From [[calculus-of-variations]], the change is $\\Delta S = m\\varepsilon^2\\pi^2/(4T)$.',
        'Set $\\Delta S = \\pi\\hbar$: $\\varepsilon = \\sqrt{4T\\hbar/(\\pi m)} = \\sqrt{4 \\times 2 \\times 1.055\\times10^{-34}/\\pi}$.',
        '$\\varepsilon = \\sqrt{2.69\\times10^{-34}} = 1.6\\times10^{-17}$ m.'
      ],
      a: 'About 10⁻¹⁷ m — a hundredth of the size of a proton. The ball\'s path is as sharp as anything we could measure.'
    },
    {
      title: 'The arrow of an electron\'s path',
      q: 'An electron (9.11 × 10⁻³¹ kg) moves freely 1 µm in 1 ns along a straight line. What is the action of this path, and through what angle is its arrow turned?',
      steps: [
        'For a free particle $S = \\int\\tfrac12 mv^2\\,dt = \\tfrac12 m v^2 T = m d^2/(2T)$.',
        '$S = 9.11\\times10^{-31} \\times (10^{-6})^2/(2\\times10^{-9}) = 4.55\\times10^{-34}$ J·s.',
        '$S/\\hbar = 4.55\\times10^{-34}/1.055\\times10^{-34} = 4.3$ rad — less than one turn.'
      ],
      a: 'S = 4.6 × 10⁻³⁴ J·s; the arrow turns 4.3 rad. Nearby paths differ by a fraction of a turn: very many of them count.'
    }
  ],
  quiz: [
    { q: 'Why do paths far from the classical one contribute almost nothing?', choices: ['Their neighbours\' arrows point in quite different directions and cancel', 'Their arrows have zero length', 'They are forbidden by conservation of energy', 'They take too long'], a: 0, why: 'Every path\'s arrow has the same length; away from the stationary path the action changes quickly, so neighbouring arrows cancel.' },
    { q: 'In the quantum picture a particle follows exactly one path, the classical one.', a: false, why: 'All paths contribute arrows; the classical path is where the contributions add up instead of cancelling.' },
    { q: 'You cover the two ends of a mirror, leaving the middle. The light reflected to the detector…', choices: ['hardly changes', 'disappears', 'doubles', 'goes to the other side'], a: 0, why: 'The ends contribute spirals of arrows that nearly cancel; almost all of the total comes from the middle, near the equal-angle point.' },
    { q: 'The arrow for a path is turned by the angle…', choices: ['S/ħ', 'S·ħ', 'ħ/S', 'the length of the path in metres'], a: 0, why: 'The phase is the action measured in units of ħ.' },
    { q: 'A path has an action of 1.0 × 10⁻³³ J·s. Through how many radians is its arrow turned?', answer: 9.48, unit: 'rad', why: 'S/ħ = 1.0 × 10⁻³³ / 1.055 × 10⁻³⁴ = 9.48 rad, about 1.5 turns.' }
  ],
  problems: [
    { q: 'Two paths of light of frequency 5.0 × 10¹⁴ Hz differ in travel time by 1.0 fs. What is the angle between their arrows?', answer: 3.14, unit: 'rad', tol: 0.02, hint: 'The arrow turns 2π per period, 2πf per second.',
      steps: ['$\\Delta\\varphi = 2\\pi f\\,\\Delta t = 2\\pi \\times 5.0\\times10^{14} \\times 1.0\\times10^{-15}$.', '$= 3.14$ rad: the arrows are opposite, and the two paths cancel.'] },
    { q: 'A 1.0 g bead is thrown and caught 1.0 s later. How large a sine-shaped change of its path makes its action differ by πħ from Newton\'s?', answer: 3.66e-16, unit: 'm', tol: 0.03, hint: 'm ε² π²/(4T) = πħ.',
      steps: ['$\\varepsilon = \\sqrt{4T\\hbar/(\\pi m)} = \\sqrt{4 \\times 1.0 \\times 1.055\\times10^{-34}/(\\pi \\times 10^{-3})}$.', '$= \\sqrt{1.34\\times10^{-31}} = 3.7\\times10^{-16}$ m.'] }
  ],
  applications: [
    'Diffraction gratings — in spectrometers, on compact discs, in the colours of some beetles and birds — work by removing or retarding the paths whose arrows would have cancelled.',
    'Fresnel zone plates focus X-rays and radio waves with rings that block every other zone of paths.',
    'The stationary-phase approximation, the mathematical form of this argument, is used throughout physics and engineering: in radar, seismology, optics and semiclassical quantum mechanics.'
  ],
  history: 'In 1933 Paul Dirac noted that in quantum mechanics the quantity exp(iS/ħ) plays the part of the amplitude for a short step, and remarked that this explains the classical principle of least action. Around 1941, as a graduate student at Princeton, Feynman learned of Dirac\'s remark from the visiting physicist Herbert Jehle and worked out that the relation is exact — the start of his sum over paths. He told the story in his Nobel lecture of 1965. The mirror and grating explanation for a general audience is in his 1979 Auckland lectures, published as *QED* (1985).',
  sources: [
    '*QED: The Strange Theory of Light and Matter*, ch. 2 — the mirror, the arrows of every path, covering parts of it, the grating, and why light seems to take the path of least time.',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 19 (The Principle of Least Action) — the local form of the principle, and how quantum mechanics explains it: neighbouring paths with nearly equal action.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 26 (Optics: The Principle of Least Time) — light tries nearby paths, and those with nearly the same time reinforce.'
  ],
  sim: ['act-many-paths', { id: 'act-lens-paths', params: { mode: 'mirror' } }]
},

{
  id: 'path-integral', parent: 'sum-over-paths', title: 'Feynman\'s sum over histories', level: 3,
  short: 'The amplitude to go from a to b is the sum, over every possible path, of an arrow e^{iS/ħ} turned by that path\'s action. Slice time into steps and integrate over every position at every step: out come the free particle\'s waves, diffraction, the two slits and the Schrödinger equation.',
  keywords: ['path integral', 'sum over histories', 'sum over paths', 'propagator', 'kernel', 'e^{iS/ħ}', 'time slicing', 'Cornu spiral', 'Fresnel', 'diffraction', 'two slits', 'Schrödinger equation', 'Dirac', 'space-time approach', 'Feynman–Kac'],
  prereq: ['why-least-action', 'probability-amplitudes', 'math:complex-numbers'],
  related: ['classical-limit', 'bullets-waves-electrons', 'schrodinger-equation-feyn', 'feynman-diagrams', 'every-path-counts', 'physics:de-broglie-wavelength', 'math:eulers-formula'],
  body: `
Feynman's own formulation of quantum mechanics takes the arrows of [[why-least-action]] literally. The amplitude for a particle to go from a place $a$ at time $t_a$ to a place $b$ at time $t_b$ is a sum over **every** path $x(t)$ joining them — straight, curved, zigzag, via the Moon:

$$K(b, a) = \\sum_{\\text{all paths}} C\\,e^{iS[x]/\\hbar}$$

Each path contributes a [[?complex-number|complex number]] of the same size: an arrow of fixed length turned by the angle $S/\\hbar$ ([[?euler-formula|Euler's formula]]). No path is preferred — the action only sets each arrow's direction. The probability of arriving is the [[?absolute-square]] $|K|^2$. Feynman published this "space-time approach" in 1948.

### Slicing time
How do you add up "all paths"? Cut the trip into $N$ short steps of duration ε. A path is then a list of positions $x_1, \\ldots, x_{N-1}$ at the intermediate times, its action is a [[?sum]] of pieces $L\\,\\varepsilon$, and "every path" means letting each intermediate position take every value — one [[?integral]] per slice:

$$K(b, a) = \\lim_{N\\to\\infty}\\frac{1}{A^N}\\int dx_1\\cdots\\int dx_{N-1}\\; e^{iS(x_0, x_1, \\ldots, x_N)/\\hbar}, \\qquad A = \\sqrt{\\frac{2\\pi i\\hbar\\varepsilon}{m}}$$

The factor $A$ for each slice keeps the total finite. Letting a single slice act on a wave function and expanding in ε gives the Schrödinger equation: the sum over paths contains all of ordinary quantum mechanics.

### One screen halfway
The simplest case keeps a single slice. Think of $x$ as the sideways position of a particle in a beam that flies forward steadily, so that time along the beam stands for distance. The particle starts at $x_a$, must pass at the halfway time through some point $u$ of a "screen" — every point allowed unless blocked — and arrives at $x_b$ after time $T$. For a free particle each half is a straight line, and

$$S(u) = \\frac{m(u - x_a)^2}{T} + \\frac{m(x_b - u)^2}{T}$$

Lay the arrows for all $u$ head to tail and they form a **Cornu spiral**: those from points near the straight line $x_a \\to x_b$ lie almost in line; farther out they curl into two tight "eyes". The total, eye to eye, is set by a central zone about $\\sqrt{\\pi\\hbar T/2m}$ wide — 0.43 µm for an electron and $T$ = 1 ns. Now block parts of the screen:

| screen | what the sum gives at $b$ |
|---|---|
| no screen | a uniform spread: the free particle |
| one narrow slit | a wide diffraction pattern |
| two slits | interference fringes — the [[bullets-waves-electrons|two-slit experiment]] |
| a straight edge | fringes at the edge of the shadow |

With slits $s$ apart the arrows of the two paths differ by $2ms\\,x_b/\\hbar T$, so the fringes are $hT/2ms$ apart — for electrons, slits 1 µm apart and $T$ = 1 ns, 0.36 µm. That is the optics formula λL/d with the de Broglie wavelength: the wave nature of matter comes out of the sum over paths.

### Exact for a free particle
With all slices, the free particle's sum can be done exactly:

$$K(b, a) = \\sqrt{\\frac{m}{2\\pi i\\hbar T}}\\;e^{im(x_b - x_a)^2/2\\hbar T}$$

The exponent is the action of the classical path, $md^2/2T$, divided by ħ. As $x_b$ moves, the angle changes at the rate $md/\\hbar T = p/\\hbar$: one full turn per $h/p$ — the de Broglie wavelength. For every Lagrangian that is quadratic (free particles, uniform fields, oscillators) the answer has this form, a factor times $e^{iS_{\\text{classical}}/\\hbar}$.

### Why it matters
The sum over histories treats space and time together, which made it natural for relativity; Feynman diagrams ([[feynman-diagrams]]) are terms in a sum over the histories of particles and fields. In imaginary time the arrows become real weights $e^{-S/\\hbar}$, and the same sums describe heat, diffusion and statistical mechanics.

> [!key] $K(b, a) = \\sum e^{iS/\\hbar}$ over all paths from $a$ to $b$; the probability is $|K|^2$. Blocking paths (slits, edges) changes the sum — that is diffraction and interference.

**In the simulation**, paths go from the source through every point of a screen at the halfway time to the detector; their arrows form the Cornu spiral. Open one slit, two slits or an edge, drag the detector, and watch the graph of $|K|^2$ across the far side turn into diffraction and interference patterns.
`,
  ideas: [
    'The amplitude K(b, a) is a sum over all paths from a to b, each weighted by e^{iS/ħ} — equal length, different direction.',
    'Slicing time into steps turns "all paths" into one integral over position per slice; one slice at a time gives the Schrödinger equation.',
    'With one screen halfway, the arrows form a Cornu spiral: the total is set by a central zone of width √(πħT/2m).',
    'Blocking paths gives diffraction; keeping two groups gives two-slit fringes spaced hT/2ms — the de Broglie wavelength emerges.',
    'For a free particle K ∝ e^{iS_classical/ħ}: the classical action sets the phase of the quantum wave.'
  ],
  pitfalls: [
    'The particle really travels along all paths at once, like a spreading cloud — The sum is a rule for computing amplitudes; each detection finds the particle in one place. What is "real" between source and detector is not something the theory says.',
    'Only smooth, reasonable paths count — The sum includes wildly zigzagging paths; in the limit of fine slicing the typical contributing path is continuous but nowhere smooth, like a random walk.',
    'The path integral is a different theory from Schrödinger\'s — It gives exactly the same predictions; it is a different formulation, often easier for relativity, fields and approximations.'
  ],
  formulas: [
    {
      name: 'The action of a free particle\'s straight path',
      expr: 'S = m*d^2/(2*T)', tex: 'S = \\frac{m d^2}{2T}',
      vars: {
        S: { name: 'action of the classical path', q: 'angmom', unit: 'J·s' },
        m: { const: 'me', name: 'mass of the particle (here an electron)', tex: 'm' },
        d: { name: 'distance travelled', q: 'length', unit: 'µm', value: 1 },
        T: { name: 'time taken', q: 'time', unit: 'ns', value: 1 }
      },
      note: 'Only kinetic energy: S = ½mv²T with v = d/T. Change the mass for other particles.',
      stories: { S: 'An electron moves freely {d} in {T}. What is the action of its path?', d: 'The straight path of an electron taking {T} has an action of {S}. How far did it go?' }
    },
    {
      name: 'The phase of the free-particle amplitude',
      expr: 'phi = m*d^2/(2*hbar*T)', tex: '\\varphi = \\frac{m d^2}{2\\hbar T}',
      vars: {
        phi: { name: 'angle of the arrow', q: 'angle', unit: 'rad', tex: '\\varphi' },
        m: { const: 'me', name: 'mass of the particle (here an electron)', tex: 'm' },
        d: { name: 'distance from a to b', q: 'length', unit: 'µm', value: 1 },
        hbar: { const: 'hbar' },
        T: { name: 'time from a to b', q: 'time', unit: 'ns', value: 1 }
      },
      note: 'The exponent of K(b, a) = √(m/2πiħT) e^{imd²/2ħT}: the classical action over ħ.',
      stories: { phi: 'By what angle is the free-particle arrow of an electron turned for a trip of {d} in {T}?' }
    },
    {
      name: 'Two slits from the sum over paths: fringe spacing',
      expr: 'dx = h*T/(2*m*s)', tex: '\\Delta x = \\frac{hT}{2ms}',
      vars: {
        dx: { name: 'distance between bright fringes', q: 'length', unit: 'µm', tex: '\\Delta x' },
        h: { const: 'h' },
        T: { name: 'total time, with the slits halfway', q: 'time', unit: 'ns', value: 1 },
        m: { const: 'me', name: 'mass of the particle (here an electron)', tex: 'm' },
        s: { name: 'distance between the slits', q: 'length', unit: 'µm', value: 1 }
      },
      note: 'The same as λL/d with λ = h/(mv) and L = vT/2: the de Broglie wavelength emerges from the actions.',
      stories: { dx: 'Electrons pass two slits {s} apart halfway through a {T} trip. How far apart are the fringes?', s: 'Electron fringes are {dx} apart after a {T} trip with the slits halfway. How far apart are the slits?' }
    }
  ],
  examples: [
    {
      title: 'Two slits, from two actions',
      q: 'In the one-screen model, an electron starts at $x_a = 0$, passes through one of two slits at $u = \\pm s/2$ at the halfway time and arrives at $x_b$ after $T$ = 1 ns. With $s$ = 1 µm, how far apart are the bright fringes?',
      steps: [
        'Actions of the two paths: $S_\\pm = \\frac{m}{T}\\left[(s/2)^2 + (x_b \\mp s/2)^2\\right]$.',
        'Their difference: $S_- - S_+ = \\frac{m}{T}\\left[(x_b + s/2)^2 - (x_b - s/2)^2\\right] = \\frac{2 m s\\,x_b}{T}$.',
        'Bright fringes where this is a whole number of $h$ (arrows in line): $x_b = n\\,hT/(2ms)$.',
        '$\\Delta x = 6.626\\times10^{-34} \\times 10^{-9}/(2 \\times 9.109\\times10^{-31} \\times 10^{-6}) = 3.6\\times10^{-7}$ m.'
      ],
      a: '0.36 µm between fringes — the same as λL/d with the electron\'s de Broglie wavelength.'
    },
    {
      title: 'The wavelength hidden in the phase',
      q: 'Show that the phase $md^2/2\\hbar T$ of the free-particle amplitude turns once for every de Broglie wavelength of extra distance.',
      steps: [
        'Differentiate with respect to $d$: $\\frac{d\\varphi}{dd} = \\frac{md}{\\hbar T} = \\frac{mv}{\\hbar} = \\frac{p}{\\hbar}$, with $v = d/T$.',
        'One full turn, $2\\pi$, takes an extra distance $2\\pi\\hbar/p = h/p$.',
        'For an electron at 1000 m/s (1 µm in 1 ns): $h/p = 6.626\\times10^{-34}/(9.109\\times10^{-31} \\times 1000) = 0.73$ µm.'
      ],
      a: 'The phase turns once per h/p — de Broglie\'s wavelength, which the sum over paths produces by itself.'
    }
  ],
  quiz: [
    { q: 'In Feynman\'s sum over histories, which paths contribute to the amplitude?', choices: ['All of them, each with an arrow of the same length', 'Only the classical path', 'Only paths with small action', 'Only straight paths'], a: 0, why: 'Every path contributes e^{iS/ħ}; the action sets only the direction of its arrow.' },
    { q: 'Paths far from the classical one have smaller arrows.', a: false, why: 'Every arrow has the same length. Far-away paths matter little because their neighbours cancel them, not because they are small.' },
    { q: 'For a free particle, the phase of K(b, a) is…', choices: ['the classical action divided by ħ', 'zero', 'the distance divided by the wavelength of light', 'the energy times the distance'], a: 0, why: 'K ∝ e^{imd²/2ħT}, and md²/2T is the action of the straight path.' },
    { q: 'Block all paths through the halfway screen except those through two narrow slits. The sum over paths then gives…', choices: ['two-slit interference fringes', 'two sharp images of the slits', 'nothing at all', 'the free-particle result'], a: 0, why: 'Two bundles of arrows with phases differing by 2msx_b/ħT add to fringes spaced hT/2ms.' },
    { q: 'Through what angle is the arrow of a free electron\'s classical path turned when it moves 2 µm in 1 ns?', answer: 17.3, unit: 'rad', why: 'φ = md²/(2ħT) = 9.109 × 10⁻³¹ × 4 × 10⁻¹² / (2 × 1.055 × 10⁻³⁴ × 10⁻⁹) = 17.3 rad.' }
  ],
  problems: [
    { q: 'In the one-screen model, electrons pass two slits 0.50 µm apart halfway through a 2.0 ns trip. How far apart are the fringes where they arrive?', answer: 1.455, unit: 'µm', tol: 0.02, hint: 'Δx = hT/(2ms).',
      steps: ['$\\Delta x = 6.626\\times10^{-34} \\times 2.0\\times10^{-9}/(2 \\times 9.109\\times10^{-31} \\times 0.50\\times10^{-6})$.', '$= 1.325\\times10^{-42}/9.109\\times10^{-37} = 1.455\\times10^{-6}$ m.'] },
    { q: 'A neutron (1.675 × 10⁻²⁷ kg) moves freely 1.0 mm in 1.0 ms. What is the action of its path?', answer: 8.38e-28, unit: 'J·s', tol: 0.02, hint: 'S = md²/(2T).',
      steps: ['$S = 1.675\\times10^{-27} \\times (10^{-3})^2/(2 \\times 10^{-3})$.', '$= 8.38\\times10^{-28}$ J·s — about 8 million ħ.'] }
  ],
  applications: [
    'Quantum field theory is done with path integrals; lattice QCD computes the mass of the proton by summing over the histories of quark and gluon fields on a space-time grid.',
    'Path-integral molecular dynamics includes the quantum spreading of light nuclei — protons in water and in enzymes — in chemistry simulations.',
    'The Feynman–Kac formula, the path integral in imaginary time, prices financial options and solves diffusion problems by averaging over random paths.',
    'Semiconductor device and superconductor physics use path integrals for tunnelling rates and for the dynamics of flux in Josephson junctions.'
  ],
  history: 'Paul Dirac pointed out in 1933 that exp(iS/ħ) corresponds to the amplitude for a short step. Feynman developed the idea in his Princeton thesis (1942, "The Principle of Least Action in Quantum Mechanics", with John Wheeler) and published it in 1948 in Reviews of Modern Physics as "Space-Time Approach to Non-Relativistic Quantum Mechanics". Mark Kac, a colleague at Cornell, saw the connection with diffusion in 1949 (the Feynman–Kac formula). Feynman and Albert Hibbs wrote the textbook *Quantum Mechanics and Path Integrals* in 1965.',
  sources: [
    '"Space-Time Approach to Non-Relativistic Quantum Mechanics" (Reviews of Modern Physics, 1948) — the sum over paths, time slicing, and the Schrödinger equation derived from it.',
    '*Quantum Mechanics and Path Integrals* (Feynman and Hibbs, 1965), ch. 2 and 3 — the quantum law of motion as a sum over paths, the free particle, and diffraction through slits.',
    '*QED: The Strange Theory of Light and Matter*, ch. 2 — the sum over paths for light, told with arrows and no equations.',
    'Feynman\'s Nobel lecture, "The Development of the Space-Time View of Quantum Electrodynamics" (Stockholm, 11 December 1965) — how the idea grew from least action and Dirac\'s remark.'
  ],
  sim: 'act-path-sum'
},

{
  id: 'classical-limit', parent: 'sum-over-paths', title: 'How classical physics emerges from quantum paths', level: 3,
  short: 'When the actions involved are huge compared with ħ, only a very narrow bundle of paths around the classical one survives the adding of arrows: the bundle\'s width grows as √(ħT/m). For a baseball it is 10⁻¹⁷ m; for an electron in an atom it is the atom.',
  keywords: ['classical limit', 'correspondence', 'stationary phase', 'semiclassical', 'bundle of paths', 'width', 'ħ → 0', 'macroscopic', 'C60 interference', 'WKB', 'Hamilton–Jacobi', 'geometrical optics', 'quantumness'],
  prereq: ['path-integral', 'why-least-action', 'physics:uncertainty-principle'],
  related: ['least-action-mechanics', 'calculus-of-variations', 'wave-and-particle', 'uncertainty-feyn', 'quantum-reality', 'tunnelling-feyn', 'lens-and-least-time'],
  body: `
Quantum mechanics has to contain classical mechanics: a baseball is made of electrons and quarks, and it still flies along a parabola. The sum over paths shows how the one grows out of the other, and it gives a number that says, for any motion, which description is needed.

### The width of the bundle
Near the classical path the action rises as the square of the deviation — that is what [[?stationary]] means. In the one-screen picture of [[path-integral]], a path displaced sideways by $a$ at the halfway time has

$$S = S_{\\text{cl}} + \\frac{2ma^2}{T}$$

Its arrow is turned by $2ma^2/\\hbar T$ relative to the classical one: less than half a turn while $a$ is smaller than

$$w = \\sqrt{\\frac{\\pi\\hbar T}{2m}}$$

Paths inside this width add; beyond it they spiral and cancel. The particle effectively uses a bundle of paths about $w$ wide around the classical one:

| object | time $T$ | width $w$ of the bundle |
|---|---|---|
| electron in an atom | $10^{-16}$ s | 0.13 nm — the size of the atom |
| electron in a beam | 1 ns | 0.43 µm |
| C₆₀ molecule (720 u) | 1 ms | 0.37 µm |
| dust grain of 1 µg | 1 s | $4\\times10^{-13}$ m |
| baseball (145 g) | 1 s | $3\\times10^{-17}$ m |

When $w$ is far below anything that can be measured — a fiftieth of a proton for the baseball — the bundle cannot be told apart from a single line: that line is the classical trajectory. When $w$ is as big as the region the particle moves in, as for an electron in an atom, there is no trajectory in any useful sense, and orbits give way to standing waves.

### One number decides
Divide [[?hbar|ħ]] by the action scale of the motion, $md^2/T$ (mass × distance² / time). For an electron moving 0.1 nm in $10^{-16}$ s the ratio is about 1: fully quantum. For a baseball crossing 20 m in 0.5 s it is about $10^{-36}$: as classical as anything can be. Making ħ smaller — the slider in the simulation — is the same as making the object heavier or the motion longer: the bundle narrows as the [[?square-root|square root]] of ħ and the other paths cancel ever more completely. Between the extremes lie molecules: in 1999 C₆₀ molecules were made to interfere after passing a grating, and much heavier molecules have been since.

### Stationary phase
The mathematics is called *stationary phase*. A sum of arrows $e^{i\\varphi(a)}$ whose angle turns quickly is dominated by the places where the angle stops turning, $d\\varphi/da = 0$; each such place contributes about $\\sqrt{2\\pi/|\\varphi''|}$ in length. With $\\varphi = S/\\hbar$ those places are exactly the paths of stationary action — the classical paths. The same argument turns wave optics into ray optics when the wavelength is small ([[lens-and-least-time]]).

### What survives, and what does not
- **The phase survives.** The factor $e^{iS_{\\text{cl}}/\\hbar}$ remains: in the classical limit it is the phase of the matter wave, and Hamilton's classical mechanics is the short-wavelength limit of Schrödinger's, as rays are of waves.
- **Two classical paths interfere.** When two paths are both stationary — two slits, two routes round a ring — each carries its own bundle, and their phases $(S_1 - S_2)/\\hbar$ decide the result however large $S$ is. Neutron interferometers detect the Earth's gravity this way.
- **No classical path is not the end.** Through a barrier no classical path exists, yet the sum gives a small amplitude: tunnelling ([[tunnelling-feyn]]).

> [!key] The paths that count lie within about $\\sqrt{\\pi\\hbar T/2m}$ of the classical one. When the actions are huge compared with ħ this bundle is unimaginably thin and classical mechanics is exact for all practical purposes; when they are a few ħ, there is no path, only the sum.

**In the simulation**, a family of paths around the classical one each carry an arrow; the bright band marks the paths whose arrows add. Slide ħ down and watch the band shrink to a line, then pick real objects — an electron in an atom, a molecule, a baseball — to see where each one sits.
`,
  ideas: [
    'Near the classical path the action rises quadratically, so arrows agree only within a band of paths.',
    'The band\'s width is about √(πħT/2m): it shrinks as ħ gets relatively smaller, or as mass and time grow.',
    'For a baseball the band is ~10⁻¹⁷ m — a single line, the classical trajectory; for an electron in an atom it fills the atom.',
    'Stationary phase: a sum of rapidly turning arrows is dominated by the points where the angle stops turning — the classical paths.',
    'Even in the classical limit the phase S/ħ survives: two classical paths interfere, and waves become rays.'
  ],
  pitfalls: [
    'Classical physics is quantum physics with ħ set to zero, so quantum effects simply vanish — The phase S/ħ becomes enormous, not zero; interference between distinct classical paths survives, and many macroscopic phenomena (lasers, superconductors, the stability of matter) are quantum through and through.',
    'Big objects obey different laws from small ones — The same law, the sum over paths, applies to both; for big actions it reduces to the classical path.',
    'The bundle is a blur in the particle\'s actual position — It is a range of paths whose amplitudes add; where the particle is found is still decided by |K|².'
  ],
  formulas: [
    {
      name: 'Width of the bundle of paths that count',
      expr: 'w = sqrt(pi*hbar*T/(2*m))', tex: 'w = \\sqrt{\\frac{\\pi\\hbar T}{2m}}',
      vars: {
        w: { name: 'half-width of the contributing bundle', q: 'length', unit: 'µm' },
        hbar: { const: 'hbar' },
        T: { name: 'duration of the motion', q: 'time', unit: 'ns', value: 1 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 9.109e-31 }
      },
      note: 'Sideways displacement at the halfway time for which the arrow turns half a turn; one-screen model of a free particle. The order of magnitude holds generally.',
      stories: { w: 'A particle of mass {m} travels for {T}. How wide is the bundle of paths whose arrows add?', m: 'For a motion lasting {T}, the bundle of contributing paths is {w} wide. What is the mass?' }
    },
    {
      name: 'How quantum is a motion?',
      expr: 'r = hbar*T/(m*d^2)', tex: 'r = \\frac{\\hbar T}{m d^2}',
      vars: {
        r: { name: 'ratio of ħ to the action scale', tex: 'r' },
        hbar: { const: 'hbar' },
        T: { name: 'time of the motion', q: 'time', unit: 's', value: 1e-16 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 9.109e-31 },
        d: { name: 'distance moved', q: 'length', unit: 'nm', value: 0.1 }
      },
      note: 'About 1 or more: quantum; much less than 1: classical.',
      stories: { r: 'A particle of mass {m} moves {d} in {T}. How does ħ compare with its action scale md²/T?' }
    },
    {
      name: 'How many turns the arrow makes',
      expr: 'N = S/h', tex: 'N = \\frac{S}{h}',
      vars: {
        N: { name: 'number of turns of the arrow' },
        S: { name: 'action of the path', q: 'angmom', unit: 'J·s', value: 32.08 },
        h: { const: 'h' }
      },
      note: 'One full turn per h of action. For the thrown ball of 1 kg and 2 s, about 5 × 10³⁴ turns.',
      stories: { N: 'A path has an action of {S}. How many times does its arrow turn?' }
    }
  ],
  examples: [
    {
      title: 'A baseball and an electron',
      q: 'Compare the width of the bundle of contributing paths for a 145 g baseball in the air for 1 s and for an electron in an atom over 10⁻¹⁶ s.',
      steps: [
        'Baseball: $w = \\sqrt{\\pi \\times 1.055\\times10^{-34} \\times 1/(2 \\times 0.145)} = \\sqrt{1.14\\times10^{-33}} = 3.4\\times10^{-17}$ m.',
        'Electron: $w = \\sqrt{\\pi \\times 1.055\\times10^{-34} \\times 10^{-16}/(2 \\times 9.109\\times10^{-31})} = \\sqrt{1.82\\times10^{-20}} = 1.35\\times10^{-10}$ m.',
        'The baseball\'s bundle is a fiftieth of a proton\'s size; the electron\'s is as big as the atom (about 0.1 nm).'
      ],
      a: '3 × 10⁻¹⁷ m for the baseball, 0.13 nm for the electron: classical against fully quantum.'
    },
    {
      title: 'Where a molecule sits',
      q: 'A C₆₀ molecule (720 u = 1.196 × 10⁻²⁴ kg) flies for 1 ms. How wide is its bundle, and what does that suggest?',
      steps: [
        '$w = \\sqrt{\\pi \\times 1.055\\times10^{-34} \\times 10^{-3}/(2 \\times 1.196\\times10^{-24})} = \\sqrt{1.39\\times10^{-13}}$.',
        '$w = 3.7\\times10^{-7}$ m = 0.37 µm — comparable with the slits of a fine grating (about 0.1 µm apart).',
        'So paths through neighbouring slits can both contribute, and the molecule should interfere — as it was seen to do in 1999.'
      ],
      a: 'About 0.37 µm: big enough for grating interference of a molecule of 60 atoms.'
    }
  ],
  quiz: [
    { q: 'As ħ is made smaller compared with the actions involved, the band of paths that contribute…', choices: ['narrows, as √ħ', 'widens', 'stays the same', 'narrows, as ħ²'], a: 0, why: 'The band ends where the extra action 2ma²/T reaches about πħ, so a ∝ √ħ.' },
    { q: 'For an electron inside an atom, a classical orbit is a good description because its bundle of paths is narrow.', a: false, why: 'Its bundle is about the size of the atom itself; no single path stands out, which is why atoms need quantum mechanics.' },
    { q: 'Two different classical paths lead from A to B (say, through two slits). In the quantum sum…', choices: ['each has its own bundle, and the two bundles interfere', 'only the shorter one counts', 'they cancel exactly', 'the particle takes their average'], a: 0, why: 'Each stationary path contributes; their arrows differ by (S₁ − S₂)/ħ and add to fringes, however large the actions.' },
    { q: 'The points that dominate a sum of arrows e^{iS/ħ} over paths are…', choices: ['the paths where S is stationary: the classical paths', 'the paths where S is largest', 'the paths where S is zero', 'the shortest paths'], a: 0, why: 'Stationary phase: where S does not change to first order, neighbouring arrows agree.' },
    { q: 'By what factor does the bundle\'s width change if the mass is 100 times larger (same time)?', answer: 0.1, why: 'w ∝ 1/√m: a hundred times the mass, a tenth of the width.' }
  ],
  problems: [
    { q: 'How wide is the bundle of contributing paths for a C₆₀ molecule (1.196 × 10⁻²⁴ kg) that flies for 1.0 ms?', answer: 0.372, unit: 'µm', tol: 0.02, hint: 'w = √(πħT/2m).',
      steps: ['$w = \\sqrt{\\pi \\times 1.055\\times10^{-34} \\times 1.0\\times10^{-3}/(2 \\times 1.196\\times10^{-24})}$.', '$= \\sqrt{1.385\\times10^{-13}} = 3.72\\times10^{-7}$ m = 0.372 µm.'] },
    { q: 'An electron moves 0.10 nm in 1.0 × 10⁻¹⁶ s. What is the ratio ħT/(md²)?', answer: 1.16, tol: 0.02, hint: 'Near 1 means quantum.',
      steps: ['$r = 1.055\\times10^{-34} \\times 10^{-16}/(9.109\\times10^{-31} \\times 10^{-20})$.', '$= 1.055\\times10^{-50}/9.109\\times10^{-51} = 1.16$ — fully quantum.'] }
  ],
  applications: [
    'Matter-wave interferometers with atoms and molecules test where the quantum-classical boundary lies, with ever heavier particles.',
    'Semiclassical methods — summing only over classical paths with their phases — explain the energy levels of chaotic systems and the conductance fluctuations of tiny wires.',
    'Neutron and atom interferometers measure gravity and rotation from the phase difference (S₁ − S₂)/ħ of two classical paths.'
  ],
  history: 'Niels Bohr\'s correspondence principle (around 1920) demanded that quantum results merge into classical ones for large quantum numbers. In 1926 Gregor Wentzel, Hendrik Kramers and Léon Brillouin worked out the short-wavelength (WKB) approximation, in which the phase of the wave is the classical action over ħ; John Van Vleck gave the semiclassical form of the propagator in 1928. Dirac (1933) and Feynman (1948) showed that the principle of least action itself is the classical limit of the sum over paths. In 1999 Markus Arndt, Anton Zeilinger and colleagues in Vienna observed interference of C₆₀ molecules.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 19 (The Principle of Least Action) — how, for actions large compared with ħ, only paths near the stationary one survive.',
    '*Quantum Mechanics and Path Integrals* (Feynman and Hibbs, 1965), ch. 2 — the classical limit of the sum over paths.',
    '*QED: The Strange Theory of Light and Matter*, ch. 2 — for light, only the paths near the path of least time count, and why squeezing light through a narrow gap spreads it.'
  ],
  sim: 'act-hbar-limit'
}

);
