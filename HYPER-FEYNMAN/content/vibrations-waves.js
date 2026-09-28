/* HYPER-FEYNMAN · content/vibrations-waves.js — Rotation, Oscillations and Waves.
 * Topics: oscillators (FLP I-18 to I-25) and waves-sound (FLP I-47 to I-51). Simulations in sims/vibrations-waves.js (osc-…). */
Hyper.add(

/* ================================================================ ROTATION AND OSCILLATORS */
{
  id: 'rotation-feyn', parent: 'oscillators', title: 'Rotation, torque and angular momentum', level: 2,
  short: 'Turning is straight-line motion in disguise: angle replaces distance, torque replaces force, moment of inertia replaces mass and angular momentum replaces momentum. Without an outside torque, angular momentum never changes — which is why a skater spins faster with her arms pulled in.',
  keywords: ['rotation', 'torque', 'angular momentum', 'moment of inertia', 'angular velocity', 'lever arm', 'right-hand rule', 'figure skater', 'conservation of angular momentum', 'parallel-axis theorem', 'flywheel', 'Kepler second law'],
  prereq: ['conservation-of-momentum', 'vectors-and-symmetry', 'physics:torque', 'physics:angular-momentum'],
  related: ['gyroscope-feyn', 'great-conservation-principles', 'conservation-from-symmetry', 'keplers-laws-feyn', 'angular-momentum-quantum', 'physics:moment-of-inertia', 'physics:rotational-kinetic-energy', 'math:cross-product'],
  body: `
Feynman taught rotation by showing that nothing new is needed. A wheel is a crowd of particles, each obeying Newton's laws; when we add up their motions in the right way, every idea of straight-line mechanics reappears with a new name. Distance becomes angle, force becomes **torque**, mass becomes **moment of inertia**, momentum becomes **angular momentum** — and the law of motion keeps exactly its old shape.

### Torque, defined by work
Turn a body through a small angle $\\Delta\\theta$ (in [[?radian|radians]]) about an axis. A point at $(x, y)$ moves by $(-y\\,\\Delta\\theta,\\; x\\,\\Delta\\theta)$, so a force $(F_x, F_y)$ acting there does work

$$\\Delta W = (xF_y - yF_x)\\,\\Delta\\theta = \\tau\\,\\Delta\\theta$$

The bracket is the torque $\\tau$: the "force of turning", just as force is what multiplies distance to give work. Geometrically it is $\\tau = rF\\sin\\theta$ — the force times its **lever arm**, the perpendicular distance from the axis to its line of action. Push a door at the handle, at right angles, and a small force does the job; push near the hinge, or straight towards it, and nothing turns.

### The dictionary
| Moving in a line | Turning about an axis |
|---|---|
| distance $x$ | angle $\\theta$ (rad) |
| velocity $v = dx/dt$ | angular velocity $\\omega = d\\theta/dt$ |
| mass $m$ | moment of inertia $I = \\sum m_i r_i^2$ |
| force $F$ | torque $\\tau = xF_y - yF_x$ |
| momentum $p = mv$ | angular momentum $L = I\\omega$ |
| $F = dp/dt$ | $\\tau = dL/dt$ |
| kinetic energy $\\tfrac12 mv^2$ | kinetic energy $\\tfrac12 I\\omega^2$ |

The moment of inertia is the [[?sum]] of each mass times the square of its distance from the axis: the same mass counts four times as much at twice the distance. A ring of mass $M$ and radius $R$ has $I = MR^2$, a uniform disc $\\tfrac12 MR^2$, a thin rod about its centre $\\tfrac1{12}ML^2$. About any other parallel axis a distance $d$ away, add $Md^2$ (the parallel-axis theorem).

### Torque is a vector
In three dimensions a turning has an axis, so torque and angular momentum become [[?vector|vectors]] along the axis, fixed by the right-hand rule: $\\vec\\tau = \\vec r\\times\\vec F$ and $\\vec L = \\vec r\\times\\vec p$, both [[?cross-product|cross products]]. The law is still one line:

$$\\vec\\tau = \\frac{d\\vec L}{dt}$$

### Angular momentum is conserved
Inside a body, the forces between two particles are equal, opposite and along the line joining them, so their torques cancel in pairs. Only an *outside* torque can change the total $\\vec L$. With none, $I\\omega$ stays fixed: a skater who pulls her arms in, cutting her moment of inertia from 3.0 to 1.2 kg·m², goes from 2 to 5 turns a second. Her kinetic energy rises by the same factor 2.5 — the extra comes from the work her arms do hauling the masses inwards. Planets obey the same law: the Sun's pull points at the Sun, so it has no torque about it, and a planet's angular momentum is constant. That is Kepler's law of equal areas in equal times (see [[keplers-laws-feyn]]).

> [!key] Rotation adds no new physics — only new bookkeeping. $\\tau = dL/dt$ is Newton's law summed over a turning body, and with no outside torque the angular momentum stays the same.

**In the simulation** a turntable carries two sliding weights. Apply a torque and watch the angular-momentum arrow grow only while the torque acts; then slide the weights in or out and see the arrow keep its length while the turntable speeds up or slows down.
`,
  ideas: [
    'Torque is the turning effect of a force: τ = rF sin θ, the force times its lever arm; work in a small turn is τ Δθ.',
    'The moment of inertia I = Σ m r² plays the part of mass: mass far from the axis counts most.',
    'Angular momentum L = Iω changes only through an outside torque: τ = dL/dt.',
    'Internal forces come in equal, opposite pairs along one line, so their torques cancel — total angular momentum is conserved.',
    'In three dimensions torque and angular momentum are vectors along the axis: τ = r × F, L = r × p.'
  ],
  pitfalls: [
    'A bigger force always turns something more — Only the part of the force at right angles to the lever arm, times the arm, counts; a huge push aimed at the hinge does nothing.',
    'When a spinning skater pulls her arms in, her kinetic energy is conserved — Angular momentum is conserved; kinetic energy L²/2I goes up as I goes down, paid for by the work of her muscles.',
    'Angular momentum only matters for spinning wheels — A single particle moving in a straight line has angular momentum r × p about any point off its line, and it stays constant too.'
  ],
  formulas: [
    {
      name: 'Torque of a force',
      expr: 'tau = r*F*sin(theta)', tex: '\\tau = rF\\sin\\theta',
      vars: {
        tau: { name: 'torque', q: 'torque', unit: 'N·m', tex: '\\tau' },
        r: { name: 'distance from the axis to where the force acts', q: 'length', unit: 'm', value: 0.3 },
        F: { name: 'force', q: 'force', unit: 'N', value: 100 },
        theta: { name: 'angle between the arm and the force', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'r sin θ is the lever arm: the perpendicular distance from the axis to the line of the force.',
      stories: {
        tau: 'You pull with {F} on a wrench {r} long, at {theta} to the handle. What torque do you apply?',
        F: 'A bolt needs {tau} to loosen. You pull at {theta} to a wrench {r} long. How hard must you pull?'
      }
    },
    {
      name: 'Angular momentum of a spinning body',
      expr: 'L = I*omega', tex: 'L = I\\omega',
      vars: {
        L: { name: 'angular momentum', q: 'angmom', unit: 'kg·m²/s' },
        I: { name: 'moment of inertia', q: 'inertia', unit: 'kg·m²', value: 0.5 },
        omega: { name: 'angular velocity', q: 'angvel', unit: 'rpm', value: 120, tex: '\\omega' }
      },
      note: 'For rotation about a fixed axis (or a symmetry axis).',
      stories: { L: 'A flywheel with moment of inertia {I} turns at {omega}. What is its angular momentum?' }
    },
    {
      name: 'Newton\'s law for rotation',
      expr: 'tau = I*alpha', tex: '\\tau = I\\alpha',
      vars: {
        tau: { name: 'torque', q: 'torque', unit: 'N·m', tex: '\\tau' },
        I: { name: 'moment of inertia', q: 'inertia', unit: 'kg·m²', value: 0.5 },
        alpha: { name: 'angular acceleration', q: 'angacc', unit: 'rad/s²', value: 4, tex: '\\alpha' }
      },
      note: 'τ = dL/dt with I constant.',
      stories: { alpha: 'A torque of {tau} acts on a wheel with moment of inertia {I}. How fast does its spin grow?' }
    },
    {
      name: 'No outside torque: Iω stays the same',
      expr: 'omega2 = I1*omega1/I2', tex: '\\omega_2 = \\dfrac{I_1\\,\\omega_1}{I_2}',
      vars: {
        omega2: { name: 'angular velocity after', q: 'angvel', unit: 'rev/s', tex: '\\omega_2' },
        I1: { name: 'moment of inertia before', q: 'inertia', unit: 'kg·m²', value: 3.0, tex: 'I_1' },
        omega1: { name: 'angular velocity before', q: 'angvel', unit: 'rev/s', value: 2, tex: '\\omega_1' },
        I2: { name: 'moment of inertia after', q: 'inertia', unit: 'kg·m²', value: 1.2, tex: 'I_2' }
      },
      note: 'Conservation of angular momentum, I₁ω₁ = I₂ω₂. The kinetic energy changes by the factor I₁/I₂.',
      stories: {
        omega2: 'A skater spinning at {omega1} with moment of inertia {I1} pulls her arms in to {I2}. How fast does she spin now?',
        I2: 'A diver leaves the board turning at {omega1} with moment of inertia {I1} and tucks until he turns at {omega2}. What is his moment of inertia in the tuck?'
      }
    }
  ],
  derivation: {
    title: 'Torque from the work done in a small turn',
    steps: [
      { text: 'Turn the body by a small angle Δθ about the z-axis. A point at distance r from the axis moves along a circle by rΔθ, at right angles to its radius: in components, its displacement is', tex: '(\\Delta x,\\ \\Delta y) = (-y\\,\\Delta\\theta,\\ x\\,\\Delta\\theta)' },
      { text: 'The work done by a force at that point is force times displacement, component by component:', tex: '\\Delta W = F_x\\Delta x + F_y\\Delta y = (xF_y - yF_x)\\,\\Delta\\theta' },
      { text: 'Call the bracket the torque. Then work in a turn is torque times angle, just as work along a line is force times distance:', tex: '\\tau = xF_y - yF_x, \\qquad \\Delta W = \\tau\\,\\Delta\\theta' },
      { text: 'Writing the force at angle θ to the radius shows the lever arm r sin θ:', tex: '\\tau = rF\\sin\\theta' },
      { text: 'Adding the work of all torques and equating it to the change of kinetic energy ½Iω² gives the law of rotation, τ = I dω/dt = dL/dt.' }
    ]
  },
  examples: [
    {
      title: 'The skater\'s energy',
      q: 'A skater spins at 2.0 turns a second with her arms out ($I_1 = 3.0$ kg·m²) and pulls them in ($I_2 = 1.2$ kg·m²). Find her new spin rate and her kinetic energy before and after.',
      steps: [
        'Angular momentum is conserved: $\\omega_2 = I_1\\omega_1/I_2 = 3.0 \\times 2.0/1.2 = 5.0$ turns a second.',
        'In radians: $\\omega_1 = 2\\pi \\times 2 = 12.57$ rad/s, $\\omega_2 = 31.42$ rad/s.',
        '$K_1 = \\tfrac12 \\times 3.0 \\times 12.57^2 = 237$ J; $K_2 = \\tfrac12 \\times 1.2 \\times 31.42^2 = 592$ J.',
        'The energy grew by $355$ J, the factor $I_1/I_2 = 2.5$: her arm muscles did that much work pulling the masses inwards against their tendency to fly out.'
      ],
      a: '5.0 turns a second; 237 J before and 592 J after.'
    },
    {
      title: 'Where you push matters',
      q: 'You pull with 80 N on a 0.25 m wrench, first at right angles to it, then at 30° to the handle. What torques do you apply?',
      steps: [
        'At right angles: $\\tau = rF = 0.25 \\times 80 = 20$ N·m.',
        'At 30°: $\\tau = rF\\sin 30° = 20 \\times 0.5 = 10$ N·m — the lever arm is only half the wrench.'
      ],
      a: '20 N·m and 10 N·m.'
    }
  ],
  quiz: [
    { q: 'A spinning skater pulls her arms in. Her kinetic energy…', choices: ['increases', 'stays the same', 'decreases', 'drops to zero'], a: 0, why: 'L = Iω is fixed, so K = L²/2I rises as I falls. The extra energy is the work her muscles do.' },
    { q: 'You push hard on a door right at its hinge line. The door…', choices: ['does not turn: the lever arm is zero', 'turns fast', 'turns slowly', 'turns the other way'], a: 0, why: 'The torque is force times lever arm; at the hinge the arm is zero.' },
    { q: 'Angular momentum is conserved only for rigid bodies.', a: false, why: 'It holds for any system with no outside torque — skaters changing shape, planets, gas clouds collapsing into stars.' },
    { q: 'Two 1 kg masses sit at 0.5 m on either side of the axis of a light rod. What is the moment of inertia about the axis?', answer: 0.5, unit: 'kg·m²', why: 'I = Σ m r² = 2 × 1 × 0.5² = 0.5 kg·m².' },
    { q: 'A wheel spins in the plane of this page, turning anticlockwise as you look. Its angular momentum vector points…', choices: ['out of the page, towards you', 'into the page', 'along the rim', 'towards the centre'], a: 0, why: 'Curl the fingers of your right hand with the rotation: the thumb points out of the page.' }
  ],
  problems: [
    { q: 'A playground roundabout (a uniform disc of 200 kg and radius 2 m) turns at 0.5 rad/s with a 25 kg child standing at its centre. The child walks out to the rim. How fast does it turn now?', answer: 0.4, unit: 'rad/s', tol: 0.02, hint: 'The child at the rim adds m R² to the moment of inertia.',
      steps: ['Disc: $I = \\tfrac12 MR^2 = \\tfrac12 \\times 200 \\times 4 = 400$ kg·m²; the child at the centre adds nothing.', 'At the rim the child adds $25 \\times 2^2 = 100$ kg·m²: $I_2 = 500$ kg·m².', '$\\omega_2 = 400 \\times 0.5/500 = 0.4$ rad/s.'] },
    { q: 'A flywheel with $I = 2.0$ kg·m² spins at 3000 rpm. What steady braking torque stops it in 10 s?', answer: 62.8, unit: 'N·m', tol: 0.02, hint: 'Convert rpm to rad/s, then τ = I Δω/Δt.',
      steps: ['$\\omega = 3000 \\times 2\\pi/60 = 314.2$ rad/s.', '$\\tau = I\\,\\Delta\\omega/\\Delta t = 2.0 \\times 314.2/10 = 62.8$ N·m.'] }
  ],
  applications: [
    'Flywheels store energy as ½Iω² — in presses, old steam engines and some grid storage systems.',
    'A helicopter needs a tail rotor: without it, the torque turning the main rotor would spin the body the other way.',
    'Divers and gymnasts control their spin by changing their moment of inertia in mid-air — tuck to spin, stretch to stop.',
    'A cat dropped upside down turns over without any outside torque, by twisting its body in two parts.'
  ],
  history: 'Kepler found in 1609 that a planet sweeps out equal areas in equal times; Newton showed in the *Principia* (1687) that this holds for any force pointing to a fixed centre — the first conservation law of angular momentum. The general law, for rigid bodies and systems of particles, was worked out in the eighteenth century by Euler and others.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 18 (Rotation in Two Dimensions) — torque defined through work, angular momentum and its conservation.',
    'Vol. I, ch. 19 (Center of Mass; Moment of Inertia) — how to find moments of inertia, and the kinetic energy of rotation.',
    'Vol. I, ch. 20 (Rotation in Space) — torque and angular momentum as vectors, using the cross product.'
  ],
  sim: 'osc-spin-wheel'
},

{
  id: 'gyroscope-feyn', parent: 'oscillators', title: 'The gyroscope', level: 3,
  short: 'A spinning wheel held at one end of its axle does not fall: it swings slowly round instead. Gravity\'s torque is horizontal, at right angles to the angular momentum, so it turns the angular-momentum arrow sideways rather than tipping it. The precession rate is Ω = τ/L.',
  keywords: ['gyroscope', 'precession', 'nutation', 'spinning top', 'angular momentum vector', 'torque vector', 'precession of the equinoxes', 'Larmor precession', 'wobbling plate', 'bicycle wheel'],
  prereq: ['rotation-feyn', 'math:cross-product', 'physics:angular-momentum'],
  related: ['angular-momentum-quantum', 'paramagnetism-nmr', 'spin-half', 'harmonic-oscillator-feyn', 'physics:torque'],
  body: `
Hold a bicycle wheel by one end of its axle and let go: it drops. Spin it fast first and let go again: the axle stays almost level and swings slowly round the support, as if gravity had been switched off and replaced by a gentle sideways push. Nothing about this is special to gyroscopes. It is $\\vec\\tau = d\\vec L/dt$ from [[rotation-feyn]], taken seriously as a law about [[?vector|vectors]].

### The torque turns the arrow
The spinning wheel has angular momentum $\\vec L = I\\vec\\omega$ along its axle. Its weight $Mg$ acts at the centre of the wheel, a distance $l$ from the pivot. The torque about the pivot is the [[?cross-product|cross product]] $\\vec\\tau = \\vec r \\times M\\vec g$: its size is $Mgl$ (for a level axle) and it points **horizontally, at right angles to the axle**.

In a short time $dt$ the angular momentum changes by $d\\vec L = \\vec\\tau\\,dt$ — a small sideways arrow added to the tip of $\\vec L$. The arrow does not get longer or tip down; it turns. The angle it turns through is $d\\phi = \\tau\\,dt/L$, so the axle goes round at the **precession** rate

$$\\Omega = \\frac{d\\phi}{dt} = \\frac{\\tau}{L} = \\frac{Mgl}{I\\omega}$$

Spin faster and it precesses more slowly. A bicycle wheel of 2 kg with $I = 0.18$ kg·m², spinning at 300 rpm with its centre 0.2 m from the string, has $L = 5.7$ kg·m²/s and $\\tau = 3.9$ N·m, so $\\Omega = 0.69$ rad/s: once round in about 9 seconds. For a tilted axle both the torque and the horizontal part of $\\vec L$ carry a factor $\\sin\\theta$, so the rate does not depend on the tilt.

### Where does the falling go?
A gyroscope released from rest cannot precess at once: going round takes angular momentum about the vertical, and at the start there is none. So it begins to fall. The fall makes the torque tip the spin arrow sideways, the sideways motion swings the axle back up, and the axle bobs — **nutation** — while it drifts round. The bobbing is fast, about $I_3\\omega/I_1$ radians a second, and small: its depth goes as $1/\\omega^2$ (for the bicycle wheel, a dip of about 2°). Friction soon damps it, leaving the axle a little below where it started and precessing steadily. The small drop pays for the kinetic energy of the precession. Released with just the right sideways push, it precesses smoothly from the start.

> [!key] A gyroscope does exactly what $\\vec\\tau = d\\vec L/dt$ says: the torque is at right angles to $\\vec L$, so it changes the direction of $\\vec L$, not its size. Precession is the answer to "why doesn't it fall?" — and a small, bobbing fall is how it starts.

**In the simulation**, watch the three arrows: the spin $\\vec L$ along the axle, the torque $\\vec\\tau$ lying flat and always at right angles to it, and the precession $\\vec\\Omega$ pointing straight up. Release from rest and follow the tip of the axle: it traces little scallops (nutation) as it goes round. Halve the spin and the precession doubles and the scallops deepen fourfold.

### Precession everywhere
| Spinning thing | What pulls on it | Precession |
|---|---|---|
| Bicycle wheel on a string | its weight | about 0.7 rad/s |
| The Earth | Sun and Moon on its equatorial bulge | once in about 25 800 years |
| A proton in a 1.5 T MRI scanner | the magnetic field on its magnetic moment | 63.9 million times a second |

The Earth's precession slowly moves the pole star and the dates of the seasons against the stars. The proton's precession — the same law, with the torque $\\vec\\mu\\times\\vec B$ of a field on a magnet — is what magnetic resonance imaging listens to (see [[paramagnetism-nmr]]).
`,
  ideas: [
    'The weight of a gyroscope gives a horizontal torque at right angles to the spin angular momentum.',
    'Such a torque changes the direction of L, not its size: the axle swings round (precesses) instead of falling.',
    'The precession rate is Ω = τ/L = Mgl/(Iω): faster spin, slower precession.',
    'Released from rest, the axle first dips and bobs (nutation), at a rate near I₃ω/I₁, then precesses; the dip scales as 1/ω².',
    'The same law describes the Earth\'s 25 800-year precession and the precession of nuclear spins in MRI.'
  ],
  pitfalls: [
    'A spinning gyroscope has no torque on it, which is why it does not fall — The torque of its weight is there in full (Mgl); it is what makes the axle go round.',
    'Gyroscopes defy gravity — The support still carries the whole weight; the torque only changes the direction of the angular momentum, and a real gyroscope dips slightly before it precesses.',
    'Spinning faster makes it precess faster — The opposite: the same torque turns a longer arrow through a smaller angle, Ω = τ/L.'
  ],
  formulas: [
    {
      name: 'Precession rate of a gyroscope',
      expr: 'Omega = M*g*l/(I*omega)', tex: '\\Omega = \\dfrac{Mgl}{I\\omega_s}',
      vars: {
        Omega: { name: 'precession rate', q: 'angvel', unit: 'rad/s', tex: '\\Omega' },
        M: { name: 'mass of the wheel', q: 'mass', unit: 'kg', value: 2 },
        g: { const: 'g' },
        l: { name: 'distance from the pivot to the wheel\'s centre', q: 'length', unit: 'm', value: 0.2 },
        I: { name: 'moment of inertia about the axle', q: 'inertia', unit: 'kg·m²', value: 0.18 },
        omega: { name: 'spin rate', q: 'angvel', unit: 'rpm', value: 300, tex: '\\omega_s' }
      },
      note: 'For a fast spin (spin angular momentum much larger than that of the precession). Independent of the tilt of the axle.',
      stories: {
        Omega: 'A bicycle wheel of {M} with moment of inertia {I} spins at {omega}, hung by its axle {l} from the wheel\'s centre. How fast does it precess?',
        omega: 'A wheel of {M} and moment of inertia {I}, supported {l} from its centre, precesses at {Omega}. How fast is it spinning?'
      }
    },
    {
      name: 'Precession: torque turns the angular momentum',
      expr: 'Omega = tau/L', tex: '\\Omega = \\dfrac{\\tau}{L}',
      vars: {
        Omega: { name: 'precession rate', q: 'angvel', unit: 'rad/s', tex: '\\Omega' },
        tau: { name: 'torque at right angles to L', q: 'torque', unit: 'N·m', value: 3.92, tex: '\\tau' },
        L: { name: 'spin angular momentum', q: 'angmom', unit: 'kg·m²/s', value: 5.65 }
      },
      note: 'For the horizontal part of L when the axle is tilted: both τ and that part carry sin θ.',
      stories: { L: 'A torque of {tau} makes a gyroscope precess at {Omega}. What is its spin angular momentum?' }
    },
    {
      name: 'Nutation: how fast the axle bobs',
      expr: 'wn = I3*omega/I1', tex: '\\omega_n = \\dfrac{I_3\\,\\omega_s}{I_1}',
      vars: {
        wn: { name: 'nutation rate', q: 'angvel', unit: 'rad/s', tex: '\\omega_n' },
        I3: { name: 'moment of inertia about the axle', q: 'inertia', unit: 'kg·m²', value: 0.18, tex: 'I_3' },
        omega: { name: 'spin rate', q: 'angvel', unit: 'rpm', value: 300, tex: '\\omega_s' },
        I1: { name: 'moment of inertia about the pivot, across the axle', q: 'inertia', unit: 'kg·m²', value: 0.17, tex: 'I_1' }
      },
      note: 'For a fast top. The depth of the bobbing is about 2I₁Mgl/(I₃ω)² radians, so it vanishes quickly as the spin grows.',
      stories: { wn: 'A wheel with {I3} about its axle and {I1} about the pivot spins at {omega}. How fast does its axle nod when released?' }
    }
  ],
  derivation: {
    title: 'The precession rate from dL = τ dt',
    steps: [
      { text: 'The law of rotation says the angular momentum changes by the torque times the time:', tex: 'd\\vec L = \\vec\\tau\\,dt' },
      { text: 'The torque of the weight, r × Mg, is horizontal and at right angles to the axle, hence to L. A change at right angles to an arrow turns it without changing its length. The angle turned is the small sideways step divided by the length of the arrow:', tex: 'd\\phi = \\frac{|d\\vec L|}{L} = \\frac{\\tau\\,dt}{L}' },
      { text: 'Divide by dt to get the rate at which the axle swings round:', tex: '\\Omega = \\frac{d\\phi}{dt} = \\frac{\\tau}{L}' },
      { text: 'Put in the torque of the weight at lever arm l, and L = Iω for the spin:', tex: '\\Omega = \\frac{Mgl}{I\\omega}' },
      { text: 'We ignored the small angular momentum of the precession itself; that is why the result holds for a fast spin, and why a real release starts with a dip and nutation.' }
    ]
  },
  examples: [
    {
      title: 'A bicycle wheel on a string',
      q: 'A bicycle wheel (2.0 kg, $I = 0.18$ kg·m²) spins at 300 rpm. It hangs from a string tied to the axle 0.20 m from the wheel\'s centre. How long does it take to go once round?',
      steps: [
        'Spin: $\\omega = 300 \\times 2\\pi/60 = 31.4$ rad/s, so $L = I\\omega = 0.18 \\times 31.4 = 5.65$ kg·m²/s.',
        'Torque: $\\tau = Mgl = 2.0 \\times 9.81 \\times 0.20 = 3.92$ N·m.',
        '$\\Omega = \\tau/L = 0.694$ rad/s, so one turn takes $2\\pi/0.694 = 9.1$ s.'
      ],
      a: 'About 9 seconds per turn.'
    },
    {
      title: 'The Earth as a gyroscope',
      q: 'The Earth\'s axis goes round once in about 25 800 years. What is its precession rate, compared with its spin?',
      steps: [
        '$\\Omega = 2\\pi/(25\\,800 \\times 3.156\\times10^{7}\\ \\text{s}) = 7.7\\times10^{-12}$ rad/s.',
        'The spin is $2\\pi/86\\,164\\ \\text{s} = 7.29\\times10^{-5}$ rad/s.',
        'The ratio is about $10^{-7}$: the torque of the Sun and Moon on the equatorial bulge is tiny compared with the Earth\'s enormous angular momentum.'
      ],
      a: 'About 7.7 × 10⁻¹² rad/s — some ten million times slower than the spin.'
    }
  ],
  quiz: [
    { q: 'You double the spin of a gyroscope. Its precession…', choices: ['halves', 'doubles', 'stays the same', 'reverses'], a: 0, why: 'Ω = τ/L: the same torque turns an arrow twice as long through half the angle.' },
    { q: 'For a gyroscope with a level axle, supported at one end, the torque of its weight points…', choices: ['horizontally, at right angles to the axle', 'straight down', 'along the axle', 'straight up'], a: 0, why: 'τ = r × Mg is perpendicular to both the axle (r) and the vertical (g).' },
    { q: 'A steadily precessing gyroscope has no net torque on it.', a: false, why: 'The weight exerts a torque Mgl about the pivot all the time. It is exactly what keeps changing the direction of L.' },
    { q: 'You tilt the axle of a fast gyroscope upwards and release it. Its precession rate compared with a level axle is…', choices: ['the same', 'faster', 'slower', 'zero'], a: 0, why: 'The torque falls as sin θ, but so does the horizontal part of L that it has to turn.' },
    { q: 'Released from rest (no push), the axle of a spinning gyroscope first…', choices: ['dips slightly and bobs up and down while it starts to go round', 'rises', 'stays exactly level', 'falls all the way'], a: 0, why: 'To go round it needs angular momentum about the vertical, which only the small fall can provide: this starts the nutation.' }
  ],
  problems: [
    { q: 'A toy gyroscope has a disc of 0.10 kg and radius 3.0 cm spinning at 6000 rpm; its centre is 4.0 cm from the pivot. How many seconds does one precession take?', answer: 4.53, unit: 's', tol: 0.03, hint: 'For a disc I = ½MR².',
      steps: ['$I = \\tfrac12 \\times 0.10 \\times 0.03^2 = 4.5\\times10^{-5}$ kg·m²; $\\omega = 628.3$ rad/s; $L = 0.0283$ kg·m²/s.', '$\\tau = Mgl = 0.10 \\times 9.81 \\times 0.04 = 0.0392$ N·m.', '$\\Omega = \\tau/L = 1.39$ rad/s; one turn takes $2\\pi/1.39 = 4.53$ s.'] },
    { q: 'How fast (in rpm) must the bicycle wheel of the example (2.0 kg, I = 0.18 kg·m², l = 0.20 m) spin to precess only once every 20 s?', answer: 663, unit: 'rpm', tol: 0.02, hint: 'Solve Ω = Mgl/(Iω) for ω.',
      steps: ['$\\Omega = 2\\pi/20 = 0.314$ rad/s.', '$\\omega = Mgl/(I\\Omega) = 3.92/(0.18 \\times 0.314) = 69.4$ rad/s = 663 rpm.'] }
  ],
  applications: [
    'Gyrocompasses and the gyroscopes of inertial navigation keep a direction in space; spacecraft turn with reaction wheels and control-moment gyroscopes.',
    'A rolling bicycle or a thrown frisbee is steadied by angular momentum; the bicycle\'s steering also uses precession.',
    'Magnetic resonance imaging and NMR spectroscopy detect the precession of nuclear spins in a magnetic field.',
    'Astronomers must correct star positions for the Earth\'s precession: the pole star drifts, and in some 12 000 years Vega will be near the pole.'
  ],
  history: 'Hipparchus noticed the precession of the equinoxes in the second century BC; Newton explained it as the torque of the Sun and Moon on the Earth\'s bulge. Léon Foucault named the gyroscope in 1852 and used one to show the Earth\'s rotation. Feynman tells in *Surely You\'re Joking, Mr. Feynman!* how, feeling burnt out at Cornell, he watched someone toss a plate in the cafeteria, noticed that its wobble and the turning of its emblem went at different rates, and worked out the motion purely for fun — the playful attitude he credited with leading him back to the work that won the Nobel Prize.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 20 (Rotation in Space) — torque as a vector, the gyroscope and its precession, the angular momentum of a solid body.',
    'Vol. I, ch. 18 (Rotation in Two Dimensions) — the law τ = dL/dt on which the gyroscope rests.',
    '*Surely You\'re Joking, Mr. Feynman!* (1985) — the wobbling plate in the Cornell cafeteria.'
  ],
  sim: 'osc-gyroscope'
},

{
  id: 'harmonic-oscillator-feyn', parent: 'oscillators', title: 'The harmonic oscillator', level: 2,
  short: 'A mass on a spring obeys m d²x/dt² = −kx, and so, near the bottom of any valley of energy, does almost everything that vibrates. The motion is a cosine — the shadow of an arrow turning steadily round a circle — with a period that does not depend on how big the swing is.',
  keywords: ['harmonic oscillator', 'simple harmonic motion', 'mass on a spring', 'pendulum', 'natural frequency', 'period', 'amplitude', 'phase', 'initial conditions', 'Hooke\'s law', 'isochronism', 'linear differential equation', 'rotating arrow'],
  prereq: ['newtons-laws-numerically', 'physics:simple-harmonic-motion', 'math:harmonic-oscillator-ode'],
  related: ['algebra-complex-numbers', 'resonance-feyn', 'transients-feyn', 'linear-systems', 'origin-of-refractive-index', 'physics:mass-spring-system', 'physics:simple-pendulum', 'physics:quantum-harmonic-oscillator', 'physics:lc-resonance'],
  body: `
Feynman gave the harmonic oscillator a lecture of its own because the same equation turns up in so many places — a weight on a spring, a pendulum, a tuning fork, the charge in a radio circuit, the atoms of a molecule, even (in the classical picture) the electrons in glass that make light slow down. Learn it once and you have learned all of them: equations of the same form have the same solutions.

### The equation
A mass $m$ on a spring of stiffness $k$, pulled a distance $x$ from its resting place, feels a force $-kx$ back towards it. Newton's law gives

$$m\\frac{d^2x}{dt^2} = -kx$$

a [[?differential-equation]]: it links the position to its own [[?second-derivative]]. It asks for a function that, differentiated twice, gives itself back times a negative number. Cosines do exactly that: if $x = A\\cos(\\omega_0 t + \\phi)$, then $d^2x/dt^2 = -\\omega_0^2 x$, which fits when

$$\\omega_0 = \\sqrt{k/m}$$

This is the [[?angular-frequency]], in radians per second; the period is $T = 2\\pi/\\omega_0$. A 1 kg mass on a 100 N/m spring has $\\omega_0 = 10$ rad/s and swings once every 0.63 s. The amplitude $A$ does not appear: small or large swings take the same time, as long as the spring obeys $F = -kx$.

### A circle seen edge-on
A point going steadily round a circle of radius $A$ at $\\omega_0$ radians per second has horizontal coordinate $A\\cos(\\omega_0 t + \\phi)$. So simple harmonic motion is **uniform circular motion seen from the side** — the shadow of a turning arrow. The velocity is the shadow of the arrow's own velocity, a quarter turn ahead, and the acceleration is a quarter turn further, pointing back to the centre. The [[?phase]] $\\phi$ is where on the circle the arrow starts.

This picture is the door to the most useful trick in physics: write the arrow as a [[?complex-number|complex number]] and the motion as its real part,

$$x = \\mathrm{Re}\\left(\\hat A\\,e^{i\\omega_0 t}\\right), \\qquad \\hat A = A e^{i\\phi}$$

The factor $e^{i\\omega_0 t}$ is a [[?rotating-arrow|rotating arrow]]; see [[algebra-complex-numbers]] for why. **The simulation shows it literally**: the arrow turns, and a dashed line drops from its tip to the mass on the spring below.

### Two numbers fix the motion
A second-order equation needs two starting facts: where the mass is, $x_0$, and how fast it moves, $v_0$. They fix the amplitude and the phase: $A = \\sqrt{x_0^2 + (v_0/\\omega_0)^2}$. Pull the mass 5 cm and let go, or hit it at 0.5 m/s at the centre: both give a 5 cm swing, a quarter cycle apart.

### Energy sloshing
Kinetic energy $\\tfrac12 mv^2$ and spring energy $\\tfrac12 kx^2$ trade back and forth; their sum stays $\\tfrac12 kA^2$. On average each holds half of it.

### Why it is everywhere
Near the bottom of any smooth valley of potential energy, the [[?taylor-series]] of $V(x)$ starts with a parabola, $V \\approx V_0 + \\tfrac12 V''(x_0)(x - x_0)^2$: small vibrations about any stable equilibrium are harmonic, with an effective stiffness $k = V''$.

| System | plays the mass | plays the spring | $\\omega_0$ |
|---|---|---|---|
| Mass on a spring | $m$ | $k$ | $\\sqrt{k/m}$ |
| Pendulum, small swings | $m$ | $mg/L$ | $\\sqrt{g/L}$ |
| Coil and capacitor | inductance $L$ | $1/C$ | $1/\\sqrt{LC}$ |
| CO molecule | reduced mass $1.14\\times10^{-26}$ kg | bond, about 1860 N/m | $4.0\\times10^{14}$ rad/s (64 THz) |

> [!key] $\\ddot x = -\\omega_0^2 x$ is solved by $x = A\\cos(\\omega_0 t + \\phi)$ — the real part of an arrow turning at $\\omega_0$. The frequency is set by the system; the amplitude and phase by how it was started.
`,
  ideas: [
    'A linear restoring force, F = −kx, gives m ẍ = −kx, whose solutions are cosines with ω₀ = √(k/m).',
    'The period does not depend on the amplitude (isochronism) as long as the force stays proportional to x.',
    'Simple harmonic motion is uniform circular motion seen edge-on: x is the shadow of a rotating arrow, x = Re(A e^{iω₀t}).',
    'Two initial conditions (x₀ and v₀) fix the amplitude and the phase.',
    'Near any stable equilibrium the potential is a parabola, so small vibrations of anything are harmonic.'
  ],
  pitfalls: [
    'A bigger swing takes longer — For a linear spring the period is the same for any amplitude; the mass simply moves faster over the longer path. (A pendulum at large angles is not linear, and does slow down a little.)',
    'At the ends of the swing, where the velocity is zero, the acceleration is also zero — There the spring is stretched most, so the force and acceleration are largest; they vanish at the centre, where the speed is greatest.',
    'The pendulum\'s period depends on the mass of the bob — The mass cancels: the restoring force mg sin θ grows with m exactly as the inertia does, so ω₀ = √(g/L).'
  ],
  formulas: [
    {
      name: 'Natural angular frequency',
      expr: 'omega0 = sqrt(k/m)', tex: '\\omega_0 = \\sqrt{\\dfrac{k}{m}}',
      vars: {
        omega0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega_0' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 100 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 }
      },
      note: 'The period is T = 2π/ω₀ and the frequency f = ω₀/2π.',
      stories: {
        omega0: 'A {m} mass hangs on a spring of {k}. At what angular frequency does it bounce?',
        k: 'A {m} mass on a spring oscillates at {omega0}. How stiff is the spring?'
      }
    },
    {
      name: 'Amplitude from the starting position and speed',
      expr: 'A = sqrt(x0^2 + (v0/omega0)^2)', tex: 'A = \\sqrt{x_0^2 + \\left(\\dfrac{v_0}{\\omega_0}\\right)^2}',
      vars: {
        A: { name: 'amplitude', q: 'length', unit: 'cm' },
        x0: { name: 'starting displacement', q: 'length', unit: 'cm', value: 5, signed: true, tex: 'x_0' },
        v0: { name: 'starting velocity', q: 'speed', unit: 'm/s', value: 0.5, signed: true, tex: 'v_0' },
        omega0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 10, tex: '\\omega_0' }
      },
      note: 'The starting arrow has real part x₀ and, a quarter turn on, v₀/ω₀; its length is the amplitude.',
      stories: { A: 'An oscillator with {omega0} starts at {x0} from the centre moving at {v0}. How far will it swing?' }
    },
    {
      name: 'Energy of an oscillation',
      expr: 'E = k*A^2/2', tex: 'E = \\tfrac12 kA^2',
      vars: {
        E: { name: 'total energy', q: 'energy', unit: 'J' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 100 },
        A: { name: 'amplitude', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'Kinetic plus potential energy; each averages half of it over a cycle.',
      stories: { A: 'A spring of {k} holds {E} of oscillation energy. What is the amplitude?' }
    },
    {
      name: 'Period of a pendulum (small swings)',
      expr: 'T = 2*pi*sqrt(L/g)', tex: 'T = 2\\pi\\sqrt{\\dfrac{L}{g}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        L: { name: 'length of the pendulum', q: 'length', unit: 'm', value: 1 },
        g: { const: 'g' }
      },
      note: 'For swings of a few degrees; at 20° the period is about 0.8 % longer.',
      stories: {
        T: 'What is the period of a pendulum {L} long?',
        L: 'How long must a pendulum be to have a period of {T}?'
      }
    }
  ],
  derivation: {
    title: 'Guessing the solution and checking it',
    steps: [
      { text: 'Newton\'s law for the mass on the spring, divided by m, says the acceleration is −ω₀² times the displacement, with ω₀² = k/m:', tex: '\\frac{d^2x}{dt^2} = -\\omega_0^2\\,x' },
      { text: 'Try a cosine. Each time derivative brings down a factor ω and turns cos into −sin, then −sin into −cos:', tex: 'x = A\\cos(\\omega t + \\phi) \\;\\Rightarrow\\; \\frac{d^2x}{dt^2} = -\\omega^2 A\\cos(\\omega t + \\phi) = -\\omega^2 x' },
      { text: 'This matches the equation for any A and φ, provided ω is the natural frequency:', tex: '\\omega = \\omega_0 = \\sqrt{k/m}' },
      { text: 'At t = 0 the position is A cos φ and the velocity −ω₀A sin φ. Setting these to x₀ and v₀ fixes the two free numbers:', tex: 'A = \\sqrt{x_0^2 + (v_0/\\omega_0)^2}, \\qquad \\tan\\phi = -\\frac{v_0}{\\omega_0 x_0}' }
    ]
  },
  examples: [
    {
      title: 'A car on its springs',
      q: 'A quarter of a car, 300 kg, rests on a spring of 30 kN/m. At what frequency does it bounce (with the shock absorbers removed)?',
      steps: [
        '$\\omega_0 = \\sqrt{k/m} = \\sqrt{30\\,000/300} = 10$ rad/s.',
        '$f = \\omega_0/2\\pi = 1.6$ Hz — about the pace of brisk walking, which designers aim for so that the ride feels natural.'
      ],
      a: 'About 1.6 Hz (a period of 0.63 s).'
    },
    {
      title: 'Two ways to start the same swing',
      q: 'A 1 kg mass on a 100 N/m spring is (a) pulled 5 cm and released, (b) struck at the centre so that it moves at 0.5 m/s. Compare the motions.',
      steps: [
        '$\\omega_0 = 10$ rad/s in both cases.',
        '(a) $A = 5$ cm, $\\phi = 0$: $x = 5\\cos 10t$ cm.',
        '(b) $A = v_0/\\omega_0 = 0.05$ m $= 5$ cm, $\\phi = -90°$: $x = 5\\sin 10t$ cm.',
        'Same amplitude, same energy $\\tfrac12 kA^2 = 0.125$ J; the arrows start a quarter turn apart.'
      ],
      a: 'Both swing 5 cm with a period of 0.63 s, a quarter of a cycle apart.'
    }
  ],
  quiz: [
    { q: 'You double the amplitude of a mass on an ideal spring. The period…', choices: ['stays the same', 'doubles', 'increases by √2', 'halves'], a: 0, why: 'ω₀ = √(k/m) contains no amplitude: the mass just moves twice as fast on a path twice as long.' },
    { q: 'You make the mass four times heavier. The period…', choices: ['doubles', 'is four times longer', 'stays the same', 'halves'], a: 0, why: 'T = 2π√(m/k) grows as the square root of the mass.' },
    { q: 'Where is the acceleration of the oscillating mass largest?', choices: ['at the ends of the swing', 'at the centre', 'everywhere the same', 'a quarter of the way out'], a: 0, why: 'a = −ω₀²x is largest where the displacement is largest — where the mass momentarily stops.' },
    { q: 'At half the amplitude, what fraction of the energy is kinetic?', answer: 0.75, why: 'Spring energy ½k(A/2)² is a quarter of ½kA², so three quarters is kinetic.' },
    { q: 'The same pendulum clock is taken to the Moon (g = 1.62 m/s²). It runs…', choices: ['slow: the period is about 2.5 times longer', 'fast', 'at the same rate', 'slow: the period is 6 times longer'], a: 0, why: 'T ∝ 1/√g, and √(9.81/1.62) = 2.46.' }
  ],
  problems: [
    { q: 'How long must a pendulum be for each swing (half a period) to last exactly 1 s?', answer: 0.994, unit: 'm', tol: 0.01, hint: 'The full period is 2 s.',
      steps: ['$T = 2$ s, so $L = g(T/2\\pi)^2 = 9.81 \\times (2/2\\pi)^2 = 0.994$ m.'] },
    { q: 'A 250 g mass on a spring makes 20 oscillations in 12.6 s. What is the spring constant?', answer: 24.9, unit: 'N/m', tol: 0.02, hint: 'Find the period, then k = m(2π/T)².',
      steps: ['$T = 12.6/20 = 0.63$ s, $\\omega_0 = 2\\pi/0.63 = 9.97$ rad/s.', '$k = m\\omega_0^2 = 0.25 \\times 99.5 = 24.9$ N/m.'] }
  ],
  applications: [
    'Clocks count the oscillations of pendulums, balance wheels, quartz crystals (32 768 Hz in a wristwatch) and, most precisely, atoms.',
    'Infrared spectroscopy identifies molecules by the vibration frequencies of their bonds, each a tiny harmonic oscillator.',
    'Seismometers, car suspensions and building dampers are designed around the natural frequencies of mass–spring systems.',
    'The same equation, with inductance and capacitance, tunes every radio; in quantum mechanics its energy levels are equally spaced by ħω.'
  ],
  history: 'Galileo studied pendulums from about 1602 and believed their period independent of the swing. Christiaan Huygens built the first pendulum clock in 1656 and showed in 1673 that exact isochronism needs the bob to move on a cycloid. Robert Hooke published his law of springs, force proportional to stretch, in 1678.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 21 (The Harmonic Oscillator) — linear differential equations, the oscillator, harmonic motion and circular motion, initial conditions.',
    'Vol. I, ch. 25 (Linear Systems and Review) — the same equation in mechanics and electricity.'
  ],
  sim: ['osc-phasor', { id: 'osc-complex', params: { mode: 'circle' } }]
},

{
  id: 'algebra-complex-numbers', parent: 'oscillators', title: 'Algebra, complex numbers and Euler\'s formula', level: 2,
  short: 'Every new operation of arithmetic forces new numbers on us — negatives, fractions, irrationals, and finally i = √−1. Drawn as arrows, complex numbers multiply by multiplying lengths and adding angles, and e^{iθ} = cos θ + i sin θ is an arrow of length one turned through θ: the key to every oscillation.',
  keywords: ['complex numbers', 'imaginary unit', 'Euler\'s formula', 'e^{iθ}', 'unit circle', 'complex plane', 'polar form', 'logarithms', 'square roots of 10', 'power series', 'de Moivre', 'rotating arrow', 'algebra'],
  prereq: ['math:complex-numbers', 'math:exp-log', 'math:taylor-series'],
  related: ['harmonic-oscillator-feyn', 'resonance-feyn', 'arrow-rule', 'probability-amplitudes', 'math:eulers-formula', 'math:polar-form', 'math:complex-plane'],
  body: `
In the middle of his lectures on oscillations Feynman stopped for a whole lecture on **algebra** — not the algebra of solving equations, but the story of numbers themselves. It ends with Euler's formula, which he presented as the treasure the whole story leads to, and which the rest of physics uses every day.

### Each inverse brings new numbers
Start with counting and addition. Ask for the inverse of addition — subtraction — and $3 - 5$ has no answer until we invent negative numbers. The inverse of multiplication needs fractions; the inverse of powers (roots) needs irrationals like $\\sqrt 2$. Each time the rule is the same: keep the old laws of arithmetic ($a + b = b + a$, $a(b + c) = ab + ac$, $a^{b+c} = a^b a^c$) and let them decide what the new numbers must mean. Then $\\sqrt{-1}$ appears. Call it $i$, the [[?imaginary-unit]], with $i^2 = -1$, and a new kind of number $a + ib$ is forced on us — a [[?complex-number|complex number]]. Remarkably, after that no new inverse ever demands anything more.

### Numbers as arrows
Draw $a + ib$ as an arrow from the origin to the point $(a, b)$. Adding is putting arrows head to tail. Multiplying is prettier: **lengths multiply and angles add**. Multiplying by $i$ turns any arrow a quarter turn anticlockwise, which is why $i \\cdot i = -1$ — two quarter turns point backwards. The length $r = \\sqrt{a^2 + b^2}$ is the [[?absolute-value|absolute value]] and the angle $\\theta$ is the argument: $a = r\\cos\\theta$, $b = r\\sin\\theta$.

### Feynman's route to Euler's formula
He built it the way the logarithm tables were first computed. Take the square root of 10, then the root of that, and so on: after ten roots, $10^{1/1024} = 1.00225$. The excess over 1 halves with each root, so for a tiny power $s$, $10^s \\approx 1 + 2.3026\\,s$ — a [[?small-approximation]] whose number 2.3026 is $\\ln 10$ (see [[?logarithm]]). Now boldly put in an *imaginary* tiny power: $10^{is} \\approx 1 + 2.3026\\,is$, an arrow a hair's breadth above 1 whose length is 1 to first order. Raising it to higher powers multiplies it by itself again and again: each multiplication adds the same small angle and leaves the length alone. The arrow **walks round the unit circle**, and its real and imaginary parts are the cosine and sine. In the natural base $e$:

$$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$

This is [[?euler-formula|Euler's formula]]. At $\\theta = \\pi$ it gives $e^{i\\pi} = -1$, joining $e$, $\\pi$, $i$ and $-1$ in one line.

### The same thing from the series
The [[?exponential]] is the series $e^x = 1 + x + x^2/2! + x^3/3! + \\dots$ (a [[?taylor-series]]). Put $x = i\\theta$: the powers of $i$ cycle through $1, i, -1, -i$, so the terms are arrows turning a quarter turn each time and shrinking fast (thanks to the [[?factorial|factorials]]). Laid head to tail they spiral in onto $e^{i\\theta}$. At $\\theta = \\pi$:

| Terms added | Partial sum |
|---|---|
| 1 | $1$ |
| 2 | $1 + 3.142i$ |
| 3 | $-3.935 + 3.142i$ |
| 5 | $0.124 - 2.026i$ |
| 7 | $-1.211 + 0.524i$ |
| 9 | $-0.976 - 0.075i$ |
| 11 | $-1.002 + 0.007i$ |

The real terms make the cosine series and the imaginary ones the sine series. **The simulation draws this spiral**, and also the small-step walk and the multiplication of arrows.

### Why physicists care
An oscillation $A\\cos(\\omega t + \\phi)$ is the real part of $\\hat A e^{i\\omega t}$, a [[?rotating-arrow|rotating arrow]]. Differentiating it just multiplies by $i\\omega$, so linear differential equations turn into algebra — the method of [[resonance-feyn]]. And the trigonometric identities come free: $e^{i(a+b)} = e^{ia}e^{ib}$ contains the formulas for $\\cos(a + b)$ and $\\sin(a + b)$.

> [!key] Complex numbers are arrows: add head to tail, multiply by multiplying lengths and adding angles. $e^{i\\theta}$ is the arrow of length 1 at angle $\\theta$; $e^{i\\omega t}$ goes round steadily — the picture of every oscillation.
`,
  ideas: [
    'Each inverse operation (subtraction, division, roots) forces a new kind of number; keeping the old rules of algebra decides what the new numbers mean.',
    'A complex number a + ib is an arrow; multiplying multiplies lengths and adds angles, and multiplying by i is a quarter turn.',
    'For tiny s, 10^s ≈ 1 + s ln 10; so a tiny imaginary power is a tiny step at right angles, and repeated steps walk round the unit circle.',
    'Euler\'s formula e^{iθ} = cos θ + i sin θ follows from the exponential series with x = iθ: the terms spiral onto the point of the circle.',
    'Writing oscillations as Re(A e^{iωt}) turns differentiation into multiplication by iω.'
  ],
  pitfalls: [
    'Imaginary numbers are not real, so physics that uses them is a trick of no meaning — They are ordinary pairs of numbers with a rule for multiplying; as arrows they describe rotations and oscillations exactly.',
    'e^{iθ} grows with θ like an ordinary exponential — Its length is always 1: it turns, it never grows. Only a real part in the exponent makes it grow or shrink.',
    'The real part of a product is the product of the real parts — It is not: Re(zw) = Re z Re w − Im z Im w. Take real parts only at the end, after multiplying.'
  ],
  formulas: [
    {
      name: 'Length of a complex number',
      expr: 'r = sqrt(a^2 + b^2)', tex: 'r = \\sqrt{a^2 + b^2}',
      vars: {
        r: { name: 'length (modulus) of a + ib' },
        a: { name: 'real part', value: 3, signed: true },
        b: { name: 'imaginary part', value: 4, signed: true }
      },
      note: 'Pythagoras for the arrow from 0 to (a, b). Also r² = z z*, with z* = a − ib the conjugate.',
      stories: { r: 'How long is the arrow {a} + {b} i?' }
    },
    {
      name: 'Real part from length and angle',
      expr: 'a = r*cos(theta)', tex: 'a = r\\cos\\theta',
      vars: {
        a: { name: 'real part', signed: true },
        r: { name: 'length', value: 5 },
        theta: { name: 'angle of the arrow', q: 'angle', unit: '°', value: 53.13, min: -180, max: 180, signed: true, tex: '\\theta' }
      },
      note: 'The polar form z = r e^{iθ} = r cos θ + i r sin θ; the imaginary part is r sin θ.',
      stories: { theta: 'An arrow of length {r} has real part {a}. At what angle does it point?' }
    },
    {
      name: 'Walking round the circle in n small steps: the length of (1 + iθ/n)ⁿ',
      expr: 'R = (1 + (theta/n)^2)^(n/2)', tex: 'R = \\left(1 + \\frac{\\theta^2}{n^2}\\right)^{n/2}',
      vars: {
        R: { name: 'length of (1 + iθ/n)ⁿ' },
        theta: { name: 'total angle', q: 'angle', unit: 'rad', value: 3.1416, tex: '\\theta' },
        n: { name: 'number of steps', int: true, value: 100 }
      },
      note: 'Each step has length √(1 + θ²/n²); with many small steps the length tends to 1 and the product tends to e^{iθ}.',
      stories: { R: 'You walk an angle of {theta} round the circle in {n} equal steps of (1 + iθ/n). How long is the final arrow?' }
    }
  ],
  derivation: {
    title: 'Euler\'s formula from the exponential series',
    steps: [
      { text: 'The exponential is the sum of powers divided by factorials; this series works for any number, complex ones included:', tex: 'e^{x} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\dots' },
      { text: 'Put x = iθ. Powers of i cycle: i² = −1, i³ = −i, i⁴ = 1, so each term is the previous one turned a quarter turn and shrunk:', tex: 'e^{i\\theta} = 1 + i\\theta - \\frac{\\theta^2}{2!} - i\\frac{\\theta^3}{3!} + \\frac{\\theta^4}{4!} + \\dots' },
      { text: 'Collect the terms without i and those with i. They are exactly the series for cosine and sine:', tex: 'e^{i\\theta} = \\left(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\dots\\right) + i\\left(\\theta - \\frac{\\theta^3}{3!} + \\dots\\right)' },
      { text: 'So the exponential of an imaginary number is a point of the unit circle:', tex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta' },
      { text: 'Multiplying two such arrows adds their angles, e^{ia}e^{ib} = e^{i(a+b)}; taking real and imaginary parts gives the addition formulas for cosine and sine without memorising them.' }
    ]
  },
  examples: [
    {
      title: 'Multiplying two arrows',
      q: 'Multiply $1 + i$ by $1 + i\\sqrt3$, first by algebra, then as arrows.',
      steps: [
        'Algebra: $(1 + i)(1 + i\\sqrt3) = 1 + i\\sqrt3 + i + i^2\\sqrt3 = (1 - \\sqrt3) + i(1 + \\sqrt3) = -0.732 + 2.732i$.',
        'Arrows: $1 + i$ has length $\\sqrt2$ at 45°; $1 + i\\sqrt3$ has length 2 at 60°.',
        'Product: length $2\\sqrt2 = 2.83$ at $105°$; indeed $2.83\\cos 105° = -0.732$ and $2.83\\sin 105° = 2.732$.'
      ],
      a: '−0.732 + 2.732i: length 2√2, angle 105°.'
    },
    {
      title: 'Trigonometry for free',
      q: 'Use $e^{i(a+b)} = e^{ia}e^{ib}$ to find $\\cos(a + b)$.',
      steps: [
        'Left side: $\\cos(a + b) + i\\sin(a + b)$.',
        'Right side: $(\\cos a + i\\sin a)(\\cos b + i\\sin b) = (\\cos a\\cos b - \\sin a\\sin b) + i(\\sin a\\cos b + \\cos a\\sin b)$.',
        'Real parts must match.'
      ],
      a: 'cos(a + b) = cos a cos b − sin a sin b (and the imaginary parts give sin(a + b)).'
    }
  ],
  quiz: [
    { q: 'Multiplying a complex number by i…', choices: ['turns its arrow a quarter turn anticlockwise', 'doubles its length', 'reflects it in the real axis', 'makes it imaginary and shorter'], a: 0, why: 'i has length 1 and angle 90°: lengths multiply (by 1) and angles add (90°).' },
    { q: 'How long is the arrow 3 + 4i?', answer: 5, why: '√(3² + 4²) = 5.' },
    { q: 'As θ increases, e^{iθ} grows like an exponential.', a: false, why: 'Its length is always 1; it goes round the unit circle. Growth needs a real part in the exponent.' },
    { q: 'What is (1 + i)⁸?', choices: ['16', '256', '8i', '−16'], a: 0, why: '1 + i has length √2 at 45°. The eighth power has length (√2)⁸ = 16 and angle 360°: the real number 16.' },
    { q: 'Surprisingly, iⁱ is a real number. What is it? (Write i = e^{iπ/2}.)', answer: 0.2079, why: 'iⁱ = (e^{iπ/2})ⁱ = e^{i·iπ/2} = e^{−π/2} ≈ 0.208.' }
  ],
  problems: [
    { q: 'You repeatedly multiply 1 by the arrow 1 + 0.01i. After how many steps does the result first point (almost) exactly backwards, at 180°?', answer: 314, tol: 0.01, hint: 'Each step turns the arrow by the angle of 1 + 0.01i, which is atan(0.01) ≈ 0.01 rad.',
      steps: ['Each multiplication adds the angle $\\arctan 0.01 = 0.0099997$ rad.', '$\\pi/0.0099997 = 314.2$, so about 314 steps.', 'The length has grown slightly, to $(1 + 10^{-4})^{157} = 1.016$: with smaller steps it would stay closer to 1.'] },
    { q: 'Find the real part of $e^{i\\,2\\pi/3}$.', answer: -0.5, tol: 0.01, hint: 'e^{iθ} = cos θ + i sin θ.',
      steps: ['$\\cos(2\\pi/3) = \\cos 120° = -0.5$.'] }
  ],
  applications: [
    'Alternating-current engineers write voltages and currents as complex numbers (phasors); impedances multiply and divide like arrows.',
    'Every wave and oscillation in physics — sound, light, quantum amplitudes — is written with e^{iωt} or e^{i(kx − ωt)}.',
    'Signal processing (the Fourier transform) decomposes sounds and images into rotating arrows e^{iωt}.',
    'In quantum mechanics the amplitudes themselves are complex numbers; see [[arrow-rule]].'
  ],
  history: 'Gerolamo Cardano met square roots of negative numbers while solving cubic equations (1545), and Rafael Bombelli gave rules for computing with them (1572). Henry Briggs computed his tables of logarithms (1624) by taking square roots of 10 over and over. Leonhard Euler published e^{ix} = cos x + i sin x in 1748. Caspar Wessel (1799) and Jean-Robert Argand (1806) drew complex numbers as arrows in a plane.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 22 (Algebra) — from counting to complex numbers, computing logarithms by successive square roots of 10, imaginary exponents and Euler\'s formula.',
    'Vol. I, ch. 23 (Resonance) — complex numbers put to work on oscillations.',
    '*QED: The Strange Theory of Light and Matter*, ch. 1 — the same arrows, used for the amplitudes of light.'
  ],
  sim: 'osc-complex'
},

{
  id: 'resonance-feyn', parent: 'oscillators', title: 'Resonance', level: 2,
  short: 'Drive a damped oscillator with a steady rhythm and, after a while, it swings at the drive\'s frequency with an amplitude and a lag that depend on how close that rhythm is to its own. Near its natural frequency the response is huge and lags by a quarter cycle. Complex numbers turn the whole problem into one line of algebra.',
  keywords: ['resonance', 'forced oscillation', 'driven oscillator', 'damping', 'Q factor', 'quality factor', 'resonance curve', 'phase lag', 'bandwidth', 'Lorentzian', 'complex response', 'tuning'],
  prereq: ['harmonic-oscillator-feyn', 'algebra-complex-numbers', 'physics:driven-oscillations'],
  related: ['transients-feyn', 'linear-systems', 'ac-circuits-feyn', 'origin-of-refractive-index', 'scattering-blue-sky', 'paramagnetism-nmr', 'physics:lc-resonance', 'math:forced-oscillator-ode'],
  body: `
Push a child on a swing a little at a time, always at the right moment, and the swing goes high; push at a random rhythm and little happens. That is resonance. Feynman used it to show the power of the complex-number method: a problem that takes a page of trigonometry becomes one line of algebra.

### The driven, damped oscillator
A mass on a spring, with friction proportional to speed, driven by a force $F_0\\cos\\omega t$:

$$m\\ddot x + m\\gamma\\dot x + kx = F_0\\cos\\omega t$$

Here $\\gamma$ (a rate, in s⁻¹) measures the damping, $\\omega_0 = \\sqrt{k/m}$ is the natural frequency and $\\omega$ is the drive's. After the start-up has died away (see [[transients-feyn]]), the mass moves at the drive frequency.

### Complex numbers do the work
Write the force as the real part of a [[?rotating-arrow|rotating arrow]], $F_0 e^{i\\omega t}$, and guess the same kind of motion, $\\hat x\\, e^{i\\omega t}$, with a [[?complex-number|complex]] $\\hat x$ that holds both the size and the [[?phase]] of the response. Every time [[?derivative]] now just multiplies by $i\\omega$, so the [[?differential-equation]] becomes algebra:

$$(-\\omega^2 + i\\gamma\\omega + \\omega_0^2)\\,\\hat x = \\frac{F_0}{m} \\quad\\Rightarrow\\quad \\hat x = \\frac{F_0/m}{\\omega_0^2 - \\omega^2 + i\\gamma\\omega}$$

The length of $\\hat x$ is the amplitude and its angle is how far the motion lags behind the force:

$$|\\hat x| = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + \\gamma^2\\omega^2}}, \\qquad \\tan\\phi = \\frac{\\gamma\\omega}{\\omega_0^2 - \\omega^2}$$

### Reading the resonance curve
For $Q = \\omega_0/\\gamma = 10$, in units of the static stretch $F_0/k$:

| $\\omega/\\omega_0$ | amplitude | lag behind the force |
|---|---|---|
| 0.5 | 1.33 | 4° |
| 0.9 | 4.76 | 25° |
| 1.0 | 10.0 | 90° |
| 1.1 | 4.22 | 152° |
| 2.0 | 0.33 | 176° |

- **Slow driving**: the spring does everything; the mass follows the force, in phase, stretched by $F_0/k$.
- **At resonance**: the spring and the inertia cancel, only friction limits the motion, and the amplitude is $Q$ times the static stretch. The motion lags by exactly 90°, so the force is in step with the *velocity* — it pushes the right way all the time and feeds in energy fastest.
- **Fast driving**: the mass's inertia wins; it barely moves ($\\propto 1/\\omega^2$) and moves *against* the force.

The absorbed power has a peak whose full width at half height is $\\gamma$: a high-$Q$ oscillator is a sharp filter. **In the simulation**, sweep the frequency and watch the force arrow and the response arrow turn together, the angle between them opening from 0 to 180° as you pass through resonance.

> [!key] A driven oscillator responds at the drive's frequency with $\\hat x = (F_0/m)/(\\omega_0^2 - \\omega^2 + i\\gamma\\omega)$. Near $\\omega_0$ the response is $Q$ times the static one and lags a quarter cycle; the peak is $\\gamma$ wide.

### Resonance everywhere
The same curve describes a radio tuned to one station (an LC circuit, [[ac-circuits-feyn]]), the electrons in glass that set the [[origin-of-refractive-index|refractive index]], atoms absorbing light at sharp lines, nuclei flipping in an MRI scanner, and short-lived particles: the Z boson appears as a resonance peak at 91.2 GeV, 2.5 GeV wide. Feynman closed his lecture with this point — curves of the same shape turn up throughout nature, from atoms to elementary particles.
`,
  ideas: [
    'A driven oscillator settles into motion at the drive frequency, not its own.',
    'With the force written as F₀e^{iωt}, the response is x̂ = (F₀/m)/(ω₀² − ω² + iγω): its length is the amplitude, its angle the lag.',
    'Below resonance the motion follows the force; at resonance it lags 90° and is Q times the static stretch; far above, it opposes the force and shrinks as 1/ω².',
    'Q = ω₀/γ measures sharpness: the power peak is γ wide, and the peak amplitude is Q times the static one.',
    'The same resonance curve appears in circuits, atoms, nuclei and elementary particles.'
  ],
  pitfalls: [
    'At resonance the displacement is in step with the force — It lags by a quarter cycle; it is the velocity that is in step with the force, which is why energy flows in fastest.',
    'Without friction the amplitude at resonance would be infinite at once — The steady-state amplitude grows without bound, but it takes time: undamped, it grows steadily, cycle after cycle.',
    'The Tacoma Narrows bridge fell because wind matched its natural frequency — Its collapse in 1940 is usually explained as aeroelastic flutter, the wind feeding energy in through the bridge\'s own motion, not a periodic push at a fixed rhythm.'
  ],
  formulas: [
    {
      name: 'Amplitude of a driven, damped oscillator',
      expr: 'x0 = F0/(m*sqrt((w0^2 - w^2)^2 + gamma^2*w^2))',
      tex: 'x_0 = \\dfrac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + \\gamma^2\\omega^2}}',
      vars: {
        x0: { name: 'amplitude of the steady motion', q: 'length', unit: 'mm', tex: 'x_0' },
        F0: { name: 'amplitude of the driving force', q: 'force', unit: 'N', value: 1, tex: 'F_0' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 10, min: 0, max: 1000, tex: '\\omega_0' },
        w: { name: 'driving angular frequency', q: 'angvel', unit: 'rad/s', value: 9, min: 0, max: 1000, tex: '\\omega' },
        gamma: { name: 'damping rate', q: 'rate', unit: '1/s', value: 1, tex: '\\gamma' }
      },
      note: 'The steady state, after the transient has died away. The friction force is mγv.',
      stories: {
        x0: 'A {m} mass with natural frequency {w0} and damping {gamma} is driven by a force of amplitude {F0} at {w}. How big is the steady swing?',
        w: 'A {m} oscillator ({w0}, damping {gamma}) driven by {F0} swings with amplitude {x0}. At what driving frequency (there may be two)?'
      }
    },
    {
      name: 'Phase lag of the motion behind the force',
      expr: 'phi = atan2(gamma*w, w0^2 - w^2)', tex: '\\tan\\phi = \\dfrac{\\gamma\\omega}{\\omega_0^2 - \\omega^2}',
      vars: {
        phi: { name: 'lag of the displacement behind the force', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\phi' },
        gamma: { name: 'damping rate', q: 'rate', unit: '1/s', value: 1, tex: '\\gamma' },
        w: { name: 'driving angular frequency', q: 'angvel', unit: 'rad/s', value: 9, min: 0, max: 1000, tex: '\\omega' },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 10, min: 0, max: 1000, tex: '\\omega_0' }
      },
      note: 'From 0 (slow driving) through 90° (resonance) to 180° (fast driving).',
      stories: { phi: 'An oscillator with natural frequency {w0} and damping {gamma} is driven at {w}. How far does its motion lag behind the force?' }
    },
    {
      name: 'Quality factor',
      expr: 'Q = w0/gamma', tex: 'Q = \\dfrac{\\omega_0}{\\gamma}',
      vars: {
        Q: { name: 'quality factor' },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 10, tex: '\\omega_0' },
        gamma: { name: 'damping rate (full width of the power peak)', q: 'rate', unit: '1/s', value: 1, tex: '\\gamma' }
      },
      note: 'Also the natural frequency divided by the width of the resonance: Q = f₀/Δf.',
      stories: { gamma: 'An oscillator at {w0} has a quality factor of {Q}. How wide is its resonance?' }
    },
    {
      name: 'Amplitude at resonance',
      expr: 'xr = F0/(m*gamma*w0)', tex: 'x_{\\text{res}} = \\dfrac{F_0}{m\\gamma\\omega_0}',
      vars: {
        xr: { name: 'amplitude when driven at ω₀', q: 'length', unit: 'mm', tex: 'x_{\\text{res}}' },
        F0: { name: 'amplitude of the driving force', q: 'force', unit: 'N', value: 1, tex: 'F_0' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        gamma: { name: 'damping rate', q: 'rate', unit: '1/s', value: 1, tex: '\\gamma' },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 10, tex: '\\omega_0' }
      },
      note: 'Q times the static stretch F₀/k.',
      stories: { gamma: 'A {m} oscillator at {w0} driven at resonance by {F0} swings {xr}. What is its damping rate?' }
    }
  ],
  derivation: {
    title: 'The response in one line of algebra',
    steps: [
      { text: 'Replace the real force by a rotating arrow whose real part is the force, and look for a motion of the same kind (we take real parts at the end):', tex: 'F = F_0 e^{i\\omega t}, \\qquad x = \\hat x\\, e^{i\\omega t}' },
      { text: 'Each time derivative of e^{iωt} multiplies it by iω, so the velocity is iω x and the acceleration −ω² x:', tex: '\\dot x = i\\omega\\,\\hat x e^{i\\omega t}, \\qquad \\ddot x = -\\omega^2\\,\\hat x e^{i\\omega t}' },
      { text: 'Put these into m ẍ + mγ ẋ + kx = F and cancel the common factor e^{iωt}: the differential equation has become an ordinary equation for the number x̂.', tex: 'm(-\\omega^2 + i\\gamma\\omega + \\omega_0^2)\\,\\hat x = F_0' },
      { text: 'Divide. The response is a complex number:', tex: '\\hat x = \\frac{F_0/m}{\\omega_0^2 - \\omega^2 + i\\gamma\\omega}' },
      { text: 'Its length is the amplitude (divide by the length of the denominator) and its angle is minus the angle of the denominator — the lag:', tex: '|\\hat x| = \\frac{F_0/m}{\\sqrt{(\\omega_0^2-\\omega^2)^2 + \\gamma^2\\omega^2}}, \\qquad \\tan\\phi = \\frac{\\gamma\\omega}{\\omega_0^2 - \\omega^2}' }
    ]
  },
  examples: [
    {
      title: 'Walking through resonance',
      q: 'A 1 kg mass on a 100 N/m spring ($\\omega_0 = 10$ rad/s) has $\\gamma = 1$ s⁻¹ and is driven by a 1 N force. Find the amplitude and lag at 9, 10 and 11 rad/s.',
      steps: [
        'At 9 rad/s: $\\omega_0^2 - \\omega^2 = 19$, $\\gamma\\omega = 9$: $|\\hat x| = 1/\\sqrt{19^2 + 9^2} = 1/21.0 = 0.0476$ m; lag $\\arctan(9/19) = 25°$.',
        'At 10 rad/s: $|\\hat x| = 1/(1 \\times 10) = 0.100$ m, lag 90°.',
        'At 11 rad/s: $\\omega_0^2 - \\omega^2 = -21$, $\\gamma\\omega = 11$: $|\\hat x| = 1/23.7 = 0.0422$ m; lag $180° - \\arctan(11/21) = 152°$.',
        'The static stretch is $F_0/k = 10$ mm, so the resonance multiplies it by $Q = 10$.'
      ],
      a: '48 mm (25°), 100 mm (90°) and 42 mm (152°).'
    },
    {
      title: 'Tuning a radio',
      q: 'The tuned circuit of a medium-wave radio has $Q = 100$ at 1 MHz. How wide a band of frequencies does it let through?',
      steps: ['The full width at half power is $\\Delta f = f_0/Q = 10^6/100 = 10$ kHz.', 'That is about the spacing of medium-wave stations (9 or 10 kHz), so one station comes through and its neighbours are weakened.'],
      a: 'About 10 kHz.'
    }
  ],
  quiz: [
    { q: 'At resonance, the displacement of a driven oscillator…', choices: ['lags the force by a quarter cycle', 'is in step with the force', 'is opposite to the force', 'leads the force by a quarter cycle'], a: 0, why: 'At ω = ω₀ the denominator is purely iγω₀, so x̂ is −i times a real number: 90° behind.' },
    { q: 'At resonance the driving force is in step with the velocity.', a: true, why: 'The velocity leads the displacement by 90°, which cancels the 90° lag: force and velocity line up, so the force does positive work all the time.' },
    { q: 'You halve the damping γ of a resonant system. The peak amplitude…', choices: ['doubles, and the peak gets half as wide', 'halves', 'stays the same but the peak narrows', 'doubles, and the peak gets twice as wide'], a: 0, why: 'x_res = F₀/(mγω₀) doubles; the width of the peak is γ.' },
    { q: 'Driven far above its natural frequency, a mass on a spring moves…', choices: ['a little, opposite to the force', 'a lot, with the force', 'not at all', 'a little, with the force'], a: 0, why: 'Inertia dominates: x̂ ≈ −F₀/(mω²), small and 180° out of phase.' },
    { q: 'An oscillator of natural frequency 50 Hz has a resonance 0.5 Hz wide. What is its Q?', answer: 100, why: 'Q = f₀/Δf = 50/0.5 = 100.' }
  ],
  problems: [
    { q: 'A 0.2 kg mass on a spring has ω₀ = 20 rad/s and γ = 0.5 s⁻¹. Driven at resonance by a force of amplitude 0.5 N, how far does it swing?', answer: 0.25, unit: 'm', tol: 0.02, hint: 'x_res = F₀/(mγω₀).',
      steps: ['$x_{\\text{res}} = 0.5/(0.2 \\times 0.5 \\times 20) = 0.25$ m.', 'The static stretch would be $F_0/k = 0.5/(0.2 \\times 400) = 6.25$ mm; $Q = 40$ times more.'] },
    { q: 'A tuning fork of 440 Hz has a resonance only 0.2 Hz wide. What is its Q?', answer: 2200, tol: 0.02, hint: 'Q = f₀/Δf.',
      steps: ['$Q = 440/0.2 = 2200$.'] }
  ],
  applications: [
    'Radios, mobile phones and Wi-Fi select one channel with resonant circuits and filters.',
    'Engineers keep the natural frequencies of bridges, turbine blades and engine mounts away from the rhythms that drive them — London\'s Millennium Bridge swayed in 2000 until dampers were added.',
    'Spectroscopy, from infrared to NMR, finds atoms and molecules by the frequencies at which they resonate.',
    'Particle physicists discover short-lived particles as resonance peaks; the width of a peak gives the lifetime.'
  ],
  history: 'Galileo described how small, well-timed pushes build up a large swing of a heavy pendulum (1638). The complex-number method for alternating currents was developed in the 1890s by Charles Proteus Steinmetz and Arthur Kennelly, and it is the method Feynman used for every oscillator.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 23 (Resonance) — complex numbers and harmonic motion, the forced oscillator with damping, electrical resonance, resonance in nature.',
    'Vol. I, ch. 21 (The Harmonic Oscillator) — forced oscillations without damping.',
    'Vol. II, ch. 23 (Cavity Resonators) — resonance in electromagnetic cavities.'
  ],
  sim: 'osc-resonance'
},

{
  id: 'transients-feyn', parent: 'oscillators', title: 'Transients: how oscillations start and die', level: 2,
  short: 'A damped oscillator left alone rings down: its rotating arrow shrinks into a spiral and its energy falls as e^{−γt}. Switch a drive on and the motion is the steady forced motion plus a free, dying oscillation that starts equal and opposite — so it beats before it settles.',
  keywords: ['transient', 'damped oscillation', 'ring-down', 'decay', 'Q factor', 'critical damping', 'overdamped', 'underdamped', 'energy loss', 'switching on', 'beats', 'RLC circuit'],
  prereq: ['resonance-feyn', 'physics:damped-oscillations', 'math:damped-oscillator-ode'],
  related: ['linear-systems', 'beats-feyn', 'ac-circuits-feyn', 'harmonic-oscillator-feyn', 'math:exponential-growth-decay'],
  body: `
Resonance tells what an oscillator does *after a long time*. Feynman's next lecture is about the beginning and the end: how an oscillation starts when a force is switched on, and how it dies when it is left alone. These **transients** are just as important — the ring of a bell, the click of a loudspeaker, the ringing of a circuit after a switch is thrown.

### Left alone: a shrinking arrow
Without a drive the equation is $\\ddot x + \\gamma\\dot x + \\omega_0^2 x = 0$. Try $x = e^{i\\alpha t}$ with a [[?complex-number|complex]] $\\alpha$: the [[?differential-equation]] turns into $-\\alpha^2 + i\\gamma\\alpha + \\omega_0^2 = 0$, so $\\alpha = i\\gamma/2 \\pm \\omega_d$ with

$$\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2/4}, \\qquad x = A\\,e^{-\\gamma t/2}\\cos(\\omega_d t + \\phi)$$

The imaginary part of $\\alpha$ became a real [[?exponential]] decay. The [[?rotating-arrow|rotating arrow]] now shrinks as it turns — it draws a spiral — and its shadow is a cosine inside a fading envelope. The frequency is a little lower than $\\omega_0$; for light damping the difference is negligible.

### Energy and Q
The energy goes as the square of the amplitude, so it falls as $E = E_0 e^{-\\gamma t}$. Each radian of oscillation loses about $1/Q$ of the energy ($Q = \\omega_0/\\gamma$), each cycle $2\\pi/Q$; the amplitude falls to $1/e$ in $Q/\\pi$ cycles.

| Oscillator | Q (roughly) | Cycles until the amplitude falls to 37 % |
|---|---|---|
| Car body on its shock absorbers | 1–2 | less than one |
| Tuning fork | 1000 | about 300 |
| Pendulum clock | 10 000 | about 3000 |
| Quartz watch crystal | 10⁴–10⁶ | thousands to hundreds of thousands |
| Sodium atom emitting yellow light | 5 × 10⁷ | about 16 million |

### Three kinds of dying
If $\\gamma < 2\\omega_0$ the motion rings down (underdamped). At $\\gamma = 2\\omega_0$ — **critical damping** — it returns to rest fastest without overshooting, which is what car suspensions and meter needles aim near. With more damping it creeps back slowly (overdamped): the two values of $\\alpha$ are both imaginary, pure decays.

### Switching on a force
Now drive the oscillator at $\\omega$, starting from rest. The equation is linear, so the full answer is **the steady forced motion plus any free motion**: $x = \\mathrm{Re}(\\hat x e^{i\\omega t}) + A e^{-\\gamma t/2}\\cos(\\omega_d t + \\phi)$. The free part is chosen to make $x = 0$ and $\\dot x = 0$ at the start: it begins as the mirror image of the forced motion, cancelling it. Then it fades. Two things follow:

- the amplitude builds up over a time of order $2/\\gamma$ — the higher the $Q$, the longer it takes to reach the steady state;
- while both parts are alive, they have slightly different frequencies ($\\omega$ and $\\omega_d$), so they drift in and out of step — the amplitude **beats** before it settles (see [[beats-feyn]]).

**The simulation draws this as two arrows added head to tail**: the forced arrow of fixed length turning at $\\omega$, and the free arrow turning at $\\omega_d$ and shrinking. Their sum's shadow is the motion; watch the free arrow die and leave the forced one alone.

> [!key] Free motion of a damped oscillator is a spiralling arrow: $x = Ae^{-\\gamma t/2}\\cos(\\omega_d t + \\phi)$, energy falling as $e^{-\\gamma t}$. A switched-on drive gives forced motion plus a free motion that starts by cancelling it and then fades.

The same story, with $L$, $R$ and $C$ in place of $m$, $m\\gamma$ and $1/k$, describes an electrical circuit ringing after a switch closes ([[linear-systems]]).
`,
  ideas: [
    'Undriven, a damped oscillator moves as x = A e^{−γt/2} cos(ω_d t + φ): a rotating arrow that shrinks into a spiral.',
    'The energy falls as e^{−γt}; the fraction lost per radian is 1/Q, and the amplitude falls to 1/e in Q/π cycles.',
    'Critical damping, γ = 2ω₀, returns the system to rest fastest without overshoot.',
    'A switched-on drive gives the steady forced motion plus a free motion that starts equal and opposite and then decays.',
    'During the transient the free and forced parts beat against each other; the build-up takes a time of order 2/γ.'
  ],
  pitfalls: [
    'A driven oscillator immediately moves with its final, steady amplitude — It starts from rest; the free motion first cancels the forced one and only fades away over a time of order 2/γ.',
    'Damping changes the frequency a lot — For light damping ω_d = √(ω₀² − γ²/4) differs from ω₀ by only about γ²/8ω₀; even at Q = 5 the shift is half a per cent.',
    'More damping always makes a system settle faster — Beyond critical damping it creeps back more slowly: the slow decay rate falls as the damping grows.'
  ],
  formulas: [
    {
      name: 'Energy of a free, damped oscillation',
      expr: 'E = E0*exp(-gamma*t)', tex: 'E = E_0\\,e^{-\\gamma t}',
      vars: {
        E: { name: 'energy left', q: 'energy', unit: 'J' },
        E0: { name: 'starting energy', q: 'energy', unit: 'J', value: 1, tex: 'E_0' },
        gamma: { name: 'damping rate', q: 'rate', unit: '1/s', value: 0.5, tex: '\\gamma' },
        t: { name: 'time', q: 'time', unit: 's', value: 2 }
      },
      note: 'The amplitude falls half as fast, as e^{−γt/2}.',
      stories: {
        E: 'A plucked string with damping rate {gamma} starts with {E0}. How much energy is left after {t}?',
        t: 'An oscillator with damping {gamma} starts with {E0}. When has it only {E} left?'
      }
    },
    {
      name: 'Frequency of the damped free oscillation',
      expr: 'wd = sqrt(w0^2 - gamma^2/4)', tex: '\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2/4}',
      vars: {
        wd: { name: 'damped angular frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega_d' },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 10, tex: '\\omega_0' },
        gamma: { name: 'damping rate', q: 'rate', unit: '1/s', value: 2, tex: '\\gamma' }
      },
      note: 'Only for γ < 2ω₀ (underdamped); at γ = 2ω₀ the motion is critically damped.',
      stories: { wd: 'An oscillator with natural frequency {w0} has damping rate {gamma}. At what frequency does it ring?' }
    },
    {
      name: 'How many cycles it rings',
      expr: 'N = Q/pi', tex: 'N = \\dfrac{Q}{\\pi}',
      vars: {
        N: { name: 'cycles for the amplitude to fall to 1/e' },
        Q: { name: 'quality factor', value: 1000 }
      },
      note: 'For light damping. The energy falls to 1/e in half as many cycles.',
      stories: { Q: 'A tuning fork rings for {N} cycles before its amplitude falls to 37 %. What is its Q?' }
    }
  ],
  derivation: {
    title: 'The free damped motion from a complex guess',
    steps: [
      { text: 'Divide the undriven equation by m, with γ = friction/m and ω₀² = k/m:', tex: '\\ddot x + \\gamma\\dot x + \\omega_0^2 x = 0' },
      { text: 'Try x = e^{iαt} with α allowed to be complex. Each derivative multiplies by iα, and cancelling e^{iαt} leaves a quadratic for α:', tex: '-\\alpha^2 + i\\gamma\\alpha + \\omega_0^2 = 0' },
      { text: 'Solve the quadratic. The imaginary part of α will become a decay, the real part an oscillation:', tex: '\\alpha = \\frac{i\\gamma}{2} \\pm \\sqrt{\\omega_0^2 - \\frac{\\gamma^2}{4}} = \\frac{i\\gamma}{2} \\pm \\omega_d' },
      { text: 'Put it back: e^{iαt} = e^{−γt/2} e^{±iω_d t}. Taking real parts of a combination of the two gives the general free motion:', tex: 'x = A\\,e^{-\\gamma t/2}\\cos(\\omega_d t + \\phi)' },
      { text: 'The energy goes as the amplitude squared, so it decays as e^{−γt}. When γ > 2ω₀ the square root is imaginary, both α are purely imaginary, and the motion is a sum of two plain decays (overdamped).' }
    ]
  },
  examples: [
    {
      title: 'How long a tuning fork sings',
      q: 'A 440 Hz tuning fork has $Q = 1000$. How long until its amplitude falls to 1/1000 (60 dB quieter)?',
      steps: [
        '$\\omega_0 = 2\\pi \\times 440 = 2765$ rad/s, so $\\gamma = \\omega_0/Q = 2.76$ s⁻¹.',
        'The amplitude goes as $e^{-\\gamma t/2}$; it falls by 1000 when $\\gamma t/2 = \\ln 1000 = 6.91$.',
        '$t = 2 \\times 6.91/2.76 = 5.0$ s.'
      ],
      a: 'About 5 seconds — some 2200 cycles.'
    },
    {
      title: 'Building up at resonance',
      q: 'An oscillator with $\\gamma = 0.2$ s⁻¹ is driven exactly at resonance from rest. How long until the amplitude reaches 63 % of its final value?',
      steps: [
        'At resonance the free part has (almost) the same frequency as the forced part and the opposite phase, so the amplitude grows as $x_{\\text{res}}(1 - e^{-\\gamma t/2})$.',
        '63 % means $e^{-\\gamma t/2} = 1/e$: $t = 2/\\gamma = 10$ s.'
      ],
      a: '10 s — the sharper the resonance, the longer it takes to build up.'
    }
  ],
  quiz: [
    { q: 'An oscillator has Q = 100. Roughly what fraction of its energy does it lose in one cycle?', choices: ['6 %', '1 %', '0.01 %', '37 %'], a: 0, why: 'The loss per cycle is 2π/Q = 0.063.' },
    { q: 'Which damping returns a displaced system to rest fastest without overshooting?', choices: ['critical damping (γ = 2ω₀)', 'very light damping', 'very heavy damping', 'no damping'], a: 0, why: 'Less damping overshoots and rings; more damping creeps back slowly.' },
    { q: 'When a drive is switched on near resonance, a lightly damped oscillator\'s amplitude may rise and fall a few times before settling.', a: true, why: 'The free part (at ω_d) and the forced part (at ω) beat against each other until the free part dies.' },
    { q: 'With damping, a free oscillator rings at a frequency slightly…', choices: ['lower than ω₀', 'higher than ω₀', 'equal to ω₀ exactly', 'equal to the drive frequency'], a: 0, why: 'ω_d = √(ω₀² − γ²/4) < ω₀.' },
    { q: 'An oscillator\'s energy decays with γ = 0.5 s⁻¹. How many seconds for the energy to halve?', answer: 1.386, unit: 's', why: 'e^{−0.5t} = ½ gives t = ln 2/0.5 = 1.39 s.' }
  ],
  problems: [
    { q: 'A pendulum\'s amplitude halves in 100 swings (100 full periods). What is its Q?', answer: 453, tol: 0.02, hint: 'The amplitude falls as e^{−γt/2}; in N periods t = 2πN/ω₀.',
      steps: ['$e^{-\\gamma t/2} = \\tfrac12$ with $t = 2\\pi N/\\omega_0$ gives $\\gamma = \\omega_0 \\ln 2/(\\pi N)$.', '$Q = \\omega_0/\\gamma = \\pi N/\\ln 2 = \\pi \\times 100/0.693 = 453$.'] },
    { q: 'A 2 kg mass on an 800 N/m spring is to be critically damped. What friction coefficient b (force per unit speed) is needed?', answer: 80, unit: 'N·s/m', tol: 0.02, hint: 'γ = b/m must equal 2ω₀.',
      steps: ['$\\omega_0 = \\sqrt{800/2} = 20$ rad/s.', 'Critical: $\\gamma = 2\\omega_0 = 40$ s⁻¹, so $b = m\\gamma = 80$ N·s/m.'] }
  ],
  applications: [
    'Car suspensions, door closers and measuring instruments are damped near the critical value so that they settle quickly without bouncing.',
    'The decay time of a bell, a string or a room (its reverberation time) is a transient — concert halls are designed around it.',
    'Atomic clocks and lasers rely on oscillators with enormous Q, which ring for millions of cycles.',
    'Electrical engineers suppress ringing after switching (snubbers, damping resistors) so circuits settle cleanly.'
  ],
  history: 'William Thomson (Lord Kelvin) showed in 1853 that the discharge of a Leyden jar through a coil can be oscillatory, and Berend Feddersen photographed the oscillating spark in 1857–62, confirming it. The same damped-oscillation mathematics later underlay the first radio transmitters.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 24 (Transients) — the energy of an oscillator, damped oscillations, electrical transients.',
    'Vol. I, ch. 23 (Resonance) — the quality factor Q and its meaning.',
    'Vol. I, ch. 25 (Linear Systems and Review) — adding the free and forced solutions.'
  ],
  sim: 'osc-transient'
},

{
  id: 'linear-systems', parent: 'oscillators', title: 'Linear systems and superposition', level: 2,
  short: 'In a linear system, doubling the cause doubles the effect, and two causes together produce the sum of their separate effects. That single property lets us split any force into simple pieces, solve each with rotating arrows, and add — and it is why a spring, a circuit and a column of air obey the same mathematics.',
  keywords: ['linear system', 'superposition', 'linear differential equation', 'analogue', 'RLC circuit', 'impedance', 'electrical–mechanical analogy', 'Helmholtz resonator', 'nonlinear', 'distortion', 'impulse response', 'same equations same solutions'],
  prereq: ['transients-feyn', 'math:second-order-linear', 'physics:superposition'],
  related: ['electrostatic-analogs', 'ac-circuits-feyn', 'modes-feyn', 'harmonics-feyn', 'probability-amplitudes', 'physics:lc-resonance', 'math:linear-transformations'],
  body: `
Feynman ended his run of lectures on oscillators with a review built around one property of their equations: they are **linear**. It is the reason the complex-number method works so well, and once you see it, a great deal of physics falls into place.

### What linear means
Write the oscillator's equation as "something done to $x$ equals the force":

$$m\\ddot x + m\\gamma\\dot x + kx = F(t)$$

The unknown $x$ and its [[?derivative|derivatives]] appear only to the first power — no $x^2$, no $x\\dot x$, no $\\sin x$. Such a [[?differential-equation]] is linear, and it has a superb property: if $x_1(t)$ is the response to $F_1(t)$ and $x_2(t)$ the response to $F_2(t)$, then $x_1 + x_2$ is the response to $F_1 + F_2$, and $a x_1$ the response to $a F_1$. Just add the two equations. This is the **principle of superposition**.

### Divide and conquer
Superposition turns hard problems into easy ones:

- **Any force made of sines.** Split it into its frequencies (a [[?fourier|Fourier series]], see [[harmonics-feyn]]); for each, the response is a rotating arrow with its own amplitude and lag, from [[resonance-feyn]]; add them up. A force $\\cos 5t + \\cos 15t$ newtons on a 1 kg, 100 N/m oscillator with $\\gamma = 1$ s⁻¹ gives 13.3 mm at 5 rad/s (lag 4°) plus 7.9 mm at 15 rad/s (lag 173°).
- **Complex numbers themselves.** Taking the real part commutes with a linear equation, so we may solve with $e^{i\\omega t}$ and take the real part at the end — the whole trick of the previous pages rests on linearity.
- **Free plus forced.** A solution of the undriven equation can always be added to a driven one; that is exactly how [[transients-feyn]] were built.
- **Kicks.** Any force is a string of short kicks; each kick starts a free, dying oscillation; the response to the whole force is the [[?sum]] of them all.

**In the simulation** three identical oscillators run side by side: one pushed by force A, one by force B, and one by A + B. The graph compares the third motion with the sum of the first two — they coincide exactly. Then make the spring stiffen with stretch (a force $k x + k_3 x^3$) and watch superposition fail.

### Same equations, same solutions
Because only the form of the equation matters, completely different systems behave identically:

| | Mass on a spring | Series electric circuit | Air in a bottle (Helmholtz) |
|---|---|---|---|
| what moves | position $x$ | charge $q$ | air plug in the neck |
| inertia | mass $m$ | inductance $L$ | mass of air in the neck $\\rho A l$ |
| friction | $m\\gamma$ | resistance $R$ | viscous and radiation losses |
| stiffness | $k$ | $1/C$ | $\\rho c^2 A^2/V$ |
| drive | force $F$ | voltage $V$ | pressure outside × $A$ |
| natural frequency | $\\sqrt{k/m}$ | $1/\\sqrt{LC}$ | $\\frac{c}{2\\pi}\\sqrt{A/Vl}$ (in Hz) |

A 10 mH coil with a 100 nF capacitor rings at 5.0 kHz; with 10 Ω of resistance its $Q$ is 32. Blow across a 0.75 L wine bottle and the air in its neck bounces on the "spring" of the air inside at about 120 Hz. Before digital computers, engineers exploited this, building electrical **analogue computers** whose circuits obeyed the equations of mechanical systems.

### When linearity fails
Linearity is usually an approximation for small motions: a pendulum's $\\sin\\theta$ is only $\\theta$ for small swings, springs stop obeying Hooke's law, loudspeakers distort when overdriven. A nonlinear system mixes frequencies — driven at $f_1$ and $f_2$ it also responds at $2f_1$, $f_1 + f_2$, $f_1 - f_2$ — and two causes no longer add. But some laws appear to be exactly linear: Maxwell's equations in empty space (light beams cross without disturbing each other) and the quantum rule that amplitudes add ([[probability-amplitudes]]).

> [!key] Linear equations obey superposition: the response to a sum of causes is the sum of the responses. That is why forces can be split into sines, solved with $e^{i\\omega t}$ and added — and why the same equation describes springs, circuits and air.
`,
  ideas: [
    'An equation is linear when the unknown and its derivatives appear only to the first power.',
    'Superposition: the response to F₁ + F₂ is x₁ + x₂, and the response to aF is ax.',
    'So a complicated force can be split into sines, each solved with a rotating arrow, and the results added.',
    'Systems obeying the same linear equation behave identically: mass–spring, LC circuit (L ↔ m, R ↔ mγ, 1/C ↔ k), a Helmholtz resonator.',
    'Nonlinear systems break superposition and mix frequencies (harmonics, sum and difference tones).'
  ],
  pitfalls: [
    'Superposition means the effects of two causes add for any system — Only for linear systems; for a stiffening spring or an overdriven amplifier the response to both together differs from the sum.',
    'Linear means the graph of the motion is a straight line — "Linear" describes the equation, not the motion: a linear equation has sine-wave solutions.',
    'Analogies between circuits and springs are loose pictures — They are exact: the equations are identical, so every solution for one is a solution for the other, number for number.'
  ],
  formulas: [
    {
      name: 'Natural frequency of a coil and capacitor',
      expr: 'f0 = 1/(2*pi*sqrt(L*C))', tex: 'f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}',
      vars: {
        f0: { name: 'resonant frequency', q: 'frequency', unit: 'kHz', tex: 'f_0' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 }
      },
      note: 'The electrical twin of ω₀ = √(k/m): L plays the mass, 1/C the spring constant.',
      stories: {
        f0: 'A {L} coil is connected to a {C} capacitor. At what frequency does the circuit ring?',
        C: 'What capacitance tunes a {L} coil to {f0}?'
      }
    },
    {
      name: 'Q of a series RLC circuit',
      expr: 'Q = sqrt(L/C)/R', tex: 'Q = \\dfrac{1}{R}\\sqrt{\\dfrac{L}{C}}',
      vars: {
        Q: { name: 'quality factor' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF', value: 100 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 10 }
      },
      note: 'The twin of Q = ω₀/γ with γ = R/L.',
      stories: { R: 'A circuit of {L} and {C} is to have a quality factor of {Q}. What series resistance does that allow?' }
    },
    {
      name: 'Damping rate of a series RLC circuit',
      expr: 'gamma = R/L', tex: '\\gamma = \\dfrac{R}{L}',
      vars: {
        gamma: { name: 'damping rate (energy decays as e^{−γt})', q: 'rate', unit: '1/s', tex: '\\gamma' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 10 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 }
      },
      note: 'R plays the part of the friction coefficient mγ, and L of the mass m.',
      stories: { gamma: 'How fast does the energy of a ringing circuit with {R} and {L} decay?' }
    },
    {
      name: 'Air in a bottle: the Helmholtz resonator',
      expr: 'f = c/(2*pi)*sqrt(A/(V*l))', tex: 'f = \\dfrac{c}{2\\pi}\\sqrt{\\dfrac{A}{Vl}}',
      vars: {
        f: { name: 'resonant frequency', q: 'frequency', unit: 'Hz' },
        c: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343 },
        A: { name: 'cross-section of the neck', q: 'area', unit: 'cm²', value: 2.835 },
        V: { name: 'volume of the bottle', q: 'volume', unit: 'L', value: 0.75 },
        l: { name: 'length of the neck', q: 'length', unit: 'cm', value: 8 }
      },
      note: 'The air in the neck is the mass, the air in the bottle the spring. Real necks behave as if slightly longer (end corrections), so real bottles sing a little lower.',
      stories: { f: 'You blow across a bottle of {V} whose neck is {l} long with cross-section {A}. What note does it sound?' }
    }
  ],
  derivation: {
    title: 'Why the responses add',
    steps: [
      { text: 'Suppose x₁ is a motion produced by force F₁ and x₂ one produced by F₂:', tex: 'm\\ddot x_1 + m\\gamma\\dot x_1 + kx_1 = F_1, \\qquad m\\ddot x_2 + m\\gamma\\dot x_2 + kx_2 = F_2' },
      { text: 'Add the two equations. The derivative of a sum is the sum of the derivatives, so every term regroups:', tex: 'm(\\ddot x_1 + \\ddot x_2) + m\\gamma(\\dot x_1 + \\dot x_2) + k(x_1 + x_2) = F_1 + F_2' },
      { text: 'So x₁ + x₂ is a motion produced by F₁ + F₂. Multiplying one equation by a number a shows likewise that aF gives ax.' },
      { text: 'Try the same with a stiffening spring, force kx + k₃x³. Adding the equations leaves k₃(x₁³ + x₂³), which is not k₃(x₁ + x₂)³: the cross terms 3x₁²x₂ + 3x₁x₂² are missing, so superposition fails.', tex: '(x_1 + x_2)^3 = x_1^3 + x_2^3 + 3x_1^2x_2 + 3x_1x_2^2' }
    ]
  },
  examples: [
    {
      title: 'Two forces at once',
      q: 'A 1 kg mass on a 100 N/m spring with $\\gamma = 1$ s⁻¹ is pushed by $F = \\cos 5t + \\cos 15t$ (newtons). Find its steady motion.',
      steps: [
        'At $\\omega = 5$: $\\omega_0^2 - \\omega^2 = 75$, $\\gamma\\omega = 5$: amplitude $1/\\sqrt{75^2 + 5^2} = 13.3$ mm, lag $\\arctan(5/75) = 3.8°$.',
        'At $\\omega = 15$: $\\omega_0^2 - \\omega^2 = -125$, $\\gamma\\omega = 15$: amplitude $1/\\sqrt{125^2 + 15^2} = 7.9$ mm, lag $180° - 6.8° = 173.2°$.',
        'By superposition the motion is the sum: $x = 13.3\\cos(5t - 3.8°) + 7.9\\cos(15t - 173.2°)$ mm.'
      ],
      a: 'x = 13.3 cos(5t − 3.8°) + 7.9 cos(15t − 173.2°) mm.'
    },
    {
      title: 'A circuit that behaves like a spring',
      q: 'A series circuit has $L = 10$ mH, $C = 100$ nF, $R = 10$ Ω. Find its natural frequency, damping rate and Q, and the mechanical twin with $m = 1$ kg.',
      steps: [
        '$f_0 = 1/(2\\pi\\sqrt{LC}) = 1/(2\\pi\\sqrt{10^{-9}}) = 5.03$ kHz; $\\omega_0 = 31\\,600$ rad/s.',
        '$\\gamma = R/L = 1000$ s⁻¹ and $Q = \\omega_0/\\gamma = 31.6$ (the same as $\\sqrt{L/C}/R$).',
        'A 1 kg mass with the same ω₀ needs $k = m\\omega_0^2 = 10^9$ N/m and friction coefficient $m\\gamma = 1000$ N·s/m.'
      ],
      a: '5.03 kHz, γ = 1000 s⁻¹, Q ≈ 32.'
    }
  ],
  quiz: [
    { q: 'Which of these equations is linear in x?', choices: ['m ẍ + kx = F cos ωt', 'm ẍ + kx³ = 0', 'ẍ + (g/L) sin x = 0', 'ẍ · x = 1'], a: 0, why: 'Only the first has x and its derivatives to the first power; x³, sin x and ẍ·x are nonlinear.' },
    { q: 'In a linear system, doubling the driving force doubles the response.', a: true, why: 'If x solves the equation for F, then 2x solves it for 2F.' },
    { q: 'In the analogy between a series RLC circuit and a mass on a spring, the inductance plays the part of…', choices: ['the mass', 'the spring constant', 'the friction', 'the displacement'], a: 0, why: 'L multiplies the second derivative (dI/dt) just as m multiplies the acceleration.' },
    { q: 'A nonlinear spring is driven at 100 Hz and 150 Hz together. Which frequency can appear in its motion that a linear spring could not produce?', choices: ['50 Hz', '100 Hz', '150 Hz', 'none'], a: 0, why: 'Nonlinearity mixes frequencies: differences (50 Hz), sums (250 Hz) and harmonics (200, 300 Hz) appear.' },
    { q: 'The real part of a solution with e^{iωt} is itself a solution because…', choices: ['the equation is linear with real coefficients', 'complex numbers are imaginary', 'the damping is small', 'ω is real'], a: 0, why: 'The solution is a sum of its real part and i times its imaginary part; with real coefficients, each part must solve the equation separately.' }
  ],
  problems: [
    { q: 'A 2 mH coil and a 50 nF capacitor are connected in series. At what frequency do they resonate?', answer: 15.9, unit: 'kHz', tol: 0.02, hint: 'f₀ = 1/(2π√(LC)).',
      steps: ['$LC = 2\\times10^{-3} \\times 50\\times10^{-9} = 10^{-10}$ s², $\\sqrt{LC} = 10^{-5}$ s.', '$f_0 = 1/(2\\pi\\times10^{-5}) = 15.9$ kHz.'] },
    { q: 'What series resistance gives Q = 50 for L = 10 mH and C = 100 nF?', answer: 6.32, unit: 'Ω', tol: 0.02, hint: 'Q = √(L/C)/R.',
      steps: ['$\\sqrt{L/C} = \\sqrt{10^{-2}/10^{-7}} = 316$ Ω.', '$R = 316/50 = 6.32$ Ω.'] }
  ],
  applications: [
    'Audio and radio engineers analyse circuits one frequency at a time and add the results; distortion measurements look for the frequencies that nonlinearity creates.',
    'Structural engineers compute how buildings respond to earthquakes by adding up the responses of their modes.',
    'Car exhaust silencers and bass-reflex loudspeaker boxes are Helmholtz resonators.',
    'Mixers in radios deliberately use a nonlinear element to produce sum and difference frequencies.'
  ],
  history: 'Daniel Bernoulli argued in 1753 that a vibrating string moves as a sum of simple modes, and Joseph Fourier (1807, published 1822) showed how any shape can be split into sines. Hermann von Helmholtz analysed the bottle resonator in the 1860s and used a set of them to pick out the harmonics of sounds. In the mid-twentieth century electrical analogue computers solved mechanical problems by building circuits that obeyed the same equations.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 25 (Linear Systems and Review) — linear differential equations, superposition of solutions, oscillations in linear systems, analogues in physics.',
    'Vol. II, ch. 12 (Electrostatic Analogs) — the same equations have the same solutions.',
    'Vol. II, ch. 22 (AC Circuits) — impedances, and circuits as linear systems.'
  ],
  sim: 'osc-superpose'
},

/* ================================================================ WAVES AND SOUND */
{
  id: 'wave-equation-sound', parent: 'waves-sound', title: 'Sound and the wave equation', level: 2,
  short: 'Three facts about air — it is pushed by pressure differences, it gets denser when squeezed, and its pressure rises with density — combine into the wave equation. Its solutions are shapes that travel unchanged at c = √(γp/ρ), 343 m/s in air at 20 °C; a string obeys the same equation with v = √(F/μ).',
  keywords: ['sound', 'wave equation', 'speed of sound', 'adiabatic', 'Newton', 'Laplace', 'pressure wave', 'longitudinal wave', 'string', 'tension', 'reflection', 'pulse', 'd\'Alembert'],
  prereq: ['linear-systems', 'kinetic-theory-feyn', 'math:wave-equation', 'physics:waves-on-strings'],
  related: ['beats-feyn', 'modes-feyn', 'waves-feyn', 'em-waves-feyn', 'physics:speed-of-sound', 'physics:sound-waves', 'physics:transverse-longitudinal', 'math:pdes'],
  body: `
Sound is the air being jostled: layers of air pushed a tiny distance, crowding their neighbours, which push the next ones. Feynman derived the law of this motion from scratch in one lecture, from three pieces of physics every reader already knows — and the result, the **wave equation**, turns out to describe strings, light and much more.

### How small sound is
Ordinary speech has a pressure swing of about 0.02 Pa riding on the atmosphere's 101 325 Pa — two parts in ten million. At 1 kHz the air moves back and forth by about 8 nanometres; at the threshold of hearing (20 µPa), by less than the size of an atom. Such small disturbances are why sound obeys a [[linear-systems|linear]] equation so well.

### Three facts, one equation
Let $\\chi(x, t)$ be how far the air that normally sits at $x$ has been displaced.

1. **Squeezing changes the density.** A slab from $x$ to $x + \\Delta x$ now fills $\\Delta x + \\Delta\\chi$, so its density is $\\rho \\approx \\rho_0(1 - \\partial\\chi/\\partial x)$. The [[?partial-derivative]] is the rate of change along $x$ at one instant.
2. **Density sets the pressure.** A small change of density changes the pressure by $(dp/d\\rho)$ times it: $p \\approx p_0 - \\rho_0\\,c^2\\,\\partial\\chi/\\partial x$, where we have called $dp/d\\rho = c^2$.
3. **Pressure differences push.** Newton's law for the slab: mass times acceleration equals the pressure on its left minus that on its right, $\\rho_0\\,\\Delta x\\,\\partial^2\\chi/\\partial t^2 = -(\\partial p/\\partial x)\\,\\Delta x$.

Put 2 into 3:

$$\\frac{\\partial^2\\chi}{\\partial t^2} = c^2\\,\\frac{\\partial^2\\chi}{\\partial x^2}$$

This is the [[?wave-equation]]: the acceleration of each bit of air is proportional to how sharply the displacement curves there (its [[?second-derivative]] in space).

### Any shape, travelling
Any [[?function]] of $x - ct$ solves it, and so does any function of $x + ct$: a shape moving right or left at speed $c$ **without changing**. The general solution is the sum of one of each. Because the equation is linear, two pulses running into each other simply add, pass through, and emerge unchanged — try it in the simulation. At a fixed end a pulse comes back upside down; at a free end, right way up.

### The speed of sound
Newton first calculated the speed of sound assuming the air keeps its temperature, $c^2 = p/\\rho$ — which gives 290 m/s, some 15 % too low. The compressions are too quick for heat to flow in or out; with the adiabatic law $p \\propto \\rho^\\gamma$ (Laplace, 1816), $c^2 = \\gamma p/\\rho = \\gamma RT/M$:

| Medium | Speed of sound |
|---|---|
| Air, 0 °C | 331 m/s |
| Air, 20 °C | 343 m/s |
| Helium, 20 °C | 1008 m/s |
| Water, 20 °C | 1482 m/s |
| Steel (long bar) | about 5100 m/s |

The speed depends on temperature, not pressure: squeezing air raises $p$ and $\\rho$ together. It is of the order of the speed of the molecules themselves ([[kinetic-theory-feyn]]) — they are what carries the news.

### A string
A stretched string obeys the same equation for its sideways displacement: the tension $F$ pulls a curved piece towards straightness, and the mass per length $\\mu$ resists. The speed is $v = \\sqrt{F/\\mu}$: a guitar string of 0.4 g/m at 73 N carries waves at 427 m/s.

> [!key] $\\partial^2\\chi/\\partial t^2 = c^2\\,\\partial^2\\chi/\\partial x^2$: acceleration proportional to curvature. Its solutions are shapes moving at $c$ without change, and they pass through each other. For sound $c = \\sqrt{\\gamma p/\\rho}$; for a string $v = \\sqrt{F/\\mu}$.
`,
  ideas: [
    'Sound is a travelling pattern of tiny displacements and pressure changes — parts in ten million for speech.',
    'Continuity (density), the gas law (pressure) and Newton\'s law combine into ∂²χ/∂t² = c² ∂²χ/∂x².',
    'Any shape f(x − ct) or g(x + ct) solves the wave equation: waves travel without changing shape, and pass through each other.',
    'For a gas c² = γp/ρ = γRT/M (adiabatic): 343 m/s in air at 20 °C, rising with temperature, independent of pressure.',
    'A string obeys the same equation with v = √(F/μ); reflection inverts a pulse at a fixed end, not at a free one.'
  ],
  pitfalls: [
    'In a sound wave the air travels from the source to the listener — Each bit of air only shuffles back and forth by nanometres to micrometres; it is the pattern that travels.',
    'Sound goes faster at high pressure — At fixed temperature p/ρ is constant, so the speed is the same; it rises with temperature instead.',
    'When two pulses cancel as they meet, they are destroyed — At that instant the string is flat but moving; the velocities carry the pulses on, and they reappear unchanged.'
  ],
  formulas: [
    {
      name: 'Speed of sound in a gas',
      expr: 'c = sqrt(gam*p/rho)', tex: 'c = \\sqrt{\\dfrac{\\gamma p}{\\rho}}',
      vars: {
        c: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        gam: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, tex: '\\gamma' },
        p: { name: 'pressure', q: 'pressure', unit: 'kPa', value: 101.325 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.204, tex: '\\rho' }
      },
      note: 'Adiabatic compression. Newton\'s isothermal version, √(p/ρ), is about 15 % low for air.',
      stories: { c: 'Air at {p} has density {rho}. With γ = {gam}, how fast does sound travel?' }
    },
    {
      name: 'Speed of sound from the temperature',
      expr: 'c = sqrt(gam*R*T/M)', tex: 'c = \\sqrt{\\dfrac{\\gamma RT}{M}}',
      vars: {
        c: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        gam: { name: 'ratio of specific heats γ', value: 1.4, tex: '\\gamma' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 },
        M: { name: 'molar mass of the gas', q: 'molarmass', unit: 'g/mol', value: 28.97 }
      },
      note: 'For an ideal gas p/ρ = RT/M; γ = 1.4 for air, 5/3 for helium.',
      stories: {
        c: 'How fast does sound travel in a gas of molar mass {M} with γ = {gam} at {T}?',
        T: 'At what temperature does sound travel at {c} in air ({M}, γ = {gam})?'
      }
    },
    {
      name: 'Speed of waves on a string',
      expr: 'v = sqrt(F/mu)', tex: 'v = \\sqrt{\\dfrac{F}{\\mu}}',
      vars: {
        v: { name: 'wave speed', q: 'speed', unit: 'm/s' },
        F: { name: 'tension', q: 'force', unit: 'N', value: 73 },
        mu: { name: 'mass per unit length', q: 'lindensity', unit: 'g/m', value: 0.4, tex: '\\mu' }
      },
      note: 'For small sideways displacements of a perfectly flexible string.',
      stories: {
        v: 'A string of {mu} is stretched with {F}. How fast do waves run along it?',
        F: 'What tension makes waves travel at {v} on a string of {mu}?'
      }
    },
    {
      name: 'Wavelength, frequency and speed',
      expr: 'lambda = v/f', tex: '\\lambda = \\dfrac{v}{f}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'm', tex: '\\lambda' },
        v: { name: 'wave speed', q: 'speed', unit: 'm/s', value: 343 },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 440 }
      },
      note: 'For a steady wave: in one period the wave moves one wavelength.',
      stories: { lambda: 'What is the wavelength in air ({v}) of the note A at {f}?' }
    }
  ],
  derivation: {
    title: 'The wave equation for sound',
    steps: [
      { text: 'Density. The air between x and x + Δx is displaced by χ(x) and χ(x + Δx), so it now occupies Δx + (∂χ/∂x)Δx. The same mass in a larger space means lower density:', tex: '\\rho = \\frac{\\rho_0}{1 + \\partial\\chi/\\partial x} \\approx \\rho_0\\left(1 - \\frac{\\partial\\chi}{\\partial x}\\right)' },
      { text: 'Pressure. For a small change of density the pressure changes by the slope dp/dρ, which we name c²:', tex: 'p - p_0 = c^2(\\rho - \\rho_0) = -\\rho_0\\,c^2\\,\\frac{\\partial\\chi}{\\partial x}' },
      { text: 'Newton. The slab of mass ρ₀Δx is pushed by the pressure on its left and held back by that on its right; the difference is −(∂p/∂x)Δx:', tex: '\\rho_0\\,\\Delta x\\,\\frac{\\partial^2\\chi}{\\partial t^2} = -\\frac{\\partial p}{\\partial x}\\,\\Delta x = \\rho_0 c^2\\,\\frac{\\partial^2\\chi}{\\partial x^2}\\,\\Delta x' },
      { text: 'Cancel ρ₀Δx. What is left is the wave equation:', tex: '\\frac{\\partial^2\\chi}{\\partial t^2} = c^2\\,\\frac{\\partial^2\\chi}{\\partial x^2}' },
      { text: 'Check the travelling solution f(x − ct): two time derivatives bring out (−c)² = c², two space derivatives bring out 1, so both sides are c² f″. For an ideal gas compressed adiabatically, p ∝ ρ^γ gives c² = dp/dρ = γp/ρ.', tex: 'c^2 = \\frac{dp}{d\\rho} = \\frac{\\gamma p}{\\rho}' }
    ]
  },
  examples: [
    {
      title: 'Newton\'s speed and the real one',
      q: 'Air at 20 °C and 101.3 kPa has density 1.204 kg/m³. Compare Newton\'s isothermal speed of sound with the adiabatic one.',
      steps: [
        'Isothermal: $c = \\sqrt{p/\\rho} = \\sqrt{101\\,325/1.204} = 290$ m/s.',
        'Adiabatic: $c = \\sqrt{1.4 \\times 101\\,325/1.204} = 343$ m/s — the measured value.',
        'The ratio is $\\sqrt{1.4} = 1.18$.'
      ],
      a: '290 m/s against 343 m/s; the adiabatic value is right.'
    },
    {
      title: 'How far away is the storm?',
      q: 'You see lightning and hear the thunder 6 s later. How far away was it (air at 20 °C)?',
      steps: ['Light arrives almost instantly; sound takes the 6 s.', '$d = 343 \\times 6 = 2060$ m — about 3 s per kilometre.'],
      a: 'About 2 km.'
    }
  ],
  quiz: [
    { q: 'At constant temperature, doubling the air pressure makes the speed of sound…', choices: ['stay the same', 'double', 'rise by √2', 'halve'], a: 0, why: 'c² = γp/ρ and the density doubles with the pressure, so the ratio is unchanged.' },
    { q: 'A pulse runs along a string to an end that is tied to a wall. It comes back…', choices: ['upside down', 'the same way up', 'not at all', 'twice as tall'], a: 0, why: 'The fixed end cannot move, which requires an inverted reflected pulse to cancel there.' },
    { q: 'Two equal and opposite pulses meet in the middle of a string. At the instant they overlap the string is flat. Afterwards…', choices: ['both pulses continue as before', 'the string stays flat', 'they bounce back', 'one pulse twice as big leaves'], a: 0, why: 'The string is flat but moving; by superposition each pulse carries on unchanged.' },
    { q: 'Sound travels about three times faster in helium than in air. Mainly because helium…', choices: ['has much lighter molecules', 'is at higher pressure', 'has a larger γ only', 'is a better conductor of heat'], a: 0, why: 'c = √(γRT/M): M is 4 g/mol against 29; γ is also larger (5/3), a smaller effect.' },
    { q: 'What is the wavelength of a 343 Hz tone in air at 20 °C, in metres?', answer: 1, unit: 'm', why: 'λ = v/f = 343/343 = 1 m.' }
  ],
  problems: [
    { q: 'A string of 5 g/m is to carry waves at 200 m/s. What tension is needed?', answer: 200, unit: 'N', tol: 0.02, hint: 'F = μv².',
      steps: ['$F = \\mu v^2 = 0.005 \\times 200^2 = 200$ N.'] },
    { q: 'At what temperature does sound travel at 330 m/s in air (M = 28.97 g/mol, γ = 1.4)?', answer: 271, unit: 'K', tol: 0.01, hint: 'T = c²M/(γR).',
      steps: ['$T = c^2 M/(\\gamma R) = 330^2 \\times 0.02897/(1.4 \\times 8.314) = 271$ K, about −2 °C.'] }
  ],
  applications: [
    'Sonar, ultrasound imaging and seismic surveys all time echoes and convert them to distance with the speed of sound.',
    'Musicians tune wind instruments after warming them: the pitch rises with the temperature of the air inside.',
    'The speed of sound in a gas measures its temperature or composition (acoustic thermometry, gas analysers).',
    'Divers breathing helium mixtures speak with raised resonances ("Donald Duck voice") because sound is faster in their airways.'
  ],
  history: 'Newton calculated the speed of sound in the *Principia* (1687) and got a value about 15 % too low. Jean d\'Alembert wrote down the wave equation for a vibrating string and its general travelling solution in 1747. Pierre-Simon Laplace explained Newton\'s error in 1816: the compressions of sound are adiabatic, not isothermal.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 47 (Sound. The wave equation) — waves, the propagation of sound, the wave equation, its solutions, the speed of sound.',
    'Vol. I, ch. 51 (Waves) — waves in solids.',
    'Vol. II, ch. 20 (Solutions of Maxwell\'s Equations in Free Space) — the same wave equation for light.'
  ],
  sim: 'osc-string'
},

{
  id: 'beats-feyn', parent: 'waves-sound', title: 'Beats and group velocity', level: 2,
  short: 'Two tones of slightly different pitch swell and fade together, |f₁ − f₂| times a second: their arrows drift in and out of step. In space the same addition makes wave groups; the crests move at the phase velocity ω/k, the groups — and the energy — at the group velocity dω/dk, which can be quite different.',
  keywords: ['beats', 'beat frequency', 'modulation', 'side bands', 'amplitude modulation', 'phase velocity', 'group velocity', 'dispersion', 'wave packet', 'deep water waves', 'plasma', 'faster than light', 'de Broglie'],
  prereq: ['wave-equation-sound', 'algebra-complex-numbers', 'physics:beats'],
  related: ['waves-feyn', 'harmonics-feyn', 'wave-and-particle', 'uncertainty-feyn', 'waveguides-feyn', 'origin-of-refractive-index', 'transients-feyn', 'physics:superposition'],
  body: `
Strike two tuning forks, one at 440 Hz and one at 442 Hz. You do not hear two notes: you hear one note that swells and fades twice a second — **beats**. Feynman used this simple effect to open a chain of ideas that runs through radio, wave groups and, in the end, the motion of quantum particles.

### Two arrows drifting apart
Write each tone as a [[?rotating-arrow|rotating arrow]], $e^{i\\omega_1 t}$ and $e^{i\\omega_2 t}$. The sound is the real part of their sum. When the arrows point the same way they add to twice the length; half a beat later the faster one has gained half a turn and they cancel. The algebra says the same with [[?sine-cosine|cosines]]:

$$\\cos\\omega_1 t + \\cos\\omega_2 t = 2\\cos\\frac{(\\omega_1 - \\omega_2)t}{2}\\;\\cos\\frac{(\\omega_1 + \\omega_2)t}{2}$$

— a tone at the average frequency whose amplitude swings slowly. The loudness peaks whenever the slow factor is $+1$ *or* $-1$, so the beat frequency is the whole difference: $f_b = |f_1 - f_2|$. Tuners use it every day: as two strings approach the same pitch the beats slow down and stop.

### Modulation and side bands
Run the idea backwards. A radio station makes its carrier's amplitude follow the sound, $(1 + m\\cos\\Omega t)\\cos\\omega_c t$. Multiply out and the signal is the carrier plus two new frequencies, $\\omega_c \\pm \\Omega$ — the **side bands**. Speech up to 5 kHz on a 1 MHz carrier occupies 995–1005 kHz: that is why stations need a band about 10 kHz wide, and why a tuned circuit with that bandwidth ([[resonance-feyn]]) is just right.

### Beats in space: groups
Now add two travelling waves, $\\cos(k_1x - \\omega_1 t) + \\cos(k_2x - \\omega_2 t)$. At each place there are beats in time, and at each instant beats in space: the waves come in **groups**. The crests inside move at the **phase velocity** $v_p = \\omega/k$, but the envelope moves at $\\Delta\\omega/\\Delta k$, which for a smooth spread of waves is the **group velocity**

$$v_g = \\frac{d\\omega}{dk}$$

(a [[?derivative]] of the frequency with respect to the wave number). If $\\omega$ is simply proportional to $k$ — sound in air, light in vacuum — both are equal and a group keeps its shape. Otherwise the medium is *dispersive* and they differ.

| Waves | $\\omega(k)$ | phase velocity | group velocity |
|---|---|---|---|
| sound; light in vacuum | $ck$ | $c$ | $c$ |
| deep-water waves | $\\sqrt{gk}$ | $\\sqrt{g/k}$ | half the phase velocity |
| capillary ripples | $\\sqrt{\\sigma k^3/\\rho}$ | $\\sqrt{\\sigma k/\\rho}$ | 1.5 × the phase velocity |
| radio waves in a plasma | $\\sqrt{\\omega_p^2 + c^2k^2}$ | more than $c$ | less than $c$ ($v_pv_g = c^2$) |

Drop a stone in a pond and watch a group of ripples spread: new crests appear at the back of the group, run forwards through it, and die at the front, because the crests go twice as fast as the group. **The simulation shows the crests and the group each with its own marker**.

### Faster than light, and particles
In a plasma, or a metal waveguide, the crests really do move faster than light. Nothing is wrong: a crest carries no information. A signal is a change in the wave — a group — and groups move at $v_g < c$.

The same mathematics describes matter. A quantum particle has $\\omega = E/\\hbar$ and $k = p/\\hbar$, and relativity gives $E^2 = p^2c^2 + m^2c^4$: the same form as the plasma. The group velocity $c^2k/\\omega = pc^2/E$ is exactly the particle's velocity, while its phase velocity is $c^2/v$, faster than light. A particle is a group of waves ([[wave-and-particle]]); the narrower the group, the wider its spread of $k$ — the germ of the [[uncertainty-feyn|uncertainty principle]].

> [!key] Adding two nearby frequencies gives a wave at the average frequency inside a slowly beating envelope. In space the envelope — the group, and with it the energy and the signal — moves at $d\\omega/dk$, not at the speed $\\omega/k$ of the crests.
`,
  ideas: [
    'Two tones f₁ and f₂ sound as one tone at the average frequency whose loudness beats |f₁ − f₂| times a second.',
    'In arrows: two rotating arrows drift in and out of line at the difference of their rates.',
    'Modulating a carrier at Ω creates side bands at ω_c ± Ω; a signal of bandwidth B needs a band 2B wide.',
    'Crests move at the phase velocity ω/k; groups, energy and signals at the group velocity dω/dk.',
    'For a quantum particle the group velocity is the particle\'s velocity; the phase velocity c²/v exceeds c harmlessly.'
  ],
  pitfalls: [
    'The beat frequency is half the difference of the two frequencies — The envelope cos(Δω t/2) has half the difference, but loudness peaks twice per cycle of it, so beats come |f₁ − f₂| times a second.',
    'A phase velocity faster than light breaks relativity — Crests carry no information; energy and signals travel with the groups, at v_g ≤ c.',
    'All waves keep their shape as they travel — Only in a non-dispersive medium (ω ∝ k). Water waves, waves in a plasma and quantum wave packets spread out.'
  ],
  formulas: [
    {
      name: 'Beat frequency',
      expr: 'fb = f1 - f2', tex: 'f_b = f_1 - f_2',
      vars: {
        fb: { name: 'beat frequency', q: 'frequency', unit: 'Hz', tex: 'f_b' },
        f1: { name: 'higher frequency', q: 'frequency', unit: 'Hz', value: 442, tex: 'f_1' },
        f2: { name: 'lower frequency', q: 'frequency', unit: 'Hz', value: 440, tex: 'f_2' }
      },
      note: 'The loudness swells and fades f_b times a second; the pitch heard is the average (f₁ + f₂)/2.',
      stories: {
        fb: 'Two strings sound at {f1} and {f2}. How many beats a second do you hear?',
        f1: 'A reference fork gives {f2}; a string slightly sharp of it gives {fb} beats a second. What is the string\'s frequency?'
      }
    },
    {
      name: 'Waves with ω² = ω_p² + c²k² (plasma, waveguide, relativistic particle)',
      expr: 'vg = c^2/vp', tex: 'v_g = \\dfrac{c^2}{v_p}',
      vars: {
        vg: { name: 'group velocity', q: 'speed', unit: 'c', tex: 'v_g' },
        c: { const: 'c' },
        vp: { name: 'phase velocity', q: 'speed', unit: 'c', value: 1.25, tex: 'v_p' }
      },
      note: 'From v_p = ω/k and v_g = dω/dk = c²k/ω. The crests outrun light; the groups never do.',
      stories: { vg: 'In a waveguide the crests travel at {vp}. How fast does a signal travel?' }
    },
    {
      name: 'Phase velocity of deep-water waves',
      expr: 'vp = sqrt(g*lambda/(2*pi))', tex: 'v_p = \\sqrt{\\dfrac{g\\lambda}{2\\pi}}',
      vars: {
        vp: { name: 'phase velocity (speed of the crests)', q: 'speed', unit: 'm/s', tex: 'v_p' },
        g: { const: 'g' },
        lambda: { name: 'wavelength', q: 'length', unit: 'm', value: 100, tex: '\\lambda' }
      },
      note: 'Water deeper than about half a wavelength. The groups (and the energy) move at half this speed.',
      stories: {
        vp: 'Ocean swell has a wavelength of {lambda}. How fast do its crests travel?',
        lambda: 'Waves in deep water run at {vp}. How long are they?'
      }
    }
  ],
  derivation: {
    title: 'The envelope moves at Δω/Δk',
    steps: [
      { text: 'Add two waves of nearly equal wave number and frequency. Use the identity cos A + cos B = 2 cos((A − B)/2) cos((A + B)/2):', tex: '\\cos(k_1x - \\omega_1t) + \\cos(k_2x - \\omega_2t) = 2\\cos\\!\\left(\\frac{\\Delta k\\,x - \\Delta\\omega\\,t}{2}\\right)\\cos(\\bar k x - \\bar\\omega t)' },
      { text: 'The second factor is a wave at the average wave number and frequency: its crests move where k̄x − ω̄t stays constant, at the phase velocity:', tex: 'v_p = \\frac{\\bar\\omega}{\\bar k}' },
      { text: 'The first factor is the envelope. It keeps its shape where Δk x − Δω t stays constant, so it moves at a different speed:', tex: 'v_{\\text{env}} = \\frac{\\Delta\\omega}{\\Delta k} \\;\\to\\; v_g = \\frac{d\\omega}{dk}' },
      { text: 'Example: deep water, ω = √(gk). Differentiating gives half the phase velocity:', tex: 'v_g = \\frac{d}{dk}\\sqrt{gk} = \\frac12\\sqrt{\\frac{g}{k}} = \\frac{v_p}{2}' },
      { text: 'For ω² = ω_p² + c²k², differentiate both sides: 2ω dω = 2c²k dk, so v_g = c²k/ω = c²/v_p.' }
    ]
  },
  examples: [
    {
      title: 'Tuning by beats',
      q: 'A guitarist compares a string with a 110.0 Hz reference and hears 1.5 beats a second. Tightening the string slightly makes the beats faster. What is the string\'s frequency, and what should she do?',
      steps: [
        'The string is at $110.0 \\pm 1.5$ Hz: 111.5 Hz or 108.5 Hz.',
        'Tightening raises the pitch. If the beats get faster, the difference grew, so the string was already sharp: 111.5 Hz.',
        'She should loosen it until the beats slow down and vanish.'
      ],
      a: '111.5 Hz; loosen the string.'
    },
    {
      title: 'Swell from a distant storm',
      q: 'A storm 1000 km away raises waves 100 m long in deep water. How fast are the crests, and how long does the swell take to arrive?',
      steps: [
        '$v_p = \\sqrt{g\\lambda/2\\pi} = \\sqrt{9.81 \\times 100/2\\pi} = 12.5$ m/s.',
        'The energy travels at the group velocity, $v_g = v_p/2 = 6.25$ m/s.',
        '$t = 10^6/6.25 = 1.6\\times10^5$ s, about 44 hours.'
      ],
      a: 'Crests at 12.5 m/s; the swell arrives after about 44 hours.'
    }
  ],
  quiz: [
    { q: 'Two tuning forks give 440 Hz and 443 Hz. You hear…', choices: ['a tone of 441.5 Hz beating 3 times a second', 'two separate notes', 'a tone of 3 Hz', 'a tone beating 1.5 times a second'], a: 0, why: 'The pitch is the average; the loudness beats at the difference, 3 Hz.' },
    { q: 'In deep water, individual crests move faster than the group they belong to.', a: true, why: 'v_g = v_p/2: crests appear at the back of a group, run through it and vanish at the front.' },
    { q: 'In a waveguide the phase velocity is 1.5 c. What does this mean for signals?', choices: ['nothing: signals travel at the group velocity, c/1.5', 'signals travel faster than light', 'no signal can travel', 'signals travel at 1.5 c²'], a: 0, why: 'v_g = c²/v_p = c/1.5 ≈ 0.67 c.' },
    { q: 'A 1 MHz carrier is modulated by a 3 kHz tone. Which frequencies are in the signal?', choices: ['997, 1000 and 1003 kHz', 'only 1000 kHz', '3 kHz and 1000 kHz', '1000 and 1003 kHz'], a: 0, why: '(1 + m cos Ωt) cos ω_c t = carrier + two side bands at ω_c ± Ω.' },
    { q: 'For a free quantum particle, which velocity equals the particle\'s own velocity?', choices: ['the group velocity', 'the phase velocity', 'neither', 'both'], a: 0, why: 'dω/dk = dE/dp = pc²/E = v; the phase velocity is c²/v.' }
  ],
  problems: [
    { q: 'Signals in a waveguide travel at 0.6 c. How fast do the crests of the wave move, in units of c?', answer: 1.667, tol: 0.02, hint: 'v_p v_g = c².',
      steps: ['$v_p = c^2/v_g = c/0.6 = 1.67\\,c$.'] },
    { q: 'Deep-water waves have crests travelling at 5 m/s. What is their wavelength?', answer: 16.0, unit: 'm', tol: 0.02, hint: 'λ = 2π v_p²/g.',
      steps: ['$\\lambda = 2\\pi v_p^2/g = 2\\pi \\times 25/9.81 = 16.0$ m.'] }
  ],
  applications: [
    'Piano tuners and musicians tune by listening for beats to slow down and vanish.',
    'Amplitude- and frequency-modulated radio, and the channel spacing of all broadcasting, follow from side bands.',
    'Optical fibres are designed to control group velocity dispersion, which would otherwise smear out short light pulses.',
    'Oceanographers forecast the arrival of swell from distant storms using the group velocity of water waves.'
  ],
  history: 'The difference between the speed of wave groups and of their crests was noticed for water waves by John Scott Russell and explained by George Stokes (1876) and Lord Rayleigh (1877), who named the group velocity. Louis de Broglie showed in 1924 that a particle\'s velocity is the group velocity of its waves.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 48 (Beats) — adding two waves, beat notes and modulation, side bands, localised wave trains, phase and group velocity, and probability amplitudes for particles.',
    'Vol. I, ch. 51 (Waves) — surface waves on water and their dispersion.',
    'Vol. II, ch. 24 (Waveguides) — waves in a guide, with a phase velocity faster than light.'
  ],
  sim: 'osc-beats'
},

{
  id: 'modes-feyn', parent: 'waves-sound', title: 'Modes of vibration', level: 2,
  short: 'Waves shut in a string, a pipe or a drum bounce back and forth, and only certain patterns — the modes — vibrate steadily, each at its own natural frequency. Any motion is a sum of modes. On a string the frequencies are whole multiples of the lowest; on a drum they are not.',
  keywords: ['modes', 'normal modes', 'standing waves', 'nodes', 'antinodes', 'natural frequencies', 'harmonic series', 'string', 'pipe', 'membrane', 'drum', 'Bessel', 'Chladni figures', 'coupled pendulums'],
  prereq: ['wave-equation-sound', 'linear-systems', 'physics:standing-waves'],
  related: ['harmonics-feyn', 'beats-feyn', 'waveguides-feyn', 'hydrogen-and-periodic-table', 'equipartition-failure', 'physics:air-columns', 'math:eigenvalues'],
  body: `
A wave on an endless string travels for ever. Tie the string at both ends and the wave reflects back and forth, overlapping with itself. Feynman's lecture on modes asks what patterns can survive this, and finds the answer that governs every musical instrument — and, in quantum mechanics, the atom.

### Standing waves
Two equal waves travelling opposite ways add up to a wave that does not travel:

$$\\sin(kx - \\omega t) + \\sin(kx + \\omega t) = 2\\sin kx\\,\\cos\\omega t$$

The *shape* $\\sin kx$ stays put and only its size swings, $\\cos\\omega t$. Points where $\\sin kx = 0$, every half-wavelength, never move: the **nodes**. A string fixed at both ends must have nodes there, so a whole number of half-wavelengths must fit, $L = n\\lambda/2$, and the frequencies are

$$f_n = \\frac{n}{2L}\\sqrt{\\frac{F}{\\mu}}, \\qquad n = 1, 2, 3, \\dots$$

These patterns are the **modes**. For a string they form a harmonic series: 1, 2, 3, 4… times the lowest. The high E string of a guitar (0.648 m, 0.4 g/m, 73 N) has $f_1 = 330$ Hz, then 659, 989 Hz…

### Every motion is a sum of modes
Because the wave equation is [[linear-systems|linear]], any motion of the string is a superposition of modes, each swinging at its own frequency. A pluck starts many of them at once; the shape of the string keeps changing because the modes drift in and out of step. For a string all the frequencies are whole multiples of $f_1$, so after one period $1/f_1$ every mode is back in step and the whole motion repeats: a note with a definite pitch. How much of each mode is present is a [[?fourier|Fourier]] question — [[harmonics-feyn]].

### Pipes
In a pipe the air's displacement vanishes at a closed end and the pressure change vanishes at an open end. Open at both ends: $f_n = nc/2L$ (a flute). Closed at one end: only odd multiples, $f_n = (2n - 1)c/4L$ — a stopped organ pipe or, roughly, a clarinet, whose low notes are rich in odd harmonics.

### Membranes and drums
In two dimensions the modes are patterns with nodal *lines*. A rectangular membrane has $z = \\sin(m\\pi x/a)\\sin(n\\pi y/b)\\cos\\omega t$ with $f = \\tfrac{v}{2}\\sqrt{(m/a)^2 + (n/b)^2}$. A circular drum has nodal circles and diameters, and frequencies set by the zeros of Bessel functions — no longer whole multiples:

| Drum mode (diameters, circles) | (0, 1) | (1, 1) | (2, 1) | (0, 2) | (3, 1) | (1, 2) |
|---|---|---|---|---|---|---|
| Frequency ÷ lowest | 1 | 1.593 | 2.136 | 2.295 | 2.653 | 2.917 |

That is why a drum's sound has a less definite pitch than a string's. Sprinkle sand on a vibrating plate and it gathers on the nodal lines (Chladni's figures). **In the simulation**, pick a mode of a string, a rectangular membrane or a drum and watch it swing in 3-D, with its nodal lines; mix two string modes to see a shape that no longer keeps its form.

> [!key] A confined wave can vibrate steadily only in certain patterns — modes — each with its own frequency; any motion is a sum of them. Strings and pipes have harmonic modes ($f_n = nf_1$); membranes do not.

### Modes everywhere
Two pendulums joined by a spring have two modes, swinging together and swinging opposite; start one alone and the energy sloshes between them as the two modes beat. Molecules vibrate in modes, a building sways in modes, the electromagnetic field in an oven or a laser cavity has modes ([[waveguides-feyn]]), and counting the modes of a hot box is where classical physics failed ([[equipartition-failure]]). In quantum mechanics an electron bound in an atom is a standing wave, and its allowed energies are the frequencies of its modes ([[hydrogen-and-periodic-table]]). Mathematically, modes are the [[math:eigenvalues|eigenvectors]] of a linear system.
`,
  ideas: [
    'Two equal waves travelling in opposite directions make a standing wave 2 sin kx cos ωt, with fixed nodes.',
    'Fixed ends force a whole number of half-wavelengths: f_n = n v/2L — a harmonic series for strings and open pipes.',
    'A pipe closed at one end has only odd harmonics, (2n − 1)c/4L.',
    'Any motion of a linear system is a sum of its modes, each oscillating at its own frequency.',
    'Membranes have nodal lines and inharmonic frequencies (for a circular drum, set by Bessel-function zeros).'
  ],
  pitfalls: [
    'A standing wave is a wave that has stopped moving — The medium still moves (fastest at the antinodes); only the pattern stays in place. It is two travelling waves going opposite ways.',
    'A plucked string vibrates in one shape that just grows and shrinks — It is a sum of many modes with different frequencies; the shape changes all through each period, and only repeats after 1/f₁.',
    'All instruments have harmonic overtones — Strings and air columns do (nearly); drums, bells and bars have overtones that are not whole multiples of the lowest.'
  ],
  formulas: [
    {
      name: 'Natural frequencies of a string fixed at both ends',
      expr: 'f = n/(2*L)*sqrt(F/mu)', tex: 'f_n = \\dfrac{n}{2L}\\sqrt{\\dfrac{F}{\\mu}}',
      vars: {
        f: { name: 'frequency of mode n', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'mode number', int: true, value: 1 },
        L: { name: 'vibrating length', q: 'length', unit: 'm', value: 0.648 },
        F: { name: 'tension', q: 'force', unit: 'N', value: 73 },
        mu: { name: 'mass per unit length', q: 'lindensity', unit: 'g/m', value: 0.4, tex: '\\mu' }
      },
      note: 'n = 1 is the fundamental; the modes form a harmonic series.',
      stories: {
        f: 'A string {L} long, of {mu}, is stretched with {F}. What is the frequency of mode {n}?',
        F: 'What tension tunes a string of {mu} and length {L} to {f} (mode {n})?'
      }
    },
    {
      name: 'Pipe closed at one end',
      expr: 'f = (2*n - 1)*c/(4*L)', tex: 'f_n = \\dfrac{(2n - 1)\\,c}{4L}',
      vars: {
        f: { name: 'frequency of mode n', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'mode number', int: true, value: 1 },
        c: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343 },
        L: { name: 'length of the pipe', q: 'length', unit: 'm', value: 0.5 }
      },
      note: 'Only odd multiples of c/4L. For a pipe open at both ends, f_n = n c/2L.',
      stories: { L: 'How long must a stopped organ pipe be to sound {f} as its lowest note ({c})?' }
    },
    {
      name: 'Modes of a rectangular membrane',
      expr: 'f = v/2*sqrt((m/a)^2 + (n/b)^2)', tex: 'f_{mn} = \\dfrac{v}{2}\\sqrt{\\left(\\dfrac{m}{a}\\right)^2 + \\left(\\dfrac{n}{b}\\right)^2}',
      vars: {
        f: { name: 'frequency of mode (m, n)', q: 'frequency', unit: 'Hz', tex: 'f_{mn}' },
        v: { name: 'wave speed on the membrane', q: 'speed', unit: 'm/s', value: 100 },
        m: { name: 'half-waves across the width', int: true, value: 1 },
        n: { name: 'half-waves along the length', int: true, value: 1 },
        a: { name: 'width', q: 'length', unit: 'm', value: 0.5 },
        b: { name: 'length', q: 'length', unit: 'm', value: 0.4 }
      },
      note: 'The membrane is fixed round its edge; v = √(tension per length / mass per area).',
      stories: { f: 'A membrane {a} by {b} carries waves at {v}. What is the frequency of its mode ({m}, {n})?' }
    },
    {
      name: 'Modes of a circular drum',
      expr: 'f = j*v/(2*pi*R)', tex: 'f = \\dfrac{j\\,v}{2\\pi R}',
      vars: {
        f: { name: 'frequency of the mode', q: 'frequency', unit: 'Hz' },
        j: { name: 'Bessel-function zero of the mode (2.405 for the lowest)', value: 2.405 },
        v: { name: 'wave speed on the membrane', q: 'speed', unit: 'm/s', value: 100 },
        R: { name: 'radius of the drum', q: 'length', unit: 'm', value: 0.18 }
      },
      note: 'j = 2.405, 3.832, 5.136, 5.520, 6.380, 7.016 for the first six modes — not whole multiples.',
      stories: { f: 'A drumhead of radius {R} carries waves at {v}. What is the frequency of the mode with j = {j}?' }
    }
  ],
  derivation: {
    title: 'Standing waves and the allowed frequencies',
    steps: [
      { text: 'A wave on a string fixed at x = 0 reflects from the end upside down. The wave going right plus the reflected wave going left is:', tex: 'y = A\\sin(kx - \\omega t) + A\\sin(kx + \\omega t)' },
      { text: 'Use sin(α − β) + sin(α + β) = 2 sin α cos β: the sum separates into a shape times a swing in time.', tex: 'y = 2A\\sin kx\\,\\cos\\omega t' },
      { text: 'The shape vanishes at x = 0 automatically. For the string to be fixed at x = L too, sin kL must be zero:', tex: 'kL = n\\pi \\quad\\Rightarrow\\quad \\lambda_n = \\frac{2L}{n}' },
      { text: 'The wave speed links wavelength and frequency, f = v/λ, which gives the harmonic series:', tex: 'f_n = \\frac{n\\,v}{2L} = \\frac{n}{2L}\\sqrt{\\frac{F}{\\mu}}' }
    ]
  },
  examples: [
    {
      title: 'A guitar string',
      q: 'The high E string of a guitar is 0.648 m long, has 0.40 g/m and is tuned to 329.6 Hz. What is the tension, and what are the next two modes?',
      steps: [
        '$v = 2Lf_1 = 2 \\times 0.648 \\times 329.6 = 427$ m/s.',
        '$F = \\mu v^2 = 0.0004 \\times 427^2 = 73$ N.',
        'Modes 2 and 3: 659 Hz and 989 Hz.'
      ],
      a: 'About 73 N; 659 Hz and 989 Hz.'
    },
    {
      title: 'A stopped pipe',
      q: 'A pipe 0.5 m long is closed at one end. Find its three lowest frequencies (sound at 343 m/s). How would they change if both ends were open?',
      steps: [
        'Closed: $f = (2n - 1) \\times 343/2 = 171.5$, 514.5, 857.5 Hz — only odd multiples.',
        'Open: $f = n \\times 343/1 = 343$, 686, 1029 Hz — all multiples, and the lowest is an octave higher.'
      ],
      a: 'Closed: 171.5, 514.5, 857.5 Hz; open: 343, 686, 1029 Hz.'
    }
  ],
  quiz: [
    { q: 'You double the tension of a string. Its fundamental frequency…', choices: ['rises by √2', 'doubles', 'halves', 'stays the same'], a: 0, why: 'f ∝ √F.' },
    { q: 'A pipe closed at one end has a lowest frequency of 100 Hz. Its next mode is at…', choices: ['300 Hz', '200 Hz', '150 Hz', '400 Hz'], a: 0, why: 'Only odd multiples: 100, 300, 500 Hz.' },
    { q: 'At a node of a standing wave on a string…', choices: ['the string never moves', 'the string moves fastest', 'the tension is zero', 'the wave travels fastest'], a: 0, why: 'sin kx = 0 there for all time.' },
    { q: 'The overtones of a circular drum are whole-number multiples of its lowest frequency.', a: false, why: 'They follow Bessel-function zeros: 1, 1.59, 2.14, 2.30, … times the lowest.' },
    { q: 'A string sounds 200 Hz. What is the frequency of its 3rd mode, in Hz?', answer: 600, unit: 'Hz', why: 'f_n = n f₁ for a string fixed at both ends.' }
  ],
  problems: [
    { q: 'A 0.65 m string of 1.2 g/m is to sound 196 Hz (the fundamental of a guitar\'s G string). What tension is needed?', answer: 77.9, unit: 'N', tol: 0.02, hint: 'v = 2Lf, F = μv².',
      steps: ['$v = 2 \\times 0.65 \\times 196 = 254.8$ m/s.', '$F = 0.0012 \\times 254.8^2 = 77.9$ N.'] },
    { q: 'A drumhead of radius 0.18 m carries waves at 100 m/s. What is the frequency of its second mode, (1, 1), with j = 3.832?', answer: 339, unit: 'Hz', tol: 0.02, hint: 'f = jv/(2πR).',
      steps: ['$f = 3.832 \\times 100/(2\\pi \\times 0.18) = 339$ Hz, 1.59 times the lowest (213 Hz).'] }
  ],
  applications: [
    'String and wind instruments choose their notes by changing the length that vibrates, so changing which modes fit.',
    'Engineers find the modes of bridges, aircraft wings and engines (modal analysis) to keep them away from the frequencies that drive them.',
    'Microwave ovens heat unevenly because the field in the box forms standing-wave modes; the turntable moves food through the hot spots.',
    'Lasers work in the modes of their optical cavity; the allowed frequencies are c/2L apart.'
  ],
  history: 'Joseph Sauveur named nodes and harmonics around 1700, and Daniel Bernoulli proposed in 1753 that any vibration of a string is a sum of its modes. Ernst Chladni showed the nodal lines of vibrating plates with sand in 1787. The modes of a circular membrane were worked out with Bessel functions in the nineteenth century (Poisson and Clebsch among others).',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 49 (Modes) — the reflection of waves, confined waves with natural frequencies, modes in two dimensions, coupled pendulums, linear systems.',
    'Vol. I, ch. 50 (Harmonics) — how the modes combine in musical tones.',
    'Vol. II, ch. 23 (Cavity Resonators) — the modes of electromagnetic waves in a box.'
  ],
  sim: 'osc-modes'
},

{
  id: 'harmonics-feyn', parent: 'waves-sound', title: 'Harmonics and Fourier analysis', level: 2,
  short: 'Any sound that repeats every T seconds is a sum of pure tones at 1/T, 2/T, 3/T… — its harmonics. The mixture sets the quality of the sound: a flute and a violin on the same note differ only in how much of each harmonic they carry. Fourier\'s recipe finds the mixture; the energy is the sum of the energies of the harmonics.',
  keywords: ['harmonics', 'Fourier series', 'Fourier coefficients', 'overtones', 'timbre', 'quality of sound', 'square wave', 'sawtooth', 'Gibbs phenomenon', 'energy theorem', 'Parseval', 'consonance', 'equal temperament', 'nonlinear distortion'],
  prereq: ['modes-feyn', 'algebra-complex-numbers', 'math:fourier-series'],
  related: ['beats-feyn', 'linear-systems', 'wave-equation-sound', 'physics:harmonics-timbre', 'math:trig-identities'],
  body: `
Play the same note — say A at 220 Hz — on a flute, a violin and a piano. The pitch is the same because the pressure wave repeats 220 times a second in each case. What differs is the *shape* of the repeating wave. Feynman's lecture on harmonics explains how shape and sound are linked, through one of the most useful ideas in all of science.

### Every repeating wave is a sum of harmonics
Fourier's theorem says that any [[?function]] that repeats with period $T$ (angular frequency $\\omega = 2\\pi/T$) can be written as a [[?sum]] of cosines and sines at $\\omega$, $2\\omega$, $3\\omega$, …:

$$f(t) = a_0 + \\sum_{n=1}^{\\infty}\\left(a_n\\cos n\\omega t + b_n\\sin n\\omega t\\right)$$

These are the **harmonics**: the fundamental and its whole-number multiples — exactly the modes of a string or an open pipe ([[modes-feyn]]). This is a [[?fourier|Fourier series]]. The ear hears the mixture as the *quality* (timbre) of the sound; for steady tones it is largely deaf to the relative phases of the harmonics, so it is mainly the sizes $\\sqrt{a_n^2 + b_n^2}$ that matter.

### Finding the coefficients
The trick is that different harmonics average to zero against each other: over a period, the average of $\\sin n\\omega t\\,\\sin m\\omega t$ is 0 unless $n = m$, when it is $\\tfrac12$. So to pick out $b_n$, multiply $f$ by $\\sin n\\omega t$ and average — every other term drops out:

$$b_n = \\frac{2}{T}\\int_0^T f(t)\\sin n\\omega t\\,dt$$

(an [[?integral]] over one period), and the same with cosines for $a_n$.

### Three shapes
| Harmonic $n$ | square wave | sawtooth | triangle |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 2 | 0 | 1/2 | 0 |
| 3 | 1/3 | 1/3 | 1/9 |
| 4 | 0 | 1/4 | 0 |
| 5 | 1/5 | 1/5 | 1/25 |

(sizes relative to the fundamental.) A square wave of height $\\pm A$ has $b_n = 4A/\\pi n$ for odd $n$ only; a sawtooth has every harmonic falling as $1/n$; a triangle only odd ones, falling as $1/n^2$. The rule: **jumps** in a wave need harmonics falling as $1/n$; **corners** as $1/n^2$; smooth waves need very few. Near a jump the partial sums always overshoot by about 9 % of the jump, however many terms you add (the Gibbs phenomenon). A bowed violin string moves in a sawtooth-like way, rich in every harmonic; a clarinet's low notes, from a pipe closed at one end, are rich in odd harmonics, somewhat like a square wave.

**In the simulation**, add harmonics one at a time and watch the square wave, the sawtooth and a voice-like wave take shape — and listen to them.

### The energy theorem
The mean square of the wave (its power, for sound) is the sum of the powers of the harmonics: $\\overline{f^2} = a_0^2 + \\tfrac12\\sum(a_n^2 + b_n^2)$. For the square wave, whose mean square is $A^2$, this gives $1 + \\tfrac19 + \\tfrac1{25} + \\dots = \\pi^2/8$ — a sum of numbers found by listening, so to speak.

### Consonance
Two notes sound smooth together when many of their harmonics coincide: frequency ratios of small whole numbers — the octave 2:1, the fifth 3:2, the fourth 4:3, as the Pythagoreans found. When harmonics nearly but not quite coincide they [[beats-feyn|beat]], which the ear hears as roughness. Keyboards tuned in equal temperament make every semitone a factor $2^{1/12}$, so the fifth is $2^{7/12} = 1.4983$ instead of 1.5: the third harmonic of A 220 Hz (660 Hz) beats slowly, 0.74 times a second, against the second harmonic of the E above it (659.26 Hz).

### Nonlinear systems make harmonics
Put a pure sine into a [[linear-systems|linear]] system and a pure sine comes out. Put it into a nonlinear one — an overdriven amplifier, a clipped signal, the ear at very high levels — and harmonics appear that were not in the input: that is distortion.

> [!key] A periodic wave is a sum of harmonics $n\\omega$; their sizes are found by averaging the wave against each sine and cosine, and their powers add up to the wave's power. The mixture of harmonics is the quality of a musical sound.
`,
  ideas: [
    'Any wave repeating with period T is a sum of sines and cosines at the harmonics n/T.',
    'Different harmonics average to zero against each other, so each coefficient is found by multiplying by that harmonic and averaging.',
    'Jumps need harmonics falling as 1/n (square, sawtooth); corners as 1/n² (triangle); near a jump the partial sums overshoot by about 9 %.',
    'Energy theorem: the mean square of the wave equals the sum of the mean squares of its harmonics.',
    'Consonant intervals have small whole-number frequency ratios, so their harmonics coincide instead of beating.'
  ],
  pitfalls: [
    'A square wave contains a little of every frequency — Only odd multiples of the fundamental, with sizes 1, 1/3, 1/5…; the even harmonics are exactly zero by symmetry.',
    'With enough terms, the Fourier sum of a square wave loses its overshoot — The overshoot near each jump stays about 9 % of the jump; it only gets narrower (Gibbs phenomenon).',
    'Two sounds with the same harmonic sizes but different phases look alike — Their waveforms can look completely different, yet for steady tones the ear hears them as nearly the same.'
  ],
  formulas: [
    {
      name: 'Frequencies of the harmonics',
      expr: 'fn = n*f1', tex: 'f_n = n f_1',
      vars: {
        fn: { name: 'frequency of harmonic n', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'harmonic number', int: true, value: 3 },
        f1: { name: 'fundamental frequency', q: 'frequency', unit: 'Hz', value: 220, tex: 'f_1' }
      },
      note: 'The fundamental is n = 1; the rest are also called overtones.',
      stories: { fn: 'A note has fundamental {f1}. What is the frequency of harmonic {n}?' }
    },
    {
      name: 'Harmonics of a square wave',
      expr: 'bn = 4*A/(pi*n)', tex: 'b_n = \\dfrac{4A}{\\pi n}\\quad (n\\ \\text{odd})',
      vars: {
        bn: { name: 'amplitude of harmonic n', q: false, unit: 'relative', tex: 'b_n' },
        A: { name: 'height of the square wave (±A)', q: false, unit: 'relative', value: 1 },
        n: { name: 'harmonic number (odd)', int: true, value: 3 }
      },
      note: 'Even harmonics are zero. The fundamental (4/π ≈ 1.27 A) is taller than the square wave itself.',
      stories: { bn: 'A square wave swings between ±{A}. How big is its harmonic {n}?' }
    },
    {
      name: 'Equal temperament: s semitones up',
      expr: 'f = f0*2^(s/12)', tex: 'f = f_0\\,2^{s/12}',
      vars: {
        f: { name: 'frequency of the new note', q: 'frequency', unit: 'Hz' },
        f0: { name: 'frequency of the starting note', q: 'frequency', unit: 'Hz', value: 220, tex: 'f_0' },
        s: { name: 'number of semitones (7 = a fifth, 12 = an octave)', int: true, signed: true, value: 7 }
      },
      note: 'A pure fifth would be exactly 3/2 = 1.5; equal temperament gives 1.4983.',
      stories: {
        f: 'On a piano, what is the frequency {s} semitones above {f0}?',
        s: 'How many semitones above {f0} is a note of {f}?'
      }
    }
  ],
  derivation: {
    title: 'The coefficients of a square wave',
    steps: [
      { text: 'Take f(t) = +A for the first half of each period and −A for the second. It is odd about t = 0, so only sines appear. Multiply by sin nωt and average over a period (the other harmonics average to zero):', tex: 'b_n = \\frac{2}{T}\\int_0^{T} f(t)\\sin n\\omega t\\,dt' },
      { text: 'Split the integral at T/2 and use the antiderivative −cos(nωt)/(nω):', tex: 'b_n = \\frac{2A}{T}\\left[\\int_0^{T/2}\\sin n\\omega t\\,dt - \\int_{T/2}^{T}\\sin n\\omega t\\,dt\\right] = \\frac{2A}{n\\pi}\\left(1 - \\cos n\\pi\\right)' },
      { text: 'cos nπ is −1 for odd n and +1 for even n:', tex: 'b_n = \\frac{4A}{\\pi n}\\ \\ (n\\ \\text{odd}), \\qquad b_n = 0\\ \\ (n\\ \\text{even})' },
      { text: 'Check with the energy theorem: the mean square of the square wave is A², and half the sum of the b_n² must equal it — which proves a famous sum:', tex: '\\frac12\\sum_{n\\,\\text{odd}}\\frac{16A^2}{\\pi^2 n^2} = A^2 \\;\\Rightarrow\\; 1 + \\frac19 + \\frac1{25} + \\dots = \\frac{\\pi^2}{8}' }
    ]
  },
  examples: [
    {
      title: 'Building a square wave',
      q: 'A square wave swings between ±1. Write its first three non-zero harmonics, and find the value of their sum at the middle of the positive half ($\\omega t = \\pi/2$).',
      steps: [
        '$b_1 = 4/\\pi = 1.273$, $b_3 = 4/3\\pi = 0.424$, $b_5 = 4/5\\pi = 0.255$.',
        'At $\\omega t = \\pi/2$: $\\sin(\\pi/2) = 1$, $\\sin(3\\pi/2) = -1$, $\\sin(5\\pi/2) = 1$.',
        'Sum: $1.273 - 0.424 + 0.255 = 1.104$ — heading towards 1, from above and below in turn.'
      ],
      a: '1.273 sin ωt + 0.424 sin 3ωt + 0.255 sin 5ωt; about 1.10 at the middle.'
    },
    {
      title: 'Why a tempered fifth beats',
      q: 'On a piano, A is 220 Hz and the E above it is seven semitones higher. Which harmonics nearly coincide, and how fast do they beat?',
      steps: [
        'E = $220 \\times 2^{7/12} = 329.63$ Hz, a little below the pure fifth $220 \\times 1.5 = 330$ Hz.',
        'The third harmonic of A is 660 Hz; the second harmonic of E is 659.26 Hz.',
        'They beat at $660 - 659.26 = 0.74$ times a second — a slow, gentle waver.'
      ],
      a: 'About 0.74 beats per second, between 660 Hz and 659.26 Hz.'
    }
  ],
  quiz: [
    { q: 'A square wave contains…', choices: ['only odd harmonics, falling as 1/n', 'all harmonics, falling as 1/n', 'only even harmonics', 'only the fundamental'], a: 0, why: 'b_n = 4A/(πn) for odd n and 0 for even n.' },
    { q: 'Adding more and more terms to the Fourier series of a square wave makes the overshoot at the jumps disappear.', a: false, why: 'The overshoot stays about 9 % of the jump (Gibbs phenomenon); it just gets narrower.' },
    { q: 'Why do a flute and a violin playing the same A sound different?', choices: ['different mixtures of the same harmonics', 'different fundamental frequencies', 'the violin has no harmonics', 'different speeds of sound'], a: 0, why: 'Same period, so same harmonic frequencies; the sizes of the harmonics (and how they start and decay) differ.' },
    { q: 'What is the frequency ratio of a pure (just) fifth?', choices: ['3/2', '4/3', '2', '5/4'], a: 0, why: 'The third harmonic of the lower note then coincides with the second of the upper.' },
    { q: 'A wave has harmonics of amplitude 3 and 4 (and nothing else). What is its mean square, in the same units squared?', answer: 12.5, why: 'Energy theorem: ½(3² + 4²) = 12.5.' }
  ],
  problems: [
    { q: 'A sawtooth has its fundamental at amplitude 1. What is the amplitude of its 4th harmonic?', answer: 0.25, tol: 0.01, hint: 'Sawtooth harmonics fall as 1/n.',
      steps: ['For a sawtooth, $b_n \\propto 1/n$: the 4th harmonic is 1/4 of the fundamental.'] },
    { q: 'What frequency is 12 semitones below 440 Hz on an equal-tempered keyboard?', answer: 220, unit: 'Hz', tol: 0.01, hint: 'Twelve semitones make an octave.',
      steps: ['$f = 440 \\times 2^{-12/12} = 220$ Hz.'] }
  ],
  applications: [
    'Audio compression (MP3, AAC) stores sound as the amplitudes of its frequency components, dropping those the ear cannot hear.',
    'Synthesizers build sounds by adding harmonics (additive synthesis) or filtering harmonic-rich waves (subtractive synthesis).',
    'Engineers measure the distortion of amplifiers by the harmonics a pure sine acquires in passing through.',
    'Fourier analysis is used everywhere: vibration monitoring of machines, speech recognition, image compression (JPEG), spectroscopy.'
  ],
  history: 'The Pythagoreans linked consonance to simple ratios of string lengths. Joseph Fourier claimed in 1807 (published 1822) that any function can be expanded in sines, while studying heat flow. Georg Simon Ohm (1843) and Hermann von Helmholtz (*On the Sensations of Tone*, 1863) argued that the ear analyses sounds into their harmonics. J. Willard Gibbs described the persistent overshoot in 1899, after Albert Michelson\'s harmonic analyser had shown it.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 50 (Harmonics) — musical tones, the Fourier series, quality and consonance, the Fourier coefficients, the energy theorem, nonlinear responses.',
    'Vol. I, ch. 49 (Modes) — the modes whose frequencies are the harmonics.',
    'Vol. I, ch. 25 (Linear Systems and Review) — why a linear system can be analysed one frequency at a time.'
  ],
  sim: 'osc-fourier'
},

{
  id: 'waves-feyn', parent: 'waves-sound', title: 'Bow waves, shock waves and surface waves', level: 2,
  short: 'A source moving faster than its waves leaves them behind on the surface of a cone, sin θ = c/v: the Mach cone of a supersonic plane, a bullet or a Cherenkov electron. A boat on deep water is different: its wake always fills a wedge of 19.5°, whatever its speed, because water waves disperse. Strong sound steepens into shocks.',
  keywords: ['bow wave', 'shock wave', 'Mach cone', 'Mach number', 'sonic boom', 'Doppler effect', 'Kelvin wake', 'wake angle', 'Cherenkov radiation', 'surface waves', 'ripples', 'capillary waves', 'seismic waves', 'P and S waves'],
  prereq: ['wave-equation-sound', 'beats-feyn', 'physics:shock-waves'],
  related: ['physics:doppler-effect', 'radiation-accelerated-charge', 'flow-of-dry-water', 'modes-feyn', 'elasticity-feyn'],
  body: `
Feynman's last lecture on waves looks at what happens when the thing making the waves moves — bow waves and shock waves — and then at waves in solids and on the surface of water. This page adds one more classic: the surprising geometry of a ship's wake.

### A source outrunning its waves
A source moving at speed $v$ sends out a wavelet from every point it passes; each spreads as a circle (in space, a sphere) at the wave speed $c$. If $v < c$, the wavelets crowd together ahead of it and spread out behind: the pitch is higher ahead and lower behind (the Doppler effect, $f' = f/(1 \\mp v/c)$). If $v > c$, the source is always ahead of its own wavelets. They all lie inside a **cone**, and on its surface, their common tangent, they arrive together. From the right triangle of one wavelet — radius $ct$, while the source went $vt$ — the half-angle of the cone is

$$\\sin\\theta = \\frac{c}{v} = \\frac{1}{M}$$

where $M = v/c$ is the Mach number (see [[?sine-cosine]]). An aircraft at Mach 2 carries a cone of half-angle 30°; a rifle bullet at 900 m/s, about 22°. **In the simulation**, push the speed through Mach 1 and watch the wavelets pile up into the cone.

### Why a shock is sharp
Ordinary sound obeys a linear equation, but a strong compression heats the air, and in hotter air sound runs faster. So the high-pressure part of a strong wave overtakes the part in front of it; the front steepens until it is an almost sudden jump in pressure — a **shock wave**, moving faster than sound. The cone behind a supersonic aircraft is a shock; sweeping over the ground it is heard as a sonic boom, usually a double bang, from the nose shock and the tail shock.

### Light doing the same: Cherenkov radiation
In water light travels at $c/n = 0.75c$, and a fast electron can go faster than that. It then leaves a cone of light — the blue glow in the water around a nuclear reactor. The light goes out at an angle with $\\cos\\theta = c/(nv)$ to the path: about 41° for electrons close to the speed of light.

| Moving thing | its speed | wave speed | angle |
|---|---|---|---|
| Aircraft at Mach 2 | $2c$ | $c$ | cone half-angle 30° |
| Rifle bullet | 900 m/s | 343 m/s | cone half-angle 22° |
| Fast electron in water | ≈ $c$ | $0.75c$ | light at 41° to the path |
| Boat on deep water | any | dispersive | wake half-angle 19.5°, always |

### The wake of a ship
Water waves are dispersive ([[beats-feyn]]), and this changes everything. A wave travelling at angle $\\theta$ to the ship's course keeps pace with the ship only if its crests move at $U\\cos\\theta$, which fixes its wavelength. But its energy travels at the *group* velocity, half of that. Follow the energy made at one point the ship passed a time $t$ ago: for every direction it has gone $\\tfrac12 Ut\\cos\\theta$, which traces a circle of radius $Ut/4$ centred $3Ut/4$ behind the ship. The lines from the ship touching all such circles make an angle $\\arcsin(1/3) = 19.47°$ with the course — **Kelvin's wedge**, the same for a duck and for a supertanker. Inside it are transverse waves, $2\\pi U^2/g$ long (16 m at 5 m/s), and diverging waves along the edges.

### Ripples and waves in solids
For short waves surface tension adds to gravity: $v^2 = g\\lambda/2\\pi + 2\\pi\\sigma/\\rho\\lambda$. The speed has a minimum, 23 cm/s at a wavelength of 1.7 cm; a fishing line in a slow stream makes short ripples upstream (where the fast-moving short waves can keep ahead) and longer gravity waves downstream. In solids there are two kinds of wave — longitudinal, like sound, and transverse, a shearing — with different speeds: in an earthquake the P waves arrive first, the S waves later, and the delay tells the distance.

> [!key] A source faster than its waves makes a cone with $\\sin\\theta = c/v$; strong compressions steepen into shocks. On deep water the wake is always a 19.5° wedge, because the energy of water waves travels at half the speed of their crests.
`,
  ideas: [
    'A source slower than its waves crowds them ahead (Doppler); faster than its waves, it leaves them on a cone with sin θ = c/v = 1/M.',
    'Strong compressions travel faster than weak ones (the air is hotter), so a strong wave steepens into a shock.',
    'Charges faster than light in a medium emit Cherenkov light at cos θ = c/(nv).',
    'Behind anything moving on deep water, the wake fills a wedge of 19.47° (arcsin 1/3), whatever the speed, because the group velocity is half the phase velocity.',
    'Surface waves are slowest (23 cm/s) at 1.7 cm; solids carry both longitudinal and transverse waves at different speeds.'
  ],
  pitfalls: [
    'A sonic boom happens only at the moment the aircraft breaks the sound barrier — The shock cone travels with the aircraft all the time it is supersonic, sweeping a "boom carpet" along the ground.',
    'A faster boat makes a wider wake — The Kelvin wedge is 19.5° at any speed on deep water; faster boats make longer waves, not a wider wedge.',
    'Nothing can go faster than light, so Cherenkov radiation is impossible — Nothing goes faster than light in vacuum; in water light is slowed to 0.75c, and particles can beat that.'
  ],
  formulas: [
    {
      name: 'Mach angle',
      expr: 'sin(theta) = c/v', tex: '\\sin\\theta = \\dfrac{c}{v}',
      vars: {
        theta: { name: 'half-angle of the cone', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        c: { name: 'wave speed (sound)', q: 'speed', unit: 'm/s', value: 343 },
        v: { name: 'speed of the source', q: 'speed', unit: 'm/s', value: 686 }
      },
      solveFor: 'theta',
      note: 'Only for v > c. The Mach number is M = v/c, so sin θ = 1/M.',
      stories: {
        theta: 'An aircraft flies at {v} where sound travels at {c}. What is the half-angle of its shock cone?',
        v: 'A shock cone has a half-angle of {theta} in air where sound travels at {c}. How fast is the projectile?'
      }
    },
    {
      name: 'Doppler effect: a source coming towards you',
      expr: 'fo = f/(1 - v/c)', tex: 'f\' = \\dfrac{f}{1 - v/c}',
      vars: {
        fo: { name: 'frequency heard', q: 'frequency', unit: 'Hz', tex: 'f\'' },
        f: { name: 'frequency emitted', q: 'frequency', unit: 'Hz', value: 440 },
        v: { name: 'speed of the source towards you', q: 'speed', unit: 'm/s', value: 30, signed: true },
        c: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343 }
      },
      note: 'Listener at rest in still air. For a receding source put in a negative v. As v → c the wavelets pile up.',
      stories: { fo: 'A car sounding {f} drives towards you at {v}. What pitch do you hear (sound at {c})?' }
    },
    {
      name: 'Transverse waves behind a ship',
      expr: 'lambda = 2*pi*U^2/g', tex: '\\lambda = \\dfrac{2\\pi U^2}{g}',
      vars: {
        lambda: { name: 'wavelength of the transverse wake waves', q: 'length', unit: 'm', tex: '\\lambda' },
        U: { name: 'speed of the ship', q: 'speed', unit: 'm/s', value: 5 },
        g: { const: 'g' }
      },
      note: 'Deep water: these waves have phase speed U, so they keep pace with the ship.',
      stories: {
        lambda: 'A boat moves at {U} on deep water. How far apart are the crests of the waves following it?',
        U: 'The transverse waves behind a ship are {lambda} apart. How fast is it going?'
      }
    },
    {
      name: 'Speed of water waves with surface tension',
      expr: 'v = sqrt(g*lambda/(2*pi) + 2*pi*sigma/(rho*lambda))', tex: 'v = \\sqrt{\\dfrac{g\\lambda}{2\\pi} + \\dfrac{2\\pi\\sigma}{\\rho\\lambda}}',
      vars: {
        v: { name: 'phase velocity', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        lambda: { name: 'wavelength', q: 'length', unit: 'cm', value: 1.7, tex: '\\lambda' },
        sigma: { name: 'surface tension', q: 'surfacetension', unit: 'N/m', value: 0.0728, tex: '\\sigma' },
        rho: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' }
      },
      note: 'Deep water. Long waves are gravity waves, short ones capillary ripples; the speed is least, about 23 cm/s, near 1.7 cm.',
      stories: { v: 'How fast do water waves {lambda} long travel (surface tension {sigma})?' }
    }
  ],
  derivation: {
    title: 'Kelvin\'s wake angle',
    steps: [
      { text: 'In the ship\'s frame the wave pattern is steady. A wave whose crests make an angle θ with the course is steady only if its crests move at the ship\'s speed resolved along their direction:', tex: 'v_p(\\theta) = U\\cos\\theta' },
      { text: 'On deep water the energy moves at the group velocity, half the phase velocity:', tex: 'v_g(\\theta) = \\tfrac12\\,U\\cos\\theta' },
      { text: 'Energy made at the point P where the ship was a time t ago has travelled ½Ut cos θ in direction θ. As θ varies, these points trace a circle through P with diameter ½Ut along the course (in polar form, r = d cos θ is a circle of diameter d).', tex: 'r(\\theta) = \\tfrac12\\,Ut\\cos\\theta' },
      { text: 'The ship is now Ut ahead of P, so the circle\'s centre is ¾Ut behind the ship and its radius is ¼Ut. The line from the ship just touching the circle makes an angle α with the course:', tex: '\\sin\\alpha = \\frac{Ut/4}{3Ut/4} = \\frac13 \\quad\\Rightarrow\\quad \\alpha = 19.47°' },
      { text: 'Every earlier point gives a larger circle in the same proportion, so all the wave energy lies inside this wedge, whatever U is.' }
    ]
  },
  examples: [
    {
      title: 'A supersonic jet overhead',
      q: 'A jet flies at Mach 2 at a height of 10 km. How long after it passes directly overhead do you hear the boom? (Take sound at 300 m/s throughout.)',
      steps: [
        'Cone half-angle: $\\sin\\theta = 1/2$, $\\theta = 30°$. Jet speed $v = 600$ m/s.',
        'The cone reaches you when the jet is a distance $h/\\tan\\theta = 10/\\tan 30° = 17.3$ km past you.',
        'That takes $17\\,300/600 = 29$ s.'
      ],
      a: 'About half a minute after it passes overhead.'
    },
    {
      title: 'The pitch of a passing car',
      q: 'A car horn sounds 440 Hz and the car drives at 30 m/s (108 km/h). What pitches do you hear as it approaches and as it recedes?',
      steps: [
        'Approaching: $f\' = 440/(1 - 30/343) = 482$ Hz.',
        'Receding: $f\' = 440/(1 + 30/343) = 405$ Hz.',
        'The drop, a factor 1.19, is about three semitones.'
      ],
      a: '482 Hz, then 405 Hz.'
    }
  ],
  quiz: [
    { q: 'A plane speeds up from Mach 1.5 to Mach 3. Its shock cone…', choices: ['becomes narrower', 'becomes wider', 'stays the same', 'disappears'], a: 0, why: 'sin θ = 1/M: from 41.8° to 19.5°.' },
    { q: 'A speedboat doubles its speed on deep water. The angle of its wake…', choices: ['stays at about 19.5°', 'halves', 'doubles', 'becomes 30°'], a: 0, why: 'Kelvin\'s wedge does not depend on speed; the waves get four times longer instead.' },
    { q: 'The sonic boom is heard only once, at the moment the aircraft passes Mach 1.', a: false, why: 'The cone is attached to the aircraft for as long as it flies supersonically, and sweeps across the ground.' },
    { q: 'Why does a strong pressure wave in air steepen into a shock?', choices: ['compressed, heated air carries sound faster, so the back catches up the front', 'friction slows the front', 'the wave reflects from the ground', 'the frequency increases'], a: 0, why: 'The speed of sound grows with temperature, and the compressed parts are hotter.' },
    { q: 'A bullet\'s shock cone has a half-angle of 30° in air where sound travels at 340 m/s. How fast is the bullet (m/s)?', answer: 680, unit: 'm/s', why: 'v = c/sin θ = 340/0.5 = 680 m/s.' }
  ],
  problems: [
    { q: 'A boat\'s transverse wake waves are 10 m apart on deep water. How fast is the boat moving?', answer: 3.95, unit: 'm/s', tol: 0.02, hint: 'λ = 2πU²/g.',
      steps: ['$U = \\sqrt{g\\lambda/2\\pi} = \\sqrt{9.81 \\times 10/2\\pi} = 3.95$ m/s (about 14 km/h).'] },
    { q: 'What is the half-angle of the shock cone of an aircraft at Mach 1.2?', answer: 56.4, unit: '°', tol: 0.01, hint: 'sin θ = 1/M.',
      steps: ['$\\theta = \\arcsin(1/1.2) = 56.4°$.'] }
  ],
  applications: [
    'Supersonic aircraft are shaped to weaken their shock waves; overland supersonic flight is restricted in many countries because of the boom.',
    'Cherenkov detectors (such as Super-Kamiokande) find neutrinos by the cones of light from the fast particles they produce.',
    'Hull designers use the Kelvin pattern and the wave resistance it implies; fast boats plane to escape it.',
    'Seismologists locate earthquakes from the delay between the P and S waves at several stations.'
  ],
  history: 'Christian Doppler proposed his effect in 1842. Ernst Mach and Peter Salcher photographed the shock waves of supersonic bullets in 1886. Lord Kelvin explained the ship\'s wake angle in 1887. Pavel Cherenkov observed the glow named after him in 1934; Ilya Frank and Igor Tamm explained it in 1937, and the three shared the 1958 Nobel Prize. Chuck Yeager first flew faster than sound in level flight on 14 October 1947.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 51 (Waves) — bow waves, shock waves, waves in solids, surface waves.',
    'Vol. I, ch. 47 (Sound. The wave equation) — the speed of sound, on which the Mach angle depends.',
    'Vol. I, ch. 48 (Beats) — the group velocity that shapes the wake of a ship.'
  ],
  sim: 'osc-wake'
}

);
