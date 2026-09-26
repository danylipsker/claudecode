/* HYPER-PHYSICS · content/induction.js — electromagnetic induction: changing magnetic
 * flux drives currents; generators, inductors and transformers. */
Hyper.add(

{
  id: 'magnetic-flux', parent: 'induction', title: 'Magnetic flux', level: 1,
  short: 'How much magnetic field passes through a surface: field × area × the cosine of the tilt, measured in webers.',
  keywords: ['magnetic flux', 'weber', 'Wb', 'Φ = BA cos θ', 'flux linkage', 'flux density', 'field lines through a loop', 'Gauss\'s law for magnetism', 'area vector'],
  prereq: ['magnetic-field', 'math:dot-product', 'math:flux-integrals'],
  related: ['faradays-law', 'gauss-law', 'inductance', 'solenoid'],
  body: `
Hold a wire loop in a magnetic field and ask: how much of the field goes *through* it? Picture the field lines threading the loop. Face the loop squarely into the field and it catches the most lines; tilt it and it catches fewer; turn it edge-on and none pass through at all. That quantity is the **magnetic flux** through the loop.

### The formula
For a flat surface of area $A$ in a uniform field $B$,

$$\\Phi = B A\\cos\\theta$$

where $\\theta$ is the angle between the field and the **normal** to the surface (the direction perpendicular to it). Face-on, $\\theta = 0$ and $\\Phi = BA$; edge-on, $\\theta = 90°$ and $\\Phi = 0$; turned right over, $\\theta = 180°$ and the flux is $-BA$ — the field now goes through the other way. In vector language, $\\Phi = \\vec B\\cdot\\vec A$, a [[math:dot-product|dot product]] with an area vector $\\vec A$ along the normal. For curved surfaces or a non-uniform field, add up the pieces: $\\Phi = \\int \\vec B\\cdot d\\vec A$ (see [[math:flux-integrals|flux integrals]]).

The unit is the **weber**: $1\\ \\mathrm{Wb} = 1\\ \\mathrm{T\\,m^2}$. Turned round, the tesla is a weber per square metre, which is why $B$ is sometimes called the **magnetic flux density**.

### Flux linkage
A coil of $N$ turns wound so that every turn encloses the same flux $\\Phi$ has a **flux linkage** $N\\Phi$. It is the flux linkage, not the flux, that matters for [[faradays-law|induction]]: each turn contributes its own EMF, and the turns are in series.

### Sizes
The Earth's field in Britain has a vertical part of about 45 µT, so a horizontal window of 1 m² has about 45 µWb through it. A solenoid of 1000 turns, 20 cm long with a 4 cm² cross-section, carrying 1 A, has a field of 6.3 mT inside, a flux of 2.5 µWb through each turn, and a flux linkage of 2.5 mWb.

### Closed surfaces
Every field line that enters a closed surface must leave it again — field lines never end, because there are no magnetic monopoles. So the net flux out of *any* closed surface is zero:

$$\\oint \\vec B\\cdot d\\vec A = 0$$

This is Gauss's law for magnetism, one of [[maxwells-equations|Maxwell's equations]]. Compare the electric version, [[gauss-law|Gauss's law]], where the net flux counts the charge inside.

### Why flux matters
Faraday discovered that an EMF appears whenever the flux through a circuit **changes**. There are three ways to change it — and each is the basis of a technology:

| Change | Example |
|---|---|
| the field $B$ | a magnet pushed into a coil; a [[transformers|transformer]] |
| the area $A$ | a rod sliding on rails ([[motional-emf]]) |
| the angle $\\theta$ | a coil spinning in a [[generators|generator]] |
`,
  ideas: [
    'Magnetic flux measures the field passing through a surface: Φ = BA cos θ, with θ measured from the normal.',
    'The weber is a tesla square metre; B is flux per unit area.',
    'A coil of N turns has a flux linkage NΦ.',
    'The net flux out of any closed surface is zero, because field lines never end.'
  ],
  pitfalls: [
    'The flux is largest when the loop lies parallel to the field — It is largest when the field passes straight through the loop, along its normal (θ = 0). Parallel to the field, the flux is zero.',
    'Magnetic flux and magnetic field are the same thing — Field is flux per unit area. A weak field through a big loop can carry more flux than a strong field through a small one.'
  ],
  formulas: [
    {
      name: 'Flux through a flat loop',
      expr: 'Phi = B*A*cos(theta)', tex: '\\Phi = B A\\cos\\theta',
      vars: {
        Phi: { name: 'magnetic flux', q: 'flux', unit: 'mWb', signed: true },
        B: { name: 'magnetic field', q: 'bfield', unit: 'mT', value: 200 },
        A: { name: 'area of the loop', q: 'area', unit: 'cm²', value: 50 },
        theta: { name: 'angle between the field and the loop\'s normal', q: 'angle', unit: '°', value: 30, min: 0, max: 180 }
      },
      stories: {
        Phi: 'A loop of area {A} sits in a uniform {B} field, its normal at {theta} to the field. What flux passes through it?',
        theta: 'A loop of area {A} in a {B} field has a flux of {Phi} through it. At what angle is its normal to the field?'
      }
    },
    {
      name: 'Flux through each turn of a solenoid',
      expr: 'Phi = mu0*N*I*A/L', tex: '\\Phi = \\frac{\\mu_0 N I A}{L}',
      vars: {
        Phi: { name: 'flux through one turn', q: 'flux', unit: 'µWb' },
        mu0: { const: 'mu0' },
        N: { name: 'number of turns', q: 'count', value: 1000, int: true },
        I: { name: 'current', q: 'current', unit: 'A', value: 1 },
        A: { name: 'cross-section of the coil', q: 'area', unit: 'cm²', value: 4 },
        L: { name: 'length of the solenoid', q: 'length', unit: 'cm', value: 20 }
      },
      note: 'The field inside a long [[solenoid]], $\\mu_0 N I/L$, times its cross-section. Multiply by $N$ for the flux linkage.'
    }
  ],
  examples: [
    {
      title: 'Tilting a loop',
      q: 'A rectangular loop 30 cm × 20 cm sits in a uniform 0.10 T field. Find the flux through it when it faces the field, when its normal is at 60° to the field, and when it is edge-on.',
      steps: [
        'Area: $A = 0.30 \\times 0.20 = 0.060\\ \\mathrm{m^2}$.',
        'Face-on: $\\Phi = BA = (0.10)(0.060) = 6.0\\times10^{-3}$ Wb $= 6.0$ mWb.',
        'At 60°: $\\Phi = BA\\cos 60° = 3.0$ mWb.',
        'Edge-on ($\\theta = 90°$): $\\Phi = 0$.'
      ],
      a: '6.0 mWb, 3.0 mWb and 0.'
    }
  ],
  quiz: [
    { q: 'A loop is turned so that its plane is parallel to the field lines. The flux through it is…', choices: ['as large as possible', 'zero', 'half the maximum', 'negative'], a: 1,
      why: 'The field lines slide past without passing through: the normal is at 90° to the field and $\\cos 90° = 0$.' },
    { q: 'The net magnetic flux out of any closed surface is…', choices: ['always zero', 'μ₀ times the current inside', 'positive if a north pole is inside', 'the magnetic charge inside divided by μ₀'], a: 0,
      why: 'Field lines never begin or end, so every line that enters also leaves. That is Gauss\'s law for magnetism.' },
    { q: 'A loop\'s area is doubled and the field through it is halved. The flux…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 2, why: '$\\Phi = BA\\cos\\theta$: $2 \\times \\tfrac12 = 1$.' },
    { q: 'One weber is the same as one tesla square metre.', a: true, why: 'Flux is field times area, so 1 Wb = 1 T·m². Equivalently, 1 T = 1 Wb/m².' }
  ],
  applications: [
    'Search coils and flux meters that measure fields by the flux change when they are flipped or removed.',
    'Transformer and motor design, which is largely the design of paths for magnetic flux through iron.',
    'Generators and alternators, whose output depends on how fast the flux through their coils changes.'
  ],
  sim: 'em2-generator'
},

{
  id: 'faradays-law', parent: 'induction', title: 'Faraday\'s law', level: 2,
  short: 'A changing magnetic flux through a circuit induces an EMF equal to the rate of change of the flux linkage: ℰ = −N dΦ/dt.',
  keywords: ['Faraday\'s law', 'electromagnetic induction', 'induced EMF', 'induced current', 'flux linkage', 'rate of change of flux', 'search coil', 'induced electric field', 'emf'],
  prereq: ['magnetic-flux', 'emf-internal-resistance', 'math:derivative'],
  related: ['lenzs-law', 'motional-emf', 'generators', 'transformers', 'inductance', 'maxwells-equations'],
  body: `
In 1831 Michael Faraday wound two coils on an iron ring, connected one to a battery and the other to a galvanometer. A steady current in the first coil did nothing to the meter. But at the instant he **connected** the battery the needle flicked one way, and when he **disconnected** it the needle flicked the other way. A current appears in a circuit only while the magnetic flux through it is **changing**.

### The law
The EMF induced in a coil of $N$ turns equals the rate of change of its [[magnetic-flux|flux linkage]]:

$$\\mathcal{E} = -N\\,\\frac{d\\Phi}{dt}$$

The minus sign is [[lenzs-law|Lenz's law]]: the EMF drives a current that opposes the change. Over a finite interval the average EMF is $\\mathcal{E} = N\\,\\Delta\\Phi/\\Delta t$. The units work because a weber per second is a volt.

Everything here is about *rate*. The same flux change made ten times faster gives ten times the EMF; a flux, however large, that does not change gives none. Try it in the simulation: push the magnet slowly, then quickly, and compare the EMF graph with the slope of the flux graph.

### Three ways to change the flux
Since $\\Phi = BA\\cos\\theta$, you can change the field (move a magnet, or change the current in a nearby coil — the principle of the [[transformers|transformer]]), change the area (a sliding rod, [[motional-emf]]), or change the angle (a spinning coil, the [[generators|generator]]).

### How big?
Push a magnet into a 200-turn coil so that the flux through each turn rises by 0.5 mWb in a tenth of a second: $\\mathcal{E} = 200 \\times 5\\times10^{-4}/0.1 = 1$ V. If the circuit has resistance $R$, a current $I = \\mathcal{E}/R$ flows, and the **total charge** that passes is

$$Q = \\int I\\,dt = \\frac{N\\,\\Delta\\Phi}{R}$$

which does not depend on how fast the change was made. Old "ballistic" flux meters used exactly this.

### What pushes the charges?
In a stationary coil near a moving magnet, the electrons are not moving, so no magnetic force acts on them. Something else must push them round: a changing magnetic field creates an **electric field** that circulates around the region where $B$ changes,

$$\\oint \\vec E\\cdot d\\vec l = -\\frac{d\\Phi}{dt}$$

This field exists whether or not a wire is there to feel it. Unlike the field of static charges it has no potential — its lines close on themselves — and it is one of [[maxwells-equations|Maxwell's equations]]. It drives the eddy currents in a solid block of metal, heats the pan on an induction hob, and accelerates electrons in a betatron.

> [!key] No change of flux, no EMF. Induction depends on how fast the flux changes, not on how big it is.
`,
  ideas: [
    'An EMF is induced whenever the flux linkage of a circuit changes: ℰ = −N dΦ/dt.',
    'The faster the change, the larger the EMF; a steady flux, however large, induces nothing.',
    'Flux can be changed by changing the field, the area or the orientation.',
    'The charge driven round a circuit, Q = NΔΦ/R, does not depend on how fast the change happens.',
    'A changing magnetic field creates a circulating electric field, even in empty space.'
  ],
  pitfalls: [
    'A strong magnetic field induces a large EMF — Only a changing flux induces an EMF. A coil sitting still in a huge steady field has none.',
    'Moving a loop through a field always induces an EMF — Only if the flux through it changes. Sliding a loop around inside a uniform field changes nothing.',
    'The induced EMF depends on the size of the flux — It depends on how fast the flux changes. Doing the same change ten times faster gives ten times the EMF.'
  ],
  derivation: {
    title: 'The electric field made by a changing magnetic field',
    steps: [
      { text: 'Take a long cylindrical region where a uniform field $B$ is changing at a rate $dB/dt$. By symmetry the induced electric field circles the axis, with the same size all round a circle of radius $r$:', tex: '\\oint \\vec E\\cdot d\\vec l = E\\,(2\\pi r)' },
      { text: 'The flux through that circle (inside the region) is $\\pi r^2 B$, so Faraday\'s law gives, in size,', tex: 'E\\,(2\\pi r) = \\pi r^2\\,\\frac{dB}{dt}' },
      { text: 'The induced field grows with distance from the axis:', tex: 'E = \\frac{r}{2}\\,\\frac{dB}{dt}' },
      { text: 'A conducting ring of radius $r$ placed there feels an EMF $\\pi r^2\\,dB/dt$ around it — the same answer as the flux rule, now explained as a force on the charges.' }
    ]
  },
  formulas: [
    {
      name: 'Average induced EMF',
      expr: 'emf = N*dPhi/t', tex: '\\mathcal{E} = N\\,\\frac{\\Delta\\Phi}{\\Delta t}',
      vars: {
        emf: { name: 'induced EMF (size)', q: 'voltage', unit: 'V', tex: '\\mathcal{E}' },
        N: { name: 'number of turns', q: 'count', value: 200, int: true },
        dPhi: { name: 'change of flux through each turn', q: 'flux', unit: 'mWb', value: 0.5, tex: '\\Delta\\Phi' },
        t: { name: 'time taken', q: 'time', unit: 's', value: 0.1, tex: '\\Delta t' }
      },
      stories: {
        emf: 'A magnet pushed into a {N}-turn coil raises the flux through each turn by {dPhi} in {t}. What average EMF is induced?',
        t: 'How quickly must the flux through each turn of a {N}-turn coil change by {dPhi} to induce an average of {emf}?',
        N: 'A flux change of {dPhi} per turn in {t} must induce {emf}. How many turns does the coil need?'
      }
    },
    {
      name: 'Charge driven by a flux change',
      expr: 'Q = N*dPhi/R', tex: 'Q = \\frac{N\\,\\Delta\\Phi}{R}',
      vars: {
        Q: { name: 'charge that flows', q: 'charge', unit: 'mC' },
        N: { name: 'number of turns', q: 'count', value: 200, int: true },
        dPhi: { name: 'change of flux through each turn', q: 'flux', unit: 'mWb', value: 0.5, tex: '\\Delta\\Phi' },
        R: { name: 'total resistance of the circuit', q: 'resistance', unit: 'Ω', value: 20 }
      },
      note: 'Independent of how quickly the flux changes: a faster change gives a bigger current for a shorter time.',
      stories: {
        Q: 'A {N}-turn search coil in a circuit of total resistance {R} is pulled out of a field, so the flux through each turn falls by {dPhi}. How much charge flows?',
        dPhi: 'A meter records {Q} passing when a {N}-turn coil (circuit resistance {R}) is flipped out of a field. By how much did the flux through each turn change?'
      }
    },
    {
      name: 'EMF from a steadily changing field',
      expr: 'emf = N*A*Bdot', tex: '\\mathcal{E} = N A\\,\\dot B',
      vars: {
        emf: { name: 'induced EMF', q: 'voltage', unit: 'mV', tex: '\\mathcal{E}' },
        N: { name: 'number of turns', q: 'count', value: 50, int: true },
        A: { name: 'area of each turn', q: 'area', unit: 'cm²', value: 20 },
        Bdot: { name: 'rate of change of the field, dB/dt', unit: 'T/s', value: 0.5, tex: '\\dot B' }
      },
      note: 'For a flat coil facing the field, with the field changing at a steady rate $\\dot B = dB/dt$.',
      stories: { emf: 'A field through a {N}-turn coil of area {A} (facing the field) is ramped up at {Bdot}. What EMF appears across the coil?' }
    }
  ],
  examples: [
    {
      title: 'Pulling a coil out of a magnet',
      q: 'A 100-turn coil of area 4.0 cm² sits between the poles of a magnet where $B = 0.50$ T, facing the field. It is pulled out in 0.050 s. The coil and meter have a total resistance of 5.0 Ω. Find the average EMF, the average current and the charge that flows.',
      steps: [
        'Flux change per turn: $\\Delta\\Phi = BA = (0.50)(4.0\\times10^{-4}) = 2.0\\times10^{-4}$ Wb.',
        'Average EMF: $\\mathcal{E} = N\\Delta\\Phi/\\Delta t = (100)(2.0\\times10^{-4})/0.050 = 0.40$ V.',
        'Average current: $I = \\mathcal{E}/R = 0.40/5.0 = 0.080$ A.',
        'Charge: $Q = I\\Delta t = 4.0\\times10^{-3}$ C — or directly, $N\\Delta\\Phi/R = 0.020/5.0$. Pull it out twice as fast and the current doubles but the charge is the same.'
      ],
      a: '0.40 V, 80 mA and 4.0 mC.'
    },
    {
      title: 'An induced electric field in empty space',
      q: 'Inside a large coil, a uniform field is switched at a rate of 20 T/s (typical of the gradient coils of an MRI scanner). Find the induced electric field 10 cm from the axis, and the EMF around a loop of that radius.',
      steps: [
        '$E = \\dfrac{r}{2}\\dfrac{dB}{dt} = \\dfrac{0.10}{2}(20) = 1.0$ V/m.',
        '$\\mathcal{E} = \\pi r^2\\,\\dfrac{dB}{dt} = \\pi(0.10)^2(20) = 0.63$ V.'
      ],
      a: '1.0 V/m, and 0.63 V around the loop — the reason MRI scanners limit how fast they switch their fields: the induced currents can stimulate nerves.'
    }
  ],
  quiz: [
    { q: 'A strong magnet rests inside a coil connected to a meter. The meter reads…', choices: ['a large steady current', 'zero', 'a slowly decaying current', 'an alternating current'], a: 1,
      why: 'The flux through the coil is large but not changing, so no EMF is induced.' },
    { q: 'You push a magnet into a coil twice as fast as before. The peak EMF ___, and the total charge that flows round the circuit ___.', choices: ['doubles; doubles', 'doubles; stays the same', 'stays the same; doubles', 'quadruples; doubles'], a: 1,
      why: 'The EMF depends on the rate $d\\Phi/dt$, which doubles. The charge $Q = N\\Delta\\Phi/R$ depends only on the total change.' },
    { q: 'Which of these does NOT induce an EMF in a flat loop?', choices: ['Rotating it in a steady field', 'Changing the strength of the field through it', 'Sliding it sideways inside a uniform field that fills all space', 'Squashing it to a smaller area'], a: 2,
      why: 'In a uniform field, moving the loop without turning or deforming it leaves the flux unchanged.' },
    { q: 'A changing magnetic field creates an electric field even where there is no wire.', a: true,
      why: 'The induced electric field is a real field in space; a wire just gives charges a path along which it can drive them.' },
    { q: 'A weber per second is the same as…', choices: ['a tesla', 'a volt', 'an ampere', 'a henry'], a: 1, why: '$\\mathcal{E} = d\\Phi/dt$, so the unit of EMF, the volt, equals Wb/s.' }
  ],
  applications: [
    'Generators, alternators and bicycle dynamos.',
    'Transformers and wireless phone chargers.',
    'Induction hobs, which heat the pan by eddy currents.',
    'Electric-guitar pickups, metal detectors and the coils that read magnetic stripes.'
  ],
  history: 'Michael Faraday found induction on 29 August 1831 with his iron ring, and within weeks had made the first generator, a copper disc spun between magnet poles. Joseph Henry had noticed the same effect independently in the United States.',
  sim: 'em2-magnet-coil'
},

{
  id: 'lenzs-law', parent: 'induction', title: 'Lenz\'s law', level: 2,
  short: 'An induced current always flows in the direction that opposes the change that caused it — the minus sign in Faraday\'s law, and energy conservation in action.',
  keywords: ['Lenz\'s law', 'direction of induced current', 'opposes the change', 'eddy currents', 'magnetic braking', 'magnet in a copper pipe', 'jumping ring', 'energy conservation', 'minus sign'],
  prereq: ['faradays-law', 'conservation-of-energy'],
  related: ['motional-emf', 'inductance', 'generators', 'field-of-wire'],
  body: `
Faraday's law tells you how big an induced EMF is. **Lenz's law** tells you which way it drives the current:

> [!key] The induced current flows so that its own magnetic field opposes the change in flux that produced it.

That is the minus sign in $\\mathcal{E} = -N\\,d\\Phi/dt$.

### Using it
1. Decide which way the field through the loop points, and whether the flux is **increasing** or **decreasing**.
2. If it is increasing, the induced current makes a field *against* it inside the loop; if decreasing, a field *along* it, trying to keep it up.
3. Use the right-hand grip rule ([[field-of-wire]]) to turn that field direction into a current direction.

Push the north pole of a magnet towards a coil and the coil's near end becomes a **north** pole, repelling the magnet. Pull it away and the near end becomes a **south** pole, attracting it back. Either way, the coil fights the motion. In the simulation, watch the induced poles and the force on the magnet.

### Why it must be so
Suppose the induced current *helped* the change. Pushing a magnet towards a coil would make the coil attract it, pulling it in faster, inducing a larger current, attracting it harder... A tiny nudge would produce unlimited kinetic and electrical energy from nothing. Lenz's law is [[conservation-of-energy|energy conservation]]: because the induced current opposes you, you must do work to push the magnet, and that work is exactly the electrical energy that appears in the circuit (and finally heats it).

### Eddy currents
In a solid piece of metal the induced currents swirl in closed loops — **eddy currents** — and by Lenz's law they always resist the motion or change that causes them:

- A strong magnet dropped down a copper pipe falls slowly, at a steady speed, as if through honey. Its lost gravitational energy heats the pipe.
- **Eddy-current brakes** on trains, roller coasters and drop towers stop things smoothly with no contact and no wear — and the braking force fades to zero as they stop.
- In a **jumping-ring** demonstration an aluminium ring on an iron core leaps into the air when an AC coil below is switched on: the currents induced in it repel it from the coil.
- Eddy currents also waste energy: transformer cores are built from thin insulated sheets to break up their paths.

The same opposition appears inside a single coil: when its own current changes, it induces an EMF opposing that change. This self-induction is [[inductance]].
`,
  ideas: [
    'The induced current opposes the change in flux that produces it; this is the minus sign in Faraday\'s law.',
    'When the flux increases, the induced field points against it; when the flux decreases, along it.',
    'Lenz\'s law is energy conservation: you must do work against the opposition, and that work becomes electrical energy.',
    'Eddy currents in solid metal resist motion, giving magnetic braking and induction heating.'
  ],
  pitfalls: [
    'The induced field always points opposite to the magnet\'s field — It opposes the *change*. When the flux is falling, the induced field points the same way as the original field, trying to keep it up.',
    'Lenz\'s law is an extra law on top of energy conservation — It is energy conservation: the opposing force is what makes you do the work that ends up as electrical energy.'
  ],
  examples: [
    {
      title: 'Which way does the current flow?',
      q: 'A wire loop lies flat on a table. The north pole of a bar magnet is lowered towards it from above. Which way does the induced current flow, seen from above? And when the magnet is lifted away again?',
      steps: [
        'Field lines leave the north pole, so under the magnet the field points **down** through the loop, and as the magnet approaches the downward flux **increases**.',
        'The induced current must make an **upward** field inside the loop.',
        'By the right-hand grip rule, an upward field inside a horizontal loop needs a current flowing **anticlockwise** seen from above. The loop acts like a magnet with its north face up, repelling the approaching north pole.',
        'Lifting the magnet away makes the downward flux decrease, so the induced field points down and the current is clockwise — now the loop attracts the retreating magnet.'
      ],
      a: 'Anticlockwise (seen from above) while the magnet approaches; clockwise while it is lifted away.'
    },
    {
      title: 'The slow-falling magnet',
      q: 'A 20 g neodymium magnet falls down a vertical copper pipe at a steady 5.0 cm/s. Where does its energy go, and at what rate?',
      steps: [
        'At steady speed its kinetic energy does not change, but it loses gravitational energy at a rate $P = mgv$.',
        '$P = (0.020)(9.81)(0.050) = 9.8\\times10^{-3}$ W.',
        'The eddy currents induced in the pipe oppose the fall with a force equal to the weight, and the energy is dissipated as heat in the copper.'
      ],
      a: 'About 10 mW, heating the pipe.'
    }
  ],
  quiz: [
    { q: 'The north pole of a magnet is pushed towards the end of a coil. The end of the coil facing the magnet becomes…', choices: ['a north pole', 'a south pole', 'unmagnetised', 'north, then south'], a: 0,
      why: 'Like poles repel: the coil opposes the approach by presenting a north pole to the incoming north pole.' },
    { q: 'A magnet dropped through a vertical copper pipe falls slowly because…', choices: ['copper is magnetic and attracts it', 'eddy currents induced in the pipe produce a field that opposes the motion', 'air is trapped in the pipe', 'the pipe is too narrow'], a: 1,
      why: 'Copper is not magnetic, but it conducts. The moving magnet changes the flux through each ring of the pipe, inducing currents that push back on it.' },
    { q: 'If induced currents helped the change instead of opposing it, then…', choices: ['nothing would be different', 'a small push would grow without limit, making energy from nothing', 'generators would be slightly less efficient', 'currents would flow backwards'], a: 1,
      why: 'The effect would feed on itself. The opposing sign is what keeps induction consistent with energy conservation.' },
    { q: 'Lenz\'s law means the induced field always points opposite to the magnet\'s field.', a: false,
      why: 'It opposes the change. If the flux is decreasing, the induced field points along the original field.' },
    { q: 'A metal plate swinging between magnet poles stops quickly. Cutting deep slots in the plate…', choices: ['makes it stop even faster', 'lets it swing much longer', 'has no effect', 'makes it stick between the poles'], a: 1,
      why: 'The slots break up the loops the eddy currents need, so the currents — and the braking — are much weaker.' }
  ],
  applications: [
    'Eddy-current brakes on trains, roller coasters and free-fall rides.',
    'Induction cooking and induction furnaces.',
    'Damping of the needles of analogue meters and of precision balances.',
    'Eddy-current separators that throw aluminium cans out of a stream of recycling.'
  ],
  history: 'Heinrich Lenz, working in St Petersburg, stated the rule in 1834, three years after Faraday\'s discovery.',
  sim: { id: 'em2-magnet-coil', params: { mode: 'through' } }
},

{
  id: 'motional-emf', parent: 'induction', title: 'Motional EMF', level: 2,
  short: 'A conductor moving across a magnetic field has an EMF ℰ = BLv between its ends, because the field pushes its charges along it.',
  keywords: ['motional EMF', 'BLv', 'sliding rod', 'rails', 'magnetic braking', 'terminal velocity', 'aircraft wing voltage', 'Fleming\'s right-hand rule', 'conductor moving in a field', 'electromagnetic flow meter'],
  prereq: ['lorentz-force', 'faradays-law', 'force-on-current'],
  related: ['generators', 'lenzs-law', 'hall-effect'],
  body: `
Drag a metal rod sideways through a magnetic field. The free electrons inside are carried along with the rod, so they are moving charges in a field — and they feel a [[lorentz-force|magnetic force]] $q\\vec v\\times\\vec B$, which points **along** the rod. Electrons pile up at one end, leaving the other positive, until the electric field of the separated charge balances the magnetic push. The rod has become a battery. Its EMF is

$$\\mathcal{E} = B L v$$

for a rod of length $L$ moving at speed $v$, with rod, velocity and field all at right angles.

### The same answer from flux
Lay the rod across two parallel rails joined at one end by a resistor. As the rod slides, the circuit it completes grows: its area increases by $Lv$ every second, so the flux through it grows at $d\\Phi/dt = BLv$. [[faradays-law|Faraday's law]] gives the same EMF. The two descriptions — a force on moving charges, or a changing flux — are two views of one effect.

### Currents, forces and energy
With the circuit closed, a current $I = BLv/R$ flows. Now the rod is a current-carrying wire in a field, so it feels a [[force-on-current|force]] $F = BIL$ — and by [[lenzs-law|Lenz's law]] that force opposes the motion:

$$F = \\frac{B^2L^2 v}{R}$$

To keep the rod moving at constant speed you must push with this force, delivering power $Fv = B^2L^2v^2/R$. That is exactly $I^2R$, the power heating the resistor. Mechanical work in, electrical energy out: this is how every generator works.

Let go of the rod, and the drag grows with speed, like air resistance: a rod given a kick slows exponentially, $v = v_0 e^{-t/\\tau}$ with $\\tau = mR/B^2L^2$, and a rod pulled by a steady force reaches a **terminal speed** $FR/B^2L^2$. Try both in the simulation.

### Real numbers
A rod 40 cm long moving at 2 m/s through 0.5 T gives 0.4 V. An airliner with a 64 m wingspan flying at 250 m/s through a vertical field of 45 µT has 0.7 V between its wingtips — but no lamp connected by wires can light from it, because the wires move through the field too and develop the same EMF. In 1996 a 20 km tether trailed from the Space Shuttle generated several kilovolts, because it swept through the Earth's field at 7.7 km/s.

> [!tip] To find the direction, point your right hand's fingers along $\\vec v$, curl them towards $\\vec B$: the thumb shows which way positive charges are pushed along the rod.
`,
  ideas: [
    'A conductor moving across a field has an EMF ℰ = BLv because the field pushes its charges along it.',
    'The same result follows from Faraday\'s law: the circuit\'s area, and so its flux, grows at Lv per second.',
    'The induced current makes the field push back on the conductor with F = B²L²v/R, opposing the motion.',
    'The mechanical power needed, Fv, equals the electrical power I²R: energy is conserved.'
  ],
  pitfalls: [
    'A moving conductor always carries a current — There is always an EMF, but a current flows only if the circuit is closed.',
    'Motional EMF gives free electricity just for moving — As soon as a current flows, the field pushes back with force BIL; the work you do against it is exactly the electrical energy delivered.'
  ],
  derivation: {
    title: 'Two routes to BLv',
    steps: [
      { text: 'Force route: each charge in the rod moves at $v$ across $B$, so it feels a force $qvB$ along the rod. Charge separates until an electric field $E$ balances it:', tex: 'qE = qvB \\;\\Rightarrow\\; E = vB' },
      { text: 'The potential difference along the rod is that field times its length:', tex: '\\mathcal{E} = E L = B L v' },
      { text: 'Flux route: with the rod a distance $x$ from the end of the rails, the circuit encloses flux $\\Phi = BLx$. The rod moves at $v = dx/dt$, so', tex: '\\mathcal{E} = \\frac{d\\Phi}{dt} = B L\\,\\frac{dx}{dt} = B L v' }
    ]
  },
  formulas: [
    {
      name: 'EMF of a moving rod',
      expr: 'emf = B*L*v', tex: '\\mathcal{E} = B L v',
      vars: {
        emf: { name: 'EMF between the ends', q: 'voltage', unit: 'V', tex: '\\mathcal{E}' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.5 },
        L: { name: 'length of the rod', q: 'length', unit: 'm', value: 0.4 },
        v: { name: 'speed across the field', q: 'speed', unit: 'm/s', value: 2 }
      },
      note: 'Rod, velocity and field mutually perpendicular. If not, use only the parts that are.',
      stories: {
        emf: 'A rod {L} long slides at {v} across a {B} field, at right angles to it. What EMF appears between its ends?',
        v: 'How fast must a {L} rod move across a {B} field to generate {emf}?'
      }
    },
    {
      name: 'Magnetic drag on a rod in a closed circuit',
      expr: 'F = B^2*L^2*v/R', tex: 'F = \\frac{B^2 L^2 v}{R}',
      vars: {
        F: { name: 'retarding force', q: 'force', unit: 'N' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.5 },
        L: { name: 'length of the rod between the rails', q: 'length', unit: 'm', value: 0.4 },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 2 },
        R: { name: 'resistance of the circuit', q: 'resistance', unit: 'Ω', value: 2 }
      },
      note: 'Setting $F$ equal to a steady pull gives the terminal speed $v = FR/B^2L^2$.',
      stories: {
        F: 'A rod {L} long slides at {v} along rails joined by a {R} resistor, through a {B} field. What force is needed to keep it moving steadily?',
        v: 'A rod {L} long is pulled along rails (circuit resistance {R}) through a {B} field by a steady force of {F}. What terminal speed does it reach?'
      }
    },
    {
      name: 'Time constant of magnetic braking',
      expr: 'tau = m*R/(B^2*L^2)', tex: '\\tau = \\frac{m R}{B^2 L^2}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 's' },
        m: { name: 'mass of the rod', q: 'mass', unit: 'g', value: 50 },
        R: { name: 'resistance of the circuit', q: 'resistance', unit: 'Ω', value: 2 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.5 },
        L: { name: 'length of the rod between the rails', q: 'length', unit: 'm', value: 0.4 }
      },
      note: 'A rod given a push on frictionless rails slows as $v = v_0 e^{-t/\\tau}$.'
    }
  ],
  examples: [
    {
      title: 'The sliding rod',
      q: 'A rod 0.40 m long is pushed at a steady 2.0 m/s along rails joined by a 2.0 Ω resistor, through a 0.50 T field. Find the EMF, the current, the force needed and the power, and check the energy balance.',
      steps: [
        '$\\mathcal{E} = BLv = (0.50)(0.40)(2.0) = 0.40$ V, so $I = 0.40/2.0 = 0.20$ A.',
        'Opposing force: $F = BIL = (0.50)(0.20)(0.40) = 0.040$ N, which the pusher must supply.',
        'Mechanical power: $Fv = (0.040)(2.0) = 0.080$ W.',
        'Electrical power in the resistor: $I^2R = (0.20)^2(2.0) = 0.080$ W. They agree.'
      ],
      a: '0.40 V, 0.20 A, 0.040 N and 80 mW in, 80 mW out.'
    },
    {
      title: 'Wingtip to wingtip',
      q: 'A large airliner with a 64 m wingspan flies level at 250 m/s where the vertical part of the Earth\'s field is 45 µT. What EMF is there between its wingtips? Could it light a lamp?',
      steps: [
        'Only the vertical field is crossed by a horizontal wing moving horizontally: $\\mathcal{E} = BLv = (45\\times10^{-6})(64)(250) = 0.72$ V.',
        'A wire from one wingtip to a lamp and back to the other moves through the same field at the same speed, so an equal EMF appears in it, opposing the first. The net EMF around any circuit moving with the plane is zero — the flux through it does not change.'
      ],
      a: '0.72 V, but nothing on board can draw a current from it.'
    }
  ],
  quiz: [
    { q: 'A metal rod moves along its own length through a magnetic field. The EMF between its ends is…', choices: ['BLv', 'zero', 'BLv/2', 'infinite'], a: 1,
      why: 'The magnetic force $q\\vec v\\times\\vec B$ is then perpendicular to the rod, so it does not push charges along it.' },
    { q: 'A rod slides on rails joined by a resistor. You double its speed. The force needed to keep it moving steadily…', choices: ['stays the same', 'doubles', 'quadruples', 'halves'], a: 1,
      why: '$F = B^2L^2v/R$ is proportional to $v$. (The power $Fv$ quadruples.)' },
    { q: 'A rod given a push along frictionless rails (joined by a resistor) in a magnetic field…', choices: ['keeps going at constant speed', 'slows down, exponentially', 'speeds up', 'oscillates back and forth'], a: 1,
      why: 'The magnetic drag is proportional to the speed, so the speed falls exponentially with time constant $mR/B^2L^2$.' },
    { q: 'If the resistor is removed so the circuit is open, the rod still has an EMF across it but feels no magnetic drag.', a: true,
      why: 'The EMF comes from the motion alone. The drag needs a current, and with an open circuit none flows.' }
  ],
  applications: [
    'Generators: every conductor in a generator is a moving conductor in a field.',
    'Electromagnetic flow meters, which measure the EMF across a conducting liquid flowing through a field.',
    'Electrodynamic tethers that could raise or lower spacecraft without fuel.',
    'Magnetic braking of trains and rides.'
  ],
  sim: 'em2-sliding-rod'
},

{
  id: 'generators', parent: 'induction', title: 'Generators', level: 2,
  short: 'A coil turning in a magnetic field sees its flux rise and fall, so it produces a sinusoidal EMF of peak NBAω — the source of nearly all the world\'s electricity.',
  keywords: ['generator', 'alternator', 'dynamo', 'AC generator', 'slip rings', 'split-ring commutator', 'peak EMF', 'NBAω', 'power station', 'turbine', 'three-phase', 'pole pairs'],
  prereq: ['faradays-law', 'magnetic-flux', 'angular-kinematics'],
  related: ['alternating-current', 'torque-on-loop', 'motional-emf', 'transformers'],
  body: `
Spin a coil in a steady magnetic field and the flux through it keeps changing: largest when the coil faces the field, zero when it is edge-on, largest the other way half a turn later. By [[faradays-law|Faraday's law]] a changing flux means an EMF. A **generator** turns rotation into electricity this way.

### The sinusoidal EMF
A coil of $N$ turns and area $A$ turning at angular speed $\\omega$ in a field $B$ has its normal at angle $\\theta = \\omega t$ to the field, so the flux linkage is $N B A\\cos\\omega t$. Differentiating,

$$\\mathcal{E} = N B A\\,\\omega\\sin\\omega t, \\qquad \\mathcal{E}_0 = N B A\\,\\omega$$

The EMF is a **sine wave** whose peak is proportional to the number of turns, the field, the area and the speed. Spin twice as fast and both the peak and the frequency double.

Notice when the EMF peaks: when $\\sin\\omega t = \\pm 1$, which is when the coil is **edge-on** and the flux through it is zero. That is when the flux is changing fastest — the long sides of the coil are then cutting straight across the field lines. When the coil faces the field the flux is at its peak but momentarily not changing, and the EMF is zero.

### AC and DC
Connecting the coil through two **slip rings** (one for each end) delivers the alternating EMF as it is — an **alternator**. Connecting it through a **split-ring commutator**, as in a [[torque-on-loop|DC motor]], swaps the connections every half turn and gives a pulsating direct EMF, $|\\mathcal{E}_0\\sin\\omega t|$ — a **dynamo**. Compare the two in the simulation.

### A motor in reverse
A generator and a motor are the same machine. Draw current from a generator and that current, in the field, feels a torque that **opposes** the rotation ([[lenzs-law|Lenz's law]]). Whatever turns the generator — a steam turbine, a water wheel, the wind — must work against that torque, and the harder you load the generator, the harder it is to turn. Electric cars exploit this: in **regenerative braking** the motor becomes a generator and charges the battery while slowing the car.

### Real machines
In power stations the heavy output windings stay still (the **stator**) and a rotating electromagnet (the **rotor**) sweeps its field past them, so the large currents need no sliding contacts. Three sets of windings 120° apart give **three-phase** power. The output frequency is the rotation rate times the number of **pairs of poles** on the rotor: a two-pole turbo-generator turns at 3000 rpm for 50 Hz (3600 rpm for 60 Hz), while a slow hydroelectric generator with 40 pole pairs turns at 75 rpm. Large generators convert over 98% of the mechanical power they receive into electrical power.
`,
  ideas: [
    'A coil rotating in a field has a flux NBA cos ωt and an EMF NBAω sin ωt.',
    'The peak EMF, NBAω, grows with turns, field, area and rotation speed.',
    'The EMF is greatest when the flux is zero (coil edge-on), where the flux changes fastest.',
    'Slip rings give AC; a split-ring commutator gives pulsating DC.',
    'Drawing current makes the generator harder to turn: mechanical work becomes electrical energy.'
  ],
  pitfalls: [
    'The EMF is largest when the most field lines pass through the coil — That is when it is zero: the flux is at its peak and momentarily not changing. The EMF peaks when the coil lies along the field.',
    'A generator creates electrical energy — It converts mechanical work into electrical energy; the magnetic torque on the current-carrying coil makes you pay for every joule.'
  ],
  derivation: {
    title: 'The EMF of a rotating coil',
    steps: [
      { text: 'The coil\'s normal makes an angle $\\theta = \\omega t$ with the field, so the flux linkage is', tex: 'N\\Phi = N B A\\cos\\omega t' },
      { text: 'Faraday\'s law:', tex: '\\mathcal{E} = -\\frac{d(N\\Phi)}{dt} = -N B A\\,\\frac{d}{dt}\\cos\\omega t = N B A\\,\\omega\\sin\\omega t' },
      { text: 'The peak value is reached twice a turn, when the coil lies along the field:', tex: '\\mathcal{E}_0 = N B A\\,\\omega = 2\\pi f\\, N B A' }
    ]
  },
  formulas: [
    {
      name: 'Peak EMF of a rotating coil',
      expr: 'E0 = N*B*A*omega', tex: '\\mathcal{E}_0 = N B A\\,\\omega',
      vars: {
        E0: { name: 'peak EMF', q: 'voltage', unit: 'V', tex: '\\mathcal{E}_0' },
        N: { name: 'number of turns', q: 'count', value: 100, int: true },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.2 },
        A: { name: 'area of the coil', q: 'area', unit: 'cm²', value: 100 },
        omega: { name: 'rotation speed', q: 'angvel', unit: 'rpm', value: 600 }
      },
      stories: {
        E0: 'A coil of {N} turns and area {A} spins at {omega} in a {B} field. What is its peak EMF?',
        omega: 'How fast must a {N}-turn coil of area {A} spin in a {B} field to give a peak EMF of {E0}?',
        N: 'A coil of area {A} spinning at {omega} in a {B} field must reach a peak of {E0}. How many turns does it need?'
      }
    },
    {
      name: 'Output frequency of a generator',
      expr: 'f = p*n', tex: 'f = p\\, n',
      vars: {
        f: { name: 'output frequency', q: 'frequency', unit: 'Hz' },
        p: { name: 'pairs of poles on the rotor', q: 'count', value: 2, int: true },
        n: { name: 'rotation rate', q: 'frequency', unit: 'rpm', value: 1500 }
      },
      stories: {
        n: 'A hydroelectric generator with {p} pairs of poles must deliver {f}. How fast must it turn?',
        f: 'A generator with {p} pairs of poles turns at {n}. What frequency does it produce?'
      }
    }
  ],
  examples: [
    {
      title: 'A small generator',
      q: 'A generator coil has 250 turns, each 5.0 cm × 8.0 cm, and turns at 3000 rpm in a 0.30 T field. Find the peak EMF, the RMS EMF and the frequency.',
      steps: [
        'Area: $A = 0.050 \\times 0.080 = 4.0\\times10^{-3}\\ \\mathrm{m^2}$. Speed: $\\omega = 3000 \\times 2\\pi/60 = 314\\ \\mathrm{rad/s}$.',
        '$\\mathcal{E}_0 = NBA\\omega = (250)(0.30)(4.0\\times10^{-3})(314) = 94$ V.',
        'RMS value (see [[alternating-current]]): $94/\\sqrt 2 = 67$ V. Frequency: $3000/60 = 50$ Hz.'
      ],
      a: '94 V peak, 67 V RMS, at 50 Hz.'
    },
    {
      title: 'Why a loaded generator is harder to turn',
      q: 'A two-pole generator turning at 3000 rpm delivers 1.0 kW to a load. Ignoring losses, what torque must drive it?',
      steps: [
        'Angular speed: $\\omega = 2\\pi \\times 50 = 314$ rad/s.',
        'Power is torque times angular speed, so $\\tau = P/\\omega = 1000/314 = 3.2$ N·m.',
        'With no load no current flows and (apart from friction) no torque is needed. The torque appears with the current — the magnetic force on it.'
      ],
      a: 'About 3.2 N·m, rising in proportion to the power drawn.'
    }
  ],
  quiz: [
    { q: 'At the moment the EMF of a rotating coil is greatest, the flux through it is…', choices: ['greatest', 'zero', 'half its maximum', 'changing most slowly'], a: 1,
      why: 'The EMF follows the rate of change of flux. $\\cos\\omega t$ changes fastest where it passes through zero.' },
    { q: 'Doubling the rotation speed of a generator…', choices: ['doubles both the peak EMF and the frequency', 'doubles the peak EMF but not the frequency', 'doubles the frequency but not the peak EMF', 'quadruples the peak EMF'], a: 0,
      why: '$\\mathcal{E}_0 = NBA\\omega$ and $f = \\omega/2\\pi$ are both proportional to $\\omega$.' },
    { q: 'Why does a generator become harder to turn when a lamp is connected?', choices: ['Friction increases with current', 'The current in the coil feels a magnetic torque opposing the rotation', 'The lamp adds weight', 'The magnets get weaker'], a: 1,
      why: 'That opposing torque is how mechanical work is turned into the electrical energy the lamp uses.' },
    { q: 'Large power-station generators spin a magnet (the rotor) and keep the output coils still.', a: true,
      why: 'Only the modest rotor current passes through sliding contacts; the huge output current is taken from fixed windings.' },
    { q: 'A generator with 4 pairs of poles must produce 50 Hz. It turns at…', choices: ['3000 rpm', '1500 rpm', '750 rpm', '12.5 rpm'], a: 2,
      why: '$n = f/p = 50/4 = 12.5$ revolutions per second, which is 750 rpm.' }
  ],
  applications: [
    'Power stations driven by steam, gas, water or wind turbines.',
    'Car alternators and bicycle dynamos.',
    'Regenerative braking in electric and hybrid vehicles.',
    'Hand-cranked and wind-up torches and radios.'
  ],
  history: 'Faraday spun a copper disc between magnet poles in 1831, the first generator. Hippolyte Pixii built a hand-cranked alternator in 1832, and self-excited dynamos (Siemens, Wheatstone and others, 1866–67) made large-scale electricity generation practical.',
  sim: 'em2-generator'
},

{
  id: 'inductance', parent: 'induction', title: 'Inductance', level: 2,
  short: 'A coil opposes changes in its own current: the EMF it induces in itself is ℰ = −L dI/dt, where the inductance L, in henries, depends on its shape and turns.',
  keywords: ['inductance', 'self-inductance', 'mutual inductance', 'henry', 'inductor', 'back EMF', 'L dI/dt', 'solenoid inductance', 'choke', 'coil', 'flyback'],
  prereq: ['faradays-law', 'solenoid', 'lenzs-law'],
  related: ['rl-circuits', 'energy-in-inductor', 'transformers', 'reactance', 'capacitance'],
  body: `
A current in a coil makes a magnetic field, and that field threads the coil's own turns. Change the current and you change the coil's own flux — so, by [[faradays-law|Faraday's law]], the coil induces an EMF in itself. By [[lenzs-law|Lenz's law]] this EMF opposes the change: it pushes back when you try to increase the current, and pushes forward when you try to reduce it.

### The henry
The flux linkage is proportional to the current: $N\\Phi = LI$. The constant $L$ is the **self-inductance**, and the induced EMF is

$$\\mathcal{E} = -L\\,\\frac{dI}{dt}$$

Its unit is the **henry**: a coil has 1 H if a current changing at 1 A/s induces 1 V in it. Equivalently $1\\ \\mathrm{H} = 1\\ \\mathrm{Wb/A} = 1\\ \\mathrm{V\\,s/A}$. Real inductors range from nanohenries (a few turns in a radio-frequency circuit) through millihenries (loudspeaker crossover coils) to several henries (iron-cored chokes).

### Electrical inertia
An inductor resists changes in current the way a mass resists changes in velocity. A steady current passes through an ideal inductor with no voltage across it at all — just as a mass moves at steady velocity with no force. But try to change the current quickly and a large voltage appears. Compare the [[capacitance|capacitor]], which resists sudden changes of *voltage*.

### Inductance of a solenoid
For a long [[solenoid]] of $N$ turns, length $\\ell$ and cross-section $A$, the field is $\\mu_0 N I/\\ell$, the flux per turn is that times $A$, and the flux linkage $N$ times more:

$$L = \\frac{\\mu_0 N^2 A}{\\ell}$$

The **square** of the turns appears because extra turns both make more flux *and* link it more times. An iron core multiplies $L$ by the core's relative permeability — hundreds or thousands of times.

### Sparks
Open a switch in a circuit with a large inductor and the current tries to fall to zero in microseconds. $dI/dt$ is enormous, so is the EMF, and the voltage across the opening contacts can reach thousands of volts: a spark jumps. Car **ignition coils** use this on purpose. Everywhere else it is a nuisance, tamed by a **flyback diode** across the coil that gives the current somewhere to go (see [[rl-circuits]]).

### Mutual inductance
A changing current in one coil also induces an EMF in a neighbouring coil: $\\mathcal{E}_2 = -M\\,dI_1/dt$, where $M$ is the **mutual inductance**. This is the principle of [[transformers]], wireless charging pads and the induction loops that tell traffic lights a car is waiting.
`,
  ideas: [
    'A changing current in a coil induces an EMF in the coil itself: ℰ = −L dI/dt.',
    'The self-induced EMF opposes changes in current, not the current itself.',
    'Inductance acts like electrical inertia; steady current passes an ideal inductor with no voltage across it.',
    'For a long solenoid L = μ₀N²A/ℓ; an iron core multiplies it.',
    'Interrupting the current in an inductor quickly produces a large voltage spike.'
  ],
  pitfalls: [
    'An inductor opposes current — It opposes changes in current. A steady current flows through an ideal inductor with no voltage across it.',
    'Inductance depends on the current — For an air-cored coil L is fixed by the geometry and the turns. Only iron cores make it vary, when they saturate.'
  ],
  derivation: {
    title: 'Inductance of a long solenoid',
    steps: [
      { text: 'The field inside a long solenoid of $N$ turns and length $\\ell$ carrying current $I$ is', tex: 'B = \\frac{\\mu_0 N I}{\\ell}' },
      { text: 'Each turn encloses flux $BA$, so the flux linkage is', tex: 'N\\Phi = N B A = \\frac{\\mu_0 N^2 A\\, I}{\\ell}' },
      { text: 'Inductance is flux linkage per unit current:', tex: 'L = \\frac{N\\Phi}{I} = \\frac{\\mu_0 N^2 A}{\\ell}' }
    ]
  },
  formulas: [
    {
      name: 'Inductance of a long solenoid',
      expr: 'L = mu0*N^2*A/len', tex: 'L = \\frac{\\mu_0 N^2 A}{\\ell}',
      vars: {
        L: { name: 'inductance', q: 'inductance', unit: 'mH' },
        mu0: { const: 'mu0' },
        N: { name: 'number of turns', q: 'count', value: 500, int: true },
        A: { name: 'cross-section of the coil', q: 'area', unit: 'cm²', value: 10 },
        len: { name: 'length of the coil', q: 'length', unit: 'cm', value: 10, tex: '\\ell' }
      },
      note: 'Air core, long coil. With an iron core multiply by the relative permeability.',
      stories: {
        L: 'A coil of {N} turns is wound on a tube of cross-section {A} and length {len}. What is its inductance?',
        N: 'How many turns are needed on a {len} former of cross-section {A} for an inductance of {L}?'
      }
    },
    {
      name: 'Self-induced EMF',
      expr: 'emf = L*dI/t', tex: '\\mathcal{E} = L\\,\\frac{\\Delta I}{\\Delta t}',
      vars: {
        emf: { name: 'induced EMF (size)', q: 'voltage', unit: 'V', tex: '\\mathcal{E}' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 50 },
        dI: { name: 'change of current', q: 'current', unit: 'A', value: 2, tex: '\\Delta I' },
        t: { name: 'time taken', q: 'time', unit: 'ms', value: 1, tex: '\\Delta t' }
      },
      stories: {
        emf: 'The current in a {L} coil is switched off, falling by {dI} in {t}. What EMF does the coil produce?',
        L: 'Reducing the current in a coil by {dI} over {t} induces {emf}. What is its inductance?'
      }
    }
  ],
  examples: [
    {
      title: 'An air-cored coil',
      q: 'A coil of 200 turns is wound on a tube of radius 1.0 cm and length 5.0 cm. Estimate its inductance, and its inductance with a closed iron core of relative permeability 1000.',
      steps: [
        'Cross-section: $A = \\pi(0.010)^2 = 3.14\\times10^{-4}\\ \\mathrm{m^2}$.',
        '$L = \\dfrac{\\mu_0 N^2 A}{\\ell} = \\dfrac{(1.257\\times10^{-6})(200)^2(3.14\\times10^{-4})}{0.050} = 3.2\\times10^{-4}$ H.',
        'With the iron: $1000 \\times 0.32\\ \\mathrm{mH} = 0.32$ H.'
      ],
      a: 'About 0.32 mH with air inside (a coil this short would really have somewhat less), about 0.32 H with an iron core.'
    },
    {
      title: 'Switching off a relay coil',
      q: 'A relay coil of inductance 0.20 H carries 0.10 A. The transistor driving it switches off in 10 µs. Estimate the voltage the coil produces.',
      steps: [
        '$\\mathcal{E} = L\\,\\dfrac{\\Delta I}{\\Delta t} = (0.20)\\dfrac{0.10}{1.0\\times10^{-5}} = 2000$ V.',
        'That would destroy the transistor. A diode across the coil lets the current carry on circulating and die away gently instead.'
      ],
      a: 'About 2000 V — hence the flyback diode.'
    }
  ],
  quiz: [
    { q: 'Doubling the number of turns on a solenoid (same length and area) changes its inductance by a factor of…', choices: ['2', '4', '1/2', '√2'], a: 1,
      why: '$L \\propto N^2$: twice the field, linked by twice as many turns.' },
    { q: 'A steady 2 A flows through a 1 H inductor of negligible resistance. The voltage across it is…', choices: ['2 V', '0 V', '0.5 V', 'infinite'], a: 1,
      why: 'The voltage is $L\\,dI/dt$, and a steady current has $dI/dt = 0$.' },
    { q: 'The best mechanical analogue of inductance is…', choices: ['a spring\'s stiffness', 'mass (inertia)', 'friction', 'gravity'], a: 1,
      why: 'Mass resists changes of velocity ($F = m\\,dv/dt$); inductance resists changes of current ($V = L\\,dI/dt$).' },
    { q: 'The EMF of an inductor always opposes the current flowing through it.', a: false,
      why: 'It opposes the change of current. When the current is falling, the EMF acts along the current, trying to keep it flowing.' },
    { q: 'Opening a switch in a circuit with a large coil can produce a spark because…', choices: ['the coil stores charge like a capacitor', 'stopping the current quickly makes dI/dt huge, so the coil produces a very large EMF', 'the switch contacts get hot', 'coils amplify the battery voltage'], a: 1,
      why: '$\\mathcal{E} = L\\,dI/dt$: a sudden stop means a huge EMF, which can break down the air between the contacts.' }
  ],
  applications: [
    'Filters and chokes in power supplies and audio crossovers.',
    'Tuned circuits in radios.',
    'Ignition coils in petrol engines.',
    'Switch-mode power supplies and boost converters.',
    'Inductive loops in the road that detect cars at traffic lights.'
  ],
  history: 'Joseph Henry discovered self-induction around 1832, and the unit is named after him. Faraday found the effect independently a few years later.',
  sim: 'em2-rl-circuit'
},

{
  id: 'energy-in-inductor', parent: 'induction', title: 'Energy in a magnetic field', level: 2,
  short: 'Building up a current in an inductor takes work, stored as ½LI² in its magnetic field — an energy density of B²/2μ₀ in every cubic metre of field.',
  keywords: ['energy stored in an inductor', '½LI²', 'magnetic energy density', 'B²/2μ₀', 'magnetic pressure', 'MRI quench', 'superconducting magnetic energy storage', 'SMES'],
  prereq: ['inductance', 'energy-in-capacitor', 'math:definite-integral'],
  related: ['rl-circuits', 'em-wave-energy', 'lc-resonance', 'kinetic-energy'],
  body: `
To start a current in an inductor you must push against its back EMF, $L\\,dI/dt$, all the while the current is growing. That work is not lost: it is stored, and it comes back when the current dies away — as the spark when a switch is opened, or as current carried on through a diode.

### How much?
While the current is $i$ and rising, the source delivers power $P = \\mathcal{E}\\,i = L\\,i\\,di/dt$ to the inductor. Adding up from zero to a final current $I$,

$$U = \\int_0^I L\\,i\\,di = \\tfrac12 L I^2$$

Compare the [[energy-in-capacitor|capacitor]]'s $\\tfrac12 CV^2$ and a moving mass's [[kinetic-energy|kinetic energy]] $\\tfrac12 mv^2$ — inductance really does behave like inertia.

### The energy is in the field
Where is this energy? Not in the moving electrons: their kinetic energy is negligible. It is in the **magnetic field**. For a long [[solenoid]], put $L = \\mu_0 N^2 A/\\ell$ and $B = \\mu_0 N I/\\ell$ into $\\tfrac12 LI^2$ and it becomes $(B^2/2\\mu_0)(A\\ell)$: a fixed amount of energy in each cubic metre of field,

$$u = \\frac{B^2}{2\\mu_0}$$

This holds for any magnetic field anywhere, just as $u = \\tfrac12\\varepsilon_0 E^2$ holds for electric fields. Together they give the energy carried by [[em-wave-energy|electromagnetic waves]].

### Sizes
A field of 1 T holds about 0.4 MJ in every cubic metre. An MRI scanner's 3 T field over a volume of about a cubic metre stores a few megajoules — about the energy of a kilogram of TNT. If the superconducting coil suddenly loses superconductivity (a **quench**), that energy turns to heat within seconds and boils off the liquid helium in a roar.

Magnetic fields can store far more energy per cubic metre than electric fields in air: air breaks down at about 3 MV/m, where $\\tfrac12\\varepsilon_0E^2$ is only about 40 J/m³. That is one reason motors and transformers work magnetically.

### Magnetic pressure
Energy per cubic metre has the same units as pressure (J/m³ = N/m²). A field pushes outward on the currents that make it with a pressure $B^2/2\\mu_0$: 4 atmospheres at 1 T, 400 atmospheres at 10 T. High-field magnets must be built like pressure vessels.

> [!warn] The energy $\\tfrac12LI^2$ exists only while the current flows. Open the circuit and it must go somewhere, at once — which is why inductive circuits need a safe path for the current (see [[rl-circuits]]).
`,
  ideas: [
    'The energy stored in an inductor carrying current I is U = ½LI².',
    'The energy is stored in the magnetic field, with density u = B²/2μ₀.',
    'A field of 1 T stores about 400 kJ per cubic metre.',
    'The current in an inductor cannot change instantly, because its stored energy cannot.'
  ],
  pitfalls: [
    'The energy is stored in the wire or in the moving charges — It is in the magnetic field. The electrons\' kinetic energy is utterly negligible.',
    'An inductor can hold its energy after it is disconnected, like a charged capacitor — Its energy is ½LI²: no current, no field, no energy. Break the circuit and the energy must be released at once.'
  ],
  derivation: {
    title: 'The energy stored in an inductor, and where it lives',
    steps: [
      { text: 'While the current $i$ rises, the source works against the back EMF at a rate', tex: 'P = \\mathcal{E}\\, i = L\\, i\\,\\frac{di}{dt}' },
      { text: 'Add up the work as the current grows from 0 to $I$:', tex: 'U = \\int P\\,dt = \\int_0^I L\\, i\\,di = \\tfrac12 L I^2' },
      { text: 'For a long solenoid, $L = \\mu_0N^2A/\\ell$ and $I = B\\ell/\\mu_0 N$:', tex: 'U = \\tfrac12\\,\\frac{\\mu_0 N^2 A}{\\ell}\\left(\\frac{B\\ell}{\\mu_0 N}\\right)^2 = \\frac{B^2}{2\\mu_0}\\,(A\\ell)' },
      { text: '$A\\ell$ is the volume of the field, so the energy per unit volume is', tex: 'u = \\frac{B^2}{2\\mu_0}' }
    ]
  },
  formulas: [
    {
      name: 'Energy stored in an inductor',
      expr: 'U = 0.5*L*I^2', tex: 'U = \\tfrac12 L I^2',
      vars: {
        U: { name: 'stored energy', q: 'energy', unit: 'mJ' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 5 },
        I: { name: 'current', q: 'current', unit: 'A', value: 6 }
      },
      stories: {
        U: 'An ignition coil of inductance {L} carries {I} just before the circuit is broken. How much energy is stored?',
        I: 'What current stores {U} in a {L} inductor?'
      }
    },
    {
      name: 'Energy density of a magnetic field',
      expr: 'u = B^2/(2*mu0)', tex: 'u = \\frac{B^2}{2\\mu_0}',
      vars: {
        u: { name: 'energy per unit volume', q: 'energydensity', unit: 'MJ/m³' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1.5 },
        mu0: { const: 'mu0' }
      },
      note: 'Also the magnetic pressure the field exerts on the currents that make it.',
      stories: { u: 'How much energy is stored in each cubic metre of a {B} MRI field?', B: 'What field stores {u} per cubic metre?' }
    },
    {
      name: 'Energy in a region of uniform field',
      expr: 'U = B^2*Vol/(2*mu0)', tex: 'U = \\frac{B^2 V}{2\\mu_0}',
      vars: {
        U: { name: 'stored energy', q: 'energy', unit: 'MJ' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 3 },
        Vol: { name: 'volume of the field region', q: 'volume', unit: 'm³', value: 0.5, tex: 'V' },
        mu0: { const: 'mu0' }
      }
    }
  ],
  examples: [
    {
      title: 'The energy in an MRI magnet',
      q: 'Treat the field of a 3.0 T MRI magnet as uniform over a cylinder 0.90 m in diameter and 1.8 m long. Estimate the stored energy.',
      steps: [
        'Energy density: $u = \\dfrac{B^2}{2\\mu_0} = \\dfrac{3.0^2}{2(1.257\\times10^{-6})} = 3.6\\times10^6\\ \\mathrm{J/m^3}$.',
        'Volume: $V = \\pi(0.45)^2(1.8) = 1.15\\ \\mathrm{m^3}$.',
        '$U = uV = 4.1\\times10^6$ J.'
      ],
      a: 'About 4 MJ, comparable with the energy released by a kilogram of TNT.'
    },
    {
      title: 'Magnetic versus electric storage',
      q: 'Compare the energy density of a 1.0 T magnetic field with that of the strongest electric field air can hold, about 3.0 MV/m.',
      steps: [
        'Magnetic: $u_B = \\dfrac{1.0^2}{2(1.257\\times10^{-6})} = 4.0\\times10^5\\ \\mathrm{J/m^3}$.',
        'Electric: $u_E = \\tfrac12\\varepsilon_0E^2 = \\tfrac12(8.85\\times10^{-12})(3.0\\times10^6)^2 = 40\\ \\mathrm{J/m^3}$.',
        'Ratio: about ten thousand.'
      ],
      a: 'The magnetic field stores about 10 000 times more energy per cubic metre.'
    }
  ],
  quiz: [
    { q: 'Doubling the current in an inductor multiplies its stored energy by…', choices: ['2', '4', '√2', '8'], a: 1, why: '$U = \\tfrac12LI^2$ goes as the square of the current.' },
    { q: 'Where is the energy of a current-carrying solenoid stored?', choices: ['In the moving electrons', 'In the magnetic field, mostly inside the coil', 'In the wire\'s resistance', 'In the battery'], a: 1,
      why: 'The energy density $B^2/2\\mu_0$ is largest where the field is strongest, inside the coil.' },
    { q: 'Why can the current through an inductor not jump instantly?', choices: ['Its stored energy would have to change instantly, needing infinite power and an infinite EMF', 'Wires have resistance', 'Electrons have mass', 'The field cannot reverse'], a: 0,
      why: 'Energy $\\tfrac12LI^2$ tied to the current means a jump in current is a jump in energy, which no finite source can deliver.' },
    { q: 'A field of 1 T stores about 400 kJ in every cubic metre.', a: true, why: '$1^2/(2 \\times 1.257\\times10^{-6}) \\approx 4\\times10^5$ J/m³.' },
    { q: 'The energy density of a magnetic field grows as…', choices: ['B', 'B²', '√B', '1/B'], a: 1, why: '$u = B^2/2\\mu_0$: double the field, four times the energy per cubic metre.' }
  ],
  applications: [
    'Ignition coils and flyback converters, which store energy in an inductor and release it in a pulse.',
    'Switch-mode power supplies, which pass energy through an inductor thousands of times a second.',
    'Superconducting magnetic energy storage for smoothing power grids.',
    'Quench protection in MRI and accelerator magnets.'
  ],
  sim: 'em2-rl-circuit'
},

{
  id: 'rl-circuits', parent: 'induction', title: 'RL circuits', level: 2,
  short: 'Connect a coil and a resistor to a battery and the current climbs exponentially, reaching 63% of V/R after one time constant τ = L/R; remove the battery and it dies away the same way.',
  keywords: ['RL circuit', 'time constant', 'L/R', 'current rise', 'current decay', 'exponential', 'transient', 'flyback diode', 'switching an inductor'],
  prereq: ['inductance', 'kirchhoffs-laws', 'rc-circuits', 'math:first-order-linear'],
  related: ['energy-in-inductor', 'reactance', 'math:exponential-growth-decay'],
  body: `
Connect a battery to a coil (inductance $L$) in series with a resistance $R$. Without the coil, the current would jump straight to $V/R$. With it, the coil's back EMF refuses to let the current change suddenly, and the current **grows gradually**.

### The rise
Going round the circuit ([[kirchhoffs-laws|Kirchhoff's loop rule]]), the battery's voltage is shared between the resistor and the coil:

$$V = IR + L\\,\\frac{dI}{dt}$$

At the first instant $I = 0$, so the whole battery voltage appears across the coil and the current grows at $V/L$ amperes per second. As the current grows, the resistor takes a bigger share of the voltage, the coil's share shrinks, and the growth slows. The solution (see the derivation) is

$$I = \\frac{V}{R}\\left(1 - e^{-t/\\tau}\\right), \\qquad \\tau = \\frac{L}{R}$$

After one **time constant** $\\tau$ the current has reached $1 - e^{-1} = 63\\%$ of its final value $V/R$; after $5\\tau$, more than 99%. Meanwhile the voltage across the coil dies away as $V e^{-t/\\tau}$.

### The decay
Now take the battery out of the loop but leave the coil and resistor connected. The coil keeps the current flowing — in the same direction — and it dies away exponentially:

$$I = I_0\\, e^{-t/\\tau}$$

The energy $\\tfrac12LI_0^2$ that was stored in the field ([[energy-in-inductor]]) is turned into heat in the resistor.

### Opening the circuit
If instead the switch simply opens and there is no path for the current, the resistance of the gap is enormous, so $\\tau = L/R$ is tiny and $dI/dt$ is huge: the coil's EMF soars until the air breaks down and a spark jumps. A **flyback diode** across the coil provides the path and turns a destructive spike into a gentle decay. The simulation lets you try it with and without the diode.

### Sizes and the RC circuit
A coil of 0.5 H with 10 Ω has $\\tau = 50$ ms. A relay coil, 0.2 H and 100 Ω, has 2 ms. A superconducting MRI magnet, with almost no resistance, has a time constant so long that it is "ramped up" over hours and then left running for years. The mathematics is exactly that of an [[rc-circuits|RC circuit]] with the roles swapped: there the **voltage** lags and $\\tau = RC$; here the **current** lags and $\\tau = L/R$.
`,
  ideas: [
    'In an RL circuit the current cannot jump; it grows as I = (V/R)(1 − e^(−t/τ)).',
    'The time constant is τ = L/R: 63% of the final current after τ, over 99% after 5τ.',
    'At switch-on all the voltage is across the coil; at the end, all of it is across the resistor.',
    'With the source removed the current decays as I₀e^(−t/τ), releasing the stored energy as heat.'
  ],
  pitfalls: [
    'A bigger resistor makes the current grow more slowly — It lowers the final current, but it shortens the time constant L/R, so the smaller final value is reached sooner.',
    'Opening the switch stops the current instantly — The inductor keeps it flowing; without a path such as a flyback diode, the voltage spikes until something arcs.'
  ],
  derivation: {
    title: 'Solving the RL equation',
    steps: [
      { text: 'Kirchhoff\'s loop rule for a battery, resistor and coil in series:', tex: 'V - IR - L\\,\\frac{dI}{dt} = 0' },
      { text: 'Separate the variables (a [[math:separable-equations|separable equation]]):', tex: '\\frac{dI}{V/R - I} = \\frac{R}{L}\\,dt' },
      { text: 'Integrate from $I = 0$ at $t = 0$:', tex: '-\\ln\\left(1 - \\frac{IR}{V}\\right) = \\frac{R}{L}\\,t' },
      { text: 'Solve for the current:', tex: 'I = \\frac{V}{R}\\left(1 - e^{-Rt/L}\\right) = \\frac{V}{R}\\left(1 - e^{-t/\\tau}\\right), \\qquad \\tau = \\frac{L}{R}' }
    ]
  },
  formulas: [
    {
      name: 'Time constant',
      expr: 'tau = L/R', tex: '\\tau = \\frac{L}{R}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'ms' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 500 },
        R: { name: 'total resistance', q: 'resistance', unit: 'Ω', value: 10 }
      },
      stories: { tau: 'A coil of {L} is connected in series with a total resistance of {R}. What is the time constant?', R: 'What resistance gives a {L} coil a time constant of {tau}?' }
    },
    {
      name: 'Current while it rises',
      expr: 'I = V/R*(1 - exp(-R*t/L))', tex: 'I = \\frac{V}{R}\\left(1 - e^{-Rt/L}\\right)',
      vars: {
        I: { name: 'current', q: 'current', unit: 'A' },
        V: { name: 'battery voltage', q: 'voltage', unit: 'V', value: 12 },
        R: { name: 'total resistance', q: 'resistance', unit: 'Ω', value: 10 },
        t: { name: 'time since switching on', q: 'time', unit: 'ms', value: 50 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 500 }
      },
      stories: {
        I: 'A {L} coil with a total resistance of {R} is connected to a {V} battery. What is the current {t} later?',
        t: 'How long after connecting a {V} battery does the current in a {L} coil with {R} of resistance reach {I}?'
      }
    },
    {
      name: 'Current while it decays',
      expr: 'I = I0*exp(-t/tau)', tex: 'I = I_0\\, e^{-t/\\tau}',
      vars: {
        I: { name: 'current', q: 'current', unit: 'A' },
        I0: { name: 'current at the start of the decay', q: 'current', unit: 'A', value: 1.2 },
        t: { name: 'time since the source was removed', q: 'time', unit: 'ms', value: 100 },
        tau: { name: 'time constant L/R', q: 'time', unit: 'ms', value: 50 }
      },
      stories: { I: 'The battery is removed from an RL circuit carrying {I0}, leaving the coil and resistor connected; the time constant is {tau}. What is the current {t} later?' }
    }
  ],
  examples: [
    {
      title: 'How long before a relay clicks?',
      q: 'A relay coil has inductance 0.20 H and resistance 100 Ω and is switched onto 12 V. It pulls in when the current reaches 80 mA. How long does that take?',
      steps: [
        'Time constant $\\tau = L/R = 0.20/100 = 2.0$ ms; final current $V/R = 0.12$ A.',
        'Set $0.080 = 0.12\\left(1 - e^{-t/\\tau}\\right)$, so $e^{-t/\\tau} = 1/3$.',
        '$t = \\tau\\ln 3 = (2.0\\ \\mathrm{ms})(1.10) = 2.2$ ms.'
      ],
      a: 'About 2.2 ms (plus the time the armature takes to move).'
    },
    {
      title: 'Energy dumped at switch-off',
      q: 'The same relay is switched off with a flyback diode across it. How much energy is turned to heat as the current dies away?',
      steps: [
        'At switch-off it carries its full 0.12 A.',
        '$U = \\tfrac12LI^2 = \\tfrac12(0.20)(0.12)^2 = 1.4\\times10^{-3}$ J, dissipated in the coil\'s resistance and the diode over a few milliseconds.'
      ],
      a: 'About 1.4 mJ.'
    }
  ],
  quiz: [
    { q: 'Just after a battery is connected to an RL circuit, the voltage across the inductor is…', choices: ['zero', 'the full battery voltage', 'half the battery voltage', 'V/R'], a: 1,
      why: 'The current starts at zero, so there is no voltage across the resistor; all of the battery\'s voltage drives $dI/dt$.' },
    { q: 'After a long time, the voltage across an ideal inductor in a DC circuit is…', choices: ['zero', 'the battery voltage', 'L/R', 'undefined'], a: 0,
      why: 'The current has become steady, so $L\\,dI/dt = 0$.' },
    { q: 'Doubling the resistance in an RL circuit (same L) changes the time constant by a factor of…', choices: ['2', '1/2', '4', '1 — no change'], a: 1, why: '$\\tau = L/R$.' },
    { q: 'After one time constant, a rising current has reached about 63% of its final value.', a: true, why: '$1 - e^{-1} = 0.632$.' },
    { q: 'Which change makes the current take longer to approach its final value?', choices: ['A bigger resistance', 'A bigger inductance', 'A bigger battery voltage', 'A smaller inductance'], a: 1,
      why: 'A bigger $L$ means a longer $\\tau = L/R$. The battery voltage changes the final current, not the time scale.' }
  ],
  applications: [
    'Relays and solenoid valves, whose response time is set by L/R.',
    'Flyback diodes protecting transistors that switch motors and coils.',
    'The slow ramping of superconducting magnets.',
    'Current smoothing in motor drives and power supplies.'
  ],
  sim: 'em2-rl-circuit'
},

{
  id: 'transformers', parent: 'induction', title: 'Transformers', level: 2,
  short: 'Two coils on a shared iron core trade voltage for current: the voltage ratio equals the turns ratio, and — almost losslessly — power in equals power out.',
  keywords: ['transformer', 'turns ratio', 'step-up', 'step-down', 'primary', 'secondary', 'power transmission', 'national grid', 'high voltage', 'eddy currents', 'laminated core', 'impedance matching', 'isolation transformer'],
  prereq: ['faradays-law', 'inductance', 'alternating-current'],
  related: ['ac-power', 'electric-power', 'generators', 'lenzs-law'],
  body: `
A transformer is two coils wound on the same iron core. An alternating current in the first coil (the **primary**) makes an alternating magnetic flux, which the core guides through the second coil (the **secondary**). The changing flux induces an EMF in every turn of both coils — the **same** EMF per turn, because every turn encloses the same flux.

### The turns ratio
So each coil's voltage is proportional to its number of turns:

$$\\frac{V_s}{V_p} = \\frac{N_s}{N_p}$$

More turns on the secondary **steps up** the voltage; fewer **steps it down**. A doorbell transformer with 1000 primary turns needs only 35 secondary turns to turn 230 V into 8 V.

### Power in, power out
A well-made transformer wastes very little energy — large ones are over 99% efficient — so the power delivered to the secondary load is essentially the power drawn by the primary:

$$V_p I_p = V_s I_s \\quad\\Rightarrow\\quad \\frac{I_s}{I_p} = \\frac{N_p}{N_s}$$

Stepping the voltage up steps the current down by the same factor. The primary current is not fixed: when the secondary delivers more current, its opposing flux ([[lenzs-law|Lenz's law]]) makes the primary draw more from the supply automatically.

### Only for AC
A steady current makes a steady flux, and a steady flux induces nothing. Transformers need a changing current — one of the main reasons the world runs on [[alternating-current|alternating current]].

### Why power lines run at high voltage
A power line of resistance $R$ carrying power $P$ at voltage $V$ carries current $I = P/V$ and wastes $I^2R = (P/V)^2R$ as heat. Raise the voltage a hundredfold and the loss falls ten-thousandfold. So generators' output (around 20 kV) is stepped up to 275 or 400 kV for long-distance transmission in Britain (up to 1 MV elsewhere), then stepped down in stages to 11 kV for towns and 230 V for homes.

### Where the losses go
- **Copper losses**: $I^2R$ heating in the windings.
- **Eddy currents** in the core: reduced by building it from thin insulated sheets (laminations).
- **Hysteresis**: energy spent re-magnetising the iron every cycle; reduced by special steels.
- **Flux leakage**: a little flux misses the secondary.

The hum of a transformer is the core changing shape slightly as it is magnetised, twice per cycle: 100 Hz in Europe.

> [!note] Seen from the primary, a load resistance $R$ on the secondary looks like $(N_p/N_s)^2R$. Transformers therefore also *match* loads to sources — a valve amplifier to an 8 Ω loudspeaker, for example.
`,
  ideas: [
    'The same changing flux links both coils, so the voltage per turn is the same: V_s/V_p = N_s/N_p.',
    'In an ideal transformer power in equals power out, so I_s/I_p = N_p/N_s.',
    'Transformers work only with changing (alternating) currents.',
    'Transmitting at high voltage cuts the current, and the I²R losses fall with its square.'
  ],
  pitfalls: [
    'A step-up transformer gives you something for nothing — Voltage goes up but current goes down by the same factor; the power out is at best equal to the power in.',
    'The primary current is set only by the primary coil — In a loaded transformer the primary current follows the load: draw more from the secondary and the primary automatically takes more from the supply.'
  ],
  derivation: {
    title: 'The ideal transformer from Faraday\'s law',
    steps: [
      { text: 'The core carries the same flux $\\Phi$ through every turn of both coils. Faraday\'s law gives the EMF of each coil:', tex: 'V_p = N_p\\,\\frac{d\\Phi}{dt}, \\qquad V_s = N_s\\,\\frac{d\\Phi}{dt}' },
      { text: 'Divide one by the other; the rate of change of flux cancels:', tex: '\\frac{V_s}{V_p} = \\frac{N_s}{N_p}' },
      { text: 'With no losses the power delivered equals the power drawn:', tex: 'V_p I_p = V_s I_s \\;\\Rightarrow\\; \\frac{I_s}{I_p} = \\frac{V_p}{V_s} = \\frac{N_p}{N_s}' }
    ]
  },
  formulas: [
    {
      name: 'Turns ratio',
      expr: 'Vs/Vp = Ns/Np', tex: '\\frac{V_s}{V_p} = \\frac{N_s}{N_p}', solveFor: 'Vs',
      vars: {
        Vs: { name: 'secondary voltage', q: 'voltage', unit: 'V', tex: 'V_s' },
        Vp: { name: 'primary voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_p' },
        Ns: { name: 'secondary turns', q: 'count', value: 60, int: true, tex: 'N_s' },
        Np: { name: 'primary turns', q: 'count', value: 1150, int: true, tex: 'N_p' }
      },
      stories: {
        Vs: 'A transformer has {Np} turns on its primary and {Ns} on its secondary. The primary is connected to {Vp} mains. What is the secondary voltage?',
        Ns: 'How many secondary turns are needed to step {Vp} down to {Vs} with a primary of {Np} turns?'
      }
    },
    {
      name: 'Currents in an ideal transformer',
      expr: 'Vp*Ip = Vs*Is', tex: 'V_p I_p = V_s I_s', solveFor: 'Is',
      vars: {
        Vp: { name: 'primary voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_p' },
        Ip: { name: 'primary current', q: 'current', unit: 'A', value: 0.2, tex: 'I_p' },
        Vs: { name: 'secondary voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_s' },
        Is: { name: 'secondary current', q: 'current', unit: 'A', tex: 'I_s' }
      },
      stories: {
        Is: 'An ideal transformer draws {Ip} from {Vp} mains and delivers {Vs}. What current does its secondary supply?',
        Ip: 'A {Vs} lamp drawing {Is} is fed by an ideal transformer from {Vp}. What current flows in the primary?'
      }
    },
    {
      name: 'Power lost in a transmission line',
      expr: 'Ploss = (P/V)^2*R', tex: 'P_\\text{loss} = \\left(\\frac{P}{V}\\right)^2 R',
      vars: {
        Ploss: { name: 'power lost as heat', q: 'power', unit: 'MW', tex: 'P_\\text{loss}' },
        P: { name: 'power transmitted', q: 'power', unit: 'MW', value: 500 },
        V: { name: 'transmission voltage', q: 'voltage', unit: 'kV', value: 400 },
        R: { name: 'resistance of the line', q: 'resistance', unit: 'Ω', value: 5 }
      },
      note: 'Treats the line as a single resistance carrying current $P/V$ (one phase, current in step with voltage).',
      stories: {
        Ploss: 'A power station sends {P} along a line of total resistance {R} at {V}. How much power is lost as heat?',
        V: 'At what voltage must {P} be sent along a {R} line to keep the losses down to {Ploss}?'
      }
    }
  ],
  examples: [
    {
      title: 'Why transmission uses high voltage',
      q: 'A town needs 20 MW, delivered along a line of total resistance 10 Ω. Compare the losses if the power is sent at 11 kV and at 132 kV.',
      steps: [
        'At 11 kV: $I = P/V = 20\\times10^6/11\\,000 = 1820$ A, so $I^2R = (1820)^2(10) = 33$ MW — more than the town needs. Impossible in practice.',
        'At 132 kV: $I = 152$ A, so $I^2R = (152)^2(10) = 0.23$ MW, about 1% of the power sent.',
        'Twelve times the voltage, 144 times less loss.'
      ],
      a: '33 MW lost at 11 kV (unworkable) against 0.23 MW at 132 kV.'
    },
    {
      title: 'A doorbell transformer',
      q: 'A doorbell needs 8.0 V and draws 1.0 A. Its transformer has 1000 primary turns on 230 V mains. How many secondary turns does it need, and what current does it draw from the mains (ideal transformer)?',
      steps: [
        '$N_s = N_p V_s/V_p = 1000 \\times 8.0/230 = 34.8$: 35 turns.',
        'Power: $V_sI_s = 8.0$ W, so $I_p = 8.0/230 = 0.035$ A.'
      ],
      a: '35 turns; about 35 mA from the mains.'
    }
  ],
  quiz: [
    { q: 'A transformer steps 230 V down to 23 V. If the secondary delivers 2.0 A, the primary current (ideal transformer) is…', choices: ['20 A', '2.0 A', '0.20 A', '0.020 A'], a: 2,
      why: 'Power in equals power out: $230 I_p = 23 \\times 2.0$, so $I_p = 0.20$ A.' },
    { q: 'Why does a transformer not work on steady DC?', choices: ['DC is too dangerous', 'A steady current makes a steady flux, and only a changing flux induces an EMF', 'The core would melt at once', 'DC flows the wrong way through the windings'], a: 1,
      why: 'Faraday\'s law needs $d\\Phi/dt \\ne 0$. (On DC the primary would also draw a large current limited only by its resistance, and overheat.)' },
    { q: 'Transmitting power at a higher voltage reduces the losses in the lines mainly because…', choices: ['the current is smaller, and the losses go as I²R', 'high voltage lowers the wires\' resistance', 'electrons move faster', 'the frequency is higher'], a: 0,
      why: 'For the same power, $I = P/V$ falls, and the loss $(P/V)^2R$ falls with its square.' },
    { q: 'A step-up transformer increases the power delivered.', a: false, why: 'It raises the voltage and lowers the current; the power out is at most the power in.' },
    { q: 'Transformer cores are made of thin insulated sheets of iron rather than one solid block in order to…', choices: ['save weight', 'reduce eddy-current losses', 'increase the flux', 'make winding easier'], a: 1,
      why: 'The insulation between the sheets breaks up the large loops that eddy currents would otherwise follow through the iron.' }
  ],
  applications: [
    'Substations throughout the power grid.',
    'Chargers and power supplies (modern ones use small, high-frequency transformers).',
    'Isolation transformers for electrical safety.',
    'Audio output transformers matching amplifiers to loudspeakers.',
    'Current transformers used to measure large currents.'
  ],
  history: 'Faraday\'s iron ring of 1831 was the first transformer. Practical closed-core transformers were built by Zipernowsky, Bláthy and Déri in Budapest in 1885, and AC distribution based on them won out over Edison\'s DC system in the "war of the currents".'
}

);
