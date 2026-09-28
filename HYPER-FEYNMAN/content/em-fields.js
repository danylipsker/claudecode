/* HYPER-FEYNMAN · content/em-fields.js — Electromagnetism: fields.
 * Topics electrostatics-feyn (FLP II-1 to II-12) and magnetism-induction (FLP II-13 to II-17).
 * Simulations in sims/em-fields.js (prefix emf-). */
Hyper.add(

{
  id: 'em-introduction', parent: 'electrostatics-feyn', title: 'Electromagnetism: the field idea', level: 1,
  short: 'Electric forces are enormously strong and almost perfectly balanced. To describe them, physics gives every point of space an electric and a magnetic field — arrows saying what force a charge would feel there — and four laws saying how the fields are made and how they change.',
  keywords: ['electric field', 'magnetic field', 'Lorentz force', 'Coulomb\'s law', 'superposition', 'field lines', 'equipotentials', 'action at a distance', 'Maxwell\'s equations', 'charge balance', 'Faraday'],
  prereq: ['characteristics-of-force', 'vectors-and-symmetry', 'physics:electric-charge', 'physics:coulombs-law'],
  related: ['vector-calculus-fields', 'gauss-law-feyn', 'gravity-vs-electricity', 'maxwell-equations-feyn', 'relativity-of-fields', 'field-energy-momentum', 'physics:electric-field', 'physics:lorentz-force'],
  body: `
### A force that almost cancels
Every piece of matter is packed with electric charge: a 70 kg person carries about $2.3\\times10^{28}$ protons and just as many electrons. Suppose two people stood an arm's length apart, 0.6 m, and each had one per cent more electrons than protons. The extra charge on each would be $q \\approx 0.01 \\times 2.3\\times10^{28} \\times 1.6\\times10^{-19} \\approx 3.7\\times10^{7}$ C, and Coulomb's law gives a push of

$$F = k\\frac{q^2}{r^2} \\approx 9\\times10^{9}\\times\\frac{(3.7\\times10^{7})^2}{0.36} \\approx 3\\times10^{25}\\ \\mathrm{N}$$

— about half the weight the whole Earth would have if it could be set on a scale at the surface ($6\\times10^{24}$ kg × 9.8 m/s²). Feynman opened volume II with an estimate of just this kind (the numbers here are ours). Electricity is so strong that matter always arranges itself to cancel it almost perfectly; the stiffness of steel, the chemical bond and friction are the small leftovers of that cancellation. Gravity is feeble by comparison ([[gravity-vs-electricity]]).

### A vector at every point
Rather than say that a charge here pulls directly on a charge there, physics says something more useful: charges produce an **electric field** $\\vec E$, moving charges (currents) produce a **magnetic field** $\\vec B$, and a charge $q$ moving with velocity $\\vec v$ feels, wherever it is, the force

$$\\vec F = q\\left(\\vec E + \\vec v \\times \\vec B\\right)$$

Each is a [[?field|vector field]]: an arrow — a [[?vector]] with a direction and a [[?magnitude|length]] — attached to every point of space and free to change in time. The term $\\vec v \\times \\vec B$ is a [[?cross-product]]: the magnetic force is at right angles both to the motion and to $\\vec B$, so it bends paths but never does work. The field of one point charge $Q$ at distance $r$ is $E = kQ/r^2$, pointing away from a positive charge; the fields of several charges **add as vectors** ([[?superposition]]), which is why the field of any arrangement can be worked out.

### Three ways to draw a field
| Picture | What it shows | What it hides |
|---|---|---|
| Arrows on a grid | direction and strength at each point | the pattern between the arrows |
| Field lines | the "flow" of the field: lines start on + and end on −, crowded where the field is strong | superposition — the lines of two charges are not the lines of each drawn together |
| Equipotentials | contours of the potential $\\phi$, like a height map; $\\vec E$ is the downhill slope ([[?gradient]]) and crosses them at right angles | the direction along a contour |

In the simulation, place charges and switch between the three pictures. Drag the probe: its arrow is the force a small positive charge would feel there. Notice that field lines never cross, and that equipotentials crowd together wherever the lines do.

### Why fields and not just forces?
First, **news travels at a finite speed**: if a charge is suddenly moved, a distant charge feels the change only after light has had time to cross the gap, so for a while the force does not point at where the first charge now is — the field carries the message. Second, fields carry **energy and momentum** of their own: sunlight is field that left the Sun eight minutes earlier. Third, the laws of fields are **local**: they tie the field at a point to the field at neighbouring points, through the [[?divergence]] and the [[?curl]] of the next page, [[vector-calculus-fields]].

### All of electromagnetism in four sentences
| Law | In words |
|---|---|
| Gauss | The flux of $\\vec E$ out of a closed surface is the charge inside divided by $\\varepsilon_0$. |
| No magnetic charges | The flux of $\\vec B$ out of any closed surface is zero. |
| Faraday | The circulation of $\\vec E$ round a loop is minus the rate of change of the flux of $\\vec B$ through it. |
| Ampère–Maxwell | $c^2$ times the circulation of $\\vec B$ round a loop is the current through it divided by $\\varepsilon_0$, plus the rate of change of the flux of $\\vec E$ through it. |

With the force law, these are the whole of classical electricity, magnetism and light ([[maxwell-equations-feyn]]).

> [!key] A field is a quantity with a value at every point of space. Charges make the fields, the fields push the charges, and the laws tie the field at each point to the field right next to it.
`,
  ideas: [
    'Electric forces are about 10³⁶ times stronger than gravity between protons; matter is neutral because the positive and negative charges balance almost perfectly.',
    'A charge feels F = q(E + v × B): the fields at its own position decide the force.',
    'The fields of several charges add as vectors (superposition).',
    'Field lines, arrows and equipotentials are three pictures of the same field; E crosses the equipotentials at right angles.',
    'Fields are real: they carry news at the speed of light, and energy and momentum.'
  ],
  pitfalls: [
    'Field lines are the paths charges follow — A charge released at rest starts along the line, but its momentum soon carries it off the line wherever the lines curve.',
    'The magnetic force can speed a charge up — It is always perpendicular to the velocity, so it changes the direction of motion but never the speed.',
    'A field is only a bookkeeping device for forces — With moving charges the force at a distance lags behind the source; the field in between carries energy and momentum.'
  ],
  formulas: [
    {
      name: 'Coulomb\'s law', expr: 'F = ke*q1*q2/r^2', tex: 'F = k\\dfrac{q_1 q_2}{r^2}',
      vars: {
        F: { name: 'force between the charges', q: 'force', unit: 'mN' },
        ke: { const: 'ke' },
        q1: { name: 'first charge', q: 'charge', unit: 'nC', value: 10 },
        q2: { name: 'second charge', q: 'charge', unit: 'nC', value: 10 },
        r: { name: 'distance between them', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'Point charges, or spheres measured between their centres. Like charges repel, unlike charges attract.',
      stories: { F: 'Two small spheres carry {q1} and {q2} and are {r} apart. How hard do they push on each other?', r: 'Two charges of {q1} and {q2} repel each other with {F}. How far apart are they?' }
    },
    {
      name: 'Field of a point charge', expr: 'E = ke*Q/r^2', tex: 'E = k\\dfrac{Q}{r^2}',
      vars: {
        E: { name: 'electric field', q: 'efield', unit: 'V/m' },
        ke: { const: 'ke' },
        Q: { name: 'charge', q: 'charge', unit: 'nC', value: 1 },
        r: { name: 'distance from the charge', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'Points away from a positive charge and towards a negative one. A charge q placed there feels the force qE.',
      stories: { E: 'How strong is the field {r} from a charge of {Q}?', Q: 'The field {r} from a small charged sphere is {E}. What is its charge?' }
    },
    {
      name: 'Two people with one per cent too many electrons', expr: 'F = ke*(f*N*qe)^2/r^2', tex: 'F = k\\dfrac{(f N e)^2}{r^2}',
      vars: {
        F: { name: 'repulsion between the two', q: 'force', unit: 'N' },
        ke: { const: 'ke' },
        f: { name: 'excess of electrons over protons', q: 'ratio', unit: '%', value: 1 },
        N: { name: 'protons in each body', q: 'count', value: 2.3e28 },
        qe: { const: 'qe' },
        r: { name: 'distance between them', q: 'length', unit: 'm', value: 0.6 }
      },
      note: 'Each person treated as a point charge — an order-of-magnitude estimate. A 70 kg body holds about 2.3 × 10²⁸ protons.',
      stories: { F: 'Two people {r} apart each carry an excess of {f} electrons over their {N} protons. How hard do they repel?', f: 'What excess of electrons would make two people {r} apart, each with {N} protons, repel with {F}?' }
    }
  ],
  examples: [
    {
      title: 'The one-per-cent estimate',
      q: 'Two people 0.6 m apart each have 1 % more electrons than their $2.3\\times10^{28}$ protons. Compare their repulsion with the weight the Earth would have at its own surface.',
      steps: [
        'Excess charge on each: $q = 0.01 \\times 2.3\\times10^{28} \\times 1.602\\times10^{-19} = 3.7\\times10^{7}$ C.',
        '$F = kq^2/r^2 = 8.99\\times10^{9} \\times (3.7\\times10^{7})^2 / 0.36 = 3.4\\times10^{25}$ N.',
        'Earth\'s "weight": $M g = 5.97\\times10^{24} \\times 9.8 = 5.9\\times10^{25}$ N — the same order.'
      ],
      a: 'About 3 × 10²⁵ N, comparable to the weight of the whole Earth.'
    },
    {
      title: 'A rubbed balloon',
      q: 'A balloon rubbed on hair carries about 50 nC. What field does it make 20 cm away, and what force does it exert there on a scrap of paper that has taken up 0.1 nC?',
      steps: [
        '$E = kQ/r^2 = 8.99\\times10^{9} \\times 5\\times10^{-8} / 0.04 = 1.1\\times10^{4}$ V/m.',
        '$F = qE = 10^{-10} \\times 1.1\\times10^{4} = 1.1\\times10^{-6}$ N — comparable to the weight of a 0.1 mg scrap ($10^{-6}$ N).'
      ],
      a: 'About 11 kV/m, enough to lift a tiny scrap of paper.'
    },
    {
      title: 'Adding fields',
      q: 'A charge of +2 nC sits at $x = -5$ cm and −2 nC at $x = +5$ cm. Find the field at the midpoint.',
      steps: [
        'Each charge alone: $E = 8.99\\times10^{9} \\times 2\\times10^{-9}/0.05^2 = 7190$ V/m.',
        'The field of the + charge points away from it, towards $+x$; the field of the − charge points towards it, also towards $+x$.',
        'They add: $E = 14\\,380$ V/m along $+x$.'
      ],
      a: 'About 14.4 kV/m, pointing from the positive towards the negative charge.'
    }
  ],
  quiz: [
    { q: 'Why do two people standing side by side feel no electric force on each other?', choices: ['their positive and negative charges balance almost exactly', 'the electric force is weaker than gravity', 'air blocks electric forces', 'magnetic forces cancel the electric ones'], a: 0, why: 'The electric force is enormously strong; it is invisible only because matter is neutral to a fantastic precision.' },
    { q: 'A charge moves parallel to a magnetic field. The magnetic force on it is…', choices: ['zero', 'along the field', 'opposite to its motion', 'at its largest'], a: 0, why: 'v × B vanishes when v and B are parallel.' },
    { q: 'The field lines of two charges together can be drawn by overlaying the field lines of each charge alone.', a: false, why: 'The arrows add, not the lines. The lines of each charge alone would cross each other; the lines of the total field never cross.' },
    { q: 'What is the electric field 30 cm from a 3 nC charge?', answer: 300, unit: 'V/m', why: 'E = kQ/r² = 8.99 × 10⁹ × 3 × 10⁻⁹ / 0.09 ≈ 300 V/m.' },
    { q: 'The magnetic force on a moving charge…', choices: ['changes its direction but not its speed', 'speeds it up', 'slows it down', 'acts along its velocity'], a: 0, why: 'It is perpendicular to the velocity, so it does no work.' }
  ],
  problems: [
    { q: 'What acceleration does a proton get in a field of 1 kV/m? (m = 1.673 × 10⁻²⁷ kg)', answer: 9.58e10, unit: 'm/s²', tol: 0.02, hint: 'a = qE/m.',
      steps: ['$F = eE = 1.602\\times10^{-19} \\times 1000 = 1.60\\times10^{-16}$ N.', '$a = F/m = 1.60\\times10^{-16}/1.673\\times10^{-27} = 9.6\\times10^{10}$ m/s² — ten billion times g.'] },
    { q: 'How far from a 5 nC charge does its field fall to 100 V/m?', answer: 0.67, unit: 'm', tol: 0.02, hint: 'Solve E = kQ/r² for r.',
      steps: ['$r = \\sqrt{kQ/E} = \\sqrt{8.99\\times10^{9} \\times 5\\times10^{-9}/100} = \\sqrt{0.449}$.', '$r = 0.67$ m.'] }
  ],
  applications: [
    'Laser printers and photocopiers place toner with electric fields: a charged drum holds the powder only where light has not discharged it.',
    'Electrostatic precipitators charge smoke particles and pull them onto plates, removing well over 99 % of the dust from a power-station chimney.',
    'Touchscreens sense how a finger changes the electric field between transparent electrodes.',
    'Draw the fields of your own charges and currents in [the field-lines tool](#/tools/fields).'
  ],
  history: 'Charles-Augustin de Coulomb measured the inverse-square law with a torsion balance in 1785. Hans Christian Ørsted found in 1820 that an electric current deflects a compass needle. Michael Faraday pictured "lines of force" filling the space round magnets and charges (1830s–1850s), and James Clerk Maxwell turned that picture into equations in the 1860s, above all in "A Dynamical Theory of the Electromagnetic Field" (1865).',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 1 (Electromagnetism) — the strength and near-perfect balance of electrical forces, E and B defined by the force on a charge, the characteristics of vector fields, the laws of electromagnetism in words, and what the fields are.',
    'Vol. I, ch. 12 (Characteristics of Force) — where fields first appear, for gravitation and electricity.',
    'Vol. II, ch. 18 (The Maxwell Equations) — the four laws collected together.'
  ],
  sim: 'emf-charges'
},

{
  id: 'vector-calculus-fields', parent: 'electrostatics-feyn', title: 'The calculus of vector fields', level: 2,
  short: 'Three operations turn the laws of fields into local statements: the gradient (how fast a quantity climbs, and which way), the divergence (how much a field spreads out of a point) and the curl (how much it swirls round it). Gauss\'s and Stokes\' theorems join them to flows through surfaces and round loops.',
  keywords: ['gradient', 'divergence', 'curl', 'nabla', 'del operator', 'flux', 'circulation', 'Gauss\'s theorem', 'divergence theorem', 'Stokes\' theorem', 'Laplacian', 'heat flow', 'scalar field', 'vector field', 'paddle wheel'],
  prereq: ['em-introduction', 'math:partial-derivatives', 'math:scalar-vector-fields'],
  related: ['gauss-law-feyn', 'electrostatic-analogs', 'magnetostatics-feyn', 'vector-potential', 'flow-of-dry-water', 'math:gradient', 'math:divergence', 'math:curl', 'math:divergence-theorem', 'math:stokes-theorem', 'math:line-integrals', 'math:flux-integrals'],
  body: `
Feynman taught this mathematics not with charges but with something everyone has felt: the **temperature** $T$ at each point of a block of material, a [[?scalar]] field (one number per point), and the **flow of heat** $\\vec h$, a vector field (watts per square metre, pointing the way the heat goes). All of it works the same for $\\vec E$, $\\vec B$ or the velocity of a liquid.

### The gradient: which way is uphill
Take a small step $\\Delta\\vec s$. The temperature changes by $\\frac{\\partial T}{\\partial x}\\Delta x + \\frac{\\partial T}{\\partial y}\\Delta y + \\frac{\\partial T}{\\partial z}\\Delta z$ — each [[?partial-derivative]] is the slope along one axis with the others held fixed. That sum is a [[?dot-product]]:

$$\\Delta T = \\nabla T\\cdot\\Delta\\vec s, \\qquad \\nabla T = \\left(\\frac{\\partial T}{\\partial x},\\ \\frac{\\partial T}{\\partial y},\\ \\frac{\\partial T}{\\partial z}\\right)$$

The vector $\\nabla T$ is the [[?gradient]]. It points the way $T$ climbs fastest, its length is the climb per metre in that direction, and it stands at right angles to the contours, because a step along a contour changes nothing. Heat runs downhill: $\\vec h = -\\kappa\\nabla T$, with $\\kappa$ the thermal conductivity. Read $\\nabla$ ([[?nabla]], "del") as a vector of instructions, $(\\partial/\\partial x,\\ \\partial/\\partial y,\\ \\partial/\\partial z)$: in front of a scalar it makes the gradient, dotted with a vector the divergence, crossed with it the curl.

### The divergence: how much comes out
$$\\nabla\\cdot\\vec h = \\frac{\\partial h_x}{\\partial x} + \\frac{\\partial h_y}{\\partial y} + \\frac{\\partial h_z}{\\partial z}$$

Put a tiny box round a point, add up what flows out through its faces — the [[?flux]] — and divide by the volume of the box. That is the [[?divergence]]. Positive: something inside is making heat (for $\\vec E$: there is positive charge there). Zero: whatever flows in flows out again.

### The curl: how much it swirls
Walk round a tiny square loop adding up the component of the field along each edge — the circulation, a [[?line-integral]] round a closed path ([[?closed-integral]]) — and divide by the area. That is one component of the [[?curl]], $(\\nabla\\times\\vec C)_z = \\partial C_y/\\partial x - \\partial C_x/\\partial y$. If $\\vec C$ were the velocity of a liquid, a tiny paddle wheel there would spin at half the curl. Two surprises wait in the simulation: a flow in straight parallel lines whose speed grows sideways (shear) *has* a curl, and the whirlpool field that falls as $1/r$ round a line has *none*, except on the line itself.

### From tiny boxes to big ones
Stack tiny boxes to fill a volume: every inner face is shared by two boxes, what leaves one enters the other, and only the outer surface is left — [[?gauss-theorem|Gauss's theorem]], $\\oint \\vec C\\cdot\\hat n\\,da = \\int \\nabla\\cdot\\vec C\\,dV$. Tile a surface with tiny loops: inner edges are walked twice in opposite directions and cancel, leaving the rim — [[?stokes-theorem|Stokes' theorem]], $\\oint \\vec C\\cdot d\\vec s = \\int (\\nabla\\times\\vec C)\\cdot\\hat n\\,da$.

| Operation | Acts on → gives | Meaning | Test with |
|---|---|---|---|
| gradient $\\nabla T$ | scalar → vector | uphill direction and slope | contour spacing |
| divergence $\\nabla\\cdot\\vec C$ | vector → scalar | outflow per unit volume | a tiny box |
| curl $\\nabla\\times\\vec C$ | vector → vector | circulation per unit area | a tiny paddle wheel |
| Laplacian $\\nabla^2 T$ | scalar → scalar | how far $T$ sits below the average of its neighbours | curvature of the contours |

For every smooth field, the curl of a gradient is zero and the divergence of a curl is zero. That is why the curl-free electrostatic field can be written $\\vec E = -\\nabla\\phi$ and the divergence-free magnetic field $\\vec B = \\nabla\\times\\vec A$ ([[vector-potential]]); the [[?laplacian]] $\\nabla^2 = \\nabla\\cdot\\nabla$ turns up everywhere ([[electrostatic-analogs]]).
`,
  ideas: [
    'The gradient ∇T points uphill, perpendicular to the contours; its length is the slope.',
    'The divergence ∇·C is the net outflow per unit volume from a tiny box: sources have positive divergence.',
    'The curl ∇×C is the circulation per unit area round a tiny loop: a paddle wheel spins at half of it.',
    'Gauss\'s theorem: total outflow through a closed surface = sum of the divergence inside. Stokes\' theorem: circulation round a loop = flux of the curl through it.',
    'Curl of a gradient = 0 and divergence of a curl = 0; so a curl-free field is a gradient and a divergence-free field is a curl.'
  ],
  pitfalls: [
    'A field with curved lines must have a curl — The 1/r whirlpool round a wire circles but has zero curl away from the wire; a straight shear flow has a curl. The curl is about the tiny paddle wheel, not the shape of the lines.',
    'Zero divergence means the field is zero — It means as much flows in as out; a uniform field or a whirlpool has zero divergence everywhere.',
    '∇ is an ordinary vector — It is an operator: ∇·(fC) is not f∇·C; the derivatives act on everything to their right.'
  ],
  derivation: {
    title: 'Why the divergence is the outflow of a tiny box',
    steps: [
      { text: 'Take a small box with edges $\\Delta x$, $\\Delta y$, $\\Delta z$. Look first at the two faces perpendicular to $x$, each of area $\\Delta y\\,\\Delta z$.' },
      { text: 'Heat leaves through the right face at the rate $h_x(x+\\Delta x)\\,\\Delta y\\,\\Delta z$ and enters through the left face at $h_x(x)\\,\\Delta y\\,\\Delta z$. The net outflow through this pair is the difference, and for a small box the change of $h_x$ across it is its slope times the width:', tex: '\\left[h_x(x+\\Delta x) - h_x(x)\\right]\\Delta y\\,\\Delta z \\approx \\frac{\\partial h_x}{\\partial x}\\,\\Delta x\\,\\Delta y\\,\\Delta z' },
      { text: 'The other two pairs of faces give the same with $y$ and $z$. Add all three pairs; the box volume $\\Delta V = \\Delta x\\,\\Delta y\\,\\Delta z$ comes out as a common factor:', tex: '\\text{outflow} = \\left(\\frac{\\partial h_x}{\\partial x} + \\frac{\\partial h_y}{\\partial y} + \\frac{\\partial h_z}{\\partial z}\\right)\\Delta V = (\\nabla\\cdot\\vec h)\\,\\Delta V' },
      { text: 'Divide by $\\Delta V$: the divergence is the outflow per unit volume. The same bookkeeping on a tiny square loop, using the components along the edges instead of across the faces, gives the curl as the circulation per unit area.' }
    ]
  },
  formulas: [
    {
      name: 'Change along a small step', expr: 'dT = G*ds*cos(theta)', tex: '\\Delta T = G\\,\\Delta s\\cos\\theta',
      vars: {
        dT: { name: 'change of temperature', q: 'dtemp', unit: 'K', signed: true, tex: '\\Delta T' },
        G: { name: 'size of the gradient |∇T|', unit: 'K/m', value: 50 },
        ds: { name: 'length of the step', q: 'length', unit: 'mm', value: 10, tex: '\\Delta s' },
        theta: { name: 'angle between the step and the gradient', q: 'angle', unit: '°', value: 30, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'ΔT = ∇T·Δs for a small step. Along the gradient (θ = 0) the change is largest; along a contour (θ = 90°) it is zero.',
      stories: { dT: 'The temperature gradient in a wall is {G}. How much does T change over a step of {ds} at {theta} to the gradient?', theta: 'The gradient is {G}; a step of {ds} changes T by {dT}. At what angle to the gradient was the step?' }
    },
    {
      name: 'Heat flows down the gradient (Fourier\'s law)', expr: 'h = kappa*G', tex: 'h = \\kappa G',
      vars: {
        h: { name: 'heat flow per unit area', q: 'intensity', unit: 'W/m²' },
        kappa: { name: 'thermal conductivity', q: 'thermcond', unit: 'W/(m·K)', value: 0.8, tex: '\\kappa' },
        G: { name: 'size of the temperature gradient |∇T|', unit: 'K/m', value: 50 }
      },
      note: 'In vector form h = −κ∇T: the heat flows straight downhill, across the isotherms.',
      stories: { h: 'Brick with conductivity {kappa} has a temperature gradient of {G}. How much heat crosses each square metre per second?', G: 'A heat flow of {h} passes through material of conductivity {kappa}. How steep is the temperature gradient?' }
    },
    {
      name: 'Circulation of a rigidly rotating liquid (Stokes)', expr: 'Gamma = 2*omega*pi*R^2', tex: '\\Gamma = \\oint \\vec v\\cdot d\\vec s = 2\\omega\\,\\pi R^2',
      vars: {
        Gamma: { name: 'circulation round the circle', unit: 'm²/s', tex: '\\Gamma' },
        omega: { name: 'angular velocity of the liquid', q: 'angvel', unit: 'rad/s', value: 2, tex: '\\omega' },
        R: { name: 'radius of the circle', q: 'length', unit: 'm', value: 0.1 }
      },
      note: 'Rigid rotation has curl 2ω everywhere; Stokes\' theorem says the circulation is the curl times the area enclosed.',
      stories: { Gamma: 'A tank of water turns like a solid at {omega}. What is the circulation round a circle of radius {R}?', omega: 'The circulation round a circle of radius {R} in a rigidly turning liquid is {Gamma}. How fast is it turning?' }
    }
  ],
  examples: [
    {
      title: 'A temperature slope',
      q: 'In a wall the temperature is $T = 290 + 20x - 10y$ K, with $x$ and $y$ in metres. Find the gradient, its size, and the heat flow if $\\kappa = 0.8$ W/(m·K).',
      steps: [
        '$\\partial T/\\partial x = 20$ K/m and $\\partial T/\\partial y = -10$ K/m, so $\\nabla T = (20,\\ -10)$ K/m.',
        '$|\\nabla T| = \\sqrt{20^2 + 10^2} = 22.4$ K/m.',
        'Heat flows downhill: $\\vec h = -\\kappa\\nabla T = (-16,\\ 8)$ W/m², of size 17.9 W/m².'
      ],
      a: '∇T = (20, −10) K/m, 22.4 K/m in size; the heat flow is 17.9 W/m², towards −x and +y.'
    },
    {
      title: 'Divergence and curl of two flows',
      q: 'Find the divergence and the curl of the spreading flow $\\vec v = a(x,\\ y)$ and of the rigid rotation $\\vec v = \\omega(-y,\\ x)$.',
      steps: [
        'Spreading: $\\nabla\\cdot\\vec v = a + a = 2a$; curl $= \\partial(ay)/\\partial x - \\partial(ax)/\\partial y = 0$.',
        'Rotation: $\\nabla\\cdot\\vec v = \\partial(-\\omega y)/\\partial x + \\partial(\\omega x)/\\partial y = 0$; curl $= \\omega - (-\\omega) = 2\\omega$.',
        'A paddle wheel in the rotating flow turns at $\\omega$ — half the curl — exactly as the liquid itself does.'
      ],
      a: 'Spreading: divergence 2a, no curl. Rotation: no divergence, curl 2ω.'
    },
    {
      title: 'Stokes in a rotating tank',
      q: 'Water in a tank turns like a solid at 2 rad/s. Find the circulation round a circle of radius 10 cm directly, and check it with Stokes\' theorem.',
      steps: [
        'On the circle the speed is $v = \\omega R = 0.2$ m/s, along the circle, so $\\oint\\vec v\\cdot d\\vec s = v \\cdot 2\\pi R = 0.2 \\times 0.628 = 0.126$ m²/s.',
        'The curl is $2\\omega = 4$ s⁻¹ everywhere; times the area $\\pi R^2 = 0.0314$ m² it gives 0.126 m²/s — the same.'
      ],
      a: '0.126 m²/s, both ways.'
    }
  ],
  quiz: [
    { q: 'At a point on an isotherm, the gradient of the temperature is…', choices: ['perpendicular to the isotherm', 'along the isotherm', 'zero', 'in the direction the heat flows'], a: 0, why: 'A step along the isotherm does not change T, so ∇T has no component along it. Heat flows opposite to the gradient.' },
    { q: 'Water flows in straight parallel lines, faster at the top than at the bottom (shear). A tiny paddle wheel placed in it…', choices: ['turns: the flow has a curl', 'stays still: the lines are straight', 'turns only if the flow spreads out', 'moves sideways without turning'], a: 0, why: 'The top of the wheel is pushed harder than the bottom, so it spins: (∇×v)_z = −∂v_x/∂y ≠ 0.' },
    { q: 'The curl of the gradient of any smooth scalar field is zero.', a: true, why: 'Going round a closed loop you come back to the same height, so the circulation of ∇T round every loop is zero.' },
    { q: 'What is the divergence of $\\vec C = (x^2,\\ 3y,\\ 0)$?', answer: '2*x + 3', vars: ['x'], why: '∂(x²)/∂x + ∂(3y)/∂y + 0 = 2x + 3.' },
    { q: 'Gauss\'s theorem says that the flux of a field out of a closed surface equals…', choices: ['the volume integral of its divergence inside', 'the line integral of the field round the edge', 'the curl at the centre times the area', 'zero for every field'], a: 0, why: 'Inner faces of the tiny boxes cancel; the sum of their outflows is the outflow of the whole.' }
  ],
  problems: [
    { q: 'The temperature in a slab rises 30 K/m towards the east and 40 K/m towards the north. Its conductivity is 0.5 W/(m·K). How much heat crosses each square metre per second?', answer: 25, unit: 'W/m²', tol: 0.02, hint: 'Find the size of the gradient first.',
      steps: ['$|\\nabla T| = \\sqrt{30^2 + 40^2} = 50$ K/m.', '$h = \\kappa|\\nabla T| = 0.5 \\times 50 = 25$ W/m², flowing towards the south-west.'] },
    { q: 'A flow has a uniform curl of 3 s⁻¹. What is its circulation round a circle of radius 0.2 m?', answer: 0.377, unit: 'm²/s', tol: 0.02, hint: 'Stokes: circulation = curl × area.',
      steps: ['Area $\\pi R^2 = \\pi \\times 0.04 = 0.126$ m².', 'Circulation $= 3 \\times 0.126 = 0.377$ m²/s.'] }
  ],
  applications: [
    'Insulation and heat sinks are designed with Fourier\'s law: heat flows down the temperature gradient.',
    'Finite-volume solvers for fluids and fields balance the fluxes through millions of tiny cells — Gauss\'s theorem applied cell by cell.',
    'Weather models track the divergence of the wind: where low-level air converges it must rise, which builds clouds.'
  ],
  history: 'The notation grew out of William Rowan Hamilton\'s quaternions (1840s). In the 1880s Josiah Willard Gibbs and Oliver Heaviside independently cut the quaternion apparatus down to the vector analysis used today, Heaviside largely to write Maxwell\'s equations compactly. The divergence theorem was proved in general by Mikhail Ostrogradsky (1826); Stokes\' theorem first appeared in a letter from William Thomson (Lord Kelvin) to George Stokes in 1850, and Stokes set it as a question in the Cambridge Smith\'s Prize examination of 1854.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 2 (Differential Calculus of Vector Fields) — temperature and heat flow, the gradient, ∇ as an operator, divergence and curl, second derivatives of vector fields.',
    'Vol. II, ch. 3 (Vector Integral Calculus) — line integrals, the flux of a vector field, Gauss\'s theorem, heat conduction, circulation, Stokes\' theorem, curl-free and divergence-free fields.',
    'Vol. I, ch. 11 (Vectors) — vectors, and why laws written with them hold in every orientation.'
  ],
  sim: 'emf-vector-lab'
},

{
  id: 'gauss-law-feyn', parent: 'electrostatics-feyn', title: 'Gauss\'s law and electrostatics', level: 2,
  short: 'The flux of the electric field out of any closed surface equals the charge inside divided by ε₀ — whatever the shape of the surface and wherever the charges sit. It gives the fields of spheres, wires and sheets almost for free, explains why conductors hide their insides, and forbids any charge from resting in stable equilibrium.',
  keywords: ['Gauss\'s law', 'electric flux', 'Coulomb\'s law', 'divergence of E', 'Gaussian surface', 'conductor', 'Faraday cage', 'Earnshaw\'s theorem', 'line charge', 'sheet of charge', 'inverse square law', 'Cavendish'],
  prereq: ['em-introduction', 'vector-calculus-fields', 'physics:gauss-law'],
  related: ['electrostatic-energy-feyn', 'atmospheric-electricity', 'dielectrics-feyn', 'electrostatic-analogs', 'least-action-fields', 'physics:electric-potential', 'math:divergence-theorem', 'math:flux-integrals'],
  body: `
### From Coulomb's law to flux
The field of a point charge falls as $1/r^2$, while the area of a sphere round it grows as $r^2$. So the [[?flux]] of $\\vec E$ through any sphere centred on the charge — field times area — is the same:

$$E\\cdot 4\\pi r^2 = \\frac{q}{4\\pi\\varepsilon_0 r^2}\\cdot 4\\pi r^2 = \\frac{q}{\\varepsilon_0}$$

Now dent the sphere into any shape. Each patch of the new surface sees the charge through the same narrow cone as some patch of the sphere. If it is farther away, the field is weaker by the square of the distance but the patch is larger by the same factor; if it is tilted, only the component of $\\vec E$ along its normal $\\hat n$ counts, which cancels the extra area of the tilt. The flux through every cone is unchanged. A charge **outside** the surface contributes nothing: each cone from it enters the surface and leaves it again, and the two fluxes cancel. With [[?superposition]], for any charges:

$$\\oint_S \\vec E\\cdot\\hat n\\,da = \\frac{Q_{\\text{inside}}}{\\varepsilon_0}$$

By [[?gauss-theorem|Gauss's theorem]] the flux out of a tiny box is the [[?divergence]] times its volume, so point by point the same law reads $\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0$. Add that static fields do not swirl, $\\nabla\\times\\vec E = 0$, so that $\\vec E = -\\nabla\\phi$, and you have the whole of electrostatics in two equations.

> [!tip] In the simulation the charges are long rods seen end-on, so the picture is exactly two-dimensional and the flux per metre of rod through your curve is $\\lambda_{\\text{inside}}/\\varepsilon_0$. Stretch and dent the curve: the counter does not move. Drag it across a rod: it jumps. For a rod outside, the red inward arrows along the curve cancel the green outward ones.

### Fields for free
With symmetry, Gauss's law gives the field in one line: choose a surface on which $E$ is constant and perpendicular.

| Charge | Surface | Field |
|---|---|---|
| point, or outside a spherical ball | sphere of radius $r$ | $Q/4\\pi\\varepsilon_0 r^2$ |
| inside a uniform ball of radius $R$ | sphere $r < R$ | $Qr/4\\pi\\varepsilon_0 R^3$ |
| inside a charged spherical shell | sphere | 0 |
| long line, $\\lambda$ per metre | coaxial cylinder | $\\lambda/2\\pi\\varepsilon_0 r$ |
| large sheet, $\\sigma$ per square metre | pillbox through it | $\\sigma/2\\varepsilon_0$ on each side |
| just outside a conductor | pillbox half inside | $\\sigma/\\varepsilon_0$ |

### Conductors
Charges in a conductor move freely, so in equilibrium the field inside must vanish — otherwise they would still be moving. Gauss's law on tiny boxes inside then says there is no charge inside: it all sits on the surface, and the field just outside is perpendicular to it, of strength $\\sigma/\\varepsilon_0$. An empty cavity in a conductor has no field at all, however strong the fields outside: the Faraday cage, and the reason a car is a fairly safe place in a thunderstorm.

### No resting place
Could a charge rest in stable equilibrium among fixed charges? The field would have to push it back from every side — point inward all round a small sphere. That is an inward flux with no charge inside to account for it. So no static arrangement of charges can hold a charge stably (Earnshaw, 1842): atoms cannot be charges sitting still, and in the end it takes quantum mechanics to explain why they are stable ([[hydrogen-and-periodic-table]]).

### How exact is the inverse square?
Gauss's law, and the empty field inside a charged shell, need the force to fall *exactly* as $1/r^2$. So a charged shell is a superb test: look for any field inside. Henry Cavendish (1773) found the exponent to be 2 within about 1/50; in 1971 Williams, Faller and Hill showed that any departure from 2 is below about $10^{-15}$.
`,
  ideas: [
    'The flux of E out of any closed surface is Q_inside/ε₀, whatever the surface\'s shape.',
    'Charges outside the surface give zero net flux: whatever enters leaves again.',
    'Point by point, ∇·E = ρ/ε₀; with ∇×E = 0 (so E = −∇φ) this is all of electrostatics.',
    'In a conductor at rest the field inside is zero, the charge lives on the surface, and just outside E = σ/ε₀, perpendicular to it.',
    'No static arrangement of charges can hold another charge in stable equilibrium (Earnshaw\'s theorem).'
  ],
  pitfalls: [
    'Gauss\'s law only holds for symmetric charges — It holds for every closed surface and every distribution of charge; symmetry is needed only to turn it into a formula for E.',
    'Zero flux means zero field on the surface — A charge outside makes a field all over the surface; its inward and outward fluxes simply cancel.',
    'A metal box shields its inside because the metal soaks up the field — The surface charges rearrange until their own field exactly cancels the outside field inside the metal and in any empty cavity.'
  ],
  formulas: [
    {
      name: 'Gauss\'s law', expr: 'Phi = Q/eps0', tex: '\\Phi_E = \\oint \\vec E\\cdot\\hat n\\,da = \\dfrac{Q}{\\varepsilon_0}',
      vars: {
        Phi: { name: 'flux of E out of the closed surface', q: 'eflux', unit: 'V·m', signed: true, tex: '\\Phi_E' },
        Q: { name: 'charge inside the surface', q: 'charge', unit: 'nC', value: 1, signed: true },
        eps0: { const: 'eps0' }
      },
      note: 'Any closed surface. Charges outside do not count.',
      stories: { Phi: 'A closed surface surrounds {Q}. What is the flux of E out of it?', Q: 'The flux of E out of a closed box is {Phi}. How much charge is inside?' }
    },
    {
      name: 'Field of a long line of charge', expr: 'E = lambda/(2*pi*eps0*r)', tex: 'E = \\dfrac{\\lambda}{2\\pi\\varepsilon_0 r}',
      vars: {
        E: { name: 'electric field', q: 'efield', unit: 'V/m' },
        lambda: { name: 'charge per unit length', q: 'linecharge', unit: 'nC/m', value: 10, tex: '\\lambda' },
        eps0: { const: 'eps0' },
        r: { name: 'distance from the line', q: 'length', unit: 'cm', value: 5 }
      },
      note: 'From a coaxial cylinder: flux E·2πrL = λL/ε₀. Falls as 1/r, not 1/r².',
      stories: { E: 'A long wire carries {lambda}. What is the field {r} from it?', r: 'How far from a long line of {lambda} is the field {E}?' }
    },
    {
      name: 'Field of a large sheet of charge', expr: 'E = sigma/(2*eps0)', tex: 'E = \\dfrac{\\sigma}{2\\varepsilon_0}',
      vars: {
        E: { name: 'electric field on each side', q: 'efield', unit: 'kV/m' },
        sigma: { name: 'charge per unit area', q: 'surfacecharge', unit: 'µC/m²', value: 1, tex: '\\sigma' },
        eps0: { const: 'eps0' }
      },
      note: 'The same at every distance, as long as the sheet looks infinite. Half the flux goes out of each face of the pillbox.',
      stories: { E: 'A large plastic sheet carries {sigma}. What field does it make near it?', sigma: 'Near a large charged sheet the field is {E}. What is its charge per square metre?' }
    },
    {
      name: 'Field just outside a conductor', expr: 'E = sigma/eps0', tex: 'E = \\dfrac{\\sigma}{\\varepsilon_0}',
      vars: {
        E: { name: 'field at the surface', q: 'efield', unit: 'MV/m' },
        sigma: { name: 'surface charge density', q: 'surfacecharge', unit: 'µC/m²', value: 10, tex: '\\sigma' },
        eps0: { const: 'eps0' }
      },
      note: 'All the flux leaves through the outer face of the pillbox, since there is no field inside the metal. Dry air breaks down near 3 MV/m.',
      stories: { E: 'A metal dome carries {sigma} on its surface. What is the field just outside?', sigma: 'Air breaks down at {E}. How much charge per square metre can a metal surface hold?' }
    }
  ],
  examples: [
    {
      title: 'How much charge a dome can hold',
      q: 'The dome of a Van de Graaff generator is a sphere of radius 0.2 m. Air breaks down at about 3 MV/m. How much charge can it hold, and at what voltage?',
      steps: [
        'Outside a sphere $E = Q/4\\pi\\varepsilon_0 R^2$, so $Q = 4\\pi\\varepsilon_0 R^2 E = 4\\pi \\times 8.85\\times10^{-12} \\times 0.04 \\times 3\\times10^{6} = 1.3\\times10^{-5}$ C.',
        'The potential of the sphere is $V = Q/4\\pi\\varepsilon_0 R = ER = 3\\times10^{6} \\times 0.2 = 6\\times10^{5}$ V.'
      ],
      a: 'About 13 µC, at about 600 kV. A bigger dome holds more.'
    },
    {
      title: 'Inside and outside a charged ball',
      q: 'A ball of radius 5 cm carries 10 nC spread uniformly through its volume. Find the field at 2.5 cm, 5 cm and 10 cm from its centre.',
      steps: [
        'Inside, only the charge within radius $r$ counts, $Q r^3/R^3$: $E = kQr/R^3 = 8.99\\times10^{9} \\times 10^{-8} \\times 0.025 / 1.25\\times10^{-4} = 18$ kV/m.',
        'At the surface: $E = kQ/R^2 = 8.99\\times10^{9} \\times 10^{-8}/0.0025 = 36$ kV/m.',
        'At 10 cm: $E = kQ/r^2 = 9.0$ kV/m. The field rises linearly inside and falls as $1/r^2$ outside.'
      ],
      a: '18, 36 and 9 kV/m.'
    },
    {
      title: 'Two sheets make a capacitor',
      q: 'Two large parallel sheets carry +1 µC/m² and −1 µC/m². Find the field between them and outside.',
      steps: [
        'Each sheet alone makes $\\sigma/2\\varepsilon_0 = 56.5$ kV/m on each side, pointing away from the positive sheet and towards the negative one.',
        'Between the sheets both fields point the same way: $113$ kV/m. Outside they point opposite ways and cancel.'
      ],
      a: 'σ/ε₀ = 113 kV/m between the sheets, zero outside.'
    }
  ],
  quiz: [
    { q: 'A closed surface surrounds +3 nC and −3 nC. The flux of E out of it is…', choices: ['zero', '6 nC/ε₀', '3 nC/ε₀', 'impossible to say without knowing the shape'], a: 0, why: 'Only the total charge inside counts, and it is zero. The field on the surface is not zero, but its flux is.' },
    { q: 'The radius of a Gaussian sphere round a point charge is doubled. The flux through it…', choices: ['stays the same', 'doubles', 'falls to a quarter', 'quadruples'], a: 0, why: 'The field falls to a quarter while the area grows four times.' },
    { q: 'Gauss\'s law tells us the field at each point of a closed surface from the charge inside it.', a: false, why: 'It fixes only the total flux. The field at each point depends on all the charges, inside and outside; only symmetry lets you find E from the flux.' },
    { q: 'Inside an empty cavity in a charged metal block, the electric field is…', choices: ['zero', 'the same as outside the block', 'σ/ε₀', 'strongest near the walls'], a: 0, why: 'The field is zero in the metal, so the flux through any surface in the metal round the cavity is zero; with no charge in the cavity, no field lines can start or end there.' },
    { q: 'What is the flux of E out of a closed surface that encloses 1 µC?', answer: 1.13e5, unit: 'V·m', why: 'Φ = Q/ε₀ = 10⁻⁶/8.85 × 10⁻¹² ≈ 1.13 × 10⁵ V·m.' }
  ],
  problems: [
    { q: 'A large charged sheet makes a field of 1000 V/m on each side. What is its surface charge density?', answer: 17.7, unit: 'nC/m²', tol: 0.02, hint: 'E = σ/2ε₀.',
      steps: ['$\\sigma = 2\\varepsilon_0 E = 2 \\times 8.854\\times10^{-12} \\times 1000 = 1.77\\times10^{-8}$ C/m².', 'That is 17.7 nC/m².'] },
    { q: 'What is the field 2 m from a long straight line carrying 1 µC per metre?', answer: 8990, unit: 'V/m', tol: 0.02, hint: 'E = λ/2πε₀r.',
      steps: ['$E = 10^{-6}/(2\\pi \\times 8.854\\times10^{-12} \\times 2) = 8.99\\times10^{3}$ V/m.'] }
  ],
  applications: [
    'Coaxial cables and screened rooms rely on a closed conductor keeping outside fields out.',
    'A Van de Graaff generator carries charge into a hollow dome; the charge moves to the outer surface, so more can always be brought in, up to hundreds of kilovolts.',
    'Lightning rods and corona discharge: the field σ/ε₀ is strongest where a conductor curves most sharply, because charge crowds onto points.'
  ],
  history: 'The law bears the name of Carl Friedrich Gauss, who used it in his work on forces that fall as the inverse square of distance in the 1830s and 1840s. Henry Cavendish tested the inverse-square law in 1773 by looking for charge on a sphere inside a charged shell, but never published it; James Clerk Maxwell edited his papers in 1879 and repeated the experiment more precisely. Samuel Earnshaw proved in 1842 that inverse-square forces alone cannot hold a charge in stable equilibrium.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 4 (Electrostatics) — Coulomb\'s law and superposition, the electric potential and E = −∇φ, the flux of E, Gauss\'s law and the divergence of E, the field of a charged sphere, field lines and equipotentials.',
    'Vol. II, ch. 5 (Application of Gauss\' Law) — why a charge cannot rest in stable equilibrium, the fields of lines, sheets and spheres, conductors and cavities, and how accurately the inverse-square law is known.',
    'Vol. II, ch. 6 and 7 (The Electric Field in Various Circumstances) — dipoles, charged conductors, the method of images and other fields worked out in detail.'
  ],
  sim: ['emf-gauss', 'emf-charges']
},

{
  id: 'electrostatic-energy-feyn', parent: 'electrostatics-feyn', title: 'Electrostatic energy', level: 2,
  short: 'Assembling charges costs work, and the work is stored: ½CV² in a capacitor, three-fifths of Q²/4πε₀R in a charged ball. The same energy can be counted as ½ε₀E² in every cubic metre of field — and from the energy alone follow the forces, by virtual work.',
  keywords: ['electrostatic energy', 'capacitor', 'capacitance', 'energy density', 'virtual work', 'force between plates', 'ionic crystal', 'Madelung', 'nuclear energy', 'fission', 'classical electron radius', 'self-energy'],
  prereq: ['gauss-law-feyn', 'work-and-potential-energy', 'physics:capacitance'],
  related: ['field-energy-momentum', 'electromagnetic-mass', 'dielectrics-feyn', 'atmospheric-electricity', 'conservation-of-energy', 'physics:energy-in-capacitor', 'physics:capacitors-combinations'],
  body: `
### The work of assembling charges
Bringing charges $q_1$ and $q_2$ together from far apart to a distance $r_{12}$ takes the work $q_1q_2/4\\pi\\varepsilon_0 r_{12}$ against their push. For many charges the energy is the [[?sum]] over every pair, each pair once:

$$U = \\sum_{\\text{pairs}} \\frac{q_i q_j}{4\\pi\\varepsilon_0 r_{ij}} = \\frac12\\sum_i q_i\\,\\phi_i$$

where $\\phi_i$ is the potential at charge $i$ due to all the others; the ½ stops each pair being counted twice. For charge spread smoothly the sum becomes an [[?integral]], $U = \\frac12\\int\\rho\\,\\phi\\,dV$. Building a uniformly charged ball of radius $R$ shell by shell gives $U = \\frac35\\,Q^2/4\\pi\\varepsilon_0 R$.

### Capacitors and the force on a plate
A capacitor is two conductors carrying $+Q$ and $-Q$ with a potential difference $V = Q/C$. Carrying a little charge $dq$ across $V$ costs $V\\,dq$, so charging it from nothing costs

$$U = \\tfrac12 QV = \\tfrac12 CV^2 = \\frac{Q^2}{2C}$$

The force between the plates follows from energy alone — the principle of **virtual work**. Pull an isolated capacitor's plates apart by $\\Delta x$: its charge cannot change, $C = \\varepsilon_0 A/d$ falls, $U = Q^2/2C$ rises, and your work must equal the rise. So $F = Q^2/2\\varepsilon_0 A$: the charge times **half** the field between the plates, because each plate feels only the field of the other.

In the simulation, pull the plates apart with the charge fixed: the stored energy rises by exactly the work of your hand. Connect the battery and do it again: now the stored energy *falls*, charge flows back into the battery, and the battery receives twice the energy you put in.

### The energy is in the field
The same energy can be written with no charges at all:

$$U = \\int \\frac{\\varepsilon_0}{2}E^2\\,dV$$

as if every cubic metre where there is a field held $u = \\frac12\\varepsilon_0 E^2$ joules. Between capacitor plates $E = V/d$ fills the volume $Ad$, and $\\frac12\\varepsilon_0E^2\\cdot Ad = \\frac12 CV^2$ — the same number. For static charges the two ways of counting cannot be told apart; when fields change and radiate, only the field picture keeps energy conserved from place to place ([[field-energy-momentum]]).

| Where | Field | $u = \\frac12\\varepsilon_0E^2$ |
|---|---|---|
| fair-weather air | 100 V/m | $4\\times10^{-8}$ J/m³ |
| 1 kV across a 1 mm gap | 1 MV/m | 4.4 J/m³ |
| air at breakdown | 3 MV/m | 40 J/m³ |
| hydrogen atom, at the Bohr radius | $5\\times10^{11}$ V/m | $10^{12}$ J/m³ |

For comparison, petrol stores about $3\\times10^{10}$ J/m³ — as chemical energy, which is itself electrostatic energy on the scale of atoms.

### Crystals and nuclei
In rock salt each Na⁺ sits among Cl⁻ ions; summing all the pairs gives $-1.748\\,e^2/4\\pi\\varepsilon_0 a$ per ion pair, with $a = 0.281$ nm: about −9.0 eV. The measured binding, about 8.2 eV, is a little less because the ions also repel at close range. In a uranium nucleus, a ball of 92 protons with a radius of about 7.4 fm, $\\frac35 Q^2/4\\pi\\varepsilon_0 R \\approx 1$ GeV. Split it into two smaller balls and about 370 MeV of that is released; after paying for the larger surface of two nuclei, some 200 MeV remains — the energy of fission.

### A point charge is trouble
The energy of a ball grows as $1/R$: for a true point it is infinite. If an electron's rest energy $mc^2$ were all electrostatic, its radius would be of the order of $e^2/4\\pi\\varepsilon_0mc^2 = 2.8\\times10^{-15}$ m, the "classical electron radius". Classical physics never cured this; Feynman came back to it in [[electromagnetic-mass]].
`,
  ideas: [
    'The energy of charges is the sum over pairs of q_i q_j/4πε₀r_ij — the work needed to assemble them.',
    'A capacitor stores U = ½QV = ½CV² = Q²/2C.',
    'The same energy is ½ε₀E² per cubic metre, summed over all the space where there is a field.',
    'Forces follow from energy by virtual work: F = −dU/dx at fixed charge; each plate feels half the field between the plates.',
    'The energy of a point charge is infinite — a classical difficulty that never went away.'
  ],
  pitfalls: [
    'A capacitor stores charge — It stores energy; its total charge is zero (+Q on one plate, −Q on the other).',
    'The force on a capacitor plate is Q times the field between the plates — It is Q times half that field: a plate does not push on itself.',
    'Pulling the plates apart always adds energy to the capacitor — At fixed voltage the stored energy falls; the battery takes back charge and absorbs both your work and the energy released.'
  ],
  formulas: [
    {
      name: 'Parallel-plate capacitor', expr: 'C = eps0*A/d', tex: 'C = \\dfrac{\\varepsilon_0 A}{d}',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'pF' },
        eps0: { const: 'eps0' },
        A: { name: 'area of each plate', q: 'area', unit: 'cm²', value: 100 },
        d: { name: 'gap between the plates', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'Plates large compared with the gap; vacuum or air between them.',
      stories: { C: 'Two plates of {A} face each other {d} apart. What is their capacitance?', d: 'How close must plates of {A} be to make a {C} capacitor?' }
    },
    {
      name: 'Energy stored in a capacitor', expr: 'U = C*V^2/2', tex: 'U = \\tfrac12 C V^2',
      vars: {
        U: { name: 'stored energy', q: 'energy', unit: 'J' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 150 },
        V: { name: 'voltage', q: 'voltage', unit: 'V', value: 330 }
      },
      note: 'Equivalently ½QV or Q²/2C.',
      stories: { U: 'A camera flash charges {C} to {V}. How much energy does the flash tube get?', V: 'To what voltage must {C} be charged to store {U}?' }
    },
    {
      name: 'Energy density of the electric field', expr: 'u = eps0*E^2/2', tex: 'u = \\tfrac12\\varepsilon_0 E^2',
      vars: {
        u: { name: 'energy per unit volume', q: 'energydensity', unit: 'J/m³' },
        eps0: { const: 'eps0' },
        E: { name: 'electric field', q: 'efield', unit: 'MV/m', value: 3 }
      },
      note: 'In vacuum or air. Integrated over all space it gives the total electrostatic energy.',
      stories: { u: 'How much energy does each cubic metre of air hold in a field of {E}?', E: 'What field stores {u}?' }
    },
    {
      name: 'Energy of a uniformly charged ball', expr: 'U = 3*ke*Q^2/(5*R)', tex: 'U = \\dfrac35\\,\\dfrac{k Q^2}{R}',
      vars: {
        U: { name: 'electrostatic energy', q: 'energy', unit: 'MeV' },
        ke: { const: 'ke' },
        Q: { name: 'charge', q: 'charge', unit: 'e', value: 92 },
        R: { name: 'radius', q: 'length', unit: 'fm', value: 7.4 }
      },
      note: 'Charge spread evenly through the volume. The default is a uranium nucleus.',
      stories: { U: 'Treat a nucleus as a ball of radius {R} carrying {Q}. What is its electrostatic energy?', R: 'A ball carrying {Q} has an electrostatic energy of {U}. What is its radius?' }
    }
  ],
  examples: [
    {
      title: 'A small capacitor, three ways',
      q: 'Plates of 10 cm × 10 cm, 1 mm apart, are charged to 1 kV. Find C, the energy, the energy density, and the force between the plates.',
      steps: [
        '$C = \\varepsilon_0A/d = 8.85\\times10^{-12} \\times 0.01/0.001 = 88.5$ pF; $Q = CV = 88.5$ nC.',
        '$U = \\frac12CV^2 = 0.5 \\times 88.5\\times10^{-12} \\times 10^{6} = 44$ µJ.',
        '$E = V/d = 10^{6}$ V/m, $u = \\frac12\\varepsilon_0E^2 = 4.43$ J/m³; times the volume $10^{-5}$ m³ gives 44 µJ again.',
        '$F = Q^2/2\\varepsilon_0A = (88.5\\times10^{-9})^2/(2 \\times 8.85\\times10^{-12} \\times 0.01) = 0.044$ N.'
      ],
      a: '88.5 pF, 44 µJ, 4.4 J/m³ and 0.044 N (about the weight of 4.5 g).'
    },
    {
      title: 'Pulling the plates apart',
      q: 'The capacitor above is pulled from 1 mm to 2 mm, first isolated, then connected to its 1 kV battery. Account for the energy.',
      steps: [
        'Isolated: $Q$ stays 88.5 nC, $C$ halves, so $U = Q^2/2C$ doubles from 44 to 88 µJ. The hand does $F\\Delta x = 0.044 \\times 0.001 = 44$ µJ — exactly the increase.',
        'At fixed 1 kV: $C$ halves, $U = \\frac12CV^2$ falls from 44 to 22 µJ, and a charge of 44 nC flows back into the battery, which gains $V\\Delta Q = 44$ µJ.',
        'The hand now does only 22 µJ (the force weakens as the gap grows): 22 µJ from the hand + 22 µJ from the field = 44 µJ into the battery.'
      ],
      a: 'Isolated: +44 µJ stored, all from the hand. Connected: 22 µJ from the hand and 22 µJ from the field go into the battery.'
    },
    {
      title: 'A camera flash',
      q: 'A flash charges 150 µF to 330 V and empties it through the tube in about 1 ms. What energy and average power?',
      steps: ['$U = \\frac12CV^2 = 0.5 \\times 150\\times10^{-6} \\times 330^2 = 8.2$ J.', 'Average power $8.2/0.001 \\approx 8$ kW, from a small battery that took several seconds to charge the capacitor.'],
      a: '8.2 J, delivered at about 8 kW.'
    }
  ],
  quiz: [
    { q: 'Doubling the electric field in a region multiplies the energy stored there by…', choices: ['4', '2', '√2', '8'], a: 0, why: 'u = ½ε₀E² goes as the square of the field.' },
    { q: 'You pull apart the plates of an isolated charged capacitor. Its stored energy…', choices: ['increases by the work you do', 'decreases', 'stays the same', 'increases by more than the work you do'], a: 0, why: 'Q is fixed, C falls, U = Q²/2C rises; nothing else can supply or take energy.' },
    { q: 'A battery holds the voltage fixed while you pull the plates apart. Where does your work go?', choices: ['into the battery, together with energy released from the field', 'into the field, which gains energy', 'into heating the plates', 'nowhere: no work is needed'], a: 0, why: 'C falls, so U = ½CV² falls and charge flows back into the battery, which takes both.' },
    { q: 'The force on one plate of a capacitor is its charge times the full field between the plates.', a: false, why: 'A plate does not push on itself: it sits in the other plate\'s field, σ/2ε₀ — half the field between the plates.' },
    { q: 'What is the energy density of the fair-weather field of 100 V/m?', answer: 4.43e-8, unit: 'J/m³', why: 'u = ½ × 8.85 × 10⁻¹² × 100² = 4.4 × 10⁻⁸ J/m³.' }
  ],
  problems: [
    { q: 'How much energy does a 1 µF capacitor hold at 100 V?', answer: 5, unit: 'mJ', tol: 0.02, hint: 'U = ½CV².',
      steps: ['$U = 0.5 \\times 10^{-6} \\times 100^2 = 5\\times10^{-3}$ J = 5 mJ.'] },
    { q: 'What electric field stores 1 J in each cubic metre of air?', answer: 475, unit: 'kV/m', tol: 0.02, hint: 'Solve u = ½ε₀E² for E.',
      steps: ['$E = \\sqrt{2u/\\varepsilon_0} = \\sqrt{2/8.854\\times10^{-12}} = 4.75\\times10^{5}$ V/m.', 'About 475 kV/m — a sixth of the breakdown field of air.'] }
  ],
  applications: [
    'Camera flashes, defibrillators and pulsed lasers store energy in capacitors and release it in milliseconds.',
    'Electrostatic actuators in MEMS devices and electrostatic loudspeakers work by the force between charged plates.',
    'The energy of nuclear fission is mostly the electrostatic energy of protons packed into a nucleus.'
  ],
  history: 'The first capacitors were Leyden jars, glass jars coated with metal inside and out, made independently by Ewald Georg von Kleist (1745) and Pieter van Musschenbroek in Leiden (1746). Benjamin Franklin showed that the charge of a Leyden jar resides in the glass between its coatings rather than in the water or metal.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 8 (Electrostatic Energy) — the energy of charges and of a uniformly charged sphere, the energy of a condenser and the forces on charged conductors, the energy of an ionic crystal and of nuclei, the energy in the field, and the energy of a point charge.',
    'Vol. II, ch. 27 (Field Energy and Field Momentum) — where the energy is and how it flows.',
    'Vol. II, ch. 28 (Electromagnetic Mass) — the energy of a point charge and the classical electron radius.'
  ],
  sim: 'emf-capacitor'
},

{
  id: 'atmospheric-electricity', parent: 'electrostatics-feyn', title: 'Electricity in the atmosphere', level: 1,
  short: 'On a fine day the air above the ground carries a field of about 100 V/m; the Earth is negative, the upper air some 300 kV positive, and a current of a kilo-ampere or two leaks steadily through the air. Thunderstorms, about two thousand at any moment, are the batteries that keep the Earth charged.',
  keywords: ['atmospheric electricity', 'fair-weather field', 'global electric circuit', 'ionosphere', 'thunderstorm', 'lightning', 'Carnegie curve', 'air conductivity', 'relaxation time', 'graupel', 'return stroke', 'leader'],
  prereq: ['gauss-law-feyn', 'electrostatic-energy-feyn', 'physics:electric-current'],
  related: ['em-introduction', 'dielectrics-feyn', 'electrostatic-analogs', 'physics:capacitance', 'physics:electric-potential'],
  body: `
### A hundred volts per metre
On a clear day, over flat open ground, the air carries a downward electric field of about 100 V/m (typically 100–150 V/m). Between your nose and your feet there should be some 200 V, yet you feel nothing. The air is an extremely poor conductor, so it can push almost no current through you; and you are a fair conductor standing on a conductor, so you become part of the ground. The equipotentials bend up and over your head, and the field ends on you instead of passing through you — the simulation's inset shows it.

### Ground negative, sky positive
The field points down, so by Gauss's law the ground carries a negative charge $\\sigma = \\varepsilon_0E \\approx 0.9$ nC per square metre — about $-4.5\\times10^{5}$ C over the whole planet. The field weakens with height, because cosmic rays make more ions high up and the air there conducts better; by about 50 km the air conducts so well that it behaves as one conductor, some 250–400 kV above the ground. The Earth and the upper atmosphere form a spherical capacitor with leaky air in between.

### A current that never stops
Cosmic rays and natural radioactivity keep the air supplied with ions. Near the ground its conductivity is about $2\\times10^{-14}$ S/m, so the fair-weather field drives about $J = \\sigma_cE \\approx 2$ pA per square metre down to the ground — some 1–2 kA over the whole Earth. At that rate the Earth's charge would leak away in minutes: it would decay [[?exponential|exponentially]] with the time constant $\\varepsilon_0/\\sigma_c$, about 7 minutes at ground level. Something must be charging the Earth all the time.

### Thunderstorms are the batteries
The clue came from the oceans. On cruises of the research ship *Carnegie* in the 1910s and 1920s, the fair-weather field over the sea was found to rise and fall each day by about 15 % on a schedule set by Greenwich time, not local time — highest near 19:00 UTC everywhere at once. That is when afternoon thunderstorms over the Americas and Africa are most numerous. Some 2000 storms are active at any moment; each drives roughly half an ampere to an ampere of positive charge upward from its top, while lightning and corona discharge from trees and grass beneath it carry negative charge to the ground.

| The global circuit | Typical value |
|---|---|
| fair-weather field at the ground | 100–150 V/m |
| upper atmosphere relative to the ground | 250–400 kV |
| charge on the Earth | about −5×10⁵ C |
| current through fair-weather air | 1–2 kA |
| resistance of the whole atmosphere | about 250 Ω |

### Inside a thundercloud
A thunderstorm is a tall heat engine: warm moist air rises at up to tens of metres per second, and the cloud towers 10 km or more. Where it is colder than about −10 °C, soft hail (graupel) falls through rising ice crystals; in collisions the graupel tends to become negative and the light crystals positive, and the updraught lifts the crystals to the top. This collision charging is the favoured explanation, though its details are still being studied. The cloud becomes a huge dipole — positive on top, negative around 6 km — and beneath it the field at the ground reverses and reaches 10 kV/m or more.

A flash to ground begins with a faint **stepped leader** working down in jumps of tens of metres; as it nears the ground a streamer rises to meet it, and a **return stroke** of about 30 kA races back up the channel, heating it to some 30 000 K — its shock wave is the thunder. A typical flash brings about 20 C of negative charge to the ground.

> [!warn] If you can hear thunder, you are within reach of lightning. Shelter in a building or a hard-topped car, not under a tree, and stay there until about 30 minutes after the last thunder.

In the simulation, the storms pump, the air leaks, and the field at the ground settles where the two balance. Stop the storms and the Earth discharges within minutes; follow the day and the daily rise and fall appears.
`,
  ideas: [
    'In fair weather the field at the ground is about 100 V/m, pointing down: the Earth is negatively charged, about 0.9 nC/m².',
    'The upper atmosphere is a good conductor some 300 kV above the ground; the air between leaks a current of 1–2 kA.',
    'Without recharging, the Earth\'s charge would leak away in minutes (time constant ε₀/σ).',
    'About 2000 thunderstorms at a time recharge it; the fair-weather field rises and falls with universal time, following worldwide storm activity.',
    'A person does not feel the 200 V between head and feet: a conductor on the ground bends the equipotentials round itself.'
  ],
  pitfalls: [
    'The fair-weather field would give you a shock if it were not so weak — The field is not weak (200 V over your height); the air simply cannot deliver a current, and your body becomes part of the grounded conductor.',
    'Lightning carries positive charge down to the Earth — Most flashes to ground lower negative charge; that is how storms keep the ground negative.',
    'The atmosphere is charged by the Sun — The daily variation follows world thunderstorm activity (peaking near 19:00 UTC), not the local position of the Sun.'
  ],
  formulas: [
    {
      name: 'Surface charge on the ground', expr: 'sigma = eps0*E', tex: '\\sigma = \\varepsilon_0 E',
      vars: {
        sigma: { name: 'charge per unit area of ground', q: 'surfacecharge', unit: 'nC/m²', tex: '\\sigma' },
        eps0: { const: 'eps0' },
        E: { name: 'field at the ground', q: 'efield', unit: 'V/m', value: 100 }
      },
      note: 'The field just outside a conductor; the ground is negative when the field points down.',
      stories: { sigma: 'The fair-weather field at the ground is {E}. How much charge sits on each square metre of ground?', E: 'The ground carries {sigma}. What is the field just above it?' }
    },
    {
      name: 'Charge on the whole Earth', expr: 'Q = 4*pi*R^2*eps0*E', tex: 'Q = 4\\pi R_\\oplus^2\\,\\varepsilon_0 E',
      vars: {
        Q: { name: 'charge on the Earth (magnitude)', q: 'charge', unit: 'C' },
        R: { const: 'Rearth', tex: 'R_\\oplus' },
        eps0: { const: 'eps0' },
        E: { name: 'average field at the ground', q: 'efield', unit: 'V/m', value: 100 }
      },
      note: 'Gauss\'s law for a sphere just above the ground.',
      stories: { Q: 'If the fair-weather field were {E} everywhere, what would be the charge on the Earth?', E: 'The Earth carries {Q}. What average field does that make at the ground?' }
    },
    {
      name: 'Current through fair-weather air', expr: 'J = sig*E', tex: 'J = \\sigma_c E',
      vars: {
        J: { name: 'current density', q: 'currentdensity', unit: 'A/m²' },
        sig: { name: 'conductivity of the air', q: 'conductivity', unit: 'S/m', value: 2e-14, tex: '\\sigma_c' },
        E: { name: 'electric field', q: 'efield', unit: 'V/m', value: 100 }
      },
      note: 'Ohm\'s law for a conducting medium. Near the ground the air\'s conductivity is 1–3 × 10⁻¹⁴ S/m; it rises with height.',
      stories: { J: 'Air of conductivity {sig} carries a field of {E}. What current flows through each square metre?', sig: 'A current of {J} flows in a field of {E}. What is the conductivity of the air?' }
    },
    {
      name: 'Time for the air to discharge', expr: 'tau = eps0/sig', tex: '\\tau = \\dfrac{\\varepsilon_0}{\\sigma_c}',
      vars: {
        tau: { name: 'relaxation time', q: 'time', unit: 'min', tex: '\\tau' },
        eps0: { const: 'eps0' },
        sig: { name: 'conductivity of the air', q: 'conductivity', unit: 'S/m', value: 2e-14, tex: '\\sigma_c' }
      },
      note: 'A charge in a conducting medium decays as e^(−t/τ). For copper τ is about 10⁻¹⁹ s; for air near the ground, minutes.',
      stories: { tau: 'How long does it take charge to leak away through air of conductivity {sig}?', sig: 'Charge in some air relaxes in {tau}. What is its conductivity?' }
    }
  ],
  examples: [
    {
      title: 'The charge on the Earth',
      q: 'Take the fair-weather field as 100 V/m everywhere. What is the charge on the Earth?',
      steps: [
        'Gauss\'s law on a sphere just above the ground: $Q = 4\\pi R^2\\varepsilon_0E$.',
        '$Q = 4\\pi \\times (6.37\\times10^{6})^2 \\times 8.85\\times10^{-12} \\times 100 = 4.5\\times10^{5}$ C (negative).'
      ],
      a: 'About half a million coulombs, negative.'
    },
    {
      title: 'The atmosphere as a resistor',
      q: 'The fair-weather current density is 2 pA/m² over the Earth\'s area of $5.1\\times10^{14}$ m², and the upper atmosphere is at 300 kV. Find the total current, the resistance of the atmosphere, and the power the storms must supply.',
      steps: [
        '$I = 2\\times10^{-12} \\times 5.1\\times10^{14} \\approx 1000$ A.',
        '$R = V/I = 3\\times10^{5}/1000 = 300$ Ω.',
        '$P = VI = 3\\times10^{5} \\times 1000 = 3\\times10^{8}$ W — a few hundred megawatts, a tiny part of the storms\' own energy.'
      ],
      a: 'About 1 kA, 300 Ω and 300 MW.'
    },
    {
      title: 'How much does lightning deliver?',
      q: 'Satellites count about 45 flashes a second worldwide, roughly a quarter of them to the ground, each lowering about 20 C. How much of the needed kilo-ampere is that?',
      steps: ['Flashes to ground: about 11 per second, lowering $11 \\times 20 \\approx 220$ C/s ≈ 220 A.', 'That is a fifth or so of the current; most of the rest reaches the ground as corona discharge from trees, grass and buildings beneath the storms.'],
      a: 'A couple of hundred amperes — a substantial but minor share.'
    }
  ],
  quiz: [
    { q: 'Why do you not get a shock from the roughly 200 V between your head and your feet on a fine day?', choices: ['you are a conductor at ground potential, and the air can supply only a tiny current', 'the field is far too weak to matter', 'your skin insulates you', 'the field exists only high in the sky'], a: 0, why: 'The field ends on your head; the equipotentials bend round you, and the air\'s current is picoamperes.' },
    { q: 'The fair-weather field at the ground points…', choices: ['downward: the ground is negative', 'upward: the ground is positive', 'horizontally, from east to west', 'in no fixed direction'], a: 0, why: 'Field lines run from the positive upper atmosphere down to the negative ground.' },
    { q: 'The daily rise and fall of the fair-weather field over the oceans follows…', choices: ['Greenwich (universal) time everywhere', 'local time at each place', 'the tides', 'the phases of the Moon'], a: 0, why: 'It follows the total number of thunderstorms on Earth, which peaks when it is afternoon over the Americas and Africa.' },
    { q: 'Without thunderstorms, the Earth\'s negative charge would leak away through the air within an hour or so.', a: true, why: 'The relaxation time of the global circuit is only minutes.' },
    { q: 'The field at the ground is 150 V/m. What is the charge per square metre of ground?', answer: 1.33, unit: 'nC/m²', why: 'σ = ε₀E = 8.85 × 10⁻¹² × 150 = 1.33 × 10⁻⁹ C/m².' }
  ],
  problems: [
    { q: 'The upper atmosphere is at 300 kV and the global fair-weather current is 1200 A. What is the resistance of the atmosphere?', answer: 250, unit: 'Ω', tol: 0.02, hint: 'Ohm\'s law.',
      steps: ['$R = V/I = 300\\,000/1200 = 250$ Ω.'] },
    { q: 'Clean mountain air conducts 5 × 10⁻¹⁴ S/m. What is its relaxation time ε₀/σ?', answer: 177, unit: 's', tol: 0.02, hint: 'τ = ε₀/σ.',
      steps: ['$\\tau = 8.854\\times10^{-12}/5\\times10^{-14} = 177$ s, about 3 minutes.'] }
  ],
  applications: [
    'Field mills at airports and rocket launch sites measure the atmospheric field and warn when it builds towards lightning.',
    'The fair-weather field tracks air pollution: smoke and dust capture small ions, lowering the air\'s conductivity and raising the field.',
    'Lightning protection gives the leader a preferred place to attach and a low-resistance path for the stroke current to the ground.'
  ],
  history: 'Benjamin Franklin proposed in 1750 that lightning is electrical; the experiment he suggested, drawing sparks from a storm with a tall iron rod, was first done at Marly-la-Ville in France in May 1752 by Thomas-François Dalibard. William Thomson (Lord Kelvin) built electrometers to measure the fair-weather field in the 1850s and 1860s, and in the 1920s C. T. R. Wilson argued that thunderstorms are the batteries of a global circuit — confirmed by the Carnegie measurements of the daily variation.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 9 (Electricity in the Atmosphere) — the fair-weather field and why we do not feel it, the currents in the atmosphere and their origin, the daily variation that follows universal time, thunderstorms, the mechanism of charge separation, and lightning.'
  ],
  sim: 'emf-atmosphere'
},

{
  id: 'dielectrics-feyn', parent: 'electrostatics-feyn', title: 'Dielectrics', level: 2,
  short: 'An insulator in a capacitor raises its capacitance by the dielectric constant κ. The field stretches every atom into a tiny dipole or lines up molecules that already are dipoles; their charges cancel inside but leave sheets of bound charge on the surfaces, which weaken the field by the factor κ.',
  keywords: ['dielectric', 'dielectric constant', 'relative permittivity', 'polarization', 'bound charge', 'polarization charge', 'susceptibility', 'dipole moment', 'polar molecules', 'Debye', 'Clausius–Mossotti', 'ferroelectric', 'barium titanate', 'electric displacement'],
  prereq: ['gauss-law-feyn', 'electrostatic-energy-feyn', 'physics:dielectrics'],
  related: ['electrostatic-analogs', 'origin-of-refractive-index', 'boltzmann-law', 'magnetism-of-matter', 'atmospheric-electricity', 'physics:capacitance'],
  body: `
### Faraday's discovery
Fill the gap of a capacitor with glass, oil or plastic and its capacitance rises by a factor $\\kappa$, the **dielectric constant** of the material; Faraday measured it in 1837. At a fixed charge the voltage falls by $\\kappa$, so the field inside the material must be $\\kappa$ times weaker than in vacuum. Something in the insulator cancels part of the field — yet no charge can flow through an insulator.

| Material | $\\kappa$ |
|---|---|
| vacuum | 1 exactly |
| air at sea level | 1.0006 |
| polyethylene | 2.3 |
| paper | 2–4 |
| glass | 4–10 |
| water at 20 °C | 80 |
| barium titanate | thousands |

### What the atoms do
In a field each atom's electron cloud is pulled one way and its nucleus the other, making a tiny **dipole** whose moment $p$ is proportional to the field. The shift is minute — 1 MV/m moves a hydrogen atom's cloud by about $5\\times10^{-16}$ m, a hundred-thousandth of its size — but there are some $10^{28}$ atoms in every cubic metre. Molecules such as water are dipoles already ($p_0 = 6.2\\times10^{-30}$ C·m), and the field tends to line them up while thermal jostling scrambles them.

The **polarization** $\\vec P$ is the dipole moment per unit volume. Inside a uniformly polarized slab each molecule's + end sits next to its neighbour's − end, and the charges cancel. At the faces they cannot: a sheet of uncancelled **bound charge** is left, of density $\\sigma_{\\text{pol}} = P$ — negative on the face next to the positive plate, positive on the other. In the simulation the molecules stretch or turn, and these sheets appear on the slab's faces; count the field lines that end on them.

### Why the field weakens
The bound charge sits right against the plate's free charge and partly cancels it. In most materials $P$ is proportional to the field, $P = \\varepsilon_0\\chi E$, with $\\chi$ the susceptibility. Gauss's law, with both kinds of charge, gives

$$E = \\frac{\\sigma_{\\text{free}} - P}{\\varepsilon_0} \\;\\Rightarrow\\; E = \\frac{\\sigma_{\\text{free}}}{(1+\\chi)\\,\\varepsilon_0} = \\frac{\\sigma_{\\text{free}}}{\\kappa\\,\\varepsilon_0}, \\qquad \\kappa = 1 + \\chi$$

Where $\\vec P$ changes from place to place, bound charge appears inside as well, $\\rho_{\\text{pol}} = -\\nabla\\cdot\\vec P$ — a [[?divergence]]: where the dipoles spread apart, their negative ends are left behind. Then Gauss's law can be written with free charge alone, $\\nabla\\cdot(\\kappa\\varepsilon_0\\vec E) = \\rho_{\\text{free}}$: electrostatics in matter is electrostatics in vacuum with $\\varepsilon_0$ replaced by $\\kappa\\varepsilon_0$.

### Polar molecules and temperature
For molecules with a permanent dipole, alignment fights temperature. The [[?boltzmann-factor]] favours the aligned directions only slightly; in a weak field the average dipole along the field is $p_0^2E/3kT$, so

$$\\chi = \\frac{N p_0^2}{3\\varepsilon_0 k T}$$

which falls as $1/T$. Plot $\\kappa - 1$ against $1/T$ for a gas: the slope gives the permanent dipole moment and the intercept the induced part — how molecular dipole moments were first measured (Peter Debye, 1912). For steam at 100 °C and 1 atm the formula gives $\\chi \\approx 0.0055$, close to what is measured. In liquids and solids the neighbours' fields matter (the Clausius–Mossotti relation), and in ferroelectrics such as barium titanate the dipoles line each other up spontaneously.

### Pulled in
A dielectric slab is **drawn into** a charged capacitor, because the energy $Q^2/2C$ falls as $C$ grows. The same force lets a charged comb pick up paper and bends a thin stream of water towards a charged rod. The simulation reports the pull as you slide the slab.
`,
  ideas: [
    'An insulator between the plates multiplies the capacitance by κ, the dielectric constant.',
    'The field makes dipoles — by stretching atoms or turning polar molecules; the polarization P is the dipole moment per unit volume.',
    'A uniformly polarized slab has bound charge σ_pol = P on its faces, which cancels part of the free charge\'s field: E = σ_free/κε₀.',
    'Orientation polarization of polar molecules falls as 1/T: χ = Np₀²/3ε₀kT.',
    'A dielectric is pulled into a charged capacitor, because that lowers the stored energy.'
  ],
  pitfalls: [
    'The dielectric weakens the field because charge flows through it — No charge flows; each molecule\'s charges shift by a tiny distance, and only the uncancelled layers on the surfaces matter.',
    'Inserting a dielectric always lowers the voltage — Only at fixed charge. With a battery connected the voltage stays fixed and more charge flows onto the plates.',
    'κ is a fixed property of a substance — For polar materials it depends on temperature, and on frequency: water\'s 80 at low frequency falls to about 1.8 at optical frequencies, because the molecules cannot turn that fast.'
  ],
  formulas: [
    {
      name: 'Capacitor filled with a dielectric', expr: 'C = kappa*eps0*A/d', tex: 'C = \\dfrac{\\kappa\\,\\varepsilon_0 A}{d}',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'pF' },
        kappa: { name: 'dielectric constant', value: 6, min: 1, tex: '\\kappa' },
        eps0: { const: 'eps0' },
        A: { name: 'plate area', q: 'area', unit: 'cm²', value: 100 },
        d: { name: 'gap (filled with the dielectric)', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'κ = 1 for vacuum; the dielectric must fill the gap.',
      stories: { C: 'Glass of dielectric constant {kappa} fills the {d} gap between plates of {A}. What is the capacitance?', kappa: 'Plates of {A}, {d} apart with an insulator between them, have a capacitance of {C}. What is the dielectric constant?' }
    },
    {
      name: 'Field in the dielectric', expr: 'E = sigma/(kappa*eps0)', tex: 'E = \\dfrac{\\sigma}{\\kappa\\,\\varepsilon_0}',
      vars: {
        E: { name: 'field in the dielectric', q: 'efield', unit: 'kV/m' },
        sigma: { name: 'free charge per unit area on the plates', q: 'surfacecharge', unit: 'µC/m²', value: 10, tex: '\\sigma' },
        kappa: { name: 'dielectric constant', value: 5, min: 1, tex: '\\kappa' },
        eps0: { const: 'eps0' }
      },
      note: 'Weaker than the vacuum field σ/ε₀ by the factor κ.',
      stories: { E: 'The plates carry {sigma}, and the slab between them has κ = {kappa}. What is the field inside it?', kappa: 'Plates with {sigma} produce a field of {E} in a slab. What is its dielectric constant?' }
    },
    {
      name: 'Bound charge on the faces of the slab', expr: 'sp = sigma*(1 - 1/kappa)', tex: '\\sigma_p = \\sigma\\left(1 - \\dfrac{1}{\\kappa}\\right)',
      vars: {
        sp: { name: 'bound (polarization) charge per unit area', q: 'surfacecharge', unit: 'µC/m²', tex: '\\sigma_p' },
        sigma: { name: 'free charge per unit area on the plate', q: 'surfacecharge', unit: 'µC/m²', value: 10, tex: '\\sigma' },
        kappa: { name: 'dielectric constant', value: 4, min: 1, tex: '\\kappa' }
      },
      note: 'Opposite in sign to the free charge on the neighbouring plate. For large κ it nearly cancels it.',
      stories: { sp: 'The plates carry {sigma} and the slab has κ = {kappa}. How much bound charge appears on each face?', kappa: 'Bound charge of {sp} appears next to plates carrying {sigma}. What is κ?' }
    },
    {
      name: 'Orientation polarization of a polar gas', expr: 'chi = N*p0^2/(3*eps0*kB*T)', tex: '\\chi = \\dfrac{N p_0^2}{3\\varepsilon_0 k_B T}',
      vars: {
        chi: { name: 'susceptibility from orientation', tex: '\\chi' },
        N: { name: 'molecules per unit volume', q: 'numberdensity', unit: '1/m³', value: 1.97e25 },
        p0: { name: 'permanent dipole moment', q: 'dipole', unit: 'D', value: 1.85, tex: 'p_0' },
        eps0: { const: 'eps0' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 373 }
      },
      note: 'Weak fields (p₀E ≪ kT) and a dilute gas. The defaults are steam at 100 °C and 1 atm; the induced polarization adds a little more.',
      stories: { chi: 'Steam at {T} has {N} molecules per cubic metre, each with a dipole moment of {p0}. What susceptibility do they give?', p0: 'A polar gas with {N} molecules per cubic metre at {T} has χ = {chi}. What is the dipole moment of each molecule?' }
    }
  ],
  examples: [
    {
      title: 'Glass in a capacitor',
      q: 'The 10 cm × 10 cm, 1 mm capacitor of 88.5 pF is filled with glass of κ = 6 and charged to 1 kV. Find the capacitance, the charge and the stored energy.',
      steps: ['$C = \\kappa C_0 = 6 \\times 88.5 = 531$ pF.', '$Q = CV = 531$ nC — six times the charge at the same voltage.', '$U = \\frac12CV^2 = 0.5 \\times 531\\times10^{-12} \\times 10^{6} = 266$ µJ.'],
      a: '531 pF, 531 nC, 266 µJ.'
    },
    {
      title: 'Sliding a slab into an isolated capacitor',
      q: 'The 88.5 pF air capacitor is charged to 1 kV and disconnected. A slab of κ = 4 is slid in to fill the gap. Find the new voltage, field, energy and bound charge density.',
      steps: [
        'The charge stays 88.5 nC; $C$ becomes 354 pF, so $V = Q/C = 250$ V and $E = V/d = 250$ kV/m.',
        'Energy: $Q^2/2C$ falls from 44 µJ to 11 µJ; the missing 33 µJ is the work the field did pulling the slab in.',
        'Free charge density $\\sigma = 88.5\\times10^{-9}/0.01 = 8.85$ µC/m²; bound $\\sigma_p = 8.85 \\times (1 - 1/4) = 6.6$ µC/m².'
      ],
      a: '250 V, 250 kV/m, 11 µJ; bound charge 6.6 µC/m², three-quarters of the free charge.'
    },
    {
      title: 'Steam\'s susceptibility',
      q: 'Estimate the orientation susceptibility of steam at 100 °C and 1 atm ($p_0 = 1.85$ D $= 6.17\\times10^{-30}$ C·m).',
      steps: [
        '$N = p/kT = 101\\,325/(1.381\\times10^{-23} \\times 373) = 1.97\\times10^{25}$ m⁻³.',
        '$\\chi = Np_0^2/3\\varepsilon_0kT = 1.97\\times10^{25} \\times (6.17\\times10^{-30})^2/(3 \\times 8.85\\times10^{-12} \\times 1.381\\times10^{-23} \\times 373) = 0.0055$.'
      ],
      a: 'χ ≈ 0.0055, so κ ≈ 1.006 — close to the measured value.'
    }
  ],
  quiz: [
    { q: 'A charged capacitor is disconnected, then a glass slab is slid between its plates. The voltage…', choices: ['falls', 'rises', 'stays the same', 'drops to zero'], a: 0, why: 'Q is fixed and C rises, so V = Q/C falls.' },
    { q: 'The same, but with a battery kept connected. The charge on the plates…', choices: ['rises', 'falls', 'stays the same', 'drops to zero'], a: 0, why: 'V is fixed and C rises, so Q = CV rises: the battery supplies more charge.' },
    { q: 'The bound charge on the face of the slab next to the positive plate is…', choices: ['negative', 'positive', 'zero', 'positive or negative depending on κ'], a: 0, why: 'The molecules\' negative ends are pulled towards the positive plate.' },
    { q: 'A dielectric slab is pushed out of a charged capacitor.', a: false, why: 'It is pulled in: the stored energy falls as the slab enters, at fixed charge or fixed voltage alike.' },
    { q: 'Heating a gas of polar molecules makes its susceptibility…', choices: ['smaller: thermal motion scrambles the alignment', 'larger: faster molecules turn more easily', 'unchanged', 'negative'], a: 0, why: 'χ = Np₀²/3ε₀kT falls as 1/T.' }
  ],
  problems: [
    { q: 'Plates of 100 cm² are 0.1 mm apart, with paper (κ = 3.5) between them. What is the capacitance?', answer: 3.1, unit: 'nF', tol: 0.02, hint: 'C = κε₀A/d.',
      steps: ['$C = 3.5 \\times 8.854\\times10^{-12} \\times 0.01/10^{-4} = 3.10\\times10^{-9}$ F.'] },
    { q: 'The plates carry 2 µC/m² of free charge and the slab between them has κ = 2.5. What is the bound charge density on its faces?', answer: 1.2, unit: 'µC/m²', tol: 0.02, hint: 'σ_p = σ(1 − 1/κ).',
      steps: ['$\\sigma_p = 2 \\times (1 - 0.4) = 1.2$ µC/m².'] }
  ],
  applications: [
    'Capacitors use thin films of plastic, ceramic or oxide: a high κ and a high breakdown field pack more energy into less volume.',
    'A microwave oven heats food by swinging water molecules back and forth in a field that alternates 2.45 billion times a second.',
    'Capacitive sensors detect liquid levels, humidity or a finger from the change of κ near their electrodes.'
  ],
  history: 'Michael Faraday measured the "specific inductive capacity" of insulators in 1837. Ottaviano Mossotti (1850) and Rudolf Clausius (1879) related κ to the polarizability of molecules, and Peter Debye explained the temperature dependence of polar molecules in 1912. Ferroelectricity in barium titanate was discovered during the Second World War, independently in several countries.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 10 (Dielectrics) — the dielectric constant, the polarization vector, polarization charges, the electrostatic equations with dielectrics, and fields and forces with dielectrics.',
    'Vol. II, ch. 11 (Inside Dielectrics) — molecular dipoles, electronic polarization, polar molecules and orientation polarization, fields in cavities, the dielectric constant of liquids and solids, and ferroelectricity in barium titanate.'
  ],
  sim: 'emf-dielectric'
},

{
  id: 'electrostatic-analogs', parent: 'electrostatics-feyn', title: 'Same equations, same solutions', level: 2,
  short: 'Heat flowing through a solid, current spreading in the ground, particles diffusing, a rubber sheet pushed by a post: each obeys the same equation as the electrostatic potential. Solve one and you have solved them all — the field of a charge is also the temperature round a small heater.',
  keywords: ['electrostatic analogy', 'Laplace equation', 'Poisson equation', 'Laplacian', 'heat conduction', 'Fourier\'s law', 'diffusion', 'Fick\'s law', 'stretched membrane', 'step voltage', 'electrolytic tank', 'irrotational flow'],
  prereq: ['gauss-law-feyn', 'vector-calculus-fields', 'math:laplace-equation'],
  related: ['diffusion-random-walk', 'flow-of-dry-water', 'dielectrics-feyn', 'vector-potential', 'physics:conduction', 'physics:heat-transfer'],
  body: `
### One equation, many stories
When two situations obey equations of the same form, with boundaries of the same shape, their solutions are the same, so solving one solves the other — an economy Feynman made much of. Electrostatics is the prime example. Combine $\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0$ with $\\vec E = -\\nabla\\phi$:

$$\\nabla^2\\phi = -\\frac{\\rho}{\\varepsilon_0}$$

This is Poisson's equation, with the [[?laplacian]] on the left. In empty space it becomes Laplace's equation, $\\nabla^2\\phi = 0$: the potential at every point is the average of the potential around it. Any quantity that **flows**, is **conserved**, and flows **down the slope** of something obeys the same equation.

### Heat flow
Heat flows down the temperature [[?gradient]], $\\vec h = -K\\nabla T$ with $K$ the thermal conductivity, and in a steady state the heat leaving each small volume equals the heat made in it, $\\nabla\\cdot\\vec h = s$. Together:

$$\\nabla\\cdot(K\\nabla T) = -s$$

— the same equation, with $T$ for $\\phi$, $K$ for $\\varepsilon_0$ and the heat source $s$ for the charge density. A point source of heat $P$ in a big block gives $T - T_\\infty = P/4\\pi K r$, just as a point charge gives $\\phi = q/4\\pi\\varepsilon_0 r$. A body held at one temperature plays the part of a conductor, and an insulated wall is a boundary that no field line may cross.

### Current in the ground
In a conducting medium current flows down the potential, $\\vec j = -\\sigma\\nabla\\phi$, and in a steady state no charge piles up, $\\nabla\\cdot\\vec j = 0$ — the same equation again. Before computers, engineers solved awkward electrode shapes in tanks of weakly conducting water or on resistive paper, measuring the potential with a probe. It is also why a fallen power line is dangerous even without touching it: current spreading from where it enters the ground makes a potential that falls as $1/r$, and a long stride can span hundreds of volts — the *step voltage*.

### Diffusion and the membrane
Ink in water or neutrons in a reactor's graphite drift down their concentration gradient, $\\vec J = -D\\nabla n$ — the average of countless random steps ([[diffusion-random-walk]]) — and in a steady state with sources, $\\nabla\\cdot(D\\nabla n) = -S$. A rubber sheet under tension $\\tau$, pushed gently by a pressure $f$, sags by $u$ with $\\nabla^2u = -f/\\tau$: a height map that *is* a potential. A post pushing up the sheet is a charge; a clamped frame is a grounded conductor. The sheet is two-dimensional, so it copies the fields of long charged rods, whose potential varies as the [[?logarithm]] of distance. Rubber-sheet models with steel balls rolling on them were once used to trace electron paths in vacuum tubes.

| Physics | "Potential" | Flow | Constant | Source | Fixed boundary |
|---|---|---|---|---|---|
| electrostatics | $\\phi$ | $\\vec E = -\\nabla\\phi$ | $\\varepsilon_0$ | charge | conductor |
| heat flow | $T$ | $\\vec h = -K\\nabla T$ | $K$ | heat made | body at fixed $T$ |
| current in a medium | $\\phi$ | $\\vec j = -\\sigma\\nabla\\phi$ | $\\sigma$ | current fed in | electrode |
| diffusion | $n$ | $\\vec J = -D\\nabla n$ | $D$ | particles made | fixed concentration |
| membrane | height $u$ | slope | tension $\\tau$ | pressure | clamped rim |
| ideal fluid without vortices | velocity potential | $\\vec v$ | 1 | fluid sources | — |

The simulation solves $\\nabla^2u = -s$ on a grid just once; the four settings only rename it, change the units and redraw it. Place sources, move the fixed body, and switch between the stories: the numbers never change.

### Why the same?
Feynman suggested a modest answer: perhaps the equations agree not because nature is secretly one thing but because each is a smoothed-out description. Average over a messy world of atoms, and the simplest law that conserves something and treats every direction alike is this same second-order equation. That is why it works so widely — and why, at the scale of atoms, it fails for all of them.
`,
  ideas: [
    'Electrostatics: ∇²φ = −ρ/ε₀ (Poisson); in empty space ∇²φ = 0 (Laplace).',
    'Anything that flows down a gradient and is conserved obeys the same equation: heat (h = −K∇T), current (j = −σ∇φ), diffusion (J = −D∇n).',
    'The analogues map term by term: charge ↔ heat source, ε₀ ↔ conductivity, conductor ↔ body at fixed temperature.',
    'A stretched membrane pushed by pressure is a picture of the potential in two dimensions.',
    'Solve once, use everywhere: a solved electrostatics problem is a solved heat-flow problem.'
  ],
  pitfalls: [
    'The analogy is only qualitative — It is exact whenever the equations and the boundary conditions match; the numbers carry over with the constants swapped.',
    'In the heat analogy the field lines are lines of constant temperature — The field lines are the heat-flow lines; the isotherms are the equipotentials, crossing them at right angles.',
    'A membrane pushed at a point rises as 1/r like a point charge\'s potential — The membrane is two-dimensional; its height near the post changes as the logarithm of distance, like the potential of a long charged rod.'
  ],
  formulas: [
    {
      name: 'Temperature round a point source of heat', expr: 'dT = P/(4*pi*K*r)', tex: '\\Delta T = \\dfrac{P}{4\\pi K r}',
      vars: {
        dT: { name: 'rise above the distant temperature', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        P: { name: 'heat produced', q: 'power', unit: 'W', value: 100 },
        K: { name: 'thermal conductivity', q: 'thermcond', unit: 'W/(m·K)', value: 1 },
        r: { name: 'distance from the source', q: 'length', unit: 'm', value: 0.5 }
      },
      note: 'Steady state in a large uniform medium — the heat-flow twin of φ = q/4πε₀r.',
      stories: { dT: 'A {P} heater is buried in soil of conductivity {K}. How much warmer than far away is the soil {r} from it?', P: 'The soil {r} from a buried cable joint is {dT} warmer than far away (conductivity {K}). How much heat is the joint making?' }
    },
    {
      name: 'Heat flow through a slab (the twin of E = V/d)', expr: 'h = K*dT/L', tex: 'h = K\\dfrac{\\Delta T}{L}',
      vars: {
        h: { name: 'heat flow per unit area', q: 'intensity', unit: 'W/m²' },
        K: { name: 'thermal conductivity', q: 'thermcond', unit: 'W/(m·K)', value: 0.8 },
        dT: { name: 'temperature difference across it', q: 'dtemp', unit: 'K', value: 20, tex: '\\Delta T' },
        L: { name: 'thickness', q: 'length', unit: 'cm', value: 20 }
      },
      note: 'A uniform gradient, like the field between capacitor plates.',
      stories: { h: 'A brick wall {L} thick (conductivity {K}) has {dT} between its faces. How much heat crosses each square metre per second?', L: 'How thick must a wall of conductivity {K} be to let through only {h} with {dT} across it?' }
    },
    {
      name: 'Potential round a point where current enters the ground', expr: 'V = I*rho/(2*pi*r)', tex: 'V = \\dfrac{I\\rho}{2\\pi r}',
      vars: {
        V: { name: 'potential relative to distant ground', q: 'voltage', unit: 'V' },
        I: { name: 'current into the ground', q: 'current', unit: 'A', value: 500 },
        rho: { name: 'resistivity of the soil', q: 'resistivity', unit: 'Ω·m', value: 100, tex: '\\rho' },
        r: { name: 'distance from the entry point', q: 'length', unit: 'm', value: 10 }
      },
      note: 'Current spreading into a half-space (hemispherical flow). The difference of V across one stride is the step voltage.',
      stories: { V: 'A fault drives {I} into soil of resistivity {rho}. What is the ground potential {r} away?', r: 'A fault drives {I} into soil of resistivity {rho}. How far away does the ground potential fall to {V}?' }
    },
    {
      name: 'Thermal resistance of a sphere (the twin of C = 4πε₀a)', expr: 'Rth = 1/(4*pi*K*a)', tex: 'R_{th} = \\dfrac{1}{4\\pi K a}',
      vars: {
        Rth: { name: 'thermal resistance from the sphere to far away', q: 'thermalres', unit: 'K/W', tex: 'R_{th}' },
        K: { name: 'thermal conductivity of the medium', q: 'thermcond', unit: 'W/(m·K)', value: 1 },
        a: { name: 'radius of the sphere', q: 'length', unit: 'cm', value: 1 }
      },
      note: 'The same geometry that gives a sphere its capacitance 4πε₀a gives its heat conduction 4πKa.',
      stories: { Rth: 'A ball of radius {a} sits in soil of conductivity {K}. What is its thermal resistance to the surroundings?', a: 'What radius gives a sphere in a medium of conductivity {K} a thermal resistance of {Rth}?' }
    }
  ],
  examples: [
    {
      title: 'A buried heater is a point charge',
      q: 'A 100 W heater is buried deep in soil with $K = 1$ W/(m·K). How much warmer is the soil 0.5 m and 1 m away?',
      steps: ['The heat-flow twin of $\\phi = q/4\\pi\\varepsilon_0r$ is $\\Delta T = P/4\\pi Kr$.', 'At 0.5 m: $100/(4\\pi \\times 1 \\times 0.5) = 15.9$ K. At 1 m: 8.0 K — halved, as $1/r$.'],
      a: '15.9 K and 8.0 K.'
    },
    {
      title: 'Step voltage near a fault',
      q: 'A fault drives 500 A into soil of resistivity 100 Ω·m. What voltage does a 0.8 m stride span at 10 m, and at 2 m, from the entry point?',
      steps: [
        '$V(r) = I\\rho/2\\pi r = 500 \\times 100/(2\\pi r) = 7958/r$ volts.',
        'At 10 m: $V(10) - V(10.8) = 796 - 737 = 59$ V.',
        'At 2 m: $V(2) - V(2.8) = 3979 - 2842 = 1137$ V — which is why you should not walk towards a fallen line.'
      ],
      a: 'About 59 V at 10 m and over 1100 V at 2 m.'
    },
    {
      title: 'Capacitance and heat loss share a shape',
      q: 'A metal ball of radius 1 cm has capacitance $4\\pi\\varepsilon_0a$. What is its thermal resistance in soil with $K = 1$ W/(m·K), and how much does a 1 W heat source in it warm it?',
      steps: ['Replace $\\varepsilon_0$ by $K$ and charge by heat: conductance $4\\pi Ka$, so $R_{th} = 1/(4\\pi \\times 1 \\times 0.01) = 7.96$ K/W.', 'With 1 W flowing out, the ball sits 8.0 K above the distant soil.'],
      a: '7.96 K/W; about 8 K warmer.'
    }
  ],
  quiz: [
    { q: 'In the heat-flow analogy, what plays the part of electric charge?', choices: ['a source of heat', 'the temperature', 'the thermal conductivity', 'an insulating wall'], a: 0, why: 'Sources of heat are where heat flow diverges, just as charges are where E diverges.' },
    { q: 'What plays the part of a conductor (an equipotential)?', choices: ['a body held at one fixed temperature', 'a heat source', 'an insulating boundary', 'a region where no heat flows'], a: 0, why: 'A conductor is at one potential; its twin is a body at one temperature (a very good heat conductor).' },
    { q: 'If you know the field of a charge near a grounded conducting plane, you also know how heat flows from a small buried heater into ground whose surface is kept at a fixed temperature.', a: true, why: 'Same equation, same boundary: the method of images works for both.' },
    { q: 'A stretched membrane pushed by a post is a model of electrostatics in…', choices: ['two dimensions: the fields of long charged rods', 'three dimensions', 'one dimension', 'four dimensions'], a: 0, why: 'The membrane has two dimensions; its height near a post varies as the logarithm of distance.' },
    { q: 'A 50 W point source of heat sits in still water (K = 0.6 W/(m·K)). How much warmer than far away is the water 10 cm from it?', answer: 66.3, unit: 'K', why: 'ΔT = P/4πKr = 50/(4π × 0.6 × 0.1) ≈ 66 K (ignoring convection).' }
  ],
  problems: [
    { q: 'A fault drives 1000 A into soil of resistivity 200 Ω·m. What is the ground potential 20 m from the entry point?', answer: 1592, unit: 'V', tol: 0.02, hint: 'V = Iρ/2πr.',
      steps: ['$V = 1000 \\times 200/(2\\pi \\times 20) = 1592$ V.'] },
    { q: 'Heat crosses a 20 cm brick wall (K = 0.8 W/(m·K)) with 20 K between its faces. How much per square metre?', answer: 80, unit: 'W/m²', tol: 0.02, hint: 'h = KΔT/L.',
      steps: ['$h = 0.8 \\times 20/0.2 = 80$ W/m².'] }
  ],
  applications: [
    'Before computers, electrolytic tanks and resistive paper solved electrode shapes for vacuum tubes and particle accelerators.',
    'Earthing systems for power stations are designed to keep step and touch voltages safe, using the 1/r potential of current spreading into the ground.',
    'Finite-element programs use one Laplace solver for heat, electrostatics, groundwater seepage (Darcy\'s law) and magnetostatics alike.'
  ],
  history: 'Joseph Fourier published his theory of heat conduction in 1822. In 1842 William Thomson (later Lord Kelvin), then 17, pointed out that the equations of steady heat flow in a solid are those of electrostatics, and used known heat-flow solutions to solve electrical problems.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 12 (Electrostatic Analogs) — the same equations have the same solutions; heat flow, the stretched membrane, the diffusion of neutrons, irrotational fluid flow, illumination, and why the equations are alike.',
    'Vol. II, ch. 3 (Vector Integral Calculus) — heat conduction as the first example of flux and Gauss\'s theorem.',
    'Vol. I, ch. 43 (Diffusion) — molecular diffusion and thermal conduction from the kinetic picture.'
  ],
  sim: 'emf-analogs'
},

{
  id: 'magnetostatics-feyn', parent: 'magnetism-induction', title: 'Magnetostatics', level: 2,
  short: 'Steady currents make magnetic fields whose lines never end (∇·B = 0) and whose circulation round any loop is μ₀ times the current through it (Ampère\'s law). From these come the fields of wires and solenoids — and the surprise that magnetism is electricity seen by a moving observer.',
  keywords: ['magnetostatics', 'magnetic field', 'Ampère\'s law', 'Biot–Savart law', 'current density', 'charge conservation', 'solenoid', 'straight wire', 'force between wires', 'Lorentz force', 'relativity of magnetism', 'tesla'],
  prereq: ['em-introduction', 'vector-calculus-fields', 'physics:magnetic-field', 'physics:amperes-law'],
  related: ['vector-potential', 'induction-laws', 'relativity-of-fields', 'charges-in-fields', 'magnetism-of-matter', 'physics:field-of-wire', 'physics:solenoid', 'physics:lorentz-force'],
  body: `
### The magnetic force
A charge moving with velocity $\\vec v$ through a magnetic field feels $\\vec F = q\\,\\vec v\\times\\vec B$ — a [[?cross-product]], at right angles to both, so it steers the charge but never speeds it up. On a wire the forces on its moving charges add up to $\\vec F = I\\,\\vec L\\times\\vec B$ for a length $\\vec L$. That fixes the unit: 1 tesla pushes with 1 newton on 1 metre of wire carrying 1 ampere across the field. The Earth's field is about 50 µT, a fridge magnet 5–10 mT, a hospital MRI 1.5–3 T.

### Currents, and charge that is never lost
The current density $\\vec j$ is charge per second per square metre. Charge is conserved locally: the current flowing out of any small volume equals the rate at which the charge inside falls, $\\nabla\\cdot\\vec j = -\\partial\\rho/\\partial t$ — a statement about a [[?divergence]]. In magnetostatics the currents are steady and nothing piles up: $\\nabla\\cdot\\vec j = 0$.

### The two laws
$$\\nabla\\cdot\\vec B = 0, \\qquad \\nabla\\times\\vec B = \\mu_0\\,\\vec j$$

The first says there are no magnetic charges: the lines of $\\vec B$ never start or stop, and its flux out of every closed surface is zero. The second, **Ampère's law**, makes currents the sources of the [[?curl]] of $\\vec B$. With [[?stokes-theorem|Stokes' theorem]] it becomes a law about loops — the circulation of $\\vec B$, a [[?line-integral]] round any closed path, equals $\\mu_0$ times the current through it:

$$\\oint \\vec B\\cdot d\\vec s = \\mu_0 I_{\\text{through}}$$

The simulation's Ampère loop adds up $\\vec B\\cdot d\\vec s$ all the way round. Drag it round a wire, stretch it, move it off: the sum is always $\\mu_0$ times the current it encircles — zero when it encircles none, although $\\vec B$ on the loop is not zero.

### Fields from symmetry
Round a long straight wire $B\\cdot 2\\pi r = \\mu_0I$, so $B = \\mu_0I/2\\pi r$: 10 A gives 200 µT at 1 cm, four times the Earth's field. In a long solenoid with $n$ turns per metre the field inside is uniform, $B = \\mu_0nI$, and outside nearly zero: 1000 turns per metre with 1 A give 1.26 mT. Parallel wires with currents the same way attract, with $\\mu_0I_1I_2/2\\pi d$ per metre; from 1948 to 2019 this defined the ampere — $2\\times10^{-7}$ N per metre for 1 A in each of two wires 1 m apart. For circuits of any shape the field is a sum over pieces, the **Biot–Savart law**, $d\\vec B = \\frac{\\mu_0 I}{4\\pi}\\frac{d\\vec s\\times\\hat r}{r^2}$; at the centre of a circular loop of radius $R$ it gives $\\mu_0I/2R$.

### Magnetism is relativity
One of the most striking arguments of these lectures: magnetism is electricity seen from a moving frame. A negative charge travels alongside a current-carrying wire at the speed of the wire's electrons. In the lab the wire is neutral and the force on the charge is magnetic. In the charge's own frame it is at rest, so there can be no magnetic force — yet it is still pulled. The answer is the Lorentz contraction: in that frame the positive ions move and crowd together, while the electrons stand still and spread out, so the wire is positively charged and the force is electric. Both descriptions give the same push ([[relativity-of-fields]]).

In a copper wire carrying 1 A through 1 mm², the electrons drift at about 0.07 mm/s, and $v^2/c^2 \\approx 6\\times10^{-26}$. The effect shows only because the charges are colossal: each metre of that wire holds some 14 000 C of moving electrons, balanced almost exactly by the ions. Magnetism is a tiny relativistic correction to an enormous electric force ([[em-introduction]]).
`,
  ideas: [
    'A moving charge feels F = qv × B; a wire feels F = IL × B.',
    '∇·B = 0: there are no magnetic charges, and field lines never end.',
    'Ampère\'s law: the circulation of B round any loop is μ₀ times the current through it (∇ × B = μ₀j).',
    'A straight wire: B = μ₀I/2πr in circles; a long solenoid: B = μ₀nI inside and almost nothing outside.',
    'Magnetic forces are electric forces seen from another frame: the Lorentz contraction of moving charges.'
  ],
  pitfalls: [
    'The magnetic force can do work on a charge — It is perpendicular to the velocity, so it never changes the speed; it only bends the path.',
    'If ∮B·ds = 0 round a loop, B is zero on the loop — Only the total circulation is zero; a wire outside the loop makes a field on it that adds up to nothing round the loop.',
    'Magnetism and electricity are separate forces — What one observer calls a magnetic force another calls an electric force; they are parts of one field.'
  ],
  formulas: [
    {
      name: 'Field of a long straight wire', expr: 'B = mu0*I/(2*pi*r)', tex: 'B = \\dfrac{\\mu_0 I}{2\\pi r}',
      vars: {
        B: { name: 'magnetic field', q: 'bfield', unit: 'µT' },
        mu0: { const: 'mu0' },
        I: { name: 'current', q: 'current', unit: 'A', value: 10 },
        r: { name: 'distance from the wire', q: 'length', unit: 'cm', value: 1 }
      },
      note: 'Circles round the wire, by the right-hand rule. From Ampère\'s law on a circle.',
      stories: { B: 'How strong is the field {r} from a wire carrying {I}?', r: 'How far from a wire carrying {I} does its field equal the Earth\'s {B}?' }
    },
    {
      name: 'Field inside a long solenoid', expr: 'B = mu0*N*I/L', tex: 'B = \\dfrac{\\mu_0 N I}{L}',
      vars: {
        B: { name: 'field inside', q: 'bfield', unit: 'mT' },
        mu0: { const: 'mu0' },
        N: { name: 'number of turns', q: 'count', value: 500, int: true },
        I: { name: 'current', q: 'current', unit: 'A', value: 2 },
        L: { name: 'length of the solenoid', q: 'length', unit: 'cm', value: 25 }
      },
      note: 'Long compared with its diameter; uniform inside, nearly zero outside. N/L is the number of turns per metre n.',
      stories: { B: 'A coil of {N} turns, {L} long, carries {I}. What is the field inside?', N: 'How many turns must a solenoid {L} long have to give {B} with {I}?' }
    },
    {
      name: 'Force between two parallel wires', expr: 'F = mu0*I1*I2*L/(2*pi*d)', tex: 'F = \\dfrac{\\mu_0 I_1 I_2 L}{2\\pi d}',
      vars: {
        F: { name: 'force on a length L of either wire', q: 'force', unit: 'N' },
        mu0: { const: 'mu0' },
        I1: { name: 'current in the first wire', q: 'current', unit: 'A', value: 100 },
        I2: { name: 'current in the second wire', q: 'current', unit: 'A', value: 100 },
        L: { name: 'length considered', q: 'length', unit: 'm', value: 1 },
        d: { name: 'distance between the wires', q: 'length', unit: 'cm', value: 5 }
      },
      note: 'Attraction for currents in the same direction, repulsion for opposite ones.',
      stories: { F: 'Two busbars {d} apart each carry {I1} and {I2}. What force acts on {L} of either?', d: 'How far apart are two wires carrying {I1} and {I2} if {L} of either feels {F}?' }
    },
    {
      name: 'Magnetic force on a moving charge', expr: 'F = q*v*B*sin(theta)', tex: 'F = q v B\\sin\\theta',
      vars: {
        F: { name: 'force', q: 'force', unit: 'N' },
        q: { name: 'charge', q: 'charge', unit: 'e', value: 1 },
        v: { name: 'speed', q: 'speed', unit: 'km/s', value: 1000 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'µT', value: 50 },
        theta: { name: 'angle between v and B', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'Perpendicular to both v and B. Zero when the charge moves along the field.',
      stories: { F: 'A proton moving at {v} crosses the Earth\'s field of {B} at {theta}. What force acts on it?', theta: 'A charge {q} moving at {v} in a field of {B} feels {F}. At what angle to the field is it moving?' }
    }
  ],
  examples: [
    {
      title: 'A compass near a cable',
      q: 'A cable carries 10 A. How close can a compass come before the cable\'s field equals the Earth\'s 50 µT?',
      steps: ['$r = \\mu_0I/2\\pi B = 2\\times10^{-7} \\times 10/5\\times10^{-5}$.', '$r = 0.04$ m = 4 cm.'],
      a: 'About 4 cm. (Household cables carry equal and opposite currents side by side, so their fields mostly cancel.)'
    },
    {
      title: 'A laboratory solenoid',
      q: 'A solenoid of 500 turns, 25 cm long, carries 2 A. Find the field inside and compare it with the Earth\'s.',
      steps: ['$n = 500/0.25 = 2000$ turns per metre.', '$B = \\mu_0nI = 1.2566\\times10^{-6} \\times 2000 \\times 2 = 5.0\\times10^{-3}$ T.'],
      a: '5.0 mT — a hundred times the Earth\'s field.'
    },
    {
      title: 'How small the relativistic effect is',
      q: 'Copper has $8.5\\times10^{28}$ free electrons per m³. For 1 A through a 1 mm² wire, find the moving charge per metre, the drift speed and $v^2/c^2$.',
      steps: [
        'Charge per metre: $\\lambda = neA = 8.5\\times10^{28} \\times 1.6\\times10^{-19} \\times 10^{-6} = 1.4\\times10^{4}$ C/m.',
        'Drift speed $v = I/\\lambda = 7\\times10^{-5}$ m/s.',
        '$v^2/c^2 = (7\\times10^{-5}/3\\times10^{8})^2 \\approx 6\\times10^{-26}$.'
      ],
      a: 'A minute relativistic correction, made visible by 14 000 C of charge per metre.'
    }
  ],
  quiz: [
    { q: 'The magnetic force on a moving charge does work on it.', a: false, why: 'The force is always perpendicular to the velocity, so F·v = 0.' },
    { q: 'An Ampère loop passes close to a wire but does not encircle it. The circulation ∮B·ds is…', choices: ['zero', 'μ₀I', 'positive but less than μ₀I', 'infinite'], a: 0, why: 'Only the current through the loop counts; on the near side B runs one way along the loop, on the far side the other.' },
    { q: 'Two long parallel wires carry currents in the same direction. They…', choices: ['attract', 'repel', 'feel no force', 'twist round each other'], a: 0, why: 'Each sits in the other\'s field, and I L × B points towards the other wire.' },
    { q: 'The field just outside the middle of a long solenoid is…', choices: ['nearly zero', 'the same as inside', 'twice as strong as inside', 'μ₀NI/2πr'], a: 0, why: 'The field lines return through the vast space outside, so the field there is very weak.' },
    { q: 'What is the field 5 cm from a long wire carrying 20 A?', answer: 80, unit: 'µT', why: 'B = μ₀I/2πr = 2 × 10⁻⁷ × 20/0.05 = 8 × 10⁻⁵ T.' }
  ],
  problems: [
    { q: 'How many turns does a 30 cm solenoid need to give 10 mT with 3 A?', answer: 796, tol: 0.02, hint: 'N = BL/μ₀I.',
      steps: ['$N = BL/\\mu_0I = 0.01 \\times 0.3/(1.2566\\times10^{-6} \\times 3) = 796$ turns.'] },
    { q: 'Two busbars 5 cm apart each carry 100 A. What force acts on 2 m of either?', answer: 0.08, unit: 'N', tol: 0.02, hint: 'F = μ₀I₁I₂L/2πd.',
      steps: ['$F = 2\\times10^{-7} \\times 100 \\times 100 \\times 2/0.05 = 0.08$ N.', 'In a short circuit the current may be a hundred times larger, and the force ten thousand times.'] }
  ],
  applications: [
    'Motors and loudspeakers turn the force IL × B into motion.',
    'MRI scanners use superconducting solenoids of 1.5–3 T; particle accelerators steer beams with magnets of several tesla.',
    'Busbars in substations are braced against the attraction between short-circuit currents, which can reach thousands of newtons per metre.'
  ],
  history: 'Hans Christian Ørsted found in 1820 that a current deflects a compass. Within months Jean-Baptiste Biot and Félix Savart measured the field of a wire, and André-Marie Ampère showed that parallel currents attract and worked out the force between circuits (1820–1826). Einstein opened his 1905 paper on relativity with an electromagnetic puzzle of just this kind — a magnet and a conductor in relative motion.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 13 (Magnetostatics) — the magnetic field and the force on a current, charge conservation, the field of steady currents and Ampère\'s law, the fields of a wire and a solenoid, and the relativity of magnetic and electric forces.',
    'Vol. II, ch. 14 (The Magnetic Field in Various Situations) — the vector potential of known currents, the straight wire and the solenoid, the small loop as a magnetic dipole, and the law of Biot and Savart.',
    'Vol. II, ch. 26 (Lorentz Transformations of the Fields) — how E and B mix for a moving observer.'
  ],
  sim: 'emf-wires'
},

{
  id: 'vector-potential', parent: 'magnetism-induction', title: 'The vector potential and its reality', level: 3,
  short: 'Because B has no divergence it can be written as the curl of a vector potential A. Outside a long solenoid B is zero but A is not — and electrons passing on either side of it have their interference fringes shifted by the flux inside (the Aharonov–Bohm effect). In quantum mechanics A is the field that acts where the particle is.',
  keywords: ['vector potential', 'gauge', 'gauge invariance', 'Aharonov–Bohm effect', 'solenoid', 'flux quantum', 'h/e', 'phase', 'electron interference', 'canonical momentum', 'SQUID', 'Chambers', 'Tonomura'],
  prereq: ['magnetostatics-feyn', 'vector-calculus-fields', 'bullets-waves-electrons'],
  related: ['induction-laws', 'superconductivity-feyn', 'probability-amplitudes', 'path-integral', 'electrostatic-analogs', 'retarded-potentials', 'physics:magnetic-flux'],
  body: `
### A field whose curl is B
Because $\\nabla\\cdot\\vec B = 0$ everywhere, $\\vec B$ can always be written as the [[?curl]] of another field:

$$\\vec B = \\nabla\\times\\vec A$$

$\\vec A$ is the **vector potential**. Like the electric potential it is not unique: adding the [[?gradient]] of any function, $\\vec A \\to \\vec A + \\nabla\\psi$, leaves $\\vec B$ unchanged, since the curl of a gradient is zero. Picking one of these equivalent potentials is called choosing a **gauge**. By [[?stokes-theorem|Stokes' theorem]], the circulation of $\\vec A$ round any loop is the [[?flux]] of $\\vec B$ through it:

$$\\oint \\vec A\\cdot d\\vec s = \\int \\vec B\\cdot\\hat n\\,da = \\Phi$$

### A looks like electrostatics
Put $\\vec B = \\nabla\\times\\vec A$ into Ampère's law and choose the [[?gauge]] with $\\nabla\\cdot\\vec A = 0$: each component of $\\vec A$ obeys Poisson's equation,

$$\\nabla^2\\vec A = -\\mu_0\\,\\vec j$$

just as $\\nabla^2\\phi = -\\rho/\\varepsilon_0$ ([[electrostatic-analogs]]). So currents make $\\vec A$ the way charges make $\\phi$, $\\vec A(1) = \\frac{\\mu_0}{4\\pi}\\int \\vec j(2)\\,dV_2/r_{12}$, and $\\vec A$ runs along the currents that make it: along a straight wire, round the turns of a coil.

### The long solenoid: A without B
Inside a long solenoid the field is uniform, $B = \\mu_0nI$; outside it is zero. Yet the circulation of $\\vec A$ round any circle outside the coil equals the flux $\\Phi$ inside — not zero. By symmetry $\\vec A$ circles the axis, so

$$A = \\frac{\\Phi}{2\\pi r}\\ \\ \\text{outside}, \\qquad A = \\frac{Br}{2}\\ \\ \\text{inside}$$

Outside, $\\vec A$ is the whirlpool field of the [[vector-calculus-fields|vector lab]]: it circles, yet its curl — the magnetic field — is zero. In the simulation the arrows of $\\vec A$ fill the whole region round the coil, where $\\vec B$ is exactly zero.

### Is A real?
Classically, forces come from $\\vec E$ and $\\vec B$ alone, and $\\vec A$ outside a solenoid looked like a convenience. Quantum mechanics changes that. A charge's [[?amplitude]] for a path gains an extra [[?phase]] $\\frac{q}{\\hbar}\\int\\vec A\\cdot d\\vec s$ along it. Send electrons through two slits with a thin, shielded solenoid between the paths behind the wall; the phases of the two paths then differ by

$$\\delta = \\frac{q}{\\hbar}\\oint\\vec A\\cdot d\\vec s = \\frac{q\\Phi}{\\hbar} = 2\\pi\\,\\frac{\\Phi}{h/e}$$

so the fringes shift by $\\Phi/(h/e)$ fringe spacings — although the electrons travel only where $\\vec B = 0$. This is the **Aharonov–Bohm effect**, predicted in 1959. $h/e = 4.14\\times10^{-15}$ Wb is a tiny flux: a magnetised iron whisker a micrometre thick carries hundreds of these units. Robert Chambers saw the shift with such a whisker in 1960; in 1986 Akira Tonomura's group removed every doubt with tiny ring magnets sealed in superconductor, which keeps all the field inside.

Feynman took this as the decisive reason to treat $\\vec A$ as a real field. Described with $\\vec B$ alone, the electron would be influenced by a field in a place it never visits; described with $\\vec A$, the influence is local — the phase is collected along the path, where $\\vec A$ is. The gauge freedom does no harm: adding $\\nabla\\psi$ changes each path's phase but not the difference round the closed loop, which is all the fringes can show.

### Where else A appears
In quantum mechanics the momentum that sets a charged particle's wavelength is $m\\vec v + q\\vec A$. Superconducting rings trap flux in units of $h/2e$, because the superconducting pairs carry charge $2e$ ([[superconductivity-feyn]]); SQUID magnetometers count those units and sense fields tens of billions of times weaker than the Earth's.
`,
  ideas: [
    'Since ∇·B = 0, B = ∇ × A for some vector potential A; A + ∇ψ gives the same B (gauge freedom).',
    'The circulation of A round a loop equals the magnetic flux through it.',
    'A obeys ∇²A = −μ₀j, the vector twin of Poisson\'s equation: currents make A as charges make φ.',
    'Outside a long solenoid B = 0 but A = Φ/2πr circles the coil.',
    'Quantum phases depend on ∮A·ds: electron fringes shift by Φ/(h/e) even where B = 0 (Aharonov–Bohm).'
  ],
  pitfalls: [
    'A is just a mathematical trick, since only B exerts forces — In quantum mechanics the phase of a charged particle depends on A along its path; the Aharonov–Bohm shift is measured where B = 0.',
    'If B = 0 in a region, A must be zero there — Outside a solenoid B = 0 but A circles the coil; only its curl vanishes.',
    'Because A is not unique, the Aharonov–Bohm shift depends on the gauge — Changing the gauge changes each path\'s phase, but not the difference round a closed loop, which equals the enclosed flux.'
  ],
  formulas: [
    {
      name: 'Vector potential outside a long solenoid', expr: 'A = Phi/(2*pi*r)', tex: 'A = \\dfrac{\\Phi}{2\\pi r}',
      vars: {
        A: { name: 'vector potential (circling the axis)', unit: 'T·m' },
        Phi: { name: 'magnetic flux inside the solenoid', q: 'flux', unit: 'µWb', value: 3.14, tex: '\\Phi' },
        r: { name: 'distance from the axis', q: 'length', unit: 'cm', value: 5 }
      },
      note: 'From ∮A·ds = Φ on a circle. Inside, A = Br/2. The unit T·m is the same as Wb/m.',
      stories: { A: 'A long solenoid holds {Phi}. How large is the vector potential {r} from its axis?', r: 'Where outside a solenoid holding {Phi} has the vector potential fallen to {A}?' }
    },
    {
      name: 'Flux in a solenoid', expr: 'Phi = B*pi*R^2', tex: '\\Phi = B\\,\\pi R^2',
      vars: {
        Phi: { name: 'flux', q: 'flux', unit: 'µWb', tex: '\\Phi' },
        B: { name: 'field inside', q: 'bfield', unit: 'mT', value: 10 },
        R: { name: 'radius of the solenoid', q: 'length', unit: 'cm', value: 1 }
      },
      note: 'Uniform field across a circular cross-section.',
      stories: { Phi: 'A solenoid of radius {R} has {B} inside. What flux does it carry?', B: 'What field must a solenoid of radius {R} hold to carry {Phi}?' }
    },
    {
      name: 'Aharonov–Bohm shift of the fringes', expr: 'N = qe*Phi/h', tex: 'N = \\dfrac{e\\,\\Phi}{h}',
      vars: {
        N: { name: 'shift, in fringe spacings', signed: true },
        qe: { const: 'qe' },
        Phi: { name: 'flux enclosed between the two paths', q: 'flux', unit: 'Wb', value: 1e-14, signed: true, tex: '\\Phi' },
        h: { const: 'h' }
      },
      note: 'The phase difference is δ = 2πN = eΦ/ħ. One fringe per h/e = 4.14 × 10⁻¹⁵ Wb.',
      stories: { N: 'A shielded solenoid carrying {Phi} sits between the two paths of an electron interferometer. By how many fringes does the pattern shift?', Phi: 'What enclosed flux shifts electron fringes by {N} fringe spacings?' }
    }
  ],
  examples: [
    {
      title: 'A round a laboratory solenoid',
      q: 'A long solenoid of radius 1 cm holds 10 mT. Find the flux, and A at 0.5 cm, 1 cm and 5 cm from the axis.',
      steps: [
        '$\\Phi = B\\pi R^2 = 0.01 \\times \\pi \\times 10^{-4} = 3.14\\times10^{-6}$ Wb.',
        'Inside, $A = Br/2$: at 0.5 cm, $2.5\\times10^{-5}$ T·m; at the surface, $5\\times10^{-5}$ T·m.',
        'Outside, $A = \\Phi/2\\pi r$: at 1 cm, $5\\times10^{-5}$ T·m (it joins smoothly); at 5 cm, $1.0\\times10^{-5}$ T·m.'
      ],
      a: '3.14 µWb; 2.5 × 10⁻⁵, 5 × 10⁻⁵ and 1.0 × 10⁻⁵ T·m.'
    },
    {
      title: 'How many fringes in a whisker?',
      q: 'An iron whisker 1 µm across is magnetised to 2 T along its length. By how many fringes would it shift an electron pattern?',
      steps: ['$\\Phi = B\\pi r^2 = 2 \\times \\pi \\times (0.5\\times10^{-6})^2 = 1.57\\times10^{-12}$ Wb.', '$N = e\\Phi/h = 1.57\\times10^{-12}/4.14\\times10^{-15} \\approx 380$.'],
      a: 'About 380 fringe spacings — so the flux must be tiny, or the whisker tapered, to see the shift clearly.'
    },
    {
      title: 'Half a fringe',
      q: 'What enclosed flux turns every bright fringe into a dark one?',
      steps: ['Bright and dark swap for a phase difference of π, that is $N = 1/2$.', '$\\Phi = h/2e = 2.07\\times10^{-15}$ Wb — the same number as the flux quantum of superconducting rings.'],
      a: '2.07 × 10⁻¹⁵ Wb.'
    }
  ],
  quiz: [
    { q: 'Outside a long ideal solenoid…', choices: ['B is zero but A is not', 'both B and A are zero', 'A is zero but B is not', 'both are non-zero'], a: 0, why: 'The circulation of A round the coil equals the flux inside, so A = Φ/2πr; but its curl, B, vanishes there.' },
    { q: 'Adding the gradient of any function to A…', choices: ['leaves B unchanged', 'doubles B', 'reverses B', 'makes B zero'], a: 0, why: 'The curl of a gradient is zero.' },
    { q: 'In the Aharonov–Bohm experiment, the shift of the fringes depends on…', choices: ['the magnetic flux enclosed between the two paths', 'the field B where the electrons pass', 'the length of the solenoid', 'the gauge chosen for A'], a: 0, why: 'The phase difference is eΦ/ħ, with Φ the flux the two paths enclose.' },
    { q: 'In the Aharonov–Bohm experiment the electrons are deflected by a magnetic force.', a: false, why: 'B is zero along their paths; only the phase of their amplitudes changes, which shifts the whole pattern.' },
    { q: 'What enclosed flux shifts the electron fringes by exactly one fringe spacing?', answer: 4.14e-15, unit: 'Wb', why: 'One fringe for a phase of 2π: Φ = h/e.' }
  ],
  problems: [
    { q: 'A long solenoid holds 5 µWb. How large is the vector potential 10 cm from its axis (in T·m)?', answer: 7.96e-6, unit: 'T·m', tol: 0.02, hint: 'A = Φ/2πr.',
      steps: ['$A = 5\\times10^{-6}/(2\\pi \\times 0.1) = 7.96\\times10^{-6}$ T·m.'] },
    { q: 'A flux of 1.0 × 10⁻¹⁴ Wb lies between the two paths of an electron interferometer. By how many fringe spacings does the pattern shift?', answer: 2.42, tol: 0.02, hint: 'N = Φ/(h/e).',
      steps: ['$h/e = 6.626\\times10^{-34}/1.602\\times10^{-19} = 4.14\\times10^{-15}$ Wb.', '$N = 10^{-14}/4.14\\times10^{-15} = 2.42$.'] }
  ],
  applications: [
    'SQUIDs count magnetic flux in units of h/2e and can record the faint fields of the working brain (magnetoencephalography).',
    'Electron holography measures the Aharonov–Bohm phase to map the magnetic field inside materials.',
    'Superconducting qubits are tuned by the flux threading small loops.'
  ],
  history: 'Werner Ehrenberg and Raymond Siday noticed the effect in 1949 in a paper on electron optics; Yakir Aharonov and David Bohm predicted it clearly in 1959, and Robert G. Chambers observed it in 1960. Akira Tonomura and colleagues at Hitachi removed the last doubts in 1986 with toroidal magnets covered by a superconductor.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 14 (The Magnetic Field in Various Situations) — the vector potential, its equation, and the vector potential of a straight wire and of a long solenoid.',
    'Vol. II, ch. 15 (The Vector Potential) — forces and energy of current loops, B and A in quantum mechanics — the two-slit experiment with a small solenoid between the slits — and which results of statics fail for changing fields.',
    'Vol. III, ch. 21 (The Schrödinger Equation in a Classical Context: A Seminar on Superconductivity) — the Schrödinger equation with a vector potential and the quantization of flux.'
  ],
  sim: 'emf-vecpot'
},

{
  id: 'induction-laws', parent: 'magnetism-induction', title: 'Induction and the flux rule', level: 2,
  short: 'Change the magnetic flux through a circuit and an emf appears, −dΦ/dt. Behind this one rule lie two different physics: the v × B force on charges in a moving wire, and the circulating electric field made by a changing B. Where the circuit\'s material changes, as in the Faraday disc, the rule can fail — the two underlying laws never do.',
  keywords: ['induction', 'Faraday\'s law', 'flux rule', 'emf', 'Lenz\'s law', 'motional emf', 'curl of E', 'Faraday disc', 'homopolar generator', 'rocking plates', 'eddy currents', 'betatron', 'inductance', 'generator'],
  prereq: ['magnetostatics-feyn', 'vector-calculus-fields', 'physics:faradays-law'],
  related: ['vector-potential', 'maxwell-equations-feyn', 'ac-circuits-feyn', 'angular-momentum-paradox', 'relativity-of-fields', 'physics:lenzs-law', 'physics:motional-emf', 'physics:generators', 'physics:inductance', 'physics:magnetic-flux'],
  body: `
### One rule
Change the magnetic [[?flux]] through a circuit and an emf appears — a push round the circuit, measured in volts:

$$\\mathcal{E} = -\\frac{d\\Phi}{dt}, \\qquad \\Phi = \\int \\vec B\\cdot\\hat n\\,da$$

It does not seem to matter how the flux changes — by moving the circuit, moving the magnet or turning up a current nearby. This is the **flux rule**, and its minus sign is **Lenz's law**: the induced current flows so as to oppose the change. That is why a magnet dropped down a copper pipe falls slowly, and why energy is conserved.

### Two different physics
Feynman drew attention to a curiosity here: the rule is simple and exact, yet it is carried by two unrelated mechanisms, and he insisted on seeing both.

1. **The circuit moves.** Charges carried along in a wire moving at $\\vec v$ feel $q\\,\\vec v\\times\\vec B$. For a rod of length $L$ crossing a field at speed $v$, this push along the rod adds up to $\\mathcal{E} = BLv$ — exactly the rate at which the rod sweeps up flux.
2. **The field changes.** A circuit at rest in a changing field feels no $\\vec v\\times\\vec B$ force. Instead the changing $\\vec B$ makes an electric field that circles round it, wire or no wire:

$$\\nabla\\times\\vec E = -\\frac{\\partial\\vec B}{\\partial t}, \\qquad \\oint\\vec E\\cdot d\\vec s = -\\frac{d}{dt}\\int\\vec B\\cdot\\hat n\\,da$$

This is Faraday's law in local form — a [[?curl]] of $\\vec E$ — and, by [[?stokes-theorem|Stokes' theorem]], in integral form. Its lines of $\\vec E$ close on themselves, with no charges to start or end on. Transformers work this way, and the betatron accelerates electrons round a ring with nothing but this circulating field.

In the simulation, move the loop through the magnet's field and compare the graphs: the emf is minus the slope of the flux. Then hold the loop still and let the field change: the same kind of emf, but now the circulating $\\vec E$ appears.

### Exceptions to the flux rule
The rule works when the circuit is made of the same material all along. When the material in the circuit keeps changing, it can fail; then go back to the two laws that always hold, $\\vec F = q(\\vec E + \\vec v\\times\\vec B)$ and $\\nabla\\times\\vec E = -\\partial\\vec B/\\partial t$.

- **The Faraday disc.** A copper disc spins in a steady field, with sliding contacts at the axle and the rim wired to a meter. The circuit — the wires and the straight path through the disc from axle to rim — never changes, and neither does its flux. Yet the meter shows a steady emf $\\frac12B\\omega R^2$, from the $\\vec v\\times\\vec B$ force on the charges in the spinning copper. It is a working generator.
- **Rocking plates.** Two slightly curved metal plates touch at one point in a field and are rocked, so the point of contact moves. The circuit through the contact swings over a large area and its flux changes a lot — but almost no emf appears, because the metal itself hardly moves.

The third setting of the simulation is the Faraday disc: the flux through the circuit stays fixed while the meter reads about 1.6 V.

### Inductance
A changing current changes its own flux, so every circuit resists changes of its current: $\\mathcal{E} = -L\\,dI/dt$, with $L$ the self-inductance, and a current $I$ stores $\\frac12LI^2$ in its magnetic field. Two circuits linked by flux have a mutual inductance — the principle of the transformer ([[ac-circuits-feyn]]).
`,
  ideas: [
    'Flux rule: the emf round a circuit is −dΦ/dt, however the flux changes.',
    'Moving conductor: the emf is the v × B force on its charges (BLv for a rod).',
    'Changing field: ∇ × E = −∂B/∂t, an electric field circling the changing flux, with or without a wire.',
    'Lenz\'s law: induced currents oppose the change that makes them.',
    'When the conducting material in the circuit changes (Faraday disc, rocking plates) the flux rule can fail; F = q(E + v × B) and ∇ × E = −∂B/∂t never do.'
  ],
  pitfalls: [
    'A loop moving through a magnetic field always has an emf — In a uniform field the pushes on its front and back edges cancel; only a changing flux gives a net emf.',
    'The induced electric field needs a wire to exist — The changing B makes a circulating E in empty space; the wire only gives the charges a path.',
    'No change of flux means no emf — In the Faraday disc the flux through the circuit is constant, yet the v × B force on the moving copper drives a steady current.'
  ],
  formulas: [
    {
      name: 'emf of a rod moving across a field', expr: 'emf = B*L*v', tex: '\\mathcal{E} = B L v',
      vars: {
        emf: { name: 'emf', q: 'voltage', unit: 'V', tex: '\\mathcal{E}' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.5 },
        L: { name: 'length of the rod', q: 'length', unit: 'cm', value: 10 },
        v: { name: 'speed across the field', q: 'speed', unit: 'm/s', value: 2 }
      },
      note: 'Rod, field and velocity mutually perpendicular. The same as the rate at which the rod sweeps up flux.',
      stories: { emf: 'A {L} rod slides at {v} across a {B} field. What emf appears between its ends?', v: 'How fast must a {L} rod cross a {B} field to give {emf}?' }
    },
    {
      name: 'emf in a coil in a changing field', expr: 'emf = N*A*dB', tex: '\\mathcal{E} = N A \\dot{B}',
      vars: {
        emf: { name: 'emf', q: 'voltage', unit: 'V', tex: '\\mathcal{E}' },
        N: { name: 'number of turns', q: 'count', value: 100, int: true },
        A: { name: 'area of each turn', q: 'area', unit: 'cm²', value: 20 },
        dB: { name: 'rate of change of B', unit: 'T/s', value: 0.5, tex: '\\dot{B}' }
      },
      note: 'Field uniform over the coil and perpendicular to it. Each turn adds the same emf.',
      stories: { emf: 'A coil of {N} turns, each of {A}, sits in a field changing at {dB}. What emf does it give?', dB: 'How fast must the field through {N} turns of {A} change to induce {emf}?' }
    },
    {
      name: 'Peak emf of a rotating-coil generator', expr: 'emf = N*B*A*omega', tex: '\\mathcal{E}_0 = N B A\\,\\omega',
      vars: {
        emf: { name: 'peak emf', q: 'voltage', unit: 'V', tex: '\\mathcal{E}_0' },
        N: { name: 'number of turns', q: 'count', value: 200, int: true },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.2 },
        A: { name: 'area of the coil', q: 'area', unit: 'cm²', value: 100 },
        omega: { name: 'angular speed', q: 'angvel', unit: 'rad/s', value: 314, tex: '\\omega' }
      },
      note: 'The flux NBA cos ωt gives an emf NBAω sin ωt: alternating current. 314 rad/s is 50 Hz.',
      stories: { emf: 'A coil of {N} turns and {A} turns at {omega} in a {B} field. What is the peak emf?', omega: 'How fast must a {N}-turn coil of {A} spin in {B} to reach a peak emf of {emf}?' }
    },
    {
      name: 'emf of a Faraday disc', expr: 'emf = B*omega*R^2/2', tex: '\\mathcal{E} = \\tfrac12 B\\omega R^2',
      vars: {
        emf: { name: 'emf between axle and rim', q: 'voltage', unit: 'V', tex: '\\mathcal{E}' },
        B: { name: 'magnetic field (along the axle)', q: 'bfield', unit: 'T', value: 1 },
        omega: { name: 'rotation speed', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' },
        R: { name: 'radius of the disc', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'The v × B push integrated from the axle to the rim, ∫₀ᴿ Bωr dr — although the flux through the circuit never changes.',
      stories: { emf: 'A disc of radius {R} spins at {omega} in a {B} field. What emf appears between its axle and rim?', omega: 'How fast must a disc of radius {R} spin in {B} to give {emf}?' }
    }
  ],
  examples: [
    {
      title: 'An aircraft\'s wings',
      q: 'An airliner with a 60 m wingspan flies at 250 m/s where the vertical component of the Earth\'s field is 40 µT. What emf appears between its wingtips?',
      steps: ['$\\mathcal{E} = BLv = 40\\times10^{-6} \\times 60 \\times 250 = 0.6$ V.', 'A voltmeter on board cannot read it: its own leads sweep across the same field and pick up the same emf.'],
      a: '0.6 V — real, but impossible to use from inside the plane.'
    },
    {
      title: 'A loop leaving a magnet',
      q: 'A square loop of side 10 cm and resistance 0.01 Ω leaves a 0.5 T field at 2 m/s. Find the emf, the current, the braking force and the power.',
      steps: [
        'Only the trailing side is still in the field: $\\mathcal{E} = BLv = 0.5 \\times 0.1 \\times 2 = 0.1$ V.',
        '$I = \\mathcal{E}/R = 10$ A, flowing so as to keep the flux from falling (Lenz).',
        'Force on the trailing side: $F = BIL = 0.5 \\times 10 \\times 0.1 = 0.5$ N, opposing the motion.',
        'Power: $Fv = 1$ W, which equals $I^2R = 1$ W — the work of pulling becomes heat.'
      ],
      a: '0.1 V, 10 A, 0.5 N of braking, 1 W of heat.'
    },
    {
      title: 'A Faraday disc',
      q: 'A copper disc of radius 10 cm spins at 3000 rpm in a 1 T field along its axle. What emf does it give?',
      steps: ['$\\omega = 3000 \\times 2\\pi/60 = 314$ rad/s.', '$\\mathcal{E} = \\frac12B\\omega R^2 = 0.5 \\times 1 \\times 314 \\times 0.01 = 1.57$ V.'],
      a: '1.57 V, steady — direct current, at very low resistance.'
    }
  ],
  quiz: [
    { q: 'A loop slides, without turning, through a uniform field that fills all space. The emf round it is…', choices: ['zero', 'BLv', '2BLv', 'it depends only on the speed'], a: 0, why: 'The flux does not change: the v × B pushes on the leading and trailing sides are equal and cancel round the loop.' },
    { q: 'A magnet is pushed, north pole first, towards a copper ring. The current induced in the ring…', choices: ['repels the magnet', 'attracts the magnet', 'does not affect it', 'flows only after the magnet stops'], a: 0, why: 'Lenz: the ring makes a north pole facing the approaching north pole, opposing the rise of flux.' },
    { q: 'In a Faraday disc, the flux through the circuit…', choices: ['stays constant, yet there is an emf', 'changes at the rate ½BωR²', 'is zero, so there is no emf', 'oscillates at the rotation frequency'], a: 0, why: 'The circuit path does not change, but the copper moving through it carries charges pushed by v × B.' },
    { q: 'A changing magnetic field produces a circulating electric field even where there is no wire.', a: true, why: '∇ × E = −∂B/∂t holds in empty space; the betatron and the transformer both use it.' },
    { q: 'A 0.5 m rod moves at 4 m/s across a 0.2 T field. What emf appears between its ends?', answer: 0.4, unit: 'V', why: 'BLv = 0.2 × 0.5 × 4 = 0.4 V.' }
  ],
  problems: [
    { q: 'A 50-turn coil of 30 cm² sits in a field that falls steadily from 0.8 T to zero in 0.1 s. What is the emf?', answer: 1.2, unit: 'V', tol: 0.02, hint: 'NA·dB/dt.',
      steps: ['$dB/dt = 0.8/0.1 = 8$ T/s.', '$\\mathcal{E} = NA\\,dB/dt = 50 \\times 0.003 \\times 8 = 1.2$ V.'] },
    { q: 'A Faraday disc of radius 15 cm spins in 0.5 T. What angular speed gives 1 V?', answer: 178, unit: 'rad/s', tol: 0.02, hint: 'ω = 2ℰ/BR².',
      steps: ['$\\omega = 2 \\times 1/(0.5 \\times 0.15^2) = 178$ rad/s, about 1700 rpm.'] }
  ],
  applications: [
    'Power-station generators, bicycle dynamos, transformers, induction hobs and wireless phone chargers all run on induction.',
    'Eddy-current brakes slow trains and roller coasters without contact; metal detectors sense the eddy currents they induce.',
    'Homopolar (Faraday-disc) generators deliver enormous currents at low voltage for pulsed-power experiments.'
  ],
  history: 'Michael Faraday discovered induction on 29 August 1831 with two coils wound on an iron ring, and built his disc generator later that year. Joseph Henry found the effect independently in America at about the same time, and Heinrich Lenz stated his rule for the direction of the induced current in 1834.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 16 (Induced Currents) — motors and generators, transformers and inductances, forces on induced currents, and electrical technology.',
    'Vol. II, ch. 17 (The Laws of Induction) — the physics of induction, exceptions to the flux rule (the Faraday disc and the rocking plates), the betatron, a paradox, the alternating-current generator, mutual and self-inductance, and magnetic energy.'
  ],
  sim: 'emf-flux-rule'
}

);
