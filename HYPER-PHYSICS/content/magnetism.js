/* HYPER-PHYSICS · content/magnetism.js — magnetic fields, the forces they exert on
 * moving charges and currents, and the currents that make them. */
Hyper.add(

{
  id: 'magnetic-field', parent: 'magnetism', title: 'Magnetic field', level: 1,
  short: 'The field around magnets and currents that pushes on moving charges. It is measured in tesla and drawn as field lines that always close on themselves.',
  keywords: ['magnetic field', 'B field', 'tesla', 'gauss', 'field lines', 'north pole', 'south pole', 'compass', 'Earth\'s magnetic field', 'magnetic dipole', 'bar magnet', 'inclination', 'dip angle'],
  prereq: ['electric-field', 'electric-current', 'math:scalar-vector-fields'],
  related: ['magnetic-materials', 'lorentz-force', 'field-of-wire', 'magnetic-flux', 'maxwells-equations'],
  body: `
Sprinkle iron filings on a sheet of card over a bar magnet and they line up in curved chains running from one end of the magnet to the other. A small compass placed anywhere on the card turns to lie along those chains. Both are tracing the **magnetic field** $\\vec B$: at every point in space it has a size and a direction, the direction a compass needle's north end points.

### Poles and field lines
The ends of a magnet where the filings crowd together are its **poles**. By convention the field lines leave the **north** pole and re-enter at the **south** pole — and then carry on *through* the magnet back to the north pole. Magnetic field lines never begin or end: they always form **closed loops**. Like poles repel and unlike poles attract, just as with charges, but with one enormous difference: nobody has ever found an isolated north or south pole (a magnetic **monopole**). Snap a magnet in half and you get two complete magnets, each with both poles.

Mathematically, the net flux of $\\vec B$ out of any closed surface is zero, $\\oint \\vec B\\cdot d\\vec A = 0$ — the magnetic version of [[gauss-law|Gauss's law]] with no "magnetic charge" inside (see [[magnetic-flux]]).

### Where magnetic fields come from
Every magnetic field is made by **moving charge**. A current in a wire makes a field that circles the wire ([[field-of-wire]]); a coil of wire makes a field like a bar magnet's ([[solenoid]]). Permanent magnets owe their fields to electrons, each of which carries a tiny built-in magnetic moment linked to its [[electron-spin|spin]]; in iron, cobalt and nickel these moments line up by the billion (see [[magnetic-materials]]).

### Measuring it: the tesla
The field is *defined* by the force it exerts on a moving charge ([[lorentz-force]]): a charge $q$ crossing the field at speed $v$ feels $F = qvB\\sin\\theta$. So $B = F/(qv\\sin\\theta)$ and the SI unit, the **tesla**, is $1\\ \\mathrm{T} = 1\\ \\mathrm{N/(A\\cdot m)}$. The older unit, still common, is the gauss: $1\\ \\mathrm{G} = 10^{-4}\\ \\mathrm{T}$.

| Source | Field |
|---|---|
| Human brain, measured outside the skull | about $10^{-13}$ T |
| Earth's surface | 25–65 µT |
| 1 cm from a wire carrying 10 A | 200 µT |
| Fridge magnet, at its surface | a few mT |
| Face of a neodymium magnet | about 0.5 T |
| Hospital MRI scanner | 1.5–3 T |
| Strongest steady laboratory fields | about 45 T |
| Surface of a magnetar (neutron star) | up to $10^{11}$ T |

### Far from a magnet
Seen from a distance, a small magnet or a current loop is a **magnetic dipole** with moment $m$ (in A·m²). Along its axis its field is

$$B = \\frac{\\mu_0\\, m}{2\\pi z^3}$$

— it falls with the **cube** of the distance, which is why magnets snap together only when they are close. Here $\\mu_0 \\approx 1.2566\\times10^{-6}\\ \\mathrm{N/A^2}$ is the permeability of free space, the constant that sets the strength of all magnetic effects.

### The Earth as a magnet
The Earth's field is roughly that of a dipole tilted about 10° from the rotation axis. The pole in the Arctic attracts the north end of every compass, so magnetically it is a *south* pole. Away from the equator the field also dips into the ground: in Britain it points about 66° below the horizontal, and a compass responds only to the horizontal part, about 20 µT.

> [!key] A magnetic field acts only on moving charges and on magnetic moments. A charge at rest in a magnetic field feels no force at all.
`,
  ideas: [
    'Magnetic fields are made by moving charges — currents — and by the built-in magnetic moments of particles such as electrons.',
    'The field is defined by its force on a moving charge; its unit is the tesla, 1 T = 1 N/(A·m).',
    'Field lines run from N to S outside a magnet, continue inside, and always close: there are no magnetic monopoles.',
    'Far from a small magnet the field falls off as 1/r³.'
  ],
  pitfalls: [
    'Magnetic poles can be separated like positive and negative charges — No isolated pole has ever been found. Cut a magnet and each piece has both poles; field lines always close on themselves.',
    'The Earth\'s north magnetic pole is a north pole — The pole in the Arctic attracts the north end of a compass, so magnetically it is a south pole. The name follows geography.',
    'A magnetic field pushes on any charge — Only on moving charges. A charge at rest in a steady magnetic field feels nothing.'
  ],
  formulas: [
    {
      name: 'Field on the axis of a small magnet (dipole)',
      expr: 'B = mu0*m/(2*pi*z^3)', tex: 'B = \\frac{\\mu_0\\, m}{2\\pi z^3}',
      vars: {
        B: { name: 'magnetic field on the axis', q: 'bfield', unit: 'mT' },
        mu0: { const: 'mu0' },
        m: { name: 'magnetic moment of the magnet', q: 'mdipole', unit: 'A·m²', value: 1 },
        z: { name: 'distance along the axis', q: 'length', unit: 'cm', value: 5 }
      },
      note: 'Valid when $z$ is several times the size of the magnet. At the same distance to the side (on the perpendicular bisector) the field is half as big. A 1 cm neodymium cube has $m \\approx 1\\ \\mathrm{A\\,m^2}$.',
      stories: {
        B: 'A small neodymium magnet with magnetic moment {m} sits on a table. What field does it produce {z} away along its axis?',
        z: 'How far along the axis of a magnet of moment {m} must you go before its field falls to {B}?'
      }
    },
    {
      name: 'Horizontal part of the Earth\'s field',
      expr: 'Bh = B*cos(inc)', tex: 'B_h = B\\cos I',
      vars: {
        Bh: { name: 'horizontal component', q: 'bfield', unit: 'µT', tex: 'B_h' },
        B: { name: 'total field', q: 'bfield', unit: 'µT', value: 49 },
        inc: { name: 'inclination (dip below the horizontal)', q: 'angle', unit: '°', value: 66, min: 0, max: 90, tex: 'I' }
      },
      stories: {
        Bh: 'In London the Earth\'s field is {B} and dips at {inc} below the horizontal. What horizontal field does a compass needle feel?',
        inc: 'A magnetometer measures a total field of {B} with a horizontal part of {Bh}. At what angle does the field dip into the ground?'
      }
    }
  ],
  examples: [
    {
      title: 'A compass beside a cable',
      q: 'A compass lies 5.0 cm above a long straight cable running north–south. When 20 A flows, how far does the needle swing? Take the horizontal part of the Earth\'s field as 20 µT.',
      steps: [
        'The cable\'s field at 5 cm (see [[field-of-wire]]): $B = \\dfrac{\\mu_0 I}{2\\pi r} = \\dfrac{(1.257\\times10^{-6})(20)}{2\\pi(0.050)} = 80\\ \\mathrm{\\mu T}$.',
        'Above a north–south wire this field is horizontal and points east or west, at right angles to the Earth\'s horizontal field.',
        'The needle lines up with the sum of the two perpendicular fields: $\\tan\\alpha = 80/20 = 4$, so $\\alpha = 76°$ from north.'
      ],
      a: 'About 76° away from north — the same experiment with which Ørsted discovered electromagnetism in 1820.'
    },
    {
      title: 'How far does a magnet reach?',
      q: 'A small magnet has a magnetic moment of 1.0 A·m². How far along its axis does its field fall to 50 µT, comparable with the Earth\'s?',
      steps: [
        'Rearrange the dipole formula: $z^3 = \\dfrac{\\mu_0 m}{2\\pi B}$.',
        '$z^3 = \\dfrac{(1.257\\times10^{-6})(1.0)}{2\\pi\\,(5.0\\times10^{-5})} = 4.0\\times10^{-3}\\ \\mathrm{m^3}$.',
        '$z = \\sqrt[3]{4.0\\times10^{-3}} = 0.16\\ \\mathrm{m}$.'
      ],
      a: 'About 16 cm. Closer than that the magnet beats the Earth; beyond it a compass hardly notices it.'
    }
  ],
  quiz: [
    { q: 'You snap a bar magnet in half, midway between its poles. What do you get?', choices: ['An isolated N pole and an isolated S pole', 'Two smaller magnets, each with an N and an S pole', 'Two unmagnetised pieces', 'One magnet and one piece of plain iron'], a: 1,
      why: 'The magnetism comes from countless tiny aligned moments throughout the metal, so every piece has both poles. No magnetic monopole has ever been found.' },
    { q: 'The north end of a compass needle points towards the Arctic. So the magnetic pole in the Arctic is…', choices: ['a magnetic north pole', 'a magnetic south pole', 'not a pole at all', 'north in summer and south in winter'], a: 1,
      why: 'Unlike poles attract. The needle\'s north pole is pulled towards it, so it must be a south pole magnetically.' },
    { q: 'Magnetic field lines start on north poles and end on south poles, just as electric field lines start and end on charges.', a: false,
      why: 'Outside a magnet they run from N to S, but they continue through the magnet and close on themselves. They have no start or end.' },
    { q: 'Going twice as far from a small magnet along its axis changes its field by a factor of…', choices: ['1/2', '1/4', '1/8', '1/16'], a: 2,
      why: 'A dipole field falls as $1/z^3$, and $2^3 = 8$.' },
    { q: 'Which of these is closest to 1 tesla?', choices: ['The Earth\'s field at the surface', 'The field 1 cm from a lamp cable', 'The field at the face of a neodymium magnet', 'The field at a magnetar\'s surface'], a: 2,
      why: 'Neodymium magnets reach around 0.5 T at their faces. The Earth manages about 50 µT; a magnetar about $10^{11}$ T.' }
  ],
  applications: [
    'Compasses and the magnetometers in phones.',
    'MRI scanners, which use a strong steady field of 1.5–3 T.',
    'Magnetic data storage: every bit on a hard disk is a tiny magnetised region.',
    'Steering charged-particle beams in accelerators and electron microscopes.'
  ],
  history: 'Lodestones and compasses were known for two thousand years, but the link to electricity came in 1820, when Hans Christian Ørsted saw a current deflect a compass needle. The unit is named after Nikola Tesla (1856–1943).',
  sim: { id: 'em2-field-map', params: { source: 'magnet' } }
},

{
  id: 'lorentz-force', parent: 'magnetism', title: 'Magnetic force on a moving charge', level: 2,
  short: 'A charge moving through a magnetic field is pushed sideways, at right angles to both its velocity and the field: F = qv × B.',
  keywords: ['Lorentz force', 'magnetic force', 'qvB', 'right-hand rule', 'cross product', 'moving charge', 'F = qvB sin θ', 'magnetic force does no work'],
  prereq: ['magnetic-field', 'force', 'math:cross-product'],
  related: ['charged-particle-motion', 'force-on-current', 'hall-effect', 'motional-emf', 'electric-field'],
  body: `
An electric field pushes a charge whether it moves or not. A magnetic field is stranger: it ignores a charge at rest and pushes a moving one **sideways**. The force is

$$\\vec F = q\\,\\vec v \\times \\vec B, \\qquad F = |q|\\,v B\\sin\\theta$$

where $\\theta$ is the angle between the velocity and the field. The [[math:cross-product|cross product]] packs three facts into one symbol:

- **Motion matters.** Double the speed and the force doubles; stop the charge and it vanishes.
- **Only the part of the motion across the field counts.** A charge moving along a field line feels nothing ($\\theta = 0$); one crossing at right angles feels the most, $|q|vB$.
- **The force is perpendicular to both $\\vec v$ and $\\vec B$.**

### Which way?
Point the fingers of your right hand along $\\vec v$ and curl them towards $\\vec B$: your thumb points along $\\vec v\\times\\vec B$, the direction of the force on a **positive** charge. For a negative charge — an electron — the force is the opposite way. Example: an electron moving east through a field pointing north. East × north is up, so a positive charge would be pushed up and the electron is pushed **down**.

### No work, ever
Because the force is always perpendicular to the velocity, it does no [[work]]: $\\vec F\\cdot\\vec v = 0$. A static magnetic field can bend a particle's path but can never change its speed or its [[kinetic-energy|kinetic energy]]. Particle accelerators use electric fields to speed particles up and magnets only to steer them.

### The full Lorentz force
With both fields present,

$$\\vec F = q\\left(\\vec E + \\vec v\\times\\vec B\\right)$$

This one line, with [[maxwells-equations|Maxwell's equations]] for the fields, contains all of classical electromagnetism.

### Sizes
A proton in the Earth's field (50 µT) moving at $3\\times10^6$ m/s feels $2.4\\times10^{-17}$ N — tiny, but more than a billion times its weight. That is why charged particles from space follow the Earth's field lines, not gravity, and why [[charged-particle-motion|they spiral]] down towards the poles to make auroras.

> [!note] Which part of a force is "magnetic" depends on who is watching: in a frame moving with the charge it is at rest and feels no magnetic force at all, yet it is still pushed — by an electric field. Puzzles like this led Einstein to [[relativity-postulates|special relativity]].
`,
  ideas: [
    'F = qv × B: the force is perpendicular to both the velocity and the field.',
    'Its size is |q|vB sin θ — zero for motion along the field, largest for motion across it.',
    'Positive and negative charges moving the same way are pushed in opposite directions.',
    'The magnetic force does no work: it changes the direction of motion, never the speed.',
    'With an electric field as well, F = q(E + v × B) is the Lorentz force.'
  ],
  pitfalls: [
    'The magnetic force points along the field lines — It is perpendicular to both the field and the velocity. A compass needle lines up with the field; a moving charge is pushed across it.',
    'Using the right-hand rule for an electron without reversing the answer — The rule gives the force on a positive charge. For negative charges the force points the other way.',
    'A stronger magnetic field makes a particle go faster — The force is always sideways, so it bends the path without changing the speed.'
  ],
  formulas: [
    {
      name: 'Magnetic force on a moving charge',
      expr: 'F = q*v*B*sin(theta)', tex: 'F = q\\,v B\\sin\\theta',
      vars: {
        F: { name: 'magnetic force', q: 'force', unit: 'N' },
        q: { name: 'size of the charge', q: 'charge', unit: 'e', value: 1 },
        v: { name: 'speed', q: 'speed', unit: 'km/s', value: 2000 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'mT', value: 1 },
        theta: { name: 'angle between velocity and field', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      note: 'Gives the size of the force; its direction is along $\\vec v\\times\\vec B$ for a positive charge and opposite for a negative one.',
      stories: {
        F: 'An electron (charge {q}) moves at {v} at {theta} to a magnetic field of {B}. What force acts on it?',
        v: 'A particle of charge {q} feels a force of {F} as it crosses a {B} field at {theta}. How fast is it moving?',
        B: 'An ion of charge {q} moving at {v} at {theta} to a magnetic field feels a force of {F}. How strong is the field?'
      }
    }
  ],
  examples: [
    {
      title: 'A proton in the Earth\'s field',
      q: 'A proton moving at $3.0\\times10^6$ m/s crosses the Earth\'s field (50 µT) at right angles. Compare the magnetic force on it with its weight.',
      steps: [
        'Magnetic force: $F = qvB = (1.60\\times10^{-19})(3.0\\times10^6)(5.0\\times10^{-5}) = 2.4\\times10^{-17}\\ \\mathrm{N}$.',
        'Weight: $mg = (1.67\\times10^{-27})(9.81) = 1.6\\times10^{-26}\\ \\mathrm{N}$.',
        'Ratio: $2.4\\times10^{-17} / 1.6\\times10^{-26} \\approx 1.5\\times10^{9}$.'
      ],
      a: 'The magnetic force is about 1.5 billion times the weight — gravity is irrelevant for charged particles in space.'
    },
    {
      title: 'Finding the direction',
      q: 'An electron moves due east through a horizontal magnetic field that points due north. Which way is it pushed?',
      steps: [
        'Take east as $x$, north as $y$ and up as $z$. Then $\\vec v\\times\\vec B$ points along $\\hat x\\times\\hat y = \\hat z$: up.',
        'That is the force on a positive charge. The electron is negative, so its force is reversed.'
      ],
      a: 'Straight down.'
    }
  ],
  quiz: [
    { q: 'A magnetic field does no work on a moving charge because…', choices: ['the field is too weak', 'the force is always perpendicular to the velocity', 'the charge moves too fast', 'magnetic forces are not real forces'], a: 1,
      why: 'Work is $\\vec F\\cdot d\\vec s$. A force at right angles to the motion has no component along it, so it transfers no energy.' },
    { q: 'A proton and an electron move side by side at the same velocity across the same field. The magnetic forces on them are…', choices: ['identical', 'equal in size and opposite in direction', 'in the same direction, but 1836 times smaller for the electron', 'zero for the electron'], a: 1,
      why: 'The force depends on the charge, not the mass. Their charges are equal and opposite, so are the forces. (Their accelerations are very different.)' },
    { q: 'A charged particle moves exactly parallel to a magnetic field. The magnetic force on it is…', choices: ['as large as possible', 'zero', 'along the field', 'opposite to its velocity'], a: 1,
      why: 'With $\\theta = 0$, $\\sin\\theta = 0$: motion along the field feels no magnetic force.' },
    { q: 'A steady magnetic field can speed up a slowly moving charged particle.', a: false,
      why: 'The force is always perpendicular to the velocity, so the speed stays constant. Only an electric field (or a changing magnetic field, which makes one) can change it.' },
    { q: 'Roughly what force acts on an electron moving at $10^7$ m/s at right angles to a 1 mT field?', choices: ['$1.6\\times10^{-15}$ N', '$1.6\\times10^{-12}$ N', '$1.6\\times10^{-19}$ N', '$1.6\\times10^{-9}$ N'], a: 0,
      why: '$F = evB = (1.6\\times10^{-19})(10^7)(10^{-3}) = 1.6\\times10^{-15}$ N.' }
  ],
  applications: [
    'Steering electron beams in electron microscopes (and in old television tubes).',
    'Mass spectrometers, which sort ions by how sharply a field bends them.',
    'Auroras, where solar-wind particles are guided down the Earth\'s field lines.',
    'Hall-effect sensors in phones and cars.'
  ],
  history: 'Oliver Heaviside worked out the magnetic force on a moving charge in 1889; Hendrik Lorentz wrote the combined electric and magnetic force in 1895 as part of his theory of the electron.',
  sim: 'em2-charged-particle'
},

{
  id: 'charged-particle-motion', parent: 'magnetism', title: 'Charged particles in a magnetic field', level: 2,
  short: 'In a uniform magnetic field a charge moves in a circle — or a helix — whose radius grows with momentum and whose period does not depend on the speed at all.',
  keywords: ['cyclotron', 'cyclotron frequency', 'radius of curvature', 'r = mv/qB', 'helix', 'pitch', 'mass spectrometer', 'velocity selector', 'crossed fields', 'E cross B drift', 'magnetic bottle', 'aurora', 'Van Allen belts'],
  prereq: ['lorentz-force', 'uniform-circular-motion', 'centripetal-force'],
  related: ['particle-accelerators', 'hall-effect', 'relativistic-momentum'],
  body: `
Fire a charged particle across a uniform magnetic field. The force $qvB$ is always perpendicular to the velocity and never changes the speed — exactly the recipe for [[uniform-circular-motion|uniform circular motion]]. The magnetic force supplies the [[centripetal-force|centripetal force]]:

$$|q| v B = \\frac{m v^2}{r} \\quad\\Rightarrow\\quad r = \\frac{m v}{|q| B} = \\frac{p}{|q| B}$$

A heavier or faster particle (more momentum) swings round a wider circle; a stronger field or a bigger charge tightens it. Positive and negative charges circle in opposite senses.

### A clock that ignores speed
The time for one lap is the circumference over the speed:

$$T = \\frac{2\\pi r}{v} = \\frac{2\\pi m}{|q| B}, \\qquad f = \\frac{|q| B}{2\\pi m}$$

The speed has cancelled. A fast particle runs round a bigger circle in exactly the same time as a slow one. This **cyclotron frequency** is 28 GHz per tesla for electrons and 15.2 MHz per tesla for protons. It is what made Lawrence's cyclotron work: an alternating voltage at one fixed frequency kicks the particles every half turn while they spiral outward (see [[particle-accelerators]]).

### Helices
If the velocity has a component $v_\\parallel$ along the field, that part feels no force and carries on unchanged, while the perpendicular part $v_\\perp$ goes round in a circle of radius $m v_\\perp/|q|B$. Together they make a **helix** wound around the field line, advancing a **pitch** $p = v_\\parallel T$ each turn. Charged particles are therefore tied to field lines: they can slide along them but not easily cross them. Where the lines crowd together the particles are reflected — a **magnetic mirror**. The Earth's field traps particles this way in the Van Allen belts, and those that leak down near the poles light up the **aurora**.

### Crossed fields
Add an electric field at right angles to both $\\vec v$ and $\\vec B$. The electric force $qE$ and the magnetic force $qvB$ point in opposite directions and balance when

$$v = \\frac{E}{B}$$

Particles at exactly this speed fly straight; faster ones are bent one way, slower ones the other. This **velocity selector** picks out one speed whatever the particle's mass or charge. Send the selected ions into a region of pure magnetic field and each follows a semicircle of radius $mv/qB$: the heavier ions land farther out. That is the **mass spectrometer**, which can separate isotopes differing by a single neutron.

A particle starting from rest in crossed fields does not simply fall along $\\vec E$; it loops along in a cycloid, drifting at speed $E/B$ perpendicular to *both* fields, whatever its charge. Try it in the simulation.

> [!note] At speeds near light, $r = p/|q|B$ still holds with the [[relativistic-momentum|relativistic momentum]], but the period grows with energy. Modern accelerators (synchrotrons) therefore raise the field as the particles gain energy, keeping them on a fixed ring.
`,
  ideas: [
    'In a uniform field, a charge moving across the field goes round a circle of radius r = mv/|q|B = p/|q|B.',
    'The period T = 2πm/|q|B does not depend on the speed or the radius.',
    'Motion along the field is unaffected, so the general path is a helix wound round the field lines.',
    'Crossed E and B fields let through only particles with v = E/B: a velocity selector.'
  ],
  pitfalls: [
    'A faster particle takes longer to go round — Its circle is larger in proportion to its speed, so the period 2πm/|q|B is exactly the same.',
    'The magnetic force slows the particle as it circles — The force is perpendicular to the motion, so the speed stays constant. Real particles slow down only through collisions or by radiating.',
    'A velocity selector picks out particles of one mass — It passes one speed, v = E/B, whatever the mass or the charge.'
  ],
  formulas: [
    {
      name: 'Radius of the circular path',
      expr: 'r = m*v/(q*B)', tex: 'r = \\frac{m v}{q B}',
      vars: {
        r: { name: 'radius of the path', q: 'length', unit: 'cm' },
        m: { name: 'mass of the particle', q: 'mass', unit: 'u', value: 1.007 },
        v: { name: 'speed across the field', q: 'speed', unit: 'km/s', value: 100 },
        q: { name: 'size of the charge', q: 'charge', unit: 'e', value: 1 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'mT', value: 10 }
      },
      note: 'For motion at right angles to the field. For a helix use the perpendicular part of the velocity. A proton is 1.007 u; an electron 0.000549 u.',
      stories: {
        r: 'A proton ({m}, charge {q}) enters a {B} field at {v}, at right angles to it. What is the radius of its path?',
        B: 'What field bends ions of mass {m} and charge {q} moving at {v} into a circle of radius {r}?',
        m: 'Ions of charge {q} moving at {v} follow a circle of radius {r} in a {B} field. What is their mass?'
      }
    },
    {
      name: 'Cyclotron frequency',
      expr: 'f = q*B/(2*pi*m)', tex: 'f = \\frac{q B}{2\\pi m}',
      vars: {
        f: { name: 'orbit frequency', q: 'frequency', unit: 'GHz' },
        q: { name: 'size of the charge', q: 'charge', unit: 'e', value: 1 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 },
        m: { name: 'mass of the particle', q: 'mass', unit: 'kg', value: 9.109e-31 }
      },
      note: 'Independent of speed (below relativistic speeds). Default values: an electron in 1 T.',
      stories: {
        f: 'Electrons ({m}, charge {q}) circle in a {B} field. At what frequency do they go round?',
        B: 'Plasma heating uses microwaves at {f} in resonance with circling electrons ({m}, charge {q}). What magnetic field is needed?'
      }
    },
    {
      name: 'Velocity selector',
      expr: 'v = E/B',
      vars: {
        v: { name: 'speed that passes undeflected', q: 'speed', unit: 'km/s' },
        E: { name: 'electric field', q: 'efield', unit: 'kV/m', value: 20 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'mT', value: 50 }
      },
      note: 'The fields must be at right angles to each other and to the beam, arranged so that the electric and magnetic forces oppose.',
      stories: {
        v: 'In a velocity selector the electric field is {E} and the magnetic field {B}. Which speed passes straight through?',
        E: 'A selector with a {B} magnetic field must pass ions at {v}. What electric field is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'Separating carbon isotopes',
      q: 'Singly charged ions of carbon-12 (12.000 u) and carbon-13 (13.003 u) leave a velocity selector at $1.0\\times10^5$ m/s and enter a 0.50 T field, where each travels a semicircle and lands on a detector. How far apart do they land?',
      steps: [
        'Carbon-12: $m = 12.000 \\times 1.661\\times10^{-27} = 1.993\\times10^{-26}$ kg, so $r = \\dfrac{mv}{qB} = \\dfrac{(1.993\\times10^{-26})(1.0\\times10^5)}{(1.602\\times10^{-19})(0.50)} = 2.487\\ \\mathrm{cm}$.',
        'Carbon-13: the radius scales with mass, $r = 2.487 \\times 13.003/12.000 = 2.695\\ \\mathrm{cm}$.',
        'Each lands one diameter from the entrance slit, so they are $2(2.695 - 2.487) = 0.42\\ \\mathrm{cm}$ apart.'
      ],
      a: 'About 4 mm apart — easily resolved, which is how isotope ratios (for example in carbon dating) are measured.'
    },
    {
      title: 'An electron spiralling along a field line',
      q: 'An electron with 100 eV of kinetic energy moves at 30° to a 50 µT field. Find the radius, the period and the pitch of its helix.',
      steps: [
        'Speed: $v = \\sqrt{2K/m} = \\sqrt{\\dfrac{2(100)(1.602\\times10^{-19})}{9.109\\times10^{-31}}} = 5.93\\times10^6\\ \\mathrm{m/s}$.',
        'Across the field: $v_\\perp = v\\sin 30° = 2.97\\times10^6$ m/s, so $r = \\dfrac{m v_\\perp}{eB} = \\dfrac{(9.109\\times10^{-31})(2.97\\times10^6)}{(1.602\\times10^{-19})(5.0\\times10^{-5})} = 0.34\\ \\mathrm{m}$.',
        'Period: $T = \\dfrac{2\\pi m}{eB} = 7.1\\times10^{-7}\\ \\mathrm{s}$.',
        'Along the field: $v_\\parallel = v\\cos 30° = 5.14\\times10^6$ m/s, so the pitch is $p = v_\\parallel T = 3.7\\ \\mathrm{m}$.'
      ],
      a: 'A helix 34 cm in radius advancing 3.7 m per turn, about 1.4 million turns a second.'
    }
  ],
  quiz: [
    { q: 'You double the speed of a proton circling in a uniform magnetic field. Its orbital period…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 2,
      why: 'The radius doubles too, so the lap takes the same time: $T = 2\\pi m/qB$ has no $v$ in it.' },
    { q: 'An electron and a proton enter the same field at the same speed. Compared with the proton\'s, the electron\'s circle is…', choices: ['the same size, but circled the other way', 'about 1836 times smaller, circled the other way', 'about 1836 times larger, circled the same way', 'about 43 times smaller, circled the other way'], a: 1,
      why: '$r = mv/qB$: same speed and charge size, but the electron is 1836 times lighter. Its opposite charge reverses the sense of rotation.' },
    { q: 'In a velocity selector, a particle moving faster than $E/B$ is deflected…', choices: ['in the direction of the electric force', 'in the direction of the magnetic force', 'not at all', 'backwards'], a: 1,
      why: 'The magnetic force $qvB$ grows with speed while $qE$ does not, so for $v > E/B$ the magnetic force wins.' },
    { q: 'A charged particle entering a uniform magnetic field at an angle spirals around the field lines, and its speed along the field stays constant.', a: true,
      why: 'The force has no component along $\\vec B$, so $v_\\parallel$ is untouched while $v_\\perp$ goes round in a circle: a helix.' },
    { q: 'Two particles have the same charge and the same momentum, but one is twice as heavy. In the same field, the heavy one\'s radius is…', choices: ['twice as large', 'half as large', 'the same', 'four times as large'], a: 2,
      why: 'The radius depends on momentum: $r = p/qB$. Equal momenta and charges give equal radii (the heavy one simply moves at half the speed).' }
  ],
  applications: [
    'Mass spectrometry: isotope ratios, drug testing, accelerator mass spectrometry for radiocarbon dating.',
    'Cyclotrons that make medical isotopes and proton-therapy beams.',
    'Magnetic confinement of fusion plasmas in tokamaks.',
    'Auroras and the radiation belts around the Earth and Jupiter.'
  ],
  history: 'J. J. Thomson measured the charge-to-mass ratio of the electron in 1897 by balancing electric and magnetic deflections. Ernest Lawrence built the first cyclotron in 1931, a device small enough to hold in one hand.',
  sim: 'em2-charged-particle'
},

{
  id: 'force-on-current', parent: 'magnetism', title: 'Force on a current-carrying wire', level: 1,
  short: 'A wire carrying a current across a magnetic field is pushed sideways with force F = ILB sin θ — the effect behind every electric motor and loudspeaker.',
  keywords: ['motor effect', 'F = BIL', 'force on a conductor', 'Fleming\'s left-hand rule', 'current balance', 'loudspeaker', 'railgun', 'parallel currents', 'definition of the ampere'],
  prereq: ['lorentz-force', 'electric-current'],
  related: ['torque-on-loop', 'field-of-wire', 'motional-emf', 'hall-effect'],
  body: `
A current is a stream of moving charges, and each of them feels the [[lorentz-force|magnetic force]] $q\\vec v\\times\\vec B$. Add up the pushes on all the charges in a length of wire and you get a force on the wire itself:

$$\\vec F = I\\,\\vec L\\times\\vec B, \\qquad F = I L B\\sin\\theta$$

where $\\vec L$ points along the wire in the direction of the current and $\\theta$ is the angle between the wire and the field.

### Why $ILB$
Suppose the wire holds $n$ charge carriers per cubic metre, each of charge $q$, drifting at speed $v_d$ through a cross-section $A$. The current is $I = nqAv_d$ ([[electric-current]]). A length $L$ contains $nAL$ carriers, each pushed with $qv_dB$, so the total is $nAL\\,qv_dB = (nqAv_d)LB = ILB$. The carriers pass the force on to the metal lattice through the small sideways electric field they build up (the [[hall-effect]]).

### Direction
The force is perpendicular to both the wire and the field — the right-hand rule for $\\vec L\\times\\vec B$. British schools also teach **Fleming's left-hand rule**: hold the thumb and first two fingers of the left hand at right angles; **F**irst finger along the **F**ield, se**C**ond finger along the **C**urrent, and the thu**M**b gives the **M**otion (force).

### How big?
One metre of cable carrying 10 A across the Earth's 50 µT field feels $5\\times10^{-4}$ N, the weight of about 50 milligrams. Inside a motor, with $B \\approx 1$ T, 10 A and 10 cm of wire give 1 N — and a motor has hundreds of such lengths of wire.

### Shapes and loops
For a curved wire add up $d\\vec F = I\\,d\\vec l\\times\\vec B$ along it. For any **closed loop in a uniform field** the pushes cancel: the net force is zero. They do not cancel as a twist, though — that [[torque-on-loop|torque]] is how motors turn.

### Two currents
Each wire of a pair sits in the magnetic field of the other. Currents flowing the same way **attract**; opposite currents **repel**. The force on a length $L$ of either wire is $F = \\mu_0 I_1 I_2 L/(2\\pi d)$ (derived on [[field-of-wire]]). Until 2019 this defined the ampere: the current that, in two long wires 1 m apart, gives a force of $2\\times10^{-7}$ N per metre.

> [!tip] Open the simulation with two wires, reverse one current and watch the force arrows flip from attraction to repulsion.
`,
  ideas: [
    'A current-carrying wire in a magnetic field feels F = IL × B, of size ILB sin θ.',
    'The force is perpendicular to both the wire and the field; a wire along the field feels none.',
    'It is the sum of the magnetic forces on all the moving charges in the wire.',
    'Parallel currents attract and opposite currents repel.'
  ],
  pitfalls: [
    'The force points along the field or along the current — It is perpendicular to both. A wire lying along the field lines feels no force at all.',
    'A thicker wire feels a larger force for the same current — Only the current, the length in the field and the angle matter; the thickness does not.'
  ],
  formulas: [
    {
      name: 'Force on a straight wire',
      expr: 'F = I*L*B*sin(theta)', tex: 'F = I L B\\sin\\theta',
      vars: {
        F: { name: 'force on the wire', q: 'force', unit: 'N' },
        I: { name: 'current', q: 'current', unit: 'A', value: 5 },
        L: { name: 'length of wire in the field', q: 'length', unit: 'cm', value: 20 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.4 },
        theta: { name: 'angle between wire and field', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      stories: {
        F: 'A straight wire {L} long carrying {I} lies at {theta} to a {B} field. What force acts on it?',
        I: 'What current must flow in a {L} wire at {theta} to a {B} field for it to feel a force of {F}?',
        B: 'A {L} wire carrying {I} at {theta} to a magnetic field is pushed with {F}. How strong is the field?'
      }
    },
    {
      name: 'Current that makes a horizontal wire float',
      expr: 'I = lambda*g/B', tex: 'I = \\frac{\\lambda g}{B}',
      vars: {
        I: { name: 'current', q: 'current', unit: 'A' },
        lambda: { name: 'mass per metre of the wire', q: 'lindensity', unit: 'g/m', value: 10 },
        g: { const: 'g' },
        B: { name: 'horizontal field across the wire', q: 'bfield', unit: 'T', value: 0.5 }
      },
      note: 'The magnetic force per metre, $IB$, balances the weight per metre, $\\lambda g$. 10 g/m is a copper wire about 1.2 mm thick.',
      stories: { I: 'A wire of {lambda} lies across a horizontal {B} field. What current makes it float?' }
    }
  ],
  examples: [
    {
      title: 'A current balance',
      q: 'A horizontal wire runs for 5.0 cm through the 0.20 T field between the poles of a magnet sitting on a digital balance. When 3.0 A flows, by how much does the balance reading change?',
      steps: [
        'Force on the wire: $F = ILB = (3.0)(0.050)(0.20) = 0.030\\ \\mathrm{N}$.',
        'By [[newtons-third-law|Newton\'s third law]] the wire pushes the magnet with an equal and opposite force, which the balance feels.',
        'As a mass: $0.030 / 9.81 = 3.1\\times10^{-3}$ kg.'
      ],
      a: 'The reading changes by about 3.1 g — up or down depending on the current\'s direction.'
    },
    {
      title: 'The loudspeaker\'s voice coil',
      q: 'A loudspeaker coil has 50 turns of radius 1.2 cm and sits in a radial field of 1.0 T. What force does a current of 0.50 A produce?',
      steps: [
        'Total length of wire: $L = 50 \\times 2\\pi(0.012) = 3.77\\ \\mathrm{m}$.',
        'The field is radial, so every piece of wire is at right angles to it, and every force points along the coil\'s axis: they add.',
        '$F = ILB = (0.50)(3.77)(1.0) = 1.9\\ \\mathrm{N}$, reversing each time the audio current reverses.'
      ],
      a: 'About 1.9 N along the axis, pushing the cone in and out.'
    }
  ],
  quiz: [
    { q: 'A horizontal wire carries a current due east through a field pointing vertically downward. The force on the wire points…', choices: ['north', 'south', 'up', 'west'], a: 0,
      why: 'With east $= \\hat x$, north $= \\hat y$, up $= \\hat z$: $\\hat x\\times(-\\hat z) = +\\hat y$, north.' },
    { q: 'A closed rectangular loop carrying a current sits in a uniform magnetic field. The net force on it is…', choices: ['zero, though there may be a torque', 'along the field', 'twice the force on one side', 'zero only if the loop is square'], a: 0,
      why: 'Opposite sides carry opposite currents and feel opposite forces. In a uniform field these cancel for any closed loop, but they can still twist it.' },
    { q: 'Two long parallel wires carry currents in the same direction. They…', choices: ['repel', 'attract', 'feel no force', 'twist around each other'], a: 1,
      why: 'Each wire sits in the other\'s field; working out $I\\vec L\\times\\vec B$ gives a force towards the other wire. Opposite currents repel.' },
    { q: 'Doubling both the current and the length of wire in the field quadruples the force.', a: true, why: '$F = ILB\\sin\\theta$ is proportional to each: $2 \\times 2 = 4$.' },
    { q: 'The magnetic force on a current-carrying wire acts directly on…', choices: ['the positive ions of the metal lattice', 'the moving charge carriers, which pass it on to the lattice', 'the insulation', 'the magnetic poles of the atoms'], a: 1,
      why: 'Only moving charges feel $q\\vec v\\times\\vec B$. The carriers pile up slightly at one side, and the resulting electric field drags the lattice along.' }
  ],
  applications: [
    'Electric motors of every size.',
    'Loudspeakers and headphones.',
    'Moving-coil meters.',
    'Railguns and the electromagnetic catapults on aircraft carriers.'
  ],
  sim: { id: 'em2-field-map', params: { source: 'pair' } }
},

{
  id: 'torque-on-loop', parent: 'magnetism', title: 'Torque on a current loop and motors', level: 2,
  short: 'A current loop in a magnetic field feels a twist, τ = NIAB sin θ, that tries to line up its magnetic moment with the field — the working principle of the electric motor.',
  keywords: ['torque on a coil', 'magnetic moment', 'magnetic dipole moment', 'NIAB', 'DC motor', 'commutator', 'split ring', 'brushes', 'galvanometer', 'back EMF', 'dipole energy', 'μ × B'],
  prereq: ['force-on-current', 'torque', 'math:cross-product'],
  related: ['generators', 'magnetic-materials', 'electron-spin', 'faradays-law'],
  body: `
Put a rectangular loop of wire, carrying a current, in a uniform magnetic field. Opposite sides carry the current in opposite directions, so they are pushed in opposite directions. The forces cancel as a net push — but they act along different lines, so they form a **couple** that twists the loop.

### The torque
For a flat coil of $N$ turns and area $A$, carrying current $I$, with the normal to the coil at angle $\\theta$ to the field,

$$\\tau = N I A B\\sin\\theta$$

The combination $\\mu = NIA$ is the coil's **magnetic moment**, a vector along the normal given by the right-hand grip rule (fingers round the current, thumb along $\\vec\\mu$). In vector form $\\vec\\tau = \\vec\\mu\\times\\vec B$, true for any flat loop shape, not just rectangles. A coil is a magnetic dipole, and the torque turns it like a compass needle until $\\vec\\mu$ points along $\\vec B$.

### Energy of a dipole
Turning the moment away from the field takes work, so the dipole has a potential energy

$$U = -\\vec\\mu\\cdot\\vec B = -\\mu B\\cos\\theta$$

lowest ($-\\mu B$) when aligned and highest ($+\\mu B$) when reversed. This single idea explains compass needles, the alignment of atomic moments in [[magnetic-materials]], and the energy levels of nuclei in an MRI scanner.

### The DC motor
Left alone, a coil in a field just swings to the aligned position and stops. To make it spin, reverse the current every half turn, just as the coil passes the aligned position. A **split-ring commutator** does this: the coil's ends are joined to two half-rings that rub against fixed carbon **brushes**, swapping the connections each half revolution. The torque then always pushes the same way — as $N I A B|\\sin\\theta|$, falling to zero at the two "dead spots". Real motors use many coils at different angles (an armature) so the torque never drops to zero.

### Back EMF
A spinning coil in a magnetic field is also a [[generators|generator]]: it induces an EMF that opposes the supply (by [[lenzs-law|Lenz's law]]). The current is $I = (V - \\mathcal{E}_\\text{back})/R$. At standstill there is no back EMF and the current is large — the surge when a motor starts, or the overheating when it jams. As it speeds up the back EMF grows and the current falls until the torque just balances the load.

### Numbers
A coil of 100 turns and 20 cm² carrying 1.5 A in 0.5 T feels at most $\\tau = (100)(1.5)(2\\times10^{-3})(0.5) = 0.15$ N·m. At atomic scale the natural unit of magnetic moment is the Bohr magneton, $\\mu_B = 9.27\\times10^{-24}$ A·m².
`,
  ideas: [
    'A current loop in a uniform field feels no net force but a torque τ = NIAB sin θ.',
    'The magnetic moment μ = NIA points along the loop\'s normal; the torque τ = μ × B turns it towards the field.',
    'The energy U = −μB cos θ is lowest when the moment points along the field.',
    'A motor keeps turning because a commutator reverses the current every half turn.',
    'A spinning motor generates a back EMF that limits its current and speed.'
  ],
  pitfalls: [
    'The torque is largest when the coil faces the field (its plane perpendicular to B) — That is where it is zero: the forces then just stretch the coil in its own plane. The torque is largest when the plane of the coil lies along the field.',
    'A motor\'s current is fixed by the supply voltage and the coil\'s resistance — Only at standstill. Once it spins, the back EMF subtracts from the supply voltage and the current falls.'
  ],
  derivation: {
    title: 'The torque on a rectangular coil',
    steps: [
      { text: 'Take a rectangular loop with sides $a$ (parallel to the rotation axis) and $b$, carrying current $I$, with its normal at angle $\\theta$ to a uniform field perpendicular to the axis. The two sides of length $a$ are at right angles to $\\vec B$, so each feels', tex: 'F = I a B' },
      { text: 'These forces are equal and opposite but act along lines a distance $b\\sin\\theta$ apart, so they form a couple:', tex: '\\tau = F\\, b\\sin\\theta = I\\,(ab)\\,B\\sin\\theta = I A B\\sin\\theta' },
      { text: 'The forces on the other two sides lie along the axis and cancel without twisting. With $N$ turns every force is $N$ times larger:', tex: '\\tau = N I A B\\sin\\theta = \\left|\\vec\\mu\\times\\vec B\\right|, \\qquad \\mu = N I A' }
    ]
  },
  formulas: [
    {
      name: 'Torque on a coil',
      expr: 'tau = N*I*A*B*sin(theta)', tex: '\\tau = N I A B\\sin\\theta',
      vars: {
        tau: { name: 'torque', q: 'torque', unit: 'N·m' },
        N: { name: 'number of turns', q: 'count', value: 100, int: true },
        I: { name: 'current', q: 'current', unit: 'A', value: 1.5 },
        A: { name: 'area of the coil', q: 'area', unit: 'cm²', value: 20 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.5 },
        theta: { name: 'angle between the coil\'s normal and the field', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      stories: {
        tau: 'A motor coil of {N} turns and area {A} carries {I} in a {B} field, its normal at {theta} to the field. What torque acts on it?',
        I: 'What current gives a torque of {tau} on a coil of {N} turns and area {A} in a {B} field, with its normal at {theta} to the field?'
      }
    },
    {
      name: 'Magnetic moment of a coil',
      expr: 'mu = N*I*A', tex: '\\mu = N I A',
      vars: {
        mu: { name: 'magnetic moment', q: 'mdipole', unit: 'A·m²' },
        N: { name: 'number of turns', q: 'count', value: 200, int: true },
        I: { name: 'current', q: 'current', unit: 'A', value: 0.5 },
        A: { name: 'area of the coil', q: 'area', unit: 'cm²', value: 10 }
      }
    },
    {
      name: 'Energy of a magnetic moment in a field',
      expr: 'U = -mu*B*cos(theta)', tex: 'U = -\\mu B\\cos\\theta',
      vars: {
        U: { name: 'potential energy', q: 'energy', unit: 'J', signed: true },
        mu: { name: 'magnetic moment', q: 'mdipole', unit: 'A·m²', value: 0.1 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.5 },
        theta: { name: 'angle between moment and field', q: 'angle', unit: '°', value: 30, min: 0, max: 180 }
      },
      note: 'Zero of energy at 90°. Turning a moment from aligned (0°) to reversed (180°) takes work $2\\mu B$.'
    }
  ],
  examples: [
    {
      title: 'Starting torque and running torque',
      q: 'A 12 V DC motor has a coil of 80 turns, area 12 cm² and resistance 2.0 Ω in a 0.40 T field. Find the largest torque at start-up, and again when it is spinning fast enough to generate a back EMF of 9.0 V.',
      steps: [
        'At start there is no back EMF: $I = V/R = 12/2.0 = 6.0\\ \\mathrm{A}$.',
        '$\\tau_\\text{max} = NIAB = (80)(6.0)(1.2\\times10^{-3})(0.40) = 0.23\\ \\mathrm{N\\,m}$.',
        'Running: $I = (12 - 9.0)/2.0 = 1.5\\ \\mathrm{A}$, a quarter as much, so $\\tau_\\text{max} = 0.058\\ \\mathrm{N\\,m}$.'
      ],
      a: '0.23 N·m at start-up, 0.058 N·m when running — the motor speeds up until its torque matches the load.'
    },
    {
      title: 'Flipping a coil over',
      q: 'How much work does it take to turn a coil of moment 0.10 A·m² from alignment with a 0.50 T field to pointing against it?',
      steps: [
        'Aligned: $U_1 = -\\mu B = -0.050$ J. Reversed: $U_2 = +\\mu B = +0.050$ J.',
        'Work needed: $U_2 - U_1 = 2\\mu B = 0.10$ J.'
      ],
      a: '0.10 J'
    }
  ],
  quiz: [
    { q: 'A coil\'s plane is perpendicular to the magnetic field (its normal points along the field). The torque on it is…', choices: ['as large as possible', 'zero', 'half the maximum', 'dependent on the coil\'s shape'], a: 1,
      why: 'With $\\theta = 0$, $\\sin\\theta = 0$. This is a motor\'s dead spot, where the commutator switches the current.' },
    { q: 'Why does a simple DC motor need a split-ring commutator?', choices: ['To reduce sparking', 'To reverse the current every half turn, so the torque keeps the same sense', 'To keep the magnetic field constant', 'To turn the supply\'s DC into AC for the magnets'], a: 1,
      why: 'Without it the torque would reverse after half a turn and the coil would just rock about the aligned position.' },
    { q: 'A motor draws much more current when starting (or when jammed) than when running freely, because…', choices: ['the coil is cold', 'there is no back EMF while it is not turning', 'friction is higher at rest', 'the magnets are weaker at rest'], a: 1,
      why: 'The back EMF is proportional to the speed. At rest only the coil\'s small resistance limits the current.' },
    { q: 'At the same current, doubling the area of a coil doubles the torque on it.', a: true, why: '$\\tau = NIAB\\sin\\theta$ is proportional to $A$ (the magnetic moment doubles).' },
    { q: 'In which orientation does a current loop have its lowest energy?', choices: ['Moment along the field', 'Moment against the field', 'Moment perpendicular to the field', 'All orientations are equal'], a: 0,
      why: '$U = -\\mu B\\cos\\theta$ is most negative at $\\theta = 0$, which is why a free coil (or compass) swings to line up with the field.' }
  ],
  applications: [
    'Electric motors, from phone vibrators to trains.',
    'Moving-coil meters, where a spring balances the torque on a coil in a radial field.',
    'NMR and MRI, where nuclear magnetic moments precess under the torque of the field.',
    'Magnetorquers: coils that turn satellites using the Earth\'s field.'
  ],
  history: 'Michael Faraday made a current-carrying wire rotate around a magnet in 1821, the first electric motor. Practical commutator motors followed in the 1830s.',
  sim: 'em2-dc-motor'
},

{
  id: 'field-of-wire', parent: 'magnetism', title: 'Magnetic field of a wire (Biot–Savart)', level: 2,
  short: 'Every piece of a current makes a little magnetic field that circles it; adding the pieces up (the Biot–Savart law) gives B = μ₀I/2πr around a long straight wire.',
  keywords: ['Biot-Savart law', 'Biot–Savart', 'field of a straight wire', 'μ0 I / 2πr', 'right-hand grip rule', 'current loop', 'field at the centre of a loop', 'permeability of free space', 'mu0', 'parallel wires', 'force between wires', 'definition of the ampere'],
  prereq: ['magnetic-field', 'electric-current', 'math:cross-product', 'math:definite-integral'],
  related: ['amperes-law', 'solenoid', 'force-on-current', 'coulombs-law'],
  body: `
Hold a compass near a wire and switch on the current: the needle swings to lie *across* the wire. Scatter iron filings on a card pierced by a vertical wire and they form **circles** centred on it. The field of a current circles the current. Its direction follows the **right-hand grip rule**: grip the wire with your right thumb along the current, and your fingers curl the way the field goes.

### The Biot–Savart law
Each short piece of wire $d\\vec l$ carrying current $I$ contributes a small field at a point a distance $r$ away:

$$d\\vec B = \\frac{\\mu_0}{4\\pi}\\,\\frac{I\\, d\\vec l\\times\\hat r}{r^2}$$

It is an inverse-square law like [[coulombs-law|Coulomb's law]], with two twists: the field is perpendicular to both the current element and the line to the point (a [[math:cross-product|cross product]]), and pieces pointing straight at you contribute nothing. The constant $\\mu_0 = 1.2566\\times10^{-6}\\ \\mathrm{N/A^2}$ (very nearly $4\\pi\\times10^{-7}$) is the **permeability of free space**.

### Long straight wire
Adding up every piece of an infinitely long wire (see the derivation) gives

$$B = \\frac{\\mu_0 I}{2\\pi r}$$

The field falls as $1/r$, more slowly than the $1/r^2$ of each piece, because a long wire has so many pieces. 10 A gives 200 µT at 1 cm — four times the Earth's field — but only 1 µT at 2 m. A 1000 A overhead line gives about 10 µT at 20 m.

### A circular loop
At the centre of a flat loop of radius $R$ every piece is at right angles to the line to the centre and at the same distance, so the contributions simply add:

$$B = \\frac{\\mu_0 I}{2R} \\qquad (N \\text{ turns: } \\mu_0 N I / 2R)$$

On the axis, a distance $z$ from the centre, $B = \\mu_0 I R^2 / 2(R^2+z^2)^{3/2}$; far away this becomes the $1/z^3$ field of a [[magnetic-field|magnetic dipole]]. Stack many loops and you have a [[solenoid]].

### Forces between currents
A second parallel wire a distance $d$ away sits in the first wire's field $\\mu_0 I_1/2\\pi d$ and feels a [[force-on-current|force]] $I_2 L B$:

$$F = \\frac{\\mu_0 I_1 I_2 L}{2\\pi d}$$

attractive for currents in the same direction, repulsive for opposite ones. Two busbars carrying 100 A each, 1 cm apart, pull on each other with 0.2 N per metre — and ten thousand times more if a fault drives a hundred times the current, which is why switchgear conductors are braced.

> [!note] Since 2019 the ampere is fixed by giving the electron's charge an exact value, and $\\mu_0$ has become a measured constant. It still equals $4\\pi\\times10^{-7}$ to better than one part in a billion.
`,
  ideas: [
    'The field of a current circles it; the right-hand grip rule gives the sense.',
    'Biot–Savart: each current element contributes dB = (μ₀/4π) I dl × r̂ / r².',
    'A long straight wire has B = μ₀I/2πr, falling as 1/r.',
    'The centre of a loop of radius R has B = μ₀I/2R; far away a loop is a dipole.',
    'Parallel wires attract (same direction) or repel (opposite) with F = μ₀I₁I₂L/2πd.'
  ],
  pitfalls: [
    'The field of a long wire falls as 1/r² like that of a point charge — Each element gives an inverse-square contribution, but summing along a long wire leaves 1/r.',
    'The field points along the wire, or straight away from it — It circles the wire, perpendicular to both the wire and the line from it.'
  ],
  derivation: {
    title: 'Field of a long straight wire from the Biot–Savart law',
    steps: [
      { text: 'Put the wire along the $z$ axis and the point P a distance $r$ from it, level with $z = 0$. An element $dz$ at height $z$ is $s = \\sqrt{r^2 + z^2}$ from P, and the angle $\\varphi$ between the element and the line to P has $\\sin\\varphi = r/s$:', tex: 'dB = \\frac{\\mu_0 I}{4\\pi}\\,\\frac{dz\\,\\sin\\varphi}{s^2} = \\frac{\\mu_0 I}{4\\pi}\\,\\frac{r\\,dz}{\\left(r^2 + z^2\\right)^{3/2}}' },
      { text: 'Every element\'s contribution points the same way (around the wire), so the sizes simply add:', tex: 'B = \\frac{\\mu_0 I r}{4\\pi}\\int_{-\\infty}^{\\infty} \\frac{dz}{\\left(r^2+z^2\\right)^{3/2}}' },
      { text: 'The integral is $\\left[z / r^2\\sqrt{r^2+z^2}\\right]_{-\\infty}^{\\infty} = 2/r^2$ (substitute $z = r\\tan\\alpha$ to see it). So', tex: 'B = \\frac{\\mu_0 I r}{4\\pi}\\cdot\\frac{2}{r^2} = \\frac{\\mu_0 I}{2\\pi r}' }
    ]
  },
  formulas: [
    {
      name: 'Field of a long straight wire',
      expr: 'B = mu0*I/(2*pi*r)', tex: 'B = \\frac{\\mu_0 I}{2\\pi r}',
      vars: {
        B: { name: 'magnetic field', q: 'bfield', unit: 'µT' },
        mu0: { const: 'mu0' },
        I: { name: 'current', q: 'current', unit: 'A', value: 10 },
        r: { name: 'distance from the wire', q: 'length', unit: 'cm', value: 1 }
      },
      stories: {
        B: 'A long straight cable carries {I}. What is the magnetic field {r} from it?',
        r: 'How far from a long wire carrying {I} does its field fall to {B}?',
        I: 'A magnetometer {r} from a long straight wire picks up a field of {B} from it. What current flows?'
      }
    },
    {
      name: 'Field at the centre of a flat coil',
      expr: 'B = mu0*N*I/(2*R)', tex: 'B = \\frac{\\mu_0 N I}{2R}',
      vars: {
        B: { name: 'field at the centre', q: 'bfield', unit: 'mT' },
        mu0: { const: 'mu0' },
        N: { name: 'number of turns', q: 'count', value: 20, int: true },
        I: { name: 'current', q: 'current', unit: 'A', value: 2 },
        R: { name: 'radius of the coil', q: 'length', unit: 'cm', value: 5 }
      },
      stories: { B: 'A flat coil of {N} turns and radius {R} carries {I}. What is the field at its centre?' }
    },
    {
      name: 'Field on the axis of a loop',
      expr: 'B = mu0*I*R^2/(2*(R^2 + z^2)^(3/2))', tex: 'B = \\frac{\\mu_0 I R^2}{2\\left(R^2 + z^2\\right)^{3/2}}',
      vars: {
        B: { name: 'field on the axis', q: 'bfield', unit: 'µT' },
        mu0: { const: 'mu0' },
        I: { name: 'current', q: 'current', unit: 'A', value: 5 },
        R: { name: 'radius of the loop', q: 'length', unit: 'cm', value: 10 },
        z: { name: 'distance from the centre along the axis', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'At $z = 0$ this is $\\mu_0 I/2R$; for $z \\gg R$ it becomes the dipole field $\\mu_0 I R^2/2z^3$. For a given $B$ and $z$ two radii can work — a small loop close in or a big one.',
      practice: { unknowns: ['B', 'z', 'I'] }
    },
    {
      name: 'Force between parallel wires',
      expr: 'F = mu0*I1*I2*L/(2*pi*d)', tex: 'F = \\frac{\\mu_0 I_1 I_2 L}{2\\pi d}',
      vars: {
        F: { name: 'force on a length L of either wire', q: 'force', unit: 'N' },
        mu0: { const: 'mu0' },
        I1: { name: 'current in the first wire', q: 'current', unit: 'A', value: 100 },
        I2: { name: 'current in the second wire', q: 'current', unit: 'A', value: 100 },
        L: { name: 'length of the wires', q: 'length', unit: 'm', value: 1 },
        d: { name: 'separation', q: 'length', unit: 'cm', value: 1 }
      },
      note: 'Attractive for currents in the same direction, repulsive for opposite currents.',
      stories: {
        F: 'Two parallel busbars {d} apart carry {I1} and {I2}. What force acts on {L} of either bar?',
        d: 'How far apart must two long wires carrying {I1} and {I2} be for the force on each {L} length to be {F}?'
      }
    }
  ],
  examples: [
    {
      title: 'Why a lamp flex barely disturbs a compass',
      q: 'A flex carries 13 A to a heater and back again along two conductors 5 mm apart. Compare the field 1 m away with that of a single conductor carrying 13 A.',
      steps: [
        'One conductor alone: $B = \\dfrac{\\mu_0 I}{2\\pi r} = \\dfrac{(1.257\\times10^{-6})(13)}{2\\pi(1.0)} = 2.6\\ \\mathrm{\\mu T}$.',
        'The return conductor carries the same current the other way, 5 mm away: its field almost exactly cancels the first. What is left is the field of a line dipole, $B \\approx \\dfrac{\\mu_0 I d}{2\\pi r^2} = \\dfrac{(1.257\\times10^{-6})(13)(0.005)}{2\\pi(1.0)^2} = 13\\ \\mathrm{nT}$.'
      ],
      a: 'About 13 nT instead of 2.6 µT — two hundred times smaller, and some four thousand times weaker than the Earth\'s field.'
    },
    {
      title: 'Field at the centre of a coil',
      q: 'A flat coil of 50 turns and radius 4.0 cm carries 0.50 A. What field does it make at its centre?',
      steps: ['$B = \\dfrac{\\mu_0 N I}{2R} = \\dfrac{(1.257\\times10^{-6})(50)(0.50)}{2(0.040)} = 3.9\\times10^{-4}\\ \\mathrm{T}$.'],
      a: '0.39 mT, about eight times the Earth\'s field.'
    }
  ],
  quiz: [
    { q: 'The field 2 cm from a long straight wire is 100 µT. At 4 cm it is…', choices: ['25 µT', '50 µT', '200 µT', '12.5 µT'], a: 1, why: '$B \\propto 1/r$: double the distance, half the field.' },
    { q: 'The field lines around a long straight wire are…', choices: ['straight lines pointing away from the wire', 'circles centred on the wire', 'lines parallel to the wire', 'spirals'], a: 1,
      why: 'The field circles the current, in the sense given by the right-hand grip rule.' },
    { q: 'A lamp flex carrying 5 A produces a field at 1 m comparable with the Earth\'s field.', a: false,
      why: 'Its two conductors carry equal and opposite currents whose fields nearly cancel. Even one conductor alone would give only 1 µT, fifty times less than the Earth\'s field.' },
    { q: 'Two long parallel wires 10 cm apart carry 10 A each in opposite directions. Halfway between them the field is…', choices: ['zero', 'twice the field of one wire', 'half the field of one wire', 'directed along the wires'], a: 1,
      why: 'Between the wires the circles around opposite currents point the same way, so the fields add. (With currents in the same direction they would cancel there.)' },
    { q: 'The Biot–Savart law resembles Coulomb\'s law in that both…', choices: ['fall off as $1/r^2$ from a small source', 'act along the line joining source and point', 'contain a cross product', 'need a medium to act through'], a: 0,
      why: 'Each current element\'s field falls as $1/r^2$. Unlike Coulomb\'s field, it points at right angles to the line from the source.' }
  ],
  applications: [
    'Current clamps and Hall sensors that measure a current from the field around a conductor.',
    'Busbars and switchgear braced against the forces between conductors during short circuits.',
    'Twisted-pair and coaxial cables, which cancel their own fields.',
    'Helmholtz coils: two coaxial loops that make a very uniform field between them.'
  ],
  history: 'Jean-Baptiste Biot and Félix Savart measured the field around a long wire in 1820, within weeks of Ørsted\'s discovery, by timing the oscillations of a magnetised needle at different distances.',
  sim: { id: 'em2-field-map', params: { source: 'wire' } }
},

{
  id: 'amperes-law', parent: 'magnetism', title: 'Ampère\'s law', level: 3,
  short: 'Around any closed loop, the sum of B along the path equals μ₀ times the current threading the loop — a shortcut to the field whenever there is enough symmetry.',
  keywords: ['Ampère\'s law', 'Ampere\'s circuital law', 'line integral', 'enclosed current', 'Amperian loop', 'toroid', 'coaxial cable', 'field inside a wire', 'displacement current', 'curl of B'],
  prereq: ['field-of-wire', 'gauss-law', 'math:line-integrals'],
  related: ['solenoid', 'maxwells-equations', 'math:curl'],
  body: `
Walk once around any closed path, and at each step multiply the step length by the part of the magnetic field along it. Add up all the pieces. **Ampère's law** says the total depends only on the current passing through the loop:

$$\\oint \\vec B\\cdot d\\vec l = \\mu_0 I_\\text{enc}$$

The sum on the left is a [[math:line-integrals|line integral]] (the **circulation** of $\\vec B$). Currents are counted with a sign given by the right-hand rule: curl your fingers the way you walk round the loop, and currents along your thumb count as positive. Currents outside the loop add nothing — they push the field along on one side and against it on the other.

### Check it on a wire
Around a long straight wire, take a circle of radius $r$. By symmetry $B$ has the same size all the way round and points along the path, so the integral is just $B \\times 2\\pi r$:

$$B\\,(2\\pi r) = \\mu_0 I \\quad\\Rightarrow\\quad B = \\frac{\\mu_0 I}{2\\pi r}$$

— the [[field-of-wire|Biot–Savart]] result, in one line.

### Useful only with symmetry
Ampère's law is always true, but, like [[gauss-law|Gauss's law]] for electric fields, it hands you the field only when symmetry lets you take $B$ out of the integral. Choose an **Amperian loop** along which $B$ is constant and parallel to the path, or perpendicular to it (contributing nothing). The classic cases:

- **Inside a thick wire** carrying a uniform current $I$ over radius $R$, a circle of radius $r < R$ encloses only $I r^2/R^2$, so $B = \\mu_0 I r/2\\pi R^2$: zero on the axis, rising linearly to a maximum at the surface.
- **Coaxial cable:** outside the outer braid the loop encloses the signal current and its equal return current, so the field is zero. The cable neither leaks nor picks up magnetic fields.
- **Toroid** (a coil bent into a doughnut): inside, $B = \\mu_0 N I / 2\\pi r$; outside, zero.
- **Long solenoid**: $B = \\mu_0 n I$ inside (see the derivation and [[solenoid]]).

### What Maxwell added
As written, the law fails for currents that are not steady. While a capacitor charges, current flows in the wires but not across the gap, so the answer would depend on which surface you stretch over the loop. Maxwell repaired it by adding a **displacement current** $\\varepsilon_0\\, d\\Phi_E/dt$: a changing electric field acts as a source of magnetic field just as a current does. That term completes [[maxwells-equations|Maxwell's equations]] and predicts [[electromagnetic-waves|electromagnetic waves]]. In differential form, $\\nabla\\times\\vec B = \\mu_0\\vec J + \\mu_0\\varepsilon_0\\,\\partial\\vec E/\\partial t$ (see [[math:curl|curl]]).
`,
  ideas: [
    'The circulation of B around any closed loop equals μ₀ times the current threading the loop.',
    'Currents outside the loop contribute nothing to the circulation, though they do contribute to B.',
    'It gives B directly when symmetry makes B constant along the loop: wires, coaxial cables, toroids, solenoids.',
    'Maxwell\'s displacement current extends the law to changing electric fields.'
  ],
  pitfalls: [
    'Ampère\'s law says B is zero wherever no current is enclosed — It says the line integral is zero. B itself can be large along the loop, with its contributions cancelling as you go round.',
    'Ampère\'s law can find any field — It is always true, but it yields B only where symmetry lets you take B outside the integral.'
  ],
  derivation: {
    title: 'The field inside a long solenoid from Ampère\'s law',
    steps: [
      { text: 'Take a rectangular loop with one side of length $\\ell$ inside the solenoid, parallel to its axis, and the opposite side outside, where the field of a long solenoid is negligible.', tex: '\\oint \\vec B\\cdot d\\vec l = B\\ell + 0 + 0 + 0' },
      { text: 'The two short sides cross the field at right angles inside and see no field outside, so they add nothing. The loop encloses $n\\ell$ turns (with $n$ turns per metre), each carrying $I$:', tex: 'I_\\text{enc} = n\\ell I' },
      { text: 'Ampère\'s law:', tex: 'B\\ell = \\mu_0 n \\ell I \\quad\\Rightarrow\\quad B = \\mu_0 n I' },
      { text: 'The inner side could have been anywhere inside, so the field is the same everywhere inside a long solenoid: it is uniform.' }
    ]
  },
  formulas: [
    {
      name: 'Field inside a uniform wire',
      expr: 'B = mu0*I*r/(2*pi*R^2)', tex: 'B = \\frac{\\mu_0 I r}{2\\pi R^2}',
      vars: {
        B: { name: 'field inside the wire', q: 'bfield', unit: 'mT' },
        mu0: { const: 'mu0' },
        I: { name: 'total current', q: 'current', unit: 'A', value: 100 },
        r: { name: 'distance from the axis (r ≤ R)', q: 'length', unit: 'mm', value: 2 },
        R: { name: 'radius of the wire', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'Only for $r \\le R$ and a current spread evenly over the cross-section (true for DC). Outside, use $\\mu_0 I/2\\pi r$.',
      stories: { B: 'A round copper bar of radius {R} carries {I}, spread evenly. What is the field {r} from its axis, inside the metal?' }
    },
    {
      name: 'Field inside a toroid',
      expr: 'B = mu0*N*I/(2*pi*r)', tex: 'B = \\frac{\\mu_0 N I}{2\\pi r}',
      vars: {
        B: { name: 'field inside the windings', q: 'bfield', unit: 'mT' },
        mu0: { const: 'mu0' },
        N: { name: 'number of turns', q: 'count', value: 500, int: true },
        I: { name: 'current', q: 'current', unit: 'A', value: 2 },
        r: { name: 'distance from the toroid\'s centre', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'Inside the doughnut only; ideally the field is zero both in the central hole and outside.',
      stories: { B: 'A toroidal coil of {N} turns carries {I}. What is the field inside it, {r} from the centre of the ring?', N: 'How many turns does a toroid need to reach {B} at {r} from its centre with {I}?' }
    }
  ],
  examples: [
    {
      title: 'Inside and outside a thick wire',
      q: 'A copper rod 4.0 mm in diameter carries 20 A. Find the field on its surface, halfway to its axis, and 1.0 cm from its axis.',
      steps: [
        'At the surface, $r = R = 2.0$ mm: $B = \\dfrac{\\mu_0 I}{2\\pi R} = \\dfrac{(1.257\\times10^{-6})(20)}{2\\pi(0.0020)} = 2.0\\ \\mathrm{mT}$.',
        'Inside, $B$ grows linearly with $r$, so at $r = 1.0$ mm it is half as big: 1.0 mT.',
        'Outside it falls as $1/r$: at 1.0 cm (five times $R$), $2.0/5 = 0.40$ mT.'
      ],
      a: '2.0 mT at the surface, 1.0 mT halfway in, 0.40 mT at 1 cm.'
    },
    {
      title: 'Why coaxial cable is quiet',
      q: 'A coaxial cable\'s inner conductor carries 2.0 A to a load and the outer braid carries 2.0 A back. Find the field between the conductors, 2.0 mm from the axis, and outside the cable.',
      steps: [
        'Between the conductors a circle of radius 2.0 mm encloses only the inner current: $B = \\dfrac{\\mu_0 (2.0)}{2\\pi (0.0020)} = 0.20\\ \\mathrm{mT}$.',
        'Outside, a circle encloses $+2.0 - 2.0 = 0$ A. By symmetry $B$ is the same all round, so $B \\times 2\\pi r = 0$ and $B = 0$.'
      ],
      a: '0.20 mT between the conductors; no field outside.'
    }
  ],
  quiz: [
    { q: 'An Amperian loop encloses no net current. Then…', choices: ['B is zero everywhere on the loop', 'the line integral of B around the loop is zero', 'there is no magnetic field nearby', 'the loop must be circular'], a: 1,
      why: 'Only the circulation is fixed by the enclosed current. B can be large on the loop — a wire just outside it makes a strong field there.' },
    { q: 'Inside a long straight wire carrying a uniform current, the field…', choices: ['is zero everywhere', 'grows in proportion to the distance from the axis', 'is the same as just outside', 'falls as 1/r'], a: 1,
      why: 'A circle of radius $r$ encloses current $\\propto r^2$ while its length is $\\propto r$, so $B \\propto r$.' },
    { q: 'Why does a coaxial cable produce almost no magnetic field outside?', choices: ['The braid is made of magnetic material', 'The core and braid carry equal and opposite currents, so no net current is enclosed', 'The insulation absorbs the field', 'The signal frequency is too high'], a: 1,
      why: 'Any circle around the whole cable encloses zero net current; with the cylindrical symmetry that forces B = 0.' },
    { q: 'Ampère\'s law holds for any closed loop, but it gives B easily only when symmetry makes B constant along the loop.', a: true, why: 'Just as with Gauss\'s law: always true, but useful only with symmetry.' },
    { q: 'Inside the windings of a toroid, $B = \\mu_0 NI/2\\pi r$. Outside the toroid the field is…', choices: ['the same', 'zero, ideally', 'twice as strong', '$\\mu_0 I/2\\pi r$'], a: 1,
      why: 'A circle outside the ring is threaded by each turn twice, once each way, so the enclosed current is zero; a circle in the central hole encloses nothing.' }
  ],
  applications: [
    'Toroidal transformers and inductors, which keep their field inside the core.',
    'Coaxial cables for aerials, networks and test equipment.',
    'Rogowski coils: a flexible coil wrapped round a conductor that measures the circulation of B — Ampère\'s law in hardware.',
    'The toroidal field coils of tokamaks.'
  ],
  history: 'André-Marie Ampère developed the mathematics of forces between currents in the 1820s. James Clerk Maxwell added the displacement current in the 1860s, which led him to predict that light is an electromagnetic wave.'
},

{
  id: 'solenoid', parent: 'magnetism', title: 'Solenoids and electromagnets', level: 2,
  short: 'A long coil makes a strong, uniform field inside, B = μ₀nI, and almost none outside; wind it on iron and the field grows hundreds of times — an electromagnet.',
  keywords: ['solenoid', 'electromagnet', 'coil', 'turns per metre', 'μ0 n I', 'iron core', 'relative permeability', 'relay', 'MRI magnet', 'saturation', 'uniform field'],
  prereq: ['field-of-wire', 'amperes-law'],
  related: ['magnetic-materials', 'inductance', 'superconductivity', 'magnetic-field'],
  body: `
Wind a wire into a long helix of closely spaced turns. Each turn makes a field like a [[field-of-wire|loop's]]; inside the coil these add up, while outside, the fields of the near and far sides of the turns largely cancel. The result is a **solenoid**: a strong, remarkably **uniform** field inside and very little outside.

### The field inside
[[amperes-law|Ampère's law]] gives it in two lines:

$$B = \\mu_0 n I = \\frac{\\mu_0 N I}{L}$$

where $n = N/L$ is the number of turns per metre. Notice what is missing: the **radius** and the **position** inside. A long solenoid 1 cm across and one 1 m across, with the same turns per metre and the same current, have the same field. At the very ends the field on the axis drops to about half, and it spreads out.

Numbers: 1000 turns on a 20 cm tube carrying 2 A gives $n = 5000$ per metre and $B = 12.6$ mT, some 250 times the Earth's field.

### A bar magnet you can switch off
Outside, a solenoid's field has exactly the shape of a bar magnet's: field lines leave one end (a north pole), loop round and enter the other. Grip the coil with your right hand, fingers along the current in the turns, and your thumb points to the north end. The simulation shows that a bar magnet's field is the field of an equivalent solenoid — the aligned electron moments at the magnet's surface act like a current flowing round it.

### Iron cores
Fill the coil with soft iron and the field can be hundreds or thousands of times stronger: the current's field lines up the iron's own magnetic domains (see [[magnetic-materials]]), which add their field to the coil's. For an ideal closed core,

$$B = \\mu_r \\mu_0 n I$$

with a **relative permeability** $\\mu_r$ of several hundred to several thousand. The gain stops at **saturation**, about 1.5–2 T for iron, when all the domains are aligned. Switch the current off and soft iron loses its magnetism: a switchable magnet.

### Where they are used
Electromagnets lift scrap cars, and pull the contacts of **relays** and the plungers of door locks and **solenoid valves** in washing machines and fuel injectors. The largest are **superconducting** solenoids in MRI scanners and particle detectors: a 1.5 T MRI field needs $nI = B/\\mu_0 \\approx 1.2$ million ampere-turns per metre, carried with zero resistance by niobium–titanium wire cooled by liquid helium (see [[superconductivity]]). A solenoid is also the textbook [[inductance|inductor]].
`,
  ideas: [
    'Inside a long solenoid the field is uniform: B = μ₀nI, with n turns per metre.',
    'The field depends on turns per metre and current, not on the solenoid\'s radius.',
    'Outside, a solenoid\'s field has the shape of a bar magnet\'s.',
    'An iron core multiplies the field by the relative permeability, up to saturation near 2 T.'
  ],
  pitfalls: [
    'A wider solenoid has a weaker field inside — For a long solenoid the field depends only on the turns per metre and the current, not the radius.',
    'More turns always means more field — Only if they are packed into the same length. Stretching the same coil to twice the length halves the field.',
    'An iron core multiplies the field without limit — Iron saturates at about 1.5–2 T; beyond that extra current adds only μ₀nI.'
  ],
  formulas: [
    {
      name: 'Field inside a long solenoid',
      expr: 'B = mu0*N*I/L', tex: 'B = \\frac{\\mu_0 N I}{L}',
      vars: {
        B: { name: 'field inside', q: 'bfield', unit: 'mT' },
        mu0: { const: 'mu0' },
        N: { name: 'number of turns', q: 'count', value: 500, int: true },
        I: { name: 'current', q: 'current', unit: 'A', value: 2 },
        L: { name: 'length of the solenoid', q: 'length', unit: 'cm', value: 25 }
      },
      note: 'For a solenoid much longer than it is wide, away from the ends. At the ends the field on the axis is about half this.',
      stories: {
        B: 'A coil of {N} turns wound evenly along a {L} tube carries {I}. What is the field inside?',
        I: 'What current gives a field of {B} inside a solenoid {L} long with {N} turns?',
        N: 'How many turns are needed on a {L} solenoid carrying {I} to reach {B}?'
      }
    },
    {
      name: 'Field with an iron core',
      expr: 'B = mur*mu0*n*I', tex: 'B = \\mu_r \\mu_0 n I',
      vars: {
        B: { name: 'field in the core', q: 'bfield', unit: 'T' },
        mur: { name: 'relative permeability of the core', value: 200, tex: '\\mu_r' },
        mu0: { const: 'mu0' },
        n: { name: 'turns per unit length', q: 'wavenumber', unit: '1/cm', value: 20 },
        I: { name: 'current', q: 'current', unit: 'A', value: 0.5 }
      },
      note: 'Valid below saturation (about 1.5–2 T for iron). An air gap in the core lowers the effective $\\mu_r$ a great deal; 200 is typical of a core with a small gap.',
      stories: { I: 'A coil with {n} on an iron core of relative permeability {mur} must give {B}. What current is needed?' }
    }
  ],
  examples: [
    {
      title: 'Designing a laboratory solenoid',
      q: 'You need a field of 10 mT inside a solenoid 30 cm long, and your supply can give at most 3.0 A. How many turns do you need?',
      steps: [
        'From $B = \\mu_0 N I/L$: $N = \\dfrac{BL}{\\mu_0 I} = \\dfrac{(0.010)(0.30)}{(1.257\\times10^{-6})(3.0)}$.',
        '$N = 796$ turns: about 800.',
        'Wire 1 mm thick fits 300 turns in each 30 cm layer, so three layers will do.'
      ],
      a: 'About 800 turns.'
    },
    {
      title: 'Ampere-turns for an MRI magnet',
      q: 'Treating an MRI magnet as a long solenoid 1.6 m long, estimate the ampere-turns needed for 1.5 T, and the turns if the superconducting wire carries 500 A.',
      steps: [
        '$NI = \\dfrac{BL}{\\mu_0} = \\dfrac{(1.5)(1.6)}{1.257\\times10^{-6}} = 1.9\\times10^{6}$ ampere-turns.',
        'At 500 A: $N = 1.9\\times10^6/500 \\approx 3800$ turns.',
        'A copper coil carrying this would dissipate megawatts; a superconducting one dissipates nothing once the current is set up.'
      ],
      a: 'About two million ampere-turns: some 3800 turns at 500 A (a real MRI magnet is short and fat, so it needs rather more).'
    }
  ],
  quiz: [
    { q: 'You double the number of turns and also double the length of a solenoid, keeping the current the same. The field inside…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 2,
      why: 'The turns per metre, $n = N/L$, is unchanged, and $B = \\mu_0 nI$.' },
    { q: 'Doubling the radius of a long solenoid (same turns per metre and current) changes the field inside by a factor of…', choices: ['4', '2', '1 — no change', '1/2'], a: 2,
      why: '$B = \\mu_0 nI$ contains no radius. (The flux through it quadruples, though, because the area does.)' },
    { q: 'Just outside the middle of a long solenoid the field is…', choices: ['the same as inside', 'very small', 'twice as big as inside', 'equal and opposite to the field inside'], a: 1,
      why: 'The field lines inside are concentrated; outside they spread over all of space, so the field there is tiny.' },
    { q: 'A soft-iron core can multiply a solenoid\'s field by hundreds, but not beyond about 2 T, where the iron saturates.', a: true,
      why: 'Once all the iron\'s domains are aligned it has nothing more to add.' },
    { q: 'At the very end of a long solenoid the field on the axis is about…', choices: ['zero', 'half the field in the middle', 'the same as in the middle', 'twice the field in the middle'], a: 1,
      why: 'At the end you have coil on only one side. By symmetry each half of a long solenoid contributes half the central field.' }
  ],
  applications: [
    'Relays and contactors that switch large currents with a small one.',
    'Solenoid valves in washing machines, dishwashers and engines.',
    'Lifting electromagnets in scrapyards and steelworks.',
    'Superconducting magnets for MRI, particle detectors and fusion experiments.'
  ],
  history: 'William Sturgeon wound a coil on a horseshoe of iron in 1825 and lifted about twenty times the magnet\'s own weight. Joseph Henry, using many layers of insulated wire, built electromagnets in 1831 that could lift about a tonne.',
  sim: { id: 'em2-field-map', params: { source: 'solenoid' } }
},

{
  id: 'hall-effect', parent: 'magnetism', title: 'Hall effect', level: 3,
  short: 'A current flowing across a magnetic field is pushed to one side of the conductor, building up a small sideways voltage that reveals the sign and density of the charge carriers — and measures the field.',
  keywords: ['Hall effect', 'Hall voltage', 'Hall probe', 'Hall sensor', 'charge carrier density', 'drift velocity', 'Hall coefficient', 'holes', 'semiconductor', 'magnetometer', 'quantum Hall effect'],
  prereq: ['lorentz-force', 'electric-current', 'free-electron-model'],
  related: ['semiconductors', 'force-on-current', 'charged-particle-motion'],
  body: `
Run a current along a flat strip of conductor and put a magnetic field through its face. The moving charge carriers feel a [[lorentz-force|magnetic force]] across the strip and start to pile up along one edge, leaving the other edge with the opposite charge. The separated charge makes an electric field across the strip, which pushes back. Within a tiny fraction of a second the two forces balance and the carriers flow straight along again — but a small steady voltage now appears **across** the strip: the **Hall voltage**.

### How big
In the steady state the electric force on each carrier balances the magnetic one: $qE_H = qv_dB$, where $v_d$ is the drift speed. Across a strip of width $w$ the voltage is $V_H = E_H w = v_d B w$. The current is $I = nqv_d\\,wt$ for a strip of thickness $t$ with $n$ carriers per cubic metre, so

$$V_H = \\frac{I B}{n q t}$$

Two things stand out. The voltage is proportional to $B$ — a **Hall probe** is a magnetometer. And it is inversely proportional to the **carrier density** $n$: the fewer the carriers, the faster each must drift to carry the current, and the harder the field pushes them sideways.

### Metals and semiconductors
Copper has about $8.5\\times10^{28}$ free electrons per cubic metre. A copper strip 0.1 mm thick carrying 10 A in a 1 T field gives a Hall voltage of only about 7 µV. A doped [[semiconductors|semiconductor]] may have $10^{21}$ carriers per cubic metre, a hundred million times fewer, and gives millivolts from milliamps. Every Hall sensor is made from a semiconductor.

### Which charges move?
Reverse the sign of the carriers and, for the same current, they drift the opposite way — yet the magnetic force pushes them to the **same** edge, so the Hall voltage flips sign. The Hall effect is therefore a direct test of whether a current is carried by negative electrons or by positive carriers. Most metals give the sign expected for electrons, but some (zinc, beryllium) and all p-type semiconductors give the positive sign: their current is carried by **holes**, a puzzle that only the band theory of solids resolved (see [[band-theory]]).

### Uses
Hall sensors are cheap, small and have no moving parts. They measure fields in laboratories and in phones (the electronic compass), detect the position of the rotor in brushless motors, sense wheel speed in anti-lock brakes and the position of the crankshaft, and measure currents without touching the conductor. In research, Hall measurements give the carrier density and mobility of every new semiconductor material.

> [!fact] In a thin layer of electrons at very low temperature and high field, the ratio $V_H/I$ comes in exact steps of $h/e^2 \\approx 25\\,813\\ \\Omega$ divided by a whole number — the quantum Hall effect. It is now the world's standard of electrical resistance.
`,
  ideas: [
    'Carriers pushed sideways by the magnetic force build up a transverse Hall voltage.',
    'In the steady state the Hall electric force balances the magnetic force on each carrier.',
    'V_H = IB/nqt: proportional to the field, inversely proportional to the carrier density.',
    'The sign of the Hall voltage reveals the sign of the charge carriers.'
  ],
  pitfalls: [
    'More charge carriers give a bigger Hall voltage — The opposite: with more carriers each drifts more slowly for the same current, so the sideways push and the voltage are smaller.',
    'The Hall voltage appears along the direction of the current — It appears across the strip, at right angles to both the current and the field.'
  ],
  formulas: [
    {
      name: 'Hall voltage',
      expr: 'VH = I*B/(n*qe*t)', tex: 'V_H = \\frac{I B}{n e t}',
      vars: {
        VH: { name: 'Hall voltage', q: 'voltage', unit: 'µV', tex: 'V_H' },
        I: { name: 'current along the strip', q: 'current', unit: 'A', value: 10 },
        B: { name: 'magnetic field through the strip', q: 'bfield', unit: 'T', value: 1 },
        n: { name: 'charge-carrier density', q: 'numberdensity', unit: '1/m³', value: 8.5e28 },
        qe: { const: 'qe' },
        t: { name: 'thickness of the strip (along B)', q: 'length', unit: 'mm', value: 0.1 }
      },
      note: 'For carriers of charge $\\pm e$. Copper: $n = 8.5\\times10^{28}\\ \\mathrm{m^{-3}}$; a doped semiconductor, $10^{20}$–$10^{24}\\ \\mathrm{m^{-3}}$.',
      stories: {
        VH: 'A copper strip {t} thick carries {I} across a {B} field. Copper has {n} free electrons per cubic metre. What Hall voltage appears?',
        n: 'A semiconductor sample {t} thick carrying {I} in a {B} field shows a Hall voltage of {VH}. What is its carrier density?',
        B: 'A Hall probe {t} thick with {n} carriers per cubic metre carries {I} and reads {VH}. What is the field?'
      }
    },
    {
      name: 'Drift speed from the Hall voltage',
      expr: 'v = VH/(B*w)', tex: 'v_d = \\frac{V_H}{B w}',
      vars: {
        v: { name: 'drift speed of the carriers', q: 'speed', unit: 'cm/s', tex: 'v_d' },
        VH: { name: 'Hall voltage', q: 'voltage', unit: 'µV', value: 7.3, tex: 'V_H' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 },
        w: { name: 'width of the strip (across which V_H is measured)', q: 'length', unit: 'cm', value: 1 }
      },
      note: 'From $qE_H = qv_dB$ with $E_H = V_H/w$. The default values are the copper strip of the first formula, 1 cm wide.'
    }
  ],
  examples: [
    {
      title: 'Copper versus a semiconductor',
      q: 'A strip 0.10 mm thick carries a current across a 1.0 T field. Find the Hall voltage (a) for copper carrying 10 A, (b) for a semiconductor with $10^{21}$ carriers per cubic metre carrying only 1.0 mA.',
      steps: [
        '(a) $V_H = \\dfrac{IB}{net} = \\dfrac{(10)(1.0)}{(8.5\\times10^{28})(1.60\\times10^{-19})(1.0\\times10^{-4})} = 7.3\\times10^{-6}\\ \\mathrm{V}$.',
        '(b) $V_H = \\dfrac{(1.0\\times10^{-3})(1.0)}{(10^{21})(1.60\\times10^{-19})(1.0\\times10^{-4})} = 6.2\\times10^{-2}\\ \\mathrm{V}$.'
      ],
      a: '7.3 µV for copper; 62 mV for the semiconductor, with ten thousand times less current.'
    },
    {
      title: 'Reading a Hall probe',
      q: 'A Hall probe 0.20 mm thick has $2.0\\times10^{21}$ carriers per cubic metre and carries 5.0 mA. It reads 12 mV. What is the field?',
      steps: [
        'Rearrange: $B = \\dfrac{V_H\\, n e t}{I}$.',
        '$B = \\dfrac{(0.012)(2.0\\times10^{21})(1.60\\times10^{-19})(2.0\\times10^{-4})}{5.0\\times10^{-3}} = 0.15\\ \\mathrm{T}$.'
      ],
      a: 'About 0.15 T.'
    }
  ],
  quiz: [
    { q: 'Two strips of the same size carry the same current in the same field. Strip A has 1000 times fewer charge carriers per cubic metre. Its Hall voltage is…', choices: ['1000 times smaller', '1000 times larger', 'the same', '√1000 times larger'], a: 1,
      why: '$V_H \\propto 1/n$: its carriers drift 1000 times faster, so the magnetic push is 1000 times stronger.' },
    { q: 'For a given current direction and field, the sign of the Hall voltage tells you…', choices: ['which way the current flows', 'whether the charge carriers are positive or negative', 'the temperature of the strip', 'its resistivity'], a: 1,
      why: 'Opposite carriers drift opposite ways but are pushed to the same edge, so the charge that piles up there — and the voltage — has the opposite sign.' },
    { q: 'Once the Hall voltage has built up, the charge carriers move…', choices: ['along curved paths to one edge', 'straight along the strip, because the Hall electric force balances the magnetic force', 'across the strip', 'in circles'], a: 1,
      why: 'The sideways charge grows until $qE_H = qv_dB$; after that there is no net sideways force.' },
    { q: 'Hall sensors are made of metal because metals have the most charge carriers.', a: false,
      why: 'Many carriers mean a tiny Hall voltage. Sensors use semiconductors, whose low carrier density gives a much larger signal.' }
  ],
  applications: [
    'Hall probes and the electronic compasses in phones.',
    'Contactless current sensors and clamp meters.',
    'Position and speed sensors in cars: crankshaft timing, anti-lock brakes.',
    'Brushless motors, which use Hall sensors to know where the rotor is.',
    'Measuring carrier density and mobility in semiconductor research.'
  ],
  history: 'Edwin Hall discovered the effect in 1879 as a graduate student at Johns Hopkins University, eighteen years before the electron itself was discovered. Klaus von Klitzing found the quantum Hall effect in 1980.'
}

);
