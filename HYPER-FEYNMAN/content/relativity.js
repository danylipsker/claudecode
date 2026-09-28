/* HYPER-FEYNMAN · content/relativity.js — Space, Time and Relativity: the topics special-relativity and spacetime-topic.
 * Special relativity: the principle of relativity, Michelson–Morley, the Lorentz transformation, simultaneity, time dilation,
 * relativistic energy and momentum (FLP I-15, I-16). Space-time: its geometry, four-vectors, fields in moving frames, curved space
 * (FLP I-17, II-13, II-25, II-26, II-42). Simulations in sims/relativity.js (ids rel-…). */
Hyper.add(

{
  id: 'principle-of-relativity', parent: 'special-relativity', title: 'The principle of relativity', level: 1,
  short: 'The laws of physics are the same in every laboratory moving uniformly — in a straight line at a steady speed. Newton\'s laws obey this; Maxwell\'s equations seemed not to, until Einstein changed the rules for space and time instead.',
  keywords: ['principle of relativity', 'Galilean transformation', 'inertial frame', 'uniform motion', 'Galileo\'s ship', 'ether', 'Einstein 1905', 'velocity addition', 'postulates of relativity', 'speed of light is constant', 'everything is relative'],
  prereq: ['symmetry-in-physical-law', 'newtons-laws-numerically', 'physics:relative-velocity'],
  related: ['michelson-morley-feyn', 'lorentz-transformation-feyn', 'vectors-and-symmetry', 'physics:relativity-postulates', 'physics:special-relativity', 'em-waves-feyn'],
  body: `
Feynman began relativity with a symmetry. The laws of physics, he pointed out, do not change if you move your laboratory to another place, turn it round, or do the experiment tomorrow (see [[symmetry-in-physical-law]]). Relativity adds one more item to the list: the laws do not change if the whole laboratory moves **uniformly** — in a straight line at a steady speed.

### Galileo's cabin
Shut yourself in a windowless cabin of a ship gliding over a calm sea. Drops from a leaking bottle fall straight into the bowl below, a ball tossed to a friend needs the same throw in every direction, a pendulum keeps the same period. Nothing done inside tells you whether the ship is moored or sailing at twenty knots. Galileo made this argument in 1632, and Newton built it into his mechanics.

In Newton's world the rule for translating between the ship (primed) and the shore is the **Galilean transformation**. If the ship moves at speed $u$ along $x$,

$$x' = x - ut, \\qquad y' = y, \\qquad z' = z, \\qquad t' = t$$

Take the [[?derivative]] once and every velocity changes by $u$; take it again and every acceleration is the *same* in both frames. Forces depend on distances between bodies, which are also the same. So $F = ma$ looks identical on the ship and on the shore. That is the **principle of relativity**: the laws of physics have the same form in every frame moving uniformly relative to another, and only *relative* uniform motion can be detected. Acceleration and rotation are different — you feel a braking train in your stomach, and a Foucault pendulum shows the Earth turning.

### The trouble with light
Maxwell's equations predict waves travelling at $c = 1/\\sqrt{\\mu_0\\varepsilon_0} = 299\\,792\\,458$ m/s. Put them through the Galilean transformation and they change their form: light would go at $c - u$ forward and $c + u$ backward on the ship, and the equations would single out one special frame — the "ether" — in which light goes at exactly $c$. There were three ways out: Maxwell's equations are wrong, the principle of relativity fails for electromagnetism, or the Galilean transformation is wrong. Experiment, above all [[michelson-morley-feyn|Michelson and Morley's]], found no motion through any ether. In 1905 Einstein took the third way: keep the principle, keep Maxwell, and change the rules for space and time. If the laws are the same for everyone and the laws fix the speed of light, then everyone measures the same $c$.

### Velocities no longer simply add
A first consequence: a ball thrown forward at speed $u$ in a carriage moving at $v$ does not cross the ground at $u + v$ but at

$$w = \\frac{u + v}{1 + uv/c^2}$$

| Thrown in the carriage | Carriage speed | Galileo $u + v$ | Einstein $w$ |
|---|---|---|---|
| ball, 30 m/s | 30 m/s | 60 m/s | 60 m/s less $6\\times10^{-13}$ m/s |
| rocket, $0.5c$ | $0.5c$ | $c$ | $0.8c$ |
| particle, $0.9c$ | $0.9c$ | $1.8c$ | $0.9945c$ |
| light, $c$ | $0.5c$ | $1.5c$ | $c$ |

At everyday speeds the correction $uv/c^2$ is about $10^{-14}$ — [[?much-less|far too small]] to notice, which is why Galileo's rule served for three centuries. Near $c$ the denominator takes over, and no combination of speeds below $c$ ever reaches it. Light itself comes out at $c$ for every observer.

### What "relative" means
Feynman opened his next lecture by poking fun at the popular slogan that, after Einstein, everything is relative. The theory is far more definite than that. Some things — positions, times, speeds — depend on the observer in an exact, calculable way; others — the laws themselves, the speed of light and, as later pages show, the [[?invariant|space-time interval]] and the rest mass — are the same for all. Physics lives in the second list.

> [!key] The laws of physics are the same in every uniformly moving laboratory. Since those laws fix the speed of light, space and time themselves must transform — by the [[lorentz-transformation-feyn|Lorentz transformation]], not Galileo's.

**In the simulation** a carriage passes a platform. A ball and a flash of light are launched together from the back wall. Watch from the carriage, then from the platform: the ball's speed over the platform is close to Galileo's $u + v$ only when both speeds are small, and the flash always moves at $c$ — the dashed ghosts show where Galileo would put them. The graph draws $w$ against $u$ for both rules.
`,
  ideas: [
    'The laws of physics take the same form in every frame moving uniformly relative to another; no experiment inside a closed laboratory detects uniform motion.',
    'The Galilean transformation x′ = x − ut, t′ = t leaves Newton\'s laws unchanged but not Maxwell\'s equations.',
    'Einstein kept both the principle and Maxwell\'s equations; then the speed of light is the same for every observer, and the rules for space and time must change.',
    'Velocities combine as w = (u + v)/(1 + uv/c²): almost exactly u + v at everyday speeds, never more than c.',
    'Relativity is about what stays the same — the laws, c, the interval, the rest mass — as much as about what changes.'
  ],
  pitfalls: [
    'Relativity means that everything is relative — Positions, times and speeds depend on the observer in exact ways; the laws, the speed of light and the space-time interval are the same for all.',
    'The principle covers any motion, including acceleration — It covers uniform motion in a straight line. A braking train or a turning Earth can be detected from inside.',
    'Light from a moving source must move faster — Its speed is c whatever the motion of the source. At CERN in 1964, photons from neutral pions moving at 0.99975c were timed at c.'
  ],
  derivation: {
    title: 'The velocity-addition rule from the Lorentz transformation',
    steps: [
      { text: 'A ball moves at speed $u$ in the carriage frame, so its position there is $x\' = ut\'$. To get platform coordinates, use the inverse Lorentz transformation (the carriage moves at $+v$):', tex: 'x = \\gamma\\,(x\' + vt\'), \\qquad t = \\gamma\\left(t\' + \\frac{vx\'}{c^2}\\right)' },
      { text: 'Put $x\' = ut\'$ into both. Each becomes $t\'$ times a constant:', tex: 'x = \\gamma\\,(u + v)\\,t\', \\qquad t = \\gamma\\left(1 + \\frac{uv}{c^2}\\right)t\'' },
      { text: 'The speed over the platform is $x/t$; the factors $\\gamma\\,t\'$ cancel:', tex: 'w = \\frac{x}{t} = \\frac{u + v}{1 + uv/c^2}' },
      { text: 'Check the limits. When $uv \\ll c^2$ the denominator is 1 and Galileo\'s $u + v$ returns. When $u = c$: $w = (c + v)/(1 + v/c) = c$ — light has the same speed in both frames, as the principle requires.' }
    ]
  },
  formulas: [
    {
      name: 'The Galilean transformation (the old rule)',
      expr: 'xp = x - v*t', tex: "x' = x - v t",
      vars: {
        xp: { name: 'position measured from the carriage', q: 'length', unit: 'm', signed: true, tex: "x'" },
        x: { name: 'position measured from the platform', q: 'length', unit: 'm', value: 500, signed: true },
        v: { name: 'speed of the carriage', q: 'speed', unit: 'm/s', value: 30 },
        t: { name: 'time since the origins passed each other', q: 'time', unit: 's', value: 10 }
      },
      note: 'Correct only when v ≪ c; relativity replaces it with the Lorentz transformation. Time is the same for both here (t′ = t) — the assumption Einstein dropped.',
      stories: { xp: 'A carriage passes the station clock at {v}. After {t}, how far ahead of the carriage\'s origin is a lamppost {x} beyond the clock?', v: 'After {t} a post {x} past the clock is only {xp} ahead of the carriage\'s origin. How fast is the carriage?' }
    },
    {
      name: 'Adding velocities (Einstein)',
      expr: 'w = (u + v)/(1 + u*v/c^2)', tex: 'w = \\dfrac{u + v}{1 + uv/c^2}',
      vars: {
        w: { name: 'speed over the platform', q: 'speed', unit: 'c' },
        u: { name: 'speed relative to the carriage', q: 'speed', unit: 'c', value: 0.5, max: 1 },
        v: { name: 'speed of the carriage', q: 'speed', unit: 'c', value: 0.5, max: 0.9999 },
        c: { const: 'c' }
      },
      note: 'Both motions along the same line. For u = c the result is c for any v.',
      stories: { w: 'A carriage moves at {v}; inside it a probe is launched forward at {u}. How fast does the probe move over the ground?', u: 'Seen from the ground a probe moves at {w}; the carriage it was launched from moves at {v}. How fast was it launched relative to the carriage?' },
      practice: { unknowns: ['w', 'u'] }
    }
  ],
  examples: [
    {
      title: 'A ball on a fast train',
      q: 'A passenger on a train moving at 30 m/s throws a ball forward at 20 m/s. How fast does it move over the ground, and how big is the relativistic correction?',
      steps: [
        'Galileo: $u + v = 50$ m/s.',
        'The correction term: $uv/c^2 = 20 \\times 30/(2.998\\times10^{8})^2 = 6.7\\times10^{-15}$.',
        '$w = 50/(1 + 6.7\\times10^{-15}) \\approx 50\\,(1 - 6.7\\times10^{-15})$ m/s: less than 50 m/s by $3.3\\times10^{-13}$ m/s.'
      ],
      a: '50 m/s, short by about 3 × 10⁻¹³ m/s — far below anything measurable.'
    },
    {
      title: 'Two rockets',
      q: 'Rocket B moves at 0.7c relative to rocket A, which moves at 0.6c relative to the Earth, both in the same direction. How fast is B relative to the Earth?',
      steps: [
        'Galileo would say $1.3c$ — faster than light.',
        '$w = (0.6 + 0.7)c/(1 + 0.6 \\times 0.7) = 1.3c/1.42$.',
        '$w = 0.9155c$.'
      ],
      a: 'About 0.92c.'
    },
    {
      title: 'A headlight',
      q: 'A spaceship moving at 0.5c relative to a planet switches on its headlight. How fast does the light move relative to the planet?',
      steps: [
        'In the ship the light moves at $u = c$.',
        '$w = (c + 0.5c)/(1 + 0.5c\\cdot c/c^2) = 1.5c/1.5 = c$.'
      ],
      a: 'Exactly c — as for every observer.'
    }
  ],
  quiz: [
    { q: 'You are in a windowless railway carriage moving at a steady 300 km/h on perfectly smooth track. Which experiment inside can reveal the motion?', choices: ['none of them', 'timing a pendulum', 'dropping a ball and watching where it lands', 'measuring the speed of light towards the front'], a: 0, why: 'That is the principle of relativity: every law, including the speed of light, is the same in a uniformly moving laboratory.' },
    { q: 'The principle of relativity also means you cannot detect rotation from inside a closed room.', a: false, why: 'Rotation is accelerated motion. A Foucault pendulum, or water climbing the wall of a spinning bucket, reveals it.' },
    { q: 'Two probes fly towards each other, each at 0.8c relative to the Earth. How fast (in units of c) does one see the other approach?', answer: 0.9756, unit: 'c', why: 'w = (0.8 + 0.8)/(1 + 0.64) = 1.6/1.64 = 0.976c: close to c, never beyond.' },
    { q: 'Faced with Maxwell\'s equations that changed form under the Galilean transformation, Einstein chose to…', choices: ['keep the principle of relativity and Maxwell\'s equations, and change the transformation of space and time', 'modify Maxwell\'s equations', 'give up the principle of relativity for light', 'assume the Earth drags the ether along'], a: 0, why: 'Experiments supported both the principle and Maxwell\'s equations; the Galilean transformation was the assumption that had to go.' },
    { q: 'At everyday speeds Galileo\'s rule w = u + v is…', choices: ['correct to about one part in 10¹⁴', 'wrong by a few per cent', 'exactly correct', 'correct only for light'], a: 0, why: 'The correction factor is 1 + uv/c², and uv/c² is about 10⁻¹⁴ for speeds of tens of metres per second.' }
  ],
  problems: [
    { q: 'An unstable particle moving at 0.9c in the laboratory emits a fragment forward at 0.9c relative to itself. How fast is the fragment in the laboratory (in units of c)?', answer: 0.9945, unit: 'c', tol: 0.002, hint: 'w = (u + v)/(1 + uv/c²).',
      steps: ['$w = (0.9 + 0.9)/(1 + 0.81) = 1.8/1.81$.', '$w = 0.9945c$.'] },
    { q: 'A train passes a station clock at 25 m/s. Using the Galilean transformation, where is a signal post 800 m beyond the clock, measured from the train\'s origin, 20 s later?', answer: 300, unit: 'm', tol: 0.01, hint: 'x′ = x − vt.',
      steps: ['$x\' = 800 - 25 \\times 20$.', '$x\' = 300$ m ahead of the train\'s origin.'] }
  ],
  applications: [
    'Every smooth flight: drinks pour normally in an airliner cruising at 250 m/s, because uniform motion cannot be felt.',
    'Fizeau\'s 1851 measurement of light in flowing water: the light was dragged by only a fraction 1 − 1/n² of the water\'s speed, which is exactly what relativistic velocity addition gives.',
    'Particle physics: decay products of fast particles are combined with the relativistic rule (or the rapidities of [[spacetime-geometry]]), and nothing ever exceeds c.'
  ],
  history: 'Galileo described the ship\'s cabin in his Dialogue Concerning the Two Chief World Systems (1632). Newton stated the principle as a corollary of his laws in the Principia (1687). Henri Poincaré spoke of a "principle of relativity" in 1904, and Albert Einstein made it, together with the constancy of the speed of light, the foundation of his 1905 paper "On the Electrodynamics of Moving Bodies".',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 15 (The Special Theory of Relativity) — the principle of relativity, the Galilean transformation, and why Maxwell\'s equations did not fit it.',
    'Vol. I, ch. 16 (Relativistic Energy and Momentum) — relativity and the philosophers, and the transformation of velocities.',
    '*The Character of Physical Law*, lecture 4 (Symmetry in Physical Law) — uniform motion in a straight line among the symmetries of the laws of physics.'
  ],
  sim: 'rel-frames'
},

{
  id: 'michelson-morley-feyn', parent: 'special-relativity', title: 'The Michelson–Morley experiment', level: 2,
  short: 'If light moved through an ether, a beam racing along the Earth\'s motion and back should lose a race against a beam going across. Michelson and Morley\'s interferometer could see a delay of a hundredth of a light period — and found none.',
  keywords: ['Michelson–Morley', 'interferometer', 'ether', 'aether', 'ether wind', 'null result', 'fringe shift', 'FitzGerald contraction', 'Lorentz contraction', '1887', 'beam splitter'],
  prereq: ['principle-of-relativity', 'interference-feyn', 'physics:relative-velocity'],
  related: ['lorentz-transformation-feyn', 'time-dilation-feyn', 'physics:length-contraction', 'physics:relativity-postulates', 'math:pythagorean-theorem'],
  body: `
If light were a wave in a medium — the "luminiferous ether" that nineteenth-century physicists imagined filling space — then the Earth, racing round the Sun at about 30 km/s, should feel an ether wind, and light should travel at different speeds in different directions in a laboratory. Albert Michelson built an instrument to catch the difference, and in 1887, with Edward Morley in Cleveland, he found nothing. Feynman told the story as the experiment that forced the change in our ideas of space and time.

### The instrument
A half-silvered mirror, the beam splitter, divides a beam of light in two. One half travels along arm 1 to a mirror and back; the other along arm 2, at right angles, to another mirror and back. The halves recombine and fall on an eyepiece, where they [[interference-feyn|interfere]]: delay one by half a period of the light and bright turns to dark. The pattern of bright and dark fringes is an extraordinarily sensitive clock for the *difference* between the two travel times.

### Racing two beams in an ether wind
Let the apparatus move at speed $u$ through the ether, with arm 1 (length $L$) along the motion. Going out, the light gains on the receding mirror at only $c - u$; coming back, it meets the splitter at $c + u$:

$$t_1 = \\frac{L}{c-u} + \\frac{L}{c+u} = \\frac{2L/c}{1 - u^2/c^2}$$

Along arm 2 the light must aim slightly upstream so as not to be swept past the mirror. In the ether its path is the hypotenuse of a right triangle with sides $L$ and $ut_2/2$, so by [[math:pythagorean-theorem|Pythagoras]] $(ct_2/2)^2 = L^2 + (ut_2/2)^2$, which gives

$$t_2 = \\frac{2L/c}{\\sqrt{1 - u^2/c^2}}$$

The trip along the wind takes longer. For small $u$ the [[?small-approximation]] — $(1-\\epsilon)^{-1} \\approx 1+\\epsilon$ and $(1-\\epsilon)^{-1/2} \\approx 1+\\epsilon/2$, with $\\epsilon = u^2/c^2$ — gives a difference

$$t_1 - t_2 \\approx \\frac{L}{c}\\,\\frac{u^2}{c^2}$$

### The numbers
Michelson and Morley folded the light path back and forth with mirrors on a massive stone slab floating in a trough of mercury, giving an effective arm of about 11 m. With $u = 30$ km/s, $u^2/c^2 = 10^{-8}$, and the delay is $3.7\\times10^{-16}$ s — about a fifth of one period of light of wavelength 500 nm ($1.67\\times10^{-15}$ s). Turning the slab through 90° swaps the roles of the arms, so the fringes should drift by twice that:

$$\\Delta N = \\frac{2Lu^2}{\\lambda c^2} \\approx 0.4 \\text{ fringe}$$

The drift is [[?proportional]] to $u^2$: an effect of second order in $u/c$, which is why it needed such a sensitive instrument.

| Quantity | Value |
|---|---|
| effective arm length $L$ | about 11 m |
| round trip $2L/c$ | 73 ns |
| expected delay $Lu^2/c^3$ | $3.7\\times10^{-16}$ s |
| expected drift on turning 90° | about 0.4 fringe |
| drift observed in 1887 | less than about 0.02 fringe |

They could see a hundredth of a fringe. They turned the slab slowly and watched: the fringes stayed put. At other times of day and of the year, when the Earth's velocity points elsewhere, the answer was the same, and later versions have pushed the limit down by many orders of magnitude.

### Making sense of nothing
In 1889 George FitzGerald, and independently Hendrik Lorentz in 1892, proposed that a body moving through the ether shrinks along its motion by the factor $\\sqrt{1-u^2/c^2}$ — which shortens arm 1 just enough to make $t_1 = t_2$ at every angle. It looked like a patch invented for one experiment. Einstein's reading was simpler and deeper: there is no ether wind to detect, because the [[principle-of-relativity]] holds for light too. The contraction is real, but it is not a trick of the ether: it follows from the [[lorentz-transformation-feyn|Lorentz transformation]], the same shrinking that any observer sees in anything that moves past.

> [!key] The expected fringe drift was about 0.4; the observed drift was at most about 0.02 — consistent with zero. No motion through an ether can be detected with light.

**In the simulation** the interferometer is drawn from above in an exaggerated ether wind. Two pulses leave the splitter together; watch the one on the arm along the wind come back late, and rotate the apparatus to see the fringes — drawn with the real 1887 numbers — drift. Then contract the moving arms: the pulses return together at every angle, as in the real experiment.
`,
  ideas: [
    'An ether wind would make light slower up- and downstream (round trip 2L/c ÷ (1 − u²/c²)) than across (2L/c ÷ √(1 − u²/c²)).',
    'The difference, about (L/c)(u²/c²), is tiny, but interference turns it into a visible shift of fringes: 2Lu²/(λc²) on turning the apparatus.',
    'With L ≈ 11 m and u = 30 km/s, 0.4 fringe was expected; less than 0.02 was seen.',
    'FitzGerald and Lorentz saved the ether by a contraction √(1 − u²/c²) along the motion; Einstein showed there is no ether wind to hide.',
    'The contraction survives — as a consequence of the Lorentz transformation, not of an ether.'
  ],
  pitfalls: [
    'The experiment found a small ether wind that later work explained — It found no wind at all within its accuracy: at most about a twentieth of the expected shift, consistent with zero.',
    'Light across the wind is unaffected by it — In the ether picture the cross beam must aim upstream and travels a longer, slanted path; its round trip is also longer than 2L/c, just less so than the beam along the wind.',
    'Michelson–Morley alone proves that the speed of light is independent of the source — It tests the round-trip speed of light in different directions in one laboratory; the independence of the source motion is shown by other experiments, such as timing light from fast-moving particles.'
  ],
  derivation: {
    title: 'Why the beam along the wind loses the race',
    steps: [
      { text: 'Along the wind the light must catch up with a mirror that runs away at $u$: closing speed $c - u$. On the way back the splitter runs towards it: $c + u$. Add the two times and put them over a common denominator:', tex: 't_1 = \\frac{L}{c-u} + \\frac{L}{c+u} = \\frac{2Lc}{c^2 - u^2} = \\frac{2L/c}{1 - u^2/c^2}' },
      { text: 'Across the wind, seen from the ether, the light runs along a slanted line while the apparatus moves $ut_2/2$ sideways during each half-trip. The slanted line is a hypotenuse:', tex: '\\left(\\frac{ct_2}{2}\\right)^2 = L^2 + \\left(\\frac{ut_2}{2}\\right)^2' },
      { text: 'Collect the $t_2^2$ terms on one side and take the [[?square-root]]:', tex: 't_2 = \\frac{2L}{\\sqrt{c^2 - u^2}} = \\frac{2L/c}{\\sqrt{1 - u^2/c^2}}' },
      { text: 'Since $1 - u^2/c^2 < \\sqrt{1 - u^2/c^2}$ when $u > 0$, $t_1 > t_2$. With $\\epsilon = u^2/c^2$ small, expand both to first order in $\\epsilon$ and subtract:', tex: 't_1 - t_2 \\approx \\frac{2L}{c}\\left(1 + \\epsilon - 1 - \\frac{\\epsilon}{2}\\right) = \\frac{L}{c}\\,\\frac{u^2}{c^2}' },
      { text: 'Dividing by the period of the light, $\\lambda/c$, turns the delay into a fraction of a fringe; turning the apparatus 90° reverses the delay, doubling the drift: $\\Delta N = 2Lu^2/(\\lambda c^2)$.' }
    ]
  },
  formulas: [
    {
      name: 'Round trip along the ether wind',
      expr: 't1 = (2*L/c)/(1 - u^2/c^2)', tex: 't_1 = \\dfrac{2L/c}{1 - u^2/c^2}',
      vars: {
        t1: { name: 'round-trip time along the wind', q: 'time', unit: 'ns', tex: 't_1' },
        L: { name: 'arm length', q: 'length', unit: 'm', value: 11 },
        u: { name: 'speed through the ether', q: 'speed', unit: 'km/s', value: 30 },
        c: { const: 'c' }
      },
      note: 'The ether hypothesis, now known to be false; it is the expectation Michelson and Morley tested.',
      stories: { t1: 'In the ether picture, how long would light take to go {L} along the wind and back, if the laboratory moves through the ether at {u}?' },
      practice: { unknowns: ['t1', 'L'] }
    },
    {
      name: 'Round trip across the ether wind',
      expr: 't2 = (2*L/c)/sqrt(1 - u^2/c^2)', tex: 't_2 = \\dfrac{2L/c}{\\sqrt{1 - u^2/c^2}}',
      vars: {
        t2: { name: 'round-trip time across the wind', q: 'time', unit: 'ns', tex: 't_2' },
        L: { name: 'arm length', q: 'length', unit: 'm', value: 11 },
        u: { name: 'speed through the ether', q: 'speed', unit: 'km/s', value: 30 },
        c: { const: 'c' }
      },
      note: 'The ether hypothesis. The light must aim upstream so that it comes back to the splitter.',
      stories: { t2: 'In the ether picture, how long would light take to cross an arm {L} long and return, with the laboratory moving through the ether at {u}?' },
      practice: { unknowns: ['t2', 'L'] }
    },
    {
      name: 'The expected delay between the arms',
      expr: 'dt = L*u^2/c^3', tex: '\\Delta t = \\dfrac{L u^2}{c^3}',
      vars: {
        dt: { name: 'expected delay of the beam along the wind', q: 'time', unit: 's', tex: '\\Delta t' },
        L: { name: 'arm length', q: 'length', unit: 'm', value: 11 },
        u: { name: 'speed through the ether', q: 'speed', unit: 'km/s', value: 30 },
        c: { const: 'c' }
      },
      note: 'First order in u²/c² (u ≪ c).',
      stories: { dt: 'By how much would the beam along a {L} arm lag the cross beam if the ether wind blew at {u}?', u: 'A delay of {dt} between arms {L} long: what ether wind would that mean?' }
    },
    {
      name: 'The expected fringe drift on turning the apparatus 90°',
      expr: 'N = 2*L*u^2/(lambda*c^2)', tex: '\\Delta N = \\dfrac{2 L u^2}{\\lambda c^2}',
      vars: {
        N: { name: 'fringe drift (fringes)', tex: '\\Delta N' },
        L: { name: 'effective arm length', q: 'length', unit: 'm', value: 11 },
        u: { name: 'speed through the ether', q: 'speed', unit: 'km/s', value: 30 },
        lambda: { name: 'wavelength of the light', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' },
        c: { const: 'c' }
      },
      note: 'Expected about 0.4 in 1887; observed less than about 0.02.',
      stories: { N: 'An interferometer with arms {L} long, lit with {lambda}, is turned through 90°. By how many fringes should the pattern drift if the ether wind is {u}?', u: 'Turning an interferometer with {L} arms lit with {lambda} drifts the fringes by less than {N}. What is the largest ether wind this allows?' },
      practice: { unknowns: ['N', 'u', 'L'] }
    }
  ],
  examples: [
    {
      title: 'What Michelson and Morley expected',
      q: 'Effective arm length 11 m, light of 500 nm, ether wind 30 km/s. Find the expected fringe drift on turning through 90°.',
      steps: [
        '$u^2/c^2 = (3\\times10^4)^2/(2.998\\times10^8)^2 = 1.00\\times10^{-8}$.',
        '$\\Delta N = 2 \\times 11 \\times 1.00\\times10^{-8}/(5\\times10^{-7}) = 0.44$.'
      ],
      a: 'About 0.44 fringe — easy to see with an instrument that resolves 0.01 fringe.'
    },
    {
      title: 'What the null result allows',
      q: 'The same instrument could detect a drift of 0.01 fringe. What is the fastest ether wind that could have escaped notice?',
      steps: [
        'Solve for $u$: $u = c\\sqrt{\\Delta N\\,\\lambda/(2L)}$.',
        '$u = 2.998\\times10^8 \\times \\sqrt{0.01 \\times 5\\times10^{-7}/22} = 2.998\\times10^8 \\times 1.51\\times10^{-5}$.',
        '$u \\approx 4.5$ km/s.'
      ],
      a: 'About 4.5 km/s — well under a sixth of the Earth\'s orbital speed.'
    },
    {
      title: 'How much would the Earth have to shrink?',
      q: 'The FitzGerald–Lorentz contraction shortens lengths along the motion by the factor √(1 − u²/c²). By how much would the Earth\'s diameter (12 742 km) shrink along its orbital motion at 30 km/s?',
      steps: [
        'For small $u$, $1 - \\sqrt{1 - u^2/c^2} \\approx u^2/2c^2 = 5.0\\times10^{-9}$.',
        '$\\Delta D = 1.2742\\times10^7 \\times 5.0\\times10^{-9} = 0.064$ m.'
      ],
      a: 'About 6 cm out of 12 742 km — undetectable by any ruler, since the ruler shrinks too.'
    }
  ],
  quiz: [
    { q: 'In the ether picture, which beam returns to the splitter first?', choices: ['the one across the wind', 'the one along the wind', 'both together', 'it depends on the wavelength'], a: 0, why: 't₁ = (2L/c)/(1 − u²/c²) is larger than t₂ = (2L/c)/√(1 − u²/c²).' },
    { q: 'If the ether wind were twice as fast, the expected fringe drift would be…', choices: ['four times larger', 'twice as large', 'the same', 'half as large'], a: 0, why: 'The drift is proportional to u², a second-order effect in u/c.' },
    { q: 'Michelson and Morley measured the speed of light in each direction and found it slightly different, but the difference was within their errors.', a: false, why: 'They compared round-trip times of two beams by interference; the fringes did not move at all within about a twentieth of the expected drift.' },
    { q: 'Why did they rotate the whole apparatus instead of comparing the two arms once?', choices: ['the arms could not be made exactly equal, so they looked for a change on turning', 'to average out vibrations', 'to follow the Sun', 'the fringes fade if the apparatus stands still'], a: 0, why: 'Equal lengths to a fraction of a wavelength are impossible; turning swaps the roles of the arms, so any ether effect shows as a drift while the unequal lengths do not.' },
    { q: 'What fringe drift should a 30 km/s ether wind give with 1 m arms and 500 nm light?', answer: 0.04, why: 'ΔN = 2 × 1 × 10⁻⁸/(5 × 10⁻⁷) = 0.04 fringe — which is why folding the path to 11 m mattered.' }
  ],
  problems: [
    { q: 'An interferometer has an effective arm length of 25 m and uses 633 nm light. What fringe drift would a 30 km/s ether wind give on turning it through 90°?', answer: 0.79, unit: 'fringe', tol: 0.03, hint: 'ΔN = 2Lu²/(λc²).',
      steps: ['$u^2/c^2 = 1.00\\times10^{-8}$.', '$\\Delta N = 2 \\times 25 \\times 1.00\\times10^{-8}/(6.33\\times10^{-7}) = 0.79$.'] },
    { q: 'According to FitzGerald and Lorentz, by how much should a 1.000 m rod pointing along the Earth\'s orbital motion (30 km/s) shrink? Give the answer in nanometres.', answer: 5.0, unit: 'nm', tol: 0.03, hint: 'ΔL ≈ L u²/(2c²).',
      steps: ['$u^2/2c^2 = 5.0\\times10^{-9}$.', '$\\Delta L = 1 \\times 5.0\\times10^{-9}$ m $= 5.0$ nm.'] }
  ],
  applications: [
    'Michelson interferometers measure lengths in wavelengths of light, and a four-kilometre version of the same instrument (LIGO) detected gravitational waves in 2015.',
    'Modern tests of the isotropy of light use optical cavities compared as they rotate; they confirm Michelson and Morley\'s null result with vastly better precision.',
    'Fourier-transform spectrometers scan one arm of a Michelson interferometer to measure spectra.'
  ],
  history: 'Michelson made a first attempt in Potsdam in 1881; the decisive experiment with Edward Morley was done in Cleveland in July 1887. They concluded that any relative motion of the Earth and the ether was probably less than a sixth of the Earth\'s orbital speed. George FitzGerald (1889) and Hendrik Lorentz (1892) proposed the contraction of moving bodies. Michelson received the Nobel Prize in Physics in 1907 for his precision optical instruments and the measurements made with them.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 15 (The Special Theory of Relativity) — the Michelson–Morley experiment, the times along and across the arms, and the Lorentz–FitzGerald contraction.'
  ],
  sim: 'rel-michelson'
},

{
  id: 'lorentz-transformation-feyn', parent: 'special-relativity', title: 'The Lorentz transformation', level: 2,
  short: 'The one rule that relates the place and time two uniformly moving observers give to the same event while keeping the speed of light the same for both. Space and time mix: lengths contract, clocks fall out of step, and only the light lines and the interval stay put.',
  keywords: ['Lorentz transformation', 'gamma factor', 'Lorentz factor', 'length contraction', 'Lorentz contraction', 'boost', 'coordinates', 'event', 'Minkowski diagram', 'x prime', 't prime', 'Galilean limit'],
  prereq: ['principle-of-relativity', 'michelson-morley-feyn', 'math:linear-transformations'],
  related: ['simultaneity-feyn', 'time-dilation-feyn', 'spacetime-geometry', 'four-vectors-feyn', 'physics:lorentz-transformation', 'physics:length-contraction'],
  body: `
The [[principle-of-relativity]] and a speed of light that is the same for everyone leave no freedom at all. There is exactly one way to relate the coordinates $(x, t)$ that one observer gives an event to the coordinates $(x', t')$ that a second observer, moving at speed $u$ along $x$, gives the same event:

$$x' = \\frac{x - ut}{\\sqrt{1 - u^2/c^2}}, \\qquad t' = \\frac{t - ux/c^2}{\\sqrt{1 - u^2/c^2}}, \\qquad y' = y, \\qquad z' = z$$

This is the **Lorentz transformation**. Feynman introduced it as the change of variables Lorentz had found in 1904 that leaves Maxwell's equations unchanged — the replacement for Galileo's rule that electromagnetism had been asking for all along. Einstein then showed that it follows from the two postulates alone and applies to all of physics, mechanics included.

### The factor γ
The combination in the denominators is so common that it has a name, the [[?lorentz-factor]]:

$$\\gamma = \\frac{1}{\\sqrt{1 - u^2/c^2}}$$

| What moves | $u/c$ | $\\gamma$ |
|---|---|---|
| airliner, 250 m/s | $8\\times10^{-7}$ | $1 + 3.5\\times10^{-13}$ |
| the Earth round the Sun, 30 km/s | $10^{-4}$ | $1 + 5\\times10^{-9}$ |
| a fast rocket, in thought | 0.6 | 1.25 |
| | 0.8 | 1.667 |
| a cosmic-ray muon | 0.998 | 15.8 |
| a proton in the LHC, 6.8 TeV | 0.999 999 990 | 7250 |

For everyday speeds $\\gamma$ differs from 1 by $u^2/2c^2$ (the [[?small-approximation]]), and Galileo's $x' = x - ut$, $t' = t$ return.

### Two surprises in two lines
Compared with Galileo, the transformation contains two new things.

1. **The factor γ in $x'$.** A rod at rest in the moving frame, from $x' = 0$ to $x' = L_0$, has its ends at $x = ut$ and $x = ut + L_0/\\gamma$ at any one time $t$ in the other frame. Its measured length is $L_0/\\gamma$: moving things are shortened along their motion — the FitzGerald–Lorentz contraction of [[michelson-morley-feyn]], now a consequence rather than a patch.
2. **The term $ux/c^2$ in $t'$.** The time one observer assigns depends on *where* the event is in the other's frame. Clocks spread along the moving frame, set to agree there, disagree when read from the other frame — the [[simultaneity-feyn|relativity of simultaneity]] — and a single moving clock runs slow ([[time-dilation-feyn]]).

### A picture of it
Draw events on a diagram with $x$ across and $ct$ upwards; light travels along lines at 45°. The moving observer's time axis ($x' = 0$, the line $x = ut$) leans towards the right-hand light line, and the moving observer's space axis ($t' = 0$, the line $ct = (u/c)\\,x$) leans towards it by the *same* angle. The grid of the moving frame is squeezed along one diagonal and stretched along the other; the light lines stay exactly where they were. Feynman compared this with a rotation, which also mixes two coordinates: under a rotation $x^2 + y^2$ is unchanged, and under a Lorentz transformation

$$(ct')^2 - x'^2 = (ct)^2 - x^2$$

is unchanged — an [[?invariant]] of [[spacetime-geometry|space-time]].

**In the simulation** the grey grid is the platform's frame and the coloured grid is the moving frame. Move the speed slider: the coloured axes close towards the light line like scissors, while the light lines stay fixed. Drag the event and read its coordinates in both frames; the invariant $(ct)^2 - x^2$ is the same in both.

> [!key] $x' = \\gamma(x - ut)$ and $t' = \\gamma(t - ux/c^2)$. Space and time transform together; only the speed of light and the combination $(ct)^2 - x^2$ are left unchanged.
`,
  ideas: [
    'The Lorentz transformation is the only linear rule that keeps the speed of light the same for all uniformly moving observers.',
    'γ = 1/√(1 − u²/c²) is 1 at rest, 1.25 at 0.6c, and grows without limit as u approaches c.',
    'The γ in x′ gives length contraction: a moving rod measures L₀/γ.',
    'The ux/c² in t′ mixes space into time: clocks synchronised in one frame are out of step in another.',
    'On a space-time diagram the moving axes close towards the light line like scissors; (ct)² − x² stays the same.'
  ],
  pitfalls: [
    'Length contraction is an illusion of seeing — It is what careful measurement gives, marking both ends at the same time in the measuring frame; it follows from the transformation, not from light delay.',
    'The Lorentz transformation only changes lengths and times by γ — It also shifts time with position (the ux/c² term). Forgetting that term is behind most apparent paradoxes.',
    'A rotation and a boost are the same thing — Both mix two coordinates, but a rotation keeps x² + y² while a boost keeps (ct)² − x²; the moving axes close like scissors instead of turning together.'
  ],
  derivation: {
    title: 'Finding γ from the speed of light',
    steps: [
      { text: 'Uniform motion must map to uniform motion, so the rule is linear. The origin of the moving frame ($x\' = 0$) is at $x = ut$, so $x\'$ must be proportional to $x - ut$. By symmetry the inverse has the same form with $-u$, with the same unknown factor $\\gamma$:', tex: 'x\' = \\gamma\\,(x - ut), \\qquad x = \\gamma\\,(x\' + ut\')' },
      { text: 'A flash leaves the common origin at $t = t\' = 0$. Both observers see it move at $c$: $x = ct$ and $x\' = ct\'$. Put these in:', tex: 'ct\' = \\gamma\\,(c - u)\\,t, \\qquad ct = \\gamma\\,(c + u)\\,t\'' },
      { text: 'Multiply the two equations; the product $tt\'$ cancels from both sides:', tex: 'c^2 = \\gamma^2\\,(c^2 - u^2) \\quad\\Rightarrow\\quad \\gamma = \\frac{1}{\\sqrt{1 - u^2/c^2}}' },
      { text: 'Finally eliminate $x\'$ between the two lines of the first step and solve for $t\'$ (use $1 - 1/\\gamma^2 = u^2/c^2$):', tex: 't\' = \\gamma\\left(t - \\frac{ux}{c^2}\\right)' }
    ]
  },
  formulas: [
    {
      name: 'Position in the moving frame',
      expr: 'xp = (x - u*t)/sqrt(1 - u^2/c^2)', tex: "x' = \\dfrac{x - u t}{\\sqrt{1 - u^2/c^2}}",
      vars: {
        xp: { name: 'position in the moving frame', q: 'length', unit: 'm', signed: true, tex: "x'" },
        x: { name: 'position in the rest frame', q: 'length', unit: 'm', value: 300, signed: true },
        t: { name: 'time in the rest frame', q: 'time', unit: 'µs', value: 1, signed: true },
        u: { name: 'speed of the moving frame', q: 'speed', unit: 'c', value: 0.6, max: 0.999 },
        c: { const: 'c' }
      },
      note: 'Origins coincide at t = t′ = 0; motion along x.',
      stories: { xp: 'An event happens at {x} and {t} in the platform frame. Where does an observer moving at {u} place it?' },
      practice: { unknowns: ['xp', 'x'] }
    },
    {
      name: 'Time in the moving frame',
      expr: 'tp = (t - u*x/c^2)/sqrt(1 - u^2/c^2)', tex: "t' = \\dfrac{t - u x/c^2}{\\sqrt{1 - u^2/c^2}}",
      vars: {
        tp: { name: 'time in the moving frame', q: 'time', unit: 'µs', signed: true, tex: "t'" },
        t: { name: 'time in the rest frame', q: 'time', unit: 'µs', value: 1, signed: true },
        x: { name: 'position in the rest frame', q: 'length', unit: 'm', value: 300, signed: true },
        u: { name: 'speed of the moving frame', q: 'speed', unit: 'c', value: 0.6, max: 0.999 },
        c: { const: 'c' }
      },
      note: 'The ux/c² term is the relativity of simultaneity: the time depends on where the event is.',
      stories: { tp: 'An event happens at {x} and {t} in the platform frame. What time does an observer moving at {u} give it?' },
      practice: { unknowns: ['tp', 't'] }
    },
    {
      name: 'The Lorentz factor',
      expr: 'gamma = 1/sqrt(1 - u^2/c^2)', tex: '\\gamma = \\dfrac{1}{\\sqrt{1 - u^2/c^2}}',
      vars: {
        gamma: { name: 'Lorentz factor', tex: '\\gamma' },
        u: { name: 'speed', q: 'speed', unit: 'c', value: 0.6, max: 0.99999999 },
        c: { const: 'c' }
      },
      note: 'γ ≈ 1 + u²/2c² when u ≪ c.',
      stories: { gamma: 'What is the Lorentz factor at {u}?', u: 'At what speed does the Lorentz factor reach {gamma}?' }
    },
    {
      name: 'Length contraction',
      expr: 'L = L0*sqrt(1 - u^2/c^2)', tex: 'L = L_0\\sqrt{1 - u^2/c^2}',
      vars: {
        L: { name: 'length measured while it moves', q: 'length', unit: 'm' },
        L0: { name: 'rest length', q: 'length', unit: 'm', value: 100, tex: 'L_0' },
        u: { name: 'speed', q: 'speed', unit: 'c', value: 0.8, max: 0.9999 },
        c: { const: 'c' }
      },
      note: 'Only the dimension along the motion shrinks.',
      stories: { L: 'A spaceship {L0} long at rest flies past at {u}. How long is it measured to be?', u: 'A {L0} ship is measured to be {L} long as it passes. How fast is it going?' }
    }
  ],
  examples: [
    {
      title: 'One event, two sets of coordinates',
      q: 'An event happens at x = 300 m, t = 1.000 µs in the platform frame. Find its coordinates in a frame moving at 0.6c, and check that (ct)² − x² is the same in both.',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.36} = 1.25$; $ut = 0.6 \\times 299.79 = 179.88$ m.',
        '$x\' = 1.25\\,(300 - 179.88) = 150.16$ m.',
        '$ux/c^2 = 0.6 \\times 300/2.9979\\times10^8 = 0.6004$ µs, so $t\' = 1.25\\,(1 - 0.6004) = 0.4995$ µs.',
        'Platform: $(ct)^2 - x^2 = 299.79^2 - 300^2 = -124.5$ m². Moving frame: $ct\' = 149.74$ m, so $149.74^2 - 150.16^2 = -124.5$ m².'
      ],
      a: 'x′ = 150.2 m, t′ = 0.4995 µs; the invariant is −124.5 m² in both frames.'
    },
    {
      title: 'How fast for γ = 2?',
      q: 'At what speed do lengths halve and clocks run at half rate?',
      steps: [
        '$\\gamma = 2$ means $1 - u^2/c^2 = 1/4$.',
        '$u/c = \\sqrt{3/4} = 0.866$.'
      ],
      a: 'u = 0.866c, about 260 000 km/s.'
    },
    {
      title: 'A shortened spaceship',
      q: 'A spaceship 100 m long at rest passes at 0.8c. How long is it measured to be?',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.64} = 1/0.6 = 1.667$.',
        '$L = 100/1.667 = 60$ m.'
      ],
      a: '60 m along the motion; its width is unchanged.'
    }
  ],
  quiz: [
    { q: 'Which of these do two observers in uniform relative motion always agree on, for a pair of events?', choices: ['(cΔt)² − Δx²', 'Δt', 'Δx', '(cΔt)² + Δx²'], a: 0, why: 'The interval is invariant; the time and distance separately depend on the frame.' },
    { q: 'For speeds much smaller than c the Lorentz transformation reduces to the Galilean transformation.', a: true, why: 'γ → 1 and ux/c² becomes negligible, leaving x′ = x − ut and t′ = t.' },
    { q: 'At what speed, as a fraction of c, is γ = 2?', answer: 0.866, unit: 'c', why: 'γ = 2 requires 1 − u²/c² = 1/4, so u = (√3/2)c.' },
    { q: 'The term ux/c² in the formula for t′ means that…', choices: ['clocks synchronised in one frame are out of step in the other', 'moving clocks run fast', 'time runs backwards for the moving observer', 'light is slower in the moving frame'], a: 0, why: 'Two events at the same t but different x get different t′: simultaneity depends on the frame.' },
    { q: 'A metre stick moves along its length at 0.6c. What length (in metres) is it measured to be?', answer: 0.8, unit: 'm', why: 'L = L₀/γ = 1/1.25 = 0.8 m.' }
  ],
  problems: [
    { q: 'An event occurs at x = 1000 m and t = 2.00 µs in frame S. Where does it occur in a frame moving at 0.5c along x?', answer: 808.5, unit: 'm', tol: 0.01, hint: 'x′ = γ(x − ut), γ = 1.1547.',
      steps: ['$ut = 0.5 \\times 2.9979\\times10^8 \\times 2\\times10^{-6} = 299.79$ m.', '$x\' = 1.1547 \\times (1000 - 299.79) = 808.5$ m.'] },
    { q: 'What is the Lorentz factor at 0.99c?', answer: 7.09, unit: '', tol: 0.01, hint: 'γ = 1/√(1 − 0.9801).',
      steps: ['$1 - 0.99^2 = 0.0199$.', '$\\gamma = 1/\\sqrt{0.0199} = 7.09$.'] }
  ],
  applications: [
    'Particle accelerators: beams at γ of thousands are designed with the Lorentz transformation; a bunch of protons is flattened into a thin disc in the laboratory.',
    'The fields of a fast charge are squeezed into a thin sheet perpendicular to its motion — the origin of the intense pulses of [[synchrotron-radiation]].',
    'Try it on [the space-time diagram](#/tools/spacetime): drag events and boost the frame.'
  ],
  history: 'Woldemar Voigt (1887) and Joseph Larmor (1897–1900) wrote down transformations of this kind; Hendrik Lorentz gave the form that leaves Maxwell\'s equations unchanged in 1904. Henri Poincaré named it after Lorentz in 1905 and showed that the transformations form a group, and in the same year Einstein derived it from the principle of relativity and the constancy of the speed of light. Hermann Minkowski turned it into the geometry of space-time in 1908.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 15 (The Special Theory of Relativity) — the Lorentz transformation and the Lorentz contraction.',
    'Vol. I, ch. 17 (Space-Time) — the transformation as a kind of rotation in space-time, and the interval that it leaves unchanged.'
  ],
  sim: 'rel-lorentz-grid'
},

{
  id: 'simultaneity-feyn', parent: 'special-relativity', title: 'The relativity of simultaneity', level: 2,
  short: 'Two events far apart that happen at the same time for one observer happen at different times for another who moves along the line joining them — the forward one first. Events that could influence each other never change their order.',
  keywords: ['simultaneity', 'relativity of simultaneity', 'lightning and train', 'clock synchronisation', 'leading clocks lag', 'Einstein train', 'causality', 'order of events', 'spacelike', 'now'],
  prereq: ['lorentz-transformation-feyn', 'principle-of-relativity'],
  related: ['time-dilation-feyn', 'spacetime-geometry', 'physics:simultaneity', 'physics:twin-paradox'],
  body: `
Are two events at different places simultaneous? In Newton's world the question has one answer for everybody. Einstein showed that it does not — and that the mixing of space into time in the [[lorentz-transformation-feyn|Lorentz transformation]] is exactly this.

### Lightning and a train
A long train runs at speed $u$ past a platform. Lightning strikes both ends of the train, scorching the platform at A (by the rear of the train) and B (by the front). Pat, standing on the platform halfway between the marks, sees both flashes at the same moment. Each flash crossed the same distance at the same speed $c$, so Pat concludes, correctly, that the strikes were simultaneous.

Tom sits exactly in the middle of the train. While the light is on its way, the train carries him towards B and away from A: he meets the front flash first. Tom too is at the midpoint — of the train — and light moves at $c$ in both directions *for him* as well (that is the [[principle-of-relativity]]). So Tom concludes, just as correctly, that the front of the train was struck first. Neither is wrong. "At the same time, at different places" means different things to different observers.

### How much?
Take two events simultaneous in the platform frame (their [[?delta-change|time difference]] $\\Delta t = 0$) and a distance $\\Delta x$ apart along the motion. The Lorentz transformation $t' = \\gamma(t - ux/c^2)$, with $\\gamma$ the [[?lorentz-factor]], gives them times in the train frame differing by

$$\\Delta t' = \\gamma\\,\\frac{u\\,\\Delta x}{c^2}$$

the one further forward happening first. For a train 300 m long (at rest) moving at $0.6c$, the platform measures it as 240 m and the strikes are $1.25 \\times 0.6 \\times 240\\ \\text{m}/c = 0.60$ µs apart for Tom.

| Train speed | Platform | Train frame: front strike earlier by |
|---|---|---|
| 30 m/s, 300 m train | simultaneous | $1.0\\times10^{-13}$ s |
| $0.3c$ | simultaneous | 0.30 µs |
| $0.6c$ | simultaneous | 0.60 µs |
| $0.9c$ | simultaneous | 0.90 µs |

(For a train of rest length $L_0$ the difference is simply $uL_0/c^2$.) At everyday speeds it is a tenth of a picosecond — which is why nobody noticed before 1905.

### Leading clocks lag
Turn it round, as Feynman did with a man in a spaceship who synchronises clocks at its two ends with a light signal sent from the middle. The signal reaches both ends together *in the ship*, so the crew set both clocks to the same reading. From the ground, the rear end rushes towards the signal and the front end runs away from it: the front clock is set late. Seen from the ground, the clocks of a moving object are out of step, the leading one behind by

$$\\Delta t = \\frac{uL_0}{c^2}$$

### Cause and effect are safe
Could the order of a cause and its effect flip? For two events with $\\Delta x$ greater than $c\\,\\Delta t$ — too far apart for any signal to connect them — the order does depend on the frame. But if $\\Delta x < c\\,\\Delta t$, a transformation with $u < c$ can never reverse the sign of $\\Delta t'$: every observer agrees which came first. The dividing line is the sign of $(c\\Delta t)^2 - \\Delta x^2$, an [[?invariant]] explored in [[spacetime-geometry]].

> [!key] Simultaneity at a distance is not absolute: events simultaneous in one frame, $\\Delta x$ apart along the motion, are $\\gamma u\\Delta x/c^2$ apart in a frame moving at $u$ — the forward one first. Events that can influence each other keep their order.

**In the simulation**, lightning strikes both ends of a train. From the platform the strikes are simultaneous and Pat sees them together; Tom runs into the front flash first. Switch to the train's frame: now the front strike happens first, so Tom, sitting still in the middle, meets its light first, while Pat, carried backwards, runs into the rear flash just in time to see both together. *Who sees what* is the same in both frames; only the times of the strikes differ. The space-time diagram underneath shows the two strikes, the light rays and the other frame's line of "now".
`,
  ideas: [
    'Simultaneity of distant events depends on the observer; each observer is right in his own frame.',
    'Events simultaneous in one frame and Δx apart are γuΔx/c² apart in a frame moving at u; the forward event comes first.',
    'Clocks synchronised in a moving object look out of step from outside: the leading clock lags by uL₀/c².',
    'The effect is tiny at everyday speeds (about 10⁻¹³ s for a fast train) and large near c.',
    'Only events too far apart for light to connect them can change order; cause always precedes effect for everyone.'
  ],
  pitfalls: [
    'Tom sees the front flash first only because the light from the rear is delayed on its way — He allows for the travel time. Light moves at c in both directions in his frame and he is at the middle, so after correcting he still finds the front strike happened first.',
    'One of the two observers must really be right — There is no preferred frame; "simultaneous" only has a meaning together with a frame.',
    'Relativity allows effects before causes for fast observers — The order of events can flip only if no signal at or below c could connect them, so no cause is ever seen after its effect.'
  ],
  derivation: {
    title: 'The time difference from the Lorentz transformation',
    steps: [
      { text: 'Write the transformation of time for two events, 1 and 2, and subtract. Differences transform like the coordinates themselves, because the transformation is linear:', tex: '\\Delta t\' = \\gamma\\left(\\Delta t - \\frac{u\\,\\Delta x}{c^2}\\right)' },
      { text: 'Simultaneous in the platform frame means $\\Delta t = 0$. What remains is the train-frame difference; the minus sign says the event with larger $x$ (further forward) has the smaller $t\'$:', tex: '\\Delta t\' = -\\gamma\\,\\frac{u\\,\\Delta x}{c^2}' },
      { text: 'For the train, $\\Delta x$ is its length as measured on the platform, $L_0/\\gamma$. The $\\gamma$ cancels:', tex: '|\\Delta t\'| = \\gamma\\,\\frac{u}{c^2}\\,\\frac{L_0}{\\gamma} = \\frac{uL_0}{c^2}' },
      { text: 'For the order of two events to flip, $\\Delta t\'$ must change sign, which needs $u\\,\\Delta x/c^2 > \\Delta t$, that is $u > c^2\\Delta t/\\Delta x$. With $u < c$ this is possible only if $\\Delta x > c\\,\\Delta t$.' }
    ]
  },
  formulas: [
    {
      name: 'Time between events that are simultaneous in another frame',
      expr: 'dtp = u*dx/(c^2*sqrt(1 - u^2/c^2))', tex: "\\Delta t' = \\dfrac{u\\,\\Delta x}{c^2\\sqrt{1 - u^2/c^2}}",
      vars: {
        dtp: { name: 'time between the events in the moving frame', q: 'time', unit: 'µs', tex: "\\Delta t'" },
        u: { name: 'speed of the moving frame', q: 'speed', unit: 'c', value: 0.6, max: 0.9999 },
        dx: { name: 'distance between the events (frame where they are simultaneous)', q: 'length', unit: 'm', value: 240, tex: '\\Delta x' },
        c: { const: 'c' }
      },
      note: 'The event further in the direction of motion happens first in the moving frame.',
      stories: { dtp: 'Two lightning strikes {dx} apart are simultaneous for the platform. How far apart in time are they for a train moving at {u}?', u: 'Strikes {dx} apart, simultaneous on the platform, are {dtp} apart for a train. How fast is the train?' }
    },
    {
      name: 'Leading clocks lag',
      expr: 'dt = u*L0/c^2', tex: '\\Delta t = \\dfrac{u L_0}{c^2}',
      vars: {
        dt: { name: 'how far the front clock reads behind the rear one', q: 'time', unit: 'µs', tex: '\\Delta t' },
        u: { name: 'speed of the object', q: 'speed', unit: 'c', value: 0.6 },
        L0: { name: 'rest length between the clocks', q: 'length', unit: 'm', value: 300, tex: 'L_0' },
        c: { const: 'c' }
      },
      note: 'Clocks synchronised in their own rest frame, read at one instant of the other frame.',
      stories: { dt: 'Clocks at both ends of a {L0} train are synchronised on board. Seen from the ground as it passes at {u}, by how much does the front clock lag?' }
    },
    {
      name: 'When the rider meets the two flashes (platform frame)',
      expr: 'dt = L*u/(c^2 - u^2)', tex: '\\Delta t = \\dfrac{L u}{c^2 - u^2}',
      vars: {
        dt: { name: 'delay between the rider meeting the front and the rear flash', q: 'time', unit: 'µs', tex: '\\Delta t' },
        L: { name: 'length of the train as measured on the platform', q: 'length', unit: 'm', value: 240 },
        u: { name: 'speed of the train', q: 'speed', unit: 'c', value: 0.6, max: 0.9999 },
        c: { const: 'c' }
      },
      note: 'From (L/2)/(c − u) − (L/2)/(c + u), with the strikes simultaneous on the platform.',
      stories: { dt: 'A train measured as {L} long on the platform moves at {u}; lightning strikes both ends at once. How long after meeting the front flash does the rider in the middle meet the rear one?' }
    }
  ],
  examples: [
    {
      title: 'The lightning, in numbers',
      q: 'A train 300 m long at rest moves at 0.6c. Lightning strikes both ends simultaneously in the platform frame. How far apart are the strikes in time for the train?',
      steps: [
        '$\\gamma = 1.25$, so on the platform the train is $300/1.25 = 240$ m long: $\\Delta x = 240$ m.',
        '$\\Delta t\' = \\gamma u\\Delta x/c^2 = 1.25 \\times 0.6 \\times 240/(2.998\\times10^8)$ s $= 0.600$ µs.',
        'Check with $uL_0/c^2 = 0.6 \\times 300/(2.998\\times10^8) = 0.600$ µs.'
      ],
      a: '0.60 µs, the front strike first.'
    },
    {
      title: 'Clocks on a runway',
      q: 'Two clocks at the ends of a 1 km runway are synchronised. An aircraft passes along it at 250 m/s. By how much are they out of step in the aircraft\'s frame?',
      steps: [
        '$\\Delta t = uL_0/c^2 = 250 \\times 1000/(2.998\\times10^8)^2$.',
        '$\\Delta t = 2.8\\times10^{-12}$ s.'
      ],
      a: 'About 3 picoseconds — real, but far below what a pilot could notice.'
    },
    {
      title: 'Can these two events change order?',
      q: 'Event A is at x = 0, t = 0; event B at x = 900 m, t = 2.00 µs. Above what speed along x does an observer see B before A?',
      steps: [
        'Light covers $c\\Delta t = 600$ m in 2 µs, less than 900 m: no signal connects them, so the order can flip.',
        '$\\Delta t\' = 0$ when $u = c^2\\Delta t/\\Delta x = c \\times 600/900 = 0.667c$.',
        'Faster than that, $\\Delta t\' < 0$: B comes first.'
      ],
      a: 'Above two-thirds of c.'
    }
  ],
  quiz: [
    { q: 'In the train frame, which lightning strike happens first?', choices: ['the one at the front', 'the one at the rear', 'both together', 'it depends on where Tom sits'], a: 0, why: 'Δt′ = −γuΔx/c²: the event further forward has the earlier train time.' },
    { q: 'Tom sees the front flash first merely because of the light travel time; after correcting for it he agrees the strikes were simultaneous.', a: false, why: 'He is at the midpoint of the train and light has speed c both ways in his frame, so the correction changes nothing: for him the front strike was first.' },
    { q: 'Clocks synchronised on a spaceship 600 m long pass you at 0.5c. How far (in µs) does the front clock lag behind the rear one?', answer: 1.0, unit: 'µs', why: 'uL₀/c² = 0.5 × 600/3.0 × 10⁸ = 1.0 × 10⁻⁶ s.' },
    { q: 'Event A causes event B (a signal went from A to B). Can a fast observer see B before A?', choices: ['no, never', 'yes, above 0.5c', 'yes, near c', 'only if the signal was light'], a: 0, why: 'Causally connected events have Δx ≤ cΔt, and then Δt′ keeps its sign for any u < c.' }
  ],
  problems: [
    { q: 'A spaceship 400 m long (rest length) passes the Earth at 0.8c. Clocks at its ends were synchronised on board. By how many microseconds does the front clock lag, as seen from the Earth?', answer: 1.067, unit: 'µs', tol: 0.01, hint: 'Δt = uL₀/c².',
      steps: ['$\\Delta t = 0.8 \\times 400/(2.998\\times10^8)$ s.', '$\\Delta t = 1.067$ µs.'] },
    { q: 'Two events 1.5 km apart are simultaneous in frame S. How far apart in time are they (in µs) for an observer moving at 0.8c along the line joining them?', answer: 6.67, unit: 'µs', tol: 0.01, hint: 'Δt′ = γuΔx/c² with γ = 5/3.',
      steps: ['$u\\Delta x/c^2 = 0.8 \\times 1500/(2.998\\times10^8) = 4.003$ µs.', '$\\Delta t\' = (5/3) \\times 4.003 = 6.67$ µs.'] }
  ],
  applications: [
    'GPS and other time-transfer systems must state in which frame their clocks are synchronised; on the rotating Earth, synchronisation round a closed loop leaves a mismatch of the same origin (the Sagnac correction).',
    'Particle experiments decide whether two detector hits could come from one particle by comparing their separation in space and time with c.',
    'Every "paradox" of relativity — the ladder and the barn, the twins — dissolves once the relativity of simultaneity is kept in view.'
  ],
  history: 'Einstein\'s 1905 paper begins by defining simultaneity through light signals between clocks. He told the story of the lightning, the embankment and the train in his popular book *Relativity: The Special and the General Theory* (1916). Feynman\'s version is a spaceship whose clocks are synchronised by a light signal from the middle.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 15 (The Special Theory of Relativity) — simultaneity, with clocks at the two ends of a moving spaceship synchronised from the middle.',
    'Vol. I, ch. 17 (Space-Time) — past, future and the region between them, whose events have no absolute order.'
  ],
  sim: 'rel-lightning'
},

{
  id: 'time-dilation-feyn', parent: 'special-relativity', title: 'Moving clocks run slow', level: 2,
  short: 'A clock that moves ticks more slowly than the clocks it passes, by the factor γ. A light clock shows why with Pythagoras; muons made high in the atmosphere reach the ground only because their clocks are slowed.',
  keywords: ['time dilation', 'light clock', 'proper time', 'moving clocks run slow', 'muon', 'mu-meson', 'cosmic rays', 'twin paradox', 'GPS', 'Hafele–Keating', 'gamma factor'],
  prereq: ['lorentz-transformation-feyn', 'simultaneity-feyn', 'math:pythagorean-theorem'],
  related: ['spacetime-geometry', 'curved-space', 'relativistic-mass-energy', 'physics:time-dilation', 'physics:twin-paradox', 'physics:gravitational-time-dilation'],
  body: `
Feynman explained time dilation with the simplest clock he could imagine: a rod with a mirror at each end, and a pulse of light bouncing between them. One round trip is one tick. With the mirrors a distance $d$ apart, a clock at rest ticks every $2d/c$ — for $d = 1.5$ m, every 10 ns.

### The light clock on the move
Put the clock on a spaceship moving sideways, perpendicular to the rod, at speed $u$. The crew see nothing unusual: the pulse goes straight up and down. But from the ground the pulse has to chase a moving mirror: it runs along a slanted line, the hypotenuse of a right triangle whose sides are $d$ and the distance $u\\,t/2$ the ship moves in half a tick. The light still travels at $c$ — for the ground observer as for everyone — so by [[math:pythagorean-theorem|Pythagoras]]

$$\\left(\\frac{ct}{2}\\right)^2 = d^2 + \\left(\\frac{ut}{2}\\right)^2 \\quad\\Rightarrow\\quad t = \\frac{2d/c}{\\sqrt{1 - u^2/c^2}} = \\gamma\\,\\frac{2d}{c}$$

The moving clock ticks more slowly by the [[?lorentz-factor]] $\\gamma$. At $0.6c$ the 10 ns tick takes 12.5 ns.

### All clocks, not just light clocks
Could this be a quirk of light clocks? If a spring-driven watch, a heartbeat or a decaying atom on the ship kept a different pace from the light clock beside it, the crew could compare them and discover their speed — contradicting the [[principle-of-relativity]]. So every process on the ship slows down together: time itself runs slow. If a moving clock reads an interval $\\Delta\\tau$ (its **proper time**), the clocks it passes read

$$\\Delta t = \\gamma\\,\\Delta\\tau$$

The effect is symmetric: to the crew, the ground clocks are the slow ones. There is no contradiction, because comparing a moving clock with *two* different clocks it passes involves the [[simultaneity-feyn|synchronisation]] of those two, on which the observers disagree.

### Muons reaching the ground
The evidence Feynman chose came from the sky. Cosmic-ray protons strike the upper atmosphere, about 15 km up, and make muons (then called mu-mesons). A muon at rest lives on average 2.197 µs before decaying into an electron and two neutrinos. Even at nearly $c$ it could go only about 660 m in 2.2 µs — so after 15 km, some 23 lifetimes, only one in $10^{10}$ would be left. Yet about one muon per square centimetre per minute reaches sea level. Their clocks run slow:

| Muon speed | $\\gamma$ | Mean path $\\gamma v\\tau$ | Surviving 15 km |
|---|---|---|---|
| $0.9c$ | 2.29 | 1.4 km | $1.6\\times10^{-5}$ |
| $0.99c$ | 7.09 | 4.6 km | 4 % |
| $0.998c$ | 15.8 | 10.4 km | 24 % |
| $0.9998c$ | 50 | 33 km | 63 % |

The fraction surviving a path $h$ follows the [[?exponential]] decay law, $e^{-h/(\\gamma v\\tau)}$. From the muon's own point of view its lifetime is the usual 2.2 µs, but the atmosphere rushing past is [[lorentz-transformation-feyn|contracted]] by $\\gamma$: 15 km becomes 0.95 km at $0.998c$. The two descriptions agree on how many arrive.

### Twins, aeroplanes and satellites
A twin who flies to a star and back ages less than the one who stays home. The situation is not symmetric: only the traveller turns round, changing frames. Clocks flown round the world in airliners (Hafele and Keating, 1971) and the clocks of the GPS satellites — which move at 3.9 km/s and would lose about 7 µs a day to motion alone — show the effect directly; for GPS it is combined with the opposite effect of gravity described in [[curved-space]].

> [!key] A clock moving at speed $u$ runs slow by $\\gamma = 1/\\sqrt{1 - u^2/c^2}$ as judged by the clocks it passes. It is not the clock that is faulty: time between two events is longest for the clock present at both.

**In the simulations**, the light clock rides a train beside an identical clock on the platform: count the ticks, watch the zigzag, and switch to the train's view to see the symmetry. Then send muons down through the atmosphere and compare the column with time dilation against the column without.
`,
  ideas: [
    'A light clock seen moving has its pulse on a longer, slanted path at the same speed c, so it ticks slowly by γ.',
    'By the principle of relativity every process slows down alike: time itself runs slow in a moving frame.',
    'Proper time τ is what a clock reads; the clocks it passes read Δt = γΔτ.',
    'Muons from 15 km reach the ground because γ ≈ 16 stretches their 2.2 µs life; in their frame the atmosphere is contracted instead.',
    'Aircraft clocks, GPS satellites and particle beams confirm the effect every day.'
  ],
  pitfalls: [
    'Time dilation is only about light clocks, or a fault in the clocks — If any kind of clock disagreed with a light clock in the same ship, the ship\'s motion could be detected; so all processes slow together.',
    'If each observer sees the other\'s clock slow, one of them must be wrong — Comparing a moving clock with clocks at two places depends on how those two are synchronised, and the observers disagree about that; both statements are true.',
    'The twin paradox shows relativity is inconsistent — The twins are not symmetric: only the traveller changes frames at the turn-around, and the straight path through space-time is the one with the most proper time.'
  ],
  derivation: {
    title: 'The tick of a moving light clock',
    steps: [
      { text: 'At rest the pulse travels $d$ up and $d$ down: one tick is $t_0 = 2d/c$.' },
      { text: 'Seen moving sideways at $u$, in half a tick $t/2$ the pulse goes along a slanted line of length $c\\,t/2$ while the clock moves $u\\,t/2$; the rod height $d$ is unchanged, since lengths perpendicular to the motion do not contract. Pythagoras:', tex: '\\left(\\frac{ct}{2}\\right)^2 = d^2 + \\left(\\frac{ut}{2}\\right)^2' },
      { text: 'Collect the terms in $t^2$ and take the [[?square-root]]:', tex: 't^2\\,\\frac{c^2 - u^2}{4} = d^2 \\quad\\Rightarrow\\quad t = \\frac{2d}{\\sqrt{c^2 - u^2}}' },
      { text: 'Factor out $c$ and compare with the tick at rest:', tex: 't = \\frac{2d/c}{\\sqrt{1 - u^2/c^2}} = \\gamma\\, t_0' },
      { text: 'For $u \\ll c$, the [[?small-approximation]] gives $\\gamma \\approx 1 + u^2/2c^2$: a clock moving at speed $u$ loses a fraction $u^2/2c^2$ of the elapsed time.' }
    ]
  },
  formulas: [
    {
      name: 'Time dilation',
      expr: 'dt = dtau/sqrt(1 - v^2/c^2)', tex: '\\Delta t = \\dfrac{\\Delta\\tau}{\\sqrt{1 - v^2/c^2}}',
      vars: {
        dt: { name: 'time between the events for the clocks passed', q: 'time', unit: 'µs', tex: '\\Delta t' },
        dtau: { name: 'proper time, read by the moving clock', q: 'time', unit: 'µs', value: 2.197, tex: '\\Delta\\tau' },
        v: { name: 'speed of the moving clock', q: 'speed', unit: 'c', value: 0.998, max: 0.99999999 },
        c: { const: 'c' }
      },
      note: 'Δτ is measured by one clock present at both events; Δt by clocks at the two places, synchronised in their own frame.',
      stories: { dt: 'A muon lives {dtau} in its own frame and moves at {v}. How long does it live according to the Earth?', v: 'A particle whose lifetime at rest is {dtau} is seen to live {dt}. How fast is it moving?' }
    },
    {
      name: 'The tick of a moving light clock',
      expr: 'T = 2*d/sqrt(c^2 - v^2)', tex: 'T = \\dfrac{2d}{\\sqrt{c^2 - v^2}}',
      vars: {
        T: { name: 'tick seen from the ground', q: 'time', unit: 'ns' },
        d: { name: 'distance between the mirrors', q: 'length', unit: 'm', value: 1.5 },
        v: { name: 'speed of the clock, sideways to the rod', q: 'speed', unit: 'c', value: 0.6, max: 0.9999 },
        c: { const: 'c' }
      },
      note: 'At rest (v = 0) the tick is 2d/c.',
      stories: { T: 'A light clock with mirrors {d} apart rides a spaceship at {v}. How long is one tick, as timed from the ground?' }
    },
    {
      name: 'Muons surviving the trip down',
      expr: 'f = exp(-h*sqrt(1 - v^2/c^2)/(v*tau))', tex: 'f = \\exp\\!\\left(-\\dfrac{h\\sqrt{1 - v^2/c^2}}{v\\,\\tau}\\right)',
      vars: {
        f: { name: 'fraction still alive at the ground', q: 'ratio', unit: '%' },
        h: { name: 'distance travelled', q: 'length', unit: 'km', value: 15 },
        v: { name: 'speed of the muons', q: 'speed', unit: 'c', value: 0.998, min: 0.5, max: 0.99999 },
        tau: { name: 'mean lifetime at rest', q: 'time', unit: 'µs', value: 2.197, tex: '\\tau' },
        c: { const: 'c' }
      },
      note: 'The mean path is γvτ; without time dilation it would be vτ ≈ 660 m.',
      stories: { f: 'Muons are made {h} up and fall at {v}. Their lifetime at rest is {tau}. What fraction reaches the ground?', v: 'A fraction {f} of muons made {h} up reaches the ground. How fast are they?' },
      practice: { unknowns: ['f', 'h'] }
    },
    {
      name: 'Time lost by a slow clock',
      expr: 'dT = T*v^2/(2*c^2)', tex: '\\Delta T \\approx \\dfrac{v^2}{2c^2}\\,T',
      vars: {
        dT: { name: 'time lost by the moving clock', q: 'time', unit: 'µs', tex: '\\Delta T' },
        T: { name: 'time elapsed', q: 'time', unit: 'day', value: 1 },
        v: { name: 'speed of the clock', q: 'speed', unit: 'km/s', value: 3.87 },
        c: { const: 'c' }
      },
      note: 'For v ≪ c. A GPS satellite (3.87 km/s) loses about 7 µs a day from motion alone.',
      stories: { dT: 'A clock orbits at {v} for {T}. How much does its motion alone make it lose?' }
    }
  ],
  examples: [
    {
      title: 'Muons with and without time dilation',
      q: 'Muons are made 15 km up and fall at 0.998c. Their mean lifetime at rest is 2.197 µs. What fraction reaches the ground (a) without time dilation, (b) with it?',
      steps: [
        '$v\\tau = 0.998 \\times 2.998\\times10^8 \\times 2.197\\times10^{-6} = 657$ m.',
        '(a) $e^{-15000/657} = e^{-22.8} = 1.2\\times10^{-10}$.',
        '(b) $\\gamma = 1/\\sqrt{1 - 0.998^2} = 15.8$; mean path $15.8 \\times 657 = 10.4$ km; $e^{-15/10.4} = e^{-1.44} = 0.24$.'
      ],
      a: 'About one in ten billion without dilation; about a quarter with it — as observed.'
    },
    {
      title: 'A light clock at 0.6c',
      q: 'A light clock with mirrors 1.5 m apart moves sideways at 0.6c. How long is a tick, as timed from the ground?',
      steps: [
        'At rest: $2d/c = 3/(2.998\\times10^8) = 10.0$ ns.',
        '$\\gamma = 1.25$, so the moving tick is $12.5$ ns.'
      ],
      a: '12.5 ns instead of 10 ns.'
    },
    {
      title: 'A trip to the nearest star',
      q: 'A traveller goes to Proxima Centauri, 4.24 light-years away, and returns at 0.8c. How much time passes on the Earth and for the traveller (ignoring the short accelerations)?',
      steps: [
        'Earth: $2 \\times 4.24/0.8 = 10.6$ years.',
        '$\\gamma = 1/\\sqrt{1 - 0.64} = 1.667$; traveller: $10.6/1.667 = 6.36$ years.'
      ],
      a: 'The stay-at-home twin is about 4.2 years older on the traveller\'s return.'
    }
  ],
  quiz: [
    { q: 'A spaceship passes the Earth at 0.8c. The crew compare their clocks with the Earth\'s. They find…', choices: ['the Earth\'s clocks run slow', 'their own clocks run slow', 'all clocks agree', 'the Earth\'s clocks run fast'], a: 0, why: 'The effect is symmetric: each observer finds the other\'s moving clocks slow by γ.' },
    { q: 'A muon moving at 0.998c "feels" its life stretched to about 35 µs.', a: false, why: 'In its own frame it lives the usual 2.2 µs; there the atmosphere is contracted to under 1 km.' },
    { q: 'Why must a mechanical watch on a fast ship slow down exactly like a light clock?', choices: ['otherwise the crew could detect their uniform motion', 'the springs are compressed by the motion', 'light controls all clocks', 'it need not: only light clocks slow down'], a: 0, why: 'A disagreement between two clocks in the same ship would reveal its speed, contradicting the principle of relativity.' },
    { q: 'At what speed (as a fraction of c) does a moving clock run at half the rate of the clocks it passes?', answer: 0.866, unit: 'c', why: 'γ = 2 requires 1 − v²/c² = 1/4.' },
    { q: 'In the twin paradox the travelling twin is younger because…', choices: ['only she changes from one inertial frame to another', 'she is further from the Earth\'s gravity', 'her clocks were wrongly set', 'moving people age more slowly than moving clocks'], a: 0, why: 'The stay-at-home twin stays in one inertial frame; the traveller turns round. The paths through space-time differ, and the straight one has the most proper time.' }
  ],
  problems: [
    { q: 'Charged pions have a mean lifetime at rest of 26.0 ns. How far does a pion moving at 0.95c travel on average before decaying?', answer: 23.7, unit: 'm', tol: 0.02, hint: 'Mean distance = γvτ.',
      steps: ['$\\gamma = 1/\\sqrt{1 - 0.9025} = 3.20$.', '$v\\tau = 0.95 \\times 2.998\\times10^8 \\times 26\\times10^{-9} = 7.41$ m.', 'Mean distance $= 3.20 \\times 7.41 = 23.7$ m.'] },
    { q: 'A clock is flown at 250 m/s for 10 hours. Ignoring gravity, how much time (in ns) does its motion make it lose?', answer: 12.5, unit: 'ns', tol: 0.03, hint: 'ΔT ≈ (v²/2c²) T.',
      steps: ['$v^2/2c^2 = 250^2/(2 \\times 8.988\\times10^{16}) = 3.48\\times10^{-13}$.', '$\\Delta T = 3.48\\times10^{-13} \\times 36\\,000$ s $= 1.25\\times10^{-8}$ s $= 12.5$ ns.'] }
  ],
  applications: [
    'GPS: the satellite clocks are set to run slightly slow before launch so that, after the effects of motion (−7 µs a day) and weaker gravity (+46 µs a day), they keep time with the ground.',
    'Particle physics: short-lived particles in accelerators travel metres instead of millimetres, which is how their tracks are seen at all; storage rings keep muons for many times their rest lifetime.',
    'Atomic clocks compared at different speeds and heights now resolve time dilation at walking pace and height differences of a fraction of a metre.'
  ],
  history: 'Bruno Rossi and David Hall measured the decay of cosmic-ray muons at different altitudes in Colorado in 1941 and saw lifetimes stretched as predicted. David Frisch and James Smith repeated the comparison between the summit of Mount Washington and sea level in 1963, finding that about 70 % of the muons survived the descent where only a few per cent would have without time dilation. Joseph Hafele and Richard Keating flew caesium clocks round the world in both directions in 1971.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 15 (The Special Theory of Relativity) — the light clock in a moving spaceship, why all clocks must slow alike, and the lifetime of cosmic-ray mu-mesons.',
    'Vol. I, ch. 16 (Relativistic Energy and Momentum) — the twin paradox.'
  ],
  sim: ['rel-light-clock', 'rel-muons']
},

{
  id: 'relativistic-mass-energy', parent: 'special-relativity', title: 'Relativistic energy, momentum and E = mc²', level: 2,
  short: 'Push a particle and its momentum grows without limit while its speed creeps towards c. Its energy is γmc²: the rest energy mc² plus kinetic energy — and every energy has mass. Energy and momentum are tied by E² − (pc)² = (mc²)², the same for every observer.',
  keywords: ['E = mc²', 'mass–energy equivalence', 'rest energy', 'relativistic mass', 'relativistic momentum', 'kinetic energy', 'energy–momentum relation', 'invariant mass', 'photon', 'massless', 'nuclear energy', 'binding energy'],
  prereq: ['time-dilation-feyn', 'conservation-of-energy', 'conservation-of-momentum'],
  related: ['four-vectors-feyn', 'spacetime-geometry', 'electromagnetic-mass', 'physics:mass-energy', 'physics:relativistic-momentum', 'physics:relativistic-energy'],
  body: `
Newton's second law says a steady force changes momentum steadily. Keep pushing and, in Newton's world, the speed grows without limit. Relativity forbids speeds above $c$ — so something in Newton's mechanics must give. Feynman showed what: the momentum is not $mv$ but

$$p = \\frac{mv}{\\sqrt{1 - v^2/c^2}} = \\gamma m v$$

With this momentum, $F = dp/dt$ remains true in every frame, momentum is conserved in collisions seen by any observer, and a steady push makes $p$ grow for ever while $v$ approaches $c$ ever more slowly.

### A note on the word "mass"
Feynman wrote this as $p = mv$ with a mass that grows with speed, $m = m_0/\\sqrt{1 - v^2/c^2}$, and derived the growth from a collision seen from two frames. Most physicists today keep the letter $m$ for the rest mass $m_0$, which every observer agrees on, and put the $\\gamma$ into the momentum and energy instead. The physics is identical; this page uses the modern notation.

### E = mc²
The energy that goes with this momentum is

$$E = \\gamma mc^2 = \\frac{mc^2}{\\sqrt{1 - v^2/c^2}}$$

To see what it means, expand $\\gamma$ in a [[?taylor-series]] for $v \\ll c$:

$$E = mc^2 + \\tfrac12 mv^2 + \\tfrac38 mv^2\\,\\frac{v^2}{c^2} + \\dots$$

The second term is Newton's kinetic energy; the rest are its relativistic corrections. The first term is new: a body at rest has energy $mc^2$. The kinetic energy is $K = E - mc^2 = (\\gamma - 1)mc^2$. Turn the statement round and every energy has mass $E/c^2$: Feynman's example was a gas, whose mass grows when it is heated, because its molecules move faster.

| What changes | Energy | Mass change $\\Delta E/c^2$ |
|---|---|---|
| 1 kg of water heated by 80 K | 335 kJ | $3.7\\times10^{-12}$ kg |
| 1 kg of coal burned | 30 MJ | $3.3\\times10^{-10}$ kg |
| 1 kg of uranium-235 fissioned | $8\\times10^{13}$ J | 0.9 g |
| the Sun, every second | $3.8\\times10^{26}$ J | 4.3 million tonnes |

Chemistry changes masses by parts in $10^{10}$ — far beyond any balance — which is why mass seemed conserved for two centuries; nuclear reactions change them by parts in a thousand.

### The energy–momentum relation
Eliminate $v$ between $E = \\gamma mc^2$ and $p = \\gamma mv$ (use $\\gamma^2 - \\gamma^2v^2/c^2 = 1$):

$$E^2 - (pc)^2 = (mc^2)^2$$

The left side is built from quantities that change from frame to frame, yet it equals the rest energy squared — an [[?invariant]]. Draw it in the plane of $pc$ across and $E$ up: a particle of mass $m$ lives on a hyperbola ([[math:hyperbola|see Hyper Math]]) whose lowest point is the rest energy. As you push, its point slides up the curve; the slope $dE/d(pc) = v/c$ approaches 1 but never reaches it. Also, $v = pc^2/E$. A particle with **no** mass, such as a photon, lives on the asymptote $E = pc$ and always moves at $c$.

| Particle | $mc^2$ |
|---|---|
| electron | 0.511 MeV |
| muon | 105.7 MeV |
| proton | 938.3 MeV |
| photon | 0 |

> [!key] $E = \\gamma mc^2$, $p = \\gamma mv$, and $E^2 - (pc)^2 = (mc^2)^2$ in every frame. A body at rest holds energy $mc^2$, and any energy $E$ carries mass $E/c^2$.

**In the simulation** a particle is pushed by a steady force. Its point climbs the hyperbola $E^2 - (pc)^2 = (mc^2)^2$; beside it, the dashed Newtonian curve $mc^2 + p^2/2m$ bends away. The graph below shows the speed: Newton's crosses $c$ in finite time, Einstein's never does.
`,
  ideas: [
    'Relativistic momentum is p = γmv; with it, F = dp/dt and momentum conservation hold in every frame.',
    'A steady force makes p grow without limit while v approaches c.',
    'The energy of a moving body is γmc²: rest energy mc² plus kinetic energy (γ − 1)mc².',
    'Every energy has mass E/c²: heat, light, the binding of nuclei.',
    'E² − (pc)² = (mc²)² is the same in every frame; massless particles have E = pc and move at c.'
  ],
  pitfalls: [
    'E = mc² only applies to nuclear reactions — It applies to every energy change: a hot cup of tea is heavier than a cold one, by about 10⁻¹² of its mass.',
    'Kinetic energy is ½mv² with a bigger mass — The relativistic kinetic energy is (γ − 1)mc², which is not ½γmv²; the two agree only at low speed.',
    'A photon has a relativistic mass and therefore a rest mass — It has energy and momentum (E = pc) and no rest mass; its invariant E² − (pc)² is zero.'
  ],
  derivation: {
    title: 'From γ to E² − (pc)² = (mc²)²',
    steps: [
      { text: 'Start from the energy and momentum of a particle of rest mass $m$ at speed $v$:', tex: 'E = \\gamma mc^2, \\qquad pc = \\gamma mv\\,c = \\gamma mc^2\\,\\frac{v}{c}' },
      { text: 'Square both and subtract; $\\gamma^2 m^2c^4$ is a common factor:', tex: 'E^2 - (pc)^2 = \\gamma^2 m^2c^4\\left(1 - \\frac{v^2}{c^2}\\right)' },
      { text: 'By definition $\\gamma^2 = 1/(1 - v^2/c^2)$, so the bracket cancels $\\gamma^2$ exactly:', tex: 'E^2 - (pc)^2 = (mc^2)^2' },
      { text: 'Dividing the two lines of the first step gives the speed from energy and momentum, which also holds for a photon ($E = pc$ gives $v = c$):', tex: '\\frac{v}{c} = \\frac{pc}{E}' }
    ]
  },
  formulas: [
    {
      name: 'Rest energy',
      expr: 'E = m*c^2', tex: 'E = mc^2',
      vars: {
        E: { name: 'rest energy', q: 'energy', unit: 'J' },
        m: { name: 'mass', q: 'mass', unit: 'g', value: 1 },
        c: { const: 'c' }
      },
      note: 'Read either way: a mass m at rest holds energy mc², and any energy E has mass E/c².',
      stories: { E: 'How much energy is held in {m} of matter?', m: 'A process releases {E}. How much mass does the system lose?' }
    },
    {
      name: 'Total energy of a moving particle',
      expr: 'E = m*c^2/sqrt(1 - v^2/c^2)', tex: 'E = \\dfrac{mc^2}{\\sqrt{1 - v^2/c^2}}',
      vars: {
        E: { name: 'total energy', q: 'energy', unit: 'MeV' },
        m: { name: 'rest mass', q: 'mass', unit: 'MeV/c²', value: 938.27 },
        v: { name: 'speed', q: 'speed', unit: 'c', value: 0.9, max: 0.99999999 },
        c: { const: 'c' }
      },
      note: 'E = γmc². The default is a proton.',
      stories: { E: 'A particle of mass {m} moves at {v}. What is its total energy?', v: 'A particle of mass {m} has total energy {E}. How fast does it move?' }
    },
    {
      name: 'Energy and momentum',
      expr: 'E = sqrt((p*c)^2 + (m*c^2)^2)', tex: 'E = \\sqrt{(pc)^2 + (mc^2)^2}',
      vars: {
        E: { name: 'total energy', q: 'energy', unit: 'MeV' },
        p: { name: 'momentum', q: 'momentum', unit: 'MeV/c', value: 1 },
        m: { name: 'rest mass', q: 'mass', unit: 'MeV/c²', value: 0.511 },
        c: { const: 'c' }
      },
      note: 'The same as E² − (pc)² = (mc²)². For m = 0 (a photon), E = pc. The default is an electron.',
      stories: { E: 'An electron (mass {m}) has momentum {p}. What is its total energy?', p: 'A particle of mass {m} has total energy {E}. What is its momentum?', m: 'A particle has energy {E} and momentum {p}. What is its rest mass?' }
    },
    {
      name: 'Kinetic energy',
      expr: 'K = (1/sqrt(1 - v^2/c^2) - 1)*m*c^2', tex: 'K = \\left(\\dfrac{1}{\\sqrt{1 - v^2/c^2}} - 1\\right) mc^2',
      vars: {
        K: { name: 'kinetic energy', q: 'energy', unit: 'MeV' },
        v: { name: 'speed', q: 'speed', unit: 'c', value: 0.9, max: 0.99999999 },
        m: { name: 'rest mass', q: 'mass', unit: 'MeV/c²', value: 0.511 },
        c: { const: 'c' }
      },
      note: 'K = (γ − 1)mc², which becomes ½mv² when v ≪ c.',
      stories: { K: 'What is the kinetic energy of a particle of mass {m} moving at {v}?', v: 'An electron (mass {m}) has been given {K} of kinetic energy. How fast does it move?' }
    }
  ],
  examples: [
    {
      title: 'An electron accelerated through a million volts',
      q: 'An electron (mc² = 0.511 MeV) gains 1.00 MeV of kinetic energy. Find its total energy, γ, momentum and speed.',
      steps: [
        '$E = K + mc^2 = 1.511$ MeV, so $\\gamma = E/mc^2 = 2.957$.',
        '$pc = \\sqrt{E^2 - (mc^2)^2} = \\sqrt{2.283 - 0.261} = 1.422$ MeV.',
        '$v/c = pc/E = 1.422/1.511 = 0.941$.',
        'Newton would say $v = \\sqrt{2K/m} = \\sqrt{2 \\times 1/0.511}\\,c = 1.98c$ — impossible.'
      ],
      a: 'E = 1.511 MeV, γ = 2.96, p = 1.42 MeV/c, v = 0.941c.'
    },
    {
      title: 'The energy in a gram',
      q: 'How much energy is equivalent to 1 g of mass?',
      steps: [
        '$E = mc^2 = 10^{-3} \\times (2.998\\times10^8)^2 = 8.99\\times10^{13}$ J.',
        'One kilotonne of TNT is $4.184\\times10^{12}$ J, so this is about 21 kilotonnes.'
      ],
      a: '9.0 × 10¹³ J — the yield of a large nuclear weapon, or about 25 GWh.'
    },
    {
      title: 'The Sun loses weight',
      q: 'The Sun radiates 3.83 × 10²⁶ W. How much mass does it lose each second?',
      steps: [
        '$\\Delta m/\\Delta t = P/c^2 = 3.83\\times10^{26}/(8.988\\times10^{16})$.',
        '$= 4.26\\times10^9$ kg/s.'
      ],
      a: 'About 4.3 million tonnes a second — yet in 4.6 billion years only about 0.03 % of its mass.'
    }
  ],
  quiz: [
    { q: 'A steady force pushes a particle for a very long time. What happens?', choices: ['its momentum grows without limit while its speed approaches c', 'its speed grows without limit', 'its momentum approaches a limit', 'it stops accelerating at 0.99c'], a: 0, why: 'F = dp/dt still holds with p = γmv; p grows steadily but v = pc²/E creeps towards c.' },
    { q: 'Two observers moving relative to each other measure different E and p for the same particle, but the same E² − (pc)².', a: true, why: 'E² − (pc)² = (mc²)² is an invariant: the rest energy squared.' },
    { q: 'By how much (in kg) does the mass of 1 kg of water increase when it is heated by 80 K? (c_water = 4186 J/(kg·K))', answer: 3.7e-12, unit: 'kg', why: 'ΔE = 4186 × 80 = 3.35 × 10⁵ J; Δm = ΔE/c² = 3.7 × 10⁻¹² kg.' },
    { q: 'For a photon of energy 2 MeV, the momentum is…', choices: ['2 MeV/c', 'zero, since it has no mass', 'infinite', '1 MeV/c'], a: 0, why: 'With m = 0, E² = (pc)², so p = E/c.' },
    { q: 'At 0.1c, the relativistic kinetic energy compared with ½mv² is…', choices: ['slightly larger (by about 0.75 %)', 'slightly smaller', 'exactly equal', 'twice as large'], a: 0, why: 'K = ½mv²(1 + ¾v²/c² + …): at v²/c² = 0.01 the correction is +0.75 %.' }
  ],
  problems: [
    { q: 'A proton (mc² = 938.3 MeV) has 1.00 GeV of kinetic energy. What is its speed, as a fraction of c?', answer: 0.875, unit: 'c', tol: 0.005, hint: 'γ = 1 + K/mc², then v/c = √(1 − 1/γ²).',
      steps: ['$\\gamma = 1 + 1000/938.3 = 2.066$.', '$v/c = \\sqrt{1 - 1/2.066^2} = \\sqrt{1 - 0.2343} = 0.875$.'] },
    { q: 'What momentum (in MeV/c) does an electron with total energy 5.00 MeV have? (mc² = 0.511 MeV)', answer: 4.974, unit: 'MeV/c', tol: 0.01, hint: 'pc = √(E² − (mc²)²).',
      steps: ['$pc = \\sqrt{25 - 0.261} = \\sqrt{24.739} = 4.974$ MeV.', 'So $p = 4.974$ MeV/c — nearly E/c, as for a photon.'] }
  ],
  applications: [
    'Nuclear power and the Sun: fission and fusion release the energy equivalent of a fraction of a per cent of the fuel\'s mass.',
    'Particle accelerators and PET scanners: an electron and a positron annihilate into two 511 keV photons — their whole rest energy turned into light.',
    'Most of the mass of an atom is not the rest mass of its quarks but the energy of the fields binding them inside protons and neutrons.'
  ],
  history: 'Walter Kaufmann and Alfred Bucherer measured the growth of the electron\'s momentum with speed between 1901 and 1908. Einstein derived E = mc² in a short paper of September 1905, "Does the inertia of a body depend upon its energy content?". John Cockcroft and Ernest Walton split lithium nuclei with protons in 1932 and found the energy released matched the loss of mass.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 15 (The Special Theory of Relativity) — relativistic dynamics and the equivalence of mass and energy, including the heated gas whose mass increases.',
    'Vol. I, ch. 16 (Relativistic Energy and Momentum) — the collision argument for relativistic mass, and relativistic energy.',
    'Vol. I, ch. 17 (Space-Time) — energy and momentum as one four-vector.'
  ],
  sim: 'rel-energy'
},

{
  id: 'spacetime-geometry', parent: 'spacetime-topic', title: 'The geometry of space-time', level: 2,
  short: 'Put space and time on one diagram and relativity becomes geometry. The distance every observer agrees on is the interval (cΔt)² − Δx², with a minus sign; it sorts pairs of events into time-like, light-like and space-like, and makes the straight world line the one with the most proper time.',
  keywords: ['space-time', 'spacetime', 'Minkowski', 'world line', 'light cone', 'interval', 'proper time', 'time-like', 'space-like', 'light-like', 'past and future', 'rapidity', 'hyperbolic rotation', 'twin paradox'],
  prereq: ['lorentz-transformation-feyn', 'simultaneity-feyn', 'math:hyperbola'],
  related: ['four-vectors-feyn', 'time-dilation-feyn', 'curved-space', 'physics:spacetime-interval', 'physics:twin-paradox', 'math:hyperbolic-functions'],
  body: `
Feynman turned relativity into geometry. Draw one diagram with position $x$ across and time $ct$ upwards — measuring time in metres of light travel, so 1 µs is 300 m. Every **event** (a flash, a collision, a tick) is a point. The whole history of an object is a line, its **world line**: vertical for something at rest, tilted for something moving, and at exactly 45° for light. No world line can be flatter than 45°.

### The distance everyone agrees on
On an ordinary map, turning the axes changes the coordinates of two points but not the distance between them: $\\Delta x^2 + \\Delta y^2$ is unchanged. A [[lorentz-transformation-feyn|Lorentz transformation]] changes $\\Delta t$ and $\\Delta x$, but it leaves

$$s^2 = (c\\Delta t)^2 - \\Delta x^2 - \\Delta y^2 - \\Delta z^2$$

unchanged. This **interval** is the [[?invariant]] of space-time. Feynman described the Lorentz transformation as a rotation in a space whose "distance" is found with this minus sign: not a Euclidean geometry, but one where the curves of constant distance from a point are [[math:hyperbola|hyperbolas]] instead of circles.

### Past, future and elsewhere
The sign of $s^2$ sorts every pair of events:

| $s^2$ | Name | What it means |
|---|---|---|
| $> 0$ | time-like | a clock can be present at both; every observer agrees which came first; $\\sqrt{s^2}/c$ is the time that clock shows |
| $= 0$ | light-like | a light ray can join them |
| $< 0$ | space-like | no signal can join them; the order depends on the observer; $\\sqrt{-s^2}$ is their distance in the frame where they are simultaneous |

The light rays through an event form its **light cone**. Inside the upper cone is the event's future — everything it can influence; inside the lower cone, its past — everything that can have influenced it. Outside lies a region that is neither: events there cannot affect or be affected by it, and different observers disagree about whether they happen before or after. For us on Earth, events on the Sun happening "right now" are in that region for 8.3 minutes either way.

### Proper time, and why the straight line is longest
A clock carried along a world line measures its **proper time**: add up $d\\tau = \\sqrt{dt^2 - dx^2/c^2}$ along the line (an [[?integral]]). Between two time-like events the *straight* world line — the clock that never accelerates — gives the **longest** proper time; any detour gives less. It is the opposite of Euclid (where the straight line is shortest) because of the minus sign. That is the whole twin paradox in one sentence: a twin who flies 4 light-years out at $0.8c$ and back takes 10 years by the home clock, but along each leg $\\tau = \\sqrt{5^2 - 4^2} = 3$ years, 6 in all.

### Boosts add like angles
Write the speed as $v/c = \\tanh\\varphi$, where $\\varphi$ is the **[[?rapidity|rapidity]]** (see the [[?hyperbolic|hyperbolic functions]] and [[math:hyperbolic-functions]]). Then $\\gamma = \\cosh\\varphi$ and $\\gamma v/c = \\sinh\\varphi$, and the Lorentz transformation reads

$$x' = x\\cosh\\varphi - ct\\,\\sinh\\varphi, \\qquad ct' = ct\\cosh\\varphi - x\\sinh\\varphi$$

— a rotation with $\\cos$ and $\\sin$ replaced by $\\cosh$ and $\\sinh$, and $\\cosh^2 - \\sinh^2 = 1$ keeping $s^2$ fixed. Two boosts in a row simply add their rapidities, exactly as two rotations add their angles; the [[principle-of-relativity|velocity-addition rule]] is the addition formula for $\\tanh$.

> [!key] Space and time form one space-time whose invariant "distance" is $s^2 = (c\\Delta t)^2 - \\Delta x^2$. Its sign separates cause-and-effect pairs from pairs no signal can join; the straight world line has the most proper time.

**In the simulation** drag the events A, B and the turning point T. Boost the frame: every event slides along its own hyperbola of constant $s^2$, A stays inside the light cone, while B, outside it, can be moved from after O to before it. The bent path O–T–A shows less proper time than the straight one.
`,
  ideas: [
    'Events are points and histories are world lines in a diagram of x against ct; light moves at 45°.',
    'The interval s² = (cΔt)² − Δx² is the same for every observer: an invariant with a minus sign.',
    'Time-like pairs have a fixed order and a clock can attend both; space-like pairs can change order; light-like pairs are joined by light.',
    'Proper time along a world line is ∫√(dt² − dx²/c²); the straight world line has the most.',
    'With rapidity φ (v/c = tanh φ) a boost is a hyperbolic rotation, and successive boosts add their rapidities.'
  ],
  pitfalls: [
    'The interval is the ordinary distance in four dimensions — It has a minus sign between time and space, so it can be zero for distinct events (along light) or negative (space-like).',
    'On a space-time diagram the longer-looking line takes longer — The bent path of the travelling twin looks longer on paper but carries less proper time; the minus sign reverses the Euclidean intuition.',
    'Events outside the light cone can still be influenced if we wait — Waiting moves you up your own world line; an event outside the cone of a given event can never be affected by that event.'
  ],
  derivation: {
    title: 'Why the interval does not change',
    steps: [
      { text: 'Use the Lorentz transformation for differences between two events (along $x$, so $\\Delta y$ and $\\Delta z$ are untouched):', tex: 'c\\Delta t\' = \\gamma\\,(c\\Delta t - \\beta\\Delta x), \\qquad \\Delta x\' = \\gamma\\,(\\Delta x - \\beta\\, c\\Delta t)' },
      { text: 'Square both and subtract. The cross terms $\\mp 2\\gamma^2\\beta\\, c\\Delta t\\,\\Delta x$ cancel:', tex: '(c\\Delta t\')^2 - \\Delta x\'^2 = \\gamma^2(1 - \\beta^2)\\left[(c\\Delta t)^2 - \\Delta x^2\\right]' },
      { text: 'Since $\\gamma^2(1 - \\beta^2) = 1$ by the definition of the [[?lorentz-factor]], the interval is the same in both frames:', tex: '(c\\Delta t\')^2 - \\Delta x\'^2 = (c\\Delta t)^2 - \\Delta x^2' },
      { text: 'For a clock present at both events, $\\Delta x = 0$ in its own frame, so the interval is $c$ times the time it shows: $s = c\\,\\Delta\\tau$. That is why proper time can be computed in any frame.' }
    ]
  },
  formulas: [
    {
      name: 'Proper time between two events',
      expr: 'tau = sqrt(dt^2 - dx^2/c^2)', tex: '\\tau = \\sqrt{\\Delta t^2 - \\Delta x^2/c^2}',
      vars: {
        tau: { name: 'proper time, read by a clock present at both', q: 'time', unit: 'µs', tex: '\\tau' },
        dt: { name: 'time between the events', q: 'time', unit: 'µs', value: 5, tex: '\\Delta t' },
        dx: { name: 'distance between the events', q: 'length', unit: 'm', value: 900, tex: '\\Delta x' },
        c: { const: 'c' }
      },
      note: 'Time-like separation only (cΔt > Δx). The same for every observer.',
      stories: { tau: 'Two events are {dt} and {dx} apart. How much time passes on a clock that travels uniformly from one to the other?', dx: 'A clock goes between two events {dt} apart and shows {tau}. How far apart are the events in this frame?' }
    },
    {
      name: 'Proper distance between space-like events',
      expr: 'sigma = sqrt(dx^2 - (c*dt)^2)', tex: '\\sigma = \\sqrt{\\Delta x^2 - (c\\Delta t)^2}',
      vars: {
        sigma: { name: 'distance in the frame where they are simultaneous', q: 'length', unit: 'm', tex: '\\sigma' },
        dx: { name: 'distance between the events', q: 'length', unit: 'm', value: 1000, tex: '\\Delta x' },
        dt: { name: 'time between the events', q: 'time', unit: 'µs', value: 2, tex: '\\Delta t' },
        c: { const: 'c' }
      },
      note: 'Space-like separation only (Δx > cΔt).',
      stories: { sigma: 'Two events are {dx} apart and {dt} apart in time. How far apart are they for an observer who finds them simultaneous?' }
    },
    {
      name: 'Speed from rapidity',
      expr: 'v = c*tanh(phi)', tex: 'v = c\\tanh\\varphi',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'c' },
        phi: { name: 'rapidity', value: 1, tex: '\\varphi' },
        c: { const: 'c' }
      },
      note: 'Rapidities of successive boosts along one line simply add; γ = cosh φ.',
      stories: { v: 'Two boosts along the same line have a combined rapidity of {phi}. What is the resulting speed?', phi: 'What is the rapidity of a particle moving at {v}?' }
    }
  ],
  examples: [
    {
      title: 'Which kind of separation?',
      q: 'Event A is at x = 0, t = 0; event B at x = 600 m, t = 1.00 µs. Classify the separation and find the invariant distance or time.',
      steps: [
        '$c\\Delta t = 299.8$ m, $\\Delta x = 600$ m.',
        '$s^2 = 299.8^2 - 600^2 = 89\\,875 - 360\\,000 = -270\\,125$ m²: negative, so space-like.',
        'Proper distance $\\sqrt{270\\,125} = 519.7$ m.'
      ],
      a: 'Space-like; 520 m apart in the frame where they are simultaneous. Their order depends on the observer.'
    },
    {
      title: 'The twins by geometry',
      q: 'The home twin waits 10 years. The traveller goes 4 light-years out at 0.8c and returns. Compute the traveller\'s proper time from the interval.',
      steps: [
        'Each leg: $\\Delta t = 5$ years, $\\Delta x = 4$ light-years.',
        '$\\tau = \\sqrt{5^2 - 4^2} = 3$ years per leg.',
        'Total 6 years against 10 on the straight world line.'
      ],
      a: '6 years for the traveller, 10 at home: the straight world line is the longest.'
    },
    {
      title: 'Two boosts of 0.6c',
      q: 'A rocket moves at 0.6c relative to a station; a probe leaves the rocket forward at 0.6c. Use rapidities to find the probe\'s speed relative to the station.',
      steps: [
        '$\\varphi_1 = \\varphi_2 = \\operatorname{artanh} 0.6 = 0.693$.',
        '$\\varphi = 1.386$; $\\tanh 1.386 = 0.882$.',
        'Check: $(0.6 + 0.6)/(1 + 0.36) = 0.882$.'
      ],
      a: '0.882c.'
    }
  ],
  quiz: [
    { q: 'Two events are 1 second apart in time and 400 000 km apart in space. Their separation is…', choices: ['space-like', 'time-like', 'light-like', 'impossible to classify without choosing a frame'], a: 0, why: 'Light covers only about 300 000 km in 1 s, so Δx > cΔt and s² < 0 — in every frame.' },
    { q: 'Between two events, the straight (unaccelerated) world line has the least proper time.', a: false, why: 'It has the most. Any other path through space-time between the same events shows less time on its clock.' },
    { q: 'On a space-time diagram with ct up and x across, what moves along lines at 45°?', choices: ['light', 'anything moving at 0.5c', 'objects at rest', 'nothing — it is only a reference line'], a: 0, why: 'Δx = cΔt for light: equal steps across and up.' },
    { q: 'Two successive boosts along the same line each have rapidity 0.5. What is the final speed, in units of c?', answer: 0.7616, unit: 'c', why: 'Rapidities add: tanh(1.0) = 0.7616.' },
    { q: 'An event E lies outside the light cone of event O. Which is true?', choices: ['some observers see E before O and others after', 'E happened before O for everyone', 'O can influence E if we wait long enough', 'E and O are simultaneous for everyone'], a: 0, why: 'For space-like pairs the time order depends on the frame, and no signal can join them.' }
  ],
  problems: [
    { q: 'Two events are 10.0 µs apart in time and 2.00 km apart in space. What is the proper time between them?', answer: 7.45, unit: 'µs', tol: 0.01, hint: 'τ = √(Δt² − Δx²/c²).',
      steps: ['$\\Delta x/c = 2000/2.998\\times10^8 = 6.671$ µs.', '$\\tau = \\sqrt{100 - 44.50} = 7.45$ µs.'] },
    { q: 'What is the rapidity of a particle moving at 0.99c?', answer: 2.647, unit: '', tol: 0.01, hint: 'φ = artanh(v/c) = ½ ln((1 + β)/(1 − β)).',
      steps: ['$\\varphi = \\tfrac12\\ln(1.99/0.01) = \\tfrac12\\ln 199$.', '$\\varphi = 2.647$.'] }
  ],
  applications: [
    'Causality in physics and engineering: no signal, control action or information can link space-like separated events — a limit that fixes the minimum latency between distant exchanges and spacecraft.',
    'Particle physics uses rapidity because it adds under boosts along the beam; detector coverage is quoted in (pseudo)rapidity.',
    'Explore events, world lines and boosts yourself in [the space-time diagram](#/tools/spacetime).'
  ],
  history: 'Hermann Minkowski presented the four-dimensional space-time view in his lecture "Space and Time" in Cologne in September 1908, announcing that space by itself and time by itself were doomed to fade into shadows. Einstein was at first unimpressed, then used Minkowski\'s geometry as the starting point of general relativity.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 17 (Space-Time) — the geometry of space-time, space-time intervals, and past, present and future.',
    'Vol. I, ch. 16 (Relativistic Energy and Momentum) — the twin paradox.'
  ],
  sim: 'rel-spacetime'
},

{
  id: 'four-vectors-feyn', parent: 'spacetime-topic', title: 'Four-vectors', level: 3,
  short: 'Sets of four quantities that change from observer to observer exactly as (ct, x, y, z) does: displacement, energy–momentum, the frequency and wave vector of light, charge and current, the potentials. Write a law as a relation between four-vectors and it holds in every frame; combine them into invariants and every observer agrees.',
  keywords: ['four-vector', '4-vector', 'energy–momentum four-vector', 'four-momentum', 'Minkowski dot product', 'scalar product', 'invariant mass', 'relativistic Doppler effect', 'four-velocity', 'four-current', 'four-potential', 'Lorentz covariance'],
  prereq: ['spacetime-geometry', 'relativistic-mass-energy', 'vectors-and-symmetry'],
  related: ['relativity-of-fields', 'maxwell-equations-feyn', 'tensors-feyn', 'physics:relativistic-doppler', 'math:dot-product', 'math:linear-transformations'],
  body: `
In three dimensions, Feynman defined a [[?vector]] not simply as an arrow but as three numbers that change in a definite way when the axes are turned — the same way as the coordinates $(x, y, z)$ of a point. The payoff was that an equation between vectors, true for one set of axes, is true for all ([[vectors-and-symmetry]]). He then did the same for space-time: a [[?four-vector]] is a set of four numbers $(a_t, a_x, a_y, a_z)$ that transform like $(ct, x, y, z)$ under a [[lorentz-transformation-feyn|Lorentz transformation]]:

$$a_t' = \\gamma\\,(a_t - \\beta a_x), \\qquad a_x' = \\gamma\\,(a_x - \\beta a_t), \\qquad a_y' = a_y, \\qquad a_z' = a_z$$

### The family
| Four-vector | Time part | Space part |
|---|---|---|
| displacement between events | $c\\Delta t$ | $\\Delta\\vec r$ |
| energy–momentum | $E$ | $\\vec p\\,c$ |
| four-velocity | $\\gamma c$ | $\\gamma\\vec v$ |
| frequency and wave vector of light | $\\omega$ | $\\vec k\\,c$ |
| charge and current density | $\\rho c$ | $\\vec j$ |
| potentials | $\\phi$ | $\\vec A\\,c$ |

The table says, for example, that energy and momentum mix under a boost exactly as time and space do: $E' = \\gamma(E - vp_x)$ and $p_x' = \\gamma(p_x - vE/c^2)$. Energy in one frame is partly momentum in another, which is why conservation of energy and conservation of momentum are really one law.

### The dot product
The ordinary [[?dot-product]] $\\vec a \\cdot \\vec b = a_xb_x + a_yb_y + a_zb_z$ does not change under rotations. Its space-time version has the minus signs of the interval:

$$a \\cdot b = a_t b_t - a_x b_x - a_y b_y - a_z b_z$$

and it does not change under Lorentz transformations. Physicists often write it $a_\\mu b^\\mu$ with the [[?summation-convention]]. Every such product is an [[?invariant]]. Dot a four-vector with itself and you get its "length" squared: for displacement, the interval $s^2$; for energy–momentum, $E^2 - (pc)^2 = (mc^2)^2$, the rest energy squared.

### Weighing a pair of photons
A single photon has no mass, but a *pair* flying apart does. Add their four-momenta and take the length of the sum: two photons of energies $E_1$ and $E_2$ with angle $\\theta$ between them have

$$Mc^2 = \\sqrt{2E_1E_2\\,(1 - \\cos\\theta)}$$

A neutral pion at rest (135 MeV) decays into two photons of 67.5 MeV flying apart back to back: $\\sqrt{2 \\times 67.5^2 \\times 2} = 135$ MeV. Particle physicists find new particles this way — the Higgs boson appeared in 2012 as a bump near 125 GeV in the invariant mass of photon pairs.

### Light and the Doppler shift
For light moving along $x$, the energy–momentum four-vector is $(E, E, 0, 0)$: its length is zero, so it stays on the light cone under every boost — only its size changes. Transforming gives $E' = \\gamma(1 - \\beta)E = E\\sqrt{(1-\\beta)/(1+\\beta)}$ for an observer moving away along the light's direction: the relativistic Doppler shift, obtained in one line.

> [!key] A four-vector transforms like $(ct, x, y, z)$. Laws written as equations between four-vectors hold in every frame, and dot products of four-vectors — the interval, the rest mass, the invariant mass of a system — are the same for all observers.

**In the simulation** an ordinary arrow is turned on the left and a four-vector is boosted on the right by the same slider. The arrow's tip runs round a circle, the four-vector's along a hyperbola; the components change, and the circle's $x^2 + y^2$ and the hyperbola's $a_t^2 - a_x^2$ stay put. Try a photon: its tip slides along the light line and just stretches or shrinks — the Doppler effect.
`,
  ideas: [
    'A four-vector is four numbers that change under a boost exactly as (ct, x, y, z) do.',
    'Energy–momentum (E, pc) is a four-vector: energy in one frame is partly momentum in another.',
    'The Minkowski dot product a·b = a_t b_t − a·b (space parts) is the same in every frame.',
    'The length of the total four-momentum gives the invariant mass of a system — even of two massless photons.',
    'A photon\'s four-vector has zero length; boosting it only rescales it: the Doppler effect.'
  ],
  pitfalls: [
    'Any four quantities make a four-vector — They must transform together like (ct, x, y, z); energy and momentum do, but energy and, say, charge do not.',
    'The mass of a system is the sum of the masses of its parts — The invariant mass comes from the total four-momentum: two massless photons can have a large invariant mass, and a bound nucleus weighs less than its parts.',
    'The minus sign in the dot product is a convention one could drop — Without it the result is not the same in all frames; the sign is the geometry of space-time.'
  ],
  derivation: {
    title: 'The invariant mass of two photons',
    steps: [
      { text: 'Each photon has four-momentum $(E_i, \\vec p_i c)$ with $|\\vec p_i|c = E_i$. The system\'s four-momentum is the sum:', tex: 'P = (E_1 + E_2,\\; \\vec p_1 c + \\vec p_2 c)' },
      { text: 'Its length squared is the square of the invariant mass times $c^2$. Expand the square of the space part with the ordinary dot product:', tex: '(Mc^2)^2 = (E_1 + E_2)^2 - \\left(E_1^2 + E_2^2 + 2E_1E_2\\cos\\theta\\right)' },
      { text: 'The squares cancel, leaving the cross terms:', tex: '(Mc^2)^2 = 2E_1E_2\\,(1 - \\cos\\theta)' },
      { text: 'Two photons moving the same way ($\\theta = 0$) have no invariant mass; back to back ($\\theta = 180°$) they have the most, $Mc^2 = 2\\sqrt{E_1E_2}$.' }
    ]
  },
  formulas: [
    {
      name: 'Energy seen from a moving frame',
      expr: 'Ep = (E - v*p)/sqrt(1 - v^2/c^2)', tex: "E' = \\dfrac{E - v p}{\\sqrt{1 - v^2/c^2}}",
      vars: {
        Ep: { name: 'energy in the moving frame', q: 'energy', unit: 'MeV', tex: "E'" },
        E: { name: 'energy', q: 'energy', unit: 'MeV', value: 2152.5 },
        p: { name: 'momentum along the motion', q: 'momentum', unit: 'MeV/c', value: 1937.3, signed: true },
        v: { name: 'velocity of the moving frame', q: 'speed', unit: 'c', value: 0.5, min: -0.9999, max: 0.9999, signed: true },
        c: { const: 'c' }
      },
      note: 'The time part of the energy–momentum four-vector. The defaults are a proton at 0.9c.',
      stories: { Ep: 'A particle has energy {E} and momentum {p}. What energy does an observer moving at {v} along its path measure?' },
      practice: { unknowns: ['Ep', 'E'] }
    },
    {
      name: 'Momentum seen from a moving frame',
      expr: 'pp = (p - v*E/c^2)/sqrt(1 - v^2/c^2)', tex: "p' = \\dfrac{p - vE/c^2}{\\sqrt{1 - v^2/c^2}}",
      vars: {
        pp: { name: 'momentum in the moving frame', q: 'momentum', unit: 'MeV/c', signed: true, tex: "p'" },
        p: { name: 'momentum along the motion', q: 'momentum', unit: 'MeV/c', value: 1937.3, signed: true },
        E: { name: 'energy', q: 'energy', unit: 'MeV', value: 2152.5 },
        v: { name: 'velocity of the moving frame', q: 'speed', unit: 'c', value: 0.5, min: -0.9999, max: 0.9999, signed: true },
        c: { const: 'c' }
      },
      note: 'The space part. With v = pc²/E the momentum vanishes: that is the rest frame.',
      stories: { pp: 'A particle has energy {E} and momentum {p}. What momentum does an observer moving at {v} along its path measure?', v: 'A particle has energy {E} and momentum {p}. How fast must an observer move to measure momentum {pp}?' }
    },
    {
      name: 'Invariant mass of two photons',
      expr: 'M = sqrt(2*E1*E2*(1 - cos(theta)))/c^2', tex: 'Mc^2 = \\sqrt{2E_1E_2\\,(1 - \\cos\\theta)}',
      vars: {
        M: { name: 'invariant mass of the pair', q: 'mass', unit: 'MeV/c²' },
        E1: { name: 'energy of photon 1', q: 'energy', unit: 'MeV', value: 67.5, tex: 'E_1' },
        E2: { name: 'energy of photon 2', q: 'energy', unit: 'MeV', value: 67.5, tex: 'E_2' },
        theta: { name: 'angle between the photons', q: 'angle', unit: '°', value: 180, min: 0, max: 180, tex: '\\theta' },
        c: { const: 'c' }
      },
      note: 'From the length of the total four-momentum. The defaults are a neutral pion decaying at rest.',
      stories: { M: 'Two photons of {E1} and {E2} fly apart at {theta} to each other. What is the mass of the particle that made them?', theta: 'A particle of mass {M} decays into photons of {E1} and {E2}. At what angle do they fly apart?' }
    },
    {
      name: 'Relativistic Doppler effect (approaching source)',
      expr: 'fo = fs*sqrt((1 + v/c)/(1 - v/c))', tex: 'f_o = f_s\\sqrt{\\dfrac{1 + v/c}{1 - v/c}}',
      vars: {
        fo: { name: 'frequency received', q: 'frequency', unit: 'THz', tex: 'f_o' },
        fs: { name: 'frequency emitted', q: 'frequency', unit: 'THz', value: 500, tex: 'f_s' },
        v: { name: 'speed of approach (negative when receding)', q: 'speed', unit: 'c', value: 0.1, min: -0.9999, max: 0.9999, signed: true },
        c: { const: 'c' }
      },
      note: 'Along the line of sight; the same factor multiplies the photon energy E = hf.',
      stories: { fo: 'A source emitting {fs} approaches at {v}. What frequency is received?', v: 'Light emitted at {fs} is received at {fo}. How fast is the source approaching?' }
    }
  ],
  examples: [
    {
      title: 'Boosting into the rest frame',
      q: 'A proton has E = 2152.5 MeV and p = 1937.3 MeV/c. Find its speed, and its energy and momentum in a frame moving with it.',
      steps: [
        '$v/c = pc/E = 1937.3/2152.5 = 0.900$, so $\\gamma = 2.294$.',
        '$E\' = \\gamma(E - vp) = 2.294\\,(2152.5 - 0.9 \\times 1937.3) = 2.294 \\times 408.9 = 938.0$ MeV.',
        '$p\' = \\gamma(p - vE/c^2) = 2.294\\,(1937.3 - 0.9 \\times 2152.5) = 2.294 \\times 0.05 \\approx 0$.'
      ],
      a: 'v = 0.9c; in its rest frame E′ = 938 MeV (= mc²) and p′ = 0, as it must be.'
    },
    {
      title: 'A moving pion',
      q: 'A neutral pion (135.0 MeV/c²) in flight decays into photons of 100 MeV and 50 MeV. At what angle do they fly apart?',
      steps: [
        '$1 - \\cos\\theta = (Mc^2)^2/(2E_1E_2) = 135^2/(2 \\times 100 \\times 50) = 18\\,225/10\\,000 = 1.8225$.',
        '$\\cos\\theta = -0.8225$, so $\\theta = 145.3°$.'
      ],
      a: 'About 145°: not back to back, because the pion was moving.'
    },
    {
      title: 'A receding galaxy',
      q: 'The hydrogen line at 656.3 nm is emitted by a galaxy receding at 0.1c. At what wavelength is it received?',
      steps: [
        'Receding means $v = -0.1c$ in the formula: $f_o = f_s\\sqrt{0.9/1.1} = 0.9045 f_s$.',
        'Wavelength goes the other way: $\\lambda_o = 656.3/0.9045 = 725.6$ nm.'
      ],
      a: '725.6 nm — shifted from red into the near infrared.'
    }
  ],
  quiz: [
    { q: 'Which pair of quantities mixes under a boost the way time and space do?', choices: ['energy and momentum', 'energy and mass', 'momentum and force', 'charge and mass'], a: 0, why: '(E, pc) is a four-vector: E′ = γ(E − vp), p′ = γ(p − vE/c²).' },
    { q: 'Two photons, each with no mass, can together have a non-zero invariant mass.', a: true, why: 'Unless they move in the same direction, their total four-momentum has a positive length: (Mc²)² = 2E₁E₂(1 − cos θ).' },
    { q: 'Two 1.0 GeV photons fly apart back to back. What is the invariant mass of the pair (in GeV/c²)?', answer: 2.0, unit: 'GeV/c²', why: 'θ = 180°: Mc² = √(2 × 1 × 1 × 2) = 2 GeV.' },
    { q: 'The Minkowski dot product of a four-vector with itself is…', choices: ['the same in every frame', 'always positive', 'zero only at rest', 'different for each observer'], a: 0, why: 'All dot products of four-vectors are Lorentz invariants; the self-product can be positive, zero or negative.' },
    { q: 'Boosting a photon\'s energy–momentum four-vector along its direction of travel…', choices: ['rescales it along the light line (a Doppler shift)', 'gives it a mass', 'rotates it off the light line', 'leaves it completely unchanged'], a: 0, why: 'Its length is zero in every frame, so it stays on the light line; only its size — the energy — changes.' }
  ],
  problems: [
    { q: 'An electron has E = 5.00 MeV and p = 4.974 MeV/c. What energy does an observer moving at 0.8c along the same direction measure?', answer: 1.702, unit: 'MeV', tol: 0.01, hint: 'E′ = γ(E − vp), γ = 5/3.',
      steps: ['$vp = 0.8 \\times 4.974 = 3.979$ MeV.', '$E\' = (5/3)(5.000 - 3.979) = 1.702$ MeV.'] },
    { q: 'A particle decays into two photons of 300 MeV each at 60° to each other. What is its mass (in MeV/c²)?', answer: 300, unit: 'MeV/c²', tol: 0.01, hint: 'Mc² = √(2E₁E₂(1 − cos θ)).',
      steps: ['$1 - \\cos 60° = 0.5$.', '$Mc^2 = \\sqrt{2 \\times 300 \\times 300 \\times 0.5} = 300$ MeV.'] }
  ],
  applications: [
    'Particle discovery: peaks in the invariant mass of decay products revealed the J/ψ (1974), the Z (1983) and the Higgs boson (2012).',
    'Astronomy: redshifts of galaxies and quasars are relativistic Doppler shifts (plus cosmological expansion).',
    'Maxwell\'s equations written with the four-current and four-potential are manifestly the same in every frame — the subject of [[relativity-of-fields]].'
  ],
  history: 'Hermann Minkowski (1908) and Arnold Sommerfeld (1910) developed four-dimensional vector algebra for relativity; Max Planck had already found the relativistic momentum in 1906. Feynman\'s treatment builds four-vectors by analogy with ordinary vectors and uses them to write electrodynamics compactly.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 17 (Space-Time) — four-vectors, four-vector algebra and the energy–momentum four-vector.',
    'Vol. I, ch. 34 (Relativistic Effects in Radiation) — the Doppler effect and the frequency and wave number of light as a four-vector.',
    'Vol. II, ch. 25 (Electrodynamics in Relativistic Notation) — four-vectors, the scalar product, the four-dimensional gradient and the four-potential.'
  ],
  sim: 'rel-four-vectors'
},

{
  id: 'relativity-of-fields', parent: 'spacetime-topic', title: 'Electric and magnetic fields in moving frames', level: 3,
  short: 'A charge moving beside a current-carrying wire feels a magnetic force. In the charge\'s own frame it is at rest and feels no magnetic force at all — but there the wire is electrically charged, because moving charges are packed closer together. Electric and magnetic fields are two faces of one thing.',
  keywords: ['relativity of magnetism', 'magnetism from relativity', 'Lorentz transformation of fields', 'current-carrying wire', 'moving charge', 'line charge', 'electromagnetic field tensor', 'E and B in moving frames', 'magnet and conductor', 'drift velocity'],
  prereq: ['magnetostatics-feyn', 'lorentz-transformation-feyn', 'four-vectors-feyn'],
  related: ['maxwell-equations-feyn', 'charges-in-fields', 'induction-laws', 'physics:field-of-wire', 'physics:lorentz-force', 'physics:magnetic-field'],
  body: `
Feynman used relativity to show something remarkable about magnetism: it is what electricity looks like when charges move. More exactly, the electric and magnetic [[?field|fields]] are not two separate things; how much of each you see depends on how you are moving.

### A charge beside a wire
A long copper wire carries a current. Inside it the positive ions stand still while conduction electrons drift along at a speed $v$; there are equally many of each per metre, so the wire is neutral and has no electric field outside. A negative charge $q$ moves outside the wire, parallel to it, at the same speed $v$ as the electrons. In this laboratory frame there is only the magnetic field $B = \\mu_0 I/2\\pi r$ around the wire, and the magnetic force $F = qvB$ pulls the charge towards the wire.

Now jump into the frame of the moving charge. There it is at rest, and a charge at rest feels no magnetic force, whatever the field. Yet whether it ends up hitting the wire cannot depend on who is watching. What pulls it? In this frame the ions move backwards at $v$, so their spacing is [[lorentz-transformation-feyn|contracted]] and their density per metre rises by $\\gamma$. The electrons are now at rest; in the laboratory they were moving and contracted, so at rest they are *spread out*, and their density falls by $\\gamma$. The wire carries a net positive charge per metre,

$$\\lambda' = \\gamma\\lambda_0 - \\frac{\\lambda_0}{\\gamma} = \\gamma\\lambda_0\\,\\frac{v^2}{c^2}$$

and its electric field $E' = \\lambda'/2\\pi\\varepsilon_0 r$ attracts the charge. Work it out and the electric force in the charge's frame is exactly $\\gamma$ times the magnetic force in the laboratory — just what the transformation of a sideways force requires, since the charge's clock runs slow by $\\gamma$ as seen from the laboratory.

### Tiny speeds, enormous charges
In a copper wire of 1 mm² carrying 10 A, the electrons ($8.5\\times10^{28}$ per m³) amount to $\\lambda_0 = 1.4\\times10^4$ coulombs per metre, and drift at only 0.74 mm/s. Then $v^2/c^2 = 6\\times10^{-24}$, and the net charge in the moving frame is about $8\\times10^{-20}$ C/m — one elementary charge every two metres. The magnetic force is a relativistic correction of order $v^2/c^2$, far smaller than any correction in mechanics, and we notice it only because ordinary matter holds such vast, almost perfectly balanced charges. Magnets are relativity made visible.

### How the fields transform
For a frame moving at speed $v$ along $x$, the parts of the fields along the motion are unchanged and the parts across it mix:

$$E'_y = \\gamma\\,(E_y - vB_z), \\quad E'_z = \\gamma\\,(E_z + vB_y), \\quad B'_y = \\gamma\\left(B_y + \\frac{v}{c^2}E_z\\right), \\quad B'_z = \\gamma\\left(B_z - \\frac{v}{c^2}E_y\\right)$$

A particle crossing a pure magnetic field feels, in its own frame, an electric field $E' = \\gamma vB$. The six numbers $E_x, E_y, E_z, B_x, B_y, B_z$ are not two [[four-vectors-feyn|four-vectors]]; together they form an antisymmetric [[?tensor]], which is why they transform like products of coordinates. Two combinations stay the same for everyone — the [[?invariant|invariants]] $\\vec E\\cdot\\vec B$ and $E^2 - c^2B^2$. So a field that is purely magnetic for one observer ($E = 0$) can never look purely electric to another.

| Frame | Ions per metre | Electrons per metre | Net charge | Force on $q$ |
|---|---|---|---|---|
| laboratory | $\\lambda_0$ | $\\lambda_0$ | 0 | magnetic, $qvB$ |
| moving with $q$ | $\\gamma\\lambda_0$ | $\\lambda_0/\\gamma$ | $\\gamma\\lambda_0 v^2/c^2$ | electric, $\\gamma\\,qvB$ |

> [!key] Electric and magnetic fields are one field seen from different frames. A current-carrying wire that is neutral in the laboratory is charged in a moving frame, and the magnetic force in one frame is an electric force in the other.

**In the simulation** the wire's ions and electrons are drawn to scale with a hugely exaggerated drift speed. In the laboratory the charges are equally spaced and the charge $q$ is pushed by the magnetic field. Switch to the charge's frame: the ions crowd together, the electrons spread out, electric field lines appear, and the force arrow is the same, times $\\gamma$.
`,
  ideas: [
    'A current-carrying wire is neutral in the laboratory but charged in a frame moving along it, because the moving and resting charges contract differently.',
    'The magnetic force on a moving charge in one frame is an electric force in the charge\'s own frame.',
    'The net charge is λ₀v²/c² per metre: magnetism is a relativistic effect of order v²/c², visible because matter holds enormous balanced charges.',
    'Across the motion, E and B mix under a boost: E′_y = γ(E_y − vB_z), and so on; along the motion they are unchanged.',
    'E·B and E² − c²B² are the same for all observers.'
  ],
  pitfalls: [
    'A wire with a current must be electrically charged — In its own rest frame (the ions\' frame) it is neutral to high precision; it is charged only in frames moving along it.',
    'Magnetism and electricity are unrelated forces that happen to be unified by Maxwell — They are one field; which part you call magnetic depends on your frame of reference.',
    'Since the drift speed is tiny, relativity cannot matter in a circuit — The relativistic imbalance is minute, but it multiplies about 10⁴ coulombs per metre of charge, giving forces you can feel between wires.'
  ],
  derivation: {
    title: 'The electric force in the moving frame equals γ times the magnetic force',
    steps: [
      { text: 'Laboratory frame: current $I = \\lambda_0 v$, field $B = \\mu_0 I/2\\pi r$, and $\\mu_0 = 1/\\varepsilon_0c^2$. The magnetic force on $q$ moving at $v$:', tex: 'F = qvB = \\frac{q v^2 \\lambda_0}{2\\pi\\varepsilon_0 c^2\\, r}' },
      { text: 'Charge frame: ions move at $v$ and are contracted, $+\\gamma\\lambda_0$; electrons are at rest, with their rest density $-\\lambda_0/\\gamma$. Use $1 - 1/\\gamma^2 = v^2/c^2$:', tex: '\\lambda\' = \\gamma\\lambda_0 - \\frac{\\lambda_0}{\\gamma} = \\gamma\\lambda_0\\left(1 - \\frac{1}{\\gamma^2}\\right) = \\gamma\\lambda_0\\frac{v^2}{c^2}' },
      { text: 'Distances across the motion do not change, so $r$ is the same. The electric force on $q$ (at rest, so no magnetic force):', tex: 'F\' = qE\' = \\frac{q\\lambda\'}{2\\pi\\varepsilon_0 r} = \\gamma\\,\\frac{q v^2 \\lambda_0}{2\\pi\\varepsilon_0 c^2\\, r} = \\gamma F' },
      { text: 'The sideways momentum given to $q$ in a short time must be the same in both frames; the laboratory time for it is $\\gamma$ times the charge\'s own time, so the laboratory force is $1/\\gamma$ of the force in the charge\'s frame. The two descriptions agree exactly.' }
    ]
  },
  formulas: [
    {
      name: 'Magnetic field of a long straight wire',
      expr: 'B = mu0*I/(2*pi*r)', tex: 'B = \\dfrac{\\mu_0 I}{2\\pi r}',
      vars: {
        B: { name: 'magnetic field', q: 'bfield', unit: 'µT' },
        mu0: { const: 'mu0' },
        I: { name: 'current', q: 'current', unit: 'A', value: 10 },
        r: { name: 'distance from the wire', q: 'length', unit: 'cm', value: 1 }
      },
      stories: { B: 'How strong is the magnetic field {r} from a wire carrying {I}?', I: 'The field {r} from a long wire is {B}. What current does it carry?' }
    },
    {
      name: 'Magnetic force on a moving charge',
      expr: 'F = q*v*B', tex: 'F = qvB',
      vars: {
        F: { name: 'force', q: 'force', unit: 'N' },
        q: { name: 'charge', q: 'charge', unit: 'e', value: 1 },
        v: { name: 'speed across the field', q: 'speed', unit: 'm/s', value: 1e6 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'µT', value: 200 }
      },
      note: 'Velocity perpendicular to B. In the frame of the charge this is an electric force.',
      stories: { F: 'A proton moves at {v} parallel to a wire, where the wire\'s field is {B}. What force acts on it?' }
    },
    {
      name: 'Charge per metre of a current-carrying wire seen from a moving frame',
      expr: 'lp = u*I/(c^2*sqrt(1 - u^2/c^2))', tex: "\\lambda' = \\dfrac{u I}{c^2\\sqrt{1 - u^2/c^2}}",
      vars: {
        lp: { name: 'net charge per metre in the moving frame', q: 'linecharge', unit: 'nC/m', tex: "\\lambda'" },
        u: { name: 'speed of the frame along the wire', q: 'speed', unit: 'm/s', value: 1e6, max: 2.99e8 },
        I: { name: 'current', q: 'current', unit: 'A', value: 10 },
        c: { const: 'c' }
      },
      note: 'For a wire neutral in its own frame. With u equal to the electrons\' drift speed v and I = λ₀v this is γλ₀v²/c².',
      stories: { lp: 'A wire carries {I}. What charge per metre does an observer moving along it at {u} find?' }
    },
    {
      name: 'Electric field seen by a charge crossing a magnetic field',
      expr: 'Ep = v*B/sqrt(1 - v^2/c^2)', tex: "E' = \\dfrac{vB}{\\sqrt{1 - v^2/c^2}}",
      vars: {
        Ep: { name: 'electric field in the charge\'s frame', q: 'efield', unit: 'MV/m', tex: "E'" },
        v: { name: 'speed across the field', q: 'speed', unit: 'm/s', value: 2e7, max: 2.99e8 },
        B: { name: 'magnetic field (no electric field in the laboratory)', q: 'bfield', unit: 'T', value: 1.5 },
        c: { const: 'c' }
      },
      note: 'Velocity perpendicular to B. This is E′ = γ(E + v × B) with E = 0.',
      stories: { Ep: 'A proton crosses a {B} field at {v}. What electric field does it find in its own frame?' }
    }
  ],
  examples: [
    {
      title: 'How charged is a wire, seen from an electron?',
      q: 'A copper wire of cross-section 1 mm² carries 10 A. Copper has 8.5 × 10²⁸ conduction electrons per m³. Find the electrons\' charge per metre, their drift speed, and the net charge per metre in their frame.',
      steps: [
        '$\\lambda_0 = neA = 8.5\\times10^{28} \\times 1.602\\times10^{-19} \\times 10^{-6} = 1.36\\times10^4$ C/m.',
        '$v = I/\\lambda_0 = 10/1.36\\times10^4 = 7.4\\times10^{-4}$ m/s.',
        '$\\lambda\' = \\gamma\\lambda_0 v^2/c^2 = 1.36\\times10^4 \\times (7.4\\times10^{-4})^2/8.99\\times10^{16} = 8.3\\times10^{-20}$ C/m.'
      ],
      a: 'About 8 × 10⁻²⁰ C/m — one elementary charge in every 2 m of wire.'
    },
    {
      title: 'The same force, two explanations',
      q: 'A proton moves at 10⁶ m/s parallel to a wire carrying 10 A, 1 cm away. Find the force as a magnetic force in the laboratory and as an electric force in the proton\'s frame.',
      steps: [
        'Laboratory: $B = \\mu_0 I/2\\pi r = 2.0\\times10^{-4}$ T; $F = qvB = 1.602\\times10^{-19} \\times 10^6 \\times 2.0\\times10^{-4} = 3.2\\times10^{-17}$ N.',
        'Proton frame: $\\lambda\' = uI/c^2 = 10^6 \\times 10/8.99\\times10^{16} = 1.11\\times10^{-10}$ C/m ($\\gamma \\approx 1$).',
        '$E\' = \\lambda\'/2\\pi\\varepsilon_0 r = 1.11\\times10^{-10}/(5.56\\times10^{-13}) = 200$ V/m; $F\' = qE\' = 3.2\\times10^{-17}$ N.'
      ],
      a: '3.2 × 10⁻¹⁷ N both ways — magnetic in one frame, electric in the other.'
    },
    {
      title: 'A fast proton in a magnet',
      q: 'A proton crosses a 1.5 T magnetic field at 2 × 10⁷ m/s. What electric field does it find in its own frame?',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - (0.0667)^2} = 1.0022$.',
        '$E\' = \\gamma vB = 1.0022 \\times 2\\times10^7 \\times 1.5 = 3.0\\times10^7$ V/m.'
      ],
      a: 'About 30 MV/m — ten times the field at which air breaks down.'
    }
  ],
  quiz: [
    { q: 'In the frame moving with the charge (same speed as the electrons), the force pulling it towards the wire is…', choices: ['electric: the wire is positively charged there', 'magnetic, as in the laboratory', 'zero, since the charge is at rest', 'gravitational'], a: 0, why: 'A charge at rest feels no magnetic force; the moving ions are contracted and the resting electrons spread out, leaving a net positive charge.' },
    { q: 'A wire carrying a current is electrically neutral in every frame of reference.', a: false, why: 'It is neutral only in the rest frame of the ions (the wire\'s frame); in frames moving along it, it has a net charge γuI/c² per metre.' },
    { q: 'A region has a pure magnetic field for one observer. Can another observer see a pure electric field there?', choices: ['no — E² − c²B² cannot change sign', 'yes, if moving fast enough', 'yes, at exactly c', 'only if the field is uniform'], a: 0, why: 'E² − c²B² is invariant: it is negative for a pure magnetic field and would be positive for a pure electric one.' },
    { q: 'An observer moves at 3 × 10⁶ m/s along a wire carrying 5 A. What charge per metre (in nC/m) does she find?', answer: 0.167, unit: 'nC/m', why: 'λ′ = uI/c² = 3 × 10⁶ × 5/8.99 × 10¹⁶ = 1.67 × 10⁻¹⁰ C/m.' },
    { q: 'Why is the magnetic force between two wires noticeable, though it comes from a tiny v²/c² effect?', choices: ['the balanced charges in a wire are enormous (about 10⁴ C per metre)', 'the drift speed of electrons is close to c', 'magnetic forces are not relativistic', 'the wires are always charged'], a: 0, why: 'A fractional imbalance of 10⁻²⁴ of a huge charge still leaves a measurable force.' }
  ],
  problems: [
    { q: 'An electron beam moves at 2.0 × 10⁷ m/s parallel to a wire carrying 20 A, 5 mm away. What force does one electron feel?', answer: 2.56e-15, unit: 'N', tol: 0.02, hint: 'B = μ₀I/2πr, then F = qvB.',
      steps: ['$B = 2\\times10^{-7} \\times 20/0.005 = 8.0\\times10^{-4}$ T.', '$F = 1.602\\times10^{-19} \\times 2\\times10^7 \\times 8\\times10^{-4} = 2.56\\times10^{-15}$ N.'] },
    { q: 'A proton crosses a 0.5 T field at 3.0 × 10⁷ m/s. What electric field (in MV/m) acts on it in its own frame?', answer: 15.08, unit: 'MV/m', tol: 0.01, hint: 'E′ = γvB.',
      steps: ['$\\beta = 0.1$, $\\gamma = 1.005$.', '$E\' = 1.005 \\times 3\\times10^7 \\times 0.5 = 1.508\\times10^7$ V/m.'] }
  ],
  applications: [
    'Every electric motor and every force between current-carrying wires is, from the right frame, an electric force from a tiny relativistic charge imbalance.',
    'In particle accelerators a beam feels its own space charge less and less as γ grows, because its magnetic attraction nearly cancels its electric repulsion.',
    'Induction: moving a magnet towards a coil or the coil towards the magnet gives the same current — one explanation electric, the other magnetic ([[induction-laws]]).'
  ],
  history: 'Einstein opened his 1905 paper on relativity with exactly this asymmetry: a magnet moved near a conductor and a conductor moved near a magnet give the same current, though the theory of the day explained the two cases differently. Edward Purcell\'s Berkeley textbook *Electricity and Magnetism* (1965) built the whole of magnetism from electrostatics and relativity along the lines Feynman sketched.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 13 (Magnetostatics) — the relativity of magnetic and electric forces, with a charge moving beside a current-carrying wire, and the transformation of currents and charges.',
    'Vol. II, ch. 26 (Lorentz Transformations of the Fields) — how E and B transform, and the fields of a charge moving at constant speed.',
    'Vol. II, ch. 25 (Electrodynamics in Relativistic Notation) — charge and current as a four-vector.'
  ],
  sim: 'rel-wire'
},

{
  id: 'curved-space', parent: 'spacetime-topic', title: 'Curved space and gravity', level: 3,
  short: 'Feynman\'s bugs on a hot plate measure circles and triangles with rulers that expand in the heat, and find a geometry that is not Euclid\'s: their space is curved. Einstein\'s gravity is the same idea for space-time — clocks run faster higher up, and falling bodies follow the straightest paths.',
  keywords: ['curved space', 'curvature', 'bugs on a hot plate', 'non-Euclidean geometry', 'excess radius', 'general relativity', 'equivalence principle', 'gravitational time dilation', 'geodesic', 'Pound–Rebka', 'Gaussian curvature', 'triangle angle sum'],
  prereq: ['spacetime-geometry', 'theory-of-gravitation', 'math:triangles'],
  related: ['time-dilation-feyn', 'gravity-vs-electricity', 'least-action-mechanics', 'physics:general-relativity', 'physics:equivalence-principle', 'physics:gravitational-time-dilation'],
  body: `
Volume II of the lectures ends with a chapter on curved space, and in it one of Feynman's best-known pictures: bugs living on a hot plate.

### Bugs on a hot plate
Imagine flat bugs living on a flat metal plate that is heated unevenly. Their measuring rods are made of a metal that expands with heat, so a rod is longer where the plate is hot. The bugs cannot feel the temperature — every ruler, every bug, everything they make expands alike. They do geometry. They draw a circle — all the points a fixed number of rulers from a centre — and measure its circumference in rulers. If the centre is hot, the rulers laid along the radius are long and few are needed, while the rulers laid round the cooler rim are short and many are needed: the circumference comes out **more** than $2\\pi$ times the radius. Straight lines, for a bug, are the paths that take the fewest rulers; they bow towards the hot region, and the angles of a triangle made of them add up to less than 180°.

The bugs conclude that their space is curved — and for them that is simply true, because everything they can measure says so. We, looking from outside, see a flat plate with stretchy rulers; the bugs have no outside. Feynman's lesson: curvature means that measured distances do not obey Euclid, however that comes about. If the plate is heated **uniformly**, all rulers stretch by the same factor and the geometry stays perfectly flat.

### Curvature measured from inside
| Surface | Circumference of a circle | Angles of a triangle |
|---|---|---|
| flat plane | $= 2\\pi r$ | $= 180°$ |
| sphere (positive curvature) | $< 2\\pi r$ | $> 180°$ |
| saddle (negative curvature) | $> 2\\pi r$ | $< 180°$ |

On a sphere of radius $R$, a circle of radius $r$ measured along the surface has circumference $2\\pi R\\sin(r/R)$ (a [[?sine-cosine|sine]], always a little less than $2\\pi r$), and a triangle's angles exceed 180° by its area divided by $R^2$ (in [[?radian|radians]]). A triangle with corners at the North Pole and two points on the equator a quarter of the way round has three right angles: 270°.

In three dimensions, Feynman described curvature by the **excess radius**. Draw a sphere in space, measure its area $A$, and compare the radius that area implies, $\\sqrt{A/4\\pi}$, with the radius measured with rulers. In flat space they agree. Einstein's theory, in Feynman's formulation, says that the measured radius is larger, by an amount [[?proportional]] to the mass inside — $G/3c^2$ times that mass:

$$r_{\\text{measured}} - \\sqrt{\\frac{A}{4\\pi}} = \\frac{GM}{3c^2}$$

For the Earth this is 1.5 mm; for the Sun about 0.5 km. Our space is curved, slightly.

### Gravity is curved space-time
The key is Einstein's **principle of equivalence**: in a small closed box you cannot tell whether you are at rest on the Earth or accelerating at 9.8 m/s² in empty space. Put a clock at the top and another at the bottom of an accelerating rocket and send pulses up from the bottom: the top clock receives them less often, because it is moving away when they arrive. By equivalence the same holds in a gravitational field: a clock higher by $h$ runs faster by the fraction

$$\\frac{\\Delta f}{f} = \\frac{gh}{c^2}$$

— $1.1\\times10^{-16}$ per metre of height on the Earth. Robert Pound and Glen Rebka measured this shift over 22.5 m at Harvard in 1960; the GPS satellites gain about 45 µs a day from it. Time itself runs differently from place to place: space-time is curved, and that curvature *is* gravity. A thrown stone follows the [[spacetime-geometry|world line]] along which its own clock shows the most time: it climbs to where clocks run faster, but not too high, because moving fast slows its clock — a principle of [[least-action-mechanics|least action]] in disguise.

> [!key] Curvature is a property of measured distances, found from inside by circles and triangles. Mass curves space ($\\Delta r = GM/3c^2$) and time ($gh/c^2$); objects in free fall follow the straightest possible world lines.

**In the simulation** you are the bug. Choose how the plate is heated and read the ruler count along a circle's radius and round its circumference; drag the corners of a triangle and watch its sides — the bugs' straight lines — bow towards the heat, while the angle sum departs from 180°. Heat the plate evenly, and flat geometry returns.
`,
  ideas: [
    'Curvature is found from inside: circles whose circumference is not 2π times the radius, triangles whose angles do not add to 180°.',
    'The bugs on an unevenly heated plate, with rulers that expand in the heat, find a curved geometry; a uniformly heated plate stays flat.',
    'In three dimensions curvature shows as an excess radius; for a mass M Einstein\'s theory gives GM/3c² — 1.5 mm for the Earth.',
    'By the principle of equivalence, clocks higher in a gravitational field run faster by gh/c².',
    'Gravity is the curvature of space-time: free bodies follow the world lines of greatest proper time.'
  ],
  pitfalls: [
    'Curved space must be curved into some higher dimension — Curvature is defined by measurements within the space; the bugs need no outside, and neither do we.',
    'The hot plate is only an analogy with nothing to measure — For the bugs it is exactly curved geometry: every circle and triangle they measure disagrees with Euclid.',
    'Gravity is just curved space — Most of everyday gravity comes from the curvature of time: clocks running at different rates at different heights.'
  ],
  derivation: {
    title: 'Clocks at the top of an accelerating rocket run fast',
    steps: [
      { text: 'A rocket accelerates at $g$. A clock at the bottom sends a pulse every $T$ seconds to a clock a height $h$ above it. Each pulse takes about $t = h/c$ to arrive.' },
      { text: 'While a pulse travels, the rocket gains speed $\\Delta v = gt = gh/c$: the receiving clock is moving away from where the pulse was sent, so the pulses arrive stretched out, by the first-order Doppler factor:', tex: 'T_{\\text{top}} \\approx T\\left(1 + \\frac{\\Delta v}{c}\\right) = T\\left(1 + \\frac{gh}{c^2}\\right)' },
      { text: 'The top clock therefore counts fewer pulses per tick of its own than it would if both ran at the same rate: relative to the bottom clock it runs **fast**, by the fraction', tex: '\\frac{\\Delta f}{f} = \\frac{gh}{c^2}' },
      { text: 'By the principle of equivalence the same must hold in a gravitational field $g$: clocks higher up run faster. For the Earth, $g/c^2 = 1.09\\times10^{-16}$ per metre.' }
    ]
  },
  formulas: [
    {
      name: 'Excess radius of a sphere around a mass',
      expr: 'dr = G*M/(3*c^2)', tex: '\\Delta r = \\dfrac{GM}{3c^2}',
      vars: {
        dr: { name: 'excess radius', q: 'length', unit: 'mm', tex: '\\Delta r' },
        G: { const: 'G' },
        M: { name: 'mass inside the sphere', q: 'mass', unit: 'kg', value: 5.972e24 },
        c: { const: 'c' }
      },
      note: 'Measured radius minus √(A/4π), for a sphere enclosing the mass (Feynman\'s statement of Einstein\'s law, for matter at rest).',
      stories: { dr: 'By how much does the measured radius of a sphere around a mass of {M} exceed √(A/4π)?', M: 'The excess radius of a sphere is {dr}. What mass does it enclose?' }
    },
    {
      name: 'Clocks at different heights',
      expr: 'z = g*h/c^2', tex: 'z = \\dfrac{gh}{c^2}',
      vars: {
        z: { name: 'fractional rate difference Δf/f (upper clock faster)', tex: 'z' },
        g: { const: 'g' },
        h: { name: 'height difference', q: 'length', unit: 'm', value: 22.5 },
        c: { const: 'c' }
      },
      note: 'Uniform field, gh ≪ c². 22.5 m is the Pound–Rebka tower.',
      stories: { z: 'By what fraction does a clock {h} higher up run faster?', h: 'Two clocks differ in rate by {z}. How far apart in height are they?' }
    },
    {
      name: 'Circumference of a circle on a sphere',
      expr: 'C = 2*pi*R*sin(r/R)', tex: 'C = 2\\pi R\\sin\\dfrac{r}{R}',
      vars: {
        C: { name: 'circumference', q: 'length', unit: 'km' },
        R: { name: 'radius of the sphere', q: 'length', unit: 'km', value: 6371 },
        r: { name: 'radius of the circle, measured along the surface', q: 'length', unit: 'km', value: 1000, max: 10000 }
      },
      note: 'Always less than 2πr: positive curvature.',
      stories: { C: 'On a globe of radius {R}, what is the circumference of a circle whose radius, measured along the surface, is {r}?', R: 'Bugs find a circle of radius {r} has circumference {C}. What is the radius of their sphere?' }
    },
    {
      name: 'Angle excess of a triangle on a sphere',
      expr: 'eps = A/R^2', tex: '\\varepsilon = \\dfrac{A}{R^2}',
      vars: {
        eps: { name: 'angle sum minus 180°', q: 'angle', unit: '°', tex: '\\varepsilon' },
        A: { name: 'area of the triangle', q: 'area', unit: 'km²', value: 6.3758e7 },
        R: { name: 'radius of the sphere', q: 'length', unit: 'km', value: 6371 }
      },
      note: 'The default area is one eighth of the globe: three right angles.',
      stories: { eps: 'A triangle of area {A} is drawn on a sphere of radius {R}. By how much do its angles exceed 180°?', R: 'A triangle of area {A} has angles adding up to 180° plus {eps}. What is the radius of the sphere?' }
    }
  ],
  examples: [
    {
      title: 'The excess radius of the Earth and the Sun',
      q: 'Find GM/3c² for the Earth (5.97 × 10²⁴ kg) and for the Sun (1.99 × 10³⁰ kg).',
      steps: [
        'Earth: $GM/c^2 = 6.674\\times10^{-11} \\times 5.972\\times10^{24}/8.988\\times10^{16} = 4.43$ mm; divided by 3: 1.48 mm.',
        'Sun: $GM/c^2 = 1477$ m; divided by 3: 492 m.'
      ],
      a: 'About 1.5 mm for the Earth and 0.5 km for the Sun.'
    },
    {
      title: 'A triangle with three right angles',
      q: 'Walk from the North Pole down to the equator, a quarter of the way round the equator, and back to the pole. What is the angle sum, and does A/R² explain it?',
      steps: [
        'Each corner is a right angle: the sum is 270°, an excess of 90° = π/2.',
        'The triangle covers one eighth of the sphere: $A = 4\\pi R^2/8 = \\pi R^2/2$.',
        '$A/R^2 = \\pi/2$ — exactly the excess.'
      ],
      a: '270°, with excess π/2 = A/R².'
    },
    {
      title: 'Pound and Rebka, and GPS',
      q: 'By what fraction does a clock 22.5 m higher run faster? And how much per day does a GPS clock (orbit radius 26 560 km) gain from gravity over a ground clock (6371 km)?',
      steps: [
        '$gh/c^2 = 9.81 \\times 22.5/8.988\\times10^{16} = 2.46\\times10^{-15}$.',
        'For large heights use $(GM/c^2)(1/r_1 - 1/r_2) = 4.435\\times10^{-3}\\ \\text{m} \\times (1/6.371\\times10^6 - 1/2.656\\times10^7)\\ \\text{m}^{-1} = 5.29\\times10^{-10}$.',
        'Per day: $5.29\\times10^{-10} \\times 86\\,400$ s $= 45.7$ µs.'
      ],
      a: '2.5 × 10⁻¹⁵ for the tower; about 46 µs a day for GPS.'
    }
  ],
  quiz: [
    { q: 'The bugs heat their whole plate evenly, so every ruler expands by 1 %. What geometry do they find?', choices: ['flat: circles and triangles obey Euclid', 'curved like a sphere', 'curved like a saddle', 'it depends on the size of the circle'], a: 0, why: 'A uniform change of every ruler rescales all measurements equally; ratios such as C/r and all angles are unchanged.' },
    { q: 'On a sphere, the angles of a triangle add up to…', choices: ['more than 180°', 'exactly 180°', 'less than 180°', 'exactly 270°'], a: 0, why: 'The excess is the area divided by R² (in radians): positive curvature.' },
    { q: 'A clock on a mountain top runs faster than an identical clock at sea level.', a: true, why: 'Higher in the gravitational field, clocks run faster by gh/c² — about 10⁻¹³ for 1 km.' },
    { q: 'What is the excess radius GM/3c² of the Sun, in kilometres?', answer: 0.49, unit: 'km', why: 'GM/c² ≈ 1.48 km for the Sun; a third of that is about 0.49 km.' },
    { q: 'The plate is hotter at the centre. The bugs\' circles have…', choices: ['circumference more than 2π times the radius', 'circumference less than 2π times the radius', 'circumference exactly 2π times the radius', 'no definite circumference'], a: 0, why: 'Rulers along the radius pass through the hot centre and are long (few needed); rulers round the cooler rim are short (many needed).' }
  ],
  problems: [
    { q: 'Two atomic clocks differ in height by 1.00 km. How many nanoseconds per day does the upper one gain?', answer: 9.43, unit: 'ns', tol: 0.02, hint: 'Rate difference gh/c², times 86 400 s.',
      steps: ['$gh/c^2 = 9.81 \\times 1000/8.988\\times10^{16} = 1.091\\times10^{-13}$.', '$\\times\\, 86\\,400$ s $= 9.43\\times10^{-9}$ s $= 9.43$ ns.'] },
    { q: 'A triangle on the Earth (R = 6371 km) has an area of 1.00 × 10⁶ km². By how many degrees do its angles exceed 180°?', answer: 1.41, unit: '°', tol: 0.01, hint: 'ε = A/R² in radians.',
      steps: ['$\\varepsilon = 10^6/6371^2 = 0.02464$ rad.', '$0.02464 \\times 180/\\pi = 1.41°$.'] }
  ],
  applications: [
    'GPS clocks are corrected for both the special-relativistic slowing (about −7 µs a day) and the gravitational speeding-up (about +46 µs a day).',
    'Optical atomic clocks now see the gravitational shift over a height difference of a few centimetres — relativistic geodesy measures heights with clocks.',
    'Gravitational lensing, the precession of Mercury\'s orbit and gravitational waves are all consequences of curved space-time.'
  ],
  history: 'Carl Friedrich Gauss showed in 1827 that the curvature of a surface can be found entirely from measurements within it, and Bernhard Riemann extended geometry to curved spaces of any dimension in 1854. Einstein used the principle of equivalence from 1907 and completed general relativity in November 1915. Arthur Eddington\'s eclipse expedition of 1919 measured the bending of starlight by the Sun, and Pound and Rebka measured the gravitational shift of clock rates in 1960. Feynman also taught gravitation to graduate students at Caltech in 1962–63, approaching it as a field theory; the notes were published in 1995.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 42 (Curved Space) — the bugs on a hot plate, curvature in two and three dimensions, the excess radius, the principle of equivalence, the speed of clocks in a gravitational field and motion in curved space-time.',
    '*Feynman Lectures on Gravitation* (1995; Caltech lectures of 1962–63) — gravitation developed as a field theory.'
  ],
  sim: 'rel-hot-plate'
}

);
