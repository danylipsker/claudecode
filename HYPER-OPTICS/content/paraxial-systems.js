/* HYPER-OPTICS · content/paraxial-systems.js — the topic "Stops, pupils and first-order optics".
 * Eleven concepts (the-f-number is in reference.js): the paraxial approximation, ray-transfer matrices, the aperture
 * stop, the pupils, the field stop, chief and marginal rays, numerical aperture, the optical invariant, vignetting,
 * telecentricity, depth of focus. Simulations: sims/paraxial-systems.js (ids px-…).
 */
Hyper.add(

/* ================================================================ the paraxial approximation */
{
  id: 'the-paraxial-approximation', parent: 'paraxial-systems', title: 'The paraxial approximation', level: 1,
  short: 'Near the axis the sine of an angle is the angle itself, and every lens obeys a simple linear law: rays from one point meet at one point. This first-order — Gaussian — optics gives the focal length, the image and the pupils; how far real rays depart from it is what the aberrations measure.',
  keywords: ['paraxial', 'first-order optics', 'Gaussian optics', 'small-angle approximation', 'sin theta approximately theta', 'paraxial ray', 'paraxial focus', 'Gauss', 'near-axis rays', 'linear optics', 'third-order', 'Seidel', 'thin-lens equation'],
  prereq: ['snells-law', 'the-thin-lens-equation', 'math:trig-functions'],
  related: ['ray-transfer-matrices', 'what-aberrations-are', 'spherical-aberration', 'the-seidel-sums', 'refraction-at-a-curved-surface', 'cardinal-points', 'physics:thin-lenses'],
  body: `
Every lens equation in this app — $1/s_o + 1/s_i = 1/f$, the magnification $m = -s_i/s_o$, the focal length of a thick lens — is a promise that **rays leaving one point of the object meet again at one point of the image**. The promise is kept only for rays that stay close to the axis and meet each surface at a small angle. How close is close, and what happens beyond, is what this page is about.

### The approximation
Snell's law, $n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$ ([[snells-law]]), is not linear in the angles, and a lens built from it cannot focus perfectly. But for a small angle, measured in radians,

$$\\sin\\theta \\approx \\theta - \\frac{\\theta^3}{6} \\approx \\theta, \\qquad \\tan\\theta \\approx \\theta, \\qquad \\cos\\theta \\approx 1$$

and Snell's law collapses to $n_1\\theta_1 \\approx n_2\\theta_2$. Each surface then changes a ray's slope by an amount proportional to the ray's height and its slope, so the equations are **linear**, and linear equations have exact and simple solutions: the lens equation, the focal length, the position and size of the image, the pupils. This is **first-order optics**, also called **paraxial** ("beside the axis") or **Gaussian** optics after Gauss, who developed it in 1841.

### How small is small?
| angle | θ in radians | θ exceeds sin θ by | tan θ exceeds θ by |
|---|---|---|---|
| 5° | 0.0873 | 0.13 % | 0.26 % |
| 10° | 0.1745 | 0.51 % | 1.0 % |
| 20° | 0.3491 | 2.1 % | 4.3 % |
| 30° | 0.5236 | 4.7 % | 10 % |

The error of the sine is about $\\theta^2/6$, so it stays below 1 % up to about 14°.

### What the real rays do
Trace a ray exactly through a biconvex lens of 100 mm focal length and 25.4 mm diameter (f/3.9). A ray 2 mm from the axis crosses it 0.06 mm short of the paraxial focus; at 4 mm, 0.25 mm short; at 12 mm, 2.3 mm short — 2.3 % of the focal length, although the ray meets the first surface at only 6.7°. Two lessons. The miss grows as the **square** of the height: the first term beyond the paraxial one is of third order. And the focus error is far larger than the angle error alone suggests, because a small slope error is magnified where the ray at last meets the axis at a shallow angle. These departures are the **aberrations**: [[what-aberrations-are]], beginning with [[spherical-aberration]], and tallied by [[the-seidel-sums]].

### Why it is still the first step
A designer begins with a paraxial layout: focal length, f-number, the positions of the image and the pupils, the size of every lens ([[ray-transfer-matrices]], [[aperture-stop]], [[entrance-and-exit-pupils]]). A paraxial ray is a mathematical device — its "height" may be a metre in a system a centimetre wide — and its linear laws are what make a layout possible by hand. Exact rays are traced afterwards, to see how far the real lens falls short.

> [!note] Even the focal length is a limit: it is defined as the distance at which rays of vanishing height focus. It is not where a wide-open lens focuses best — that point lies a little nearer.

> [!key] Paraxial optics replaces $\\sin\\theta$ by $\\theta$ and so makes every lens law linear: it gives focal length, image position and size, f-number and pupils. How far real rays depart from it is the subject of aberrations.
`,
  ideas: [
    'For small angles sin θ ≈ tan θ ≈ θ, so Snell\'s law becomes n₁θ₁ ≈ n₂θ₂ and every ray equation is linear.',
    'First-order, paraxial and Gaussian optics are three names for the same linear theory: focal length, image position and size, pupils.',
    'θ is within 1 % of sin θ up to about 14°; within 0.13 % at 5° and 2 % at 20°.',
    'A real ray misses the paraxial focus by an amount that grows as the square of its height: third-order spherical aberration.',
    'A design starts with a paraxial layout and is then checked with exact rays.'
  ],
  pitfalls: [
    'A paraxial ray is a real ray that happens to be near the axis — It is a mathematical device: the linear equations are applied at any height, and the result is the ideal image that the real lens approaches as its aperture shrinks.',
    'A lens with the right paraxial focal length forms a perfect image — Paraxial theory describes only the ideal. Real rays at the edge of the aperture cross the axis elsewhere; that difference is the aberration.',
    'The small-angle limit concerns only the field angle — It applies to every angle in the system: the angle of incidence on each surface, the slope inside the glass and the marginal ray at the image. At f/1.4 the marginal ray reaches the image at about 20°.'
  ],
  terms: [
    { term: 'Paraxial ray', def: 'A ray that stays so close to the axis, and at such small angles, that sin θ and tan θ can be replaced by θ. In practice a ray traced with the linear equations of first-order optics, at whatever height.' },
    { term: 'First-order optics', also: ['Gaussian optics', 'paraxial optics', 'Gaussian approximation'], def: 'The theory of imaging in which angles are small enough for Snell\'s law to be linear. It gives focal lengths, image positions and sizes, and the pupils, and it predicts perfect images.' },
    { term: 'Small-angle approximation', also: ['sin θ ≈ θ'], def: 'For an angle θ in radians, sin θ ≈ tan θ ≈ θ and cos θ ≈ 1. The sine is smaller than θ by about θ²/6 of itself, the tangent larger by about θ²/3.' },
    { term: 'Paraxial focus', also: ['Gaussian focus', 'paraxial image point'], def: 'The point where rays infinitely close to the axis cross it: the image point of first-order optics, from which a datasheet focal length is measured.' },
    { term: 'Third-order aberrations', also: ['Seidel aberrations', 'primary aberrations'], def: 'The first departures from paraxial behaviour, arising from the θ³ term of the sine: spherical aberration, coma, astigmatism, field curvature and distortion.' }
  ],
  formulas: [
    {
      name: 'How far θ is from sin θ',
      expr: 'err = (t - sin(t))/sin(t)', tex: '\\varepsilon = \\frac{\\theta - \\sin\\theta}{\\sin\\theta}',
      vars: {
        err: { name: 'θ exceeds sin θ by', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        t: { name: 'angle', q: 'angle', unit: '°', value: 10, min: 0.1, max: 60, tex: '\\theta' }
      },
      note: 'The error of treating the sine as the angle itself: about θ²/6.',
      stories: { err: 'A ray meets a surface at {t} to the normal. By what fraction is the angle in radians larger than its sine?', t: 'At what angle does θ exceed sin θ by {err}?' }
    },
    {
      name: 'How far tan θ is from θ',
      expr: 'err = (tan(t) - t)/t', tex: '\\varepsilon = \\frac{\\tan\\theta - \\theta}{\\theta}',
      vars: {
        err: { name: 'tan θ exceeds θ by', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        t: { name: 'angle', q: 'angle', unit: '°', value: 14, min: 0.1, max: 60, tex: '\\theta' }
      },
      note: 'The tangent departs about twice as fast as the sine: about θ²/3.'
    },
    {
      name: 'Largest angle that is still paraxial',
      expr: 't = sqrt(6*err)', tex: '\\theta_{\\max} \\approx \\sqrt{6\\,\\varepsilon}',
      vars: {
        t: { name: 'largest angle', q: 'angle', unit: '°', tex: '\\theta_{\\max}' },
        err: { name: 'error you can accept', q: 'ratio', unit: '%', value: 1, min: 0.001, max: 20, tex: '\\varepsilon' }
      },
      note: 'From ε ≈ θ²/6. An error of 1 % allows about 14°, of 0.1 % about 4.4°.',
      stories: { t: 'Rays may depart from the small-angle form by {err} at most. Up to what angle can they be treated as paraxial?' }
    }
  ],
  examples: [
    {
      title: 'How good is the small-angle form of Snell\'s law?',
      q: 'Light enters glass of index 1.5 from air at 10° and at 30° from the normal. Compare the paraxial refraction angle with the exact one.',
      steps: [
        'Paraxial: $\\theta_2 = \\theta_1\\,n_1/n_2 = \\theta_1/1.5$, which is 6.667° and 20.00°.',
        'Exact at 10°: $\\sin\\theta_2 = \\sin 10°/1.5 = 0.11576$, so $\\theta_2 = 6.648°$.',
        'Exact at 30°: $\\sin\\theta_2 = 0.5/1.5 = 0.33333$, so $\\theta_2 = 19.47°$.'
      ],
      a: 'At 10° the paraxial angle is 0.3 % too large; at 30° it is 2.7 % too large (20.0° against 19.5°). Angles of incidence up to about 10° are safely paraxial; at 30° a lens would show clear aberrations.'
    },
    {
      title: 'A fast lens is not paraxial at its image',
      q: 'The marginal ray of an f/2 lens focused at infinity reaches the image with $\\tan\\theta = 1/(2N)$. How far are θ and sin θ apart there, and what is the numerical aperture?',
      steps: [
        { text: 'The slope:', tex: '\\tan\\theta = \\frac{1}{2\\times 2} = 0.25 \\quad\\Rightarrow\\quad \\theta = 14.04° = 0.2450\\ \\mathrm{rad}' },
        '$\\sin\\theta = 0.2425$, so $\\theta$ exceeds $\\sin\\theta$ by 1.0 %.',
        'The numerical aperture is $n\\sin\\theta = 0.2425$, against the paraxial $1/(2N) = 0.25$: 3 % apart.'
      ],
      a: 'A 1 % difference between θ and sin θ, and 3 % between tan θ and sin θ, at f/2 — which is why NA = 1/(2N) is exact only for a lens that obeys the sine condition.'
    }
  ],
  quiz: [
    { q: 'What is the paraxial focus of a lens?', choices: ['The point of smallest blur at full aperture', 'The point where the marginal ray crosses the axis', 'The point where rays vanishingly close to the axis cross it', 'The point where the lens would focus rays arriving at 45°'], a: 2, why: 'It is the limit as the ray height goes to zero. Marginal rays cross the axis nearer the lens (spherical aberration), and the best-focus plane lies between the two.' },
    { q: 'By what percentage does 20° (in radians) exceed its sine? Give the answer in per cent.', answer: 2.06, why: '$20° = 0.34907$ rad and $\\sin 20° = 0.34202$. The difference is 0.00705, or 2.06 % of the sine.' },
    { q: 'A ray 4 mm from the axis misses the paraxial focus of a lens by 0.25 mm. About how far does a ray 8 mm from the axis miss it?', choices: ['0.5 mm', '1.0 mm', '2.0 mm', '0.25 mm'], a: 1, why: 'The leading error is third order, so the miss grows as the square of the height: doubling the height gives four times the miss, 1.0 mm. (An exact trace gives 1.02 mm.)' },
    { q: 'Paraxial optics can predict the size of a lens\'s spherical aberration.', a: false, why: 'Paraxial optics is exactly the theory with no aberrations. The aberrations are what it leaves out — they come from the next terms in the expansion of the sine.' },
    { q: 'Which of these is NOT a quantity of first-order optics?', choices: ['The focal length', 'The position of the entrance pupil', 'The f-number', 'The diameter of the blur spot at full aperture'], a: 3, why: 'Focal length, pupil positions and the f-number follow from the linear theory. A blur spot exists only because real rays depart from it.' }
  ],
  applications: [
    'Every lens datasheet: the focal length, f-number, back focal length and pupil positions are paraxial quantities.',
    'The first-order layout of any new design — choosing powers and spacings by hand or by matrices — before exact tracing and optimization begin.',
    'Spectacle prescriptions: the dioptre power of a lens is its paraxial power, which is why vision is clearest through the centre of the lens.',
    'The magnification, exit pupil and field of every telescope, binocular and microscope.',
    'Gaussian laser beams through lenses, which are propagated with the same linear (ABCD) rules.'
  ],
  history: 'Kepler\'s *Dioptrice* of 1611 worked out how a lens focuses by treating the angle in glass as proportional to the angle in air — true only for small angles. Carl Friedrich Gauss turned the idea into a complete theory in his *Dioptrische Untersuchungen* of 1841, and Philipp Ludwig von Seidel, in 1856, found the next, third-order, terms: the five aberrations that bear his name.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the paraxial approximation and the thin-lens equation derived from it.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — paraxial rays and Gaussian optics.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 4 (Geometrical theory of optical imaging) — Gaussian optics as the first-order theory.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE, 2004) — the paraxial ray equations and the series for the sine.'
  ],
  sim: 'px-paraxial'
},

/* ================================================================ ray-transfer matrices */
{
  id: 'ray-transfer-matrices', parent: 'paraxial-systems', title: 'Ray-transfer (ABCD) matrices', level: 2,
  short: 'Within the paraxial approximation a ray is just a height and an angle, and every element of a system — a gap, a lens, a surface, a mirror — is a 2 × 2 matrix. Multiply the matrices in the order the light meets them and the product gives the focal length, the focal distances and the principal planes of the whole system.',
  keywords: ['ABCD matrix', 'ray transfer matrix', 'ray vector', 'matrix optics', 'system matrix', 'translation matrix', 'refraction matrix', 'thin lens matrix', 'afocal', 'principal planes from matrix', 'Gauss', 'matrix method', 'determinant'],
  prereq: ['the-paraxial-approximation', 'combining-thin-lenses', 'math:matrix-multiplication'],
  related: ['cardinal-points', 'thick-lenses-and-principal-planes', 'first-order-layout', 'gaussian-beams-through-lenses', 'cavity-stability', 'the-optical-invariant', 'math:matrices', 'physics:thin-lenses'],
  body: `
A ray travelling near the axis can be described at any plane by just two numbers: its **height** $y$ above the axis and its **angle** $u$ to the axis (in radians, positive when the ray is climbing). Within [[the-paraxial-approximation]] every element of an optical system — a gap of air, a thin lens, a refracting surface, a mirror — changes those two numbers *linearly*. A linear change of two numbers is a $2\\times 2$ matrix, and a whole system is a product of matrices. That is the method of **ray-transfer**, or **ABCD**, **matrices**.

### The elements
Write the ray as a column, $(y,\\,u)^{\\mathrm T}$, with light travelling left to right.

| element | matrix | effect |
|---|---|---|
| a gap of length $d$ | $\\begin{pmatrix}1&d\\\\0&1\\end{pmatrix}$ | the angle is kept; the height grows by $u\\,d$ |
| a thin lens, focal length $f$ | $\\begin{pmatrix}1&0\\\\-1/f&1\\end{pmatrix}$ | the height is kept; the angle falls by $y/f$ |
| a surface of radius $R$, from index $n_1$ to $n_2$ | $\\begin{pmatrix}1&0\\\\\\frac{n_1-n_2}{n_2R}&\\frac{n_1}{n_2}\\end{pmatrix}$ | the angle is refracted; $R=0$ (flat) leaves only $n_1/n_2$ |
| a mirror of radius $R$ | $\\begin{pmatrix}1&0\\\\2/R&1\\end{pmatrix}$ | drawn "unfolded", light still going right; a concave mirror has $R<0$ |

Radii use the lens-designer's signs: $R>0$ when the centre of curvature is to the right of the surface.

### Multiplying them
Elements met in the order 1, 2, 3 give $M = M_3\\,M_2\\,M_1$: the **first** element is the **right-most** matrix, because the ray vector stands on its right. For $M=\\begin{pmatrix}A&B\\\\C&D\\end{pmatrix}$, taken from the first vertex to the last:

- $C=-1/f$: the system's power is $-C$, its focal length $f=-1/C$.
- Back focal distance $-A/C$ (behind the last vertex) and front focal distance $-D/C$ (in front of the first).
- $AD-BC = n_1/n_2$, which is 1 when both ends are in air — a check on your algebra.
- **$B=0$**: the input and output planes are **conjugate** (an image forms); $A$ is the magnification and $D=1/A$ the angular magnification.
- **$C=0$**: the system is **afocal**; a parallel beam leaves parallel, and $D$ is the angular magnification of a telescope.

### A worked pair
Lens 1 with $f=100$ mm, then 60 mm of air, then lens 2 with $f=50$ mm:

$$M=\\begin{pmatrix}1&0\\\\-\\tfrac1{50}&1\\end{pmatrix}\\begin{pmatrix}1&60\\\\0&1\\end{pmatrix}\\begin{pmatrix}1&0\\\\-\\tfrac1{100}&1\\end{pmatrix}=\\begin{pmatrix}0.4&60\\ \\text{mm}\\\\-0.018\\ \\text{mm}^{-1}&-0.2\\end{pmatrix}$$

The pair has $f=1/0.018=55.6$ mm, a back focal distance of 22.2 mm, and its front focal point lies 11.1 mm *behind* lens 1. The determinant is $-0.08+1.08=1$. A thick lens works the same way: two surface matrices with a gap between them reproduce the lensmaker's equation ([[thick-lenses-and-principal-planes]]).

### Limits
The matrices describe paraxial rays only, in a plane through the axis, with no aberrations. The same matrices carry Gaussian laser beams ([[gaussian-beams-through-lenses]]) and decide whether a laser cavity is stable ([[cavity-stability]]).

> [!key] A ray is $(y, u)$; each element is a $2\\times2$ matrix; multiply them with the first element on the right. Then $-1/C$ is the focal length, $B=0$ marks an image with magnification $A$, and $C=0$ marks an afocal system.
`,
  ideas: [
    'A paraxial ray is two numbers, height y and angle u; each optical element is a 2 × 2 matrix acting on them.',
    'The system matrix is the product of the element matrices, the first element on the right.',
    'C = −1/f gives the focal length; −A/C and −D/C give the back and front focal distances.',
    'B = 0 means the planes are conjugate (A is the magnification); C = 0 means an afocal system (D is the angular magnification).',
    'In air the determinant AD − BC equals 1: a quick check of any calculation.'
  ],
  pitfalls: [
    'The matrices are multiplied in the order the light meets the elements, left to right — Written on paper the product runs right to left, $M = M_n \\cdots M_1$, because each matrix acts on the vector at its right. Reversing the order gives a different system.',
    'The A, B, C, D of a system are fixed numbers of the lens — They depend on where you start and end: the same lens has different B and D if the input plane moves. Only combinations such as C and the determinant are properties of the lens itself.',
    'ABCD matrices can find the aberrations — They contain only the linear (paraxial) behaviour; no blur, coma or distortion can come out of them.',
    'A mirror needs different rules — With the "unfolded" convention it is just another matrix, $C=2/R$, and light is simply imagined to carry on to the right.'
  ],
  terms: [
    { term: 'Ray vector', def: 'The pair (y, u) that describes a paraxial ray at a plane: its height y above the axis and its angle u to the axis in radians (sometimes the reduced angle n·u).' },
    { term: 'Ray-transfer matrix', also: ['ABCD matrix', 'ray matrix'], def: 'A 2 × 2 matrix that turns the ray vector before an element into the ray vector after it. Gaps, lenses, surfaces and mirrors each have one.' },
    { term: 'System matrix', def: 'The product of the matrices of all the elements of a system, taken from its first plane to its last. Its element C gives the focal length, and its A, B, C, D the cardinal points and the imaging conditions.' },
    { term: 'Afocal system', also: ['telescopic system'], def: 'A system with C = 0: parallel rays enter and leave parallel, so it has no finite focal length. A telescope is the standard example; D is its angular magnification.' }
  ],
  formulas: [
    {
      name: 'Ray after a thin lens',
      expr: 'u2 = u1 - y/f', tex: 'u_2 = u_1 - \\frac{y}{f}',
      vars: {
        u2: { name: 'angle after the lens', q: 'angle', unit: 'mrad', signed: true, tex: 'u_2' },
        u1: { name: 'angle before the lens', q: 'angle', unit: 'mrad', signed: true, value: 0, tex: 'u_1' },
        y: { name: 'height at the lens', q: 'length', unit: 'mm', signed: true, value: 10 },
        f: { name: 'focal length', q: 'length', unit: 'mm', signed: true, value: 100 }
      },
      note: 'The second row of the lens matrix. A ray entering parallel (u₁ = 0) is bent by y/f towards the axis.',
      stories: { u2: 'A ray travelling parallel to the axis meets a thin lens of focal length {f} at a height of {y}. At what angle does it leave?' }
    },
    {
      name: 'Focal length from the system matrix',
      expr: 'f = -1/C', tex: 'f = -\\frac{1}{C}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm', signed: true },
        C: { name: 'matrix element C (power)', q: 'optpower', unit: 'D', signed: true, value: -18 }
      },
      note: 'C is in dioptres when lengths are in metres, or per mm when they are in mm; C = −18 D means f = +55.6 mm.',
      stories: { f: 'The system matrix of a lens pair has C = {C}. What is its focal length?' }
    },
    {
      name: 'Back focal distance from the matrix',
      expr: 'bfd = -A/C', tex: '\\mathrm{BFD} = -\\frac{A}{C}',
      vars: {
        bfd: { name: 'back focal distance', q: 'length', unit: 'mm', signed: true, tex: '\\mathrm{BFD}' },
        A: { name: 'matrix element A', signed: true, value: 0.4 },
        C: { name: 'matrix element C', q: 'optpower', unit: 'D', signed: true, value: -18 }
      },
      note: 'Measured from the last vertex; negative means the focus lies inside the system.'
    },
    {
      name: 'Two thin lenses',
      expr: 'f = f1*f2/(f1 + f2 - d)', tex: 'f = \\frac{f_1 f_2}{f_1 + f_2 - d}',
      vars: {
        f: { name: 'focal length of the pair', q: 'length', unit: 'mm', signed: true },
        f1: { name: 'first lens', q: 'length', unit: 'mm', signed: true, value: 100, tex: 'f_1' },
        f2: { name: 'second lens', q: 'length', unit: 'mm', signed: true, value: 50, tex: 'f_2' },
        d: { name: 'separation', q: 'length', unit: 'mm', value: 60, min: 0 }
      },
      note: 'The product L₂ T L₁ read through C. When d = f₁ + f₂ the pair is afocal and f is infinite.',
      stories: { f: 'Two thin lenses of {f1} and {f2} focal length stand {d} apart. What is the focal length of the pair?', d: 'What separation gives lenses of {f1} and {f2} a combined focal length of {f}?' }
    }
  ],
  examples: [
    {
      title: 'A pair of lenses, end to end',
      q: 'A lens of $f_1 = 100$ mm and a lens of $f_2 = 50$ mm are 60 mm apart. A ray enters parallel to the axis at a height of 5 mm. Find where it leaves the second lens, and the focal length and back focal distance of the pair.',
      steps: [
        { text: 'The ray vector is $(5, 0)$. Lens 1 turns it into $(5,\\ -5/100) = (5,\\ -0.05)$.' },
        { text: 'Over 60 mm the height falls by $60\\times0.05 = 3$ mm: $(2,\\ -0.05)$.' },
        { text: 'Lens 2 changes the angle by $-2/50 = -0.04$: $(2,\\ -0.09)$ — the ray leaves 2 mm from the axis, heading down at 0.09 rad. The product matrix gives the same: $(0.4\\times5,\\ -0.018\\times5) $ is $(2,\\ -0.09)$.' },
        { text: 'From $C = -0.018\\ \\mathrm{mm^{-1}}$:', tex: 'f = -\\frac1C = 55.6\\ \\mathrm{mm},\\qquad \\mathrm{BFD} = -\\frac{A}{C} = \\frac{0.4}{0.018} = 22.2\\ \\mathrm{mm}' }
      ],
      a: 'The pair acts as a lens of 55.6 mm focal length whose focus lies 22.2 mm behind lens 2; the ray crosses the axis there ($2/0.09 = 22.2$ mm later).'
    },
    {
      title: 'A thick lens from two surfaces',
      q: 'A glass lens of index 1.5 has radii $R_1 = +100$ mm and $R_2 = -100$ mm and is 10 mm thick. Find its focal length and back focal distance with matrices.',
      steps: [
        'Front surface (air to glass): $\\begin{pmatrix}1&0\\\\-0.003333&0.6667\\end{pmatrix}$. Gap of 10 mm: $\\begin{pmatrix}1&10\\\\0&1\\end{pmatrix}$. Back surface (glass to air): $\\begin{pmatrix}1&0\\\\-0.005&1.5\\end{pmatrix}$.',
        { text: 'Multiplied in the order the light meets them (back surface on the left):', tex: 'M = \\begin{pmatrix}0.9667&6.667\\\\-0.009833&0.9667\\end{pmatrix}' },
        { text: 'Then', tex: 'f = \\frac{1}{0.009833} = 101.7\\ \\mathrm{mm},\\qquad \\mathrm{BFD} = \\frac{0.9667}{0.009833} = 98.3\\ \\mathrm{mm}' }
      ],
      a: 'f = 101.7 mm and BFD = 98.3 mm. A thin-lens calculation gives 100 mm; the thickness moves the rear principal plane 3.4 mm inside the glass.'
    }
  ],
  quiz: [
    { q: 'A ray parallel to the axis meets a thin lens of $f = 50$ mm at a height of 10 mm. What is its angle after the lens?', choices: ['+0.2 rad, away from the axis', '−0.2 rad, towards the axis', '0', '−0.02 rad'], a: 1, why: '$u_2 = u_1 - y/f = 0 - 10/50 = -0.2$ rad: the ray is bent down towards the axis by the amount the lens matrix gives.' },
    { q: 'Light meets lens 1, then a gap, then lens 2. Which product gives the system matrix?', choices: ['$L_1\\,T\\,L_2$', '$L_2\\,T\\,L_1$', '$T\\,L_1\\,L_2$', 'Any order: matrices commute'], a: 1, why: 'Each matrix acts on the vector at its right, so the first element is the right-most: $M = L_2 T L_1$. Matrices in general do not commute.' },
    { q: 'A system in air has $A = 0.5$, $B = 30$ mm and $C = -0.02\\ \\mathrm{mm^{-1}}$. What must D be?', answer: 0.8, why: 'In air $AD - BC = 1$: $0.5D + 30\\times0.02 = 1$, so $D = 0.8$.' },
    { q: 'A system whose matrix has $C = 0$ turns a parallel beam into a parallel beam.', a: true, why: 'With $C=0$ the angle after the system is $D\\,u$ for any height: rays that entered parallel leave parallel. That is an afocal (telescopic) system, with angular magnification $D$.' },
    { q: 'The system matrix of a lens has $C = -0.025\\ \\mathrm{mm^{-1}}$. What is its focal length, in mm?', answer: 40, unit: 'mm', why: '$f = -1/C = 1/0.025 = 40$ mm.' }
  ],
  applications: [
    'Lens-design programs lay out a system to first order with these matrices before any exact ray is traced.',
    'Laser resonators: a cavity is a periodic ABCD system, stable when $|A + D| < 2$.',
    'Gaussian beams: the same matrices, applied to the complex beam parameter q, give the waist and spot size after any train of lenses.',
    'Telescope and zoom-lens design: the afocal condition C = 0, and D as the angular magnification.',
    'A spreadsheet that returns the focal length, back focal length and principal planes of a compound lens in a dozen cells.'
  ],
  history: 'Transforming a ray as a vector goes back to Gauss. The matrix form became standard in optical engineering with W. Brouwer\'s *Matrix Methods in Optical Instrument Design* (1964) and A. Gerrard and J. M. Burch\'s *Introduction to Matrix Methods in Optics* (1975). H. Kogelnik and T. Li (1966) used the same matrices for laser resonators and Gaussian beams.',
  sources: [
    'A. Gerrard and J. M. Burch, *Introduction to Matrix Methods in Optics* (Wiley, 1975) — the method in full.',
    'E. Hecht, *Optics*, ch. 6 (More on Geometrical Optics) — analytical ray tracing with matrices.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 1 (Ray Optics) — matrix optics and its use for resonators.',
    'H. Kogelnik and T. Li, "Laser beams and resonators", *Applied Optics* 5 (1966) — ABCD matrices applied to Gaussian beams.'
  ],
  sim: 'px-abcd'
},

/* ================================================================ the aperture stop */
{
  id: 'aperture-stop', parent: 'paraxial-systems', title: 'The aperture stop', level: 1,
  short: 'Of all the openings in a lens — iris, lens rims, barrel — one sets how wide a cone of light from the axial point gets through. That opening is the aperture stop. It fixes the f-number, hence the brightness, the diffraction blur and the depth of field, but not the field of view.',
  keywords: ['aperture stop', 'stop', 'iris', 'diaphragm', 'aperture', 'clear aperture', 'limiting aperture', 'STO', 'opening', 'iris diaphragm', 'aperture ring', 'stopping down', 'which opening limits'],
  prereq: ['lens-ray-diagrams', 'the-paraxial-approximation'],
  related: ['entrance-and-exit-pupils', 'the-f-number', 'aperture-and-f-stops', 'field-stop-and-field-of-view', 'vignetting', 'the-pupil', 'apertures-irises-and-pinholes', 'symmetry-and-the-stop'],
  body: `
Every optical system lets through only part of the light that reaches it, and one opening decides how much. It may be the iris of a camera lens, the black ring of a telescope tube, the rim of an objective glass, the pupil of your eye. That opening is the **aperture stop**.

### What it does
From a point on the axis of the object, light spreads in all directions; the system passes only a cone of it. The aperture stop is the opening that sets the width of that cone. Every other opening — the rims of the other lenses, the barrel, a baffle — is wider than that cone needs. So the stop alone determines

- how much light reaches the image: the illuminance goes as $1/N^2$ ([[the-f-number]]);
- how far diffraction blurs the image ([[the-airy-disk]]) and how deep the zone of sharpness is;
- which part of each lens the rays use, and so how large the aberrations are.

It does **not** decide how wide a scene the lens sees: that is the job of the [[field-stop-and-field-of-view|field stop]].

### How to find it
Look at every opening from the axial object point, through whatever glass lies in front of it, and ask which one subtends the smallest angle. A ray-tracing version: send a ray from the axial point and divide the clear semi-diameter of each surface by the ray's height there; the smallest ratio belongs to the stop. The half-angle of the cone through an opening of diameter $D$ at distance $s$ is $\\tan\\theta = D/2s$.

A worked case. A lens of $f=100$ mm and 40 mm diameter, and a second opening 50 mm behind it. For a distant object the beam, 40 mm wide at the lens, has shrunk to half its width at the second opening. If that opening is 25 mm across the beam fits: the **lens** is the stop (f/2.5). If it is 15 mm across, only a beam 30 mm wide at the lens can pass: now the **rear opening** is the stop, the lens works at f/3.3, and the entrance pupil is 30 mm across.

### Where stops sit
| system | its aperture stop |
|---|---|
| camera lens | an iris of several blades inside the lens, set by the aperture ring |
| the human eye | the iris; the opening (the pupil) runs from about 2 mm in sunlight to 7–8 mm in the dark |
| telescope, binoculars | the rim of the objective lens or primary mirror |
| microscope objective | the aperture at the back of the objective (the condenser has an adjustable one too) |
| laser focusing lens | the beam itself or the lens mount, whichever is smaller |

### It can move
The stop is whichever opening is tightest *in the situation*. Open an iris far enough and the lens rims take over — the simulation shows this in a double Gauss. Focus a lens close and the cone widens, so a different rim may limit. In a zoom lens the stop may be a fixed ring, an iris that moves with the groups, or both in turn.

> [!key] The aperture stop is the opening that limits the cone of light from the axial point: find it by asking which opening subtends the smallest angle from there. It sets the f-number; its images are the pupils.
`,
  ideas: [
    'The aperture stop is the one opening that limits the cone of light from an axial object point.',
    'To find it, compare the angle each opening subtends at the axial point (or each surface\'s semi-diameter against the ray\'s height there): the smallest wins.',
    'It sets the f-number, so the brightness of the image, the diffraction blur and the depth of field.',
    'It does not set the field of view, which is the work of the field stop.',
    'The stop is not fixed: open the iris far enough and a lens rim takes over.'
  ],
  pitfalls: [
    'The aperture stop is always the iris — It is whatever opening is tightest. A telescope has no iris: its objective rim is the stop. In a lens with the iris wide open, a lens rim can be the stop.',
    'The stop decides how much of the scene is seen — It decides how much light each point of the scene sends through. The scene itself is limited by the field stop (in a camera, the sensor).',
    'The f-number is set by the width of the iris — It is set by the entrance pupil, which is the iris as seen through the lenses in front of it; the two differ by ten per cent in a typical lens, by much more in some.'
  ],
  terms: [
    { term: 'Aperture stop', also: ['stop', 'AS', 'STO', 'limiting aperture'], def: 'The opening in an optical system that limits the cone of rays from an axial object point. It may be an iris, a lens rim or a mask; it fixes the f-number.' },
    { term: 'Iris diaphragm', also: ['iris', 'diaphragm'], def: 'An adjustable opening made of overlapping blades, as in a camera lens; the aperture ring sets its diameter.' },
    { term: 'Clear aperture', also: ['CA', 'clear diameter'], def: 'The diameter of the part of an optical surface that is useful: the part that can pass rays without being cut off by the mount or the edge of the glass.' },
    { term: 'Stop surface', also: ['STO'], def: 'In a lens prescription, the surface at which the aperture stop sits. Its position decides which part of every lens an oblique beam uses.' }
  ],
  formulas: [
    {
      name: 'Cone half-angle through an opening',
      expr: 'theta = atan(D/(2*s))', tex: '\\theta = \\arctan\\!\\left(\\frac{D}{2s}\\right)',
      vars: {
        theta: { name: 'half-angle of the cone', q: 'angle', unit: '°', tex: '\\theta' },
        D: { name: 'diameter of the opening', q: 'length', unit: 'mm', value: 25 },
        s: { name: 'distance from the axial object point', q: 'length', unit: 'mm', value: 500 }
      },
      note: 'Compare this angle for every opening: the smallest belongs to the aperture stop.',
      stories: { theta: 'From a point on the axis, an opening {D} wide is {s} away. What half-angle of light does it admit?' }
    },
    {
      name: 'Stops between two f-numbers',
      expr: 'n = 2*log2(N2/N1)', tex: 'n = 2\\log_2\\frac{N_2}{N_1}',
      vars: {
        n: { name: 'stops (positive: closing the iris)', signed: true },
        N1: { name: 'first f-number', value: 2, min: 0.5, max: 64, tex: 'N_1' },
        N2: { name: 'second f-number', value: 5.6, min: 0.5, max: 64, tex: 'N_2' }
      },
      note: 'One stop is a factor √2 in f-number, so a factor 2 in light.',
      stories: { n: 'An iris is closed from f/{N1} to f/{N2}. By how many stops?', N2: 'Closing the iris by {n} stops from f/{N1} gives which f-number?' }
    }
  ],
  examples: [
    {
      title: 'Which opening is the stop?',
      q: 'A lens of focal length 100 mm and diameter 40 mm is followed, 50 mm behind it, by a round opening of diameter 15 mm. A distant object is imaged. Which is the aperture stop, and what is the entrance pupil?',
      steps: [
        'A beam of half-width $y$ at the lens meets the second opening at half-width $y\\,(1 - 50/100) = y/2$.',
        'The lens rim allows $y = 20$ mm. The opening allows $y/2 = 7.5$ mm, so $y = 15$ mm.',
        'The smaller of the two beams, $y = 15$ mm, wins: the rear opening is the aperture stop.',
        { text: 'Its image through the lens (in object space) is the entrance pupil, of diameter', tex: 'D_{\\mathrm{ep}} = 2\\times 15 = 30\\ \\mathrm{mm}, \\qquad N = \\frac{100}{30} = 3.3' }
      ],
      a: 'The 15 mm opening is the stop; the lens is f/3.3 with a 30 mm entrance pupil. Enlarge the opening to 25 mm and the lens rim, passing $y = 20$ mm, becomes the stop at f/2.5.'
    },
    {
      title: 'Closing the iris',
      q: 'A 50 mm lens is set from f/1.8 to f/8. How wide is the opening at each, how many stops is that, and how much light is lost?',
      steps: [
        { text: 'Diameters (the entrance pupil, $D = f/N$):', tex: '\\frac{50}{1.8} = 27.8\\ \\mathrm{mm},\\qquad \\frac{50}{8} = 6.25\\ \\mathrm{mm}' },
        { text: 'Stops:', tex: 'n = 2\\log_2\\frac{8}{1.8} = 4.3' },
        'Light follows area: $(27.8/6.25)^2 = 19.8$, about one twentieth remains.'
      ],
      a: '27.8 mm and 6.25 mm: 4.3 stops, so 1/20 of the light. An exposure time 20 times longer is needed to compensate.'
    }
  ],
  quiz: [
    { q: 'How do you recognise the aperture stop in a system?', choices: ['It is the opening nearest the sensor', 'It is the opening nearest the object', 'It is the largest opening', 'It is the opening that subtends the smallest angle from the axial object point'], a: 3, why: 'The stop is the opening that limits the cone from the axial point; viewed from there it subtends the smallest angle. Its position in the system does not matter.' },
    { q: 'The iris of a lens is opened until the lens barrel is the limit. What happens if it is opened still further?', choices: ['The field of view grows', 'The image gets brighter', 'Nothing: the barrel is now the aperture stop', 'The lens becomes f/1'], a: 2, why: 'Once another opening is tighter, that opening is the stop. Opening the iris beyond it changes neither the cone nor the f-number.' },
    { q: 'The aperture stop of a camera lens determines how large a scene the camera sees.', a: false, why: 'The scene is limited by the field stop — the sensor frame. The aperture stop decides how much light each point of the scene sends through the lens.' },
    { q: 'From a point on the axis 500 mm away an opening 25 mm across is seen. What is the half-angle of the cone it admits, in degrees?', answer: 1.43, unit: '°', why: '$\\theta = \\arctan(12.5/500) = 1.43°$. A second opening that admits more than this does not limit the cone.' },
    { q: 'An iris is closed from f/2 to f/5.6. By how many stops?', answer: 3, why: '$2\\log_2(5.6/2) = 2.97$, about 3 stops: 2, 2.8, 4, 5.6. Each stop halves the light, so one eighth remains.' }
  ],
  applications: [
    'Photography: the aperture ring is the control of an iris; exposure is calculated from the f-number it sets.',
    'The eye: the iris is the stop; its opening runs from about 2 mm to 8 mm and with it the eye\'s light intake, depth of field and diffraction blur.',
    'Astronomy: "a 200 mm telescope" names its aperture stop, the objective, which sets both the light collected and the resolution.',
    'Microscopy: the condenser\'s aperture diaphragm trades resolution against contrast, usually set to about 70–80 % of the objective\'s numerical aperture.',
    'Machine vision: lenses with a lockable iris keep the depth of field and brightness fixed between set-up and production.'
  ],
  history: 'The diaphragm is older than the photograph. In his treatise on perspective of 1568 Daniele Barbaro described fitting the lens of a camera obscura with a diaphragm, a sheet with a hole, to sharpen the picture; ever since, the opening has been the first thing a lens maker controls.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 (Stops, Apertures, Pupils and Diffraction) — the aperture stop and how it is found.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the section on stops.',
    'R. Kingslake, *Optics in Photography* (SPIE, 1992) — the iris and the stop in photographic lenses.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE, 2004) — aperture stop and pupils.'
  ],
  sim: 'px-stop'
},

/* ================================================================ entrance and exit pupils */
{
  id: 'entrance-and-exit-pupils', parent: 'paraxial-systems', title: 'Entrance and exit pupils', level: 2,
  short: 'The aperture stop is one real opening; the pupils are its two images. The entrance pupil is the stop as seen from the front, through the glass ahead of it; the exit pupil is the stop as seen from the back. Every ray that gets through is aimed at the first and seems to leave from the second.',
  keywords: ['entrance pupil', 'exit pupil', 'pupil', 'pupil magnification', 'pupil position', 'ENP', 'EXP', 'EP', 'XP', 'centre of perspective', 'no-parallax point', 'nodal point', 'image of the stop', 'exit pupil distance'],
  prereq: ['aperture-stop', 'real-and-virtual-images', 'lens-ray-diagrams'],
  related: ['chief-and-marginal-rays', 'the-f-number', 'exit-pupil-and-eye-relief', 'perspective-and-focal-length', 'telecentricity', 'the-pupil', 'binoculars', 'microlenses-bsi-and-stacked-sensors', 'projections:the-camera-model'],
  body: `
Look into the front of a camera lens with the iris half closed. You see a bright disc floating inside the glass — not the iris blades themselves but their **image**, magnified or shrunk by the lenses in front of them. That image is the **entrance pupil**. Look in from the back and you see another image of the same iris, made by the lenses behind it: the **exit pupil**. The [[aperture-stop|aperture stop]] is one object; the pupils are its two images.

### Definitions
- The **entrance pupil** is the image of the stop formed by the optics in front of it, seen from the object. Every ray that will get through the system is *aimed* at it.
- The **exit pupil** is the image of the stop formed by the optics behind it, seen from the image. Every ray that has got through *seems to come from* it.
- A **chief ray** — from an off-axis point through the centre of the stop — is aimed at the centre of the entrance pupil and leaves from the centre of the exit pupil ([[chief-and-marginal-rays]]).

Because glass is involved, a pupil can be larger or smaller than the stop, in front of it or behind it, real or virtual.

### Three real systems
Traced through real prescriptions (distances from the front vertex):

| system | stop | entrance pupil | exit pupil | pupil magnification |
|---|---|---|---|---|
| Cooke triplet, f = 50 mm | Ø 7.6 mm | Ø 10.0 mm at 11.5 mm | Ø 10.2 mm at 9.2 mm | 1.02 |
| double Gauss, f ≈ 100 mm | Ø 20.0 mm | Ø 33.3 mm at 59 mm | Ø 36.3 mm at 24.9 mm | 1.09 |
| schematic eye, f ≈ 17 mm | Ø 4.0 mm | Ø 4.5 mm at 3.0 mm | Ø 4.2 mm at 3.7 mm | 0.92 |

In the double Gauss the entrance pupil lies *behind* the stop (at 41 mm) and the exit pupil in *front* of it. In your own eye the pupil you see in a mirror is the entrance pupil: 13 % larger than the iris opening, and half a millimetre in front of it.

### Why they matter
- **Brightness.** The f-number is $N = f/D_{\\mathrm{ep}}$: the diameter of the *entrance pupil*, not of the iris blades ([[the-f-number]]).
- **Close-up.** The working f-number is $N(1+m/m_p)$, with pupil magnification $m_p = D_{\\mathrm{xp}}/D_{\\mathrm{ep}}$.
- **Perspective.** The centre of the entrance pupil is the centre of perspective, the point from which the picture is "taken". Panorama photographers rotate the camera about it to avoid parallax; it is often, wrongly, called the nodal point.
- **The sensor.** The exit pupil's distance from the sensor sets the angle at which the chief ray reaches a corner pixel ([[microlenses-bsi-and-stacked-sensors]]); an exit pupil at infinity is [[telecentricity]].
- **The eye.** An instrument's exit pupil is $D/M$: 42 mm ÷ 8 = 5.25 mm for an 8×42 binocular. It must fit inside the eye's own pupil — about 3 mm in daylight ([[exit-pupil-and-eye-relief]]).

### A stop behind a thin lens
A stop of diameter $D$ a distance $s$ behind a thin lens of focal length $f$, with $s<f$: its entrance pupil is the virtual image at $z = sf/(f-s)$ behind the lens, of diameter $Df/(f-s)$.

> [!key] The pupils are the images of the aperture stop: the entrance pupil as seen through the front glass, the exit pupil as seen through the rear. Light is aimed at one and leaves from the other; the f-number, perspective and the angle of light at the sensor all follow from them.
`,
  ideas: [
    'The entrance pupil is the image of the stop formed by the optics in front of it; the exit pupil is its image formed by the optics behind it.',
    'Rays are aimed at the entrance pupil and seem to leave from the exit pupil; the chief ray goes through both centres.',
    'The f-number is the focal length over the entrance-pupil diameter, which is not the width of the iris blades.',
    'The pupil magnification is the exit-pupil diameter over the entrance-pupil diameter; the working f-number is N (1 + m/m_p).',
    'The centre of the entrance pupil is the centre of perspective; the position of the exit pupil sets the chief-ray angle at the sensor.'
  ],
  pitfalls: [
    'The pupil is the hole in the iris — The pupils are images of the stop. They can be bigger or smaller, nearer or farther, and inside the lens glass; only for a bare stop in air is the pupil the stop itself.',
    'A lens has a single pupil — It has two: entrance and exit. They are generally different in size and position, and it is the ratio of the two that matters for close-up work.',
    'The nodal point is where to rotate for panoramas — The no-parallax point is the centre of the entrance pupil, which is generally not at a nodal point of the lens.',
    'The exit pupil is where the eye goes behind a lens — That is true of an instrument made for the eye (the eye\'s pupil should coincide with its exit pupil), but a camera lens\'s exit pupil may lie inside the lens, where nothing can be placed.'
  ],
  terms: [
    { term: 'Entrance pupil', also: ['ENP', 'EP', 'ep'], def: 'The image of the aperture stop formed by the optical elements in front of it, seen from the object side. Rays heading for the system are aimed at it, and its diameter is the one used in the f-number.' },
    { term: 'Exit pupil', also: ['EXP', 'XP', 'xp'], def: 'The image of the aperture stop formed by the optical elements behind it, seen from the image side. Rays leaving the system seem to come from it; an instrument for the eye puts the eye\'s pupil there.' },
    { term: 'Pupil magnification', also: ['m_p', 'pupil ratio'], def: 'The diameter of the exit pupil divided by the diameter of the entrance pupil. It is about 1 for symmetric lenses, above 1 for many retrofocus wide-angles and below 1 for telephotos.' },
    { term: 'Centre of perspective', also: ['no-parallax point'], def: 'The centre of the entrance pupil: the point from which, geometrically, a photograph is taken. Rotating a camera about it changes the picture without parallax.' },
    { term: 'Exit pupil distance', also: ['exit pupil position'], def: 'The distance from the exit pupil to the image plane. It decides the angle at which light from the edge of the field reaches the sensor.' }
  ],
  formulas: [
    {
      name: 'Pupil magnification',
      expr: 'mp = Dx/De', tex: 'm_p = \\frac{D_{\\mathrm{xp}}}{D_{\\mathrm{ep}}}',
      vars: {
        mp: { name: 'pupil magnification', tex: 'm_p' },
        Dx: { name: 'exit-pupil diameter', q: 'length', unit: 'mm', value: 36.3, tex: 'D_{\\mathrm{xp}}' },
        De: { name: 'entrance-pupil diameter', q: 'length', unit: 'mm', value: 33.3, tex: 'D_{\\mathrm{ep}}' }
      },
      stories: { mp: 'A lens has an entrance pupil {De} across and an exit pupil {Dx} across. What is its pupil magnification?' }
    },
    {
      name: 'Working f-number with pupil magnification',
      expr: 'Nw = N*(1 + m/mp)', tex: 'N_w = N\\left(1 + \\frac{m}{m_p}\\right)',
      vars: {
        Nw: { name: 'working f-number', tex: 'N_w' },
        N: { name: 'engraved f-number', value: 2.8, min: 0.5, max: 64 },
        m: { name: 'magnification (positive)', value: 1, min: 0, max: 20 },
        mp: { name: 'pupil magnification', value: 1.09, min: 0.1, max: 10, tex: 'm_p' }
      },
      note: 'For m_p = 1 this is the N(1 + m) of the f-number page.',
      stories: { Nw: 'A lens of pupil magnification {mp} set to f/{N} is used at a magnification of {m}. What is its working f-number?' }
    },
    {
      name: 'Entrance pupil of a stop behind a thin lens: position',
      expr: 'zep = s*f/(f - s)', tex: 'z_{\\mathrm{ep}} = \\frac{s\\,f}{f - s}',
      vars: {
        zep: { name: 'distance of the entrance pupil behind the lens (negative: in front)', q: 'length', unit: 'mm', signed: true, tex: 'z_{\\mathrm{ep}}' },
        s: { name: 'distance of the stop behind the lens', q: 'length', unit: 'mm', value: 25, min: 0, max: 90 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100, min: 20, max: 500 }
      },
      note: 'The virtual image of the stop seen through the lens, for a stop nearer than the focal point.',
      stories: { zep: 'A stop sits {s} behind a thin lens of focal length {f}. Where is the entrance pupil?' }
    },
    {
      name: 'Entrance pupil of a stop behind a thin lens: size',
      expr: 'De = D*f/(f - s)', tex: 'D_{\\mathrm{ep}} = D\\,\\frac{f}{f - s}',
      vars: {
        De: { name: 'entrance-pupil diameter', q: 'length', unit: 'mm', tex: 'D_{\\mathrm{ep}}' },
        D: { name: 'diameter of the stop', q: 'length', unit: 'mm', value: 12 },
        s: { name: 'distance of the stop behind the lens', q: 'length', unit: 'mm', value: 25, min: 0, max: 90 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100, min: 20, max: 500 }
      },
      stories: { De: 'A {D} stop sits {s} behind a thin lens of focal length {f}. How wide does the entrance pupil appear?' }
    },
    {
      name: 'Exit pupil of a telescope or binocular',
      expr: 'Dx = D/M', tex: 'D_{\\mathrm{xp}} = \\frac{D}{M}',
      vars: {
        Dx: { name: 'exit-pupil diameter', q: 'length', unit: 'mm', tex: 'D_{\\mathrm{xp}}' },
        D: { name: 'objective diameter', q: 'length', unit: 'mm', value: 42 },
        M: { name: 'magnification', value: 8, min: 1, max: 100 }
      },
      note: 'The objective is the stop, so the entrance pupil is the objective itself and the exit pupil is its image through the eyepiece.',
      stories: { Dx: 'A binocular is marked {M}×{D}. How wide is its exit pupil?', D: 'A {M}× telescope has an exit pupil {Dx} across. How big is its objective?' }
    }
  ],
  examples: [
    {
      title: 'Looking into a lens',
      q: 'A thin lens of focal length 100 mm has a 12 mm stop 25 mm behind it. Where does the entrance pupil appear, how wide, and what is the lens\'s f-number?',
      steps: [
        { text: 'The stop is nearer than the focal point, so its image is virtual, behind the lens:', tex: 'z_{\\mathrm{ep}} = \\frac{25\\times100}{100-25} = 33.3\\ \\mathrm{mm}' },
        { text: 'It is magnified by $f/(f-s)$:', tex: 'D_{\\mathrm{ep}} = 12\\times\\frac{100}{75} = 16\\ \\mathrm{mm}' },
        'The f-number uses the entrance pupil, not the 12 mm stop: $N = f/D_{\\mathrm{ep}} = 100/16 = 6.25$.'
      ],
      a: 'The entrance pupil is 16 mm wide and 33 mm behind the lens; the lens is f/6.25 (not f/8.3, which a 12 mm opening would suggest).'
    },
    {
      title: 'A binocular and an eye',
      q: 'A 10×50 binocular is used in daylight, when the eye\'s pupil is about 3 mm, and at dusk, when it is about 6 mm. What fraction of the light the objectives collect enters the eye in each case?',
      steps: [
        { text: 'Exit pupil:', tex: 'D_{\\mathrm{xp}} = \\frac{50}{10} = 5\\ \\mathrm{mm}' },
        'Daylight: the 3 mm eye pupil takes only the central part of the 5 mm beam: $(3/5)^2 = 36\\ \\%$ of the light.',
        'Dusk: the 6 mm pupil is larger than the exit pupil, so all of it enters.'
      ],
      a: 'About 36 % in daylight and all of it at dusk. A large exit pupil pays off only when the eye\'s own pupil is large.'
    }
  ],
  quiz: [
    { q: 'What is the entrance pupil of an optical system?', choices: ['The image of the aperture stop formed by the elements behind it', 'The first lens of the system', 'The hole in the iris', 'The image of the aperture stop formed by the elements in front of it'], a: 3, why: 'The entrance pupil is the stop as seen from the object side. The image formed by the elements behind the stop is the exit pupil.' },
    { q: 'A 50 mm lens is marked f/2. What is the diameter of its entrance pupil, in mm?', answer: 25, unit: 'mm', why: '$D_{\\mathrm{ep}} = f/N = 50/2 = 25$ mm, whatever the iris blades measure.' },
    { q: 'An entrance pupil can be larger than the aperture stop itself.', a: true, why: 'A positive lens in front of the stop magnifies it: in the double Gauss of this page the stop is 20 mm and the entrance pupil 33 mm.' },
    { q: 'Why does a panorama photographer rotate the camera about the centre of the entrance pupil?', choices: ['To keep the exposure constant', 'To avoid parallax between overlapping pictures', 'To keep the horizon level', 'To increase the depth of field'], a: 1, why: 'The centre of the entrance pupil is the centre of perspective. Rotating about it changes the direction of view without moving the viewpoint, so near and far objects stay in register.' },
    { q: 'A binocular is marked 8×56. What is its exit pupil, in mm?', answer: 7, unit: 'mm', why: '$D_{\\mathrm{xp}} = D/M = 56/8 = 7$ mm: about as wide as a fully dilated pupil, which is why such glasses are called night glasses.' }
  ],
  applications: [
    'Panoramic photography and VR capture: the no-parallax point is the centre of the entrance pupil.',
    'Camera calibration and photogrammetry: the centre of projection of the pinhole model is the entrance-pupil centre.',
    'Binoculars, microscopes and telescopes: the exit pupil and its distance (the eye relief) are chosen to suit the eye.',
    'Scanning systems: the scan mirror is placed at the entrance pupil of the scan lens so that the beam does not walk across it.',
    'Sensor design: the exit-pupil position of the lens sets the chief-ray angle that the microlenses must match.'
  ],
  history: 'The idea that the stop has two images, and the terms entrance pupil and exit pupil, were worked out by Ernst Abbe and his colleagues in Jena in the later nineteenth century; Siegfried Czapski\'s *Theorie der optischen Instrumente nach Abbe* (1893) is the classic account.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 (Stops, Apertures, Pupils and Diffraction) — pupils and the working f-number.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE, 2004) — aperture stop, pupils and pupil magnification.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the section on stops and pupils.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the entrance and exit pupils of the eye.'
  ],
  sim: 'px-pupils'
},

/* ================================================================ the field stop and the field of view */
{
  id: 'field-stop-and-field-of-view', parent: 'paraxial-systems', title: 'The field stop and the field of view', level: 2,
  short: 'The field stop is the opening that limits how much of the object is imaged: in a camera the sensor, in a telescope or microscope a ring at the intermediate image. Its image in the scene is the entrance window, and the angle that window subtends at the entrance pupil is the field of view.',
  keywords: ['field stop', 'field of view', 'FOV', 'entrance window', 'exit window', 'angular field', 'real field', 'true field of view', 'TFOV', 'apparent field of view', 'AFOV', 'half-field angle', 'field diaphragm', 'field number', 'sensor as field stop'],
  prereq: ['aperture-stop', 'entrance-and-exit-pupils', 'lateral-and-longitudinal-magnification'],
  related: ['field-of-view-and-focal-length', 'projections:field-of-view-and-focal-length', 'vignetting', 'image-circle-and-sensor-coverage', 'sensor-formats-and-pixel-size', 'crop-factor-and-equivalent-focal-length', 'eyepieces', 'binoculars', 'the-compound-microscope'],
  body: `
The [[aperture-stop|aperture stop]] decides how wide a cone of light each object point sends through a lens. The other half of the question is *which* object points are imaged at all: how wide a scene the system takes in. The opening that decides is the **field stop**.

### The field stop
The field stop is the opening that limits the extent of the object that is imaged. Where the image is recorded, the detector is the field stop: the sensor frame of a camera, the gate of a cine camera. Where an eye looks at the image, a ring is placed in the image plane, in focus together with the image: the black edge of the circle seen in a binocular, a telescope or a microscope is that ring. Because it lies in an image plane its edge is sharp. An opening *not* in an image plane, such as a lens rim, cuts the field gradually instead: that is [[vignetting]].

### The windows
The images of the field stop play the same part for the field that the pupils play for the aperture:

- the **entrance window** is the field stop seen from the object side, through the optics in front of it: the patch of scene that can be imaged;
- the **exit window** is its image on the image side (for a sensor, the sensor itself).

The **field of view** is the angle that the entrance window subtends at the centre of the entrance pupil.

### A camera
Focused at infinity, with a sensor dimension $d$ and focal length $f$,

$$\\mathrm{FOV} = 2\\arctan\\frac{d}{2f}$$

| lens on a 36 × 24 mm sensor | horizontal | vertical | diagonal |
|---|---|---|---|
| 24 mm | 73.7° | 53.1° | 84.1° |
| 50 mm | 39.6° | 27.0° | 46.8° |
| 135 mm | 15.2° | 10.2° | 18.2° |

The same 50 mm lens on a 2/3″ sensor (8.8 × 6.6 mm) sees 10.1° × 7.5°: same lens, smaller field stop. At a finite distance the scene is $W = d/|m|$ wide, and the field narrows a little as the lens moves out to focus ("focus breathing"). More in [[field-of-view-and-focal-length]].

### Instruments for the eye
A telescope's **true field** is the angle in the scene; its **apparent field** is the angle at which the eye sees the image, $\\tan(\\mathrm{AFOV}/2) = M\\tan(\\mathrm{TFOV}/2)$. An 8×42 binocular with a true field of 7.5° has an apparent field of 55° and shows 131 m of scene at 1 km. The true field is set by the field-stop diameter $D_{\\mathrm{fs}}$ in the focal plane of the objective: $\\mathrm{TFOV} = 2\\arctan(D_{\\mathrm{fs}}/2f_o)$. A microscope eyepiece is marked with its **field number** (typically 18–26 mm), the diameter of its field stop; the area seen on the specimen is $\\mathrm{FN}/M_{\\mathrm{obj}}$ across.

> [!key] The field stop limits which object points are imaged; it sits in an image plane, so its edge is sharp. Its image in the scene is the entrance window, and the angle of that window at the entrance pupil is the field of view: $2\\arctan(d/2f)$ for a camera.
`,
  ideas: [
    'The field stop is the opening that limits how much of the object is imaged; in a camera it is the sensor.',
    'The entrance window is the field stop seen from the object side; the field of view is the angle it subtends at the entrance pupil.',
    'A field stop in an image plane has a sharp edge; a rim elsewhere gives a soft edge, which is vignetting.',
    'For a camera focused at infinity FOV = 2 arctan(d/2f), so a smaller sensor or a longer lens gives a narrower field.',
    'In instruments, the apparent field is M times the true field (in tangents).'
  ],
  pitfalls: [
    'The field of view belongs to the lens — It belongs to the lens and the field stop together. A 50 mm lens sees 39.6° across on a full-frame sensor and 10° on a 2/3″ one.',
    'The field of view does not change when you focus close — It narrows a little: the lens moves away from the sensor, so the same sensor subtends a smaller angle.',
    'Apparent and true field are the same thing — The true field is the angle in the scene (7.5° for a typical 8×42 binocular); the apparent field is the angle the image fills in the eye (55°): about M times larger.',
    'A bigger aperture sees more of the scene — The aperture stop controls how much light each point sends; it does not change the field. Only the field stop does.'
  ],
  terms: [
    { term: 'Field stop', also: ['FS', 'field diaphragm', 'field aperture'], def: 'The opening that limits the extent of the object that is imaged. It lies in (or near) an image plane: the sensor of a camera, or the ring in an eyepiece.' },
    { term: 'Entrance window', def: 'The image of the field stop formed by the optics in front of it, as seen from the object: the region of the scene that the system can image.' },
    { term: 'Exit window', def: 'The image of the field stop on the image side. For a camera whose sensor is the field stop, the sensor is its own exit window.' },
    { term: 'Field of view', also: ['FOV', 'angular field', 'full field angle'], def: 'The angle subtended by the entrance window at the centre of the entrance pupil. Quoted horizontally, vertically or along the diagonal; half of it is the half-field angle.' },
    { term: 'True field of view', also: ['TFOV', 'real field', 'real field of view'], def: 'The angle in the scene that an instrument for the eye covers, for instance 7.5° for a typical 8×42 binocular.' },
    { term: 'Apparent field of view', also: ['AFOV'], def: 'The angle that the image fills in the eye of the user of an instrument: about M times the true field. Eyepieces range from about 40° to 100°.' }
  ],
  formulas: [
    {
      name: 'Field of view of a camera',
      expr: 'fov = 2*atan(d/(2*f))', tex: '\\mathrm{FOV} = 2\\arctan\\frac{d}{2f}',
      vars: {
        fov: { name: 'field of view', q: 'angle', unit: '°', tex: '\\mathrm{FOV}' },
        d: { name: 'sensor dimension (width, height or diagonal)', q: 'length', unit: 'mm', value: 36 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'For a rectilinear lens focused at infinity.',
      stories: { fov: 'A sensor {d} wide sits behind a lens of focal length {f}. What is the horizontal field of view?', f: 'What focal length gives a sensor {d} wide a field of view of {fov}?' }
    },
    {
      name: 'Scene covered at a finite distance',
      expr: 'W = d*(s - f)/f', tex: 'W = d\\,\\frac{s - f}{f}',
      vars: {
        W: { name: 'width of the scene (entrance window)', q: 'length', unit: 'mm' },
        d: { name: 'sensor width', q: 'length', unit: 'mm', value: 8.8 },
        s: { name: 'distance from the lens to the object', q: 'length', unit: 'mm', value: 500, min: 0 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 25, min: 1 }
      },
      note: 'Thin lens: the scene is the sensor divided by the magnification, W = d/m with m = f/(s − f).',
      stories: { W: 'A camera with a sensor {d} wide and a {f} lens is focused on an object {s} away. How wide a scene does it cover?', f: 'A sensor {d} wide must cover a scene {W} wide at {s}. What focal length is needed?' }
    },
    {
      name: 'Apparent and true field of view',
      expr: 'afov = 2*atan(M*tan(tfov/2))', tex: '\\tan\\frac{\\mathrm{AFOV}}{2} = M\\tan\\frac{\\mathrm{TFOV}}{2}',
      vars: {
        afov: { name: 'apparent field of view', q: 'angle', unit: '°', tex: '\\mathrm{AFOV}', min: 0.1, max: 170 },
        tfov: { name: 'true field of view', q: 'angle', unit: '°', value: 7.5, min: 0.05, max: 60, tex: '\\mathrm{TFOV}' },
        M: { name: 'magnification', value: 8, min: 1, max: 100 }
      },
      note: 'For small angles AFOV ≈ M × TFOV.',
      stories: { afov: 'A {M}× binocular has a true field of {tfov}. How wide is the field that the eye sees?' }
    },
    {
      name: 'True field from the field-stop diameter',
      expr: 'tfov = 2*atan(Dfs/(2*fo))', tex: '\\mathrm{TFOV} = 2\\arctan\\frac{D_{\\mathrm{fs}}}{2 f_o}',
      vars: {
        tfov: { name: 'true field of view', q: 'angle', unit: '°', tex: '\\mathrm{TFOV}' },
        Dfs: { name: 'diameter of the field stop', q: 'length', unit: 'mm', value: 25, tex: 'D_{\\mathrm{fs}}' },
        fo: { name: 'focal length of the objective', q: 'length', unit: 'mm', value: 1000, tex: 'f_o' }
      },
      note: 'The field stop sits in the focal plane of the objective, where the image is formed.',
      stories: { tfov: 'A telescope with a {fo} objective has a field stop {Dfs} across in its focal plane. What true field does it show?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a lens for a part',
      q: 'A camera with a 2/3″ sensor (8.8 × 6.6 mm) must see a part 100 mm wide from 400 mm. What focal length is needed? Would a 25 mm or a 35 mm lens do?',
      steps: [
        { text: 'From $W = d\\,(s-f)/f$:', tex: 'f = \\frac{d\\,s}{W + d} = \\frac{8.8\\times400}{100 + 8.8} = 32.4\\ \\mathrm{mm}' },
        'With a 25 mm lens: $W = 8.8\\times375/25 = 132$ mm. With a 35 mm lens: $W = 8.8\\times365/35 = 92$ mm.'
      ],
      a: 'The ideal lens is 32.4 mm. The 35 mm lens would see only 92 mm: the part would not fit. The 25 mm lens sees 132 mm and does; or the working distance with the 35 mm lens can be raised to about 430 mm.'
    },
    {
      title: 'A binocular\'s field',
      q: 'An 8×42 binocular has a true field of 7.5°. How wide is the apparent field, and how wide a strip of scene is seen at 1000 m?',
      steps: [
        { text: 'Apparent field:', tex: '\\mathrm{AFOV} = 2\\arctan\\!\\left(8\\tan 3.75°\\right) = 2\\arctan 0.524 = 55.3°' },
        { text: 'Width of scene at 1000 m:', tex: 'W = 2\\times1000\\times\\tan 3.75° = 131\\ \\mathrm{m}' }
      ],
      a: 'An apparent field of 55° and a strip 131 m wide at 1 km (the way binoculars are often specified).'
    }
  ],
  quiz: [
    { q: 'What is the field stop of a digital camera?', choices: ['The iris', 'The sensor (or a mask in front of it)', 'The front lens', 'The lens hood'], a: 1, why: 'The opening that limits which object points are imaged is the sensor frame, in the image plane. The iris is the aperture stop.' },
    { q: 'The same lens is moved from a full-frame camera to one with a smaller sensor. The field of view…', choices: ['stays the same', 'becomes wider', 'becomes narrower', 'depends only on the f-number'], a: 2, why: 'FOV = 2 arctan(d/2f): a smaller sensor d, with the same focal length, gives a smaller angle.' },
    { q: 'What is the horizontal field of view, in degrees, of a 50 mm lens on a sensor 36 mm wide?', answer: 39.6, unit: '°', why: '$2\\arctan(18/50) = 2\\times19.8° = 39.6°$.' },
    { q: 'A field stop placed in an image plane has a sharp edge.', a: true, why: 'The edge lies in the plane where the image is in focus, so it is seen as sharply as the image itself. An opening elsewhere cuts the field gradually (vignetting).' },
    { q: 'A telescope with an objective of 1000 mm focal length has a field stop 25 mm across in its focal plane. What is its true field, in degrees?', answer: 1.43, unit: '°', why: '$2\\arctan(12.5/1000) = 1.43°$.' }
  ],
  applications: [
    'Choosing a camera lens for a given scene width (machine vision, security, photography): the sensor size and the field of view fix the focal length.',
    'Binoculars and spotting scopes: real field is quoted as degrees or metres at 1000 m, apparent field as a measure of how immersive the view is.',
    'Microscopy: the field number of the eyepiece and the objective magnification give the diameter of the specimen area seen; the lamp\'s field diaphragm is closed to just outside it (Köhler illumination).',
    'Cinema and projection: the gate and the screen frame are field stops; the projector\'s mask is imaged sharp on the screen.',
    'Telescope eyepieces: the field stop is the sharp black edge the observer sees around the star field.'
  ],
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 (Stops, Apertures, Pupils and Diffraction) — field stop, entrance and exit windows.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE, 2004) — field stop, windows and field of view.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the section on stops.',
    'R. Kingslake, *Optics in Photography* (SPIE, 1992) — the angle of view of photographic lenses.'
  ],
  sim: 'px-field'
},

/* ================================================================ chief and marginal rays */
{
  id: 'chief-and-marginal-rays', parent: 'paraxial-systems', title: 'Chief and marginal rays', level: 2,
  short: 'Two rays do all the first-order work. The marginal ray leaves the axial object point and grazes the edge of the stop; the chief ray leaves the edge of the field and runs through the centre of the stop. The first fixes where the image is and how wide the cone is; the second fixes how big the image is and the angle at which light arrives.',
  keywords: ['chief ray', 'principal ray', 'marginal ray', 'axial ray', 'edge ray', 'rim ray', 'chief ray angle', 'CRA', 'meridional ray', 'skew ray', 'image height', 'y ybar method', 'paraxial ray trace'],
  prereq: ['entrance-and-exit-pupils', 'field-stop-and-field-of-view', 'lateral-and-longitudinal-magnification'],
  related: ['the-optical-invariant', 'microlenses-bsi-and-stacked-sensors', 'telecentricity', 'the-seidel-sums', 'spot-diagrams-and-ray-fans', 'ray-transfer-matrices', 'vignetting'],
  body: `
Out of the endless number of rays through a lens, two are worth knowing by heart. Trace them and the first-order design of a system is done.

### The marginal ray
The **marginal ray** starts on the axis at the object, passes through the edge of the aperture stop (so, through the edges of both pupils) and ends on the axis at the image. It tells you

- **where the image is**: where the ray recrosses the axis;
- **how wide the cone is**: its angle at the image gives the working f-number or the numerical aperture ([[numerical-aperture]]);
- **how big each lens must be** to pass the axial beam: its height at each surface.

### The chief ray
The **chief ray** (or principal ray) starts at the edge of the field — the top of the object — and passes through the *centre* of the stop. It is aimed at the centre of the entrance pupil and leaves from the centre of the exit pupil. It tells you

- **how big the image is**: where the ray lands on the image plane, $h' = f\\tan\\theta$ for a distant object;
- **the field of view**: its angle in object space is the half-field angle;
- **the chief ray angle (CRA)**: the angle at which light from the edge of the image meets the sensor;
- **how big each lens must be** to pass the off-axis beam.

### What the stop position changes
Slide the stop along the axis and the image does not move or change size: the marginal and chief rays still start and end at the same points. What changes is the *path*: the chief ray crosses each lens at a different height, so the lens sizes, the aberrations and the CRA change. At the front focal point of a lens, the chief ray leaves parallel to the axis ([[telecentricity]]).

### Numbers for real lenses
| lens | field angle | image height | exit pupil to image | CRA |
|---|---|---|---|---|
| Cooke triplet, f = 50 mm | 20° | 18.2 mm | 51 mm | 19.3° |
| double Gauss, f ≈ 100 mm | 14° | 24.6 mm | 108 mm | 12.2° |

To a good approximation $\\tan\\mathrm{CRA} = h'/L$, $L$ being the exit-pupil-to-image distance. A sensor's microlenses are shifted to match the CRA of the lens it will be used with ([[microlenses-bsi-and-stacked-sensors]]).

### The two rays together
The marginal ray crosses the axis at the object and image planes; the chief ray crosses it at the stop and the pupils. Their heights $y$ and $\\bar y$ at each surface give the **y–ȳ diagram** and the Seidel aberration sums, and the combination $n(\\bar u\\,y - u\\,\\bar y)$ is the same at every surface: the [[the-optical-invariant|optical invariant]]. A lens element must have a semi-diameter of at least $|y| + |\\bar y|$ to pass both rays.

> [!key] The marginal ray (axial point to the edge of the stop) fixes the position of the image and the cone angle; the chief ray (edge of the field through the centre of the stop) fixes its height and the angle at which light arrives. Together they define the invariant.
`,
  ideas: [
    'The marginal ray runs from the axial object point through the edge of the stop to the axial image point.',
    'The chief ray runs from the edge of the field through the centre of the stop, the entrance pupil and the exit pupil.',
    'The marginal ray fixes the image position and the cone angle; the chief ray fixes the image height and the chief ray angle at the sensor.',
    'Moving the stop leaves the first-order image unchanged but changes the chief ray\'s path, hence the lens sizes and the CRA.',
    'Both rays at every surface give the aberration sums and the optical invariant.'
  ],
  pitfalls: [
    'The chief ray is the ray through the centre of the lens — It is the ray through the centre of the stop (the pupil). That is the centre of the lens only when the stop is at the lens; otherwise the chief ray crosses the lenses off-centre.',
    'The marginal ray is a ray at the edge of the field — It starts at the axial object point and grazes the stop; the edge of the field belongs to the chief ray.',
    'The chief ray angle equals the field angle — Only when the exit pupil is one focal length from the image, as for a thin lens with its stop at the lens. In a retrofocus or telecentric lens the two differ greatly.',
    'The chief ray carries most of the light — It is a single ray, chosen to define the geometry. The light is carried by the whole cone around it.'
  ],
  terms: [
    { term: 'Marginal ray', also: ['axial ray', 'edge ray'], def: 'The ray from the axial object point through the edge of the aperture stop. It crosses the axis at the object and image planes and sets the cone angle.' },
    { term: 'Chief ray', also: ['principal ray', 'CR'], def: 'The ray from an off-axis object point through the centre of the aperture stop. It fixes the image height and the direction in which light reaches the image.' },
    { term: 'Chief ray angle', also: ['CRA'], def: 'The angle between the chief ray and the optical axis (or the sensor normal) at the image plane. Sensors with microlenses are designed for a given CRA at each position.' },
    { term: 'Meridional ray', also: ['tangential ray'], def: 'A ray in a plane containing the optical axis. The marginal and chief rays of first-order optics are meridional.' },
    { term: 'Skew ray', def: 'A ray that does not lie in a plane through the axis. It crosses the axis of a rotationally symmetric system nowhere, and needs a three-dimensional trace.' }
  ],
  formulas: [
    {
      name: 'Image height from the chief ray',
      expr: 'h = f*tan(t)', tex: 'h\' = f\\tan\\theta',
      vars: {
        h: { name: 'image height', q: 'length', unit: 'mm', tex: 'h\'' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 35 },
        t: { name: 'field angle in the scene', q: 'angle', unit: '°', value: 15, min: 0, max: 80, tex: '\\theta' }
      },
      note: 'For a distant object and a lens without distortion: where the chief ray lands.',
      stories: { h: 'A {f} lens images a distant point {t} off the axis. How far from the centre of the image does it land?', t: 'On a {f} lens a distant point lands {h} from the centre of the image. What is its field angle?' }
    },
    {
      name: 'Chief ray angle at the sensor',
      expr: 'cra = atan(h/L)', tex: '\\mathrm{CRA} = \\arctan\\frac{h\'}{L}',
      vars: {
        cra: { name: 'chief ray angle', q: 'angle', unit: '°', tex: '\\mathrm{CRA}' },
        h: { name: 'image height', q: 'length', unit: 'mm', value: 21.6, tex: 'h\'' },
        L: { name: 'distance from the exit pupil to the image', q: 'length', unit: 'mm', value: 60 }
      },
      note: 'Approximate: it neglects the aberrations of the pupils.',
      stories: { cra: 'A lens\'s exit pupil lies {L} from the sensor. At what angle does the chief ray reach a pixel {h} from the centre?', L: 'The CRA at the corner of a sensor (image height {h}) must not exceed {cra}. How far from the sensor must the exit pupil be?' }
    },
    {
      name: 'Cone half-angle at the image',
      expr: 'u = atan(Dx/(2*L))', tex: 'u\' = \\arctan\\frac{D_{\\mathrm{xp}}}{2L}',
      vars: {
        u: { name: 'half-angle of the cone at the image (marginal ray)', q: 'angle', unit: '°', tex: 'u\'' },
        Dx: { name: 'exit-pupil diameter', q: 'length', unit: 'mm', value: 18, tex: 'D_{\\mathrm{xp}}' },
        L: { name: 'distance from the exit pupil to the image', q: 'length', unit: 'mm', value: 60 }
      },
      note: 'The marginal ray ends at the image coming from the edge of the exit pupil; L/D_xp is the working f-number.'
    }
  ],
  examples: [
    {
      title: 'Where the chief ray lands',
      q: 'A 50 mm lens on a full-frame sensor (half-diagonal 21.6 mm) has its exit pupil 80 mm in front of the sensor. What are the half-field angle at the corner and the chief ray angle there?',
      steps: [
        { text: 'The image height at the corner is the half-diagonal; the half-field angle follows from it:', tex: '\\tan\\theta = \\frac{21.6}{50} \\quad\\Rightarrow\\quad \\theta = 23.4°' },
        { text: 'The chief ray reaches the sensor at', tex: '\\mathrm{CRA} = \\arctan\\frac{21.6}{80} = 15.1°' }
      ],
      a: 'The field angle is 23.4°, but the chief ray reaches the sensor at 15.1°: the exit pupil is 80 mm from the sensor, farther than the 50 mm focal length, so the chief ray is less inclined than the field angle. The two angles are equal only when the exit pupil is one focal length from the image.'
    },
    {
      title: 'The cone of a camera lens',
      q: 'The exit pupil of a lens is 18 mm across and 60 mm from the sensor. What are the half-angle of the cone at the image, and the working f-number?',
      steps: [
        { text: 'Half-angle:', tex: 'u\' = \\arctan\\frac{9}{60} = 8.5°' },
        { text: 'Working f-number:', tex: 'N_w = \\frac{L}{D_{\\mathrm{xp}}} = \\frac{60}{18} = 3.3' }
      ],
      a: 'A cone of 8.5° half-angle: the lens works at f/3.3.'
    }
  ],
  quiz: [
    { q: 'Which ray determines the position of the image?', choices: ['The ray through the centre of the lens', 'The chief ray', 'Any ray at the edge of the field', 'The marginal ray: it recrosses the axis at the image'], a: 3, why: 'The marginal ray starts on the axis at the object and meets the axis again at the image. The chief ray crosses the axis at the pupils.' },
    { q: 'Through which point does the chief ray pass?', choices: ['The edge of the aperture stop', 'The centre of the aperture stop', 'The centre of the first lens', 'The focal point'], a: 1, why: 'By definition: the chief ray goes from the edge of the field through the centre of the stop (and so is aimed at the centre of the entrance pupil).' },
    { q: 'A 35 mm lens images a distant point 15° off the axis. How far from the centre of the image does it land, in mm?', answer: 9.38, unit: 'mm', why: '$h\' = f\\tan\\theta = 35\\tan15° = 9.38$ mm.' },
    { q: 'In an ideal lens, moving the aperture stop along the axis changes the size of the image.', a: false, why: 'Image size is fixed by the object and the lens; the chief ray still starts and ends at the same points. Moving the stop changes the chief ray\'s path and the chief ray angle, not the first-order image.' },
    { q: 'The exit pupil of a lens is 60 mm from the sensor, and a pixel is 21.6 mm from the centre. What is the chief ray angle there, in degrees?', answer: 19.8, unit: '°', why: '$\\arctan(21.6/60) = 19.8°$.' }
  ],
  applications: [
    'Sensor design: microlens shifts are chosen to match the chief ray angle of the lens at every position; a mismatch gives colour shading and dark corners.',
    'First-order lens design: the y–ȳ table of a marginal and a chief ray gives the size of every lens and the Seidel sums.',
    'Lens sizing: each element\'s clear semi-diameter must exceed |y| + |ȳ| plus a mounting margin.',
    'Machine vision: a telecentric lens has a chief ray parallel to the axis, so size does not change with distance.',
    'Autofocus and alignment: the chief ray through a pupil centre is the reference ray for pointing a camera or scan head.'
  ],
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — paraxial marginal and chief ray traces.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — the paraxial marginal and chief rays and the y–ȳ diagram.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE, 2004) — marginal and chief rays and the Lagrange invariant.'
  ],
  sim: 'px-rays'
},

/* ================================================================ numerical aperture */
{
  id: 'numerical-aperture', parent: 'paraxial-systems', title: 'Numerical aperture', level: 2,
  short: 'The numerical aperture NA = n sin θ measures the cone of light that a system collects from, or delivers to, a point; θ is the half-angle of the cone and n the index of the medium. It is the microscope\'s and the fibre\'s version of the f-number (NA ≈ 1/2N) and it sets the finest detail a microscope can resolve, λ/2NA.',
  keywords: ['numerical aperture', 'NA', 'acceptance angle', 'cone angle', 'immersion objective', 'oil immersion', 'water immersion', 'dry objective', 'sine condition', 'Abbe', 'fibre NA', 'n sin theta', 'resolving power of microscope', 'light-gathering'],
  prereq: ['the-f-number', 'snells-law'],
  related: ['microscope-objectives', 'fibre-numerical-aperture', 'resolution-limits', 'the-airy-disk', 'the-optical-invariant', 'etendue', 'critical-angle-and-total-internal-reflection', 'how-an-optical-fibre-guides-light', 'the-compound-microscope', 'physics:resolution'],
  body: `
Camera makers speak of f-numbers; microscopists and fibre engineers speak of the **numerical aperture**. Both measure the same thing — how wide a cone of light the system takes in — in different units.

### Definition
$$\\mathrm{NA} = n\\sin\\theta$$

where θ is the half-angle of the widest cone of rays the system accepts from (or delivers to) a point, and $n$ is the refractive index of the medium the cone is in. The product $n\\sin\\theta$ is exactly what [[snells-law]] keeps constant at a flat boundary, so the NA of a ray bundle is the same in air, in a cover glass and in oil: one number describes it throughout.

### NA and the f-number
For an object far away, a lens that obeys the **sine condition** has $\\mathrm{NA} = 1/(2N)$: f/1 is NA 0.5, f/2 is 0.25, f/8 is 0.0625. (Defining the cone by $\\tan\\theta = 1/2N$ gives slightly less for fast lenses: 0.447 at f/1.) At finite magnification $m$ the image-side NA is $\\mathrm{NA}/|m|$: a 40×/0.75 objective forms its image with NA 0.019, about f/27.

### How high can it go?
In air $n = 1$, so NA < 1 however wide the lens: a ray leaving the cover glass at a grazing angle already has $n\\sin\\theta = 1$, and rays steeper than the critical angle never leave the glass ([[critical-angle-and-total-internal-reflection]]). Filling the gap with water (1.333) or immersion oil (1.515) lets more of the cone escape: the objective table (green light, 550 nm):

| objective | NA | medium | Abbe $\\lambda/2\\mathrm{NA}$ | Rayleigh $0.61\\lambda/\\mathrm{NA}$ |
|---|---|---|---|---|
| 10× | 0.25 | air | 1100 nm | 1340 nm |
| 20× | 0.50 | air | 550 nm | 670 nm |
| 40× | 0.75 | air | 367 nm | 447 nm |
| 60× | 0.95 | air | 289 nm | 353 nm |
| 100× | 1.40 | oil | 196 nm | 240 nm |

### What NA buys
The **finest detail** a microscope can resolve is about $\\lambda/2\\mathrm{NA}$ (Abbe) or $0.61\\lambda/\\mathrm{NA}$ for two points (Rayleigh; [[resolution-limits]]). The **light gathered** from a point rises as NA². Magnification does not enter: a 100× objective of NA 0.5 resolves no more than a 20× one.

### Fibres and lasers
A fibre accepts light inside the cone $\\mathrm{NA} = \\sqrt{n_{\\mathrm{core}}^2 - n_{\\mathrm{clad}}^2}$: 0.22 means 12.7° ([[fibre-numerical-aperture]]). A laser beam of waist $w_0$ diverges with $\\mathrm{NA}\\approx\\lambda/\\pi w_0$.

> [!key] NA = n sin θ is the cone of light in a form that survives flat boundaries; for a distant object NA ≈ 1/(2N). It cannot exceed the index of the medium, it fixes the resolution λ/2NA of a microscope, and magnification does not change it.
`,
  ideas: [
    'NA = n sin θ: the half-angle of the cone with the refractive index of the medium folded in.',
    'n sin θ is invariant across flat boundaries, so NA is one number from the specimen to the objective.',
    'For a distant object NA = 1/(2N); at magnification m the image-side NA is NA/|m|.',
    'NA cannot exceed the index of the medium: 1 in air, about 1.4 with oil.',
    'Resolution goes as λ/2NA and the light collected as NA²; magnification adds neither.'
  ],
  pitfalls: [
    'NA is an angle — It is a pure number, n sin θ. The same NA means different angles in different media: 1.4 in oil is a 67.5° half-angle, while in air no angle gives it at all.',
    'NA = 1/(2N) always — It holds for an object at infinity and a lens obeying the sine condition. At finite conjugates use the working f-number $N_w = N(1 + |m|)$, and on the object side NA = NA_image·|m|.',
    'A higher magnification resolves more — Resolution is set by NA and wavelength. Raising the magnification beyond what NA supports is empty magnification: bigger, not sharper.',
    'A big enough lens in air could reach NA 1.4 — No lens size makes it possible: in air n sin θ cannot exceed 1. Only a medium of higher index between specimen and lens lifts the limit.'
  ],
  terms: [
    { term: 'Numerical aperture', also: ['NA'], def: 'n sin θ, where θ is the half-angle of the largest cone of light a system accepts from (or sends to) a point and n is the index of the medium. It measures light-gathering power and resolution.' },
    { term: 'Acceptance angle', also: ['acceptance cone', 'half-angle of acceptance'], def: 'The half-angle θ of the cone of rays a lens or fibre accepts: arcsin(NA/n). For a fibre, rays outside it are not guided.' },
    { term: 'Immersion objective', also: ['oil immersion', 'water immersion', 'dry objective'], def: 'An objective designed to work with a liquid of high index (oil, 1.515; water, 1.333) between the cover glass and the front lens. A dry objective works in air.' },
    { term: 'Sine condition', also: ['Abbe sine condition'], def: 'The condition, due to Abbe, that for sharp imaging of points near the axis the height of a ray at the lens is proportional to sin θ of its angle. A lens that satisfies it has NA exactly 1/(2N).' },
    { term: 'Abbe limit', also: ['Abbe resolution limit', 'diffraction limit of a microscope'], def: 'The smallest period a microscope can resolve with light of wavelength λ: λ/(2 NA).' }
  ],
  formulas: [
    {
      name: 'Numerical aperture',
      expr: 'NA = n*sin(t)', tex: '\\mathrm{NA} = n\\sin\\theta',
      vars: {
        NA: { name: 'numerical aperture', tex: '\\mathrm{NA}' },
        n: { name: 'refractive index of the medium', value: 1.515, min: 1, max: 2.5 },
        t: { name: 'half-angle of the cone', q: 'angle', unit: '°', value: 67.5, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'NA can never exceed n.',
      stories: { NA: 'An objective collects a cone of half-angle {t} in a medium of index {n}. What is its numerical aperture?', t: 'An oil objective of NA {NA} works in oil of index {n}. What is the half-angle of its cone?' }
    },
    {
      name: 'NA from the f-number',
      expr: 'NA = 1/(2*N)', tex: '\\mathrm{NA} = \\frac{1}{2N}',
      vars: {
        NA: { name: 'numerical aperture', tex: '\\mathrm{NA}' },
        N: { name: 'f-number', value: 2.8, min: 0.4, max: 64 }
      },
      note: 'Object at infinity, lens obeying the sine condition, in air.',
      stories: { NA: 'What numerical aperture does a lens at f/{N} have?', N: 'A lens has NA {NA}. What f-number is that?' }
    },
    {
      name: 'NA at the image of a magnifying system',
      expr: 'NAi = NA/m', tex: '\\mathrm{NA}_i = \\frac{\\mathrm{NA}}{|m|}',
      vars: {
        NAi: { name: 'NA on the image side', tex: '\\mathrm{NA}_i' },
        NA: { name: 'NA on the object side', value: 0.75, min: 0.01, max: 1.5 },
        m: { name: 'magnification (positive)', value: 40, min: 0.05, max: 200 }
      },
      note: 'From the optical invariant: image height times image-side angle equals object height times object-side angle.',
      stories: { NAi: 'A {m}× objective of NA {NA} forms its image. What NA does the image-forming cone have?' }
    },
    {
      name: 'Resolution of a microscope (Rayleigh)',
      expr: 'd = 0.61*lambda/NA', tex: 'd = 0.61\\,\\frac{\\lambda}{\\mathrm{NA}}',
      vars: {
        d: { name: 'smallest separation of two points', q: 'length', unit: 'nm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 1.4, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' }
      },
      note: 'The Abbe period limit is λ/2NA (a little smaller).',
      stories: { d: 'An objective of NA {NA} images with light of {lambda}. How close can two points be and still be resolved?' }
    }
  ],
  examples: [
    {
      title: 'A 100×/1.40 oil objective',
      q: 'An oil-immersion objective is marked 100×/1.40. What is the half-angle of the cone in the oil (n = 1.515)? How fine a detail does it resolve in green light (550 nm), and how much more light does it gather than a dry 0.95 objective?',
      steps: [
        { text: 'The cone:', tex: '\\sin\\theta = \\frac{1.40}{1.515} = 0.924 \\quad\\Rightarrow\\quad \\theta = 67.5°' },
        { text: 'Abbe limit:', tex: 'd = \\frac{550\\ \\mathrm{nm}}{2\\times1.40} = 196\\ \\mathrm{nm}' },
        { text: 'Light ratio:', tex: '\\left(\\frac{1.40}{0.95}\\right)^2 = 2.2' }
      ],
      a: 'A 67.5° half-angle in the oil, details down to about 196 nm (the 0.95 dry objective: 289 nm), and 2.2 times the light.'
    },
    {
      title: 'A camera lens and a fibre',
      q: 'An f/2.8 lens is used to focus light on to the end of a fibre of NA 0.22. Does all the light enter the fibre?',
      steps: [
        { text: 'The lens cone:', tex: '\\mathrm{NA}_{\\mathrm{lens}} = \\frac{1}{2\\times2.8} = 0.179 \\quad\\Rightarrow\\quad \\theta = 10.3°' },
        { text: 'The fibre accepts $\\arcsin 0.22 = 12.7°$ in air.' }
      ],
      a: 'Yes, as far as angle goes: 10.3° is inside the 12.7° acceptance cone. A lens faster than about f/2.3 (NA 0.22) would overfill the fibre and lose light.'
    }
  ],
  quiz: [
    { q: 'A lens in air collects a cone of half-angle 30°. What is its numerical aperture?', answer: 0.5, why: '$\\mathrm{NA} = n\\sin\\theta = 1\\times\\sin30° = 0.5$ — equivalent to f/1.' },
    { q: 'Why can a dry (air) objective not have an NA above 1?', choices: ['Cover glasses absorb the extra light', 'Dry lenses cannot be made large enough', 'Light cannot travel at angles over 45° in air', 'In air n = 1, so n sin θ cannot exceed 1'], a: 3, why: 'NA = n sin θ and sin θ ≤ 1. Only a medium with n > 1 between specimen and lens allows NA > 1.' },
    { q: 'What numerical aperture does an f/4 lens have, for a distant object?', answer: 0.125, why: '$\\mathrm{NA} = 1/(2N) = 1/8 = 0.125$.' },
    { q: 'Doubling the numerical aperture of an objective changes the smallest resolvable detail by a factor of…', choices: ['two', 'one quarter', 'one half', 'no change'], a: 2, why: 'The limit is $\\lambda/2\\mathrm{NA}$: doubling NA halves it. (The light gathered rises fourfold.)' },
    { q: 'A 40× objective of NA 0.75 forms its image. What is the NA of the cone that converges to the image? Give the number.', answer: 0.01875, why: '$\\mathrm{NA}_i = \\mathrm{NA}/|m| = 0.75/40 = 0.01875$: roughly f/27 on the image side.' }
  ],
  applications: [
    'Microscope objectives are marked with their NA and magnification, and their immersion medium: 40×/0.75, 100×/1.40 oil.',
    'Fibre coupling: a lens must match its cone to the fibre\'s NA, no wider, or the light is not guided.',
    'Lithography: 193 nm scanners use water immersion at NA up to 1.35; EUV scanners, which use mirrors in vacuum, have NA 0.33 and, in the newest, 0.55.',
    'Camera lenses and the lens datasheet: NA = 1/(2N) converts between the two vocabularies when a microscope camera or a machine-vision lens is chosen.',
    'Laser focusing and beam delivery: the focused spot size is set by the NA of the focusing lens.'
  ],
  history: 'Ernst Abbe introduced the numerical aperture in 1873, together with the sine condition and the theory that a microscope cannot resolve detail finer than λ/2NA. In the late 1870s he and Carl Zeiss produced the first homogeneous-immersion objectives, with oil matching the glass, which took NA above 1.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 (Stops, Apertures, Pupils and Diffraction) — numerical aperture and the f-number.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 4 (the Abbe sine condition) and the chapter on image-forming instruments (the resolving power of the microscope).',
    'E. Abbe, "Beiträge zur Theorie des Mikroskops und der mikroskopischen Wahrnehmung", *Archiv für mikroskopische Anatomie* 9 (1873) — the numerical aperture and the sine condition.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — the chapters on ray optics and on fibre optics: numerical aperture of lenses and fibres.'
  ],
  sim: 'px-na'
},

/* ================================================================ the optical invariant */
{
  id: 'the-optical-invariant', parent: 'paraxial-systems', title: 'The optical invariant', level: 3,
  short: 'The product of the object height, the ray angle and the refractive index, n·u·h, is the same at every plane of a system, and the same at the image as at the object. It ties image size to cone angle, sets the étendue that no lens can reduce, and is why a wide field and a large aperture together demand a large, complex lens.',
  keywords: ['optical invariant', 'Lagrange invariant', 'Helmholtz-Lagrange invariant', 'Smith-Helmholtz-Lagrange', 'throughput', 'etendue', 'n u h', 'conserved quantity', 'space-bandwidth product', 'angular magnification', 'conjugate planes', 'invariant H'],
  prereq: ['chief-and-marginal-rays', 'lateral-and-longitudinal-magnification', 'ray-transfer-matrices'],
  related: ['etendue', 'radiance-and-its-conservation', 'numerical-aperture', 'coupling-light-into-fibre', 'concentrating-light', 'the-f-number', 'the-light-budget', 'physics:magnification'],
  body: `
Squeeze an image into a smaller size and the light must fan out more steeply on its way there. Make an image large and its cone of rays narrows. Something is conserved, and it is the **optical invariant**.

### The invariant
Trace the marginal ray (height $y$, angle $u$) and the chief ray (height $\\bar y$, angle $\\bar u$) through a system. The combination

$$H = n\\,(\\bar u\\,y - u\\,\\bar y)$$

has the same value at every surface, in every gap and after every lens. At the object plane the marginal ray has $y=0$ and the chief ray has height $\\bar y = h$, so $H = n\\,u\\,h$; at the image it is $n'u'h'$. Hence

$$n\\,u\\,h = n'\\,u'\\,h'$$

It is also called the Lagrange, Helmholtz–Lagrange or Smith–Helmholtz–Lagrange invariant. That it is conserved is the statement that the determinant of the ABCD matrix is $n_1/n_2$ ([[ray-transfer-matrices]]).

### What it says
- **Magnification and angle trade.** $m = h'/h = nu/(n'u')$: a system that enlarges the image by 3 narrows the cone by 3.
- **It measures a system.** For a lens at infinity focus $H \\approx h'\\times\\mathrm{NA} = h'/(2N)$, the image half-size times the cone.

| system | image half-size | cone (NA) | H |
|---|---|---|---|
| full frame, f/1.4 | 21.6 mm | 0.357 | 7.7 mm |
| full frame, f/8 | 21.6 mm | 0.0625 | 1.35 mm |
| 1/2.3″ sensor, f/2 | 3.8 mm | 0.25 | 0.96 mm |
| fibre, 50 µm core, NA 0.2 | 0.025 mm | 0.2 | 0.005 mm |

### Why the lens gets big
Everything an optical system accepts has to pass through it with a given $H$. A full-frame f/1.4 lens must handle eight times the invariant of the lens of a compact camera or phone (1/2.3″ sensor, f/2), which is why it is large and has many elements, while the small lens is a few millimetres wide. $H$ also bounds how much detail a lens can carry: about $2H/0.61\\lambda$ resolvable points across the field's diameter.

### Étendue
For a circular field of radius $h$ and a cone of half-angle $u$ (small), the **étendue** is $G = \\pi^2 (n u h)^2 = \\pi^2 H^2$ ([[etendue]]). No lens, mirror or fibre can reduce it, so a source with a large étendue cannot be squeezed into a system with a small one: a 1 mm² LED die (Lambertian, $G = \\pi\\ \\mathrm{mm^2\\,sr}$) feeding a 1 mm fibre of NA 0.5 ($G = 0.62$) can send at most 20 % of its light into it, however good the optics.

> [!key] $n\\,u\\,h$ is the same at the object and at the image: image size and cone angle trade, and the product — the étendue — cannot be reduced by any optics. It measures how much field and aperture a system must handle.
`,
  ideas: [
    'H = n(ū y − u ȳ), built from the marginal and chief rays, has the same value at every plane of the system.',
    'At conjugate planes this gives n u h = n′ u′ h′: image size and cone angle are traded, never both reduced.',
    'For a camera lens H is the image half-size times the NA, about h′/(2N).',
    'The étendue G = π² H² can never be reduced by optics; a source of larger étendue cannot be fully coupled into a system of smaller étendue.',
    'Its conservation is the statement that the ABCD matrix has determinant n₁/n₂ (1 in air).'
  ],
  pitfalls: [
    'Conservation of the invariant means no light is lost — It says nothing about energy: reflection, absorption and vignetting still lose light. What it forbids is shrinking the space–angle product, whatever the lens.',
    'A better lens could focus a large LED into a thin fibre — No lens can: the étendue of the LED exceeds that of the fibre and the excess is lost by geometry, not by poor optics.',
    'A telescope increases the beam by its magnification — It narrows it: an afocal telescope of angular magnification M shrinks the beam diameter by M (and magnifies the angle by M), keeping y·u constant.',
    'The invariant has units of energy or brightness — It has the dimensions of length times angle (mm·rad); its square, the étendue, is area times solid angle.'
  ],
  terms: [
    { term: 'Optical invariant', also: ['Lagrange invariant', 'Helmholtz–Lagrange invariant', 'Smith–Helmholtz–Lagrange invariant', 'H'], def: 'The quantity n(ū y − u ȳ) built from a marginal and a chief ray. It has the same value at every plane of an optical system; at conjugate planes it is n u h.' },
    { term: 'Conjugate planes', also: ['conjugates', 'object and image planes'], def: 'A pair of planes of which one is the image of the other: every point of the first is imaged to a point of the second. At them the marginal ray has zero height.' },
    { term: 'Reduced angle', also: ['reduced slope', 'n·u'], def: 'The ray angle multiplied by the refractive index of the medium it travels in. It is the quantity that does not change at a flat refracting surface.' }
  ],
  formulas: [
    {
      name: 'The invariant between two conjugate planes',
      expr: 'n1*u1*h1 = n2*u2*h2', tex: 'n_1 u_1 h_1 = n_2 u_2 h_2',
      vars: {
        n1: { name: 'index at the object', value: 1, min: 1, max: 2.5, tex: 'n_1' },
        u1: { name: 'marginal ray angle at the object', q: 'angle', unit: 'mrad', value: 50, min: 0.001, max: 1500, tex: 'u_1' },
        h1: { name: 'object height', q: 'length', unit: 'mm', value: 8, tex: 'h_1' },
        n2: { name: 'index at the image', value: 1, min: 1, max: 2.5, tex: 'n_2' },
        u2: { name: 'marginal ray angle at the image', q: 'angle', unit: 'mrad', min: 0.001, max: 1500, tex: 'u_2' },
        h2: { name: 'image height', q: 'length', unit: 'mm', value: 16, tex: 'h_2' }
      },
      solveFor: 'u2',
      note: 'Small angles. Doubling the image height halves the cone.',
      stories: { u2: 'An object {h1} high sends a cone of half-angle {u1} into a lens that forms an image {h2} high, both in air. What is the half-angle of the cone at the image?', h2: 'A lens narrows a cone from {u1} to {u2}, both in air. How tall is the image of an object {h1} high?' }
    },
    {
      name: 'Invariant of a camera lens',
      expr: 'H = h/(2*N)', tex: 'H = \\frac{h\'}{2N}',
      vars: {
        H: { name: 'optical invariant', q: 'length', unit: 'mm' },
        h: { name: 'image half-size (half the sensor diagonal)', q: 'length', unit: 'mm', value: 21.6, tex: 'h\'' },
        N: { name: 'f-number', value: 1.4, min: 0.5, max: 64 }
      },
      note: 'In mm·rad, for a distant object: the image half-size times the numerical aperture 1/(2N).',
      stories: { H: 'A lens at f/{N} covers an image {h} in half-size. What is its optical invariant?' }
    },
    {
      name: 'Étendue from the invariant',
      expr: 'G = pi^2*(n*u*h)^2', tex: 'G = \\pi^2\\,(n\\,u\\,h)^2',
      vars: {
        G: { name: 'étendue', q: false, unit: 'mm²·sr' },
        n: { name: 'refractive index', value: 1, min: 1, max: 2.5 },
        u: { name: 'half-angle of the cone', q: false, unit: 'rad', value: 0.5, min: 0.001, max: 1.5 },
        h: { name: 'radius of the field', q: false, unit: 'mm', value: 0.5 }
      },
      note: 'Small cone angles, circular field; for wide cones use G = π A n² sin²θ.',
      stories: { G: 'A source of radius {h} emits into a cone of half-angle {u} in a medium of index {n}. What is its étendue?' }
    }
  ],
  examples: [
    {
      title: 'Enlarging an image',
      q: 'An object 8 mm tall in air sends a cone of half-angle 0.05 rad into a lens, which forms an image at magnification −2. What are the image height, the half-angle of the cone at the image, and the invariant?',
      steps: [
        'Image height: $h\' = 2\\times8 = 16$ mm.',
        { text: 'The invariant on the object side, and so on the image side:', tex: 'H = n\\,u\\,h = 1\\times0.05\\times8 = 0.40\\ \\mathrm{mm\\cdot rad}' },
        { text: 'The cone at the image:', tex: 'u\' = \\frac{H}{n\' h\'} = \\frac{0.40}{16} = 0.025\\ \\mathrm{rad}' }
      ],
      a: 'The image is 16 mm tall, the cone half-angle is 0.025 rad (half that at the object) and H = 0.40 mm·rad on both sides.'
    },
    {
      title: 'An LED and a fibre',
      q: 'A square LED die of 1 mm² emits Lambertian light. A fibre of 1 mm core diameter and NA 0.5 is to carry it. What is the most light that can be coupled, whatever the lens?',
      steps: [
        { text: 'The LED:', tex: 'G_{\\mathrm{LED}} = \\pi\\,A\\sin^2 90° = \\pi\\times1 = 3.14\\ \\mathrm{mm^2\\,sr}' },
        { text: 'The fibre (area $\\pi\\times0.5^2 = 0.785$ mm², NA 0.5):', tex: 'G_{\\mathrm{fibre}} = \\pi\\times0.785\\times0.5^2 = 0.62\\ \\mathrm{mm^2\\,sr}' },
        { text: 'The ratio:', tex: '\\frac{0.62}{3.14} = 0.20' }
      ],
      a: 'No more than about 20 %. A lens can match the fibre\'s cone to the LED\'s image size, but cannot get round the étendue.'
    }
  ],
  quiz: [
    { q: 'A lens forms an image twice the size of the object. Compared with the object side, the cone of rays at the image has a half-angle that is…', choices: ['twice as large', 'half as large', 'the same', 'four times as large'], a: 1, why: '$n\\,u\\,h$ is conserved: if $h$ doubles, $u$ must halve (both in air).' },
    { q: 'What can a lens or mirror system do to the étendue of a beam?', choices: ['Reduce it by narrowing the cone with a stop and keeping all the light', 'Reduce it, if the lens is strong enough', 'Reduce it by making the image smaller', 'Leave it the same, or increase it (by aberrations or scattering): never reduce it'], a: 3, why: 'The invariant H and the étendue G = π²H² are conserved by a perfect passive system, and aberrations or scattering only increase them. A stop reduces the étendue of what passes — but only by throwing light away.' },
    { q: 'An object 5 mm tall sends a marginal ray at 0.1 rad into a lens of magnification −0.25 (both in air). What is the marginal-ray angle at the image, in rad?', answer: 0.4, why: '$u\' = n\\,u\\,h/(n\' h\') = 0.1\\times5/(1.25) = 0.4$ rad: a quarter-size image needs a four-times steeper cone.' },
    { q: 'An afocal telescope with an angular magnification of 10 makes the beam through it ten times narrower.', a: true, why: '$y\\,u$ is conserved: the angle grows by 10, so the beam height shrinks by 10. A beam expander used backwards.' },
    { q: 'Which has the larger optical invariant: a 1/2.3″ sensor behind an f/2 lens, or a full-frame sensor behind an f/2 lens?', choices: ['They are equal because the f-number is equal', 'The 1/2.3″ system', 'The full-frame system: the image half-size is about 5.6 times larger at the same NA', 'It depends on the focal length'], a: 2, why: '$H \\approx h\'/(2N)$: at the same $N$, the invariant goes as the image half-size, 21.6 mm against 3.8 mm.' }
  ],
  applications: [
    'Choosing lens sizes: a first-order layout fixes H from the sensor and the f-number and from it the diameters needed.',
    'Coupling LEDs, lasers and lamps to fibres, light guides and projectors: the étendue sets the ceiling on what any lens can deliver.',
    'Projector design: the brightness on the screen is limited by the étendue of the lamp and of the imager.',
    'Telescopes and binoculars: the exit pupil D/M of an afocal instrument follows from the invariant (the beam narrows by M as the angle grows by M).',
    'Comparing camera systems of different sensor sizes: equal f-number but a larger sensor means a larger invariant, a larger lens and more light collected.'
  ],
  history: 'The conserved quantity was found several times. Robert Smith described a relation of this kind in his *Compleat System of Opticks* (1738); Lagrange gave the general paraxial form, and Hermann von Helmholtz rediscovered it in the 1850s, which is why it carries the names of all three.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — the Lagrange invariant and its uses.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 4 — the Lagrange (Helmholtz–Lagrange) invariant.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE, 2004) — the Lagrange invariant, throughput and étendue.',
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* — étendue and the limits it sets on concentration.'
  ],
  sim: { id: 'px-rays', params: { mode: 'invariant' } }
},

/* ================================================================ vignetting */
{
  id: 'vignetting', parent: 'paraxial-systems', title: 'Vignetting', level: 2,
  short: 'Vignetting is the loss of light from oblique beams that are partly blocked by lens rims, hoods and baffles rather than by the stop. The round pupil of the axial beam becomes a lens-shaped cat\'s eye, and the corners of the picture are darker than the centre — on top of the natural cos⁴ fall-off. Stopping down usually cures it.',
  keywords: ['vignetting', 'mechanical vignetting', 'optical vignetting', 'natural vignetting', 'cos4 law', 'cat\'s eye', 'cat eye bokeh', 'corner shading', 'light fall-off', 'relative illumination', 'lens hood', 'filter vignetting', 'pixel vignetting', 'dark corners'],
  prereq: ['aperture-stop', 'field-stop-and-field-of-view', 'entrance-and-exit-pupils'],
  related: ['relative-illumination-and-shading', 'aperture-and-f-stops', 'coma', 'image-circle-and-sensor-coverage', 'bokeh-and-out-of-focus-blur', 'cooke-triplet', 'double-gauss', 'symmetry-and-the-stop'],
  body: `
The corners of a picture are often darker than its centre. Part of that is geometry — light arriving at a slant, treated at the end of this page. Part is that some of the light never gets through the lens. That second part is **vignetting**.

### How it happens
An axial beam fills the aperture stop and nothing else needs to be considered: every other opening is wider. A beam from an off-axis point arrives at an angle, so every other opening, seen from that angle, appears **shifted sideways** in proportion to its distance from the stop. A lens rim 20 mm ahead of the stop, seen at 10°, is shifted by $20\\tan10° = 3.5$ mm. The beam must now pass through the stop *and* through the shifted rim; what survives is the overlap of two circles, a **cat's eye**, and the light that gets through is proportional to its area. For two equal circles offset by $x$ times their diameter,

$$T = \\frac{2}{\\pi}\\left(\\arccos x - x\\sqrt{1-x^2}\\right)$$

so an offset of a quarter of the diameter leaves 69 %.

### Kinds
- **Mechanical vignetting**: something that is not an optical element — a lens hood, a thick filter ring, a stack of filters, the barrel — intrudes into the oblique beam.
- **Optical (lens-rim) vignetting**: the edges of the glass elements themselves cut the beam; the same geometry, built into the design.
- **Pixel vignetting**: the pixels of a sensor accept less light at steep angles (see [[microlenses-bsi-and-stacked-sensors]]).
- **Natural vignetting** is not clipping at all: illuminance on a flat sensor falls as $\\cos^4\\theta$ — the exit pupil looks foreshortened (a factor cos θ), the corner is farther from it (cos²θ) and the light meets the sensor obliquely (cos θ). It is 94 % at 10°, 78 % at 20°, 56 % at 30°, 34 % at 40° ([[relative-illumination-and-shading]]).

### Three lenses
A 25 mm lens with a hood ring 60 mm in front of it: at 5° the pupil has lost 23 % of its area, at 10° half, at 15° three quarters. The Cooke triplet (to 20°) and the double Gauss (to 14°) are clean within the field they were designed for, and a few degrees beyond it a rim clips the beam sharply. The simulation traces every ray and names the rim that stops most of them.

### Cures, and uses
**Stopping down** makes the stop smaller than the cat's eye, so the beam is no longer clipped: vignetting usually disappears once the lens is two or three stops down from full opening. Designers also *allow* it on purpose: the rays lost first are the extreme ones, which carry the worst coma, so a vignetted lens is sharper in its corners than an unvignetted one — at the price of light. The signature outside the picture's corners is the lens-shaped, "cat's-eye" out-of-focus highlight ([[bokeh-and-out-of-focus-blur]]).

> [!key] Vignetting is the clipping of oblique beams by rims other than the stop: the round pupil becomes a cat's eye whose area gives the light that gets through. It grows with field angle and falls when the lens is stopped down; the cos⁴ fall-off is a separate, geometric effect.
`,
  ideas: [
    'Seen from an oblique direction, every opening is shifted sideways in proportion to its distance from the stop; the beam must pass all of them.',
    'The part of the pupil that survives is a cat\'s eye, the overlap of the shifted circles; the light passed is proportional to its area.',
    'Stopping down shrinks the stop inside the cat\'s eye, so vignetting usually disappears two or three stops from full opening.',
    'Natural (cos⁴) fall-off is geometry, not clipping, and is added to vignetting.',
    'Designers sometimes allow vignetting to cut the worst rays (coma) at the edge of the pupil.'
  ],
  pitfalls: [
    'Vignetting is a fault of cheap lenses — Nearly every fast lens vignettes at full aperture; designers accept it, or even choose it, to improve corner sharpness.',
    'All darkening of the corners is vignetting — Natural cos⁴ fall-off and the response of the pixels at steep angles are separate effects, and add to the clipping of the beam.',
    'Vignetting affects only the brightness of the corners — It also reshapes out-of-focus highlights into cat\'s eyes toward the corners, since the pupil itself has changed shape.',
    'A lens hood can only help — A hood that is too long for the field of view clips the oblique beams of the corners: the same cat\'s-eye geometry, made by the hood.'
  ],
  terms: [
    { term: 'Vignetting', def: 'The reduction of the brightness of the image towards the edge of the field because oblique beams are partly blocked by openings other than the aperture stop.' },
    { term: 'Mechanical vignetting', def: 'Vignetting by parts that are not optical elements: a hood, filter rings, a baffle or the lens barrel. Usually removed by taking the part away or opening it up.' },
    { term: 'Optical vignetting', also: ['lens-rim vignetting', 'barrel vignetting'], def: 'Vignetting by the rims of the lens elements themselves, which is built into the design and reduces as the lens is stopped down.' },
    { term: 'Natural vignetting', also: ['cos⁴ law', 'cos⁴ fall-off', 'natural illumination fall-off'], def: 'The fall-off of illuminance on a flat sensor as cos⁴ of the field angle, caused by geometry and not by clipping. It is present even in a lens with no vignetting.' },
    { term: 'Cat\'s eye', also: ['cat\'s-eye aperture', 'cat\'s-eye bokeh'], def: 'The lens-shaped, almond-like outline of the part of the pupil left after an oblique beam has been clipped by two or more rims.' }
  ],
  formulas: [
    {
      name: 'Natural fall-off (the cos⁴ law)',
      expr: 'E = cos(t)^4', tex: 'E = \\cos^4\\theta',
      vars: {
        E: { name: 'illuminance relative to the centre', q: 'ratio', unit: '%' },
        t: { name: 'field angle', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\theta' }
      },
      note: 'For a thin lens with the stop at the lens; real lenses, with pupils that do not stay circular, may fall off less.',
      stories: { E: 'A lens covers a field in which the corner is {t} off the axis. What fraction of the central illuminance reaches the corner from cos⁴ alone?', t: 'At what field angle has the illuminance of cos⁴ fallen to {E}?' }
    },
    {
      name: 'Sideways shift of a rim seen from the field',
      expr: 'sh = L*tan(t)', tex: '\\delta = L\\tan\\theta',
      vars: {
        sh: { name: 'apparent shift of the rim', q: 'length', unit: 'mm', tex: '\\delta' },
        L: { name: 'distance of the rim from the stop', q: 'length', unit: 'mm', value: 60 },
        t: { name: 'field angle', q: 'angle', unit: '°', value: 5, min: 0, max: 80, tex: '\\theta' }
      },
      note: 'The two circles of the cat\'s eye are offset by this much.',
      stories: { sh: 'A hood ring stands {L} in front of the stop. By how much is it shifted, seen from {t} off the axis?' }
    },
    {
      name: 'Light passed by a cat\'s eye of two equal circles',
      expr: 'T = (2/pi)*(acos(x) - x*sqrt(1 - x^2))', tex: 'T = \\frac{2}{\\pi}\\left(\\arccos x - x\\sqrt{1 - x^2}\\right)',
      vars: {
        T: { name: 'share of the pupil that gets through', q: 'ratio', unit: '%' },
        x: { name: 'offset as a fraction of the diameter', value: 0.25, min: 0, max: 1 }
      },
      note: 'x = δ/D, the offset of the rims divided by their common diameter. x = 0: all the light; x = 1: none.',
      stories: { T: 'Two equal circular openings are offset by {x} of their diameter as seen from the field. What share of the beam passes both?' }
    }
  ],
  examples: [
    {
      title: 'A hood that is too long',
      q: 'A lens 25.4 mm across has a hood ring of the same diameter 60 mm in front of it. How much of the beam from a point 5° off the axis gets through, and what is the loss in stops?',
      steps: [
        { text: 'The ring appears shifted by', tex: 'e = 60\\tan5° = 5.25\\ \\mathrm{mm}, \\qquad x = \\frac{5.25}{25.4} = 0.21' },
        { text: 'The share of the pupil that survives:', tex: 'T = \\frac{2}{\\pi}\\left(\\arccos0.21 - 0.21\\sqrt{1-0.21^2}\\right) = 0.74' },
        { text: 'In stops:', tex: '\\log_2\\frac{1}{0.74} = 0.43' }
      ],
      a: 'About 74 % gets through at 5°, a loss of 0.4 stop (the simulation, with a slightly different hood, gives 77 %). At 10° the loss is a full stop.'
    },
    {
      title: 'The corner of a wide-angle picture',
      q: 'A 24 mm lens on a full-frame sensor: how dark is the corner from cos⁴ alone?',
      steps: [
        { text: 'The corner is 21.6 mm from the centre, so', tex: '\\theta = \\arctan\\frac{21.6}{24} = 42.0°' },
        { text: 'Illuminance:', tex: '\\cos^4 42.0° = 0.305, \\qquad \\log_2\\frac{1}{0.305} = 1.7\\ \\text{stops}' }
      ],
      a: 'The corner receives 30 % of the central illuminance, 1.7 stops less, before any vignetting — which is why wide-angle lenses of retrofocus design lean on pupil aberrations to reduce the fall-off.'
    }
  ],
  quiz: [
    { q: 'What turns the round pupil of an oblique beam into a cat\'s eye?', choices: ['Chromatic aberration', 'Diffraction at the iris', 'The rims of other openings, seen from the field angle, shifted against the stop', 'The sensor\'s microlenses'], a: 2, why: 'Each opening is shifted sideways, in proportion to its distance from the stop, as seen from an oblique direction; the beam is the overlap of the shifted circles.' },
    { q: 'Closing the iris usually reduces vignetting.', a: true, why: 'With a smaller stop the beam is smaller than the cat\'s eye, so the rims no longer clip it. Many lenses are vignette-free two or three stops down from full opening.' },
    { q: 'By cos⁴ alone, what share of the central illuminance (in per cent) reaches a point 30° off the axis?', answer: 56.3, why: '$\\cos^4 30° = 0.866^4 = 0.5625$.' },
    { q: 'Which of these is NOT vignetting?', choices: ['A lens hood cutting the corners of the beam', 'The cos⁴ fall-off of illuminance with field angle', 'The rim of a rear lens element clipping an oblique beam', 'A filter ring stack cutting the corners'], a: 1, why: 'cos⁴ fall-off happens even when no ray is blocked; it is geometry. The others are clippings of the beam by something other than the stop.' },
    { q: 'A wide-angle lens with a thick filter stack and a deep hood gives dark corners that are not there without them. The cause is…', choices: ['Diffraction', 'Chromatic aberration', 'Distortion', 'Mechanical vignetting: the beam is clipped by the added rims'], a: 3, why: 'The hood and filter ring are extra openings far from the stop; seen from the corner angles they are shifted so far that they clip the beams.' }
  ],
  applications: [
    'Choosing lenses: the corner performance wide open — light and sharpness — differs between lenses of the same focal length and f-number.',
    'Telescopes: the diagonal mirror of a Newtonian reflector clips oblique beams, so a "fully illuminated field" is quoted.',
    'Camera software corrects vignetting with lens profiles, brightening the corners (and the noise with them).',
    'Machine vision: the flat-field calibration removes the combined effect of vignetting, cos⁴ fall-off and sensor shading.',
    'Photographic style: the cat\'s-eye highlights of fast lenses are a recognisable look, and a vignette is added or removed in editing.'
  ],
  history: 'The word comes from the printers\' *vignette* (from the French for a vine): a decorative border of leaves or tendrils that fades into the page. Photographers of the nineteenth century borrowed it for portraits that fade softly at the edges, and then for the same effect when it came from the lens.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 (Stops, Apertures, Pupils and Diffraction) — vignetting and the cos⁴ law.',
    'R. Kingslake, *Optics in Photography* (SPIE, 1992) — vignetting and illumination at the edge of the field.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE, 2004) — vignetting and relative illumination.'
  ],
  sim: 'px-vignette'
},

/* ================================================================ telecentricity */
{
  id: 'telecentricity', parent: 'paraxial-systems', title: 'Telecentricity', level: 3,
  short: 'A system is telecentric when its stop sits at a focal point so that the chief rays run parallel to the axis: object-space telecentric if they do so in front of the lens, image-space if behind it, double if both. Then the size of the image no longer depends on how far away the object is, or where the sensor sits — which is why measuring machines use such lenses.',
  keywords: ['telecentric', 'object-space telecentric', 'image-space telecentric', 'double telecentric', 'bi-telecentric', 'telecentricity', 'telecentric lens', 'chief ray parallel to axis', 'entocentric', 'perspective error', 'telecentric error', 'metrology lens', 'stop at focal plane'],
  prereq: ['entrance-and-exit-pupils', 'chief-and-marginal-rays', 'aperture-stop'],
  related: ['telecentric-lenses', 'telecentric-imaging', 'magnification-and-working-distance', 'perspective-and-focal-length', 'microlenses-bsi-and-stacked-sensors', 'the-vision-inspection-cell', 'photolithography', 'pixels-per-feature'],
  body: `
Hold a coin at arm's length, then bring it to your nose: it grows. That is **perspective**, and it comes from the chief rays: an ordinary lens collects light along rays that converge on the centre of its entrance pupil, so nearer things subtend larger angles. For a person judging a picture that is natural; for a machine measuring the diameter of a pin it is an error. A **telecentric** system removes it.

### The stop at a focal point
If the stop sits at the **rear focal plane** of the lens, its image seen from the front — the entrance pupil — is at infinity. The chief ray passes through the centre of the stop, so in front of the lens it runs *parallel to the axis*: the system is **object-space telecentric**. If the stop sits at the **front focal plane**, the exit pupil is at infinity and the chief rays reach the sensor parallel to the axis: **image-space telecentric**. Two lenses sharing a focal plane, with the stop in it, make a **double** (bi-)telecentric system, of magnification $-f_2/f_1$ for any object and any sensor position.

### What it buys
An achromat of 100 mm with the object 300 mm in front of it (for the two-lens version the object stands in the front focal plane of the first lens); the object is moved 30 mm away, then the sensor 4 mm back, and the height of the image is read off (traced, the stop at four places):

| stop at | chief ray | object +30 mm | sensor +4 mm |
|---|---|---|---|
| the lens (ordinary) | inclined in both spaces | −9.1 % | +2.7 % |
| rear focal plane | parallel in front | 0.0 % | +8.0 % |
| front focal plane | parallel behind | −13 % | 0.0 % |
| between two lenses | parallel in both | 0.0 % | 0.0 % |

In an object-space telecentric lens the chief ray's path does not depend on how far the object is, so a defocused object is blurred about the same centre and keeps its size: an edge measured at half intensity stays where it was. The same lens also looks straight into a bore, without seeing its walls.

### The price
The front lens of an object-space telecentric system must be **larger than the object**: a 25 mm field needs well over 25 mm of glass, which is why such lenses are big, heavy and made for one magnification and working distance. Telecentricity is not perfect either: lenses are specified to a **telecentric angle** of 0.1–0.3°, and an error $\\varepsilon$ shifts an edge by $\\Delta z\\tan\\varepsilon$ — 1.7 µm for 0.1° and 1 mm of depth. The depth range is still limited by blur: telecentricity keeps the size, not the focus.

### Where
Dimensional gauging by machine vision ([[telecentric-imaging]]), measuring microscopes, silhouettes of shafts and threads against backlights, and lithography, whose projection lenses are telecentric at the wafer so that a wafer out of focus is not printed too large or too small. The lens itself is described in [[telecentric-lenses]].

> [!key] Put the stop at a focal plane and the chief rays become parallel to the axis: object-space telecentric if in front of the lens, image-space if behind it. Image size then does not change with the object's distance (or with the sensor's position), at the cost of a front lens as large as the field.
`,
  ideas: [
    'Stop at the rear focal plane: the entrance pupil is at infinity and the chief rays are parallel to the axis in front of the lens (object-space telecentric).',
    'Stop at the front focal plane: the exit pupil is at infinity and the chief rays reach the sensor parallel to the axis (image-space telecentric).',
    'Object-space telecentricity makes the image size independent of the object distance; image-space telecentricity makes it independent of the sensor position.',
    'A double-telecentric system has magnification −f₂/f₁ whatever the distances.',
    'The cost: the front lens must be larger than the field, and the telecentric angle is never exactly zero.'
  ],
  pitfalls: [
    'Telecentric lenses have unlimited depth of field — Blur grows with defocus as in any lens; only the size and centre of the blurred image stay put.',
    'Any lens can be made telecentric by adding a stop — The stop must be at the right focal plane and the glass in front must be large enough for the whole field; a lens designed for a 25 mm field cannot be made telecentric for 100 mm.',
    'Telecentric on one side protects both — Object-space telecentricity does nothing for the sensor position, and image-space telecentricity does nothing for the object distance (13 % at 30 mm in the table above).',
    'A telecentric lens is just a long lens — Telecentricity is about where the stop is, not the focal length. A long ordinary lens, used from far away, only makes the perspective error smaller (Δz/z₀ falls as z₀ grows); it is still entocentric, and the error is still there.'
  ],
  terms: [
    { term: 'Telecentric', also: ['telecentric system', 'telecentric lens'], def: 'Having an entrance pupil, an exit pupil or both at infinity, so that the chief rays are parallel to the axis in object space, in image space or in both.' },
    { term: 'Object-space telecentric', also: ['telecentric on the object side', 'entrance-pupil telecentric'], def: 'Telecentric with the entrance pupil at infinity: the stop is at the rear focal plane. The size of the image does not depend on the object distance.' },
    { term: 'Image-space telecentric', also: ['telecentric on the image side', 'exit-pupil telecentric'], def: 'Telecentric with the exit pupil at infinity: the stop is at the front focal plane. Light reaches every pixel at normal incidence, and the image size does not depend on the sensor position.' },
    { term: 'Double telecentric', also: ['bi-telecentric'], def: 'Telecentric on both sides, usually two lens groups with a shared focal plane holding the stop. The magnification is −f₂/f₁, whatever the object or sensor position.' },
    { term: 'Telecentric angle', also: ['telecentricity error', 'telecentricity'], def: 'The residual angle between the chief ray and the axis in a nominally telecentric lens, typically 0.1° to 0.3°. It decides the size error for an object out of its plane.' },
    { term: 'Entocentric lens', also: ['ordinary lens', 'perspective lens'], def: 'An ordinary lens whose chief rays converge on a point on the lens side of the object, so that nearer objects look bigger.' }
  ],
  formulas: [
    {
      name: 'Size error of an ordinary lens',
      expr: 'err = dz/z0', tex: '\\varepsilon \\approx \\frac{\\Delta z}{z_0}',
      vars: {
        err: { name: 'change in apparent size', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        dz: { name: 'movement of the object along the axis', q: 'length', unit: 'mm', value: 1, tex: '\\Delta z' },
        z0: { name: 'distance from the entrance pupil to the object', q: 'length', unit: 'mm', value: 500, tex: 'z_0' }
      },
      note: 'Small movement, sensor fixed: a part moved nearer looks larger by Δz/z₀.',
      stories: { err: 'A part is {z0} from the entrance pupil of an ordinary lens and moves {dz} nearer. By how much does its image grow?' }
    },
    {
      name: 'Edge shift from a telecentric error',
      expr: 'dx = dz*tan(eps)', tex: '\\Delta x = \\Delta z\\,\\tan\\varepsilon',
      vars: {
        dx: { name: 'shift of the edge in the image (at the object)', q: 'length', unit: 'µm', tex: '\\Delta x' },
        dz: { name: 'distance from the nominal plane', q: 'length', unit: 'mm', value: 1, tex: '\\Delta z' },
        eps: { name: 'telecentric angle', q: 'angle', unit: '°', value: 0.1, min: 0, max: 10, tex: '\\varepsilon' }
      },
      note: 'A lens with 0.1° telecentric error and an object 1 mm out of its plane: 1.7 µm.',
      stories: { dx: 'A telecentric lens has an error of {eps}. How far does an edge appear to move when the part is {dz} out of its plane?' }
    },
    {
      name: 'Magnification of a double-telecentric system',
      expr: 'm = f2/f1', tex: '|m| = \\frac{f_2}{f_1}',
      vars: {
        m: { name: 'magnification (magnitude)' },
        f1: { name: 'focal length of the front group', q: 'length', unit: 'mm', value: 100, tex: 'f_1' },
        f2: { name: 'focal length of the rear group', q: 'length', unit: 'mm', value: 50, tex: 'f_2' }
      },
      note: 'The groups are f₁ + f₂ apart with the stop at their common focal plane.',
      stories: { m: 'A double-telecentric lens has front and rear groups of {f1} and {f2}. What is its magnification?' }
    }
  ],
  examples: [
    {
      title: 'A pin under two lenses',
      q: 'A machine-vision camera measures the length of a pin from the side. The entrance pupil of an ordinary lens is 500 mm from the pin, and the pin\'s tip sits 1 mm nearer than the base. How big is the error on a 20 mm pin? What if a telecentric lens with 0.1° error were used?',
      steps: [
        { text: 'Ordinary lens:', tex: '\\frac{\\Delta h}{h} = \\frac{1}{500} = 0.2\\ \\% \\quad\\Rightarrow\\quad 0.002\\times20\\ \\mathrm{mm} = 40\\ \\mu\\mathrm{m}' },
        { text: 'Telecentric lens:', tex: '\\Delta x = 1\\ \\mathrm{mm}\\times\\tan0.1° = 1.7\\ \\mu\\mathrm{m}' }
      ],
      a: 'The ordinary lens gives an error of 40 µm on a 20 mm part; the telecentric one 1.7 µm, and no systematic error in size at all if the part is in the plane.'
    },
    {
      title: 'A double-telecentric relay',
      q: 'Design a double-telecentric lens of magnification 0.5 from lenses with focal lengths 100 mm and 50 mm. Where does the stop go?',
      steps: [
        { text: 'The magnification:', tex: '|m| = \\frac{f_2}{f_1} = \\frac{50}{100} = 0.5' },
        'The two lenses share a focal plane: they are 100 + 50 = 150 mm apart.',
        'The stop is in that plane: 100 mm behind lens 1 and 50 mm in front of lens 2.',
        'In use the object stands in the front focal plane of lens 1 (a working distance of 100 mm) and the image forms in the rear focal plane of lens 2, 50 mm behind it.'
      ],
      a: 'The lenses stand 150 mm apart, the stop 100 mm behind the front lens, the object 100 mm in front of it. The front lens must be larger than the object field plus the cone it sends to the stop.'
    }
  ],
  quiz: [
    { q: 'Where is the aperture stop of an object-space telecentric lens?', choices: ['At the lens itself', 'At the front focal plane', 'At the rear focal plane of the lens, behind it', 'At the sensor'], a: 2, why: 'Its image seen from the front, the entrance pupil, must be at infinity; that is so when the stop is at the rear focal plane. The chief rays are then parallel to the axis in front of the lens.' },
    { q: 'A telecentric lens eliminates the blur of objects that are out of focus.', a: false, why: 'Blur grows with defocus as in any lens. What stays fixed is the size of the image and the centre of the blur.' },
    { q: 'A telecentric lens has a telecentric error of 0.2°. A part is 2 mm out of its plane. How far does an edge appear to shift, in micrometres?', answer: 6.98, unit: 'µm', why: '$\\Delta x = \\Delta z\\tan\\varepsilon = 2\\ \\mathrm{mm}\\times\\tan0.2° = 6.98\\ \\mu\\mathrm{m}$.' },
    { q: 'The entrance pupil of an ordinary lens is 500 mm from a part, which is moved 5 mm nearer. About how much larger does its image become, in per cent?', answer: 1, why: '$\\Delta z/z_0 = 5/500 = 1\\ \\%$ (1.01 % to be exact).' },
    { q: 'Which kind of telecentric lens needs a front element larger than the object it views?', choices: ['Only a double-telecentric lens with a stop', 'Image-space telecentric', 'None: only the rear lens is large', 'Object-space telecentric'], a: 3, why: 'In front of an object-space telecentric lens the chief rays run parallel to the axis, so every point of the field must send a chief ray through the glass: the front element has to cover the whole object (plus the cone).' }
  ],
  applications: [
    'Dimensional measurement by machine vision: diameters, lengths, positions of edges and holes, in which perspective would otherwise change the reading.',
    'Silhouette measurement of shafts, screws and extrusions against a telecentric backlight.',
    'Photolithography: projection lenses are telecentric at the wafer so that small height errors do not change what is printed.',
    'Cameras and sensors: image-space (near-)telecentric designs keep the light normal to the pixels, which reduces colour shading with microlenses.',
    'Measuring microscopes and optical comparators, in which a projected profile is compared with a drawing.'
  ],
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 — the position of the stop and the telecentric condition.',
    'A. Hornberg (ed.), *Handbook of Machine and Computer Vision* — the sections on optics and telecentric lenses for measurement.',
    'B. Jähne, *Practical Handbook on Image Processing for Scientific and Technical Applications* — the section on telecentric imaging.'
  ],
  sim: 'px-telecentric'
},

/* ================================================================ depth of focus */
{
  id: 'depth-of-focus', parent: 'paraxial-systems', title: 'Depth of focus', level: 2,
  short: 'Depth of focus is how far the image plane can move before the picture becomes too blurred: ±N·c, with N the f-number and c the blur you can accept. Light puts a floor under it: diffraction allows no better than ±2λN², the quarter-wave tolerance of Rayleigh. It is the image-side partner of the depth of field.',
  keywords: ['depth of focus', 'focus tolerance', 'defocus', 'permissible blur', 'circle of confusion', 'quarter-wave', 'Rayleigh criterion', 'sensor position tolerance', 'back focus tolerance', 'autofocus accuracy', 'focal depth', 'longitudinal tolerance', '2 lambda N squared', 'N c'],
  prereq: ['the-f-number', 'circle-of-confusion', 'the-airy-disk'],
  related: ['depth-of-field', 'lens-adapters-and-back-focus', 'c-mount', 'diffraction-limited-mtf', 'focusing-a-lens', 'autofocus-methods', 'strehl-ratio-and-diffraction-limited', 'sensor-formats-and-pixel-size'],
  body: `
A lens focuses a point of the scene to a point at only one distance behind it. Move the sensor a little nearer or farther and the point becomes a disc, the **blur circle**. How far may it move before the picture is noticeably softer? That tolerance is the **depth of focus**.

### The geometry: ± N·c
Behind the lens the light converges in a cone of half-angle $\\theta'$ with $\\tan\\theta' = 1/(2N)$. A sensor a distance $\\delta$ from the focus cuts the cone in a disc of diameter $b = \\delta/N$. If the largest blur you accept is $c$ — one pixel, two, or the circle of confusion of the format — then

$$\\delta = \\pm N\\,c,\\qquad \\text{total depth} = 2Nc$$

For $c = 5$ µm:

| f-number | 1.4 | 2.8 | 5.6 | 11 | 22 |
|---|---|---|---|---|---|
| ± N c (µm) | 7 | 14 | 28 | 55 | 110 |
| ± 2 λ N² at 550 nm (µm) | 2.2 | 8.6 | 34.5 | 133 | 532 |

Fast lenses and small pixels give tiny tolerances. An f/1.4 lens on 3.45 µm pixels allows ±5 µm — the reason for the back-focus adjustment of a [[c-mount|C-mount]] camera. A phone camera at f/1.8 with 1 µm pixels needs its lens positioned to ±1.8 µm. A sensor 12 mm wide that is tilted by 0.1° has one edge 21 µm farther from the lens than the other. Close up, $N$ is replaced by the working f-number $N(1+m)$.

### The wave limit: ± 2λN²
Light cannot be focused into a point, so geometry is not the whole story. A defocus $\\delta$ puts a path error at the edge of the beam of $\\delta/(8N^2)$. **Rayleigh's quarter-wave rule** — an error under $\\lambda/4$ is hardly seen — gives

$$\\delta = \\pm 2\\lambda N^2$$

At 550 nm that is ±8.6 µm at f/2.8, ±70 µm at f/8 and ±530 µm at f/22. Setting $Nc = 2\\lambda N^2$ shows where the two meet: $N = c/2\\lambda$, about f/4.5 for $c = 5$ µm. Faster than that the ray tolerance is the stricter; slower, the wave tolerance is, and the image is already limited by the Airy disc ([[the-airy-disk]]).

### Depth of focus and depth of field
They are the same tolerance seen from two sides of the lens. A displacement $\\delta$ of the image corresponds to $\\delta/m^2$ in the scene (the longitudinal magnification is $m^2$), so the **depth of field** is about the depth of focus divided by $m^2$ ([[depth-of-field]]). The scene's depth matters to the photographer; the sensor's position matters to the camera's designer.

> [!key] The sensor may stray ±N·c from the focus before the blur exceeds c; diffraction sets a floor of ±2λN². Depth of focus is about the camera's distances and tolerances; depth of field is its counterpart in the scene.
`,
  ideas: [
    'The cone behind the lens has tan θ′ = 1/(2N), so a sensor δ out of focus sees a blur of δ/N.',
    'The depth of focus is ±N·c for an accepted blur c: it grows with the f-number and shrinks with the pixel size.',
    'Diffraction sets a second tolerance, ±2λN² (Rayleigh\'s quarter-wave rule), which is the larger one above N ≈ c/2λ.',
    'Close up, N is replaced by the working f-number N(1 + m).',
    'The depth of field is about the depth of focus divided by m².'
  ],
  pitfalls: [
    'Depth of focus and depth of field are the same thing — They are the tolerance on opposite sides of the lens — in the image space and in the scene — related by the longitudinal magnification m².',
    'Stopping down gains depth of focus at no cost — The tolerance grows, but so does the diffraction blur (2.44 λ N across): beyond about f/4–f/8 on small pixels the image is soft however well focused.',
    'Depth of focus is a property of the lens alone — It also depends on c, the blur you will accept: a pixel of 1 µm or of 10 µm gives a ten times different answer.',
    'The quarter-wave tolerance is a precise limit — It is a criterion of "hardly any visible change", not a sharp edge: the image loses contrast smoothly with defocus.'
  ],
  terms: [
    { term: 'Depth of focus', also: ['focal depth', 'focus tolerance', 'image-side depth'], def: 'The distance through which the image plane can be moved while the blur stays below an accepted value: ±N·c geometrically. Not to be confused with depth of field, which is in the scene (and often also abbreviated DOF).' },
    { term: 'Defocus', def: 'The distance by which the sensor (or the image plane) lies from the plane of best focus. It makes every point a blur circle of diameter δ/N.' },
    { term: 'Permissible blur', also: ['acceptable blur', 'c', 'circle of confusion'], def: 'The largest blur diameter c that is tolerated: a pixel, two pixels, or d/1500 of the sensor diagonal for general photography.' },
    { term: 'Quarter-wave rule', also: ['Rayleigh criterion for defocus', 'λ/4 tolerance'], def: 'Rayleigh\'s rule that a wave aberration smaller than a quarter of a wavelength changes the image little. For defocus it gives the diffraction depth of focus ±2λN².' },
    { term: 'Blur circle', also: ['blur disc', 'defocus blur'], def: 'The disc into which a point is spread when the sensor is out of focus; its diameter is the defocus divided by the f-number.' }
  ],
  formulas: [
    {
      name: 'Geometric depth of focus',
      expr: 'dz = N*c', tex: '\\delta = \\pm N\\,c',
      vars: {
        dz: { name: 'distance the sensor may move (each side)', q: 'length', unit: 'µm', tex: '\\delta' },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 },
        c: { name: 'blur you accept', q: 'length', unit: 'µm', value: 5 }
      },
      note: 'The total depth of focus is twice this.',
      stories: { dz: 'A lens at f/{N} is used with pixels {c} across, and one pixel of blur is accepted. How far may the sensor move?', c: 'A camera sensor may be {dz} out of position at f/{N}. What blur does this permit?' }
    },
    {
      name: 'Depth of focus in close-up',
      expr: 'dz = N*(1 + m)*c', tex: '\\delta = \\pm N\\,(1 + m)\\,c',
      vars: {
        dz: { name: 'distance the sensor may move (each side)', q: 'length', unit: 'µm', tex: '\\delta' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 },
        m: { name: 'magnification (positive)', value: 1, min: 0, max: 20 },
        c: { name: 'blur you accept', q: 'length', unit: 'µm', value: 5 }
      },
      note: 'The working f-number of a lens with equal pupils; at 1:1 the tolerance is doubled.'
    },
    {
      name: 'Diffraction depth of focus (quarter-wave)',
      expr: 'dz = 2*lambda*N^2', tex: '\\delta = \\pm 2\\lambda N^2',
      vars: {
        dz: { name: 'defocus that costs a quarter of a wavelength', q: 'length', unit: 'µm', tex: '\\delta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      stories: { dz: 'In light of {lambda}, what defocus at f/{N} produces a quarter-wave of error at the edge of the beam?' }
    },
    {
      name: 'Diffraction depth of focus from the numerical aperture',
      expr: 'dz = n*lambda/(2*NA^2)', tex: '\\delta = \\pm\\frac{n\\lambda}{2\\,\\mathrm{NA}^2}',
      vars: {
        dz: { name: 'depth of focus (each side)', q: 'length', unit: 'nm', tex: '\\delta' },
        n: { name: 'refractive index of the medium', value: 1, min: 1, max: 2.5 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 0.5, min: 0.02, max: 1.6, tex: '\\mathrm{NA}' }
      },
      note: 'The same quarter-wave rule in the language of microscopy; for NA = 1/(2N) in air it is 2λN².'
    }
  ],
  examples: [
    {
      title: 'A machine-vision camera',
      q: 'A camera has 3.45 µm pixels and its lens is set to f/2.8. How far may its sensor lie from the focus, accepting one pixel of blur? What f-number would tolerate an error of 50 µm — and what would diffraction do there?',
      steps: [
        { text: 'The tolerance:', tex: '\\delta = N\\,c = 2.8\\times3.45 = 9.7\\ \\mu\\mathrm{m}' },
        { text: 'For ±50 µm:', tex: 'N = \\frac{50}{3.45} = 14.5' },
        { text: 'At f/14.5 the Airy disc is $2.44\\times0.55\\times14.5 = 19\\ \\mu$m across.' }
      ],
      a: '±9.7 µm at f/2.8. To tolerate ±50 µm the lens would need f/14.5 — but then the Airy disc is 19 µm, more than five pixels, and the image is soft from diffraction. The remedy is a better-held sensor, not a smaller aperture.'
    },
    {
      title: 'Ray against wave',
      q: 'For c = 6 µm in green light (550 nm), compare the geometric and the diffraction depth of focus at f/4 and at f/16.',
      steps: [
        { text: 'f/4: geometric $4\\times6 = 24\\ \\mu$m; wave $2\\times0.55\\times16 = 17.6\\ \\mu$m.' },
        { text: 'f/16: geometric $16\\times6 = 96\\ \\mu$m; wave $2\\times0.55\\times256 = 282\\ \\mu$m.' }
      ],
      a: 'At f/4 the wave tolerance (±17.6 µm) is tighter than the geometric one (±24 µm); at f/16 it is looser (±282 µm against ±96 µm). The crossover is near f/4.5 — and at f/16 the Airy disc itself (21 µm across) is already larger than c, so the picture is diffraction-limited whatever the focus.'
    }
  ],
  quiz: [
    { q: 'Which f-number gives the largest depth of focus, other things equal?', choices: ['f/1.4', 'f/4', 'f/8', 'f/16'], a: 3, why: 'The depth of focus ±N·c is proportional to the f-number: f/16 gives eleven times the tolerance of f/1.4 (until diffraction blurs the image).' },
    { q: 'A lens at f/4 is used with an accepted blur circle of 10 µm. How far may the sensor move from the focus in either direction, in micrometres?', answer: 40, unit: 'µm', why: '$\\delta = Nc = 4\\times10 = 40$ µm.' },
    { q: 'For c = 5 µm and green light, diffraction (±2λN²) allows more defocus than geometry (±N c) from about f/4.5 onward.', a: true, why: 'Setting $Nc = 2\\lambda N^2$ gives $N = c/2\\lambda = 5/1.1 = 4.5$. Above that the wave tolerance is the larger.' },
    { q: 'A camera is focused on a subject at magnification m = 0.1. About how does the depth of field (in the scene) compare with the depth of focus (at the sensor)?', choices: ['It is 10 times larger', 'It is 100 times larger', 'It is the same', 'It is 10 times smaller'], a: 1, why: 'A displacement δ at the image corresponds to δ/m² in the scene: 1/0.01 = 100.' },
    { q: 'What defocus, in micrometres, produces a quarter-wave error at f/8 in light of 550 nm?', answer: 70.4, unit: 'µm', why: '$2\\lambda N^2 = 2\\times0.55\\times64 = 70.4$ µm.' }
  ],
  applications: [
    'Camera design: the tolerance on the flange distance, the sensor\'s flatness and tilt, and the thermal drift of the lens are all set by ±N·c.',
    'Phone cameras: the voice-coil autofocus and the active alignment of the lens module are accurate to a micrometre or two.',
    'Machine vision: choosing the f-number to tolerate part-height variations without losing resolution to diffraction.',
    'Photolithography and microscopy: the depth of focus ±nλ/2NA² shrinks as the NA rises, so flatter wafers and thinner specimens are needed.',
    'Telescopes and collimators: the focuser must be positioned within ±2λN² of the focal plane for a diffraction-limited image.'
  ],
  history: 'Lord Rayleigh stated the quarter-wave criterion in 1879, in his study of the optics of the spectroscope: an aberration of less than a quarter of a wavelength leaves the image practically unchanged. Applied to defocus, it gives the diffraction depth of focus used today.',
  sources: [
    'M. Born and E. Wolf, *Principles of Optics* — the chapter on the diffraction theory of aberrations: the tolerance on defocus and the quarter-wave rule.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 — depth of focus and the f-number.',
    'Lord Rayleigh, "Investigations in optics, with special reference to the spectroscope", *Philosophical Magazine* 8 (1879) — the quarter-wavelength criterion.',
    'R. Kingslake, *Optics in Photography* (SPIE, 1992) — depth of focus and the tolerance on the sensor position.'
  ],
  sim: 'px-dof'
}

);
