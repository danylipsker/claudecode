/* HYPER-FEYNMAN · content/matter.js — Inside Matter: crystals, tensors, magnetism, elasticity, and the flow of
 * "dry" and "wet" water (FLP II-30 to II-41). Simulations in sims/matter.js (prefix mat-). */
Hyper.add(

{
  id: 'crystal-geometry', parent: 'solids-magnets', title: 'The geometry of crystals', level: 2,
  short: 'A crystal is one small pattern of atoms repeated over and over in space. Repetition is a strong constraint: a lattice can have only 2-, 3-, 4- and 6-fold rotation axes — never 5-fold — which is why crystals come in a limited number of symmetry types.',
  keywords: ['crystal', 'lattice', 'unit cell', 'basis', 'symmetry', 'rotation axis', 'crystallographic restriction', 'five-fold symmetry', 'quasicrystal', 'Penrose tiling', 'Bravais lattice', 'space group', 'wallpaper group', 'cleavage', 'dislocation', 'bubble raft'],
  prereq: ['atomic-hypothesis', 'symmetry-in-physical-law', 'physics:crystal-structure'],
  related: ['tensors-feyn', 'elasticity-feyn', 'electrons-in-crystals', 'chemistry:crystal-structures', 'math:polygons', 'math:linear-transformations'],
  body: `
Look at grains of table salt through a magnifying glass and you see little cubes; crush one and the pieces are still little cubes. Feynman opened his lectures on matter with crystals because they are the simplest solids to understand: the same small group of atoms repeated again and again, like the pattern on a wallpaper, but in three dimensions.

### Lattice and basis
Every crystal is described by two things. The **lattice** is the set of points you reach from one of them by whole-number steps along three fixed [[?vector|vectors]]:
$$\\vec R = n_1\\vec a + n_2\\vec b + n_3\\vec c, \\qquad n_1, n_2, n_3 = 0, \\pm 1, \\pm 2, \\dots$$
The **basis** is the group of atoms placed at every lattice point — one atom for copper, a sodium and a chlorine ion for rock salt, whole molecules for a protein crystal. The box spanned by $\\vec a, \\vec b, \\vec c$ is a **unit cell**: copies of it fill space without gaps. Cells are tiny — 0.3615 nm on a side for copper, 0.564 nm for rock salt — so a 1 mm grain of salt holds about $6\\times10^{18}$ of them. The whole crystal inherits the geometry of one cell: its faces meet at fixed angles, salt cleaves along cube faces and mica into sheets, and the density follows from what one cell holds, $\\rho = ZM/(N_A a^3)$.

### Which turns can a lattice survive?
Turn a square lattice by 90° about a lattice point and every point lands on another: a 4-fold axis. The triangular lattice has 6-fold axes, a rectangular one only 2-fold. What about 5-fold? Regular pentagons cannot tile a floor: three around a corner fill $3\\times108° = 324°$ and leave a 36° gap, four would overlap. The sim lets you try.

The argument that settles it for *every* lattice is short and pretty. Let A and B be lattice points a distance $a$ apart, the shortest distance in the lattice. If there is an $n$-fold axis through every lattice point, turn B about A by $2\\pi/n$, and A about B by the same angle the other way. Both images are lattice points, on a line parallel to AB, and their distance is
$$d = a\\left|1 - 2\\cos\\frac{2\\pi}{n}\\right|.$$
Along that line, lattice points are whole multiples of $a$ apart, so $2\\cos(2\\pi/n)$ must be a whole number. The [[?sine-cosine|cosine]] can then only be $1, \\tfrac12, 0, -\\tfrac12$ or $-1$:

| $n$ | turn | $2\\cos(2\\pi/n)$ | $d/a$ | in a lattice? |
|---|---|---|---|---|
| 2 | 180° | −2 | 3 | yes |
| 3 | 120° | −1 | 2 | yes |
| 4 | 90° | 0 | 1 | yes |
| 5 | 72° | 0.618 | 0.382 | no — closer than $a$ |
| 6 | 60° | 1 | 0 | yes — the points coincide |
| 8 | 45° | 1.414 | 0.414 | no |

This is the **crystallographic restriction**. Combining the allowed turns with mirrors and glides gives just 17 kinds of wallpaper pattern in the plane, and 14 lattice types and 230 space groups in three dimensions.

### Quasicrystals: order without repetition
The proof assumes exact repetition. In 1982 Dan Shechtman found sharp diffraction spots with ten-fold symmetry — the fingerprint of icosahedral, five-fold order — in a rapidly cooled aluminium–manganese alloy (published 1984; Nobel Prize in Chemistry 2011). The atoms are perfectly ordered but the pattern never repeats, like the Penrose tilings (1974) in the sim: two rhombi fit together with five-fold symmetry everywhere, yet no shift carries the whole pattern onto itself. Feynman's lectures (1962–63) came twenty years before; they state the classical rule, which still holds for every *periodic* crystal.

> [!key] Repetition forbids most symmetries: a lattice can only be turned onto itself by 180°, 120°, 90° or 60°. Five-fold order exists, but only in quasicrystals, which never repeat.

### Where the geometry shows
The same geometry governs how metals bend. Planes of atoms slide over one another not all at once but one row at a time, carried by **dislocations** — lines where the pattern has an extra half-plane of atoms. Feynman showed this with the bubble raft of Bragg and Nye: equal soap bubbles on water pack into a two-dimensional "metal" whose dislocations you can watch glide.
`,
  ideas: [
    'A crystal = a lattice of points (whole-number steps along three vectors) + a basis of atoms at each point.',
    'The unit cell repeats without gaps; density, cleavage and the angles between faces all come from it.',
    'Turning neighbouring lattice points about each other shows that 2cos(2π/n) must be a whole number: only 2-, 3-, 4- and 6-fold axes are possible.',
    'Five-fold order exists in quasicrystals, which are ordered but never repeat.',
    'Real crystals have defects; dislocations let metals bend at a small fraction of the ideal strength.'
  ],
  pitfalls: [
    'Crystals cannot have five-fold symmetry because pentagons are hard to pack — The pentagon picture is only a hint; the proof is about any lattice: a five-fold axis would put two lattice points closer than the shortest spacing.',
    'Quasicrystals disprove the crystallographic restriction — The restriction is about periodic lattices, and it stands; quasicrystals are ordered without being periodic.',
    'A crystal is perfect all the way through — Real crystals contain vacancies, dislocations and grain boundaries, and much of their strength and softness comes from them.'
  ],
  formulas: [
    {
      name: 'Two lattice points turned about each other by an n-fold axis',
      expr: 'd = a*abs(1 - 2*cos(2*pi/n))', tex: 'd = a\\left|1 - 2\\cos\\dfrac{2\\pi}{n}\\right|',
      vars: {
        d: { name: 'distance between the turned points', q: 'length', unit: 'nm' },
        a: { name: 'shortest distance between lattice points', q: 'length', unit: 'nm', value: 0.25 },
        n: { name: 'order of the rotation axis', int: true, value: 5, min: 2, max: 12 }
      },
      note: 'The turned points are lattice points only if d is 0 or a whole multiple of a: n = 2, 3, 4 or 6 (and the trivial n = 1).',
      stories: { d: 'In a lattice whose shortest spacing is {a}, suppose there were an axis of order {n}. How far apart would the two turned points be?' },
      practice: { unknowns: ['d'] }
    },
    {
      name: 'Density from the unit cell',
      expr: 'rho = Z*M/(NA*a^3)', tex: '\\rho = \\dfrac{Z M}{N_A a^3}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'g/cm³', tex: '\\rho' },
        Z: { name: 'atoms (or formula units) per cubic cell', int: true, value: 4 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 63.55 },
        NA: { const: 'NA' },
        a: { name: 'side of the cubic cell', q: 'length', unit: 'nm', value: 0.3615 }
      },
      note: 'For a cubic cell. Face-centred cubic metals have Z = 4, body-centred cubic Z = 2; rock salt has 4 NaCl units per cell.',
      stories: {
        rho: 'Copper is face-centred cubic with {Z} atoms in a cell of side {a}; its molar mass is {M}. What is its density?',
        a: 'A cubic crystal with {Z} formula units of molar mass {M} per cell has density {rho}. How long is the side of its cell?'
      }
    }
  ],
  examples: [
    {
      title: 'Why not five-fold?',
      q: 'In a lattice with shortest spacing $a = 0.25$ nm, find the distance $d$ between the two turned points for $n = 5$, 6 and 8, and say which axes are possible.',
      steps: [
        '$n = 5$: $2\\cos 72° = 0.618$, so $d = 0.25 \\times |1 - 0.618| = 0.0955$ nm — two lattice points closer than the shortest spacing: impossible.',
        '$n = 6$: $2\\cos 60° = 1$, so $d = 0$: the two turned points coincide. Allowed.',
        '$n = 8$: $2\\cos 45° = 1.414$, so $d = 0.25 \\times 0.414 = 0.104$ nm: impossible again.'
      ],
      a: '0.096 nm, 0 and 0.104 nm: only the six-fold axis survives.'
    },
    {
      title: 'The density of copper from one cell',
      q: 'Copper is face-centred cubic: 4 atoms per cubic cell of side 0.3615 nm, molar mass 63.55 g/mol. Find its density.',
      steps: [
        'Volume of the cell: $a^3 = (0.3615\\times10^{-9})^3 = 4.724\\times10^{-29}$ m³.',
        'Mass in the cell: $ZM/N_A = 4 \\times 0.06355/6.022\\times10^{23} = 4.221\\times10^{-25}$ kg.',
        '$\\rho = 4.221\\times10^{-25}/4.724\\times10^{-29} = 8935$ kg/m³.'
      ],
      a: 'About 8.94 g/cm³; the measured value is 8.96 g/cm³.'
    },
    {
      title: 'How many cells in a grain of salt?',
      q: 'A grain of salt is a cube 1 mm on a side; the cubic cell of rock salt is 0.564 nm on a side and holds 4 NaCl units. How many cells and units does the grain contain? Check with the mass (density 2.16 g/cm³, molar mass 58.44 g/mol).',
      steps: [
        'Cells: $(10^{-3}/0.564\\times10^{-9})^3 = (1.773\\times10^{6})^3 = 5.57\\times10^{18}$.',
        'NaCl units: $4 \\times 5.57\\times10^{18} = 2.23\\times10^{19}$.',
        'Check: mass $= 2.16$ mg, i.e. $2.16\\times10^{-3}/58.44 = 3.70\\times10^{-5}$ mol $= 2.23\\times10^{19}$ units.'
      ],
      a: 'About 5.6 × 10¹⁸ cells holding 2.2 × 10¹⁹ NaCl units.'
    }
  ],
  quiz: [
    { q: 'Which rotation axis can a periodic crystal lattice **not** have?', choices: ['5-fold (72°)', '6-fold (60°)', '4-fold (90°)', '3-fold (120°)'], a: 0, why: '2cos72° = 0.618 is not a whole number: turning two neighbours about each other by 72° would make lattice points closer than the shortest spacing.' },
    { q: 'A crystal lattice can have a 6-fold axis but not an 8-fold one.', a: true, why: '2cos60° = 1 is a whole number; 2cos45° = √2 is not.' },
    { q: 'In the proof, turning neighbours A and B about each other by 72° gives two lattice points 0.38a apart. What does this show?', choices: ['No lattice has a five-fold axis', 'The lattice spacing must be smaller than a', 'The pentagons must be distorted', 'The lattice must be three-dimensional'], a: 0, why: 'a was the shortest distance between lattice points; a shorter one is a contradiction, so the assumed five-fold axis cannot exist.' },
    { q: 'Shechtman\'s alloy gave sharp diffraction spots with ten-fold symmetry. The material is…', choices: ['ordered but not periodic', 'a glass, with no order at all', 'an ordinary crystal with a five-fold axis', 'a liquid'], a: 0, why: 'Sharp spots need long-range order; five-fold order is impossible in a periodic lattice, so the order is quasiperiodic.' },
    { q: 'Copper\'s cubic cell is 0.3615 nm on a side and holds 4 atoms. How many atoms are there in one cubic nanometre?', answer: 84.7, why: '4/(0.3615)³ = 4/0.04724 = 84.7 atoms per nm³.' }
  ],
  problems: [
    { q: 'Iron at room temperature is body-centred cubic (2 atoms per cell), with molar mass 55.85 g/mol and density 7.874 g/cm³. How long is the side of its cell?', answer: 0.2866, unit: 'nm', tol: 0.02, hint: 'Solve ρ = ZM/(N_A a³) for a.',
      steps: ['$a^3 = ZM/(N_A\\rho) = 2 \\times 0.05585/(6.022\\times10^{23} \\times 7874) = 2.356\\times10^{-29}$ m³.', '$a = (2.356\\times10^{-29})^{1/3} = 2.866\\times10^{-10}$ m = 0.287 nm.'] },
    { q: 'For a hypothetical 8-fold axis, how far apart would the two turned lattice points be, as a fraction of the shortest spacing a?', answer: 0.414, tol: 0.02, hint: 'd/a = |1 − 2cos(2π/n)|.',
      steps: ['$2\\cos 45° = \\sqrt2 = 1.414$.', '$d/a = |1 - 1.414| = 0.414$ — less than 1, so impossible.'] }
  ],
  applications: [
    'X-ray and electron crystallography work backwards from the diffraction spots to the lattice and the basis — the way the structures of salt, DNA and thousands of proteins and medicines were found.',
    'Silicon wafers are sliced along chosen crystal planes, and etching and cleaving follow the lattice.',
    'Turbine blades of jet engines are grown as single crystals, with no grain boundaries to weaken them at high temperature.'
  ],
  history: 'Nicolas Steno noticed in 1669 that the angles between the faces of quartz crystals are always the same. René-Just Haüy explained such regularities in the 1780s by stacking identical building blocks. Auguste Bravais classified the lattices in 1848, and Evgraf Fedorov and Arthur Schoenflies independently found the 230 space groups around 1891. Max von Laue showed in 1912 that crystals diffract X-rays, and the Braggs turned it into a way of finding structures in 1913. Lawrence Bragg and John Nye made their bubble-raft model of a metal in 1947. Dan Shechtman observed the first quasicrystal in 1982 (published 1984), and in 1992 the International Union of Crystallography widened its definition of a crystal to include such ordered, non-periodic solids.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 30 (The Internal Geometry of Crystals) — lattices and bonds, the symmetries possible in two and three dimensions, the strength of metals, dislocations and the Bragg–Nye bubble model.',
    'Vol. I, ch. 1 (Atoms in Motion) — the repeating arrangement of atoms in a crystal of ice, one of the pictures that open the course.'
  ],
  sim: 'mat-tiling'
},

{
  id: 'tensors-feyn', parent: 'solids-magnets', title: 'Tensors', level: 3,
  short: 'In a crystal a push in one direction can produce a response in another. A tensor is the rule that turns one vector into another: a table of nine numbers that change when you turn your axes, describing one thing that does not.',
  keywords: ['tensor', 'polarizability', 'anisotropy', 'principal axes', 'ellipsoid', 'energy ellipsoid', 'stress tensor', 'inertia tensor', 'symmetric tensor', 'rank', 'birefringence', 'calcite', 'invariant', 'Mohr'],
  prereq: ['vectors-and-symmetry', 'crystal-geometry', 'dielectrics-feyn', 'math:matrices'],
  related: ['elasticity-feyn', 'rotation-feyn', 'four-vectors-feyn', 'math:eigenvalues', 'math:linear-transformations', 'physics:stress-strain'],
  body: `
### A push that goes sideways
Put glass in an electric field $\\vec E$ and the electrons of every atom shift a little against the field; the dipole moment per unit volume $\\vec P$ points along $\\vec E$, and one number (the polarizability) relates them. In a crystal the electrons may be easier to shift along some directions than others — along a chain of atoms rather than across it. Then $\\vec P$ is **not** parallel to $\\vec E$: each component of $\\vec P$ depends on all three components of $\\vec E$,
$$P_x = \\alpha_{xx}E_x + \\alpha_{xy}E_y + \\alpha_{xz}E_z$$
and two more lines like it for $P_y$ and $P_z$. The nine coefficients $\\alpha_{ij}$ are the **polarizability [[?tensor]]**, conveniently written as a 3 × 3 [[?matrix]]. Read $\\alpha_{ij}$ as "the $i$-component of the response to a push along $j$". With the [[?summation-convention]] the three lines become one: $P_i = \\alpha_{ij}E_j$.

### Turn the axes, keep the thing
The nine numbers depend on how we happened to set up $x$, $y$, $z$. Turn the axes and the numbers change — each index changing the way a component of a [[?vector]] does — yet the crystal and its behaviour are exactly what they were. That is what makes $\\alpha$ a tensor: a physical thing whose *components* follow a definite rule when the axes turn. In two dimensions, for a crystal whose principal axis 1 lies at angle $\\theta$ from our $x$ axis,
$$\\alpha_{xx} = \\alpha_1\\cos^2\\theta + \\alpha_2\\sin^2\\theta, \\quad \\alpha_{yy} = \\alpha_1\\sin^2\\theta + \\alpha_2\\cos^2\\theta, \\quad \\alpha_{xy} = (\\alpha_1-\\alpha_2)\\sin\\theta\\cos\\theta.$$
Some combinations never change: the sum $\\alpha_{xx} + \\alpha_{yy} = \\alpha_1 + \\alpha_2$ and the [[?determinant]]. They are the tensor's [[?invariant|invariants]], properties of the crystal rather than of our axes.

### The ellipse
Here is the picture to keep — it is what the sim draws. Take every push of unit size, their tips on a circle. The responses $\\vec P$ have their tips on an **ellipse**, with semi-axes $\\alpha_1$ and $\\alpha_2$ along the principal axes. Only along those two directions is the response parallel to the push; they are the [[?eigenvalue|eigenvectors]] of the matrix, and $\\alpha_1, \\alpha_2$ its eigenvalues. Turn the axes in the sim: the table of numbers changes, the ellipse does not. In three dimensions the ellipse becomes an ellipsoid. Feynman's version uses the energy $u = \\tfrac12\\vec E\\cdot\\vec P$: the surface $\\alpha_{ij}x_ix_j = 1$ is the **energy ellipsoid**, and since the polarizability tensor is symmetric ($\\alpha_{ij} = \\alpha_{ji}$, which he derives from energy conservation) it always has three perpendicular principal axes.

Symmetry decides how many different numbers are needed. A cubic crystal such as rock salt has one: its tensor is a number times the identity, and it behaves like glass. Calcite and quartz have a special axis and need two: light polarized along and across the axis travels at different speeds (calcite: refractive indices 1.658 and 1.486 at 589 nm), so a calcite crystal shows a double image.

### Other tensors

| Tensor | turns this vector… | …into this one | example |
|---|---|---|---|
| polarizability $\\alpha_{ij}$ | electric field | polarization | calcite, quartz |
| inertia $I_{ij}$ | angular velocity $\\vec\\omega$ | angular momentum $\\vec L$ | a book spun about a slanted axis wobbles |
| stress $S_{ij}$ | the normal $\\hat n$ of a surface | the force per area across it | a fluid at rest: $S_{ij} = -p\\,\\delta_{ij}$ |
| conductivity $\\sigma_{ij}$ | electric field | current density | graphite, layered crystals |

For stress the $\\delta_{ij}$ is the [[?kronecker-delta]]: in a fluid at rest every surface feels a pure push $p$, whatever its tilt. In a solid it is different: a rod pulled with stress $\\sigma$ has, on a plane tilted at 45°, a *shear* stress $\\sigma/2$ — the formulas above with $\\alpha_1 = \\sigma$, $\\alpha_2 = 0$. The elasticity of a crystal needs a tensor with four indices, $C_{ijkl}$, turning strain into stress: 21 independent numbers in general, 3 for a cubic crystal, 2 for glass.

> [!key] A tensor is not its table of numbers. It is the linear rule that turns one vector into another; the numbers are its shadow on one particular set of axes, and they change when the axes turn, just as a vector's components do.
`,
  ideas: [
    'In an anisotropic crystal the response (polarization, current, angular momentum) is not parallel to the push; a tensor gives each response component from all push components.',
    'The components of a tensor change when the axes turn; the physical object does not. Trace and determinant are invariants.',
    'A symmetric tensor turns a circle of pushes into an ellipse (an ellipsoid in 3-D) whose axes are the principal axes, the eigenvectors.',
    'Crystal symmetry fixes how many numbers are needed: one for cubic crystals, two for calcite and quartz, three in general.',
    'Stress, inertia, conductivity and elasticity (rank 4) are tensors too.'
  ],
  pitfalls: [
    'A tensor is just a matrix — A matrix is a table of numbers; a tensor is a physical relation whose table changes in a definite way when the axes turn. The same tensor has different matrices on different axes.',
    'The response always points along the push — Only along the principal axes; in between, the response leans toward the axis with the larger principal value.',
    'Pressure is a vector because it pushes in a direction — Pressure is the stress tensor −p δᵢⱼ: it gives a force on every surface, along that surface\'s normal, whatever its direction.'
  ],
  derivation: {
    title: 'Components along turned axes',
    intro: 'A symmetric tensor in two dimensions, with principal values α₁ and α₂; its principal axis 1 makes angle θ with our x axis.',
    steps: [
      { text: 'Along the principal axes the response is simple: each component is multiplied by its own principal value.', tex: 'P_1 = \\alpha_1 E_1, \\qquad P_2 = \\alpha_2 E_2' },
      { text: 'A unit push along our $x$ axis has components $\\cos\\theta$ along axis 1 and $-\\sin\\theta$ along axis 2 (axis 2 is turned 90° further).', tex: 'E_1 = \\cos\\theta, \\qquad E_2 = -\\sin\\theta' },
      { text: 'So its response is, in principal components:', tex: 'P_1 = \\alpha_1\\cos\\theta, \\qquad P_2 = -\\alpha_2\\sin\\theta' },
      { text: 'Project the response back on our $x$ axis (the [[?dot-product]] with the push itself): that is $\\alpha_{xx}$.', tex: '\\alpha_{xx} = P_1\\cos\\theta - P_2\\sin\\theta = \\alpha_1\\cos^2\\theta + \\alpha_2\\sin^2\\theta' },
      { text: 'Project it on our $y$ axis, whose principal components are $(\\sin\\theta, \\cos\\theta)$: that is $\\alpha_{yx}$, equal to $\\alpha_{xy}$.', tex: '\\alpha_{yx} = P_1\\sin\\theta + P_2\\cos\\theta = (\\alpha_1 - \\alpha_2)\\sin\\theta\\cos\\theta' }
    ],
    outro: 'Adding $\\alpha_{xx}$ and $\\alpha_{yy} = \\alpha_1\\sin^2\\theta + \\alpha_2\\cos^2\\theta$ gives $\\alpha_1 + \\alpha_2$ for every $\\theta$: the trace is an invariant.'
  },
  formulas: [
    {
      name: 'A diagonal component on turned axes',
      expr: 'axx = a1*cos(theta)^2 + a2*sin(theta)^2', tex: '\\alpha_{xx} = \\alpha_1\\cos^2\\theta + \\alpha_2\\sin^2\\theta',
      vars: {
        axx: { name: 'component along our x axis', tex: '\\alpha_{xx}' },
        a1: { name: 'principal value 1 (e.g. relative permittivity of calcite across its axis)', value: 2.75, tex: '\\alpha_1' },
        a2: { name: 'principal value 2 (along the axis)', value: 2.21, tex: '\\alpha_2' },
        theta: { name: 'angle of principal axis 1 from our x axis', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'Principal values of any symmetric tensor, in any units; calcite\'s relative permittivity at optical frequencies (n² = 1.658², 1.486²) is the default.',
      stories: { axx: 'A crystal has principal values {a1} and {a2}; its axis 1 is turned {theta} from x. What is the xx component?', theta: 'Principal values {a1} and {a2}; the measured xx component is {axx}. At what angle is principal axis 1?' }
    },
    {
      name: 'An off-diagonal component on turned axes',
      expr: 'axy = (a1 - a2)*sin(theta)*cos(theta)', tex: '\\alpha_{xy} = (\\alpha_1 - \\alpha_2)\\sin\\theta\\cos\\theta',
      vars: {
        axy: { name: 'off-diagonal component', signed: true, tex: '\\alpha_{xy}' },
        a1: { name: 'principal value 1', value: 2.75, tex: '\\alpha_1' },
        a2: { name: 'principal value 2', value: 2.21, tex: '\\alpha_2' },
        theta: { name: 'angle of principal axis 1 from our x axis', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'Zero on the principal axes (θ = 0 or 90°), largest at 45°, where it is (α₁ − α₂)/2. With α₁ = σ and α₂ = 0 it is the shear stress on a plane tilted by θ in a rod under tension σ.',
      stories: { axy: 'Principal values {a1} and {a2}, axes turned by {theta}. What is the off-diagonal component?' }
    },
    {
      name: 'Which way the response points',
      expr: 'phi = atan(a2*tan(theta)/a1)', tex: '\\tan\\varphi = \\dfrac{\\alpha_2}{\\alpha_1}\\tan\\theta',
      vars: {
        phi: { name: 'angle of the response from principal axis 1', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\varphi' },
        a1: { name: 'principal value 1', value: 2.75, tex: '\\alpha_1' },
        a2: { name: 'principal value 2', value: 2.21, tex: '\\alpha_2' },
        theta: { name: 'angle of the push from principal axis 1', q: 'angle', unit: '°', value: 45, min: 0, max: 89.9, tex: '\\theta' }
      },
      note: 'The response leans toward the axis with the larger principal value; it is parallel to the push only at θ = 0 or 90°.',
      stories: { phi: 'A push is applied at {theta} to principal axis 1 of a crystal with principal values {a1} and {a2}. At what angle from that axis does the response point?' }
    }
  ],
  examples: [
    {
      title: 'Calcite, pushed at 45°',
      q: 'Calcite at optical frequencies has principal relative permittivities 2.75 (across its axis) and 2.21 (along it). An electric field makes 45° with the first principal axis. Find the components $\\varepsilon_{xx}$ and $\\varepsilon_{xy}$ on axes along and across the field, and the angle between $\\vec D$ and $\\vec E$.',
      steps: [
        '$\\varepsilon_{xx} = 2.75\\cos^2 45° + 2.21\\sin^2 45° = (2.75 + 2.21)/2 = 2.48$.',
        '$\\varepsilon_{xy} = (2.75 - 2.21)\\sin45°\\cos45° = 0.54/2 = 0.27$.',
        'Direction of the response: $\\tan\\varphi = (2.21/2.75)\\tan45° = 0.804$, so $\\varphi = 38.8°$ from axis 1.',
        'The field is at 45°, so $\\vec D$ leans 6.2° away from $\\vec E$, toward the axis with the larger permittivity.'
      ],
      a: 'ε_xx = 2.48, ε_xy = 0.27; D is 6.2° off E.'
    },
    {
      title: 'The invariants survive a turn',
      q: 'For principal values 2.75 and 2.21 with the axes turned by 30°, compute $\\alpha_{xx}$, $\\alpha_{yy}$, $\\alpha_{xy}$, and check the trace and the determinant.',
      steps: [
        '$\\alpha_{xx} = 2.75(0.75) + 2.21(0.25) = 2.615$; $\\alpha_{yy} = 2.75(0.25) + 2.21(0.75) = 2.345$.',
        '$\\alpha_{xy} = 0.54 \\times 0.5 \\times 0.866 = 0.234$.',
        'Trace: $2.615 + 2.345 = 4.960 = 2.75 + 2.21$.',
        'Determinant: $2.615 \\times 2.345 - 0.234^2 = 6.132 - 0.055 = 6.078 = 2.75 \\times 2.21$.'
      ],
      a: 'The components all changed; trace 4.96 and determinant 6.08 did not.'
    },
    {
      title: 'Why a pulled rod fails at 45°',
      q: 'A rod carries a tensile stress of 100 MPa along its length. Find the normal and shear stress on a plane whose normal is at 30° to the rod, and the largest shear stress on any plane.',
      steps: [
        'The stress tensor has principal values $\\sigma = 100$ MPa (along the rod) and 0 (across it).',
        'Normal stress: $\\sigma\\cos^2 30° = 75$ MPa; shear stress: $\\sigma\\sin30°\\cos30° = 43.3$ MPa.',
        'The shear $\\sigma\\sin\\theta\\cos\\theta = \\tfrac12\\sigma\\sin2\\theta$ is largest at 45°: 50 MPa.'
      ],
      a: '75 MPa normal, 43 MPa shear; at most 50 MPa of shear, on planes at 45° — where ductile metals slip.'
    }
  ],
  quiz: [
    { q: 'In an anisotropic crystal, the polarization is parallel to the electric field when…', choices: ['the field lies along a principal axis', 'always', 'never', 'only when the field is weak'], a: 0, why: 'Along a principal axis the tensor just multiplies by a number (an eigenvalue); in other directions the response leans toward the axis with the larger value.' },
    { q: 'Turning your coordinate axes changes the components αᵢⱼ but not the ellipse that the responses trace.', a: true, why: 'The ellipse is the crystal\'s behaviour; the components are its description on particular axes.' },
    { q: 'Which combination of the 2-D components does not change when the axes turn?', choices: ['α_xx + α_yy', 'α_xx', 'α_xy', 'α_xx − α_yy'], a: 0, why: 'α_xx + α_yy = α₁cos²θ + α₂sin²θ + α₁sin²θ + α₂cos²θ = α₁ + α₂ for any θ.' },
    { q: 'Rock salt has cubic symmetry. Its polarizability tensor is…', choices: ['a single number times the identity', 'three different principal values', 'two different principal values', 'zero'], a: 0, why: 'The three cube axes are equivalent, so the principal values are equal; the ellipsoid is a sphere and the crystal acts like glass.' },
    { q: 'A rod under 200 MPa tension. What is the largest shear stress on any plane through it (in MPa)?', answer: 100, why: 'Shear on a plane at θ is σ sinθ cosθ = ½σ sin2θ, largest (100 MPa) at 45°.' }
  ],
  problems: [
    { q: 'A symmetric tensor has principal values 5 and 2 (same units). Our x axis makes 30° with principal axis 1. Find the off-diagonal component α_xy.', answer: 1.299, tol: 0.02, hint: 'α_xy = (α₁ − α₂) sinθ cosθ.',
      steps: ['$(5 - 2)\\sin30°\\cos30° = 3 \\times 0.5 \\times 0.866$.', '$= 1.30$.'] },
    { q: 'A crystal has principal values 4 and 1. A push is applied at 60° to principal axis 1. At what angle to that axis does the response point (in degrees)?', answer: 23.4, unit: '°', tol: 0.02, hint: 'tan φ = (α₂/α₁) tan θ.',
      steps: ['$\\tan\\varphi = (1/4)\\tan60° = 0.433$.', '$\\varphi = 23.4°$: the response leans 36.6° away from the push, toward axis 1.'] }
  ],
  applications: [
    'Polarizing optics — calcite prisms, quartz and mica wave plates — use crystals whose permittivity tensor has two different principal values.',
    'Photoelasticity: a stressed transparent plastic becomes birefringent, and between crossed polarizers the stress tensor shows up as coloured fringes.',
    'Diffusion-tensor MRI measures, voxel by voxel, the tensor of water diffusion in the brain; its long axis follows nerve fibres.',
    'Engineers find principal stresses and the planes of greatest shear (Mohr\'s circle) to predict where parts will yield.'
  ],
  history: 'Augustin-Louis Cauchy described the state of stress in a solid by what we now call the stress tensor in the 1820s. The word "tensor" in its modern physical sense was introduced by Woldemar Voigt in 1898 in his work on crystal physics — the name comes from tension. Gregorio Ricci-Curbastro and Tullio Levi-Civita set out the tensor calculus in 1900, and Einstein built general relativity on it in 1915.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 31 (Tensors) — the tensor of polarizability, how its components transform, the energy ellipsoid, the inertia and stress tensors, tensors of higher rank and the four-tensor of electromagnetic momentum.',
    'Vol. II, ch. 39 (Elastic Materials) — the tensors of strain and of elasticity.'
  ],
  sim: 'mat-tensor'
},

{
  id: 'magnetism-of-matter', parent: 'solids-magnets', title: 'Why magnetism needs quantum mechanics', level: 3,
  short: 'Diamagnetism, paramagnetism and ferromagnetism all come from electrons — yet classical physics predicts none of them: in thermal equilibrium a magnetic field cannot magnetize classical charges at all. Magnetism in matter is a quantum effect, of quantized angular momentum and of spin.',
  keywords: ['diamagnetism', 'paramagnetism', 'magnetic moment', 'gyromagnetic ratio', 'Bohr magneton', 'Larmor precession', 'Larmor theorem', 'Bohr–van Leeuwen theorem', 'spin', 'g-factor', 'susceptibility', 'magnetization', 'skipping orbits', 'levitating frog'],
  prereq: ['magnetostatics-feyn', 'boltzmann-law', 'spin-half', 'physics:magnetic-materials'],
  related: ['paramagnetism-nmr', 'ferromagnetism-feyn', 'gyroscope-feyn', 'angular-momentum-quantum', 'magnetic-moment-g2', 'charges-in-fields', 'physics:electron-spin', 'physics:charged-particle-motion'],
  body: `
### Three kinds of magnetic matter
Everything responds to a magnetic field, nearly always feebly. The magnetization $\\vec M$ (magnetic moment per unit volume) is proportional to the field, $\\vec M = \\chi\\vec B/\\mu_0$, with a susceptibility $\\chi$ that is usually tiny:

| Material | $\\chi$ (SI) | kind |
|---|---|---|
| water | $-9.0\\times10^{-6}$ | diamagnetic: pushed out of strong fields |
| copper | $-9.6\\times10^{-6}$ | diamagnetic |
| bismuth | $-1.7\\times10^{-4}$ | the most diamagnetic metal |
| oxygen gas | $+1.9\\times10^{-6}$ | paramagnetic: pulled into strong fields |
| aluminium | $+2.2\\times10^{-5}$ | paramagnetic |
| iron | up to about $10^{5}$ | ferromagnetic — and not proportional at all |

### Moments come from turning charge
A charge $q$ going round an orbit is a little current loop. Its magnetic moment is proportional to its angular momentum, $\\mu = (q/2m)L$, with the same ratio whatever the orbit. The quantum of angular momentum $\\hbar$ gives the **Bohr magneton** $\\mu_B = e\\hbar/2m_e = 9.274\\times10^{-24}$ J/T. The electron's spin carries only $\\hbar/2$ but a moment of almost exactly $\\mu_B$ — twice as much per unit of angular momentum ($g \\approx 2.0023$).

Because moment and angular momentum go together, a torque $\\vec\\mu\\times\\vec B$ does not simply line the moment up: it makes it **precess** about the field, like a spinning top tipped over by gravity, at the Larmor frequency $\\omega_L = qB/2m$. Larmor's theorem says that, to first order, a field just sets the whole electron cloud of an atom turning at $\\omega_L$. That extra turning is a current whose moment opposes the field: diamagnetism.

### Classical physics gives no magnetism at all
Now the surprise, which Feynman treated with care. In thermal equilibrium the chance of any arrangement of positions and velocities is set by its energy through the [[?boltzmann-factor]] $e^{-E/kT}$. The magnetic force $q\\vec v\\times\\vec B$ is always at right angles to the velocity ([[?cross-product]]): it does **no work**, so the energy of every arrangement is the same with or without the field. The equilibrium distribution of velocities is unchanged — and so is the average current: $\\vec M = 0$ for every $B$. This is the Bohr–van Leeuwen theorem (Niels Bohr, 1911; Hendrika van Leeuwen, 1919).

But surely each circling electron is a small diamagnetic current? The sim answers it. Electrons deep in a box circle one way; those near a wall cannot complete their circles and **skip along the wall** in the opposite sense. There are fewer of them, but their paths enclose the whole box, and their moment cancels the bulk exactly. Watch the two running averages in the sim approach equal and opposite values.

### Enter quantum mechanics
Quantum mechanics breaks the deadlock in two ways. Angular momentum comes in lumps, so an atom's moment has a fixed size and can point only in a few ways — for spin ½, along or against the field, with energies $\\mp\\mu B$. The energy now depends on orientation, the Boltzmann factor favours alignment, and paramagnetism appears; diamagnetism survives as the quantum version of Larmor's turning. And ferromagnetism comes from the Pauli exclusion principle acting through the electrostatic energy (see [[ferromagnetism-feyn]]). Switch the sim to *quantum spins* to see a moment appear. At room temperature it is small, because $\\mu_B B$ in 1 T is 58 µeV, against $kT = 26$ meV.

> [!key] A magnetic force never does work, so classical charges in thermal equilibrium cannot be magnetized: the bulk currents and the currents skipping along the walls cancel. Every magnet — the fridge magnet included — is a quantum object.
`,
  ideas: [
    'Magnetic moment is tied to angular momentum: μ = (q/2m)L for orbits; the spin moment is about twice as large for its ħ/2.',
    'A torque on a moment with angular momentum makes it precess at the Larmor frequency, as a top does; the induced turning is diamagnetic.',
    'The magnetic force does no work, so in thermal equilibrium classical charges have zero magnetization (Bohr–van Leeuwen).',
    'In a box, bulk orbits and orbits skipping along the walls give equal and opposite moments.',
    'Quantized moments with fixed size and few orientations make paramagnetism, diamagnetism and ferromagnetism possible.'
  ],
  pitfalls: [
    'Each electron circling in a field is a small current loop, so a classical metal must be diamagnetic — The electrons skipping along the boundary circulate the other way and cancel the bulk exactly.',
    'Classical physics explained paramagnetism with Langevin\'s theory — Langevin\'s 1905 theory assumed atoms with permanent moments of fixed size, which classical physics cannot supply; that is the quantum input.',
    'A magnetic moment in a field simply turns to line up — Because it carries angular momentum it precesses around the field; it lines up only by losing energy to its surroundings.'
  ],
  derivation: {
    title: 'The magnetic moment of an orbit',
    intro: 'A charge q of mass m goes round a circle of radius r at speed v.',
    steps: [
      { text: 'The charge passes any point once per period $2\\pi r/v$, so the orbit is a current:', tex: 'I = \\frac{q}{2\\pi r/v} = \\frac{qv}{2\\pi r}' },
      { text: 'The moment of a current loop is current times area:', tex: '\\mu = I\\,\\pi r^2 = \\frac{qvr}{2}' },
      { text: 'Recognise the angular momentum $L = mvr$ and write the moment in terms of it:', tex: '\\mu = \\frac{q}{2m}\\,(mvr) = \\frac{q}{2m}L' },
      { text: 'The ratio $q/2m$ does not depend on $r$ or $v$ — it holds for any orbit, circular or not. With one quantum of angular momentum for an electron:', tex: '\\mu_B = \\frac{e\\hbar}{2m_e} = 9.274\\times10^{-24}\\ \\mathrm{J/T}' }
    ]
  },
  formulas: [
    {
      name: 'Magnetic moment of an orbiting charge',
      expr: 'mu = qe*L/(2*m)', tex: '\\mu = \\dfrac{e}{2m}L',
      vars: {
        mu: { name: 'magnetic moment', q: 'mdipole', unit: 'µB', tex: '\\mu' },
        qe: { const: 'qe' },
        L: { name: 'orbital angular momentum', q: 'angmom', unit: 'ħ', value: 1 },
        m: { const: 'me', name: 'mass of the electron', tex: 'm' }
      },
      note: 'For the electron\'s orbital motion. The spin moment is g = 2.0023 times larger for the same angular momentum: one Bohr magneton for spin ħ/2.',
      stories: { mu: 'An electron has orbital angular momentum {L}. What is its magnetic moment?' }
    },
    {
      name: 'The Larmor frequency of electron orbits',
      expr: 'f = qe*B/(4*pi*m)', tex: 'f_L = \\dfrac{\\omega_L}{2\\pi} = \\dfrac{eB}{4\\pi m}',
      vars: {
        f: { name: 'precession frequency', q: 'frequency', unit: 'GHz', tex: 'f_L' },
        qe: { const: 'qe' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 },
        m: { const: 'me', name: 'mass of the electron', tex: 'm' }
      },
      note: 'Orbital precession (Larmor\'s theorem). Spins precess at about twice this rate, 28 GHz per tesla.',
      stories: { f: 'At what frequency do the electron orbits of an atom precess in a field of {B}?', B: 'What field makes electron orbits precess at {f}?' }
    },
    {
      name: 'Magnetic energy against thermal energy',
      expr: 'x = mu*B/(kB*T)', tex: 'x = \\dfrac{\\mu B}{k_B T}',
      vars: {
        x: { name: 'ratio of magnetic to thermal energy' },
        mu: { name: 'atomic moment', q: 'mdipole', unit: 'µB', value: 1, tex: '\\mu' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'When x ≪ 1 the field barely orders the moments and the magnetization is proportional to x; when x ≫ 1 they nearly all line up.',
      stories: { x: 'Compare the energy of a moment of {mu} in {B} with the thermal energy at {T}.', T: 'Below what temperature does a moment of {mu} in {B} have magnetic energy {x} times kT?' }
    },
    {
      name: 'Levitating a diamagnet',
      expr: 'G = mu0*rho*g/chi', tex: 'G = B\\dfrac{dB}{dz} = \\dfrac{\\mu_0\\rho g}{\\lvert\\chi\\rvert}',
      vars: {
        G: { name: 'field times its vertical gradient, B·dB/dz', unit: 'T²/m', tex: 'G' },
        mu0: { const: 'mu0' },
        rho: { name: 'density of the material', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        chi: { name: 'size of its (negative) susceptibility, |χ|', value: 9.0e-6, tex: '\\chi' }
      },
      note: 'The magnetic energy per volume of a diamagnet is |χ|B²/2μ₀; its upward gradient must balance the weight per volume ρg. Water (and a frog, mostly water) needs about 1400 T²/m.',
      stories: { G: 'What value of B·dB/dz lifts a diamagnet of density {rho} and susceptibility −{chi}?' }
    }
  ],
  examples: [
    {
      title: 'The Bohr magneton and room temperature',
      q: 'Compute the Bohr magneton, the energy $\\mu_B B$ of an electron moment in 1 T, and compare it with $kT$ at 300 K.',
      steps: [
        '$\\mu_B = e\\hbar/2m_e = 1.602\\times10^{-19} \\times 1.0546\\times10^{-34}/(2 \\times 9.109\\times10^{-31}) = 9.274\\times10^{-24}$ J/T.',
        'In 1 T: $9.274\\times10^{-24}$ J $= 57.9$ µeV.',
        '$kT = 1.381\\times10^{-23} \\times 300 = 4.14\\times10^{-21}$ J $= 25.9$ meV.',
        'Ratio: $x = 9.274\\times10^{-24}/4.14\\times10^{-21} = 0.0022$.'
      ],
      a: 'μ_B B is only 0.22 % of kT: paramagnetism at room temperature is weak.'
    },
    {
      title: 'How strong a magnet floats a frog?',
      q: 'Water has density 1000 kg/m³ and susceptibility $-9.0\\times10^{-6}$. What value of $B\\,dB/dz$ levitates it? If the field is 11 T at that point, what gradient is needed?',
      steps: [
        '$B\\,dB/dz = \\mu_0\\rho g/|\\chi| = 1.257\\times10^{-6} \\times 1000 \\times 9.81/9.0\\times10^{-6}$.',
        '$= 1370$ T²/m.',
        'At $B = 11$ T: $dB/dz = 1370/11 = 125$ T/m — the field must fall by about 1.25 T per centimetre.'
      ],
      a: 'About 1400 T²/m — reached near the ends of the bore of a 16 T laboratory magnet, where frogs, strawberries and water drops have been floated.'
    },
    {
      title: 'Larmor frequencies',
      q: 'Find the orbital Larmor frequency of electrons in 1 T, and in Earth\'s field of 50 µT.',
      steps: [
        '$f = eB/4\\pi m_e = 1.602\\times10^{-19} \\times 1/(4\\pi \\times 9.109\\times10^{-31}) = 1.400\\times10^{10}$ Hz.',
        'In 50 µT: $1.400\\times10^{10} \\times 5\\times10^{-5} = 7.0\\times10^{5}$ Hz.'
      ],
      a: '14.0 GHz in 1 T; 700 kHz in Earth\'s field.'
    }
  ],
  quiz: [
    { q: 'Why does classical physics predict zero magnetization in thermal equilibrium?', choices: ['The magnetic force does no work, so it cannot change the energies that set the equilibrium distribution', 'Electrons move too slowly', 'Laboratory fields are too weak', 'Atoms are too far apart'], a: 0, why: 'The Boltzmann distribution depends only on energy; q v × B is perpendicular to v, so the field changes no energy and no average current appears.' },
    { q: 'In the classical box, the electrons circling in the bulk give a diamagnetic moment, and the electrons skipping along the walls give an equal and opposite one.', a: true, why: 'Skipping orbits run the other way round, and although fewer, they enclose the whole area of the box; the sum is zero.' },
    { q: 'A charge circling with angular momentum L has a magnetic moment proportional to…', choices: ['L', 'L²', '1/L', 'nothing: it is independent of L'], a: 0, why: 'μ = (q/2m)L for any orbit.' },
    { q: 'A diamagnetic object near a strong magnet is…', choices: ['pushed toward weaker field', 'pulled into the strongest field', 'unaffected', 'turned to point north'], a: 0, why: 'Its induced moment opposes the field, so its energy rises with B²; it moves toward weaker field — which is how frogs are levitated.' },
    { q: 'What is the energy μ_B·B of an electron moment in a 1 T field, in µeV?', answer: 57.9, why: '9.274 × 10⁻²⁴ J / 1.602 × 10⁻¹⁹ J/eV = 5.79 × 10⁻⁵ eV.' }
  ],
  problems: [
    { q: 'Estimate μ_B B/kT for an electron spin in a 2 T field at 4.2 K (liquid helium).', answer: 0.320, tol: 0.02, hint: 'x = μ_B B/(k_B T).',
      steps: ['$\\mu_B B = 9.274\\times10^{-24} \\times 2 = 1.855\\times10^{-23}$ J.', '$k_BT = 1.381\\times10^{-23} \\times 4.2 = 5.80\\times10^{-23}$ J.', '$x = 0.320$: now the field orders the spins substantially.'] },
    { q: 'Water has susceptibility −9.0 × 10⁻⁶ and density 1000 kg/m³. Bismuth has −1.7 × 10⁻⁴ and density 9780 kg/m³. How many times smaller a B·dB/dz is needed to levitate bismuth than water?', answer: 1.93, tol: 0.03, hint: 'The required B·dB/dz is proportional to ρ/|χ|.',
      steps: ['Water: $\\rho/|\\chi| = 1000/9.0\\times10^{-6} = 1.11\\times10^{8}$.', 'Bismuth: $9780/1.7\\times10^{-4} = 5.75\\times10^{7}$.', 'Ratio $1.11\\times10^8/5.75\\times10^7 = 1.93$: bismuth, though ten times denser, floats about twice as easily.'] }
  ],
  applications: [
    'Diamagnetic levitation: frogs, drops of water and pyrolytic graphite float in strong or well-shaped magnetic fields.',
    'A superconductor is a perfect diamagnet (χ = −1): it expels the field altogether — see [[superconductivity-feyn]].',
    'Paramagnetic oxygen analysers, used in hospitals and industry, measure oxygen by the force a magnetic field exerts on it.',
    'Electron spin resonance at about 28 GHz per tesla detects free radicals and defects with unpaired electrons.'
  ],
  history: 'Michael Faraday discovered in 1845 that bismuth and many other substances are weakly repelled by a magnet, and named the effect diamagnetism. Pierre Curie found in 1895 that paramagnetic susceptibility falls as 1/T. Paul Langevin gave a classical theory of both in 1905, but it needed atoms with permanent moments of fixed size. Niels Bohr in his 1911 doctoral thesis, and independently Hendrika Johanna van Leeuwen in hers (1919, published 1921), proved that consistent classical statistical mechanics gives no magnetization at all. Otto Stern and Walther Gerlach saw space quantization of atomic moments in 1922, and Samuel Goudsmit and George Uhlenbeck proposed the electron\'s spin in 1925.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 34 (The Magnetism of Matter) — diamagnetism and paramagnetism, magnetic moments and angular momentum, the precession of atomic magnets, Larmor\'s theorem, why classical physics gives neither diamagnetism nor paramagnetism, and angular momentum in quantum mechanics.',
    'Vol. II, ch. 35 (Paramagnetism and Magnetic Resonance) — quantized magnetic states.',
    'Vol. I, ch. 20 (Rotation in Space) — the precessing gyroscope, the mechanical model for a precessing magnetic moment.'
  ],
  sim: 'mat-bvl'
},

{
  id: 'paramagnetism-nmr', parent: 'solids-magnets', title: 'Paramagnetism and magnetic resonance', level: 3,
  short: 'An atomic magnet in a field can point only in a few quantized ways; heat fights the field, giving the weak paramagnetism of Curie\'s law. The same magnets precess at the Larmor frequency, and a small field rotating at exactly that frequency tips them over — magnetic resonance, the principle of NMR and MRI.',
  keywords: ['paramagnetism', 'Curie law', 'magnetic resonance', 'NMR', 'MRI', 'Larmor frequency', 'precession', 'gyromagnetic ratio', 'rotating frame', 'Rabi', 'Stern–Gerlach', 'relaxation', 'T1', 'T2', 'free induction decay', 'adiabatic demagnetization', '90° pulse', 'spin flip'],
  prereq: ['magnetism-of-matter', 'resonance-feyn', 'spin-half', 'boltzmann-law'],
  related: ['stern-gerlach-filters', 'two-state-systems', 'hyperfine-21cm', 'gyroscope-feyn', 'amplitudes-in-time', 'chemistry:nmr-spectroscopy', 'medicine:medical-imaging', 'physics:driven-oscillations'],
  body: `
### Quantized magnets and Curie's law
Give each atom a permanent moment $\\mu$ with spin ½. In a field $B$ it can sit in only two states: moment along the field (energy $-\\mu B$) or against it ($+\\mu B$) — the two beams of the Stern–Gerlach experiment. Heat keeps kicking atoms between the states; the populations are in the ratio of the [[?boltzmann-factor|Boltzmann factors]], and the average moment along the field is $\\mu\\tanh(\\mu B/kT)$ ([[?function]] $\\tanh$ climbs from 0 and levels off at 1). With $N$ atoms per unit volume,
$$M = N\\mu\\tanh\\frac{\\mu B}{kT} \\approx \\frac{N\\mu^2 B}{kT} \\quad (\\mu B \\ll kT).$$
That is **Curie's law**: susceptibility $\\chi = \\mu_0 N\\mu^2/kT$, [[?proportional]] to $1/T$. With $10^{28}$ unpaired electrons per m³ at 300 K, $\\chi \\approx 2.6\\times10^{-4}$: in 1 T the excess of aligned spins is only 0.2 %. At 1 K in 4 T, $\\tanh(2.7) = 0.99$ — nearly all aligned. The second sim shows the spins flipping and the curve.

Magnetize a salt at about 1 K in a strong field, insulate it, and slowly remove the field: the spins can only stay as ordered as they are by getting colder. This **adiabatic demagnetization** took a salt below 1 K in 1933, and later to a few millikelvin.

### Precession: tops in a field
A moment carries angular momentum $J = \\mu/\\gamma$, where $\\gamma$ is the **gyromagnetic ratio**. The torque $\\vec\\mu\\times\\vec B_0$ makes it precess about the field, like a top under gravity, without changing its angle, at the **Larmor frequency**
$$\\omega_0 = \\gamma B_0, \\qquad f_0 = \\frac{\\gamma B_0}{2\\pi}.$$

| Particle | $\\gamma/2\\pi$ | in 1.5 T | in 3 T |
|---|---|---|---|
| proton ¹H | 42.58 MHz/T | 63.9 MHz | 127.7 MHz |
| carbon-13 | 10.71 MHz/T | 16.1 MHz | 32.1 MHz |
| phosphorus-31 | 17.24 MHz/T | 25.9 MHz | 51.7 MHz |
| electron | 28 025 MHz/T | 42.0 GHz | 84.1 GHz |

### Resonance: tipping the top over
How do we change the angle? A steady sideways field only tilts the precession axis a little. Instead apply a small field $B_1$ at right angles to $B_0$ that **rotates** about $B_0$ at angular frequency $\\omega$. Feynman's trick is to watch from a frame turning with $B_1$. There $B_1$ stands still — and $B_0$ is effectively reduced to $B_0 - \\omega/\\gamma$, because rotating frames themselves act like a field. At resonance, $\\omega = \\omega_0$, the big field vanishes altogether: the moment sees only $B_1$ and slowly precesses about it, from up, to sideways (a 90° pulse), to down (180°), at the rate $\\gamma B_1$. Off resonance the effective field is tilted, and the moment only wobbles partway down. In the sim, switch between the lab frame and the rotating frame and detune the drive to watch the tipping collapse; the width of the resonance is about $\\gamma B_1$.

In quantum language the rotating field drives transitions between the two levels, $\\hbar\\omega_0 = 2\\mu B_0$ apart: radio photons of exactly the Larmor frequency. For spin ½ the quantum amplitudes and the classical arrow move in exactly the same way, which is why the picture of a precessing arrow is right.

### NMR and MRI
After a 90° pulse the tipped magnetization keeps precessing at $f_0$ and induces a voltage in a coil — the NMR signal. It fades as the spins get out of step (time $T_2$) and the magnetization regrows along the field (time $T_1$). Chemists read frequency shifts of parts per million caused by the electrons around each nucleus; MRI adds field gradients, so that $f = \\tfrac{\\gamma}{2\\pi}(B_0 + Gx)$ depends on position and the frequencies become a map of the body.

> [!key] A magnetic moment in a field precesses at ω₀ = γB₀. A small field rotating at exactly ω₀ looks steady to the moment and tips it over; a little off, it barely moves it. That sharpness is magnetic resonance.
`,
  ideas: [
    'A spin-½ moment has two energies in a field, ∓μB; thermal populations give M = Nμ tanh(μB/kT), and Curie\'s law χ ∝ 1/T for weak fields.',
    'A moment with angular momentum precesses about a field at the Larmor frequency ω₀ = γB₀ (42.58 MHz per tesla for protons).',
    'In the frame rotating with the drive, B₀ is replaced by B₀ − ω/γ; at resonance only B₁ remains and the moment tips over at the rate γB₁.',
    'The flip angle is γB₁t: a 90° pulse tips the magnetization sideways, where it precesses and radiates the NMR signal.',
    'Field gradients make the frequency depend on position: that is how MRI makes pictures.'
  ],
  pitfalls: [
    'A strong enough steady sideways field would flip the spins — A steady field only tilts the precession axis; to flip a spin you need a field rotating in step with the precession.',
    'In NMR the spins are all aligned with the field — At body temperature in 3 T only about ten protons per million are in excess; the signal comes from the enormous number of protons in water.',
    'Resonance means the drive frequency matches the frequency of the radio wave emitted — It means matching the precession frequency γB₀, which is set by the field, not by the coil.'
  ],
  formulas: [
    {
      name: 'The Larmor frequency',
      expr: 'f = gamma*B/(2*pi)', tex: 'f_0 = \\dfrac{\\gamma B_0}{2\\pi}',
      vars: {
        f: { name: 'precession (resonance) frequency', q: 'frequency', unit: 'MHz', tex: 'f_0' },
        gamma: { name: 'gyromagnetic ratio (proton 2.675 × 10⁸, carbon-13 6.728 × 10⁷)', unit: 'rad/(s·T)', value: 2.6752e8, tex: '\\gamma' },
        B: { name: 'steady magnetic field', q: 'bfield', unit: 'T', value: 1.5, tex: 'B_0' }
      },
      note: 'Protons: γ/2π = 42.58 MHz per tesla. Electrons: 28.0 GHz per tesla.',
      stories: { f: 'At what frequency do protons resonate in an MRI scanner of {B}?', B: 'Protons resonate at {f}. What is the field?' }
    },
    {
      name: 'Magnetization of spin-½ moments',
      expr: 'M = N*mu*tanh(mu*B/(kB*T))', tex: 'M = N\\mu\\tanh\\dfrac{\\mu B}{k_B T}',
      vars: {
        M: { name: 'magnetization', q: 'hfield', unit: 'A/m' },
        N: { name: 'number of moments per volume', q: 'numberdensity', unit: '1/m³', value: 1e28 },
        mu: { name: 'moment of each', q: 'mdipole', unit: 'µB', value: 1, tex: '\\mu' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Saturates at Nμ when μB ≫ kT; for weak fields it is Curie\'s law.',
      stories: { M: 'A paramagnetic salt has {N} moments of {mu} each. What is its magnetization in {B} at {T}?' }
    },
    {
      name: 'Curie\'s law',
      expr: 'chi = mu0*N*mu^2/(kB*T)', tex: '\\chi = \\dfrac{\\mu_0 N\\mu^2}{k_B T}',
      vars: {
        chi: { name: 'susceptibility', tex: '\\chi' },
        mu0: { const: 'mu0' },
        N: { name: 'number of moments per volume', q: 'numberdensity', unit: '1/m³', value: 1e28 },
        mu: { name: 'moment of each', q: 'mdipole', unit: 'µB', value: 1, tex: '\\mu' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'For spin ½ and μB ≪ kT. Halve the temperature, double the susceptibility.',
      stories: { chi: 'What is the susceptibility of a salt with {N} moments of {mu} at {T}?', T: 'At what temperature does a salt with {N} moments of {mu} reach susceptibility {chi}?' }
    },
    {
      name: 'The flip angle of a resonant pulse',
      expr: 'theta = gamma*B1*t', tex: '\\theta = \\gamma B_1 t',
      vars: {
        theta: { name: 'angle the magnetization is tipped', q: 'angle', unit: '°', value: 90, tex: '\\theta' },
        gamma: { name: 'gyromagnetic ratio (protons)', unit: 'rad/(s·T)', value: 2.6752e8, tex: '\\gamma' },
        B1: { name: 'strength of the rotating field', q: 'bfield', unit: 'µT', value: 10, tex: 'B_1' },
        t: { name: 'duration of the pulse', q: 'time', unit: 'ms' }
      },
      solveFor: 't',
      note: 'At exact resonance, in the rotating frame the moment turns about B₁ at the rate γB₁.',
      stories: { t: 'How long must a rotating field of {B1} be applied to tip proton spins by {theta}?', B1: 'A {theta} pulse lasts {t}. How strong is the rotating field?' }
    }
  ],
  examples: [
    {
      title: 'Tuning in to protons',
      q: 'At what frequencies do protons resonate in scanners of 1.5 T and 3 T, and in Earth\'s field of 50 µT?',
      steps: [
        '$f_0 = (\\gamma/2\\pi)B_0$ with $\\gamma/2\\pi = 42.58$ MHz/T.',
        '1.5 T: 63.9 MHz; 3 T: 127.7 MHz — FM radio frequencies, which is why scanners sit in shielded rooms.',
        '50 µT: $42.58\\times10^{6} \\times 5\\times10^{-5} = 2130$ Hz — an audio frequency.'
      ],
      a: '63.9 MHz, 127.7 MHz and 2.13 kHz.'
    },
    {
      title: 'How many protons vote?',
      q: 'The proton moment is $1.411\\times10^{-26}$ J/T. At 310 K in 3 T, what fraction of protons is in excess along the field? How many excess protons are there in 1 mm³ of water ($6.69\\times10^{28}$ protons per m³)?',
      steps: [
        '$x = \\mu B/kT = 1.411\\times10^{-26} \\times 3/(1.381\\times10^{-23} \\times 310) = 9.9\\times10^{-6}$.',
        'The excess fraction is $\\tanh x \\approx x \\approx 1.0\\times10^{-5}$: ten per million.',
        'In 1 mm³: $6.69\\times10^{19} \\times 9.9\\times10^{-6} = 6.6\\times10^{14}$ excess protons.'
      ],
      a: 'About 10 per million — still some 10¹⁵ protons per cubic millimetre, enough for a signal.'
    },
    {
      title: 'A 90° pulse',
      q: 'The rotating field of a scanner is $B_1 = 10$ µT. How long is a 90° pulse for protons? A 180° pulse?',
      steps: [
        'Rate of tipping: $\\gamma B_1 = 2.675\\times10^{8} \\times 10^{-5} = 2675$ rad/s.',
        '90° = π/2 rad: $t = 1.571/2675 = 5.87\\times10^{-4}$ s.',
        '180° takes twice as long: 1.17 ms.'
      ],
      a: '0.59 ms for 90°, 1.17 ms for 180°.'
    }
  ],
  quiz: [
    { q: 'In a frame rotating with B₁ at exactly the Larmor frequency, the moment feels…', choices: ['only B₁', 'B₀ + B₁', 'no field at all', 'twice B₀'], a: 0, why: 'The rotating frame subtracts ω/γ from B₀; at ω = ω₀ nothing is left of B₀, and B₁ stands still.' },
    { q: 'A steady sideways field as strong as B₁ would tip the moment all the way over, just as the rotating field does.', a: false, why: 'A steady field only tilts the precession axis by about B₁/B₀; the moment keeps precessing close to B₀.' },
    { q: 'Doubling the field of an MRI scanner makes the proton resonance frequency…', choices: ['double', 'halve', 'stay the same', 'quadruple'], a: 0, why: 'f₀ = γB₀/2π is proportional to B₀.' },
    { q: 'By Curie\'s law, cooling a paramagnetic salt from 300 K to 30 K makes its susceptibility…', choices: ['10 times larger', '10 times smaller', '100 times larger', 'unchanged'], a: 0, why: 'χ ∝ 1/T in the weak-field limit.' },
    { q: 'What is the proton resonance frequency in a 7 T research scanner, in MHz?', answer: 298, why: '42.58 MHz/T × 7 T = 298 MHz.' }
  ],
  problems: [
    { q: 'A paramagnetic salt has moments of one Bohr magneton. At 1.0 K in 4.0 T, what fraction of the maximum magnetization does it reach?', answer: 0.991, tol: 0.01, hint: 'M/(Nμ) = tanh(μB/kT).',
      steps: ['$x = 9.274\\times10^{-24} \\times 4/(1.381\\times10^{-23} \\times 1) = 2.69$.', '$\\tanh 2.69 = 0.991$: the moments are almost all aligned.'] },
    { q: 'How long must a rotating field of 25 µT act on protons to give a 180° pulse?', answer: 0.470, unit: 'ms', tol: 0.02, hint: 't = θ/(γB₁).',
      steps: ['$\\gamma B_1 = 2.675\\times10^8 \\times 2.5\\times10^{-5} = 6688$ rad/s.', '$t = \\pi/6688 = 4.70\\times10^{-4}$ s = 0.470 ms.'] }
  ],
  applications: [
    'MRI images water and fat protons in the body, with contrast from T₁ and T₂ — see [[medicine:medical-imaging|medical imaging]].',
    'NMR spectroscopy identifies molecules by the small shifts of each nucleus\'s resonance — [[chemistry:nmr-spectroscopy|NMR spectroscopy]].',
    'Adiabatic demagnetization refrigerators cool detectors on satellites and in laboratories to below 0.1 K.',
    'Proton magnetometers measure Earth\'s field from the precession frequency of protons in a bottle of water or kerosene, about 2 kHz.'
  ],
  history: 'Pierre Curie found the 1/T law of paramagnetism in 1895. Otto Stern and Walther Gerlach showed in 1922 that atomic moments take only certain orientations. Isidor Rabi detected magnetic resonance in molecular beams in 1938 (Nobel Prize 1944). Edward Purcell and Felix Bloch, with their groups, observed nuclear magnetic resonance in ordinary liquids and solids in 1945–46 (Nobel Prize 1952). William Giauque cooled a paramagnetic salt below 1 K by adiabatic demagnetization in 1933. Paul Lauterbur (1973) and Peter Mansfield showed how gradients turn NMR into images (Nobel Prize in Physiology or Medicine, 2003).',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 35 (Paramagnetism and Magnetic Resonance) — quantized magnetic states, the Stern–Gerlach experiment, Rabi\'s molecular-beam method, the paramagnetism of bulk materials, cooling by adiabatic demagnetization and nuclear magnetic resonance.',
    'Vol. II, ch. 34 (The Magnetism of Matter) — the precession of atomic magnets.',
    'Vol. III, ch. 7 (The Dependence of Amplitudes on Time) — the precession of a spin one-half particle, from its amplitudes.'
  ],
  sim: ['mat-nmr', { id: 'mat-bvl', params: { mode: 'spin' }, title: 'Quantum spins in a field: Curie\'s law' }]
},

{
  id: 'ferromagnetism-feyn', parent: 'solids-magnets', title: 'Ferromagnetism', level: 3,
  short: 'In iron, cobalt and nickel the atomic magnets line up by themselves below the Curie temperature. Weiss explained it with a mean field — each spin feels the average of all the others — and domains and hysteresis explain why a nail is not a magnet until you magnetize it, and then stays one.',
  keywords: ['ferromagnetism', 'Curie temperature', 'Weiss mean field', 'molecular field', 'spontaneous magnetization', 'exchange interaction', 'domains', 'domain wall', 'hysteresis', 'remanence', 'coercivity', 'saturation', 'Curie–Weiss law', 'soft magnet', 'hard magnet', 'Barkhausen effect', 'Ising model'],
  prereq: ['paramagnetism-nmr', 'exclusion-principle', 'entropy-and-order', 'physics:magnetic-materials'],
  related: ['magnetism-of-matter', 'superconductivity-feyn', 'induction-laws', 'magnetostatics-feyn', 'physics:material-properties', 'physics:solenoid'],
  body: `
### Iron lines up by itself
A paramagnetic salt needs a strong field and a low temperature to line up even partly. Iron does it on its own: inside a piece of iron at room temperature the atomic moments, about 2.2 Bohr magnetons each, nearly all point the same way, a magnetization of $1.7\\times10^{6}$ A/m — $\\mu_0 M \\approx 2.2$ T. Heat it past its **Curie temperature** and the order vanishes; above it iron is an ordinary paramagnet.

| Material | Curie temperature | $\\mu_0 M_s$ at room temperature |
|---|---|---|
| iron | 1043 K (770 °C) | 2.15 T |
| cobalt | 1388 K (1115 °C) | 1.79 T |
| nickel | 627 K (354 °C) | 0.61 T |
| gadolinium | 293 K (20 °C) | ferromagnetic only when cooled |

### Weiss's mean field
Pierre Weiss's idea (1907) was simple and bold: suppose each atomic moment feels, besides any applied field, an extra "molecular field" proportional to the magnetization itself, $\\lambda M$. Aligned moments then make a field that aligns more moments. Put this into the spin-½ paramagnet, $M = N\\mu\\tanh(\\mu B/kT)$, with $B$ replaced by $\\lambda M$, and write $m = M/N\\mu$ for the fraction aligned:
$$m = \\tanh\\left(\\frac{T_C}{T}\\,m\\right), \\qquad kT_C = N\\mu^2\\lambda .$$
The equation has $m$ on both sides; solve it with a picture, as the second sim does. Draw the straight line $m$ and the curve $\\tanh(T_C m/T)$. The slope of the curve at the origin (its [[?derivative]]) is $T_C/T$. Above $T_C$ it is less than 1 and the only crossing is $m = 0$: no magnetization. Below $T_C$ it exceeds 1, and two new crossings appear at $\\pm m_0$ — **spontaneous magnetization**, rising from 0 at $T_C$ toward 1 at absolute zero, close to what is measured. Above $T_C$ the same model gives the **Curie–Weiss law** $\\chi = C/(T - T_C)$: the susceptibility shoots up as $T_C$ is approached from above.

### The field is not magnetic
To hold iron's order up to 1043 K the molecular field must be of the order of a thousand tesla. Real magnetic interactions are hopelessly weak: two moments of $2.2\\mu_B$ a quarter of a nanometre apart have an energy $\\mu_0\\mu^2/4\\pi r^3$ worth about 0.2 K. Feynman stressed that the force is **electrical**: electrons repel, and by the Pauli principle two electrons with parallel spins cannot be in the same place, so their spin direction changes their electrostatic energy. In iron this "exchange" energy happens to favour parallel spins (Heisenberg, 1928). It is a quantum effect through and through.

### Domains and hysteresis
Why, then, is an iron nail not a magnet? A block magnetized one way would fill the space around it with field, which costs energy. So the iron splits into **domains**, each magnetized to saturation but pointing in different directions so that their fields close on themselves, separated by walls a few hundred atoms thick where the spins turn gradually. Apply a field and the walls move: domains aligned with the field grow — smoothly at first, then in jumps as walls tear free from impurities (the crackles of the Barkhausen effect). At high field one domain remains: saturation. Remove the field and the walls do not all go back: **remanence**. A reverse field, the **coercive field**, is needed to bring $M$ back to zero. Plotted against the applied field, $M$ runs round a **hysteresis loop**, and the loop's area is the energy turned into heat per cycle per unit volume.

The first sim is a grid of spins that favour their neighbours' direction (the Ising model, a stripped-down cousin of the real thing), with no long-range fields. Cool it below its critical temperature and domains form and coarsen; sweep the field and it runs round a loop. Transformer steel has a narrow loop (coercive field of tens of A/m, little loss); permanent magnets such as neodymium–iron–boron have a fat one (around $10^{6}$ A/m).

> [!key] The forces that align iron's spins are electrical, sorted by the Pauli principle; the mean field makes the alignment feed itself below $T_C$; domains hide it; hysteresis is the history the domain walls remember.
`,
  ideas: [
    'Below the Curie temperature the moments of iron, cobalt and nickel line up spontaneously; above it the metal is paramagnetic.',
    'Weiss: each moment feels a molecular field λM. Solving m = tanh(T_C m/T) graphically gives m = 0 above T_C and a spontaneous m₀ below it.',
    'The molecular field is not magnetic: it is the exchange energy, electrostatics plus the Pauli principle.',
    'Domains keep the outside field small; moving walls, remanence and the coercive field make the hysteresis loop.',
    'The area of the loop is the energy lost per cycle per unit volume: small for transformer steel, large for permanent magnets.'
  ],
  pitfalls: [
    'The atoms of iron line up because each one is a little magnet attracting its neighbours — Their magnetic energy is worth about 0.2 K; only the exchange energy, a thousand times larger, can survive to 1043 K.',
    'An unmagnetized piece of iron has its atomic moments pointing at random — Each domain is fully magnetized; only the domains point in different directions.',
    'Heating a magnet destroys its atoms\' moments — Above the Curie temperature the moments are still there; they merely stop keeping each other aligned.'
  ],
  formulas: [
    {
      name: 'Weiss mean field: the spontaneous magnetization',
      expr: 'T = 2*Tc*m/ln((1 + m)/(1 - m))', tex: 'm = \\tanh\\left(\\dfrac{T_C}{T}\\,m\\right)',
      vars: {
        T: { name: 'temperature', q: 'temperature', unit: 'K' },
        Tc: { name: 'Curie temperature', q: 'temperature', unit: 'K', value: 1043, tex: 'T_C' },
        m: { name: 'fraction aligned, M/M_s', value: 0.75, min: 0.001, max: 0.999 }
      },
      note: 'Spin-½ mean-field theory in zero applied field. Written for T: T = T_C m/artanh m, with artanh m = ½ ln[(1 + m)/(1 − m)]. Only temperatures below T_C have m ≠ 0.',
      stories: { T: 'In mean-field theory, at what temperature is iron ({Tc}) magnetized to a fraction {m} of saturation?', m: 'What fraction of saturation does mean-field theory give at {T} for a Curie temperature of {Tc}?' }
    },
    {
      name: 'Curie–Weiss law (above the Curie temperature)',
      expr: 'chi = C/(T - Tc)', tex: '\\chi = \\dfrac{C}{T - T_C}',
      vars: {
        chi: { name: 'susceptibility', tex: '\\chi' },
        C: { name: 'Curie constant (of order 1 K for iron-group metals)', q: 'dtemp', unit: 'K', value: 1 },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 1100 },
        Tc: { name: 'Curie temperature', q: 'temperature', unit: 'K', value: 1043, tex: 'T_C' }
      },
      note: 'Valid above T_C. The same mean field that orders the spins below T_C makes them very easy to align just above it.',
      stories: { chi: 'A ferromagnet with Curie temperature {Tc} and Curie constant {C} is held at {T}. What is its susceptibility?' }
    },
    {
      name: 'Magnetic energy of two neighbouring moments',
      expr: 'U = mu0*mu^2/(4*pi*r^3)', tex: 'U \\approx \\dfrac{\\mu_0\\mu^2}{4\\pi r^3}',
      vars: {
        U: { name: 'magnetic interaction energy (order of magnitude)', q: 'energy', unit: 'eV' },
        mu0: { const: 'mu0' },
        mu: { name: 'moment of each atom', q: 'mdipole', unit: 'µB', value: 2.2, tex: '\\mu' },
        r: { name: 'distance between them', q: 'length', unit: 'nm', value: 0.25 }
      },
      note: 'About 1.7 × 10⁻⁵ eV (17 µeV), or k × 0.2 K, for iron — thousands of times too small to explain a Curie temperature of 1043 K (kT_C = 90 meV).',
      stories: { U: 'Two atomic moments of {mu} are {r} apart. Roughly how large is their magnetic interaction energy?' }
    },
    {
      name: 'Power lost to hysteresis',
      expr: 'P = f*V*w', tex: 'P = f V w',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'W' },
        f: { name: 'frequency of the cycles', q: 'frequency', unit: 'Hz', value: 50 },
        V: { name: 'volume of the core', q: 'volume', unit: 'L', value: 1 },
        w: { name: 'area of the loop: energy per cycle per volume', q: 'energydensity', unit: 'J/m³', value: 150 }
      },
      note: 'Each trip round the B–H loop turns the loop\'s area (in J/m³) into heat. Eddy currents add further losses.',
      stories: { P: 'A transformer core of {V} with a loop area of {w} runs at {f}. How much power does hysteresis waste?' }
    }
  ],
  examples: [
    {
      title: 'How strongly is iron magnetized?',
      q: 'Iron has density 7874 kg/m³, molar mass 55.85 g/mol and about 2.2 Bohr magnetons per atom when fully aligned. Find the saturation magnetization and $\\mu_0 M_s$.',
      steps: [
        'Atoms per m³: $N = \\rho N_A/M = 7874 \\times 6.022\\times10^{23}/0.05585 = 8.49\\times10^{28}$.',
        '$M_s = N \\times 2.2\\mu_B = 8.49\\times10^{28} \\times 2.2 \\times 9.274\\times10^{-24} = 1.73\\times10^{6}$ A/m.',
        '$\\mu_0 M_s = 1.257\\times10^{-6} \\times 1.73\\times10^{6} = 2.2$ T.'
      ],
      a: 'About 1.7 × 10⁶ A/m, or 2.2 T (2.15 T measured at room temperature).'
    },
    {
      title: 'Why the molecular field cannot be magnetic',
      q: 'Estimate the magnetic energy of two moments of $2.2\\mu_B$ at 0.25 nm, as a temperature $U/k$, and compare it with iron\'s Curie temperature.',
      steps: [
        '$\\mu = 2.2 \\times 9.274\\times10^{-24} = 2.04\\times10^{-23}$ J/T.',
        '$U = 10^{-7} \\times (2.04\\times10^{-23})^2/(0.25\\times10^{-9})^3 = 2.66\\times10^{-24}$ J.',
        '$U/k = 2.66\\times10^{-24}/1.381\\times10^{-23} = 0.19$ K — over 5000 times smaller than 1043 K.'
      ],
      a: 'About 0.2 K: far too weak; the aligning energy must be electrical (exchange).'
    },
    {
      title: 'Solving Weiss\'s equation at 0.8 T_C',
      q: 'Find the spontaneous magnetization $m$ at $T = 0.8\\,T_C$ by iterating $m \\to \\tanh(1.25\\,m)$ from $m = 1$.',
      steps: [
        '$\\tanh 1.25 = 0.848$; $\\tanh(1.25 \\times 0.848) = 0.786$; then 0.754, 0.736, 0.726, 0.720, …',
        'The values settle at $m = 0.71$, where the line and the curve cross.',
        'Check: $\\tanh(1.25 \\times 0.7105) = \\tanh 0.888 = 0.7105$.'
      ],
      a: 'm ≈ 0.71: at 80 % of the Curie temperature the mean-field magnetization is 71 % of saturation.'
    }
  ],
  quiz: [
    { q: 'In the graphical solution of m = tanh(T_C m/T), spontaneous magnetization appears when…', choices: ['the curve\'s slope at the origin, T_C/T, exceeds 1', 'the curve crosses m = 1', 'T is above T_C', 'the applied field is strong'], a: 0, why: 'If the tanh curve starts out steeper than the line m, it must cross the line again at some m₀ > 0 before levelling off below 1.' },
    { q: 'The force that aligns neighbouring spins in iron is the magnetic force between the atomic moments.', a: false, why: 'That energy corresponds to about 0.2 K. The alignment comes from electrostatic energy combined with the Pauli principle — exchange.' },
    { q: 'An unmagnetized iron nail contains…', choices: ['domains, each magnetized to saturation, pointing in different directions', 'atoms whose moments point at random', 'atoms with no magnetic moments', 'a single domain magnetized along its length'], a: 0, why: 'Domains form so that the fields of the parts close on themselves, lowering the field energy.' },
    { q: 'The area enclosed by a hysteresis loop (B against H) measures…', choices: ['the energy lost as heat per cycle per unit volume', 'the saturation magnetization', 'the Curie temperature', 'the permeability'], a: 0, why: 'The work done on the material per cycle is ∮H dB, the loop\'s area; it ends up as heat.' },
    { q: 'A transformer core should be made of a material with…', choices: ['a narrow loop: small coercive field', 'a wide loop: large coercive field', 'a Curie temperature below room temperature', 'no domains'], a: 0, why: 'The core runs round its loop 50 or 60 times a second; a narrow loop wastes little energy. Permanent magnets want the opposite.' }
  ],
  problems: [
    { q: 'In mean-field theory, at what temperature is nickel (T_C = 627 K) magnetized to half of saturation?', answer: 571, unit: 'K', tol: 0.02, hint: 'T = 2T_C m/ln[(1 + m)/(1 − m)].',
      steps: ['$\\ln(1.5/0.5) = \\ln 3 = 1.0986$.', '$T = 2 \\times 627 \\times 0.5/1.0986 = 571$ K.'] },
    { q: 'A 2 L transformer core runs at 60 Hz; its loop encloses 200 J/m³. How much power is lost to hysteresis?', answer: 24, unit: 'W', tol: 0.02, hint: 'P = f V w.',
      steps: ['$V = 2\\times10^{-3}$ m³.', '$P = 60 \\times 2\\times10^{-3} \\times 200 = 24$ W.'] }
  ],
  applications: [
    'Soft magnetic steels and ferrites guide flux in transformers, motors and inductors; hard magnets (ferrite, samarium–cobalt, neodymium–iron–boron) power motors, loudspeakers and wind turbines.',
    'Hard disks store bits as the magnetization direction of tiny grains; reading heads sense their fields.',
    'Volcanic rocks record the direction of Earth\'s field as they cool through their Curie temperature; the reversals frozen into the sea floor helped establish plate tectonics.',
    'Some soldering irons regulate their temperature with a tip alloy that stops being ferromagnetic at its Curie point.'
  ],
  history: 'Pierre Curie measured in 1895 how magnetism depends on temperature, finding the temperature now named after him. Pierre Weiss proposed the molecular field and magnetic domains in 1907. Heinrich Barkhausen heard the domain jumps as clicks in 1919. Werner Heisenberg traced the molecular field to quantum-mechanical exchange in 1928. Francis Bitter made domain walls visible with fine magnetic powder in 1931, and Lev Landau and Evgeny Lifshitz worked out the energy of domain structures in 1935. The Ising model (Ernst Ising, 1925) was solved exactly in two dimensions by Lars Onsager in 1944. Neodymium–iron–boron magnets were developed in the early 1980s.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 36 (Ferromagnetism) — magnetization currents, the field H, the magnetization curve, iron-core inductors, electromagnets and spontaneous magnetization in Weiss\'s mean-field picture.',
    'Vol. II, ch. 37 (Magnetic Materials) — the quantum origin of ferromagnetism, its thermodynamics, the hysteresis curve and domains, and practical magnetic materials.'
  ],
  sim: ['mat-domains', 'mat-weiss']
},

{
  id: 'elasticity-feyn', parent: 'solids-magnets', title: 'Elasticity', level: 2,
  short: 'Pull, bend or twist a solid a little and it springs back: stress is proportional to strain. Two numbers — Young\'s modulus and Poisson\'s ratio — describe an isotropic material, and from them follow the stretch of a wire, the twist of a torsion fibre and the curve of a bent beam.',
  keywords: ['Hooke\'s law', 'stress', 'strain', 'Young\'s modulus', 'Poisson\'s ratio', 'shear modulus', 'bulk modulus', 'torsion', 'torsion balance', 'bending', 'beam', 'curvature', 'neutral axis', 'second moment of area', 'cantilever', 'buckling', 'Euler'],
  prereq: ['tensors-feyn', 'crystal-geometry', 'physics:stress-strain', 'physics:hookes-law'],
  related: ['harmonic-oscillator-feyn', 'wave-equation-sound', 'physics:shear-bulk-modulus', 'physics:elasticity', 'math:higher-derivatives'],
  body: `
### Stress, strain and Hooke's law
Hang a weight on a wire and it stretches. Double the weight, the stretch doubles; double the cross-section, it halves; double the length, it doubles. So the natural quantities are the force per area, the **stress** $F/A$, and the fractional stretch, the **strain** $\\Delta L/L$, and for small strains they are [[?proportional]]:
$$\\frac{F}{A} = Y\\,\\frac{\\Delta L}{L}.$$
$Y$ (often $E$) is **Young's modulus**. Why should any solid obey such a law? Atoms sit at the bottom of the curve of their interaction energy; near any smooth minimum the curve looks like a parabola — the first term of a [[?taylor-series]] — so the restoring force grows in proportion to a small displacement. Hooke's law is what every solid does when you ask it gently.

| Material | Young's modulus | Poisson's ratio |
|---|---|---|
| steel | 200 GPa | 0.29 |
| copper | 120 GPa | 0.34 |
| aluminium | 70 GPa | 0.33 |
| glass | 70 GPa | 0.22 |
| tungsten | 410 GPa | 0.28 |
| rubber | 0.01–0.1 GPa | 0.49 |

### Stretched long, squeezed thin
A stretched bar also gets thinner: the sideways strain is $-\\sigma$ times the lengthwise strain, where $\\sigma$ is **Poisson's ratio** (Feynman's letter; many books use $\\nu$). The volume changes by $(1 - 2\\sigma)$ times the strain, so rubber, with $\\sigma \\approx \\tfrac12$, keeps its volume. For a material that is the same in all directions, $Y$ and $\\sigma$ are all there is — the elasticity [[tensors-feyn|tensor]] collapses to two numbers. The others follow: shear modulus $\\mu = Y/2(1+\\sigma)$ (steel: 78 GPa) and bulk modulus $K = Y/3(1-2\\sigma)$ (steel: 160 GPa).

### Twisting
Twist a rod of radius $R$ and length $L$ through an angle $\\varphi$. A thin tube of it at radius $r$ is sheared by the angle $r\\varphi/L$, so the shear stress there is $\\mu r\\varphi/L$. Multiply by the lever arm $r$ and add up over the cross-section — an [[?integral]], $\\int_0^R r^2 \\, 2\\pi r\\,dr = \\pi R^4/2$:
$$\\tau = \\frac{\\pi\\mu R^4}{2L}\\,\\varphi.$$
The $R^4$ is dramatic: halve the radius and the rod is sixteen times easier to twist. That is why a fine fibre makes an exquisitely sensitive torque meter — the torsion balances of Coulomb and Cavendish.

### Bending
Bend a beam into an arc of radius $R$. The fibres on the outside of the bend stretch, those on the inside shorten, and in between is a **neutral surface** that keeps its length. A fibre at distance $y$ from it is strained by $y/R$ and stressed by $Yy/R$. These stresses, times their lever arms $y$, add up to the bending moment
$$M = \\frac{Y}{R}\\int y^2\\,dA = \\frac{YI}{R}, \\qquad I = \\frac{wh^3}{12}\\ \\text{for a rectangle}.$$
The curvature $1/R$ of a gently bent beam is the [[?second-derivative]] of its deflection, $y'' = M(x)/YI$. For a cantilever of length $L$ with a load $F$ at its tip, integrating twice gives the tip deflection $FL^3/3YI$. The $h^3$ rules structural design: a plank four times as tall as it is wide is sixteen times stiffer standing on edge than lying flat, and an I-beam puts its material where $y$ is large. Squeeze a slender column instead and at a critical load, $\\pi^2YI/L^2$ for pinned ends, it suddenly bows sideways — Euler's buckling.

In the sim, choose a material and stretch, bend or twist it; the deformation is drawn enlarged, and the readouts give the true values.
`,
  ideas: [
    'Stress (force per area) is proportional to strain (fractional change): F/A = Y ΔL/L, because every smooth energy minimum is a parabola.',
    'A stretched bar narrows by Poisson\'s ratio σ times its strain; Y and σ describe an isotropic solid completely.',
    'Twisting: τ = (πμR⁴/2L)φ — the R⁴ makes thin fibres sensitive torque meters.',
    'Bending: M = YI/R, with I = wh³/12; a cantilever\'s tip deflects FL³/3YI.',
    'Shape matters as much as material: height cubed for beams, radius to the fourth for shafts.'
  ],
  pitfalls: [
    'A thicker wire stretches less because it is stronger material — The material is the same; the load is simply spread over more area, so the stress is smaller.',
    'A beam is stiffest when its widest side faces the load — Stiffness goes as w h³ with h measured along the load: stand a plank on its edge.',
    'Rubber is very elastic, so it has a large Young\'s modulus — Its modulus is tiny (0.01–0.1 GPa); "elastic" here means it springs back, not that it is stiff. Steel is thousands of times stiffer.'
  ],
  formulas: [
    {
      name: 'Hooke\'s law for a stretched bar',
      expr: 'dL = F*L/(Y*A)', tex: '\\Delta L = \\dfrac{F L}{Y A}',
      vars: {
        dL: { name: 'extension', q: 'length', unit: 'mm', tex: '\\Delta L' },
        F: { name: 'pulling force', q: 'force', unit: 'N', value: 200 },
        L: { name: 'length', q: 'length', unit: 'm', value: 2 },
        Y: { name: 'Young\'s modulus', q: 'stress', unit: 'GPa', value: 200 },
        A: { name: 'cross-section', q: 'area', unit: 'mm²', value: 1 }
      },
      note: 'Below the elastic limit (for steel, stresses up to a few hundred MPa).',
      stories: { dL: 'A {L} steel wire ({Y}) of cross-section {A} holds {F}. How much does it stretch?', Y: 'A wire {L} long with cross-section {A} stretches {dL} under {F}. What is its Young\'s modulus?' }
    },
    {
      name: 'Sideways contraction (Poisson\'s ratio)',
      expr: 'dw = sigma*w*dL/L', tex: '\\Delta w = \\sigma\\, w\\,\\dfrac{\\Delta L}{L}',
      vars: {
        dw: { name: 'decrease in width', q: 'length', unit: 'µm', tex: '\\Delta w' },
        sigma: { name: 'Poisson\'s ratio', value: 0.29, tex: '\\sigma' },
        w: { name: 'width', q: 'length', unit: 'mm', value: 10 },
        dL: { name: 'extension', q: 'length', unit: 'mm', value: 2, tex: '\\Delta L' },
        L: { name: 'length', q: 'length', unit: 'm', value: 2 }
      },
      note: 'σ is between 0 and ½ for ordinary materials; ½ means no change of volume.',
      stories: { dw: 'A bar {w} wide and {L} long is stretched by {dL}. Its Poisson ratio is {sigma}. How much narrower does it get?' }
    },
    {
      name: 'Tip deflection of a cantilever',
      expr: 'd = 4*F*L^3/(Y*w*h^3)', tex: '\\delta = \\dfrac{F L^3}{3 Y I} = \\dfrac{4 F L^3}{Y w h^3}',
      vars: {
        d: { name: 'deflection of the tip', q: 'length', unit: 'mm', tex: '\\delta' },
        F: { name: 'load at the tip', q: 'force', unit: 'N', value: 100 },
        L: { name: 'length', q: 'length', unit: 'm', value: 1 },
        Y: { name: 'Young\'s modulus', q: 'stress', unit: 'GPa', value: 200 },
        w: { name: 'width', q: 'length', unit: 'mm', value: 50 },
        h: { name: 'height (along the load)', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'Rectangular cross-section, I = wh³/12; small deflections.',
      stories: { d: 'A steel bar ({Y}) {w} wide and {h} high sticks out {L} from a wall and carries {F} at its end. How far does the end drop?', h: 'How tall must a bar {w} wide and {L} long ({Y}) be for a load of {F} to bend its tip by only {d}?' }
    },
    {
      name: 'Twisting a rod',
      expr: 'tau = pi*mu*R^4*phi/(2*L)', tex: '\\tau = \\dfrac{\\pi\\mu R^4}{2L}\\,\\varphi',
      vars: {
        tau: { name: 'torque', q: 'torque', unit: 'N·m', tex: '\\tau' },
        mu: { name: 'shear modulus', q: 'stress', unit: 'GPa', value: 80, tex: '\\mu' },
        R: { name: 'radius', q: 'length', unit: 'mm', value: 10 },
        phi: { name: 'angle of twist', q: 'angle', unit: '°', value: 1, tex: '\\varphi' },
        L: { name: 'length', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Solid round rod. The shear modulus is μ = Y/2(1 + σ): about 80 GPa for steel, 160 GPa for tungsten.',
      stories: { tau: 'What torque twists a steel shaft ({mu}) of radius {R} and length {L} by {phi}?', phi: 'A torque of {tau} acts on a rod of radius {R}, length {L} and shear modulus {mu}. By how much does it twist?' }
    }
  ],
  examples: [
    {
      title: 'A wire holding 20 kg',
      q: 'A steel wire 2 m long with a cross-section of 1 mm² (diameter 1.13 mm) holds a 20 kg mass. Find the stress, the extension and the decrease in diameter ($Y$ = 200 GPa, $\\sigma$ = 0.29).',
      steps: [
        '$F = 20 \\times 9.81 = 196$ N, so the stress is $196/10^{-6} = 196$ MPa.',
        'Strain $196\\times10^{6}/2\\times10^{11} = 9.8\\times10^{-4}$; extension $9.8\\times10^{-4} \\times 2 = 1.96$ mm.',
        'Sideways strain $0.29 \\times 9.8\\times10^{-4} = 2.8\\times10^{-4}$; the diameter shrinks by $2.8\\times10^{-4} \\times 1.13 = 3.2\\times10^{-4}$ mm.'
      ],
      a: '196 MPa; it stretches about 2 mm and gets 0.3 µm thinner.'
    },
    {
      title: 'A plank flat and on edge',
      q: 'A pine plank ($Y \\approx 10$ GPa) 100 mm × 25 mm sticks out 1 m and carries 100 N at its end. Compare the tip deflection lying flat and standing on edge.',
      steps: [
        'Flat ($w = 100$ mm, $h = 25$ mm): $\\delta = 4 \\times 100 \\times 1/(10^{10} \\times 0.1 \\times 0.025^3) = 400/15625 = 0.0256$ m.',
        'On edge ($w = 25$ mm, $h = 100$ mm): $\\delta = 400/(10^{10} \\times 0.025 \\times 0.1^3) = 0.0016$ m.',
        'Ratio $= (100/25)^2 = 16$.'
      ],
      a: '25.6 mm flat, 1.6 mm on edge: sixteen times stiffer.'
    },
    {
      title: 'A torsion fibre',
      q: 'A tungsten wire of diameter 50 µm and length 0.5 m ($\\mu$ = 160 GPa) hangs a torsion balance. What torque twists it by one radian? By how much does $10^{-9}$ N·m twist it?',
      steps: [
        '$\\kappa = \\pi\\mu R^4/2L = \\pi \\times 1.6\\times10^{11} \\times (2.5\\times10^{-5})^4/(2 \\times 0.5)$.',
        '$(2.5\\times10^{-5})^4 = 3.91\\times10^{-19}$, so $\\kappa = 1.96\\times10^{-7}$ N·m per radian.',
        '$\\varphi = 10^{-9}/1.96\\times10^{-7} = 5.1\\times10^{-3}$ rad $= 0.29°$ — easily seen with a mirror and a light beam.'
      ],
      a: '2 × 10⁻⁷ N·m per radian; 10⁻⁹ N·m turns it 0.29°.'
    }
  ],
  quiz: [
    { q: 'Doubling the height h of a cantilever (same width, load and length) makes its tip deflection…', choices: ['8 times smaller', '2 times smaller', '4 times smaller', '16 times smaller'], a: 0, why: 'δ ∝ 1/(wh³): doubling h divides δ by 2³ = 8.' },
    { q: 'A rubber band, with Poisson\'s ratio close to ½, keeps nearly the same volume when stretched.', a: true, why: 'The volume changes by (1 − 2σ) times the strain, which vanishes for σ = ½.' },
    { q: 'Why does Hooke\'s law hold for small deformations of practically any solid?', choices: ['Near its minimum any smooth energy curve is a parabola, so the force is linear in the displacement', 'Atoms are held by springs', 'Solids are made of crystals', 'Gravity is linear'], a: 0, why: 'Expand the energy around equilibrium: the linear term vanishes at a minimum, leaving the quadratic one — a spring.' },
    { q: 'Doubling the radius of a torsion fibre makes it stiffer against twisting by a factor of…', choices: ['16', '2', '4', '8'], a: 0, why: 'τ ∝ R⁴.' },
    { q: 'Steel has Y = 200 GPa and σ = 0.3. What is its shear modulus μ = Y/2(1 + σ), in GPa?', answer: 76.9, why: '200/(2 × 1.3) = 76.9 GPa.' }
  ],
  problems: [
    { q: 'An aluminium rod (Y = 70 GPa) 3 m long with a 10 mm × 10 mm cross-section carries a tension of 7 kN. How much does it stretch?', answer: 3.0, unit: 'mm', tol: 0.02, hint: 'ΔL = FL/(YA).',
      steps: ['$A = 10^{-4}$ m², stress $= 70$ MPa.', '$\\Delta L = 7000 \\times 3/(7\\times10^{10} \\times 10^{-4}) = 3.0\\times10^{-3}$ m.'] },
    { q: 'A steel column (Y = 200 GPa) 2 m long with a 20 mm square cross-section is pinned at both ends. At what load does it buckle (Euler: F = π²YI/L²)?', answer: 6.58, unit: 'kN', tol: 0.02, hint: 'I = a⁴/12 for a square of side a.',
      steps: ['$I = 0.02^4/12 = 1.333\\times10^{-8}$ m⁴.', '$F = \\pi^2 \\times 2\\times10^{11} \\times 1.333\\times10^{-8}/2^2 = 6.58\\times10^{3}$ N.'] }
  ],
  applications: [
    'Strain gauges glued to bridges, aircraft and bathroom scales measure tiny strains through the change in a wire\'s resistance.',
    'Torsion balances measured Coulomb\'s law and the gravitational constant, and still test gravity today.',
    'Beams, joists and aircraft spars are shaped for a large second moment of area with little material.',
    'Seismologists use the elastic moduli of rock: longitudinal and shear waves travel at different speeds, which locates earthquakes.'
  ],
  history: 'Robert Hooke published his law in 1678 as "ut tensio, sic vis" — as the extension, so the force — after announcing it two years earlier as an anagram. Leonhard Euler found the buckling load of a column in 1744. Charles-Augustin de Coulomb worked out the torsion of fibres in the 1780s and used them to measure electric forces; Henry Cavendish used a torsion balance to weigh the Earth in 1798. Thomas Young defined his modulus in lectures published in 1807, and Augustin-Louis Cauchy and Siméon Denis Poisson built the general theory of elasticity in the 1820s.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 38 (Elasticity) — Hooke\'s law, uniform strains, the torsion bar and shear waves, the bent beam and buckling.',
    'Vol. II, ch. 39 (Elastic Materials) — the tensor of strain, the tensor of elasticity, motions in an elastic body, non-elastic behaviour and how elastic constants are calculated.'
  ],
  sim: 'mat-elastic'
},

{
  id: 'flow-of-dry-water', parent: 'fluids-feyn', title: 'The flow of "dry" water', level: 2,
  short: 'Leave out viscosity and water becomes an ideal fluid — "dry water". It obeys Bernoulli\'s theorem, and a flow without swirl is governed by the same equation as electrostatics. It explains the pressure round a cylinder and the lift that circulation brings — but it predicts no drag at all.',
  keywords: ['ideal fluid', 'dry water', 'inviscid flow', 'Euler equation', 'Bernoulli theorem', 'streamline', 'continuity', 'incompressible', 'irrotational', 'velocity potential', 'stream function', 'Laplace equation', 'flow past a cylinder', 'd\'Alembert paradox', 'circulation', 'Kutta–Joukowski', 'lift', 'Magnus effect', 'vortex lines', 'smoke ring'],
  prereq: ['vector-calculus-fields', 'electrostatic-analogs', 'conservation-of-energy', 'physics:bernoullis-equation'],
  related: ['flow-of-wet-water', 'superfluid-helium', 'physics:continuity-equation', 'aerodynamics:potential-flow', 'aerodynamics:cylinder-flow', 'aerodynamics:dalembert-paradox', 'aerodynamics:kutta-joukowski', 'aerodynamics:magnus-effect', 'aerodynamics:vorticity-circulation', 'math:laplace-equation'],
  body: `
### Water without friction
Real water is a little sticky: it drags on walls and on itself. Feynman began with an idealized fluid that is not — incompressible and with no viscosity at all — and gave it a nickname: "dry water". Its rules are just two. Mass is conserved: as much flows out of any small box as flows in, $\\nabla\\cdot\\vec v = 0$ (the [[?divergence]] vanishes). And each blob of fluid obeys Newton's law, pushed by pressure differences and gravity:
$$\\rho\\left(\\frac{\\partial\\vec v}{\\partial t} + (\\vec v\\cdot\\nabla)\\vec v\\right) = -\\nabla p - \\rho\\nabla\\phi_g .$$
The bracket is the acceleration of a blob as it moves, not just the change at a fixed point — the $(\\vec v\\cdot\\nabla)\\vec v$ term, which makes fluid mechanics hard.

### Bernoulli's theorem
For a steady flow, follow a blob along its **streamline**. The work done on it by the pressure behind minus the pressure ahead goes into its kinetic and potential energy, so along a streamline
$$p + \\tfrac12\\rho v^2 + \\rho g z = \\text{constant}.$$
Where the fluid speeds up, its pressure drops. That is the whole secret of a Venturi meter, a perfume atomizer, and the dip of the water surface beside a bridge pier.

### Potential flow: electrostatics again
If a flow starts without swirl — without [[?curl]], $\\nabla\\times\\vec v = 0$ — dry water keeps it that way. Then the velocity is the [[?gradient]] of a potential, $\\vec v = -\\nabla\\varphi$, and $\\nabla\\cdot\\vec v = 0$ turns into **Laplace's equation**, $\\nabla^2\\varphi = 0$ (the [[?laplacian]]) — exactly the equation of the electrostatic potential in empty space. Every solution of electrostatics is a flow ([[electrostatic-analogs]]). For a cylinder of radius $a$ in a uniform stream $U$ the answer is
$$v_r = U\\left(1 - \\frac{a^2}{r^2}\\right)\\cos\\theta, \\qquad v_\\theta = -U\\left(1 + \\frac{a^2}{r^2}\\right)\\sin\\theta .$$
On the surface the speed is $2U\\sin\\theta$: zero at the front and back (the **stagnation points**), twice the stream speed at the top and bottom. Bernoulli then gives the pressure, as the pressure coefficient $C_p = (p - p_\\infty)/\\tfrac12\\rho U^2 = 1 - 4\\sin^2\\theta$: $+1$ at the stagnation points, $-3$ at the sides. The sim colours it: red for high pressure, blue for low, with the streamlines and moving tracers on top.

### D'Alembert's paradox
Look at the pressure pattern: it is the same at the back as at the front. The pushes cancel and the net force on the cylinder is **zero** — no drag. Any body, of any shape, in steady potential flow feels no drag. A river obviously pushes on a pier, so dry water is missing something essential; the next page adds it.

### Circulation and lift
Now add a swirl round the cylinder — a **circulation** $\\Gamma = \\oint\\vec v\\cdot d\\vec l$ (a [[?closed-integral]]), with $v_\\theta = \\Gamma/2\\pi r$ added to the flow. The flow outside is still free of curl, but it is faster over one side and slower under the other, so by Bernoulli the pressure is lower on the fast side: a force **across** the stream, $\\rho U\\Gamma$ per unit length (the Kutta–Joukowski theorem). In the sim, turn up $\\Gamma$ and watch the stagnation points slide round and meet at $\\Gamma = 4\\pi Ua$. A spinning ball curves this way (the Magnus effect), and a wing gets its lift by making circulation with its shape.

### Vortex lines
The lines of $\\nabla\\times\\vec v$ — vortex lines — have a remarkable property in dry water: they move with the fluid, and the circulation round any loop carried by the fluid never changes (Helmholtz, Kelvin). That is why a smoke ring holds together as it travels, and why a whirlpool, once formed, keeps its spin. The speed round a line vortex is $\\Gamma/2\\pi r$ — the bathtub drain.

> [!key] Dry water follows Bernoulli's theorem and, without swirl, Laplace's equation — the flows are the fields of electrostatics. It gets pressure patterns and lift right, but it cannot make drag: a body in steady potential flow feels no net push.
`,
  ideas: [
    'Dry water: incompressible, no viscosity; ∇·v = 0 and Newton\'s law for each blob (Euler\'s equation).',
    'Along a streamline of steady flow p + ½ρv² + ρgz is constant: faster means lower pressure.',
    'Flow without curl has a velocity potential obeying Laplace\'s equation — the same mathematics as electrostatics.',
    'Past a cylinder: surface speed 2U sinθ, C_p = 1 − 4 sin²θ, symmetric front and back, so no drag (d\'Alembert\'s paradox).',
    'Circulation Γ gives a sideways force ρUΓ per length; vortex lines move with the fluid.'
  ],
  pitfalls: [
    'Faster fluid has higher pressure because it hits harder — Along a streamline it is the other way round: the fluid speeds up because the pressure ahead is lower.',
    'Dry water pushes an obstacle downstream — The front and back pressures balance exactly; the drag of real flows comes from viscosity and the separated wake behind the body.',
    'A flow with circulation must be swirling everywhere — Outside the cylinder the flow with Γ is still free of curl; the circulation is carried by the body (or by a vortex line at its centre).'
  ],
  derivation: {
    title: 'Bernoulli\'s theorem from energy',
    intro: 'Steady flow of dry water through a thin tube made of streamlines; at section 1 the area is A₁, speed v₁, pressure p₁, height z₁, and similarly at section 2.',
    steps: [
      { text: 'In a short time, a volume $\\Delta V$ enters at 1 and the same volume leaves at 2 (the fluid is incompressible):', tex: 'A_1 v_1\\,\\Delta t = A_2 v_2\\,\\Delta t = \\Delta V' },
      { text: 'The pressure behind pushes it in and does work $p_1\\Delta V$; the pressure ahead resists and takes $p_2\\Delta V$. Net work on the fluid in the tube:', tex: 'W = (p_1 - p_2)\\,\\Delta V' },
      { text: 'The flow is steady, so the only change is that a mass $\\rho\\Delta V$ has in effect moved from 1 to 2, changing its kinetic and potential energy:', tex: '\\Delta E = \\rho\\,\\Delta V\\left(\\tfrac12 v_2^2 - \\tfrac12 v_1^2 + g z_2 - g z_1\\right)' },
      { text: 'No viscosity means no energy is lost to heat: set $W = \\Delta E$, divide by $\\Delta V$ and collect the terms of each end:', tex: 'p_1 + \\tfrac12\\rho v_1^2 + \\rho g z_1 = p_2 + \\tfrac12\\rho v_2^2 + \\rho g z_2' }
    ],
    outro: 'The ingredient that fails in real water is the last one: viscosity turns some of the work into heat.'
  },
  formulas: [
    {
      name: 'Bernoulli\'s theorem along a level streamline',
      expr: 'p2 = p1 + rho*(v1^2 - v2^2)/2', tex: 'p_2 = p_1 + \\tfrac12\\rho\\left(v_1^2 - v_2^2\\right)',
      vars: {
        p2: { name: 'pressure at point 2', q: 'pressure', unit: 'kPa', tex: 'p_2' },
        p1: { name: 'pressure at point 1', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_1' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        v1: { name: 'speed at point 1', q: 'speed', unit: 'm/s', value: 2, tex: 'v_1' },
        v2: { name: 'speed at point 2', q: 'speed', unit: 'm/s', value: 4, tex: 'v_2' }
      },
      note: 'Steady flow, no viscosity, both points on one streamline at the same height (or anywhere, if the flow is irrotational).',
      stories: { p2: 'Water at {p1} flowing at {v1} speeds up to {v2}. What is its pressure there?', v2: 'Water at {p1} and {v1} reaches a place where the pressure is {p2}. How fast is it flowing there?' }
    },
    {
      name: 'Speed on the surface of a cylinder',
      expr: 'vs = 2*U*sin(theta)', tex: 'v_s = 2U\\sin\\theta',
      vars: {
        vs: { name: 'speed along the surface', q: 'speed', unit: 'm/s', tex: 'v_s' },
        U: { name: 'speed of the stream far away', q: 'speed', unit: 'm/s', value: 2 },
        theta: { name: 'angle from the front stagnation point', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'Potential flow without circulation; the radius does not matter. Largest, 2U, at θ = 90°.',
      stories: { vs: 'A river flows at {U} past a round pier. How fast does the water slide past the pier at {theta} from the front?' }
    },
    {
      name: 'Pressure round a cylinder',
      expr: 'Cp = 1 - 4*sin(theta)^2', tex: 'C_p = \\dfrac{p - p_\\infty}{\\frac12\\rho U^2} = 1 - 4\\sin^2\\theta',
      vars: {
        Cp: { name: 'pressure coefficient', signed: true, tex: 'C_p' },
        theta: { name: 'angle from the front stagnation point', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' }
      },
      note: '+1 at the stagnation points, −3 at the sides, and the same at the back as at the front — no drag.',
      stories: { Cp: 'What is the pressure coefficient at {theta} round a cylinder in dry water?', theta: 'At what angle from the front is the pressure coefficient {Cp}?' }
    },
    {
      name: 'Lift from circulation (Kutta–Joukowski)',
      expr: 'F = rho*U*Gam*b', tex: 'F = \\rho U \\Gamma b',
      vars: {
        F: { name: 'sideways force (lift)', q: 'force', unit: 'N' },
        rho: { name: 'density of the fluid', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        U: { name: 'stream speed', q: 'speed', unit: 'm/s', value: 10 },
        Gam: { name: 'circulation round the body', unit: 'm²/s', value: 12.57, tex: '\\Gamma' },
        b: { name: 'length of the body across the stream', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Any two-dimensional body in steady potential flow. A cylinder of radius a spinning with surface speed w carries Γ = 2πa·w.',
      stories: { F: 'Air ({rho}) flows at {U} past a spinning cylinder {b} long with circulation {Gam}. What is the lift?', Gam: 'What circulation gives {F} of lift on a body {b} long in a stream of {U} ({rho})?' }
    }
  ],
  examples: [
    {
      title: 'Water round a bridge pier',
      q: 'A river flows at 2 m/s past a round pier. Using dry-water theory, find the greatest speed next to the pier, and the pressure there and at the front, relative to the stream far away.',
      steps: [
        'Greatest speed: $2U = 4$ m/s, at the sides ($\\theta = 90°$).',
        'Pressure at the sides: $\\tfrac12\\rho(U^2 - 4U^2) = \\tfrac12 \\times 1000 \\times (4 - 16) = -6$ kPa, i.e. $C_p = -3$.',
        'At the front stagnation point: $+\\tfrac12\\rho U^2 = +2$ kPa. At the back: also $+2$ kPa in dry water.'
      ],
      a: '4 m/s at the sides; −6 kPa there and +2 kPa at the front (and, in dry water, at the back too).'
    },
    {
      title: 'Where the pressure is normal',
      q: 'At what points on a cylinder in potential flow is the pressure the same as in the stream far away?',
      steps: [
        'Set $C_p = 1 - 4\\sin^2\\theta = 0$: $\\sin\\theta = \\tfrac12$.',
        '$\\theta = 30°$ and $150°$ (and the mirror images below).'
      ],
      a: 'At 30° and 150° from the front stagnation point.'
    },
    {
      title: 'A spinning cylinder',
      q: 'A cylinder of radius 0.1 m, 1 m long, spins so that its surface moves at 20 m/s, in a 10 m/s wind ($\\rho$ = 1.225 kg/m³). Estimate the circulation, the lift, and where the stagnation points are.',
      steps: [
        '$\\Gamma = 2\\pi a w = 2\\pi \\times 0.1 \\times 20 = 12.6$ m²/s.',
        'Lift: $\\rho U\\Gamma b = 1.225 \\times 10 \\times 12.6 \\times 1 = 154$ N.',
        'The stagnation points sit where $2U\\sin\\theta = \\Gamma/2\\pi a$, i.e. $\\sin\\theta = \\Gamma/4\\pi Ua = 12.6/12.6 = 1$: they have merged at one point on the side.'
      ],
      a: 'About 154 N per metre (in real air, somewhat less); the two stagnation points have just met.'
    }
  ],
  quiz: [
    { q: 'In dry water flowing steadily past a cylinder, the drag on the cylinder is…', choices: ['zero', 'ρU²a per unit length', 'infinite', 'the same as in real water'], a: 0, why: 'The pressure at the back equals that at the front, point by point: d\'Alembert\'s paradox.' },
    { q: 'Along a streamline of steady dry-water flow, where the fluid moves faster its pressure is lower.', a: true, why: 'p + ½ρv² is constant along the streamline (at one height).' },
    { q: 'The velocity potential of an incompressible flow without curl obeys the same equation as…', choices: ['the electrostatic potential in empty space', 'the heat flow in a moving wire', 'the wave equation', 'Newton\'s second law for a particle'], a: 0, why: '∇·v = 0 and v = −∇φ give ∇²φ = 0, Laplace\'s equation.' },
    { q: 'In a uniform stream U, the fastest flow on the surface of a cylinder is…', choices: ['2U, at the top and bottom', 'U, everywhere', '2U, at the front', 'zero, at the top'], a: 0, why: 'The surface speed is 2U sinθ, largest at θ = 90°.' },
    { q: 'Adding circulation Γ round the cylinder produces…', choices: ['a force across the stream, ρUΓ per unit length', 'drag along the stream', 'no force at all', 'a torque that stops the spin'], a: 0, why: 'The flow is faster on one side, so the pressure there is lower: the Kutta–Joukowski lift.' }
  ],
  problems: [
    { q: 'Water flows level through a pipe at 1.5 m/s and 250 kPa, then through a narrow section at 6 m/s. What is the pressure in the narrow section?', answer: 233.1, unit: 'kPa', tol: 0.01, hint: 'p₂ = p₁ + ½ρ(v₁² − v₂²).',
      steps: ['$\\tfrac12\\rho(v_1^2 - v_2^2) = 500 \\times (2.25 - 36) = -16\\,875$ Pa.', '$p_2 = 250 - 16.9 = 233.1$ kPa.'] },
    { q: 'At what angle from the front stagnation point is the pressure on a cylinder in potential flow lowest, and what is C_p there?', answer: -3, tol: 0.01, hint: 'C_p = 1 − 4 sin²θ.',
      steps: ['$\\sin^2\\theta$ is largest, 1, at $\\theta = 90°$.', '$C_p = 1 - 4 = -3$.'] }
  ],
  applications: [
    'Venturi meters and carburettors measure or use the pressure drop where a flow speeds up.',
    'Airfoil design starts from potential flow, as in the [airfoil lab](#/tools/airfoil) of Hyper Aerodynamics; viscosity is added as a thin boundary layer.',
    'Groundwater seeping through soil and the flow of heat obey the same Laplace equation as potential flow.',
    'Rotor sails on ships use the Magnus effect of a spinning cylinder in the wind.'
  ],
  history: 'Daniel Bernoulli published his theorem in *Hydrodynamica* in 1738. Jean le Rond d\'Alembert found in 1752 that an ideal fluid exerts no drag, and Leonhard Euler wrote the equations of ideal fluid motion in 1757. Hermann von Helmholtz proved in 1858 that vortex lines move with an ideal fluid, and William Thomson (Lord Kelvin) gave the circulation theorem in 1869. Gustav Magnus studied the sideways force on spinning cylinders in the 1850s, and Martin Kutta (1902) and Nikolai Joukowski (1906) related lift to circulation.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 40 (The Flow of Dry Water) — hydrostatics, the equations of motion of an ideal fluid, steady flow and Bernoulli\'s theorem, circulation and vortex lines.',
    'Vol. II, ch. 12 (Electrostatic Analogs) — the irrotational flow of a fluid as one more problem governed by the equations of electrostatics, including the flow past a sphere.'
  ],
  sim: 'mat-dry-flow'
},

{
  id: 'flow-of-wet-water', parent: 'fluids-feyn', title: 'The flow of "wet" water: viscosity and turbulence', level: 2,
  short: 'Real water is sticky. Viscosity makes it cling to walls and spreads momentum sideways; the Reynolds number compares inertia with that stickiness and decides the character of a flow. Behind a cylinder the flow goes from smooth, to trapped eddies, to a street of alternating vortices, to turbulence — still one of the great unsolved problems of classical physics.',
  keywords: ['viscosity', 'wet water', 'no-slip condition', 'shear stress', 'Couette flow', 'kinematic viscosity', 'Navier–Stokes equation', 'Reynolds number', 'similarity', 'laminar', 'turbulence', 'vortex shedding', 'Kármán vortex street', 'Strouhal number', 'boundary layer', 'wake', 'drag', 'lattice Boltzmann'],
  prereq: ['flow-of-dry-water', 'diffusion-random-walk', 'physics:viscosity'],
  related: ['superfluid-helium', 'aerodynamics:reynolds-number', 'aerodynamics:vortex-shedding', 'aerodynamics:navier-stokes', 'aerodynamics:boundary-layer', 'aerodynamics:turbulence', 'aerodynamics:drag-crisis', 'hydraulics:laminar-turbulent', 'physics:drag-force'],
  body: `
### Viscosity
Put water between two plates a distance $d$ apart and slide the top one at speed $v$. The water clings to both plates — the **no-slip condition** — so it is sheared, each layer sliding over the one below. Keeping the plate moving takes a force per unit area
$$\\frac{F}{A} = \\eta\\,\\frac{v}{d},$$
which defines the **viscosity** $\\eta$. Dividing by the density gives the kinematic viscosity $\\nu = \\eta/\\rho$:

| Fluid (20 °C) | $\\eta$ | $\\nu = \\eta/\\rho$ |
|---|---|---|
| air | $1.8\\times10^{-5}$ Pa·s | $1.5\\times10^{-5}$ m²/s |
| water | $1.0\\times10^{-3}$ Pa·s | $1.0\\times10^{-6}$ m²/s |
| olive oil | 0.08 Pa·s | $9\\times10^{-5}$ m²/s |
| glycerol | 1.4 Pa·s | $1.1\\times10^{-3}$ m²/s |

Viscosity is momentum leaking sideways from fast layers to slow ones, and $\\nu$ is its diffusion coefficient: in a time $t$ the motion of a wall spreads a distance of about $\\sqrt{\\nu t}$ into the fluid (a [[?random-walk]] of momentum). The second sim starts the top plate suddenly: watch the velocity profile creep down until it becomes a straight line, after a time of order $d^2/\\nu$ — 100 s for 1 cm of water, a tenth of a second for glycerol.

### The Navier–Stokes equation
Add the viscous force to the dry-water equation and you have the equation of real water:
$$\\rho\\left(\\frac{\\partial\\vec v}{\\partial t} + (\\vec v\\cdot\\nabla)\\vec v\\right) = -\\nabla p + \\eta\\nabla^2\\vec v .$$
In water the new term (a [[?laplacian]], built of [[?partial-derivative|partial derivatives]]) is small — but it holds the highest derivatives, and throwing it away changes the kind of solutions allowed: however small the viscosity, real water still sticks to the wall. So the limit of vanishing viscosity is **not** dry water. A thin **boundary layer**, of thickness about $D/\\sqrt{\\mathrm{Re}}$, always remains in which viscosity matters, and it is what peels off a body and leaves a wake.

### The Reynolds number
Measure speeds in units of the stream speed $U$ and lengths in units of the body's size $D$. The equation then contains a single number,
$$\\mathrm{Re} = \\frac{\\rho U D}{\\eta} = \\frac{UD}{\\nu},$$
the ratio of inertia to viscous force. Two flows round bodies of the same shape with the same Re are the same flow, scaled — the reason a model in a wind tunnel tells you about the aircraft. A bacterium lives at $\\mathrm{Re} \\sim 10^{-4}$, where coasting is impossible; a swimmer at $10^{6}$; an airliner's wing at about $10^{7}$–$10^{8}$.

### Flow past a cylinder, stage by stage
Feynman followed the flow past a circular cylinder as Re rises. The first sim does it with a lattice-Boltzmann model, a computer fluid that obeys the Navier–Stokes equation for slow flows; dye streaks show the flow and colours show the swirl.

| Re | what happens behind the cylinder |
|---|---|
| below about 5 | the flow closes up behind, nearly symmetric front and back |
| 5 to 47 | two eddies sit attached behind it, longer as Re grows |
| 47 to about 190 | the eddies break away in turn: a **Kármán vortex street**, shed at $f \\approx 0.12$–$0.2\\,U/D$ |
| about 200 to $2\\times10^{5}$ | the wake becomes turbulent; drag coefficient about 1 |
| above about $3\\times10^{5}$ | the boundary layer itself turns turbulent, clings longer, and the drag suddenly drops |

The shedding frequency, as the Strouhal number $\\mathrm{St} = fD/U \\approx 0.2$, makes wires sing in the wind: 10 m/s past a 5 mm wire gives about 400 Hz.

### Turbulence
Beyond, the wake is chaos: eddies within eddies, passing energy down to smaller and smaller ones until viscosity turns it into heat. Nobody can yet derive the statistics of turbulence from the Navier–Stokes equation. Feynman singled out the analysis of turbulent flow as a central unsolved problem of classical physics — an equation that fits on one line, whose solutions hold everything from a dripping tap to the weather.

> [!key] Water always sticks to the walls, so viscosity can never be dropped entirely. The Reynolds number — inertia over viscosity — decides whether a flow is smooth, sheds vortices, or is turbulent; flows of the same shape and the same Re look alike.
`,
  ideas: [
    'Viscosity: shear stress F/A = η v/d; the fluid does not slip at a wall.',
    'Kinematic viscosity ν = η/ρ is a diffusion coefficient for momentum: a wall\'s motion spreads √(νt) in time t.',
    'The Navier–Stokes equation adds η∇²v to Euler\'s; however small η, a boundary layer remains.',
    'Re = ρUD/η = UD/ν; the same shape at the same Re gives the same flow.',
    'Past a cylinder: closed flow, attached eddies, a Kármán vortex street from Re ≈ 47 (St ≈ 0.2), then turbulence.'
  ],
  pitfalls: [
    'Water has so little viscosity that ignoring it gives the right flow — Near every surface a boundary layer remains in which viscosity dominates; it causes separation, wakes and drag.',
    'A small model in a wind tunnel behaves like the full-size object at the same speed — Only at the same Reynolds number; a model ten times smaller needs ten times the speed (or a different fluid).',
    'Turbulence is just random noise laid over the flow — It is a deterministic solution of the Navier–Stokes equation, chaotic and multi-scale, carrying energy from large eddies to small ones.'
  ],
  formulas: [
    {
      name: 'Viscous force on a sliding plate',
      expr: 'F = eta*A*v/d', tex: 'F = \\eta A\\,\\dfrac{v}{d}',
      vars: {
        F: { name: 'force needed to slide the plate', q: 'force', unit: 'N' },
        eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta' },
        A: { name: 'area of the plate', q: 'area', unit: 'm²', value: 1 },
        v: { name: 'speed of the plate', q: 'speed', unit: 'm/s', value: 1 },
        d: { name: 'thickness of the fluid layer', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'Steady shear between parallel plates (Couette flow): the velocity falls linearly across the gap.',
      stories: { F: 'A plate of {A} slides at {v} over a {d} film of fluid with viscosity {eta}. What force does it take?', eta: 'Sliding a plate of {A} at {v} over a {d} film takes {F}. What is the viscosity?' }
    },
    {
      name: 'The Reynolds number',
      expr: 'Re = rho*v*D/eta', tex: '\\mathrm{Re} = \\dfrac{\\rho v D}{\\eta}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        v: { name: 'flow speed', q: 'speed', unit: 'm/s', value: 0.5 },
        D: { name: 'size of the body (diameter)', q: 'length', unit: 'mm', value: 20 },
        eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta' }
      },
      note: 'Inertia over viscous force. Past a cylinder: vortex street from about 47, turbulent wake from about 200.',
      stories: { Re: 'Water ({rho}, {eta}) flows at {v} past a rod of diameter {D}. What is the Reynolds number?', v: 'How fast must water ({rho}, {eta}) flow past a {D} rod for the Reynolds number to reach {Re}?' }
    },
    {
      name: 'Vortex shedding frequency',
      expr: 'f = St*v/D', tex: 'f = \\mathrm{St}\\,\\dfrac{v}{D}',
      vars: {
        f: { name: 'shedding frequency (each side)', q: 'frequency', unit: 'Hz' },
        St: { name: 'Strouhal number (about 0.2 for a cylinder)', value: 0.2, tex: '\\mathrm{St}' },
        v: { name: 'flow speed', q: 'speed', unit: 'm/s', value: 10 },
        D: { name: 'diameter', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'St ≈ 0.2 for a circular cylinder over a wide range, Re ≈ 300 to 2 × 10⁵; lower (0.12–0.19) near the onset.',
      stories: { f: 'Wind at {v} blows across a wire of diameter {D}. At what frequency does it shed vortices (and sing)?', v: 'A {D} cable hums at {f}. How fast is the wind?' }
    },
    {
      name: 'Time for viscosity to cross a gap',
      expr: 't = d^2/nu', tex: 't \\sim \\dfrac{d^2}{\\nu}',
      vars: {
        t: { name: 'time for the motion to spread across', q: 'time', unit: 's' },
        d: { name: 'distance', q: 'length', unit: 'mm', value: 10 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 1, tex: '\\nu' }
      },
      note: 'An order of magnitude: momentum diffuses like heat or ink. Water has ν = 1 mm²/s, air 15 mm²/s, glycerol about 1100 mm²/s.',
      stories: { t: 'The top plate over a {d} layer of fluid (ν = {nu}) starts to move. Roughly how long until the whole layer follows?' }
    }
  ],
  examples: [
    {
      title: 'A bacterium and a whale',
      q: 'Find the Reynolds numbers of a bacterium 2 µm long swimming at 30 µm/s and of a whale 25 m long swimming at 5 m/s, both in water ($\\nu = 10^{-6}$ m²/s).',
      steps: [
        'Bacterium: $\\mathrm{Re} = 2\\times10^{-6} \\times 3\\times10^{-5}/10^{-6} = 6\\times10^{-5}$.',
        'Whale: $\\mathrm{Re} = 25 \\times 5/10^{-6} = 1.25\\times10^{8}$.',
        'Twelve orders of magnitude apart: when the bacterium stops swimming it stops dead within a fraction of its own size; the whale glides on.'
      ],
      a: 'About 6 × 10⁻⁵ and 1 × 10⁸.'
    },
    {
      title: 'Singing wires',
      q: 'Wind at 10 m/s blows across a telephone wire 5 mm thick. At what frequency are vortices shed, and what is the Reynolds number ($\\nu_\\text{air} = 1.5\\times10^{-5}$ m²/s)?',
      steps: [
        '$f = 0.2 \\times 10/0.005 = 400$ Hz — an audible hum.',
        '$\\mathrm{Re} = 10 \\times 0.005/1.5\\times10^{-5} = 3300$: well inside the vortex-shedding range.'
      ],
      a: 'About 400 Hz, at Re ≈ 3300.'
    },
    {
      title: 'How fast does a shear flow start?',
      q: 'A plate starts sliding over a 1 cm layer. Roughly how long until the whole layer is moving, for water, air and glycerol?',
      steps: [
        '$t \\sim d^2/\\nu$ with $d^2 = 10^{-4}$ m².',
        'Water: $10^{-4}/10^{-6} = 100$ s. Air: $10^{-4}/1.5\\times10^{-5} = 7$ s. Glycerol: $10^{-4}/1.1\\times10^{-3} = 0.09$ s.'
      ],
      a: 'About 100 s, 7 s and 0.1 s — the more viscous the fluid, the faster momentum spreads.'
    }
  ],
  quiz: [
    { q: 'Flows past two cylinders of different sizes look alike (scaled) when…', choices: ['they have the same Reynolds number', 'they have the same speed', 'they are in the same fluid', 'they have the same pressure'], a: 0, why: 'In dimensionless form the Navier–Stokes equation contains only Re.' },
    { q: 'As the viscosity of water is made smaller and smaller, the flow round a body approaches the dry-water solution everywhere.', a: false, why: 'A boundary layer of thickness about D/√Re always remains at the surface; it separates and makes a wake that dry water never has.' },
    { q: 'Behind a circular cylinder, alternate vortex shedding starts at a Reynolds number of about…', choices: ['47', '1', '10⁵', '10⁻³'], a: 0, why: 'Below about 47 the two eddies stay attached; above it they break away alternately.' },
    { q: 'Which of these lives in a world where viscosity dominates and coasting is impossible?', choices: ['a bacterium', 'a swimmer', 'a whale', 'an airliner'], a: 0, why: 'Its Reynolds number is about 10⁻⁴: inertia is negligible.' },
    { q: 'Water (ρ = 1000 kg/m³, η = 1.0 mPa·s) flows at 0.2 m/s past a rod 10 mm across. What is the Reynolds number?', answer: 2000, why: '1000 × 0.2 × 0.01/0.001 = 2000.' }
  ],
  problems: [
    { q: 'At what frequency does a flagpole 2 cm thick shed vortices in a wind of 5 m/s (St = 0.2)?', answer: 50, unit: 'Hz', tol: 0.02, hint: 'f = St·v/D.',
      steps: ['$f = 0.2 \\times 5/0.02 = 50$ Hz.'] },
    { q: 'A 1:10 scale model of a submarine is tested in the same water. How fast must it go to match the Reynolds number of the real submarine at 2 m/s?', answer: 20, unit: 'm/s', tol: 0.01, hint: 'Keep vD/ν the same.',
      steps: ['$D$ is ten times smaller, so $v$ must be ten times larger.', '$v = 20$ m/s — which is why models are often tested in denser or less viscous fluids, or at higher pressure.'] }
  ],
  applications: [
    'Vortex flowmeters count the vortices shed by a bar across a pipe to measure the flow.',
    'Tall chimneys and cables carry helical strakes that break up regular vortex shedding, which could otherwise shake them at resonance.',
    'Engine oil films, bearings and syringes are designed with viscosity: F/A = ηv/d sets the friction.',
    'Wind tunnels and towing tanks test models at matched Reynolds numbers; the Hyper Aerodynamics pages on [[aerodynamics:reynolds-number|the Reynolds number]] and [[aerodynamics:vortex-shedding|vortex shedding]] go further.'
  ],
  history: 'Isaac Newton proposed in the *Principia* (1687) that the resistance of a sheared fluid is proportional to the rate of shear. Claude-Louis Navier (1822) and George Gabriel Stokes (1845) wrote the equation of viscous flow. Vincenc Strouhal studied the tones of wires in the wind in 1878. Osborne Reynolds showed in 1883, with dye in a glass pipe, that the change from smooth to turbulent flow depends on one number. Ludwig Prandtl introduced the boundary layer in 1904, and Theodore von Kármán analysed the vortex street in 1911–12. Andrey Kolmogorov proposed his statistical theory of turbulence in 1941; a complete theory is still missing.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 41 (The Flow of Wet Water) — viscosity, viscous flow, the Reynolds number, the flow past a circular cylinder, the limit of zero viscosity and Couette flow.',
    'Vol. I, ch. 3 (The Relation of Physics to Other Sciences) — the analysis of turbulent flow named as a great unsolved problem of classical physics.',
    'Vol. II, ch. 40 (The Flow of Dry Water) — the ideal-fluid equations that viscosity corrects.'
  ],
  sim: ['mat-wake', 'mat-shear']
}

);
