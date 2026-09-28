/* HYPER-FEYNMAN · content/symmetry.js — Symmetry and conservation (topic symmetry-topic):
 * symmetry in physical law, the great conservation principles, every symmetry gives a conservation law,
 * symmetry and conservation in quantum mechanics, parity violation, matter and antimatter.
 * Simulations in sims/symmetry.js (prefix sym-). */
Hyper.add(

{
  id: 'symmetry-in-physical-law', parent: 'symmetry-topic', title: 'Symmetry in physical law', level: 1,
  short: 'A law of physics has a symmetry when something done to an experiment — moving it, turning it, starting it later, setting it moving steadily — cannot change the result. Making it bigger is not such an operation: a scaled-up machine breaks.',
  keywords: ['symmetry', 'invariance', 'translation', 'rotation', 'uniform motion', 'Galilean relativity', 'Weyl', 'square–cube law', 'scaling', 'Galileo', 'bones', 'Two New Sciences', 'symmetry operation'],
  prereq: ['vectors-and-symmetry', 'principle-of-relativity', 'math:scaling-laws'],
  related: ['conservation-from-symmetry', 'great-conservation-principles', 'parity-violation', 'lorentz-transformation-feyn', 'crystal-geometry', 'physics:stress-strain', 'math:vectors'],
  body: `
A square turned through a quarter of a turn looks exactly as it did; so does a snowflake turned through a sixth. The mathematician Hermann Weyl made this the definition: a thing is **symmetric** when there is something you can do to it that leaves it looking the same. Feynman carried the idea over from things to **laws**. Build an apparatus, run it and note what happens. Now do something to the whole set-up — carry it elsewhere, turn it round, start it tomorrow — and run it again. If the result cannot change, the laws of physics have that symmetry.

### The operations that change nothing
| Do this to the whole experiment | Same result? | Goes with the conservation of |
|---|---|---|
| move it to another place | yes | momentum |
| start it at another time | yes | energy |
| turn it through any angle | yes | angular momentum |
| run it on a train moving steadily in a straight line | yes (the principle of relativity) | the steady motion of the centre of mass |
| make everything bigger, of the same materials | **no** | — |

The last column is the subject of [[conservation-from-symmetry]]. Other operations — reflecting in a mirror, swapping matter for antimatter — have pages of their own: [[parity-violation]] and [[matter-antimatter]].

### The fine print: move everything that matters
Turn a pendulum clock on its side and it stops. That is not a failure of rotational symmetry: the clock depends on the Earth's pull, and we turned the clock without the Earth. Turn the Earth with it — or carry the clock into space, far from everything — and it keeps the same time in any orientation. In the first simulation, turn the copy of the experiment without ticking *Turn the Earth too*: the cannonball misses the bell. Tick it and the copy works perfectly.

This is why laws are written with [[?vector|vectors]]. An equation such as $\\vec F = m\\vec a$ says the same thing whichever way the axes point: when you turn the axes, the [[?components]] of both sides change, but in step ([[vectors-and-symmetry]]).

### Uniform motion
Galileo imagined a closed cabin below the deck of a ship: flies, fish in a bowl, drops falling into a jar. As long as the ship sails smoothly in a straight line, nothing inside tells you whether it moves. In the simulation, put the copy on a moving cart: seen from the ground the ball flies along a longer, skewed curve, but seen from the cart it is the same shot, and it rings the same bell. At everyday speeds positions convert as $x' = x - ut$; Einstein's version, needed near the speed of light, is the [[lorentz-transformation-feyn|Lorentz transformation]].

### Size is not a symmetry
Galileo also found the exception. In *Two New Sciences* (1638) he argued that nature cannot make giants with ordinary proportions. Scale an object by a factor $s$: its weight grows as $s^3$ (volume), but the strength of a bone or beam only as $s^2$ (cross-section). So the **stress** — force per area — grows in [[?proportional|proportion]] to $s$. A beam sticking out of a wall, loaded only by its own weight, has at its root

$$\\sigma = \\frac{3\\rho g L^2}{h}$$

for length $L$ and depth $h$. A spruce beam 2 m long and 10 cm deep works at about 0.5 MPa — less than 1 % of the 60-odd MPa spruce can take. Scaled up 100 times, 200 m long and 10 m deep, it looks identical in a photograph but works at about 53 MPa, close to breaking. To keep the stress the same, a bone three times as long must be $3^{3/2} \\approx 5.2$ times as thick, not three times: that is why an elephant's legs are so stout. The second simulation lets you scale a beam or an animal and watch it fail.

Why is size special? Because the world is made of atoms, and atoms have a definite size, fixed by $\\hbar$ and the electron's mass and charge (the Bohr radius, 0.053 nm). A scaled machine is not built of scaled atoms.

> [!key] A symmetry of a physical law is something you can do to an experiment that cannot change its result: moving it, turning it (with everything that matters), delaying it, setting it moving steadily. Making it bigger is not one — stress grows with size.
`,
  ideas: [
    'A symmetry of a law is an operation on an experiment after which the result is the same — Weyl\'s definition, applied to laws instead of things.',
    'The laws are unchanged by moving an experiment, delaying it, turning it and setting it moving steadily in a straight line.',
    'The operation must include everything that matters: turn the Earth with the pendulum clock.',
    'A change of scale is not a symmetry: weight grows as s³, strength as s², so stress grows as s.',
    'Laws written as vector equations are automatically the same in every orientation.'
  ],
  pitfalls: [
    'Symmetry means the world looks the same everywhere — The laws are the same everywhere; the things in the world (mountains, planets, magnets) are not. A symmetry of the laws means the same experiment gives the same result.',
    'A pendulum clock laid on its side stops, so the laws are not symmetric under rotation — The clock depends on the Earth\'s gravity; turn the Earth with it and it keeps the same time.',
    'A scale model behaves like the full-size machine — Weight grows as the cube of the size and strength as the square: a model that works can be a full-size design that collapses. Engineers test models with carefully chosen dimensionless ratios for exactly this reason.'
  ],
  derivation: {
    title: 'Why stress grows with size',
    steps: [
      { text: 'Multiply every length by $s$. The volume, and with it the weight $W$, is multiplied by $s^3$:', tex: 'W \\propto \\rho g L^3 \\;\\to\\; s^3\\,W' },
      { text: 'The cross-section $A$ that carries the load is multiplied by only $s^2$:', tex: 'A \\propto L^2 \\;\\to\\; s^2 A' },
      { text: 'Stress is force per area, so it is multiplied by the ratio of the two factors, $s^3/s^2 = s$:', tex: '\\sigma = \\frac{W}{A} \\;\\to\\; \\frac{s^3 W}{s^2 A} = s\\,\\sigma' },
      { text: 'For a beam of width $b$ sticking out a length $L$ from a wall, the weight per metre is $w = \\rho g b h$ and the bending moment at the wall is $wL^2/2$. The bending formula $\\sigma = M/(bh^2/6)$ turns this into the stress at the top edge:', tex: '\\sigma = \\frac{wL^2/2}{bh^2/6} = \\frac{3\\rho g L^2}{h}' },
      { text: 'Keep the shape (fix $L/h$) and $\\sigma = 3\\rho g L\\,(L/h)$ grows in proportion to the size. The beam breaks when $\\sigma$ reaches the strength of the material, at the length', tex: 'L_{\\text{break}} = \\frac{\\sigma_{\\text{max}}}{3\\rho g\\,(L/h)}' }
    ]
  },
  formulas: [
    {
      name: 'Stress at the root of a beam carrying its own weight',
      expr: 'sigma = 3*rho*g*L^2/h', tex: '\\sigma = \\dfrac{3\\rho g L^2}{h}',
      vars: {
        sigma: { name: 'bending stress at the wall', q: 'stress', unit: 'MPa', tex: '\\sigma' },
        rho: { name: 'density of the material', q: 'density', unit: 'kg/m³', value: 450, tex: '\\rho' },
        g: { const: 'g' },
        L: { name: 'length sticking out of the wall', q: 'length', unit: 'm', value: 2 },
        h: { name: 'depth of the beam', q: 'length', unit: 'm', value: 0.1 }
      },
      note: 'A uniform rectangular cantilever with no load but its own weight. Scale L and h together and σ grows in proportion to the size.',
      stories: {
        sigma: 'A beam of density {rho} sticks out {L} from a wall and is {h} deep. What stress does its own weight cause at the wall?',
        L: 'A beam of density {rho}, {h} deep, can take {sigma}. How far can it stick out of a wall before its own weight breaks it?'
      }
    },
    {
      name: 'Galileo\'s bones: how thick a scaled-up bone must be',
      expr: 'd2 = d1*s^1.5', tex: 'd_2 = d_1\\, s^{3/2}',
      vars: {
        d2: { name: 'bone diameter needed at the larger size', q: 'length', unit: 'cm' },
        d1: { name: 'bone diameter at the original size', q: 'length', unit: 'cm', value: 3 },
        s: { name: 'scale factor of the animal\'s length', value: 3 }
      },
      note: 'Weight grows as s³ and bone area as d², so keeping the stress the same needs d² ∝ s³.',
      stories: { d2: 'A thighbone {d1} thick belongs to an animal that is to be made {s} times longer. How thick must the bone be to be as safe?' }
    },
    {
      name: 'A scaled clock runs slow',
      expr: 'T = 2*pi*sqrt(L/g)', tex: 'T = 2\\pi\\sqrt{\\dfrac{L}{g}}',
      vars: {
        T: { name: 'period of the pendulum', q: 'time', unit: 's' },
        L: { name: 'length of the pendulum', q: 'length', unit: 'm', value: 1 },
        g: { const: 'g' }
      },
      note: 'Small swings. Make the pendulum s times longer and its period grows by √s: a scaled-up clock does not keep the same time.',
      stories: { T: 'What is the period of a pendulum {L} long?', L: 'How long must a pendulum be to have a period of {T}?' }
    }
  ],
  examples: [
    {
      title: 'A beam that breaks when scaled up',
      q: 'A spruce beam (density 450 kg/m³, strength about 60 MPa) sticks out 2 m from a wall and is 10 cm deep. Find the stress at the wall, then the stress in a copy 100 times bigger in every direction.',
      steps: [
        '$\\sigma = 3\\rho g L^2/h = 3 \\times 450 \\times 9.81 \\times 2^2/0.1 = 5.3\\times10^5$ Pa $= 0.53$ MPa.',
        'The copy has $L = 200$ m and $h = 10$ m: $\\sigma = 3 \\times 450 \\times 9.81 \\times 200^2/10 = 5.3\\times10^7$ Pa $= 53$ MPa — 100 times more.',
        'Breaking length for this shape ($L/h = 20$): $L = 60\\times10^6/(3 \\times 450 \\times 9.81 \\times 20) \\approx 230$ m.'
      ],
      a: '0.53 MPa for the model, 53 MPa for the copy — near the limit of the wood. Same shape, same material, different fate.'
    },
    {
      title: 'A giant\'s thighbone',
      q: 'A human thighbone is about 3 cm thick at its middle. How thick would it have to be in a giant three times as tall, to be just as safe?',
      steps: [
        'Weight grows as $3^3 = 27$; the bone\'s cross-section must grow by the same factor.',
        'Area goes as diameter squared, so the diameter grows by $\\sqrt{27} = 3^{3/2} \\approx 5.2$.',
        '$d_2 = 3 \\times 5.2 \\approx 15.6$ cm, instead of the 9 cm of a simple enlargement.'
      ],
      a: 'About 16 cm, against 9 cm for a plain enlargement — the squat, swollen bone of Galileo\'s famous drawing.'
    },
    {
      title: 'A scaled-up clock',
      q: 'A pendulum clock with a 1 m pendulum is copied four times bigger. By how much does its period change?',
      steps: [
        '$T_1 = 2\\pi\\sqrt{1/9.81} = 2.006$ s.',
        '$T_2 = 2\\pi\\sqrt{4/9.81} = 4.012$ s: twice as long, because $T \\propto \\sqrt L$.'
      ],
      a: 'The big clock ticks half as fast — its time does not scale with its size.'
    }
  ],
  quiz: [
    { q: 'An experiment is repeated a week later in another city, with the whole apparatus turned through 90°. Nothing else is different. The result…', choices: ['is the same', 'differs because of the rotation', 'differs because of the delay', 'cannot be predicted'], a: 0, why: 'Translation in time, translation in space and rotation are all symmetries of the laws — provided "everything that matters" is included.' },
    { q: 'A pendulum clock laid on its side stops. This shows that the laws of physics are not symmetric under rotation.', a: false, why: 'The clock was turned but the Earth, whose gravity drives it, was not. Turn the Earth too and the clock runs exactly as before.' },
    { q: 'A beam is copied three times bigger in every direction, in the same material. The stress its own weight causes at the wall becomes…', choices: ['3 times larger', 'the same', '9 times larger', '27 times larger'], a: 0, why: 'Weight grows 27 times, area 9 times: stress = force/area grows 3 times.' },
    { q: 'Why are the laws of physics not symmetric under a change of scale?', choices: ['Atoms have a definite size', 'Gravity gets weaker with distance', 'Measuring instruments cannot be scaled', 'Because of relativity'], a: 0, why: 'A scaled machine cannot be built from scaled atoms; the size of atoms (set by ħ, the electron\'s mass and charge) gives nature a scale.' },
    { q: 'Inside a closed cabin of a ship sailing smoothly at constant velocity, a ball is dropped from rest. It lands…', choices: ['directly below the release point', 'behind the release point', 'ahead of the release point', 'on a curved path depending on the speed'], a: 0, why: 'Uniform motion is a symmetry: everything in the cabin shares the ship\'s velocity, so the drop is the same as on land.' }
  ],
  problems: [
    { q: 'A steel beam (density 7850 kg/m³, strength 250 MPa) sticks out of a wall and is 20 times longer than it is deep. How long can it be before its own weight breaks it?', answer: 54.1, unit: 'm', tol: 0.03,
      hint: 'Put h = L/20 into σ = 3ρgL²/h.',
      steps: ['With $h = L/20$: $\\sigma = 3\\rho g L \\times 20 = 60\\rho g L$.', '$L = \\sigma_{\\text{max}}/(60\\rho g) = 250\\times10^6/(60 \\times 7850 \\times 9.81) = 54.1$ m.', 'Spruce, with a much better strength-to-weight ratio, gets to about 230 m.'] },
    { q: 'An animal is to be made twice as long, keeping its bones as safe. By what factor must the bone diameter grow?', answer: 2.83, tol: 0.01,
      hint: 'd² must grow as fast as the weight, s³.',
      steps: ['$d_2/d_1 = s^{3/2} = 2^{1.5} = 2.83$.'] }
  ],
  applications: [
    'Ship hulls, aircraft and bridges are tested as scale models, but only after choosing which dimensionless ratios (Reynolds number, Froude number) must match — plain scaling would give the wrong answer.',
    'The square–cube law limits the height of trees and buildings and the size of land animals; the largest animals live in water, which carries their weight.',
    'Physical laws written as vector equations can be used with any orientation of the axes — the reason engineers may choose whatever axes make a problem easiest.'
  ],
  history: 'Galileo described the closed cabin on a steadily moving ship in his *Dialogue Concerning the Two Chief World Systems* (1632), and the failure of scaling — with the drawing of a small bone and a thick, three times longer one — in *Two New Sciences* (1638). Hermann Weyl\'s definition of symmetry is from his book *Symmetry* (1952). Emmy Noether proved in 1918 that each continuous symmetry of the laws carries a conservation law.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 52 (Symmetry in Physical Laws) — Weyl\'s definition, the list of operations that leave the laws unchanged, and why a change of scale is not one of them.',
    'Vol. I, ch. 11 (Vectors) — translations and rotations of the axes, and why laws written as vector equations do not care which way you face.',
    'Vol. I, ch. 15 (The Special Theory of Relativity) — uniform motion in a straight line and the principle of relativity.',
    '*The Character of Physical Law*, lecture 4, "Symmetry in Physical Law" (Messenger Lectures, Cornell, 1964).'
  ],
  sim: ['sym-invariance-lab', 'sym-galileo-bones']
},

{
  id: 'great-conservation-principles', parent: 'symmetry-topic', title: 'The great conservation principles', level: 1,
  short: 'A few numbers never change, whatever happens: energy, momentum, angular momentum, electric charge, and the counts of baryons and leptons. Charge is conserved locally — what leaves one place must pass through the space between — because otherwise moving observers would disagree.',
  keywords: ['conservation law', 'energy', 'momentum', 'angular momentum', 'charge', 'local conservation', 'continuity', 'baryon number', 'lepton number', 'strangeness', 'neutrino', 'Pauli', 'beta decay', 'Q-value'],
  prereq: ['conservation-of-energy', 'conservation-of-momentum', 'physics:angular-momentum'],
  related: ['conservation-from-symmetry', 'symmetry-in-physical-law', 'simultaneity-feyn', 'beyond-qed', 'weak-interaction-v-a', 'physics:radioactive-decay', 'physics:standard-model', 'physics:conservation-of-momentum'],
  body: `
Physics has many laws, most of them complicated in detail. But a handful of numbers can be worked out before anything happens and after it — a collision, an explosion, a chemical reaction, the decay of a nucleus — and they always come out the same. These **conservation laws** tell you what cannot happen without your knowing anything about the forces at work. Feynman devoted one of his Messenger lectures to them, as some of the most general statements physics can make.

### Energy: a number that always balances
Energy is not a substance you can see; it is a number, calculated in many ways — $\\tfrac12 mv^2$ for motion, $mgh$ for height, $\\tfrac12 kx^2$ for a spring, heat, chemical energy, $mc^2$ — whose total never changes. Feynman's picture in the Lectures was a parent keeping count of a child's toy blocks: some are always out of sight, but with the right formula for each hiding place the count always comes out the same. When the count seems to fail, a new hiding place is waiting to be found.

### Momentum and angular momentum
The total momentum $\\sum m\\vec v$ of anything left alone never changes; that is why a gun recoils and a rocket works. The total angular momentum never changes either. The Earth and the Moon show it on a grand scale: the tides brake the Earth's spin — the day lengthens by about 2 ms a century — and the angular momentum the Earth loses goes into the Moon's orbit, which grows by about 3.8 cm a year, measured by bouncing laser light off reflectors left on the Moon.

### Charge — and why it must be conserved locally
When a gamma ray makes an electron and a positron, it makes charges −1 and +1 together. No electron has ever been seen to decay; if electrons do, they live more than $10^{28}$ years. But Feynman stressed a stronger statement. Imagine a charge vanishing on the Earth and, at the same instant, another appearing on the Moon: the total would be kept. Relativity forbids it, because "the same instant" is not the same for everybody ([[simultaneity-feyn]]). To an observer flying past, the charge on the Moon appears before — or after — the one on the Earth vanishes, and for a while the total is wrong. The only law that works for every observer is **local** conservation: the charge in any region changes only by what flows through its boundary,

$$Q_2 = Q_1 - I\\,t .$$

Try it in the first simulation: speed up the observer and watch the count of charges jump to 2 or 0. Then let the charge travel from the Earth to the Moon instead, and the count stays at 1 for everyone.

### Counting particles
| Quantity | Kept by | Evidence |
|---|---|---|
| energy, momentum, angular momentum | everything | every collision ever measured |
| electric charge | everything, locally | electron lifetime $> 10^{28}$ years |
| baryon number (protons, neutrons … minus antibaryons) | everything seen so far | proton lifetime $> 10^{34}$ years |
| lepton number (electrons, muons, neutrinos …) | everything seen so far | $\\mu \\to e\\gamma$ never seen |
| strangeness | strong and electromagnetic forces, not the weak | strange particles live $\\sim10^{-10}$ s, not $10^{-23}$ s |

### The neutrino: faith in a conservation law rewarded
In beta decay a neutron becomes a proton and an electron. With only two products, conservation of energy and momentum would give the electron one fixed energy. Instead, since James Chadwick's measurements of 1914, electrons were seen with every energy from zero up to a maximum. Some physicists, Niels Bohr among them, wondered whether energy is conserved only on average. In December 1930 Wolfgang Pauli proposed instead an unseen, neutral, very light particle that carries off the missing energy and spin — the neutrino. Clyde Cowan and Frederick Reines detected neutrinos from a nuclear reactor in 1956. The second simulation checks the conservation laws for real and imagined reactions, and plots the electron's [[?probability-density|energy spectrum]].

> [!key] Energy, momentum, angular momentum and charge are conserved in every process ever observed; baryon and lepton numbers in every one seen so far. Charge is conserved locally: it cannot vanish here and reappear there without flowing through the space between.
`,
  ideas: [
    'A conservation law tells you what cannot happen without knowing the forces.',
    'Energy is a number computed in many forms; the total never changes.',
    'Momentum and angular momentum of anything left alone never change.',
    'Charge is conserved locally: the charge in a region changes only by the current through its boundary. A global law would fail for moving observers, who disagree about simultaneity.',
    'Beta decay seemed to break energy conservation; Pauli saved it by proposing the neutrino (1930), found in 1956.'
  ],
  pitfalls: [
    'Charge conservation only says the total charge of the universe is constant — It says much more: charge cannot jump from one place to another; it must flow through the space between, as a current.',
    'Kinetic energy is lost in a sticky collision, so energy is not conserved — The kinetic energy becomes heat and sound; the total energy is the same. Only momentum is conserved in its simple mechanical form.',
    'A conservation law explains why things happen — It only restricts what can happen. Energy conservation allows a ball to roll uphill by itself if it cools; the second law of thermodynamics is what forbids it.'
  ],
  derivation: {
    title: 'Why charge must be conserved locally',
    steps: [
      { text: 'In our frame a charge disappears at $x_A$ and another appears at $x_B$, a distance $D$ away, both at $t = 0$. The total is kept at every instant — in our frame.' },
      { text: 'An observer moving at speed $v$ along the line assigns times with the Lorentz transformation (with the [[?lorentz-factor]] $\\gamma$):', tex: "t' = \\gamma\\left(t - \\frac{v\\,x}{c^2}\\right)" },
      { text: 'Subtract the two events: for this observer the appearance at $B$ and the disappearance at $A$ are separated by', tex: "\\Delta t' = -\\gamma\\,\\frac{v D}{c^2}" },
      { text: 'For that interval the observer counts one charge too many (or too few). A law that is true for every observer cannot allow it, so charge can only move continuously through the space between — as a current $I$ through any surface around it:', tex: 'Q_2 = Q_1 - I\\,t' }
    ]
  },
  formulas: [
    {
      name: 'Momentum before equals momentum after',
      expr: 'm1*v1 + m2*v2 = m1*u1 + m2*u2', tex: 'm_1 v_1 + m_2 v_2 = m_1 u_1 + m_2 u_2',
      vars: {
        m1: { name: 'mass of body 1', q: 'mass', unit: 'kg', value: 2 },
        v1: { name: 'velocity of body 1 before', q: 'speed', unit: 'm/s', value: 3, signed: true },
        m2: { name: 'mass of body 2', q: 'mass', unit: 'kg', value: 1 },
        v2: { name: 'velocity of body 2 before', q: 'speed', unit: 'm/s', value: -1, signed: true },
        u1: { name: 'velocity of body 1 after', q: 'speed', unit: 'm/s', value: 1, signed: true },
        u2: { name: 'velocity of body 2 after', q: 'speed', unit: 'm/s', signed: true }
      },
      solveFor: 'u2',
      note: 'Along a line, velocities signed. True for every collision, elastic or not, when no outside force acts.',
      stories: {
        u2: 'A {m1} cart moving at {v1} hits a {m2} cart moving at {v2}. Afterwards the first moves at {u1}. How fast does the second move?',
        m2: 'A {m1} cart at {v1} collides with a cart moving at {v2}; afterwards they move at {u1} and {u2}. What is the mass of the second cart?'
      }
    },
    {
      name: 'Heat made when two bodies stick together',
      expr: 'Q = m1*m2*vr^2/(2*(m1 + m2))', tex: 'Q = \\dfrac{m_1 m_2}{2(m_1 + m_2)}\\,v_{\\mathrm{rel}}^2',
      vars: {
        Q: { name: 'kinetic energy turned into heat and sound', q: 'energy', unit: 'kJ' },
        m1: { name: 'mass of body 1', q: 'mass', unit: 'kg', value: 1000 },
        m2: { name: 'mass of body 2', q: 'mass', unit: 'kg', value: 1500 },
        vr: { name: 'speed of approach', q: 'speed', unit: 'm/s', value: 10, tex: 'v_{\\mathrm{rel}}' }
      },
      note: 'A perfectly inelastic collision: momentum is kept, and the kinetic energy of the relative motion becomes heat. The energy of the centre of mass cannot be lost.',
      stories: { Q: 'A {m1} car and a {m2} car close on each other at {vr} and lock together. How much energy becomes heat?', vr: 'Two cars of {m1} and {m2} lock together and turn {Q} into heat. How fast were they approaching?' }
    },
    {
      name: 'Local conservation of charge',
      expr: 'Q2 = Q1 - I*t', tex: 'Q_2 = Q_1 - I\\,t',
      vars: {
        Q2: { name: 'charge inside the region at the end', q: 'charge', unit: 'mC', signed: true },
        Q1: { name: 'charge inside the region at the start', q: 'charge', unit: 'mC', value: 5, signed: true },
        I: { name: 'current flowing out through the boundary', q: 'current', unit: 'mA', value: 2, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 1.5 }
      },
      note: 'For a steady current. The charge inside a closed surface changes only by the current through the surface — the integral form of the equation of continuity.',
      stories: { Q2: 'A region holds {Q1}. A current of {I} flows out of it for {t}. How much charge is left inside?', t: 'A region holding {Q1} loses charge through its surface at {I}. After how long does it hold {Q2}?' }
    },
    {
      name: 'Energy released by a decay',
      expr: 'Q = (mi - mf)*c^2', tex: 'Q = (m_i - m_f)\\,c^2',
      vars: {
        Q: { name: 'energy released (shared by the products)', q: 'energy', unit: 'MeV' },
        mi: { name: 'mass of the decaying particle', q: 'mass', unit: 'MeV/c²', value: 939.565, tex: 'm_i' },
        mf: { name: 'total mass of the products', q: 'mass', unit: 'MeV/c²', value: 938.783, tex: 'm_f' },
        c: { const: 'c' }
      },
      note: 'For a neutron: m_i = 939.565 MeV/c², proton + electron = 938.272 + 0.511 = 938.783 MeV/c², Q = 0.782 MeV — shared between the electron, the antineutrino and a tiny recoil.',
      stories: { Q: 'A particle of mass {mi} decays into products of total mass {mf}. How much kinetic energy do the products share?' }
    }
  ],
  examples: [
    {
      title: 'Where does the kinetic energy go?',
      q: 'A 1000 kg car and a 1500 kg car approach each other with a relative speed of 10 m/s and lock together. How much kinetic energy becomes heat, sound and bent metal?',
      steps: [
        'Momentum is kept, so the pair keeps moving with the centre of mass; only the energy of the relative motion can be lost.',
        'The reduced mass is $m_1m_2/(m_1+m_2) = 1.5\\times10^6/2500 = 600$ kg.',
        '$Q = \\tfrac12 \\times 600 \\times 10^2 = 30\\,000$ J.'
      ],
      a: '30 kJ — about the energy needed to lift one of the cars 3 m, and none of it lost from the total.'
    },
    {
      title: 'The energy of a neutron\'s decay',
      q: 'A free neutron (939.565 MeV/c²) decays into a proton (938.272 MeV/c²), an electron (0.511 MeV/c²) and an antineutrino (practically massless). How much kinetic energy is shared, and what is the most the electron can get?',
      steps: [
        '$Q = (939.565 - 938.272 - 0.511)$ MeV $= 0.782$ MeV.',
        'The share depends on the angles at which the three particles fly apart; the electron gets almost all of it when the antineutrino gets almost none.',
        'With only two products, energy and momentum would fix the electron\'s energy at one value; the continuous spread is the fingerprint of the third particle.'
      ],
      a: '0.782 MeV in total; the electron takes anything from 0 up to about 0.78 MeV.'
    },
    {
      title: 'Earth and Moon, seen by a passing observer',
      q: 'A charge vanishes on the Earth and another appears on the Moon, 1.28 light-seconds away, at the same moment in our frame. What does an observer passing along the Earth–Moon line at half the speed of light see?',
      steps: [
        '$\\gamma = 1/\\sqrt{1 - 0.5^2} = 1.155$.',
        '$\\Delta t\' = -\\gamma v D/c^2 = -1.155 \\times 0.5 \\times 1.28$ s $= -0.74$ s.',
        'For 0.74 s, one of the two events has happened for this observer and the other has not.'
      ],
      a: 'For about 0.74 s there are two charges, or none — so the process cannot happen. Charge must travel.'
    }
  ],
  quiz: [
    { q: 'Two carts collide and stick together. Which is conserved?', choices: ['momentum only', 'kinetic energy only', 'both momentum and kinetic energy', 'neither'], a: 0, why: 'Momentum is always conserved when no outside force acts; kinetic energy is partly turned into heat in a sticky collision (the total energy is still conserved).' },
    { q: 'Charge conservation would allow an electron to vanish on the Earth while another appears at the same instant on the Moon, since the total stays the same.', a: false, why: 'Observers in motion disagree about "the same instant"; for them the total would change for a while. Charge must be conserved locally, flowing through the space between.' },
    { q: 'In beta decay the electrons come out with every energy from zero up to 0.78 MeV. Pauli concluded that…', choices: ['a third, unseen particle carries off the rest', 'energy is conserved only on average', 'the electron loses energy inside the nucleus', 'the measurements were wrong'], a: 0, why: 'He kept energy (and angular momentum) conservation by proposing the neutrino; it was detected in 1956.' },
    { q: 'Which of these has never been seen, and is forbidden by a conservation law?', choices: ['$p \\to e^+ + \\pi^0$', '$n \\to p + e^- + \\bar\\nu_e$', '$\\pi^0 \\to \\gamma + \\gamma$', '$\\mu^- \\to e^- + \\bar\\nu_e + \\nu_\\mu$'], a: 0, why: 'Proton decay into a positron and a pion would change the baryon number from 1 to 0; the proton lives more than 10³⁴ years.' },
    { q: 'A 2 kg cart moving at 3 m/s hits a resting 1 kg cart and they stick together. How much kinetic energy becomes heat?', answer: 3, unit: 'J', why: 'The reduced mass is 2 × 1/3 = 2/3 kg, and the approach speed 3 m/s: Q = ½ × (2/3) × 9 = 3 J (of the 9 J at the start).' }
  ],
  problems: [
    { q: 'A 60 kg skater at rest on ice throws a 3 kg ball forwards at 8 m/s. How fast does she recoil?', answer: 0.4, unit: 'm/s', tol: 0.02,
      hint: 'The total momentum was zero before the throw.',
      steps: ['$0 = 3 \\times 8 + 60\\,u$.', '$u = -24/60 = -0.4$ m/s: 0.4 m/s backwards.'] },
    { q: 'A region holds 5 mC of charge. A current of 2 mA flows out through its surface for 1.5 s. How much charge is left inside?', answer: 2, unit: 'mC', tol: 0.01,
      steps: ['$Q_2 = Q_1 - It = 5\\ \\mathrm{mC} - 2\\ \\mathrm{mA} \\times 1.5\\ \\mathrm{s} = 5 - 3 = 2$ mC.'] }
  ],
  applications: [
    'Accident investigators work backwards from skid marks and final positions using conservation of momentum.',
    'Particle detectors find neutrinos, and search for new particles, as "missing" energy and momentum.',
    'Kirchhoff\'s current law — what flows into a node flows out — is local conservation of charge in a circuit.',
    'PET scanners detect the two 511 keV photons from electron–positron annihilation, flying apart back to back because momentum is conserved.'
  ],
  history: 'Conservation of energy was established in the 1840s by Julius Robert Mayer, James Joule and Hermann von Helmholtz. James Chadwick found the continuous beta-ray spectrum in 1914. Wolfgang Pauli proposed the neutrino in a letter of December 1930; Enrico Fermi built his theory of beta decay on it in 1933–34, and Clyde Cowan and Frederick Reines detected reactor antineutrinos in 1956.',
  sources: [
    '*The Character of Physical Law*, lecture 3, "The Great Conservation Principles" (Messenger Lectures, Cornell, 1964) — energy, charge and why its conservation must be local, baryon number, strangeness.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 4 (Conservation of Energy) — the blocks that are always found, and the many forms of energy.',
    'Vol. I, ch. 10 (Conservation of Momentum).',
    'Vol. II, ch. 13 (Magnetostatics) — electric current and the conservation of charge, written as the equation of continuity.'
  ],
  sim: ['sym-local-charge', 'sym-reaction-checker']
},

{
  id: 'conservation-from-symmetry', parent: 'symmetry-topic', title: 'Every symmetry gives a conservation law', level: 2,
  short: 'Laws that do not change when you move give conserved momentum; laws that do not change with time give conserved energy; laws that do not change when you turn give conserved angular momentum. Break the symmetry and the conserved quantity starts to wander.',
  keywords: ['Noether\'s theorem', 'Emmy Noether', 'symmetry', 'conservation', 'translation invariance', 'rotation invariance', 'time invariance', 'central force', 'torque', 'Kepler\'s second law', 'equal areas', 'parametric pumping', 'tides'],
  prereq: ['symmetry-in-physical-law', 'great-conservation-principles', 'least-action-mechanics'],
  related: ['symmetry-and-conservation-qm', 'lagrangian-mechanics', 'rotation-feyn', 'keplers-laws-feyn', 'gyroscope-feyn', 'physics:angular-momentum', 'physics:conservative-forces', 'physics:keplers-laws'],
  body: `
The last two pages put symmetries and conservation laws side by side. They are not a coincidence: they come in pairs. Emmy Noether proved in 1918 that for any laws that follow from a [[least-action-mechanics|principle of least action]], every continuous symmetry — one you can apply a little at a time, like a small shift or a small turn — brings a conserved quantity. Feynman pointed out the connection in the Lectures, and showed how natural it becomes in quantum mechanics ([[symmetry-and-conservation-qm]]). Here is the classical picture, one pair at a time.

### Moving → momentum
Two particles interact with a potential energy $U$ that depends only on their separation, $x_1 - x_2$. Slide both by the same distance and $U$ does not change: that is translation symmetry. The force on each particle is minus the slope of $U$ with respect to its own position (a [[?partial-derivative]]), and because $U$ depends only on the difference, the two slopes are equal and opposite:

$$F_1 = -\\frac{\\partial U}{\\partial x_1} = +\\frac{\\partial U}{\\partial x_2} = -F_2 .$$

Newton's third law is translation symmetry in disguise, and it keeps the total momentum constant. Put the particles on a bumpy floor — a potential that depends on where they are, not only on their separation — and the floor pushes: momentum is no longer conserved.

### Turning → angular momentum
If the potential depends only on the distance $r$ from a centre — the Sun's gravity, a perfectly round bowl — every force points along the radius. The torque $\\vec r \\times \\vec F$ (a [[?cross-product]]) is then zero, and the angular momentum $\\vec L = m\\,\\vec r \\times \\vec v$ stays constant. Kepler had seen this without knowing it: a planet sweeps out equal areas in equal times, because the rate of sweeping is

$$\\frac{dA}{dt} = \\frac{L}{2m}.$$

In the first simulation a ball rolls in a round bowl: the wedges it sweeps out in equal times have equal areas, and the graph of $L(t)$ is a flat line. Squash the bowl into an oval and the force gets a sideways part; $L$ starts to wander, and the wedges become unequal.

### Waiting → energy
If nothing in the laws depends on the clock, the energy $E = \\tfrac12 mv^2 + U$ stays fixed. If the potential changes with time, the energy changes at exactly the rate $\\partial U/\\partial t$. A child on a swing breaks time symmetry on purpose: by standing up at the bottom of each swing and crouching at the ends — twice per swing — she changes the pendulum's effective length and pumps in energy. In the simulation, *pulse* the bowl and watch $E(t)$ climb or wander while $L(t)$, as long as the bowl stays round, is still flat.

### Containers that keep some things and not others
| The laws inside are unchanged by | So this is conserved | The second simulation breaks it with |
|---|---|---|
| sliding everything sideways | momentum | walls |
| turning everything about the centre | angular momentum about the centre | corners (a square tray) |
| waiting | energy | nothing — the walls stand still |

In the second simulation discs collide in a tray. In a **round** tray the wall pushes along the radius, so angular momentum about the centre is kept but momentum is not. In a **square** tray neither is kept. With **no walls** — a disc leaving on the right comes back on the left — momentum is kept but angular momentum is not. Energy is kept in all three, and if the collisions are made sticky, the kinetic energy that disappears reappears as heat.

### The Earth and the Moon
The tides break the symmetry of the Earth's spin on its own — the Moon pulls on the Earth's tidal bulge with a torque of roughly $5\\times10^{16}$ N·m — but not the rotational symmetry of the Earth and Moon together. So their total angular momentum is kept: the Earth's spin slows, and the Moon's orbit grows.

> [!key] Each symmetry of the laws carries a conserved quantity: space → momentum, time → energy, rotation → angular momentum. Break the symmetry — walls, a time-varying force, a lopsided potential — and that quantity is no longer conserved.
`,
  ideas: [
    'Noether (1918): every continuous symmetry of laws that come from least action carries a conserved quantity.',
    'Forces that depend only on separations are equal and opposite, so total momentum is kept: Newton\'s third law is translation symmetry.',
    'A central force exerts no torque, so angular momentum is kept — Kepler\'s law of equal areas.',
    'A potential that does not change with time keeps energy constant; pumping it (a swing) changes the energy.',
    'Break a symmetry and its conserved quantity wanders: round tray keeps L, square tray keeps neither, no walls keeps p.'
  ],
  pitfalls: [
    'Angular momentum is conserved only for things that spin — A particle moving in a straight line has angular momentum m v b about any point at distance b from its path, and it stays constant; any central force keeps it too.',
    'A conservation law holds in every situation — It holds when the corresponding symmetry does. Inside a square box, the molecules\' total angular momentum is not conserved: the corners break the rotational symmetry.',
    'Energy conservation and time symmetry are separate facts — They are one: if the laws depended on the time, energy would not be conserved, as a pumped swing shows.'
  ],
  derivation: {
    title: 'Why a round bowl keeps angular momentum, and an oval one does not',
    steps: [
      { text: 'The angular momentum of a particle moving in the plane, about the origin:', tex: 'L = m\\,(x\\,v_y - y\\,v_x)' },
      { text: 'Take its [[?derivative]]. The terms $m(v_x v_y - v_y v_x)$ cancel, and $m\\dot v = F$ turns the rest into the torque:', tex: '\\frac{dL}{dt} = x F_y - y F_x = \\tau' },
      { text: 'If the potential depends only on $r = \\sqrt{x^2 + y^2}$, the force points along the radius, $(F_x, F_y) = f(r)\\,(x, y)/r$, and the torque is $f(r)(xy - yx)/r$:', tex: '\\tau = 0 \\quad\\Rightarrow\\quad L = \\text{constant}' },
      { text: 'Squash the bowl: $U = \\tfrac12 k\\,(x^2 + (1+\\varepsilon)\\,y^2)$ gives $F = -k\\,(x,\\ (1+\\varepsilon)\\,y)$, and the torque no longer vanishes:', tex: '\\tau = -k\\,\\varepsilon\\,x\\,y' },
      { text: 'It pushes $L$ up in two quadrants of the orbit and down in the other two, so $L$ wobbles and drifts — exactly what the simulation plots.' }
    ]
  },
  formulas: [
    {
      name: 'Angular momentum of a moving particle',
      expr: 'L = m*r*v*sin(phi)', tex: 'L = m\\,r\\,v\\sin\\varphi',
      vars: {
        L: { name: 'angular momentum about the point', q: 'angmom', unit: 'kg·m²/s' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.2 },
        r: { name: 'distance from the point', q: 'length', unit: 'm', value: 0.5 },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 3 },
        phi: { name: 'angle between the radius and the velocity', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\varphi' }
      },
      note: 'r sin φ is the perpendicular distance from the point to the line of motion; for a particle moving freely in a straight line it never changes, so neither does L.',
      stories: { L: 'A {m} puck slides at {v}, {r} from a pivot, its velocity at {phi} to the radius. What is its angular momentum about the pivot?' }
    },
    {
      name: 'Kepler\'s equal areas: the area swept in a time t',
      expr: 'A = L*t/(2*m)', tex: 'A = \\dfrac{L\\,t}{2m}',
      vars: {
        A: { name: 'area swept by the line to the centre', q: 'area', unit: 'm²' },
        L: { name: 'angular momentum', q: 'angmom', unit: 'kg·m²/s', value: 2.66e40 },
        t: { name: 'time', q: 'time', unit: 'yr', value: 1 },
        m: { name: 'mass of the orbiting body', q: 'mass', unit: 'kg', value: 5.97e24 }
      },
      note: 'True for any central force. The default numbers are the Earth\'s: in one year it sweeps the whole area of its orbit, π × (1.496 × 10¹¹ m)² ≈ 7.03 × 10²² m².',
      stories: { A: 'A planet of mass {m} with angular momentum {L} orbits a star. What area does the line from the star sweep in {t}?', L: 'A planet of mass {m} sweeps an area of {A} in {t}. What is its angular momentum?' }
    },
    {
      name: 'Angular momentum kept: a spinning skater',
      expr: 'I1*w1 = I2*w2', tex: 'I_1\\,\\omega_1 = I_2\\,\\omega_2',
      vars: {
        I1: { name: 'moment of inertia, arms out', q: 'inertia', unit: 'kg·m²', value: 3.5 },
        w1: { name: 'spin rate, arms out', q: 'angvel', unit: 'rev/s', value: 2, tex: '\\omega_1' },
        I2: { name: 'moment of inertia, arms in', q: 'inertia', unit: 'kg·m²', value: 1.2 },
        w2: { name: 'spin rate, arms in', q: 'angvel', unit: 'rev/s', tex: '\\omega_2' }
      },
      solveFor: 'w2',
      note: 'The ice is round about the skater\'s axis (no torque), so L = Iω stays the same while I changes.',
      stories: { w2: 'A skater spinning at {w1} with moment of inertia {I1} pulls her arms in to {I2}. How fast does she spin?' }
    },
    {
      name: 'A torque changes angular momentum',
      expr: 'dL = tau*t', tex: '\\Delta L = \\tau\\,t',
      vars: {
        dL: { name: 'change of angular momentum', q: 'angmom', unit: 'kg·m²/s', tex: '\\Delta L' },
        tau: { name: 'steady torque', q: 'torque', unit: 'N·m', value: 5e16, tex: '\\tau' },
        t: { name: 'time', q: 'time', unit: 'yr', value: 100 }
      },
      note: 'The default numbers are the tidal torque of the Moon on the Earth (roughly): about 1.6 × 10²⁶ kg·m²/s a century, taken from the Earth\'s spin and given to the Moon\'s orbit.',
      stories: { dL: 'A torque of {tau} acts for {t}. How much angular momentum does it transfer?', tau: 'Over {t} a body loses {dL} of angular momentum. What steady torque acted?' }
    }
  ],
  examples: [
    {
      title: 'Equal areas for the Earth',
      q: 'The Earth (5.97 × 10²⁴ kg) moves at 29.78 km/s at 1.496 × 10¹¹ m from the Sun, nearly in a circle. Find its angular momentum and the area it sweeps in a year.',
      steps: [
        '$L = mrv = 5.97\\times10^{24} \\times 1.496\\times10^{11} \\times 2.978\\times10^{4} = 2.66\\times10^{40}$ kg·m²/s.',
        '$A = Lt/(2m) = 2.66\\times10^{40} \\times 3.156\\times10^{7}/(2 \\times 5.97\\times10^{24}) = 7.03\\times10^{22}$ m².',
        'Check: $\\pi r^2 = \\pi(1.496\\times10^{11})^2 = 7.03\\times10^{22}$ m² — the whole orbit, as it should be.'
      ],
      a: 'L = 2.66 × 10⁴⁰ kg·m²/s; the whole area of the orbit, 7.03 × 10²² m², in one year.'
    },
    {
      title: 'The Moon slows the Earth',
      q: 'The Earth\'s spin angular momentum is about $5.9\\times10^{33}$ kg·m²/s. Tides lengthen the day by about 2.3 ms a century. Estimate the torque.',
      steps: [
        'A fractional change of the day is the same fractional change of $\\omega$, and of $L = I\\omega$: $2.3\\times10^{-3}/86\\,400 = 2.7\\times10^{-8}$.',
        '$\\Delta L = 5.9\\times10^{33} \\times 2.7\\times10^{-8} = 1.6\\times10^{26}$ kg·m²/s per century.',
        '$\\tau = \\Delta L/t = 1.6\\times10^{26}/(3.16\\times10^{9}\\ \\mathrm{s}) \\approx 5\\times10^{16}$ N·m.'
      ],
      a: 'Roughly 5 × 10¹⁶ N·m — and the same angular momentum goes into the Moon\'s orbit, which is why the Moon is receding.'
    },
    {
      title: 'A straight line has constant angular momentum',
      q: 'A 0.2 kg puck slides straight past a pin at 3 m/s, its path passing 0.4 m from the pin. Find its angular momentum about the pin when it is closest, and later when it is 1 m away.',
      steps: [
        'Closest: $r = 0.4$ m and $\\varphi = 90°$: $L = 0.2 \\times 0.4 \\times 3 = 0.24$ kg·m²/s.',
        'Later: $r = 1$ m and $\\sin\\varphi = 0.4/1$, so $L = 0.2 \\times 1 \\times 3 \\times 0.4 = 0.24$ kg·m²/s.'
      ],
      a: '0.24 kg·m²/s both times: with no force there is no torque, and r sin φ is always the same 0.4 m.'
    }
  ],
  quiz: [
    { q: 'A puck slides without friction in a bowl whose shape is the same in every direction around its centre. Which is conserved?', choices: ['angular momentum about the centre', 'momentum', 'both momentum and angular momentum', 'neither'], a: 0, why: 'The bowl pushes towards its centre: no torque, so L is kept. But the push changes the momentum all the time.' },
    { q: 'In a square box of gas the total angular momentum of the molecules about the centre stays constant.', a: false, why: 'A wall pushes perpendicular to itself, which is not towards the centre except at the middle of each wall; the corners break the rotational symmetry, so L changes at every bounce.' },
    { q: 'Newton\'s third law for two particles interacting with each other follows from…', choices: ['their potential energy depending only on their separation', 'their potential energy depending only on time', 'conservation of energy', 'the particles being identical'], a: 0, why: 'Translation symmetry: U(x₁ − x₂) gives equal and opposite slopes, hence equal and opposite forces.' },
    { q: 'A child pumps a swing higher and higher. Which symmetry is broken?', choices: ['symmetry in time — the swing\'s length changes with time', 'symmetry in space', 'rotational symmetry', 'none: energy is still conserved for the swing alone'], a: 0, why: 'By changing her posture twice a swing she makes the pendulum\'s laws depend on time, and its energy grows (fed by her muscles).' },
    { q: 'A skater with I = 3.5 kg·m² spinning at 2 rev/s pulls in to I = 1.4 kg·m². New spin rate in rev/s?', answer: 5, unit: 'rev/s', why: 'L = Iω is kept: ω₂ = 3.5 × 2/1.4 = 5 rev/s.' }
  ],
  problems: [
    { q: 'A comet passes perihelion 0.6 AU from the Sun at 50 km/s. How fast does it move at aphelion, 30 AU out? (At both points its velocity is perpendicular to the radius.)', answer: 1, unit: 'km/s', tol: 0.02,
      hint: 'L = m r v is the same at both points.',
      steps: ['$r_1v_1 = r_2v_2$.', '$v_2 = 50 \\times 0.6/30 = 1$ km/s.'] },
    { q: 'A skater spins at 2 rev/s with I = 3.5 kg·m² and pulls her arms in to I = 1.2 kg·m². How fast does she spin now?', answer: 5.83, unit: 'rev/s', tol: 0.02,
      steps: ['$\\omega_2 = I_1\\omega_1/I_2 = 3.5 \\times 2/1.2 = 5.83$ rev/s.', 'Her kinetic energy $\\tfrac12 I\\omega^2$ grows by the factor 2.9 — the work her arms did pulling in.'] }
  ],
  applications: [
    'Spacecraft turn themselves with reaction wheels: spinning a wheel one way turns the craft the other, keeping the total angular momentum zero.',
    'Divers and gymnasts tuck to spin faster and open out to stop, with no torque from the air.',
    'Lunar laser ranging measures the Moon receding by about 3.8 cm a year — angular momentum handed over from the Earth\'s spin.',
    'Simulation codes for planets and molecules are judged by how well they keep the conserved quantities that the symmetries promise.'
  ],
  history: 'Emmy Noether proved the theorem in Göttingen in 1918 ("Invariante Variationsprobleme"), while helping David Hilbert and Felix Klein understand energy conservation in general relativity. The link between symmetry and conservation had been noticed in special cases before, but her theorem made it general. Kepler published the law of equal areas in 1609.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 52 (Symmetry in Physical Laws) — each symmetry goes with a conservation law, a connection best understood through quantum mechanics.',
    'Vol. III, ch. 17 (Symmetry and Conservation Laws) — the connection derived in quantum mechanics.',
    'Vol. I, ch. 18 (Rotation in Two Dimensions) — torque, angular momentum and its conservation.',
    'Vol. I, ch. 7 (The Theory of Gravitation) — equal areas in equal times, and Newton\'s reading of it as a force towards the Sun.',
    '*The Character of Physical Law*, lecture 4, "Symmetry in Physical Law" — the conservation laws tied to the symmetries.'
  ],
  sim: ['sym-noether-orbit', 'sym-noether-box']
},

{
  id: 'symmetry-and-conservation-qm', parent: 'symmetry-topic', title: 'Symmetry and conservation in quantum mechanics', level: 3,
  short: 'In quantum mechanics a symmetry is an operation on states that commutes with the Hamiltonian; its eigenvalue — a phase, or a sign such as the parity ±1 — then never changes. In a symmetric double well every stationary state is even or odd, and a state that starts even stays even.',
  keywords: ['parity', 'symmetry operator', 'commutes with the Hamiltonian', 'eigenvalue', 'double well', 'even and odd states', 'tunnelling', 'ammonia', 'inversion', 'stationary states', 'conserved quantity', 'phase'],
  prereq: ['conservation-from-symmetry', 'amplitudes-in-time', 'hamiltonian-matrix'],
  related: ['ammonia-maser', 'operators-feyn', 'tunnelling-feyn', 'schrodinger-equation-feyn', 'angular-momentum-quantum', 'parity-violation', 'two-state-systems', 'math:eigenvalues'],
  body: `
In classical physics the link between symmetry and conservation takes some cleverness to see. In quantum mechanics, Feynman showed, it is almost automatic. A symmetry operation acts on the *states* themselves: it is an [[?operator]] $\\hat Q$ that turns every state $\\psi$ into another, $\\hat Q\\psi$. If the laws are symmetric under $\\hat Q$, then doing the operation and then letting time run gives the same as letting time run and then doing the operation — $\\hat Q$ and the Hamiltonian $\\hat H$ [[?commutator|commute]]. Everything follows from that.

### A symmetry with two answers: parity
Take the reflection $\\hat P$, which turns a [[?wave-function]] $\\psi(x)$ into $\\psi(-x)$, with $x$ measured from the centre. Reflecting twice gives back the original: $\\hat P^2 = 1$. So if a state is unchanged by $\\hat P$ apart from a factor $p$ — if it is an [[?eigenvalue|eigenstate]] of $\\hat P$ — then $p^2 = 1$, and $p = +1$ or $-1$. States with $p = +1$ are **even** (the same on both sides); those with $p = -1$ are **odd** (the same shape, opposite sign).

### The double well
Put a particle in a potential with two equal wells separated by a barrier. The potential is symmetric, so $\\hat P$ commutes with $\\hat H$ and every stationary state is even or odd. The lowest is even: a hump in each well, both of the same sign. The next is odd: humps of opposite sign. Their energies are nearly equal; the small difference $\\Delta E$ comes from tunnelling through the barrier, and it shrinks roughly exponentially as the barrier gets higher or wider. In the first simulation, raise the barrier and watch the first two levels close up. Then tilt the potential a little: the symmetry is gone, and so is parity — the states slide into one well or the other.

This is Feynman's ammonia molecule ([[ammonia-maser]]). The nitrogen atom can sit on either side of the plane of the three hydrogens — two wells. The stationary states are the even and odd combinations, split by $\\Delta E = 9.87\\times10^{-5}$ eV, which gives the frequency $f = \\Delta E/h = 23.87$ GHz of the ammonia maser.

### Why parity never changes
A stationary state keeps its shape; only its [[?rotating-arrow|arrow turns]], as $e^{-iEt/\\hbar}$. An even state is a [[?superposition]] of even stationary states: each turns at its own rate, but each stays even, so the sum stays even for ever. In general the [[?expectation-value]] $\\langle P\\rangle = \\int\\psi^*(x)\\,\\psi(-x)\\,dx$ never changes in a symmetric potential.

A particle put into the left well is neither even nor odd: it is (even + odd)/$\\sqrt2$. The two parts turn at slightly different rates, so they alternately add up on the left and on the right. The particle sloshes from well to well, and the [[?probability]] of finding it on the left is

$$P_L(t) = \\cos^2(\\pi f t), \\qquad f = \\frac{\\Delta E}{h}.$$

In the second simulation, start it on the left and watch it tunnel across and back while the plotted $\\langle P\\rangle$ stays exactly at 0. Start it even and it stays even. Tilt the wells and $\\langle P\\rangle$ wanders.

### The continuous symmetries
The same argument gives the classical conservation laws. A state of definite momentum, moved a distance $a$, is multiplied by the phase $e^{ipa/\\hbar}$; a state of definite energy, delayed by $\\tau$, by $e^{-iE\\tau/\\hbar}$; a state with angular momentum $m\\hbar$ about $z$, turned by $\\theta$, by $e^{im\\theta}$. If the operation commutes with $\\hat H$, the factor can never change — so $p$, $E$ and $L_z$ are conserved.

| Operation | Multiplies a state of definite value by | Conserved |
|---|---|---|
| move by $a$ | $e^{ipa/\\hbar}$ | momentum $p$ |
| wait for $\\tau$ | $e^{-iE\\tau/\\hbar}$ | energy $E$ |
| turn by $\\theta$ about $z$ | $e^{im\\theta}$ | $L_z = m\\hbar$ |
| reflect | $\\pm1$ | parity |

> [!key] A symmetry that commutes with the Hamiltonian has eigenvalues that never change in time. For a reflection they are ±1 (parity); for a shift, a delay and a turn they are phases whose rates are momentum, energy and angular momentum.
`,
  ideas: [
    'A symmetry is an operator on states; the laws are symmetric when it commutes with the Hamiltonian.',
    'Reflecting twice changes nothing, so parity eigenvalues are +1 (even) or −1 (odd).',
    'In a symmetric double well every stationary state is even or odd; the even and odd pair are split by the tunnelling energy ΔE.',
    'A state that starts even stays even; a particle started in one well sloshes between the wells at the frequency ΔE/h.',
    'For continuous symmetries the eigenvalue is a phase: its rate is momentum (for shifts), energy (for delays) or angular momentum (for turns).'
  ],
  pitfalls: [
    'A particle in the left well of a symmetric double well stays there if it has too little energy to climb the barrier — It tunnels: the left-well state is a superposition of the even and odd stationary states, which drift out of step, so it moves to the right well and back.',
    'Parity is conserved in every process — Only when the laws are mirror-symmetric. The weak interaction breaks the mirror symmetry, and parity is not conserved in beta decay ([[parity-violation]]).',
    'Every state has a definite parity — Only the eigenstates do. A general state is a mixture, with ⟨P⟩ between −1 and +1; what is conserved in a symmetric potential is that ⟨P⟩, and the amount of each part.'
  ],
  derivation: {
    title: 'Why a symmetry gives a conserved eigenvalue',
    steps: [
      { text: 'Start in a state that the symmetry operation multiplies by a number $q$ (an eigenstate of $\\hat Q$):', tex: '\\hat Q\\,\\psi(0) = q\\,\\psi(0)' },
      { text: 'Time runs by the operator $\\hat U(t) = e^{-i\\hat H t/\\hbar}$, built from $\\hat H$:', tex: '\\psi(t) = \\hat U(t)\\,\\psi(0)' },
      { text: 'If the laws are symmetric, $\\hat Q$ commutes with $\\hat H$, and so with $\\hat U$: operating first or waiting first gives the same state.', tex: '\\hat Q\\,\\hat U = \\hat U\\,\\hat Q' },
      { text: 'So at every later time the state is still multiplied by the same $q$:', tex: '\\hat Q\\,\\psi(t) = \\hat U\\,\\hat Q\\,\\psi(0) = q\\,\\hat U\\,\\psi(0) = q\\,\\psi(t)' },
      { text: 'For parity $q = \\pm1$. For a displacement by $a$, $q = e^{ipa/\\hbar}$: a constant $q$ is a constant momentum. Nothing about the forces was needed — only that they respect the symmetry.' }
    ]
  },
  formulas: [
    {
      name: 'Tunnelling frequency from the splitting of the even and odd states',
      expr: 'f = dE/h', tex: 'f = \\dfrac{\\Delta E}{h}',
      vars: {
        f: { name: 'frequency of the back-and-forth tunnelling', q: 'frequency', unit: 'GHz' },
        dE: { name: 'energy difference of the odd and even states', q: 'energy', unit: 'eV', value: 9.87e-5, tex: '\\Delta E' },
        h: { const: 'h' }
      },
      note: 'The default is ammonia: 9.87 × 10⁻⁵ eV gives 23.87 GHz, a wavelength of 1.26 cm.',
      stories: { f: 'The even and odd states of a double well differ by {dE}. At what frequency does a particle started in one well tunnel back and forth?', dE: 'A molecule tunnels between two shapes at {f}. What is the splitting of its even and odd states?' }
    },
    {
      name: 'Probability of still finding the particle in the starting well',
      expr: 'PL = cos(pi*f*t)^2', tex: 'P_L = \\cos^2(\\pi f t)',
      vars: {
        PL: { name: 'probability of finding it in the left well', tex: 'P_L' },
        f: { name: 'tunnelling frequency ΔE/h', q: 'frequency', unit: 'GHz', value: 23.87, min: 0, max: 50 },
        t: { name: 'time since it was put in the left well', q: 'time', unit: 'ps', value: 10, min: 0, max: 20 }
      },
      note: 'For a start in the left well made of the lowest even and odd states only. The particle is fully on the right after half a cycle, t = 1/(2f): 21 ps for ammonia.',
      stories: { PL: 'An ammonia-like molecule tunnels at {f}. It starts in the left shape. What is the chance of finding it still there after {t}?', t: 'A particle tunnels between two wells at {f}. When has the chance of finding it in the starting well fallen to {PL}?' }
    },
    {
      name: 'How far out of step two stationary states drift',
      expr: 'phi = dE*t/hbar', tex: '\\phi = \\dfrac{\\Delta E\\,t}{\\hbar}',
      vars: {
        phi: { name: 'angle between the two arrows', q: 'angle', unit: 'rad', tex: '\\phi' },
        dE: { name: 'energy difference of the two states', q: 'energy', unit: 'eV', value: 9.87e-5, tex: '\\Delta E' },
        t: { name: 'time', q: 'time', unit: 'ps', value: 10 },
        hbar: { const: 'hbar' }
      },
      note: 'Each stationary state is multiplied by e^{−iEt/ħ}, so its own probabilities never change; two of them drift apart at the rate ΔE/ħ. For the even and odd pair, P_L = cos²(φ/2).',
      stories: { phi: 'Two stationary states differ in energy by {dE}. How far apart have their arrows turned after {t}?', t: 'Two stationary states differ by {dE}. When have their arrows drifted {phi} apart?' }
    }
  ],
  examples: [
    {
      title: 'The ammonia clock',
      q: 'The even and odd states of ammonia differ by $9.87\\times10^{-5}$ eV. Find the frequency, the wavelength of the matching microwaves, and how long a molecule started on one side takes to be found on the other.',
      steps: [
        '$f = \\Delta E/h = 9.87\\times10^{-5} \\times 1.602\\times10^{-19}/6.626\\times10^{-34} = 2.387\\times10^{10}$ Hz = 23.87 GHz.',
        '$\\lambda = c/f = 3.00\\times10^{8}/2.387\\times10^{10} = 1.26$ cm.',
        'Fully across at $t = 1/(2f) = 21$ ps, and back at 42 ps.'
      ],
      a: '23.87 GHz, 1.26 cm; across in about 21 ps.'
    },
    {
      title: 'Parity of a mixture',
      q: 'A particle in a symmetric double well is in the state $0.8\\,\\psi_{\\text{even}} + 0.6\\,\\psi_{\\text{odd}}$ (both normalised). What is $\\langle P\\rangle$, and what is it a microsecond later?',
      steps: [
        '$\\hat P$ gives $0.8\\,\\psi_{\\text{even}} - 0.6\\,\\psi_{\\text{odd}}$.',
        '$\\langle P\\rangle = 0.8^2 - 0.6^2 = 0.64 - 0.36 = 0.28$ (the cross terms vanish because even and odd states are orthogonal).',
        'Each part only gains a phase as time passes; the sizes 0.8 and 0.6 stay, so $\\langle P\\rangle$ stays 0.28.'
      ],
      a: '0.28, now and for ever — as long as the potential stays symmetric.'
    },
    {
      title: 'A stationary state\'s arrow',
      q: 'How fast does the arrow of a state with $E = 1$ eV turn, and how far does it turn in a femtosecond?',
      steps: [
        '$\\omega = E/\\hbar = 1.602\\times10^{-19}/1.055\\times10^{-34} = 1.52\\times10^{15}$ rad/s.',
        'In $10^{-15}$ s: $\\phi = 1.52$ rad, about 87°.'
      ],
      a: '1.52 × 10¹⁵ rad/s; 1.52 rad in 1 fs. Only phase differences between states are observable.'
    }
  ],
  quiz: [
    { q: 'In a symmetric double well, the ground state is…', choices: ['even, with humps of the same sign in both wells', 'odd, with humps of opposite sign', 'localized in one well', 'neither even nor odd'], a: 0, why: 'The lowest state has no node; it is even. The next, odd, state is slightly higher.' },
    { q: 'A particle placed in the left well of a symmetric double well stays there for ever if its energy is below the top of the barrier.', a: false, why: 'The left-well state is (even + odd)/√2; the two parts drift out of phase at ΔE/ħ, and the particle tunnels to the right well and back.' },
    { q: 'A state starts odd in a symmetric potential. Later it is…', choices: ['still odd', 'even', 'neither even nor odd', 'zero everywhere'], a: 0, why: 'Parity commutes with the Hamiltonian, so the eigenvalue −1 is kept.' },
    { q: 'Why can the parity eigenvalue only be +1 or −1?', choices: ['reflecting twice gives back the original state, so p² = 1', 'because probabilities are between 0 and 1', 'because space has two directions', 'because of the exclusion principle'], a: 0, why: 'P̂² = 1, so any eigenvalue p obeys p² = 1.' },
    { q: 'One well is made slightly deeper than the other. The stationary states now…', choices: ['sit mostly in one well and have no definite parity', 'stay exactly even or odd', 'all become degenerate', 'disappear'], a: 0, why: 'The symmetry is broken, P̂ no longer commutes with Ĥ, and the states lean into one well each.' }
  ],
  problems: [
    { q: 'The even and odd states of a double well are split by 2.0 × 10⁻⁵ eV. At what frequency does a particle tunnel back and forth?', answer: 4.84, unit: 'GHz', tol: 0.02,
      steps: ['$f = \\Delta E/h = 2.0\\times10^{-5} \\times 1.602\\times10^{-19}/6.626\\times10^{-34} = 4.84\\times10^{9}$ Hz.'] },
    { q: 'A state is $0.6\\,\\psi_{\\text{even}} + 0.8\\,\\psi_{\\text{odd}}$. What is its parity expectation value?', answer: -0.28, tol: 0.01,
      steps: ['$\\langle P\\rangle = (+1)(0.6)^2 + (-1)(0.8)^2 = 0.36 - 0.64 = -0.28$.'] }
  ],
  applications: [
    'The ammonia inversion line at 23.87 GHz drove the first maser (1954) and is used by radio astronomers to measure temperatures in molecular clouds.',
    'Selection rules in spectroscopy — an electric dipole transition must change the parity — decide which spectral lines are bright and which are missing.',
    'Double-well qubits in superconducting circuits and quantum dots use the even and odd states and the tunnelling between them.'
  ],
  history: 'Otto Laporte found in 1924 that atomic spectral lines connect only certain classes of levels; Eugene Wigner explained the rule in 1927 by the parity of quantum states. Neil Cleeton and Neil Williams measured ammonia\'s inversion line at about 1.25 cm in 1934, the first microwave spectroscopy, and Charles Townes, James Gordon and Herbert Zeiger built the ammonia maser in 1954.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 17 (Symmetry and Conservation Laws) — symmetry operators, parity, and how conservation laws follow in quantum mechanics.',
    'Vol. III, ch. 9 (The Ammonia Maser) — the two states of the molecule and the symmetric and antisymmetric stationary states.',
    'Vol. III, ch. 7 (The Dependence of Amplitudes on Time) — stationary states and the turning phase e^{−iEt/ħ}.'
  ],
  sim: ['sym-double-well', 'sym-parity-packet']
},

{
  id: 'parity-violation', parent: 'symmetry-topic', title: 'Is nature left–right symmetric?', level: 2,
  short: 'For decades physicists took it for granted that the mirror image of any process is also a possible process. In 1956 Lee and Yang noticed this had never been tested for the weak force; in 1957 Chien-Shiung Wu\'s cobalt-60 experiment showed beta electrons leaving opposite to the nuclear spin — something whose mirror image does not happen.',
  keywords: ['parity', 'parity violation', 'mirror symmetry', 'Wu experiment', 'cobalt-60', 'Lee and Yang', 'weak interaction', 'beta decay', 'axial vector', 'polar vector', 'handedness', 'helicity', 'tau–theta puzzle', 'Ozma problem'],
  prereq: ['symmetry-in-physical-law', 'physics:radioactive-decay', 'spin-half'],
  related: ['matter-antimatter', 'symmetry-and-conservation-qm', 'weak-interaction-v-a', 'beyond-qed', 'physics:electron-spin', 'physics:fundamental-forces', 'math:cross-product'],
  body: `
Look at the world in a mirror. The clock in the mirror turns the other way and a right-handed screw becomes left-handed — but build the mirror clock out of real gears and it keeps perfect time. For gravity, electricity, magnetism, chemistry and the nuclear forces alike, the mirror image of any process is a process nature allows. Until 1956 nearly every physicist assumed this held for all of physics: the laws cannot tell left from right. Feynman put it vividly: could you explain, in a message sent across space to someone on a distant planet who can never see anything of ours, which hand we call "left"? If the laws are mirror-symmetric you cannot — all you can send are conventions.

### Arrows that reflect, and arrows that do not
Some quantities are ordinary [[?vector|vectors]]: position, velocity, force, the electric field. Others are defined by a right-hand rule through a [[?cross-product]]: angular velocity, angular momentum, spin, the magnetic field. The first kind are called **polar** vectors, the second **axial**. Stand a spinning top upright beside a mirror. In the mirror its axis still points up, but it turns the other way — so by the right-hand rule, the reflected top's spin points **down**. The drawn arrow reflects one way; the spin it stands for reflects another. A law that links a spin to a velocity along it — such as "electrons come out opposite to the nuclear spin" — becomes a different law in the mirror.

### A puzzle and a proposal
In the early 1950s two particles, called τ and θ, turned out to have the same mass and the same lifetime; but one decayed into three pions and the other into two — final states of opposite parity ([[symmetry-and-conservation-qm]]). Either two different particles matched by coincidence, or one particle decayed both ways and parity was not conserved. In 1956 Tsung-Dao Lee and Chen-Ning Yang went through the evidence and found that mirror symmetry had been tested many times for the strong and electromagnetic forces, but never for the weak force behind beta decay. They proposed experiments.

### The cobalt experiment
Chien-Shiung Wu of Columbia University, with Ernest Ambler, Raymond Hayward, Dale Hoppes and Ralph Hudson at the National Bureau of Standards in Washington, did the first one over the winter of 1956–57. Cobalt-60 nuclei spin, and a magnetic field lines up their spins if the sample is so cold — about a hundredth of a kelvin — that heat does not jumble them. They counted the beta electrons along and against the spin. More came out **opposite** to the spin. Reversing the field reversed the effect; as the sample warmed and the spins lost their alignment, the difference faded away. For nuclei polarized to a fraction $P$, electrons of speed $v = \\beta c$ leave at an angle $\\theta$ to the spin at the relative rate

$$W(\\theta) = 1 + A\\,P\\,\\beta\\cos\\theta, \\qquad A \\approx -1 \\text{ for cobalt-60}.$$

Now watch the experiment in a mirror (the first simulation). The mirror nucleus turns the other way, so its spin points down, while the electrons go wherever their reflections go — still mostly down. In the mirror world the electrons prefer to leave **along** the spin. Cobalt does not do that. The mirror image of a real experiment is not a possible experiment: the weak force tells left from right. Richard Garwin, Leon Lederman and Marcel Weinrich found the same in the decays of pions and muons at Columbia's cyclotron, and the two papers appeared side by side in February 1957. The second simulation shows the cleanest case: in the decay of a pion, the neutrino always spins left-handed.

### A message for the distant listener
Now there is something to send: wind a coil, put cobalt-60 inside, cool it down and switch on the current. Look at the coil from the side from which most of the beta electrons come out: the electrons in the wire go round anticlockwise. That fixes a sense of rotation, and with it left and right, without pointing at anything — unless the listener is made of antimatter, as the next page, [[matter-antimatter]], explains.

> [!key] Gravity, electromagnetism and the strong force are mirror-symmetric; the weak force is not. In the cobalt-60 experiment the electrons leave mostly opposite to the nuclear spin, and in the mirror image they would leave along it — which never happens.
`,
  ideas: [
    'Mirror symmetry (parity) means the mirror image of any possible process is also possible.',
    'Spin and angular momentum are axial vectors: in a mirror their direction flips relative to the reflected picture, so the spin–velocity product changes sign.',
    'Lee and Yang (1956) saw that parity had never been tested in weak interactions.',
    'Wu\'s cobalt-60 experiment (1957): beta electrons leave preferentially opposite to the nuclear spin — the mirror image would have them along it.',
    'Only the weak force violates parity, and it does so as much as it can: neutrinos are always left-handed.'
  ],
  pitfalls: [
    'Parity violation means mirrors do not work, or that left-handed objects behave differently in everyday life — Gravity, electromagnetism and chemistry are perfectly mirror-symmetric; only processes driven by the weak force (such as beta decay) tell left from right.',
    'A mirror reverses the spin arrow drawn along its axis just like any arrow — A spin is defined by a sense of rotation. A mirror placed beside a spinning top leaves the drawn upward arrow pointing up, but reverses the rotation, so the true spin of the reflected top points down.',
    'The cobalt electrons go "down" because of gravity or the magnet\'s pull — Reversing the magnetic field reverses the preferred direction; warming the sample removes it. The preference is tied to the direction of the nuclear spin.'
  ],
  derivation: {
    title: 'What a mirror does to a spin',
    steps: [
      { text: 'Put the mirror in the $yz$-plane, facing along $x$. Reflection changes $x \\to -x$ for every position and $v_x \\to -v_x$ for every velocity; $y$, $z$ and their velocities are unchanged.' },
      { text: 'The angular momentum about the $z$-axis — which lies in the mirror — is $L_z = m(x v_y - y v_x)$. Both terms change sign:', tex: 'L_z \\;\\to\\; m\\big((-x)\\,v_y - y\\,(-v_x)\\big) = -L_z' },
      { text: 'So a spin along $z$ is reversed while a velocity along $z$ is not. Their [[?dot-product]] — how much a particle spins along its own direction of motion — changes sign:', tex: '\\vec s\\cdot\\vec v \\;\\to\\; -\\,\\vec s\\cdot\\vec v' },
      { text: 'In $W(\\theta) = 1 + AP\\beta\\cos\\theta$, $\\cos\\theta$ is exactly this product divided by the lengths. A mirror-symmetric law must give the same rate when it flips sign, which needs $A = 0$. Cobalt-60 gives $A \\approx -1$: as large as it could be.' }
    ]
  },
  formulas: [
    {
      name: 'Beta electrons from polarized nuclei',
      expr: 'W = 1 + A*P*beta*cos(theta)', tex: 'W = 1 + A\\,P\\,\\beta\\cos\\theta',
      vars: {
        W: { name: 'rate at angle θ, relative to unpolarized nuclei' },
        A: { name: 'asymmetry coefficient of the decay (−1 for cobalt-60)', value: -1, signed: true },
        P: { name: 'fraction of nuclear polarization', value: 0.6, min: 0, max: 1 },
        beta: { name: 'electron speed as a fraction of c', value: 0.6, min: 0, max: 0.99, tex: '\\beta' },
        theta: { name: 'angle between the electron and the nuclear spin', q: 'angle', unit: '°', value: 150, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'If parity were conserved, A would be 0 and W would be 1 in every direction. With A = −1 more electrons leave backwards (θ near 180°) than forwards.',
      stories: { W: 'Cobalt-60 nuclei (A = {A}) are polarized to {P}. How many electrons of speed {beta} c leave at {theta} to the spin, relative to unpolarized nuclei?', P: 'Electrons of speed {beta} c leave at {theta} to the spin of nuclei with A = {A} at the relative rate {W}. How well are the nuclei polarized?' }
    },
    {
      name: 'Electrons against the spin, per electron along it',
      expr: 'R = (1 + P*beta)/(1 - P*beta)', tex: 'R = \\dfrac{1 + P\\beta}{1 - P\\beta}',
      vars: {
        R: { name: 'count ratio, backward (against the spin) to forward' },
        P: { name: 'fraction of nuclear polarization', value: 0.6, min: 0, max: 0.99 },
        beta: { name: 'electron speed as a fraction of c', value: 0.6, min: 0, max: 0.99, tex: '\\beta' }
      },
      note: 'Detectors on the spin axis, with A = −1. A mirror-symmetric world would give R = 1.',
      stories: { R: 'Nuclei are polarized to {P}; electrons of speed {beta} c are counted straight along and straight against the spin. What is the ratio of the counts?', P: 'Electrons of speed {beta} c are counted {R} times more often against the spin than along it. How well are the nuclei polarized?' }
    }
  ],
  examples: [
    {
      title: 'How lopsided is the cobalt experiment?',
      q: 'Nuclei are 60 % polarized, and the electrons counted have speed 0.6c. Using $W = 1 + AP\\beta\\cos\\theta$ with $A = -1$, compare the rates straight along the spin, sideways, and straight against it.',
      steps: [
        'Along ($\\theta = 0$): $W = 1 - 0.6 \\times 0.6 = 0.64$.',
        'Sideways ($\\theta = 90°$): $W = 1$.',
        'Against ($\\theta = 180°$): $W = 1 + 0.36 = 1.36$; the ratio is $1.36/0.64 = 2.1$.'
      ],
      a: 'More than twice as many electrons leave against the spin as along it. In the mirror image the ratio would be reversed.'
    },
    {
      title: 'The speed of a beta electron',
      q: 'Cobalt-60\'s beta electrons have up to 318 keV of kinetic energy. How fast is an electron with 318 keV?',
      steps: [
        '$\\gamma = 1 + K/(m_ec^2) = 1 + 318/511 = 1.622$.',
        '$\\beta = \\sqrt{1 - 1/\\gamma^2} = \\sqrt{1 - 0.380} = 0.787$.'
      ],
      a: 'About 0.79c. The slower electrons, near 0.5c, show a smaller asymmetry, as the factor β in W says.'
    }
  ],
  quiz: [
    { q: 'In the mirror image of the cobalt-60 experiment, the electrons come out mostly…', choices: ['along the nuclear spin', 'opposite to the nuclear spin', 'equally in both directions', 'sideways'], a: 0, why: 'The mirror reverses the nucleus\'s sense of rotation (its spin) but not the up–down motion of the electrons, so "against the spin" becomes "along the spin" — which real cobalt never does.' },
    { q: 'The Wu experiment showed that electromagnetism can tell left from right.', a: false, why: 'The field only lined up the spins. The asymmetry comes from the weak force that drives beta decay; electromagnetism is mirror-symmetric.' },
    { q: 'Which of these is an axial vector, whose direction a mirror treats "the other way"?', choices: ['angular momentum', 'velocity', 'force', 'electric field'], a: 0, why: 'Angular momentum is defined by a right-hand rule (r × p); velocity, force and E are polar vectors.' },
    { q: 'If parity were conserved in beta decay, the counts of electrons along and against the nuclear spin would be…', choices: ['equal', 'larger along the spin', 'larger against the spin', 'zero'], a: 0, why: 'A mirror-symmetric law cannot prefer either direction, since the mirror swaps them: A = 0.' },
    { q: 'As Wu\'s cobalt sample warmed up, the difference between the counts…', choices: ['faded away', 'grew', 'reversed', 'stayed the same'], a: 0, why: 'Heat jumbled the nuclear spins (P → 0), and with no preferred spin direction there is no preferred electron direction.' }
  ],
  problems: [
    { q: 'Nuclei with A = −1 are 50 % polarized. Electrons of speed 0.6c are counted straight against and straight along the spin. What is the ratio of the counts?', answer: 1.86, tol: 0.02,
      steps: ['$R = (1 + P\\beta)/(1 - P\\beta) = (1 + 0.3)/(1 - 0.3) = 1.3/0.7 = 1.86$.'] },
    { q: 'What is the speed, as a fraction of c, of a beta electron with 200 keV of kinetic energy?', answer: 0.695, tol: 0.01,
      hint: 'γ = 1 + K/(511 keV).',
      steps: ['$\\gamma = 1 + 200/511 = 1.391$.', '$\\beta = \\sqrt{1 - 1/1.391^2} = \\sqrt{0.4835} = 0.695$.'] }
  ],
  applications: [
    'The weak force\'s handedness is built into the Standard Model: only left-handed particles (and right-handed antiparticles) feel the W boson.',
    'Parity violation makes tiny left–right differences in atoms, measured in heavy atoms such as caesium as a test of the weak force at low energy.',
    'Polarized neutron and nuclear beta-decay experiments still measure asymmetry coefficients like A to test the structure of the weak interaction.'
  ],
  history: 'Tsung-Dao Lee and Chen-Ning Yang\'s paper "Question of Parity Conservation in Weak Interactions" appeared in October 1956; Wu\'s group and Garwin, Lederman and Weinrich published their results in February 1957, and Lee and Yang shared the Nobel Prize that year. In *Surely You\'re Joking, Mr. Feynman!* (the chapter "The 7 Percent Solution") Feynman tells how, at the Rochester conference of 1956, he passed on the experimenter Martin Block\'s question of whether parity might be violated, and how, after the experiments, he and Murray Gell-Mann found the form of the weak interaction ([[weak-interaction-v-a]]). Maurice Goldhaber, Lee Grodzins and Andrew Sunyar measured the neutrino\'s left-handedness in 1958.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 52 (Symmetry in Physical Laws) — mirror reflections, polar and axial vectors, how to tell a distant listener which hand is right, and the cobalt experiment showing that parity is not conserved.',
    '*The Character of Physical Law*, lecture 4, "Symmetry in Physical Law" — the same story for a general audience.',
    'Vol. III, ch. 17 (Symmetry and Conservation Laws) — parity in quantum mechanics and a parity-violating decay, the Λ⁰.',
    '*Surely You\'re Joking, Mr. Feynman!* (1985), "The 7 Percent Solution" — the Rochester conference and the weak interaction.'
  ],
  sim: ['sym-cobalt-mirror', { id: 'sym-cp-pion', params: { op: 'P' } }]
},

{
  id: 'matter-antimatter', parent: 'symmetry-topic', title: 'Matter, antimatter and mirrors', level: 2,
  short: 'Every particle has an antiparticle. Swapping matter for antimatter (C) is not an exact symmetry, and neither is the mirror (P) — but the combination CP almost is. Almost: in 1964 neutral kaons were found to break CP too, and the universe is made of matter, for reasons still unknown.',
  keywords: ['antimatter', 'antiparticle', 'positron', 'charge conjugation', 'CP', 'CP violation', 'CPT theorem', 'kaon', 'K-long', 'Cronin and Fitch', 'annihilation', 'baryon asymmetry', 'Sakharov', 'helicity', 'neutrino'],
  prereq: ['parity-violation', 'physics:antimatter', 'relativistic-mass-energy'],
  related: ['feynman-diagrams', 'past-and-future', 'beyond-qed', 'weak-interaction-v-a', 'symmetry-in-physical-law', 'physics:standard-model', 'physics:big-bang', 'physics:particle-accelerators'],
  body: `
In 1928 Paul Dirac wrote an equation for the electron that obeyed relativity. It had an extra set of solutions, and by 1931 Dirac concluded that they described a new particle with the electron's mass and the opposite charge. Carl Anderson found its tracks in cosmic rays in 1932 and called it the positron; the antiproton followed in 1955 at the Berkeley Bevatron. Every particle has an **antiparticle**, with the same mass and spin and opposite charge, baryon number and lepton number. When the two meet they can annihilate: an electron and a positron at rest become two photons of 511 keV each, flying apart back to back — which is how a PET scanner finds them. Feynman gave the positron a picture of his own: in a space-time diagram it behaves exactly like an electron travelling backwards in time, so one line in a [[feynman-diagrams|Feynman diagram]] can stand for both.

### C: swap matter for antimatter
The operation that replaces every particle by its antiparticle is **charge conjugation**, C. Gravity, electromagnetism and the strong force do not notice it: antihydrogen, made at CERN since 1995 and trapped since 2010, has the spectrum of hydrogen as far as it has been measured, and in 2023 the ALPHA experiment saw antihydrogen fall down, like ordinary matter. But the weak force notices C just as it notices the mirror: neutrinos are always left-handed — spinning against their motion — while antineutrinos are always right-handed.

### CP: the mirror made of antimatter
Take the decay of a positive pion at rest, $\\pi^+ \\to \\mu^+ + \\nu_\\mu$. The pion has no spin, so the muon and the neutrino fly apart with opposite spins, and the neutrino is left-handed. Reflect the event in a mirror (P): the neutrino becomes right-handed — never seen. Swap for antimatter (C): $\\pi^- \\to \\mu^- + \\bar\\nu_\\mu$ with a left-handed antineutrino — never seen either. Do both (CP): a right-handed antineutrino — exactly what $\\pi^-$ decays show. After 1957 it seemed that nature's true mirror is CP. The first simulation shows all four worlds.

Feynman closed his lecture on symmetry with a twist on the message to a distant listener. You explain left and right with the cobalt experiment; but a listener made of antimatter, using anti-cobalt, would draw the opposite conclusion. So if you ever meet, and he offers the hand you did not expect for a handshake, keep your distance.

### CP is broken too
In 1964 James Christenson, James Cronin, Val Fitch and René Turlay found that the long-lived neutral kaon, $K_L$, which should decay into three pions if CP were exact, sometimes decays into two — about twice in a thousand decays. Its decays into a pion, an electron and a neutrino show it more plainly: $K_L \\to \\pi^- e^+ \\nu_e$ happens about 0.33 % more often than $K_L \\to \\pi^+ e^- \\bar\\nu_e$. At last the distant listener can be told without conventions: *positive* is the charge of the lepton that $K_L$ emits more often, and matter is the stuff whose atomic nuclei carry that charge. The second simulation shows how many decays it takes to see a 0.33 % difference through the random scatter: millions, because the scatter shrinks only as $1/\\sqrt N$ (a [[?standard-deviation]]).

### CPT, time and the missing antimatter
One combination still looks exact: CPT — reflect space, swap matter for antimatter and run time backwards. It follows from relativity and quantum mechanics together (the CPT theorem, 1950s), and it makes a particle and its antiparticle equal in mass and lifetime; for neutral kaons the masses agree to better than one part in $10^{18}$. A break in CP must then be matched by a break in time reversal ([[past-and-future]]).

The universe holds about $6\\times10^{-10}$ protons and neutrons per photon of the cosmic background, and almost no antimatter. In 1967 Andrei Sakharov listed what an even start needs to end with more matter: processes that change baryon number, C and CP violation, and a departure from thermal equilibrium. The CP violation measured so far — in kaons, B mesons (2001) and D mesons (2019) — seems far too small to explain the excess. Why anything was left over is still unknown.

> [!key] C (matter ↔ antimatter) and P (mirror) are each broken by the weak force; their product CP is nearly exact but not quite (kaons, 1964). CPT appears exact. The small CP violation lets matter be defined without conventions — but not, so far, explain why the universe is made of it.
`,
  ideas: [
    'Every particle has an antiparticle with the same mass and opposite charges; a pair can annihilate into photons.',
    'Feynman\'s picture: a positron is an electron running backwards in time.',
    'C and P are separately broken by the weak force; CP turns an observed pion decay into another observed decay.',
    'CP is broken slightly in neutral kaons (1964): K_L prefers to emit positrons by 0.33 %, which defines matter without conventions.',
    'CPT appears exact; why the universe contains matter and hardly any antimatter is an open question.'
  ],
  pitfalls: [
    'Antimatter falls upwards — Antihydrogen falls down: the ALPHA experiment saw it in 2023, as the equivalence principle of general relativity predicts.',
    'CP violation means antimatter behaves completely differently from matter — The differences are tiny and appear only in weak decays of particular particles (kaons, B and D mesons); masses, charges and spectra are the same.',
    'Annihilation turns matter into "pure energy" with nothing left — Energy, momentum, charge and angular momentum are all conserved: at rest an electron–positron pair gives at least two photons, back to back, 511 keV each.'
  ],
  formulas: [
    {
      name: 'Energy of an annihilation at rest',
      expr: 'E = 2*m*c^2', tex: 'E = 2mc^2',
      vars: {
        E: { name: 'energy released (shared by the photons)', q: 'energy', unit: 'MeV' },
        m: { name: 'mass of the particle (and of its antiparticle)', q: 'mass', unit: 'MeV/c²', value: 0.511 },
        c: { const: 'c' }
      },
      note: 'Electron and positron: 1.022 MeV, as two 511 keV photons back to back. Proton and antiproton: 1877 MeV, usually as several pions.',
      stories: { E: 'A particle of mass {m} meets its antiparticle at rest and they annihilate. How much energy is released?', m: 'An annihilation at rest releases {E}. What was the mass of each particle?' }
    },
    {
      name: 'How many events are needed to see a small asymmetry',
      expr: 'N = (z/delta)^2', tex: 'N = \\left(\\dfrac{z}{\\delta}\\right)^2',
      vars: {
        N: { name: 'number of decays to count' },
        z: { name: 'required significance, in standard deviations', value: 5 },
        delta: { name: 'asymmetry to be seen', q: 'ratio', unit: '%', value: 0.33, tex: '\\delta' }
      },
      note: 'The measured fraction scatters by about 1/√N, so an asymmetry δ stands out by z standard deviations when δ√N = z. For K_L → πeν, δ = 0.33 %.',
      stories: { N: 'How many decays must be counted to see an asymmetry of {delta} at {z} standard deviations?', delta: 'After {N} decays, what is the smallest asymmetry that stands out by {z} standard deviations?' }
    },
    {
      name: 'The matter left over: baryons per cubic metre',
      expr: 'nb = eta*ng', tex: 'n_b = \\eta\\, n_\\gamma',
      vars: {
        nb: { name: 'number density of baryons (protons and neutrons)', q: 'numberdensity', unit: '1/m³', tex: 'n_b' },
        eta: { name: 'baryons per photon', value: 6.1e-10, tex: '\\eta' },
        ng: { name: 'number density of cosmic background photons', q: 'numberdensity', unit: '1/cm³', value: 411, tex: 'n_\\gamma' }
      },
      note: 'Today the cosmic microwave background holds about 411 photons per cubic centimetre; with η ≈ 6.1 × 10⁻¹⁰ that leaves about one proton or neutron in every four cubic metres of the universe, on average.',
      stories: { nb: 'There are {ng} background photons and {eta} baryons per photon. How many baryons are there in a cubic metre, on average?' }
    }
  ],
  examples: [
    {
      title: 'The photons of a PET scan',
      q: 'A positron from a tracer stops in the body and annihilates with an electron. What photons come out?',
      steps: [
        '$E = 2m_ec^2 = 2 \\times 0.511 = 1.022$ MeV.',
        'The pair was at rest, so the total momentum is zero: two photons must fly apart back to back, sharing the energy equally.',
        'Each has 0.511 MeV; the scanner looks for two simultaneous 511 keV hits on opposite sides of the ring.'
      ],
      a: 'Two 511 keV photons, back to back — and the line between the two hits passes through the annihilation.'
    },
    {
      title: 'Counting kaon decays',
      q: 'How many $K_L \\to \\pi e \\nu$ decays must be counted to show the 0.33 % excess of positrons at five standard deviations?',
      steps: [
        'The measured fraction scatters by about $1/\\sqrt N$; we need $\\delta\\sqrt N = 5$.',
        '$N = (5/0.0033)^2 = 2.3\\times10^{6}$.'
      ],
      a: 'About 2.3 million decays — and systematic effects (detectors that favour one charge) must be controlled to better than 0.1 %.'
    },
    {
      title: 'How empty is the universe?',
      q: 'The cosmic background has 411 photons per cm³ and there are $6.1\\times10^{-10}$ baryons per photon. How many baryons are there per cubic metre?',
      steps: [
        '$411$ per cm³ $= 4.11\\times10^{8}$ per m³.',
        '$n_b = 6.1\\times10^{-10} \\times 4.11\\times10^{8} = 0.25$ per m³.'
      ],
      a: 'About one proton or neutron in every 4 m³ on average — the tiny excess of matter that survived the early universe.'
    }
  ],
  quiz: [
    { q: 'In the decay π⁺ → μ⁺ + ν_μ, which operation turns the event into another event that really happens?', choices: ['CP: mirror and swap to antimatter', 'P: the mirror alone', 'C: antimatter alone', 'none of them'], a: 0, why: 'P gives a right-handed neutrino and C a left-handed antineutrino, neither seen; CP gives π⁻ → μ⁻ + a right-handed antineutrino, which is what happens.' },
    { q: 'Since 1964 there is a way to tell a distant listener which is matter and which is antimatter without relying on any convention.', a: true, why: 'CP violation in K_L decays: the lepton emitted 0.33 % more often defines positive charge.' },
    { q: 'An electron and a positron annihilate at rest. Each of the two photons has…', choices: ['511 keV', '1.022 MeV', '256 keV', '938 MeV'], a: 0, why: 'The total 2mₑc² = 1.022 MeV is shared equally by two photons flying apart back to back.' },
    { q: 'The CPT theorem implies that a particle and its antiparticle have…', choices: ['exactly the same mass and lifetime', 'opposite masses', 'the same charge', 'different spins'], a: 0, why: 'CPT relates each particle to its antiparticle at rest; any difference in mass or lifetime would break it. None has been found.' },
    { q: 'In Feynman\'s picture, a positron moving forwards in time behaves like…', choices: ['an electron moving backwards in time', 'a photon', 'a proton with the electron\'s mass', 'an electron with negative mass'], a: 0, why: 'He showed in 1949 that the backward-in-time electron lines of his diagrams account for positrons.' }
  ],
  problems: [
    { q: 'A proton and an antiproton annihilate at rest. How much energy is released?', answer: 1877, unit: 'MeV', tol: 0.01,
      steps: ['$E = 2m_pc^2 = 2 \\times 938.27 = 1876.5$ MeV — usually carried off by several pions.'] },
    { q: 'How many decays are needed to see an asymmetry of 0.33 % at three standard deviations?', answer: 8.26e5, tol: 0.03,
      steps: ['$N = (z/\\delta)^2 = (3/0.0033)^2 = 8.26\\times10^{5}$.'] }
  ],
  applications: [
    'Positron emission tomography (PET) images the body with the back-to-back photons of electron–positron annihilation.',
    'Antiprotons and antihydrogen made at CERN test CPT symmetry and the gravity of antimatter.',
    'B-meson "factories" and the LHCb experiment measure CP violation to test the Standard Model\'s quark-mixing picture.',
    'Cosmology uses the measured baryon-to-photon ratio, 6 × 10⁻¹⁰, as a key number of the early universe.'
  ],
  history: 'Paul Dirac\'s relativistic equation (1928) led him to predict the anti-electron in 1931; Carl Anderson found the positron in 1932. Owen Chamberlain, Emilio Segrè, Clyde Wiegand and Thomas Ypsilantis produced antiprotons in 1955. Feynman\'s paper "The Theory of Positrons" (Physical Review, 1949) treated positrons as electrons going backwards in time. Christenson, Cronin, Fitch and Turlay reported CP violation in 1964 (Nobel Prize for Cronin and Fitch, 1980). Andrei Sakharov stated his conditions for a matter–antimatter asymmetry in 1967; Makoto Kobayashi and Toshihide Maskawa showed in 1973 how three families of quarks allow CP violation.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 52 (Symmetry in Physical Laws) — antimatter, the combined mirror of matter and antimatter, broken symmetries, and the twist of the handshake with a distant listener.',
    '*The Character of Physical Law*, lecture 4, "Symmetry in Physical Law".',
    '*QED: The Strange Theory of Light and Matter*, ch. 3 (Electrons and Their Interactions) — a positron as an electron going backwards in time.',
    'R. P. Feynman, "The Theory of Positrons", Physical Review 76 (1949).'
  ],
  sim: ['sym-cp-pion', 'sym-kaon-count']
}

);
